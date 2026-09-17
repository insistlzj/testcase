import {a} from './design-admin.mjs';
import {test,P0,P1,P2,enter,calculation} from './case-design.mjs';

for(const [page,fragment,field,label]of [
 ['admin-gift-detail.html','排序权重：整数','排序权重','普通礼物'],
 ['admin-prop-detail.html','排序权重：整数','排序权重','道具'],
 ['admin-recharge-package-detail.html','排序：整数','排序','充值套餐'],
 ])a(page,[fragment],`${label}排序拒绝小数`,`${label}排序整数校验`,['其他必填字段已按有效配置填写'],[enter(page),`填写|${field}|为1.5`,'点击|保存'],'不能保存小数排序值',P1);
for(const [page,label]of [['admin-violation-type-detail.html','违规类型'],['admin-live-type.html','直播类型']])for(const lang of ['英语','印尼语','马来语'])a(page,['同语言不可重复'],`${label}${lang}名称不能重复`,`${label}${lang}唯一性`,[`已存在${lang}名称QA_DUP，其他语种名称唯一且必填完整`],[enter(page),`填写|${lang}名称|为QA_DUP`,'点击|保存'],`不能保存重复${lang}名称`,P1);
for(const [page,ref,label,steps,result]of [
 ['admin-violation-types.html','自定义可启停','停用自定义违规类型',['点击|自定义类型T001停用'],'T001状态显示停用'],
 ['admin-violation-types.html','自定义可启停','启用自定义违规类型',['点击|自定义类型T001启用'],'T001状态显示启用'],
 ['admin-violation-types.html','上下移 -> 更新排序','违规类型上移',['点击|B上移'],'B排在A之前'],
 ['admin-violation-types.html','上下移 -> 更新排序','违规类型下移',['点击|A下移'],'A排在B之后'],
 ['admin-violation-types.html','删除自定义类型 -> 确认后移除','删除自定义违规类型',['点击|T001删除','点击|确认'],'列表不再包含T001'],
 ['admin-gift-list.html','上下架或删除 -> 确认后执行','重新上架普通礼物',['点击|G001上架','点击|确认'],'G001状态显示上架'],
 ['admin-lucky-gift-config.html','上下架或删除 -> 确认后执行','重新上架幸运礼物',['点击|L001上架','点击|确认'],'L001状态显示上架'],
 ])a(page,[ref],label,label+'结果',[label.startsWith('停用')?'自定义违规类型T001当前启用':label.startsWith('启用')?'自定义违规类型T001当前停用':label.includes('上移')||label.includes('下移')?'自定义类型A与B相邻，初始A在B前':label.startsWith('删除')?'自定义违规类型T001存在且未被业务记录引用':label.includes('普通礼物')?'普通礼物G001当前下架，配置完整有效':'幸运礼物L001当前下架，配置完整有效'],[enter(page),...steps],result,P1);
