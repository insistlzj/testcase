import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint,readUnits,reviewHash,seedCoverage} from '../../../scripts/requirement-traceability.mjs';
import {verifyMainBasis} from '../../../scripts/mainbasis.mjs';
import {readModuleDirectory} from '../../../scripts/prototype-directory.mjs';
import {casesFromCatalog,ruleDesignHash,ruleBusinessKey} from '../../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules,validateTestcaseRecords} from '../../../scripts/validate-testcase-json.mjs';
import {validateGenerationInput} from '../../../scripts/validate-generation-input.mjs';
import {startStage,finishStage,skipStage,readMetrics} from '../../../scripts/pipeline-metrics.mjs';
import {subitems} from '../subitem-review.mjs';
import {priorities} from '../priority-review.mjs';
import {faults} from '../fault-review.mjs';
const task='work/liveshow-user-repair-260915-001/user',family='work/liveshow-user-repair-260915-001';
const repairTarget='work/liveshow-user-260915-001/user';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const save=async(n,x)=>fs.writeFile(`${task}/${n}`,JSON.stringify(x,null,2)+'\n');
const begin=async name=>{const m=await readMetrics(family);await startStage(family,name,{原因:m.阶段.some(s=>s.阶段名称===name)?'修订脚本更新后重建受影响产物并核验；此前设计耗时保留':'本次修订的实际执行阶段，此前未分项记录的工作不补造时间'});};
await begin('sync');
const {baseline,基线SHA256}=await verifyMainBasis(process.cwd(),'liveshow-proto');
await finishStage(family,'sync',{输入数量:2,输出数量:2,复用数量:2});
await begin('semantic-read');
const formal=baseline.文档[0],risk=baseline.文档[1],text=await fs.readFile(formal.路径,'utf8'),lines=text.split(/\r?\n/);
const riskLines=(await fs.readFile(risk.路径,'utf8')).split(/\r?\n/);
const directory=readModuleDirectory(text),units=await readUnits(process.cwd(),baseline.文档);
for(const u of units)if(u.路径===risk.路径)u.风险=true;
await save('requirement-units.json',units);
let snapshot;
try {snapshot=await read(`${task}/repair-input.json`);} catch(error){
  if(error.code!=='ENOENT')throw error;
  const files=['business-rule-catalog.json','final-testcases.json','test-scenario-library.json','requirement-units.json','requirement-coverage.json','state-transition-baseline.json','semantic-dedup-review.json','global-evidence-scan-result.json'];
  snapshot={用途:'用户明确授权的当前交付修订对象；不是业务来源，也不用于历史覆盖比较',文件:[]};
  for(const name of files){const raw=await fs.readFile(`${repairTarget}/${name}`,'utf8');snapshot.文件.push({名称:name,路径:`${repairTarget}/${name}`,'SHA-256':fingerprint(raw),内容:JSON.parse(raw)});}
  await save('repair-input.json',snapshot);
}
const original=name=>structuredClone(snapshot.文件.find(f=>f.名称===name).内容);
const oldCases=original('final-testcases.json').测试用例, questions=original('final-testcases.json').需求待确认;
for(const q of questions)q.已知依据=q.已知依据.map(e=>{const m=e.match(/^(.*)：行\d+；(.+)$/);if(!m)return e;const sourceLines=m[1]===risk.路径?riskLines:lines;const line=sourceLines.findIndex(l=>l.includes(m[2]));assert(line>=0,`问题依据需重新定位：${e}`);return `${m[1]}：行${line+1}；${m[2]}`;});
const catalog=original('business-rule-catalog.json'),library=original('test-scenario-library.json'),states=original('state-transition-baseline.json');
const caseMap=new Map(oldCases.map(c=>[c.用例编号,c]));
await finishStage(family,'semantic-read',{输入数量:units.length,输出数量:units.length,原因:'当前两份需求全文读取及修订对象源文定位；不代表从头语义复核全部需求'});
await begin('normalize-rules');
const ruleByOldId=new Map(oldCases.map(c=>[c.用例编号,catalog.规则.find(r=>c.备注.includes('规则：'+r.稳定规则标识))]));
const oldUnits=original('requirement-units.json'),oldCoverage=original('requirement-coverage.json');
const matchedUnits=new Map(), occurrences=new Map();
for(const u of oldUnits){const k=JSON.stringify([u.路径,u.原文]),n=occurrences.get(k)||0;occurrences.set(k,n+1);const candidates=units.filter(x=>x.路径===u.路径&&x.原文===u.原文);assert(candidates[n],`原需求正文已变，需语义处理：${u.路径}:${u.行}`);matchedUnits.set(u.标识,candidates[n]);}
function rebind(e){
  assert.equal(e.路径,formal.路径,'正式规则只能引用当前统一需求');
  const hits=lines.flatMap((line,i)=>line===e.原文?[i+1]:[]);assert(hits.length,`当前需求未命中：${e.原文}`);
  const previous=Number(e.位置.replace('行',''));
  const line=hits.sort((a,b)=>Math.abs(a-previous)-Math.abs(b-previous))[0];
  return {...e,位置:`行${line}`,'SHA-256':formal['SHA-256']};
}
function source(id){const i=lines.findIndex(line=>line.startsWith(`- [${id}]`));assert(i>=0,id);return {路径:formal.路径,位置:`行${i+1}`,原文:lines[i],'SHA-256':formal['SHA-256'],证明内容:lines[i]};}
function includeSource(r,id){const e=source(id);if(!r.证据引用.some(x=>x.原文===e.原文))r.证据引用.push(e);return r.证据引用.findIndex(x=>x.原文===e.原文);}
function steps(r,operations){r.用例设计.步骤=operations.map(operation=>{const action=['点击','确认','查看','输入','打开','选择','取消','清空'].find(v=>operation.startsWith(v));assert(action,operation);return {执行角色:r.执行角色,动作:action,对象:operation.slice(action.length),操作:operation,证据:r.证据引用.map((_,i)=>i)};});r.触发动作=operations.at(-1);}
const changes=[], added=[],environment=[];
for(const [id,r]of ruleByOldId){
  assert(r,id);r.证据引用=r.证据引用.map(rebind);
  const before={子项:r.用例设计.验证子项,优先级:r.用例设计.优先级};
  if(subitems.has(id))r.用例设计.验证子项=subitems.get(id);
  assert(priorities.has(id),`未设计优先级：${id}`);Object.assign(r.用例设计,priorities.get(id));
  r.用例设计.优先级依据=`${r.用例设计.验证子项}：${r.用例设计.优先级依据}`;
  if(faults.has(id)){
    const fault=faults.get(id);r.用例设计.测试环境准备=fault;r.用例设计.用例类型='异常用例';
    r.必要条件.push(`环境准备要求（尚未具备）：${fault.模拟方式}`);
    r.用例设计.备注=[...(r.用例设计.备注||[]),`环境待准备：${fault.故障对象}；时点：${fault.触发时点}；恢复：${fault.恢复方式}`];
    environment.push({修订对象:id,规则标识:r.稳定规则标识,...fault});
  }
  if(before.子项!==r.用例设计.验证子项||before.优先级!==r.用例设计.优先级)changes.push({修订对象:id,规则标识:r.稳定规则标识,修改前:before,修改后:{子项:r.用例设计.验证子项,优先级:r.用例设计.优先级}});
}
for(const t of states.状态转换)t.证据引用=t.证据引用.map(rebind);
for(const s of library.场景)s.来源单元=s.来源单元.map(id=>{assert(matchedUnits.has(id),id);return matchedUnits.get(id).标识;});
function add(baseId, label, result, refs, options={}){
  const r=structuredClone(ruleByOldId.get(baseId));assert(r,baseId);
  r.稳定规则标识=`BR-${fingerprint([baseId,label,result,options]).slice(0,16)}`;
  r.用例设计.场景=options.title||`验证${caseMap.get(baseId).用例描述.slice(2)}后的${label}`;
  r.用例设计.验证子项=label;r.目标状态或可观察结果=result;r.用例设计.观察对象=label;r.用例设计.计算=null;
  for(const id of refs)includeSource(r,id);
  if(options.pre)r.必要条件=options.pre;
  if(options.page){const p=directory.页面.find(p=>p.页面路径===options.page);assert(p,options.page);r.功能模块=p.功能模块;r.功能结构=`${p.页面名称}（${r.执行角色}视角）`;r.用例设计.观察页面=p.页面名称;r.用例设计.观察页面路径=p.页面路径;r.模块归属说明=`当前MainBasis目录：${p.页面路径}属于${p.功能模块}`;const entry=lines.find(l=>l.startsWith('页面：')&&l.includes(options.page));assert(entry);r.证据引用.push(rebind({...formal,位置:'行1',原文:entry,证明内容:'当前目标端观察页面'}));}
  if(options.operations)steps(r,options.operations);
  r.用例设计.观察证据=r.证据引用.map((_,i)=>i);
  r.用例设计.优先级=options.priority||'P1';r.用例设计.优先级依据=options.reason||`${label}属于账号登录或权限拒绝的关键结果，需与导航、提示分别验证`;
  r.用例设计.设计说明=`本轮从当前需求${refs.join('、')}拆出的独立结果：${result}`;
  const inherited=library.场景.find(s=>s.规则标识.includes(ruleByOldId.get(baseId).稳定规则标识));
  const scene={...structuredClone(inherited),场景标识:`SC-${r.稳定规则标识.slice(3)}`,规则标识:[r.稳定规则标识],来源条款:refs,来源单元:refs.map(id=>units.find(u=>u.原文.startsWith(`- [${id}]`)).标识)};
  if(options.transition)scene.状态转换标识=options.transition;
  else delete scene.状态转换标识;
  catalog.规则.push(r);library.场景.push(scene);added.push({原相关用例:baseId,规则标识:r.稳定规则标识,场景:scene.场景标识,验证子项:label,来源条款:refs});return r;
}
// Independent outcomes taken from the current OAuth clauses, before coverage is assigned.
for(const [provider,offset]of [['Google',0],['Facebook',8],['Apple ID',16],['TikTok',24]]){
  const id=n=>`USER-01-${String(offset+n).padStart(4,'0')}`;
  add(id(2),'协议未同意授权页限制','不唤起第三方授权页面',['REQ-527b389bdcda']);
  add(id(3),'授权取消页面停留','停留登录与注册页',['REQ-d73f453a6aba']);
  add(id(4),'授权失败页面停留','停留登录与注册页',['REQ-d73f453a6aba','REQ-a018ce659c74']);
  const banned=ruleByOldId.get(id(7));banned.目标状态或可观察结果='停留登录与注册页';banned.用例设计.验证子项='封禁账号页面停留';
  add(id(7),'封禁账号提示文案','提示“账号已被封禁”',['REQ-c006ed524230','REQ-f07ba4f39c72']);
  const old=ruleByOldId.get(id(5));
  add(id(5),'登录账号身份一致性','个人中心用户ID为本次授权平台账号原来绑定的Luma Live用户ID',['REQ-b176b815ee3f','REQ-af1de9dc6f1d','REQ-0af0c40e3094'],{
    title:`验证${provider}授权后进入原绑定账号`,page:'liveshow-proto/prototype/pages/user/profile/profile.html',
    pre:[...old.必要条件,`已记录该${provider}账号原绑定的Luma Live用户ID；当前设备不登录其他账号`],
    operations:[`点击${provider}登录`,'确认第三方账号授权','点击底部我的入口','查看个人中心用户ID'],transition:'ST-USER-001'});
  for(const n of [5,6]){const r=ruleByOldId.get(id(n)),s=library.场景.find(s=>s.规则标识.includes(r.稳定规则标识));s.状态转换标识=n===5?'ST-USER-001':'ST-USER-002';}
}
// Keep timestamp meaning separate from the unresolved cooling-period formatting choice.
const dates=[['USER-07-0166','平台已上传当前主播2026年9月1日的分成记录','分成日期显示01/09/2026'],['USER-08-0063','当前金币流水在显示时区的发生时刻为2026年9月15日10时00分00秒','发生时间显示15/09/2026 10.00'],['USER-08-0064','该消费订单在显示时区的支付时刻为2026年9月15日10时00分00秒','支付时间显示15/09/2026 10.00'],['USER-05-0247','公会在显示时区的2026年9月15日10时00分通过申请','通过时间显示15/09/2026 10.00'],['USER-05-0248','公会在显示时区的2026年9月15日10时00分驳回申请','驳回时间显示15/09/2026 10.00'],['USER-06-0079','该申请在显示时区的2026年9月15日10时00分提交','提交时间显示15/09/2026 10.00']];
for(const [id,pre,result]of dates){const r=ruleByOldId.get(id);r.必要条件=[r.必要条件[0],pre];r.目标状态或可观察结果=result;includeSource(r,'COMMON-user-date-format');r.用例设计.观察证据=r.证据引用.map((_,i)=>i);const s=library.场景.find(s=>s.规则标识.includes(r.稳定规则标识));s.来源单元.push(units.find(u=>u.原文.startsWith('- [COMMON-user-date-format]')).标识);}
const cooling=ruleByOldId.get('USER-01-0102');cooling.目标状态或可观察结果='可取消截止时间表示2026年9月22日10时00分';cooling.必要条件=[cooling.必要条件[0],'账号可取消截止时刻为显示时区的2026年9月22日10时00分'];cooling.用例设计.备注=[...(cooling.用例设计.备注||[]),'仅验证截止时刻；显示格式由Q-050确认，不采用旧格式作为确定要求'];
assert(!questions.some(q=>q.问题编号==='Q-050'));
const coolingQuestion={...structuredClone(questions[0]),问题编号:'Q-050',需求组编号:'RQ-050',父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:'系统入口',具体场景:'未登录用户查看注销冷静期可取消截止时间',问题分类:'业务规则',待决策问题:'可取消截止时间采用统一日期格式还是冷静期独立批注格式？',可选方案:['统一格式：dd/mm/yyyy HH.mm','冷静期独立格式：MM/DD HH:mm'],测试建议:'先核对截止时刻对应的业务时间；格式确定后单独补充显示格式用例，不据此变更七日冷静期。',产品结论:'',结论补充:'',已知依据:[risk.路径+'：PENDING-cooling-date-format',formal.路径+'：COMMON-user-date-format'],影响范围:['用户App注销冷静期弹窗的截止时间格式'],已有用例编号:[],确认后待补用例:['冷静期截止时间显示格式'],负责人:'产品',期望确认时间:'',确认状态:'待确认'};
questions.push(coolingQuestion);
// A login page alone cannot observe whether the backend created a session.
const isolated=ruleByOldId.get('USER-01-0116');isolated.可生成正式用例=false;isolated.规则状态='生成待复核';isolated.隔离原因='预期要求检查登录会话，但原步骤只有第三方授权，缺少有依据的会话观察位置。保留测试环境准备要求和覆盖缺口。';
const isolatedScene=library.场景.find(s=>s.规则标识.includes(isolated.稳定规则标识));
library.场景=library.场景.filter(s=>s!==isolatedScene);
await save('isolated-case.json',{原用例编号:'USER-01-0116',规则:isolated,原场景:isolatedScene});
catalog.规则=catalog.规则.filter(r=>r!==isolated);
for(const r of catalog.规则){
  const scene=library.场景.find(s=>s.规则标识.includes(r.稳定规则标识)),st=states.状态转换.find(t=>t.状态转换标识===scene.状态转换标识);
  if(st){r.共同业务对象=st.共同业务对象;r.跨模块流程编号=`FLOW-${fingerprint(st.共同业务对象).slice(0,8).toUpperCase()}`;r.用例设计.备注=[...(r.用例设计.备注||[]).filter(n=>!n.startsWith('状态转换：')),`状态转换：${st.状态转换标识}；共同业务对象：${st.共同业务对象}；当前阶段：${st.触发动作}后的用户App观察`];}
  r.用例设计.设计说明+=`；本轮修订核对：观察子项=${r.用例设计.验证子项}；预期=${r.目标状态或可观察结果}`;
  r.设计复核={状态:'通过',说明:'本次授权修订：当前来源原文逐条定位，保留仍有效的业务契约；已人工审阅修订目标的观察维度与风险分级，新登录结果按当前条款拆分，环境准备标记不代表已具备或已执行。未宣称重新完成全部需求分支覆盖。',设计SHA256:ruleDesignHash(r)};
}
await finishStage(family,'normalize-rules',{输入数量:oldCases.length,输出数量:catalog.规则.length});
await begin('generate-dedup');
const cases=casesFromCatalog(catalog,{moduleDirectory:directory}),byRule=new Map(cases.map(c=>[c.备注.find(n=>n.startsWith('规则：')).slice(3),c]));
const newId=new Map([...ruleByOldId].map(([id,r])=>[id,byRule.get(r.稳定规则标识)?.用例编号]));
for(const q of questions)q.已有用例编号=q.已有用例编号.map(id=>newId.get(id)).filter(Boolean);
for(const s of library.场景){const c=byRule.get(s.规则标识[0]);assert(c);s.用例编号=c.用例编号;s.入口=catalog.规则.find(r=>r.稳定规则标识===s.规则标识[0]).用例设计.观察页面路径;s.用例契约={前置条件:c.前置条件,操作步骤:c.操作步骤,预期结果:c.预期结果};}
const coverage=seedCoverage(units),oldRows=new Map(oldCoverage.逐项.map(r=>[r.来源标识,r]));
for(const [oldId,u]of matchedUnits){const row=structuredClone(oldRows.get(oldId));row.来源标识=u.标识;row.说明+='；本轮修订按不变的需求原文续接，不能据此新增完整覆盖声明';for(const b of row.分支)if(b.场景标识===isolatedScene.场景标识){b.状态='未覆盖';b.说明=isolated.隔离原因;delete b.场景标识;delete b.用例编号;row.状态=row.分支.some(x=>x.状态==='已设计')?'部分覆盖':'未覆盖';}coverage.逐项[units.indexOf(u)]=row;}
const rowFor=id=>coverage.逐项.find(r=>r.来源标识===units.find(u=>u.原文.startsWith(`- [${id}]`))?.标识);
for(const s of library.场景){for(const sourceId of s.来源单元){const row=coverage.逐项.find(r=>r.来源标识===sourceId);assert(row);const u=units.find(u=>u.标识===sourceId);if(!row.分支.some(b=>b.场景标识===s.场景标识)){row.分支.push({标识:`CB-${sourceId.slice(0,12)}-${s.场景标识}`,状态:'已设计',说明:catalog.规则.find(r=>r.稳定规则标识===s.规则标识[0]).用例设计.场景,来源片段:u.原文,场景标识:s.场景标识,用例编号:s.用例编号});if(!['已覆盖','部分覆盖'].includes(row.状态)){row.状态='部分覆盖';row.说明='已绑定本轮明确设计的结果；尚未完成的其他条款结果继续保留，不以场景关联冒充整条覆盖';row.分支.push({标识:`REVIEW-${sourceId}`,状态:'未覆盖',说明:'其他条件或结果尚未完成独立分解，保留生成待复核'});delete row.问题编号;}}}}
for(const row of coverage.逐项)for(const b of row.分支){if(b.状态==='已设计'){const s=library.场景.find(s=>s.场景标识===b.场景标识);assert(s);b.用例编号=s.用例编号;}}
// These clauses explicitly have backend outcomes that App navigation/toasts alone cannot prove.
for(const [id,results]of [
  ['REQ-527b389bdcda',[['不发起授权','第三方授权请求未发出；仅未显示授权页不能证明网络层无请求']]],
  ['REQ-d73f453a6aba',[['不创建账号','取消、失败、无有效标识三种条件下账号记录均不得创建'],['不建立登录会话','取消、失败、无有效标识三种条件下不得建立会话']]],
  ['REQ-c006ed524230',[['不建立登录会话','封禁账号不得建立登录会话']]],
  ['REQ-b4c289296364',[['不建立常规登录会话','冷静期账号不得建立常规登录会话']]],
  ['REQ-af1de9dc6f1d',[['自动创建账号','首次有效授权创建账号及用户ID'],['建立登录会话','已有账号完成授权后创建对应登录会话']]],
]){
  const row=rowFor(id);assert(row);row.结果基线=[];
  for(const [i,[fragment,meaning]]of results.entries()){const bid=`OUTCOME-${id}-${i+1}`;row.分支.push({标识:bid,状态:'未覆盖',说明:`${meaning}：需测试环境提供账号/会话或授权请求观察方式，单独列为测试准备缺口；本次用户App页面用例不能冒充该数据层断言`});row.结果基线.push({标识:`RESULT-${id}-${i+1}`,来源片段:fragment,结果说明:meaning,分支标识:[bid]});}
  row.状态=row.分支.some(b=>b.状态==='已设计')?'部分覆盖':'未覆盖';row.说明='该条包含独立界面和账号/会话结果，已拆分可观察界面；数据层结果仍保留测试环境缺口，不再以任一关联场景代表整条覆盖';
}
for(const row of coverage.逐项){const u=units.find(u=>u.标识===row.来源标识);if(!row.说明){row.状态='不适用';row.说明=u.风险?'本行是新增风险标题/来源定位或非本端事项':'本行是其他端新增规则，不改变本次用户App契约';}}
for(const u of units.filter(u=>u.原文.includes('[PENDING-cooling-date-format]'))){const row=coverage.逐项.find(r=>r.来源标识===u.标识);row.状态='待确认';row.问题编号='Q-050';row.说明='冷静期格式冲突保留当前正式风险，不沿用旧用例格式';row.分支=[];}
coverage.状态转换处理=oldCoverage.状态转换处理.map(p=>({...p,场景标识:library.场景.filter(s=>s.状态转换标识===p.状态转换标识).map(s=>s.场景标识)}));
coverage.契约模式='场景引用';coverage.场景库SHA256=fingerprint(library);coverage.交付性质='部分覆盖';
coverage.影响复核={范围:'当前用户App既有用例质量修订',输入:'当前MainBasis两份文件；原交付只作为用户指定修订对象',实际修订:changes,新增结果:added,环境待准备:environment,复用边界:'未变化来源及业务契约续接，不从已有用例反推需求；本轮不重建或宣称全部业务覆盖'};
coverage.语义复核={说明:'修订复核绑定当前全文、场景与影响清单；已保留账号/会话观察缺口与冷静期格式冲突。未据已关联场景宣称新增多结果条款全部覆盖。',内容SHA256:reviewHash(coverage)};
const candidate={测试用例:cases,需求待确认:questions},check=validateTestcaseRecords(candidate,await loadTestcaseLanguageRules());
await save('repair-language-check.json',check);
await save('repair-summary.json',{状态:'待交付检查',当前需求:baseline.文档,修订记录:changes,补充结果:added,测试环境准备:environment,编号对应:[...newId].map(([原编号,修订编号])=>({原编号,修订编号:修订编号||null})),隔离说明:isolated.隔离原因,用例数:cases.length,需求待确认数:questions.length});
if(check.问题.length){console.log(check.问题);throw new Error('用例语言需修正，尚未导出');}
await save('business-rule-catalog.json',catalog);await save('test-scenario-library.json',library);await save('state-transition-baseline.json',states);await save('requirement-coverage.json',coverage);
const atoms=units.map(u=>({原子标识:u.标识,来源:u.路径,位置:`行${u.行}`,原文:u.原文,性质:'需求全文单元，不是覆盖率'}));await save('evidence-atom-index.json',{schemaVersion:'1.0',证据原子:atoms});
await save('coverage-matrix.json',{schemaVersion:'1.0',规则处理:coverage.逐项.map(row=>({原子标识:row.来源标识,去向:row.分支.some(b=>b.状态==='已设计')?'正式用例':row.状态==='待确认'?'需求待确认':row.状态==='不适用'?'不适用':'未覆盖',依据:row.说明,...(row.问题编号?{问题编号:row.问题编号}:{}),规则标识:[...new Set(row.分支.filter(b=>b.状态==='已设计').flatMap(b=>library.场景.find(s=>s.场景标识===b.场景标识).规则标识))]}))});
const candidateText=JSON.stringify(candidate,null,2)+'\n',dedup=original('semantic-dedup-review.json');
dedup.候选SHA256=fingerprint(candidateText);
dedup.复核结果=dedup.复核结果.filter(r=>r.稳定规则标识!==isolated.稳定规则标识);
for(const r of catalog.规则){const c=byRule.get(r.稳定规则标识);let record=dedup.复核结果.find(x=>x.稳定规则标识===r.稳定规则标识);if(!record){record={稳定规则标识:r.稳定规则标识,判定:'保留',判定理由:'本轮从同一登录动作拆出的独立观察结果；渠道、条件、页面和实际断言与原项不同，不以标题差异作为去重依据',附加条件:[]};dedup.复核结果.push(record);}Object.assign(record,{归一化业务键:ruleBusinessKey(r),状态关系:r.来源状态,关键操作:c.操作步骤.join(' → '),可观察结果:c.预期结果[0],基础条件:c.前置条件,保留或合并目标:c.用例编号,证据:r.证据引用,候选用例追溯:[c.用例编号]});}
await save('semantic-dedup-review.json',dedup);
await finishStage(family,'generate-dedup',{输入数量:catalog.规则.length,输出数量:cases.length});
if(!(await readMetrics(family)).阶段.some(s=>s.阶段名称==='history-compare'))await skipStage(family,'history-compare','本次仅修复用户指定的当前交付；不读取其他历史用例或进行历史覆盖比较');
await begin('inventory-hash');
const syncPath=baseline.同步记录.find(x=>x.路径.endsWith('prototype-context-sync-result.json')).路径;
const scan=await read(syncPath.replace('prototype-context-sync-result.json','global-evidence-scan-result.json'));
const projectFiles=[];
async function inventory(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(entry.name))continue;const p=`${dir}/${entry.name}`;if(entry.isDirectory())await inventory(p);else if(entry.isFile())projectFiles.push({路径:p,'SHA-256':fingerprint(await fs.readFile(p))});}}
await inventory('liveshow-proto');projectFiles.sort((a,b)=>a.路径.localeCompare(b.路径,'zh-CN'));
scan.文件清单=projectFiles;scan.项目指纹=fingerprint(projectFiles.map(f=>`${f.路径.slice('liveshow-proto/'.length)}|${f['SHA-256']}`).join('\n'));
scan.项目接入基线=original('global-evidence-scan-result.json').项目接入基线;
scan.缓存清理={状态:'成功',清理后残留失效文件:[],适用:false,说明:'本次修订目录全新建立，未读入历史用例缓存；需求传递仅续接当前哈希未变化的已发布基线'};
scan.规则影响层='用例设计与输出：观察子项、优先级、环境准备、结果分支；当前业务文档不变';
scan.规则基线=await Promise.all(original('global-evidence-scan-result.json').规则基线.map(async r=>({...r,'SHA-256':fingerprint(await fs.readFile(r.路径))})));
scan.语义读取记录=baseline.文档.map((f,i)=>({路径:f.路径,SHA256:f['SHA-256'],结论:i?'当前风险全文读入，补充冷静期格式冲突；不作为预期来源':'当前业务全文哈希绑定，逐引用原文定位；修订结果和新增登录分支回到当前条款核对，未重做范围外全量生成',关联规则:catalog.规则.map(r=>r.稳定规则标识)}));
await save('global-evidence-scan-result.json',scan);await save('prototype-context-sync-result.json',await read(syncPath));
const manifest={schemaVersion:'1.0',项目名称:'Luma Live',项目目录:'liveshow-proto',任务标识:'liveshow-user-repair-260915-001',任务工作目录:task,目标范围:catalog.目标范围,生成策略:'current-evidence-only',历史策略:'不读取不比较',修订授权:'当前用户明确要求修复本次审查问题；当前交付为修订对象，不参与业务规则推导或历史比较',MainBasis基线:{路径:'work/liveshow-proto-mainbasis/latest.json','SHA-256':基线SHA256},当前业务规则清单:`${task}/business-rule-catalog.json`,当前候选用例:`${task}/current-testcase-candidate.json`,最终用例JSON:`${task}/final-testcases.json`,生成脚本:`${task}/repair.mjs`,需求覆盖清单:`${task}/requirement-coverage.json`,独立场景库:`${task}/test-scenario-library.json`,状态转换基线:`${task}/state-transition-baseline.json`,输入文件:baseline.文档.map((f,i)=>({...f,角色:i?'风险与缺口':'当前业务证据',内容类型:i?'需求待确认清单':'统一需求文档',允许定义业务规则:!i}))};
const register=async(p,role,type,may=false)=>manifest.输入文件.push({路径:p,'SHA-256':fingerprint(await fs.readFile(p)),角色:role,内容类型:type,允许定义业务规则:may});
for(const n of ['business-rule-catalog.json','test-scenario-library.json','state-transition-baseline.json','requirement-units.json','requirement-coverage.json','evidence-atom-index.json','coverage-matrix.json','semantic-dedup-review.json','global-evidence-scan-result.json','prototype-context-sync-result.json','repair-summary.json','repair-input.json','isolated-case.json'])await register(`${task}/${n}`,'本次派生产物',n==='business-rule-catalog.json'?'业务规则清单':n==='repair-input.json'?'用户指定当前修订对象快照':'当前修订追溯',n==='business-rule-catalog.json');
for(const p of [`${task}/repair.mjs`,`${family}/subitem-review.mjs`,`${family}/priority-review.mjs`,`${family}/fault-review.mjs`])await register(p,'执行工具','当前修订设计工具');
await save('generation-input-manifest.json',manifest);
await finishStage(family,'inventory-hash',{输入数量:projectFiles.length+manifest.输入文件.length,输出数量:manifest.输入文件.length});
await begin('json-validate');
await save('pre-generate-validation.json',await validateGenerationInput(`${task}/generation-input-manifest.json`,process.cwd(),'pre-generate'));
await fs.writeFile(`${task}/current-testcase-candidate.json`,candidateText);await fs.writeFile(`${task}/final-testcases.json`,candidateText);
for(const [n,type]of [['current-testcase-candidate.json','当前候选用例'],['final-testcases.json','最终用例JSON']])await register(`${task}/${n}`,'本次派生产物',type);
await save('generation-input-manifest.json',manifest);
await save('final-generation-validation.json',await validateGenerationInput(`${task}/generation-input-manifest.json`,process.cwd(),'final'));
await finishStage(family,'json-validate',{输入数量:cases.length+questions.length,输出数量:cases.length+questions.length});
console.log({用例:cases.length,通用子项修订:subitems.size,环境要求:environment.length,新增:added.length});
