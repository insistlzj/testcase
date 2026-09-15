import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {hash} from '../../scripts/evidence-discovery.mjs';
import {questions} from './requirements-questions.mjs';
const dir=import.meta.dirname,project='liveshow-proto';
const curated=JSON.parse(await fs.readFile(`${dir}/requirements-curation-draft.json`));
const rawPages=JSON.parse(await fs.readFile(`${dir}/page-inventory.json`)).pages;
const questionRows=questions.map(([key,module,scene,question,options,atoms,ends])=>({id:`PENDING-${key}`,module,scene,question,options,atoms,ends}));
const qByAtom=id=>questionRows.filter(q=>q.atoms.includes(id));
const kept=[],excluded=[...curated.处置],riskLinks=[];
for(const r of curated.条款){
 if(r.kind==='需求待确认'){
  assert(qByAtom(r.source.原子标识).length,`Unassigned question ${r.source.原子标识}`);
  riskLinks.push({...r,questions:qByAtom(r.source.原子标识).map(q=>q.id)});continue;
 }
 if(r.kind==='页面说明'){kept.push(r);continue;}
 let body=r.body.replace(/模拟系统通知授权弹窗/g,'系统通知授权弹窗');
 if(r.source.原子标识==='AN-a7de732767b6'){body='金币奖励领取后进入钱包，并生成金币资产记录。';riskLinks.push({...r,questions:['PENDING-reward-prop-conflict']});}
 if(/待确认/.test(body)){
  assert(qByAtom(r.source.原子标识).length,`Unassigned mixed risk ${r.source.原子标识}`);
  const parts=body.split(/([；。])/);let cleaned='';
  for(let i=0;i<parts.length;i+=2)if(parts[i]&&!/待确认/.test(parts[i]))cleaned+=parts[i]+(parts[i+1]||'');
  riskLinks.push({...r,questions:qByAtom(r.source.原子标识).map(q=>q.id)});body=cleaned;
 }
 if(r.source.原子标识==='AN-7fdf6bcdd026'){body='分成记录按日期展示已上传的线下结算结果。';riskLinks.push({...r,questions:['PENDING-share-detail']});}
 if(r.source.原子标识==='AN-3bc6aef15073'){body='返回进入粉丝群聊天页。';riskLinks.push({...r,questions:['PENDING-group-report']});}
 if(r.source.原子标识==='AN-1902e4f47a69')body='点击粉丝团设置进入设置页；成员资料查看只依据实际成员身份和资料卡入口，不以原型 Toast 证明存在独立详情页。';
 body=body.replace(/原型尚未实现该确认，但业务要求明确。|原型尚未接入判断，但业务要求明确。|当前原型尚未完成真实跳转。/g,'').replace(/；[；。]/g,'。').trim();
 if(!body){excluded.push({...r,status:'待确认',reason:'该条仅包含未决定事项，完整保留于需求待确认',questions:qByAtom(r.source.原子标识).map(q=>q.id)});continue;}
 kept.push({...r,body,id:`REQ-${hash([r.end,r.page,r.field,body]).slice(0,12)}`});
}
const targets={用户App:'01-用户主播App-项目需求清单.md',公会App:'02-公会App-项目需求清单.md',管理后台:'03-管理后台-项目需求清单.md'};
const overviewText=await fs.readFile(`${project}/context/系统概要 .md`,'utf8');
const overviewHash=hash(overviewText);
// Additional common requirements are direct summary clauses; page entry is separately bound below.
const common=[
 ['COMMON-language','用户App、公会App 支持中文、English、Bahasa Indonesia、Bahasa Melayu；管理后台一期交付中文。','1.2 端口语言'],
 ['COMMON-identity','同一用户同一时刻只能有一笔处理中入会申请且只能属于一个公会。公会通过后自动进入平台终审，但尚未加入公会或成为主播。任一级驳回使申请作废，重新申请必须走新的公会初审和平台终审。平台通过后才建立公会关系和主播身份。','3.1.2 主播的入会/退会'],
 ['COMMON-guild-stop','平台停用公会后，公会不可被搜索，公会长不能登录，主播关系解除，名下主播失去身份并停止开播，业务历史保留且后台可查看。单独停用公会长账号只影响该账号登录，不影响主播。','3.2 公会账号与权限'],
 ['COMMON-permission','直播权限与主播身份分开。平台关闭时最终禁止开播；平台开启且未锁定时按公会开关；平台开启且锁定时最终允许开播，公会设置只读并跟随平台，原值被保留；解锁恢复原公会设定并重算。最终权限被关闭立即结束正在进行的直播，不能再开播。','3.2.3 开播权限'],
 ['COMMON-session','主播拥有固定直播间 ID，每次开播生成新的场次 ID。场次结束保留封面、标题和统计快照，当前配置修改不改写历史场次。','3.2.1 直播场次'],
 ['COMMON-cohost','仅普通房的两位未连麦主播且无账号拉黑关系可连麦。只能发出一个邀请，可收到多个邀请。接受邀请使自己发出的邀请失效，其他收到的邀请保留；连麦中不能再发起或接受邀请。结束连麦后双方各自直播继续；任一方结束直播使其邀请和连麦失效。','3.2.4、3.3.4 连麦'],
 ['COMMON-ticket','门票只对当前场次有效，同场重复进入不再扣款；被踢出或场次结束后失效且不退款。账号封禁、账号拉黑、本场踢出优先于准入资格；运营账号免票。','3.2.2、3.3.2、3.7.1'],
 ['COMMON-consume','真实金币共用同一账户，不可提现。消费成功只扣款一次并生成消费记录，余额不足或条件检查失败不扣款；负数余额不能继续消费。','3.5.1 金币充值与消费'],
 ['COMMON-refund','只有充值订单支持退款或渠道拒付，用户端没有退款操作。退款扣除原订单全部到账金币，余额不足允许为负数；后续充值先抵扣负余额。退款不撤销已完成的送礼或门票消费，不回滚主播收益和分成。','3.5.5、3.6.1'],
 ['COMMON-income','普通礼物、定制礼物和门票按实际成功消费金币 1:1 形成主播收益；幸运礼物按送出礼物价值乘后台比例，默认 1%，返奖不影响该收益；虚拟、失败或撤销消费不形成收益。','3.6.1 主播收益'],
 ['COMMON-finance','系统不提供线上结算申请或审批，也不计算具体分成金额。财务在线下依据报表核算和结算，系统上传结果并供相关端只读查看；资金示例中的三方比例不构成固定计算规则。','3.6.2、3.6.3'],
 ['COMMON-operation','运营账号由所属公会创建并发放虚拟金币；平台只可启停、锁定公会管理和设置月额度，不创建或发币。真实和虚拟金币完全隔离，虚拟金币仅可赠送普通及定制礼物，不形成主播收益或分成。','3.7 运营账号'],
 ['COMMON-operation-whitelist','运营账号首页功能可用；福利页可浏览，但点击任意功能提示“运营账号无法操作”。消息可私信和使用好友功能，但不可加入粉丝团。我的允许编辑资料、未受限设置、关注、粉丝、好友、黑名单和客服；充值、我的装扮、粉丝团、邀请奖励、开播、主播中心、公会中心及绑定手机/邮箱、注销登录均提示“运营账号无法操作”。','3.7.4 运营账号功能白名单'],
 ['COMMON-report-end','仅正在直播的场次提供举报入口。直播场次结束后，待处理举报工单自动作废，不能处罚下一场直播；账号举报与场次举报分别处理。','3.4 举报与处置机制'],
 ['COMMON-mute','直播禁言仅限制当前场次公屏，下场恢复；群禁言仅限制对应粉丝群发言。每名主播最多 3 名房管，授权跨场次持续，房管可禁言、踢出和屏蔽单条评论。','3.3.2、3.3.3'],
 ['COMMON-fan-exit','用户被移出或主动退出粉丝群后，失去团籍和群权限并卸下身份标识，粉丝等级和亲密度清零，重新加入从零累计；关注关系不因退团自动解除。','3.3.3 粉丝群'],
 ['COMMON-virtual-board','虚拟金币可以计入氛围和榜单展示，但具体榜单范围存在下级批注冲突，必须按 PENDING-virtual-board 确认；真实金币榜单的排序和计算规则独立有效。','3.7.3 虚拟金币隔离'],
];
const requirements={条款:kept,问题:questionRows,问题关联:riskLinks,原始处置:excluded,公共规则:common,概要:{路径:`${project}/context/系统概要 .md`,SHA256:overviewHash}};
await fs.writeFile(`${dir}/requirements-source-ledger.json`,JSON.stringify(requirements,null,2)+'\n');
for(const [end,file]of Object.entries(targets)){
 const rows=[`# ${end}当前需求清单`,'',`本次依据当前系统概要、当前原型入口和结构化批注重新整理；不以旧用例、旧扫描或旧生成结果为业务来源。系统概要优先，原型和批注补充。`,'','## 公共业务规则'];
 for(const [id,body,section]of common)rows.push(`- [${id}] ${body}〔依据：context/系统概要 .md / ${section}〕`);
 let last='';
 for(const r of kept.filter(r=>r.end===end)){
  if(last!==r.page){const p=rawPages.find(p=>p.end===end&&p.key===r.page);rows.push('',`## ${r.module} / ${r.pageName}`,`页面：${r.page}；实际承载：${p.file}；${p.view?'同一实体页面的状态或弹层视图':'实体页面'}。`);last=r.page;}
  rows.push(`- [${r.id}] ${r.kind==='页面说明'?'页面用途：':''}${r.field?`${r.field}：`:''}${r.body}〔来源：${r.source.原子标识}；${r.source.路径}；${r.source.位置}〕`);
 }
 rows.push('','## 需求待确认（不作为确定业务规则）');
 for(const q of questionRows.filter(q=>q.ends.includes(end)))rows.push(`- [${q.id}] ${q.scene}：${q.question} 选项：${q.options.map((s,i)=>`${String.fromCharCode(65+i)}. ${s}`).join('；')}。影响端：${q.ends.join('、')}。依据：${q.atoms.join('、')}。`);
 await fs.writeFile(`${dir}/${file}`,rows.join('\n')+'\n');
}
console.log(JSON.stringify({需求:kept.filter(r=>r.kind==='需求').length,页面说明:kept.filter(r=>r.kind==='页面说明').length,独立问题:questionRows.length,公共规则:common.length,原子处置:excluded.length},null,2));
