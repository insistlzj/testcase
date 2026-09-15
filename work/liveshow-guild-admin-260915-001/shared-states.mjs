import fs from 'node:fs/promises';
import {task,basis,basisHash,sources} from './design.mjs';
const specs=[
 ['JOIN-GUILD-PASS','JOIN','入会申请','待公会初审','通过并二次确认','公会长','公会App','平台审核中',['公会App','管理后台'],'COMMON-identity'],
 ['JOIN-GUILD-REJECT','JOIN','入会申请','待公会初审','驳回','公会长','公会App','公会驳回且申请作废',['公会App'],'COMMON-identity'],
 ['JOIN-PLATFORM-PASS','JOIN','入会申请','平台审核中','通过','平台管理员','管理后台','已通过且成为主播',['管理后台','公会App'],'COMMON-identity'],
 ['JOIN-PLATFORM-REJECT','JOIN','入会申请','平台审核中','驳回','平台管理员','管理后台','平台驳回且申请作废',['管理后台','公会App'],'COMMON-identity'],
 ['LEAVE-PASS','LEAVE','退会申请','待公会审核','通过并确认','公会长','公会App','已退出公会',['公会App','管理后台'],'REQ-dc1ca0561434'],
 ['LEAVE-REJECT','LEAVE','退会申请','待公会审核','驳回','公会长','公会App','退会驳回且仍在公会',['公会App'],'REQ-1ba98012803f'],
 ['HOST-REMOVE','LEAVE','主播公会关系','在会且无未结清收益','移出并确认','公会长','公会App','已退会且失去主播身份',['公会App','管理后台'],'REQ-cc2e01100f18'],
 ['LIVE-GUILD-OFF','LIVE-PERMISSION','主播直播权限','平台开启未锁定且公会开启','关闭公会直播权限','公会长','公会App','最终直播权限关闭',['公会App','管理后台'],'COMMON-permission'],
 ['LIVE-PLATFORM-LOCK','LIVE-PERMISSION','主播直播权限','平台开启且公会关闭','锁定公会管理权限','平台管理员','管理后台','最终开启且公会设置只读',['管理后台','公会App'],'COMMON-permission'],
 ['LIVE-PLATFORM-UNLOCK','LIVE-PERMISSION','主播直播权限','平台开启且锁定前公会关闭','解锁公会管理权限','平台管理员','管理后台','恢复公会关闭及最终关闭',['管理后台','公会App'],'COMMON-permission'],
 ['LIVE-PLATFORM-OFF','LIVE-PERMISSION','主播直播权限','平台开启','关闭平台直播权限','平台管理员','管理后台','最终关闭',['管理后台','公会App'],'COMMON-permission'],
 ['OP-ISSUE','OPERATION','运营账号虚拟金币','账号与公会月剩余额度足够且未锁定','发放虚拟金币','公会长','公会App','新增成功发放记录',['公会App','管理后台'],'COMMON-operation'],
 ['OP-LOCK','OPERATION','运营账号管理权限','公会可管理','锁定公会管理','平台管理员','管理后台','公会只读且不可发币',['管理后台','公会App'],'COMMON-operation'],
 ['OP-DISABLE','OPERATION','运营账号','启用','禁用','平台管理员','管理后台','禁用且余额历史保留',['管理后台','公会App'],'REQ-722c17a54831'],
 ['GUILD-STOP','GUILD','公会','启用','停用公会','平台管理员','管理后台','公会停用且主播关系解除',['管理后台'],'COMMON-guild-stop'],
 ['HOST-SHARE','FINANCE-HOST','主播分成结果','线下结算完成且结果未导入','确认导入','平台管理员','管理后台','已上传且不可修改删除',['管理后台','公会App'],'COMMON-finance'],
 ['GUILD-SHARE','FINANCE-GUILD','公会分成结果','线下结算完成且结果未导入','确认导入','平台管理员','管理后台','已上传且不可修改删除',['管理后台','公会App'],'COMMON-finance'],
 ['REPORT-END','LIVE-REPORT','直播举报工单','直播中且待处理','结束该直播场次','主播','用户App','工单已作废',['管理后台'],'COMMON-report-end'],
 ['REFUND','RECHARGE','充值订单','支付成功且可退款','全额退款','平台管理员','管理后台','已退款并扣回原到账金币',['管理后台'],'COMMON-refund']
];
export const states={schemaVersion:'1.0',业务来源:{路径:basis,'SHA-256':basisHash},建立说明:'从两文档中的共同业务对象先建立生命周期，再投影到两端；用户App仅作为外部触发，不生成其用例。未定义同步时限不编造等待秒数。',状态转换:specs.map(([id,flow,object,from,action,role,end,to,observe,source])=>({状态转换标识:id,流程编号:flow,共同业务对象:object,来源状态:from,触发动作:action,执行角色:role,操作端:end,目标状态:to,观察端:observe,分支类型:'有依据的状态转换',证据:[{路径:basis,'SHA-256':basisHash,原文:sources.get(source)[0].raw}]}))};
for(const end of ['guild','admin'])await fs.writeFile(`${task}/${end}/state-transition-baseline.json`,JSON.stringify(states,null,2)+'\n');
