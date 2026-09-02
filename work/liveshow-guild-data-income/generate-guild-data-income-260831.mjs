import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve(".");
const workDir = path.join(root, "work/liveshow-guild-data-income");
const outputDir = path.join(root, "outputs/Luma Live-case");
const outputPath = path.join(outputDir, "公会App-数据与收益模块-260831-001.xlsx");
const jsonPath = path.join(workDir, "公会App-数据与收益模块-测试用例-260831-001.json");
const syncResultPath = path.join(workDir, "prototype-context-sync-result.json");
const priorJsonPath = path.join(root, "work/liveshow-guild-live-records/公会App-直播记录模块-测试用例-260831-001.json");
const referencePath = path.join(outputDir, "公会App-直播记录模块-260831-001.xlsx");
const inspectionPath = path.join(workDir, "inspection-260831-001.json");
const inspectNdjsonPath = `${outputPath}.inspect.ndjson`;

await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

if (process.argv.includes("--inspect-reference")) {
  const reference = await SpreadsheetFile.importXlsx(await fs.readFile(referencePath));
  const summary = await reference.inspect({ kind: "workbook,sheet,table", maxChars: 12000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 120 });
  await fs.writeFile(path.join(workDir, "reference-inspection.ndjson"), `${summary.ndjson}\n`, "utf8");
  for (const [sheetName, range, fileName] of [
    ["功能测试用例", "A1:O8", "reference-main.png"],
    ["需求待确认", "A1:T7", "reference-pending.png"],
    ["产品决策概览", "A1:H14", "reference-overview.png"],
  ]) {
    const preview = await reference.render({ sheetName, range, scale: 1, format: "png" });
    await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
  }
  console.log(JSON.stringify({ referencePath, sheets: reference.worksheets.items.map((sheet) => sheet.name) }, null, 2));
  process.exit(0);
}

const strategy = JSON.parse(await fs.readFile(path.join(root, "liveshow-proto/需求来源策略.json"), "utf8"));
assert.equal(strategy.来源策略, "prototype-primary");
assert.equal(strategy.生成前同步, true);
const syncResult = JSON.parse(await fs.readFile(syncResultPath, "utf8"));
assert.equal(syncResult.同步状态, "有非阻塞待确认");
assert.deepEqual(syncResult.需求清单变更日志编号, ["RSL-0005"]);

async function baselineEntry(relativePath) {
  const absolutePath = path.join(root, "liveshow-proto", relativePath);
  const bytes = await fs.readFile(absolutePath);
  const stat = await fs.stat(absolutePath);
  const modified = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(stat.mtime).replace(" ", "T") + "+08:00";
  return { 相对路径: relativePath, 修改时间: modified, "SHA-256": crypto.createHash("sha256").update(bytes).digest("hex") };
}
for (const item of syncResult.原型基线) assert.deepEqual(await baselineEntry(item.相对路径), item, `原型基线已变化：${item.相对路径}`);

const MODULE = "公会App-数据与收益模块";
const REQ = "来源：context/02-公会App-项目需求清单.md（2026-08-31 按原型同步，RSL-0005）";
const SPEC = "来源：prototype/Luma Live-原型说明.md 与 prototype/index.html";
const ANNO = "来源：prototype/assets/annotations.js 的公会数据与收益批注";
const HOME = "来源：prototype/pages/guild/home/guild-home.html；静态原型分析，未连接真实后端动态验证";
const INCOME = "来源：prototype/pages/guild/data/guild-income.html；静态原型分析，未连接真实后端动态验证";
const DAY = "来源：prototype/pages/guild/data/guild-income-day-detail.html；静态原型分析，未连接真实后端动态验证";
const VIOLATION = "来源：prototype/pages/guild/data/guild-all-violations.html 与 prototype/assets/guild-record-overviews.js；静态原型分析，未连接真实后端动态验证";
const SHARE = "来源：prototype/pages/guild/data/guild-share-ledger.html 与 prototype/assets/guild-share-records.js；静态原型分析，未连接真实后端动态验证";
const GUILD_SHARE = "来源：prototype/pages/guild/data/guild-share-income.html；静态原型分析，未连接真实后端动态验证";
const MODEL = "来源：prototype/assets/guild-data-model.js 与 prototype/assets/common.js 的数据、有效天和格式规则";
const SELECTOR = "来源：prototype/pages/guild/data/guild-violation-host-select.html；静态原型分析，未连接真实后端动态验证";
const SYNC = "同步追溯：work/liveshow-guild-data-income/prototype-context-sync-result.json；RSL-0005";
const QUALITY = "质量检查：最小前置条件、单一业务分支、单一可观察预期结果";

const cases = [];
function addCase({ structure, type = "功能需求", priority = "P2", description, point, pre, steps, expected, flow = "", notes = [] }) {
  cases.push({
    序号: 0, 用例编号: "", 功能模块: MODULE, 功能结构: structure, 用例类型: type, 优先级: priority,
    用例描述: description, 验证用例子项: point, 前置条件: pre, 操作步骤: steps, 预期结果: [expected],
    流程编号: flow, 测试结果: "未测", 测试人员: "", 备注: [...notes, SYNC, QUALITY],
  });
}

const entryCases = [
  ["公会业绩", "公会业绩", "FLOW-GDE-001", "P0"],
  ["运营指标", "每日", "FLOW-GDE-001", "P1"],
  ["违规记录", "违规记录", "FLOW-GDE-003", "P1"],
  ["主播分成", "主播分成记录", "FLOW-GDE-004", "P1"],
  ["公会分成", "公会分成记录", "FLOW-GDE-005", "P1"],
];
for (const [button, title, flow, priority] of entryCases) {
  addCase({ structure: "首页入口", type: "业务流程", priority, description: `验证从公会首页进入${title}`, point: `${title}入口`, pre: ["公会长已登录公会 App"], steps: ["进入公会首页", `点击“${button}”`], expected: `页面进入标题为“${title}”的页面`, flow, notes: [REQ, SPEC, HOME, `流程阶段：公会首页进入${title}`] });
}

addCase({ structure: "公会业绩/默认状态", priority: "P1", description: "验证公会业绩默认数据维度", point: "默认日数据", pre: ["公会长已进入公会业绩页"], steps: ["查看数据维度选项"], expected: "“日数据”处于选中状态", notes: [REQ, ANNO, INCOME] });
addCase({ structure: "公会业绩/默认状态", priority: "P1", description: "验证公会业绩默认日期快捷项", point: "默认本月", pre: ["公会长从首页首次进入公会业绩页"], steps: ["查看日期快捷项"], expected: "日期快捷项显示“本月”", notes: [REQ, ANNO, INCOME] });
addCase({ structure: "公会业绩/维度切换", type: "业务流程", priority: "P1", description: "验证切换到月数据", point: "月数据切换", pre: ["公会业绩当前显示日数据"], steps: ["点击“月数据”"], expected: "“月数据”处于选中状态", notes: [REQ, ANNO, INCOME] });
addCase({ structure: "公会业绩/维度切换", type: "业务流程", priority: "P2", description: "验证从月数据切回日数据", point: "日数据切换", pre: ["公会业绩当前显示月数据"], steps: ["点击“日数据”"], expected: "“日数据”处于选中状态", notes: [REQ, ANNO, INCOME] });
addCase({ structure: "公会业绩/维度切换", priority: "P2", description: "验证月数据不使用日数据日期筛选", point: "月数据筛选范围", pre: ["公会业绩当前显示日数据"], steps: ["点击“月数据”", "查看日期筛选区"], expected: "日数据日期筛选区不再显示", notes: [INCOME] });
addCase({ structure: "公会业绩/返回", type: "业务流程", priority: "P2", description: "验证公会业绩返回公会首页", point: "返回公会首页", pre: ["公会长已从首页进入公会业绩页"], steps: ["点击左上角返回按钮"], expected: "页面返回公会首页", flow: "FLOW-GDE-001", notes: [INCOME, "流程阶段：公会业绩返回公会首页"] });