a('admin-gift-detail.html',['新建时唯一'],'新建礼物不能使用已有ID','新礼物ID冲突',['礼物G001已存在，新建表单其他字段有效'],[enter('admin-gift-detail.html'),'填写|礼物ID|为G001','点击|保存'],'不能保存重复礼物ID',P1);
for(const type of ['普通','定制'])a('admin-gift-detail.html',['保存 -> 校验字段和时间 -> 留在当前详情'],`保存${type}礼物保持详情页`,`${type}礼物保存去向`,[`${type}礼物配置四语、图标和正整数单价完整；定制排期为次日10:00至12:00`],[enter('admin-gift-detail.html'),'点击|保存'],'保存成功后留在当前礼物详情页',P2);
for(const field of ['生效时间','失效时间'])a('admin-gift-detail.html',['仅定制礼物必填'],`定制礼物${field}不能为空`,`定制${field}必填`,['定制礼物其余必填项合法'],[enter('admin-gift-detail.html'),`清空|${field}`,'点击|保存'],`不能保存缺少${field}的定制礼物`,P1);
a('admin-gift-detail.html',['删除 -> 确认后返回列表'],'删除礼物返回列表','礼物删除去向',['测试礼物G001无业务使用，当前允许删除'],[enter('admin-gift-detail.html'),'点击|删除','点击|确认'],'返回礼物列表',P1);
for(const value of [-1,101])a('admin-lucky-gift-detail.html',['每档 0% 至 100%'],`单档中奖概率${value}不可保存`,'单档概率取值范围',['其他字段均合法，单次消耗10、次数1；奖励档位为0和20金币'],[enter('admin-lucky-gift-detail.html'),`填写|20金币档中奖概率|为${value}`,'点击|保存'],'不能保存越界的单档概率',P1);
a('admin-lucky-gift-detail.html',['奖励金币：每档非负整数，可为 0'],'零金币奖励档可保存','幸运零奖励档位',['单次消耗10、次数1；0金币概率50%、20金币概率50%，四语图标和ID有效'],[enter('admin-lucky-gift-detail.html'),'点击|保存'],'奖励列表保留0金币档位',P1);
a('admin-lucky-gift-detail.html',['增删档位或修改概率 -> 实时重算 RTP'],'修改幸运概率实时重算RTP','幸运概率编辑重算',['单次消耗10，原奖励0金币50%、20金币50%，RTP100%'],[enter('admin-lucky-gift-detail.html'),'填写|0金币概率|为75','填写|20金币概率|为25'],'RTP显示50%',P1);
a('admin-lucky-gift-detail.html',['增删档位或修改概率 -> 实时重算 RTP'],'删除奖励档位重新计算RTP','幸运删除档位重算',['单次消耗10，档位0金币50%、10金币25%、20金币25%'],[enter('admin-lucky-gift-detail.html'),'删除|20金币档位','填写|0金币概率|为75'],'RTP显示25%',P1);
for(const [value,result]of [[0,'RTP显示0%'],[100,'RTP显示200%']])a('admin-lucky-gift-detail.html',['每档 0% 至 100%'],`单档概率${value}边界可保存`,'概率合法端点',['单次消耗10、次数1；两个奖励档分别0和20金币，ID、四语及图标有效'],[enter('admin-lucky-gift-detail.html'),`填写|20金币概率|为${value}`,`填写|0金币概率|为${100-value}`,'点击|保存'],result,P1);
a('admin-placement-detail.html',['点击已上传素材预览'],'轮播素材打开已上传图片','展位素材预览',['第1项已上传图片A'],[enter('admin-placement-detail.html'),'点击|第1项素材'],'预览图片A',P2);
a('admin-placement-detail.html',['删除后可重新上传'],'轮播素材删除后更换图片','展位素材更换',['第1项原素材A，其他内容完整'],[enter('admin-placement-detail.html'),'删除|第1项素材','上传|第1项素材|选择qa-B.png'],'第1项素材显示qa-B.png对应图片',P2);
for(const [kind,result]of [['APP已有页面','显示目标页面选择器'],['活动长图页面','显示详情长图上传控件']])a('admin-placement-detail.html',['切换跳转类型'],`展位切换${kind}对应编辑控件`,`展位${kind}目标控件`,['当前有1项合法轮播内容'],[enter('admin-placement-detail.html'),`选择|跳转类型|为${kind}`],result,P2);
a('admin-placement-detail.html',['不同配置按展示位置和展示周期校验冲突'],'不同展位相同排期可保存','跨展示位置排期隔离',['已有直播广场配置9月17日至20日；新建福利中心配置相同日期，图片目标完整'],[enter('admin-placement-detail.html'),'点击|保存'],'福利中心配置保存成功',P1);
a('admin-placement-detail.html',['开始日和结束日均包含','不同配置按展示位置和展示周期校验冲突'],'同展位首尾相接日期算重叠','展位排期包含端点',['同展位已有9月17日至20日配置；新配置从9月20日至22日，其他字段合法'],[enter('admin-placement-detail.html'),'点击|保存'],'不能保存日期重叠的新配置',P1);
a('admin-placement-detail.html',['不同配置按展示位置和展示周期校验冲突'],'同展位相邻不重叠日期可保存','展位相邻排期',['同展位已有9月17日至20日配置；新配置21日至22日，其他字段合法'],[enter('admin-placement-detail.html'),'点击|保存'],'新配置保存成功',P1);
a('admin-placement-detail.html',['添加 -> 新增轮播行'],'添加第二项轮播内容','轮播内容新增',['当前仅有1项轮播内容'],[enter('admin-placement-detail.html'),'点击|添加'],'新增序号2的轮播行',P2);
for(const os of ['iOS','Android']){
 a('admin-recharge-package-detail.html',['选择商品 -> 回显销售价格和地区'],`${os}选商品回显商店价格`,`${os}商品价格来源`,[`${os}已启用，可选商品qa.store.${os}售价USD1.99，地区印度尼西亚`],[enter('admin-recharge-package-detail.html'),`选择|${os}商品|为qa.store.${os}`],`${os}销售价格显示USD1.99`,P1);
 a('admin-recharge-package-detail.html',['选择商品 -> 回显销售价格和地区'],`${os}选商品回显商店地区`,`${os}商品地区来源`,[`${os}已启用，可选商品qa.store.${os}地区印度尼西亚`],[enter('admin-recharge-package-detail.html'),`选择|${os}商品|为qa.store.${os}`],`${os}地区显示印度尼西亚`,P1);
 a('admin-recharge-package-detail.html',['开放充值金币、赠送金币输入'],`${os}选择商品后可填金币`,`${os}金币输入启用`,[`${os}已启用且存在可选商店商品qa.store.${os}`],[enter('admin-recharge-package-detail.html'),`选择|${os}商品|为qa.store.${os}`,`填写|${os}充值金币|为100`,`填写|${os}赠送金币|为20`],`${os}金币配置可输入100及20`,P1);
}
for(const field of ['限购次数','有效开始时间','有效结束时间'])a('admin-recharge-package-detail.html',['选择活动套餐时均必填'],`活动套餐${field}必填`,`活动套餐${field}校验`,['当前为活动套餐，其他字段合法'],[enter('admin-recharge-package-detail.html'),`清空|${field}`,'点击|保存'],`不能保存缺少${field}的活动套餐`,P1);
for(const field of ['生效开始时间','生效结束时间'])a('admin-task-detail.html',['起止必填'],`任务${field}不能为空`,`任务${field}必填`,['其他任务字段均合法'],[enter('admin-task-detail.html'),`清空|${field}`,'点击|保存'],`不能保存缺少${field}的任务`,P1);
a('admin-task-detail.html',['结束晚于开始'],'任务结束早于开始不能保存','任务逆序时间',['其他字段合法，开始9月18日10:00'],[enter('admin-task-detail.html'),'填写|生效结束时间|为9月18日09:59','点击|保存'],'不能保存结束早于开始的任务',P1);
a('admin-guild-recommendation-detail.html',['必选有效且未配置的公会'],'推荐公会不能为空','公会推荐目标必填',['推荐权重1'],[enter('admin-guild-recommendation-detail.html'),'清空|推荐公会','点击|保存'],'不能保存未选择公会的推荐',P1);
a('admin-guild-recommendation-detail.html',['校验公会有效性'],'所选公会停用后不能保存推荐','推荐保存时公会资格',['甲原有效且未配置推荐，表单已选甲并设权重1；环境准备：保存前甲被平台停用'],['点击|保存'],'不能保存已停用公会甲的推荐',P1);
a('admin-guild-recommendation-detail.html',['相同权重按最近更新时间倒序'],'相同推荐权重按更新时间排序','推荐同权重顺序',['甲乙权重均1，甲10:00保存、乙11:00保存'],[enter('admin-guild-recommendation.html')],'乙排在甲之前',{...P1,observe:'admin-guild-recommendation.html',extra:[['admin-guild-recommendation.html','排序权重：']]});

