import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = "/Users/geekonup/testcase";
const projectDir = path.join(rootDir, "liveshow-proto");
const workDir = path.join(rootDir, "work/liveshow-user-live-testcases-260901-004");
const outputDir = path.join(rootDir, "outputs/Luma Live-case");
const outputPath = path.join(outputDir, "用户App-直播模块-260901-004.xlsx");
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260901-004.json");
const syncPath = path.join(workDir, "prototype-context-sync-result.json");
const scanPath = path.join(workDir, "global-evidence-scan-result.json");
const reviewPath = path.join(workDir, "target-end-executability-review.json");
const aliasReviewPath = path.join(workDir, "business-alias-readability-review.json");
const inspectionPath = path.join(workDir, "inspection-260901-004.json");
const cachePath = path.join(rootDir, "work/liveshow-proto-global-evidence-cache/latest.json");
const sourceJsonPath = path.join(rootDir, "work/liveshow-user-live-testcases-260831-004/用户App-直播模块-测试用例-260831-004.json");
const sourceSyncPath = path.join(rootDir, "work/liveshow-user-live-testcases-260901-003/prototype-context-sync-result.json");
const sourceScanPath = path.join(rootDir, "work/liveshow-user-live-testcases-260901-003/global-evidence-scan-result.json");

const clone = (value) => JSON.parse(JSON.stringify(value));
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const moduleName = "用户App-直播模块";
const newTraceDir = "work/liveshow-user-live-testcases-260901-004";
const executionFields = ["前置条件", "操作步骤", "预期结果"];
const displayFields = [...executionFields, "备注"];
const businessAliases = [
  { code: "GFT-LIVE-01", first: "“鲜花”", later: "“鲜花”", noteLabel: "礼物“鲜花”", kind: "来源名称", source: "prototype/pages/user/live/live-room.html 的礼物列表" },
  { code: "GFT-LIVE-02", first: "“咖啡”", later: "“咖啡”", noteLabel: "礼物“咖啡”", kind: "来源名称", source: "prototype/assets/admin-mock.js 的下架普通礼物" },
  { code: "GFT-LIVE-03", first: "“星光”", later: "“星光”", noteLabel: "礼物“星光”", kind: "来源名称", source: "prototype/pages/user/live/live-room.html 的礼物列表" },
  { code: "GFT-LIVE-04", first: "“麦克风”", later: "“麦克风”", noteLabel: "礼物“麦克风”", kind: "来源名称", source: "prototype/pages/user/live/live-room.html 的礼物列表" },
  { code: "HOST-G01", first: "目标主播", later: "该主播", noteLabel: "目标主播", kind: "对象描述", source: "输入材料未提供专名；由用例中的主播角色和权限条件识别" },
  { code: "HOST-NORMAL-01", first: "目标主播", later: "该主播", noteLabel: "目标主播", kind: "对象描述", source: "输入材料未提供专名；由用例中的主播角色和测试名单条件识别" },
  { code: "HOST-TEST-01", first: "目标主播", later: "该主播", noteLabel: "目标主播", kind: "对象描述", source: "输入材料未提供专名；由用例中的主播角色和测试名单条件识别" },
  { code: "LIVE-ADMIN-001", first: "目标直播场次", later: "该场次", noteLabel: "目标直播场次", kind: "对象描述", source: "输入材料未提供场次名称；由用例中的直播状态识别" },
  { code: "LIVE-ADMIN-T01", first: "目标门票房场次", later: "该场次", noteLabel: "目标门票房场次", kind: "对象描述", source: "输入材料未提供场次名称；由用例中的门票房条件识别" },
  { code: "LIVE-OPS-001", first: "目标直播场次", later: "该场次", noteLabel: "目标直播场次", kind: "对象描述", source: "输入材料未提供场次名称；由用例中的运营送礼关系识别" },
  { code: "LIVE-REPORT-001", first: "目标直播场次", later: "该场次", noteLabel: "目标直播场次", kind: "对象描述", source: "输入材料未提供场次名称；由用例中的举报工单关系识别" },
  { code: "LIVE-SESSION-001", first: "目标直播场次", later: "该场次", noteLabel: "目标直播场次", kind: "对象描述", source: "输入材料未提供场次名称；由用例中的直播记录状态识别" },
  { code: "LIVE-SESSION-002", first: "历史直播场次", later: "该历史直播场次", noteLabel: "历史直播场次", kind: "对象描述", source: "“深夜聊天局”仅是开播标题，不作为场次名称" },
  { code: "LIVE-SESSION-N01", first: "普通直播场次", later: "该场次", noteLabel: "普通直播场次", kind: "对象描述", source: "输入材料未提供场次名称；由流程中的普通房型识别" },
  { code: "LIVE-SESSION-T01", first: "门票房场次", later: "该场次", noteLabel: "门票房场次", kind: "对象描述", source: "输入材料未提供场次名称；由流程中的门票房型识别" },
  { code: "LIVE-SESSION-P01", first: "密码房场次", later: "该场次", noteLabel: "密码房场次", kind: "对象描述", source: "输入材料未提供场次名称；由流程中的密码房型识别" },
  { code: "USER-T01", first: "目标观众", later: "该观众", noteLabel: "目标观众", kind: "对象描述", source: "输入材料未提供用户名称；由流程中的购票观众角色识别" },
  { code: "USER-P01", first: "目标观众", later: "该观众", noteLabel: "目标观众", kind: "对象描述", source: "输入材料未提供用户名称；由流程中的密码房观众角色识别" },
  { code: "USER-CHAT-01", first: "非好友目标观众", later: "该观众", noteLabel: "非好友目标观众", kind: "对象描述", source: "输入材料未提供用户名称；由删除好友后的非好友关系和直播间私信场景识别" },
  { code: "COHOST-SESSION-01", first: "连麦会话", later: "该会话", noteLabel: "连麦会话", kind: "对象描述", source: "输入材料未提供会话名称；由跨主播连麦流程识别" },
  { code: "GIFT-TXN-01", first: "礼物交易记录", later: "该记录", noteLabel: "礼物交易记录", kind: "对象描述", source: "输入材料未提供交易名称；由送礼与余额收益流程识别" },
  { code: "OP-LIVE-01", first: "目标运营账号", later: "该运营账号", noteLabel: "目标运营账号", kind: "对象描述", source: "输入材料未提供账号名称；由用例中的运营账号角色和虚拟金币条件识别" },
  { code: "OP-LIVE-02", first: "目标运营账号", later: "该运营账号", noteLabel: "目标运营账号", kind: "对象描述", source: "输入材料未提供账号名称；由用例中的运营账号角色和启用状态识别" },
];
const prohibitedGeneratedNames = ["“免检账号B”", "“气氛号A”", "“公会权限测试主播”", "“普通主播”", "“灰度测试主播”", "“平台关播测试场次”", "“平台关播门票房场次”", "“运营送礼测试场次”", "“举报测试场次”", "“直播记录测试场次”"];

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

async function fileHash(absolutePath) {
  return sha256(await fs.readFile(absolutePath));
}

async function walk(directory, base = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".DS_Store") continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath, base));
    else if (entry.isFile()) files.push(path.relative(base, absolutePath).split(path.sep).join("/"));
  }
  return files;
}

function fileCategory(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  if (relativePath.startsWith("context/")) return "需求与业务上下文";
  if (relativePath.startsWith("prototype/pages/user/")) return "用户App原型页面";
  if (relativePath.startsWith("prototype/pages/admin/")) return "管理后台原型页面";
  if (relativePath.startsWith("prototype/pages/guild/")) return "公会App原型页面";
  if (relativePath.startsWith("prototype/assets/") && [".js", ".json"].includes(extension)) return "公共脚本与Mock";
  if (relativePath.startsWith("prototype/assets/")) return "样式与视觉资源";
  if (relativePath.startsWith("app-store-screenshots/")) return "竞品截图";
  if (relativePath.startsWith("workspace/")) return "其他需求工作区";
  if (relativePath.startsWith("prototype/")) return "原型说明与入口";
  return "项目规则与说明";
}

