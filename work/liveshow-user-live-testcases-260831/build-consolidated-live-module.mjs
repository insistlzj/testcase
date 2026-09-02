import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import JSZip from "jszip";

const rootDir = "/Users/geekonup/testcase";
const projectDir = path.join(rootDir, "liveshow-proto");
const workDir = path.join(rootDir, "work/liveshow-user-live-testcases-260831");
const outputDir = path.join(rootDir, "outputs/Luma Live-case");
const outputPath = path.join(outputDir, "用户App-直播模块-260831-001.xlsx");
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260831-001.json");
const syncPath = path.join(workDir, "prototype-context-sync-result.json");
const inspectionPath = path.join(workDir, "inspection-260831-001.json");
const inspectNdjsonPath = path.join(workDir, "workbook-inspection.ndjson");

const baseJsonPath = path.join(rootDir, "work/liveshow-user-live-testcases/用户App-直播模块-测试用例-260829-003.json");
const recordJsonPath = path.join(rootDir, "work/liveshow-user-live-records/用户App-直播记录模块-测试用例-260831-001.json");

const strategy = JSON.parse(await fs.readFile(path.join(projectDir, "需求来源策略.json"), "utf8"));
assert.equal(strategy.项目名称, "Luma Live");
assert.equal(strategy.来源策略, "prototype-primary");
assert.equal(strategy.生成前同步, true);

const baselinePaths = [
  "prototype/Luma Live-原型说明.md",
  "prototype/index.html",
  "prototype/assets/annotations.js",
  "prototype/assets/common.js",
  "prototype/assets/mock.js",
  "prototype/assets/live-muted-users.js",
  "prototype/assets/start-live-config.js",
  "prototype/pages/user/home/live-plaza.html",
  "prototype/pages/user/host/host-center.html",
  "prototype/pages/user/host/live-data.html",
  "prototype/pages/user/host/live-records.html",
  "prototype/pages/user/host/start-live-settings.html",
  "prototype/pages/user/live/live-end-host.html",
  "prototype/pages/user/live/live-end-viewer.html",
  "prototype/pages/user/live/live-room-cohost-active.html",
  "prototype/pages/user/live/live-room-host-password.html",
  "prototype/pages/user/live/live-room-host.html",
  "prototype/pages/user/live/live-room-report.html",
  "prototype/pages/user/live/live-room-user-report.html",
  "prototype/pages/user/live/live-room.html",
];

const formatShanghaiTime = (date) => new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
}).format(date).replace(" ", "T") + "+08:00";

