import {scenario as s,observe as o,navigation as nav,scenes,entries,context,question,refs,required} from './design.mjs';
import {baseline} from './source.mjs';
import {link} from './supplement.mjs';
const observeRows=[
 ['U-live-plaza-005','首页Banner配置','平台已配置两项启用且在有效期的素材，顺序乙、甲','首页Banner按乙、甲轮播，内容与对应素材一致'],
 ['U-live-plaza-010','首页分类配置','后台启用分类甲、乙，关闭丙','首页分类只提供甲、乙'],
 ['U-host-ranking-008','主播榜按收礼对象汇总','用户甲向主播一送10、主播二送20，用户乙向主播一送30','主播一收礼40，主播二20'],
 ['U-contribution-ranking-008','贡献榜按送礼对象汇总','用户甲向两个主播送10和20，用户乙送30','甲贡献30，乙贡献30'],
 ['U-views_user-home_blocked-007','拉黑主页隐藏社交操作','当前已拉黑所查看账号','隐藏关注、好友和私信操作'],
 ['U-host-home-004','礼物展馆种类与数量','主播成功收到礼物甲2个、乙3个','收到种类2种，历史数量5个'],
 ['U-message-center-008','消息会话账号隔离','当前账号有一条私信、一条有效粉丝群，另一账号有独立私信','只显示当前账号的两条会话及独立系统/互动通知入口'],
 ['U-interaction-notifications-007','互动通知账号隔离','分别存在与当前账号和仅与另一账号相关的通知','仅展示与当前账号有关的通知'],
 ['U-direct-message-008','私信会话对象隔离','我分别与甲、乙有独立聊天记录，当前打开甲','只显示我与甲的记录'],
 ['U-fan-group-chat-008','粉丝群消息范围','我具有两个粉丝团团籍，当前打开团甲','只显示团甲中有权查看的消息'],
 ['U-group-manage-owner-004','群主只能编辑自己公告','当前主播拥有团甲，团乙属于其他主播','仅可编辑团甲公告和进入团甲成员管理'],
 ['U-fan-club-004','团设置加入条件回显','当前配置需要关注、累计贡献100','加入条件展示需要关注及100贡献门槛'],
 ['U-fan-club-007','粉丝成员仅有效团籍','当前团2名有效成员、1名已退团成员，另一团另有成员','仅显示当前团2名有效成员'],
 ['U-fan-club-settings-006','粉丝团设置范围','当前主播仅拥有团甲','设置对象为团甲，不包含团乙设置'],
 ['A-admin-level-config-009','主播等级按分成前收益','主播分成前金币收益1000，线下分成金额已另行确定','主播等级使用1000金币收益参与匹配'],
 ['U-guild-application-form-008','入会申请资料归属','当前账号为用户甲，选择公会乙','申请对象为公会乙，提交资料属于当前用户甲'],
 ['U-guild-application-records-009','退会被驳回卡片关系','该公会最新退会申请被驳回','卡片仍显示已加入，驳回详情在时间轴查看'],
 ['U-guild-detail-012','公会详情申请范围','当前账号对甲公会有三笔申请，另有乙公会申请','当前甲公会详情仅包含我对甲的三笔申请'],
 ['U-host-center-pending-006','驳回页面后续提示','当前申请被公会驳回','页面提示重新申请'],
 ['U-host-center-pending-012','认证通过进入主播中心','当前账号直播权限申请已通过','主播入口进入主播中心'],
 ['G-guild-leave-review-004','退会无需平台终审','公会已通过一笔收益结清的退会申请','申请直接已通过，不进入平台审核中'],
 ['G-guild-leave-review-detail-005','退会处理记录回显','退会已驳回，处理时间和理由已记录','显示处理时间、已驳回结果，理由在驳回节点下'],
 ['G-guild-host-detail-005','主播历史场次与违规汇总','主播完成2场各30分钟、另有1场直播中；确认直播违规2、账号违规1','直播次数2、完成时长60分钟、累计违规3'],
 ['A-admin-host-list-002','主播列表当前公会关系','主播认证已通过，已退出甲并加入乙','当前公会显示乙'],
 ['A-admin-host-review-007','平台审核前不是主播','用户认证申请待平台审核','该申请人仍没有主播身份'],
 ['A-admin-guild-detail-008','公会旗下收益合计','当前公会两名主播历史收益100和200，其他公会收益500','累计收益300'],
 ['U-live-room-004','观众本场贡献价值','本场成功普通礼物100、幸运礼物100返奖90、虚拟礼物50','本场贡献250，不减幸运返奖'],
 ['U-live-room-005','公屏按服务端时间排列','系统、评论、进房和礼物消息服务端时间各不同','公屏按服务端时间显示对应消息'],
 ['U-views_live-room_fan-club-not-joined-002','未入团条件回显','主播设置已关注且贡献100','页面显示这两项加入条件'],
 ['U-views_live-room_fan-club-joined-004','有效团籍身份入口','当前在本团有效粉丝等级2，有对应灯牌','展示等级2与灯牌并可进入该粉丝群'],
 ['U-views_live-room_ticket-room-restricted-001','本场门票价格快照','主播开播时选择50金币档位','购票弹窗显示50金币'],
 ['U-views_live-room_ticket-room-restricted-002','购票余额使用实时值','用户刚充值后真实余额从10变为100','购票视图余额显示100'],
 ['U-views_live-room_contribution-gifts-004','收到礼物只计成功记录','本场同礼物成功2件、失败3件、撤销1件','该礼物仅展示成功2件'],
 ['U-views_live-room_host-profile-002','主播资料卡关播状态','该主播当前场次刚结束','直播状态更新为未开播'],
 ['U-live-room-host-004','待处理邀请只计有效','当前收到2条有效与1条失效邀请','待处理数量为2'],
 ['U-views_live-room-host_audience-viewers-003','财富等级缺失隐藏','当前在线观众财富等级无数据','不显示该观众财富等级'],
 ['U-views_live-room-host_audience-viewers-005','停留时长累计重进','用户本场先在线10分钟，离开后又在线5分钟','本场累计停留15分钟'],
 ['U-views_live-room-host_audience-viewers-012','切换排序不改变处置','用户原为房管且本场禁言，已切换排序模式','其身份、权限和禁言状态不变'],
 ['U-views_live-room-host_muted-users-004','禁言列表仅当前有效','本场用户甲仍禁言，乙已恢复，丙仅上场被禁言','禁言列表仅有甲'],
 ['U-views_live-room-host_more-actions-003','密码修改入口按房型','当前直播为普通房或门票房','房间密码入口不可用'],
 ['U-host-center-010','主播中心统计归属','平台有两名主播且收益不同，当前为主播甲','资料、收益与指标只使用主播甲数据'],
 ['U-start-live-settings-006','门票档位平铺单选','后台有3个启用与1个停用票价档位，排序已记录','平铺3个启用档位且只能单选'],
 ['U-start-live-settings-002','封面可选且本场归属','本次未选择封面，其他开播字段合法','不因未填封面而阻止开播'],
 ['U-welfare-center-015','任务卡配置回显','后台已启用观看任务，目标30分钟、当前进度10、奖励20','卡片显示该任务名称、目标30、进度10、奖励20及去完成状态'],
 ['U-all-tasks-004','任务奖励配置回显','当前任务配置金币奖励20','任务卡显示20金币奖励'],
 ['U-all-tasks-009','任务按配置顺序','观看、送礼、分享任务在页面配置顺序已确定','列表按配置顺序展示这三项任务'],
 ['U-invite-friends-002','成功邀请人数','当前账号有2个已确认成功邀请，另有1个仅打开邀请链接','已邀请好友为2'],
 ['U-invite-friends-003','邀请金币仅累计到账','两条已发放邀请奖励为10与20，另有一条未发放','累计获得金币30'],
 ['A-admin-lucky-gift-config-011','幸运下架保留历史','礼物已有完成开奖消费结算记录，现已下架','已有开奖、消费、结算记录保留'],
 ['A-admin-placement-config-003','素材数量','当前配置包含3项轮播内容','展示素材数为3'],
 ['A-admin-placement-config-005','有效期内关闭不投放','当前日期在展示周期内，但配置状态关闭','该配置隐藏'],
 ['A-admin-push-management-002','推送标题使用中文','推送四语标题不同，中文标题为活动甲','后台列表显示活动甲'],
 ['A-admin-push-management-005','已发送保留执行结果','任务已发送且实际发送时间和结果存在','保留实际执行结果，不用计划时间重写'],
 ['A-admin-recharge-package-002','常规与活动展示','常规套餐上架，活动套餐尚未生效','常规可展示，未生效活动不展示'],
 ['A-admin-task-config-004','任务仅有效期内生效','任务启用但当前时间在起止范围外','不产生该任务新进度'],
 ['A-admin-task-detail-005','周期仅提供指标支持范围','所选预置指标仅支持每日与每周','周期只提供每日和每周'],
 ['G-guild-message-detail-001','指定通知接收范围','该消息发送时仅指定主播甲','对象为主播甲且实际接收人数1'],
 ['G-guild-operation-accounts-004','运营月消费合计','本月成功虚拟赠礼10、20，失败50，上月成功100','本月消费30虚拟金币'],
 ['A-admin-operation-accounts-005','运营本月发放','该账号本月成功获发100和200，上月50','本月发放300虚拟金币'],
 ['A-admin-operation-issue-records-003','单笔发放数量','所属公会本笔成功发放20虚拟金币','发放记录显示20虚拟金币'],
 ['A-admin-operation-issue-records-006','发放以成功时间计月','发放请求8月31日提交，9月1日成功','发放计入9月额度并记录成功时间'],
 ['A-admin-operation-guild-controls-007','公会虚拟月消费汇总','当前公会本月两账号成功消费10和20，另一公会50','本月累计消费30虚拟金币'],
 ['G-guild-all-violations-003','违规类型来自启用配置','后台启用类型甲、停用类型乙','新筛选配置提供启用类型甲'],
 ['G-guild-all-violations-005','无处置结果占位','当前违规记录尚无处理结果','处理结果显示“-”'],
 ['A-admin-user-list-005','用户累计充值成功实付','用户两笔成功充值10和20USD，失败50USD','累计充值30USD'],
 ['A-admin-user-list-007','用户列表可显示负金币','后台退款后用户真实金币余额为-100','金币余额显示-100'],
 ['A-admin-user-detail-003','负金币用户不可消费','所查看用户余额为-100','该真实金币账户不可继续消费'],
 ['A-admin-inspection-schedule-004','巡房人数有效人员行数','排班有3个不重复的有效巡房人员','排班人数3'],
 ['A-admin-content-audit-006','待处理告警结果占位','告警未处理','处置结果显示“-”'],
 ['A-admin-account-violation-007','举报本身不封禁','正常账号刚被举报但尚未处置','账号仍为正常'],
 ['A-admin-report-detail-002','举报对象按工单关联','当前打开账号举报工单，目标用户甲','对象关联用户甲，不误关联直播场次'],
 ['A-admin-sensitive-words-007','删词保留历史命中','敏感词已有历史命中和处置，现已删除','历史命中及处置记录保留'],
 ['A-admin-consumption-order-003','连送份数统计','当前订单成功连续赠送3个礼物','消费数量显示3'],
 ['A-admin-consumption-order-detail-004','多次实际返奖求和','当前幸运消费独立开奖实际返奖0、10、20','返奖合计30，单独记入用户收入'],
 ['U-views_live-data_month-005','月时长包含实时场次','本月已结束场次60分钟、进行中场次当前30分钟','月开播时长90分钟'],
 ['U-live-records-005','收益不等于贡献榜','本场仅幸运礼物1000，配置比例1%，返奖900','收益显示10金币，不是本场贡献1000'],
 ['U-live-records-009','记录观众使用本场统计','当前场次服务端统计观众3，另一场次5','当前记录观众为3'],
 ['U-live-records-010','开播时间格式','本场开播时间2026年9月1日15:30','显示01/09/2026 15.30，日期筛选不含时分'],
 ['G-guild-host-summary-001','退会主播数据标记','该主播已有历史业绩但已退会','主播数据仍展示其信息并标【退会】'],
 ['G-guild-income-003','公会月汇总所有历史月','仅8月收益100/1场/1主播/1有效天，9月200/2场/同1主播/2有效天','历史月汇总收益300、场次3、开播人数1、有效天3'],
 ['A-admin-data-overview-007','有效天主播按日累加','同一主播所选两日均达到3小时','有效天主播人次2'],
 ['A-admin-data-overview-008','概览同日范围','开始及结束均选9月1日','指标和趋势仅使用9月1日'],
 ['A-admin-user-active-statistics-006','付费用户按成功用户去重','甲同日支付成功2笔、乙失败1笔','付费用户数1'],
 ['A-admin-monthly-income-expense-004','月充值按成功实付','本月成功10和20USD，失败30USD','累计充值30USD'],
 ['A-admin-monthly-gift-sales-004','礼物销量成功件数','范围内成功赠礼2及3件，失败4件','销量5件'],
];
for(const [id,title,pre,result] of observeRows)o(id,title,[pre],result);
for(const [id,source] of [
 ['U-live-room-001','U-start-live-settings-010'],['U-live-room-host-003','U-live-room-004'],['U-views_live-room_contribution-rank-003','U-live-room-004'],['U-views_live-room-host_contribution-rank-008','U-live-room-004'],['U-views_live-room-host_audience-viewers-006','U-views_live-room-host_audience-viewers-008'],['U-live-room-host-005','U-live-room-host-012'],['U-views_live-room-host_profile-host-007','U-moderator-management-006'],['U-views_live-room-host_focus-viewers-003','U-views_live-room-host_focus-viewers-001'],['U-start-live-settings-009','A-admin-host-list-004'],['U-start-live-settings-011','U-live-room-cohost-active-006'],['U-views_start-live-settings_room-normal-004','U-live-room-cohost-active-006'],['U-views_start-live-settings_room-normal-005','U-live-records-006'],['U-views_start-live-settings_category-002','U-views_start-live-settings_category-004'],['U-views_start-live-settings_category-003','U-live-records-006'],['U-views_start-live-settings_room-ticket-002','U-start-live-settings-006'],['U-views_live-room_fan-club-joined-005','U-my-fan-clubs-014'],['U-views_live-room-host_more-actions-002','U-views_live-room-host_muted-users-004'],['U-live-end-viewer-002','U-views_live-room-host_end-confirm-001'],['U-live-end-viewer-003','U-live-end-viewer-004'],['U-views_live-room-host_cohost-hosts-003','U-live-room-cohost-active-006'],['U-live-room-host-007','U-moderator-management-003'],['U-views_live-room_audience-managers-005','U-views_live-room_profile-moderator-mute-002'],['U-views_live-room_profile-viewer-003','U-direct-message-004'],['U-views_live-room_profile-viewer-004','U-blacklist-management-004'],['U-views_live-room_host-profile-004','U-blacklist-management-004'],['U-fan-list-003','A-admin-level-config-012'],['U-views_live-room_audience-online-002','A-admin-level-config-012'],
 ['U-welfare-center-006','A-admin-task-detail-002'],['U-welfare-center-008','A-admin-task-detail-006'],['A-admin-gift-detail-009','A-admin-custom-gift-005'],['A-admin-lucky-gift-config-008','A-admin-lucky-gift-detail-007'],['A-admin-prop-list-005','A-admin-prop-detail-005'],['A-admin-ticket-price-level-006','U-views_start-live-settings_room-ticket-004'],['G-guild-all-violations-006','A-admin-live-detail-009'],['G-guild-all-violations-007','A-admin-user-list-010'],['A-admin-inspection-schedule-detail-003','A-admin-inspection-schedule-004'],['A-admin-report-detail-006','D-SYS-116'],['U-income-sharing-005','U-live-data-002'],['G-guild-host-data-004','G-guild-live-gift-detail-005'],['G-guild-host-data-007','U-live-end-host-004'],['A-admin-host-detail-004','U-live-end-host-004'],['A-admin-host-live-record-report-008','U-live-end-host-004'],['A-admin-host-live-record-report-002','A-admin-live-management-002'],['A-admin-report-center-005','U-income-sharing-004'],['A-admin-monthly-host-share-009','U-income-sharing-004'],['A-admin-consumption-order-detail-002','U-order-expense-detail-010'],['A-admin-monthly-host-earnings-003','U-order-expense-detail-010'],['A-admin-consumption-order-detail-report-003','U-order-expense-detail-010'],
])link(id,source);
const actions=[
 ['U-my-decoration-medal-008','佩戴勋章跨入口同步','持有一枚有效勋章，当前未佩戴',['点击佩戴','进入个人主页','打开个人资料卡'],'同一枚勋章在个人主页和资料卡身份区展示'],
 ['U-my-fan-clubs-007','粉丝团群聊入口','当前账号有有效团籍',['点击卡片群聊'],'进入该团粉丝群'],
 ['U-blacklist-management-007','主播拉黑在线用户','主播在播且目标用户在线',['打开目标用户资料卡','拉黑该用户并确认'],'目标立即退出该主播直播间'],
 ['U-guild-application-records-010','公会卡片对应详情','账号对公会甲有历史申请',['点击公会甲卡片'],'进入甲公会详情并显示我与甲的关系和申请时间轴'],
 ['U-guild-leave-application-004','退会重复提交限制','同一账号已有一笔处理中退会申请',['再次尝试提交退会申请'],'不生成第二笔处理中申请'],
 ['U-guild-leave-application-007','不能为无关系公会退会','当前仅属于公会甲',['尝试为公会乙提交退出'],'不生成乙公会退出申请'],
 ['G-guild-home-006','今日概况下钻','当前公会已选择',['点击今日概况'],'进入当前公会当日经营详情'],
 ['A-admin-guild-list-009','新增公会详情','后台账号有公会维护权限',['点击新建'],'进入公会详情编辑态'],
 ['A-admin-guild-detail-011','公会账号状态独立','公会启用且公会长账号启用',['停用公会长账号'],'公会仍启用，仅账号状态改为停用'],
 ['A-admin-guild-recommendation-detail-004','保存有效推荐','选择有效未配置公会、权重1',['点击保存'],'推荐列表新增该公会'],
 ['U-views_live-room_contribution-rank-008','排名滚动仍可查看本人','本场贡献榜超过一屏且我已上榜',['滚动榜单到底部'],'我的排名始终固定在底部'],
 ['U-views_live-room-host_audience-viewers-014','观众与贡献视图切换','主播当前普通房在播',['切换贡献TOP10','切换观众'],'在同一弹层切回当前在线观众列表'],
 ['U-views_live-room-host_audience-viewers-015','排序重排不关弹层','观众贡献顺序与停留顺序不同',['切换按停留时长'],'弹层保持打开，列表按停留时长规则重排'],
 ['U-views_live-room-host_profile-host-006','踢出用户不能设房管','目标用户已被本场踢出',['尝试设置该用户房管'],'不新增房管授权'],
 ['U-views_live-room-host_cohost-hosts-search-result-001','连麦搜索去空格','已知一名符合条件主播昵称海岛',['输入“  海岛  ”并搜索'],'按海岛匹配符合条件的主播'],
 ['U-views_start-live-settings_beauty-005','美颜不改封面','已设置封面甲并记录历史场次',['将某项美颜参数调至20'],'只影响当前主播视频画面，封面甲和历史记录保持原值'],
 ['A-admin-lucky-gift-detail-010','RTP未验证不能生效','概率合计100%，当前配置尚未完成RTP验证',['尝试保存生效'],'配置不能生效'],
 ['A-admin-lucky-gift-detail-011','改概率实时重算','单次消耗10，奖励0/20各50%，原RTP100%',['把两档概率改为60%和40%'],'RTP实时更新为80%'],
 ['A-admin-placement-detail-004','轮播素材预览','当前行已上传可读取素材',['点击已上传素材'],'打开该素材预览'],
 ['A-admin-placement-detail-006','APP跳转缺目标','跳转类型APP页面且素材已上传',['保持目标页面未选择','保存'],'该行缺少目标页面，不能保存'],
 ['A-admin-placement-detail-006','长图跳转缺详情图','跳转类型活动长图且素材已上传',['保持详情长图未上传','保存'],'该行缺少详情长图，不能保存'],
 ['A-admin-recharge-package-detail-010','切活动增加必填条件','原常规套餐资料合法',['切换为活动套餐'],'显示限购和有效时间且要求填写'],
 ['A-admin-feature-switch-006','票价配置入口','当前查看门票房功能配置',['点击门票房价格配置'],'进入门票价格档位列表'],
 ['A-admin-ticket-price-level-detail-006','保存合法票价','价格50全局未重复、排序1、状态启用',['点击保存'],'列表新增启用50金币档位'],
 ['G-guild-operation-gift-records-006','运营送礼明细','当前筛选有一笔成功赠礼',['点击该记录'],'打开该笔送礼详情'],
 ['G-guild-all-violations-008','违规主播下钻','有当前公会主播甲的违规记录',['点击主播甲'],'进入主播甲详情'],
 ['G-guild-violation-host-select-003','主播全选全部','有5名可选主播，搜索仅命中2名',['点击全选'],'全部5名主播被选中'],
 ['G-guild-violation-host-select-004','多选主播保留日期','来源违规记录日期昨日',['选择两名主播','点击完成'],'返回违规记录，回填两主播且保留昨日'],
 ['A-admin-user-list-009','注册时间包含起止','用户甲注册于9月1日00:00、乙9月2日23:59、丙9月3日',['筛选9月1日至2日','查询'],'包含甲和乙，不包含丙'],
 ['A-admin-inspection-schedule-009','排班重新启用重算','排班已停用且当前位于原有效时段',['重新启用'],'状态为生效中'],
 ['A-admin-inspection-schedule-009','排班过期启用不生效','排班已停用且原时段已经结束',['重新启用'],'按当前时间显示已结束'],
 ['A-admin-host-account-balance-004','主播余额下钻','当前列表为主播甲',['点击甲余额'],'进入甲余额变更流水'],
 ['A-admin-guild-account-balance-004','公会余额下钻','当前列表为公会甲',['点击甲余额'],'进入甲余额变更流水'],
 ['U-live-records-014','场次筛选同步汇总','原范围两场，新范围仅一场收益10、时长30分钟',['切换到新日期范围'],'列表一场，收益10、时长30分钟同步更新'],
 ['G-guild-host-summary-007','主播数据主页入口','当前查看主播甲数据',['点击主页入口'],'进入主播甲详情'],
 ['G-guild-income-006','业绩趋势切换','当前为日数据',['点击收益指标'],'展示按日期排列的收益趋势'],
 ['A-admin-dashboard-009','工作台刷新数据','后台已产生一笔新成功充值',['点击刷新'],'充值指标包含新增成功充值'],
 ['A-admin-system-account-detail-004','账号不能选停用角色','后台有启用角色甲和停用角色乙',['编辑账号所属角色'],'仅可选启用角色甲'],
];
for(const [id,title,pre,steps,result] of actions)s(id,title,[pre],steps,result,id==='U-blacklist-management-007'?{role:'主播',page:'live-room-host.html'}:{});
for(const [p,count,sort] of [['U-live-room-host-password','002','003'],['U-live-room-cohost-active','004','005']]){
 for(const key of ['贡献值','粉丝等级','财富等级','用户ID'])o(`${p}-${count}`,`房型贡献榜比较${key}`,[`其他更高优先级相同，${key}分别10和20`],`${key==='用户ID'?10:20}对应用户在前`);
 o(`${p}-${count}`,'房型贡献榜99名上限',['有100名有效贡献用户'],'按完整排序显示前99名，无并列名次');
 for(const mode of ['贡献','停留时长'])s(`${p}-${sort}`,`房型在线按${mode}排序`,[`两人其他高优先项相同，${mode==='贡献'?'贡献':'累计在线时长'}分别10和20`],[`选择按${mode}`],'20对应用户在前');
}
for(const id of ['U-fan-contribution-ranking-009','U-views_live-room_contribution-rank-007','U-views_live-room-host_contribution-rank-010'])o(id,'已注销榜单账号只读',['榜单有贡献100的已注销账号'],'贡献100保留，名称为“账号已注销”，不能打开主页');
for(const p of ['G-guild-share-ledger','G-guild-share-income'])for(const amount of [10,-10])o(`${p}-${p.includes('ledger')?'004':'002'}`,`分成有符号金额${amount}`,[`已上传一笔金额${amount}的分成记录`],`显示${amount}，表示${amount>0?'增加':'冲正或扣减'}，保留正负号`);
for(const [p,id] of [['A-admin-violation-types','003'],['A-admin-violation-type-detail','004']])for(const v of [0,1,-1,1.5])s(`${p}-${id}`,`违规排序${v}`,['其余字段合法'],[`填写排序${v}`,'保存'],Number.isInteger(v)&&v>0?'排序可保存':'排序必须为正整数，不能保存');
for(const [p,id] of [['A-admin-gift-list','009'],['A-admin-lucky-gift-config','013'],['A-admin-recharge-package','008']])for(const action of ['上架','下架','删除'])for(const yes of [true,false])s(`${p}-${id}`,`${action}${yes?'确认':'取消'}`,['所选记录满足该操作业务条件'],[`点击${action}`,`点击${yes?'确认':'取消'}`],yes?`所选记录完成${action}`:'所选记录保持操作前状态');
for(const p of ['A-admin-gift-detail','A-admin-prop-detail'])s(`${p}-${p.includes('gift')?'010':'009'}`,'保存留在详情',['当前字段、资源和时间均合法'],['点击保存'],'保存成功并留在当前详情');
for(const type of ['勋章','气泡','头像框'])s('A-admin-prop-list-008',`道具类型${type}`,['各类型均有已配置道具'],[`切换${type}Tab`],`仅显示${type}道具列表`);
for(const language of ['中文','英语','印尼语','马来语'])required('A-admin-lucky-gift-detail-002',[`${language}名称`],'保存');
required('A-admin-lucky-gift-detail-002',['图标'],'保存');
for(const language of ['中文','英语','印尼语','马来语'])required('A-admin-prop-list-002',[`自定义类型${language}名称`],'保存');
s('A-admin-prop-list-002','自定义类型重复名称',['已有自定义类型甲'],['新建同名类型甲','保存'],'重复类型不能保存');
required('G-guild-operation-account-compose-001',['头像'],'确认创建');
for(const format of ['JPG','PNG','WebP'])s('G-guild-operation-account-compose-001',`运营头像${format}`,['其他必填字段合法'],[`选择可读取${format}头像`,'确认创建'],'创建成功，使用所选头像');
required('A-admin-report-detail-005',['处置原因'],'确认');
for(const title of ['每日统计','用户活跃','主播活跃','直播互动','充值消费','充值用户分层'])nav(['A-admin-report-center-002','A-admin-report-center-006'],title,title,['当前角色有对应报表权限']);
for(const id of ['A-admin-gift-send-count-rules-008','A-admin-host-detail-008','A-admin-operation-accounts-009','A-admin-account-violation-008'])s(id,'查看所选记录详情',['当前列表存在一条属于查询范围的记录'],['选择该记录','打开详情'],'详情对象与所选记录一致');
// 正式条款中的实现演示和未闭合业务分支保留为可追溯问题，不能推断服务端预期。
question(['U-group-manage-member-005'],['Q022'],'全员禁言、单人禁言及平台限制优先级需确认');
question(['A-admin-settlement-record-009','A-admin-guild-settlement-record-009','A-admin-sensitive-words-008'],['Q028'],'导入所需模板、字段约束及异常处理未定义，无法准备合格导入数据');
question(['U-live-data-007','U-views_live-data_month-008'],['Q008'],'明确历史记录保留；退款或冲正重算收益与充值退款不回滚收益需划分适用对象');
context(['U-income-sharing-008'],'该条只说明原型提示，不证明真实业务详情入口');
