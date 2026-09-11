import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { validateGenerationInput } from "./validate-generation-input.mjs";
import { loadTestcaseLanguageRules, validateTestcaseRecords } from "./validate-testcase-json.mjs";

const hashFile = async (file) => crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const requirePass = (condition, message) => { if (!condition) throw new Error(message); };

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
  await validateGenerationInput(manifestFile, repoRoot, phase === "candidate" ? "pre-generate" : "final");
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
    requirePass(/^[a-f0-9]{64}$/.test(record.修改前SHA256), `缺少同步前基线：${record.路径}`);
  }
  const changed = sync.文件核对.filter((item) => item.修改前SHA256 !== item.修改后SHA256);
  requirePass(sync.需求清单有修改 === (changed.length > 0), "同步修改标记与实际哈希差异矛盾");
  if (changed.length) requirePass(sync.需求清单变更日志编号?.length > 0, "实际同步修改缺少变更日志");
  requirePass(Array.isArray(coverage.规则处理) && coverage.规则处理.length > 0, "覆盖清单缺少逐规则处理去向");
  const allowedDestinations = ["正式用例", "合并", "需求待确认", "范围外", "不适用", ...(sampledReview ? ['未逐条复核'] : [])];
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
  return { 状态: "通过", 阶段: phase, 输入清单SHA256: await hashFile(manifestFile), 候选SHA256: candidateHash };
}
