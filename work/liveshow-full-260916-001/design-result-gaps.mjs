import {test,P1,P2,enter,calculation,pages,units} from './case-design.mjs';
import {a} from './design-admin.mjs';
const g=(page,refs,title,point,pre,steps,result,o=P1)=>test(page,refs,'公会长',title,point,[`已登录目标公会的公会长账号，打开${pages.get(page).registeredName}页并完成下列数据和页面状态准备`,...pre],steps.map((s,i)=>i===0&&s===enter(page)?s.replace(/^进入\|/,'查看|'):s),result,o);
for(const [page,ref,point,pre,result,role='普通用户']of [
 ['guild-management.html','banner 图：','公会页Banner配置','平台当前配置Banner图片A','Banner展示图片A'],
 ['guild-management.html','数据范围：','公会推荐配置范围','已启用公会甲乙，平台仅配置甲在本页展示','公会列表只包含甲'],
 ['guild-management.html','示例数据的 5 条不代表数量上限','公会列表非固定样例容量','平台已配置6个有效公会，均可展示','列表包含全部6个公会'],
 ['guild-application-records.html','数据范围：','我的公会账号隔离','当前账号甲只申请过G001；乙账号申请过G002','列表不包含仅乙申请过的G002'],
 ['guild-application-records.html','历史记录不会因驳回或退出而移除','我的公会驳回历史保留','当前账号向G001的唯一申请已经被驳回','G001卡片仍保留'],
 ['guild-detail.html','公会头像 / 名称 / ID：','公会详情资料对象','从G001卡片进入；G001名称QA公会、头像A，与G002不同','详情展示QA公会G001及头像A'],
 ['guild-detail.html','提交时间：','申请时间轴提交时点','申请A9月14日10:00提交、15日11:00处理','A提交时间对应9月14日10:00'],
 ['guild-detail.html','处理时间：','已处理申请的处理时点','申请A9月14日提交、15日11:00驳回','A处理时间对应9月15日11:00'],
 ['guild-detail.html','处理时间：','未处理申请无处理时间','A刚提交，公会尚未处理','A不展示处理时间'],
 ['guild-detail.html','申请：','申请原因正文','退会申请A填写原因个人安排，尚待审核','A申请原因显示个人安排','主播'],
 ['guild-detail.html','无内容时隐藏','空申请原因隐藏','加入申请A未填写申请原因','A不显示申请原因内容'],
 ['guild-detail.html','驳回：','驳回原因回显','A被公会驳回且原因资料不清晰','A驳回原因显示资料不清晰'],
 ['guild-detail.html','申请被驳回且有驳回原因时展示','非驳回申请无驳回原因','A已平台通过，未发生驳回','A不显示驳回原因','主播'],
 ['guild-detail.html','姓名 / 电话：','申请认证电话快照','本次申请电话+628123456789；个人联系电话后来已变化','展开A申请资料后电话仍为+628123456789'],
 ['guild-detail.html','本人照片：','本次申请本人照片归属','A提交照片A，旧申请B提交照片B；A资料已展开','本人照片材料对应申请A的照片A'],
 ['guild-detail.html','每张加入申请单的申请资料默认收起','申请资料默认收起','当前公会详情包含两笔加入申请，首次打开','两笔申请的资料均默认收起'],
 ['guild-detail.html','图片以材料占位展示，不显示文件名','认证材料不泄露文件名','A提交时本人照片名qa-person.jpg；资料已展开','材料区不显示qa-person.jpg文件名'],
 ['guild-leave-application.html','当前公会：','退会对象取有效关系','当前账号是G001有效主播，历史曾加入G002','当前公会显示G001','主播'],
 ])test(page,[ref],role,`核对${point}`,point,[`已登录且进入${pages.get(page).registeredName}，完成下列页面状态准备`,pre],['查看|当前页面对应业务记录'],result,P2);
for(const [kind,key]of [['名称','QA'],['ID','100']])test('guild-management.html',['按公会名称或 ID 模糊匹配','实时筛选'],'普通用户',`公会搜索使用部分${kind}`,`公会${kind}模糊检索`,['已配置有效公会甲名称QA公会、ID1001；乙名称Other、ID9002'],[enter('guild-management.html'),`填写|搜索关键词|为${key}`],'结果仅显示甲',P1);
for(const action of ['点击搜索','按Enter'])test('guild-management.html',['点击搜索或按 Enter 结果一致'],'普通用户',`公会搜索通过${action}提交`,'公会搜索提交方式',['已配置甲QA公会、乙Other，当前关键词QA'],[enter('guild-management.html'),'填写|关键词|为QA',action==='点击搜索'?'点击|搜索':'提交|搜索|通过Enter键'],'结果仅显示甲',P2);
test('guild-management.html',['关键词为空时展示全部'],'主播','清空公会搜索保留本人已加入公会','公会空查询关系范围',['配置有效G001和G002；本账号已加入G001，当前搜索仅命中G002'],[enter('guild-management.html'),'清空|搜索框'],'列表同时包含G001和G002',P1);
for(const [state,label,role]of [['从未申请且无其他处理中申请','申请','普通用户'],['入会申请正在处理中','申请中','普通用户'],['已加入该公会','已入会','主播']])test('guild-management.html',['申请状态：'],role,`公会卡片承接${state}`,`公会卡片${label}状态`,[`目标公会G001有效，当前账号${state}`],[enter('guild-management.html')],`G001卡片显示${label}`,P1);
test('guild-application-form.html',['去除首尾空格'],'普通用户','入会姓名首尾空格去除后提交','认证姓名去空格',['当前无处理中申请、未入会；目标公会G001有效；电话+628123456789、本人与KTP正反面图片均已填写'],[enter('guild-application-form.html'),'填写|姓名|为“  QA甲  ”','点击|提交','点击|本次申请资料'],'申请姓名显示QA甲',{...P1,observe:'guild-detail.html',extra:[['guild-detail.html','姓名 / 电话：']]});
for(const field of ['本人照片','证件正面','证件反面'])test('guild-application-form.html',[field==='本人照片'?'本人照片：':'证件照片：'],'普通用户',`入会${field}不接受非图片文件`,`认证${field}文件类型`,['本地准备可读取的qa.txt文本文件'],[enter('guild-application-form.html'),`上传|${field}|选择qa.txt`],`${field}不接受该文本文件`,P1);
for(const type of ['KTP','SIM'])test('guild-detail.html',['证件类型 / 正反面照片：'],'普通用户',`已提交申请保留${type}材料快照`,`认证${type}资料归属`,[`本次申请A使用${type}及其正反面图片，尚在审核；进入详情并展开A资料`],['查看|申请A证件资料'],`证件资料为${type}及A提交的对应正反面图片`,P1);
for(const [state,label,role]of [['入会处理中','申请中','普通用户'],['平台通过','已加入','主播'],['入会被驳回','已驳回','普通用户'],['退会通过','已退出','普通用户']])test('guild-application-records.html',['关系状态：'],role,`我的公会卡片呈现${state}`,`我的公会${label}关系`,[`当前账号G001关系处于${state}，没有后续申请或关系变动`],[enter('guild-application-records.html')],`G001显示${label}`,P1);
test('guild-application-records.html',['点击公会卡片 -> 进入对应公会详情'],'普通用户','公会申请卡片进入正确公会时间轴','我的公会详情对象',['本账号分别向G001和G002申请过，均被驳回'],[enter('guild-application-records.html'),'点击|G002卡片'],'详情显示G002的申请时间轴',P2);
test('guild-detail.html',['点击返回 -> 进入我的公会'],'普通用户','公会详情返回本人公会记录','公会详情返回去向',[],[enter('guild-detail.html'),'点击|返回'],'进入我的公会页',P2);
test('guild-detail.html',['再次点击收起'],'普通用户','再次点击申请资料折叠内容','申请资料收起动作',['当前A申请资料已经展开'],['点击|A的申请资料'],'A的申请资料收起',P2);
for(const state of ['入会申请中','入会已驳回','已退出'])test('guild-detail.html',['其他状态不展示该入口'],'普通用户',`${state}时不提供退会申请`,'无有效关系退会入口',[`当前G001关系为${state}`],[enter('guild-detail.html')],'不显示申请退出入口',P1);
for(const state of ['退会申请中','退会已驳回'])test('guild-detail.html',['退会申请中或被驳回时，公会关系仍为已加入'],'主播',`${state}不提前解除公会关系`,'退会审核前关系保持',[`已加入G001，当前退会申请${state}`],[enter('guild-detail.html')],'当前公会关系显示已加入',P1);
for(const [page,refs,label,fixture,result]of [
 ['guild-switch.html',['名称 / 用户 ID','身份：'],'当前登录身份','当前登录公会长名称ChiefA、用户IDC001，当前公会IDG001','登录身份显示公会长ChiefA（用户IDC001）'],
 ['guild-switch.html',['公会 Logo / 名称 / ID'],'可选公会标识','可管理公会A名称QA公会、IDG001、Logo为图片A','公会A标识显示QA公会（G001，Logo为图片A）'],
 ['guild-home.html',['公会 Logo / 名称 / ID'],'当前公会标识','当前管理QA公会G001、Logo图片A，另有权限管理G002','当前公会标识显示QA公会（G001，Logo为图片A）'],
 ['guild-join-review.html',['申请人头像 / 名称 / ID'],'入会申请人身份','申请A由用户甲U001提交，昵称QA甲、头像图片A；其认证姓名为张甲','申请A的申请人显示QA甲（U001，头像图片A）'],
 ['guild-join-review-detail.html',['头像 / 昵称 / 用户 ID'],'入会详情账号身份','当前申请由用户甲U001提交，昵称QA甲、头像图片A；认证姓名为张甲','账号资料显示QA甲（U001，头像图片A）'],
 ['guild-leave-review.html',['申请人头像 / 名称 / ID'],'退会申请人身份','申请A由在会主播甲H001提交，昵称QA甲、头像图片A','申请A的申请人显示QA甲（H001，头像图片A）'],
 ['guild-leave-review-detail.html',['头像 / 名称：','主播 ID：'],'退会详情主播身份','当前退会申请属于主播甲H001，昵称QA甲、头像图片A','主播资料显示QA甲（H001，头像图片A）'],
 ['guild-member-list.html',['头像 / 名称：','主播 ID：'],'成员列表主播身份','当前公会成员甲H001昵称QA甲、头像图片A','甲的成员行显示QA甲（H001，头像图片A）'],
 ['guild-host-list.html',['头像 / 名称：','主播 ID：'],'业绩列表主播身份','当前业绩行属于甲H001，昵称QA甲、头像图片A','甲的业绩行显示QA甲（H001，头像图片A）'],
 ['guild-host-summary.html',['头像 / 名称：','主播 ID：'],'主播数据身份','当前查看甲H001，昵称QA甲、头像图片A；列表还存在乙H002','资料区显示QA甲（H001，头像图片A）'],
 ['guild-host-detail.html',['头像 / 名称：','主播 ID：'],'主播主页身份','当前查看甲H001，昵称QA甲、头像图片A；已加入本公会','资料区显示QA甲（H001，头像图片A）'],
 ['guild-operation-account-detail.html',['头像 / 名称 / 账号 ID：'],'运营账号主页身份','当前查看运营账号O001，名称OpsA、头像图片A；登录名为qa.ops','资料区显示OpsA（账号IDO001，头像图片A）'],
 ['guild-income-day-detail.html',['头像 / 名称：','主播 ID：'],'当日业绩主播身份','当前公会主播甲H001，昵称QA甲、头像图片A','甲的业绩行显示QA甲（H001，头像图片A）'],
 ['guild-violation-host-select.html',['头像 / 名称：','主播 ID：'],'多选页主播身份','当前公会主播甲H001，昵称QA甲、头像图片A','甲的选项显示QA甲（H001，头像图片A）'],
 ])g(page,refs,`${label}不串用其他业务对象`,label,[fixture],[enter(page)],result,P2);
for(const [page,ref,title,fixture,result]of [
 ['guild-join-review.html','申请时间：','入会申请提交时间','申请9月15日10:00提交，9月16日处理','申请时间对应9月15日10:00'],
 ['guild-leave-review.html','申请时间：','退会申请提交时间','9月1日加入，9月15日10:00提交退会','申请时间对应9月15日10:00'],
 ['guild-leave-review-detail.html','加入时间：','当前公会关系生效日期','旧关系8月1日结束，本次9月1日加入，9月15日申请退会','加入时间对应9月1日'],
 ['guild-leave-review-detail.html','申请时间：','退会详情本次提交时间','9月15日10:00提交退会，9月16日审核通过','申请时间对应9月15日10:00'],
 ['guild-message-detail.html','发送时间：','消息实际发送时间','消息9月15日10:00发送，9月16日查看','发送时间对应9月15日10:00'],
 ['guild-notification-detail.html','发送时间：','通知生成时间','通知9月15日10:00生成，9月16日读取','发送时间对应9月15日10:00'],
 ['guild-live-gift-detail.html','开播时间：','场次实际开播时间','场次S1于9月15日10:00开播，11:00结束','开播时间对应9月15日10:00'],
 ])g(page,[ref],`${title}采用业务发生时点`,title,[fixture],[enter(page)],result,P2);
