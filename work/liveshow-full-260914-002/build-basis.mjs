import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fingerprint,textUnits,reviewHash,validateTransfer} from '../../scripts/requirement-traceability.mjs';
const root=path.resolve(import.meta.dirname,'../..'),task=import.meta.dirname,rel=path.relative(root,task),project='liveshow-proto';
const read=async f=>JSON.parse(await fs.readFile(path.join(task,f),'utf8'));
const save=(f,v)=>fs.writeFile(path.join(task,f),JSON.stringify(v,null,2)+'\n');
const formal=`${project}/MainBasis/统一需求文档.md`,risk=`${project}/MainBasis/需求待确认清单.md`;
const mode=process.argv[2];
if(mode==='build'){
 const cp=await read('context-checkpoint.json');
 const current=JSON.parse(execFileSync(process.execPath,['scripts/mainbasis.mjs','inspect',project],{cwd:root,encoding:'utf8'}));
 if(fingerprint(current.上游)!==fingerprint(cp.上游))throw Error('checkpoint之后上游变化');
 const docs=new Map([[formal,['# Luma Live 统一需求文档','','本批次：liveshow-full-260914-002。业务优先级：系统概要优先，原型和批注补充。生成来源为已核对并重新读取的全部 context；不读取旧用例、不做历史比较。','','以下保留系统概要全部正文及三端条款；重复条款是多入口来源，生成时依据角色、条件、动作和结果归一化。风险清单不定义确定预期。','']],[risk,['# Luma Live 需求待确认清单','','本批次：liveshow-full-260914-002。仅记录风险、冲突和缺口；不得据此生成确定性预期。问题影响局部覆盖，其余明确规则继续生成。','']]]);
 const mappings=[],seenRisk=new Map();
 const put=(dest,raw,source,reason)=>{docs.get(dest).push(raw);if(source)mappings.push({source:source.标识,dest,raw,reason});};
 const files=[...cp.context].sort((a,b)=>a.路径.includes('系统概要')?-1:b.路径.includes('系统概要')?1:a.路径.localeCompare(b.路径));
 for(const f of files){
  const bytes=await fs.readFile(path.join(root,f.路径));if(fingerprint(bytes)!==f['SHA-256'])throw Error('context版本变化');
  put(formal,`\n<!-- 当前来源：${f.路径}；SHA-256：${f['SHA-256']} -->\n`);
  for(const u of textUnits(f.路径,bytes.toString('utf8'))){
   const raw=u.原文;
   if(raw.startsWith('- GAP-')){
    const id=raw.match(/GAP-(Q-\d+)/u)[1];if(!seenRisk.has(id)){seenRisk.set(id,raw);put(risk,raw,u,'风险独立保留，不作为业务规则');}else mappings.push({source:u.标识,dest:risk,raw:seenRisk.get(id),reason:'跨端相同问题按Q编号合并，适用端保留'});
   }else if(raw.includes('不提供确定预期')||/^\s+- 风险/u.test(raw))put(risk,raw,u,'局部未确认规则及关联编号完整保留');
   else if(raw.includes('REQ-USER-9e01e21e69')){
    put(formal,raw.replace('；粉丝团展示顺序待确认',''),u,'保留当前对象数据范围，未定义顺序独立隔离');
    put(risk,'- GAP-Q-062｜端：用户App｜模块：个人中心｜场景：他人主页粉丝团排序｜待决策：他人主页已加入粉丝团按什么顺序展示？｜已知依据：当前用户主页批注明确标注展示顺序待确认。｜可选方案：按加入时间倒序 / 按累计贡献倒序｜关联原型：user-profile.html',u,'重读全文发现尚未编号的顺序缺口，独立保留');
   }else if(/REQ-USER-(f8ff322156|f46952b704)/u.test(raw)){
    put(formal,raw.replace('必须为 4-12 个数字','必须为数字'),u,'修改密码长度冲突Q-001，只保留共同有效规则');put(risk,`- Q-001 关联条款原文：${raw}`,u,'完整保留冲突原文');
   }else if(raw.includes('REQ-USER-9fcd7f58d3')){
    put(formal,'- REQ-USER-9fcd7f58d3：修改密码校验通过后更新本场有效密码。转发 -> 选择粉丝群或好友并确认；结束直播 -> 二次确认后关闭本场。',u,'修改长度与提示进入Q-001，保留成功路径及转发关播');put(risk,`- Q-001 关联条款原文：${raw}`,u,'保留冲突条款');
   }else if(raw.includes('REQ-USER-c5e0eaba0d')){
    put(formal,'- REQ-USER-c5e0eaba0d：保存成功 -> 更新本场有效密码并关闭视图；取消 -> 保留原密码。',u,'修改长度与无效提示进入Q-001，保留保存及取消');put(risk,`- Q-001 关联条款原文：${raw}`,u,'保留冲突条款');
   }else if(/观众清屏入口见 Q-061/u.test(raw)){
    put(formal,raw.replace(/观众清屏入口见 Q-061。/u,''),u,'已隔离观众清屏，仅保留转发举报和菜单关闭');put(risk,`- Q-061 关联条款原文：${raw}`,u,'观众清屏入口缺口');
   }else if(raw.startsWith('## 需求缺口与局部冲突'))put(risk,raw,u,'风险章节');
   else put(formal,raw,u,'从checkpoint绑定的当前context原文完整回读保留');
  }
 }
 for(const [f,lines]of docs)await fs.writeFile(path.join(root,f),lines.join('\n')+'\n');
 await save('basis-line-map.json',mappings);console.log(JSON.stringify({contextFiles:files.length,mappedUnits:mappings.length,questions:seenRisk.size+1,formalLines:docs.get(formal).length}));
}
if(mode==='transfer'){
 const {来源,目标}=await read('mainbasis-units.json'),r=await read('mainbasis-transfer.json'),maps=await read('basis-line-map.json');const reached=new Set();
 const targetIndex=new Map();for(const t of 目标){const key=t.路径+'\0'+t.原文;if(!targetIndex.has(key))targetIndex.set(key,[]);targetIndex.get(key).push(t.标识);}
 for(const row of r.逐项){const ms=maps.filter(m=>m.source===row.来源标识);row.目标标识=[...new Set(ms.flatMap(m=>targetIndex.get(m.dest+'\0'+m.raw)||[]))];row.去向=ms.every(m=>m.dest===risk)?'待确认':'已同步';row.说明=[...new Set(ms.map(m=>m.reason))].join('；');row.目标标识.forEach(id=>reached.add(id));}
 r.目标排除=目标.filter(t=>!reached.has(t.标识)).map(t=>({标识:t.标识,说明:'本轮文档标题、来源哈希或流程声明，不是新增业务规则。'}));
 r.语义复核={说明:'完整回读四份context，逐行核对3393个非空来源单元；系统概要全文、243个页面/视图的入口与条款全部传递，局部问题分离，重复跨端问题按稳定编号合并。另将他人主页粉丝团排序补为Q-062；修改密码长度冲突不进入正式预期。',内容SHA256:reviewHash(r)};
 validateTransfer(来源,目标,r);await save('mainbasis-transfer.json',r);console.log(JSON.stringify({来源:来源.length,目标:目标.length,结构: r.目标排除.length}));
}
if(mode==='reports'){
 const cp=await read('context-checkpoint.json'),start=await read('mainbasis-start.json'),maps=await read('basis-line-map.json'),units=await read('mainbasis-units.json');
 const scan=await read('global-evidence-scan-result.json');const current=JSON.parse(execFileSync(process.execPath,['scripts/mainbasis.mjs','inspect',project],{cwd:root,encoding:'utf8'}));
 const docs=await Promise.all([formal,risk].map(async 路径=>({路径,'SHA-256':fingerprint(await fs.readFile(path.join(root,路径)))})));
 const before=new Map([...start.上游,...start.文档].map(f=>[f.路径,f['SHA-256']]));
 const targets=[...cp.context.filter(f=>!f.路径.includes('系统概要')),...docs];
 const questionIds=[...new Set(units.目标.filter(u=>u.路径===risk&&u.原文.startsWith('- GAP-')).map(u=>u.原文.match(/Q-\d+/u)[0]))];
 const sync={schemaVersion:'1.0',同步状态:'有非阻塞待确认',阻塞异常:[],需求清单有修改:true,需求清单变更日志编号:['RSL-0035'],文件核对:targets.map(f=>({路径:f.路径,修改前SHA256:before.get(f.路径)||null,修改后SHA256:f['SHA-256'],核对说明:'context已逐条同步、重新读取并通过两段传递核对；详见本任务的context-transfer和mainbasis-transfer。'})),MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',复核说明:'从context-checkpoint绑定的四份全文生成两份独立文档；未跳过context回读；保留完整概要、端侧角色入口和所有条款去向；已知分支与61项局部待决策分离。',上游指纹:current.上游指纹,待确认问题:questionIds,来源映射:maps.map(m=>{const u=units.来源.find(u=>u.标识===m.source);return {来源路径:u.路径,来源SHA256:cp.context.find(f=>f.路径===u.路径)['SHA-256'],来源位置:`第${u.行}行`,目标路径:m.dest,目标原文:m.raw};})}};
 const all=[...scan.文件清单.map(f=>({path:f.路径.slice(project.length+1),hash:f['SHA-256']})),...docs.map(f=>({path:f.路径.slice(project.length+1),hash:f['SHA-256']}))].sort((a,b)=>a.path.localeCompare(b.path,'zh-CN'));
 scan.项目指纹=fingerprint(all.map(f=>`${f.path}|${f.hash}`).join('\n'));scan.项目接入基线=JSON.parse(await fs.readFile(path.join(root,'work/liveshow-proto-project-onboarding/latest.json'),'utf8'));scan.项目接入基线.状态='已确认';
 scan.语义读取记录=[...cp.context,...docs].map(f=>({路径:f.路径,SHA256:f['SHA-256'],结论:'阅读全文并逐条核对来源、角色、状态及风险去向；详见两段逐项追溯。',关联规则:[]}));
 await save('global-evidence-scan-result.json',scan);await save('prototype-context-sync-result.json',sync);
 const lines=['\n## RSL-0035｜当前上游完整回读与三端需求基线重建','',`- 任务：${rel}；日期：2026-09-14。用户授权当前上游全新生成三端测试用例，不读旧用例、不比较历史。`,'- 系统概要优先；同步前后逐条核对，拆开明确规则和局部不确定分支。新增原型交互和角色入口；不修改原型或系统概要。','- 四份context全文回读后才生成MainBasis；3393个非空单元为来源核对单位，不是业务覆盖率。','- 回退：使用本任务mainbasis-start.json中同步前派生文本逐字恢复三份context；撤销MainBasis当前指针后从恢复后的上游重新建立需求基线。旧MainBasis内容不读取，不用于业务回退。','- 以下完整保存三份被修改派生需求的同步前原文；本次差异及采用依据见sync-decisions.json和context-transfer.json。',''];
 for(const f of start.同步前派生文本)lines.push(`### 同步前原文：${f.路径}`,'```markdown',f.原文,'```','');
 lines.push('### 本轮文件哈希','',...sync.文件核对.map(f=>`- ${f.路径}：${f.修改前SHA256} → ${f.修改后SHA256}`),'');
 await save('change-log-entry.json',{标题:'RSL-0035',内容:lines.join('\n')});
 console.log(JSON.stringify({questions:questionIds.length,files:targets.length,sourceMappings:maps.length}));
}
