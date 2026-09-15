import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {validateBatchAgreement, validateTestcaseBatch, validateWorkbookExportPaths, authorizeWorkbookExport, summarizeBatchCoverage, requireDeliverySatisfied, saveNewWorkbook} from './validate-testcase-delivery.mjs';
import {startTask, startStage, finishStage, finishTask, readMetrics, requiredStages} from './pipeline-metrics.mjs';
import {textUnits, seedCoverage, reviewHash, validateCoverage} from './requirement-traceability.mjs';

test('三端必须齐全、同项目、同需求版本和同共享状态，不能各自通过后直接拼接', async () => {
  const batch = {schemaVersion:'1.0',项目目录:'project',目标端:['用户App','公会App','管理后台'],交付要求:'完整覆盖',
    端任务:['user','guild','admin'].map((name,index)=>({端名:['用户App','公会App','管理后台'][index],任务目录:`work/batch/${name}`}))};
  const manifests = batch.端任务.map(item=>({项目目录:'project',项目名称:'示例项目',最终用例JSON:`${item.任务目录}/final.json`,任务工作目录:item.任务目录,目标范围:{端名:item.端名},
    状态转换基线:`${item.任务目录}/states.json`,MainBasis基线:{路径:'work/project-mainbasis/latest.json','SHA-256':'a'.repeat(64)}}));
  const states = manifests.map(()=>({状态转换:[{状态转换标识:'T1',共同业务对象:'申请',来源状态:'未申请',目标状态:'待审核',操作端:'用户App',观察端:['管理后台']}]}));
  assert.doesNotThrow(()=>validateBatchAgreement(batch,manifests,states));
  const missing = structuredClone(batch); missing.端任务.pop();
  assert.throws(()=>validateBatchAgreement(missing,manifests,states),/全部目标端/);
  const duplicate = structuredClone(batch); duplicate.端任务[1]=duplicate.端任务[0];
  assert.throws(()=>validateBatchAgreement(duplicate,manifests,states),/全部目标端/);
  const different = structuredClone(manifests); different[2].MainBasis基线['SHA-256']='b'.repeat(64);
  assert.throws(()=>validateBatchAgreement(batch,different,states),/不同 MainBasis/);
  const lost = structuredClone(states); lost[2].状态转换=[];
  assert.throws(()=>validateBatchAgreement(batch,manifests,lost),/共享状态/);
  const wrongRole = structuredClone(manifests); wrongRole[1].目标范围.端名='用户App';
  assert.throws(()=>validateBatchAgreement(batch,wrongRole,states),/项目、端或任务目录/);
  const withModules=structuredClone(batch); withModules.端任务.forEach(item=>{item.模块名称='全部模块';});
  const scoped=structuredClone(manifests); scoped.forEach(item=>{item.目标范围.模块名称='全部模块';});
  assert.doesNotThrow(()=>validateBatchAgreement(withModules,scoped,states));
  scoped[0].目标范围.模块名称='直播';
  assert.throws(()=>validateBatchAgreement(withModules,scoped,states),/模块范围/);
  const root = await fs.mkdtemp(path.join(os.tmpdir(),'batch-gate-'));
  try {
    for (const [index,item] of batch.端任务.entries()) {
      await fs.mkdir(path.join(root,item.任务目录),{recursive:true});
      await fs.writeFile(path.join(root,item.任务目录,'generation-input-manifest.json'),JSON.stringify(manifests[index]));
      await fs.writeFile(path.join(root,manifests[index].状态转换基线),JSON.stringify(states[index]));
    }
    const file = path.join(root,'work/batch/batch.json');
    batch.端任务.forEach(item => {item.工作簿 = `outputs/示例项目-case/${item.端名}.xlsx`;});
    await fs.writeFile(file,JSON.stringify(batch));
    const task = path.dirname(file);
    await startTask(task);
    // Agreement is insufficient: the real input/delivery gates must still execute.
    await assert.rejects(validateTestcaseBatch(file,root),/schemaVersion 必须为 1.0/);
    const userTask = path.join(root,'work/batch/user'), source = path.join(userTask,'final.json');
    const output = path.join(root,batch.端任务[0].工作簿);
    await assert.rejects(authorizeWorkbookExport(userTask,root,source,output),/schemaVersion 必须为 1.0/);
    await assert.rejects(authorizeWorkbookExport(userTask,root,source,output+'other.xlsx'),/批次登记/);
    for (const stage of requiredStages) {await startStage(task,stage); await finishStage(task,stage);}
    await assert.rejects(finishTask(task,root),/delivery-verification/);
    assert.equal((await readMetrics(task)).任务.状态,'进行中');
    assert.equal((await readMetrics(task)).任务.结束时间,undefined);
    const lowered = structuredClone(batch); lowered.交付要求='允许部分交付';
    await fs.writeFile(file,JSON.stringify(lowered));
    await assert.rejects(validateTestcaseBatch(file,root),/不得自行降低/);
    const old = structuredClone(batch); old.端任务[0].任务目录='work/old/user';
    await fs.writeFile(file,JSON.stringify(old));
    await assert.rejects(validateTestcaseBatch(file,root),/批次范围/);
  } finally { await fs.rm(root,{recursive:true,force:true}); }
});

