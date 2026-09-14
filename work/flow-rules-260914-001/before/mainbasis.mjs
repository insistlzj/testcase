import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const digest = value => hash(JSON.stringify(value));
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const check = (ok, message) => { if (!ok) throw new Error(message); };
const relative = value => typeof value === 'string' && value && !path.isAbsolute(value)
  && value === path.posix.normalize(value) && !value.startsWith('../') && value !== '..' && value !== '.';
const governance = ['AGENTS.md', 'Cem Kaner.txt', '全局证据扫描指令.md', '原型与需求清单同步指令.md', 'scripts/mainbasis.mjs'];

export async function mainBasisConfig(root, project) {
  check(relative(project), '项目必须使用仓库内相对路径');
  let policy;
  try { policy = await read(path.join(root, project, '需求来源策略.json')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  const config = policy.MainBasis;
  if (!config) return null;
  check(config.生成前更新 === true, 'MainBasis 必须在生成前更新');
  for (const key of ['正式需求', '风险清单']) check(relative(config[key]) && config[key].startsWith('MainBasis/'), `MainBasis.${key}路径非法`);
  check(config.正式需求 !== config.风险清单, '正式需求和风险清单不得相同');
  check(policy.来源策略 === 'prototype-primary' && policy.生成前同步 === true, 'MainBasis 上游同步必须保持 prototype-primary');
  check(Array.isArray(policy.派生需求清单) && policy.派生需求清单.length > 0, '缺少派生需求清单');
  check(policy.派生需求清单.every(file => relative(file) && file.startsWith('context/')), '派生需求只能位于 context/');
  return { ...config, policy, project, baseline: `work/${project.replaceAll('/', '-')}-mainbasis/latest.json` };
}

async function fileRecord(root, file) {
  const stat = await fs.lstat(path.join(root, file));
  check(stat.isFile() && !stat.isSymbolicLink(), `只接受普通文件：${file}`);
  return { 路径: file, 'SHA-256': hash(await fs.readFile(path.join(root, file))) };
}

async function snapshot(root, config) {
  const files = [];
  async function visit(directory) {
    for (const entry of await fs.readdir(path.join(root, directory), { withFileTypes: true })) {
      if (['.git', '.DS_Store'].includes(entry.name)) continue;
      const file = `${directory}/${entry.name}`;
      if (file === `${config.project}/MainBasis`) continue;
      check(!entry.isSymbolicLink(), `上游存在未展开的符号链接：${file}`);
      if (entry.isDirectory()) await visit(file);
      else files.push(await fileRecord(root, file));
    }
  }
  await visit(config.project);
  for (const file of governance) files.push(await fileRecord(root, file));
  files.sort((a, b) => a.路径 < b.路径 ? -1 : a.路径 > b.路径 ? 1 : 0);
  return files;
}

async function documents(root, config) {
  return Promise.all([config.正式需求, config.风险清单].map(file => fileRecord(root, `${config.project}/${file}`)));
}

async function write(file, value, exclusive = false) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
}

function taskPath(root, task) {
  check(relative(task) && task.startsWith('work/'), '任务目录必须位于 work/，请使用新任务目录');
  return path.join(root, task);
}

export async function startMainBasis(root, project, task) {
  const config = await mainBasisConfig(root, project);
  check(config, '项目未配置 MainBasis');
  const baseline = { schemaVersion: '1.0', 项目目录: project, 上游: await snapshot(root, config), 文档: [] };
  for (const file of [config.正式需求, config.风险清单]) {
    try { baseline.文档.push(await fileRecord(root, `${project}/${file}`)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  await write(path.join(taskPath(root, task), 'mainbasis-start.json'), baseline, true);
  return { 状态: '已固定同步前版本', 下一步: '执行全局扫描、context 同步和 MainBasis 语义汇总，保存同步结果后 seal；本操作未更新需求正文' };
}

export async function sealMainBasis(root, project, task) {
  const config = await mainBasisConfig(root, project);
  check(config, '项目未配置 MainBasis');
  const directory = taskPath(root, task);
  const start = await read(path.join(directory, 'mainbasis-start.json'));
  check(start.schemaVersion === '1.0' && start.项目目录 === project, '同步前基线不属于当前项目');
  const upstream = await snapshot(root, config);
  const derived = new Set(config.policy.派生需求清单.map(file => `${project}/${file}`));
  check(digest(start.上游.filter(file => !derived.has(file.路径))) === digest(upstream.filter(file => !derived.has(file.路径))), '同步期间上游变化，请重新 start 并分析变化');
  const docs = await documents(root, config);
  const syncFile = `${task}/prototype-context-sync-result.json`;
  const sync = await read(path.join(root, syncFile));
  check(['通过', '有非阻塞待确认'].includes(sync.同步状态) && Array.isArray(sync.阻塞异常) && !sync.阻塞异常.length, '需求同步尚未完成');
  const scanFile = `${task}/global-evidence-scan-result.json`;
  const scan = await read(path.join(root, scanFile));
  check(['通过', '有非阻塞待确认'].includes(scan.扫描状态) && Array.isArray(scan.阻塞项) && !scan.阻塞项.length, '上游扫描尚未完成');
  const scanned = new Map((scan.文件清单 || []).map(file => [file.路径, file['SHA-256'] || file.SHA256]));
  for (const file of upstream.filter(file => file.路径.startsWith(`${project}/`))) check(scanned.get(file.路径) === file['SHA-256'], `扫描记录未绑定当前上游：${file.路径}`);
  const review = sync.MainBasis复核;
  check(review?.业务优先级 === '系统概要优先，原型和批注补充' && review.复核说明?.trim(), '缺少 MainBasis 语义复核和优先级记录');
  check(review.上游指纹 === digest(upstream), 'MainBasis 复核未绑定同步后的全部上游版本');
  check(Array.isArray(review.待确认问题) && Array.isArray(review.来源映射) && review.来源映射.length > 0, '缺少来源到需求/风险的映射及待确认问题清单');
  const byPath = new Map(upstream.map(file => [file.路径, file['SHA-256']]));
  for (const mapping of review.来源映射) {
    check(byPath.get(mapping.来源路径) === mapping.来源SHA256 && mapping.来源位置?.trim(), 'MainBasis 来源映射的当前证据无效');
    const target = docs.find(file => file.路径 === mapping.目标路径);
    check(target && mapping.目标原文?.trim() && (await fs.readFile(path.join(root, target.路径), 'utf8')).includes(mapping.目标原文), 'MainBasis 来源映射没有实际目标原文');
  }
  const before = new Map([...start.上游, ...start.文档].map(file => [file.路径, file['SHA-256']]));
  const targets = [...upstream.filter(file => derived.has(file.路径)), ...docs];
  check(targets.length === derived.size + 2, '派生需求文件缺失');
  for (const target of targets) {
    const record = sync.文件核对?.find(item => item.路径 === target.路径);
    check(record?.修改前SHA256 === (before.get(target.路径) || null) && record?.修改后SHA256 === target['SHA-256'] && record?.核对说明?.trim(), `缺少真实前后核对：${target.路径}`);
    if (record.修改前SHA256 !== record.修改后SHA256) check(sync.需求清单变更日志编号?.length > 0, '需求发生修改但没有变更日志编号');
  }
  const reports = [await fileRecord(root, syncFile), await fileRecord(root, `${task}/mainbasis-start.json`), await fileRecord(root, scanFile)];
  check(digest(upstream) === digest(await snapshot(root, config)) && digest(docs) === digest(await documents(root, config)), '发布期间输入发生变化');
  const baseline = { schemaVersion: '1.0', 项目目录: project, 上游: upstream, 文档: docs, 同步记录: reports, 同步时间: new Date().toISOString() };
  await write(path.join(directory, 'mainbasis-baseline.json'), baseline, true);
  // Publish the pointer last: an interrupted two-document update cannot become current.
  const destination = path.join(root, config.baseline);
  const temporary = `${destination}.${crypto.randomUUID()}.tmp`;
  await write(temporary, baseline);
  await fs.rename(temporary, destination);
  return { 状态: '需求基线已发布', 基线: config.baseline, 文档: docs };
}

export async function verifyMainBasis(root, project) {
  const config = await mainBasisConfig(root, project);
  check(config, '项目未配置 MainBasis');
  let baseline;
  try { baseline = await read(path.join(root, config.baseline)); }
  catch (error) { if (error.code === 'ENOENT') throw new Error('MainBasis 缺少同步基线：须先执行首次扫描、同步和汇总，不能把现有文档直接认定为最新'); throw error; }
  check(baseline.schemaVersion === '1.0' && baseline.项目目录 === project, 'MainBasis 基线身份不一致');
  check(digest(baseline.上游) === digest(await snapshot(root, config)), '上游文件或流程规则已变化：先同步 MainBasis，禁止复用旧用例输入');
  check(digest(baseline.文档) === digest(await documents(root, config)), 'MainBasis 文档已变化：重新核对并发布需求基线');
  check(baseline.同步记录?.length === 3, 'MainBasis 缺少同步记录');
  for (const report of baseline.同步记录) check(relative(report.路径) && report.路径.startsWith('work/') && digest(report) === digest(await fileRecord(root, report.路径)), '同步记录缺失或已变化');
  return { config, baseline, 基线SHA256: hash(await fs.readFile(path.join(root, config.baseline))) };
}

export async function validateMainBasisInput(root, manifest) {
  const config = await mainBasisConfig(root, manifest.项目目录);
  if (!config) return;
  const { baseline, 基线SHA256 } = await verifyMainBasis(root, manifest.项目目录);
  const freshOnly = config.policy.用例生成模式 === '全新生成';
  if (freshOnly) {
    check(config.policy.历史比较 === false && manifest.历史策略 === '不读取不比较', '全新生成必须禁用旧用例读取和历史比较');
    check(manifest.输入文件.every(item => item.角色 !== '历史参照' && !item.路径.startsWith('archive/')), '全新生成禁止历史或归档输入');
    check(!manifest.历史用例比较结果, '全新生成不得指定历史比较结果');
  }
  check(manifest.MainBasis基线?.路径 === config.baseline && manifest.MainBasis基线?.['SHA-256'] === 基线SHA256, '输入清单未绑定当前 MainBasis 基线');
  const [formal, risk] = baseline.文档;
  const sourceEntries = manifest.输入文件.filter(item => ['当前业务证据', '风险与缺口'].includes(item.角色));
  check(sourceEntries.length === 2, '用例阶段业务输入只能是 MainBasis 两份文档');
  for (const [file, role, mayDefine] of [[formal, '当前业务证据', true], [risk, '风险与缺口', false]]) {
    const entry = sourceEntries.find(item => item.路径 === file.路径);
    check(entry?.角色 === role && entry?.允许定义业务规则 === mayDefine && entry?.['SHA-256'] === file['SHA-256'], `MainBasis 输入角色或版本不正确：${file.路径}`);
  }
  return { freshOnly };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [action, project, task] = process.argv.slice(2);
  const root = process.cwd();
  try {
    let result;
    if (action === 'start') result = await startMainBasis(root, project, task);
    else if (action === 'seal') result = await sealMainBasis(root, project, task);
    else if (action === 'verify') { const verified = await verifyMainBasis(root, project); result = { 状态: '版本一致', 基线SHA256: verified.基线SHA256, 文档: verified.baseline.文档 }; }
    else if (action === 'inspect') { const config = await mainBasisConfig(root, project); check(config, '项目未配置 MainBasis'); const upstream = await snapshot(root, config); result = { 上游指纹: digest(upstream), 上游: upstream }; }
    else throw new Error('用法：node scripts/mainbasis.mjs <verify|inspect|start|seal> <项目相对目录> [新任务相对目录]');
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
