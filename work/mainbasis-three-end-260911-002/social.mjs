import {scenario as s,observe as o,navigation as nav,refs,context,textBoundary} from './design.mjs';
import {reviewed} from './basic-design.mjs';
import {flows} from './lifecycles.mjs';
const r=refs;
const done=(p,n)=>{const ids=r(p,n);context(ids,'已按本页字段、条件分支和交互分别建立场景；重复描述共用场景');reviewed(ids);};
const f=k=>({flow:flows[k].flow,transition:flows[k].id});

for(const [kind,label] of [['普通','无准入标识'],['门票','金币价格'],['密码','密码准入提示']])o('U-live-plaza-003',`${kind}房准入提示`,[`存在正在直播的${kind}房`],`该卡片显示${label}`);
for(const count of [0,1,2])o('U-live-plaza-002',`本场访问次数${count}`,['当前场次从0开始',`同一用户成功进入本场${count}次`],`卡片本场访问次数 = ${count}`);
for(const fail of ['列表曝光','密码校验失败','购票失败'])o('U-live-plaza-002',`${fail}不计访问`,['当前本场访问次数5',`之后仅发生一次${fail}且未进入直播间`],'本场访问次数仍为5');
for(const [follow,live] of [[true,true],[true,false],[false,true]])o(['U-live-plaza-004','U-live-plaza-011'],`关注区${follow?'已':'未'}关注${live?'直播中':'未开播'}`,[`目标主播${follow?'已':'未'}被当前账号关注，当前${live?'直播中':'未开播'}`],follow&&live?'关注区显示该主播':'关注区不显示该主播');
o('U-live-plaza-011','关注区无数据隐藏',['没有任何已关注且正在直播的主播'],'关注区隐藏');
nav('U-live-plaza-015','搜索','搜索');
for(const tab of ['热门','新人'])s('U-live-plaza-016',`直播列表切换${tab}`,[],[`点击「${tab}」`],`当前直播列表刷新为${tab}结果`);
s('U-live-plaza-016','直播分类过滤',['后台存在两个已启用分类，各有正在直播的主播'],['选择其中一个分类'],'当前列表仅显示该分类直播');
for(const choice of ['开启通知','暂不开启'])s(['U-live-plaza-014','U-views_live-plaza_notification-intro-005'],`首次通知选择${choice}后不再弹出`,['账号首次登录进入首页'],[`点击「${choice}」`,'退出账号','重新登录并进入首页'],'不再展示首次通知说明');
o('U-views_live-plaza_notification-intro-005','首次首页展示通知说明',['账号首次登录进入首页'],'展示“开启通知”说明弹窗');
o('U-views_live-plaza_notification-permission-005','拒绝设备推送仍接收站内通知',['当前设备已拒绝系统通知','账号收到平台发出的站内系统通知'],'站内通知列表包含该条通知');

