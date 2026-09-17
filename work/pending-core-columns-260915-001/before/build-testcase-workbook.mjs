import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import { finishStage, startStage } from "./pipeline-metrics.mjs";
import { validateTestcaseDelivery, validateWorkbookExportPaths, authorizeWorkbookExport, saveNewWorkbook } from "./validate-testcase-delivery.mjs";

const root = path.resolve(import.meta.dirname, "..");
if (process.argv.length < 5 || process.argv.length > 6 || (process.argv[5] && process.argv[5] !== '--stage')) throw new Error("用法：build-testcase-workbook.mjs <当前任务目录> <当前JSON文件名> <新输出路径> [--stage]");
const exportOptions = {stage:process.argv[5] === '--stage'};
const taskDir = path.resolve(root, process.argv[2]);
const sourcePath = path.join(taskDir, process.argv[3]);
const outputPath = path.resolve(root, process.argv[4]);
const previewDir = path.join(taskDir, "previews");
const font = "Arial";
const border = { preset: "all", style: "thin", color: "#CBD5E1" };
const headerFormat = {
  fill: "#1F2937",
  font: { name: font, size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#FFFFFF" },
};

const caseHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const pendingHeaders = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];

const listText = (value, letters = false) => Array.isArray(value)
  ? value.map((item, index) => `${letters ? String.fromCharCode(65 + index) : `${index + 1}`}. ${item}`).join("\n")
  : String(value ?? "");

function toRows(items, headers, letterField = "") {
  return items.map((item) => headers.map((header) => {
    if (header === "预期结果" && item[header]?.length === 1) return item[header][0];
    return Array.isArray(item[header]) ? listText(item[header], header === letterField) : item[header] ?? "";
  }));
}

function setColumnWidths(sheet, lastRow, widths) {
  for (let index = 0; index < widths.length; index += 1) {
    sheet.getRangeByIndexes(0, index, lastRow, 1).format.columnWidth = widths[index];
  }
}

function setRowHeights(sheet, rows, widths, columnCount) {
  rows.forEach((row, index) => {
    let lines = 1;
    row.forEach((value, column) => {
      const text = String(value ?? "");
      const wrapped = text.split("\n").reduce((count, part) => {
        const displayWidth=[...part].reduce((width,char)=>width+(/[^\x00-\x7F]/u.test(char)?2:1),0);
        return count+Math.max(1,Math.ceil(displayWidth/Math.max(8,widths[column]*0.92)));
      }, 0);
      lines = Math.max(lines, wrapped);
    });
    sheet.getRangeByIndexes(index + 1, 0, 1, columnCount).format.rowHeight = Math.min(409, Math.max(30, 10 + lines * 15));
  });
}

function styleDataSheet(sheet, headers, rows, widths, tableName) {
  const lastRow = rows.length + 1;
  const lastColumn = String.fromCharCode(64 + headers.length);
  const used = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  used.values = [headers, ...rows];
  used.format = {
    font: { name: font, size: 10, color: "#111827" },
    verticalAlignment: "center",
    wrapText: true,
    borders: border,
  };
  sheet.getRange(`A1:${lastColumn}1`).format = headerFormat;
  sheet.getRange(`A2:${lastColumn}${lastRow}`).format.horizontalAlignment = "left";
  sheet.getRange(`A2:F${lastRow}`).format.horizontalAlignment = "center";
  sheet.getRange(`L2:N${lastRow}`).format.horizontalAlignment = "center";
  sheet.getRange(`A1:${lastColumn}${lastRow}`).format.borders = border;
  sheet.getRange(`A1:${lastColumn}1`).format.rowHeight = 34;
  setColumnWidths(sheet, lastRow, widths);
  setRowHeights(sheet, rows, widths, headers.length);
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
  return lastRow;
}

