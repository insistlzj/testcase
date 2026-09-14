import {test,ref,page,add} from './design-cases.mjs';
import {overview} from './read-basis.mjs';
import {calculation} from './manual-finance.mjs';
const t=(k,w,l,g,s,e,x={})=>test(k,w,l,g,[`打开${page(k).entry}`,...s],e,x);
// These branches follow explicit clauses in the sealed MainBasis; fixtures are inputs, not business defaults.
for(const k of ['views/live-room/contribution-rank.html','views/live-room-host/contribution-rank.html']){
 if(k.includes('host'))t(k,'已经离线','已离线贡献者仍在本场榜单',['本场S中A贡献100后离线，B在线贡献50；另场T的C贡献200'],['查看本场榜单'],'榜单包含A及其贡献100',{point:'离线贡献保留'});
 t(k,'失败或撤销','本场榜单排除失败与撤销赠礼',['本场A成功礼物价值20、失败50、撤销30'],['查看A贡献值'],'A本场贡献为20',{point:'有效贡献范围'});
}
t('views/live-room/contribution-rank.html','未进入榜单时','无排名底部占位',['当前用户本场未产生有效贡献'],['查看我的排名'],'我的排名显示“-”',{point:'本人未上榜'});
for(const k of ['views/live-room/audience-online.html','views/live-room-host/audience-viewers.html'])for(const action of ['离线','被踢出'])t(k,k.includes('host')?'列表随进入':'被踢出用户',`${page(k).name}移除${action}观众`,['本场S在线用户A、B；A已'+action+'，B仍在线'],['查看在线观众'],'在线观众列表不包含A',{point:'在线成员范围'});
t('views/live-room-host/audience-viewers.html','累计时长','停留时长累计多次进出',['观众A本场先停留10分钟，离开5分钟后再停留20分钟；读取时暂停测试时钟'],['查看A停留时长'],'累计停留时长为30分钟',{point:'停留时长累计'});
t('views/live-room-host/audience-viewers.html','取消房管后','取消房管保留在线观众',['本场A在线；主播已取消A房管授权，A没有离线或被踢出'],['查看在线观众A'],'A仍作为普通观众显示',{point:'房管与在线身份独立'});
for(const field of ['灯牌','粉丝等级','亲密度'])t('views/live-room-host/audience-viewers.html','无有效团籍时',`非团员不展示${field}`,['在线观众A没有当前主播的有效团籍'],[`查看观众A的${field}`],`不展示A的${field}`,{point:field+'资格'});
t('views/live-room-host/focus-viewers.html','同一用户可命中多个标签','重点观众同时命中多个标签',['A本场新增关注、贡献最高、未加入粉丝团且仍在线'],['查看观众A重点标签'],'A同时具有新粉丝、本场贡献最高和未加入粉丝团标签',{point:'重点标签并存'});
t('views/live-room-host/focus-viewers.html','离线后','重点观众离线更新',['A原为在线重点观众，现已离线'],['查看重点观众'],'列表不包含已离线的A',{point:'重点列表范围'});
for(const key of ['host-gift-gallery.html','views/live-room/contribution-gifts.html'])t(key,key.startsWith('host')?'失败或撤销':'失败或撤销',`${page(key).name}不计失败礼物`,['当前主播本场礼物G成功2件、失败3件、撤销1件；无其他G记录'],['查看礼物G收到数量'],'G收到数量为2',{point:'有效收礼件数'});
t('host-gift-gallery.html','没有记录时','未收到礼物的图鉴状态',['礼物目录包含G，当前主播从未成功收到G'],['查看G'],'G显示“未收到”',{point:'零收礼状态'});
t('host-gift-gallery.html','下架后','下架礼物保留已收历史',['主播已成功收到G共2件，平台随后下架G'],['查看G历史记录'],'历史收到数量仍为2',{point:'下架历史保留'});
t('host-gift-gallery.html','配置顺序','图鉴沿用礼物目录顺序',['当前礼物目录顺序G1、G2、G3；主播收礼数量分别1、100、0'],['查看礼物顺序'],'礼物顺序为G1、G2、G3',{point:'图鉴目录顺序'});
for(const k of ['host-home.html','host-center.html'])t(k,'不共用等级值',`${page(k).name}两类等级独立`,['主播成长等级5、财富等级2，对应等级图标配置有效'],['查看等级信息'],'主播等级5与财富等级2分别展示',{point:'成长等级隔离'});
for(const property of ['累计收益','有效天数','开播时长','观众人次','新增粉丝','送礼人数'])t('views/live-data/month.html','无数据月份',`空月份${property}不沿用前月`,['当前月有有效数据；目标历史月没有当前主播的有效场次'],['切换目标历史月',`查看${property}`],`${property}为0`,{point:property+'空值'});
t('live-records.html','历史记录不随','更改开播设置不改历史场次',['S1已结束，开播时主题“旧主题”封面A分类C1；主播后来把设置改成新主题、封面B、分类C2'],['打开S1场次','查看场次快照'],'S1仍使用旧主题、封面A和分类C1',{point:'场次配置快照',flow:'FLOW-LIVE'});
t('live-records.html','结束时间为空','直播中场次没有结束时间',['当前主播场次S正在直播'],['查看S结束时间'],'结束时间为空',{point:'进行中时间'});
t('income-sharing.html','按分成日期倒序','分成记录按日期倒序',['当前主播分成A日期9月10日、B日期9月14日；其他主播有C'],['查看记录列表'],'当前主播的B排在A前',{point:'分成日期排序'});
for(const k of ['group-manage-member.html','group-manage-owner.html'])t(k,'不影响消息接收',`${page(k).name}免打扰不影响收信`,['当前账号有效在群；已启用本群免打扰；其他成员随后发送M2'],['返回粉丝群聊天','查看M2'],'群内可看到M2',{point:'免打扰收信',sources:[ref('fan-group-chat.html','群消息：')]});
t('group-manage-owner.html','保存后群成员查看','主播修改群公告保存',['当前主播自己的粉丝群公告为旧公告'],['点击“编辑公告”','输入“九月群公告”','点击“保存”','返回粉丝群聊天'],'群公告显示“九月群公告”',{point:'公告保存',role:'主播',sources:[ref('fan-group-chat.html','群公告')]});
t('fan-group-chat.html','群公告','成员接收更新群公告',['用户A拥有有效团籍，所属主播已保存公告“九月群公告”'],['查看群公告'],'群公告显示“九月群公告”',{point:'公告成员视角',sources:[ref('group-manage-owner.html','保存后群成员查看')]});
for(const [type,action]of [['文字','输入消息“你好”'],['语音','输入语音消息“你好”'],['图片','上传图片A']])t('fan-group-chat.html','当前被禁言',`被群禁言后不能发送${type}`,['成员A有有效团籍且被当前群单人禁言'],[type==='文字'?'查看输入框':`点击“${type}”`],type==='文字'?'群消息输入框不可输入':'提示“当前被禁言”',{point:type+'禁言控制'});
t('views/message-center/fan-group.html','清除当前会话未读数','进入粉丝群清除本群未读',['有效群A未读3条，群B未读5条'],['点击群A','返回消息中心粉丝团列表'],'群A未读数清零',{point:'当前群未读清除'});
t('views/message-center/fan-group.html','清除当前会话未读数','进入粉丝群不清其他群未读',['有效群A未读3条，群B未读5条'],['点击群A','返回消息中心粉丝团列表'],'群B未读数保持5',{point:'其他群未读保留'});
for(const cause of ['主动退团','主播移出','拉黑主播'])t('views/message-center/fan-group.html','团籍失效后',`${cause}删除粉丝群会话入口`,['A原有有效团籍并有群会话；已完成'+cause],['查看粉丝群会话列表'],'原粉丝群会话入口被移除',{point:'群籍失效入口',flow:'FLOW-FAN-CLUB'});
for(const key of ['views/user-home/block-confirm.html','views/host-home/block-confirm.html','views/chat-settings/block-confirm.html'])for(const action of ['取消','关闭'])t(key,'取消或关闭',`${page(key).name}${action}保留关系`,['A与目标B为好友且互相关注；尚未拉黑，当前对话框对象B'],[`点击“${action}”`,'返回目标B主页'],'A与B的好友关系仍有效',{point:'拉黑取消关系',sources:[ref('user-home.html','好友')]});
for(const invalid of ['取消关注','建立拉黑关系','账号失效'])t('start-live-settings.html','不再出现在可选名单中',`历史可见名单排除${invalid}粉丝`,['历史可见名单A、B，A仍有效关注；B已'+invalid],['选择密码房','启用“从粉丝中授权可见”','点击编辑图标'],'可选名单不包含B',{point:'历史名单有效性',role:'主播',sources:[ref('visible-fan-select.html','仅展示当前仍关注')]});
t('visible-fan-select.html','返回时不保存','可见名单编辑返回不保存',['已保存名单A、B；当前有效粉丝还有C'],['取消勾选B','勾选C','点击“返回”'],'原保存名单仍为A和B',{point:'名单编辑取消',role:'主播'});
for(const n of [0,1,5,6])t('start-live-settings.html','最多 5 个头像',`密码房可见名单${n}人`,['当前主播有6个有效粉丝；均不在黑名单'],['选择密码房','启用粉丝授权','点击编辑图标',`选择前${n}名粉丝`,'点击“确认”'],`已选人数显示${n}`,{point:'可见人数统计',role:'主播'});
for(const required of ['门票','密码'])t('views/start-live-settings/room-normal.html','清除门票和密码必填',`切换普通房取消${required}必填`,['已打开房型设置；此前选择'+(required==='门票'?'门票房':'密码房')+'，未填写该必填项'],['选择“普通房”','点击“确认”'],'普通房可回填保存',{point:'房型条件校验',role:'主播'});
t('views/start-live-settings/category.html','已下架分类不可新选','直播分类排除下架项',['分类C1已启用，C2已下架；历史S曾使用C2'],['查看可选分类'],'不能新选择C2',{point:'分类有效范围',role:'主播'});
t('views/start-live-settings/category.html','关闭未选择','分类弹层取消保留原值',['当前选择C1；分类弹层尚未选择其他项'],['点击“关闭”'],'原分类保持C1',{point:'分类选择取消',role:'主播'});
t('start-live-settings.html','仅上传图片','封面选择非图片',['开播条件有效；准备一个真实文本文件test.txt'],['点击封面入口','选择test.txt'],'不能将test.txt设置为直播封面',{point:'封面文件类型',role:'主播'});
for(const permission of ['相机','麦克风'])t('start-live-settings.html','拒绝后再次操作',`拒绝${permission}后再次开播`,['有效主播；本场配置有效；系统'+permission+'权限已拒绝且不能再次弹出授权'],['点击“开始直播”'],'引导前往系统设置授予'+permission+'权限',{point:permission+'权限恢复',role:'主播'});
for(const action of ['取消','超时'])t('recharge.html',action==='取消'?'用户已取消':'超时自动取消',`充值${action}结果`,['充值前余额50；待支付订单R购买100基础金币及10赠币'],[action==='取消'?'取消渠道支付':'由测试支付渠道使R超时','返回充值页','查看余额'],'余额保持50金币',{point:'支付未成功余额',flow:'FLOW-RECHARGE'});
t('balance-detail.html','无法关联订单','奖励流水没有虚构订单详情',['当前账号有任务奖励10金币流水，无对应充值或消费订单'],['点击该奖励流水'],'只显示流水信息，不进入充值或消费订单详情',{point:'奖励流水入口'});
t('order-expense-detail.html','对象已失效','已结束消费对象保留订单快照',['订单C成功消费100金币，对应场次S已结束；当前余额500'],['点击订单业务对象'],'保留订单原商品、数量和金币快照',{point:'失效对象订单快照'});
for(const state of ['未开启','已拒绝'])t('settings.html','站内通知中心仍保留',`系统通知${state}仍保留站内消息`,['本设备系统通知'+state+'；账号有有效平台公告M1'],['打开消息中心系统通知','查看M1'],'站内显示平台公告M1',{point:'系统权限与站内消息',sources:[ref('system-notifications.html','系统通知')]});
// Platform disposition copy is specified in the overview; the observing user operates only the notice page.
const notices=[['直播举报不处置','举报内容暂无可处置违规，感谢您的反馈','举报人'],['直播举报警告','举报成立，平台已依规处理','举报人'],['直播举报警告','直播间存在违规，请及时调整','主播'],['直播举报关播','直播间存在违规，平台已关闭直播间','主播'],['直播举报关闭直播权限','直播间严重违规，平台已关闭直播间，并关闭直播权限','主播'],['账号举报不处置','举报账号暂无可处置的违规，感谢您的反馈','举报人'],['账号举报封禁','举报成立，平台已依规处理','举报人']];
for(const [action,copy,role]of notices){const src=overview.find(u=>u.原文.includes(copy));if(!src)throw Error(copy);t('system-notifications.html','通知',action+role+'接收通知',[`当前账号为该工单${role}；平台已对关联工单执行${action}`],['查看对应处理通知'],`通知正文为“${copy}”`,{point:role+'处置通知',role:role==='主播'?'主播':'用户',flow:action.startsWith('账号')?'FLOW-ACCOUNT-REPORT':'FLOW-LIVE-REPORT',sources:[src]});}
// Inspect configured probabilities and calculate expected RTP, without asserting finite random draws equal expectations.
const luckySource=overview.find(u=>u.原文.includes('10\\.4%'));
for(const [n,p0,p5,rtp]of [[1,10.4,32,96],[10,8.4,34,97],[100,6.4,36,98]]){
 t('admin-lucky-gift-detail.html','概率',`概要基准${n}次开奖奖档`,[`本次验收采用概要中${n}次开奖基准，单次消耗10金币；非另行批准的覆盖配置`],['查看奖励金币档位和概率'],`奖励0/5/10/50/100/1000的概率依次为${p0}%/${p5}%/55%/2%/0.5%/0.1%`,{point:'基准奖档概率',role:'平台管理员',sources:[luckySource,...overview.filter(u=>/^\|.*(?:32%|55%|2%|0.5%|0.1%|RTP)/u.test(u.原文))]});
 t('admin-lucky-gift-detail.html','RTP：',`概要基准${n}次开奖理论RTP`,[`单次消耗10，奖励0/5/10/50/100/1000，概率${p0}%/${p5}%/55%/2%/0.5%/0.1%`],['查看RTP'],`RTP显示${rtp}%`,{point:'基准概率期望',role:'平台管理员',sources:[luckySource]});
}
// State-specific views and cross-end observations not replaceable by the parent-page happy path.
t('live-room-host-password.html','密码房无法发起连麦','密码房点击PK反馈',['主播当前在密码房S直播'],['点击“PK”'],'提示“密码房无法发起连麦”',{point:'密码房连麦限制',role:'主播'});
t('views/live-room-host-password/more-actions.html','密码房不提供连麦入口','密码房设置隐藏连麦',['主播当前在密码房S直播'],['查看可用操作'],'不提供连麦入口',{point:'密码房设置权限',role:'主播'});
t('views/live-room-host-password/visible-scope.html','取消勾选在线用户','收回在线粉丝可见资格立即生效',['密码房S授权名单含在线粉丝A；主播B正在编辑本场名单'],['取消勾选A','返回本场在线观众列表'],'A已从本场在线观众列表移除',{point:'在线名单撤销',role:'主播',flow:'FLOW-ROOM-SCOPE',sources:[ref('views/live-room-host/audience-viewers.html','踢出后立即移除')]});
t('views/live-room-host-password/visible-scope.html','不二次确认','收回在线粉丝资格无确认弹窗',['密码房S名单内A在线，主播B正在编辑本场名单'],['取消勾选A'],'不展示踢出二次确认弹窗',{point:'名单撤销确认方式',role:'主播'});
t('views/fan-club/member-mute-confirm.html','取消或请求失败','粉丝群禁言取消',['主播B待禁言成员A原可发言'],['点击“取消”'],'A保留群内发言权限',{point:'群禁言取消',role:'主播'});
t('views/fan-club/member-mute-confirm.html','取消或请求失败','粉丝群禁言请求失败',['主播B待禁言成员A原可发言；测试服务只使本次禁言请求失败'],['点击“确认禁言”'],'A保留群内发言权限',{point:'群禁言失败',role:'主播'});
t('views/welfare-center/claimed.html','任务配置后续变更','已领奖后改任务配置不补发',['A已领取任务T实例的10金币，余额50；平台随后将T后续奖励改20'],['查看领取项和余额'],'当前余额保持50金币',{point:'已领奖实例隔离',flow:'FLOW-TASK'});
t('admin-gift-send-count-rules.html','停用后关联礼物','停用赠送数量规则',['规则R启用，关联普通礼物G数量1、10、100，默认10'],['点击R“停用”','查看R状态'],'R状态为停用',{point:'数量规则停用',role:'平台管理员',flow:'FLOW-GIFT-CONFIG'});
t('views/live-room/gift.html','数量','数量规则停用后赠礼选项恢复1',['普通礼物G原启用规则R允许1、10、100；平台已停用R'],['选择G','查看赠送数量'],'G仅支持赠送数量1',{point:'数量规则端侧生效',flow:'FLOW-GIFT-CONFIG',sources:[ref('admin-gift-send-count-rules.html','默认仅支持 ×1')]});
for(const end of ['直播结束','平台关播','公会关闭权限'])t('live-end-viewer.html','不能继续',`${end}后观众进入结束页`,['观众A正在观看S；配合账号已执行'+end],['查看场次S'],'S显示已结束状态',{point:'观众终态',flow:end==='公会关闭权限'?'FLOW-LIVE-PERMISSION':'FLOW-LIVE'});
for(const status of ['初审待审核','平台终审待审核','终审通过','终审驳回'])t('guild-detail.html','公会初审和平台终审',`入会流转到${status}的用户状态`,['A为公会G申请J的申请人；J已进入'+status],['查看与G的关系'],status==='终审通过'?'当前关系为已加入':status==='终审驳回'?'本次入会申请为已驳回':'当前关系尚未加入公会',{point:'入会阶段关系',flow:'FLOW-GUILD-JOIN'});
t('guild-host-detail.html','退会状态','退会批准后公会主播详情',['公会长已经批准B的退会申请；B曾属于本公会'],['查看B详情'],'显示【退会】标记',{point:'公会退会终态',role:'公会长',flow:'FLOW-GUILD-LEAVE'});
t('guild-detail.html','退会通过或被公会移除','退会批准后用户失去公会关系',['A原为G主播；G已批准A的退会申请'],['查看G关系'],'与G的当前关系为已退出',{point:'用户退会终态',role:'用户',flow:'FLOW-GUILD-LEAVE'});
t('host-center-pending.html','用户无主播身份','退会批准后主播入口回到申请',['A退会已获公会批准，原主播身份解除'],['点击“主播中心”'],'进入申请成为主播页',{point:'退会身份解除',flow:'FLOW-GUILD-LEAVE',sources:[ref('guild-detail.html','失去主播身份')]});
t('fan-group-chat.html','有效团籍成员','主播退会后成员失去群聊权限',['A原为主播B粉丝团成员；B的退会已获批准，原粉丝团已解散'],['打开原粉丝群旧入口'],'不能查看原群消息',{point:'主播退会群解散',flow:'FLOW-GUILD-LEAVE',sources:[ref('guild-leave-application.html','粉丝团立即解散')]});
t('guild-detail.html','当前账号与所选公会','公会停用后用户原关系解除',['A原属于G；平台已停用G'],['查看G当前关系'],'A与G原公会关系已解除',{point:'停用公会用户关系',flow:'FLOW-GUILD-DISABLE',sources:[ref('admin-guild-list.html','公会停用')]});
t('views/message-center/fan-group.html','只有有效团籍用户可进入','注销期满后创建的粉丝群解散',['主播B注销申请已满七日且未取消；A原为B的粉丝团成员'],['查看粉丝群列表'],'B的原粉丝群入口已移除',{point:'最终注销群权限',flow:'FLOW-ACCOUNT-DELETION',sources:[ref('settings.html','期满仍未取消')]});
t('friend-list.html','当前账号仍有效','注销期满解除好友关系',['B原为A的好友；B注销申请已满七日且未取消'],['输入B昵称'],'好友列表不包含B',{point:'最终注销好友关系',flow:'FLOW-ACCOUNT-DELETION',sources:[ref('settings.html','期满仍未取消')]});
t('guild-host-data.html','每次开播创建','主播新开播在公会形成场次记录',['主播B属于当前公会；B刚成功开启场次S，记录S实际编号'],['选择主播B和今日','查看场次记录'],'列表存在新场次S',{point:'公会新场次',flow:'FLOW-LIVE',role:'公会长',sources:[ref('start-live-settings.html','每次开播创建新的直播场次')]});
t('admin-live-management.html','统一展示','主播新开播在平台形成场次记录',['主播B刚成功开启场次S，记录S实际编号'],['查询S'],'列表中S为直播中',{point:'平台新场次',flow:'FLOW-LIVE',role:'平台管理员',sources:[ref('start-live-settings.html','每次开播创建新的直播场次')]});
t('admin-recharge-order.html','状态：','成功充值订单的平台状态',['测试渠道已使R支付成功，R基础100赠10金币'],['查询R'],'R状态显示充值成功',{point:'平台支付终态',flow:'FLOW-RECHARGE',role:'平台管理员',sources:[ref('recharge.html','支付成功')]});
t('guild-detail.html','公会初审和平台终审','公会初审驳回后的用户关系',['A的入会申请J已被公会初审驳回'],['查看G当前关系'],'A尚未加入G',{point:'初审驳回用户关系',flow:'FLOW-GUILD-JOIN',sources:[ref('guild-application-form.html','任一方驳回')]});
t('start-live-settings.html','已授权时创建新场次','有效条件开始新直播',['当前主播B账号、公会、认证、权限均有效；未在播；分类C启用、房型普通房；相机麦克风已授权'],['选择分类C','选择普通房','点击“开始直播”'],'进入新场次的主播直播间',{point:'成功开播',role:'主播',flow:'FLOW-LIVE'});
t('auth-login-register.html','已有账号','账号解封后重新登录',['A是已有Google绑定账号；平台刚解封A，Google授权正常，协议已勾选；无注销冷静期'],['点击“Google”','确认Google授权'],'进入首页',{point:'解封登录恢复',flow:'FLOW-ACCOUNT-BAN',sources:[ref('admin-user-detail.html','解封只恢复登录')]});
t('recharge.html','退款或渠道拒付','退款完成后用户余额为负',['A原余额100，订单R原到账1100；平台已对R全额退款成功'],['查看金币余额'],'金币余额=-1000',{point:'用户退款余额',flow:'FLOW-RECHARGE-REFUND',calc:calculation('-',[100,1100],['原余额','退款扣回金币'],'金币')});
t('guild-join-review.html','待公会审核','用户提交入会后的公会待审单',['A刚成功提交加入本公会的完整资料，申请号J；尚未公会审核'],['选择“审核中”','点击J'],'J处于待公会审核',{point:'公会收到入会申请',role:'公会长',flow:'FLOW-GUILD-JOIN'});
t('guild-leave-review.html','待审核','主播提交退会后的公会待审单',['在会主播B刚成功提交退出本公会的申请L；尚未处理'],['选择“待审核”','点击L'],'L处于待审核',{point:'公会收到退会申请',role:'公会长',flow:'FLOW-GUILD-LEAVE'});
t('guild-host-data.html','场次结束后','主动下播后公会保留历史场次',['本公会主播B的S刚结束；S收益100金币，开播1小时；没有其他场次'],['选择B和S开播日期','查看S'],'S场次记录仍存在',{point:'公会历史场次',role:'公会长',flow:'FLOW-LIVE'});
t('guild-operation-account-detail.html','发放成功后','公会成功发币后的余额',['运营账号A启用且未锁定，原余额50虚拟金币；账号与公会本月剩余可发额度均1000'],['点击“发放金币”','输入发放金额“100”','确认发放','查看账户余额'],'账户余额=150虚拟金币',{point:'公会发放到账',role:'公会长',flow:'FLOW-OPERATION-ISSUE',calc:calculation('+',[50,100],['原余额','本次发放'],'虚拟金币')});
t('admin-host-review.html','公会初审通过','公会初审通过后平台收到终审单',['公会G刚通过用户A的初审申请J；平台尚未处理'],['选择“待审核”','查询A和G'],'结果包含J',{point:'平台收到认证申请',role:'平台管理员',flow:'FLOW-GUILD-JOIN'});
for(const n of [1,10,100])t('live-room.html','x1、x10、x100 分别显示',`幸运礼物${n}份卡片价格`,['当前单次幸运礼物消耗10金币'],[`选择数量x${n}`,'查看礼物卡片价格'],`卡片价格=${10*n}金币`,{point:'幸运礼物卡片总价',calc:calculation('*',[10,n],['单份消耗','数量'],'金币')});
t('live-room-cohost-active.html','不合并账务','连麦双方场次账务独立',['B场次S1真实礼物收益100金币；C场次S2收益200金币；B与C正在连麦'],['查看本方B的本场收益'],'B本场收益为100金币',{point:'连麦场次收益隔离',role:'主播',flow:'FLOW-COHOST'});
for(const actor of ['主播','观众']){const src=overview.find(u=>u.原文.includes('主播和观众均不能看到被屏蔽'));if(!src)throw Error('Missing comment visibility source');t(actor==='主播'?'live-room-host.html':'live-room.html','公屏消息',`屏蔽评论后${actor}看不到M1`,['S公屏原有M1及M2；主播或房管已屏蔽M1，M2未被屏蔽'],['查看当前公屏M1'],'M1不在当前公屏显示',{point:'屏蔽消息'+actor+'视角',role:actor,sources:[src]});}
t('views/live-room/patrol-room-allowed.html','显示“巡房中”','巡房有效期间以巡房身份进入',['人员A账号未封禁，巡房任务有效，目标场次直播中；本次通过该有效任务进入'],['查看当前身份'],'显示“巡房中”',{point:'有效巡房身份',role:'巡房人员'});
for(const cause of ['主播黑名单','本场踢出'])t('views/live-room/blocked-room-restricted.html','不可观看直播',`访问受限${cause}遮挡内容`,['普通观众A命中'+cause+'，S仍直播中；无巡房会话'],['查看S直播内容'],'无法看到直播内容',{point:'受限内容保护',role:'观众'});
t('views/live-room/audience-managers.html','普通观众只读','普通观众房管列表只读',['当前普通观众A正在S直播间；主播已有有效房管B'],['查看房管列表操作区'],'不显示房管授权操作',{point:'房管列表观众权限',role:'观众'});
t('views/user-home/friend.html','不自动取消关注','删除好友后本方仍关注对方',['A与B为好友，A已关注B；当前执行账号A'],['点击“删除好友”','确认删除','查看关注状态'],'A对B的关注仍有效',{point:'删好友不取消关注'});
t('views/user-home/blocked.html','隐藏关注、好友和私信','黑名单主页关闭社交操作',['A已拉黑B，当前为B的原主页入口'],['查看底部操作区'],'关注、好友、私信操作均不可用',{point:'黑名单主页操作'});
t('views/start-live-settings/room-ticket.html','后台排序','门票价格按配置顺序单选',['启用档位P1价格100排序1、P2价格200排序2；档位P3已停用'],['选择门票房','查看可选价格'],'可选价格依次为100和200',{point:'票价有效顺序',role:'主播'});
t('views/start-live-settings/room-ticket.html','档位已停用','保存前票价被停用',['主播已选价格档位P1，平台随后停用P1但保留P2启用；尚未保存房型'],['点击“确认”'],'提示“请选择有效的门票价格”',{point:'配置变化二次校验',role:'主播'});
t('views/start-live-settings/room-ticket.html','不影响已创建场次','调整票价不修改在播场次',['S开播时门票100，后台后来将对应档位改为200；观众A尚未购S门票'],['打开S门票准入弹窗','查看本场票价'],'S门票价格仍为100金币',{point:'门票价格场次快照',role:'观众',sources:[ref('views/live-room/ticket-room-restricted.html','门票')]});
t('my-decoration-medal.html','对应勋章立即卸下','团籍解除立即卸下团勋章',['A原加入B粉丝团并佩戴该团等级勋章，A现已退出该团；财富等级勋章仍有效'],['查看原团勋章佩戴状态'],'原粉丝团勋章已卸下',{point:'团籍与装扮联动',flow:'FLOW-FAN-CLUB'});
t('invite-friends.html','上一页/下一页','邀请记录分页返回一致',['当前账号有足够形成两页的成功邀请记录，记录第一页显示的首尾对象'],['切换邀请记录','点击“下一页”','点击“上一页”'],'恢复第一页的原记录范围',{point:'邀请记录翻页'});
t('views/invite-friends/share-options.html','保存图片','邀请图片保存反馈',['当前账号邀请图片可生成；设备允许向用户选择位置保存该图片'],['点击“保存图片”'],'展示本次图片保存结果反馈',{point:'邀请图片保存'});