addCase({ structure: "公会业绩/快捷日期", priority: "P1", description: "验证日数据快捷日期选项", point: "快捷日期选项", pre: ["公会业绩当前显示日数据"], steps: ["打开日期快捷菜单"], expected: "菜单展示本月、上月、本周、上周和自定义 5 个选项", notes: [REQ, ANNO, INCOME] });
const incomeShortcuts = [
  ["本月", "01/08/2026 至 15/08/2026"], ["上月", "01/07/2026 至 31/07/2026"],
  ["本周", "10/08/2026 至 15/08/2026"], ["上周", "03/08/2026 至 09/08/2026"],
];
for (const [name, range] of incomeShortcuts) {
  addCase({ structure: "公会业绩/快捷日期", type: "逻辑校验", priority: "P1", description: `验证${name}筛选的日期范围`, point: `${name}日期范围`, pre: ["测试环境业务日期为 15/08/2026", `${range} 内外均存在日数据`], steps: ["打开日期快捷菜单", `选择“${name}”`, "查看日数据列表"], expected: `日数据列表结果集仅包含 ${range} 内的日期记录`, notes: [REQ, ANNO, INCOME, MODEL] });
}
addCase({ structure: "公会业绩/快捷日期", priority: "P2", description: "验证点击菜单外关闭快捷日期菜单", point: "菜单外关闭", pre: ["公会业绩快捷日期菜单已打开"], steps: ["点击菜单外页面区域"], expected: "快捷日期菜单关闭", notes: [INCOME] });
addCase({ structure: "公会业绩/快捷日期", priority: "P3", description: "验证按 Escape 关闭快捷日期菜单", point: "键盘关闭菜单", pre: ["公会业绩快捷日期菜单已打开", "测试设备连接物理键盘"], steps: ["按 Escape 键"], expected: "快捷日期菜单关闭", notes: [INCOME] });

const incomeCustomCases = [
  ["自定义日期入口", "功能需求", "P1", ["公会业绩当前显示日数据"], ["打开日期快捷菜单", "选择“自定义”"], "页面打开标题为“选择日期”的日期选择器"],
  ["取消日期选择", "功能需求", "P2", ["公会业绩日期选择器已打开"], ["点击“取消”"], "日期选择器关闭"],
  ["取消保留日期", "逻辑校验", "P2", ["已应用日期范围为 10/08/2026 至 15/08/2026", "日期选择器已打开"], ["选择 12/08/2026", "点击“取消”"], "已应用日期范围仍为 10/08/2026 至 15/08/2026"],
  ["遮罩关闭日期选择", "功能需求", "P3", ["公会业绩日期选择器已打开"], ["点击日期选择器外的遮罩区域"], "日期选择器关闭"],
  ["键盘关闭日期选择", "功能需求", "P3", ["公会业绩日期选择器已打开", "测试设备连接物理键盘"], ["按 Escape 键"], "日期选择器关闭"],
  ["自定义单日范围", "逻辑校验", "P1", ["12/08/2026 存在日数据", "13/08/2026 存在日数据"], ["打开日期选择器", "选择 12/08/2026", "点击“确定”"], "日数据列表结果集仅包含 12/08/2026 的记录"],
  ["自定义连续范围", "逻辑校验", "P1", ["10/08/2026 至 12/08/2026 内外均存在日数据"], ["打开日期选择器", "选择 10/08/2026", "选择 12/08/2026", "点击“确定”"], "日数据列表结果集仅包含 10/08/2026 至 12/08/2026 内的日期记录"],
  ["反向日期归一", "逻辑校验", "P1", ["公会业绩日期选择器已打开"], ["先选择 15/08/2026", "再选择 12/08/2026", "点击“确定”"], "日期范围按 12/08/2026 至 15/08/2026 应用"],
  ["无数据日期范围", "异常用例", "P2", ["01/06/2026 至 02/06/2026 没有公会日数据"], ["应用 01/06/2026 至 02/06/2026 的日期范围"], "日数据区显示“当前范围暂无数据”"],
];
for (const [point, type, priority, pre, steps, expected] of incomeCustomCases) addCase({ structure: "公会业绩/自定义日期", type, priority, description: `验证${point}`, point, pre, steps, expected, notes: [REQ, INCOME] });

const calculationCases = [
  ["公会收益汇总", ["筛选范围包含 10/08/2026 和 11/08/2026", "两日真实礼物金币收益分别为 50,000 和 32,000"], "公会收益按 50,000 + 32,000 = 82,000 金币显示"],
  ["直播场次汇总", ["筛选范围包含 10/08/2026 和 11/08/2026", "两日直播场次分别为 3 场和 4 场"], "直播场次按 3 + 4 = 7 场显示"],
  ["有效天汇总", ["筛选范围包含 10/08/2026 和 11/08/2026", "两日达成有效天分别为 2 天和 3 天"], "达成有效天按 2 + 3 = 5 天显示"],
  ["单日开播人数", ["筛选日期为 10/08/2026", "当日有 3 名去重主播开播"], "开播人数显示 3 人"],
  ["虚拟金币收益隔离", ["筛选日期真实礼物金币收益为 50,000", "同日运营账号使用 20,000 虚拟金币送礼"], "公会收益按 50,000 + 0 = 50,000 金币显示"],
];
for (const [point, pre, expected] of calculationCases) addCase({ structure: "公会业绩/日数据汇总", type: "逻辑校验", priority: "P1", description: `验证${point}`, point, pre, steps: ["应用对应日期范围", "查看汇总指标"], expected, notes: [REQ, ANNO, INCOME, MODEL] });

for (const [metric, value] of [["公会收益", "82,000"], ["直播场次", "7"], ["开播人数", "3"], ["达成有效天", "5"]]) {
  addCase({ structure: "公会业绩/趋势", priority: "P2", description: `验证切换${metric}趋势`, point: `${metric}趋势`, pre: [`当前筛选范围存在可核对的${metric}日数据`, `当前范围${metric}汇总值为 ${value}`], steps: [`点击“${metric}”指标卡`, "查看趋势图"], expected: `趋势图切换为${metric}的逐日数据序列`, notes: [REQ, ANNO, INCOME] });
}
addCase({ structure: "公会业绩/趋势", priority: "P2", description: "验证日趋势数据点信息", point: "日趋势数据点", pre: ["10/08/2026 的公会收益为 50,000 金币", "当前趋势指标为公会收益"], steps: ["点击 10/08/2026 的趋势数据点"], expected: "趋势提示显示 10/08/2026 的公会收益 50,000", notes: [ANNO, INCOME] });

for (const [point, expected] of [
  ["日期字段", "日数据行显示对应日期"], ["直播场次字段", "日数据行显示对应日期的直播场次"],
  ["达标主播字段", "日数据行显示对应日期的达标主播人数"], ["收益字段", "日数据行显示对应日期的公会收益"],
]) addCase({ structure: "公会业绩/日数据列表", priority: "P2", description: `验证日数据${point}`, point, pre: ["当前日期范围存在日数据"], steps: ["查看任一日数据行"], expected, notes: [REQ, ANNO, INCOME] });
addCase({ structure: "公会业绩/日数据下钻", type: "业务流程", priority: "P1", description: "验证点击日期进入主播业绩", point: "日期下钻", pre: ["10/08/2026 存在主播业绩数据"], steps: ["在日数据列表点击 10/08/2026"], expected: "页面进入日期范围为 10/08/2026 的主播业绩列表", flow: "FLOW-GDE-001", notes: [REQ, ANNO, INCOME, "流程阶段：公会业绩按日期下钻主播业绩"] });

for (const [point, pre, expected] of [
  ["月收益汇总", ["7 月收益为 120,000", "8 月收益为 180,000"], "月数据公会收益按 120,000 + 180,000 = 300,000 金币显示"],
  ["月直播场次汇总", ["7 月直播场次为 20", "8 月直播场次为 25"], "月数据直播场次按 20 + 25 = 45 场显示"],
  ["月有效天汇总", ["7 月有效天为 30", "8 月有效天为 42"], "月数据达成有效天按 30 + 42 = 72 天显示"],
]) addCase({ structure: "公会业绩/月数据汇总", type: "逻辑校验", priority: "P1", description: `验证${point}`, point, pre, steps: ["切换到月数据", "查看汇总指标"], expected, notes: [REQ, ANNO, INCOME, MODEL] });
for (const [point, expected] of [["月份字段", "月数据行显示对应月份"], ["收益字段", "月数据行显示对应月份的公会收益"], ["开播人数字段", "月数据行显示对应月份的开播人数"]]) addCase({ structure: "公会业绩/月数据列表", priority: "P2", description: `验证月数据${point}`, point, pre: ["月数据存在至少一个月份记录"], steps: ["切换到月数据", "查看任一月份行"], expected, notes: [REQ, ANNO, INCOME] });
addCase({ structure: "公会业绩/月数据列表", type: "逻辑校验", priority: "P2", description: "验证月数据按月份倒序", point: "月份倒序", pre: ["月数据包含 7 月和 8 月"], steps: ["切换到月数据", "查看月份列表"], expected: "8 月记录排在 7 月记录之前", notes: [INCOME] });
addCase({ structure: "公会业绩/月数据下钻", type: "业务流程", priority: "P1", description: "验证点击月份进入主播业绩", point: "月份下钻", pre: ["8/2026 存在主播业绩数据"], steps: ["切换到月数据", "点击 8 月记录"], expected: "页面进入日期范围为 01/08/2026 至 31/08/2026 的主播业绩列表", flow: "FLOW-GDE-001", notes: [REQ, ANNO, INCOME, "流程阶段：公会业绩按月份下钻主播业绩"] });
addCase({ structure: "公会业绩/月数据趋势", priority: "P2", description: "验证月数据趋势按月份展示", point: "月趋势横轴", pre: ["月数据包含 7 月和 8 月"], steps: ["切换到月数据", "查看趋势图"], expected: "趋势图数据点按月份展示", notes: [ANNO, INCOME] });

