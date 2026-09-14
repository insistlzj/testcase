import fs from 'node:fs/promises';
import path from 'node:path';
import {root,task,formal,hashes} from './read-basis.mjs';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
import {caseFromRule,ruleDesignHash} from '../../scripts/testcase-design.mjs';
import {validateGenerationInput} from '../../scripts/validate-generation-input.mjs';
import {validateTestcaseDelivery} from '../../scripts/validate-testcase-delivery.mjs';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8')),save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n'),relative=p=>path.relative(root,p).split(path.sep).join('/');
const endDir=process.argv[2];if(!['user','guild','admin'].includes(endDir))throw Error('Specify user, guild or admin');
const base=path.join(task,endDir),manifestPath=path.join(base,'generation-input-manifest.json'),manifest=await read(manifestPath);
const catalog=await read(path.join(base,'business-rule-catalog.json')),coverage=await read(path.join(base,'requirement-coverage.json'));
// A materializer, not a reviewer. It cannot create approval records or re-approve altered designs.
for(const r of catalog.规则)if(r.可生成正式用例&&(r.设计复核?.状态!=='通过'||r.设计复核.设计SHA256!==ruleDesignHash(r)))throw Error('Unreviewed design: '+r.稳定规则标识);
if(!coverage.语义复核?.说明||coverage.语义复核.内容SHA256!==reviewHash(coverage))throw Error('Source coverage has not been semantically reviewed');
const prefix={user:'USER',guild:'GUILD',admin:'ADMIN'}[endDir];
const records=catalog.规则.filter(r=>r.可生成正式用例).map((r,i)=>caseFromRule(r,i+1,prefix)),questions=await read(path.join(base,'pending-requirements.json'));
const ids=new Map(records.map(c=>[c.备注.find(n=>n.startsWith('规则：')).slice(3),c.用例编号]));
for(const row of coverage.逐项)for(const b of row.分支)if(b.状态==='已设计'){
 const caseId=ids.get('BR-'+b.场景标识.slice(3));if(!caseId)throw Error('Unbound scenario '+b.场景标识);b.用例编号=caseId;
}
coverage.语义复核.内容SHA256=reviewHash(coverage);await save(path.join(base,'requirement-coverage.json'),coverage);
const library=await read(path.join(base,'independent-scenario-library.json'));
const candidate={测试用例:records,需求待确认:questions};
const scan=await read(path.join(task,'global-evidence-scan-result.json')),sync=await read(path.join(task,'prototype-context-sync-result.json'));
const currentFormalRecord={路径:formal,SHA256:hashes[formal],结论:'按本次封存MainBasis提取规则并完成所交付用例的语义设计；未覆盖项如实保留在全文覆盖清单。',关联规则:catalog.规则.map(r=>r.稳定规则标识)};
scan.语义读取记录=(scan.语义读取记录||[]).filter(r=>r.路径!==formal);scan.语义读取记录.push(currentFormalRecord);
const atoms={来源:hashes,范围:'本次已完成设计的业务观察原子；全文需求覆盖分母另见requirement-coverage.json，不以此表计覆盖率',证据原子:catalog.规则.map(r=>({原子标识:r.稳定规则标识,业务对象:r.业务对象,来源:r.证据引用,结果:r.目标状态或可观察结果}))};
const matrix={说明:atoms.范围,规则处理:catalog.规则.map(r=>({原子标识:r.稳定规则标识,去向:'正式用例',依据:r.设计复核.说明,规则标识:[r.稳定规则标识]}))};
await save(path.join(base,'global-evidence-scan-result.json'),scan);await save(path.join(base,'prototype-context-sync-result.json'),sync);
await save(path.join(base,'evidence-atom-index.json'),atoms);await save(path.join(base,'coverage-matrix.json'),matrix);
const toolNames=(await fs.readdir(task)).filter(n=>n.endsWith('.mjs')&&/^(manual-|read-basis|design-cases|current-design|field-design|navigation-design|design-corrections|state-basis|transition-projections|check-design|assemble|release-reviewed|review-|merge-decisions|prepare-current-review|prepare-review|bind-review|finish-coverage)/u.test(n));
const artifactNames=['business-rule-catalog.json','requirement-coverage.json','independent-scenario-library.json','state-transition-baseline.json','pending-requirements.json','evidence-atom-index.json','coverage-matrix.json','global-evidence-scan-result.json','prototype-context-sync-result.json'];
async function register(file,role,type){const entry={路径:relative(file),'SHA-256':fingerprint(await fs.readFile(file)),角色:role,内容类型:type,允许定义业务规则:type==='业务规则清单'};manifest.输入文件=manifest.输入文件.filter(e=>e.路径!==entry.路径);manifest.输入文件.push(entry);}
// Keep the two sealed sources, refresh only current task products and execution tools.
manifest.输入文件=manifest.输入文件.filter(e=>['当前业务证据','风险与缺口'].includes(e.角色));
for(const name of toolNames)await register(path.join(task,name),'执行工具','本次需求设计工具');
for(const name of artifactNames)await register(path.join(base,name),'本次派生产物',name==='business-rule-catalog.json'?'业务规则清单':name);
manifest.生成脚本=relative(import.meta.filename);await save(manifestPath,manifest);
await validateGenerationInput(manifestPath,root,'pre-generate');
await save(path.join(base,'current-testcase-candidate.json'),candidate);await save(path.join(base,'final-testcases.json'),candidate);
const candidateHash=fingerprint(await fs.readFile(path.join(base,'current-testcase-candidate.json')));
const dedup={候选SHA256:candidateHash,待人工复核:[],复核结果:catalog.规则.map(r=>{
 if(!r.去重复核)throw Error('Missing explicit semantic duplicate decision: '+r.稳定规则标识);
 return {稳定规则标识:r.稳定规则标识,候选用例追溯:[ids.get(r.稳定规则标识)],归一化业务键:[r.执行角色,r.功能结构,r.用例设计.验证子项].join('|'),基础条件:r.必要条件,附加条件:[],状态关系:r.来源状态,关键操作:r.触发动作,可观察结果:r.目标状态或可观察结果,判定:r.去重复核.判定,保留或合并目标:ids.get(r.稳定规则标识),判定理由:r.去重复核.说明,证据:r.证据引用};
 })};
await save(path.join(base,'semantic-dedup-review.json'),dedup);
for(const [name,type]of [['current-testcase-candidate.json','当前候选用例'],['final-testcases.json','最终用例JSON'],['semantic-dedup-review.json','语义去重复核']])await register(path.join(base,name),'本次派生产物',type);
manifest.当前候选用例=relative(path.join(base,'current-testcase-candidate.json'));manifest.最终用例JSON=relative(path.join(base,'final-testcases.json'));await save(manifestPath,manifest);
const result=await validateTestcaseDelivery(base,root,{phase:'final'});await save(path.join(base,'release-validation.json'),result);
console.log(JSON.stringify({end:manifest.目标范围.端名,cases:records.length,questions:questions.length,validation:result.状态}));