for(const [p,name,metric] of [['U-host-ranking','主播','收礼值'],['U-contribution-ranking','用户','贡献值']]){
  for(const period of ['当日','本周','本月'])s(`${p}-011`,`${name}榜切换${period}`,['三个周期有不同的有效赠礼记录'],[`切换至「${period}」`],`前三名、列表和${metric}均使用${period}记录`);
  for(const n of [0,1,29,30,31])o([`${p}-004`,`${p}-010`],`${name}榜${n}人上限`,[`所选周期共有${n}个符合条件账号`],`榜单展示${Math.min(n,30)}个账号`);
  const keys=p==='U-host-ranking'?['收礼值','主播等级','财富等级','ID数字部分']:['贡献值','财富等级','ID数字部分'];
  keys.forEach((key,i)=>o(`${p}-003`,`${name}榜按${key}决胜`,[`两账号前${i}项排序值相同`,`${key==='ID数字部分'?'ID数字部分':'当前排序项'}分别为10和20`],`${key==='ID数字部分'?'10':'20'}对应账号排在另一账号前`));
  o(`${p}-003`,`${name}榜连续排名无并列`,['至少3个账号当前价值相等，但ID不同'],'排序后的名次依次为1、2、3');
  o(`${p}-004`,`${name}榜第30名同值裁决`,['共31个有效账号','第30和31候选价值相同，后续排序键能区分'],'仅后续排序更靠前的账号占第30名');
  o(`${p}-006`,`${name}榜礼物金额计算`,['所选周期该账号成功赠礼记录仅为单价10数量2、单价30数量3'],'本周期'+metric+' = 10 × 2 + 30 × 3 = 110',{type:'逻辑校验'});
  o(`${p}-006`,`${name}榜幸运礼物返奖不冲减`,['本周期仅一笔幸运礼物，单价10数量10，返奖50金币'],`${metric} = 10 × 10 = 100`,{type:'逻辑校验'});
  o(`${p}-006`,`${name}榜计入虚拟赠礼`,['本周期仅成功送出价值20的虚拟金币礼物'],`${metric} = 20`,{type:'逻辑校验'});
  for(const logged of [true,false])s(`${p}-012`,`${name}榜头像${logged?'已登录':'游客'}入口`,[logged?'当前账号已登录':'当前为游客'],[`点击榜单${name}头像`],logged?`进入该${name}主页`:'进入登录页',{role:logged?'用户':'游客'});
  done(p,'001-012');
}
o('U-host-ranking-007','缺失等级按0级排序',['收礼值相同的两名主播，一人主播等级缺失，一人为1级'],'1级主播排在等级缺失主播前');
o('U-host-ranking-007','缺失财富等级按0级排序',['收礼值和主播等级相同，一人财富等级缺失，一人为1级'],'财富1级主播排在财富等级缺失主播前');
o('U-contribution-ranking-007','贡献榜最低财富等级',['榜单账号尚未达到更高财富等级门槛'],'该账号财富等级为1级');

for(const kw of ['', '   '])s(['U-search-002','U-search-008'],`搜索空白${kw.length}字符`,[],[kw?'输入3个空格':'清空搜索框','提交搜索'],'提示输入且保留搜索页',{type:'异常用例'});
for(const [kind,value] of [['昵称','海岛主播'],['用户 ID','10001'],['房间号','80001']])s(['U-search-002','U-search-009'],`按${kind}搜索`,[`存在${kind}为「${value}」的账号`],[`输入「${value}」`,'提交搜索'],'进入搜索结果页，关键词为'+value);
s(['U-search-002','U-search-results-002'],'搜索去除首尾空格',[],['输入「  海岛主播  」','提交搜索'],'搜索结果页关键词为「海岛主播」');
o('U-search-007','进入搜索自动聚焦',[],'搜索框获得输入焦点');
o('U-search-003','不展示热门搜索词',[],'页面没有热门搜索词列表');
for(const n of [9,10])s('U-search-005',`历史已有${n}条新增`,[`已有${n}个不同历史词，已记录最近使用顺序`],['搜索一个新的昵称','返回搜索页'],n===9?'历史保留10条，新词位于首位':'历史仍为10条，最早一条被移除');
s(['U-search-003','U-search-005'],'重复搜索移到首位',['有3个历史词，目标词当前在最后'],['点击最后一条历史词','返回搜索页'],'目标词移到第一位，历史总数仍为3');
s('U-search-010','删除单条搜索历史',['存在3条搜索历史'],['点击中间历史词右侧删除'],'仅该词被移除，其余2条保留');
s('U-search-010','清空全部搜索历史',['存在3条搜索历史'],['点击清空全部'],'搜索历史变为空状态');
o('U-search-004','搜索历史不跨设备',['同一账号在设备一搜索过一个新词，设备二从未搜索该词','当前使用设备二'],'设备二历史中没有该词');
for(const [kind,live,target] of [['主播',true,'直播间'],['主播',false,'主播主页'],['普通用户',false,'用户主页']]){
  o(['U-search-results-004','U-search-results-006'],`${kind}${live?'直播中':'未开播'}结果信息`,[`当前关键词仅匹配一个${kind}，其${live?'正在':'没有'}直播`],`${kind==='主播'?'显示':'不显示'}房间号，${live?'显示':'不显示'}直播中标记`);
  s([`U-search-results-${live?'008':'009'}`],`${kind}${live?'直播中':'未开播'}搜索跳转`,[`存在匹配的${kind}，${live?'正在普通房直播':'当前未开播'}`],['点击该搜索结果'],`进入该账号${target}`);
}
s('U-search-results-010','修改关键词重新搜索',['原关键词存在匹配账号','新关键词不存在匹配账号'],['修改为新关键词','提交搜索'],'搜索框保留新词且结果为空状态');
o('U-search-results-006','一个账号一条结果',['同一账号昵称和ID均匹配当前关键词'],'该账号仅出现一条结果');
done('U-search','001-010');done('U-search-results','001-010');

