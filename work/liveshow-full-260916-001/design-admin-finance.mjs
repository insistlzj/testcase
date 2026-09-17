import {a} from './design-admin.mjs';
import {test,P0,P1,P2,ERR,enter,calculation} from './case-design.mjs';
const recharge='admin-recharge-order-detail.html',consumption='admin-consumption-order-detail.html',refund='admin-refund-order.html';
for(const [page,ref,point,fixture,result]of [
 ['admin-recharge-order.html','订单号 / 渠道交易号：','平台充值单号唯一','两笔充值订单A和B均成功','A与B平台订单号不同'],
 ['admin-recharge-order.html','订单号 / 渠道交易号：','渠道对账号码','订单A渠道交易号T001','A渠道交易号显示T001'],
 ['admin-recharge-order.html','充值金额：','充值列表实际支付','订单A标价10USD、实付8USD且已成功','A充值金额显示8USD'],
 ['admin-recharge-order.html','基础 / 赠送金币：','充值列表基础金币','订单A基础100金币、赠送20金币','A基础金币显示100'],
 ['admin-recharge-order.html','基础 / 赠送金币：','充值列表赠送金币','订单A基础100金币、赠送20金币','A赠送金币显示20'],
 ['admin-recharge-order.html','到账金币：','充值列表到账合计','订单A基础100金币、赠送20金币','A到账金币显示120'],
 ['admin-recharge-order.html','状态：','成功充值订单状态','订单A支付及金币入账均成功，未退款','A状态显示充值成功'],
 ['admin-recharge-order.html','状态：','退款完成订单状态','订单A已完成整单退款','A状态显示已退款'],
 [recharge,'订单金额 / 实付金额：','充值详情标价','订单A标价10USD，实际支付8USD','订单金额显示10USD'],
 [recharge,'订单金额 / 实付金额：','充值详情实付','订单A标价10USD，实际支付8USD','实付金额显示8USD'],
 [recharge,'退款记录：','退款记录单号','订单A对应已完成退款R001','退款单号显示R001'],
 [recharge,'退款记录：','退款记录原渠道','A原渠道Google Play，本次按原渠道退款','退款渠道显示Google Play'],
 [recharge,'退款记录：','退款记录原因','管理员以QA退款原因完成手动退款','退款原因显示QA退款原因'],
 [recharge,'退款记录：','退款记录操作人','qa-finance完成本次手动退款','退款操作人显示qa-finance'],
 [recharge,'退款记录：','退款记录完成时间','退款于9月17日11:00完成','退款时间对应9月17日11:00'],
 ['admin-consumption-order.html','数量：','消费连送累计件数','订单E连送3件，另一订单F2件','E数量显示3'],
 ['admin-consumption-order.html','状态：已支付','消费订单支付状态','订单E礼物赠送成功，其来源充值订单后来退款','E状态仍为已支付'],
 [consumption,'商品 / 数量 / 单价：','消费详情商品名称快照','E原商品名QA玫瑰，现改名QA新礼物','商品名称仍显示QA玫瑰'],
 [consumption,'消费去向：','消费详情公会快照','E发生时主播属于G001，后来转入G002','消费去向公会仍为G001'],
 [refund,'状态 / 时间：','退款完成时点','退款9月16日申请，9月17日11:00完成','退款时间对应9月17日11:00'],
 [refund,'类型：手动退款或被动退款','人工退款记录类型','管理员从充值订单详情完成主动退款','类型显示手动退款'],
 ['admin-host-account-balance.html','账户余额：','主播财务余额综合公式','H001累计上传100USD、正向修正20USD、负向修正30USD','H001账户余额显示90USD'],
 ])a(page,[ref],`财务核对${point}`,point,[fixture],[enter(page)],result,P1);