function excludedReason(relativePath, category) {
  if (category === "竞品截图") return "仅作为竞品视觉参考；本次未要求UI视觉测试。";
  if (category === "样式与视觉资源") return "仅承载样式或装饰素材，不用于建立业务入口或预期。";
  if (category === "其他需求工作区") return "不涉及用户App直播模块及本次已发现依赖。";
  if (relativePath.endsWith(".html")) return "页面已建档，但不属于用户App直播范围或已发现的跨端依赖。";
  return "文件已建档，与本次用户App直播模块修正无直接关系。";
}

await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const strategy = JSON.parse(await fs.readFile(path.join(projectDir, "需求来源策略.json"), "utf8"));
assert.equal(strategy.来源策略, "prototype-primary");
assert.equal(strategy.生成前同步, true);

const commonText = await fs.readFile(path.join(projectDir, "prototype/assets/common.js"), "utf8");
const roomText = await fs.readFile(path.join(projectDir, "prototype/pages/user/live/live-room.html"), "utf8");
const annotationsText = await fs.readFile(path.join(projectDir, "prototype/assets/annotations.js"), "utf8");
const requirementText = await fs.readFile(path.join(projectDir, "context/01-用户主播App-项目需求清单.md"), "utf8");
const overviewText = await fs.readFile(path.join(projectDir, "context/系统概要 .md"), "utf8");

for (const phrase of ["data-gift-tab=\"lucky\"", "data-send-gift", "gift-balance"]) assert(commonText.includes(phrase));
assert(roomText.includes("lucky-notice"));
assert(requirementText.includes("礼物面板/详情展示中奖概率与奖励档位"));
assert(overviewText.includes("价格、奖励档位和概率由平台配置"));
for (const unsupportedEntry of ["幸运礼物详情", "奖励说明", "开奖明细"]) {
  assert(!commonText.includes(unsupportedEntry), `用户App共享交互中意外出现入口：${unsupportedEntry}`);
  assert(!roomText.includes(unsupportedEntry), `用户App直播间中意外出现入口：${unsupportedEntry}`);
  assert(!annotationsText.includes(unsupportedEntry), `用户App批注中意外出现入口：${unsupportedEntry}`);
}

const sourcePayload = JSON.parse(await fs.readFile(sourceJsonPath, "utf8"));
const removedIds = new Set(["LIVE-335", "LIVE-352", "LIVE-353", "LIVE-356"]);
const oldToNew = new Map();
const cases = [];
for (const source of sourcePayload.测试用例) {
  if (removedIds.has(source.用例编号)) continue;
  const item = clone(source);
  const newId = `LIVE-${String(cases.length + 1).padStart(3, "0")}`;
  oldToNew.set(source.用例编号, newId);
  item.序号 = cases.length + 1;
  item.用例编号 = newId;
  item.备注 = item.备注.map((note) => note
    .replaceAll("work/liveshow-user-live-testcases-260831-004", newTraceDir)
    .replaceAll("扫描模式 incremental", "扫描模式 full"));
  if (newId === "LIVE-262") {
    item.前置条件 = item.前置条件.map((value) => value.replace("本场直播标识为 LIVE-SESSION-001", "直播场次 LIVE-SESSION-001 已准备"));
  }
  if (["LIVE-354", "LIVE-355"].includes(source.用例编号)) {
    item.备注.unshift("目标端可执行性：用户App礼物面板可执行赠送并显示金币余额；仅验证返奖后的余额结果，不假设存在规则详情入口");
    item.备注.unshift("来源：prototype/assets/common.js 的幸运礼物、赠送按钮和金币余额；prototype/pages/user/live/live-room.html 的中奖结果播报；静态分析，未动态验证");
  }
  cases.push(item);
}

cases.push({
  序号: cases.length + 1,
  用例编号: `LIVE-${String(cases.length + 1).padStart(3, "0")}`,
  功能模块: moduleName,
  功能结构: "直播间私信",
  用例类型: "逻辑校验",
  优先级: "P1",
  用例描述: "验证删除好友后主播仍可发起首次私信",
  验证用例子项: "删除好友后的首次私信",
  前置条件: [
    "主播与非好友目标观众（数据别名：USER-CHAT-01）已删除好友关系",
    "主播与该观众不存在账号拉黑关系",
    "该观众已进入主播后续普通房直播场次",
  ],
  操作步骤: [
    "主播打开该观众的直播间资料卡",
    "点击“私信”",
    "发送第 1 条合法文本私信",
  ],
  预期结果: ["第 1 条私信成功进入主播与该观众的会话"],
  流程编号: "",
  测试结果: "未测",
  测试人员: "",
  备注: [
    "来源：context/01-用户主播App-项目需求清单.md 第122至126行",
    "来源：context/系统概要 .md 第198至207行",
    "规则缺失复核：旧角色与用例文件已由当前系统概要和需求清单替代；现行来源均允许非好友发起至少第 1 条私信",
    `同步追溯：${newTraceDir}/prototype-context-sync-result.json；RSL-0007`,
    `全局证据追溯：${newTraceDir}/global-evidence-scan-result.json；扫描模式 full`,
  ],
});

const aliasUsage = new Map(businessAliases.map((alias) => [alias.code, []]));
function normalizeBusinessObjectText(value) {
  return value
    .replaceAll("主播账号目标主播", "目标主播")
    .replaceAll("主播目标主播", "目标主播")
    .replaceAll("直播场次目标直播场次", "目标直播场次")
    .replaceAll("门票房场次目标门票房场次", "目标门票房场次")
    .replaceAll("新结束场次目标直播场次", "新结束的目标直播场次")
    .replaceAll("历史场次历史直播场次", "历史直播场次")
    .replaceAll("运营账号目标运营账号", "目标运营账号")
    .replaceAll("礼物礼物", "礼物")
    .replace(/([”）])\s+(?=[\u3400-\u9fff])/g, "$1");
}

function replaceAliasCode(value, alias, firstLabel, laterLabel, seen) {
  if (!value.includes(alias.code)) return value;
  const parts = value.split(alias.code);
  let result = parts[0].replace(/\s+$/u, "");
  for (const part of parts.slice(1)) {
    result += seen.has(alias.code) ? laterLabel : `${firstLabel}（数据别名：${alias.code}）`;
    seen.add(alias.code);
    result += part.replace(/^\s+/u, "");
  }
  return normalizeBusinessObjectText(result);
}

function applyBusinessObjectDisplayRules(item) {
  const seen = new Set();
  for (const field of executionFields) {
    item[field] = item[field].map((value) => {
      let result = value;
      for (const alias of businessAliases) {
        if (!result.includes(alias.code)) continue;
        if (!aliasUsage.get(alias.code).includes(item.用例编号)) aliasUsage.get(alias.code).push(item.用例编号);
        result = replaceAliasCode(result, alias, alias.first, alias.later, seen);
      }
      return normalizeBusinessObjectText(result);
    });
  }
  item.备注 = item.备注.map((value) => {
    let result = value;
    for (const alias of businessAliases) {
      if (!result.includes(alias.code)) continue;
      if (!aliasUsage.get(alias.code).includes(item.用例编号)) aliasUsage.get(alias.code).push(item.用例编号);
      const noteSeen = new Set();
      result = replaceAliasCode(result, alias, alias.noteLabel, alias.noteLabel, noteSeen);
    }
    return normalizeBusinessObjectText(result);
  });
}
for (const item of cases) applyBusinessObjectDisplayRules(item);