for(const page of ['user-home','host-home']){
  const p=`U-${page}`;
  for(const follow of [true,false])s(page==='user-home'?`${p}-010`:'U-user-home-010',`${page==='user-home'?'用户':'主播'}主页${follow?'取消关注':'关注'}`,[`当前${follow?'已':'未'}关注该对象，已记录其粉丝数`],[`点击「${follow?'取消关注':'关注'}」`],`该对象粉丝数${follow?'减':'加'}1`,{page:`${page}.html`});
  for(const choice of ['取消','关闭','确认拉黑'])s(`U-views_${page}_block-confirm-005`,`${page==='user-home'?'用户':'主播'}主页拉黑${choice}`,['与当前对象已有好友及关注关系'],[`点击「${choice}」`],choice==='确认拉黑'?'主页显示拉黑状态':'好友和关注关系保持原值',{page:`views_${page}_block-confirm`,...f('block')});
}
for(const [p,kind] of [['U-user-home','用户'],['U-host-home','主播']]){
  o(`${p}-003`,`${kind}粉丝与关注分别统计`,['该对象有3个当前粉丝并关注5个账号'],`粉丝数为3，关注数为5`);
}
o('U-user-home-004','累计送出只计成功礼物',['该账号成功赠送单价10数量2的礼物，另有价值30的失败赠礼'],'累计送出礼物价值 = 10 × 2 = 20',{type:'逻辑校验'});
for(const [action,result] of [['关注','好友关系保持未建立'],['取消关注','好友关系保持已建立']])s('U-user-home-007',`${action}不更改好友`,[action==='关注'?'尚未关注且非好友':'已关注且为好友'],[`点击「${action}」`],result);
for(const confirm of [true,false])s(['U-user-home-011','U-views_user-home_friend-005','U-views_user-home_friend-007'],`删除好友${confirm?'确认':'取消'}`,['与对象互为好友，已关注且有聊天记录'],['点击删除好友',`点击${confirm?'确认':'取消'}`],confirm?'该对象好友状态变为未建立':'好友关系保留');
for(const field of ['关注关系','聊天记录'])s(['U-views_user-home_friend-005','U-views_user-home_friend-007'],`删除好友后的${field}`,['与对象互为好友且已关注，有聊天记录'],['点击删除好友','确认删除',field==='关注关系'?'查看主页关注状态':'进入与该对象的私信'],field==='关注关系'?'仍显示已关注':'会话内原聊天记录已清空');
o('U-host-home-007','财富等级与主播等级独立',['该主播当前收礼值达到主播3级，消费值仅达到财富2级'],'主播等级为3，财富等级为2');
for(const live of [true,false])o('U-host-home-008',`主播主页${live?'直播中':'未开播'}入口`,[`主播当前${live?'有':'没有'}有效直播场次`],`${live?'提供':'不提供'}当前直播场次入口`);
for(const joined of [true,false])s('U-host-home-012',`粉丝团${joined?'已加入':'未加入'}跳转`,[`当前${joined?'具有':'不具有'}该主播有效团籍`],['点击粉丝团'],`进入${joined?'贡献榜':'加入粉丝团视图'}`);
o('U-host-home-011','主播主页数据隔离',['平台存在两名主播，其统计数据不同'],'页面仅展示当前所选主播的数据');
for(const status of ['成功','失败','撤销'])o('U-host-gift-gallery-005',`展馆${status}礼物计数`,[`该主播该礼物原数量为2，本次另有数量3的${status}记录`],`该礼物数量为${status==='成功'?5:2}`);
o('U-host-gift-gallery-002','累计礼物件数',['该主播仅收到两种礼物，数量分别2和3'],'累计收到 = 2 + 3 = 5',{type:'逻辑校验'});
o(['U-host-gift-gallery-004','U-host-gift-gallery-008'],'未收到礼物仍展示',['平台目录存在该主播从未收到的礼物'],'该礼物展示“未收到”');
o('U-host-gift-gallery-006','下架礼物保留历史',['主播过去成功收到该礼物2个，平台随后下架该礼物'],'展馆仍保留该礼物且收到数量为2');
o('U-host-gift-gallery-009','展馆按配置顺序',['目录配置顺序与该主播收到数量排序不同'],'展馆顺序与礼物目录配置一致');
nav('U-host-gift-gallery-010','返回','对应主播主页');

