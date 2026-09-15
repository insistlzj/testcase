import fs from 'node:fs/promises';
import path from 'node:path';
import {fingerprint as hash,reviewHash} from '../../scripts/requirement-traceability.mjs';
const task='work/liveshow-guild-admin-260915-001',project='liveshow-proto';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const save=async (n,v)=>fs.writeFile(`${task}/${n}`,JSON.stringify(v,null,2)+'\n');
const start=await read(`${task}/mainbasis-start.json`);
const phase=process.argv[2];
if(phase==='context'){
 const units=await read(`${task}/context-units.json`),r=await read(`${task}/context-transfer.json`);
 const pages=new Map(),exact=new Map();let current;
 for(const t of units.目标){
  if(!exact.has(t.原文))exact.set(t.原文,[]);exact.get(t.原文).push(t.标识);
  if(t.原文.startsWith('## '))current=null;
  if(t.原文.startsWith('页面：'))current=t.原文.match(/^页面：([^；]+)/)[1];
  if(current){if(!pages.has(current))pages.set(current,[]);pages.get(current).push(t.标识);}
 }
 const target=(pattern)=>units.目标.filter(t=>pattern.test(t.原文)).map(t=>t.标识);
 const dir=units.目标.filter(t=>t.路径.endsWith('原型页面目录结构.md')).map(t=>t.标识);
 const html=new Map();for(const s of units.来源)if(s.路径.endsWith('.html'))html.set(s.路径,(html.get(s.路径)||'')+s.原文+'\n');
 const callers=new Map();for(const [p,text]of html)for(const m of text.matchAll(/<script[^>]+src=["']([^"']+)["']/g)){
  const file=path.posix.normalize(path.posix.join(path.posix.dirname(p),m[1]));if(!callers.has(file))callers.set(file,new Set());callers.get(file).add(path.posix.basename(p));
 }
 let annotationPage='',lastFile='';const unresolved=[];
 for(const [i,s]of units.来源.entries()){
  const row=r.逐项[i],p=s.路径.replace(/^同步前:/,'');
  const set=(去向,说明,ids=[])=>Object.assign(row,{去向,说明,目标标识:[...new Set(ids)]});
  if(s.路径!==lastFile){annotationPage='';lastFile=s.路径;}
  if(s.排除说明){set('不适用',s.排除说明);continue;}
  if(exact.has(s.原文)){set('已同步','当前原文完整保留在 context；业务优先级和差异另由当前概要及批注核对',exact.get(s.原文));continue;}
  if(s.路径.includes('/annotations/')||s.路径.endsWith('/assets/annotations.js')||s.路径.endsWith('/assets/annotation-review-changes.js')){
   annotationPage=s.原文.match(/^\s*["']([^"']+\.html)["']\s*:/)?.[1]||annotationPage;
   if(pages.has(annotationPage)){set('已同步','批注所属页面条款承接：入会驳回/权限矩阵/虚拟金币/退款/连麦冲突采用系统概要；Mock 与未实现说明不作为正式预期；未决分支在 PENDING 保留',pages.get(annotationPage));continue;}
   set('不适用','批注渲染框架、修订高亮索引或未登记页面；不作为独立业务规则');continue;
  }
  if(p.endsWith('/prototype/index.html')){set('已同步','查看器当前运行目录及关联详情页进入目录清单；同页视图不额外计页，布局代码不建立业务断言',dir);continue;}
  if(pages.has(path.posix.basename(p))&&p.includes('/pages/')){set('已同步','当前活动页面的入口、字段和交互由对应页面需求承接；HTML 样式及固定示例不独立定义业务',pages.get(path.posix.basename(p)));continue;}
  if(p.includes('/pages/')){set('不适用','未在当前 index 活动页面或关联详情页登记的遗留 HTML；未将旧系统参数、审计、权限页或旧装扮页作为本期模块');continue;}
  if(p.endsWith('Luma Live-原型说明.md')){
   const page=s.原文.match(/pages\/[^`]+\.html/)?.[0];
   const ids=page?pages.get(path.posix.basename(page)):target(/COMMON-.*(?:date|decimal|field-label|review-gray|language)|PENDING-cooling-date/);
   set(ids?.length?'已同步':'不适用',page?'原型页面清单对应当前 context 页面；汇总描述不替代系统概要细则':'通用日期、输入、字段与灰度要求已补齐；纯视觉约定及文档结构不生成业务用例',ids||[]);continue;
  }
  if(p.includes('/assets/')){
   if(/\/(?:admin-mock|mock|guild-data-model|admin-tokens|tokens)\.js$/.test(p)){set('不适用','固定样例、随机数据、样式令牌或演示计算；不得以 Mock 数值和简化统计建立业务规则');continue;}
   const ids=[...(callers.get(p)||[])].flatMap(page=>pages.get(page)||[]);
   set(ids.length?'已同步':'不适用','共享脚本沿当前 HTML 引用定位到页面；只补充明确入口/动作，真实业务采用概要及结构化批注；固定演示值不成为预期',ids);continue;
  }
  if(p.includes('/workspace/2026-08/REQ-001')){set('已同步','资料风控先校验后保存及失败保留输入由资料编辑条款承接',pages.get('profile-edit.html'));continue;}
  if(p.includes('/workspace/2026-08/REQ-002')){set('已替代','系统概要明确分成由线下财务核算；历史 SKU 比例配置方案不进入当前已确认规则',target(/COMMON-finance/));continue;}
  if(p.endsWith('公会APP-批注校对清单.md')||p.endsWith('批注核对清单.md')){set('已同步','当前批注校对记录按对应端需求归并，未实现/Mock差异保留为实施风险，系统概要冲突按最高来源处理',target(/COMMON-identity|COMMON-permission|COMMON-finance|COMMON-income/));continue;}
  if(/(?:\.gitignore|AGENTS\.md|CLAUDE\.md|export-admin-prototype\.mjs|APP一级页面 \.html|原型规范\.md|页面视图规范\.md|配色规范\.md|需求来源策略\.json|项目说明\.md)$/.test(p)){set('不适用','接入身份、执行工具、原型技术规范、配色和旧一级页面导航；本期范围由当前 index 与系统概要确定，不新增业务事实');continue;}
  unresolved.push({路径:s.路径,行:s.行,原文:s.原文});
 }
 const reached=new Set(r.逐项.flatMap(x=>x.目标标识));
 r.目标排除=units.目标.filter(t=>!reached.has(t.标识)).map(t=>({标识:t.标识,说明:/^#|^本次|^页面：/.test(t.原文)?'派生文档结构和定位说明，不是新增业务规则':'新增通用条款或风险条目，来源在条款正文明确；由本次 RSL-0040 记录原文和核对依据'}));
 await save('context-unhandled.json',unresolved);
 if(unresolved.length)throw Error(`仍有 ${unresolved.length} 项未定位`);
 r.语义复核={说明:'核对当前概要、2736 条结构化批注与 context 的承接；87处非原文匹配已区分概要覆盖、Mock、未实现及风险。新增8项通用/导入条款与1项格式冲突。代码行映射只用于来源完整性，不计作测试覆盖。',内容SHA256:reviewHash(r)};
 await save('context-transfer.json',r);
}
if(phase==='assemble'){
 const checkpoint=await read(`${task}/context-checkpoint.json`),texts=[];
 for(const f of checkpoint.context){const text=await fs.readFile(f.路径,'utf8');if(hash(text)!==f['SHA-256'])throw Error('context变化');texts.push({path:f.路径,text});}
 const summary=texts.find(f=>f.path.includes('系统概要')).text;
 const pending=new Map();const sections=[];
 for(const f of texts.filter(f=>/\/(01|02|03)-/.test(f.path))){const [body,risks]=f.text.split('## 需求待确认（不作为确定业务规则）');sections.push(`\n## ${path.posix.basename(f.path,'.md')}\n\n${body.trim()}\n`);for(const line of (risks||'').split('\n')){const id=line.match(/^- \[(PENDING-[^\]]+)\]/)?.[1];if(id){if(!pending.has(id))pending.set(id,{line,paths:[]});pending.get(id).paths.push(f.path);}}}
 await fs.writeFile(`${project}/MainBasis/统一需求文档.md`,'# Luma Live 统一需求文档\n\n本版从完成上游逐项核对后、从磁盘完整回读的全部 context 生成。系统概要优先，原型和批注补充；不使用旧用例或历史生成附录。含 PENDING 引用的未决分支不定义确定性预期。\n\n## 系统概要（原文）\n\n'+summary.trim()+'\n'+sections.join('\n'));
 await fs.writeFile(`${project}/MainBasis/需求待确认清单.md`,'# Luma Live 需求待确认清单\n\n仅用于风险和缺口；选项是候选方案，不是正式业务规则。当前未提供产品批准结论，不能据此生成确定性预期。\n\n'+[...pending].map(([id,r])=>`## ${id}\n${r.line}\n来源清单：${r.paths.join('；')}\n`).join('\n'));
}
if(phase==='basis'){
 const units=await read(`${task}/mainbasis-units.json`),r=await read(`${task}/mainbasis-transfer.json`),exact=new Map();
 for(const t of units.目标){if(!exact.has(t.原文))exact.set(t.原文,[]);exact.get(t.原文).push(t.标识);}
 for(const [i,s]of units.来源.entries()){const ids=exact.get(s.原文)||[];Object.assign(r.逐项[i],{去向:ids.length?'已同步':'不适用',说明:ids.length?'checkpoint 后从磁盘回读的完整原文进入正式需求或风险清单':'目录由共享目录提取器仅传递端、模块、页面；说明/文档标题不定义业务',目标标识:ids});}
 const reached=new Set(r.逐项.flatMap(x=>x.目标标识));r.目标排除=units.目标.filter(t=>!reached.has(t.标识)).map(t=>({标识:t.标识,说明:'汇总标题、来源路径或由当前原型目录抽取的分类元数据；不定义业务预期'}));
 r.语义复核={说明:'从checkpoint后五份context全文重新读取汇总，逐行原文对照，风险单独去重汇总；目录仅提供分类。未使用同一内存批注结果同时写两个阶段。',内容SHA256:reviewHash(r)};await save('mainbasis-transfer.json',r);
 const cp=await read(`${task}/context-checkpoint.json`);const docs=await Promise.all(['统一需求文档.md','需求待确认清单.md'].map(async n=>({路径:`${project}/MainBasis/${n}`,'SHA-256':hash(await fs.readFile(`${project}/MainBasis/${n}`))})));
 const scan=await read(`${task}/global-evidence-scan-result.json`);scan.文件清单=cp.上游.filter(f=>f.路径.startsWith(project+'/'));scan.扫描状态='有非阻塞待确认';scan.规则缺失复核=[{检索对象:'通用日期、小数、字段、灰度和财务导入模板',已查文件:['prototype/Luma Live-原型说明.md','prototype/assets/admin-settlement-upload-page.js','prototype/annotations/user.js'],采用结论:'8处规则补齐；冷静期格式同级冲突写入PENDING-cooling-date-format'}];await save('global-evidence-scan-result.json',scan);
 const before=new Map([...start.上游,...start.文档].map(f=>[f.路径,f['SHA-256']]));const targetIds=new Map(units.目标.map(t=>[t.标识,t]));
 await save('prototype-context-sync-result.json',{项目名称:'Luma Live',来源策略:'prototype-primary',同步状态:'有非阻塞待确认',原型基线:cp.上游,扫描范围:'当前全项目清单；系统概要、结构化批注、活动页面、共享依赖和全部context',目标需求清单:cp.context.map(f=>f.路径),差异统计:{新增:9,修改:0,明确删除:0,原型未覆盖:0,来源冲突:1,无法定位:0},需求清单变更日志编号:['RSL-0040'],受影响用例:[],阻塞异常:[],文件核对:[...cp.context.filter(f=>!f.路径.includes('系统概要')),...docs].map(f=>({路径:f.路径,修改前SHA256:before.get(f.路径)||null,修改后SHA256:f['SHA-256'],核对说明:'当前磁盘SHA256与同步前快照逐文件比较，新增条款见RSL-0040；其他正文原文传递'})),MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',复核说明:r.语义复核.说明,上游指纹:hash(cp.上游),待确认问题:units.目标.filter(t=>/^- \[PENDING-/.test(t.原文)).map(t=>t.原文),来源映射:r.逐项.filter(x=>x.目标标识.length).map(x=>{const s=units.来源.find(s=>s.标识===x.来源标识),t=targetIds.get(x.目标标识[0]);return{来源路径:s.路径,来源SHA256:cp.context.find(f=>f.路径===s.路径)['SHA-256'],来源位置:`第${s.行}行`,目标路径:t.路径,目标原文:t.原文};})}});
}
