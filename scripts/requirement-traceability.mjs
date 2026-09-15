import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const fingerprint = value => crypto.createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
const check = (ok, message) => { if (!ok) throw new Error(message); };
const nonempty = text => typeof text === 'string' && text.trim();
export function localPath(root, file) {
  check(nonempty(file) && !path.isAbsolute(file) && path.posix.normalize(file) === file && !file.startsWith('../') && file !== '..', '追溯路径必须位于当前仓库');
  return path.join(root, file);
}

// These are source-accounting units, not semantic business rules. Never count them as test coverage.
export function textUnits(file, text) {
  return text.split(/\r?\n/).flatMap((raw, index) => raw.trim() ? [{
    标识: fingerprint([file, index + 1, raw]), 路径: file, 行: index + 1, 原文: raw,
  }] : []);
}
export async function readUnits(root, files, excluded = []) {
  const units = [];
  for (const file of files) {
    const location = localPath(root, file.路径), stat = await fs.lstat(location);
    check(stat.isFile() && !stat.isSymbolicLink(), `追溯只接受普通文件：${file.路径}`);
    const data = await fs.readFile(location);
    check(fingerprint(data) === file['SHA-256'], `追溯输入已变化：${file.路径}`);
    const exclusion = excluded.find(row => row.路径 === file.路径);
    if (exclusion) {
      check(nonempty(exclusion.说明) && exclusion['SHA-256'] === file['SHA-256'], '不读取内容的文件缺少版本或排除说明');
      units.push({ 标识: fingerprint([file.路径, file['SHA-256']]), 路径: file.路径, 行: 0, 原文: '', 排除说明: exclusion.说明 });
      continue;
    }
    const text = data.toString('utf8');
    const binary = /\.(png|jpe?g|webp|gif|pdf|xlsx|docx|woff2?|ttf|mp[34])$/i.test(file.路径) || text.includes('\u0000') || !Buffer.from(text).equals(data);
    units.push(...(binary ? [{ 标识: fingerprint([file.路径, file['SHA-256']]), 路径: file.路径, 行: 0, 原文: '', 二进制: true }] : textUnits(file.路径, text)));
  }
  return units;
}
export function seedTransfer(sources, targets) {
  return { schemaVersion: '1.0', 来源指纹: fingerprint(sources), 目标指纹: fingerprint(targets),
    逐项: sources.map(unit => ({ 来源标识: unit.标识, 去向: '未处理', 说明: '', 目标标识: [] })),
    目标排除: [], 语义复核: { 说明: '', 内容SHA256: '' } };
}
export function reviewHash(report) {
  const { 语义复核, ...content } = report;
  return fingerprint(content);
}
function review(report) {
  check(nonempty(report.语义复核?.说明) && report.语义复核?.内容SHA256 === reviewHash(report), '逐项语义复核缺失或内容已变化');
}
function exactRows(rows, units, key) {
  check(Array.isArray(rows), `缺少完整逐项清单：${key}`);
  const map = new Map(rows.map(row => [row[key], row]));
  check(map.size === rows.length && map.size === units.length && units.every(unit => map.has(unit.标识)), `逐项清单不等于全部来源：${key}（有遗漏、重复或额外条目）`);
  return map;
}
export function validateTransfer(sources, targets, report) {
  check(report?.schemaVersion === '1.0' && report.来源指纹 === fingerprint(sources) && report.目标指纹 === fingerprint(targets), '需求传递未绑定全部当前来源与目标');
  const rows = exactRows(report.逐项, sources, '来源标识'), targetIds = new Set(targets.map(x => x.标识)), reached = new Set();
  for (const source of sources) {
    const row = rows.get(source.标识);
    check(['已同步', '待确认', '不适用', '已替代'].includes(row.去向) && nonempty(row.说明), `来源未完成处理：${source.路径}:${source.行}`);
    check(Array.isArray(row.目标标识) && row.目标标识.every(id => targetIds.has(id)), '来源指向不存在的目标条款');
    if (source.排除说明) check(row.去向 === '不适用' && row.目标标识.length === 0, '历史或排除文件不能生成业务映射');
    if (['已同步', '待确认'].includes(row.去向)) check(row.目标标识.length > 0, '有效规则或问题没有实际目标');
    if (source.二进制 && row.去向 !== '不适用') check(nonempty(row.视觉解读) && nonempty(row.查看范围), '业务图片或文档缺少实际查看范围与解读，哈希不能代替读取');
    row.目标标识.forEach(id => reached.add(id));
  }
  const exclusions = new Map((report.目标排除 || []).map(row => [row.标识, row]));
  check(exclusions.size === (report.目标排除 || []).length, '目标排除重复');
  for (const [id, row] of exclusions) check(targetIds.has(id) && nonempty(row.说明), '目标排除无有效定位或依据');
  for (const target of targets) check(reached.has(target.标识) || exclusions.has(target.标识), `目标条款没有上游依据或排除说明：${target.路径}:${target.行}`);
  review(report);
  return { 来源单元: sources.length, 目标单元: targets.length };
}

