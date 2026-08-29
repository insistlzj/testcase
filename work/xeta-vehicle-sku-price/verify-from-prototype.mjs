import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2];
const jsonPath = process.argv[3];
assert(workbookPath && jsonPath, "usage: node verify-from-prototype.mjs <workbook.xlsx> <payload.json>");

const caseHeaders = [
  "序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述",
  "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注",
];
const questionHeaders = [
  "问题编号", "功能模块", "功能结构", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态",
];
const payload = JSON.parse(await fs.readFile(jsonPath, "utf8"));
assert.deepEqual(Object.keys(payload), ["测试用例", "需求待确认"], "JSON root keys mismatch");
assert(Array.isArray(payload.测试用例), "测试用例 must be array");
assert(Array.isArray(payload.需求待确认), "需求待确认 must be array");

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const main = workbook.worksheets.getItem("功能测试用例");
const pending = workbook.worksheets.getItem("需求待确认");
assert(main, "missing sheet: 功能测试用例");
assert(pending, "missing sheet: 需求待确认");

const caseCount = payload.测试用例.length;
const questionCount = payload.需求待确认.length;
const mainValues = main.getRange(`A1:O${caseCount + 1}`).values;
const pendingValues = pending.getRange(`A1:H${questionCount + 1}`).values;
assert.deepEqual(mainValues[0], caseHeaders, "functional headers mismatch");
assert.deepEqual(pendingValues[0], questionHeaders, "pending headers mismatch");
assert.equal(mainValues.length, caseCount + 1, "functional row count mismatch");
assert.equal(pendingValues.length, questionCount + 1, "pending row count mismatch");

const endpoint = /\/product\/|https?:\/\/|\b(GET|POST|PUT|PATCH|DELETE)\b/i;
const rawPlaceholder = /yyyyMMddHHmmss|(?:model|version|sku)-(?:main|new|limit|over)\.(?:jpg|png|gif)/i;
const unresolvedVariable = /(?:^|[^A-Z])N(?:[^A-Z]|$)/;
const expectedCompound = /[;；\n]|(?:^|[^不])(?:同时|并且)/;
const vague = /功能正常|结果正确|有合理提示|无异常|符合预期|同步正常/;
const ids = new Set();
const points = new Set();
const flowStages = new Map();

payload.测试用例.forEach((item, index) => {
  const rowNumber = index + 1;
  const excel = mainValues[index + 1];
  assert.deepEqual(Object.keys(item), caseHeaders, `JSON field order mismatch: ${item.用例编号}`);
  assert.equal(item.序号, rowNumber, `sequence mismatch in JSON at ${item.用例编号}`);
  assert.equal(item.用例编号, `VSP-${String(rowNumber).padStart(3, "0")}`, `case id mismatch at ${item.用例编号}`);
  assert(!ids.has(item.用例编号), `duplicate case id: ${item.用例编号}`);
  ids.add(item.用例编号);
  assert.equal(typeof item.流程编号, "string", `flow id field missing: ${item.用例编号}`);
  assert(item.用例描述.startsWith("验证"), `description must start with 验证: ${item.用例编号}`);
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0, `preconditions missing: ${item.用例编号}`);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0, `steps missing: ${item.用例编号}`);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1, `expected result count mismatch: ${item.用例编号}`);
  assert(item.预期结果[0].trim(), `expected result empty: ${item.用例编号}`);
  assert(!expectedCompound.test(item.预期结果[0]), `compound expected result: ${item.用例编号}`);
  assert(!vague.test(item.预期结果[0]), `vague expected result: ${item.用例编号}`);
  assert(Array.isArray(item.备注) && item.备注.length > 0, `source note missing: ${item.用例编号}`);
  assert(item.备注.every((note) => note.startsWith("来源：xeta-proto/prototype/") || note.startsWith("流程阶段：")), `invalid note: ${item.用例编号}`);
  assert(!endpoint.test(JSON.stringify(item)), `endpoint or HTTP method found: ${item.用例编号}`);
  assert(!rawPlaceholder.test(JSON.stringify(item)), `raw placeholder or fictitious file name found: ${item.用例编号}`);
  assert(!unresolvedVariable.test(item.预期结果[0]), `unresolved variable found: ${item.用例编号}`);
  const flowNotes = item.备注.filter((note) => note.startsWith("流程阶段："));
  if (item.流程编号) {
    assert(/^FLOW-VSP-\d{3}$/.test(item.流程编号), `flow id format mismatch: ${item.用例编号}`);
    assert(flowNotes.length > 0, `flow stage missing: ${item.用例编号}`);
    assert(item.前置条件.some((condition) => condition.startsWith("共同业务对象：")), `shared business object missing: ${item.用例编号}`);
    flowNotes.forEach((note) => {
      const match = note.match(/^流程阶段：(\d{2})/);
      assert(match, `flow note format mismatch: ${item.用例编号}`);
      if (!flowStages.has(item.流程编号)) flowStages.set(item.流程编号, new Set());
      flowStages.get(item.流程编号).add(match[1]);
    });
  } else {
    assert.equal(flowNotes.length, 0, `ordinary case contains flow stage: ${item.用例编号}`);
  }
  const pointKey = `${item.功能结构}|${item.验证用例子项}|${item.前置条件.join("|")}|${item.预期结果[0]}`;
  assert(!points.has(pointKey), `duplicate business intent: ${item.用例编号}`);
  points.add(pointKey);
  assert.equal(Number(excel[0]), item.序号, `Excel sequence mismatch at row ${rowNumber + 1}`);
  assert.equal(excel[1], item.用例编号, `Excel id mismatch at row ${rowNumber + 1}`);
  assert.equal(excel[6], item.用例描述, `Excel description mismatch at row ${rowNumber + 1}`);
  assert.equal(excel[7], item.验证用例子项, `Excel point mismatch at row ${rowNumber + 1}`);
  assert.equal(excel[10], item.预期结果[0], `Excel expected mismatch at row ${rowNumber + 1}`);
  assert.equal(excel[11] ?? "", item.流程编号, `Excel flow id mismatch at row ${rowNumber + 1}`);
  assert.equal(excel[12], "未测", `Excel result default mismatch at row ${rowNumber + 1}`);
});