for(const [p,collection,sort] of [['U-message-center','私信与粉丝群会话','最后消息时间倒序，时间相同会话ID倒序'],['U-system-notifications','系统通知','生成时间倒序，时间相同通知ID倒序'],['U-interaction-notifications','互动通知','发生时间倒序，时间相同通知ID倒序'],['U-direct-message','私信消息','服务端发送时间正序，时间相同消息ID正序']]){
  const id={ 'U-message-center':'003','U-system-notifications':'007','U-interaction-notifications':'008','U-direct-message':'009'}[p];
  o(`${p}-${id}`,`${collection}主排序`,[`有3条当前账号可见记录，时间依次为10:00、10:01、10:02`],`${collection}按${sort.split('，')[0]}排列`);
  o(`${p}-${id}`,`${collection}同时间排序`,['有2条时间相同且ID数字分别为10、20的可见记录'],`ID ${sort.includes('ID正序')?'10':'20'}排在另一条前`);
}
o('U-message-center-005','系统和互动通知固定置顶',['普通会话最后更新时间晚于两类通知'],'系统通知和互动通知仍排在所有普通会话之前');
s('U-message-center-010','进入会话清除未读',['目标会话未读数3，另一个会话未读数2'],['进入目标会话','返回消息中心'],'目标会话未读清零，另一个会话仍为2');
o('U-message-center-010','收到消息更新摘要与排序',['未进入目标会话','对方刚发送一条比其他会话更新的文本消息'],'目标会话摘要显示新文本和时间，并排到普通会话首位');
o('U-message-center-010','收到消息累计未读',['目标会话原未读数2','未进入该会话时又收到1条新消息'],'该会话未读数为3');
o('U-system-notifications-005','系统通知只读',['有一条主播权限变更通知'],'通知不提供跳转、回复或业务处理操作');
o('U-system-notifications-006','系统通知按收件账号隔离',['存在只发送给另一账号的通知'],'列表不显示另一账号的通知');
s('U-system-notifications-004','查看系统通知标记已读',['有一条未读系统通知'],['查看该条通知','返回消息中心'],'该通知标记为已读');
for(const [p,scope] of [['U-friend-list','好友'],['U-follower-list','粉丝']]){
  for(const kw of ['海岛','','不存在的昵称'])s(`${p}-002`,`${scope}昵称筛选${kw||'清空'}`,[`存在昵称含海岛及不含海岛的${scope}`],[kw?`输入「${kw}」`:'清空搜索关键词'],kw==='不存在的昵称'?'列表显示空状态':kw?`仅显示昵称匹配的当前${scope}`:`显示全部当前${scope}`);
  for(const host of [true,false])s(`${p}-${p==='U-friend-list'?'012':'008'}`,`${scope}${host?'主播':'普通用户'}主页入口`,[`目标${scope}${host?'有':'没有'}主播身份`],[p==='U-friend-list'?'点击目标好友整行':'点击目标粉丝头像'],`进入${host?'主播':'用户'}主页`);
}
for(const area of ['头像','昵称','等级','勋章','行内空白'])s('U-friend-list-012',`好友行${area}可点击`,['该好友没有主播身份'],[`点击好友行的${area}`],'进入该好友用户主页');
nav('U-friend-list-013','返回','消息中心');nav('U-follower-list-008','返回','个人主页');
o('U-friend-list-009','好友搜索不包含非好友',['目标昵称仅属于一个非好友账号'],'搜索该昵称不能返回该非好友');
o('U-my-following-005','关注列表时间倒序',['三个账号关注时间各不相同'],'最新关注账号位于列表首位');
o('U-my-following-006','关注列表为空',['当前未关注任何账号'],'显示关注列表空状态');
for(const removed of ['取消关注','拉黑'])o('U-my-following-004',`${removed}移出关注列表`,[`目标账号原本已关注，随后已${removed}`],'关注列表不包含该账号');
for(const host of [true,false])nav('U-my-following-006',`${host?'主播':'用户'}头像`,`${host?'主播':'用户'}主页`,[`目标账号${host?'具备':'不具备'}主播身份`]);
s('U-my-following-006','关注主播进入普通房',['关注主播正在普通房直播'],['点击正在开播的关注主播'],'进入该主播当前直播间');

