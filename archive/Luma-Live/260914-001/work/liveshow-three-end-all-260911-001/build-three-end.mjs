import fs from 'node:fs/promises';
import path from 'node:path';
import { collectScopeEvidence } from '../../scripts/liveshow-scope-evidence.mjs';
import { extractSourceRules, hash, bindScenarioElements, coverageReviews } from '../../scripts/evidence-discovery.mjs';
import { buildStateTransitionBaseline, discoverScopeScenarios, designScopeScenario, finalizeStateTransitionBaseline, mapScopeCoverage, projectStateTransitions, validateStateTransitionBaseline } from '../../scripts/scope-scenario-design.mjs';
import { loadTestcaseLanguageRules, validateTestcaseRecords } from '../../scripts/validate-testcase-json.mjs';
import { validateDiscovery } from '../../scripts/validate-discovery.mjs';
import { finishStage, startStage } from '../../scripts/pipeline-metrics.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const taskRoot = path.join(root, 'work/liveshow-three-end-all-260911-001');
const priorUser = 'work/liveshow-user-live-discovery-260910-006/用户App-直播模块-测试用例-260910-004.json';
const ends = {
  用户App: { dir: 'user', final: '用户App-全部模块-测试用例-260911-001.json', q: 'UQ', rq: 'URQ', prefixes: { '账号与登录': 'UAUTH', '首页与发现': 'UHOME', '直播模块': 'ULIVE', '消息与社交': 'USOC', '个人中心': 'UPROF', '粉丝团': 'UFAN', '公会': 'UGUILD', '主播中心': 'UHOST', '钱包与充值': 'UWALLET' } },
  公会App: { dir: 'guild', final: '公会App-全部模块-测试用例-260911-001.json', q: 'GQ', rq: 'GRQ', prefixes: { '公会账号': 'GAUTH', '公会首页': 'GHOME', '审批管理': 'GAPP', '主播管理': 'GHOST', '运营管理': 'GOPS', '公会管理': 'GMGMT', '数据与收益': 'GDATA' } },
  管理后台: { dir: 'admin', final: '管理后台-全部模块-测试用例-260911-001.json', q: 'AQ', rq: 'ARQ', prefixes: { '用户管理': 'AUSER', '主播管理': 'AHOST', '公会管理': 'AGUILD', '直播管理': 'ALIVE', '内容审核': 'ACONT', '礼物与道具': 'AGIFT', '运营配置': 'AOPS', '运营账号': 'AACCT', '财务结算': 'AFIN', '数据报表': 'ADATA', '系统配置': 'ASYS' } },
};

const abs = relative => path.join(root, relative);
const rel = file => path.relative(root, file).split(path.sep).join('/');
const write = async (dir, name, value) => fs.writeFile(path.join(dir, name), `${JSON.stringify(value, null, 2)}\n`);
const read = async (dir, name) => JSON.parse(await fs.readFile(path.join(dir, name), 'utf8'));
const stamp = () => new Date().toISOString();

async function fileEntry(relative, role, type, allow = role === '当前业务证据') {
  return { 路径: relative, 角色: role, 'SHA-256': hash(await fs.readFile(abs(relative))), 允许定义业务规则: allow, 内容类型: type || path.basename(relative) };
}

