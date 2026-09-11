import { scenario as s, observe as o, navigation as nav, refs, textBoundary, numbers, required, context } from './design.mjs';
import { reviewed } from './basic-design.mjs';
const r=(p,n)=>refs(p,n);
const all=(p,n,why,links)=>{context(r(p,n),why,links);reviewed(r(p,n));};

for(const [kind,provider] of [['Google','Google'],['Facebook','Facebook'],['Apple ID','Apple'],['TikTok','TikTok']]){
  const id=`U-auth-login-register-${{Google:'002',Facebook:'003','Apple ID':'004',TikTok:'005'}[kind]}`;
  const env=kind==='Apple ID'?['设备为 iOS']:[];
  s([id,...r('U-auth-login-register','009,017')],`${kind}未同意协议拦截`,[...env,'未勾选用户协议和隐私政策'],[`点击「${kind}」`],'提示先同意《用户协议》和《隐私政策》',{type:'异常用例'});
  s([id,...r('U-auth-login-register','010,018')],`${kind}授权入口`,[...env,'已勾选当前版本协议'],[`点击「${kind}」`],`唤起${provider}授权`,{priority:'P0'});
  for(const fresh of [true,false])s([id,'U-auth-login-register-011'],`${kind}${fresh?'新':'已有'}账号分流`,[...env,'已勾选当前版本协议',`${provider}账号标识${fresh?'未关联':'已关联'} Luma Live 账号`],[`点击「${kind}」`,`完成${provider}授权`],`页面进入${fresh?'资料补全':'首页'}`);
  for(const [state,prompt] of [['用户取消授权','已取消授权'],['授权失败','登录失败，请重试']])s([id,'U-auth-login-register-012','U-auth-login-register-019'],`${kind}${state}提示`,[...env,'已勾选当前版本协议',`${provider}授权流程可返回${state}`],[`点击「${kind}」`,`在授权流程触发${state}`],`提示“${prompt}”`,{type:'异常用例'});
}
o(r('U-auth-login-register','004,015'),'Android 登录方式',['设备为 Android'],'登录方式中不展示 Apple ID');
s(r('U-auth-login-register','011'),'新账号自动建档',['第三方账号从未关联 Luma Live','已同意当前版本协议'],['点击「Google」','完成首次授权'],'新账号获得系统生成的用户 ID',{priority:'P0'});
s(r('U-auth-login-register','012'),'无有效标识不建立会话',['第三方授权返回空账号标识','已同意当前版本协议'],['点击「Google」','完成授权回调'],'账号仍处于未登录状态',{type:'异常用例'});
s(r('U-auth-login-register','013,020'),'封禁账号登录拦截',['已有账号被平台封禁','已同意协议且 Google 凭证有效'],['点击「Google」','完成授权'],'提示“账号已被封禁”',{type:'异常用例'});
nav('U-auth-login-register-022','手机号登录','手机号登录');nav('U-auth-login-register-023','邮箱','邮箱登录');
s(r('U-auth-login-register','008,024'),'游客进入无需协议',['未勾选协议'],['点击「游客进入」'],'以游客身份进入首页');
for(const target of ['首页','主播榜','贡献榜','福利页','邀请好友页'])s('U-auth-login-register-016',`游客浏览${target}`,['当前为游客'],[`打开「${target}」`],`展示「${target}」内容`,{role:'游客'});
for(const target of ['直播间','搜索','消息','我的'])s(['U-auth-login-register-016','U-live-plaza-009'],`游客点击${target}转登录`,['当前为游客'],[`在首页点击「${target}」`],'页面进入登录与注册页',{role:'游客',page:'live-plaza.html'});
for(const status of ['Google 授权成功','手机号凭证验证成功','邮箱凭证验证成功']){
  const page=status.startsWith('Google')?'auth-login-register.html':status.startsWith('手机号')?'auth-phone-login.html':'auth-email-login.html';
  s(['U-auth-login-register-014','U-auth-login-register-021',...(page==='auth-phone-login.html'?r('U-auth-phone-login','008,013'):page==='auth-email-login.html'?r('U-auth-email-login','006,010'):[])],`${status}命中注销冷静期`,['账号提交注销后尚未满七日'],[status.startsWith('Google')?'点击「Google」并完成授权':`填写有效${status.startsWith('手机号')?'手机号':'邮箱'}和验证码，勾选协议后点击继续`],'展示注销冷静期弹窗',{page});
}
o('U-views_auth-login-register_deletion-cooling-002','可取消截止时间',['注销申请提交于9月1日12:30，当前仍在冷静期'],'可取消截止时间显示09/08 12:30');
for(const [button,result] of [['暂不取消','弹窗关闭后停留登录与注册页'],['取消注销','页面进入首页']])s(['U-views_auth-login-register_deletion-cooling-007','U-settings-023'],`${button}处理冷静期`,['账号仍处于七日冷静期'],[`点击「${button}」`],result,{page:'views_auth-login-register_deletion-cooling'});
for(const item of ['账号资料','金币资产','关注关系','好友关系','聊天记录','创建的粉丝团'])s(['U-views_auth-login-register_deletion-cooling-004','U-views_auth-login-register_deletion-cooling-006'],`取消注销后保留${item}`,[`注销申请前已记录${item}`,'账号处于七日冷静期'],['点击「取消注销」',`查看原有${item}`],`${item}与提交注销前一致`,{page:'views_auth-login-register_deletion-cooling'});
textBoundary('U-auth-profile-completion-003','昵称',20,{required:true});
s(['U-auth-profile-completion-002','U-auth-profile-completion-006'],'跳过资料补全保留默认资料',['账号为首次授权的新账号'],['点击「跳过」','进入「我的」页'],'头像和昵称仍为系统默认资料');
for(const [prefix,identity] of [['U-auth-phone-login','手机号'],['U-auth-email-login','邮箱']]){
  const phone=identity==='手机号',code=phone?'004':'003',button=phone?'010':'008';
  o(`${prefix}-${phone?'006':'005'}`,`${identity}默认登录方式`,[],`默认显示${phone?'短信':'邮箱'}验证码登录表单`);
  for(const method of ['密码','验证码'])s(`${prefix}-${phone?'012':'009'}`,`${identity}切换${method}登录`,[],[`点击「使用${method==='密码'?'密码登录':phone?'短信验证码登录':'邮箱验证码登录'}」`],`显示${method}输入字段`);
  for(const method of ['密码','验证码'])s(`${prefix}-${button}`,`${identity}${method}登录成功`,[`已注册且未封禁的账号具备有效${identity}和${method}`],[`选择${method}登录`,`填写账号${identity}和有效${method}`,'勾选协议','点击「继续」'],'页面进入首页',{priority:'P0'});
  for(const absent of [identity,'协议'])s(`${prefix}-${button}`,`${identity}登录缺少${absent}`,['其余登录条件已满足'],[absent==='协议'?'取消勾选协议':`清空「${identity}」`],'继续按钮不可用',{type:'异常用例'});
  required(`${prefix}-${phone?'005':'004'}`,['密码'],'继续');
  for(const len of [0,5,6,7])s(`${prefix}-${code}`,`${identity}验证码${len}位`,[`已注册${identity}可接收验证码`],[len?`在验证码输入框输入${len}位数字`:'清空验证码输入框',...(len===6?[]:['查看继续按钮可用状态'])],len===6?'验证码字段接受6位数字':`未形成6位验证码时不能继续登录；超过长度的输入不得作为7位验证码提交`,{type:'逻辑校验'});
  s(`${prefix}-${code}`,`${identity}验证码非数字`,[`已注册${identity}可接收验证码`],['在验证码输入框输入「12345a」'],'验证码不接受非数字输入',{type:'异常用例'});
  for(const elapsed of [299,300,301])s(`${prefix}-${code}`,`${identity}验证码${elapsed}秒有效期`,['已获取正确验证码',`验证码从生成时起已过去${elapsed}秒`],['输入该验证码','勾选协议','点击「继续」'],elapsed<300?'使用该验证码登录后进入首页':'该验证码已过期，不能用于登录',{type:'逻辑校验'});
  for(const errs of [4,5])s(`${prefix}-${code}`,`${identity}验证码连续${errs}次错误`,[`同一验证码尚在5分钟有效期内`,`已连续提交错误验证码${errs}次`],['输入该次发放的正确验证码','勾选协议','点击「继续」'],errs===4?'使用该验证码登录后进入首页':'当前验证码已失效，不能用于登录',{type:'逻辑校验'});
  for(const elapsed of [0,59,60])s(`${prefix}-${phone?'009':'007'}`,`${identity}验证码重发${elapsed}秒`,[`有效${identity}已成功发送验证码`,`距发送已过去${elapsed}秒`],['查看「获取验证码」按钮'],elapsed<60?'获取验证码按钮不可用':'获取验证码按钮可再次使用',{type:'逻辑校验'});
}
for(const n of [7,8,15,16])s('U-auth-phone-login-003',`手机号${n}位范围`,[],[`在手机号输入框输入${n}位数字`,'查看获取验证码按钮'],n>=8&&n<=15?`获取验证码不因手机号长度${n}位而被阻止`:`${n}位手机号不能通过长度校验并用于获取验证码`,{type:'逻辑校验'});
s('U-auth-phone-login-003','手机号非数字限制',[],['在手机号输入框输入「1234567a」'],'手机号字段不接受非数字输入',{type:'异常用例'});
for(const value of ['test@example.com','testexample.com','test@','@example.com'])s('U-auth-email-login-002',`邮箱格式${value}`,[],[`输入邮箱「${value}」`],value==='test@example.com'?'该邮箱可用于获取验证码':'该邮箱格式无效，不能获取验证码',{type:'逻辑校验'});
for(const device of ['无法识别地区','设备地区为中国大陆'])o(['U-auth-phone-login-002','U-auth-country-select-004'],`${device}默认区号`,[device],'当前选中区号为印度尼西亚 +62',{page:'auth-country-select.html'});
o(['U-auth-phone-login-002','U-auth-country-select-003','U-auth-country-select-005'],'中国大陆区号排除',[],'可选列表不包含中国大陆 +86',{page:'auth-country-select.html'});
o('U-auth-country-select-003','地区列表结构',[],'全部地区统一展示国旗、地区名称和区号，无常用地区分组');
for(const keyword of ['印度尼西亚','+62','不存在的地区名称'])s(['U-auth-country-select-002','U-auth-country-select-007','U-auth-country-select-009'],`地区搜索${keyword}`,[],[`输入搜索词「${keyword}」`],keyword==='不存在的地区名称'?'显示无结果空状态':'结果仅显示印度尼西亚 +62');
s('U-auth-country-select-009','清空地区搜索',[],['输入「+62」','清空搜索框'],'恢复全部业务支持地区列表');
s(['U-auth-phone-login-007','U-auth-phone-login-011','U-auth-country-select-010'],'选择区号保留表单',['手机号已输入8位数字','当前为密码登录且已勾选协议'],['点击区号','选择印度尼西亚 +62'],'返回后手机号、密码登录方式和协议勾选状态保留',{page:'auth-phone-login.html'});
s('U-auth-country-select-011','返回不修改区号',['原区号为 +62'],['点击返回'],'手机号登录页仍使用 +62');
s('U-auth-country-select-006','更换区号不改资料地区',['账号资料地区已填写'],['选择另一个支持的区号','完成登录后查看资料地区'],'账号资料地区保持更换区号前的值');

