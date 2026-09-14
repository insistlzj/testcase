import {test,ref,add,page,designs} from './design-cases.mjs';
const live='live-room.html',host='live-room-host.html',co='views/live-room-host/cohost-hosts.html';
const viewer=['用户A已登录，未被封禁，与主播B无拉黑关系','主播B正在直播，本场编号S1；A未被本场踢出'];
for(const type of ['普通房','门票房','密码房']){
 test(live,type==='普通房'?'进入普通房':'进入密码房或门票房',`${type}首次准入`,[...viewer,`S1房型为${type}，用户A尚未购票或验证密码`],['打开主播B的直播间'],type==='普通房'?'直接展示直播内容':type==='门票房'?'展示购买门票弹窗':'展示输入密码弹窗',{point:'首次进房',role:'观众',flow:'FLOW-ROOM-ENTRY'});
 for(const restriction of ['账号封禁','主播B拉黑A','用户A拉黑主播B','A本场被踢出'])test(live,'优先于房间准入',`${type}准入优先拦截${restriction}`,[`S1为正在直播的${type}`,`用户A状态为${restriction}；若为门票房已购本场票，若为密码房已知密码12345678`],['打开主播B的直播间'],'不能进入直播间观看内容',{point:'准入优先级',role:'观众',dimension:'权限差异',flow:'FLOW-ROOM-ENTRY'});
}
for(const [where,expected]of [['有来源页','返回进入直播间前的来源页'],['无来源页','返回首页']])test(live,'点击“返回”',`访问拦截返回${where}`,['用户A被本场踢出，当前访问受限，'+where],['打开访问受限的直播间','点击“返回”'],expected,{point:'准入拦截返回',role:'观众'});
for(const restriction of ['主播黑名单','本场踢出','未购门票','未输入密码'])test(live,'有效巡房任务',`巡房会话绕过${restriction}`,[`巡房人员A账号未封禁，任务有效，目标主播正在直播；存在${restriction}限制`],['打开有效巡房任务中的目标直播间'],'展示直播内容并显示“巡房中”',{point:'巡房会话准入',role:'巡房人员',flow:'FLOW-PATROL',dimension:'权限差异'});
for(const state of ['平台封禁','巡房权限失效'])test(live,'平台封禁或巡房权限失效',`巡房${state}仍被拒绝`,[`巡房人员A处于${state}状态，目标直播间在播`],['打开巡房任务中的目标直播间'],'不能进入直播间',{point:'巡房授权优先级',role:'巡房人员',flow:'FLOW-PATROL',dimension:'权限差异'});
for(const actor of ['主播','房管'])for(const button of ['拉黑','踢出'])test(live,'巡房会话期间',`${actor}对巡房人员的${button}入口`,['巡房人员A正在以有效巡房会话观看B的直播'],['打开直播间中巡房人员A的资料卡'],`不展示“${button}”操作`,{point:'巡房人员保护',role:actor,flow:'FLOW-PATROL',dimension:'权限差异'});
test(live,'巡房结束后恢复', '巡房结束后恢复普通门票准入',['人员A未购本场门票，刚结束巡房会话，账号未封禁且无拉黑'],['打开该门票房普通分享入口'],'展示购买门票弹窗',{point:'巡房退出恢复',role:'观众',flow:'FLOW-PATROL'});
for(const outcome of ['门票状态','拉黑关系'])test(live,'不改变原账号',`巡房结束后的原${outcome}`,['巡房人员A原账号未购本场门票，主播B已拉黑A，巡房任务仍有效'],['打开巡房任务中的目标直播间','退出本次巡房会话'],outcome==='门票状态'?'原账号本场门票仍为未购买':'原账号与主播B的拉黑关系仍保留',{point:'巡房临时身份隔离',role:'巡房人员',flow:'FLOW-PATROL'});
const ticket='views/live-room/ticket-room-restricted.html';
for(const [balance,expected]of [[99,'不扣减金币'],[100,'金币余额显示0'],[101,'金币余额显示1']])test(ticket,'门票',`门票100金币、余额${balance}`,['本场门票价格100金币，A尚未购买，无拉黑和踢出限制',`用户A可用金币${balance}`],['打开门票准入弹窗','点击“购买门票”'],expected,{point:'购票余额边界',role:'观众',dimension:'输入边界',flow:'FLOW-TICKET'});
for(const count of [1,2,3])test(live,'同场重复进入不收费',`同场第${count}次重新进入不重复收费`,[...viewer,'S1门票价格100金币，A首次购票已成功，购票后余额900金币',`A已退出该场次${count}次，S1尚未结束`],['打开S1直播间'],'金币余额保留900金币',{point:'本场门票复用',role:'观众',flow:'FLOW-TICKET',dimension:'重复操作'});
for(const state of ['S1已结束，主播开始新场S2','A被S1踢出'])test(live,'失效且不退款',`已购门票在${state}时失效`,['A已支付100金币购票，余额900金币',state],['打开主播直播间'],'已支付的100金币不退还',{point:'门票失效不退款',role:'观众',flow:'FLOW-TICKET'});
const pass='views/live-room/password-room-restricted.html';
for(const value of ['123','1234','12345678','123456789012','1234567890123','123A']){
 const lengthOK=/^\d{4,12}$/u.test(value),correct=value==='12345678';
 test(pass,'密码',`进房密码${value}`,[...viewer,'本场密码12345678'],['打开密码准入弹窗',`输入密码“${value}”`,'点击“确认”'],correct?'进入直播间':lengthOK?'显示“密码错误，请重新输入”':'显示“密码必须是4-12个数字”',{point:'进房密码校验',role:'观众',dimension:'输入边界'});
}
const edit='views/live-room-host-password/room-password.html';
for(const [action,expected]of [['保存','本场有效密码更新为87654321'],['取消','本场有效密码保留12345678']])test(edit,action==='保存'?'保存成功':'取消',`本场密码修改${action}`,['主播B正在密码房S1直播，当前密码12345678'],['打开直播设置 → 房间密码','输入新密码“87654321”',`点击“${action}”`],expected,{point:'本场密码提交',role:'主播'});
test(edit,'在线用户不强制退出','更改密码不踢出在线观众',['主播B在密码房S1，观众A已用旧密码12345678在线'],['打开直播设置 → 房间密码','输入新密码“87654321”','点击“保存”'],'观众A保留在S1中观看',{point:'在线会话保留',role:'主播'});
for(const value of ['12345678','87654321'])test(edit,'必须输入新密码',`修改后重进输入${value}`,['主播B已把S1密码从12345678改为87654321，A原先在线现已退出'],['打开S1直播间',`输入密码“${value}”`,'点击“确认”'],value==='87654321'?'进入直播间':'显示“密码错误，请重新输入”',{point:'新密码重新校验',role:'观众',dimension:'重新进入/刷新状态保持'});

