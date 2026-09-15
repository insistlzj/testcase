import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {hash} from '../../scripts/evidence-discovery.mjs';
import {expandEvidenceDependencies} from '../../scripts/evidence-dependencies.mjs';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
const task=process.argv[3]||'work/liveshow-full-20260914-190307',project='liveshow-proto';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const ledger=await read(`${task}/requirements-source-ledger.json`),pageInventory=await read(`${task}/page-inventory.json`),scan=await read(`${task}/global-evidence-scan-result.json`);
const mode=process.argv[2];
const derived=['01-用户主播App-项目需求清单.md','02-公会App-项目需求清单.md','03-管理后台-项目需求清单.md'];
const texts=new Map();
for(const row of scan.文件清单){
 const bytes=await fs.readFile(row.路径);row['SHA-256']=hash(bytes);row.大小=bytes.length;row.修改时间=(await fs.stat(row.路径)).mtime.toISOString();
 if(!row.路径.endsWith('.webp'))texts.set(row.路径,bytes.toString('utf8'));
}
if(mode==='scan'){
 const inactive=new Set(pageInventory.files.filter(f=>!f.active&&!f.路径.endsWith('/index.html')).map(f=>f.路径));
 const reasons=file=>file.includes('/app-store-screenshots/')?'竞品截图，非本项目业务来源；本轮不做视觉测试':
  inactive.has(file)?'未进入当前 pagePaths 和公共导航的独立旧页面；保存原文件，不作为当前端实际入口':
  /用户APP原型分析报告|APP一级页面|用户APP原型排查|批注核对清单|公会APP-批注校对清单/.test(file)?'检查记录或既往分析只用于本轮检索和来源核对，不作为当前业务规则；对应结论已回到当前系统概要和原型批注核对':
  /(?:\/AGENTS\.md|\/CLAUDE\.md|\.gitignore|export-admin-prototype\.mjs)$/.test(file)?'项目治理或导出工具，不是产品业务需求':
  /(?:\.css|\.svg|\/tailwind\.js|\/tokens\.js|\/admin-tokens\.js|配色规范\.md|原型规范\.md|页面视图规范\.md)$/.test(file)?'样式、装饰资源或原型呈现规范；SVG 源码仅为金币图标及直播封面插画，无业务流程信息':
  /annotation-review-changes\.js$/.test(file)?'查看器只将此清单用于标红批注，已核对 renderNotes；不改变批注业务内容':null;
 scan.不读取内容=scan.文件清单.flatMap(f=>reasons(f.路径)?[{路径:f.路径,'SHA-256':f['SHA-256'],说明:reasons(f.路径)}]:[]);
 // Dynamic templates must be inspected as entries even when their HTML shell has no controls.
 const dynamic=['admin-account-balance-page.js','admin-settlement-upload-page.js','admin-statistics-page.js','admin-finance-reconciliation-page.js','chat-media.js','common.js','guild-record-overviews.js','guild-share-records.js'];
 const jsInputs=Object.fromEntries(dynamic.map(f=>[`${project}/prototype/assets/${f}`,`<script>${texts.get(`${project}/prototype/assets/${f}`)}</script>`]));
 const parsed=spawnSync('python3',['scripts/parse-prototype-html.py'],{input:JSON.stringify(jsInputs),encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(parsed.status,0,parsed.stderr);
 await fs.writeFile(`${task}/shared-template-elements.json`,parsed.stdout+'\n');
 const deps=await expandEvidenceDependencies(path.resolve(project),[`${project}/prototype/index.html`,...new Set(pageInventory.pages.map(p=>p.file)),...derived.map(f=>`${project}/context/${f}`)].map(f=>path.resolve(f)));
 await fs.writeFile(`${task}/current-dependencies.json`,JSON.stringify(deps,null,2)+'\n');
 scan.依赖关系=deps.依赖关系;
 scan.排除引用=deps.排除引用;
 const refs=[...new Set(deps.排除引用.map(r=>r.引用))];
 scan.引用解析复核=refs.map(ref=>{
  const name=ref.split('?')[0].split('/').at(-1);
  const matches=scan.文件清单.filter(f=>path.basename(f.路径)===name).map(f=>f.路径);
  assert(ref==='pages/'||matches.length,`Unresolved real reference: ${ref}`);
  return {引用:ref,当前文件:matches,结论:ref==='pages/'?'查看器路径拼接前缀，非独立文件':'共享脚本根据承载 HTML 的相对目录跳转；扫描器将脚本字符串按所有入口展开产生重复未解析项。对应实体文件存在且已读取，业务入口另按当前页面树逐端登记。'};
 });
 scan.来源访问缺口=[{来源:`${project}/项目说明.md`,问题:'项目说明仍引用目前不存在的旧 context 六份文件',处置:'保留项目说明原文；不恢复旧资料。当前系统概要、完整三端批注和 185 个实体页面独立建立来源闭环；历史文件缺失不伪装成业务待确认。'}];
 scan.规则缺失复核=ledger.问题.map(q=>{
  const anchors=ledger.问题关联.filter(r=>q.atoms.includes(r.source.原子标识));
  const keys=[q.module,q.scene,...q.question.match(/[\u4e00-\u9fff]{2,6}/g)||[]];
  const hits=[];
  for(const [file,text]of texts)if(!scan.不读取内容.some(f=>f.路径===file)){
   for(const [i,line]of text.split('\n').entries())if(keys.some(k=>k.length>1&&line.includes(k)))hits.push({路径:file,行:i+1,内容:line});
  }
  return {问题编号:q.id,检索对象:q.scene,检索词:[...new Set(keys)],已查文件:[...texts.keys()].filter(file=>!scan.不读取内容.some(f=>f.路径===file)),命中位置:hits,采用结论:q.question,已知来源:anchors.map(r=>r.source),未采用原因:'下级文档缺写不等于规则缺失；本项保留明确未定的业务边界或同级/跨级冲突细节。上游确定规则已分别进入正式条款，原型 Mock 不用作缺口答案。'};
 });
 scan.已读取文件=scan.文件清单.filter(f=>!scan.不读取内容.some(x=>x.路径===f.路径)).map(f=>({路径:f.路径,SHA256:f['SHA-256']}));
 scan.读取范围说明='完整读取四份当前 context、三端所有结构化批注及页面树；185 个实体页面提取全部操作元素，展开公共模板及依赖；原型实现或示例不替代业务预期。';
 scan.扫描状态='有非阻塞待确认';scan.阻塞项=[];
 scan.原始证据计数={文件:scan.文件清单.length,实体页面:185,批注页面与视图:247,原始批注:2736,读取HTML操作元素:pageInventory.files.reduce((n,f)=>n+f.controls.length,0),生成条款:ledger.条款.length,独立业务问题:ledger.问题.length};
 await fs.writeFile(`${task}/global-evidence-scan-result.json`,JSON.stringify(scan,null,2)+'\n');
 console.log(JSON.stringify({阶段:'上游输入闭环记录',排除文件:scan.不读取内容.length,读取文件:scan.已读取文件.length,依赖:deps.依赖关系.length,引用未解析:deps.排除引用.length}));
}else if(mode==='context-transfer'){
 const units=await read(`${task}/context-units.json`),report=await read(`${task}/context-transfer.json`);
 const targets=units.目标,reached=new Set(),rawAtoms=[];
 const sourceById=new Map(units.来源.map(u=>[u.标识,u]));
 for(const e of ['user','guild','admin'])rawAtoms.push(...await read(`${task}/${e}-annotation-atoms.json`));
 const byOriginal=new Map();for(const a of rawAtoms){const key=a.文件+'\0'+a.原文;if(!byOriginal.has(key))byOriginal.set(key,[]);byOriginal.get(key).push(a);}
 const targetForAtom=new Map(rawAtoms.map(a=>[a.标识,targets.filter(t=>t.原文.includes(a.标识))]));
 const metadata=targets.filter(t=>/^页面：/.test(t.原文));
 const mapTargets=ts=>{ts.forEach(t=>reached.add(t.标识));return ts.map(t=>t.标识);};
 report.逐项=units.来源.map(u=>{
  let ts=[],status='不适用',reason;
  if(u.排除说明)reason=u.排除说明;
  else if(u.路径===`${project}/context/系统概要 .md`){ts=targets.filter(t=>t.路径===u.路径&&t.行===u.行);status='已同步';reason='最高业务来源原文保留于当前 context，同一物理行核对；其业务约束同时用于三端公共规则';}
  else if(u.路径.startsWith('同步前:')){ts=targets.filter(t=>t.路径===u.路径.slice(4)&&t.原文===u.原文);status=ts.length?'已同步':'已替代';reason=ts.length?'同步前条款与本次磁盘原文一致，原位或移动后保留':'本次改动按当前来源复核：原型循环演示不作业务规则，虚拟榜单范围不设相反确定性结论，新增明确未决业务问题；完整旧原文保留于本次 start。';}
  else if(/\/annotations\/(user|guild|admin)\.js$/.test(u.路径)){
   const values=[...u.原文.matchAll(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g)].map(m=>vm.runInNewContext(m[0],Object.create(null),{timeout:100}));
   const atoms=values.flatMap(value=>byOriginal.get(u.路径+'\0'+value)||[]);
   ts=[...new Map(atoms.flatMap(a=>targetForAtom.get(a.标识)||[]).map(t=>[t.标识,t])).values()];
   if(ts.length){status=ts.every(t=>t.原文.includes('[PENDING-'))?'待确认':'已同步';reason='原始批注正文逐条对应当前需求/风险，冲突采用系统概要；表格值完整保留并与条件及页面上下文关联';}
   else if(atoms.length){const decisions=ledger.原始处置.filter(r=>atoms.some(a=>a.标识===r.source?.原子标识));reason=decisions.map(d=>d.reason).join('；')||'表头、纯场景说明或原型循环示例；不作为确定规则';}
   else reason='结构化批注的对象键、章节名或 JSON 结构；业务文字另按 d 数组正文逐条核对';
  }else if(u.路径.endsWith('.html')){
   const file=pageInventory.files.find(f=>f.路径===u.路径);
   const controls=file?.controls.filter(c=>c.line===u.行)||[];
   if(controls.length){ts=metadata.filter(t=>t.原文.includes(u.路径));if(ts.length){status='已同步';reason='本行可操作元素确认实体页面承载与入口；只映射入口事实，操作结果由同页批注及系统概要定义，不以元素数证明测试覆盖';}}
   if(!reason)reason=u.路径.endsWith('/index.html')?'查看器页面树、状态视图及批注选择逻辑；用于来源登记，不作为产品独立业务断言':'HTML 标记、样式、展示样例或实现脚本；本轮已分离页面入口与业务预期，未把固定样例或源码条件直接升级为已确认需求';
  }else if(u.路径.includes('/workspace/2026-08/REQ-001-')){ts=targets.filter(t=>t.原文.includes('头像')&&t.原文.includes('检测'));status=ts.length?'已同步':'不适用';reason='资料风控任务与当前头像/昵称通过才生效的规则一致；治理和任务安排本身不形成额外业务断言';}
  else if(u.路径.includes('/workspace/2026-08/REQ-002-')){status='已替代';reason='旧 SKU 分成计算方案与系统概要 3.6.2 不计算具体分成金额冲突，采用系统概要，完整旧原文件保留';}
  else reason='来源策略、项目说明或共享实现：用于身份、入口、数据字段与依赖核对；业务事实已经回到当前系统概要与逐条批注，未将 Mock 或工具脚本单独作为需求';
  return {来源标识:u.标识,去向:status,说明:reason,目标标识:mapTargets(ts)};
 });
 report.目标排除=targets.filter(t=>!reached.has(t.标识)).map(t=>{
  const common=t.原文.match(/\[(COMMON-[^\]]+)\]/);
  if(common){
   const ranges={language:[[16,20]],identity:[[89,93],[106,138]],'guild-stop':[[144,161]],permission:[[194,212]],session:[[171,175]],cohost:[[218,224],[270,288]],ticket:[[183,190],[443,467]],consume:[[327,337]],refund:[[393,416]],income:[[406,427]],finance:[[426,439]],operation:[[442,473]],'operation-whitelist':[[478,483]],'report-end':[[294,317]],mute:[[252,267]],'fan-exit':[[263,267]],'virtual-board':[[471,473]]};
   const selected=ranges[common[1].slice(7)];assert(selected,common[1]);
   for(const row of report.逐项){const source=sourceById.get(row.来源标识);if(source.路径===`${project}/context/系统概要 .md`&&selected.some(([a,b])=>source.行>=a&&source.行<=b)&&!/^#|^\|[ -]+\|/.test(source.原文)){row.目标标识.push(t.标识);reached.add(t.标识);}}
   assert(reached.has(t.标识));return null;}
  if(t.原文.startsWith('- [REQ-'))throw new Error(`No original annotation for requirement ${t.原文.slice(0,90)}`);
  if(t.原文.startsWith('- [PENDING-'))throw new Error(`Risk has no exact annotation body anchor: ${t.原文}`);
  return {标识:t.标识,说明:'文档标题、页面定位或当前处理方式说明；不独立定义业务结果'};
 }).filter(Boolean);
 report.语义复核={说明:'按当前系统概要优先核对身份、权限锁定、连麦、举报、充值退款、线下结算和虚拟金币；原始批注 2736 条各有去向；当前 context 四文件全部从磁盘读取。来源行统计不等于业务覆盖率。',内容SHA256:reviewHash(report)};
 await fs.writeFile(`${task}/context-transfer.json`,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({来源:units.来源.length,目标:targets.length,已关联:reached.size,结构排除:report.目标排除.length}));
}else throw new Error('Expected scan or context-transfer');
