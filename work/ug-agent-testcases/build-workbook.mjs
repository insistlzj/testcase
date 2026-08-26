import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import {
  CASE_TYPES,
  CONFIRMATION_STATUSES,
  PENDING_HEADERS,
  PRIORITIES,
  TEST_CASE_HEADERS,
  TEST_RESULTS,
  asList,
  normalizeTestcasePayload,
} from "./testcase-schema.mjs";

const inputPath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);
const previewPath = path.resolve(process.argv[4]);
const inspectPath = path.resolve(process.argv[5]);

const payload = normalizeTestcasePayload(JSON.parse(await fs.readFile(inputPath, "utf8")));
const cases = payload.测试用例;
const pending = payload.需求待确认;

function numbered(value) {
  return asList(value).map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function caseRow(item) {
  return [
    item.序号,
    item.用例编号,
    item.功能模块,
    item.功能结构,
    item.用例类型,
    item.优先级,
    item.用例描述,
    item.验证用例子项,
    numbered(item.前置条件),
    numbered(item.操作步骤),
    numbered(item.预期结果),
    item.测试结果,
    item.测试人员,
    numbered(item.备注),
  ];
}

function pendingRow(item) {
  return PENDING_HEADERS.map((header) => item[header]);
}

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
  let visualLines = 1;
  for (let index = 0; index < row.length; index += 1) {
    const text = String(row[index] ?? "");
    const width = Math.max(4, widths[index] || 12);
    const wrapped = text.split("\n").reduce(
      (sum, part) => sum + Math.max(1, Math.ceil([...part].length / width)),
      0,
    );
    visualLines = Math.max(visualLines, wrapped);
  }
  return Math.min(220, Math.max(38, visualLines * 17 + 10));
}

function addValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = { rule: { type: "list", values } };
}

function populateSheet(workbook, {
  name,
  headers,
  rows,
  widths,
  tableName,
  validations = [],
  priorityColumn = null,
}) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnName(headers.length - 1);
  const lastRow = rows.length + 1;
  const allRange = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  allRange.values = [headers, ...rows];

  if (rows.length > 0) {
    const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
    table.style = "TableStyleMedium2";
    table.showHeaders = true;
    table.showFilterButton = true;
    table.showBandedRows = true;
    table.showBandedColumns = false;
  }

  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  allRange.format = {
    font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#B8C7D9" },
  };

  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#1F4E78",
    font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    rowHeightPx: 38,
    borders: { preset: "all", style: "thin", color: "#163A5A" },
  };

  if (rows.length > 0) {
    sheet.getRange(`A2:${lastColumn}${lastRow}`).format = {
      font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      wrapText: true,
      borders: { preset: "all", style: "thin", color: "#D4DEE9" },
    };

    for (const validation of validations) {
      addValidation(sheet, `${validation.column}2:${validation.column}${lastRow}`, validation.values);
    }

    if (priorityColumn) {
      const priorityRange = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
      priorityRange.conditionalFormats.add("containsText", {
        text: "P0",
        format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } },
      });
      priorityRange.conditionalFormats.add("containsText", {
        text: "P1",
        format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } },
      });
    }
  }

  widths.forEach((width, index) => {
    sheet.getRange(`${columnName(index)}1`).format.columnWidth = width;
  });
  rows.forEach((row, index) => {
    sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths);
  });

  return { sheet, lastColumn, lastRow };
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(path.dirname(previewPath), { recursive: true });
await fs.mkdir(path.dirname(inspectPath), { recursive: true });

const workbook = Workbook.create();
const main = populateSheet(workbook, {
  name: "功能测试用例",
  headers: TEST_CASE_HEADERS,
  rows: cases.map(caseRow),
  widths: [8, 15, 16, 26, 13, 10, 36, 28, 40, 46, 50, 12, 14, 56],
  tableName: "FunctionalTestCases",
  validations: [
    { column: "E", values: CASE_TYPES },
    { column: "F", values: PRIORITIES },
    { column: "L", values: TEST_RESULTS },
  ],
  priorityColumn: "F",
});

const questions = populateSheet(workbook, {
  name: "需求待确认",
  headers: PENDING_HEADERS,
  rows: pending.map(pendingRow),
  widths: [14, 18, 28, 46, 52, 46, 34, 14],
  tableName: "PendingRequirements",
  validations: pending.length > 0 ? [{ column: "H", values: CONFIRMATION_STATUSES }] : [],
});

async function safeInspect(label, operation) {
  try {
    const result = await operation();
    console.error(`inspect:${label}:ok`);
    return result;
  } catch (error) {
    console.error(`inspect:${label}:failed:${error?.message || String(error)}`);
    return { inspectionError: error?.message || String(error) };
  }
}

const inspection = {
  workbook: await safeInspect("workbook", () => workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 8000,
    tableMaxRows: 4,
    tableMaxCols: 14,
    tableMaxCellChars: 120,
  })),
  mainSample: await safeInspect("main-region", () => workbook.inspect({
    kind: "region",
    sheetId: "功能测试用例",
    range: `A1:N${Math.min(main.lastRow, 6)}`,
    maxChars: 12000,
  })),
  pendingSample: await safeInspect("pending-region", () => workbook.inspect({
    kind: "region",
    sheetId: "需求待确认",
    range: `A1:H${Math.min(questions.lastRow, 6)}`,
    maxChars: 9000,
  })),
  styles: await safeInspect("styles", () => workbook.inspect({
    kind: "computedStyle",
    sheetId: "功能测试用例",
    range: `A1:N${Math.min(main.lastRow, 3)}`,
    maxChars: 8000,
  })),
  formulas: await safeInspect("formulas", () => workbook.inspect({
    kind: "formula",
    sheetId: "功能测试用例",
    range: `A1:N${main.lastRow}`,
    maxChars: 3000,
    options: { maxResults: 50 },
  })),
};
await fs.writeFile(inspectPath, JSON.stringify(inspection, null, 2), "utf8");

async function patchWorksheet(zip, sheetNumber, lastColumn, lastRow) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const worksheetEntry = zip.file(entryName);
  if (!worksheetEntry) throw new Error(`missing ${entryName}`);
  let worksheetXml = await worksheetEntry.async("string");
  if (!worksheetXml.includes("<x:pane ")) {
    worksheetXml = worksheetXml.replace(
      /<x:sheetView([^>]*)\/>/,
      '<x:sheetView$1><x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" /></x:sheetView>',
    );
  }
  if (!worksheetXml.includes("<x:autoFilter ")) {
    worksheetXml = worksheetXml.replace(
      "</x:sheetData>",
      `</x:sheetData><x:autoFilter ref="A1:${lastColumn}${lastRow}" />`,
    );
  }
  zip.file(entryName, worksheetXml);
}

try {
  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  await xlsx.save(outputPath);
  const zip = await JSZip.loadAsync(await fs.readFile(outputPath));
  await patchWorksheet(zip, 1, main.lastColumn, main.lastRow);
  await patchWorksheet(zip, 2, questions.lastColumn, questions.lastRow);
  const patched = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  await fs.writeFile(outputPath, patched);
} catch (error) {
  console.error(`export:failed:${error?.message || String(error)}`);
  process.exit(2);
}

console.error("preview:skipped:artifact-tool render exits in this Windows runtime");
console.log(JSON.stringify({
  outputPath,
  previewPath,
  inspectPath,
  worksheets: ["功能测试用例", "需求待确认"],
  caseCount: cases.length,
  pendingCount: pending.length,
}, null, 2));
