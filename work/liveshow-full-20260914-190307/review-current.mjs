import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {hash} from '../../scripts/evidence-discovery.mjs';
import {ruleDesignHash,validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';
const task='work/liveshow-full-20260914-190307';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const model=await read(`${task}/mainbasis-model.json`),draft=await read(`${task}/scenario-design-draft.json`),rules=await read(`${task}/rule-design-draft.json`),language=await loadTestcaseLanguageRules();
assert.equal(hash(await fs.readFile(model.formal.路径,'utf8')),model.formal.SHA256);
const plans=new Map(draft.场景.map(p=>[p.id,p]));
// These decisions were made against the current MainBasis and recipe text. They are
// deliberately local: a missing observation path does not invalidate other scenarios.
const isolated=[
 [/配置等级不直接增加钱包金币/,'当前步骤只操作等级配置，没有本执行角色的金币流水观察位置；保留独立覆盖缺口'],
 [/任务不产生新进度/,'停用或过期后页面是否保留任务入口尚不能由本条证明；不能直接观察隐藏任务的进度'],
 [/非好友发送好友申请/,'发送方是否能查看该笔待处理申请状态没有明确入口；保留发起与接收方状态同步缺口'],
 [/存在待处理好友申请时不重复申请/,'需要可定位申请编号或接收队列证明没有第二条记录；当前步骤未提供'],
 [/退团后的成长值/,'退团后本端不再有原团成长值查看权限；新加入重置已另行设计'],
 [/退团后的身份标识/,'退出群管理后缺少该身份标识实际观察位置，未通过角色与入口核对'],
 [/我的展示 10 枚/,'与同时最多佩戴5枚的正常可准备条件不一致，不能把显示上限当成可构造状态'],
];
const approved=[],excluded=[],changes=[];
const mutate=(r,label,fn)=>{fn();changes.push({规则:r.稳定规则标识,修改:label});};
for(const entry of rules){
 const r=entry.规则,p=plans.get(entry.场景标识),signature=p.description+' '+p.point;
 const exclusion=isolated.find(([re])=>re.test(signature));
 if(exclusion){excluded.push({...entry,原因:exclusion[1],性质:'生成覆盖缺口，不是未确认业务规则'});continue;}
 if(p.description==='相同时间通知按编号倒序'){
  excluded.push({...entry,原因:'与本次既有同时间通知排序场景语义相同，编号示例变化不构成新覆盖',性质:'本次语义重复'});continue;
 }
 if(p.page==='用户App:my-decoration.html'&&p.description.includes('到期'))mutate(r,'明确原有效道具已到期的先后关系',()=>{r.必要条件=r.必要条件.map(c=>c.includes('拥有有效头像框')?c.replace('拥有有效','在到期前拥有有效'):c);});
 if(p.page==='用户App:profile.html'&&p.role==='运营账号')mutate(r,'移除普通账号身份与运营账号角色的矛盾',()=>{r.必要条件=r.必要条件.map(c=>c.replace('当前普通用户甲','当前运营账号甲'));});
 if(p.description.includes('运营账号名称')||p.description.includes('运营账号初始密码')||p.description.includes('运营账号初始发放')||p.description.includes('创建运营账号的'))mutate(r,'成功创建数据使用同时兼容邮箱限制的账号',()=>{r.必要条件=r.必要条件.map(c=>c.replace('qa_ops_9001','qa_ops_9001@example.com'));});
 if(p.description.startsWith('运营账号账号为 '))mutate(r,'账号长度测试使用合法邮箱，不对待确认的普通登录名作决定',()=>{
  const n=Number(p.description.match(/为 (\d+)/)[1]),value='a'.repeat(n-12)+'@example.com';
  r.用例设计.步骤=r.用例设计.步骤.map(s=>s.操作.includes('个字母 a 作为账号')?{...s,动作:'输入',对象:`账号 ${value}`,操作:`输入账号 ${value}`} :s);
 });
 if(p.description==='提交资料完整的入会申请'||p.description.endsWith('驳回后重新提交入会申请'))mutate(r,'入会申请补全本人照片必填步骤',()=>{
  const i=r.用例设计.步骤.findIndex(s=>s.操作.includes('点击提交'));
  r.用例设计.步骤.splice(i,0,{执行角色:r.执行角色,动作:'上传',对象:'申请人本人测试照片',操作:'上传申请人本人测试照片',证据:r.用例设计.观察证据});
 });
 if(p.description==='门票订单的主播收益')mutate(r,'一笔门票使用一张，避免不可准备的同场购票三张',()=>{
  r.必要条件=r.必要条件.map(c=>c.replace('商品 3 件','门票 1 张').replace('幸运礼物返奖合计 50 金币，幸运收益配置为 1%','无礼物返奖'));
  const c=r.用例设计.计算;c.变量.find(x=>x.名称==='数量').数值=1;c.最终值=100;r.目标状态或可观察结果='主播收益 = 100 金币';
 });
 if(p.description==='观众密码输入9999'&&p.point==='密码校验提示')mutate(r,'采用来源完整密码错误文案',()=>{r.目标状态或可观察结果='提示“密码错误，请重新输入”';});
 if(p.description==='赠送100金币礼物时余额 99')mutate(r,'观察不足余额对应充值入口',()=>{r.目标状态或可观察结果='显示余额不足的充值提示';});
 if(p.description==='购买100金币装扮时余额 99')mutate(r,'余额不足视图没有购买按钮，改为观察真实入口',()=>{
  r.用例设计.步骤=[r.用例设计.步骤[0],{执行角色:r.执行角色,动作:'查看',对象:'金币不足提示的操作按钮',操作:'查看金币不足提示的操作按钮',证据:r.用例设计.观察证据}];
  r.目标状态或可观察结果='显示去充值按钮';
 });
 if(p.description.includes('密码使用')&&p.point==='验证码可用性')mutate(r,'改用本表单可观察的验证拒绝结果',()=>{r.目标状态或可观察结果='停留当前密码表单';});
 if(p.description.includes('另一个绑定渠道的验证码'))mutate(r,'使用验证表单观察拒绝而不是内部密码字段',()=>{r.目标状态或可观察结果='停留当前密码表单';});
 if(p.description.startsWith('修改密码')&&p.point==='密码修改校验')mutate(r,'补充旧密码实际登录验证',()=>{
  r.必要条件.push('账号甲绑定邮箱qa.test@example.com；修改前密码OldPass#2026');
  for(const text of ['打开设置','点击退出登录','确认退出','打开邮箱密码登录','输入邮箱qa.test@example.com','输入密码OldPass#2026','点击登录']){
   const action=['打开','点击','确认','输入'].find(v=>text.startsWith(v));r.用例设计.步骤.push({执行角色:r.执行角色,动作:action,对象:text.slice(action.length),操作:text,证据:r.用例设计.观察证据});
  }
  r.目标状态或可观察结果='旧密码OldPass#2026仍可登录账号甲';
 });
 // A detail-row binding asserts the timestamp value, not an undocumented visual format.
 if(p.point.endsWith('与当前对象绑定')&&/时间/.test(p.point))mutate(r,'不擅自规定时间显示格式',()=>{r.目标状态或可观察结果=r.目标状态或可观察结果.replace('显示“','表示测试时刻“');});
 r.用例设计.步骤.forEach(s=>{s.操作=s.操作.replace(/视图-/g,'');s.对象=s.对象.replace(/视图-/g,'');});
 if(p.description==='运营账号查看公会发放后的余额'){
  const source=model.requirements.find(x=>x.field==='发放后余额'&&x.body.includes('发放前余额 + 发放金币'));
  assert(source);r.独立来源规则.push(source.id);r.证据引用.push({路径:model.formal.路径,'SHA-256':model.formal.SHA256,位置:`第 ${source.line} 行；${source.id}`,证明内容:source.field+'：'+source.body,原文:source.raw});
 }
 if(p.point==='观众人数/收益')mutate(r,'将组合字段的计算观察明确为收益',()=>{r.业务对象='直播记录收益';r.用例设计.验证子项='直播记录收益计算';r.用例设计.观察对象='收益';r.目标状态或可观察结果=r.目标状态或可观察结果.replace('观众人数/收益','收益');r.用例设计.场景=r.用例设计.场景.replace('观众人数/收益','收益');});
 if(r.用例设计.计算){
  const c=r.用例设计.计算;
  if(c.结果单位==='USD'&&c.最终值!==Number(c.最终值.toFixed(2))){
   c.变量.push({名称:'美元小数位',业务含义:'USD金额保留两位小数',单位:'无量纲',数值:2});
   c.表达式={运算:'round',参数:[c.表达式,{变量:'美元小数位'}]};c.最终值=Number(c.最终值.toFixed(2));
   r.目标状态或可观察结果=r.目标状态或可观察结果.replace(/=\s*[-\d.e+]+\s*USD/,`= ${c.最终值} USD`);
   changes.push({规则:r.稳定规则标识,修改:'按已确认USD两位小数消除浮点运算残差'});
  }
  c.证据=r.证据引用.flatMap((e,i)=>/[=＝×Σ+/]|合计|总和|累计|之和|汇总|去重|小时|比例|增加余额|扣回|先抵扣|较小值/.test(e.证明内容)?[i]:[]);
  assert(c.证据.length,`公式没有计算口径依据 ${p.id}`);
  for(const variable of c.变量){if(/百分数|小数位|上限|^零$/.test(variable.名称))variable.单位='无量纲';else if(/小时/.test(variable.名称))variable.单位='小时';else if(/秒/.test(variable.名称))variable.单位='秒';}
 }
 r.来源状态=r.必要条件.slice(1).join('；')||r.来源状态;
 r.规则状态='已确认规则';r.可生成正式用例=true;
 r.用例设计.备注.push('示例账号、编号、金额与日期是本条测试数据；执行前按前置条件准备，未填写的产品决策不得自行假定。');
 r.设计复核={状态:'通过',说明:'对本次场景配方及展开条件核对了当前MainBasis中的角色、实际入口、断言和公式；局部不能确认的场景另行隔离。仅证明本条设计可交付，不声明整段需求全部覆盖。',设计SHA256:ruleDesignHash(r)};
 const errors=validateRuleDesign(r,language);assert.deepEqual(errors,[],`${p.id}: ${errors}`);
 approved.push(entry);
}
const payload={schemaVersion:'1.0',业务输入:model.formal,复核时间:new Date().toISOString(),规则:approved,隔离:excluded,修正:changes,说明:'逐场景设计检查与全文覆盖检查分开；隔离不等于产品待确认，不回读历史产物。'};
await fs.writeFile(`${task}/reviewed-design.json`,JSON.stringify(payload,null,2)+'\n');
console.log({正式设计:approved.length,隔离:excluded.length,修正:changes.length});
