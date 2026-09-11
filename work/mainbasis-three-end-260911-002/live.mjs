import {scenario as s,observe as o,navigation as nav,refs,textBoundary} from './design.mjs';
import {flows} from './lifecycles.mjs';
const f=k=>({flow:flows[k].flow,transition:flows[k].id});
for(const room of ['普通房','门票房','密码房'])for(const limit of ['账号封禁','双方账号拉黑','本场被踢出'])s('U-live-room-006',`${room}优先拦截${limit}`,[`目标为直播中的${room}，当前账号${limit}`,room==='密码房'?'已知正确密码':room==='门票房'?'已购买本场门票':'房间无准入收费'],['打开目标直播场次入口'],'不能进入或观看该场直播',{priority:'P0',type:'异常用例'});
s('U-live-room-012','普通房直接观看',['账号可用、无拉黑且未被本场踢出，目标普通房直播中'],['打开目标普通房'],'直接展示直播内容，无准入弹窗');
for(const room of ['门票房','密码房'])o('U-live-room-013',`${room}未验证遮挡直播`,[`尚未${room==='门票房'?'购买本场门票':'通过本场密码验证'}`],'直播内容完全被遮挡，中央显示'+(room==='门票房'?'购票':'密码')+'弹窗');
for(const origin of [true,false])s('U-views_live-room_blocked-room-restricted-003',`准入拦截返回${origin?'来源页':'首页'}`,[`当前被本场踢出，${origin?'从主播主页进入':'没有来源页'}`],['点击返回'],`进入${origin?'主播主页':'首页'}`);
for(const limit of ['主播拉黑','本场踢出','房间密码','门票'])s('U-views_live-room_patrol-room-allowed-002',`有效巡房绕过${limit}`,['账号未被平台封禁且有有效巡房任务',`目标场次存在${limit}限制`],['从有效巡房任务进入目标场次'],'直播内容可见且显示“巡房中”',{role:'巡房人员'});
for(const limit of ['平台封禁','巡房权限失效'])s('U-views_live-room_patrol-room-allowed-004',`巡房${limit}拦截`,[limit],['从巡房任务打开场次'],'不能进入直播间',{role:'巡房人员',type:'异常用例'});
o('U-views_live-room_patrol-room-allowed-002','巡房不购买门票',['有效巡房人员从任务进入收费房','进入前未持有本场门票，金币余额已记录'],'巡房不改变原门票状态和金币余额',{role:'巡房人员'});
for(const role of ['主播','房管'])o('U-views_live-room_patrol-room-allowed-005',`${role}不能踢出巡房人员`,['目标用户当前处于有效巡房会话'],'目标资料卡隐藏拉黑与踢出操作',{role,page:role==='主播'?'views_live-room-host_profile-host':'views_live-room_profile-moderator'});
for(const action of ['禁言','踢出'])o('U-live-room-010',`${action}下一场恢复`,[`目标用户上一场被${action}，当前主播已开始新普通房场次，无账号拉黑`],action==='禁言'?'新场次可发公屏评论':'新场次可以进入');

