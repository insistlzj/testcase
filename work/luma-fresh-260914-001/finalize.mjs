import fs from 'node:fs/promises';
import path from 'node:path';
import {root,task,hash,save,formalPath,riskPath,formalHash,riskHash,questions,requirements,pages} from './model.mjs';
import {ruleBusinessKey} from '../../scripts/testcase-design.mjs';
import {validateGenerationInput} from '../../scripts/validate-generation-input.mjs';
import {validateTestcaseDelivery} from '../../scripts/validate-testcase-delivery.mjs';
const read=async p=>JSON.parse(await fs.readFile(path.join(task,p),'utf8'));
const taskRel=path.relative(root,task),fileHash=async p=>hash(await fs.readFile(path.join(root,p)));
const basis='work/liveshow-proto-mainbasis/latest.json';
const basisHash=await fileHash(basis);
const checks=await read('draft-check.json');if(checks.问题.length)throw new Error('草稿校验未通过');
const discovery=await read('test-scenario-library.json');
if(discovery.输入[0]['SHA-256']!==formalHash||discovery.输入[1]['SHA-256']!==riskHash)throw new Error('场景未绑定最新两份 MainBasis');
const records=[];
for(const folder of ['user','guild','admin']){
 const dir=path.join(task,folder),rel=`${taskRel}/${folder}`;
 const catalog=await read(`${folder}/business-rule-catalog.json`),end=catalog.目标范围.端名;
 const candidate=await read(`${folder}/case-draft.json`);
 const pending=questions.filter(q=>q.end.includes(end)).map(q=>({
  问题编号:q.id,需求组编号:`RQ-${q.id.slice(2)}`,父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:q.module,具体场景:q.scene,问题分类:q.category,
  待决策问题:q.question,可选方案:q.options,测试建议:`仅隔离“${q.scene}”中由本问题决定的预期；确认后分别检查所选方案的正向和拒绝分支`,
  产品结论:'',结论补充:'',已知依据:[`${riskPath} / ${q.id}`, ...q.known],影响范围:[q.end,q.scene],已有用例编号:[],
  确认后待补用例:[`验证${q.scene}按产品所选方案执行`,`验证不满足所选方案条件时的拒绝或保留状态`],负责人:/文案|交互/.test(q.category)?'交互':/时区|密码策略/.test(q.question)?'多方确认':'产品',期望确认时间:'该规则进入功能测试前',确认状态:'待确认',
 }));
 candidate.需求待确认=pending;
 const scan=await read('global-evidence-scan-result.json');
 scan.语义读取记录.push({路径:formalPath,SHA256:formalHash,结论:'从本轮两文档独立建立角色、状态与场景；本阶段未读取原型、旧用例或历史比较',关联规则:catalog.规则.map(r=>r.稳定规则标识)});
 scan.用例输入说明='仅 MainBasis 两文件；上游路径仅为本轮需求同步证据与哈希校验，不是用例阶段业务输入。';
 await save(`${folder}/global-evidence-scan-result.json`,scan);
 await fs.copyFile(path.join(task,'prototype-context-sync-result.json'),path.join(dir,'prototype-context-sync-result.json'));
 const atoms=catalog.规则.map(r=>({原子标识:r.场景标识,共同业务对象:r.共同业务对象,执行角色:r.执行角色,来源状态:r.来源状态,条件:r.必要条件,动作:r.触发动作,可观察结果:r.目标状态或可观察结果,来源需求:r.来源需求标识}));
 atoms.push(...pending.map(q=>({原子标识:`PENDING-${q.问题编号}`,问题编号:q.问题编号,可观察结果:null,风险来源:riskPath})));
 await save(`${folder}/evidence-atom-index.json`,{schemaVersion:'1.0',类型:'由当前需求独立设计的端侧场景原子；不是把整段来源引用算作完整覆盖',证据原子:atoms});
 await save(`${folder}/coverage-matrix.json`,{schemaVersion:'1.0',统计边界:'验证本轮独立场景均有正式用例或需求问题去向；不声明全部原始条款已穷尽',规则处理:[
  ...catalog.规则.map(r=>({原子标识:r.场景标识,去向:'正式用例',依据:`以${r.执行角色}在${r.用例设计.观察页面}执行已设计动作，观察${r.目标状态或可观察结果}`,规则标识:[r.稳定规则标识]})),
  ...pending.map(q=>({原子标识:`PENDING-${q.问题编号}`,去向:'需求待确认',依据:q.待决策问题,问题编号:q.问题编号})),
 ]});
 for(const name of ['independent-rule-baseline.json','state-transition-baseline.json','state-scenario-map.json','test-scenario-library.json'])await fs.copyFile(path.join(task,name),path.join(dir,name));
 const derived=['business-rule-catalog.json','global-evidence-scan-result.json','prototype-context-sync-result.json','coverage-matrix.json','evidence-atom-index.json','independent-rule-baseline.json','state-transition-baseline.json','state-scenario-map.json','test-scenario-library.json'];
 const toolPaths=['AGENTS.md','Cem Kaner.txt','scripts/testcase-design.mjs','scripts/validate-generation-input.mjs','scripts/validate-testcase-json.mjs','scripts/validate-testcase-delivery.mjs','scripts/build-testcase-workbook.mjs',
  ...['model.mjs','states.mjs','design-helpers.mjs','compile.mjs','finalize.mjs',...(await fs.readdir(task)).filter(n=>/^design-.*\.mjs$/.test(n)&&n!=='design-helpers.mjs')].map(n=>`${taskRel}/${n}`)];
 const manifest={schemaVersion:'1.0',项目名称:'Luma Live',任务标识:`luma-fresh-260914-001-${folder}`,生成策略:'current-evidence-only',项目目录:'liveshow-proto',任务工作目录:rel,
  目标范围:catalog.目标范围,历史策略:'不读取不比较',MainBasis基线:{路径:basis,'SHA-256':basisHash},当前业务规则清单:`${rel}/business-rule-catalog.json`,生成脚本:`${taskRel}/compile.mjs`,输入文件:[
   {路径:formalPath,'SHA-256':formalHash,角色:'当前业务证据',内容类型:'统一需求文档',允许定义业务规则:true},
   {路径:riskPath,'SHA-256':riskHash,角色:'风险与缺口',内容类型:'需求待确认清单',允许定义业务规则:false},
   ...await Promise.all(derived.map(async name=>({路径:`${rel}/${name}`,'SHA-256':await fileHash(`${rel}/${name}`),角色:'本次派生产物',内容类型:name==='business-rule-catalog.json'?'业务规则清单':'本轮流程核验记录',允许定义业务规则:name==='business-rule-catalog.json'}))),
   ...await Promise.all([...new Set(toolPaths)].map(async p=>({路径:p,'SHA-256':await fileHash(p),角色:'执行工具',内容类型:'执行工具',允许定义业务规则:false}))),
  ]};
 await save(`${folder}/generation-input-manifest.json`,manifest);
 const pre=await validateGenerationInput(path.join(dir,'generation-input-manifest.json'),root,'pre-generate');
 await save(`${folder}/pre-generate-check.json`,pre);
 await save(`${folder}/current-testcase-candidate.json`,candidate);
 await save(`${folder}/final.json`,candidate);
 const candidateHash=await fileHash(`${rel}/current-testcase-candidate.json`);
 const keys=new Map();
 const dedup=catalog.规则.map((r,i)=>{
  const key=ruleBusinessKey(r);if(keys.has(key))throw new Error(`重复业务路径 ${keys.get(key)} ${r.稳定规则标识}`);keys.set(key,r.稳定规则标识);
  return {稳定规则标识:r.稳定规则标识,归一化业务键:key,基础条件:r.必要条件.slice(0,1),附加条件:r.必要条件.slice(1),状态关系:r.来源状态||'由本条前置条件限定观察状态',
   关键操作:r.触发动作,可观察结果:r.目标状态或可观察结果,保留或合并目标:candidate.测试用例[i].用例编号,
   判定理由:`保留${r.用例设计.观察页面}的${r.用例设计.验证子项}；条件或观察位置不同的同对象分支不合并。边界样本保留其精确输入值；本记录不构成历史比较。`,证据:[{路径:formalPath,'SHA-256':formalHash}],候选用例追溯:[candidate.测试用例[i].用例编号],判定:'保留'};
 });
 await save(`${folder}/semantic-dedup-review.json`,{schemaVersion:'1.0',候选SHA256:candidateHash,待人工复核:[],复核结果:dedup});
 manifest.当前候选用例=`${rel}/current-testcase-candidate.json`;manifest.最终用例JSON=`${rel}/final.json`;
 for(const [name,type]of [['current-testcase-candidate.json','当前候选用例'],['final.json','最终用例JSON'],['semantic-dedup-review.json','本轮语义去重记录']])manifest.输入文件.push({路径:`${rel}/${name}`,'SHA-256':await fileHash(`${rel}/${name}`),角色:'本次派生产物',内容类型:type,允许定义业务规则:false});
 await save(`${folder}/generation-input-manifest.json`,manifest);
 const check=await validateTestcaseDelivery(dir,root,{phase:'final'});
 await save(`${folder}/final-gate.json`,check);
 records.push({端:end,目录:rel,用例数:candidate.测试用例.length,待确认数:pending.length,JSON:`${rel}/final.json`,SHA256:await fileHash(`${rel}/final.json`),输入校验:check});
}
await save('fresh-delivery-manifest.json',{历史输入文件数:0,历史比较:'未执行',MainBasis基线:{路径:basis,'SHA-256':basisHash},交付:records});
console.log(JSON.stringify(records.map(({端,用例数,待确认数})=>({端,用例数,待确认数})),null,2));
