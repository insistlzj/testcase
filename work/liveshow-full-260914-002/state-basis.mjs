import fs from 'node:fs/promises';
import path from 'node:path';
import {formal,hashes,task} from './read-basis.mjs';
import {ref} from './design-cases.mjs';
// This inventory is authored from MainBasis states before final scenario/case materialization.
// Observation ends describe product-visible results, not every system touched by the operation.
const rows=[
 ['JOIN-SUBMIT','入会申请','无处理中申请、未入会','提交完整认证资料','用户','用户App','公会初审待审核',['用户App','公会App'],'guild-application-form.html','提交成功','FLOW-GUILD-JOIN'],
 ['JOIN-FIRST-PASS','入会申请','公会初审待审核','公会初审通过','公会长','公会App','平台终审待审核、申请人仍为普通用户',['用户App','公会App','管理后台'],'guild-application-form.html','公会初审和平台终审','FLOW-GUILD-JOIN'],
 ['JOIN-FIRST-REJECT','入会申请','公会初审待审核','公会驳回','公会长','公会App','申请失效、未入会',['用户App','公会App'],'guild-application-form.html','任一方驳回','FLOW-GUILD-JOIN'],
 ['JOIN-FINAL-PASS','入会申请','平台终审待审核','平台终审通过','平台管理员','管理后台','加入公会、取得主播身份',['用户App','公会App','管理后台'],'admin-host-review-detail.html','通过后加入申请公会','FLOW-GUILD-JOIN'],
 ['JOIN-FINAL-REJECT','入会申请','平台终审待审核','平台驳回','平台管理员','管理后台','申请失效、未入会',['用户App','公会App','管理后台'],'guild-application-form.html','任一方驳回','FLOW-GUILD-JOIN'],
 ['LEAVE-SUBMIT','退会申请','已入会、无处理中退会申请','提交退会原因','主播','用户App','退会待审核',['用户App','公会App'],'guild-leave-application.html','提交成功','FLOW-GUILD-LEAVE'],
 ['LEAVE-PASS','公会主播关系','退会待审核','通过退会申请','公会长','公会App','退会、失去主播身份、结束当前直播',['用户App','公会App'],'guild-leave-application.html','退会申请通过','FLOW-GUILD-LEAVE'],
 ['LEAVE-REJECT','公会主播关系','退会待审核','驳回退会申请','公会长','公会App','已加入、保留主播身份',['用户App','公会App'],'guild-leave-application.html','公会驳回','FLOW-GUILD-LEAVE'],
 ['LIVE-START','直播场次','有开播权限、未开播','开始直播','主播','用户App','新场次直播中',['用户App','公会App','管理后台'],'start-live-settings.html','每次开播创建新的直播场次','FLOW-LIVE'],
 ['LIVE-END','直播场次','直播中','主播结束直播','主播','用户App','本场已结束',['用户App','公会App','管理后台'],'live-end-host.html','结束后关闭','FLOW-LIVE'],
 ['LIVE-CLOSE','直播场次','直播中','平台关播','平台管理员','管理后台','本场已结束',['用户App','公会App','管理后台'],'admin-live-management.html','关播 ->','FLOW-LIVE-DISPOSITION'],
 ['LIVE-PERMISSION-OFF','直播权限','直播权限开启','平台关闭直播权限','平台管理员','管理后台','直播权限关闭、当前场次结束',['用户App','公会App','管理后台'],'admin-host-list.html','平台关闭直播权限时','FLOW-LIVE-PERMISSION'],
 ['REPORT-LIVE-VOID','直播举报','待处理且关联场次直播中','关联场次结束事件','系统','管理后台','举报已作废',['管理后台'],'admin-report-handling.html','工单自动作废','FLOW-LIVE-REPORT'],
 ['REPORT-LIVE-DONE','直播举报','待处理且关联场次直播中','提交举报处理结果','平台管理员','管理后台','已处理',['管理后台'],'admin-report-detail.html','处置类型：','FLOW-LIVE-REPORT'],
 ['ACCOUNT-BAN','账号','正常','平台封禁账号','平台管理员','管理后台','封禁',['用户App','管理后台'],'admin-user-list.html','填写原因并确认','FLOW-ACCOUNT-BAN'],
 ['ACCOUNT-UNBAN','账号','封禁','平台解封账号','平台管理员','管理后台','正常但原直播权限独立保留',['用户App','管理后台'],'admin-user-detail.html','解封只恢复登录','FLOW-ACCOUNT-BAN'],
 ['DELETION-REQUEST','账号注销','未申请注销、余额低于100','确认注销并完成10秒倒计时','用户','用户App','七日注销冷静期',['用户App'],'settings.html','倒计时结束','FLOW-ACCOUNT-DELETION'],
 ['DELETION-CANCEL','账号注销','七日注销冷静期','取消注销','待注销用户','用户App','正常账号、原有数据保留',['用户App'],'views/auth-login-register/deletion-cooling.html','取消注销','FLOW-ACCOUNT-DELETION'],
 ['DELETION-FINAL','账号注销','七日注销冷静期未取消','七日期满','系统','用户App','最终删除、关系解除、所建粉丝团解散',['用户App'],'settings.html','期满仍未取消','FLOW-ACCOUNT-DELETION'],
 ['RECHARGE-SUCCESS','充值订单','待支付','支付成功','用户','用户App','已支付并到账一次',['用户App','管理后台'],'recharge.html','重复支付回调','FLOW-RECHARGE'],
 ['RECHARGE-CANCEL','充值订单','待支付','取消支付','用户','用户App','已取消、余额未增加',['用户App'],'recharge.html','超时自动取消','FLOW-RECHARGE'],
 ['REFUND-DONE','充值退款','充值支付成功未退款','手动全额退款','平台管理员','管理后台','原单退款、扣回原到账金币',['用户App','管理后台'],'admin-recharge-order-detail.html','手动退款','FLOW-RECHARGE-REFUND'],
 ['GIFT-SUCCESS','礼物消费','礼物有效、余额充足、场次直播中','赠送礼物成功','用户','用户App','消费成功、扣款一次',['用户App','公会App','管理后台'],'views/live-room/gift.html','余额充足并赠送成功','FLOW-GIFT'],
 ['TASK-CLAIM','任务奖励','今日已达标未领取','领取任务奖励成功','用户','用户App','已领取、金币到账一次',['用户App'],'welfare-center.html','领取成功后','FLOW-TASK'],
 ['TASK-EXPIRE','任务奖励','获得当天未领取','超过领取日截止时间','系统','用户App','奖励失效',['用户App'],'welfare-center.html','奖励已失效','FLOW-TASK'],
 ['FAN-JOIN','粉丝团团籍','未加入且满足加入条件、人数未满','加入粉丝团','用户','用户App','团籍和群籍有效',['用户App'],'views/live-room/fan-club-not-joined.html','500','FLOW-FAN-CLUB'],
 ['FAN-EXIT','粉丝团团籍','团籍有效','确认退出粉丝团','用户','用户App','团籍和群籍解除、等级亲密度清零',['用户App'],'views/live-room/fan-club-joined.html','主动退出','FLOW-FAN-CLUB'],
 ['PROP-EXPIRE','装扮资产','未过期且已佩戴','有效期届满','系统','用户App','过期并解除穿戴',['用户App'],'my-decoration.html','过期道具','FLOW-PROP'],
 ['SETTLEMENT-IMPORT','线下分成批次','导入预览尚未提交','确认导入','平台管理员','管理后台','生成不可改删分成记录',['用户App','公会App','管理后台'],'admin-settlement-record.html','确认导入','FLOW-SETTLEMENT'],
 ['SETTLEMENT-ADJUST','线下分成余额','账户余额已存在','提交有效正负修正','平台管理员','管理后台','新增不可改流水及新余额',['公会App','管理后台'],'admin-host-balance-change-record.html','变更金额：','FLOW-SETTLEMENT-ADJUST'],
 ['GUILD-DISABLE','公会','启用','停用公会','平台管理员','管理后台','停用、旗下主播退出',['用户App','公会App','管理后台'],'admin-guild-list.html','公会停用','FLOW-GUILD-DISABLE'],
 ['GUILD-DISSOLVE','公会','未解散且未结收益为0','解散公会','平台管理员','管理后台','已解散终态',['公会App','管理后台'],'admin-guild-list.html','未结收益为 0','FLOW-GUILD-DISSOLVE'],
 ['COHOST-INVITE','连麦邀请','双方普通房直播、未连麦、无有效发出邀请','发起邀请','主播','用户App','邀请中',['用户App'],'views/live-room-host/cohost-hosts.html','邀请成功','FLOW-COHOST'],
 ['COHOST-ACCEPT','连麦邀请','收到有效邀请、双方未连麦','接受邀请','主播','用户App','两人连麦；已发出邀请失效；其他收到邀请保留',['用户App'],'views/live-room-host/cohost-invite-notice.html','接受 ->','FLOW-COHOST'],
 ['COHOST-REJECT','连麦邀请','收到有效邀请','拒绝邀请','主播','用户App','本邀请关闭',['用户App'],'views/live-room-host/cohost-invite-notice.html','拒绝 ->','FLOW-COHOST'],
 ['COHOST-EXIT','连麦关系','两位主播连麦中','确认退出连麦','主播','用户App','各自恢复单人直播',['用户App'],'views/live-room-cohost-active/cohost-exit-confirm.html','确认 ->','FLOW-COHOST'],
 ['FRIEND-ACCEPT','好友关系','收到有效待处理好友申请','同意好友申请','用户','用户App','双向好友关系成立',['用户App'],'interaction-notifications.html','同意 ->','FLOW-FRIEND-DM'],
 ['FRIEND-REJECT','好友申请','收到有效待处理好友申请','拒绝好友申请','用户','用户App','不建立好友关系、申请已拒绝',['用户App'],'interaction-notifications.html','拒绝 ->','FLOW-FRIEND-DM'],
 ['FRIEND-REMOVE','好友关系','有效好友、存在会话记录','确认删除好友','用户','用户App','解除好友、清空双方聊天、不自动取消关注',['用户App'],'views/user-home/friend.html','删除好友只解除','FLOW-FRIEND-DM'],
 ['ACCOUNT-BLOCK','账号拉黑关系','未拉黑','确认拉黑','用户','用户App','拉黑成立、按规则解除双方社交及房管关系',['用户App'],'blacklist-management.html','拉黑后双向解除','FLOW-BLOCK'],
 ['ACCOUNT-UNBLOCK','账号拉黑关系','本人拉黑记录有效','确认取消拉黑','用户','用户App','仅删除本人拉黑记录、历史关系不恢复',['用户App'],'blacklist-management.html','取消拉黑不恢复','FLOW-BLOCK'],
 ['ROOM-MUTE','本场禁言','用户本场可发言','主播或房管确认禁言','房管','用户App','本场公屏禁言、不影响其他允许行为',['用户App'],'views/live-room/profile-moderator-mute.html','确认 ->','FLOW-ROOM-MUTE'],
 ['ROOM-RESTORE','本场禁言','当前场次仍禁言','连续确认恢复发言','主播','用户App','本场恢复发言、移出禁言列表',['用户App'],'views/live-room-host/restore-speaking-confirm.html','连续完成两次','FLOW-ROOM-MUTE'],
 ['ROOM-KICK','场次准入','用户本场在线','确认踢出','房管','用户App','离开本场、本场不得重进',['用户App'],'views/live-room/profile-moderator-remove.html','确认 ->','FLOW-ROOM-KICK'],
 ['MODERATOR-GRANT','房管授权','非房管、人数小于3、无拉黑及房间黑名单','添加房管','主播','用户App','长期房管授权有效',['用户App'],'moderator-management.html','最多 3','FLOW-MODERATOR'],
 ['MODERATOR-BLOCK','房管授权','房管授权有效','任一方账号拉黑','用户','用户App','房管授权立即解除',['用户App'],'moderator-management.html','自动解除','FLOW-MODERATOR'],
 ['OP-ISSUE','运营虚拟余额','账号与公会有效、额度充足','公会发放虚拟金币','公会长','公会App','虚拟余额和本月已发额度增加',['公会App','管理后台'],'guild-operation-account-detail.html','发放上限','FLOW-OPERATION-ISSUE'],
 ['OP-DISABLE','运营账号','启用','停用运营账号','公会长','公会App','停用、原余额及历史记录保留',['用户App','公会App','管理后台'],'guild-operation-account-detail.html','禁用','FLOW-OPERATION-ACCOUNT'],
 ['GROUP-MUTE','群发言权限','有效团籍且可发言','确认单人禁言','主播','用户App','本群禁止发言、其他身份不变',['用户App'],'views/fan-club/member-mute-confirm.html','确认 ->','FLOW-FAN-CLUB'],
 ['ROOM-SCOPE','本场密码房准入','在线观众在有效授权名单','取消勾选在线用户','主播','用户App','立即踢出本场、无二次确认',['用户App'],'views/live-room-host-password/visible-scope.html','取消勾选在线用户','FLOW-ROOM-SCOPE'],
 ['GIFT-COUNT-DISABLE','赠送数量规则','关联礼物的数量规则启用','停用规则','平台管理员','管理后台','关联礼物恢复只可赠送1份',['用户App','管理后台'],'admin-gift-send-count-rules.html','默认仅支持 ×1','FLOW-GIFT-CONFIG']
];
export const transitions=rows.map(([id,obj,from,action,role,end,to,observe,key,word,flow])=>{
 const r=ref(key,word);return {状态转换标识:'TR-'+id,共同业务对象:obj,来源状态:from,触发动作:action,执行角色:role,操作端:end,目标状态:to,观察端:observe,流程编号:flow,证据:[{路径:formal,'SHA-256':hashes[formal],行:r.行,原文:r.原文}]};
});
if(process.argv[1]===import.meta.filename){await fs.writeFile(path.join(task,'state-transition-baseline.json'),JSON.stringify({来源:hashes,状态转换:transitions},null,2)+'\n');console.log(transitions.length);}