for(const value of ['', '123','1234','12345678901','123456789012','1234567890123','12a4']){
 const valid=/^\d{4,12}$/u.test(value);
 s('U-views_live-room_password-room-restricted-003',`观众密码${value||'空值'}`,['账号准入条件满足',...(valid?[`本场密码为${value}`]:[])],[`填写密码「${value}」`,'确认'],valid?'移除遮挡并进入直播间':'保留输入并提示“密码必须是4-12个数字”',{type:valid?'业务流程':'异常用例'});
 for(const [p,pre] of [['U-views_live-room-host-password_room-password','本场密码原为5678'],['U-views_start-live-settings_room-password','其他开播字段合法']])s(`${p}-${p.includes('room-password_room')?'003':p.includes('live-room-host')?'003':'010'}`,`${p.includes('live-room-host')?'场内改密':'开播密码'}${value||'空值'}`,[pre],[`填写密码「${value}」`,'确认'],valid?'保存本场密码配置并关闭视图':'不保存，保留输入并提示“密码必须是4-12个数字”',{type:valid?'业务流程':'异常用例'});
}
s('U-views_live-room_password-room-restricted-003','观众密码错误后重试',['本场密码5678'],['输入1234并确认'],'保留输入并提示“密码错误，请重新输入”',{type:'异常用例'});
s('U-views_live-room_password-room-restricted-003','观众纠正密码恢复',['之前输入1234校验失败，本场密码5678'],['改为5678','确认'],'进入本场直播间',{dimensions:['重试/恢复','可观察结果']});
nav('U-views_live-room_password-room-restricted-003','关闭','来源页');
s('U-views_live-room-host-password_room-password-003','修改密码取消保留原值',['本场原密码5678'],['改填1234','取消'],'本场密码仍为5678');
o('U-live-room-host-password-006','改密不踢在线观众',['观众已用5678进入，主播已将本场密码改为1234'],'已在线观众继续观看',{role:'用户'});
s('U-live-room-host-password-006','改密后再次进入用新密码',['观众用旧密码进入后退出，主播已改密码1234'],['重新进入本场','输入旧密码5678','确认'],'旧密码无法进入',{role:'用户'});
for(const balance of [49,50,51])s('U-views_live-room_ticket-room-restricted-006',`门票50余额${balance}`,['当前本场票价50且没有门票',`真实金币余额${balance}`],['确认购买'],balance<50?'不扣款并打开充值入口':`购票成功后余额为${balance-50}，直播遮挡移除`,{priority:'P0',...f('ticket')});
s('U-views_live-room_ticket-room-restricted-003','同场重复入场不重复扣票',['已支付50购买本场门票，当前余额100，未被踢出'],['退出直播间','重新进入同一场次'],'直接观看且金币余额仍为100',f('ticket'));
for(const reason of ['场次结束','本场被踢出'])o('U-views_live-room_ticket-room-restricted-004',`${reason}票失效不退款`,['此前成功购票50，购票后余额100',reason],'该场门票失效且余额仍为100');
nav('U-views_live-room_ticket-room-restricted-006','取消','来源页');

for(const state of ['下架','过期'])s('U-views_live-room_gift-004',`礼物${state}不可送`,[`所选礼物已${state}`],['选择该礼物','尝试赠送'],'不能产生新的赠礼记录',{type:'异常用例'});
s('U-views_live-room_gift-009','礼物单价数量金额',['上架普通礼物单价10'],['选择该礼物','选择数量10'],'显示本次需要100金币',{type:'逻辑校验'});
for(const balance of [99,100,101])s(['U-views_live-room_gift-010','U-views_live-room_gift-011'],`普通礼物100余额${balance}`,['上架普通礼物单价10数量10',`账号真实余额${balance}`],['点击赠送'],balance<100?'不扣款并打开充值视图':`成功赠送后余额为${balance-100}`,{priority:'P0',...f('gift')});
s('U-views_live-room_gift-008','赠礼请求失败不扣款',['原余额100，普通礼物费用10','本次赠礼请求失败'],['点击赠送'],'余额仍为100',{type:'异常用例'});
o('U-views_live-room_gift-005','幸运赠礼用户净消耗',['成功送出幸运礼物100金币，返奖30金币'],'该笔实际消耗 = 100 - 30 = 70金币',{type:'逻辑校验'});
for(const type of ['普通','定制'])s('U-views_live-room_gift-006',`运营号送${type}礼物`,['当前为启用运营账号，虚拟余额100',`目标上架${type}礼物费用10`],['选择礼物','赠送'],'虚拟余额扣减为90',{role:'运营账号'});
s('U-views_live-room_gift-006','运营号不能送幸运礼物',['当前为启用运营账号且虚拟余额充足'],['尝试选择幸运礼物并赠送'],'不能送出幸运礼物',{role:'运营账号',type:'异常用例'});
s('U-views_live-room_gift-011','运营虚拟余额不足',['当前为运营账号，虚拟余额9，普通礼物费用10'],['点击赠送'],'不扣款，无充值入口并提示联系公会发放',{role:'运营账号',type:'异常用例'});
for(const status of ['失败','取消','超时'])o('U-views_live-room_gift-recharge-003',`房内快捷充值${status}`,[`支付本次结果为${status}，支付前余额100`],'金币余额仍为100');
s('U-views_live-room_gift-recharge-005','快捷充值成功不自动送礼',['已选单价10数量10的礼物但余额不足','有当前端可用充值套餐'],['完成该套餐支付'],'返回礼物视图，余额增加但原礼物尚未赠送');
for(const action of ['关闭','支付失败'])s('U-views_live-room_gift-recharge-006',`快捷充值${action}保留选择`,['原礼物及数量已选择'],[action==='关闭'?'点击关闭':'发起支付并使本次支付失败'],'返回礼物视图，原礼物及数量保留');

