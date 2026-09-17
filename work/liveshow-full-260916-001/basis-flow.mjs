import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fingerprint,reviewHash,validateTransfer} from '../../scripts/requirement-traceability.mjs';
import {reviewContext,sealMainBasis} from '../../scripts/mainbasis.mjs';

const task='work/liveshow-full-260916-001',base=`${task}/basis`,project='liveshow-proto';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const write=async(f,x)=>fs.writeFile(f,JSON.stringify(x,null,2)+'\n');
const snapshot=()=>JSON.parse(execFileSync(process.execPath,['scripts/mainbasis.mjs','inspect',project],{encoding:'utf8'}));
const action=process.argv[2];
if(action==='scan'){
  const current=snapshot(),start=await read(`${base}/mainbasis-start.json`);
  const changed=await read(`${base}/context-sync-changes.json`);
  const atoms=(await read(`${base}/source-atoms.json`)).atoms;
  const counts=[];
  for(const file of current.上游.filter(x=>x.路径.startsWith(`${project}/context/`))){
    const text=await fs.readFile(file.路径,'utf8');
    assert.equal(fingerprint(text),file['SHA-256']);
    const ids=[...text.matchAll(/^- \*\*(REQ-[a-f0-9]+)\*\*/gm)].map(x=>x[1]);
    assert.equal(ids.length,new Set(ids).size,'需求标识重复');
    const record=changed.文件.find(x=>x.路径===file.路径);
    if(record){
      assert.equal(record.条目.filter(x=>x.kind!=='结构').length,ids.length,'重读后条目丢失');
      for(const item of record.条目.filter(x=>x.kind!=='结构'))assert(ids.includes(item.requirementId),'重读后来源条目丢失');
      record.修订前原文=record.修改后原文;record.修改后原文=text;record.修改后SHA256=file['SHA-256'];
      record.回读说明='重新读取实际文件；核对每个来源标识仍存在，修订表头、混合待确认条款、概要优先文案和新增范围问题。未依据用例反推需求。';
    }
    counts.push({路径:file.路径,'SHA-256':file['SHA-256'],条目数:ids.length,非空行数:text.split('\n').filter(x=>x.trim()).length});
  }
  const exclusions=[];
  for(const file of current.上游.filter(x=>x.路径.startsWith(project+'/'))){
    let reason;
    if(file.路径.includes('/app-store-screenshots/'))reason='竞品商店截图不是本项目业务依据；当前任务不包含视觉对比。仅清单和哈希，不读取图片内容。';
    else if(/用户APP原型(排查|分析报告)/.test(file.路径))reason='历史生成的分析/排查报告；按用户要求隔离，不读取其中的旧业务结论。';
    else if(/\.(css|svg)$/.test(file.路径)||/移动端原型-配色规范|\/admin-tokens.js$|\/tokens.js$|\/tailwind.js$/.test(file.路径))reason='纯样式、主题或装饰图；SVG标题已核对为直播封面/钻石，无业务流程文字，当前不做视觉用例。';
    else if(/\/(AGENTS|CLAUDE)\.md$|\/\.gitignore$|\/export-admin-prototype\.mjs$|annotation-review-changes\.js$/.test(file.路径))reason='治理、导出工具或修订高亮元数据，不作为业务需求来源。';
    if(reason)exclusions.push({...file,说明:reason});
  }
  const scan={schemaVersion:'1.0',扫描模式:'full',模式依据:'用户整体替换项目，重新从当前来源分析；不复用旧证据语义、规则或用例。',扫描状态:'有非阻塞待确认',阻塞项:[],项目指纹:current.上游指纹,文件清单:current.上游,不读取内容:exclusions,
    失效层清理:[{层:'证据原子及下游',结果:'未发现项目级global-evidence-cache目录；不读取历史任务和旧MainBasis基线内容；无需删除历史快照。'}],
    读取范围:{登记页面:185,物理页面:191,结构化批注文件:['annotations/user.js','annotations/guild.js','annotations/admin.js'],原型旧批注入口:'assets/annotations.js为空兼容入口',原始需求任务:['REQ-001-资料修改风控审核','REQ-002-商品SKU分成规则'],说明:'页面文本和控件及关联交互脚本为静态证据，不代表测试环境运行结果。'},
    语义裁定:`${base}/source-decisions.json`,缺失检索:`${base}/gap-probes.json`,来源原子:`${base}/source-atoms.json`,页面控件:`${base}/page-controls.json`,context回读:counts,
    依赖关系:atoms.filter(x=>x.entry).map(x=>({文件:x.source,页面:x.page,端:x.end,模块:x.module,条目:x.id,入口:x.entry})),
    待确认:'运营登录名、邀请额度、上传预览、默认数量、平台运营编辑、等级边界、未登记系统功能等局部问题，见当前context风险标记。'};
  await write(`${base}/context-sync-changes.json`,changed);await write(`${base}/global-evidence-scan-result.json`,scan);
  await write(`${base}/context-readback.json`,{来源:'独立读取当前磁盘context；不是从生成时内存直接汇总',文件:counts});
  await fs.appendFile('需求清单变更日志.md','\nRSL-0041回读补记：拆出礼物数量的已确认正整数/去重/排序规则；表头改作原型说明；封禁登录文案按系统概要统一；冷静期截止计算与格式争议分离；等级图片含义保留待确认；补充SKU配置入口范围问题。项目说明引用的两份原始需求梳理已读取：资料风控规则与当前概要一致，SKU自动分成不采用为线上结算预期。前后全文与当前哈希保存于本任务basis/context-sync-changes.json。\n');
  console.log(JSON.stringify({回读:counts,排除:exclusions.length}));
}else if(action==='context-map'){
  const units=await read(`${base}/context-units.json`),report=await read(`${base}/context-transfer.json`);
  const changes=await read(`${base}/context-sync-changes.json`),atoms=(await read(`${base}/source-atoms.json`)).atoms;
  const targets=units.目标;const bySource=new Map();
  for(const file of changes.文件)for(const row of file.条目.filter(x=>x.kind!=='结构')){
    const target=targets.find(t=>t.路径===file.路径&&t.原文.includes(`**${row.requirementId}**`));
    assert(target);bySource.set(row.id,target);
  }
  const structure=t=>/^\s*(#|>|来源：|依据：|页面入口：|<!--|-->|```|\|\s*[-:]|\|.*(?:说明|字段|页面).*\|\s*$)/.test(t.原文);
  const same=(u)=>targets.filter(t=>t.原文===u.原文);
  const rulesForPage=p=>atoms.filter(a=>a.entry===p).map(a=>bySource.get(a.id)).filter(Boolean);
  const overview=targets.filter(t=>t.路径.endsWith('/系统概要 .md'));
  const overviewByText=new Map(overview.map(x=>[x.原文,x]));
  for(const [i,u]of units.来源.entries()){
    const r=report.逐项[i];assert.equal(r.来源标识,u.标识);
    let ts=[],status='不适用',why;
    if(u.排除说明)why=u.排除说明;
    else if(overviewByText.has(u.原文)&&u.路径.endsWith('/系统概要 .md')){ts=[overviewByText.get(u.原文)];status='已同步';why='最高业务概要原文保留在context，后续必须逐条进入MainBasis。';}
    else if(u.路径.includes('/annotations/')){
      ts=atoms.filter(a=>a.source===u.路径&&(u.原文.includes(JSON.stringify(a.raw).slice(1,-1))||u.原文.includes(a.raw))).map(a=>bySource.get(a.id)).filter(Boolean);
      if(ts.length){status=ts.every(t=>/【(?:需求|范围)待确认】/.test(t.原文))?'待确认':'已同步';why='当前结构化批注正文逐条承接；系统概要优先差异与局部问题已在目标正文说明。';}
      else why='批注对象键、章节标题、表格标题/分隔或脚本包装；业务正文通过同文件的实际内容行承接。';
    }else if(u.路径.startsWith('同步前:')){
      ts=same(u);if(ts.length){status='已同步';why='同步前条目在当前已核对context中有相同原文。';}
      else{status='已替代';why='派生清单整体重建，旧表述不作为业务证据；按系统概要和当前三端批注重新承接，旧文完整保存于RSL-0041。无来源的旧阈值/流程不延用，范围问题在当前风险条款保留。';}
    }else if(u.路径.includes('/pages/')){
      const pageTargets=rulesForPage(u.路径);
      ts=pageTargets.filter(t=>{const body=t.原文.replace(/^.*?】/,'');return body.length>3&&u.原文.includes(body);});
      if(ts.length){status='已同步';why='页面可见规则文本与当前批注承接内容一致。';}
      else why=pageTargets.length?'当前页面结构、静态示例或交互实现证据；对应页面已有当前批注和入口承接，本行不单独建立额外业务预期。':'未登记页面或由共享页面承载的实现；没有据此新增正式页面范围，范围差异已单列。';
    }else if(u.路径.includes('REQ-001-资料修改风控审核')){
      ts=targets.filter(t=>/【正式规则】/.test(t.原文)&&/头像|昵称/.test(t.原文)&&/检测通过|不合规|不通过/.test(t.原文));status=ts.length?'已同步':'不适用';why='原始资料审核需求与当前系统概要和用户端批注一致，保留自动风控通过/不通过分支，无新增人工审核。';
    }else if(u.路径.includes('REQ-002-商品SKU分成规则')){
      ts=targets.filter(t=>t.原文.includes('**SRC-Q13**'));status='待确认';why='原始需求任务与当前缺少SKU配置入口的范围差异保留；不得替代概要明确的线下结算流程。';
    }else if(u.路径.endsWith('/index.html')){
      ts=targets.filter(t=>t.路径.endsWith('/原型页面目录结构.md')&&(/\|/.test(t.原文))&&[...u.原文.matchAll(/[\w-]+\.html/g)].some(m=>t.原文.includes(m[0])));
      status=ts.length?'已同步':'不适用';why=ts.length?'查看器登记页传递为端/模块/页面目录。':'查看器布局、切换逻辑或页面视图元数据，不是新的业务规则。';
    }else if(u.路径.endsWith('/Luma Live-原型说明.md')&&/dd\/mm|HH\.mm|不补零|小数|脱敏|灰度/.test(u.原文)){
      ts=targets.filter(t=>t.原文.startsWith('- **COMMON-'));status='已同步';why='当前通用格式、展示字段和App灰度边界传入跨页面公共约定；旧业务摘要与概要冲突时已替代。';
    }else if(u.路径.endsWith('/项目说明.md')){status='已替代';why='项目身份和引用入口已读取；业务摘要中的三语、PK、线上提现等与当前概要不一致，采用context系统概要，缺失引用文件不作为有效输入。';}
    else why='当前辅助脚本、Mock、规范或校对说明：用于入口/交互及差异核对，不单独将示例数据、历史描述或代码实现提升为已确认业务规则。明确冲突已在context记录。';
    r.去向=status;r.说明=why;r.目标标识=[...new Set(ts.map(t=>t.标识))];
  }
  const reached=new Set(report.逐项.flatMap(r=>r.目标标识));
  report.目标排除=targets.filter(t=>!reached.has(t.标识)).map(t=>({标识:t.标识,说明:structure(t)?'文档标题、来源定位、入口或目录结构说明，不是独立新增业务规则。':'待检查未映射业务目标'}));
  const unresolved=report.目标排除.filter(x=>x.说明==='待检查未映射业务目标');
  // Do not certify an automatic mapping. The residual business rows require a separate review.
  await write(`${base}/context-transfer.json`,report);
  await write(`${base}/context-unmapped.json`,targets.filter(t=>unresolved.some(r=>r.标识===t.标识)));
  console.log(JSON.stringify({来源:units.来源.length,目标:targets.length,未映射:unresolved.length}));
}else if(action==='context-review'){
  const units=await read(`${base}/context-units.json`),report=await read(`${base}/context-transfer.json`);
  const mapping={
    'SRC-Q04':u=>/admin-gift-send-count-rule-detail\.html$/.test(u.路径)&&/defaultCount/.test(u.原文),
    'SRC-Q09':u=>u.路径.endsWith('/系统概要 .md')&&/注销登录/.test(u.原文),
    'SRC-Q12':u=>u.路径.endsWith('/annotations/user.js')&&/MM\/DD HH:mm/.test(u.原文),
    'SRC-Q10':u=>u.路径.endsWith('/annotations/admin.js')&&/系统参数权限/.test(u.原文),
    'SRC-Q11':u=>u.路径.endsWith('/annotations/admin.js')&&/审计日志仅支持/.test(u.原文),
  };
  for(const t of await read(`${base}/context-unmapped.json`)){
    const key=t.原文.match(/\*\*(SRC-Q\d+)\*\*/)?.[1];
    if(!key){assert.equal(t.原文,'|动作|后果|是否可取消|');report.目标排除.find(r=>r.标识===t.标识).说明='系统概要表格列标题；同行业务数据已逐条承接。';continue;}
    const source=units.来源.find(mapping[key]);assert(source,`风险缺少原始依据${key}`);
    const r=report.逐项.find(r=>r.来源标识===source.标识);
    r.目标标识.push(t.标识);r.去向='待确认';r.说明+='；当前原始文本已核对，补充同级冲突或未登记入口问题，不把问题作为确定预期。';
    report.目标排除=report.目标排除.filter(r=>r.标识!==t.标识);
  }
  assert(!report.目标排除.some(x=>x.说明==='待检查未映射业务目标'));
  report.语义复核={说明:'当前系统概要、三端批注及页面/公共脚本已按角色、入口、动作、结果核对；磁盘回读保留全部2210条批注正文标识，修正已发现的表头、示例值、概要优先差异和混合待确认。74,960个原始非空行仅为传递核销单位，不冒充规则或用例覆盖率。历史派生文案仅用于本次同步删除核对，不进入后续用例输入。',内容SHA256:reviewHash(report)};
  validateTransfer(units.来源,units.目标,report);await write(`${base}/context-transfer.json`,report);
  console.log(await reviewContext(process.cwd(),project,base));
}else if(action==='build-basis'){
  const checkpoint=await read(`${base}/context-checkpoint.json`);
  const current=snapshot();assert.equal(fingerprint(checkpoint.上游),fingerprint(current.上游));
  const formal=['# 统一需求文档','','本版从已逐项核对的当前context独立回读生成。系统概要优先，当前原型与结构化批注补充；问题条款移入配套需求待确认清单。',''];
  const risk=['# 需求待确认清单','','本文件只承接当前证据的冲突、缺口和范围问题，不定义正式业务预期。生成待复核不得伪装成业务待确认。',''];
  const transmission=[];
  for(const file of checkpoint.context){
    const source=await fs.readFile(file.路径,'utf8');assert.equal(fingerprint(source),file['SHA-256']);
    const lines=source.split('\n');let heading='',entry='',riskSource=false;
    formal.push(`<!-- context-source:${file.路径} -->`);
    for(const [i,line]of lines.entries()){
      if(line.startsWith('## '))heading=line;
      if(line.startsWith('页面入口：'))entry=line;
      if(/【(?:需求|范围)待确认】/.test(line)){
        risk.push('',`## ${file.路径}:${i+1}`,heading?`归属：${heading.slice(3)}`:'归属：跨页面规则',entry,line);
        formal.push(`<!-- 风险条款转入需求待确认清单：${file.路径}:${i+1} -->`);
        riskSource=true;transmission.push({来源路径:file.路径,来源行:i+1,目标:'风险',原文:line});
      }else if(riskSource&&/^\s+(来源|依据)：/.test(line)){
        risk.push(line);riskSource=false;transmission.push({来源路径:file.路径,来源行:i+1,目标:'风险',原文:line});
      }else{
        formal.push(line);riskSource=false;if(line.trim())transmission.push({来源路径:file.路径,来源行:i+1,目标:'正式',原文:line});
      }
    }
    formal.push('');
  }
  // Preserve the original pending statements; do not silently collapse distinct product decisions.
  await fs.mkdir(`${project}/MainBasis`,{recursive:true});
  await fs.writeFile(`${project}/MainBasis/统一需求文档.md`,formal.join('\n').trimEnd()+'\n',{flag:'wx'});
  await fs.writeFile(`${project}/MainBasis/需求待确认清单.md`,risk.join('\n').trimEnd()+'\n',{flag:'wx'});
  await write(`${base}/mainbasis-authored-transmission.json`,transmission);
  console.log(JSON.stringify({读取context:checkpoint.context.length,传递正文:transmission.length,风险条款:transmission.filter(x=>x.目标==='风险'&&/待确认】/.test(x.原文)).length}));
}else if(action==='seal'){
  const units=await read(`${base}/mainbasis-units.json`),report=await read(`${base}/mainbasis-transfer.json`);
  const authored=await read(`${base}/mainbasis-authored-transmission.json`);
  for(const [i,u]of units.来源.entries()){
    const expected=authored.find(a=>a.来源路径===u.路径&&a.来源行===u.行);assert(expected,'上下文传递计划缺行');assert.equal(expected.原文,u.原文);
    const target=units.目标.find(t=>t.原文===u.原文&&t.路径.endsWith(expected.目标==='风险'?'需求待确认清单.md':'统一需求文档.md'));
    assert(target,`MainBasis正文遗漏${u.路径}:${u.行}`);
    Object.assign(report.逐项[i],{去向:expected.目标==='风险'?'待确认':'已同步',说明:expected.目标==='风险'?'当前局部问题和依据移入风险清单，不作为确定业务预期。':'独立回读后当前正文完整承接；目录、来源注记不视为业务规则。',目标标识:[target.标识]});
  }
  const reached=new Set(report.逐项.flatMap(r=>r.目标标识));
  report.目标排除=units.目标.filter(t=>!reached.has(t.标识)).map(t=>{
    const duplicate=units.来源.some(s=>s.原文===t.原文);
    assert(duplicate||/^(#|<!--|归属：|页面入口：|本版从|本文件只)/.test(t.原文),`未知新增正文${t.原文}`);
    return{标识:t.标识,说明:duplicate?'源文档重复出现的相同原文；已映射同文首个目标，不是新增业务内容。':'本轮文档标题、传递位置、风险归属或证据边界说明；不新增业务规则。'};
  });
  report.语义复核={说明:'逐项对照当前磁盘context与两份MainBasis，5512个来源单元全部有实际原文去向；24条局部风险与正式业务分离。对照不以已生成用例为分母，不声称解决业务待确认。',内容SHA256:reviewHash(report)};
  validateTransfer(units.来源,units.目标,report);await write(`${base}/mainbasis-transfer.json`,report);
  const current=snapshot(),start=await read(`${base}/mainbasis-start.json`);
  const docs=await Promise.all(['统一需求文档.md','需求待确认清单.md'].map(async n=>{const file=`${project}/MainBasis/${n}`;return{路径:file,'SHA-256':fingerprint(await fs.readFile(file))};}));
  const sync={schemaVersion:'1.0',同步状态:'有非阻塞待确认',阻塞异常:[],需求清单变更日志编号:['RSL-0041'],MainBasis复核:{业务优先级:'系统概要优先，原型和批注补充',复核说明:report.语义复核.说明,上游指纹:current.上游指纹,待确认问题:authored.filter(x=>x.目标==='风险'&&/待确认】/.test(x.原文)),来源映射:authored.filter(x=>/【正式规则】|待确认】/.test(x.原文)).map(x=>({来源路径:x.来源路径,来源SHA256:current.上游.find(f=>f.路径===x.来源路径)['SHA-256'],来源位置:`行${x.来源行}`,目标路径:docs[x.目标==='风险'?1:0].路径,目标原文:x.原文}))},文件核对:[...current.上游.filter(f=>start.同步前派生文本.some(t=>t.路径===f.路径)),...docs].map(f=>({路径:f.路径,修改前SHA256:[...start.上游,...start.文档].find(x=>x.路径===f.路径)?.['SHA-256']||null,修改后SHA256:f['SHA-256'],核对说明:'当前磁盘全文、逐项传递与实际哈希已核对；不使用旧MainBasis或历史用例。'}))};
  await write(`${base}/prototype-context-sync-result.json`,sync);
  await fs.appendFile('需求清单变更日志.md','\nRSL-0041 MainBasis补记：context检查点通过后独立回读5份文件，生成两份MainBasis并逐项核对5512个来源单元。24条风险正文独立隔离；这不是用例覆盖数量。MainBasis原先缺失；本次创建。文档哈希：'+docs.map(d=>`${d.路径} ${d['SHA-256']}`).join('；')+'。回退需撤销本任务基线资格后恢复起始快照，禁止把旧MainBasis直接认定为当前。\n');
  console.log(await sealMainBasis(process.cwd(),project,base));
}else throw new Error('scan | context-map | context-review | build-basis | seal');
