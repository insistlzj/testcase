import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

process.on("uncaughtException", (error) => {
  console.error(`OPTIMIZE_ERROR: ${error.name}: ${error.message}`);
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.error(`OPTIMIZE_ERROR: ${error?.name ?? "Error"}: ${error?.message ?? String(error)}`);
  process.exit(1);
});

const workbookPath = "/Users/geekonup/testcase/outputs/Luma Live-case/用户App-直播模块-260828-012.xlsx";
const workDir = "/Users/geekonup/testcase/work/liveshow-user-live-testcases";
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260828.json");

const oldHeaders = [
  "问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类",
  "待决策问题", "可选方案", "测试建议", "产品结论", "已知依据", "影响范围", "影响用例", "负责人",
  "期望确认时间", "确认状态",
];
const headers = [
  "问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类",
  "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号",
  "确认后待补用例", "负责人", "期望确认时间", "确认状态",
];
const blockLevels = ["阻塞测试", "部分阻塞", "不阻塞"];
const categories = [
  "需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理",
  "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则",
];
const conclusions = ["A", "B", "C", "D", "其他"];
const owners = ["产品", "交互", "技术", "多方确认"];
const statuses = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"];

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

function addValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = { rule: { type: "list", values } };
}

function setOrReplaceAttribute(tag, name, value) {
  const pattern = new RegExp(`\\s${name}="[^"]*"`);
  if (pattern.test(tag)) return tag.replace(pattern, ` ${name}="${value}"`);
  if (/\s*\/>$/.test(tag)) return tag.replace(/\s*\/>$/, ` ${name}="${value}" />`);
  return tag.replace(/>$/, ` ${name}="${value}">`);
}

function patchRowAttributes(xml, rowNumber, attributes) {
  const pattern = new RegExp(`<x:row\\s+([^>]*\\br="${rowNumber}"[^>]*)>`);
  return xml.replace(pattern, (tag) => Object.entries(attributes).reduce(
    (updated, [name, value]) => setOrReplaceAttribute(updated, name, value),
    tag,
  ));
}

function patchColumnHidden(xml, columnNumber) {
  const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${columnNumber}"[^>]*\\bmax="${columnNumber}"[^>]*/>`);
  return xml.replace(pattern, (tag) => setOrReplaceAttribute(tag, "hidden", "1"));
}

