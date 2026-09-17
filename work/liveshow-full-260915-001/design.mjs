import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint, reviewHash} from '../../scripts/requirement-traceability.mjs';
import {readModuleDirectory} from '../../scripts/prototype-directory.mjs';
import {ruleDesignHash, ruleBusinessKey, casesFromCatalog, validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules, validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';

export const task='work/liveshow-full-260915-001', formal='liveshow-proto/MainBasis/统一需求文档.md', risk='liveshow-proto/MainBasis/需求待确认清单.md';
export const raw=await fs.readFile(formal,'utf8'), lines=raw.split('\n'), hash=fingerprint(raw), directory=readModuleDirectory(raw);
export const pages=[], byLine=new Map(), rules=[], plans=[], transitions=[], sourceErrors=[];
let page;
for(let i=0;i<lines.length;i++) {
  const hit=lines[i].match(/^页面：([^；]+)；实际承载：([^；]+)；/u);
  if(hit) {
    const mapping=directory.页面.find(p=>p.页面路径===hit[2]);
    assert(mapping,hit[2]);
    page={...mapping,视图:lines[i-1].replace(/^## /,'').split(' / ').at(-1),来源页面:hit[1],行:i+1,条款:[]};pages.push(page);
  }
  if(page && /^- \[(?:REQ|META)-/u.test(lines[i])) {const unit={行:i+1,原文:lines[i],正文:lines[i].replace(/^- \[[^\]]+\] /,'').replace(/〔.*$/u,''),页面:page};page.条款.push(unit);byLine.set(i+1,unit);}
}
export const classifications={
  smoke:['业务流程','P0','关键入口或主交易的最小冒烟路径；失败会阻止后续核心测试。'],
  core:['业务流程','P1','验证身份、权限或业务生命周期的关键结果，错误会影响主流程。'],
  money:['逻辑校验','P1','涉及账户金额、收益或统计口径，错误会影响资产及财务核对。'],
  boundary:['逻辑校验','P1','验证有明确需求依据的关键输入边界或拒绝条件。'],
  error:['异常用例','P1','验证核心流程失败后的保留、拒绝或恢复行为，防止错误成功。'],
  normal:['功能需求','P2','核对日常功能的明确输出，不属于阻断后续测试的冒烟路径。'],
  alternate:['业务流程','P2','验证取消、返回或常见替代路径，主业务风险低于交易和权限。'],
};
export const split=s=>Array.isArray(s)?s:s.split('~').filter(Boolean);
export function source(file,fragments) {
  const found=pages.filter(p=>p.来源页面===file || p.来源页面.endsWith('/'+file));assert.equal(found.length,1,file);
  return fragments.split('&').map(fragment=>{const hits=found[0].条款.filter(u=>u.正文.includes(fragment));assert.equal(hits.length,1,`${file}: ${fragment} (${hits.length})`);return hits[0].行;});
}
export function on(file,text,kind='core',extra={}) {
  for(const row of text.trim().split('\n').filter(s=>s.trim())) {
    const columns=row.split('|');assert.equal(columns.length,6,row);
    const [fragments,title,point,setup,steps,result]=columns;
    try {add(source(file,fragments),title,point,setup,steps,result,kind,extra);} catch(error) {sourceErrors.push({file,fragments,title,error:error.message});}
  }
}
export function ref(n) {assert(lines[n-1]?.trim(),`无来源行 ${n}`);return {路径:formal,位置:`行${n}`,原文:lines[n-1],证明内容:lines[n-1].replace(/〔.*$/u,''),'SHA-256':hash};}
export function state(id,object,from,action,role,end,to,observe,refs) {
  transitions.push({状态转换标识:`ST-${id}`,共同业务对象:object,来源状态:from,触发动作:action,执行角色:role,操作端:end,目标状态:to,观察端:observe,证据引用:refs.map(ref)});
}
// All arguments below are authored designs; this helper only serializes them.
export function add(refs,title,point,setup,steps,result,kind,extra={}) {
  refs=Array.isArray(refs)?refs:[refs];
  const p=extra.page?pages.find(p=>p.来源页面===extra.page):byLine.get(refs.find(n=>byLine.has(n)))?.页面;
  assert(p,`需要明确目标页面 ${refs}`);
  const role=extra.role || (p.端名==='公会App'?'公会长':p.端名==='管理后台'?(p.功能模块==='系统配置'?'超级管理员':'平台管理员'):'已登录用户');
  assert(classifications[kind],`缺少设计分类 ${title}`);
  const [type,priority,reason]=classifications[kind];
  const conditions=[`执行角色为${role}`, ...split(setup)];
  const operations=split(steps);
  assert(operations.length && result && point && title);
  const source=refs.map(ref), id='BR-'+fingerprint([p.端名,p.来源页面,role,conditions,operations,result]).slice(0,16);
  const mappedSteps=operations.map(op=> {
    const verb=(extra.verbs || ['取消勾选','进入','打开','点击','输入','填写','选择','勾选','上传','下载','切换','刷新','关闭','退出','查看','展开','收起','清空','删除','拖动','滑动','返回','复制','登录','保存','提交','确认','支付','取消','发送','请求','等待','校验','查询','通过','驳回','拒绝','锁定','解锁','启用','禁用','下架']).find(v=>op.startsWith(v));
    assert(verb && verb!=='等待',`步骤须为本角色具体动作 ${op}`);
    return {执行角色:role,动作:verb,对象:op.slice(verb.length).trim(),操作:op,证据:source.map((_,i)=>i)};
  });
  const rule={稳定规则标识:id,业务对象:extra.object||p.页面名称,共同业务对象:extra.object||p.页面名称,执行角色:role,适用角色和端:[`${p.端名}-${role}`],原子动作数量:1,原子结果数量:1,功能模块:p.功能模块,功能结构:`${p.视图}（${role}视角）`,模块归属说明:'采用本轮 MainBasis 内原型模块归属',触发动作:operations.at(-1),必要条件:conditions,来源状态:extra.from||conditions.slice(1).join('；')||'具备本页访问权限',目标状态或可观察结果:result,规则状态:'已确认规则',可生成正式用例:true,证据引用:source,用例设计:{场景:`验证${title}`,验证子项:point,用例类型:type,优先级:priority,优先级依据:extra.reason||reason,观察端:p.端名,观察页面:p.视图,观察页面路径:p.页面路径,观察对象:point,观察证据:source.map((_,i)=>i),步骤:mappedSteps,计算:extra.calc||null,设计说明:extra.review||`${p.视图}中由${role}执行指定动作，仅核对${point}；证据限定为所列需求条款。`,备注:extra.notes||[]}};
  if(extra.flow){rule.跨模块流程编号=`FLOW-${extra.flow}`;rule.用例设计.备注.push(`流程阶段：${title}；共同业务对象：${extra.object||p.页面名称}`);}
  const plan={规则:rule,来源行:refs,页面:p.来源页面,...(extra.state?{状态转换标识:`ST-${extra.state}`}:{})};
  plans.push(plan); rules.push(rule);return plan;
}
export function observe(refs,field,value,setup,kind='normal',extra={}) {
  refs=Array.isArray(refs)?refs:[refs];const p=byLine.get(refs[0]).页面;
  return add(refs,`${p.视图}读取${field}`,`${field}回显`,setup,`进入${p.视图}~查看${field}`,`${field}显示${value}`,kind,extra);
}
export function expr(formula,variables,expression,answer,unit='金币') {
  return {公式:formula,数据范围:'本条前置条件指定的对象和记录',结果单位:unit,证据:[0],变量:variables.map(([名称,数值,单位=unit])=>({名称,数值,单位,业务含义:名称})),表达式:expression,最终值:answer};
}
export const v=名称=>({变量:名称}), op=(运算,...参数)=>({运算,参数});
export function table(text,kind,extra={}) {
  for(const line of text.trim().split('\n').filter(s=>s.trim())) {
    const [source,title,point,conditions,actions,result]=line.split('|');assert.equal(line.split('|').length,6,line);
    try {add(source.split(',').map(Number),title,point,conditions,actions,result,kind,extra);} catch(error) {sourceErrors.push({source,title,error:error.message});}
  }
}
export function fields(text,extra={}) {
  for(const line of text.trim().split('\n').filter(s=>s.trim())) {
    const [n,field,value,object]=line.split('|');assert.equal(line.split('|').length,4,line);
    const hostFields=new Set([798,801,1125,1126,1127,1150,1162,1163,1215,1225,1262,1678,1752,1764,1783,1784,1798,1810,1818,1825,1836,1842,1852]);
    observe(Number(n),field,`“${value}”`,`${object}的${field}为“${value}”`,'normal',{...(hostFields.has(+n)?{role:'主播'}:{}),...extra});
  }
}
export function inputChecks(n,page,field,checks,submit,extra={}) {
  for(const [value,valid,label] of checks) add(n,`${page}${field}${label||`输入${value||'空值'}`}`,`${field}校验`,extra.setup||'除本次目标字段外，其余必填项均为合法值',`进入${page}~${value?`填写${field}“${value}”`:`清空${field}`}~点击${submit}`,valid?`${field}保存为“${value}”`:`不保存本次${field}输入`,'boundary',extra);
}
export async function saveDesign() {
  assert.equal(sourceErrors.length,0,JSON.stringify(sourceErrors));
  const language=await loadTestcaseLanguageRules();
  for(const rule of rules) {
    const issues=validateRuleDesign(rule,language,{requireReview:false});assert.equal(issues.length,0,`${rule.稳定规则标识}: ${issues.join(';')}`);
  }
  await fs.writeFile(`${task}/authored-design.json`,JSON.stringify({说明:'当前两份 MainBasis 全文独立分析后的设计；无历史用例输入',状态转换:transitions,设计:plans},null,2)+'\n');
  for(const [end,dir] of [['用户App','user'],['公会App','guild'],['管理后台','admin']]) await fs.writeFile(`${task}/${dir}/authored-design.json`,JSON.stringify({说明:'当前两份 MainBasis 独立设计，尚未代表需求全量覆盖',状态转换:transitions,设计:plans.filter(p=>p.规则.用例设计.观察端===end)},null,2)+'\n');
  console.log(JSON.stringify({设计数:plans.length,状态转换:transitions.length,按端:Object.fromEntries(['用户App','公会App','管理后台'].map(end=>[end,rules.filter(r=>r.用例设计.观察端===end).length]))}));
}
