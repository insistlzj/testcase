import {a} from './design-admin.mjs';
import {test,P1,P2,enter,calculation,pages} from './case-design.mjs';
test('admin-report-center.html',['仅展示当前角色有权查看的入口'],'仅用户活跃报表权限的管理员','报表中心隐藏未授权报表','报表入口权限',['当前角色只有用户活跃报表权限'],[enter('admin-report-center.html')],'仅显示用户活跃报表入口',P1);
const overview='admin-data-overview.html',daily='admin-daily-statistics.html',active='admin-user-active-statistics.html',host='admin-host-statistics.html',live='admin-live-statistics.html',recharge='admin-recharge-statistics.html',layer='admin-user-activity-statistics.html';
for(const [page,ref,point,fixture,result]of [
 [overview,'注册去重人数之和','概览新增用户合计','第一日注册甲乙2人、第二日注册丙1人，无其他注册','新增用户汇总显示3'],
 [overview,'总充值金额 / 人数：','概览跨日充值金额','第一日成功实付10USD、第二日20USD，另有失败50USD','总充值金额显示30USD'],
 [overview,'新用户充值金额合计 / 新用户充值人数合计','概览新用户ARPU加权','两日新用户成功充值分别10USD/1人、50USD/5人','新用户ARPU显示10USD'],
 [daily,'新用户充值金额 / 新用户充值人数','每日新用户ARPU正分母','当日新用户实付30USD、去重充值人数2人','新用户ARPU显示15USD'],
 [daily,'有效场次时长升序中位值','每日奇数场次中位数','当日三场有效时长10、90、20分钟','开播时长中位数显示20分钟'],
 [daily,'退款订单数 / 金额：','每日两类退款金额合计','当日主动完成8USD、渠道完成2USD，另有未完成20USD','退款金额显示10USD'],
 [active,'老用户：','每日登录老用户范围','当日登录甲昨日注册、乙去年注册、丙今日注册，丁昨日注册但未登录','老用户显示2'],
 [host,'开播时长中位数：','主播报表奇数中位数','有效场次时长10、90、20分钟','开播时长中位数显示20分钟'],
 ['admin-host-live-record-report.html','主播 / 直播间 ID：','场次报表长期房间ID','同主播甲两次开播S1、S2，固定房间R001','S1及S2直播间ID均显示R001'],
 ['admin-host-live-record-report.html','房型：本场创建时快照','场次报表历史房型','甲旧场S1门票房，新场S2普通房','S1房型仍显示门票房'],
 ['admin-host-live-record-report.html','消费金币：','场次报表真实净消费','S1普通100、定制200、门票50、幸运扣100返500金币；虚拟1000金币','S1消费金币显示-50'],
 [recharge,'总充值金额 / 人数 / 订单：','充值统计实付合计','甲成功两笔共20USD、乙一笔10USD、失败5USD','总充值金额显示30USD'],
 [recharge,'总充值金额 / 人数 / 订单：','充值统计去重人数','甲成功2笔、乙1笔、丙仅失败','充值人数显示2'],
 [recharge,'充值赠送 / 系统赠送金币：','每日套餐赠送合计','成功充值套餐赠送100金币，失败套餐赠送50，任务发20','充值赠送金币显示100'],
 [layer,'新 / 老用户：','新充值用户按注册日分层','甲今天注册今天充值2笔、乙昨日注册今天充值、丙今天注册仅支付失败','新用户充值人数显示1'],
 [layer,'新 / 老用户：','老充值用户按注册日分层','甲昨日注册今日成功2笔、乙去年注册今日成功1笔、丙今天注册今日充值','老用户充值人数显示2'],
 [layer,'新用户 ARPU：','新充值用户非零ARPU','新用户当日成功实付30USD、去重充值人数2','新用户ARPU显示15USD'],
 [layer,'老用户 ARPU：','老充值用户非零ARPU','老用户当日成功实付60USD、去重充值人数3','老用户ARPU显示20USD'],
 ['admin-monthly-host-earnings.html','单价 / 份数：','主播打赏原单价','原礼物单价10金币成功3份，现改20金币','单价显示10金币'],
 ['admin-monthly-host-earnings.html','单价 / 份数：','主播打赏有效份数','同礼物成功3份、失败2份、撤销1份','份数显示3'],
 ['admin-monthly-host-earnings.html','幸运礼物收益：','打赏报表幸运收益快照','礼物单价100金币成功10份，当时比例1%、现改2%，返奖2000金币','幸运礼物收益显示10金币'],
 ['admin-monthly-viewer-consumption.html','幸运礼物：','用户报表幸运净额','幸运礼物扣减1000、返还1500金币','幸运礼物净消耗显示-500金币'],
 ['admin-monthly-gift-sales.html','单价：','礼物销售原价格','原赠礼单价10金币，当前礼物价格20金币','单价显示10金币'],
 ['admin-monthly-gift-sales.html','仅真实金币成功消费','礼物销售真实成功范围','礼物A真实成功3份、虚拟成功10份、真实失败2份','A销量显示3份'],
 ['admin-consumption-order-detail-report.html','礼物单价 / 份数：','明细报表历史单价','原消费单价10金币，现配置20金币','礼物单价显示10金币'],
 ['admin-consumption-order-detail-report.html','礼物单价 / 份数：','明细报表成功份数','目标订单成功赠礼3份','份数显示3'],
 ['admin-consumption-order-detail-report.html','消费金币：','明细报表原始扣减','幸运订单单价100、数量3，返奖500金币','消费金币显示300金币'],
 ['admin-recharge-order-detail-report.html','原订单用户和套餐快照','充值报表套餐原名称','用户U001下单时套餐名QA旧套餐，现改QA新套餐','目标订单套餐仍显示QA旧套餐'],
 ])a(page,[ref],`报表核对${point}`,point,[fixture],[enter(page)],result,P1);
