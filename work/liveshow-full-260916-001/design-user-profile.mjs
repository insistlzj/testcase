import {test,P0,P1,P2,ERR,enter} from './case-design.mjs';
const profile='profile.html',edit='profile-edit.html',settings='settings.html';
for(const [field,value]of [['昵称','QA-Nadia'],['用户 ID','1002001'],['财富等级','5']])test(profile,['用户资料：'],'普通用户',`我的页面展示本人${field}`,`本人${field}回显`,[`当前账号${field}为${value}`],[enter(profile)],`${field}显示${value}`,P2);
for(const [label,value]of [['粉丝数',3],['关注数',4],['好友数',2]])test(profile,['社交数据：'],'普通用户',`我的页面按现存关系统计${label}`,`当前${label}`,[`当前账号${label}对应有效关系共${value}条，另有1条已解除的历史关系`],[enter(profile)],`${label}显示${value}`,P1);
for(const [count,expected]of [[0,'隐藏勋章区域'],[3,'显示3个已佩戴且有效的勋章'],[5,'显示5个已佩戴且有效的勋章']])test(profile,['最多展示 5 个'],'普通用户',`我的页面佩戴${count}个有效勋章`,'个人页勋章展示范围',[`当前账号有${count}个有效已佩戴勋章，另有1个过期勋章`],[enter(profile)],expected,P2);
for(const [button,destination]of [['编辑资料','资料编辑页'],['设置','设置页'],['充值','余额充值页'],['我的装扮','我的装扮页'],['粉丝团','我的粉丝团页'],['公会中心','公会中心页'],['黑名单','黑名单管理页'],['联系客服','联系客服页'],['好友数','好友列表页'],['粉丝数','粉丝列表页']])test(profile,[button],'普通用户',`我的页面进入${button}`,`${button}个人入口`,[],[enter(profile),`点击|${button}`],`进入${destination}`,P2);
for(const host of [false,true])test(profile,['未获得主播身份','主播中心'],'普通用户',`${host?'已认证主播':'未认证用户'}打开主播中心`,'主播中心身份分流',[`账号${host?'已获得':'尚未获得'}主播身份`],[enter(profile),'点击|主播中心'],host?'进入主播中心页':'进入申请成为主播页',P1);
test(edit,['用户 ID：'],'普通用户','资料编辑不能修改系统用户ID','用户ID只读',['当前用户ID为1002001'],[enter(edit),'点击|用户ID字段'],'用户ID不可编辑',P1);
for(const [field,limit]of [['昵称',20],['签名',80],['地区',30]]){
  test(edit,[`${field}：`,'达到最大长度'],'普通用户',`${field}输入达到${limit}字符` ,`${field}最大长度`,[],[enter(edit),`填写|${field}|为${'A'.repeat(limit)}`,`输入|${field}|末尾再添加B`],`${field}仍为${limit}个A`,P1);
  test(edit,[`${field}：`],'普通用户',`${field}输入1个字符` ,`${field}最短非空输入`,[],[enter(edit),`填写|${field}|为A`],`${field}显示A`,P2);
}
test(edit,['昵称为空 -> 保存按钮不可用'],'普通用户','清空昵称禁止保存','空昵称保存入口',[],[enter(edit),'清空|昵称'],'保存按钮不可用',P1);
for(const field of ['背景图','头像'])test(edit,[`${field}：`],'普通用户',`${field}上传非图片` ,`${field}资源类型`,['本地准备内容为文本的not-image.txt文件'],[enter(edit),`上传|${field}|选择not-image.txt`],`${field}不采用该文本文件`,P1);
for(const sex of ['男','女','不公开'])test(edit,['性别：'],'普通用户',`资料性别保存为${sex}`,'性别枚举保存',[],[enter(edit),`选择|性别|为${sex}`,'点击|保存',enter(edit)],`性别显示${sex}`,P2);
test(edit,['不得晚于当前日期'],'普通用户','生日选择明天','未来生日拦截',['测试设备当前日期为2026年9月16日'],[enter(edit),'选择|生日|为2026年9月17日'],'不能采用晚于当前日期的生日',P1);
test(edit,['不得晚于当前日期'],'普通用户','生日选择今天','生日上界保存',['测试设备当前日期为2026年9月16日'],[enter(edit),'选择|生日|为2026年9月16日','点击|保存',enter(edit)],'生日显示2026年9月16日',P1);
for(const field of ['头像','昵称']){
  test(edit,['保存后显示 loading'],'普通用户',`${field}变更保存过程中的校验状态`,`${field}风控处理中`,['环境准备：可让资料风控检测处于处理中；执行前需提供该能力'],[enter(edit),field==='头像'?'上传|头像|选择测试图片A.png':'填写|昵称|为QA-New','点击|保存'],'显示资料合规校验的加载状态',P1);
  test(edit,['校验成功 -> 直接保存'],'普通用户',`${field}风控通过后生效`,`${field}风控通过保存`,['环境准备：该测试资料风控结果为通过'],[enter(edit),field==='头像'?'上传|头像|选择测试图片A.png':'填写|昵称|为QA-New','点击|保存',enter(profile)],field==='头像'?'个人头像显示测试图片A':'个人昵称显示QA-New',{...P1,observe:profile,extra:[[profile,'用户资料：']],transition:'ST-profile-pass'});
  test(edit,['头像或昵称不合规'],'普通用户',`${field}风控拒绝时提示原因`,`${field}风控拒绝提示`,['环境准备：该测试资料风控结果为不通过'],[enter(edit),field==='头像'?'上传|头像|选择测试图片A.png':'填写|昵称|为QA-New','点击|保存'],'提示“头像或昵称不合规”',{...ERR,transition:'ST-profile-reject'});
}
test(edit,['网络异常，请重试'],'普通用户','资料保存网络失败提示重试','资料保存网络失败提示',['环境准备：可使本次资料保存请求发生网络错误；执行前需提供该能力'],[enter(edit),'填写|昵称|为QA-New','点击|保存'],'提示“网络异常，请重试”',ERR);
test(edit,['网络异常时保留编辑内容'],'普通用户','资料保存失败保留新昵称草稿','资料失败草稿保持',['环境准备：资料保存请求本次失败'],[enter(edit),'填写|昵称|为QA-New','点击|保存'],'昵称输入框仍为QA-New',ERR);
for(const [field,expected]of [['手机号','已隐藏号码中间部分'],['邮箱','已隐藏邮箱账号部分']])test(settings,[`${field}：`],'普通用户',`设置页脱敏展示已绑定${field}`,`${field}脱敏范围`,[`当前账号已绑定${field}`],[enter(settings)],`${field}显示内容${expected}`,P2);
test(settings,['手机号：'],'普通用户','设置页绑定手机号保留国家区号','绑定手机号国家区号',['当前账号绑定+62国家区号手机号'],[enter(settings)],'绑定手机号显示+62国家区号',P2);
for(const [state,expected]of [['已设置密码','显示“修改密码”入口'],['未设置密码但已绑定手机号','显示可点击的“设置密码”入口'],['仅第三方登录且未绑定手机和邮箱','“设置密码”入口不可用']])test(settings,['密码已设置','第三方登录且两者均未绑定'],'普通用户',`${state}时查看密码入口`,'密码入口账号条件',[state],[enter(settings)],expected,P1);
test(settings,['不展示密码内容'],'普通用户','设置页不回显登录密码','登录密码保密',['账号测试密码为QaTest!2026'],[enter(settings)],'页面不显示QaTest!2026',P1);
for(const lang of ['中文','English','Bahasa Indonesia','Bahasa Melayu'])test(settings,['选择后立即更新当前语言'],'普通用户',`设置语言为${lang}`,'应用语言切换',[],[enter(settings),'点击|语言',`选择|${lang}`],`当前语言显示${lang}`,P2);
test(settings,['默认 Bahasa Indonesia'],'普通用户','初次使用默认印尼语','默认应用语言',['全新安装且未选择过应用语言'],[enter(settings)],'语言显示Bahasa Indonesia',P2);
for(const [state,expected]of [['未申请','显示系统通知授权弹窗'],['已拒绝','显示前往手机系统设置的提示'],['已授权','系统通知状态显示已开启']])test(settings,['系统通知'],'普通用户',`通知权限${state}时进入设置`,'系统通知权限引导',[`设备系统通知权限${state}`],[enter(settings),'点击|系统通知'],expected,P2);
for(const balance of [-1,0,99,100,101])test(settings,['金币余额不少于 100','金币余额低于 100'],'普通用户',`余额${balance}金币申请注销`,'注销余额门槛',[`当前真实金币余额为${balance}`],[enter(settings),'点击|注销账号'],balance<100?'显示“确认注销”按钮':'显示“查看余额”按钮',P1);
test(settings,['倒计时 10 秒'],'普通用户','确认注销后进入10秒等待','注销提交前倒计时',['金币余额为99'],[enter(settings),'点击|注销账号','点击|确认注销'],'显示10秒注销倒计时',P1);
test(settings,['点击取消 -> 停止倒计时'],'普通用户','注销倒计时中取消申请','注销倒计时取消',['注销10秒倒计时尚未结束'],['点击|取消'],'注销倒计时停止',P1);
test(settings,['倒计时结束 -> 提交注销申请'],'普通用户','注销倒计时结束退出登录','注销申请提交去向',['金币余额为0','测试时钟可推进10秒，当前无其他注销申请'],[enter(settings),'点击|注销账号','点击|确认注销','查看|倒计时|至10秒结束'],'进入登录与注册页',{...P1,transition:'ST-deletion-request'});
test(settings,['退出登录 -> 二次确认'],'普通用户','退出登录先二次确认','退出登录确认弹窗',[],[enter(settings),'点击|退出登录'],'显示退出登录二次确认弹窗',P2);
test(settings,['确认后返回登录页'],'普通用户','确认退出当前设备登录','退出登录去向',[],[enter(settings),'点击|退出登录','点击|确认'],'进入登录与注册页',{...P1,transition:'ST-logout'});
for(const [key,button,pwdField]of [['account-password-set.html','完成','登录密码'],['account-password-reset.html','重置密码','新密码']]){
  const common=[key.includes('-set')?'账号尚未设置密码':'账号已设置密码','账号已绑定测试手机号和邮箱','环境准备：默认手机号验证方式已有本次签发且未使用的有效验证码，手机号和邮箱通道均可获取验证码'];
  for(const channel of ['手机号','邮箱'])test(key,['可选择已绑定手机号或邮箱','返回设置页'],'普通用户',`${channel}验证后${key.includes('-set')?'设置':'重置'}密码`,`${channel}验证密码提交`,common,[enter(key),`选择|验证方式|为${channel}`,'点击|获取验证码','填写|验证码|为本次收到的6位有效值',`填写|${pwdField}|为QaNew!2026`,`填写|${key.includes('-set')?'确认密码':'确认新密码'}|为QaNew!2026`,`点击|${button}`],'返回设置页',P1);
  for(const value of ['Qa12345',''])test(key,['至少 8 位'],'普通用户',`${pwdField}长度${value.length}被拒绝`,`${pwdField}最小长度`,common,[enter(key),'填写|验证码|为本次收到的6位有效值',value?`填写|${pwdField}|为${value}`:`清空|${pwdField}`,value?`填写|${key.includes('-set')?'确认密码':'确认新密码'}|为${value}`:`清空|${key.includes('-set')?'确认密码':'确认新密码'}`],`${button}按钮不可用`,P1);
  test(key,['至少 8 位','返回设置页'],'普通用户',`${pwdField}恰好8位完成提交`,`${pwdField}长度下界`,common,[enter(key),'填写|验证码|为本次收到的6位有效值',`填写|${pwdField}|为Qa123456`,`填写|${key.includes('-set')?'确认密码':'确认新密码'}|为Qa123456`,`点击|${button}`],'返回设置页',P1);
  test(key,['两次密码不一致'],'普通用户',`${pwdField}与确认值不一致`,`${pwdField}确认一致性`,common,[enter(key),'填写|验证码|为本次收到的6位有效值',`填写|${pwdField}|为QaNew!2026`,`填写|${key.includes('-set')?'确认密码':'确认新密码'}|为Other!2026`,`点击|${button}`],'提示两次密码不一致',P1);
  for(const bad of ['错误','失效','已使用'])test(key,['验证码错误、失效或已使用'],'普通用户',`${bad}验证码提交${pwdField}`,`${bad}验证码密码保护`,[...common,`准备${bad}但格式为6位数字的验证码`],[enter(key),`填写|验证码|为准备的${bad}值`,`填写|${pwdField}|为QaNew!2026`,`填写|${key.includes('-set')?'确认密码':'确认新密码'}|为QaNew!2026`,`点击|${button}`],`${pwdField}输入仍为QaNew!2026`,ERR);
  test(key,['仅校验当前选中的'],'普通用户',`验证方式切换后使用另一通道验证码`,`${pwdField}验证码归属`,[...common,'手机和邮箱均有不同的有效验证码'],[enter(key),'选择|验证方式|为邮箱','填写|验证码|为手机号收到的值',`填写|${pwdField}|为QaNew!2026`,`填写|${key.includes('-set')?'确认密码':'确认新密码'}|为QaNew!2026`,`点击|${button}`],'不能通过当前邮箱身份验证',P1);
}
const change='account-password-change.html';
for(const [key,label,field,button]of [['account-password-set.html','设置','登录密码','完成'],['account-password-reset.html','重置','新密码','重置密码']])for(const failure of ['错误','过期','已使用'])test(key,['验证码错误、失效或已使用时不'],'普通用户',`${label}密码${failure}验证码不改变凭证状态`,`${label}密码无效验证保护`,['账号已绑定手机号及邮箱',label==='设置'?'账号从未设置密码':'账号已有密码QaOld!2026',`环境准备：准备格式为6位数字、对应当前选择手机号但${failure}的验证码；当前为手机号验证方式`],[enter(key),`填写|验证码|为准备的${failure}值`,`填写|${field}|为QaNew!2026`,`填写|${label==='设置'?'确认密码':'确认新密码'}|为QaNew!2026`,`点击|${button}`,...(label==='设置'?[enter(settings)]:[enter(settings),'点击|退出登录','点击|确认',enter('auth-email-login.html'),'切换|使用密码登录','填写|邮箱|为qa.member@example.com','填写|密码|为QaOld!2026','勾选|用户协议和隐私政策','点击|继续'])],label==='设置'?'密码状态仍为未设置':'使用原密码仍能进入首页',{...P1,observe:label==='设置'?settings:'auth-email-login.html',extra:[[label==='设置'?settings:'auth-email-login.html',label==='设置'?'仅显示“已设置”或“未设置”':'登录成功 -> 进入首页']],notes:['测试邮箱qa.member@example.com归属当前测试账号。']});
for(const [key,button,pwdField]of [['account-password-set.html','完成','登录密码'],['account-password-reset.html','重置密码','新密码']]){
 const label=key.includes('-set')?'设置':'重置';
 for(const value of ['','12345','1234567','12a456'])test(key,['验证码不是 6 位'],'普通用户',`${label}密码验证码输入${value||'空值'}`,`${label}密码验证码格式`,['账号已绑定手机号',label==='设置'?'账号从未设置密码':'账号已经设置密码QaOld!2026'],[enter(key),value?`填写|验证码|为${value}`:'清空|验证码',`填写|${pwdField}|为QaNew!2026`,`填写|${label==='设置'?'确认密码':'确认新密码'}|为QaNew!2026`],`${button}按钮不可用`,P1);
 for(const channel of ['手机号','邮箱'])test(key,['按钮进入 60 秒倒计时'],'普通用户',`${label}密码通过${channel}取码后禁止重发`,`${label}${channel}重发间隔`,[`账号已绑定测试${channel}；环境准备：验证码通道可成功发送`],[enter(key),`选择|验证方式|为${channel}`,'点击|获取验证码','点击|获取验证码'],'倒计时结束前不可再次发送验证码',P1);
 test(key,['倒计时结束后可重新获取'],'普通用户',`${label}密码取码60秒后恢复发送`,`${label}密码取码恢复`,['手机号验证码发送后已经过60秒'],[enter(key),'点击|获取验证码'],'重新进入60秒倒计时',P1);
 for(const channel of ['手机号','邮箱'])test(key,['联系方式脱敏展示'],'普通用户',`${label}密码验证${channel}脱敏`,`${label}密码身份信息保护`,[`账号已绑定${channel}，记录完整值用于核对`],[enter(key),`选择|验证方式|为${channel}`],`验证身份显示的${channel}为脱敏值`,P2);
}
for(const value of ['', 'Qa12345'])test(change,['新密码：必填，至少 8 位'],'普通用户',`修改密码的新密码长度${value.length}`, '改密新密码下界',['账号当前密码QaOld!2026'],[enter(change),'填写|当前密码|为QaOld!2026',value?`填写|新密码|为${value}`:'清空|新密码',value?`填写|确认新密码|为${value}`:'清空|确认新密码','点击|修改密码'],'不能提交该新密码',P1);
for(const channel of ['手机号','邮箱'])test('account-password-set.html',['均可使用该密码登录'],'未登录用户',`初次设置密码后使用${channel}登录`, `初设密码${channel}生效`,['正常账号已绑定+6281234567890及qa.member@example.com，刚完成首次密码设置为QaNew!2026并已退出登录','两份协议已勾选'],[enter(channel==='手机号'?'auth-phone-login.html':'auth-email-login.html'),'切换|使用密码登录',`填写|${channel}|为${channel==='手机号'?'81234567890':'qa.member@example.com'}`,...(channel==='手机号'?['选择|区号|为+62']:[]),'填写|密码|为QaNew!2026','点击|继续'],'进入首页',{...P1,observe:channel==='手机号'?'auth-phone-login.html':'auth-email-login.html',extra:[[channel==='手机号'?'auth-phone-login.html':'auth-email-login.html','登录成功 -> 进入首页']]});
for(const state of ['已设置','未设置'])test(settings,['仅显示“已设置”或“未设置”'],'普通用户',`设置页显示密码${state}`, '密码配置状态',[`账号密码${state}且已绑定邮箱`],[enter(settings)],`密码状态显示${state}`,P2);
test(settings,['未设置且已绑定手机号或邮箱'],'普通用户','仅绑定邮箱仍可初设密码','邮箱绑定后的密码资格',['第三方注册账号未设置密码，仅绑定邮箱'],[enter(settings)],'设置密码入口可点击',P1);
for(const choice of ['允许','不允许'])test('views/live-plaza/notification-permission.html',['允许后记录为已开启，不允许后记录为已拒绝'],'普通用户',`首次系统通知选择${choice}`, '系统授权结果保存',['当前设备从未申请通知权限，首次首页说明选择开启通知后，系统授权弹窗已展示'],[`点击|${choice}`,enter(settings)],`系统通知状态显示${choice==='允许'?'已开启':'已拒绝'}`,{...P1,observe:settings,extra:[[settings,'展示手机系统通知权限状态']]});
for(const pref of ['开播提醒','互动通知'])test('views/settings/notification-denied.html',['App 内分类开关不能代替系统授权'],'普通用户',`开启${pref}不改变已拒绝系统权限`, `${pref}与系统权限独立`,['设备系统通知已拒绝，当前对应App分类偏好关闭'],[enter(settings),`启用|${pref}`],'系统通知权限仍显示已拒绝',{...P1,observe:settings,extra:[[settings,'App 内通知分类偏好']]});
test(settings,['仅控制对应 App 内分类偏好'],'普通用户','关闭开播提醒不改变互动通知','通知分类独立保存',['两个App分类偏好均开启'],[enter(settings),'关闭|开播提醒'],'互动通知仍为开启',P1);
for(const field of ['背景图','签名','地区'])test(edit,['其他资料直接生效'],'普通用户',`单独保存${field}不依赖头像昵称风控`, `${field}保存结果`,['头像昵称均未修改，昵称QA已保存；准备图片qa-bg.png'],[enter(edit),field==='背景图'?'上传|背景图|选择qa-bg.png':`填写|${field}|为QA资料`,'点击|保存',enter(edit)],field==='背景图'?'背景图显示qa-bg.png对应图片':`${field}显示QA资料`,P1);
for(const reason of ['风控不通过','网络异常'])test(edit,['失败或网络异常时保留编辑内容'],'普通用户',`${reason}后保留新头像草稿`,'头像失败编辑保持',[`环境准备：此次头像保存${reason}，执行前需提供模拟能力；原头像A，新图片qa-B.png`],[enter(edit),'上传|头像|选择qa-B.png','点击|保存'],'编辑预览仍为qa-B.png对应图片',ERR);
for(const [old,pwd,confirm,label]of [['Wrong!2026','QaNew!2026','QaNew!2026','当前密码错误'],['QaOld!2026','QaOld!2026','QaOld!2026','新旧密码相同'],['QaOld!2026','QaNew!2026','Other!2026','两次新密码不一致']])test(change,['当前密码错误、新密码与当前密码相同'],'普通用户',`${label}时拒绝修改密码`,`${label}校验`,['账号当前密码为QaOld!2026'],[enter(change),`填写|当前密码|为${old}`,`填写|新密码|为${pwd}`,`填写|确认新密码|为${confirm}`,'点击|修改密码'],`提示${label}`,P1);
test(change,['修改密码并返回设置页'],'普通用户','正确旧密码提交新密码','修改密码成功去向',['当前密码为QaOld!2026'],[enter(change),'填写|当前密码|为QaOld!2026','填写|新密码|为QaNew!2026','填写|确认新密码|为QaNew!2026','点击|修改密码'],'返回设置页',P1);
test(change,['点击忘记当前密码'],'普通用户','从修改密码进入重置流程','忘记当前密码入口',[],[enter(change),'点击|忘记当前密码'],'进入忘记密码页',P2);
const outfit='my-decoration.html';
for(const [type,index]of [['头像框',1],['聊天气泡',2],['勋章',3]]){
 test(outfit,['已拥有分类：'],'普通用户',`已拥有按${type}分类展示`,`已拥有${type}范围`,['账号持有有效头像框A、聊天气泡B、勋章C'],[enter(outfit),'切换|已拥有',`切换|${type}`],`仅显示${['头像框A','聊天气泡B','勋章C'][index-1]}`,P2);
 test(outfit,['卡片直接佩戴或卸下'],'普通用户',`点击已佩戴${type}直接卸下`,`${type}卸下状态`,[`已拥有并正佩戴有效${type}A`],[enter(outfit),'切换|已拥有',`切换|${type}`,'点击|道具A'],'道具A显示未佩戴',P1);
}
for(const count of [0,3,5])test(outfit,['勋章 Tab 显示'],'普通用户',`勋章已佩戴${count}枚时显示数量`,'勋章数量统计', [`正佩戴${count}枚有效勋章，另有未佩戴和过期勋章`],[enter(outfit),'切换|勋章'],`勋章Tab显示勋章${count}/5`,P2);
test(outfit,['已拥有列表按已佩戴、未佩戴、已失效排列'],'普通用户','装扮先按佩戴有效状态分组','已拥有装扮状态排序',['同类道具甲已佩戴、乙未佩戴有效、丙已失效；丙获得时间最新'],[enter(outfit),'切换|已拥有'],'道具顺序为甲→乙→丙',P1);
test(outfit,['同一状态内按获得时间倒序'],'普通用户','同状态装扮按获得时间排序','装扮组内时间排序',['同类甲乙均有效未佩戴；甲9月14日获得、乙15日获得'],[enter(outfit),'切换|已拥有'],'乙排在甲之前',P1);
test(outfit,['道具可永久佩戴'],'普通用户','无结束日期的道具持续可佩戴','永久装扮使用期限',['已拥有道具A无结束日期；测试时间远晚于获得日；同类暂无已佩戴道具'],[enter(outfit),'切换|已拥有','点击|道具A'],'道具A显示已佩戴',P1);
test(outfit,['失效道具不可点击'],'普通用户','过期道具点击不能改变佩戴状态','已失效道具操作限制',['已拥有道具A已经过期且当前未佩戴'],[enter(outfit),'切换|已拥有','点击|道具A'],'道具A保持未佩戴',P1);
for(const [field,value]of [['名称','QA装扮'],['金币价格','30金币'],['可佩戴期限','08/12/2026-31/12/2026']])test(outfit,['商城商品：'],'普通用户',`装扮商城展示已配置${field}`,`商城商品${field}`,['已上架可购买道具A名称QA装扮、价格30金币、有效期2026年12月8日至31日；本账号未拥有；当前在可购买期间'],[enter(outfit),'切换|装扮商城'],`道具A的${field}显示${value}`,P2);
test('views/my-decoration/purchase-confirm.html',['取消 -> 关闭弹窗且不购买'],'普通用户','取消装扮购买不扣真实金币','取消购买的金币余额',['真实金币100；道具A价格30且未拥有；购买确认弹窗已打开；没有其他交易'],['点击|取消',enter('profile.html')],'金币余额仍为100',{...P1,observe:'profile.html',extra:[['profile.html','金币余额：']]});
test('views/my-decoration/purchase-confirm.html',['校验通过后扣款并加入已拥有'],'普通用户','装扮购买成功新增持有记录','购买后的道具归属',['真实金币100；道具A价格30、已上架可购买且未拥有'],[enter(outfit),'切换|装扮商城','点击|道具A','点击|购买','点击|去佩戴'],'已拥有列表包含道具A',{...P1,observe:outfit,extra:[[outfit,'已拥有卡片']],transition:'ST-ornament-buy'});
for(const [change,expected]of [['后台已下架道具A','不能完成道具A购买'],['另一操作已购买道具A','不重复购买道具A'],['另一笔交易后真实余额变为29金币','不能完成道具A购买']])test('views/my-decoration/purchase-confirm.html',['再次校验商品状态、真实金币余额和持有状态'],'普通用户',`购买确认前${change}重新校验`,'购买提交时最新状态',['弹窗打开时A价格30、已上架可购买、未持有且余额100',`环境准备：保持弹窗打开，在提交前使${change}`],['点击|购买'],expected,P1);
test('views/my-decoration/insufficient.html',['不生成购买记录'],'普通用户','金币不足不新增装扮持有记录','余额不足的购买结果',['真实余额29，道具A价格30且未拥有'],[enter(outfit),'切换|装扮商城','点击|道具A','点击|取消','切换|已拥有'],'已拥有中不包含道具A',{...P1,observe:outfit,extra:[[outfit,'金币不足时']]});
test('views/my-decoration/insufficient.html',['去充值 -> 进入充值页'],'普通用户','装扮余额不足进入充值','不足余额充值入口',['普通账号的装扮余额不足提示已打开'],['点击|去充值'],'进入充值页',P2);
test(outfit,['运营账号点击我的装扮入口'],'运营账号','运营账号打开我的装扮','运营账号装扮准入',[],[enter('profile.html'),'点击|我的装扮'],'提示“运营账号无法操作”',P1);
for(const kind of ['头像框','聊天气泡'])test(outfit,['同类最多佩戴 1 个'],'普通用户',`更换已佩戴${kind}`,`${kind}单件佩戴`,[`已拥有有效${kind}A和B，当前佩戴A`],[enter(outfit),`切换|${kind}`,'点击|道具B'],`当前佩戴${kind}为B`,P1);
test(outfit,['最多同时佩戴 5 枚'],'普通用户','勋章已满5枚时佩戴第6枚','勋章佩戴上限',['已佩戴5枚有效勋章，另有未佩戴有效勋章F'],[enter(outfit),'切换|勋章','点击|勋章F'],'勋章F保持未佩戴',P1);
test(outfit,['先卸下一枚'],'普通用户','卸下1枚后补戴新勋章','勋章腾位补戴',['已佩戴A至E共5枚，另有未佩戴F'],[enter(outfit),'切换|勋章','点击|勋章A','点击|勋章F'],'勋章F显示已佩戴',P1);
test(outfit,['已过期'],'普通用户','过期道具不能佩戴','到期装扮佩戴限制',['账号持有的道具A已经超过其结束日期'],[enter(outfit),'点击|道具A'],'道具A显示“已过期”',{...P1,transition:'ST-ornament-expire'});
test(outfit,['仅后台标记为允许购买且已上架'],'普通用户','商城排除不可售道具','装扮商城可售范围',['A上架且允许购买，B下架，C为不可购买身份专属勋章'],[enter(outfit),'切换|装扮商城'],'商城只显示A',P1);
test(outfit,['已拥有后均不可重复购买'],'普通用户','已经获得的道具不能再购买','装扮重复购买限制',['已拥有商城商品A'],[enter(outfit),'切换|装扮商城','点击|商品A'],'商品A显示“已获得”',P1);
test(outfit,['购买成功”及'],'普通用户','金币足够时购买道具','装扮购买成功反馈',['真实金币余额1000，未拥有在售道具A价格100'],[enter(outfit),'切换|装扮商城','点击|道具A','点击|购买'],'弹窗显示“购买成功”',{...P0,transition:'ST-ornament-buy'});
test(outfit,['金币不足时仅显示'],'普通用户','金币不足时购买道具的充值引导','装扮余额不足引导',['真实金币余额99，在售道具A价格100'],[enter(outfit),'切换|装扮商城','点击|道具A'],'显示“去充值”按钮',P1);
for(const [button,expected]of [['继续购买','停留装扮商城'],['去佩戴','进入已拥有并选中所购道具对应分类']])test(outfit,['继续购买关闭弹窗','去佩戴返回'],'普通用户',`装扮购买成功后选择${button}`,`购买后${button}去向`,['道具购买成功弹窗已显示'],[`点击|${button}`],expected,P2);
const service='customer-service.html';
for(const [label,value]of [['WhatsApp','+6281234567890'],['官方客服邮箱','support@example.com']]){
  test(service,[label],'普通用户',`客服页展示配置的${label}`,`客服${label}配置回显`,[`当前运营配置的${label}为${value}`],[enter(service)],`${label}显示${value}`,P2);
  test(service,['复制对应内容'],'普通用户',`复制客服${label}`,`客服${label}剪贴板内容`,[`当前${label}为${value}`],[enter(service),`点击|${label}`,'查看|系统剪贴板'],`剪贴板内容为${value}`,P2);
}
const blacklist='blacklist-management.html';
for(const direction of ['本账号拉黑甲','甲拉黑本账号']){
 for(const [page,ref,action,result,label]of [
 ['search-results.html','不能搜索',[enter('search.html'),'填写|搜索框|为甲的用户ID','提交|搜索'],'搜索结果不包含甲','账号搜索'],
 ['my-following.html','解除关注',[enter('my-following.html')],'关注列表不再包含甲','关注关系'],
 ['follower-list.html','解除关注',[enter('follower-list.html')],'粉丝列表不再包含甲','被关注关系'],
 ['message-center.html','双方会话从私信列表删除',[enter('message-center.html')],'私信会话列表不再包含甲','私信会话'],
 ])test(blacklist,[ref],'普通用户',`${direction}后清理${label}`,`拉黑后的${label}`,['双方原有双向关注、好友及私信关系',`环境准备：刚完成${direction}`],action,result,{...P1,observe:page,extra:[[page,page==='search-results.html'?'搜索':page==='message-center.html'?'会话':page==='my-following.html'?'当前有效关注关系':'当前仍关注我的账号']]});
 for(const entry of ['首页热门','分类'])test(blacklist,['首页、分类、搜索和推荐不展示对方的直播间卡片'],'普通用户',`${direction}后${entry}隐藏对方直播`,`拉黑${entry}直播卡片`,[`甲正在聊天分类直播且原本出现在${entry}；环境准备：已完成${direction}`],[enter('live-plaza.html'),entry==='首页热门'?'切换|热门':'选择|分类|为聊天'],'不显示甲的直播间卡片',{...P1,observe:'live-plaza.html',extra:[['live-plaza.html','直播卡片：']]});
}
test(blacklist,['两条记录分别取消'],'普通用户','双向拉黑只取消本人记录仍受限','双向拉黑独立解除',['本账号与甲分别主动拉黑对方，甲尚未解除拉黑'],[enter(blacklist),'点击|甲的取消拉黑','点击|确认',enter('search.html'),'填写|搜索框|为甲的用户ID','提交|搜索'],'搜索结果仍不包含甲',{...P1,observe:'search-results.html',extra:[['search-results.html','搜索']]});
test(blacklist,['请求失败 -> 保持原状态'],'普通用户','取消拉黑请求失败保留记录','解除拉黑失败关系保持',['本账号已主动拉黑甲；环境准备：取消请求明确返回失败'],[enter(blacklist),'点击|甲的取消拉黑','点击|确认'],'甲仍在黑名单中',ERR);
test(blacklist,['二次确认后从列表移除'],'普通用户','解除拉黑前显示确认','解除拉黑确认弹窗',['本账号已主动拉黑甲'],[enter(blacklist),'点击|甲的取消拉黑'],'显示取消拉黑确认弹窗',P1);
for(const [page,label,expected]of [
 ['my-following.html','关注','关注列表不包含甲'],
 ['follower-list.html','粉丝','粉丝列表不包含甲'],
 ['message-center.html','私信会话','原私信会话不再出现'],
 ['interaction-notifications.html','待处理好友申请','原好友申请仍为已失效'],
 ['my-fan-clubs.html','粉丝团','不显示甲所属粉丝团卡片'],
 ])test(blacklist,['取消拉黑仅解除当前拉黑记录，不恢复'],'普通用户',`解除拉黑后不恢复${label}`,`解除拉黑${label}保持`,[`本账号与甲原有${label}记录，因拉黑已解除；双方现均已取消拉黑，之后没有新建关系`],[enter(page)],expected,{...P1,observe:page,extra:[[page,page==='interaction-notifications.html'?'已失效':page==='message-center.html'?'会话':page==='my-fan-clubs.html'?'当前有效团籍':page==='my-following.html'?'当前有效关注关系':'当前仍关注我的账号']]});