g('guild-join-review.html',['状态 Tab / 数量：'],'入会审核状态数量独立统计','入会状态数量',['本公会待公会审核2单、平台审核中1单、已通过4单、已驳回5单'],[enter('guild-join-review.html')],'审核中数量显示3',P1);
g('guild-leave-review.html',['状态 Tab / 数量：'],'退会审核数量只计待公会处理','退会状态数量',['本公会待审核2单、已通过3单、已驳回4单'],[enter('guild-leave-review.html')],'审核中数量显示2',P1);
g('guild-member-list.html',['在会 / 已退会及数量：'],'成员人数按有效公会关系区分','当前在会成员人数',['本公会当前在会2人、历史已退会3人，另有普通用户待审1人'],[enter('guild-member-list.html')],'在会人数显示2',P1);
g('guild-join-review.html',['重新申请生成新单'],'公会驳回后再次申请重新进入审核','重新申请单据独立',['用户甲旧申请A已公会驳回，现已重新提交申请B'],[enter('guild-join-review.html'),'切换|审核中'],'新申请B处于待公会审核',P1);
g('guild-join-review-detail.html',['节点 / 状态：'],'公会通过后审核进度停在平台节点','入会审核节点进度',['公会已通过本申请，平台尚未处理'],[enter('guild-join-review-detail.html')],'当前节点显示平台审核中',P1);
g('guild-leave-review-detail.html',['申请状态：'],'退会驳回结果展示当前申请状态','退会已驳回状态',['当前退会申请已被公会驳回'],[enter('guild-leave-review-detail.html')],'申请状态显示已驳回',P1);
g('guild-host-list.html',['达标人数：'],'周期内多天达标的主播按人去重','公会周期达标人数',['甲两天均达标，乙一天达标，丙未达标；筛选范围覆盖上述两日'],[enter('guild-host-list.html')],'达标人数显示2',P1);
g('guild-income.html',['默认本月'],'公会业绩首次进入选择本月','公会业绩默认日期',[],[enter('guild-income.html')],'日数据范围默认本月',P2);
g('guild-income.html',['该月有开播的去重主播人数'],'月行开播人数对同主播去重','月业绩开播人数',['9月甲完成3场，乙完成1场，其他主播无开播'],[enter('guild-income.html'),'切换|月数据'],'9月行开播人数显示2',P1);
g('guild-income.html',['该日直播场次数'],'日行业绩统计全部场次','日业绩场次数',['9月15日甲完成2场、乙完成1场，无其他场次'],[enter('guild-income.html'),'切换|日数据'],'9月15日行直播场次显示3',P1);
g('guild-income.html',['收益（金币）：'],'日行收益不显示线下分成','日业绩收益单位',['9月15日甲主播收益100金币、乙200金币，财务分成10USD'],[enter('guild-income.html'),'切换|日数据'],'9月15日行收益 = 300',{...P1,calc:calculation('甲收益+乙收益',{甲收益:100,乙收益:200},{运算:'+',参数:[{变量:'甲收益'},{变量:'乙收益'}]},300)});
g('guild-income.html',['点击指标卡片'],'切换业绩卡片更新趋势指标','业绩趋势指标选择',['当前收益趋势，范围内存在直播场次数据'],[enter('guild-income.html'),'点击|直播场次指标卡片'],'趋势显示直播场次数',P2);
g('guild-live-gift-detail.html',['观众数量：'],'场次详情重复进房只计一名观众','详情观众去重',['同场甲进出3次，乙进入1次，均为真实用户'],[enter('guild-live-gift-detail.html')],'观众数量显示2人',P1);
g('guild-live-gift-detail.html',['礼物数量：'],'场次详情收礼数量排除失败赠送','详情成功礼物件数',['本场甲成功送3件、乙成功送2件，另有失败4件'],[enter('guild-live-gift-detail.html')],'礼物数量显示5件',P1);
g('guild-live-gift-detail.html',['消费金币：'],'赠礼详情金额按成交单价乘件数','详情单笔礼物消费',['记录A成交单价10金币、数量3，当前礼物价20金币'],[enter('guild-live-gift-detail.html'),'点击|记录A'],'消费金币 = 30',{...P1,calc:calculation('成交单价×数量',{成交单价:10,数量:3},{运算:'*',参数:[{变量:'成交单价'},{变量:'数量'}]},30)});
g('guild-live-gift-detail.html',['赠送时间：'],'赠礼明细时间采用成功赠送时点','详情赠送成功时间',['记录A于9月15日10:00成功赠送，9月16日查看'],[enter('guild-live-gift-detail.html'),'点击|记录A'],'赠送时间对应9月15日10:00',P2);
g('guild-host-data.html',['多主播范围显示所属主播信息'],'多主播场次各自显示所属主播','多主播记录身份',['当前范围包括甲H001与乙H002，甲的场次S1、乙的S2'],[enter('guild-host-data.html')],'S2对应主播乙H002',P1);
g('guild-host-data.html',['直播时长：'],'场次时长按小时分钟显示','公会场次时长',['目标场次已结束，累计直播90分钟'],[enter('guild-host-data.html')],'该场次时长显示1小时30分钟',P2);
g('guild-host-data.html',['所选主播在所选日期范围内计入收益'],'更换主播筛选后收益范围更新','公会场次汇总筛选',['同日甲收益100金币、乙200金币，默认全部主播'],[enter('guild-host-data.html'),'点击|主播筛选','选择|仅主播甲','点击|完成'],'收益汇总显示100金币',P1);
g('guild-message-detail.html',['发送对象 / 人数：'],'群发历史人数不随退会减少','消息历史接收人数',['消息N发送时3名接收人，随后其中1人退会'],[enter('guild-message-detail.html')],'消息N接收人数仍为3',P1);
g('guild-message-detail.html',['按发送时快照展示'],'改名后历史接收人使用发送时名称','消息历史接收名称',['发送时接收人名称甲，随后改名乙'],[enter('guild-message-detail.html')],'该历史消息接收人名称显示甲',P1);
g('guild-operation-account-detail.html',['账户余额：'],'运营余额按成功发放减消费','运营虚拟金币可用余额',['累计成功发放1000金币、成功消费200金币，另有失败发放100与失败消费50'],[enter('guild-operation-account-detail.html')],'账户余额 = 800',{...P1,calc:calculation('成功发放-成功消费',{成功发放:1000,成功消费:200},{运算:'-',参数:[{变量:'成功发放'},{变量:'成功消费'}]},800)});
g('guild-operation-account-detail.html',['与平台管理锁定状态分开'],'平台锁定不会改成禁用状态','运营启停与管理锁定独立',['运营账号启用，平台随后锁定公会对它的管理权限'],[enter('guild-operation-account-detail.html')],'启用状态仍为启用',P1);
g('guild-operation-gift-records.html',['总消费金币：'],'多笔虚拟赠礼按成交额汇总','虚拟赠礼汇总消费',['当前筛选成功记录A单价10数量3、B单价20数量2，失败记录C单价50数量1'],[enter('guild-operation-gift-records.html')],'总消费金币 = 70',{...P1,calc:calculation('A单价×A数量+B单价×B数量',{A单价:10,A数量:3,B单价:20,B数量:2},{运算:'+',参数:[{运算:'*',参数:[{变量:'A单价'},{变量:'A数量'}]},{运算:'*',参数:[{变量:'B单价'},{变量:'B数量'}]}]},70,'虚拟金币')});
g('guild-operation-gift-records.html',['该笔礼物接收主播'],'运营赠礼明细使用实际接收主播','虚拟赠礼接收对象',['运营账号O001向主播H002送礼，另一主播H003未收礼'],[enter('guild-operation-gift-records.html'),'点击|该笔送礼记录'],'接收主播ID显示H002',P1);

// Explicit page-level observations for requirements not represented by the earlier designs.
for(const [page,ref,point,fixture,result] of [
 ['guild-notifications.html','标题：','通知标题事件结果','用户甲入会申请由平台驳回，已有对应通知N','N标题表达入会申请的平台驳回结果'],
 ['guild-notifications.html','摘要：','通知摘要对象','用户甲U001申请被驳回，另有乙U002已通过','甲的驳回通知摘要对应甲U001'],
 ['guild-notification-detail.html','标题：','通知详情标题一致性','列表通知N标题为实际生成的入会审核结果，记录该标题','详情标题与N的列表标题一致'],
 ['guild-messages.html','发送对象：','指定消息接收人','消息N仅发送给主播甲H001，乙H002未接收','消息N发送对象显示甲H001'],
 ['guild-messages.html','发送时间：','消息列表发送时点','消息N于9月15日10:00发送，9月16日查看；选择包含该时间的日期范围','消息N发送时间对应9月15日10:00'],
 ['guild-host-select.html','主播数量：','单选搜索结果人数','当前公会2名主播昵称含QA，另有1名不含QA；当前搜索QA','结果人数显示2'],
 ['guild-host-select.html','头像 / 名称：','单选主播账号身份','当前公会主播甲H001昵称QA甲、头像图片A','甲的选项显示QA甲（头像图片A）'],
 ['guild-host-select.html','主播 ID：','单选主播唯一标识','当前公会主播甲IDH001，昵称与另一主播相同','甲的选项显示H001'],
 ['guild-settings.html','头像 / 公会长名称：','设置页公会长资料','公会长名称ChiefA、头像图片A；公会名称GuildA、Logo图片B','账号资料显示ChiefA（头像图片A）'],
 ['guild-host-data.html','直播主题：','场次标题快照','场次S1标题QA首场，S2标题QA次场；日期范围包含两场','S1显示主题QA首场'],
 ['guild-live-gift-detail.html','主播名称 / 主播 ID：','场次所属主播','场次S1由主播甲H001创建，乙H002未参与','所属主播显示甲H001'],
 ['guild-live-gift-detail.html','直播时长：','场次详情累计时长','已结束场次S1累计90分钟','直播时长显示1小时30分钟'],
 ['guild-all-violations.html','违规类型：','违规记录类型配置','平台已配置违规类型QA类型，记录N使用该类型','记录N违规类型显示QA类型'],
 ['guild-share-ledger.html','主播名称 / 主播 ID：','分成记录归属主播','财务结果N属于主播甲H001，另有乙H002的结果；日期覆盖N','结果N显示主播甲H001'],
 ['guild-share-ledger.html','分成时间：','主播分成入账时点','结果N收益所属期8月，9月15日10:00入账；查看9月','分成时间对应9月15日10:00'],
 ['guild-share-income.html','分成时间：','公会分成入账时点','结果N收益所属期8月，9月15日10:00入账','分成时间对应9月15日10:00'],
 ['guild-host-detail.html','姓名 / 电话：','主播认证联系电话','主播认证电话+628123456789，公会长电话+628987654321','联系电话显示+628123456789'],
 ['guild-host-detail.html','权限已锁定：','平台锁定提示','平台已锁定公会对主播甲的直播权限管理','显示权限已锁定提示'],
 ['guild-host-detail.html','申请类型 / 状态：','主播历史申请结果','主播甲有已通过入会申请A及已驳回退会申请B','申请B显示退出申请及已驳回'],
 ['guild-host-detail.html','审核节点 / 时间：','主播历史审核节点','入会申请A公会9月14日10:00通过、平台9月15日11:00通过','申请A平台节点显示通过及9月15日11:00'],
 ['guild-host-detail.html','申请原因 / 驳回原因：','主播历史退会原因','退会申请B原因个人安排、驳回原因资料需补充','申请B申请原因显示个人安排'],
 ['guild-host-detail.html','申请原因 / 驳回原因：','主播历史驳回原因','退会申请B原因个人安排、驳回原因资料需补充','申请B驳回原因显示资料需补充'],
 ])g(page,[ref],`核对${point}对应当前业务记录`,point,[fixture],[enter(page)],result,P2);
for(const [read,result] of [[false,'通知N显示未读圆点'],[true,'通知N不显示未读圆点']])g('guild-notifications.html',['未读标记：'],`公会通知${read?'已读':'未读'}标记`,'通知已读状态',[`当前公会通知N${read?'已读取':'从未读取'}`],[enter('guild-notifications.html')],result,P2);
g('guild-notification-detail.html',['业务入口：'],'通知关联记录点击后保持业务对象','通知业务下钻',['通知N关联入会申请A，公会长有权审核A'],[enter('guild-notification-detail.html'),'点击|关联业务入口'],'进入申请A详情',P1);
for(const [page,ref,point,action,result]of [
 ['guild-host-list.html','点击主播行','主播业绩下钻','主播甲行','进入甲的主播数据页'],
 ['guild-host-summary.html','点击主页入口','主播数据主页入口','主页','进入当前主播的主播主页'],
 ['guild-host-detail.html','点击业绩','主播主页业绩入口','业绩','进入当前主播的主播数据页'],
 ['guild-settings.html','修改密码：','公会改密入口','修改密码','进入修改密码页'],
 ['guild-all-violations.html','点击主播','违规记录主播下钻','记录N的主播甲','进入主播甲详情'],
 ])g(page,[ref],`从实际入口打开${point}`,point,['公会长已登录；当前页面存在所选主播或记录'],[enter(page),`点击|${action}`],result,P2);
for(const page of ['guild-operation-gift-records.html','guild-live-gift-detail.html'])for(const [ref,point,result]of [
 ['礼物名称：','赠礼详情礼物名称','礼物名称显示QA玫瑰'],
 ['礼物类型：','赠礼详情礼物类型','礼物类型显示定制礼物'],
 ['赠送数量：','赠礼详情件数','赠送数量显示3件'],
 ])g(page,[ref],`${page.includes('operation')?'虚拟':'真实'}${point}`,point,['记录A成功赠送定制礼物QA玫瑰3件；当前筛选包含A'],[enter(page),'点击|记录A'],result,P2);
g('guild-operation-gift-records.html',['赠送时间：'],'虚拟赠礼详情显示成交时点','虚拟赠礼成交时间',['记录A于9月15日10:00成功赠送，筛选范围包含该日'],[enter('guild-operation-gift-records.html'),'点击|记录A'],'赠送时间对应9月15日10:00',P2);
for(const [type,label]of [['普通','普通房'],['门票','门票房'],['密码','密码房']])g('guild-host-data.html',['房型图标：'],`公会直播记录识别${label}`,'场次房型标识',[`场次S1为${label}，筛选范围包含S1`],[enter('guild-host-data.html')],`S1显示${type}房型标识`,P2);
for(const [page,ref,point,fixture,result]of [
 ['guild-home.html','普通礼物、定制礼物','首页礼物收益范围','当日普通礼物成功消费100、定制200、幸运总价值1000且收益比例1%；无其他收益','当日收益显示310金币'],
 ['guild-home.html','运营账号虚拟金币','首页排除虚拟及失败消费','当日真实普通礼物成功100金币；虚拟礼物500金币；失败真实消费200金币','当日收益显示100金币'],
 ['guild-host-list.html','金币收益：','主播行周期收益','所选周期甲成功普通礼物收益100金币，线下分成5美元，周期外收益200金币','甲的金币收益显示100金币'],
 ['guild-host-list.html','主播收益：','主播业绩汇总收益','所选周期甲收益100、乙200金币，周期外另有500金币','主播收益汇总显示300金币'],
 ['guild-host-summary.html','直播时长：','主播日累计时长','甲当日两场已结束直播分别60及90分钟，日数据范围含该日','该日直播时长显示2小时30分钟'],
 ['guild-host-summary.html','收益（金币）：','主播日收益','甲当日两场收益100及200金币，线下分成10美元，日范围含该日','该日收益显示300金币'],
 ['guild-host-detail.html','总收益：','主播历史收益总额','该主播历史普通礼物收益100金币、定制200金币，无其他计入收益记录','总收益显示300金币'],
 ['guild-operation-accounts.html','余额：','运营列表可用余额','运营账号A已发虚拟金币100、成功消费30，无其他变动','A余额显示70金币'],
 ['guild-operation-accounts.html','本月消费：','运营行当月消费','账号A本月成功消费100，上月200，本月失败消费50；账号B本月消费300','A本月消费显示100金币'],
 ['guild-income.html','达标主播：','公会日行达标人数','9月15日甲累计180分钟、乙179分钟、丙181分钟；查看该日期行','9月15日达标主播显示2人'],
 ['guild-income.html','该月主播收益金币汇总','公会月行收益','9月甲收益100、乙200金币；8月收益500金币；查看9月月数据','9月收益显示300金币'],
 ['guild-income.html','所选日期范围内全部主播创建','公会日期范围场次','9月1日至15日甲两场、乙一场，16日另有一场；选择1日至15日','直播场次汇总显示3场'],
 ['guild-income.html','所选月份范围内创建','公会月份范围场次','8月两场、9月三场、7月一场；月范围选8月至9月','直播场次汇总显示5场'],
 ['guild-income-day-detail.html','已开播主播当日收益','每日主播行收益','9月15日甲收益100金币、乙200金币，查看该日','甲的当日收益显示100金币'],
 ['guild-income-day-detail.html','全部主播当日计入收益','每日全部主播收益','9月15日甲收益100金币、乙200金币，查看该日','当日收益汇总显示300金币'],
 ['guild-income-day-detail.html','当日累计直播时长达到','每日达标人数','9月15日甲180分钟、乙179分钟、丙181分钟，查看该日','达成有效天显示2人'],
])g(page,[ref],`核对${point}的统计范围`,point,[fixture],[enter(page)],result,P1);

for(const [point,fixture,result]of [
 ['通知入口未读提示','当前公会有1条未读通知','通知入口显示未读提示'],
 ['通知入口已读状态','当前公会所有通知均已读','通知入口不显示未读提示'],
 ])g('guild-home.html',['通知标记：'],`公会首页${point}`,point,[fixture],[enter('guild-home.html')],result,P2);
