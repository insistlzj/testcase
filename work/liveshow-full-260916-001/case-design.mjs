import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint,textUnits} from '../../scripts/requirement-traceability.mjs';
import {readModuleDirectory} from '../../scripts/prototype-directory.mjs';
import {ruleDesignHash,validateRuleDesign,COVERAGE_DIMENSIONS,ruleBusinessKey} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';

export const task='work/liveshow-full-260916-001';
export const formalPath='liveshow-proto/MainBasis/统一需求文档.md',riskPath='liveshow-proto/MainBasis/需求待确认清单.md';
const text=await fs.readFile(formalPath,'utf8');
export const directory=readModuleDirectory(text),formalHash=fingerprint(text),units=textUnits(formalPath,text);
export const riskText=await fs.readFile(riskPath,'utf8');
export const pages=new Map(),rules=[],observations=[];
let source='',page=null;
for(const [i,line]of text.split('\n').entries()){
  const origin=line.match(/^<!-- context-source:(.+) -->$/);if(origin){source=origin[1];page=null;}
  const h=line.match(/^## (.+) \/ (.+) \/ (.+\.html)$/);
  if(h){page={key:h[3],module:h[1],name:h[2],source,rows:[],entry:''};pages.set(page.key,page);}
  else if(line.startsWith('## '))page=null;
  if(page&&line.startsWith('页面入口：'))page.entry=line.slice(5);
  const r=line.match(/^- \*\*([^*]+)\*\* 【([^】]+)】(.*)$/);
  if(page&&r){page.rows.push({id:r[1],kind:r[2],body:r[3],raw:line,line:i+1,unit:units.find(u=>u.行===i+1).标识});}
}
for(const p of pages.values()){
  const found=directory.页面.find(d=>d.页面路径===p.entry);
  if(found){p.end=found.端名;p.module=found.功能模块;p.registeredName=found.页面名称;}
}
const language=await loadTestcaseLanguageRules();
const priorityReason={P0:'核心入口或主交易成功路径，失败会阻断后续业务测试。',P1:'该验证点涉及核心业务条件、权限、资产或状态分支。',P2:'该验证点属于辅助功能、常见替代入口或一般表单边界。',P3:'该验证点属于低频兼容或较低风险的展示细节。'};
export function sourceRows(pageKey,fragments){
  const p=pages.get(pageKey);assert(p,`页面不存在${pageKey}`);
  const found=[];
  for(const fragment of fragments){
    const selected=p.rows.filter(r=>r.kind==='正式规则'&&(fragment instanceof RegExp?fragment.test(r.body):r.body.includes(fragment)));
    assert(selected.length,`${pageKey}没有正式依据：${fragment}`);found.push(...selected);
  }
  return [...new Map(found.map(r=>[r.unit,r])).values()];
}
export function test(pageKey,fragments,role,title,point,conditions,steps,result,options){
  role=role.trim();
  assert(options&&['P0','P1','P2','P3'].includes(options.p)&&options.type,'必须明确优先级与用例类型');
  const p=pages.get(options.observe||pageKey);assert(p?.end,`目标页未登记${options.observe||pageKey}`);
  assert.equal(p.end,pages.get(pageKey)?.end,'观察位置不得静默扩大到其他端');
  let refs=sourceRows(pageKey,fragments);
  for(const extra of options.extra||[])refs.push(...sourceRows(extra[0],extra.slice(1)));
  for(const literal of options.commonEvidence||[]){
    const found=units.filter(u=>u.原文.trim()===literal);assert.equal(found.length,1,'公共规则必须唯一定位');
    const u=found[0];refs.push({id:u.标识,unit:u.标识,line:u.行,raw:u.原文,body:u.原文});
  }
  refs=[...new Map(refs.map(r=>[r.unit,r])).values()];
  const evidence=refs.map(r=>({路径:formalPath,'SHA-256':formalHash,位置:`${r.id}；行${r.line}`,原文:r.raw,证明内容:r.body}));
  const parsed=steps.map(s=>{const [动作,对象,...tail]=s.split('|');assert(动作&&对象);return{执行角色:role,动作,对象,操作:动作+对象+tail.join('|'),证据:refs.map((_,i)=>i)};});
  const rule={稳定规则标识:'',业务对象:options.object||point,共同业务对象:options.common||options.object||point,执行角色:role,适用角色和端:[`${p.end}-${role}`],
    功能模块:p.module,功能结构:`${p.registeredName}（${role}视角）`,模块归属说明:`实际观察入口为MainBasis目录中的${p.entry}`,
    触发动作:parsed.at(-1).操作,必要条件:[`执行角色为${role}`, ...conditions],来源状态:options.from||conditions.join('；'),目标状态或可观察结果:result,原子动作数量:1,原子结果数量:1,
    规则状态:'已确认规则',可生成正式用例:true,证据引用:evidence,跨模块流程编号:options.flow||'',
    用例设计:{场景:`验证${title}`,验证子项:point,观察页面:p.registeredName,观察页面路径:p.entry,观察对象:point,观察端:p.end,观察证据:refs.map((_,i)=>i),
      用例类型:options.type,优先级:options.p,优先级依据:options.reason||priorityReason[options.p],设计说明:options.why||`以${role}在${p.registeredName}的具体输入及动作验证${point}，预期引用当前MainBasis。`,步骤:parsed,计算:options.calc||null,外部配合:options.external||[],备注:options.notes||[]}};
  rule.稳定规则标识=`BR-${fingerprint(ruleBusinessKey(rule)).slice(0,16)}`;
  if(rules.some(r=>r.稳定规则标识===rule.稳定规则标识))throw new Error('重复设计：'+title);
  // Authored scenarios remain pending until their steps and expected result are reviewed together.
  rule.设计复核={状态:'待复核',说明:'',设计SHA256:''};
  const problems=validateRuleDesign(rule,language,{requireReview:false});assert(!problems.length,`${title}：${problems.join('；')}`);
  rules.push(rule);observations.push({规则标识:rule.稳定规则标识,页面:pageKey,来源:refs.map(r=>({单元:r.unit,片段:r.body})),状态转换标识:options.transition||null,变化维度:options.dimensions||['正常主流程','可观察结果'],独立差异:options.difference||title});
  return rule;
}
export const P0={p:'P0',type:'业务流程'},P1={p:'P1',type:'逻辑校验'},P2={p:'P2',type:'功能需求'},ERR={p:'P1',type:'异常用例'};
export function calculation(formula,values,expression,result,unit='金币',scope='当前测试账号的本次业务记录'){
  const units={精度:'无量纲',数量:'个',A数量:'个',B数量:'个',份数:'份',开奖次数:'次',充值人数:'人',新用户充值人数:'人',比例:'无量纲',收益比例:'无量纲',旧比例:'无量纲',新比例:'无量纲',百分比系数:'无量纲',有效观看分钟:'分钟',有效分钟:'分钟',窗口内分钟:'分钟',每分钟亲密度:'亲密度/分钟'};
  return{公式:formula,数据范围:scope,结果单位:unit,证据:[0],变量:Object.entries(values).map(([name,value])=>({名称:name,业务含义:name,数值:value,单位:units[name]||(unit==='%'?'金币':unit)})),表达式:expression,最终值:result};
}
export const enter=p=>{const name=pages.get(p)?.registeredName||p;return `进入|${name}${name.endsWith('页')?'':'页'}`;};
export async function saveDraft(){
  await fs.writeFile(`${task}/authored-rule-draft.json`,JSON.stringify({schemaVersion:'1.0',来源:[{路径:formalPath,'SHA-256':formalHash},{路径:riskPath,'SHA-256':fingerprint(riskText)}],规则:rules,观察绑定:observations},null,2)+'\n');
  console.log(JSON.stringify({规则:rules.length,按端:Object.fromEntries(['用户App','公会App','管理后台'].map(e=>[e,rules.filter(r=>r.用例设计.观察端===e).length]))}));
}
if(process.argv[2]==='list')for(const p of pages.values())console.log(`${p.key} | ${p.module} | ${p.name} | ${p.rows.filter(r=>r.kind==='正式规则').length}`);
if(process.argv[2]==='read')for(const key of process.argv.slice(3)){
  const p=pages.get(key);assert(p,key);console.log(`\n${p.key} | ${p.name} | ${p.entry}`);
  for(const r of p.rows)console.log(`${r.id} ${r.kind} ${r.body}`);
}
