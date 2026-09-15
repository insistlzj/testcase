import fs from 'node:fs/promises';
import {hash} from '../../scripts/evidence-discovery.mjs';
import {loadTestcaseLanguageRules,validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';
import {validateRuleDesign} from '../../scripts/testcase-design.mjs';
const task='work/liveshow-full-20260914-190307';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const model=await read(`${task}/mainbasis-model.json`),draft=await read(`${task}/scenario-design-draft.json`),language=await loadTestcaseLanguageRules();
const formalText=await fs.readFile(model.formal.路径,'utf8'),lines=formalText.split('\n');
if(hash(formalText)!==model.formal.SHA256)throw new Error('MainBasis changed');
const req=new Map(model.requirements.map(r=>[r.id,r]));
const verbs=Object.values(language.actionVerbs).flat().sort((a,b)=>b.length-a.length);
const out=[];const issues=[];
for(const plan of draft.场景){
 const p=model.pages[plan.page];
 const evidence=[...new Set(plan.sources)].map(id=>{const r=req.get(id);return {路径:model.formal.路径,'SHA-256':model.formal.SHA256,位置:`第 ${r.line} 行；${id}`,证明内容:`${r.field?`${r.field}：`:''}${r.body}`,原文:r.raw};});
 evidence.push({路径:model.formal.路径,'SHA-256':model.formal.SHA256,位置:`第 ${p.sourceLine} 行`,证明内容:`${p.endName}的${p.name}页面或视图承载`,原文:lines[p.sourceLine-1]});
 const steps=plan.steps.map(operation=>{
  const found=verbs.map(verb=>({verb,index:operation.indexOf(verb)})).filter(x=>x.index>=0).sort((a,b)=>a.index-b.index||b.verb.length-a.verb.length)[0];
  const action=found?.verb||'';const object=found?operation.slice(found.index+action.length).trim()||operation.slice(0,found.index).trim():operation;
  return {执行角色:plan.role,动作:action,对象:object,操作:operation,证据:evidence.map((_,i)=>i)};
 });
 const rule={稳定规则标识:`BR-${plan.id.slice(3)}`,独立来源规则:plan.sources,业务对象:plan.point.replaceAll(' / ','、'),共同业务对象:plan.transition?draft.状态转换.find(t=>t.状态转换标识===plan.transition).共同业务对象:p.object.replaceAll(' / ','、'),执行角色:plan.role,适用角色和端:[`${p.endName}-${plan.role}`],原子动作数量:1,原子结果数量:1,触发动作:plan.steps.at(-1),必要条件:plan.pre,来源状态:plan.pre.slice(1).join('；')||`${plan.role}可访问${p.name}`,目标状态或可观察结果:plan.result,规则状态:'生成待复核',可生成正式用例:false,证据引用:evidence,功能模块:p.module,功能结构:`${p.name.replace(/^视图-/,'').replaceAll('-','·')}（${plan.role}）`,跨模块流程编号:plan.flow||'',用例设计:{场景:`验证${plan.description}`,验证子项:plan.point,观察页面:p.name.replace(/^视图-/,''),观察对象:plan.point,观察端:p.endName,设计说明:`针对${plan.description}，观察${plan.point}；仅使用当前 MainBasis 的明确结果。`,观察证据:evidence.map((_,i)=>i),步骤:steps,用例类型:plan.type,优先级:plan.priority,计算:plan.calculation,备注:[]}};
 const errors=validateRuleDesign(rule,language,{requireReview:false});if(errors.length)issues.push({场景:plan.id,问题:errors});
 out.push({场景标识:plan.id,规则:rule});
}
const reports=[];
for(const [end,slug,prefix] of [['用户App','user','USER'],['公会App','guild','GUILD'],['管理后台','admin','ADMIN']]){
 const cases=out.filter(x=>x.规则.用例设计.观察端===end).map(({规则:r},i)=>({序号:i+1,用例编号:`${prefix}-${String(i+1).padStart(4,'0')}`,功能模块:r.功能模块,功能结构:r.功能结构,用例类型:r.用例设计.用例类型,优先级:r.用例设计.优先级,用例描述:r.用例设计.场景,验证用例子项:r.用例设计.验证子项,前置条件:r.必要条件,操作步骤:r.用例设计.步骤.map(s=>s.操作),预期结果:[r.目标状态或可观察结果],流程编号:r.跨模块流程编号,测试结果:'未测',测试人员:'',备注:[`规则：${r.稳定规则标识}`,'未动态验证']}));
 const data={测试用例:cases,需求待确认:[]};
 await fs.writeFile(`${task}/${slug}/language-draft.json`,JSON.stringify(data,null,2)+'\n');
 const report=validateTestcaseRecords(data,language);reports.push({端:end,...report});
}
await fs.writeFile(`${task}/rule-design-draft.json`,JSON.stringify(out,null,2)+'\n');
await fs.writeFile(`${task}/draft-quality-report.json`,JSON.stringify({结构问题:issues,语言:reports},null,2)+'\n');
console.log({设计:out.length,结构问题:issues.length,语言:reports.map(r=>[r.端,r.问题.length])});
