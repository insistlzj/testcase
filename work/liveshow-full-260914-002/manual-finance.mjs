import {test,ref,page,designs} from './design-cases.mjs';
export function calculation(op,values,names,unit='金币'){
 const symbols=values.map((_,i)=>`v${i}`);let result=op==='+'?values.reduce((a,b)=>a+b,0):op==='-'?values.slice(1).reduce((a,b)=>a-b,values[0]):op==='*'?values.reduce((a,b)=>a*b,1):op==='min'?Math.min(...values):values.slice(1).reduce((a,b)=>a/b,values[0]);result=Number(result.toFixed(10));
 return {公式:names.join(op),数据范围:'本条前置条件中的指定订单或账户',结果单位:unit,证据:[0],变量:values.map((v,i)=>({名称:symbols[i],业务含义:names[i],单位:unit,数值:v})),表达式:{运算:op,参数:symbols.map(变量=>({变量}))},最终值:result};
}
const recharge='admin-recharge-order-detail.html';
for(const initial of [2000,1100,100])test(recharge,'退款后余额',`充值退款扣回1100金币、退款前余额${initial}`,['订单R1支付成功未退款，实付10USD，基础1000金币、赠送100金币',`当前用户余额${initial}金币，R1此前到账1100金币`],['打开充值订单R1详情','点击“手动退款”','输入原因“测试全额退款”','确认退款'],`退款后余额=${initial-1100}金币`,{point:'充值退款余额计算',flow:'FLOW-RECHARGE-REFUND',calc:calculation('-',[initial,1100],['退款前余额','原到账金币'])});
for(const result of ['原支付渠道退还10USD','生成一笔关联R1的退款单','R1状态更新为已退款'])test(recharge,'手动退款',`充值手动全退${result}`,['R1支付成功未退款，原支付渠道C1，实付10USD，到账1100金币'],['打开R1充值订单详情','点击“手动退款”','输入原因“测试退款”','确认退款'],result,{point:'充值整单退款',flow:'FLOW-RECHARGE-REFUND'});
for(const state of ['支付失败','已退款'])test(recharge,'仅支付成功且未退款',`${state}充值订单不可退款`,[`R1状态为${state}`],['打开R1充值订单详情'],'不提供可执行的退款操作',{point:'充值退款资格',dimension:'权限差异'});
test(recharge,'不支持部分','充值不支持部分退款',['R1实付10USD，支付成功未退款'],['打开R1充值订单详情','点击“手动退款”'],'退款金额固定为原实付10USD',{point:'整单退款金额'});
for(const obj of ['礼物消费','门票消费','主播收益','分成'])test(recharge,'不撤销已完成',`充值退款不回滚${obj}`,[`R1充值已用于完成${obj}相关业务；业务记录编号和值已留存，R1可退款`],['打开R1充值订单详情','点击“手动退款”','输入原因“测试退款”','确认退款',obj==='分成'?'打开主播分成记录中已记录的原批次':obj==='主播收益'?'打开原消费订单详情的主播收益':`打开已记录的${obj}订单详情`],`已完成的${obj}记录保持原值`,{point:'充值退款下游隔离',flow:'FLOW-RECHARGE-REFUND',sources:[ref(obj==='分成'?'admin-settlement-record.html':'admin-consumption-order-detail.html',obj==='分成'?'分成':'主播收益')]});
test(recharge,'后续充值余额','负余额后续充值先抵扣',['账号A当前余额-1000金币，新充值订单R2将到账1500金币，支付成功回调已到达'],['打开R2充值订单详情','查看账号余额'],'账号余额=500金币',{point:'负余额充值恢复',flow:'FLOW-RECHARGE-REFUND',calc:calculation('+',[-1000,1500],['原余额','新到账金币'])});
test('admin-refund-order.html','被动退款','渠道发起的全额退款记录',['渠道对R1完成全额退款10USD，原到账1100金币'],['打开退款订单列表','查询R1'],'R1退款类型显示被动退款',{point:'渠道被动退款',flow:'FLOW-RECHARGE-REFUND'});
for(const type of ['普通礼物','定制礼物','幸运礼物','门票'])test('admin-consumption-order-detail.html','只读且不可退款',`${type}消费订单不可退款`,[`C1为已成功${type}消费订单`],['打开C1消费订单详情'],'不提供退款操作',{point:'消费订单只读',dimension:'权限差异',flow:'FLOW-RECHARGE-REFUND'});
for(const type of ['普通礼物','定制礼物','门票'])test('admin-consumption-order-detail.html','主播收益：',`${type}成功消费收入`,[`C1单价20金币、数量3，消费成功，非运营账号`],['打开C1消费订单详情'],'主播收益=60金币',{point:'普通消费收益',calc:calculation('*',[20,3],['单价','数量'])});
for(const reward of [0,50,1000]){
 test('admin-consumption-order-detail.html','用户净消耗',`幸运礼物返奖${reward}后的用户净消耗`,[`C1幸运礼物实际扣款100金币，实际返奖${reward}金币`],['打开C1消费订单详情'],`用户净消耗=${100-reward}金币`,{point:'幸运礼物用户净消耗',calc:calculation('-',[100,reward],['订单扣款','实际返奖'])});
 test('admin-consumption-order-detail.html','主播收益：',`幸运礼物返奖${reward}不改变收益`,[`C1送出价值100金币，赠送时收益比例1%，实际返奖${reward}`],['打开C1消费订单详情'],'主播收益=1金币',{point:'幸运礼物收益独立',calc:calculation('*',[100,.01],['送出价值','赠送时比例'])});
}
for(const [key,detail,entity]of [['admin-settlement-record.html','admin-settlement-record-detail.html','主播'],['admin-guild-settlement-record.html','admin-guild-settlement-record-detail.html','公会']]){
 for(const ext of ['XLSX','XLS','CSV'])test(key,'上传文件：',`${entity}分成上传${ext}`, [`有效${ext}文件A按本页模板准备，包含${entity}A分成100USD、${entity}B分成200USD；线下财务已确定金额`],[`打开${page(key).entry}`,'点击“上传”',`上传文件A.${ext.toLowerCase()}`,'输入备注“九月已核算结果”','点击“确认上传”'],'进入导入预览',{point:'分成文件格式',flow:'FLOW-SETTLEMENT'});
 test(key,'确认上传只进入预览',`${entity}上传预览不立即入账`,['文件A有两条有效分成100USD、200USD，尚未确认导入'],[`打开${page(key).entry}`,'点击“上传”','上传文件A.csv','输入备注“测试批次”','点击“确认上传”'],'不生成正式分成记录',{point:'分成预览阶段',flow:'FLOW-SETTLEMENT'});
 for(const missing of ['文件','备注'])test(key,'上传文件和非空备注',`${entity}上传缺少${missing}`,['上传对话框已打开，另一必填项完整'],[`清空${missing}`,'点击“确认上传”'],'不进入导入预览',{point:'上传必填',dimension:'输入边界'});
 test(key,'回显文件名',`${entity}上传文件名回显`,['文件名为test-settlement.csv且内容按模板准备'],[`打开${page(key).entry}`,'点击“上传”','上传test-settlement.csv'],'对话框显示test-settlement.csv',{point:'文件选择回显'});
 test(key,'关闭预览不生成',`${entity}分成取消预览`,['已上传并预览有效批次A，尚未确认导入'],['关闭导入预览'],'不生成批次A分成记录',{point:'导入预览取消',dimension:'中断/取消'});
 test(key,'确认导入',`${entity}导入确认生成锁定记录`,['有效批次A已预览，条目金额100USD和200USD'],['点击“确认导入”'],'生成不可编辑或删除的批次A记录',{point:'分成导入提交',flow:'FLOW-SETTLEMENT'});
 test(detail,'分成总金额',`${entity}批次总额按明细汇总`,[`批次A包含${entity}A金额100USD、${entity}B金额200USD`],[`打开批次A的${entity}分成详情`],'分成总金额=300USD',{point:'分成批次合计',flow:'FLOW-SETTLEMENT',calc:calculation('+',[100,200],['A金额','B金额'],'USD')});
 test(key,'上传人',`${entity}导入操作人快照`,['当前后台账号为财务A，文件A数据有效'],[`打开${page(key).entry}`,'点击“上传”','上传文件A.csv','输入备注“测试”','点击“确认上传”','点击“确认导入”'],'上传人记录为财务A',{point:'财务操作留痕'});
 test(key,'下载 CSV 模板',`${entity}下载导入模板`,[],[`打开${page(key).entry}`,'点击“上传”','点击“下载模板”'],entity==='主播'?'CSV首行依次为主播名称、主播ID、公会名称、公会ID、分成金额':'CSV首行依次为公会名称、公会ID、分成金额(USD)',{point:'分成模板字段'});
 for(const position of ['开始日','区间内','结束日','开始日前','结束日后'])test(key,'筛选包含开始日和结束日',`${entity}上传日期${position}`,['筛选范围2026-09-01至2026-09-14',`批次A上传时间处于${position}`],[`打开${page(key).entry}`,'选择上传日期2026-09-01至2026-09-14','点击“查询”'],/前|后/u.test(position)?'结果不包含批次A':'结果包含批次A',{point:'上传日期边界',dimension:'输入边界'});
 test(key,'结束日早于开始日',`${entity}上传日期反序`,[],[`打开${page(key).entry}`,'选择开始日2026-09-14、结束日2026-09-01','点击“查询”'],'显示“结束日期不能早于开始日期”',{point:'上传日期合法性',dimension:'输入边界'});
}
for(const [key,entity]of [['admin-host-balance-change-record.html','主播'],['admin-guild-balance-change-record.html','公会']]){
 for(const amount of [-100.01,-100,-99.99,-.01,0,.01,100,1.001]){
  const valid=amount!==0&&amount>=-100&&Math.abs(amount*100-Math.round(amount*100))<1e-7;
  test(key,'变更金额：',`${entity}余额100时修正${amount}USD`,[`${entity}A当前余额100USD，备注“测试修正”`],[`打开${entity}A的余额变更记录`,'点击“余额变更”',`输入变更金额“${amount}”`,'输入备注“测试修正”','点击“确认”'],valid?`变更后余额=${Number((100+amount).toFixed(2))}USD`:'不生成非法金额的修正流水',{point:'手工修正金额边界',flow:'FLOW-SETTLEMENT-ADJUST',dimension:'输入边界',sources:[ref(key,'负向修正')],calc:valid?calculation('+',[100,amount],['修正前余额','有符号变更'],'USD'):null});
 }
 for(const close of ['取消','关闭','遮罩'])test(key,'点击取消、关闭或遮罩',`${entity}余额变更${close}`,['A余额100USD，变更对话框已填写+10及备注，但尚未提交'],[`点击${close==='遮罩'?'变更弹窗外遮罩':`“${close}”`}`],'A余额仍为100USD',{point:'余额变更取消',dimension:'中断/取消'});
 test(key,'备注：',`${entity}修正原因必填`,['A余额100USD'],[`打开${entity}A余额变更记录`,'点击“余额变更”','输入金额“10”','清空备注','点击“确认”'],'不生成缺少原因的修正流水',{point:'余额修正留痕必填',dimension:'输入边界'});
 test(key,'不可修改',`${entity}修正流水不可改写`,['修正流水A已成功生成'],[`打开${entity}A余额变更记录`,'查看流水A'],'不提供修改流水A的操作',{point:'修正流水不可变更'});
}
for(const [key,entity]of [['admin-host-account-balance.html','主播'],['admin-guild-account-balance.html','公会']]){
 test(key,'账户余额：',`${entity}账户按入账和正负修正累计`,[`${entity}A分成入账100USD、正修正20USD、负修正-30USD`],[`打开${page(key).entry}`,'查询A'],'A账户余额=90USD',{point:'结算账户余额',calc:calculation('+',[100,20,-30],['入账','正修正','负修正'],'USD')});
 test(key,'汇总卡：',`${entity}账户汇总只取筛选结果`,['A余额100USD、B余额200USD、C余额900USD，筛选条件只匹配A和B'],[`打开${page(key).entry}`,'输入仅匹配A和B的查询条件','点击“查询”'],'汇总余额=300USD',{point:'账户筛选合计',calc:calculation('+',[100,200],['A余额','B余额'],'USD')});
 test(key,'重置清空',`${entity}余额查询重置`,['A、B、C三账户余额分别100、200、900，当前筛选仅A'],[`打开${page(key).entry}`,'点击“重置”'],'恢复全部三个账户',{point:'余额筛选重置'});
}
for(const [key,scope]of [['guild-share-ledger.html','主播'],['guild-share-income.html','公会']]){
 test(key,'分成时间与收益所属周期可以跨月',`${scope}分成按入账时间处理跨月`,['财务结果所属收益周期2026年8月，实际入账2026-09-14 10:00，金额100USD'],[`打开${page(key).entry}`],'分成时间对应2026年9月14日10时00分，而非8月收益周期',{point:'收益周期与入账时间',flow:'FLOW-SETTLEMENT'});
 test(key,'法定货币',`${scope}负向分成修正展示`,['财务已入账一笔金额-10USD的修正结果'],[`打开${page(key).entry}`],'该笔金额显示-10USD',{point:'有符号分成结果',flow:'FLOW-SETTLEMENT-ADJUST'});
 test(key,key==='guild-share-income.html'?'不提供日期筛选':'系统不在线计算',`${scope}分成记录不提供在线审批`,['当前公会已有财务上传分成结果'],[`打开${page(key).entry}`],'不提供在线分成申请或审批操作',{point:'线下财务边界'});
}
export default designs;
