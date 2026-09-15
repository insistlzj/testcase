import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {hash} from '../../scripts/evidence-discovery.mjs';
const dir=import.meta.dirname;
const inventory=JSON.parse(await fs.readFile(`${dir}/page-inventory.json`));
const pages=new Map(inventory.pages.map(p=>[`${p.end}:${p.key}`,p]));
const overview='liveshow-proto/context/系统概要 .md';
// Explicit source-priority decisions. These replace only the identified conflicting assertion.
const override={
 'AN-183744e9e97d':'公会或平台驳回后，本次入会申请作废；用户可以重新选择公会并提交新申请，重新经过公会初审和平台终审。',
 'AN-41fe17955ff4':'公会审核通过后自动进入平台审核，无需用户再次提交；平台驳回后本次申请作废，重新申请必须重新经过公会初审。',
 'AN-42549dbbfb76':'平台驳回后本次申请作废；用户重新申请时生成新申请，重新经过公会初审和平台终审。',
 'AN-44d825b977cb':'页面提示：说明当前审核阶段及后续可执行动作；公会或平台驳回均提示重新申请。',
 'AN-1d6ae3e6dc73':'平台驳回后，本次入会申请作废；点击重新申请进入公会选择并提交新申请，不沿用原公会通过结果。',
 'AN-6c86438317ac':'点击申请资料在当前步骤展开或收起；去加入及公会或平台驳回后的重新申请，进入公会选择页。',
 'AN-048c1429bc77':'开播需满足账号可用、公会有效、主播认证通过和最终直播权限开启。平台关闭时最终关闭；平台开启且未锁定时采用公会开关；平台开启且锁定时最终开启，公会开关只读并跟随平台；解锁恢复锁定前公会设定并重新计算。',
 'AN-38f38c6d49d3':'接受一条邀请并建立连麦后，自己发出的邀请失效，其他收到的邀请保留；连麦中不能接受其他邀请或发起新邀请。',
 'AN-e981a0887e6f':'运营账号点击我的装扮入口提示“运营账号无法操作”，不得进入查看、佩戴或购买流程；虚拟金币仅可赠送普通礼物和定制礼物。',
 'AN-10292fb62ca4':'数据来自已开始的直播场次；场次结束后保留历史快照。充值订单退款或拒付不撤销已完成消费，对应主播收益和分成不受影响。',
 'AN-58bdfd055651':'收礼值的真实金币部分：周期内主播成功收到的礼物单价 × 数量之和。幸运礼物按送出价值计算，返奖不冲减收礼值。',
 'AN-e1486eaedae9':'主播榜按收礼主播汇总真实金币赠礼；运营虚拟金币是否计入该榜的具体范围另见风险清单。',
 'AN-9076ce003939':'贡献榜统计真实用户的送礼贡献；运营账号是否进入该榜的具体范围另见风险清单。',
 'AN-5ac308118a3b':'贡献值的真实金币部分：周期内用户成功送出的各礼物单价 × 数量之和。幸运礼物按送出价值计算，返奖不冲减贡献值。',
 'AN-25e88756980b':'本场贡献的真实金币部分：当前场次内成功送出的各礼物单价 × 数量之和；幸运礼物返奖不冲减本场贡献。',
 'AN-020e40af1cf9':'本场贡献的真实金币部分：当前场次内成功送出的各礼物单价 × 数量之和；幸运礼物返奖不冲减本场贡献。',
 'AN-cfe78c65542c':'本场贡献值的真实金币部分：当前场次内成功送出的各礼物单价 × 数量之和；幸运礼物返奖不冲减贡献值。',
 'AN-ba0acac09cff':'虚拟金币送礼可计入直播间氛围和榜单展示，但不形成主播收益或分成；具体榜单范围另见风险清单。',
 'AN-b6fb5bbc0bad':'粉丝等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。',
 'AN-a426a911d2f5':'失败或撤销赠送不计入贡献；有效消费冲正后重新计算贡献值和排名。充值退款不撤销已完成的礼物消费。',
 'AN-24493f38a0ee':'排序所需等级缺失时按 0 级处理；有效消费冲正后重新计算贡献值和排名。账号注销后保留历史贡献，名称显示“账号已注销”，不能进入主页。充值退款不撤销已完成消费。',
 'AN-dda781796f7c':'排序所需等级缺失时按 0 级处理；有效消费冲正后重新计算贡献值和排名。账号注销后保留历史贡献，名称显示“账号已注销”，不能进入主页。充值退款不撤销已完成消费。',
 'AN-bbb10e3b591b':'虚拟金币仅可赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；可计入直播间氛围和榜单展示，不形成主播收益或分成。',
 'AN-7861fb19ad1a':'虚拟金币仅可赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；运营账号可以发送消息但不能加入粉丝团；虚拟送礼可计入氛围和榜单展示，不形成主播收益或公会分成。',
 'AN-29d3d78e9e67':'虚拟送礼可计入公屏氛围和榜单展示，不计入真实消费、主播收益或分成；幸运礼物不能使用虚拟金币赠送。',
 'AN-1efa5ce84ce1':'通过退会申请前必须二次确认；原型尚未实现该确认，但业务要求明确。',
 'AN-367024f7e91b':'新增粉丝是新增关注人数，为非负数；取消关注不扣减新增粉丝。',
 'AN-8f6c5ac9d444':'粉丝数取当前关注该主播的用户人数，不使用周期涨粉汇总代替。',
 'AN-16f1d377c809':'存在未结清收益时禁止移出主播；原型尚未接入判断，但业务要求明确。',
 'AN-012481b9281d':'跨日或跨月开播人数按主播去重，不能取每日人数最大值，也不能累加每日去重人数。',
 'AN-2f56fef4b111':'头像或昵称保存校验失败或网络异常时保留编辑内容，不修改已生效的原资料；成功、不合规、网络异常是独立业务结果，不能按点击次数交替判定。',
 'AN-1a2efdd41676':'页面展示连续签到天数、已签到日、今天及后续金币奖励；各天奖励取当前后台配置，不固定为演示金额。',
 'AN-8d2a1570a53b':'公会通知进入通知列表；角标为当前未读通知数量，0 条时隐藏。直播记录入口关联独立直播记录页，当前原型尚未完成真实跳转。',
 'AN-24a6a7b16986':'点击套餐价格按钮发起支付；本页无支付渠道选择控件。',
 'AN-7fdf6bcdd026':'分成记录按日期展示已上传的线下结算结果；点击后的详情入口与内容尚未由实际页面定义。',
 'AN-ded61b7178e8':'最终开播权限以系统概要的权限矩阵为准：账号可用、公会有效、认证通过；平台关闭则最终关闭；平台开启且未锁定时取公会开关；平台开启且锁定时最终开启，解锁后恢复原公会设置。',
 'AN-7dc268a2e28c':'变动类型包含充值、充值退款、礼物打赏、购买门票和当前业务实际发生的奖励入账；不提供礼物退款，已完成的礼物与门票消费不可退回。',
 'AN-baf51bbbcd73':'有效消费冲正后重新计算收礼值和排名；充值退款不撤销已完成送礼。账号注销后保留历史数值，名称显示“账号已注销”，不能进入主页。',
 'AN-0c3f301d1309':'有效消费冲正后重新计算贡献值和排名；充值退款不撤销已完成送礼。账号注销后保留历史数值，名称显示“账号已注销”，不能进入主页。',
 'AN-b27eb79b7d5d':'失败或撤销的赠送不计入贡献；有效消费冲正后重新计算贡献值和排名，充值退款不撤销已完成送礼。',
 'AN-2461ddda09db':'失败或撤销赠送不计入；有效消费冲正后重新计算贡献值和排名，充值退款不撤销已完成送礼。',
 'AN-6b16656f275c':'游客可浏览并进入邀请好友页；签到、领奖和充值操作跳转登录。运营账号可浏览福利一级页，点击其中任意功能入口提示“运营账号无法操作”，不参与签到、任务及领奖。',
};
const overrideBasis={
 'AN-1efa5ce84ce1':'本条批注已明确二次确认要求，不能把未实现误作需求缺口',
 'AN-367024f7e91b':'批注明确的统计口径覆盖 Mock 示例',
 'AN-8f6c5ac9d444':'批注明确的当前关注人数覆盖 Mock',
 'AN-16f1d377c809':'批注明确禁止移出条件，原型实现不足不取消规则',
 'AN-012481b9281d':'批注明确去重口径覆盖 Mock 最大值算法',
 'AN-2f56fef4b111':'保留业务成功/失败分支，排除原型循环演示逻辑',
 'AN-1a2efdd41676':'后台配置优先于页面演示数值',
 'AN-8d2a1570a53b':'当前原型页面树存在独立直播记录页，Toast 仅为未完成跳转',
 'AN-24a6a7b16986':'保留支付入口，排除原型支付提示模拟',
 'AN-7fdf6bcdd026':'保留已确定的分成记录；详情行为缺口独立隔离'
};
const result=[],audit=[],seenOverrides=new Set();
const riskSection=section=>/待确认/.test(section);
for(const [end,label]of [['user','用户App'],['guild','公会App'],['admin','管理后台']]){
 const atoms=JSON.parse(await fs.readFile(`${dir}/${end}-annotation-atoms.json`));
 for(const atom of atoms){
  const p=pages.get(`${label}:${atom.页面}`);assert(p,atom.页面);
  let body=String(atom.原文).replace(/^\d+[.、]\s*/,'').trim(),field='';
  const source={路径:atom.文件,位置:atom.位置,原文:atom.原文,原子标识:atom.标识};
  const base={end:label,module:p.module,page:p.key,parent:p.parent,pageName:p.name.split(/[·|]/)[0].trim(),source};
  if(/^\|[\s:|-]+\|$/.test(body)||/^\|\s*(字段|项目|指标)\s*\|\s*(规则|说明|含义|数据|计算方式)/.test(body)){
   audit.push({...base,status:'不适用',reason:'表格列头或分隔线，没有业务断言'});continue;
  }
  if(override[atom.标识]){body=override[atom.标识];seenOverrides.add(atom.标识);audit.push({...base,status:'已替代',reason:overrideBasis[atom.标识]||'系统概要的身份、权限、连麦、资金隔离及运营白名单优先于相冲突的原型批注',replacement:body,basis:overview});}
  if(body.startsWith('|')){const cells=body.replace(/^\||\|$/g,'').split('|').map(s=>s.trim());field=cells.shift();body=cells.join('；');}
  if(['场景','场景描述'].includes(atom.章节)){result.push({...base,id:`META-${hash([label,p.key,body]).slice(0,12)}`,kind:'页面说明',field,body});continue;}
  if(atom.章节==='原型范围'||['AN-a6a4387ccd2c','AN-340c668ae824'].includes(atom.标识)){audit.push({...base,status:'不适用',reason:'原型演示范围或固定角色交替演示，不是产品业务规则'});continue;}
  const kind=riskSection(atom.章节)&&!override[atom.标识]?'需求待确认':'需求';
  body=body.replace(/原型演示时，点击未获得商品交替展示金币满足和不足状态；实际状态根据用户实时金币余额判断。/g,'实际购买状态根据用户实时金币余额判断。')
    .replace(/；查看器「视图-空白」可演示。/g,'。').replace(/示例数据的 5 条不代表数量上限。/g,'公会数量不固定为 5 条。');
  result.push({...base,id:`REQ-${hash([label,p.key,field,body]).slice(0,12)}`,kind,field,body,priorityDecision:override[atom.标识]?{依据:overrideBasis[atom.标识]||overview,原文:atom.原文}:null});
 }
}
assert.deepEqual([...seenOverrides].sort(),Object.keys(override).sort(),'Unmatched explicit correction');
await fs.writeFile(`${dir}/requirements-curation-draft.json`,JSON.stringify({来源:'当前系统概要、实际页面树、三端结构化批注',状态:'待完成细粒度拆分与语义核对',条款:result,处置:audit},null,2)+'\n');
console.log(JSON.stringify({条款:result.length,需求:result.filter(r=>r.kind==='需求').length,页面说明:result.filter(r=>r.kind==='页面说明').length,已显式标注问题:result.filter(r=>r.kind==='需求待确认').length,优先级修正:seenOverrides.size,结构及演示排除:audit.filter(x=>x.status==='不适用').length},null,2));
