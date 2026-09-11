import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "/Users/geekonup/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const taskDir = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(taskDir, "../..");
const outputDir = path.join(root, "outputs/Luma Live-case");
const caseHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const pendingHeaders = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];
const configs = {
  用户App: { dir: "user", input: "用户App-全部模块-260911-001.xlsx", output: "用户App-全部模块-260911-002.xlsx", json: "用户App-全部模块-测试用例-260911-002.json" },
  公会App: { dir: "guild", input: "公会App-全部模块-260911-001.xlsx", output: "公会App-全部模块-260911-002.xlsx", json: "公会App-全部模块-测试用例-260911-002.json" },
  管理后台: { dir: "admin", input: "管理后台-全部模块-260911-001.xlsx", output: "管理后台-全部模块-260911-002.xlsx", json: "管理后台-全部模块-测试用例-260911-002.json" },
};
const list = (value, letters = false) => Array.isArray(value) ? value.map((item, index) => `${letters ? String.fromCharCode(65 + index) : index + 1}. ${item}`).join("\n") : String(value ?? "");
const rows = (items, headers, letterField = "") => items.map((item) => headers.map((name) => name === "预期结果" ? item[name][0] : Array.isArray(item[name]) ? list(item[name], name === letterField) : item[name] ?? ""));
const normalize = (matrix) => matrix.map((row) => row.map((value) => value ?? ""));
const sha256File = async (file) => crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");

