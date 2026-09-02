import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import JSZip from "jszip";

const rootDir = "/Users/geekonup/testcase";
const projectDir = path.join(rootDir, "liveshow-proto");
const workDir = path.join(rootDir, "work/liveshow-user-live-testcases-260831-002");
const outputDir = path.join(rootDir, "outputs/Luma Live-case");
const outputPath = path.join(outputDir, "用户App-直播模块-260831-002.xlsx");
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260831-002.json");
const syncPath = path.join(workDir, "prototype-context-sync-result.json");
const scanPath = path.join(workDir, "global-evidence-scan-result.json");
const cachePath = path.join(rootDir, "work/liveshow-proto-global-evidence-cache/latest.json");
const inspectionPath = path.join(workDir, "inspection-260831-002.json");
const inspectNdjsonPath = path.join(workDir, "workbook-inspection.ndjson");

const baseJsonPath = path.join(rootDir, "work/liveshow-user-live-testcases/用户App-直播模块-测试用例-260829-003.json");
const recordJsonPath = path.join(rootDir, "work/liveshow-user-live-records/用户App-直播记录模块-测试用例-260831-001.json");

const strategy = JSON.parse(await fs.readFile(path.join(projectDir, "需求来源策略.json"), "utf8"));
assert.equal(strategy.项目名称, "Luma Live");
assert.equal(strategy.来源策略, "prototype-primary");
assert.equal(strategy.生成前同步, true);
const scanResult = JSON.parse(await fs.readFile(scanPath, "utf8"));
assert.equal(scanResult.扫描模式, "full");
assert.equal(scanResult.项目目录, "liveshow-proto");
assert.equal(scanResult.扫描状态, "有非阻塞待确认");
assert.equal(scanResult.阻塞项.length, 0);
assert(scanResult.文件清单.length > 0);
assert(scanResult.已读取文件.length > 0);
assert(scanResult.未纳入文件.every((item) => item.原因));

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
  "prototype/pages/admin/host/admin-live-management.html",
  "prototype/pages/admin/host/admin-live-detail.html",
  "prototype/pages/admin/content/admin-report-handling.html",
  "prototype/pages/admin/content/admin-report-detail.html",
  "prototype/pages/admin/operations/admin-live-type.html",
  "prototype/pages/admin/operations/admin-feature-switch.html",
  "prototype/pages/admin/operations/admin-feature-switch-detail.html",
  "prototype/pages/admin/operations/admin-ticket-price-level.html",
  "prototype/pages/admin/operations/admin-ticket-price-level-detail.html",
  "prototype/pages/admin/operations/admin-sensitive-words.html",
  "prototype/pages/admin/operations/admin-sensitive-words-detail.html",
  "prototype/pages/admin/gifts/admin-gift-list.html",
  "prototype/pages/admin/gifts/admin-gift-detail.html",
  "prototype/pages/admin/gifts/admin-gift-send-count-rules.html",
  "prototype/pages/admin/gifts/admin-gift-send-count-rule-detail.html",
  "prototype/pages/admin/accounts/admin-operation-accounts.html",
  "prototype/pages/admin/accounts/admin-operation-gift-records.html",
  "prototype/pages/guild/people/guild-host-detail.html",
  "prototype/pages/guild/data/guild-all-live.html",
  "prototype/pages/guild/data/guild-host-data.html",
  "prototype/pages/guild/data/guild-live-gift-detail.html",
  "prototype/pages/guild/operations/guild-operation-accounts.html",
  "prototype/pages/guild/operations/guild-operation-gift-records.html",
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
    "管理后台 / 直播房型、直播类型、门票价格、敏感词、礼物、举报、直播处置、运营账号",
    "公会 App / 主播直播权限、直播记录、运营账号及虚拟送礼",
  ],
  目标需求清单: [
    "context/01-用户主播App-项目需求清单.md",
    "context/01-用户主播App-角色与用例.md",
    "context/01-互动场景权限规则.md",
    "context/01-业务对象清单.md",
    "context/02-公会App-项目需求清单.md（仅作关联证据）",
    "context/03-管理后台-项目需求清单.md（仅作关联证据）",
  ],
  差异统计: { 新增: 0, 修改: 0, 明确删除: 0, 原型未覆盖: 5, 来源冲突: 1, 无法定位: 0 },
  需求清单变更日志编号: ["RSL-0002", "RSL-0003"],
  同步摘要: [
    "本次复核未发现当前原型与派生需求清单之间需要再次写入的差异。",
    "直播记录规则已由前序同步 RSL-0003 写入需求清单，本次直接纳入完整直播模块。",
    "页面默认示例日期与批注“默认近 7 天”的差异按 RCL-0019 使用批注，不计来源冲突。",
    "首次组合扫描已完成 264 个项目文件建档，并将管理后台和公会端作为用户 App 直播模块的关联证据。",
    "用户 App 固定赠送数量菜单与管理后台购买份数配置的来源关系不明确，保留原型现状用例并新增 Q-037 重审项。",
  ],
  前序同步变更: { 日志编号: "RSL-0003", 新增: 1, 修改: 1, 明确删除: 0 },
  受影响用例: [
    { 范围: "用户App-直播模块-260829-003.xlsx", 状态: "继续有效", 数量: 267 },
    { 范围: "用户App-直播模块-260829-003.xlsx / LIVE-262", 状态: "已被替代", 数量: 1 },
    { 范围: "用户App-直播记录模块-260831-002.xlsx", 状态: "继续有效并合入本次模块", 数量: 54 },
    { 范围: "用户App 直播模块历史 Excel", 状态: "需要重审", 数量: 0 },
    { 范围: "用户App 直播模块历史 Excel", 状态: "应当废弃", 数量: 0 },
    { 范围: "用户App-直播模块-260831-001.xlsx / LIVE-090 至 LIVE-091", 状态: "需要重审", 数量: 2 },
  ],
  阻塞异常: [],
  非阻塞待确认: [
    "直播记录入口和单场记录后续查看方式",
    "直播记录日期时区、观众人数与收礼数量统计口径",
    "结束直播后的记录可查询时效与异常结束记录生成规则",
    "大量历史记录加载和保留期限",
    "礼物赠送数量由用户 App 固定菜单还是管理后台购买份数配置决定",
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const basePayload = JSON.parse(await fs.readFile(baseJsonPath, "utf8"));
const recordPayload = JSON.parse(await fs.readFile(recordJsonPath, "utf8"));
const moduleName = "用户App-直播模块";
const syncNote = "同步追溯：work/liveshow-user-live-testcases-260831-002/prototype-context-sync-result.json；RSL-0002、RSL-0003";
const globalEvidenceNote = "全局证据追溯：work/liveshow-user-live-testcases-260831-002/global-evidence-scan-result.json；扫描模式 full";
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
  result.备注.push(globalEvidenceNote);
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
  result.备注.push(globalEvidenceNote);
  return result;
});

