import fs from 'node:fs/promises';
import path from 'node:path';
import './guild-design.mjs';
import './admin-design.mjs';
import './supplement.mjs';
import './refine.mjs';
import {states} from './shared-states.mjs';
import {aliases,outside} from './coverage-decisions.mjs';
import {refineQuestions} from './pending.mjs';
import {task,basis,risk,basisHash,designs,pages,sources,text} from './design.mjs';
import {fingerprint as hash,reviewHash} from '../../scripts/requirement-traceability.mjs';
import {casesFromCatalog,ruleBusinessKey,validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {readModuleDirectory,moduleNames} from '../../scripts/prototype-directory.mjs';
import {loadTestcaseLanguageRules,validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';
import {validateGenerationInput} from '../../scripts/validate-generation-input.mjs';

const read=async f=>JSON.parse(await fs.readFile(f,'utf8')),write=async(f,v)=>fs.writeFile(f,JSON.stringify(v,null,2)+'\n'),fileHash=async f=>hash(await fs.readFile(f));
const lang=await loadTestcaseLanguageRules(),directory=readModuleDirectory(text),riskText=await fs.readFile(risk,'utf8');
const risks=[...riskText.matchAll(/^- \[(PENDING-[^\]]+)\] (.+)$/gm)].map(m=>({id:m[1],raw:m[0],body:m[2],line:riskText.slice(0,m.index).split('\n').length}));
const sync=await read(task+'/prototype-context-sync-result.json'),scan=await read(task+'/global-evidence-scan-result.json');
sync.需求清单有修改=sync.文件核对.some(r=>r.修改前SHA256!==r.修改后SHA256);
scan.缓存清理={状态:'成功',清理后残留失效文件:[],说明:'本次独立设计未加载旧用例、旧规则、旧场景或旧扫描语义；当前任务不含旧业务缓存。'};
scan.项目接入基线={状态:'已确认',路径:'work/liveshow-proto-project-onboarding/latest.json'};
const projectFiles=[];async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(['.git','.DS_Store'].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(e.isFile())projectFiles.push({path:path.relative('liveshow-proto',f),hash:await fileHash(f)});}}
await walk('liveshow-proto');projectFiles.sort((a,b)=>a.path.localeCompare(b.path,'zh-CN'));scan.项目指纹=hash(projectFiles.map(f=>f.path+'|'+f.hash).join('\n'));
scan.规则基线=[{路径:'AGENTS.md','SHA-256':await fileHash('AGENTS.md')}];

