import assert from 'node:assert/strict';
import {units,formalPath,formalHash} from './case-design.mjs';

// Read-only source selections made after reviewing the lifecycle inventory.
// Keep the initial inventory on disk; broad keyword hits are not transition proof.
const proof={
 'oauth-new':['REQ-bf43560617e5'],login:['REQ-bf43560617e5'],
 'profile-complete':['REQ-dbb54b52c62c'],logout:['REQ-7828a215227e','REQ-7a459170bf05'],
 'deletion-request':['REQ-135fd6241321'],'deletion-cancel':['REQ-3914ead21639'],'deletion-expire':['REQ-fb809f9f7a01'],
 'profile-pass':['- 头像和昵称修改后进入平台风控检测，通过后生效；检测不通过时保留原资料。其他资料直接保存。'],
 'profile-reject':['- 头像和昵称修改后进入平台风控检测，通过后生效；检测不通过时保留原资料。其他资料直接保存。'],
 'join-submit':['REQ-bad8f6fb0e31'],
 'join-guild-pass':['3. 公会通过后，申请进入平台终审，此时用户尚未加入公会，也未获得主播身份。'],
 'join-guild-reject':['2. 公会驳回后，申请单作废，用户可以重新提交申请。'],
 'join-platform-pass':['5. 平台通过后，用户加入公会并获得主播身份。'],
 'join-platform-reject':['4. 平台驳回后，申请单作废，用户可以重新提交申请。'],
 'leave-submit':['REQ-b07fa631b1b0'],'leave-pass':['REQ-552ffe98a013'],
 'leave-reject':['|驳回|主播|重新提交退会申请|\\-\\-|'],
 'remove-host':['REQ-e479d67b9151','REQ-552ffe98a013'],
 'guild-disable':['| 停用 | 由平台操作，公会冻结后，平台搜索不到、公会长无法登录、主播关系解除，名下主播失去主播身份并停止开播。所有业务数据保留，平台后台可查看 |'],
 'guild-enable':['REQ-68834a7974f0','REQ-41cbba51b71b'],
 'guild-dissolve':['REQ-24899ab93370'],
 'chief-disable':['| 停用 | 无法登录公会APP，对公会中主播无影响|'],
 'platform-live-close':['- 直播权限被关闭后，主播不能再次开播；正在直播时立即结束当前场次。','REQ-3bc8908ef0a3'],
 'platform-live-lock':['REQ-cd2d718980d8'],'platform-live-unlock':['REQ-cd2d718980d8'],
 'guild-live-toggle':['REQ-d7578655d74c','REQ-4fc6cf0d0919'],
 'start-live':['REQ-332bc7a429a3'],
 'end-live':['- 直播结束后关闭当前场次，历史消息、消费、处置和收益记录继续保留。'],
 'close-live':['|关播<br>|关闭当前直播间，不影响下次开播|直播中 → 已结束<br>|通知举报人同“警告”；通知主播：“直播间存在违规，平台已关闭直播间”|'],
 'account-ban':['|封禁账号|已登录账号强制下线，包含正在直播的账号；未登录账号禁止登录|正常 → 封禁|通知举报人：“举报成立，平台已依规处理”；被举报人登录时提示：“账号已封禁”|'],
 'account-unban':['REQ-cc33ba610d29','REQ-cc7a5d0e0aaf'],
 'cohost-invite':['REQ-c61820f3a34e'],'cohost-accept':['REQ-8e073f67f5ac'],
 'cohost-reject':['REQ-8e073f67f5ac'],
 'cohost-end':['|结束连麦|双方立即退出连麦画面，各自原直播仍继续|'],
 mute:['REQ-93ef57c009fe','REQ-941d07bff4b1'],kick:['REQ-e365cd2352ca'],
 ticket:['REQ-c610764f5eb7'],'ticket-expire':['REQ-c610764f5eb7'],
 follow:['REQ-08e236864c85'],unfollow:['REQ-99fc9d284772'],
 'friend-request':['|申请好友|向被申请人发送申请通知，已有申请时不能重复申请；被申请人同意后，双方成为好友|\\-|'],
 'friend-accept':['REQ-3defb9627768'],'friend-delete':['REQ-47f70d2f770d'],
 block:['REQ-751406869dfa'],unblock:['REQ-80008cfc0d32'],
 'fan-create':['REQ-1ee33d401eff','REQ-e2396617e63e'],
 'fan-join':['REQ-7a6c1f83dda8','REQ-60deeb4a1919'],
 'fan-exit':['|移除粉丝群成员<br>/ 主动退出粉丝群|退出粉丝群并卸下粉丝身份标识；<br>用户粉丝等级和亲密度清零，重新入团后从 0 开始累计|\\-|'],
 'fan-remove':['REQ-1da9b601c77a'],'fan-dismiss':['REQ-552ffe98a013','REQ-fb809f9f7a01'],
 'message-fail':['REQ-a11b5b0f63a1'],'message-retry':['REQ-a11b5b0f63a1'],
 'task-claim':['REQ-4d23a709cc93'],'task-expire':['REQ-a25125d70fce'],
 'ornament-buy':['REQ-57d7b7987914'],'ornament-expire':['REQ-0bf0bf9c7368'],
 'recharge-paid':['REQ-781fe0384137'],'recharge-fail':['REQ-781fe0384137','REQ-0f976a55a068'],
 refund:['REQ-6dce44b86571'],
 'report-submit':['REQ-15a86faa9547','REQ-773edb720337'],
 'report-handle':['|警告|主播直播间弹窗强提示<br>|直播中 → 直播中|通知举报人：“举报成立，平台已依规处理”；消息通知并弹窗提示主播：“直播间存在违规，请及时调整”|'],
 'report-void':['**直播间结束后，举报工单自动作废。**'],
 'ops-create':['REQ-18e6f92ab030'],'ops-issue':['REQ-ff9041624126','REQ-829bf72e5c0a'],
 'ops-disable':['REQ-6c9432dc3f2d'],'ops-platform-lock':['REQ-7e3fb4be88e3','REQ-5379eef2d1a9'],
 'host-upload':['REQ-1c7eff4b543d'],'guild-upload':['REQ-af506e13c518'],
 'balance-correct':['REQ-4d2a4bf5aa1c','REQ-6365054b6ccc'],
 'gift-off':['REQ-278c89968d7e','REQ-9e6288afeb1e'],
 'config-save':['REQ-12aaea005cec'],'role-disable':['REQ-e09955f48530'],
 'role-permission':['REQ-d4c238cdbcf8'],
};
export function refineStates(original){
 const states=structuredClone(original);
 assert.equal(Object.keys(proof).length,states.状态转换.length);
 for(const t of states.状态转换){
  const selectors=proof[t.状态转换标识.replace(/^ST-/,'')];assert(selectors,t.状态转换标识);
  t.证据=selectors.map(s=>{
   const found=units.filter(u=>s.startsWith('REQ-')?u.原文.includes(`**${s}**`):u.原文.trim()===s);
   assert.equal(found.length,1,`状态证据必须唯一：${s}`);
   return{路径:formalPath,'SHA-256':formalHash,行:found[0].行,原文:found[0].原文};
  });
  t.说明='已回读当前MainBasis的具体转换条款，移除仅因泛词命中的无关依据；本端投影仍独立核销。';
 }
 const fan=states.状态转换.find(t=>t.状态转换标识==='ST-fan-dismiss');
 Object.assign(fan,{触发动作:'主播退会通过、被公会移出或账号最终注销触发自动解散',执行角色:'系统'});
 const recharge=states.状态转换.find(t=>t.状态转换标识==='ST-recharge-fail');
 recharge.目标状态='支付未成功且不发放金币';
 recharge.说明+='后台只明确充值成功和已退款枚举，本转换不推定后台存在失败订单状态。';
 return states;
}