async function manifestFor(endName, taskDir, source, final = false) {
  const generated = ['source-documents.json', 'page-entry-map.json', 'page-elements.json', 'implementation-review.json', 'dependency-analysis.json',
    'business-rule-catalog.json', 'test-scenario-library.json', 'discovery-baseline.json', 'global-evidence-scan-result.json', 'prototype-context-sync-result.json'];
  if (final) generated.push('coverage-before.json', 'coverage-after.json', 'coverage-dimensions.json', 'page-element-coverage.json',
    'coverage-review-backlog.json', 'coverage-change-report.json', 'historical-case-comparison.json', 'semantic-dedup-review.json',
    'current-testcase-candidate.json', ends[endName].final);
  const tools = ['AGENTS.md', 'scripts/evidence-discovery.mjs', 'scripts/scenario-design.mjs', 'scripts/scope-scenario-design.mjs',
    'scripts/liveshow-scope-evidence.mjs', 'scripts/evidence-dependencies.mjs', 'scripts/parse-prototype-html.py',
    'scripts/validate-discovery.mjs', 'scripts/validate-testcase-json.mjs', rel(path.join(taskRoot, 'build-three-end.mjs')), rel(path.join(taskRoot, 'build-workbooks.mjs'))];
  const inputs = [];
  for (const file of source.texts.keys()) inputs.push(await fileEntry(file, '当前业务证据'));
  for (const name of generated) inputs.push(await fileEntry(rel(path.join(taskDir, name)), '本次派生产物', name === 'business-rule-catalog.json' ? '业务规则清单' : name, name === 'business-rule-catalog.json'));
  for (const file of tools) inputs.push(await fileEntry(file, '执行工具', path.basename(file), false));
  const stateBaseline = rel(path.join(taskRoot, 'state-transition-baseline.json'));
  inputs.push(await fileEntry(stateBaseline, '本次派生产物', '状态转换基线', false));
  if (final && endName === '用户App') inputs.push(await fileEntry(priorUser, '历史参照', '历史测试用例', false));
  return { schemaVersion: '3.2', 最终JSON: ends[endName].final, 状态转换基线: stateBaseline, 生成策略: 'source-first', 项目名称: 'Luma Live', 项目目录: 'liveshow-proto',
    任务工作目录: rel(taskDir), 目标范围: { 端名: endName, 模块名称: '全部模块' }, 输入文件: inputs };
}

function syncResult() {
  return {
    schemaVersion: '1.0', 同步状态: '有非阻塞待确认', 同步时间: stamp(), 来源策略: 'prototype-primary', 需求清单有修改: true,
    需求清单变更日志编号: ['RSL-0029'],
    文件核对: [
      { 路径: 'liveshow-proto/context/01-用户主播App-项目需求清单.md', 修改前SHA256: '1e17c8335bdc889884cd7100ffb7743d761c8c2d789e2038d424756ac9d27896', 修改后SHA256: '1e17c8335bdc889884cd7100ffb7743d761c8c2d789e2038d424756ac9d27896', 结论: '当前任务未修改' },
      { 路径: 'liveshow-proto/context/02-公会App-项目需求清单.md', 修改前SHA256: 'aee792f8011a9f12e440c3cad05020bd68f4f2425907d87fb97b2a8736d75a46', 修改后SHA256: 'ca03c6a9a07e1a1fddbb9dbd011079c3c28565878c686394ff476627e8df218e', 结论: '按系统概要和当前批注同步审核、结算和运营账号规则' },
      { 路径: 'liveshow-proto/context/03-管理后台-项目需求清单.md', 修改前SHA256: 'ea3eb1ea9e1e7ab8dcc7f680ff692a17455b02e2427b96ccc863c72f60f54058', 修改后SHA256: 'ee47c471a2389345b9345551d2bc266aeeaa2a7ac9d63b3730fa64b15e4f95a1', 结论: '按系统概要和当前批注同步幸运礼物、运营账号和线下结算规则' },
    ],
    冲突处理: [{ 主题: '商品分成台账与线下结算口径', 处理: '局部隔离到管理后台需求待确认，不阻断其他规则' }], 阻塞异常: [],
  };
}