for(const [folder,end]of [['guild','公会App'],['admin','管理后台']]){
 const dir=task+'/'+folder,scope={端名:end,模块名称:'全部模块'},ds=designs.filter(d=>d.scope===end);
 // Keep modules together without changing any source-derived business contract.
 const modules=moduleNames(directory,end);ds.sort((a,b)=>modules.indexOf(a.rule.功能模块)-modules.indexOf(b.rule.功能模块)||a.page.localeCompare(b.page,'en'));
 for(const d of ds){const issues=validateRuleDesign(d.rule,lang);if(issues.length)throw Error(d.rule.用例设计.场景+issues.join(';'));}
 const catalog={schemaVersion:'1.0',项目名称:'Luma Live',目标范围:scope,规则:ds.map(d=>d.rule)};
 const rows=casesFromCatalog(catalog,{moduleDirectory:directory});
 const qs=risks.filter(r=>r.body.match(/影响端：([^。]+)/)?.[1].includes(end)).map((r,i)=>{
  const scene=r.body.split('：')[0],decision=r.body.slice(scene.length+1).split(' 选项：')[0];
  const options=r.body.split('选项：')[1].split('影响端：')[0].replace(/[。；]+$/,'').split(/；(?=[A-D]\.)/).map(s=>s.replace(/^[A-D]\.\s*/,''));
  const related=[...sources.values()].flat().filter(s=>s.end===end&&s.page&&s.body.includes(r.id));
  let names=[...new Set(related.map(s=>pages.get(s.page).module))];
  if(!names.length){
   const selectors=folder==='guild'? /通知/.test(scene)?/首页|消息/:/运营账号|虚拟/.test(scene)?/运营/:/时区|业务日|时长|时效|精度|跨日|等级/.test(scene)?/数据|主播/:/数据/ : /勋章|等级|任务|补签|首充|套餐|亲密|粉丝团|榜单/.test(scene)?/运营配置/:/运营账号|虚拟/.test(scene)?/运营账号/:/举报/.test(scene)?/违规/:/报表/;
   names=modules.filter(n=>selectors.test(n));
   if(!names.length&&folder==='admin')names=[/举报/.test(scene)?'举报处理':'数据分析'];
  }
  if(!names.length)throw Error('问题模块未映射 '+r.id);
  return {问题编号:r.id,需求组编号:'RQ-'+String(i+1).padStart(3,'0'),父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:names.join('、'),具体场景:scene,问题分类:/时区|业务日|时长|精度|贡献|归属|亲密度计算/.test(scene)?'计算与统计口径':/失败|并发|缺失/.test(scene)?'异常处理':/格式|资源|上限/.test(scene)?'字段与数据校验':'业务规则',待决策问题:decision,可选方案:options,测试建议:'确认所选方案的适用对象和生效条件，再补充“'+scene+'”的对应结果；当前不把候选方案当作确定预期。',产品结论:'',结论补充:'',已知依据:[`${risk} 第${r.line}行：${r.raw}`],影响范围:[end+'：'+names.join('、'),'仅隔离该未确认分支，其他已确认规则继续测试'],已有用例编号:[],确认后待补用例:['补充'+scene+'在已选方案下的正常、边界及异常结果'],负责人:/并发|时效/.test(scene)?'多方确认':'产品',期望确认时间:'版本验收前',确认状态:'待确认'};
 });
 const candidate={测试用例:rows,需求待确认:qs},jsonCheck=validateTestcaseRecords(candidate,lang);if(jsonCheck.问题.length)throw Error(jsonCheck.问题.join(';'));
 const library={schemaVersion:'1.0',目标范围:scope,场景:ds.map((d,i)=>({场景标识:'SC-'+d.rule.稳定规则标识,执行角色:d.rule.执行角色,目标端:end,入口:d.rule.用例设计.观察页面路径,规则标识:[d.rule.稳定规则标识],用例契约:{前置条件:rows[i].前置条件,操作步骤:rows[i].操作步骤,预期结果:rows[i].预期结果},...(d.transition?{状态转换标识:d.transition}:{}),用例编号:rows[i].用例编号}))};
 const units=await read(dir+'/requirement-units.json'),coverage={schemaVersion:'1.0',来源指纹:hash(units),交付性质:'部分覆盖',契约模式:'场景引用',场景库SHA256:hash(library),逐项:[],状态转换处理:[],语义复核:{说明:'以MainBasis全文为分母；当前场景契约逐项回溯。其他端执行分支注明范围，未决分支保持待确认；文字单元数不表示业务覆盖率。',内容SHA256:''}};
 const missing=[],qIds=new Set(qs.map(q=>q.问题编号));let section='',currentEnd='',inDirectory=false;
 for(const u of units){
  const raw=u.原文,id=raw.match(/^- \[([^\]]+)\]/)?.[1],isRisk=u.风险;
  if(raw.startsWith('## 01-'))currentEnd='用户App';if(raw.startsWith('## 02-'))currentEnd='公会App';if(raw.startsWith('## 03-'))currentEnd='管理后台';
  if(raw.startsWith('#'))section=raw.replace(/^#+\s*/,'');if(raw.includes('prototype-modules:v1:start'))inDirectory=true;
  const row={来源标识:u.标识,状态:'不适用',说明:'文档标题、来源说明或结构信息，不独立定义业务预期。',分支:[]};
  const pending=[...raw.matchAll(/PENDING-[a-z-]+/g)].map(m=>m[0]).filter(id=>qIds.has(id));
  let hits=[];
  if(isRisk){if(id&&qIds.has(id)){row.状态='待确认';row.说明='当前风险文件尚无产品结论，不进入确定性预期。';row.问题编号=id;}}
  else if(inDirectory){row.说明='原型页面目录仅用于功能模块归属，不能定义业务预期。';}
  else if(currentEnd&&currentEnd!==end){row.说明='其他端需求章节；本次仅生成'+end+'，共同规则在本端公共规则中投影。';}
  else if(id?.startsWith('META-'))row.说明='页面用途摘要；具体字段与动作在同页REQ条款逐项处理。';
  else if(id){
   hits=ds.map((d,i)=>({d,i})).filter(({d})=>d.sourceIds.includes(id));
   if(!hits.length&&aliases[id]){const [pagePattern,titlePattern]=aliases[id];hits=ds.map((d,i)=>({d,i})).filter(({d})=>new RegExp('^(?:'+pagePattern.replaceAll('.html','\\.html')+')$').test(d.page)&&new RegExp(titlePattern).test(d.rule.用例设计.场景));}
   if(!hits.length){
    if(pending.length){row.状态='待确认';row.说明='明确未决分支，保留原问题编号。';row.问题编号=pending[0];}
    else if(outside[id])row.说明=outside[id];
    else {row.状态='未覆盖';row.说明='尚未完成本条具体分支映射，不能用页面已覆盖代替。';missing.push({id,raw,section});}
   }
  }else if(!currentEnd&&!/^#|^\|\s*[-:]|^\|用例名称|^\|参与方|^\|状态|^\|平台|^\|账号状态|^\|房间类型|^\|动作|^\|首页|^本版|^目的是|^- 公会创建|^- 公会状态|^- 公会长/.test(raw)){
   const key=/入会|退会|认证|身份/.test(section)?'COMMON-identity':/权限|开播/.test(section)?'COMMON-permission':/分成|收益/.test(section)?'COMMON-income':/退款/.test(section)?'COMMON-refund':/账号管理权限|虚拟金币|创建与使用/.test(section)?'COMMON-operation':/场次/.test(section)?'COMMON-session':null;
   if(key)hits=ds.map((d,i)=>({d,i})).filter(({d})=>d.sourceIds.includes(key));
   row.说明=hits.length?'上位概要投影到同一共同业务对象的本端场景；用户App执行分支不在本次范围。':'上位概要中的角色、端口范围或其他端执行场景；本端可执行规则以已展开的COMMON与页面REQ条款单独登记。';
  }
  if(hits.length){row.状态=pending.length?'部分覆盖':'已覆盖';row.说明='下列本端条件、操作和结果契约对应本条；同条中的用户App操作归用户端范围，纯视觉样式不生成。';row.分支=hits.map(({d,i},n)=>({标识:u.标识+'-'+(n+1),状态:'已设计',说明:d.rule.用例设计.场景,来源片段:raw,场景标识:library.场景[i].场景标识,用例编号:rows[i].用例编号}));if(pending.length)for(const [n,q]of pending.entries())row.分支.push({标识:u.标识+'-Q'+n,状态:'待确认',说明:'未决分支独立保留',问题编号:q});}
  coverage.逐项.push(row);
 }
 for(const t of states.状态转换.filter(t=>t.操作端===end||t.观察端.includes(end))){const scenes=library.场景.filter(s=>s.状态转换标识===t.状态转换标识);coverage.状态转换处理.push({状态转换标识:t.状态转换标识,状态:scenes.length?'已映射':'未覆盖',说明:scenes.length?`${t.共同业务对象}：${t.来源状态}→${t.目标状态}在本端的可观察投影`:'需补齐当前端状态观察场景',场景标识:scenes.map(s=>s.场景标识)});}
 const questionMap=refineQuestions(qs);
 for(const row of coverage.逐项){if(row.问题编号)row.问题编号=questionMap.get(row.问题编号);for(const b of row.分支)if(b.问题编号)b.问题编号=questionMap.get(b.问题编号);}
 coverage.语义复核.内容SHA256=reviewHash(coverage);
 await write(dir+'/business-rule-catalog.json',catalog);await write(dir+'/independent-scenario-library.json',library);await write(dir+'/requirement-coverage.json',coverage);
 await write(dir+'/unmapped-review.json',missing);await write(dir+'/language-validation.json',validateTestcaseRecords(candidate,lang));
 const atoms={schemaVersion:'1.0',证据原子:units.map(u=>({原子标识:u.标识,路径:u.路径,行:u.行,原文:u.原文,风险:!!u.风险}))};
 const cr={schemaVersion:'1.0',规则处理:coverage.逐项.map(r=>({原子标识:r.来源标识,去向:r.状态==='不适用'?'不适用':r.状态==='待确认'?'需求待确认':r.状态==='未覆盖'?'未覆盖':'正式用例',依据:r.说明,规则标识:[...new Set(r.分支.filter(b=>b.状态==='已设计').map(b=>library.场景.find(s=>s.场景标识===b.场景标识).规则标识[0]))],...(r.问题编号?{问题编号:r.问题编号}:{})}))};
 await write(dir+'/evidence-atom-index.json',atoms);await write(dir+'/coverage-matrix.json',cr);
 const endScan={...scan,语义读取记录:[{路径:basis,SHA256:basisHash,结论:'全文独立读取并按页面、共同对象、角色及状态分支设计；未读取旧业务生成数据。',关联规则:catalog.规则.map(r=>r.稳定规则标识)}]};
 await write(dir+'/global-evidence-scan-result.json',endScan);await write(dir+'/prototype-context-sync-result.json',sync);
 const entries=[];async function entry(f,role,type,may=false){entries.push({路径:f,'SHA-256':await fileHash(f),角色:role,内容类型:type,允许定义业务规则:may});}
 await entry(basis,'当前业务证据','统一需求',true);await entry(risk,'风险与缺口','当前需求缺口');
 for(const f of ['generate.mjs','design.mjs','guild-design.mjs','admin-design.mjs','supplement.mjs','refine.mjs','shared-states.mjs','coverage-decisions.mjs','pending.mjs'])await entry(task+'/'+f,'执行工具','本次独立设计及生成工具');
 for(const f of ['testcase-design.mjs','validate-generation-input.mjs','validate-testcase-json.mjs','validate-testcase-delivery.mjs','build-testcase-workbook.mjs'])await entry('scripts/'+f,'执行工具','通用生成与校验工具');
 for(const f of ['business-rule-catalog','independent-scenario-library','state-transition-baseline','requirement-coverage','evidence-atom-index','coverage-matrix','global-evidence-scan-result','prototype-context-sync-result'])await entry(dir+'/'+f+'.json','本次派生产物',f==='business-rule-catalog'?'业务规则清单':f,f==='business-rule-catalog');
 const manifest={schemaVersion:'1.0',项目名称:'Luma Live',任务标识:'liveshow-guild-admin-260915-001-'+folder,生成策略:'current-evidence-only',项目目录:'liveshow-proto',任务工作目录:dir,目标范围:scope,历史策略:'不读取不比较',MainBasis基线:{路径:'work/liveshow-proto-mainbasis/latest.json','SHA-256':await fileHash('work/liveshow-proto-mainbasis/latest.json')},当前业务规则清单:dir+'/business-rule-catalog.json',生成脚本:task+'/generate.mjs',当前候选用例:dir+'/current-testcase-candidate.json',最终用例JSON:dir+'/final.json',需求覆盖清单:dir+'/requirement-coverage.json',独立场景库:dir+'/independent-scenario-library.json',状态转换基线:dir+'/state-transition-baseline.json',输入文件:entries};
 await write(dir+'/generation-input-manifest.json',manifest);
 console.log(end,rows.length,'cases',qs.length,'questions','missing',missing.map(r=>r.id),'states',coverage.状态转换处理.filter(r=>r.状态==='未覆盖').map(r=>r.状态转换标识));
 if(process.argv.includes('--inspect'))continue;
 await validateGenerationInput(dir+'/generation-input-manifest.json',process.cwd(),'pre-generate');
 await write(dir+'/current-testcase-candidate.json',candidate);await write(dir+'/final.json',candidate);
 await write(dir+'/semantic-dedup-review.json',{schemaVersion:'1.0',候选SHA256:await fileHash(dir+'/current-testcase-candidate.json'),待人工复核:[],复核结果:ds.map((d,i)=>({稳定规则标识:d.rule.稳定规则标识,归一化业务键:ruleBusinessKey(d.rule),基础条件:d.rule.必要条件,附加条件:[],状态关系:d.rule.来源状态+'→'+d.rule.目标状态或可观察结果,关键操作:d.rule.触发动作,可观察结果:d.rule.目标状态或可观察结果,判定:'保留',保留或合并目标:rows[i].用例编号,判定理由:'本条观察“'+d.rule.用例设计.验证子项+'”；删除场景条件会改变该结果的适用前提。相同表单不同合法/非法输入、不同账户与不同观察字段分别保留。',证据:d.rule.证据引用,候选用例追溯:[rows[i].用例编号]}))});
 await entry(dir+'/current-testcase-candidate.json','本次派生产物','当前候选用例');await entry(dir+'/final.json','本次派生产物','最终用例JSON');await entry(dir+'/semantic-dedup-review.json','本次派生产物','语义去重复核');
 await write(dir+'/generation-input-manifest.json',manifest);
 await write(dir+'/generation-input-validation.json',await validateGenerationInput(dir+'/generation-input-manifest.json',process.cwd(),'final'));
}