export function seedCoverage(units) {
  return { schemaVersion: '1.0', 来源指纹: fingerprint(units), 交付性质: '部分覆盖',
    逐项: units.map(unit => ({ 来源标识: unit.标识, 状态: '未覆盖', 说明: '', 分支: [] })),
    状态转换处理: [],
    语义复核: { 说明: '', 内容SHA256: '' } };
}
function coverageResolver(report, library) {
  if (report.契约模式 !== '场景引用') return branch => branch;
  check(library && report.场景库SHA256 === fingerprint(library), '场景引用未绑定当前完整场景库，须重新复核覆盖');
  const scenes = new Map((library.场景 || []).map(scene => [scene.场景标识, scene]));
  check(scenes.size === library.场景?.length, '独立场景库编号重复或结构缺失');
  return branch => {
    if (branch.状态 !== '已设计') return branch;
    const scene = scenes.get(branch.场景标识);
    check(scene, '覆盖分支引用不存在的独立场景');
    for (const key of ['执行角色', '目标端', '入口', '用例契约']) check(branch[key] === undefined, '场景引用模式不得维护重复契约字段');
    return { ...branch, 执行角色: scene.执行角色, 目标端: scene.目标端, 入口: scene.入口, 用例契约: scene.用例契约 };
  };
}