test('导出只能使用登记的最终 JSON，不能覆盖既有文件或并发抢占的文件',async()=>{
  const root = await fs.mkdtemp(path.join(os.tmpdir(),'workbook-publication-'));
  try {
    const task=path.join(root,'work/current'), destination=path.join(root,'outputs/示例项目-case/用户App-登录-260914-001.xlsx');
    await fs.mkdir(task,{recursive:true}); await fs.mkdir(path.dirname(destination),{recursive:true});
    await fs.writeFile(path.join(task,'generation-input-manifest.json'),JSON.stringify({项目名称:'示例项目',最终用例JSON:'work/current/final.json'}));
    await validateWorkbookExportPaths(task,root,path.join(task,'final.json'),destination);
    await fs.writeFile(path.join(task,'generation-input-manifest.json'),JSON.stringify({项目名称:'示例项目',最终JSON:'work/current/final.json'}));
    await validateWorkbookExportPaths(task,root,path.join(task,'final.json'),destination);
    await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'other.json'),destination),/登记的最终/);
    await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'final.json'),path.join(root,'outputs/其他项目-case/new.xlsx')),/当前项目固定/);
    const stageOutput = path.join(root,'outputs/示例项目-case/阶段性-用户App.xlsx');
    await validateWorkbookExportPaths(task,root,path.join(task,'final.json'),stageOutput,{stage:true});
    await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'final.json'),destination,{stage:true}),/阶段性工作簿/);
    await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'final.json'),stageOutput),/正式导出不得/);
    await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'final.json'),path.join(task,'stage-exports/阶段性-用户App.xlsx'),{stage:true}),/当前项目固定/);
    for (const stage of [false,true]) {
      const name = `${stage?'阶段性-':''}用户App.xlsx`;
      for (const folder of ['outputs/其他项目-case','outputs/示例项目-case/current']) {
        await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'final.json'),path.join(root,folder,name),{stage}),/当前项目固定/);
      }
    }
    const artifact={save:async file=>fs.writeFile(file,'new fixture workbook')};
    await saveNewWorkbook(artifact,destination);
    assert.equal(await fs.readFile(destination,'utf8'),'new fixture workbook');
    await assert.rejects(validateWorkbookExportPaths(task,root,path.join(task,'final.json'),destination),/禁止覆盖/);
    await assert.rejects(saveNewWorkbook({save:async file=>fs.writeFile(file,'replacement')},destination),/EEXIST/);
    assert.equal(await fs.readFile(destination,'utf8'),'new fixture workbook');
    assert.deepEqual(await fs.readdir(path.dirname(destination)),[path.basename(destination)]);
    const blocked = path.join(path.dirname(destination),'blocked.xlsx');
    await assert.rejects(saveNewWorkbook(artifact,blocked,async()=>{throw new Error('输入在导出期间变化');}),/导出期间变化/);
    await assert.rejects(fs.stat(blocked),/ENOENT/);
    assert.deepEqual(await fs.readdir(path.dirname(destination)),[path.basename(destination)]);
  } finally {await fs.rm(root,{recursive:true,force:true});}
});

test('源条款、分支和转换缺口决定继续或等待；有效用例通过不等于满足完整要求',()=>{
  const units = textUnits('MainBasis/需求.md','提交后生成申请');
  const report = seedCoverage(units), contract = {前置条件:['尚未申请'],操作步骤:['点击提交'],预期结果:['生成申请']};
  Object.assign(report.逐项[0],{状态:'部分覆盖',说明:'成功分支已设计，限制规则待确认',分支:[
    {标识:'B1',状态:'已设计',说明:'提交成功',来源片段:'提交后生成申请',执行角色:'用户',目标端:'用户App',入口:'申请页',场景标识:'S1',用例编号:'C1',用例契约:contract},
    {标识:'B2',状态:'待确认',说明:'限制规则缺少业务决定',问题编号:'Q1'},
  ]});
  const evaluate = () => {
    report.语义复核={说明:'合成需求及缺口复核',内容SHA256:reviewHash(report)};
    return validateCoverage(units,report,{phase:'final',cases:[{用例编号:'C1',...contract}],questions:[{问题编号:'Q1'}]});
  };
  const batch = {交付要求:'完整覆盖'};
  let coverage = evaluate();
  let result = summarizeBatchCoverage(batch,[{端名:'用户App',需求覆盖:coverage}]);
  assert.equal(result.后续动作,'等待业务确认');
  assert.throws(()=>requireDeliverySatisfied(result),/不得标记任务完成/);
  report.逐项[0].分支.push({标识:'B3',状态:'未覆盖',说明:'明确的另一分支尚未设计'});
  coverage = evaluate();
  result = summarizeBatchCoverage(batch,[{端名:'用户App',需求覆盖:coverage}]);
  assert.equal(result.后续动作,'继续补齐生成缺口');
  assert.equal(result.未完成项.find(item=>item.分支标识==='B3').来源标识,units[0].标识);
  const partial = summarizeBatchCoverage({交付要求:'允许部分交付'},[{端名:'用户App',需求覆盖:coverage}]);
  assert.doesNotThrow(()=>requireDeliverySatisfied(partial));
  assert.equal(partial.交付性质,'部分覆盖');
  report.逐项[0].分支.splice(1); report.逐项[0].状态='已覆盖'; report.交付性质='完整覆盖';
  coverage = evaluate();
  assert.doesNotThrow(()=>requireDeliverySatisfied(summarizeBatchCoverage(batch,[{端名:'用户App',需求覆盖:coverage}])));
  coverage.交付性质='部分覆盖'; coverage.未完成项=[{状态转换标识:'T1',状态:'未覆盖',说明:'另一观察端未映射'}];
  assert.equal(summarizeBatchCoverage(batch,[{端名:'管理后台',需求覆盖:coverage}]).后续动作,'继续补齐生成缺口');
});
