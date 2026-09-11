import {scenario as s,observe as o,navigation as nav,textBoundary,required} from './design.mjs';
import {flows} from './lifecycles.mjs';
const f=k=>({flow:flows[k].flow,transition:flows[k].id});
s(['U-recharge-004','U-recharge-010'],'基础与赠送金币到账',['余额50，当前可购套餐基础100赠送20，渠道可用'],['选择该套餐及渠道','完成支付'],'金币余额 = 50 + 100 + 20 = 170',{priority:'P0',type:'逻辑校验',...f('recharge')});
for(const status of ['失败','取消','超时'])s('U-recharge-005',`充值${status}不加币`,['余额50，当前套餐可购买',`支付结果为${status}`],['选择套餐','发起支付'],'余额仍为50',{type:'异常用例'});
o('U-recharge-010','支付回调重复只入账一次',['余额50，订单应到账120','同一支付成功回调被重复送达2次'],'金币余额为170，仅一条充值入账流水',{priority:'P0',type:'逻辑校验'});
for(const amount of [20,120,130])o('U-recharge-006',`退款扣回120原余额${amount}`,[`当前余额${amount}，原订单到账120，后台已完成该订单整单退款`],`余额 = ${amount} - 120 = ${amount-120}`,{type:'逻辑校验',...f('refund')});
s('U-recharge-006','负余额充值先抵扣',['余额-100，所选可购套餐到账120'],['完成该套餐支付'],'金币余额 = -100 + 120 = 20',{type:'逻辑校验'});
o('U-balance-detail-005','负余额不能消费',['当前余额为-1'],'赠礼和购票均不能成功扣款');
o('U-order-income-detail-009','充值套餐保留订单快照',['已支付订单原基础100赠20，后台已改为基础200赠30'],'订单仍展示基础100和赠送20');
o('U-order-expense-detail-010','支出保留支付快照',['已支付普通礼物原单价10数量2，礼物后台已改价20'],'订单仍显示原商品、数量2和实际扣款20');
o('U-order-income-detail-008','用户充值详情无退款入口',['当前是成功充值订单'],'详情不提供用户退款操作');
o('U-order-expense-detail-008','成功消费不支持退款',['当前是成功赠礼或门票支出订单'],'详情不提供退款操作');
o('U-balance-detail-005','退款以新分录记录',['充值原流水+120，后来发生全额退款'],'原+120流水保留，另新增-120冲正流水');
for(const equal of [false,true])o('U-balance-detail-006',`余额明细${equal?'同时间ID':'时间'}排序`,[equal?'两流水时间相同、ID分别10与20':'两流水发生时间10:00与10:01'],equal?'ID20流水排在ID10之前':'10:01流水排在10:00之前');
for(const type of ['充值','支出','任务奖励'])s('U-balance-detail-007',`${type}流水入口`,[`当前账号有${type}流水，${type==='任务奖励'?'不关联订单':'已关联订单'}`],['点击该流水'],type==='任务奖励'?'仅展示流水信息':`进入该笔${type}订单详情`);
s('U-order-income-detail-010','订单返回保留账单位置',['从有筛选条件的账单列表打开一笔订单'],['点击返回'],'回到账单列表，筛选与位置保留');
s('U-order-expense-detail-011','失效消费对象不重新消费',['订单关联场次已失效'],['点击业务对象'],'仅保留订单快照，不重新发起消费');
o('U-recharge-009','充值活动优先与套餐配置顺序',['有活动及常规套餐，常规配置顺序已确定'],'活动在前，常规套餐沿用配置顺序');
o('U-recharge-008','运营账号无充值入口',['当前为运营账号'],'不提供充值页入口或充值能力',{role:'运营账号'});

