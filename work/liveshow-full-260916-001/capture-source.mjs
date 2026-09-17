import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {readAnnotations} from '../../scripts/evidence-discovery.mjs';
const task='work/liveshow-full-260916-001';
const start=JSON.parse(await fs.readFile(`${task}/basis/mainbasis-start.json`,'utf8'));
const inventory=await Promise.all(start.上游.map(async f=>({...f,大小:(await fs.stat(f.路径)).size,修改时间:(await fs.stat(f.路径)).mtime.toISOString()})));
await fs.writeFile(`${task}/basis/inventory.json`,JSON.stringify(inventory,null,2)+'\n');
const annotations={};
for(const end of ['user','guild','admin']){
  const file=`liveshow-proto/prototype/annotations/${end}.js`;
  annotations[end]=readAnnotations(await fs.readFile(file,'utf8'));
  const blocks=Object.entries(annotations[end]).map(([key,value],i)=>`## ${i+1}. ${key}\n`+(value.sections||[]).map(s=>`### ${s.t}\n${s.d.join('\n')}`).join('\n'));
  await fs.writeFile(`${task}/basis/${end}-annotations-read.txt`,blocks.join('\n\n')+'\n');
}
await fs.writeFile(`${task}/basis/annotations-current.json`,JSON.stringify(annotations,null,2)+'\n');
const html={};
for(const file of inventory.filter(f=>f.路径.startsWith('liveshow-proto/prototype/pages/')&&f.路径.endsWith('.html')))html[file.路径]=await fs.readFile(file.路径,'utf8');
const parsed=spawnSync('python3',['scripts/parse-prototype-html.py'],{input:JSON.stringify(html),encoding:'utf8',maxBuffer:32*1024*1024});
if(parsed.status!==0)throw new Error(parsed.stderr);
const controls=JSON.parse(parsed.stdout);
await fs.writeFile(`${task}/basis/page-controls.json`,JSON.stringify(controls,null,2)+'\n');
let summaries=[];
for(const [file,source]of Object.entries(html)){
  const scripts=[...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)].map(x=>({attributes:x[1],body:x[2]}));
  const visible=source.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  summaries.push({file,title:source.match(/<title>(.*?)<\/title>/)?.[1],visible,scripts,controls:controls[file]});
}
await fs.writeFile(`${task}/basis/page-evidence-current.json`,JSON.stringify(summaries,null,2)+'\n');
console.log(JSON.stringify({files:inventory.length,pages:summaries.length,annotationPages:Object.fromEntries(Object.entries(annotations).map(([e,a])=>[e,Object.keys(a).length])),controls:Object.values(controls).reduce((s,x)=>s+x.length,0)}));

const probes=[
  ['运营账号登录名','运营账号|登录账号|邮箱登录|naya_ops|nadia_ops'],
  ['邀请奖励','邀请奖励|10 金币|10金币|邀请拉新|邀请.*配置'],
  ['分成上传预览','预览公会|预览.*明细|数据预览|确认上传|uploadForm|createRecord'],
  ['赠送默认数量','默认数量|defaultCount|默认 1|sendCounts'],
  ['幸运礼物RTP','RTP|rtp|actualRtp|单次消耗|独立开奖'],
  ['运营账号平台编辑','编辑资料|重置密码|平台不创建|平台.*只读|平台.*编辑'],
  ['旧入口及历史范围','admin-system-audit|admin-system-parameter|admin-system-permission|my-outfits|操作审计|系统参数'],
  ['收益精度','小数|精度|舍去|舍弃|四舍五入|round|truncate'],
  ['等级及历史','等级|勋章|历史记录|并发|保存失败'],
  ['旧需求独有事项','充值返利|返利金币|手动.*绑定|调整.*绑定|封禁申诉|没收|自动降级|未成年防护|年龄分级|清晰度|横竖屏'],
  ['过程竞争及生命周期','后台运行|切换后台|锁屏|解锁|来电|崩溃|进程|权限撤销|撤销权限|重新连接|断流|重连|处理中|已受理|并发|重复提交|回调'],
  ['运营账号注销登录','注销登录|退出登录|注销账号|运营账号.*设置'],
];
const sourceFiles=inventory.filter(f=>f.路径.startsWith('liveshow-proto/')&&/\.(md|html|js)$/.test(f.路径)&&!f.路径.includes('/workspace/')&&!f.路径.includes('/app-store-screenshots/')&&!f.路径.includes('/context/0')&&!f.路径.includes('annotation-review-changes')&&!f.路径.endsWith('AGENTS.md')&&!f.路径.includes('用户APP原型分析报告'));
const texts=await Promise.all(sourceFiles.map(async f=>({...f,lines:(await fs.readFile(f.路径,'utf8')).split(/\r?\n/)})));
const gap=probes.map(([对象,pattern])=>({对象,检索词:pattern,已查文件:sourceFiles.map(x=>x.路径),命中:texts.flatMap(f=>f.lines.flatMap((l,i)=>new RegExp(pattern,'iu').test(l)?[{路径:f.路径,行:i+1,内容:l,上下文:f.lines.slice(Math.max(0,i-2),i+3).join('\n')}]:[])),结论:'待逐项语义复核，搜索命中或未命中均不自动构成缺失结论'}));
await fs.writeFile(`${task}/basis/gap-probes.json`,JSON.stringify(gap,null,2)+'\n');
console.log(JSON.stringify(gap.map(x=>({对象:x.对象,命中:x.命中.length,来源:x.已查文件.length}))));