for(const event of ['平台关闭直播场次','平台恢复直播权限','公会长账号状态变更','主播分成冲正','公会分成冲正'])g('guild-notifications.html',[event.includes('分成')?'结果新增或冲正':event.includes('公会长')?'公会长账号状态':event.includes('恢复')?'恢复直播权限':'关闭直播场次'],`公会收到${event}通知`,`${event}业务通知`,[`当前公会已发生${event}，通知服务已完成该事件投递`],[enter('guild-notifications.html')],`存在对应${event}通知`,P1);
g('guild-notifications.html',['点击通知 -> 进入通知详情'],'通知列表打开选中通知','通知列表详情对应',['当前列表有通知N和M'],[enter('guild-notifications.html'),'点击|通知N'],'详情展示通知N',P2);
for(const page of ['guild-join-review.html','guild-leave-review.html'])for(const state of ['已通过','已驳回'])g(page,['各状态申请数量'],`${page.includes('join')?'入会':'退会'}${state}数量`,`${state}申请数量`,[`当前公会${state}申请3单，其他状态4单`],[enter(page)],`${state}数量显示3`,P1);
g('guild-join-review.html',['驳回区分公会驳回'],'入会公会驳回状态不冒充平台结论','公会驳回阶段标识',['申请A被公会驳回，平台从未处理'],[enter('guild-join-review.html'),'切换|已驳回'],'申请A显示公会驳回',P1);
for(const [stage,result]of [['用户刚提交','待公会审核'],['平台终审已通过','成为主播']])g('guild-join-review-detail.html',['节点 / 状态：'],`入会进度识别${stage}`,'入会当前审核阶段',[`当前申请${stage}`],[enter('guild-join-review-detail.html')],`当前阶段显示${result}`,P1);
g('guild-join-review-detail.html',['节点时间：'],'入会审核完成显示实际节点时间','入会完成节点时间',['申请9月14日10:00提交，公会9月15日11:00通过'],[enter('guild-join-review-detail.html')],'公会节点时间对应9月15日11:00',P2);
for(const [page,kind]of [['guild-join-review-detail.html','入会'],['guild-leave-review-detail.html','退会']]){
 g(page,['最多 200'],`${kind}驳回理由达到200字符可提交`,`${kind}驳回理由上限可用`,[`当前${kind}申请待公会处理`],[enter(page),'点击|驳回','填写|驳回理由|为200个A','点击|确认'],'对应驳回节点显示完整200个A',P1);
 g(page,['只读'],`${kind}已通过申请不可再审核`,`${kind}通过结果只读`,[`当前${kind}申请已处理为通过`],[enter(page)],'不提供再次通过或驳回操作',P1);
}
g('guild-join-review-detail.html',['驳回 ->'],'公会驳回入会形成终态','公会驳回申请状态',['当前申请待公会审核'],[enter('guild-join-review-detail.html'),'点击|驳回','填写|驳回理由|为资料不足','点击|确认'],'本次申请显示公会驳回',P1);
for(const state of ['待审核','已通过'])g('guild-leave-review-detail.html',['申请状态：'],`退会详情显示${state}`,'退会申请当前状态',[`当前申请状态${state}`],[enter('guild-leave-review-detail.html')],`申请状态显示${state}`,P1);
g('guild-member-list.html',['在会 / 已退会及数量：'],'已退会列表人数只统计历史关系','已退会成员人数',['当前公会历史已退会3人，在会2人'],[enter('guild-member-list.html')],'已退会人数显示3',P1);
g('guild-member-list.html',['普通用户不进入主播列表'],'待认证普通用户不列为主播','主播列表身份范围',['甲当前为在会主播，乙普通用户入会待平台审核'],[enter('guild-member-list.html')],'在会列表不显示乙',P1);
g('guild-member-list.html',['点击主播 -> 进入主播详情'],'成员列表打开目标主播主页','成员详情对象',['当前公会甲H001和乙H002均在会'],[enter('guild-member-list.html'),'点击|主播甲'],'进入甲H001的主播主页',P2);
for(const [page,ref]of [['guild-member-list.html','名称或 ID 模糊匹配'],['guild-host-list.html','按主播昵称或 ID'],['guild-host-select.html','名称或 ID 模糊匹配'],['guild-violation-host-select.html','名称或主播 ID 模糊匹配']])g(page,[ref],`${pages.get(page).name}按部分昵称查询`,'昵称模糊搜索',['本公会QA甲、QA乙与丙各1人'],[enter(page),'填写|搜索框|为QA'],'搜索结果仅包含QA甲和QA乙',P2);
for(const [page,ref]of [['guild-operation-accounts.html','按运营账号名称或账号 ID'],['guild-operation-account-select.html','名称或登录账号模糊匹配']])g(page,[ref],`${pages.get(page).name}按名称查询`,'运营账号名称搜索',['本公会运营QA甲、QA乙与丙各1个'],[enter(page),'填写|搜索框|为QA'],'结果仅包含QA甲和QA乙',P2);
for(const [point,ref,pre,result]of [
 ['主播月累计时长','直播时长：','甲9月完成两场分别60与90分钟','9月直播时长显示2小时30分钟'],
 ['主播月收益','收益（金币）：','甲9月收益100与200金币，8月500金币','9月收益显示300金币'],
 ['主播月新增粉丝','新增粉丝：','甲9月新增10次关注，取关3人，8月新增20人','9月新增粉丝显示10人'],
 ])g('guild-host-summary.html',[ref],`主播月数据${point}`,point,[pre],[enter('guild-host-summary.html'),'切换|月数据'],result,P1);
g('guild-host-summary.html',['日数据一行一个自然日'],'主播日数据按自然日划分记录','主播日粒度',['甲9月14日及15日各有2场；当前日范围包含两日'],[enter('guild-host-summary.html')],'两日分别汇总为各自日期行',P2);
g('guild-host-summary.html',['月数据一行一个自然月'],'主播月数据按自然月划分记录','主播月粒度',['甲8月及9月各有2场'],[enter('guild-host-summary.html'),'切换|月数据'],'8月与9月分别汇总为各自月份行',P2);
g('guild-host-summary.html',['默认本月'],'主播数据日范围默认本月','主播数据默认日范围',[],[enter('guild-host-summary.html')],'日范围默认本月',P2);
g('guild-host-summary.html',['点击日或月数据行'],'主播日数据下钻携带当天日期','主播日行下钻范围',['当前查看主播甲，存在9月15日日数据'],[enter('guild-host-summary.html'),'点击|9月15日数据行'],'直播记录限定主播甲和9月15日',P1);
g('guild-host-detail.html',['已退会显示【退会】'],'历史主播主页标明已退会','主播主页退会标记',['当前主播已退出本公会'],[enter('guild-host-detail.html')],'显示退会标记',P2);
g('guild-host-detail.html',['申请类型 / 状态：'],'主播历史入会申请显示已通过','主播历史入会结果',['当前主播入会申请A已通过'],[enter('guild-host-detail.html')],'申请A显示加入申请及已通过',P2);
g('guild-host-detail.html',['审核节点 / 时间：'],'退会历史只显示公会审核节点','退会历史审核范围',['退会申请B仅由公会9月15日10:00驳回'],[enter('guild-host-detail.html')],'申请B仅有公会处理节点，时间对应9月15日10:00',P1);
g('guild-messages.html',['消息摘要：'],'消息列表摘要取发送时文本','运营消息摘要内容',['消息N正文为QA测试通知'],[enter('guild-messages.html')],'消息N摘要显示QA测试通知',P2);
g('guild-messages.html',['超出卡片可见长度截断'],'长消息摘要截断不改变原文','长消息摘要截断',['消息N有500字正文，在当前设备超过卡片可见长度'],[enter('guild-messages.html')],'列表摘要显示原文前部并截断超出部分',P2);
g('guild-messages.html',['新建 -> 进入发送页'],'运营消息列表创建新消息','新建运营消息入口',[],[enter('guild-messages.html'),'点击|新建'],'进入发送运营消息页',P2);
g('guild-message-compose.html',['显示当前字数/500'],'消息输入更新字数','消息正文字数反馈',[],[enter('guild-message-compose.html'),'填写|文字内容|为QA测试'],'当前字数显示4/500',P2);
g('guild-message-compose.html',['可预览和移除'],'移除已选消息附图','运营消息附图移除',['当前编辑消息已选择图片A'],[enter('guild-message-compose.html'),'点击|图片A移除'],'消息不再附带图片A',P2);
g('guild-host-select.html',['完成 -> 回填新建运营消息'],'选择主播完成后回填指定接收人','指定接收主播回填',['由新建消息页进入，当前公会有甲H001'],[enter('guild-host-select.html'),'选择|主播甲','点击|完成'],'消息发送对象显示甲H001',P1);
g('guild-operation-accounts.html',['点击账号 -> 进入账号主页'],'运营列表打开对应账号主页','运营账号详情对象',['列表存在账号甲O001和乙O002'],[enter('guild-operation-accounts.html'),'点击|账号甲'],'主页显示账号甲O001',P2);
g('guild-profile.html',['去除首尾空格'],'公会名称保存时清理首尾空格','公会名称空格处理',[],[enter('guild-profile.html'),'填写|公会名称|为前后各2个空格的QA公会','点击|保存'],'公会名称保存为QA公会',P1);
g('guild-profile.html',['公会简介：选填'],'公会简介允许留空保存','公会简介非必填',['当前公会名称有效'],[enter('guild-profile.html'),'清空|公会简介','点击|保存'],'公会简介保存为空',P2);
g('guild-password.html',['新密码：必填'],'公会改密新密码不能为空','公会新密码必填',['当前密码QaOld!2026'],[enter('guild-password.html'),'填写|当前密码|为QaOld!2026','清空|新密码','填写|确认新密码|为QaNew!2026','点击|保存'],'不能提交缺少新密码的修改',P1);
for(const kind of ['当前密码错误','新密码与旧密码相同','请求失败'])g('guild-password.html',['保留输入并提示'],`公会改密${kind}保留输入`,'公会改密失败输入保持',[`当前密码QaOld!2026；${kind==='请求失败'?'环境准备：可模拟改密请求失败，执行前须提供故障模拟能力':'请求服务正常'}`],[enter('guild-password.html'),`填写|当前密码|为${kind==='当前密码错误'?'BadOld!2026':'QaOld!2026'}`,`填写|新密码|为${kind==='新密码与旧密码相同'?'QaOld!2026':'QaNew!2026'}`,`填写|确认新密码|为${kind==='新密码与旧密码相同'?'QaOld!2026':'QaNew!2026'}`,'点击|保存'],'三个密码输入框保留本次输入内容',P1);

const ad=(page,ref,title,point,fixture,result,steps=[])=>a(page,[ref],title,point,[`已登录后台并打开${pages.get(page).registeredName}；已按下列条件准备记录及选择统计范围`,fixture],[`查看|当前${pages.get(page).registeredName}页`,...steps],result,P1);
ad('admin-gift-send-count-rules.html','规则 ID：','两条赠送数量规则使用不同ID','赠送数量规则唯一编号','已分别创建有效规则A与B','A与B规则ID不同');
ad('admin-gift-send-count-rules.html','按配置顺序展示','赠送数量列表保持配置顺序','数量规则列表顺序','规则A的数量顺序为1、10、5','A数量按1、10、5顺序展示');
ad('admin-gift-send-count-rules.html','每个礼物只能关联一条启用规则','启用存在礼物重叠的数量规则失败','启用数量规则冲突','规则A启用且关联礼物G1；规则B停用也关联G1','规则B不能启用',['点击|规则B启用']);
ad('admin-gift-send-count-rules.html','状态：','停用赠送数量规则更新列表','数量规则停用状态','规则A当前启用','规则A状态显示停用',['点击|规则A停用']);
ad('admin-gift-send-count-rules.html','编辑 -> 进入详情','数量规则列表编辑正确记录','数量规则详情入口','存在规则A及B','进入规则B详情',['点击|规则B编辑']);
for(const [ref,point,fixture,result]of [
 ['敏感词 / 分类：','敏感词分类','词条QA测试词分类广告引流','QA测试词分类显示广告引流'],
 ['使用场景：','敏感词多场景','词条A配置公屏和私信，未选昵称和动态','A使用场景集合为公屏、私信'],
 ['匹配规则：','敏感词匹配模式','词条A为包含匹配、B为精确匹配','B匹配规则显示精确匹配'],
 ['替换内容：','敏感词替换文本','词条A替换内容为三个星号','A替换内容显示***'],
 ])ad('admin-sensitive-words.html',ref,`核对${point}`,point,fixture,result);
