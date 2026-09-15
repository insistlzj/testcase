import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const task='work/liveshow-user-260915-001/user',source='liveshow-proto/MainBasis/需求待确认清单.md';
const text=await fs.readFile(source,'utf8');
const modules={
 'profile-live-entry':'我的','badge-location':'我的、消息与社交、直播','badge-auto':'我的','badge-wear':'我的','reward-prop-conflict':'首页与福利、我的',
 'virtual-board':'首页与福利、直播','search-sort':'首页与福利','follower-sort':'消息与社交、主播中心','friend-sort':'消息与社交','profile-clubs-sort':'消息与社交',
 'moderator-sort':'主播中心、直播','guild-notice-sort':'主播中心','fan-tie':'主播中心','live-detail-sort':'主播中心','country-sort':'系统入口','operation-login-format':'系统入口',
 'intimacy':'我的、消息与社交、直播、主播中心','intimacy-decay':'我的、消息与社交、直播、主播中心','rank-unlisted':'我的','rank-missing':'我的','checkin-repair':'首页与福利',
 'business-zone':'首页与福利、直播、主播中心','reward-disabled':'首页与福利','effective-duration':'主播中心','cross-day-live':'主播中心','metric-latency':'主播中心、直播、我的',
 'first-recharge':'钱包与账单','first-recharge-hide':'钱包与账单','recharge-expiry':'钱包与账单、直播','recharge-empty':'钱包与账单、直播',
 'level-gift-scope':'我的、直播、主播中心','club-level-attribution':'我的、主播中心','coin-precision':'钱包与账单、直播、主播中心','level-reversal':'我的、主播中心',
 'level-history':'我的、消息与社交、直播、主播中心','badge-refresh':'我的、消息与社交、直播','badge-fallback':'我的、消息与社交、直播','share-detail':'主播中心','group-report':'消息与社交'
};
const questions=[],trace=[];
function add(key,title,ask,options,line,raw,extra={}){
 const id=`Q-USER-${String(questions.length+1).padStart(3,'0')}`;
 assert(modules[key],key);assert(options.length>=2&&options.length<=4);
 const category=/排序|顺序|金额|精度|统计|时区|时长|贡献|等级/.test(title)?'计算与统计口径':/权限|账号|入口|对象/.test(title)?'角色与权限':/图片|图|文案|提示/.test(title)?'交互与文案规则':'业务规则';
 questions.push({问题编号:id,需求组编号:`RG-${key.toUpperCase()}`,父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:modules[key],具体场景:title,问题分类:category,待决策问题:ask,可选方案:options,测试建议:`请明确${title}的唯一口径及适用范围；确认前不将候选方案作为确定性预期。`,产品结论:'',结论补充:'',已知依据:[`${source}：行${line}；${raw}`],影响范围:[modules[key],`仅隔离${title}相关的未确认分支；已确认功能继续测试`],已有用例编号:[],确认后待补用例:[`${title}的选定规则主流程`,`${title}的边界及失败分支`],负责人:category==='交互与文案规则'?'交互':category==='计算与统计口径'?'多方确认':'产品',期望确认时间:'相关功能验收前',确认状态:'待确认',...extra});
 trace.push({来源行:line,来源问题:`PENDING-${key}`,问题编号:id});return id;
}
for(const [i,line] of text.split(/\r?\n/).entries()){
 const m=line.match(/^- \[PENDING-([^\]]+)\] ([^：]+)：(.+?) 选项：(.+?)。影响端：([^。]+)。/);if(!m||!m[5].includes('用户App'))continue;
 const [,key,title,ask,opts]=m,options=opts.split(/[；;](?=[A-D]\. )/).map(s=>s.replace(/^[A-D]\. /,''));
 if(key==='business-zone'){
  add(key,'业务时区', '签到、任务、榜单、有效天和报表采用统一时区，还是分别配置时区？请在结论补充中写明时区。',['全端统一指定业务时区','按业务分别指定时区'],i+1,line);
  add(key,'任务周起始日','周期任务是否统一从周一开始统计？',['全部周期任务按周一开始','各任务分别指定周起始日'],i+1,line);continue;
 }
 if(key==='cross-day-live'){
  for(const metric of ['有效时长','收益'])add(key,`跨日直播${metric}归属`,`跨自然日场次的${metric}如何归属到业务日？`,['按实际发生时间切分到各日','全部归入开播日'],i+1,line);continue;
 }
 if(key==='level-gift-scope'){
  for(const level of ['财富等级','粉丝等级'])add(key,`${level}礼物计入口径`,`${level}计入哪些礼物类型，幸运礼物采用送出价值还是扣除返奖后的净消耗？`,['全部真实礼物按送出价值计入','全部真实礼物按净消耗计入','按该等级类型配置礼物范围和价值口径'],i+1,line);continue;
 }
 if(key==='coin-precision'){
  const parent=add(key,'小数收益存储精度','不足1金币的单笔幸运礼物收益如何存储？',['每笔截断为整数','保留明确位数的小数','按明确位数四舍五入'],i+1,line);
  add(key,'小数收益累计顺序','小数收益先逐笔处理精度再累计，还是先累计再处理精度？',['逐笔处理精度后相加','保留原精度相加后统一处理'],i+1,line,{父问题编号:parent,追问触发条件:'存储方式及精度明确后',确认状态:'待前置结论'});
  add(key,'小数收益展示','客户端展示小数收益时采用什么规则？',['显示与存储相同精度','按指定精度四舍五入显示','按指定精度截断显示'],i+1,line,{父问题编号:parent,追问触发条件:'存储方式及精度明确后',确认状态:'待前置结论'});continue;
 }
 if(key==='share-detail'){
  add(key,title,'点击主播分成记录后，本期是否提供独立详情页？',options,i+1,line);continue;
 }
 add(key,title,ask,options,i+1,line);
}
await fs.writeFile(`${task}/questions-draft.json`,JSON.stringify(questions,null,2)+'\n');
await fs.writeFile(`${task}/question-trace.json`,JSON.stringify(trace,null,2)+'\n');
console.log({待确认:questions.length,原始用户风险:new Set(trace.map(x=>x.来源问题)).size});
