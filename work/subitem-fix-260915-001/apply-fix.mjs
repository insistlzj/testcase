import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {casesFromCatalog,ruleDesignHash,validateRuleDesign} from '../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules,validateTestcaseRecords} from '../../scripts/validate-testcase-json.mjs';

const task='work/liveshow-user-260915-001/user', repair='work/subitem-fix-260915-001';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const original=await read(`${repair}/before/${task}/final-testcases.json`);
const catalog=await read(`${repair}/before/${task}/business-rule-catalog.json`);
const draft=await read(`${repair}/before/${task}/rule-design-review-draft.json`);
const basis=await read(`${task}/basis-index.json`);
for(const source of basis.输入) assert.equal(fingerprint(await fs.readFile(source.路径)),source['SHA-256'],'本次需求内容已变化，不能进行仅子项修订');
const rows=(await fs.readFile(`${repair}/corrections.tsv`,'utf8')).trim().split('\n').slice(1).map(row=>row.split('\t'));
const amendments=new Map(rows);
assert.equal(amendments.size,rows.length,'修正清单编号重复');
const caseByRule=new Map(original.测试用例.map(c=>[c.备注.find(n=>n.startsWith('规则：')).slice(3),c]));
const changes=[];
for(const [id,label] of amendments) {
  const c=original.测试用例.find(c=>c.用例编号===id);
  assert(c && label?.trim(),`修正目标不存在或子项为空：${id}`);
  assert.notEqual(c.验证用例子项,label,`没有发生修正：${id}`);
  changes.push({用例编号:id,原子项:c.验证用例子项,新子项:label,用例描述:c.用例描述,操作步骤:c.操作步骤,预期结果:c.预期结果});
}
const subitems={schemaVersion:'1.0',说明:'本轮子项逐项设计；沿用经本次筛查含义相符的子项，修正清单中的错配。键绑定当前页面、角色、条件、操作及结果，缺项或契约变化必须重新填写；不得由关键词补值。',逐项:{}};
for(const r of draft.规则) {
  const c=caseByRule.get(r.稳定规则标识);
  const label=amendments.get(c?.用例编号)||r.用例设计.验证子项;
  const page=r.证据引用.find(e=>e.原文?.startsWith('页面：'))?.原文.match(/^页面：([^；]+)/)?.[1];
  assert(page,'缺少原始页面或视图标识');
  const contract=[page,r.执行角色,r.必要条件,r.用例设计.步骤.map(s=>s.操作),r.目标状态或可观察结果];
  assert.equal(`BR-${fingerprint(contract).slice(0,16)}`,r.稳定规则标识,'规则契约与稳定标识不一致');
  subitems.逐项[r.稳定规则标识]={验证子项:label,契约SHA256:fingerprint(contract)};
  r.用例设计.验证子项=label;
}
for(const r of catalog.规则) {
  const c=caseByRule.get(r.稳定规则标识),label=amendments.get(c.用例编号);
  if(!label) continue;
  r.用例设计.验证子项=label;
  r.设计复核={...r.设计复核,说明:`${r.设计复核.说明}\n本次子项修订：${label}；结合本条${r.用例设计.步骤.map(s=>s.操作).join('、')}及预期“${r.目标状态或可观察结果}”核对唯一维度。其余设计字段不变，未重新声明业务覆盖。`,设计SHA256:ruleDesignHash(r)};
}
const revised={...original,测试用例:casesFromCatalog(catalog,{moduleDirectory:basis.模块目录})};
assert.equal(revised.测试用例.length,original.测试用例.length);
for(const [i,c] of revised.测试用例.entries()) {
  const expected={...original.测试用例[i],验证用例子项:amendments.get(c.用例编号)||original.测试用例[i].验证用例子项};
  assert.deepEqual(c,expected,'子项以外的字段发生变化');
}
const language=await loadTestcaseLanguageRules();
const designIssues=catalog.规则.flatMap(r=>validateRuleDesign(r,language).map(issue=>`${r.稳定规则标识}：${issue}`));
assert.deepEqual(designIssues,[]);
const validation=validateTestcaseRecords(revised,language);
assert.deepEqual(validation.问题,[]);
const finalText=JSON.stringify(revised,null,2)+'\n';
const dedup=await read(`${repair}/before/${task}/semantic-dedup-review.json`);
dedup.候选SHA256=fingerprint(finalText);
for(const row of dedup.复核结果) {
  const r=catalog.规则.find(r=>r.稳定规则标识===row.稳定规则标识);
  row.归一化业务键=`${r.功能模块}|${r.用例设计.观察页面路径}|${r.执行角色}|${r.用例设计.验证子项}`;
}
const save=async(file,value)=>fs.writeFile(file,JSON.stringify(value,null,2)+'\n');
await save(`${task}/subitem-design.json`,subitems);
await save(`${task}/rule-design-review-draft.json`,draft);
await save(`${task}/business-rule-catalog.json`,catalog);
await save(`${task}/semantic-dedup-review.json`,dedup);
await fs.writeFile(`${task}/current-testcase-candidate.json`,finalText);
await fs.writeFile(`${task}/final-testcases.json`,finalText);
const manifest=await read(`${repair}/before/${task}/generation-input-manifest.json`);
const changed=['compile-design.mjs','prepare-delivery.mjs','rule-design-review-draft.json','business-rule-catalog.json','semantic-dedup-review.json','current-testcase-candidate.json','final-testcases.json'];
for(const name of changed) {
  const entry=manifest.输入文件.find(e=>e.路径===`${task}/${name}`);assert(entry,name);
  entry['SHA-256']=fingerprint(await fs.readFile(entry.路径));
}
manifest.输入文件.push({路径:`${task}/subitem-design.json`,'SHA-256':fingerprint(await fs.readFile(`${task}/subitem-design.json`)),角色:'本次派生产物',内容类型:'本轮独立需求解析与设计',允许定义业务规则:false});
await save(`${task}/generation-input-manifest.json`,manifest);
await save(`${repair}/revision-check.json`,{状态:'子项修订检查通过',范围:'当前交付版本的验证用例子项，不是从新上游重新生成',检查时间:new Date().toISOString(),检查条数:original.测试用例.length,修改条数:changes.length,其他用例字段变化数:0,待确认变化数:0,结构及语言检查:validation,设计检查问题:designIssues,原候选SHA256:fingerprint(await fs.readFile(`${repair}/before/${task}/final-testcases.json`)),候选SHA256:fingerprint(finalText),MainBasis文档:basis.输入,覆盖结论:'沿用部分覆盖、等待业务确认；未重跑或刷新上游同步基线',逐项修正:changes});
console.log({检查:original.测试用例.length,修正:changes.length,子项之外变化:0,语言与结构:validation.状态});
