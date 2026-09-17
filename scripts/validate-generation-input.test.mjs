import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { validateGenerationInput } from "./validate-generation-input.mjs";
import { caseFromRule, ruleDesignHash } from "./testcase-design.mjs";
import { validateTestcaseDelivery } from "./validate-testcase-delivery.mjs";

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "generation-input-isolation-"));

try {
  const taskWork = "work/task-001";
  await fs.mkdir(path.join(fixtureRoot, "project"), { recursive: true });
  await fs.mkdir(path.join(fixtureRoot, taskWork), { recursive: true });
  await fs.mkdir(path.join(fixtureRoot, "work/history-001"), { recursive: true });

  const requirementPath = "project/requirements.md";
  const catalogPath = `${taskWork}/business-rule-catalog.json`;
  const comparisonPath = `${taskWork}/historical-case-comparison.json`;
  const generatorPath = `${taskWork}/build.mjs`;
  const historicalPath = "work/history-001/cases.json";
  const decisionExtractPath = `${taskWork}/confirmed-decision-extract.json`;
  const candidatePath = `${taskWork}/current-testcase-candidate.json`;
  const finalPath = `${taskWork}/final-testcases.json`;
  const manifestPath = path.join(fixtureRoot, taskWork, "generation-input-manifest.json");
  const scope = { 端名: "用户App", 模块名称: "登录" };

  const requirement = "已启用账号在登录表单输入正确账号和密码并提交后进入首页。\n";
  const generator = `const catalog = "${catalogPath}";\nconst comparison = "${comparisonPath}";\n`;
  const historical = `${JSON.stringify({ 测试用例: [{
    用例编号: "LOGIN-OLD-001", 功能模块: "登录", 功能结构: "密码登录（已注册用户视角）",
    用例类型: "业务流程", 优先级: "P0", 用例描述: "验证已注册用户登录操作结果", 验证用例子项: "登录操作结果",
    前置条件: ["账号已启用"], 操作步骤: ["输入正确账号和密码", "提交登录表单"],
    预期结果: ["页面进入登录后的默认首页"], 流程编号: "",
  }], 需求待确认: [] })}\n`;
  await fs.writeFile(path.join(fixtureRoot, requirementPath), requirement);
  await fs.writeFile(path.join(fixtureRoot, generatorPath), generator);
  await fs.writeFile(path.join(fixtureRoot, historicalPath), historical);

  const decisionExtract = {
    schemaVersion: "1.0",
    项目名称: "示例项目",
    目标范围: scope,
    来源文件: { 路径: historicalPath, "SHA-256": hash(historical) },
    决策: [{
      来源位置: "需求待确认!A2:T2",
      问题编号: "Q-001",
      已确认结论: "启用账号输入正确密码后进入首页",
      适用范围: ["用户App密码登录"],
      当前适用性: "继续有效",
      适用性依据: "当前需求没有更新或废止该结论",
    }],
  };
  const decisionExtractText = `${JSON.stringify(decisionExtract, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, decisionExtractPath), decisionExtractText);

  const catalog = {
    schemaVersion: "1.0",
    项目名称: "示例项目",
    目标范围: scope,
    规则: [{
      稳定规则标识: "BR-LOGIN-001",
      业务对象: "登录账号",
      执行角色: "已注册用户",
      适用角色和端: ["用户App-已注册用户"],
      原子动作数量: 1,
      原子结果数量: 1,
      触发动作: "输入正确账号和密码并提交",
      必要条件: ["账号已启用"],
      来源状态: "未登录",
      目标状态或可观察结果: "页面进入登录后的默认首页",
      规则状态: "已确认规则",
      可生成正式用例: true,
      证据引用: [{
        路径: requirementPath,
        "SHA-256": hash(requirement),
        位置: "第 1 行",
        证明内容: "启用账号正确登录后的页面结果",
        原文: requirement.trim(),
      }],
    }],
  };
  const rule = catalog.规则[0];
  Object.assign(rule, { 功能模块: "登录", 功能结构: "密码登录（已注册用户视角）", 用例设计: {
    场景: "验证已注册用户输入正确账号密码并提交登录表单", 验证子项: "登录后首页跳转", 用例类型: "业务流程", 优先级: "P0", 优先级依据: "有效账号登录是核心业务冒烟的必要入口",
    观察端: "用户App", 观察页面: "首页", 观察对象: "首页", 观察证据: [0], 计算: null, 设计说明: "使用启用账号提交密码登录表单，在用户端观察首页跳转。",
    步骤: [{ 执行角色: "已注册用户", 动作: "输入", 对象: "账号和密码", 操作: "输入正确账号和密码", 证据: [0] }, { 执行角色: "已注册用户", 动作: "提交", 对象: "登录表单", 操作: "提交登录表单", 证据: [0] }],
  } });
  rule.设计复核 = { 状态: "通过", 说明: "已核对测试来源中明确的登录表单、账号条件、输入、提交及首页结果", 设计SHA256: ruleDesignHash(rule) };
  const catalogText = `${JSON.stringify(catalog, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, catalogPath), catalogText);

  const baseInputs = [
    { 路径: requirementPath, "SHA-256": hash(requirement), 角色: "当前业务证据", 内容类型: "正式需求", 允许定义业务规则: true },
    { 路径: catalogPath, "SHA-256": hash(catalogText), 角色: "本次派生产物", 内容类型: "业务规则清单", 允许定义业务规则: true },
    { 路径: historicalPath, "SHA-256": hash(historical), 角色: "历史参照", 内容类型: "历史用例", 允许定义业务规则: false },
    { 路径: decisionExtractPath, "SHA-256": hash(decisionExtractText), 角色: "当前业务证据", 内容类型: "已确认决策摘录", 允许定义业务规则: true },
    { 路径: generatorPath, "SHA-256": hash(generator), 角色: "执行工具", 内容类型: "生成脚本", 允许定义业务规则: false },
  ];
  const manifest = {
    schemaVersion: "1.0",
    项目名称: "示例项目",
    项目目录: "project",
    任务标识: "task-001",
    任务工作目录: taskWork,
    目标范围: scope,
    生成策略: "current-evidence-only",
    输入文件: baseInputs,
    当前业务规则清单: catalogPath,
    历史用例比较结果: comparisonPath,
    生成脚本: generatorPath,
  };
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const preResult = await validateGenerationInput(manifestPath, fixtureRoot, "pre-generate");
  assert.equal(preResult.状态, "通过");
  assert.equal(preResult.当前规则数, 1);
  const isolatedCatalog = structuredClone(catalog);
  Object.assign(isolatedCatalog.规则[0], {
    执行角色: "", 适用角色和端: [], 原子动作数量: 0, 原子结果数量: 0,
    触发动作: "", 目标状态或可观察结果: "", 规则状态: "生成待复核", 可生成正式用例: false,
  });
  const isolatedCatalogText = `${JSON.stringify(isolatedCatalog, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, catalogPath), isolatedCatalogText);
  baseInputs.find(entry => entry.路径 === catalogPath)["SHA-256"] = hash(isolatedCatalogText);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  assert.equal((await validateGenerationInput(manifestPath, fixtureRoot, "pre-generate")).可生成规则数, 0);
  isolatedCatalog.规则[0].可生成正式用例 = true;
  const invalidFormalText = `${JSON.stringify(isolatedCatalog, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, catalogPath), invalidFormalText);
  baseInputs.find(entry => entry.路径 === catalogPath)["SHA-256"] = hash(invalidFormalText);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await assert.rejects(validateGenerationInput(manifestPath, fixtureRoot, "pre-generate"), /必须只包含一个执行角色/);
  await fs.writeFile(path.join(fixtureRoot, catalogPath), catalogText);
  baseInputs.find(entry => entry.路径 === catalogPath)["SHA-256"] = hash(catalogText);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  for (const delta of [{ 功能模块: '订单' }, { 适用角色和端: ['公会App-已注册用户'] }]) {
    const changed = structuredClone(catalog);
    Object.assign(changed.规则[0], delta);
    const content = JSON.stringify(changed, null, 2) + '\n';
    await fs.writeFile(path.join(fixtureRoot, catalogPath), content);
    baseInputs.find(entry => entry.路径 === catalogPath)['SHA-256'] = hash(content);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    await assert.rejects(validateGenerationInput(manifestPath, fixtureRoot, 'pre-generate'), /超出本次范围/);
  }
  await fs.writeFile(path.join(fixtureRoot, catalogPath), catalogText);
  baseInputs.find(entry => entry.路径 === catalogPath)['SHA-256'] = hash(catalogText);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  const comparison = {
    schemaVersion: "1.0",
    项目名称: "示例项目",
    目标范围: scope,
    候选JSON: { 路径: candidatePath, "SHA-256": "" },
    历史输入: [{ 路径: historicalPath, "SHA-256": hash(historical) }],
    比较结果: [{
      历史用例编号: "LOGIN-OLD-001",
      当前稳定规则标识: ["BR-LOGIN-001"],
      判定: "需要重写",
      差异: ["历史描述和子项使用通用占位词，当前设计改为具体登录场景与首页跳转维度"],
      当前用例追溯: ["LOGIN-0001"],
    }],
  };
  const candidateText = `${JSON.stringify({ 测试用例: [caseFromRule(rule, 1, "LOGIN")], 需求待确认: [] }, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, candidatePath), candidateText);
  await fs.writeFile(path.join(fixtureRoot, finalPath), candidateText);
  comparison.候选JSON["SHA-256"] = hash(candidateText);
  const comparisonText = `${JSON.stringify(comparison, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, comparisonPath), comparisonText);
  manifest.输入文件.push({
    路径: comparisonPath,
    "SHA-256": hash(comparisonText),
    角色: "本次派生产物",
    内容类型: "历史用例比较结果",
    允许定义业务规则: false,
  });
  manifest.输入文件.push(
    { 路径: candidatePath, "SHA-256": hash(candidateText), 角色: "本次派生产物", 内容类型: "当前候选用例", 允许定义业务规则: false },
    { 路径: finalPath, "SHA-256": hash(candidateText), 角色: "本次派生产物", 内容类型: "最终用例JSON", 允许定义业务规则: false },
  );
  manifest.当前候选用例 = candidatePath;
  manifest.最终用例JSON = finalPath;
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const finalResult = await validateGenerationInput(manifestPath, fixtureRoot, "final");
  assert.equal(finalResult.状态, "通过");
  assert.equal(finalResult.历史比较记录数, 1);
  const saveComparison = async value => {
    const content = JSON.stringify(value, null, 2) + "\n";
    await fs.writeFile(path.join(fixtureRoot, comparisonPath), content);
    manifest.输入文件.find(entry => entry.路径 === comparisonPath)["SHA-256"] = hash(content);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  };
  const saveCatalog = async value => {
    const content = JSON.stringify(value, null, 2) + "\n";
    await fs.writeFile(path.join(fixtureRoot, catalogPath), content);
    manifest.输入文件.find(entry => entry.路径 === catalogPath)["SHA-256"] = hash(content);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  };
  const catalogWithIsolatedHistory = structuredClone(catalog);
  catalogWithIsolatedHistory.规则.push({
    ...structuredClone(rule), 稳定规则标识: "BR-LOGIN-002", 业务对象: "登录历史规则待确认",
    执行角色: "", 适用角色和端: [], 原子动作数量: 0, 原子结果数量: 0,
    触发动作: "", 目标状态或可观察结果: "", 规则状态: "生成待复核", 可生成正式用例: false,
  });
  const isolatedHistory = structuredClone(comparison);
  Object.assign(isolatedHistory.比较结果[0], { 当前稳定规则标识: ["BR-LOGIN-002"], 判定: "待人工复核", 当前用例追溯: [] });
  await saveCatalog(catalogWithIsolatedHistory);
  await saveComparison(isolatedHistory);
  assert.equal((await validateGenerationInput(manifestPath, fixtureRoot, "final")).状态, "通过");
  isolatedHistory.比较结果[0].当前稳定规则标识 = ["BR-LOGIN-001"];
  await saveComparison(isolatedHistory);
  await assert.rejects(validateGenerationInput(manifestPath, fixtureRoot, "final"), /历史待人工复核未与正式候选隔离/);
  await saveCatalog(catalog);
  await saveComparison(comparison);
  const falselyValid = structuredClone(comparison);
  falselyValid.比较结果[0].判定 = "继续有效";
  await saveComparison(falselyValid);
  await assert.rejects(validateGenerationInput(manifestPath, fixtureRoot, "final"), /不能仅因规则标识一致/);
  await saveComparison({ ...comparison, 比较结果: [] });
  await assert.rejects(validateGenerationInput(manifestPath, fixtureRoot, "final"), /历史用例未记录处理去向/);
  await saveComparison(comparison);

  // Exercise the same gate called by generation, Excel export and cache publication.
  const agentsText = await fs.readFile(new URL("../AGENTS.md", import.meta.url), "utf8");
  await fs.writeFile(path.join(fixtureRoot, "AGENTS.md"), agentsText);
  const scan = { 扫描状态: "通过", 阻塞项: [], 项目指纹: hash(`requirements.md|${hash(requirement)}`), 项目接入基线: { 状态: "已确认" },
    缓存清理: { 状态: "成功", 清理后残留失效文件: [] },
    规则基线: [{ 路径: "AGENTS.md", "SHA-256": hash(agentsText) }],
    语义读取记录: baseInputs.filter((entry) => entry.角色 === "当前业务证据").map((entry) => ({ 路径: entry.路径, SHA256: entry["SHA-256"], 结论: "测试来源明确输入、角色和首页结果", 关联规则: ["BR-LOGIN-001"] })) };
  const support = {
    "global-evidence-scan-result.json": scan,
    "prototype-context-sync-result.json": { 同步状态: "通过", 阻塞异常: [], 需求清单有修改: false,
      文件核对: [{ 路径: requirementPath, 修改前SHA256: hash(requirement), 修改后SHA256: hash(requirement) }] },
    "evidence-atom-index.json": { 证据原子: [{ 原子标识: "ATOM-LOGIN" }] },
    "coverage-matrix.json": { 规则处理: [{ 原子标识: "ATOM-LOGIN", 去向: "正式用例", 规则标识: ["BR-LOGIN-001"], 依据: "登录成功跳转规则已由当前用例覆盖" }] },
    "semantic-dedup-review.json": { 候选SHA256: hash(candidateText), 待人工复核: [], 复核结果: [{
      稳定规则标识: "BR-LOGIN-001", 候选用例追溯: ["LOGIN-0001"], 归一化业务键: "登录|用户|提交有效凭证|首页",
      基础条件: ["已注册用户"], 附加条件: [], 状态关系: "仅一个已注册用户成功登录分支，无待合并变体",
      关键操作: "提交登录凭证", 可观察结果: "跳转首页", 判定: "保留", 保留或合并目标: "LOGIN-0001",
      判定理由: "此测试范围仅含当前登录成功规则；历史记录绑定同一规则，不增加候选", 证据: [{ 路径: requirementPath, "SHA-256": hash(requirement) }],
    }] },
  };
  const saveSupport = async (name, value) => {
    const relative = `${taskWork}/${name}`;
    const content = `${JSON.stringify(value, null, 2)}\n`;
    await fs.writeFile(path.join(fixtureRoot, relative), content);
    manifest.输入文件 = manifest.输入文件.filter((entry) => entry.路径 !== relative);
    manifest.输入文件.push({ 路径: relative, "SHA-256": hash(content), 角色: "本次派生产物", 内容类型: "交付复核", 允许定义业务规则: false });
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  };
  for (const [name, value] of Object.entries(support)) await saveSupport(name, value);
  assert.equal((await validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot)).状态, "通过");
  await fs.writeFile(path.join(fixtureRoot, 'project/added-requirement.md'), '新增加但未登记的业务要求');
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /项目文件清单或内容已变化/);
  await fs.unlink(path.join(fixtureRoot, 'project/added-requirement.md'));
  assert.equal((await validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot, { phase: "candidate", candidate: JSON.parse(candidateText) })).状态, "通过");
  const changedDraft = JSON.parse(candidateText);
  changedDraft.测试用例[0].用例描述 += "并打开资料";
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot, { phase: "candidate", candidate: changedDraft }), /去重复核/);
  scan.阻塞项.push("尚未核对目标端入口");
  await saveSupport("global-evidence-scan-result.json", scan);
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /语义扫描未完成/);
  scan.阻塞项 = [];
  await saveSupport("global-evidence-scan-result.json", scan);
  await saveSupport("semantic-dedup-review.json", { 候选SHA256: "0".repeat(64), 待人工复核: [] });
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /去重复核/);
  await saveSupport("semantic-dedup-review.json", support["semantic-dedup-review.json"]);
  await saveSupport("semantic-dedup-review.json", { 候选SHA256: hash(candidateText), 待人工复核: [], 复核结果: [] });
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /空报告不能放行/);
  const nonexistentTarget = structuredClone(support["semantic-dedup-review.json"]);
  nonexistentTarget.复核结果[0].保留或合并目标 = "LOGIN-9999";
  await saveSupport("semantic-dedup-review.json", nonexistentTarget);
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /有效保留目标/);
  await saveSupport("semantic-dedup-review.json", support["semantic-dedup-review.json"]);
  support["prototype-context-sync-result.json"].需求清单有修改 = true;
  await saveSupport("prototype-context-sync-result.json", support["prototype-context-sync-result.json"]);
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /修改标记.*矛盾/);
  support["prototype-context-sync-result.json"].需求清单有修改 = false;
  await saveSupport("prototype-context-sync-result.json", support["prototype-context-sync-result.json"]);
  await saveSupport("coverage-matrix.json", { 规则处理: [] });
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /覆盖清单/);
  await saveSupport("coverage-matrix.json", support["coverage-matrix.json"]);
  // A task-specific review waiver must not bypass source, candidate or hash checks.
  const sampledCoverage = { 规则处理: [{ 原子标识: 'ATOM-LOGIN', 去向: '未逐条复核', 依据: '按本次明确授权停止逐项复核' }] };
  await saveSupport('coverage-matrix.json', sampledCoverage);
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /覆盖未完成复核/);
  scan.复核方式 = '自动检查及抽查';
  await saveSupport('global-evidence-scan-result.json', scan);
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /缺少本次用户授权/);
  const authorizationPath = `${taskWork}/current-user-confirmation.json`;
  const authorization = { 问题编号: 'REVIEW-001', 复核方式: '自动检查及抽查', 用户原答: '本次按自动检查和抽查交付' };
  const authorizationText = JSON.stringify(authorization, null, 2) + '\n';
  await fs.writeFile(path.join(fixtureRoot, authorizationPath), authorizationText);
  manifest.输入文件.push({ 路径: authorizationPath, 'SHA-256': hash(authorizationText), 角色: '当前业务证据', 内容类型: '用户确认', 允许定义业务规则: true });
  scan.复核授权 = { 路径: authorizationPath, SHA256: hash(authorizationText), 问题编号: authorization.问题编号, 用户原答: authorization.用户原答 };
  scan.语义读取记录.push({ 路径: authorizationPath, SHA256: hash(authorizationText), 结论: '仅本次任务按自动检查及抽查交付', 关联规则: [] });
  await saveSupport('global-evidence-scan-result.json', scan);
  assert.equal((await validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot)).状态, '通过');
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot, { phase: 'candidate', candidate: changedDraft }), /去重复核/);
  scan.复核授权.用户原答 = '与原答不符';
  await saveSupport('global-evidence-scan-result.json', scan);
  await assert.rejects(validateTestcaseDelivery(path.join(fixtureRoot, taskWork), fixtureRoot), /授权与当前用户确认不一致/);
  scan.复核授权.用户原答 = authorization.用户原答;
  await saveSupport('global-evidence-scan-result.json', scan);
  await saveSupport('coverage-matrix.json', support['coverage-matrix.json']);
  process.stdout.write("delivery gate: positive path and blocking regressions passed\n");

  const directHistoryGenerator = `${generator}const previous = "${historicalPath}";\n`;
  await fs.writeFile(path.join(fixtureRoot, generatorPath), directHistoryGenerator);
  const directHistoryManifest = structuredClone(manifest);
  directHistoryManifest.输入文件.find((item) => item.路径 === generatorPath)["SHA-256"] = hash(directHistoryGenerator);
  await fs.writeFile(manifestPath, `${JSON.stringify(directHistoryManifest, null, 2)}\n`);
  await assert.rejects(
    validateGenerationInput(manifestPath, fixtureRoot, "final"),
    /生成脚本不得直接引用原始历史文件/,
  );
  await fs.writeFile(path.join(fixtureRoot, generatorPath), generator);

  const changedFinalText = `${JSON.stringify({ 测试用例: [{ 用例编号: "CHANGED" }], 需求待确认: [] }, null, 2)}\n`;
  await fs.writeFile(path.join(fixtureRoot, finalPath), changedFinalText);
  const changedFinalManifest = structuredClone(manifest);
  changedFinalManifest.输入文件.find((item) => item.路径 === finalPath)["SHA-256"] = hash(changedFinalText);
  await fs.writeFile(manifestPath, `${JSON.stringify(changedFinalManifest, null, 2)}\n`);
  await assert.rejects(
    validateGenerationInput(manifestPath, fixtureRoot, "final"),
    /最终用例 JSON 与当前候选用例的 SHA-256 不一致/,
  );
  await fs.writeFile(path.join(fixtureRoot, finalPath), candidateText);

  const invalidManifest = structuredClone(manifest);
  invalidManifest.输入文件.find((item) => item.路径 === historicalPath).允许定义业务规则 = true;
  await fs.writeFile(manifestPath, `${JSON.stringify(invalidManifest, null, 2)}\n`);
  await assert.rejects(
    validateGenerationInput(manifestPath, fixtureRoot, "final"),
    /历史参照不得定义业务规则/,
  );

  process.stdout.write("input isolation and scope checks passed\n");
} finally {
  await fs.rm(fixtureRoot, { recursive: true, force: true });
}