for(const [count,allowed] of [[499,true],[500,false]])s('U-views_live-room_fan-club-not-joined-005',`粉丝团${count}人加入`,['用户满足全部加入条件且无拉黑',`粉丝团当前${count}人`],['点击加入粉丝团'],allowed?'加入成功，成员数为500':'拒绝加入，成员数仍为500',f('joinFan'));
for(const condition of ['未关注且要求关注','贡献99未达100门槛','双方存在拉黑关系'])s(['U-views_live-room_fan-club-not-joined-004','U-views_live-room_fan-club-not-joined-007'],`加入粉丝团${condition}`,[condition,'其余加入条件均满足'],['点击加入'],'未加入，提示“未满足进群条件”',{type:'异常用例'});
for(const amount of [100,101])s('U-views_live-room_fan-club-not-joined-004',`贡献门槛100实际${amount}`,['当前已关注、无拉黑且团人数不足500',`累计有效贡献${amount}，要求100`],['点击加入'],'获得团籍和群籍',f('joinFan'));
s('U-views_live-room_fan-club-not-joined-007','入团请求失败',['用户满足条件但本次加入请求失败'],['点击加入'],'不加入并提示“未满足进群条件”',{type:'异常用例'});
s('U-views_live-room_fan-club-not-joined-008','入团后开放群入口',['用户满足全部条件且团未满500人'],['点击加入'],'切换已加入视图并显示粉丝群入口');
o('U-views_live-room_fan-club-joined-006','重新入团不恢复历史等级',['退出前粉丝等级3级、亲密度100，现重新入团'],'粉丝等级与亲密度从0开始，不恢复退出前数值');
nav('U-views_live-room_fan-club-joined-007','查看贡献','当前主播贡献榜');