o('U-profile-edit-002','用户 ID 只读',['当前账号已创建'],'用户 ID 不提供编辑能力');
for(const [id,field,limit,need] of [['005','昵称',20,true],['006','签名',80,false],['008','地区',30,false]])textBoundary(`U-profile-edit-${id}`,field,limit,{required:need,blockInput:true});
for(const name of ['背景图','头像']){
  const id=name==='头像'?'U-profile-edit-004':'U-profile-edit-003';
  s(id,`${name}不接受非图片`,[],[`上传文本文件作为${name}`],`${name}不接受该文件`,{type:'异常用例'});
  s(id,`${name}为可选项`,['其他必填资料为合法值'],[`保留${name}未修改`,'点击保存'],'资料保存不因未修改该图片而被阻止');
}
for(const gender of ['男','女','不公开'])s('U-profile-edit-007',`性别选择${gender}`,[],[`选择性别「${gender}」`,'点击保存'],`性别回显「${gender}」`);
for(const offset of [-1,0,1])s('U-profile-edit-009',`生日${offset<0?'早于':offset===0?'等于':'晚于'}今天`,[],[`选择${offset<0?'昨天':offset===0?'今天':'明天'}作为生日`,'点击保存'],offset<=0?'生日保存为所选日期':'未来日期不能作为生日保存',{type:'逻辑校验'});
for(const field of ['头像','昵称']){
  s('U-profile-edit-012',`${field}修改进入检测`,[],[field==='头像'?'选择一张可读取图片':'填写一个合法新昵称','点击保存'],'资料合规检测期间显示 loading');
  for(const [status,expected] of [['通过',`${field}保存为本次修改值`],['不通过','提示“头像或昵称不合规”'],['网络异常','提示“网络异常，请重试”']])s(['U-profile-edit-010','U-profile-edit-013','D-SYS-044'],`${field}检测${status}`,['测试环境可使本次合规检测返回'+status],[field==='头像'?'选择一张可读取图片':'填写一个合法新昵称','点击保存'],expected,{type:status==='通过'?'业务流程':'异常用例'});
  for(const status of ['不通过','网络异常'])s('U-profile-edit-010',`${field}检测${status}保留输入`,['测试环境可使本次合规检测返回'+status],[field==='头像'?'选择一张可读取图片':'填写一个合法新昵称','点击保存'],`编辑区域仍保留本次${field}输入`,{type:'异常用例'});
}
for(const [entry,target] of [['编辑资料','资料编辑'],['设置','设置'],['充值','余额充值'],['我的装扮','我的装扮'],['粉丝团','我的粉丝团'],['邀请奖励','邀请好友'],['黑名单','黑名单管理'],['联系客服','客服会话'],['公会中心','公会中心']])nav(r('U-profile','010-020').filter(id=>id!== 'U-profile-016'&&id!=='U-profile-017'),entry,target);
for(const entry of ['开始直播','主播中心'])for(const host of [true,false])s(r('U-profile','016,017'),`${entry}${host?'主播':'普通用户'}分流`,[host?'账号已有主播身份':'账号尚无主播身份'],[`点击「${entry}」`],`页面进入「${host?'主播中心':'申请成为主播'}」`);
for(const [count,point,relation] of [[2,'好友数','双向有效好友'],[3,'关注数','当前仍关注的账号'],[4,'粉丝数','当前仍关注我的账号']])o('U-profile-004',point,[`仅存在${count}个${relation}`],`${point} = ${count}`);
for(const n of [0,1,5])o('U-profile-003',`个人页勋章${n}枚`,[`当前有${n}枚有效且已佩戴勋章`],n?`昵称下方显示${n}枚勋章且不保留空位`:'勋章区域隐藏');
for(const [name,target] of [['好友数','好友列表'],['粉丝数','粉丝列表'],['关注数','我的关注']])nav('U-profile-008',name,target);
for(const lang of ['中文','English','Bahasa Indonesia','Bahasa Melayu'])s(['U-settings-005','U-settings-015'],`用户端切换${lang}`,[],['点击语言',`选择「${lang}」`],`当前界面使用${lang}`);
o('U-settings-005','用户端默认语言',['账号尚未修改语言设置'],'当前语言为 Bahasa Indonesia');
s(['U-settings-009','U-settings-024'],'退出登录二次确认取消',[],['点击退出登录','点击取消'],'当前账号仍保持登录');
s(['U-settings-009','U-settings-024'],'退出登录确认',[],['点击退出登录','点击确认'],'页面返回登录与注册页');
for(const state of ['未开启','已拒绝','已开启'])o('U-settings-003',`系统通知${state}`,[`当前设备系统通知权限为${state}`],`系统通知显示${state}`);
for(const preference of ['开播提醒','互动通知'])s(['U-settings-004','U-settings-011'],`${preference}独立开关`,['当前已授予系统通知权限'],[`关闭「${preference}」`],`仅${preference}分类偏好关闭`);
s(['U-settings-010','U-views_settings_notification-default-003'],'拒绝系统推送保留站内通知',['设备未授权系统通知','平台已向当前账号发送一条系统通知'],['进入消息中心','打开系统通知'],'站内仍可查看该系统通知',{page:'settings.html'});
nav('U-settings-006','用户协议','当前有效版本用户协议');nav('U-settings-006','隐私政策','当前有效版本隐私政策');
for(const b of ['暂不开启','前往设置'])s(['U-settings-017','U-views_settings_notification-denied-005'],`通知已拒绝选择${b}`,['当前设备系统通知权限已拒绝'],['点击系统通知',`点击「${b}」`],b==='暂不开启'?'前往系统设置提示关闭':'打开手机系统设置',{page:'settings.html'});
s('U-views_settings_notification-granted-005','已授权通知提示',['当前设备已授予通知权限'],['点击系统通知'],'提示“系统通知已开启”');
for(const amount of [99,100])o(amount<100?'U-settings-021':'U-settings-020',`注销余额${amount}按钮`,[`当前金币余额为${amount}`],amount<100?'注销确认弹窗提供“确认注销、取消”':'注销提示弹窗提供“查看余额、取消”',{page:'settings.html',fullSteps:true,steps:['进入设置页','点击注销账号']});
s(['U-settings-021','U-settings-022'],'注销倒计时取消',['当前金币余额99，已展示可确认注销弹窗'],['点击确认注销','在10秒倒计时结束前点击取消'],'本次注销申请未提交',{page:'settings.html'});
s(['U-settings-021','U-settings-022'],'注销倒计时完成',['当前金币余额99，已展示可确认注销弹窗'],['点击确认注销','等待10秒倒计时结束'],'退出到登录与注册页',{page:'settings.html'});

