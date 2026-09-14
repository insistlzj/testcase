import {scenario as s,observe as o,navigation as nav,textBoundary,required} from './design.mjs';
import {flows} from './lifecycles.mjs';
const f=k=>({flow:flows[k].flow,transition:flows[k].id});
textBoundary('G-guild-message-compose-002','消息内容',500,{required:true,trim:true,button:'发送'});
for(const count of [0,1,2])s('G-guild-message-compose-003',`运营消息图片${count}张`,['接收人与文本合法'],[`尝试添加${count}张图片`],count<=1?`可保留${count}张图片`:'最多仅允许1张图片');
for(const type of ['JPG','PNG','WebP'])s('G-guild-message-compose-003',`运营消息${type}图片`,[],[`添加可读取的${type}图片`],'图片添加成功');
for(const target of ['全体主播','指定主播'])s('G-guild-message-compose-005',`发送至${target}`,['消息文本已填，当前公会主播均有效',...(target==='指定主播'?['已选一名当前公会主播']:[])],[`选择${target}`,'点击发送','确认接收范围'],'生成发送记录并返回列表');
s('G-guild-message-compose-005','运营消息取消发送确认',['文本和接收范围已填'],['点击发送','取消确认'],'不生成发送记录');
s('G-guild-host-select-003','指定主播未选不能完成',['未选择主播'],['点击完成'],'提示选择主播');
o('G-guild-host-select-002','指定主播仅单选本公会',['其他公会有主播，当前公会有两名主播'],'只可选择一名当前公会主播');
o('G-guild-message-detail-005','消息接收人退会保留快照',['消息发送时接收人仍在会，后来已退会'],'历史发送对象、人数和内容不变，详情只读');
textBoundary('G-guild-operation-account-compose-002','名称',30,{required:true,button:'确认创建'});
textBoundary('G-guild-operation-account-compose-003','账号',30,{required:true,button:'确认创建'});
for(const n of [5,6,7])s('G-guild-operation-account-compose-004',`运营账号初始密码${n}位`,['其他字段合法'],[`输入${n}位初始密码`,'确认创建'],n<6?'不能创建账号':'账号创建成功');
s('G-guild-operation-account-compose-003','运营登录账号全局重复',['另一公会已创建相同登录账号'],['填写该重复账号及其他必填项','确认创建'],'不能创建重复账号');
for(const [a,g] of [[100,200],[200,100],[100,100]])o('G-guild-operation-account-compose-007',`发放上限账号${a}公会${g}`,[`单账号月剩余${a}，公会月剩余${g}`],`本次可发上限为${Math.min(a,g)}`);
for(const value of [-1,0,99,100,101])s('G-guild-operation-account-compose-005',`初始发放${value}`,['本次可发上限100，其他创建字段合法'],[`填写发放金币${value}`,'确认创建'],value>=0&&value<=100?`账号创建并发放${value}虚拟金币`:'金额越界，不能创建');
o('G-guild-operation-account-compose-005','创建默认发放0',[],'发放金币初始值为0');
o('G-guild-operation-account-compose-006','运营账号默认启用',[],'账号状态默认启用');
for(const value of [99,100,101])s('G-guild-operation-account-detail-007',`后续发放${value}边界`,['公会可管理，账号启用，账号剩余100、公会剩余200'],[`发放${value}虚拟金币`,'确认'],value<=100?`本月发放累计增加${value}`:'超过本次额度，不能发放',f('virtualIssue'));
o('G-guild-operation-account-detail-006','平台锁定不能启停或发币',['平台已锁定当前运营账号的公会管理权限'],'详情仅可查看，启停与发放不可用');
for(const action of ['禁用','启用'])s('G-guild-operation-account-detail-005',`运营账号${action}`,['账号当前状态与待操作相反，虚拟余额100，历史记录存在'],[`选择${action}`,'确认'],`${action==='禁用'?'禁止登录和送礼':'恢复账号使用'}，余额100与历史记录保留`,f(action==='禁用'?'virtualDisable':'virtualEnable'));
o('G-guild-operation-account-detail-003','运营余额发放减消费',['累计成功发放100，成功消费30，失败赠礼20'],'账户余额 = 100 - 30 = 70虚拟金币',{type:'逻辑校验'});
o('G-guild-operation-accounts-001','公会虚拟资产汇总',['本月两账号成功发放100与200，余额70与50，公会月限额500'],'本月已发300、剩余200、余额累计120',{type:'逻辑校验'});
o('G-guild-operation-gift-records-002','运营赠礼数量和金额',['筛选范围两笔成功记录：单价10数量2、单价20数量3，另有失败记录'],'总送礼次数2，总消费金币 = 10 × 2 + 20 × 3 = 80',{type:'逻辑校验'});
s('G-guild-operation-account-select-002','运营账号全选不受搜索限制',['公会共5个运营账号，搜索仅命中1个'],['点击全选'],'全部5个运营账号选中');
s('G-guild-operation-account-select-003','运营账号选择保留日期',['送礼记录当前日期为昨日'],['选择2个账号','完成'],'返回送礼记录并回填2个账号，日期仍为昨日');
s('G-guild-operation-account-select-003','运营账号取消全选',['当前全部运营账号选中'],['点击取消全选'],'选择清空');
o('A-admin-operation-account-detail-008','平台不能编辑运营资料重置密码',['当前为平台管理员'],'页面不允许执行编辑资料或重置密码');
for(const state of ['启用','停用','锁定'])s('A-admin-operation-account-detail-009',`平台运营账号${state}`,['目标账号存在且允许该状态变更'],[`选择${state}`,'确认'],'目标状态更新并记录操作人和时间');
for(const [field,limit,values] of [['公会总上限',100,[99,100,101]],['单账号上限',50,[49,50,51,100,101]]])for(const value of values)s('A-admin-operation-guild-controls-010',`${field}${value}限制`,['公会本月已发100，单账号最高已发50，公会配置总上限100'],[`设置${field}为${value}`,'保存'],field==='公会总上限'?value>=100?'上限可保存':'低于本月已发，不能保存':value>=50&&value<=100?'上限可保存':'不满足单账号下限或公会上限，不能保存');
o('A-admin-operation-guild-controls-008','公会剩余额度下限0',['公会额度100，本月累计已发100'],'本月剩余额度为0');
o('A-admin-operation-issue-records-004','虚拟发放后余额',['发放前余额50，本次成功发放20'],'发放后余额 = 50 + 20 = 70',{type:'逻辑校验'});
o('A-admin-operation-gift-records-007','虚拟赠礼不进真实收益',['运营账号成功赠礼100虚拟金币'],'记录仅计氛围和榜单，不增加真实消费、主播收益或公会分成');