for(const role of ['主播','房管'])for(const [action,kind,expected] of [['禁言','mute','目标被写入本场禁言状态'],['踢出','remove','目标立即退出并从本场在线列表移除']])for(const choice of ['确认','取消','关闭']){
 const id=role==='房管'?`U-views_live-room_profile-moderator-${kind}-002`:'U-live-room-host-011';
 s(id,`${role}${action}${choice}`,['目标为当前场次普通在线观众，非巡房人员'],[...(role==='主播'?[`选择目标观众并点击${action}`]:[]),`点击${choice}`],choice==='确认'?expected:'目标当前状态保持不变',{role,...f(action==='禁言'?'mute':'kick')});
}
o('U-views_live-room_profile-moderator-002','房管不能处置主播',['当前查看本房主播资料'],'不提供对主播的禁言和踢出操作',{role:'房管'});
for(const target of ['观看','送礼','私信'])s('U-views_live-room_comment-muted-001',`本场禁言不影响${target}`,['当前场次被禁言，未被拉黑，余额充足且对方为好友'],[target==='观看'?'查看直播画面':target==='送礼'?'选择一件普通礼物并赠送':'给好友发送一条私信'],`${target}仍可完成`);
s('U-views_live-room_comment-muted-004','被禁言不能写入公屏',['当前处于本场禁言状态'],['尝试提交评论'],'不生成公屏消息',{type:'异常用例'});
o('U-views_live-room-host_muted-users-006','离开重进保留本场禁言',['用户本场被禁言后退出并重进同一场次'],'该用户仍在本场禁言列表');
for(const choice of ['确认','取消','关闭','请求失败'])s(['U-views_live-room-host_restore-speaking-confirm-002','U-views_live-room-host_muted-users-007'],`恢复发言${choice}`,['目标仍被本场禁言',...(choice==='请求失败'?['本次恢复请求失败']:[])],[`点击${choice==='请求失败'?'确认':choice}`],choice==='确认'?'目标移出禁言列表并恢复本场发言':choice==='请求失败'?'保留禁言并提示“请求失败”':'保留禁言状态',f('restoreMute'));
for(const state of ['用户已恢复','本场已结束'])s('U-views_live-room-host_restore-speaking-confirm-001',`恢复发言避免重复${state}`,[state],['再次确认恢复发言'],'不重复执行恢复处理');
s('U-live-room-host-012','屏蔽仅选中单条评论',['公屏有同一用户两条评论'],['选择其中一条评论','点击屏蔽评论'],'仅选中的评论从当前公屏移除，另一条保留');
o('U-views_live-room_audience-managers-007','普通观众房管列表只读',['以普通观众查看房管列表'],'不显示授权或取消房管操作');
o('U-views_live-room_audience-managers-006','取消房管仍为普通观众',['用户在线，主播刚取消其房管授权'],'用户失去管理操作但仍留在直播间');
for(const event of ['进入','离开','踢出'])o('U-views_live-room_audience-online-004',`观众在线列表${event}更新`,[`普通目标用户刚${event}当前场次`],`在线观众列表${event==='进入'?'包含':'不包含'}该用户`);

for(const [p,countId,sortId] of [['U-views_live-room_contribution-rank','001','002'],['U-views_live-room-host_contribution-rank','002','003']]){
 for(const count of [98,99,100])o(`${p}-${countId}`,`${p.includes('host')?'主播':'观众'}本场榜${count}人`,[`本场有${count}个产生有效贡献账号`],`展示${Math.min(count,99)}名`);
 ['贡献值','粉丝等级','财富等级','用户ID'].forEach((key,i)=>o(`${p}-${sortId}`,`${p.includes('host')?'主播':'观众'}本场榜${key}排序`,[`两个用户前${i}项相同，${key}分别10和20`],`${key==='用户ID'?10:20}对应用户排在前面`));
 o(`${p}-${p.includes('host')?'007':'005'}`,`${p.includes('host')?'主播':'观众'}本场榜缺等级按0`,['贡献相等，一人粉丝等级缺失、一人为1级'],'粉丝1级用户排在粉丝等级缺失用户前');
}
for(const on of [true,false])o('U-views_live-room_contribution-rank-004',`我的排名${on?'上榜':'未上榜'}`,[on?'我在本场排名第10':'我未进入本场前99名'],'榜单底部我的排名显示'+(on?'10':'“-”'));
o('U-views_live-room-host_contribution-rank-006','离线保留本场贡献榜',['用户本场送礼100后已离线'],'其本场贡献100及排名仍在贡献榜中');
o('U-views_live-room-host_audience-viewers-008','离线移出在线列表',['用户本场送礼100后已离线'],'在线列表不显示该用户');
for(const [sort,keys] of [['贡献',['贡献值','粉丝等级','财富等级','用户ID']],['停留时长',['累计在线时长','贡献值','粉丝等级','财富等级','用户ID']]])keys.forEach((key,i)=>s(`U-views_live-room-host_audience-viewers-${sort==='贡献'?'010':'011'}`,`在线按${sort}比较${key}`,[`两位在线用户前${i}项排序值相同，${key}分别10和20`],[`选择按${sort}`],`${key==='用户ID'?10:20}对应用户在前`));
for(const valid of [true,false])o('U-views_live-room-host_audience-viewers-004',`${valid?'有效':'无效'}团籍身份展示`,[`用户${valid?'具有':'没有'}当前主播有效团籍`],`${valid?'显示':'不显示'}灯牌、粉丝等级和亲密度`);
s('U-views_live-room-host_thank-message-004','快捷答谢只预填',['当前资料卡用户昵称为海岛'],['点击答谢'],'资料卡关闭，输入框预填“@海岛 谢谢你送的礼物！”并聚焦');
s('U-views_live-room-host_thank-message-003','快捷答谢不自动发消息赠礼',['当前资料卡可执行答谢'],['点击答谢'],'尚未生成公屏消息或礼物记录');
s('U-views_live-room-host_thank-message-004','修改答谢后手动发送',['输入框已预填答谢'],['将文案改为“@海岛 感谢支持”','点击发送'],'公屏写入修改后的答谢文本');
o('U-views_live-room-host_focus-viewers-001','重点标签可同时命中',['某在线用户本场新关注且贡献最高，未入粉丝团'],'该用户同时显示新粉丝、贡献最高、未加入粉丝团标签');
o('U-views_live-room-host_focus-viewers-004','重点用户离线移除',['原重点用户刚离线'],'重点观众列表不再包含该用户');

