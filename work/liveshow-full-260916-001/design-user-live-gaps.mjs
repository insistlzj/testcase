import {test,P1,P2,ERR,enter,calculation} from './case-design.mjs';
const room='live-room.html',host='live-room-host.html',online='views/live-room-host/audience-viewers.html',focus='views/live-room-host/focus-viewers.html';
const restore='views/live-room-host/restore-speaking-confirm.html',mutedList='views/live-room-host/muted-users.html';
for(const action of ['取消','关闭'])test(restore,['取消、关闭或请求失败 -> 保持原状态'],'主播',`${action}恢复发言确认保留禁言`, `恢复禁言${action}分支`,['甲本场仍被禁言，恢复发言确认已打开'],[`${action}|恢复发言确认`,enter(host),'点击|禁用用户'],'禁言列表仍包含甲',{...P1,observe:mutedList,extra:[[mutedList,'仅展示当前场次仍处于禁言状态']]});
test(mutedList,['请求失败时保持禁言'],'主播','恢复发言请求失败保留禁言名单','恢复禁言失败状态',['甲本场被禁言；环境准备：本次恢复请求返回失败，执行前需故障模拟能力'],[enter(host),'点击|禁用用户','点击|甲恢复发言','点击|确认'],'甲仍在本场禁言名单',ERR);
test(mutedList,['确认成功后移出列表'],'主播','恢复发言成功移出禁言名单','恢复后的名单更新',['甲本场被禁言，乙也被禁言'],[enter(host),'点击|禁用用户','点击|甲恢复发言','点击|确认'],'禁言名单仅剩乙',P1);
test(mutedList,['用户离开直播间不自动解除禁言'],'主播','已离场观众仍在本场禁言名单','禁言与在线状态独立',['甲被本场禁言后已经离场，乙未被禁言'],[enter(host),'点击|禁用用户'],'禁言列表仍包含甲',P1);
test(restore,['用户已恢复或场次已结束时不重复执行'],'主播','已恢复观众重复确认后状态保持','恢复发言重复提交状态',['原确认弹窗指向本场被禁言的甲；环境准备：另一有效管理操作已恢复甲，保留原确认弹窗用于再次提交'],['点击|确认',enter(host),'点击|禁用用户'],'禁言列表不包含已恢复的甲',{...P1,observe:mutedList,extra:[[mutedList,'仅展示当前场次仍处于禁言状态']]});
test(restore,['仅可恢复当前场次仍被禁言的用户'],'主播','旧场次恢复请求不影响新场禁言','恢复禁言场次隔离',['环境准备：保留旧S1恢复甲的确认弹窗；S1已结束，本主播现开S2，甲在S2被重新禁言；执行前需提供保留旧会话并提交的测试能力'],['点击|旧S1弹窗确认',enter(host),'点击|当前S2禁用用户'],'S2禁言列表仍包含甲',{...P1,observe:mutedList,extra:[[mutedList,'仅展示当前场次仍处于禁言状态']]});
const viewerOnline='views/live-room/audience-online.html';
for(const [label,data,result]of [
 ['在线成员','甲当前在场，乙已离场','列表不包含乙'],
 ['运营账号贡献','运营甲本場已送虚拟礼物100金币','运营甲贡献值显示0'],
 ['房管身份','甲为当前主播房管，乙仅为另一主播房管','甲显示房管标识'],
 ['进场实时更新','环境准备：列表打开后正常用户丙进入本场','列表新增丙'],
 ['踢出后名单','环境准备：甲在线后刚被本场主播踢出','列表不再包含甲'],
 ])test(viewerOnline,[label==='房管身份'?'已授权房管展示房管标识':label==='运营账号贡献'?'运营账号固定显示 0':label==='踢出后名单'?'被踢出用户立即移出列表':'进入和离开后实时更新'],'观众',`观众查看${label}`,`观众在线列表${label}`,[data],[enter(room),'点击|在线观众'],result,P1);
