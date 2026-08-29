import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import { validateTestcaseArtifacts } from "../../scripts/validate-testcase-json.mjs";

const projectRoot = "/Users/geekonup/testcase";
const workDir = path.join(projectRoot, "work/xeta-vehicle-sku-price");
const outputDir = path.join(projectRoot, "outputs/XETA-case");
const jsonPath = path.join(workDir, "总部后台-车辆SKU价格-测试用例.json");
const qualityPath = path.join(workDir, "总部后台-车辆SKU价格-测试用例-质量上下文.json");
const reportPath = path.join(workDir, "总部后台-车辆SKU价格-质量检查报告.json");
const dateCode = "260827";
const MODULE = "车辆SKU价格管理";

const caseHeaders = [
  "序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述",
  "验证用例子项", "前置条件", "操作步骤", "预期结果", "测试结果", "测试人员", "备注",
];
const questionHeaders = [
  "问题编号", "功能模块", "功能结构", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态",
];
const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionStatus = new Set(["待确认", "已确认", "无需处理"]);

const evidence = [
  {
    证据编号: "E-001", 来源类型: "原型明确说明", 位置: "xeta-proto/prototype/原型规范.md",
    可证明规则: "审核通过的原型及批注是当前开发、测试和验收的唯一事实来源。",
    适用性: "当前适用", 适用说明: "规范明确声明当前原型的事实源地位。",
  },
  {
    证据编号: "E-002", 来源类型: "原型明确说明", 位置: "xeta-proto/prototype/pages/list.html",
    可证明规则: "整车维护入口、车型列表、添加车型、车型必填字段、版本入口和ERP料号选择入口。",
    适用性: "当前适用", 适用说明: "属于当前审核通过原型。",
  },
  {
    证据编号: "E-003", 来源类型: "原型明确说明", 位置: "xeta-proto/prototype/pages/create.html",
    可证明规则: "添加版本字段、主图限制、参数、SKU必填字段、提交确认和首次价格审批规则。",
    适用性: "当前适用", 适用说明: "属于当前审核通过原型。",
  },
  {
    证据编号: "E-004", 来源类型: "原型明确说明", 位置: "xeta-proto/prototype/pages/edit.html",
    可证明规则: "编辑页字段回显、待审字段锁定、保存入口、保存提交入口和新增颜色。",
    适用性: "当前适用", 适用说明: "属于当前审核通过原型。",
  },
  {
    证据编号: "E-005", 来源类型: "原型明确说明", 位置: "xeta-proto/prototype/assets/common.js",
    可证明规则: "添加车型、ERP单选、提交规则拦截、提交确认和审核页跳转交互。",
    适用性: "当前适用", 适用说明: "用于补充当前原型可执行交互。",
  },
  {
    证据编号: "E-006", 来源类型: "原型明确说明", 位置: "xeta-proto/prototype/pages/audit.html",
    可证明规则: "商品定价审批列表展示价格类型、调整前、调整后、审批状态和执行状态。",
    适用性: "当前适用", 适用说明: "属于当前审核通过原型。",
  },
  {
    证据编号: "E-007", 来源类型: "正式需求", 位置: "xeta-proto/prototype/审批执行状态-改动说明.md",
    可证明规则: "审批状态、可选执行人、待执行与已执行状态，以及全国零售价不进入执行阶段。",
    适用性: "当前适用", 适用说明: "当前原型配套改动说明。",
  },
  {
    证据编号: "E-008", 来源类型: "接口契约", 位置: "xeta-server-test/doc/接口变更说明/20260805_105146_整车价格规则审核状态接口对接文档.md",
    可证明规则: "PENDING、REJECTED、EFFECTIVE状态下当前价格与目标价格的业务含义。",
    适用性: "当前适用", 适用说明: "正式对接文档用于证明页面所依赖的价格状态语义，不在用例中校验接口字段。",
  },
  {
    证据编号: "E-009", 来源类型: "正式需求", 位置: "xeta-server-test/doc/接口变更说明/20260716_142802_JiaXiangLiu-20260714-20260715-前端对接说明.md",
    可证明规则: "采购价审批中阻止采购折扣申请，采购价生效后原采购折扣自动失效。",
    适用性: "当前适用", 适用说明: "正式前端对接说明明确给出业务联动和验收项。",
  },
  {
    证据编号: "E-010", 来源类型: "正式需求", 位置: "xeta-server-test/doc/接口变更说明/20260528_150638_通用审批规则配置前端对接说明-20260528.md",
    可证明规则: "历史方案曾描述价格调整不再走独立审批。",
    适用性: "历史不适用", 适用说明: "E-001明确当前审核通过原型为唯一事实源，当前原型E-003/E-004已明确价格提交审批。",
  },
  {
    证据编号: "E-011", 来源类型: "代码", 位置: "xeta-server-test/product/src/main/java/com/geekonup/xeta/product/service/VersionService.java",
    可证明规则: "当前创建、编辑和审批实现仅用于发现风险。",
    适用性: "辅助风险", 适用说明: "静态代码行为不单独证明业务预期，未动态验证。",
  },
  {
    证据编号: "E-012", 来源类型: "已有用例", 位置: "xeta-server-test/doc/测试用例/晞塔-管理后台web测试用例.xlsx",
    可证明规则: "历史测试点仅用于去重和识别缺口。",
    适用性: "辅助风险", 适用说明: "已有用例不是当前业务预期的独立证据。",
  },
  {
    证据编号: "E-013", 来源类型: "用户确认", 位置: "当前任务：重写新建车辆和编辑车辆SKU价格用例并统一解决已发现问题",
    可证明规则: "本次交付范围为总部后台业务功能，不包含接口字段级测试。",
    适用性: "当前适用", 适用说明: "用户在当前任务中确认重写范围。",
  },
];
const evidenceMap = new Map(evidence.map((item) => [item.证据编号, item]));

function evidenceNotes(...ids) {
  return ids.map((id) => {
    const item = evidenceMap.get(id);
    assert(item, `未知证据编号：${id}`);
    const suffix = item.来源类型 === "代码" ? "；当前代码静态分析，未动态验证" : "";
    return `证据：${id}；来源类型：${item.来源类型}；位置：${item.位置}${suffix}`;
  });
}

