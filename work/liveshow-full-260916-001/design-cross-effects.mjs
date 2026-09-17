import {test,P0,P1,P2,enter} from './case-design.mjs';
const level='admin-level-config.html';
for(const [type,page,ref,role,valueLabel]of [
 ['主播等级','host-center.html','分成前累计收益','主播','分成前累计真实金币收益'],
 ['财富等级','profile.html','财富等级','普通用户','已确认的财富等级累计值'],
 ['粉丝等级','my-fan-clubs.html','本次有效团籍期间','普通用户','本次团籍对当前主播的真实金币赠礼贡献'],
 ['粉丝团等级','my-fan-clubs.html','粉丝团整体等级','普通用户','当前团累计收到的真实金币礼物价值']
 ]){
 for(const [value,expected]of [[0,1],[99,1],[100,2],[299,2],[300,3]])test(page,[ref],role,`${type}累计值${value}匹配门槛`,`${type}门槛匹配`,[`${type}配置为1级0、2级100、3级300，图片完整且已经生效`,`${valueLabel}为${value}金币；账号有有效团籍，未发生退团重入`],[enter(page)],`${type}显示${expected}级`,{...P1,extra:[[level,'累计值大于或等于门槛']],notes:type==='财富等级'?['本条仅验证既定累计值与门槛匹配；充值、门票等是否计入财富成长另有来源差异，不在本条推定。']:[]});
 test(page,[ref],role,`${type}调整门槛后重算已有等级`,`${type}配置变更结果`,[`${type}原2级门槛100，当前累计值150且原显示2级`,`环境准备：管理员已将对应类型2级门槛提高至200并成功保存；其他等级配置与业务累计值不变`],[enter(page)],`${type}显示1级`,{...P1,extra:[[level,'立即按新配置重算']],transition:'ST-config-save'});
}
test('my-fan-clubs.html',['团等级和个人粉丝等级使用各自后台配置'],'普通用户','团等级与个人粉丝等级独立','团等级与个人等级分离',['当前团配置匹配团等级5，当前账号本次团籍贡献仅匹配粉丝等级2'],[enter('my-fan-clubs.html')],'卡片团等级为5且个人粉丝等级为2',P1);
for(const action of ['主动退出','被主播移出'])test('my-fan-clubs.html',['重新加入从 0 开始'],'普通用户',`${action}再入团不恢复旧粉丝成长`,'再次入团粉丝等级重置',[`账号此前粉丝等级5，${action}后已重新加入原团，尚未有新的赠礼贡献`],[enter('my-fan-clubs.html')],'粉丝等级显示0',{...P1,extra:[[level,'不能直接用永久历史送礼总额恢复']]});
test('profile.html',['金币余额：'],'普通用户','等级门槛调整不发放金币','等级配置资产隔离',['账号余额100金币；环境准备：管理员已修改财富等级门槛并保存；期间无其他资产变动'],[enter('profile.html')],'金币余额仍为100',{...P1,extra:[[level,'不直接增加收益、送礼贡献或钱包金币']],transition:'ST-config-save'});

