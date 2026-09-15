import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from 'node:url';
import { validateGenerationInput } from "./validate-generation-input.mjs";
import { loadTestcaseLanguageRules, validateTestcaseRecords } from "./validate-testcase-json.mjs";
import { localPath, fingerprint } from './requirement-traceability.mjs';
import { verifyMainBasis } from './mainbasis.mjs';

const hashFile = async (file) => crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const requirePass = (condition, message) => { if (!condition) throw new Error(message); };

export async function validateWorkbookExportPaths(taskDir, root, sourcePath, outputPath, {stage = false} = {}) {
  const manifest = await read(path.join(taskDir,'generation-input-manifest.json'));
  const finalFile = manifest.最终用例JSON || manifest.最终JSON;
  requirePass(finalFile && path.resolve(sourcePath) === path.resolve(localPath(root,finalFile)), '导出源必须是输入清单登记的最终 JSON');
  const destination = path.relative(root,path.resolve(outputPath)).split(path.sep).join('/');
  const stageDirectory = path.relative(root,path.join(taskDir,'stage-exports')).split(path.sep).join('/');
  requirePass(typeof manifest.项目名称 === 'string' && !/[\\/]/.test(manifest.项目名称)
    && destination.startsWith(stage ? `${stageDirectory}/` : `outputs/${manifest.项目名称}-case/`)
    && destination.endsWith('.xlsx') && (!stage || path.basename(destination).startsWith('阶段性-')),
    stage ? '阶段性工作簿必须写入本任务 stage-exports 目录且文件名以“阶段性-”开头' : '工作簿必须写入当前项目正式输出目录');
  localPath(root,destination);
  try { await fs.lstat(outputPath); throw new Error('工作簿已存在，必须使用新编号，禁止覆盖'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

export async function resolveTaskBatch(taskDir, root) {
  const relative = path.relative(path.resolve(root),path.resolve(taskDir)).split(path.sep).join('/');
  requirePass(/^work\/[^/]+(?:\/[^/]+)?$/.test(relative), '任务目录必须属于本轮 work 目录');
  const file = localPath(root,relative.split('/').slice(0,2).join('/') + '/batch.json');
  const batch = await read(file);
  if (relative.split('/').length === 3) requirePass(batch.端任务?.some(item => item.任务目录 === relative), '本端未登记在当前批次中');
  return {file, batch};
}

export function requireDeliverySatisfied(result) {
  requirePass(result.交付要求满足 === true, `本轮交付要求未满足：${result.后续动作 || '继续核对覆盖'}；可保存阶段性产物，不得标记任务完成`);
}

export const batchScope = batch => ({项目目录:batch.项目目录, 目标端:batch.目标端, 交付要求:batch.交付要求,
  端任务:batch.端任务?.map(({端名,任务目录,模块名称}) => ({端名,任务目录,...(模块名称!==undefined?{模块名称}:{})}))});

export async function authorizeWorkbookExport(taskDir, root, sourcePath, outputPath, options = {}) {
  await validateWorkbookExportPaths(taskDir,root,sourcePath,outputPath,options);
  const manifest = await read(path.join(taskDir,'generation-input-manifest.json'));
  if (options.stage || !manifest.MainBasis基线) return validateTestcaseDelivery(taskDir,root,{phase:'final'});
  const {file,batch} = await resolveTaskBatch(taskDir,root);
  const item = batch.端任务.find(item => path.resolve(localPath(root,item.任务目录)) === path.resolve(taskDir));
  requirePass(item?.工作簿 && path.resolve(localPath(root,item.工作簿)) === path.resolve(outputPath), '正式导出路径必须与批次登记的本端工作簿一致');
  const result = await validateTestcaseBatch(file,root);
  requireDeliverySatisfied(result);
  return result.端结果.find(end => end.端名 === item.端名);
}

export async function saveNewWorkbook(workbook, outputPath, beforePublish = async () => {}) {
  const temporary = `${outputPath}.${crypto.randomUUID()}.tmp.xlsx`;
  try {
    await workbook.save(temporary);
    await beforePublish();
    // Exclusive publication also protects against two exports choosing the same filename.
    await fs.copyFile(temporary,outputPath,fs.constants.COPYFILE_EXCL);
  } finally { await fs.rm(temporary,{force:true}); }
}

async function projectFingerprint(directory) {
  const files = [];
  async function visit(current) {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === '.DS_Store') continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) files.push({ path: path.relative(directory, absolute).split(path.sep).join('/'), hash: await hashFile(absolute) });
    }
  }
  await visit(directory);
  files.sort((a, b) => a.path.localeCompare(b.path, 'zh-CN'));
  return crypto.createHash('sha256').update(files.map(file => `${file.path}|${file.hash}`).join('\n')).digest('hex');
}