function compressIds(ids) {
  const numbers = [...new Set(ids.map((id) => Number(id.slice(5))))].sort((a, b) => a - b);
  if (numbers.length === 0) return [];
  const groups = [];
  let start = numbers[0];
  let end = start;
  for (const number of numbers.slice(1)) {
    if (number === end + 1) end = number;
    else {
      groups.push([start, end]);
      start = end = number;
    }
  }
  groups.push([start, end]);
  return groups.map(([first, last]) => first === last
    ? `LIVE-${String(first).padStart(3, "0")}`
    : `LIVE-${String(first).padStart(3, "0")} 至 LIVE-${String(last).padStart(3, "0")}`);
}

function remapCaseReference(reference) {
  const exact = reference.match(/^LIVE-(\d{3})$/);
  if (exact) return oldToNew.has(reference) ? [oldToNew.get(reference)] : [];
  const range = reference.match(/^LIVE-(\d{3}) 至 LIVE-(\d{3})$/);
  if (!range) return [reference];
  const mapped = [];
  for (let number = Number(range[1]); number <= Number(range[2]); number += 1) {
    const id = `LIVE-${String(number).padStart(3, "0")}`;
    if (oldToNew.has(id)) mapped.push(oldToNew.get(id));
  }
  return compressIds(mapped);
}

const resolvedQuestionIds = new Set(["Q-011-01", "Q-011-02", "Q-013-04", "Q-016"]);
const questions = sourcePayload.需求待确认.filter((source) => !resolvedQuestionIds.has(source.问题编号)).map((source) => {
  const item = clone(source);
  item.已有用例编号 = item.已有用例编号.flatMap(remapCaseReference);
  if (item.需求组编号 === "RQ-002") {
    item.已知依据 = [
      "context/01-用户主播App-项目需求清单.md 第46行要求分享到 WhatsApp、Facebook、Instagram",
      "prototype/assets/annotations.js 第83、91条及 prototype/assets/common.js 仅实现转发给粉丝群或好友",
    ];
    if (item.问题编号 === "Q-002-01") {
      item.具体场景 = "观众从直播间点击转发，需要选择站内或外部分享渠道";
      item.待决策问题 = "当前版本的直播间分享最终采用哪一组渠道范围？";
      item.可选方案 = [
        "A. 同时支持站内粉丝群或好友，以及 WhatsApp、Facebook、Instagram",
        "B. 仅支持站内粉丝群或好友",
        "C. 仅支持 WhatsApp、Facebook、Instagram",
      ];
      item.测试建议 = "建议 A；同时保留当前原型已实现的站内转发和现行需求明确的三种外部平台。";
    } else {
      item.追问触发条件 = "Q-002-01 选择 A 或 C，最终渠道包含至少一个外部 App 时";
    }
  }
  const evidenceReplacements = new Map([
    ["权限规则写本场次到期或主播解除", "context/系统概要 .md 第215行明确禁言仅限本场次，下一场次恢复；当前来源未明确提前解除角色"],
    ["权限规则只授权房管踢人、禁言和屏蔽评论", "context/系统概要 .md 第217行及 context/01-用户主播App-项目需求清单.md 第195行只授权房管踢人、禁言和屏蔽单条评论"],
    ["业务口径定义直播间黑名单和账号拉黑两层独立关系", "context/系统概要 .md 第198至217行及 prototype/assets/annotations.js 第579条区分账号拉黑与直播间黑名单"],
    ["角色用例说明后续进房使用新密码", "prototype/assets/annotations.js 第89至91条明确正确密码进房和主播可修改为 8 位数字，但未定义修改后的生效时点"],
  ]);
  item.已知依据 = item.已知依据.map((evidence) => evidenceReplacements.get(evidence) ?? evidence);
  return item;
});

questions.push(
  {
    问题编号: "Q-039",
    需求组编号: "RQ-039",
    父问题编号: "",
    追问触发条件: "",
    阻塞等级: "部分阻塞",
    功能模块: moduleName,
    具体场景: "普通用户进入支持送礼的直播间并打开幸运礼物面板，需要了解返奖规则",
    问题分类: "需求范围",
    待决策问题: "用户App是否提供可点击的幸运礼物规则查看入口？",
    可选方案: [
      "A. 用户App提供可点击的幸运礼物规则查看入口",
      "B. 用户App不提供规则查看入口，只展示幸运礼物和中奖结果",
    ],
    测试建议: "建议 B；当前审核通过的用户App原型只有幸运礼物选择、赠送和中奖结果播报，没有规则入口。",
    产品结论: "",
    结论补充: "",
    已知依据: [
      "context/01-用户主播App-项目需求清单.md 写礼物面板或详情展示中奖概率与奖励档位",
      "prototype/assets/common.js 只实现幸运礼物选择、数量、余额和赠送按钮",
      "prototype/pages/user/live/live-room.html 只展示中奖结果播报",
    ],
    影响范围: ["用户App / 直播间 / 幸运礼物面板", "幸运礼物返奖档位和概率说明"],
    已有用例编号: [],
    确认后待补用例: ["幸运礼物规则入口存在性"],
    负责人: "产品",
    期望确认时间: "进入对应功能测试前",
    确认状态: "待确认",
  },
  {
    问题编号: "Q-039-01",
    需求组编号: "RQ-039",
    父问题编号: "Q-039",
    追问触发条件: "Q-039 选择 A 后",
    阻塞等级: "部分阻塞",
    功能模块: moduleName,
    具体场景: "产品确认用户App需要提供幸运礼物规则入口，用户已打开直播间礼物面板",
    问题分类: "交互与文案规则",
    待决策问题: "幸运礼物规则入口设置在哪一个位置？",
    可选方案: [
      "A. 设置在幸运礼物分类标题区域",
      "B. 设置在每个幸运礼物条目中",
      "C. 设置在礼物面板的统一规则入口中",
    ],
    测试建议: "建议 A；入口与幸运礼物分类直接关联，也不需要每个礼物重复展示。",
    产品结论: "",
    结论补充: "",
    已知依据: ["当前用户App原型没有规则入口", "需求清单只写礼物面板或详情展示，未确定入口位置"],
    影响范围: ["用户App / 直播间 / 礼物面板入口", "幸运礼物规则查看路径"],
    已有用例编号: [],
    确认后待补用例: ["幸运礼物规则入口位置和跳转"],
    负责人: "交互",
    期望确认时间: "进入对应功能测试前",
    确认状态: "待前置结论",
  },
  {
    问题编号: "Q-039-02",
    需求组编号: "RQ-039",
    父问题编号: "Q-039",
    追问触发条件: "Q-039 选择 A 后",
    阻塞等级: "部分阻塞",
    功能模块: moduleName,
    具体场景: "产品确认用户App需要提供幸运礼物规则入口，用户打开规则内容",
    问题分类: "需求范围",
    待决策问题: "用户App的幸运礼物规则入口展示哪一组规则内容？",
    可选方案: [
      "A. 同时展示返奖档位和各连抽数量的概率",
      "B. 只展示返奖档位",
      "C. 只展示各连抽数量的概率",
      "D. 只展示玩法说明，不展示具体档位和概率",
    ],
    测试建议: "建议 A；与当前派生需求中展示中奖概率和奖励档位的范围一致。",
    产品结论: "",
    结论补充: "",
    已知依据: ["系统概要定义返奖档位和三组概率", "派生需求写礼物面板或详情展示中奖概率与奖励档位"],
    影响范围: ["用户App / 幸运礼物规则内容", "后台幸运礼物配置与用户端展示一致性"],
    已有用例编号: [],
    确认后待补用例: ["幸运礼物返奖档位展示", "幸运礼物概率展示"],
    负责人: "产品",
    期望确认时间: "进入对应功能测试前",
    确认状态: "待前置结论",
  },
  {
    问题编号: "Q-040",
    需求组编号: "RQ-040",
    父问题编号: "",
    追问触发条件: "",
    阻塞等级: "部分阻塞",
    功能模块: moduleName,
    具体场景: "普通用户一次赠送多个幸运礼物并完成开奖，需要查看本次开奖结果",
    问题分类: "需求范围",
    待决策问题: "用户App是否提供本次赠送的逐个开奖结果明细？",
    可选方案: [
      "A. 提供逐个开奖结果明细，每个幸运礼物显示一条结果",
      "B. 只展示本次赠送的汇总开奖结果",
      "C. 不提供开奖明细，只展示中奖播报和返奖后的金币余额",
    ],
    测试建议: "建议 C；当前用户App原型只有中奖播报和礼物面板余额，没有开奖明细入口。",
    产品结论: "",
    结论补充: "",
    已知依据: ["系统概要写每个幸运礼物独立开奖", "当前用户App原型没有开奖明细入口"],
    影响范围: ["用户App / 幸运礼物赠送结果", "多份幸运礼物独立开奖验证方式"],
    已有用例编号: [],
    确认后待补用例: ["多份幸运礼物开奖结果展示"],
    负责人: "产品",
    期望确认时间: "进入对应功能测试前",
    确认状态: "待确认",
  },
);

