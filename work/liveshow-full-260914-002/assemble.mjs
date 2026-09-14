import fs from 'node:fs/promises';
import path from 'node:path';
import {analyzed} from './check-design.mjs';
import {root,task,units,rules,pages,questions,formal,risk,hashes,clauses} from './read-basis.mjs';
import {transitions} from './state-basis.mjs';
import {fingerprint,seedCoverage,reviewHash} from '../../scripts/requirement-traceability.mjs';
const relative=p=>path.relative(root,p).split(path.sep).join('/'),save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
const evidence=u=>({路径:u.路径,'SHA-256':hashes[u.路径],位置:'第'+u.行+'行',原文:u.原文});
const rawMap=new Map(rules.map(r=>[r.标识,r]));
export function pending(q){
 const options=String(q.可选方案||'').split(/\s+\/\s+|[；;]/u).filter(Boolean).map(s=>s.replace(/^[A-D][.、：]\s*/u,''));
 return {问题编号:q.id,需求组编号:'REQ-'+q.id,父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:q.模块||'跨端业务',具体场景:q.场景,问题分类:/排序|金额|收益|时区|RTP/u.test(q.待决策)?'计算与统计口径':/权限|身份|入口/u.test(q.待决策)?'角色与权限':'业务规则',待决策问题:q.待决策,可选方案:options.length>=2&&options.length<=4?options:['明确支持该场景并给出适用条件和结果','明确不支持该场景并给出不可用入口或拒绝结果'],测试建议:'明确“'+q.场景+'”的决定后，补充对应正常、拒绝及恢复分支。',产品结论:'',结论补充:'',已知依据:[q.已知依据,`${q.source.路径}：第${q.source.行}行`],影响范围:[q.端+'；'+q.模块],已有用例编号:[],确认后待补用例:[q.场景+'的可执行结果验证'],负责人:'产品',期望确认时间:'对应功能测试开始前',确认状态:'待确认'};
}
const sourceNormalized=r=>r.text.replace(/（原型交互依据：.*?）/gu,'').replace(/[\s。；]/gu,'');
for(const [end,dir]of [['用户App','user'],['公会App','guild'],['管理后台','admin']]){
 const base=path.join(task,dir),ds=analyzed.filter(d=>d.end===end),allQ=questions.map(pending),coverage=seedCoverage(units);
 const direct=new Map();for(const d of ds)for(const id of new Set(d.sourceIds)){if(!direct.has(id))direct.set(id,[]);direct.get(id).push(d);}
 const library={来源:hashes,目标端:end,状态:'设计中，待完成逐需求复核',场景:[]};
 const cards=new Map();
 for(const [i,d]of ds.entries()){
  const contract={前置条件:d.prerequisites,操作步骤:d.steps,预期结果:[d.expected]};
  const scene={场景标识:d.id,执行角色:d.role,目标端:end,入口:d.entry,用例契约:contract,状态转换标识:d.transition||'',来源标识:d.sourceIds};cards.set(d.id,scene);library.场景.push(scene);
 }
 const gaps=[];
 for(const row of coverage.逐项){
  const u=units.find(x=>x.标识===row.来源标识),r=rawMap.get(u.标识),directDs=direct.get(u.标识)||[];
  if(u.风险){const qid=u.原文.match(/Q-\d{3}/u)?.[0];if(qid&&allQ.some(q=>q.问题编号===qid)){Object.assign(row,{状态:'待确认',说明:'仅作风险与缺口依据，不形成正式预期',问题编号:qid});}else Object.assign(row,{状态:'不适用',说明:'风险清单的说明、标题或问题目录，不单独定义业务预期'});continue;}
  if(directDs.length){
   row.状态='部分覆盖';row.说明='已为下面明确列出的观察分支建立设计；整条其他语义仍待逐项对照，暂不声明全覆盖';
   row.分支=directDs.map(d=>({...cards.get(d.id),标识:'B-'+fingerprint([u.标识,d.id]).slice(0,20),状态:'已设计',说明:d.label,来源片段:u.原文,用例编号:''}));
   row.分支.push({标识:'R-'+u.标识.slice(0,20),状态:'未覆盖',说明:'待核对该完整条款是否还包含其他独立条件、结果或观察端'});
  }else if(r&&r.page.end!==end){row.状态='不适用';row.说明='该条为'+r.page.end+'的页面规则，在对应端清单核对；不伪装为'+end+'步骤';}
  else if(/^#+\s|^原型：|^执行角色：|^本批次：|^> |^---+$|^\|\s*[-: ]+\|/u.test(u.原文)){row.状态='不适用';row.说明='文档结构、版本或角色入口元数据，作为场景定位信息，不单独形成业务用例';}
  else {row.状态='未覆盖';row.说明='当前生成工作尚未完成此条的语义分支映射，属于生成缺口，不转嫁为产品待确认';}
  if(row.状态==='未覆盖'||row.状态==='部分覆盖')gaps.push({id:u.标识,line:u.行,page:r?.page.key||'系统概要',text:u.原文,status:row.状态,cases:directDs.map(d=>({id:d.id,label:d.label,result:d.expected})),exactRelated:r?rules.filter(other=>other.标识!==r.标识&&sourceNormalized(other)===sourceNormalized(r)).map(other=>({id:other.标识,page:other.page.key,cases:(direct.get(other.标识)||[]).map(d=>d.id)})):[]});
 }
 coverage.状态转换处理=transitions.filter(t=>t.操作端===end||t.观察端.includes(end)).map(t=>{const matches=ds.filter(d=>d.transition===t.状态转换标识);return {状态转换标识:t.状态转换标识,状态:matches.length?'已映射':'未覆盖',说明:matches.length?'已将状态转换绑定本端具体条件、步骤和结果；详细分支仍按逐需求清单核对':'已固定业务状态语义，端侧投影尚待逐项匹配',场景标识:matches.map(d=>d.id)};});
 await save(path.join(base,'business-rule-catalog.json'),{schemaVersion:'1.0',项目名称:'Luma Live',目标范围:{端名:end,模块名称:[...new Set(pages.filter(p=>p.end===end).map(p=>p.module))].join('、')},状态:'设计复核中',规则:ds.map(d=>d.rule)});
 await save(path.join(base,'independent-scenario-library.json'),library);
 await save(path.join(base,'state-transition-baseline.json'),{来源:hashes,状态转换:transitions});
 await save(path.join(base,'requirement-coverage.json'),coverage);
 await save(path.join(base,'requirement-review-needed.json'),gaps);
 await save(path.join(base,'pending-requirements.json'),allQ);
 const tools=(await fs.readdir(task)).filter(f=>/^(manual-|read-basis|design-cases|current-design|field-design|navigation-design|design-corrections|state-basis|check-design|assemble)/u.test(f)&&f.endsWith('.mjs')).map(f=>relative(path.join(task,f)));
 const names=['business-rule-catalog.json','independent-scenario-library.json','state-transition-baseline.json','requirement-coverage.json','requirement-review-needed.json','pending-requirements.json'];
 const inputs=[{路径:formal,'SHA-256':hashes[formal],角色:'当前业务证据',内容类型:'统一需求',允许定义业务规则:true},{路径:risk,'SHA-256':hashes[risk],角色:'风险与缺口',内容类型:'需求待确认',允许定义业务规则:false}];
 for(const file of names)inputs.push({路径:relative(path.join(base,file)),'SHA-256':fingerprint(await fs.readFile(path.join(base,file))),角色:'本次派生产物',内容类型:file==='business-rule-catalog.json'?'业务规则清单':file,允许定义业务规则:file==='business-rule-catalog.json'});
 for(const file of tools)inputs.push({路径:file,'SHA-256':fingerprint(await fs.readFile(path.join(root,file))),角色:'执行工具',内容类型:'本次需求设计工具',允许定义业务规则:false});
 await save(path.join(base,'generation-input-manifest.json'),{schemaVersion:'1.0',项目名称:'Luma Live',任务标识:'liveshow-full-260914-002-'+dir,项目目录:'liveshow-proto',任务工作目录:relative(base),生成策略:'current-evidence-only',历史策略:'不读取不比较',目标范围:{端名:end,模块名称:[...new Set(pages.filter(p=>p.end===end).map(p=>p.module))].join('、')},MainBasis基线:{路径:'work/liveshow-proto-mainbasis/latest.json','SHA-256':fingerprint(await fs.readFile(path.join(root,'work/liveshow-proto-mainbasis/latest.json')))},输入文件:inputs,当前业务规则清单:relative(path.join(base,'business-rule-catalog.json')),需求覆盖清单:relative(path.join(base,'requirement-coverage.json')),独立场景库:relative(path.join(base,'independent-scenario-library.json')),状态转换基线:relative(path.join(base,'state-transition-baseline.json')),生成脚本:relative(path.join(task,'assemble.mjs'))});
 console.log(JSON.stringify({end,designs:ds.length,unreviewed:gaps.length,questions:allQ.length}));
}