for(const condition of ['目标未开播','目标门票房','目标密码房','目标已在连麦','双方有拉黑'])s('U-views_live-room-host_cohost-hosts-search-result-003',`连麦搜索排除${condition}`,['发起方普通房在播且未连麦',condition],['搜索目标主播ID'],'搜索结果不包含该主播');
for(const kw of ['','   '])s('U-views_live-room-host_cohost-hosts-search-result-004',`连麦搜索空白${kw.length}`,[],[`输入「${kw}」`],'返回未搜索状态');
s('U-views_live-room-host_cohost-hosts-search-result-004','连麦搜索无结果',[],['搜索不存在的主播ID'],'提示“查询结果为空或主播未在普通房直播”');
s('U-views_live-room-host_cohost-hosts-007','发送单笔连麦邀请',['双方普通房在播、均未连麦、无拉黑','发起方没有待处理邀请'],['搜索对方主播ID','点击邀请'],'标记邀请中并禁止重复发送',f('cohostInvite'));
s('U-views_live-room-host_cohost-hosts-search-result-004','已有邀请不能再发',['发起方已有一条待处理邀请，另有符合条件主播'],['点击另一主播搜索结果'],'提示“已有发出请求，请先取消”',{type:'异常用例'});
s('U-views_live-room-host_cohost-hosts-007','连麦邀请请求失败',['双方条件满足但请求失败'],['邀请目标主播'],'不生成邀请并提示“请求失败”',{type:'异常用例'});
o('U-views_live-room-host_cohost-hosts-005','接收方可收多个邀请',['两个符合条件主播各向当前主播发出一个有效邀请'],'当前主播有2个待处理邀请');
for(const elapsed of [3,4,5])o('U-views_live-room-host_cohost-invite-notice-004',`连麦提示${elapsed}秒`,[`当前邀请提示展示后已经${elapsed}秒，期间无新增邀请`],elapsed<4?'提示仍显示':'该临时提示已关闭');
o('U-views_live-room-host_cohost-invite-notice-004','新邀请不叠加提示',['当前提示展示中又收到一个新邀请'],'更新当前提示及数量，不额外叠加提示');
for(const choice of ['接受','拒绝'])s('U-views_live-room-host_cohost-invite-notice-006',`${choice}单笔有效邀请`,['当前仅有一笔邀请，双方仍满足全部连麦条件'],[`点击${choice}`],choice==='接受'?'建立双方连麦':'该邀请关闭并更新待处理数量',f(choice==='接受'?'cohostAccept':'cohostReject'));
s(['D-SYS-108','U-views_live-room-host_cohost-hosts-002'],'发起方取消连麦邀请',['当前有自己发出的有效待处理邀请'],['取消该邀请'],'该邀请失效',{page:'views_live-room-host_cohost-hosts',...f('cohostCancel')});
for(const condition of ['一方停止直播','一方被拉黑'])s('U-views_live-room-host_cohost-invite-notice-006',`接受前复核${condition}`,['邀请原有效',`点击接受前发生${condition}`],['点击接受'],'不建立连麦',{type:'异常用例'});
for(const choice of ['确认','取消','关闭','请求失败'])s('U-views_live-room-cohost-active_cohost-exit-confirm-002',`退出连麦${choice}`,['当前双方连麦中',...(choice==='请求失败'?['退出请求失败']:[])],[`点击${choice==='请求失败'?'确认':choice}`],choice==='确认'?'双方恢复各自单人直播':choice==='请求失败'?'保持连麦并提示“退出失败”':'保持连麦',f('cohostExit'));
o('U-live-room-cohost-active-003','连麦账务分别累计',['双方当前场次各有独立赠礼，价值分别100和200'],'两场贡献、消息和观众分别累计，不合并为300');
o('U-live-room-cohost-active-007','对方结束我方继续直播',['双方原在连麦，对方已结束其直播'],'连麦结束，我方场次继续');
for(const action of ['切换门票房','切换密码房','再次发起连麦'])s('U-views_live-room-cohost-active_more-actions-003',`连麦中限制${action}`,['当前双方连麦中'],[`尝试${action}`],'不执行并提示先退出连麦',{type:'异常用例'});
for(const action of ['观众管理','转发'])s('U-views_live-room-cohost-active_more-actions-003',`连麦中打开${action}`,['当前双方连麦中'],[`选择${action}`],`打开${action}视图且连麦继续`);

