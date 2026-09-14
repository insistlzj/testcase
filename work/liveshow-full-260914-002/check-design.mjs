import fs from 'node:fs/promises';
import path from 'node:path';
import {designs} from './current-design.mjs';
import {task,units,hashes,formal,pages} from './read-basis.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {splitAtomicResults,loadTestcaseLanguageRules,validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';
import {validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {projectTransition} from './transition-projections.mjs';
const language=await loadTestcaseLanguageRules(),verbs=Object.values(language.actionVerbs).flat().sort((a,b)=>b.length-a.length),sourceMap=new Map(units.map(u=>[u.标识,u]));
export const analyzed=[],draftCases=[],designProblems=[];
const seen=new Map();
for(const d of designs){
 if(d.excluded)continue;
 for(const [part,expected]of splitAtomicResults(d.expected).entries()){
  const key=fingerprint([d.end,d.role,d.page,d.entry,d.prerequisites,d.steps,expected]);
  if(seen.has(key)){const prev=seen.get(key);prev.sourceIds=[...new Set([...prev.sourceIds,...d.sourceIds])];continue;}
  const a={...d,id:'SC-'+key.slice(0,16),expected,sourceIds:[...d.sourceIds],original:d.id,part};
  if(d.label.startsWith('区号选择后的'))a.point=expected.startsWith('返回')?'返回页面':'已输入'+(expected.includes('手机号')?'手机号':expected.includes('登录方式')?'登录方式':'协议状态');
  if(d.label.startsWith('巡房会话绕过'))a.point=expected.includes('巡房中')?'巡房身份标识':'直播画面可见性';
  if(d.label==='失效好友申请只读')a.point=expected.includes('同意')?'同意按钮':'拒绝按钮';
  if(d.label.startsWith('拉黑主播后限制'))a.point=d.label.replace('拉黑主播后限制','')+'权限';
  if(d.page==='fan-group-chat.html'&&expected==='不可输入'){a.expected='群消息输入框不可输入';a.point='输入框可用性';}
  if(d.page==='fan-group-chat.html'&&expected.startsWith('输入框显示'))a.point='禁言输入提示';
  if(d.label==='公会登录运营账号')a.label='运营账号通过公会登录页提交凭证';
  if(d.label==='公会消息发送给全体主播')a.point=expected.includes('B')?'主播B接收记录':'主播A接收记录';
  if(d.label==='主播余额变更取消')a.point='取消后的账户余额';
  if(d.label.startsWith('创建运营账号初始发放'))a.point=expected.startsWith('发放')?'初始虚拟金币':'新运营账号状态';
  if(d.label.startsWith('快捷充值')&&!d.label.includes('成功'))a.point=expected.includes('数量')?'原赠送数量':'原选中礼物';
  if(d.label.startsWith('系统违规类型不可'))a.point=d.label.endsWith('删除')?'系统类型删除权限':'系统类型启停权限';
  a.transition=projectTransition(a);seen.set(key,a);analyzed.push(a);
 }
}
for(const [i,d]of analyzed.entries()){
 const evidence=[...new Set([...d.sourceIds,...d.metaIds])].map(id=>sourceMap.get(id));
 const steps=d.steps.map(s=>{const action=verbs.find(v=>s.startsWith(v))||verbs.find(v=>s.includes(v))||'';return {执行角色:d.role,动作:action,对象:action?s.slice(s.indexOf(action)+action.length).replace(/[“”]/gu,'').trim():s,操作:s,证据:evidence.map((_,i)=>i)};});
 const id='BR-'+d.id.slice(3),type=d.calc?'逻辑校验':/异常|失败/u.test(d.dimension)?'异常用例':d.flow?'业务流程':'功能需求';
 const rule={稳定规则标识:id,业务对象:d.object,执行角色:d.role,适用角色和端:[d.end+'-'+d.role],原子动作数量:1,原子结果数量:1,触发动作:d.steps.at(-1),必要条件:d.prerequisites,来源状态:d.state||d.prerequisites.slice(1).join('；')||'当前入口可访问',目标状态或可观察结果:d.expected,规则状态:'已确认规则',可生成正式用例:true,功能模块:d.module,功能结构:`${pages.find(p=>p.key===d.page).name}（${d.role}）`,证据引用:evidence.map(u=>({路径:formal,'SHA-256':hashes[formal],位置:'第'+u.行+'行',证明内容:u.原文,原文:u.原文})),跨模块流程编号:d.flow,用例设计:{场景:'验证'+d.label,验证子项:d.point,观察页面:d.entry,观察对象:d.object,观察端:d.end,设计说明:d.dimension+'；来源限定为当前MainBasis，步骤采用本端入口。',观察证据:evidence.map((_,i)=>i),步骤:steps,计算:d.calc,用例类型:type,优先级:/退款|充值|收益|权限|终审|发放|余额/u.test(d.label)?'P0':'P1',备注:[]}};
 d.rule=rule;
 designProblems.push(...validateRuleDesign(rule,language,{requireReview:false}).map(issue=>({index:i+1,id:d.id,page:d.page,label:d.label,issue})));
 draftCases.push({序号:i+1,用例编号:'DRAFT-'+String(i+1).padStart(4,'0'),功能模块:rule.功能模块,功能结构:rule.功能结构,用例类型:type,优先级:rule.用例设计.优先级,用例描述:rule.用例设计.场景,验证用例子项:d.point,前置条件:d.prerequisites,操作步骤:d.steps,预期结果:[d.expected],流程编号:d.flow,测试结果:'未测',测试人员:'',备注:['规则：'+id,'未动态验证']});
}
if(process.argv[1]===import.meta.filename){
 const check=validateTestcaseRecords({测试用例:draftCases,需求待确认:[]},language);
 await fs.writeFile(path.join(task,'draft-quality.json'),JSON.stringify({设计问题:designProblems,语言问题:check.问题,设计:analyzed},null,2)+'\n');
 console.log(JSON.stringify({drafts:analyzed.length,designIssues:designProblems.length,languageIssues:check.问题.length,issues:[...designProblems.slice(0,40),...check.问题.slice(0,50)]}));
}
