import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import {
  PENDING_HEADERS,
  TEST_CASE_HEADERS,
  normalizeTestcasePayload,
} from "./testcase-schema.mjs";

const root = path.resolve(process.argv[2] || path.join(import.meta.dirname, "..", ".."));
const workbookPath = process.argv[3] ? path.resolve(process.argv[3]) : null;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const agentsPath = path.join(root, "AGENTS.md");
const promptPath = path.join(root, "Cem Kaner.txt");
const legacyPath = path.join(root, "work", "ug-agent-testcases", "test-cases-cem-kaner.json");

const [agents, prompt, legacyRaw] = await Promise.all([
  fs.readFile(agentsPath, "utf8"),
  fs.readFile(promptPath, "utf8"),
  fs.readFile(legacyPath, "utf8"),
]);

assert(!agents.startsWith("---"), "AGENTS.md 不应保留 Skill YAML frontmatter");
assert(!agents.includes("references/taoli-project.md"), "AGENTS.md 仍包含失效的桃李愿景引用");
assert(agents.includes(TEST_CASE_HEADERS.join(", ")), "AGENTS.md 的 14 列定义不完整");
assert(agents.includes(PENDING_HEADERS.join(", ")), "AGENTS.md 的待确认 8 列定义不完整");
assert(prompt.includes("<<MODULE_NAME>>"), "Cem 提示词缺少无冲突模块占位符");
assert(prompt.includes("`测试用例`：可执行用例数组"), "Cem 提示词缺少测试用例根数组说明");
assert(prompt.includes("`需求待确认`：待确认问题数组"), "Cem 提示词缺少需求待确认根数组说明");

const exampleStart = prompt.indexOf("{\n", prompt.indexOf("## 合法 JSON 示例"));
const exampleEnd = prompt.indexOf("\n\n请开始生成 JSON：", exampleStart);
assert(exampleStart >= 0 && exampleEnd > exampleStart, "无法提取 Cem 合法 JSON 示例");
const example = JSON.parse(prompt.slice(exampleStart, exampleEnd));
assert(Array.isArray(example.测试用例) && Array.isArray(example.需求待确认), "Cem JSON 示例根结构错误");
assert(JSON.stringify(Object.keys(example.测试用例[0])) === JSON.stringify(TEST_CASE_HEADERS), "Cem JSON 示例的 14 字段顺序错误");
assert(JSON.stringify(Object.keys(example.需求待确认[0])) === JSON.stringify(PENDING_HEADERS), "Cem JSON 示例的待确认字段顺序错误");

const normalized = normalizeTestcasePayload(JSON.parse(legacyRaw));
assert(normalized.测试用例.length > 0, "旧 10 字段 JSON 未能转换为正式用例");
assert(normalized.需求待确认.length > 0, "旧备注中的待确认事项未能提取");

const result = {
  promptExampleParsed: true,
  agentsColumns: TEST_CASE_HEADERS.length,
  pendingColumns: PENDING_HEADERS.length,
  legacyCaseCount: normalized.测试用例.length,
  extractedPendingCount: normalized.需求待确认.length,
};

if (workbookPath) {
  const zip = await JSZip.loadAsync(await fs.readFile(workbookPath));
  const workbookXml = await zip.file("xl/workbook.xml")?.async("string");
  const sheet1 = await zip.file("xl/worksheets/sheet1.xml")?.async("string");
  const sheet2 = await zip.file("xl/worksheets/sheet2.xml")?.async("string");
  assert(workbookXml && sheet1 && sheet2, "工作簿缺少两个标准工作表 XML");
  assert(workbookXml.includes('name="功能测试用例"'), "工作簿缺少功能测试用例工作表");
  assert(workbookXml.includes('name="需求待确认"'), "工作簿缺少需求待确认工作表");
  assert(sheet1.includes('state="frozen"') && sheet2.includes('state="frozen"'), "工作表未冻结首行");
  assert(/<x:autoFilter ref="A1:N\d+"/.test(sheet1), "功能测试用例筛选范围不是 14 列");
  assert(/<x:autoFilter ref="A1:H\d+"/.test(sheet2), "需求待确认筛选范围不是 8 列");
  assert(!/<x:f[ >]/.test(sheet1) && !/<x:f[ >]/.test(sheet2), "工作簿出现非预期公式");
  result.workbookVerified = true;
  result.workbookPath = workbookPath;
}

console.log(JSON.stringify(result, null, 2));
