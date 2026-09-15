import fs from 'node:fs/promises';
import {suite,definitions} from './design.mjs';
const start=definitions.length;
suite('live-room.html','房管',['公屏存在普通观众的两条评论M和N'],[['房管屏蔽单条评论',[],['选择评论M','点击屏蔽'],'仅M从公屏移除','REQ-a39354cda7ef REQ-f2ba90b0b147 COMMON-mute MAIN-251']]);
suite('live-room-host.html','本场主播',['巡房人员A已从后台有效巡房任务进入本场'],[
 ['巡房会话不能踢出',[],['打开A资料卡','点击踢出A'],'不能将A踢出本场','REQ-b93f80b008ba'],
 ['巡房会话不能拉黑',[],['打开A资料卡','点击拉黑A'],'不能建立对A的拉黑关系','REQ-b93f80b008ba'],
]);
suite('blacklist-management.html','主播',['A原在本人黑名单中；A刚完成有效巡房任务'],[['巡房结束保留原黑名单',[],['刷新黑名单'],'A原有拉黑记录仍保留','REQ-dc74156d7b15 REQ-af9fad486413']]);
for(const [page,id] of [['live-room-report.html','REQ-34dd77b1a73d'],['live-room-user-report.html','REQ-8c322038d82f']])suite(page,'普通用户',['当前举报对象有效'],[['举报类型完整集合',[],['查看举报类型'],'可选类型为色情低俗、涉及宗教政治、暴恐血腥、未成年人有害、其他',`${id} MAIN-286`]]);
suite('live-room.html','普通观众',['所查看场次已经结束'],[['结束场次不提供举报入口',[],['查看场次结束页面操作'],'不提供对已结束场次的直播举报入口','REQ-70c22d54cfec COMMON-report-end']]);
for(const condition of ['单人禁言','全员禁言','平台发言限制'])suite('fan-group-chat.html','有效粉丝团成员',[`当前群内${condition}生效`],[[`${condition}限制群发送`,[],['输入文本QA消息','尝试发送'],'QA消息不能发送到当前群','REQ-f64015dd42d4 REQ-8bf7930dbac7']]);
suite('fan-group-chat.html','有效粉丝团成员',['单人、全员和平台发言限制均已解除'],[['群限制解除后恢复发送',[],['输入文本QA恢复','点击发送'],'QA恢复写入当前群','REQ-f64015dd42d4']]);
suite('my-fan-clubs.html','有效粉丝团成员',['本人仅被所属主播单人群禁言'],[['群禁言保留团籍',[],['刷新我的粉丝团'],'原团籍仍有效','REQ-4ebe7fad319b MAIN-261']]);
suite('my-following.html','已关注主播的粉丝团成员',['本人仅被该主播单人群禁言'],[['群禁言保留关注',[],['刷新关注列表'],'该主播仍在关注列表','REQ-4ebe7fad319b']]);
suite('live-room.html','有效粉丝团成员',['本人在本主播粉丝群被禁言，本场公屏没有禁言限制'],[['群禁言不限制公屏',[],['输入文本QA公屏','点击发送'],'QA公屏成功发送','REQ-4ebe7fad319b']]);
suite('group-manage-owner.html','所属主播',['当前群公告为QA公告；另一群公告为QB公告'],[['主播管理公告所属群',[],['查看群公告'],'显示QA公告','REQ-ad1c58c7a863']]);
for(const [relation,state] of [['关注','已关注'],['好友','非好友'],['拉黑','未拉黑']])suite('user-home.html','用户A',['A已关注B但与B不是好友、未互相拉黑'],[[`用户主页${relation}独立状态`,[],[`查看B的${relation}状态`],`显示${state}`,'REQ-92eca975cc39']]);
suite('host-home.html','普通用户',['当前主播有3名有效粉丝、关注4人、历史累计观众人次20；展馆收到礼物A两件及B三件'],[
 ['主播粉丝统计',[],['查看粉丝数'],'显示3人','REQ-879aeceedc7c'],
 ['主播关注统计',[],['查看关注数'],'显示4人','REQ-879aeceedc7c'],
 ['主播历史观众统计',[],['查看观众数'],'显示20人次','REQ-879aeceedc7c'],
 ['主播礼物种类统计',[],['查看礼物种类'],'显示2种','REQ-71c9dec335e9'],
 ['主播礼物收到数量',[],['查看历史收到数量'],'显示5件','REQ-71c9dec335e9'],
]);
for(const [relation,state] of [['关注','已关注'],['好友','非好友'],['拉黑','未拉黑']])suite('host-home.html','普通用户A',['A关注主播B，与B不是好友且未互相拉黑'],[[`主播主页${relation}独立状态`,[],[`查看${relation}状态`],`显示${state}`,'REQ-572f18705840']]);
suite('host-home.html','普通用户A',['A与主播B非好友，已主动发出3条私信，B未回应'],[['主播主页私信权限受限',[],['点击私信','尝试再发送QA消息'],'第四条主动私信不能发出','REQ-572f18705840 REQ-ef2dad69af57']]);
suite('my-fan-clubs.html','有效粉丝团成员',['本人当前主播粉丝团本周贡献排名为第2名'],[['卡片本周我的排名',[],['查看卡片我的排名'],'显示第2名','REQ-b21b55b83439']]);
suite('my-fan-clubs.html','有效粉丝团成员',['本周A入团前贡献100、入团后50，B贡献100；A和B当前均为有效团籍，C已退团且贡献200，D为运营号'],[['卡片贡献本周范围',[],['查看卡片贡献榜头像顺序'],'A排在B前；不展示C和D','REQ-e53313feaa8d']]);
suite('start-live-settings.html','有开播资格的主播',['相机麦克风已授权，普通房主题和分类均有效，未上传封面'],[['开播封面可不填',[],['点击开始直播'],'允许创建本次场次','REQ-977cbf74d9f6']]);
for(const method of ['密码登录','验证码登录'])suite('auth-phone-login.html','未登录普通用户',[`当前已选择${method}并输入手机号`],[[`区号返回保留${method}`,[],['点击区号','选择印度尼西亚+62'],`仍为${method}`,'REQ-235781692515 REQ-b16a9f3760bc']]);
for(const [page,kind] of [['auth-phone-login.html','手机号'],['auth-email-login.html','邮箱']])suite(page,'未设置密码的用户',[`当前账号已绑定有效${kind}但未设置密码；协议已同意；已取得该账号有效验证码`],[[`未设置密码通过${kind}验证码登录`,[],[`输入已绑定${kind}`,'切换验证码登录','输入有效验证码','点击继续'],'进入首页','REQ-6247f34fa79d']]);
suite('account-password-change.html','已设置密码用户',['当前有效密码QaOld123'],[['修改密码旧密码为空',[],['清空当前密码','输入新密码QaNew123','尝试保存'],'不能将账号密码改为QaNew123','REQ-0817f48c7b49']]);
suite('views/settings/notification-default.html','已登录普通用户',['本设备尚未向系统申请通知授权'],[['首次系统通知状态',[],['查看系统通知状态'],'显示未开启','REQ-37faac19e032']]);
suite('views/settings/notification-granted.html','已登录普通用户',['本设备系统通知已授权；开播提醒关闭、互动通知开启；当前收到一条关注主播开播事件和一条好友申请'],[
 ['已授权关闭开播分类',[],['查看设备是否收到本次主播开播通知'],'不展示本次主播开播推送','REQ-d5b5caf244b0'],
 ['已授权保留互动分类',[],['查看设备收到的好友申请通知'],'展示本次好友申请互动推送','REQ-d5b5caf244b0'],
]);
suite('views/live-room/gift-recharge.html','真实金币用户',['后台当前端启用套餐P（100金币赠10金币）及支付渠道C'],[['快捷充值配置范围',[],['查看充值套餐和支付渠道'],'显示套餐P与渠道C','REQ-59889fd16fd0']]);
for(const status of ['失败','取消','超时'])suite('views/live-room/gift-recharge.html','真实金币用户',[`原金币余额20；本次选择有效套餐，支付最终状态为${status}`],[[`快捷充值${status}不增余额`,[],['提交支付','重新查看金币余额'],'余额仍为20金币','REQ-9c3dd005dcb3']]);
suite('views/live-room/gift-recharge.html','真实金币用户',['原余额20；本次套餐到账100金币且支付成功'],[
 ['快捷充值成功到账',[],['刷新金币余额'],'余额为120金币','REQ-9c3dd005dcb3 MAIN-320'],
 ['快捷充值成功记账',[],['进入余额明细'],'存在本次100金币充值记录','REQ-9c3dd005dcb3 MAIN-320'],
]);
suite('views/live-room/fan-club-joined.html','刚入团普通用户',['刚成功加入当前主播粉丝团'],[['入团获得粉丝群资格',[],['点击群聊入口'],'可以进入该主播粉丝群','REQ-8d9134a2137d REQ-37f0730a9355 REQ-befef46a7065']]);
suite('views/live-room/fan-club-joined.html','有效粉丝团成员',['当前团籍配置有效灯牌QA团及粉丝等级5'],[['有效团籍灯牌展示',[],['查看当前团籍灯牌'],'显示QA团灯牌','REQ-befef46a7065']]);
suite('views/live-room/profile-viewer.html','普通观众A',['A已关注观众B，与B不是好友且未拉黑'],[['观众资料卡关系独立',[],['查看B关系操作'],'已关注状态不会显示为已建立好友','REQ-24d552ed2e8a']]);
suite('views/live-room/contribution-gifts.html','普通观众',['本场仅成功送出单价10金币幸运礼物3件，另获50金币返奖'],[['本场礼物贡献不扣返奖',[],['查看该礼物贡献'],'贡献为30金币','REQ-e4023aa2b5d8']]);
suite('views/live-room/host-profile.html','普通观众',['资料卡对应主播A刚结束当前场次'],[['主播资料卡结束状态',[],['刷新主播资料卡'],'显示未开播','REQ-2f00157ac134']]);
for(const [field,value] of [['关注','已关注'],['好友','非好友'],['粉丝团','已加入'],['拉黑','未拉黑']])suite('views/live-room/host-profile.html','观众B',['B已关注A并加入A粉丝团，但非好友且未拉黑'],[[`主播资料卡${field}状态`,[],[`查看${field}状态`],`显示${value}`,'REQ-4b36047617a5']]);
for(const [action,target] of [['进入主页','主播A主页'],['私信','与主播A的单聊'],['举报','以主播A为对象的账号举报']])suite('views/live-room/host-profile.html','观众B',['当前主播为A，B与A为好友、未互相拉黑'],[[`主播资料卡${action}对象`,[],[`点击${action}`],`进入${target}`,'REQ-f6baa5b5497f']]);
for(const [page,ref,fields] of [
 ['views/live-room-host/contribution-rank.html','REQ-b614f798a960',[['头像','头像P'],['昵称','QA观众'],['财富等级','5级'],['粉丝等级','3级'],['灯牌','QA团'],['亲密度','20']]],
 ['views/live-room-host/focus-viewers.html','REQ-2e624b28feca',[['头像','头像P'],['昵称','QA观众'],['财富等级','5级'],['粉丝身份','QA团成员'],['本场贡献','100金币']]],
 ['views/live-room-host/audience-viewers.html','REQ-75ca663f5469',[['头像','头像P'],['昵称','QA观众']]],
])for(const [field,value]of fields)suite(page,'本场主播',[`观众A当前在线、账号有效，本场有贡献；A的${field}为${value}`],[[`主播${field}字段回显`,[],[`查看A的${field}`],`显示${value}`,ref]]);
suite('views/live-room-host/contribution-rank.html','本场主播',['观众A有本场真实贡献，但无本主播粉丝团身份'],[['无团籍不显示粉丝身份',[],['查看A贡献行'],'不展示A的粉丝等级、灯牌和团内亲密度','REQ-b614f798a960']]);
suite('views/live-room-host/audience-viewers.html','本场主播',['A当前在线，本场有效贡献100；B已离线且贡献200'],[['在线观众贡献展示',[],['查看A本场贡献'],'显示100金币','REQ-308e1c0a8899']]);
for(const state of ['在线','禁言','踢出'])suite('views/live-room-host/profile-host.html','本场主播',[`A本场实际状态为${state}`],[[`主播资料卡本场${state}`,[],['查看A本场状态'],`显示${state}`,'REQ-e6f248de1637']]);
suite('views/live-room-host/profile-host.html','本场主播',['A账号可访问，当前查看A资料卡'],[
 ['主播资料卡提及',[],['点击@'],'输入框预填@A','REQ-3712a1e7b851'],
 ['主播资料卡举报对象',[],['点击举报'],'进入以A为对象的账号举报','REQ-3712a1e7b851'],
]);
for(const state of ['可邀请','邀请中','已接受','已拒绝','已失效'])suite('views/live-room-host/cohost-hosts.html','本场主播',[`当前与主播B的邀请实际状态为${state}`],[[`连麦列表${state}状态`,[],['查看B邀请状态'],`显示${state}`,'REQ-f9623e60781e']]);
for(const [page,id,actions]of [
 ['views/live-room-host/more-actions.html','REQ-4756a9dfab09',[['美颜','美颜视图'],['禁用用户','当前场次禁言列表'],['转发','接收对象视图']]],
 ['views/live-room-host-password/more-actions.html','REQ-40d93242f27b REQ-c5fadd4364b6',[['美颜','美颜视图'],['禁用用户','当前场次禁言列表'],['房间密码','本场密码修改视图'],['访问范围','访问范围视图'],['转发','接收对象视图']]],
 ['views/live-room-cohost-active/more-actions.html','REQ-c0af0b921588',[['美颜','美颜视图'],['观众管理','本场观众管理'],['转发','接收对象视图']]],
]){
 const condition=page.includes('password')?'当前正在密码房直播':page.includes('cohost')?'当前正在与另一主播连麦':'当前正在普通房独立直播';
 for(const [action,view]of actions)suite(page,'本场主播',[condition],[[`更多${action}入口`,[],[`点击${action}`],`打开${view}`,id]]);
 suite(page,'本场主播',[condition,'更多操作视图已展开'],[['更多关闭返回直播',[],['点击关闭'],'返回当前直播间',id]]);
}
suite('views/live-room-host-password/access-scope.html','密码房主播',['当前场次确认的广场展示为关闭、仅团成员为开启；当前仍有有效粉丝团'],[
 ['直播中访问范围读取广场值',[],['查看广场展示'],'为关闭','REQ-068797d40d88'],
 ['直播中访问范围读取成员值',[],['查看仅粉丝团成员开关'],'为开启','REQ-cbb4675278fd'],
]);
suite('views/user-home/friend.html','用户A',['当前好友B头像P、昵称QB'],[['好友资料沿用目标账号',[],['查看B账号资料'],'显示B头像P和昵称QB','REQ-fd6c62574131']]);
suite('views/user-home/blocked.html','用户A',['A已拉黑B，B头像P、昵称QB'],[['拉黑状态资料仍属目标',[],['查看B账号资料'],'显示B头像P和昵称QB','REQ-43d2f18f40e8']]);
for(const [page,id,extra]of [['views/user-home/block-confirm.html','REQ-0e212575798c','REQ-3f6a2f729865'],['views/host-home/block-confirm.html','REQ-021b938a9ceb','REQ-24696928cf80'],['views/chat-settings/block-confirm.html','REQ-d2a042417034','REQ-d2a042417034']])suite(page,'用户A',['当前拉黑目标为昵称QB的账号B',`确认弹窗来自${page.includes('chat-settings')?'聊天设置':page.includes('host-home')?'主播主页':'普通用户主页'}`],[
 ['拉黑确认对象昵称',[],['查看确认对象'],'显示QB',id],
 ['拉黑确认后果说明',[],['查看后果说明'],'说明拉黑后的关系解除及聊天限制',extra],
]);
suite('views/start-live-settings/room-ticket.html','门票房主播',['本场已按10金币创建；后台随后将新开播可选档位调整为20金币'],[['门票档位修改不改本场',[],['查看当前场次门票价格'],'本场价格仍为10金币','REQ-ca2877e2e19c']]);
suite('views/start-live-settings/beauty.html','主播',['当前已选美颜模式的磨皮项目'],[['美颜项目单选',[],['选择美白项目'],'当前调整项仅为美白','REQ-f37aeaefa70d']]);
suite('views/start-live-settings/beauty.html','主播',['本次已上传封面P；历史场次封面Q'],[
 ['美颜不改变上传封面',[],['修改美颜参数为60','返回开播设置'],'上传封面仍为P','REQ-58a921917bfa REQ-99aefa286dad'],
 ['美颜不改历史封面',[],['修改美颜参数为60','进入直播记录','查看该历史场次'],'历史封面仍为Q','REQ-58a921917bfa'],
]);
suite('order-expense-detail.html','真实金币用户',['已成功赠送礼物A并完成开奖、扣款；随后礼物A下架'],[['礼物下架保留消费记录',[],['查看本次礼物支出详情'],'已完成的支出订单及原支付金额保留','MAIN-337']]);
suite('my-following.html','用户A',['A原关注3人；刚在B主页成功关注B'],[['关注后本人关注数增加',[],['查看关注列表总数'],'关注数为4','MAIN-237']]);
suite('profile.html','主播B',['原粉丝数3；账号A刚成功关注B'],[['被关注后粉丝数增加',[],['刷新我的页面'],'粉丝数为4','MAIN-237']]);
suite('system-notifications.html','用户A',['A已关注主播B，系统通知权限和开播提醒偏好均开启，B刚开始直播'],[['关注主播开播提醒',[],['查看设备收到的开播通知'],'收到B本次开播提醒','MAIN-237']]);
suite('interaction-notifications.html','好友申请接收用户B',['A刚向B成功发送好友申请，二者原非好友'],[['好友申请通知接收',[],['刷新互动通知'],'出现来自A的待处理好友申请','MAIN-238']]);
for(const [state,expected] of [['开始时间之前','不能赠送该定制礼物'],['已过开始时间且未到结束时间','可以成功赠送该定制礼物'],['已过结束时间','不能赠送该定制礼物']])suite('views/live-room/gift.html','真实金币观众',[`定制礼物配置有效时间窗口，当前为${state}；余额足够且房间正在直播`],[[`定制礼物${state}`,[],['查看所选定制礼物','尝试点击赠送'],expected,'MAIN-333']]);
for(const period of ['今日','本月'])suite('host-center.html','当前主播',[`所选${period}范围内普通礼物100金币、定制礼物200金币、门票50金币、幸运礼物送出价值1000金币；幸运比例1%；另有虚拟礼物1000及失败消费100，无其他收益`],[[`${period}主播收益类型汇总`,[],[`选择${period}`,'查看收益'],'收益为360金币','REQ-2bd6e59a40ad']]);
suite('views/message-center/fan-group.html','粉丝团成员',['有效团籍对应G1和G2会话，最后消息同一时间，G1会话ID100、G2为101'],[['粉丝群会话同时间排序',[],['查看粉丝群会话顺序'],'G2排在G1前','REQ-12b73498ee66']]);
suite('views/message-center/fan-group.html','粉丝团成员',['G1最后消息10:00、G2为11:00，两群团籍均有效；原群G3团籍失效'],[
 ['粉丝群会话时间排序',[],['查看粉丝群会话顺序'],'G2排在G1前','REQ-12b73498ee66'],
 ['粉丝群会话有效团籍范围',[],['查看粉丝群会话'],'不展示团籍失效的G3','REQ-12b73498ee66'],
]);
suite('views/welfare-center/claimed.html','用户A',['A已领取签到及任务奖励；B有另外一笔已领取奖励，A并未领取该笔'],[['已领取奖励账号隔离',[],['查看已领取奖励'],'仅展示属于A的签到及任务奖励','REQ-9ecc2ec4021b']]);
await fs.writeFile('work/liveshow-user-260915-001/user/closure-design-draft.json',JSON.stringify(definitions.slice(start),null,2)+'\n');
console.log({最后补充:definitions.length-start});
