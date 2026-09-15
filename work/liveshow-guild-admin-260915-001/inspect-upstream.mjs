import fs from 'node:fs/promises';
import path from 'node:path';
import {readAnnotations,hash} from '../../scripts/evidence-discovery.mjs';
const task='work/liveshow-guild-admin-260915-001';
const start=JSON.parse(await fs.readFile(`${task}/mainbasis-start.json`,'utf8'));
const texts=new Map();
const excluded=[];
for(const f of start.上游.filter(f=>f.路径.startsWith('liveshow-proto/'))){
 let reason;
 if(f.路径.includes('/app-store-screenshots/')) reason='竞品应用商店截图，仅视觉参考，不是 Luma Live 业务资料';
 else if(f.路径.endsWith('/tailwind.js')) reason='第三方样式运行库，不定义项目业务';
 else if(/\.(css|svg)$/.test(f.路径)) reason='配色、布局或插画资源；本次未要求视觉测试';
 else if(/\/用户APP原型分析报告-|\/workspace\/2026-09\/用户APP原型排查/.test(f.路径)) reason='历史分析报告，不作为当前业务证据；仅保留路径和哈希';
 if(reason) excluded.push({...f,说明:reason});
 else texts.set(f.路径,await fs.readFile(f.路径,'utf8'));
}
const context=[...texts].filter(([p])=>p.includes('/context/'));
const annotations=[];
for(const end of ['user','guild','admin']){
 const file=`liveshow-proto/prototype/annotations/${end}.js`;
 for(const [page,a] of Object.entries(readAnnotations(texts.get(file)))) for(const [s,section] of a.sections.entries()) for(const [i,text] of section.d.entries()) annotations.push({file,page,section:section.t,line:s+1,item:i+1,text});
}
const norm=s=>s.replace(/<[^>]*>/g,'').replace(/[\s|*`\\，。；：、“”‘’（）,.!?;:'"()\-]/g,'');
const haystack=context.map(([,text])=>norm(text)).join('\n');
const unmatched=annotations.filter(a=>!/^\|\s*(字段|指标|[-:])/.test(a.text)&&!haystack.includes(norm(a.text.replace(/^\d+\.\s*/,''))));
await fs.writeFile(`${task}/upstream-review-input.json`,JSON.stringify({排除:excluded,批注:annotations,未原文匹配:unmatched},null,2));
console.log(JSON.stringify({文件:start.上游.length,读取:texts.size,排除:excluded.length,批注:annotations.length,待核对:unmatched.length}));
console.log(unmatched.map(a=>`${a.file.split('/').at(-1)} ${a.page} ${a.section}: ${a.text}`).join('\n'));