for(const actor of ['主播','房管']){
 const key=actor==='主播'?'views/live-room-host/profile-host.html':'views/live-room/profile-moderator.html';
 for(const action of ['禁言','踢出']){
  test(key,action,`${actor}发起${action}需要确认`,['B在播S1，观众A在线且非巡房会话，A未被禁言或踢出'],['打开观众A的资料卡',`点击“${action}”`],`打开${action}确认视图`,{point:'观众管理确认',role:actor});
  test(key,action,`${actor}取消${action}`,['B在播S1，观众A在线且非巡房会话，A未被禁言或踢出'],['打开观众A的资料卡',`点击“${action}”`,'点击“取消”'],action==='禁言'?'A保留本场公屏发言权限':'A保留在本场直播间',{point:'取消观众处置',role:actor,dimension:'中断/取消'});
 }
}
const mute='views/live-room/profile-moderator-mute.html',remove='views/live-room/profile-moderator-remove.html';
for(const expected of ['A不能发送本场公屏消息','A仍可观看本场直播','A仍可赠送礼物','A仍可按原好友规则发送私信'])test(mute,'不影响',`禁言后${expected}`,['A为S1普通观众，无拉黑，余额充足，与B为好友'],['打开A的资料卡','点击“禁言”','确认禁言'],expected,{point:'禁言影响范围',role:'房管',flow:'FLOW-ROOM-MUTE'});
test(mute,'下一场默认恢复','本场禁言不延续下一场',['A在S1被禁言，S1已结束；B正在新场S2直播'],['打开S2直播间','输入公屏消息“你好”','点击“发送”'],'S2公屏显示A发送的“你好”',{point:'跨场禁言恢复',role:'观众',flow:'FLOW-ROOM-MUTE'});
test(live,'踢出后本场不可', '本场踢出后拒绝重进',['A被主播B从S1踢出，B的S1仍在播'],['打开S1直播间'],'展示访问受限拦截',{point:'本场踢出有效期',role:'观众',flow:'FLOW-ROOM-KICK'});
test(remove,'下一场可重新进入','踢出不延续到下一场',['A曾在S1被踢出，S1结束后B开启普通房S2；双方无拉黑'],['打开S2直播间'],'展示S2直播内容',{point:'跨场踢出恢复',role:'观众',flow:'FLOW-ROOM-KICK'});
const restore='views/live-room-host/restore-speaking-confirm.html';
for(const round of [1,2])test(restore,'连续完成两次',`恢复发言第${round}次取消`,['主播B在普通房S1，A本场被禁言'],['打开直播设置 → 禁用用户','点击A的“恢复发言”',...(round===2?['点击第一次“确认”']:[]),'点击“取消”'],'A保留本场禁言状态',{point:'两次恢复确认',role:'主播',dimension:'中断/取消',flow:'FLOW-ROOM-MUTE'});
for(const expected of ['A移出禁言列表','A恢复本场公屏发言权限'])test(restore,'连续完成两次',`两次确认后${expected}`,['主播B在普通房S1，A本场被禁言'],['打开直播设置 → 禁用用户','点击A的“恢复发言”','点击第一次“确认”','点击第二次“确认”'],expected,{point:'恢复发言提交',role:'主播',flow:'FLOW-ROOM-MUTE'});
test('views/live-room-host/muted-users.html','请求失败', '恢复发言请求失败保留禁言',['A本场被禁言，恢复接口故障已注入且仅影响本次请求'],['打开禁用用户列表','点击A的“恢复发言”','确认恢复发言'],'显示“请求失败”',{point:'禁言恢复失败',role:'主播',dimension:'异常/失败'});
for(const n of [2,3])test('moderator-management.html','最多 3',`已有${n}名房管后新增`,[`主播B当前有${n}名房管，用户A非房管且双方无拉黑、A不在房间黑名单`],['打开房管管理','输入用户ID“620100”','点击“添加房管”'],n===2?'A获得主播B的长期房管身份':'显示“已达3人上限”',{point:'房管人数边界',role:'主播',dimension:'输入边界',flow:'FLOW-MODERATOR'});
for(const relation of ['主播拉黑A','A拉黑主播'])test('moderator-management.html','自动解除',`房管授权后${relation}`,['A已被主播B授权为房管'],['打开账号资料卡',`点击“拉黑”`],'A失去B的房管身份',{point:'拉黑解除房管',role:relation.startsWith('主播')?'主播':'用户',flow:'FLOW-MODERATOR'});
test('moderator-management.html','场次结束不清除','房管跨场保留',['A为B房管，B原场S1结束后开启S2'],['打开房管管理'],'列表仍显示A的房管授权',{point:'房管长期授权',role:'主播',flow:'FLOW-MODERATOR'});
test('moderator-management.html','取消拉黑后不自动恢复','解除拉黑不恢复房管',['A原是B房管，因B拉黑A而解除'],['打开黑名单管理','点击A的“取消拉黑”','确认取消拉黑'],'A不自动恢复为房管',{point:'房管恢复边界',role:'主播',flow:'FLOW-MODERATOR'});
test('views/live-room/profile-moderator.html','不能处置主播本人','房管查看主播本人资料卡',['当前账号为B的房管，B正在S1直播'],['打开主播B资料卡'],'不展示对主播本人的禁言或踢出操作',{point:'房管权限上界',role:'房管',dimension:'权限差异'});
for(const expected of ['所选评论M1从公屏移除','未选评论M2仍在公屏'])test(host,'屏蔽评论',`屏蔽单条评论时${expected}`,['S1公屏存在M1“第一条”与M2“第二条”'],['打开S1直播间','点击评论M1','点击“屏蔽此评论”'],expected,{point:'单条评论范围',role:'主播'});
for(const expected of ['本设备公屏消息清空','服务端消息记录仍保留'])test('views/live-room-host/more-actions.html','清屏',`主播清屏的${expected}`,['S1公屏存在评论M1，消息已写入历史记录'],['打开S1直播设置','点击“清屏”'],expected,{point:'本设备清屏',role:'主播'});

