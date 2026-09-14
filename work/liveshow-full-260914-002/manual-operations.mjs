import {test,ref,add,page,designs} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
const compose='guild-operation-account-compose.html',detail='guild-operation-account-detail.html';
for(const [accountRemaining,guildRemaining]of [[100,200],[200,100],[0,100],[100,0]]){
 const limit=Math.min(accountRemaining,guildRemaining);
 test(compose,'本次可发上限：',`创建运营账号剩余额度${accountRemaining}与${guildRemaining}`,[`单账号月剩余额度${accountRemaining}，公会月剩余额度${guildRemaining}`],['打开新建运营账号'],`本次可发上限=${limit}虚拟金币`,{point:'虚拟金币双额度',calc:calculation('min',[accountRemaining,guildRemaining],['账号剩余','公会剩余'],'虚拟金币'),flow:'FLOW-VIRTUAL-ISSUE'});
}
for(const amount of [-1,0,99,100,101])test(compose,'发放金币：',`创建运营账号初始发放${amount}`,['公会G1可用，单账号与公会本次可发上限均100；账号、名称、头像、初始密码已经按新建表单准备'],['打开新建运营账号',`输入发放金币“${amount}”`,'点击“确认创建”'],amount>=0&&amount<=100?`创建账号并发放${amount}虚拟金币`:'不创建超额或负发放账号',{point:'创建时发放边界',dimension:'输入边界',flow:'FLOW-VIRTUAL-ISSUE'});
for(const length of [5,6,7])test(compose,'初始密码：',`运营账号初始密码${length}位`,['其他新建字段均为有效值，发放金币0'],['打开新建运营账号',`输入由${length}个“a”组成的初始密码`,'点击“确认创建”'],length>=6?'创建运营账号':'不保存少于6位的初始密码',{point:'运营初始密码长度',dimension:'输入边界'});
test(compose,'全平台唯一','不同公会不能创建同名登录账号',['G1已存在登录账号ops_a，当前公会G2新建字段均完整'],['打开新建运营账号','输入账号“ops_a”','点击“确认创建”'],'不创建重复登录账号',{point:'运营账号平台唯一性'});
for(const target of ['账户余额','本月发放','本月消费','累计消费']){
 const vals={'账户余额':70,'本月发放':100,'本月消费':30,'累计消费':80};
 test(detail,'账户余额：',`运营账号${target}的统计口径`,['本月发放100，往月发放50；本月消费30、往月消费50，无其他虚拟金币流水'],['打开运营账号A主页'],`${target}显示${vals[target]}虚拟金币`,{point:`虚拟${target}口径`});
}
for(const result of ['账号不能登录','账号不能送礼','原虚拟余额保留','历史消费记录保留'])test(detail,'禁用后不可登录',`公会禁用运营账号后${result}`,['运营账号A已启用且余额100，存在消费记录C1；平台未锁定公会管理'],['打开A运营账号主页','关闭启用开关','确认停用'],result,{point:'运营账号停用影响',flow:'FLOW-OPERATION-STATUS'});
test(detail,'重新启用后恢复','公会重新启用运营账号',['A停用，余额100，公会可管理'],['打开A运营账号主页','开启启用开关','确认启用'],'恢复A的登录及普通定制送礼资格',{point:'运营账号恢复',flow:'FLOW-OPERATION-STATUS'});
for(const action of ['启停','发放金币'])test(detail,'仅可查看',`平台锁定后公会不能${action}`,['A所属公会管理权限已被平台锁定'],['打开A运营账号主页'],`${action}操作不可用`,{point:'运营账号管理锁定',dimension:'权限差异',flow:'FLOW-OPERATION-LOCK'});
for(const [action,expected]of [['锁定公会管理权限','公会不能启停或发放金币'],['解除公会管理权限锁定','公会恢复管理运营账号的权限'],['停用','运营账号不可登录或送礼'],['启用','运营账号恢复启用状态']])test('admin-operation-account-detail.html','平台可启停',`平台${action}运营账号`,['运营账号A由G1创建，当前状态允许该次变化'],['打开A运营账号主页',`点击“${action}”`,'确认变更'],expected,{point:'平台运营账号控制',flow:action.includes('锁定')?'FLOW-OPERATION-LOCK':'FLOW-OPERATION-STATUS'});
for(const key of ['admin-operation-accounts.html','admin-operation-issue-records.html'])test(key,key.includes('issue')?'平台不执行发放':'平台不创建',`${page(key).name}不越权发币`,['运营账号A属于G1'],[`打开${page(key).entry}`],'不提供平台发放虚拟金币操作',{point:'虚拟金币发放职责',dimension:'权限差异'});
const controls='admin-operation-guild-controls.html';
for(const total of [99,100,101])test(controls,'公会总上限不得低于',`公会月已发100时上限改为${total}`,['G1本月累计已发100，单账号最高已发50，单账号上限50'],['打开G1额度限制',`输入公会总上限“${total}”`,'点击“保存”'],total>=100?`保存公会总上限${total}`:'不保存低于本月已发放额的上限',{point:'公会总额度下界',dimension:'输入边界',flow:'FLOW-VIRTUAL-ISSUE'});
for(const single of [49,50,99,100,101])test(controls,'单账号上限不得低于',`单账号月已发最高50、总上限100时保存${single}`,['G1单账号本月最高已发50，公会总上限100且已发总额100'],['打开G1额度限制',`输入单账号上限“${single}”`,'点击“保存”'],single>=50&&single<=100?`保存单账号上限${single}`:'不保存超出50至100的单账号上限',{point:'单账号额度双边界',dimension:'输入边界',flow:'FLOW-VIRTUAL-ISSUE'});
for(const total of [100,200])test(controls,'本月剩余额度：',`公会剩余额度总${total}已发100`,[`公会上限${total}，本月已发100`],['打开G1额度限制'],`本月剩余额度=${total-100}虚拟金币`,{point:'公会剩余额度',calc:calculation('-',[total,100],['公会总额','已发额'],'虚拟金币')});
// The operation role uses the user app; only the relevant source specifies this cross-end applicability.
const asUser=(key,word,target)=>({...ref(key,word),page:page(target)});
for(const type of ['普通礼物','定制礼物','幸运礼物'])add(asUser('admin-operation-account-detail.html','不可发幸运礼物','views/live-room/gift.html'),{label:`运营账号赠送${type}`,given:['运营账号A已处于用户App有效会话，虚拟余额1000，无账号或房间访问限制',`${type}G已上架，单价10`],steps:['打开直播间礼物面板',`选择${type}G`,'点击“赠送”'],expected:type==='幸运礼物'?'不可赠送幸运礼物':`成功赠送${type}G`,point:'运营赠礼类型',role:'运营账号',flow:'FLOW-VIRTUAL-SPEND',dimension:'权限差异'});
for(const type of ['门票房','密码房'])add(asUser('admin-operation-account-detail.html','免票、免密码','live-room.html'),{label:`运营账号免验证进入${type}`,given:[`运营账号A处于用户App有效会话，目标${type}S1正在直播且无其他准入限制`],steps:['打开S1直播间'],expected:'直接展示直播内容',point:'运营账号房间准入',role:'运营账号',dimension:'权限差异'});
for(const effect of ['主播收益','公会分成'])test('guild-operation-gift-records.html','不计入主播收益或分成',`运营虚拟金币不计${effect}`,['运营账号A向主播B成功送出价值100虚拟金币的普通礼物'],['打开运营账号送礼记录','查看该笔送礼详情'],`该笔虚拟赠礼不计入${effect}`,{point:'虚拟与真实账务隔离',flow:'FLOW-VIRTUAL-SPEND'});
test('admin-operation-gift-records.html','消费金币：','虚拟送礼按单价数量计算',['运营账号A以虚拟金币赠送普通礼物，单价20、数量3'],['打开该笔运营账号送礼详情'],'消费金币=60虚拟金币',{point:'虚拟礼物扣款计算',calc:calculation('*',[20,3],['单价','数量'],'虚拟金币'),flow:'FLOW-VIRTUAL-SPEND'});
test('admin-operation-issue-records.html','发放后余额：','公会发币后余额计算',['运营账号A发放前余额50，所属公会成功发放100'],['打开该笔发放记录'],'发放后余额=150虚拟金币',{point:'虚拟发放余额',calc:calculation('+',[50,100],['发放前余额','发放金币'],'虚拟金币'),flow:'FLOW-VIRTUAL-ISSUE'});
export default designs;