export async function validateTestcaseDelivery(taskDir, repoRoot, { phase = "final", workbook, candidate: candidateDraft } = {}) {
  requirePass(["candidate", "final"].includes(phase), "未知交付校验阶段");
  requirePass(!candidateDraft || phase === "candidate", "内存候选只能用于保存前的候选校验");
  requirePass(!workbook || phase === "final", "工作簿必须校验已经固定的最终候选");
  const manifestFile = path.join(taskDir, "generation-input-manifest.json");
  const version = await read(manifestFile);
  if (['3.0','3.1'].includes(version.schemaVersion)) {
    requirePass(!candidateDraft, 'source-first 必须先保存独立场景与候选后逐项验证');
    const { validateDiscovery } = await import('./validate-discovery.mjs');
    return validateDiscovery(taskDir,repoRoot,{phase:phase==='candidate'?'pre-generate':'final',workbook});
  }
  const inputCheck = await validateGenerationInput(manifestFile, repoRoot, phase === "candidate" ? "pre-generate" : "final");
  const manifest = await read(manifestFile);
  const entries = new Map(manifest.输入文件.map((entry) => [entry.路径, entry]));
  const readRegistered = async (name) => {
    const file = path.join(taskDir, name);
    const relative = path.relative(repoRoot, file).split(path.sep).join("/");
    requirePass(entries.has(relative), `交付依赖未登记：${name}`);
    return read(file);
  };
  const [scan, sync, coverage] = await Promise.all([
    readRegistered("global-evidence-scan-result.json"), readRegistered("prototype-context-sync-result.json"), readRegistered("coverage-matrix.json"),
  ]);
  // A reduced review must be explicitly authorized in this task, never inferred from a passing schema.
  let sampledReview = false;
  if (scan.复核方式 === '自动检查及抽查') {
    const authorization = scan.复核授权;
    const entry = entries.get(authorization?.路径);
    requirePass(entry?.角色 === '当前业务证据' && entry.内容类型 === '用户确认'
      && authorization?.SHA256 === entry['SHA-256'], '抽查方式缺少本次用户授权证据');
    const confirmed = await read(path.join(repoRoot, authorization.路径));
    sampledReview = [confirmed, ...(confirmed.补充确认 || [])].some(item => item.问题编号 === authorization.问题编号
      && item.复核方式 === '自动检查及抽查' && item.用户原答 === authorization.用户原答);
    requirePass(sampledReview && authorization.用户原答?.trim(), '抽查授权与当前用户确认不一致');
  }
  const passedStates = new Set(["通过", "有非阻塞待确认"]);
  requirePass(passedStates.has(scan.扫描状态) && Array.isArray(scan.阻塞项) && !scan.阻塞项.length, "证据语义扫描未完成");
  requirePass(/^[a-f0-9]{64}$/.test(scan.项目指纹 || ''), '缺少有效项目指纹');
  requirePass(scan.项目指纹 === await projectFingerprint(path.join(repoRoot, manifest.项目目录)), '项目文件清单或内容已变化，须重新确定扫描影响范围');
  requirePass(scan.缓存清理?.状态 === "成功" && !scan.缓存清理.清理后残留失效文件?.length, "失效缓存未完成隔离核对");
  requirePass(scan.项目接入基线?.状态 === "已确认", "缺少已确认项目身份基线");
  const records = new Map((scan.语义读取记录 || []).map((item) => [item.路径, item]));
  for (const entry of manifest.输入文件.filter((item) => item.角色 === "当前业务证据")) {
    const record = records.get(entry.路径);
    requirePass(record?.SHA256 === entry["SHA-256"] && record.结论 && record.关联规则 instanceof Array, `缺少当前证据语义读取记录：${entry.路径}`);
  }
  for (const entry of scan.规则基线 || []) {
    requirePass(await hashFile(path.join(repoRoot, entry.路径)) === entry["SHA-256"], `规则基线变化：${entry.路径}`);
  }
  requirePass((scan.规则基线 || []).some((entry) => entry.路径 === "AGENTS.md"), "缺少 AGENTS.md 规则基线");
  requirePass(passedStates.has(sync.同步状态) && Array.isArray(sync.阻塞异常) && !sync.阻塞异常.length, "原型与需求同步复核未完成");
  requirePass(Array.isArray(sync.文件核对) && sync.文件核对.length > 0, "同步结果缺少实际文件差异核对");
  for (const record of sync.文件核对) {
    requirePass(await hashFile(path.join(repoRoot, record.路径)) === record.修改后SHA256, `同步基线变化：${record.路径}`);
    const newMainBasis = manifest.历史策略 === '不读取不比较' && record.修改前SHA256 === null
      && record.文件原先不存在 === true && record.路径.startsWith(`${manifest.项目目录}/MainBasis/`);
    requirePass(newMainBasis || /^[a-f0-9]{64}$/.test(record.修改前SHA256), `缺少同步前基线：${record.路径}`);
  }
  const changed = sync.文件核对.filter((item) => item.修改前SHA256 !== item.修改后SHA256);
  requirePass(sync.需求清单有修改 === (changed.length > 0), "同步修改标记与实际哈希差异矛盾");
  if (changed.length) requirePass(sync.需求清单变更日志编号?.length > 0, "实际同步修改缺少变更日志");
  requirePass(Array.isArray(coverage.规则处理) && coverage.规则处理.length > 0, "覆盖清单缺少逐规则处理去向");
  const allowedDestinations = ["正式用例", "合并", "需求待确认", "范围外", "不适用", ...(sampledReview ? ['未逐条复核'] : []), ...(inputCheck.需求覆盖 ? ['生成待复核','未覆盖'] : [])];
  const unresolved = coverage.规则处理.filter((item) => !allowedDestinations.includes(item.去向) || !item.依据);
  requirePass(!unresolved.length, `仍有 ${unresolved.length} 项覆盖未完成复核`);
  const atoms = await readRegistered("evidence-atom-index.json");
  requirePass(Array.isArray(atoms.证据原子) && atoms.证据原子.length > 0, "证据原子索引为空");
  const atomIds = new Set(atoms.证据原子.map((item) => item.原子标识));
  requirePass(atomIds.size === atoms.证据原子.length, "证据原子标识重复");
  const covered = new Set(coverage.规则处理.map((item) => item.原子标识));
  requirePass(covered.size === coverage.规则处理.length && [...covered].every((id) => atomIds.has(id)), "覆盖清单包含重复或不存在的证据原子");
  for (const atom of atoms.证据原子 || []) requirePass(covered.has(atom.原子标识), `证据未记录处理去向：${atom.原子标识}`);
  if (manifest.覆盖展开策略版本 === "2.0") {
    requirePass(Array.isArray(coverage.场景映射) && coverage.场景映射.length > 0, "覆盖清单缺少规则到场景分支的映射");
    for (const mapping of coverage.场景映射) {
      for (const field of ["需求规则", "页面或功能", "状态", "分支", "可观察结果", "用例编号"]) {
        requirePass(typeof mapping[field] === "string" && mapping[field].trim(), `场景映射缺少${field}`);
      }
      requirePass(Array.isArray(mapping.操作), "场景映射操作必须为数组");
    }
    const pageBehavior = await readRegistered("page-behavior-map.json");
    requirePass(Array.isArray(pageBehavior.页面) && pageBehavior.页面.length > 0, "页面内部行为映射为空");
    for (const page of pageBehavior.页面) {
      requirePass(page.页面内部信号 && Object.values(page.页面内部信号).every(Number.isInteger), `页面内部行为信号不完整：${page.页面}`);
      requirePass(Array.isArray(page.已映射场景分支), `页面缺少场景分支映射：${page.页面}`);
    }
  }
  const candidatePath = phase === "candidate" ? null : path.join(repoRoot, manifest.当前候选用例);
  const candidate = candidateDraft || (candidatePath ? await read(candidatePath) : null);
  const candidateHash = candidateDraft ? crypto.createHash("sha256").update(JSON.stringify(candidateDraft, null, 2) + "\n").digest("hex") : candidatePath ? await hashFile(candidatePath) : null;
  if (candidate) {
    const cases = new Set(candidate.测试用例.map((item) => item.备注.find((note) => note.startsWith("规则："))?.slice(3)));
    const questions = new Set(candidate.需求待确认.map((item) => item.问题编号));
    const caseIds = new Set(candidate.测试用例.map((item) => item.用例编号));
    const caseBranches = new Map(candidate.测试用例.map((item) => [item.备注.find((note) => note.startsWith("分支："))?.slice(3), item.用例编号]));
    for (const item of coverage.规则处理) {
      if (["正式用例", "合并"].includes(item.去向)) requirePass(item.规则标识?.length && item.规则标识.every((id) => cases.has(id)), `覆盖指向不存在的正式规则：${item.原子标识}`);
      if (item.去向 === "需求待确认") requirePass(questions.has(item.问题编号), `覆盖指向不存在的需求问题：${item.原子标识}`);
      if (['生成待复核','未覆盖'].includes(item.去向)) {
        requirePass(inputCheck.需求覆盖?.交付性质 === '部分覆盖', '生成缺口不能声明完整覆盖');
        requirePass(!(item.规则标识 || []).some(id => cases.has(id)), '生成待复核规则仍进入正式候选');
        inputCheck.需求覆盖.未完成项.push({原子标识:item.原子标识, 规则标识:item.规则标识 || [], 状态:'未覆盖', 说明:item.说明 || item.去向});
      }
    }
    if (manifest.覆盖展开策略版本 === "2.0") for (const mapping of coverage.场景映射) {
      if (mapping.用例编号 === "需求待确认") continue;
      requirePass(caseIds.has(mapping.用例编号) && caseBranches.get(mapping.分支) === mapping.用例编号, `场景分支未映射到对应正式用例：${mapping.分支}`);
    }
    const result = validateTestcaseRecords(candidate, await loadTestcaseLanguageRules());
    requirePass(result.状态 === "通过", result.问题.join("；"));
    const dedup = await readRegistered("semantic-dedup-review.json");
    requirePass(dedup.候选SHA256 === candidateHash && Array.isArray(dedup.待人工复核) && !dedup.待人工复核.length, "语义去重复核缺失、未完成或已失效");
    requirePass(Array.isArray(dedup.复核结果) && dedup.复核结果.length > 0, "语义去重复核缺少逐规则判定，空报告不能放行");
    const reviewed = new Set();
    const currentIds = new Set(candidate.测试用例.map((item) => item.用例编号));
    const outcomes = new Set(["保留", "合并", "实现变体", "用户指定覆盖"]);
    for (const record of dedup.复核结果) {
      requirePass(outcomes.has(record.判定), "语义去重复核仍有未关闭的判定");
      for (const field of ["稳定规则标识", "归一化业务键", "状态关系", "关键操作", "可观察结果", "保留或合并目标", "判定理由"]) {
        requirePass(typeof record[field] === "string" && record[field].trim(), `语义去重复核缺少${field}`);
      }
      requirePass(Array.isArray(record.基础条件) && Array.isArray(record.附加条件), "语义去重复核缺少条件删除分析");
      requirePass(record.证据?.length && record.证据.every((source) => entries.get(source.路径)?.角色 === "当前业务证据" && entries.get(source.路径)?.["SHA-256"] === source["SHA-256"]), "去重复核未引用当前证据");
      requirePass(record.候选用例追溯?.length && record.候选用例追溯.every((id) => currentIds.has(id)), "去重复核指向不存在的候选用例");
      requirePass(currentIds.has(record.保留或合并目标) || cases.has(record.保留或合并目标), "去重复核没有有效保留目标");
      reviewed.add(record.稳定规则标识);
    }
    for (const id of cases) requirePass(reviewed.has(id), `正式规则未完成去重复核：${id}`);
  }
  if (workbook) {
    const report = await read(path.join(taskDir, "delivery-verification.json"));
    requirePass(report.状态 === "通过" && report.JSON一致性差异数 === 0, "Excel 内容核对未通过");
    requirePass(report.工作簿SHA256 === await hashFile(workbook), "Excel 检查报告对应的文件已变化");
    requirePass(report.候选SHA256 === await hashFile(candidatePath), "Excel 检查报告对应的候选已变化");
  }
  return { 状态: "通过", 阶段: phase, 输入清单SHA256: await hashFile(manifestFile), 候选SHA256: candidateHash,
    ...(inputCheck.需求覆盖 ? { 需求覆盖: inputCheck.需求覆盖 } : {}) };
}