for(const state of ['对方未开播','对方为密码房','对方为门票房','对方已连麦','双方存在拉黑关系'])test('views/live-room-host/cohost-hosts-search-result.html','仅返回',`连麦搜索排除${state}`,['本方主播B在普通房S1且未连麦',`目标主播C状态为${state}，昵称测试主播C`],['打开连麦主播面板','输入搜索词“测试主播C”'],'搜索结果不包含主播C',{point:'连麦候选资格',role:'主播',flow:'FLOW-COHOST',dimension:'权限差异'});
test(co,'邀请成功','有效主播发起连麦邀请',['B和C分别在普通房S1、S2直播，均未连麦且无拉黑，B无已发出的邀请'],['打开连麦主播面板','输入主播C的ID','点击C的“邀请”'],'C的邀请状态显示邀请中',{point:'发起连麦邀请',role:'主播',flow:'FLOW-COHOST'});
test('views/live-room-host/cohost-hosts-search-result.html','已有发出的请求','同一主播只能发出一笔邀请',['B已经向C发出有效待处理邀请，D也是可邀请主播'],['打开连麦主播面板','输入主播D的ID','点击D的“邀请”'],'显示“已有发出请求，请先取消”',{point:'已发出邀请上限',role:'主播',dimension:'重复操作',flow:'FLOW-COHOST'});
test(co,'请求失败','发起连麦请求失败',['B和C符合连麦条件，本次发起请求返回失败'],['打开连麦主播面板','输入主播C的ID','点击C的“邀请”'],'不生成连麦邀请',{point:'连麦请求失败',role:'主播',dimension:'异常/失败'});
const notice='views/live-room-host/cohost-invite-notice.html';
for(const action of ['接受','拒绝'])test(notice,action+' ->',`处理连麦邀请${action}`,['B和C在普通房直播且未连麦，B收到C的有效邀请'],['打开待处理连麦邀请',`点击C邀请的“${action}”`],action==='接受'?'建立B与C的两人连麦':'关闭C的邀请',{point:'处理收到邀请',role:'主播',flow:'FLOW-COHOST'});
for(const result of ['B已发出的邀请失效','B收到的其他邀请保留','B不能继续接受其他邀请','B不能再发起邀请'])test(notice,'其他收到的邀请保留',`接受邀请后${result}`,['B收到C、D两笔有效邀请，同时曾向E发出邀请；相关主播均在普通房直播'],['打开待处理邀请','点击C邀请的“接受”'],result,{point:'接受邀请关联状态',role:'主播',flow:'FLOW-COHOST'});
for(const [time,result]of [[3,'连麦邀请提示仍显示'],[4,'连麦邀请提示消失']])test(notice,'4 秒',`连麦提示显示${time}秒`,[`S1收到一笔新邀请，已过去${time}秒，期间无新邀请`],['查看S1直播画面中的邀请提示'],result,{point:'邀请提示时限',role:'主播',dimension:'输入边界'});
test(notice,'不重复叠加','提示期内收到第二笔邀请',['第一笔邀请提示仍在4秒展示期，第二笔邀请已到达'],['查看直播画面中的邀请提示'],'仅显示一个已更新内容的邀请提示',{point:'提示合并',role:'主播',dimension:'重复操作'});
const exit='views/live-room-cohost-active/cohost-exit-confirm.html';
for(const [action,result]of [['确认','双方恢复各自单人直播'],['取消','双方保留连麦'],['关闭','双方保留连麦']])test(exit,'确认 ->',`退出连麦选择${action}`,['B与C正在两人连麦，各自场次S1、S2仍在播'],['打开退出连麦确认视图',`点击“${action}”`],result,{point:'结束连麦选择',role:'主播',flow:'FLOW-COHOST'});
test(exit,'请求失败','退出连麦请求失败',['B与C正在连麦，退出请求返回失败'],['打开退出连麦确认视图','点击“确认”'],'显示“退出失败”',{point:'退出连麦失败',role:'主播',dimension:'异常/失败'});
test('live-room-cohost-active.html','另一方直播继续','一方下播结束连麦但不结束对方直播',['B与C在S1、S2连麦'],['打开B的直播设置','点击“结束直播”','确认结束直播'],'C的S2仍继续直播',{point:'连麦单方下播',role:'主播',flow:'FLOW-COHOST'});
for(const type of ['密码房','门票房'])test('views/live-room-cohost-active/more-actions.html','不得切换',`连麦中不切换${type}`,['B与C正在普通房连麦'],['打开直播设置'],`不能切换为${type}`,{point:'连麦房型约束',role:'主播',dimension:'权限差异'});
for(const target of ['粉丝群','好友'])for(const action of ['确认','取消','关闭'])test('views/live-room-host/share-recipient.html','选择对象并确认',`分享给${target}后${action}`,[`主播B在S1直播，拥有可选${target}A`],['打开直播设置 → 转发',`选择${target}A`,`点击“${action}”`],action==='确认'?`向${target}A发送S1直播房间卡片`:'不生成分享消息',{point:'分享提交与取消',role:'主播',dimension:action==='确认'?'正常主流程':'中断/取消'});
for(const type of ['密码','门票','拉黑','封禁','本场踢出'])test('views/live-room-host/share-recipient.html','不绕过',`分享接收人仍校验${type}`,[`用户A收到S1分享卡片，但未满足${type}准入条件`],['打开S1分享卡片'],'不能直接进入直播内容',{point:'分享准入复核',role:'观众',dimension:'权限差异'});
const end='views/live-room-host/end-confirm.html';
for(const result of ['当前场次结束','当前连麦失效','待处理连麦邀请失效','本场门票失效','本场禁言状态失效','本场踢出状态失效','历史消息记录保留','历史消费记录保留','历史处置记录保留','历史收益记录保留'])test(end,'结束直播会关闭',`主动下播后${result}`,['主播B在S1直播，存在与该结果相关的本场业务记录；历史记录编号与数值已留存'],['打开结束直播确认视图','点击“确认”'],result,{point:'场次结束关联结果',role:'主播',flow:'FLOW-LIVE-END'});
for(const action of ['取消','关闭'])test(end,'取消或关闭',`主动下播弹窗${action}`,['主播B在S1直播'],['打开结束直播确认视图',`点击“${action}”`],'S1继续直播',{point:'下播取消',role:'主播',dimension:'中断/取消'});
test(end,'重复确认只处理一次','重复确认结束直播',['B在S1直播，第一次结束请求尚未返回'],['打开结束直播确认视图','点击“确认”两次'],'S1仅处理一次结束',{point:'下播防重复',role:'主播',dimension:'重复操作'});
export default designs;
