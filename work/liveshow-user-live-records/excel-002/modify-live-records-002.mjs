import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/geekonup/testcase/outputs/Luma Live-case/用户App-直播记录模块-260831-001.xlsx";
const workDir = "/Users/geekonup/testcase/work/liveshow-user-live-records/excel-002";

await fs.mkdir(workDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

console.log((await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 4000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "match",
  searchTerm: "Q-002|近7天|默认显示|默认日期|默认范围|页面默认",
  options: { useRegex: true, maxResults: 100 },
  summary: "定位默认日期范围相关记录",
  maxChars: 16000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "table",
  range: "需求待确认!A1:T20",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 20,
  tableMaxCellChars: 240,
  maxChars: 30000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "table",
  range: "功能测试用例!A1:O80",
  include: "values,formulas",
  tableMaxRows: 80,
  tableMaxCols: 15,
  tableMaxCellChars: 240,
  maxChars: 50000,
})).ndjson);

for (const sheetName of ["产品决策概览", "功能测试用例", "需求待确认"]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = sheetName.replaceAll("/", "-");
  await fs.writeFile(path.join(workDir, `before-${safeName}.png`), new Uint8Array(await preview.arrayBuffer()));
}

if (process.argv[2] !== "--edit") {
  process.exit(0);
}

const caseSheet = workbook.worksheets.getItem("功能测试用例");
const pendingSheet = workbook.worksheets.getItem("需求待确认");

caseSheet.getRange("G4:K7").values = [
  [
    "验证默认近7天列表筛选",
    "默认近7天日期边界",
    "1. 测试当前日期为 2026-08-17\n2. 2026-08-11 和 2026-08-17 各存在一场直播记录\n3. 2026-08-10 存在一场直播记录\n4. 除上述数据外无其他直播记录",
    "1. 进入直播记录页\n2. 查看默认记录列表",
    "默认近 7 天记录列表仅包含 2026-08-11 和 2026-08-17 两场记录",
  ],
  [
    "验证默认近7天收益汇总",
    "默认近7天收益汇总",
    "1. 收益定义为默认近 7 天内各场本场收益的整数之和\n2. 2026-08-12、2026-08-15、2026-08-17 三场收益依次为 3,156、1,904、624\n3. 2026-08-09 场次收益不计入默认近 7 天收益",
    "1. 进入直播记录页\n2. 查看收益汇总",
    "收益 = 3,156 + 1,904 + 624 = 5,684",
  ],
  [
    "验证默认近7天总时长汇总",
    "默认近7天总时长汇总",
    "1. 总时长定义为默认近 7 天内各场直播时长按分钟相加\n2. 2026-08-12、2026-08-15、2026-08-17 三场时长依次为 2h18m、1h42m、56m\n3. 2026-08-09 场次时长不计入默认近 7 天总时长",
    "1. 进入直播记录页\n2. 查看总时长汇总",
    "总时长 = 138 分钟 + 102 分钟 + 56 分钟 = 296 分钟 = 4h56m",
  ],
  [
    "验证默认近7天直播场次汇总",
    "默认近7天场次汇总",
    "1. 直播场次定义为默认近 7 天内的直播记录数量\n2. 2026-08-12、2026-08-15、2026-08-17 各存在一场直播记录\n3. 2026-08-09 场次不计入默认近 7 天场次",
    "1. 进入直播记录页\n2. 查看直播场次汇总",
    "直播场次 = 3",
  ],
];

const existingRemarks = caseSheet.getRange("O4:O7").values;
caseSheet.getRange("O4:O7").values = existingRemarks.map((row, index) => {
  const nextNumber = index === 0 ? 6 : 7;
  return [`${row[0]}\n${nextNumber}. 规则追溯：RCL-0019；默认日期范围按原型批注“默认近 7 天”生成，静态示例“10/8/2026～17/8/2026”不作为边界规则`];
});

pendingSheet.getRange("L3:T3").values = [[
  "A",
  "按 RCL-0019，以原型批注“默认近 7 天”为准；采用当天及前 6 个自然日，共 7 个自然日。静态示例日期不作为默认边界规则。",
  "1. 原型批注明确写明默认近 7 天\n2. 静态示例日期为 10/8/2026 至 17/8/2026\n3. 用户确认原型默认数据与明确批注不一致时批注优先，规则记录为 RCL-0019",
  "1. 默认记录列表\n2. 默认收益汇总\n3. 默认总时长汇总\n4. 默认直播场次汇总",
  "1. LREC-003 至 LREC-006",
  null,
  "产品",
  "已按 RCL-0019 处理",
  "已确认",
]];

console.log((await workbook.inspect({
  kind: "table",
  range: "功能测试用例!A1:O8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 15,
  tableMaxCellChars: 360,
  maxChars: 30000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "table",
  range: "需求待确认!A1:T4",
  include: "values,formulas",
  tableMaxRows: 4,
  tableMaxCols: 20,
  tableMaxCellChars: 360,
  maxChars: 22000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "table",
  range: "产品决策概览!A1:H14",
  include: "values,formulas",
  tableMaxRows: 14,
  tableMaxCols: 8,
  tableMaxCellChars: 180,
  maxChars: 16000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 8000,
})).ndjson);

for (const sheetName of ["产品决策概览", "功能测试用例", "需求待确认"]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = sheetName.replaceAll("/", "-");
  await fs.writeFile(path.join(workDir, `after-${safeName}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const outputPath = "/Users/geekonup/testcase/outputs/Luma Live-case/用户App-直播记录模块-260831-002.xlsx";
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT=${outputPath}`);