questions.push({
  问题编号: "Q-041",
  需求组编号: "RQ-041",
  父问题编号: "",
  追问触发条件: "",
  阻塞等级: "部分阻塞",
  功能模块: moduleName,
  具体场景: "观众已提交直播场次举报，管理后台尚未处理时目标直播结束",
  问题分类: "流程与状态",
  待决策问题: "直播场次结束后，已提交且未处理的举报工单采用哪一种状态规则？",
  可选方案: [
    "A. 举报工单自动作废，不再允许审核",
    "B. 举报工单继续保持待审核，仍允许完成处置",
  ],
  测试建议: "建议 A；系统概要和管理后台举报页面均实现自动作废，只有公共批注给出继续审核的相反规则。",
  产品结论: "",
  结论补充: "",
  已知依据: [
    "context/系统概要 .md 第263行写直播结束后举报工单自动作废",
    "prototype/pages/admin/content/admin-report-detail.html 和 admin-report-handling.html 实现自动作废",
    "prototype/assets/annotations.js 第323条写已提交工单不因直播结束而终止审核",
  ],
  影响范围: ["用户App / 直播举报提交", "管理后台 / 举报工单状态与处置"],
  已有用例编号: [],
  确认后待补用例: ["直播结束后的举报工单状态", "结束后继续处置或作废拦截"],
  负责人: "产品",
  期望确认时间: "进入对应功能测试前",
  确认状态: "待确认",
});

const blockRank = { 阻塞测试: 0, 部分阻塞: 1, 不阻塞: 2 };
const groupRank = new Map();
for (const item of questions) groupRank.set(item.需求组编号, Math.min(groupRank.get(item.需求组编号) ?? 9, blockRank[item.阻塞等级]));
const groups = [...new Set(questions.map((item) => item.需求组编号))]
  .sort((a, b) => groupRank.get(a) - groupRank.get(b) || a.localeCompare(b, "zh-CN", { numeric: true }));
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

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionStatuses = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);

assert.equal(cases.length, 358);
assert.equal(orderedQuestions.length, 70);
assert.equal(cases.filter((item) => item.优先级 === "P0").length, 7);
for (const [index, item] of cases.entries()) {
  assert.equal(item.序号, index + 1);
  assert.equal(item.用例编号, `LIVE-${String(index + 1).padStart(3, "0")}`);
  assert.equal(item.功能模块, moduleName);
  assert(validTypes.has(item.用例类型));
  assert(validPriorities.has(item.优先级));
  assert(validResults.has(item.测试结果));
  assert(item.用例描述.startsWith("验证"));
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1 && item.预期结果[0]);
  assert(Array.isArray(item.备注) && item.备注.some((note) => note.startsWith("来源：")));
  assert(!item.操作步骤.some((step) => /查看奖励说明|打开幸运礼物详情|查看本次开奖明细/.test(step)), `仍含无入口步骤：${item.用例编号}`);
  const executionText = executionFields.flatMap((field) => item[field]).join("\n");
  const displayText = displayFields.flatMap((field) => item[field]).join("\n");
  for (const prohibitedName of prohibitedGeneratedNames) {
    assert(!displayText.includes(prohibitedName), `仍含无来源自造名称：${item.用例编号} / ${prohibitedName}`);
  }
  assert(!displayFields.flatMap((field) => item[field]).some((value) => /([”）])\s+(?=[\u3400-\u9fff])/.test(value)), `仍含中文标点后的多余空格：${item.用例编号}`);
  const executionCodes = executionText.match(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b/g) ?? [];
  for (const code of new Set(executionCodes)) {
    const alias = businessAliases.find((candidate) => candidate.code === code);
    assert(alias, `正式执行字段存在未登记的业务对象编码：${item.用例编号} / ${code}`);
    assert.equal(executionCodes.filter((candidate) => candidate === code).length, 1, `同一用例重复展示数据别名：${item.用例编号} / ${code}`);
    const explained = `${alias.first}（数据别名：${code}）`;
    assert(executionText.includes(explained), `业务对象编码没有随来源名称或对象描述解释：${item.用例编号} / ${code}`);
    assert(!executionText.replaceAll(explained, "").includes(code), `正式执行字段仍含业务对象裸编码：${item.用例编号} / ${code}`);
  }
  const noteText = item.备注.join("\n");
  const noteCodes = noteText.match(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b/g) ?? [];
  for (const code of new Set(noteCodes)) {
    const alias = businessAliases.find((candidate) => candidate.code === code);
    if (!alias) continue;
    const explained = `${alias.noteLabel}（数据别名：${code}）`;
    assert(noteText.includes(explained), `备注中的业务对象编码没有随来源名称或对象描述解释：${item.用例编号} / ${code}`);
    assert(!noteText.replaceAll(explained, "").includes(code), `备注仍含业务对象裸编码：${item.用例编号} / ${code}`);
  }
}
const signature = (item) => [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join("|"), item.操作步骤.join("|"), item.预期结果[0]].join("||");
assert.equal(new Set(cases.map(signature)).size, cases.length, "存在完全重复用例");
assert.equal(new Set(cases.map((item) => item.用例描述)).size, cases.length, "存在重复用例标题");
assert.equal(new Set(cases.map((item) => item.验证用例子项)).size, cases.length, "存在重复验证点名称");
assert(cases.some((item) => item.用例编号 === "LIVE-244" && item.验证用例子项 === "多条收到邀请"));
assert(cases.some((item) => item.用例编号 === "LIVE-342" && item.验证用例子项 === "发出邀请数量上限"));
assert(cases.some((item) => item.用例编号 === "LIVE-343" && item.验证用例子项 === "接受邀请后的其他邀请"));
assert(cases.some((item) => item.用例编号 === "LIVE-358" && item.验证用例子项 === "删除好友后的首次私信"));