for (let number = 1; number <= 54; number += 1) {
  const oldId = `LREC-${String(number).padStart(3, "0")}`;
  if (oldId === "LREC-049") continue;
  cases.push(normalizeRecordCase(recordCaseById.get(oldId)));
}

const crossEndCases = [
  {
    功能模块: moduleName,
    功能结构: "平台处置直播",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证平台强制关播后的观众提示",
    验证用例子项: "强制关播结束提示",
    前置条件: ["观众正在观看直播场次 LIVE-ADMIN-001", "管理后台中该场次状态为直播中"],
    操作步骤: ["管理员在直播详情对 LIVE-ADMIN-001 执行强制关播", "查看观众端页面"],
    预期结果: ["观众端显示“直播已结束”提示"],
    流程编号: "FLOW-LIVE-006",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/03-管理后台-项目需求清单.md 第29行", "来源：prototype/pages/admin/host/admin-live-detail.html", "来源：prototype/pages/user/live/live-end-viewer.html；静态分析，未动态验证", "流程阶段：平台强制关播后的观众提示", "共同业务对象：直播场次 LIVE-ADMIN-001", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "平台处置直播",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证平台强制关播后的观众落点",
    验证用例子项: "强制关播返回广场",
    前置条件: ["观众正在观看直播场次 LIVE-ADMIN-001", "管理后台中该场次状态为直播中"],
    操作步骤: ["管理员在直播详情对 LIVE-ADMIN-001 执行强制关播", "查看观众端处置完成后的页面"],
    预期结果: ["观众端返回直播广场"],
    流程编号: "FLOW-LIVE-006",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/03-管理后台-项目需求清单.md 第29行", "来源：prototype/pages/admin/host/admin-live-detail.html；静态分析，未动态验证", "流程阶段：平台强制关播后的观众落点", "共同业务对象：直播场次 LIVE-ADMIN-001", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "平台处置直播",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证平台强制关闭门票房不退还门票金币",
    验证用例子项: "强制关播门票不退款",
    前置条件: ["用户已支付 10 金币进入门票房场次 LIVE-ADMIN-T01", "购票后用户金币余额为 90", "管理后台中该场次状态为直播中"],
    操作步骤: ["管理员在直播详情对 LIVE-ADMIN-T01 执行强制关播", "用户进入余额明细查看金币余额"],
    预期结果: ["用户金币余额保持 90"],
    流程编号: "FLOW-LIVE-006",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/03-管理后台-项目需求清单.md 第30行", "来源：prototype/pages/admin/host/admin-live-detail.html；静态分析，未动态验证", "流程阶段：平台强制关闭门票房后的资金结果", "共同业务对象：门票房场次 LIVE-ADMIN-T01 及本场购票资格", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "直播权限联动",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证公会关闭直播权限后结束进行中直播",
    验证用例子项: "公会关权限结束场次",
    前置条件: ["主播 HOST-G01 正在用户 App 直播", "平台已开通 HOST-G01 的直播权限", "公会端当前直播权限为开启"],
    操作步骤: ["公会管理员在主播详情关闭 HOST-G01 的直播权限并确认", "查看主播用户 App 的当前直播状态"],
    预期结果: ["HOST-G01 的当前直播场次结束"],
    流程编号: "FLOW-LIVE-007",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/02-公会App-项目需求清单.md 第27行", "来源：prototype/assets/annotations.js 的 guild-host-detail.html 批注", "来源：prototype/pages/guild/people/guild-host-detail.html；静态分析，未动态验证", "流程阶段：公会关闭权限后终止用户 App 场次", "共同业务对象：主播 HOST-G01 的直播权限及当前直播场次", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "直播权限联动",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证公会关闭直播权限后的用户 App 状态",
    验证用例子项: "公会关权限状态回显",
    前置条件: ["主播 HOST-G01 已通过认证", "平台已开通 HOST-G01 的直播权限", "公会端已关闭 HOST-G01 的直播权限"],
    操作步骤: ["HOST-G01 登录用户 App", "进入主播权限状态页面"],
    预期结果: ["直播权限状态显示为“已关闭”"],
    流程编号: "FLOW-LIVE-007",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/01-用户主播App-项目需求清单.md 第168行", "来源：context/02-公会App-项目需求清单.md 第27行", "流程阶段：主播在用户 App 查看公会关闭后的权限状态", "共同业务对象：主播 HOST-G01 的直播权限", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "开播设置",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证指定测试用户可选择灰度房型",
    验证用例子项: "测试用户房型开放范围",
    前置条件: ["后台已开启密码房", "密码房开放用户范围为指定测试用户", "主播账号 HOST-TEST-01 已加入指定测试用户列表", "HOST-TEST-01 具备直播权限"],
    操作步骤: ["HOST-TEST-01 登录用户 App", "进入开播设置并打开房型设置"],
    预期结果: ["房型列表提供可选择的“密码房”"],
    流程编号: "FLOW-LIVE-008",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：prototype/pages/admin/operations/admin-feature-switch-detail.html", "来源：context/01-用户主播App-项目需求清单.md；静态分析，未动态验证", "流程阶段：后台指定测试用户后的用户 App 房型可见性", "共同业务对象：密码房灰度配置及主播 HOST-TEST-01", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "开播设置",
    用例类型: "逻辑校验",
    优先级: "P1",
    用例描述: "验证非测试用户不能选择指定范围房型",
    验证用例子项: "非测试用户房型隔离",
    前置条件: ["后台已开启密码房", "密码房开放用户范围为指定测试用户", "主播账号 HOST-NORMAL-01 不在指定测试用户列表", "HOST-NORMAL-01 具备直播权限"],
    操作步骤: ["HOST-NORMAL-01 登录用户 App", "进入开播设置并打开房型设置"],
    预期结果: ["房型列表不提供可选择的“密码房”"],
    流程编号: "FLOW-LIVE-008",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：prototype/pages/admin/operations/admin-feature-switch-detail.html", "来源：context/01-用户主播App-项目需求清单.md；静态分析，未动态验证", "流程阶段：后台指定测试用户后的非名单账号隔离", "共同业务对象：密码房灰度配置及主播 HOST-NORMAL-01", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "开播设置",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证全部用户范围的房型可选择",
    验证用例子项: "全部用户房型开放范围",
    前置条件: ["后台已开启门票房", "门票房开放用户范围为全部用户", "主播 HOST-NORMAL-01 具备直播权限"],
    操作步骤: ["HOST-NORMAL-01 登录用户 App", "进入开播设置并打开房型设置"],
    预期结果: ["房型列表提供可选择的“门票房”"],
    流程编号: "FLOW-LIVE-008",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：prototype/pages/admin/operations/admin-feature-switch-detail.html", "来源：context/01-用户主播App-项目需求清单.md；静态分析，未动态验证", "流程阶段：后台面向全部用户开放房型后的用户 App 可见性", "共同业务对象：门票房灰度配置及主播 HOST-NORMAL-01", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "直播送礼",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证后台上架礼物进入用户 App 礼物面板",
    验证用例子项: "上架礼物面板可见",
    前置条件: ["后台已将普通礼物 GFT-LIVE-01 设置为上架", "用户正在观看支持送礼的直播"],
    操作步骤: ["用户打开礼物面板", "切换到普通礼物分类"],
    预期结果: ["普通礼物列表展示 GFT-LIVE-01"],
    流程编号: "FLOW-LIVE-009",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/01-用户主播App-项目需求清单.md 第53行", "来源：context/03-管理后台-项目需求清单.md 第58行", "来源：prototype/pages/admin/gifts/admin-gift-list.html；静态分析，未动态验证", "流程阶段：后台礼物上架后的用户 App 展示", "共同业务对象：礼物 GFT-LIVE-01", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "直播送礼",
    用例类型: "逻辑校验",
    优先级: "P1",
    用例描述: "验证后台下架礼物不进入用户 App 礼物面板",
    验证用例子项: "下架礼物面板隐藏",
    前置条件: ["后台已将普通礼物 GFT-LIVE-02 设置为下架", "用户正在观看支持送礼的直播"],
    操作步骤: ["用户打开礼物面板", "切换到普通礼物分类"],
    预期结果: ["普通礼物列表不展示 GFT-LIVE-02"],
    流程编号: "FLOW-LIVE-009",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/03-管理后台-项目需求清单.md 第58行", "来源：prototype/pages/admin/gifts/admin-gift-list.html；静态分析，未动态验证", "流程阶段：后台礼物下架后的用户 App 展示", "共同业务对象：礼物 GFT-LIVE-02", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "直播送礼",
    用例类型: "逻辑校验",
    优先级: "P1",
    用例描述: "验证用户 App 礼物价格采用后台配置",
    验证用例子项: "礼物金币价格跨端一致",
    前置条件: ["后台已将上架礼物 GFT-LIVE-01 的金币单价保存为 20", "用户正在观看支持送礼的直播"],
    操作步骤: ["用户打开礼物面板", "查看 GFT-LIVE-01 的金币价格"],
    预期结果: ["GFT-LIVE-01 在用户 App 展示的金币价格为 20"],
    流程编号: "FLOW-LIVE-009",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/01-用户主播App-项目需求清单.md 第53行", "来源：prototype/pages/admin/gifts/admin-gift-detail.html；静态分析，未动态验证", "流程阶段：后台保存礼物单价后的用户 App 回显", "共同业务对象：礼物 GFT-LIVE-01", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "直播送礼",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证运营账号虚拟送礼计入贡献榜",
    验证用例子项: "虚拟送礼榜单展示",
    前置条件: ["运营账号 OP-LIVE-01 已获得虚拟金币", "OP-LIVE-01 在直播场次 LIVE-OPS-001 赠送价值 100 金币的礼物", "赠送前 OP-LIVE-01 在本场贡献值为 0"],
    操作步骤: ["用户在 LIVE-OPS-001 打开贡献榜", "查看 OP-LIVE-01 的本场贡献值"],
    预期结果: ["OP-LIVE-01 的本场贡献值为 100"],
    流程编号: "FLOW-LIVE-010",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/03-管理后台-项目需求清单.md 第79行", "来源：context/02-公会App-项目需求清单.md 第55至56行", "来源：prototype/assets/annotations.js 的运营账号批注；静态分析，未动态验证", "流程阶段：运营账号送礼后的用户 App 榜单观察", "共同业务对象：运营账号 OP-LIVE-01、直播场次 LIVE-OPS-001 及虚拟礼物记录", syncNote, globalEvidenceNote],
  },
  {
    功能模块: moduleName,
    功能结构: "主播直播间",
    用例类型: "业务流程",
    优先级: "P1",
    用例描述: "验证运营账号虚拟送礼不计入主播真实收益",
    验证用例子项: "虚拟送礼收益隔离",
    前置条件: ["主播在 LIVE-OPS-001 的实时收益为 500 金币", "运营账号 OP-LIVE-01 已获得虚拟金币"],
    操作步骤: ["OP-LIVE-01 在 LIVE-OPS-001 赠送价值 100 金币的礼物", "主播查看当前实时收益"],
    预期结果: ["主播实时收益保持 500 金币"],
    流程编号: "FLOW-LIVE-010",
    测试结果: "未测",
    测试人员: "",
    备注: ["来源：context/03-管理后台-项目需求清单.md 第79至80行", "来源：context/02-公会App-项目需求清单.md 第56行", "流程阶段：运营账号送礼后的主播收益观察", "共同业务对象：运营账号 OP-LIVE-01、直播场次 LIVE-OPS-001 及主播实时收益", syncNote, globalEvidenceNote],
  },
];
crossEndCases.forEach((item, index) => cases.push({ 序号: 322 + index, 用例编号: `LIVE-${String(322 + index).padStart(3, "0")}`, ...item }));