async function baselineEntry(relativePath) {
  const absolutePath = path.join(projectDir, relativePath);
  const bytes = await fs.readFile(absolutePath);
  const stat = await fs.stat(absolutePath);
  return {
    相对路径: relativePath,
    修改时间: formatShanghaiTime(stat.mtime),
    "SHA-256": crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

const baseline = await Promise.all(baselinePaths.map(baselineEntry));
const requirementText = await fs.readFile(path.join(projectDir, "context/01-用户主播App-项目需求清单.md"), "utf8");
const annotationsText = await fs.readFile(path.join(projectDir, "prototype/assets/annotations.js"), "utf8");
const recordPageText = await fs.readFile(path.join(projectDir, "prototype/pages/user/host/live-records.html"), "utf8");
for (const phrase of ["默认展示近 7 天", "当前日期范围内分别汇总收益、总时长和直播场次", "历史封面和标题不随当前开播设置变更"]) {
  assert(requirementText.includes(phrase), `需求清单缺少已同步规则：${phrase}`);
}
for (const phrase of ["'live-records.html'", "记录快照", "默认展示近 7 天", "开播时间使用 dd/mm/yyyy HH.mm"]) {
  assert(annotationsText.includes(phrase), `批注缺少直播记录证据：${phrase}`);
}
for (const phrase of ["查看本场直播数据", "本月", "本周", "上月", "自定义"]) {
  assert(recordPageText.includes(phrase), `直播记录页面缺少交互证据：${phrase}`);
}

const syncResult = {
  项目名称: "Luma Live",
  来源策略: "prototype-primary",
  同步状态: "有非阻塞待确认",
  执行时间: formatShanghaiTime(new Date()),
  原型基线: baseline,
  扫描范围: [
    "用户 App / 直播广场",
    "用户 App / 普通房、门票房、密码房进房",
    "用户 App / 观众直播间、主播直播间、房管协助管理",
    "用户 App / 连麦、举报、开播设置、结束直播",
    "用户 App / 主播中心直播记录、直播数据入口",
    "公共批注、公共 Mock、共享交互、直播禁言和开播配置",
  ],
  目标需求清单: [
    "context/01-用户主播App-项目需求清单.md",
    "context/01-用户主播App-角色与用例.md",
    "context/01-互动场景权限规则.md",
  ],
  差异统计: { 新增: 0, 修改: 0, 明确删除: 0, 原型未覆盖: 5, 来源冲突: 0, 无法定位: 0 },
  需求清单变更日志编号: ["RSL-0002", "RSL-0003"],
  同步摘要: [
    "本次复核未发现当前原型与派生需求清单之间需要再次写入的差异。",
    "直播记录规则已由前序同步 RSL-0003 写入需求清单，本次直接纳入完整直播模块。",
    "页面默认示例日期与批注“默认近 7 天”的差异按 RCL-0019 使用批注，不计来源冲突。",
  ],
  前序同步变更: { 日志编号: "RSL-0003", 新增: 1, 修改: 1, 明确删除: 0 },
  受影响用例: [
    { 范围: "用户App-直播模块-260829-003.xlsx", 状态: "继续有效", 数量: 267 },
    { 范围: "用户App-直播模块-260829-003.xlsx / LIVE-262", 状态: "已被替代", 数量: 1 },
    { 范围: "用户App-直播记录模块-260831-002.xlsx", 状态: "继续有效并合入本次模块", 数量: 54 },
    { 范围: "用户App 直播模块历史 Excel", 状态: "需要重审", 数量: 0 },
    { 范围: "用户App 直播模块历史 Excel", 状态: "应当废弃", 数量: 0 },
  ],
  阻塞异常: [],
  非阻塞待确认: [
    "直播记录入口和单场记录后续查看方式",
    "直播记录日期时区、观众人数与收礼数量统计口径",
    "结束直播后的记录可查询时效与异常结束记录生成规则",
    "大量历史记录加载和保留期限",
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const basePayload = JSON.parse(await fs.readFile(baseJsonPath, "utf8"));
const recordPayload = JSON.parse(await fs.readFile(recordJsonPath, "utf8"));
const moduleName = "用户App-直播模块";
const syncNote = "同步追溯：work/liveshow-user-live-testcases-260831/prototype-context-sync-result.json；RSL-0002、RSL-0003";
const qualityNote = "质量检查：按 RCL-0018 使用最小前置条件和单一业务分支";

const recordCaseById = new Map(recordPayload.测试用例.map((item) => [item.用例编号, clone(item)]));
const recordQuestionById = new Map(recordPayload.需求待确认.map((item) => [item.问题编号, clone(item)]));

Object.assign(recordCaseById.get("LREC-003"), {
  用例描述: "验证默认近7天列表筛选",
  验证用例子项: "默认近7天日期边界",
  前置条件: [
    "测试当前日期为 2026-08-17",
    "2026-08-11 和 2026-08-17 各存在一场直播记录",
    "2026-08-10 存在一场直播记录",
    "除上述数据外无其他直播记录",
  ],
  操作步骤: ["进入直播记录页", "查看默认记录列表"],
  预期结果: ["默认近 7 天记录列表仅包含 2026-08-11 和 2026-08-17 两场记录"],
});
Object.assign(recordCaseById.get("LREC-004"), {
  用例描述: "验证默认近7天收益汇总",
  验证用例子项: "默认近7天收益汇总",
  前置条件: [
    "收益定义为默认近 7 天内各场本场收益的整数之和",
    "2026-08-12、2026-08-15、2026-08-17 三场收益依次为 3,156、1,904、624",
    "2026-08-09 场次收益不计入默认近 7 天收益",
  ],
  操作步骤: ["进入直播记录页", "查看收益汇总"],
  预期结果: ["收益 = 3,156 + 1,904 + 624 = 5,684"],
});
Object.assign(recordCaseById.get("LREC-005"), {
  用例描述: "验证默认近7天总时长汇总",
  验证用例子项: "默认近7天总时长汇总",
  前置条件: [
    "总时长定义为默认近 7 天内各场直播时长按分钟相加",
    "2026-08-12、2026-08-15、2026-08-17 三场时长依次为 2h18m、1h42m、56m",
    "2026-08-09 场次时长不计入默认近 7 天总时长",
  ],
  操作步骤: ["进入直播记录页", "查看总时长汇总"],
  预期结果: ["总时长 = 138 分钟 + 102 分钟 + 56 分钟 = 296 分钟 = 4h56m"],
});
Object.assign(recordCaseById.get("LREC-006"), {
  用例描述: "验证默认近7天直播场次汇总",
  验证用例子项: "默认近7天场次汇总",
  前置条件: [
    "直播场次定义为默认近 7 天内的直播记录数量",
    "2026-08-12、2026-08-15、2026-08-17 各存在一场直播记录",
    "2026-08-09 场次不计入默认近 7 天场次",
  ],
  操作步骤: ["进入直播记录页", "查看直播场次汇总"],
  预期结果: ["直播场次 = 3"],
});
for (const id of ["LREC-003", "LREC-004", "LREC-005", "LREC-006"]) {
  recordCaseById.get(id).备注.push("规则追溯：RCL-0019；默认日期范围按批注“默认近 7 天”生成，页面或 Mock 示例日期不作为边界规则");
}

Object.assign(recordQuestionById.get("Q-002"), {
  产品结论: "A",
  结论补充: "按 RCL-0019，以原型批注“默认近 7 天”为准；采用当天及前 6 个自然日，共 7 个自然日。页面或 Mock 示例日期不作为默认边界规则。",
  已知依据: [
    "原型批注明确写明默认近 7 天",
    "页面或 Mock 中存在 10/8/2026 至 17/8/2026 的示例日期",
    "RCL-0019 明确页面默认值或 Mock 示例与批注不一致时批注优先",
  ],
  确认后待补用例: [],
  期望确认时间: "已按 RCL-0019 处理",
  确认状态: "已确认",
});

const structureMap = {
  "入口与导航": "直播记录-入口与导航",
  "默认记录": "直播记录-默认记录",
  "快捷日期筛选": "直播记录-快捷日期筛选",
  "自定义日期筛选": "直播记录-自定义日期筛选",
  "无记录日期": "直播记录-无记录日期",
  "记录卡片": "直播记录-记录卡片",
  "记录生成": "直播记录-记录生成",
  "历史快照": "直播记录-历史快照",
};

const recordIdMap = new Map();
recordIdMap.set("LREC-049", "LIVE-262");
let nextId = 269;
for (let number = 1; number <= 54; number += 1) {
  const oldId = `LREC-${String(number).padStart(3, "0")}`;
  if (oldId === "LREC-049") continue;
  recordIdMap.set(oldId, `LIVE-${String(nextId).padStart(3, "0")}`);
  nextId += 1;
}
assert.equal(nextId, 322);

function normalizeRecordCase(item) {
  const result = clone(item);
  result.用例编号 = recordIdMap.get(item.用例编号);
  result.功能模块 = moduleName;
  result.功能结构 = structureMap[item.功能结构];
  if (item.用例编号 === "LREC-001") result.优先级 = "P1";
  result.备注 = result.备注.filter((note) => !note.startsWith("同步追溯："));
  result.备注.push(syncNote);
  if (!result.备注.includes(qualityNote)) result.备注.push(qualityNote);
  return result;
}

const replacementCase = normalizeRecordCase(recordCaseById.get("LREC-049"));
replacementCase.序号 = 262;
const cases = basePayload.测试用例.map((item) => {
  if (item.用例编号 === "LIVE-262") return replacementCase;
  const result = clone(item);
  result.备注 = result.备注.filter((note) => !note.startsWith("同步追溯："));
  result.备注.push(syncNote);
  return result;
});

for (let number = 1; number <= 54; number += 1) {
  const oldId = `LREC-${String(number).padStart(3, "0")}`;
  if (oldId === "LREC-049") continue;
  cases.push(normalizeRecordCase(recordCaseById.get(oldId)));
}
cases.sort((a, b) => Number(a.用例编号.slice(5)) - Number(b.用例编号.slice(5)));
cases.forEach((item, index) => { item.序号 = index + 1; });

function mapCaseReference(reference) {
  const exact = reference.match(/^LREC-(\d{3})$/);
  if (exact) return [recordIdMap.get(`LREC-${exact[1]}`)];
  const range = reference.match(/^LREC-(\d{3}) 至 LREC-(\d{3})$/);
  if (!range) return [reference];
  const start = Number(range[1]);
  const end = Number(range[2]);
  const mapped = [];
  for (let number = start; number <= end; number += 1) mapped.push(recordIdMap.get(`LREC-${String(number).padStart(3, "0")}`));
  const numbers = mapped.map((id) => Number(id.slice(5)));
  const groups = [];
  let groupStart = numbers[0];
  let previous = numbers[0];
  for (const number of numbers.slice(1)) {
    if (number === previous + 1) previous = number;
    else {
      groups.push([groupStart, previous]);
      groupStart = previous = number;
    }
  }
  groups.push([groupStart, previous]);
  return groups.map(([first, last]) => first === last
    ? `LIVE-${String(first).padStart(3, "0")}`
    : `LIVE-${String(first).padStart(3, "0")} 至 LIVE-${String(last).padStart(3, "0")}`);
}

const questionIdMap = new Map([
  ["Q-001", "Q-026"], ["Q-002", "Q-027"], ["Q-003", "Q-028"],
  ["Q-004", "Q-029"], ["Q-005", "Q-030"], ["Q-006", "Q-031"],
  ["Q-007", "Q-032"], ["Q-007-01", "Q-032-01"], ["Q-008", "Q-033"],
  ["Q-009", "Q-034"], ["Q-010", "Q-035"], ["Q-011", "Q-036"],
]);
const groupIdMap = new Map(Array.from({ length: 11 }, (_, index) => [
  `RQ-${String(index + 1).padStart(3, "0")}`,
  `RQ-${String(index + 26).padStart(3, "0")}`,
]));

const recordQuestions = recordPayload.需求待确认.map((item) => {
  const current = clone(recordQuestionById.get(item.问题编号));
  const oldId = current.问题编号;
  current.问题编号 = questionIdMap.get(oldId);
  current.需求组编号 = groupIdMap.get(current.需求组编号);
  current.功能模块 = moduleName;
  if (current.父问题编号) current.父问题编号 = questionIdMap.get(current.父问题编号);
  if (current.追问触发条件) {
    for (const [source, target] of questionIdMap) current.追问触发条件 = current.追问触发条件.replaceAll(source, target);
  }
  current.已有用例编号 = current.已有用例编号.flatMap(mapCaseReference);
  return current;
});

const questions = [...basePayload.需求待确认.map(clone), ...recordQuestions];
const blockRank = { 阻塞测试: 0, 部分阻塞: 1, 不阻塞: 2 };
const groupRank = new Map();
for (const item of questions) groupRank.set(item.需求组编号, Math.min(groupRank.get(item.需求组编号) ?? 9, blockRank[item.阻塞等级]));
const groups = [...new Set(questions.map((item) => item.需求组编号))].sort((a, b) => groupRank.get(a) - groupRank.get(b) || a.localeCompare(b, "zh-CN", { numeric: true }));
const orderedQuestions = [];
for (const group of groups) {
  const members = questions.filter((item) => item.需求组编号 === group);
  const children = new Map();
  for (const item of members) {
    const parent = item.父问题编号 || "";
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(item);
  }
  for (const list of children.values()) list.sort((a, b) => a.问题编号.localeCompare(b.问题编号, "zh-CN", { numeric: true }));
  const visit = (item) => {
    orderedQuestions.push(item);
    for (const child of children.get(item.问题编号) ?? []) visit(child);
  };
  for (const root of children.get("") ?? []) visit(root);
}

const payload = { 测试用例: cases, 需求待确认: orderedQuestions };

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionStatuses = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);

assert.equal(cases.length, 321);
assert.equal(orderedQuestions.length, 67);
assert.equal(new Set(cases.map((item) => item.用例编号)).size, cases.length);
assert.equal(new Set(orderedQuestions.map((item) => item.问题编号)).size, orderedQuestions.length);
assert.equal(cases.filter((item) => item.优先级 === "P0").length, 7);
for (const [index, item] of cases.entries()) {
  assert.equal(item.序号, index + 1, `序号不连续：${item.用例编号}`);
  assert.equal(item.用例编号, `LIVE-${String(index + 1).padStart(3, "0")}`, `编号不连续：${item.用例编号}`);
  assert.equal(item.功能模块, moduleName, `模块不一致：${item.用例编号}`);
  assert(validTypes.has(item.用例类型), `类型不合法：${item.用例编号}`);
  assert(validPriorities.has(item.优先级), `优先级不合法：${item.用例编号}`);
  assert(validResults.has(item.测试结果), `测试结果不合法：${item.用例编号}`);
  assert(item.用例描述.startsWith("验证"), `描述未以“验证”开头：${item.用例编号}`);
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0, `前置条件缺失：${item.用例编号}`);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0, `操作步骤缺失：${item.用例编号}`);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1 && item.预期结果[0].trim(), `预期结果错误：${item.用例编号}`);
  assert(Array.isArray(item.备注) && item.备注.some((note) => note.startsWith("来源：")), `来源缺失：${item.用例编号}`);
  assert(item.备注.includes(syncNote), `同步追溯缺失：${item.用例编号}`);
  assert(!item.前置条件.some((condition) => /场景\s*[A-ZＡ-Ｚ][：:]|条件[一二三四][：:]/.test(condition)), `前置条件包含替代场景：${item.用例编号}`);
  assert(!item.前置条件.some((condition) => condition.includes("或")), `前置条件包含未拆分“或”：${item.用例编号}`);
  assert(!item.操作步骤.some((step) => step.includes("或")), `操作步骤包含未拆分“或”：${item.用例编号}`);
  if (item.流程编号) {
    assert(item.备注.some((note) => note.startsWith("流程阶段：") || note.startsWith("阶段：")), `流程阶段缺失：${item.用例编号}`);
    assert(item.备注.some((note) => note.startsWith("共同业务对象：") || note.startsWith("对象：")), `共同业务对象缺失：${item.用例编号}`);
  }
}
const signature = (item) => [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join("|"), item.操作步骤.join("|"), item.预期结果[0]].join("||");
assert.equal(new Set(cases.map(signature)).size, cases.length, "存在完全重复用例");