export function validateCoverage(units, report, { phase = 'pre-generate', cases = [], questions = [], library } = {}) {
  check(units.length > 0, 'MainBasis 全文为空，无法建立覆盖分母');
  check(report?.schemaVersion === '1.0' && report.来源指纹 === fingerprint(units), '覆盖分母必须绑定 MainBasis 全文，不能来自已生成场景');
  check(['完整覆盖', '部分覆盖'].includes(report.交付性质), '必须声明完整或部分覆盖');
  check(report.契约模式 === undefined || report.契约模式 === '场景引用', '未知覆盖契约模式');
  const resolveBranch = coverageResolver(report, library);
  const rows = exactRows(report.逐项, units, '来源标识'), counts = {}, unfinished = [], caseMap = new Map(cases.map(c => [c.用例编号, c]));
  check(caseMap.size === cases.length, '正式用例编号重复');
  const questionIds = new Set(questions.map(q => q.问题编号)), used = new Set(), branchIds = new Set();
  for (const unit of units) {
    const row = rows.get(unit.标识);
    check(['已覆盖', '部分覆盖', '未覆盖', '待确认', '不适用'].includes(row.状态) && nonempty(row.说明), `条款未说明去向：${unit.路径}:${unit.行}`);
    counts[row.状态] = (counts[row.状态] || 0) + 1;
    check(Array.isArray(row.分支), '条款缺少分支清单');
    if (['已覆盖', '部分覆盖'].includes(row.状态)) check(row.分支.length > 0, '已覆盖或部分覆盖条款没有分支');
    if (row.状态 === '不适用') check(row.分支.length === 0, '不适用条款不能暗藏正式分支');
    if (row.状态 === '待确认') {
      check(nonempty(row.问题编号), '待确认缺少问题编号');
      if (phase === 'final') check(questionIds.has(row.问题编号), '待确认未进入最终问题清单');
    }
    if (['未覆盖', '待确认'].includes(row.状态)) unfinished.push({来源标识:unit.标识, 路径:unit.路径, 行:unit.行, 状态:row.状态, 说明:row.说明, ...(row.问题编号 ? {问题编号:row.问题编号} : {})});
    for (const rawBranch of row.分支) {
      const branch = resolveBranch(rawBranch);
      check(nonempty(branch.标识) && !branchIds.has(branch.标识), '分支编号缺失或重复'); branchIds.add(branch.标识);
      check(['已设计', '未覆盖', '待确认'].includes(branch.状态) && nonempty(branch.说明), '分支缺少真实状态与说明');
      if (row.状态 === '已覆盖') check(branch.状态 === '已设计', '条款已覆盖声明隐藏了未覆盖分支');
      if (branch.状态 !== '已设计') {
        unfinished.push({来源标识:unit.标识, 分支标识:branch.标识, 路径:unit.路径, 行:unit.行, 状态:branch.状态, 说明:branch.说明, ...(branch.问题编号 ? {问题编号:branch.问题编号} : {})});
        if (branch.状态 === '待确认') {
          check(nonempty(branch.问题编号), '分支待确认缺少问题编号');
          if (phase === 'final') check(questionIds.has(branch.问题编号), '分支问题未进入最终问题清单');
        }
        continue;
      }
      check(['已覆盖', '部分覆盖'].includes(row.状态), '未覆盖或待确认条款不能隐藏已设计的正式分支');
      check(!unit.风险, '风险清单不得作为正式分支依据');
      check(nonempty(branch.来源片段) && unit.原文.includes(branch.来源片段), '分支缺少本条需求中的直接来源片段');
      for (const key of ['执行角色', '目标端', '入口', '场景标识']) check(nonempty(branch[key]), `已设计分支缺少${key}`);
      const contract = branch.用例契约;
      check(contract && ['前置条件', '操作步骤', '预期结果'].every(key => Array.isArray(contract[key]) && contract[key].length && contract[key].every(nonempty)), '分支缺少具体条件、动作和结果契约');
      if (phase === 'final') {
        const candidate = caseMap.get(branch.用例编号);
        check(candidate && ['前置条件', '操作步骤', '预期结果'].every(key => fingerprint(candidate[key]) === fingerprint(contract[key])), `分支没有匹配实际条件、步骤与结果的用例：${branch.标识}`);
        used.add(branch.用例编号);
      }
    }
    if (row.状态 === '部分覆盖') check(row.分支.some(b => b.状态 === '已设计') && row.分支.some(b => b.状态 !== '已设计'), '部分覆盖必须同时列明已设计与遗漏分支');
  }
  if (phase === 'final') for (const candidate of cases) check(used.has(candidate.用例编号), `正式用例不在需求覆盖清单中：${candidate.用例编号}`);
  const incomplete = (counts.部分覆盖 || 0) + (counts.未覆盖 || 0) + (counts.待确认 || 0);
  if (report.交付性质 === '完整覆盖') check(incomplete === 0, '仍有未覆盖、部分覆盖或待确认，禁止声明完整交付');
  review(report);
  return { 校验: '通过', 交付性质: report.交付性质, 条款处理统计: counts, 未完成项: unfinished, 说明: '单元计数不是业务覆盖率；语义正确性仍需逐条复核' };
}

