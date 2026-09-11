import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const taskDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(taskDir, "../..");
const outputDir = path.join(root, "outputs/Luma Live-case");
const sourceDir = "/Users/geekonup/Downloads/印尼直播聊天记录";
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const hashFile = async (file) => sha256(await fs.readFile(file));
const readJson = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const writeJson = (name, value) => fs.writeFile(path.join(taskDir, name), `${JSON.stringify(value, null, 2)}\n`);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const metrics = [];
function runStage(name, commands) {
  const start = new Date();
  const started = performance.now();
  for (const args of commands) {
    const result = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
    if (result.status !== 0) throw new Error(`${name}失败：${result.stderr || result.stdout}`);
  }
  const end = new Date();
  metrics.push({ 阶段: name, 开始时间: start.toISOString(), 结束时间: end.toISOString(), 耗时毫秒: Math.round(performance.now() - started) });
}

runStage("清单与哈希、语义读取、同步、规则归一化", [["work/indonesia-live-spec-260911-001/build-baseline.mjs"]]);
runStage("历史比较", [["work/indonesia-live-spec-260911-001/analyze-coverage.mjs"]]);
runStage("候选生成与去重", [["work/indonesia-live-spec-260911-001/build-supplement.mjs"]]);

const configs = {
  用户App: { dir: "user", json: "用户App-全部模块-测试用例-260911-002.json", xlsx: "用户App-全部模块-260911-002.xlsx" },
  公会App: { dir: "guild", json: "公会App-全部模块-测试用例-260911-002.json", xlsx: "公会App-全部模块-260911-002.xlsx" },
  管理后台: { dir: "admin", json: "管理后台-全部模块-测试用例-260911-002.json", xlsx: "管理后台-全部模块-260911-002.xlsx" },
};
runStage("JSON校验", Object.values(configs).map((config) => ["scripts/validate-testcase-json.mjs", path.join(taskDir, config.dir, config.json)]));
runStage("Excel生成与检查", [["work/indonesia-live-spec-260911-001/edit-workbooks.mjs"]]);

for (const config of Object.values(configs)) {
  const source = path.join(outputDir, `${config.xlsx}.inspect.ndjson`);
  await fs.rename(source, path.join(taskDir, config.dir, "artifact-inspect.ndjson"));
}

const [requirements, scenarios, pendingBaseline, coverage, disposition, summary, entryEvidence] = await Promise.all([
  readJson(path.join(taskDir, "requirements-baseline.json")),
  readJson(path.join(taskDir, "scenario-baseline.json")),
  readJson(path.join(taskDir, "pending-risk-baseline.json")),
  readJson(path.join(taskDir, "coverage-mapping.json")),
  readJson(path.join(taskDir, "scenario-disposition.json")),
  readJson(path.join(taskDir, "supplement-summary.json")),
  readJson(path.join(taskDir, "entry-evidence-map.json")),
]);

const sourceNames = ["需求规格说明.md", "需求待确认.md"];
const sourceChecks = await Promise.all(sourceNames.map(async (name) => {
  const original = path.join(sourceDir, name);
  const snapshot = path.join(taskDir, "sources", name);
  const [originalHash, snapshotHash] = await Promise.all([hashFile(original), hashFile(snapshot)]);
  assert(originalHash === snapshotHash, `${name}原附件与任务快照不一致`);
  return { 文件: name, 原附件SHA256: originalHash, 任务快照SHA256: snapshotHash, 状态: "一致" };
}));

assert(requirements.正式需求数 === 89, "正式需求数量异常");
assert(scenarios.场景数 === 286, "场景基线数量异常");
assert(pendingBaseline.风险与缺口数 === 61, "风险与缺口数量异常");
assert(new Set(requirements.需求.map((item) => item.需求编号)).size === requirements.需求.length, "需求编号不唯一");
assert(new Set(scenarios.场景.map((item) => item.场景编号)).size === scenarios.场景.length, "场景编号不唯一");
assert(new Set(scenarios.场景.map((item) => item.需求编号)).size === requirements.需求.length, "存在未建立场景的正式需求");
assert(disposition.场景处理.length === scenarios.场景.length, "场景处理数量与基线不一致");

const routeCounts = Object.fromEntries(["现有用例覆盖", "新增正式用例", "目标端入口待确认"].map((route) => [route, disposition.场景处理.filter((item) => item.处理去向 === route).length]));
assert(routeCounts.现有用例覆盖 === 10 && routeCounts.新增正式用例 === 273 && routeCounts.目标端入口待确认 === 3, "场景处理汇总异常");

