import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {root, task, formal, risks, parse, save} from './prepare.mjs';
import {specifications, calculations, transitions} from './reviewed-model.mjs';
import {decisions, expandSorting} from './decisions.mjs';
import {caseFromRule, ruleDesignHash, ruleBusinessKey, validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules, splitAtomicResults, validateTestcaseJson} from '../../scripts/validate-testcase-json.mjs';
import {validateGenerationInput} from '../../scripts/validate-generation-input.mjs';

const sha = value => crypto.createHash('sha256').update(typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value)).digest('hex');
const rel = file => path.relative(root,file);
const fileHash = async file => sha(await fs.readFile(file));
const started = new Date().toISOString();
const baseline=await parse(), byId=new Map(baseline.entries.map(x=>[x.id,x]));
const language=await loadTestcaseLanguageRules(), verbs=Object.values(language.actionVerbs).flat().sort((a,b)=>b.length-a.length);
const scope={用户App:'user',公会App:'guild',管理后台:'admin'};
const moduleName = text => text.replaceAll('、','·');
const roles = page => {
 const p=baseline.pages[page]; if(p.end==='公会App')return '公会长'; if(p.end==='管理后台')return '平台管理员';
 if(page.startsWith('auth-'))return '游客';
 if(page.includes('group-manage-member'))return '粉丝团成员';
 if(/live-room-host|cohost|start-live|visible-fan|live-data|live-record|income-sharing|moderator-management|fan-club-settings|group-manage-owner/.test(page))return '主播';
 if(page.includes('live-room'))return '观众';return '用户';
};
const moduleEntries=new Map();
for(const e of baseline.entries){if(!moduleEntries.has(e.module))moduleEntries.set(e.module,[]);moduleEntries.get(e.module).push(e);}
const evidence = ids => [...new Set(ids)].map(id=>{const e=byId.get(id);assert(e,`Unknown source ${id}`);assert.equal(e.status,'基准规则',`Unconfirmed source ${id}`);return {路径:formal,'SHA-256':baseline.sourceHashes[formal],位置:`${id}，第${e.line}行`,证明内容:e.text,原文:e.raw};});

// Only literal, unconditional navigation clauses are expanded. Business branches stay authored above.
for(const e of baseline.entries.filter(e=>e.status==='基准规则'&&e.section.includes('交互'))){
 if(e.text.includes('原型')||e.text.includes('模拟'))continue;
 for(const part of e.text.split('；')){
  const m=part.match(/^点击([^，；或、]{1,20}) -> 进入([^，；或、]{1,24})$/u); if(!m)continue;
  if(/对应|相关|入口|结果|卡片|日数据行/.test(m[1]+m[2]))continue;
  const page=baseline.pages[e.page];
  specifications.push({source:[e.id],point:`${m[1]}跳转`,conditions:[`${roles(e.page)}已登录`,...(roles(e.page)==='公会长'?['当前公会处于启用状态']:[])],actions:[`进入${page.name}`,`点击${m[1]}`],result:`进入${m[2]}`,page:e.page,role:roles(e.page),kind:'明确入口'});
 }
}

// Field-group headings alone do not establish a useful observable result.
// Only explicitly designed field constraints in reviewed-model enter formal cases.

for(const e of baseline.entries.filter(e=>e.end==='管理后台'&&e.status==='基准规则'&&/导出(?: -> |当前)(?:当前)?(?:筛选)?结果/u.test(e.text))){
 const meta=baseline.pages[e.page];
 specifications.push({source:[e.id],point:'导出记录范围',conditions:['平台管理员已登录','当前账号具有本报表查询和导出权限',`${meta.name}当前筛选结果只有测试记录A、B，筛选范围外还有记录C`],actions:['点击导出','打开导出文件'],result:'导出文件的记录集合为A、B',page:e.page,role:'平台管理员',kind:'独立报表导出'});
}

