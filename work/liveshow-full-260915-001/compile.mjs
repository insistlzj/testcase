import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
import {ruleDesignHash,ruleBusinessKey,casesFromCatalog,validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules,validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';
import {readModuleDirectory,moduleNames} from '../../scripts/prototype-directory.mjs';
import {verifyMainBasis} from '../../scripts/mainbasis.mjs';
import {validateTestcaseDelivery,validateTestcaseBatch} from '../../scripts/validate-testcase-delivery.mjs';
import {sourceResults} from './result-baseline.mjs';
import {reviews} from './coverage-review.mjs';

const root=process.cwd(),task='work/liveshow-full-260915-001';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const write=async(f,x)=>fs.writeFile(f,JSON.stringify(x,null,2)+'\n');
const sha=async f=>fingerprint(await fs.readFile(f));
const {baseline,基线SHA256,config}=await verifyMainBasis(root,'liveshow-proto');
const [formal,risk]=baseline.文档.map(x=>x.路径),text=await fs.readFile(formal,'utf8'),riskText=await fs.readFile(risk,'utf8');
const lines=text.split('\n'),directory=readModuleDirectory(text),language=await loadTestcaseLanguageRules();
const batch=await read(`${task}/batch.json`),units=await read(`${task}/user/requirement-units.json`);
// Read the independently authored source outcomes before opening scene designs.
const resultBaseline=new Map(units.map(u=>[u.标识,sourceResults(u)]).filter(([,v])=>v));
const pages=new Map();let page;
for(let i=0;i<lines.length;i++){
 const m=lines[i].match(/^页面：([^；]+)；实际承载：([^；]+)；/u);
 if(m)page={...directory.页面.find(p=>p.页面路径===m[2]),视图:lines[i-1].replace(/^## /,''),文件:m[1]};
 if(page&&/^\- \[(?:REQ|META)-/.test(lines[i]))pages.set(i+1,page);
}
const questions=riskText.split('\n').map((line,i)=>({line,n:i+1})).filter(x=>x.line.startsWith('- [PENDING-')).map(({line,n})=>{
 const m=line.match(/^- \[(PENDING-[^\]]+)\] (.*?) 选项：(.*?)。影响端：(.*?)。依据：(.*)$/u);assert(m,line);
 return {id:m[1],question:m[2],options:m[3].split(/[；;]/).map(s=>s.replace(/^[A-D]\.\s*/,'')),ends:m[4].split('、'),source:line,n};
});
assert.equal(questions.length,44);
const qMap=new Map(questions.map(q=>[q.id,q]));
const pendingModules=new Map(`
cooling-date-format|系统入口、我的||
profile-live-entry|我的||
badge-location|我的、直播||运营配置
badge-auto|我的、直播||运营配置
badge-wear|我的、直播||运营配置
reward-prop-conflict|首页与福利、我的||运营配置、礼物道具
virtual-board|首页与福利、直播|运营工具、数据与收益|运营账号、数据分析
search-sort|首页与福利||
follower-sort|我的、主播中心||
friend-sort|消息与社交||
profile-clubs-sort|我的||
moderator-sort|直播、主播中心||
guild-notice-sort|主播中心|登录与首页、运营工具|
fan-tie|主播中心||
live-detail-sort|主播中心||
country-sort|系统入口||
operation-login-format|系统入口|运营工具|运营账号
intimacy|我的、直播、主播中心||运营配置
intimacy-decay|我的、直播、主播中心||运营配置
rank-unlisted|我的、直播||
rank-missing|我的、直播||
checkin-repair|首页与福利||运营配置
business-zone|首页与福利、直播、主播中心|数据与收益、主播管理|数据分析、运营配置
reward-disabled|首页与福利||运营配置
effective-duration|主播中心|主播管理、数据与收益|数据分析
cross-day-live|主播中心|主播管理、数据与收益|数据分析
metric-latency|首页与福利、直播、我的、主播中心|主播管理、数据与收益|工作台、数据分析、运营配置
first-recharge|钱包与账单||运营配置、订单管理
first-recharge-hide|钱包与账单||
recharge-expiry|钱包与账单、直播||运营配置、订单管理
recharge-empty|钱包与账单、直播||
level-gift-scope|我的、直播、主播中心||运营配置
club-level-attribution|我的、主播中心||运营配置
coin-precision|钱包与账单、主播中心、直播|主播管理、数据与收益|礼物道具、订单管理、数据分析
level-reversal|我的、直播、主播中心||运营配置
level-history|首页与福利、直播、我的、主播中心|主播管理、数据与收益|用户管理、主播管理、运营配置
badge-refresh|我的、直播||运营配置
badge-fallback|我的、直播||运营配置
share-detail|主播中心||
group-report|消息与社交||举报处理
level-save-atomic|||运营配置
level-concurrency|||运营配置
level-limit|||运营配置
badge-upload|||运营配置
`.trim().split('\n').map(s=>{const [id,...ends]=s.split('|');return ['PENDING-'+id,ends];}));
const sourceRef=f=>baseline.文档.find(e=>e.路径===f);
const projectFiles=[];
async function visit(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(e.name))continue;const f=path.posix.join(dir,e.name);if(e.isDirectory())await visit(f);else if(e.isFile())projectFiles.push({路径:f.slice('liveshow-proto/'.length),SHA256:await sha(f)});}}
await visit('liveshow-proto');projectFiles.sort((a,b)=>a.路径.localeCompare(b.路径,'zh-CN'));
const projectFingerprint=fingerprint(projectFiles.map(x=>`${x.路径}|${x.SHA256}`).join('\n'));
const toolFiles=['scripts/testcase-design.mjs','scripts/validate-generation-input.mjs','scripts/validate-testcase-json.mjs','scripts/validate-testcase-delivery.mjs','scripts/build-testcase-workbook.mjs','scripts/pipeline-metrics.mjs','scripts/prototype-directory.mjs','scripts/requirement-traceability.mjs','scripts/mainbasis.mjs','scripts/pending-core-view.py',...(await fs.readdir(task)).filter(f=>f.endsWith('.mjs')).map(f=>`${task}/${f}`)];
const ruleBase=await Promise.all(['AGENTS.md',...toolFiles].map(async f=>({路径:f,'SHA-256':await sha(f)})));
const syncRecords=await Promise.all(baseline.上游.filter(f=>f.路径.startsWith('liveshow-proto/context/')).map(async f=>({路径:f.路径,修改前SHA256:f['SHA-256'],修改后SHA256:await sha(f.路径),核对说明:'本次 MainBasis 版本检查确认当前上游未变化，复用已发布需求同步记录；未重新生成或修改需求'})));
const summaries=[];
for(const item of batch.端任务){
 const end=item.端名,dir=item.任务目录,scope={端名:end,模块名称:'全部模块'};
 const authored=await read(`${dir}/authored-design.json`);
 const moduleOrder=moduleNames(directory,end);
 const plans=authored.设计.filter(p=>p.规则.用例设计.观察端===end).sort((a,b)=>
   moduleOrder.indexOf(a.规则.功能模块)-moduleOrder.indexOf(b.规则.功能模块)
   || directory.页面.findIndex(p=>p.页面路径===a.规则.用例设计.观察页面路径)-directory.页面.findIndex(p=>p.页面路径===b.规则.用例设计.观察页面路径)
   || a.页面.localeCompare(b.页面,'zh-CN')
   || Math.min(...a.来源行.filter(n=>pages.get(n)?.文件===a.页面),Infinity)-Math.min(...b.来源行.filter(n=>pages.get(n)?.文件===b.页面),Infinity));
 const catalog={schemaVersion:'1.0',项目名称:'Luma Live',目标范围:scope,规则:plans.map(p=>p.规则)};
 const keys=new Set();
 for(const r of catalog.规则){
   assert.equal(validateRuleDesign(r,language,{requireReview:false}).length,0,r.稳定规则标识);
   assert(!keys.has(ruleBusinessKey(r)),`重复业务键${r.稳定规则标识}`);keys.add(ruleBusinessKey(r));
   // This attests the authored case path review, not exhaustive requirement coverage.
   r.设计复核={状态:'通过',说明:`已对照本条引用原文复核角色、数据、动作和单一结果；修正记录见本批 review-adjustments 及设计文件。仅证明本条路径，不证明整条需求的所有分支。${r.用例设计.设计说明}`,设计SHA256:ruleDesignHash(r)};
 }
 const rows=casesFromCatalog(catalog,{moduleDirectory:directory});
 const pending=questions.filter(q=>q.ends.includes(end)).map(q=>{
   const names=moduleNames(directory,end);
   const module=pendingModules.get(q.id)?.[['用户App','公会App','管理后台'].indexOf(end)];
   assert(module&&module.split('、').every(m=>names.includes(m)),`${q.id} ${end} 缺少明确问题模块`);
   return {问题编号:q.id,需求组编号:q.id,父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:module,具体场景:q.question.split('：')[0],问题分类:/时长|时区|精度|统计|计算|等级|贡献/.test(q.question)?'计算与统计口径':'业务规则',待决策问题:q.question,可选方案:q.options,测试建议:'先确认本项规则，再补充各选项对应的正向、边界及变更影响场景；当前不采用任一选项作为确定结果。',产品结论:'',结论补充:'',已知依据:[`${risk} 行${q.n}：${q.source}`],影响范围:q.ends,已有用例编号:[],确认后待补用例:[`${q.question.split('：')[0]}：按确认结论补齐相关分支`],负责人:'产品',期望确认时间:'',确认状态:'待确认'};
 });
 const candidate={测试用例:rows,需求待确认:pending};
 const result=validateTestcaseRecords(candidate,language);assert.equal(result.状态,'通过',JSON.stringify(result.问题));
 const library={schemaVersion:'1.0',目标范围:scope,场景:plans.map((p,i)=>({场景标识:'SC-'+p.规则.稳定规则标识,执行角色:p.规则.执行角色,目标端:end,入口:p.规则.用例设计.步骤[0].操作,用例契约:{前置条件:rows[i].前置条件,操作步骤:rows[i].操作步骤,预期结果:rows[i].预期结果},...(p.状态转换标识?{状态转换标识:p.状态转换标识}:{})}))};
 const states={schemaVersion:'1.0',来源指纹:fingerprint(units),说明:'根据当前需求建立的共享业务对象状态转换；缺失投影保留在各端覆盖清单',状态转换:authored.状态转换};
 const planByLine=new Map();plans.forEach((p,i)=>p.来源行.forEach(n=>{if(!planByLine.has(n))planByLine.set(n,[]);planByLine.get(n).push(i);}));
 const coverage={schemaVersion:'1.0',来源指纹:fingerprint(units),交付性质:'部分覆盖',契约模式:'场景引用',场景库SHA256:fingerprint(library),逐项:[],状态转换处理:[]};
 let currentRisk;
 for(const u of units){
   const row={来源标识:u.标识,状态:'未覆盖',说明:'需求原文保留；尚需完成本端逐结果与分支闭环。不得以页面已有用例代替完整覆盖。',分支:[]};
   const direct=u.路径===formal?(planByLine.get(u.行)||[]):[];
   if(u.风险){
     const id=u.原文.match(/PENDING-[\w-]+/)?.[0];if(id)currentRisk=id;
     if(!u.原文.startsWith('#')&&qMap.get(currentRisk)?.ends.includes(end)){row.状态='待确认';row.问题编号=currentRisk;row.说明='风险清单中的业务决定尚未确认，未生成确定性预期。';}
     else {row.状态='不适用';row.说明='风险清单标题、来源说明或该问题不涉及本端；不作为正式业务依据。';}
   } else if(direct.length){
     row.状态='部分覆盖';row.说明='已设计分支有具体用例；需求余下结果仍单列复核，不据引用次数宣称全覆盖。';
     row.分支=direct.map(i=>({标识:`B-${u.标识.slice(0,12)}-${i}`,状态:'已设计',说明:plans[i].规则.用例设计.场景,来源片段:u.原文,场景标识:library.场景[i].场景标识,用例编号:rows[i].用例编号}));
     row.分支.push({标识:`B-${u.标识.slice(0,12)}-remaining`,状态:'未覆盖',说明:'本条其他独立结果及适用边界仍需逐项核销；当前保留生成复核，不转换为业务待确认。'});
   } else if(u.行>=3500||u.原文.startsWith('#')||u.原文.startsWith('页面：')||u.原文.startsWith('- [META-')||/^\|\s*[-:]/.test(u.原文)||[1,3].includes(u.行)){
     row.状态='不适用';row.说明='标题、页面目录、用途说明或表格分隔，不独立定义可操作的业务结果；模块归属仍按目录承接。';
   } else if(pages.get(u.行)?.端名&&pages.get(u.行).端名!==end){row.状态='不适用';row.说明=`当前页面承载于${pages.get(u.行).端名}；本端需要的跨端业务仍通过有证据的端侧场景投影处理。`;}
   else if([686,1466,2195,2396,2994].includes(u.行)){row.状态='不适用';row.说明='表头或明确原型演示/实现缺口说明；不作为产品应当产生的业务结果。';}
   if(row.状态==='未覆盖'){
     const qs=[...u.原文.matchAll(/PENDING-[\w-]+/g)].map(m=>m[0]).filter(id=>pending.some(q=>q.问题编号===id));
     if(qs.length&&/未确认|待确认|不得写成/.test(u.原文)){row.状态='待确认';row.问题编号=qs[0];row.说明='原文明确指向未决问题，不将候选选项写成已确认规则。';}
   }
   const reviewed=!u.风险 && reviews.get(`${end}:${u.行}`);
   const results=resultBaseline.get(u.标识);
   if(reviewed) {
     assert(row.状态!=='不适用',`本端复核结果归属错误 ${end}:${u.行}`);
     row.分支=row.分支.filter(b=>b.状态==='已设计');
     row.结果基线=reviewed.map(({source,titles},k)=>{
       assert(u.原文.includes(source),`复核结果片段不属于原文 ${u.行}: ${source}`);
       const bindings=titles.map(title=>{
         const found=plans.map((p,i)=>({p,i})).filter(({p})=>p.规则.用例设计.场景===title);
         assert.equal(found.length,1,`本轮复核场景定位不唯一 ${end}: ${title}`);
         const {i}=found[0], id=`B-${u.标识.slice(0,12)}-${i}`;
         if(!row.分支.some(b=>b.标识===id))row.分支.push({标识:id,状态:'已设计',说明:title,来源片段:source,场景标识:library.场景[i].场景标识,用例编号:rows[i].用例编号});
         return id;
       });
       return {标识:`R-${u.标识.slice(0,16)}-${k+1}`,来源片段:source,结果说明:`按当前条款角色、条件和观察端核对：${source}`,分支标识:bindings};
     });
     row.状态='已覆盖';row.说明='已逐项核对本条结果与具体场景契约；结果基线及其关联路径见本条记录。仅关闭本条，不代表该模块或批次完整。';
   } else if(results && row.状态!=='不适用') {
     row.分支=row.分支.filter(b=>!b.标识.endsWith('-remaining'));
     row.结果基线=results.map(r=>{
       const id=`B-${r.标识}-review`;
       row.分支.push({标识:id,状态:'未覆盖',说明:`需逐结果核销本端适用性及正常、拒绝或跨端观察分支：${r.来源片段}；已有关联用例不自动证明该结果全部覆盖。`});
       return {...r,分支标识:[id]};
     });
   }
   coverage.逐项.push(row);
 }
 for(const t of states.状态转换.filter(t=>t.操作端===end||t.观察端.includes(end))){
   const ss=library.场景.filter(s=>s.状态转换标识===t.状态转换标识).map(s=>s.场景标识);
   coverage.状态转换处理.push({状态转换标识:t.状态转换标识,状态:ss.length?'已映射':'未覆盖',说明:ss.length?'存在本端具备执行条件与观察结果的具体场景；不代表整条跨端链已完成。':'本端转换结果仍须单独核对和补齐，未将其假称为业务待确认。',场景标识:ss});
 }
 coverage.语义复核={说明:'核对本次正式分支的来源引用与具体契约；未关闭的需求结果、边界和状态投影均保留生成缺口，因此仅允许部分覆盖。',内容SHA256:reviewHash(coverage)};
 const atoms={schemaVersion:'1.0',证据原子:units.map(u=>({原子标识:u.标识,来源:u.路径,位置:`行${u.行}`,原文:u.原文}))};
 const matrix={schemaVersion:'1.0',规则处理:units.map((u,i)=>{
   const c=coverage.逐项[i],indices=u.路径===formal?(planByLine.get(u.行)||[]):[];
   return {原子标识:u.标识,去向:indices.length?'正式用例':c.状态==='不适用'?'不适用':c.状态==='待确认'?'需求待确认':'未覆盖',依据:c.说明,...(indices.length?{规则标识:indices.map(i=>plans[i].规则.稳定规则标识)}:{}),...(c.问题编号?{问题编号:c.问题编号}:{})};
 })};
 const scan={schemaVersion:'1.0',扫描模式:'full',扫描状态:'有非阻塞待确认',模式依据:'当前 MainBasis 两份全文全新建立规则与场景，不读取历史用例、历史设计或语义缓存；当前有效上游基线仅作版本核对',项目指纹:projectFingerprint,阻塞项:[],缓存清理:{状态:'成功',说明:'本轮新目录未复用失效缓存，无待删除层；未删除历史数据',清理后残留失效文件:[]},项目接入基线:{状态:'已确认',路径:'work/liveshow-proto-project-onboarding/latest.json'},语义读取记录:[{路径:formal,SHA256:sourceRef(formal)['SHA-256'],结论:'全文读取，按当前端入口及业务对象独立设计；覆盖未完成项另列',关联规则:catalog.规则.map(r=>r.稳定规则标识)}],规则基线:ruleBase};
 const sync={schemaVersion:'1.0',同步状态:'通过',阻塞异常:[],需求清单有修改:false,文件核对:syncRecords,说明:'verifyMainBasis 验证上游全量哈希及已发布的两段逐项同步记录；本轮未发生上游变化，不重复同步'};
 await write(`${dir}/business-rule-catalog.json`,catalog);
 await write(`${dir}/independent-scenario-library.json`,library);
 await write(`${dir}/state-transition-baseline.json`,states);
 await write(`${dir}/requirement-coverage.json`,coverage);
 await write(`${dir}/current-testcase-candidate.json`,candidate);
 await write(`${dir}/final-testcases.json`,candidate);
 await write(`${dir}/evidence-atom-index.json`,atoms);await write(`${dir}/coverage-matrix.json`,matrix);
 await write(`${dir}/global-evidence-scan-result.json`,scan);await write(`${dir}/prototype-context-sync-result.json`,sync);
 const candidateHash=await sha(`${dir}/current-testcase-candidate.json`);
 await write(`${dir}/semantic-dedup-review.json`,{schemaVersion:'1.0',候选SHA256:candidateHash,待人工复核:[],复核结果:plans.map((p,i)=>{const r=p.规则;return {稳定规则标识:r.稳定规则标识,归一化业务键:ruleBusinessKey(r),状态关系:r.来源状态,关键操作:r.触发动作,可观察结果:r.目标状态或可观察结果,保留或合并目标:rows[i].用例编号,判定理由:`保留本条明确条件、角色、操作和结果；相同结果的不同输入、周期或角色分支独立保留。验证点：${r.用例设计.验证子项}`,基础条件:r.必要条件,附加条件:[],证据:r.证据引用,候选用例追溯:[rows[i].用例编号],判定:'保留'};})});
 const manifest={schemaVersion:'1.0',项目名称:'Luma Live',任务标识:`liveshow-full-260915-001-${path.basename(dir)}`,项目目录:'liveshow-proto',任务工作目录:dir,生成策略:'current-evidence-only',目标范围:scope,历史策略:'不读取不比较',MainBasis基线:{路径:config.baseline,'SHA-256':基线SHA256},当前业务规则清单:`${dir}/business-rule-catalog.json`,生成脚本:`${task}/compile.mjs`,当前候选用例:`${dir}/current-testcase-candidate.json`,最终用例JSON:`${dir}/final-testcases.json`,需求覆盖清单:`${dir}/requirement-coverage.json`,独立场景库:`${dir}/independent-scenario-library.json`,状态转换基线:`${dir}/state-transition-baseline.json`,输入文件:[]};
 for(const [f,role,type,allow] of [[formal,'当前业务证据','正式需求',true],[risk,'风险与缺口','需求待确认',false],...toolFiles.map(f=>[f,'执行工具','当前生成与校验工具',false])])manifest.输入文件.push({路径:f,'SHA-256':await sha(f),角色:role,内容类型:type,允许定义业务规则:allow});
 for(const f of ['authored-design.json','business-rule-catalog.json','independent-scenario-library.json','state-transition-baseline.json','requirement-coverage.json','current-testcase-candidate.json','final-testcases.json','evidence-atom-index.json','coverage-matrix.json','global-evidence-scan-result.json','prototype-context-sync-result.json','semantic-dedup-review.json'])manifest.输入文件.push({路径:`${dir}/${f}`,'SHA-256':await sha(`${dir}/${f}`),角色:'本次派生产物',内容类型:({'business-rule-catalog.json':'业务规则清单','current-testcase-candidate.json':'当前候选用例','final-testcases.json':'最终用例JSON'})[f]||'当前覆盖与证据产物',允许定义业务规则:f==='business-rule-catalog.json'});
 await write(`${dir}/generation-input-manifest.json`,manifest);
 const check=await validateTestcaseDelivery(path.resolve(dir),root,{phase:'final'});await write(`${dir}/validation-result.json`,check);
 summaries.push({端:end,用例:rows.length,待确认:pending.length,模块:[...new Set(rows.map(r=>r.功能模块))].length,覆盖:check.需求覆盖.条款处理统计});
}
const batchCheck=await validateTestcaseBatch(path.resolve(`${task}/batch.json`),root);await write(`${task}/batch-check.json`,batchCheck);
console.log(JSON.stringify({三端:summaries,批次后续动作:batchCheck.后续动作},null,2));