const requirementIds = new Set(requirements.需求.map((item) => item.需求编号));
const pendingIds = new Set();
const comparison = {};
const duplicateReview = {};
const workbookChecks = {};
let totalNew = 0;
for (const [end, config] of Object.entries(configs)) {
  const [finalJson, newCases, newPending, workbook] = await Promise.all([
    readJson(path.join(taskDir, config.dir, config.json)),
    readJson(path.join(taskDir, config.dir, "new-testcases.json")),
    readJson(path.join(taskDir, config.dir, "new-pending.json")),
    readJson(path.join(taskDir, config.dir, "workbook-verification.json")),
  ]);
  const additions = newCases.测试用例;
  totalNew += additions.length;
  for (const item of newPending.需求待确认) if (/^PENDING-\d{3}$/.test(item.需求组编号)) pendingIds.add(item.需求组编号);
  assert(!JSON.stringify({ additions, pending: newPending }).includes("undefined"), `${end}新增产物包含 undefined`);
  assert(additions.every((item) => item.测试结果 === "未测"), `${end}新增用例测试结果不是未测`);
  assert(additions.every((item) => item.预期结果.length === 1), `${end}新增用例存在多结果`);
  assert(additions.every((item) => item.备注.some((note) => /^需求：REQ-[A-Z]+-\d{3}$/.test(note))), `${end}新增用例缺少需求编号`);
  assert(additions.every((item) => item.备注.some((note) => /^规则：BR-[A-F0-9]{14}$/.test(note))), `${end}新增用例缺少稳定规则编号`);
  assert(additions.every((item) => item.备注.some((note) => requirementIds.has(note.replace("需求：", "")))), `${end}新增用例关联未知需求`);
  const signatures = additions.map((item) => JSON.stringify([item.用例描述, item.操作步骤, item.预期结果]));
  const exactDuplicates = signatures.length - new Set(signatures).size;
  assert(exactDuplicates === 0, `${end}新增用例存在完全重复`);
  const current = summary.分端结果[end];
  assert(finalJson.测试用例.length === current.最终用例 && additions.length === current.新增用例, `${end}JSON数量与汇总不一致`);
  assert(workbook.状态 === "通过" && workbook.JSON一致性差异数 === 0 && workbook.公式错误数 === 0, `${end}工作簿校验未通过`);
  assert(await hashFile(path.join(outputDir, config.xlsx)) === workbook.工作簿SHA256, `${end}工作簿哈希不一致`);
  const unzip = spawnSync("unzip", ["-t", path.join(outputDir, config.xlsx)], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  assert(unzip.status === 0, `${end}工作簿压缩包完整性校验失败`);
  comparison[end] = current;
  duplicateReview[end] = { 新增用例数: additions.length, 完全重复签名数: exactDuplicates, 用例编号唯一: new Set(additions.map((item) => item.用例编号)).size === additions.length };
  workbookChecks[end] = workbook;
}
assert(totalNew === 273, "新增正式用例总数异常");
assert(pendingIds.size === pendingBaseline.风险与缺口数, "风险与缺口未全部分流到三端待确认清单");

metrics[0].输入数量 = 2;
metrics[0].输出数量 = requirements.正式需求数 + scenarios.场景数 + pendingBaseline.风险与缺口数;
metrics[0].复用数量 = 0;
metrics[1].输入数量 = Object.values(summary.分端结果).reduce((sum, item) => sum + item.原有用例, 0);
metrics[1].输出数量 = coverage.场景映射.length;
metrics[1].复用数量 = routeCounts.现有用例覆盖;
metrics[2].输入数量 = scenarios.场景数 + pendingBaseline.风险与缺口数;
metrics[2].输出数量 = totalNew + Object.values(summary.分端结果).reduce((sum, item) => sum + item.新增待确认, 0);
metrics[2].复用数量 = 0;
metrics[3].输入数量 = 3;
metrics[3].输出数量 = 3;
metrics[3].复用数量 = 0;
metrics[4].输入数量 = 6;
metrics[4].输出数量 = 3;
metrics[4].复用数量 = 3;
const longest = [...metrics].sort((a, b) => b.耗时毫秒 - a.耗时毫秒)[0].阶段;

await Promise.all([
  writeJson("global-evidence-scan-result.json", {
    状态: "通过",
    扫描模式: "full",
    范围: "用户App、公会App、管理后台",
    当前业务证据: sourceChecks,
    正式业务规则来源: "需求规格说明.md",
    风险与缺口来源: "需求待确认.md（不得定义正式业务规则）",
    关联入口证据数: entryEvidence.页面入口数,
    历史参照启用阶段: "规则与场景基线锁定后",
  }),
  writeJson("coverage-after.json", { 基线场景数: scenarios.场景数, 现有用例覆盖: routeCounts.现有用例覆盖, 新增正式用例: routeCounts.新增正式用例, 目标端入口待确认: routeCounts.目标端入口待确认, 已形成处理去向: disposition.场景处理.length }),
  writeJson("historical-case-comparison.json", { 现有用例用途: "仅用于基线锁定后的覆盖映射，不定义业务规则或场景", 覆盖复核: coverage.覆盖汇总, 分端结果: comparison }),
  writeJson("semantic-dedup-review.json", { 状态: "通过", 判定口径: "同一端的用例描述、操作步骤、预期结果完全相同时视为重复", 分端结果: duplicateReview }),
  writeJson("pipeline-metrics.json", { 记录时间: new Date().toISOString(), 优化声明: "未声称流程性能已优化", 最长阶段: longest, 阶段记录: metrics }),
  writeJson("final-validation.json", {
    状态: "通过",
    附件哈希: sourceChecks,
    正式需求数: requirements.正式需求数,
    独立场景数: scenarios.场景数,
    风险与缺口数: pendingBaseline.风险与缺口数,
    覆盖复核: coverage.覆盖汇总,
    场景处理: routeCounts,
    新增正式用例数: totalNew,
    新增用例需求编号缺失数: 0,
    风险与缺口已分流数: pendingIds.size,
    工作簿校验: workbookChecks,
    产品执行状态: "未执行；全部新增用例保持未测",
  }),
]);

const manifestPath = path.join(taskDir, "generation-input-manifest.json");
const manifest = await readJson(manifestPath);
manifest.输入 = manifest.输入.filter((item) => item.内容类型 !== "最终Excel");
for (const config of Object.values(configs)) manifest.输入.push({
  路径: path.relative(taskDir, path.join(outputDir, config.xlsx)),
  SHA256: await hashFile(path.join(outputDir, config.xlsx)),
  角色: "本次最终产物",
  内容类型: "最终Excel",
  允许定义业务规则: false,
});
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({ 状态: "通过", 正式需求数: 89, 场景数: 286, 覆盖复核: coverage.覆盖汇总, 场景处理: routeCounts, 新增正式用例数: totalNew, 风险与缺口已分流数: pendingIds.size, 最长阶段: longest }, null, 2));
