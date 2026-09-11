import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { collectLiveEvidence } from './liveshow-evidence.mjs';
import { DISCOVERY_VERSION, extractSourceRules, discoverScenarios, hash, coverageReviews, verifyCoverageClaims, bindScenarioElements, historicalReferences } from './evidence-discovery.mjs';
import { designScenario, sourceContract, mapCoverage, mergeScenarioTrace, groupSources } from './scenario-design.mjs';
import { validateDiscovery } from './validate-discovery.mjs';
import { loadTestcaseLanguageRules, validateTestcaseRecords } from './validate-testcase-json.mjs';
import { startStage, finishStage } from './pipeline-metrics.mjs';

const root = path.resolve(import.meta.dirname, '..');
const task = 'work/liveshow-user-live-discovery-260910-006';
const finalName = '用户App-直播模块-测试用例-260910-004.json';
const taskDir = path.join(root, task);
const tools = ['AGENTS.md', 'Cem Kaner.txt', 'scripts/build-live-discovery.mjs', 'scripts/liveshow-evidence.mjs', 'scripts/parse-prototype-html.py', 'scripts/evidence-discovery.mjs', 'scripts/scenario-design.mjs', 'scripts/evidence-dependencies.mjs', 'scripts/validate-testcase-json.mjs', 'scripts/validate-discovery.mjs', 'scripts/validate-generation-input.mjs', 'scripts/validate-testcase-delivery.mjs', 'work/liveshow-user-live-profile-260910-003/build-live-workbook.mjs'];
const read = async name => JSON.parse(await fs.readFile(path.join(taskDir, name), 'utf8'));
const write = async (name, value) => fs.writeFile(path.join(taskDir, name), JSON.stringify(value, null, 2) + '\n');
const now = () => new Date().toISOString();

async function manifest(extra = [], discoveredOnly = false) {
  const scan = await read('global-evidence-scan-result.json');
  const discoveryNames = ['source-documents.json','page-entry-map.json','business-rule-catalog.json','page-elements.json','dependency-analysis.json','implementation-review.json','test-scenario-library.json','discovery-baseline.json','global-evidence-scan-result.json','prototype-context-sync-result.json','cache-isolation.json'];
  const artifactNames = (await fs.readdir(taskDir)).filter(n => n.endsWith('.json') && !['generation-input-manifest.json', 'pipeline-metrics.json', 'delivery-verification.json','input-validation.json','final-validation.json'].includes(n) && (!discoveredOnly || discoveryNames.includes(n)));
  const paths = [...scan.输入文件.map(p => [p, '当前业务证据']), ...tools.map(p => [p, '执行工具']), ...artifactNames.map(n => [`${task}/${n}`, '本次派生产物']), ...extra];
  const entries = [];
  for (const [p, role] of paths) entries.push({ 路径: p, 角色: role, 'SHA-256': hash(await fs.readFile(path.join(root, p))), 允许定义业务规则: role === '当前业务证据', 内容类型: path.basename(p) });
  await write('generation-input-manifest.json', { schemaVersion: DISCOVERY_VERSION, 最终JSON:finalName, 生成策略: 'source-first', 项目名称: 'Luma Live', 项目目录: 'liveshow-proto', 任务工作目录: task,
    目标范围: { 端名: '用户App', 模块名称: '直播模块' }, 输入文件: entries });
}