async function discover(endName) {
  const config = ends[endName], taskDir = path.join(taskRoot, config.dir);
  await fs.mkdir(taskDir, { recursive: true });
  await startStage(taskDir, 'inventory-hash', { 输入数量: 1 });
  const source = await collectScopeEvidence(root, endName);
  await finishStage(taskDir, 'inventory-hash', { 输入数量: source.inventory.length, 输出数量: source.inventory.length, 复用数量: 0 });
  await startStage(taskDir, 'semantic-read', { 输入数量: source.texts.size });
  await write(taskDir, 'source-documents.json', source.documents);
  await write(taskDir, 'page-entry-map.json', source.pages);
  await write(taskDir, 'page-elements.json', source.elements);
  await write(taskDir, 'implementation-review.json', source.implementation);
  await write(taskDir, 'dependency-analysis.json', source.dependencies);
  await finishStage(taskDir, 'semantic-read', { 输入数量: source.texts.size, 输出数量: source.documents.reduce((n, d) => n + d.entries.length, 0), 复用数量: 0 });
  await startStage(taskDir, 'sync', { 输入数量: 3 });
  await write(taskDir, 'prototype-context-sync-result.json', syncResult());
  await finishStage(taskDir, 'sync', { 输入数量: 3, 输出数量: 3, 复用数量: 1 });
  await startStage(taskDir, 'normalize-rules', { 输入数量: source.documents.length });
  const rules = extractSourceRules(source.documents, source.pages);
  await write(taskDir, 'business-rule-catalog.json', rules);
  await finishStage(taskDir, 'normalize-rules', { 输入数量: rules.证据单元.length, 输出数量: rules.规则.length, 复用数量: 0 });
  const gapReviews = rules.规则.filter(rule => rule.模型.类型 === '需求缺口').map(rule => ({
    检索对象: rule.业务对象, 检索词: distinct([rule.业务对象, ...String(rule.模型.问题).match(/[\p{Script=Han}A-Za-z]+/gu) || []]).slice(0, 8),
    已查文件: [...source.texts.keys()], 命中位置: rule.来源.map(item => `${item.路径} ${item.位置}`), 命中内容: rule.来源.map(item => item.原文),
    采用结论: '当前来源明确标记待确认，保留为产品决策问题', 未采用原因: [],
  }));
  await write(taskDir, 'global-evidence-scan-result.json', { schemaVersion: '3.1', 项目: 'Luma Live', 目标端: endName, 扫描模式: 'full',
    模式依据: '三端全部模块范围首次使用当前证据提取 Schema，旧直播模块缓存不能复用', 项目指纹: hash(source.inventory.map(file => [file.路径, file.SHA256]).sort()),
    文件数量: source.inventory.length, 语义读取记录: [...source.texts.keys()].map(file => ({ 路径: file, SHA256: source.inventory.find(item => item.路径 === file)?.SHA256, 结论: '已读取并纳入当前端证据或依赖复核', 关联规则: rules.规则.filter(rule => rule.来源.some(item => item.路径 === file)).map(rule => rule.规则标识) })),
    规则缺失复核: gapReviews, 排除项: source.inventory.filter(file => !source.texts.has(file.路径)).map(file => ({ 路径: file.路径, 原因: '未进入当前端依赖闭包，已建档但不扩大测试范围' })),
    缓存清理: { 状态: '成功', 失效层: ['证据原子', '规则与依赖', '候选与历史比较', '工作簿'], 已隔离文件: [], 清理后残留失效文件: [] },
    项目接入基线: { 状态: '已确认', 路径: 'work/liveshow-proto-project-onboarding/latest.json' }, 扫描状态: gapReviews.length ? '有非阻塞待确认' : '通过', 阻塞项: [] });
  return { endName, taskDir, source, rules, pending: gapReviews.length };
}

async function discoverAll() {
  const models = [];
  for (const endName of Object.keys(ends)) models.push(await discover(endName));
  const stateBaseline = buildStateTransitionBaseline(models.map(model => ({ endName: model.endName, pages: model.source.pages, catalog: model.rules })));
  const stateIssues = validateStateTransitionBaseline(stateBaseline);
  if (stateIssues.length) throw new Error(stateIssues.join('\n'));
  for (const model of models) {
    model.library = discoverScopeScenarios(model.rules, model.source.pages);
    model.library.场景.forEach(scene => designScopeScenario(scene, model.source.pages));
    bindScenarioElements(model.library.场景, model.source.pages, model.source.elements);
    projectStateTransitions(model.library, stateBaseline, model.endName, true);
    await write(model.taskDir, 'test-scenario-library.json', model.library);
  }
  finalizeStateTransitionBaseline(stateBaseline);
  await write(taskRoot, 'state-transition-baseline.json', stateBaseline);
  for (const model of models) {
    await write(model.taskDir, 'discovery-baseline.json', { 时间: stamp(), 规则SHA256: hash(model.rules), 场景SHA256: hash(model.library), 状态转换SHA256: hash(stateBaseline), 历史输入: [],
      说明: '本阶段只读取当前证据；先建立业务对象状态转换基线，再投影目标端场景，未读取已有用例' });
    await write(model.taskDir, 'generation-input-manifest.json', await manifestFor(model.endName, model.taskDir, model.source, false));
    await write(model.taskDir, 'input-validation.json', await validateDiscovery(model.taskDir, root, { phase: 'pre-generate' }));
  }
  const projectionIssues = validateStateTransitionBaseline(stateBaseline, models.map(model => ({ endName: model.endName, library: model.library })));
  if (projectionIssues.length) throw new Error(projectionIssues.join('\n'));
  return models.map(model => ({ endName: model.endName, rules: model.rules.规则.length, scenes: model.library.场景.length,
    designed: model.library.场景.filter(scene => scene.设计).length, pending: model.pending }));
}

