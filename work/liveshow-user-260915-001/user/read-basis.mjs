import fs from 'node:fs/promises';
import {fingerprint} from '../../../scripts/requirement-traceability.mjs';
import {readModuleDirectory} from '../../../scripts/prototype-directory.mjs';
const task='work/liveshow-user-260915-001/user';
const paths=['liveshow-proto/MainBasis/统一需求文档.md','liveshow-proto/MainBasis/需求待确认清单.md'];
const texts=await Promise.all(paths.map(async 路径=>({路径,text:await fs.readFile(路径,'utf8')})));
const directory=readModuleDirectory(texts[0].text),requirements=[],pages={};
let end='',section='',page='',pagePath='';
for(const [i,line] of texts[0].text.split(/\r?\n/).entries()){
 if(/^## 0[123]-/.test(line)){end=line.includes('01-')?'用户App':line.includes('02-')?'公会App':'管理后台';page='';}
 if(/^## /.test(line))section=line.slice(3);
 const pm=line.match(/^页面：([^；]+)；实际承载：([^；]+)；/);
 if(pm){page=pm[1];pagePath=pm[2];if(end==='用户App')pages[page]={page,path:pagePath,section,name:section.split(' / ').at(-1),module:directory.页面.find(p=>p.页面路径===pagePath)?.功能模块,entry:{路径:paths[0],位置:`行${i+1}`,原文:line,'SHA-256':fingerprint(texts[0].text)}};}
 const id=line.match(/^- \[((?:REQ|COMMON|META)-[^\]]+)\] (.+)$/);
 if(id)requirements.push({id:id[1],end,page,pagePath,section,text:id[2].split('〔')[0].trim(),source:{路径:paths[0],位置:`行${i+1}`,原文:line,'SHA-256':fingerprint(texts[0].text)},unitId:fingerprint([paths[0],i+1,line])});
}
const data={schemaVersion:'1.0',输入:texts.map(f=>({路径:f.路径,'SHA-256':fingerprint(f.text)})),模块目录:directory,页面:pages,条款:requirements,说明:'只解析本次当前两份MainBasis；原始条款分母先于场景建立，尚未声明任何条款已覆盖'};
await fs.writeFile(`${task}/basis-index.json`,JSON.stringify(data,null,2)+'\n');
const args=process.argv.slice(2);
for(const p of args){console.log('\n'+p);console.log(requirements.filter(r=>r.end==='用户App'&&(r.page===p||r.page.startsWith(`views/${p.replace('.html','')}/`))).map(r=>r.id+' '+r.text).join('\n'));}
console.log({页面:Object.keys(pages).length,用户条款:requirements.filter(r=>r.end==='用户App').length,正式需求SHA256:data.输入[0]['SHA-256']});