for(const enabled of [true,false])ad('admin-sensitive-words.html','状态：',`${enabled?'启用':'停用'}敏感词更新状态`,'敏感词启停状态',`词条A当前${enabled?'停用':'启用'}`,`词条A状态显示${enabled?'启用':'停用'}`,[`点击|词条A${enabled?'启用':'停用'}`]);
for(const kind of ['必填项缺失','重复词'])ad('admin-sensitive-words.html','校验必填和重复词',`敏感词导入校验${kind}`,`导入${kind}`,`环境准备：取得测试环境实际支持的敏感词导入模板；按模板准备文件A，${kind==='重复词'?'包含两行完全相同的QA测试词':'仅词条内容留空，其他必填值合法'}`,`不能导入${kind}的词条`,['点击|导入','选择|测试文件A','点击|确认导入']);
for(const [page,ref,point,fixture,result]of [
 ['admin-user-list.html','用户信息：','用户列表身份','用户甲U001昵称QA甲、头像图片A；同名乙U002头像图片B','甲的用户信息显示QA甲（U001，头像图片A）'],
 ['admin-user-detail.html','基础资料：','后台用户当前资料','用户U001昵称刚从旧名改为QA甲；其他账号仍叫旧名','昵称显示QA甲'],
 ['admin-user-detail.html','金币余额：','用户详情负余额','当前用户真实金币退款后余额-100，虚拟账户与其无关','金币余额显示-100'],
 ['admin-user-detail.html','充值流水：','充值流水基础金币','用户订单O001基础100、赠送20金币、渠道Google Play、支付成功','O001流水基础金币显示100'],
 ['admin-user-detail.html','充值流水：','充值流水赠送金币','用户订单O001基础100、赠送20金币、渠道Google Play、支付成功','O001流水赠送金币显示20'],
 ['admin-user-detail.html','登录设备：','最近登录设备信息','用户最近用设备A、Android测试版本V1在9月15日10:00成功登录；当前选择登录设备Tab','设备A最近登录时间对应9月15日10:00'],
 ['admin-host-list.html','主播 / 公会：','主播当前公会归属','甲已从A退会并通过B的入会终审；A仍存在历史记录','甲当前公会显示B'],
 ['admin-host-review.html','主播信息：','认证前申请人身份','甲入会申请已公会通过、平台待审核','申请人甲仍显示用户身份'],
 ['admin-host-review.html','公会信息：','认证目标公会','申请A目标QA公会G001，申请人旧公会G002关系已结束','申请A公会显示QA公会G001'],
 ['admin-host-review-detail.html','申请单 / 申请人：','认证详情单据对应','从列表申请A进入，A属于用户甲U001，另有申请B属于乙','申请单及申请人只读对应A和甲U001'],
 ['admin-inspection-schedule-detail.html','排班信息：','排班详情来源记录','选择排班S1日期9月20日、时间10:00至12:00、人数2，另有不同S2','详情排班编号显示S1'],
 ['admin-inspection-schedule-detail.html','人数 = 有效人员行数','排班详情人员数量','排班S1有甲乙两名有效人员，查看S1','人员数量显示2'],
 ['admin-content-audit.html','审核单号：','机审告警标识','同场次S1发生两个独立机审告警A和B','A与B审核单号不同'],
 ['admin-content-audit.html','处置结果：','内容审核已处理结果','告警A已人工执行警告；另有B尚未处理','A处置结果显示警告'],
 ['admin-content-audit-detail.html','基础信息：','机审详情不可改证据对象','当前告警A关联场次S1、主播H001、命中类型T1','告警场次及主播字段只读'],
 ['admin-account-violation.html','被举报账号：','账号举报对象','工单A举报普通用户甲U001，举报人为乙U002','被举报账号显示甲U001及用户类型'],
 ['admin-report-handling.html','直播场次 ID：','直播举报具体场次','主播H001先后开播S1和S2，工单A在S1提交','工单A关联场次显示S1'],
 ['admin-report-handling.html','举报类型：','直播举报类型快照','工单A提交类型名称QA旧类，配置随后更名QA新类','A举报类型仍显示QA旧类'],
 ['admin-report-handling.html','提交时间：','直播举报提交时点','用户在9月15日10:00直播中举报，9月16日处理','提交时间对应9月15日10:00'],
 ['admin-guild-list.html','公会信息：','公会列表身份','公会G001名称QA公会、Logo图片A，存在同名G002','G001显示QA公会及图片A'],
 ['admin-guild-list.html','公会长：','公会长与管理账号','G001公会长昵称ChiefA、管理账号qa-chief，公会名称GuildA','公会长显示ChiefA及qa-chief'],
 ['admin-guild-detail.html','公会 ID：','公会详情ID只读','公会G001已创建，当前编辑其详情','公会ID不可修改'],
 ['admin-gift-list.html','礼物 ID：','普通礼物ID稳定','普通礼物G001已存在，编辑名称后保存','礼物ID仍为G001'],
 ['admin-gift-detail.html','操作记录：','礼物配置操作留痕','qa-admin于9月16日10:00把单价10改为20并保存','操作记录包含该次单价修改及qa-admin'],
 ['admin-prop-list.html','道具 ID：','道具唯一标识','已分别创建头像框A和气泡B','A与B道具ID不同'],
 ['admin-push-detail.html','操作信息：','推送配置最后操作人','qa-admin最后保存任务T1，前次操作者qa-old','最后操作人显示qa-admin'],
 ['admin-recharge-package-detail.html','套餐 ID：','充值套餐ID只读','套餐P001已保存，当前编辑P001','套餐ID不可修改'],
 ['admin-guild-recommendation.html','更新时间：','公会推荐最近更新时间','推荐G001原保存时间9月14日，9月15日10:00再次保存成功','更新时间对应9月15日10:00'],
 ['admin-feature-switch.html','操作信息：','房型开关操作留痕','qa-admin于9月15日10:00修改门票房开关成功','最后操作信息对应qa-admin和9月15日10:00'],
 ['admin-consumption-order.html','主播信息：','消费订单收入对象','订单O1为用户甲向主播H002送礼，当前查看O1','主播信息显示H002'],
 ['admin-consumption-order-detail-report.html','场次 ID：','消费明细报表场次','订单O1发生在S1，主播后来开启S2','O1场次ID仍为S1'],
 ['admin-refund-order.html','退款单号：','退款记录唯一标识','两个不同充值订单A和B均已完成退款','两笔退款单号不同'],
 ['admin-refund-order-detail-report.html','退款时间：','退款报表完成时点','订单9月14日申请退款、9月15日10:00完成','退款时间对应9月15日10:00'],
 ['admin-refund-order-detail-report.html','退款用户 / 商品：','退款报表原订单归属','原订单O1属于甲U001及套餐P1，后续套餐改名','退款行关联用户甲U001和原套餐P1'],
 ['admin-recharge-order-detail-report.html','充值时间：','充值报表支付时点','订单9月14日创建、9月15日10:00支付成功','充值时间对应9月15日10:00'],
 ['admin-recharge-order-detail-report.html','支付渠道：','充值实际支付渠道','订单由Google Play完成，另有App Store订单','目标订单支付渠道显示Google Play'],
 ['admin-recharge-order-detail-report.html','充值金额：','充值报表实付金额','套餐标价10USD，订单成功实付8USD','充值金额显示8USD'],
 ['admin-operation-account-detail.html','账号资料：','后台运营账号资料来源','公会创建O001，昵称OpsA、登录qa.ops、头像A、所属G001','账号资料对应OpsA（qa.ops，G001）'],
 ['admin-operation-gift-records.html','赠送时间：','后台虚拟送礼成交时间','记录A于9月15日10:00完成扣减和送礼，筛选包括该日','赠送时间对应9月15日10:00'],
 ])ad(page,ref,`核对${point}对应业务记录`,point,fixture,result);

for(const [page,ref,point,fixture,result]of [
 ['admin-user-list.html','累计消费：','用户累计净消费','甲普通100、定制200、门票50、幸运扣减100返奖500；另有失败20及虚拟1000金币','累计消费显示-50金币'],
 ['admin-host-list.html','金币收益：','主播列表收益口径','甲普通100、定制200、门票50、幸运价值1000且收益比例1%；虚拟2000金币','金币收益显示360金币'],
 ['admin-host-detail.html','收益：','主播详情历史收益','甲普通100、定制200、门票50、幸运价值1000且当时比例1%、返奖500金币','收益显示360金币'],
 ['admin-live-management.html','消费金币：','场次列表净消费','场次S1普通100、定制200、门票50、幸运扣减100返奖500，虚拟1000金币','S1消费金币显示-50'],
 ['admin-live-management.html','主播收益：','场次列表主播收益','场次普通100、定制200、门票50、幸运价值1000且比例1%，虚拟2000金币','主播收益显示360金币'],
 ['admin-live-detail.html','观众人数：','场次详情观众去重','真实用户甲进入3次、乙1次，无其他观众','观众人数显示2'],
 ['admin-guild-detail.html','累计收益：','公会旗下主播收益合计','旗下甲累计收益100、乙200金币，无其他主播收益','累计收益显示300金币'],
 ['admin-consumption-order.html','消费金币：','消费订单原始扣减','幸运礼物成交单价10金币、数量3、返奖50金币','消费金币显示30金币'],
 ['admin-consumption-order.html','用户净消耗：','幸运订单净消耗','幸运订单扣减30金币、实际返奖50金币','用户净消耗显示-20金币'],
 ['admin-consumption-order-detail.html','幸运礼物返奖：','独立开奖返还汇总','当前幸运订单3次开奖分别返还0、5、50金币','幸运礼物返奖显示55金币'],
 ['admin-refund-order.html','退款金额：','退款记录实付全额','原订单成功实付8USD、标价10USD，已完成全额退款','退款金额显示8USD'],
 ['admin-settlement-record.html','主播人数：','导入批次主播人数','已导入有效批次包含甲H001和乙H002两名主播','主播人数显示2'],
 ['admin-settlement-record.html','分成总金额：','主播导入批次金额合计','有效明细甲12.30USD、乙20.20USD，无其他明细','分成总金额显示32.50USD'],
 ['admin-guild-settlement-record.html','公会数量：','导入批次公会数量','有效导入明细为公会G001及G002','公会数量显示2'],
 ['admin-guild-settlement-record.html','分成总金额：','公会导入批次金额合计','有效公会明细G001为12.30USD、G002为20.20USD','分成总金额显示32.50USD'],
 ['admin-guild-account-balance.html','账户余额：','公会财务余额计算','当前公会分成入账100USD、正修正10USD、负修正20USD','账户余额显示90.00USD'],
 ['admin-data-overview.html','新用户充值金额：','概览新用户实付金额','甲9月15日注册当日充值8USD，乙14日注册15日充值2USD；范围仅15日','新用户充值金额显示8USD'],
 ['admin-daily-statistics.html','活跃 / 新增用户：','每日活跃用户去重','统计日甲启动3次、乙从后台回前台2次，游客1次','活跃用户显示2'],
 ['admin-daily-statistics.html','活跃 / 新增用户：','每日新增注册用户','统计日甲乙完成注册，丙只打开注册页','新增用户显示2'],
 ['admin-daily-statistics.html','总充值金额 / 人数：','每日成功实付充值','甲成功8USD、乙成功2USD、丙失败10USD','总充值金额显示10USD'],
 ['admin-daily-statistics.html','总充值金额 / 人数：','每日成功充值去重','甲成功2笔、乙成功1笔、丙仅失败','充值人数显示2'],
 ['admin-daily-statistics.html','新用户充值人数 / 金额：','每日新用户充值人数','当日注册甲成功2笔、乙成功1笔；昨日注册丙今日成功1笔','新用户充值人数显示2'],
 ['admin-daily-statistics.html','新用户充值人数 / 金额：','每日新用户充值金额','当日注册甲成功8USD、乙成功2USD；昨日注册丙今日成功20USD','新用户充值金额显示10USD'],
 ['admin-daily-statistics.html','开播人数：','每日开播人数去重','甲成功开播3场、乙1场，丙只进入预览未开播','开播人数显示2'],
 ['admin-daily-statistics.html','达成有效天主播：','每日有效天人数','甲有效直播179分钟、乙180分钟、丙360分钟','达成有效天主播显示2'],
 ['admin-daily-statistics.html','退款订单数 / 金额：','每日完成退款单数','当日完成A与B退款，C仅申请未完成，D昨日完成','退款订单数显示2'],
 ['admin-user-active-statistics.html','新用户：','新登录用户当日注册口径','当日甲注册且成功登录两次；乙前日注册今日登录；丙今日注册未登录','新用户显示1'],
 ['admin-host-statistics.html','开播人数 / 场次：','主播报表开播人数','甲成功开播2场、乙1场，丙开播失败','开播人数显示2'],
 ['admin-host-statistics.html','开播人数 / 场次：','主播报表开播场次','甲成功开播2场、乙1场，丙开播失败','开播场次显示3'],
 ['admin-host-statistics.html','有效天达标人数：','主播报表达标人数','甲累计180分钟、乙179分钟、丙181分钟','有效天达标人数显示2'],
 ['admin-host-statistics.html','开播时长中位数：','主播时长偶数中位','有效场次时长10、20、40、100分钟','开播时长中位数显示30分钟'],
 ['admin-host-live-record-report.html','时长：','场次明细起止时长','目标场次9月15日10:00开始、11:30结束','时长显示1小时30分钟'],
 ['admin-host-live-record-report.html','观众人数：','场次报表真实观众去重','甲真实用户进3次、乙1次，运营账号进1次','观众人数显示2'],
 ['admin-recharge-statistics.html','充值金币：','每日充值基础金币','成功订单A基础100赠送20，B基础200赠送30；失败订单基础500','充值金币显示300'],
 ['admin-recharge-statistics.html','消费金币：','每日净消费统计','普通100、定制200、门票50、幸运扣减100返奖500金币','消费金币显示-50'],
 ['admin-monthly-income-expense.html','收益：','月度实际主播收益','当月普通100、定制200、门票50、幸运主播收益10，虚拟赠礼1000金币','收益显示360金币'],
 ['admin-monthly-host-share.html','直播场次：','主播业绩范围场次','范围内甲成功3场，失败1次；范围外成功2场','直播场次显示3'],
 ['admin-monthly-host-earnings.html','普通 / 定制收益：','打赏明细成功收益','普通礼物成交10金币成功3份，失败2份','该礼物收益显示30金币'],
 ['admin-monthly-gift-sales.html','销量：','礼物销售成功份数','目标礼物成功订单A3份、B2份，失败4份，虚拟10份','销量显示5份'],
 ['admin-operation-accounts.html','账户余额：','后台运营虚拟币余额','账号O001累计成功发放1000、消费200，失败发放50','账户余额显示800金币'],
 ['admin-operation-accounts.html','本月发放：','后台运营本月发放','O001本月成功发放100、失败50，上月成功200','本月发放显示100金币'],
 ['admin-operation-account-detail.html','发放后余额 =','运营账号单笔发放余额','成功发放记录前余额100、本次发放50金币','发放后余额显示150金币'],
 ['admin-operation-account-detail.html','送礼记录：','运营详情消费金额','成功赠礼记录单价10金币、数量3','消费金币显示30金币'],
 ['admin-operation-issue-records.html','发放后余额：','发放明细余额勾稽','记录A发放前100金币、本次发放50金币','发放后余额显示150金币'],
 ['admin-operation-gift-records.html','消费金币：','后台虚拟赠礼金额','记录A单价10金币、数量3，当前礼物已改价20金币','消费金币显示30金币'],
 ['admin-operation-guild-controls.html','本月累计已发放：','公会额度页已发放','本公会本月成功给甲100、乙200金币；失败50，上月500','本月累计已发放显示300金币'],
])ad(page,ref,`核对${point}的独立计算口径`,point,fixture,result);

