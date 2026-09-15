import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fingerprint,reviewHash,validateTransfer} from '../../scripts/requirement-traceability.mjs';
import {reviewContext,prepareBasis,sealMainBasis} from '../../scripts/mainbasis.mjs';
import {finishStage,startStage} from '../../scripts/pipeline-metrics.mjs';
const root=process.cwd(),project='liveshow-proto',task='work/liveshow-user-260915-001';
const read=async n=>JSON.parse(await fs.readFile(`${task}/${n}`,'utf8'));
const write=async(n,v)=>fs.writeFile(`${task}/${n}`,JSON.stringify(v,null,2)+'\n');
const units=await read('context-units.json'),transfer=await read('context-transfer.json');
const sourceMap=new Map(units.来源.map(u=>[u.标识,u]));
const currentHits=new Set(transfer.逐项.filter(r=>!sourceMap.get(r.来源标识).路径.startsWith('同步前:')).flatMap(r=>r.目标标识));
assert(units.目标.filter(t=>/\[(REQ|COMMON)-/.test(t.原文)).every(t=>currentHits.has(t.标识)),'当前规则必须有本次实际上游映射，不能只由同步前context证明');
const unused=await read('annotation-dispositions.json');
assert(unused.every(a=>a.text.startsWith('|')||/进房演示固定|原型以 Toast/.test(a.text)),'存在未解释业务批注');
transfer.语义复核={说明:'执行者已按系统概要、三端完整context及当前批注逐页核对：所有REQ/COMMON具有当前上游映射，非仅同步前文本命中。其余544项为表头/分隔和两条原型演示说明，不定义业务规则。已修正观众结束态的连麦角色歧义、连麦保留收到邀请及退款不回滚收益；公共脚本确认直播记录与充值/黑名单入口。目录为分类元数据，Mock不作为规则。',内容SHA256:reviewHash(transfer)};
validateTransfer(units.来源,units.目标,transfer);
await write('context-transfer.json',transfer);
await finishStage(task,'semantic-read',{输入数量:267,输出数量:2736,复用数量:0,原因:'完整当前需求与批注分析、页面控件及公共依赖核对；追溯草稿初次线性查找耗时后中断，改用索引重跑，计入本阶段总时间'});
await startStage(task,'sync',{输入数量:5});
console.log(await reviewContext(root,project,task));
const checkpoint=await read('context-checkpoint.json');
const contexts=[];
for(const f of checkpoint.context){const text=await fs.readFile(f.路径,'utf8');assert.equal(fingerprint(text),f['SHA-256']);contexts.push({...f,text});}
await write('context-readback.json',{时间:new Date().toISOString(),文件:contexts.map(f=>({路径:f.路径,'SHA-256':f['SHA-256'],非空行数:f.text.split(/\r?\n/).filter(l=>l.trim()).length})),说明:'checkpoint之后重新从磁盘完整读取全部五份context；以下MainBasis仅使用本次回读文本，不复用最初整理的内存结果'});
const overview=contexts.find(f=>f.路径.endsWith('/系统概要 .md'));
const formalPath=`${project}/MainBasis/统一需求文档.md`,riskPath=`${project}/MainBasis/需求待确认清单.md`;
const pending=new Map();
let formal='# Luma Live 统一需求文档\n\n本版从完成上游逐项核对后、从磁盘完整回读的全部 context 生成。系统概要优先，原型和批注补充；不使用旧用例或历史生成附录。含 PENDING 引用的未决分支不定义确定性预期。\n\n## 系统概要（原文）\n\n'+overview.text.trim()+'\n';
for(const c of contexts.filter(f=>/\/0[123]-/.test(f.路径))){
 const lines=[];
 for(const line of c.text.split(/\r?\n/)){
  const id=line.match(/^- \[(PENDING-[^\]]+)\]/)?.[1];
  if(id){if(!pending.has(id))pending.set(id,{line,sources:[]});pending.get(id).sources.push(c.路径);}
  else if(!line.startsWith('## 需求待确认'))lines.push(line);
 }
 formal+='\n## '+path.basename(c.路径,'.md')+'\n\n'+lines.join('\n').trim()+'\n';
}
let risk='# Luma Live 需求待确认清单\n\n仅用于风险和缺口；选项是候选方案，不是正式业务规则。当前未提供产品批准结论，不能据此生成确定性预期。\n';
for(const [id,p] of pending)risk+=`\n## ${id}\n${p.line}\n来源清单：${p.sources.join('；')}\n`;
await fs.writeFile(formalPath,formal);await fs.writeFile(riskPath,risk);
console.log(await prepareBasis(root,project,task));
const basisUnits=await read('mainbasis-units.json'),basisTransfer=await read('mainbasis-transfer.json');
const byText=new Map();
for(const t of basisUnits.目标)(byText.get(t.原文)||byText.set(t.原文,[]).get(t.原文)).push(t);
const bySource=new Map(basisUnits.来源.map(s=>[s.标识,s])),reached=new Set();
for(const row of basisTransfer.逐项){const u=bySource.get(row.来源标识),matches=byText.get(u.原文)||[];row.目标标识=matches.map(t=>t.标识);row.去向=matches.length?(/^- \[PENDING-/.test(u.原文)?'待确认':'已同步'):'不适用';row.说明=matches.length?'按checkpoint后磁盘回读原文逐项传递，风险条目独立进入风险清单':'context文件说明、待确认标题或目录排版，不是额外业务规则；实际业务/风险/目录条目已逐字承接';row.目标标识.forEach(id=>reached.add(id));if(/\[(REQ|COMMON|PENDING)-/.test(u.原文))assert(matches.length,'业务条目不可遗漏');}
basisTransfer.目标排除=basisUnits.目标.filter(t=>!reached.has(t.标识)).map(t=>({标识:t.标识,说明:'汇总文档标题、来源标记或风险使用说明，不是新增业务规则'}));
basisTransfer.语义复核={说明:'全部context业务条目与风险条目逐字传递；概要全文保留；目录由prepare-basis从checkpoint后的当前目录传递。表头与来源说明不计测试覆盖。检查无REQ/COMMON/PENDING条目丢失，风险正文未混作正式预期。',内容SHA256:reviewHash(basisTransfer)};
validateTransfer(basisUnits.来源,basisUnits.目标,basisTransfer);await write('mainbasis-transfer.json',basisTransfer);
const scan=await read('global-evidence-scan-result.json');
const excluded=new Set(scan.不读取内容.map(f=>f.路径));
scan.文件清单=await Promise.all(scan.文件清单.map(async f=>({...f,'SHA-256':fingerprint(await fs.readFile(f.路径))})));
scan.已读取文件=scan.文件清单.filter(f=>!excluded.has(f.路径)).map(f=>({...f,方式:f.路径.includes('/context/')?'全文业务复核及checkpoint回读':f.路径.includes('/annotations/')?'结构化批注逐页逐项复核':f.路径.includes('/prototype/pages/')?'HTML控件结构扫描；当前批注逐页承接业务，相关共享脚本追踪入口':'公共实现、项目引用或结构说明核对；不以演示值定义业务'}));
const controls=await read('prototype-controls.json');
scan.依赖关系=Object.keys(controls).map(file=>({文件:file,依赖:['liveshow-proto/prototype/assets/common.js','liveshow-proto/prototype/assets/mock.js',`liveshow-proto/prototype/annotations/${file.includes('/pages/user/')?'user':file.includes('/pages/guild/')?'guild':'admin'}.js`],说明:'原型页面及当前对应批注；Mock仅提供演示实体，公共规则由系统概要优先承接'}));
scan.关联映射=['账号与登录权限','用户入会及主播认证','公会有效性与开播权限','直播场次及连麦邀请','粉丝团与群成员','真实金币消费与充值退款','虚拟金币与运营账号','礼物及门票收益','任务奖励与等级'].map(业务对象=>({业务对象,关联端:['用户App','公会App','管理后台'],处理:'通过概要与三端当前批注关联，输出范围仅用户App；外部动作作为本端验证所需条件'}));
scan.规则缺失复核=[...pending].map(([id,p])=>({问题标识:id,检索对象:p.line.split('] ')[1].split('：')[0],检索词:p.line.match(/[\u4e00-\u9fffA-Za-z]{2,}/g),已查文件:scan.已读取文件.filter(f=>/\/context\/|\/annotations\/|\/prototype\/pages\/|\/prototype\/assets\/(common|mock|chat-media)\.js/.test(f.路径)).map(f=>f.路径),命中位置:p.sources,命中内容:p.line,采用结论:'当前概要未给出该细节的唯一决定；当前批注缺失或同级表述冲突，保留为待确认，不编造方案为预期',未采用原因:'静态默认值、Mock演示或未经确认的建议不能替代正式业务决定'}));
scan.证据缺口=[...pending.keys()];scan.扫描状态='有非阻塞待确认';scan.阻塞项=[];
scan.说明='此为证据整理完成状态，非用例覆盖完成或产品测试通过；无旧语义缓存、旧用例、历史比较。未运行真实产品。';
await write('global-evidence-scan-result.json',scan);
const start=await read('mainbasis-start.json');
const before=new Map([...start.上游,...start.文档].map(f=>[f.路径,f['SHA-256']]));
const allUpstream=checkpoint.上游;
const mappings=basisTransfer.逐项.filter(r=>r.目标标识.length).map(r=>{const s=bySource.get(r.来源标识),t=basisUnits.目标.find(t=>t.标识===r.目标标识[0]);return{来源路径:s.路径,来源SHA256:checkpoint.context.find(f=>f.路径===s.路径)['SHA-256'],来源位置:`行${s.行}`,目标路径:t.路径,目标原文:t.原文};});
const targets=[...start.同步前派生文本.map(f=>f.路径),formalPath,riskPath];
await write('prototype-context-sync-result.json',{同步状态:'有非阻塞待确认',阻塞异常:[],需求清单变更日志编号:['RSL-0039'],文件核对:await Promise.all(targets.map(async f=>({路径:f,修改前SHA256:before.get(f),修改后SHA256:fingerprint(await fs.readFile(f)),核对说明:'当前来源重新复核；三处业务表述修正；MainBasis取checkpoint之后的context全文，目录及风险分别完整传递'}))),MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',复核说明:transfer.语义复核.说明,上游指纹:fingerprint(allUpstream),待确认问题:[...pending.keys()],来源映射:mappings}});
console.log(await sealMainBasis(root,project,task));
await finishStage(task,'sync',{输入数量:5,输出数量:2,复用数量:0});
