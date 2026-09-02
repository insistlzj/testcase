import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workDir = path.resolve("work/liveshow-guild-live-records");
const outputDir = path.resolve("outputs/Luma Live-case");
const outputPath = path.join(outputDir, "公会App-直播记录模块-260831-001.xlsx");
const jsonPath = path.join(workDir, "公会App-直播记录模块-测试用例-260831-001.json");
const syncResultPath = path.join(workDir, "prototype-context-sync-result.json");
const inspectionPath = path.join(workDir, "inspection-260831-001.json");
const inspectNdjsonPath = `${outputPath}.inspect.ndjson`;
const referencePath = path.resolve("outputs/Luma Live-case/用户App-直播记录模块-260831-001.xlsx");

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

const strategy = JSON.parse(await fs.readFile(path.resolve("liveshow-proto/需求来源策略.json"), "utf8"));
assert.equal(strategy.来源策略, "prototype-primary", "Luma Live 来源策略不是 prototype-primary");
assert.equal(strategy.生成前同步, true, "Luma Live 未开启生成前同步");

const syncResult = JSON.parse(await fs.readFile(syncResultPath, "utf8"));
assert.notEqual(syncResult.同步状态, "阻塞", "原型与需求清单同步状态为阻塞");
assert.deepEqual(syncResult.需求清单变更日志编号, ["RSL-0004"], "需求同步日志追溯异常");