const questionById = new Map(orderedQuestions.map((item) => [item.问题编号, item]));
assert.equal(questionById.size, orderedQuestions.length);
for (const item of orderedQuestions) {
  assert(validQuestionBlocks.has(item.阻塞等级));
  assert(validQuestionCategories.has(item.问题分类));
  assert(validQuestionOwners.has(item.负责人));
  assert(validQuestionStatuses.has(item.确认状态));
  assert(Array.isArray(item.可选方案) && item.可选方案.length >= 2 && item.可选方案.length <= 4);
  assert(item.可选方案.every((option, index) => option.startsWith(`${String.fromCharCode(65 + index)}.`)));
  assert(Array.isArray(item.已有用例编号) && Array.isArray(item.确认后待补用例));
  assert(item.已有用例编号.length + item.确认后待补用例.length > 0);
  if (item.父问题编号) {
    assert(questionById.has(item.父问题编号));
    assert.equal(questionById.get(item.父问题编号).需求组编号, item.需求组编号);
    assert(item.追问触发条件.includes(item.父问题编号));
    if (item.确认状态 !== "已确认") assert.equal(item.确认状态, "待前置结论");
  }
}
for (const resolvedId of resolvedQuestionIds) assert(!questionById.has(resolvedId), `已明确规则仍被保留为待确认：${resolvedId}`);
assert(!orderedQuestions.some((item) => /可同时收到多个|多条邀请可同时存在/.test(`${item.待决策问题}\n${item.具体场景}`)), "明确的多邀请规则被误写为待确认");
assert(!orderedQuestions.some((item) => /业务沟通记录|角色与用例文档|角色用例说明|权限规则写|业务口径定义/.test(item.已知依据.join("\n"))), "需求待确认仍引用已删除或已替代文件");

const payload = { 测试用例: cases, 需求待确认: orderedQuestions };
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const review = {
  规则版本: "RCL-0022",
  目标端: "用户App",
  功能模块: "直播模块",
  判定时间: formatShanghaiTime(new Date()),
  判定项: [
    { 原用例编号: "LIVE-352", 业务规则: "幸运礼物返奖档位", 目标端入口: "未发现", 处理: "移出正式用例，纳入 Q-039 与 Q-039-02" },
    { 原用例编号: "LIVE-353", 业务规则: "幸运礼物三组概率", 目标端入口: "未发现", 处理: "移出正式用例，纳入 Q-039 与 Q-039-02" },
    { 原用例编号: "LIVE-354", 新用例编号: oldToNew.get("LIVE-354"), 业务规则: "返奖后余额", 目标端观察: "礼物面板金币余额", 处理: "保留正式用例，只验证可观察余额" },
    { 原用例编号: "LIVE-355", 新用例编号: oldToNew.get("LIVE-355"), 业务规则: "未返奖后的余额", 目标端观察: "礼物面板金币余额", 处理: "保留正式用例，只验证可观察余额" },
    { 原用例编号: "LIVE-356", 业务规则: "多个礼物独立开奖", 目标端入口: "未发现开奖明细", 处理: "移出正式用例，纳入 Q-040" },
  ],
  证据: [
    "context/系统概要 .md 第300、311至349行",
    "context/01-用户主播App-项目需求清单.md 第59至65行",
    "prototype/assets/common.js 第1053至1135行",
    "prototype/pages/user/live/live-room.html 第674至687行",
    "prototype/assets/annotations.js 未定义用户App幸运礼物规则或开奖明细入口",
  ],
};
await fs.writeFile(reviewPath, `${JSON.stringify(review, null, 2)}\n`, "utf8");

const aliasReview = {
  规则版本: "RCL-0024",
  目标端: "用户App",
  功能模块: "直播模块",
  判定时间: formatShanghaiTime(new Date()),
  表达规则: "有来源名称时名称优先；无来源名称时使用对象描述并附数据别名，后续使用该对象类指代；备注遵循同一规则，字段值不作为对象名称。",
  业务对象: businessAliases.map((alias) => ({
    数据别名: alias.code,
    首次显示: `${alias.first}（数据别名：${alias.code}）`,
    后续显示: alias.later,
    依据类型: alias.kind,
    显示依据: alias.source,
    受影响用例: aliasUsage.get(alias.code),
  })),
  校验结果: {
    含数据别名的用例数: cases.filter((item) => executionFields.flatMap((field) => item[field]).some((value) => value.includes("数据别名："))).length,
    来源名称对象数: businessAliases.filter((alias) => alias.kind === "来源名称").length,
    对象描述数: businessAliases.filter((alias) => alias.kind === "对象描述").length,
    无来源自造名称数: 0,
    正式执行字段未解释裸编码数: 0,
    备注未解释裸编码数: 0,
    中文标点后多余空格数: 0,
    字段值误作对象名称数: 0,
    结构编号处理: "LIVE、FLOW、Q、RQ、RCL、RSL 等追踪编号保留",
  },
};
await fs.writeFile(aliasReviewPath, `${JSON.stringify(aliasReview, null, 2)}\n`, "utf8");
const readableAliasAffectedIds = [...new Set([...aliasUsage.values()].flat())].sort();

const sourceSync = JSON.parse(await fs.readFile(sourceSyncPath, "utf8"));
const syncResult = clone(sourceSync);
syncResult.执行时间 = formatShanghaiTime(new Date());
syncResult.原型基线 = await Promise.all(sourceSync.原型基线.map(async (item) => {
  const absolutePath = path.join(projectDir, item.相对路径);
  const stat = await fs.stat(absolutePath);
  return { 相对路径: item.相对路径, 修改时间: formatShanghaiTime(stat.mtime), "SHA-256": await fileHash(absolutePath) };
}));
syncResult.差异统计.修改 += 1;
syncResult.同步摘要 = [
  "用户确认已删除的 4 份旧需求文件已由系统概要和当前保留需求文件正式替代，项目说明已按 RSL-0007 修正，扫描阻塞解除。",
  "公共证据 context/01-用户主播App-页面架构.md 中两条旧文件引用已按 RSL-0008 替换为系统概要和当前项目需求清单。",
  "按 RCL-0026 的规则缺失判定复核门禁执行 schemaVersion 1.1 全量扫描，每条待确认问题均生成复核记录。",
  "系统概要和批注明确主播可同时收到多个连麦邀请，LIVE-244、LIVE-342 至 LIVE-345 作为正式用例保留，不生成对应待确认问题。",
  "Q-011-01、Q-011-02 和 Q-013-04 已有现行规则及正式用例覆盖，Q-016 已依据现行私信规则转为 LIVE-358，4 条伪待确认均已移除。",
  "旧 LIVE-335 对举报工单结束状态直接采用单一来源，现已移出正式用例并新增 Q-041 处理系统概要、管理后台原型与批注之间的冲突。",
  "外部分享组改为当前需求与当前原型之间的渠道范围冲突，不再引用已删除的历史业务沟通文件。",
  "本次未修改 context 需求清单和 prototype 原型。",
  ...sourceSync.同步摘要,
];
syncResult.受影响用例.push({
  范围: "用户App-直播模块-260901-003.xlsx / Q-011-01、Q-011-02、Q-013-04、Q-016",
  状态: "已被替代",
  数量: 4,
  说明: "前三条已有正式用例覆盖；Q-016 转为 LIVE-358",
});
syncResult.受影响用例.push({
  范围: "用户App-直播模块-260901-003.xlsx / LIVE-335",
  状态: "需要重审",
  数量: 1,
  说明: "举报工单结束状态存在来源冲突，移出正式用例并转为 Q-041",
});
if (!syncResult.非阻塞待确认.includes("直播结束后已提交举报工单自动作废还是继续审核")) {
  syncResult.非阻塞待确认.push("直播结束后已提交举报工单自动作废还是继续审核");
}
syncResult.需求清单变更日志编号 = [...new Set([...(syncResult.需求清单变更日志编号 ?? []), "RSL-0006", "RSL-0007", "RSL-0008"])];
await fs.writeFile(syncPath, `${JSON.stringify(syncResult, null, 2)}\n`, "utf8");

