import {page,lifecycle} from './design-current.mjs';
const U='用户App',G='公会App',A='管理后台';
const join=page(U,'guild-application-form.html',['申请人甲未加入任何公会，姓名“测试甲”，手机号 81234567890，国家区号 +62，持有可通过认证的 KTP 正反面测试图片']);
const pending=lifecycle('入会申请','无处理中申请','提交入会申请','待公会审核','用户',U,[U,G]);
join.add('提交资料完整的入会申请',[],['打开公会甲的申请加入公会','填写姓名“测试甲”','填写手机号 81234567890','选择 KTP 并上传正反面测试图片','点击提交'],[{point:'申请初始状态',result:'公会甲申请显示待公会审核'}],[/提交|必填|初审/],{flow:pending.流程编号,transition:pending.状态转换标识});
for(const state of ['待公会审核','待平台审核'])join.add(`已有${state}申请时再次申请公会`,[`申请人甲已有公会乙的${state}申请`],['打开公会甲的申请加入公会','点击提交'],[{point:'处理中申请唯一性',result:'未新增第二笔入会申请'}],[/处理中|重复|提交/],{flow:pending.流程编号});
const gr=page(G,'guild-join-review-detail.html',['公会甲有申请单 J001，申请人甲资料完整且申请处于待公会审核']);
const gp=lifecycle('入会申请','待公会审核','公会通过申请','待平台审核','公会长',G,[U,G,A]);
gr.add('公会通过初审后进入平台终审',[],['打开入会申请 J001 详情','点击通过','确认通过'],[{point:'审核流转',result:'申请 J001 显示待平台审核'}],[/通过|平台|审核/],{flow:gp.流程编号,transition:gp.状态转换标识});
const ur=page(U,'guild-application-records.html',['申请人甲的申请单为 J001']);
ur.add('公会初审通过后查看入会申请',['公会长已对 J001 执行通过，平台尚未终审'],['打开我的公会','查看公会甲申请进度'],[{point:'平台终审进度',result:'公会甲申请显示待平台审核'}],[/平台|阶段|审核|状态/],{flow:gp.流程编号,transition:gp.状态转换标识});
const ar=page(A,'admin-host-review.html',['申请单 J001 已由公会甲通过，申请人甲未取得主播身份']);
ar.add('公会初审通过的申请进入平台审核列表',[],['打开主播审核','查询申请人甲'],[{point:'终审队列',result:'待审核列表包含申请 J001'}],[/公会|审核|待/],{flow:gp.流程编号,transition:gp.状态转换标识});
const ap=lifecycle('入会申请','待平台审核','平台通过终审','已加入公会并取得主播身份','平台管理员',A,[U,G,A]);
const ad=page(A,'admin-host-review-detail.html',['申请单 J001 已通过公会甲初审，当前待平台终审']);
ad.add('平台通过入会终审',[],['打开申请 J001 审核详情','点击通过','确认通过'],[{point:'终审结果',result:'申请 J001 显示已通过'}],[/通过|公会|身份/],{flow:ap.流程编号,transition:ap.状态转换标识});
ur.add('平台终审通过后查看公会关系',['平台已对 J001 执行通过'],['打开我的公会','查看公会甲'],[{point:'当前公会归属',result:'公会甲显示为申请人甲当前所属公会'}],[/平台|公会|通过|状态/],{flow:ap.流程编号,transition:ap.状态转换标识});
const members=page(G,'guild-member-list.html',['当前公会为公会甲']);
members.add('终审通过的申请人进入当前主播列表',['平台已通过 J001，申请人甲取得公会甲主播身份'],['打开主播列表','选择当前主播','查询申请人甲'],[{point:'当前主播归属',result:'当前主播列表包含主播甲'}],[/主播|当前|加入/],{flow:ap.流程编号,transition:ap.状态转换标识});
for(const stage of ['公会','平台']){
 const t=lifecycle('入会申请',stage==='公会'?'待公会审核':'待平台审核',`${stage}驳回`,'申请作废',stage==='公会'?'公会长':'平台管理员',stage==='公会'?G:A,[U,...(stage==='公会'?[G]:[A])],'拒绝分支');
 const target=stage==='公会'?gr:ad;
 target.add(`${stage}驳回入会申请`,[],['打开申请 J001 详情','点击驳回','输入原因“认证资料需要补正”','确认驳回'],[{point:'驳回状态',result:`申请 J001 显示${stage}驳回`}],[/驳回|原因|通过/],{flow:t.流程编号,transition:t.状态转换标识});
 ur.add(`查看${stage}驳回的申请`,[`${stage}已将 J001 驳回，原因为“认证资料需要补正”`],['打开我的公会','查看申请 J001'],[{point:'驳回原因',result:'申请记录显示“认证资料需要补正”'}],[/驳回|原因|阶段/],{flow:t.流程编号,transition:t.状态转换标识});
 join.add(`${stage}驳回后重新提交入会申请`,[`J001 已被${stage}驳回且作废`],['打开公会甲的申请加入公会','填写姓名“测试甲”和手机号 81234567890','选择 KTP 并上传正反面测试图片','点击提交'],[{point:'重新申请审核起点',result:'新申请处于待公会审核'}],[/提交|驳回|初审/],{flow:t.流程编号});
}
const leave=page(U,'guild-leave-application.html',['主播甲当前属于公会甲，尚无处理中退会申请']);
const lp=lifecycle('退会申请','公会内主播','提交退会申请','待公会审核且仍为主播','主播',U,[U,G]);
leave.add('主播提交退会申请',[],['打开申请退出公会','输入退会原因“个人安排调整”','点击提交'],[{point:'退会待审状态',result:'退会申请显示待审核'}],[/提交|原因|审核/],{flow:lp.流程编号,transition:lp.状态转换标识});
const lr=page(G,'guild-leave-review-detail.html',['主播甲属于公会甲，退会申请 L001 处于待审核']);
lr.add('公会查看待审退会申请',[],['打开退会申请 L001 详情'],[{point:'待审申请归属',result:'详情申请人为主播甲'}],[/主播|申请|详情/],{flow:lp.流程编号,transition:lp.状态转换标识});
for(const approve of [true,false]){
 const t=lifecycle('退会申请','待审核',approve?'同意退会':'驳回退会',approve?'退出公会且失去主播身份':'仍在公会且保留主播身份','公会长',G,[U,G],approve?'正常分支':'拒绝分支');
 lr.add(approve?'公会同意主播退会':'公会驳回主播退会',[],['打开退会申请 L001 详情',approve?'点击同意':'点击驳回',...(!approve?['输入原因“需完成当前合作事项”']:[]),approve?'确认同意':'确认驳回'],[{point:'退会审核结果',result:`申请 L001 显示${approve?'已通过':'已驳回'}`}],[/通过|同意|驳回|审核/],{flow:t.流程编号,transition:t.状态转换标识});
 ur.add(approve?'退会通过后查看公会关系':'退会驳回后查看公会关系',[`L001 已由公会甲${approve?'同意':'驳回'}`],['打开我的公会','查看公会甲'],[{point:'退会后关系',result:approve?'公会甲记录显示已退出':'公会甲仍显示为当前所属公会'}],[/退出|退会|当前|关系/],{flow:t.流程编号,transition:t.状态转换标识});
}
const permG=page(G,'guild-host-detail.html',['主播甲当前在公会甲，当前公会为公会甲']);
const permA=page(A,'admin-host-detail.html',['主播甲已通过认证且公会甲有效']);
const start=page(U,'start-live-settings.html',['主播甲认证通过，公会甲有效，账号未封禁；相机和麦克风权限已授权；普通房封面、主题“测试直播”、分类均已设置']);
for(const platform of [false,true])for(const locked of [false,true])for(const guild of [false,true]){
 const allowed=platform&&(locked||guild),condition=`平台开播开关为${platform?'开启':'关闭'}，公会原开关为${guild?'开启':'关闭'}，平台${locked?'已锁定':'未锁定'}公会权限`;
 const t=lifecycle('主播开播权限',condition,'尝试开播',allowed?'进入直播中':'禁止开播','主播',U,[U]);
 start.add(`平台${platform?'开':'关'}、锁定${locked?'是':'否'}、公会原设置${guild?'开':'关'}的开播判定`,[condition],['打开开播设置','点击开始直播'],[{point:'最终开播权限',result:allowed?'进入主播直播间':'未创建新直播场次'}],[/权限|开播|平台|公会/],{flow:t.流程编号,transition:t.状态转换标识});
 permG.add(`平台${platform?'开':'关'}、锁定${locked?'是':'否'}、公会原设置${guild?'开':'关'}的公会开关呈现`,[condition],['打开主播甲主页','查看直播权限'],[{point:'公会权限开关',result:!platform||locked?`公会直播权限开关只读，显示${platform?'开启':'关闭'}`:`公会直播权限开关显示${guild?'开启':'关闭'}且可编辑`}],[/锁定|开关|平台|权限/],{flow:t.流程编号});
}
const unlock=lifecycle('主播开播权限','平台开启且锁定，公会原设置关闭','平台解除锁定','恢复公会原设置关闭','平台管理员',A,[U,G,A]);
permA.add('解除锁定恢复公会原先关闭设置',['公会原开关关闭，平台开关开启且已锁定'],['打开主播甲详情','解除公会开播权限锁定','确认修改'],[{point:'解锁后权限',result:'主播甲最终直播权限显示关闭'}],[/锁定|公会|权限/],{flow:unlock.流程编号,transition:unlock.状态转换标识});
permG.add('平台解锁后显示被保留的公会设置',['公会原开关关闭，平台开启并锁定后已解除锁定'],['打开主播甲主页','查看直播权限'],[{point:'原公会设置恢复',result:'公会直播权限开关显示关闭且可编辑'}],[/解锁|锁定|恢复|公会/],{flow:unlock.流程编号,transition:unlock.状态转换标识});
start.add('平台解锁后原公会关闭设置阻止开播',['平台开启，锁定期间公会原设置关闭，平台已解除锁定'],['打开开播设置','点击开始直播'],[{point:'解锁后的开播拒绝',result:'未创建新直播场次'}],[/权限|公会|平台|开播/],{flow:unlock.流程编号,transition:unlock.状态转换标识});
const stop=lifecycle('直播场次','直播中且权限开启','平台关闭直播权限','场次结束且不能重新开播','平台管理员',A,[U,G,A]);
permA.add('平台关闭正在直播主播的开播权限',['主播甲正在场次 S001 直播'],['打开主播甲详情','关闭直播权限','输入原因“测试关闭权限”','确认关闭'],[{point:'平台权限状态',result:'主播甲直播权限显示关闭'}],[/关闭|权限|原因/],{flow:stop.流程编号,transition:stop.状态转换标识});
const room=page(U,'live-room-host.html',['主播甲正在普通房场次 S001 直播']);
room.add('平台关闭权限结束主播当前场次',['平台管理员已关闭主播甲直播权限'],['查看当前主播直播间'],[{point:'强制结束场次',result:'当前直播场次 S001 已结束'}],[/权限|关播|关闭|结束/],{flow:stop.流程编号,transition:stop.状态转换标识});
permG.add('平台关闭权限后公会无法打开开播权限',['平台管理员已关闭主播甲的直播权限'],['打开主播甲主页','查看直播权限开关'],[{point:'平台关闭的公会限制',result:'公会直播权限开关只读且显示关闭'}],[/锁定|平台|关闭/],{flow:stop.流程编号,transition:stop.状态转换标识});
