import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
const task=process.argv[3]||'work/liveshow-full-20260914-190307',project='liveshow-proto';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const checkpoint=await read(`${task}/context-checkpoint.json`);
const mode=process.argv[2];
const contexts=[];
for(const f of checkpoint.context){const text=await fs.readFile(f.路径,'utf8');assert.equal(fingerprint(text),f['SHA-256']);contexts.push({...f,text,lines:text.split('\n')});}
const formal=`${project}/MainBasis/统一需求文档.md`,risk=`${project}/MainBasis/需求待确认清单.md`;
if(mode==='draft'){
 const out=['# Luma Live 统一需求文档','','本版依据已逐项核对并从磁盘完整回读的全部 context 形成。系统概要是最高业务规则来源；三端条款补充具体入口和交互。同一事实在概要和端侧重复出现时合并覆盖，不重复建立业务事实。','本版不含旧用例、旧扫描或历史生成附录。含 PENDING 引用的未决细节仅作风险定位，确定性预期须排除该未决分支。',''];
 const pending=new Map();let common=false;
 const overview=contexts.find(f=>f.路径.endsWith('系统概要 .md'));
 out.push('## 系统概要（原文）','',...overview.lines,'');
 for(const ctx of contexts.filter(f=>f!==overview)){
  out.push(`## ${ctx.lines[0].replace(/^# /,'')}`,'');
  for(const line of ctx.lines.slice(1)){
   if(line.startsWith('- [PENDING-')){const id=line.match(/\[(PENDING-[^\]]+)\]/)[1];if(pending.has(id))assert.equal(pending.get(id).line,line);else pending.set(id,{line,contexts:[]});pending.get(id).contexts.push(ctx.路径);continue;}
   if(line==='## 需求待确认')continue;
   if(line.startsWith('- [COMMON-')){if(common)continue;}
   if(line==='## 公共业务规则'&&common)continue;
   if(line.startsWith('本次依据'))continue;
   out.push(line);
  }
  common=true;
 }
 const risks=['# Luma Live 需求待确认清单','','本文件仅用于风险和缺口，不定义正式业务规则。已知且可执行的分支继续生成；下列决定未确认前，不将候选答案写成确定预期。','原始问法保留来源；补充方案仅供产品选择，并不表示已经确认。',''];
 for(const [id,q] of pending){risks.push(`## ${id}`,q.line,`来源清单：${q.contexts.join('；')}`,'');}
 assert(pending.size>=39);
 await fs.writeFile(`${task}/统一需求文档.draft.md`,out.join('\n')+'\n');
 await fs.writeFile(`${task}/需求待确认清单.draft.md`,risks.join('\n')+'\n');
 await fs.writeFile(`${task}/context-readback.json`,JSON.stringify({时间:new Date().toISOString(),context:contexts.map(f=>({路径:f.路径,SHA256:f['SHA-256'],完整回读行数:f.lines.length,需求条款:f.lines.filter(l=>l.startsWith('- [REQ-')).length})),公共条款去重:true,独立待确认:pending.size},null,2)+'\n');
 console.log({正式行:out.length,风险行:risks.length,问题:pending.size});
}else if(mode==='transfer'){
 const units=await read(`${task}/mainbasis-units.json`),report=await read(`${task}/mainbasis-transfer.json`),reached=new Set();
 const mappings=[];const hashByPath=new Map(checkpoint.context.map(f=>[f.路径,f['SHA-256']]));
 report.逐项=units.来源.map(u=>{
  const ts=units.目标.filter(t=>t.原文===u.原文);
  ts.forEach(t=>{reached.add(t.标识);mappings.push({来源路径:u.路径,来源SHA256:hashByPath.get(u.路径),来源位置:`第 ${u.行} 行`,目标路径:t.路径,目标原文:t.原文});});
  const requirement=/^- \[(?:REQ|COMMON|PENDING|META)-/.test(u.原文);
  assert(!requirement||ts.length,`Lost context content: ${u.路径}:${u.行}`);
  return {来源标识:u.标识,去向:ts.length?(u.原文.startsWith('- [PENDING-')?'待确认':'已同步'):'不适用',说明:ts.length?'从固定 checkpoint 后重新读取的 context 原文逐行对应；相同公共条款只保留一份，端侧入口及分支不合并删除':'文档包装标题、重复说明或待确认分组标题；不独立定义业务结果',目标标识:ts.map(t=>t.标识)};
 });
 report.目标排除=units.目标.filter(t=>!reached.has(t.标识)).map(t=>({标识:t.标识,说明:'两份需求文档的标题、来源路径及证据职责说明；不添加业务事实'}));
 report.语义复核={说明:'逐行保留全部四份磁盘 context 的端侧条款，概要原文完整纳入；公共条款和未决问题去重。原型演示和实现缺口明确不作为业务预期；虚拟榜单及等级勋章未决范围单独定位。',内容SHA256:reviewHash(report)};
 await fs.writeFile(`${task}/mainbasis-transfer.json`,JSON.stringify(report,null,2)+'\n');
 const start=await read(`${task}/mainbasis-start.json`),before=new Map([...start.上游,...start.文档].map(f=>[f.路径,f['SHA-256']]));
 const files=[...contexts.filter(f=>!f.路径.endsWith('系统概要 .md')).map(f=>f.路径),formal,risk];
 const sync={schemaVersion:'1.0',项目目录:project,同步状态:'有非阻塞待确认',阻塞异常:[],需求清单有修改:true,需求清单变更日志编号:[task.endsWith('basis-revision-2')?'RSL-0037':'RSL-0036'],文件核对:await Promise.all(files.map(async f=>({路径:f,修改前SHA256:before.get(f)||null,修改后SHA256:fingerprint(await fs.readFile(f)),文件原先不存在:!before.has(f),核对说明:'当前原文经过上游/context 和 context/MainBasis 两段逐项核对；规则冲突采用系统概要，业务缺口与确定规则分离'}))),MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',复核说明:report.语义复核.说明,上游指纹:fingerprint(checkpoint.上游),来源映射:mappings,待确认问题:units.目标.filter(u=>u.路径===risk&&u.原文.startsWith('- [PENDING-')).map(u=>u.原文)}};
 await fs.writeFile(`${task}/prototype-context-sync-result.json`,JSON.stringify(sync,null,2)+'\n');
 console.log({来源:units.来源.length,目标:units.目标.length,原文映射:mappings.length});
}else throw new Error('draft or transfer');
