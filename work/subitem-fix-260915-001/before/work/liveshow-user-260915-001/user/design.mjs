import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint} from '../../../scripts/requirement-traceability.mjs';
const task='work/liveshow-user-260915-001/user';
const basis=JSON.parse(await fs.readFile(`${task}/basis-index.json`,'utf8'));
const mainLines=(await fs.readFile(basis.输入[0].路径,'utf8')).split(/\r?\n/);
export const definitions=[];
// Each entry below is an authored test contract; this helper only records it.
export function suite(page,role,base,rows){
 const p=basis.页面[page];assert(p?.module,`未登记页面${page}`);
 for(const row of rows){const [point,pre,steps,result,ids,type='功能需求',priority='P2']=row;
  const refs=ids.split(' ').map(id=>{let r=basis.条款.find(r=>r.id===id&&r.end==='用户App')||basis.条款.find(r=>r.id===id);if(!r&&/^MAIN-\d+$/.test(id)){const line=Number(id.slice(5));assert(line>0&&line<491);const raw=mainLines[line-1];r={id,unitId:fingerprint([basis.输入[0].路径,line,raw])};}assert(r,`来源不存在${id}`);return r;});
  definitions.push({page,role,point,pre:[`${role}；当前处于${p.name.replace(/^视图-/,'')}页面`,...base,...pre],steps,result,refs:refs.map(r=>r.id),type,priority,sourceUnits:refs.map(r=>r.unitId)});
 }
}
const login='auth-login-register.html';
for(const [provider,id] of [['Google','REQ-40eeb040fd0b'],['Facebook','REQ-fd8fa4b8e076'],['Apple ID','REQ-b89d6085cb6c'],['TikTok','REQ-7cace569fd6a']]){
 const base=provider==='Apple ID'?['测试设备为iOS']:[];
 suite(login,'未登录用户',base,[
  [`${provider}授权入口`,['用户协议和隐私政策均已勾选'],[`点击${provider}登录`],`唤起${provider}授权页面`,`${id} REQ-76e70fcba89b`,'业务流程','P1'],
  [`${provider}未同意协议`,['协议未勾选'],[`点击${provider}登录`],'提示先同意用户协议和隐私政策','REQ-527b389bdcda','异常用例','P1'],
  [`${provider}取消授权`,['协议已勾选'],[`点击${provider}登录`,'在授权页面点击取消'],'提示“已取消授权”','REQ-a018ce659c74','异常用例','P1'],
  [`${provider}授权失败`,['协议已勾选','第三方授权服务返回失败'],[`点击${provider}登录`],'提示“登录失败，请重试”','REQ-a018ce659c74','异常用例','P1'],
  [`${provider}已有账号登录`,['协议已勾选',`${provider}账号已绑定一个正常状态的Luma Live账号`],[`点击${provider}登录`,'完成第三方授权'],'进入首页','REQ-b176b815ee3f REQ-af1de9dc6f1d','业务流程','P0'],
  [`${provider}新账号分流`,['协议已勾选',`${provider}账号从未关联Luma Live账号`],[`点击${provider}登录`,'完成第三方授权'],'进入资料补全页','REQ-b176b815ee3f REQ-af1de9dc6f1d','业务流程','P1'],
  [`${provider}封禁账号拦截`,['协议已勾选',`${provider}关联的账号已被平台封禁`],[`点击${provider}登录`,'完成第三方授权'],'不能进入已登录首页','REQ-c006ed524230 REQ-f07ba4f39c72','异常用例','P0'],
  [`${provider}冷静期分流`,['协议已勾选',`${provider}关联账号正在七日注销冷静期内`],[`点击${provider}登录`,'完成第三方授权'],'显示注销冷静期弹窗','REQ-b4c289296364 REQ-56ba02295864','业务流程','P1'],
 ]);
}
suite(login,'未登录用户',[],[
 ['Android不提供Apple登录',['测试设备为Android'],['查看第三方登录入口'],'不显示Apple ID登录入口','REQ-a550afe9b682'],
 ['手机号登录入口',[],['点击手机号登录'],'进入手机号登录页','REQ-5747707e2366'],
 ['邮箱登录入口',[],['点击邮箱登录'],'进入邮箱登录页','REQ-33b03452c3c7'],
 ['游客免协议进入',['协议未勾选'],['点击游客进入'],'进入游客首页','REQ-34712a13e43f REQ-99f5b6a332c2'],
]);
for(const [page,mode,formatId,codeId,passwordId,defaultId,sendId,successId,switchId,coolingId] of [
 ['auth-phone-login.html','短信','REQ-769e98db4e74','REQ-43f78ae14856','REQ-c45bffcc76df','REQ-efd41a453368','REQ-d11325bdaeb3','REQ-710f264aa1d8','REQ-d2a5c2bc5ab7','REQ-89e915f8f5a2'],
 ['auth-email-login.html','邮箱','REQ-830b83c03a0b','REQ-6093735e3bc3','REQ-ded540825cfd','REQ-76e9f678da24','REQ-73f4f8991460','REQ-b92d5c7ef6a0','REQ-6369e820dcd5','REQ-23a6b59cab38']]){
 const account=mode==='短信'?'手机号':'邮箱',valid=mode==='短信'?'81234567890':'qa.user@example.test';
 suite(page,'未登录用户',[],[
  ['默认验证码方式',[],['查看登录方式'],`默认使用${mode}验证码登录`,defaultId],
  ['密码方式切换',[],['点击使用密码登录'],'显示密码登录表单',switchId],
  ['验证码方式切换',['当前选择密码登录'],[`点击使用${mode}验证码登录`],`显示${mode}验证码登录表单`,switchId],
  ['获取验证码',[`${account}${valid}有效且属于测试人员可接收的测试账号`],[`输入${account}${valid}`,'点击获取验证码'],'开始60秒重发倒计时',sendId,'业务流程','P1'],
  ['倒计时内重复获取',[`${account}有效；验证码发送成功后已过59秒`],['查看获取验证码按钮'],'获取验证码按钮不可用',sendId,'逻辑校验','P1'],
  ['倒计时结束重新获取',[`${account}有效；验证码发送成功后已过60秒`],['点击获取验证码'],'允许重新发送验证码',sendId,'逻辑校验','P1'],
  ['验证码正常登录',[`${account}已注册且账号正常；协议已勾选；验证码已发送4分钟`],[`输入${account}及本次收到的正确六位验证码`,'点击继续'],'进入首页',`${codeId} ${successId}`,'业务流程','P0'],
  ['验证码五分钟到期',[`${account}已注册；协议已勾选；本次验证码发送后已满5分钟`],['输入本次已到期的验证码','点击继续'],'不能使用该验证码完成登录',codeId,'逻辑校验','P0'],
  ['第五次验证码错误失效',[`${account}已注册；协议已勾选；本次验证码仍在有效期内且已连续输错4次`],['输入错误验证码并点击继续','改为本次正确验证码并点击继续'],'当前验证码不能再完成登录',codeId,'逻辑校验','P0'],
  ['四次验证码错误后纠正',[`${account}已注册；协议已勾选；本次验证码仍在有效期内且已连续输错4次`],['输入本次正确验证码','点击继续'],'进入首页',`${codeId} ${successId}`,'逻辑校验','P1'],
  ['空密码拦截',[`${account}已输入；当前密码登录；协议已勾选`],['清空密码','查看继续按钮'],'不能提交密码登录',`${passwordId} ${successId}`,'异常用例','P1'],
  ['密码登录成功',[`${account}已注册；当前密码登录；协议已勾选；账号状态正常`],['输入正确密码','点击继续'],'进入首页',successId,'业务流程','P0'],
  ['协议未勾选拦截',[`${account}及登录凭证有效；协议未勾选`],['查看继续按钮'],'继续按钮不可用',successId,'异常用例','P1'],
  ['注销冷静期拦截',[`${account}及登录凭证有效；协议已勾选；账号正在七日注销冷静期`],['点击继续'],'显示注销冷静期弹窗',coolingId,'业务流程','P1'],
 ]);
 for(const value of ['12345','1234567','12a456',''])suite(page,'未登录用户',[`${account}有效；协议已勾选`],[[`验证码格式${value||'空'}`,[],[`输入验证码“${value}”`,'查看继续按钮'],'不能提交不符合六位数字格式的验证码登录',codeId,'逻辑校验','P1']]);
 if(mode==='短信')for(const n of [7,8,15,16])suite(page,'未登录用户',[],[[`手机号${n}位`,[],[`输入由${n}个“8”组成的手机号`,'查看获取验证码按钮'],n<8||n>15?'不能为该手机号发送验证码':'允许为该手机号获取验证码',`${formatId} ${sendId}`,'逻辑校验','P1']]);
 else for(const value of ['qa.user@example.test','invalid-email','@example.test','qa@',''])suite(page,'未登录用户',[],[[`邮箱格式${value||'空'}`,[],[`输入邮箱“${value}”`,'查看获取验证码按钮'],value==='qa.user@example.test'?'允许为该邮箱获取验证码':'不能为该邮箱发送验证码',`${formatId} ${sendId}`,'逻辑校验','P1']]);
}
suite('auth-country-select.html','未登录用户',['手机号登录页已填入81234567890且已勾选协议'],[
 ['按地区名称搜索',[],['输入国家或地区名称“印度尼西亚”'],'搜索结果包含印度尼西亚','REQ-016b98abdeb4 REQ-5efb5b6424f2'],
 ['按区号搜索',[],['输入区号“+62”'],'搜索结果包含印度尼西亚+62','REQ-5efb5b6424f2'],
 ['搜索无结果',[],['输入不属于支持地区的关键字“zzzz-no-country”'],'显示无结果空态','REQ-016b98abdeb4'],
 ['清空地区搜索',['搜索结果正在筛选'],['清空搜索内容'],'恢复全部可选地区列表','REQ-5efb5b6424f2'],
 ['不提供86区号',[],['输入区号“+86”'],'结果不包含中国大陆+86','REQ-69c9aabd57c2'],
 ['统一地区列表',[],['查看地区列表分组'],'不设置常用地区分组','REQ-9964c7ed44cf'],
 ['选中地区返回',[],['选择印度尼西亚+62'],'返回手机号登录页','REQ-dde5b29e8c31'],
 ['选择后保留手机号',[],['选择印度尼西亚+62'],'手机号输入仍为81234567890','REQ-dde5b29e8c31'],
 ['选择后保留协议',[],['选择印度尼西亚+62'],'协议仍为勾选状态','REQ-dde5b29e8c31'],
 ['返回不修改区号',['原选中区号为+60'],['点击返回'],'手机号登录页区号仍为+60','REQ-b77a464b1c11'],
 ['不支持设备地区回退',['设备地区为中国大陆且未设置过区号'],['查看当前勾选的地区'],'当前选中印度尼西亚+62','REQ-928c2429a102'],
 ['未知设备地区回退',['无法识别设备地区且未设置过区号'],['查看当前勾选的地区'],'当前选中印度尼西亚+62','REQ-928c2429a102'],
]);
suite('auth-profile-completion.html','首次登录的新用户',[],[
 ['默认头像',[],['查看头像'],'显示系统默认头像','REQ-4fbd7f2670b0'],
 ['默认昵称',[],['查看昵称'],'显示系统默认昵称','REQ-01f0e1f8b741'],
 ['选择预置头像',[],['点击更换头像','选择一个不同的预置头像'],'头像预览更新为所选头像','REQ-4fbd7f2670b0'],
 ['昵称为空',[],['清空昵称','点击保存并进入首页'],'不能保存空昵称','REQ-01f0e1f8b741','异常用例','P1'],
 ['二十字昵称',[],['输入由20个“测”组成的昵称','点击保存并进入首页'],'进入首页','REQ-01f0e1f8b741 REQ-aa7f3f33dfc4','逻辑校验','P1'],
 ['昵称超长',[],['输入由21个“测”组成的昵称','点击保存并进入首页'],'不能保存超过20个字符的昵称','REQ-01f0e1f8b741','逻辑校验','P1'],
 ['保存自定义资料',['预置头像已选为与默认不同的头像'],['输入昵称“测试昵称”','点击保存并进入首页','查看我的资料昵称'],'昵称为“测试昵称”','REQ-52eaf2e65674 REQ-aa7f3f33dfc4'],
 ['跳过补全',[],['点击先跳过'],'进入首页','REQ-92108788a9ad'],
]);
await fs.writeFile(`${task}/auth-design-draft.json`,JSON.stringify(definitions,null,2)+'\n');
console.log({独立设计:definitions.length,说明:'尚未渲染用例，待后续语义及覆盖核对'});
