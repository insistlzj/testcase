import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { hash, readAnnotations } from '../../scripts/evidence-discovery.mjs';

const task = 'work/liveshow-full-20260914-190307';
const project = 'liveshow-proto';
const files = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
    if (['.git','.DS_Store','MainBasis'].includes(entry.name)) continue;
    const file = `${dir}/${entry.name}`;
    assert(!entry.isSymbolicLink(), `Unexpanded symlink: ${file}`);
    if (entry.isDirectory()) await walk(file);
    else {
      const data = await fs.readFile(file), stat = await fs.stat(file);
      files.push({路径:file,大小:data.length,修改时间:stat.mtime.toISOString(),'SHA-256':hash(data)});
    }
  }
}
await walk(project);
const excluded = files.filter(f=>f.路径.includes('/app-store-screenshots/')).map(f=>({...f,说明:'竞品应用商店截图，用于视觉参考；不是 Luma Live 当前业务证据，不读取图像内容。'}));
const scan = {schemaVersion:'1.5',项目名称:'Luma Live',项目目录:project,扫描模式:'full',模式依据:['用户要求全新生成；不复用历史业务语义','MainBasis 两文档缺失，须从当前上游重建'],项目接入基线:{状态:'已确认',依据文件:'work/liveshow-proto-project-onboarding/latest.json',核对说明:'本次核对绝对路径与 Git 远程地址均与已确认接入记录一致；沿用用户已确认的系统概要优先和 MainBasis 两文档生成策略'},文件清单:files,不读取内容:excluded,缓存清理:{适用:true,缓存目录:'work/liveshow-proto-global-evidence-cache',旧缓存文件:[],清理数量:0,清理时间:new Date().toISOString(),清理后残留失效文件:[],保留有效层:[],状态:'成功',说明:'实际枚举确认缓存目录不存在；未读取旧任务、旧用例或旧业务缓存'},扫描状态:'进行中',已读取文件:[],复用证据:[],规则缺失复核:[],阻塞项:[]};
assert.equal(await fs.stat(scan.缓存清理.缓存目录).then(()=>true,e=>{if(e.code==='ENOENT')return false;throw e}),false);
await fs.writeFile(`${task}/global-evidence-scan-result.json`,JSON.stringify(scan,null,2)+'\n',{flag:'wx'});
for(const end of ['user','guild','admin']) {
  const file = `${project}/prototype/annotations/${end}.js`, text=await fs.readFile(file,'utf8');
  const annotations=readAnnotations(text), entries=[];
  for(const [page,data] of Object.entries(annotations)) {
    for(const [si,s] of (data.sections||[]).entries()) for(const [ri,raw] of (s.d||[]).entries()) entries.push({标识:`AN-${hash([file,page,si,ri,raw]).slice(0,12)}`,文件:file,页面:page,章节:s.t,位置:`${page}/${s.t}/${ri+1}`,原文:raw});
    for(const [i,anno] of (data.annos||[]).entries())entries.push({标识:`AN-${hash([file,page,'anno',i,anno]).slice(0,12)}`,文件:file,页面:page,章节:'annos',位置:`${page}/annos/${i+1}`,原文:JSON.stringify(anno)});
  }
  await fs.writeFile(`${task}/${end}-annotation-atoms.json`,JSON.stringify(entries,null,2)+'\n',{flag:'wx'});
  let last=''; const lines=[];
  for(const e of entries){const key=`${e.页面} / ${e.章节}`;if(key!==last){lines.push(`\n## ${key}`);last=key;}lines.push(`${e.标识} ${e.原文}`);}
  await fs.writeFile(`${task}/${end}-annotations-reading.md`,lines.join('\n')+'\n',{flag:'wx'});
  console.log(end, Object.keys(annotations).length,entries.length);
}
assert.equal(files.filter(f=>f.路径.includes('/context/')).length,4);
console.log('inventory',files.length,'excluded competitors',excluded.length);
