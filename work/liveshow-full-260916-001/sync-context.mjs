import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';

const task='work/liveshow-full-260916-001',project='liveshow-proto';
if(process.argv.includes('--record-heading-fix')){
  const file=`${task}/basis/context-sync-changes.json`, report=JSON.parse(await fs.readFile(file,'utf8'));
  for(const row of report.文件){
    const current=await fs.readFile(row.路径,'utf8');
    const strip=text=>text.split('\n').filter(l=>!l.startsWith('## ')&&!l.startsWith('页面入口：')&&l.trim()).join('\n');
    assert.equal(strip(current),strip(row.修改后原文),'修复超出页面归属标题范围');
    assert.equal(current.split('\n').filter(l=>l.startsWith('## ')).length-2,new Set(row.条目.map(x=>x.page)).size);
    row.标题修复前SHA256=row.修改后SHA256;row.修改后原文=current;row.修改后SHA256=fingerprint(current);
  }
  await fs.writeFile(file,JSON.stringify(report,null,2)+'\n');
  const log=await fs.readFile('需求清单变更日志.md','utf8');
  await fs.writeFile('需求清单变更日志.md',log+'\nRSL-0041补记：修复以字段表开始的页面未写入归属标题的问题；业务正文不变。当前标题与批注键逐一核对为用户128、公会33、后台90个，含同页视图及已隔离的未登记页面，不代表独立页面数。最终哈希：\n'+report.文件.map(x=>`- ${x.路径}：${x.修改后SHA256}`).join('\n')+'\n');
  console.log('已记录仅页面标题修正后的实际文本和哈希');process.exit(0);
}
const start=JSON.parse(await fs.readFile(`${task}/basis/mainbasis-start.json`,'utf8'));
const source=JSON.parse(await fs.readFile(`${task}/basis/source-atoms.json`,'utf8'));
const decisions=JSON.parse(await fs.readFile(`${task}/basis/normalization-decisions.json`,'utf8'));
const names={user:'01-用户主播App-项目需求清单.md',guild:'02-公会App-项目需求清单.md',admin:'03-管理后台-项目需求清单.md'};
const ends={user:'用户App',guild:'公会App',admin:'管理后台'};
const reports=[];
const known=new Set(source.atoms.map(x=>x.id));
for(const id of [...decisions.说明条目,...decisions.风险条目,...Object.keys(decisions.替换)])assert(known.has(id),`裁定引用失效${id}`);