for(const p of ['A-admin-system-account-detail','A-admin-system-role-detail']){
 const role=p.includes('role');
 required(`${p}-003`,role?['角色名称']:['后台账号','姓名'],'保存');
 s(`${p}-003`,`${role?'角色名称':'后台登录名'}重复`,['另一记录已使用“tester”'],[`填写${role?'角色名称':'后台账号'}tester`,'保存'],'唯一性校验失败，不能保存');
 o(`${p}-002`,`${role?'角色':'后台账号'}ID编辑只读`,['当前编辑已存在记录'],'ID不可编辑');
}
o('A-admin-system-account-007','内置超级管理员不能停用',['目标是内置超级管理员账号'],'账号状态不允许停用');
o('A-admin-system-account-detail-008','内置超级管理员关键字段只读',['目标是内置超级管理员账号'],'账号、角色和状态不可修改');
o('A-admin-system-role-006','内置超级管理员角色保护',['目标为内置超级管理员角色'],'拥有全部权限且不可修改或停用');
s('A-admin-system-role-005','停用角色回收权限',['目标非内置角色有一个绑定账号'],['停用角色','确认影响范围'],'绑定账号立即失去该角色权限');
s('A-admin-system-role-detail-006','勾选父级联动子级',['父级下有3个未选叶子权限'],['勾选父级'],'3个子级全部选中');
s('A-admin-system-role-detail-006','取消所有子级联动父级',['父级及3个子级已选'],['逐一取消全部子级'],'父级同步取消选择');
o('A-admin-system-role-detail-005','权限已选计叶子数',['已勾选1个父级及其3个叶子权限'],'已选择数为3');
for(const action of ['全选','全不选'])s('A-admin-system-role-detail-008',`权限树${action}`,['当前编辑非内置角色'],[`点击${action}`],action==='全选'?'所有叶子权限选中':'全部权限取消选择');
required('A-admin-system-account-detail-005',['初始密码'],'保存');
s('A-admin-system-account-detail-006','后台两次密码不同',['新密码符合已有密码策略'],['确认密码填不同值','保存'],'不能替换旧密码');
s('A-admin-system-account-008','停用后台账号',['目标为启用非内置账号'],['停用账号','填写原因并确认'],'目标账号立即禁止登录并保留操作记录');

