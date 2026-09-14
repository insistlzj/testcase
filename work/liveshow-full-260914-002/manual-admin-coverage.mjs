import {test as t,ref,page} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
for(const [word,metric,pre,result,calc]of [
 ['活跃用户 / 新增用户','活跃用户','最新完整自然日D，登录A启动2次、B从后台回前台1次，游客C启动1次','活跃用户=2人',null],
 ['活跃用户 / 新增用户','新增用户','D注册成功A和B，C注册失败；其他日期注册D1','新增用户=2人',null],
 ['总充值金额 / 人数','总充值金额','D成功充值10USD、20USD，失败30USD','总充值金额=30USD',calculation('+',[10,20],['第一笔实付','第二笔实付'],'USD')],
 ['总充值金额 / 人数','充值人数','D仅A充值成功2笔、B成功1笔，C失败1笔','充值人数=2人',null],
 ['新用户充值金额：','新用户充值金额','D注册A当日成功充值10USD，昨天注册B当日充值20USD','新用户充值金额=10USD',null],
 ['新用户 ARPU','新用户ARPU','D注册新用户中2人成功充值，实付合计30USD','新用户ARPU=15USD',calculation('/',[30,2],['新用户充值总额','新用户充值人数'],'USD')],
 ['新用户 ARPU','零人数ARPU','D无新注册用户充值成功','新用户ARPU=0USD',null]
 ])t('admin-dashboard.html',word,`工作台计算${metric}`,[pre],['打开工作台',`查看${metric}指标`],result,{point:metric,calc});
t('admin-dashboard.html','最近 7 个自然日','工作台趋势为最近七个完整自然日',['最新完整自然日D为2026-09-13；9月7日至13日都有指标数据'],['打开工作台','点击活跃用户指标卡'],'趋势日期为2026-09-07至2026-09-13',{point:'趋势时间范围'});
t('admin-dashboard.html','数据点','工作台数据点读取准确指标',['9月13日活跃用户为100，新增用户为10，已选择活跃用户趋势'],['打开工作台','点击9月13日趋势点'],'浮层对应9月13日活跃用户100人',{point:'趋势点关联'});
t('admin-dashboard.html','退款时间倒序','工作台被动退款按完成时间倒序',['渠道退款R1完成10:00，R2完成11:00，同日；另有主动退款R3'],['打开工作台','查看被动退款'],'R2排列在R1之前',{point:'被动退款顺序'});
for(const [key,word,metric,pre,result,calc]of [
 ['admin-user-list.html','累计充值：','累计充值','A两笔支付成功订单10USD、20USD；另有失败30USD','累计充值=30USD',calculation('+',[10,20],['第一笔实付','第二笔实付'],'USD')],
 ['admin-user-list.html','所属公会：','无公会占位','A当前没有有效公会关系','所属公会显示“-”',null],
 ['admin-live-management.html','直播时长：','结束场次时长','S1从10:00直播至10:40结束，无无效时间段','直播时长=40分钟',null],
 ['admin-live-management.html','直播时长：','进行中场次时长','S1从10:00开始直播，受控当前时间10:40，仍在播','直播时长=40分钟',null],
 ['admin-live-detail.html','收礼数量：','礼物件数不含门票','S1成功普通礼物2件、幸运礼物3件、门票1张，另有失败礼物4件','收礼数量=5件',calculation('+',[2,3],['普通礼物','幸运礼物'],'件')],
 ['admin-guild-list.html','主播人数：','当前主播人数','G有效在会主播A、B，已退会C','主播人数=2人',null],
 ['admin-guild-detail.html','累计收益：','公会累计收益','G旗下A收益100金币、B收益200金币，无其他收益','累计收益=300金币',calculation('+',[100,200],['A收益','B收益'])],
 ['admin-inspection-schedule-detail.html','人数 =','排班有效人数','排班S有效巡房人员A、B、C，共3人','排班人数=3人',null],
 ['admin-push-management.html','发送人数：','成功推送去重人数','推送P对A成功2次、B成功1次、C失败','发送人数=2人',null],
 ])t(key,word,`${page(key).name}核算${metric}`,[pre],[`打开${page(key).entry}`,`查看${metric}`],result,{point:metric,calc});
