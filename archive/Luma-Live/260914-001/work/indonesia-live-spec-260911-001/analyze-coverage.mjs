import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const taskDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(taskDir, "../..");
const sourceTask = path.join(root, "work/liveshow-three-end-all-260911-001");
const inputs = {
  用户App: path.join(sourceTask, "user/current-testcase-candidate.json"),
  公会App: path.join(sourceTask, "guild/current-testcase-candidate.json"),
  管理后台: path.join(sourceTask, "admin/current-testcase-candidate.json"),
};
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const readJson = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const writeJson = async (name, value) => fs.writeFile(path.join(taskDir, name), `${JSON.stringify(value, null, 2)}\n`);

const lock = await readJson(path.join(taskDir, "baseline-lock.json"));
if (lock.历史用例读取状态 !== "未读取" || lock.历史输入.length) throw new Error("规则与场景基线未在历史输入为空的状态下锁定");

const sourceFiles = Object.fromEntries(await Promise.all(Object.entries(inputs).map(async ([end, file]) => [end, {
  path: file,
  text: await fs.readFile(file, "utf8"),
}])));
const histories = Object.fromEntries(Object.entries(sourceFiles).map(([end, source]) => [end, JSON.parse(source.text).测试用例]));
const scenarios = (await readJson(path.join(taskDir, "scenario-baseline.json"))).场景;

const stopPhrases = ["进行验证", "验证", "系统", "页面", "当前", "对应", "相关", "具备", "支持", "可以", "应当", "应该", "用户", "功能", "业务", "查看", "显示", "展示"];
function normalize(value) {
  let text = String(value ?? "").toLowerCase();
  for (const phrase of stopPhrases) text = text.replaceAll(phrase, "");
  return text.replace(/[\s\p{P}\p{S}]/gu, "");
}

function grams(text, size) {
  const result = new Set();
  for (let index = 0; index <= text.length - size; index += 1) result.add(text.slice(index, index + size));
  return result;
}

function containment(source, target) {
  if (!source.size) return 0;
  let count = 0;
  for (const item of source) if (target.has(item)) count += 1;
  return count / source.size;
}

const negative = /不|无|拒绝|禁止|屏蔽|拦截|作废|清空|移除|置灰|结束/;
const literals = (value) => [...String(value).matchAll(/[+]?\d+(?:\.\d+)?%?|[a-z]{2,}/giu)].map((match) => match[0].toLowerCase()).filter((item) => item !== "app");
function caseText(item) {
  return [item.功能模块, item.功能结构, item.用例描述, item.验证用例子项, item.前置条件, item.操作步骤, item.预期结果].flat(3).join(" ");
}

const documentFrequency = Object.fromEntries(Object.entries(histories).map(([end, cases]) => {
  const frequency = new Map();
  for (const item of cases) for (const gram of grams(normalize(caseText(item)), 2)) frequency.set(gram, (frequency.get(gram) || 0) + 1);
  return [end, { frequency, total: cases.length }];
}));

function rareAnchorScore(sourceRaw, targetRaw, end) {
  const source = grams(normalize(sourceRaw), 2);
  const target = grams(normalize(targetRaw), 2);
  const { frequency, total } = documentFrequency[end];
  const rare = [...source].filter((gram) => (frequency.get(gram) || 0) / total <= 0.03);
  if (!rare.length) return 1;
  return rare.some((gram) => target.has(gram)) ? 1 : 0;
}