for(const value of [-1,0,1,1.5])s('A-admin-user-list-004',`财富筛选下限${value}`,['上限设为10'],[`输入财富等级下限${value}`,'查询'],Number.isInteger(value)&&value>=0?'等级筛选生效':'非负整数校验失败');
s('A-admin-user-list-004','财富上限小于下限',['下限5'],['上限填4','查询'],'拒绝该等级范围');
for(const action of ['封禁','解封'])s('A-admin-user-list-012',`后台账号${action}`,['目标账号状态满足该操作'],[`选择${action}`,'填写原因并确认'],`目标账号${action==='封禁'?'变为封禁':'变为正常'}并记录操作人时间`,f(action==='封禁'?'ban':'unban'));
o('A-admin-user-list-010','封禁立即踢下线关播',['目标账号正在直播并已有登录会话，平台已封禁'],'目标会话立即下线且本场结束',f('ban'));
for(const action of ['警告','关播'])s('A-admin-live-detail-009',`场次${action}`,['目标场次直播中'],[`选择${action}`,'填写原因并确认'],action==='警告'?'发送警告，直播继续':'本场立即结束并通知主播');
o('A-admin-live-detail-009','结束场次无即时处置',['当前场次已结束'],'不提供警告或关播操作');
o('A-admin-live-management-009','历史场次不能重开',['当前场次已结束'],'不能将该历史场次重新开启');
for(const offset of [-1,0,1])s('A-admin-inspection-schedule-create-002',`排班日期${offset<0?'昨日':offset===0?'今日':'明日'}`,['时段和人员合法'],[`选择${offset<0?'昨日':offset===0?'今日':'明日'}`,'保存'],offset<0?'日期不允许保存':'排班日期校验通过');
for(const delta of [-1,0,1])s('A-admin-inspection-schedule-create-003',`排班结束相对开始${delta}`,['开始10:00，日期和人员有效'],[`结束选择${delta<0?'09:59':delta===0?'10:00':'10:01'}`,'保存'],delta>0?'时段可保存':'结束必须晚于开始，不能保存');
for(const issue of ['无人','重复人员','封禁账号'])s('A-admin-inspection-schedule-create-004',`排班人员${issue}`,['日期时段合法'],[`配置人员为${issue}`,'保存'],'不能创建该人员名单的排班');
s('A-admin-inspection-schedule-create-006','巡房人员全选当前结果',['存在5个可用账号，搜索命中2个'],['点击全选'],'只选中当前搜索命中的2个账号');
o('A-admin-inspection-schedule-detail-004','巡房账号后续封禁保留名单',['账号已在历史排班中，后来被平台封禁'],'历史名单保留该账号，但不能再巡房');
for(const action of ['忽略','转人工复审'])s('A-admin-content-audit-007',`机审告警${action}`,['告警待处理，直播和账号均未处置'],[`选择${action}`,'填写原因后提交'],action==='忽略'?'告警变为已忽略，直播与账号不变':'告警变为人工复审中');
required('A-admin-content-audit-detail-005',['处置原因'],'提交');
for(const state of ['已忽略','已处置'])o('A-admin-content-audit-detail-006',`内容审核${state}终态`,[`当前告警${state}`],'不能再次处理');
o('A-admin-content-audit-003','机审命中不直接处罚',['新产生高风险机审告警但未人工处置'],'账号和直播状态不因告警自动处罚');
for(const [type,actions] of [['账号',['不处置','封禁']],['直播',['不处置','警告','关播','关闭直播权限']]])for(const action of actions)s(['A-admin-report-detail-004','A-admin-report-detail-009'],`${type}举报${action}`,['当前工单待处理',`工单类型${type}且关联场次仍在播`],[`选择${action}`,action==='不处置'?'确认处理':'填写原因并确认'],'工单更新已处理并按所选动作执行',{priority:action==='封禁'?'P0':'P1',...f('reportHandled')});
for(const state of ['已处理','已作废'])o('A-admin-report-handling-008',`直播举报${state}只读`,[`工单${state}`],'不提供再次处置');
o('A-admin-report-handling-007','直播结束待处理工单作废',['举报工单待处理，其直播场次已结束'],'工单自动变为已作废',f('reportExpire'));
o('A-admin-report-detail-008','关播后其他待处理举报失效',['同场有两个待处理工单，其中一个已经关播处理'],'其余待处理工单显示已作废');
for(const [p,id] of [['A-admin-violation-type-detail','003'],['A-admin-live-type','003']])for(const lang of ['中文','英语','印尼语','马来语']){
 required(`${p}-${id}`,[`${lang}名称`],'保存');
 s(`${p}-${id}`,`${lang}类型名称重复`,[`已存在该语言名称“示例”`],[`将${lang}名称填写“示例”`,'保存'],'同语言重复名称不能保存');
}
o('A-admin-violation-types-005','预置违规类型不可删除',['目标为系统预置类型'],'无删除该类型能力');
o('A-admin-violation-type-detail-005','类型属性创建后不能切换',['当前类型已创建为自定义'],'不能修改为系统预置');
o('A-admin-violation-types-007','停用违规类型保留历史名称',['历史举报类型为“旧名”，该类型已停用或删除'],'历史工单仍显示提交时“旧名”，新举报不提供该类型');
o('A-admin-live-type-005','停用直播类型不改进行历史场次',['目标分类已被进行中及历史场次引用，平台已停用'],'原场次类型快照保留，不能用于新开播');
required('A-admin-sensitive-words-detail-003',['敏感词','分类'],'保存');required('A-admin-sensitive-words-detail-006',['替换内容'],'保存');
s('A-admin-sensitive-words-detail-005','敏感词无使用场景',['其他字段合法'],['取消全部使用场景','保存'],'至少一个场景校验失败');
s('A-admin-sensitive-words-detail-003','同匹配规则重复词',['已有包含匹配词“广告”'],['新增同为包含匹配的“广告”','保存'],'重复词不能保存');
for(const mode of ['包含匹配','精确匹配'])s('A-admin-sensitive-words-detail-004',`敏感词配置${mode}`,['词条、场景及替换内容合法'],[`选择${mode}`,'保存'],`规则保存为${mode}`);

