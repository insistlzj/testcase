import {page,transitions,computed,v,op} from './design-current.mjs';
const U='用户App',G='公会App',A='管理后台';
function flow(object,from){const t=transitions.find(t=>t.共同业务对象===object&&t.来源状态===from);if(!t)throw Error(object);return {flow:t.流程编号,transition:t.状态转换标识};}
page(U,'interaction-notifications.html',['甲乙非好友且无拉黑关系；配合账号乙刚向执行账号甲提交好友申请F001，尚未处理']).add('收到新好友申请进入待处理通知',[],['打开互动通知','查看来自乙的好友申请F001'],[{point:'好友申请接收待处理',result:'F001显示待处理'}],[/好友申请|待处理/],flow('好友申请','双方非好友且无待审申请'));
page(G,'guild-join-review.html',['用户甲刚向当前公会乙提交新申请J001，尚未审核']).add('新申请进入公会初审队列',[],['打开入会审核','选择审核中','查看J001'],[{point:'新申请公会待审',result:'J001显示待公会审核'}],[/待公会|审核中/],flow('入会申请','无处理中申请'));
page(A,'admin-consumption-order-detail.html',['用户甲在S001成功购买100金币门票，生成门票订单T001']).add('后台记录当前场次门票消费',[],['打开消费订单','查询T001','打开T001详情'],[{point:'门票订单场次绑定',result:'T001消费类型为门票，所属直播场次为S001'}],[/消费类型|消费去向/],flow('场次门票','未购本场门票'));
for(const [end,key] of [[G,'guild-host-data.html'],[A,'admin-host-live-record-report.html']])page(end,key,['主播甲原在S001直播，已通过结束直播确认关闭S001；本次执行账号可以查看该主播的场次记录']).add('主播主动结束后保留原场次记录',[],['打开直播记录','查询主播甲','查看S001'],[{point:'主动结束后的场次记录',result:'S001记录保留结束时间'}],[/结束时间|场次|结束/],flow('直播场次','直播中'));
for(const [key,label,button] of [['account-password-set.html','设置','完成'],['account-password-reset.html','重置','重置密码']]){
 const p=page(U,key,['账号甲已绑定手机号+62 81234567890及邮箱qa.test@example.com；当前验证方式为手机号，验证码123456有效且未使用']);
 p.add(`${label}密码成功返回设置`,[],[`打开${p.p.name}`,'输入验证码123456','输入密码NewPass#2026','输入确认密码NewPass#2026',`点击${button}`],[{point:'密码保存成功返回',result:'返回设置页'}],[/校验成功|设置页/]);
 for(const [channel,account] of [['手机号','+62 81234567890'],['邮箱','qa.test@example.com']])p.add(`${label}后的密码用于${channel}登录`,[],[`打开${p.p.name}`,'输入验证码123456','输入密码NewPass#2026','输入确认密码NewPass#2026',`点击${button}`,'打开设置','点击退出登录','确认退出',`打开${channel}登录`,`输入${channel}${account}`,'选择密码登录','输入密码NewPass#2026','点击登录'],[{point:`${channel}共用新密码`,result:'登录账号甲并进入首页'}],[/手机号|邮箱|密码.*生效|密码登录/],{support:[/手机号和邮箱.*同一|手机号和邮箱均可使用|退出登录.*确认/]});
}
const pw=page(U,'account-password-change.html',['账号甲绑定邮箱qa.test@example.com，当前密码OldPass#2026']);
pw.add('修改成功后的新密码立即可用',[],['打开修改密码','输入当前密码OldPass#2026','输入新密码NewPass#2026','输入确认新密码NewPass#2026','点击完成','打开设置','点击退出登录','确认退出','打开邮箱密码登录','输入邮箱qa.test@example.com','输入密码NewPass#2026','点击登录'],[{point:'修改后新密码登录',result:'登录账号甲并进入首页'}],[/新密码立即生效/],{support:[/密码.*登录|退出登录.*确认/]});
const welfare=page(U,'welfare-center.html',['任务甲已启用且在有效期内，配置观看10分钟奖励10金币、30分钟奖励30金币；用户甲今日已累计观看30分钟且两档均未领，当前未到领取截止时间']);
welfare.add('同一任务多档奖励分别领取',[],['打开福利中心','点击任务甲10分钟档领取','查看30分钟档'],[{point:'多档奖励独立状态',result:'30分钟档仍可领取'}],[/每个条件独立领取一次/]);
welfare.add('同一任务另一档可以继续领取',[],['打开福利中心','点击任务甲10分钟档领取','点击30分钟档领取'],[{point:'多档领取成功',result:'30分钟档显示已领取'}],[/每个条件独立领取一次/]);
for(const key of ['system-notifications.html','interaction-notifications.html'])page(U,key,['当前账号仅有两条相同服务端时间的通知，ID为1001和1002']).add('相同时间通知按编号倒序',[],['打开通知列表'],[{point:'通知同时间排序',result:'通知1002排在1001之前'}],[/时间相同时按通知 ID/]);
const dm=page(U,'direct-message.html',['甲乙为好友，甲已发送测试消息M001，乙尚未进入该会话；乙为配合账号']);
dm.add('对方进入会话更新已读',['乙在本条查看前进入与甲的会话'],['打开与乙的私信','查看M001已读状态'],[{point:'私信读状态同步',result:'M001显示已读'}],[/对方进入会话/]);
for(const key of ['follower-list.html','my-following.html','friend-list.html']){
 const p=page(U,key,['本列表仅有昵称为TestAlpha的甲、昵称为Beta的乙']);
 for(const word of ['test','TEST',''])p.add(`用户名检索${word||'空值'}`,[],[`打开${p.p.name}`,word?`输入搜索词${word}`:'清空搜索词'],[{point:'关系列表模糊检索',result:word?'结果仅包含甲':'结果包含甲和乙'}],[/忽略大小写|空值展示/]);
}
for(const key of ['group-manage-member.html','group-manage-owner.html']){
 const p=page(U,key,['当前账号有粉丝群甲的有效访问权限，消息免打扰原为关闭']);
 p.add('群免打扰不阻止接收消息',['群内配合成员乙在开关保存后发送“免打扰接收测试”'],[`打开${p.p.name}`,'点击开启群消息免打扰','返回粉丝群聊天','查看最新消息'],[{point:'免打扰与消息接收隔离',result:'群内仍显示“免打扰接收测试”'}],[/不影响消息接收/]);
}
const fans=page(U,'views/live-room/fan-club-joined.html',['用户甲原属于主播乙粉丝团，粉丝等级和亲密度非0；已退出后重新满足条件加入乙的粉丝团']);
fans.add('重新入团不恢复历史成长',[],['打开主播乙直播间','打开已加入粉丝团信息'],[{point:'重新入团粉丝等级重置',result:'粉丝等级从0开始'},{point:'重新入团亲密度重置',result:'亲密度为0'}],[/重新加入从 0 开始/]);
const sum=page(A,'admin-data-overview.html',['日期D甲乙活跃、D+1甲丙活跃，均为已登录用户；甲乙丙的注册日期都在D之前，期间无其他用户']);
sum.add('数据总览活跃人数按日去重再求和',[],['打开数据总览','查询D至D+1'],[computed('活跃用户','D日去重数 + 次日去重数',{D日去重数:2,次日去重数:2},op('+',v('D日去重数'),v('次日去重数')),'人次')],[/各日打开 App/]);
const daily=page(A,'admin-daily-statistics.html',['日期D甲为当天新注册、乙为前一天注册；甲有两笔成功充值1和2USD、乙有一笔成功充值3USD、丙有失败充值9USD']);
daily.add('每日充值金额只统计支付成功',[],['打开每日统计','查询D'],[computed('总充值金额','甲订单一 + 甲订单二 + 乙订单',{甲订单一:1,甲订单二:2,乙订单:3},op('+',v('甲订单一'),v('甲订单二'),v('乙订单')),'USD'),{point:'每日充值人数去重',result:'总充值人数为2'},{point:'新用户充值人数',result:'新用户充值人数为1'},computed('新用户充值金额','甲订单一 + 甲订单二',{甲订单一:1,甲订单二:2},op('+',v('甲订单一'),v('甲订单二')),'USD')],[/总充值|新用户充值/]);
daily.add('退款按完成日统计且包含渠道退款',['充值均在D前完成；D日完成手动退款1USD和渠道退款2USD；D日申请的另一笔退款4USD于D+1才完成'],['打开每日统计','查询D'],[{point:'每日退款完成单数',result:'退款订单数为2'},computed('退款金额','手动完成 + 渠道完成',{手动完成:1,渠道完成:2},op('+',v('手动完成'),v('渠道完成')),'USD')],[/退款订单|主动退款和支付渠道退款/]);
page(A,'admin-host-statistics.html',['D日只有甲完成平台认证，乙仅公会初审通过，丙平台驳回']).add('新增主播只统计平台认证通过',[],['打开主播活跃汇总','查询D'],[{point:'新增主播终审时点',result:'新增主播为1'}],[/新增主播/]);
page(A,'admin-push-management.html',['推送P001给甲发送成功两次、乙一次、丙失败一次']).add('推送成功人数按账号去重',[],['打开推送管理','查看P001'],[{point:'成功发送人数',result:'发送人数为2'}],[/实际成功发送的去重账号数/]);
page(A,'admin-system-role.html',['测试角色R001只关联后台账号甲乙；另一角色关联丙']).add('角色关联账号数按当前绑定统计',[],['打开角色列表','查看R001'],[{point:'角色关联账号数量',result:'关联账号数为2'}],[/当前绑定该角色的后台账号数/]);