await fs.mkdir(outputDir, { recursive: true });
for (const [end, config] of Object.entries(configs)) {
  const source = JSON.parse(await fs.readFile(path.join(taskDir, config.dir, config.json), "utf8"));
  const additions = JSON.parse(await fs.readFile(path.join(taskDir, config.dir, "new-testcases.json"), "utf8")).测试用例;
  const pendingAdditions = JSON.parse(await fs.readFile(path.join(taskDir, config.dir, "new-pending.json"), "utf8")).需求待确认;
  const inputPath = path.join(outputDir, config.input);
  const outputPath = path.join(outputDir, config.output);
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
  const casesSheet = workbook.worksheets.getItem("功能测试用例");
  const pendingSheet = workbook.worksheets.getItem("需求待确认");
  const overview = workbook.worksheets.getItem("产品决策概览");
  const casesTable = casesSheet.tables.items[0];
  const pendingTable = pendingSheet.tables.items[0];

  if (additions.length) casesTable.rows.add(null, rows(additions, caseHeaders));
  if (pendingAdditions.length) pendingTable.rows.add(null, rows(pendingAdditions, pendingHeaders, "可选方案"));

  const oldCaseCount = source.测试用例.length - additions.length;
  const oldPendingCount = source.需求待确认.length - pendingAdditions.length;
  const caseLast = source.测试用例.length + 1;
  const pendingLast = source.需求待确认.length + 1;
  const caseStart = oldCaseCount + 2;
  const pendingStart = oldPendingCount + 2;
  if (additions.length) {
    casesSheet.getRange(`A${caseStart}:O${caseLast}`).format.rowHeight = 132;
    casesSheet.getRange(`A${caseStart}:O${caseLast}`).format.verticalAlignment = "top";
    casesSheet.getRange(`E${caseStart}:E${caseLast}`).dataValidation = { rule: { type: "list", values: ["功能需求", "业务流程", "逻辑校验", "异常用例"] } };
    casesSheet.getRange(`F${caseStart}:F${caseLast}`).dataValidation = { rule: { type: "list", values: ["P0", "P1", "P2", "P3"] } };
    casesSheet.getRange(`M${caseStart}:M${caseLast}`).dataValidation = { rule: { type: "list", values: ["未测", "通过", "不通过", "阻塞", "不适用"] } };
  }
  if (pendingAdditions.length) {
    pendingSheet.getRange(`A${pendingStart}:T${pendingLast}`).format.rowHeight = 96;
    pendingSheet.getRange(`A${pendingStart}:T${pendingLast}`).format.verticalAlignment = "top";
    pendingSheet.getRange(`E${pendingStart}:E${pendingLast}`).dataValidation = { rule: { type: "list", values: ["阻塞测试", "部分阻塞", "不阻塞"] } };
    pendingSheet.getRange(`H${pendingStart}:H${pendingLast}`).dataValidation = { rule: { type: "list", values: ["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"] } };
    pendingSheet.getRange(`L${pendingStart}:L${pendingLast}`).dataValidation = { rule: { type: "list", values: ["A", "B", "C", "D", "其他"] } };
    pendingSheet.getRange(`R${pendingStart}:R${pendingLast}`).dataValidation = { rule: { type: "list", values: ["产品", "交互", "技术", "多方确认"] } };
    pendingSheet.getRange(`T${pendingStart}:T${pendingLast}`).dataValidation = { rule: { type: "list", values: ["待前置结论", "待确认", "确认中", "已确认", "无需处理"] } };
    pendingSheet.getRange(`L${pendingStart}:M${pendingLast}`).format.fill = "#FFF4CC";
  }

  overview.getRange("B5:B10").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pendingLast})`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"待确认")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"待前置结论")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"确认中")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"已确认")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"无需处理")`]];
  overview.getRange("E5:E7").formulas = ["阻塞测试", "部分阻塞", "不阻塞"].map((value) => [`=COUNTIFS('需求待确认'!$E$2:$E$${pendingLast},"${value}",'需求待确认'!$T$2:$T$${pendingLast},"待确认")`]);
  overview.getRange("H5:H8").formulas = ["产品", "交互", "技术", "多方确认"].map((value) => [`=COUNTIFS('需求待确认'!$R$2:$R$${pendingLast},"${value}",'需求待确认'!$T$2:$T$${pendingLast},"待确认")`]);

  const exported = await SpreadsheetFile.exportXlsx(workbook);
  await exported.save(outputPath);

  const saved = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
  const errors = await saved.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, summary: "formula error scan" });
  if (/"count"\s*:\s*[1-9]/u.test(errors.ndjson)) throw new Error(`${end}工作簿存在公式错误：${errors.ndjson}`);
  const expectedCases = normalize([caseHeaders, ...rows(source.测试用例, caseHeaders)]);
  const expectedPending = normalize([pendingHeaders, ...rows(source.需求待确认, pendingHeaders, "可选方案")]);
  const actualCases = normalize(saved.worksheets.getItem("功能测试用例").getRange(`A1:O${caseLast}`).values);
  const actualPending = normalize(saved.worksheets.getItem("需求待确认").getRange(`A1:T${pendingLast}`).values);
  let differences = 0;
  for (const [actual, expected] of [[actualCases, expectedCases], [actualPending, expectedPending]]) for (let row = 0; row < expected.length; row += 1) for (let column = 0; column < expected[row].length; column += 1) if (actual[row]?.[column] !== expected[row][column]) differences += 1;
  if (differences) throw new Error(`${end} Excel 与最终 JSON 存在 ${differences} 个单元格差异`);

  const inspection = [];
  for (const request of [
    { kind: "workbook,sheet,table", maxChars: 8000, tableMaxRows: 3, tableMaxCols: 6, tableMaxCellChars: 80 },
    { kind: "table", range: `功能测试用例!A${Math.max(1, caseStart - 1)}:O${Math.min(caseLast, caseStart + 5)}`, include: "values,formulas", tableMaxRows: 7, tableMaxCols: 15, maxChars: 18000 },
    { kind: "table", range: `需求待确认!A${Math.max(1, pendingStart - 1)}:T${Math.min(pendingLast, pendingStart + 5)}`, include: "values,formulas", tableMaxRows: 7, tableMaxCols: 20, maxChars: 18000 },
    { kind: "table", range: "产品决策概览!A1:H10", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 8, maxChars: 12000 },
  ]) inspection.push((await saved.inspect(request)).ndjson);
  inspection.push(errors.ndjson);
  await fs.writeFile(path.join(taskDir, config.dir, "workbook-inspection.ndjson"), `${inspection.join("\n")}\n`);

  const previewDir = path.join(taskDir, config.dir, "previews");
  await fs.mkdir(previewDir, { recursive: true });
  for (const [name, sheetName, range] of [
    ["overview", "产品决策概览", "A1:H10"],
    ["cases-added", "功能测试用例", `A${Math.max(1, caseStart - 1)}:O${Math.min(caseLast, caseStart + 9)}`],
    ["pending-added", "需求待确认", `A${Math.max(1, pendingStart - 1)}:T${Math.min(pendingLast, pendingStart + 9)}`],
  ]) {
    const image = await saved.render({ sheetName, range, scale: 1, format: "png" });
    await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
  }
  await fs.writeFile(path.join(taskDir, config.dir, "workbook-verification.json"), `${JSON.stringify({
    状态: "通过",
    输出文件: outputPath,
    工作簿SHA256: await sha256File(outputPath),
    JSON一致性差异数: differences,
    公式错误数: 0,
    测试用例数: source.测试用例.length,
    需求待确认数: source.需求待确认.length,
    新增用例数: additions.length,
    新增待确认数: pendingAdditions.length,
    工作表: ["产品决策概览", "功能测试用例", "需求待确认"],
  }, null, 2)}\n`);
  console.log(JSON.stringify({ 端: end, 输出文件: outputPath, 测试用例数: source.测试用例.length, 需求待确认数: source.需求待确认.length }));
}
