import {scenario as s,observe as o,navigation as nav,context,question} from './design.mjs';
import {link} from './supplement.mjs';

for(const [id,event,title] of [
 ['G-guild-notifications-005','本公会收到新的入会申请','入会申请待初审'],
 ['G-guild-notifications-005','平台已通过本公会一名申请人的终审','平台终审结果'],
 ['G-guild-notifications-005','平台已驳回本公会一名申请人的终审','平台终审结果'],
 ['G-guild-notifications-005','本公会主播提交退会申请','退会申请待审核'],
 ['G-guild-notifications-006','平台已关闭本公会主播的直播场次','关闭直播场次'],
 ['G-guild-notifications-006','平台已关闭本公会主播的直播权限','关闭直播权限'],
 ['G-guild-notifications-006','平台已恢复本公会主播的直播权限','恢复直播权限'],
 ['G-guild-notifications-007','平台已改变本公会状态','公会状态变更'],
 ['G-guild-notifications-007','平台已改变本公会长账号状态','公会长账号状态变更'],
 ['G-guild-notifications-007','平台已改变本公会运营账号管理权限','运营账号管理权限变更'],
 ['G-guild-notifications-008','本公会主播新增分成结果','主播分成新增'],
 ['G-guild-notifications-008','本公会新增公会分成结果','公会分成新增'],
 ['G-guild-notifications-008','本公会主播分成结果已冲正','主播分成冲正'],
 ['G-guild-notifications-008','本公会分成结果已冲正','公会分成冲正']
])s([id,'G-guild-notifications-002'],`${title}通知归属`,[event,'公会长当前账号允许登录，通知已写入该公会通知列表'],['刷新通知列表','查看该事件的通知摘要'],`摘要展示该公会内的事件对象及${title}结果`);

for(const label of ['累计最多','本月最多','最新加入'])s('U-fan-club-009',`选择${label}成员视角`,['当前主播粉丝团存在两名有效成员'],[`点击「${label}」`],`当前选中「${label}」，列表仍为本团有效成员`);
for(const [id,point,data,expected] of [
 ['U-guild-management-003','当前公会身份','当前账号已加入公会甲，已记录甲的头像、名称和ID','公会身份卡展示甲的头像、名称和ID'],
 ['U-guild-management-004','公会简介内容','公会甲简介为「欢迎加入」，当前账号已加入甲','简介显示「欢迎加入」'],
 ['U-guild-management-005','公会主播人数','当前公会恰有3名在会主播','主播人数显示3'],
 ['U-guild-application-records-004','申请记录公会标识','当前账号向公会甲申请，已记录甲的ID','该申请卡片的公会ID为甲的ID'],
 ['A-admin-guild-list-002','公会列表身份','存在两个ID不同的公会，已记录各自名称与Logo','每行ID、名称和Logo对应同一个公会'],
 ['U-views_live-room_gift-003','真实金币余额','普通用户真实金币余额为100','礼物面板金币余额显示100'],
 ['U-views_live-room_gift-003','运营账户虚拟金币余额','运营账号所属公会发放后虚拟余额为100，真实余额为0','礼物面板金币余额显示100'],
 ['U-views_live-room_contribution-gifts-001','本场礼物数量','本场收到玫瑰3个，上一场收到2个','玫瑰显示名称、对应图标及本场数量3'],
 ['U-views_live-room-host_audience-viewers-002','在线名单排除已离开观众','本场甲仍在线，乙已经离开','在线观众列表只包含甲的头像和昵称'],
 ['U-views_live-room-host_share-recipient-001','可选分享接收者','当前主播有好友甲、自己的粉丝群乙，陌生用户丙与主播无好友关系','接收者提供甲和乙，不提供丙'],
 ['U-order-income-detail-003','充值套餐数量','当前账号有一笔购买2份同一充值套餐的订单','数量显示2'],
 ['U-order-expense-detail-002','消费商品名称','已选择一笔商品名称为玫瑰的消费订单','付款商品名称显示玫瑰'],
 ['U-order-expense-detail-003','消费商品数量','已选择一笔赠送3个玫瑰的消费订单','数量显示3'],
 ['U-order-expense-detail-004','消费支付时间','已记录所选成功消费订单的支付时间','支付时间与该笔订单支付时间一致'],
 ['U-order-expense-detail-005','消费实扣金币','所选消费订单实际扣除30金币','扣款金币显示30'],
 ['U-order-expense-detail-006','消费归属主播','消费发生在主播甲的直播间，已记录甲昵称和ID','消费直播间显示甲的昵称和ID'],
 ['G-guild-operation-account-detail-001','运营账户身份','本公会运营账号甲处于启用状态，已记录头像、名称与ID','账号信息展示甲的头像、名称、ID及启用状态'],
 ['A-admin-user-list-002','用户列表身份','存在两个ID不同的用户，已记录各自头像与昵称','每行头像、昵称与ID对应同一个用户'],
 ['A-admin-inspection-schedule-002','排班编号唯一','已经创建两条排班记录','两条排班的编号均非空且互不相同'],
 ['A-admin-inspection-schedule-detail-002','排班详情快照','已记录所选排班的编号、日期、起止时间、人数、状态和创建时间','排班详情上述字段与该创建记录一致'],
 ['A-admin-content-audit-002','机审告警单号唯一','系统形成两条不同机审告警','两条告警的审核单号均非空且互不相同'],
 ['A-admin-settlement-record-detail-004','主播分成明细归属','所选结算记录有主播甲、所属公会乙、分成金额100','主播明细显示甲、公会乙及金额100'],
 ['A-admin-guild-settlement-record-detail-004','公会分成明细归属','所选结算记录包含公会甲及分成金额100，已记录甲ID','公会明细显示甲名称、甲ID及金额100'],
 ['A-admin-recharge-order-002','充值交易标识关联','有两笔成功充值，已记录各自平台订单号与渠道交易号','两行平台订单号互不相同，渠道交易号各自对应原渠道交易'],
 ['A-admin-refund-order-002','已完成退款单号唯一','两笔不同充值的退款均已完成','各退款记录均有退款单号且两个单号不同'],
 ['A-admin-consumption-order-detail-report-006','消费场次归属','主播甲有两场直播，当前消费发生在第二场','场次ID显示第二场ID']
])o(id,point,[data],expected,{role:point==='运营账户虚拟金币余额'?'运营账号':undefined});