for(const [source,page,end,role,point,pre,label,op,values,total,unit,flow] of calculations){
 const expression={运算:op,参数:values.map((_,i)=>({变量:`v${i+1}`}))};
 const formula=op==='min'?`min(${values.join(', ')})`:`${values.map(x=>x<0?`(${x})`:x).join(` ${op} `)}`;
 specifications.push({source:source.split(','),page,end,role,point,conditions:[`${role}已登录`,...pre.split('；')],actions:[`进入${baseline.pages[page].name}`,`查看${label}`],result:`${label}计算结果 = ${formula} = ${total} ${unit}`,flow,
  calculation:{公式:formula,数据范围:pre,结果单位:unit,证据:[0],变量:values.map((v,i)=>({名称:`v${i+1}`,业务含义:pre.split('；')[Math.min(i,pre.split('；').length-1)],单位:unit,数值:v})),表达式:expression,最终值:total}});
}

for(const spec of specifications){
 if(spec.point==='成功充值到账')spec.actions=['进入充值页','选择基础金币1000且赠送100金币的套餐','选择可用支付渠道','确认支付','返回充值页查看金币余额'];
 if(spec.point==='普通礼物成功扣币')spec.actions=['进入当前直播间','打开礼物面板','选择单价10金币的普通礼物','选择数量1','点击赠送','查看金币余额'];
}
const flowIds=Object.fromEntries([...new Set(transitions.map(t=>t[0]))].map(object=>[object,`MBF-${sha(object).slice(0,8).toUpperCase()}`]));
const stateBaseline={schemaVersion:'MainBasis-1.0',来源:baseline.sourceHashes,建立时间:started,业务对象:[],状态转换:transitions.map(t=>({状态转换标识:`MBT-${sha(t.slice(0,6)).slice(0,12).toUpperCase()}`,共同业务对象:t[0],流程编号:flowIds[t[0]],来源状态:t[1],触发动作:t[2],目标状态:t[3],执行角色:t[4],操作端:t[5],观察端:t[6],来源:t[7].split(','),端场景:[],实际执行:'未测'}))};
for(const [name,id] of Object.entries(flowIds))stateBaseline.业务对象.push({共同业务对象:name,流程编号:id,边界:'只声明当前来源明确的转换；缺少创建、恢复、异常分支不补造，也不声称完整生命周期闭环'});
await save('state-transition-baseline.json',stateBaseline);

