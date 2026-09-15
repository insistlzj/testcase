import {page,model} from './design-current.mjs';
const A='管理后台',G='公会App';
const queries=[
 ['admin-user-list.html','用户列表','财富等级2至3','注册日期09/01至09/02'],
 ['admin-host-list.html','主播列表','所属公会甲','账号状态正常'],
 ['admin-host-review.html','主播审核','公会甲','状态待审核'],
 ['admin-live-management.html','直播管理','主播甲','直播状态直播中'],
 ['admin-account-violation.html','账号违规记录','被举报账号甲','处理状态待处理'],
 ['admin-placement-config.html','展位配置','展示位置直播广场运营位','状态展示'],
 ['admin-push-management.html','推送管理','目标用户为指定公会用户','状态待发送'],
 ['admin-recharge-order.html','充值订单','用户甲','状态支付成功'],
 ['admin-consumption-order.html','消费订单','用户甲','消费类型普通礼物'],
 ['admin-refund-order.html','退款订单','用户甲','退款日期09/01至09/02'],
 ['admin-operation-accounts.html','运营账号','所属公会甲','账号状态启用'],
 ['admin-operation-issue-records.html','虚拟金币发放记录','公会甲','运营账号乙'],
 ['admin-operation-gift-records.html','虚拟金币送礼记录','公会甲','运营账号乙'],
 ['admin-consumption-order-detail-report.html','消费订单明细','关键词用户甲','时间09/01至09/02'],
 ['admin-refund-order-detail-report.html','退款订单明细','用户甲','时间09/01至09/02'],
 ['admin-recharge-order-detail-report.html','充值订单明细','用户甲','时间09/01至09/02']
];
for(const [key,name,first,second] of queries){
 const pg=page(A,key,[`测试管理员已登录，具备${name}查询权限`,`记录R001同时满足“${first}”和“${second}”；R002仅满足前者、R003仅满足后者，三者均可在无条件列表查看`]);
 pg.add(`${name}筛选条件取交集`,[],[`打开${name}`,`设置${first}`,`设置${second}`,'点击查询'],[{point:'查询交集包含',result:'当前结果包含R001'},{point:'查询交集排除第一条件独立命中',result:'当前结果不包含R002'},{point:'查询交集排除第二条件独立命中',result:'当前结果不包含R003'}],[/取交集|筛选/]);
}
for(const [key,name] of [['guild-join-review.html','入会审核'],['guild-leave-review.html','退会审核']]){
 const pg=page(G,key,['公会长甲已登录并选择公会甲；申请J001审核中，J002已通过，J003已驳回']);
 for(const [state,id] of [['审核中','J001'],['已通过','J002'],['已驳回','J003']])pg.add(`${name}选择${state}`,[],[`打开${name}`,`选择${state}Tab`],[{point:`${name}状态过滤`,result:`当前列表仅包含${id}`}],[/状态 Tab|对应状态/]);
 pg.add(`${name}初次打开默认审核中`,[],[`打开${name}`],[{point:`${name}默认状态`,result:'审核中Tab处于选中状态'}],[/默认审核中/]);
}
const seen=new Set();
for(const r of model.requirements){
 const matches=[...r.body.matchAll(/按(?:照)?((?:通知生成|通知|发生|生成|最后消息|提交|申请|加入|关注|拉黑|开播|发送|分成|赠送|获得|创建|更新)时间)(?:从晚到早|倒序)/g)];
 const p=model.pages[r.page];
 for(const [,field] of matches){
  const key=`${r.page}:${field}`;if(seen.has(key))continue;seen.add(key);
  const name=p.name.replace(/^视图-/,'').replaceAll('-',' / ');
  page(p.endName,p.原型页面).add(`${name}按${field}倒序`,[...p.preconditions,`两条当前有效记录甲、乙都满足本页范围；甲${field}为09/14 10:00，乙为09/14 11:00；无置顶或更高优先级差异`],[`打开${name}`,'查看记录甲乙的顺序'],[{point:`${field}降序`,result:'乙排在甲前面'}],[],{sourceIds:[r.id]});
 }
}
page(A,'admin-recharge-package.html').add('修改套餐不重算历史已完成订单',['P001原基础100、赠送20，C001按旧配置支付成功；管理员已将P001基础改为200'],['打开充值订单','查看 C001'],[{point:'套餐修改后的到账快照',result:'C001 总到账金币仍为120'}],[/不追溯已完成/]);
const sensitive=page(A,'admin-sensitive-words.html',['管理员有敏感词导入权限']);
sensitive.add('导入缺少词条的记录',['已按当前导入格式准备记录，其中一行敏感词为空'],['打开敏感词库','点击导入','选择测试文件','确认导入'],[{point:'敏感词导入必填',result:'缺少敏感词的记录未导入'}],[/校验必填/]);
sensitive.add('导入重复敏感词',['系统已有词“测试敏感词甲”，导入文件再次包含相同词'],['打开敏感词库','点击导入','选择重复词测试文件','确认导入'],[{point:'敏感词导入去重',result:'未新增重复的“测试敏感词甲”词条'}],[/重复词/]);
