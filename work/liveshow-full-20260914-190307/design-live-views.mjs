import {page,lifecycle,computed,v,op} from './design-current.mjs';
const U='用户App';
const add=(key,title,pre,steps,result,re)=>page(U,key).add(title,pre,steps,[{point:'结束态可执行入口',result}],[re]);
for(const key of ['live-end-viewer.html','live-end-host.html']){
 const pg=page(U,key,['账号甲原在场次 S001，S001 已结束；同一主播另有新场次 S002 正在直播']);
 pg.add('旧场次入口保留结束状态',[],['打开 S001 原入口'],[{point:'旧场次不替换为新场次',result:'显示 S001 直播已结束'}],[/结束|场次/]);
}
for(const action of ['发送评论','赠送礼物','发起连麦'])add('live-end-viewer.html',`结束场次不能${action}`,['用户甲原观看 S001；S001 已结束'],['打开 S001 结束页面',`查看${action}入口`],`不提供 S001 的${action}操作`,/结束|评论|礼物|连麦/);
const center=page(U,'host-center.html',['主播甲认证通过，公会有效且账号未封禁；本人累计收益1000金币、当前有效关注者20人']);
for(const [point,result] of [['累计收益','累计收益仍为1000金币'],['当前粉丝数','粉丝数仍为20']])center.add('切换统计周期不改变长期指标',[],['打开主播中心','将统计周期从今日切换为本月',`查看${point}`],[{point,result}],[/累计收益|粉丝数|不随|长期/]);
for(const hours of [0,1.5,3,4])center.add(`今日有效直播${hours}小时`,[`主播甲今日有效直播时长为${hours}小时`],['打开主播中心','查看有效开播日进度'],[computed('有效开播日进度','min(当日有效小时 ÷ 3,1) × 100%',{当日有效小时:hours,达标小时:3,上限:1,百分数:100},op('*',op('min',op('/',v('当日有效小时'),v('达标小时')),v('上限')),v('百分数')),'%')],[/进度|3 小时|3小时/]);
for(const count of [0,2])center.add(`未读公会通知${count}条`,[`主播甲有${count}条未读公会通知`],['打开主播中心','查看公会通知入口'],[{point:'通知未读标记',result:count?'未读数量显示2':'不显示未读标记'}],[/未读/]);
center.add('直播权限关闭时不能开播',['主播甲最终开播权限关闭'],['打开主播中心','点击开始直播'],[{point:'权限关闭说明',result:'提示“直播权限已关闭，请联系公会”'}],[/权限已关闭/]);
center.add('关闭权限说明停留主播中心',['当前显示直播权限已关闭说明'],['点击知道了'],[{point:'权限说明关闭后的页面',result:'停留主播中心'}],[/知道了/]);
const pending=page(U,'host-center-pending.html');
for(const [state,expected] of [['待公会审核','不提供重复提交申请的操作'],['待平台审核','不提供重复提交申请的操作'],['审核驳回','显示重新申请入口']])pending.add(`主播申请${state}`,['申请人甲没有主播身份',`申请 J001 当前为${state}`],['打开主播中心'],[{point:'申请状态对应操作',result:expected}],[/申请|审核|驳回/]);
for(const key of ['fan-list.html','views/live-room/audience-online.html','views/live-room/audience-managers.html']){
 const list=page(U,key);
 const mode=key==='fan-list.html'?'当前有效关注者':key.includes('online')?'当前在线观众':'长期授权房管';
 const pre=key==='fan-list.html'?['甲当前关注本主播，乙已取消关注']:key.includes('online')?['甲当前在线，乙已离开本场']:['甲已被授权房管但当前不在线，乙从未被授权'];
 list.add(`${mode}范围`,pre,[`打开${mode}列表`],[{point:`${mode}包含甲`,result:'列表包含甲'},{point:`${mode}排除乙`,result:'列表不包含乙'}],[/关注|在线|房管|列表/]);
}
const club=page(U,'fan-club.html',['主播甲的粉丝团包含乙、丙两个有效成员']);
for(const [sort,pre,result] of [['累计贡献','乙累计贡献200、丙100','乙排在丙前面'],['本月贡献','乙本月贡献100、丙200','丙排在乙前面'],['加入时间','乙在09/01加入、丙在09/02加入','丙排在乙前面']])club.add(`粉丝团按${sort}排序`,[pre],['打开粉丝团',`选择${sort}排序`],[{point:`${sort}排序`,result}],[/排序|贡献|加入时间/]);
club.add('本月贡献包含入团前赠送',['乙09/02入团，本月09/01已赠送100金币、09/03赠送200金币'],['打开粉丝团','选择本月贡献','查看乙'],[{point:'月贡献不截断入团前数据',result:'乙的本月贡献显示300金币'}],[/加入|月|贡献/]);
const giftr=page(U,'views/live-room/gift-recharge.html',['用户甲余额不足，已在主播乙直播间选择礼物甲、数量3并打开快捷充值']);
for(const state of ['支付成功','支付失败','取消支付'])giftr.add(`${state}后保留待赠送选择`,[],[state==='取消支付'?'取消支付':`完成测试渠道的${state}返回`,'查看礼物面板'],[{point:'待赠送礼物保持',result:'仍选中礼物甲，数量为3'}],[/保留|自动|支付|取消/]);
giftr.add('充值成功不自动赠送礼物',[],['完成测试渠道支付成功返回','查看礼物面板'],[{point:'充值与赠送分离',result:'礼物甲仍处于待手动赠送状态'}],[/不自动|手动/]);
const mute=page(U,'views/fan-club/member-mute-confirm.html',['主播甲为粉丝团群主，成员乙尚未禁言']);
for(const action of ['取消','请求失败'])mute.add(`群禁言${action}`,[...(action==='请求失败'?['测试环境使本次禁言请求失败']:[])],['打开乙的禁言确认',action==='取消'?'点击取消':'点击确认','查看成员乙状态'],[{point:'群禁言未完成',result:'乙仍未被群禁言'}],[/取消|失败|禁言/]);
const muted=page(U,'views/live-room/comment-muted.html',['用户乙在 S001 已被本场禁言，主播仍在直播']);
muted.add('同场重进保留禁言',[],['退出 S001','再次打开 S001','查看公屏输入区'],[{point:'禁言同场保持',result:'公屏发言入口仍不可用'}],[/重新|离开|本场/]);
muted.add('解除本场禁言可立即发言',['主播甲在测试前已解除乙的本场禁言'],['发送公屏文字“解除后消息”'],[{point:'解除禁言恢复发言',result:'公屏显示“解除后消息”'}],[/解除|恢复/]);
for(const [key,protection] of [['password-room-restricted.html','密码验证'],['ticket-room-restricted.html','门票支付'],['fan-club-room-restricted.html','粉丝团成员准入'],['blocked-room-restricted.html','拉黑或踢出准入']]){
 const pg=page(U,`views/live-room/${key}`);
 pg.add(`有效巡房任务豁免${protection}`,['巡房测试账号甲未封禁，后台存在甲当前时段的有效巡房任务，任务目标为直播中 S001',`S001 设置了${protection}限制`],['打开任务目标 S001'],[{point:'有效巡房准入',result:'进入 S001 直播间'}],[/巡房|封禁/],{role:'巡房人员'});
 pg.add(`账号封禁优先于巡房${protection}豁免`,['巡房账号甲已被封禁，仍有当前时段的任务指向 S001'],['打开任务目标 S001'],[{point:'封禁账号无法使用巡房豁免',result:'不能进入 S001 直播间'}],[/封禁|巡房/],{role:'巡房人员'});
}
const pass=page(U,'views/live-room/password-room-restricted.html',['用户甲可登录且满足主播的成员准入要求；S001 密码为1234']);
for(const input of ['123','12ab','9999'])pass.add(`观众密码输入${input}`,[],['打开 S001',`输入密码${input}`,'点击确认'],[{point:'密码校验提示',result:input==='9999'?'提示“密码错误”':'提示“密码必须是4-12个数字”'},{point:'密码校验保留输入',result:`输入框仍显示${input}`}],[/密码|输入/]);
const ticket=page(U,'views/live-room/ticket-room-restricted.html',['普通用户甲未购买 S001 门票']);
ticket.add('支付前不可观看实际直播内容',[],['打开 S001 门票房'],[{point:'门票支付前保护直播内容',result:'看不到 S001 的实际直播画面'}],[/遮罩|实际|支付|观看/]);
ticket.add('取消门票返回来源页',['用户甲从直播广场打开 S001'],['点击取消'],[{point:'取消门票后的去向',result:'返回直播广场'}],[/取消|返回/]);
const restricted=page(U,'views/live-room/fan-club-room-restricted.html');
restricted.add('非成员受限时提供明确原因',['用户甲不是主播乙粉丝团成员，乙开启仅粉丝团成员可进入'],['打开乙的直播卡片'],[{point:'成员准入原因',result:'显示“访问直播间需先加入主播粉丝团”'}],[/访问直播间需先/]);
const roompass=page(U,'views/live-room-host-password/room-password.html',['主播甲当前密码房 S001 密码1234，用户乙已使用1234进入']);
roompass.add('改密码不影响已在线观众',[],['打开房间密码设置','输入5678','点击确认','查看在线观众乙'],[{point:'改密码保留已在线观众',result:'乙仍在 S001 在线观众列表中'}],[/在线|重新|密码/]);
roompass.add('取消密码修改保留原密码',[],['打开房间密码设置','输入5678','点击取消','重新打开房间密码设置'],[{point:'密码修改取消',result:'房间密码仍为1234'}],[/取消|确认/]);
const scope=page(U,'views/live-room-host-password/access-scope.html',['主播甲已有粉丝团，当前成员限制关闭，非成员乙已在 S001 在线']);
scope.add('开启成员限制不踢出当前非成员',[],['打开访问范围','开启仅粉丝团成员可进入','点击确认','查看在线观众乙'],[{point:'成员限制变更保留当前在线观众',result:'乙仍在 S001 在线观众列表中'}],[/已在|不强制|现有|重新/]);
for(const [key,role] of [['views/live-room/more-actions.html','用户'],['views/live-room-host/more-actions.html','主播']]){
 const pg=page(U,key,['执行账号甲在 S001，当前设备有评论“消息甲”，另一设备乙也看到该评论']);
 pg.add('清屏仅清除本设备公屏',[],['打开更多功能','点击清屏','查看当前公屏'],[{point:'本设备清屏',result:'本设备公屏不再显示“消息甲”'}],[/清屏/],{role});
 pg.add('清屏不删除其他设备消息',['配合账号丙已在同场自己的设备点击清屏'],['查看本设备公屏'],[{point:'其他设备清屏不影响本设备',result:'本设备仍显示“消息甲”'}],[/本地|设备|清屏/],{role});
}
const restore=page(U,'views/live-room-host/restore-speaking-confirm.html',['主播甲正在 S001 直播，观众乙已被本场禁言']);
for(const action of ['确认','取消'])restore.add(`${action}恢复乙发言`,[],['打开乙的恢复发言确认',`点击${action}`,'查看禁言列表'],[{point:'恢复发言确认结果',result:action==='确认'?'禁言列表不再包含乙':'禁言列表仍包含乙'}],[/恢复|确认|取消/]);
restore.add('恢复发言请求失败保留禁言',['测试环境使解除禁言请求失败'],['打开乙的恢复发言确认','点击确认'],[{point:'恢复发言失败提示',result:'提示“请求失败”'}],[/失败/]);
const thanks=page(U,'views/live-room-host/thank-message.html',['主播甲正在直播，用户乙昵称为“测试乙”，刚成功送礼']);
thanks.add('快捷感谢仅预填公屏输入内容',[],['打开用户乙资料卡','点击快捷感谢'],[{point:'感谢预填内容',result:'公屏输入框显示“@测试乙 谢谢你送的礼物！”'},{point:'感谢不自动发送',result:'公屏尚未出现该感谢消息'}],[/预填|发送|谢谢/]);
thanks.add('预填感谢可以编辑后手动发送',['当前输入框已预填感谢文字'],['将输入内容修改为“@测试乙 谢谢支持”','点击发送'],[{point:'感谢内容手动发送',result:'公屏显示“@测试乙 谢谢支持”'}],[/编辑|发送/]);
const coSearch=page(U,'views/live-room-host/cohost-hosts-search-result.html',['主播甲在普通房，未连麦且没有已发邀请']);
coSearch.add('连麦搜索排除未在普通房直播的主播',['主播乙昵称精确为“测试乙”，当前在密码房直播'],['打开连麦搜索','输入测试乙','点击查询'],[{point:'连麦目标房型',result:'显示“查询结果为空或主播未在普通房直播”'}],[/普通房|查询结果/]);
coSearch.add('已有发出邀请不能再邀请',['甲已有发给丙的待回应邀请；乙在普通房直播且其他条件满足'],['输入主播乙ID','点击查询','点击邀请'],[{point:'已发邀请冲突提示',result:'提示“已有发出请求，请先取消”'}],[/已有发出请求/]);
const share=page(U,'views/live-room-host/share-recipient.html',['主播甲在 S001 直播，好友乙有效，粉丝群甲当前可发言']);
share.add('分享直播发送当前场次卡片',[],['打开分享对象','选择好友乙','点击发送'],[{point:'直播分享成功',result:'显示发送成功'}],[/分享|发送/]);
share.add('取消分享不发送卡片',[],['打开分享对象','选择好友乙','点击取消'],[{point:'取消分享返回直播间',result:'返回当前 S001 直播间'}],[/取消|关闭/]);
const end=page(U,'views/live-room-host/end-confirm.html',['主播甲正在 S001 直播']);
const ended=lifecycle('直播场次','直播中','确认结束直播','已结束','主播',U,[U,'公会App','管理后台']);
end.add('主播确认结束本场',[],['打开结束直播确认','点击确认'],[{point:'主播关播完成',result:'进入 S001 直播结束页'}],[/结束|确认/],{flow:ended.流程编号,transition:ended.状态转换标识});
end.add('取消关播保留本场',[],['打开结束直播确认','点击取消'],[{point:'关播取消',result:'停留 S001 直播画面'}],[/取消/]);
const coMore=page(U,'views/live-room-cohost-active/more-actions.html',['主播甲乙已连麦，各自直播持续进行']);
coMore.add('连麦中修改房型受限',[],['打开更多功能','查看房间设置'],[{point:'连麦中配置限制',result:'不能修改门票或密码房设置'}],[/门票|密码|房间/]);
const coExit=page(U,'views/live-room-cohost-active/cohost-exit-confirm.html',['主播甲乙已经连麦，测试环境使退出连麦请求失败']);
coExit.add('退出连麦失败',[],['打开退出连麦确认','点击确认'],[{point:'退出连麦失败提示',result:'提示“退出失败”'},{point:'退出失败保持连接',result:'甲乙连麦仍在进行'}],[/失败/]);
