import {a} from './design-admin.mjs';
import {P0,P1,P2,enter} from './case-design.mjs';

const dashboard='admin-dashboard.html', users='admin-user-list.html', user='admin-user-detail.html';
const hosts='admin-host-list.html', review='admin-host-review-detail.html', live='admin-live-detail.html';
const schedules='admin-inspection-schedule.html';

a(dashboard,['点击指标卡 -> 切换趋势'],'点击工作台指标卡切换对应趋势','指标卡趋势切换',['最新自然日已有活跃用户和充值两组趋势数据'],[enter(dashboard),'点击|充值金额指标卡'],'趋势图切换为充值金额趋势',P2);
a(dashboard,['刷新 -> 重新取数'],'刷新工作台重新获取当前指标','工作台刷新取数',['工作台当前显示活跃用户2人；环境准备：统计源已新增1名有效活跃用户'],[enter(dashboard),'点击|刷新'],'活跃用户显示3人',P1);
a(dashboard,['点击退款记录或快捷入口'],'工作台快捷入口进入目标页面','工作台快捷入口去向',[],[enter(dashboard),'点击|用户管理快捷入口'],'进入用户列表页',{...P2,observe:users,extra:[[users,'查询用户并查看详情']]});

a(users,['封禁后立即下线'],'封禁用户同步终止会话和直播','封禁即时生效',['用户U001正常登录且正在直播'],[enter(users),'点击|U001封禁','填写|原因|为QA封禁验证','点击|确认'],'U001当前登录会话终止、直播场次结束且后续登录被拒绝',{...P0,extra:[['admin-user-detail.html','账号状态']]});
a(user,['解封只恢复登录'],'解封用户不恢复已关闭直播权限','解封与直播权限独立',['用户U001已封禁且平台直播权限关闭'],[enter(user),'点击|解封','填写|原因|为QA复核通过','点击|确认'],'U001账号恢复正常但平台直播权限仍为关闭',P1);
a(user,['切换 Tab -> 加载明细'],'用户详情切换充值流水明细','用户详情Tab加载',['U001存在充值订单O001'],[enter(user),'切换|充值流水'],'充值流水加载O001',P2);
a(user,['账号处置 -> 填写原因并确认 -> 更新并留痕'],'用户详情账号处置保存前后值','账号处置审计内容',['U001账号正常，操作账号qa-admin'],[enter(user),'点击|封禁','填写|原因|为QA详情处置','点击|确认','切换|违规记录'],'处置记录包含正常到封禁、qa-admin、QA详情处置和本次操作时间',P1);

for(const [title,point,fixture,result]of [
 ['账号不可用阻止开播','账号状态准入','主播H001账号已封禁，认证通过、公会有效且双重直播权限开启','H001不能创建新直播场次'],
 ['平台关闭阻止开播','平台权限准入','H001账号、公会和认证正常，公会权限开启但平台直播权限关闭','H001不能创建新直播场次'],
 ['平台锁定开启时允许开播','平台锁定优先级','H001其余前提正常，公会原权限关闭，平台权限开启并锁定公会管理','H001可创建直播场次'],
 ['未锁定时公会关闭阻止开播','双重权限准入','H001其余前提正常，平台权限开启且未锁定，公会权限关闭','H001不能创建新直播场次'],
 ['解锁后恢复公会原设置','解锁权限重算','H001锁定前公会权限关闭，平台开启并锁定后曾可开播，现解除锁定','H001实际开播权限显示关闭'],
])a(hosts,['开播权限：'],title,point,[fixture],[enter(hosts),'查看|H001实际开播权限'],result,P1);
a(hosts,['锁定期间公会设置跟随平台且不可改'],'平台锁定后公会不可改主播开播权限','锁定期间公会权限只读',['H001平台权限开启且已锁定公会管理'],[enter(hosts),'查看|H001权限状态'],'公会侧权限跟随平台开启且不可修改',P1);
a(hosts,['解锁后恢复锁定前设置并重算权限'],'解除锁定后按原公会设置重算权限','解锁权限重算',['H001锁定前公会权限关闭，平台权限开启且当前锁定'],[enter(hosts),'点击|H001解除公会管理锁定','填写|原因|为QA解锁验证','点击|确认'],'H001实际开播权限变为关闭',P1);
a(hosts,['记录前后值、操作人和时间'],'主播权限变更写入完整审计信息','主播权限操作留痕',['H001平台权限开启，操作账号qa-admin'],[enter(hosts),'关闭|H001平台直播权限','填写|原因|为QA权限审计','点击|确认'],'操作留痕包含开启到关闭、qa-admin和本次操作时间',P1);
a(hosts,['导出当前筛选结果'],'主播列表只导出当前筛选结果','主播导出范围',['当前筛选仅命中主播H001和H002'],[enter(hosts),'点击|导出'],'导出数据仅包含H001和H002',P1);