const anchorAliases = {
  搜索: ["搜索"], 邮箱: ["邮箱"], 区号: ["区号", "国家码"], 手机号: ["手机号", "手机号码"], 风控: ["风控", "审核"],
  注销: ["注销"], 认证: ["认证", "证件", "ktp", "sim"], 封禁: ["封禁", "锁定"], 拉黑: ["拉黑", "黑名单"],
  毛玻璃: ["毛玻璃"], 门票: ["门票"], 断流: ["断流"], 访问量: ["访问量", "进房次数", "进入次数"], 密码: ["密码"],
  轮播: ["轮播", "banner"], 推送: ["推送", "通知"], 礼物: ["礼物"], 美颜: ["美颜"], 粉丝团: ["粉丝团", "粉丝群"],
  贡献榜: ["贡献榜", "贡献"], 私信: ["私信"], 好友: ["好友"], 群聊: ["群聊", "粉丝群"], 禁言: ["禁言"], 房管: ["房管"],
  客服: ["客服", "whatsapp"], 金币: ["金币", "余额"], rtp: ["rtp"], 收益: ["收益"], 退款: ["退款", "冲正"],
  充值: ["充值"], 提现: ["提现"], 任务: ["任务"], 奖励: ["奖励"], 等级: ["等级"], 运营位: ["运营位"], 运营账号: ["运营账号"],
  公会: ["公会"], 主播: ["主播"], 道具: ["道具", "装扮"], 语言: ["语言", "中文", "英文", "印尼语", "马来语"],
};

function topicAnchorScore(sourceRaw, targetRaw) {
  const source = String(sourceRaw).toLowerCase();
  const target = String(targetRaw).toLowerCase();
  const anchors = Object.entries(anchorAliases).filter(([term]) => source.includes(term)).slice(0, 3);
  if (!anchors.length) return 1;
  return anchors.every(([, aliases]) => aliases.some((alias) => target.includes(alias))) ? 1 : 0;
}

function scoreText(sourceRaw, targetRaw) {
  targetRaw = Array.isArray(targetRaw) ? targetRaw.join(" ") : String(targetRaw ?? "");
  const source = normalize(sourceRaw);
  const target = normalize(targetRaw);
  const score2 = containment(grams(source, 2), grams(target, 2));
  const score3 = containment(grams(source, 3), grams(target, 3));
  const sourceLiterals = literals(sourceRaw);
  const literalScore = sourceLiterals.length ? sourceLiterals.filter((item) => targetRaw.toLowerCase().includes(item)).length / sourceLiterals.length : 1;
  let score = score2 * 0.45 + score3 * 0.45 + literalScore * 0.1;
  if (negative.test(sourceRaw) && !negative.test(targetRaw)) score = Math.min(score, 0.35);
  if (sourceLiterals.length && literalScore < 1) score = Math.min(score, 0.4);
  return Number(score.toFixed(4));
}

function scoreScenario(scenario, testCase) {
  const fullText = caseText(testCase);
  let fullScore = scoreText(scenario.可观察结果, fullText);
  let expectedScore = scoreText(scenario.可观察结果, testCase.预期结果);
  if (!rareAnchorScore(scenario.可观察结果, fullText, scenario.目标端) || !topicAnchorScore(scenario.可观察结果, fullText)) {
    fullScore = Math.min(fullScore, 0.25);
    expectedScore = Math.min(expectedScore, 0.25);
  }
  return { 全文分数: fullScore, 预期分数: expectedScore };
}

const reviewedCovered = new Set([
  "SCN-LIVE-003-01-1",
  "SCN-SOC-011-01-1",
  "SCN-FIN-004-02-2",
  "SCN-FIN-018-01-1",
  "SCN-FIN-018-02-1",
  "SCN-FIN-018-02-2",
  "SCN-FIN-018-04-1",
  "SCN-TASK-008-01-1",
  "SCN-TASK-008-01-2",
  "SCN-TASK-008-02-1",
  "SCN-TASK-008-02-2",
]);

const reviewedPartial = new Set([
  "SCN-ACC-003-01-1",
  "SCN-ACC-004-01-1",
  "SCN-ACC-004-02-1",
  "SCN-ACC-005-05-1",
  "SCN-LIVE-001-04-1",
  "SCN-LIVE-009-02-1",
  "SCN-LIVE-016-01-1",
  "SCN-LIVE-018-03-1",
  "SCN-LIVE-021-01-1",
  "SCN-LIVE-022-03-1",
  "SCN-LIVE-025-01-1",
  "SCN-LIVE-025-02-1",
  "SCN-LIVE-026-01-1",
  "SCN-SOC-011-02-1",
  "SCN-FIN-005-04-1",
  "SCN-FIN-005-04-2",
  "SCN-FIN-005-05-1",
  "SCN-FIN-005-05-2",
  "SCN-FIN-013-01-2",
  "SCN-FIN-019-01-1",
  "SCN-GUILD-003-02-1",
]);

