import {test,ref,page,designs} from './design-cases.mjs';
const dm='direct-message.html';
for(const type of ['文本','语音','图片'])for(const n of [0,2,3])test(dm,'非好友一方最多',`非好友已发${n}条再发${type}`,[`A与B非好友且无拉黑，A向B已成功发送${n}条，B向A已发3条`],['打开与B的单聊',...(type==='文本'?['输入“你好”','点击“发送”']:type==='语音'?['点击“语音”','录制一条语音','点击“发送”']:['点击“图片”','选择测试图片A'])],n<3?`会话新增一条A发出的${type}消息`:'显示“非好友最多发送三条”',{point:'非好友单向计数',dimension:'输入边界',flow:'FLOW-FRIEND-DM'});
for(const type of ['文本','语音','图片'])test(dm,'好友之间可持续',`好友发送第4条${type}`,['A与B为好友且无拉黑，A已成功发出3条'],['打开与B的单聊',...(type==='文本'?['输入“第4条”','点击“发送”']:type==='语音'?['点击“语音”','录制一条语音','点击“发送”']:['点击“图片”','选择测试图片A'])],`会话新增第4条${type}消息`,{point:'好友不受三条限额',flow:'FLOW-FRIEND-DM'});
for(const side of ['A拉黑B','B拉黑A'])for(const type of ['文本','语音','图片'])test(dm,'同页视图-拉黑关系',`${side}后发送${type}`,[`已打开A与B的会话，随后建立${side}关系`],[...(type==='文本'?['输入“你好”','点击“发送”']:type==='语音'?['点击“语音”','录制一条语音','点击“发送”']:['点击“图片”','选择测试图片A'])],'消息下方显示“消息发送失败，对方拒收”',{point:'双方拉黑拒收',dimension:'权限差异',flow:'FLOW-BLOCK'});
test(dm,'拒收不计入','拒收消息不占非好友成功额度',['A向非好友B已成功发送2条，之后1条消息被拒收，现拉黑已解除'],['打开与B的单聊','输入“重新发送”','点击“发送”'],'会话新增该条成功消息',{point:'失败不计成功额度',flow:'FLOW-FRIEND-DM'});
test(dm,'点击失败图标重试','网络发送失败后重试',['A与B为好友，消息“你好”因网络异常发送失败，消息正文和失败图标仍保留；网络已恢复'],['打开与B的单聊','点击“你好”消息的失败图标'],'“你好”消息发送成功',{point:'私信失败恢复',dimension:'重试/恢复'});
test(dm,'点击取消','取消语音录制',['A与B可正常发送消息'],['打开与B的单聊','点击“语音”','录制一条语音','点击“取消”'],'会话不新增语音消息',{point:'录音取消',dimension:'中断/取消'});
test(dm,'对方进入会话','私信已读回执',['A发送消息M1给B，B尚未查看；B在配合操作中进入该会话'],['打开与B的单聊','查看M1的已读状态'],'M1显示已读',{point:'私信已读状态'});
for(const expected of ['双方好友关系解除','双方聊天记录清空'])test('user-home.html','删除好友确认',`删除好友后${expected}`,['A与B为好友且各有该会话历史消息M1'],['打开B的用户主页','打开右上角更多','点击“删除好友”','确认删除'],expected,{point:'删除好友影响',flow:'FLOW-FRIEND-DM'});
for(const action of ['同意','拒绝'])test('interaction-notifications.html',action+' ->',`处理好友申请选择${action}`,['A收到B的一笔待处理好友申请，无拉黑'],['打开互动通知',`点击B申请的“${action}”`],action==='同意'?'A与B建立双向好友关系':'A与B不建立好友关系',{point:'好友申请处理',flow:'FLOW-FRIEND-DM'});
for(const action of ['同意','拒绝'])test('interaction-notifications.html','按钮不可重复点击',`好友申请${action}后禁止重复处理`,['A已对B的好友申请执行'+action],['打开互动通知'],'该申请的处理按钮不可重复点击',{point:'好友申请幂等',dimension:'重复操作'});
test('interaction-notifications.html','已失效的好友申请','失效好友申请只读',['A与B之间待处理申请因拉黑已失效'],['打开互动通知'],'该申请不展示同意、拒绝按钮',{point:'失效申请入口',dimension:'权限差异'});
for(const result of ['双方关注关系解除','双方好友关系解除','加入对方粉丝团的关系解除','待处理好友申请失效','双方私信会话删除','双方聊天记录删除'])test('chat-settings.html','拉黑会解除',`拉黑后${result}`,['A与B存在本条结果涉及的关系或历史记录，双方初始无拉黑'],['打开与B的单聊设置','点击“拉黑”','确认拉黑'],result,{point:'账号拉黑关联清理',flow:'FLOW-BLOCK'});
test('chat-settings.html','取消不改变关系','取消拉黑保留关系',['A与B是好友、相互关注且存在会话M1'],['打开与B的单聊设置','点击“拉黑”','点击“取消”'],'A与B的原关系保持不变',{point:'拉黑取消',dimension:'中断/取消'});
for(const action of ['搜索','关注','申请好友','私信','观看直播','加入粉丝团'])test('host-home.html','拉黑后解除',`拉黑主播后限制${action}`,['A与主播B之间存在拉黑关系，B仍在播'],['打开B的主播主页'],`A不能对B执行${action}`,{point:'拉黑权限联动',dimension:'权限差异',flow:'FLOW-BLOCK',sources:[ref('chat-settings.html','拉黑后双方'),ref('views/live-room/host-profile.html','拉黑后不能')]});
for(const setting of ['chat-settings.html','group-manage-member.html','group-manage-owner.html'])for(const effect of ['通知','消息接收'])test(setting,'免打扰',`${page(setting).name}开启免打扰后的${effect}`,[setting==='chat-settings.html'?'A与B有有效单聊':'A有当前粉丝群成员身份'],[`打开${page(setting).entry}`,'开启消息免打扰'],effect==='通知'?'关闭当前账号对此会话的新消息通知':'当前账号仍可接收该会话消息',{point:'免打扰边界',role:setting==='group-manage-owner.html'?'主播':'用户'});
for(const [key,label]of [['friend-list.html','好友'],['follower-list.html','粉丝']]){
 for(const term of ['测试','不存在XYZ',''])test(key,'搜索',`${label}昵称搜索${term||'清空'}`,[`A的当前${label}仅有测试B和另外C，二者原顺序已记录`],[`打开${page(key).entry}`,term?`输入搜索词“${term}”`:'清空搜索'],term==='不存在XYZ'?'显示空状态':term===''?`显示全部两名${label}`:'仅显示测试B',{point:'关系列表搜索'});
 for(const area of key==='friend-list.html'?['头像','昵称','等级','勋章','行内空白']:['头像'])test(key,key==='friend-list.html'?'点击好友整行':'点击头像',`${label}列表点击${area}`,['测试B为普通用户，处于当前列表'],[`打开${page(key).entry}`,`点击测试B的${area}`],'进入测试B的用户主页',{point:'关系列表行入口'});
}
test('message-center.html','固定置顶','消息中心固定通知入口',['系统通知和互动通知最近时间早于私信B及粉丝群C'],['打开消息中心'],'系统通知和互动通知固定置顶',{point:'会话固定置顶'});
test('message-center.html','最后消息时间倒序','私信和群会话按最后消息排序',['私信B最后消息10:01，群C最后消息10:02；同一天'],['打开消息中心'],'群C排列在私信B之前',{point:'会话时间排序'});
test('message-center.html','会话 ID 从大到小','会话时间相同按ID倒序',['私信会话ID1001和群会话ID1002最后消息时间相同'],['打开消息中心'],'会话1002排列在1001之前',{point:'会话同值排序'});
test('message-center.html','清除该会话未读数','进入会话只清除本会话未读',['私信B未读3，群C未读2'],['打开消息中心','点击私信B'],'私信B的未读数清零',{point:'会话已读',sources:[ref('message-center.html','会话：')]});
for(const key of ['system-notifications.html','interaction-notifications.html']){
 test(key,'时间相同',`${page(key).name}同时间排序`,['通知N1001和N1002服务端生成时间相同'],[`打开${page(key).entry}`],'N1002排列在N1001之前',{point:'通知同值排序'});
 test(key,'数据范围',`${page(key).name}账号隔离`,['通知N1发送给A，N2仅发送给B，当前登录A'],[`打开${page(key).entry}`],'列表仅显示发送给A的N1',{point:'通知接收范围'});
}
test('system-notifications.html','只读','系统通知不可操作',['A收到一条公会审核通过通知'],['打开系统通知','查看该通知'],'该通知不提供跳转或业务操作入口',{point:'系统通知只读'});
const group='fan-group-chat.html';
for(const state of ['主动退出','被移出','拉黑主播'])test(group,'历史消息不再开放',`团籍因${state}解除后访问群聊`,[`A原为B粉丝团成员，历史消息M1存在；A现已${state}`],['打开B粉丝群的旧会话入口'],'不能查看B粉丝群历史消息',{point:'团籍失效访问',flow:'FLOW-FANCLUB',dimension:'权限差异'});
for(const mode of ['单人禁言','全员禁言','平台限制'])for(const input of ['文本','语音','图片','表情'])test(group,'点击语音、图片、表情',`群${mode}时使用${input}`,['A是有效团籍成员，当前受'+mode],['打开粉丝群聊',input==='文本'?'点击群消息输入框':`点击“${input}”`],input==='文本'?'输入框显示“当前被禁言”且不可输入':'显示“当前被禁言”',{point:'群内禁言限制',dimension:'权限差异',flow:'FLOW-FANCLUB'});
test(group,'取消录音','群语音取消',['A是有效群成员且未禁言'],['打开粉丝群聊','点击“语音”','录制一条语音','点击“取消”'],'不生成群语音消息',{point:'群录音取消',dimension:'中断/取消'});
for(const state of ['直播中','已结束'])test(group,'直播卡片关联',`群直播卡片对应场次${state}`,[`卡片关联S1且${state}，主播可能另有新场S2`],['打开粉丝群聊','点击S1直播卡片'],state==='直播中'?'进入S1的房间准入流程':'提示直播已结束',{point:'分享卡片场次绑定',flow:'FLOW-LIVE-END',sources:[ref(group,'场次已结束')]});
for(const result of ['团籍解除','群籍解除','粉丝等级清零','亲密度清零','对主播的关注关系保留'])test('group-manage-member.html','主动退出',`主动退团后${result}`,['A属于B粉丝团、关注B，粉丝等级5、亲密度100'],['打开B粉丝群管理','点击“退出粉丝团”','确认退出'],result,{point:'主动退团联动',flow:'FLOW-FANCLUB'});
test('group-manage-member.html','不具备成员管理权限','普通团员没有管理入口',['A为B粉丝团普通成员'],['打开群管理'],'不展示成员管理入口',{point:'团员管理权限',role:'粉丝团成员',dimension:'权限差异'});
test('group-manage-member.html','同一第三方粉丝团','被拉黑双方在第三方群内的主页限制',['A与B有账号拉黑关系，二者均属于主播C的有效粉丝团'],['打开C的粉丝群聊','点击B的头像'],'不能进入B的个人主页',{point:'第三方群拉黑隔离',flow:'FLOW-BLOCK'});
for(const target of ['关注关系','粉丝等级','亲密度'])test('my-fan-clubs.html','重新加入不恢复',`退团后重新加入的${target}`,['A曾主动退出B粉丝团，仍关注B，现满足重新入团条件'],['打开B的粉丝团加入入口','确认加入'],target==='关注关系'?'对B的关注关系仍保留':`${target}从0开始累计`,{point:'重新入团重置',flow:'FLOW-FANCLUB'});
export default designs;