nav('U-welfare-center-002','邀请好友卡片','邀请好友');nav('U-welfare-center-004','充值福利卡片','充值页');
o('U-welfare-center-005','福利赠币显示套餐最大值',['可展示套餐赠币分别0、10、20'],'充值福利卡片显示+20金币');
o('U-welfare-center-009','仅登录不计签到',['今日已登录但尚未手动签到'],'今日仍未签到，连续天数未增加');
s('U-welfare-center-011','手动签到入账一次',['今日未签到，配置今日奖励20，余额100'],['点击签到'],'余额120，签到状态为已签到且按钮禁用');
s('U-welfare-center-011','同日重复签到不入账',['今日已签到领取20金币，余额120'],['再次点击签到'],'余额仍120，不再次发放奖励');
s('U-welfare-center-012','断签后从第一天重算',['前天连续签到2天，昨日仅登录未签到','配置第1天20、第2天30'],['今日点击签到'],'连续天数为1，领取20金币');
for(const day of [2,3,4])s('U-welfare-center-013',`超过最高档连续第${day}天`,['配置最高第2天奖励30，第1天20',`今日为连续第${day}天且未签到`],['点击签到'],'本日领取30金币，不循环回第1天');
for(const count of [9,10,11])s('U-welfare-center-017',`任务阈值10进度${count}`,['任务启用且奖励仍在领取有效期',`该档目标10，当前进度${count}且未领`],['点击该档奖励'],count<10?'不能领取奖励':'该档奖励入账并标记已领取',f('taskClaim'));
s('U-welfare-center-019','任务重复领奖不重复入账',['该档奖励10已成功领取，当前余额110'],['再次点击领取'],'余额仍110，未新增奖励流水');
s('U-welfare-center-019','任务领奖失败可重试',['任务已达标且当日有效，领取请求失败'],['点击领取'],'不标记已领取，提示失败且允许重试',{type:'异常用例'});
s('U-welfare-center-019','任务领奖失败恢复重试',['上次领取失败且尚未发币，问题已恢复，奖励仍有效'],['再次点击领取'],'奖励成功入账一次并标记已领取',{dimensions:['重试/恢复','可观察结果']});
for(const period of ['每日','每周','每月','无周期'])o('U-welfare-center-018',`${period}奖励过日失效`,[`${period}任务奖励昨日达标但未领取，现在已到次日`],'领取时不发币并提示“奖励已失效”');
for(const period of ['每日','每周','每月'])o('U-welfare-center-016',`${period}任务新周期清零`,[`${period}任务原进度5，已进入明确配置的新业务周期`],'任务新周期进度为0');
o('U-welfare-center-016','无周期任务保持累计',['无周期任务在有效期内，昨天进度5，今日尚未新增行为'],'今日进度仍为5');
s('U-views_welfare-center_claimed-006','任务改配置不补发已领取实例',['当前实例已领取，平台随后调整该任务奖励'],['重新进入充值福利'],'该实例仍已领取且不补发');
for(const action of ['签到','领奖','充值'])s('U-welfare-center-022',`游客${action}转登录`,['当前为游客'],[`点击${action}`],'进入登录页',{role:'游客'});
o('U-welfare-center-022','运营号不显示签到任务',['当前为运营账号'],'不展示签到、任务及领奖入口',{role:'运营账号'});
o('U-all-tasks-002','全部任务仅三项',[],'只展示观看直播30分钟、送出任意1个礼物、分享1个直播间');
o('U-all-tasks-006','全部任务无统计分类标题',[],'不展示任务统计和任务分类标题');
nav('U-all-tasks-012','返回','充值福利');
s('U-welfare-center-020','观看任务未完成提示',['当前观看任务未完成'],['点击奖励'],'提示“任务尚未完成”');
s('U-welfare-center-020','分享任务指引',['分享任务未完成'],['点击分享入口'],'提示前往直播间分享');
o('U-invite-friends-007','邀请记录按日期倒序',['当前账号有两个成功邀请记录，邀请日期不同'],'最近邀请记录在前，另一账号记录不展示');
for(const target of ['奖励','邀请记录'])s('U-invite-friends-008',`邀请切换${target}`,[],[`切换${target}`],`显示${target}内容`);
s('U-invite-friends-009','邀请记录翻页',['成功邀请记录超过一页'],['点击下一页','点击上一页'],'返回原页记录');
nav('U-invite-friends-010','邀请好友','邀请好友选项');
for(const [button,result] of [['复制链接','提示“复制成功”'],['发送给好友','调起系统分享'],['保存图片','展示图片保存结果'],['取消','分享选项关闭'],['遮罩','分享选项关闭']])s(`U-views_invite-friends_share-options-${{复制链接:'004',发送给好友:'005',保存图片:'006',取消:'007',遮罩:'007'}[button]}`,`邀请分享${button}`,[],[`点击${button}`],result);
s('U-views_invite-friends_share-options-003','分享本身不计邀请',['当前成功邀请人数1'],['点击复制链接'],'成功邀请人数仍为1');

