import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import JSZip from "jszip";

const workDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(workDir, "../..");
const workbookPath = path.join(rootDir, "outputs/Luma Live-case/用户App-直播模块-260828-012.xlsx");

const functionalHeaders = [
  "序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项",
  "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注",
];
const pendingHeaders = [
  "问题编号", "功能模块", "功能结构", "问题分类", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态",
];
const validTypes = ["功能需求", "业务流程", "逻辑校验", "异常用例"];
const validPriorities = ["P0", "P1", "P2", "P3"];
const validResults = ["未测", "通过", "不通过", "阻塞", "不适用"];
const validCategories = [
  "需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理",
  "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则",
];
const validQuestionStatus = ["待确认", "已确认", "无需处理"];

const sourceCommon = "1. 来源：prototype/assets/common.js 动态交互脚本\n2. 静态分析已确认事件绑定；未在浏览器动态验证\n3. 补充原因：业务结果完整性扫描发现独立反馈观察点未覆盖";
const sourceRoom = "1. 来源：prototype/pages/user/live/live-room.html 动态交互脚本\n2. 静态分析已确认事件绑定；未在浏览器动态验证\n3. 补充原因：业务结果完整性扫描发现独立反馈观察点未覆盖";
const sourceStart = "1. 来源：prototype/pages/user/host/start-live-settings.html 动态交互脚本\n2. 静态分析已确认事件绑定；未在浏览器动态验证\n3. 补充原因：业务结果完整性扫描发现独立反馈观察点未覆盖";