for(const [kind,amount]of [['普通',100],['定制',200],['门票',50]]){
 a('admin-monthly-host-share.html',['普通 / 定制 / 门票收益：'],`主播业绩单列${kind}实际收益`,`${kind}主播收益分列`,['范围内普通成功100、定制成功200、门票成功50金币；另有虚拟1000、失败20、撤销30'],[enter('admin-monthly-host-share.html')],`${kind}收益显示${amount}金币`,P1);
 a('admin-monthly-viewer-consumption.html',['普通 / 定制 / 门票：'],`用户消费单列${kind}成功扣款`,`${kind}用户消费分列`,['范围内普通成功100、定制成功200、门票成功50金币；另有虚拟1000、失败20、撤销30'],[enter('admin-monthly-viewer-consumption.html')],`${kind}消费显示${amount}金币`,P1);
}
for(const kind of ['普通','定制','门票','幸运'])a('admin-consumption-order-detail-report.html',['主播收益：'],`消费明细报表${kind}主播收益`,`${kind}订单报表收益`,[`${kind}目标订单扣减100金币；幸运礼物赠送时比例1%、返奖200金币；不发生退款或修正`],[enter('admin-consumption-order-detail-report.html')],`主播收益显示${kind==='幸运'?1:100}金币`,P1);
a(overview,['各日打开 App'],'数据概览日活汇总不跨日去重','概览活跃人次口径',['甲连续两天各打开App一次，范围包含两日且无其他用户'],[enter(overview),'选择|日期范围|为这两天','点击|查询'],'活跃用户汇总显示2',P1);
a(overview,['结束日期不早于开始日期'],'数据概览结束早于开始不能查询','概览日期范围校验',[],[enter(overview),'填写|开始日期|为9月16日','填写|结束日期|为9月15日','点击|查询'],'不能查询结束早于开始的范围',P1);
a(overview,['起止同日为单日'],'数据概览允许同日起止日期','概览单日筛选',['9月15日有统计数据'],[enter(overview),'填写|开始日期|为9月15日','填写|结束日期|为9月15日','点击|查询'],'仅展示9月15日数据',P2);
a(daily,['偶数取中间两项平均'],'每日开播时长偶数中位数','每日直播时长中位数',['该日有效场次时长10、20、40、100分钟'],[enter(daily)],'开播时长中位数为30分钟',P1);
a(daily,['无数据记 0'],'无有效场次中位时长为零','每日空数据时长',['目标日无有效直播场次'],[enter(daily)],'开播时长中位数为0',P1);
a(daily,['均按完成日统计'],'退款统计按完成日而非申请日','每日退款日期口径',['9月14日申请退款，9月15日完成10USD退款'],[enter(daily),'选择|日期|为9月15日','点击|查询'],'退款金额显示10USD',P1);
a(active,['当日至少成功登录 1 次'],'用户活跃报表按成功登录去重','每日登录人数',['甲成功登录3次，乙失败2次'],[enter(active)],'登录用户显示1人',P1);
a(active,['不做跨日再次去重'],'用户活跃汇总按各日相加','活跃汇总人次',['甲连续两日成功登录，无其他用户'],[enter(active),'选择|日期范围|为该两日','点击|查询'],'登录用户汇总显示2',P1);
a(active,['登录用户 = 新用户 + 老用户'],'登录用户分层勾稽一致','新老登录用户勾稽',['当日登录新用户2人、老用户3人'],[enter(active)],'登录用户 = 5',{...P1,calc:calculation('新用户+老用户',{新用户:2,老用户:3},{运算:'+',参数:[{变量:'新用户'},{变量:'老用户'}]},5,'人')});
a(host,['当日平台认证通过'],'新增主播按平台认证日统计','新增主播认证时间',['甲今日公会通过但平台待审，乙昨日公会通过今日平台通过'],[enter(host)],'新增主播显示1人',P1);
a(host,['连麦场次：至少发生 1 次有效连麦的去重场次数'],'同场多次连麦只算一个连麦场次','连麦场次去重',['场次A有效连麦2次，B有效1次，C仅发送未接受邀请'],[enter(host)],'连麦场次显示2',P1);
a(host,['分母为 0 时记 0'],'无有效主播时开播率为零','主播开播率零分母',['目标日有效主播总数0'],[enter(host)],'开播率显示0%',P1);
a(host,['开播人数 / 当日有效主播总数'],'开播率按有效主播总数计算','主播开播率公式',['有效主播10人，成功开播2人'],[enter(host)],'开播率显示20%',P1);
a(live,['去重真实用户数'],'直播互动观众排除运营账号','报表真实观众口径',['真实用户甲重复进入2次，运营账号乙进入1次'],[enter(live)],'观众人数显示1人',P1);
for(const [seconds,minutes]of [[89,1],[90,2]])a(live,['观看时长：有效观看秒数合计 / 60'],`观看时长${seconds}秒四舍五入`,'报表观看分钟取整',[`总有效观看${seconds}秒`],[enter(live)],`观看时长显示${minutes}分钟`,P1);
a(live,['人均观看时长'],'人均观看时长按去重观众计算','报表人均观看时长',['总有效观看300秒，观众2人'],[enter(live)],'人均观看时长显示3分钟',P1);
a(live,['直播间访问率：'],'直播访问率保留一位小数','报表直播访问率',['观众人数1，访问次数3'],[enter(live)],'直播间访问率显示33.3%',P1);
for(const [field,ref]of [['人均观看时长','人均观看时长：'],['直播间访问率','直播间访问率：']])a(live,[ref],`${field}无分母记零`,`${field}零分母`,['当日无观看用户和访问'],[enter(live)],`${field}显示0`,P1);
a('admin-host-live-record-report.html',['不按单场判断'],'单场不足3小时但当日合计达标','直播明细有效天日累计',['同主播同日完成2场各100分钟'],[enter('admin-host-live-record-report.html')],'两场记录是否达标均为达标',P1);
a(recharge,['充值金币 + 充值赠送金币 + 系统赠送金币 - 消费金币'],'金币净增量各来源核算','每日金币净增量',['基础1000、套餐赠送100、系统赠送20、净消费200金币'],[enter(recharge)],'金币净增量 = 920',{...P1,calc:calculation('充值金币+充值赠送金币+系统赠送金币-消费金币',{充值金币:1000,充值赠送金币:100,系统赠送金币:20,消费金币:200},{运算:'-',参数:[{运算:'+',参数:[{变量:'充值金币'},{变量:'充值赠送金币'},{变量:'系统赠送金币'}]},{变量:'消费金币'}]},920)});
a(recharge,['不并入消费金币'],'退款扣回金币不当作消费','每日退款与消费分离',['当日仅成功消费100金币、退款扣回1100金币'],[enter(recharge)],'消费金币显示100',P1);
a(recharge,['总充值金额 / 充值人数'],'充值客单价按人数而非订单数','每日充值客单价',['用户甲2笔合计20USD，乙1笔10USD'],[enter(recharge)],'客单价 = 15',{...P1,calc:calculation('总充值金额/充值人数',{总充值金额:30,充值人数:2},{运算:'/',参数:[{变量:'总充值金额'},{变量:'充值人数'}]},15,'USD')});
for(const [page,fields]of [[overview,['新用户 ARPU']],[daily,['新用户 ARPU']],[recharge,['客单价']],[layer,['新用户 ARPU','老用户 ARPU']]])for(const field of fields)a(page,[`${field}：`],`${pages.get(page).name}${field}无充值记零`,`${field}零充值分支`,['对应用户分层充值人数0'],[enter(page)],`${field.replace(' ','')}显示0`,P1);
a(layer,['总充值金额：新用户充值金额 + 老用户充值金额'],'新老充值分层金额合计','新老用户充值勾稽',['新用户金额10USD、老用户金额20USD'],[enter(layer)],'总充值金额 = 30',{...P1,calc:calculation('新用户金额+老用户金额',{新用户金额:10,老用户金额:20},{运算:'+',参数:[{变量:'新用户金额'},{变量:'老用户金额'}]},30,'USD')});
a('admin-monthly-income-expense.html',['当月完成充值退款金额合计'],'跨月充值退款按退款完成月统计','月度退款归属',['8月充值10USD，9月完成退款'],[enter('admin-monthly-income-expense.html')],'9月累计退款包含该10USD',P1);
const share='admin-monthly-host-share.html';
a(share,['结束日期 - 开始日期 + 1'],'主播业绩统计天数包括首尾','业绩统计天数',['选定9月1日至9月3日'],[enter(share),'点击|查询'],'统计天数显示3天',P1);
a(share,['每日最多 1 天'],'单日直播6小时仍计1有效天','主播有效天不按时长倍数',['仅9月15日累计有效直播6小时'],[enter(share),'选择|日期范围|为9月15日','点击|查询'],'达标天数显示1天',P1);
a(share,['Σ（礼物价值 × 当时配置比例）'],'幸运收益按每笔历史比例快照','主播报表收益比例快照',['两笔礼物各1000金币，前笔比例1%、后笔比例2%'],[enter(share)],'幸运礼物收益 = 30',{...P1,calc:calculation('第一笔价值×旧比例+第二笔价值×新比例',{第一笔价值:1000,旧比例:0.01,第二笔价值:1000,新比例:0.02},{运算:'+',参数:[{运算:'*',参数:[{变量:'第一笔价值'},{变量:'旧比例'}]},{运算:'*',参数:[{变量:'第二笔价值'},{变量:'新比例'}]}]},30)});
a(share,['主播收益：普通 + 定制 + 幸运 + 门票收益'],'主播收益汇总四类收入','主播业绩总收益',['普通100、定制200、幸运10、门票50金币'],[enter(share)],'主播收益 = 360',{...P1,calc:calculation('普通+定制+幸运+门票',{普通:100,定制:200,幸运:10,门票:50},{运算:'+',参数:[{变量:'普通'},{变量:'定制'},{变量:'幸运'},{变量:'门票'}]},360)});
a('admin-monthly-host-earnings.html',['虚拟金币记录：不进入本报表'],'主播打赏明细排除运营虚拟赠礼','主播打赏报表虚拟排除',['同主播真实用户礼物A、运营账号礼物B各一笔'],[enter('admin-monthly-host-earnings.html')],'报表不包含虚拟礼物B记录',P1);
a('admin-monthly-viewer-consumption.html',['累计消费：'],'用户消费报表含幸运净消耗','用户消费报表净额',['普通100、定制200、门票50、幸运扣减100返奖500金币'],[enter('admin-monthly-viewer-consumption.html')],'累计消费 = -50',{...P1,calc:calculation('普通+定制+门票+幸运扣减-返奖',{普通:100,定制:200,门票:50,幸运扣减:100,返奖:500},{运算:'-',参数:[{运算:'+',参数:[{变量:'普通'},{变量:'定制'},{变量:'门票'},{变量:'幸运扣减'}]},{变量:'返奖'}]},-50)});
a('admin-monthly-gift-sales.html',['幸运礼物不减返奖'],'礼物销售额统计原价值不扣返奖','幸运礼物销售额',['幸运礼物单价100、成功10份、总返奖2000金币'],[enter('admin-monthly-gift-sales.html')],'销售额 = 1000',{...P1,calc:calculation('单价×份数',{单价:100,份数:10},{运算:'*',参数:[{变量:'单价'},{变量:'份数'}]},1000)});
a('admin-consumption-order-detail-report.html',['只统计成功真实金币消费'],'消费明细报表排除失败虚拟记录','消费报表成功真实范围',['订单A真实金币成功，B失败，C虚拟金币成功'],[enter('admin-consumption-order-detail-report.html')],'结果仅包含A',P1);
a('admin-refund-order-detail-report.html',['全额退款，USD'],'退款明细金额等于原实付','退款明细金额口径',['原实付8USD，标价10USD，已完成退款'],[enter('admin-refund-order-detail-report.html')],'退款金额显示8USD',P1);
a('admin-recharge-order-detail-report.html',['退款在退款报表单列'],'充值明细仍保留已退款的成功支付','充值报表与退款分列',['订单先成功支付10USD，随后完成全额退款'],[enter('admin-recharge-order-detail-report.html')],'原成功充值10USD仍列入充值明细',P1);
// Each report explicitly permits export; the target is its own filtered dataset.
for(const page of ['admin-daily-statistics.html','admin-user-active-statistics.html','admin-host-statistics.html','admin-live-statistics.html','admin-host-live-record-report.html','admin-recharge-statistics.html','admin-user-activity-statistics.html','admin-monthly-income-expense.html','admin-monthly-host-share.html','admin-monthly-host-earnings.html','admin-monthly-viewer-consumption.html','admin-monthly-gift-sales.html','admin-consumption-order-detail-report.html','admin-refund-order-detail-report.html','admin-recharge-order-detail-report.html'])a(page,['导出 -> 当前'],`${pages.get(page).name}导出当前结果`,`${pages.get(page).name}导出范围`,['当前查询结果仅含测试记录A、B，记录C不在当前结果'],[enter(page),'点击|导出'],'导出数据仅含A、B',P2);
