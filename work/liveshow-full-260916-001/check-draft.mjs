import fs from 'node:fs/promises';
import {validateTestcaseRecords,loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';
const task='work/liveshow-full-260916-001';
const draft=JSON.parse(await fs.readFile(`${task}/authored-rule-draft.json`,'utf8'));
// Diagnostic projection only. Pending designs are not promoted or exported.
const cases=draft.规则.map((r,i)=>({序号:i+1,用例编号:r.稳定规则标识,功能模块:r.功能模块,功能结构:r.功能结构,用例类型:r.用例设计.用例类型,优先级:r.用例设计.优先级,用例描述:r.用例设计.场景,验证用例子项:r.用例设计.验证子项,前置条件:r.必要条件,操作步骤:r.用例设计.步骤.map(s=>s.操作),预期结果:[r.目标状态或可观察结果],流程编号:r.跨模块流程编号,测试结果:'未测',测试人员:'',备注:[`规则：${r.稳定规则标识}`]}));
const {问题:issues}=validateTestcaseRecords({测试用例:cases,需求待确认:[]},await loadTestcaseLanguageRules());
await fs.writeFile(`${task}/draft-language-check.json`,JSON.stringify({性质:'设计稿诊断，不代表语义审核通过或正式交付',检查时间:new Date().toISOString(),问题:issues},null,2)+'\n');
for(const issue of issues){const rule=draft.规则.find(r=>issue.startsWith(r.稳定规则标识));console.log(`${issue} | ${rule?.用例设计.场景} | ${rule?.目标状态或可观察结果}`);}
console.log(JSON.stringify({数量:cases.length,问题数:issues.length}));