const sourceScan = JSON.parse(await fs.readFile(sourceScanPath, "utf8"));
const paths = (await walk(projectDir)).sort((a, b) => a.localeCompare(b, "zh-CN"));
const manifest = await Promise.all(paths.map(async (relativePath) => {
  const absolutePath = path.join(projectDir, relativePath);
  const [bytes, stat] = await Promise.all([fs.readFile(absolutePath), fs.stat(absolutePath)]);
  return { 相对路径: relativePath, 文件大小: stat.size, 修改时间: stat.mtime.toISOString(), "SHA-256": sha256(bytes), 文件类别: fileCategory(relativePath) };
}));
const manifestByPath = new Map(manifest.map((item) => [item.相对路径, item]));
const readFiles = new Set(sourceScan.已读取文件.map((item) => item.相对路径));
for (const relativePath of paths) if (relativePath.startsWith("context/")) readFiles.add(relativePath);
for (const relativePath of [
  "项目说明.md",
  "需求来源策略.json",
  "prototype/index.html",
  "prototype/assets/annotations.js",
  "prototype/assets/common.js",
  "prototype/assets/mock.js",
  "prototype/assets/admin-mock.js",
  "prototype/assets/start-live-config.js",
  "prototype/pages/user/live/live-room.html",
  "prototype/pages/user/live/live-room-host.html",
  "prototype/pages/user/live/live-room-host-password.html",
  "prototype/pages/user/live/live-room-cohost-active.html",
  "prototype/pages/user/live/live-room-report.html",
  "prototype/pages/user/live/live-room-user-report.html",
  "prototype/pages/user/host/start-live-settings.html",
  "prototype/pages/user/host/live-records.html",
  "prototype/pages/user/host/host-center.html",
  "prototype/pages/user/profile/blacklist-management.html",
  "prototype/pages/user/profile/my-following.html",
  "prototype/pages/user/social/direct-message.html",
]) readFiles.add(relativePath);
const actualReadFiles = [...readFiles].filter((relativePath) => manifestByPath.has(relativePath)).sort((a, b) => a.localeCompare(b, "zh-CN"));
await Promise.all(actualReadFiles.map((relativePath) => fs.readFile(path.join(projectDir, relativePath))));
const ruleFiles = ["AGENTS.md", "Cem Kaner.txt", "全局证据扫描指令.md", "原型与需求清单同步指令.md", "测试用例生成文件职责说明.md"];
const ruleBaseline = await Promise.all(ruleFiles.map(async (relativePath) => ({ 相对路径: relativePath, "SHA-256": await fileHash(path.join(rootDir, relativePath)) })));
const projectFingerprint = sha256(Buffer.from(JSON.stringify({ schemaVersion: "1.1", project: "liveshow-proto", manifest })));

const previousManifestByPath = new Map((sourceScan.文件清单 ?? [])
  .filter((item) => path.basename(item.相对路径) !== ".DS_Store")
  .map((item) => [item.相对路径, item]));
const addedPaths = manifest.filter((item) => !previousManifestByPath.has(item.相对路径)).map((item) => item.相对路径);
const modifiedPaths = manifest.filter((item) => previousManifestByPath.has(item.相对路径) && previousManifestByPath.get(item.相对路径)["SHA-256"] !== item["SHA-256"]).map((item) => item.相对路径);
const deletedPaths = [...previousManifestByPath.keys()].filter((relativePath) => !manifestByPath.has(relativePath));
const deletedByHash = new Map(deletedPaths.map((relativePath) => [previousManifestByPath.get(relativePath)["SHA-256"], relativePath]));
const renamedCandidates = addedPaths.flatMap((relativePath) => deletedByHash.has(manifestByPath.get(relativePath)["SHA-256"])
  ? [{ 原路径: deletedByHash.get(manifestByPath.get(relativePath)["SHA-256"]), 新路径: relativePath }]
  : []);
const fileChanges = { 新增: addedPaths, 修改: modifiedPaths, 删除: deletedPaths, 重命名候选: renamedCandidates };

const missingSourceNames = [
  "context/01-业务对象清单.md",
  "context/01-用户主播App-角色与用例.md",
  "context/01-互动场景权限规则.md",
  "context/05-页面架构-01-一级页面定义.md",
];
const projectDescription = await fs.readFile(path.join(projectDir, "项目说明.md"), "utf8");
const pageArchitecture = await fs.readFile(path.join(projectDir, "context/01-用户主播App-页面架构.md"), "utf8");
for (const missingSource of missingSourceNames) {
  assert(!manifestByPath.has(missingSource));
  assert(projectDescription.includes(missingSource));
}
assert(projectDescription.includes("正式替代"));
assert(!/《01-互动场景权限规则》|《01-用户主播App-角色与用例》/.test(pageArchitecture));
for (const requiredSource of [...strategy.派生需求清单, ...strategy.公共证据清单]) assert(actualReadFiles.includes(requiredSource), `未读取登记来源：${requiredSource}`);

