#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { hasBalancedDelimiters, splitAtomicResults, loadTestcaseLanguageRules, validateTestcaseJson } from "./validate-testcase-json.mjs";
import { casesFromCatalog, coverageBranches, validateCoverageExpansion, validateRuleDesign } from "./testcase-design.mjs";
import { validateMainBasisInput } from './mainbasis.mjs';
import { validateCoverageInput } from './requirement-traceability.mjs';
import {validateModuleAssignment, moduleSection} from './prototype-directory.mjs';

const ROLES = new Set(["当前业务证据", "风险与缺口", "本次派生产物", "历史参照", "样式参照", "执行工具"]);
const RULE_STATUSES = new Set(["已确认规则", "实现推导", "来源冲突", "证据缺口", "生成待复核"]);
const HISTORY_DECISIONS = new Set(["继续有效", "需要重写", "合并", "已被替代", "应当废弃", "待人工复核"]);
const GENERATABLE_STATUSES = new Set(["已确认规则", "实现推导"]);

function fail(message) {
  throw new Error(message);
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label}必须是非空字符串`);
}

function requireArray(value, label) {
  if (!Array.isArray(value)) fail(`${label}必须是数组`);
}

function normalizeRelative(value, label) {
  requireString(value, label);
  if (path.isAbsolute(value)) fail(`${label}必须使用仓库相对路径：${value}`);
  const normalized = path.normalize(value).split(path.sep).join("/");
  if (normalized === ".." || normalized.startsWith("../")) fail(`${label}不能越过仓库根目录：${value}`);
  return normalized.replace(/^\.\//, "");
}

function isInside(candidate, directory) {
  return candidate === directory || candidate.startsWith(`${directory}/`);
}

async function sha256(filePath) {
  return crypto.createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
}

async function readJson(filePath, label) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    fail(`${label}无法解析：${filePath}；${error.message}`);
  }
}

function sameScope(left, right) {
  return left?.端名 === right?.端名 && left?.模块名称 === right?.模块名称;
}

export async function validateGenerationInput(manifestFile, repoRoot = process.cwd(), phase = "final") {
  if (!new Set(["pre-generate", "final"]).has(phase)) fail(`不支持的校验阶段：${phase}`);
  const root = path.resolve(repoRoot);
  const manifestPath = path.resolve(manifestFile);
  const manifest = await readJson(manifestPath, "生成输入角色清单");

  const { freshOnly = false, requiresCoverage = false, moduleDirectory } = await validateMainBasisInput(root, manifest) || {};
  if (freshOnly) {
    const taskFamily = String(manifest.任务工作目录 || '').split('/').slice(0, 2).join('/');
    for (const input of manifest.输入文件) {
      if (input.角色 === '执行工具' && input.路径?.startsWith('work/')
        && (!/^work\/[^/]+$/.test(taskFamily) || !isInside(input.路径, taskFamily))) {
        fail(`全新生成不得读取旧任务脚本作为工具：${input.路径}；请使用 scripts/ 通用工具或本次任务内新建设计`);
      }
    }
  }

  const requirementCoverage = requiresCoverage ? await validateCoverageInput(root, manifest, phase) : null;
  if (['3.0','3.1','3.2'].includes(manifest.schemaVersion)) {
    const { validateDiscovery } = await import('./validate-discovery.mjs');
    return validateDiscovery(path.dirname(manifestPath), root, { phase });
  }

  if (manifest.schemaVersion !== "1.0") fail("generation-input-manifest.json schemaVersion 必须为 1.0");
  requireString(manifest.项目名称, "项目名称");
  requireString(manifest.任务标识, "任务标识");
  if (manifest.生成策略 !== "current-evidence-only") fail("生成策略必须为 current-evidence-only");
  requireString(manifest.目标范围?.端名, "目标范围.端名");
  requireString(manifest.目标范围?.模块名称, "目标范围.模块名称");

  const projectDirectory = normalizeRelative(manifest.项目目录, "项目目录");
  if (projectDirectory.startsWith("work/") || projectDirectory.startsWith("outputs/")) {
    fail("项目目录不能位于 work/ 或 outputs/ 下");
  }
  const taskWork = normalizeRelative(manifest.任务工作目录, "任务工作目录");
  if (!taskWork.startsWith("work/")) fail("任务工作目录必须位于 work/ 下");
  const manifestRelative = path.relative(root, manifestPath).split(path.sep).join("/");
  if (!isInside(manifestRelative, taskWork)) fail("generation-input-manifest.json 必须位于本次任务工作目录");

  requireArray(manifest.输入文件, "输入文件");
  const entries = new Map();
  for (const [index, raw] of manifest.输入文件.entries()) {
    const label = `输入文件[${index}]`;
    const relativePath = normalizeRelative(raw.路径, `${label}.路径`);
    if (entries.has(relativePath)) fail(`输入路径重复登记：${relativePath}`);
    requireString(raw["SHA-256"], `${label}.SHA-256`);
    if (!/^[a-f0-9]{64}$/.test(raw["SHA-256"])) fail(`${label}.SHA-256 格式错误`);
    if (!ROLES.has(raw.角色)) fail(`${label}.角色不合法：${raw.角色}`);
    requireString(raw.内容类型, `${label}.内容类型`);
    if (typeof raw.允许定义业务规则 !== "boolean") fail(`${label}.允许定义业务规则必须是布尔值`);

    const absolutePath = path.resolve(root, relativePath);
    if (!isInside(absolutePath, root)) fail(`输入路径越过仓库根目录：${relativePath}`);
    let stat;
    try {
      stat = await fs.stat(absolutePath);
    } catch {
      fail(`输入文件不存在：${relativePath}`);
    }
    if (!stat.isFile()) fail(`输入路径不是文件：${relativePath}`);
    const actualHash = await sha256(absolutePath);
    if (actualHash !== raw["SHA-256"]) fail(`输入文件哈希不一致：${relativePath}`);

    if (raw.角色 === "当前业务证据" && !raw.允许定义业务规则) {
      fail(`当前业务证据必须允许定义业务规则：${relativePath}`);
    }
    if (raw.角色 === "当前业务证据") {
      const isTaskEvidence = isInside(relativePath, taskWork)
        && new Set(["用户确认", "已确认决策摘录"]).has(raw.内容类型);
      if (!isInside(relativePath, projectDirectory) && !isTaskEvidence) {
        fail(`当前业务证据必须位于当前项目目录，本次任务用户确认或已确认决策摘录除外：${relativePath}`);
      }
    }
    if (raw.角色 === "本次派生产物") {
      const mayDefine = raw.内容类型 === "业务规则清单";
      if (raw.允许定义业务规则 !== mayDefine) fail(`本次派生产物的规则权限错误：${relativePath}`);
      if (!isInside(relativePath, taskWork)) fail(`本次派生产物必须位于任务工作目录：${relativePath}`);
    }
    if (new Set(["风险与缺口", "历史参照", "样式参照", "执行工具"]).has(raw.角色) && raw.允许定义业务规则) {
      fail(`${raw.角色}不得定义业务规则：${relativePath}`);
    }
    if (/历史|旧用例/.test(raw.内容类型) && raw.内容类型 !== "历史用例比较结果" && raw.角色 !== "历史参照") {
      fail(`历史内容必须标记为历史参照：${relativePath}`);
    }
    if (/\.xlsx$/i.test(relativePath) && !new Set(["历史参照", "样式参照"]).has(raw.角色)) {
      fail(`Excel 输入只能作为历史参照或样式参照：${relativePath}`);
    }
    entries.set(relativePath, { ...raw, 路径: relativePath, absolutePath });
  }

  for (const entry of entries.values()) {
    if (entry.角色 !== "当前业务证据" || entry.内容类型 !== "已确认决策摘录") continue;
    const extract = await readJson(entry.absolutePath, "已确认决策摘录");
    if (extract.schemaVersion !== "1.0") fail("confirmed-decision-extract.json schemaVersion 必须为 1.0");
    if (extract.项目名称 !== manifest.项目名称 || !sameScope(extract.目标范围, manifest.目标范围)) {
      fail("已确认决策摘录的项目或目标范围与输入清单不一致");
    }
    const sourcePath = normalizeRelative(extract.来源文件?.路径, "已确认决策摘录.来源文件.路径");
    requireString(extract.来源文件?.["SHA-256"], "已确认决策摘录.来源文件.SHA-256");
    const sourceEntry = entries.get(sourcePath);
    if (!sourceEntry || sourceEntry.角色 !== "历史参照" || sourceEntry["SHA-256"] !== extract.来源文件["SHA-256"]) {
      fail(`决策摘录来源必须按相同哈希登记为历史参照：${sourcePath}`);
    }
    requireArray(extract.决策, "已确认决策摘录.决策");
    if (extract.决策.length === 0) fail("已确认决策摘录至少包含一条决策");
    for (const [index, decision] of extract.决策.entries()) {
      const label = `已确认决策摘录.决策[${index}]`;
      requireString(decision.来源位置, `${label}.来源位置`);
      requireString(decision.问题编号, `${label}.问题编号`);
      requireString(decision.已确认结论, `${label}.已确认结论`);
      requireArray(decision.适用范围, `${label}.适用范围`);
      if (decision.当前适用性 !== "继续有效") fail(`${label}.当前适用性必须为继续有效`);
      requireString(decision.适用性依据, `${label}.适用性依据`);
    }
  }

  const catalogRelative = normalizeRelative(manifest.当前业务规则清单, "当前业务规则清单");
  const catalogEntry = entries.get(catalogRelative);
  if (!catalogEntry || catalogEntry.角色 !== "本次派生产物" || catalogEntry.内容类型 !== "业务规则清单" || !catalogEntry.允许定义业务规则) {
    fail("当前业务规则清单必须登记为允许定义规则的本次派生产物");
  }
  const catalog = await readJson(catalogEntry.absolutePath, "当前业务规则清单");
  if (catalog.schemaVersion !== "1.0") fail("business-rule-catalog.json schemaVersion 必须为 1.0");
  if (catalog.项目名称 !== manifest.项目名称 || !sameScope(catalog.目标范围, manifest.目标范围)) {
    fail("当前业务规则清单的项目或目标范围与输入清单不一致");
  }
  requireArray(catalog.规则, "当前业务规则清单.规则");
  const languageRules = await loadTestcaseLanguageRules();
  const coverageV2 = manifest.覆盖展开策略版本 === "2.0";
  const evidenceTexts = new Map();
  const ruleIds = new Set();
  for (const rule of catalog.规则) {
    requireString(rule.稳定规则标识, "业务规则.稳定规则标识");
    if (ruleIds.has(rule.稳定规则标识)) fail(`稳定规则标识重复：${rule.稳定规则标识}`);
    ruleIds.add(rule.稳定规则标识);
    if (coverageV2) {
      const coverageIssues = validateCoverageExpansion(rule, languageRules);
      if (coverageIssues.length) fail(`${rule.稳定规则标识}：${coverageIssues.join("；")}`);
    }
  }
  const validationRules = coverageV2
    ? catalog.规则.flatMap((rule) => coverageBranches(rule).map((branch) => branch.原子规则))
    : catalog.规则;
  if (moduleDirectory) validateModuleAssignment(moduleDirectory,manifest.目标范围,validationRules);
  const atomicRuleIds = new Set();
  for (const [index, rule] of validationRules.entries()) {
    const label = `规则[${index}]`;
    requireString(rule.稳定规则标识, `${label}.稳定规则标识`);
    if (atomicRuleIds.has(rule.稳定规则标识)) fail(`原子规则标识重复：${rule.稳定规则标识}`);
    atomicRuleIds.add(rule.稳定规则标识);
    requireString(rule.业务对象, `${label}.业务对象`);
    if (/\s\/\s/u.test(rule.业务对象)) fail(`${label}.业务对象仍合并多个斜杠维度`);
    if (!hasBalancedDelimiters(rule.业务对象)) fail(`${label}.业务对象存在未闭合引号或括号`);
    if (typeof rule.执行角色 !== "string") fail(`${label}.执行角色必须是字符串`);
    requireArray(rule.适用角色和端, `${label}.适用角色和端`);
    if (rule.适用角色和端.some((item) => typeof item !== "string" || !item.trim())) fail(`${label}.适用角色和端必须是非空字符串数组`);
    if (rule.可生成正式用例 && (!rule.执行角色.trim() || rule.适用角色和端.length !== 1 || !rule.适用角色和端[0].includes(rule.执行角色))) {
      fail(`${label}必须只包含一个执行角色，且适用角色和端必须与执行角色一致`);
    }
    if (rule.可生成正式用例 && (rule.原子动作数量 !== 1 || rule.原子结果数量 !== 1)) {
      fail(`${label}必须声明一个原子动作和一个原子结果`);
    }
    if (typeof rule.触发动作 !== "string") fail(`${label}.触发动作必须是字符串`);
    if (rule.可生成正式用例) requireString(rule.触发动作, `${label}.触发动作`);
    requireArray(rule.必要条件, `${label}.必要条件`);
    if (typeof rule.来源状态 !== "string") fail(`${label}.来源状态必须是字符串`);
    if (typeof rule.目标状态或可观察结果 !== "string") fail(`${label}.目标状态或可观察结果必须是字符串`);
    if (!RULE_STATUSES.has(rule.规则状态)) fail(`${label}.规则状态不合法：${rule.规则状态}`);
    if (typeof rule.可生成正式用例 !== "boolean") fail(`${label}.可生成正式用例必须是布尔值`);
    if (rule.可生成正式用例) {
      if (!moduleDirectory && !manifest.目标范围.模块名称.split('、').includes(rule.功能模块)) fail(`正式规则模块超出本次范围：${rule.稳定规则标识}`);
      if (rule.适用角色和端[0] !== `${manifest.目标范围.端名}-${rule.执行角色}`) fail(`正式规则归属端超出本次范围：${rule.稳定规则标识}`);
      const designIssues = validateRuleDesign(rule, languageRules);
      if (designIssues.length) fail(`${rule.稳定规则标识}：${designIssues.join("；")}`);
    }
    if (rule.可生成正式用例 && !GENERATABLE_STATUSES.has(rule.规则状态)) {
      fail(`来源冲突、证据缺口或生成待复核不能生成正式用例：${rule.稳定规则标识}`);
    }
    if (rule.可生成正式用例 && !rule.目标状态或可观察结果.trim()) {
      fail(`可生成规则缺少可观察结果：${rule.稳定规则标识}`);
    }
    if (rule.可生成正式用例 && splitAtomicResults(rule.目标状态或可观察结果).length !== 1) {
      fail(`可生成规则包含多个独立观察结果：${rule.稳定规则标识}`);
    }
    if (rule.可生成正式用例 && /^(?:提示|显示|展示|更新|关闭|返回|进入|成功|失败)$/u.test(rule.目标状态或可观察结果.trim())) {
      fail(`可生成规则缺少确定结果内容：${rule.稳定规则标识}`);
    }
    if (rule.可生成正式用例 && /绿色|红色|蓝色|灰色|橙色|黄色/u.test(rule.目标状态或可观察结果)) {
      fail(`默认功能规则包含视觉颜色验证：${rule.稳定规则标识}`);
    }
    if (!hasBalancedDelimiters(rule.目标状态或可观察结果)) fail(`${label}.目标结果存在未闭合引号或括号`);
    requireArray(rule.证据引用, `${label}.证据引用`);
    if (rule.可生成正式用例 && rule.证据引用.length === 0) fail(`可生成规则缺少当前证据：${rule.稳定规则标识}`);
    for (const [evidenceIndex, evidence] of rule.证据引用.entries()) {
      const evidenceLabel = `${label}.证据引用[${evidenceIndex}]`;
      const evidencePath = normalizeRelative(evidence.路径, `${evidenceLabel}.路径`);
      requireString(evidence["SHA-256"], `${evidenceLabel}.SHA-256`);
      requireString(evidence.位置, `${evidenceLabel}.位置`);
      requireString(evidence.证明内容, `${evidenceLabel}.证明内容`);
      const evidenceEntry = entries.get(evidencePath);
      if (!evidenceEntry || (evidenceEntry.角色 !== "当前业务证据" && !(evidenceEntry.角色 === "风险与缺口" && !rule.可生成正式用例))) {
        fail(`规则只能引用当前业务证据：${rule.稳定规则标识} -> ${evidencePath}`);
      }
      if (evidenceEntry["SHA-256"] !== evidence["SHA-256"]) {
        fail(`规则证据哈希与输入清单不一致：${rule.稳定规则标识} -> ${evidencePath}`);
      }
      if (rule.可生成正式用例) {
        requireString(evidence.原文, `${evidenceLabel}.原文`);
        if (!evidenceTexts.has(evidencePath)) {
          const evidenceText=await fs.readFile(evidenceEntry.absolutePath,'utf8');
          evidenceTexts.set(evidencePath,moduleDirectory ? evidenceText.replace(moduleSection(evidenceText),'') : evidenceText);
        }
        if (!evidenceTexts.get(evidencePath).includes(evidence.原文)) fail(`引用原文未在当前业务正文命中，目录不能证明业务预期：${rule.稳定规则标识} -> ${evidencePath}`);
      }
    }
  }

  const generatorRelative = normalizeRelative(manifest.生成脚本, "生成脚本");
  const generatorEntry = entries.get(generatorRelative);
  if (!generatorEntry || generatorEntry.角色 !== "执行工具" || generatorEntry.允许定义业务规则) {
    fail("生成脚本必须登记为禁止定义业务规则的执行工具");
  }
  const generatorText = await fs.readFile(generatorEntry.absolutePath, "utf8");
  const historicalEntries = [...entries.values()].filter((entry) => entry.角色 === "历史参照");
  for (const entry of historicalEntries) {
    if (generatorText.includes(entry.路径) || generatorText.includes(path.basename(entry.路径))) {
      fail(`生成脚本不得直接引用原始历史文件：${entry.路径}`);
    }
  }

  let historyCount = 0;
  if (phase === "final") {
    const candidateRelative = normalizeRelative(manifest.当前候选用例, "当前候选用例");
    const finalRelative = normalizeRelative(manifest.最终用例JSON, "最终用例JSON");
    if (candidateRelative === finalRelative) fail("当前候选用例和最终用例 JSON 必须分别保存，不能覆盖候选");
    const candidateEntry = entries.get(candidateRelative);
    const finalEntry = entries.get(finalRelative);
    if (!candidateEntry || candidateEntry.角色 !== "本次派生产物" || candidateEntry.内容类型 !== "当前候选用例" || candidateEntry.允许定义业务规则) {
      fail("当前候选用例必须登记为禁止定义规则的本次派生产物");
    }
    if (!finalEntry || finalEntry.角色 !== "本次派生产物" || finalEntry.内容类型 !== "最终用例JSON" || finalEntry.允许定义业务规则) {
      fail("最终用例 JSON 必须登记为禁止定义规则的本次派生产物");
    }
    if (candidateEntry["SHA-256"] !== finalEntry["SHA-256"]) {
      fail("最终用例 JSON 与当前候选用例的 SHA-256 不一致，禁止历史比较后局部修改");
    }
    const candidate = await readJson(candidateEntry.absolutePath, "当前候选用例");
    if (moduleDirectory) validateModuleAssignment(moduleDirectory,manifest.目标范围,validationRules,candidate.需求待确认);
    if (moduleDirectory) for (const question of candidate.需求待确认.filter(item=>item.功能模块==='待映射')) {
      if (requirementCoverage.交付性质 !== '部分覆盖') fail('问题模块归属未完成，不能声明完整覆盖');
      requirementCoverage.未完成项.push({问题编号:question.问题编号,状态:'未覆盖',说明:'需求问题的模块归属尚未整理；不是新增业务待确认'});
    }
    const jsonCheck = await validateTestcaseJson(candidateEntry.absolutePath);
    if (jsonCheck.状态 !== "通过") fail(`候选语言校验失败：${jsonCheck.问题.join("；")}`);
    const caseIds = new Set(candidate.测试用例.map((item) => item.用例编号));
    const usedRules = new Set();
    for (const item of candidate.测试用例) {
      const id = item.备注.find((note) => note.startsWith("规则："))?.slice(3);
      const rule = catalog.规则.find((entry) => entry.稳定规则标识 === id
        && (coverageV2 ? coverageBranches(entry).some((branch) => branch.原子规则.可生成正式用例) : entry.可生成正式用例));
      if (!rule) fail(`正式用例未映射当前可生成规则：${item.用例编号}`);
      usedRules.add(id);
    }
    const prefix = candidate.测试用例[0]?.用例编号.replace(/-\d+$/, "") || "CASE";
    const renderedCases = casesFromCatalog(catalog,{moduleDirectory,coverageV2,prefix});
    if (JSON.stringify(renderedCases) !== JSON.stringify(candidate.测试用例)) fail("正式字段或场景分支顺序与已复核设计不一致");
    for (const rule of catalog.规则.filter((item) => coverageV2 ? coverageBranches(item).some((branch) => branch.原子规则.可生成正式用例) : item.可生成正式用例)) {
      if (!usedRules.has(rule.稳定规则标识)) fail(`当前可生成规则没有正式用例覆盖：${rule.稳定规则标识}`);
    }

    if (!freshOnly) {
    const comparisonRelative = normalizeRelative(manifest.历史用例比较结果, "历史用例比较结果");
    const comparisonEntry = entries.get(comparisonRelative);
    if (!comparisonEntry || comparisonEntry.角色 !== "本次派生产物" || comparisonEntry.内容类型 !== "历史用例比较结果" || comparisonEntry.允许定义业务规则) {
      fail("历史用例比较结果必须登记为禁止定义规则的本次派生产物");
    }
    const comparison = await readJson(comparisonEntry.absolutePath, "历史用例比较结果");
    if (comparison.schemaVersion !== "1.0") fail("historical-case-comparison.json schemaVersion 必须为 1.0");
    if (comparison.项目名称 !== manifest.项目名称 || !sameScope(comparison.目标范围, manifest.目标范围)) {
      fail("历史用例比较结果的项目或目标范围与输入清单不一致");
    }
    const comparedCandidatePath = normalizeRelative(comparison.候选JSON?.路径, "历史用例比较结果.候选JSON.路径");
    requireString(comparison.候选JSON?.["SHA-256"], "历史用例比较结果.候选JSON.SHA-256");
    if (comparedCandidatePath !== candidateRelative || comparison.候选JSON["SHA-256"] !== candidateEntry["SHA-256"]) {
      fail("历史用例比较结果引用的候选 JSON 路径或哈希不一致");
    }
    requireArray(comparison.历史输入, "历史用例比较结果.历史输入");
    const historicalCases = new Map();
    for (const [index, item] of comparison.历史输入.entries()) {
      const historicalPath = normalizeRelative(item.路径, `历史输入[${index}].路径`);
      requireString(item["SHA-256"], `历史输入[${index}].SHA-256`);
      const historicalEntry = entries.get(historicalPath);
      if (!historicalEntry || historicalEntry.角色 !== "历史参照" || historicalEntry["SHA-256"] !== item["SHA-256"]) {
        fail(`历史输入未按相同哈希登记为历史参照：${historicalPath}`);
      }
      if (historicalPath.endsWith(".json")) {
        const historical = await readJson(historicalEntry.absolutePath, "历史参照");
        for (const record of historical.测试用例 || []) historicalCases.set(`${historicalPath}|${record.用例编号}`, record);
      }
    }
    requireArray(comparison.比较结果, "历史用例比较结果.比较结果");
    historyCount = comparison.比较结果.length;
    const comparedHistory = new Set();
    for (const [index, item] of comparison.比较结果.entries()) {
      const label = `比较结果[${index}]`;
      requireString(item.历史用例编号, `${label}.历史用例编号`);
      const sourcePath = item.历史输入路径 || (comparison.历史输入.length === 1 ? comparison.历史输入[0].路径 : "");
      const historicalKey = `${sourcePath}|${item.历史用例编号}`;
      const historical = historicalCases.get(historicalKey);
      if (!historical) fail(`历史比较引用不存在或未明确来源的用例：${historicalKey}`);
      if (comparedHistory.has(historicalKey)) fail(`同一历史用例重复记录判定：${historicalKey}`);
      comparedHistory.add(historicalKey);
      requireArray(item.当前稳定规则标识, `${label}.当前稳定规则标识`);
      if (!HISTORY_DECISIONS.has(item.判定)) fail(`${label}.判定不合法：${item.判定}`);
      requireArray(item.差异, `${label}.差异`);
      requireArray(item.当前用例追溯, `${label}.当前用例追溯`);
      if (item.判定 === "待人工复核") {
        const isolated = item.当前稳定规则标识.length > 0 && item.当前稳定规则标识.every((ruleId) => {
          const rule = catalog.规则.find((entry) => entry.稳定规则标识 === ruleId);
          return rule && !rule.可生成正式用例;
        });
        if (!isolated || item.当前用例追溯.length) fail(`历史待人工复核未与正式候选隔离：${item.历史用例编号}`);
      }
      for (const id of item.当前用例追溯) if (!caseIds.has(id)) fail(`历史比较引用不存在的当前用例：${id}`);
      if (item.判定 === "继续有效") {
        const current = candidate.测试用例.find((record) => record.用例编号 === item.当前用例追溯[0]);
        const fields = ["功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号"];
        if (item.当前用例追溯.length !== 1 || !current || fields.some((field) => JSON.stringify(historical[field]) !== JSON.stringify(current[field]))) {
          fail(`历史用例内容已变化，不能仅因规则标识一致判为继续有效：${item.历史用例编号}`);
        }
      }
      for (const ruleId of item.当前稳定规则标识) {
        if (!ruleIds.has(ruleId)) fail(`历史比较引用不存在的当前规则：${item.历史用例编号} -> ${ruleId}`);
      }
      if (item.判定 !== "应当废弃" && item.当前稳定规则标识.length === 0) {
        fail(`非废弃历史用例必须绑定当前规则：${item.历史用例编号}`);
      }
    }
    for (const key of historicalCases.keys()) if (!comparedHistory.has(key)) fail(`历史用例未记录处理去向：${key}`);
    }
  }

  return {
    状态: "通过",
    校验阶段: phase,
    项目名称: manifest.项目名称,
    项目目录: projectDirectory,
    任务标识: manifest.任务标识,
    输入文件数: entries.size,
    当前业务证据数: [...entries.values()].filter((entry) => entry.角色 === "当前业务证据").length,
    当前规则数: catalog.规则.length,
    可生成规则数: coverageV2 ? validationRules.filter((rule) => rule.可生成正式用例).length : catalog.规则.filter((rule) => rule.可生成正式用例).length,
    历史比较记录数: historyCount,
    ...(requirementCoverage ? { 需求覆盖: requirementCoverage } : {}),
  };
}

async function main() {
  const args = process.argv.slice(2);
  let phase = "final";
  if (args[0] === "--phase") {
    phase = args[1];
    args.splice(0, 2);
  }
  if (args.length < 1 || args.length > 2) {
    fail("用法：node scripts/validate-generation-input.mjs [--phase pre-generate|final] <generation-input-manifest.json> [仓库根目录]");
  }
  const result = await validateGenerationInput(args[0], args[1] || process.cwd(), phase);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    process.stderr.write(`生成输入隔离校验失败：${error.message}\n`);
    process.exitCode = 1;
  });
}