const requirementSpecs = [
  ["entry", "E-002", "整车维护", "可从商品中心进入整车商品信息维护并进入版本新增、编辑页面"],
  ["modelFields", "E-002", "车型", "添加车型展示必填车型名称和必填车型主图"],
  ["modelCreate", "E-002 E-005", "车型", "填写车型名称和主图后可以创建车型"],
  ["modelRequired", "E-002 E-005", "车型", "车型名称或车型主图为空时不创建车型"],
  ["modelNoDelete", "E-002", "车型", "车型创建后不提供删除操作"],
  ["versionFields", "E-003", "车辆版本", "添加版本展示所属车型、版本名称、描述和主图"],
  ["versionRequired", "E-003", "车辆版本", "版本名称、描述和主图为必填项"],
  ["versionImage", "E-003", "版本主图", "仅支持JPG或PNG且文件不超过10MB"],
  ["versionCreate", "E-003 E-005", "车辆版本", "填写版本、参数、SKU和价格后创建版本并提交审批"],
  ["parameters", "E-003", "版本参数", "可以添加和删除参数行"],
  ["skuRow", "E-003", "车辆SKU", "添加颜色后新增SKU行"],
  ["skuRequired", "E-003", "车辆SKU", "颜色、规格图片、三类价格和ERP料号为必填项"],
  ["erpSelect", "E-002 E-005", "ERP料号", "ERP料号采用单选，已关联料号不可选，确认后回显"],
  ["submitCopy", "E-003", "提交确认", "车辆信息直接生效，采购价和激励每次必审，零售价首次必审"],
  ["firstPriceApproval", "E-003 E-006", "新建SKU价格", "新版本三类价格提交后在商品定价审批列表形成待审批记录"],
  ["editDisplay", "E-004", "版本编辑", "编辑页回显版本、参数和SKU数据"],
  ["editLock", "E-004", "待审批价格", "待审批的基础采购价和激活激励不可编辑"],
  ["editPersist", "E-004", "版本编辑", "版本名称、描述、参数和规格图片保存后持久化"],
  ["editPriceApproval", "E-004 E-006", "编辑SKU价格", "采购价和激励修改后形成对应待审批记录"],
  ["editAddSku", "E-004 E-006", "编辑新增SKU", "编辑页可以新增SKU并提交三类价格审批"],
  ["pendingCurrent", "E-008", "价格审批中", "审批中保留当前生效价格并显示目标价格"],
  ["rejectedCurrent", "E-008", "价格审批驳回", "驳回后保留当前生效价格"],
  ["effectiveCurrent", "E-008", "价格审批生效", "生效后当前价格更新为目标价格"],
  ["executionStatus", "E-006 E-007", "审批执行状态", "按价格类型和执行人配置展示通过、待执行或无执行状态"],
  ["discountBlock", "E-009", "采购折扣", "基础采购价审批中阻止采购折扣申请"],
  ["discountTerminate", "E-009", "采购折扣", "基础采购价生效后原采购折扣自动失效并记录原因"],
  ["modelConstraints", "E-002 E-011 E-012", "车型字段", "车型名称唯一性、长度和主图上传限制缺少正式规则"],
  ["versionConstraints", "E-003 E-011 E-012", "版本字段", "版本名称唯一性、字段长度缺少正式规则"],
  ["skuImageConstraints", "E-003 E-011", "规格图片", "规格图片格式、大小和替换限制缺少正式规则"],
  ["priceDomain", "E-003 E-011 E-012", "价格字段", "最小值、最大值、精度、舍入和输入格式缺少正式规则"],
  ["colorUnique", "E-003 E-011", "SKU颜色", "同版本颜色唯一规则缺失"],
  ["unsavedExit", "E-003 E-004", "未保存内容", "返回、刷新或关闭页面的保护规则缺失"],
  ["idempotency", "E-011", "重复提交", "重复点击、超时和重试的幂等规则缺失"],
  ["partialFailure", "E-011", "跨服务提交", "多类审批部分失败时的回滚和补偿规则缺失"],
  ["repeatPending", "E-008 E-011", "重复价格申请", "已有待审批价格时再次提交的规则缺失"],
  ["executionTiming", "E-007 E-008", "价格执行", "配置执行人后的最终价格写入时点缺失"],
  ["retailSubsequent", "E-003 E-011", "全国零售价", "首次审批后的再次修改是否免审缺少正式规则"],
  ["colorEdit", "E-004 E-011", "已有SKU颜色", "已有SKU颜色可编辑状态范围缺失"],
  ["erpEdit", "E-004 E-011", "已有SKU ERP料号", "补绑或更换ERP料号的状态限制缺失"],
  ["retailLock", "E-004 E-008", "待审批全国零售价", "待审批期间是否锁定零售价输入框缺失"],
  ["permissions", "E-011 E-013", "角色权限", "车型、版本和价格操作的权限矩阵与数据范围缺失"],
  ["ruleUnavailable", "E-004 E-011", "审批规则异常", "全国零售价规则不可用时的页面反馈缺失"],
  ["skuInitialState", "E-003 E-011", "新增SKU", "审批通过前后的采购侧和零售侧初始状态缺失"],
  ["unsavedSkuDelete", "E-004", "未保存SKU行", "编辑页新增但未保存的SKU行删除规则缺失"],
];

const coverageSpecs = [
  ["entry", "页面入口", "整车维护", "新增与编辑入口"],
  ["modelMain", "主流程", "车型", "创建并刷新回显"],
  ["modelValidation", "字段校验", "车型", "必填与取消"],
  ["versionMain", "主流程", "车辆版本", "创建、结果与去向"],
  ["versionValidation", "字段校验", "车辆版本", "必填"],
  ["uploadBoundary", "边界值", "版本主图", "格式与10MB边界"],
  ["parameters", "结构操作", "版本参数", "新增与删除"],
  ["skuStructure", "结构操作", "车辆SKU", "新增颜色"],
  ["skuValidation", "字段校验", "车辆SKU", "必填"],
  ["erp", "关联规则", "ERP料号", "选择、禁选、确认与取消"],
  ["submitCopy", "业务说明", "价格提交", "提交确认口径"],
  ["firstApproval", "审批生命周期", "新建SKU价格", "待审批记录"],
  ["editDisplay", "页面回显", "版本编辑", "字段与锁定状态"],
  ["editPersist", "数据一致性", "版本编辑", "保存后刷新回显"],
  ["editApproval", "审批生命周期", "编辑SKU价格", "待审批记录"],
  ["addSku", "主流程", "编辑新增SKU", "保存与价格审批"],
  ["pending", "状态转换", "价格审批", "审批中保持当前值"],
  ["rejected", "状态转换", "价格审批", "驳回保持当前值"],
  ["effective", "状态转换", "价格审批", "生效更新当前值"],
  ["execution", "状态转换", "审批执行", "通过、待执行与不执行"],
  ["discount", "跨页面一致性", "采购价与采购折扣", "申请阻断与自动失效"],
  ["dataGaps", "证据缺口", "字段与数据边界", "输入约束待确认"],
  ["stateGaps", "证据缺口", "状态与生效", "状态规则待确认"],
  ["reliabilityGaps", "证据缺口", "可靠性", "幂等、回滚与恢复待确认"],
  ["permissionGaps", "证据缺口", "权限", "角色和数据范围待确认"],
  ["interactionGaps", "证据缺口", "编辑交互", "退出、修改和删除待确认"],
];

