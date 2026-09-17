#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { finishStage, startStage } from "./pipeline-metrics.mjs";

const caseFields = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const pendingFields = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];
const allowedTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const allowedPriorities = new Set(["P0", "P1", "P2", "P3"]);
const languageRulesFile = new URL("../AGENTS.md", import.meta.url);
const languageRulesStart = "<!-- TESTCASE_LANGUAGE_RULES_BEGIN -->";
const languageRulesEnd = "<!-- TESTCASE_LANGUAGE_RULES_END -->";

const comparableText = (value) => String(value || "")
  .replace(/^\s*\d+[.、]\s*/, "")
  .replace(/[\s`_“”"'‘’（）()【】\[\]，,。；;：:、]/g, "");

const standaloneText = (value) => String(value || "")
  .replace(/^\s*\d+[.、]\s*/, "")
  .replace(/[。；;，,！？!?]+$/, "")
  .trim();

export function descriptionRepeatsVerificationPoint(description, point, structure = "") {
  const role = String(structure).match(/（(.+?)视角）/)?.[1] || "";
  let body = String(description || "").replace(/^验证/u, "").replace(/（路径\d+）$/u, "");
  if (role && body.startsWith(role)) body = body.slice(role.length);
  else body = body.replace(/^(?:用户|主播|观众|房管|公会长|平台管理员)(?=.{1})/u, "");
  return Boolean(comparableText(point)) && comparableText(body) === comparableText(point);
}

const observableResultPattern = /(?:不建立|建立|不创建|创建|不生成|生成|进入|返回|停留|提示|不显示|显示|不展示|展示|隐藏|更新|写入|删除|清空|解除|退出|获得|失去|切换|移出|恢复|关闭|打开|调用|不保存|保存|回填|标记|发放|扣减|增加|刷新|播放|形成|拒绝|拦截|不可|不能|不得|不退款|退款|不扣款|扣款|不计入|不改变|保持|保留|失效|最多|不撤销|不回滚)/u;

export function splitAtomicResults(value) {
  const text = standaloneText(value);
  // These are review signals, not instructions to rewrite source clauses or carry conditions.
  if (/(?:必填|必选)[，；].*(?:至少|最多|不得小于|不得大于)/u.test(text)) return text.split(/[，；]/u);
  const retained = text.match(/^(.*?(?:后|时)[，,]?)?([^，；]+(?:、|和)[^，；]+?)(?:继续|均)?保留$/u);
  if (retained && /记录/u.test(retained[2]) && !/公式|之和|合计/u.test(text)) {
    return retained[2].split(/、|和/u).map((object) => `${retained[1] || ""}${object}保留`);
  }
  const parts = [];
  let remainder = text;
  for (;;) {
    let split = null;
    for (const match of remainder.matchAll(/，同时|(?<!合)并且|(?<!合)并|且|，/gu)) {
      const left = standaloneText(remainder.slice(0, match.index));
      const right = standaloneText(remainder.slice(match.index + match[0].length)).replace(/^(?:并|且|同时)/u, "");
      const rightMatch = observableResultPattern.exec(right);
      const rightObservable = /^授权.*有效/u.test(right) || rightMatch && rightMatch.index <= 14 && !/[、或和]/u.test(right.slice(0, rightMatch.index));
      if (left && right && observableResultPattern.test(left) && rightObservable) {
        split = { left, right };
        break;
      }
    }
    if (!split) break;
    parts.push(split.left);
    remainder = split.right;
  }
  parts.push(remainder);
  return parts.flatMap((part) => {
    // Multiple applicability conditions can qualify one displayed object.
    if (/^(?:只|仅)(?:展示|显示).+(?:适用|可用|匹配|允许|启用)的[^，；、和]+$/u.test(part)) return [part];
    const shared = part.match(/^(.*?(?:同步更新|不回滚|不撤销|更新|写入|生成|清除|关闭|展示|显示|保留))([^，；、和]{1,30})(?:和|、)([^，；]{1,30})$/u);
    if (!shared || /(?:比例|概率|公式|之和|合计|总和)/u.test(part)) return [part];
    return [`${shared[1]}${shared[2]}`, `${shared[1]}${shared[3]}`];
  }).map(standaloneText).filter(Boolean);
}

export function hasBalancedDelimiters(value) {
  const pairs = new Map([["“", "”"], ["(", ")"], ["（", "）"], ["[", "]"], ["【", "】"]]);
  const closing = new Set(pairs.values());
  const stack = [];
  for (const character of String(value || "")) {
    if (pairs.has(character)) stack.push(pairs.get(character));
    else if (closing.has(character) && stack.pop() !== character) return false;
  }
  return stack.length === 0;
}

export async function loadTestcaseLanguageRules(file = languageRulesFile) {
  const text = await fs.readFile(file, "utf8");
  const start = text.indexOf(languageRulesStart);
  const end = text.indexOf(languageRulesEnd);
  if (start < 0 || end <= start) throw new Error("AGENTS.md 缺少完整的测试用例机器语言规则区");
  const block = text.slice(start + languageRulesStart.length, end);
  const json = block.match(/```json\s*([\s\S]*?)\s*```/);
  if (!json) throw new Error("测试用例机器语言规则区必须包含一个 JSON 代码块");
  const rules = JSON.parse(json[1]);
  if (rules.schemaVersion !== "1.0") throw new Error("测试用例机器语言规则 schemaVersion 必须为 1.0");
  for (const key of ["actionVerbs", "ambiguousStandalonePhrases", "forbiddenPlaceholders"]) {
    if (!rules[key] || typeof rules[key] !== "object") throw new Error(`测试用例机器语言规则缺少 ${key}`);
  }
  for (const key of ["preconditionActionPatterns", "stepPatterns", "resultAsActionPatterns", "expectedCheckPatterns"]) {
    for (const pattern of rules.forbiddenPlaceholders[key] || []) new RegExp(pattern, "u");
  }
  return rules;
}

function checkFields(record, fields, label, issues) {
  const keys = Object.keys(record);
  if (JSON.stringify(keys) !== JSON.stringify(fields)) issues.push(`${label}字段或顺序不正确`);
}

export async function validateTestcaseJson(jsonFile) {
  const languageRules = await loadTestcaseLanguageRules();
  return validateTestcaseRecords(JSON.parse(await fs.readFile(jsonFile, "utf8")), languageRules);
}

export function validateTestcaseRecords(value, languageRules) {
  const ambiguousPhrases = new Set(Object.values(languageRules.ambiguousStandalonePhrases).flat());
  const placeholders = languageRules.forbiddenPlaceholders;
  const preconditionActionPatterns = (placeholders.preconditionActionPatterns || []).map((pattern) => new RegExp(pattern, "u"));
  const stepPatterns = (placeholders.stepPatterns || []).map((pattern) => new RegExp(pattern));
  const expectedCheckPatterns = (placeholders.expectedCheckPatterns || []).map((pattern) => new RegExp(pattern, "u"));
  const actionVerbs = Object.values(languageRules.actionVerbs).flat();
  const cases = value.测试用例;
  const pending = value.需求待确认;
  const issues = [];
  if (!Array.isArray(cases) || !Array.isArray(pending)) throw new Error("JSON 根节点必须只包含测试用例和需求待确认数组");
  if (JSON.stringify(Object.keys(value)) !== JSON.stringify(["测试用例", "需求待确认"])) issues.push("JSON 根字段或顺序不正确");

  const ids = new Set();
  const semanticKeys = new Set();
  const observationKeys = new Map();
  for (const [index, item] of cases.entries()) {
    const label = item.用例编号 || `测试用例第${index + 1}行`;
    checkFields(item, caseFields, label, issues);
    if (item.序号 !== index + 1) issues.push(`${label}序号不连续`);
    if (ids.has(item.用例编号)) issues.push(`${label}用例编号重复`);
    ids.add(item.用例编号);
    if (!allowedTypes.has(item.用例类型)) issues.push(`${label}用例类型不合法`);
    if (!allowedPriorities.has(item.优先级)) issues.push(`${label}优先级不合法`);
    if (!String(item.用例描述 || "").startsWith("验证")) issues.push(`${label}用例描述未以验证开头`);
    if (/^验证(用户|主播|观众|房管|公会长|平台管理员)\1/u.test(String(item.用例描述 || ""))) issues.push(`${label}用例描述重复执行角色`);
    for (const field of ["前置条件", "操作步骤", "预期结果", "备注"]) {
      if (!Array.isArray(item[field]) || item[field].length === 0) issues.push(`${label}${field}必须为非空数组`);
    }
    if (item.预期结果?.length !== 1) issues.push(`${label}必须只有一个预期结果`);
    if (!item.备注?.some((text) => /^规则：BR-/.test(text))) issues.push(`${label}缺少稳定规则标识`);
    const point = comparableText(item.验证用例子项);
    if ((placeholders.verificationPointExact || []).some(value => comparableText(value) === point)) {
      issues.push(`${label}验证用例子项缺少具体观察对象`);
    }
    const descriptionText = String(item.用例描述 || "").replace(/^验证/, "").replace(/（路径\d+）$/, "");
    const description = comparableText(descriptionText);
    const expected = comparableText(item.预期结果?.[0]);
    if (description && description === comparableText(item.功能结构)) issues.push(`${label}用例描述重复功能结构`);
    if ((placeholders.descriptionSuffixes || []).some((suffix) => descriptionText.endsWith(suffix))) {
      issues.push(`${label}用例描述使用通用占位尾词`);
    }
    if ((placeholders.verificationPointSuffixes || []).some((suffix) => String(item.验证用例子项 || "").endsWith(suffix))) {
      issues.push(`${label}验证用例子项使用通用占位尾词`);
    }
    if (point && (point === description || descriptionRepeatsVerificationPoint(item.用例描述, item.验证用例子项, item.功能结构))) {
      issues.push(`${label}验证用例子项重复整个用例描述`);
    }
    if (point && point === expected) issues.push(`${label}验证用例子项与预期结果完全相同`);
    if (description && description === expected) issues.push(`${label}用例描述与预期结果重复`);
    if (/字段$/u.test(String(item.验证用例子项 || ""))) issues.push(`${label}验证用例子项使用字段占位词`);
    if (String(item.验证用例子项 || "").length > 30) issues.push(`${label}验证用例子项超过30个字符`);
    for (const field of ["用例描述", "验证用例子项", "功能结构"]) {
      if (!hasBalancedDelimiters(item[field])) issues.push(`${label}${field}存在未闭合引号或括号`);
    }
    for (const field of ["前置条件", "操作步骤", "预期结果"]) {
      for (const entry of item[field] || []) {
        if (ambiguousPhrases.has(standaloneText(entry))) issues.push(`${label}${field}单独使用含糊表达：${entry}`);
      }
    }
    for (const condition of item.前置条件 || []) {
      if (preconditionActionPatterns.some((pattern) => pattern.test(standaloneText(condition)))) {
        issues.push(`${label}前置条件包含本次操作：${condition}`);
      }
    }
    for (const step of item.操作步骤 || []) {
      const text = standaloneText(step);
      if ((placeholders.stepExact || []).includes(text) || stepPatterns.some((pattern) => pattern.test(text))) {
        issues.push(`${label}操作步骤使用通用占位内容：${step}`);
      }
      if (/尝试触发/u.test(text)) issues.push(`${label}操作步骤使用抽象触发描述：${step}`);
      if (!actionVerbs.some((verb) => text.includes(verb))) issues.push(`${label}操作步骤缺少可执行动作：${step}`);
      if ((placeholders.resultAsActionPatterns || []).some((pattern) => new RegExp(pattern, "u").test(text))) {
        issues.push(`${label}操作步骤把状态或结果当作动作：${step}`);
      }
    }
    if ((item.操作步骤 || []).some((step) => /^按“.+”准备测试数据$/u.test(String(step)))) issues.push(`${label}操作步骤把条件当作动作`);
    if ((item.预期结果 || []).some((entry) => /^\s*\d+[.、]\s*/.test(String(entry)))) {
      issues.push(`${label}预期结果不得包含序号`);
    }
    const resultText = String(item.预期结果?.[0] || "");
    if (expectedCheckPatterns.some((pattern) => pattern.test(standaloneText(resultText)))) issues.push(`${label}预期结果写成检查动作`);
    if (/^(?:提示|显示|展示|更新|关闭|返回|进入|成功|失败)$/u.test(standaloneText(resultText))) issues.push(`${label}预期结果缺少确定内容`);
    if (/绿色|红色|蓝色|灰色|橙色|黄色/u.test(resultText)) issues.push(`${label}默认功能用例包含视觉颜色验证`);
    if (!hasBalancedDelimiters(resultText)) issues.push(`${label}预期结果存在未闭合引号或括号`);
    if (splitAtomicResults(resultText).length !== 1) issues.push(`${label}预期结果仍包含多个独立观察结果`);
    for (const step of item.操作步骤 || []) {
      const normalizedStep = comparableText(step);
      if (normalizedStep && (normalizedStep === description || normalizedStep === expected)) issues.push(`${label}操作步骤与其他字段重复：${step}`);
    }
    if ((item.备注 || []).some((note) => (placeholders.noteExact || []).includes(String(note)))) issues.push(`${label}备注使用冗长固定说明`);
    const sourcePaths = (item.备注 || []).map((note) => String(note).match(/^来源（[^）]+）：(.+?)(?:；|$)/u)?.[1]).filter(Boolean);
    if (new Set(sourcePaths).size !== sourcePaths.length) issues.push(`${label}同一来源文件重复记录`);
    // Calculation obligations follow the observation, not the broad case-type label.
    if (/(?:\d\s*[+×÷*/-]\s*\d\s*=|代入|合计结果|计算结果)/u.test(resultText)) {
      const setup = [...(item.前置条件 || []), ...(item.操作步骤 || [])].join(" ");
      const hasConcreteData = (setup.match(/\d+(?:\.\d+)?/g) || []).length >= 2 || /分母为\s*0/u.test(setup);
      const hasConcreteResult = /(?:计算|合计|期望|RTP|结果).{0,16}(?:为|=).*(?:\d|零)/u.test(resultText) || /代入测试.+(?:为|=|计).*(?:\d|零)/u.test(resultText) || /分母为\s*0.*记\s*0/u.test(resultText);
      if (!hasConcreteData) issues.push(`${label}逻辑校验缺少具体测试数据`);
      if (!hasConcreteResult) issues.push(`${label}逻辑校验缺少可复算的最终值`);
    }
    const observationKey = [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件, item.操作步骤]
      .map((part) => JSON.stringify(part))
      .join("|");
    // Spaces inside test inputs and saved values are business data, not formatting.
    const observationExpected = JSON.stringify(item.预期结果);
    const previousExpected = observationKeys.get(observationKey);
    if (previousExpected && previousExpected !== observationExpected) issues.push(`${label}与其他用例在相同条件、子项和操作下预期结果冲突`);
    observationKeys.set(observationKey, observationExpected);
    const crossFlow = /(?:个人资料.*直播间|直播间.*个人资料|退款.*(?:主播收益|分成)|结算.*(?:财务|主播|公会)|举报.*(?:处置|封禁|关播)|(?:入会|退会).*(?:公会|主播))/u.test(resultText);
    if (crossFlow && !/^FLOW-[A-Z0-9-]+$/u.test(String(item.流程编号 || ""))) issues.push(`${label}跨端或跨模块结果缺少流程编号`);
    const semanticKey = [item.功能模块, item.功能结构, item.前置条件, item.操作步骤, item.预期结果]
      .map((part) => JSON.stringify(part))
      .join("|");
    if (semanticKeys.has(semanticKey)) issues.push(`${label}与其他用例完全重复`);
    semanticKeys.add(semanticKey);
  }

  const questionIds = new Set();
  for (const [index, item] of pending.entries()) {
    const label = item.问题编号 || `需求待确认第${index + 1}行`;
    checkFields(item, pendingFields, label, issues);
    if (questionIds.has(item.问题编号)) issues.push(`${label}问题编号重复`);
    questionIds.add(item.问题编号);
    if (!Array.isArray(item.可选方案) || item.可选方案.length < 2 || item.可选方案.length > 4) issues.push(`${label}可选方案必须为2至4项`);
    for (const field of ["已知依据", "影响范围", "已有用例编号", "确认后待补用例"]) {
      if (!Array.isArray(item[field])) issues.push(`${label}${field}必须为数组`);
    }
    for (const value of Object.values(item).flatMap((entry) => Array.isArray(entry) ? entry : [entry])) {
      if (ambiguousPhrases.has(standaloneText(value))) issues.push(`${label}单独使用含糊表达：${value}`);
    }
  }

  return { 状态: issues.length === 0 ? "通过" : "失败", 测试用例数: cases.length, 需求待确认数: pending.length, 问题: issues };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const jsonFile = process.argv[2];
  if (!jsonFile) {
    process.stderr.write("用法：node scripts/validate-testcase-json.mjs <测试用例JSON>\n");
    process.exitCode = 1;
  } else {
    const metricTaskDir = process.env.TESTCASE_TASK_DIR ? path.resolve(process.env.TESTCASE_TASK_DIR) : null;
    (async () => {
      if (metricTaskDir) await startStage(metricTaskDir, "json-validate", { 输入数量: 1 });
      const result = await validateTestcaseJson(path.resolve(jsonFile));
      if (metricTaskDir) await finishStage(metricTaskDir, "json-validate", {
        输入数量: 1,
        输出数量: result.测试用例数 + result.需求待确认数,
        复用数量: 0,
        问题数量: result.问题.length,
      });
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      if (result.状态 !== "通过") process.exitCode = 1;
    })().catch((error) => {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 1;
    });
  }
}
