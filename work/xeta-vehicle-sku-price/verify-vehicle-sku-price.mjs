import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2];
const expectedCases = Number(process.argv[3]);
const expectedQuestions = Number(process.argv[4]);
const expectedP0 = Number(process.argv[5]);
assert(workbookPath && Number.isInteger(expectedCases) && Number.isInteger(expectedQuestions) && Number.isInteger(expectedP0),
  "usage: node verify-vehicle-sku-price.mjs <workbook.xlsx> <cases> <questions> <p0>");

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const main = workbook.worksheets.getItem("功能测试用例");
const pending = workbook.worksheets.getItem("需求待确认");
assert(main, "missing sheet: 功能测试用例");
assert(pending, "missing sheet: 需求待确认");

const mainValues = main.getRange(`A1:N${expectedCases + 1}`).values;
const pendingValues = pending.getRange(`A1:H${expectedQuestions + 1}`).values;

assert.equal(mainValues.length, expectedCases + 1, "functional sheet row count mismatch");
assert.equal(mainValues[0].length, 14, "functional sheet column count mismatch");
assert.equal(pendingValues.length, expectedQuestions + 1, "pending sheet row count mismatch");
assert.equal(pendingValues[0].length, 8, "pending sheet column count mismatch");

const expectedMainHeaders = [
  "序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述",
  "验证用例子项", "前置条件", "操作步骤", "预期结果", "测试结果", "测试人员", "备注",
];
const expectedPendingHeaders = [
  "问题编号", "功能模块", "功能结构", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态",
];
assert.deepEqual(mainValues[0], expectedMainHeaders, "functional headers mismatch");
assert.deepEqual(pendingValues[0], expectedPendingHeaders, "pending headers mismatch");

for (let index = 1; index < mainValues.length; index += 1) {
  const row = mainValues[index];
  assert.equal(Number(row[0]), index, `sequence mismatch at row ${index + 1}`);
  assert.equal(row[1], `VSP-${String(index).padStart(3, "0")}`, `case id mismatch at row ${index + 1}`);
  assert(String(row[6]).startsWith("验证"), `description must start with 验证 at row ${index + 1}`);
  assert(String(row[8]).trim(), `precondition missing at row ${index + 1}`);
  assert(String(row[9]).trim(), `steps missing at row ${index + 1}`);
  assert(String(row[10]).trim(), `expected result missing at row ${index + 1}`);
  assert.equal(row[11], "未测", `test status mismatch at row ${index + 1}`);
  assert(/证据：E-\d{3}/.test(String(row[13])), `evidence reference missing at row ${index + 1}`);
}

for (let index = 1; index < pendingValues.length; index += 1) {
  const row = pendingValues[index];
  assert.equal(row[0], `Q-${String(index).padStart(3, "0")}`, `question id mismatch at row ${index + 1}`);
  assert.equal(row[7], "待确认", `question status mismatch at row ${index + 1}`);
}

const p0Count = mainValues.slice(1).filter((row) => row[5] === "P0").length;
assert.equal(p0Count, expectedP0, "P0 count mismatch");

const inspection = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 3,
  tableMaxCols: 14,
  tableMaxCellChars: 100,
});
const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "formula error scan",
});
assert(formulaErrors.ndjson.includes("Cell search matched 0 entries."), "formula error found");

const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({
  workbookPath,
  bytes: stat.size,
  sheets: ["功能测试用例", "需求待确认"],
  cases: mainValues.length - 1,
  questions: pendingValues.length - 1,
  p0: p0Count,
  formulaErrors: 0,
  inspection: inspection.ndjson,
}, null, 2));
