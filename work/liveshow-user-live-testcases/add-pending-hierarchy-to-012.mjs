import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import JSZip from "jszip";

const workbookPath = "/Users/geekonup/testcase/outputs/Luma Live-case/用户App-直播模块-260828-012.xlsx";
const workDir = "/Users/geekonup/testcase/work/liveshow-user-live-testcases";
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260828.json");
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const functionalSheet = workbook.worksheets.getItem("功能测试用例");
const pendingSheet = workbook.worksheets.getItem("需求待确认");

if (process.argv.includes("--sync-json-only")) {
  const pendingValues = pendingSheet.getUsedRange().values;
  const pendingHeaders = [
    "问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类",
    "待决策问题", "可选方案", "测试建议", "产品结论", "已知依据", "影响范围", "影响用例", "负责人",
    "期望确认时间", "确认状态",
  ];
  const functionalValues = functionalSheet.getUsedRange().values;
  const functionalHeaders = [
    "序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项",
    "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注",
  ];
  assert.deepEqual(pendingValues[0], pendingHeaders, "工作簿尚未升级为 18 字段结构");
  assert.deepEqual(functionalValues[0], functionalHeaders, "功能测试用例字段结构异常");
  const splitLines = (value) => String(value ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const splitNumbered = (value) => splitLines(value).map((item) => item.replace(/^\d+\.\s*/, ""));
  const cases = functionalValues.slice(1).map((row) => Object.fromEntries(functionalHeaders.map((header, index) => {
    if (["前置条件", "操作步骤", "备注"].includes(header)) return [header, splitNumbered(row[index])];
    if (header === "预期结果") return [header, [row[index] ?? ""]];
    return [header, row[index] ?? ""];
  })));
  const pending = pendingValues.slice(1).map((row) => Object.fromEntries(pendingHeaders.map((header, index) => {
    if (header === "可选方案") return [header, splitLines(row[index])];
    if (["已知依据", "影响范围", "影响用例"].includes(header)) return [header, splitNumbered(row[index])];
    return [header, row[index] ?? ""];
  })));
  const payload = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  payload.测试用例 = cases;
  payload.需求待确认 = pending;
  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const verified = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  assert.equal(verified.测试用例.length, 214, "JSON 功能测试用例数量异常");
  assert.equal(verified.需求待确认.length, 67, "JSON 需求待确认数量异常");
  assert.deepEqual(Object.keys(verified.测试用例[0]), functionalHeaders, "JSON 功能用例字段顺序异常");
  assert.deepEqual(Object.keys(verified.需求待确认[0]), pendingHeaders, "JSON 待确认字段顺序异常");
  console.log(JSON.stringify({ jsonPath, casesPreserved: verified.测试用例.length, pendingRows: verified.需求待确认.length }, null, 2));
  process.exit(0);
}

if (process.argv.includes("--inspect-only")) {
  const values = pendingSheet.getUsedRange().values;
  const summary = values.slice(1).map((row) => ({
    问题编号: row[0],
    阻塞等级: row[1],
    具体场景: row[3],
    待决策问题: row[5],
    确认状态: row[14],
  }));
  const pendingPreview = await workbook.render({ sheetName: "需求待确认", range: "A1:O12", scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, "preview-012-before-hierarchy.png"), new Uint8Array(await pendingPreview.arrayBuffer()));
  const functionalPreview = await workbook.render({ sheetName: "功能测试用例", range: "A1:N8", scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, "preview-012-functional-before-hierarchy.png"), new Uint8Array(await functionalPreview.arrayBuffer()));
  console.log(JSON.stringify({
    sheets: workbook.worksheets.items.map((sheet) => sheet.name),
    functionalCases: functionalSheet.getUsedRange().values.length - 1,
    pendingRows: summary.length,
    headers: values[0],
    summary,
  }, null, 2));
  process.exit(0);
}

const oldHeaders = [
  "问题编号", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议",
  "产品结论", "已知依据", "影响范围", "影响用例", "负责人", "期望确认时间", "确认状态",
];
const headers = [
  "问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类",
  "待决策问题", "可选方案", "测试建议", "产品结论", "已知依据", "影响范围", "影响用例", "负责人",
  "期望确认时间", "确认状态",
];
const blockLevels = ["阻塞测试", "部分阻塞", "不阻塞"];
const categories = [
  "需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理",
  "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则",
];
const owners = ["产品", "交互", "技术", "多方确认"];
const statuses = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"];

const relationships = {
  "Q-002-02": ["Q-002-01", "Q-002-01 确认目标平台属于当前版本支持范围后"],
  "Q-002-03": ["Q-002-01", "Q-002-01 确认至少支持一个外部分享平台后"],
  "Q-003-02": ["Q-003-01", "Q-003-01 确认最终密码长度和字符规则后"],
  "Q-004-02": ["Q-004-01", "输入内容违反 Q-004-01 确认的门票价格规则时"],
  "Q-006-03": ["Q-006-01", "Q-006-01 选择消息不直接进入公屏的处理方案后"],
  "Q-007-02": ["Q-007-01", "Q-007-01 确认禁言时长和默认规则后"],
  "Q-008-02": ["Q-008-01", "Q-008-01 确认屏蔽指定评论的触发入口后"],
  "Q-009-02": ["Q-009-01", "Q-009-01 确认房管拥有拉黑权限后"],
  "Q-009-03": ["Q-009-02", "Q-009-02 确认房管拉黑所写入的黑名单层级后"],
  "Q-010-02": ["Q-010-01", "Q-010-01 确认资料卡拉黑入口对应的业务操作后"],
  "Q-010-03": ["Q-010-01", "Q-010-01 确认资料卡拉黑入口对应的业务操作后"],
  "Q-011-02": ["Q-011-01", "Q-011-01 确认账号拉黑会取消既有关注关系后"],
  "Q-012-04": ["Q-012-02", "Q-012-02 确认连击通过连续点击赠送形成后"],
  "Q-013-02": ["Q-013-01", "Q-013-01 确认重复举报的允许范围后"],
  "Q-015-02": ["Q-015-01", "Q-015-01 确认两位主播视频连麦纳入当前版本后"],
  "Q-015-03": ["Q-015-02", "Q-015-01 与 Q-015-02 完成连麦和 PK 范围决策后"],
  "Q-018-02": ["Q-018-01", "Q-018-01 确认新密码在当前直播中生效后"],
  "Q-018-03": ["Q-018-01", "Q-018-01 确认新密码在当前直播中生效后"],
  "Q-019-02": ["Q-019-01", "Q-019-01 确认需要额外结果提示的操作范围后"],
  "Q-019-03": ["Q-019-02", "Q-019-02 确认各类操作状态的反馈形式后"],
  "Q-023-02": ["Q-023-01", "Q-023-01 确认连麦邀请有效期模型后"],
  "Q-023-03": ["Q-023-01", "Q-023-01 确认连麦邀请有效期模型后"],
  "Q-023-04": ["Q-023-01", "Q-023-01 确认连麦邀请有效期模型后"],
};

function groupId(questionId) {
  const match = String(questionId).match(/^Q-(\d{3})/);
  assert(match, `问题编号格式无效：${questionId}`);
  return `RQ-${match[1]}`;
}

function estimateRowHeight(row, widths) {
  let lines = 1;
  row.forEach((value, index) => {
    const text = String(value ?? "");
    const width = Math.max(5, widths[index]);
    const count = text.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil([...line].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(190, Math.max(46, lines * 16 + 12));
}

const functionalBefore = functionalSheet.getUsedRange().values;
const functionalFormulasBefore = functionalSheet.getUsedRange().formulas;
const pendingBefore = pendingSheet.getUsedRange().values;
assert.equal(functionalBefore.length - 1, 214, "功能测试用例数量不是 214，停止编辑");
assert.equal(pendingBefore.length - 1, 67, "需求待确认数量不是 67，停止编辑");
assert.deepEqual(pendingBefore[0], oldHeaders, "需求待确认当前列结构不符合预期");

const records = pendingBefore.slice(1).map((row) => {
  const relation = relationships[row[0]] ?? ["", ""];
  return {
    问题编号: row[0],
    需求组编号: groupId(row[0]),
    父问题编号: relation[0],
    追问触发条件: relation[1],
    阻塞等级: row[1],
    功能模块: row[2],
    具体场景: row[3],
    问题分类: row[4],
    待决策问题: row[5],
    可选方案: row[6],
    测试建议: row[7],
    产品结论: row[8] ?? "",
    已知依据: row[9],
    影响范围: row[10],
    影响用例: row[11],
    负责人: row[12],
    期望确认时间: row[13],
    确认状态: relation[0] ? "待前置结论" : row[14],
  };
});

const byId = new Map(records.map((record) => [record.问题编号, record]));
assert.equal(byId.size, records.length, "存在重复问题编号");
assert.equal(Object.keys(relationships).length, 23, "父子关系数量与设计不一致");
for (const record of records) {
  assert(blockLevels.includes(record.阻塞等级), `${record.问题编号} 阻塞等级无效`);
  assert(categories.includes(record.问题分类), `${record.问题编号} 问题分类无效`);
  assert(owners.includes(record.负责人), `${record.问题编号} 负责人无效`);
  assert(statuses.includes(record.确认状态), `${record.问题编号} 确认状态无效`);
  if (record.父问题编号) {
    const parent = byId.get(record.父问题编号);
    assert(parent, `${record.问题编号} 存在孤儿父问题引用`);
    assert.notEqual(parent.问题编号, record.问题编号, `${record.问题编号} 自引用`);
    assert.equal(parent.需求组编号, record.需求组编号, `${record.问题编号} 与父问题不在同一需求组`);
    assert(record.追问触发条件.trim(), `${record.问题编号} 缺少追问触发条件`);
    assert.equal(record.确认状态, "待前置结论", `${record.问题编号} 初始状态错误`);
  } else {
    assert.equal(record.追问触发条件, "", `${record.问题编号} 无父问题但存在触发条件`);
    assert.equal(record.确认状态, "待确认", `${record.问题编号} 根问题初始状态错误`);
  }
}

function depthOf(record, stack = new Set()) {
  if (!record.父问题编号) return 0;
  assert(!stack.has(record.问题编号), `${record.问题编号} 存在循环依赖`);
  const next = new Set(stack);
  next.add(record.问题编号);
  return 1 + depthOf(byId.get(record.父问题编号), next);
}
records.forEach((record) => assert(depthOf(record) <= 2, `${record.问题编号} 超过二级追问`));

const blockOrder = new Map(blockLevels.map((value, index) => [value, index]));
const recordsByGroup = new Map();
for (const record of records) {
  if (!recordsByGroup.has(record.需求组编号)) recordsByGroup.set(record.需求组编号, []);
  recordsByGroup.get(record.需求组编号).push(record);
}
const groupEntries = [...recordsByGroup.entries()].map(([id, groupRecords]) => ({
  id,
  records: groupRecords,
  severity: Math.min(...groupRecords.map((record) => blockOrder.get(record.阻塞等级))),
})).sort((left, right) => left.severity - right.severity || left.id.localeCompare(right.id));

const sortedRecords = [];
for (const group of groupEntries) {
  const children = new Map();
  for (const record of group.records) {
    const parentId = record.父问题编号 || "";
    if (!children.has(parentId)) children.set(parentId, []);
    children.get(parentId).push(record);
  }
  for (const values of children.values()) values.sort((left, right) => left.问题编号.localeCompare(right.问题编号));
  const visit = (record) => {
    sortedRecords.push(record);
    for (const child of children.get(record.问题编号) ?? []) visit(child);
  };
  for (const root of children.get("") ?? []) visit(root);
}
assert.equal(sortedRecords.length, records.length, "树形排序后记录数量异常");
const positions = new Map(sortedRecords.map((record, index) => [record.问题编号, index]));
for (const record of sortedRecords) {
  if (record.父问题编号) assert(positions.get(record.父问题编号) < positions.get(record.问题编号), `${record.问题编号} 排在父问题前面`);
}
for (let index = 1; index < sortedRecords.length; index += 1) {
  const previous = sortedRecords[index - 1];
  const current = sortedRecords[index];
  const previousGroup = groupEntries.find((group) => group.id === previous.需求组编号);
  const currentGroup = groupEntries.find((group) => group.id === current.需求组编号);
  assert(previousGroup.severity <= currentGroup.severity, "需求组未按最高阻塞等级排序");
}

if (process.argv.includes("--validate-only")) {
  console.log(JSON.stringify({
    pendingRows: sortedRecords.length,
    requirementGroups: groupEntries.length,
    childQuestions: sortedRecords.filter((record) => record.父问题编号).length,
    maxDepth: Math.max(...sortedRecords.map((record) => depthOf(record))),
  }, null, 2));
  process.exit(0);
}

const rows = sortedRecords.map((record) => headers.map((header) => record[header] ?? ""));
const lastRow = rows.length + 1;
const existingTable = pendingSheet.tables.items[0];
assert(existingTable, "需求待确认工作表缺少表格");
existingTable.delete();
pendingSheet.getRange(`A1:R${lastRow}`).clear({ applyTo: "all" });
pendingSheet.getRange(`A1:R${lastRow}`).values = [headers, ...rows];

const table = pendingSheet.tables.add(`A1:R${lastRow}`, true, "PendingRequirements");
table.style = "TableStyleMedium2";
table.showHeaders = true;
table.showFilterButton = true;
table.showBandedRows = true;

const fullRange = pendingSheet.getRange(`A1:R${lastRow}`);
fullRange.format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
};
pendingSheet.getRange("A1:R1").format = {
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  rowHeightPx: 44,
  borders: { preset: "all", style: "thin", color: "#163A5A" },
};
pendingSheet.getRange(`A2:C${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`E2:F${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`H2:H${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`P2:R${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`I2:I${lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pendingSheet.getRange(`K2:K${lastRow}`).format.fill = "#EAF4EA";
pendingSheet.getRange(`L2:L${lastRow}`).format = {
  fill: "#FFF4CC",
  font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6B656" },
};

pendingSheet.getRange(`E2:E${lastRow}`).dataValidation = { rule: { type: "list", values: blockLevels } };
pendingSheet.getRange(`H2:H${lastRow}`).dataValidation = { rule: { type: "list", values: categories } };
pendingSheet.getRange(`P2:P${lastRow}`).dataValidation = { rule: { type: "list", values: owners } };
pendingSheet.getRange(`R2:R${lastRow}`).dataValidation = { rule: { type: "list", values: statuses } };

const blockRange = pendingSheet.getRange(`E2:E${lastRow}`);
blockRange.conditionalFormats.deleteAll();
blockRange.conditionalFormats.add("containsText", { text: "阻塞测试", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
blockRange.conditionalFormats.add("containsText", { text: "部分阻塞", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
blockRange.conditionalFormats.add("containsText", { text: "不阻塞", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

const statusRange = pendingSheet.getRange(`R2:R${lastRow}`);
statusRange.conditionalFormats.deleteAll();
statusRange.conditionalFormats.add("containsText", { text: "待前置结论", format: { fill: "#EEF2F7", font: { bold: true, color: "#475569" } } });
statusRange.conditionalFormats.add("containsText", { text: "确认中", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
statusRange.conditionalFormats.add("containsText", { text: "已确认", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

const widths = [15, 15, 16, 38, 14, 20, 34, 22, 44, 58, 48, 44, 52, 38, 38, 16, 20, 16];
widths.forEach((width, index) => {
  const column = String.fromCharCode(65 + index);
  pendingSheet.getRange(`${column}1`).format.columnWidth = width;
});

let previousGroup = "";
sortedRecords.forEach((record, index) => {
  const rowNumber = index + 2;
  pendingSheet.getRange(`A${rowNumber}:R${rowNumber}`).format.rowHeightPx = estimateRowHeight(rows[index], widths);
  if (record.需求组编号 !== previousGroup) {
    pendingSheet.getRange(`A${rowNumber}:R${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } };
    previousGroup = record.需求组编号;
  }
  if (record.父问题编号) {
    pendingSheet.getRange(`A${rowNumber}:D${rowNumber}`).format.fill = "#EAF2F8";
    pendingSheet.getRange(`C${rowNumber}:D${rowNumber}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#24557A" };
  } else {
    pendingSheet.getRange(`B${rowNumber}`).format.fill = "#DDEBF7";
  }
});

pendingSheet.freezePanes.freezeRows(1);
pendingSheet.freezePanes.freezeColumns(3);
pendingSheet.showGridLines = false;

assert.deepEqual(functionalSheet.getUsedRange().values, functionalBefore, "功能测试用例内容发生变化");
assert.deepEqual(functionalSheet.getUsedRange().formulas, functionalFormulasBefore, "功能测试用例公式发生变化");

const relationPreview = await workbook.render({ sheetName: "需求待确认", range: "A1:I18", scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-hierarchy-relations.png"), new Uint8Array(await relationPreview.arrayBuffer()));
const decisionPreview = await workbook.render({ sheetName: "需求待确认", range: "I1:R12", scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-hierarchy-decisions.png"), new Uint8Array(await decisionPreview.arrayBuffer()));
const functionalPreview = await workbook.render({ sheetName: "功能测试用例", range: "A1:N8", scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-functional-after-hierarchy.png"), new Uint8Array(await functionalPreview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(workbookPath);

const zip = await JSZip.loadAsync(await fs.readFile(workbookPath));
for (const sheetNumber of [1, 2]) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `缺少 ${entryName}`);
  let xml = await entry.async("string");
  const freeze = sheetNumber === 2
    ? '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'
    : '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />';
  if (/<x:pane[^>]*\/>/.test(xml)) {
    xml = xml.replace(/<x:pane[^>]*\/>/, freeze.split("<x:selection")[0]);
  } else if (/<x:sheetView([^>]*)\/>/.test(xml)) {
    xml = xml.replace(/<x:sheetView([^>]*)\/>/, `<x:sheetView$1>${freeze}</x:sheetView>`);
  } else {
    xml = xml.replace(/(<x:sheetView[^>]*>)/, `$1${freeze}`);
  }
  zip.file(entryName, xml);
}
await fs.writeFile(workbookPath, await zip.generateAsync({ type: "nodebuffer" }));

const verified = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const verifiedFunctional = verified.worksheets.getItem("功能测试用例");
const verifiedPending = verified.worksheets.getItem("需求待确认");
assert.deepEqual(verifiedFunctional.getUsedRange().values, functionalBefore, "导出后功能测试用例内容发生变化");
assert.deepEqual(
  verifiedPending.getRange(`A1:R${lastRow}`).values.map((row) => row.map((value) => value ?? "")),
  [headers, ...rows],
  "需求待确认内容与预期不一致",
);

const formulaErrors = await verified.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
assert(formulaErrors.ndjson.includes("matched 0 entries"), "工作簿存在公式错误");
try {
  await fs.rename(`${workbookPath}.inspect.ndjson`, path.join(workDir, "012-hierarchy-formula-scan.inspect.ndjson"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const finalZip = await JSZip.loadAsync(await fs.readFile(workbookPath));
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
assert(pendingTableXml.includes(`ref="A1:R${lastRow}"`), "需求待确认表格范围不正确");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
assert(pendingSheetXml.includes(`sqref="E2:E${lastRow}"`), "阻塞等级单选范围不正确");
assert(pendingSheetXml.includes(`sqref="H2:H${lastRow}"`), "问题分类单选范围不正确");
assert(pendingSheetXml.includes(`sqref="P2:P${lastRow}"`), "负责人单选范围不正确");
assert(pendingSheetXml.includes(`sqref="R2:R${lastRow}"`), "确认状态单选范围不正确");
assert(pendingSheetXml.includes('xSplit="3"'), "需求待确认未冻结左侧三个关系标识列");
assert(pendingSheetXml.includes('ySplit="1"'), "需求待确认未冻结首行");

const groupDistribution = groupEntries.reduce((result, group) => {
  const label = blockLevels[group.severity];
  result[label] = (result[label] ?? 0) + 1;
  return result;
}, {});
const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({
  workbookPath,
  casesPreserved: functionalBefore.length - 1,
  pendingRows: sortedRecords.length,
  requirementGroups: groupEntries.length,
  childQuestions: sortedRecords.filter((record) => record.父问题编号).length,
  maxDepth: Math.max(...sortedRecords.map((record) => depthOf(record))),
  groupDistribution,
  bytes: stat.size,
}, null, 2));