export async function discover() {
  await fs.mkdir(taskDir, { recursive: true });
  const quarantined = [];
  for (const layer of ['evidence-atoms','normalized-rules','cases-history','workbook']) {
    const from = path.join(root, 'work/liveshow-proto-global-evidence-cache/layers', layer);
    if (!(await fs.stat(from).catch(()=>null))) continue;
    const destination = path.join(taskDir,'cache-quarantine',`${Date.now()}-${layer}`);
    await fs.mkdir(path.dirname(destination),{recursive:true});
    const files = [];
    for (const name of await fs.readdir(from)) files.push({路径:path.relative(root,path.join(from,name)),SHA256:hash(await fs.readFile(path.join(from,name)))});
    await fs.rename(from,destination);
    quarantined.push({层:layer,文件:files,隔离目录:path.relative(root,destination),时间:now()});
  }
  if (quarantined.length) await write('cache-isolation.json',{状态:'成功',方式:'移动保留，可恢复；不复用旧层',记录:quarantined});
  await startStage(taskDir, 'inventory-hash', { 输入数量: 1 });
  const e = await collectLiveEvidence(root);
  await finishStage(taskDir, 'inventory-hash', { 输入数量: e.inventory.length, 输出数量: e.texts.size, 复用数量: 0 });
  await startStage(taskDir, 'semantic-read', { 输入数量: e.documents.length });
  const rules = extractSourceRules(e.documents, e.pages);
  await write('source-documents.json', e.documents);
  await write('page-entry-map.json', e.pages);
  await write('business-rule-catalog.json', rules);
  await write('page-elements.json', e.elements);
  await write('dependency-analysis.json', e.dependencies);
  await write('implementation-review.json', e.implementation);
  await finishStage(taskDir, 'semantic-read', { 输入数量: rules.证据单元.length, 输出数量: rules.规则.length, 复用数量: 0 });
  await startStage(taskDir, 'normalize-rules', { 输入数量: rules.规则.length });
  const library = discoverScenarios(rules, e.pages);
  const ruleById = new Map(rules.规则.map(r => [r.规则标识, r]));
  for (const scenario of library.场景) { designScenario(scenario, e.pages, ruleById); sourceContract(scenario,e.pages); }
  bindScenarioElements(library.场景,e.pages,e.elements);
  await write('test-scenario-library.json', library);
  await write('discovery-baseline.json', { 时间: now(), 规则SHA256: hash(rules), 场景SHA256: hash(library), 历史输入: [], 说明: '本阶段未读取现有测试用例；场景由当前证据独立建立' });
  await finishStage(taskDir, 'normalize-rules', { 输入数量: rules.规则.length, 输出数量: library.场景.length, 复用数量: 0 });
  await write('global-evidence-scan-result.json', { schemaVersion: DISCOVERY_VERSION, 扫描模式: 'full', 模式依据: '证据提取Schema变更，重新从当前证据建立规则库', 文件清单: e.inventory,
    输入文件: [...e.texts.keys()], 规则来源: e.documents.map(d => d.path), 入口数量: Object.keys(e.pages).length, 证据单元数: rules.证据单元.length,
    未解释条款: rules.规则.filter(r => r.建模状态 === '生成待复核').map(r => ({ 规则: r.规则标识, 原文: r.条款, 来源: r.来源, 原因:r.建模说明 })),
    排除文件: e.inventory.filter(f => !e.texts.has(f.路径)).map(f => ({ 路径: f.路径, 原因: '未被本次模块入口或公共证据依赖闭包引用' })),
    来源冲突处理: rules.来源冲突处理, 项目指纹: hash(e.inventory.map(f => [f.路径, f.SHA256]).sort()), 时间: now(),
    逐文件处理: [...e.texts.keys()].map(file=>({路径:file,SHA256:hash(e.texts.get(file)),原始条款:rules.规则.filter(r=>r.来源.some(s=>s.路径===file)).map(r=>r.规则标识),实现分支:e.implementation.filter(b=>b.文件===file).map(b=>b.标识),
      结论:e.documents.some(d=>d.path===file)?'已独立提取原始条款':e.implementation.some(b=>b.文件===file)?'实现分支已登记，未证明完整调用链的部分局部待复核':'依赖或公共上下文已登记，不作为独立业务规则'})),
    边界说明:'文本提取不等于全部语义解释完成；未建模条款和实现分支单独保留，不计已覆盖' });
  await startStage(taskDir,'sync',{输入数量:e.documents.length});
  await write('prototype-context-sync-result.json',{范围:'用户App-直播模块',来源冲突:rules.来源冲突处理,处理:'系统概要优先；当前派生需求未写其他邀请失效，保留连麦主规则；其余未解释条款局部复核，不删除原需求',派生需求修改:[]});
  await finishStage(taskDir,'sync',{输出数量:rules.来源冲突处理.length,复用数量:0});
  await manifest([],true);
  await write('input-validation.json',await validateDiscovery(taskDir,root,{phase:'pre-generate'}));
  console.log(JSON.stringify({阶段:'发现',规则:rules.规则.length,场景:library.场景.length,可执行设计:library.场景.filter(s=>s.设计).length,未解释条款:library.待建模条款.length}));
}

