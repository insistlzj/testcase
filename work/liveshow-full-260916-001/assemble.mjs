import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
import {ruleDesignHash,ruleBusinessKey,casesFromCatalog} from '../../scripts/testcase-design.mjs';
import {validateTestcaseRecords,loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';
import {formalPath,formalHash,riskPath,riskText,task,directory,pages,sourceRows} from './case-design.mjs';
import {pendingFor,pending} from './pending-decisions.mjs';
import {decisions,aliases as coverageAliases,pageAliases as coveragePageAliases} from './coverage-decisions.mjs';
import {refineStates,sceneTransitions} from './state-review.mjs';
import {sourceEnds} from './source-end-review.mjs';

const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const write=async(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
const sha=async p=>fingerprint(await fs.readFile(p));
const draftText=await fs.readFile(`${task}/authored-rule-draft.json`,'utf8');
// This signature names the snapshot actually read and corrected in the current task.
// A later design edit needs a new semantic review; running this assembler cannot approve it.
assert.equal(fingerprint(draftText),'b6e5585834fa1797e2797d61a88b71d1d879f9a8c5535db9a07b07382d121be9','设计已变化，返回逐条语义复核');
const draft=JSON.parse(draftText),initial=await read(`${task}/independent-rule-baseline.json`);
const common=await read(`${task}/independent-common-baseline.json`);
const completeBaseline=[...initial.规则,...common.规则].map(r=>sourceEnds.has(r.标识)?{...r,端:sourceEnds.get(r.标识)}:r);
assert.equal(new Set(completeBaseline.map(r=>r.来源单元)).size,completeBaseline.length,'公共条款与页面条款重复');
const applies=(r,end)=>Array.isArray(r.端)?r.端.includes(end):r.端===end;
const structural=new Map(common.结构排除.map(r=>[r.来源单元,r.说明]));
const originalStates=await read(`${task}/state-transition-baseline.json`);
const aliases={'ST-ops-lock':'ST-ops-platform-lock','ST-platform-end-live':'ST-close-live','ST-recharge-refund':'ST-refund','ST-host-share-upload':'ST-host-upload'};
const states=refineStates(originalStates);
for(const t of states.状态转换){
 t.流程编号=`FLOW-${fingerprint(t.共同业务对象).slice(0,10).toUpperCase()}`;
 if(['ST-role-disable','ST-role-permission'].includes(t.状态转换标识))t.执行角色='超级管理员';
}
for(const [id,obj,from,action,role,end,to,observes,page,fragment]of [
 ['ops-enable','运营账号','禁用','启用运营账号','公会长','公会App','启用',['公会App','管理后台','用户App'],'guild-operation-account-detail.html','重新启用后恢复'],
 ['live-warn','直播场次','直播中','警告','平台管理员','管理后台','直播中',['管理后台','用户App'],'admin-live-detail.html','警告不改状态'],
 ['inspection-create','巡房排班','未创建','保存有效排班','平台管理员','管理后台','已创建',['管理后台'],'admin-inspection-schedule-create.html','返回列表'],
 ['inspection-disable','巡房排班','生效中','停用排班','平台管理员','管理后台','已停用',['管理后台'],'admin-inspection-schedule.html','停用 -> 不再生效'],
 ['audit-ignore','机审告警','待处理','快捷忽略','平台管理员','管理后台','已忽略',['管理后台'],'admin-content-audit.html','快捷忽略 -> 完成告警'],
 ['audit-review','机审告警','待处理','转人工复审','平台管理员','管理后台','人工复审中',['管理后台'],'admin-content-audit-detail.html','转人工复审'],
 ['push-send','推送任务','待发送','立即发送','平台管理员','管理后台','已发送只读',['管理后台'],'admin-push-detail.html','状态变为已发送，当前页只读'],
 ])states.状态转换.push({状态转换标识:`ST-${id}`,共同业务对象:obj,来源状态:from,触发动作:action,执行角色:role,操作端:end,目标状态:to,观察端:observes,流程编号:`FLOW-${fingerprint(obj).slice(0,10).toUpperCase()}`,证据:sourceRows(page,[fragment]).map(r=>({路径:formalPath,'SHA-256':formalHash,行:r.line,原文:r.raw})),说明:'当前MainBasis明确转换；各端观察投影分别保留实际覆盖状态。'});
const stateMap=new Map(states.状态转换.map(t=>[t.状态转换标识,t]));
const bindings=new Map(draft.观察绑定.map(o=>[o.规则标识,{...o,状态转换标识:aliases[o.状态转换标识]||o.状态转换标识}]));
for(const [title,transition]of sceneTransitions){
 const matches=draft.规则.filter(r=>r.用例设计.场景===title);assert.equal(matches.length,1,`状态关联须唯一：${title}`);
 bindings.get(matches[0].稳定规则标识).状态转换标识=transition;
}
const reviewed=[];
for(const r of draft.规则){
 const binding=bindings.get(r.稳定规则标识),state=stateMap.get(binding.状态转换标识);
 if(state){r.共同业务对象=state.共同业务对象;r.跨模块流程编号=state.流程编号;}
 r.设计复核={状态:'通过',说明:`当前轮已逐条核对条件、动作、结果和本端观察位置；具体检查点为${r.用例设计.验证子项}。仅批准本条场景，不代表引用条款全文已经覆盖；未执行真实环境。`,设计SHA256:ruleDesignHash(r)};
 reviewed.push({规则标识:r.稳定规则标识,设计SHA256:r.设计复核.设计SHA256,检查点:r.用例设计.验证子项,裁定:'保留',说明:r.设计复核.说明});
}
await write(`${task}/design-review.json`,{来源草稿SHA256:fingerprint(draftText),复核方式:'逐条阅读条件动作结果与当前MainBasis依据；已修正标题重复、不可执行前置、观察端和权限重复分支',规则:reviewed});
const scanBase=await read(`${task}/basis/global-evidence-scan-result.json`),syncBase=await read(`${task}/basis/prototype-context-sync-result.json`);
const projectFiles=[];
async function inventory(dir){for(const ent of await fs.readdir(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())await inventory(p);else if(ent.isFile())projectFiles.push({path:path.relative('liveshow-proto',p).split(path.sep).join('/'),hash:await sha(p)});}}
await inventory('liveshow-proto');projectFiles.sort((a,b)=>a.path.localeCompare(b.path,'zh-CN'));
const projectHash=fingerprint(projectFiles.map(f=>`${f.path}|${f.hash}`).join('\n'));
const formalLines=(await fs.readFile(formalPath,'utf8')).split('\n');
const unitPage=new Map([...pages.values()].flatMap(p=>p.rows.map(r=>[r.unit,p])));
const rowByUnit=new Map(completeBaseline.map(r=>[r.来源单元,r]));
const tools=(await fs.readdir(task)).filter(f=>f.endsWith('.mjs')).map(f=>`${task}/${f}`).concat(['AGENTS.md','scripts/testcase-design.mjs','scripts/requirement-traceability.mjs','scripts/mainbasis.mjs','scripts/prototype-directory.mjs','scripts/build-testcase-workbook.mjs','scripts/validate-generation-input.mjs','scripts/validate-testcase-json.mjs','scripts/validate-testcase-delivery.mjs','scripts/pipeline-metrics.mjs','scripts/pending-core-view.py']);
for(const [key,end]of [['user','用户App'],['guild','公会App'],['admin','管理后台']]){
 const dir=`${task}/${key}`,scope={端名:end,模块名称:'全部模块'},rs=draft.规则.filter(r=>r.用例设计.观察端===end);
 const catalog={schemaVersion:'1.0',项目名称:'Luma Live',目标范围:scope,规则:rs};
 const cases=casesFromCatalog(catalog,{moduleDirectory:directory}),caseByRule=new Map(rs.map((r,i)=>[r.稳定规则标识,cases[i]]));
 const questions=pendingFor(end).map(q=>({...q,功能模块:q.功能模块==='直播间'?'直播':q.功能模块}));
 const candidate={测试用例:cases,需求待确认:questions};
 const languageCheck=validateTestcaseRecords(candidate,await loadTestcaseLanguageRules());assert.equal(languageCheck.状态,'通过',languageCheck.问题.join('\n'));
 const scenes={schemaVersion:'1.0',目标范围:scope,来源规则基线SHA256:await sha(`${task}/independent-rule-baseline.json`),场景:rs.map(r=>({场景标识:`SC-${r.稳定规则标识.slice(3)}`,规则标识:r.稳定规则标识,执行角色:r.执行角色,目标端:end,入口:r.用例设计.观察页面路径,状态转换标识:bindings.get(r.稳定规则标识).状态转换标识,用例契约:Object.fromEntries(['前置条件','操作步骤','预期结果'].map(k=>[k,caseByRule.get(r.稳定规则标识)[k]]))}))};
 const allUnits=await read(`${dir}/requirement-units.json`),report={schemaVersion:'1.0',来源指纹:fingerprint(allUnits),交付性质:'部分覆盖',契约模式:'场景引用',场景库SHA256:fingerprint(scenes),逐项:[],状态转换处理:[]};
 const byUnit=new Map();
 for(const r of rs){const obs=bindings.get(r.稳定规则标识);for(const src of obs.来源){if(!byUnit.has(src.单元))byUnit.set(src.单元,[]);byUnit.get(src.单元).push(r);}}
 for(const baseline of completeBaseline){
  const key=`${end}:${baseline.标识}`,names=coverageAliases.get(key)||coverageAliases.get(baseline.标识)||[],aliasPage=coveragePageAliases.get(key)||coveragePageAliases.get(baseline.标识);
  if(!names.length&&!aliasPage)continue;
  const additions=rs.filter(r=>names.includes(r.用例设计.场景)||(aliasPage&&bindings.get(r.稳定规则标识)?.页面===aliasPage));
  if(!applies(baseline,end))continue;
  if(names.length)assert.equal(additions.filter(r=>names.includes(r.用例设计.场景)).length,names.length,`覆盖关联未匹配当前完整场景名称：${baseline.标识}`);
  if(aliasPage)assert(additions.length,`覆盖关联页面没有当前场景：${baseline.标识}`);
  byUnit.set(baseline.来源单元,[...new Map([...(byUnit.get(baseline.来源单元)||[]),...additions].map(r=>[r.稳定规则标识,r])).values()]);
 }
 for(const unit of allUnits){
  const row={来源标识:unit.标识,状态:'不适用',说明:'标题、来源定位、页面目录或排版内容，不单独构成业务预期；业务正文另行保留覆盖去向。',分支:[]};
  const baseline=rowByUnit.get(unit.标识),bound=byUnit.get(unit.标识)||[];
  if(baseline){
   if(!applies(baseline,end)){
    row.说明=`该条款的独立场景归属${baseline.端}；在${end}仅作关联依据，不能因引用而把其他端整条需求重复投影。本端可观察的业务结果由本端页面规则和状态转换分别核对。`;
    if(bound.length)row.关联场景标识=bound.map(r=>`SC-${r.稳定规则标识.slice(3)}`);
   }
   else{
    row.状态=bound.length?'部分覆盖':'未覆盖';row.说明=bound.length?'已列出有确定依据的场景；条款剩余结果尚未全部核销，不以引用命中代替完整覆盖。':'当前条款的场景映射尚未完成，保留为生成遗漏继续补充，不转为业务待确认。';
    row.分支=bound.map(r=>({标识:`B-${unit.标识.slice(0,12)}-${unit.行}-${r.稳定规则标识.slice(3)}`,状态:'已设计',说明:r.用例设计.设计说明,来源片段:unit.原文,场景标识:`SC-${r.稳定规则标识.slice(3)}`,用例编号:caseByRule.get(r.稳定规则标识).用例编号}));
    const decision=decisions.get(`${end}:${baseline.标识}`)||decisions.get(baseline.标识);
    if(decision?.状态==='不适用'&&applies(baseline,end)){
     row.状态='不适用';row.说明=decision.说明;row.分支=[];
    }else if(decision?.状态==='已覆盖'&&applies(baseline,end)){
     assert(bound.length,`已核销条款没有当前场景${baseline.标识}`);
     row.状态='已覆盖';row.说明=decision.说明;
     row.结果基线=baseline.结果基线.map(result=>({...result,状态:'已核销',分支标识:row.分支.map(b=>b.标识)}));
    }else row.结果基线=baseline.结果基线.map((result,i)=>{
     const id=`GAP-${unit.标识.slice(0,16)}-${unit.行}-${i+1}`;
     const question=decision?.问题编号||(['REQ-e54798ae0be9','REQ-3f3013d27adc'].includes(baseline.标识)?'Q-026':baseline.标识==='REQ-8edde08dadba'?'Q-001':['REQ-ba4adee83342','REQ-18e6f92ab030'].includes(baseline.标识)?'Q-005':null);
     if(question&&questions.some(q=>q.问题编号===question)){
      row.分支.push({标识:id,状态:'待确认',问题编号:question,说明:`当前来源存在已登记的业务差异：${result.结果说明}`});
      if(!bound.length){row.状态='待确认';row.问题编号=question;row.说明='业务来源差异已定位到本条款，等待已登记问题决定。';}
     }else row.分支.push({标识:id,状态:'未覆盖',说明:`待逐结果核销：${result.结果说明}`});
     return{标识:result.标识,来源片段:result.来源片段,结果说明:result.结果说明,分支标识:[id]};
    });
   }
  }else if(structural.has(unit.标识))row.说明=structural.get(unit.标识);
  else if(/^(> 当前系统概要优先，原型页面及结构化批注补充。|> 同页视图归入所属页面；测试用例的功能模块取原型页面目录结构。|来源路径：liveshow-proto\/prototype\/index.html$|来源 SHA-256：[a-f0-9]{64}$|本节只定义模块名称和页面归属，不定义业务预期)/u.test(unit.原文))row.说明='已回读的来源优先级、目录归属或原型指纹元数据；用于生成治理和可追溯，不是产品功能分支。';
  else if(!unit.风险&&unit.原文.includes('【原型说明】'))row.说明='原型模拟、实现欠缺或表头说明；未把Mock状态作为业务预期。相邻正式规则保留独立覆盖和缺口。';
  else if(unit.风险&&/^\s*- \*\*/.test(unit.原文)){
   const source=unit.原文.match(/\*\*([^*]+)\*\*/)?.[1];
   let p=pending.find(p=>p.source===source&&p.ends.includes(end));
   if(!p&&end==='管理后台'&&/REQ-(d7f3f643d07a|df67cc8f2b42|7e0192674c1b|388500018828)/.test(source))p=pending.find(p=>p.source==='SRC-Q10');
   if(!p&&end==='管理后台'&&/REQ-(1c0dbccc3537|1ad5f236a5f5|bb762f9572c2)/.test(source))p=pending.find(p=>p.source==='SRC-Q11');
   if(p){row.状态='待确认';row.说明='当前风险文档明确缺少业务决定，隔离依赖该决定的分支。';row.问题编号=p.value.问题编号;}
   else row.说明='本风险条款影响其他端，由对应端问题清单承接；不生成本端确定预期。';
  }else if(!unit.风险&&!/^\s*(#|<!--|-->|```|来源：|依据：|页面入口：|\||本版从|本文件|以下目录|目录生成|原型目录)/.test(unit.原文)){
   row.状态='未覆盖';row.说明='公共业务正文尚待规则到本端场景核销，保留真实缺口。';
  }
  report.逐项.push(row);
 }
 const relevant=states.状态转换.filter(t=>t.操作端===end||t.观察端.includes(end));
 report.状态转换处理=relevant.map(t=>{
  const ids=scenes.场景.filter(s=>s.状态转换标识===t.状态转换标识).map(s=>s.场景标识);
  const question=(end==='用户App'&&['ST-ops-create','ST-ops-disable','ST-ops-enable'].includes(t.状态转换标识)||end==='公会App'&&t.状态转换标识==='ST-ops-create')?'Q-005':end==='公会App'&&t.状态转换标识==='ST-balance-correct'?'Q-027':null;
  return{状态转换标识:t.状态转换标识,状态:ids.length?'已映射':question?'待确认':'未覆盖',说明:ids.length?'本端已存在具体条件、操作和结果场景；其他端独立核对。':question?'目标端的登录凭证或观察入口缺少业务决定；关联问题确认前不编造执行路径。':'尚无本端对应场景，继续检查本端承载方式，不以其他端通过替代。',场景标识:ids,...(!ids.length&&question?{问题编号:question}:{})};
 });
 report.语义复核={说明:'对已设计场景逐条核对；所有尚未逐结果核销的条款保留未覆盖或部分覆盖。本报告明确是保守的阶段记录，不声称完整交付。',内容SHA256:reviewHash(report)};
 const atoms={schemaVersion:'1.0',证据原子:completeBaseline.filter(r=>applies(r,end)).map(r=>({原子标识:r.标识,来源单元:r.来源单元,原文:r.原文,结果基线:r.结果基线}))};
 const matrix={schemaVersion:'1.0',规则处理:atoms.证据原子.map(a=>{
  const disposition=report.逐项.find(r=>r.来源标识===a.来源单元);
  const complete=disposition.状态==='已覆盖';
  return{原子标识:a.原子标识,去向:complete?'正式用例':disposition.状态==='待确认'?'需求待确认':'未覆盖',规则标识:complete?(byUnit.get(a.来源单元)||[]).map(r=>r.稳定规则标识):[],依据:`${formalPath}的${a.原子标识}；逐结果状态以本任务全文覆盖清单为准。`,说明:disposition.说明,...(disposition.状态==='待确认'?{问题编号:disposition.问题编号}:{})};
 })};
 const dedup={schemaVersion:'1.0',候选SHA256:fingerprint(JSON.stringify(candidate,null,2)+'\n'),待人工复核:[],复核结果:rs.map(r=>({稳定规则标识:r.稳定规则标识,归一化业务键:JSON.stringify(ruleBusinessKey(r)),状态关系:`${r.来源状态} -> ${r.目标状态或可观察结果}`,关键操作:r.用例设计.步骤.map(s=>s.操作).join('；'),可观察结果:r.目标状态或可观察结果,基础条件:r.必要条件,附加条件:[],判定:'保留',保留或合并目标:caseByRule.get(r.稳定规则标识).用例编号,判定理由:`已按角色、业务状态、输入边界、操作和结果复核：${bindings.get(r.稳定规则标识).独立差异}；权限泛化重复项与新增配置矩阵已合并，不能仅按相同结果文本合并不同拒绝条件。`,证据:r.证据引用,候选用例追溯:[caseByRule.get(r.稳定规则标识).用例编号]}))};
 const scan={...scanBase,项目指纹:projectHash,用例阶段输入说明:'业务内容仅两份MainBasis；上游扫描记录用于审计，不回流定义用例。',缓存清理:{状态:'成功',清理后残留失效文件:[],依据:scanBase.失效层清理},项目接入基线:{状态:'已确认',项目目录:'liveshow-proto',依据:'用户明确替换同一项目后要求全新生成'},规则基线:[{路径:'AGENTS.md','SHA-256':await sha('AGENTS.md')}],语义读取记录:[{路径:formalPath,SHA256:formalHash,结论:'全文已读取并独立建立条款基线；已设计分支与未核销分支分别记录。',关联规则:rs.map(r=>r.稳定规则标识)}]};
 const start=await read(`${task}/basis/mainbasis-start.json`);
 const sync={...syncBase,需求清单有修改:syncBase.文件核对.some(r=>r.修改前SHA256!==r.修改后SHA256),文件核对:syncBase.文件核对.map(r=>({...r,...(r.修改前SHA256===null&&r.路径.startsWith('liveshow-proto/MainBasis/')&&!start.文档.some(d=>d.路径===r.路径)?{文件原先不存在:true}:{})}))};
 const files={'business-rule-catalog.json':catalog,'independent-scenario-library.json':scenes,'state-transition-baseline.json':states,'requirement-coverage.json':report,'evidence-atom-index.json':atoms,'coverage-matrix.json':matrix,'semantic-dedup-review.json':dedup,'global-evidence-scan-result.json':scan,'prototype-context-sync-result.json':sync,'candidate.json':candidate,'final.json':candidate};
 for(const [name,data]of Object.entries(files))await write(`${dir}/${name}`,data);
 const manifest={schemaVersion:'1.0',项目名称:'Luma Live',项目目录:'liveshow-proto',任务标识:`liveshow-full-260916-001-${key}`,任务工作目录:dir,目标范围:scope,生成策略:'current-evidence-only',历史策略:'不读取不比较',MainBasis基线:{路径:'work/liveshow-proto-mainbasis/latest.json','SHA-256':await sha('work/liveshow-proto-mainbasis/latest.json')},当前业务规则清单:`${dir}/business-rule-catalog.json`,独立场景库:`${dir}/independent-scenario-library.json`,状态转换基线:`${dir}/state-transition-baseline.json`,需求覆盖清单:`${dir}/requirement-coverage.json`,生成脚本:`${task}/assemble.mjs`,当前候选用例:`${dir}/candidate.json`,最终用例JSON:`${dir}/final.json`,输入文件:[]};
 for(const [p,role,type,may]of [[formalPath,'当前业务证据','正式需求',true],[riskPath,'风险与缺口','需求待确认',false],...Object.keys(files).map(n=>[`${dir}/${n}`,'本次派生产物',n==='business-rule-catalog.json'?'业务规则清单':n==='candidate.json'?'当前候选用例':n==='final.json'?'最终用例JSON':n,n==='business-rule-catalog.json']),...tools.map(p=>[p,'执行工具','执行工具',false])])manifest.输入文件.push({路径:p,'SHA-256':await sha(p),角色:role,内容类型:type,允许定义业务规则:may});
 await write(`${dir}/generation-input-manifest.json`,manifest);
 console.log(JSON.stringify({端:end,用例:cases.length,问题:questions.length,状态:'阶段性；继续补充全文覆盖核销'}));
}
