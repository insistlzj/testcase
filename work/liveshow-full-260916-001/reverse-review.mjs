import fs from 'node:fs/promises';
import {pages,units,task} from './case-design.mjs';
const draft=JSON.parse(await fs.readFile(`${task}/authored-rule-draft.json`,'utf8'));
const bindings=new Map();
for(const observation of draft.观察绑定)for(const ref of observation.来源){if(!bindings.has(ref.单元))bindings.set(ref.单元,[]);bindings.get(ref.单元).push(observation.规则标识);}
const rows=[...pages.values()].flatMap(p=>p.rows.filter(r=>r.kind==='正式规则').map(r=>({端:p.end,模块:p.module,页面:p.key,单元:r.unit,规则:r.id,原文:r.body,关联设计:bindings.get(r.unit)||[],复核:'未复核'})));
const result={说明:'来源条款独立枚举。关联设计只用于导航，不代表整条覆盖；复合条件与结果仍需语义核销。',条款:rows,未关联:rows.filter(r=>!r.关联设计.length)};
await fs.writeFile(`${task}/reverse-review.json`,JSON.stringify(result,null,2)+'\n');
const end=process.argv[2];
if(end){const all=process.argv[3]==='all',start=Number(process.argv[4]||0),limit=Number(process.argv[5]||10000);for(const r of (all?rows:result.未关联).filter(r=>r.端===end).slice(start,start+limit))console.log(`${r.页面} ${r.规则} ${r.原文}${all?'\n  '+r.关联设计.map(id=>{const d=draft.规则.find(x=>x.稳定规则标识===id);return d.用例设计.场景+' → '+d.目标状态或可观察结果;}).join(' / '):''}`);}
else console.log(JSON.stringify(Object.fromEntries(['用户App','公会App','管理后台'].map(end=>[end,{正式条款:rows.filter(r=>r.端===end).length,未关联设计:result.未关联.filter(r=>r.端===end).length}]))));
