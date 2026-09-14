import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '../..'), task = import.meta.dirname;
const project = 'liveshow-proto', formal = `${project}/MainBasis/统一需求文档.md`, risk = `${project}/MainBasis/需求待确认清单.md`;
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const read = file => fs.readFile(path.join(root, file), 'utf8');
const json = async file => JSON.parse(await read(file));
const save = async (file, value) => { await fs.mkdir(path.dirname(path.join(root, file)), {recursive:true}); await fs.writeFile(path.join(root,file), value); };
const all = await Promise.all(['user','guild','admin'].map(async name => ({name,...await json(`work/luma-fresh-260914-001/${name}-upstream.json`)})));
const questions = [], changes = [], mappings = [], records = [];
const makeQuestion = (key, end, module, scene, question, options, known, category='业务规则') => {
  const prior=questions.find(q=>q.key===key); if(prior)return prior.id;
  const id=`Q-${String(questions.length+1).padStart(3,'0')}`;
  questions.push({id,key,end,module,scene,question,options,known,category}); return id;
};
const qPassword=makeQuestion('password-length','用户App','直播模块','主播修改本场密码房密码','房间密码长度采用哪一套约束？',['统一允许 4—12 位数字，创建和修改使用同一约束','创建允许 4—12 位数字，开播后修改必须为 8 位数字'],['结构化批注写 4—12 位数字；公共批注 live-room-host-password/房间密码写修改为 8 位数字；系统概要未定义长度。'],'字段与数据校验');
const qInvite=makeQuestion('invite-reward','用户App、管理后台','首页与发现','成功邀请新用户后发放奖励','邀请金币金额按固定值还是后台配置？',['每次成功邀请固定发放 10 金币，变更不追溯已完成邀请','按邀请成功时后台生效配置发放，保存金额快照，变更不追溯已完成邀请'],['邀请好友批注写每人 10 金币；福利卡片写取后台配置，后台任务支持邀请动作。']);
const qLevels=makeQuestion('level-metrics','用户App、公会App、管理后台','运营配置','消费或收礼后计算账号等级','财富等级的累计值按哪种口径？',['仅累计真实金币成功送礼价值，不扣幸运返奖，不因充值退款回退','仅累计真实金币送礼净消耗，扣幸运返奖，不因充值退款回退'],['财富等级相关页面写有效消费、累计充值/消费、送礼贡献，等级配置明确计入范围待确认。'],'计算与统计口径');
const qProps=makeQuestion('prop-types','管理后台','礼物与道具','管理员切换道具类型','本期预置道具类型采用哪一组？',['仅勋章、气泡、头像框，其他类型通过自定义创建','灯牌、头衔、勋章、座驾、气泡、头像框均为预置类型'],['结构化批注列三类；公共批注列六类。'],'需求范围');
const qOpEdit=makeQuestion('operation-admin-edit','管理后台','运营账号','平台查看运营账号主页','平台是否可以编辑运营账号资料或重置密码？',['平台只读资料，不可编辑或重置密码；由所属公会管理','平台可编辑资料和重置密码，公会仍可管理；不提供平台创建或发币'],['公共批注支持编辑与重置；结构化批注将编辑资料和重置密码归于公会；系统概要只明确平台可启停、不创建、不发币。'],'角色与权限');
const qLiveHint=makeQuestion('live-permission-copy','用户App','主播中心','直播权限关闭后点击开始直播','无开播权限时使用哪种提示？',['显示“暂无开播权限”并停留主播中心','显示“直播权限已关闭，请联系公会”对话框，仅“知道了”关闭'],['结构化批注与公共批注文案不同；都不允许进入开播。'],'交互与文案规则');
const qCohostHint=makeQuestion('cohost-search-copy','用户App','直播模块','按主播 ID 搜索没有可邀请主播','连麦搜索无结果时使用哪段文案？',['查询结果为空或主播未在普通房直播','查询结果为空'],['结构化批注与公共批注文案不同。'],'交互与文案规则');
const qTime=makeQuestion('business-timezone','用户App、公会App、管理后台','数据与收益','任务重置、月度额度和自然日报表跨日','统一业务日界线使用哪个时区？',['统一 Asia/Jakarta（UTC+7）','统一 Asia/Shanghai（UTC+8）'],['多处使用平台统一时区或自然日，未指定时区；榜单周一零点已明确。'],'计算与统计口径');
makeQuestion('task-week','用户App、管理后台','首页与发现','每周任务进入新周期','每周任务从哪一天开始？',['业务时区周一 00:00 开始','业务时区周日 00:00 开始'],['榜单已明确周一；任务批注明确周起始日待确认，不能直接套用榜单规则。'],'流程与状态');
makeQuestion('sign-makeup','用户App、管理后台','首页与发现','用户漏签后请求补签','是否允许补签漏签日期？',['不提供补签，漏签后重新从第 1 天手动签到','允许补签前一个自然日，每日最多补签 1 次并按补签后连续天数发放该日奖励'],['签到批注明确是否支持补签待确认；普通断签重算和每日手动签到已明确。']);
makeQuestion('task-disable-earned','用户App、管理后台','首页与发现','任务已达标、奖励未到当日截止时间，后台停用任务','停用或到期后已达标未过期奖励是否仍可领取？',['仍可领取至原当日截止时间，停用后不产生新进度','停用或到期即失去未领取资格，已领取奖励不回收'],['任务只规定停用不回收已领、停止新进度；未领取权益批注明确待确认。'],'配置和历史数据影响');
makeQuestion('reward-cutoff','用户App、管理后台','首页与发现','任务奖励在当日 23:59 领取','“23:59 之前”以哪个时间点为失效边界？',['当日 23:59:00 起失效','次日 00:00:00 起失效，即包含 23:59 整分钟'],['奖励截止只精确到分钟，未定义最后一分钟的秒级处理。'],'流程与状态');
makeQuestion('admin-password-policy','管理后台','系统配置','新建或重置后台账号密码','后台密码采用哪种长度与字符规则？',['8—32 位，至少包含字母与数字','12—64 位，至少包含大小写字母、数字和符号'],['当前批注要求符合密码策略，但没有策略值。'],'字段与数据校验');
makeQuestion('standalone-cut-stream','管理后台','主播管理','管理员处置直播','是否提供不结束场次的独立断流操作？',['不提供独立断流，终止直播统一结束本场','提供独立断流，保持场次并允许原主播恢复推流'],['系统概要核心能力提到断流，详细状态及现有场次页未定义独立动作和恢复。'],'需求范围');
makeQuestion('user-reset-password','用户App','账号与登录','用户忘记手机号或邮箱登录密码','用户 App 密码找回入口放在哪里？',['在手机号和邮箱密码登录表单增加“忘记密码”，验证相同渠道验证码后设置新密码','本期不提供用户自行找回入口，由客服按账号核验流程处理'],['系统概要列重置密码，当前登录页只有验证码/密码登录入口，未形成找回页面与结果。'],'需求范围');
makeQuestion('join-resubmit-entry','用户App','公会','平台终审驳回后重新申请','终审驳回后的重新申请入口如何承接新入会申请？',['返回公会选择页，重新填写认证资料并提交完整新申请','留在申请页复用原公会，修改材料后提交完整新申请'],['系统概要明确任一方驳回均使申请失效；原型仍只重提平台认证。两方案均重新经过公会初审和平台终审。'],'流程与状态');
const clean = raw => raw.replace(/\\([.\-])/g,'$1').replace(/^\d+\.\s*/,'').trim();
function roleOf(page) {
  const p={...page}; delete p.steps;delete p.preconditions;
  if(p.endName==='用户App'){
    if(/cohost-active/.test(p.file))p.role='主播';
    if(/host-center-pending/.test(p.file))p.role='用户';
    if(/group-manage-owner/.test(p.file))p.role='主播';
    if(/group-manage-member|fan-group-chat/.test(p.file))p.role='粉丝团成员';
    if(/guild-leave-application/.test(p.file))p.role='主播';
    if(/patrol-room-allowed/.test(p.key))p.role='巡房人员';
  }
  if(/admin-system-(account|role)/.test(p.file))p.role='超级管理员';
  return p;
}
function normalize(row) {
  let text=clean(row.raw), status='已确认', question='';
  if(/^\|\s*(字段|入口|指标|Tab)\s*\|/.test(text))return null;
  if(text.startsWith('|')){const cells=text.split('|').map(s=>s.trim()).filter(Boolean);text=`${cells[0]}：${cells.slice(1).join('；')}`;}
  if(/场景/.test(row.section))status='范围说明';
  if(/进房演示固定|仅 Ayu|循环返回|依次循环|持续交替|交替展示两种|固定高度|默认关键词为 620100/.test(text)||/UI 建议/.test(row.section))status='演示或视觉说明';
  if(/退款或冲正后重新计算/.test(text)&&/榜|ranking|contribution-rank|cohost-active|host-password/.test(row.page)){
    question=makeQuestion('rank-refund','用户App','首页与发现','充值退款后查看历史送礼榜单','充值退款是否影响既有礼物榜单贡献？',['不改变已完成赠礼贡献，原排名按保留贡献计算','将该退款关联用户既有贡献从退款完成日起排除，退款前历史榜单快照保留'],['系统概要保留消费与主播收益，但未直接规定榜单；批注笼统写退款或冲正后重算。'],'计算与统计口径');
    text=text.replace(/退款或冲正后重新计算[^。；]*[。；]?/,'');
  }
  if(/退款和冲正按财务口径更新收益/.test(text))text=text.replace('退款和冲正按财务口径更新收益','充值退款或拒付不改变已完成消费对应的主播收益和分成');
  if(row.page==='balance-detail.html'&&text.startsWith('变动类型：'))text='变动类型：充值、充值退款、礼物打赏、购买门票；成功礼物和门票不提供退款，不以演示中的礼物退款建立新业务。';
  if(/公会同意后.*(才可|可在).*申请直播权限|加入公会与申请直播权限分/.test(text))text='认证资料随入会申请提交；公会初审和平台终审均通过后，才加入公会并获得主播身份。公会初审通过、平台终审未通过时仍为普通用户。';
  if(/平台驳回.*(保留公会|不撤销)|平台驳回后保留公会|平台驳回直播权限申请不撤销/.test(text))text='公会初审或平台终审任一方驳回，当前申请失效；用户可重新提交新的入会申请，不能保留已加入关系或绕过公会初审。';
  if(/接受一条邀请.*其他邀请失效/.test(text))text='接受邀请进入连麦后，本人已发出的邀请失效；其他收到的邀请保留，连麦中不可继续接受或邀请。';
  if(/进入连麦 -> 不再满足的邀请失效/.test(text))text='任一方结束直播使对应邀请和连麦失效；进入连麦后本人已发出的邀请失效，其他收到的邀请保留。';
  if(row.page==='admin-host-list.html'&&text.startsWith('开播权限：'))text='开播权限：账号可用、公会有效、认证通过；平台关闭时关闭，平台开启且未锁定时取公会设置，平台锁定开启时跟随平台，解锁恢复公会原设置。';
  if(row.source.includes('/assets/')&&row.page==='admin-report-handling.html'&&/不因直播结束|仅保留待处理/.test(text))text='直播举报仅在直播中生成；场次结束后，未处理举报作废，不继续处罚后续场次。';
  if(row.source.includes('/assets/')&&row.page==='admin-report-detail.html'&&/场次已结束/.test(text))text='直播中可警告、关播或关闭直播权限；场次结束后未处理直播举报失效，不补关下一场直播。';
  if(row.source.includes('/assets/')&&row.page==='admin-consumption-order-detail.html'&&/退款/.test(row.section))text='已成功赠送的礼物和已购买的门票不支持退款；只有充值订单支持整单退款或拒付，既有消费及主播收益不撤销。';
  if(row.source.includes('/assets/')&&row.section==='RTP 计算')text='单礼物独立开奖，返还期望为各奖励值乘各自概率之和；RTP 为返还期望除以单礼物消耗。批量购买的总期望和总消耗同时乘礼物数量，比例不额外除以数量。';
  if(/房间密码|密码必须|密码不是|4-12|8 位数字/.test(text)&&/密码|password|start-live/.test(row.page)&&/4-12|8 位数字/.test(text))question=qPassword;
  if(/邀请/.test(row.page+' '+row.section+' '+text)&&/10 金币|人数 × 10|每成功邀请.*后台|成功邀请.*金币奖励/.test(text))question=qInvite;
  if(/等级/.test(text)&&/计入范围|判定及配置修改|累计收到的贡献|有效消费成长|累计充值\/消费成长/.test(text))question=qLevels;
  if(row.page==='admin-prop-list.html'&&/预置勋章|灯牌、头衔/.test(text))question=qProps;
  if(row.page==='admin-operation-account-detail.html'&&/编辑资料|重置密码/.test(text))question=qOpEdit;
  if(row.page==='host-center.html'&&/暂无开播权限|直播权限已关闭，请联系公会/.test(text))question=qLiveHint;
  if(/cohost|live-room-host/.test(row.page)&&/查询结果为空/.test(text))question=qCohostHint;
  if(/待确认|待定/.test(text)||/待确认/.test(row.section)){
    if(/排序|次序|优先级/.test(text))question=makeQuestion(`sort-${row.page}`,row.end,row.pageInfo.module,`${row.pageInfo.name}存在至少两条可比较记录`,`${row.pageInfo.name}中未定义的排序如何确定？`,['按记录创建时间倒序，相同时按 ID 从大到小','按名称升序，相同时按 ID 从小到大'],[`${row.source} ${row.position}：${text}`],'计算与统计口径');
    else if(/等级/.test(text))question=qLevels;
    else if(/时区|周起始/.test(text))question=qTime;
    else if(/补签/.test(text))question=questions.find(q=>q.key==='sign-makeup').id;
  }
  if(question)status='待确认';
  if(/原型仅|原型以|模拟|示例|演示|当前原型/.test(text)&&status==='已确认')status='含演示说明';
  if(text!==clean(row.raw)&&!row.raw.startsWith('|'))changes.push({id:row.id,source:row.source,position:row.position,before:row.raw,after:text,question});
  return {...row,text,status,question};
}
const sourceFile=`${project}/context/系统概要 .md`, summary=await read(sourceFile);
let section='系统概要';
for(const [i,line] of summary.split('\n').entries()){
  if(/^#+ /.test(line)){section=clean(line.replace(/^#+ /,''));continue;}
  if(!line.trim()||/^\|[\s|:-]+\|$/.test(line)||/^\*\*/.test(line))continue;
  const text=clean(line.replace(/^- /,''));
  const id=`REQ-SYS-${sha(section+'|'+text).slice(0,10)}`;
  records.push({id,page:'shared',end:'三端',section,text,status:/示例|核心用例|用例名称/.test(section+text)?'范围说明':'已确认',source:sourceFile,position:`第${i+1}行 / ${section}`});
}
// Scope summaries cannot override the overview's explicit prohibitions.
for(const r of records){
  if(r.text.includes('创建、分配、启停运营账号'))r.text='平台可启停运营账号并管理公会权限、虚拟金币额度和明细；不创建运营账号、不发放虚拟金币（以本概要 3.7 明确职责为准）。';
  if(r.text.includes('配置礼物、商品及分成规则'))r.text='配置礼物、商品和道具；本期分成由财务线下计算后上传，系统不计算具体分成金额（以本概要 3.6 为准）。';
}
for(const model of all)for(const raw of model.rows){const r=normalize(raw);if(r)records.push(r);}
makeQuestion('level-threshold-decision','用户App、公会App、管理后台','运营配置','单次累计增长跨过两个等级门槛','单次累计增长跨档时如何升级？',['本次直接升至已达到门槛中的最高等级','每次有效增长事件最多升一级，尚未完成的跨级等下次有效事件继续判定'],['等级配置明确“等级判定待确认”，不能由财富累计口径一个问题代替。'],'计算与统计口径');
makeQuestion('level-config-retroactive','用户App、公会App、管理后台','运营配置','保存等级门槛后已有用户等级变化','修改门槛后是否重算已有等级？',['保存生效后按当前累计值重算全部已有等级，允许升降级','不立即重算；下一次符合计入范围的事件发生后按新门槛重算该账号等级，允许升降级'],['等级配置明确“配置修改对已有等级的影响待确认”。'],'配置和历史数据影响');
makeQuestion('host-level-metrics','用户App、公会App、管理后台','运营配置','主播收礼后的等级累计','主播等级累计采用哪种指标？',['按真实金币主播收益累计，幸运礼物按赠送时比例，不含虚拟金币','按真实金币成功收礼原价累计，幸运礼物不扣返奖，不含虚拟金币'],['主播等级字段写收益数值，但现有说明同时出现累计收到贡献，具体计入范围明确待确认。'],'计算与统计口径');
makeQuestion('group-announcement-editor','用户App','消息与社交','群主编辑群公告','群公告编辑入口本期如何交付？',['点击编辑打开公告文本表单，保存后全体当前成员可见','本期仅展示公告，移除编辑入口，由平台维护公告'],['群主说明允许编辑公告，但原型仅以提示代替编辑；没有可执行编辑表单和保存状态。'],'需求范围');
const derivedFiles=['01-用户主播App-项目需求清单.md','02-公会App-项目需求清单.md','03-管理后台-项目需求清单.md'];
const contextBackup=[];
for(const [i,model] of all.entries()){
  const relative=`${project}/context/${derivedFiles[i]}`;
  const backup=`archive/Luma-Live/260914-001/context-before/${derivedFiles[i]}`;
  try { await fs.access(path.join(root,backup)); }
  catch(error){if(error.code!=='ENOENT')throw error;await save(backup,await read(relative));}
  let text=`# ${model.rows[0].end} 项目需求清单\n\n来源：当前系统概要、活动原型页面和明确批注；同步批次 RSL-0034。系统概要优先；历史生成附录和历史任务链接已退出当前需求依据。原文件逐字保存在归档的 context-before 中。\n\n## 公共业务规则\n\n用户与主播共用账号；入会材料随申请提交，公会初审及平台终审均通过后入会成为主播；任一方驳回后申请失效。平台权限优先，锁定期间公会只读，解锁恢复原公会设置。公会停用解除主播关系、身份并结束直播，停用公会长账号只限制该账号登录。只有充值可退款，已完成礼物及门票消费不撤销；幸运礼物收益取赠送时配置比例，返奖不影响主播收益；虚拟金币不形成主播收益。系统不在线申请或审批结算，不计算具体分成；财务线下完成后上传结果。细则以 context/系统概要 .md 对应章节为准。\n\n`;
  for(const [key,page] of Object.entries(model.pages)){
    text+=`## ${page.module} · ${page.name}\n\n原型：\`${page.file}\`；视图：\`${key}\`。\n\n`;
    for(const r of records.filter(r=>r.end===page.endName&&r.page===key)){
      if(r.status==='演示或视觉说明')continue;
      text+=`- ${r.id}：${r.status==='待确认'?`【${r.question}，该条预期待确认】`:''}${r.text.replaceAll('\n',' ')}\n`;
    }
    text+='\n';
  }
  text=text.trimEnd()+'\n';
  await save(relative,text);
  contextBackup.push({原文件:relative,备份:backup,备份SHA256:sha(await read(backup)),现文件SHA256:sha(text)});
}
await save('archive/Luma-Live/260914-001/context-backup-manifest.json',JSON.stringify(contextBackup,null,2)+'\n');
const docLine=r=>`<!-- RULE ${JSON.stringify({id:r.id,page:r.page,end:r.end,section:r.section,status:r.status,question:r.question||'',source:r.source,position:r.position})} -->\n\n**${r.id}｜${r.section}｜${r.status}**\n\n${r.text}\n\n来源：\`${r.source}\`，${r.position}${r.question?`；关联 ${r.question}`:''}。\n`;
let document='# Luma Live 统一需求文档\n\n版本：260914-001；从当前上游全新建立。三端用例唯一业务输入为本文件；未确认预期只见《需求待确认清单》。\n\n优先级：系统概要的明确业务规则优先；原型页面及明确批注补充。示例账号、Mock 金额、交互演示循环和视觉排版不构成业务要求。范围说明不单独证明端侧可执行入口。带“待确认”的条款不生成确定预期；已明确部分需拆开引用。\n\n## 一、共同业务对象与规则\n\n';
document+=records.filter(r=>r.page==='shared').map(docLine).join('\n');
for(const model of all){
  document+=`\n## ${model.rows[0].end}\n\n`;
  for(const [key,p] of Object.entries(model.pages)){
    const page=roleOf({...p,key});
    const elements=model.elements.filter(e=>e.页面===key&&!(e.属性.class||'').includes('admin-nav')).map(e=>({id:e.元素标识,type:e.类型,name:e.名称,selector:e.定位,attributes:Object.fromEntries(Object.entries(e.属性).filter(([k])=>['href','type','min','max','minlength','maxlength','required','readonly','disabled','pattern','placeholder','data-action'].includes(k))),line:e.行号}));
    document+=`### ${page.module} · ${page.name}（${page.role}视角）\n\n<!-- PAGE ${JSON.stringify({...page,elements})} -->\n\n实际页面：\`${page.file}\`；同页视图：\`${key}\`。页面入口和控件结构用于可执行性核对，不据示例值推定阈值。\n\n`;
    document+=records.filter(r=>r.page===key&&r.end===page.endName).map(docLine).join('\n');
  }
}
document+='\n## 已采用的差异处理\n\n系统概要优先纠正申请终态、连麦邀请保留、举报结束失效、消费不可退款、真实与虚拟收益隔离及线下结算职责。修改前后全文与定位见本次需求同步记录。项目说明和旧工作目录中的提现、SKU 自动分成描述不作为本轮规则；这些原始资料保留，不自动修改。公共批注中已没有活动页面承载的参数、审计和旧连麦页条目保留在上游，不凭残留链接新增入口。\n';
await save(formal,document);
let riskDoc='# Luma Live 需求待确认清单\n\n版本：260914-001。仅记录本次当前上游的冲突或缺口，不读取或沿用历史待确认结论。所有选项均为待产品决定的候选，不能充当已确认业务预期。\n\n';
for(const q of questions)riskDoc+=`## ${q.id} ${q.question}\n\n<!-- QUESTION ${JSON.stringify(q)} -->\n\n适用端：${q.end}；模块：${q.module}；分类：${q.category}。\n\n场景：${q.scene}。\n\n已知依据：${q.known.join('；')}\n\n${q.options.map((s,i)=>`${String.fromCharCode(65+i)}. ${s}`).join('\n\n')}\n\n产品结论：待确认。影响：仅隔离此决策涉及的预期，其余明确行为继续生成。\n\n`;
await save(risk,riskDoc);
await save('work/luma-fresh-260914-001/mainbasis-normalization.json',JSON.stringify({来源记录数:records.length,页面数:all.reduce((n,m)=>n+Object.keys(m.pages).length,0),问题数:questions.length,差异:changes},null,2)+'\n');
for(const r of records)mappings.push({来源路径:r.source,来源SHA256:sha(await read(r.source)),来源位置:r.position,目标路径:formal,目标原文:r.text});
await save('work/luma-fresh-260914-001/mainbasis-source-mapping.json',JSON.stringify(mappings,null,2)+'\n');
console.log(JSON.stringify({records:records.length,questions:questions.length,changes:changes.length,documents:[formal,risk]}));
