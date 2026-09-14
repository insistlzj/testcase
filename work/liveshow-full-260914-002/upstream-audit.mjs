import fs from 'node:fs/promises';
import path from 'node:path';
export const root=path.resolve(import.meta.dirname,'../..'),task=import.meta.dirname;
export const normalize=text=>text.replace(/^\s*\d+[.、．]\s*/u,'').replace(/^【Q-[^】]+】/u,'').replace(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/u,'$1：$2').replace(/\s+/gu,' ').trim();
export const data=JSON.parse(await fs.readFile(path.join(task,'current-upstream.json'),'utf8'));
export const contextFiles=['01-用户主播App-项目需求清单.md','02-公会App-项目需求清单.md','03-管理后台-项目需求清单.md'];
export const contexts=[];
for(const [i,name]of contextFiles.entries()){
 const file=`liveshow-proto/context/${name}`,text=await fs.readFile(path.join(root,file),'utf8');let page='',heading=''; const rows=[];
 for(const [index,line]of text.split('\n').entries()){
  if(line.startsWith('## '))heading=line.slice(3);
  const p=line.match(/视图：`([^`]+)`/u);if(p)page=p[1];
  const r=line.match(/^- (REQ-[^：]+)：(.*)$/u);if(r)rows.push({file,line:index+1,raw:line,id:r[1],text:r[2],page,heading,normalized:normalize(r[2])});
 }
 contexts.push({file,text,rows});
 const model=data.models[i],current=new Set(model.records.map(r=>`${r.page}\0${normalize(r.text)}`));
 const mapped=new Set(rows.map(r=>`${r.page}\0${r.normalized}`));
 const sourceOnly=model.records.filter(r=>!/^\|\s*(字段|指标|Tab)\s*\|/u.test(r.text)&&!mapped.has(`${r.page}\0${normalize(r.text)}`));
 const contextOnly=rows.filter(r=>!current.has(`${r.page}\0${r.normalized}`));
 await fs.writeFile(path.join(task,`${model.name}-sync-diff.json`),JSON.stringify({sourceOnly,contextOnly},null,2)+'\n');
 console.log(model.end,JSON.stringify({rows:rows.length,sourceOnly:sourceOnly.length,contextOnly:contextOnly.length,flags:rows.filter(r=>r.text.startsWith('【Q-')).length}));
}
