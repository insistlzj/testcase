import crypto from "node:crypto";
import {moduleNames} from './prototype-directory.mjs';

const digest = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const text = (value) => typeof value === "string" && value.trim().length > 0;
const compact = (value) => String(value ?? "").replace(/[\s“”"']/gu, "");

export const COVERAGE_DIMENSIONS = [
  "正常主流程", "用户角色", "前置状态", "输入边界", "异常/失败", "中断/取消", "重试/恢复", "重复操作",
  "权限差异", "状态切换", "数据一致性", "重新进入/刷新状态保持", "接口成功但页面状态异常", "页面成功但后端状态未更新", "可观察结果",
];

export function ruleDesignHash(rule) {
  const { 设计复核, ...body } = rule;
  return digest(body);
}

// A calculation is a small data expression, never executable source code.
export function evaluateCalculation(node, variables) {
  if (node && Object.hasOwn(node, "变量")) {
    if (!Object.hasOwn(variables, node.变量) || !Number.isFinite(variables[node.变量])) throw new Error(`缺少数值变量：${node.变量}`);
    return variables[node.变量];
  }
  if (!node || !Array.isArray(node.参数) || node.参数.length < 2) throw new Error("计算表达式必须有运算及至少两个参数");
  const values = node.参数.map((item) => evaluateCalculation(item, variables));
  let value;
  switch (node.运算) {
    case "+": value = values.reduce((sum, item) => sum + item, 0); break;
    case "*": value = values.reduce((product, item) => product * item, 1); break;
    case "min": value = Math.min(...values); break;
    case "max": value = Math.max(...values); break;
    case "ceil":
    case "round": {
      const [amount, places] = values;
      if (values.length !== 2 || amount < 0 || !Number.isInteger(places) || places < 0 || places > 6) throw new Error("四舍五入仅支持非负统计值和 0 至 6 位精度；金额规则须另行明确");
      value = Number(new Intl.NumberFormat('en-US', { useGrouping: false, maximumFractionDigits: places, roundingMode: node.运算 === 'ceil' ? 'ceil' : 'halfExpand' }).format(amount));
      break;
    }
    case "-": value = values.slice(1).reduce((result, item) => result - item, values[0]); break;
    case "/":
      if (values.slice(1).includes(0)) throw new Error("零分母必须单独设计有依据的处理分支");
      value = values.slice(1).reduce((result, item) => result / item, values[0]);
      break;
    default: throw new Error(`不支持的运算：${node.运算}`);
  }
  if (!Number.isFinite(value)) throw new Error("计算结果不是有限数值");
  return value;
}

export function validateRuleDesign(rule, languageRules, { requireReview = true } = {}) {
  const issues = [];
  const check = (condition, message) => { if (!condition) issues.push(message); };
  const design = rule.用例设计;
  if (!design || typeof design !== "object") return ["缺少结构化用例设计，须回到当前证据完成生成复核"];
  const evidence = rule.证据引用 || [];
  const refs = (indexes) => Array.isArray(indexes) && indexes.length > 0
    && indexes.every((index) => Number.isInteger(index) && index >= 0 && index < evidence.length);
  for (const field of ["场景", "验证子项", "观察页面", "观察对象", "观察端", "设计说明"]) check(text(design[field]), `用例设计缺少${field}`);
  check(["功能需求", "业务流程", "逻辑校验", "异常用例"].includes(design.用例类型), "须明确填写合法用例类型，不得使用缺省值");
  check(["P0", "P1", "P2", "P3"].includes(design.优先级), "须明确填写合法优先级，不得使用缺省值");
  check(text(design.优先级依据), "缺少该验证点的优先级依据");
  check(!(languageRules.forbiddenPlaceholders.verificationPointExact || []).includes(design.验证子项?.trim()), "验证子项缺少具体观察对象");
  check(refs(design.观察证据), "观察位置缺少有效证据映射");
  check(Array.isArray(design.步骤) && design.步骤.length > 0, "用例设计缺少步骤");
  check(rule.适用角色和端?.some((value) => value.startsWith(`${design.观察端}-`)), "观察端与规则归属不一致");
  const verbs = Object.values(languageRules.actionVerbs).flat();
  const preconditionActionPatterns = (languageRules.forbiddenPlaceholders.preconditionActionPatterns || []).map((pattern) => new RegExp(pattern, "u"));
  for (const condition of rule.必要条件 || []) {
    check(!preconditionActionPatterns.some((pattern) => pattern.test(String(condition).trim())), `前置条件包含本次操作：${condition}`);
  }
  for (const [index, step] of (design.步骤 || []).entries()) {
    check(step.执行角色 === rule.执行角色, `步骤${index + 1}执行角色与本端角色不一致，外部触发应单列配合条件`);
    check(verbs.includes(step.动作), `步骤${index + 1}动作未使用统一词表`);
    check(text(step.对象) && text(step.操作), `步骤${index + 1}缺少具体对象或执行内容`);
    check(compact(step.操作).includes(compact(step.动作)) && compact(step.操作).includes(compact(step.对象)), `步骤${index + 1}文本与动作对象映射不一致`);
    check(refs(step.证据), `步骤${index + 1}缺少有效入口或动作证据映射`);
  }
  check(Object.hasOwn(design, "计算"), "须明确本观察点是否涉及数值计算");
  if (design.计算 !== null && design.计算 !== undefined) {
    const calculation = design.计算;
    for (const field of ["公式", "数据范围", "结果单位"]) check(text(calculation[field]), `计算缺少${field}`);
    check(refs(calculation.证据), "计算公式缺少有效来源");
    check(Array.isArray(calculation.变量) && calculation.变量.length > 0, "计算缺少业务变量");
    const variables = {};
    for (const variable of calculation.变量 || []) {
      check(text(variable.名称) && text(variable.业务含义) && text(variable.单位), "计算变量缺少名称、业务含义或单位");
      check(!Object.hasOwn(variables, variable.名称), "计算变量名称重复");
      check(Number.isFinite(variable.数值), "计算变量必须为有限数值");
      variables[variable.名称] = variable.数值;
    }
    try {
      const actual = evaluateCalculation(calculation.表达式, variables);
      check(Number.isFinite(calculation.最终值) && Math.abs(actual - calculation.最终值) <= 1e-9 * Math.max(1, Math.abs(actual)), "公式独立复算与最终值不一致");
    } catch (error) { issues.push(error.message); }
    const resultNumbers = [...String(rule.目标状态或可观察结果).matchAll(/[=＝]\s*([-+]?\d+(?:,\d{3})*(?:\.\d+)?(?:[eE][-+]?\d+)?)/gu)];
    const displayed = resultNumbers.at(-1)?.[1];
    check(displayed !== undefined && Number(displayed.replaceAll(',', '')) === calculation.最终值,
      "正式预期算式末项与已复算的最终值不一致，不得用子串或运算输入代替结果");
  }
  for (const dependency of design.外部配合 || []) {
    for (const field of ["角色", "端", "动作", "时点", "共同对象"]) check(text(dependency[field]), `外部配合缺少${field}`);
    check(refs(dependency.证据), "外部配合缺少来源");
    check((rule.必要条件 || []).some((condition) => condition.includes(dependency.动作)), "外部配合没有写入前置条件");
  }
  if (requireReview) {
    check(rule.设计复核?.状态 === "通过" && text(rule.设计复核?.说明), "设计语义复核未完成");
    check(rule.设计复核?.设计SHA256 === ruleDesignHash(rule), "设计复核已失效，修改后必须重新核对证据");
  }
  return issues;
}

export function caseFromRule(rule, sequence, prefix) {
  return renderCase(rule, sequence, prefix, {});
}

function renderCase(rule, sequence, prefix, trace) {
  const design = rule.用例设计;
  if (!design) throw new Error(`${rule.稳定规则标识}缺少用例设计`);
  if (!text(design.验证子项)) throw new Error(`${rule.稳定规则标识}缺少明确验证子项，须补齐设计，不得猜测或填充默认值`);
  if (!text(design.优先级依据) || !["P0", "P1", "P2", "P3"].includes(design.优先级) || !["功能需求", "业务流程", "逻辑校验", "异常用例"].includes(design.用例类型)) throw new Error(`${rule.稳定规则标识}缺少明确的类型、优先级及依据`);
  if (rule.设计复核?.状态 !== "通过" || rule.设计复核?.设计SHA256 !== ruleDesignHash(rule)) throw new Error(`${rule.稳定规则标识}设计尚未复核或复核已失效`);
  return {
    序号: sequence, 用例编号: `${prefix}-${String(sequence).padStart(4, "0")}`,
    功能模块: rule.功能模块, 功能结构: rule.功能结构,
    用例类型: design.用例类型, 优先级: design.优先级,
    用例描述: design.场景, 验证用例子项: design.验证子项,
    前置条件: rule.必要条件, 操作步骤: design.步骤.map((step) => step.操作),
    预期结果: [rule.目标状态或可观察结果], 流程编号: rule.跨模块流程编号 || "",
    测试结果: "未测", 测试人员: "",
    备注: [...evidenceNotes(rule.证据引用),
      `规则：${trace.规则标识 || rule.稳定规则标识}`, ...(trace.分支标识 ? [`分支：${trace.分支标识}`] : []),
      ...(rule.规则状态 === '实现推导' ? ['实现推导：预期来自当前实现，尚未确认为业务需求'] : []),
      "未动态验证", ...(design.备注 || [])],
  };
}

export function coverageBranches(rule) {
  return Array.isArray(rule.场景分支) && rule.场景分支.length
    ? rule.场景分支.map((branch) => ({ ...branch, 原子规则: branch.原子规则 }))
    : [{ 分支标识: `${rule.稳定规则标识}-B01`, 变化维度: ["正常主流程", "可观察结果"], 有效条件: rule.必要条件 || [], 拆分原因: "当前规则只有一个证据明确的结果分支", 原子规则: rule }];
}

export function casesFromRule(rule, startSequence, prefix) {
  return coverageBranches(rule)
    .filter((branch) => branch.原子规则?.可生成正式用例)
    .map((branch, index) => renderCase(branch.原子规则, startSequence + index, prefix, {
      规则标识: rule.稳定规则标识,
      分支标识: branch.分支标识,
    }));
}

export function casesFromCatalog(catalog, {moduleDirectory, coverageV2 = false, prefix = 'CASE'} = {}) {
  const modules=moduleDirectory ? moduleNames(moduleDirectory,catalog.目标范围.端名) : null;
  const endPrefix={'用户App':'USER','公会App':'GUILD','管理后台':'ADMIN'}[catalog.目标范围.端名];
  const counters=new Map(), cases=[];
  for (const rule of catalog.规则) {
    const rows=coverageV2 ? casesFromRule(rule,cases.length+1,prefix) : rule.可生成正式用例 ? [caseFromRule(rule,cases.length+1,prefix)] : [];
    for (const row of rows) {
      if (modules) {
        const index=modules.indexOf(row.功能模块);
        if (index<0 || !endPrefix) throw new Error('用例模块或端不属于 MainBasis 原型目录');
        const count=(counters.get(row.功能模块)||0)+1; counters.set(row.功能模块,count);
        row.用例编号=`${endPrefix}-${String(index+1).padStart(2,'0')}-${String(count).padStart(4,'0')}`;
      }
      cases.push(row);
    }
  }
  return cases;
}

export function validateCoverageExpansion(rule, languageRules) {
  const issues = [];
  const reviews = rule.覆盖判断;
  const branches = coverageBranches(rule);
  if (!Array.isArray(reviews)) return ["缺少覆盖判断"];
  const reviewMap = new Map(reviews.map((item) => [item.维度, item]));
  for (const dimension of COVERAGE_DIMENSIONS) {
    const review = reviewMap.get(dimension);
    if (!review) issues.push(`覆盖判断缺少${dimension}`);
    else if (!["已覆盖", "待确认", "不适用"].includes(review.状态) || !text(review.原因)) issues.push(`${dimension}必须给出合法状态和原因`);
  }
  if (reviewMap.size !== COVERAGE_DIMENSIONS.length) issues.push("覆盖判断包含重复或未知维度");
  const branchIds = new Set();
  for (const branch of branches) {
    if (!text(branch.分支标识) || branchIds.has(branch.分支标识)) issues.push("场景分支标识缺失或重复");
    branchIds.add(branch.分支标识);
    if (!Array.isArray(branch.变化维度) || !branch.变化维度.length || branch.变化维度.some((item) => !COVERAGE_DIMENSIONS.includes(item))) issues.push(`${branch.分支标识 || "未知分支"}变化维度无效`);
    if (!Array.isArray(branch.有效条件) || !branch.有效条件.length || !text(branch.拆分原因)) issues.push(`${branch.分支标识 || "未知分支"}缺少有效条件或拆分原因`);
    if (!branch.原子规则) issues.push(`${branch.分支标识 || "未知分支"}缺少原子规则`);
    else if (branch.原子规则.可生成正式用例) issues.push(...validateRuleDesign(branch.原子规则, languageRules).map((item) => `${branch.分支标识}：${item}`));
  }
  return issues;
}

function evidenceNotes(sources) {
  const grouped = new Map();
  for (const source of sources) {
    if (!grouped.has(source.路径)) grouped.set(source.路径, new Set());
    grouped.get(source.路径).add(source.位置);
  }
  const typeOf = sourcePath => sourcePath.includes('/context/') ? '需求文档'
    : sourcePath.includes('/prototype/annotations/') ? '原型批注'
      : sourcePath.includes('/prototype/assets/') ? '原型脚本'
        : sourcePath.includes('/prototype/') ? '原型页面'
          : sourcePath.endsWith('/项目说明.md') ? '项目说明' : '当前证据';
  return [...grouped].map(([sourcePath, positions]) => `来源（${typeOf(sourcePath)}）：${sourcePath}；位置：${[...positions].join('、')}`);
}

export function ruleBusinessKey(rule) {
  // Preserve signs, negation, role, conditions and inputs. Similar text is only a review clue.
  return JSON.stringify([rule.业务对象, rule.执行角色, rule.适用角色和端,
    [...(rule.必要条件 || [])].sort(), rule.触发动作, rule.来源状态,
    rule.目标状态或可观察结果, rule.用例设计?.观察端, rule.用例设计?.观察页面,
    rule.用例设计?.观察对象, rule.用例设计?.步骤]);
}