const dayCases = [
  ["页面日期标题", "功能需求", "P1", ["公会长从首页运营指标进入每日页", "测试环境业务日期为 15/08/2026"], ["查看页面标题"], "页面标题显示“每日 · 15/08/2026”"],
  ["当日收益", "逻辑校验", "P1", ["15/08/2026 的真实礼物金币收益为 80,000"], ["进入 15/08/2026 每日页", "查看收益"], "收益显示 80,000 金币"],
  ["直播中主播数", "逻辑校验", "P1", ["当前业务日期为 15/08/2026", "当日有 3 名主播正在直播"], ["进入当日每日页", "查看“直播中”指标"], "“直播中”显示 3 人"],
  ["有效天人数", "逻辑校验", "P1", ["15/08/2026 有 2 名主播达到有效天条件"], ["进入 15/08/2026 每日页", "查看“达成有效天”指标"], "“达成有效天”显示 2 人"],
  ["默认已开播列表", "功能需求", "P1", ["15/08/2026 存在已开播和未开播主播"], ["进入 15/08/2026 每日页"], "默认展示已开播主播列表"],
  ["切换未开播列表", "业务流程", "P1", ["15/08/2026 存在未开播主播"], ["点击“未开播”"], "列表结果集仅包含当日未开播主播"],
  ["切回已开播列表", "业务流程", "P2", ["每日页当前展示未开播主播"], ["点击“已开播”"], "列表结果集仅包含当日已开播主播"],
  ["已开播收益倒序", "逻辑校验", "P1", ["主播 A 当日收益 30,000", "主播 B 当日收益 50,000"], ["查看已开播主播列表"], "主播 B 排在主播 A 之前"],
  ["主播名称字段", "功能需求", "P2", ["已开播列表存在主播 Sari"], ["查看 Sari 的主播卡片"], "主播卡片显示名称 Sari"],
  ["主播 ID 字段", "功能需求", "P2", ["主播 Sari 的 ID 为 H102938"], ["查看 Sari 的主播卡片"], "主播卡片显示 ID H102938"],
  ["主播等级字段", "功能需求", "P2", ["主播 Sari 的等级为 Lv.6"], ["查看 Sari 的主播卡片"], "主播卡片显示等级 Lv.6"],
  ["主播收益字段", "功能需求", "P2", ["主播 Sari 当日收益为 30,000 金币"], ["查看 Sari 的主播卡片"], "主播卡片收益显示 30,000 金币"],
  ["直播时长字段", "功能需求", "P2", ["主播 Sari 当日直播时长为 3 小时 15 分钟"], ["查看 Sari 的主播卡片"], "主播卡片直播时长显示 3 小时 15 分钟"],
  ["有效天最小值", "逻辑校验", "P1", ["主播当日累计有效直播时长为 180 分钟"], ["查看该主播有效天状态"], "该主播显示已达成有效天"],
  ["有效天最小值下方", "逻辑校验", "P1", ["主播当日累计有效直播时长为 179 分钟"], ["查看该主播有效天状态"], "该主播显示未达成有效天"],
  ["未开播卡片指标范围", "逻辑校验", "P2", ["主播 Maya 当日未开播"], ["切换到“未开播”", "查看 Maya 的主播卡片"], "Maya 的卡片不显示当日收益指标"],
];
for (const [point, type, priority, pre, steps, expected] of dayCases) addCase({ structure: "每日经营详情", type, priority, description: `验证${point}`, point, pre, steps, expected, notes: [REQ, ANNO, DAY, MODEL] });
addCase({ structure: "每日经营详情/主播下钻", type: "业务流程", priority: "P1", description: "验证点击已开播主播进入主播数据", point: "主播数据下钻", pre: ["15/08/2026 的已开播列表存在主播 Sari"], steps: ["点击主播 Sari 的卡片"], expected: "页面进入 Sari 在 15/08/2026 的主播数据页", flow: "FLOW-GDE-001", notes: [ANNO, DAY, "流程阶段：每日经营详情下钻主播数据"] });
addCase({ structure: "每日经营详情/返回", type: "业务流程", priority: "P2", description: "验证首页进入每日页后返回", point: "返回公会首页", pre: ["公会长从首页运营指标进入每日页"], steps: ["点击左上角返回按钮"], expected: "页面返回公会首页", flow: "FLOW-GDE-001", notes: [DAY] });
addCase({ structure: "每日经营详情/历史", type: "业务流程", priority: "P2", description: "验证从每日页查看历史业绩", point: "查看历史入口", pre: ["公会长已进入每日页"], steps: ["点击查看历史入口"], expected: "页面进入公会业绩页", flow: "FLOW-GDE-001", notes: [DAY, "流程阶段：每日经营详情返回历史公会业绩"] });

const prior = JSON.parse(await fs.readFile(priorJsonPath, "utf8"));
for (const item of prior.测试用例) {
  cases.push({
    ...item, 序号: 0, 用例编号: "", 功能模块: MODULE, 功能结构: `直播记录/${item.功能结构}`,
    流程编号: item.流程编号 === "FLOW-GREC-001" ? "FLOW-GDE-002" : item.流程编号,
    备注: [...item.备注, "既有覆盖来源：公会App-直播记录模块-260831-001.xlsx；原历史工作簿保持不变", SYNC],
    _oldId: item.用例编号,
  });
}

