#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const requiredStages = ['inventory-hash', 'semantic-read', 'sync', 'normalize-rules', 'generate-dedup', 'history-compare', 'json-validate', 'xlsx-build', 'xlsx-verify'];
const check = (ok, message) => { if (!ok) throw new Error(message); };
const now = () => new Date().toISOString();
const nonempty = value => typeof value === 'string' && value.trim();
const fileName = 'pipeline-metrics.json';

export async function readMetrics(taskDir) {
  try { return JSON.parse(await fs.readFile(path.join(taskDir, fileName), 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { schemaVersion: '2.0', 阶段: [], 耗时最长阶段: null };
  }
}

export function summarizeMetrics(metrics) {
  const completed = metrics.阶段.filter(item => Number.isFinite(item.耗时毫秒));
  const totals = new Map();
  for (const item of completed) totals.set(item.阶段名称, (totals.get(item.阶段名称) || 0) + item.耗时毫秒);
  const start = Date.parse(metrics.任务?.开始时间), end = Date.parse(metrics.任务?.结束时间 || now());
  // Wall time uses the union of intervals; overlapping stages must not double-count it.
  let accounted = 0, cursor = start;
  for (const item of metrics.阶段.filter(item => item.状态 !== '不适用').map(item => [Date.parse(item.开始时间), Date.parse(item.结束时间 || now())]).sort((a, b) => a[0] - b[0])) {
    const left = Math.max(start, item[0], cursor), right = Math.min(end, item[1]);
    if (right > left) accounted += right - left;
    cursor = Math.max(cursor, right);
  }
  const wall = Number.isFinite(start) && Number.isFinite(end) ? end - start : null;
  return { 耗时最长阶段: [...totals].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
    阶段累计耗时毫秒: completed.reduce((sum, item) => sum + item.耗时毫秒, 0),
    总墙钟耗时毫秒: wall, 未归属耗时毫秒: wall === null ? null : wall - accounted,
    返工次数: metrics.阶段.filter(item => (item.尝试 || 1) > 1).length };
}

async function updateMetrics(taskDir, change) {
  await fs.mkdir(taskDir, { recursive: true });
  const file = path.join(taskDir, fileName), lock = file + '.lock', temporary = file + '.' + crypto.randomUUID() + '.tmp';
  // One writer per task; concurrent writers fail explicitly instead of losing records.
  const handle = await fs.open(lock, 'wx');
  try {
    const metrics = await readMetrics(taskDir), result = await change(metrics);
    Object.assign(metrics, summarizeMetrics(metrics));
    await fs.writeFile(temporary, JSON.stringify(metrics, null, 2) + '\n');
    await fs.rename(temporary, file);
    return result;
  } finally {
    await handle.close();
    await fs.unlink(lock);
    await fs.rm(temporary, { force: true });
  }
}

export async function startTask(taskDir, startedAt = now()) {
  const start = Date.parse(startedAt);
  check(Number.isFinite(start) && start <= Date.now(), '任务开始时间无效或晚于当前时间');
  return updateMetrics(taskDir, async metrics => {
    check(!metrics.任务, '任务已开始，续办不得重置总计时');
    check(metrics.阶段.every(item => Date.parse(item.开始时间) >= start), '任务开始时间晚于已记录阶段');
    metrics.schemaVersion = '2.0';
    let scope;
    try {
      const batch = JSON.parse(await fs.readFile(path.join(taskDir,'batch.json'),'utf8'));
      const {batchScope} = await import('./validate-testcase-delivery.mjs');
      scope = batchScope(batch);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    return metrics.任务 = { 开始时间: new Date(start).toISOString(), 状态: '进行中', ...(scope ? {交付范围:scope} : {}) };
  });
}

function openStage(item) { return !item.结束时间 && item.状态 !== '不适用'; }
function stageCounts(counts) {
  const allowed = new Set(['输入数量', '输出数量', '复用数量', '原因', '状态']);
  check(Object.keys(counts).every(key => allowed.has(key)), '计时字段只能是数量、原因或状态，不能覆盖时间及尝试编号');
  for (const key of ['输入数量', '输出数量', '复用数量']) if (counts[key] !== undefined) check(Number.isInteger(counts[key]) && counts[key] >= 0, key + '须为非负整数');
}

export async function startStage(taskDir, stageName, counts = {}) {
  check(nonempty(stageName), '阶段名称不能为空'); stageCounts(counts);
  check(counts.状态 === undefined, '开始阶段不能指定完成状态');
  return updateMetrics(taskDir, metrics => {
    check(metrics.任务?.状态 !== '已结束', '已结束任务不能追加阶段');
    const previous = metrics.阶段.filter(item => item.阶段名称 === stageName);
    check(!previous.some(openStage), '阶段仍在进行中：' + stageName + '；先记录失败或中断再重试');
    const reason = counts.原因 || process.env.PIPELINE_RETRY_REASON;
    check(!previous.length || nonempty(reason), '重复阶段必须记录返工原因（原因字段或 PIPELINE_RETRY_REASON）');
    const stage = { 阶段名称: stageName, 尝试: previous.length + 1, 开始时间: now(), 状态: '进行中', 输入数量: 0, 输出数量: 0, 复用数量: 0, ...counts, ...(reason ? { 原因: reason } : {}) };
    metrics.阶段.push(stage);
    return stage.开始时间;
  });
}

export async function finishStage(taskDir, stageName, counts = {}) {
  stageCounts(counts);
  check(['已完成', '失败', '中断'].includes(counts.状态 || '已完成'), '阶段结束状态无效');
  if (['失败', '中断'].includes(counts.状态)) check(nonempty(counts.原因), '失败或中断必须记录原因');
  return updateMetrics(taskDir, metrics => {
    const stage = metrics.阶段.findLast(item => item.阶段名称 === stageName && openStage(item));
    check(stage, '阶段尚未开始或已结束：' + stageName);
    stage.结束时间 = now();
    stage.耗时毫秒 = Date.parse(stage.结束时间) - Date.parse(stage.开始时间);
    check(stage.耗时毫秒 >= 0, '系统时钟回退，不能写入负耗时');
    Object.assign(stage, { 状态: '已完成' }, counts);
    return stage;
  });
}

export async function skipStage(taskDir, stageName, reason) {
  check(nonempty(stageName) && nonempty(reason), '不适用阶段必须说明原因');
  check(stageName === 'history-compare', '只允许禁用历史比较；来源、覆盖和交付检查不得跳过');
  return updateMetrics(taskDir, metrics => {
    check(metrics.任务?.状态 !== '已结束', '已结束任务不能追加阶段');
    check(!metrics.阶段.some(item => item.阶段名称 === stageName), '已有阶段不得改记为不适用');
    const timestamp = now();
    const stage = { 阶段名称: stageName, 尝试: 1, 开始时间: timestamp, 结束时间: timestamp, 状态: '不适用', 原因: reason, 耗时毫秒: 0, 输入数量: 0, 输出数量: 0, 复用数量: 0 };
    metrics.阶段.push(stage); return stage;
  });
}

export function validateMetrics(metrics, stages = requiredStages) {
  check(metrics.任务?.开始时间 && Number.isFinite(Date.parse(metrics.任务.开始时间)), '缺少整轮任务开始时间');
  check(!metrics.阶段.some(openStage), '仍有未结束阶段');
  for (const stage of metrics.阶段) {
    const start = Date.parse(stage.开始时间), end = Date.parse(stage.结束时间);
    check(Number.isFinite(start) && Number.isFinite(end) && start >= Date.parse(metrics.任务.开始时间)
      && end >= start && stage.耗时毫秒 === end - start, '阶段时间与真实区间不一致');
    check(['已完成','失败','中断','不适用'].includes(stage.状态), '缺少阶段结束状态');
    if (stage.状态 === '不适用') check(stage.阶段名称 === 'history-compare' && nonempty(stage.原因), '不能跳过非历史质量阶段');
    if (['失败','中断'].includes(stage.状态)) check(nonempty(stage.原因), '失败或中断没有说明');
    for (const key of ['输入数量','输出数量','复用数量']) check(Number.isInteger(stage[key]) && stage[key]>=0, '缺少有效阶段数量');
  }
  for (const name of stages) {
    const stage = metrics.阶段.findLast(item => item.阶段名称 === name);
    check(stage && (stage.状态 === '已完成' || (stage.状态 === '不适用' && nonempty(stage.原因))), '阶段缺失或尚未完成：' + name);
    check(Number.isFinite(stage.耗时毫秒) && stage.耗时毫秒 >= 0, '阶段耗时无效：' + name);
  }
  return summarizeMetrics(metrics);
}

export async function finishTask(taskDir, repoRoot = process.cwd()) {
  return updateMetrics(taskDir, async metrics => {
    validateMetrics(metrics);
    check(metrics.任务.状态 !== '已结束', '任务已结束，禁止重置结束时间');
    const {resolveTaskBatch, validateTestcaseBatch, requireDeliverySatisfied} = await import('./validate-testcase-delivery.mjs');
    const {file} = await resolveTaskBatch(taskDir,repoRoot);
    const delivery = await validateTestcaseBatch(file,repoRoot,{workbooks:true});
    requireDeliverySatisfied(delivery);
    metrics.任务.完成校验 = {批次SHA256:delivery.批次SHA256, 交付性质:delivery.交付性质, 交付要求满足:true, 检查时间:now()};
    metrics.任务.结束时间 = now(); metrics.任务.状态 = '已结束';
    return summarizeMetrics(metrics);
  });
}

function parseCounts(values) {
  return Object.fromEntries(values.map(value => {
    const separator = value.indexOf('='), key = value.slice(0, separator), raw = value.slice(separator + 1);
    check(separator > 0, '计时参数必须使用 字段=值');
    return [key, raw !== '' && Number.isFinite(Number(raw)) ? Number(raw) : raw];
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [command, directory, stage, ...values] = process.argv.slice(2);
  try {
    check(directory, '缺少任务目录');
    const result = command === 'task-start' ? await startTask(directory, stage)
      : command === 'task-finish' ? await finishTask(directory)
      : command === 'status' ? summarizeMetrics(await readMetrics(directory))
      : command === 'skip' ? await skipStage(directory, stage, values.join(' '))
      : command === 'start' ? await startStage(directory, stage, parseCounts(values))
      : command === 'finish' ? await finishStage(directory, stage, parseCounts(values))
      : (() => { throw new Error('用法：pipeline-metrics.mjs <task-start|task-finish|status|start|finish|skip> <任务目录> [阶段或请求时间] [字段=值或原因]'); })();
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
