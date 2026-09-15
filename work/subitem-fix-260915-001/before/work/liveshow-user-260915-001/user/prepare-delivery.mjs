import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fingerprint,reviewHash} from '../../../scripts/requirement-traceability.mjs';
import {casesFromCatalog,ruleDesignHash} from '../../../scripts/testcase-design.mjs';
import {validateGenerationInput} from '../../../scripts/validate-generation-input.mjs';
const task='work/liveshow-user-260915-001/user',parent=path.dirname(task);
const read=async n=>JSON.parse(await fs.readFile(`${task}/${n}`,'utf8'));
const save=async(n,v)=>fs.writeFile(`${task}/${n}`,JSON.stringify(v,null,2)+'\n');
const hash=async p=>fingerprint(await fs.readFile(p));
const basis=await read('basis-index.json'),draft=await read('rule-design-review-draft.json'),sd=await read('scene-design-review-draft.json'),decision=await read('semantic-dispositions.json');
const units=await read('requirement-units.json'),questions=await read('questions-draft.json'),qt=await read('question-trace.json'),overview=await read('overview-coverage.json'),aliases=await read('clause-aliases.json');
const bindings=await read('coverage-bindings.json');
const isolated=draft.规则.filter(r=>decision.隔离.some(x=>x.场景===r.用例设计.场景));
assert.equal(isolated.length,2);
for(const [i,r] of isolated.entries()){
 const q=structuredClone(questions[0]),d=decision.隔离.find(x=>x.场景===r.用例设计.场景);
 Object.assign(q,{问题编号:d.问题编号,需求组编号:i?'RG-EXPENSE-DESTINATION':'RG-TASK-DESTINATION',功能模块:r.功能模块,具体场景:r.用例设计.场景.replace(/^验证/,''),问题分类:'流程与状态',待决策问题:i?'用户点击支出详情的业务对象后，各消费类型应进入主播主页还是具体场次信息？':'全部任务中点击“去完成”，各任务分别直接跳转到哪个入口，哪些任务只显示路径提示？',可选方案:i?['全部进入消费对应主播主页','全部进入对应场次信息','按消费类型分别指定去向（补充对应关系）']:['各任务均直接跳转（补充任务与入口对应关系）','各任务均仅提示完成路径','按任务分别指定跳转或路径提示'],测试建议:d.理由,已知依据:r.证据引用.slice(0,-1).map(e=>`${e.路径}：${e.位置}；${e.原文}`),影响范围:[r.功能模块,r.用例设计.观察页面],确认后待补用例:i?['各消费类型的对象详情唯一去向','目标账号或场次失效时的入口处理']:['各任务去完成按钮的唯一去向','不能跳转的任务所需路径提示'],已有用例编号:[]});
 questions.push(q);
 for(const unit of sd.场景.find(s=>s.规则标识.includes(r.稳定规则标识)).来源单元)qt.push({来源标识:unit,问题编号:q.问题编号});
}
const levelIsolated=draft.规则.filter(r=>r.用例设计.场景==='验证粉丝贡献榜最低粉丝等级');
const rules=draft.规则.filter(r=>!isolated.includes(r)&&!levelIsolated.includes(r));
const likeSource=units.find(u=>!u.风险&&u.行===39);
for(const [id,group,title,options] of [
 ['Q-USER-047','RG-LIVE-LIKE-ENTRY','直播点赞通过哪个用户端入口触发？',['双击直播画面','独立点赞按钮','同时提供双击和按钮']],
 ['Q-USER-048','RG-LIVE-LIKE-FEEDBACK','点赞成功后用户应能观察到哪种结果？',['仅互动动画','仅点赞数量变化','互动动画和数量变化']],
]){
 const q=structuredClone(questions[0]);Object.assign(q,{问题编号:id,需求组编号:group,功能模块:'直播',具体场景:'直播点赞',问题分类:'流程与状态',待决策问题:title,可选方案:options,测试建议:'当前两份MainBasis只有系统概要列出的点赞能力，未给出该项入口与反馈契约。明确后再补可执行用例，不能以常见直播产品行为作为确定预期。',已知依据:[`${likeSource.路径}：行39；${likeSource.原文}`],影响范围:['直播','直播点赞流程；公屏、送礼、关注和分享的已确认分支不受影响'],确认后待补用例:[id.endsWith('047')?'已确认点赞入口的触发操作':'已确认点赞成功后的可观察反馈'],已有用例编号:[]});questions.push(q);qt.push({来源标识:likeSource.标识,问题编号:id});
}
const scenes=sd.场景.filter(s=>rules.some(r=>r.稳定规则标识===s.规则标识[0]));
const deletedMember=basis.条款.find(c=>c.id==='REQ-a2041f1578e8');
questions.push({...structuredClone(questions[0]),问题编号:'Q-USER-049',需求组编号:'RG-DELETED-FAN-RANK',功能模块:'我的、主播中心',具体场景:'粉丝团贡献榜的已注销成员',问题分类:'业务规则',待决策问题:'粉丝团贡献榜仅展示有效团籍，但注销会解除团籍；已注销成员应继续显示历史贡献行吗？',可选方案:['排除已注销成员，历史数值仅保留在统计记录','保留已注销成员历史贡献行，名称为账号已注销且禁止访问主页'],测试建议:'建议A，与仅显示有效团籍一致；若需要历史成员榜单则选择B，并明确这是对有效团籍过滤的例外。',已知依据:[`${deletedMember.source.路径}：${deletedMember.source.位置}；${deletedMember.text}`,'同文档REQ-1804ee8d77c7限定当前有效团籍，COMMON-fan-exit说明注销解除关系'],影响范围:['用户App粉丝团贡献榜的注销成员过滤、名称及主页入口'],确认后待补用例:['注销成员榜单过滤及历史贡献显示','注销成员主页访问限制'],已有用例编号:[]});
// Candidate decisions are proposals, never business expectations. Make parameter choices answerable.
const amend=(n,v)=>Object.assign(questions.find(q=>q.问题编号===`Q-USER-${String(n).padStart(3,'0')}`),v);
questions.push({...structuredClone(questions.at(-1)),问题编号:'Q-USER-050',需求组编号:'RG-FAN-START-LEVEL',具体场景:'重新入团后的粉丝等级初始值',待决策问题:'重新入团后粉丝等级应显示0级还是1级？',可选方案:['各页面统一显示0级，新团籍从0开始累计','成长值清零，各页面最低显示1级'],测试建议:'建议B，区分成长值清零与等级下限；需产品明确后再生成初始等级展示用例。',已知依据:['统一需求文档.md：REQ-91d599404b3b、REQ-0f1b9b9f419d说明重新加入从0开始；REQ-d76a006722e5规定粉丝等级最低1级'],影响范围:['用户App重新加入粉丝团后的卡片、直播资料及贡献榜粉丝等级'],确认后待补用例:['重新入团初始粉丝等级','粉丝等级下限在各页面一致']});
for(const c of ['REQ-91d599404b3b','REQ-0f1b9b9f419d','REQ-d76a006722e5'])bindings.未决条款[c]='Q-USER-050';
amend(22,{待决策问题:'签到、任务、榜单、有效天和报表采用哪种业务时区策略？',可选方案:['全部统一Asia/Jakarta（UTC+7）','全部读取服务端同一业务时区配置'],测试建议:'建议A，印尼业务日易于核对；如产品已有统一可读取配置则选择B。'});
amend(23,{待决策问题:'周期任务的周起始日采用哪种策略？',可选方案:['全部以业务时区周一00:00开始','全部读取各任务可查询的周起始日配置']});
amend(28,{待决策问题:'用户App直播、收益和等级指标采用哪种更新时效？',可选方案:['每次变动后5秒内更新','按业务自然分钟汇总，变动后60秒内更新'],测试建议:'建议A用于可即时观察的指标；两项均为待评估候选时限，请技术确认可行性后由产品选择，当前不作为正式验收值。',负责人:'多方确认'});
amend(36,{可选方案:['保存整数，截去不足1金币部分','保存两位小数，截去其后位数','保存两位小数，按第三位四舍五入']});
amend(37,{父问题编号:'',追问触发条件:'',确认状态:'待确认'});
amend(38,{追问触发条件:'Q-USER-036选择B或C（保存两位小数）时',可选方案:['按存储值显示两位小数','四舍五入显示整数','截断显示整数']});
amend(41,{可选方案:['下一次加载资料时更新','重新登录后更新','图片缓存5分钟，到期后下一次加载更新']});
for(const [n,child,level]of [[33,51,'财富等级'],[34,52,'粉丝等级']]){
 const parent=questions.find(q=>q.问题编号===`Q-USER-0${n}`);
 Object.assign(parent,{待决策问题:`${level}是否计入幸运礼物？`,可选方案:['仅计入普通和定制礼物','普通、定制和幸运礼物均计入'],测试建议:'建议B，礼物范围完整；幸运礼物的计入金额由对应追问单独确认。'});
 questions.push({...structuredClone(parent),问题编号:`Q-USER-0${child}`,父问题编号:parent.问题编号,追问触发条件:`${parent.问题编号}选择B时`,具体场景:`${level}中的幸运礼物计入金额`,待决策问题:`幸运礼物按什么金额计入${level}？`,可选方案:['按成功送出价值计入，不扣返奖','按送出价值减返奖后的净消耗计入'],测试建议:'建议A，与已确认的贡献榜计入口径一致；等级口径仍须单独确认。',确认状态:'待前置结论'});
}
// Public identifiers and explicit parent links are normalized together.
const groupIds=new Map(),ids=new Map(),childCounts=new Map();let rootNo=0;
for(const q of questions){if(!groupIds.has(q.需求组编号))groupIds.set(q.需求组编号,`RQ-${String(groupIds.size+1).padStart(3,'0')}`);if(!q.父问题编号)ids.set(q.问题编号,`Q-${String(++rootNo).padStart(3,'0')}`);else{const p=ids.get(q.父问题编号);assert(p);const n=(childCounts.get(p)||0)+1;childCounts.set(p,n);ids.set(q.问题编号,`${p}-${String(n).padStart(2,'0')}`);}}
for(const q of questions){q.问题编号=ids.get(q.问题编号);q.需求组编号=groupIds.get(q.需求组编号);if(q.父问题编号)q.父问题编号=ids.get(q.父问题编号);for(const [a,b] of ids)q.追问触发条件=q.追问触发条件.replaceAll(a,b);}
for(const q of qt)q.问题编号=ids.get(q.问题编号)||q.问题编号;
for(const key of Object.keys(bindings.未决条款))bindings.未决条款[key]=ids.get(bindings.未决条款[key]);
const ordered=[];for(const group of groupIds.values()){const members=questions.filter(q=>q.需求组编号===group);const visit=q=>{ordered.push(q);members.filter(c=>c.父问题编号===q.问题编号).forEach(visit);};members.filter(q=>!q.父问题编号).forEach(visit);}questions.splice(0,questions.length,...ordered);
for(const r of rules){
 // Source bindings and semantic choices are fixed in the authored design, never inferred from prior workbooks.
 r.用例设计.步骤.forEach(s=>s.证据=[...new Set([...s.证据,r.证据引用.length-1])]);
 r.设计复核={状态:'通过',说明:decision.复核说明,设计SHA256:ruleDesignHash(r)};
}
const states=await read('state-transition-baseline.json');
const reportTransitions=[['LIVE-NONE','直播举报不处置通知','直播场次举报','不处置'],['LIVE-WARN','直播举报警告通知','直播场次举报','警告'],['LIVE-END','直播举报关播通知','直播场次举报','关播'],['LIVE-DISABLE','直播举报关闭权限通知','直播场次举报','关闭直播权限'],['ACCOUNT-NONE','账号举报不处置通知','账号举报','不处置'],['ACCOUNT-BAN','账号举报封禁通知','账号举报','封禁']];
for(const [key,title,object,outcome]of reportTransitions){const id=`ST-REPORT-${key}`,r=rules.find(r=>r.用例设计.场景===`验证${title}`);assert(r,title);if(!states.状态转换.some(s=>s.状态转换标识===id))states.状态转换.push({稳定规则标识:r.稳定规则标识,共同业务对象:object,来源状态:'举报待处理',触发动作:`平台判定${outcome}`,执行角色:'平台审核人员',操作端:'管理后台',目标状态:`${outcome}结果已通知举报人`,观察端:['用户App'],来源条款:scenes.find(s=>s.规则标识[0]===r.稳定规则标识).来源条款,证据引用:r.证据引用.slice(0,-1),状态转换标识:id});}
await save('state-transition-baseline.json',states);
// Explicit source-state-action projection. Only matched current designs can carry a transition.
const stateSelectors=[
 /Google已有账号登录/,/Google新账号分流/,/退出当前设备/,/倒计时完成提交/,/取消注销直接登录/,/最终注销解除好友/,
 /KTP入会申请提交|SIM入会申请提交/,/公会通过.*平台|公会审核通过/,/平台通过建立身份|平台通过最终节点/,/公会驳回/,/平台驳回/,
 /公会停用主播停止直播/,/最终权限关闭立即结束/,/平台锁定开启覆盖/,/解锁恢复公会旧关闭值/,
 /普通房开播|开始普通房|开播创建新场次|固定房间ID跨场次/,/确认结束直播/,/发送连麦邀请/,/接受连麦成功|接受使自己发出的邀请失效/,
 /确认退出双方继续直播/,/对方结束本方继续/,/同场已购票免重复收费/,/门票被踢出不退款/,/旧场门票不用于新场|结束场次保留消费记录/,
 /消费.*一次|成功送礼扣款/,/送礼不足不扣款/,/整笔充值退款形成负余额/,/负余额充值先抵扣/,/新场次恢复发言/,
 /退出粉丝团|主动退团|退团.*清零/,/重新入团亲密度归零/,/场次结束.*举报|举报.*结束/,/手动签到成功|签到金币到账/,/断签后从第一天开始/,/任务达标手动领取/,/逾期任务奖励失效/,/领取失败保留待领取/,
 ...reportTransitions.map(([,title])=>new RegExp(`^验证${title}$`)),
];
const projection=states.状态转换.map((st,i)=>{
 const applicable=st.操作端==='用户App'||st.观察端.includes('用户App');
 const matched=applicable?scenes.filter(s=>!s.状态转换标识&&stateSelectors[i]?.test(rules.find(r=>r.稳定规则标识===s.规则标识[0]).用例设计.场景)):[];
 for(const s of matched)s.状态转换标识=st.状态转换标识;
 return {状态转换标识:st.状态转换标识,状态:matched.length?'已映射':'未覆盖',说明:matched.length?`${st.来源状态}经${st.触发动作}到${st.目标状态}，由用户端契约观察；其他端动作仅作配合前置条件`:'当前转换尚未建立明确的端侧契约映射，保留生成缺口，不转交产品',场景标识:matched.map(s=>s.场景标识)};
}).filter(p=>{const st=states.状态转换.find(t=>t.状态转换标识===p.状态转换标识);return st.操作端==='用户App'||st.观察端.includes('用户App');});
Object.assign(projection.find(p=>p.状态转换标识==='ST-USER-031'),{状态:'待确认',问题编号:ids.get('Q-USER-050'),说明:'重入团亲密度归零已设计；初始粉丝等级存在0级与最低1级冲突，未声明该转换全部终态已覆盖'});
for(const r of rules){const s=scenes.find(s=>s.规则标识[0]===r.稳定规则标识),st=states.状态转换.find(t=>t.状态转换标识===s.状态转换标识);r.跨模块流程编号='';if(st){r.共同业务对象=st.共同业务对象;r.跨模块流程编号=`FLOW-${fingerprint(st.共同业务对象).slice(0,8).toUpperCase()}`;r.用例设计.备注=[`状态转换：${st.状态转换标识}；共同业务对象：${st.共同业务对象}；当前阶段：${st.触发动作}后的用户App观察`];}r.设计复核.设计SHA256=ruleDesignHash(r);}
const catalog={...draft,规则:rules};await save('business-rule-catalog.json',catalog);
const cases=casesFromCatalog(catalog,{moduleDirectory:basis.模块目录}),caseByRule=new Map(cases.map(c=>[c.备注.find(n=>n.startsWith('规则：')).slice(3),c]));
for(const s of scenes){const c=caseByRule.get(s.规则标识[0]);assert(c);s.用例编号=c.用例编号;s.用例契约={前置条件:c.前置条件,操作步骤:c.操作步骤,预期结果:c.预期结果};}
const library={schemaVersion:'1.0',目标范围:draft.目标范围,场景:scenes};
await save('test-scenario-library.json',library);
const byUnit=new Map();for(const s of scenes)for(const u of s.来源单元){if(!byUnit.has(u))byUnit.set(u,[]);byUnit.get(u).push(s);}
const clauseIds=new Map(basis.条款.filter(r=>r.end==='用户App').map(r=>[r.id,r]));
const sourceUnit=id=>/^MAIN-\d+$/.test(id)?units.find(u=>!u.风险&&u.行===Number(id.slice(5)))?.标识:clauseIds.get(id)?.unitId;
for(const [targets,pattern,page]of bindings.关联){
 const selected=scenes.filter(s=>new RegExp(pattern).test(rules.find(r=>r.稳定规则标识===s.规则标识[0]).用例设计.场景)&&(!page||s.入口===basis.页面[page].path));
 for(const id of targets){const unit=sourceUnit(id);assert(unit,id);if(selected.length)byUnit.set(unit,[...new Map([...(byUnit.get(unit)||[]),...selected].map(s=>[s.场景标识,s])).values()]);}
}
for(let round=0;round<aliases.映射.length;round++){
 let changed=false;
 for(const [id,refs] of aliases.映射){
  const target=clauseIds.get(id);assert(target,id);
  if(byUnit.has(target.unitId))continue;
  const matches=[...new Map(refs.flatMap(id=>byUnit.get(clauseIds.get(id)?.unitId)||scenes.filter(s=>s.来源条款.includes(id))).map(s=>[s.场景标识,s])).values()];
  if(matches.length){byUnit.set(target.unitId,matches);changed=true;}
 }
 if(!changed)break;
}
for(const [lineNumbers,refIds] of overview.映射){
 const matches=[...new Map(refIds.flatMap(id=>byUnit.get(clauseIds.get(id)?.unitId)||scenes.filter(s=>s.来源条款.includes(id))).map(s=>[s.场景标识,s])).values()];
 for(const n of lineNumbers){const u=units.find(u=>!u.风险&&u.行===n);if(u&&matches.length)byUnit.set(u.标识,[...new Map([...(byUnit.get(u.标识)||[]),...matches].map(s=>[s.场景标识,s])).values()]);}
}
const clauseByUnit=new Map(basis.条款.map(c=>[c.unitId,c]));
const pendingById=new Map(qt.filter(q=>q.来源问题).map(q=>[q.来源问题,q.问题编号]));
const sourceOptions=await fs.readFile(basis.输入[0].路径,'utf8');assert.equal(fingerprint(sourceOptions),basis.输入[0]['SHA-256']);
const coverage={schemaVersion:'1.0',来源指纹:fingerprint(units),交付性质:'部分覆盖',契约模式:'场景引用',场景库SHA256:fingerprint(library),逐项:[],状态转换处理:projection};
let activeRisk=null;
for(const u of units){
 const row={来源标识:u.标识,状态:'未覆盖',说明:'本条当前需求尚未完成全部分支映射；保留生成覆盖缺口，不计为业务待确认',分支:[]};
 const c=clauseByUnit.get(u.标识),assigned=byUnit.get(u.标识)||[];
 if(u.风险){
  if(u.原文.startsWith('- [PENDING-'))activeRisk=u.原文.match(/PENDING-[\w-]+/)?.[0];
  const q=pendingById.get(activeRisk);
  if(q&&(!/^#|^来源：/.test(u.原文))){row.状态='待确认';row.问题编号=q;row.说明='当前风险清单问题已进入用户App决策表，候选选项不生成正式预期';}
  else {row.状态='不适用';row.说明=activeRisk&&!q?'本项只影响本次未要求的公会App或管理后台操作':'风险文档标题或证据定位，不是独立测试规则';}
 }else if(assigned.length){
  row.状态='已覆盖';row.说明='当前来源直接映射到本轮独立编写的可执行场景；逐分支绑定条件、动作和结果';
  row.分支=assigned.map((s,i)=>({标识:`CB-${u.标识.slice(0,12)}-${i+1}`,状态:'已设计',说明:rules.find(r=>r.稳定规则标识===s.规则标识[0]).用例设计.场景,来源片段:u.原文,场景标识:s.场景标识,用例编号:s.用例编号}));
  const pending=u.原文.match(/PENDING-[\w-]+/g)?.find(id=>pendingById.has(id)),pendingQuestion=bindings.未决条款[c?.id]||pendingById.get(pending);
  if(pendingQuestion){row.状态='部分覆盖';row.分支.push({标识:`CB-${u.标识.slice(0,12)}-pending`,状态:'待确认',问题编号:pendingQuestion,说明:'该条包含未决分支；只交付与该问题无关的确定部分'});}
 }else if(bindings.未决条款[c?.id]){
  row.状态='待确认';row.问题编号=bindings.未决条款[c.id];row.说明='当前MainBasis中存在尚未解决的过滤范围冲突，未将任选分支作为确定预期';
 }else if(qt.some(q=>q.来源标识===u.标识)){
  row.状态='待确认';row.问题编号=qt.find(q=>q.来源标识===u.标识).问题编号;row.说明='页面去向缺少分支与唯一结果的对应关系，已隔离原候选并建立决策问题';
 }else if(c&&aliases.范围外[c.id]){
  row.状态='不适用';row.说明=aliases.范围外[c.id];
 }else if(c&&aliases.非业务[c.id]){
  row.状态='不适用';row.说明=aliases.非业务[c.id];
 }else if(/^#{1,6} |^来源：|^页面：|^<!--|^\| ?(?:---|端|模块|页面)|^本版从|^本文件|^本次依据当前|^>/.test(u.原文)||c?.id.startsWith('META-')||u.行>=3485||overview.结构说明.includes(u.行)){
  row.状态='不适用';row.说明='章节、来源说明或模块目录：用于范围/入口归属，不独立定义业务预期';
 }else if(overview.范围外.includes(u.行)){
  row.状态='不适用';row.说明=overview.说明;
 }else if(c?.end&&c.end!=='用户App'){
  row.状态='不适用';row.说明=`${c.end}自身操作不在本次用户App执行范围；跨端影响已通过系统概要及用户App规则独立投影`;
 }else if(u.行>=2036&&u.行<3485){
  row.状态='不适用';row.说明='公会App或管理后台自身操作章节，本次只生成用户App；不能伪装成本端操作';
 }
 if(bindings.范围说明[c?.id]||bindings.范围说明[`MAIN-${u.行}`])row.说明+='；'+(bindings.范围说明[c?.id]||bindings.范围说明[`MAIN-${u.行}`]);
 coverage.逐项.push(row);
}
coverage.语义复核={说明:'仅绑定当前 MainBasis 全文。明确保留未映射内容及未决分支；本阶段不声明完整交付。目录与标题不计业务覆盖。',内容SHA256:reviewHash(coverage)};
await save('requirement-coverage.json',coverage);
const atoms=units.filter(u=>!/^#|^来源：|^<!--/.test(u.原文)).map(u=>({原子标识:u.标识,来源:u.路径,位置:`行${u.行}`,原文:u.原文,性质:'来源核对单元，不作为覆盖率计数'}));
await save('evidence-atom-index.json',{schemaVersion:'1.0',证据原子:atoms});
const cmap=new Map(coverage.逐项.map(x=>[x.来源标识,x]));
await save('coverage-matrix.json',{schemaVersion:'1.0',规则处理:atoms.map(a=>{const row=cmap.get(a.原子标识);const ids=[...new Set(row.分支.filter(b=>b.状态==='已设计').map(b=>scenes.find(s=>s.场景标识===b.场景标识).规则标识[0]))];return {原子标识:a.原子标识,去向:ids.length?'正式用例':row.状态==='不适用'?'不适用':row.状态==='待确认'?'需求待确认':'未覆盖',依据:row.说明,规则标识:ids,...(row.问题编号?{问题编号:row.问题编号}:{})};})});
const scan=JSON.parse(await fs.readFile(`${parent}/global-evidence-scan-result.json`,'utf8'));
const files=[];async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(e.isFile())files.push({path:path.relative('liveshow-proto',f),hash:await hash(f)});}}
await walk('liveshow-proto');files.sort((a,b)=>a.path.localeCompare(b.path,'zh-CN'));
scan.项目指纹=fingerprint(files.map(f=>`${f.path}|${f.hash}`).join('\n'));
scan.项目接入基线.状态=scan.项目接入基线.接入状态;
scan.语义读取记录=basis.输入.map(f=>({路径:f.路径,SHA256:f['SHA-256'],结论:'本轮从当前两份MainBasis完整读取并逐页设计；其余上游内容不进入用例阶段',关联规则:rules.filter(r=>r.证据引用.some(e=>e.路径===f.路径)).map(r=>r.稳定规则标识)}));
await save('global-evidence-scan-result.json',scan);
const sync=JSON.parse(await fs.readFile(`${parent}/prototype-context-sync-result.json`,'utf8'));
sync.需求清单有修改=sync.文件核对.some(x=>x.修改前SHA256!==x.修改后SHA256);
await save('prototype-context-sync-result.json',sync);
const candidate={测试用例:cases,需求待确认:questions};
const candidateText=JSON.stringify(candidate,null,2)+'\n';
await save('semantic-dedup-review.json',{schemaVersion:'1.0',候选SHA256:fingerprint(candidateText),待人工复核:[],复核结果:rules.map(r=>({稳定规则标识:r.稳定规则标识,归一化业务键:`${r.功能模块}|${r.用例设计.观察页面路径}|${r.执行角色}|${r.用例设计.验证子项}`,状态关系:r.来源状态,关键操作:r.用例设计.步骤.map(x=>x.操作).join(' → '),可观察结果:r.目标状态或可观察结果,基础条件:r.必要条件,附加条件:[],判定:'保留',保留或合并目标:caseByRule.get(r.稳定规则标识).用例编号,判定理由:`保留${r.用例设计.场景}；移除角色/场次/账号关系/输入取值条件会改变本条适用分支，不能因相同结果文案合并。各字段单独观察，同页面的弹层细则按本轮来源追溯归并。`,证据:r.证据引用,候选用例追溯:[caseByRule.get(r.稳定规则标识).用例编号]}))});
await save('generation-isolation.json',{隔离:[...isolated.map(r=>({规则:r,问题编号:ids.get(decision.隔离.find(d=>d.场景===r.用例设计.场景).问题编号),可生成正式用例:false})),...levelIsolated.map(r=>({规则:r,问题编号:ids.get('Q-USER-050'),可生成正式用例:false,原因:'同一初始粉丝等级存在0级与1级冲突'}))],已生成问题:questions.length});
const types={'business-rule-catalog.json':'业务规则清单','current-testcase-candidate.json':'当前候选用例','final-testcases.json':'最终用例JSON'};
const names=['business-rule-catalog.json','test-scenario-library.json','state-transition-baseline.json','requirement-coverage.json','evidence-atom-index.json','coverage-matrix.json','global-evidence-scan-result.json','prototype-context-sync-result.json','semantic-dedup-review.json','generation-isolation.json'];
const manifest={schemaVersion:'1.0',项目名称:'Luma Live',任务标识:'liveshow-user-260915-001',项目目录:'liveshow-proto',任务工作目录:task,目标范围:draft.目标范围,生成策略:'current-evidence-only',历史策略:'不读取不比较',MainBasis基线:{路径:'work/liveshow-proto-mainbasis/latest.json','SHA-256':await hash('work/liveshow-proto-mainbasis/latest.json')},输入文件:[],当前业务规则清单:`${task}/business-rule-catalog.json`,生成脚本:`${task}/prepare-delivery.mjs`,当前候选用例:`${task}/current-testcase-candidate.json`,最终用例JSON:`${task}/final-testcases.json`,需求覆盖清单:`${task}/requirement-coverage.json`,独立场景库:`${task}/test-scenario-library.json`,状态转换基线:`${task}/state-transition-baseline.json`};
for(const [i,f] of basis.输入.entries())manifest.输入文件.push({...f,角色:i?'风险与缺口':'当前业务证据',内容类型:i?'需求待确认清单':'统一需求文档',允许定义业务规则:!i});
const register=async(n,role,type,may=false)=>manifest.输入文件.push({路径:`${task}/${n}`,'SHA-256':await hash(`${task}/${n}`),角色:role,内容类型:type,允许定义业务规则:may});
for(const n of names)await register(n,'本次派生产物',types[n]||'本轮追溯报告',n==='business-rule-catalog.json');
for(const n of ['basis-index.json','requirement-units.json','rule-design-review-draft.json','scene-design-review-draft.json','semantic-dispositions.json','questions-draft.json','question-trace.json','overview-coverage.json','clause-aliases.json','coverage-bindings.json','atomic-review.json',...(await fs.readdir(task)).filter(n=>n.endsWith('-design-draft.json'))])await register(n,'本次派生产物','本轮独立需求解析与设计');
for(const n of (await fs.readdir(task)).filter(n=>/\.(mjs|py)$/.test(n)))await register(n,'执行工具','当前任务生成工具');
await save('generation-input-manifest.json',manifest);
const pre=await validateGenerationInput(`${task}/generation-input-manifest.json`,process.cwd(),'pre-generate');
await save('pre-generate-validation.json',{...pre,需求覆盖:{...pre.需求覆盖,未完成项数量:pre.需求覆盖.未完成项.length,未完成项:undefined}});
await fs.writeFile(`${task}/current-testcase-candidate.json`,candidateText);
await fs.writeFile(`${task}/final-testcases.json`,candidateText);
for(const n of ['current-testcase-candidate.json','final-testcases.json'])await register(n,'本次派生产物',types[n]);
await save('generation-input-manifest.json',manifest);
console.log({正式用例:cases.length,待确认:questions.length,需求处理:pre.需求覆盖.条款处理统计,转换未映射:projection.filter(x=>x.状态!=='已映射')});
