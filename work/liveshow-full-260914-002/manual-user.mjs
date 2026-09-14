import {test,ref,add,page,cover,designs} from './design-cases.mjs';

// Conditions and numeric fixtures are test inputs, never new business thresholds.
const login='auth-login-register.html';
for(const provider of ['Google','Facebook','Apple ID','TikTok']){
 const platform=provider==='Apple ID'?'iOS':'Android';
 test(login,'协议',`${provider}登录未同意协议`,[`${platform}设备，两个协议均未勾选`],[`打开登录与注册`,`点击“${provider}”`],'提示先同意《用户协议》和《隐私政策》',{point:'协议拦截',role:'未登录用户',dimension:'权限差异'});
 for(const outcome of ['新账号','已有账号','取消','失败','封禁','无账号标识','冷静期']){
  const specs={新账号:['所有新注册账号','该平台标识未关联Luma Live账号','进入资料补全页面'],已有账号:['已有账号','该平台标识已关联正常账号A','进入首页'],取消:['用户取消授权','第三方授权页可取消','显示“已取消授权”'],失败:['第三方授权失败','第三方授权服务返回失败','显示“登录失败，请重试”'],封禁:['账号状态为封禁','该平台标识关联已封禁账号A','显示“账号已被封禁”'],无账号标识:['有效账号标识','第三方回调没有有效账号标识','不建立登录会话'],冷静期:['账号处于注销冷静期','该平台标识关联注销申请提交后第1天的账号A','展示注销冷静期弹窗']};
  const [word,given,expected]=specs[outcome];
  test(login,word,`${provider}授权的${outcome}分支`,[`${platform}设备，已同意当前版本两个协议`,given],[`打开登录与注册`,`点击“${provider}”`,outcome==='取消'?'点击授权页“取消”':`确认${provider}授权并返回App`],expected,{point:`${outcome}分流`,role:'未登录用户',dimension:['取消','失败','无账号标识'].includes(outcome)?'异常/失败':'正常主流程'});
 }
}
for(const [os,expected]of [['iOS','展示Apple ID登录入口'],['Android','不展示Apple ID登录入口']])test(login,'Apple ID',`${os}设备上的Apple登录入口`,[`${os}设备`],['打开登录与注册'],expected,{point:'系统入口范围',role:'未登录用户'});
for(const [button,target]of [['手机号登录','手机号登录页'],['邮箱','邮箱登录页'],['游客进入','首页']])test(login,button==='手机号登录'?'点击手机号登录':button==='邮箱'?'点击邮箱':'点击游客进入',`${button}入口路由`,['未同意登录协议'],['打开登录与注册',`点击“${button}”`],`进入${target}`,{point:'入口路由',role:'未登录用户'});
for(const value of ['', '测'.repeat(1),'测'.repeat(20),'测'.repeat(21)])test('auth-profile-completion.html','最长 20',`新用户昵称长度${value.length}`,['新账号首次授权完成，系统默认昵称为默认用户A、头像为系统默认头像'],['打开资料补全',value?`输入昵称“${value}”`:'清空昵称','点击“保存”'],value.length>=1&&value.length<=20?`保存昵称“${value}”`:value.length===0?'不保存空昵称':'不保存超过20字符的昵称',{point:'昵称长度边界',role:'新注册用户',dimension:'输入边界'});
for(const [action,result]of [['保存','进入首页'],['跳过','保留系统默认昵称'],['跳过','保留系统默认头像']])test('auth-profile-completion.html',action==='保存'?'保存 ->':'跳过',`资料补全${action}后的${result}`,['系统默认昵称为默认用户A；已选择预置头像B并输入昵称“测试A”'],['打开资料补全',`点击“${action}”`],result,{point:'首次资料处理',role:'新注册用户'});
for(const [key,credential,mode]of [['auth-phone-login.html','手机号','短信验证码'],['auth-email-login.html','邮箱','邮箱验证码']]){
 const acct=credential==='手机号'?'81234567890':'qa.user@example.com';
 test(key,'默认',`${credential}入口默认方式`,[],[`打开${page(key).entry}`],`展示${mode}登录表单`,{point:'默认登录方式',role:'未登录用户'});
 for(const dest of ['密码登录',mode+'登录'])test(key,'切换登录方式',`${credential}切换到${dest}`,[`当前为${dest==='密码登录'?mode+'登录':'密码登录'}方式`],[`打开${page(key).entry}`,`点击“使用${dest}”`],`展示${dest}表单`,{point:'方式切换',role:'未登录用户'});
 const invalid=credential==='手机号'?['','1'.repeat(7),'1'.repeat(16),'8123456A','8123456.0']:['','plainaddress','qa@','@example.com'];
 for(const v of invalid)test(key,credential==='手机号'?'8-15':'有效邮箱',`${credential}拒绝${v||'空值'}`,[`默认${mode}方式`],[`打开${page(key).entry}`,`输入${credential}“${v||'（留空）'}”`],'不能获取验证码',{point:'账号输入校验',role:'未登录用户',dimension:'输入边界'});
 for(const v of credential==='手机号'?['1'.repeat(8),'1'.repeat(15)]:['qa.user@example.com'])test(key,credential==='手机号'?'8-15':'有效邮箱',`${credential}接受有效值长度${v.length}`,[],[`打开${page(key).entry}`,`输入${credential}“${v}”`,'点击“获取验证码”'],'启动60秒重发倒计时',{point:'有效账号凭证',role:'未登录用户',dimension:'输入边界',sources:[ref(key,'60 秒')]});
 for(const seconds of [0,59,60])test(key,'60 秒',`${credential}验证码重发第${seconds}秒`,[`${credential}为${acct}，验证码已成功发送，已过去${seconds}秒`],[`打开${page(key).entry}`],seconds<60?'获取验证码按钮不可重复使用':'获取验证码按钮恢复可用',{point:'重发时限',role:'未登录用户',dimension:'输入边界'});
 for(const [code,valid]of [['12345',false],['123456',true],['1234567',false],['12345A',false]])test(key,'6 位数字',`${credential}验证码格式${code}`,[`${credential}为已注册正常账号${acct}，已同意两个协议，服务端当前验证码123456尚未过期`],[`打开${page(key).entry}`,`输入验证码“${code}”`,'点击“继续”'],valid?'进入首页':'不建立登录会话',{point:'验证码格式',role:'未登录用户',dimension:'输入边界'});
 for(const [elapsed,expected]of [[299,'进入首页'],[300,'不建立登录会话'],[301,'不建立登录会话']])test(key,'有效期 5 分钟',`${credential}验证码有效期${elapsed}秒`,[`${credential}为${acct}，验证码123456已发出${elapsed}秒且未用过，协议已同意`],[`打开${page(key).entry}`,'输入验证码“123456”','点击“继续”'],expected,{point:'验证码到期边界',role:'未登录用户',dimension:'输入边界'});
 for(const failures of [4,5])test(key,'连续错误 5 次',`${credential}连续错误${failures}次后输入原验证码`,[`${credential}为${acct}，有效验证码123456尚在5分钟内，已连续提交错误值654321共${failures}次，协议已同意`],[`打开${page(key).entry}`,'输入验证码“123456”','点击“继续”'],failures===4?'进入首页':'不建立登录会话',{point:'错误次数阈值',role:'未登录用户',dimension:'输入边界'});
 test(key,'密码登录时必填',`${credential}密码留空`,[`${credential}为${acct}，已切换密码登录且同意协议`],[`打开${page(key).entry}`,'清空密码','点击“继续”'],'不建立登录会话',{point:'密码必填',role:'未登录用户',dimension:'输入边界'});
 test(key,'注销冷静期',`${credential}凭证正确但处于注销冷静期`,[`${credential}为${acct}，账号注销提交后第1天，当前有效验证码123456，协议已同意`],[`打开${page(key).entry}`,'输入验证码“123456”','点击“继续”'],'展示注销冷静期弹窗',{point:'待注销账号分流',role:'未登录用户'});
}
const country='auth-country-select.html';
for(const v of ['印度尼西亚','+62','不存在地区XYZ','+86',''])test(country,'输入名称',`国家区号搜索${v||'清空'}`,['原手机号81234567890，区号+62，密码登录方式，协议已勾选'],['打开选择国家/地区',v?`输入搜索词“${v}”`:'清空搜索'],v==='不存在地区XYZ'||v==='+86'?'显示无匹配地区的空状态':v===''?'恢复全部支持地区列表':'列表显示印度尼西亚+62',{point:'地区名称及区号搜索',role:'未登录用户',sources:[ref(country,'不提供中国大陆')]});
for(const device of ['无法识别','中国大陆'])test(country,'无法识别',`设备地区${device}时的默认区号`,[`设备地区为${device}`],['打开选择国家/地区'],'选中印度尼西亚+62',{point:'地区回退',role:'未登录用户'});
for(const [action,expected]of [['选择印度尼西亚+62','返回手机号登录页'],['点击“返回”','保留原区号'],['选择印度尼西亚+62','保留已输入手机号81234567890'],['选择印度尼西亚+62','保留密码登录方式'],['选择印度尼西亚+62','保留协议勾选状态']])test(country,'保留已输入',`区号选择后的${expected}`,['原区号+60，手机号81234567890，密码登录方式，协议已勾选'],['打开选择国家/地区',action],expected,{point:'登录表单恢复',role:'未登录用户',sources:[ref(country,'点击返回')]});
test(country,'不改变账号地区', '登录区号与账号地区分离',['账号A资料地区为马来西亚，原登录区号+60'],['打开选择国家/地区','选择印度尼西亚+62'],'账号地区资料保留马来西亚',{point:'资料地区隔离',role:'未登录用户'});
const cooling='views/auth-login-register/deletion-cooling.html';
test(cooling,'可取消截止时间','注销取消截止时间七日计算',['注销申请时间为2026-09-14 10:00，测试业务时区已固定且与界面一致'],['打开登录与注册 → 注销冷静期'],'可取消截止时间显示09/21 10:00',{point:'注销截止时间',role:'待注销用户'});
for(const [action,expected]of [['暂不取消','停留登录与注册页'],['取消注销','进入首页'],['取消注销','清除待注销状态'],['取消注销','原有账号数据和关系保持不变']])test(cooling,action==='暂不取消'?'点击暂不取消':'取消注销',`冷静期${action}的${expected}`,['账号A处于注销后第1天，金币余额50，好友B一人，创建粉丝团C仍存在'],['打开登录与注册 → 注销冷静期',`点击“${action}”`],expected,{point:'注销恢复选择',role:'待注销用户',flow:'FLOW-ACCOUNT-DELETION'});