// Each row below is a reviewed field/result contract from current MainBasis, not inferred from a UI label.
for(const [page,ref,point,fixture,result]of [
 ['admin-user-detail.html','基础资料：','用户详情ID','所选用户U001，另一用户U002','用户ID显示U001'],
 ['admin-user-detail.html','基础资料：','用户详情地区','U001当前地区印度尼西亚，初始地区马来西亚','地区显示印度尼西亚'],
 ['admin-user-detail.html','基础资料：','用户详情注册时间','U001首次注册9月15日10:00，最后登录9月17日11:00','注册时间对应9月15日10:00'],
 ['admin-user-detail.html','基础资料：','用户详情账号状态','U001刚从正常变为封禁','账号状态显示封禁'],
 ['admin-user-detail.html','充值流水：','充值流水订单号','所选用户存在O001充值流水','充值订单号显示O001'],
 ['admin-user-detail.html','充值流水：','充值流水渠道','O001经Google Play支付','O001渠道显示Google Play'],
 ['admin-user-detail.html','充值流水：','充值流水支付状态','O001已支付成功，O002失败','O001状态显示成功'],
 ['admin-user-detail.html','消费流水：','消费流水商品快照','E001消费时商品名QA玫瑰，当前已改名QA新礼物','E001商品仍显示QA玫瑰'],
 ['admin-user-detail.html','消费流水：','消费流水数量','E001成功送出3件普通礼物','E001数量显示3'],
 ['admin-user-detail.html','消费流水：','消费流水扣减','E001单价10金币、数量3，成功扣30金币','E001扣减金币显示30'],
 ['admin-user-detail.html','消费流水：','消费流水场次','E001发生于主播H001的S1，主播现已开S2','E001直播场次显示S1'],
 ['admin-user-detail.html','消费流水：','消费流水只读','E001已经成功消费','E001无修改金额或数量操作'],
 ['admin-user-detail.html','登录设备：','登录设备型号','所选用户设备记录型号QA设备A','设备显示QA设备A'],
 ['admin-user-detail.html','登录设备：','登录设备系统','设备A系统Android15','设备A系统显示Android15'],
 ['admin-user-detail.html','登录设备：','登录设备应用版本','设备A应用版本1.2.3','设备A应用版本显示1.2.3'],
 ['admin-user-detail.html','违规记录：','用户违规来源','用户U001违规记录来自账号举报R001','违规来源对应举报R001'],
 ['admin-user-detail.html','违规记录：','用户违规结论','记录R001确认违规且已封禁','R001结论显示确认违规'],
 ['admin-user-detail.html','违规记录：','用户违规处置','记录R001确认违规且已封禁','R001处置显示封禁'],
 ['admin-user-detail.html','违规记录：','用户违规时间','R001处理完成时间9月17日10:00','R001处置时间对应9月17日10:00'],
 ['admin-host-detail.html','直播记录：','主播历史场次隔离','H001有S1和S2记录，H002有S3','H001记录不包含S3'],
 ['admin-host-detail.html','违规记录：','主播确认违规记录','甲记录A已确认违规，B尚未确认','违规记录展示已确认的A'],
 ['admin-live-detail.html','场次信息：','场次详情ID','当前所选S1，主播另有S2','场次ID显示S1'],
 ['admin-live-detail.html','场次信息：','场次详情主播','S1属于H001，H002属于S2','当前主播显示H001'],
 ['admin-live-detail.html','场次信息：','场次详情房型','S1开播时密码房，主播新场次为普通房','S1房型仍显示密码房'],
 ['admin-live-detail.html','巡房记录：','巡房记录人员','巡房记录I001实际由用户U001执行','I001巡房人员显示U001'],
 ['admin-live-detail.html','巡房记录：','巡房记录进入时间','I001实际进入S1时间10:15，排班开始10:00','I001进入时间对应10:15'],
 ['admin-live-detail.html','巡房记录：','巡房记录问题','I001记录问题QA画面异常','I001问题显示QA画面异常'],
 ['admin-live-detail.html','巡房记录：','巡房记录处置','I001实际执行警告','I001处置显示警告'],
 ['admin-live-detail.html','巡房记录：','巡房记录备注','I001备注QA已提醒','I001备注显示QA已提醒'],
 ['admin-inspection-schedule.html','排班编号：','排班编号唯一','已成功创建两个排班A、B','A与B排班编号不同'],
 ['admin-inspection-schedule-detail.html','排班信息：','排班详情日期','排班S1的业务日期9月17日','排班日期显示9月17日'],
 ['admin-inspection-schedule-detail.html','排班信息：','排班详情时段','S1起止为10:00至12:00','起止时段显示10:00至12:00'],
 ['admin-inspection-schedule-detail.html','排班信息：','排班详情创建时间','S1创建于9月16日15:00，生效9月17日','创建时间对应9月16日15:00'],
 ['admin-inspection-schedule-detail.html','巡房人员：','排班人员当前等级','名单用户U001原等级2，当前等级3','U001等级显示3'],
 ['admin-content-audit.html','命中类型 / 风险等级：','机审原始风险值','告警A机审命中色情低俗、风险高，尚未人工处理','A风险等级显示高'],
 ['admin-content-audit-detail.html','基础信息：','机审告警对象','A关联S1、主播H001，另有B关联S2','当前审核单显示A'],
 ['admin-report-detail.html','举报对象：','账号举报详情归属','当前账号举报R001针对U001，U001另有直播场次S1','举报对象显示账号U001'],
 ['admin-report-detail.html','内容 / 证据：','举报内容原文快照','举报R001原说明QA原始描述，后续用户签名修改','内容仍显示QA原始描述'],
 ['admin-violation-types.html','类型 ID：','违规类型唯一编号','系统已创建不同类型A和B','A与B类型ID不同'],
 ['admin-violation-types.html','列表中文','违规列表名称语言','类型A中文QA中文、英语QAEnglish','列表名称显示QA中文'],
 ['admin-violation-type-detail.html','编辑只读','违规类型编号只读','当前编辑已创建类型T001','类型ID不可编辑'],
 ])a(page,[ref],`后台核对${point}`,point,[fixture],[enter(page)],result,P2);