a(review,['审核结果：仅通过、驳回'],'主播审核结果枚举只含通过和驳回','主播审核结果选项',['申请A待平台审核'],[enter(review),'点击|审核结果'],'审核结果选项仅包含通过和驳回',P2);
a(review,['直播权限：通过时设置平台权限初始值'],'主播审核通过时保存平台直播权限初值','认证后平台权限初值',['申请A待审核，账号和公会正常'],[enter(review),'选择|审核结果|为通过','选择|直播权限|为关闭','选择|公会管理权限|为可管理','点击|确认'],'申请A通过且平台直播权限初始值为关闭',P1);
a(review,['公会管理权限：通过时设置公会是否可管理'],'主播审核通过时保存公会管理权限初值','认证后公会权限初值',['申请A待审核，账号和公会正常'],[enter(review),'选择|审核结果|为通过','选择|直播权限|为开启','选择|公会管理权限|为不可管理','点击|确认'],'申请A通过且公会管理权限初始值为不可管理',P1);

for(const state of ['直播中','已结束'])a(live,['直播状态：直播中、已结束'],`直播详情显示${state}状态`,'直播场次状态回显',[`场次S1当前状态为${state}`],[enter(live)],`S1直播状态显示${state}`,P2);
a(live,['已结束只读'],'已结束直播详情不可执行即时处置','结束场次只读',['场次S1已结束'],[enter(live)],'S1不显示警告或关播操作',P1);

a(schedules,['日期 / 时间段：平台统一时区'],'巡房排班按平台时区显示日期时间','排班统一时区',['平台时区为Asia/Jakarta，排班在当地9月18日10:00至12:00'],[enter(schedules)],'排班时间显示9月18日10:00至12:00',P2);
a(schedules,['结束时间晚于开始时间'],'巡房排班结束晚于开始才有效','排班时段顺序',['排班A为10:00至12:00，排班B为12:00至10:00'],[enter(schedules)],'A可生效且B不能成为有效排班',P1);
for(const state of ['待生效','生效中','已停用','已结束'])a(schedules,['状态：待生效、生效中、已停用、已结束'],`巡房排班列表显示${state}`,'排班状态枚举',[`排班A按时间和启停条件应处于${state}`],[enter(schedules)],`A状态显示${state}`,P2);

const accountReports='admin-account-violation.html', liveReports='admin-report-handling.html', report='admin-report-detail.html';
a(accountReports,['查询 -> 条件取交集'],'账号举报列表组合查询取交集','账号举报组合筛选',['U001有待处理类型A工单R1及已处理类型B工单R2，U002有待处理类型A工单R3'],[enter(accountReports),'填写|被举报账号|为U001','选择|违规类型|为A','选择|处理状态|为待处理','点击|查询'],'结果仅包含R1',P1);
a(accountReports,['查看 -> 进入详情处理或查看结果'],'账号举报列表进入指定详情','账号举报详情入口',['账号举报R1待处理'],[enter(accountReports),'点击|R1查看'],'进入R1举报详情页',{...P2,observe:report,extra:[[report,'核对举报对象']]});
a(liveReports,['查看 -> 进入详情'],'直播举报列表进入指定详情','直播举报详情入口',['直播举报R1待处理'],[enter(liveReports),'点击|R1查看'],'进入R1举报详情页',{...P2,observe:report,extra:[[report,'核对举报对象']]});
for(const state of ['已处理','已作废'])a(liveReports,['已处理或已作废只读'],`${state}直播举报列表只读`,`直播举报${state}终态`,[`举报R1状态为${state}`],[enter(liveReports)],'R1不显示可再次处置的操作',P1);