function patchFreeze(xml, freeze) {
  if (/<x:pane[^>]*\/>/.test(xml)) {
    return xml.replace(/<x:pane[^>]*\/>/, freeze.split("<x:selection")[0]);
  }
  if (/<x:sheetView([^>]*)\/>/.test(xml)) {
    return xml.replace(/<x:sheetView([^>]*)\/>/, `<x:sheetView$1>${freeze}</x:sheetView>`);
  }
  return xml.replace(/(<x:sheetView[^>]*>)/, `$1${freeze}`);
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const functionalSheet = workbook.worksheets.getItem("功能测试用例");
const pendingSheet = workbook.worksheets.getItem("需求待确认");

if (process.argv.includes("--verify-existing")) {
  const sheetNames = workbook.worksheets.items.map((sheet) => sheet.name);
  assert.deepEqual(sheetNames, ["功能测试用例", "需求待确认", "产品决策概览"], "工作表结构异常");
  const functionalValues = functionalSheet.getUsedRange().values;
  const pendingValues = pendingSheet.getUsedRange().values;
  const overviewValues = workbook.worksheets.getItem("产品决策概览").getUsedRange().values;
  assert.equal(functionalValues.length - 1, 214, "功能测试用例数量异常");
  assert.equal(pendingValues.length - 1, 67, "需求待确认数量异常");
  assert.deepEqual(pendingValues[0], headers, "需求待确认字段结构异常");
  assert.equal(overviewValues[4][0], 67, "概览问题总数异常");
  assert.equal(overviewValues[4][2], 56, "概览当前可回答数量异常");
  assert.equal(overviewValues[4][4], 11, "概览待前置结论数量异常");
  assert.equal(overviewValues[8][7], 11, "概览追问子问题数量异常");
  const existingRecords = pendingValues.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
  const existingById = new Map(existingRecords.map((record) => [record.问题编号, record]));
  const existingDepth = (record, stack = new Set()) => {
    if (!record.父问题编号) return 0;
    assert(!stack.has(record.问题编号), `${record.问题编号} 存在循环依赖`);
    const parent = existingById.get(record.父问题编号);
    assert(parent, `${record.问题编号} 存在孤儿父问题引用`);
    const next = new Set(stack);
    next.add(record.问题编号);
    return 1 + existingDepth(parent, next);
  };
  existingRecords.forEach((record, index) => {
    assert(record.产品结论 === "", `${record.问题编号} 初次产品结论不为空`);
    assert(record.结论补充 === "", `${record.问题编号} 初次结论补充不为空`);
    if (record.父问题编号) {
      assert(existingRecords.findIndex((item) => item.问题编号 === record.父问题编号) < index, `${record.问题编号} 排在父问题前面`);
      assert.equal(record.确认状态, "待前置结论", `${record.问题编号} 子问题状态异常`);
    }
    assert(existingDepth(record) <= 2, `${record.问题编号} 超过二级追问`);
  });

  const existingInspection = {
    sheets: (await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 8000, tableMaxRows: 3, tableMaxCols: 20, tableMaxCellChars: 120 })).ndjson,
    pending: (await workbook.inspect({ kind: "region", sheetId: "需求待确认", range: "A1:T6", maxChars: 16000 })).ndjson,
    overview: (await workbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
    formulas: (await workbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
    formulaErrors: (await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "formula error scan" })).ndjson,
  };
  await fs.writeFile(path.join(workDir, "012-product-view-inspection.json"), `${JSON.stringify(existingInspection, null, 2)}\n`, "utf8");
  for (const [sheetName, range, fileName] of [
    ["产品决策概览", "A1:H14", "preview-012-product-overview.png"],
    ["需求待确认", "A1:M12", "preview-012-product-pending.png"],
    ["功能测试用例", "A1:O8", "preview-012-product-functional.png"],
  ]) {
    const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
    await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
  }

  const existingZip = await JSZip.loadAsync(await fs.readFile(workbookPath));
  const tableXml = await existingZip.file("xl/tables/table2.xml").async("string");
  const sheet2Xml = await existingZip.file("xl/worksheets/sheet2.xml").async("string");
  const workbookXml = await existingZip.file("xl/workbook.xml").async("string");
  assert(tableXml.includes("ref=\"A1:T68\""), "需求待确认表格范围异常");
  assert((tableXml.match(/<x:tableColumn /g) ?? []).length === 20, "需求待确认列数异常");
  assert((sheet2Xml.match(/hidden="1" outlineLevel="[12]"/g) ?? []).length === 11, "折叠子问题数量异常");
  [6, 8, 14, 15, 16, 17].forEach((column) => assert(new RegExp(`<x:col[^>]*min="${column}"[^>]*hidden="1"`).test(sheet2Xml), `第 ${column} 列未隐藏`));
  assert(workbookXml.includes('activeTab="2"'), "工作簿默认页异常");

  const splitLines = (value) => String(value ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const splitNumbered = (value) => splitLines(value).map((item) => item.replace(/^\d+\.\s*/, ""));
  const payload = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  assert.equal(payload.测试用例.length, 214, "JSON 功能测试用例数量异常");
  payload.需求待确认 = existingRecords.map((record) => Object.fromEntries(headers.map((header) => {
    if (header === "可选方案") return [header, splitLines(record[header])];
    if (["已知依据", "影响范围", "已有用例编号", "确认后待补用例"].includes(header)) return [header, splitNumbered(record[header])];
    return [header, record[header] ?? ""];
  })));
  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    workbookPath,
    jsonPath,
    sheets: sheetNames,
    casesPreserved: functionalValues.length - 1,
    decisions: existingRecords.length,
    requirementGroups: new Set(existingRecords.map((record) => record.需求组编号)).size,
    collapsedChildren: existingRecords.filter((record) => record.父问题编号).length,
  }, null, 2));
  process.exit(0);
}