const rules=[],dedup=[],designProblems=[],isolatedDesigns=[];
for(const spec of specifications){
 if(spec.point==='运营账号禁用登录'){
  isolatedDesigns.push({...spec,可生成正式用例:false,原因:'MainBasis明确禁用后不可登录，但用户App仅列第三方、手机号和邮箱入口，运营账号登录账号与入口的对应关系未明确',关联问题:'Q019'});continue;
 }
 const refs=spec.source.map(id=>byId.get(id));assert(refs.every(Boolean),`Missing refs ${spec.source}`);
 const page=spec.page||refs.find(e=>e.page)?.page;assert(page&&baseline.pages[page],`Missing page ${spec.point}`);
 const meta=baseline.pages[page],end=spec.end||meta.end,role=spec.role||spec.conditions[0].replace(/已登录$/u,'');
 assert(Object.hasOwn(scope,end));
 const sourceRefs=[...spec.source];
 if(!sourceRefs.some(id=>byId.get(id).page===page)){
  const anchor=baseline.entries.find(e=>e.page===page&&e.status==='基准规则'); if(anchor)sourceRefs.push(anchor.id);
 }
 const loginPage=/^(auth-login|auth-phone|auth-email|guild-login)/u.test(page);
 const data=spec.conditions.map(c=>c===role?`执行身份为${role}`:c.replace('游客已登录','当前为未登录游客'));
 if(role==='游客'&&!data.some(c=>c.includes('未登录')))data.push('当前为未登录游客');
 else if(loginPage&&!data.some(c=>c.includes('未登录')))data.push('当前尚未建立登录会话');
 else if(!loginPage&&role!=='游客'&&!data.some(c=>c.includes('已登录')))data.push('执行账号已登录');
 if(end==='管理后台'&&!data.some(c=>c.includes('授予')))data.push('当前账号已授予本页所用操作权限');
 const actions=spec.actions.map(a=>a.replace('完成该平台授权','确认该平台授权').replace('完成授权','确认授权').replace('完成支付','确认支付').replace('保持举报原因未选','查看提交按钮').replace(/^搜索/u,'查询').replace(/^(移除|全选)/u,'点击$1').replace('离开直播间','退出直播间').replace('停用该档位','禁用该档位'));
 const results=splitAtomicResults(spec.result);
 for(const [ri,result] of results.entries()){
  const point=results.length===1?spec.point:`${spec.point}·${result.replace(/[“”]/g,'').slice(0,16)}`;
  const rule={稳定规则标识:`BR-MB-${sha([page,end,role,data,actions,result]).slice(0,14).toUpperCase()}`,业务对象:spec.flow||meta.name.replaceAll(' / ','·'),共同业务对象:spec.flow||meta.name,执行角色:role,适用角色和端:[`${end}-${role}`],触发动作:actions.at(-1),必要条件:data,来源状态:data.slice(1).join('；')||`${role}账号可访问${meta.name}`,目标状态或可观察结果:result,规则状态:'已确认规则',可生成正式用例:true,原子动作数量:1,原子结果数量:1,功能模块:moduleName(meta.module),功能结构:`${meta.name}（${role}视角）`,来源条目:sourceRefs,跨模块流程编号:flowIds[spec.flow]||'',证据引用:evidence(sourceRefs),用例设计:{场景:`验证${role}在${meta.name}的${point}`,验证子项:point,观察页面:meta.name,观察对象:point,观察端:end,观察证据:[0],设计说明:`按MainBasis明确条款设计${spec.kind||'业务行为'}；角色为${role}，只在${end}观察本条结果`,步骤:actions.map(action=>{const verb=verbs.filter(v=>action.includes(v)).sort((a,b)=>action.indexOf(a)-action.indexOf(b)||b.length-a.length)[0];return {执行角色:role,动作:verb||'',对象:verb?action.slice(action.indexOf(verb)+verb.length).trim():'',操作:action,证据:[0]};}),计算:spec.calculation||null,用例类型:spec.calculation?'逻辑校验':spec.flow?'业务流程':/不能|不可|失败|拦截|拒绝|不足|上限|下限/.test(result)?'异常用例':'功能需求',优先级:spec.kind?'P2':/取消|搜索|榜|美颜|勋章|气泡|通知/.test(point)?'P2':'P1',备注:spec.flow?[`共同对象：${spec.flow}；阶段：${point}`]:[]}};
  const observationIndexes=sourceRefs.map((id,i)=>byId.get(id).page===page?i:-1).filter(i=>i>=0);
  rule.用例设计.观察证据=observationIndexes.length?observationIndexes:[0];
  for(const step of rule.用例设计.步骤)step.证据=sourceRefs.map((_,i)=>i);
  if(spec.point==='Google已有账号登录'||spec.point==='普通房进入')rule.用例设计.优先级='P0';
  const problems=validateRuleDesign(rule,language,{requireReview:false});
  if(problems.length){designProblems.push({id:rule.稳定规则标识,point,actions,problems});continue;}
  rule.设计复核={状态:'通过',说明:`当前来源原文、条件分支、单端执行者及单一观察结果已核对；${spec.kind||'人工编写场景'}；未执行产品测试`,设计SHA256:ruleDesignHash(rule)};
  const key=ruleBusinessKey(rule),duplicate=rules.find(r=>ruleBusinessKey(r)===key);
  if(duplicate){dedup.push({规则:rule.稳定规则标识,保留:duplicate.稳定规则标识,判定:'合并',理由:'角色、页面、必要条件、操作与单一结果完全相同'});continue;}
  rules.push(rule);
 }
}
await save('design-problems.json',designProblems);
await save('isolated-scenarios.json',isolatedDesigns);
if(designProblems.length){console.log(JSON.stringify(designProblems,null,2));throw Error('修正设计映射后再固定场景基线');}