const additions = [
  [193, "LIVE-193", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证密码房修改密码成功反馈", "修改密码成功反馈", "1. 主播正在密码房直播\n2. 新密码为 8 位数字 13572468", "1. 打开直播设置\n2. 进入房间密码设置\n3. 输入 13572468\n4. 点击“保存密码”", "页面提示“房间密码已修改”", "FLOW-LIVE-003", "未测", "", sourceCommon],
  [194, "LIVE-194", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证转发直播间成功反馈", "转发成功反馈", "1. 主播正在直播\n2. 主播存在“Sari 粉丝团”", "1. 打开直播设置\n2. 点击“转发”\n3. 选择“Sari 粉丝团”\n4. 确认转发", "页面提示“已转发至 Sari 粉丝团”", "", "未测", "", sourceCommon],
  [195, "LIVE-195", "用户App-直播模块", "主播连麦", "功能需求", "P2", "验证发起连麦请求成功反馈", "连麦请求发送反馈", "1. 主播正在普通房直播\n2. 当前没有已发出的连麦请求\n3. 主播 Zara 在线且具备连麦权限", "1. 打开连麦主播面板\n2. 搜索 Zara\n3. 点击发起连麦", "页面提示“已向 Zara 发起连麦请求”", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [196, "LIVE-196", "用户App-直播模块", "主播连麦", "异常用例", "P2", "验证已有请求时不重复创建连麦请求", "重复连麦请求拦截", "1. 主播正在普通房直播\n2. 已存在一条未处理的发出请求", "1. 打开连麦主播面板\n2. 搜索另一名可连麦主播\n3. 点击发起连麦", "发出的请求列表不新增第二条连麦请求", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [197, "LIVE-197", "用户App-直播模块", "主播连麦", "异常用例", "P2", "验证已有请求时的重复发起反馈", "重复连麦请求提示", "1. 主播正在普通房直播\n2. 已存在一条未处理的发出请求", "1. 打开连麦主播面板\n2. 搜索另一名可连麦主播\n3. 点击发起连麦", "页面提示“已有发出的连麦请求”", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [198, "LIVE-198", "用户App-直播模块", "主播连麦", "功能需求", "P2", "验证取消连麦请求成功反馈", "取消连麦请求反馈", "1. 主播已向 Sinta 发出连麦请求\n2. Sinta 尚未处理", "1. 打开连麦主播面板\n2. 在发出的请求中点击“取消”", "页面提示“已取消向 Sinta 发出的连麦请求”", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [199, "LIVE-199", "用户App-直播模块", "主播连麦", "功能需求", "P2", "验证接受连麦邀请成功反馈", "接受连麦邀请反馈", "1. 主播收到 Nadia 的有效连麦邀请\n2. 双方均在普通房直播", "1. 打开连麦主播面板\n2. 在 Nadia 的邀请中点击“接受”", "页面提示“已接受 Nadia 的连麦邀请”", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [200, "LIVE-200", "用户App-直播模块", "主播连麦", "业务流程", "P1", "验证拒绝后关闭目标连麦邀请", "拒绝连麦邀请状态", "1. 主播收到 Lina 的有效连麦邀请\n2. 双方均在普通房直播", "1. 打开连麦主播面板\n2. 在 Lina 的邀请中点击“拒绝”", "Lina 的邀请从收到的邀请列表中移除", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [201, "LIVE-201", "用户App-直播模块", "主播连麦", "业务流程", "P1", "验证拒绝后不建立连麦关系", "拒绝连麦关系结果", "1. 主播收到 Lina 的有效连麦邀请\n2. 双方均在普通房直播", "1. 打开连麦主播面板\n2. 在 Lina 的邀请中点击“拒绝”", "当前主播与 Lina 不建立连麦关系", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [202, "LIVE-202", "用户App-直播模块", "主播连麦", "功能需求", "P2", "验证拒绝连麦邀请成功反馈", "拒绝连麦邀请反馈", "1. 主播收到 Lina 的有效连麦邀请\n2. 双方均在普通房直播", "1. 打开连麦主播面板\n2. 在 Lina 的邀请中点击“拒绝”", "页面提示“已拒绝 Lina 的连麦邀请”", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [203, "LIVE-203", "用户App-直播模块", "主播连麦", "功能需求", "P2", "验证退出连麦成功反馈", "退出连麦反馈", "1. 两位主播正在连麦", "1. 点击“退出”\n2. 在确认提示中点击“确认退出”", "页面提示“已退出连麦”", "FLOW-LIVE-005", "未测", "", sourceCommon],
  [204, "LIVE-204", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证主播禁言成功反馈", "主播禁言反馈", "1. 主播正在直播\n2. 目标用户未被禁言", "1. 打开目标用户资料卡\n2. 点击“禁言”", "页面提示“已禁言”", "", "未测", "", sourceCommon],
  [205, "LIVE-205", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证主播解除禁言成功反馈", "主播解除禁言反馈", "1. 主播正在直播\n2. 目标用户已被禁言", "1. 打开目标用户资料卡\n2. 点击“解除禁言”", "页面提示“已解除禁言”", "", "未测", "", sourceCommon],
  [206, "LIVE-206", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证主播踢出用户成功反馈", "主播踢出反馈", "1. 主播正在直播\n2. 目标用户在当前直播间", "1. 打开目标用户资料卡\n2. 点击“踢出”", "页面提示“已踢出直播间”", "", "未测", "", sourceCommon],
  [207, "LIVE-207", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证主播设置房管成功反馈", "设置房管反馈", "1. 主播正在直播\n2. 目标用户满足房管授权条件", "1. 打开目标用户资料卡\n2. 点击“设房管”", "页面提示“已设为房管”", "", "未测", "", sourceCommon],
  [208, "LIVE-208", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证主播取消房管成功反馈", "取消房管反馈", "1. 主播正在直播\n2. 目标用户是当前主播的房管", "1. 打开目标用户资料卡\n2. 点击“取消房管”", "页面提示“已取消房管”", "", "未测", "", sourceCommon],
  [209, "LIVE-209", "用户App-直播模块", "主播直播间", "功能需求", "P2", "验证禁用用户列表恢复发言成功反馈", "恢复发言反馈", "1. 主播正在普通房直播\n2. 用户 Nila 处于当前场次禁言状态", "1. 打开直播设置\n2. 进入“禁用用户”\n3. 点击 Nila 的“恢复发言”\n4. 完成两次确认", "页面提示“已恢复 Nila 的发言”", "", "未测", "", "1. 来源：prototype/assets/live-muted-users.js 动态交互脚本\n2. 静态分析已确认事件绑定；未在浏览器动态验证\n3. 补充原因：业务结果完整性扫描发现独立反馈观察点未覆盖"],
  [210, "LIVE-210", "用户App-直播模块", "门票房进房", "功能需求", "P2", "验证购买门票成功反馈", "购票成功反馈", "1. 用户未购买当前场次门票\n2. 门票价格为 10 金币\n3. 用户金币余额不少于 10", "1. 进入目标门票房\n2. 确认购买门票", "页面提示“购买门票成功”", "FLOW-LIVE-002", "未测", "", sourceRoom],
  [211, "LIVE-211", "用户App-直播模块", "直播送礼", "功能需求", "P2", "验证赠送礼物成功反馈", "赠礼成功反馈", "1. 用户正在观看直播\n2. 用户余额足够赠送 1 个鲜花", "1. 打开礼物面板\n2. 切换到“普通”\n3. 选择“鲜花”\n4. 选择数量 1\n5. 点击“赠送”", "页面提示“已赠送 鲜花 x1”", "FLOW-LIVE-004", "未测", "", sourceCommon],
  [212, "LIVE-212", "用户App-直播模块", "直播间粉丝团", "功能需求", "P2", "验证加入粉丝团成功反馈", "加入粉丝团反馈", "1. 用户正在观看 Sari 的直播\n2. 用户尚未加入 Sari 粉丝团\n3. 用户满足加入条件", "1. 打开粉丝团面板\n2. 点击“加入粉丝团”", "页面提示“已加入 Sari 粉丝团”", "", "未测", "", sourceCommon],
  [213, "LIVE-213", "用户App-直播模块", "观众互动", "功能需求", "P2", "验证发送评论成功反馈", "评论发送反馈", "1. 用户正在观看直播\n2. 用户未被禁言", "1. 在评论框输入“今晚的歌很好听”\n2. 点击发送", "页面提示“评论已发送”", "", "未测", "", sourceRoom],
  [214, "LIVE-214", "用户App-直播模块", "开播设置", "功能需求", "P2", "验证开始直播成功反馈", "开播成功反馈", "1. 主播具备直播权限\n2. 已完成有效开播设置", "1. 点击“开始直播”", "页面提示“已开始直播”", "FLOW-LIVE-001", "未测", "", sourceStart],
];

const pendingAdditions = [
  ["Q-018", "用户App-直播模块", "主播直播间", "配置和历史数据影响", "确认直播中修改房间密码的生效时间和影响范围。", "原型明确保存后提示“房间密码已修改”，角色用例说明后续进房使用新密码。", "已在房间内的观众、正在输入旧密码的用户、已获得入口的授权用户是否受影响，以及新旧密码切换的准确时点。", "LIVE-034、LIVE-035、LIVE-184、LIVE-193", "待确认"],
  ["Q-019", "用户App-直播模块", "主播直播间", "交互与文案规则", "确认直播模块关键操作反馈的统一规则。", "动态原型对密码修改、转发、连麦、禁言、踢出、房管、购票和赠礼提供成功提示；部分操作仅通过页面状态变化反馈。", "哪些操作必须展示成功、失败或处理中反馈，提示形式、文案、持续时间和重复触发方式。", "LIVE-193 至 LIVE-214 及其他关键写操作", "待确认"],
  ["Q-020", "用户App-直播模块", "主播直播间", "异常处理", "确认直播间关键写操作在网络异常和服务失败时的恢复规则。", "需求和原型描述了关注、评论、粉丝团、转发、密码修改及管理操作的成功结果，未统一描述提交中、超时和失败状态。", "超时时间、按钮禁用、失败提示、是否自动重试、手动重试入口、重复提交幂等及失败后原状态保留规则。", "关注、评论、粉丝团、转发、房间配置和直播管理操作", "待确认"],
  ["Q-021", "用户App-直播模块", "直播间管理", "跨端与跨模块一致性", "确认禁言、踢出、拉黑和房管变更在各观察端的同步时点。", "需求明确各管理动作的业务作用域，原型展示主播或房管侧操作入口。", "主播端、房管端、目标观众端、在线列表、公屏和后续进房入口的刷新机制、延迟上限及部分端失败时的处理。", "LIVE-078 至 LIVE-085、LIVE-127 至 LIVE-148、LIVE-183、LIVE-204 至 LIVE-209", "待确认"],
  ["Q-022", "用户App-直播模块", "门票房进房", "异常处理", "确认门票购买在扣款、订单和进房部分成功时的补偿规则。", "需求明确购票成功后扣减金币、生成消费记录并获得本场资格；当前资料未描述多系统部分成功。", "扣款成功但进房失败、订单成功但资格未生效、重复支付回调、超时后实际成功的查询、重试、退款或补发资格规则。", "LIVE-017 至 LIVE-025、LIVE-210", "待确认"],
  ["Q-023", "用户App-直播模块", "主播连麦", "流程与状态", "确认连麦邀请的有效期和过程态冲突处理。", "原型支持发出、取消、接受、拒绝和同时收到多条邀请；需求仅限定在线、权限、普通房和两人上限。", "邀请有效期、目标忙碌、双方结束直播或离线、房型变化、同时接受多条邀请及处理后到达的迟到请求如何关闭。", "LIVE-158 至 LIVE-175、LIVE-188 至 LIVE-189、LIVE-195 至 LIVE-203", "待确认"],
];

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
  return Math.min(180, Math.max(38, lines * 16 + 10));
}

function styleSheet(sheet, headers, rows, widths, tableName, validations, priorityColumn = null) {
  const lastColumn = columnName(headers.length - 1);
  const lastRow = rows.length + 1;
  const range = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  const existingTable = sheet.tables.items[0];
  assert(existingTable, `${sheet.name} 缺少表格`);
  existingTable.delete();
  range.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
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
  validations.forEach(({ column, values }) => {
    sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  });
  if (priorityColumn) {
    const priorityRange = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    priorityRange.conditionalFormats.deleteAll();
    priorityRange.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    priorityRange.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => {
    sheet.getRange(`${columnName(index)}1`).format.columnWidth = width;
  });
  rows.forEach((row, index) => {
    sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths);
  });
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
  return { lastColumn, lastRow };
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const functionalSheet = workbook.worksheets.getItem("功能测试用例");
const pendingSheet = workbook.worksheets.getItem("需求待确认");
const functionalBefore = functionalSheet.getUsedRange().values;
const pendingBefore = pendingSheet.getUsedRange().values;

assert.deepEqual(functionalBefore[0], functionalHeaders, "功能测试用例列顺序不符合预期");
assert.deepEqual(pendingBefore[0], pendingHeaders, "需求待确认列顺序不符合预期");
const normalizeBlanks = (rows) => rows.map((row) => row.map((value) => value ?? ""));
const originalFunctionalRows = functionalBefore.slice(1, 193);
const originalPendingRows = pendingBefore.slice(1, 18);
assert.equal(originalFunctionalRows.at(-1)[1], "LIVE-192", "原有正式用例末尾编号不是 LIVE-192");
assert.equal(originalPendingRows.at(-1)[0], "Q-017", "原有待确认末尾编号不是 Q-017");

let functionalRows;
if (functionalBefore.length - 1 === 192) {
  functionalRows = [...originalFunctionalRows, ...additions];
} else {
  assert.equal(functionalBefore.length - 1, 214, "正式用例数量既不是 192 也不是 214，停止处理");
  assert.deepEqual(normalizeBlanks(functionalBefore.slice(193)), normalizeBlanks(additions), "已追加正式用例与预期不一致");
  functionalRows = functionalBefore.slice(1);
}

let pendingRows;
if (pendingBefore.length - 1 === 17) {
  pendingRows = [...originalPendingRows, ...pendingAdditions];
} else {
  assert.equal(pendingBefore.length - 1, 23, "待确认数量既不是 17 也不是 23，停止处理");
  assert.deepEqual(normalizeBlanks(pendingBefore.slice(18)), normalizeBlanks(pendingAdditions), "已追加待确认记录与预期不一致");
  pendingRows = pendingBefore.slice(1);
}
const caseIds = functionalRows.map((row) => row[1]);
const questionIds = pendingRows.map((row) => row[0]);
assert.equal(new Set(caseIds).size, caseIds.length, "存在重复用例编号");
assert.equal(new Set(questionIds).size, questionIds.length, "存在重复问题编号");
functionalRows.forEach((row, index) => {
  assert.equal(row.length, 15, `${row[1]} 列数不正确`);
  assert.equal(row[0], index + 1, `${row[1]} 序号不连续`);
  assert.equal(row[1], `LIVE-${String(index + 1).padStart(3, "0")}`, `${row[1]} 编号不连续`);
  assert(validTypes.includes(row[4]), `${row[1]} 用例类型无效`);
  assert(validPriorities.includes(row[5]), `${row[1]} 优先级无效`);
  assert(row[6].startsWith("验证"), `${row[1]} 用例描述未以“验证”开头`);
  assert(row[8] && row[9] && row[10], `${row[1]} 缺少前置、步骤或预期`);
  assert(!/[\n；;]/.test(row[10]), `${row[1]} 预期结果疑似合并多个独立结果`);
  assert(validResults.includes(row[12]), `${row[1]} 测试结果无效`);
  assert(row[14], `${row[1]} 缺少来源`);
});
pendingRows.forEach((row) => {
  assert.equal(row.length, 9, `${row[0]} 列数不正确`);
  assert(validCategories.includes(row[3]), `${row[0]} 问题分类无效`);
  assert(validQuestionStatus.includes(row[8]), `${row[0]} 确认状态无效`);
});

const main = styleSheet(
  functionalSheet,
  functionalHeaders,
  functionalRows,
  [8, 15, 18, 26, 13, 9, 36, 28, 42, 48, 54, 18, 12, 14, 48],
  "FunctionalTestCases",
  [
    { column: "E", values: validTypes },
    { column: "F", values: validPriorities },
    { column: "M", values: validResults },
  ],
  "F",
);
const pending = styleSheet(
  pendingSheet,
  pendingHeaders,
  pendingRows,
  [14, 20, 28, 24, 52, 58, 48, 38, 14],
  "PendingRequirements",
  [
    { column: "D", values: validCategories },
    { column: "I", values: validQuestionStatus },
  ],
);

const mainPreview = await workbook.render({ sheetName: "功能测试用例", range: `A190:O${main.lastRow}`, scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-after-main.png"), new Uint8Array(await mainPreview.arrayBuffer()));
const pendingPreview = await workbook.render({ sheetName: "需求待确认", range: `A14:I${pending.lastRow}`, scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-after-pending.png"), new Uint8Array(await pendingPreview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(workbookPath);

const zip = await JSZip.loadAsync(await fs.readFile(workbookPath));
for (const sheetNumber of [1, 2]) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `缺少 ${entryName}`);
  let xml = await entry.async("string");
  if (!xml.includes('state="frozen"')) {
    xml = xml.replace(
      /<x:sheetView([^>]*)\/>/,
      '<x:sheetView$1><x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" /></x:sheetView>',
    );
    zip.file(entryName, xml);
  }
}
await fs.writeFile(workbookPath, await zip.generateAsync({ type: "nodebuffer" }));

const verified = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const verifiedFunctional = verified.worksheets.getItem("功能测试用例");
const verifiedPending = verified.worksheets.getItem("需求待确认");
assert.deepEqual(normalizeBlanks(verifiedFunctional.getRange("A2:O193").values), normalizeBlanks(originalFunctionalRows), "原有正式用例内容发生变化");
assert.deepEqual(normalizeBlanks(verifiedPending.getRange("A2:I18").values), normalizeBlanks(originalPendingRows), "原有待确认记录发生变化");
assert.deepEqual(normalizeBlanks(verifiedFunctional.getRange(`A194:O${main.lastRow}`).values), normalizeBlanks(additions), "新增正式用例与预期不一致");
assert.deepEqual(normalizeBlanks(verifiedPending.getRange(`A19:I${pending.lastRow}`).values), normalizeBlanks(pendingAdditions), "新增待确认记录与预期不一致");

const formulaErrors = await verified.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
assert(formulaErrors.ndjson.includes("matched 0 entries"), "工作簿存在公式错误");
const inspectPath = `${workbookPath}.inspect.ndjson`;
try {
  await fs.rename(inspectPath, path.join(workDir, "012-formula-scan.inspect.ndjson"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const finalZip = await JSZip.loadAsync(await fs.readFile(workbookPath));
const mainTableXml = await finalZip.file("xl/tables/table1.xml").async("string");
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
assert(mainTableXml.includes(`ref="A1:O${main.lastRow}"`), "功能测试用例表格范围不正确");
assert(pendingTableXml.includes(`ref="A1:I${pending.lastRow}"`), "需求待确认表格范围不正确");
const mainSheetXml = await finalZip.file("xl/worksheets/sheet1.xml").async("string");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
assert(mainSheetXml.includes(`sqref="E2:E${main.lastRow}"`), "用例类型单选范围不正确");
assert(mainSheetXml.includes(`sqref="F2:F${main.lastRow}"`), "优先级单选范围不正确");
assert(mainSheetXml.includes(`sqref="M2:M${main.lastRow}"`), "测试结果单选范围不正确");
assert(pendingSheetXml.includes(`sqref="D2:D${pending.lastRow}"`), "问题分类单选范围不正确");
assert(pendingSheetXml.includes(`sqref="I2:I${pending.lastRow}"`), "确认状态单选范围不正确");
assert(mainSheetXml.includes('state="frozen"'), "功能测试用例首行未冻结");
assert(pendingSheetXml.includes('state="frozen"'), "需求待确认首行未冻结");

const distribution = pendingRows.reduce((result, row) => {
  result[row[3]] = (result[row[3]] ?? 0) + 1;
  return result;
}, {});
const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({
  workbookPath,
  originalCasesPreserved: 192,
  addedCases: additions.length,
  totalCases: functionalRows.length,
  originalQuestionsPreserved: 17,
  addedQuestions: pendingAdditions.length,
  totalQuestions: pendingRows.length,
  distribution,
  bytes: stat.size,
}, null, 2));