for(const status of ['待审核','已通过','已驳回'])a('admin-host-review.html',['认证状态：'],`认证列表显示${status}`,'认证申请状态',['申请A当前状态为'+status],[enter('admin-host-review.html')],`A认证状态显示${status}`,P1);
for(const status of ['待处理','人工复审中','已忽略','已处置'])a('admin-content-audit.html',['审核状态：'],`机审告警列表显示${status}`,'机审告警当前状态',['告警A当前处于'+status],[enter('admin-content-audit.html')],`A审核状态显示${status}`,P1);
for(const [page,states,ref,label]of [
 ['admin-account-violation.html',['正常','封禁'],'账号状态：','被举报账号'],
 ['admin-account-violation.html',['待处理','已处理'],'处理状态：','账号举报'],
 ['admin-report-handling.html',['直播中','已结束'],'直播状态：','被举报场次'],
 ['admin-report-handling.html',['待处理','已处理','已作废'],'处理状态：','直播举报'],
 ])for(const status of states)a(page,[ref],`${label}列表展示${status}`,`${label}状态回显`,[`目标记录A的对应状态为${status}`],[enter(page)],`A对应状态显示${status}`,P2);
for(const action of ['封禁','解封'])a('admin-user-list.html',['填写原因并确认'],`用户${action}时原因不能为空`,`账号${action}原因必填`,[`目标用户当前${action==='封禁'?'正常':'封禁'}`],[enter('admin-user-list.html'),`点击|目标用户${action}`,'清空|原因','点击|确认'],`不能提交空原因${action}`,P1);
a('admin-host-review.html',['筛选取交集'],'平台认证查询状态主播公会取交集','平台审核组合筛选',['甲在G001待审核、乙在G001已通过、甲旧单在G002已驳回'],[enter('admin-host-review.html'),'选择|状态|为待审核','填写|主播|为甲','选择|公会|为G001','点击|查询'],'结果仅包含甲在G001的待审核申请',P1);
a('admin-content-audit-detail.html',['已忽略、已处置为终态'],'已处置告警不可重复提交','机审已处置终态',['告警A已处置'],[enter('admin-content-audit-detail.html')],'A不再提供可提交的处置操作',P1);
a('admin-content-audit-detail.html',['复审中可继续处理'],'人工复审中告警可忽略结案','复审后结案',['告警A处于人工复审中，确认是误报'],[enter('admin-content-audit-detail.html'),'选择|处置类型|为忽略','填写|处置原因|为人工确认误报','点击|提交'],'告警A状态变为已忽略',P1);
for(const action of ['不处置','封禁'])a('admin-report-detail.html',['账号：不处置、封禁'],`账号举报执行${action}后完成`,`账号举报${action}结果`,['账号举报工单待处理，目标账号正常'],[enter('admin-report-detail.html'),`选择|处置类型|为${action}`,'填写|处置原因|为QA复核结论','点击|处理'],'账号举报工单状态显示已处理',P1);
for(const [action,result]of [['不处置','账号状态保持正常'],['封禁','账号状态显示封禁']])a('admin-report-detail.html',['账号：不处置、封禁'],`账号举报${action}对应账号状态`,`账号举报${action}账号观察`,['当前工单被举报账号U001正常'],[enter('admin-report-detail.html'),`选择|处置类型|为${action}`,'填写|处置原因|为QA复核结论','点击|处理',enter('admin-user-detail.html'),'查看|U001账号状态'],result,{...P1,observe:'admin-user-detail.html',extra:[['admin-user-detail.html','账号状态']]});
for(const [page,ref,title,fixture,result,point]of [
 ['admin-dashboard.html','总充值金额 / 人数：','当日充值金额排除失败订单','甲成功支付8USD，乙成功支付2USD，丙失败10USD','总充值金额显示10USD'],
 ['admin-dashboard.html','总充值金额 / 人数：','当日充值人数按账号去重','甲有2笔成功充值，乙1笔成功，丙仅失败','充值人数显示2人'],
 ['admin-dashboard.html','新用户充值金额：','新用户金额排除注册次日充值','甲当日注册并充值8USD，乙昨日注册今日充值2USD','新用户充值金额显示8USD'],
 ['admin-dashboard.html','达成有效天主播：','工作台有效天人数去重','甲有效直播180分钟、乙179分钟、丙360分钟','达成有效天主播显示2人'],
 ['admin-user-list.html','累计充值：','用户累计充值只计实付成功','甲成功实付8USD、失败10USD，成功订单标价10USD','甲累计充值显示8USD'],
 ['admin-user-list.html','注册时间：','用户注册筛选包含结束时点','甲注册9月15日23:59:59，乙注册9月16日00:00:00，筛选9月15日','结果包含甲且不含乙'],
 ['admin-host-list.html','账号状态：','主播封禁状态与直播权限分离','主播账号正常，平台直播权限关闭','账号状态仍显示正常'],
 ['admin-host-review.html','申请单号：','重新认证申请使用新单号','同一用户旧单A已驳回，重新提交B且公会通过','B的申请单号不同于A'],
 ['admin-host-review.html','提交时间：','认证列表采用公会提交平台时间','用户9月14日申请，公会9月15日10:00通过并提交','提交时间显示9月15日10:00'],
 ['admin-live-management.html','观众人数：','场次观众去重并排除运营账号','甲真实用户进入3次，乙真实用户进入1次，运营账号丙进入1次','观众人数显示2'],
 ['admin-live-management.html','直播时长：','已结束场次时长取首尾时间','场次10:00开始11:30结束','直播时长显示1小时30分钟'],
 ['admin-live-management.html','直播时长：','进行中场次时长取当前时间','场次10:00开始，当前11:00且未结束','直播时长显示1小时'],
 ['admin-live-management.html','收礼数量：','场次收礼按成功件数累加','普通礼物成功3件、幸运礼物成功2件、另有失败4件','收礼数量显示5'],
 ['admin-live-detail.html','场次信息：','场次详情保留旧主题快照','旧场次主题为A，主播新场次主题改为B','旧场次标题显示A'],
 ['admin-inspection-schedule.html','排班人数：','排班人数与有效人员一致','当前排班有甲乙2名有效巡房人员','排班人数显示2'],
 ['admin-content-audit.html','告警截图：','告警采用命中时截图','命中截图A，当前直播画面已变为B','告警截图仍为A'],
 ['admin-account-violation.html','提交时间：','账号举报采用工单生成时间','工单9月15日10:00生成，9月16日处理','提交时间显示9月15日10:00'],
 ['admin-guild-detail.html','主播列表：','公会详情隔离外会主播','甲当前属于A公会，乙属于B，当前查看A','主播列表不显示乙'],
 ['admin-prop-list.html','排序权重越大越靠前','道具按权重倒序','道具A权重1、B权重2，其他筛选一致','B排列在A之前'],
 ['admin-prop-detail.html','编辑只读','已有道具ID不可编辑','当前编辑道具ID为P001','道具ID不可编辑'],
 ['admin-prop-detail.html','操作记录：','道具修改保留操作记录','管理员qa-admin在9月16日10:00保存单价由10改为20','操作记录包含qa-admin的该次价格修改'],
 ['admin-placement-config.html','展示素材：','展位素材数量取当前配置','同一展位配置有3项轮播素材','展示素材数量显示3'],
 ['admin-placement-config.html','否则隐藏','关闭展位即使在排期内仍隐藏','今天在排期内但配置状态关闭','配置状态显示隐藏'],
 ['admin-placement-config.html','否则隐藏','展位开始日前隐藏','配置启用，今天早于开始日1天','配置状态显示隐藏'],
 ['admin-placement-config.html','否则隐藏','展位结束日后隐藏','配置启用，今天晚于结束日1天','配置状态显示隐藏'],
 ['admin-push-management.html','列表标题按后台中文展示','推送列表显示中文标题','同任务中文标题QA中文，英语标题QAEnglish','列表标题显示QA中文'],
 ['admin-push-detail.html','已存在只读','推送ID不允许修改','当前任务已创建但未发送','推送ID不可编辑'],
 ['admin-recharge-package.html','到账金币合计','套餐列表分别显示两平台到账金币','iOS基础100赠送20，Android基础200赠送30','iOS到账金币显示120'],
 ['admin-recharge-package.html','到账金币合计','套餐列表Android到账合计','iOS基础100赠送20，Android基础200赠送30','Android到账金币显示230'],
 ['admin-recharge-package-detail.html','更新时间：','套餐更新时间不可手工修改','当前编辑已有套餐','更新时间不可编辑'],
 ['admin-task-detail.html','仅展示该指标支持','任务指标限定可选周期','后台系统预置所选指标只支持每日和每周','周期选择中不提供每月'],
 ['admin-guild-recommendation.html','数值越大越靠前','公会推荐按权重倒序','有效公会A权重1、B权重2','B排列在A之前'],
 ['admin-ticket-price-level.html','数值越小越靠前','门票档位按排序升序','10金币档位排序2，20金币档位排序1','20金币档位排列在10金币档位之前'],
 ['admin-ticket-price-level-detail.html','编辑只读','门票档位ID不可修改','当前编辑已有门票档位','档位ID不可编辑'],
 ['admin-sensitive-words-detail.html','编辑只读','敏感词ID不可修改','当前编辑已有敏感词','词条ID不可编辑'],
 ['admin-recharge-order.html','成功时间：','充值成功时间采用入账完成时点','渠道支付10:00成功，金币10:01完成入账','成功时间显示10:01'],
 ['admin-recharge-order-detail.html','订单 / 渠道信息：','充值渠道交易号只读','原渠道交易号T001','渠道交易号不可编辑'],
 ['admin-consumption-order.html','消费类型：','消费类型枚举范围','当前查询消费订单','消费类型包含普通礼物、定制礼物、幸运礼物、门票'],
 ['admin-consumption-order.html','余额不足或条件失败不生成成功订单','失败消费不生成成功订单','测试业务请求A因余额不足失败，另有成功B','成功订单列表不包含请求A'],
 ['admin-consumption-order-detail.html','消费去向：','消费归属保留发生时场次','订单归属场次S1，主播后来开播S2','消费去向场次ID仍为S1'],
 ['admin-refund-order.html','仅记录已完成结果','退款列表不列待处理申请','退款A已完成，退款B尚未完成','列表不包含B'],
 ['admin-settlement-record.html','上传人 / 时间：','主播分成记录上传人','qa-finance于9月16日10:00确认导入有效批次','上传人显示qa-finance'],
 ['admin-settlement-record-detail.html','主播人数：','分成详情人数按明细账号去重','有效批次包含不同主播甲乙2人','主播人数显示2'],
 ['admin-host-balance-change-record.html','不可修改的修正流水','主播余额修正流水不可修改','已成功保存一条分成修正','该修正流水无修改入口'],
 ['admin-guild-balance-change-record.html','不可修改流水','公会余额修正流水不可修改','已成功保存一条分成修正','该修正流水无修改入口'],
 ['admin-data-overview.html','各日充值去重人数之和','概览充值人数按日累加','甲连续两日充值，乙仅第二日充值，范围包含两日','充值人数汇总显示3'],
 ['admin-data-overview.html','每主播每天最多 1 次','概览有效天按主播天统计','甲两日均达标，乙仅第二日达标','达成有效天主播汇总显示3'],
 ['admin-user-active-statistics.html','付费用户：','付费用户按成功充值账号去重','甲成功2笔，乙1笔，丙仅失败','付费用户显示2'],
 ['admin-host-statistics.html','违规主播 / 场次：','违规主播按确认结论去重','甲两个场次确认违规，乙一个场次确认违规，丙举报不成立','违规主播显示2'],
 ['admin-host-statistics.html','违规主播 / 场次：','违规场次数独立去重','甲的S1、S2确认违规，S1含两条告警，乙S3确认违规','违规场次显示3'],
 ['admin-recharge-statistics.html','总充值金额 / 人数 / 订单：','充值订单量不同于充值人数','甲成功2笔、乙成功1笔，失败2笔','充值订单数显示3'],
 ['admin-recharge-statistics.html','充值赠送 / 系统赠送金币：','系统赠送不混入套餐赠送','签到10金币、任务20金币、套餐赠送100金币','系统赠送金币显示30'],
 ['admin-user-activity-statistics.html','总充值人数：','新老用户充值人数汇总','当天新用户成功充值2人，老用户成功充值3人','总充值人数显示5'],
 ['admin-monthly-income-expense.html','累计充值：','月度充值按支付完成月','8月订单9月完成支付10USD，另1笔8月已支付20USD','9月累计充值显示10USD'],
 ['admin-operation-issue-records.html','发放时间：','虚拟币发放记录采用成功时间','发放请求9月15日23:59发送，9月16日00:00成功','发放时间显示9月16日00:00'],
 ['admin-operation-guild-controls.html','本月剩余额度：','公会剩余额度减已发放','月额度1000金币，成功发放300，失败发放100','本月剩余额度显示700金币'],
 ['admin-operation-guild-controls.html','账户余额累计：','公会额度页汇总账号余额','本公会运营甲余额100、乙200，外公会丙1000','账户余额累计显示300金币'],
 ['admin-operation-guild-controls.html','本月累计消费：','额度页消费不计失败记录','本月成功消费100金币，失败50，上月成功200','本月累计消费显示100金币'],
 ].map((row,i)=>[...row,[
 '成功充值金额合计','充值账号去重人数','当日新用户充值金额','有效天达标人数','累计实付充值金额','注册时间结束边界',
 '账号状态独立显示','重提申请单号','公会提交时间','场次有效观众人数','结束场次累计时长','在播场次累计时长','成功收礼件数','历史主题快照',
 '有效排班人数','命中时告警截图','举报工单提交时间','本公会主播隔离','道具权重排序','道具ID只读','道具修改审计记录','展位素材数量',
 '关闭配置展示状态','排期开始前展示状态','排期结束后展示状态','推送中文列表标题','推送ID只读','iOS到账金币','Android到账金币',
 '套餐更新时间只读','指标支持的任务周期','推荐公会权重排序','门票档位顺序','档位ID只读','敏感词ID只读','金币入账完成时间',
 '渠道交易号只读','消费类型选项','失败消费订单排除','消费场次快照','已完成退款范围','分成批次上传人','批次主播人数',
 '主播修正流水只读','公会修正流水只读','每日人数累计口径','主播有效天累计口径','成功付费用户人数','确认违规主播人数',
 '确认违规场次数','成功充值订单数','系统赠送金币口径','新老充值人数合计','支付完成月份归属','虚拟币发放成功时间',
 '公会剩余虚拟币额度','本公会运营余额合计','月度成功虚拟币消费'
 ][i]]))a(page,[ref],title,point,[fixture],[enter(page)],result,P1);