for(const [id,labels] of [
 ['G-guild-operation-gift-records-003',['礼物名称','赠送时间','消费金币']],
 ['G-guild-operation-gift-records-004',['赠送时间','礼物名称','消费金币','礼物单价','礼物类型','赠送数量','主播名称','主播ID']],
 ['G-guild-live-gift-detail-002',['赠送时间','礼物名称','消费金币']],
 ['G-guild-live-gift-detail-003',['赠送时间','礼物名称','消费金币','礼物单价','礼物类型','赠送数量','用户名称','用户ID','用户等级']],
 ['G-guild-income-004',['日期','直播场次','达标主播','收益']],
 ['G-guild-income-005',['月份','收益','开播人数']],
 ['G-guild-income-day-detail-002',['头像','名称','主播ID','等级','当日收益','当日直播时长','有效天状态']]
])for(const label of labels)o(id,`${label}与来源明细一致`,[`已记录所选记录的${label}，无其他记录混入当前选择`],`${label}展示该记录对应值`);

for(const id of ['A-admin-host-balance-change-record-002','A-admin-guild-balance-change-record-002'])for(const kind of ['收益分成','分成修正'])o(id,`${kind}变更类型`,[`所选余额变更由${kind}形成`],`变更类型显示${kind}`);
for(const label of ['日数据','月数据'])s('G-guild-host-summary-002',`主播业绩${label}视角`,['公会内主播在所选日和月均存在记录'],[`点击「${label}」`],`当前视角切换为${label}`);
for(const field of ['商品','数量','扣减金币','主播','直播场次'])o('A-admin-user-detail-005',`消费流水${field}只读`,[`所选用户存在成功消费记录，已记录该笔${field}`],`${field}与该笔消费一致且不可编辑`);