for(const choice of ['确认','取消','关闭','发送失败'])s('U-views_live-room-host_share-recipient-004',`分享场次${choice}`,['已选有权限的好友或粉丝群',...(choice==='发送失败'?['本次分享请求失败']:[])],[`点击${choice==='发送失败'?'确认':choice}`],choice==='确认'?'发送当前场次卡片并提示成功':choice==='发送失败'?'不生成消息并提示“发送失败”':'不生成分享消息');
for(const restriction of ['密码','门票','拉黑','封禁','本场踢出'])s('U-views_live-room-host_share-recipient-003',`分享不绕过${restriction}`,['已收到分享的当前直播场次卡片',`接收人存在${restriction}准入限制`],['打开收到的场次卡片'],`仍按${restriction}规则校验，不能由分享直接绕过`,{role:'用户'});
for(const p of ['U-live-room-report','U-live-room-user-report']){
 textBoundary(`${p}-002`,'补充说明',200);
 o(`${p}-${p==='U-live-room-report'?'005':'004'}`,`${p==='U-live-room-report'?'直播':'用户'}举报未选原因`,['未选择举报原因'],'提交按钮不可用');
 for(const reason of ['色情低俗','涉及宗教政治','暴恐血腥','未成年人有害','其他'])s(`${p}-${p==='U-live-room-report'?'006':'005'}`,`${p==='U-live-room-report'?'直播':'用户'}举报${reason}`,['目标账号有效且目标直播场次仍在播'],[`选择原因${reason}`,'点击提交'],`生成${p==='U-live-room-report'?'当前场次':'目标账号'}举报工单并返回${p==='U-live-room-report'?'直播间':'来源页'}`,p==='U-live-room-report'?f('report'):{});
}
for(const choice of ['确认','取消','关闭'])s('U-views_live-room-host_end-confirm-002',`结束直播${choice}`,['主播当前场次直播中'],[`点击${choice}`],choice==='确认'?'本场结束并进入主播结束页':'返回直播间继续直播',f('endLive'));
s('U-views_live-room-host_end-confirm-002','重复结束只处理一次',['同一直播场次仍在播'],['连续两次确认结束直播'],'该场次只产生一次结束处理');
for(const item of ['连麦','待处理邀请','门票','禁言','踢出'])o('U-views_live-room-host_end-confirm-001',`结束场次使${item}失效`,[`当前场次存在${item}状态，主播已结束该场次`],`该场次${item}状态失效`);
for(const item of ['历史消息','消费记录','处置记录','收益记录'])o('U-live-end-host-004',`结束场次保留${item}`,['本场已结束且此前存在'+item],`${item}保留`);
for(const action of ['观看','评论','送礼'])o('U-live-end-viewer-001',`结束场次不能${action}`,['当前场次已结束'],`不能继续${action}当前场次`);
nav('U-live-end-viewer-004','返回首页','首页');
s('U-live-end-viewer-004','再次打开旧场次不跳新场',['旧场次已结束，主播已开启新场次'],['打开旧场次入口'],'仍显示旧场次结束状态');
nav('U-live-end-host-005','查看直播数据','当前场次直播数据');nav('U-live-end-host-005','返回主播中心','主播中心');