export function validateBatchAgreement(batch, manifests, states) {
  requirePass(batch.schemaVersion === '1.0' && ['完整覆盖','允许部分交付'].includes(batch.交付要求), '批次缺少版本或明确交付要求');
  requirePass(Array.isArray(batch.目标端) && batch.目标端.length >= 1 && batch.目标端.every(end => typeof end === 'string' && end.trim())
    && new Set(batch.目标端).size === batch.目标端.length, '批次目标端为空或重复');
  requirePass(Array.isArray(batch.端任务) && batch.端任务.length === batch.目标端.length
    && new Set(batch.端任务.map(item => item.端名)).size === batch.目标端.length
    && batch.端任务.every(item => batch.目标端.includes(item.端名)), '端任务没有覆盖原定全部目标端');
  requirePass(manifests.length === batch.端任务.length && states.length === manifests.length, '批次端侧输入不完整');
  const basis = manifests[0].MainBasis基线;
  requirePass(basis?.路径 && /^[a-f0-9]{64}$/.test(basis['SHA-256']), '批次缺少 MainBasis 版本');
  for (const [index, manifest] of manifests.entries()) {
    requirePass(manifest.项目目录 === batch.项目目录 && manifest.任务工作目录 === batch.端任务[index].任务目录
      && manifest.目标范围?.端名 === batch.端任务[index].端名, '批次项目、端或任务目录不一致');
    if (batch.端任务[index].模块名称!==undefined) requirePass(batch.端任务[index].模块名称 === manifest.目标范围?.模块名称, '端侧模块范围与任务最初登记不一致');
    requirePass(fingerprint(manifest.MainBasis基线) === fingerprint(basis), '三端使用了不同 MainBasis 版本');
    requirePass(Array.isArray(states[index]?.状态转换) && fingerprint(states[index]) === fingerprint(states[0]), '三端没有使用同一份共享状态转换基线');
  }
}