s('U-views_live-room_audience-online-007','观众资料卡对象',['本场在线用户甲与乙均可见'],['点击在线用户甲'],'资料卡展示甲的资料');
s('U-views_live-room_audience-online-007','房管名单归属',['当前主播授权房管甲，另一主播授权房管乙'],['切换至「房管」'],'房管名单显示甲，不包含乙');
s('U-views_live-room_more-actions-004','观众转发入口',['当前观看一场仍在直播的普通房'],['选择「转发」'],'系统分享面板打开');
nav('U-views_live-room_more-actions-004','举报','直播举报');
s('U-views_live-room_more-actions-004','关闭观众更多菜单',['更多菜单已展开'],['点击菜单外遮罩'],'更多菜单关闭');
for(const [action,expected,pre] of [
 ['进入主页','进入当前主播的用户主页','当前主播资料卡已展开'],
 ['关注','当前主播资料卡的关注状态变为已关注','我尚未关注当前主播'],
 ['申请好友','对当前主播的好友申请显示已发送','当前主播不是我的好友且没有待处理申请'],
 ['私信','进入与当前主播的私信会话','我和当前主播互为好友且未互相拉黑'],
 ['举报','进入以当前主播为被举报对象的举报页','当前主播资料卡已展开']
])s('U-views_live-room_host-profile-005',`主播资料卡${action}`,[pre],[`点击「${action}」`],expected);
for(const field of ['财富等级','粉丝等级','灯牌','亲密度'])for(const has of [true,false])o('U-views_live-room-host_contribution-rank-004',`${field}${has?'存在':'缺失'}时展示`,[`当前榜单用户${has?'具有':'不具有'}${field}对应身份`],`${has?'展示':'不展示'}该用户${field}`);

link(['U-views_live-room_audience-online-006'],'U-views_live-room_profile-moderator-004');
link(['U-views_live-room-host_profile-host-004','U-views_live-room-host_profile-host-009'],'U-views_live-room-host_profile-host-005');
link(['U-views_live-room-host_cohost-invite-notice-003'],'D-SYS-106');
o('U-views_live-room-host_more-actions-001','直播美颜画面范围',['当前主播正在直播，美颜设置可用'],'美颜设置的作用对象为当前主播画面');
link(['U-live-room-host-password-008','U-views_live-room-host-password_more-actions-002','U-views_live-room-host-password_more-actions-004'],'U-views_live-room-host-password_room-password-003');
question(['U-views_live-room-host-password_visible-scope-001'],'Q023','仅当前场次的范围明确；确认何时生效及取消授权是否踢出仍有冲突');
link(['U-views_live-room-cohost-active_more-actions-001'],'U-views_live-room-cohost-active_more-actions-003');
o('U-views_start-live-settings_room-password-003','关闭广场展示后首页隐藏',['主播以关闭广场展示配置开启密码房，当前账号具备观看身份'],'直播广场不显示该场密码房',{page:'live-plaza.html',role:'用户'});
link(['U-views_start-live-settings_room-password-006'],'U-views_start-live-settings_room-password-009');
for(const task of ['观看直播30分钟','送出任意1个礼物','分享1个直播间'])s(['U-all-tasks-002','U-all-tasks-010'],`${task}去完成指引`,[`「${task}」任务尚未完成`],[`点击「${task}」的「去完成」`],`去完成结果指向${task}的功能入口，呈现方式允许页面跳转或前往路径指引`);
o('A-admin-task-config-002','任务标识唯一',['存在两条不同任务，已记录两条任务名称'],'两条任务ID非空且互不相同');
link(['A-admin-violation-types-008'],'A-admin-violation-types-006');
s('A-admin-live-type-006','新增直播类型保存',['四语名称均未被占用，状态选择启用'],['点击新建','填写四语名称','选择启用','保存'],'列表新增该直播类型，四语名称和启用状态与提交值一致');
link(['D-SYS-130'],'U-views_live-room_gift-005');

// 稳定结果与风险来源分别承接，不用其中一个分支覆盖整条复合需求。
question(['U-group-manage-member-005'],'Q022','单人禁言已覆盖；全员禁言入口与平台限制枚举未定，需分支确认');
question(['U-views_live-room_gift-recharge-002'],'Q031','当前端的正式套餐与支付渠道矩阵未确定，不能由原型样例固化');
context(['U-income-sharing-008'],'仅说明原型中的模拟提示，实际分成记录规则由同页字段承接');