const requirementTrace = new Map(requirementSpecs.map(([key]) => [key, { cases: [], questions: [] }]));
const coverageTrace = new Map(coverageSpecs.map(([key]) => [key, { cases: [], questions: [] }]));
const cases = [];

function trace(target, keys, type, id) {
  for (const key of keys) {
    const entry = target.get(key);
    assert(entry, `未知追溯键：${key}`);
    entry[type].push(id);
  }
}

function add(structure, type, priority, description, point, preconditions, steps, expected, evidenceIds, requirementKeys, coverageKeys) {
  const sequence = cases.length + 1;
  const id = `VSP-${String(sequence).padStart(3, "0")}`;
  cases.push({
    序号: sequence, 用例编号: id, 功能模块: MODULE, 功能结构: structure, 用例类型: type,
    优先级: priority, 用例描述: description, 验证用例子项: point, 前置条件: preconditions,
    操作步骤: steps, 预期结果: [expected], 测试结果: "未测", 测试人员: "", 备注: evidenceNotes(...evidenceIds),
  });
  trace(requirementTrace, requirementKeys, "cases", id);
  trace(coverageTrace, coverageKeys, "cases", id);
  return id;
}

function versionData(label, overrides = "") {
  const values = {
    版本名称: `${label}-执行时间戳yyyyMMddHHmmss`,
    版本描述: "城市通勤测试版本",
    版本主图: "version-main.jpg（2MB）",
    SKU颜色: "曜石黑",
    规格图片: "sku-black.png（1MB）",
    全国零售价: "1200.00元",
    基础采购价: "1000.00元",
    激活激励: "100.00元",
    ERP料号: "从未占用数据池领取并在用例后释放",
  };
  const missingField = Object.keys(values).find((field) => overrides === `${field}=留空`);
  if (missingField) values[missingField] = "留空";
  const fields = Object.entries(values).map(([field, value]) => `${field}=${value}`).join("，");
  const extra = overrides && !missingField ? `，${overrides}` : "";
  return `测试数据：${fields}，参数=车辆长度1875mm${extra}`;
}

function editData(label, overrides = "") {
  return `测试数据：版本=小骑士/${label}，SKU=曜石黑，当前全国零售价=1200.00元，当前基础采购价=1000.00元，当前激活激励=100.00元${overrides ? `，${overrides}` : ""}`;
}

// 入口与车型
add("车辆维护入口", "业务流程", "P0", "验证总部后台进入整车商品信息维护", "整车维护入口",
  ["总部后台用户已登录"], ["进入商品中心", "打开整车商品信息维护"],
  "页面标题显示“整车商品信息维护”。", ["E-002", "E-013"], ["entry"], ["entry"]);
add("车辆维护入口", "业务流程", "P1", "验证从车型进入添加版本规格", "添加版本入口",
  ["车型“小骑士”显示在左侧车型列表"], ["打开车型“小骑士”", "点击“+ 添加版本规格”"],
  "页面标题显示“添加版本规格”。", ["E-002", "E-003"], ["entry"], ["entry"]);
add("车辆维护入口", "业务流程", "P1", "验证从版本列表进入编辑页", "版本编辑入口",
  ["车型“小骑士”存在版本“普通版”"], ["打开车型“小骑士”", "点击“普通版”行的“编辑”"],
  "页面标题显示“版本编辑”。", ["E-002", "E-004"], ["entry"], ["entry"]);

add("新建车型", "功能需求", "P2", "验证添加车型弹窗展示车型名称", "车型名称字段",
  ["用户已进入整车商品信息维护"], ["点击“+ 添加车型”"],
  "添加车型弹窗显示必填的车型名称字段。", ["E-002"], ["modelFields"], ["modelValidation"]);
add("新建车型", "功能需求", "P2", "验证添加车型弹窗展示车型主图", "车型主图字段",
  ["用户已进入整车商品信息维护"], ["点击“+ 添加车型”"],
  "添加车型弹窗显示必填的车型主图字段。", ["E-002"], ["modelFields"], ["modelValidation"]);
add("新建车型", "业务流程", "P0", "验证填写车型名称和主图后创建车型", "车型创建后持久化",
  ["测试数据：车型名称=星驰-执行时间戳yyyyMMddHHmmss，车型主图=series-main.jpg（1200×800，2MB），用例结束后按测试环境恢复流程清理车型"],
  ["点击“+ 添加车型”", "填写本条测试数据中的车型名称", "上传series-main.jpg", "点击“确定”", "刷新整车商品信息维护页"],
  "刷新后左侧车型列表中显示本条车型名称。", ["E-002", "E-005"], ["modelCreate"], ["modelMain"]);
add("新建车型", "逻辑校验", "P1", "验证车型名称为空时不创建车型", "车型名称必填",
  ["测试数据：车型名称=留空，车型主图=series-main.jpg（2MB），提交前记录左侧车型数量N"],
  ["点击“+ 添加车型”", "上传series-main.jpg", "点击“确定”", "刷新整车商品信息维护页"],
  "刷新后左侧车型数量仍为N。", ["E-002", "E-005"], ["modelRequired"], ["modelValidation"]);
add("新建车型", "逻辑校验", "P1", "验证车型主图为空时不创建车型", "车型主图必填",
  ["测试数据：车型名称=无主图-执行时间戳yyyyMMddHHmmss，车型主图=留空，用例结束后确认没有同名车型"],
  ["点击“+ 添加车型”", "填写本条测试数据中的车型名称", "点击“确定”", "刷新整车商品信息维护页"],
  "刷新后左侧车型列表中不存在本条车型名称。", ["E-002"], ["modelRequired"], ["modelValidation"]);
add("新建车型", "业务流程", "P2", "验证取消添加车型不创建记录", "取消添加车型",
  ["测试数据：车型名称=取消创建-执行时间戳yyyyMMddHHmmss，车型主图=series-main.jpg（2MB）"],
  ["点击“+ 添加车型”", "填写本条测试数据中的车型名称", "上传series-main.jpg", "点击“取消”", "刷新整车商品信息维护页"],
  "刷新后左侧车型列表中不存在本条车型名称。", ["E-002", "E-005"], ["modelCreate"], ["modelValidation"]);
add("新建车型", "功能需求", "P2", "验证已创建车型不提供删除操作", "车型不可删除",
  ["左侧车型列表存在车型“小骑士”"], ["打开车型“小骑士”", "查看车型级操作入口"],
  "车型“小骑士”的操作区域不显示删除入口。", ["E-002"], ["modelNoDelete"], ["modelValidation"]);