for(const [page,ref,point,fixture,result,role='普通用户']of [
 ['host-ranking.html','主播：','主播榜账号身份','排名记录属于甲H001，头像A、昵称QA甲、当前主播等级3且正在直播','甲的排名行展示QA甲及头像A'],
 ['host-ranking.html','主播：','主播榜开播状态','甲正在直播，乙已下播','甲显示当前开播状态'],
 ['contribution-ranking.html','用户：','贡献榜用户身份','排名记录甲U001昵称QA甲、头像A、服务端财富等级3','甲的排名行展示QA甲及头像A'],
 ['contribution-ranking.html','用户：','贡献榜财富等级来源','甲服务端财富等级3、主播等级5','甲财富等级显示3'],
 ['search-results.html','用户头像、昵称：','搜索结果当前资料','目标U001昵称由QA旧名改成QA新名，头像A；当前结果包含U001','U001结果显示QA新名及头像A'],
 ['search-results.html','非主播不显示','非主播搜索房间号','结果U001为普通用户，尚无主播身份','U001不显示房间号'],
 ['search-results.html','有主播身份时显示房间号','主播搜索房间号','结果H001为主播，长期房间号R001，当前场次号S001','H001显示房间号R001'],
 ['welfare-center.html','任务项：','任务配置名称','当前生效任务四语名已配置，中文名QA观看；App当前中文','任务名称显示QA观看'],
 ['welfare-center.html','任务项：','任务当前进度与目标','当前任务观看目标30分钟，服务端有效进度20分钟','任务进度显示20/30'],
 ['welfare-center.html','任务项：','任务配置奖励金额','当前任务该档奖励20金币，另一个档位奖励50金币','该档奖励显示20金币'],
 ['all-tasks.html','任务进度：','全部任务进度','观看任务当前有效进度20分钟、目标30分钟','观看任务显示20/30'],
 ['all-tasks.html','奖励：','全部任务奖励','赠礼任务当前档位奖励20金币，尚未领取','该档金币奖励显示20'],
 ['invite-friends.html','邀请记录：','邀请记录好友信息','当前账号成功邀请甲，甲昵称QA甲、邀请日期9月15日','甲记录显示QA甲及9月15日'],
 ['follower-list.html','粉丝头像 / 昵称：','粉丝账号当前资料','甲U001仍关注当前账号，昵称QA甲、头像A','甲的粉丝行显示QA甲及头像A'],
 ['follower-list.html','等级：','粉丝列表财富等级','甲服务端财富等级3、主播等级5，仍关注当前账号','甲等级显示财富等级3'],
 ['follower-list.html','勋章：','粉丝列表当前勋章','甲的账号资料当前显示勋章A，B不在其当前展示数据中','甲的勋章区域展示A'],
 ['my-following.html','关注账号：','关注列表当前资料','当前账号关注甲，甲昵称QA甲、头像A','甲行显示QA甲及头像A'],
 ['my-following.html','场次结束后立即更新','关注列表下播同步','关注列表已打开且曾显示甲在播S1；配合主播甲刚结束S1，当前用户未手动刷新页面','甲的开播状态更新为未开播'],
 ['my-decoration.html','当前头像 / 勋章：','装扮页当前佩戴','当前用户头像A，已佩戴有效装扮勋章B','顶部展示头像A及已佩戴勋章B'],
 ['live-room.html','在线人数：','观众视角实时在线人数','当前场次服务端在线人数为2，累计访问次数为5','在线人数显示2'],
 ['live-room-host.html','在线人数：','主播视角实时在线人数','当前场次服务端在线人数为2，累计访问次数为5','在线人数显示2','主播'],
 ['live-room-host.html','待处理连麦邀请：','当前有效连麦邀请数量','当前有甲乙2个有效待处理邀请，丙邀请已取消','待处理连麦邀请显示2','主播'],
 ['live-room-cohost-active.html','连麦主播：','连麦参与主播身份','主播甲H001与乙H002已成功连麦，无第三位主播','连麦画面固定对应甲和乙','主播'],
 ['live-room-cohost-active.html','连麦状态：','有效连接状态','甲乙均在播且连麦连接有效','连麦状态显示连麦中','主播'],
 ['live-end-viewer.html','主播头像 / 名称：','结束页主播归属','已结束场次S1属于主播甲，甲头像A昵称QA甲，乙仍在其他房直播','结束页展示QA甲及头像A'],
 ['live-end-viewer.html','直播结束状态：','观众下播提示','QA甲的当前场次S1已结束','显示QA甲的直播已结束'],
 ['live-end-viewer.html','结束提示：','结束页整理提示','当前场次已经结束，主播未开启新场次','显示主播正在整理本场内容'],
 ['live-end-host.html','直播时长：','主播结算页场次时长','当前场次有效直播90分钟后结束','直播时长显示1小时30分钟','主播'],
 ['live-end-host.html','观看人数：','结束页累计进入人次','本场甲成功进入3次，乙1次，只有这4次成功进入','观看人数显示4','主播'],
 ['friend-list.html','好友头像 / 昵称：','好友当前资料','甲为当前有效双向好友，昵称QA甲、头像A','甲的好友行显示QA甲及头像A'],
 ['friend-list.html','等级：','好友财富等级','好友甲财富等级3、主播等级5','好友甲财富等级显示3'],
 ['friend-list.html','勋章：','好友当前勋章','好友甲的账号资料当前显示勋章A，B不在其当前展示数据中','好友甲显示勋章A'],
 ['fan-group-chat.html','群消息：','群消息发送人','主播甲的粉丝群中成员乙发送消息QA消息，当前账号有群籍','QA消息的发送人显示乙','粉丝团成员'],
 ['fan-group-chat.html','直播卡片：','群直播卡片场次快照','群内分享卡片对应S1，主播已结束S1后开启S2','卡片仍对应S1','粉丝团成员'],
 ['group-manage-member.html','群公告：','成员查看当前群公告','当前有甲主播的粉丝团团籍，群公告最新内容QA公告','群公告显示QA公告','粉丝团成员'],
 ['chat-settings.html','聊天对象：','私信设置对象身份','由与甲U001的私信进入设置，甲昵称QA甲、头像A','聊天对象显示QA甲及头像A'],
 ['blacklist-management.html','黑名单用户：','黑名单账号资料','当前账号主动拉黑甲，甲昵称QA甲、头像A','甲的黑名单行显示QA甲及头像A'],
 ['guild-management.html','公会头像 / 名称 / ID：','公会选择页对象身份','有效公会G001名称QA公会、头像A，已在当前配置范围','G001卡片显示QA公会及头像A'],
 ['guild-management.html','公会简介：','公会简介正文','G001当前简介为QA简介，文字未超过单行','G001简介显示QA简介'],
 ['guild-management.html','主播人数：','公会当前主播人数','公会G001当前3名在会主播，另有1名已退会及1名待审普通用户','主播人数显示3'],
 ['guild-application-form.html','申请公会：','入会表单目标公会','从QA公会G001点击申请进入，另有其他公会G002','申请公会显示QA公会'],
 ['guild-application-records.html','公会头像：','公会申请记录头像','当前账号申请过G001，公会当前头像A','G001申请卡片显示头像A'],
 ['guild-application-records.html','公会名称：','公会申请记录当前名称','已申请G001，公会名称由QA旧名改为QA新名','申请卡片公会名称显示QA新名'],
 ['guild-application-records.html','公会 ID：','公会申请记录唯一标识','当前账号向G001申请过，另有同名G002','目标申请卡片公会ID显示G001'],
 ]){
 const pre=[`已以${role}登录，并打开${pages.get(page).registeredName}中下述业务对象`,fixture];
 const steps=[`查看|当前${pages.get(page).registeredName}页`];
 test(page,[ref],role,`核对${point}`,point,pre,steps,result,P2);
}

const welfare='welfare-center.html';
for(const kind of ['签到','任务']){
 const pre=kind==='签到'?'今日未签到；有效签到档位奖励20金币':'任务今日已达成，当前时间早于23:59；该档奖励20金币尚未领取';
 test(welfare,['领取成功后更新领取记录、钱包金币余额及金币流水'],'普通用户',`${kind}奖励增加钱包余额`,`${kind}奖励到账金币`,[pre,'领取前金币余额100；期间没有其他资产变动'],[enter(welfare),`点击|${kind==='签到'?'签到':'对应任务领取'}`,enter('profile.html')],'金币余额 = 120',{...P1,observe:'profile.html',extra:[['profile.html','金币余额：']],transition:'ST-task-claim',calc:calculation('领取前余额+奖励',{领取前余额:100,奖励:20},{运算:'+',参数:[{变量:'领取前余额'},{变量:'奖励'}]},120)});
 test(welfare,['领取成功后更新领取记录、钱包金币余额及金币流水'],'普通用户',`${kind}领奖生成金币流水`,`${kind}奖励流水`,[pre,'本次奖励20金币尚无入账流水'],[enter(welfare),`点击|${kind==='签到'?'签到':'对应任务领取'}`,enter('balance-detail.html')],`新增本次${kind}奖励的+20金币流水`,{...P1,observe:'balance-detail.html',extra:[['balance-detail.html','任务等奖励只展示流水信息']],transition:'ST-task-claim'});
}
test(welfare,['奖励仅为金币，不自动发放'],'普通用户','任务达成但未领取时不增加金币','任务手动领取前余额',['当前金币100；本次任务已达成20金币奖励但从未领取，期间无其他资产变动'],[enter('profile.html')],'金币余额仍为100',{...P1,observe:'profile.html',extra:[['profile.html','金币余额：']]});
test(welfare,['重复点击或重试不得重复入账'],'普通用户','重复点击已达成奖励只入账一次','任务领奖幂等余额',['金币余额100；任务20金币奖励今日已达成未领取；环境准备：可模拟两次相同领奖请求，执行前须提供请求重放能力'],[enter(welfare),'点击|领取|连续两次',enter('profile.html')],'金币余额 = 120',{...P1,observe:'profile.html',extra:[['profile.html','金币余额：']],calc:calculation('领取前余额+一次奖励',{领取前余额:100,一次奖励:20},{运算:'+',参数:[{变量:'领取前余额'},{变量:'一次奖励'}]},120)});
test('balance-detail.html',['任务等奖励只展示流水信息'],'普通用户','查看未关联订单的任务奖励流水','任务奖励流水查看范围',['余额明细已有任务奖励20金币流水，未关联充值或支出订单'],[enter('balance-detail.html'),'点击|该任务奖励流水'],'展示该任务的奖励流水信息',P1);

for(const page of ['account-password-change.html','account-password-reset.html'])for(const valid of [true,false])test(page,['新密码立即生效，旧密码不可再用于登录'],'未登录用户',`${page.includes('reset')?'重置':'修改'}密码后使用${valid?'新':'旧'}密码登录`,`${page.includes('reset')?'重置':'修改'}后的密码有效性`,['账号qa.member@example.com已绑定且正常；原密码QaOld!2026',page.includes('reset')?'刚通过绑定邮箱的有效验证码完成忘记密码流程，新密码为QaNew!2026；当前已经退出登录':'刚通过原密码验证完成修改密码流程，新密码为QaNew!2026；当前已经退出登录','两份登录协议已勾选'],[enter('auth-email-login.html'),'切换|密码登录','填写|邮箱|为qa.member@example.com',`填写|密码|为${valid?'QaNew!2026':'QaOld!2026'}`,'点击|继续'],valid?'进入首页':'不进入登录成功后的首页',{...P1,observe:'auth-email-login.html',extra:[['auth-email-login.html','登录成功 -> 进入首页']]});

const common=new Map(units.filter(u=>u.原文.includes('**COMMON-')).map(u=>[u.原文.match(/\*\*(COMMON-[^*]+)\*\*/)[1],u.原文]));
for(const [page,fragment,role,field,source,result]of [
 ['balance-detail.html','发生时间：','普通用户','流水发生时间','COMMON-user-1','08/12/2026 14.30'],
 ['guild-notification-detail.html','发送时间：','公会长','通知发送时间','COMMON-guild-1','08/12/2026 14.30'],
 ['guild-share-ledger.html','分成时间：','公会长','主播分成入账时间','COMMON-guild-1','08/12/2026 14.30'],
 ['admin-user-list.html','注册时间：','平台管理员','用户注册时间','COMMON-admin-1','8/12/2026 14.30'],
 ])test(page,[fragment],role,`${field}采用本端日期时间格式`,`${field}格式`,['测试记录对应的页面本地时间为2026年12月8日14时30分；有权访问本记录'],[enter(page),`查看|该记录的${field}`],`${field}显示${result}`,{...P2,commonEvidence:[common.get(source)]});
for(const [page,fragment,role,source,field]of [
 ['invite-friends.html','邀请记录：','普通用户','COMMON-user-1','邀请日期'],
 ['guild-leave-review-detail.html','加入时间：','公会长','COMMON-guild-1','加入日期'],
 ])test(page,[fragment],role,`${field}为纯日期时不附加时间`,`${field}纯日期格式`,['当前记录的对应日期为2026年12月8日；有权访问该记录'],[enter(page),`查看|该记录的${field}`],`${field}显示08/12/2026且不附加时间`,{...P2,commonEvidence:[common.get(source)]});
test('admin-host-balance-change-record.html',['不得为 0，最多两位小数','校验'],'平台管理员','后台用逗号输入小数修正金额','后台逗号小数输入',['有主播余额修正权限；目标主播原余额20USD'],[enter('admin-host-balance-change-record.html'),'点击|余额变更','填写|变更金额|为10,40','填写|备注|为QA逗号小数校验','点击|确认'],'变更后余额 = 30.4',{...P1,commonEvidence:[common.get('COMMON-admin-2')],calc:calculation('变更前余额+有符号变更金额',{变更前余额:20,变更金额:10.4},{运算:'+',参数:[{变量:'变更前余额'},{变量:'变更金额'}]},30.4,'USD')});
test('admin-user-detail.html',['基础资料：'],'平台管理员','后台用户手机号无脱敏例外时完整展示','后台手机号默认显示范围',['有用户资料查看权限；测试账号手机号+628123456789；本字段没有额外脱敏约定'],[enter('admin-user-detail.html'),'查看|该账号手机号'],'手机号完整显示+628123456789',{...P2,commonEvidence:[common.get('COMMON-admin-2')]});

for(const page of ['guild-host-list.html','guild-messages.html','guild-operation-account-detail.html','guild-host-data.html','guild-share-ledger.html','guild-all-violations.html'])for(const day of [9,16])g(page,['日期范围：'],`${pages.get(page).registeredName}排除${day<10?'开始日前':'结束日后'}记录`,'日期范围外记录排除',[`可访问的记录A属于2026年9月${day}日，B属于9月12日；其他筛选均包含A和B`],[enter(page),'选择|日期范围|为2026年9月10日至9月15日'],'筛选结果不包含记录A',P1);
for(const day of [10,15])g('guild-all-violations.html',['日期范围：'],`违规记录包含${day===10?'开始日':'结束日'}`,'违规日期边界包含',[`违规记录A的业务发生日为2026年9月${day}日；其他条件包含A`],[enter('guild-all-violations.html'),'选择|日期范围|为2026年9月10日至9月15日'],'筛选结果包含记录A',P1);
for(const [page,fragment,choices]of [
 ['guild-host-list.html','快捷日期：','今日、昨日、本周、上周、本月、上月、自定义'],
 ['guild-messages.html','快捷日期：','本周、本月、自定义'],
 ['guild-operation-account-detail.html','快捷日期：','今日、昨日、本周、上周、本月、上月、自定义'],
 ['guild-host-data.html','快捷日期：','今日、昨日、本周、上周、本月、上月、自定义'],
 ['guild-share-ledger.html','快捷日期：','今日、昨日、本周、上周、本月、上月、自定义'],
 ['guild-host-summary.html','日数据 / 月数据：','本周、上周、本月、上月、自定义'],
 ['guild-income.html','月范围：','近半年、近一年、自定义'],
 ])g(page,[fragment],`${pages.get(page).registeredName}显示已定义日期选项`,`${pages.get(page).registeredName}日期选项`,[page==='guild-income.html'?'当前选择月数据':'当前处于对应日期筛选视图'],[enter(page),'点击|日期范围选择'],`可选范围为${choices}`,P2);
