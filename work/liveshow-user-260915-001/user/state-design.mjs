import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint} from '../../../scripts/requirement-traceability.mjs';
const task='work/liveshow-user-260915-001/user';
const basis=JSON.parse(await fs.readFile(`${task}/basis-index.json`,'utf8'));
// Independent lifecycle inventory, authored from current MainBasis before final scene projection.
const transitions=[
 ['账号','未登录且账号正常','完成有效凭证登录','普通用户','用户App','已登录','REQ-b176b815ee3f'],
 ['账号','新第三方账号尚无用户资料','完成第三方授权','未登录用户','用户App','进入资料补全','REQ-af1de9dc6f1d'],
 ['账号','已登录','确认退出登录','普通用户','用户App','当前设备未登录','REQ-fa68f3aa79be'],
 ['账号注销','无申请且金币小于100','确认注销并等待10秒','普通用户','用户App','七日冷静期','REQ-68795c484bd7'],
 ['账号注销','七日冷静期','取消注销','普通用户','用户App','恢复正常账号','REQ-b22f236ee654'],
 ['账号注销','七日冷静期','七日届满','系统','系统','最终注销且关系删除','REQ-d52be80ea0fa'],
 ['入会申请','无在途申请且未入会','提交入会申请','普通用户','用户App','公会初审中','COMMON-identity'],
 ['入会申请','公会初审中','公会同意申请','公会长','公会App','平台终审中且仍未成为主播','COMMON-identity'],
 ['入会申请','平台终审中','平台通过申请','平台审核员','管理后台','已入会且取得主播身份','COMMON-identity'],
 ['入会申请','公会初审中','公会驳回申请','公会长','公会App','申请作废可重新申请','COMMON-identity'],
 ['入会申请','平台终审中','平台驳回申请','平台审核员','管理后台','申请作废可重新申请','COMMON-identity'],
 ['公会关系','公会启用且用户为旗下主播','平台停用公会','平台管理员','管理后台','解除公会关系并失去主播身份','COMMON-guild-stop'],
 ['直播权限','最终允许开播且正在直播','最终直播权限变为关闭','系统','系统','当前直播结束且不能开播','COMMON-permission'],
 ['直播权限','平台开启且未锁定','平台锁定开启权限','平台管理员','管理后台','最终允许开播且公会旧值保留','COMMON-permission'],
 ['直播权限','平台开启且锁定','平台解锁权限','平台管理员','管理后台','恢复原公会权限并重算最终权限','COMMON-permission'],
 ['直播场次','有主播身份及有效开播权限且未开播','开播','主播','用户App','固定房间下产生新场次','COMMON-session'],
 ['直播场次','正在直播','结束直播','主播','用户App','场次结束且历史快照保留','COMMON-session'],
 ['连麦邀请','双方普通房且未连麦、无拉黑','发送连麦邀请','主播','用户App','一个已发出邀请待回应','COMMON-cohost'],
 ['连麦邀请','收到有效邀请且未连麦','接受邀请','受邀主播','用户App','双方连麦且自己发出邀请失效','COMMON-cohost'],
 ['连麦会话','双方正在连麦直播','结束连麦','连麦主播','用户App','双方各自直播继续','COMMON-cohost'],
 ['连麦会话','双方正在连麦直播','其中一方结束直播','连麦主播','用户App','该连麦会话失效','COMMON-cohost'],
 ['门票资格','当前场次无票且可购买','成功购票','真实金币用户','用户App','本场可重复入场','COMMON-ticket'],
 ['门票资格','当前场次已购票','主播踢出用户','主播','用户App','本场票失效且不退款','COMMON-ticket'],
 ['门票资格','当前场次已购票','场次结束','主播','用户App','本场票失效且不退款','COMMON-ticket'],
 ['消费订单','余额及消费资格满足','消费成功','真实金币用户','用户App','只扣款一次并生成消费记录','COMMON-consume'],
 ['消费订单','余额不足或资格检查失败','尝试消费','真实金币用户','用户App','消费失败且不扣款','COMMON-consume'],
 ['充值订单','已到账且对应金币已部分消费','退款处理成功','系统','系统','扣回整笔到账金币且可形成负余额','COMMON-refund'],
 ['金币账户','负余额','充值到账','真实金币用户','用户App','到账金币先抵扣负余额','COMMON-refund'],
 ['直播禁言','本场已被禁言','下一场重新进入','普通用户','用户App','恢复公屏发言权限','COMMON-mute'],
 ['粉丝团关系','已加入粉丝团','主动退出粉丝团','粉丝团成员','用户App','团籍群权限及标识删除、等级亲密度清零','COMMON-fan-exit'],
 ['粉丝团关系','此前已退团','重新加入','普通用户','用户App','从零累计新团籍','COMMON-fan-exit'],
 ['场次举报','本场举报待处理','被举报场次结束','系统','系统','待处理场次举报作废','COMMON-report-end'],
 ['手动签到','今日未签到','点击签到成功','普通用户','用户App','今日已签到且入账奖励','REQ-4d0358d54570'],
 ['手动签到','上一日未手动签到','今日签到成功','普通用户','用户App','连续天数重置为第一天','REQ-87b984d32f90'],
 ['任务奖励','本周期条件已达成且未过期','手动领取成功','普通用户','用户App','该条件已领取且金币入账','REQ-c1796e8ee348'],
 ['任务奖励','已达成且未领取','领取有效期结束','系统','系统','奖励失效不能补领','REQ-dcd9abdf8544'],
 ['任务奖励','达标且未领取','领取请求失败','普通用户','用户App','仍未领取且允许重试','REQ-4a4228d2744b'],
];
const rules=transitions.map(([object,from,action,role,end,to,id],i)=>{
 const source=basis.条款.find(r=>r.id===id&&r.end==='用户App')||basis.条款.find(r=>r.id===id);assert(source,id);
 return {稳定规则标识:`LIFECYCLE-${String(i+1).padStart(3,'0')}`,共同业务对象:object,来源状态:from,触发动作:action,执行角色:role,操作端:end,目标状态:to,观察端:object==='场次举报'?['管理后台']:['用户App'],来源条款:[source.id],证据引用:[source.source]};
});
await fs.writeFile(`${task}/lifecycle-rule-baseline.json`,JSON.stringify({schemaVersion:'1.0',输入:basis.输入,规则:rules},null,2)+'\n');
await fs.writeFile(`${task}/state-transition-baseline.json`,JSON.stringify({schemaVersion:'1.0',规则基线SHA256:fingerprint(rules),状态转换:rules.map((r,i)=>({...r,状态转换标识:`ST-USER-${String(i+1).padStart(3,'0')}`}))},null,2)+'\n');
console.log({独立生命周期转换:rules.length});