// 下列参数均来自对应字段，不跨功能套用范围。
for(const [id,field,domain] of [
 ['A-admin-gift-detail-005','单价','positiveInt'],['A-admin-gift-detail-006','排序权重','int'],['A-admin-prop-detail-006','排序权重','int'],
 ['A-admin-recharge-package-detail-004','销售价格','money'],['A-admin-recharge-package-detail-005','充值金币','positiveInt'],['A-admin-recharge-package-detail-005','赠送金币','nonnegativeInt'],
 ['A-admin-recharge-package-detail-006','限购次数','nonnegativeInt'],['A-admin-recharge-package-detail-008','排序','int'],['A-admin-ticket-price-level-detail-003','门票价格','positiveInt'],['A-admin-ticket-price-level-detail-004','排序','positiveInt'],
 ['A-admin-task-detail-007','达成奖励','positiveInt'],['A-admin-lucky-gift-detail-005','奖励金币','nonnegativeInt']]){
 for(const value of ['',-1,0,1,1.5,...(domain==='money'?[0.01,1.001]:[])]){
  const valid=value!==''&&(domain==='money'?value>0&&Number.isInteger(Math.round(value*100000)/1000):Number.isInteger(value)&&(domain==='int'||domain==='positiveInt'&&value>0||domain==='nonnegativeInt'&&value>=0));
  s(id,`${field}${value===''?'空值':value}`,['其他必填字段与配置有效',...(id.includes('recharge-package')?['当前编辑活动套餐']:[])],[value===''?`清空${field}`:`填写${field}${value}`,'点击保存'],valid?`${field}保存为${value}`:`${field}校验失败，不能保存`,{type:'逻辑校验'});
 }
}
for(const [p,id,label] of [['A-admin-gift-detail','003','名称'],['A-admin-prop-detail','003','名称'],['A-admin-task-detail','002','名称'],['A-admin-push-detail','003','标题'],['A-admin-push-detail','003','内容']])for(const lang of ['中文','英语','印尼语','马来语'])required(`${p}-${id}`,[`${lang}${label}`],'保存');
for(const [id,names] of [['A-admin-gift-detail-004',['图标']],['A-admin-prop-detail-005',['图标','素材']],['A-admin-recharge-package-detail-003',['类型','封面']]])required(id,names,'保存');
for(const [p,name] of [['A-admin-gift-detail','礼物'],['A-admin-prop-detail','道具'],['A-admin-recharge-package-detail','套餐']]){
 o(`${p}-002`,`${name}编辑ID只读`,[`当前编辑已创建${name}`],`${name}ID不可修改`);
 s(`${p}-002`,`${name}新建ID重复`,[`系统已有目标${name}ID`],[`新建时填写已存在ID`,'保存'],`不能创建重复ID${name}`,{type:'异常用例'});
}
for(const [id,name] of [['A-admin-gift-detail-007','定制礼物'],['A-admin-custom-gift-003','定制礼物'],['A-admin-recharge-package-detail-007','活动套餐'],['A-admin-task-detail-003','任务']])for(const delta of [-1,0,1])s(id,`${name}结束${delta<0?'早于':delta===0?'等于':'晚于'}开始`,['其他字段合法，开始时间为明日10:00'],[`设置结束时间为明日${delta<0?'09:59':delta===0?'10:00':'10:01'}`,'保存'],delta>0?`${name}时间范围可保存`:`${name}时间范围不能保存`,{type:'逻辑校验'});
for(const state of ['生效前','已到生效时间','已到失效时间'])o('A-admin-custom-gift-005',`定制礼物${state}`,['礼物未提前下架且已配置有效起止时间',`当前${state}`],`礼物状态为${state==='已到生效时间'?'上架中':state==='生效前'?'未生效':'已下架'}`);
s('A-admin-custom-gift-006','定制礼物提前下架',['礼物正在有效投放期'],['提前下架','确认'],'礼物停止新赠送');
o('A-admin-gift-list-008','下架礼物历史收益不变',['礼物已有成功消费10金币，平台已下架'],'历史消费与收益10金币仍保留');
o('A-admin-prop-list-007','下架道具已发放继续有效',['道具已发给用户且未到期，平台已下架该道具'],'原已发放道具仍按原有效期可用');
o('A-admin-prop-list-007','道具到期停止展示',['用户持有道具刚到有效期终点'],'该道具自动停止展示');
for(const value of [-1,0,1,100,101])s('A-admin-lucky-gift-config-012',`幸运收益比例${value}%`,[],['点击编辑',`填写比例${value}%`,'保存'],value>=0&&value<=100?`全局收益比例保存为${value}%`:'比例不能保存',{type:'逻辑校验'});
o('A-admin-lucky-gift-config-010','修改幸运比例不重算历史',['历史幸运礼物价值1000，赠送时比例1%，现改为2%'],'历史收益仍为1000 × 1% = 10金币',{type:'逻辑校验'});
o('A-admin-lucky-gift-config-009','返奖不改主播幸运收益',['幸运礼物1000金币，赠送时收益比例1%，返奖900'],'主播收益 = 1000 × 1% = 10金币',{type:'逻辑校验'});
for(const total of [99,100,101])s('A-admin-lucky-gift-detail-006',`幸运概率合计${total}%`,['其他字段合法，奖励档位不重复',`当前全部档位概率合计${total}%`],['保存'],total===100?'概率合计校验通过':'概率合计校验失败，不能生效',{type:'逻辑校验'});
s('A-admin-lucky-gift-detail-005','幸运奖励档位重复',['已有奖励10金币档位'],['新增另一奖励10金币档位','保存'],'重复奖励档位不能保存',{type:'异常用例'});
o('A-admin-lucky-gift-detail-007','RTP向上保留一位小数',['单次消耗3，奖励1金币概率100%'],'RTP = 1 ÷ 3 × 100%，显示33.4%',{type:'逻辑校验'});
o('A-admin-lucky-gift-detail-007','RTP多档加权计算',['单次消耗10，奖励0概率50%，奖励20概率50%'],'RTP = (0 × 50% + 20 × 50%) ÷ 10 × 100% = 100%',{type:'逻辑校验'});
for(const values of [[],[0],[1.5],[1,1],[1],[1,10]])s('A-admin-gift-send-count-rule-detail-002',`赠送数量列表${JSON.stringify(values)}`,['其余配置合法'],[`设置赠送数量为${JSON.stringify(values)}`,'保存'],values.length&&values.every(v=>Number.isInteger(v)&&v>0)&&new Set(values).size===values.length?'数量列表可保存':'数量列表不能保存',{type:'逻辑校验'});
s('A-admin-gift-send-count-rule-detail-003','默认数量须在列表',['可选数量1、10'],['尝试将默认数量设为100','保存'],'不能保存不在列表中的默认数量');
s('A-admin-gift-send-count-rule-detail-004','同礼物启用规则冲突',['目标礼物已关联一条启用规则'],['将另一规则关联该礼物并启用','保存'],'启用冲突校验失败');
s('A-admin-gift-send-count-rule-detail-006','拖动数量同步默认选项',['数量列表1、10、100'],['删除10并拖动100到首位'],'默认数量选项仅100、1并按新顺序排列');
o('A-admin-gift-send-count-rules-007','停用份数规则回退1',['礼物原关联可选1、10的规则，规则现已停用'],'该礼物默认仅支持×1');
for(const count of [0,1,5,6])s('A-admin-placement-detail-003',`轮播素材${count}项`,['每项材料和目标均合法'],[`尝试配置${count}项轮播内容`,'保存'],count>=1&&count<=5?`保存${count}项轮播`:'不能保存该轮播数量');
for(const saved of [true,false])s('A-admin-placement-detail-009',`删除${saved?'已保存':'未保存'}轮播项`,[`有两项内容，目标项${saved?'已保存':'新加未保存'}`],['删除目标项'],saved?'出现删除确认':'目标项直接删除');
s('A-admin-placement-detail-009','唯一轮播项禁止删除',['仅剩1项内容'],['尝试删除该项'],'该项保留，不能删除');
for(const target of ['APP已有页面','活动长图页面'])s('A-admin-placement-detail-011',`轮播切换${target}`,[],[`选择跳转类型${target}`],target==='APP已有页面'?'显示目标页面选择器':'显示活动长图上传入口');
for(const missing of ['展示素材','跳转类型','目标内容'])s('A-admin-placement-detail-012',`轮播行缺${missing}`,['第1行合法',`第2行缺少${missing}`],['保存'],`定位第2行${missing}错误并阻止保存`);
for(const overlap of [true,false])s('A-admin-placement-config-006',`同展位排期${overlap?'重叠':'相邻不重叠'}`,['该位置已有9月1日至5日配置'],[`新增该位置9月${overlap?5:6}日至10日配置`,'保存'],overlap?'排期冲突，不能保存':'无排期冲突，可保存');
s('A-admin-placement-detail-008','同配置多轮播不判冲突',['同一配置中含两项有效素材且共同排期'],['保存'],'两项素材按共同排期保存，不判互相冲突');
for(const date of [0,1,5,6])o('A-admin-placement-config-004',`展位排期第${date}日`,['启用配置排期9月1日至5日',`当前为${date===0?'8月31日':`9月${date}日`}`],date>=1&&date<=5?'该配置投放':'该配置不投放');
s('A-admin-placement-detail-010','拖动轮播顺序',['原顺序为素材甲、乙'],['将乙拖到甲前面','保存'],'轮播顺序保存为乙、甲');
o('A-admin-push-management-006','已发送推送只读',['当前推送任务已发送'],'任务及发送结果不可编辑');
o('A-admin-push-management-004','成功发送人数去重',['一次推送成功送达账号甲两次、乙一次，丙失败'],'成功发送人数为2');
for(const limit of [0,1])o('A-admin-recharge-package-detail-006',`活动套餐限购${limit}`,['活动有效且用户已有一笔支付成功订单',`限购次数配置${limit}`],limit===0?'用户仍可购买':'用户已用完限购次数');
o('A-admin-recharge-package-detail-009','整单退款不恢复活动限购',['限购1次已支付成功，订单后来全额退款'],'限购次数仍被占用，不能再次购买');
s('A-admin-task-detail-009','任务切动作重置指标周期',['原动作的指标和周期已选'],['选择另一个预置动作'],'原指标和周期重置，只提供新动作支持的选项');
for(const values of [[],[0],[-1],[10,10],[10],[10,20]])s('A-admin-task-detail-006',`任务条件${JSON.stringify(values)}`,['其他任务字段合法'],[`设置阈值列表${JSON.stringify(values)}`,'保存'],values.length&&values.every(v=>v>0)&&new Set(values).size===values.length?'任务条件可保存':'任务条件不能保存');
s('A-admin-task-config-007','停用任务不回收已领奖励',['用户已领取奖励，原余额已记录'],['停用该任务','确认'],'已发奖励保留，后续不产生新进度');
for(const type of ['门票房','密码房'])s('A-admin-feature-switch-005',`关闭${type}不改进行场次`,[`该房型有一场正在直播`],[`关闭${type}开关`],'禁止新建该房型，已开始场次继续');
o('A-admin-feature-switch-002','房型预置不可新增编辑',[],'不能新增或编辑房型名称');
s('A-admin-ticket-price-level-007','最后启用票价不能停用',['仅一个启用价格档位'],['停用该档位'],'阻止停用并提示，仍保留该启用档位');
s('A-admin-ticket-price-level-detail-003','门票价格重复',['已有50金币档位'],['新建档位价格50','保存'],'价格重复，不能保存');
o('A-admin-ticket-price-level-005','票价档位小排序值靠前',['两个启用档位排序分别1和2'],'排序1的档位排在2之前');