// Guest access is a distinct role, not an authenticated account with missing data.
for(const [target,word]of [['主播榜','主播榜'],['贡献榜','贡献榜'],['福利页','福利'],['邀请好友页','邀请好友']])test('live-plaza.html','游客可查看',`游客访问${target}`,['游客会话未登录'],['打开首页',`点击“${target}”`],`进入${target}`,{point:'游客白名单',role:'游客'});
for(const button of ['直播间','搜索','消息','我的'])test('live-plaza.html','游客点击',`游客点击${button}`,['游客会话未登录'],['打开首页',`点击“${button}”`],'进入登录页',{point:'游客受限入口',role:'游客',dimension:'权限差异'});
for(const choice of ['开启通知','暂不开启']){
 test('live-plaza.html','通知说明点击',`首次通知说明选择${choice}`,['账号A首次成功登录，尚未处理过通知说明'],['打开首页',`点击“${choice}”`],choice==='开启通知'?'展示系统通知授权弹窗':'关闭通知说明弹窗',{point:'首次通知选择'});
 test('live-plaza.html','后续登录','通知说明处理后不重复弹出',['账号A之前已选择'+choice+'，当前重新登录'],['打开首页'],'不展示通知说明弹窗',{point:'授权说明记忆'});
}
for(const state of ['已关注且在播','已关注但未开播','未关注且在播'])test('live-plaza.html','关注区仅展示',`关注栏筛选${state}`,[`主播B处于${state}状态，另无关注主播正在直播`],['打开首页','查看关注头像栏'],state==='已关注且在播'?'关注头像栏展示主播B':'隐藏关注头像栏',{point:'关注栏数据范围'});

export default designs;
