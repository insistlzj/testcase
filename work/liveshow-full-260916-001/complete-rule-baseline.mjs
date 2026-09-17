import fs from 'node:fs/promises';
import {formalPath,formalHash,units,task,pages} from './case-design.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
// Source-only supplement: no testcase, draft, scene or previous coverage is consulted.
const text=await fs.readFile(formalPath,'utf8'),lines=text.split('\n');
const summaryStart=lines.findIndex(s=>s==='<!-- context-source:liveshow-proto/context/系统概要 .md -->')+1;
const examplesStart=lines.findIndex(s=>s.includes('资金充值到分成示例'))+1;
const examplesEnd=lines.findIndex((s,i)=>i+1>examplesStart&&s.includes('3\\.7 运营账号'))+1;
const excluded=[];const rules=[];let section='';
for(const u of units){
 const s=u.原文.trim();
 if(u.行<summaryStart&&!s.includes('**COMMON-'))continue;
 if(s.startsWith('#')){section=s.replace(/^#+\s*/, '');excluded.push({来源单元:u.标识,说明:'系统概要章节标题；正文另行核对。'});continue;}
 if(s.startsWith('<!--')||/^\|\s*[-:]/.test(s)||s.startsWith('|')&&/^\|\s*[-:]/.test(lines[u.行]||'')){
  excluded.push({来源单元:u.标识,说明:'来源标记、表头或表格分隔符；不是具体业务条款。'});continue;
 }
 if(/^\*\*.*[：:]\*\*$/.test(s)||/^- (公会创建|公会状态|公会长账号|公会长账号状态|平台、公会对主播开播权限的管理规则)：$/.test(s)){
  excluded.push({来源单元:u.标识,说明:'下级正文或表格的引导标题；不单独定义可验证结果。'});continue;
 }
 if(u.行>examplesStart&&u.行<examplesEnd){excluded.push({来源单元:u.标识,说明:'资金分配算例，不把50%/10%/40%或样例汇率升级为线上结算规则；正式系统仅上传线下结果。'});continue;}
 const id=s.match(/\*\*(COMMON-[^*]+)\*\*/)?.[1]||`COMMON-${fingerprint([u.行,s]).slice(0,12)}`;
 const ends=id.startsWith('COMMON-user')?['用户App']:id.startsWith('COMMON-guild')?['公会App']:id.startsWith('COMMON-admin')?['管理后台']:['用户App','公会App','管理后台'];
 rules.push({来源单元:u.标识,标识:id,端:ends,页面:'公共业务规则',章节:section,原文:s,结果基线:s.split(/<br\s*\/?>|[；;]/).filter(Boolean).map((v,i)=>({标识:`${id}-R${i+1}`,来源片段:v,结果说明:v,状态:'待逐项核销'}))});
}
await fs.writeFile(`${task}/independent-common-baseline.json`,JSON.stringify({schemaVersion:'1.0',来源:{路径:formalPath,'SHA-256':formalHash},说明:'从当前MainBasis重新独立枚举公共正文和系统概要业务表格；端侧适用性与场景仍逐项判断。',规则:rules,结构排除:excluded},null,2)+'\n');
console.log(JSON.stringify({公共条款:rules.length,结构排除:excluded.length}));