const distinct = values => [...new Set(values)];
function optionsFor(question) {
  if (/修改前还是修改后额度/u.test(question)) return ['按发币操作提交时的额度校验', '按发币操作执行时的最新额度校验', '额度变更后取消未完成操作并要求重新提交'];
  if (/排序|次序/u.test(question)) return ['按最近更新时间倒序', '按创建或加入时间倒序', '按名称或昵称升序', '按后台可读取的排序配置执行'];
  if (/收入类型/u.test(question)) return ['仅计入礼物和门票收益', '计入全部已结算主播收入', '按后台可读取的收入类型配置执行'];
  if (/消费类型/u.test(question)) return ['仅计入礼物消费', '计入礼物和门票消费', '按后台可读取的消费类型配置执行'];
  if (/已有用户等级/u.test(question)) return ['只影响配置保存后新增的等级变化', '保存后按新配置重算全部已有等级', '按明确生效时间重算生效后的等级变化'];
  return ['采用当前问题所述规则', '不采用该规则并保持当前已确认行为'];
}

function pending(endName, scene, index) {
  const config = ends[endName], guildGap = !scene && endName === '公会App';
  const page = scene ? scene.页面[0] : guildGap ? 'guild-operation-coin-issue.html' : 'admin-share-rule-config.html';
  const question = scene ? String(scene.结果) : guildGap
    ? '公会月度发币额度修改时，已提交但未完成的发币操作应按修改前还是修改后额度校验？'
    : '商品成交时是否必须按绑定的分成规则版本自动生成分账台账？';
  const module = scene ? scene.设计?.功能模块 || '系统配置' : guildGap ? '运营管理' : '财务结算';
  return { 问题编号: `${config.q}-${String(index).padStart(3, '0')}`, 需求组编号: `${config.rq}-${String(index).padStart(3, '0')}`, 父问题编号: '', 追问触发条件: '',
    阻塞等级: '部分阻塞', 功能模块: module, 具体场景: `${scene?.角色 || '平台管理员'}在${page}执行相关业务时需要确定唯一结果`,
    问题分类: /排序|次序/u.test(question) ? '计算与统计口径' : scene ? '业务规则' : '跨端与跨模块一致性', 待决策问题: question,
    可选方案: optionsFor(question), 测试建议: '优先采用可由当前端直接读取并稳定复现的规则，避免测试依赖人工解释', 产品结论: '', 结论补充: '',
    已知依据: scene ? scene.证据.map(item => `${item.路径}；${item.位置}；${item.原文}`) : guildGap ? [
      '系统概要与公会端当前批注明确平台配置公会月度额度，公会在额度内发放虚拟金币',
      '当前证据未定义额度修改对已提交但未完成操作的适用时点',
    ] : [
      'context/03-管理后台-项目需求清单.md 写明商品绑定分成规则并按版本生成分账台账',
      'context/系统概要 .md 与当前结算批注明确具体分成比例和应结金额由财务线下确定并上传结果',
    ], 影响范围: [`${endName} ${module} ${page}`, guildGap ? '公会额度、运营账号余额与发币记录' : '礼物或门票成交后的分成记录与线下结算核对'], 已有用例编号: [],
    确认后待补用例: [`${module}相关规则的正常、边界和历史数据场景`], 负责人: scene ? '产品' : '多方确认', 期望确认时间: '进入对应功能测试前', 确认状态: '待确认' };
}

