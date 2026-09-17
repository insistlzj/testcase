import {test,P1,enter} from './case-design.mjs';

const room='live-room.html', host='live-room-host.html';
test(room,['巡房任务进入 -> 不显示访问拦截'],'巡房人员','有效巡房会话进入密码门票房','巡房会话准入豁免',['账号正常且巡房排班当前有效，目标直播间同时设置密码和门票'],['进入|排班对应直播间'],'页面显示“巡房中”标记',{...P1,extra:[['admin-inspection-schedule.html','可进入任意直播间，无需密码或门票'],['admin-inspection-schedule-detail.html','生成巡房会话']]});
test(room,['巡房'],'巡房人员','巡房会话不受主播黑名单限制','巡房会话黑名单豁免',['账号正常且巡房排班有效，主播已将该账号加入黑名单'],['进入|排班对应直播间'],'页面显示“巡房中”标记',{...P1,extra:[['admin-inspection-schedule.html','不受主播黑名单']]});
test('views/live-room-host/profile-host.html',['不展示拉黑和踢出操作'],'主播','主播不能踢出有效巡房人员','巡房会话踢出保护',['巡房人员甲正在本场执行有效巡房任务'],[enter(host),'点击|甲资料卡'],'不显示踢出甲的操作',{...P1,extra:[['admin-inspection-schedule.html','主播与房管不可对其拉黑或踢出']]});
test(room,['平台封禁或巡房权限失效仍不可进入'],'巡房人员','巡房会话结束后失去全部入房豁免','巡房会话失效边界',['巡房排班刚结束，账号被主播拉黑且没有目标密码房密码或门票'],['进入|原排班对应直播间'],'不能以巡房身份进入直播间',{...P1,extra:[['admin-inspection-schedule.html','保护仅限巡房会话'],['admin-inspection-schedule-detail.html','会话结束后不再享有']]});
test('system-notifications.html',['平台发送的系统通知及'],'普通用户','举报处理完成后通知举报人','举报结果通知',['当前账号提交举报R001，平台已完成处理'],[enter('system-notifications.html'),'查看|R001结果通知'],'显示R001对应的举报处理结果',{...P1,extra:[['admin-report-detail.html','按结果通知举报人']]});
test('system-notifications.html',['平台发送的系统通知及'],'主播','直播处罚后通知被处置主播','直播处罚通知',['当前主播H001的场次S1被平台执行警告'],[enter('system-notifications.html'),'查看|S1处罚通知'],'显示S1被警告的处理结果',{...P1,extra:[['admin-report-detail.html','直播处罚同时通知主播']]});