const violationCases = [
  ["默认违规范围", "功能需求", "P1", ["公会长从首页进入违规记录"], ["查看违规范围筛选项"], "违规范围默认显示“直播间违规”"],
  ["默认主播范围", "功能需求", "P1", ["当前公会存在 6 名主播"], ["从首页进入违规记录", "查看主播筛选项"], "主播筛选项显示已选 6 人"],
  ["默认今日范围", "功能需求", "P1", ["测试环境业务日期为 15/08/2026"], ["从首页进入违规记录", "查看日期范围"], "日期范围显示 15/08/2026 至 15/08/2026"],
  ["切换账号违规", "业务流程", "P1", ["违规记录当前显示直播间违规"], ["打开违规范围菜单", "选择“账号违规”"], "列表结果集切换为账号违规记录"],
  ["切回直播间违规", "业务流程", "P2", ["违规记录当前显示账号违规"], ["打开违规范围菜单", "选择“直播间违规”"], "列表结果集切换为直播间违规记录"],
  ["范围菜单外部关闭", "功能需求", "P3", ["违规范围菜单已打开"], ["点击菜单外页面区域"], "违规范围菜单关闭"],
  ["主播选择入口", "功能需求", "P1", ["公会长已进入违规记录页"], ["点击主播筛选项"], "页面进入标题为“选择主播”的页面"],
  ["按主播名称搜索", "逻辑校验", "P1", ["当前公会存在主播 Sari 和 Dewi"], ["进入主播选择页", "输入“Sari”"], "搜索结果集仅包含主播 Sari"],
  ["按主播 ID 搜索", "逻辑校验", "P1", ["当前公会存在主播 H102938 和 H102954"], ["进入主播选择页", "输入“H102938”"], "搜索结果集仅包含主播 H102938"],
  ["单主播违规范围", "逻辑校验", "P1", ["主播 Sari 和 Dewi 均有违规记录"], ["仅选择主播 Sari", "返回违规记录页"], "列表结果集仅包含主播 Sari 的违规记录"],
  ["多主播违规范围", "逻辑校验", "P1", ["主播 Sari、Dewi 和 Maya 均有违规记录"], ["仅选择主播 Sari 和 Dewi", "返回违规记录页"], "列表结果集仅包含 Sari 和 Dewi 的违规记录"],
  ["零主播违规空态", "异常用例", "P2", ["主播选择页当前选中全部主播"], ["取消选择全部主播", "返回违规记录页"], "违规记录区显示“未选择主播”"],
  ["主播选择保留违规范围", "逻辑校验", "P1", ["违规范围已选择账号违规"], ["进入主播选择页", "仅选择主播 Sari", "返回违规记录页"], "违规范围仍显示“账号违规”"],
  ["主播选择保留日期", "逻辑校验", "P1", ["违规日期范围为 10/08/2026 至 15/08/2026"], ["进入主播选择页", "仅选择主播 Sari", "返回违规记录页"], "日期范围仍为 10/08/2026 至 15/08/2026"],
  ["日期选择入口", "功能需求", "P1", ["公会长已进入违规记录页"], ["点击日期范围"], "页面打开日期选择器"],
  ["取消日期选择", "功能需求", "P2", ["违规记录日期选择器已打开"], ["点击“取消”"], "日期选择器关闭"],
  ["自定义日期筛选", "逻辑校验", "P1", ["10/08/2026 至 12/08/2026 内外均存在违规记录"], ["打开日期选择器", "选择 10/08/2026 至 12/08/2026", "点击“确定”"], "违规列表结果集仅包含 10/08/2026 至 12/08/2026 内的记录"],
  ["反向日期归一", "逻辑校验", "P1", ["违规记录日期选择器已打开"], ["先选择 15/08/2026", "再选择 12/08/2026", "点击“确定”"], "日期范围按 12/08/2026 至 15/08/2026 应用"],
  ["无违规记录空态", "异常用例", "P2", ["01/06/2026 至 02/06/2026 没有违规记录"], ["应用 01/06/2026 至 02/06/2026"], "违规记录区显示“暂无违规数据”"],
  ["违规时间倒序", "逻辑校验", "P1", ["主播 Sari 有 09:42 和 11:08 两条违规记录"], ["筛选主播 Sari", "查看违规列表"], "11:08 的记录排在 09:42 的记录之前"],
  ["违规主播名称", "功能需求", "P2", ["违规记录对应主播 Sari"], ["查看该违规记录"], "记录显示主播名称 Sari"],
  ["违规主播 ID", "功能需求", "P2", ["主播 Sari 的 ID 为 H102938"], ["查看 Sari 的违规记录"], "记录显示主播 ID H102938"],
  ["违规时间", "功能需求", "P2", ["违规记录时间为 15/08/2026 09:42"], ["查看该违规记录"], "记录显示 15/08/2026 09:42"],
  ["有处理结果", "功能需求", "P1", ["违规记录处理结果为“警告”"], ["查看该违规记录"], "处理结果显示“警告”"],
  ["空处理结果", "逻辑校验", "P1", ["违规记录处理结果为空"], ["查看该违规记录"], "处理结果显示“-”"],
];
for (const [point, type, priority, pre, steps, expected] of violationCases) addCase({ structure: "违规记录", type, priority, description: `验证${point}`, point, pre, steps, expected, flow: point === "主播选择入口" ? "FLOW-GDE-003" : "", notes: [REQ, ANNO, VIOLATION, SELECTOR] });
for (const category of ["色情低俗", "涉及宗教政治", "暴恐血腥", "未成年有害", "其他"]) addCase({ structure: "违规记录/违规类型", priority: "P2", description: `验证${category}违规类型`, point: `${category}类型`, pre: [`存在违规类型为“${category}”的记录`], steps: ["查看该违规记录"], expected: `违规类型显示“${category}”`, notes: [REQ, ANNO, VIOLATION] });
addCase({ structure: "违规记录/主播下钻", type: "业务流程", priority: "P1", description: "验证点击违规主播进入主播主页", point: "违规主播下钻", pre: ["违规列表存在主播 Sari 的记录"], steps: ["点击主播 Sari"], expected: "页面进入 Sari 的主播主页", flow: "FLOW-GDE-003", notes: [REQ, ANNO, VIOLATION, "流程阶段：违规记录下钻主播主页"] });
addCase({ structure: "违规记录/主播下钻", type: "业务流程", priority: "P2", description: "验证从主播主页返回违规记录", point: "返回违规记录", pre: ["公会长已从违规记录进入主播 Sari 的主页"], steps: ["点击左上角返回按钮"], expected: "页面返回违规记录页", flow: "FLOW-GDE-003", notes: [VIOLATION, "流程阶段：主播主页返回违规记录"] });

addCase({ structure: "主播分成记录/默认状态", priority: "P1", description: "验证主播分成默认主播范围", point: "默认全部主播", pre: ["当前公会存在 6 名主播"], steps: ["从公会首页进入主播分成记录", "查看主播筛选项"], expected: "主播筛选项显示已选 6 人", notes: [REQ, ANNO, SHARE] });
addCase({ structure: "主播分成记录/默认状态", priority: "P1", description: "验证主播分成默认日期范围", point: "默认本月", pre: ["测试环境业务日期为 24/08/2026"], steps: ["从公会首页进入主播分成记录", "查看日期快捷项"], expected: "日期快捷项显示“本月”", notes: [REQ, ANNO, SHARE] });
addCase({ structure: "主播分成记录/快捷日期", priority: "P1", description: "验证主播分成快捷日期选项", point: "快捷日期选项", pre: ["公会长已进入主播分成记录页"], steps: ["打开日期快捷菜单"], expected: "菜单展示今日、昨日、本周、上周、本月、上月和自定义 7 个选项", notes: [REQ, ANNO, SHARE] });
const shareShortcuts = [
  ["今日", "24/08/2026 至 24/08/2026"], ["昨日", "23/08/2026 至 23/08/2026"],
  ["本周", "24/08/2026 至 24/08/2026"], ["上周", "17/08/2026 至 23/08/2026"],
  ["本月", "01/08/2026 至 24/08/2026"], ["上月", "01/07/2026 至 31/07/2026"],
];
for (const [name, range] of shareShortcuts) {
  addCase({ structure: "主播分成记录/快捷日期", type: "逻辑校验", priority: "P1", description: `验证${name}分成日期范围`, point: `${name}日期范围`, pre: ["测试环境业务日期为 24/08/2026"], steps: ["打开日期快捷菜单", `选择“${name}”`], expected: `分成日期范围按 ${range} 应用`, notes: [REQ, ANNO, SHARE] });
  addCase({ structure: "主播分成记录/快捷日期", type: "逻辑校验", priority: "P1", description: `验证${name}分成记录范围`, point: `${name}记录结果集`, pre: [`${range} 内外均存在主播分成记录`], steps: ["打开日期快捷菜单", `选择“${name}”`, "查看记录列表"], expected: `记录列表结果集仅包含 ${range} 内的主播分成记录`, notes: [REQ, ANNO, SHARE] });
}

const shareCases = [
  ["自定义日期入口", "功能需求", "P1", ["公会长已进入主播分成记录页"], ["打开日期快捷菜单", "选择“自定义”"], "页面打开日期选择器"],
  ["取消日期选择", "功能需求", "P2", ["主播分成日期选择器已打开"], ["点击“取消”"], "日期选择器关闭"],
  ["自定义日期范围", "逻辑校验", "P1", ["10/08/2026 至 12/08/2026 内外均存在分成记录"], ["选择 10/08/2026 至 12/08/2026", "点击“确定”"], "记录列表结果集仅包含 10/08/2026 至 12/08/2026 内的分成记录"],
  ["反向日期归一", "逻辑校验", "P1", ["主播分成日期选择器已打开"], ["先选择 15/08/2026", "再选择 12/08/2026", "点击“确定”"], "分成日期范围按 12/08/2026 至 15/08/2026 应用"],
  ["主播选择入口", "功能需求", "P1", ["公会长已进入主播分成记录页"], ["点击主播筛选项"], "页面进入标题为“选择主播”的页面"],
  ["单主播记录范围", "逻辑校验", "P1", ["Sari 和 Dewi 均有分成记录"], ["仅选择主播 Sari", "返回主播分成记录页"], "记录列表结果集仅包含主播 Sari 的分成记录"],
  ["多主播记录范围", "逻辑校验", "P1", ["Sari、Dewi 和 Maya 均有分成记录"], ["仅选择 Sari 和 Dewi", "返回主播分成记录页"], "记录列表结果集仅包含 Sari 和 Dewi 的分成记录"],
  ["零主播记录空态", "异常用例", "P2", ["主播选择页当前选中全部主播"], ["取消选择全部主播", "返回主播分成记录页"], "记录区显示“暂无分成记录”"],
  ["选择主播保留日期", "逻辑校验", "P1", ["分成日期范围为 10/08/2026 至 15/08/2026"], ["进入主播选择页", "仅选择 Sari", "返回主播分成记录页"], "分成日期范围仍为 10/08/2026 至 15/08/2026"],
  ["分成时间倒序", "逻辑校验", "P1", ["Sari 有 15/08/2026 11:08 和 15/08/2026 09:42 两条记录"], ["筛选主播 Sari", "查看记录列表"], "11:08 的记录排在 09:42 的记录之前"],
  ["主播名称字段", "功能需求", "P2", ["分成记录对应主播 Sari"], ["查看该分成记录"], "记录显示主播名称 Sari"],
  ["主播 ID 字段", "功能需求", "P2", ["主播 Sari 的 ID 为 H102938"], ["查看 Sari 的分成记录"], "记录显示主播 ID H102938"],
  ["分成时间格式", "功能需求", "P2", ["分成时间为 15/08/2026 11:08"], ["查看该分成记录"], "分成时间显示为 15/08/2026/11.08"],
  ["正分成金额", "逻辑校验", "P1", ["主播分成金额为 1234.56 美元"], ["查看该分成记录"], "分成金额显示为 +$1.234,56"],
  ["负分成金额", "逻辑校验", "P1", ["主播分成金额为 -250.75 美元"], ["查看该分成记录"], "分成金额显示为 -$250,75"],
  ["虚拟金币不生成主播分成", "逻辑校验", "P1", ["主播 Sari 在目标日期仅收到运营账号赠送的 20,000 虚拟金币", "目标日期没有其他分成业务"], ["筛选主播 Sari 和目标日期", "查看分成记录"], "记录列表不存在由该 20,000 虚拟金币生成的正分成记录"],
  ["无记录空态", "异常用例", "P2", ["当前主播和日期范围没有分成记录"], ["应用该主播和日期筛选"], "记录区显示“暂无分成记录”"],
];
for (const [point, type, priority, pre, steps, expected] of shareCases) addCase({ structure: "主播分成记录", type, priority, description: `验证${point}`, point, pre, steps, expected, flow: point === "主播选择入口" ? "FLOW-GDE-004" : "", notes: [REQ, ANNO, SHARE, SELECTOR, MODEL] });
addCase({ structure: "主播分成记录/返回", type: "业务流程", priority: "P2", description: "验证主播分成记录返回公会首页", point: "返回公会首页", pre: ["公会长从首页进入主播分成记录"], steps: ["点击左上角返回按钮"], expected: "页面返回公会首页", flow: "FLOW-GDE-004", notes: [SHARE] });
addCase({ structure: "主播分成记录/主播详情", type: "业务流程", priority: "P2", description: "验证从主播详情进入主播分成记录", point: "主播详情入口", pre: ["公会长已进入主播 Sari 的详情页"], steps: ["点击主播分成记录入口"], expected: "页面进入仅筛选主播 Sari 的主播分成记录", flow: "FLOW-GDE-004", notes: [SHARE, "流程阶段：主播详情进入主播分成记录"] });
addCase({ structure: "主播分成记录/主播详情", type: "业务流程", priority: "P2", description: "验证主播分成记录返回主播详情", point: "返回主播详情", pre: ["公会长从主播 Sari 的详情页进入主播分成记录"], steps: ["点击左上角返回按钮"], expected: "页面返回主播 Sari 的详情页", flow: "FLOW-GDE-004", notes: [SHARE] });

