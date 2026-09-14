import fs from 'node:fs/promises';
import {task,units,rules,pages,hashes,formal} from './read-basis.mjs';
import {designs} from './current-design.mjs';
import {analyzed} from './check-design.mjs';
import {reviewHash,fingerprint} from '../../scripts/requirement-traceability.mjs';
const save=(file,x)=>fs.writeFile(task+'/'+file,JSON.stringify(x,null,2)+'\n');
const byId=new Map(units.map(u=>[u.标识,u]));
const isolatedNames=['账号封禁原因留痕','账号解封原因留痕','任务停用不增长进度','任务尚未生效不增长进度','任务已过有效期不增长进度','用户有效身份开播入口','恢复发言遇到场次已结束'];
const isolated=isolatedNames.map((name,i)=>{const d=designs.find(d=>d.label===name);if(!d?.excluded)throw Error('Isolation missing '+name);return {id:'OBS-'+String(i+1).padStart(3,'0'),d};});
const qFor=({id,d})=>({问题编号:id,需求组编号:'OBS-GROUP-'+d.page,父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:d.module,具体场景:d.label,问题分类:'角色与权限',待决策问题:d.excluded+'；应通过哪个端、入口或测试接口观察？',可选方案:['提供现有页面或测试接口及具体观察字段','明确三端均无观察入口，登记为接口或数据层验证'],测试建议:'先明确观察路径，再补充该分支可执行用例；其他已有明确结果的分支继续测试。',产品结论:'',结论补充:'',已知依据:d.sourceIds.map(id=>byId.get(id)).filter(Boolean).map(u=>u.原文+'（'+u.路径+'：第'+u.行+'行）'),影响范围:[d.end+'；'+d.label],已有用例编号:[],确认后待补用例:[d.label+'的操作与结果验证'],负责人:'多方确认',期望确认时间:'对应功能测试开始前',确认状态:'待确认'});
const summary=[];
for(const [dir,end]of [['user','用户App'],['guild','公会App'],['admin','管理后台']]){
 const coverage=JSON.parse(await fs.readFile(task+'/'+dir+'/requirement-coverage.json','utf8'));
 const questions=JSON.parse(await fs.readFile(task+'/'+dir+'/pending-requirements.json','utf8')).filter(q=>!q.问题编号.startsWith('OBS-'));
 const local=isolated.filter(x=>x.d.end===end);questions.push(...local.map(qFor));
 for(const row of coverage.逐项){
  row.分支=row.分支.filter(b=>!b.标识.startsWith('OBS-'));
  const u=byId.get(row.来源标识);
  if(row.状态==='未覆盖'&&(/^<!--|^以下保留系统概要全部正文|^\|参与方\|说明\|$|^\|用例名称\|概要说明\|$/u.test(u.原文)))Object.assign(row,{状态:'不适用',说明:'文档来源说明或表头，不定义业务预期'});
  for(const {id,d}of local)if(d.sourceIds.includes(row.来源标识)){
   const branch={标识:'OBS-'+fingerprint([id,row.来源标识]).slice(0,20),状态:'待确认',说明:d.excluded,问题编号:id};
   if(row.分支.some(b=>b.状态==='已设计')){row.状态='部分覆盖';row.分支.push(branch);}else {row.状态='待确认';row.说明=d.excluded;row.问题编号=id;row.分支=[branch];}
  }
 }
 if(end==='用户App'){
  const p=pages.find(p=>p.key==='fan-list.html'),ds=analyzed.filter(d=>d.page===p.key);
  // The nine source paragraphs were read individually: scope, membership, level,
  // appearance, independent relations, range, updates, displayed fields, route.
  const selections=[[0,1,2,3,4,5,6,7,8,9,10,11],[0,1,2,3,4,5],[6],[7,8],[1,2,4,5],[0,1,2,4,5],[1,2,3,11],[6,7,9,10],[11]];
  if(p.rules.length!==9||ds.length!==12)throw Error('Host fans coverage changed; review required');
  for(const [i,r]of p.rules.entries()){
   const row=coverage.逐项.find(x=>x.来源标识===r.标识);
   row.状态='已覆盖';row.说明='主播视角逐项检查：'+r.text;
   row.分支=selections[i].map(j=>{const d=ds[j];return {标识:'B-'+fingerprint([r.标识,d.id]).slice(0,20),状态:'已设计',说明:d.label,来源片段:r.原文,场景标识:d.id,执行角色:d.role,目标端:end,入口:d.entry,用例契约:{前置条件:d.prerequisites,操作步骤:d.steps,预期结果:[d.expected]},用例编号:''};});
  }
 }
 coverage.语义复核={说明:'已逐条审核本批正式用例并保留其直接来源。全文分母来自封存MainBasis。未建立逐条全部分支闭环的条款继续标为未覆盖或部分覆盖，不以关键词命中、页面到达、同义条款或数量代替完整覆盖证明。原风险与7项观察缺口局部隔离；本清单确认的是当前处理状态，不是完整覆盖。',内容SHA256:''};
 coverage.语义复核.内容SHA256=reviewHash(coverage);
 await save(dir+'/requirement-coverage.json',coverage);await save(dir+'/pending-requirements.json',questions);
 const catalog=JSON.parse(await fs.readFile(task+'/'+dir+'/business-rule-catalog.json','utf8'));
 const stats=coverage.逐项.reduce((o,x)=>(o[x.状态]=(o[x.状态]||0)+1,o),{});
 summary.push({端:end,正式用例:catalog.规则.length,需求待确认:questions.length,全文单元处理:stats,状态转换:coverage.状态转换处理,范围:pages.filter(p=>p.end===end).map(p=>({模块:p.module,页面:p.name,规则数:p.rules.length}))});
}
await save('coverage-delivery-summary.json',{来源:hashes,交付性质:'三端用例交付，部分覆盖；未完成全部条款分支闭环',说明:'源文件非空文本单元包含章节、重复规则及跨端说明，不能将单元数量直接作为业务覆盖率。',端:summary,局部隔离:isolated.map(({id,d})=>({id,端:d.end,场景:d.label,原因:d.excluded,来源:d.sourceIds}))});
console.log(summary.map(x=>({端:x.端,用例:x.正式用例,问题:x.需求待确认,处理:x.全文单元处理})));
