import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/geekonup/Codex_Work/xeta-server-test/doc/测试用例/晞塔-管理后台web测试用例.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));

const sheets = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 6000,
});
const matches = await workbook.inspect({
  kind: "match",
  searchTerm: "采购价|商品定价|基础价格|价格审批|采购折扣",
  options: { useRegex: true, maxResults: 500 },
  summary: "采购价审核相关已有用例",
  maxChars: 30000,
});
const approvalRows = await workbook.inspect({
  kind: "region",
  sheetId: "品牌方",
  range: "A170:N205",
  maxChars: 30000,
});
const sourceRows = await workbook.inspect({
  kind: "region",
  sheetId: "品牌方",
  range: "A770:N910",
  maxChars: 50000,
});

const result = `${sheets.ndjson}\n${matches.ndjson}\n${approvalRows.ndjson}\n${sourceRows.ndjson}\n`;
await fs.writeFile("existing-cases.ndjson", result, "utf8");
const brandSheet = workbook.worksheets.getItem("品牌方");
await fs.writeFile(
  "existing-relevant-rows.json",
  `${JSON.stringify({
    headers: brandSheet.getRange("A1:N3").values,
    approval: brandSheet.getRange("A176:N200").values,
    product: brandSheet.getRange("A770:N910").values,
  }, null, 2)}\n`,
  "utf8",
);
console.log(result);