required('G-guild-login-001',['公会账号'],'登录');required('G-guild-login-002',['密码'],'登录');
for(const wrong of ['账号不存在','密码错误'])s('G-guild-login-005',`公会登录${wrong}`,[wrong],['输入公会长账号和密码','点击登录'],'提示“账号或密码错误”',{type:'异常用例'});
s('G-guild-login-005','公会长登录成功',['公会和公会长账号均启用','已知正确账号和密码'],['输入账号和密码','点击登录'],'进入「选择公会」页',{priority:'P0'});
for(const reason of ['公会长账号停用','使用运营账号'])s(r('G-guild-login','003,004'),`公会登录拒绝${reason}`,[reason],['输入对应账号及密码','点击登录'],'无法建立公会端登录会话',{type:'异常用例'});
o('G-guild-switch-003','可管理公会范围',['账号仅可管理一个未解散公会','同时存在无管理权限公会和已解散公会'],'列表仅显示可管理且未解散的公会');
s('G-guild-switch-004','切换当前公会',['账号可管理两个公会'],['选择与当前不同的公会'],'首页显示新选公会的数据');
// 同页语句已分别拆分；这里只承接重复入口或身份定义。
all('U-auth-login-register','001-024','登录授权、游客和冷静期分支已按提供方及状态分别设计');
all('U-auth-phone-login','001-013','手机号、凭证、区号恢复和冷静期各分支已拆分');
all('U-auth-email-login','001-010','邮箱、凭证与冷静期各分支已拆分');
all('U-auth-country-select','001-011','搜索、可选范围、默认区号和返回保留已拆分；排序仍关联 Q037');
all('U-profile-edit','001-014','字段、内容检测成功失败及输入保留已拆分');
all('U-settings','001-024','设置和注销明确分支已拆分；原文待确认和演示项保留独立去向');
all('G-guild-login','001-005','登录成功、字段缺失及身份状态拒绝已拆分');
all('G-guild-switch','001-004','字段、可管理范围和切换结果已拆分');