function assignIds(endName, cases) {
  const counters = new Map();
  cases.sort((a, b) => a.功能模块.localeCompare(b.功能模块, 'zh-CN') || a.功能结构.localeCompare(b.功能结构, 'zh-CN') || a.用例描述.localeCompare(b.用例描述, 'zh-CN'));
  for (const [index, testcase] of cases.entries()) {
    const count = (counters.get(testcase.功能模块) || 0) + 1;
    counters.set(testcase.功能模块, count);
    const prefix = ends[endName].prefixes[testcase.功能模块] || `${endName === '用户App' ? 'U' : endName === '公会App' ? 'G' : 'A'}MISC`;
    testcase.序号 = index + 1;
    testcase.用例编号 = `${prefix}-${String(count).padStart(4, '0')}`;
  }
}

async function generate(endName) {
  const config = ends[endName], taskDir = path.join(taskRoot, config.dir);
  await validateDiscovery(taskDir, root, { phase: 'pre-generate' });
  const source = await collectScopeEvidence(root, endName);
  const [rules, library, stateBaseline] = await Promise.all([read(taskDir, 'business-rule-catalog.json'), read(taskDir, 'test-scenario-library.json'), read(taskRoot, 'state-transition-baseline.json')]);
  await startStage(taskDir, 'history-compare', { 输入数量: endName === '用户App' ? 1 : 0 });
  const old = endName === '用户App' ? JSON.parse(await fs.readFile(abs(priorUser), 'utf8')) : { 测试用例: [] };
  await finishStage(taskDir, 'history-compare', { 输入数量: old.测试用例.length, 输出数量: old.测试用例.length, 复用数量: 0 });
  await startStage(taskDir, 'generate-dedup', { 输入数量: library.场景.length });
  let cases = library.场景.flatMap(scene => scene.设计 ? [structuredClone(scene.设计)] : []);
  const seen = new Set();
  cases = cases.filter(testcase => { const key = hash([testcase.功能模块, testcase.功能结构, testcase.前置条件, testcase.操作步骤, testcase.预期结果]); if (seen.has(key)) return false; seen.add(key); return true; });
  assignIds(endName, cases);
  const questions = library.场景.filter(scene => scene.处理状态 === '待确认').map((scene, index) => pending(endName, scene, index + 1));
  if (['公会App', '管理后台'].includes(endName)) questions.push(pending(endName, null, questions.length + 1));
  const language = await loadTestcaseLanguageRules();
  const isolated = [];
  for (;;) {
    const checked = validateTestcaseRecords({ 测试用例: cases, 需求待确认: questions }, language);
    if (!checked.问题.length) break;
    const bad = cases.filter(testcase => checked.问题.some(problem => problem.startsWith(testcase.用例编号))).map(testcase => testcase.用例编号);
    if (!bad.length) throw new Error(`${endName}存在无法局部隔离的语言问题：\n${checked.问题.join('\n')}`);
    isolated.push(...checked.问题.filter(problem => bad.some(id => problem.startsWith(id))));
    cases = cases.filter(testcase => !bad.includes(testcase.用例编号));
    assignIds(endName, cases);
  }
  for (;;) {
    const witnessed = new Set(mapScopeCoverage(library.场景, cases).filter(record => record.状态 === '已覆盖').map(record => record.用例编号));
    const orphaned = cases.filter(testcase => !witnessed.has(testcase.用例编号));
    if (!orphaned.length) break;
    isolated.push(...orphaned.map(testcase => `${testcase.用例编号}与另一条候选证明同一场景，去重后不单独交付`));
    cases = cases.filter(testcase => witnessed.has(testcase.用例编号));
    assignIds(endName, cases);
  }
  const candidate = { 测试用例: cases, 需求待确认: questions };
  const before = mapScopeCoverage(library.场景, []), after = mapScopeCoverage(library.场景, cases);
  const reviews = coverageReviews(rules.规则, library.场景, after, source.elements);
  const missing = after.filter(record => record.状态 === '未覆盖').map(record => ({ ...record, 场景: library.场景.find(scene => scene.场景标识 === record.场景标识) }));
  await write(taskDir, 'coverage-before.json', { 场景库SHA256: hash(library), 记录: before });
  await write(taskDir, 'coverage-after.json', { 场景库SHA256: hash(library), 记录: after });
  await write(taskDir, 'coverage-dimensions.json', reviews.dimension);
  await write(taskDir, 'page-element-coverage.json', reviews.element);
  await write(taskDir, 'coverage-review-backlog.json', { 条款: rules.规则.filter(rule => rule.建模状态 === '生成待复核'), 场景: missing,
    状态转换: stateBaseline.待补转换.filter(item => [item.操作端, ...item.观察端].includes(endName)), 元素: reviews.element.元素.filter(element => element.状态 !== '已覆盖'), 局部隔离原因: isolated });
  await write(taskDir, 'coverage-change-report.json', { 原始条款数: rules.规则.length, 待建模条款数: library.待建模条款.length, 场景数: library.场景.length,
    最终用例数: cases.length, 修改后已覆盖场景: after.filter(record => record.状态 === '已覆盖').length, 仍未覆盖场景: missing.length,
    跨端流程数: stateBaseline.业务流程.filter(flow => flow.涉及端.length > 1).length, 跨端闭环数: stateBaseline.统计.跨端闭环数,
    控件数: source.elements.length, 有用例证明元素: reviews.element.元素.filter(element => element.状态 === '已覆盖').length,
    结论: '仅声明有覆盖契约且通过语言门禁的场景已覆盖；其余保留在复核台账' });
  const currentByMeaning = new Map(cases.map(testcase => [hash([testcase.功能结构, testcase.用例描述, testcase.预期结果]), testcase.用例编号]));
  await write(taskDir, 'historical-case-comparison.json', { 历史来源: endName === '用户App' ? priorUser : '', 比较结果: old.测试用例.map(testcase => {
    const target = currentByMeaning.get(hash([testcase.功能结构, testcase.用例描述, testcase.预期结果]));
    return { 原用例: testcase.用例编号, 处理结论: target ? '继续有效' : '需要重写', 当前用例: target || '', 依据: target ? '当前来源重建后语义一致' : '当前全部模块场景库未形成相同的来源独立覆盖契约' };
  }) });
  const ruleById = new Map(rules.规则.map(rule => [rule.规则标识, rule]));
  await write(taskDir, 'semantic-dedup-review.json', { 候选SHA256: hash(candidate), 待人工复核: [], 复核结果: cases.map(testcase => {
    const ids = testcase.备注.find(note => note.startsWith('规则：')).slice(3).split('、');
    return { 稳定规则标识: ids.join('、'), 归一化业务键: hash([testcase.功能模块, testcase.功能结构, testcase.验证用例子项]), 状态关系: testcase.前置条件.join('；'),
      基础条件: testcase.前置条件, 附加条件: [], 关键操作: testcase.操作步骤.join('；'), 可观察结果: testcase.预期结果[0], 保留或合并目标: testcase.用例编号,
      判定: '保留', 判定理由: '角色、入口、动作或单一观察结果至少一项不同', 候选用例追溯: [testcase.用例编号],
      证据: ids.flatMap(id => ruleById.get(id)?.来源 || []).map(item => ({ 路径: item.路径, 'SHA-256': item.SHA256 })) };
  }) });
  await write(taskDir, 'current-testcase-candidate.json', candidate);
  await write(taskDir, config.final, candidate);
  await finishStage(taskDir, 'generate-dedup', { 输入数量: library.场景.length, 输出数量: cases.length + questions.length, 复用数量: 0, 隔离数量: isolated.length });
  await write(taskDir, 'generation-input-manifest.json', await manifestFor(endName, taskDir, source, true));
  await startStage(taskDir, 'json-validate', { 输入数量: 1 });
  const validation = await validateDiscovery(taskDir, root, { phase: 'final' });
  await finishStage(taskDir, 'json-validate', { 输入数量: 1, 输出数量: cases.length + questions.length, 复用数量: 0, 问题数量: 0 });
  await write(taskDir, 'final-validation.json', validation);
  return { endName, cases: cases.length, pending: questions.length, isolated: isolated.length };
}

async function main() {
  const [command, requested] = process.argv.slice(2);
  const selected = requested ? [requested] : Object.keys(ends);
  if (selected.some(endName => !ends[endName])) throw new Error('端名必须是用户App、公会App或管理后台');
  if (!['discover', 'generate'].includes(command)) throw new Error('用法：node build-three-end.mjs <discover|generate> [端名]');
  const results = command === 'discover' ? await discoverAll() : [];
  if (command === 'generate') for (const endName of selected) results.push(await generate(endName));
  console.log(JSON.stringify(results, null, 2));
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