for(const state of ['待审核','已通过','已驳回'])g('guild-leave-review.html',['状态：'],`退会列表显示${state}结果`,'退会列表申请状态',[`申请A当前${state}；当前Tab包含A`],[enter('guild-leave-review.html')],`A状态显示${state}`,P1);
g('guild-leave-review-detail.html',['通过 -> 立即结束'],'公会通过退会后直接形成终审结果','退会通过不再等待平台',['本次退会申请待公会审核'],[enter('guild-leave-review-detail.html'),'点击|通过','点击|确认'],'本次退会状态显示已通过',{...P1,extra:[['guild-leave-review.html','不进入平台终审']],transition:'ST-leave-pass'});
for(const [metric,expected]of [['主播收益','300金币'],['开播人数','2人'],['达标人数','1人']])g('guild-host-list.html',['均随选中日期变化'],`更换业绩日期后更新${metric}`,`业绩日期切换${metric}`,['测试当前日9月16日；15日甲完成180分钟收益100、乙完成60分钟收益200；16日另有丙业绩；当前筛选今日'],[enter('guild-host-list.html'),'选择|快捷日期|为昨日'],`${metric}显示${expected}`,P1);
for(const split of [false,true])g('guild-host-list.html',['自然日累计直播时长达到 3 小时'],`${split?'跨日':'同日'}两场累计三小时的达标人数`,'有效天自然日累计',['当前统计9月14日至15日，仅主播甲有完成场次',split?'甲14日120分钟，15日60分钟':'甲15日先完成120分钟，再完成60分钟'],[enter('guild-host-list.html')],`达标人数显示${split?0:1}人`,P1);
g('guild-host-detail.html',['平台锁定或已退会时不可修改'],'退会主播不能修改公会开播权限','退会后的公会权限操作',['主播甲已从当前公会退出；通过历史业绩进入甲主页'],[enter('guild-host-detail.html')],'没有可修改的直播权限开关',P1);
g('guild-message-compose.html',['对象类型：'],'公会消息接收范围只含两类','公会消息接收类型',[],[enter('guild-message-compose.html'),'点击|对象类型'],'可选类型仅全体主播或指定1名当前公会主播',P2);
g('guild-operation-account-detail.html',['按自然日汇总该账号虚拟金币消费'],'运营账号日期行汇总同日虚拟消费','运营账号单日消费汇总',['当前账号15日两笔成功消费100和200金币，16日成功消费500；所选范围包含两日'],[enter('guild-operation-account-detail.html')],'15日消费金币显示300',P1);
for(const [point,result]of [['汇总','总消费金币显示100'],['列表','列表仅显示甲的成功赠礼记录']])g('guild-operation-gift-records.html',['筛选变化 -> 刷新汇总和列表'],`运营账号筛选后更新送礼${point}`,`账号筛选送礼${point}`,['同一日期范围内甲成功消费100、乙成功消费200；当前选择全部账号'],[enter('guild-operation-gift-records.html'),'点击|运营账号筛选','选择|仅账号甲','点击|完成'],result,P1);
for(const [page,ref,entity]of [['guild-profile.html','公会名称：','公会'],['guild-host-detail.html','头像 / 名称：','主播']])test('guild-settings.html',['不修改公会或主播资料'],'公会长',`切换公会端语言不修改${entity}名称`,`语言切换后的${entity}资料`,[`当前${entity}名称QA甲；当前界面语言中文`],[enter('guild-settings.html'),'点击|语言','选择|English',enter(page)],`${entity}名称仍为QA甲`,{...P1,observe:page,extra:[[page,ref]]});
for(const page of ['guild-host-data.html','guild-share-ledger.html']){
 g(page,['默认全部'],`${pages.get(page).registeredName}默认全部主播`,'主播筛选默认范围',[],[enter(page)],'主播筛选默认为全部',P2);
 g(page,['保留日期条件'],`${pages.get(page).registeredName}多选回填保留日期`,'主播多选回填后的日期',['当前筛选2026年9月1日至15日；公会有甲乙丙3名可选主播'],[enter(page),'点击|主播筛选','选择|主播甲','选择|主播乙','点击|完成'],'日期仍为2026年9月1日至15日',{...P1,extra:[['guild-violation-host-select.html','完成后返回']]});
 g(page,['支持多选'],`${pages.get(page).registeredName}显示回填主播范围`,'主播多选回填对象',['公会有甲乙丙3名可选主播'],[enter(page),'点击|主播筛选','选择|主播甲','选择|主播乙','点击|完成'],'主播筛选仅选中甲和乙',{...P1,extra:[['guild-violation-host-select.html','回填主播']]});
}
g('guild-host-data.html',['收益：本场计入主播收益'],'公会场次收益计入门票实际消费','公会场次门票收益',['S1真实用户普通礼物消费100金币、门票消费20金币，无幸运礼物、虚拟金币及失败消费'],[enter('guild-host-data.html')],'S1收益显示120金币',{...P1,commonEvidence:['|门票|主播收益等于用户购买门票实际消费的金币|']});
g('guild-live-gift-detail.html',['金币：本次礼物消费金币'],'点击赠礼金币查看本笔消费','赠礼金币下钻记录',['当前场次记录R1单价10、数量4，另有不同金额的R2'],[enter('guild-live-gift-detail.html'),'点击|R1金币'],'详情的本次消费金币显示40',P1);
for(const [point,result]of [['结果人数','结果人数显示1'],['已选人数','已选人数显示2']])g('guild-violation-host-select.html',['结果人数 / 已选人数：'],`主播多选搜索后核对${point}`,`主播多选${point}`,['已经选中甲乙，当前搜索甲仅命中甲'],[enter('guild-violation-host-select.html')],result,P2);
g('guild-income.html',['日期：对应自然日'],'公会日数据按自然日分行','公会业绩日期行',['9月14日两场、15日三场；所选范围包含两日；已切换日数据'],[enter('guild-income.html')],'14日和15日分别形成各自日期行',P2);
g('guild-income.html',['月份：对应自然月'],'公会月数据按自然月分行','公会业绩月份行',['8月和9月各有多场直播；所选月份包含两月；已切换月数据'],[enter('guild-income.html')],'8月和9月分别形成各自月份行',P2);
for(const [tab,fragment,range]of [['日数据','所选日期范围内全部主播计入收益','9月14日至15日'],['月数据','所选月份范围内计入收益','8月至9月']])g('guild-income.html',[fragment],`${tab}公会收益限定当前筛选范围`,`公会${tab}收益汇总`,[`当前${tab}范围${range}，范围内主播甲收益100、乙200，范围外另有500；实际线下分成另有20美元`],[enter('guild-income.html')],'公会收益显示300金币',P1);
for(const status of ['已开播','未开播'])g('guild-income-day-detail.html',['切换开播状态 -> 更新列表'],`每日业绩切换${status}列表`,'每日开播状态筛选',['当前选中9月15日，甲当日开过播、乙未开播'],[enter('guild-income-day-detail.html'),`切换|${status}`],`列表仅显示${status==='已开播'?'甲':'乙'}`,P1);
g('guild-income-day-detail.html',['进入主播数据并带入当前日期'],'每日页进入主播数据保留业务日期','每日主播数据下钻日期',['当前查看9月15日，甲在当前列表'],[enter('guild-income-day-detail.html'),'点击|主播甲'],'主播数据页筛选为甲及9月15日',P1);
for(const valid of [true,false])test('guild-password.html',['校验成功后更新密码'],'公会长',`公会修改密码后使用${valid?'新':'旧'}密码登录`,'公会改密后的凭证有效性',['公会和qa-chief账号启用；刚成功将密码由QaOld!2026改为QaNew123，已经退出登录'],[enter('guild-login.html'),'填写|公会账号|为qa-chief',`填写|密码|为${valid?'QaNew123':'QaOld!2026'}`,'点击|登录'],valid?'进入选择公会页':'提示“账号或密码错误”',{...P1,observe:'guild-login.html',extra:[['guild-login.html','登录校验通过']]});
for(const [page,ref,point,fixture,result]of [
 ['guild-notifications.html','摘要：','通知摘要处理结果','甲的入会申请刚被平台驳回，对应结果通知已生成','该通知摘要表达甲的入会申请已被平台驳回'],
 ['guild-notifications.html','摘要：','通知摘要待处理数量','当前业务通知的待处理数量为3','该通知摘要显示待处理数量3'],
 ['guild-notifications.html','时间：','通知列表生成时点','通知N于9月15日10:00生成，9月16日查看','N时间对应9月15日10:00'],
 ['guild-join-review-detail.html','节点时间：','入会提交节点时间','A于9月14日10:00提交，公会尚未审核','用户提交节点时间对应9月14日10:00'],
 ['guild-join-review-detail.html','节点时间：','入会平台完成节点时间','公会9月14日通过，平台9月15日11:00通过','平台审核节点时间对应9月15日11:00'],
 ['guild-member-list.html','加入时间：','成员关系生效日','甲旧关系已结束，本次于9月15日加入当前公会','甲加入时间对应本次9月15日'],
 ['guild-operation-accounts.html','名称 / 账号 ID：','运营列表当前名称','O001当前名称QA运营甲，登录名另为LoginA','O001名称显示QA运营甲'],
 ['guild-operation-account-select.html','头像 / 名称 / 登录账号：','运营多选账号资料','运营账号O001当前名称QA运营甲、头像A、登录账号LoginA','选项显示QA运营甲及头像A'],
 ['guild-operation-account-select.html','结果数量 / 已选数量：','运营多选搜索结果数','公会共3个运营账号，已选2个，当前搜索只命中甲','搜索结果数量显示1'],
 ['guild-host-data.html','主播名称 / 主播 ID：','单主播范围身份标识','当前只选择甲H001，列表包含甲多个场次','顶部主播标识显示甲H001'],
 ['guild-host-data.html','开播时间：','场次列表开播时点','S1在9月15日10:00开始、11:00结束','S1开播时间对应9月15日10:00'],
 ['guild-live-gift-detail.html','直播主题 / 场次 ID：','场次详情直播标题','当前进入S1，其开播标题QA首场；该主播新场S2标题QA次场','详情直播主题显示QA首场'],
 ['guild-live-gift-detail.html','用户名称 / 用户 ID：','赠礼人真实身份','R1由甲U001向主播乙H002赠送，甲昵称QA观众','R1赠送用户显示QA观众及U001'],
 ['guild-all-violations.html','违规主播 / 违规账号：','违规记录被处置对象','N处罚甲H001，举报人乙U002','N违规对象显示甲H001'],
 ['guild-income-day-detail.html','日期 / 历史标记：','当日经营日期值','当前进入9月15日经营详情，今天为9月16日','业务日期显示9月15日'],
 ['guild-income-day-detail.html','日期 / 历史标记：','今日经营无历史标记','当前进入今日经营详情','不显示历史标记'],
 ['guild-income-day-detail.html','已开播 / 未开播及人数：','每日已开播人数','当日甲两场、乙一场、丙未开播','已开播人数显示2'],
 ['guild-income-day-detail.html','已开播 / 未开播及人数：','每日未开播人数','当日甲已开播，乙丙未开播','未开播人数显示2'],
 ['guild-income-day-detail.html','直播时长 / 有效天状态：','每日累计直播时长','主播甲当日两场累计210分钟，当前已开播列表','甲直播时长显示3小时30分钟'],
 ['guild-income-day-detail.html','直播中：','今日在播人数','甲已结束一场，乙丙当前正在直播；当前日期为今日','直播中显示2人'],
 ])g(page,[ref],`核对${point}`,point,[fixture],[enter(page)],result,P2);
for(const minutes of [179,180,181])g('guild-income-day-detail.html',['直播时长 / 有效天状态：'],`每日详情累计${minutes}分钟的有效天状态`,'每日主播有效天边界',[`甲当日已完成场次累计${minutes}分钟；当前已开播列表`],[enter('guild-income-day-detail.html')],`甲有效天状态显示${minutes>=180?'达标':'未达标'}`,P1);
for(const [page,ref,title,pre,result,point]of [
 ['guild-operation-accounts.html','本月剩余可发：','公会剩余额度按上限减已发','公会本月上限1000，成功发放300，失败发放100','本月剩余可发显示700金币'],
 ['guild-operation-accounts.html','本月剩余可发：','降低公会额度后剩余不为负','公会本月已发1000，后台当前将上限调整为800','本月剩余可发显示0金币'],
 ['guild-share-income.html','不提供日期筛选或在线分成计算','公会分成记录没有未定义日期筛选','已有当前公会上传结果','本页不提供日期筛选'],
 ['guild-share-income.html','不提供日期筛选或在线分成计算','公会分成记录没有在线计算','已有当前公会上传结果','本页不提供在线分成计算操作'],
 ['guild-share-income.html','分成时间与收益所属周期可以跨月','公会分成跨月按入账时间展示','8月收益的财务结果在9月15日入账','分成时间对应9月15日'],
 ].map((row,i)=>[...row,['公会月度可发余额','公会额度下调后的余额下限','公会财务记录筛选入口','公会财务记录计算入口','跨月分成的入账日期'][i]]))g(page,[ref],title,point,[pre],[enter(page)],result,P1);
for(const [field,max]of [['公会名称',40],['公会简介',200]])g('guild-profile.html',[`${field}：`],`${field}达到${max}字仍可保存`,`${field}合法上边界`,['当前公会Logo有效，其他资料均有效'],[enter('guild-profile.html'),`填写|${field}|为${max}个A`,'点击|保存','刷新|当前公会资料页'],`${field}完整保留${max}个A`,P1);

for(const [pre,result,label]of [
 ['当前账号管理A和B，正在A中','B显示选择入口','其他公会入口'],
 ['公会A仍启用，但当前账号正在管理B','A不显示当前公会标记','当前与启用状态区分'],
 ])g('guild-switch.html',['当前公会：'],`选择公会区分${label}`,`公会选择${label}`,[pre],[enter('guild-switch.html')],result,P2);