assert.deepEqual(workbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认"], "012 工作簿不再是待升级的两表结构");

const functionalBefore = functionalSheet.getUsedRange().values;
const functionalFormulasBefore = functionalSheet.getUsedRange().formulas;
const pendingBefore = pendingSheet.getUsedRange().values;
assert.equal(functionalBefore.length - 1, 214, "功能测试用例数量不是 214，停止编辑");
assert.equal(pendingBefore.length - 1, 67, "需求待确认数量不是 67，停止编辑");
assert.deepEqual(pendingBefore[0], oldHeaders, "需求待确认不是 18 字段结构，停止编辑");

const records = pendingBefore.slice(1).map((row) => Object.fromEntries(headers.map((header) => {
  if (header === "结论补充") return [header, ""];
  const oldIndex = oldHeaders.indexOf(header);
  return [header, row[oldIndex] ?? ""];
})));
const byId = new Map(records.map((record) => [record.问题编号, record]));
assert.equal(byId.size, records.length, "存在重复问题编号");

function depthOf(record, stack = new Set()) {
  if (!record.父问题编号) return 0;
  assert(!stack.has(record.问题编号), `${record.问题编号} 存在循环依赖`);
  const parent = byId.get(record.父问题编号);
  assert(parent, `${record.问题编号} 存在孤儿父问题引用`);
  const next = new Set(stack);
  next.add(record.问题编号);
  return 1 + depthOf(parent, next);
}

const positions = new Map(records.map((record, index) => [record.问题编号, index]));
for (const record of records) {
  assert(blockLevels.includes(record.阻塞等级), `${record.问题编号} 阻塞等级无效`);
  assert(categories.includes(record.问题分类), `${record.问题编号} 问题分类无效`);
  assert(record.产品结论 === "", `${record.问题编号} 初次产品结论不为空`);
  assert(record.结论补充 === "", `${record.问题编号} 初次结论补充不为空`);
  assert(owners.includes(record.负责人), `${record.问题编号} 负责人无效`);
  assert(statuses.includes(record.确认状态), `${record.问题编号} 确认状态无效`);
  if (record.父问题编号) {
    assert(positions.get(record.父问题编号) < positions.get(record.问题编号), `${record.问题编号} 排在父问题前面`);
    assert.equal(record.确认状态, "待前置结论", `${record.问题编号} 子问题状态错误`);
    assert(String(record.追问触发条件).trim(), `${record.问题编号} 缺少追问触发条件`);
  }
  assert(depthOf(record) <= 2, `${record.问题编号} 超过二级追问`);
}

const rows = records.map((record) => headers.map((header) => record[header] ?? ""));
const lastRow = rows.length + 1;
const existingTable = pendingSheet.tables.items[0];
assert(existingTable, "需求待确认缺少表格");
existingTable.delete();
pendingSheet.getRange(`A1:S${lastRow}`).clear({ applyTo: "all" });
pendingSheet.getRange(`A1:S${lastRow}`).values = [headers, ...rows];

const pendingTable = pendingSheet.tables.add(`A1:S${lastRow}`, true, "PendingRequirements");
pendingTable.style = "TableStyleMedium2";
pendingTable.showHeaders = true;
pendingTable.showFilterButton = true;
pendingTable.showBandedRows = true;

const pendingRange = pendingSheet.getRange(`A1:S${lastRow}`);
pendingRange.format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
};
pendingSheet.getRange("A1:S1").format = {
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
pendingSheet.getRange(`Q2:S${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`I2:I${lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pendingSheet.getRange(`K2:K${lastRow}`).format.fill = "#EAF4EA";
pendingSheet.getRange(`L2:M${lastRow}`).format = {
  fill: "#FFF4CC",
  font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6B656" },
};

addValidation(pendingSheet, `E2:E${lastRow}`, blockLevels);
addValidation(pendingSheet, `H2:H${lastRow}`, categories);
addValidation(pendingSheet, `L2:L${lastRow}`, conclusions);
addValidation(pendingSheet, `Q2:Q${lastRow}`, owners);
addValidation(pendingSheet, `S2:S${lastRow}`, statuses);

const blockRange = pendingSheet.getRange(`E2:E${lastRow}`);
blockRange.conditionalFormats.deleteAll();
blockRange.conditionalFormats.add("containsText", { text: "阻塞测试", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
blockRange.conditionalFormats.add("containsText", { text: "部分阻塞", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
blockRange.conditionalFormats.add("containsText", { text: "不阻塞", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

const statusRange = pendingSheet.getRange(`S2:S${lastRow}`);
statusRange.conditionalFormats.deleteAll();
statusRange.conditionalFormats.add("containsText", { text: "待前置结论", format: { fill: "#EEF2F7", font: { bold: true, color: "#475569" } } });
statusRange.conditionalFormats.add("containsText", { text: "确认中", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
statusRange.conditionalFormats.add("containsText", { text: "已确认", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

const widths = [15, 15, 16, 38, 14, 20, 34, 22, 44, 58, 48, 15, 34, 52, 38, 38, 16, 20, 16];
widths.forEach((width, index) => {
  const column = String.fromCharCode(65 + index);
  pendingSheet.getRange(`${column}1`).format.columnWidth = width;
});

let previousGroup = "";
records.forEach((record, index) => {
  const rowNumber = index + 2;
  pendingSheet.getRange(`A${rowNumber}:S${rowNumber}`).format.rowHeightPx = estimateRowHeight(rows[index], widths);
  if (record.需求组编号 !== previousGroup) {
    pendingSheet.getRange(`A${rowNumber}:S${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } };
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

const overview = workbook.worksheets.add("产品决策概览");
overview.showGridLines = false;
overview.mergeCells("A1:H1");
overview.getRange("A1").values = [["产品决策概览"]];
overview.getRange("A1:H1").format = {
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  rowHeightPx: 52,
};
overview.mergeCells("A2:H2");
overview.getRange("A2").values = [["决策明细以“需求待确认”为准；产品选择 A/B/C/D/其他，选择“其他”时填写结论补充。"]];
overview.getRange("A2:H2").format = {
  fill: "#EAF2F8",
  font: { name: "Microsoft YaHei", size: 10, color: "#334155" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  rowHeightPx: 34,
};

overview.getRange("A4:H4").values = [["问题总数", "", "当前可回答", "", "待前置结论", "", "已确认", ""]];
overview.getRange("A5:H5").values = [["", "", "", "", "", "", "", ""]];
for (const range of ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]) {
  overview.getRange(range).format = {
    fill: "#DDEBF7",
    font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "all", style: "thin", color: "#B8C7D5" },
    rowHeightPx: 30,
  };
}
for (const range of ["A5:B5", "C5:D5", "E5:F5", "G5:H5"]) {
  overview.getRange(range).format = {
    fill: "#FFFFFF",
    font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "all", style: "thin", color: "#B8C7D5" },
    rowHeightPx: 42,
  };
}
overview.mergeCells("A4:B4");
overview.mergeCells("A5:B5");
overview.mergeCells("C4:D4");
overview.mergeCells("C5:D5");
overview.mergeCells("E4:F4");
overview.mergeCells("E5:F5");
overview.mergeCells("G4:H4");
overview.mergeCells("G5:H5");
overview.getRange("A5").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${lastRow})`]];
overview.getRange("C5").formulas = [[`=COUNTIF('需求待确认'!$S$2:$S$${lastRow},"待确认")`]];
overview.getRange("E5").formulas = [[`=COUNTIF('需求待确认'!$S$2:$S$${lastRow},"待前置结论")`]];
overview.getRange("G5").formulas = [[`=COUNTIF('需求待确认'!$S$2:$S$${lastRow},"已确认")`]];

overview.getRange("A7:H7").values = [["按状态", "数量", "按阻塞等级", "待确认", "按负责人", "待确认", "结构检查", "数量"]];
overview.getRange("A7:H7").format = {
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#163A5A" },
  rowHeightPx: 32,
};
overview.getRange("A8:A12").values = statuses.map((status) => [status]);
overview.getRange("C8:C10").values = blockLevels.map((level) => [level]);
overview.getRange("E8:E11").values = owners.map((owner) => [owner]);
overview.getRange("G8:G11").values = [["需求组"], ["追问子问题"], ["未填写产品结论"], ["选其他但未补充"]];
statuses.forEach((status, index) => {
  overview.getRange(`B${index + 8}`).formulas = [[`=COUNTIF('需求待确认'!$S$2:$S$${lastRow},"${status}")`]];
});
blockLevels.forEach((level, index) => {
  overview.getRange(`D${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$E$2:$E$${lastRow},"${level}",'需求待确认'!$S$2:$S$${lastRow},"待确认")`]];
});
owners.forEach((owner, index) => {
  overview.getRange(`F${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$Q$2:$Q$${lastRow},"${owner}",'需求待确认'!$S$2:$S$${lastRow},"待确认")`]];
});
overview.getRange("H8").values = [[new Set(records.map((record) => record.需求组编号)).size]];
overview.getRange("H9").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${lastRow})-COUNTBLANK('需求待确认'!$C$2:$C$${lastRow})`]];
overview.getRange("H10").formulas = [[`=COUNTBLANK('需求待确认'!$L$2:$L$${lastRow})`]];
overview.getRange("H11").formulas = [[`=COUNTIFS('需求待确认'!$L$2:$L$${lastRow},"其他",'需求待确认'!$M$2:$M$${lastRow},"")`]];

overview.getRange("A8:H12").format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
  rowHeightPx: 31,
};
overview.getRange("A8:A12").format.horizontalAlignment = "left";
overview.getRange("C8:C10").format.horizontalAlignment = "left";
overview.getRange("E8:E11").format.horizontalAlignment = "left";
overview.getRange("G8:G11").format.horizontalAlignment = "left";
overview.getRange("B8:B12").format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.getRange("D8:D10").format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.getRange("F8:F11").format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.getRange("H8:H11").format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A14:H14");
overview.getRange("A14").values = [["处理顺序：先回答当前可回答的问题；展开父问题左侧分级按钮后，再处理由该结论触发的追问。"]];
overview.getRange("A14:H14").format = {
  fill: "#F8FAFC",
  font: { name: "Microsoft YaHei", size: 10, color: "#475569" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  rowHeightPx: 34,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
};
[22, 11, 22, 11, 22, 11, 24, 11].forEach((width, index) => {
  overview.getRange(`${String.fromCharCode(65 + index)}1`).format.columnWidth = width;
});
overview.freezePanes.freezeRows(2);

assert.deepEqual(functionalSheet.getUsedRange().values, functionalBefore, "功能测试用例内容发生变化");
assert.deepEqual(functionalSheet.getUsedRange().formulas, functionalFormulasBefore, "功能测试用例公式发生变化");

const inspections = {};
inspections.sheets = (await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 8000, tableMaxRows: 3, tableMaxCols: 19, tableMaxCellChars: 120 })).ndjson;
inspections.pending = (await workbook.inspect({ kind: "region", sheetId: "需求待确认", range: "A1:S6", maxChars: 16000 })).ndjson;
inspections.overview = (await workbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson;
inspections.formulas = (await workbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson;
inspections.formulaErrors = (await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "formula error scan" })).ndjson;
await fs.writeFile(path.join(workDir, "012-product-view-inspection.json"), `${JSON.stringify(inspections, null, 2)}\n`, "utf8");

for (const [sheetName, range, fileName] of [
  ["产品决策概览", "A1:H14", "preview-012-product-overview.png"],
  ["需求待确认", "A1:M12", "preview-012-product-pending.png"],
  ["功能测试用例", "A1:O8", "preview-012-product-functional.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(workbookPath);

const zip = await JSZip.loadAsync(await fs.readFile(workbookPath));
for (const [sheetNumber, freeze] of [
  [1, '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />'],
  [2, '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'],
  [3, '<x:pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A3" sqref="A3" />'],
]) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `缺少 ${entryName}`);
  let xml = patchFreeze(await entry.async("string"), freeze);
  assert(xml.includes('state="frozen"'), `${entryName} 冻结窗格失败`);
  if (sheetNumber === 2) {
    if (!/<x:sheetPr>/.test(xml)) xml = xml.replace(/(<x:sheetViews>)/, '<x:sheetPr><x:outlinePr summaryBelow="0" summaryRight="1" /></x:sheetPr>$1');
    else if (!/<x:outlinePr/.test(xml)) xml = xml.replace(/(<x:sheetPr>)/, '$1<x:outlinePr summaryBelow="0" summaryRight="1" />');
    [6, 8, 14, 15, 16].forEach((column) => { xml = patchColumnHidden(xml, column); });
    const parentIds = new Set(records.filter((record) => record.父问题编号).map((record) => record.父问题编号));
    records.forEach((record, index) => {
      const rowNumber = index + 2;
      const depth = depthOf(record);
      const attributes = {};
      if (depth > 0) {
        attributes.hidden = "1";
        attributes.outlineLevel = String(depth);
      }
      if (parentIds.has(record.问题编号)) attributes.collapsed = "1";
      if (Object.keys(attributes).length > 0) xml = patchRowAttributes(xml, rowNumber, attributes);
    });
    xml = xml.replace(/<x:sheetFormatPr([^>]*)\/>/, (tag) => setOrReplaceAttribute(tag, "outlineLevelRow", "2"));
    [6, 8, 14, 15, 16].forEach((column) => assert(new RegExp(`<x:col[^>]*min="${column}"[^>]*hidden="1"`).test(xml), `第 ${column} 列未默认隐藏`));
    records.forEach((record, index) => {
      if (!record.父问题编号) return;
      const rowNumber = index + 2;
      assert(new RegExp(`<x:row[^>]*r="${rowNumber}"[^>]*hidden="1"[^>]*outlineLevel="${depthOf(record)}"`).test(xml), `${record.问题编号} 未折叠`);
    });
  }
  zip.file(entryName, xml);
}

const workbookEntry = zip.file("xl/workbook.xml");
assert(workbookEntry, "缺少 xl/workbook.xml");
let workbookXml = await workbookEntry.async("string");
if (/<x:workbookView[^>]*\/>/.test(workbookXml)) {
  workbookXml = workbookXml.replace(/<x:workbookView[^>]*\/>/, '<x:workbookView activeTab="2" />');
} else if (/<x:bookViews>/.test(workbookXml)) {
  workbookXml = workbookXml.replace(/<x:bookViews>/, '<x:bookViews><x:workbookView activeTab="2" />');
} else {
  workbookXml = workbookXml.replace(/(<x:sheets>)/, '<x:bookViews><x:workbookView activeTab="2" /></x:bookViews>$1');
}
if (!/<x:calcPr/.test(workbookXml)) workbookXml = workbookXml.replace(/<\/x:workbook>/, '<x:calcPr calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>');
assert(workbookXml.includes('activeTab="2"'), "默认工作表不是产品决策概览");
zip.file("xl/workbook.xml", workbookXml);
await fs.writeFile(workbookPath, await zip.generateAsync({ type: "nodebuffer" }));

const verifiedWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
assert.deepEqual(verifiedWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"], "工作表结构异常");
assert.deepEqual(verifiedWorkbook.worksheets.getItem("功能测试用例").getUsedRange().values, functionalBefore, "导出后功能用例发生变化");
assert.deepEqual(verifiedWorkbook.worksheets.getItem("需求待确认").getUsedRange().values, [headers, ...rows], "导出后待确认内容异常");

const finalZip = await JSZip.loadAsync(await fs.readFile(workbookPath));
const tableXml = await finalZip.file("xl/tables/table2.xml").async("string");
const sheet2Xml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
const finalWorkbookXml = await finalZip.file("xl/workbook.xml").async("string");
assert(tableXml.includes(`ref="A1:S${lastRow}"`), "需求待确认表格范围异常");
assert((tableXml.match(/<x:tableColumn /g) ?? []).length === 19, "需求待确认表格列数异常");
assert(sheet2Xml.includes('xSplit="3"') && sheet2Xml.includes('ySplit="1"'), "需求待确认冻结窗格异常");
assert((sheet2Xml.match(/hidden="1" outlineLevel="[12]"/g) ?? []).length === 23, "子问题折叠数量异常");
assert(finalWorkbookXml.includes('activeTab="2"'), "工作簿默认页异常");

const splitLines = (value) => String(value ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
const splitNumbered = (value) => splitLines(value).map((item) => item.replace(/^\d+\.\s*/, ""));
const payload = JSON.parse(await fs.readFile(jsonPath, "utf8"));
assert.equal(payload.测试用例.length, 214, "JSON 功能测试用例数量异常");
payload.需求待确认 = records.map((record) => Object.fromEntries(headers.map((header) => {
  if (header === "可选方案") return [header, splitLines(record[header])];
  if (["已知依据", "影响范围", "影响用例"].includes(header)) return [header, splitNumbered(record[header])];
  return [header, record[header] ?? ""];
})));
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
const verifiedPayload = JSON.parse(await fs.readFile(jsonPath, "utf8"));
assert.equal(verifiedPayload.需求待确认.length, 67, "JSON 需求待确认数量异常");
assert.deepEqual(Object.keys(verifiedPayload.需求待确认[0]), headers, "JSON 待确认字段顺序异常");

const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({
  workbookPath,
  jsonPath,
  sheets: verifiedWorkbook.worksheets.items.map((sheet) => sheet.name),
  casesPreserved: functionalBefore.length - 1,
  decisions: records.length,
  requirementGroups: new Set(records.map((record) => record.需求组编号)).size,
  collapsedChildren: records.filter((record) => record.父问题编号).length,
  hiddenDetailColumns: ["功能模块", "问题分类", "已知依据", "影响范围", "影响用例"],
  bytes: stat.size,
}, null, 2));
