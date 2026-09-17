import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {extractPrototypeDirectory, renderModuleSection, readModuleDirectory, moduleSection, validateModuleAssignment} from './prototype-directory.mjs';
import {startMainBasis, prepareContext, reviewContext, prepareBasis, sealMainBasis, verifyMainBasis, validateMainBasisInput} from './mainbasis.mjs';
import {fingerprint, reviewHash} from './requirement-traceability.mjs';
import {casesFromCatalog, ruleDesignHash} from './testcase-design.mjs';

const index = `
const userPages = [{file:'login.html',title:'登录',type:'mobile'},{file:'wallet.html',title:'余额',type:'mobile'}];
const guildPages = [{file:'guild.html',title:'主播列表',type:'mobile'}];
const adminPages = [{file:'admin.html',title:'主播列表',type:'desktop'},{file:'detail.html',title:'主播详情',type:'desktop'}];
const guildPageGroups = [{title:'主播管理',pageFiles:['guild.html']}];
const adminPageGroups = [{title:'主播管理',pageFiles:['admin.html'],allFiles:['admin.html','detail.html']}];
const pagePaths = {'login.html':'user/login.html','wallet.html':'user/wallet.html','guild.html':'guild/list.html','admin.html':'admin/list.html','detail.html':'admin/detail.html'};
const staticPageViews = {'login.html':[{title:'空态',file:'virtual.html'}]};
function addUserTree(expanded) { const groups = [['系统入口',['login.html']],['钱包与账单',['wallet.html']]]; }
`;
const source='project/prototype/index.html';
const reviewed = report => ({...report,语义复核:{说明:'合成夹具逐项传递；不代表任何真实业务审核',内容SHA256:reviewHash(report)}});

test('目录按端和原型分组提取，详情保留、同页视图不冒充页面，异常声明不执行',()=>{
  const directory=extractPrototypeDirectory(index,source);
  assert.equal(directory.页面.length,5);
  assert.equal(directory.页面.find(row=>row.页面名称==='主播详情').登记方式,'关联详情页');
  assert.deepEqual(readModuleDirectory(renderModuleSection(directory)),directory);
  assert.throws(()=>extractPrototypeDirectory(index.replace("['wallet.html']","['login.html','wallet.html']"),source),/重复归组/);
  assert.throws(()=>extractPrototypeDirectory(index.replace(",['钱包与账单',['wallet.html']]",''),source),/未归组/);
  assert.throws(()=>extractPrototypeDirectory(index.replace("'user/login.html'","'../escape.html'"),source),/越界/);
  assert.throws(()=>extractPrototypeDirectory(index.replace("title:'登录'","title:process.exit()"),source),/只允许/);
});

test('模块归属绑定本端观察页面；公共规则可归属实际页面，编号按模块连续',()=>{
  const directory=extractPrototypeDirectory(index,source), scope={端名:'用户App',模块名称:'全部模块'};
  const rule=(moduleName,page,n)=>{
    const value={稳定规则标识:`R${n}`,功能模块:moduleName,功能结构:'提交',可生成正式用例:true,模块归属说明:'通过当前页面观察业务结果',必要条件:['已准备有效账号'],目标状态或可观察结果:'申请进入待审核',证据引用:[],用例设计:{观察页面路径:page,场景:'提交申请',验证子项:'申请状态',用例类型:'功能需求',优先级:'P1',优先级依据:'申请进入审核是后续处理的必要入口',步骤:[{操作:'点击提交'}]}};
    value.设计复核={状态:'通过',设计SHA256:ruleDesignHash(value)}; return value;
  };
  const rules=[rule('系统入口','project/prototype/pages/user/login.html',1),rule('钱包与账单','project/prototype/pages/user/wallet.html',2),rule('系统入口','project/prototype/pages/user/login.html',3)];
  assert.doesNotThrow(()=>validateModuleAssignment(directory,scope,rules,[{问题编号:'Q1',功能模块:'待映射'}]));
  const wrong=structuredClone(rules); wrong[0].功能模块='钱包与账单';
  assert.throws(()=>validateModuleAssignment(directory,scope,wrong),/实际观察页面/);
  const crossEnd=rule('主播管理','project/prototype/pages/admin/list.html',4);
  assert.throws(()=>validateModuleAssignment(directory,{端名:'公会App',模块名称:'全部模块'},[crossEnd]),/实际观察页面/);
  assert.throws(()=>validateModuleAssignment(directory,{...scope,模块名称:'钱包与充值'},rules),/目录之外/);
  const catalog={目标范围:scope,规则:rules};
  const cases=casesFromCatalog(catalog,{moduleDirectory:directory});
  assert.deepEqual(cases.map(row=>row.用例编号),['USER-01-0001','USER-02-0001','USER-01-0002']);
  assert.deepEqual(cases.map(row=>row.序号),[1,2,3]);
  rules[0].功能模块='钱包与账单';
  assert.throws(()=>casesFromCatalog(catalog,{moduleDirectory:directory}),/复核已失效/);
});

