import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {caseFromRule,ruleBusinessKey} from '../../scripts/testcase-design.mjs';
import {readUnits,fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
import {validateTestcaseRecords,loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';
const root=process.cwd(),task='work/liveshow-full-20260914-190307',revision=task+'/basis-revision-2';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const write=async(file,data)=>fs.writeFile(file,JSON.stringify(data,null,2)+'\n');
const sha=async file=>fingerprint(await fs.readFile(file));
const review=await read(task+'/reviewed-design.json'),model=await read(task+'/mainbasis-model.json'),draft=await read(task+'/scenario-design-draft.json');
const basisPath='work/liveshow-proto-mainbasis/latest.json',basis=await read(basisPath),language=await loadTestcaseLanguageRules();
assert.equal(review.业务输入.SHA256,await sha(review.业务输入.路径));
const [formal,risk]=basis.文档;
const units=await readUnits(root,basis.文档);for(const u of units)if(u.路径===risk.路径)u.风险=true;
const questions=units.filter(u=>u.风险&&/^- \[PENDING-/.test(u.原文)).map(u=>{
 const match=u.原文.match(/^- \[([^\]]+)\] ([^：]+)：(.+?) 选项：(.+?)。影响端：(.+?)。依据：(.+)。$/);
 assert(match,`未解析问题 ${u.行}`);
 const [,id,title,question,options,ends,evidence]=match;
 return {id,title,question,options:options.split(/；[A-D]\. /).map(s=>s.replace(/^[A-D]\. /,'')),ends:ends.split('、'),evidence,line:u.行,unit:u.标识};
});assert.equal(questions.length,43);
const reqs=new Map(model.requirements.map(r=>[r.id,r]));
const planById=new Map(draft.场景.map(p=>[p.id,p]));
const states={schemaVersion:'1.0',说明:'以本轮当前需求设计的38项跨端与主要状态转换；未完成的其他条款和分支保留在全文覆盖清单，不据此声称全生命周期完整覆盖。',来源文档:formal,状态转换:draft.状态转换.map(t=>({...t,证据:[...new Set(draft.场景.filter(p=>p.transition===t.状态转换标识).flatMap(p=>p.sources))].map(id=>({需求编号:id,路径:formal.路径,行:reqs.get(id).line}))}))};
async function projectFingerprint(){const files=[];async function visit(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())await visit(f);else if(e.isFile())files.push({path:path.relative('liveshow-proto',f).split(path.sep).join('/'),hash:await sha(f)});}}await visit('liveshow-proto');files.sort((a,b)=>a.path.localeCompare(b.path,'zh-CN'));return fingerprint(files.map(f=>`${f.path}|${f.hash}`).join('\n'));}
const projectHash=await projectFingerprint();
const scanTemplate=await read(revision+'/global-evidence-scan-result.json'),sync=await read(revision+'/prototype-context-sync-result.json');
const results=[];
for(const [end,slug,prefix] of [['用户App','user','USER'],['公会App','guild','GUILD'],['管理后台','admin','ADMIN']]){
 const dir=task+'/'+slug,selected=review.规则.filter(x=>x.规则.用例设计.观察端===end),rules=selected.map(x=>x.规则);
 const scope={端名:end,模块名称:[...new Set(Object.values(model.pages).filter(p=>p.endName===end).map(p=>p.module))].join('、')};
 const cases=rules.map((r,i)=>caseFromRule(r,i+1,prefix));
 const qlist=questions.filter(q=>q.ends.includes(end));
 const pending=qlist.map(q=>({问题编号:q.id,需求组编号:'GROUP-'+q.id.slice(8),父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:/等级|勋章/.test(q.title)?'等级与身份':/时区|时长|直播/.test(q.title)?'跨端统计':/任务|签到|奖励/.test(q.title)?'任务与福利':/分成|充值|金币/.test(q.title)?'资产与结算':'相关业务模块',具体场景:q.title,问题分类:/计算|精度|时区|排序|顺序|统计|阈值|归属/.test(q.title)?'计算与统计口径':/权限|入口|登录|位置/.test(q.title)?'角色与权限':'业务规则',待决策问题:q.question,可选方案:q.options,测试建议:q.id==='PENDING-reward-prop-conflict'?'本期按统一需求的金币奖励执行；道具奖励属于后续范围变更，不阻塞当前金币奖励用例。':'先确认此决定及适用范围，再按选定方案补齐相应正向、边界和失败分支；现有可执行分支继续测试。',产品结论:'',结论补充:'',已知依据:[`${risk.路径} 第${q.line}行；${q.evidence}`,q.id==='PENDING-reward-prop-conflict'?'统一需求明确本期仅金币奖励；现有差异按正式规则处理。':'候选方案只供决策，不是已确认预期。'],影响范围:q.ends,已有用例编号:[],确认后待补用例:[`${q.title}的确定性预期及对应分支`],负责人:/时效|并发|精度/.test(q.title)?'多方确认':'产品',期望确认时间:'相关功能测试开始前',确认状态:q.id==='PENDING-reward-prop-conflict'?'无需处理':'待确认'}));
 const candidate={测试用例:cases,需求待确认:pending};
 const check=validateTestcaseRecords(candidate,language);assert.equal(check.状态,'通过',check.问题.join('\n'));
 const library={schemaVersion:'1.0',来源:'本次独立场景设计及正式设计局部修正；不读取历史用例',场景:selected.map((x,i)=>({场景标识:x.场景标识,执行角色:x.规则.执行角色,目标端:end,入口:x.规则.用例设计.观察页面,用例契约:{前置条件:cases[i].前置条件,操作步骤:cases[i].操作步骤,预期结果:cases[i].预期结果},...(planById.get(x.场景标识).transition?{状态转换标识:planById.get(x.场景标识).transition}:{}),关联规则:x.规则.独立来源规则}))};
 const associations=new Map();
 selected.forEach((x,i)=>x.规则.独立来源规则.forEach(id=>{if(!associations.has(id))associations.set(id,[]);associations.get(id).push({entry:x,case:cases[i]});}));
 const qset=new Set(qlist.map(q=>q.id));
 let sectionEnd=null;
 const coverage={schemaVersion:'1.0',来源指纹:fingerprint(units),交付性质:'部分覆盖',契约模式:'场景引用',场景库SHA256:fingerprint(library),逐项:[],状态转换处理:[],语义复核:{}};
 const gaps=[];
 for(const u of units){
  const raw=u.原文,id=raw.match(/^- \[(REQ-[^\]]+)\]/)?.[1],qids=[...raw.matchAll(/PENDING-[a-z-]+/g)].map(m=>m[0]).filter(q=>qset.has(q));
  if(raw.startsWith('# 用户App需求'))sectionEnd='用户App';if(raw.startsWith('# 公会App需求'))sectionEnd='公会App';if(raw.startsWith('# 管理后台需求'))sectionEnd='管理后台';
  const row={来源标识:u.标识,状态:'不适用',说明:'标题、来源定位、结构说明或清单组织信息，不独立定义测试行为。',分支:[]};
  if(u.风险){
   const q=questions.find(q=>q.unit===u.标识&&qset.has(q.id));
   if(q&&q.id!=='PENDING-reward-prop-conflict'){row.状态='待确认';row.问题编号=q.id;row.说明='风险清单只承载尚未决定的业务分支，不用作正式用例预期。';}
   else if(q){row.说明='正式需求已明确仅金币奖励；本条保留为未来道具奖励扩展的决策线索，不阻塞本期已确认范围。';}
   else if(/^- \[PENDING-/.test(raw))row.说明='该问题不涉及本端，已保留在对应端需求待确认清单。';
  }else if(id){
   const req=reqs.get(id),linked=associations.get(id)||[];
   if(/原型演示说明|尚未完整实现|原型为.*固定|不纳入/.test(req.body)&&!linked.length){row.说明='此项为原型演示或实现现状说明，不建立正式业务预期；相关业务规则另行核对。';}
   else if(linked.length){
    // Association proves only the linked scenario. Never promote a whole paragraph
    // to complete coverage merely because it appears in an evidence reference.
    row.状态='部分覆盖';row.说明='已列出本条支撑的正式场景；整段独立子句与全部适用分支的覆盖核验尚未闭合，未声明完整覆盖。';
    row.分支=linked.map(({entry,case:c},i)=>({标识:`B-${u.标识.slice(0,12)}-${i+1}`,状态:'已设计',说明:entry.规则.用例设计.场景,来源片段:req.body,场景标识:entry.场景标识,用例编号:c.用例编号}));
    row.分支.push({标识:`G-${u.标识.slice(0,12)}`,状态:qids.length?'待确认':'未覆盖',说明:qids.length?'来源同时包含尚未决定的业务范围，见对应问题。':'本段剩余子句、条件组合及状态后续影响仍需与独立规则逐项闭合；这是生成覆盖缺口，不是产品决策缺失。',...(qids.length?{问题编号:qids[0]}:{})});
   }else if(qids.length){row.状态='待确认';row.问题编号=qids[0];row.说明='该条款明确依赖未决问题，暂不创建确定性预期。';}
   else if(req.end===end){row.状态='未覆盖';row.说明='本轮独立来源库保留该已知条款，但尚未建立可核验的正式场景映射；不是无业务依据，也不转为产品待确认。';}
   else row.说明=`条款归属于${req.end}；本端无对应正式观察分支，原规则保留在三端来源库与所属端清单。`;
  }else if(!/^\s*(?:#|页面：|来源|范围|本文件|业务输入|\|?\s*[-:| ]+$)/.test(raw)&&!raw.includes('[META-')&&(raw.startsWith('|')||raw.includes('[COMMON-]')||/^\d+[.、]|^[-*] /.test(raw))){
   row.状态='未覆盖';row.说明='系统概要或共同业务条款：已保留全文，不用端侧用例数量反推本条完整覆盖；跨段等价映射尚未逐项闭合。';
  }
  coverage.逐项.push(row);
  if(['未覆盖','部分覆盖'].includes(row.状态))gaps.push({来源标识:u.标识,需求编号:id||'',来源文件:u.路径,行:u.行,模块:id?reqs.get(id).module:'系统概要与公共规则',原文:raw,状态:row.状态,说明:row.说明,关联用例:row.分支.filter(b=>b.状态==='已设计').map(b=>b.用例编号),待补:row.分支.filter(b=>b.状态!=='已设计').map(b=>b.说明)});
 }
 coverage.状态转换处理=states.状态转换.filter(t=>t.操作端===end||t.观察端.includes(end)).map(t=>{const ids=library.场景.filter(s=>s.状态转换标识===t.状态转换标识).map(s=>s.场景标识);return {状态转换标识:t.状态转换标识,状态:ids.length?'已映射':'未覆盖',说明:ids.length?'对应本端具体条件、步骤及结果已绑定；不推定未列出的其他影响。':'该状态转换本端尚缺少可交付的操作或观察场景。',场景标识:ids};});
 coverage.语义复核={说明:'逐项保留全部MainBasis非空行；只认证列出的场景关联，未闭合的整段分支和概要映射明确保留为缺口。未把生成缺口伪装为业务未决，也未把条款数当覆盖率。',内容SHA256:reviewHash(coverage)};
 const atomList=model.requirements.map(r=>({原子标识:r.id,端:r.end,模块:r.module,页面:r.page,原文:r.raw,来源行:r.line}));
 const matrix={schemaVersion:'1.0',规则处理:atomList.map(atom=>{const related=associations.get(atom.原子标识)||[],r=reqs.get(atom.原子标识),questionsHere=[...r.body.matchAll(/PENDING-[a-z-]+/g)].map(m=>m[0]).filter(q=>qset.has(q));return {原子标识:atom.原子标识,去向:related.length?'正式用例':questionsHere.length?'需求待确认':r.end===end?'未覆盖':'范围外',依据:related.length?'仅表明本条已有正式场景关联，完整分支状态以需求覆盖清单为准。':questionsHere.length?'确定性预期依赖MainBasis待确认问题。':r.end===end?'尚未完成正式场景映射，保留为生成覆盖缺口。':`属于${r.end}端`,...(related.length?{规则标识:related.map(x=>x.entry.规则.稳定规则标识)}:questionsHere.length?{问题编号:questionsHere[0]}:{})};})};
 const scan=structuredClone(scanTemplate);scan.项目指纹=projectHash;scan.规则基线=basis.上游.filter(x=>['AGENTS.md','Cem Kaner.txt'].includes(x.路径));scan.语义读取记录=[...(scan.语义读取记录||[]).filter(r=>r.路径!==formal.路径),{路径:formal.路径,SHA256:formal['SHA-256'],结论:'全文规则独立提取，已建本轮场景；未闭合分支见覆盖清单，不声称全部规则已覆盖。',关联规则:rules.map(r=>r.稳定规则标识)}];
 const catalog={schemaVersion:'1.0',项目名称:'Luma Live',目标范围:scope,规则:rules};
 await write(dir+'/business-rule-catalog.json',catalog);
 await write(dir+'/independent-source-rules.json',model.parsed);
 await write(dir+'/independent-scenario-library.json',library);
 await write(dir+'/state-transition-baseline.json',states);
 await write(dir+'/requirement-units.json',units);
 await write(dir+'/requirement-coverage.json',coverage);
 await write(dir+'/coverage-gaps.json',gaps);
 await write(dir+'/evidence-atom-index.json',{schemaVersion:'1.0',证据原子:atomList});
 await write(dir+'/coverage-matrix.json',matrix);
 await write(dir+'/global-evidence-scan-result.json',scan);
 await write(dir+'/prototype-context-sync-result.json',sync);
 await write(dir+'/current-testcase-candidate.json',candidate);
 await write(dir+'/final-testcases.json',candidate);
 const candidateHash=await sha(dir+'/current-testcase-candidate.json');
 await write(dir+'/semantic-dedup-review.json',{schemaVersion:'1.0',候选SHA256:candidateHash,待人工复核:[],本次精确合并:draft.去重,复核结果:rules.map((r,i)=>({稳定规则标识:r.稳定规则标识,判定:'保留',归一化业务键:ruleBusinessKey(r),状态关系:r.来源状态,关键操作:r.用例设计.步骤.map(s=>s.操作).join(' → '),可观察结果:r.目标状态或可观察结果,保留或合并目标:cases[i].用例编号,判定理由:'保留本端实际角色、明确数据与独立结果；不能仅因同模块或同字段将不同边界、状态或观察端合并。',基础条件:r.必要条件,附加条件:[],证据:[formal],候选用例追溯:[cases[i].用例编号]}))});
 await write(dir+'/isolated-designs.json',review.隔离.filter(x=>x.规则.用例设计.观察端===end));
 const files=[['business-rule-catalog.json','业务规则清单'],['independent-source-rules.json','独立来源规则库'],['independent-scenario-library.json','独立场景库'],['state-transition-baseline.json','业务状态转换基线'],['requirement-units.json','全文来源单元'],['requirement-coverage.json','逐需求覆盖清单'],['coverage-gaps.json','覆盖缺口'],['evidence-atom-index.json','来源证据索引'],['coverage-matrix.json','逐规则处理去向'],['global-evidence-scan-result.json','本轮全局扫描结果'],['prototype-context-sync-result.json','本轮需求同步结果'],['current-testcase-candidate.json','当前候选用例'],['final-testcases.json','最终用例JSON'],['semantic-dedup-review.json','本次语义去重复核'],['isolated-designs.json','局部隔离设计']];
 const entries=[{...formal,角色:'当前业务证据',内容类型:'正式需求',允许定义业务规则:true},{...risk,角色:'风险与缺口',内容类型:'需求待确认',允许定义业务规则:false}];
 for(const [file,type] of files)entries.push({路径:dir+'/'+file,'SHA-256':await sha(dir+'/'+file),角色:'本次派生产物',内容类型:type,允许定义业务规则:type==='业务规则清单'});
 for(const file of [task+'/assemble-current.mjs',task+'/review-current.mjs','scripts/testcase-design.mjs','scripts/build-testcase-workbook.mjs'])entries.push({路径:file,'SHA-256':await sha(file),角色:'执行工具',内容类型:'当前生成或交付工具',允许定义业务规则:false});
 const manifest={schemaVersion:'1.0',项目名称:'Luma Live',项目目录:'liveshow-proto',任务标识:path.basename(task)+'-'+slug,任务工作目录:dir,生成策略:'current-evidence-only',历史策略:'不读取不比较',目标范围:scope,MainBasis基线:{路径:basisPath,'SHA-256':await sha(basisPath)},输入文件:entries,当前业务规则清单:dir+'/business-rule-catalog.json',生成脚本:task+'/assemble-current.mjs',独立场景库:dir+'/independent-scenario-library.json',状态转换基线:dir+'/state-transition-baseline.json',需求覆盖清单:dir+'/requirement-coverage.json',当前候选用例:dir+'/current-testcase-candidate.json',最终用例JSON:dir+'/final-testcases.json'};
 await write(dir+'/generation-input-manifest.json',manifest);
 results.push({端:end,正式用例:cases.length,模块:[...new Set(cases.map(c=>c.功能模块))],需求问题:pending.length,尚待确认:pending.filter(q=>q.确认状态==='待确认').length,覆盖缺口:gaps.length,状态转换映射:coverage.状态转换处理.reduce((out,t)=>(out[t.状态]=(out[t.状态]||0)+1,out),{})});
}
await write(task+'/assembly-summary.json',{时间:new Date().toISOString(),结果:results,交付性质:'部分覆盖',说明:'全部模块均有正式用例，但整段需求的分支覆盖核验尚未闭合，不能称为完整覆盖交付。'});
console.log(JSON.stringify(results,null,2));
