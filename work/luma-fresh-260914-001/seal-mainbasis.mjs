import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { sealMainBasis } from '../../scripts/mainbasis.mjs';
const root=path.resolve(import.meta.dirname,'../..'), task='work/luma-fresh-260914-001';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
const write=async(p,v)=>fs.writeFile(path.join(root,task,p),JSON.stringify(v,null,2)+'\n');
const inspected=spawnSync(process.execPath,['scripts/mainbasis.mjs','inspect','liveshow-proto'],{cwd:root,encoding:'utf8',maxBuffer:10e6});
if(inspected.status)throw new Error(inspected.stderr);
const current=JSON.parse(inspected.stdout),start=await read(`${task}/mainbasis-start.json`);
const old=new Map([...start.上游,...start.文档].map(x=>[x.路径,x['SHA-256']]));
const mapping=await read(`${task}/mainbasis-source-mapping.json`);
const sources=[...new Set(mapping.map(r=>r.来源路径))];
const risk=await fs.readFile(path.join(root,'liveshow-proto/MainBasis/需求待确认清单.md'),'utf8');
const questions=[...risk.matchAll(/<!-- QUESTION (.+) -->/g)].map(m=>JSON.parse(m[1]));
const files=[];
async function walk(dir){for(const e of await fs.readdir(path.join(root,dir),{withFileTypes:true})){
  if(['.git','.DS_Store'].includes(e.name))continue;const p=`${dir}/${e.name}`;
  if(e.isDirectory())await walk(p);else if(e.isFile()){const b=await fs.readFile(path.join(root,p)),s=await fs.stat(path.join(root,p));files.push({路径:p,'SHA-256':hash(b),大小:b.length,修改时间:s.mtime.toISOString()});}
}}
await walk('liveshow-proto');
const fp=hash(files.sort((a,b)=>a.路径.localeCompare(b.路径,'zh-CN')).map(f=>`${f.路径.slice('liveshow-proto/'.length)}|${f['SHA-256']}`).join('\n'));
const scan={schemaVersion:'1.0',项目目录:'liveshow-proto',扫描模式:'full',扫描状态:'有非阻塞待确认',阻塞项:[],项目指纹:fp,文件清单:files,
  模式依据:'用户要求归档旧缓存，当前上游全新建立，不复用历史语义或用例数据',历史策略:'不读取不比较',
  项目接入基线:{状态:'已确认',路径:'work/liveshow-proto-project-onboarding/latest.json',依据:'保留原项目身份；用户本次明确修改同一 Luma Live 生成流程'},
  缓存清理:{状态:'成功',方式:'原目录归档并核对逐文件哈希',清单:'archive/Luma-Live/260914-001/archive-manifest.json',清理后残留失效文件:[]},
  规则基线:current.上游.filter(r=>!r.路径.startsWith('liveshow-proto/')),
  语义读取记录:sources.map(p=>({路径:p,SHA256:current.上游.find(f=>f.路径===p)['SHA-256'],结论:p.includes('系统概要')?'最高业务规则；明确细则覆盖概括性能力列表':p.includes('/assets/')?'当前公共批注，与结构化批注并列核对；冲突按系统概要裁决或局部隔离':'逐页面、视图和章节核对字段、交互与业务结果',关联规则:mapping.filter(m=>m.来源路径===p).map(m=>m.来源位置)})),
  原型读取说明:'三端 HTML 经当前静态解析器提取控件、状态入口和关联；动态产品行为未执行，演示循环及 Mock 数值不作为确定预期。',
  排除项:[{范围:'app-store-screenshots',原因:'竞品截图，不构成本项目业务规则；本轮非视觉测试'},{范围:'历史原型分析报告、旧扫描和测试生成报告',原因:'只建文件清单，不复用语义结论'},{范围:'旧任务链接和不在活动页面登记中的公共批注页面',原因:'不读取历史任务；未据残留批注新建本期入口'},{范围:'项目说明及早期 SKU 分成任务',原因:'与系统概要明确线下分成职责冲突的内容不采用，原文件保留'}],
  规则缺失复核:questions.map(q=>({问题编号:q.id,检索对象:q.scene,检索词:[q.key,q.module,q.question],已查文件:sources,命中内容:q.known,采用结论:'仅该决策预期待确认，不覆盖其他明确规则',未采用原因:'当前来源未形成唯一决定；选项不是业务事实'})),
  三端关联:['同一入会申请的用户提交、公会初审、平台终审','同一主播权限的平台控制、公会设置和用户端开播','同一直播场次的门票、禁言、踢出、连麦、举报与结束','充值订单退款扣回统一余额，消费及主播收益保留','运营账号由公会创建及发币、平台限额、用户端虚拟送礼','财务上传分成结果，主播和公会读取各自结果']};
await write('global-evidence-scan-result.json',scan);
const targets=files.filter(f=>f.路径.includes('/context/')&&!f.路径.includes('系统概要')||f.路径.includes('/MainBasis/'));
const sync={schemaVersion:'1.0',同步状态:'有非阻塞待确认',阻塞异常:[],需求清单有修改:true,需求清单变更日志编号:['RSL-0034'],文件核对:targets.map(f=>({路径:f.路径,修改前SHA256:old.get(f.路径)||null,修改后SHA256:f['SHA-256'],文件原先不存在:!old.has(f.路径),核对说明:f.路径.includes('MainBasis')?'旧版本已归档；从当前上游新建，有逐条来源映射':'已核对系统概要、全部三端活动页和双批注，删除历史生成附录并回写现行规则；修改前全文已备份'})),
  MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',复核说明:'按共同业务对象和页面逐项汇总；概要明确的申请终态、权限、退款和收益职责优先；同级冲突不按新旧文件日期裁决。已知行为、范围、演示和待确认分开记录。',上游指纹:current.上游指纹,待确认问题:questions.map(q=>q.id),来源映射:mapping}};
await write('prototype-context-sync-result.json',sync);
let destinationTask=task;
try {
 await fs.access(path.join(root,task,'mainbasis-baseline.json'));
 for(let revision=2;;revision++){
  destinationTask=`${task}/requirements-revision-${String(revision).padStart(2,'0')}`;
  try{await fs.access(path.join(root,destinationTask,'mainbasis-baseline.json'));}
  catch(error){if(error.code!=='ENOENT')throw error;break;}
 }
}
catch(error){if(error.code!=='ENOENT')throw error;}
if(destinationTask!==task){
 await fs.mkdir(path.join(root,destinationTask),{recursive:true});
 for(const name of ['mainbasis-start.json','global-evidence-scan-result.json','prototype-context-sync-result.json'])await fs.copyFile(path.join(root,task,name),path.join(root,destinationTask,name));
}
console.log(await sealMainBasis(root,'liveshow-proto',destinationTask));
