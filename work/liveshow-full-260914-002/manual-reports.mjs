import {test,ref,page} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
const t=(k,w,l,g,e,x={})=>test(k,w,l,g,[`打开${page(k).entry}`,'选择统计日期2026-09-14至2026-09-14','点击“查询”'],e,{role:'平台管理员',point:l,...x});
for(const k of ['admin-data-overview.html','admin-daily-statistics.html']){
 t(k,'活跃 / 新增用户：','活跃用户按打开App去重',['9月14日登录用户B启动2次、切回前台1次；C只切回前台1次；游客D启动1次，其他无事件'],'活跃用户为2');
 t(k,'总充值金额 / 人数：','成功充值金额和状态范围',['9月14日B成功订单10 USD和20 USD、C成功订单30 USD；D失败订单40 USD'],'总充值金额=60',{calc:calculation('+',[10,20,30],['B订单1','B订单2','C订单'],'USD')});
 for(const n of [0,2])t(k,'新用户 ARPU：',`新用户ARPU分母${n}`,n?['9月14日注册新用户B和C；B当天成功充值10 USD和20 USD，C充值30 USD']:['9月14日没有新用户充值成功'],n?'新用户ARPU=30':'新用户ARPU显示0',n?{calc:calculation('/',[60,2],['新用户充值金额','新用户充值人数'],'USD')}:{});
}
t('admin-data-overview.html','各日充值去重人数之和','范围内充值人数按日相加',['B在9月14日与15日分别成功充值一次；C在15日成功充值一次'],'9月14日单日充值人数为1');
test('admin-data-overview.html','各日充值去重人数之和','跨日充值人数不再次去重',['B在9月14日与15日分别成功充值一次；C在15日成功充值一次'],['打开数据概览','选择统计日期2026-09-14至2026-09-15','点击“查询”'],'总充值人数为3',{point:'按日人次汇总',role:'平台管理员'});
test('admin-data-overview.html','该点对应日期','趋势点日期指标值',['9月14日新增用户2人，9月15日新增用户3人'],['打开数据概览','选择统计日期2026-09-14至2026-09-15','点击“查询”','点击新增用户指标卡','点击9月15日的数据点'],'数据点显示9月15日新增用户3',{point:'趋势点信息',role:'平台管理员'});
for(const mins of [179,180,181])t('admin-daily-statistics.html','不少于 3 小时',`有效天累计${mins}分钟`,[`仅主播B于9月14日有两场有效直播，累计${mins}分钟`],mins>=180?'达成有效天主播为1':'达成有效天主播为0',{dimension:'输入边界'});
for(const durations of [[],[10,20,30],[10,20,30,40]])t('admin-daily-statistics.html','中位数：',`直播时长${durations.length}场中位数`,[`9月14日有效场次时长（分钟）为${durations.join('、')||'无数据'}`],`开播时长中位数为${durations.length===0?0:durations.length===3?20:25}分钟`);
t('admin-daily-statistics.html','完成日统计','跨日退款归完成日',['订单原支付日9月12日；平台主动退款A 10 USD、渠道退款B 20 USD均于9月14日完成；C 30 USD于9月15日完成'],'9月14日退款金额=30',{calc:calculation('+',[10,20],['平台退款A','渠道退款B'],'USD')});
t('admin-user-active-statistics.html','登录用户：','登录用户与仅打开App区分',['9月14日B成功登录两次；C只打开已有会话的App但没有成功登录事件'],'登录用户为1');
t('admin-user-active-statistics.html','登录用户 = 新用户 + 老用户','登录新老用户分层',['9月14日新注册并登录B、C；9月13日注册且14日登录D；当天注册未登录E'],'登录用户=3',{calc:calculation('+',[2,1],['新用户','老用户'],'人')});
for(const denom of [0,4])t('admin-host-statistics.html','开播率：',`开播率分母${denom}`,denom?['9月14日有效主播总数4，B开播2场、C开播1场']:['9月14日无有效主播、无开播'],'开播率显示'+(denom?50:0)+'%');
t('admin-host-statistics.html','连麦场次：','重复连麦不重复计场次',['9月14日场次A有效连麦2次，场次B一次，场次C无连麦'],'连麦场次为2');
t('admin-host-statistics.html','确认违规的去重','未确认违规不计主播违规',['9月14日主播B的两个场次确认违规；C仅有未处理举报'],'违规主播为1');
for(const seconds of [29,30,31])t('admin-live-statistics.html','四舍五入到分钟',`观看时长${seconds}秒取整`,[`9月14日有效观看时长总计${seconds}秒，真实观众1人`],`观看时长为${seconds<30?0:1}分钟`,{dimension:'输入边界'});
for(const n of [0,2])t('admin-live-statistics.html','人均观看时长：',`人均观看分母${n}`,n?['9月14日有效观看180秒，真实观众2人']:['9月14日无观众、无观看时长'],`人均观看时长为${n?2:0}分钟`);
t('admin-live-statistics.html','直播间访问率：','重复访问后的访问率',['9月14日B成功进房2次，C成功进房1次，共3次访问、2名真实观众'],'直播间访问率显示66.7%');
t('admin-live-statistics.html','分母为 0 时记 0','无访问时访问率',['9月14日无访问、无观众'],'直播间访问率显示0%');
t('admin-host-live-record-report.html','不按单场判断','多场累计有效天标记',['主播B在9月14日两场有效直播，分别120和60分钟'],'两场记录的是否达标均为是');
t('admin-host-live-record-report.html','消费金币：','场次消费扣除幸运返奖',['场次A普通礼物100、定制20、门票30、幸运扣款200返奖150，另有虚拟送礼500'],'场次消费金币=200',{calc:calculation('-',[350,150],['真实扣款合计','幸运返奖'],'金币')});
t('admin-recharge-statistics.html','金币净增量：','金币净增量包含三种发行',['9月14日充值基础1000、套餐赠送100、签到任务活动赠送50、真实消费净扣400、充值退款扣回200单列'],'金币净增量=750',{calc:calculation('-',[1150,400],['三类发行合计','净消费'],'金币')});
t('admin-recharge-statistics.html','退款扣回金币','退款资产与消费分离',['9月14日消费100金币，充值退款独立扣回200金币'],'消费金币为100');
for(const kind of ['新','老'])for(const n of [0,2])t('admin-user-activity-statistics.html',`${kind}用户 ARPU：`,`${kind}用户ARPU人数${n}`,n?[`9月14日${kind}用户B、C成功充值合计60 USD`]:[`9月14日无${kind}用户充值`],`${kind}用户ARPU显示${n?30:0} USD`);
for(const [k,w,fixture,expected,calc]of [
 ['admin-monthly-host-earnings.html','普通 / 定制收益：','普通礼物单价10金币，成功送出3份，失败1份不计','普通礼物收益=30',calculation('*',[10,3],['单价','成功份数'],'金币')],
 ['admin-monthly-host-earnings.html','幸运礼物收益：','幸运礼物单价100金币、成功送出10份，赠送时比例1%，返奖900金币','幸运礼物收益=10',calculation('*',[100,10,0.01],['单价','份数','快照比例'],'金币')],
 ['admin-monthly-gift-sales.html','销售额：','幸运礼物单价100金币、成功送出10份、返奖900金币','销售额=1000',calculation('*',[100,10],['单价','份数'],'金币')],
 ['admin-monthly-viewer-consumption.html','累计消费：','用户B普通100、定制20、门票30、幸运扣200返250，虚拟送礼500不计','累计消费=100',calculation('+',[100,20,30,-50],['普通','定制','门票','幸运净消耗'],'金币')],
 ['admin-consumption-order-detail-report.html','消费金币：','普通礼物订单A单价10金币、数量3份','消费金币=30',calculation('*',[10,3],['单价','份数'],'金币')]
])t(k,w,page(k).name+'金额口径',[fixture],expected,{calc});
for(const k of ['admin-monthly-host-earnings.html','admin-monthly-gift-sales.html'])t(k,'虚拟金币',page(k).name+'排除虚拟金币',['9月14日仅有运营账号以500虚拟金币送礼记录A，无真实金币消费'],'列表不包含虚拟金币记录A');
for(const k of ['admin-monthly-host-share.html','admin-monthly-income-expense.html'])t(k,k.includes('host-share')?'主播收益：':'收益：',page(k).name+'四类收益合计',['普通收益100、定制20、门票30、幸运收益10；赠礼后原充值退款不撤销消费'],'主播收益金币=160',{calc:calculation('+',[100,20,30,10],['普通','定制','门票','幸运'],'金币')});
for(const [k,word,states,include]of [['admin-recharge-order-detail-report.html','仅支付成功', ['待支付','支付成功','用户已取消','超时自动取消'],'支付成功'],['admin-refund-order-detail-report.html','仅展示已完成退款',['处理中','已完成','失败'],'已完成']])for(const state of states)t(k,word,page(k).name+'状态'+state,[`订单A相关处理时间为9月14日，当前状态${state}`],state===include?'结果包含订单A':'结果不包含订单A');
for(const k of ['admin-daily-statistics.html','admin-user-active-statistics.html','admin-host-statistics.html','admin-live-statistics.html','admin-host-live-record-report.html','admin-recharge-statistics.html','admin-user-activity-statistics.html','admin-monthly-host-share.html','admin-monthly-host-earnings.html','admin-monthly-viewer-consumption.html','admin-monthly-gift-sales.html','admin-consumption-order-detail-report.html','admin-refund-order-detail-report.html','admin-recharge-order-detail-report.html'])test(k,'导出 ->',`${page(k).name}导出筛选范围`,['9月14日存在范围内记录A，9月13日有范围外记录B；当前角色有查询和导出权限'],[`打开${page(k).entry}`,'选择统计日期2026-09-14至2026-09-14','点击“查询”','点击“导出”','打开导出文件'],'导出文件仅包含当前筛选范围的记录A',{point:'导出范围',role:'平台管理员'});
