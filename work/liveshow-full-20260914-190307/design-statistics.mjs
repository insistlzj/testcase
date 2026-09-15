import {page,model,computed,v,op} from './design-current.mjs';
const A='管理后台',G='公会App',U='用户App';
const allReports=Object.values(model.pages).filter(p=>p.endName===A&&p.module==='数据报表'&&p.原型页面!=='admin-report-center.html');
for(const p of allReports){
 const req=model.requirements.filter(r=>r.page===p.key),hasQuery=req.some(r=>/查询/.test(r.body)),hasExport=req.some(r=>/导出/.test(r.body));
 const pg=page(A,p.原型页面,['测试账号原已分配本报表查看及导出权限；本次使用冻结的测试统计数据，查询至导出期间无新增或修改']);
 if(hasExport)pg.add(`${p.name}导出当前结果`,[hasQuery?'09/01、09/02、09/03均有可区分的业务记录':'当前报表至少有两个不同月份的记录'],[`打开${p.name}`,...(hasQuery?['选择日期范围09/01至09/02','点击查询']:[]),'点击导出','打开导出的报表文件','对比导出记录集合与查询后页面记录集合'],[{point:'报表导出范围',result:'导出记录集合等于本次页面展示的记录集合'}],[/导出/]);
 pg.add(`${p.name}按角色限制入口`,['当前账号的本报表查看权限已撤销'],['打开报表中心'],[{point:'报表访问权限',result:`报表中心不显示${p.name}入口`}],[],{support:[/仅展示当前角色有权查看的入口/]});
}
const dash=page(A,'admin-dashboard.html',['最新自然日为 D，用户甲当天启动 App 2 次且注册于 D，用户乙从后台切前台 1 次且注册于 D-1；未登录游客丙访问 1 次']);
dash.add('工作台活跃用户按登录用户去重',[],['打开工作台','查看活跃用户'],[{point:'活跃用户去重',result:'活跃用户为 2'},{point:'新增用户注册日',result:'新增用户为 1'}],[/活跃用户|新增用户/]);
dash.add('工作台趋势使用截至最新日的七天',[],['打开工作台','点击活跃用户指标卡'],[{point:'工作台趋势时间范围',result:'趋势范围为 D-6 至 D，共 7 个自然日'}],[/7 个自然日/]);
for(const [key,field] of [['admin-dashboard.html','新用户 ARPU'],['admin-data-overview.html','新用户 ARPU'],['admin-daily-statistics.html','新用户 ARPU'],['admin-user-activity-statistics.html','新用户 ARPU'],['admin-user-activity-statistics.html','老用户 ARPU'],['admin-recharge-statistics.html','客单价']]){
 const pg=page(A,key,[`所选统计范围内，${field.includes('老')?'老用户':field.includes('新')?'新用户':'充值用户'}实付金额合计 30 USD，去重充值人数 2`]);
 pg.add(`${pg.p.name}的${field}计算`,[],[`打开${pg.p.name}`,`查看${field}`],[computed(field,'实付金额合计 ÷ 充值人数',{实付金额合计:30,充值人数:2},op('/',v('实付金额合计'),v('充值人数')),'USD')],[new RegExp(field)]);
 pg.add(`${pg.p.name}的${field}分母为零`,['本条改用没有任何成功充值的独立统计日期，金额与充值人数均为 0'],[`打开${pg.p.name}`,'查询该无充值日期',`查看${field}`],[{point:`${field}零分母`,result:`${field}为 0`}],[new RegExp(field)]);
}
const daily=page(A,'admin-daily-statistics.html',['统计日期 D 内有主播甲 2 场、主播乙 1 场成功直播；甲累计有效 3 小时、乙 2 小时']);
daily.add('每日开播人数与有效天人数分开统计',[],['打开每日统计','查询日期 D'],[{point:'每日开播人数去重',result:'开播人数为 2'},{point:'每日有效天人数',result:'达成有效天主播为 1'}],[/开播人数|有效天主播/]);
for(const [durations,median] of [[[10,20,30],20],[[10,20,30,40],25],[[],0]])daily.add(`有效时长样本${durations.length?durations.join('、'):'为空'}的中位数`,[`独立统计日期 E 的有效场次时长仅有${durations.length?durations.join('、')+'分钟':'空样本'}`],['打开每日统计','查询日期 E','查看开播时长中位数'],[{point:'场次时长中位数',result:`开播时长中位数为 ${median} 分钟`}],[/中位数/]);
const active=page(A,'admin-user-active-statistics.html',['D 日登录用户甲、乙，D+1 日登录用户甲、丙，各日账号均只按一人统计']);
active.add('用户活跃汇总累加每日去重数',[],['打开用户活跃汇总','查询 D 至 D+1'],[computed('登录用户汇总','第一日人数 + 第二日人数',{第一日人数:2,第二日人数:2},op('+',v('第一日人数'),v('第二日人数')),'人次')],[/汇总卡|各日指标求和/]);
active.add('登录用户分为新用户和老用户',['D 日甲当天注册，乙在 D-1 注册'],['打开用户活跃汇总','查询 D'],[{point:'新登录用户',result:'新用户为 1'},{point:'老登录用户',result:'老用户为 1'}],[/新用户|老用户/]);
const hostStats=page(A,'admin-host-statistics.html',['日期 D 有 4 名有效主播，甲和乙成功开播，甲开了两场，乙开了一场']);
hostStats.add('主播开播率使用有效主播总数',[],['打开主播活跃汇总','查询日期 D'],[computed('开播率','开播人数 ÷ 有效主播总数 × 100%',{开播人数:2,有效主播总数:4,百分数:100},op('*',op('/',v('开播人数'),v('有效主播总数')),v('百分数')),'%'),{point:'开播场次数',result:'开播场次为 3'}],[/开播率|场次/]);
hostStats.add('同场多次连麦只统计一次连麦场次',['甲的 S001 发生两次有效连麦，S002 未连麦，乙 S003 连麦一次'],['打开主播活跃汇总','查询日期 D'],[{point:'连麦场次去重',result:'连麦场次为 2'}],[/连麦场次/]);
const liveStats=page(A,'admin-live-statistics.html',['日期 D 仅有真实观众甲和乙；甲成功进入两次、乙一次，累计有效观看 190 秒']);
liveStats.add('直播互动观众人数按账号去重',[],['打开直播间互动汇总','查询日期 D'],[{point:'互动观众去重',result:'观众人数为 2'}],[/观众人数/]);
liveStats.add('有效观看时长转换分钟并四舍五入',[],['打开直播间互动汇总','查询日期 D'],[computed('观看时长','round(有效观看秒数 ÷ 60,0)',{有效观看秒数:190,每分钟秒数:60,小数位:0},op('round',op('/',v('有效观看秒数'),v('每分钟秒数')),v('小数位')),'分钟'),computed('人均观看时长','round(有效观看秒数 ÷ 观众人数 ÷ 60,0)',{有效观看秒数:190,观众人数:2,每分钟秒数:60,小数位:0},op('round',op('/',v('有效观看秒数'),v('观众人数'),v('每分钟秒数')),v('小数位')),'分钟'),computed('直播间访问率','round(观众人数 ÷ 访问次数 × 100,1)',{观众人数:2,访问次数:3,百分数:100,小数位:1},op('round',op('*',op('/',v('观众人数'),v('访问次数')),v('百分数')),v('小数位')),'%')],[/观看时长|访问率/]);
liveStats.add('没有观众时比率归零',['独立日期 E 没有观众、没有访问事件和观看时长'],['打开直播间互动汇总','查询日期 E'],[{point:'人均时长零分母',result:'人均观看时长为 0'},{point:'访问率零分母',result:'直播间访问率为 0'}],[/分母为 0/]);
const recharge=page(A,'admin-recharge-statistics.html',['日期 D 有成功充值基础金币 1000、套餐赠送 100、系统任务奖励 50，普通/定制/门票扣减合计 200、幸运礼物扣减 100、返奖 80；退款扣回 30 单列']);
recharge.add('充值消费日报净消费口径',[],['打开充值消费汇总','查询日期 D'],[computed('消费金币','普通定制门票扣减 + 幸运扣减 - 返奖',{普通定制门票扣减:200,幸运扣减:100,返奖:80},op('-',op('+',v('普通定制门票扣减'),v('幸运扣减')),v('返奖'))),computed('金币净增量','充值金币 + 充值赠送 + 系统赠送 - 消费金币',{充值金币:1000,充值赠送:100,系统赠送:50,消费金币:220},op('-',op('+',v('充值金币'),v('充值赠送'),v('系统赠送')),v('消费金币')))],[/消费金币|净增量|退款/]);
const share=page(A,'admin-monthly-host-share.html',['主播甲日期 D 至 D+2：普通收益100、定制收益200、门票收益300、幸运礼物价值1000且当时比例1%；仅 D 和 D+2 有效直播达到3小时']);
share.add('主播业绩报表统计天数包含起止日',[],['打开主播业绩分成报表','查询 D 至 D+2 的主播甲'],[{point:'统计自然日数量',result:'统计天数为 3'},{point:'有效自然日数量',result:'达标天数为 2'},computed('主播收益','普通收益 + 定制收益 + 门票收益 + 幸运价值 × 比例',{普通收益:100,定制收益:200,门票收益:300,幸运价值:1000,比例:0.01},op('+',v('普通收益'),v('定制收益'),v('门票收益'),op('*',v('幸运价值'),v('比例'))))],[/统计天数|达标天数|主播收益|幸运/]);
share.add('主播业绩不计算具体分成金额',[],['打开主播业绩分成报表'],[{point:'财务线下核算边界',result:'报表不生成具体应分成金额'}],[/不计算具体分成/]);
const earnings=page(A,'admin-monthly-host-earnings.html',['日期 D 主播甲收到幸运礼物10件，赠送时单价100金币、比例1%，赠送后单价改为200、比例改为2%，返奖500金币']);
earnings.add('幸运收益使用赠送时配置快照',[],['打开主播礼物打赏明细报表','查询日期 D 的主播甲'],[computed('幸运礼物收益','赠送时单价 × 数量 × 赠送时比例',{赠送时单价:100,数量:10,赠送时比例:0.01},op('*',v('赠送时单价'),v('数量'),v('赠送时比例')))],[/幸运礼物收益|快照/]);
const sales=page(A,'admin-monthly-gift-sales.html',['礼物甲有两笔真实成功赠送：单价100、数量2；单价200、数量3；返奖金币100']);
sales.add('礼物销售额按各次价格快照汇总',[],['打开礼物消费汇总报表','查询礼物甲'],[computed('销售额','第一笔单价 × 第一笔数量 + 第二笔单价 × 第二笔数量',{第一笔单价:100,第一笔数量:2,第二笔单价:200,第二笔数量:3},op('+',op('*',v('第一笔单价'),v('第一笔数量')),op('*',v('第二笔单价'),v('第二笔数量')))),computed('销量','第一笔数量 + 第二笔数量',{第一笔数量:2,第二笔数量:3},op('+',v('第一笔数量'),v('第二笔数量')),'件')],[/销售额|销量|快照/]);
const viewer=page(A,'admin-monthly-viewer-consumption.html',['用户甲本月普通礼物100、定制礼物200、门票300、幸运礼物扣减1000、返奖800；充值退款另有500']);
viewer.add('用户消费汇总不因充值退款回滚',[],['打开用户消费汇总报表','查询用户甲'],[computed('累计消费','普通 + 定制 + 门票 + 幸运扣减 - 幸运返奖',{普通:100,定制:200,门票:300,幸运扣减:1000,幸运返奖:800},op('-',op('+',v('普通'),v('定制'),v('门票'),v('幸运扣减')),v('幸运返奖')))],[/累计消费|退款|幸运/]);
const hostReport=page(A,'admin-host-live-record-report.html',['主播甲同日有 S001 2 小时、S002 1 小时有效直播；房间 ID 均为 1001']);
hostReport.add('直播场次达标按主播当日累计判定',[],['打开直播记录明细报表','查询主播甲当日场次'],[{point:'单日累计时长达标',result:'S001 对应自然日显示达标'}],[/是否达标|累计/]);
for(const [key,action] of [['admin-recharge-order-detail-report.html','支付成功'],['admin-refund-order-detail-report.html','退款完成']]){
 const pg=page(A,key,[`订单原创建日为 D，${action}时间为 D+1`]);
 pg.add(`${pg.p.name}按${action}日期统计`,[],[`打开${pg.p.name}`,'查询日期 D+1'],[{point:'订单统计日期口径',result:'结果包含该订单'}],[/时间|成功|完成/]);
}
const guildIncome=page(G,'guild-income.html',['公会甲 D 日开播主播甲、乙，D+1 日开播主播甲、丙；四个主播日均有效直播达到 3 小时']);
guildIncome.add('公会期间开播人数跨日再次去重',[],['打开公会业绩','选择 D 至 D+1'],[{point:'周期主播去重人数',result:'开播人数为 3'},{point:'周期有效天总数',result:'达成有效天为 4'}],[/跨日|去重|有效天/]);
const guildData=page(G,'guild-host-data.html',['公会甲所选日期只有主播甲两场、主播乙一场直播；主播丙不在所选日期开播']);
guildData.add('公会直播记录按实际筛选汇总',[],['打开直播记录','选择主播甲和乙','选择该日期'],[{point:'筛选后开播人数',result:'开播人数为 2'},{point:'筛选后场次数',result:'直播场次为 3'}],[/开播人数|直播场次/]);
const gd=page(G,'guild-live-gift-detail.html',['S001 有观众甲进入2次、观众乙1次；甲成功送礼2笔共5件，乙未送礼']);
gd.add('公会场次观众与礼物统计区分事件次数',[],['打开 S001 直播场次详情'],[{point:'场次观众去重',result:'观众数量为 2'},{point:'场次送礼观众去重',result:'送礼观众为 1'},{point:'场次礼物件数',result:'礼物数量为 5'}],[/观众数量|送礼观众|礼物数量/]);
const summary=page(G,'guild-host-summary.html',['主播甲所选日期新增关注 3 人，其中 1 人当天又取消关注']);
summary.add('公会主播新增粉丝不扣减取关',[],['打开主播数据','选择该日期'],[{point:'新增粉丝非净增量',result:'新增粉丝为 3'}],[/新增粉丝|取消关注/]);
const history=page(G,'guild-host-list.html',['主播甲在公会甲期间收益100金币，退出并加入公会乙后收益200金币；当前公会为甲']);
history.add('已退会主播只保留原公会期间业绩',[],['打开主播业绩','查询主播甲'],[{point:'历史公会业绩归属',result:'属于公会甲的金币收益为 100'},{point:'历史主播退会标记',result:'主播甲显示“退会”'}],[/历史|退会|关系/]);
const day=page(G,'guild-income-day-detail.html',['公会甲昨日有甲、乙开播，今天只有甲当前在线直播']);
for(const old of [false,true])day.add(`公会每日详情查看${old?'历史日':'今日'}`,[],['打开每日详情',`选择${old?'昨日':'今日'}`],[{point:'每日开播人数时点',result:`直播中人数为 ${old?2:1}`}],[/直播中|历史/]);
const ledger=page(G,'guild-share-ledger.html',['主播甲收益所属月份为 8 月，财务分成于 9 月 2 日入账 10.25 USD']);
ledger.add('主播分成按入账时间跨月筛选',[],['打开主播分成记录','选择 9 月日期范围'],[{point:'分成入账时间范围',result:'列表包含 9 月 2 日的 10.25 USD 分成'}],[/分成时间|跨月/]);
const join=page(G,'guild-join-review-detail.html',['入会申请 J001 待公会初审，资料已齐全']);
for(const n of [0,200,201])join.add(`公会驳回理由 ${n} 字符`,[],['打开 J001 入会申请详情','点击驳回',n?`输入 ${n} 个“测”作为驳回理由`:'清空驳回理由','确认驳回'],[{point:'公会驳回理由长度',result:n===0?'驳回节点理由显示“未填写”':n<=200?`驳回理由保存为 ${n} 个“测”`:'未以 201 字符理由提交驳回'}],[/驳回理由|200/]);
