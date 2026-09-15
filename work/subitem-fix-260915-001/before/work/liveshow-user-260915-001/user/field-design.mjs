import fs from 'node:fs/promises';
import {suite,definitions} from './design.mjs';
const start=definitions.length;
// Each row names an explicit current requirement, fixture and observable field.
const fields=[
 ['contribution-ranking.html','普通用户','REQ-75038c4aca1b','贡献榜账号资料','榜内账号A昵称QA贡献、头像已上传、财富等级5','账号A资料','头像、昵称QA贡献、财富等级5'],
 ['search-results.html','普通用户','REQ-2d4beeaefb29','搜索账号当前资料','搜索命中A；A已将昵称改为QA新名字并更新头像','搜索命中账号A','A当前头像与昵称QA新名字'],
 ['welfare-center.html','普通用户','REQ-338d84306791','签到周期展示','当前连续签到2天，第3天为今日；奖励配置已提供','签到周期','已签到第1和第2天、今日第3天及后续天数对应奖励'],
 ['welfare-center.html','普通用户','REQ-36bf288c0aac REQ-a1b71811e1c9','任务配置展示','配置任务QA观看：目标10分钟、当前5分钟、奖励20金币','QA观看任务','任务名称QA观看、当前5分钟、目标10分钟及奖励20金币'],
 ['welfare-center.html','普通用户','REQ-28f7a6e9b28a','邀请卡片奖励配置','当前每位有效邀请奖励配置为20金币','邀请好友卡片','每位有效邀请奖励20金币'],
 ['message-center.html','普通用户','REQ-322341a6d597','消息分类入口','当前账号存在各类消息','消息分类','系统通知、互动通知、私信、粉丝团群聊四类入口'],
 ['system-notifications.html','普通用户','REQ-3da68feb6dc8','系统通知类型','已向本账号发送公会关系、主播身份、直播权限、平台系统四类通知','系统通知列表','四类通知各自对应的内容'],
 ['follower-list.html','普通用户','REQ-06781424f98c','粉丝当前资料','A当前关注我，昵称QA粉丝并已上传头像','A用户行','A当前头像和昵称QA粉丝'],
 ['follower-list.html','普通用户','REQ-06f48abd9575','粉丝财富等级','A当前财富5级','A用户行','A财富等级5'],
 ['follower-list.html','普通用户','REQ-0a573c5787e8','粉丝当前勋章','A当前已佩戴勋章M','A用户行','A当前勋章M'],
 ['my-following.html','普通用户','REQ-0d78c93a8230','关注账号资料','A已被当前用户关注，昵称QA关注、头像有效，当前在播','A用户行','A当前头像、昵称QA关注及开播状态'],
 ['my-decoration.html','普通用户','REQ-82444db2b0ad','本人装扮资料','当前账号已佩戴勋章M且上传头像P','当前头像和勋章','头像P及已佩戴勋章M'],
 ['my-decoration.html','普通用户','REQ-315592591f20','装扮分类','已进入我的装扮','分类入口','已拥有和装扮商城'],
 ['live-room-host.html','本场主播','REQ-b10ded34886b','主播在线人数','本场当前在线观众为7人','直播在线人数','当前在线人数7'],
 ['live-room-host.html','本场主播','REQ-7ba223129156','公屏消息类型','本场存在评论、进房、成功赠礼、系统消息','公屏','对应四类消息内容'],
 ['live-end-viewer.html','普通观众','REQ-d96cf6926bbb','结束页提示','对应场次刚结束且主播未新开播','结束页提示','主播正在整理本场内容'],
 ['friend-list.html','普通用户','REQ-e2045547464c','好友当前资料','A是当前好友，昵称QA好友、头像已上传','A用户行','A当前头像和昵称QA好友'],
 ['friend-list.html','普通用户','REQ-ee2d7fae7437','好友财富等级','A为当前好友、财富5级','A用户行','A财富等级5'],
 ['friend-list.html','普通用户','REQ-256b60dc5e1d','好友当前勋章','A为当前好友、当前佩戴勋章M','A用户行','A当前勋章M'],
 ['interaction-notifications.html','普通用户','REQ-fa316e8ebde9','互动通知类型','当前账号已收到关注、好友申请、申请通过、申请拒绝通知','互动通知列表','各条对应的关注或好友处理内容'],
 ['fan-group-chat.html','粉丝团成员','REQ-b5c027940215','群直播卡片快照','群内分享场次S，封面P、主题QA直播，S正在直播','场次S直播卡片','封面P、主题QA直播和当前在播状态'],
 ['group-manage-member.html','粉丝团成员','REQ-be7d000d156f','成员群公告内容','当前粉丝群公告已保存为QA群公告','群公告','QA群公告'],
 ['blacklist-management.html','普通用户','REQ-c126763bb274','黑名单资料','已拉黑A，A当前昵称QA黑名单并上传头像','A用户行','A头像和昵称QA黑名单'],
 ['guild-application-records.html','入会申请人','REQ-d72906c23271','申请记录公会头像','当前申请属于公会G，其当前头像P','G申请记录','公会头像P'],
 ['guild-application-records.html','入会申请人','REQ-a928c89adce3','申请记录当前公会名','公会G已改名为QA公会新名','G申请记录','QA公会新名'],
 ['guild-application-records.html','入会申请人','REQ-d51b9931ad53','申请记录公会ID','公会G唯一ID为1001','G申请记录','公会ID1001'],
 ['guild-detail.html','入会申请人','REQ-22354e754881','关系详情公会资料','所选公会G当前昵称QA公会、ID1001、头像P','公会资料','头像P、名称QA公会及ID1001'],
 ['guild-detail.html','入会申请人','REQ-6bdfad279b7f','关系申请提交时间','加入申请于09/15 10:00提交','加入申请时间轴','提交时间09/15 10:00'],
 ['host-home.html','普通用户','REQ-c41f05eeea81','主播主页身份','主播A资料有效、主播5级、财富3级、当前在播','主播A资料','当前账号资料、主播5级、财富3级及在播状态'],
 ['host-home.html','普通用户','REQ-523864988163','主页粉丝团资料','当前查看A；团名QA粉丝团、等级5、成员10人，本人已入团','粉丝团信息','团名QA粉丝团、等级5、10名成员及本人已入团状态'],
 ['host-gift-gallery.html','普通用户','REQ-7ff8f9f58a0b','展馆礼物资料','礼物目录有玫瑰及其图标','玫瑰礼物','玫瑰名称和对应图标'],
 ['my-fan-clubs.html','粉丝团成员','REQ-fe45961bd66f','我的粉丝团名称','当前已加入粉丝团，其名称为QA粉丝团','该粉丝团卡片','QA粉丝团'],
 ['my-fan-clubs.html','粉丝团成员','REQ-9a127a6822af','本人主播亲密度','当前用户与A亲密度20；与B亲密度50','A粉丝团卡片','本人对A亲密度20'],
 ['moderator-management.html','主播','REQ-ddae36460c4f','房管管理账号资料','已授权A为房管，其昵称QA房管、ID2001、头像P','A房管资料','头像P、昵称QA房管、ID2001及已授权状态'],
 ['host-guild-notifications.html','主播','REQ-4a4d3dc2c8a5','公会未读标记','存在尚未阅读的公会通知N','通知N标题','未读提示点'],
 ['host-center-pending.html','入会申请人','REQ-67c887a336e5','审核对应公会名','向QA公会提交申请，当前公会初审中','审核流程','对应公会名称QA公会'],
 ['income-sharing.html','主播','REQ-defd01187ffd','分成日期展示','平台已上传当前主播日期09/01的分成记录','该分成记录','分成日期09/01'],
 ['balance-detail.html','普通用户','REQ-b38495f92d9c','金币流水发生时间','当前金币流水发生于09/15 10:00:00，显示时区已固定','该流水日期时间','09/15 10:00:00'],
 ['order-expense-detail.html','普通用户','REQ-f33b17c3d436','消费支付时间','本笔消费实际支付时间09/15 10:00:00，显示时区已固定','支付时间','09/15 10:00:00'],
 ['views/live-room/audience-online.html','普通观众','REQ-52f4b1869e7b','观众列表身份','A仍在本场在线，昵称QA观众、头像P、身份普通观众','A用户行','头像P、昵称QA观众及普通观众身份'],
 ['views/live-room/audience-online.html','普通观众','REQ-3bea5c2fc073','观众列表房管标识','A在线且已被当前主播授权房管','A用户行','房管标识'],
 ['views/live-room/audience-managers.html','普通观众','REQ-87f9adb35bc9','房管列表在线状态','A为已授权房管且在线，B为已授权房管且离线','房管列表','A、B各自头像昵称及对应在线状态'],
 ['views/live-room/profile-viewer.html','普通观众','REQ-e8ca95fbaeb6','观众资料卡字段','目标A头像P、昵称QA观众、ID2001、财富5级且有当前主播有效团籍','A资料卡','A头像、昵称、ID、财富等级及粉丝团身份'],
 ['views/live-room-host/profile-host.html','本场主播','REQ-fb165905feb1','主播权限资料卡字段','目标A头像P、昵称QA观众、ID2001、财富5级且有当前主播有效团籍','A资料卡','A头像、昵称、ID、财富等级及粉丝团身份'],
 ['views/live-room-host/profile-host.html','本场主播','REQ-f9c368552fe8','资料卡长期房管身份','A前一场已获授权，本场未取消','A资料卡','A仍为本主播房管'],
 ['views/live-room-host/thank-message.html','本场主播','REQ-b3eec5b5991d','答谢目标昵称','当前答谢账号昵称QA观众','答谢预填内容','以@QA观众开头'],
 ['views/live-room-host/cohost-hosts.html','本场主播','REQ-5c70fc647de5','连麦列表主播资料','目标B普通房在播，未连麦且未拉黑，昵称QA主播、ID3001、头像P','B主播行','头像P、昵称QA主播、ID3001和在播状态'],
 ['views/live-room-host/cohost-hosts-search-result.html','本场主播','REQ-5830c74dc05c','连麦搜索结果身份','搜索命中可邀请的普通房主播B','B搜索结果','B主播身份、开播状态及可邀请状态'],
 ['views/live-room-host/cohost-invite-notice.html','受邀主播','REQ-9fa5cc4e0691','连麦邀请提示资料','当前仅收到主播B的有效邀请，B昵称QA主播、头像P','邀请提示','B头像、昵称及待处理邀请数量1'],
 ['views/message-center/fan-group.html','粉丝团成员','REQ-b749819a362c','粉丝群会话摘要','所属团名QA团、主播头像P、最后消息QA消息，当前未读3条','对应群会话','团名QA团、头像P、QA消息及未读3'],
];
for(const [page,role,id,point,pre,object,result] of fields)suite(page,role,[pre],[[point,[],[`查看${object}`],`显示${result}`,id]]);
suite('views/live-plaza/notification-permission.html','普通用户',['系统授权请求已调起'],[
 ['允许通知后的设备状态',[],['点击允许','进入设置页面'],'系统通知状态为已开启','REQ-37f11691aa7c REQ-0586497bc3b2'],
 ['拒绝通知后的设备状态',[],['点击不允许','进入设置页面'],'系统通知状态为已拒绝','REQ-37f11691aa7c REQ-0586497bc3b2'],
]);
suite('profile.html','已通过主播认证的用户',['取得主播身份前昵称QA用户、余额50；认证过程没有资产或资料变更'],[
 ['主播身份共用个人资料',[],['查看本人资料'],'昵称仍为QA用户','REQ-3da3ec958323'],
 ['主播身份共用金币资产',[],['查看金币余额'],'真实金币余额仍为50','REQ-3da3ec958323'],
]);
for(const [page,id] of [['follower-list.html','REQ-bd3781ae9b8f'],['friend-list.html','REQ-a41619271db7']])suite(page,'普通用户',['初始A排在B前，A与B昵称都含QA'],[['搜索保留原相对顺序',[],['输入QA进行搜索'],'A仍排在B前',id]]);
suite('group-manage-owner.html','所属主播',[],[
 ['主播群免打扰只改本人',['当前免打扰关闭，成员B偏好为关闭'],['启用群消息免打扰'],'本主播对此群的免打扰变为开启','REQ-036c0e60df9f'],
]);
suite('views/live-room-host/profile-host.html','本场主播',[],[
 ['被踢出目标不可设房管',['目标A已被本场踢出，房管人数未满'],['点击设置房管'],'不能为A新增房管身份','REQ-30c04f250716'],
 ['有效巡房目标无拉黑',['目标A正处于有效巡房会话'],['查看A资料卡操作'],'不展示拉黑操作','REQ-0448a822e711'],
 ['有效巡房目标无踢出',['目标A正处于有效巡房会话'],['查看A资料卡操作'],'不展示踢出操作','REQ-0448a822e711'],
]);
suite('views/live-room-host/restore-speaking-confirm.html','本场主播',[],[
 ['目标已恢复不重复处理',['恢复确认弹窗打开后，A已由房管恢复发言'],['点击确认恢复发言'],'不再次执行恢复操作','REQ-0ef5361aead4'],
 ['场次已结束不恢复旧禁言',['恢复确认弹窗打开后，本场已经结束'],['点击确认恢复发言'],'不执行旧场次恢复操作','REQ-0ef5361aead4'],
]);
for(const [page,sort,online,extra,role] of [
 ['live-room-host-password.html','REQ-c94dec07483e','REQ-72bac391175c','REQ-26f99f94541b','密码房主播'],
 ['live-room-cohost-active.html','REQ-461d464f7160','REQ-3e8170f29339','REQ-b7bee2c7134c','连麦中主播'],
]){
 suite(page,role,['当前场次真实金币贡献记录已准备，不涉及运营虚拟金币'],[
  ['本场贡献多级排序',['A贡献200；B/C/D贡献100；B粉丝5级；C/D粉丝3级、财富2级；C的ID2，D的ID10'],['打开本场贡献榜'],'顺序为A、B、C、D',sort],
  ['本场榜单容量',['当前有100名有效贡献者，已按规定条件完成全排序'],['打开本场贡献榜','滚动到底部'],'只展示排序前99名',sort],
  ['在线贡献多级排序',['在线A贡献200；B/C/D贡献100；B粉丝5级；C/D粉丝3级、财富2级；C的ID2，D的ID10'],['打开在线观众','切换按贡献'],'顺序为A、B、C、D',online],
  ['在线时长多级排序',['在线A时长20分钟；B/C时长10分钟且贡献相同；B粉丝5级，C粉丝3级'],['打开在线观众','切换按停留时长'],'顺序为A、B、C',online],
  ['消费冲正更新排名',['A贡献200、B贡献150；A其中100金币消费已完成有效冲正'],['打开本场贡献榜','刷新榜单'],'B排在A前',extra],
  ['充值退款保留贡献',['A本场赠礼100已完成；对应充值刚退款但赠礼未冲正'],['打开本场贡献榜','刷新榜单'],'A本场贡献仍为100',extra],
 ]);
}
await fs.writeFile('work/liveshow-user-260915-001/user/field-design-draft.json',JSON.stringify(definitions.slice(start),null,2)+'\n');
console.log({新增字段与角色分支:definitions.length-start});
