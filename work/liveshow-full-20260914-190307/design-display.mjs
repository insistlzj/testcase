import {model,page} from './design-current.mjs';
// Only explicit identity, snapshot and timestamp fields are expanded here. Form rules,
// calculations, lifecycle conditions and ambiguous fields remain for separate design.
const values=new Map([
 ['用户 ID','1001'],['用户ID','1001'],['主播 ID','2001'],['主播ID','2001'],['公会 ID','3001'],['公会ID','3001'],
 ['礼物 ID','4001'],['礼物ID','4001'],['道具 ID','5001'],['规则 ID','6001'],['类型 ID','7001'],['档位 ID','8001'],['账号 ID','9001'],['角色 ID','9002'],
 ['昵称','测试昵称甲'],['名称','测试名称甲'],['ID','1001'],['用户名称','测试用户甲'],['主播名称','测试主播甲'],['公会名称','测试公会甲'],['道具名称','测试道具甲'],['礼物名称','测试礼物甲'],['角色名称','测试角色甲'],
 ['登录账号','qa.ops@example.com'],['后台账号','qa_admin_01'],['姓名','测试姓名甲'],['电话','+6281234567890'],['联系电话','+6281234567890'],
 ['申请单号','J001'],['审核单号','AU001'],['退款单号','RF001'],['排班编号','IN001'],['直播场次 ID','S001'],['场次 ID','S001'],['订单号','O001'],['渠道交易号','CH001'],['推送 ID','PUSH001'],['任务 ID','TASK001'],['套餐 ID','PK001'],
 ['标题','测试通知甲'],['正文','测试业务通知内容甲'],['退会原因','测试退会原因甲'],['分成备注','测试九月分成甲'],['操作人','测试操作员甲'],
 ['申请时间','2026/09/14 10:01'],['提交时间','2026/09/14 10:02'],['注册时间','2026/09/01 10:03'],['开播时间','2026/09/14 10:04'],['赠送时间','2026/09/14 10:05'],['发送时间','2026/09/14 10:06'],['发放时间','2026/09/14 10:07'],['成功时间','2026/09/14 10:08'],['退款时间','2026/09/14 10:09'],['更新时间','2026/09/14 10:10'],
 ['直播主题','测试场次主题甲'],['设备','测试设备甲'],['系统','Android 15'],['应用版本','1.0.0'],['最近登录时间','2026/09/14 10:11'],['直播间 ID','60001'],['备注','测试备注甲'],['操作原因','测试操作原因甲'],['上传人','测试财务甲'],['发送人','测试公会长甲'],['公会长名称','测试公会长甲'],['加入时间','2026/09/01 10:00']
]);
for(const r of model.requirements){
 if(!r.field || /必填|选填|输入|最多|最少|唯一性|不可重复|不得小于|不得大于|只能|固定|后台配置|模糊匹配/.test(r.body))continue;
 const p=model.pages[r.page];
 if(/编辑|设置|新建|发送消息|添加|确认|筛选|选择/.test(p.name)||p.原型页面.includes('-create.'))continue;
 // Display checks never infer an editable control from a read-only field description.
 const fields=r.field.split(/\s*\/\s*/);
 if(/(?:资料|信息|材料|明细|快照|操作记录|登录设备|记录)$/.test(r.field)&&!/[×*]|计数|数量合计|不得|输入|选填/.test(r.body)){
  for(const name of values.keys())if(r.body.includes(name)&&!fields.includes(name))fields.push(name);
 }
 for(let field of fields){
  const value=values.get(field);if(!value)continue;
  const state=/已处理|处理后|已驳回|未发生/.test(r.body)?'目标记录对应事件已经发生，处理记录已保存':/已退会/.test(r.body)?'目标主播已退会，当前查看其历史记录':/成功/.test(r.body)?'目标记录已成功完成':'目标记录满足本页展示范围';
  const name=p.name.replace(/^视图-/,'').replaceAll('-',' / ');
  const conditions=[...p.preconditions,`${name}中目标记录唯一可定位为记录甲；${state}`,`该记录的${field}来源值为“${value}”；另有记录乙的同字段值不同，二者不混用`,...(field.endsWith('时间')?['日期时间均以当前页面使用的时区准备，不测试尚未确认的跨时区换算']:[])];
  page(p.endName,p.原型页面).add(`${name}显示目标记录的${field}`,conditions,[`打开${name}`,`查看记录甲的${field}`],[{point:`${field}与当前对象绑定`,result:`记录甲的${field}显示“${value}”`}],[],{sourceIds:[r.id],type:'功能需求'});
 }
}