for(const [page,ref,field]of [
 ['admin-prop-detail.html','图标 / 素材：','图标'],['admin-prop-detail.html','图标 / 素材：','素材'],
 ['admin-recharge-package-detail.html','套餐封面：必传','套餐封面']
 ])a(page,[ref],`${field}缺失禁止保存`,`${field}必填资源`,[`当前编辑表单除${field}为空外其余字段均有效填写`],['点击|保存'],`不能保存缺少${field}的配置`,P1);

for(const [page,ref,title,button,expected]of [
 ['admin-gift-list.html','上下架或删除','下架普通礼物','下架','下架'],
 ['admin-custom-gift.html','提前下架','提前下架定制礼物','提前下架','已下架'],
 ['admin-lucky-gift-config.html','上下架或删除','下架幸运礼物','下架','下架'],
 ['admin-task-config.html','启停 -> 确认','停用任务','停用','停用'],
 ])a(page,[ref],title,`${title}状态`,['当前目标处于可执行该操作的启用或上架状态'],[enter(page),`点击|目标记录${button}`,'点击|确认'],`目标记录状态为${expected}`,{...P1,...(page.includes('gift')?{transition:'ST-gift-off'}:{})});

for(const [page,entity]of [['admin-system-account.html','后台账号'],['admin-system-role.html','后台角色']])test(page,['启停 ->'],'超级管理员',`停用普通${entity}`,`${entity}停用状态`,[`目标为启用且非内置的${entity}`],[enter(page),'点击|目标记录停用',...(entity==='后台账号'?['填写|原因为测试停用']:[]),'点击|确认'],`目标${entity}状态为停用`,{...P1,transition:entity==='后台角色'?'ST-role-disable':undefined});
test('admin-system-role-detail.html',['内置超级管理员默认全部权限且不可修改'],'超级管理员','内置角色权限不可编辑','内置角色权限保护',['当前编辑内置超级管理员角色'],[enter('admin-system-role-detail.html')],'权限树为全部权限且不可编辑',P1);