// 添加版本基础信息与图片
add("添加版本-基础信息", "功能需求", "P2", "验证添加版本时所属车型不可编辑", "所属车型只读",
  ["已从车型“小骑士”进入添加版本规格页"], ["点击所属车型字段", "尝试修改字段内容"],
  "所属车型字段保持只读。", ["E-003"], ["versionFields"], ["versionValidation"]);

for (const [field, label] of [["版本名称", "名称为空"], ["版本描述", "描述为空"], ["版本主图", "主图为空"]]) {
  add("添加版本-基础信息", "逻辑校验", "P1", `验证${field}为空时不创建版本`, `${field}必填`,
    [versionData(`VSP-${label}`, `${field}=留空`), "车型“小骑士”当前版本列表中不存在本条版本名称"],
    ["进入“小骑士”的添加版本规格页", `保持${field}为空`, "填写本条测试数据中的其余字段", "点击“保存并提交审批”", "刷新“小骑士”的版本列表"],
    "刷新后“小骑士”的版本列表中不存在本条版本名称。", ["E-003"], ["versionRequired"], ["versionValidation"]);
}

for (const [file, expected, priority] of [
  ["version-main.jpg（2MB）", "版本主图区域显示version-main.jpg预览。", "P2"],
  ["version-main.png（2MB）", "版本主图区域显示version-main.png预览。", "P2"],
  ["version-10mb.jpg（恰好10MB）", "版本主图区域显示version-10mb.jpg预览。", "P1"],
  ["version-over.jpg（10MB+1KB）", "版本主图区域不显示version-over.jpg预览。", "P1"],
  ["version-main.gif（2MB）", "版本主图区域不显示version-main.gif预览。", "P2"],
]) {
  const accepted = !file.includes("over") && !file.includes("gif");
  add("添加版本-基础信息", accepted ? "逻辑校验" : "异常用例", priority,
    `验证版本主图${accepted ? "接收" : "拒绝"}${file.split("（")[0]}`, `版本主图${accepted ? "有效" : "无效"}边界`,
    [`测试数据：版本主图=${file}`], ["进入添加版本规格页", `选择${file.split("（")[0]}`], expected,
    ["E-003"], ["versionImage"], ["uploadBoundary"]);
}

add("添加版本-基础信息", "业务流程", "P0", "验证填写版本参数和SKU后创建版本", "完整创建后持久化",
  ["车型“小骑士”已存在", "三类价格审批规则处于生效状态", versionData("城市版")],
  ["进入“小骑士”的添加版本规格页", "填写本条测试数据中的版本信息", "填写车辆长度1875", "填写曜石黑SKU", "关联本条未占用ERP料号", "点击“保存并提交审批”", "返回整车商品信息维护并刷新版本列表"],
  "刷新后“小骑士”的版本列表中显示本条版本名称。", ["E-003", "E-005"], ["versionCreate"], ["versionMain"]);
add("添加版本-基础信息", "业务流程", "P1", "验证完整版本提交后展示创建结果", "创建结果提示",
  ["车型“小骑士”已存在", "三类价格审批规则处于生效状态", versionData("结果提示")],
  ["进入“小骑士”的添加版本规格页", "填写本条测试数据中的全部字段", "关联本条未占用ERP料号", "点击“保存并提交审批”"],
  "页面显示“已创建并提交审批”结果弹窗。", ["E-003", "E-005"], ["versionCreate"], ["versionMain"]);
add("添加版本-基础信息", "业务流程", "P2", "验证创建结果可以返回车型列表", "创建后返回列表",
  ["已创建并提交审批结果弹窗处于打开状态"], ["点击“返回列表”"],
  "页面标题显示“整车商品信息维护”。", ["E-003", "E-005"], ["versionCreate"], ["versionMain"]);
add("添加版本-基础信息", "业务流程", "P2", "验证创建结果可以查看审核进度", "创建后查看审核",
  ["已创建并提交审批结果弹窗处于打开状态"], ["点击“查看审核进度”"],
  "页面标题显示“商品定价审批”。", ["E-003", "E-005"], ["versionCreate"], ["versionMain"]);

// 参数与SKU必填
add("添加版本-参数", "功能需求", "P2", "验证添加参数新增参数行", "新增参数行",
  ["添加版本规格页已打开"], ["点击“+ 添加参数”"], "版本参数表新增一条参数行。",
  ["E-003"], ["parameters"], ["parameters"]);
add("添加版本-参数", "功能需求", "P2", "验证删除参数移除参数行", "删除参数行",
  ["版本参数表存在参数“车辆长度 (mm)”"], ["点击该参数行的“删除”"], "版本参数表不再显示“车辆长度 (mm)”行。",
  ["E-003"], ["parameters"], ["parameters"]);
add("添加版本-SKU", "功能需求", "P1", "验证添加颜色新增SKU行", "新增SKU行",
  ["测试数据：新增SKU颜色=极光银-执行时间戳yyyyMMddHHmmss，用例离开页面前不保存该行"],
  ["进入添加版本规格页", "点击“+ 添加颜色”"], "规格及价格区域新增一条可填写的SKU行。",
  ["E-003"], ["skuRow"], ["skuStructure"]);

for (const field of ["SKU颜色", "规格图片", "全国零售价", "基础采购价", "激活激励", "ERP料号"]) {
  add("添加版本-SKU", "逻辑校验", "P1", `验证${field}为空时不创建版本`, `${field}必填`,
    [versionData(`SKU-${field}-空`, `${field}=留空`), "车型“小骑士”当前版本列表中不存在本条版本名称"],
    ["进入“小骑士”的添加版本规格页", "填写本条测试数据中的版本信息", `保持${field}为空`, "填写SKU其余字段", "点击“保存并提交审批”", "刷新“小骑士”的版本列表"],
    "刷新后“小骑士”的版本列表中不存在本条版本名称。", ["E-003"], ["skuRequired"], ["skuValidation"]);
}

// ERP料号
add("ERP料号关联", "功能需求", "P1", "验证关联入口打开料号弹窗", "打开料号弹窗",
  ["测试数据：SKU行未绑定ERP料号，未占用ERP料号池至少有2条"], ["进入添加版本规格页", "点击SKU行的“关联”"],
  "页面显示“选择关联料号”弹窗。", ["E-002", "E-005"], ["erpSelect"], ["erp"]);
add("ERP料号关联", "逻辑校验", "P2", "验证未选择料号时不能确认", "未选择料号",
  ["测试数据：选择关联料号弹窗未选中任何料号"], ["点击“确认”"],
  "页面显示“请选择一个料号”。", ["E-005"], ["erpSelect"], ["erp"]);