for(const [key,word,filters]of [['admin-user-list.html','条件取交集','昵称测试甲、账号正常'],['admin-host-review.html','筛选取交集','公会G、待审核、主播申请人A'],['admin-live-management.html','条件取交集','主播A、直播中'],['admin-account-violation.html','条件取交集','待处理、用户A'],['admin-placement-config.html','取交集','直播广场运营位、启用、当前日期'],['admin-push-management.html','取交集','指定公会G、已发送、当日'],['admin-recharge-order.html','条件取交集','用户A、当日、支付成功'],['admin-consumption-order.html','条件取交集','用户A、普通礼物、当日'],['admin-refund-order.html','条件取交集','用户A、当日退款'],['admin-operation-issue-records.html','取交集','公会G、运营账号A、当日'],['admin-operation-gift-records.html','取交集','公会G、运营账号A、当日']])t(key,word,`${page(key).name}组合筛选交集`,[`记录R1满足全部条件“${filters}”；其余记录每条至少有一个条件不满足`],[`打开${page(key).entry}`,`设置筛选条件“${filters}”`,'点击“查询”'],'筛选结果仅包含R1',{point:'多条件交集'});
for(const key of ['admin-recharge-order.html','admin-consumption-order.html','admin-refund-order.html'])t(key,'导出',`${page(key).name}导出筛选结果`,['当前筛选仅命中R1、R2，R3在范围外'],[`打开${page(key).entry}`,'应用已准备的筛选条件','点击“导出”','打开导出文件'],'导出仅包含R1和R2',{point:'订单导出范围'});
for(const key of ['admin-settlement-record.html','admin-guild-settlement-record.html'])t(key,'上传人',`${page(key).name}保存实际上传人`,['当前平台管理员账号A，已预览有效财务文件F，金额均大于0且对象不重复'],[`打开${page(key).entry}`,'上传F','确认导入','查看该批次上传信息'],'分成人和上传人记录为当前账号A',{point:'结算操作人'});
for(const [key,object]of [['admin-host-account-balance.html','主播'],['admin-guild-account-balance.html','公会']])t(key,'汇总',`${object}结算余额按筛选汇总`,[`${object}A余额10USD、B余额20USD、C余额30USD，当前筛选仅命中A、B`],[`打开${page(key).entry}`,'应用A和B对应筛选条件','点击“查询”'],'余额汇总=30USD',{point:'筛选余额合计',calc:calculation('+',[10,20],['A余额','B余额'],'USD')});
for(const [key,field,pre,result,calc]of [
 ['admin-operation-account-detail.html','发放记录：','A发放前余额100虚拟金币，公会本次成功发放20','发放后余额=120虚拟金币',calculation('+',[100,20],['原余额','发放数'],'虚拟金币')],
 ['admin-operation-account-detail.html','送礼记录：','A成功赠送普通礼物，单价10虚拟金币、数量3','消费金币=30虚拟金币',calculation('*',[10,3],['单价','数量'],'虚拟金币')],
 ['admin-operation-guild-controls.html','本月累计已发放：','G本月成功向A发放100、向B发放200虚拟金币；上月300','本月累计已发放=300虚拟金币',calculation('+',[100,200],['A发放','B发放'],'虚拟金币')],
 ['admin-operation-guild-controls.html','账户余额累计：','G的A余额100、B余额200虚拟金币；其他公会C余额500','账户余额累计=300虚拟金币',calculation('+',[100,200],['A余额','B余额'],'虚拟金币')],
 ['admin-operation-guild-controls.html','本月累计消费：','G本月成功虚拟送礼100和200金币，失败50，上月300','本月累计消费=300虚拟金币',calculation('+',[100,200],['第一笔消费','第二笔消费'],'虚拟金币')]
 ])t(key,field,`${page(key).name}核对${field.replace('：','')}`,[pre],[`打开${page(key).entry}`,`查看${field.replace('：','')}`],result,{point:'虚拟账务计算',calc});
for(const [kind,word]of [['下架','下架不影响'],['收益比例修改','比例快照']])t('admin-lucky-gift-config.html',word,`幸运礼物${kind}不改旧收益`,['S1内幸运订单O1价值100金币，送出时比例1%，已返奖50金币，收益1金币；当前操作影响该礼物配置'],['打开幸运礼物配置',kind==='下架'?'下架该幸运礼物':'将全局收益比例改为2%','确认修改','打开O1对应消费详情','查看主播收益'],'O1主播收益仍为1金币',{point:'幸运收益历史快照',sources:[ref('admin-consumption-order-detail.html','主播收益')]});
t('admin-system-account.html','停用后立即禁止登录','停用后台账号后的登录限制',['超级管理员已停用普通后台账号A；A的原密码正确'],['打开后台登录','输入A原账号与密码','提交登录'],'账号A不能建立后台登录会话',{point:'后台账号停用准入',role:'后台账号A'});
t('admin-system-account-detail.html','重置密码','后台账号重置密码立即生效',['普通后台账号A有效，旧密码OldPass12；超级管理员可管理A'],['打开A后台账号详情','设置新密码“NewPass12”','保存密码'],'账号密码更新为NewPass12',{point:'后台账号密码更新',role:'超级管理员'});
t('admin-system-role-detail.html','父级与子级权限联动','角色权限父级勾选联动子级',['自定义角色R可编辑；用户管理父菜单下已登记用户列表和主播列表两子菜单，初始均未选'],['打开R角色详情','勾选用户管理父菜单'],'父菜单下的用户列表和主播列表同步勾选',{point:'权限树父子联动',role:'超级管理员'});
t('admin-report-handling.html','已作废','直播举报已作废保留工单',['S1结束时待处理举报R1自动作废，S2为该主播下一场'],['打开直播举报','查询R1'],'R1显示已作废状态',{point:'举报作废留存'});
t('admin-report-detail.html','内容 / 证据','举报处理保留原证据',['举报R1提交说明“测试举报”及截图A，现已处理'],['打开R1举报详情','查看原说明和截图'],'原举报内容与提交快照一致',{point:'举报证据快照'});
t('admin-content-audit.html','告警截图：','内容审核保存命中时截图',['告警A在10:00命中并保存截图S1；当前直播画面已变化'],['打开内容审核','查看告警A截图'],'截图仍对应命中时S1',{point:'机审证据快照'});
