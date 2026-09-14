import {batch as b,account,host,guild,admin} from './design-helpers.mjs';
import {pages,find,scenario} from './model.mjs';
b('views/live-room-host/focus-viewers.html',host,['在当前直播打开重点观众'],[
 ['验证离线用户移出重点观众','重点观众实时性','甲原在重点观众列表，刚退出当前直播','刷新重点观众','列表不再包含甲'],
 ['验证重点标签可以同时命中','标签独立性','甲为新粉丝且本场贡献最高、未入团','查看甲的重点标签','甲同时具有新粉丝、本场贡献最高及未加入粉丝团三种标签'],
]);
b('views/live-room/contribution-gifts.html',account,['进入海风直播间','打开本场贡献','切换收到礼物'],[
 ['验证收到礼物仅统计本场成功赠送','场次礼物范围','本场成功玫瑰3件，失败2件，上一场成功5件','查看玫瑰数量','数量为3'],
 ['验证幸运贡献不因返奖减少','本场幸运贡献','本场成功幸运礼物价值100、返奖150','查看贡献值','贡献值为100'],
]);
for(const page of ['views/live-room/contribution-rank.html','views/live-room-host/contribution-rank.html'])b(page,page.includes('live-room-host')?host:account,['在当前场次打开本场贡献榜'],[
 ['验证本场贡献不混入历史场次','贡献场次隔离','甲本场贡献100、上场贡献1000','查看甲本场贡献','本场贡献为100'],
]);
for(const page of ['views/live-room/audience-online.html','views/live-room-host/audience-viewers.html'])b(page,page.includes('live-room-host')?host:account,['进入当前场次在线观众列表'],[
 ['验证离房用户从在线观众消失','在线范围','甲刚离开本场，乙仍在线','刷新在线观众','列表不包含甲'],
]);
b('views/live-room/audience-managers.html',account,['进入直播间在线观众','切换房管列表'],[['验证仅展示当前主播有效房管','房管归属','海风当前有效房管为甲，乙为另一主播的房管','查看列表','列表不包含乙']]);
b('views/live-room-host/muted-users.html',host,['在自己直播间打开禁用用户'],[['验证本场禁言用户列表范围','禁言列表','甲在本场被禁言，乙仅在上一场被禁言','查看列表','列表包含甲，不包含乙']]);
b('views/live-room-host/restore-speaking-confirm.html',host,['在本场禁用用户列表选择甲恢复发言'],[
 ['验证取消恢复保留禁言','恢复发言中断','甲目前在本场禁言','点击取消','甲仍处于本场禁言'],
 ['验证确认恢复解除本场禁言','恢复发言成功','甲目前在本场禁言','点击确认','甲的本场禁言解除'],
]);
b('views/live-room/blocked-room-restricted.html',account,['打开目标直播间'],[['验证踢出状态阻止本场再次进入','本场踢出准入','当前用户刚被该主播踢出本场','重新进入本场','无法观看本场直播内容']]);
b('guild-operation-account-select.html',guild,['从运营送礼记录进入账号选择'],[
 ['验证搜索后全选包含未命中账号','运营账号全选范围','当前公会有账号海风和月光',['搜索海风','点击全选运营账号','点击完成'],'筛选账号包含海风和月光'],
 ['验证选择账号保留原日期','筛选条件传递','送礼记录原日期为9月10日',['选择海风','点击完成'],'送礼记录日期仍为9月10日'],
]);
for(const [page,metric,pre,expected] of [
 ['admin-user-active-statistics.html','登录用户','甲当天成功登录3次，乙仅从后台切前台且当天未登录','登录用户为1'],
 ['admin-user-active-statistics.html','汇总卡','甲连续2天每天登录，本范围没有其他登录用户','汇总登录用户为2'],
 ['admin-monthly-income-expense.html','累计充值','本月成功充值20 USD，其中10 USD后来整单退款','累计充值仍为20 USD'],
 ['admin-monthly-income-expense.html','累计退款','本月两笔退款分别10和20 USD完成','累计退款为30 USD'],
 ['admin-monthly-host-earnings.html','幸运礼物收益','成功幸运礼物价值1000、当时比例1%，用户实际返奖1500','幸运礼物收益为10金币'],
 ['admin-monthly-viewer-consumption.html','净消耗','用户仅有成功幸运礼物扣减100，返奖150','净消耗为-50金币'],
 ['admin-monthly-gift-sales.html','礼物消费','成功幸运赠礼价值100，返奖150','礼物消费价值为100金币'],
 ['admin-consumption-order-detail-report.html','订单列表','本期真实成功礼物订单A，虚拟金币订单B、失败订单C','列表仅包含A'],
 ['admin-refund-order-detail-report.html','退款列表','A单9月10日支付、9月12日退款完成；筛选9月12日','退款列表包含A'],
 ['admin-recharge-order-detail-report.html','实付金额','A订单实付10 USD，套餐现价后来调整为20 USD','A订单实付金额仍为10 USD'],
 ['admin-operation-issue-records.html','发放后余额','目标账号发放前余额50，公会本次成功发放100','发放后余额为150虚拟金币'],
 ['admin-operation-gift-records.html','消费金币','成功虚拟礼物单价10数量3','消费金币为30'],
 ['admin-host-account-balance.html','账户余额','财务已上传主播分成收入100 USD，另有负向修正40 USD，无其他收支','账户余额为60 USD'],
 ['admin-guild-account-balance.html','账户余额','财务已上传公会分成收入100 USD，另有负向修正40 USD，无其他收支','账户余额为60 USD'],
])b(page,admin,[`进入${pages.get(page).name}`],[[`验证${metric}采用当前业务口径`,`${metric}口径`,pre,`查看${metric}`,expected]]);
// 本轮 MainBasis 明确提供导出的报表逐页验证筛选集合，不推断额外导出入口。
for(const [key,p] of pages){
 if(p.endName!=='管理后台'||p.module!=='数据报表')continue;
 const refs=find(key).filter(r=>r.status==='已确认'&&/导出.*当前/.test(r.text));
 if(!refs.length)continue;
 const hasFilter=find(key).some(r=>/查询|筛选|范围过滤/.test(r.text));
 b(key,admin,[`进入${p.name}`],[[`验证${p.name}导出当前结果`,'导出集合一致性',hasFilter?'当前日期筛选结果仅有目标记录甲；范围外存在记录乙':'当前列表有记录甲和乙',
  ['点击导出','打开导出文件'],hasFilter?'导出记录仅包含甲':'导出记录包含甲和乙',{sources:[key],match:/导出|查询|筛选|列表/,type:'逻辑校验'}]]);
}
