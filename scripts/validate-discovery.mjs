import fs from 'node:fs/promises';
import path from 'node:path';
import { extractSourceRules, discoverScenarios, hash, coverageReviews, verifyCoverageClaims, bindScenarioElements, historicalReferences } from './evidence-discovery.mjs';
import { designScenario, sourceContract, mapCoverage } from './scenario-design.mjs';
import { collectLiveEvidence } from './liveshow-evidence.mjs';
import { collectScopeEvidence, supportedScopeEnds } from './liveshow-scope-evidence.mjs';
import { designScopeScenario, discoverScopeScenarios, mapScopeCoverage, projectStateTransitions, validateStateTransitionBaseline } from './scope-scenario-design.mjs';
import { loadTestcaseLanguageRules, validateTestcaseRecords } from './validate-testcase-json.mjs';

export async function validateDiscovery(taskDir, root, { phase = 'final', workbook } = {}) {
  const read = async name => JSON.parse(await fs.readFile(path.join(taskDir, name), 'utf8'));
  const manifest = await read('generation-input-manifest.json');
  const problems = [];
  const entries = new Map(manifest.输入文件.map(i => [i.路径, i]));
  if (entries.size !== manifest.输入文件.length) problems.push('输入路径重复或角色冲突');
  const allModules = manifest.目标范围?.模块名称 === '全部模块';
  if (manifest.项目目录 !== 'liveshow-proto' || manifest.生成策略 !== 'source-first'
    || !(allModules ? supportedScopeEnds().includes(manifest.目标范围?.端名) : manifest.目标范围?.端名 === '用户App' && manifest.目标范围?.模块名称 === '直播模块')) problems.push('发现任务身份或范围不正确');
  for (const entry of entries.values()) {
    if (path.isAbsolute(entry.路径) || path.relative(root,path.resolve(root,entry.路径)).startsWith('..')) {problems.push('输入路径越界');continue;}
    if (hash(await fs.readFile(path.join(root, entry.路径))) !== entry['SHA-256']) problems.push(`输入哈希变化：${entry.路径}`);
    if (entry.角色 === '当前业务证据' && !entry.路径.startsWith(`${manifest.项目目录}/`)) problems.push(`跨项目来源：${entry.路径}`);
    if (entry.角色 === '历史参照' && entry.允许定义业务规则) problems.push(`历史参照不能定义规则：${entry.路径}`);
  }
  const documents = await read('source-documents.json'), pages = await read('page-entry-map.json');
  const source = allModules ? await collectScopeEvidence(root, manifest.目标范围.端名) : await collectLiveEvidence(root);
  if (hash(documents)!==hash(source.documents) || hash(pages)!==hash(source.pages)) problems.push('原始文档条款或入口提取不完整，不能只重演截取后的输入');
  if (hash(await read('page-elements.json'))!==hash(source.elements)) problems.push('页面元素发现清单不完整');
  if (hash(await read('implementation-review.json'))!==hash(source.implementation)) problems.push('关联实现分支清单不完整');
  const scan=await read('global-evidence-scan-result.json');
  if (scan.项目指纹!==hash(source.inventory.map(f=>[f.路径,f.SHA256]).sort())) problems.push('项目清单已变化');
  for(const file of source.texts.keys()) if(entries.get(file)?.角色!=='当前业务证据') problems.push(`发现来源未登记：${file}`);
  for (const doc of documents) {
    const entry = entries.get(doc.path);
    if (!entry || entry.角色 !== '当前业务证据' || entry['SHA-256'] !== doc.sha256) { problems.push(`规则提取输入非法：${doc.path}`); continue; }
    const text = await fs.readFile(path.join(root, doc.path), 'utf8');
    for (const row of doc.entries) if (!text.includes(row.text)) problems.push(`原始证据单元不存在：${row.position}`);
  }
  const rules = await read('business-rule-catalog.json'), library = await read('test-scenario-library.json');
  const replayedRules = extractSourceRules(documents, pages);
  if (hash(rules) !== hash(replayedRules)) problems.push('业务规则库不能从登记的原始证据重现');
  const replayed = allModules ? discoverScopeScenarios(replayedRules, pages) : discoverScenarios(replayedRules, pages);
  const byId = new Map(replayedRules.规则.map(r => [r.规则标识, r]));
  replayed.场景.forEach(s => { allModules ? designScopeScenario(s, pages, byId) : designScenario(s, pages, byId); if (!allModules) sourceContract(s,pages); });
  bindScenarioElements(replayed.场景,pages,source.elements);
  let stateBaseline;
  if (manifest.schemaVersion === '3.2' && allModules) {
    const baselinePath = manifest.状态转换基线;
    const baselineEntry = entries.get(baselinePath);
    if (!baselinePath || !baselineEntry || baselineEntry.角色 !== '本次派生产物' || baselineEntry.内容类型 !== '状态转换基线' || baselineEntry.允许定义业务规则) {
      problems.push('状态转换基线未按禁止定义业务规则的本次派生产物登记');
    } else {
      stateBaseline = JSON.parse(await fs.readFile(path.join(root, baselinePath), 'utf8'));
      projectStateTransitions(replayed, stateBaseline, manifest.目标范围.端名);
      problems.push(...validateStateTransitionBaseline(stateBaseline, [{ endName: manifest.目标范围.端名, library }]));
      const sceneById = new Map(library.场景.map(scene => [scene.场景标识, scene]));
      for (const item of [...stateBaseline.业务流程.flatMap(flow => flow.状态转换), ...stateBaseline.待补转换]) {
        for (const projection of item.场景投影 || []) {
          if (projection.目标端 !== manifest.目标范围.端名) continue;
          const scene = sceneById.get(projection.场景标识);
          if (scene && !scene.规则标识.every(ruleId => item.规则标识.includes(ruleId))) problems.push(`${item.状态转换标识}没有完整引用${projection.场景标识}的当前规则`);
        }
      }
    }
  }
  if (hash(library) !== hash(replayed)) problems.push('场景库、条件或覆盖契约不能从原始规则重现');
  const baseline = await read('discovery-baseline.json');
  if (baseline.历史输入.length || baseline.规则SHA256 !== hash(rules) || baseline.场景SHA256 !== hash(library)
    || (stateBaseline && baseline.状态转换SHA256 !== hash(stateBaseline))) problems.push('原始发现阶段未与历史比较隔离');
  if (phase === 'final') {
    const candidate = await read('current-testcase-candidate.json');
    const final = await read(manifest.最终JSON || '用户App-直播模块-测试用例-260910-003.json');
    if (hash(candidate) !== hash(final)) problems.push('候选与最终内容不一致');
    const coverage = await read('coverage-after.json');
    problems.push(...verifyCoverageClaims(library.场景, candidate.测试用例, coverage.记录));
    const replayCoverage = allModules ? mapScopeCoverage(library.场景, candidate.测试用例) : mapCoverage(library.场景, candidate.测试用例);
    if (hash(coverage.记录) !== hash(replayCoverage)) problems.push('场景覆盖结论不能由实际用例重现');
    // Preserve unchanged legacy designs only after current-source rechecking.
    // This is provenance validation, not a claim that their scene is covered.
    const histories = await Promise.all([...entries.values()].filter(e => e.角色 === '历史参照' && e.路径.endsWith('.json')).map(e => fs.readFile(path.join(root,e.路径),'utf8').then(JSON.parse)));
    const oldCases = histories.flatMap(h => h.测试用例 || []);
    const oldRules = histories.flatMap(h => (h.规则 || []).flatMap(r => r.场景分支?.map(b => b.原子规则) || [r]));
    const designHash = c => { const { 序号, 用例编号, ...design } = c; return hash(design); };
    const originals = new Map(oldCases.map(c => [designHash(c), c]));
    const witnessed = new Set(coverage.记录.filter(c => c.状态 === '已覆盖').map(c => c.用例编号));
    for (const c of candidate.测试用例) {
      if (witnessed.has(c.用例编号)) continue;
      const original = originals.get(designHash(c));
      const references = original ? historicalReferences(original,oldRules,histories.find(h=>h.编号对应&&h.比较结果),histories.flatMap(h=>h.证据单元||[])) : [];
      if (!references.length || references.some(ref => !source.texts.get(ref.路径)?.includes(ref.原文)) || !rules.证据单元.some(u => references.some(ref => u.来源.路径 === ref.路径 && u.原文.includes(ref.原文)))) {
        problems.push(`${c.用例编号}既无场景覆盖证明，也不是经当前来源复核的原有用例`);
      }
    }
    const check = validateTestcaseRecords(candidate, await loadTestcaseLanguageRules());
    problems.push(...check.问题);
    const pending=library.场景.filter(s=>s.处理状态==='待确认');
    for(const scene of pending) if(!candidate.需求待确认.some(q=>q.待决策问题===String(scene.结果))) problems.push(`需求待确认未交付：${scene.场景标识}`);
    const reviews = coverageReviews(rules.规则, library.场景, coverage.记录, source.elements);
    if (hash(await read('coverage-dimensions.json')) !== hash(reviews.dimension)) problems.push('维度声明与实际规则、维度和场景关联不一致或缺少去向');
    if (hash(await read('page-element-coverage.json')) !== hash(reviews.element)) problems.push('元素声明与具体页面、元素和场景关联不一致或缺少去向');
    if(['3.1','3.2'].includes(manifest.schemaVersion)) {
      const backlog=await read('coverage-review-backlog.json');
      const missing=coverage.记录.filter(c=>c.状态==='未覆盖').map(c=>({...c,场景:library.场景.find(s=>s.场景标识===c.场景标识)}));
      if(hash(backlog.条款)!==hash(rules.规则.filter(r=>r.建模状态==='生成待复核'))||hash(backlog.场景)!==hash(missing)||hash(backlog.元素)!==hash(reviews.element.元素.filter(e=>e.状态!=='已覆盖')))problems.push('未完成项台账不完整，禁止删除缺口后宣称覆盖完成');
      const report=await read('coverage-change-report.json');
      const counts={原始条款数:rules.规则.length,待建模条款数:library.待建模条款.length,场景数:library.场景.length,最终用例数:candidate.测试用例.length,
        修改后已覆盖场景:coverage.记录.filter(c=>c.状态==='已覆盖').length,仍未覆盖场景:missing.length,控件数:source.elements.length,有用例证明元素:reviews.element.元素.filter(e=>e.状态==='已覆盖').length};
      if (stateBaseline) Object.assign(counts, { 跨端流程数: stateBaseline.业务流程.filter(flow => flow.涉及端.length > 1).length, 跨端闭环数: stateBaseline.统计.跨端闭环数 });
      for(const [key,value] of Object.entries(counts))if(report[key]!==value)problems.push(`覆盖统计与实际证据不一致：${key}`);
    }
    if (workbook) {
      const report = await read('delivery-verification.json');
      if (report.JSON一致性差异数 || report.工作簿SHA256 !== hash(await fs.readFile(workbook))) problems.push('Excel和已校验内容不一致');
    }
  }
  if (problems.length) throw new Error(problems.join('\n'));
  return { 状态: '通过', 阶段: phase, 验证内容: '来源哈希、证据原文、规则与场景重演、必要条件/操作/断言、候选与最终一致性',
    覆盖边界: '不代表全部条款已完成建模，不代表产品测试执行通过' };
}