a('admin-violation-types.html',['停用或删除后不用于新举报'],'停用违规类型不再进入新举报选项','停用类型新单范围',['自定义违规类型T001已停用，T002启用'],[enter('admin-violation-types.html'),'查看|新举报可选类型'],'可选类型包含T002且不包含T001',P1);
a('admin-violation-type-detail.html',['状态：预置固定启用，自定义可调'],'自定义违规类型可切换为停用','自定义类型状态编辑',['自定义违规类型T001当前启用'],[enter('admin-violation-type-detail.html'),'选择|状态|为停用','点击|保存'],'T001状态显示停用',P1);
a('admin-violation-type-detail.html',['用于新举报及筛选'],'保存违规类型后进入新举报筛选','违规类型保存生效',['四语名称唯一、排序为1的自定义类型QA新类'],[enter('admin-violation-type-detail.html'),'点击|保存',enter(accountReports),'点击|违规类型筛选'],'筛选选项包含QA新类',{...P1,observe:accountReports,extra:[[accountReports,'举报类型：']]});

a('admin-guild-list.html',['公会长账号停用时，仅该账号不能登录'],'停用公会长账号不改变公会与主播','公会长账号停用影响',['公会G001启用，公会长账号qa-chief启用，旗下主播H001正常'],[enter('admin-guild-list.html'),'点击|qa-chief停用','点击|确认'],'G001仍启用且H001主播状态保持正常',P1);
a('admin-guild-detail.html',['公会仅管理本公会主播'],'公会不能修改其他公会主播权限','公会主播隔离',['当前查看G001，H001属于G001，H002属于G002'],[enter('admin-guild-detail.html'),'查看|主播管理范围'],'管理范围包含H001且不包含H002',P1);
a('admin-guild-detail.html',['平台权限优先'],'公会权限不能覆盖平台关闭状态','平台权限优先级',['G001与主播H001正常，公会权限开启但H001平台直播权限关闭'],[enter('admin-guild-detail.html'),'查看|H001实际开播权限'],'H001实际开播权限显示关闭',P1);
a('admin-guild-detail.html',['公会停用会拦截全部管理账号'],'停用公会拦截全部管理账号登录','公会停用登录影响',['G001已停用，公会长qa-chief与运营账号qa-ops自身均启用'],[enter('admin-guild-detail.html'),'查看|管理账号状态'],'qa-chief与qa-ops均不可登录公会App',P1);
a('admin-guild-detail.html',['公会长账号停用只拦截该账号'],'停用公会长不影响其他运营账号登录','公会长停用账号隔离',['G001启用，qa-chief停用，qa-ops自身启用'],[enter('admin-guild-detail.html'),'查看|管理账号状态'],'qa-chief不可登录且qa-ops仍可登录',P1);
a('admin-guild-detail.html',['公会状态与公会长账号状态分别操作'],'公会状态与公会长账号状态独立切换','公会和账号状态独立',['G001与qa-chief当前均启用'],[enter('admin-guild-detail.html'),'关闭|公会状态','点击|确认'],'G001状态变为停用且qa-chief账号状态仍为启用',P1);
a('admin-guild-detail.html',['账号状态通过开关切换'],'公会长账号开关切换为停用','公会长账号状态开关',['G001与qa-chief当前均启用'],[enter('admin-guild-detail.html'),'关闭|公会长账号状态','点击|确认'],'qa-chief账号状态显示停用',P1);

a('admin-gift-list.html',['特效按资源要求上传'],'普通礼物上传有效特效资源','普通礼物特效资源',['礼物G001图标和四语完整，特效资源qa-effect.svga符合当前上传要求'],[enter('admin-gift-list.html'),'点击|G001编辑','上传|特效|选择qa-effect.svga','点击|保存'],'G001详情显示已上传qa-effect.svga',P2);
a('admin-gift-list.html',['普通礼物由平台手动切换'],'普通礼物状态只随平台操作切换','普通礼物手动状态',['G001昨天由平台手工上架且无自动排期，当前时间已跨到次日零点后'],[enter('admin-gift-list.html')],'G001状态仍为上架',P1);
a('admin-gift-list.html',['下架只阻止新赠送，历史消费和收益保留'],'普通礼物下架后保留历史消费订单','礼物下架历史留存',['G001曾成功消费100金币并形成订单，现已下架'],[enter('admin-gift-list.html'),enter('admin-consumption-order-detail.html'),'查看|G001历史订单'],'历史订单仍显示消费100金币',{...P1,observe:'admin-consumption-order-detail.html',extra:[['admin-consumption-order-detail.html','扣减金币：']]});