expandSorting(baseline);
const pending=[];
const groupCounters={};
for(const d of decisions){
 const original=baseline.questions.find(q=>q.id===d.group);assert(original,`Missing risk ${d.group}`);
 const refs=(d.refs||original.refs).map(id=>byId.get(id)).filter(Boolean);
 const i=(groupCounters[d.group]=(groupCounters[d.group]||0)+1),index=Object.keys(groupCounters).indexOf(d.group);
 const number=decisions.indexOf(d)+1;
 pending.push({问题编号:`Q-${String(number).padStart(3,'0')}`,需求组编号:`RQ-${d.group.slice(1)}`,父问题编号:'',追问触发条件:'',阻塞等级:['Q001','Q006','Q010','Q028','Q029','Q030'].includes(d.group)?'阻塞测试':'部分阻塞',功能模块:moduleName(refs.find(e=>e.module!=='系统概要')?.module||'跨模块需求'),具体场景:d.scene,问题分类:d.category,待决策问题:d.question,可选方案:d.options,测试建议:`建议优先评估A：明确${d.scene}的唯一处理口径后，可构造确定的输入和结果；此建议不代表产品结论`,产品结论:'',结论补充:'',已知依据:[`${risks}#${d.group}：${original.title}`,`主文档关联：${refs.slice(0,4).map(e=>e.id).join('、')||'见风险来源中的来源异常范围'}`],影响范围:d.ends.map(end=>`${end}：${d.scene}`),已有用例编号:[],确认后待补用例:[d.question.replace('？','的正向、边界及异常场景')],负责人:d.owner,期望确认时间:'进入对应功能测试前',确认状态:'待确认',_ends:d.ends,_source:d.group});
}
pending.sort((a,b)=>({阻塞测试:0,部分阻塞:1,不阻塞:2}[a.阻塞等级]-{阻塞测试:0,部分阻塞:1,不阻塞:2}[b.阻塞等级])||a.需求组编号.localeCompare(b.需求组编号)||a.问题编号.localeCompare(b.问题编号));

const transitionPoints={
 '停用公会':['停用公会','停用公会登录限制','停用公会搜索'],
 '停用公会长账号':['停用公会长账号','停用公会长登录限制'],
 '封禁账号':['平台封禁账号','封禁账号登录'],'解封账号':['平台解封账号','解封账号重新登录'],
 '关闭直播权限':['公会关闭开播权限','公会关闭权限关播'],
 '关播':['平台关播','平台关播后的主播端'],
 '驳回退会':['驳回退会保留身份','驳回退会关系'],'通过退会':['通过退会','退会通过关系'],
 '下架礼物':['礼物下架','下架礼物停止赠送'],'下架道具':['道具下架','已下架道具继续使用'],
 '关闭门票房':['关闭门票房配置','关闭门票房的新场次'],
 '禁用运营账号':['运营账号禁用','运营账号禁用登录'],'启用运营账号':['运营账号恢复'],
 '全额退款':['管理员完成充值退款','退款负余额','退款金币回收','赠送金币回收'],
};
for(const transition of stateBaseline.状态转换){
 transition.端场景=rules.filter(r=>r.共同业务对象===transition.共同业务对象&&(transitionPoints[transition.触发动作]||[]).includes(r.用例设计.验证子项)).map(r=>({端:r.用例设计.观察端,规则:r.稳定规则标识,场景:r.用例设计.场景,关系:r.用例设计.观察端===transition.操作端?'操作端场景':'目标状态下的观察场景'}));
 transition.待补观察端=transition.观察端.filter(end=>!transition.端场景.some(s=>s.端===end));
 transition.转换覆盖=transition.待补观察端.length?'部分覆盖':'操作端及声明观察端均有场景';
 transition.闭环状态='仅表示本条转换的场景覆盖，完整生命周期和产品执行均未验证';
 for(const scene of transition.端场景){
  const rule=rules.find(r=>r.稳定规则标识===scene.规则);
  rule.用例设计.备注.push(`状态转换：${transition.状态转换标识}；${transition.来源状态}→${transition.目标状态}`);
  rule.设计复核.设计SHA256=ruleDesignHash(rule);
 }
}
await save('state-transition-baseline.json',stateBaseline);
await save('independent-scenario-baseline.json',{schemaVersion:'MainBasis-1.0',来源:baseline.sourceHashes,固定时间:new Date().toISOString(),历史读取次数:0,读取统计口径:'仅本轮build-cases调用；历史只在后置比较阶段读取，后续修订依据当前需求和质量复核',场景:rules.map(r=>({规则:r.稳定规则标识,来源:r.来源条目,端:r.用例设计.观察端,角色:r.执行角色,必要条件:r.必要条件,动作:r.触发动作,结果:r.目标状态或可观察结果,场景:r.用例设计.场景,流程:r.跨模块流程编号}))});
const dispositions=baseline.entries.map(e=>{const mapped=rules.filter(r=>r.来源条目.includes(e.id));return {...e,映射规则:mapped.map(r=>r.稳定规则标识),处理去向:e.status==='待确认'?'需求待确认':mapped.length?'已有正式场景，原条款未覆盖子条件仍须复核':['结构说明','原型说明'].includes(e.status)?'结构或演示说明，不作业务预期':e.section==='场景'||e.section==='场景描述'?'场景上下文，纳入所属页面设计':'生成待复核',说明:mapped.length?'条目有对应场景不等于条目全部条件已覆盖':'未以历史用例补造本条预期'};});
await save('source-coverage-ledger.json',{schemaVersion:'MainBasis-1.0',原始条目数:baseline.entries.length,条目:dispositions});
await save('deduplication-review.json',{方法:'按执行端、角色、共同对象、必要条件、操作、结果建立业务键；跨端观察不相互合并',完全重复:dedup,边界变体说明:'不同输入、角色、取消与提交、状态去向分别保留；不以标题相似自动合并'});
await save('risk-decisions.json',pending);