test('首次自动建目录、不变不重写；context 回读后传入 MainBasis，候选不读取第三份目录',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'prototype-module-flow-'));
  const save=async(file,value)=>{await fs.mkdir(path.dirname(path.join(root,file)),{recursive:true});await fs.writeFile(path.join(root,file),typeof value==='string'?value:JSON.stringify(value));};
  const read=async file=>JSON.parse(await fs.readFile(path.join(root,file),'utf8'));
  const policy={来源策略:'prototype-primary',原型目录:'prototype',生成前同步:true,用例生成模式:'全新生成',历史比较:false,派生需求清单:['context/需求.md','context/目录.md'],原型目录结构:{入口:'prototype/index.html',输出:'context/目录.md'},MainBasis:{生成前更新:true,正式需求:'MainBasis/需求.md',风险清单:'MainBasis/风险.md'}};
  try {
    for(const file of ['AGENTS.md','Cem Kaner.txt','全局证据扫描指令.md','原型与需求清单同步指令.md','流程追溯文件说明.md','scripts/mainbasis.mjs','scripts/requirement-traceability.mjs','scripts/prototype-directory.mjs']) await save(file,'synthetic-workflow');
    await save('project/需求来源策略.json',policy); await save(source,index);
    const directory=extractPrototypeDirectory(index,source);
    for(const row of directory.页面) await save(row.页面路径,'<p>合成页面</p>');
    await save('project/context/需求.md','提交后生成申请'); await save('project/MainBasis/需求.md','提交后生成申请\n'); await save('project/MainBasis/风险.md','Q1 待确认规则');
    await startMainBasis(root,'project','work/first');
    assert.equal((await read('work/first/prototype-directory-sync.json')).修改前原文,null);
    const stamp=(await fs.stat(path.join(root,'project/context/目录.md'))).mtimeMs;
    await startMainBasis(root,'project','work/unchanged');
    assert.equal((await read('work/unchanged/prototype-directory-sync.json')).有变化,false);
    assert.equal((await fs.stat(path.join(root,'project/context/目录.md'))).mtimeMs,stamp);
    const start=await read('work/first/mainbasis-start.json');
    await save('work/first/global-evidence-scan-result.json',{扫描状态:'通过',阻塞项:[],文件清单:start.上游});
    await prepareContext(root,'project','work/first');
    const complete=async(name,unitsFile)=>{
      const report=await read(`work/first/${name}`),units=await read(`work/first/${unitsFile}`);
      for(const row of report.逐项) Object.assign(row,{去向:'已同步',说明:'仅验证合成数据传递及版本绑定',目标标识:units.目标.map(unit=>unit.标识)});
      await save(`work/first/${name}`,reviewed(report));
    };
    await complete('context-transfer.json','context-units.json'); await reviewContext(root,'project','work/first');
    await prepareBasis(root,'project','work/first');
    const formal=await fs.readFile(path.join(root,'project/MainBasis/需求.md'),'utf8');
    assert.ok(formal.startsWith('提交后生成申请\n'));
    assert.equal(moduleSection(formal),renderModuleSection(directory));
    assert.equal(await fs.readFile(path.join(root,'project/MainBasis/风险.md'),'utf8'),'Q1 待确认规则');
    await complete('mainbasis-transfer.json','mainbasis-units.json');
    const targets=[...start.上游.filter(file=>policy.派生需求清单.some(name=>file.路径===`project/${name}`)),...start.文档];
    await save('work/first/prototype-context-sync-result.json',{同步状态:'通过',阻塞异常:[],需求清单变更日志编号:['合成记录'],文件核对:await Promise.all(targets.map(async file=>({路径:file.路径,修改前SHA256:file['SHA-256'],修改后SHA256:fingerprint(await fs.readFile(path.join(root,file.路径))),核对说明:'合成文件前后核对'}))),MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',上游指纹:fingerprint(start.上游),复核说明:'合成需求传递',待确认问题:['Q1'],来源映射:[{来源路径:'project/context/需求.md',来源SHA256:fingerprint('提交后生成申请'),来源位置:'第1行',目标路径:'project/MainBasis/需求.md',目标原文:'提交后生成申请'}]}});
    await sealMainBasis(root,'project','work/first');
    const valid=await verifyMainBasis(root,'project');
    const manifest={项目目录:'project',历史策略:'不读取不比较',MainBasis基线:{路径:valid.config.baseline,'SHA-256':valid.基线SHA256},输入文件:valid.baseline.文档.map((file,i)=>({...file,角色:i?'风险与缺口':'当前业务证据',允许定义业务规则:!i}))};
    const originalRead=fs.readFile;
    fs.readFile=async(file,...args)=>{
      if (args[0]==='utf8' && [source,'project/context/目录.md'].some(name=>String(file).endsWith(name))) throw new Error('候选阶段不允许语义回读原型目录');
      return originalRead(file,...args);
    };
    try {assert.equal((await validateMainBasisInput(root,manifest)).moduleDirectory.页面.length,5);}
    finally {fs.readFile=originalRead;}
    await assert.rejects(validateMainBasisInput(root,{...manifest,输入文件:[...manifest.输入文件,{路径:'project/context/目录.md',角色:'执行工具'}]}),/不得额外输入/);
    await save(source,index.replace("title:'登录'","title:'新的登录名称'"));
    await assert.rejects(verifyMainBasis(root,'project'),/上游文件/);
    await fs.unlink(path.join(root,'project/context/目录.md'));
    await fs.symlink('需求.md',path.join(root,'project/context/目录.md'));
    await assert.rejects(startMainBasis(root,'project','work/symlink'),/输出不是普通文件/);
    assert.equal(await fs.readFile(path.join(root,'project/context/需求.md'),'utf8'),'提交后生成申请');
  } finally {await fs.rm(root,{recursive:true,force:true});}
});
