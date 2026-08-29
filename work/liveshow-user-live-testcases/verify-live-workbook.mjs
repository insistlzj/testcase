import fs from "node:fs/promises";
import { SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "outputs/Luma Live-case/用户App-直播模块-260828-012.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await fs.readFile(inputPath));
const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 6000,
  tableMaxRows: 3,
  tableMaxCols: 15,
  tableMaxCellChars: 100,
});
const keyColumns = await workbook.inspect({
  kind: "region",
  sheetId: "功能测试用例",
  range: "J1:M5",
  maxChars: 7000,
});
const passwordRows = await workbook.inspect({
  kind: "region",
  sheetId: "功能测试用例",
  range: "G31:K36",
  maxChars: 7000,
});
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "reimport formula error scan",
});

for (const [sheetName, range, outputPath] of [
  ["功能测试用例", "F29:K38", "work/liveshow-user-live-testcases/preview-fixed-password.png"],
  ["需求待确认", "A1:H9", "work/liveshow-user-live-testcases/preview-pending-fixed.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(outputPath, new Uint8Array(await preview.arrayBuffer()));
}

console.log(summary.ndjson);
console.log(keyColumns.ndjson);
console.log(passwordRows.ndjson);
console.log(errors.ndjson);