for(const choice of ['同意','拒绝']){
  s('U-interaction-notifications-006',`好友申请${choice}`,['收到一条有效待处理好友申请'],[`点击「${choice}」`],choice==='同意'?'与申请方建立双向好友关系':'与申请方保持非好友关系',f(choice==='同意'?'friend':'friendReject'));
  s('U-interaction-notifications-009',`好友申请${choice}禁止重复处理`,['收到有效待处理好友申请'],[`点击「${choice}」`],`该通知显示已${choice==='同意'?'同意':'拒绝'}且不再提供处理按钮`);
}
s('U-interaction-notifications-005','待处理好友申请重复提交',['双方已有一条待处理好友申请'],['再次向对方发起好友申请'],'不产生第二条待处理申请',{type:'异常用例'});
o('U-interaction-notifications-010','失效好友申请只读',['申请双方任一方已拉黑另一方'],'申请显示已失效且无同意、拒绝按钮');
for(const media of ['文字','图片','语音'])s('U-direct-message-002',`好友发送${media}`,['双方互为好友且未拉黑'],[`发送一条${media}消息`],`该${media}消息写入当前会话`);
for(const count of [2,3])s(['U-direct-message-004','U-direct-message-010'],`非好友已发${count}条`,[`双方非好友且未拉黑，当前账号已成功发出${count}条文本`],['再发送一条文本消息'],count===2?'第三条文本成功写入会话':'不生成第四条消息，提示“非好友最多发送三条”');
s('U-direct-message-004','双方非好友配额独立',['对方已向我成功发送3条文本，我尚未向对方发送消息'],['发送一条文本消息'],'本方向第一条文本成功发送');
s('U-direct-message-004','好友不受三条限制',['双方互为好友且当前已发送3条文本'],['再发送一条文本消息'],'第四条文本成功发送');
for(const media of ['文本','语音','图片'])s(['U-direct-message-005','U-direct-message-007'],`被拉黑发送${media}拒收`,['当前会话对象已拉黑我'],[`发送一条${media}消息`],'该消息显示“❕”和“消息发送失败，对方拒收”',{type:'异常用例'});
s('U-direct-message-010','消息发送失败保留内容',['本次发送遇到可恢复网络故障'],['发送一条文本消息'],'消息显示失败图标且保留原文本',{type:'异常用例'});
s('U-direct-message-010','失败消息恢复网络重试',['一条文本消息发送失败，内容仍保留','网络已恢复且双方互为好友'],['点击该消息失败图标重试'],'原文本重新发送成功',{dimensions:['重试/恢复','可观察结果']});
o('U-direct-message-003','对方查看后更新已读',['我发送的消息原为未读','对方已进入此会话'],'该消息更新为已读');