const guildShareCases = [
  ["当前公会数据范围", "逻辑校验", "P1", ["当前登录公会为 Guild A", "系统同时存在 Guild B 的分成记录"], ["进入公会分成记录页", "查看记录列表"], "记录列表结果集仅包含 Guild A 的公会分成记录"],
  ["分成时间倒序", "逻辑校验", "P1", ["当前公会有 15/08/2026 11:08 和 15/08/2026 09:42 两条记录"], ["查看记录列表"], "11:08 的记录排在 09:42 的记录之前"],
  ["分成时间字段", "功能需求", "P2", ["公会分成时间为 15/08/2026 11:08"], ["查看该分成记录"], "分成时间显示为 15/08/2026/11.08"],
  ["正分成金额", "逻辑校验", "P1", ["公会分成金额为 1234.56 美元"], ["查看该分成记录"], "分成金额显示为 +$1.234,56"],
  ["负分成金额", "逻辑校验", "P1", ["公会分成金额为 -250.75 美元"], ["查看该分成记录"], "分成金额显示为 -$250,75"],
  ["虚拟金币不生成公会分成", "逻辑校验", "P1", ["当前公会在目标日期仅发生运营账号赠送的 20,000 虚拟金币", "目标日期没有其他分成业务"], ["进入公会分成记录页", "查看目标日期记录"], "记录列表不存在由该 20,000 虚拟金币生成的正分成记录"],
];
for (const [point, type, priority, pre, steps, expected] of guildShareCases) addCase({ structure: "公会分成记录", type, priority, description: `验证${point}`, point, pre, steps, expected, notes: [REQ, ANNO, GUILD_SHARE, MODEL] });
addCase({ structure: "公会分成记录/返回", type: "业务流程", priority: "P2", description: "验证公会分成记录返回公会首页", point: "返回公会首页", pre: ["公会长从首页进入公会分成记录"], steps: ["点击左上角返回按钮"], expected: "页面返回公会首页", flow: "FLOW-GDE-005", notes: [GUILD_SHARE] });

cases.forEach((item, index) => { item.序号 = index + 1; item.用例编号 = `GDE-${String(index + 1).padStart(3, "0")}`; });
const oldIdMap = new Map(cases.filter((item) => item._oldId).map((item) => [item._oldId, item.用例编号]));
for (const item of cases) delete item._oldId;
const idsByPoint = (...points) => cases.filter((item) => points.includes(item.验证用例子项)).map((item) => item.用例编号);

const questions = prior.需求待确认.map((item) => {
  const next = { ...item, 功能模块: MODULE, 已有用例编号: item.已有用例编号.map((id) => oldIdMap.get(id) || id) };
  if (item.问题编号 === "Q-002") {
    next.具体场景 = "公会业绩、直播记录、违规记录和分成记录都按日期筛选或聚合，跨日数据需要使用同一业务时区";
    next.待决策问题 = "公会 App 数据与收益模块的日期边界统一采用哪一个业务时区？";
    next.影响范围 = ["公会业绩", "每日经营详情", "直播记录", "违规记录", "主播分成记录", "公会分成记录"];
    next.确认后待补用例 = ["各数据页跨日归属", "夏令时切换日范围（若适用）"];
  }
  if (item.问题编号 === "Q-005") next.影响范围 = ["公会业绩", "每日经营详情", "直播记录", "违规记录", "主播分成记录", "主播详情"];
  if (item.问题编号 === "Q-006") { next.具体场景 = "公会业绩、直播记录、违规记录和分成记录出现大量历史数据"; next.待决策问题 = "公会 App 数据与收益各列表在数据量较大时统一采用哪一种加载方式？"; next.影响范围 = ["公会业绩", "直播记录", "违规记录", "主播分成记录", "公会分成记录"]; }
  if (item.问题编号 === "Q-007") { next.待决策问题 = "公会 App 数据与收益各类历史记录分别允许查询多长时间？"; next.影响范围 = ["公会业绩", "直播记录", "违规记录", "主播分成记录", "公会分成记录"]; }
  if (item.问题编号 === "Q-008") { next.待决策问题 = "主播数据的导出能力是否覆盖公会业绩、直播记录、违规记录和分成记录？"; next.影响范围 = ["主播数据", "公会业绩", "直播记录", "违规记录", "主播分成记录", "公会分成记录"]; }
  if (item.问题编号 === "Q-009") { next.具体场景 = "数据与收益任一页面首次加载或筛选请求失败"; next.待决策问题 = "数据与收益页面加载失败时统一采用哪一种页面终态？"; next.影响范围 = ["公会业绩", "每日经营详情", "直播记录", "违规记录", "主播分成记录", "公会分成记录"]; }
  return next;
});

function addQuestion({ id, group, block, structure, category, scenario, decision, options, suggestion, evidence, impact, existing = [], supplement, owner = "产品", due = "进入对应功能测试前" }) {
  questions.push({
    问题编号: id, 需求组编号: group, 父问题编号: "", 追问触发条件: "", 阻塞等级: block,
    功能模块: MODULE, 具体场景: scenario, 问题分类: category, 待决策问题: decision,
    可选方案: options, 测试建议: suggestion, 产品结论: "", 结论补充: "", 已知依据: evidence,
    影响范围: impact, 已有用例编号: existing, 确认后待补用例: supplement, 负责人: owner,
    期望确认时间: due, 确认状态: "待确认",
  });
}

