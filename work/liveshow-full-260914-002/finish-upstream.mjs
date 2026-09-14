import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fingerprint,reviewHash,validateTransfer} from '../../scripts/requirement-traceability.mjs';
const root=path.resolve(import.meta.dirname,'../..'),task=import.meta.dirname,taskRel=path.relative(root,task),project='liveshow-proto';
const read=async f=>JSON.parse(await fs.readFile(path.join(task,f),'utf8'));
const save=(f,v)=>fs.writeFile(path.join(task,f),JSON.stringify(v,null,2)+'\n');
const start=await read('mainbasis-start.json'),data=await read('current-upstream.json'),decisions=await read('sync-decisions.json');
const inspect=()=>JSON.parse(execFileSync(process.execPath,['scripts/mainbasis.mjs','inspect',project],{cwd:root,encoding:'utf8'}));
const norm=s=>s.replace(/^\s*\d+[.、．]\s*/u,'').replace(/^【Q-[^】]+】/u,'').replace(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/u,'$1：$2').replace(/\s+/gu,' ').trim();
const mode=process.argv[2];
if(mode==='scan'){
 const {上游,上游指纹}=inspect();
 const excluded=上游.filter(f=>f.路径.startsWith(project+'/')).flatMap(f=>{
  let why='';
  if(f.路径.includes('/app-store-screenshots/'))why='竞品展示截图；未登记为当前项目业务需求，不用于业务规则或视觉测试，本次不读取图片内容。';
  else if(/用户APP原型分析报告|用户APP原型排查|批注核对清单/u.test(f.路径))why='历史分析和检查结果；当前直接读取系统概要、活动原型及批注，历史结论不作为生成输入。';
  else if(/\.(css|svg)$|\/tailwind.js$|\/tokens.js$|\/admin-tokens.js$/u.test(f.路径))why='样式、设计令牌或装饰图；本次不生成纯视觉测试，不定义业务结果。';
  else if(/\/(AGENTS|CLAUDE|原型规范|页面视图规范)\.md$|export-admin-prototype\.mjs$|\/\.gitignore$/u.test(f.路径))why='项目维护和原型构建工具说明，不是三端业务需求。已按工具职责处理。';
  return why?[{...f,说明:why}]:[];
 });
 const stats=await Promise.all(上游.filter(f=>f.路径.startsWith(project+'/')).map(async f=>{const s=await fs.stat(path.join(root,f.路径));return {...f,大小:s.size,修改时间:s.mtime.toISOString()};}));
 await save('global-evidence-scan-result.json',{schemaVersion:'1.0',扫描模式:'full',模式依据:'用户要求从当前上游全新生成，历史证据、场景、用例与比较均不读取；本轮从原型、概要、全部context重新建立来源闭环。',扫描状态:'有非阻塞待确认',阻塞项:[],上游指纹,文件清单:stats,不读取内容:excluded,历史策略:'不读取不比较',复用数量:0,缓存清理:{状态:'成功',清理记录:[],清理后残留失效文件:[],说明:'前次已隔离旧生成数据；本任务从新建目录读取当前上游，未读取或复用任何旧证据缓存。'},规则基线:上游.filter(f=>!f.路径.startsWith(project+'/')),页面视图:data.models.map(m=>({端:m.end,页面视图数:Object.keys(m.pages).length,控件数:m.elements.length,说明:'仅来源盘点数量，不是规则或用例覆盖率'})),关联映射:data.models.map(m=>({端:m.end,页面:m.pages,依赖关系:m.dependencies.依赖关系})),规则缺失复核:decisions.risks.map(r=>({问题:r.id,对象:r.topic,检索范围:['系统概要全文','三个端结构化及公共批注','全部context','关联页面及共享脚本'],检索词:[r.topic,r.module,r.page],已知依据:r.known,采用结论:r.question,影响范围:r.ends})),未注册页面处理:[{页面:'admin-system-parameter.html、admin-system-parameter-detail.html',结论:'Q-059：文件存在但无当前导航登记，局部隔离'},{页面:'admin-system-audit.html、admin-system-audit-detail.html',结论:'Q-060：文件存在但无当前导航登记，局部隔离'},{页面:'admin-system-permission.html',结论:'已替代：脚本直接重定向角色列表或角色详情'},{页面:'my-outfits.html',结论:'已替代：活动入口使用我的装扮及头像框、气泡、勋章子页'}]});
 console.log(JSON.stringify({files:stats.length,excluded:excluded.length}));
}
if(mode==='transfer'){
 const {来源:sources,目标:targets}=await read('context-units.json');const report=await read('context-transfer.json');report.目标排除=[];
 const byRaw=new Map(),byReq=new Map(),byPage=new Map();let page='',file='';
 for(const t of targets){if(t.路径!==file){file=t.路径;page='';} const p=t.原文.match(/视图：`([^`]+)`/u);if(p)page=p[1];
  if(!byRaw.has(t.原文.trim()))byRaw.set(t.原文.trim(),[]);byRaw.get(t.原文.trim()).push(t);
  const r=t.原文.match(/^- (REQ-[^：]+)：(.*)$/u);if(r){byReq.set(r[1],t);if(!byPage.has(page))byPage.set(page,[]);byPage.get(page).push({...t,text:r[2]});}
 }
 const mappedRecords=new Map();const sourceRemainder=[];
 for(const m of data.models)for(const r of m.records){
  if(/^\|\s*(字段|指标|Tab|入口)\s*\|/u.test(r.text))continue;
  let ts=(byPage.get(r.page)||[]).filter(t=>norm(t.text)===norm(r.text));
  if(!ts.length){const mappings=decisions.mappings.filter(x=>x.source.includes(r.id));ts=mappings.map(x=>byReq.get(x.id)).filter(Boolean);}
  if(!ts.length){const diff=JSON.parse(await fs.readFile(path.join(task,`${m.name}-sync-diff.json`),'utf8'));
   const cells=r.text.startsWith('|')?r.text.split('|').map(s=>s.trim()).filter(Boolean):[];
   if(cells.length===3)ts=(byPage.get(r.page)||[]).filter(t=>t.text.includes(cells[0])&&t.text.includes(cells[1]));
   if(!ts.length){const clauses=norm(r.text).split(/[；。]/u).filter(c=>c.length>10&&!/退款|冲正|本场|已同意|其他邀请失效/u.test(c));ts=(byPage.get(r.page)||[]).filter(t=>clauses.some(c=>t.text.includes(c)));}
   if(!ts.length&&diff.sourceOnly.some(x=>x.id===r.id))sourceRemainder.push(r);
  }
  mappedRecords.set(r.id,ts);
 }
 const allRecords=data.models.flatMap(m=>m.records),reached=new Set(),unhandled=[];
 const filePages=new Map();for(const m of data.models)for(const [p,v]of Object.entries(m.pages)){if(!filePages.has(v.file))filePages.set(v.file,[]);filePages.get(v.file).push(p);}
 for(const [i,s]of sources.entries()){
  const row=report.逐项[i];let ts=[],why='',status='不适用';
  if(s.排除说明)why=s.排除说明;
  else if(s.路径.startsWith('同步前:')){
   const req=s.原文.match(/^- (REQ-[^：]+)：/u)?.[1];
   ts=req?(byReq.has(req)?[byReq.get(req)]:[]):(byRaw.get(s.原文.trim())||[]);
   why=req?'保留稳定需求编号；逐条对照本次同步前后正文，概要冲突采用最高业务来源，未定分支独立记录风险。':'需求章节、入口说明或公共概述按当前全文保留；来源批次元信息不构成新业务规则。';
   if(!ts.length&&!req)why='同步前结构或风险提示已归并到当前章节及独立缺口清单；不构成独立业务规则。';
   if(req&&!ts.length)unhandled.push(s);
  }else if(s.路径.includes('/context/')){ts=targets.filter(t=>t.路径===s.路径&&t.行===s.行&&t.原文===s.原文);why='系统概要作为最高业务基准，逐行完整保留，未用派生摘要替代。';}
  else if(s.路径.includes('/annotations/')||s.路径.endsWith('/assets/annotations.js')){
   const matches=allRecords.filter(r=>r.file===s.路径&&(s.原文.includes(JSON.stringify(r.text).slice(1,-1))||s.原文.includes(r.text.replaceAll("'","\\'"))));
   ts=[...new Map(matches.flatMap(r=>mappedRecords.get(r.id)||[]).map(t=>[t.标识,t])).values()];
   if(ts.length)why='批注正文逐项对应当前需求；字段、条件、结果及不同角色保留，概要优先项和待决策分支按同步记录处理。';
   else if(matches.some(r=>sourceRemainder.some(x=>x.id===r.id))){status='已替代';why='已逐条复核差异：入会/退款/权限锁定/RTP/直播举报/连麦邀请以系统概要对应明确规则替代；固定演示人名、交替模拟和视觉建议不定义业务规则。';}
   else why='批注容器、标题、分隔线或表头；规则由所属正文条目同步，不重复建立业务条款。';
  }else{
   const pgs=filePages.get(s.路径)||[];
   const chunks=[...s.原文.matchAll(/["'`]([^"'`<>\n]{3,120})["'`]/gu)].map(m=>m[1]).filter(v=>/[\u3400-\u9fff]/u.test(v)&&!/[{}();]/u.test(v));
   ts=pgs.flatMap(p=>byPage.get(p)||[]).filter(t=>chunks.some(c=>t.text.includes(c)));
   if(ts.length)why='页面控件、文案或交互分支对应已读取批注中的具体条款；固定Mock值不作为预期结果。';
   else if(s.路径.includes('/workspace/2026-08/REQ-002')){status='已替代';why='SKU在线分成方案与最高系统概要明确的线下核算、结算结果上传及不计算具体分成相冲突，本轮采用概要。';}
   else if(s.路径.includes('/workspace/2026-08/REQ-001')){why='资料修改历史任务说明；当前机审规则已在系统概要与资料编辑当前批注完整登记，不将任务进度或代码方案另建业务事实。';}
   else why='原型实现、导航登记、展示示例或项目说明；已结合该文件的页面/依赖/批注阅读全文分析，未匹配独立业务断言的代码不单独建立确定业务规则。';
  }
  if(ts.length)status=ts.some(t=>/不提供确定预期/u.test(t.原文))?'待确认':'已同步';
  Object.assign(row,{去向:status,说明:why,目标标识:[...new Set(ts.map(t=>t.标识))]});row.目标标识.forEach(id=>reached.add(id));
 }
 // Explicit supplement and risk provenance is kept separately from HTML token matches.
 for(const t of targets.filter(t=>!reached.has(t.标识))){
  let candidates=[];
  if(t.原文.startsWith('- REQ-EXT-')){const f=t.原文.match(/原型交互依据：(.*?)）/u)?.[1];candidates=sources.filter(s=>s.路径===`${project}/${f}`&&/if|onclick|addEventListener|input|header|columns|confirm|cancel|maximum|maxLength|maxlength/u.test(s.原文));}
  else if(t.原文.startsWith('- GAP-')||t.原文.trim().startsWith('- 风险')){
   const qs=[...t.原文.matchAll(/Q-\d+/gu)].map(m=>m[0]),rs=decisions.risks.filter(r=>qs.includes(r.id));
   candidates=sources.filter(s=>rs.some(r=>s.原文.includes(r.known)||s.原文.includes(r.topic)));
   if(qs.includes('Q-061'))candidates=sources.filter(s=>s.路径.endsWith('/common.js')&&s.原文.includes('data-clear-screen'));
   if(!candidates.length){
    const records=allRecords.filter(a=>rs.some(r=>r.page===a.page)&&!/^\|\s*(字段|指标|Tab|入口)\s*\|/u.test(a.text));
    candidates=sources.filter(s=>records.some(a=>a.file===s.路径&&(s.原文.includes(JSON.stringify(a.text).slice(1,-1))||s.原文.includes(a.text.replaceAll("'","\\'")))));
   }
   if(!candidates.length){const names=rs.map(r=>r.page);candidates=sources.filter(s=>names.some(n=>s.路径.endsWith('/'+n))&&/<title>/u.test(s.原文));}
  }else if(t.原文.startsWith('执行角色：')){const prior=targets.find(x=>x.路径===t.路径&&x.行===t.行-2);const f=prior?.原文.match(/原型：`([^`]+)`/u)?.[1];candidates=sources.filter(s=>s.路径===f&&/<title>/u.test(s.原文));}
  if(candidates.length){for(const s of candidates){const row=report.逐项[sources.indexOf(s)];row.目标标识.push(t.标识);row.去向=t.原文.startsWith('- GAP-')?'待确认':'已同步';row.说明+='；该段同时作为本次补充交互、角色入口或局部风险的直接关联来源。';}reached.add(t.标识);}
 }
 const missing=targets.filter(t=>!reached.has(t.标识));
 for(const t of missing){if(/^- (REQ-|GAP-)|^执行角色：|^\s+- 风险/u.test(t.原文))unhandled.push(t);else report.目标排除.push({标识:t.标识,说明:'当前清单结构、章节、来源说明或公共规则导航；具体业务由同文件逐条需求和最高系统概要承载。'});}
 await save('context-transfer.json',report);await save('transfer-review-needed.json',{未映射:unhandled,批注差异:sourceRemainder});
 console.log(JSON.stringify({source:sources.length,target:targets.length,unhandled:unhandled.length,remainder:sourceRemainder.length}));
}
if(mode==='review'){
 const {来源,目标}=await read('context-units.json'),r=await read('context-transfer.json');
 r.语义复核={说明:'逐条核对当前结构化批注及公共批注、全部系统概要和同步前后需求正文；保留明确条款，按概要替代入会、退款、结算、权限、举报及连麦冲突；将已知规则与59项原始待决策分开，另发现并隔离观众清屏入口冲突。控件和代码只证明相应入口及实际交互，样例数值、布局、历史分析不建立规则。人工确认未映射清单归零后封存。',内容SHA256:reviewHash(r)};
 validateTransfer(来源,目标,r);await save('context-transfer.json',r);console.log('context transfer validated');
}
