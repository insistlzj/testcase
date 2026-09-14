import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {collectScopeEvidence} from '../../scripts/liveshow-scope-evidence.mjs';
import {readAnnotations,hash} from '../../scripts/evidence-discovery.mjs';
const root=path.resolve(import.meta.dirname,'../..'),task=import.meta.dirname;
const save=(name,value)=>fs.writeFile(path.join(task,name),JSON.stringify(value,null,2)+'\n');
const models=[];
for(const [end,name] of [['用户App','user'],['公会App','guild'],['管理后台','admin']]){
  const source=await collectScopeEvidence(root,end),file=`liveshow-proto/prototype/annotations/${name}.js`;
  const text=await fs.readFile(path.join(root,file),'utf8'),annotations=readAnnotations(text),records=[];
  for(const [page,entry]of Object.entries(annotations))for(const section of entry.sections||[])for(const raw of section.d||[]){
    if(/^\|\s*[-:]+\s*\|/.test(raw))continue;
    records.push({id:`SRC-${hash([file,page,section.t,raw]).slice(0,12)}`,end,page,section:section.t,text:raw,file});
  }
  models.push({end,name,pages:source.pages,elements:source.elements,records,dependencies:source.dependencies});
}
const publicFile='liveshow-proto/prototype/assets/annotations.js',box={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,publicFile),'utf8'),box,{timeout:1500});
const orphan=[];
for(const [page,items]of Object.entries(box.window.LUMA_ANNOTATIONS)){
  const model=models.find(m=>m.pages[page]);
  if(!model){orphan.push({page,items});continue;}
  for(const [section,text]of items)model.records.push({id:`SRC-${hash([publicFile,page,section,text]).slice(0,12)}`,end:model.end,page,section,text,file:publicFile});
}
await save('current-upstream.json',{models,unmappedPublic:orphan});
console.log(JSON.stringify(models.map(m=>({end:m.end,pages:Object.keys(m.pages).length,records:m.records.length,elements:m.elements.length}))));
console.log('publicWithoutPage',orphan.map(x=>x.page));