for(const [label,transition]of [['平台','ST-platform-live-close'],['公会','ST-guild-live-toggle']])test('live-room-host.html',['立即结束当前场次'],'主播',`${label}关闭权限结束正在直播的场次`,`${label}关权实时关播`,[`主播正在直播；环境准备：${label}有权限的管理人员配合关闭开播权限`],['查看|当前直播状态'],'当前场次结束',{...P1,transition});
for(const [label,transition]of [['退会申请通过','ST-leave-pass'],['被公会移出','ST-remove-host']]){
 test('profile.html',['未获得主播身份时进入主播申请流程'],'原主播',`${label}后失去主播身份`,`${label}身份变化`,[`该账号${label}，当前无其他有效公会关系`],[enter('profile.html'),'点击|主播中心'],'进入申请成为主播页',{...P1,transition,extra:[['guild-leave-application.html','失去主播身份']]});
 test('message-center.html',['团籍失效后移除对应会话权限'],'原粉丝团成员',`${label}后原粉丝群不可访问`,`${label}解散群聊`,[`本账号原是主播A的粉丝团成员，主播A已${label}`],[enter('message-center.html')],'原主播A粉丝群会话不再可进入',{...P1,transition,extra:[['guild-leave-application.html','粉丝团立即解散']]});
}
for(const [platform,guild,locked,allow]of [['开启','开启',false,true],['开启','关闭',false,false],['开启','关闭',true,true],['关闭','开启',false,false]])test('host-center.html',['账号可用、公会有效'],'主播',`平台${platform}公会${guild}${locked?'锁定':'未锁定'}的开播结果`,'开播权限组合',['账号正常、公会有效且认证通过',`平台权限${platform}，公会锁定前权限${guild}，平台${locked?'已':'未'}锁定公会管理`],[enter('host-center.html'),'点击|开始直播'],allow?'进入开播设置页':'提示“直播权限已关闭，请联系公会”',{...(allow?P0:P1),transition:locked?'ST-platform-live-lock':platform==='关闭'?'ST-platform-live-close':guild==='关闭'?'ST-guild-live-toggle':undefined,extra:[['admin-host-list.html','开播权限：']]});
test('guild-login.html',['登录校验通过'],'公会长','公会停用后阻止该公会管理账号登录','公会停用登录限制',['公会已停用，所属公会长qa-chief自身状态启用，正确密码QaChief!2026'],[enter('guild-login.html'),'填写|公会账号|为qa-chief','填写|密码|为QaChief!2026','点击|登录'],'不能进入该公会管理范围',{...P1,transition:'ST-guild-disable',extra:[['admin-guild-detail.html','登录须同时满足']]});

for(const room of ['门票房','密码房'])test('start-live-settings.html',['可用范围受平台开关控制'],'主播',`平台关闭${room}后新开播受限`,`${room}开关作用于新场次`,[`主播具有开播资格，平台已关闭${room}`],[enter('start-live-settings.html'),'点击|房型'],`${room}不可选`,{...P1,extra:[['admin-feature-switch.html','不可新建对应场次']]});
for(const room of ['门票房','密码房'])test('live-room-host.html',['房间 ID：'],'主播',`平台关闭${room}不结束存量场次`,`${room}存量场次保持`,[`本主播正在${room}直播；环境准备：管理员已关闭对应房型功能开关，未关闭主播开播权限`],['查看|本主播直播画面'],'当前场次继续直播',{...P1,extra:[['admin-feature-switch.html','不改变已开始或历史场次']]});

for(const [page,ref,title,pre,result,point]of [
 ['my-decoration.html','上下架只控制能否获得','道具下架不影响已持有佩戴','已拥有有效道具A且正佩戴，后台已下架A','道具A保持已佩戴'],
 ['my-decoration.html','可佩戴期限','修改期限不影响旧获得道具','本账号获得A时可佩戴至9月30日；后台后续将期限改为9月20日；当前9月21日','已持有A仍可佩戴'],
 ['order-expense-detail.html','订单','充值退款不撤销历史消费','用户消费订单E成功，支付所需金币的原充值订单后来全额退款','消费订单E仍保留'],
 ['income-sharing.html','分成','充值退款不回滚上传分成','主播已上传分成10USD，相关观众充值后来退款，没有财务修正','原分成记录仍为10USD'],
 ['live-records.html','历史','充值退款不回滚历史主播收益','本场已获普通礼物收益100金币，赠礼用户原充值后来退款','该历史场次收益仍为100金币'],
 ['welfare-center.html','停用不回收已领取奖励','停用任务不回收已领奖励','原余额0，领取任务奖励20金币，管理员随后停用任务；期间无其他资产变化','已领奖励保持已领取'],
].map((row,i)=>[...row,['下架道具佩戴保持','旧道具有效期限','退款后消费记录保留','退款后上传分成保留','退款后主播收益保留','停用任务领取状态'][i]]))test(page,[ref],['income-sharing.html','live-records.html'].includes(page)?'主播':'普通用户',title,point,[pre],[enter(page)],result,{...P1,extra:page==='my-decoration.html'&&title.includes('期限')?[['admin-prop-list.html','修改配置只对未来用户生效']]:page.includes('order')||page==='income-sharing.html'||page==='live-records.html'?[['admin-recharge-order-detail.html','不回滚主播收益和分成']]:[]});