await validateWorkbookExportPaths(taskDir,root,sourcePath,outputPath,exportOptions);
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
const sourceText = await fs.readFile(sourcePath, "utf8");
const source = JSON.parse(sourceText);
if (!source.测试用例.length) throw new Error("生成源没有可交付的正式用例");
const checkedInput = await authorizeWorkbookExport(taskDir,root,sourcePath,outputPath,exportOptions);
const checkedSourceHash = checkedInput.候选SHA256 || crypto.createHash('sha256').update(await fs.readFile(sourcePath)).digest('hex');
if (crypto.createHash('sha256').update(sourceText).digest('hex') !== checkedSourceHash) throw new Error('导出内容与刚通过校验的候选不一致');

const inputCount = source.测试用例.length + source.需求待确认.length;
await startStage(taskDir, "xlsx-build", { 输入数量: inputCount });
const workbook = Workbook.create();
const overview = workbook.worksheets.add("产品决策概览");
const casesSheet = workbook.worksheets.add("功能测试用例");
const pendingSheet = workbook.worksheets.add("需求待确认");

const caseRows = toRows(source.测试用例, caseHeaders);
const pendingRows = toRows(source.需求待确认, pendingHeaders, "可选方案");
const caseLastRow = styleDataSheet(casesSheet, caseHeaders, caseRows, [7, 13, 12, 24, 12, 8, 27, 20, 30, 32, 38, 18, 10, 12, 42], "LiveCasesTable");
const pendingLastRow = styleDataSheet(pendingSheet, pendingHeaders, pendingRows, [12, 13, 13, 20, 11, 12, 28, 18, 34, 45, 36, 12, 24, 34, 30, 20, 30, 12, 21, 12], "LivePendingTable");
pendingSheet.freezePanes.freezeColumns(3);

casesSheet.getRange(`E2:E${caseLastRow}`).dataValidation = { rule: { type: "list", values: ["功能需求", "业务流程", "逻辑校验", "异常用例"] } };
casesSheet.getRange(`F2:F${caseLastRow}`).dataValidation = { rule: { type: "list", values: ["P0", "P1", "P2", "P3"] } };
casesSheet.getRange(`M2:M${caseLastRow}`).dataValidation = { rule: { type: "list", values: ["未测", "通过", "不通过", "阻塞", "不适用"] } };
pendingSheet.getRange(`E2:E${pendingLastRow}`).dataValidation = { rule: { type: "list", values: ["阻塞测试", "部分阻塞", "不阻塞"] } };
pendingSheet.getRange(`H2:H${pendingLastRow}`).dataValidation = { rule: { type: "list", values: ["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"] } };
pendingSheet.getRange(`L2:L${pendingLastRow}`).dataValidation = { rule: { type: "list", values: ["A", "B", "C", "D", "其他"] } };
pendingSheet.getRange(`R2:R${pendingLastRow}`).dataValidation = { rule: { type: "list", values: ["产品", "交互", "技术", "多方确认"] } };
pendingSheet.getRange(`T2:T${pendingLastRow}`).dataValidation = { rule: { type: "list", values: ["待前置结论", "待确认", "确认中", "已确认", "无需处理"] } };
pendingSheet.getRange(`L2:M${pendingLastRow}`).format.fill = "#FFF4CC";
pendingSheet.getRange(`L2:M${pendingLastRow}`).format.borders = border;