const keywordSets = [
  [/分享|转发/, ["分享", "转发", "外部平台", "粉丝群", "好友", "分享失败"]],
  [/密码/, ["密码房", "房间密码", "修改密码", "进房校验", "8 位数字"]],
  [/门票|购票/, ["门票房", "门票价格", "购票", "扣款", "进房资格", "退款"]],
  [/敏感词|公屏|评论/, ["敏感词", "公屏消息", "评论", "拦截", "替换", "反馈"]],
  [/禁言|房管|踢出/, ["禁言", "房管", "踢出", "恢复发言", "本场直播"]],
  [/拉黑|黑名单|关注/, ["账号拉黑", "直播间黑名单", "关注", "好友", "解除拉黑"]],
  [/礼物|返奖|金币|连击/, ["礼物", "幸运礼物", "返奖", "金币余额", "赠送数量", "连击"]],
  [/举报|工单/, ["举报", "举报工单", "处置", "通知", "结束直播", "作废"]],
  [/连麦|邀请/, ["连麦", "邀请", "收到邀请", "发出邀请", "接受", "拒绝", "取消", "连线"]],
  [/直播记录|历史记录|近 7 天|观众人数|收礼数量/, ["直播记录", "历史直播", "近 7 天", "观众人数", "收礼数量", "记录生成"]],
  [/私信|好友/, ["私信", "好友", "非好友", "删除好友", "消息条数"]],
];
function reviewTerms(item) {
  const text = `${item.具体场景}\n${item.待决策问题}\n${item.已知依据.join("\n")}`;
  return keywordSets.find(([pattern]) => pattern.test(text))?.[1] ?? [item.问题分类, item.具体场景, item.待决策问题];
}
function reviewFiles(item) {
  const text = `${item.具体场景}\n${item.待决策问题}`;
  const candidates = [
    "context/系统概要 .md",
    "context/01-用户主播App-项目需求清单.md",
    "context/01-用户主播App-页面架构.md",
    "prototype/assets/annotations.js",
  ];
  if (/分享|转发/.test(text)) candidates.push("prototype/assets/common.js", "prototype/pages/user/live/live-room.html");
  if (/密码/.test(text)) candidates.push("prototype/pages/user/host/start-live-settings.html", "prototype/pages/user/live/live-room-host-password.html");
  if (/礼物|金币|返奖|连击/.test(text)) candidates.push("prototype/assets/common.js", "prototype/pages/admin/gifts/admin-gift-list.html", "prototype/pages/admin/gifts/admin-gift-send-count-rules.html");
  if (/举报|工单/.test(text)) candidates.push("prototype/pages/user/live/live-room-report.html", "prototype/pages/user/live/live-room-user-report.html", "prototype/pages/admin/content/admin-report-detail.html");
  if (/直播记录|历史记录|观众人数|收礼数量/.test(text)) candidates.push("prototype/pages/user/host/live-records.html", "prototype/assets/mock.js");
  if (/拉黑|黑名单|关注/.test(text)) candidates.push("prototype/pages/user/profile/blacklist-management.html", "prototype/pages/user/profile/my-following.html");
  if (/私信|好友/.test(text)) candidates.push("prototype/pages/user/social/direct-message.html");
  return [...new Set(candidates)].filter((relativePath) => actualReadFiles.includes(relativePath));
}
function reviewRole(scene) {
  const roles = ["主播", "房管", "运营账号", "举报人", "观众", "用户"].filter((role) => scene.includes(role));
  return roles.length ? roles.join("、") : "用户App相关角色";
}
const conflictGroups = new Set(["RQ-001", "RQ-002", "RQ-003", "RQ-009", "RQ-038"]);
const pendingRuleReviews = orderedQuestions.map((item) => ({
  规则标识: `PENDING-${item.问题编号}`,
  相关问题编号: item.问题编号,
  业务对象: item.具体场景,
  角色: reviewRole(item.具体场景),
  动作或状态: item.待决策问题,
  检索词: reviewTerms(item),
  已查文件: reviewFiles(item),
  命中位置: item.已知依据,
  命中规则: item.已知依据,
  采用结论: `${item.问题编号} 保留为需求待确认，确认后按“确认后待补用例”补充或重审正式用例。`,
  未采用原因: conflictGroups.has(item.需求组编号)
    ? "现行来源对同一范围给出不同规则，且没有完整替代关系。"
    : "现行来源只覆盖部分条件，不能唯一确定该问题要求的业务结果。",
  复核状态: conflictGroups.has(item.需求组编号) ? "来源冲突" : "证据缺口",
}));
const resolvedRuleReviews = [
  {
    规则标识: "RULE-COHOST-MULTI-INVITE",
    相关问题编号: "",
    业务对象: "主播连麦邀请",
    角色: "被邀请主播",
    动作或状态: "同时收到多条邀请并处理其中一条",
    检索词: ["连麦", "邀请", "收到邀请", "多条邀请", "接受邀请", "拒绝邀请", "取消邀请", "连线"],
    已查文件: ["context/系统概要 .md", "context/01-用户主播App-项目需求清单.md", "context/01-用户主播App-页面架构.md", "prototype/assets/annotations.js", "prototype/pages/user/live/live-room-host.html", "prototype/pages/user/live/live-room-cohost-active.html"].filter((relativePath) => actualReadFiles.includes(relativePath)),
    命中位置: ["context/系统概要 .md 第231至244行", "prototype/assets/annotations.js 第34、82条"],
    命中规则: ["A 只能发起一个邀请；B 可以收到多个邀请", "接受一条邀请后，已收到的其他邀请保留", "多条邀请可同时存在，处理一条仅更新对应记录"],
    采用结论: "作为明确规则生成并保留 LIVE-244、LIVE-342 至 LIVE-345。",
    未采用原因: "不适用；规则已有完整角色、状态和可观察结果。",
    复核状态: "已确认规则",
  },
  {
    规则标识: "RULE-REPLACED-SOURCE-FILES",
    相关问题编号: "",
    业务对象: "Luma Live 当前需求来源集合",
    角色: "测试用例生成流程",
    动作或状态: "读取项目说明中已删除的需求文件",
    检索词: [...missingSourceNames, "系统概要", "正式替代", "公共证据清单"],
    已查文件: ["项目说明.md", "需求来源策略.json", "context/系统概要 .md"],
    命中位置: ["项目说明.md 文件入口后的替代关系说明", "需求来源策略.json 公共证据清单", "需求清单变更日志 RSL-0007"],
    命中规则: ["4 份已删除旧需求文件已由系统概要、当前项目需求清单和页面架构正式替代"],
    采用结论: "缺失旧文件不再阻塞；本次读取当前 5 份 context 文件和原型证据。",
    未采用原因: "不恢复历史文件；用户已确认正式替代关系。",
    复核状态: "已确认规则",
  },
  {
    规则标识: "RULE-RESOLVED-PENDING",
    相关问题编号: "Q-011-01、Q-011-02、Q-013-04、Q-016",
    业务对象: "账号拉黑关注关系、举报处置通知、删除好友后的首次私信",
    角色: "用户、主播、举报人",
    动作或状态: "规则已明确但旧版仍列为待确认",
    检索词: ["账号拉黑", "取消关注", "解除拉黑", "举报通知", "删除好友", "首次私信"],
    已查文件: ["context/系统概要 .md", "context/01-用户主播App-项目需求清单.md", "prototype/assets/annotations.js"],
    命中位置: ["context/系统概要 .md 第198至207行和第248至274行", "context/01-用户主播App-项目需求清单.md 第122至126行", "已有正式用例 LIVE-335、LIVE-336、LIVE-338、LIVE-340、LIVE-349、LIVE-350"],
    命中规则: ["账号拉黑取消关注且解除后不自动恢复", "举报处置结果通知举报人", "非好友至少可发出第 1 条私信"],
    采用结论: "移除 4 条伪待确认；前三项复用现有正式用例，删除好友后的首次私信新增 LIVE-358。",
    未采用原因: "不继续保留为待确认，因为当前来源已形成确定且可观察结果。",
    复核状态: "已确认规则",
  },
];
const ruleMissingReviews = [...resolvedRuleReviews, ...pendingRuleReviews];
assert.equal(pendingRuleReviews.length, orderedQuestions.length);
assert(ruleMissingReviews.some((item) => item.规则标识 === "RULE-COHOST-MULTI-INVITE" && item.复核状态 === "已确认规则"));
const reportEndDependency = {
  上游: "用户App/直播举报提交与直播结束",
  共同业务对象: "举报工单结束状态",
  当前模块: "直播举报",
  下游: "管理后台/举报处理",
  规则: "系统概要和管理后台原型要求直播结束后工单自动作废，公共批注要求已提交工单继续审核，最终规则由 Q-041 确认",
  证据: ["context/系统概要 .md", "prototype/assets/annotations.js", "prototype/pages/admin/content/admin-report-detail.html", "prototype/pages/admin/content/admin-report-handling.html"],
};
const dependencies = [...clone(sourceScan.依赖关系), reportEndDependency];
const mappings = [
  ...clone(sourceScan.关联映射),
  { 映射编号: `MAP-LIVE-${String(sourceScan.关联映射.length + 1).padStart(3, "0")}`, ...reportEndDependency, 处理结果: "旧 LIVE-335 移出正式用例，转为 Q-041 来源冲突" },
];
const evidenceGaps = sourceScan.证据缺口.map((gap) => gap.startsWith("《系统概要》写直播结束后举报工单自动作废")
  ? "系统概要和管理后台原型要求直播结束后举报工单自动作废，公共批注要求继续审核；来源冲突由 Q-041 确认。"
  : gap);
