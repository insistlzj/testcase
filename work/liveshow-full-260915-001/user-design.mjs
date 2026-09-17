import {add,table,observe,expr,v,op} from './design.mjs';
const guest={role:'未登录用户'};
for(const [provider,line] of [['Google',1350],['Facebook',1351],['Apple ID',1352],['TikTok',1353]]) {
  const device=provider==='Apple ID'?'测试设备为 iOS':'测试设备支持该第三方授权';
  const entry=`进入登录与注册页~点击${provider}登录`;
  add([line,1366],`${provider}登录唤起授权`,`${provider}授权入口`,`${device}~两份当前版本协议已勾选`,entry,`显示${provider}授权页面`,'normal',guest);
  add([line,1365],`${provider}登录未同意协议`,`${provider}协议校验`,`${device}~用户协议及隐私政策均未勾选`,entry,'提示先同意《用户协议》和《隐私政策》','boundary',guest);
  add([line,1357,1365],`${provider}未同意协议不发起授权`,`${provider}协议拒绝执行`,`${device}~协议确认未勾选`,entry,'不发起第三方授权','boundary',guest);
  add([line,1359,1366],`${provider}已有账号完成登录`,`${provider}登录去向`,`${device}~两份协议已勾选~${provider}账号关联一个状态正常的 Luma Live 账号`,`${entry}~确认第三方授权`,'进入首页','smoke',guest);
  add([line,1359],`${provider}新账号首次授权`,`${provider}注册去向`,`${device}~两份协议已勾选~${provider}账号从未注册 Luma Live`,`${entry}~确认第三方授权`,'进入资料补全页','core',guest);
  for(const [field,expected] of [['用户 ID','资料补全完成后个人中心显示新账号的用户 ID'],['默认昵称','资料补全页昵称已填入系统默认昵称'],['默认头像','资料补全页显示系统默认头像']]) add([line,1359,1377,1378,679],`${provider}首次注册分配${field}`,`${provider}${field}`,`${device}~两份协议已勾选~第三方账号未注册过 Luma Live`,`${entry}~确认第三方授权${field==='用户 ID'?'~点击跳过~进入我的':''}`,expected,'core',guest);
  add([line,1360,1367],`${provider}用户取消授权`,`${provider}取消授权提示`,`${device}~两份协议已勾选`,`${entry}~点击授权页取消`,'Toast 提示“已取消授权”','alternate',guest);
  add([line,1360,1367],`${provider}取消授权后的停留位置`,`${provider}取消后页面`,`${device}~两份协议已勾选`,`${entry}~点击授权页取消`,'停留登录与注册页','alternate',guest);
  add([line,1367],`${provider}授权服务失败`,`${provider}授权失败提示`,`${device}~两份协议已勾选~环境准备要求：需提供隔离测试环境，将本次第三方授权回调设为失败；当前故障模拟方式待准备`,`${entry}~确认第三方授权`,'Toast 提示“登录失败，请重试”','error',guest);
  add([line,1360],`${provider}未返回有效账号标识`,`${provider}无效标识拦截`,`${device}~两份协议已勾选~环境准备要求：需可控第三方回调，在本次授权成功响应中不提供有效账号标识；当前待准备`,`${entry}~确认第三方授权`,'停留登录与注册页','error',guest);
  add([line,1361,1368],`${provider}封禁账号授权`,`${provider}封禁提示`,`${device}~两份协议已勾选~第三方身份关联已封禁的 Luma Live 账号`,`${entry}~确认第三方授权`,'Toast 提示“账号已被封禁”','boundary',guest);
  add([line,1362,1369],`${provider}注销冷静期账号登录`,`${provider}冷静期分流`,`${device}~两份协议已勾选~关联账号的注销申请仍处于七日冷静期`,`${entry}~确认第三方授权`,'显示注销冷静期弹窗','core',guest);
}
table(`
1363|iOS 登录页提供 Apple 入口|Apple 入口可见性|测试设备为 iOS|进入登录与注册页|显示 Apple ID 登录入口
1363|Android 登录页不提供 Apple 入口|Apple 入口可见性|测试设备为 Android|进入登录与注册页|不显示 Apple ID 登录入口
1370|通过手机号入口切换登录页|手机号登录去向|账号未登录|进入登录与注册页~点击手机号登录|进入手机号登录页
1371|通过邮箱入口切换登录页|邮箱登录去向|账号未登录|进入登录与注册页~点击邮箱登录|进入邮箱登录页
1372|未勾选协议以游客进入|游客首页去向|两份登录协议均未勾选|进入登录与注册页~点击游客进入|进入首页
1377,1378|首次补全保留默认昵称|初始昵称|新注册账号尚未完成资料补全|进入资料补全页~查看昵称|昵称显示系统生成的默认值
1379,1381|跳过资料补全|跳过去向|新注册账号使用系统默认资料|进入资料补全页~点击跳过|进入首页
1378,1380|填写昵称后完成资料补全|补全保存去向|新注册账号未完成补全|进入资料补全页~填写昵称“新用户甲”~点击保存|进入首页
1378|资料补全昵称为空|昵称必填校验|新注册账号未完成补全|进入资料补全页~清空昵称~点击保存|不接受空昵称
1378|资料补全昵称达到20字符|昵称长度上限|新注册账号未完成补全|进入资料补全页~输入20个字符的昵称~点击保存|接受20字符昵称
1378|资料补全昵称超过20字符|昵称长度上限|新注册账号未完成补全|进入资料补全页~输入21个字符的昵称~点击保存|不能保存超过20字符的昵称
`,'normal',guest);
for(const [label,base,code,send,success,method,cooling] of [['手机号',1387,1388,1393,1394,1396,1397],['邮箱',1415,1416,1420,1421,1422,1423]]) {
  const channel=label==='手机号'?'短信':'邮箱';const identity=label==='手机号'?'81234567890':'qa.user@example.com';
  const start=`进入${label}登录页${label==='手机号'?'~选择国家区号+62':''}`;
  const setup=`已有状态正常的账号绑定${label}“${identity}”~当前版本用户协议和隐私政策已同意`;
  add([base,success],`${label}验证码完成登录`,`${label}登录去向`,`${setup}~已收到仍有效且未使用的6位验证码123456`,`${start}~填写${label}“${identity}”~输入验证码123456~点击继续`,'进入首页','smoke',guest);
  add([base,success,method],`${label}密码完成登录`,`${label}密码登录去向`,`${setup}~账号已设置密码 TestPass8`,`${start}~切换使用密码登录~填写${label}“${identity}”~输入密码 TestPass8~点击继续`,'进入首页','core',guest);
  add([send],`${channel}发送后禁止重复获取`,`${channel}发送倒计时`,setup,`${start}~填写${label}“${identity}”~点击获取验证码`,'获取验证码按钮进入60秒倒计时','boundary',guest);
  add([send],`${channel}发送满60秒可重新获取`,`${channel}重新获取入口`,`${setup}~上次验证码发送成功距今已满60秒`,`${start}~填写${label}“${identity}”~查看获取验证码按钮`,'获取验证码按钮可用','boundary',guest);
  for(const [input,desc] of [['12345','5位'],['1234567','7位'],['12a456','含字母'],['','空值']]) add([code,success],`${label}验证码${desc}`,`${channel}验证码格式`,setup,`${start}~填写${label}“${identity}”~${input?`输入验证码“${input}”`:'清空验证码'}`,'继续按钮不可用','boundary',guest);
  add([code,success],`${label}验证码超过5分钟`,`${channel}验证码有效期`,`${setup}~验证码123456已签发5分1秒且未使用`,`${start}~填写${label}“${identity}”~输入验证码123456~点击继续`,'不接受已过期验证码','boundary',guest);
  add([code],`${label}验证码连续错误达到5次`,`${channel}验证码错误次数`,`${setup}~当前验证码123456已连续验证错误4次`,`${start}~填写${label}“${identity}”~输入错误验证码654321~点击继续~输入原验证码123456~点击继续`,'当前验证码123456已失效','boundary',guest);
  add([cooling],`${label}凭证通过后命中冷静期`,`${label}冷静期分流`,`${setup}~账号仍在七日冷静期~可用验证码为123456`,`${start}~填写${label}“${identity}”~输入验证码123456~点击继续`,'显示注销冷静期弹窗','core',guest);
  add([method],`${label}切换密码方式`,`${label}密码输入入口`,setup,`${start}~点击使用密码登录`,'显示密码输入框','alternate',guest);
  add([method],`${label}切回验证码方式`,`${label}验证码输入入口`,setup,`${start}~点击使用密码登录~点击${channel}验证码登录`,'显示验证码输入框','alternate',guest);
}
for(const [input,allowed] of [['1234567',false],['12345678',true],['123456789012345',true],['1234567890123456',false],['12345a78',false]]) add([1387,1393],`手机号输入“${input}”`, '手机号位数校验','国家区号为+62',`进入手机号登录页~输入手机号“${input}”~查看获取验证码按钮`,`获取验证码按钮${allowed?'可用':'不可用'}`,'boundary',guest);
for(const address of ['qa.example.com','qa@','@example.com','']) add([1415,1420],`邮箱地址${address||'为空'}时获取验证码`,'邮箱格式校验','当前为邮箱验证码登录方式',`进入邮箱登录页~${address?`输入邮箱“${address}”`:'清空邮箱'}~查看获取验证码按钮`,'获取验证码按钮不可用','boundary',guest);
table(`
1386|设备地区无法识别时选取区号|默认国际区号|设备地区无法识别|进入手机号登录页~查看区号|区号显示+62
1386|区号入口只显示数字|国际区号内容|当前区号为+62|进入手机号登录页~查看区号入口|区号入口显示+62
1403,1405|国家列表排除中国大陆|支持地区范围|账号未登录|进入选择国家/地区页~输入搜索词“+86”|不提供中国大陆+86选项
1402,1408|按印尼区号搜索|区号搜索结果|账号未登录|进入选择国家/地区页~输入搜索词“+62”|结果包含印度尼西亚+62
1402|地区搜索无匹配|地区搜索空态|搜索词为不存在的国家名“无此地区甲”|进入选择国家/地区页~输入搜索词“无此地区甲”|显示空状态
1408|清空地区关键词|地区搜索恢复|搜索框当前为+62|进入选择国家/地区页~清空搜索框|恢复全部可选地区
1409|选择地区后保留手机号|手机号返回保留|手机号已输入81234567890|进入选择国家/地区页~选择马来西亚+60|手机号登录页保留81234567890
1409|选择地区后更新区号|选中区号回填|原区号为+62|进入选择国家/地区页~选择马来西亚+60|返回后区号显示+60
1409|选择地区后保留密码登录方式|登录方式返回保留|手机号页当前为密码登录方式|进入选择国家/地区页~选择马来西亚+60|返回后仍为密码登录方式
1409|选择地区后保留协议选择|协议选择返回保留|手机号页协议已勾选|进入选择国家/地区页~选择马来西亚+60|返回后协议仍为勾选状态
1410|返回地区页不修改原区号|取消选择区号|原区号为+62|进入选择国家/地区页~点击返回|返回后区号仍为+62
1531|冷静期暂不取消注销|冷静期暂不取消去向|账号仍在七日冷静期，登录页已显示冷静期弹窗|点击暂不取消|停留登录与注册页
1530,1531|冷静期取消注销后登录|取消注销登录去向|账号仍在七日冷静期，登录页已显示冷静期弹窗|点击取消注销|进入首页
`,'alternate',guest);

