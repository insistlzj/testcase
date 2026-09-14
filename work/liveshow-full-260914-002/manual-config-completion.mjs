import {test,ref,page} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
const t=(k,w,l,g,s,e,x={})=>test(k,w,l,g,[`打开${page(k).entry}`,...s],e,{role:'平台管理员',...x});
for(const field of ['目标页面','详情长图','展示素材'])t('admin-placement-detail.html',field==='目标页面'?'须选择目标页面':field==='详情长图'?'须上传详情长图':'每项必传图片',`轮播第二行缺少${field}`,['已存在两行有效配置；第二行类型'+(field==='详情长图'?'活动长图页面':'APP已有页面')],['点击第二行“编辑”',field==='目标页面'?'清空第二行目标页面':`删除第二行${field}`,'点击“保存”'],`第二行因缺少${field}不能保存`,{point:'轮播逐行必填'});
for(const type of ['APP已有页面','活动长图页面'])t('admin-placement-detail.html','切换跳转类型',`轮播目标类型切换${type}`,['当前编辑轮播配置的第二项'],[`选择第二项跳转类型“${type}”`],type==='APP已有页面'?'展示目标页面选择器':'展示活动长图上传区',{point:'轮播类型联动'});
for(const pos of ['开始日前一天','开始日','结束日','结束日后一天'])t('admin-placement-config.html','开始日和结束日均包含',`投放周期${pos}`,['配置A启用，周期9月14日至9月16日；测试环境业务日期位于'+pos+'，以本条周期作为参照'],['查询配置A'],/前|后/u.test(pos)?'A状态为隐藏':'A状态为展示',{point:'投放日期包含边界'});
t('admin-placement-config.html','状态：','停用轮播在有效期内也不投放',['配置A周期覆盖当前日，但状态已关闭'],['查询A'],'A状态为隐藏',{point:'轮播开关优先'});
t('admin-placement-detail.html','同一配置内允许多项','同配置多素材共用周期',['配置A有素材1、2，素材及各自跳转目标完整；A没有同展示位的其他相交配置'],['选择统一展示周期9月14日至16日','点击“保存”'],'同一配置的两项素材可保存',{point:'同配置排期'});
t('admin-gift-send-count-rule-detail.html','默认数量：','默认数量只能从现有数量选',['当前赠送数量1、10、100'],['打开默认数量选择器'],'默认数量选项内容为1、10和100',{point:'默认数量枚举'});
t('admin-gift-send-count-rule-detail.html','实时更新默认数量选项','移除默认数量后重新校验',['数量1、10、100，当前默认数量10'],['删除数量10','点击“保存”'],'不能保存默认数量为已删除的10',{point:'默认值依赖校验'});
t('admin-gift-send-count-rule-detail.html','拖动数量','赠送数量排序保存',['数量1、10、100，默认10，关联礼物G无冲突'],['拖动100到第一位','点击“保存”'],'数量顺序保存为100、1、10',{point:'赠送数量顺序'});
for(const limit of [-1,0,1,1.5])t('admin-recharge-package-detail.html','限购次数：',`活动套餐限购次数${limit}`,['活动套餐A封面及有效期限已配置，基础100、赠送10、价格1USD'],[`输入限购次数“${limit}”`,'点击“保存”'],Number.isInteger(limit)&&limit>=0?`限购次数保存为${limit}`:'不保存非法限购次数',{point:'限购次数边界'});
for(const [limit,bought,expected]of [[0,100,'允许发起新购买'],[2,1,'允许发起新购买'],[2,2,'不允许再次购买']])t('recharge.html','充值套餐：',`活动套餐限购${limit}已成功买${bought}`,['当前设备渠道可购买活动套餐A，活动有效、上架；A限购'+limit+'次；当前用户已成功支付'+bought+'单'],['选择A','确认购买'],expected,{point:'单用户累计限购',role:'用户',sources:[ref('admin-recharge-package-detail.html','每笔支付成功订单占用 1 次')]});
t('recharge.html','充值套餐：','活动套餐全额退款不恢复购买资格',['A活动套餐限购1次；当前用户成功买1单后已全额退款，活动仍有效'],['选择A','确认购买'],'不允许再次购买A',{point:'退款不恢复限购',role:'用户',flow:'FLOW-RECHARGE-REFUND',sources:[ref('admin-recharge-package-detail.html','不恢复')]});
t('recharge.html','充值套餐：','支付失败不占活动限购',['A有效活动套餐限购1次，当前用户只有1笔支付失败订单，没有支付成功订单'],['选择A','确认购买'],'允许发起新购买',{point:'支付状态与限购',role:'用户',sources:[ref('admin-recharge-package-detail.html','每笔支付成功订单占用 1 次')]});
t('order-income-detail.html','充值时购买的套餐名称','修改套餐不改旧订单快照',['R支付成功时套餐名A、实付1USD、基础100赠10；后台后续将该套餐改名B、价格2USD、基础200'],['查看R购买套餐名称'],'购买套餐名称仍为A',{point:'充值套餐快照',role:'用户',sources:[ref('admin-recharge-package.html','不追溯已完成')]});
t('admin-recharge-package-detail.html','封面：','充值套餐封面必填',['正在编辑有效套餐A，其他字段保留已保存值'],['删除封面','点击“保存”'],'不保存没有封面的套餐',{point:'套餐封面必填'});
for(const field of ['初始密码','角色'])t('admin-system-account-detail.html',field==='初始密码'?'初始密码：':'角色：',`新建后台账号缺少${field}`,['新账号qa_admin_a唯一，昵称已填写；所选角色R启用，初始密码符合当前密码策略'],[`清空${field}`,'点击“保存”'],`不创建缺少${field}的后台账号`,{point:'后台账号必填',role:'超级管理员'});
t('admin-system-account-detail.html','校验两次输入','重置后台密码两次不一致',['普通后台账号A存在，新密码NewPass12符合当前密码策略'],['点击“重置密码”','输入新密码“NewPass12”','输入确认密码“Different12”','点击“保存”'],'不替换A原密码',{point:'重置密码一致性',role:'超级管理员'});
for(const field of ['账号','角色','状态'])t('admin-system-account-detail.html','账号、角色和状态不可修改',`内置超管${field}保护`,['当前详情属于系统内置超级管理员'],[`查看${field}编辑区`],`内置超管${field}不可修改`,{point:'内置账号'+field,role:'超级管理员'});
for(const state of ['启用','停用'])t('admin-report-center.html','报表权限同时控制查询和导出',`报表权限${state}控制入口`,['普通后台账号A仅由角色R获得报表X权限；权限已'+state],['查看报表X入口'],state==='启用'?'展示报表X入口':'不展示报表X入口',{point:'报表入口权限',role:'普通后台账号'});
t('admin-prop-list.html','默认带入当前 Tab','从道具分类进入新增表单',['当前选择头像框Tab'],['点击“新增”'],'新建道具默认类型为头像框',{point:'道具类型默认'});
for(const lang of ['中文','英文','印尼语','马来语'])t('admin-prop-list.html','自定义道具类型四语名称',`自定义道具类型缺少${lang}名称`,['正在创建自定义道具类型，其他三语名称已填且无重复'],[`清空${lang}名称`,'点击“保存”'],'不创建缺少四语名称的类型',{point:'道具类型四语必填'});
t('admin-prop-list.html','自定义道具类型四语名称','自定义道具类型同语言重复',['已有类型T的中文名测试类型；待新建类型U其他三语名称完整'],['输入中文名称“测试类型”','点击“保存”'],'不保存同语言重复类型名',{point:'道具类型名称唯一'});
for(const type of ['头像框','聊天气泡'])t('admin-prop-list.html','类型 Tab',`${type}分类筛选`,['头像框A、聊天气泡B均已配置'],[`切换“${type}”`],`只显示${type}类型的道具`,{point:'道具类型范围'});
for(const [k,word,field,values,expected]of [
 ['admin-recharge-order.html','到账金币：','到账金币',[100,10],110],
 ['admin-recharge-order-detail.html','总到账金币：','总到账金币',[100,10],110],
 ['admin-refund-order.html','扣回金币 =','扣回金币',[100,10],110],
 ['admin-operation-accounts.html','账户余额：','账户余额',[100,-30],70],
 ['admin-operation-account-detail.html','虚拟金币余额：','虚拟金币余额',[100,-30],70]
])t(k,word,page(k).name+field+'明细核对',[k.includes('operation')?'当前运营账号成功发放100、成功消费30虚拟金币，失败20不计':'订单R基础100金币、赠送10金币，已成功到账；退款场景对应R已完成全额退款'],[`查看R${k.includes('operation')?'账号':''}的${field}`],`${field}=${expected}`,{point:field+'明细公式',calc:calculation('+',values,['项1','项2'],k.includes('operation')?'虚拟金币':'金币')});
for(const [k,entity]of [['admin-settlement-record-detail.html','主播'],['admin-guild-settlement-record-detail.html','公会']])t(k,entity==='主播'?'主播人数：':'公会数量：',`${entity}分成批次人数`,['批次A含对象B和对象C各一条有效明细，另有其他批次的对象D'],['查看批次A对象数量'],`${entity}数量为2`,{point:'批次对象计数'});
for(const [k,word,metric,setup,result]of [
 ['admin-daily-statistics.html','开播人数：','开播人数','主播B今日成功开播2场，C1场，D只打开开播设置','2'],
 ['admin-host-statistics.html','新增主播：','新增主播','B今日终审通过，C仅公会初审通过，D昨日已终审通过','1'],
 ['admin-live-statistics.html','观众人数：','观众人数','真实用户A今日成功进入2场，B进入1场，运营账号C进场，D被准入拦截','2'],
 ['admin-user-active-statistics.html','付费用户：','付费用户','A今日支付成功2单，B成功1单，C支付失败','2'],
 ['admin-recharge-statistics.html','客单价：','客单价','今日A成功充值10USD与20USD，B成功30USD','30USD'],
 ['admin-recharge-statistics.html','客单价：','客单价','今日没有成功充值用户，金额0','0'],
 ['admin-monthly-host-share.html','统计天数：','统计天数','日期范围2026-09-14至2026-09-14','1'],
 ['admin-monthly-host-share.html','统计天数：','统计天数','日期范围2026-09-14至2026-09-16','3']
])t(k,word,metric+setup,[setup],['选择上述日期范围；未指定范围时选择今日','点击“查询”',`查看${metric}`],`${metric}为${result}`,{point:metric+'口径'});
for(const month of ['2026-08','2026-09'])t('admin-monthly-income-expense.html','列表展示全部月份',`月度汇总保留${month}`,['2026年8月与9月均有有效业务数据'],['查看月度列表'],`存在${month}月份行`,{point:'全部月份列表'});
t('admin-monthly-income-expense.html','当月完成充值退款','跨月退款计入退款完成月',['R于8月充值100USD，9月全额退款成功；9月无其他退款'],['查看2026年9月行'],'累计退款为100USD',{point:'退款月份归属'});
for(const key of ['admin-user-active-statistics.html','admin-user-activity-statistics.html'])t(key,key==='admin-user-active-statistics.html'?'各日指标求和':'总充值人数：',`${page(key).name}新老或跨日汇总`,[key==='admin-user-active-statistics.html'?'9月14日A登录，9月15日A和B登录':'9月14日新用户充值2人、老用户充值3人'],[key==='admin-user-active-statistics.html'?'选择9月14日至15日':'选择9月14日','点击“查询”'],key==='admin-user-active-statistics.html'?'登录用户汇总为3':'总充值人数为5',{point:'报表人数汇总'});