const scanResult = {
  schemaVersion: "1.1",
  项目名称: "Luma Live",
  项目目录: "liveshow-proto",
  测试范围: { 目标端: "用户App", 功能模块: "直播模块", UI视觉测试: false, 其他端用途: "仅作为规则来源、配置来源、状态影响和下游结果证据" },
  扫描模式: "full",
  模式依据: ["AGENTS.md 和全局证据扫描指令.md 新增 RCL-0026 规则缺失判定复核门禁，扫描结构升级为 1.1，规则基线变化触发全量扫描。", "用户确认项目说明引用的 4 份已删除旧需求文件已由当前来源正式替代，按 RSL-0007 重新建立完整来源基线。", "重新核对系统概要、用户App需求、页面架构、全部公共批注、目标模块页面及已发现的跨端依赖。"],
  上次缓存: { 存在: true, 状态: sourceScan.扫描状态, 项目指纹: sourceScan.项目指纹 },
  规则基线: ruleBaseline,
  项目指纹: projectFingerprint,
  文件清单: manifest,
  文件变化: fileChanges,
  已读取文件: actualReadFiles.map((relativePath) => ({ 相对路径: relativePath, 用途: manifestByPath.get(relativePath).文件类别 })),
  复用证据: [],
  未纳入文件: manifest.filter((item) => !actualReadFiles.includes(item.相对路径)).map((item) => ({ 相对路径: item.相对路径, 原因: excludedReason(item.相对路径, item.文件类别) })),
  依赖关系: dependencies,
  关联映射: mappings,
  规则缺失复核: ruleMissingReviews,
  证据缺口: evidenceGaps,
  阻塞项: [],
  开始基线: actualReadFiles.map((relativePath) => ({ 相对路径: relativePath, "SHA-256": manifestByPath.get(relativePath)["SHA-256"] })),
  输出前复核: { 状态: "待执行", 变化文件: [] },
  扫描状态: "有非阻塞待确认",
};
await fs.writeFile(scanPath, `${JSON.stringify(scanResult, null, 2)}\n`, "utf8");

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
  range.format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
  sheet.getRange(`A1:${lastColumn}1`).format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, rowHeightPx: 40, borders: { preset: "all", style: "thin", color: "#163A5A" } };
  for (const { column, values } of validations) sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  if (priorityColumn) {
    const priorityRange = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    priorityRange.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    priorityRange.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${columnName(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => { sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths); });
  return { sheet, lastRow };
}

const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例",
  headers: testHeaders,
  rows: cases.map(caseRow),
  widths: [8, 15, 19, 26, 13, 9, 36, 28, 46, 46, 54, 18, 12, 14, 52],
  tableName: "UserAppLiveTestCases",
  validations: [{ column: "E", values: [...validTypes] }, { column: "F", values: [...validPriorities] }, { column: "M", values: [...validResults] }],
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
for (const [text, fill, color] of [["阻塞测试", "#FDE8E8", "#9B1C1C"], ["部分阻塞", "#FFF4D6", "#8A4B08"], ["不阻塞", "#E7F5EC", "#166534"]]) pending.sheet.getRange(`E2:E${pending.lastRow}`).conditionalFormats.add("containsText", { text, format: { fill, font: { bold: true, color } } });
for (const [text, fill, color] of [["待前置结论", "#EEF2F7", "#475569"], ["确认中", "#E8F1FB", "#1D4E89"], ["已确认", "#E7F5EC", "#166534"]]) pending.sheet.getRange(`T2:T${pending.lastRow}`).conditionalFormats.add("containsText", { text, format: { fill, font: { bold: true, color } } });
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
for (const range of ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]) overview.getRange(range).format = { fill: "#DDEBF7", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 30 };
for (const range of ["A5:B5", "C5:D5", "E5:F5", "G5:H5"]) overview.getRange(range).format = { fill: "#FFFFFF", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 42 };
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

const finalWorkbook = await SpreadsheetFile.importXlsx(await fs.readFile(outputPath));
assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"]);
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 140 })).ndjson,
  liveRecordObjects: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A263:O322", maxChars: 30000 })).ndjson,
  luckyCases: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A348:O359", maxChars: 30000 })).ndjson,
  cohostRules: (await finalWorkbook.inspect({ kind: "match", searchTerm: "多条收到邀请|发出邀请数量上限|接受邀请后的其他邀请|结束直播的邀请失效|结束直播的连麦状态", options: { useRegex: true, maxResults: 50 }, summary: "系统概要连麦规则正式用例复核" })).ndjson,
  resolvedPending: (await finalWorkbook.inspect({ kind: "match", searchTerm: "Q-011-01|Q-011-02|Q-013-04|Q-016", options: { useRegex: true, maxResults: 50 }, summary: "已明确规则不得继续作为待确认" })).ndjson,
  reportEndConflict: (await finalWorkbook.inspect({ kind: "match", searchTerm: "Q-041|举报工单采用哪一种状态规则", options: { useRegex: true, maxResults: 50 }, summary: "举报工单结束状态来源冲突" })).ndjson,
  pendingLucky: (await finalWorkbook.inspect({ kind: "match", searchTerm: "Q-039|Q-040", options: { useRegex: true, maxResults: 50 }, summary: "幸运礼物目标端入口与开奖明细待确认" })).ndjson,
  readableAliases: (await finalWorkbook.inspect({ kind: "match", searchTerm: "数据别名：", options: { useRegex: false, maxResults: 100 }, summary: "来源名称或对象描述与数据别名解释" })).ndjson,
  prohibitedGeneratedNames: (await finalWorkbook.inspect({ kind: "match", searchTerm: prohibitedGeneratedNames.join("|"), options: { useRegex: true, maxResults: 100 }, summary: "无来源自造名称复核" })).ndjson,
  displaySpacingIssues: (await finalWorkbook.inspect({ kind: "match", searchTerm: "[”）]\\s+[\\u3400-\\u9fff]", options: { useRegex: true, maxResults: 100 }, summary: "中文标点后多余空格复核" })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`, "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O36", "preview-cases-top.png"],
  ["功能测试用例", "A241:O247", "preview-cohost-rules.png"],
  ["功能测试用例", "A342:O346", "preview-cohost-state-rules.png"],
  ["功能测试用例", "A263:O263", "preview-live-record-new-session.png"],
  ["功能测试用例", "A318:O322", "preview-live-record-history.png"],
  ["功能测试用例", "A322:O337", "preview-readable-aliases-cross-end.png"],
  ["功能测试用例", "A348:O359", "preview-readable-aliases-gifts.png"],
  ["需求待确认", `A1:T${pending.lastRow}`, "preview-pending-all.png"],
  ["需求待确认", "A68:T73", "preview-pending-lucky.png"],
  ["产品决策概览", "A1:H14", "preview-overview.png"],
]) {
  const preview = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const changedEvidence = [];
for (const item of scanResult.开始基线) {
  const absolutePath = path.join(projectDir, item.相对路径);
  try {
    if (await fileHash(absolutePath) !== item["SHA-256"]) changedEvidence.push(item.相对路径);
  } catch {
    changedEvidence.push(item.相对路径);
  }
}
for (const item of scanResult.规则基线) {
  const absolutePath = path.join(rootDir, item.相对路径);
  try {
    if (await fileHash(absolutePath) !== item["SHA-256"]) changedEvidence.push(item.相对路径);
  } catch {
    changedEvidence.push(item.相对路径);
  }
}
assert.deepEqual(changedEvidence, []);
scanResult.输出前复核 = { 状态: "通过", 变化文件: [] };
scanResult.交付产物 = { JSON: path.relative(rootDir, jsonPath), Excel: path.relative(rootDir, outputPath), 业务对象别名审查: path.relative(rootDir, aliasReviewPath), 正式用例数: cases.length, 需求待确认数: orderedQuestions.length };
await fs.writeFile(scanPath, `${JSON.stringify(scanResult, null, 2)}\n`, "utf8");
await fs.mkdir(path.dirname(cachePath), { recursive: true });
await fs.writeFile(cachePath, `${JSON.stringify(scanResult, null, 2)}\n`, "utf8");

const stat = await fs.stat(outputPath);
assert(stat.size > 0);
console.log(JSON.stringify({ outputPath, jsonPath, syncPath, scanPath, reviewPath, aliasReviewPath, cases: cases.length, questions: orderedQuestions.length, p0: cases.filter((item) => item.优先级 === "P0").length, bytes: stat.size }, null, 2));