g('guild-login.html',['账号或密码错误 -> 停留当前页'],'错误密码登录后停留公会登录页','登录失败页面保持',['账号qa-chief启用且正确密码QaChief!2026'],[enter('guild-login.html'),'填写|公会账号|为qa-chief','填写|密码|为Wrong!2026','点击|登录'],'仍显示公会登录页',P1);
for(const refund of [0,1000])g('guild-home.html',['返奖不影响主播收益'],`首页幸运收益排除返奖${refund}`,'首页幸运收益与返奖独立',[`本日仅有真实幸运赠礼1000金币，后台收益比例2%，返奖${refund}金币`],[enter('guild-home.html')],'当日收益显示20金币',P1);
g('guild-notifications.html',['关闭或恢复直播权限'],'公会收到平台关闭主播权限通知','平台关权公会通知',['环境准备：平台刚关闭本公会甲主播直播权限，通知已生成'],[enter('guild-notifications.html')],'列表出现甲的直播权限关闭通知',P1);
g('guild-notification-detail.html',['有关联记录且有权限时显示'],'无关联记录的通知不提供业务入口','通知关联对象前提',['通知N只有平台公告正文，不关联业务记录'],[enter('guild-notification-detail.html')],'不显示关联业务入口',P1);
for(const rejected of ['公会','平台'])g('guild-join-review-detail.html',['已处理的旧单公会审核结果只读'],`${rejected}驳回重申后旧单保持只读`,'重新申请的旧单隔离',[`旧单A已被${rejected}驳回；用户提交新单B待公会审核；当前查看旧单A`],[enter('guild-join-review-detail.html')],'旧单A的审核结果只读',P1);
g('guild-leave-review-detail.html',['处理时间 / 结果：'],'退会详情展示本次终审结果','退会处理结果回显',['当前申请A已于9月16日通过，旧申请B曾被驳回'],[enter('guild-leave-review-detail.html')],'本次A处理结果显示已通过',P1);
for(const trigger of ['公会通过退会','公会移出主播','公会关闭直播权限']){
 const page=trigger==='公会通过退会'?'guild-leave-review-detail.html':'guild-host-detail.html';
 const ref=trigger==='公会通过退会'?'通过 -> 立即结束当前直播':trigger==='公会移出主播'?'确认移出后':'关闭正在直播主播的权限';
 const steps=trigger==='公会通过退会'?['点击|通过','点击|确认']:trigger==='公会移出主播'?['点击|移出公会','点击|确认']:['禁用|直播权限','点击|确认'];
 g(page,[ref],`${trigger}后本公会场次结束`,`${trigger}场次终态`,['甲当前S1直播；账号与公会均有效，收益已结清；当前操作待确认且未锁定'],[enter(page),...steps,enter('guild-host-summary.html'),'查看|甲的在播标记'],'甲不再显示直播中标记',{...P1,observe:'guild-host-summary.html',extra:[['guild-host-summary.html','直播中']],transition:trigger==='公会通过退会'?'ST-leave-pass':trigger==='公会移出主播'?'ST-remove-host':'ST-guild-live-toggle'});
}
g('guild-host-detail.html',['收益归属截止至移出时间'],'移出主播后旧公会收益不继续增加','移出时点收益归属',['甲9月15日移出前给G001贡献100金币收益，移出后在G002另产生50金币；当前公会G001'],[enter('guild-host-list.html'),'选择|日期范围|为9月15日','查看|甲的收益'],'甲在G001本日收益显示100金币',{...P1,observe:'guild-host-list.html',extra:[['guild-host-list.html','收益']]});
g('guild-member-list.html',['搜索：'],'已退会状态和主播ID搜索取交集','成员状态与ID联合筛选',['已退会甲ID1001、在会乙ID1002；当前选择已退会'],[enter('guild-member-list.html'),'填写|搜索框|为100'],'结果只包含甲',P1);
g('guild-host-list.html',['日期变化 -> 刷新指标与列表'],'切换日期更新主播业绩列表','业绩日期变更列表内容',['9月14日仅甲有业绩、15日仅乙有业绩；当前选择14日'],[enter('guild-host-list.html'),'选择|日期范围|为9月15日'],'列表按15日业绩显示乙',P1);
g('guild-host-detail.html',['申请时间：'],'主播历史申请显示各自提交时点','申请历史提交时间',['入会单A9月14日10:00提交、9月15日处理'],[enter('guild-host-detail.html')],'A申请时间对应9月14日10:00',P2);
for(const material of ['本人照片','证件正面','证件反面'])g('guild-host-detail.html',['点击认证材料 -> 查看大图'],`主播资料点击${material}放大`,`主播认证${material}大图`,[`甲认证资料中${material}为图片A`],[enter('guild-host-detail.html'),`点击|${material}`],'打开图片A的大图',P2);
g('guild-host-detail.html',['管理操作均需确认'],'移出主播前显示确认弹窗','移出主播二次确认',['甲仍在会且收益已结清；公会有管理权限'],[enter('guild-host-detail.html'),'点击|移出公会'],'显示移出公会确认弹窗',P1);
g('guild-messages.html',['发送对象：'],'公会群发列表显示全体主播范围','运营消息全体接收范围',['消息N发送时选择全体主播，实际3名接收人'],[enter('guild-messages.html')],'N发送对象显示全体主播',P2);
g('guild-host-select.html',['完成后回填消息发送对象'],'单选主播完成后回填消息对象','运营消息单选回填',['由指定主播消息页进入，甲H001和乙H002可选'],[enter('guild-host-select.html'),'选择|主播甲','点击|完成'],'消息接收对象显示甲H001',{...P1,observe:'guild-message-compose.html',extra:[['guild-message-compose.html','指定时回填']]});
g('guild-message-compose.html',['发送对象和内容按确认时快照生成记录'],'确认发送后消息正文形成快照','发送确认时正文保存',['指定接收人甲，输入正文QA通知，尚未发送'],[enter('guild-message-compose.html'),'点击|发送','点击|确认',enter('guild-message-detail.html')],'本次消息详情正文显示QA通知',{...P1,observe:'guild-message-detail.html',extra:[['guild-message-detail.html','正文：']]});
g('guild-message-detail.html',['发送对象 / 人数：'],'指定消息详情只含实际接收人','单发消息接收快照',['N发送时仅选择甲，公会另有乙丙'],[enter('guild-message-detail.html')],'N实际接收人数显示1',P1);
g('guild-operation-account-detail.html',['账号状态开关：'],'公会禁用账号后状态变更','运营禁用状态回显',['O001启用且平台未锁定公会管理权限'],[enter('guild-operation-account-detail.html'),'禁用|账号状态开关'],'账号状态显示禁用',{...P1,transition:'ST-ops-disable'});
g('guild-operation-account-detail.html',['历史记录和余额保留'],'禁用运营账号后保留消费记录','运营停用历史保留',['O001原有9月15日100金币成功赠礼记录R1，刚被禁用'],[enter('guild-operation-account-detail.html'),'选择|日期范围|为9月15日','点击|9月15日消费'],'送礼记录仍包含R1',{...P1,observe:'guild-operation-gift-records.html',extra:[['guild-operation-gift-records.html','成功赠送记录']]});
for(const [account,guild,input,ok]of [[50,100,51,false],[100,50,51,false],[50,100,50,true],[100,50,50,true]])g('guild-operation-account-detail.html',['受账号与公会月剩余额度共同限制'],`账号剩余${account}公会剩余${guild}发放${input}`, '本次发放双额度边界',[`账号剩余${account}、公会剩余${guild}金币，账号原余额100且管理权限有效`],[enter('guild-operation-account-detail.html'),`填写|发放数量|为${input}`,'点击|发放金币'],ok?'账户余额显示150金币':'不能完成超额发放',P1);
for(const [field,result]of [['礼物名称','礼物名称显示QA玫瑰'],['主播名称','接收主播名称显示QA甲'],['普通类型','礼物类型显示普通礼物']])g('guild-operation-gift-records.html',[field==='普通类型'?'礼物类型：':field==='主播名称'?'主播名称 / 主播 ID：':'礼物名称 / 赠送时间：'],`运营送礼明细核对${field}`,`虚拟赠礼${field}`,['R1为运营账号向QA甲H001成功赠送普通礼物QA玫瑰'],[enter('guild-operation-gift-records.html'),'点击|R1'],result,P2);
for(const [field,result]of [['公会 ID','公会ID保持G001'],['公会关系','当前公会成员仍为甲和乙']])g('guild-profile.html',['不改变公会 ID 和公会关系'],`修改公会名称保留${field}`,`公会资料保存${field}保持`,['当前公会G001名称旧名、有效成员甲乙'],[enter('guild-profile.html'),'填写|公会名称|为QA新名','点击|保存',...(field==='公会关系'?[enter('guild-member-list.html')]:[])],result,{...P1,observe:field==='公会关系'?'guild-member-list.html':'guild-profile.html',extra:field==='公会关系'?[['guild-member-list.html','在会']]:[]});
g('guild-password.html',['至少 8 位'],'公会密码恰好8位可保存','公会密码合法下边界',['旧密码QaOld!2026'],[enter('guild-password.html'),'填写|当前密码|为QaOld!2026','填写|新密码|为Qa123456','填写|确认新密码|为Qa123456','点击|保存'],'返回账号设置页',P1);
for(const page of ['guild-live-gift-detail.html'])for(const [field,result]of [['礼物名称','礼物名称显示QA玫瑰'],['普通类型','礼物类型显示普通礼物']])g(page,[field==='普通类型'?'礼物类型：':'礼物名称 / 赠送时间：'],`场次赠礼详情核对${field}`,`真实赠礼${field}`,['R1为普通礼物QA玫瑰的成功赠送记录'],[enter(page),'点击|R1'],result,P2);
for(const value of ['警告','关闭场次','关闭直播权限','账号封禁'])g('guild-all-violations.html',['处理结果：'],`公会违规记录展示${value}结果`,'违规处理结果映射',[`记录N已由平台执行${value}，无其他后续处理`],[enter('guild-all-violations.html')],`N处理结果显示${value}`,P1);
g('guild-all-violations.html',['举报时间 / 发生时间：'],'公会直播违规按举报时间排序','直播违规时间来源',['直播违规甲于10:00举报11:00处理，乙10:30举报10:40处理；当前同类列表'],[enter('guild-all-violations.html')],'乙排在甲之前',P1);
for(const [kind,field,time]of [['直播间违规','举报时间','10:00'],['账号违规','发生时间','11:00']])g('guild-all-violations.html',['举报时间 / 发生时间：'],`${kind}记录使用${field}`,`${kind}时点`,[`记录N的${field}为9月15日${time}，处理时间另为12:00`],[enter('guild-all-violations.html')],`N时间对应9月15日${time}`,P2);
g('guild-all-violations.html',['默认全部'],'首次违规查询默认全部主播','违规主播初始筛选',[],[enter('guild-all-violations.html')],'主播范围默认为全部',P2);
g('guild-all-violations.html',['筛选变化 -> 刷新记录'],'只选一个主播后违规记录同步','违规主播条件生效',['甲有记录A、乙有记录B；当前选择全部'],[enter('guild-all-violations.html'),'点击|主播筛选','选择|仅主播甲','点击|完成'],'列表只包含甲的记录A',P1);
g('guild-income.html',['默认近半年'],'月数据首次展示近半年','公会月统计默认范围',[],[enter('guild-income.html'),'切换|月数据'],'月范围默认为近半年',P2);
for(const [tab,axis]of [['日数据','日期'],['月数据','月份']])g('guild-income.html',['点击指标卡片 -> 切换对应趋势'],`${tab}按${axis}呈现趋势`,'公会业绩趋势统计粒度',[`当前准备切换${tab}；范围内有至少两个${axis}的经营数据`],[enter('guild-income.html'),`切换|${tab}`,'点击|收益指标卡片'],`收益趋势按${axis}汇总`,P1);
g('guild-income.html',['点击月数据行 -> 带入月份'],'公会月业绩下钻保留月份','月业绩下钻时间范围',['当前月数据包含2026年8月记录'],[enter('guild-income.html'),'点击|2026年8月行'],'主播业绩范围为2026年8月',P1);
for(const all of [true,false])g('guild-violation-host-select.html',['全选全部主播','切换取消全选'],`主播多选${all?'全选':'取消全选'}`,'主播全量选择切换',[`当前可选甲乙丙3名，${all?'尚未选择':'全部已选中'}；搜索为空`],[enter('guild-violation-host-select.html'),`点击|${all?'全选':'取消全选'}`],`已选人数显示${all?3:0}`,P1);
g('guild-violation-host-select.html',['返回违规记录','保留其他筛选条件'],'违规主播多选回填保留日期和类型','违规多选其他条件保持',['从违规记录进入，原日期9月1日至15日且类型账号违规'],[enter('guild-violation-host-select.html'),'选择|仅主播甲','点击|完成'],'仍按9月1日至15日的账号违规筛选',{...P1,observe:'guild-all-violations.html',extra:[['guild-all-violations.html','违规范围：','日期范围：']]});
g('guild-income.html',['日范围：'],'公会日业绩显示日期选项','公会日数据筛选选项',[],[enter('guild-income.html'),'切换|日数据','点击|日期范围'],'可选本周、上周、本月、上月、自定义',P2);
for(const [action,point]of [['账号状态开关','启停'],['发放金币','发放']])g('guild-operation-account-detail.html',['不能启停或发放金币'],`平台锁定运营账号不能${point}`,`运营管理锁定${point}限制`,['O001平台管理权限锁定，账号余额100，公会剩余额度100'],[enter('guild-operation-account-detail.html'),`查看|${action}操作`],`${action}隐藏或不可用`,P1);
g('guild-operation-account-detail.html',['平台锁定时仅可查看','发放成功后刷新指标'],'平台解锁后公会恢复运营账号管理','运营管理解锁后的操作权限',['O001原被平台锁定公会管理权限；环境准备：平台刚解除该锁定；账号启用、余额100且可发额度100'],[enter('guild-operation-account-detail.html'),'填写|发放数量|为10','点击|发放金币'],'账户余额显示110金币',{...P1,commonEvidence:['- 平台可以锁定或解除公会的运营账号管理权限。']});

