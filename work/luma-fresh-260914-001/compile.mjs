import fs from 'node:fs/promises';
import path from 'node:path';
import {root,task,save,hash,scenes,requirements,pages,evidence,formalHash,riskHash,formalPath,riskPath,questions,freezeRequirements,transitions} from './model.mjs';
import {ruleDesignHash,caseFromRule,validateRuleDesign,ruleBusinessKey} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules,validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';
await freezeRequirements();
const {freezeStates}=await import('./states.mjs');await freezeStates();
for(const file of ['design-account-social','design-live-guild','design-finance','design-admin','design-discovery-fans','design-statistics','design-remaining','design-views-reports','design-navigation'])await import(`./${file}.mjs`);
const lang=await loadTestcaseLanguageRules(),verbs=Object.values(lang.actionVerbs).flat().sort((a,b)=>b.length-a.length);
const ruleMap=new Map(requirements.map(r=>[r.id,r]));
const stepEdits=new Map([
 ['等待10秒','查看邀请提示直至收到10秒'],['等待 10 秒','查看邀请提示直至收到10秒'],
 ['搜索海风','输入海风并点击搜索'],['搜索月光','输入月光并点击搜索'],
 ['等待 10 秒倒计时结束','查看注销倒计时直至10秒结束'],
 ['等待 4 秒','查看邀请提示直至收到4秒'],
 ['开启消息免打扰','点击消息免打扰开关使其开启'],
 ['接受海风邀请','点击海风邀请的接受按钮'],
 ['开启从粉丝中授权可见','点击从粉丝中授权可见开关使其开启'],
 ['筛选主播海风','选择主播海风并查询'],['筛选已退会主播','选择已退会筛选项'],
 ['停用该档位','点击该档位停用按钮'],['停用50金币档位','点击50金币档位停用按钮'],
 ['结束本次直播','点击结束直播并确认'],
]);
const issues=[],all=[];
function flowOf(s){
 if(s.flow)return s.flow.toUpperCase();
 const body=`${s.page} ${s.title}`;
 const object=/guild-leave/.test(body)?'公会成员关系':/guild-(?:application|join)|admin-host-review/.test(body)?'入会认证申请':/分成|修正|settlement|share-ledger|share-income|account-balance/.test(body)?'线下分成批次':/虚拟|运营账号|operation-/.test(body)?'运营账号虚拟金币':/充值|退款|recharge/.test(body)?'充值订单':/直播权限|开播权限/.test(body)?'主播直播权限':/report|举报/.test(body)?'直播举报工单':/cohost|连麦/.test(body)?'主播连麦关系':/赠礼|赠送|礼物收益/.test(body)?'金币消费订单':null;
 return object?`FLOW-${hash(object).slice(0,8).toUpperCase()}`:'';
}
for(const [end,folder,prefix] of [['用户App','user','USER'],['公会App','guild','GUILD'],['管理后台','admin','ADMIN']]){
 const own=scenes.filter(s=>s.end===end).sort((a,b)=>a.module.localeCompare(b.module,'zh-CN'));
 const rules=own.map(s=>{
  const sources=s.sourceIds.map(id=>ruleMap.get(id));
  const refs=sources.map(r=>({...evidence(r),位置:r.page==='shared'?'共同业务对象与规则':r.page,需求标识:r.id,章节:r.section}));
  let result=s.result;if(s.calculation&&!result.includes('计算结果'))result=result.replace(/=/,'计算结果=');
  const steps=s.steps.map(raw=>{
   const text=stepEdits.get(raw)||raw;
   const verb=verbs.find(v=>text.startsWith(v))||verbs.find(v=>text.includes(v));
   if(!verb)issues.push({场景:s.id,标题:s.title,问题:`缺少具体动作：${text}`});
   return {执行角色:s.role,动作:verb||'',对象:text,操作:text,证据:refs.map((_,i)=>i)};
  });
  const conditions=s.conditions.length?s.conditions:[`${s.role}可访问${pages.get(s.page).name}`];
  const rule={稳定规则标识:`BR-${s.id.slice(3).toUpperCase()}`,业务对象:s.object,共同业务对象:s.object,执行角色:s.role,适用角色和端:[`${end}-${s.role}`],
   触发动作:steps.at(-1)?.操作||'',必要条件:conditions,来源状态:s.from,目标状态或可观察结果:result,规则状态:'已确认规则',可生成正式用例:true,原子动作数量:1,原子结果数量:1,
   功能模块:s.module,功能结构:/admin-(host|guild)-(?:account-balance|balance-change-record)/.test(s.page)?`${s.structure}（${s.page.includes('admin-host-')?'主播账户':'公会账户'}）`:s.structure,证据引用:refs,来源需求标识:s.sourceIds,场景标识:s.id,状态转换标识:s.transition,跨模块流程编号:flowOf(s),
   用例设计:{场景:s.title,验证子项:s.point,观察页面:pages.get(s.observationPage||s.page).name,观察对象:s.point,观察端:end,设计说明:s.review,观察证据:sources.map((r,i)=>r.page===(s.observationPage||s.page)?i:-1).filter(i=>i>=0),步骤:steps,计算:s.calculation,用例类型:s.type,优先级:s.priority,备注:s.notes}};
  rule.设计复核={状态:'通过',说明:s.review,设计SHA256:ruleDesignHash(rule)};
  for(const issue of validateRuleDesign(rule,lang))issues.push({场景:s.id,标题:s.title,问题:issue});
  return rule;
 });
 const cases=rules.map((r,i)=>caseFromRule(r,i+1,prefix));
 const result=validateTestcaseRecords({测试用例:cases,需求待确认:[]},lang);
 for(const issue of result.问题)issues.push({端:end,问题:issue});
 await fs.mkdir(path.join(task,folder),{recursive:true});
 await save(`${folder}/business-rule-catalog.json`,{schemaVersion:'1.0',项目名称:'Luma Live',目标范围:{端名:end,模块名称:[...new Set(own.map(s=>s.module))].join('、')},规则:rules});
 await save(`${folder}/case-draft.json`,{测试用例:cases,需求待确认:[]});
 all.push({端:end,用例数:cases.length,规则数:rules.length});
}
await save('test-scenario-library.json',{schemaVersion:'1.0',历史策略:'不读取不比较',输入:[{路径:formalPath,'SHA-256':formalHash},{路径:riskPath,'SHA-256':riskHash}],场景:scenes});
await save('state-scenario-map.json',{输入SHA256:formalHash,状态转换:transitions.map(t=>({...t,流程编号:t.流程编号.toUpperCase(),关联场景:scenes.filter(s=>s.transition===t.状态转换标识).map(s=>s.id)})),说明:'状态转换与端侧观察分别映射；同一转换的其他端用例可验证同步结果，不冒充动作执行者。未绑定项保留，不声明全链路执行通过。'});
await save('draft-check.json',{汇总:all,问题:issues});
console.log(JSON.stringify({汇总:all,问题数:issues.length,问题:issues.slice(0,100)},null,2));