async function baselineEntry(relativePath) {
  const absolutePath = path.resolve("liveshow-proto", relativePath);
  const bytes = await fs.readFile(absolutePath);
  const stat = await fs.stat(absolutePath);
  return {
    相对路径: relativePath,
    修改时间: new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(stat.mtime).replace(" ", "T") + "+08:00",
    "SHA-256": crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

for (const item of syncResult.原型基线) {
  const current = await baselineEntry(item.相对路径);
  assert.equal(current["SHA-256"], item["SHA-256"], `原型基线已变化：${item.相对路径}`);
  assert.equal(current.修改时间, item.修改时间, `原型修改时间已变化：${item.相对路径}`);
}

const MODULE = "公会App-直播记录模块";
const REQ = "来源：context/02-公会App-项目需求清单.md（2026-08-31 按原型同步，RSL-0004）";
const SPEC = "来源：prototype/Luma Live-原型说明.md";
const ANNO = "来源：prototype/assets/annotations.js 的公会直播记录、场次详情和主播多选批注";
const HOME = "来源：prototype/pages/guild/home/guild-home.html；未连接真实后端动态验证";
const RECORD = "来源：prototype/pages/guild/data/guild-host-data.html；未连接真实后端动态验证";
const SELECTOR = "来源：prototype/pages/guild/data/guild-violation-host-select.html；未连接真实后端动态验证";
const DETAIL = "来源：prototype/pages/guild/data/guild-live-gift-detail.html；未连接真实后端动态验证";
const ALL_LIVE = "来源：prototype/pages/guild/data/guild-all-live.html 与 prototype/assets/guild-record-overviews.js；未连接真实后端动态验证";
const MODEL = "来源：prototype/assets/guild-data-model.js 的公会主播、日期、场次和送礼数据结构";
const SYNC = "同步追溯：work/liveshow-guild-live-records/prototype-context-sync-result.json；RSL-0004";
const QUALITY = "质量检查：最小前置条件、单一业务分支、单一可观察预期结果";

const cases = [];
function addCase({ structure, type = "功能需求", priority = "P2", description, point, pre, steps, expected, flow = "", notes = [] }) {
  cases.push({
    序号: 0,
    用例编号: "",
    功能模块: MODULE,
    功能结构: structure,
    用例类型: type,
    优先级: priority,
    用例描述: description,
    验证用例子项: point,
    前置条件: pre,
    操作步骤: steps,
    预期结果: [expected],
    流程编号: flow,
    测试结果: "未测",
    测试人员: "",
    备注: [...notes, SYNC, QUALITY],
  });
}

const entryFlow = ["流程阶段：公会首页进入直播记录", "共同业务对象：当前公会在 15/08/2026 的主播直播记录"];
addCase({ structure: "入口与默认状态", type: "业务流程", priority: "P0", description: "验证从公会首页进入直播记录", point: "公会首页入口", pre: ["公会长已登录公会 App"], steps: ["进入公会首页", "点击“直播记录”"], expected: "页面进入标题为“直播记录”的页面", flow: "FLOW-GREC-001", notes: [HOME, SPEC, ...entryFlow] });
addCase({ structure: "入口与默认状态", type: "业务流程", priority: "P1", description: "验证首页进入后的默认主播范围", point: "默认主播范围", pre: ["当前公会存在 6 名主播", "公会长已进入公会首页"], steps: ["点击“直播记录”", "查看主播筛选项"], expected: "主播筛选项显示已选 6 人", flow: "FLOW-GREC-001", notes: [REQ, ANNO, HOME, ...entryFlow] });
addCase({ structure: "入口与默认状态", type: "业务流程", priority: "P1", description: "验证首页进入后的默认日期", point: "默认日期范围", pre: ["测试环境业务日期为 15/08/2026", "公会长已进入公会首页"], steps: ["点击“直播记录”", "查看日期范围"], expected: "日期范围显示 15/8/2026～15/8/2026", flow: "FLOW-GREC-001", notes: [REQ, ANNO, HOME, ...entryFlow] });
addCase({ structure: "入口与默认状态", type: "逻辑校验", priority: "P1", description: "验证默认列表的数据范围", point: "默认今日记录", pre: ["测试环境业务日期为 15/08/2026", "15/08/2026 存在 5 场记录", "14/08/2026 存在 1 场记录"], steps: ["从公会首页进入直播记录", "查看场次列表"], expected: "场次列表结果集仅包含 15/08/2026 的 5 场记录", notes: [REQ, ANNO, RECORD, MODEL] });
addCase({ structure: "入口与默认状态", type: "业务流程", priority: "P2", description: "验证直播记录返回公会首页", point: "返回公会首页", pre: ["公会长已从公会首页进入直播记录"], steps: ["点击页面左上角返回按钮"], expected: "页面返回公会首页", flow: "FLOW-GREC-001", notes: [RECORD, "流程阶段：直播记录返回公会首页", ...entryFlow.slice(1)] });

addCase({ structure: "主播筛选", priority: "P1", description: "验证打开主播选择页", point: "主播选择入口", pre: ["公会长已进入直播记录页"], steps: ["点击主播筛选项"], expected: "页面进入标题为“选择主播”的页面", notes: [ANNO, RECORD, SELECTOR] });
addCase({ structure: "主播筛选", priority: "P2", description: "验证主播选择页的默认选中范围", point: "选择页默认范围", pre: ["当前公会存在 6 名主播", "直播记录当前选择全部主播"], steps: ["进入主播选择页", "查看主播选中状态"], expected: "6 名主播均处于选中状态", notes: [ANNO, SELECTOR] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证按主播名称搜索", point: "名称搜索", pre: ["当前公会存在主播 Sari 和 Dewi"], steps: ["进入主播选择页", "在搜索框输入“Sari”"], expected: "搜索结果集仅包含主播 Sari", notes: [ANNO, SELECTOR] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证按主播 ID 搜索", point: "主播 ID 搜索", pre: ["当前公会存在主播 H102938 和 H102954"], steps: ["进入主播选择页", "在搜索框输入“H102938”"], expected: "搜索结果集仅包含主播 H102938", notes: [ANNO, SELECTOR] });
addCase({ structure: "主播筛选", priority: "P2", description: "验证主播搜索无结果状态", point: "搜索无结果", pre: ["当前公会不存在 ID 为 H999999 的主播"], steps: ["进入主播选择页", "在搜索框输入“H999999”"], expected: "主播列表不展示任何主播记录", notes: [SELECTOR] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证选择单个主播后的筛选回显", point: "单选主播回显", pre: ["主播 Sari 的 ID 为 H102938", "主播选择页当前已选全部主播"], steps: ["仅保留主播 Sari 为选中状态", "返回直播记录页"], expected: "主播筛选项显示 Sari、H102938 和已选 1 人", notes: [REQ, ANNO, RECORD, SELECTOR] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证单个主播的记录范围", point: "单主播记录结果集", pre: ["15/08/2026 主播 Sari 有 2 场记录", "15/08/2026 主播 Dewi 有 1 场记录"], steps: ["筛选主播 Sari", "查看场次列表"], expected: "场次列表结果集仅包含主播 Sari 的 2 场记录", notes: [REQ, ANNO, RECORD, MODEL] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证选择多个主播后的筛选回显", point: "多选主播回显", pre: ["主播 Sari 和 Dewi 均属于当前公会"], steps: ["在主播选择页仅选中 Sari 和 Dewi", "返回直播记录页"], expected: "主播筛选项显示已选 2 人", notes: [REQ, ANNO, RECORD, SELECTOR] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证多个主播的记录范围", point: "多主播记录结果集", pre: ["15/08/2026 主播 Sari 有 2 场记录", "15/08/2026 主播 Dewi 有 1 场记录", "15/08/2026 主播 Maya 有 1 场记录"], steps: ["仅选择主播 Sari 和 Dewi", "查看场次列表"], expected: "场次列表结果集仅包含 Sari 的 2 场记录和 Dewi 的 1 场记录", notes: [REQ, ANNO, RECORD, MODEL] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P2", description: "验证取消全部主播后的筛选回显", point: "零主播回显", pre: ["主播选择页当前已选全部主播"], steps: ["点击“全不选”", "返回直播记录页"], expected: "主播筛选项显示已选 0 人", notes: [SELECTOR, RECORD] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P2", description: "验证未选择主播时的记录结果", point: "零主播记录结果", pre: ["主播筛选当前已选 0 人"], steps: ["查看场次列表"], expected: "场次列表显示“当前时间段暂无直播记录”", notes: [RECORD] });
addCase({ structure: "主播筛选", priority: "P2", description: "验证全选恢复全部主播", point: "全选主播", pre: ["主播选择页当前已选 0 人", "当前公会存在 6 名主播"], steps: ["点击“全选”", "返回直播记录页"], expected: "主播筛选项显示已选 6 人", notes: [ANNO, SELECTOR, RECORD] });
addCase({ structure: "主播筛选", type: "逻辑校验", priority: "P1", description: "验证选择主播后保留日期条件", point: "筛选条件联合保留", pre: ["直播记录日期范围为 10/08/2026～15/08/2026"], steps: ["进入主播选择页", "仅选择主播 Sari", "返回直播记录页"], expected: "日期范围仍显示 10/8/2026～15/8/2026", notes: [REQ, ANNO, SELECTOR, RECORD] });

addCase({ structure: "快捷日期筛选", priority: "P1", description: "验证快捷日期选项范围", point: "快捷日期选项", pre: ["公会长已进入直播记录页"], steps: ["点击快捷日期按钮"], expected: "菜单展示今日、昨日、本周、上周、本月、上月和自定义 7 个选项", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P2", description: "验证点击菜单外关闭快捷日期菜单", point: "菜单外部关闭", pre: ["快捷日期菜单已打开"], steps: ["点击菜单外的页面区域"], expected: "快捷日期菜单关闭", notes: [RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P3", description: "验证按 Escape 关闭快捷日期菜单", point: "键盘关闭菜单", pre: ["快捷日期菜单已打开", "测试设备连接物理键盘"], steps: ["按 Escape 键"], expected: "快捷日期菜单关闭", notes: [RECORD] });

const shortcuts = [
  { name: "今日", range: "15/8/2026～15/8/2026", included: "15/08/2026" },
  { name: "昨日", range: "14/8/2026～14/8/2026", included: "14/08/2026" },
  { name: "本周", range: "10/8/2026～15/8/2026", included: "10/08/2026 至 15/08/2026" },
  { name: "上周", range: "3/8/2026～9/8/2026", included: "03/08/2026 至 09/08/2026" },
  { name: "本月", range: "1/8/2026～15/8/2026", included: "01/08/2026 至 15/08/2026" },
  { name: "上月", range: "17/7/2026～31/7/2026", included: "17/07/2026 至 31/07/2026" },
];
for (const shortcut of shortcuts) {
  addCase({ structure: "快捷日期筛选", type: "逻辑校验", priority: "P1", description: `验证${shortcut.name}筛选的日期回显`, point: `${shortcut.name}日期回显`, pre: ["测试数据最新业务日期为 15/08/2026"], steps: ["打开快捷日期菜单", `选择“${shortcut.name}”`], expected: `日期范围显示 ${shortcut.range}`, notes: [REQ, ANNO, RECORD, MODEL] });
  addCase({ structure: "快捷日期筛选", type: "逻辑校验", priority: "P1", description: `验证${shortcut.name}筛选的记录范围`, point: `${shortcut.name}记录结果集`, pre: ["测试数据最新业务日期为 15/08/2026", `${shortcut.included} 内存在直播记录`, "相邻筛选范围外存在直播记录"], steps: ["打开快捷日期菜单", `选择“${shortcut.name}”`, "查看场次列表"], expected: `场次列表结果集仅包含 ${shortcut.included} 内的直播记录`, notes: [REQ, ANNO, RECORD, MODEL] });
}

addCase({ structure: "自定义日期筛选", priority: "P1", description: "验证自定义选项打开日期选择器", point: "自定义日期入口", pre: ["公会长已进入直播记录页"], steps: ["打开快捷日期菜单", "选择“自定义”"], expected: "页面打开标题为“选择日期”的日期选择器", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P1", description: "验证日期范围按钮打开日期选择器", point: "日期范围入口", pre: ["公会长已进入直播记录页"], steps: ["点击日期范围按钮"], expected: "页面打开标题为“选择日期”的日期选择器", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证取消关闭日期选择器", point: "取消日期选择", pre: ["日期选择器已打开"], steps: ["点击“取消”"], expected: "日期选择器关闭", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P2", description: "验证取消后保留已应用日期", point: "取消保留日期", pre: ["已应用日期范围为 10/8/2026～15/8/2026", "日期选择器已打开"], steps: ["选择 12/8/2026", "点击“取消”"], expected: "日期范围仍显示 10/8/2026～15/8/2026", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P3", description: "验证点击遮罩关闭日期选择器", point: "遮罩关闭日期选择", pre: ["日期选择器已打开"], steps: ["点击日期选择器外的遮罩区域"], expected: "日期选择器关闭", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P3", description: "验证按 Escape 关闭日期选择器", point: "键盘关闭日期选择", pre: ["日期选择器已打开", "测试设备连接物理键盘"], steps: ["按 Escape 键"], expected: "日期选择器关闭", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证切换到上一个可用月份", point: "上月日历切换", pre: ["日期选择器当前显示 8/2026", "测试数据包含 7/2026"], steps: ["点击向前月份按钮"], expected: "日历标题显示 7/2026", notes: [RECORD, MODEL] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证切换回下一个可用月份", point: "下月日历切换", pre: ["日期选择器当前显示 7/2026", "测试数据包含 8/2026"], steps: ["点击向后月份按钮"], expected: "日历标题显示 8/2026", notes: [RECORD, MODEL] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证应用单日筛选", point: "自定义单日范围", pre: ["12/08/2026 存在 2 场记录", "13/08/2026 存在 1 场记录"], steps: ["打开日期选择器", "选择 12/8/2026", "点击“确定”", "查看场次列表"], expected: "场次列表结果集仅包含 12/08/2026 的 2 场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证应用连续日期范围", point: "自定义连续范围", pre: ["10/08/2026 至 12/08/2026 内存在 4 场记录", "13/08/2026 存在 1 场记录"], steps: ["打开日期选择器", "选择 10/8/2026", "选择 12/8/2026", "点击“确定”"], expected: "场次列表结果集仅包含 10/08/2026 至 12/08/2026 内的 4 场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证反向选择日期后的范围归一", point: "反向日期归一", pre: ["日期选择器已打开"], steps: ["先选择 15/8/2026", "再选择 12/8/2026", "点击“确定”"], expected: "日期范围显示 12/8/2026～15/8/2026", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证日期范围包含起止日", point: "日期闭区间", pre: ["10/08/2026 和 12/08/2026 各存在 1 场记录", "09/08/2026 存在 1 场记录"], steps: ["将日期范围设置为 10/8/2026～12/8/2026", "查看场次列表"], expected: "场次列表包含 10/08/2026 和 12/08/2026 的两场边界记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证无直播记录日期的空状态", point: "无记录空状态", pre: ["11/08/2026 没有直播记录"], steps: ["将日期范围设置为 11/8/2026～11/8/2026", "查看场次列表"], expected: "场次列表显示“当前时间段暂无直播记录”", notes: [RECORD, MODEL] });

const metricBase = ["收益定义为筛选范围内礼物金币收益总和", "开播人数定义为筛选范围内有直播场次的去重主播数", "直播场次定义为筛选范围内的场次数", "筛选范围内仅有主播 A 的场次 S1 收益 100、S2 收益 250，主播 B 的场次 S3 收益 50"];
addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P1", description: "验证筛选范围的收益汇总", point: "礼物金币收益总和", pre: metricBase, steps: ["选择主播 A 和主播 B", "选择测试数据所在日期", "查看收益"], expected: "收益 = 100 + 250 + 50 = 400", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P1", description: "验证筛选范围的去重开播人数", point: "去重开播人数", pre: metricBase, steps: ["选择主播 A 和主播 B", "选择测试数据所在日期", "查看开播人数"], expected: "开播人数 = 去重主播 A、主播 B = 2", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P1", description: "验证筛选范围的直播场次", point: "直播场次总数", pre: metricBase, steps: ["选择主播 A 和主播 B", "选择测试数据所在日期", "查看直播场次"], expected: "直播场次 = S1 + S2 + S3 = 3", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P1", description: "验证单主播筛选后的收益", point: "单主播收益", pre: metricBase, steps: ["仅选择主播 A", "选择测试数据所在日期", "查看收益"], expected: "收益 = 100 + 250 = 350", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P1", description: "验证单主播筛选后的开播人数", point: "单主播开播人数", pre: metricBase, steps: ["仅选择主播 A", "选择测试数据所在日期", "查看开播人数"], expected: "开播人数 = 去重主播 A = 1", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P1", description: "验证单主播筛选后的直播场次", point: "单主播直播场次", pre: metricBase, steps: ["仅选择主播 A", "选择测试数据所在日期", "查看直播场次"], expected: "直播场次 = S1 + S2 = 2", notes: [REQ, ANNO, RECORD] });
for (const metric of [
  { name: "收益", expected: "收益 = 0" },
  { name: "开播人数", expected: "开播人数 = 0" },
  { name: "直播场次", expected: "直播场次 = 0" },
]) addCase({ structure: "汇总指标", type: "逻辑校验", priority: "P2", description: `验证未选择主播时的${metric.name}`, point: `零主播${metric.name}`, pre: ["主播筛选当前已选 0 人"], steps: [`查看${metric.name}`], expected: metric.expected, notes: [ANNO, RECORD] });

addCase({ structure: "场次列表", type: "逻辑校验", priority: "P1", description: "验证场次按开播时间倒序排列", point: "开播时间倒序", pre: ["筛选范围内存在开播时间为 15/08/2026 09.00、15/08/2026 19.20、14/08/2026 21.00 的三场记录"], steps: ["进入直播记录页", "查看场次排列顺序"], expected: "场次顺序从上到下为 15/08/2026 19.20、15/08/2026 09.00、14/08/2026 21.00", notes: [RECORD, MODEL] });
const cardFields = [
  ["直播主题", "直播主题显示“流行金曲夜”"],
  ["主播名称", "主播名称显示“Sari”"],
  ["主播 ID", "主播 ID 显示“H102938”"],
  ["开播时间", "开播时间显示“15/8/2026 19.20”"],
  ["直播时长", "直播时长显示“1h 51m”"],
  ["金币收益", "收益显示 16,967 金币"],
  ["观看人数", "观众显示 10,055 人"],
  ["收礼数量", "收礼数量显示 369"],
];
for (const [field, expected] of cardFields) addCase({ structure: "场次列表", priority: "P1", description: `验证场次卡片的${field}`, point: `${field}展示`, pre: ["筛选结果包含主题为“流行金曲夜”的测试场次", "测试场次数据已按用例备注来源准备"], steps: ["进入直播记录页", "查看测试场次卡片"], expected, notes: [REQ, ANNO, RECORD, MODEL] });
addCase({ structure: "场次列表", priority: "P2", description: "验证单主播模式不重复展示主播身份", point: "单主播卡片身份隐藏", pre: ["直播记录当前仅选择主播 Sari"], steps: ["查看主播 Sari 的场次卡片"], expected: "场次卡片不展示主播名称和主播 ID 行", notes: [RECORD] });
addCase({ structure: "场次列表", priority: "P2", description: "验证门票房场次类型标识", point: "门票房标识", pre: ["筛选结果包含一场门票房直播记录"], steps: ["查看门票房场次卡片"], expected: "门票房场次卡片显示门票房标识", notes: [RECORD, MODEL] });
addCase({ structure: "场次列表", priority: "P2", description: "验证密码房场次类型标识", point: "密码房标识", pre: ["筛选结果包含一场密码房直播记录"], steps: ["查看密码房场次卡片"], expected: "密码房场次卡片显示密码房标识", notes: [RECORD, MODEL] });
addCase({ structure: "场次列表", priority: "P2", description: "验证普通房场次类型展示", point: "普通房类型展示", pre: ["筛选结果包含一场普通房直播记录"], steps: ["查看普通房场次卡片"], expected: "普通房场次卡片不显示门票房标识和密码房标识", notes: [RECORD, MODEL] });

addCase({ structure: "直播场次详情", type: "业务流程", priority: "P1", description: "验证从场次卡片进入直播场次详情", point: "场次详情入口", pre: ["直播记录列表存在场次 S-1001"], steps: ["点击场次 S-1001 的卡片"], expected: "页面进入标题为“直播场次详情”的页面", notes: [REQ, ANNO, RECORD, DETAIL] });
const detailFields = [
  ["直播主题", "直播主题显示“流行金曲夜”"],
  ["场次 ID", "场次 ID 显示“S-1001”"],
  ["主播名称", "主播名称显示“Sari”"],
  ["主播 ID", "主播 ID 显示“H102938”"],
  ["开播时间", "开播时间显示“15/8/2026 19.20”"],
  ["直播时长", "直播时长显示“1h 51m”"],
  ["观众数量", "观众数量显示 10,055"],
  ["送礼观众", "送礼观众显示 120"],
  ["礼物数量", "礼物数量显示 369"],
  ["礼物收益", "礼物收益显示 16,967 金币"],
];
for (const [field, expected] of detailFields) addCase({ structure: "直播场次详情", priority: "P1", description: `验证直播场次详情的${field}`, point: `${field}展示`, pre: ["公会长已进入场次 S-1001 的直播场次详情", "场次 S-1001 数据已按用例备注来源准备"], steps: ["查看场次详情区域"], expected, notes: [REQ, ANNO, DETAIL, MODEL] });
const giftListFields = [
  ["赠送时间", "送礼记录显示赠送时间“15/8/2026 19.25”"],
  ["礼物名称", "送礼记录显示礼物名称“Rose”"],
  ["金币", "送礼记录显示 300 金币"],
];
for (const [field, expected] of giftListFields) addCase({ structure: "送礼列表", priority: "P1", description: `验证送礼列表的${field}`, point: `送礼列表${field}`, pre: ["场次 S-1001 存在一条 Rose 送礼记录", "该记录数据已按用例备注来源准备"], steps: ["进入场次 S-1001 的直播场次详情", "查看 Rose 送礼记录"], expected, notes: [REQ, ANNO, DETAIL, MODEL] });
addCase({ structure: "送礼详情", priority: "P1", description: "验证打开送礼详情", point: "送礼详情入口", pre: ["直播场次详情存在一条 Rose 送礼记录"], steps: ["点击 Rose 送礼记录"], expected: "页面打开标题为“送礼详情”的详情面板", notes: [REQ, ANNO, DETAIL] });
const giftDetailFields = [
  ["赠送时间", "赠送时间显示“15/8/2026 19.25”"],
  ["礼物名称", "礼物名称显示“Rose”"],
  ["消费金币", "消费金币显示 300"],
  ["礼物单价", "礼物单价显示 100"],
  ["礼物类型", "礼物类型显示“普通礼物”"],
  ["赠送数量", "赠送数量显示 3"],
  ["用户名称", "用户名称显示“Dewi”"],
  ["用户 ID", "用户 ID 显示“U900001”"],
];
for (const [field, expected] of giftDetailFields) addCase({ structure: "送礼详情", priority: "P1", description: `验证送礼详情的${field}`, point: `送礼详情${field}`, pre: ["送礼详情面板已打开", "Rose 送礼记录数据已按用例备注来源准备"], steps: ["查看送礼详情"], expected, notes: [REQ, ANNO, DETAIL, MODEL] });
for (const close of [
  ["关闭按钮", "点击送礼详情右上角关闭按钮"],
  ["遮罩", "点击送礼详情外的遮罩区域"],
  ["Escape", "按 Escape 键"],
]) addCase({ structure: "送礼详情", priority: "P2", description: `验证使用${close[0]}关闭送礼详情`, point: `${close[0]}关闭详情`, pre: ["送礼详情面板已打开"], steps: [close[1]], expected: "送礼详情面板关闭", notes: [DETAIL] });
addCase({ structure: "送礼详情", type: "逻辑校验", priority: "P1", description: "验证礼物消费金币计算", point: "礼物消费金额", pre: ["Rose 礼物单价为 100 金币", "本次赠送数量为 3"], steps: ["打开 Rose 送礼详情", "查看消费金币"], expected: "消费金币 = 100 × 3 = 300", notes: [ANNO, DETAIL, MODEL] });
addCase({ structure: "直播场次详情", type: "逻辑校验", priority: "P1", description: "验证送礼列表金额与场次收益一致", point: "场次礼物收益对账", pre: ["场次 S-1002 仅有 Rose 300 金币和 Crown 500 金币两条送礼记录", "场次收益定义为本场礼物金币收益总和"], steps: ["进入场次 S-1002 的直播场次详情", "查看礼物收益"], expected: "礼物收益 = 300 + 500 = 800", notes: [REQ, ANNO, DETAIL, MODEL] });
addCase({ structure: "直播场次详情", type: "逻辑校验", priority: "P1", description: "验证返回后保留主播筛选", point: "返回保留主播条件", pre: ["直播记录当前仅选择主播 Sari", "已从 Sari 的场次进入直播场次详情"], steps: ["点击页面左上角返回按钮"], expected: "直播记录的主播筛选仍显示 Sari、H102938 和已选 1 人", notes: [REQ, ANNO, DETAIL, RECORD] });
addCase({ structure: "直播场次详情", type: "逻辑校验", priority: "P1", description: "验证返回后保留日期筛选", point: "返回保留日期条件", pre: ["直播记录日期范围为 10/8/2026～15/8/2026", "已从该范围内场次进入直播场次详情"], steps: ["点击页面左上角返回按钮"], expected: "直播记录的日期范围仍显示 10/8/2026～15/8/2026", notes: [REQ, ANNO, DETAIL, RECORD] });

addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P1", description: "验证全部直播记录按主播汇总直播次数", point: "主播直播次数汇总", pre: ["测试范围内主播 Sari 有 2 场直播", "测试范围内主播 Dewi 有 1 场直播"], steps: ["进入全部直播记录页", "查看主播 Sari 的汇总行"], expected: "主播 Sari 的直播次数 = 2", notes: [REQ, ANNO, ALL_LIVE, MODEL] });
addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P1", description: "验证全部直播记录按主播汇总有效天", point: "主播有效天汇总", pre: ["有效天定义为主播所属自然日累计直播时长不少于 180 分钟", "主播 Sari 在测试范围内有 1 天时长 206 分钟和 1 天时长 178 分钟"], steps: ["进入全部直播记录页", "查看主播 Sari 的有效天"], expected: "主播 Sari 的有效天 = 1", notes: [REQ, ALL_LIVE, MODEL] });
addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P1", description: "验证全部直播记录按主播汇总直播时长", point: "主播直播时长汇总", pre: ["主播 Sari 在测试范围内两天直播时长分别为 206 分钟和 178 分钟"], steps: ["进入全部直播记录页", "查看主播 Sari 的直播时长"], expected: "主播 Sari 的直播时长 = 206 + 178 = 384 分钟 = 6h 24m", notes: [REQ, ALL_LIVE, MODEL] });
addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P2", description: "验证无直播主播不进入汇总列表", point: "零场次主播过滤", pre: ["主播 Maya 在测试范围内直播场次为 0", "主播 Sari 在测试范围内直播场次为 1"], steps: ["进入全部直播记录页", "查看主播汇总列表"], expected: "主播汇总列表不包含主播 Maya", notes: [ALL_LIVE, MODEL] });
addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P2", description: "验证全部直播记录的排序", point: "主播汇总排序", pre: ["主播 A 有 3 场直播且总时长 300 分钟", "主播 B 有 2 场直播且总时长 500 分钟", "主播 C 有 2 场直播且总时长 400 分钟"], steps: ["进入全部直播记录页", "查看主播汇总顺序"], expected: "主播汇总顺序从上到下为主播 A、主播 B、主播 C", notes: [ALL_LIVE] });
addCase({ structure: "全部直播记录", type: "业务流程", priority: "P1", description: "验证从主播汇总进入单主播直播记录", point: "主播汇总下钻", pre: ["全部直播记录日期范围为 10/8/2026～15/8/2026", "主播 Sari 汇总行已展示"], steps: ["点击主播 Sari 的汇总行"], expected: "直播记录的主播筛选显示 Sari、H102938 和已选 1 人", notes: [REQ, ANNO, ALL_LIVE, RECORD] });
addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P1", description: "验证主播汇总下钻后保留日期", point: "下钻保留日期范围", pre: ["全部直播记录日期范围为 10/8/2026～15/8/2026", "主播 Sari 汇总行已展示"], steps: ["点击主播 Sari 的汇总行"], expected: "直播记录的日期范围显示 10/8/2026～15/8/2026", notes: [REQ, ANNO, ALL_LIVE, RECORD] });
addCase({ structure: "全部直播记录", type: "逻辑校验", priority: "P1", description: "验证从单主播记录返回后保留日期", point: "返回全部记录保留日期", pre: ["已从日期范围 10/8/2026～15/8/2026 的全部直播记录进入主播 Sari 的直播记录"], steps: ["点击页面左上角返回按钮"], expected: "全部直播记录的日期范围仍显示 10/8/2026～15/8/2026", notes: [REQ, ANNO, RECORD, ALL_LIVE] });
addCase({ structure: "全部直播记录", priority: "P2", description: "验证全部直播记录无数据状态", point: "全部记录空状态", pre: ["所选日期范围内当前公会所有主播均无直播记录"], steps: ["进入全部直播记录页", "选择无直播数据的日期范围"], expected: "页面显示“暂无直播数据”", notes: [ALL_LIVE] });

cases.forEach((item, index) => {
  item.序号 = index + 1;
  item.用例编号 = `GREC-${String(index + 1).padStart(3, "0")}`;
});
const caseId = (point) => cases.find((item) => item.验证用例子项 === point)?.用例编号 ?? "";

const questions = [
  {
    问题编号: "Q-001", 需求组编号: "RQ-001", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "公会长需要进入原型已注册的“全部直播记录”页面，但现有公会首页和直播记录页没有对应入口",
    问题分类: "需求范围", 待决策问题: "公会 App 的“全部直播记录”从哪个业务页面进入？",
    可选方案: ["A. 从公会首页的“直播记录”区域增加“全部直播记录”入口", "B. 从单主播直播记录页增加“查看全部直播记录”入口", "C. 首版不向公会用户开放该页面"],
    测试建议: "建议 B；单主播记录与全部主播汇总的切换关系最直接，也能复用现有返回路径。",
    产品结论: "", 结论补充: "", 已知依据: ["原型说明和页面树已注册全部直播记录页", "公会首页仅跳转直播记录页", "当前页面脚本没有进入全部直播记录的可见入口"],
    影响范围: ["公会首页", "直播记录", "全部直播记录", "页面返回路径"], 已有用例编号: [], 确认后待补用例: ["全部直播记录正式入口", "入口返回路径"],
    负责人: "产品", 期望确认时间: "进入全部直播记录功能测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-002", 需求组编号: "RQ-002", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播跨午夜直播，公会长使用今日、本周和自定义日期查询该场次",
    问题分类: "计算与统计口径", 待决策问题: "公会直播记录的日期边界采用哪一个业务时区？",
    可选方案: ["A. 固定采用 Asia/Jakarta 时区", "B. 采用公会账号配置的时区", "C. 固定采用 UTC+08:00 时区"],
    测试建议: "建议 A；产品面向印度尼西亚市场，统一业务时区便于公会与主播对账。",
    产品结论: "", 结论补充: "", 已知依据: ["原型使用自然日日期筛选", "当前批注没有定义时区", "业务面向印度尼西亚市场"],
    影响范围: ["今日与昨日", "本周与上周", "本月与上月", "自定义日期", "跨日场次归属"], 已有用例编号: [caseId("默认今日记录"), caseId("日期闭区间")].filter(Boolean), 确认后待补用例: ["跨午夜直播日期归属", "时区边界切换"],
    负责人: "多方确认", 期望确认时间: "进入日期筛选测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-003", 需求组编号: "RQ-003", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "同一用户在一场直播中重复进入，场次卡片和场次详情展示观众数量",
    问题分类: "计算与统计口径", 待决策问题: "单场直播的“观众数量”采用哪一种统计口径？",
    可选方案: ["A. 按用户 ID 去重后的观看人数", "B. 用户每次进入直播间均累计一次", "C. 直播期间的最高同时在线人数"],
    测试建议: "建议 A；字段名称为人数，按用户去重后更容易与重复进入次数和峰值人数区分。",
    产品结论: "", 结论补充: "", 已知依据: ["批注仅说明为观看直播的人数", "数据模型仅提供 viewers 数值", "原型没有重复进入和并发统计说明"],
    影响范围: ["场次卡片观众", "场次详情观众数量", "公会主播数据对账"], 已有用例编号: [caseId("观看人数展示"), caseId("观众数量展示")].filter(Boolean), 确认后待补用例: ["重复进房观众统计", "并发观看统计"],
    负责人: "产品", 期望确认时间: "进入场次统计测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-004", 需求组编号: "RQ-004", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "同一用户一次赠送多件相同礼物，场次卡片和场次详情展示礼物数量",
    问题分类: "计算与统计口径", 待决策问题: "单场直播的“礼物数量”采用哪一种统计口径？",
    可选方案: ["A. 累计所有礼物的商品件数", "B. 累计用户执行赠送的操作次数", "C. 统计本场收到的不同礼物种类数"],
    测试建议: "建议 A；礼物详情已提供赠送数量，按商品件数汇总可以直接复算。",
    产品结论: "", 结论补充: "", 已知依据: ["批注说明为本场收到的礼物总数", "送礼详情包含赠送数量", "原型没有说明总数的聚合维度"],
    影响范围: ["场次卡片收礼数量", "场次详情礼物数量", "送礼明细对账"], 已有用例编号: [caseId("收礼数量展示"), caseId("礼物数量展示")].filter(Boolean), 确认后待补用例: ["批量赠礼数量统计", "多种礼物数量统计"],
    负责人: "产品", 期望确认时间: "进入礼物统计测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-005", 需求组编号: "RQ-005", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播离开公会后，公会长查询该主播在原公会期间产生的直播记录",
    问题分类: "配置和历史数据影响", 待决策问题: "主播离开公会后，原公会是否继续保留其入会期间的历史直播记录？",
    可选方案: ["A. 永久保留入会期间记录并允许原公会查询", "B. 按系统可读取的历史数据保留期查询，过期后不再展示", "C. 离会生效后立即隐藏全部历史记录"],
    测试建议: "建议 A；历史记录属于已发生的公会经营数据，保留有利于收益核对和审计。",
    产品结论: "", 结论补充: "", 已知依据: ["当前选择器只展示当前公会主播", "数据模型另有离职主播数据", "需求没有定义离会后的历史可见范围"],
    影响范围: ["主播选择器", "直播记录", "全部直播记录", "历史收益对账"], 已有用例编号: [], 确认后待补用例: ["离会主播历史查询", "离会生效边界", "原公会数据范围"],
    负责人: "产品", 期望确认时间: "进入历史数据测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-006", 需求组编号: "RQ-006", 父问题编号: "", 追问触发条件: "", 阻塞等级: "不阻塞", 功能模块: MODULE,
    具体场景: "公会长查询较长日期范围，场次列表和送礼列表均超过一屏",
    问题分类: "业务规则", 待决策问题: "直播记录和送礼记录数量较多时采用哪一种加载方式？",
    可选方案: ["A. 每页 20 条，通过页码切换", "B. 首次 20 条，上拉后每次再加载 20 条", "C. 单次最多加载 1,000 条，超过后要求缩小日期范围"],
    测试建议: "建议 B；符合移动端连续浏览习惯，并能控制首次加载量。",
    产品结论: "", 结论补充: "", 已知依据: ["当前原型一次渲染全部模拟数据", "原型没有分页、上拉加载和数量上限说明"],
    影响范围: ["直播记录列表", "送礼列表", "长日期范围查询"], 已有用例编号: [], 确认后待补用例: ["首批加载", "后续加载", "加载去重", "加载结束状态"],
    负责人: "产品", 期望确认时间: "版本验收前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-007", 需求组编号: "RQ-007", 父问题编号: "", 追问触发条件: "", 阻塞等级: "不阻塞", 功能模块: MODULE,
    具体场景: "公会长查询一年以上的公会主播历史直播记录",
    问题分类: "配置和历史数据影响", 待决策问题: "公会直播记录允许查询多长时间的历史数据？",
    可选方案: ["A. 永久保留并允许查询", "B. 保留最近 1 年", "C. 保留最近 2 年", "D. 保留最近 3 年"],
    测试建议: "建议 B；覆盖常见年度对账范围，并限制移动端长期历史查询成本。",
    产品结论: "", 结论补充: "", 已知依据: ["原型只包含 30 天模拟数据", "需求和原型均未定义历史保留期限"],
    影响范围: ["日期选择器", "直播记录", "全部直播记录", "送礼记录"], 已有用例编号: [], 确认后待补用例: ["保留期内查询", "保留期边界", "过期记录处理"],
    负责人: "产品", 期望确认时间: "版本验收前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-008", 需求组编号: "RQ-008", 父问题编号: "", 追问触发条件: "", 阻塞等级: "不阻塞", 功能模块: MODULE,
    具体场景: "公会长在直播记录页筛选主播和日期后需要将明细交给运营人员",
    问题分类: "需求范围", 待决策问题: "“主播数据”的导出能力是否覆盖直播记录和送礼明细？",
    可选方案: ["A. 直播记录和送礼明细均支持按当前筛选结果导出", "B. 仅直播记录支持按当前筛选结果导出", "C. 导出仅属于主播数据汇总，直播记录模块不提供导出"],
    测试建议: "建议 C；当前原型没有导出入口，先按现有页面范围验收可避免扩大首版功能。",
    产品结论: "", 结论补充: "", 已知依据: ["需求清单中的主播数据支持导出", "直播记录原型未展示导出入口", "原型未明确两者的功能继承关系"],
    影响范围: ["主播数据", "直播记录", "送礼明细", "筛选结果导出"], 已有用例编号: [], 确认后待补用例: ["导出入口", "导出数据范围", "导出字段"],
    负责人: "产品", 期望确认时间: "版本验收前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-009", 需求组编号: "RQ-009", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "公会长首次打开直播记录时，网络请求失败且页面没有可展示的旧数据",
    问题分类: "异常处理", 待决策问题: "直播记录首次加载失败时采用哪一种页面终态？",
    可选方案: ["A. 展示加载失败页和“重新加载”按钮", "B. 返回公会首页并提示加载失败", "C. 自动重试 3 次后展示加载失败页和“重新加载”按钮"],
    测试建议: "建议 A；错误原因和恢复入口集中在当前页面，用户能够直接重试。",
    产品结论: "", 结论补充: "", 已知依据: ["当前静态原型没有加载失败状态", "直播记录依赖主播、日期、汇总和场次数据"],
    影响范围: ["直播记录首次加载", "错误状态", "手动重试"], 已有用例编号: [], 确认后待补用例: ["首次加载失败", "手动重新加载", "重试仍失败"],
    负责人: "多方确认", 期望确认时间: "进入异常流程测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-010", 需求组编号: "RQ-010", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播结束一场直播后，公会长立即进入直播记录查询该场次",
    问题分类: "跨端与跨模块一致性", 待决策问题: "主播结束直播后，新场次最迟应在什么时候出现在公会直播记录中？",
    可选方案: ["A. 主播端结束结果页出现时即可查询", "B. 直播结束后 30 秒内可以查询", "C. 直播结束后 5 分钟内可以查询", "D. 该场收益结算完成后可以查询"],
    测试建议: "建议 A；公会可能立即核对场次和收益，明确同一终态更容易验收。",
    产品结论: "", 结论补充: "", 已知依据: ["公会直播记录展示已结束场次", "原型没有定义跨端生成时效和刷新动作"],
    影响范围: ["主播结束直播", "公会直播记录", "汇总指标", "跨端数据一致性"], 已有用例编号: [], 确认后待补用例: ["结束直播后记录生成", "可查询时效边界", "超时后的页面结果"],
    负责人: "多方确认", 期望确认时间: "进入跨端流程测试前", 确认状态: "待确认",
  },
];

const blockRank = { 阻塞测试: 0, 部分阻塞: 1, 不阻塞: 2 };
const groupRank = new Map();
for (const item of questions) groupRank.set(item.需求组编号, Math.min(groupRank.get(item.需求组编号) ?? 9, blockRank[item.阻塞等级]));
const groups = [...new Set(questions.map((item) => item.需求组编号))].sort((a, b) => groupRank.get(a) - groupRank.get(b) || a.localeCompare(b, "zh-CN", { numeric: true }));
const orderedQuestions = groups.flatMap((group) => questions.filter((item) => item.需求组编号 === group).sort((a, b) => a.问题编号.localeCompare(b.问题编号, "zh-CN", { numeric: true })));

const payload = { 测试用例: cases, 需求待确认: orderedQuestions };
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionStatus = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);

assert(cases.length >= 80, "正式用例覆盖数量异常");
assert(new Set(cases.map((item) => item.用例编号)).size === cases.length, "用例编号重复");
assert(new Set(orderedQuestions.map((item) => item.问题编号)).size === orderedQuestions.length, "问题编号重复");
assert.equal(cases.filter((item) => item.优先级 === "P0").length, 1, "P0 不是最小冒烟集");
for (const [index, item] of cases.entries()) {
  assert.equal(item.序号, index + 1, `序号不连续 ${item.用例编号}`);
  assert(validTypes.has(item.用例类型), `用例类型不合法 ${item.用例编号}`);
  assert(validPriorities.has(item.优先级), `优先级不合法 ${item.用例编号}`);
  assert(item.用例描述.startsWith("验证"), `用例描述未以验证开头 ${item.用例编号}`);
  assert(item.验证用例子项.trim(), `验证用例子项为空 ${item.用例编号}`);
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0, `前置条件缺失 ${item.用例编号}`);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0, `操作步骤缺失 ${item.用例编号}`);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1 && item.预期结果[0].trim(), `预期结果数量错误 ${item.用例编号}`);
  assert(Array.isArray(item.备注) && item.备注.some((note) => note.startsWith("来源：")), `缺少来源 ${item.用例编号}`);
  assert(!/yyyyMMdd|\/product\//.test(JSON.stringify(item)), `存在技术占位内容 ${item.用例编号}`);
  if (item.流程编号) {
    assert.equal(item.流程编号, "FLOW-GREC-001", `流程编号不合法 ${item.用例编号}`);
    assert(item.备注.some((note) => note.startsWith("流程阶段：")), `流程阶段缺失 ${item.用例编号}`);
    assert(item.备注.some((note) => note.startsWith("共同业务对象：")), `共同业务对象缺失 ${item.用例编号}`);
  }
}
const signature = (item) => [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join("|"), item.操作步骤.join("|"), item.预期结果[0]].join("||");
assert.equal(new Set(cases.map(signature)).size, cases.length, "存在语义签名重复用例");
for (const item of orderedQuestions) {
  assert(validQuestionBlocks.has(item.阻塞等级), `阻塞等级不合法 ${item.问题编号}`);
  assert(validQuestionCategories.has(item.问题分类), `问题分类不合法 ${item.问题编号}`);
  assert(validQuestionOwners.has(item.负责人), `负责人不合法 ${item.问题编号}`);
  assert(validQuestionStatus.has(item.确认状态), `确认状态不合法 ${item.问题编号}`);
  assert(item.产品结论 === "" && item.结论补充 === "", `初始结论未留空 ${item.问题编号}`);
  assert(item.可选方案.length >= 2 && item.可选方案.length <= 4, `选项数量不合法 ${item.问题编号}`);
  assert(item.已有用例编号.length + item.确认后待补用例.length > 0, `影响用例字段为空 ${item.问题编号}`);
  assert(item.可选方案.every((option, index) => option.startsWith(`${String.fromCharCode(65 + index)}.`)), `选项标签不连续 ${item.问题编号}`);
  assert.equal(item.父问题编号, "", `本次不应存在无必要父问题 ${item.问题编号}`);
  assert.equal(item.追问触发条件, "", `根问题追问条件应为空 ${item.问题编号}`);
}

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
  return { sheet, lastColumn, lastRow };
}