addQuestion({ id: "Q-011", group: "RQ-011", block: "阻塞测试", structure: "公会业绩/开播人数", category: "计算与统计口径", scenario: "选择包含同一主播多次开播的多个日期后查看日数据开播人数", decision: "日数据跨日汇总的开播人数按去重主播数还是每日人数相加？", options: ["A. 所选范围内按主播 ID 去重", "B. 各日开播人数直接相加", "C. 不展示跨日开播人数汇总"], suggestion: "建议 A；符合批注定义，也避免同一主播跨日重复计人数。", evidence: ["批注要求所选日期范围内去重", "当前页面脚本将每日开播人数相加"], impact: ["公会业绩日数据汇总", "开播人数趋势", "跨页面对账"], existing: idsByPoint("单日开播人数"), supplement: ["跨两日同一主播重复开播", "跨多日部分重复主播", "日汇总与明细去重对账"] });
addQuestion({ id: "Q-012", group: "RQ-012", block: "阻塞测试", structure: "公会业绩/月开播人数", category: "计算与统计口径", scenario: "月数据汇总多个自然月，同一主播可能在多个月份开播", decision: "月数据总开播人数按跨月去重主播数还是各月人数相加？", options: ["A. 全部历史范围按主播 ID 去重", "B. 各月开播人数直接相加", "C. 月数据只展示各月人数，不展示总人数"], suggestion: "建议 A；与“人数”含义一致，但需产品确认历史统计范围。", evidence: ["批注描述历史累计开播主播人数", "当前页面脚本将各月开播人数相加"], impact: ["公会业绩月数据汇总", "月趋势", "历史累计指标"], existing: idsByPoint("开播人数字段"), supplement: ["跨月同一主播重复开播", "月汇总与月份明细对账"] });
addQuestion({ id: "Q-013", group: "RQ-013", block: "部分阻塞", structure: "违规记录/日期筛选", category: "交互与文案规则", scenario: "批注要求日期快捷筛选，但当前违规记录页只提供日期范围入口", decision: "违规记录首版是否提供今日、昨日、本周、上周、本月和上月快捷筛选？", options: ["A. 增加 6 个快捷日期选项并保留自定义", "B. 仅保留当前自定义日期范围入口", "C. 仅提供今日和自定义两个选项"], suggestion: "建议 A；与直播记录和主播分成记录的筛选方式保持一致。", evidence: ["annotations.js 明确列出 6 个快捷日期和自定义", "guild-all-violations.html 未提供快捷日期控件"], impact: ["违规记录日期筛选", "默认日期回显"], existing: idsByPoint("默认今日范围", "日期选择入口"), supplement: ["违规记录各快捷日期范围", "快捷项与自定义切换"] , owner: "交互"});
addQuestion({ id: "Q-014", group: "RQ-014", block: "不阻塞", structure: "违规记录/时间字段", category: "交互与文案规则", scenario: "同一直播间违规时间字段在批注和页面中使用不同名称", decision: "直播间违规记录的时间字段最终显示“发生时间”还是“举报时间”？", options: ["A. 统一显示“发生时间”", "B. 统一显示“举报时间”", "C. 账号违规显示发生时间、直播间违规显示举报时间"], suggestion: "建议 A；与账号违规字段和需求清单保持一致。", evidence: ["批注和需求清单使用“发生时间”", "当前直播间违规页面脚本使用“举报时间”"], impact: ["直播间违规记录字段", "账号违规记录字段"], existing: idsByPoint("违规时间"), supplement: ["最终字段名称回显"] , owner: "交互"});
addQuestion({ id: "Q-015", group: "RQ-015", block: "部分阻塞", structure: "每日经营详情/历史日期", category: "计算与统计口径", scenario: "查看历史日期时页面仍使用“直播中”指标名称", decision: "历史日期的“直播中”指标统计哪一类主播？", options: ["A. 当日曾开播过的去重主播", "B. 当日结束时仍在直播的主播", "C. 历史日期改名为“已开播”并统计当日曾开播主播"], suggestion: "建议 C；名称与历史口径一致，减少将实时状态误解为历史快照的风险。", evidence: ["当前页面字段名称为“直播中”", "已开播列表按当日场次数判断"], impact: ["每日经营详情汇总", "历史日期查询", "主播列表数量对账"], existing: idsByPoint("直播中主播数"), supplement: ["历史日期开播人数", "当前日期实时直播人数"] });
addQuestion({ id: "Q-016", group: "RQ-016", block: "部分阻塞", structure: "公会业绩/月数据", category: "配置和历史数据影响", scenario: "批注描述月数据为全部历史累计，但当前趋势只取有限月份且页面样例仅有部分月份", decision: "月数据汇总和列表默认覆盖多长的历史范围？", options: ["A. 覆盖当前公会全部历史月份", "B. 仅覆盖最近 12 个自然月", "C. 默认最近 6 个月并允许加载更早月份"], suggestion: "建议 C；兼顾首屏性能和历史可追溯性。", evidence: ["批注使用“全部历史”", "页面趋势脚本只展示有限月份"], impact: ["月数据汇总", "月份列表", "月趋势"], existing: idsByPoint("月份字段", "月趋势横轴"), supplement: ["历史起始月份", "超过默认范围的加载方式"] });
addQuestion({ id: "Q-017", group: "RQ-017", block: "阻塞测试", structure: "分成记录/生成时点", category: "跨端与跨模块一致性", scenario: "后台完成主播或公会分成后，公会 App 需要出现对应记录", decision: "分成结果满足什么条件后写入公会 App 分成记录？", options: ["A. 分成计算成功即写入", "B. 财务审核通过后写入", "C. 实际结算完成后写入"], suggestion: "建议 B；已形成可审核结果，同时避免未确认计算进入正式记录。", evidence: ["原型只展示分成记录结果", "需求未说明生成触发状态和可查询时效"], impact: ["主播分成记录", "公会分成记录", "后台分成流程"], supplement: ["各触发状态生成记录", "失败重试与重复写入", "跨端状态一致性"] , owner: "多方确认"});
addQuestion({ id: "Q-018", group: "RQ-018", block: "部分阻塞", structure: "分成记录/负数金额", category: "业务规则", scenario: "主播分成和公会分成页面都支持展示负数金额", decision: "负数分成记录代表哪一种业务处理？", options: ["A. 仅代表违规或退款扣减", "B. 代表所有人工与系统调账扣减", "C. 首版不允许产生负数分成记录"], suggestion: "建议 B；页面已具备负数展示能力，统一归类更便于对账。", evidence: ["批注和页面都定义负数金额展示", "需求未定义负数来源类型"], impact: ["主播分成记录", "公会分成记录", "财务对账"], existing: idsByPoint("负分成金额"), supplement: ["各负数来源类型", "负数记录的业务说明"] , owner: "多方确认"});
addQuestion({ id: "Q-019", group: "RQ-019", block: "部分阻塞", structure: "结算台账", category: "需求范围", scenario: "需求清单要求三方分账明细、命中规则版本和结算状态，但当前数据与收益原型没有对应页面", decision: "三方分账明细、规则版本和结算状态在公会 App 从哪里查看？", options: ["A. 在公会分成记录增加详情页", "B. 在主播分成记录增加分成详情页", "C. 首版仅在管理后台提供，公会 App 不展示"], suggestion: "建议 A；以公会分成记录作为当前公会对账入口。", evidence: ["context 需求清单明确结算台账字段", "当前原型只有主播分成和公会分成列表"], impact: ["公会分成记录", "主播分成记录", "结算台账"], supplement: ["分成详情入口", "三方金额明细", "规则版本", "结算状态"] });
addQuestion({ id: "Q-020", group: "RQ-020", block: "部分阻塞", structure: "跨页面指标对账", category: "跨端与跨模块一致性", scenario: "公会业绩、每日经营详情、直播记录和分成记录展示同一日期或场次的相关指标", decision: "汇总指标与下钻明细不一致时，产品采用哪一种处理方式？", options: ["A. 以明细实时重算并同步修正汇总", "B. 保留汇总快照并标注数据更新时间", "C. 暂停展示该指标并提示数据处理中"], suggestion: "建议 B；报表可保留可审计快照，同时明确数据时点。", evidence: ["多个页面存在汇总到明细下钻", "原型未定义异步更新和不一致处理"], impact: ["公会业绩", "每日经营详情", "直播记录", "分成记录"], existing: idsByPoint("日期下钻", "主播数据下钻"), supplement: ["汇总与明细一致性", "延迟更新状态", "重算或刷新方式"] , owner: "多方确认"});
addQuestion({ id: "Q-021", group: "RQ-021", block: "部分阻塞", structure: "主播运营数据", category: "需求范围", scenario: "需求清单要求查看跳出率、平均停留时长、同时在线峰值、互动率和送礼转化，但当前数据与收益原型没有对应指标页面", decision: "主播运营指标是否纳入本期公会 App 交付范围？", options: ["A. 本期在每日经营详情中展示全部运营指标", "B. 本期新增独立的主播运营数据页面", "C. 本期不交付，保留为后续版本需求"], suggestion: "建议 C；当前原型没有入口、字段定义和统计口径，暂不形成可执行验收用例。", evidence: ["context 需求清单明确列出 5 类运营指标", "当前原型页面树和批注没有对应页面及统计规则"], impact: ["主播运营数据", "每日经营详情", "主播详情"], supplement: ["运营指标入口", "各指标统计口径", "日期与主播筛选", "指标明细下钻"] });
addQuestion({ id: "Q-022", group: "RQ-022", block: "部分阻塞", structure: "主播数据/涨粉", category: "需求范围", scenario: "需求清单要求按主播和时间段查看涨粉数据，但当前主播数据关联页面没有涨粉字段", decision: "公会 App 的主播涨粉数据从哪个页面查看？", options: ["A. 在每日经营详情的主播卡片中展示", "B. 在主播数据或主播详情中展示", "C. 本期不展示涨粉数据"], suggestion: "建议 B；涨粉属于单主播周期数据，放在主播数据或详情中更便于按时间查看。", evidence: ["context 需求清单明确包含涨粉数据", "当前公会数据原型未展示涨粉字段"], impact: ["主播数据", "每日经营详情", "主播详情"], existing: idsByPoint("主播数据下钻"), supplement: ["涨粉字段", "时间范围筛选", "零涨粉与负增长显示"] });
addQuestion({ id: "Q-023", group: "RQ-023", block: "部分阻塞", structure: "收益概览/周期对比", category: "需求范围", scenario: "需求清单要求公会收益支持周期对比，当前公会业绩页只展示所选范围汇总和趋势", decision: "公会收益的周期对比在本期采用哪一种方式？", options: ["A. 公会业绩汇总卡显示与上一等长周期的差值和比例", "B. 新增独立的收益对比页面", "C. 本期只展示趋势，不提供周期对比"], suggestion: "建议 A；可复用现有日期范围和汇总指标，用户也能直接理解对比基准。", evidence: ["context 需求清单明确要求周期对比", "当前公会业绩原型没有同比或环比字段"], impact: ["公会业绩", "收益概览", "趋势图"], existing: idsByPoint("公会收益汇总"), supplement: ["对比周期定义", "差值与比例计算", "无上一周期数据"] });

