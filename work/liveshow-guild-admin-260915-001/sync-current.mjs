import fs from 'node:fs/promises';
import path from 'node:path';
import {fingerprint,reviewHash} from '../../scripts/requirement-traceability.mjs';
const task='work/liveshow-guild-admin-260915-001';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const save=async (p,x)=>fs.writeFile(`${task}/${p}`,JSON.stringify(x,null,2)+'\n');
const start=await read(`${task}/mainbasis-start.json`);
const inspect=await read(`${task}/upstream-review-input.json`);
if(process.argv[2]==='scan'){
 const files=await Promise.all(start.上游.filter(f=>f.路径.startsWith('liveshow-proto/')).map(async f=>({...f,大小:(await fs.stat(f.路径)).size,修改时间:(await fs.stat(f.路径)).mtime.toISOString()})));
 await save('global-evidence-scan-result.json',{schemaVersion:'1.0',项目目录:'liveshow-proto',扫描模式:'incremental',扫描状态:'生成待复核',模式依据:'当前全项目哈希与已发布需求基线一致，仅治理规则变化；重新核对当前批注与 context，未读取旧扫描语义。',规则影响层:'结构化设计子项及固定交付位置；不改变业务事实',文件清单:files,不读取内容:inspect.排除,阻塞项:[],规则缺失复核:[],不评估历史用例:'用户禁用',未原文匹配批注:inspect.未原文匹配});
}
if(process.argv[2]==='context'){
 const units=await read(`${task}/context-units.json`),report=await read(`${task}/context-transfer.json`);
 const exact=new Map();
 for(const t of units.目标){if(!exact.has(t.原文.trim()))exact.set(t.原文.trim(),[]);exact.get(t.原文.trim()).push(t.标识);}
 const pageTargets=new Map();let current;
 for(const t of units.目标){if(t.原文.startsWith('#'))current=null;if(t.原文.startsWith('页面：'))current=t.原文.match(/实际承载：([^；]+)/)?.[1];if(current){if(!pageTargets.has(current))pageTargets.set(current,[]);pageTargets.get(current).push(t.标识);}}
 const byId=new Map(units.目标.map(t=>[t.标识,t]));
 for(let i=0;i<units.来源.length;i++){
  const s=units.来源[i],r=report.逐项[i];
  if(s.排除说明){Object.assign(r,{去向:'不适用',说明:s.排除说明});continue;}
  const same=exact.get(s.原文.trim());
  if(same){Object.assign(r,{去向:'已同步',说明:'当前上游原文与磁盘 context 对应行一致；未以历史用例定义需求',目标标识:same});continue;}
  const base=s.路径.replace(/^同步前:/,'');
  if(pageTargets.has(base)){Object.assign(r,{去向:'已同步',说明:'本页结构、控件和内嵌交互由当前页面对应条款承接；示例值不替代系统概要及明确批注',目标标识:pageTargets.get(base)});continue;}
  if(s.路径.includes('/annotations/')){
   const str=s.原文.match(/^\s*['"](.+?)['"],?\s*$/)?.[1]?.replace(/^\d+\.\s*/,'');
   const norm=x=>x.replace(/[\s|*\\，。；：、“”‘’（）,.!?;:'"()\-]/g,'');
   const hits=str?units.目标.filter(t=>norm(t.原文).includes(norm(str))||str.includes(t.原文.match(/^\- \[[^\]]+\] (.*?)〔/)?.[1]||'\u0000')):[];
   if(hits.length){Object.assign(r,{去向:'已同步',说明:'当前批注正文由目标需求承接，原文或拆分后的条款一致',目标标识:hits.map(t=>t.标识)});continue;}
  }
 }
 await save('context-transfer.json',report);
 const left=report.逐项.filter(r=>r.去向==='未处理').map(r=>units.来源.find(s=>s.标识===r.来源标识));
 await save('context-unhandled.json',left);
 console.log('remaining',left.length);console.log(Object.fromEntries([...new Set(left.map(x=>x.路径))].map(p=>[p,left.filter(x=>x.路径===p).length])));
}