const questionById = new Map(orderedQuestions.map((item) => [item.问题编号, item]));
for (const item of orderedQuestions) {
  assert(validQuestionBlocks.has(item.阻塞等级), `阻塞等级不合法：${item.问题编号}`);
  assert(validQuestionCategories.has(item.问题分类), `问题分类不合法：${item.问题编号}`);
  assert(validQuestionOwners.has(item.负责人), `负责人不合法：${item.问题编号}`);
  assert(validQuestionStatuses.has(item.确认状态), `确认状态不合法：${item.问题编号}`);
  assert(Array.isArray(item.可选方案) && item.可选方案.length >= 2 && item.可选方案.length <= 4, `选项数量不合法：${item.问题编号}`);
  assert(Array.isArray(item.已有用例编号) && Array.isArray(item.确认后待补用例), `影响用例字段不是数组：${item.问题编号}`);
  assert(item.已有用例编号.length + item.确认后待补用例.length > 0, `影响用例为空：${item.问题编号}`);
  assert(item.可选方案.every((option, index) => option.startsWith(`${String.fromCharCode(65 + index)}.`)), `选项标签错误：${item.问题编号}`);
  if (item.确认状态 === "已确认") assert(["A", "B", "C", "D", "其他"].includes(item.产品结论), `已确认问题缺少产品结论：${item.问题编号}`);
  else assert.equal(item.产品结论, "", `未确认问题预填产品结论：${item.问题编号}`);
  if (item.父问题编号) {
    assert(questionById.has(item.父问题编号), `父问题不存在：${item.问题编号}`);
    assert.equal(questionById.get(item.父问题编号).需求组编号, item.需求组编号, `父问题跨组：${item.问题编号}`);
    assert(item.追问触发条件.includes(item.父问题编号), `触发条件未指向父问题：${item.问题编号}`);
    assert.equal(item.确认状态, "待前置结论", `子问题状态错误：${item.问题编号}`);
  }
}
for (const item of orderedQuestions) {
  if (!item.父问题编号) continue;
  assert(orderedQuestions.indexOf(questionById.get(item.父问题编号)) < orderedQuestions.indexOf(item), `子问题早于父问题：${item.问题编号}`);
}