for(const [end,dir] of Object.entries(scope)){
 await fs.mkdir(path.join(task,dir),{recursive:true});
 const selected=rules.filter(r=>r.用例设计.观察端===end).sort((a,b)=>a.功能模块.localeCompare(b.功能模块)||a.功能结构.localeCompare(b.功能结构));
 const isolated={稳定规则标识:`BR-MB-${dir}-HISTORY-REVIEW`,业务对象:'历史用例适用性复核',执行角色:'',适用角色和端:[],触发动作:'',必要条件:[],来源状态:'',目标状态或可观察结果:'',规则状态:'生成待复核',可生成正式用例:false,证据引用:[]};
 const target={端名:end,模块名称:[...new Set(selected.map(r=>r.功能模块))].join('、')};
 const catalog={schemaVersion:'1.0',项目名称:'Luma Live',目标范围:target,规则:[...selected,isolated]};
 await save(`${dir}/business-rule-catalog.json`,catalog);
 const input=async(file,role,type,allowed)=>({路径:rel(file),'SHA-256':await fileHash(file),角色:role,内容类型:type,允许定义业务规则:allowed});
 const manifest={schemaVersion:'1.0',项目名称:'Luma Live',任务标识:`mainbasis-three-end-260911-001/${dir}`,生成策略:'current-evidence-only',目标范围:target,项目目录:'MainBasis',任务工作目录:rel(task),输入文件:[await input(path.join(root,formal),'当前业务证据','正式需求',true),await input(path.join(task,`${dir}/business-rule-catalog.json`),'本次派生产物','业务规则清单',true),await input(path.join(task,'build-cases.mjs'),'执行工具','渲染脚本',false),await input(path.join(task,'reviewed-model.mjs'),'执行工具','已复核场景设计工具',false),await input(path.join(task,'state-transition-baseline.json'),'本次派生产物','状态转换基线',false),await input(path.join(task,'independent-scenario-baseline.json'),'本次派生产物','独立场景库',false)],当前业务规则清单:rel(path.join(task,`${dir}/business-rule-catalog.json`)),生成脚本:rel(path.join(task,'build-cases.mjs'))};
 await save(`${dir}/generation-input-manifest.json`,manifest);
 const pre=await validateGenerationInput(path.join(task,dir,'generation-input-manifest.json'),root,'pre-generate');
 await save(`${dir}/pre-generate-validation.json`,pre);
 const result={测试用例:selected.map((r,i)=>caseFromRule(r,i+1,{user:'UMB',guild:'GMB',admin:'AMB'}[dir])),需求待确认:pending.filter(p=>p._ends.includes(end)).map(({_ends,_source,...p})=>p)};
 await save(`${dir}/candidate.json`,result);
 const check=await validateTestcaseJson(path.join(task,dir,'candidate.json'));
 await save(`${dir}/json-validation.json`,check);
 console.log(JSON.stringify({end,cases:result.测试用例.length,pending:result.需求待确认.length,check},null,2));
}
await save('pipeline-metrics.json',{schemaVersion:'1.0',阶段:[{阶段:'MainBasis解析与独立设计',开始时间:started,结束时间:new Date().toISOString(),输入数量:baseline.entries.length,输出数量:rules.length,复用历史数量:0}],说明:'不与之前原型驱动生成耗时作同范围性能比较'});
