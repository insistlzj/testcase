import {designs,ref,page} from './design-cases.mjs';
function relocate(d,key,role){const p=page(key);Object.assign(d,{page:p.key,entry:p.entry,module:p.module,end:p.end,role,metaIds:p.meta.map(u=>u.标识)});d.prerequisites.unshift(`当前执行账号为${role}，具有${p.end}的有效会话`);}
for(const d of designs){
 if(d.label==='每日中开播状态对应当前记录'){d.prerequisites.push('当前所选日期为今日，A当前在播且B已下播');d.expected='A显示直播中';}
 if(/^等级配置中(主播|财富|粉丝)等级对应当前记录$/u.test(d.label)){
  const tab=d.label.match(/中(.+等级)对应/u)[1];d.prerequisites=[`管理员已登录，${tab}Tab有已保存等级1，金币数值10；另一Tab同等级金币数值20`];d.steps=['打开等级配置',`点击“${tab}”`,'查看已保存等级1的金币数值'];d.expected='等级1金币数值显示10';d.point=tab+'独立配置';
 }
 if(d.label==='好友列表通过返回进入关联页面')d.prerequisites.push('本例从消息中心进入好友列表');
 if(d.label==='公会详情通过返回进入关联页面')d.prerequisites.push('本例从我的公会卡片进入目标公会详情');
 if(d.label==='礼物展馆通过返回进入关联页面')d.prerequisites.push('本例从主播A主页进入其礼物展馆');
 if(d.label==='通知详情通过业务入口进入关联页面'){d.prerequisites.push('通知A关联当前公会入会申请J1，当前公会长有J1查看权限');d.steps=['打开通知A详情','点击关联入会申请业务入口'];d.expected='进入J1入会申请详情';}
 if(d.label==='报表中心通过入口进入关联页面'){d.prerequisites.push('当前角色已授予用户活跃汇总（每日）报表权限，报表启用');d.steps=['打开报表中心','点击“用户活跃汇总（每日）”'];d.expected='进入用户活跃汇总（每日）报表';}
 if(d.label==='后台账号重置密码立即生效'){
  d.role='普通后台账号';d.entry='后台登录';d.prerequisites=['普通后台账号A的登录名为qa_admin_a，账号与角色启用且具有用户列表权限','超级管理员已配合在重置密码中两次输入NewPass12并保存成功，A旧密码为OldPass12'];d.steps=['打开后台登录','输入账号“qa_admin_a”','输入密码“NewPass12”','点击“登录”','查看用户管理菜单'];d.expected='展示A有权访问的用户管理菜单';
 }
 if(d.label==='搜索结果中房间号对应当前记录'){d.prerequisites=d.prerequisites.map(s=>s.replace('“房间号”为测试A','“房间号”为当前主播A的实际系统ID（已留存用于对照）'));}
 if(d.label==='系统通知中已读状态对应当前记录'){d.prerequisites.push('通知A刚发送给当前账号，进入前未读；当前操作首次查看该通知');d.expected='通知A标记为已读';}
 if(['粉丝列表中勋章对应当前记录','好友列表中勋章对应当前记录','我的装扮中头像框对应当前记录','我的装扮中聊天气泡对应当前记录'].includes(d.label))d.prerequisites.push('本例对象A的对应装扮已佩戴且未过期；B佩戴不同装扮');
 if(['我的关注中开播状态对应当前记录','我的粉丝团中开播状态对应当前记录'].includes(d.label)){d.prerequisites.push('主播A当前正在普通房直播，主播B未开播；不是创建资料时选择的枚举');d.expected='A显示当前在播状态';}
 if(d.label==='1 对 1 私信中已读状态对应当前记录'){d.prerequisites.push('A为本方已成功发出的消息，对方随后已经进入会话阅读A；当前执行者为发件人');d.expected='消息A显示已读';}
 if(['我的公会中关系状态对应当前记录','公会详情中关系状态对应当前记录'].includes(d.label)){d.prerequisites.push('当前用户对公会A的入会已通过公会初审及平台终审，尚未退出；对公会B仅保留驳回历史');d.expected='与公会A的关系显示已加入';}
 if(['用户主页中关系状态对应当前记录','主播主页中关系状态对应当前记录','用户资料卡-普通观众中关系状态对应当前记录','主播资料卡中关系状态对应当前记录'].includes(d.label)){d.prerequisites.push('当前执行者与查看对象A已经成为好友且无拉黑，与B尚非好友');d.expected='与A显示好友关系';}
 if(d.label==='首次登录通知说明中正文对应当前记录'){d.prerequisites=['正常账号首次登录成功，尚未选择通知说明的任一操作'];d.expected='正文说明开启通知后可及时收到关注主播开播、互动消息及平台公告';}
 if(d.label==='系统通知授权弹窗中正文对应当前记录'){d.prerequisites=['当前设备尚未授予通知权限，用户已在首页说明选择开启通知'];d.expected='正文说明通知可能包括提醒、声音和图标标记';}
 if(d.label==='本场贡献-贡献榜中亲密度对应当前记录'){d.prerequisites=d.prerequisites.map(s=>s.replace('“亲密度”为测试A','“亲密度”为100'));d.expected='A在本主播粉丝团的亲密度显示100';}
 if(d.label==='通知消息中已读状态对应当前记录'){d.prerequisites.push('公会通知A未进入详情阅读，B已阅读；本次只进入列表');d.expected='通知A仍显示未读标记';}
 if(d.label==='创建运营账号默认启用')d.prerequisites.push('有效头像文件qa-avatar.png已准备，并随本例账号资料填写上传');
 if(d.label==='用户有效身份开播入口')d.excluded='MainBasis对我的页开始直播同时写进入主播中心和进入开播设置，单步路由存在歧义；保留明确的主播中心开播用例';
 if(d.label==='公会申请有申请原因')d.prerequisites.push('J1具体为已驳回的退会申请，提交时退会原因个人原因');
 if(d.label==='公会申请无申请原因')d.prerequisites.push('J1具体为入会申请，该表单未设申请原因字段');
 if(d.label==='公会申请有驳回原因'||d.label==='公会申请无驳回原因')d.prerequisites.push('J1由公会初审驳回，原因按本例填写或留空；不是平台终审');
 if(d.label==='退会已有申请不可重复提交')d.prerequisites.push('A在产生L1之前已经打开本设备退会表单；另一个设备已成功提交L1，本设备仍保留原表单');
 if(/^(手机号|邮箱)登录(密码|验证码)登录成功$/u.test(d.label)){
  const phone=d.label.startsWith('手机号'),code=d.label.includes('验证码'),acct=phone?'81234567890':'qa.user@example.com';d.prerequisites.push(code?'测试短信或邮件服务返回本次有效验证码123456':'A当前密码为LoginPass12');
  d.steps=[`打开${phone?'手机号':'邮箱'}登录`,`选择${code?'验证码':'密码'}登录`,...(phone?['选择区号+62']:[]),`输入${phone?'手机号':'邮箱'}“${acct}”`,...(code?['点击“获取验证码”','输入本次验证码“123456”']:['输入密码“LoginPass12”']),'勾选用户协议与隐私政策','点击“继续”'];
 }
 if(d.label==='恢复发言遇到已恢复'){d.steps=['点击第一次“确认”','点击第二次“确认”','打开本场禁言列表','查看B'];d.expected='禁言列表不包含B';d.sourceIds.push(ref('views/live-room-host/muted-users.html','禁言').标识);}
 if(d.label==='恢复发言遇到场次已结束')d.excluded='场次结束后不得重复恢复规则明确，但未定义旧弹窗结果或端内审计观察入口；保留观察缺口';
 if(/^(充值|消费|退款)订单导出筛选结果$/u.test(d.label)){d.prerequisites.push('R1和R2的本报表统计时间为2026-09-14，R3为2026-09-13；当前范围仅9月14日');d.steps=[d.steps[0],'选择日期2026-09-14至2026-09-14','点击“查询”','点击“导出”','打开导出文件'];}
 if(/^(主播|公会)分成记录保存实际上传人$/u.test(d.label)){d.steps=['查看当前批次预览','确认导入','查看该批次上传信息'];d.expected='上传人显示当前账号A';}
 if(d.label==='粉丝群禁言取消'||d.label==='粉丝群禁言请求失败'){d.steps.push('打开群成员管理','查看A禁言状态');d.expected='A不显示群禁言标记';d.sourceIds.push(ref('group-manage-owner.html','禁言').标识);}
 if(d.label==='已领奖后改任务配置不补发'){d.steps=d.steps.filter(s=>s!=='查看领取项和余额');d.steps.push('打开余额充值','查看金币余额');d.sourceIds.push(ref('recharge.html','金币余额').标识);}
 if(/^(直播结束|平台关播|公会关闭权限)后观众进入结束页$/u.test(d.label))d.steps=['查看原正在观看的S直播页面'];
 if(d.label==='入会流转到初审待审核的用户状态'||d.label==='入会流转到平台终审待审核的用户状态')d.expected='当前关系显示申请中';
 if(d.label==='退会批准后主播入口回到申请')d.steps=['打开我的页面','点击“主播中心”'];
 if(d.label==='主播退会后成员失去群聊权限'){relocate(d,'views/message-center/fan-group.html','用户');d.steps=['打开消息中心粉丝团列表','查看B原粉丝群'];d.expected='B原粉丝群入口已移除';}
 if(d.label==='公会初审驳回后的用户关系')d.expected='当前关系显示已驳回';
 if(d.label==='有效条件开始新直播'){d.prerequisites.push('本例主题为测试新场，封面为有效图片A');d.steps.splice(1,0,'输入直播主题“测试新场”');}
 if(/^幸运礼物\d+份卡片价格$/u.test(d.label)){d.prerequisites.push('当前幸运礼物G已上架，支持x1/x10/x100购买档位；本例核对对应档位卡片');d.steps.splice(1,0,'打开礼物面板','选择幸运礼物G');}
 if(d.label==='调整票价不修改在播场次'){
  relocate(d,'views/live-room/ticket-room-restricted.html','观众');d.prerequisites=['观众A正常登录，与主播无拉黑且无购票记录','主播S开播快照门票100；管理员后将档位改200，S仍在播'];d.steps=['打开S普通分享入口','查看本场购票弹窗'];d.expected='S门票价格仍为100金币';d.sourceIds.push(ref('views/live-room/ticket-room-restricted.html','门票').标识);
 }
 if(d.label==='账号列表账户余额明细核对'||d.label==='运营账号主页虚拟金币余额明细核对')d.prerequisites.push('本例运营账号编号为R');
 const event={公会状态变更:'G由停用恢复为启用',公会长账号状态变更:'当前公会长账号由停用恢复为启用',运营账号管理权限变更:'平台已锁定运营账号A的公会管理权限'};
 for(const [k,v]of Object.entries(event))if(d.label==='公会通知承载'+k){d.prerequisites.push('本次E1具体变化：'+v+'；当前已恢复有效公会会话');d.expected='通知表达'+v;}
 const progress={待公会审核:'用户提交节点已完成，公会审核待处理',平台审核中:'公会审核节点显示通过，平台终审待处理',平台终审通过:'成为主播节点已完成',平台终审驳回:'平台终审节点显示驳回'};
 for(const [k,v]of Object.entries(progress))if(d.label==='入会进度对应'+k)d.expected=v;
 if(/^(主播|公会)分成记录分成备注\d+字$/u.test(d.label)){d.prerequisites.push('上传对话框已选中valid.csv，该文件包含100USD合法分成记录；仅修改备注');if(d.label.endsWith('100字'))d.expected='上传成功后进入分成预览';}
 if(d.label==='礼物排序较大值靠前'){d.steps.push('打开普通礼物列表','查看A与B顺序');d.expected='礼物A排在B之前';}
 if(d.label==='道具排序较大值靠前'){d.steps.push('打开道具配置列表','查看A与B顺序');d.expected='道具A排在B之前';}
 if(d.label==='主播中心两类等级独立'){d.expected='主播等级显示5';d.point='主播等级不误用财富等级';}
 if(d.label==='密码房可见名单0人')d.steps=d.steps.map(s=>s==='选择前0名粉丝'?'取消全部粉丝选择':s);
 if(d.label==='已结束消费对象保留订单快照'){d.steps.push('返回订单C详情','查看扣款金币');}
 if(/^概要基准\d+次开奖理论RTP$/u.test(d.label)){
  const n=Number(d.label.match(/\d+/u)[0]),zero={1:10.4,10:8.4,100:6.4}[n],five={1:32,10:34,100:36}[n];
  d.prerequisites.push(`使用可编辑测试幸运礼物G${n}，四语名称和图标有效；本例基准是测试输入，不假设线上默认配置`);
  d.steps=['打开测试幸运礼物G'+n+'编辑','输入单次消耗“10”',`输入开奖次数“${n}”`,`输入六档奖励0、5、10、50、100、1000及对应概率${zero}%、${five}%、55%、2%、0.5%、0.1%`,'查看自动计算的RTP'];
 }
 if(d.label==='勋章佩戴同步直播公屏身份'){d.prerequisites.push('该场次可正常发送公屏，无禁言');d.steps.push('输入公屏消息“勋章测试”','点击“发送”','查看本人刚发送消息的身份区域');}
 if(d.label==='重复好友申请不新增'){d.steps=['打开搜索','输入B实际ID','提交搜索','打开B主页','点击“申请好友”'];d.sourceIds.push(ref('search.html','搜索').标识);}
 if(d.label==='双方拉黑后B取消拉黑A'){d.prerequisites.push('配合账号B已确认取消对A的拉黑，A没有取消对B的拉黑');d.steps=['打开A黑名单管理','查看B'];}
 if(d.label.startsWith('取消拉黑不恢复')){
  const kind=d.label.replace('取消拉黑不恢复','');const item={关注:[['打开我的关注','查看B'],'我的关注不包含B','my-following.html','已关注'],好友:[['打开好友列表','查看B'],'好友列表不包含B','friend-list.html','当前有效好友'],粉丝团:[['打开我的粉丝团','查看B粉丝团'],'我的粉丝团不包含B的团','my-fan-clubs.html','有效团籍'],房管:[['打开房管管理','查看B'],'房管列表不包含B','moderator-management.html','取消拉黑后不自动恢复'],聊天记录:[['打开B主页','点击“私信”','查看历史消息M1'],'原消息M1没有恢复','direct-message.html','单聊记录']}[kind];
  d.steps.push(...item[0]);d.expected=item[1];d.sourceIds.push(ref(item[2],item[3]).标识);
  if(kind==='房管'){d.role='主播';d.prerequisites.unshift('A为主播，B原是A授权的房管，因A拉黑B后房管关系已解除');}
  if(kind==='粉丝团')d.prerequisites.push('B是主播，A原加入B粉丝团，拉黑后团籍已解除');
  if(kind==='聊天记录')d.prerequisites.push('原会话消息M1已因拉黑删除');
 }
 if(d.label==='主播拉黑在线观众使其退出'){d.role='主播';d.steps=d.steps.filter(s=>s!=='打开黑名单管理');d.steps.unshift('打开本方主播直播间');d.steps.push('打开在线观众列表','查看A');d.sourceIds.push(ref('views/live-room-host/audience-viewers.html','当前在线').标识);}
 if(d.label==='群主免打扰不改成员偏好'){
  relocate(d,'group-manage-member.html','普通群成员');d.prerequisites=['B为有效普通群成员，已登录，原群消息通知开启','配合群主A刚为其本人开启群消息免打扰'];d.steps=['打开B的群管理','查看消息免打扰开关'];d.expected='B的消息免打扰开关仍关闭';d.sourceIds.push(ref('group-manage-member.html','免打扰').标识);
 }
 if(/^创建运营账号名称\d+字$/u.test(d.label))d.prerequisites.push('新建表单中已上传头像A，并已填入唯一账号op-test-a、初始密码OpPass123及发放0；只修改本条名称');
 if(d.label==='退款订单明细状态处理中'||d.label==='退款订单明细状态失败'){
  const state=d.label.endsWith('失败')?'失败':'处理中';d.prerequisites.push(`A是支付渠道对原充值订单R1的退款请求，当前${state}，尚未生成已完成退款单`);d.expected='报表不包含R1对应的已完成退款记录';
 }
 if(/^(直播场次|账号)补充说明(0|200)字符$/u.test(d.label))d.expected='提示“举报已提交”';
 if(d.label==='普通用户点击主播中心')d.steps=['打开我的页面','点击“主播中心”'];
 if(d.label==='普通用户点击开播')d.steps=['打开首页','点击“开播”'];
 if(d.label==='以主播 ID搜索'){d.steps.push('查看搜索结果中的主播');d.expected='搜索结果包含主播B';}
 if(d.label==='停用任务不回收领奖金币')d.prerequisites=d.prerequisites.map(s=>s.replace('原钱包余额50','领取完成后的钱包余额为50金币'));
 if(['任务停用不增长进度','任务尚未生效不增长进度','任务已过有效期不增长进度'].includes(d.label))d.excluded='MainBasis定义任务不产生新进度，但未定义无效任务在用户端的可见性及进度观察入口；保留覆盖缺口，不假设可见';
 if(d.label==='赠礼任务已领取状态'){d.steps=['打开全部任务','查看该赠礼任务已领取按钮'];d.expected='已领取按钮不可用';}
 if(d.label.startsWith('幸运礼物编辑奖励金币为'))d.steps=d.steps.map(s=>s.replace('输入奖励金币','输入第一档奖励金币'));
 if(/^(中文|英文|印尼语|马来语)(标题|正文)\d+字$/u.test(d.label)&&d.expected.startsWith('推送文案可')){d.steps.push('查看当前推送任务状态');d.expected='推送任务状态为已发送';}
 if(d.label.startsWith('等级编号')){d.prerequisites.push('本例在主播等级Tab，准备有效勋章图qa-level.png');d.steps.splice(1,0,'点击“主播等级”');d.steps.splice(-1,0,'上传等级勋章图qa-level.png');}
 if(d.label.startsWith('敏感词应用于'))d.steps.splice(1,0,'输入敏感词“测试词A”','选择分类“辱骂攻击”','选择“包含匹配”','输入替换内容“***”','选择状态“启用”');
 if(d.label.startsWith('冷静期取消注销后保留')){
  const suffix=d.label.replace('冷静期取消注销后保留','');const plan={账号:[['打开我的页面','查看账号ID'],'当前账号ID仍为A','profile.html','用户 ID'],资产:[['打开余额充值','查看金币余额'],'金币余额仍为50金币','recharge.html','金币余额'],社交关系:[['打开好友列表','查看B'],'好友列表仍包含B','friend-list.html','当前有效好友'],聊天记录:[['打开与好友B的私信','查看消息C'],'原私信消息C仍保留','direct-message.html','单聊记录'],创建的粉丝团:[['打开主播中心','打开自己的粉丝团成员管理'],'仍显示原创建的粉丝团D','host-center.html','自己的粉丝团']}[suffix];
  d.steps=[d.steps[0],d.steps[1],...plan[0]];d.expected=plan[1];d.sourceIds.push(ref(plan[2],plan[3]).标识);
  if(suffix==='创建的粉丝团'){d.role='主播';d.prerequisites.unshift('A在注销申请前是已认证主播，创建粉丝团D');}
 }
 if(/^连续签到第[123]天$/u.test(d.label)||d.label==='登录不等于签到'||d.label==='任务进度1/1领奖'||d.label==='任务领取成功'){
  d.prerequisites.push('本例金币初始余额为50；无其他金币变更');d.steps.push('打开余额充值','查看金币余额');const reward=d.label==='连续签到第1天'||d.label==='登录不等于签到'?20:d.label.startsWith('连续签到')?30:10;d.expected=`金币余额为${50+reward}金币`;d.sourceIds.push(ref('recharge.html','金币余额').标识);
 }
 if(d.label.startsWith('申请结果')){d.steps=d.steps.filter(s=>s!=='打开申请加入公会');}
 if(d.label==='入会重复关系有处理中申请'||d.label==='入会重复关系已经加入公会'){d.steps=['打开我的公会','查看当前公会关系及申请入口'];d.sourceIds.push(ref('guild-application-records.html','公会').标识);}
 if(/^粉丝团名称输入长度20$|^累计贡献输入[01]$/u.test(d.label))d.expected='保存按钮可用';
 if(d.label==='粉丝团名称输入长度21')d.steps.push('点击可用时的“保存”按钮');
 if(d.label==='粉丝名单编辑后确认'||d.label==='粉丝名单编辑后返回'){d.steps.splice(1,0,'勾选粉丝C');d.steps.push('查看房型设置中的授权名单');}
 if(d.page==='fan-contribution-ranking.html'){const host=/^贡献榜按|^贡献榜等级缺失/u.test(d.label)?'C':'B';d.steps=d.steps.map(s=>s==='打开贡献榜'?`打开主播${host}粉丝团贡献榜`:s);d.prerequisites.push(`本例统计对象为主播${host}的粉丝团`);d.entry=`主播${host}粉丝团 → 贡献榜`;}
 if(d.label.endsWith('等级缺失按0参与排序')&&d.page!=='contribution-ranking.html'){const level=d.page==='host-ranking.html'?'主播等级':'粉丝等级';d.prerequisites=d.prerequisites.map(s=>s.replace('排序所需等级',level).replace('B该等级为1',`B${level}为1`));}
 if(d.label.startsWith('月数据单日'))d.prerequisites=d.prerequisites.map(s=>s.replace('当前统计范围仅该自然日和该主播','统计当前主播本月；除本例该日外，本月其余日期没有直播'));
 if(/^创建运营账号初始发放|^运营账号初始密码/u.test(d.label)){
  d.prerequisites.push('准备头像qa-avatar.png，名称测试运营，登录账号qa_ops_new在全平台未使用；初始密码OpsPass12');
  d.steps.splice(1,0,'上传头像qa-avatar.png','输入名称“测试运营”','输入登录账号“qa_ops_new”');
  if(d.label.startsWith('创建运营账号'))d.steps.splice(4,0,'输入初始密码“OpsPass12”');else d.steps.splice(4,0,'输入发放金币“0”');
  if(/初始发放(0|99|100)$/u.test(d.label)){let n=d.label.match(/\d+$/u)[0];d.steps.push('打开新建账号qa_ops_new详情','查看账户余额');d.expected=`新账号qa_ops_new账户余额为${n}虚拟金币`;d.sourceIds.push(ref('guild-operation-account-detail.html','账户余额：').标识);}
  if(d.label.endsWith('初始发放-1'))d.expected='不创建负数发放的账号';if(d.label.endsWith('初始发放101'))d.expected='不创建发放101超额的账号';
 }
 if(d.label==='公会禁用运营账号后账号不能送礼'){
  d.prerequisites=['运营账号A启用且有100虚拟金币，已登录用户App并打开S1普通礼物G面板','G单价10且可赠送；公会长在该面板已打开之后，配合停用A并确认'];d.steps=['点击已打开面板的“赠送”'];d.expected='不会成功赠送G';
 }
 if(d.label==='平台停用运营账号')d.prerequisites.push('A当前处于启用状态');if(d.label==='平台启用运营账号')d.prerequisites.push('A当前处于停用状态');
 if(d.label==='运营虚拟金币不计主播收益'){
  relocate(d,'host-center.html','主播');d.prerequisites=['主播B具有用户App有效会话','本月只有运营账号A向B成功赠送100虚拟金币普通礼物，无真实金币收益'];d.steps=['打开主播中心','查看本月收益'];d.expected='本月收益为0金币';d.sourceIds.push(ref('host-center.html','本月收益：').标识);
 }
 if(['账号封禁原因留痕','账号解封原因留痕'].includes(d.label))d.excluded='MainBasis要求留痕，但未定义三端日志查看入口；在覆盖清单保留观察缺口，不伪造入口';
 if(d.label==='机审命中不直接处罚'){d.steps.push('打开S1直播详情','查看场次状态');d.expected='S1仍显示直播中';d.sourceIds.push(ref('admin-live-detail.html','状态').标识);}
 if(d.label==='举报不成立不得处罚')d.steps.push('选择举报结论“不成立”','查看可选处置类型');
 if(d.label==='停用公会后所有管理账号不能登录公会端'){d.label='停用公会后原启用账号A不能登录';d.prerequisites.push('公会长A登录账号为guildqa001，正确密码为GuildPass12');d.steps=['打开公会登录','输入账号“guildqa001”','输入密码“GuildPass12”','点击“登录”'];d.expected='账号A不能登录公会端';}
 if(d.label.startsWith('巡房日期相对当前'))d.steps.splice(2,0,'输入开始时间20:00与结束时间21:00');
 if(d.label==='巡房排班停用'){d.steps.push('查看P1状态');d.expected='P1状态显示已停用';}
 if(['公会消息发送给全体主播','公会消息发送给指定主播'].includes(d.label)){d.steps.push('打开刚发送的消息记录','查看接收对象');d.sourceIds.push(ref('guild-message-detail.html','实际接收人数').标识);}
 if(['公会消息正文0字','公会消息正文501字'].includes(d.label)){d.steps=d.steps.filter(s=>s!=='确认接收范围');d.expected=d.label.endsWith('0字')?'不发送空正文消息':'不发送501字消息';}
 if(['选择运营账号取消全选','选择主播取消全选'].includes(d.label))d.prerequisites.push('三个对象当前均已选中');
 if(d.label==='切换语言不改业务资料'){d.steps.push('打开公会资料','查看公会名称');d.expected='公会名称仍为公会A';d.point='语言切换后的公会名称';d.sourceIds.push(ref('guild-profile.html','公会名称：').标识);}
 if(d.label==='公会密码提交后的提示：更新密码为NewPass12'){d.prerequisites.push('当前公会长账号为guildqa001，账号和公会均启用');d.steps.push('打开账号设置','点击“退出登录”','确认退出','输入账号“guildqa001”','输入密码“NewPass12”','点击“登录”');d.expected='进入选择公会页';d.sourceIds.push(ref('guild-settings.html','退出登录').标识,ref('guild-login.html','登录').标识);}
 if(d.label.startsWith('充值退款扣回1100金币')||d.label==='负余额后续充值先抵扣'){d.prerequisites.push('本例充值订单所属账号为A');d.steps=d.steps.filter(s=>s!=='查看账号余额');d.steps.push('打开用户A详情','查看金币余额');d.sourceIds.push(ref('admin-user-detail.html','金币余额：').标识);}
 if(d.label==='充值手动全退原支付渠道退还10USD'){d.label='充值手动退款金额与原实付一致';d.steps.push('查看订单退款金额');d.expected='退款金额为10USD';d.point='全额退款金额';}
 if(d.label==='充值手动全退生成一笔关联R1的退款单'){d.steps.push('打开退款订单列表','查看关联原充值订单R1的记录');d.sourceIds.push(ref('admin-refund-order.html','原充值订单：').标识);}
 if(/^充值退款不回滚/u.test(d.label)){
  const kind=d.label.replace('充值退款不回滚','');const data={礼物消费:['礼物订单C1成功消费60金币','C1已完成消费仍为60金币'],门票消费:['门票订单T1成功消费20金币','T1已完成消费仍为20金币'],主播收益:['礼物消费C1产生主播收益60金币','C1主播收益仍为60金币'],分成:['已上传的原分成批次B1含主播A分成10USD','B1中主播A的原分成仍为10USD']}[kind];
  d.prerequisites.push(data[0]+'，本次没有其他变更');d.expected=data[1];
 }
 if(/^(主播|公会)上传预览不立即入账$/u.test(d.label)){d.steps.push('打开同一管理页面的另一个窗口','查看正式分成记录');d.prerequisites.push('本次批次A首次导入，正式记录中尚无A；另一个窗口使用同一账号会话');d.expected='正式分成列表没有本次批次A记录';}
 if(/^(主播|公会)分成取消预览$/u.test(d.label)){d.steps.push('查看正式分成列表');d.prerequisites.push('本次批次A首次导入，列表没有此前A记录');}
 if(/^(主播|公会)账户汇总只取筛选结果$/u.test(d.label)){d.prerequisites.push('A名称为测试甲，B名称为测试乙，C名称为其他丙；测试环境名称字段支持关键字匹配');d.steps=d.steps.map(s=>s==='输入仅匹配A和B的查询条件'?'输入名称关键词“测试”':s);}
 if(d.label==='处理好友申请选择同意'||d.label==='处理好友申请选择拒绝'){
  d.steps.push('打开好友列表','查看B');d.expected=d.label.endsWith('同意')?'好友列表包含B':'好友列表不包含B';d.sourceIds.push(ref('friend-list.html','当前有效好友').标识);
 }
 if(d.label==='失效好友申请只读')d.expected='该申请的同意按钮和拒绝按钮均不可见';
 if(d.label==='拉黑后双方聊天记录删除'){
  d.steps.push('打开黑名单管理','取消拉黑B','确认取消拉黑','打开B用户主页','点击“私信”','查看历史消息');d.expected='不恢复原私信消息M1';d.sourceIds.push(ref('blacklist-management.html','不恢复').标识);
 }
 if(d.label==='取消拉黑保留关系'){d.steps.push('打开B用户主页','查看好友状态');d.expected='与B仍为好友';d.sourceIds.push(ref('user-home.html','好友').标识);}
 if(d.label==='拉黑主播后限制搜索'){d.steps.push('提交搜索');d.expected='搜索结果不包含主播B';}
 if(d.label.includes('开启免打扰后的通知')){
  d.steps=[`打开${d.entry}`,'启用消息免打扰','查看消息免打扰开关'];d.expected='消息免打扰开关显示开启';d.point='会话通知偏好状态';
 }
 if(d.label.startsWith('群直播卡片对应场次')){
  d.prerequisites.push('A为当前粉丝群有效成员，群内容可访问');if(d.label.endsWith('直播中'))d.prerequisites=d.prerequisites.map(s=>s.replace('，主播可能另有新场S2','，主播尚未结束S1'));
 }
 if(d.label==='主动退团后团籍解除'){d.steps.push('打开我的粉丝团','查看B粉丝团');d.expected='我的粉丝团不再包含B的团';d.sourceIds.push(ref('my-fan-clubs.html','有效团籍').标识);}
 if(d.label==='主动退团后群籍解除'){d.steps.push('查看当前页面');d.expected='当前页面返回消息中心';}
 if(['主动退团后对主播的关注关系保留','退团后重新加入的关注关系'].includes(d.label)){d.steps.push('打开我的关注','查看B');d.expected='我的关注仍包含B';d.sourceIds.push(ref('my-following.html','已关注').标识);}
 if(/^公会登录(正常公会长|账号错误|密码错误|公会长已停用|运营账号)$/u.test(d.label)){
  const wrongAccount=d.label==='公会登录账号错误',wrongPass=d.label==='公会登录密码错误',op=d.label.includes('运营账号');
  const account=op?'opqa001':wrongAccount?'missingqa001':'guildqa001';
  d.prerequisites=[`${op?'运营账号':'公会长'}当前未登录，公会登录页可访问`,wrongAccount?'账号missingqa001在测试环境不存在':`${account}是${op?'公会G创建的运营账号':'平台创建的公会长账号'}，真实密码为GuildPass12；${d.label.includes('已停用')?'账号已停用':'账号已启用，公会G启用'}`];
  d.steps=['打开公会登录',`输入账号“${account}”`,`输入密码“${wrongPass?'WrongPass12':'GuildPass12'}”`,'点击“登录”'];
 }
 if(d.label==='公会初审通过后提交平台终审'){d.steps.push('查看申请J1审核进度');d.expected='J1进入平台待终审阶段';}
 if(d.label==='公会初审通过后申请人仍为普通用户'){
  d.prerequisites=['申请人A已登录用户App','公会长已通过A对G的初审申请J1，平台尚未终审'];d.steps=['打开我的页面','点击“主播中心”'];d.expected='进入申请成为主播页';relocate(d,'host-center-pending.html','用户');d.sourceIds.push(ref(d.page,'仍为普通用户').标识);
 }
 if(['退会通过后当前直播结束','公会关闭开播权限后A的当前直播S1结束'].includes(d.label)){
  const action=d.label.startsWith('退会')?'通过A的退会申请L1':'关闭A直播权限并确认';d.prerequisites=['A原为G的主播，在S1直播','公会长已配合完成'+action];d.steps=['查看A当前直播页面'];d.expected='显示S1直播结束页';relocate(d,'live-end-host.html','主播');d.sourceIds.push(ref(d.page,'结束后关闭').标识);
 }
 if(['退会通过后公会关系解除','移出主播解除公会关系'].includes(d.label)){
  d.steps.push('打开公会成员列表','查看A状态');d.expected='A显示“退会”标记';d.sourceIds.push(ref('guild-member-list.html','状态：').标识);
 }
 if(d.label==='退会驳回后公会关系保留'){d.steps.push('打开公会成员列表','查看A状态');d.expected='A仍显示在会状态';d.sourceIds.push(ref('guild-member-list.html','状态：').标识);}
 if(d.label==='退会驳回后主播身份保留'){
  d.prerequisites=['A是已认证主播，已登录用户App','公会长已驳回A退会申请L1，A仍属于G；账号可用'];d.steps=['打开我的页面','点击“主播中心”'];d.expected='进入主播中心而非申请页';relocate(d,'host-center.html','主播');d.sourceIds.push(ref('profile.html','已具备主播身份').标识);
 }
 if(d.label==='巡房结束后的原门票状态'){
  d.prerequisites=['A为未封禁的巡房账号，当前巡房任务有效','S1为门票房；A未购票，与主播无拉黑且未被踢出'];
  d.steps=['打开巡房任务中的S1','退出巡房会话','打开S1普通分享入口'];d.expected='显示本场购买门票弹窗';relocate(d,'views/live-room/ticket-room-restricted.html','观众');d.sourceIds.push(ref(d.page,'巡房人员').标识);
 }
 if(d.label==='巡房结束后的原拉黑关系'){
  d.prerequisites=['巡房账号A有效，主播B原已拉黑A，S1是普通房；巡房任务有效'];
  d.steps=['打开巡房任务中的S1','退出巡房会话','打开S1普通分享入口'];d.expected='仍被账号拉黑准入限制拦截';relocate(d,'views/live-room/blocked-room-restricted.html','观众');d.sourceIds.push(ref(d.page,'拉黑').标识);
 }
 if(d.label.startsWith('已购门票在')){d.steps.push('打开余额充值','查看A金币余额');d.expected='A金币余额仍为900金币';d.point='门票失效不退款';d.sourceIds.push(ref('recharge.html','金币余额').标识);}
 if(d.label==='更改密码不踢出在线观众'){d.steps.push('打开在线观众列表','查看A在线状态');d.expected='在线列表仍包含A';d.sourceIds.push(ref('views/live-room-host/audience-viewers.html','当前在线').标识);}
 if(/^(主播|房管)取消禁言$/u.test(d.label)){d.steps.push('打开A资料卡','查看本场禁言状态');d.expected='A资料卡没有本场禁言状态';}
 if(/^(主播|房管)取消踢出$/u.test(d.label)){d.steps.push('打开在线观众列表','查看A');d.expected='本场在线列表仍包含A';}
 if(d.label==='恢复发言请求失败保留禁言')d.steps=d.steps.flatMap(s=>s==='确认恢复发言'?['点击第一次“确认”','点击第二次“确认”']:s);
 if(d.label==='已有2名房管后新增'){d.steps.push('确认添加房管','查看房管管理列表');d.expected='房管列表新增A';}
 if(d.label==='接受邀请后B已发出的邀请失效'){d.steps.push('打开连麦主播面板','查看发给E的邀请');d.expected='发给E的原邀请显示失效';}
 if(d.label==='接受邀请后B收到的其他邀请保留'){d.steps.push('打开收到的连麦邀请','查看D邀请');d.expected='仍展示D的邀请';}
 if(d.label==='接受邀请后B不能继续接受其他邀请'){d.steps.push('打开收到的连麦邀请','点击D邀请的“接受”');d.expected='不接受D邀请建立第二个连麦';}
 if(d.label==='接受邀请后B不能再发起邀请'){d.steps.push('打开连麦主播面板','查看邀请入口');d.expected='不提供可执行的新邀请操作';}
 if(d.label==='退出连麦选择确认')d.expected='本方恢复单人直播画面';
 if(d.label==='分享给粉丝群后确认'){d.steps.push('打开粉丝群A','查看刚发出的消息');d.sourceIds.push(ref('fan-group-chat.html','直播卡片：').标识);}
 if(d.label==='分享给好友后确认'){d.steps.push('打开与好友A的单聊','查看刚发出的消息');d.sourceIds.push(ref('direct-message.html','单聊记录').标识);}
 if(d.label==='主动下播后当前连麦失效'){
  d.prerequisites=['主播C与B正在连麦','配合主播B已主动结束S1；当前执行者C的S2仍在播'];d.steps=['打开C主播直播间','查看直播画面'];d.expected='C恢复单人直播画面';relocate(d,'live-room-cohost-active.html','主播');d.sourceIds.push(ref(d.page,'退出连麦确认').标识);
 }
 if(d.label==='主动下播后待处理连麦邀请失效'){
  d.prerequisites=['主播C当前在普通房直播','C向B发出邀请I1后，配合主播B结束S1，C未下播'];d.steps=['打开C连麦主播面板','查看发给B的邀请I1'];d.expected='I1不再处于有效邀请中';relocate(d,'views/live-room-host/cohost-hosts.html','主播');d.sourceIds.push(ref(d.page,'任一方结束直播').标识);
 }
 if(d.label==='主动下播后本场门票失效'){
  d.prerequisites=['观众A为正常账号，与B无拉黑','A购买S1门票后主播B主动结束S1，再开门票房S2；A没有购买S2门票'];d.steps=['打开B新场S2'];d.expected='显示S2购买门票弹窗';relocate(d,'views/live-room/ticket-room-restricted.html','观众');d.sourceIds.push(ref(d.page,'仅对当前直播场次').标识);
 }
 if(d.label==='主动下播后历史收益记录保留'){
  relocate(d,'admin-consumption-order-detail.html','平台管理员');d.prerequisites.push('S1只有成功消费C1产生主播收益100金币，无其他消费');d.steps=['打开S1原消费订单C1详情','查看主播收益'];d.expected='C1主播收益仍为100金币';d.sourceIds.push(ref(d.page,'主播收益：').标识);
 }
 if(d.label==='重复确认结束直播'){
  d.steps.push('打开直播记录','查看S1对应结束记录');d.expected='直播记录中S1仍只有一条场次记录';d.sourceIds.push(ref('live-records.html','已创建且实际开始').标识);
 }
}
for(const [from,to,reason]of [
 ['搜索结果通过直播中的结果进入关联页面','搜索结果主播在播','同一在播搜索结果进入直播间的正向路由'],
 ['粉丝列表通过用户进入关联页面','粉丝列表点击头像','同一粉丝条目进入对应用户主页的正向路由'],
 ['角色权限树勾选父级','角色权限父级勾选联动子级','同一父子权限联动，保留具名菜单路径'],
 ['直播举报已作废保留工单','直播结束使待处理举报作废','同一结束场次待举报自动作废后的列表结果'],
 ['入会流转到终审通过的用户状态','申请结果平台终审通过','同一终审通过后的用户公会关系展示'],
 ['入会流转到终审驳回的用户状态','申请结果平台驳回','同一终审驳回后的用户公会关系展示'],
 ['充值套餐封面必填','充值套餐编辑缺少封面','同一已有套餐删除封面后禁止保存'],
 ['后台重置密码两次不一致','重置后台密码两次不一致','保留含重置密码入口的完整操作路径'],
 ['概要基准1次开奖奖档','概要基准1次开奖理论RTP','把基准档位作为实际测试输入后验证RTP，不假设后台默认配置'],
 ['概要基准10次开奖奖档','概要基准10次开奖理论RTP','基准档位与RTP同一输入路径合并'],
 ['概要基准100次开奖奖档','概要基准100次开奖理论RTP','基准档位与RTP同一输入路径合并'],
 ['群管理（成员）免打扰不影响收信','群管理（成员）开启免打扰后的消息接收','同一成员会话免打扰后接收消息，保留完整启用路径'],
 ['群管理（群主）免打扰不影响收信','群管理（群主）开启免打扰后的消息接收','同一群主免打扰后收信，保留完整启用路径'],
 ['被群禁言后不能发送语音','群单人禁言时使用语音','同一单人群禁言对语音入口的拒绝'],
 ['被群禁言后不能发送图片','群单人禁言时使用图片','同一单人群禁言对图片入口的拒绝'],
 ['历史可见名单排除取消关注粉丝','历史粉丝已取消关注','同一授权选择器过滤取关粉丝'],
 ['历史可见名单排除建立拉黑关系粉丝','历史粉丝已拉黑','同一授权选择器过滤拉黑粉丝'],
 ['历史可见名单排除账号失效粉丝','历史粉丝账号失效','同一授权选择器过滤失效粉丝'],
 ['以房间号搜索','以主播 ID搜索','房间号即主播ID，620100相同输入与路径合并并核查命中B'],
 ['批量购买1份RTP不二次除数量','RTP期望值50%','后台只显示同一配置RTP，无购买数量输入'],
 ['批量购买10份RTP不二次除数量','RTP期望值50%','相同后台配置不能重复伪装批量购买验证'],
 ['批量购买100份RTP不二次除数量','RTP期望值50%','相同后台配置不能重复伪装批量购买验证'],
 ['持有道具已过期','头像框过期不可佩戴','过期头像框同一不可佩戴结果，仅入口写法不同'],
 ['连续签到第4天','连续签到第3天','已超过最大配置2天后的相同末档分支，不重复按天数扩充'],
 ['同场第2次重新进入不重复收费','同场第1次重新进入不重复收费','没有第二次的独立阈值或结果'],
 ['同场第3次重新进入不重复收费','同场第1次重新进入不重复收费','没有第三次的独立阈值或结果'],
 ['分享接收人仍校验封禁','普通房准入优先拦截账号封禁','封禁会话已被下线，删除不可执行的群聊路径，保留实际准入限制']
 ,['团籍因主动退出解除后访问群聊','主动退团删除粉丝群会话入口','退出后不存在旧会话入口，用真实入口移除观察代替虚构打开操作']
 ,['团籍因被移出解除后访问群聊','主播移出删除粉丝群会话入口','被移出后的当前消息中心没有该群入口']
 ,['团籍因拉黑主播解除后访问群聊','拉黑主播删除粉丝群会话入口','拉黑清理后的群入口验证已有明确路径']
 ,['退团后重新加入的粉丝等级','主动退团后粉丝等级清零并重新加入核对','合并到含退出及重新加入的完整等级观察路径']
 ,['退团后重新加入的亲密度','主动退团后亲密度清零并重新加入核对','合并到含退出及重新加入的完整亲密度观察路径']
 ,['公会初审驳回后申请人未加入公会','公会初审驳回后的用户关系','同一初审驳回关系结果以申请人端实际关系页面观察']
 ,['退会通过后主播身份解除','退会批准后主播入口回到申请','身份解除以用户端主播入口重新进入申请页验证']
 ]){const a=designs.find(d=>d.label===from),b=designs.find(d=>d.label===to);if(!a||!b)throw Error('Missing review merge '+from);b.sourceIds=[...new Set([...b.sourceIds,...a.sourceIds])];(b.mergedFrom||=[]).push({label:from,reason});a.excluded='本次复核合并：'+reason+'；保留 '+to;}
