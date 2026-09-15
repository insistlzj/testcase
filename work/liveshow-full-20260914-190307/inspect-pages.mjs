import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {readAnnotations,hash} from '../../scripts/evidence-discovery.mjs';
const dir=import.meta.dirname, project='liveshow-proto', scan=JSON.parse(await fs.readFile(`${dir}/global-evidence-scan-result.json`));
const index=await fs.readFile(`${project}/prototype/index.html`,'utf8');
function literal(name){const start=index.indexOf(`const ${name} = `);assert(start>=0,name);return vm.runInNewContext(`(${index.slice(index.indexOf('{',start),index.indexOf(';\n',start))})`,{}, {timeout:1000});}
const paths=literal('pagePaths'),views={};
function register(items,parent){for(const view of items){views[view.file]={...view,parent};if(view.children)register(view.children,parent);}}
for(const name of ['liveReviewViews','guildReviewViews','staticPageViews'])for(const [parent,items]of Object.entries(literal(name)))register(items,parent);
const texts={};for(const f of scan.文件清单.filter(x=>x.路径.endsWith('.html')))texts[f.路径]=await fs.readFile(f.路径,'utf8');
const parsed=spawnSync('python3',['scripts/parse-prototype-html.py'],{input:JSON.stringify(texts),encoding:'utf8',maxBuffer:64*1024*1024});assert.equal(parsed.status,0,parsed.stderr);
const controls=JSON.parse(parsed.stdout),pages=[];
const moduleNames={auth:'账号与登录',home:'首页与发现',live:'直播',social:'消息与社交',profile:'个人中心','fan-club':'粉丝团',guild:'公会管理',host:'主播管理',wallet:'钱包与充值',approval:'审批管理',people:'主播管理',operations:'运营管理',management:'公会设置',data:'数据与收益',dashboard:'数据看板',user:'用户管理',content:'内容审核',gifts:'礼物与道具',accounts:'运营账号',orders:'订单管理',finance:'财务结算',analytics:'数据报表',system:'系统管理'};
for(const [end,label]of [['user','用户App'],['guild','公会App'],['admin','管理后台']]){
 const annotations=readAnnotations(await fs.readFile(`${project}/prototype/annotations/${end}.js`,'utf8'));
 for(const [key,ann]of Object.entries(annotations)){
  const view=views[key],parent=view?.parent||key,route=paths[parent];assert(route,`No route ${key}`);
  const file=`${project}/prototype/pages/${route}`,html=texts[file];assert(html,`No HTML ${file}`);
  pages.push({key,parent,file,end:label,module:moduleNames[route.split('/')[1]]||route.split('/')[1],name:view?.title||html.match(/<title>([^<]+)/)?.[1]||parent,view:view||null,sections:ann.sections,controls:controls[file],SHA256:hash(html)});
 }
}
const physical=new Set(pages.map(p=>p.file));
const report={pages,files:scan.文件清单.filter(f=>f.路径.endsWith('.html')).map(f=>({...f,active:physical.has(f.路径),controls:controls[f.路径]})),viewerRule:'index.html renderNotes: structured exists => builtIn=[]; annotation-review-changes only adds CSS class and does not override rules'};
await fs.writeFile(`${dir}/page-inventory.json`,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
for(const label of ['用户App','公会App','管理后台']){
 const rows=pages.filter(p=>p.end===label&&!p.view).map(p=>`## ${p.module} / ${p.name} / ${p.key}\n${p.controls.map(c=>`${c.line}: ${c.name.replace(/\s+/g,' ').slice(0,180)}${c.attrs.href?' -> '+c.attrs.href:''}${c.attrs.onclick?' { '+c.attrs.onclick+' }':''}`).join('\n')}`);
 await fs.writeFile(`${dir}/${label}-controls-reading.md`,rows.join('\n\n')+'\n',{flag:'wx'});
}
console.log(JSON.stringify({pages:pages.length,physical:physical.size,html:Object.keys(texts).length,unmappedHTML:report.files.filter(f=>!f.active).map(f=>f.路径),controls:Object.values(controls).reduce((n,a)=>n+a.length,0)},null,2));
