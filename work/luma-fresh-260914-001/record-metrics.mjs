import fs from 'node:fs/promises';
import path from 'node:path';
const dir=import.meta.dirname;
const read=async p=>JSON.parse(await fs.readFile(path.join(dir,p),'utf8'));
const first=async p=>(await fs.stat(path.join(dir,p))).birthtime.toISOString();
const last=async p=>(await fs.stat(path.join(dir,p))).mtime.toISOString();
const previous=await read('pipeline-metrics.json');
const basis=await read('requirements-revision-02/mainbasis-baseline.json');
const sourceCount=(await read('mainbasis-start.json')).上游.filter(x=>x.路径.startsWith('liveshow-proto/')).length;
const semanticStart=previous.阶段.find(s=>s.阶段名称==='semantic-read')?.开始时间;
const window=(name,begin,end,input,output,method='文件时间窗口；非阶段独立计时')=>({阶段名称:name,开始时间:begin,结束时间:end,耗时毫秒:Date.parse(end)-Date.parse(begin),输入数量:input,输出数量:output,复用数量:0,统计方式:method});
const data=[
 window('清单与哈希',await first('mainbasis-start.json'),await last('mainbasis-start.json'),sourceCount,1),
 window('semantic-read',semanticStart,basis.同步时间,sourceCount,2433,'起点有计时记录；结束取回补后的需求发布时间，含设计反馈返工及中间等待'),
 window('同步',await first('rebuild-mainbasis.mjs'),basis.同步时间,2433,5),
 window('规则归一化',await first('independent-rule-baseline.json'),await last('independent-rule-baseline.json'),2433,2433),
 window('候选生成与去重',await first('design-account-social.mjs'),await last('admin/semantic-dedup-review.json'),2433,820),
 {阶段名称:'历史比较',开始时间:null,结束时间:null,耗时毫秒:0,输入数量:0,输出数量:0,复用数量:0,统计方式:'未执行：用户明确禁用'},
 window('JSON校验',await last('draft-check.json'),await last('admin/final-gate.json'),820,3),
];
for(const folder of ['user','guild','admin']){
 const m=await read(`${folder}/pipeline-metrics.json`);
 for(const s of m.阶段)data.push({...s,阶段名称:`${folder}/${s.阶段名称}`,统计方式:'该次实际运行计时'});
}
const completed=data.filter(s=>s.开始时间&&Number.isFinite(s.耗时毫秒));
if(completed.some(s=>s.耗时毫秒<0))throw new Error('阶段时间窗口逆序');
await fs.writeFile(path.join(dir,'pipeline-metrics.json'),JSON.stringify({schemaVersion:'1.0',阶段:data,耗时最长阶段:completed.sort((a,b)=>b.耗时毫秒-a.耗时毫秒)[0].阶段名称,说明:'早期阶段未逐一独立计时，已明确标出文件时间窗口；窗口可能重叠，不能相加或据此声称性能优化。Excel阶段为实际运行计时。'},null,2)+'\n');