// These exact current-task scenarios were read with their conditions and results.
export const sceneTransitions=new Map([
 ['验证首次补全昵称长度为1','ST-profile-complete'],
 ['验证首次补全昵称长度为20','ST-profile-complete'],
 ['验证公会通知展示入会申请事件','ST-join-submit'],
 ['验证公会通知展示退会申请事件','ST-leave-submit'],
 ['验证平台审核只接收公会初审通过申请','ST-join-guild-pass'],
 ['验证入会驳回列表区分平台驳回','ST-join-platform-reject'],
 ['验证同主播两次开播生成不同场次','ST-start-live'],
 ['验证退会申请通过后原粉丝群不可访问','ST-fan-dismiss'],
 ['验证被公会移出后原粉丝群不可访问','ST-fan-dismiss'],
 ['验证面板打开后礼物被下架','ST-gift-off'],
 ['验证核对运营账号单笔发放余额的独立计算口径','ST-ops-issue'],
 ...['Google','Facebook','Apple ID','TikTok'].map(n=>[`验证${n}授权后命中封禁账号`,'ST-account-ban']),
 ...['主播','公会'].flatMap(n=>[
  [`验证${n}分成展示12.30美元`,n==='主播'?'ST-host-upload':'ST-guild-upload'],
  [`验证${n}分成展示-2.50美元`,n==='主播'?'ST-host-upload':'ST-guild-upload'],
  ...['10','-5'].map(v=>[`验证${n}余额修正${v}美元`,'ST-balance-correct']),
 ]),
]);