textBoundary('U-start-live-settings-003','直播主题',40);
for(const field of ['分类','房型'])o(`U-start-live-settings-${field==='分类'?'004':'005'}`,`开播未选${field}`,[`该必选${field}未选择，其他字段合法`],'不能开始直播');
for(const condition of ['账号不可用','公会无效','认证未通过','平台权限关闭','公会权限关闭'])s('U-host-center-011',`开播再次校验${condition}`,[`仅${condition}，其他开播条件满足`],['点击开始直播'],'停留主播中心并提示“暂无开播权限”');
for(const room of ['普通房','门票房','密码房'])s(['U-start-live-settings-010','U-start-live-settings-018'],`${room}成功开播`,['五项开播条件满足，相机与麦克风已授权',`选择${room}且该房型字段已填合法值`],['点击开始直播'],`创建新的${room}场次并进入主播直播间`,f('beginLive'));
for(const permission of ['相机','麦克风']){
 s('U-start-live-settings-012',`首次开播申请${permission}`,['开播字段与业务条件满足',`${permission}从未申请权限，另一项已授权`],['点击开始直播'],`直接调用系统${permission}权限弹窗`);
 s('U-start-live-settings-019',`${permission}拒绝开播`,['开播业务条件和字段满足',`${permission}权限被拒绝`],['点击开始直播'],'停留开播设置，提示“权限未开启，请前往系统设置”，提供取消、前往设置');
}
for(const choice of ['取消','前往设置'])s('U-start-live-settings-019',`开播权限提示${choice}`,['开播权限被拒绝提示已展示'],[`点击${choice}`],choice==='取消'?'仍停留开播设置':'打开手机系统设置');
s('U-start-live-settings-020','取消选封面保留原图',['本次开播已选择封面'],['点击修改封面','取消系统照片选择'],'原封面保留');
s('U-start-live-settings-013','选封面仅读选中照片',[],['点击修改封面','在系统选择器选择一张图片'],'仅使用所选图片，不申请完整相册权限');
for(const choice of ['未选择','已停用','有效档位'])s('U-start-live-settings-016',`门票档位${choice}`,['当前选择门票房',`价格${choice}`],['确认房型'],choice==='有效档位'?'门票房与选中价格回填':'不保存并提示“请选择有效的门票价格”');
for(const room of ['门票房','密码房'])o(`U-views_start-live-settings_room-${room==='门票房'?'ticket-003':'password-005'}`,`${room}平台关闭不可选`,[`平台${room}功能已关闭`],`不能选择${room}`);
for(const room of ['门票房','密码房'])o(`U-${room==='门票房'?'views_start-live-settings_room-ticket-005':'live-room-host-password-005'}`,`${room}无连麦`,[`当前为${room}`],'不提供连麦能力');
o('U-views_start-live-settings_room-ticket-004','后台改价不影响本场',['本场开播票价50，后台档位之后改为100'],'当前场次票价仍为50');
s('U-views_start-live-settings_room-normal-006','切普通房取消受限字段校验',['原门票房尚未选票价'],['选择普通房','确认'],'无需门票或密码即可回填普通房');
o('U-views_start-live-settings_category-004','分类只含启用并按配置顺序',['存在已启用及已下架分类，启用分类顺序已配置'],'仅显示启用分类并沿用后台顺序');
for(const yes of [true,false])s('U-views_start-live-settings_category-005',`直播分类${yes?'选择':'关闭未选'}`,['原分类为唱歌'],[yes?'选择另一个已启用分类':'关闭视图'],yes?'回填选中分类并关闭视图':'仍使用原分类唱歌');
for(const n of [0,1,5,6])o('U-start-live-settings-021',`可见粉丝${n}人头像上限`,['已开启粉丝授权',`已选择${n}名有效粉丝`],`已选人数为${n}，头像最多${Math.min(n,5)}个${n>5?'并显示“...”':''}，编辑图标在末尾`);
for(const invalid of ['取消关注','账号拉黑','账号失效'])o('U-visible-fan-select-006',`可见粉丝排除${invalid}`,[`历史可见名单某用户已${invalid}`],'该用户不在可选范围及历史有效名单中');
for(const kw of ['海岛','无匹配昵称'])s('U-visible-fan-select-003',`可见粉丝搜索${kw}`,['存在昵称包含海岛的有效粉丝'],[`输入${kw}`],kw==='海岛'?'仅显示昵称匹配粉丝':'显示空状态');
s('U-visible-fan-select-009','搜索后全选所有有效粉丝',['有10名有效粉丝，当前搜索仅匹配2人'],['点击全选'],'10名有效粉丝全部选中');
s('U-visible-fan-select-009','取消全选清空名单',['全部有效粉丝已选中'],['点击取消全选'],'选择人数为0');
s('U-visible-fan-select-008','粉丝行再次点击取消选择',['目标粉丝当前已选中'],['点击目标粉丝行'],'目标粉丝取消选中，已选数减1');
for(const yes of [true,false])s(`U-visible-fan-select-${yes?'010':'011'}`,`可见名单${yes?'确认':'返回'}`,['原保存1人，本次修改选中2人'],[`点击${yes?'确认':'返回'}`],`返回密码房设置后名单仍为${yes?2:1}人`);
s('U-start-live-settings-015','关闭授权保留历史名单',['已有保存的2名有效粉丝'],['关闭粉丝授权','再次开启'],'加载原2名有效粉丝');
for(const listed of [true,false])o('U-start-live-settings-014',`密码房广场${listed?'名单内':'名单外'}可见`,['主播同时开启广场展示和粉丝授权',`当前用户${listed?'在':'不在'}可见名单`],`首页${listed?'显示':'不显示'}该直播间`,{role:'用户',page:'live-plaza.html'});
for(const value of [0,1,50,99,100])s('U-views_start-live-settings_beauty-004',`美颜强度${value}`,[],[`选择美颜项目并把强度调到${value}`],`当前项目强度显示${value}`);
s('U-views_start-live-settings_beauty-006','恢复默认美颜',['多个美颜和美型参数已修改'],['点击恢复默认'],'清除当前选中项且全部参数为50');
s('U-views_start-live-settings_beauty-002','美颜美型参数独立',['美颜某项目强度20'],['切换美型设置为80','切回美颜'],'美颜原项目仍为20');
s('U-views_start-live-settings_beauty-006','美颜完成保留参数',['已修改某参数为20'],['点击完成','重新打开美颜设置'],'该参数仍为20');