for(const reason of ['主动退出','被主播移出','拉黑主播']){
  o('U-views_message-center_fan-group-006',`${reason}移除粉丝群入口`,[`当前账号原具有团籍，随后已${reason}`],'消息列表不再包含该粉丝群会话');
  o('U-fan-group-chat-006',`${reason}失去历史群消息权限`,[`当前账号原具有团籍，随后已${reason}`],'该粉丝群历史消息不再开放');
}
o('U-views_message-center_fan-group-005','粉丝群只含有效团籍',['账号有一个有效团籍和一个已失效团籍'],'粉丝群会话列表仅显示有效团籍对应会话');
o('U-fan-group-chat-009','群消息时间正序',['当前群有三条发送时间不同的消息'],'群消息按发送时间从早到晚排列');
s('U-fan-group-chat-010','群内发送更新摘要',['当前团籍有效且未被禁言'],['发送一条文本群消息','返回消息中心'],'该粉丝群会话摘要显示新发送文本');
for(const media of ['语音','图片','表情'])s('U-fan-group-chat-010',`群内禁言点击${media}`,['当前账号被该群禁言'],[`点击「${media}」`],'提示“当前被禁言”，不打开对应功能',{type:'异常用例'});
o('U-fan-group-chat-010','群内禁言输入限制',['当前账号被该群禁言'],'输入框显示“当前被禁言”且不可输入或发送');
for(const ended of [true,false])s(['U-fan-group-chat-007','U-fan-group-chat-010'],`直播卡片场次${ended?'结束':'进行中'}`,[`卡片绑定场次${ended?'已结束，主播又开启另一新场次':'仍在普通房直播'}`],['点击该直播卡片'],ended?'提示直播已结束，不进入后续新场次':'进入卡片绑定的当前场次');
for(const [p,role] of [['U-group-manage-member','粉丝团成员'],['U-group-manage-owner','主播'],['U-chat-settings','用户']]){
  const id={ 'U-group-manage-member':'007','U-group-manage-owner':'005','U-chat-settings':'004'}[p];
  s(`${p}-${id}`,`${p.includes('owner')?'群主':p.includes('member')?'成员':'单聊'}免打扰仍接收消息`,['当前通知开启且会话可接收消息'],['开启消息免打扰','返回聊天页','查看对方新发送的一条消息'],'新消息仍可在当前会话中查看',{role});
  s(`${p}-${id}`,`${p.includes('owner')?'群主':p.includes('member')?'成员':'单聊'}免打扰关闭通知`,['当前通知开启'],['开启消息免打扰'],'仅当前账号的此会话消息通知被关闭',{role});
}
o('U-group-manage-member-004','普通成员没有成员管理权',['当前为普通有效团籍成员'],'群管理不提供成员管理操作');
for(const confirm of [true,false])s('U-group-manage-member-007',`退出粉丝团${confirm?'确认':'取消'}`,['当前具有有效团籍'],['点击退出粉丝团',`点击${confirm?'确认':'取消'}`],confirm?'离开群聊并进入消息中心':'保留当前团籍和群管理页',f('leaveFan'));
textBoundary('U-group-manage-owner-006','群公告',200,{required:true,trim:true,blockInput:true});
s('U-group-manage-owner-006','编辑公告回填与换行',['当前公告为“原公告”'],['点击编辑公告','在原公告后换行输入“新内容”'],'编辑框保留原公告与换行后的新内容，并显示字符计数');
for(const choice of ['保存','取消','关闭'])s('U-group-manage-owner-006',`公告编辑${choice}`,['原公告为“原公告”'],['点击编辑公告','修改为“新公告”',`点击${choice}`],choice==='保存'?'弹窗关闭，公告显示“新公告”':'公告仍显示“原公告”');
nav('U-group-manage-owner-008','群成员管理','粉丝团成员');nav('U-group-manage-owner-009','返回','粉丝群聊天');
for(const choice of ['确认拉黑','取消','关闭'])s('U-views_chat-settings_block-confirm-005',`单聊拉黑${choice}`,['当前单聊对象未被拉黑且有聊天记录'],[`点击${choice}`],choice==='确认拉黑'?'退出当前会话':'原关系和聊天记录保持不变');