const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例", headers: testHeaders, rows: cases.map(caseRow), widths: [8, 15, 20, 22, 13, 9, 34, 27, 46, 46, 52, 18, 12, 14, 50], tableName: "GuildLiveRecordTestCases",
  validations: [{ column: "E", values: [...validTypes] }, { column: "F", values: [...validPriorities] }, { column: "M", values: [...validResults] }], priorityColumn: "F",
});
const pending = buildSheet(workbook, {
  name: "需求待确认", headers: questionHeaders, rows: orderedQuestions.map(questionRow), widths: [15, 15, 16, 38, 14, 20, 36, 22, 46, 58, 50, 15, 34, 52, 40, 26, 40, 16, 20, 16], tableName: "GuildLiveRecordPending",
  validations: [
    { column: "E", values: [...validQuestionBlocks] }, { column: "H", values: [...validQuestionCategories] }, { column: "L", values: ["A", "B", "C", "D", "其他"] }, { column: "R", values: [...validQuestionOwners] }, { column: "T", values: [...validQuestionStatus] },
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
pendingStatusRange.conditionalFormats.add("containsText", { text: "待确认", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
pendingStatusRange.conditionalFormats.add("containsText", { text: "已确认", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });
let previousGroup = "";
orderedQuestions.forEach((item, index) => {
  const rowNumber = index + 2;
  if (item.需求组编号 !== previousGroup) {
    pending.sheet.getRange(`A${rowNumber}:T${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } };
    previousGroup = item.需求组编号;
  }
  pending.sheet.getRange(`B${rowNumber}`).format.fill = "#DDEBF7";
});

const overview = workbook.worksheets.add("产品决策概览");
overview.showGridLines = false;
overview.mergeCells("A1:H1");
overview.getRange("A1").values = [["产品决策概览"]];
overview.getRange("A1:H1").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 52 };
overview.mergeCells("A2:H2");
overview.getRange("A2").values = [["优先确认统计口径、历史数据范围和跨端生成时效；其余问题可在版本验收前逐项决策。"]];
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
overview.getRange("A14").values = [["填写方式：在“需求待确认”的“产品结论”列选择 A、B、C、D 或其他；选择“其他”时补充具体规则。"]];
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

const zip = await JSZip.loadAsync(await fs.readFile(outputPath));
const freezes = [
  [1, '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />'],
  [2, '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'],
  [3, '<x:pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A3" sqref="A3" />'],
];
for (const [sheetNumber, freeze] of freezes) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `missing ${entryName}`);
  let xml = patchXmlFreeze(await entry.async("string"), freeze);
  if (sheetNumber === 2) {
    for (const column of [6, 8, 14, 15, 16, 17]) {
      const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${column}"[^>]*\\bmax="${column}"[^>]*\/>`);
      xml = xml.replace(pattern, (tag) => setOrReplaceXmlAttribute(tag, "hidden", "1"));
    }
  }
  assert(xml.includes('state="frozen"'), `freeze pane patch failed for ${entryName}`);
  zip.file(entryName, xml);
}
const workbookEntry = zip.file("xl/workbook.xml");
assert(workbookEntry, "missing xl/workbook.xml");
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
const finalWorkbookXml = await finalZip.file("xl/workbook.xml").async("string");
assert(mainTableXml.includes(`ref="A1:O${main.lastRow}"`), "main table range invalid");
assert.equal((mainTableXml.match(/<x:tableColumn /g) ?? []).length, 15, "main table column count invalid");
assert(pendingTableXml.includes(`ref="A1:T${pending.lastRow}"`), "pending table range invalid");
assert.equal((pendingTableXml.match(/<x:tableColumn /g) ?? []).length, 20, "pending table column count invalid");
assert(finalWorkbookXml.includes('activeTab="2"'), "overview is not active by default");

const finalWorkbook = await SpreadsheetFile.importXlsx(finalBytes);
assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"], "工作表结构异常");
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 12000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 140 })).ndjson,
  mainHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O9", maxChars: 20000 })).ndjson,
  mainTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, main.lastRow - 6)}:O${main.lastRow}`, maxChars: 20000 })).ndjson,
  pendingHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:T${Math.min(8, pending.lastRow)}`, maxChars: 22000 })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`, "utf8");
await fs.writeFile(inspectNdjsonPath, Object.values(inspection).join("\n"), "utf8");
for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O9", "preview-260831-001-main.png"],
  ["需求待确认", `A1:T${Math.min(8, pending.lastRow)}`, "preview-260831-001-pending.png"],
  ["产品决策概览", "A1:H14", "preview-260831-001-overview.png"],
]) {
  const preview = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}
for (const item of syncResult.原型基线) {
  const current = await baselineEntry(item.相对路径);
  assert.equal(current["SHA-256"], item["SHA-256"], `生成期间原型基线变化：${item.相对路径}`);
}
const stat = await fs.stat(outputPath);
assert(stat.size > 0, "exported workbook is empty");
console.log(JSON.stringify({ outputPath, jsonPath, syncResultPath, sheets: ["功能测试用例", "需求待确认", "产品决策概览"], cases: cases.length, questions: orderedQuestions.length, p0: cases.filter((item) => item.优先级 === "P0").length, bytes: stat.size }, null, 2));
