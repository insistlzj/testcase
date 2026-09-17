import {plans,rules,pages,ref,transitions} from './design.mjs';
// Corrections found while comparing authored paths with their source clauses.
const actors=new Map([
 ['验证运营账号不能登录公会端','运营账号'],
 ['验证运营账号免票进入','运营账号'],['验证游客签到转登录','游客'],
 ['验证游客从主播榜点账号要求登录','游客'],['验证运营账号不能进入全部任务','运营账号'],
 ['验证运营账号不显示加入粉丝团','运营账号'],['验证主播在线人数随观众离开变化','主播'],
 ['验证屏蔽评论只移除选中的消息','主播'],['验证观众结束页关联本场主播','观众'],['验证旧场次入口不串入新直播','观众'],
 ...['未提交主播申请显示去加入','审核未完成不显示完成时间','公会驳回不启动平台审核','公会通过后本人不能直接开播','平台驳回重新走新公会申请','查看申请资料不跳转'].map(s=>['验证'+s,'申请用户'])
]);
for(const p of plans) {
 const r=p.规则,d=r.用例设计,role=actors.get(d.场景)||(/^auth-/.test(p.页面)?'未登录用户':undefined);
 if(role){r.执行角色=role;r.适用角色和端=[`${d.观察端}-${role}`];r.必要条件[0]=`执行角色为${role}`;r.功能结构=r.功能结构.replace(/（[^（）]+视角）$/u,`（${role}视角）`);d.步骤.forEach(s=>s.执行角色=role);}
 if(d.场景==='验证公会长密码错误') {d.用例类型='异常用例';d.优先级依据='验证错误凭证登录拦截，防止非法建立会话。';}
 if(d.场景==='验证入会申请详情读取姓名')r.必要条件.push('申请人的账号昵称为昵称乙，与所提交实名甲不同');
 if(d.场景==='验证本场禁言后本人受限制') {
   const page=pages.find(p=>p.来源页面==='views/live-room/comment-muted.html');
   if(page){p.页面=page.来源页面;d.观察页面=page.视图;d.观察页面路径=page.页面路径;r.功能结构=`${page.视图}（已登录用户视角）`;}
   if(!p.来源行.includes(1634)){p.来源行.push(1634);r.证据引用.push(ref(1634));}
 }
 if(d.场景==='验证普通礼物权重越大越靠前') {
   const page=pages.find(p=>p.来源页面==='views/live-room/gift.html');
   p.页面=page.来源页面;r.功能模块=page.功能模块;r.功能结构=`${page.视图}（已登录用户视角）`;
   r.执行角色='已登录用户';r.适用角色和端=['用户App-已登录用户'];r.必要条件[0]='执行角色为已登录用户';
   d.观察端='用户App';d.观察页面=page.视图;d.观察页面路径=page.页面路径;
   d.步骤=[{执行角色:'已登录用户',动作:'打开',对象:'当前直播间普通礼物面板',操作:'打开当前直播间普通礼物面板',证据:[0,1]}];
   r.触发动作=d.步骤[0].操作;
   p.来源行.push(1576);r.证据引用.push(ref(1576));
 }
 // Generic module groupings did not establish shared business flows.
 delete r.跨模块流程编号;d.备注=d.备注.filter(s=>!s.startsWith('流程阶段：'));
 if(p.状态转换标识) {
   r.跨模块流程编号='FLOW-'+p.状态转换标识.slice(3).replace(/^(JOIN|LEAVE|COHOST|COMMENT|ACCOUNT|GUILD|PERMISSION|DELETION|FAN)-.*$/,'$1');
   d.备注.push(`状态转换：${p.状态转换标识}；按同一业务对象的数据别名准备对应上下游记录`);
 }
 r.必要条件=r.必要条件.map(s=>s.replace('；消息中心仅比较普通私信会话时不含固定通知入口',p.来源行.includes(657)?'；只比较普通私信会话，不含固定通知入口':''));
 if(/甲|乙|丙/.test(r.必要条件.join(''))) d.备注.push('数据别名：甲、乙、丙用于区分本条测试对象；按前置条件准备并记录实际账号或记录 ID，不是固定业务名称。');
 const files=[...new Set(JSON.stringify([r.必要条件,d.步骤]).match(/qa-[\w-]+\.(?:png|jpg|jpeg)/g)||[])];
 if(files.length) r.必要条件.push(`材料准备要求：准备本条使用的${files.join('、')}，为可正常解码的测试图片，并按前置条件保存原图或供本次上传；文件名仅为材料别名`);
 if(r.必要条件.some(s=>/环境准备要求|当前待准备|模拟方式待准备/.test(s)) && /授权失败|返回失败|请求失败|网络|断网|故障|超时|失败响应/.test(r.必要条件.join(''))) {
   r.必要条件.push('环境准备要求：技术提供仅作用于本条测试账号、本次目标请求的可控响应或测试适配器，在提交前启用本条指定故障；故障注入和验证账号尚待准备');
   d.备注.push('环境恢复：完成本条后移除本次响应覆盖或故障开关，恢复正常请求；本条未执行。');
 }
 if(/测试.*(?:支付|退款)|支付.*测试|测试渠道/.test(r.必要条件.join(''))) {
   r.必要条件=r.必要条件.map(s=>s.replace(/测试退款通道可用/g,'执行前须准备支持全额退款的测试通道').replace(/测试支付渠道支持全额退款/g,'执行前须准备支持全额退款的测试支付渠道').replace(/测试渠道可全额退款/g,'执行前须准备可全额退款的测试渠道'));
   r.必要条件.push('环境准备要求：支付测试渠道、测试账号及本条所需支付或退款回调当前未具备；执行前由技术提供并确认仅影响测试交易');
 }
}
// The admin recharge detail does not expose the per-user purchase-limit counter.
for(const title of ['验证已全额退款不恢复活动限购']) {
 const at=plans.findIndex(p=>p.规则.用例设计.场景===title);
 if(at>=0){const [p]=plans.splice(at,1);rules.splice(rules.indexOf(p.规则),1);}
}
transitions.find(t=>t.状态转换标识==='ST-ROLE-DISABLE').证据引用=[ref(3479)];
// Reviewed equivalent paths: retain the more concrete path and union only its supporting evidence.
for(const [drop,keep] of [
 ['验证终审驳回使当前申请作废','验证平台驳回后申请终止'],
 ['验证直播结束不保持原场次运行','验证确认结束后进入主播结束页'],
 ['验证排班结束等于开始不能保存','验证排班结束时间等于开始'],
 ['验证排班结束早于开始不能保存','验证排班结束早于开始']
 ,['验证主播按加入时间倒序','验证主播列表按加入时间从新到旧']
]) {
 const i=plans.findIndex(p=>p.规则.用例设计.场景===drop), target=plans.find(p=>p.规则.用例设计.场景===keep);
 if(i<0||!target)throw new Error(`未找到复核合并对象 ${drop}`);
 const [old]=plans.splice(i,1);rules.splice(rules.indexOf(old.规则),1);
 for(const n of old.来源行)if(!target.来源行.includes(n)){target.来源行.push(n);target.规则.证据引用.push(ref(n));}
 if(old.状态转换标识 && !target.状态转换标识)target.状态转换标识=old.状态转换标识;
 target.规则.用例设计.备注.push(`本轮语义去重：合并同一结果路径“${drop}”，不读取历史用例。`);
}