for(const [item,result] of [['关注关系','双方关注关系解除'],['好友关系','双方不再互为好友'],['好友申请','待处理好友申请已失效'],['粉丝团团籍','双方加入对方的团籍解除'],['房管关系','双方既有房管关系解除'],['私信会话','双方私信会话被移除'],['聊天记录','双方聊天记录被清空']])s(['U-blacklist-management-004','U-blacklist-management-005','U-blacklist-management-013'],`拉黑清理${item}`,[`双方已存在${item}`],['进入对方用户主页','点击拉黑','确认拉黑',`打开${item==='私信会话'?'消息中心':item==='聊天记录'?'该对象会话':item==='房管关系'?'房管列表':item==='粉丝团团籍'?'我的粉丝团':item==='好友申请'?'互动通知':item==='好友关系'?'好友列表':'我的关注'}`],result,{fullSteps:true,...f('block')});
o('U-blacklist-management-011','黑名单只显示主动拉黑',['我拉黑账号甲，账号乙仅拉黑我'],'黑名单包含甲且不包含乙');
o('U-blacklist-management-012','黑名单按操作时间倒序',['先拉黑甲、后拉黑乙'],'乙位于甲之前');
for(const choice of ['确认','取消'])s('U-blacklist-management-014',`取消拉黑${choice}`,['黑名单中存在目标账号'],['点击该账号取消拉黑',`点击${choice}`],choice==='确认'?'该账号从黑名单移除':'该账号仍在黑名单',f('unblock'));
s('U-blacklist-management-014','取消拉黑请求失败',['目标账号已被拉黑','本次取消请求返回失败'],['点击取消拉黑','确认'],'提示“请求失败”，目标仍在黑名单',{type:'异常用例'});
s('U-blacklist-management-003','双方各自拉黑独立解除',['双方分别存在主动拉黑记录'],['取消我对对方的拉黑','搜索对方账号'],'由于对方拉黑仍生效，搜索不能返回对方');
for(const item of ['关注','好友','好友申请','粉丝团','房管','会话','聊天记录'])o('U-blacklist-management-009',`取消拉黑不恢复${item}`,[`双方拉黑前存在${item}，后经拉黑清理，现已取消该拉黑`],`原${item}未恢复`);
for(const area of ['首页','分类','搜索','推荐'])o('U-blacklist-management-006',`拉黑后${area}不显示对方房间`,['对方正在直播且双方存在拉黑关系'],`${area}不展示对方直播间卡片`);
for(const action of ['查看对方主页','@对方'])s('U-blacklist-management-008',`第三方房间限制${action}`,['双方存在拉黑关系且同时处于第三方直播间'],[`尝试${action}`],`不能${action}`,{type:'异常用例'});
s('U-blacklist-management-008','第三方粉丝团限制主页',['双方存在拉黑关系且同在第三方粉丝团'],['点击对方头像'],'不能进入对方主页',{type:'异常用例'});

o('G-guild-notifications-003','公会通知时间倒序',['当前公会有3条生成时间不同的通知'],'通知按生成时间倒序排列');
nav('G-guild-notifications-009','一条通知','通知详情',['当前公会存在一条通知']);
s(['G-guild-notifications-004','G-guild-notification-detail-005'],'公会通知详情标记已读',['有一条未读通知'],['打开该通知详情','返回通知列表'],'该通知不再显示未读标记');
for(const [related,permission] of [[true,true],[true,false],[false,true]])o('G-guild-notification-detail-004',`通知业务入口${related?'有关联':'无关联'}${permission?'有权限':'无权限'}`,[`该通知${related?'有':'无'}关联业务记录，当前账号${permission?'有':'无'}该记录权限`],`${related&&permission?'显示':'不显示'}业务入口`);
s('G-guild-notification-detail-005','通知跳转关联记录',['通知有关联入会申请且当前账号有查看权限'],['点击业务入口'],'进入该通知对应的申请记录');
