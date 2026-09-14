import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {root,task,formal,risks,parse,save} from './prepare.mjs';
import {validateGenerationInput} from '../../scripts/validate-generation-input.mjs';
import {validateTestcaseJson} from '../../scripts/validate-testcase-json.mjs';
const digest=x=>crypto.createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const sha=async p=>digest(await fs.readFile(p));
const relative=p=>path.relative(root,p);
const read=async p=>JSON.parse(await fs.readFile(path.join(task,p),'utf8'));
const now=()=>new Date().toISOString();
const b=await parse(), baseline=await read('source-baseline.json');
assert.deepEqual(b.sourceHashes,baseline.sourceHashes,'MainBasis已变化，需重建独立基线');
const frozen=await read('independent-scenario-baseline.json');
assert.equal(frozen.历史读取次数,0);
const stableHash=await sha(path.join(task,'independent-scenario-baseline.json'));
const summaries=[];
const entry=async(file,role,type,allowed=false,extra={})=>({路径:relative(file),'SHA-256':await sha(file),角色:role,内容类型:type,允许定义业务规则:allowed,...extra});
const compact=s=>String(s).replace(/[\s，。、“”‘’]/gu,'');
const historyStart=now();
for(const [end,dir] of [['用户App','user'],['公会App','guild'],['管理后台','admin']]){
 const current=await read(`${dir}/candidate.json`),catalog=await read(`${dir}/business-rule-catalog.json`),manifest=await read(`${dir}/generation-input-manifest.json`);
 const baselineIds=new Set(frozen.场景.map(s=>s.规则));
 for(const rule of catalog.规则.filter(r=>r.可生成正式用例)){
  assert(baselineIds.has(rule.稳定规则标识));
  assert(rule.证据引用.every(e=>e.路径===formal),'风险文档或历史文本混入确定性预期');
 }
 const folder=path.join(root,'work/liveshow-three-end-all-260911-001',dir);
 const name=(await fs.readdir(folder)).find(n=>n.includes('测试用例')&&n.endsWith('.json'));
 const file=path.join(folder,name),past=JSON.parse(await fs.readFile(file,'utf8'));
 const comparison=[];
 for(const old of past.测试用例){
  const page=old.备注.find(n=>n.startsWith('页面：'))?.slice(3);
  const oldConditions=(old.前置条件||[]).filter(x=>!/账号已登录且具备当前页面权限/u.test(x));
  const matches=oldConditions.length?current.测试用例.filter(c=>compact(c.预期结果[0])===compact(old.预期结果[0])&&c.功能结构===old.功能结构&&oldConditions.every(p=>c.前置条件.some(x=>compact(x)===compact(p)))):[];
  comparison.push({历史输入路径:relative(file),历史用例编号:old.用例编号,当前稳定规则标识:matches.length?matches.map(c=>c.备注.find(n=>n.startsWith('规则：')).slice(3)):[`BR-MB-${dir}-HISTORY-REVIEW`],判定:matches.length?'需要重写':'待人工复核',差异:matches.length?['相同角色、必要条件和结果命中本次独立场景，按当前来源重写操作与追溯']:['没有建立条件和结果均一致的当前场景映射；旧用例不得作为已覆盖或当前规则来源',`历史页面：${page||'未提供独立页面标识'}`],当前用例追溯:matches.map(c=>c.用例编号)});
 }
 const candidateFile=path.join(task,dir,'candidate.json');
 await save(`${dir}/historical-case-comparison.json`,{schemaVersion:'1.0',项目名称:'Luma Live',目标范围:manifest.目标范围,独立场景固定时间:frozen.固定时间,独立场景SHA256:stableHash,历史读取开始时间:historyStart,候选JSON:{路径:relative(candidateFile),'SHA-256':await sha(candidateFile)},历史输入:[{路径:relative(file),'SHA-256':await sha(file)}],比较结果:comparison});
 // Final JSON is a separately named identical snapshot, never a historical merge.
 await fs.copyFile(candidateFile,path.join(task,dir,'final.json'));
 for(const [f,role,type,allowed,extra] of [
  [path.join(root,risks),'当前业务证据','未确认风险与缺口',true,{正式预期允许引用:false,允许用途:['候选风险','待决策问题'],禁止用途:['确定性预期']}],
  [file,'历史参照','历史用例JSON',false],
  [path.join(task,'prepare.mjs'),'执行工具','证据解析工具',false],
  [path.join(task,'decisions.mjs'),'执行工具','问题拆分与候选方案',false],
  [path.join(task,'finalize.mjs'),'执行工具','交付隔离校验工具',false],
  ...['AGENTS.md','Cem Kaner.txt','scripts/testcase-design.mjs','scripts/validate-generation-input.mjs','scripts/validate-testcase-json.mjs'].map(f=>[path.join(root,f),'执行工具','治理与校验',false]),
  [candidateFile,'本次派生产物','当前候选用例',false],
  [path.join(task,dir,'final.json'),'本次派生产物','最终用例JSON',false],
  [path.join(task,dir,'historical-case-comparison.json'),'本次派生产物','历史用例比较结果',false],
 ]){
  const index=manifest.输入文件.findIndex(e=>e.路径===relative(f));
  const next=await entry(f,role,type,allowed,extra);
  if(index<0)manifest.输入文件.push(next);else manifest.输入文件[index]=next;
 }
 manifest.当前候选用例=relative(candidateFile);manifest.最终用例JSON=relative(path.join(task,dir,'final.json'));manifest.历史用例比较结果=relative(path.join(task,dir,'historical-case-comparison.json'));
 await save(`${dir}/generation-input-manifest.json`,manifest);
 const validation=await validateGenerationInput(path.join(task,dir,'generation-input-manifest.json'),root,'final');
 const json=await validateTestcaseJson(path.join(task,dir,'final.json'));assert.equal(json.状态,'通过');
 await save(`${dir}/final-validation.json`,{...validation,JSON:json,来源复算:b.sourceHashes,独立场景SHA256:stableHash,时间:now()});
 summaries.push({端:end,目录:dir,用例数量:current.测试用例.length,待确认数量:current.需求待确认.length,历史数量:past.测试用例.length,历史待复核:comparison.filter(x=>x.判定==='待人工复核').length});
}
assert.equal(stableHash,await sha(path.join(task,'independent-scenario-baseline.json')),'历史读取后独立场景发生变化');
const inventory=[];
for(const name of await fs.readdir(path.join(root,'MainBasis'))){const file=path.join(root,'MainBasis',name),stat=await fs.stat(file);if(stat.isFile())inventory.push({路径:relative(file),大小:stat.size,修改时间:stat.mtime.toISOString(),SHA256:await sha(file)});}
const ledger=await read('source-coverage-ledger.json'),states=await read('state-transition-baseline.json');
const counts=Object.fromEntries([...new Set(ledger.条目.map(e=>e.处理去向))].map(v=>[v,ledger.条目.filter(e=>e.处理去向===v).length]));
await save('global-evidence-scan-result.json',{schemaVersion:'MainBasis-1.0',项目名称:'Luma Live',来源策略:'requirement-primary',扫描模式:'full',项目指纹:digest(inventory),当前来源根:'MainBasis',来源文件:inventory,原型业务缓存复用:0,历史业务规则复用:0,读取范围说明:'MainBasis两份完整文档构成本次正式规则与风险来源；原文中的外部路径只保留来源沿革，不覆盖本次副本内容',缓存隔离:{当前缓存路径:'work/mainbasis-global-evidence-cache',失效层:[],结果:'本次MainBasis来源配置首次建立，不存在可复用证据层；旧原型来源配置按历史参照隔离，不作为本次业务输入'},规则缺失复核:[{对象:'运营账号用户端登录入口',检索词:['运营账号','登录账号','手机号','邮箱','密码登录'],已查文件:[formal,risks],命中位置:['G-guild-operation-account-detail-005','A-admin-operation-account-detail-002','U-auth-phone-login-001','U-auth-email-login-001'],结论:'可登录限制已明确，但运营登录账号与手机或邮箱入口对应关系不明确，仅隔离此路径',处理去向:'需求待确认Q019；isolated-scenarios.json'}],独立条目处理:counts,声明:'条目有场景关联不等于其全部子条件已覆盖；未转换内容保留生成待复核，未统计为覆盖',阶段状态:'可交付已复核场景，保留待确认与未完成覆盖'});
await save('generation-summary.json',{来源:b.sourceHashes,规则条目数:b.entries.length,状态转换数:states.状态转换.length,转换观察端完整数:states.状态转换.filter(t=>t.待补观察端.length===0).length,独立场景数:frozen.场景.length,处理分布:counts,三端:summaries,实际产品执行:'未测',历史比较完成时间:now()});
console.log(JSON.stringify({summaries,counts},null,2));