for(const owner of ['host','guild']){
 const p=`A-admin-${owner}-balance-change-record`,who=owner==='host'?'主播':'公会';
 for(const value of [-101,-100,-99,0,0.01,1.001,100])s(`${p}-003`,`${who}余额修正${value}`,['当前结算账户余额100，原因已填'],[`输入有符号金额${value}`,'确认变更'],value!==0&&value>=-100&&Number.isInteger(Math.round(value*100000)/1000)?`新余额 = 100 + (${value}) = ${Math.round((100+value)*100)/100}`:'不能生成该金额修正流水',{type:'逻辑校验'});
 required(`${p}-005`,['备注'],'确认');
 o(`${p}-008`,`${who}修正流水不可修改`,['已经完成一笔修正'],'该修正流水只读');
 o(`A-admin-${owner}-account-balance-002`,`${who}结算余额计算`,['已上传分成100，正向修正20，负向修正30'],'账户余额 = 100 + 20 - 30 = 90 USD',{type:'逻辑校验'});
 o(`A-admin-${owner}-account-balance-003`,`${who}筛选余额汇总`,['当前筛选仅命中余额100和50的两个账户，范围外另有余额200'],'汇总余额 = 100 + 50 = 150 USD',{type:'逻辑校验'});
}
textBoundary('A-admin-host-balance-change-record-005','备注',100,{required:true,button:'确认'});
for(const p of ['A-admin-settlement-record','A-admin-guild-settlement-record']){
 textBoundary(`${p}-002`,'分成备注',100,{required:true,button:'确认导入'});
 o(`${p}-${p.includes('guild')?'007':'008'}`,'已导入分成锁定',['当前批次已成功导入'],'批次不可编辑或删除');
 s(`${p}-005`,'分成上传拒绝非表格',['已填写分成备注'],['选择一个PNG文件上传'],'不接受该非XLSX/XLS/CSV文件');
}
for(const p of ['A-admin-settlement-record-detail','A-admin-guild-settlement-record-detail'])o(`${p}-005`,'分成批次明细总额',['已成功导入两条不同对象明细，金额100和50'],'明细总额 = 100 + 50 = 150，与批次总额一致',{type:'逻辑校验'});
o('G-guild-share-income-003','公会分成只读当前公会',['两公会分别存在上传分成结果'],'仅显示当前公会结果，无日期筛选或在线分成计算');
o('G-guild-share-ledger-006','跨月分成按入账时间',['8月收益于9月2日入账，另一9月收益于10月2日入账'],'按分成时间倒序，10月2日记录在前');
for(const reason of ['未支付成功','已退款'])o('A-admin-recharge-order-detail-008',`${reason}订单不可退款`,[`当前订单${reason}`],'不能发起退款');
s('A-admin-recharge-order-detail-011','后台整单退款',['订单支付成功且未退款，实付10USD，原到账120，现余额20'],['选择手动退款','填写原因并确认'],'原渠道退10USD并生成退款单，扣回120金币，余额-100',{priority:'P0',...f('refund')});
o('A-admin-recharge-order-detail-005','充值不支持部分退款',['原订单实付10USD'],'只能全额退10USD，不可填写部分退款金额');
for(const item of ['礼物消费','门票消费','主播收益','分成结果'])o('A-admin-recharge-order-detail-010',`充值退款不撤销${item}`,['已完成充值退款，此前存在'+item],`原${item}保留，不被回滚`);
o('A-admin-consumption-order-detail-008','消费订单无退款能力',['当前已支付普通礼物订单'],'订单只读且不提供退款');
o('A-admin-consumption-order-detail-005','幸运用户净消耗',['订单扣减100，实际返奖30'],'净消耗 = 100 - 30 = 70金币',{type:'逻辑校验'});
o('A-admin-consumption-order-detail-006','幸运主播收益独立',['幸运礼物价值1000，比例1%，返奖900'],'主播收益 = 1000 × 1% = 10金币',{type:'逻辑校验'});
for(const type of ['手动退款','支付渠道退款'])o('A-admin-refund-order-004',`退款类型${type}`,[`原充值已完成${type}`],`退款记录标记为${type==='手动退款'?'手动退款':'被动退款'}`);
nav('A-admin-refund-order-009','查看退款','原充值订单详情');