// Remaining compound clauses: add only the independently observable result branches.
a('admin-dashboard.html',['指标卡取最新自然日'],'工作台指标卡只取最新自然日','指标卡统计日期',['最新自然日为9月17日，9月16日与9月17日均有数据'],[enter('admin-dashboard.html')],'指标卡显示9月17日数据',P1);
a('admin-user-list.html',['当前等级'],'用户列表显示当前财富等级','当前财富等级',['用户U001原财富等级1，当前财富等级3'],[enter('admin-user-list.html')],'U001财富等级显示3',P1);
a('admin-user-list.html',['非负整数且上限不得小于下限'],'财富等级筛选合法端点','财富等级有效范围',['用户甲财富等级0、乙3、丙4'],[enter('admin-user-list.html'),'填写|财富等级下限|为0','填写|财富等级上限|为3','点击|查询'],'结果包含甲乙且不包含丙',P1);
a('admin-user-list.html',['首次注册时间'],'用户列表保留首次注册时间','首次注册时间',['U001首次注册9月15日10:00，9月17日重新登录'],[enter('admin-user-list.html')],'U001注册时间仍为9月15日10:00',P1);
a('admin-user-list.html',['时间筛选首尾均包含'],'注册时间筛选包含开始时点','注册时间开始边界',['甲注册9月15日00:00:00，乙注册9月14日23:59:59，筛选9月15日'],[enter('admin-user-list.html'),'选择|注册日期|为9月15日','点击|查询'],'结果包含甲且不包含乙',P1);
for(const action of ['封禁','解封'])a('admin-user-list.html',['更新并留痕'],`用户${action}操作写入留痕`,`账号${action}审计记录`,[`目标用户当前${action==='封禁'?'正常':'封禁'}，操作账号为qa-admin`],[enter('admin-user-list.html'),`点击|目标用户${action}`,'填写|原因|为QA审计验证','点击|确认',enter('admin-user-detail.html'),'切换|违规记录'],'记录包含qa-admin、QA审计验证及本次操作时间',{...P1,observe:'admin-user-detail.html',extra:[['admin-user-detail.html','违规记录：']]});
a('admin-user-detail.html',['基础资料：'],'用户详情显示当前昵称','用户详情昵称',['U001原昵称QA旧名，当前昵称QA新名'],[enter('admin-user-detail.html')],'昵称显示QA新名',P2);
a('admin-user-detail.html',['负数时禁止消费'],'负金币余额不产生成功消费','负余额消费拦截',['U001真实金币余额-10；环境准备：U001尝试购买1金币商品'],[enter('admin-user-detail.html'),'切换|消费流水'],'消费流水不新增该次成功消费记录',P1);
a('admin-user-detail.html',['最近登录时间和状态'],'登录设备显示最近登录时间','设备最近登录时间',['设备A最近登录时间9月17日11:00，设备B为9月16日'],[enter('admin-user-detail.html'),'切换|登录设备'],'设备A最近登录时间显示9月17日11:00',P2);
for(const [device,state]of [['设备A','在线'],['设备B','离线']])a('admin-user-detail.html',['最近登录时间和状态'],`登录设备显示${state}状态`,`${device}登录状态`,[`${device}当前${state}`],[enter('admin-user-detail.html'),'切换|登录设备'],`${device}状态显示${state}`,P2);
a('admin-user-detail.html',['扣回原订单全部到账金币'],'充值退款扣回整单到账金币','退款整单扣回',['U001退款前余额150；原订单基础100金币、赠送20金币，均已到账'],[enter('admin-user-detail.html'),'切换|充值流水','查看|原订单退款完成后的余额'],'金币余额显示30',P1);
a('admin-host-detail.html',['每次开播生成独立场次并保留'],'主播直播记录保留场次时长','主播场次时长快照',['主播H001场次S1实际时长60分钟，另有S2时长30分钟'],[enter('admin-host-detail.html'),'切换|直播记录'],'S1时长显示60分钟',P2);
for(const [field,fixture,result]of [
 ['消费','S1用户实际消费100金币，S2消费200金币','S1消费显示100金币'],
 ['处置','S1被警告，S2无处置','S1处置显示警告'],
 ['收益','S1主播收益50金币，S2收益80金币','S1收益显示50金币'],
])a('admin-host-detail.html',['每次开播生成独立场次并保留'],`主播直播记录保留场次${field}`,`主播场次${field}快照`,[fixture],[enter('admin-host-detail.html'),'切换|直播记录'],result,P2);
a('admin-host-detail.html',['切换 Tab -> 加载记录'],'主播详情切换直播记录Tab','主播详情Tab加载',['主播H001存在场次S1'],[enter('admin-host-detail.html'),'切换|直播记录'],'直播记录加载S1',P2);
a('admin-host-detail.html',['更新并留痕'],'关闭主播权限后记录操作留痕','主播权限审计记录',['主播平台直播权限开启，操作账号qa-admin'],[enter('admin-host-detail.html'),'关闭|平台直播权限','填写|原因|为QA权限验证','点击|确认'],'操作记录包含qa-admin、QA权限验证及本次操作时间',P1);
a('admin-host-detail.html',['关闭即结束当前直播'],'平台直播权限关闭后不能新开场次','关闭权限后的开播拦截',['主播H001平台直播权限已关闭；环境准备：H001尝试再次开播'],[enter('admin-host-detail.html'),'切换|直播记录'],'H001未生成新的直播场次',P1);
a('admin-host-review.html',['通过前无主播身份'],'平台审核前用户没有主播身份','审核前身份状态',['用户U001申请已由公会提交平台且当前待审核'],[enter('admin-host-review.html')],'U001仍显示为用户且没有已认证主播身份',P1);
a('admin-live-management.html',['直播中和已结束场次'],'直播场次列表同时查询两种状态','场次状态查询',['主播H001有直播中S1和已结束S2'],[enter('admin-live-management.html')],'列表可分别查询到S1和S2',P1);
a('admin-live-management.html',['巡查或处置'],'直播场次进入详情巡查','场次巡查入口',['场次S1直播中'],[enter('admin-live-management.html'),'点击|S1详情'],'进入S1直播详情页',{...P1,observe:'admin-live-detail.html',extra:[['admin-live-detail.html','查看单场直播画面']]});
a('admin-live-management.html',['结束后保留消息'],'结束场次保留消息记录','历史场次消息',['S1结束前存在消息M001'],[enter('admin-live-management.html'),'点击|S1详情','查看|消息记录'],'仍可查看M001',P1);
for(const [field,fixture,result]of [
 ['消费','S1结束前消费100金币','S1消费仍显示100金币'],
 ['处置','S1结束前被警告','S1处置仍显示警告'],
 ['收益','S1结束前主播收益50金币','S1收益仍显示50金币'],
])a('admin-live-management.html',['结束后保留消息、消费、处置和收益'],`结束场次保留${field}`,`结束场次${field}留存`,[fixture],[enter('admin-live-management.html'),'查看|已结束场次S1'],result,P1);
a('admin-live-management.html',['历史场次不可重开'],'已结束历史场次不能重新开播','历史场次不可重开',['场次S1已结束'],[enter('admin-live-management.html'),'查看|已结束场次S1'],'S1不提供重新开播操作',P1);
a('admin-live-management.html',['查询 -> 条件取交集'],'直播场次多条件查询取交集','直播场次组合筛选',['甲主播有直播中普通房S1和已结束门票房S2，乙主播有直播中普通房S3'],[enter('admin-live-management.html'),'填写|主播|为甲','选择|状态|为直播中','选择|房型|为普通房','点击|查询'],'结果仅包含S1',P1);
a('admin-live-detail.html',['标题和时间取本场快照'],'直播详情保留场次标题','场次标题快照',['S1开播标题QA旧标题，主播后续场次标题为QA新标题'],[enter('admin-live-detail.html')],'S1标题显示QA旧标题',P2);
a('admin-live-detail.html',['标题和时间取本场快照'],'直播详情保留场次时间','场次时间快照',['S1开播10:00结束11:00，当前时间12:00'],[enter('admin-live-detail.html')],'S1时间显示10:00至11:00',P2);
a('admin-live-detail.html',['通知主播并留痕'],'直播警告写入处置留痕','直播警告审计记录',['S1直播中，操作账号qa-admin'],[enter('admin-live-detail.html'),'点击|警告','填写|原因|为QA直播提醒','点击|确认'],'处置记录包含qa-admin、QA直播提醒及本次操作时间',P1);
for(const [field,fixture,result]of [
 ['编号','排班S1编号QA-S001','排班编号显示QA-S001'],
 ['人数','排班S1有甲乙2名有效人员','排班人数显示2'],
 ['状态','排班S1当前状态生效中','排班状态显示生效中'],
])a('admin-inspection-schedule-detail.html',['排班信息：'],`排班详情显示${field}`,`排班详情${field}`,[fixture],[enter('admin-inspection-schedule-detail.html')],result,P2);
for(const [field,fixture,result]of [
 ['头像','巡房人员U001当前头像为A','U001头像显示A'],
 ['昵称','U001当前昵称QA巡房员','U001昵称显示QA巡房员'],
 ['用户ID','名单包含U001和U002','目标人员用户ID显示U001'],
])a('admin-inspection-schedule-detail.html',['巡房人员：'],`排班人员显示${field}`,`排班人员${field}`,[fixture],[enter('admin-inspection-schedule-detail.html')],result,P2);
for(const [field,fixture,result]of [
 ['审核单','当前告警审核单A，另有审核单B','审核单显示A'],
 ['场次','告警A关联直播场次S1','场次显示S1'],
 ['主播','告警A关联主播H001','主播显示H001'],
 ['命中类型','告警A命中类型色情低俗','命中类型显示色情低俗'],
 ['时间','告警A命中时间9月17日10:00','时间显示9月17日10:00'],
])a('admin-content-audit-detail.html',['基础信息：'],`审核详情显示${field}`,`审核基础${field}`,[fixture],[enter('admin-content-audit-detail.html')],result,P2);
a('admin-content-audit-detail.html',['转人工复审、忽略'],'审核详情可选择忽略','内容审核忽略选项',['告警A待处理'],[enter('admin-content-audit-detail.html'),'点击|处置类型'],'处置类型包含忽略',P2);
for(const [field,result]of [['审核人','复审记录审核人显示qa-admin'],['审核时间','复审记录审核时间显示本次提交时间']])a('admin-content-audit-detail.html',['同时保存审核人和时间'],`内容处置保存${field}`,`内容审核${field}`,['告警A待处理，操作账号qa-admin'],[enter('admin-content-audit-detail.html'),'选择|处置类型|为忽略','填写|处置原因|为QA误报','点击|提交'],result,P1);
a('admin-guild-list.html',['平台管理员查询'],'后台公会列表条件查询','公会列表查询',['公会甲名称QA甲且启用，乙名称OTHER且启用'],[enter('admin-guild-list.html'),'填写|名称|为QA甲','点击|查询'],'结果仅包含公会甲',P2);
a('admin-guild-list.html',['新建 -> 详情编辑态'],'后台新建公会进入编辑态','公会新建入口',[],[enter('admin-guild-list.html'),'点击|新建'],'进入公会详情编辑态',{...P1,observe:'admin-guild-detail.html',extra:[['admin-guild-detail.html','查看或编辑公会资料']]});
a('admin-guild-list.html',['启停或解散 -> 校验并确认 -> 更新状态'],'后台停用公会更新状态','公会停用状态',['公会甲当前启用且无进行中解散操作'],[enter('admin-guild-list.html'),'点击|公会甲停用','点击|确认'],'公会甲状态显示停用',P1);
for(const [effect,fixture,result]of [
 ['管理账号失效','公会甲已结清并完成解散，原管理账号qa-chief','qa-chief不能再以公会账号登录'],
 ['主播关系解除','公会甲已结清并完成解散，原主播H001','H001所属公会不再是甲'],
 ['主播身份失效','公会甲已结清并完成解散，原主播H001','H001不再具有主播身份'],
 ['停止开播','公会甲解散前主播H001正在直播','H001当前直播立即结束'],
])a('admin-guild-list.html',['解散后账号失效、关系解除、主播失去身份并停止开播'],`公会解散后${effect}`,`公会解散${effect}`,[fixture],[enter('admin-guild-list.html'),'查看|已解散公会甲'],result,P1);
