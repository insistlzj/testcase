export const TEST_CASE_HEADERS = [
  "序号",
  "用例编号",
  "功能模块",
  "功能结构",
  "用例类型",
  "优先级",
  "用例描述",
  "验证用例子项",
  "前置条件",
  "操作步骤",
  "预期结果",
  "测试结果",
  "测试人员",
  "备注",
];

export const PENDING_HEADERS = [
  "问题编号",
  "功能模块",
  "功能结构",
  "待确认事项",
  "已知依据",
  "缺失信息",
  "影响用例",
  "确认状态",
];

export const CASE_TYPES = ["功能需求", "业务流程", "逻辑校验", "异常用例"];
export const PRIORITIES = ["P0", "P1", "P2", "P3"];
export const TEST_RESULTS = ["未测", "通过", "不通过", "阻塞", "不适用"];
export const CONFIRMATION_STATUSES = ["待确认", "已确认", "无需处理"];

function firstDefined(item, keys, fallback = "") {
  for (const key of keys) {
    if (item && Object.prototype.hasOwnProperty.call(item, key) && item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return fallback;
}

export function asList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
  if (value === undefined || value === null || String(value).trim() === "") {
    return [];
  }
  return String(value)
    .split(/\r?\n/)
    .map((item) => item.replace(/^\s*\d+[.、)]\s*/, "").trim())
    .filter(Boolean);
}

function cleanTitle(value) {
  const title = String(value || "").trim();
  if (!title) return "验证未命名业务场景";
  return title.startsWith("验证") ? title : `验证${title}`;
}

function stripVerify(value) {
  return String(value || "").replace(/^验证/, "").trim();
}

function legacySubItem(item, title) {
  const subPage = String(firstDefined(item, ["page_01", "子页面"], "")).trim();
  const scenario = stripVerify(title);
  if (subPage && subPage !== "/" && subPage !== scenario) {
    return `${subPage}｜${scenario}`;
  }
  return scenario || subPage || "业务场景";
}

function normalizeCase(item) {
  const title = cleanTitle(firstDefined(item, ["用例描述", "title", "用例标题"]));
  return {
    序号: Number(firstDefined(item, ["序号"], 0)) || 0,
    用例编号: String(firstDefined(item, ["用例编号"], "")).trim(),
    功能模块: String(firstDefined(item, ["功能模块", "module", "模块"], "未分类模块")).trim(),
    功能结构: String(firstDefined(item, ["功能结构", "page", "页面"], "/")).trim() || "/",
    用例类型: String(firstDefined(item, ["用例类型", "type", "Type"], "功能需求")).trim(),
    优先级: String(firstDefined(item, ["优先级", "priority", "Priority", "用例优先级"], "P2")).trim(),
    用例描述: title,
    验证用例子项: String(firstDefined(item, ["验证用例子项"], legacySubItem(item, title))).trim(),
    前置条件: asList(firstDefined(item, ["前置条件", "precondition"])),
    操作步骤: asList(firstDefined(item, ["操作步骤", "step"])),
    预期结果: asList(firstDefined(item, ["预期结果", "expected_result"])),
    测试结果: String(firstDefined(item, ["测试结果"], "未测")).trim() || "未测",
    测试人员: String(firstDefined(item, ["测试人员"], "")).trim(),
    备注: asList(firstDefined(item, ["备注", "Remarks"])),
  };
}

function normalizePending(item) {
  return {
    问题编号: String(firstDefined(item, ["问题编号"], "")).trim(),
    功能模块: String(firstDefined(item, ["功能模块", "module", "模块"], "未分类模块")).trim(),
    功能结构: String(firstDefined(item, ["功能结构", "page", "页面"], "/")).trim() || "/",
    待确认事项: String(firstDefined(item, ["待确认事项", "用例描述", "title"], "未命名待确认事项")).trim(),
    已知依据: String(firstDefined(item, ["已知依据"], "")).trim(),
    缺失信息: String(firstDefined(item, ["缺失信息"], "缺少明确的需求、原型、接口或代码契约")).trim(),
    影响用例: String(firstDefined(item, ["影响用例", "用例编号", "title"], "待生成")).trim(),
    确认状态: String(firstDefined(item, ["确认状态"], "待确认")).trim() || "待确认",
  };
}

function payloadArrays(raw) {
  if (Array.isArray(raw)) {
    return { cases: raw, pending: [] };
  }
  if (!raw || typeof raw !== "object") {
    throw new Error("测试用例 JSON 根节点必须是对象或旧版数组");
  }
  const cases = firstDefined(raw, ["测试用例", "test_cases", "cases"], []);
  const pending = firstDefined(raw, ["需求待确认", "pending_questions", "pending"], []);
  if (!Array.isArray(cases) || !Array.isArray(pending)) {
    throw new Error("测试用例和需求待确认必须是数组");
  }
  return { cases, pending };
}

function semanticKey(item) {
  return [
    item.功能模块,
    item.功能结构,
    item.验证用例子项,
    item.前置条件.join("|"),
    item.操作步骤.join("|"),
    item.预期结果.join("|"),
  ].join("::").replace(/\s+/g, "");
}

function mergeUniqueLists(left, right) {
  return [...new Set([...left, ...right])];
}