export async function validateCoverageInput(root, manifest, phase) {
  const entries = manifest.输入文件 || [];
  const load = async file => {
    check(file?.startsWith(`${manifest.任务工作目录}/`), '覆盖依赖必须属于本次任务目录');
    const entry = entries.find(e => e.路径 === file);
    check(entry?.角色 === '本次派生产物', '覆盖依赖未登记为本次派生产物');
    const text = await fs.readFile(localPath(root, file), 'utf8');
    check(fingerprint(text) === entry['SHA-256'], '覆盖依赖哈希失效');
    return JSON.parse(text);
  };
  const sources = entries.filter(e => ['当前业务证据', '风险与缺口'].includes(e.角色));
  const units = await readUnits(root, sources);
  const riskPaths = new Set(sources.filter(e => e.角色 === '风险与缺口').map(e => e.路径));
  for (const unit of units) if (riskPaths.has(unit.路径)) unit.风险 = true;
  const coverage = await load(manifest.需求覆盖清单);
  const library = await load(manifest.独立场景库);
  const resolveBranch = coverageResolver(coverage, library);
  const scenes = new Map((library.场景 || []).map(scene => [scene.场景标识, scene]));
  check(scenes.size === library.场景?.length, '独立场景库编号重复或结构缺失');
  const boundScenes = new Set();
  for (const row of coverage.逐项 || []) for (const rawBranch of row.分支 || []) if (rawBranch.状态 === '已设计') {
    const branch = resolveBranch(rawBranch);
    const scene = scenes.get(branch.场景标识);
    check(scene && ['执行角色', '目标端', '入口', '用例契约'].every(key => fingerprint(scene[key] ?? null) === fingerprint(branch[key] ?? null)), '覆盖分支与独立场景的角色、入口或契约不符');
    check(branch.目标端 === manifest.目标范围?.端名, '端侧覆盖分支的执行端与本次范围不符');
    boundScenes.add(branch.场景标识);
  }
  check([...scenes.keys()].every(id => boundScenes.has(id)), '独立场景未回溯到需求条款');
  const states = await load(manifest.状态转换基线);
  check(Array.isArray(states.状态转换), '缺少独立状态转换基线；无状态规则时显式为空数组');
  check(new Set(states.状态转换.map(t => t.状态转换标识)).size === states.状态转换.length, '状态转换编号重复');
  for (const transition of states.状态转换) {
    for (const key of ['状态转换标识', '共同业务对象', '来源状态', '触发动作', '执行角色', '操作端', '目标状态']) check(nonempty(transition[key]), `状态转换缺少${key}`);
    check(Array.isArray(transition.观察端) && transition.观察端.length > 0 && transition.观察端.every(nonempty), '状态转换观察端不完整');
  }
  const transitions = states.状态转换.filter(t => t.操作端 === manifest.目标范围?.端名 || (t.观察端 || []).includes(manifest.目标范围?.端名));
  const projections = exactRows(coverage.状态转换处理, transitions.map(t => ({ 标识: t.状态转换标识 })), '状态转换标识');
  for (const transition of transitions) {
    const projection = projections.get(transition.状态转换标识);
    check(['已映射', '未覆盖', '待确认'].includes(projection.状态) && nonempty(projection.说明), '状态转换缺少端侧去向');
    if (projection.状态 !== '已映射') {
      check(coverage.交付性质 === '部分覆盖', '未映射状态转换禁止声明完整覆盖');
      continue;
    }
    check(projection.场景标识?.length && projection.场景标识.every(id => scenes.get(id)?.状态转换标识 === transition.状态转换标识), '状态转换没有对应端侧场景');
  }
  const stateIds = new Set(transitions.map(t => t.状态转换标识));
  for (const scene of scenes.values()) if (scene.状态转换标识) check(stateIds.has(scene.状态转换标识), '场景引用不存在或不属于目标端的状态转换');
  const candidate = phase === 'final' ? await load(manifest.当前候选用例) : { 测试用例: [], 需求待确认: [] };
  const result = validateCoverage(units, coverage, { phase, cases: candidate.测试用例, questions: candidate.需求待确认, library });
  for (const projection of projections.values()) if (projection.状态 !== '已映射') {
    if (projection.状态 === '待确认') {
      check(nonempty(projection.问题编号), '状态转换待确认缺少问题编号');
      if (phase === 'final') check(candidate.需求待确认.some(q => q.问题编号 === projection.问题编号), '状态转换问题未进入最终问题清单');
    }
    result.未完成项.push({状态转换标识:projection.状态转换标识, 状态:projection.状态, 说明:projection.说明, ...(projection.问题编号 ? {问题编号:projection.问题编号} : {})});
  }
  return result;
}
