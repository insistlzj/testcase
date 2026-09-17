import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {startMainBasis, prepareContext, reviewContext, prepareBasis, sealMainBasis} from '../../scripts/mainbasis.mjs';
import {fingerprint, reviewHash} from '../../scripts/requirement-traceability.mjs';
const task=process.argv[2]||'work/liveshow-user-repair-260915-001', root=process.cwd(), project='liveshow-proto';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const save=async(n,x)=>fs.writeFile(`${task}/${n}`,JSON.stringify(x,null,2)+'\n');
const baseline=await read('work/liveshow-proto-mainbasis/latest.json');
await fs.mkdir(task,{recursive:true});
// Reuse only the currently published requirement transmission, never prior testcase designs.
for(const r of [...baseline.文档,...baseline.同步记录,...baseline.上游.filter(r=>r.路径.startsWith(project+'/'))]) assert.equal(fingerprint(await fs.readFile(r.路径)),r['SHA-256'],`当前需求依赖有变化，必须返回语义同步：${r.路径}`);
const prior=baseline.同步记录.find(r=>r.路径.endsWith('/mainbasis-start.json')).路径.replace(/\/mainbasis-start.json$/,'');
await save('requirement-reuse-basis.json',{原发布基线:baseline,最早影响层:'用例设计',依据:'RCL-0057仅改变需求待确认可见列；RCL-0058补强子项、优先级、故障准备。项目全部上游及两份业务文档哈希与当前已发布版本相同，复用其仍有效的需求传递判断，重新执行受控context回读和发布，不声称重做原型语义扫描。',时间:new Date().toISOString()});
if(!await fs.stat(`${task}/mainbasis-start.json`).catch(()=>null)) await startMainBasis(root,project,task);
const start=await read(`${task}/mainbasis-start.json`), scan=await read(`${prior}/global-evidence-scan-result.json`);
scan.本次规则影响={最早影响层:'用例设计',来源: 'RCL-0057、RCL-0058',当前上游:start.上游,复用依据:`${task}/requirement-reuse-basis.json`};
await save('global-evidence-scan-result.json',scan);
if(!await fs.stat(`${task}/context-units.json`).catch(()=>null)) await prepareContext(root,project,task);
const current=await read(`${task}/context-units.json`), old=await read(`${prior}/context-units.json`), reviewed=await read(`${prior}/context-transfer.json`);
const oldRows=new Map(reviewed.逐项.map(r=>[r.来源标识,r])), oldSources=new Map(old.来源.map(u=>[JSON.stringify([u.路径,u.原文,u.行===0?u.标识:null]),u]));
const targets=new Map(current.目标.map(u=>[JSON.stringify([u.路径,u.原文]),u]));
const targetIds=new Set(current.目标.map(u=>u.标识)), sourceIds=new Map(old.来源.map(u=>[u.标识,u]));
const oldTargets=new Map(old.目标.map(u=>[u.标识,u]));
const report=await read(`${task}/context-transfer.json`);
const changed=[];
report.逐项=current.来源.map(u=>{
  const previous=sourceIds.get(u.标识)||oldSources.get(JSON.stringify([u.路径,u.原文,u.行===0?u.标识:null]));
  if(previous){const row=structuredClone(oldRows.get(previous.标识));row.来源标识=u.标识;row.目标标识=row.目标标识.map(id=>{if(targetIds.has(id))return id;const target=oldTargets.get(id);const next=targets.get(JSON.stringify([target.路径,target.原文]));assert(next,'目标正文发生变化');return next.标识;});return row;}
  assert(u.路径.startsWith('同步前:'),'发现未解释新增上游');
  const target=targets.get(JSON.stringify([u.路径.slice(4),u.原文]));assert(target,'同步前新单元没有当前context原文');
  changed.push({路径:u.路径,行:u.行,原文:u.原文,目标标识:target.标识});
  return {来源标识:u.标识,去向:'已同步',说明:'当前已发布context中的原文继续保留；其当前上游到context映射未变化，新增项仅来自本轮同步前快照已包含上轮合法同步结果。',目标标识:[target.标识]};
});
report.目标排除=reviewed.目标排除.map(r=>{if(targetIds.has(r.标识))return r;const oldTarget=oldTargets.get(r.标识);return {...r,标识:targets.get(JSON.stringify([oldTarget.路径,oldTarget.原文])).标识};});
report.语义复核={说明:'此次仅流程规则变更：逐文件核对全部业务输入及当前传递记录哈希不变，复用其仍有效的判断。同步前派生快照按当前全文重新逐项对应，不删除业务规则。新增快照项详见context-reuse-delta.json。',内容SHA256:reviewHash(report)};
await save('context-reuse-delta.json',changed);await save('context-transfer.json',report);
await reviewContext(root,project,task);
await prepareBasis(root,project,task);
const mb=await read(`${task}/mainbasis-units.json`), oldMb=await read(`${prior}/mainbasis-units.json`);
assert.deepEqual(mb,oldMb,'context或MainBasis正文变化，不得复用传递判断');
await save('mainbasis-transfer.json',await read(`${prior}/mainbasis-transfer.json`));
const sync=await read(`${prior}/prototype-context-sync-result.json`);
sync.MainBasis复核.上游指纹=fingerprint(start.上游);
sync.MainBasis复核.复核说明+='；本轮业务输入逐文件哈希不变，复用已发布需求传递语义，按RCL-0058返回用例设计层修正，重新回读context。';
for(const r of sync.文件核对){const currentFile=[...start.上游,...start.文档].find(f=>f.路径===r.路径);assert(currentFile);r.修改前SHA256=currentFile['SHA-256'];r.修改后SHA256=currentFile['SHA-256'];r.核对说明='当前已发布业务正文未变；本轮仅设计和校验规则变化，需求无需改写';}
sync.需求清单有修改=false;
await save('prototype-context-sync-result.json',sync);
console.log(await sealMainBasis(root,project,task));