for(const [name,before,after]of [['足额',2000,900],['不足',100,-1000]])a(recharge,['退款后余额 ='],`退款${name}余额扣回全部到账`,`退款${name}余额计算`,[`用户U001原金币余额${before}；本次可退款订单基础1000、赠送100金币；环境准备：支付沙箱支持原渠道成功退款`],[enter(recharge),'点击|手动退款','填写|原因|为QA余额核对','点击|确认',enter('admin-user-detail.html'),'查看|U001金币余额'],`金币余额显示${after}`,{...P1,observe:'admin-user-detail.html',extra:[['admin-user-detail.html','金币余额：']]});
a(recharge,['生成退款单'],'主动退款成功生成关联退款记录','退款交易记录生成',['订单C实付8USD、基础100金币、赠送20金币，可退款；环境准备：原支付渠道沙箱返回成功'],[enter(recharge),'点击|手动退款','填写|原因|为QA退款','点击|确认',enter(refund),'查询|原订单C'],'存在关联原订单C的已完成退款记录',{...P1,observe:refund,extra:[[refund,'原充值订单：']]});
a('admin-consumption-order.html',['导出 -> 当前结果'],'导出消费订单保留当前筛选','消费订单导出范围',['当前筛选只有E001、E002，其他订单不符合'],[enter('admin-consumption-order.html'),'点击|导出'],'导出仅包含E001、E002',P1);
a(refund,['导出 -> 当前结果'],'导出退款记录保留当前筛选','退款记录导出范围',['当前筛选只有R001、R002'],[enter(refund),'点击|导出'],'导出仅包含R001、R002',P1);
a('admin-settlement-record.html',['上传失败，存在 N 个主播ID无法查询'],'导入失败汇总未知主播数量','导入失败对象数',['当前模板文件第2行H001有效，第3行ID77219998不存在，第8行ID77219999不存在；无其他异常'],[enter('admin-settlement-record.html'),'点击|上传','填写|分成备注|为QA双错误','上传|文件|选择qa-two-errors.xlsx','点击|确认上传'],'提示“上传失败，存在2个主播ID无法查询”',P1);
a('admin-settlement-record.html',['清空文件和错误结果'],'重新上传清空上次错误数据','导入重试错误清除',['上传弹窗当前有无效ID错误数据'],['点击|重新上传'],'上次错误数据不再显示',P2);
a('admin-settlement-record.html',['增加对应主播账户余额'],'有效主播分成导入只增加对应余额','主播分成成功入账',['H001原余额20USD，文件仅包含H001分成10USD；其他账号不在该文件'],[enter('admin-settlement-record.html'),'点击|上传','填写|分成备注|为QA入账','上传|文件|选择当前模板的H001有效文件','点击|确认上传',enter('admin-host-account-balance.html'),'查询|主播H001'],'H001账户余额显示30USD',{...P1,observe:'admin-host-account-balance.html',extra:[['admin-host-account-balance.html','账户余额：']]});
for(const [detail,label,identity]of [['admin-settlement-record-detail.html','主播','H001'],['admin-guild-settlement-record-detail.html','公会','G001']]){
 for(const [point,fixture,result]of [['备注','批次B001导入备注QA九月','分成备注显示QA九月'],['记录ID','当前所选批次B001，另有B002','记录ID显示B001'],['上传人','批次由qa-finance导入','上传人显示qa-finance'],['上传时间','批次于9月17日11:00确认导入','上传时间对应9月17日11:00']])a(detail,['批次信息：'],`${label}分成详情保留${point}快照`,`${label}批次${point}`,[fixture],[enter(detail)],result,P2);
 a(detail,[label==='主播'?'主播明细：':'公会明细：'],`${label}分成详情核对单行金额`,`${label}明细金额`,[`批次B001中${identity}金额10USD，其他对象20USD`],[enter(detail)],`${identity}分成金额显示10USD`,P1);
}
a('admin-guild-settlement-record-detail.html',['公会数量：'],'公会分成详情按对象去重计数','公会明细去重数量',['有效批次中只有G001、G002两个公会'],[enter('admin-guild-settlement-record-detail.html')],'公会数量显示2',P1);
for(const [balance,change,entity,id]of [['admin-host-account-balance.html','admin-host-balance-change-record.html','主播','H001'],['admin-guild-account-balance.html','admin-guild-balance-change-record.html','公会','G001']]){
 a(balance,['点击'],`${entity}余额下钻保留目标对象`,`${entity}余额流水对象`,[`当前结果有${id}及其他对象`],[enter(balance),`点击|${id}余额`],`流水只展示${id}的账户变更`,{...P1,observe:change,extra:[[change,'单个']]});
 for(const [type,fixture]of [['收益分成','刚完成一笔财务分成结果上传'],['分成修正','刚完成一笔人工余额修正']])a(change,['变更类型：'],`${entity}流水区分${type}`,`${entity}${type}流水类型`,[`${id}${fixture}`],[enter(change)],`该流水类型显示${type}`,P1);
 a(change,['操作信息：'],`${entity}修正流水记录操作人`,`${entity}修正审计执行者`,[`qa-finance于9月17日11:00将${id}余额修正增加10USD`],[enter(change)],'本次操作人显示qa-finance',P1);
 a(change,['操作信息：'],`${entity}修正流水记录操作时间`,`${entity}修正审计时间`,[`qa-finance于9月17日11:00将${id}余额修正增加10USD`],[enter(change)],'本次操作时间对应9月17日11:00',P1);
}
a(recharge,['总到账金币：'],'充值到账包含赠送金币','后台充值总到账',['原订单基础1000金币、赠送100金币'],[enter(recharge)],'总到账金币 = 1100',{...P1,calc:calculation('充值金币+赠送金币',{充值金币:1000,赠送金币:100},{运算:'+',参数:[{变量:'充值金币'},{变量:'赠送金币'}]},1100)});
a(recharge,['等于原实付金额'],'充值退款按实付金额全退','后台退款金额口径',['订单标价10USD，实付8USD，支付成功且未退款'],[enter(recharge),'点击|手动退款','填写|原因|为测试退款','点击|确认'],'退款金额显示8USD',{...P0,transition:'ST-recharge-refund'});
a(recharge,['不支持部分或重复退款'],'已退款订单不能重复退款','充值退款幂等',['订单已经完成全额退款'],[enter(recharge)],'不允许再次执行手动退款',P1);
a(recharge,['仅整单全额退款'],'充值不提供部分金额退款','充值全额退款限制',['订单支付成功未退款'],[enter(recharge),'点击|手动退款'],'退款金额固定为原实付金额',P1);
a(recharge,['填写原因并确认'],'充值手动退款原因必填','充值退款原因校验',['订单可退款'],[enter(recharge),'点击|手动退款','清空|原因','点击|确认'],'不能提交缺少原因的退款',P1);
a(recharge,['扣回金币：'],'退款扣回基础及赠送金币','充值退款扣回范围',['原订单基础1000金币、赠送100金币，退款已完成'],[enter(recharge)],'扣回金币 = 1100',{...P1,calc:calculation('基础金币+赠送金币',{基础金币:1000,赠送金币:100},{运算:'+',参数:[{变量:'基础金币'},{变量:'赠送金币'}]},1100)});
a('admin-recharge-order.html',['导出 -> 当前结果'],'导出充值订单保留筛选','充值订单导出范围',['当前筛选仅订单A和B'],[enter('admin-recharge-order.html'),'点击|导出'],'导出仅包含订单A和B',P2);
a(consumption,['取消费发生时商品快照'],'修改礼物价格不改历史消费单价','消费订单商品快照',['订单成交单价10金币，配置后来改为20'],[enter(consumption)],'订单商品单价仍为10金币',P1);
a(consumption,['扣减金币：单价 × 数量'],'消费扣减按历史单价和数量','消费订单扣减公式',['订单快照单价10金币、数量20'],[enter(consumption)],'扣减金币 = 200',{...P1,calc:calculation('单价×数量',{单价:10,数量:20},{运算:'*',参数:[{变量:'单价'},{变量:'数量'}]},200)});
a(consumption,['用户净消耗：扣减金币 - 返奖金币'],'幸运返奖超过扣减时净消耗为负','幸运订单净消耗',['订单扣减100金币、实际返奖1000金币'],[enter(consumption)],'用户净消耗 = -900',{...P1,calc:calculation('扣减金币-返奖金币',{扣减金币:100,返奖金币:1000},{运算:'-',参数:[{变量:'扣减金币'},{变量:'返奖金币'}]},-900)});
a(consumption,['默认 1%，返奖不影响'],'幸运收益不按用户净消费计提','后台幸运主播收益',['订单礼物价值1000金币，快照收益比例1%，返奖2000金币'],[enter(consumption)],'主播收益 = 10',{...P1,calc:calculation('礼物价值×收益比例',{礼物价值:1000,收益比例:0.01},{运算:'*',参数:[{变量:'礼物价值'},{变量:'收益比例'}]},10)});
for(const type of ['普通礼物','定制礼物','门票'])a(consumption,['普通、定制、门票 = 扣减金币'],`${type}收益按实际扣减入账`,`${type}后台收益口径`,[`${type}订单实际扣减100金币`],[enter(consumption)],'主播收益显示100金币',P1);
a(consumption,['不可退款'],'消费订单详情无退款操作','消费退款入口限制',['已支付消费订单'],[enter(consumption)],'不提供退款操作',P1);
a(refund,['被动退款指支付渠道发起'],'渠道退款正确标记被动类型','后台被动退款类型',['渠道已成功退回一笔充值订单'],[enter(refund)],'该记录类型为被动退款',P1);
a(refund,['进入原充值订单详情'],'退款订单关联原充值订单','退款订单关联跳转',['退款R关联充值C'],[enter(refund),'点击|退款R查看'],'打开充值C详情',P2);
const upload='admin-settlement-record.html';
for(const format of ['XLSX','XLS','CSV'])a(upload,['XLSX、XLS 或 CSV','不经过数据预览'],`主播分成导入${format}有效模板`,'主播分成支持文件格式',[`准备符合当前模板的${format}文件，仅主播H存在于主播账户余额中，金额10USD`],[enter(upload),'点击|上传','填写|分成备注|为QA分成',`上传|文件|选择qa.${format.toLowerCase()}`,'点击|确认上传'],'确认后直接生成一条锁定的分成记录',{...P0,transition:'ST-host-share-upload'});
a(upload,['全部通过才可上传'],'主播导入混合有效无效ID整批拒绝','主播分成整批校验',['文件第2行主播H有效，第8行主播ID77219999不存在于主播账户余额'],[enter(upload),'点击|上传','填写|分成备注|为QA失败批次','上传|文件|选择混合测试文件','点击|确认上传'],'本批次不生成分成记录',P1);
a(upload,['也不增加主播账户余额'],'失败主播分成批次不部分入账','分成失败原子性',['混合文件含有效H金额10USD及不存在ID，H原余额20USD'],[enter(upload),'点击|上传','填写|分成备注|为QA失败批次','上传|文件|选择混合测试文件','点击|确认上传',enter('admin-host-account-balance.html')],'H账户余额仍为20USD',{...P1,observe:'admin-host-account-balance.html',extra:[['admin-host-account-balance.html','账户余额：']]});
a(upload,['第8行，未查询到主播ID77219999'],'主播分成错误明确行号与ID','分成导入错误定位',['文件仅第8行ID77219999不存在'],[enter(upload),'点击|上传','填写|分成备注|为QA错误数据','上传|文件|选择测试文件','点击|确认上传'],'错误数据包含“第8行，未查询到主播ID77219999”',P1);
a(upload,['可复制的纯文本错误数据'],'失败主播分成错误数据可复制','分成导入错误文本复制',['上传弹窗已显示失败行号和ID'],['复制|错误数据文本','查看|系统剪贴板'],'复制内容包含失败行号和主播ID',P2);
a(upload,['保留分成备注，清空文件和错误结果'],'失败主播分成重新上传保留备注','分成导入重试备注',['弹窗失败，分成备注QA原备注'],['点击|重新上传'],'分成备注仍为QA原备注',P2);
a(upload,['清空文件和错误结果'],'重新上传清空失败文件','分成导入重试文件清空',['弹窗当前存在失败文件'],['点击|重新上传'],'文件选择为空',P2);
for(const [page,entity,detail,balance,change]of [[upload,'主播','admin-settlement-record-detail.html','admin-host-account-balance.html','admin-host-balance-change-record.html'],['admin-guild-settlement-record.html','公会','admin-guild-settlement-record-detail.html','admin-guild-account-balance.html','admin-guild-balance-change-record.html']]){
 a(page,['分成备注：必填'],`${entity}分成上传备注必填`,`${entity}分成备注校验`,['当前上传弹窗已打开且有效文件已选'],['清空|分成备注','点击|确认上传'],'不能上传缺少分成备注的结果',P1);
 a(page,['最长 100 字'],`${entity}分成备注101字不允许`,`${entity}分成备注上限`,['当前上传弹窗已打开且有效文件已选'],['填写|分成备注|为101个A','点击|确认上传'],'不能保存超过100字的分成备注',P1);
 a(detail,['只读'],`${entity}已导入分成详情不可修改`,`${entity}分成批次只读`,['该批次导入成功'],[enter(detail)],'不提供编辑或删除批次操作',P1);
 a(detail,['分成总金额：'],`${entity}分成批次总额等于明细和`,`${entity}分成总额核对`,['有效批次明细甲10USD、乙20USD'],[enter(detail)],'分成总金额 = 30',{...P1,calc:calculation('甲金额+乙金额',{甲金额:10,乙金额:20},{运算:'+',参数:[{变量:'甲金额'},{变量:'乙金额'}]},30,'USD')});
 a(balance,['当前筛选结果'],`${entity}余额汇总只算筛选范围`,`${entity}余额筛选汇总`,['筛选命中甲10USD和乙20USD，丙100USD不在结果'],[enter(balance),'点击|查询'],'汇总余额 = 30',{...P1,calc:calculation('甲余额+乙余额',{甲余额:10,乙余额:20},{运算:'+',参数:[{变量:'甲余额'},{变量:'乙余额'}]},30,'USD')});
 for(const value of [0,1.001])a(change,['不得为 0，最多两位小数'],`${entity}余额修正金额${value}不合法`,`${entity}修正金额校验`,['当前对象有可修正余额'],[enter(change),'点击|余额变更','填写|备注|为QA修正',`填写|变更金额|为${String(value).replace('.',',')}`,'点击|确认'],'不能保存该修正金额',P1);
 a(change,['备注：分成修正必填'],`${entity}余额修正备注必填`,`${entity}余额修正原因`,['当前对象有可修正余额'],[enter(change),'点击|余额变更','填写|变更金额|为10','清空|备注','点击|确认'],'不能保存无备注的修正',P1);
 for(const delta of [10,-5])a(change,['变更前余额 + 有符号变更金额'],`${entity}余额修正${delta}美元`,`${entity}有符号余额变更`,['原余额20USD'],[enter(change),'点击|余额变更',`填写|变更金额|为${delta}`,'填写|备注|为QA核对','点击|确认'],`变更后余额 = ${20+delta}`,{...P1,calc:calculation('原余额+变更金额',{原余额:20,变更金额:delta},{运算:'+',参数:[{变量:'原余额'},{变量:'变更金额'}]},20+delta,'USD')});
}
const ops='admin-operation-accounts.html',op='admin-operation-account-detail.html',quota='admin-operation-guild-controls.html';
a(ops,['平台不创建、不分配运营账号，也不发放虚拟金币'],'平台运营账号列表不越权创建发币','平台运营账号操作边界',[],[enter(ops)],'不提供创建、分配或发放虚拟金币操作',P1);
a(op,['Σ 发放金币 - Σ 成功消费金币'],'平台运营账号余额只核虚拟币','平台运营虚拟余额',['累计发放1000、成功消费300虚拟金币，失败消费100'],[enter(op)],'虚拟金币余额 = 700',{...P1,calc:calculation('发放金币-成功消费',{发放金币:1000,成功消费:300},{运算:'-',参数:[{变量:'发放金币'},{变量:'成功消费'}]},700)});
a(op,['平台启停或锁定'],'平台停用运营账号','平台运营账号停用',['运营账号启用'],[enter(op),'点击|停用','点击|确认'],'运营账号状态变为停用',{...P1,transition:'ST-ops-disable'});
a(op,['平台启停或锁定'],'平台锁定运营账号公会管理权限','运营账号平台锁定',['账号未锁定'],[enter(op),'点击|锁定公会管理权限','点击|确认'],'公会管理权限为锁定',{...P1,transition:'ST-ops-lock'});
a('admin-operation-issue-records.html',['实际执行发放的公会账号'],'虚拟金币发放记录指向公会操作人','虚拟金币发放执行者',['公会账号chiefA成功发放100金币'],[enter('admin-operation-issue-records.html')],'该记录操作人为chiefA',P1);
for(const [object,original]of [['礼物','A'],['主播','甲']])a('admin-operation-gift-records.html',['赠送时普通或定制礼物及接收主播快照'],`运营赠礼保留${object}快照`,`运营赠礼${object}历史快照`,['赠送时礼物A主播甲，之后名称分别改B和乙'],[enter('admin-operation-gift-records.html'),'点击|该记录详情'],`详情${object}名称仍为${original}`,P1);
for(const [account,total,reason]of [[500,999,'公会低于已发放'],[499,2000,'账号低于最高已发放'],[2001,2000,'账号高于公会额度']])a(quota,['公会总上限不得低于本月已发放'],`额度配置${reason}不能保存`,'虚拟金币额度上下限',['本月公会已发放1000，单账号最高已发500金币'],[enter(quota),'点击|配置额度',`填写|单账号月度额度|为${account}`,`填写|公会月度额度|为${total}`,'点击|保存'],'不能保存越界额度',P1);
a(quota,['不得低于本月已发放'],'额度等于已发放边界允许保存','虚拟币额度等值边界',['公会已发1000，单账号最高500'],[enter(quota),'点击|配置额度','填写|公会月度额度|为1000','填写|单账号月度额度|为500','点击|保存'],'公会月度额度显示1000金币',P1);
const superTest=(page,refs,title,point,pre,steps,result,o)=>test(page,refs,'超级管理员',title,point,pre,steps,result,o);
const accounts='admin-system-account.html',account='admin-system-account-detail.html',roles='admin-system-role.html',role='admin-system-role-detail.html';
superTest(accounts,['内置超级管理员账号不可停用'],'内置超级管理员账号不能停用','内置后台账号保护',['当前记录为内置超级管理员'],[enter(accounts)],'不允许停用内置账号',P1);
superTest(account,['账号、角色和状态不可修改'],'内置管理员核心配置不可修改','内置管理员字段保护',['当前为内置超级管理员账号'],[enter(account)],'账号、角色和状态均不可编辑',P1);
for(const field of ['后台账号','姓名','所属角色','初始密码'])superTest(account,[field==='所属角色'?'必选启用角色':field==='初始密码'?'新建必填':'均必填'],`新后台账号${field}必填`,`后台账号${field}校验`,['新建模式，其他字段有效'],[enter(account),`清空|${field}`,'点击|保存'],'不能创建缺少必填项的后台账号',P1);
superTest(account,['登录账号全局唯一'],'后台登录账号不能重复','后台账号唯一性',['已存在账号qa-admin，其他字段有效'],[enter(account),'填写|后台账号|为qa-admin','点击|保存'],'不能保存重复登录账号',P1);
superTest(account,['必选启用角色'],'后台账号不能选择停用角色','后台账号角色有效性',['角色R已停用'],[enter(account),'点击|所属角色'],'角色R不可选',P1);
superTest(account,['两次一致'],'后台账号重置密码两次不一致','后台重置密码确认',['准备满足实际密码策略的两个不同密码A和B'],[enter(account),'点击|重置密码','填写|新密码|为A','填写|确认密码|为B','点击|保存'],'不能保存不一致的新密码',P1);
superTest(roles,['当前绑定该角色的后台账号数'],'后台角色人数只统计当前绑定','后台角色关联账号数',['角色R当前绑定甲乙，丙已改绑其他角色'],[enter(roles)],'角色R关联账号显示2',P2);
superTest(roles,['不可修改或停用'],'内置超级管理员角色不可停用','内置角色保护',[],[enter(roles)],'不允许停用内置超级管理员角色',P1);
superTest(role,['必填且全局唯一'],'后台角色名称不能为空','后台角色名称必填',['新建角色且权限已选择'],[enter(role),'清空|角色名称','点击|保存'],'不能保存空角色名称',P1);
superTest(role,['全局唯一'],'后台角色名称不能重复','后台角色名称唯一性',['已有角色R'],[enter(role),'填写|角色名称|为R','点击|保存'],'不能保存重复角色名称',P1);
superTest(role,['勾选父级联动全部子级'],'勾选菜单父级选中所有子级','角色权限父子选择',['某父菜单有3个子权限，初始均未选'],[enter(role),'勾选|该父菜单'],'其3个子权限全部选中',P1);
superTest(role,['取消全部子级同步取消父级'],'取消全部子权限同步取消父级','角色权限父子取消',['父级与3个子权限全部选中'],[enter(role),'取消|子权限1','取消|子权限2','取消|子权限3'],'该父菜单不再选中',P1);
superTest(role,['已选择数 = 勾选叶子权限数'],'角色已选权限仅计算叶子节点','角色权限数量口径',['选中父级含3个叶子，无其他选择'],[enter(role)],'已选择数显示3',P1);