for(const[end,name]of Object.entries(names)){
  const target=`${project}/context/${name}`;
  const before=start.同步前派生文本.find(x=>x.路径===target);
  assert.equal(await fs.readFile(target,'utf8'),before.原文,'派生清单被其他操作修改，禁止覆盖');
  const lines=[`# ${ends[end]}项目需求清单`,'','> 当前系统概要优先，原型页面及结构化批注补充。带“需求待确认”标记的原文仅保留问题证据，不构成确定业务预期。', '> 同页视图归入所属页面；测试用例的功能模块取原型页面目录结构。',''];
  const details=[];
  let previousPage;
  for(const atom of source.atoms.filter(x=>x.end===end)){
    const id=`REQ-${fingerprint([atom.source,atom.page,atom.section,atom.raw]).slice(0,12)}`;
    let value=decisions.替换[atom.id]||atom.value;
    const structure=/^\|\s*(字段|字段\/控件|字段 \/ 控件|操作|指标|项目)\s*\|/.test(value)||/^\|[\s|:-]+\|$/.test(value);
    if(previousPage!==atom.page){
      lines.push(`## ${atom.module||'未登记页面'} / ${atom.pageName} / ${atom.page}`,`页面入口：${atom.entry||'当前查看器未登记，不能推定正式入口。'}`,'');
      previousPage=atom.page;
    }
    if(structure){details.push({...atom,requirementId:id,kind:'结构',value});continue;}
    let kind=decisions.说明条目.includes(atom.id)?'原型说明':decisions.风险条目.includes(atom.id)?'需求待确认':!atom.entry?'范围待确认':'正式规则';
    const conflict=decisions.源内冲突.find(x=>x.端===end&&x.页面===atom.page&&atom.raw.includes(x.片段));
    if(conflict)kind='需求待确认';
    value=value.replace(/^\|\s*/,'').replace(/\s*\|$/,'').replace(/\s*\|\s*/g,'：');
    lines.push(`- **${id}** 【${kind}】${value}`,`  来源：${atom.source}；${atom.page}；${atom.section}；${atom.id}${atom.裁定依据?`；采用${atom.裁定依据}`:''}${conflict?`；${conflict.问题} ${conflict.说明}`:''}`);
    details.push({...atom,requirementId:id,kind,value,...(conflict?{问题:conflict.问题}:{}),context:target});
  }
  lines.push('','## 跨页面公共约定','');
  for(const[itemIndex,item]of decisions.全局规则补充.filter(x=>x.端===end).entries()){
    lines.push(`- **COMMON-${end}-${itemIndex+1}** 【正式规则】${item.规则}`,`  来源：${project}/${item.来源}`);
  }
  lines.push('','## 来源差异和范围问题','');
  for(const item of decisions.来源补充问题.filter(x=>x.端===end))lines.push(`- **${item.编号}** 【需求待确认】${item.问题}`,`  依据：${item.依据}`);
  const after=lines.join('\n')+'\n';
  assert.equal(lines.filter(l=>l.startsWith('## ')&&!['## 跨页面公共约定','## 来源差异和范围问题'].includes(l)).length,new Set(details.map(x=>x.page)).size,'每个批注页必须有入口归属');
  reports.push({路径:target,修改前SHA256:fingerprint(before.原文),修改后SHA256:fingerprint(after),修改前原文:before.原文,修改后原文:after,条目:details,日志编号:'RSL-0041'});
}
// Preserve the full replaced text and recovery instructions before modifying the whitelist.
const logPath='需求清单变更日志.md',log=await fs.readFile(logPath,'utf8');
assert(!/^## RSL-0041[｜|]/m.test(log),'日志编号已存在');
const entry=['','## RSL-0041｜原型整体替换后的当前需求重建','',
  '- 任务：work/liveshow-full-260916-001；用户明确要求替换原型后重新生成三端。继续采用系统概要优先、原型与当前批注补充、用例阶段仅两份MainBasis、全新生成且禁用历史比较。',
  '- 恢复被替换项目缺失的需求来源策略.json和原型页面目录；此为此前授权的既有项目接入配置，不是批准新的业务规则。',
  '- 本次根据185个查看器登记页面、三端结构化批注和当前系统概要重建三份派生清单。6个未登记物理页面单独核对；未将其自动添加成正式模块。',
  '- 明确纠正：线上结算申请/审批、真实用户标记运营账号、虚拟金币参与榜单、幸运礼物按净消耗计收益、平台锁定期间简单取公会开关、运营账号进入装扮等旧口径。依据和原文见本任务basis/source-decisions.json、source-atoms.json和normalization-decisions.json。',
  '- 旧派生内容的充值返利、手动邀请绑定、封禁申诉与没收、自动降级、年龄防护、清晰度/横竖屏等细节，已按对象和同义词检索227份当前关联文本，未命中；不据旧派生清单补造当前功能。当前仍存在的账号、邀请、直播、等级等主体功能保留。收益小数、入口范围、同级来源冲突另作风险核对，不以旧值填补。检索范围、位置和上下文：basis/gap-probes.json。',
  '- 本记录是需求同步记录，不代表MainBasis已通过或用例完整交付。后续必须从磁盘回读全部context并逐项完成两段传递。',
  '- 回退：先核对当前文件哈希，按下列完整修改前原文仅恢复相应派生文件；目录创建前后内容见basis/prototype-directory-sync.json。策略文件恢复前为缺失，回退应撤销本次新建且同时撤销该基线资格。不得恢复历史用例为输入；MainBasis须从回退后的当前context重新核对生成。',''];
for(const r of reports)entry.push(`### ${r.路径}`,`修改前SHA256：${r.修改前SHA256}`,`修改后SHA256：${r.修改后SHA256}`,'修改前完整原文：','````markdown',r.修改前原文.trimEnd(),'````','');
await fs.writeFile(logPath,log.trimEnd()+'\n'+entry.join('\n')+'\n');
for(const report of reports)await fs.writeFile(report.路径,report.修改后原文);
await fs.writeFile(`${task}/basis/context-sync-changes.json`,JSON.stringify({schemaVersion:'1.0',状态:'已写入待两段传递核对',日志编号:'RSL-0041',文件:reports},null,2)+'\n');
console.log(JSON.stringify(reports.map(x=>({路径:x.路径,条目:x.条目.length,修改后SHA256:x.修改后SHA256}))));
