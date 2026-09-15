import {page} from './design-current.mjs';
const U='用户App';
const login=page(U,'auth-login-register.html',['当前未登录']);
for(const provider of ['Google','Facebook','Apple ID','TikTok']){
 const os=provider==='Apple ID'?['设备为 iOS']:[];
 login.add(`未同意协议时点击 ${provider}`,os,[`打开登录与注册`,`点击 ${provider}`],[{point:'授权前协议确认',result:`未唤起 ${provider} 授权`}],[/协议|第三方/]);
 login.add(`同意协议后点击 ${provider}`,os,['打开登录与注册','勾选用户协议和隐私政策',`点击 ${provider}`],[{point:'第三方授权入口',result:`显示 ${provider} 授权界面`}],[new RegExp(provider.replace(' ID','')),/第三方/]);
 for(const existing of [false,true])login.add(`${provider} ${existing?'已有':'未注册'}账号授权成功`,[...os,`${provider} 测试身份甲${existing?'已关联一个 Luma Live 账号':'尚未关联 Luma Live 账号'}`],['打开登录与注册','勾选用户协议和隐私政策',`点击 ${provider}`,'完成测试身份甲的授权'],[{point:'新老账号分流',result:existing?'进入首页':'进入资料补全页'}],[/新注册|已有账号|授权成功/]);
 for(const [outcome,expected] of [['取消','已取消授权'],['失败','登录失败，请重试']])login.add(`${provider} 授权${outcome}`,os,['打开登录与注册','勾选用户协议和隐私政策',`点击 ${provider}`,outcome==='取消'?'取消第三方授权':'使用授权失败的测试账号完成授权'],[{point:'授权结果提示',result:`提示“${expected}”`}],[/授权失败|取消授权/]);
}
for(const os of ['iOS','Android'])login.add(`${os} 的 Apple 登录入口`,[`设备系统为 ${os}`],['打开登录与注册'],[{point:'Apple 入口平台范围',result:os==='iOS'?'显示 Apple ID 登录入口':'不显示 Apple ID 登录入口'}],[/Apple/]);
for(const [button,target] of [['手机号登录','手机号登录页'],['邮箱','邮箱登录页'],['游客进入','首页']])login.add(`登录页使用${button}`,[],['打开登录与注册',`点击${button}`],[{point:'登录入口导航',result:`进入${target}`}],[new RegExp(button.slice(0,2))]);
for(const pageName of ['首页','主播榜','贡献榜','福利页','邀请好友页'])login.add(`游客访问${pageName}`,[],['点击游客进入',`打开${pageName}`],[{point:'游客白名单',result:`展示${pageName}`}],[/游客白名单|游客进入/],{role:'游客'});
const phone=page(U,'auth-phone-login.html',['账号甲绑定 +62 81234567890，已同意当前协议']);
for(const n of [7,8,15,16])phone.add(`手机号输入 ${n} 位数字`,[],['打开手机号登录',`输入由 ${n} 个数字 8 组成的手机号`,'点击获取验证码'],[{point:'手机号长度范围',result:n===8||n===15?'获取验证码按钮进入 60 秒倒计时':'未进入验证码发送倒计时'}],[/手机号|60 秒/]);
phone.add('手机号包含字母时获取验证码',[],['打开手机号登录','输入手机号 8123456a','点击获取验证码'],[{point:'手机号字符类型',result:'未进入验证码发送倒计时'}],[/手机号|数字/]);
phone.add('设备地区无法识别时使用默认区号',['设备地区无法映射到可选国家'],['打开手机号登录'],[{point:'区号回退',result:'区号显示 +62'}],[/默认|区号/]);
phone.add('选择地区后恢复原登录表单',['手机号框为 81234567890，密码方式已选，协议已勾选'],['点击区号','选择印度尼西亚 +62'],[{point:'手机号保留',result:'手机号仍为 81234567890'},{point:'登录方式保留',result:'登录方式仍为密码登录'},{point:'协议选择保留',result:'协议仍为勾选状态'}],[/保留|恢复/]);
const country=page(U,'auth-country-select.html',['原区号为 +62']);
for(const keyword of ['印度尼西亚','+62'])country.add(`通过${keyword}检索地区`,[],['打开选择国家/地区',`输入搜索词 ${keyword}`],[{point:'地区检索',result:'搜索结果包含印度尼西亚 +62'}],[/搜索|输入名称/]);
country.add('不支持中国大陆手机区号',[],['打开选择国家/地区','输入搜索词 +86'],[{point:'排除区号',result:'可选结果中没有中国大陆 +86'}],[/86/]);
country.add('区号检索无匹配结果',[],['打开选择国家/地区','输入搜索词 NoCountry9001'],[{point:'地区搜索空态',result:'地区列表显示空状态'}],[/无结果|搜索/]);
country.add('取消地区选择保留原区号',[],['打开选择国家/地区','点击返回'],[{point:'区号选择取消',result:'手机号登录页仍显示 +62'}],[/返回|不改变/]);
for(const [key,label,identity] of [['auth-phone-login.html','短信','+62 81234567890'],['auth-email-login.html','邮箱','qa.test@example.com']]){
 const p=page(U,key,[`测试账号甲的${label==='短信'?'手机号':'邮箱'}为 ${identity}；当前协议已勾选`]);
 p.add(`${label}登录默认使用验证码`,[],[`打开${label==='短信'?'手机号':'邮箱'}登录`],[{point:'默认登录方式',result:`显示${label}验证码登录表单`}],[/默认/]);
 for(const n of [5,6,7])p.add(`${label}验证码输入 ${n} 位`,['有效测试验证码为 123456，获取后未超过 5 分钟'],[`打开${label==='短信'?'手机号':'邮箱'}登录`,`填写${label==='短信'?'手机号':'邮箱'} ${identity}`,`输入验证码 ${n===6?'123456':'1'.repeat(n)}`],[{point:'验证码长度',result:n===6?'继续按钮可用':'继续按钮不可用'}],[/验证码|继续/]);
 for(const seconds of [59,60])p.add(`${label}验证码发送后 ${seconds} 秒再次获取`,['测试联系方式可接收验证码'],[`打开${label==='短信'?'手机号':'邮箱'}登录`,`填写${label==='短信'?'手机号':'邮箱'} ${identity}`,'点击获取验证码',`在倒计时开始后第 ${seconds} 秒查看获取验证码按钮`],[{point:'重新发送等待时间',result:seconds===59?'获取验证码按钮不可用':'获取验证码按钮可用'}],[/60 秒|期间不可/]);
 for(const age of [299,301])p.add(`${label}验证码生成后 ${age} 秒登录`,[`有效验证码为 123456，生成时间距本次提交 ${age} 秒，尚未错误使用`],[`打开${label==='短信'?'手机号':'邮箱'}登录`,`填写${label==='短信'?'手机号':'邮箱'} ${identity}`,'输入验证码 123456','点击继续'],[{point:'验证码有效期',result:age===299?'进入首页':'未进入首页'}],[/5 分钟|登录成功|验证码/]);
 p.add(`${label}验证码连续错误五次后失效`,['当前验证码 123456 尚在有效期，已连续输入错误验证码四次'],[`打开${label==='短信'?'手机号':'邮箱'}登录`,`填写${label==='短信'?'手机号':'邮箱'} ${identity}`,'输入错误验证码 654321','点击继续','改为输入验证码 123456','点击继续'],[{point:'错误次数上限',result:'未进入首页'}],[/连续错误 5 次/]);
 for(const mode of ['密码登录',`${label}验证码登录`])p.add(`切换到${mode}`,[],[`打开${label==='短信'?'手机号':'邮箱'}登录`,`点击使用${mode}`],[{point:'登录方式切换',result:`显示${mode}表单`}],[/切换登录方式/]);
 p.add(`${label}账号凭证有效但处于注销冷静期`,['账号甲的注销申请尚在七日冷静期'],[`打开${label==='短信'?'手机号':'邮箱'}登录`,`填写${label==='短信'?'手机号':'邮箱'} ${identity}`,'输入本次收到的六位验证码','点击继续'],[{point:'冷静期登录分流',result:'登录与注册页显示注销冷静期弹窗'}],[/冷静期/]);
}
const email=page(U,'auth-email-login.html',['协议已勾选']);
for(const value of ['','qatest','qatest@','qa.test@example.com'])email.add(`邮箱格式输入${value||'空值'}`,[],['打开邮箱登录',`输入邮箱“${value}”`,'点击获取验证码'],[{point:'邮箱地址格式',result:value==='qa.test@example.com'?'获取验证码按钮进入 60 秒倒计时':'未进入验证码发送倒计时'}],[/邮箱|有效/]);
const profile=page(U,'auth-profile-completion.html',['账号甲首次注册，系统默认昵称为用户9001，默认头像为头像甲']);
profile.add('首次资料补全跳过',[],['打开资料补全','点击跳过'],[{point:'跳过后的昵称',result:'首页中的账号昵称仍为用户9001'},{point:'跳过后的头像',result:'账号头像仍为头像甲'}],[/跳过|默认/]);
for(const n of [0,1,20,21])profile.add(`补全昵称为 ${n} 个字符`,[],['打开资料补全',n?`输入由 ${n} 个“测”组成的昵称`:'清空昵称','点击保存'],[{point:'补全昵称长度',result:n>=1&&n<=20?`账号昵称保存为 ${n} 个“测”`:'未保存该昵称'}],[/昵称|保存/]);
const edit=page(U,'profile-edit.html',['用户甲当前昵称为旧昵称，头像为头像甲，已有背景图背景甲']);
for(const [field,max] of [['昵称',20],['签名',80],['地区',30]])for(const n of [max-1,max,max+1])edit.add(`${field}输入 ${n} 个字符`,[],['打开资料编辑',`输入由 ${n} 个“测”组成的${field}`],[{point:`${field}长度上界`,result:`${field}输入框保留 ${Math.min(n,max)} 个“测”`}],[new RegExp(field),/最大长度/]);
edit.add('昵称为空不能保存',[],['打开资料编辑','清空昵称'],[{point:'昵称必填性',result:'保存按钮不可用'}],[/昵称为空/]);
for(const [status,expected] of [['通过','账号昵称变为新昵称'],['不合规','提示“头像或昵称不合规”'],['网络异常','提示“网络异常，请重试”']])edit.add(`昵称保存遇到${status}`,[`测试环境资料合规校验返回${status}`],['打开资料编辑','输入昵称“新昵称”','点击保存'],[{point:'昵称合规保存结果',result:expected}],[/合规|校验|昵称/]);
for(const state of ['不合规','网络异常'])edit.add(`资料校验${state}保留编辑`,[`测试环境资料合规校验返回${state}`],['打开资料编辑','输入昵称“新昵称”','点击保存'],[{point:'失败编辑内容保留',result:'昵称输入框仍为“新昵称”'},{point:'失败不更新生效资料',result:'已生效账号昵称仍为“旧昵称”'}],[/保留编辑|原资料|不保存/]);
for(const value of ['男','女','不公开'])edit.add(`资料性别选择${value}`,[],['打开资料编辑',`选择性别${value}`,'点击保存'],[{point:'性别枚举',result:`账号性别保存为${value}`}],[/性别|其他资料/]);
for(const day of ['昨天','今天','明天'])edit.add(`生日选择${day}`,[],['打开资料编辑',`选择生日为${day}`,'点击保存'],[{point:'生日日期上界',result:day==='明天'?'未保存明天作为生日':`生日保存为${day}`}],[/生日/]);
const settings=page(U,'settings.html',['用户甲已登录，密码已设置，绑定手机号 +62 81234567890 及邮箱 qa.test@example.com']);
for(const lang of ['中文','English','Bahasa Indonesia','Bahasa Melayu'])settings.add(`设置界面切换为${lang}`,[],['打开设置','点击语言',`选择 ${lang}`],[{point:'账号语言选项',result:`当前语言显示 ${lang}`}],[/语言/]);
for(const balance of [99,100,101])settings.add(`金币余额为 ${balance} 时请求注销`,[`用户甲当前金币余额为 ${balance}`],['打开设置','点击注销账号'],[{point:'注销余额门槛',result:balance<100?'注销弹窗提供确认注销按钮':'注销弹窗提供查看余额按钮'}],[/余额|注销条件/]);
settings.add('注销倒计时内取消',['用户甲金币余额为 99'],['打开设置','点击注销账号','点击确认注销','倒计时 10 秒结束前点击取消'],[{point:'注销倒计时取消',result:'未提交注销申请'}],[/倒计时|取消/]);
settings.add('注销确认倒计时结束',['用户甲金币余额为 99'],['打开设置','点击注销账号','点击确认注销','等待 10 秒倒计时结束'],[{point:'注销申请后的入口',result:'返回登录与注册页'}],[/倒计时|退出到登录/]);
settings.add('退出登录确认后结束本机会话',[],['打开设置','点击退出登录','确认退出'],[{point:'退出登录入口',result:'返回登录页'}],[/退出登录/]);
const cooling=page(U,'views/auth-login-register/deletion-cooling.html',['用户甲处于七日注销冷静期，原资料、金币及好友关系仍存在']);
for(const cancel of [true,false])cooling.add(cancel?'冷静期取消注销恢复登录':'冷静期暂不取消注销',[],['完成用户甲的登录凭证验证',cancel?'点击取消注销':'点击暂不取消'],[{point:'冷静期处理入口',result:cancel?'进入首页':'停留登录与注册页'}],[/取消注销|暂不取消/]);
for(const [key,action,button] of [['account-password-set.html','设置','完成'],['account-password-reset.html','重置','重置密码']]){
 const pg=page(U,key,['账号甲绑定手机号 +62 81234567890 及邮箱 qa.test@example.com，选中手机号验证；测试验证码记录值为123456，状态在本条条件指定']);
 for(const len of [7,8,9])pg.add(`${action}密码长度为 ${len}`,['123456为当前手机号有效且未使用的验证码'],[`打开${pg.p.name}`,'输入验证码 123456',`输入密码 ${'A'.repeat(len)}`,`输入确认密码 ${'A'.repeat(len)}`],[{point:'新密码最小长度',result:len<8?`${button}按钮不可用`:`${button}按钮可用`}],[/至少 8 位|少于 8 位/]);
 for(const state of ['错误','失效','已使用'])pg.add(`${action}密码使用${state}验证码`,[`验证码 123456 对当前验证方式属于${state}验证码`],[`打开${pg.p.name}`,'输入验证码 123456','输入密码 QaTest#2026','输入确认密码 QaTest#2026',`点击${button}`],[{point:'验证码可用性',result:`未${action}登录密码`},{point:'验证码失败保留输入',result:'密码输入框保留本次输入'}],[/错误|失效|已使用|保留/]);
 pg.add(`${action}密码时确认密码不一致`,['123456为当前手机号有效且未使用的验证码'],[`打开${pg.p.name}`,'输入验证码 123456','输入密码 QaTest#2026','输入确认密码 Different#2026',`点击${button}`],[{point:'确认密码一致性',result:'提示两次密码不一致'}],[/一致/]);
 pg.add(`${action}密码时不能使用另一个绑定渠道的验证码`,['123456 是邮箱渠道验证码，当前选中手机号验证'],[`打开${pg.p.name}`,'输入验证码 123456','输入密码 QaTest#2026','输入确认密码 QaTest#2026',`点击${button}`],[{point:'验证码与验证方式绑定',result:`未${action}登录密码`}],[/当前选中|验证方式/]);
}
const change=page(U,'account-password-change.html',['用户甲当前有效密码为 OldPass#2026']);
for(const [desc,old,next,confirm] of [['旧密码错误','Wrong#2026','NewPass#2026','NewPass#2026'],['新旧密码相同','OldPass#2026','OldPass#2026','OldPass#2026'],['两次新密码不同','OldPass#2026','NewPass#2026','Other#2026']])change.add(`修改密码${desc}`,[],['打开修改密码',`输入当前密码 ${old}`,`输入新密码 ${next}`,`输入确认新密码 ${confirm}`,'点击完成'],[{point:'密码修改校验',result:'登录密码仍为 OldPass#2026'}],[/当前密码|一致|相同|错误/]);
change.add('忘记旧密码进入验证重置',[],['打开修改密码','点击忘记当前密码'],[{point:'验证重置入口',result:'进入忘记密码页'}],[/忘记当前密码/]);
