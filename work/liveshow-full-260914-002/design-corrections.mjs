import {designs,page,ref} from './design-cases.mjs';
const put=(d,key,role,steps,word)=>{
 const p=page(key),external=`由${d.role}在${d.entry}完成配合操作：${d.steps.join('；')}`;
 d.prerequisites=[`${role}测试账号已有${p.end}可访问会话`,...d.prerequisites.slice(1),external];
 d.external={角色:d.role,端:d.end,动作:external,时点:'本条查看结果之前',共同对象:d.object};
 Object.assign(d,{end:p.end,page:p.key,entry:p.entry,module:p.module,role,steps,metaIds:p.meta.map(x=>x.标识)});
 d.sourceIds.push(ref(key,word).标识);
};
const pointWords=['已发出的邀请','收到的其他邀请','接受其他邀请','发起邀请','待处理连麦邀请','当前连麦','本场门票','本场禁言','本场踢出','历史消息','历史消费','历史处置','历史收益','服务端消息','本设备公屏','公屏发言','观看本场','赠送礼物','私信','退出公会','公会关系','主播身份','再次开播','处理时间','处理结果','驳回理由','接收人数','好友申请','好友关系','关注关系','粉丝团','团籍','群籍','粉丝等级','亲密度','聊天记录','房管身份','待注销状态','账号数据','默认头像','默认昵称','手机号','登录方式','协议勾选','巡房中','直播内容','拉黑','踢出','禁言','密码房','门票房','门票状态','消息通知','接收该会话','不可输入','账号不能登录','账号不能送礼','虚拟余额','消费记录','发放金币','启停操作','退款单','原支付渠道','状态更新','名称','图标','数量','礼物G','平台终审','普通用户','申请结束','未加入公会'];
const locate=(d,key,word)=>{
 const p=page(key);Object.assign(d,{page:p.key,entry:p.entry,module:p.module,metaIds:p.meta.map(u=>u.标识)});d.sourceIds.push(ref(key,word).标识);
};
for(const d of designs){
 if(d.page==='guild-violation-host-select.html')d.prerequisites.push('从公会违规记录的主播筛选进入本选择器');
 if(d.page==='guild-host-select.html')d.prerequisites.push('从新建运营消息的指定主播入口进入本选择器');
 if(/^admin-(host|guild)-balance-change-record\.html$/u.test(d.page))d.prerequisites=d.prerequisites.map(s=>s.replaceAll('A余额',(d.page.includes('-guild-')?'公会A':'主播A')+'余额'));
 d.steps=d.steps.map(s=>s.replace(/^设置筛选条件/u,'选择筛选条件').replace(/^应用已准备的筛选条件/u,'选择前置条件中仅命中R1和R2的筛选条件').replace(/^应用A和B对应筛选条件/u,'输入可同时命中A和B的名称关键词').replace(/^将全局收益比例改为/u,'输入全局收益比例为').replace(/^设置新密码/u,'输入新密码'));
 if(/单日\d+分钟有效天$/u.test(d.label)&&['guild-home.html','guild-income-day-detail.html','admin-dashboard.html','admin-data-overview.html','admin-daily-statistics.html','admin-host-statistics.html'].includes(d.page)){
  const n=Number(d.label.match(/单日(\d+)分钟/u)[1]),metric=d.page==='admin-host-statistics.html'?'有效天达标人数':d.page.startsWith('admin-')?'达成有效天主播':'达成有效天',unit=d.page==='admin-data-overview.html'?'人次':'人';
  d.steps=[`打开${d.entry}`,`查看${metric}`];d.expected=`${metric}=${n>=180?1:0}${unit}`;d.point='有效天达标人数阈值';
 }
 if(/^(普通礼物|定制礼物|门票)成功消费收入$/u.test(d.label))d.prerequisites.push('C1消费类型为'+d.label.replace('成功消费收入',''));
 if(d.label==='停用后台账号后的登录限制'){d.prerequisites[0]='账号A当前未登录，后台登录页可访问';d.entry='管理后台登录';}
 if(d.label==='登录区号与账号地区分离'){
  d.prerequisites.push('选择后的+62手机号凭证对应同一测试账号A，验证码有效且协议已同意');d.steps.push('输入A对应的有效手机号及验证码','点击“继续”','打开资料编辑','查看账号地区');d.sourceIds.push(ref('profile-edit.html','地区：').标识);
 }
 if(d.label==='冷静期取消注销的清除待注销状态'){
  d.prerequisites.push('账号A关联Google测试账号，授权凭证可用');d.steps.push('打开设置','退出登录','确认退出','打开登录与注册','点击“Google”','确认Google授权并返回App');d.expected='不再显示注销冷静期弹窗';d.sourceIds.push(ref('auth-login-register.html','已有账号登录成功').标识);
 }
 if(/^admin-system-(account-detail|role-detail|role)\.html$/u.test(d.page)&&d.role==='平台管理员'){
  d.role='超级管理员';d.prerequisites=d.prerequisites.map(s=>s.replaceAll('平台管理员','超级管理员'));
 }
 if(['本场禁言不延续下一场','踢出不延续到下一场'].includes(d.label))locate(d,'live-room.html','直播');
 if(d.label.startsWith('分享接收人仍校验')){
  locate(d,'fan-group-chat.html','按房间规则进入');d.prerequisites.push('A是第三方主播C的有效粉丝团成员，已收到C群内的S1直播卡片');d.steps=['打开C的粉丝群聊','点击S1直播卡片'];
 }
 if(d.label==='调整票价不修改在播场次')locate(d,'views/live-room/ticket-room-restricted.html','门票');
 if(d.label.startsWith('冷静期保留')){
  locate(d,'views/auth-login-register/deletion-cooling.html','原有数据');d.label=d.label.replace('冷静期保留','冷静期取消注销后保留');d.steps=d.steps.filter(s=>s!=='打开设置');
 }
 if(d.page==='group-manage-owner.html'&&d.label.includes('免打扰'))d.prerequisites=d.prerequisites.map(s=>s.replace('A有当前粉丝群成员身份','A是当前粉丝群所属主播及群主'));
 if(d.label==='删除好友后双方好友关系解除')d.expected='A主页显示与B不再是好友';
 if(d.label==='删除好友后双方聊天记录清空'){
  d.expected='A与B的原聊天记录不再开放';d.steps.push('返回消息中心','查看与B的原私信会话');d.sourceIds.push(ref('message-center.html','私信').标识);
 }
 if(d.label.startsWith('拉黑后')){
  const follow=d.expected.includes('关注'),friend=d.expected.includes('好友关系'),fan=d.expected.includes('粉丝团'),apply=d.expected.includes('好友申请'),history=d.expected.includes('聊天记录'),chat=d.expected.includes('会话');
  const prep=follow?'A与B原来相互关注':friend?'A与B原为好友':fan?'A原已加入主播B的粉丝团':apply?'B向A发出的好友申请J1待处理':'A与B原有私信会话C1，其中历史消息M1可读';
  d.prerequisites=d.prerequisites.map(s=>s.includes('本条结果涉及')?prep+'；双方初始无拉黑':s);
  const key=follow?'my-following.html':friend?'friend-list.html':fan?'my-fan-clubs.html':apply?'interaction-notifications.html':chat||history?'message-center.html':null;
  if(key){d.steps.push('打开'+page(key).entry);d.expected=follow?'我的关注列表不再包含B':friend?'我的好友列表不再包含B':fan?'我的粉丝团不再包含B的粉丝团':apply?'J1显示已失效':history?'C1原聊天记录不再开放':'私信列表不再包含C1';d.sourceIds.push(ref(key,follow?'关系':friend?'好友':fan?'团籍':apply?'已失效':'私信').标识);}
 }
 if(['主动退团后粉丝等级清零','主动退团后亲密度清零'].includes(d.label)){
  d.prerequisites.push('退出后仍满足当前入团条件且团人数未满');d.steps.push('打开B的粉丝团加入入口','确认加入','查看重新加入后的'+(d.label.includes('亲密度')?'亲密度':'粉丝等级'));d.label+='并重新加入核对';
 }
 if(d.label.match(/^已有[23]名房管后新增$/u))d.prerequisites.push('用户A的实际用户ID为620100');
 d.steps=d.steps.map(s=>s.replace('录制一条语音','通过麦克风输入语音内容“你好”').replace('开启消息免打扰','启用消息免打扰').replace(/^搜索A$/u,'输入账号A的搜索关键词').replace('开启启用开关','启用账号开关').replace('“（留空）”','为空'));
 d.prerequisites=d.prerequisites.map(s=>s.replace(/^打开已创建的记录A，/u,'记录A已创建，'));
 if(d.expected==='显示“新密码不能和旧密码一样”')d.expected='提示文案为“新密码不能和旧密码一样”';
 if(d.expected.startsWith('通知正文为“')){d.prerequisites.push('本条标准文案：'+d.expected.slice('通知正文为'.length));d.expected='通知正文逐字等于本条前置条件中的标准文案';}
 if(d.label==='已结束消费对象保留订单快照'){d.expected='订单扣款金币保持100';d.point='失效对象扣款快照';}
 if(d.label==='奖励流水没有虚构订单详情'){d.expected='不进入充值或消费订单详情';}
 if(d.label.includes('结束时间2026-'))d.prerequisites=d.prerequisites.map(s=>s.replace('礼物为定制类型或套餐为活动类型',d.page.includes('gift')?'礼物类型为定制礼物':d.page.includes('recharge')?'套餐类型为活动套餐':'任务为有明确生效期的登录任务'));
 if(d.page==='admin-monthly-income-expense.html'&&d.label.endsWith('四类收益合计'))d.steps=[`打开${d.entry}`,'查看2026年9月汇总行'];
 if(d.label.startsWith('月度汇总保留'))d.steps.push('查看'+d.label.slice('月度汇总保留'.length)+'月份行');
 if(d.page==='profile-edit.html'&&/^(昵称|签名|地区)长度\d+$/u.test(d.label)){
  const [,field,count]=d.label.match(/^(昵称|签名|地区)长度(\d+)$/u),n=Number(count),max=field==='昵称'?20:field==='签名'?80:30;
  d.prerequisites.push('除本条长度校验外的资料均有效；昵称内容合规检测使用通过的测试响应');d.steps=d.steps.filter(s=>!s.startsWith('查看输入框'));if(!d.steps.some(s=>s==='点击“保存”'))d.steps.push('点击“保存”');
  d.expected=n>max?`不保存超过${max}字的${field}`:n===0&&field==='昵称'?'不保存空昵称':`${field}保存为输入的${n}个字符`;
 }
 if(d.page==='admin-push-detail.html'&&d.point==='推送文案长度'){
  const n=Number(d.label.match(/(\d+)字/u)?.[1]),max=Number(d.expected.match(/(\d+)字/u)?.[1]);
  d.steps=d.steps.filter(s=>s!=='查看输入框');d.steps.push('点击“立即发送”');d.expected=n>max?`不发送超过${max}字的推送文案`:`推送文案可按${n}字提交`;
 }
 if(d.label==='搜索历史删除单条')d.expected='搜索历史内容为A和C';
 if(d.flow==='FLOW-FANCLUB')d.flow='FLOW-FAN-CLUB';
 if(d.flow==='FLOW-LIVE-END')d.flow='FLOW-LIVE';
 if(d.label==='私信和群会话按最后消息排序'){
  d.label='私信会话按最后消息排序';d.prerequisites=d.prerequisites.map(s=>s.replace('群C','私信C'));d.expected='私信C排列在私信B之前';
 }
 if(d.label==='会话时间相同按ID倒序')d.prerequisites=d.prerequisites.map(s=>s.replace('群会话ID1002','私信会话ID1002'));
 if(d.label==='公会消息发送给全体主播')d.expected='生成面向主播A及主播B的消息记录';
 if(d.label.startsWith('主动下播后')){
  const data=d.expected.includes('连麦')?(d.expected.includes('邀请')?'B收到C的待处理邀请I1，B和C均在普通房直播':'B与C正在普通房双主播连麦'):
   d.expected.includes('门票')?'观众A已花100金币购入S1本场门票，当前余额900':d.expected.includes('禁言')?'观众A在S1被禁言，禁言记录M1有效':d.expected.includes('踢出')?'观众A已被S1踢出，踢出记录K1有效':
   d.expected.includes('消费')?'S1成功消费订单C1金额100金币已存在':d.expected.includes('处置')?'S1已有警告处置V1，操作人及处置时间已保存':d.expected.includes('收益')?'S1已形成100金币收益且已保存来源消费记录':'S1正在直播';
  d.prerequisites=d.prerequisites.map(s=>s.includes('存在与该结果相关')?'主播B的S1正在直播；'+data:s);
 }
 if(d.label==='门票成功消费收入'){
  d.prerequisites=d.prerequisites.map(s=>s.replace('单价20金币、数量3','单价20金币、数量1'));
  d.expected='主播收益=20金币';d.calc.变量[1].数值=1;d.calc.最终值=20;
 }
 if(d.page==='auth-login-register.html'&&d.expected.includes('账号已被封禁')){d.expected='封禁账号不能完成登录';d.point='封禁登录限制';}
 if(d.label==='公会搜索清空')d.expected='搜索结果内容为当前可选公会G和H';
 if(d.label.startsWith('运营账号无'))d.point=d.label.includes('签到')?'运营账号签到入口':'运营账号任务入口';
 if(d.page==='guild-join-review.html'&&d.label.includes('归类'))d.expected=d.expected.replace(/^列表仅展示(.+)申请$/u,(_,states)=>'结果中的申请状态仅允许'+states.replaceAll('、','或'));
 if(d.page==='guild-password.html')d.label=d.label.replace(/^修改公会密码：/u,'公会密码提交后的提示：');
 if(d.label==='公会登录公会账号留空')d.label='未填写公会登录账号时提交';
 if(d.point.endsWith('字段'))d.point=d.point.slice(0,-2)+'内容';
 if(d.page.startsWith('admin-')&&d.label===d.point)d.point=d.calc?'指标计算值':/人数|计数|用户|开播|中位/u.test(d.label)?'统计指标值':/退款|消费|金币/u.test(d.label)?'财务统计值':'报表结果范围';
 if(d.page==='views/live-room/profile-moderator-mute.html'&&d.label.startsWith('禁言后')){
  const dm=d.expected.includes('私信');
  put(d,dm?'direct-message.html':'live-room.html','观众',dm?['打开与好友B的私信','输入消息“禁言范围测试”','点击“发送”']:d.expected.includes('发送')?['打开S1直播间','输入公屏消息“禁言范围测试”','点击“发送”']:d.expected.includes('赠送')?['打开S1直播间礼物面板','选择已上架礼物G和数量1','点击“赠送”']:['打开S1直播间','查看直播画面'],dm?'好友之间':'禁言');
 }
 if(d.label==='主播清屏的服务端消息记录仍保留')d.excluded='服务端消息留存需要接口、数据库或日志观察；MainBasis未定义三端历史公屏查询入口，不能冒充界面步骤';
 if(d.label.startsWith('主动下播后历史')){
  if(d.expected.includes('消息'))d.excluded='历史公屏消息留存需要三端外的数据层观察，当前MainBasis没有历史消息查询入口';
  else {const target=d.expected.includes('消费')?'admin-consumption-order.html':d.expected.includes('收益')?'admin-monthly-host-share.html':'admin-live-detail.html';
  put(d,target,'平台管理员',[`打开${page(target).entry}`,d.expected.includes('消费')?'查询原场次S1对应消费订单':'查看原场次S1对应的'+d.expected.replace('保留','')],target.includes('consumption')?'消费':target.includes('share')?'收益':'巡房记录');}
 }
 if(d.label==='停用公会后所有管理账号不能登录公会端')put(d,'guild-login.html','公会长',['打开公会登录','输入该公会原有效账号及正确密码','点击“登录”'],'公会');
 if(d.label==='公会禁用运营账号后账号不能登录'){
  // Operational-account UserApp login entry is not established in MainBasis; retain the observable state here.
  d.expected='账号状态显示已停用';d.label='公会停用运营账号后的状态';d.point='运营账号启停状态';
 }
 if(d.label==='公会禁用运营账号后账号不能送礼')put(d,'views/live-room/gift.html','运营账号',['打开正在直播的场次S1礼物面板','选择普通礼物G','点击“赠送”'],'运营账号');
 if(d.label==='公会重新启用运营账号'){d.expected='账号状态显示已启用';d.point='运营账号启停状态';}
 if(d.label==='运营虚拟金币不计公会分成'){
  d.expected='该笔虚拟赠礼不进入真实金币礼物报表';
  put(d,'admin-monthly-host-earnings.html','平台管理员',['打开主播礼物打赏明细报表','选择该笔送礼日期及主播','点击“查询”'],'虚拟金币');
 }
 if(d.label.startsWith('公会禁用运营账号后历史消费'))d.steps.push('打开该账号送礼记录','查看此前消费记录');
 if(d.label.startsWith('公会关闭开播权限后')&&d.expected.includes('不能再次开播'))put(d,'start-live-settings.html','主播',['打开开播设置','点击“开始直播”'],'权限开启');
 if(d.label==='平台停用运营账号'){d.expected='运营账号状态显示停用';d.point='平台运营账号状态';}
 if(d.label==='平台锁定公会管理权限运营账号'){
  put(d,'guild-operation-account-detail.html','公会长',['打开运营账号A详情','查看启停及金币发放操作'],'锁定');d.expected='启停及金币发放操作不可用';
 }
 if(d.label==='平台解除公会管理权限锁定运营账号'){
  put(d,'guild-operation-account-detail.html','公会长',['打开运营账号A详情','查看启停及金币发放操作'],'锁定');d.expected='启停及金币发放操作恢复可用';
 }
 if(d.label==='停用普通后台账号'){
  d.expected='账号A状态显示停用';d.point='后台账号启停状态';d.steps.push('查看A状态');
 }
 if(d.label==='停用普通后台角色'){
  put(d,'admin-system-account.html','后台账号B',['打开管理后台','查看角色A原授予的菜单入口'],'角色');d.expected='不展示仅由角色A授予的菜单';
 }
 if(d.label==='角色权限保存应用到关联账号'){
  put(d,'admin-system-account.html','后台账号A',['打开管理后台','查看用户管理菜单'],'角色');d.expected='显示用户管理菜单';
 }
 if(['停用普通后台角色','角色权限保存应用到关联账号'].includes(d.label))locate(d,'admin-dashboard.html','平台管理员');
 if(d.label.startsWith('房管授权后')){
  const relation=d.label.slice('房管授权后'.length);d.prerequisites.push('配合账号已完成'+relation+'并确认提交');d.role='主播';d.steps=['打开房管管理','查看A房管授权'];d.expected='列表不再显示A的房管授权';
 }
 if(d.label==='解除拉黑不恢复房管')d.steps.push('打开房管管理','查看A房管授权');
 if(d.label==='两次确认后A恢复本场公屏发言权限')put(d,'views/live-room/comment-muted.html','观众',['打开S1直播间','输入公屏消息“恢复发言测试”','点击“发送”'],'解除禁言');
 if(d.label==='一方下播结束连麦但不结束对方直播'){
  d.prerequisites.push('主播B已结束S1，当前执行账号为对端主播C');d.steps=['打开C的主播直播间','查看S2状态'];
 }
 if(d.label.startsWith('修改后重进输入')){
  const p=page('views/live-room/password-room-restricted.html');d.page=p.key;d.entry=p.entry;d.module=p.module;d.metaIds=p.meta.map(u=>u.标识);d.sourceIds.push(ref(p.key,'密码').标识);
 }
 if(d.label.startsWith('拉黑主播后限制')){
  const action=d.label.replace('拉黑主播后限制','');
  d.steps=action==='搜索'?['打开全局搜索','输入主播B的实际ID']:action==='观看直播'?['打开B当前场次S的分享链接']:['打开已留存的B主播主页','查看'+action+'入口'];
  if(action==='搜索'){const p=page('search.html');d.page=p.key;d.entry=p.entry;d.module=p.module;d.metaIds=p.meta.map(u=>u.标识);d.sourceIds.push(ref(p.key,'搜索').标识);}
 }
 if(d.label==='退会驳回后主播可重新提交退会申请')put(d,'guild-leave-application.html','主播',['打开当前公会退会申请','输入原因“个人原因”','点击“提交”'],'公会驳回');
 if(d.label==='退会审核详情显示处理时间')d.expected='处理时间对应2026-09-14 10:00';
 if(d.label==='退会审核详情显示处理结果')d.expected='处理结果显示已驳回';
 if(d.label.includes('公会长后该公会主播'))d.steps.push('打开主播B详情','查看'+(d.expected.includes('权限')?'开播权限':'主播身份'));
 if(d.label==='停用公会后各管理账号自身启停值保留')d.steps.push('打开G1公会详情','查看管理账号A与B的启停状态');
 if(d.label==='停用公会后旗下主播公会关系解除')d.steps.push('打开主播C详情','查看当前公会关系');
 if(d.page==='settings.html'&&d.expected==='当前账号仍可接收该会话消息')d.steps.push('查看该会话的新消息');
 if(d.point==='单条评论范围')d.point=d.expected.includes('M1')?'所选评论可见性':'其他评论可见性';
 if(d.point==='本设备清屏')d.point=d.expected.includes('服务端')?'历史消息留存':'本设备消息可见性';
 if(d.point==='免打扰边界'){d.point=d.expected.includes('接收')?'会话消息接收':'会话通知开关';d.prerequisites.push('另一有效成员在免打扰启用后发送测试消息M2');d.steps.push('返回对应会话并查看消息M2');}
 // Point names describe the observable object; they do not turn contradictory expectations into separate coverage.
 const groups=['首次资料处理','登录表单恢复','注销恢复选择','巡房会话准入','巡房人员保护','巡房临时身份隔离','禁言影响范围','恢复发言提交','接受邀请关联状态','连麦房型约束','场次结束关联结果','删除好友影响','失效申请入口','账号拉黑关联清理','拉黑权限联动','群内禁言限制','主动退团联动','重新入团重置','公会初审分流','公会退会批准','退会驳回','退会处理快照','公会关闭开播权限','公会消息发送范围','充值整单退款','注销账号历史榜单','创建时发放边界','运营账号停用影响','运营账号管理锁定','虚拟与真实账务隔离','公会长账号独立状态','公会停用范围','快捷充值恢复','系统类型保护'];
 if(groups.includes(d.point)){
  const noun=pointWords.find(w=>d.expected.includes(w));
  if(noun)d.point=noun.replace(/^.*不能/u,'')+'状态';
 }
}