await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(syncPath, `${JSON.stringify(syncResult, null, 2)}\n`, "utf8");
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const testHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const questionHeaders = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");
const caseRow = (item) => [item.序号, item.用例编号, item.功能模块, item.功能结构, item.用例类型, item.优先级, item.用例描述, item.验证用例子项, numbered(item.前置条件), numbered(item.操作步骤), item.预期结果[0], item.流程编号, item.测试结果, item.测试人员, numbered(item.备注)];
const questionRow = (item) => questionHeaders.map((header) => {
  if (header === "可选方案") return item[header].join("\n");
  if (["已知依据", "影响范围", "已有用例编号", "确认后待补用例"].includes(header)) return numbered(item[header]);
  return item[header];
});

function columnName(index) {
  let value = index + 1;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function estimateRowHeight(row, widths) {
  let lines = 1;
  row.forEach((value, index) => {
    const text = String(value ?? "");
    const width = Math.max(5, widths[index]);
    const count = text.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil([...line].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(188, Math.max(38, lines * 16 + 10));
}

function buildSheet(workbook, { name, headers, rows, widths, tableName, validations = [], priorityColumn = null }) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnName(headers.length - 1);
  const lastRow = rows.length + 1;
  const range = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  range.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
  range.format = {
    font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#D6DEE8" },
  };
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#1F4E78",
    font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    rowHeightPx: 40,
    borders: { preset: "all", style: "thin", color: "#163A5A" },
  };
  for (const { column, values } of validations) sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  if (priorityColumn) {
    const priorityRange = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    priorityRange.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    priorityRange.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${columnName(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => { sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths); });
  return { sheet, lastColumn, lastRow };
}

const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例",
  headers: testHeaders,
  rows: cases.map(caseRow),
  widths: [8, 15, 19, 26, 13, 9, 36, 28, 46, 46, 54, 18, 12, 14, 52],
  tableName: "UserAppLiveTestCases",
  validations: [
    { column: "E", values: [...validTypes] },
    { column: "F", values: [...validPriorities] },
    { column: "M", values: [...validResults] },
  ],
  priorityColumn: "F",
});

const pending = buildSheet(workbook, {
  name: "需求待确认",
  headers: questionHeaders,
  rows: orderedQuestions.map(questionRow),
  widths: [15, 15, 16, 38, 14, 20, 38, 22, 48, 58, 50, 15, 36, 52, 42, 28, 42, 16, 22, 16],
  tableName: "UserAppLivePendingRequirements",
  validations: [
    { column: "E", values: [...validQuestionBlocks] },
    { column: "H", values: [...validQuestionCategories] },
    { column: "L", values: ["A", "B", "C", "D", "其他"] },
    { column: "R", values: [...validQuestionOwners] },
    { column: "T", values: [...validQuestionStatuses] },
  ],
});
pending.sheet.freezePanes.freezeColumns(3);
pending.sheet.getRange(`A2:C${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`E2:F${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`H2:H${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`R2:T${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`I2:I${pending.lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pending.sheet.getRange(`K2:K${pending.lastRow}`).format.fill = "#EAF4EA";
pending.sheet.getRange(`L2:M${pending.lastRow}`).format = { fill: "#FFF4CC", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6B656" } };
const pendingBlockRange = pending.sheet.getRange(`E2:E${pending.lastRow}`);
pendingBlockRange.conditionalFormats.add("containsText", { text: "阻塞测试", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
pendingBlockRange.conditionalFormats.add("containsText", { text: "部分阻塞", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
pendingBlockRange.conditionalFormats.add("containsText", { text: "不阻塞", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });
const pendingStatusRange = pending.sheet.getRange(`T2:T${pending.lastRow}`);
pendingStatusRange.conditionalFormats.add("containsText", { text: "待前置结论", format: { fill: "#EEF2F7", font: { bold: true, color: "#475569" } } });
pendingStatusRange.conditionalFormats.add("containsText", { text: "确认中", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
pendingStatusRange.conditionalFormats.add("containsText", { text: "已确认", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

let previousGroup = "";
orderedQuestions.forEach((item, index) => {
  const rowNumber = index + 2;
  if (item.需求组编号 !== previousGroup) {
    pending.sheet.getRange(`A${rowNumber}:T${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } };
    previousGroup = item.需求组编号;
  }
  if (item.父问题编号) {
    pending.sheet.getRange(`A${rowNumber}:D${rowNumber}`).format.fill = "#EAF2F8";
    pending.sheet.getRange(`C${rowNumber}:D${rowNumber}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#24557A" };
  } else pending.sheet.getRange(`B${rowNumber}`).format.fill = "#DDEBF7";
});

const overview = workbook.worksheets.add("产品决策概览");
overview.showGridLines = false;
overview.mergeCells("A1:H1");
overview.getRange("A1").values = [["产品决策概览"]];
overview.getRange("A1:H1").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 52 };
overview.mergeCells("A2:H2");
overview.getRange("A2").values = [["优先处理阻塞测试问题；子问题在父问题结论明确后再处理。已确认问题保留用于规则追溯。"]];
overview.getRange("A2:H2").format = { fill: "#EAF2F8", font: { name: "Microsoft YaHei", size: 10, color: "#334155" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 34 };
overview.getRange("A4:H4").values = [["问题总数", "", "当前可回答", "", "待前置结论", "", "已确认", ""]];
overview.getRange("A5:H5").values = [["", "", "", "", "", "", "", ""]];
for (const range of ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]) {
  overview.getRange(range).format = { fill: "#DDEBF7", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 30 };
}
for (const range of ["A5:B5", "C5:D5", "E5:F5", "G5:H5"]) {
  overview.getRange(range).format = { fill: "#FFFFFF", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 42 };
}
for (const range of ["A4:B4", "A5:B5", "C4:D4", "C5:D5", "E4:F4", "E5:F5", "G4:H4", "G5:H5"]) overview.mergeCells(range);
overview.getRange("A5").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})`]];
overview.getRange("C5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]];
overview.getRange("E5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待前置结论")`]];
overview.getRange("G5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"已确认")`]];
overview.getRange("A7:H7").values = [["按状态", "数量", "按阻塞等级", "待确认", "按负责人", "待确认", "结构检查", "数量"]];
overview.getRange("A7:H7").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#163A5A" }, rowHeightPx: 32 };
const statusValues = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"];
const blockValues = ["阻塞测试", "部分阻塞", "不阻塞"];
const ownerValues = ["产品", "交互", "技术", "多方确认"];
overview.getRange("A8:A12").values = statusValues.map((value) => [value]);
overview.getRange("C8:C10").values = blockValues.map((value) => [value]);
overview.getRange("E8:E11").values = ownerValues.map((value) => [value]);
overview.getRange("G8:G11").values = [["需求组"], ["追问子问题"], ["未填写产品结论"], ["选择其他但未补充"]];
statusValues.forEach((status, index) => { overview.getRange(`B${index + 8}`).formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"${status}")`]]; });
blockValues.forEach((level, index) => { overview.getRange(`D${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$E$2:$E$${pending.lastRow},"${level}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
ownerValues.forEach((owner, index) => { overview.getRange(`F${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$R$2:$R$${pending.lastRow},"${owner}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
overview.getRange("H8").values = [[new Set(orderedQuestions.map((item) => item.需求组编号)).size]];
overview.getRange("H9").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})-COUNTBLANK('需求待确认'!$C$2:$C$${pending.lastRow})`]];
overview.getRange("H10").formulas = [[`=COUNTBLANK('需求待确认'!$L$2:$L$${pending.lastRow})`]];
overview.getRange("H11").formulas = [[`=COUNTIFS('需求待确认'!$L$2:$L$${pending.lastRow},"其他",'需求待确认'!$M$2:$M$${pending.lastRow},"")`]];
overview.getRange("A8:H12").format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" }, rowHeightPx: 31 };
for (const range of ["A8:A12", "C8:C10", "E8:E11", "G8:G11"]) overview.getRange(range).format.horizontalAlignment = "left";
for (const range of ["B8:B12", "D8:D10", "F8:F11", "H8:H11"]) overview.getRange(range).format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A14:H14");
overview.getRange("A14").values = [["处理顺序：先回答“阻塞测试”根问题，再处理“部分阻塞”和“不阻塞”；展开需求组后按父问题、子问题顺序确认。"]];
overview.getRange("A14:H14").format = { fill: "#F8FAFC", font: { name: "Microsoft YaHei", size: 10, color: "#475569" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, rowHeightPx: 34, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
[22, 11, 22, 11, 22, 11, 24, 11].forEach((width, index) => { overview.getRange(`${columnName(index)}1`).format.columnWidth = width; });
overview.freezePanes.freezeRows(2);

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

function setOrReplaceXmlAttribute(tag, name, value) {
  const pattern = new RegExp(`\\s${name}="[^"]*"`);
  if (pattern.test(tag)) return tag.replace(pattern, ` ${name}="${value}"`);
  if (/\s*\/>$/.test(tag)) return tag.replace(/\s*\/>$/, ` ${name}="${value}" />`);
  return tag.replace(/>$/, ` ${name}="${value}">`);
}
function patchXmlFreeze(xml, freeze) {
  if (/<x:pane[^>]*\/>/.test(xml)) return xml.replace(/<x:pane[^>]*\/>/, freeze.split("<x:selection")[0]);
  if (/<x:sheetView([^>]*)\/>/.test(xml)) return xml.replace(/<x:sheetView([^>]*)\/>/, `<x:sheetView$1>${freeze}</x:sheetView>`);
  return xml.replace(/(<x:sheetView[^>]*>)/, `$1${freeze}`);
}
function patchXmlRow(xml, rowNumber, attributes) {
  const pattern = new RegExp(`<x:row\\s+([^>]*\\br="${rowNumber}"[^>]*)>`);
  return xml.replace(pattern, (tag) => Object.entries(attributes).reduce((updated, [name, value]) => setOrReplaceXmlAttribute(updated, name, value), tag));
}

const zip = await JSZip.loadAsync(await fs.readFile(outputPath));
const freezes = [
  [1, '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />'],
  [2, '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'],
  [3, '<x:pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A3" sqref="A3" />'],
];
for (const [sheetNumber, freeze] of freezes) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `缺少 ${entryName}`);
  let xml = patchXmlFreeze(await entry.async("string"), freeze);
  if (sheetNumber === 2) {
    if (!/<x:sheetPr>/.test(xml)) xml = xml.replace(/(<x:sheetViews>)/, '<x:sheetPr><x:outlinePr summaryBelow="0" summaryRight="1" /></x:sheetPr>$1');
    else if (!/<x:outlinePr/.test(xml)) xml = xml.replace(/(<x:sheetPr>)/, '$1<x:outlinePr summaryBelow="0" summaryRight="1" />');
    for (const column of [6, 8, 14, 15, 16, 17]) {
      const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${column}"[^>]*\\bmax="${column}"[^>]*\/>`);
      xml = xml.replace(pattern, (tag) => setOrReplaceXmlAttribute(tag, "hidden", "1"));
    }
    const parentIds = new Set(orderedQuestions.filter((item) => item.父问题编号).map((item) => item.父问题编号));
    orderedQuestions.forEach((item, index) => {
      const attributes = {};
      if (item.父问题编号) {
        attributes.hidden = "1";
        attributes.outlineLevel = "1";
      }
      if (parentIds.has(item.问题编号)) attributes.collapsed = "1";
      if (Object.keys(attributes).length > 0) xml = patchXmlRow(xml, index + 2, attributes);
    });
    xml = xml.replace(/<x:sheetFormatPr([^>]*)\/>/, (tag) => setOrReplaceXmlAttribute(tag, "outlineLevelRow", "1"));
  }
  assert(xml.includes('state="frozen"'), `冻结窗格写入失败：${entryName}`);
  zip.file(entryName, xml);
}

const workbookEntry = zip.file("xl/workbook.xml");
assert(workbookEntry, "缺少 xl/workbook.xml");
let workbookXml = await workbookEntry.async("string");
if (/<x:workbookView[^>]*\/>/.test(workbookXml)) workbookXml = workbookXml.replace(/<x:workbookView[^>]*\/>/, '<x:workbookView activeTab="2" />');
else if (/<x:bookViews>/.test(workbookXml)) workbookXml = workbookXml.replace(/<x:bookViews>/, '<x:bookViews><x:workbookView activeTab="2" />');
else workbookXml = workbookXml.replace(/(<x:sheets>)/, '<x:bookViews><x:workbookView activeTab="2" /></x:bookViews>$1');
if (!/<x:calcPr/.test(workbookXml)) workbookXml = workbookXml.replace(/<\/x:workbook>/, '<x:calcPr calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>');
zip.file("xl/workbook.xml", workbookXml);
await fs.writeFile(outputPath, await zip.generateAsync({ type: "nodebuffer" }));

const finalBytes = await fs.readFile(outputPath);
const finalZip = await JSZip.loadAsync(finalBytes);
const mainTableXml = await finalZip.file("xl/tables/table1.xml").async("string");
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
const finalWorkbookXml = await finalZip.file("xl/workbook.xml").async("string");
assert(mainTableXml.includes(`ref="A1:O${main.lastRow}"`));
assert.equal((mainTableXml.match(/<x:tableColumn /g) ?? []).length, 15);
assert(pendingTableXml.includes(`ref="A1:T${pending.lastRow}"`));
assert.equal((pendingTableXml.match(/<x:tableColumn /g) ?? []).length, 20);
assert.equal((pendingSheetXml.match(/hidden="1" outlineLevel="1"/g) ?? []).length, orderedQuestions.filter((item) => item.父问题编号).length);
assert(finalWorkbookXml.includes('activeTab="2"'));

const finalWorkbook = await SpreadsheetFile.importXlsx(finalBytes);
assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"]);
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 140 })).ndjson,
  mainHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O8", maxChars: 18000 })).ndjson,
  replacedCase: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A261:O264", maxChars: 16000 })).ndjson,
  recordCases: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A269:O276", maxChars: 22000 })).ndjson,
  mainTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A317:O322", maxChars: 18000 })).ndjson,
  pendingHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: "A1:T8", maxChars: 22000 })).ndjson,
  recordPending: (await finalWorkbook.inspect({ kind: "match", searchTerm: "Q-026|Q-027|Q-032-01|Q-036", options: { useRegex: true, maxResults: 40 }, summary: "直播记录待确认编号映射" })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`, "utf8");
await fs.writeFile(inspectNdjsonPath, Object.values(inspection).join("\n"), "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O9", "preview-main-head.png"],
  ["功能测试用例", "A260:O276", "preview-main-record-merge.png"],
  ["功能测试用例", "A315:O322", "preview-main-tail.png"],
  ["需求待确认", "A1:T9", "preview-pending-head.png"],
  ["需求待确认", "A56:T68", "preview-pending-records.png"],
  ["产品决策概览", "A1:H14", "preview-overview.png"],
]) {
  const preview = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

for (const item of baseline) {
  const current = await baselineEntry(item.相对路径);
  assert.equal(current["SHA-256"], item["SHA-256"], `生成期间原型基线变化：${item.相对路径}`);
}
const stat = await fs.stat(outputPath);
assert(stat.size > 0);
console.log(JSON.stringify({
  outputPath,
  jsonPath,
  syncPath,
  sheets: ["功能测试用例", "需求待确认", "产品决策概览"],
  cases: cases.length,
  questions: orderedQuestions.length,
  childQuestions: orderedQuestions.filter((item) => item.父问题编号).length,
  confirmedQuestions: orderedQuestions.filter((item) => item.确认状态 === "已确认").length,
  p0: cases.filter((item) => item.优先级 === "P0").length,
  bytes: stat.size,
}, null, 2));