const blockRank = { "阻塞测试": 0, "部分阻塞": 1, "不阻塞": 2 };
questions.sort((a, b) => blockRank[a.阻塞等级] - blockRank[b.阻塞等级] || a.需求组编号.localeCompare(b.需求组编号, "zh-CN", { numeric: true }) || a.问题编号.localeCompare(b.问题编号, "zh-CN", { numeric: true }));

const payload = { 测试用例: cases, 需求待确认: questions };
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionStatus = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);

assert.equal(cases.filter((item) => item.优先级 === "P0").length, 2, "P0 应为最小冒烟集");
assert.equal(new Set(cases.map((item) => item.用例编号)).size, cases.length, "用例编号重复");
for (const [index, item] of cases.entries()) {
  assert.equal(item.序号, index + 1); assert.equal(item.用例编号, `GDE-${String(index + 1).padStart(3, "0")}`);
  assert(validTypes.has(item.用例类型)); assert(validPriorities.has(item.优先级)); assert(validResults.has(item.测试结果));
  assert(item.用例描述.startsWith("验证")); assert(item.验证用例子项); assert(item.前置条件.length > 0); assert(item.操作步骤.length > 0);
  assert.equal(item.预期结果.length, 1); assert(item.预期结果[0].trim()); assert(item.备注.length > 0);
  assert(!/功能正常|结果正确|有合理提示|无异常|符合预期|同步正常|yyyyMMdd|\/product\//.test(JSON.stringify(item)), `存在不可判定或技术占位内容 ${item.用例编号}`);
}
assert.equal(new Set(questions.map((item) => item.问题编号)).size, questions.length, "问题编号重复");
for (const item of questions) {
  assert(validQuestionBlocks.has(item.阻塞等级)); assert(validQuestionCategories.has(item.问题分类)); assert(validQuestionOwners.has(item.负责人)); assert(validQuestionStatus.has(item.确认状态));
  assert(item.需求组编号); assert(item.待决策问题.endsWith("？")); assert(item.可选方案.length >= 2 && item.可选方案.length <= 4);
  assert(item.测试建议); assert.equal(item.产品结论, ""); assert.equal(item.结论补充, "");
  assert(item.已有用例编号.length > 0 || item.确认后待补用例.length > 0);
  for (const id of item.已有用例编号) assert(cases.some((entry) => entry.用例编号 === id), `待确认引用不存在的用例 ${id}`);
}

const testHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const questionHeaders = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];

const numbered = (values) => values.map((value, index) => `${index + 1}. ${value}`).join("\n");
const caseRow = (item) => testHeaders.map((header) => ["前置条件", "操作步骤", "预期结果", "备注"].includes(header) ? numbered(item[header]) : item[header]);
const questionRow = (item) => questionHeaders.map((header) => Array.isArray(item[header]) ? numbered(item[header]) : item[header]);
function columnName(index) { let value = index + 1, name = ""; while (value > 0) { value -= 1; name = String.fromCharCode(65 + (value % 26)) + name; value = Math.floor(value / 26); } return name; }
function estimateRowHeight(row, widths) {
  let lines = 1;
  row.forEach((value, index) => { const text = String(value ?? ""); const explicit = text.split("\n").length; const wrapped = Math.ceil(Math.max(...text.split("\n").map((line) => line.length), 1) / Math.max(widths[index] * 0.9, 8)); lines = Math.max(lines, explicit + wrapped - 1); });
  return Math.min(168, Math.max(30, 18 + lines * 16));
}

function buildSheet(workbook, { name, headers, rows, widths, tableName, validations = [], priorityColumn = null }) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnName(headers.length - 1), lastRow = rows.length + 1;
  const range = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  range.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2"; table.showHeaders = true; table.showFilterButton = true; table.showBandedRows = true;
  sheet.freezePanes.freezeRows(1); sheet.showGridLines = false;
  range.format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
  sheet.getRange(`A1:${lastColumn}1`).format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, rowHeightPx: 40, borders: { preset: "all", style: "thin", color: "#163A5A" } };
  for (const { column, values } of validations) sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  if (priorityColumn) {
    const pr = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    pr.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    pr.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${columnName(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => { sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths); });
  return { sheet, lastColumn, lastRow };
}

const workbook = Workbook.create();
const main = buildSheet(workbook, { name: "功能测试用例", headers: testHeaders, rows: cases.map(caseRow), widths: [8, 15, 22, 26, 13, 9, 34, 27, 46, 46, 52, 18, 12, 14, 52], tableName: "GuildDataIncomeTestCases", validations: [{ column: "E", values: [...validTypes] }, { column: "F", values: [...validPriorities] }, { column: "M", values: [...validResults] }], priorityColumn: "F" });
const pending = buildSheet(workbook, { name: "需求待确认", headers: questionHeaders, rows: questions.map(questionRow), widths: [15, 15, 16, 38, 14, 22, 38, 22, 48, 60, 52, 15, 34, 52, 42, 28, 42, 16, 20, 16], tableName: "GuildDataIncomePending", validations: [{ column: "E", values: [...validQuestionBlocks] }, { column: "H", values: [...validQuestionCategories] }, { column: "L", values: ["A", "B", "C", "D", "其他"] }, { column: "R", values: [...validQuestionOwners] }, { column: "T", values: [...validQuestionStatus] }] });
pending.sheet.freezePanes.freezeColumns(3);
pending.sheet.getRange(`A2:C${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`E2:F${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`H2:H${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`R2:T${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`I2:I${pending.lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pending.sheet.getRange(`K2:K${pending.lastRow}`).format.fill = "#EAF4EA";
pending.sheet.getRange(`L2:M${pending.lastRow}`).format = { fill: "#FFF4CC", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6B656" } };
for (const [textValue, format] of [["阻塞测试", { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } }], ["部分阻塞", { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } }], ["不阻塞", { fill: "#E7F5EC", font: { bold: true, color: "#166534" } }]]) pending.sheet.getRange(`E2:E${pending.lastRow}`).conditionalFormats.add("containsText", { text: textValue, format });
pending.sheet.getRange(`T2:T${pending.lastRow}`).conditionalFormats.add("containsText", { text: "待确认", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
let previousGroup = "";
questions.forEach((item, index) => { const rowNumber = index + 2; if (item.需求组编号 !== previousGroup) { pending.sheet.getRange(`A${rowNumber}:T${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } }; previousGroup = item.需求组编号; } pending.sheet.getRange(`B${rowNumber}`).format.fill = "#DDEBF7"; });