for (const [flowId, requiredStages] of Object.entries({ "FLOW-VSP-001": ["01", "02", "03", "04"], "FLOW-VSP-002": ["01", "02", "03", "04", "05"] })) {
  assert(flowStages.has(flowId), `flow missing: ${flowId}`);
  requiredStages.forEach((stage) => assert(flowStages.get(flowId).has(stage), `flow stage missing: ${flowId}-${stage}`));
}

payload.需求待确认.forEach((item, index) => {
  const id = `Q-${String(index + 1).padStart(3, "0")}`;
  assert.equal(item.问题编号, id, `question id mismatch: ${item.问题编号}`);
  assert.equal(item.确认状态, "待确认", `question status mismatch: ${item.问题编号}`);
  assert.equal(pendingValues[index + 1][0], id, `Excel question id mismatch: ${item.问题编号}`);
});

const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "formula error scan",
});
assert(formulaErrors.ndjson.includes("Cell search matched 0 entries."), "formula error found");

const previewDir = path.dirname(jsonPath);
for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O8", "preview-final-main-head.png"],
  ["功能测试用例", `A58:O${caseCount + 1}`, "preview-final-main-flow.png"],
  ["需求待确认", `A1:H${questionCount + 1}`, "preview-final-pending.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const archive = await JSZip.loadAsync(await fs.readFile(workbookPath));
for (const entry of ["xl/workbook.xml", "xl/worksheets/sheet1.xml", "xl/worksheets/sheet2.xml"]) {
  assert(archive.file(entry), `missing archive entry: ${entry}`);
}
const workbookXml = await archive.file("xl/workbook.xml").async("string");
assert(workbookXml.includes("功能测试用例"), "functional sheet missing in workbook.xml");
assert(workbookXml.includes("需求待确认"), "pending sheet missing in workbook.xml");
const sheet1Xml = await archive.file("xl/worksheets/sheet1.xml").async("string");
const sheet2Xml = await archive.file("xl/worksheets/sheet2.xml").async("string");
for (const [name, xml] of [["功能测试用例", sheet1Xml], ["需求待确认", sheet2Xml]]) {
  assert(xml.includes("state=\"frozen\""), `${name} missing frozen pane`);
  assert(xml.includes("<x:autoFilter "), `${name} missing auto filter`);
  assert(xml.includes("<x:dataValidations"), `${name} missing data validation`);
}
const sharedStringsEntry = archive.file("xl/sharedStrings.xml");
if (sharedStringsEntry) {
  const sharedStrings = await sharedStringsEntry.async("string");
  const cellTextOnly = sharedStrings.replace(/<[^>]+>/g, " ");
  assert(!endpoint.test(cellTextOnly), "endpoint or HTTP method found in workbook strings");
  assert(!rawPlaceholder.test(cellTextOnly), "raw placeholder or fictitious file name found in workbook strings");
}

const p0 = payload.测试用例.filter((item) => item.优先级 === "P0").length;
assert(p0 <= 6, `P0 is not a minimal smoke set: ${p0}`);
const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({
  workbookPath,
  bytes: stat.size,
  sheets: ["功能测试用例", "需求待确认"],
  cases: caseCount,
  questions: questionCount,
  p0,
  flows: [...flowStages.keys()],
  endpointReferences: 0,
  rawPlaceholderReferences: 0,
  formulaErrors: 0,
  frozenSheets: 2,
  filteredSheets: 2,
  dataValidationSheets: 2,
}, null, 2));