add("ERP料号关联", "逻辑校验", "P1", "验证料号弹窗只保留一个选中项", "料号单选",
  ["测试数据：未占用ERP料号A已选中，未占用ERP料号B可选择，用例后释放数据池占用"], ["选择ERP料号B"],
  "ERP料号A变为未选中。", ["E-002", "E-005"], ["erpSelect"], ["erp"]);
add("ERP料号关联", "逻辑校验", "P1", "验证已关联料号不可选择", "已关联料号禁选",
  ["ERP料号216160206102F已绑定其他SKU"], ["打开选择关联料号弹窗", "查看ERP料号216160206102F"],
  "ERP料号216160206102F处于不可选择状态。", ["E-002"], ["erpSelect"], ["erp"]);
add("ERP料号关联", "业务流程", "P1", "验证确认料号后回显ERP编码", "ERP料号回显",
  ["测试数据：从未占用ERP料号池领取ERP-NEW-01，用例完成后释放该料号", "选择关联料号弹窗已打开"],
  ["选择ERP-NEW-01", "点击“确认”"], "当前SKU行显示ERP-NEW-01。",
  ["E-002", "E-005"], ["erpSelect"], ["erp"]);
add("ERP料号关联", "业务流程", "P2", "验证取消选择不改变SKU料号", "取消料号选择",
  ["测试数据：当前SKU行未绑定ERP料号，未占用ERP料号A可选择"], ["打开选择关联料号弹窗", "选择ERP料号A", "点击“返回”"],
  "当前SKU行仍显示“关联”。", ["E-002", "E-005"], ["erpSelect"], ["erp"]);

// 提交说明与新建价格审批
for (const [point, expected] of [
  ["车辆信息直接生效", "确认弹窗的车辆信息处理方式显示“保存即生效 · 不审批”。"],
  ["基础采购价每次必审", "确认弹窗的基础采购价处理方式显示“提交财务审批（每次必审）”。"],
  ["激活激励每次必审", "确认弹窗的激活激励处理方式显示“提交财务审批（每次必审）”。"],
  ["全国零售价首次必审", "确认弹窗的全国零售价处理方式显示“首次定价 · 提交审批”。"],
]) {
  add("添加版本-价格提交", "功能需求", "P1", `验证${point}的提交说明`, point,
    ["保存并提交审批确认弹窗已打开"], ["查看对应处理方式"], expected,
    ["E-003"], ["submitCopy"], ["submitCopy"]);
}

for (const [label, value] of [["全国零售价", "1200.00"], ["基础采购价", "1000.00"], ["激活激励", "100.00"]]) {
  add("添加版本-价格提交", "业务流程", "P1", `验证新版本${label}形成待审批记录`, `首次${label}审批`,
    ["车型“小骑士”已存在", "三类价格审批规则处于生效状态", versionData(`首价-${label}`)],
    ["进入“小骑士”的添加版本规格页", "填写本条测试数据中的全部字段", "关联本条未占用ERP料号", "点击“保存并提交审批”", "点击“查看审核进度”", `按本条版本和${label}筛选审批列表`],
    `商品定价审批列表中存在目标价${value}元的${label}待审批记录。`, ["E-003", "E-005", "E-006"],
    ["firstPriceApproval"], ["firstApproval"]);
}

// 编辑页回显、锁定和保存
for (const [point, expected] of [
  ["版本名称回显", "版本名称字段显示“普通版”。"],
  ["版本描述回显", "版本描述字段显示“城市通勤版”。"],
  ["版本主图回显", "版本主图区域显示普通版主图。"],
  ["参数回显", "车辆长度参数显示1875mm。"],
  ["SKU颜色回显", "SKU颜色字段显示“曜石黑”。"],
  ["规格图片回显", "规格图片区域显示曜石黑规格图。"],
]) {
  add("编辑版本-页面回显", "功能需求", "P2", `验证编辑页${point}`, point,
    ["车型“小骑士”的版本“普通版”已保存对应数据"], ["进入“小骑士/普通版”的编辑页", "查看对应字段"], expected,
    ["E-004"], ["editDisplay"], ["editDisplay"]);
}
add("编辑版本-页面回显", "功能需求", "P1", "验证待审批基础采购价不可编辑", "采购价待审锁定",
  ["小骑士/普通版/曜石黑的基础采购价处于审批中"], ["进入该版本编辑页", "查看基础采购价输入框"],
  "基础采购价输入框处于不可编辑状态。", ["E-004"], ["editLock"], ["editDisplay"]);
add("编辑版本-页面回显", "功能需求", "P1", "验证待审批激活激励不可编辑", "激励待审锁定",
  ["小骑士/普通版/曜石黑的激活激励处于审批中"], ["进入该版本编辑页", "查看激活激励输入框"],
  "激活激励输入框处于不可编辑状态。", ["E-004"], ["editLock"], ["editDisplay"]);

for (const [point, data, action, expected] of [
  ["版本名称保存", "测试数据：版本=小骑士/普通版，新版本名称=普通版-编辑-执行时间戳yyyyMMddHHmmss，用例后恢复原名称", "填写本条测试数据中的新版本名称", "刷新后版本名称字段显示本条新版本名称。"],
  ["版本描述保存", "测试数据：版本=小骑士/普通版，新描述=编辑描述-执行时间戳yyyyMMddHHmmss，用例后恢复原描述", "填写本条测试数据中的新描述", "刷新后版本描述字段显示本条新描述。"],
  ["版本参数保存", "测试数据：版本=小骑士/普通版，车辆长度从1875修改为1880，用例后恢复1875", "填写车辆长度1880", "刷新后车辆长度参数显示1880mm。"],
  ["规格图片保存", "测试数据：版本=小骑士/普通版，SKU=曜石黑，新规格图=sku-black-new.png（1MB），用例后恢复原图", "上传sku-black-new.png", "刷新后规格图片区域显示sku-black-new.png。"],
]) {
  add("编辑版本-信息保存", "业务流程", point === "版本名称保存" ? "P1" : "P2", `验证${point}后持久化`, point,
    [data], ["进入目标版本编辑页", action, "点击“仅保存”", "刷新并重新进入目标版本编辑页"], expected,
    ["E-004"], ["editPersist"], ["editPersist"]);
}

// 编辑价格提交
for (const [label, current, target, priority] of [["基础采购价", "1000.00", "980.00", "P0"], ["激活激励", "100.00", "120.00", "P0"]]) {
  add("编辑SKU价格", "业务流程", priority, `验证修改${label}后形成待审批记录`, `${label}编辑审批`,
    [editData("普通版", `${label}目标值=${target}元，审批规则生效，用例后按审批测试数据恢复流程处理`)],
    ["进入小骑士/普通版编辑页", `填写曜石黑SKU的${label}为${target}`, "点击“保存并提交审批”", "确认提交", "进入商品定价审批", `按小骑士/普通版/曜石黑和${label}筛选`],
    `商品定价审批列表中存在由${current}元调整为${target}元的${label}待审批记录。`,
    ["E-004", "E-006"], ["editPriceApproval"], ["editApproval"]);
}

