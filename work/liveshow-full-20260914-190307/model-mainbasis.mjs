import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {extractSourceRules,hash} from '../../scripts/evidence-discovery.mjs';
import {finishStage,startStage} from '../../scripts/pipeline-metrics.mjs';
const task='work/liveshow-full-20260914-190307';
const file='liveshow-proto/MainBasis/统一需求文档.md',text=await fs.readFile(file,'utf8'),pages={},entries=[],requirements=[];
let end='',module='',name='',key='',section='';
for(const [i,line] of text.split('\n').entries()){
 let m;
 if(m=line.match(/^## (用户App|公会App|管理后台)当前需求清单/))end=m[1];
 else if(m=line.match(/^## (.+) \/ (.+)$/)){module=m[1];name=m[2];}
 else if(m=line.match(/^页面：([^；]+)；实际承载：([^；]+)；(.+)$/)){
  key=`${end}:${m[1]}`;
  const role=end==='公会App'?'公会长':end==='管理后台'?(/结算|账|资金|报表|订单/.test(module)?'财务管理员':/审核|风控|举报|处置|违规/.test(module)?'审核管理员':'平台管理员'):/host-|start-live|live-data|live-records|income-sharing|live-end|anchor|room-manage|group-manage|fan-club-settings|fan-member-manage|moderator|visible-fan/.test(m[1])?'主播':/audience.*(?:manager|moderator)|room-admin/.test(m[1])?'房管':'用户';
  let actor=role;
  if(end==='用户App'){
   actor=/^(?:live-room-host|live-room-cohost-active|live-end-host|host-center(?!-pending)|moderator-management|host-guild-notifications|start-live-settings|fan-list|fan-club(?:-|\.)|live-data|live-records|income-sharing|guild-leave-application|group-manage-owner)|^views\/(?:live-room-host|live-room-cohost-active|start-live-settings|live-data|fan-club)\//.test(m[1])?'主播':'用户';
   if(/^views\/live-room\/profile-moderator/.test(m[1]))actor='房管';
  }
  if(end==='管理后台'&&module==='运营账号')actor='平台管理员';
  pages[key]={key,原型页面:m[1],name,module,endName:end,role:actor,object:name,file:m[2],view:m[3],sourceLine:i+1,preconditions:[`${actor}账号已登录`],steps:[`打开${name}`]};
 }else if(m=line.match(/^- \[(REQ-[^\]]+)\] (.+)〔来源：([^；]+)；([^；]+)；(.+)〕$/)){
  assert(pages[key]);const [,id,body,atom,source,position]=m;
  const fieldPart=body.indexOf('：');const isField=/字段/.test(position.split('/')[1])&&fieldPart>0&&fieldPart<35;const field=isField?body.slice(0,fieldPart):'';
  const semantic=isField?body.slice(fieldPart+1):body;
  const r={id,end,module,page:key,field,body:semantic,line:i+1,raw:line,section:position.split('/')[1]};requirements.push(r);
  entries.push({page:key,position:`第 ${i+1} 行；${id}`,text:line,semanticText:field?`| ${field} | ${semantic} |`:semantic,section:r.section});
 }
}
assert.equal(requirements.length,2008);
// Current MainBasis is the sole business source. Page paths are provenance inside that document, never reopened here.
const catalog=extractSourceRules([{path:file,sha256:hash(text),priority:1,kind:'requirement',entries:entries.map(e=>({...e,text:e.semanticText,semanticText:undefined}))}],pages);
for(const r of catalog.规则)for(const s of r.来源){const n=Number(s.位置.match(/第 (\d+)/)[1]);s.原文=text.split('\n')[n-1];}
await fs.writeFile(`${task}/mainbasis-model.json`,JSON.stringify({formal:{路径:file,SHA256:hash(text)},pages,requirements,parsed:catalog},null,2)+'\n');
await fs.writeFile(`${task}/mainbasis-pages-reading.txt`,Object.values(pages).map(p=>`${p.endName}\t${p.原型页面}\t${p.name}\t${p.role}\t${p.module}`).join('\n')+'\n');
const types={};for(const r of catalog.规则)types[r.模型.类型]=(types[r.模型.类型]||0)+1;
console.log({pages:Object.keys(pages).length,requirements:requirements.length,clauses:catalog.规则.length,types});
if(process.argv.includes('--start')){
 await finishStage(task,'semantic-read',{输入数量:266,输出数量:2008});await finishStage(task,'sync',{输入数量:3082,输出数量:3098});await startStage(task,'normalize-rules',{输入数量:2008});
}
