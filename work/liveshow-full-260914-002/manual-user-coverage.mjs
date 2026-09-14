import {test as t,ref,page} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
// Additional source-first branches: cross-view results, selectors, counters and cancellations.
t('live-plaza.html','无人直播时整栏隐藏','没有关注主播在播时隐藏关注栏',['A已关注B和C，二者均未在播；无其他关注'],['打开首页'],'不展示关注头像栏',{point:'关注栏空状态'});
for(const type of ['热门','新人'])t('live-plaza.html','切换热门或新人',`首页切换${type}列表`,[`平台已准备${type}列表对应场次S1；非该范围的S2单独记录`],['打开首页',`切换“${type}”`],`列表更新为${type}范围中的场次`,{point:'直播列表类型'});
t('live-plaza.html','选择分类','首页选择直播分类',['平台启用音乐、聊天两分类；S1音乐，S2聊天'],['打开首页','选择“音乐”'],'直播列表仅包含音乐分类场次S1',{point:'分类筛选'});
for(const [key,word,metric]of [['host-ranking.html','收礼值：','收礼值'],['contribution-ranking.html','贡献值：','贡献值'],['fan-contribution-ranking.html','贡献值：','贡献值'],['views/live-room/contribution-rank.html','贡献值：','贡献值'],['views/live-room-host/contribution-rank.html','当前场次贡献值','贡献值']]){
 for(const [kind,pre,result]of [['幸运返奖','A在本统计范围内仅成功赠送幸运礼物2个、单价10金币，返奖15金币',20],['虚拟赠礼','运营账号A在本统计范围内仅成功赠送普通礼物2个、单价10虚拟金币',20],['多礼物合计','A在本统计范围成功赠送单价10金币的普通礼物2个及单价30金币的定制礼物1个',50]])t(key,word,`${page(key).name}${kind}计价值`,[pre,key==='host-ranking.html'?'以上礼物全部送给主播B，查看B收礼值':'以上礼物全部送给本页统计主播B，查看A贡献值'],[`打开${page(key).entry}`,'查看对应对象的'+metric],`${metric}=${result}金币`,{point:'礼物价值计价'});
}
t('fan-contribution-ranking.html','默认本月','粉丝团贡献榜默认周期',['当前用户对主播B本月和历史均有不同贡献'],['打开B粉丝团贡献榜'],'默认选中本月',{point:'贡献榜默认周期'});
t('fan-contribution-ranking.html','无有效贡献','粉丝团无有效贡献时未上榜',['A对B当前所选周期无成功礼物贡献'],['打开B粉丝团贡献榜','查看我的排名'],'我的排名显示未上榜',{point:'无贡献排名'});
t('search.html','点击历史词','点击历史词重新执行搜索',['A历史为测试甲、测试乙，测试乙最近使用时间较早'],['打开搜索','点击历史词“测试乙”'],'进入测试乙搜索结果页',{point:'历史词重新搜索'});
t('search.html','不展示热门搜索词','搜索页不混入热门词',['A已有搜索历史词测试甲'],['打开搜索'],'页面不展示热门搜索词',{point:'历史与热门分离'});
t('search-results.html','点击未开播主播','未开播搜索结果进入主页',['搜索结果B当前未开播'],['打开搜索结果','点击B结果卡片'],'进入B主播主页',{point:'未开播搜索路由'});
t('search-results.html','修改关键词','修改搜索词刷新结果',['测试甲命中A，测试乙命中B，初始结果为A'],['打开搜索结果','输入关键词“测试乙”','提交搜索'],'结果只包含与测试乙匹配的B',{point:'搜索词刷新'});
for(const [key,word,metric,pre,result]of [['user-home.html','送出：','累计送出','B成功普通礼物20金币、幸运礼物30金币；另有失败10金币；幸运返奖15金币',50],['host-gift-gallery.html','累计收到：','礼物数量','主播B成功收到幸运礼物2件和3件；另有失败4件，返奖50金币',5]])t(key,word,`${page(key).name}${metric}统计`,[pre],[`打开${page(key).entry}`,`查看B的${metric}`],`${metric}=${result}${metric.includes('数量')?'件':'金币'}`,{point:metric+'口径'});
for(const [field,pre,result]of [['粉丝数','当前A和C关注B，D已取消关注B','粉丝数=2人'],['关注数','B当前关注A和C，已取消关注D','关注数=2人']])t('user-home.html','粉丝/关注：',`用户主页${field}取当前关系`,[pre],['打开B用户主页',`查看${field}`],result,{point:field+'口径'});
for(const [key,word]of [['user-home.html','拉黑 ->'],['host-home.html','拉黑 ->']])t(key,word,`${page(key).name}确认拉黑状态`,['A与B初始无拉黑；当前查看B主页'],['打开B主页更多','点击“拉黑”','确认拉黑'],'主页切换为已加入黑名单状态',{point:'主页拉黑状态',flow:'FLOW-BLOCK'});
for(const state of ['直播中','未开播'])t('host-home.html','直播中才提供',`主播主页${state}入口`,[`主播B当前${state}`],['打开B主播主页','查看直播入口'],state==='直播中'?'提供B当前直播场次入口':'不提供直播场次入口',{point:'主播主页直播入口'});
for(const state of ['已加入','未加入'])t('host-home.html','已加入粉丝团 ->',`主播主页${state}粉丝团入口`,[`A对主播B的粉丝团状态${state}`],['打开B主播主页','点击粉丝团'],state==='已加入'?'进入B的粉丝团贡献榜':'打开B的加入粉丝团视图',{point:'粉丝团关系路由'});
t('profile.html','用户和主播共用','主播个人页保持同一金币资产',['账号A获得主播身份前余额200金币，获得身份期间无收支'],['打开我的页面','查看金币余额'],'金币余额仍为200金币',{point:'主播账号资产共用'});
t('my-decoration.html','分类固定','我的装扮按固定类别进入',['当前账号持有头像框F、聊天气泡B、勋章M'],['打开我的装扮','查看分类入口'],'分类顺序为头像框、聊天气泡、勋章',{point:'装扮类别范围'});
for(const [role,key]of [['用户','profile.html'],['主播','host-center.html']])t(key,role==='用户'?'开始直播：':'开始直播进入开播设置',`${role}有效身份开播入口`,['A已认证主播，账号、公会有效，平台与公会开播权限均已开启'],[`打开${page(key).entry}`,'点击“开始直播”'],'进入开播设置',{point:'开播设置准入',role});
t('host-center.html','直播权限关闭时不能','主播中心权限关闭不进入准备页',['A仍为有效主播，但平台开播权限关闭'],['打开主播中心','点击“开始直播”'],'不能进入开播设置',{point:'开播准备权限',role:'主播'});
for(const [word,name]of [['公会通知','公会通知'],['粉丝团成员管理','粉丝团'],['进入我的公会','我的公会']]){
 const actualWord=word==='公会通知'?'通知列表':word;
 t('host-center.html',actualWord,`主播中心进入${name}`,['A具有有效主播身份及公会G'],['打开主播中心',`点击“${name}”`],`进入当前主播的${name}页面`,{point:'主播工具入口',role:'主播'});
}
for(const [shape,prep]of [['纯文字','M1为文字“本周活动公告”'],['图文','M1为文字“本周活动公告”及图片A']])t('host-guild-notifications.html','支持纯文字',`主播公会通知显示${shape}`,['当前公会G给主播A发送M1；'+prep],['打开公会通知','查看M1'],`M1内容与发送时的${shape}快照一致`,{point:'公会通知内容',role:'主播'});
t('host-guild-notifications.html','展开或收起','公会通知长文原地展开',['M1为超过卡片折叠区域的有效长公告'],['打开公会通知','点击M1展开'],'完整内容在M1卡片内展示',{point:'公告展开位置',role:'主播'});
t('host-guild-notifications.html','未读标记：','公会通知未读标记',['A收到公会消息M1且未阅读'],['打开公会通知','查看M1标题'],'未读通知标题旁有提示点',{point:'公告未读状态',role:'主播'});
t('host-guild-notifications.html','不展示发布时间','公会通知不提供发布时间字段',['当前公会有已发送消息M1'],['打开公会通知','查看M1卡片'],'卡片不展示发布时间',{point:'通知字段边界',role:'主播'});
t('guild-management.html','主播人数：','公会中心展示在会主播人数',['公会G当前在会主播2人，已退会1人'],['打开公会中心','查看G主播人数'],'主播人数=2人',{point:'公会在会人数'});
t('guild-application-form.html','去除首尾空格','申请入会姓名全空格',['其他入会材料完整有效，尚无处理中申请'],['打开入会申请','输入姓名为三个空格','提交申请'],'不生成空姓名申请',{point:'姓名去空格必填'});
t('guild-application-form.html','默认选择 KTP','申请入会默认居民身份证',['A首次打开选定公会G的入会申请'],['打开入会申请','查看证件类型'],'默认选择KTP',{point:'证件默认类型'});
for(const state of ['申请被驳回','已退出'])t('guild-application-records.html','历史记录不会',`${state}保留申请公会`,[`A曾申请G，当前状态${state}；H从未申请`],['打开我的公会'],'列表保留G公会卡片',{point:'历史申请保留'});
t('guild-application-records.html','提交时间倒序','我的公会按最新申请排序',['A对G最新入会申请9月10日，对H最新退会申请9月12日；同业务时区'],['打开我的公会'],'H排在G之前',{point:'公会申请时间顺序'});
for(const [field,word]of [['申请原因','申请：'],['驳回原因','驳回：']])for(const exists of [true,false])t('guild-detail.html',word,`公会申请${exists?'有':'无'}${field}`,[`申请J1已驳回，${field}${exists?'为“个人原因”':'为空'}`],['打开J1所属公会详情','展开J1申请'],exists?`${field}显示“个人原因”`:`不展示空${field}`,{point:field+'显示条件'});
t('guild-leave-application.html','当前公会：','退会申请公会只读',['A当前有效公会G'],['打开退会申请','查看公会字段'],'当前公会G只读',{point:'退会对象绑定',role:'主播'});
t('guild-leave-application.html','只能存在一笔','退会已有申请不可重复提交',['A已有处理中退会申请L1，仍属于G'],['打开退会申请','输入原因“个人原因”','提交申请'],'不创建第二笔处理中退会申请',{point:'退会唯一在途',role:'主播'});
for(const state of ['自己账号','他人账号'])t('balance-detail.html','当前登录账号',`余额流水隔离${state}`,[`登录A有流水T1，B有流水T2；当前检查${state==='自己账号'?'T1':'T2'}`],['打开余额明细'],state==='自己账号'?'列表包含T1':'列表不包含T2',{point:'资产流水所有者'});
for(const [pre,result]of [['T1发生10:00，T2发生11:00','T2排列在T1之前'],['T1和T2发生时间相同，流水ID数字部分分别1001、1002','T2排列在T1之前']])t('balance-detail.html','按发生时间倒序','余额流水按时间及ID顺序',[pre+'；二者均属于当前账号'],['打开余额明细'],result,{point:'流水稳定顺序'});
t('recharge.html','支付渠道：','充值渠道限当前端地区及账号',['A在Android、印尼，配置允许渠道C1，不允许C2'],['打开充值','查看支付渠道'],'仅提供A当前允许的渠道C1',{point:'充值渠道适用范围'});
t('recharge.html','活动区在前','充值套餐活动区优先',['当前账号可见活动套餐A、普通套餐B和C；普通配置顺序C在B前'],['打开充值'],'套餐排列为A→C→B',{point:'充值套餐顺序'});
for(const [key,fields]of [['order-income-detail.html',[['数量','2'],['支付时间','2026-09-14 10:00'],['支付渠道','实际成功订单渠道C1'],['支付金额','实际订单实付金额10USD']]],['order-expense-detail.html',[['付款商品名称','普通礼物G'],['数量','2'],['支付时间','2026-09-14 10:00'],['扣款金币','20']]]])for(const [field,value]of fields)t(key,field+'：',`${page(key).name}读取${field}`,[`当前账号成功订单O1的${field}支付时快照为“${value}”`],[`打开O1的${page(key).entry}`,`查看${field}`],`${field}与“${value}”快照对应`,{point:field+'支付快照'});
for(const key of ['auth-phone-login.html','auth-email-login.html'])for(const type of ['密码','验证码'])t(key,'登录成功 ->',`${page(key).name}${type}登录成功`,[key.includes('phone')?'已注册有效账号A手机号81234567890，区号+62':'已注册有效账号A邮箱qa.user@example.com',`A不处于封禁或注销状态；${type}凭证正确有效，协议已勾选`],[`打开${page(key).entry}`,`选择${type}登录`,'输入前置条件中的账号和有效凭证','点击“继续”'],'进入首页',{point:'有效登录会话'});
for(const gender of ['男','女','不公开'])t('profile-edit.html','性别：',`个人资料保存性别${gender}`,['当前账号有效，头像昵称不修改'],['打开资料编辑',`选择性别“${gender}”`,'点击“保存”'],`性别保存为${gender}`,{point:'性别选项'});
t('settings.html','默认 Bahasa Indonesia','用户端首次语言默认印尼语',['当前账号未设置过语言偏好'],['打开设置','查看语言'],'默认语言为Bahasa Indonesia',{point:'默认语言'});
for(const pref of ['开播提醒','互动通知'])t('settings.html','分类偏好',`关闭${pref}不更改系统权限`,['当前设备系统通知已授权，App对应分类偏好已开启'],['打开设置',`关闭“${pref}”`,'查看系统通知权限'],'系统通知仍显示已开启',{point:'分类与系统权限独立'});
for(const [sort,tiers]of [['按贡献',['本场贡献值','粉丝等级','财富等级','ID']],['按停留时长',['本场累计在线时长','本场贡献值','粉丝等级','财富等级','ID']]])for(const [i,tier]of tiers.entries())t('views/live-room-host/audience-viewers.html',sort+'时',`在线观众${sort}以${tier}决序`,[`A和B当前在线；${tiers.slice(0,i).join('、')||'无更高优先级指标'}均相同；${tier}分别为${tier==='ID'?'1001、1002':'20、10'}，其他条件相同`],['打开在线观众',`切换“${sort}”`],'A排列在B之前',{point:'在线排序第'+(i+1)+'条件',role:'主播'});
for(const key of ['views/live-room/profile-moderator-mute.html','views/live-room/profile-moderator-remove.html']){
 const mute=key.includes('mute'),act=mute?'禁言':'踢出';t(key,'确认 ->',`房管确认${act}更新本方可见状态`,['A为本场S有效房管，普通观众B在线且非巡房人员；B当前未被禁言或踢出'],['打开B资料卡',`点击“${act}”`,`确认${act}`,...(mute?['查看B资料卡禁言状态']:['打开在线观众列表'])],mute?'B资料卡显示本场禁言状态':'在线列表不再显示B',{point:'房管处置提交',role:'房管',flow:mute?'FLOW-ROOM-MUTE':'FLOW-ROOM-KICK'});
 t(key,'关闭',`房管${act}确认窗关闭`,['A为本场有效房管，普通观众B在线，处置尚未提交'],['打开B资料卡',`点击“${act}”`,'关闭确认弹窗'],mute?'B仍未被禁言':'B仍在本场在线列表',{point:'房管处置取消',role:'房管'});
}
for(const state of ['已恢复','场次已结束'])t('views/live-room-host/restore-speaking-confirm.html','不重复执行',`恢复发言遇到${state}`,[`主播A已经打开B的恢复发言确认窗；提交前B${state}`],['确认恢复发言'],'不重复执行恢复发言',{point:'过期恢复请求',role:'主播'});
t('views/live-room-host/muted-users.html','本场重进后继续','禁言用户本场重进仍保留禁言',['B在S1被禁言，离开后重新进入S1；场次尚未结束'],['打开本场禁言列表','查看B状态'],'B仍在本场禁言列表',{point:'禁言跨进出保持',role:'主播'});
t('views/live-room-host/cohost-hosts-search-result.html','去除首尾空格','连麦搜索去除首尾空格',['A及B均在普通房直播，未连麦，无拉黑；B昵称测试主播B'],['打开连麦搜索','输入“  测试主播B  ”'],'返回主播B可邀请项',{point:'连麦搜索标准化',role:'主播'});
t('views/live-room-host/cohost-hosts-search-result.html','必填','连麦搜索空词必填',['A正在普通房直播且未连麦'],['打开连麦搜索','输入三个空格','提交搜索'],'不按空关键词提交主播搜索',{point:'连麦搜索必填',role:'主播'});
t('views/live-room-host/cohost-invite-notice.html','失效邀请立即','连麦邀请失效即移除',['A收到B邀请I1，B在A操作前已结束直播'],['打开连麦邀请列表'],'不提供I1的有效邀请操作',{point:'邀请失效更新',role:'主播'});
for(const [key,word,pre,result]of [['views/start-live-settings/category.html','按平台配置顺序','有效分类顺序A、B；停用C','可选分类按A、B排列'],['visible-fan-select.html','搜索不改变','粉丝A、B昵称均含测试，原顺序B在A前','搜索结果仍为B在A前']])t(key,word,`${page(key).name}保持来源顺序`,[pre],[`打开${page(key).entry}`,...(key==='visible-fan-select.html'?['输入“测试”']:[])],result,{point:'选择器顺序',role:'主播'});
for(const key of ['live-records.html','views/live-data/month.html'])t(key,key==='live-records.html'?'总时长 =':'开播时长：',`${page(key).name}时长汇总`,['当前范围有两场有效直播时长20、40分钟，范围外另有100分钟'],[`打开${page(key).entry}`,'查看开播总时长'],'总时长=60分钟',{point:'范围内时长',role:'主播',calc:calculation('+',[20,40],['第一场时长','第二场时长'],'分钟')});
t('live-records.html','默认近 7 天','直播记录默认近七天',['当前业务日期2026-09-14；不同日期均有已开始场次'],['打开直播记录'],'默认日期范围为2026-09-08至2026-09-14',{point:'直播记录默认范围',role:'主播'});
t('live-records.html','开播时间倒序','直播记录按开播时间倒序',['S1于10:00开播，S2于11:00开播；同日同主播'],['打开直播记录'],'S2排列在S1之前',{point:'场次排序',role:'主播'});
t('live-records.html','已创建且实际开始','直播记录排除未开始场次',['当前范围S1已经开始，S2仅创建但未实际开始'],['打开直播记录'],'场次列表不包含S2',{point:'实际开播范围',role:'主播'});