// 编辑页新增SKU
add("编辑新增SKU", "业务流程", "P0", "验证编辑页新增SKU后持久化", "新增SKU持久化",
  ["版本小骑士/普通版不存在极光银SKU", "三类价格审批规则处于生效状态", "测试数据：颜色=极光银-执行时间戳yyyyMMddHHmmss，规格图=sku-silver.png（1MB），全国零售价=1300.00元，基础采购价=1080.00元，激活激励=110.00元，ERP料号从未占用数据池领取并在用例后释放"],
  ["进入小骑士/普通版编辑页", "点击“+ 添加颜色”", "填写本条测试数据中的新增SKU字段", "关联本条未占用ERP料号", "点击“保存并提交审批”", "确认提交", "刷新并重新进入小骑士/普通版编辑页"],
  "刷新后规格及价格列表中显示本条新增SKU颜色。", ["E-004", "E-005"], ["editAddSku"], ["addSku"]);
for (const [label, value] of [["全国零售价", "1300.00"], ["基础采购价", "1080.00"], ["激活激励", "110.00"]]) {
  add("编辑新增SKU", "业务流程", "P1", `验证编辑新增SKU的${label}形成待审批记录`, `新增SKU${label}审批`,
    ["版本小骑士/普通版不存在本条测试颜色", "三类价格审批规则处于生效状态", "测试数据：颜色=审批银-执行时间戳yyyyMMddHHmmss，规格图=sku-silver.png（1MB），全国零售价=1300.00元，基础采购价=1080.00元，激活激励=110.00元，ERP料号从未占用数据池领取并在用例后释放"],
    ["进入小骑士/普通版编辑页", "点击“+ 添加颜色”", "填写本条测试数据中的新增SKU字段", "关联本条未占用ERP料号", "点击“保存并提交审批”", "确认提交", "进入商品定价审批", `按本条SKU和${label}筛选`],
    `商品定价审批列表中存在目标价${value}元的${label}待审批记录。`, ["E-004", "E-006"],
    ["editAddSku"], ["addSku"]);
}

// 审批状态闭环
for (const [stateKey, reqKey, covKey, stateLabel, expectedVerb] of [
  ["PENDING", "pendingCurrent", "pending", "审批中", "保持"],
  ["REJECTED", "rejectedCurrent", "rejected", "已驳回", "保持"],
  ["EFFECTIVE", "effectiveCurrent", "effective", "已生效", "显示"],
]) {
  for (const [label, current, target] of [["全国零售价", "1200.00", "1250.00"], ["基础采购价", "1000.00", "980.00"], ["激活激励", "100.00", "120.00"]]) {
    const expectedValue = stateKey === "EFFECTIVE" ? target : current;
    add(`审批状态-${stateLabel}`, "业务流程", "P1", `验证${label}${stateLabel}时页面价格`, `${label}${stateKey}`,
      [`测试数据：小骑士/普通版/曜石黑的${label}当前值=${current}元，目标值=${target}元，审批状态=${stateKey}`],
      ["进入小骑士/普通版编辑页", `查看曜石黑SKU的${label}`],
      `编辑页${label}${expectedVerb}${expectedValue}元。`, ["E-008"], [reqKey], [covKey]);
  }
}

add("审批执行状态", "功能需求", "P1", "验证未配置执行人的审批通过状态", "无执行人审批终态",
  ["测试数据：基础采购价审批已通过，审批规则未配置执行人"], ["进入商品定价审批", "打开该审批记录"],
  "该审批记录的审批状态显示“通过”。", ["E-006", "E-007"], ["executionStatus"], ["execution"]);
add("审批执行状态", "功能需求", "P1", "验证配置执行人的采购价待执行状态", "采购价待执行",
  ["测试数据：基础采购价审批已通过，审批规则已配置执行人，执行动作尚未完成"], ["进入商品定价审批", "打开该审批记录"],
  "该审批记录的执行状态显示“待执行”。", ["E-006", "E-007"], ["executionStatus"], ["execution"]);
add("审批执行状态", "功能需求", "P1", "验证配置执行人的激励待执行状态", "激励待执行",
  ["测试数据：激活激励审批已通过，审批规则已配置执行人，执行动作尚未完成"], ["进入商品定价审批", "打开该审批记录"],
  "该审批记录的执行状态显示“待执行”。", ["E-006", "E-007"], ["executionStatus"], ["execution"]);
add("审批执行状态", "功能需求", "P2", "验证全国零售价不进入执行阶段", "零售价无执行阶段",
  ["测试数据：全国零售价审批已通过"], ["进入商品定价审批", "打开该全国零售价审批记录"],
  "该审批记录不显示执行状态。", ["E-006", "E-007"], ["executionStatus"], ["execution"]);

// 采购价与采购折扣联动
add("采购价与采购折扣", "业务流程", "P1", "验证采购价审批中阻止采购折扣申请", "采购折扣申请阻断",
  ["测试数据：SKU=小骑士/普通版/曜石黑，基础采购价处于审批中，采购折扣申请表单已填写且尚未提交"],
  ["进入该SKU的采购折扣申请页", "点击“提交申请”"],
  "采购折扣申请表单保持未提交状态。", ["E-009"], ["discountBlock"], ["discount"]);
add("采购价与采购折扣", "业务流程", "P1", "验证采购价生效后原采购折扣失效", "原采购折扣状态",
  ["测试数据：SKU=小骑士/普通版/曜石黑，存在生效中的采购折扣价，基础采购价审批已生效"],
  ["进入该SKU的采购折扣记录页", "刷新记录列表"],
  "原采购折扣价的状态显示“已失效”。", ["E-009"], ["discountTerminate"], ["discount"]);
add("采购价与采购折扣", "功能需求", "P1", "验证采购折扣自动失效原因", "采购折扣失效原因",
  ["测试数据：SKU=小骑士/普通版/曜石黑，原采购折扣因基础采购价生效而自动失效"],
  ["进入该SKU的采购折扣记录页", "打开已失效记录"],
  "失效原因显示“SKU 基础采购价变更，采购折扣价自动失效”。", ["E-009"], ["discountTerminate"], ["discount"]);