// Account security forms share the same declared verification contract; each target has its own evidence.
for(const [name,verify,password,repeat,failure,success,send,button] of [['设置密码',1486,1487,1488,1490,1491,1492,'完成'],['忘记密码',1513,1514,1515,1517,1518,1519,'重置密码']]) {
  const page=`进入${name}页`,passwordField=name==='设置密码'?'登录密码':'新密码';
  for(const channel of ['手机号','邮箱']) {
    const setup=`账号已绑定可接收验证码的${channel}~${name==='设置密码'?'账号尚未设置密码':'账号原密码为 OldPass8'}~本次签发验证码为123456，状态按本条场景准备`;
    add([verify,password,repeat,success,name==='设置密码'?1494:1521],`${name}通过${channel}验证完成`,`${name}完成去向`,setup,`${page}~选择${channel}验证~输入验证码123456~输入${passwordField} NewPass8~输入确认密码 NewPass8~点击${button}`,'返回设置页','core');
    for(const [bad,state] of [['654321','错误'],['123456','已过期'],['123456','已使用']]) add([failure],`${name}拒绝${state}${channel}验证码`,`${name}验证码拒绝后输入保留`,`${setup}~本次提交的验证码${bad}为${state}`,`${page}~选择${channel}验证~输入验证码${bad}~输入${passwordField} NewPass8~输入确认密码 NewPass8~点击${button}`,'保留本次输入内容','boundary');
    add([send],`${name}向${channel}发送验证码`,`${name}验证码重发间隔`,setup,`${page}~选择${channel}验证~点击获取验证码`,'获取验证码按钮进入60秒倒计时','boundary');
  }
  for(const count of [0,7,8]) add([password,name==='设置密码'?1493:1520],`${name}密码长度为${count}`,`${name}密码长度校验`, '账号已绑定手机号；本次收到的有效验证码为123456',`${page}~选择手机号验证~输入验证码123456~${count?`输入${passwordField}“${'a'.repeat(count)}”`:`清空${passwordField}`}~${count?`输入确认密码“${'a'.repeat(count)}”`:'清空确认密码'}~查看${button}按钮`,`${button}按钮${count<8?'不可用':'可用'}`,'boundary');
  add([repeat],`${name}两次密码不一致`,`${name}确认密码校验`,'本次手机号验证码123456有效',`${page}~输入验证码123456~输入${passwordField} NewPass8~输入确认密码 OtherPass8~点击${button}`,'不提交密码变更','boundary');
}
table(`
1499,1502,1505|修改密码使用错误旧密码|当前密码校验|账号当前密码为OldPass8|进入修改密码页~输入当前密码 WrongPass8~输入新密码 NewPass8~输入确认新密码 NewPass8~点击保存|保留当前输入
1500,1505|新密码与原密码相同|新旧密码差异|账号当前密码为OldPass8|进入修改密码页~输入当前密码 OldPass8~输入新密码 OldPass8~输入确认新密码 OldPass8~点击保存|不修改账号密码
1501,1505|修改密码的两次新值不同|确认新密码校验|账号当前密码为OldPass8|进入修改密码页~输入当前密码 OldPass8~输入新密码 NewPass8~输入确认新密码 OtherPass8~点击保存|不修改账号密码
1503,1507|修改密码完成后返回|改密完成去向|账号当前密码为OldPass8|进入修改密码页~输入当前密码 OldPass8~输入新密码 NewPass8~输入确认新密码 NewPass8~点击保存|返回设置页
1504,1506|忘记当前密码转验证重置|忘记密码去向|账号已设置密码|进入修改密码页~点击忘记当前密码|进入忘记密码页
1454|登录页不提供密码维护|登录页密码维护入口|账号未登录|进入登录与注册页|不提供设置密码、修改密码或忘记密码入口
1455,1491|设置密码后通过绑定邮箱登录|账号密码复用|账号已绑定邮箱qa.user@example.com且刚设置密码NewPass8|退出当前登录~进入邮箱登录页~切换使用密码登录~输入邮箱qa.user@example.com~输入密码NewPass8~勾选用户协议和隐私政策~点击继续|进入首页
1503|改密后旧密码不能登录|旧密码失效|账号绑定邮箱qa.user@example.com；密码已由OldPass8改为NewPass8|退出当前登录~进入邮箱登录页~切换使用密码登录~输入邮箱qa.user@example.com~输入密码OldPass8~勾选用户协议和隐私政策~点击继续|不能使用OldPass8登录
`,'core',{flow:'ACCOUNT-SECURITY'});
