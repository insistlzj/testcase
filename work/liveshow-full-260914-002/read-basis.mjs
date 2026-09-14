import fs from 'node:fs/promises';
import path from 'node:path';
import {fingerprint,textUnits} from '../../scripts/requirement-traceability.mjs';
export const root=path.resolve(import.meta.dirname,'../..'),task=import.meta.dirname;
export const formal='liveshow-proto/MainBasis/统一需求文档.md',risk='liveshow-proto/MainBasis/需求待确认清单.md';
export const formalText=await fs.readFile(path.join(root,formal),'utf8'),riskText=await fs.readFile(path.join(root,risk),'utf8');
export const hashes={[formal]:fingerprint(formalText),[risk]:fingerprint(riskText)};
export const units=[...textUnits(formal,formalText),...textUnits(risk,riskText).map(u=>({...u,风险:true}))];
export const pages=[],rules=[],overview=[];let end='',page=null,heading='';
for(const u of units.filter(u=>!u.风险)){
 const row=u.原文;
 if(row==='# 用户App 项目需求清单')end='用户App';
 if(row==='# 公会App 项目需求清单')end='公会App';
 if(row==='# 管理后台 项目需求清单')end='管理后台';
 if(!end){overview.push(u);continue;}
 if(row.startsWith('## ')){heading=row.slice(3);page=null;}
 const p=row.match(/原型：`([^`]+)`；视图：`([^`]+)`/u);
 if(p){const [module,name]=heading.split(' · ');page={end,module,name,key:p[2],prototype:p[1],meta:[u],rules:[]};pages.push(page);}
 const role=row.match(/^执行角色：(.*?)；页面入口：(.*?)。/u);if(role&&page){page.role=role[1];page.entry=role[2];page.meta.push(u);}
 const req=row.match(/^- (REQ-[^：]+)：(.*)$/u);if(req&&page){const r={...u,id:req[1],text:req[2],page};page.rules.push(r);rules.push(r);}
}
export const questions=[];for(const u of units.filter(u=>u.风险&&u.原文.startsWith('- GAP-'))){
 const parts=u.原文.split('｜'),id=parts.shift().replace('- GAP-',''),fields=Object.fromEntries(parts.map(p=>{const i=p.indexOf('：');return[p.slice(0,i),p.slice(i+1)];}));
 questions.push({id,...fields,source:u});
}
export const clean=s=>s.replace(/（原型交互依据：.*?）/gu,'').replace(/<br\s*\/?\s*>/giu,'，').replace(/\\([.\-])/gu,'$1').replace(/\*\*/gu,'').trim();
// A clause inventory is prepared before any testcase data; conditions remain attached to their source paragraph.
export function clauses(text){
 const out=[];let cur='',depth=0;for(const ch of clean(text)){if('“（(['.includes(ch))depth++;if('”）)]'.includes(ch))depth--;
  if((ch==='；'||ch==='。')&&depth===0){if(cur.trim())out.push(cur.trim());cur='';}else cur+=ch;
 }if(cur.trim())out.push(cur.trim());return out;
}
if(process.argv[1]===import.meta.filename){
 const summary=pages.map(p=>({end:p.end,module:p.module,name:p.name,key:p.key,role:p.role,rules:p.rules.length,clauses:p.rules.flatMap(r=>clauses(r.text)).length}));
 await fs.writeFile(path.join(task,'basis-rule-inventory.json'),JSON.stringify({来源:hashes,页面:summary,规则:rules.map(({page,...r})=>({...r,page:page.key,end:page.end,module:page.module,role:page.role})),概要:overview,问题:questions},null,2)+'\n');
 console.log(JSON.stringify({pages:pages.length,rules:rules.length,clauses:rules.flatMap(r=>clauses(r.text)).length,ends:[...new Set(pages.map(p=>p.end))],questions:questions.length}));
}