const questions = [];
function question(structure, requirementKey, coverageKey, matter, known, missing, impact) {
  const id = `Q-${String(questions.length + 1).padStart(3, "0")}`;
  questions.push({
    问题编号: id, 功能模块: MODULE, 功能结构: structure, 待确认事项: matter,
    已知依据: known, 缺失信息: missing, 影响用例: impact, 确认状态: "待确认",
  });
  trace(requirementTrace, [requirementKey], "questions", id);
  trace(coverageTrace, [coverageKey], "questions", id);
}

question("新建车型", "modelConstraints", "dataGaps", "车型名称是否要求唯一，唯一范围和大小写规则是什么？", "原型只标记车型名称必填。", "唯一范围、比较规则和重复提示。", "重复车型名称用例");
question("新建车型", "modelConstraints", "dataGaps", "车型名称的最小长度、最大长度和允许字符是什么？", "原型未给出长度和字符限制。", "字段长度与字符集契约。", "车型名称边界用例");
question("新建车型", "modelConstraints", "dataGaps", "车型主图支持的格式、大小和尺寸限制是什么？", "原型标记车型主图必填。", "上传格式、大小、尺寸与错误提示。", "车型主图边界用例");
question("添加版本-基础信息", "versionConstraints", "dataGaps", "同一车型下版本名称是否必须唯一？", "原型标记版本名称必填。", "唯一范围、规范化规则和重复提示。", "重复版本名称用例");
question("添加版本-基础信息", "versionConstraints", "dataGaps", "版本名称和版本描述的长度及允许字符是什么？", "原型未给出文本边界。", "长度、字符集和超限提示。", "版本文本边界用例");
question("添加版本-SKU", "skuImageConstraints", "dataGaps", "规格图片支持的格式、大小和替换规则是什么？", "原型只标记规格图片必填。", "规格图片上传契约。", "规格图片边界用例");
question("SKU价格校验", "priceDomain", "dataGaps", "三类价格是否必须大于0，是否允许0或负数？", "原型只标记价格必填。", "金额最小值和错误提示。", "价格等价类用例");
question("SKU价格校验", "priceDomain", "dataGaps", "三类价格的最大整数位、小数精度和舍入规则是什么？", "代码存在精度限制但没有业务证据。", "正式金额精度契约。", "价格精度边界用例");
question("SKU价格校验", "priceDomain", "dataGaps", "价格输入非数字、科学计数法、前导零或千分位时如何处理？", "原型未定义输入格式化。", "解析和展示格式规则。", "价格格式用例");
question("添加版本-SKU", "colorUnique", "dataGaps", "同一版本内是否允许重复颜色名称？", "原型支持多条颜色SKU。", "颜色唯一范围和规范化规则。", "重复颜色用例");
question("添加版本-基础信息", "unsavedExit", "interactionGaps", "存在未保存内容时返回、刷新或关闭页面是否需要确认？", "原型提供返回入口但未定义保护规则。", "拦截范围和提示文案。", "未保存退出用例");
question("添加版本-价格提交", "idempotency", "reliabilityGaps", "重复点击提交或超时重试时如何防止重复创建版本、SKU和审批单？", "当前材料没有幂等与结果查询规则。", "幂等键、重试和恢复规则。", "重复提交用例");
question("添加版本-价格提交", "partialFailure", "reliabilityGaps", "三类审批部分创建失败时是否保证整单回滚？", "代码显示本地事务与远程审批调用并存。", "跨服务回滚、补偿和重试规则。", "部分成功用例");
question("编辑SKU价格", "repeatPending", "stateGaps", "已有待审批价格时再次提交同类价格如何处理？", "接口契约定义待审批状态，业务材料未定义重复申请。", "三类价格重复申请规则和提示。", "待审批期间重复修改用例");
question("编辑SKU价格", "executionTiming", "stateGaps", "配置执行人时价格在审批通过还是执行完成后写入当前价？", "执行说明存在待执行阶段，价格契约存在生效状态。", "三类价格最终写入时点。", "待执行期间价格用例");
question("编辑SKU价格", "retailSubsequent", "stateGaps", "全国零售价首次审批后的再次修改是否免审？", "当前原型仅明确首次定价提交审批，代码存在后续修改免审实现。", "后续修改的审批规则及适用状态。", "全国零售价再次修改用例");
question("编辑新增SKU", "colorEdit", "interactionGaps", "已有SKU颜色在什么状态下允许修改？", "原型展示可编辑输入框，代码存在已有SKU限制。", "允许修改的状态范围。", "已有SKU颜色编辑用例");
question("ERP料号关联", "erpEdit", "interactionGaps", "已有SKU的ERP料号在什么状态下允许补绑或更换？", "原型提供修改入口，代码存在绑定和上架限制。", "补绑、更换和状态限制。", "ERP料号编辑矩阵");
question("编辑SKU价格", "retailLock", "stateGaps", "全国零售价审批中时编辑页是否锁定输入框？", "价格契约返回待审状态，编辑原型只明确采购价和激励锁定。", "零售价待审交互。", "零售价锁定用例");
question("车辆维护入口", "permissions", "permissionGaps", "新建车型、创建版本和编辑价格分别需要哪些角色权限与数据范围？", "用户确认测试端，现有证据没有权限矩阵。", "角色、权限标识和组织范围。", "权限与越权用例");
question("编辑SKU价格", "ruleUnavailable", "stateGaps", "全国零售价审批规则不可用时页面展示什么反馈？", "原型只提供采购价和激励规则异常示例。", "零售价规则缺失或停用的交互。", "零售价规则异常用例");
question("编辑新增SKU", "skuInitialState", "stateGaps", "新增SKU保存后采购侧与零售侧的初始状态是什么？", "原型说明价格审批通过后SKU方可上架。", "两侧正式状态枚举和生效条件。", "新增SKU初始状态用例");
question("编辑新增SKU", "unsavedSkuDelete", "interactionGaps", "编辑页新增但未保存的SKU行是否允许删除？", "原型提供添加颜色入口但未展示删除交互。", "删除入口、确认和数据恢复规则。", "未保存SKU删除用例");

function buildTrace(traceEntry) {
  if (traceEntry.cases.length) return { 处理: "已覆盖", 追溯: traceEntry.cases.join("、") };
  assert(traceEntry.questions.length, "需求或覆盖项没有追溯");
  return { 处理: "待确认", 追溯: traceEntry.questions.join("、") };
}

const requirements = requirementSpecs.map(([key, source, object, rule], index) => ({
  需求编号: `RQ-${String(index + 1).padStart(3, "0")}`,
  来源证据: source,
  业务对象: object,
  规则或风险: rule,
  ...buildTrace(requirementTrace.get(key)),
}));
const coverage = coverageSpecs.map(([key, dimension, object, scene]) => ({
  维度: dimension,
  对象: object,
  场景: scene,
  ...buildTrace(coverageTrace.get(key)),
}));