const mappings = scenarios.map((scenario) => {
  const candidates = histories[scenario.目标端].map((item) => ({ 用例: item, ...scoreScenario(scenario, item) }))
    .sort((a, b) => (b.预期分数 * 0.7 + b.全文分数 * 0.3) - (a.预期分数 * 0.7 + a.全文分数 * 0.3));
  const best = candidates[0];
  const status = reviewedCovered.has(scenario.场景编号)
    ? "已覆盖"
    : reviewedPartial.has(scenario.场景编号) ? "部分覆盖" : "未覆盖";
  return {
    场景编号: scenario.场景编号,
    需求编号: scenario.需求编号,
    目标端: scenario.目标端,
    场景描述: scenario.场景描述,
    覆盖状态: status,
    最佳匹配分数: Number((best.预期分数 * 0.7 + best.全文分数 * 0.3).toFixed(4)),
    最佳匹配全文分数: best.全文分数,
    最佳匹配预期分数: best.预期分数,
    最佳匹配用例编号: best.用例.用例编号,
    最佳匹配用例描述: best.用例.用例描述,
    最佳匹配预期结果: best.用例.预期结果,
    判定说明: status === "已覆盖"
      ? "基线锁定后人工复核：必要条件、实际动作和明确断言均满足场景契约"
      : status === "部分覆盖"
        ? "基线锁定后人工复核：仅命中部分条件、动作或断言，不能声明完整覆盖"
        : "基线锁定后未发现同时满足必要条件、实际动作和明确断言的既有用例；不据此反向新增规则或场景",
  };
});

const statusCounts = Object.fromEntries(["已覆盖", "部分覆盖", "未覆盖"].map((status) => [status, mappings.filter((item) => item.覆盖状态 === status).length]));
if (statusCounts.已覆盖 !== 11 || statusCounts.部分覆盖 !== 21 || statusCounts.未覆盖 !== 254) {
  throw new Error(`人工复核统计异常：${JSON.stringify(statusCounts)}`);
}
const byEnd = Object.fromEntries(Object.keys(inputs).map((end) => [end, Object.fromEntries(["已覆盖", "部分覆盖", "未覆盖"].map((status) => [status, mappings.filter((item) => item.目标端 === end && item.覆盖状态 === status).length]))]));
const byRequirement = [...new Set(mappings.map((item) => item.需求编号))].map((id) => {
  const rows = mappings.filter((item) => item.需求编号 === id);
  return {
    需求编号: id,
    场景数: rows.length,
    已覆盖: rows.filter((item) => item.覆盖状态 === "已覆盖").length,
    部分覆盖: rows.filter((item) => item.覆盖状态 === "部分覆盖").length,
    未覆盖: rows.filter((item) => item.覆盖状态 === "未覆盖").length,
  };
});

await writeJson("coverage-mapping.json", {
  分析时间: new Date().toISOString(),
  基线规则数: lock.规则数,
  基线场景数: scenarios.length,
  现有用例数: Object.fromEntries(Object.entries(histories).map(([end, cases]) => [end, cases.length])),
  覆盖判定口径: "先以文本相似度定位候选，再人工核对必要条件、实际动作和明确断言；三项同时满足才标记已覆盖，部分满足标记部分覆盖，其余表示未被现有用例证明",
  覆盖汇总: statusCounts,
  分端汇总: byEnd,
  按需求汇总: byRequirement,
  场景映射: mappings,
});

const manifestPath = path.join(taskDir, "generation-input-manifest.json");
const manifest = await readJson(manifestPath);
manifest.输入 = manifest.输入.filter((item) => item.角色 !== "历史参照");
for (const [end, source] of Object.entries(sourceFiles)) manifest.输入.push({
  路径: path.relative(taskDir, source.path),
  SHA256: sha256(source.text),
  角色: "历史参照",
  内容类型: `${end}现有测试用例`,
  允许定义业务规则: false,
});
manifest.历史参照启用阶段 = "已在规则与场景基线锁定后启用";
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({ 覆盖汇总: statusCounts, 分端汇总: byEnd }, null, 2));