const overview = workbook.worksheets.add("产品决策概览");
overview.showGridLines = false; overview.mergeCells("A1:H1"); overview.getRange("A1").values = [["产品决策概览"]];
overview.getRange("A1:H1").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 52 };
overview.mergeCells("A2:H2"); overview.getRange("A2").values = [["优先确认开播人数统计、分成生成状态和数据时区；其余问题可在对应功能测试前逐项决策。"]];
overview.getRange("A2:H2").format = { fill: "#EAF2F8", font: { name: "Microsoft YaHei", size: 10, color: "#334155" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 34 };
overview.getRange("A4:H4").values = [["问题总数", "", "当前可回答", "", "待前置结论", "", "已确认", ""]]; overview.getRange("A5:H5").values = [["", "", "", "", "", "", "", ""]];
for (const rangeName of ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]) overview.getRange(rangeName).format = { fill: "#DDEBF7", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 30 };
for (const rangeName of ["A5:B5", "C5:D5", "E5:F5", "G5:H5"]) overview.getRange(rangeName).format = { fill: "#FFFFFF", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 42 };
for (const rangeName of ["A4:B4", "A5:B5", "C4:D4", "C5:D5", "E4:F4", "E5:F5", "G4:H4", "G5:H5"]) overview.mergeCells(rangeName);
overview.getRange("A5").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})`]];
overview.getRange("C5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]];
overview.getRange("E5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待前置结论")`]];
overview.getRange("G5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"已确认")`]];
overview.getRange("A7:H7").values = [["按状态", "数量", "按阻塞等级", "待确认", "按负责人", "待确认", "结构检查", "数量"]];
overview.getRange("A7:H7").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#163A5A" }, rowHeightPx: 32 };
const statusValues = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"], blockValues = ["阻塞测试", "部分阻塞", "不阻塞"], ownerValues = ["产品", "交互", "技术", "多方确认"];
overview.getRange("A8:A12").values = statusValues.map((value) => [value]); overview.getRange("C8:C10").values = blockValues.map((value) => [value]); overview.getRange("E8:E11").values = ownerValues.map((value) => [value]); overview.getRange("G8:G11").values = [["需求组"], ["追问子问题"], ["未填写产品结论"], ["选择其他但未补充"]];
statusValues.forEach((status, index) => { overview.getRange(`B${index + 8}`).formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"${status}")`]]; });
blockValues.forEach((level, index) => { overview.getRange(`D${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$E$2:$E$${pending.lastRow},"${level}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
ownerValues.forEach((owner, index) => { overview.getRange(`F${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$R$2:$R$${pending.lastRow},"${owner}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
overview.getRange("H8").values = [[new Set(questions.map((item) => item.需求组编号)).size]]; overview.getRange("H9").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})-COUNTBLANK('需求待确认'!$C$2:$C$${pending.lastRow})`]]; overview.getRange("H10").formulas = [[`=COUNTBLANK('需求待确认'!$L$2:$L$${pending.lastRow})`]]; overview.getRange("H11").formulas = [[`=COUNTIFS('需求待确认'!$L$2:$L$${pending.lastRow},"其他",'需求待确认'!$M$2:$M$${pending.lastRow},"")`]];
overview.getRange("A8:H12").format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" }, rowHeightPx: 31 };
for (const rangeName of ["A8:A12", "C8:C10", "E8:E11", "G8:G11"]) overview.getRange(rangeName).format.horizontalAlignment = "left";
for (const rangeName of ["B8:B12", "D8:D10", "F8:F11", "H8:H11"]) overview.getRange(rangeName).format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A14:H14"); overview.getRange("A14").values = [["填写方式：在“需求待确认”的“产品结论”列选择 A、B、C、D 或其他；选择“其他”时补充具体规则。"]]; overview.getRange("A14:H14").format = { fill: "#F8FAFC", font: { name: "Microsoft YaHei", size: 10, color: "#475569" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, rowHeightPx: 34, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
[22, 11, 22, 11, 22, 11, 24, 11].forEach((width, index) => { overview.getRange(`${columnName(index)}1`).format.columnWidth = width; }); overview.freezePanes.freezeRows(2);

const exported = await SpreadsheetFile.exportXlsx(workbook); await exported.save(outputPath);

function setOrReplaceXmlAttribute(tag, name, value) { const pattern = new RegExp(`\\s${name}="[^"]*"`); if (pattern.test(tag)) return tag.replace(pattern, ` ${name}="${value}"`); if (/\s*\/>$/.test(tag)) return tag.replace(/\s*\/>$/, ` ${name}="${value}" />`); return tag.replace(/>$/, ` ${name}="${value}">`); }
function patchXmlFreeze(xml, freeze) { if (/<x:pane[^>]*\/>/.test(xml)) return xml.replace(/<x:pane[^>]*\/>/, freeze.split("<x:selection")[0]); if (/<x:sheetView([^>]*)\/>/.test(xml)) return xml.replace(/<x:sheetView([^>]*)\/>/, `<x:sheetView$1>${freeze}</x:sheetView>`); return xml.replace(/(<x:sheetView[^>]*>)/, `$1${freeze}`); }
const zip = await JSZip.loadAsync(await fs.readFile(outputPath));
const freezes = [[1, '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />'], [2, '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'], [3, '<x:pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A3" sqref="A3" />']];
for (const [sheetNumber, freeze] of freezes) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`, entry = zip.file(entryName); assert(entry, `missing ${entryName}`); let xml = patchXmlFreeze(await entry.async("string"), freeze);
  if (sheetNumber === 2) for (const column of [6, 8, 14, 15, 16, 17]) { const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${column}"[^>]*\\bmax="${column}"[^>]*\/>`); xml = xml.replace(pattern, (tag) => setOrReplaceXmlAttribute(tag, "hidden", "1")); }
  assert(xml.includes('state="frozen"')); zip.file(entryName, xml);
}
const workbookEntry = zip.file("xl/workbook.xml"); assert(workbookEntry); let workbookXml = await workbookEntry.async("string");
if (/<x:workbookView[^>]*\/>/.test(workbookXml)) workbookXml = workbookXml.replace(/<x:workbookView[^>]*\/>/, '<x:workbookView activeTab="2" />'); else if (/<x:bookViews>/.test(workbookXml)) workbookXml = workbookXml.replace(/<x:bookViews>/, '<x:bookViews><x:workbookView activeTab="2" />'); else workbookXml = workbookXml.replace(/(<x:sheets>)/, '<x:bookViews><x:workbookView activeTab="2" /></x:bookViews>$1');
if (!/<x:calcPr/.test(workbookXml)) workbookXml = workbookXml.replace(/<\/x:workbook>/, '<x:calcPr calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>'); zip.file("xl/workbook.xml", workbookXml); await fs.writeFile(outputPath, await zip.generateAsync({ type: "nodebuffer" }));

const finalBytes = await fs.readFile(outputPath), finalZip = await JSZip.loadAsync(finalBytes);
const mainTableXml = await finalZip.file("xl/tables/table1.xml").async("string"), pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string"), finalWorkbookXml = await finalZip.file("xl/workbook.xml").async("string");
assert(mainTableXml.includes(`ref="A1:O${main.lastRow}"`)); assert.equal((mainTableXml.match(/<x:tableColumn /g) ?? []).length, 15); assert(pendingTableXml.includes(`ref="A1:T${pending.lastRow}"`)); assert.equal((pendingTableXml.match(/<x:tableColumn /g) ?? []).length, 20); assert(finalWorkbookXml.includes('activeTab="2"'));
const finalWorkbook = await SpreadsheetFile.importXlsx(finalBytes); assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"]);
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 14000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 140 })).ndjson,
  mainHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O9", maxChars: 22000 })).ndjson,
  mainMiddle: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, Math.floor(main.lastRow / 2) - 3)}:O${Math.min(main.lastRow, Math.floor(main.lastRow / 2) + 3)}`, maxChars: 22000 })).ndjson,
  mainTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, main.lastRow - 6)}:O${main.lastRow}`, maxChars: 22000 })).ndjson,
  pendingHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:T${Math.min(9, pending.lastRow)}`, maxChars: 26000 })).ndjson,
  pendingTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A${Math.max(2, pending.lastRow - 6)}:T${pending.lastRow}`, maxChars: 26000 })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 18000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 18000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`, "utf8"); await fs.writeFile(inspectNdjsonPath, Object.values(inspection).join("\n"), "utf8");
for (const [sheetName, range, fileName] of [["功能测试用例", "A1:O9", "preview-260831-001-main.png"], ["需求待确认", `A1:T${Math.min(9, pending.lastRow)}`, "preview-260831-001-pending.png"], ["产品决策概览", "A1:H14", "preview-260831-001-overview.png"]]) { const preview = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" }); await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer())); }
for (const item of syncResult.原型基线) assert.deepEqual(await baselineEntry(item.相对路径), item, `生成期间原型基线变化：${item.相对路径}`);
const stat = await fs.stat(outputPath); assert(stat.size > 0);
console.log(JSON.stringify({ outputPath, jsonPath, syncResultPath, sheets: finalWorkbook.worksheets.items.map((sheet) => sheet.name), cases: cases.length, questions: questions.length, p0: cases.filter((item) => item.优先级 === "P0").length, bytes: stat.size }, null, 2));