test(blacklist,['主播拉黑直播间内的对方时，对方立即退出'],'观众','被当前主播拉黑后退出直播','在房拉黑实时退出',['当前账号正在甲的S1观看；环境准备：甲刚成功拉黑本账号'],['查看|当前观看会话'],'本账号退出甲的S1直播间',{...P1,observe:'live-room.html',extra:[['live-room.html','拉黑']]});
for(const [page,entry,ref]of [['live-room.html','第三方主播丙的普通直播间','同一第三方直播间'],['fan-group-chat.html','第三方主播丙的粉丝群','同一第三方粉丝团']])test(blacklist,[ref],'普通用户',`第三方${page==='live-room.html'?'直播间':'粉丝群'}不允许打开拉黑对象主页`,'同场拉黑对象主页限制',[`本账号与甲存在拉黑关系，双方均在${entry}`],[enter(page),'点击|甲的头像'],'不进入甲的主页',{...P1,observe:page,extra:[[page,page==='live-room.html'?'公屏消息：':'群消息：']]});
test(blacklist,['不列出仅拉黑了当前用户'],'普通用户','黑名单只显示主动拉黑关系','主动拉黑列表范围',['当前账号A拉黑B，C只单向拉黑A'],[enter(blacklist)],'列表包含B但不包含C',P1);
test(blacklist,['按拉黑时间倒序'],'普通用户','黑名单按最新操作排列','黑名单时间排序',['当前账号先拉黑B后拉黑C'],[enter(blacklist)],'C排在B之前',P2);
test(blacklist,['二次确认后从列表移除'],'普通用户','确认取消一个拉黑记录','解除拉黑列表变化',['当前账号已主动拉黑B'],[enter(blacklist),'点击|B的取消拉黑','点击|确认'],'B从当前黑名单移除',{...P1,transition:'ST-unblock'});
test(blacklist,['请求失败'],'普通用户','取消拉黑请求失败','解除拉黑失败提示',['当前账号已拉黑B','环境准备：取消拉黑请求返回失败；执行前需提供故障模拟'],[enter(blacklist),'点击|B的取消拉黑','点击|确认'],'提示“请求失败”',ERR);