// Cross-end observations keep preparation on the other end explicit; one role executes each case.
for(const [kind,before,after,origin,fragment,transition]of [
 ['领取任务奖励',100,120,'welfare-center.html','领取成功后更新领取记录、钱包金币余额及金币流水','ST-task-claim'],
 ['购买装扮',100,70,'views/my-decoration/purchase-confirm.html','扣款并加入已拥有','ST-ornament-buy'],
 ['充值成功',100,220,'recharge.html','支付成功后增加余额并生成充值记录','ST-recharge-paid'],
 ['充值失败',100,100,'admin-recharge-order.html','失败订单不发金币','ST-recharge-fail'],
 ]){
 const fixture={领取任务奖励:'用户U001刚成功领取20金币任务奖励',购买装扮:'用户U001刚成功购买30金币且原未拥有的有效在售装扮',充值成功:'用户U001刚成功支付基础100金币、赠送20金币的套餐',充值失败:'用户U001支付基础100金币、赠送20金币的套餐失败；环境准备：须有测试支付渠道或可模拟明确失败响应的能力，不能只断网并假定支付失败'}[kind];
 test('admin-user-detail.html',['金币余额：'],'平台管理员',`${kind}后后台核对真实金币余额`,`${kind}后台余额`,['具有用户详情查看权限',`U001操作前余额${before}金币；${fixture}；前后无其他资产变动`],[enter('admin-user-detail.html'),'查看|U001的金币余额'],`金币余额显示${after}`,{...P1,extra:[[origin,fragment]],transition});
}
test('admin-consumption-order.html',['消费类型：','订单扣减金币 = 商品单价 × 数量'],'平台管理员','支付门票后后台保留场次消费订单','门票消费订单承接',['具有消费订单查看权限；观众U001刚成功支付主播H001场次S1的20金币门票；无重复支付'],[enter('admin-consumption-order.html'),'查询|用户U001的门票订单'],'本次订单扣减金币显示20',{...P1,transition:'ST-ticket',extra:[['order-expense-detail.html','同场重复进入']]});
test('admin-report-detail.html',['举报对象：','内容 / 证据：'],'平台管理员','观众举报后后台承接原场次','举报场次对象承接',['具有举报查看权限；U001刚举报主播H001正在直播的场次S1，填写说明QA场次举报；平台已生成该工单'],[enter('admin-report-detail.html'),'查看|本次举报的关联场次'],'工单关联场次为S1',{...P1,transition:'ST-report-submit',extra:[['live-room-report.html','生成直播场次举报工单']]});
test('system-notifications.html',['数据范围：','平台发送的系统通知'],'举报人','违规处置后查看举报成立通知','举报处置结果通知',['当前账号刚举报的直播工单已由平台判定违规并执行警告；环境准备：管理员配合完成对应工单处理'],[enter('system-notifications.html')],'收到“举报成立，平台已依规处理”通知',{...P1,transition:'ST-report-handle',extra:[['admin-report-detail.html','按结果通知举报人']],commonEvidence:['|警告|主播直播间弹窗强提示<br>|直播中 → 直播中|通知举报人：“举报成立，平台已依规处理”；消息通知并弹窗提示主播：“直播间存在违规，请及时调整”|']});
for(const [label,expected,transition]of [['解散',false,'ST-guild-dissolve'],['重新启用',true,'ST-guild-enable']])test('guild-login.html',['登录校验通过'],'公会长',`公会${label}后验证登录资格`,`公会${label}登录结果`,[`公会G001已被平台${label}；公会长qa-chief账号自身${expected?'启用':'随公会解散失效'}，原正确密码QaChief!2026；无其他状态变动`],[enter('guild-login.html'),'填写|公会账号|为qa-chief','填写|密码|为QaChief!2026','点击|登录'],expected?'进入该公会管理范围':'不能进入已解散公会的管理范围',{...P1,transition,extra:[['admin-guild-list.html',label==='解散'?'解散前须':'启停']]});
for(const [point,result]of [['关闭状态','直播权限开关显示关闭'],['只读限制','直播权限开关不可修改']])test('guild-host-detail.html',['平台关闭时禁止开播','公会直播权限开关只读'],'公会长',`平台关权后查看公会权限${point}`,`平台关闭时公会权限${point}`,['主播H001属于本公会且此前平台与公会权限均开启；环境准备：平台管理员刚关闭H001的平台开播权限'],[enter('guild-host-detail.html'),'查看|H001直播权限开关'],result,{...P1,transition:'ST-platform-live-close',commonEvidence:['|关闭（权限锁定/未锁定）|跟随平台显示，页面提示“权限已锁定”|关闭|']});
for(const allow of [true,false])test('host-center.html',['账号可用、公会有效'],'主播',`平台解除锁定后恢复公会${allow?'开启':'关闭'}结果`,'解除锁定后的最终开播资格',['账号正常、公会有效且认证通过；平台权限开启',`平台锁定前公会权限${allow?'开启':'关闭'}；环境准备：平台刚取消管理权限锁定，未改动其他条件`],[enter('host-center.html'),'点击|开始直播'],allow?'进入开播设置页':'提示“直播权限已关闭，请联系公会”',{...P1,transition:'ST-platform-live-unlock',extra:[['guild-host-detail.html','解锁后恢复公会锁定前设置']]});
test('auth-email-login.html',['密码登录'],'未登录用户','平台解封后允许有效密码登录','解封后的登录恢复',['普通账号qa.member@example.com刚被平台解封，正确密码QaMember!2026；无注销申请；协议已勾选'],[enter('auth-email-login.html'),'切换|密码登录','填写|邮箱|为qa.member@example.com','填写|密码|为QaMember!2026','点击|继续'],'进入首页',{...P1,transition:'ST-account-unban',extra:[['admin-user-detail.html','解封只恢复登录']]});
test('fan-club-settings.html',['首次创建为空','校验通过并保存成功'],'主播','首次保存合法粉丝团设置','首次粉丝团配置保存',['当前主播尚未创建粉丝团，具有主播身份且账号正常'],[enter('fan-club-settings.html'),'填写|粉丝团名称|为QA粉丝团','填写|累计贡献|为0','点击|保存',enter('fan-club-settings.html')],'粉丝团名称显示QA粉丝团',{...P1,transition:'ST-fan-create'});
for(const type of ['主播等级','财富等级','粉丝等级','粉丝团等级'])test('admin-level-config.html',['立即按新配置重算','累计门槛'],'平台管理员',`保存合法${type}配置`,`合法${type}配置生效`,['具有等级配置编辑权限',`${type}2级门槛100、3级门槛300；所有等级图片齐全，等级行完整、门槛递增`],[enter('admin-level-config.html'),`切换|${type}`,'填写|2级门槛|为200','点击|保存','刷新|当前等级配置页',`切换|${type}`],'2级门槛显示200',{...P1,transition:'ST-config-save'});
test('admin-system-role-detail.html',['校验名称和权限','全选'],'超级管理员','保存角色修改后的权限','角色权限保存生效',['自建角色QA只读角色当前仅有用户列表查看权限；角色名称唯一且有效'],[enter('admin-system-role-detail.html'),'选择|权限树的主播列表查看权限','点击|保存','刷新|当前角色编辑页'],'主播列表查看权限保持选中',{...P1,transition:'ST-role-permission'});
test('admin-guild-list.html',['公会状态：','启停或解散'],'平台管理员','重新启用已停用公会','公会恢复启用',['具有公会管理权限；公会G001当前停用且未解散'],[enter('admin-guild-list.html'),'点击|G001启用','点击|确认'],'G001状态显示启用',{...P1,transition:'ST-guild-enable'});
test('admin-operation-accounts.html',['账号由所属公会创建'],'平台管理员','公会创建运营账号后平台列表可查','新建运营账号平台归属',['具有运营账号查询权限；环境准备：公会G001刚成功创建账号O001，名称QA运营甲；记录实际系统生成的账号ID'],[enter('admin-operation-accounts.html'),'查询|账号O001'],'列表中O001所属公会显示G001',{...P1,transition:'ST-ops-create',extra:[['guild-operation-account-compose.html','创建账号']]});
test('views/live-room/gift.html',['运营账号只显示所属公会发放的虚拟金币余额'],'运营账号','公会发放后用户端显示增加的虚拟币','运营账号发放后余额',['当前运营账号已经登录且处于启用状态，原虚拟金币100；环境准备：所属公会刚向该账号成功发放50金币，期间无消费'],[enter('live-room.html'),'点击|礼物'],'金币余额显示150',{...P1,transition:'ST-ops-issue',extra:[['guild-operation-account-detail.html','发放成功后刷新指标']]});
test('friend-list.html',['当前账号仍有效的双向好友关系'],'普通用户','好友注销冷静期届满后解除关系','最终注销后的好友关系',['本账号与甲原为好友；甲已申请注销且未取消；环境准备：测试环境可控制申请时点与服务端时间，使七日冷静期届满并触发最终注销处理'],[enter('friend-list.html'),'填写|用户名搜索框|为甲'],'好友结果不再包含甲',{...P1,transition:'ST-deletion-expire',extra:[['views/auth-login-register/deletion-cooling.html','冷静期满仍未取消']]});
test('interaction-notifications.html',['好友申请通知','处理状态：'],'普通用户','新好友申请到达接收人','新好友申请待处理状态',['本账号乙与甲非好友且没有拉黑关系；环境准备：甲刚向乙成功发起首次好友申请，乙尚未处理'],[enter('interaction-notifications.html')],'甲的好友申请状态为待处理',{...P1,transition:'ST-friend-request'});
test('live-end-viewer.html',['直播结束状态：'],'观众','平台强制关播后观众看到本场结束','平台关播的观众结果',['正在观看主播甲的场次S1；环境准备：管理员配合对S1执行关播，未对甲执行封禁或关闭直播权限'],['查看|当前场次的直播状态'],'S1显示直播已结束',{...P1,transition:'ST-close-live',extra:[['admin-live-management.html','立即结束当前场次']]});
test('live-room-host.html',['直播场次'],'主播','平台警告后主播接收强提示','直播违规警告弹窗',['本账号正在直播；环境准备：平台管理员刚对当前场次执行警告'],['查看|当前直播页面的提示弹窗'],'弹窗提示“直播间存在违规，请及时调整”',{...P1,transition:'ST-live-warn',extra:[['admin-live-detail.html','警告不改状态']],commonEvidence:['|警告|主播直播间弹窗强提示<br>|直播中 → 直播中|通知举报人：“举报成立，平台已依规处理”；消息通知并弹窗提示主播：“直播间存在违规，请及时调整”|']});
test('guild-host-summary.html',['直播中'],'公会长','主播主动结束后公会刷新在播标记','公会观察主动下播',['当前公会主播甲原正在S1直播；环境准备：甲刚主动结束S1，尚未重新开播'],[enter('guild-host-summary.html'),'刷新|甲的主播数据页'],'不显示直播中标记',{...P1,transition:'ST-end-live',extra:[['guild-host-data.html','场次结束后']]});
test('admin-user-list.html',['无公会显示'],'平台管理员','公会移除主播后后台关系解除','移除主播的后台公会关系',['具有用户查询权限；甲原在G001，收益已结清；环境准备：公会长刚将甲移出，甲尚未加入其他公会'],[enter('admin-user-list.html'),'查询|甲的用户ID'],'甲所属公会显示“-”',{...P1,transition:'ST-remove-host',extra:[['guild-host-detail.html','确认移出后']]});
test('admin-host-detail.html',['公会管理权限：','权限或账号处置'],'平台管理员','恢复公会管理权限','平台解除公会管理锁定',['具有主播权限管理权；甲的平台权限开启，公会管理权限关闭，公会锁定前配置为关闭'],[enter('admin-host-detail.html'),'启用|公会管理权限','填写|原因|为恢复公会管理','点击|确认'],'公会管理权限显示开启',{...P1,transition:'ST-platform-live-unlock'});
test('admin-live-management.html',['查询直播中和已结束场次','结束后保留'],'平台管理员','主播主动下播后后台保留结束场次','后台观察主动下播',['具有直播场次查询权限；环境准备：主播甲刚主动结束S1，未创建新场次；当前查询范围包含S1'],[enter('admin-live-management.html'),'查看|场次S1'],'S1显示为已结束场次',{...P1,transition:'ST-end-live'});
test('admin-guild-account-balance.html',['账户余额：'],'平台管理员','公会分成结果上传后更新账户余额','公会上传结果入账',['具有公会账户查询权限；G001原余额100USD；环境准备：财务刚成功上传G001的50USD分成结果，无其他入账或修正'],[enter('admin-guild-account-balance.html'),'查询|公会G001'],'G001账户余额显示150USD',{...P1,transition:'ST-guild-upload',extra:[['admin-guild-settlement-record.html','线下']]});
test('admin-operation-accounts.html',['平台可启停'],'平台管理员','平台重新启用运营账号','后台运营账号恢复启用',['具有运营账号启停权限；O001当前停用'],[enter('admin-operation-accounts.html'),'点击|O001启用','点击|确认'],'O001状态显示启用',{...P1,transition:'ST-ops-enable'});