export async function generate(baselinePath, oldCatalogPath) {
  await validateDiscovery(taskDir,root,{phase:'pre-generate'});
  const discovery = await read('discovery-baseline.json'), rules = await read('business-rule-catalog.json'), library = await read('test-scenario-library.json');
  if (hash(rules) !== discovery.规则SHA256 || hash(library) !== discovery.场景SHA256) throw new Error('独立发现基线已变化，须先重新发现');
  const language = await loadTestcaseLanguageRules();
  await startStage(taskDir, 'history-compare', { 输入数量: 2 });
  const previous = JSON.parse(await fs.readFile(path.join(root, baselinePath), 'utf8'));
  const previousCatalog = JSON.parse(await fs.readFile(path.join(root, oldCatalogPath), 'utf8'));
  const comparisonPath=path.join(path.dirname(baselinePath),'historical-case-comparison.json');
  const previousComparison=await fs.readFile(path.join(root,comparisonPath),'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
  await write('historical-question-review.json',{说明:'历史问题仅作为复核线索保留，未将历史缺失结论复制为当前需求事实',记录:previous.需求待确认.map(q=>({历史问题:q.问题编号,场景:q.具体场景,原问题:q.待决策问题,状态:'待当前证据复核',说明:'本次独立发现的明确待确认项单独交付；未匹配不表示该历史问题已经解决'}))});
  const oldRules = previousCatalog.规则.flatMap(r => r.场景分支?.map(b => b.原子规则) || [r]);
  // Historical text is used only after the independent model has been frozen.
  // Reuse requires current direct quotes and an unchanged original design.
  const sourceTexts = new Map();
  const retained = [], historical = [];
  for (const testcase of previous.测试用例) {
    const references = historicalReferences(testcase,oldRules,previousComparison,previousCatalog.证据单元);
    let valid = references.length > 0;
    const bindings = [];
    for (const ref of references) {
      if (!sourceTexts.has(ref.路径)) sourceTexts.set(ref.路径, await fs.readFile(path.join(root, ref.路径), 'utf8'));
      if (!sourceTexts.get(ref.路径).includes(ref.原文)) valid = false;
      bindings.push(...rules.规则.filter(r => r.来源.some(s => s.路径 === ref.路径 && s.原文.includes(ref.原文))).map(r => r.规则标识));
    }
    const sourceUnits=rules.证据单元.filter(u=>references.some(ref=>u.来源.路径===ref.路径&&u.原文.includes(ref.原文)));
    if (!bindings.length && !sourceUnits.length) valid = false;
    let isolation='未与当前规则库建立直接来源映射';
    // A post-exit value has no observable panel until rejoining. Isolate this
    // historical design; the source model supplies the executable recovery path.
    if (/退出粉丝团/u.test(testcase.操作步骤.join(' ')) && /粉丝等级|亲密度/u.test(testcase.预期结果.join(' ')) && !/点击加入/u.test(testcase.操作步骤.join(' '))) {valid=false;isolation='退出后未提供等级观察入口，改由重新加入后的场景验证；保留隔离记录';}
    historical.push({ 原用例: testcase.用例编号, 当前规则: [...new Set(bindings)], 来源单元:sourceUnits.map(u=>u.单元标识),结论: valid ? '当前原文仍存在，保留既有用例；场景覆盖另行核对' : '需要重审', 原因: valid ? '当前证据引用和既有设计一致' : isolation });
    if (valid) retained.push(testcase);
  }
  const before = mapCoverage(library.场景, retained);
  await write('coverage-before.json', { 场景库SHA256: hash(library), 历史用例SHA256: hash(previous), 记录: before });
  await finishStage(taskDir, 'history-compare', { 输入数量: previous.测试用例.length, 输出数量: historical.length, 复用数量: retained.length });
  await startStage(taskDir, 'generate-dedup', { 输入数量: library.场景.length });
  const cases = retained.map(c => structuredClone(c));
  const decisions = [];
  const caseKey = c => hash([c.功能结构.match(/（(.+)视角）/u)?.[1] || c.前置条件[0], c.前置条件, c.操作步骤, c.预期结果]);
  const existingKeys = new Map(cases.map(c => [caseKey(c), c]));
  const validationIssues = [];
  for (const scenario of library.场景) {
    if (!scenario.设计 || before.find(c => c.场景标识 === scenario.场景标识)?.状态 === '已覆盖') continue;
    const draft = structuredClone(scenario.设计);
    const key = caseKey(draft);
    if (existingKeys.has(key)) { const target=existingKeys.get(key);mergeScenarioTrace(target,scenario);decisions.push({ 场景: scenario.场景标识, 判定: '合并', 原因: '角色、前提、动作、结果相同，合并直接来源并重新验证覆盖', 目标: target.用例描述 }); continue; }
    const check = validateTestcaseRecords({ 测试用例: [{...draft,序号:1,用例编号:'LIVE-0001'}], 需求待确认: [] }, language);
    if (check.状态 !== '通过') { validationIssues.push({ 场景: scenario.场景标识, 原因: check.问题 }); continue; }
    cases.push(draft); existingKeys.set(key, draft); decisions.push({ 场景: scenario.场景标识, 判定: '新增', 结果: draft.预期结果[0] });
  }
  const renumber=[];
  cases.forEach((c, i) => {const original=c.用例编号;c.序号 = i + 1; c.用例编号 = `LIVE-${String(i + 1).padStart(4, '0')}`;if(original)renumber.push({原用例:original,本次用例:c.用例编号});});
  const after = mapCoverage(library.场景, cases);
  const issues = verifyCoverageClaims(library.场景, cases, after);
  if (issues.length) throw new Error(issues.join('\n'));
  const questions = library.场景.filter(s=>s.处理状态==='待确认');
  const pending = [...new Map(questions.map(s=>[String(s.结果),s])).values()].map((s,i)=>({问题编号:`Q-${String(i+1).padStart(3,'0')}`,需求组编号:`RQ-${String(i+1).padStart(3,'0')}`,父问题编号:'',追问触发条件:'',阻塞等级:'部分阻塞',功能模块:'直播模块',具体场景:`${s.业务对象}：${String(s.结果)}`,问题分类:'业务规则',待决策问题:String(s.结果),
    可选方案:/明细列表/u.test(String(s.结果))?['按日期倒序排列','按日期正序排列','按收益从高到低排列']:/排序/u.test(String(s.结果))?['按用户 ID 数字部分升序排列','按关系建立时间倒序排列（需要提供时间字段）']:/敏感词/u.test(String(s.结果))?['整条消息禁止发送并保留输入，提示需另行明确','替换命中片段后发送其余内容，替换形式需明确']:['由产品补充该场景的明确验收规则','确认该场景本期不支持，并明确入口和提示'],测试建议:'上述方案仅供产品决策，不作为已确认规则。',产品结论:'',结论补充:'',已知依据:groupSources(s.证据,true),影响范围:[`用户App-直播模块-${s.业务对象}`],已有用例编号:[],确认后待补用例:[String(s.结果).replace(/待确认/gu,'规则确认后的验证')],负责人:'产品',期望确认时间:'对应场景测试前',确认状态:'待确认'}));
  const candidate = { 测试用例: cases, 需求待确认: pending };
  await write('current-testcase-candidate.json', candidate);
  await write(finalName, candidate);
  await write('historical-case-comparison.json', { 发现基线: discovery, 比较时间: now(), 比较结果: historical,编号对应:renumber, 候选SHA256: hash(candidate) });
  await write('semantic-dedup-review.json', { 比较键: '角色、前提、动作、结果', 处理: decisions, 局部隔离: validationIssues });
  await write('coverage-after.json', { 场景库SHA256: hash(library), 记录: after, 声明校验问题: issues, 执行覆盖: '未执行产品测试；已覆盖仅表示用例设计满足场景契约' });
  const elements = await read('page-elements.json');
  const reviews = coverageReviews(rules.规则, library.场景, after, elements);
  await write('page-element-coverage.json', reviews.element);
  await write('coverage-dimensions.json', reviews.dimension);
  await write('coverage-review-backlog.json',{
    说明:'这些是生成器的建模或映射缺口，不能伪装成业务需求缺失；已保留完整原文、条件和来源，不影响有依据的用例交付。',
    条款:rules.规则.filter(r=>r.建模状态==='生成待复核'),
    场景:after.filter(c=>c.状态==='未覆盖').map(c=>({...c,场景:library.场景.find(s=>s.场景标识===c.场景标识)})),
    元素:reviews.element.元素.filter(e=>e.状态!=='已覆盖')
  });
  await write('coverage-change-report.json', { 原始条款数: rules.规则.length, 独立结构化规则数: rules.规则.filter(r=>r.建模状态==='已结构化'&&!r.被替代规则).length, 待建模条款数:library.待建模条款.length,场景数: library.场景.length, 原用例数: previous.测试用例.length, 保留原用例数: retained.length,
    新增用例数: cases.length - retained.length, 最终用例数: cases.length, 修改前已覆盖场景: before.filter(c=>c.状态==='已覆盖').length,
    修改后已覆盖场景: after.filter(c=>c.状态==='已覆盖').length, 仍未覆盖场景: after.filter(c=>c.状态==='未覆盖').length,
    已设计但未覆盖: after.filter(c=>c.状态==='未覆盖' && library.场景.find(s=>s.场景标识===c.场景标识).设计).length,
    待确认场景: after.filter(c=>c.状态==='待确认').length,不适用场景:after.filter(c=>c.状态==='不适用').length,
    已有契约场景:library.场景.filter(s=>s.覆盖契约).length,控件数:elements.length,已绑定行为元素:reviews.element.元素.filter(e=>e.场景.length).length,
    有用例证明元素:reviews.element.元素.filter(e=>e.状态==='已覆盖').length,
    新场景: decisions.filter(c=>c.判定==='新增'), 生成问题: validationIssues });
  await finishStage(taskDir, 'generate-dedup', { 输入数量: library.场景.length, 输出数量: cases.length, 复用数量: retained.length });
  await manifest([[baselinePath,'历史参照'],[oldCatalogPath,'历史参照'],...(previousComparison?[[comparisonPath,'历史参照']]:[])]);
  await startStage(taskDir,'json-validate',{输入数量:cases.length});
  await write('final-validation.json',await validateDiscovery(taskDir,root));
  await finishStage(taskDir,'json-validate',{输出数量:cases.length,复用数量:0});
  console.log(JSON.stringify(Object.fromEntries(Object.entries(await read('coverage-change-report.json')).filter(([,v])=>typeof v==='number'))));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === 'discover') await discover();
  else if (process.argv[2] === 'generate') await generate(process.argv[3], process.argv[4]);
  else throw new Error('用法：build-live-discovery.mjs discover | generate <已存在用例JSON> <原规则清单>');
}