for (const id of ["LIVE-090", "LIVE-091"]) {
  const item = cases.find((current) => current.用例编号 === id);
  item.备注.push("跨端重审：管理后台存在购买份数配置，用户 App 固定数量菜单与后台配置的最终关系见 Q-037");
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

const quantitySourceQuestion = {
  问题编号: "Q-037",
  需求组编号: "RQ-037",
  父问题编号: "",
  追问触发条件: "",
  阻塞等级: "部分阻塞",
  功能模块: moduleName,
  具体场景: "管理后台维护礼物购买份数配置，用户在直播间打开所选礼物的赠送数量菜单",
  问题分类: "跨端与跨模块一致性",
  待决策问题: "用户 App 礼物赠送数量选项最终采用哪一种来源规则？",
  可选方案: [
    "A. 用户 App 固定展示 x1、x10、x66、x188、x520，管理后台购买份数配置不影响用户 App",
    "B. 用户 App 仅展示对所选礼物生效的后台购买份数配置，并按后台排序展示",
    "C. 用户 App 固定保留 x1，再追加对所选礼物生效的后台购买份数配置，重复数量只展示一次",
  ],
  测试建议: "建议 B；管理后台已提供礼物类型、适用礼物、状态和排序字段，直接作为用户端数量来源更便于配置闭环。",
  产品结论: "",
  结论补充: "",
  已知依据: [
    "prototype/assets/common.js 将用户 App 数量菜单固定为 1、10、66、188、520",
    "prototype/pages/admin/gifts/admin-gift-send-count-rules.html 提供购买份数、适用礼物、状态和排序配置",
    "prototype/assets/admin-mock.js 当前只有数量 1 的全类型规则生效，数量 10 的定制礼物规则失效",
  ],
  影响范围: ["用户 App / 直播间 / 礼物数量菜单", "管理后台 / 礼物道具 / 购买份数配置", "礼物送出数量及对应扣费测试数据"],
  已有用例编号: ["LIVE-090 至 LIVE-091"],
  确认后待补用例: ["直播送礼-赠送数量选项来源与后台配置生效"],
  负责人: "多方确认",
  期望确认时间: "本轮回归前",
  确认状态: "待确认",
};
const questions = [...basePayload.需求待确认.map(clone), ...recordQuestions, quantitySourceQuestion];
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

assert.equal(cases.length, 334);
assert.equal(orderedQuestions.length, 68);
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
  assert(item.备注.includes(globalEvidenceNote), `全局证据追溯缺失：${item.用例编号}`);
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
  mainTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A320:O335", maxChars: 30000 })).ndjson,
  pendingHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: "A1:T8", maxChars: 22000 })).ndjson,
  recordPending: (await finalWorkbook.inspect({ kind: "match", searchTerm: "Q-026|Q-027|Q-032-01|Q-036|Q-037", options: { useRegex: true, maxResults: 40 }, summary: "直播记录及跨端待确认编号映射" })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`, "utf8");
await fs.writeFile(inspectNdjsonPath, Object.values(inspection).join("\n"), "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O9", "preview-main-head.png"],
  ["功能测试用例", "A260:O276", "preview-main-record-merge.png"],
  ["功能测试用例", "A319:O335", "preview-main-tail.png"],
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
const finalScanResult = JSON.parse(await fs.readFile(scanPath, "utf8"));
const changedEvidence = [];
for (const item of finalScanResult.开始基线) {
  const absolutePath = path.join(projectDir, item.相对路径);
  try {
    const bytes = await fs.readFile(absolutePath);
    const currentHash = crypto.createHash("sha256").update(bytes).digest("hex");
    if (currentHash !== item["SHA-256"]) changedEvidence.push(item.相对路径);
  } catch {
    changedEvidence.push(item.相对路径);
  }
}
for (const item of finalScanResult.规则基线) {
  const absolutePath = path.join(rootDir, item.相对路径);
  try {
    const bytes = await fs.readFile(absolutePath);
    const currentHash = crypto.createHash("sha256").update(bytes).digest("hex");
    if (currentHash !== item["SHA-256"]) changedEvidence.push(item.相对路径);
  } catch {
    changedEvidence.push(item.相对路径);
  }
}
assert.deepEqual(changedEvidence, [], `输出前证据基线变化：${changedEvidence.join(", ")}`);
finalScanResult.输出前复核 = { 状态: "通过", 变化文件: [] };
finalScanResult.扫描状态 = "有非阻塞待确认";
finalScanResult.交付产物 = {
  JSON: path.relative(rootDir, jsonPath),
  Excel: path.relative(rootDir, outputPath),
  正式用例数: cases.length,
  需求待确认数: orderedQuestions.length,
};
await fs.writeFile(scanPath, `${JSON.stringify(finalScanResult, null, 2)}\n`, "utf8");
await fs.mkdir(path.dirname(cachePath), { recursive: true });
await fs.writeFile(cachePath, `${JSON.stringify(finalScanResult, null, 2)}\n`, "utf8");
const stat = await fs.stat(outputPath);
assert(stat.size > 0);
console.log(JSON.stringify({
  outputPath,
  jsonPath,
  syncPath,
  scanPath,
  cachePath,
  sheets: ["功能测试用例", "需求待确认", "产品决策概览"],
  cases: cases.length,
  questions: orderedQuestions.length,
  childQuestions: orderedQuestions.filter((item) => item.父问题编号).length,
  confirmedQuestions: orderedQuestions.filter((item) => item.确认状态 === "已确认").length,
  p0: cases.filter((item) => item.优先级 === "P0").length,
  bytes: stat.size,
}, null, 2));
