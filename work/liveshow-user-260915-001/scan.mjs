import fs from 'node:fs/promises';
import path from 'node:path';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {readAnnotations} from '../../scripts/evidence-discovery.mjs';
const task='work/liveshow-user-260915-001';
const start=JSON.parse(await fs.readFile(`${task}/mainbasis-start.json`,'utf8'));
const files=start.上游.filter(x=>x.路径.startsWith('liveshow-proto/'));
const excluded=[];
for(const f of files){
 let reason='';
 if(f.路径.includes('/app-store-screenshots/')) reason='其他产品商店宣传图片，仅作竞品视觉素材，不属于 Luma Live 业务证据';
 else if(/用户APP原型分析报告|原型排查|批注核对清单|批注校对清单|\/todo\.md$/.test(f.路径)) reason='历史分析或核对进度产物，禁用历史语义输入；当前实际原型及批注独立扫描';
 else if(/\/assets\/(?:tailwind\.js|.*\.css|tokens\.js)$/.test(f.路径)) reason='界面样式或样式库，本次不生成视觉用例';
 else if(/\/assets\/.*\.svg$/.test(f.路径)) reason='金币图标或直播封面插画，不定义条件、权限、状态或交互规则';
 if(reason)excluded.push({...f,说明:reason});
 f.文件大小=(await fs.stat(f.路径)).size;f.修改时间=(await fs.stat(f.路径)).mtime.toISOString();
}
const scan={schemaVersion:'1.5',项目名称:'Luma Live',项目目录:'liveshow-proto',项目接入基线:JSON.parse(await fs.readFile('work/liveshow-proto-project-onboarding/latest.json','utf8')),测试范围:{端名:'用户App',模块名称:'全部模块'},扫描模式:'full',模式依据:['用户禁用旧语义缓存；当前 MainBasis 版本已失效；项目缓存目录不存在'],缓存清理:{适用:true,缓存目录:'work/liveshow-proto-global-evidence-cache',旧缓存文件:[],清理数量:0,清理时间:new Date().toISOString(),清理后残留失效文件:[],保留有效层:[],状态:'成功'},文件清单:files,不读取内容:excluded,已读取文件:[],复用证据:[],文件变化:{新增:[],修改:[],删除:[]},规则基线:start.上游.filter(x=>!x.路径.startsWith('liveshow-proto/')),项目指纹:fingerprint(files),依赖关系:[],关联映射:[],规则缺失复核:[],证据缺口:[],阻塞项:[],扫描状态:'进行中'};
await fs.writeFile(`${task}/global-evidence-scan-result.json`,JSON.stringify(scan,null,2)+'\n');
const contexts=await Promise.all(files.filter(x=>x.路径.startsWith('liveshow-proto/context/')).map(async x=>({path:x.路径,text:await fs.readFile(x.路径,'utf8')})));
const atoms=[];
for(const end of ['user','guild','admin']){
 const file=`liveshow-proto/prototype/annotations/${end}.js`,data=readAnnotations(await fs.readFile(file,'utf8'));
 for(const [page,value] of Object.entries(data))for(const s of value.sections){
  for(const [i,line] of s.d.entries()) if(line.trim()){
   const text=line.startsWith('|')?line.split('|').slice(1,-1).map(x=>x.trim()).join('：'):line.replace(/^\d+\.\s*/, '');
   atoms.push({file,page,section:s.t,line:i+1,text,matched:contexts.some(c=>c.text.includes(text))});
  }
 }
}
await fs.writeFile(`${task}/annotation-atoms.json`,JSON.stringify(atoms,null,2)+'\n');
console.log({files:files.length,excluded:excluded.length,atoms:atoms.length,sample:atoms.slice(0,3)});