const payload = { 测试用例: cases, 需求待确认: questions };
const qualityContext = {
  测试范围: {
    项目名称: "XETA",
    端名: "总部后台",
    模块名: "车辆SKU价格",
    测试层级: ["业务功能"],
    包含范围: ["车型创建", "版本创建", "SKU创建", "版本信息编辑", "SKU价格提交", "审批状态页面观察", "采购折扣业务联动"],
    排除范围: ["接口地址与原始请求响应字段校验", "审批配置维护", "审批人实际操作流程", "UI视觉", "性能", "安全", "兼容性"],
  },
  证据索引: evidence,
  需求清单: requirements,
  覆盖清单: coverage,
};
const qualityResult = validateTestcaseArtifacts(payload, qualityContext);
assert.equal(qualityResult.passed, true, JSON.stringify(qualityResult.errors, null, 2));

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function caseRow(item) {
  return [
    item.序号, item.用例编号, item.功能模块, item.功能结构, item.用例类型, item.优先级,
    item.用例描述, item.验证用例子项, numbered(item.前置条件), numbered(item.操作步骤),
    item.预期结果[0], item.测试结果, item.测试人员, numbered(item.备注),
  ];
}

function questionRow(item) {
  return questionHeaders.map((header) => item[header]);
}

function columnName(index) {
  let value = index + 1;
  let output = "";
  while (value > 0) {
    output = String.fromCharCode(65 + ((value - 1) % 26)) + output;
    value = Math.floor((value - 1) / 26);
  }
  return output;
}

function estimateRowHeight(row, widths) {
  let lines = 1;
  row.forEach((value, index) => {
    const width = Math.max(4, widths[index] || 12);
    const count = String(value ?? "").split("\n")
      .reduce((sum, part) => sum + Math.max(1, Math.ceil([...part].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(180, Math.max(36, lines * 17 + 8));
}

function buildSheet(workbook, { name, headers, rows, widths, tableName, validations, priorityColumn, leftColumns }) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnName(headers.length - 1);
  const lastRow = rows.length + 1;
  const full = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  full.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium4";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  full.format = {
    font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
    horizontalAlignment: "center", verticalAlignment: "center", wrapText: true,
    borders: { preset: "all", style: "thin", color: "#CBD5E1" },
  };
  for (const column of leftColumns) sheet.getRange(`${column}2:${column}${lastRow}`).format.horizontalAlignment = "left";
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#166534", font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, rowHeightPx: 40,
    borders: { preset: "all", style: "thin", color: "#14532D" },
  };
  validations.forEach(({ column, values }) => {
    sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  });
  if (priorityColumn) {
    const range = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    range.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FEE2E2", font: { bold: true, color: "#991B1B" } } });
    range.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FEF3C7", font: { bold: true, color: "#92400E" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${columnName(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => {
    sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths);
  });
  return { lastColumn, lastRow };
}

async function nextOutputPath() {
  await fs.mkdir(outputDir, { recursive: true });
  const names = await fs.readdir(outputDir);
  const pattern = new RegExp(`^总部后台-车辆SKU价格-${dateCode}-(\\d{3})\\.xlsx$`);
  const highest = names.reduce((max, name) => {
    const match = name.match(pattern);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return path.join(outputDir, `总部后台-车辆SKU价格-${dateCode}-${String(highest + 1).padStart(3, "0")}.xlsx`);
}

async function patchWorksheet(zip, sheetNumber, lastColumn, lastRow) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `missing ${entryName}`);
  let xml = await entry.async("string");
  if (!xml.includes("<x:pane ")) {
    xml = xml.replace(
      /<x:sheetView([^>]*)\/>/,
      '<x:sheetView$1><x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" /></x:sheetView>',
    );
  }
  if (!xml.includes("<x:autoFilter ")) xml = xml.replace("</x:sheetData>", `</x:sheetData><x:autoFilter ref="A1:${lastColumn}${lastRow}" />`);
  zip.file(entryName, xml);
}

await fs.mkdir(workDir, { recursive: true });
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
await fs.writeFile(qualityPath, `${JSON.stringify(qualityContext, null, 2)}\n`, "utf8");
await fs.writeFile(reportPath, `${JSON.stringify(qualityResult, null, 2)}\n`, "utf8");

const outputPath = process.argv[2] ? path.resolve(process.argv[2]) : await nextOutputPath();
const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例", headers: caseHeaders, rows: cases.map(caseRow),
  widths: [8, 15, 18, 24, 13, 9, 35, 27, 46, 50, 44, 12, 14, 58],
  tableName: "VehicleSkuPriceCasesV3",
  validations: [
    { column: "E", values: [...validTypes] }, { column: "F", values: [...validPriorities] }, { column: "L", values: [...validResults] },
  ],
  priorityColumn: "F", leftColumns: ["G", "H", "I", "J", "K", "N"],
});
const pending = buildSheet(workbook, {
  name: "需求待确认", headers: questionHeaders, rows: questions.map(questionRow),
  widths: [14, 20, 28, 52, 58, 48, 38, 14], tableName: "VehicleSkuPriceQuestionsV3",
  validations: [{ column: "H", values: [...validQuestionStatus] }], leftColumns: ["D", "E", "F", "G"],
});

const inspection = {
  summary: (await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 14, tableMaxCellChars: 120 })).ndjson,
  mainHead: (await workbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:N8", maxChars: 16000 })).ndjson,
  persistence: (await workbook.inspect({ kind: "match", searchTerm: "刷新后", options: { maxResults: 80 }, summary: "持久化观察" })).ndjson,
  pendingHead: (await workbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:H${Math.min(9, pending.lastRow)}`, maxChars: 14000 })).ndjson,
  formulaErrors: (await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(path.join(workDir, "inspection-v3.json"), `${JSON.stringify(inspection, null, 2)}\n`, "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:N8", "preview-main-v3.png"],
  ["需求待确认", `A1:H${Math.min(9, pending.lastRow)}`, "preview-pending-v3.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);
const zip = await JSZip.loadAsync(await fs.readFile(outputPath));
await patchWorksheet(zip, 1, main.lastColumn, main.lastRow);
await patchWorksheet(zip, 2, pending.lastColumn, pending.lastRow);
await fs.writeFile(outputPath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } }));
const stat = await fs.stat(outputPath);
assert(stat.size > 0, "exported workbook is empty");

console.log(JSON.stringify({
  outputPath, jsonPath, qualityPath, reportPath, cases: cases.length, questions: questions.length,
  p0: cases.filter((item) => item.优先级 === "P0").length, quality: qualityResult.summary,
  structures: [...new Set(cases.map((item) => item.功能结构))], bytes: stat.size,
}, null, 2));
