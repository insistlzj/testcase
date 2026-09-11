import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import './model.mjs';
import {baseline,root,task,save,hash} from './source.mjs';
import {scenes,transitions,dispositions} from './design.mjs';

const started=new Date().toISOString();
const priorDir=path.join(root,'work/mainbasis-three-end-260911-001');
const priorBaseline=JSON.parse(await fs.readFile(path.join(priorDir,'source-baseline.json'),'utf8'));
assert.deepEqual(priorBaseline.sourceHashes,baseline.sourceHashes,'已有待确认数据与当前MainBasis不是同一版本');
const pending=JSON.parse(await fs.readFile(path.join(priorDir,'risk-decisions.json'),'utf8'));
const moduleNames=Object.fromEntries(Object.values(baseline.pages).map(p=>[p.module.split(' ')[0],p.module]));
const pageOrder=new Map(Object.keys(baseline.pages).map((key,index)=>[key,index]));
const summary=[];
// 用户要求停止复核后冻结现有数据，仅做排序、编号、字段投影与文件导出。
await save('direct-export-instruction.json',{时间:started,用户原话:'不用再复核了，根据现有的数据直接生成',执行范围:'保留现有场景与待确认事项，停止内容复核；只验证文件结构、可读性及数据一致性',内容复核状态:'未继续执行，不声明完整性或语义门禁已通过',产品执行:'全部未测',正式用例数据来源:'本任务现有MainBasis场景数据',待确认数据来源:'上一导出任务现有待确认数据，源文件哈希与本任务相同'});
await save('independent-scenario-baseline.json',{固定时间:started,来源哈希:baseline.sourceHashes,场景:scenes,规则处理去向:[...dispositions],说明:'直接导出时冻结现有场景；不继续补充、去重或修正用例内容'});
await save('state-transition-baseline.json',{来源哈希:baseline.sourceHashes,状态转换:transitions,说明:'保留已建立的转换基线；本次不新增转换或声明跨端闭环检查通过'});
for(const [end,dir,prefix] of [['用户App','user','USER'],['公会App','guild','GUILD'],['管理后台','admin','ADMIN']]){
 await fs.mkdir(path.join(task,dir),{recursive:true});
 const selected=scenes.filter(s=>s.end===end).sort((a,b)=>a.module.localeCompare(b.module)||pageOrder.get(a.page)-pageOrder.get(b.page));
 const cases=selected.map((s,i)=>({序号:i+1,用例编号:`${prefix}-${String(i+1).padStart(4,'0')}`,功能模块:moduleNames[s.module],功能结构:`${baseline.pages[s.page].name}（${s.role}视角）`,用例类型:s.type,优先级:s.priority,用例描述:s.description,验证用例子项:s.point,前置条件:s.pre,操作步骤:s.steps,预期结果:[s.result],流程编号:s.flow,测试结果:'未测',测试人员:'',备注:[`来源：MainBasis/统一需求文档.md；${s.refs.join('、')}`,`场景：${s.id}`,...(s.transition?[`状态转换：${s.transition}`]:[])]}));
 const questions=pending.filter(q=>q._ends.includes(end)).map(q=>{const {_ends,_source,...record}=q;return {...record,已有用例编号:[]};});
 const value={测试用例:cases,需求待确认:questions};
 await save(`${dir}/candidate.json`,value);
 await save(`${dir}/current-testcase-candidate.json`,value);
 await save(`${dir}/final.json`,value);
 assert.equal(cases.length,selected.length);
 assert(cases.every(c=>c.测试结果==='未测'&&c.测试人员===''));
 assert.equal(new Set(cases.map(c=>c.用例编号)).size,cases.length);
 assert(cases.every(c=>Object.keys(c).length===15&&c.预期结果.length===1));
 assert(questions.every(q=>Object.keys(q).length===20&&q.产品结论===''&&q.结论补充===''));
 summary.push({端:end,目录:dir,用例数:cases.length,待确认数:questions.length,模块数:new Set(cases.map(c=>c.功能模块)).size});
}
const inventory=[];
for(const [name,sha] of Object.entries(baseline.sourceHashes))inventory.push({路径:name,SHA256:sha,角色:'当前业务证据',用途:name.includes('待确认')?'风险与缺口':'正式业务规则'});
for(const name of ['risk-decisions.json'])inventory.push({路径:path.relative(root,path.join(priorDir,name)),SHA256:hash(await fs.readFile(path.join(priorDir,name))),角色:'已有待确认数据',用途:'直接导出，不定义正式用例业务结果'});
await save('generation-input-manifest.json',{schemaVersion:'direct-export-1.0',项目名称:'Luma Live',任务工作目录:path.relative(root,task),来源策略:'requirement-primary',当前用户指令:'按现有数据直接生成，不再复核',输入文件:inventory,内容复核:'未继续执行',用例内容检查:'保留此前检查记录，不将其改写为通过',导出检查:['JSON结构及字段数量','连续唯一编号','Excel与现有JSON逐单元格一致','文件归档可读取','工作表、冻结、筛选和下拉项','公式缓存与测试初始状态']});
await save('direct-export-summary.json',{开始时间:started,结束时间:new Date().toISOString(),来源哈希:baseline.sourceHashes,场景总数:scenes.length,三端:summary});
console.log(JSON.stringify(summary,null,2));
