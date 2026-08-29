import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import JSZip from "jszip";

const workDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(workDir, "../..");
const workbookPath = path.join(rootDir, "outputs/Luma Live-case/用户App-直播模块-260828-012.xlsx");

const categories = [
  "需求范围",
  "业务规则",
  "角色与权限",
  "流程与状态",
  "字段与数据校验",
  "计算与统计口径",
  "异常处理",
  "跨端与跨模块一致性",
  "配置和历史数据影响",
  "交互与文案规则",
];

const categoryByQuestion = new Map([
  ["Q-001", "交互与文案规则"],
  ["Q-002", "需求范围"],
  ["Q-003", "字段与数据校验"],
  ["Q-004", "字段与数据校验"],
  ["Q-005", "业务规则"],
  ["Q-006", "业务规则"],
  ["Q-007", "流程与状态"],
  ["Q-008", "交互与文案规则"],
  ["Q-009", "角色与权限"],
  ["Q-010", "业务规则"],
  ["Q-011", "业务规则"],
  ["Q-012", "业务规则"],
  ["Q-013", "业务规则"],
  ["Q-014", "异常处理"],
  ["Q-015", "需求范围"],
  ["Q-016", "业务规则"],
  ["Q-017", "字段与数据校验"],
]);

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

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const functionalSheet = workbook.worksheets.getItem("功能测试用例");
const pendingSheet = workbook.worksheets.getItem("需求待确认");

const functionalRange = functionalSheet.getUsedRange();
const functionalValuesBefore = JSON.stringify(functionalRange.values);
const functionalFormulasBefore = JSON.stringify(functionalRange.formulas);

const headers = ["问题编号", "功能模块", "功能结构", "问题分类", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态"];
const currentRows = pendingSheet.getUsedRange().values;
const currentDataRows = currentRows[0][3] === "问题分类"
  ? currentRows.slice(1)
  : currentRows.slice(1).map((row) => [row[0], row[1], row[2], categoryByQuestion.get(row[0]), row[3], row[4], row[5], row[6], row[7]]);
const editedRows = [
  headers,
  ...currentDataRows,
];
editedRows.slice(1).forEach((row) => {
  const category = categoryByQuestion.get(row[0]);
  assert(category, `${row[0]} 缺少问题分类`);
  assert.equal(row[3], category, `${row[0]} 的问题分类与分类表不一致`);
  assert(categories.includes(category), `${row[0]} 使用了无效问题分类`);
});
assert.equal(categoryByQuestion.size, editedRows.length - 1, "问题分类数量与待确认记录数量不一致");

const originalLastRow = currentRows.length;
const lastRow = editedRows.length;
const clearLastRow = Math.max(originalLastRow, lastRow);

const existingTable = pendingSheet.tables.items[0];
assert(existingTable, "需求待确认工作表缺少表格");
existingTable.delete();

pendingSheet.getRange(`A2:I${clearLastRow}`).dataValidation = null;
pendingSheet.getRange(`H2:H${clearLastRow}`).dataValidation = null;
pendingSheet.getRange(`A1:I${lastRow}`).values = editedRows;

const table = pendingSheet.tables.add(`A1:I${lastRow}`, true, "PendingRequirements");
table.style = "TableStyleMedium2";
table.showHeaders = true;
table.showFilterButton = true;
table.showBandedRows = true;

const fullRange = pendingSheet.getRange(`A1:I${lastRow}`);
fullRange.format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
};
pendingSheet.getRange("A1:I1").format = {
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  rowHeightPx: 40,
  borders: { preset: "all", style: "thin", color: "#163A5A" },
};

pendingSheet.getRange(`D2:D${lastRow}`).dataValidation = {
  rule: { type: "list", values: categories },
  errorAlert: {
    style: "stop",
    title: "请选择问题分类",
    message: "请从下拉列表中选择问题分类。",
  },
};
pendingSheet.getRange(`I2:I${lastRow}`).dataValidation = {
  rule: { type: "list", values: ["待确认", "已确认", "无需处理"] },
};

const widths = [14, 20, 28, 24, 52, 58, 48, 38, 14];
widths.forEach((width, index) => {
  const column = String.fromCharCode(65 + index);
  pendingSheet.getRange(`${column}1`).format.columnWidth = width;
});
editedRows.slice(1).forEach((row, index) => {
  pendingSheet.getRange(`A${index + 2}:I${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths);
});
pendingSheet.freezePanes.freezeRows(1);
pendingSheet.showGridLines = false;

assert.equal(JSON.stringify(functionalRange.values), functionalValuesBefore, "功能测试用例内容发生变化");
assert.equal(JSON.stringify(functionalRange.formulas), functionalFormulasBefore, "功能测试用例公式发生变化");

const pendingPreview = await workbook.render({ sheetName: "需求待确认", range: `A14:I${lastRow}`, scale: 1.5, format: "png" });
await fs.writeFile(path.join(workDir, "preview-pending-categories.png"), new Uint8Array(await pendingPreview.arrayBuffer()));
const functionalPreview = await workbook.render({ sheetName: "功能测试用例", range: "A1:O6", scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-functional-unchanged.png"), new Uint8Array(await functionalPreview.arrayBuffer()));

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
const verifiedFunctional = verified.worksheets.getItem("功能测试用例").getUsedRange();
assert.equal(JSON.stringify(verifiedFunctional.values), functionalValuesBefore, "导出后功能测试用例内容发生变化");
assert.equal(JSON.stringify(verifiedFunctional.formulas), functionalFormulasBefore, "导出后功能测试用例公式发生变化");

const verifiedPending = verified.worksheets.getItem("需求待确认");
assert.deepEqual(verifiedPending.getRange(`A1:I${lastRow}`).values, editedRows, "需求待确认内容与预期不一致");
const formulaErrors = await verified.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
assert(formulaErrors.ndjson.includes("matched 0 entries"), "工作簿存在公式错误");

const finalZip = await JSZip.loadAsync(await fs.readFile(workbookPath));
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
assert(pendingTableXml.includes(`ref="A1:I${lastRow}"`), "需求待确认表格范围不正确");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
assert(pendingSheetXml.includes("dataValidation"), "问题分类单选校验未写入工作簿");
assert(pendingSheetXml.includes(`sqref="D2:D${lastRow}"`), "问题分类单选校验范围不正确");
assert(pendingSheetXml.includes(categories.join(",")), "问题分类单选项不完整");
assert(!pendingSheetXml.includes(`sqref="H2:H${lastRow}"`), "原确认状态校验残留在影响用例列");
assert(pendingSheetXml.includes('state="frozen"'), "需求待确认首行未冻结");

const distribution = editedRows.slice(1).reduce((result, row) => {
  result[row[3]] = (result[row[3]] ?? 0) + 1;
  return result;
}, {});
const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({ workbookPath, casesUnchanged: functionalRange.values.length - 1, pending: lastRow - 1, columns: 9, distribution, bytes: stat.size }, null, 2));