function dedupeCases(items) {
  const output = [];
  const byKey = new Map();
  for (const item of items) {
    const key = semanticKey(item);
    if (!byKey.has(key)) {
      byKey.set(key, item);
      output.push(item);
      continue;
    }
    const existing = byKey.get(key);
    existing.备注 = mergeUniqueLists(existing.备注, item.备注);
  }
  return output;
}

function extractPendingFromCase(item) {
  const questions = [];
  for (const remark of item.备注) {
    const match = remark.match(/(?:待确认|待验证)[:：]\s*(.+)$/);
    if (!match) continue;
    questions.push(normalizePending({
      功能模块: item.功能模块,
      功能结构: item.功能结构,
      待确认事项: match[1].trim(),
      已知依据: item.备注.filter((value) => value !== remark).join("；"),
      缺失信息: match[1].trim(),
      影响用例: item.用例编号 || item.用例描述,
      确认状态: "待确认",
    }));
  }
  return questions;
}

function dedupePending(items) {
  const output = [];
  const seen = new Set();
  for (const item of items) {
    const key = [item.功能模块, item.功能结构, item.待确认事项].join("::").replace(/\s+/g, "");
    if (!seen.has(key)) {
      seen.add(key);
      output.push(item);
    }
  }
  return output;
}

function assignCaseNumbers(items) {
  const modules = [...new Set(items.map((item) => item.功能模块))];
  const moduleCounters = new Map();
  const modulePrefixes = new Map(modules.map((module, index) => [module, `TC${String(index + 1).padStart(2, "0")}`]));

  return items.map((item, index) => {
    const count = (moduleCounters.get(item.功能模块) || 0) + 1;
    moduleCounters.set(item.功能模块, count);
    return {
      ...item,
      序号: index + 1,
      用例编号: `${modulePrefixes.get(item.功能模块)}-${String(count).padStart(3, "0")}`,
    };
  });
}

export function normalizeTestcasePayload(raw) {
  const { cases: rawCases, pending: rawPending } = payloadArrays(raw);
  const pending = rawPending.map(normalizePending);
  const executable = [];

  for (const rawCase of rawCases) {
    const item = normalizeCase(rawCase);
    if (item.用例类型 === "规则待确认") {
      pending.push(normalizePending({
        功能模块: item.功能模块,
        功能结构: item.功能结构,
        待确认事项: item.用例描述,
        已知依据: item.备注.join("；"),
        缺失信息: "正式规则和可判断的预期结果",
        影响用例: item.验证用例子项,
      }));
      continue;
    }
    executable.push(item);
    pending.push(...extractPendingFromCase(item));
  }

  const cases = assignCaseNumbers(dedupeCases(executable));
  const questions = dedupePending(pending).map((item, index) => ({
    ...item,
    问题编号: `Q-${String(index + 1).padStart(3, "0")}`,
  }));

  validateCanonicalPayload({ 测试用例: cases, 需求待确认: questions });
  return { 测试用例: cases, 需求待确认: questions };
}

export function validateCanonicalPayload(payload) {
  if (!payload || !Array.isArray(payload.测试用例) || !Array.isArray(payload.需求待确认)) {
    throw new Error("规范化结果缺少测试用例或需求待确认数组");
  }
  const ids = new Set();
  payload.测试用例.forEach((item, index) => {
    for (const field of TEST_CASE_HEADERS) {
      if (!Object.prototype.hasOwnProperty.call(item, field)) {
        throw new Error(`第 ${index + 1} 条用例缺少字段：${field}`);
      }
    }
    if (item.序号 !== index + 1) throw new Error(`第 ${index + 1} 条用例序号不连续`);
    if (ids.has(item.用例编号)) throw new Error(`用例编号重复：${item.用例编号}`);
    ids.add(item.用例编号);
    if (!CASE_TYPES.includes(item.用例类型)) throw new Error(`非法用例类型：${item.用例类型}`);
    if (!PRIORITIES.includes(item.优先级)) throw new Error(`非法优先级：${item.优先级}`);
    if (!TEST_RESULTS.includes(item.测试结果)) throw new Error(`非法测试结果：${item.测试结果}`);
    if (!item.用例描述.startsWith("验证")) throw new Error(`用例描述必须以“验证”开头：${item.用例描述}`);
    if (!item.前置条件.length || !item.操作步骤.length || !item.预期结果.length) {
      throw new Error(`正式用例不可缺少前置条件、操作步骤或预期结果：${item.用例编号}`);
    }
  });
  payload.需求待确认.forEach((item, index) => {
    for (const field of PENDING_HEADERS) {
      if (!Object.prototype.hasOwnProperty.call(item, field)) {
        throw new Error(`第 ${index + 1} 条待确认记录缺少字段：${field}`);
      }
    }
    if (!CONFIRMATION_STATUSES.includes(item.确认状态)) {
      throw new Error(`非法确认状态：${item.确认状态}`);
    }
  });
}

export function canonicalToLegacy(item) {
  const [subPage] = String(item.验证用例子项 || "/").split("｜");
  return {
    module: item.功能模块,
    page: item.功能结构,
    type: item.用例类型,
    priority: item.优先级,
    page_01: subPage || "/",
    title: item.用例描述,
    precondition: asList(item.前置条件),
    step: asList(item.操作步骤),
    expected_result: asList(item.预期结果),
    Remarks: asList(item.备注),
  };
}