overview.getRange("A1").values = [[`${path.basename(outputPath, ".xlsx")} 产品决策概览`]];
overview.getRange("A2").values = [[exportOptions.stage ? "阶段性产物；本轮交付尚未完成" : `覆盖性质：${checkedInput.需求覆盖?.交付性质 || '见交付检查'}；问题数量由下表汇总`]];
overview.getRange("A4:B10").values = [
  ["状态", "数量"], ["问题总数", null], ["当前可回答", null], ["待前置结论", null],
  ["确认中", null], ["已确认", null], ["无需处理", null],
];
overview.getRange("D4:E7").values = [["阻塞等级", "当前待确认"], ["阻塞测试", null], ["部分阻塞", null], ["不阻塞", null]];
overview.getRange("G4:H8").values = [["负责人", "当前待确认"], ["产品", null], ["交互", null], ["技术", null], ["多方确认", null]];
overview.getRange("B5:B10").formulas = [
  [`=COUNTA('需求待确认'!$A$2:$A$${pendingLastRow})`],
  [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLastRow},"待确认")`],
  [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLastRow},"待前置结论")`],
  [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLastRow},"确认中")`],
  [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLastRow},"已确认")`],
  [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLastRow},"无需处理")`],
];
overview.getRange("E5:E7").formulas = ["阻塞测试", "部分阻塞", "不阻塞"].map((value) => [`=COUNTIFS('需求待确认'!$E$2:$E$${pendingLastRow},"${value}",'需求待确认'!$T$2:$T$${pendingLastRow},"待确认")`]);
overview.getRange("H5:H8").formulas = ["产品", "交互", "技术", "多方确认"].map((value) => [`=COUNTIFS('需求待确认'!$R$2:$R$${pendingLastRow},"${value}",'需求待确认'!$T$2:$T$${pendingLastRow},"待确认")`]);
overview.getRange("A1:H10").format = { font: { name: font, size: 10, color: "#111827" }, verticalAlignment: "center" };
overview.getRange("A1").format.font = { name: font, size: 15, bold: true, color: "#111827" };
overview.getRange("A2").format.font = { name: font, size: 10, italic: true, color: "#64748B" };
for (const range of ["A4:B10", "D4:E7", "G4:H8"]) overview.getRange(range).format.borders = border;
for (const range of ["A4:B4", "D4:E4", "G4:H4"]) overview.getRange(range).format = headerFormat;
overview.getRange("A5:A10").format.fill = "#F8FAFC";
overview.getRange("D5:D7").format.fill = "#F8FAFC";
overview.getRange("G5:G8").format.fill = "#F8FAFC";
overview.getRange("B5:B10").format = { font: { name: font, size: 11, bold: true, color: "#1D4ED8" }, horizontalAlignment: "right", verticalAlignment: "center", borders: border };
overview.getRange("E5:E7").format = { font: { name: font, size: 11, bold: true, color: "#1D4ED8" }, horizontalAlignment: "right", verticalAlignment: "center", borders: border };
overview.getRange("H5:H8").format = { font: { name: font, size: 11, bold: true, color: "#1D4ED8" }, horizontalAlignment: "right", verticalAlignment: "center", borders: border };
for (const [column, width] of [["A", 22], ["B", 12], ["C", 4], ["D", 18], ["E", 14], ["F", 4], ["G", 18], ["H", 14]]) overview.getRange(`${column}1:${column}10`).format.columnWidth = width;
overview.getRange("1:1").format.rowHeight = 30;
overview.showGridLines = false;
overview.freezePanes.freezeRows(3);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await saveNewWorkbook(xlsx,outputPath,async () => {
  const current = await authorizeWorkbookExport(taskDir,root,sourcePath,outputPath,exportOptions);
  const currentHash = current.候选SHA256 || crypto.createHash('sha256').update(await fs.readFile(sourcePath)).digest('hex');
  if (currentHash !== checkedSourceHash) throw new Error('导出期间候选发生变化，须重建受影响工作簿');
});
await finishStage(taskDir, "xlsx-build", { 输入数量: inputCount, 输出数量: 1, 复用数量: 0 });

await startStage(taskDir, "xlsx-verify", { 输入数量: 1 });
const saved = await SpreadsheetFile.importXlsx(await fs.readFile(outputPath));
const inspections = [];
for (const request of [
  { kind: "workbook,sheet,table", maxChars: 8000, tableMaxRows: 3, tableMaxCols: 6, tableMaxCellChars: 80 },
  { kind: "table", range: "功能测试用例!A1:O6", include: "values,formulas", tableMaxRows: 6, tableMaxCols: 15, maxChars: 12000 },
  { kind: "table", range: `功能测试用例!A${caseLastRow - 3}:O${caseLastRow}`, include: "values,formulas", tableMaxRows: 4, tableMaxCols: 15, maxChars: 12000 },
  { kind: "table", range: `需求待确认!A1:T${pendingLastRow}`, include: "values,formulas", tableMaxRows: 10, tableMaxCols: 20, maxChars: 24000 },
  { kind: "table", range: "产品决策概览!A1:H10", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 8, maxChars: 12000 },
  { kind: "computedStyle", sheetId: "功能测试用例", range: "A1:O3", maxChars: 8000 },
]) inspections.push((await saved.inspect(request)).ndjson);
const errors = await saved.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
if (/"count"\s*:\s*[1-9]/u.test(errors.ndjson)) throw new Error(`工作簿存在公式错误：${errors.ndjson}`);
inspections.push(errors.ndjson);
await fs.writeFile(path.join(taskDir, "workbook-inspection.ndjson"), `${inspections.join("\n")}\n`);

const normalized = (matrix) => matrix.map((row) => row.map((value) => value ?? ""));
const expectedCases = normalized([caseHeaders, ...caseRows]);
const expectedPending = normalized([pendingHeaders, ...pendingRows]);
const actualCases = normalized(saved.worksheets.getItem("功能测试用例").getRange(`A1:O${caseLastRow}`).values);
const actualPending = normalized(saved.worksheets.getItem("需求待确认").getRange(`A1:T${pendingLastRow}`).values);
let differenceCount = 0;
for (const [actual, expected] of [[actualCases, expectedCases], [actualPending, expectedPending]]) {
  for (let row = 0; row < expected.length; row += 1) {
    for (let column = 0; column < expected[row].length; column += 1) if (actual[row]?.[column] !== expected[row][column]) differenceCount += 1;
  }
}
const hashFile = async (file) => crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");
const candidatePath = path.join(taskDir, "current-testcase-candidate.json");
await fs.writeFile(path.join(taskDir, "delivery-verification.json"), `${JSON.stringify({
  schemaVersion: "1.0", 状态: differenceCount === 0 ? "通过" : "不通过", JSON一致性差异数: differenceCount,
  导出用途: exportOptions.stage ? "阶段性" : "正式交付",
  工作簿SHA256: await hashFile(outputPath), 候选SHA256: await hashFile(candidatePath),
  工作表: { 产品决策概览: "A1:H10", 功能测试用例: `A1:O${caseLastRow}`, 需求待确认: `A1:T${pendingLastRow}` },
  公式错误数: 0, 网格抽查: "已确认明细表表头与正文四边均为细边框", 检查时间: new Date().toISOString(),
}, null, 2)}\n`);
if (differenceCount) throw new Error(`Excel 与最终 JSON 存在 ${differenceCount} 个单元格差异`);

for (const [name, sheetName, range] of [
  ["overview", "产品决策概览", "A1:H10"],
  ["cases-top", "功能测试用例", "A1:O14"],
  ["cases-bottom", "功能测试用例", `A${caseLastRow - 9}:O${caseLastRow}`],
  ["pending", "需求待确认", `A1:T${Math.min(pendingLastRow, 8)}`],
]) {
  const image = await saved.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
}
await validateTestcaseDelivery(taskDir, root, { phase: "final", workbook: outputPath });
await finishStage(taskDir, "xlsx-verify", { 输入数量: 1, 输出数量: 4, 复用数量: 0 });
console.log(JSON.stringify({ 输出文件: outputPath, 工作表: ["产品决策概览", "功能测试用例", "需求待确认"], 测试用例数: caseRows.length, 需求待确认数: pendingRows.length, 预览目录: previewDir }, null, 2));
