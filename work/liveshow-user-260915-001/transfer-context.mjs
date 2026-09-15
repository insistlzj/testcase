import fs from 'node:fs/promises';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
import {readAnnotations} from '../../scripts/evidence-discovery.mjs';
const task='work/liveshow-user-260915-001';
const read=async n=>JSON.parse(await fs.readFile(`${task}/${n}`,'utf8'));
const units=await read('context-units.json'),report=await read('context-transfer.json');
const targets=units.目标, byText=new Map(),byId=new Map(),sourceTargets=new Map();
const sourceById=new Map(units.来源.map(u=>[u.标识,u])),sourcesByFile=new Map();
for(const u of units.来源)(sourcesByFile.get(u.路径)||sourcesByFile.set(u.路径,[]).get(u.路径)).push(u);
for(const t of targets){
 const key=t.路径+'\n'+t.原文;(byText.get(key)||byText.set(key,[]).get(key)).push(t);
 const id=t.原文.match(/\[((?:REQ|META|COMMON|PENDING)-[^\]]+)\]/)?.[1];
 if(id)(byId.get(id)||byId.set(id,[]).get(id)).push(t);
}
const annotationReview=[];
for(const end of ['user','guild','admin']){
 const file=`liveshow-proto/prototype/annotations/${end}.js`;
 const text=await fs.readFile(file,'utf8'),data=readAnnotations(text);
 for(const [page,value] of Object.entries(data))for(const s of value.sections)for(const [i,raw] of s.d.entries()){
  const reference=`${page}/${s.t}/${i+1}`;
  const matches=targets.filter(t=>t.原文.includes(file+'；')&&t.原文.includes(reference)&&new RegExp(reference.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:；|〕)').test(t.原文));
  const pendingByPage={
   'search-results.html':['search-sort'], 'welfare-center.html':['checkin-repair','business-zone','reward-disabled'],
   'my-fan-clubs.html':['intimacy','intimacy-decay','rank-unlisted','rank-missing'],
   'host-center.html':['effective-duration','cross-day-live','metric-latency'],
   'recharge.html':['first-recharge','first-recharge-hide','recharge-expiry','recharge-empty'],
   'auth-country-select.html':['country-sort'], 'guild-operation-account-compose.html':['operation-login-format'],
   'admin-level-config.html':['level-save-atomic','level-concurrency','level-gift-scope','club-level-attribution','coin-precision','level-limit','level-reversal','metric-latency','badge-refresh','level-history','badge-upload','badge-fallback']};
  if(!matches.length&&/待确认|排序：待确认/.test(s.t+' '+raw))for(const id of pendingByPage[page]||[])matches.push(...(byId.get('PENDING-'+id)||[]));
  const positions=(sourcesByFile.get(file)||[]).filter(u=>u.原文.includes(JSON.stringify(raw))||u.原文.includes(raw));
  for(const u of positions){const old=sourceTargets.get(u.标识)||[];sourceTargets.set(u.标识,[...old,...matches]);}
  if(!matches.length&&raw.trim())annotationReview.push({file,page,section:s.t,line:i+1,text:raw});
 }
}
const commonRanges={language:[[19,25]],identity:[[85,140]],'guild-stop':[[142,165]],permission:[[193,211]],session:[[169,177]],cohost:[[214,222],[259,274]],ticket:[[179,191],[239,248],[443,453]],consume:[[308,320]],refund:[[391,401],[407,420]],income:[[407,420]],finance:[[422,439]],operation:[[441,474]],'operation-whitelist':[[476,483]],'report-end':[[276,305]],mute:[[239,257]],'fan-exit':[[250,257]],'virtual-board':[[469,474]]};
for(const [name,ranges] of Object.entries(commonRanges))for(const u of sourcesByFile.get('liveshow-proto/context/系统概要 .md')||[])if(ranges.some(([a,b])=>u.行>=a&&u.行<=b))sourceTargets.set(u.标识,[...(sourceTargets.get(u.标识)||[]),...(byId.get('COMMON-'+name)||[])]);
const reached=new Set(),unmapped=[];
for(const row of report.逐项){
 const u=sourceById.get(row.来源标识);let found=[];let reason='';
 if(u.排除说明)reason=u.排除说明;
 else if(u.路径.startsWith('同步前:')){
  const file=u.路径.slice(4);found=byText.get(file+'\n'+u.原文)||[];
  if(!found.length){const id=u.原文.match(/\[((?:REQ|META|COMMON|PENDING)-[^\]]+)\]/)?.[1];found=(byId.get(id)||[]).filter(t=>t.路径===file);}
  reason=found.length?'同步前派生条目逐项去向核对；业务资格由本次当前概要、批注及入口复核提供，不以旧用例为证据':'派生目录排版或说明由当前目录替代';
 }else if(u.路径.includes('/context/')){found=[...(byText.get(u.路径+'\n'+u.原文)||[]),...(sourceTargets.get(u.标识)||[])];reason='当前系统概要原文保留，并承接对应公共业务规则；业务优先级高于下级批注';}
 else if(sourceTargets.has(u.标识)){found=sourceTargets.get(u.标识);reason='当前批注定位到对应页面、章节及条款；演示值不作业务常量，概要冲突按公共规则及本次三处修订承接';}
 else if(u.路径.endsWith('/prototype/index.html'))reason='查看器目录、路由与同页视图实现；模块及页面分类已由目录提取器逐页传递，非独立业务规则';
 else if(u.路径.includes('/prototype/annotations/'))reason='批注容器、页名、章节名、字段表头或演示说明；业务文字逐项映射，未映射明细另附 annotation-dispositions.json';
 else if(u.路径.includes('/prototype/pages/'))reason='原型 HTML/脚本作为页面入口和交互承载核对；不将静态 Mock 值、DOM 实现或样式行另立业务需求，当前页面批注与系统概要承接业务规则';
 else if(u.路径.includes('/prototype/assets/'))reason='共享原型实现或演示数据；用于检查入口、动态面板与依赖，不以 Mock 的价格、账号、时长或成功回调定义业务预期';
 else if(u.路径.includes('REQ-001-'))reason='资料修改风控专题与当前资料编辑批注一致，已由当前端侧头像/昵称检测分支承接，不新增人工审核';
 else if(u.路径.includes('REQ-002-'))reason='SKU 三方分成专题与当前系统概要的线下核算且系统不计算具体分成冲突，采用概要3.6及COMMON-finance，不引入固定三方比例';
 else if(u.路径.endsWith('/项目说明.md')||u.路径.endsWith('/prototype/Luma Live-原型说明.md'))reason='项目接入和原型索引说明；过期目录引用由当前五份context及index定位替代，退款、平台运营账号权限与语言差异采用当前系统概要';
 else reason='项目配置、开发约定、导出工具或配色/一级页草图，不是当前活动原型的新增业务规则';
 row.目标标识=[...new Set(found.map(t=>t.标识))];row.去向=found.length?'已同步':'不适用';row.说明=reason;
 row.目标标识.forEach(id=>reached.add(id));
}
report.目标排除=[];
for(const t of targets)if(!reached.has(t.标识)){
 if(/\[(REQ|COMMON|PENDING)-/.test(t.原文))unmapped.push(t);
 else report.目标排除.push({标识:t.标识,说明:'context标题、页面定位、目录归属或解释性元数据，不单独构成业务规则；页面目录由当前index机械提取并校验'});
}
report.语义复核={说明:'',内容SHA256:''};
await fs.writeFile(`${task}/context-transfer.json`,JSON.stringify(report,null,2)+'\n');
await fs.writeFile(`${task}/annotation-dispositions.json`,JSON.stringify(annotationReview,null,2)+'\n');
console.log({source:units.来源.length,target:targets.length,unmappedTargets:unmapped,annotationUnmapped:annotationReview.length});