export function summarizeBatchCoverage(batch, results) {
  const unfinished = results.flatMap(result => (result.需求覆盖.未完成项 || []).map(item => ({端名:result.端名,...item})));
  const complete = results.every(result => result.需求覆盖.交付性质 === '完整覆盖') && !unfinished.length;
  const satisfied = complete || batch.交付要求 === '允许部分交付';
  const action = satisfied ? (complete ? '可完整交付' : '可按授权部分交付')
    : unfinished.some(item => item.状态 === '未覆盖') ? '继续补齐生成缺口'
    : unfinished.length ? '等待业务确认' : '复核交付性质声明';
  return {交付性质:complete?'完整覆盖':'部分覆盖',交付要求满足:satisfied,后续动作:action,未完成项:unfinished};
}

export async function validateTestcaseBatch(batchFile, repoRoot = process.cwd(), {workbooks = false} = {}) {
  const root = path.resolve(repoRoot), file = path.resolve(batchFile), batchHash = await hashFile(file), batch = await read(file);
  const family = path.relative(root, path.dirname(file)).split(path.sep).join('/');
  requirePass(/^work\/[^/]+$/.test(family), '批次清单必须位于本轮 work 一级目录');
  const metrics = await read(localPath(root,`${family}/pipeline-metrics.json`));
  requirePass(metrics.任务?.交付范围 && fingerprint(metrics.任务.交付范围) === fingerprint(batchScope(batch)), '批次范围未在 task-start 固定或已变更；不得自行降低交付要求');
  requirePass(Array.isArray(batch.端任务), '缺少批次端任务');
  const manifests = [], states = [], results = [];
  for (const item of batch.端任务) {
    requirePass(item.任务目录?.startsWith(`${family}/`), '端任务不得来自旧任务或其他批次');
    const manifest = await read(localPath(root, `${item.任务目录}/generation-input-manifest.json`));
    requirePass(manifest.状态转换基线?.startsWith(`${item.任务目录}/`), '状态基线必须属于本轮端任务');
    manifests.push(manifest); states.push(await read(localPath(root, manifest.状态转换基线)));
  }
  validateBatchAgreement(batch, manifests, states);
  for (const item of batch.端任务) {
    if (workbooks) {
      const manifest = manifests[results.length];
      requirePass(item.工作簿?.startsWith(`outputs/${manifest.项目名称}-case/`) && item.工作簿.endsWith('.xlsx'), '批次缺少当前项目正式工作簿路径');
      const verification = await read(localPath(root,`${item.任务目录}/delivery-verification.json`));
      requirePass(verification.导出用途 === '正式交付', '阶段性或旧版导出检查不能代替正式交付检查');
    }
    const result = await validateTestcaseDelivery(localPath(root, item.任务目录), root, {
      phase:'final', ...(workbooks ? {workbook:localPath(root, item.工作簿)} : {}),
    });
    requirePass(result.需求覆盖, '批次没有完成 MainBasis 全文覆盖核对');
    results.push({端名:item.端名, ...result});
  }
  // Recheck after all ends: a later end must not make an earlier check stale.
  requirePass(await hashFile(file) === batchHash, '批次范围在检查期间变化');
  for (const [index, manifest] of manifests.entries()) {
    requirePass(await hashFile(localPath(root, `${manifest.任务工作目录}/generation-input-manifest.json`)) === results[index].输入清单SHA256, '端侧输入清单在批次检查期间变化');
    for (const entry of manifest.输入文件) requirePass(await hashFile(localPath(root,entry.路径)) === entry['SHA-256'], '端侧输入在批次检查期间变化');
    if (workbooks) {
      const item = batch.端任务[index], verification = await read(localPath(root,`${item.任务目录}/delivery-verification.json`));
      requirePass(await hashFile(localPath(root,item.工作簿)) === verification.工作簿SHA256, '工作簿在批次检查期间变化');
    }
  }
  const current = await verifyMainBasis(root, batch.项目目录);
  if (current.config.policy.原型目录结构) requirePass(batch.端任务.every(item=>typeof item.模块名称==='string' && item.模块名称.trim()), '原型目录项目必须在批次开始时登记各端模块范围');
  requirePass(current.基线SHA256 === manifests[0].MainBasis基线['SHA-256'], 'MainBasis 版本在批次检查期间变化');
  return {状态:'有效用例校验通过',...summarizeBatchCoverage(batch,results),批次SHA256:batchHash,端结果:results};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [command, file, option] = process.argv.slice(2);
  try {
    requirePass(command === '--batch' && file && (!option || option === '--workbooks'), '用法：validate-testcase-delivery.mjs --batch <本轮batch.json> [--workbooks]');
    const result = await validateTestcaseBatch(file,process.cwd(),{workbooks:option==='--workbooks'});
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
    if (!result.交付要求满足) process.exitCode = 2;
  } catch (error) { process.stderr.write(error.message+'\n'); process.exitCode = 1; }
}