test('views/live-room/audience-managers.html',['普通观众只读查看，不显示授权操作'],'观众','普通观众不能修改房管授权','观众房管列表权限',['当前用户无房管或主播身份'],[enter(room),'点击|在线观众','切换|房管'],'列表没有设置或取消房管操作',P1);
for(const page of ['views/live-room/profile-moderator.html','views/live-room-host/profile-host.html']){
 const role=page.includes('moderator')?'房管':'主播';
 test(page,[page.includes('moderator')?'巡房会话中的人员不可被拉黑':'不展示拉黑和踢出操作'],role,`${role}不能拉黑巡房人员`,`${role}巡房身份拉黑保护`,['目标甲正以有效巡房任务进入本场'],[enter(page.includes('moderator')?room:host),'点击|甲资料卡'],'不显示拉黑甲的操作',P1);
 for(const action of ['禁言','踢出'])test(page,[page.includes('moderator')?'取消 -> 保持用户当前状态':'使用同一确认弹窗'],role,`${role}取消${action}不改变观众状态`,`${role}${action}取消结果`,['甲为当前在线且未禁言的普通观众'],[enter(page.includes('moderator')?room:host),'点击|甲资料卡',`点击|${action}`,'点击|取消'],action==='禁言'?'甲仍显示未禁言':'甲仍在本场在线列表',P1);
}
for(const [dimension,fixture]of [['粉丝等级','甲乙贡献及财富相同，甲粉丝2、乙粉丝1'],['ID','甲乙贡献及等级相同，甲ID9、乙ID10']])test(focus,['财富等级、粉丝等级'],'主播',`重点观众最终按${dimension}排序`,`重点${dimension}次级比较`,[fixture,'甲乙均为非运营且在线'],[enter(host),'点击|重点在线观众入口'],'甲排在乙之前',P1);
test(focus,['顶部入口展示排序后的前 3 名头像'],'主播','重点观众入口只取排序前三','重点观众顶部范围',['非运营在线甲乙丙丁按当前规则排1至4名，均有不同头像'],[enter(host)],'重点入口仅显示甲乙丙头像',P2);
test(focus,['且关注关系仍有效'],'主播','新粉丝取关后取消标签','重点新粉丝标签失效',['甲在本场首次关注且位于前20名，随后取消关注，贡献和排名未变化'],[enter(host),'点击|重点在线观众入口'],'甲不再显示新粉丝标签',P1);
for(const [page,role,entry]of [['views/live-room/contribution-rank.html','观众',room],['views/live-room-host/contribution-rank.html','主播',host]]){
 for(const [dimension,data,result]of [
 ['粉丝等级','甲乙贡献均100，甲粉丝2财富1，乙粉丝1财富10','甲排列在乙之前'],
 ['财富等级','甲乙贡献均100且粉丝等级均1，甲财富2、乙财富1','甲排列在乙之前'],
 ['用户ID','甲乙贡献和等级相同，甲ID9、乙ID10','甲排列在乙之前'],
 ['缺失等级','甲乙贡献均100，甲粉丝等级缺失、乙粉丝等级1，财富相同','乙排列在甲之前'],
 ])test(page,['粉丝等级','财富等级'],' '+role,`${role}本场榜贡献相同时按${dimension}排序`,`${role}本场榜${dimension}次序`,[data],[enter(entry),'点击|本场贡献榜'],result,P1);
 test(page,['第 99 名与第 100 名贡献值相同'],role,`${role}本场榜第99名按后续条件截断`,`${role}本场榜截断边界`,['前98名贡献更高；甲乙同贡献，甲粉丝2、乙粉丝1，其他相同；共100人'],[enter(entry),'点击|本场贡献榜'],'甲进入榜单第99名',P1);
 test(page,['不设并列名次'],role,`${role}本场榜完全同值仍连续编号`,`${role}本场榜名次连续`,['榜单仅甲乙2人，贡献粉丝等级财富等级相同，甲ID小于乙'],[enter(entry),'点击|本场贡献榜'],'乙排名为第2名',P1);
 test(page,['账号已注销'],role,`${role}查看已注销贡献者名称`,`${role}本场榜注销名称`,['账号A本场贡献100后已最终注销，场次历史榜单可访问'],[enter(entry),'点击|本场贡献榜'],'A名称显示“账号已注销”',P1);
 test(page,['不能进入主页'],role,`${role}不能从榜单进入注销账号主页`,`${role}本场榜注销主页入口`,['榜单A账号已最终注销'],[enter(entry),'点击|本场贡献榜','点击|A条目'],'不进入A账号主页',P1);
 test(page,['返奖不冲减贡献值'],role,`${role}查看幸运礼物贡献不扣返奖`,`${role}本场幸运贡献`,['真实用户A成功送出价值1000金币的幸运礼物，返奖2000金币，无其他赠礼'],[enter(entry),'点击|本场贡献榜'],'A贡献值显示1000',P1);
}
for(const [sort,dimension,data,result]of [
 ['按贡献','粉丝等级','甲乙贡献100，甲粉丝2财富1，乙粉丝1财富10','甲排列在乙之前'],
 ['按贡献','财富等级','贡献粉丝相同，甲财富2、乙财富1','甲排列在乙之前'],
 ['按贡献','ID','贡献粉丝财富相同，甲ID9、乙ID10','甲排列在乙之前'],
 ['按停留时长','贡献','停留均60秒，甲贡献100、乙贡献50','甲排列在乙之前'],
 ['按停留时长','粉丝等级','停留和贡献相同，甲粉丝2、乙粉丝1','甲排列在乙之前'],
 ['按停留时长','财富等级','停留贡献粉丝相同，甲财富2、乙财富1','甲排列在乙之前'],
 ['按停留时长','ID','停留贡献粉丝财富相同，甲ID9、乙ID10','甲排列在乙之前'],
])test(online,[sort],'主播',`在线观众${sort}次级比较${dimension}`,`在线观众${sort}${dimension}`,['甲乙当前均在线',data],[enter(host),'点击|在线人数',`切换|${sort}`],result,P1);
test(online,['粉丝等级或财富等级缺失时按 0 级'],'主播','在线列表缺失等级按零排序','在线观众缺失等级',['甲乙同贡献，甲粉丝等级缺失、乙粉丝1，财富相同'],[enter(host),'点击|在线人数','切换|按贡献'],'乙排列在甲之前',P1);
test(online,['取消房管后用户仍可作为普通观众留在列表'],'主播','取消房管不移除在线用户','取消房管在线关系',['A在线且为本主播房管'],[enter(host),'点击|A头像','点击|取消房管','点击|确认','点击|在线人数'],'在线列表仍包含A',P1);
test(online,['无有效团籍时不展示'],'主播','在线非团员不显示粉丝团身份','在线观众团籍显示',['A当前在线且无本主播有效团籍'],[enter(host),'点击|在线人数'],'A不显示本团身份信息',P2);
test(online,['当前场次被禁言时展示禁言标识'],'主播','在线列表展示本场禁言标识','在线观众禁言显示',['A当前在线且本场已禁言'],[enter(host),'点击|在线人数'],'A显示禁言标识',P2);
test(focus,['财富等级、粉丝等级'],'主播','重点观众同贡献优先比较财富等级','重点观众等级排序差异',['甲乙贡献相同，甲财富2粉丝1，乙财富1粉丝10，均在线非运营'],[enter(host),'点击|重点在线观众入口'],'甲排列在乙之前',P1);
test(focus,['并列最高时均显示该标签'],'主播','重点观众并列最高均打标签','重点观众最高贡献标签',['甲乙贡献并列最高，均在重点20人内'],[enter(host),'点击|重点在线观众入口'],'甲与乙均带有“本场最高”标签',P2);
test(focus,['同一个用户可展示多个标签'],'主播','重点观众可同时命中多个标签','重点观众标签并存',['A为本场新关注、贡献最高且未加入粉丝团，位于重点20人'],[enter(host),'点击|重点在线观众入口'],'A同时带有新粉丝、本场最高、未加入粉丝团标签',P2);
const pass='live-room-host-password.html',scope='views/live-room-host-password/access-scope.html';
test('views/live-room-host-password/more-actions.html',['密码房不提供连麦入口'],'主播','密码房不可发起连麦','密码房连麦入口限制',['当前场次为正在直播的密码房'],[enter(pass),'点击|更多'],'不显示连麦入口',P1);
test(scope,['两个开关相互独立'],'主播','关闭广场展示不改成员限制','密码房开关独立',['本场广场展示开启，成员限制开启'],[enter(pass),'点击|访问范围','关闭|在广场展示','点击|确认','点击|访问范围'],'成员限制仍为开启',P1);
test(scope,['关闭或点击遮罩 -> 不保存'],'主播','关闭访问范围抽屉不保存修改','密码房访问范围取消',['当前广场展示开启'],[enter(pass),'点击|访问范围','关闭|在广场展示','关闭|访问范围抽屉','点击|访问范围'],'在广场展示仍为开启',P2);
test(scope,['主播未创建粉丝团时不可开启'],'主播','无粉丝团不能开启成员限制','密码房成员限制前提',['本主播未创建粉丝团'],[enter(pass),'点击|访问范围','启用|仅粉丝团成员可进入'],'不能开启成员限制',P1);
test(scope,['离开后再次进入时拦截'],'观众','存量非成员离开后重新进房受限','成员限制重入校验',['原已在线非成员A，主播开启仅粉丝成员可进入后A离开'],[enter(room)],'显示粉丝团成员访问限制',{...P1,observe:room,extra:[['views/live-room/fan-club-room-restricted.html','访问直播间需先加入主播粉丝团']],notes:['主播配合修改访问范围；实际执行者在观众端重新进房。']});
const passwordEdit='views/live-room-host-password/room-password.html';
for(const invalid of ['','123','1234567890123','12a4'])test(passwordEdit,['密码不是 4-12 个数字'],'主播',`本场房间密码输入${invalid||'空值'}不保存`,'本场改密格式错误',['当前密码1234'],[enter(pass),'点击|修改密码',invalid?`填写|房间密码|为${invalid}`:'清空|房间密码','点击|保存'],'提示“密码必须是4-12个数字”',P1);
test(passwordEdit,['取消 -> 保留原密码'],'主播','取消房间改密保留原密码','本场改密取消',['本场密码1234'],[enter(pass),'点击|修改密码','填写|房间密码|为5678','点击|取消','点击|修改密码'],'当前密码仍为1234',P2);
const gift='views/live-room/gift.html';
test(gift,['用户实际消耗 = 送出价值 - 返奖金币'],'观众','幸运礼物返奖进入用户余额','幸运赠礼净资产',['真实余额2000金币，本次礼物价值1000金币','环境准备：可确定本次独立开奖总返奖为1500金币；需测试数据或受控开奖能力'],[enter(room),'点击|礼物','选择|指定幸运礼物','选择|赠送数量|为1','点击|赠送'],'金币余额 = 2500',{...P1,calc:calculation('原余额-礼物价值+返奖',{原余额:2000,礼物价值:1000,返奖:1500},{运算:'+',参数:[{运算:'-',参数:[{变量:'原余额'},{变量:'礼物价值'}]},{变量:'返奖'}]},2500)});
test(gift,['上架且未过期状态'],'观众','已选定制礼物到期后不能赠送','赠礼过期提交校验',['面板已选定制礼物A，提交前已到失效时刻，真实余额足够'],['点击|赠送'],'不能继续赠送已到期礼物A',P1);
test('views/live-room/comment-muted.html',['不影响观看、送礼和私信'],'观众','本场禁言仍可赠送普通礼物','禁言赠礼权限',['本账号仅被禁言，礼物A单价10金币，余额100'],[enter(room),'点击|礼物','选择|礼物A','选择|赠送数量|为1','点击|赠送'],'金币余额显示90',{...P1,extra:[[gift,'普通用户赠送成功 -> 扣减金币']]});
test('views/live-room/comment-muted.html',['不影响观看、送礼和私信'],'观众','本场禁言仍可与好友私信','禁言私信权限',['本账号仅被场次禁言，与B为好友且未拉黑'],[enter('direct-message.html'),'填写|消息输入框|为禁言后私信','点击|发送'],'会话显示“禁言后私信”',{...P1,observe:'direct-message.html',extra:[['direct-message.html','支持文本、图片和语音']]});
const beauty='views/start-live-settings/beauty.html';
for(const value of [0,100])test(beauty,['取值 0-100'],'主播',`美颜强度设置边界${value}`,'美颜参数合法边界',[],[enter('start-live-settings.html'),'点击|美颜',`拖动|强度滑块|至${value}`,'点击|完成','点击|美颜'],`所选参数强度为${value}`,P2);
test(beauty,['两组参数独立保存'],'主播','调整美颜不覆盖美型参数','美颜美型参数隔离',['美型参数原值40'],[enter('start-live-settings.html'),'点击|美颜','切换|美颜','拖动|强度滑块|至80','切换|美型'],'美型参数仍为40',P2);
test('views/live-room-cohost-active/cohost-exit-confirm.html',['退出失败'],'主播','退出连麦请求失败显示提示','连麦退出失败提示',['双方正在连麦','环境准备：退出连麦请求返回失败'],[enter('live-room-cohost-active.html'),'点击|退出连麦','点击|确认'],'提示“退出失败”',ERR);
test('views/live-room-cohost-active/more-actions.html',['提示先退出连麦'],'主播','连麦中不可切换受限房型','连麦期间房型限制',['双方正在普通房连麦'],[enter('live-room-cohost-active.html'),'点击|更多','切换|房型|为密码房'],'提示先退出连麦',P1);
test('views/live-room-host/share-recipient.html',['发送失败'],'主播','转发直播消息请求失败','主播分享失败提示',['当前有可发送好友B','环境准备：分享消息请求返回失败'],[enter(host),'点击|转发','选择|好友B','点击|确认'],'提示“发送失败”',ERR);
test('views/live-room-host/share-recipient.html',['取消或关闭 -> 不生成消息'],'主播','取消直播转发不生成卡片','主播分享取消',['当前选择好友B但尚未确认'],['点击|取消',enter('direct-message.html')],'与B会话无新增直播分享卡片',{...P2,observe:'direct-message.html',extra:[['direct-message.html','消息']]});
const month='views/live-data/month.html';
test(month,['进行中场次使用实时值'],'主播','月直播时长包含进行中实时值','主播月时长进行中场次',['本月完成60分钟，当前场次已有效直播30分钟'],[enter('live-data.html'),'切换|月数据'],'本月开播时长显示1小时30分钟',P1);
for(const field of ['收益','有效天','开播时长','观众人次','新增粉丝','送礼人数'])test(month,['无数据月份全部指标显示 0'],'主播',`切换无数据月份清零${field}`,`主播空月份${field}`,['当前月有数据，8月没有任何数据'],[enter('live-data.html'),'切换|月数据','选择|月份|为8月'],`${field}显示0`,P1);