test('host-ranking.html',['主播等级或财富等级缺失时按 0 级'],'普通用户','主播榜财富等级缺失按0参与排序','主播榜财富等级缺失排序',['甲乙收礼值和主播等级相同；甲财富等级缺失，乙财富等级1；其他排序条件相同'],[enter('host-ranking.html')],'乙排在甲之前',P1);
test('search-results.html',['无匹配结果时保留搜索框'],'普通用户','搜索无结果时保留本次关键词','无结果关键词保留',['从搜索页提交关键词ZZ-No-Match且没有匹配账号'],[enter('search-results.html')],'搜索框仍显示ZZ-No-Match',P2);
for(const [state,pre,result]of [
 ['停用',['任务QA已停用，用户此前没有该任务进度'],'不产生任务QA的新进度'],
 ['未生效',['任务QA已启用，但生效时间晚于当前平台时间'],'不产生任务QA的新进度'],
 ['已过期',['任务QA已启用，但结束时间早于当前平台时间'],'不产生任务QA的新进度'],
])test('welfare-center.html',['仅启用且处于生效时间内的任务产生新进度'],'普通用户',`${state}任务不产生新进度`,`任务${state}进度限制`,[...pre,'环境准备要求：完成一次该任务配置对应的用户动作'],[enter('welfare-center.html')],result,P1);
test('welfare-center.html',['每个日期同时展示对应金币奖励','奖励数额取当前后台配置'],'普通用户','签到进度展示今日配置奖励','今日签到奖励展示',['后台当前配置连续第1天20金币、第2天30金币、第3天50金币；账号今日为连续第2天待签到'],[enter('welfare-center.html')],'今日签到项显示30金币',P1);
test('welfare-center.html',['每周从周一开始'],'普通用户','每周任务在周一重置进度','周任务周一起点',['环境准备要求：按平台业务时区准备周日23:59已累计5、周一00:00进入新周期的每周任务'],[enter('welfare-center.html')],'该每周任务进度显示0',P1);
test('invite-friends.html',['当前账号成功邀请的好友及对应奖励'],'普通用户','邀请记录展示对应奖励','邀请奖励金额',['当前账号成功邀请甲，对应活动奖励10金币；另有乙账号邀请记录'],[enter('invite-friends.html'),'切换|邀请记录'],'甲的奖励金额显示10金币',P2);
test('invite-friends.html',['上一页/下一页'],'普通用户','邀请记录从第二页返回上一页','邀请记录上一页',['当前账号成功邀请记录超过一页，已打开第二页'],['点击|上一页'],'显示第一页邀请记录',P2);
test('profile.html',['金币余额：展示当前账号可用金币'],'普通用户','我的页面显示当前可用金币','个人金币余额',['当前账号可用金币123，期间没有资产变动'],[enter('profile.html')],'金币余额显示123',P2);
test('profile.html',['负余额时不可消费'],'普通用户','负余额账号不能进入金币消费','负余额消费限制',['当前账号可用金币为-10，存在可购买的30金币装扮'],[enter('my-decoration.html'),'切换|装扮商城','点击|30金币装扮'],'不生成购买记录',{...P1,observe:'my-decoration.html',extra:[['my-decoration.html','实际状态根据用户实时金币余额判断']]});
test('my-decoration.html',['商城商品：展示装扮效果'],'普通用户','装扮商城展示配置效果','装扮商品效果',['已上架可购买头像框A，后台配置效果为金色边框'],[enter('my-decoration.html'),'切换|装扮商城'],'头像框A预览显示金色边框',P2);
test('my-decoration.html',['已购买商品显示“已获得”'],'普通用户','装扮商城标记已购商品','装扮已获得状态',['当前账号已持有永久头像框A，A仍上架'],[enter('my-decoration.html'),'切换|装扮商城'],'头像框A显示“已获得”',P2);
test('my-decoration.html',['购买成功不可退款'],'普通用户','已购买装扮不提供退款','装扮购买不可退款',['当前账号已成功购买头像框A并完成扣款'],[enter('my-decoration.html'),'切换|已拥有','点击|头像框A'],'不提供退款或退回金币操作',P1);
test('live-room.html',['按服务端时间排序'],'普通用户','观众公屏按服务端时间排序','公屏消息时间排序',['当前场次消息A服务端时间10:00:02、B为10:00:01，本地到达顺序为A后B'],[enter('live-room.html')],'公屏中B排列在A之前',P1);
test('live-room-host.html',['房间 ID：主播固定直播间标识；每次开播另生成直播场次'],'主播','同一主播新开场次保留固定房间ID','固定房间与场次ID',['主播甲上一场S1房间IDR100已结束；当前重新开播生成S2'],[enter('live-room-host.html')],'当前房间ID仍为R100且场次ID为S2',P1);
for(const kind of ['文本','图片','语音'])test('direct-message.html',['任一方拉黑后，无法发送消息'],'普通用户',`本账号主动拉黑后发送${kind}`,`主动拉黑后的${kind}发送限制`,['当前账号已主动拉黑甲；仍停留在与甲的历史会话页'],[kind==='文本'?'填写|消息输入框|为QA消息':`选择|${kind}|为有效测试${kind}`,`点击|发送${kind}`],'本次消息发送失败且不写入成功消息记录',P1);
test('group-manage-owner.html',['当前主播所属粉丝群的群公告和个人通知设置'],'主播','群主管理页隔离其他粉丝群数据','群管理数据范围',['主播甲拥有粉丝群G1，主播乙拥有G2；当前以甲打开群管理'],[enter('group-manage-owner.html')],'页面只显示G1公告及甲账号对G1的通知设置',P1);
test('group-manage-owner.html',['仅所属主播可编辑公告、进入成员管理'],'普通用户','非群主不能打开群主管理页','群主管理权限',['普通成员丙属于主播甲粉丝群'],[enter('group-manage-owner.html')],'不能进入群主管理页',P1);
test('live-plaza.html',['游客可查看主播榜、贡献榜和不同分类下的主播'],'游客','游客浏览直播分类','直播分类游客浏览',['聊天分类有在播主播甲，音乐分类有乙'],[enter('live-plaza.html'),'选择|音乐分类'],'列表显示音乐分类的乙',P2);
test('live-plaza.html',['其他账号动作时不执行原操作，直接跳转登录页'],'游客','游客点击其他账号头像要求登录','其他账号游客准入',['首页存在主播甲直播卡片'],[enter('live-plaza.html'),'点击|主播甲头像'],'进入登录与注册页',P1);
for(const [day,result]of [['已签到日','昨日签到项显示已签到及20金币'],['后续签到日','明日签到项显示待签到及50金币']])test('welfare-center.html',['已签到日、今日和后续签到日','每个日期同时展示对应金币奖励'],'普通用户',`签到进度展示${day}`,`签到周期${day}`,['后台配置昨日20、今日30、明日50金币；账号昨日已签到，今日待签到'],[enter('welfare-center.html')],result,P2);
for(const [point,page,extra,result]of [['个人资料','host-center.html',['头像 / 昵称：'],'主播中心昵称仍为QA甲'],['社交关系','friend-list.html',['当前账号仍有效的双向好友关系'],'主播身份生效后好友列表仍包含乙'],['金币资产','profile.html',null,'主播身份生效后金币余额仍为123']])test('profile.html',['用户和主播共用同一账号、个人资料、社交关系和金币资产'],'主播',`获得主播身份后保留${point}`,`主播共用${point}`,['普通用户甲昵称QA甲、好友乙、金币123；甲刚完成主播认证且没有其他资料或资产变动'],[enter(page)],result,{...P1,observe:page,extra:extra?[[page,...extra]]:[]});
for(const [source,pre]of [['任务','后台发放任务奖励头像框A且用户已领取'],['活动','有效活动向用户发放头像框A'],['平台发放','平台管理员向用户发放头像框A']])test('my-decoration.html',['道具可来自金币购买、任务、活动或平台发放'],'普通用户',`${source}获得装扮进入已拥有`,`装扮${source}来源`,[pre,'头像框A处于可佩戴有效期'],[enter('my-decoration.html'),'切换|已拥有','切换|头像框'],'列表包含头像框A',P1);
for(const [state,pre]of [
 ['账号封禁',['当前账号已被平台封禁；主播甲场次S1仍在播']],
 ['本账号拉黑主播',['当前账号已主动拉黑主播甲；甲场次S1仍在播']],
 ['本场踢出',['当前账号已被甲从场次S1踢出；S1仍在播']],
])test('live-room.html',['账号封禁、双方账号拉黑和本场踢出优先于粉丝团成员、密码和门票准入规则'],'普通用户',`${state}优先阻止进入直播`,`${state}准入优先级`,[...pre,'当前账号同时具有该房间的粉丝团成员资格、正确密码和有效门票'],[enter('live-room.html')],'不展示当前场次直播内容',P1);
test('live-room.html',['成员仍需输入密码'],'普通用户','粉丝团成员进入成员限制密码房仍校验密码','成员限制与密码顺序',['当前账号是主播甲有效粉丝团成员；甲的成员限制密码房S1正在直播'],[enter('live-room.html')],'显示房间密码输入弹窗',P1);
test('live-room.html',['运营账号可绕过限制'],'运营账号','运营账号绕过粉丝团成员限制','运营账号成员限制豁免',['运营账号O001不是主播甲粉丝团成员；甲的成员限制密码房S1正在直播，密码为1234'],[enter('live-room.html')],'不显示非成员访问受限',{...P1,notes:['密码准入仍按密码房规则单独验证，本条只核销成员限制豁免。']});
for(const [point,page,result]of [['消息','fan-group-chat.html','原场次历史消息仍可查看'],['消费','balance-detail.html','原场次礼物支出流水仍可查看'],['处置','live-room-host.html','原场次禁言处置记录仍保留'],['收益','live-records.html','原场次收益仍显示100金币']])test('live-room-host.html',['历史消息、消费、处置和收益记录保留'],'主播',`关闭直播权限后保留历史${point}`,`权限关闭历史${point}`,['主播甲S1已有消息、成功礼物消费、禁言处置及100金币收益','环境准备要求：平台关闭甲的直播权限并已结束S1'],[enter(page)],result,{...P1,observe:page,extra:point==='消息'?[['fan-group-chat.html','群消息']]:point==='消费'?[['balance-detail.html','支出']]:point==='收益'?[['live-records.html','收益']]:[]});
for(const [state,pre,result]of [
 ['有效团籍',['当前账号是有效团籍成员且未被禁言，平台允许发言'],'消息输入框可用'],
 ['单人禁言',['当前账号是有效团籍成员，已被主播单人禁言'],'消息输入框不可用'],
 ['全员禁言',['当前账号是有效团籍成员，粉丝群已开启全员禁言'],'消息输入框不可用'],
 ['平台限制',['当前账号是有效团籍成员，平台已限制该账号群聊发言'],'消息输入框不可用'],
])test('fan-group-chat.html',['发言状态：按有效团籍、单人禁言、全员禁言和平台限制计算'],'普通用户',`粉丝群${state}发言状态`,`粉丝群${state}发言权限`,pre,[enter('fan-group-chat.html')],result,P1);
for(const point of ['粉丝等级','亲密度'])test('group-manage-member.html',['粉丝等级与亲密度清零'],'普通用户',`主动退团后${point}清零`,`退团${point}重置`,['当前账号在主播甲粉丝团的粉丝等级3、亲密度100，仍关注甲'],[enter('group-manage-member.html'),'点击|退出粉丝团','点击|确认'],'再次加入前'+point+'为0',P1);
for(const [point,result]of [['主播等级','主播等级显示3级'],['财富等级','财富等级显示5级'],['开播状态','显示“直播中”状态']])test('host-home.html',['主播资料：展示账号资料、主播等级、财富等级和当前开播状态'],'普通用户',`主播主页展示${point}`,`主播资料${point}`,['主播甲当前主播等级3、财富等级5，正在直播'],[enter('host-home.html')],result,P2);
for(const [state,result]of [['关注','显示已关注'],['好友','显示好友'],['拉黑','显示未拉黑'],['私信权限','显示可发送私信']])test('host-home.html',['关系状态：分别展示关注、好友、拉黑和私信权限'],'普通用户',`主播主页展示${state}状态`,`主播关系${state}`,['当前账号已关注主播甲且双方为好友，没有拉黑关系'],[enter('host-home.html')],result,P2);
test('host-center.html',['默认今日，可切换本月'],'主播','主播中心切换本月统计周期','主播中心本月周期',['本月完成2个有效直播日，今日有效天进度1/3小时'],[enter('host-center.html'),'切换|本月'],'有效天数显示2天',P1);
test('host-center.html',['本页仅展示当前主播的数据'],'主播','主播中心不混入其他主播数据','主播中心账号隔离',['当前主播甲今日收益100金币；同公会乙今日收益200金币'],[enter('host-center.html')],'今日收益显示100金币',P1);
for(const length of [0,40])test('start-live-settings.html',['直播主题：最多 40 个字符'],'主播',`直播主题长度${length}边界`,`直播主题${length?'上边界':'必填'}`,['账号、公会、主播身份和直播权限均有效；分类和普通房已选择'],[enter('start-live-settings.html'),length?`填写|直播主题|为${'A'.repeat(length)}`:'清空|直播主题','点击|开始直播'],length?'进入开播倒计时':'不能创建缺少直播主题的场次',P1);
test('blacklist-management.html',['不能查看对方主页或 @ 对方'],'普通用户','第三方直播间不能提及拉黑对象','第三方直播间拉黑提及限制',['当前账号与甲存在任一方向拉黑关系，双方均在主播乙的第三方直播间'],[enter('live-room.html'),'填写|评论|为@甲 QA测试','点击|发送'],'不能发送提及甲的评论',{...P1,observe:'live-room.html',extra:[['live-room.html','公屏消息：']]});
for(const [point,result]of [['粉丝团','我的粉丝团不再显示甲的团卡片'],['群聊','不能进入甲的原粉丝群'],['粉丝等级','甲粉丝团的个人粉丝等级为0'],['亲密度','甲粉丝团的亲密度为0']])test('guild-leave-application.html',['粉丝团立即解散','粉丝等级和亲密度清零'],'主播',`主播退会后处理${point}`,`退会后${point}结果`,['主播甲创建粉丝团G，当前有成员乙；甲粉丝等级3、亲密度100，正在直播','环境准备要求：甲的退会申请由公会审核通过'],[enter(point==='群聊'?'fan-group-chat.html':'my-fan-clubs.html')],result,{...P1,observe:point==='群聊'?'fan-group-chat.html':'my-fan-clubs.html',extra:point==='群聊'?[['fan-group-chat.html','仅有效团籍成员']]:[['my-fan-clubs.html','移除对应卡片']]});
test('guild-leave-application.html',['以后重新认证成为主播时，需重新创建粉丝团'],'主播','退会后重新认证不恢复旧粉丝团','重新认证粉丝团重建',['主播甲退会前创建粉丝团G；退会已通过且G已解散；甲后来重新认证成为主播'],[enter('fan-club-settings.html')],'显示首次创建粉丝团的空表单',{...P1,observe:'fan-club-settings.html',extra:[['fan-club-settings.html','首次创建为空']]});
for(const [point,result]of [['头像','成员甲显示头像A'],['昵称','成员甲昵称显示QA甲'],['粉丝等级','成员甲粉丝等级显示3级'],['亲密度','成员甲亲密度显示100'],['加入时间','成员甲加入时间显示9月15日']])test('fan-club.html',['成员：展示头像、昵称、粉丝等级、亲密度和加入时间'],'主播',`粉丝团成员展示${point}`,`团员${point}`,['当前主播粉丝团有效成员甲，头像A、昵称QA甲、粉丝等级3、亲密度100，9月15日加入'],[enter('fan-club.html')],result,P2);
test('fan-club.html',['上限 500 人','满 500 人拒绝新成员'],'主播','粉丝团满500人拒绝新成员','粉丝团人数上限',['当前粉丝团已有500名有效成员；用户乙满足关注和贡献门槛'],[enter('fan-club.html')],'成员数保持500人',P1);
test('fan-club.html',['当前主播粉丝团的有效成员'],'主播','粉丝团列表排除已退团成员','粉丝团有效成员范围',['甲是有效成员，乙已退团，丙属于其他主播粉丝团'],[enter('fan-club.html')],'成员列表仅包含甲',P1);
for(const [point,result]of [['成员数','成员数减少1'],['群聊权限','被移除成员不能进入本粉丝群'],['粉丝等级','被移除成员粉丝等级为0'],['亲密度','被移除成员亲密度为0']])test('fan-club.html',['确认移除后更新成员数、群聊权限和用户身份','粉丝等级与亲密度清零'],'主播',`移除团员后更新${point}`,`移除团员${point}`,['成员甲当前属于本粉丝团，粉丝等级3、亲密度100；已左滑显示移除操作'],['点击|移除甲','点击|确认'],result,P1);
test('fan-club.html',['点击粉丝团设置 -> 进入设置页'],'主播','粉丝团进入设置页','粉丝团设置入口',[],[enter('fan-club.html'),'点击|粉丝团设置'],'进入粉丝团设置页',P2);
test('fan-club.html',['点击成员 -> 原型以资料提示反馈'],'主播','粉丝团点击成员查看资料提示','团员资料入口',['成员列表包含甲'],[enter('fan-club.html'),'点击|成员甲'],'显示甲的资料提示',P2);
test('income-sharing.html',['点击分成记录 -> 原型提示查看对应日期的记录'],'主播','分成记录点击对应日期','主播分成记录查看',['当前主播有9月15日和16日两条已上传分成记录'],[enter('income-sharing.html'),'点击|9月15日分成记录'],'提示查看9月15日的分成记录',P2);
test('live-room-host.html',['设置或取消房管'],'主播','设置房管前显示确认','设置房管二次确认',['当前场次在线观众甲不是房管，当前长期房管人数少于3人'],[enter('live-room-host.html'),'点击|观众甲','点击|设置房管'],'显示设置房管确认弹窗',P1);
for(const rejected of ['公会','平台']){
 test('guild-application-form.html',['公会或平台驳回后','重新申请生成新单'],'普通用户',`${rejected}驳回后重新申请生成新单`,`${rejected}驳回重申新单`,[`旧申请A已被${rejected}驳回；当前没有处理中申请，申请资料完整有效`],[enter('guild-application-form.html'),'点击|提交'],`新申请B显示待公会审核`,{...P1,observe:'guild-detail.html',extra:[['guild-detail.html','申请类型 / 状态：']]});
 test('guild-application-form.html',['旧单的审核结果保留为历史'],'普通用户',`${rejected}驳回重申后保留旧单结果`,`${rejected}驳回旧单留存`,[`旧申请A已被${rejected}驳回；随后提交的新申请B待公会审核`],[enter('guild-detail.html'),'查看|申请A时间线'],`A仍显示${rejected}驳回`,{...P1,observe:'guild-detail.html',extra:[['guild-detail.html','申请类型 / 状态：']]});
}
test('moderator-management.html',['按用户 ID 搜索添加房管'],'主播','按用户ID搜索房管候选','房管候选ID搜索',['用户甲ID1001不是当前房管，与主播无拉黑关系且不在直播间黑名单；用户乙ID2002'],[enter('moderator-management.html'),'填写|用户ID搜索框|为1001'],'搜索结果仅显示甲',P1);
