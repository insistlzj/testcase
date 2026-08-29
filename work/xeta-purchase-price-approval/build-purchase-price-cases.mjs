import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workDir = path.resolve("work/xeta-purchase-price-approval");
const outputDir = path.resolve("outputs/XETA-case");
const jsonPath = path.join(workDir, "总部后台-采购价审核-测试用例.json");
const dateCode = "260827";

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
const MODULE = "采购价审核";

const SRC = {
  audit: "来源：xeta-proto/prototype/pages/audit.html",
  common: "来源：xeta-proto/prototype/assets/common.js；静态原型行为，未动态验证",
  create: "来源：xeta-proto/prototype/pages/create.html",
  edit: "来源：xeta-proto/prototype/pages/edit.html",
  partCreate: "来源：xeta-proto/prototype/pages/part-create.html",
  partEdit: "来源：xeta-proto/prototype/pages/part-edit.html",
  price: "来源：xeta-proto/prototype/pages/price.html",
  oplog: "来源：xeta-proto/prototype/pages/oplog.html",
  ruleList: "来源：xeta-proto/prototype/pages/rule-list.html",
  rule: "来源：xeta-proto/prototype/pages/rule.html",
  execution: "来源：xeta-proto/prototype/审批执行状态-改动说明.md",
  annotations: "来源：xeta-proto/prototype/assets/annotations.js",
  productCode: "来源：xeta-server-test/product/src/main/java/com/geekonup/xeta/product/service/PriceApprovalService.java；当前代码静态分析，未动态验证",
  versionCode: "来源：xeta-server-test/product/src/main/java/com/geekonup/xeta/product/service/VersionService.java；当前代码静态分析，未动态验证",
  accessoryCode: "来源：xeta-server-test/product/src/main/java/com/geekonup/xeta/product/service/AccessoryService.java；当前代码静态分析，未动态验证",
  systemCode: "来源：xeta-server-test/system/src/main/java/com/geekonup/xeta/system/service/ApprovalService.java；当前代码静态分析，未动态验证",
  taskCode: "来源：xeta-server-test/system/src/main/java/com/geekonup/xeta/system/controller/ApprovalTaskController.java；当前代码静态分析，未动态验证",
  executionCode: "来源：xeta-server-test/system/src/main/java/com/geekonup/xeta/system/controller/ApprovalExecutionTaskController.java；当前代码静态分析，未动态验证",
  orderCode: "来源：xeta-server-test/order/src/main/java/com/geekonup/xeta/order/service/OrderB2bProcurementService.java；当前代码静态分析，未动态验证",
  discountCode: "来源：xeta-server-test/marketing/src/main/java/com/geekonup/xeta/marketing/service/PurchaseDiscountApplicationService.java；当前代码静态分析，未动态验证",
  discountDoc: "来源：xeta-server-test/doc/接口变更说明/20260716_142802_JiaXiangLiu-20260714-20260715-前端对接说明.md",
  statusDoc: "来源：xeta-server-test/doc/接口变更说明/20260805_105146_整车价格规则审核状态接口对接文档.md",
  executionDoc: "来源：xeta-server-test/doc/接口变更说明/20260618_175429_审批执行信息前端对接说明-20260618.md",
  existing: "来源：xeta-server-test/doc/测试用例/晞塔-管理后台web测试用例.xlsx；已按现行规则拆分去重",
};

const cases = [];
function add(structure, type, priority, description, point, pre, steps, expected, notes) {
  const sequence = cases.length + 1;
  cases.push({
    序号: sequence,
    用例编号: `PPA-${String(sequence).padStart(3, "0")}`,
    功能模块: MODULE,
    功能结构: structure,
    用例类型: type,
    优先级: priority,
    用例描述: description,
    验证用例子项: point,
    前置条件: pre,
    操作步骤: steps,
    预期结果: [expected],
    测试结果: "未测",
    测试人员: "",
    备注: notes,
  });
}

add("审批入口与权限", "业务流程", "P0", "验证有采购价审核权限的用户进入审批页面", "审批页面访问", ["总部后台用户已登录", "账号拥有 product:price-approval:view 权限"], ["打开商品定价审批页面"], "页面成功展示商品定价审批内容。", [SRC.audit, SRC.productCode]);
add("审批入口与权限", "异常用例", "P1", "验证无采购价审核权限的用户不能查看审批数据", "无查看权限", ["总部后台用户已登录", "账号不拥有 product:price-approval:view 权限"], ["尝试打开商品定价审批页面"], "采购价审批数据不可查看。", [SRC.productCode]);
add("审批列表", "功能需求", "P1", "验证整车审批按SKU归组展示", "整车审批归组", ["存在同一整车 SKU 的多种价格审批项"], ["进入商品定价审批页面", "选择“整车审批”"], "同一整车 SKU 的审批项展示在同一个审批单元中。", [SRC.audit, SRC.productCode]);
add("审批列表", "功能需求", "P1", "验证配件审批按SKU归组展示", "配件审批归组", ["存在同一配件 SKU 的多种价格审批项"], ["进入商品定价审批页面", "选择“配件审批”"], "同一配件 SKU 的审批项展示在同一个审批单元中。", [SRC.audit, SRC.productCode]);
add("审批列表", "功能需求", "P1", "验证当前审批人可以操作审核中采购价", "当前审批人操作入口", ["基础采购价审批处于审核中", "当前用户是当前节点审批人"], ["查看该基础采购价审批项的操作列"], "操作列提供“通过”和“驳回”入口。", [SRC.audit, SRC.executionDoc]);
add("审批列表", "逻辑校验", "P1", "验证非当前审批人不能操作审核中采购价", "非当前审批人操作限制", ["基础采购价审批处于审核中", "当前用户不是当前节点审批人"], ["查看该基础采购价审批项的操作列"], "操作列不提供“通过”和“驳回”入口。", [SRC.productCode, SRC.executionDoc]);
add("审批列表", "功能需求", "P2", "验证已通过采购价只保留审批记录入口", "已通过操作列", ["存在状态为“通过”的基础采购价审批项"], ["查看该审批项的操作列"], "操作列只提供“审批记录”入口。", [SRC.audit, SRC.existing]);
add("审批列表", "功能需求", "P2", "验证已驳回采购价只保留审批记录入口", "已驳回操作列", ["存在状态为“驳回”的基础采购价审批项"], ["查看该审批项的操作列"], "操作列只提供“审批记录”入口。", [SRC.audit, SRC.existing]);
add("审批列表", "逻辑校验", "P2", "验证按审核状态筛选采购价审批", "审核状态筛选", ["列表中存在审核中、通过、驳回三种采购价审批数据"], ["依次选择审核状态“审核中”“通过”“驳回”", "分别执行查询"], "每次查询结果只包含所选审核状态的审批数据。", [SRC.audit, SRC.productCode]);
add("审批列表", "逻辑校验", "P2", "验证按基础采购价筛选价格审批", "价格类型筛选", ["列表中存在基础采购价和其他价格类型的审批数据"], ["价格类型选择“基础采购价”", "执行查询"], "查询结果只包含基础采购价审批项。", [SRC.audit, SRC.productCode]);
add("审批列表", "逻辑校验", "P2", "验证按车型和版本筛选整车采购价审批", "车型版本联动筛选", ["不同车型和版本均存在采购价审批数据"], ["选择目标车型", "选择该车型下的目标版本", "执行查询"], "查询结果只包含目标车型版本的采购价审批数据。", [SRC.audit, SRC.productCode]);
add("审批列表", "逻辑校验", "P2", "验证按配件关键字筛选采购价审批", "配件关键字筛选", ["不同配件名称或 SKU 均存在采购价审批数据"], ["进入“配件审批”", "输入目标配件名称或 SKU 关键字", "执行查询"], "查询结果只包含匹配关键字的配件采购价审批数据。", [SRC.audit, SRC.productCode]);
add("审批列表", "逻辑校验", "P2", "验证按提交人筛选采购价审批", "提交人筛选", ["不同提交人均存在采购价审批数据"], ["选择目标提交人", "执行查询"], "查询结果只包含目标提交人发起的采购价审批数据。", [SRC.audit, SRC.productCode]);
add("审批列表", "功能需求", "P2", "验证重置采购价审批筛选条件", "筛选重置", ["审批列表已设置多个筛选条件"], ["点击“重置”"], "所有筛选条件恢复默认值。", [SRC.audit, SRC.existing]);
add("审批入口与权限", "逻辑校验", "P1", "验证价格审批菜单角标按审核中SKU单据计数", "菜单角标计数", ["存在 2 个审核中 SKU 审批单元", "其中一个单元包含多个价格审批项"], ["查看价格审批菜单角标"], "菜单角标显示为 2。", [SRC.annotations]);

add("审批发起-整车", "业务流程", "P0", "验证新建整车商品提交基础采购价审批", "新建整车基础采购价", ["基础采购价审批规则已启用", "准备可创建整车商品的完整业务数据", "基础采购价填写为 1000 元"], ["进入整车商品新建页面", "填写全部必需业务字段", "点击“保存并提交审批”", "确认提交"], "目标整车 SKU 的基础采购价审批进入“审核中”状态。", [SRC.create, SRC.versionCode]);
add("审批发起-整车", "业务流程", "P1", "验证修改整车SKU基础采购价发起审批", "整车采购价变更", ["整车 SKU 当前基础采购价为 1000 元", "该 SKU 不存在审核中的采购价申请", "基础采购价审批规则已启用"], ["进入整车商品编辑页面", "将基础采购价修改为 1050 元", "保存并提交审批"], "目标金额 1050 元的基础采购价变更进入“审核中”状态。", [SRC.edit, SRC.versionCode]);
add("审批发起-整车", "逻辑校验", "P1", "验证整车采购价审核中保留当前生效价", "审核中当前价", ["整车 SKU 当前基础采购价为 1000 元", "目标金额 1050 元的采购价变更处于审核中"], ["查看整车 SKU 当前基础采购价"], "当前基础采购价仍显示为 1000 元。", [SRC.statusDoc]);
add("审批发起-整车", "业务流程", "P1", "验证新增整车规格提交首次采购价审批", "新增规格首次定价", ["整车商品已存在", "基础采购价审批规则已启用", "准备一个尚不存在的新规格"], ["进入整车商品编辑页面", "新增规格并填写基础采购价", "保存并提交审批"], "新规格的基础采购价审批进入“审核中”状态。", [SRC.edit, SRC.versionCode]);
add("审批发起-整车", "逻辑校验", "P1", "验证未修改整车基础采购价时不重复发起审批", "未变更不发起", ["整车 SKU 已有生效基础采购价", "本次只修改非价格信息"], ["进入整车商品编辑页面", "修改非价格信息", "保存"], "目标 SKU 不新增基础采购价审批单。", [SRC.edit, SRC.versionCode]);
add("审批发起-整车", "异常用例", "P1", "验证整车SKU存在审核中采购价时不能重复提交", "重复待审申请", ["整车 SKU 已存在审核中的基础采购价申请"], ["再次修改该 SKU 的基础采购价", "尝试提交审批"], "新的基础采购价审批申请被阻止。", [SRC.versionCode]);
add("审批发起-整车", "异常用例", "P1", "验证采购价审批规则不可用时整车不能提交", "规则缺失或停用", ["基础采购价审批规则不存在或已停用", "整车价格编辑数据已填写完整"], ["点击提交审批"], "基础采购价审批申请被阻止。", [SRC.create, SRC.edit, SRC.versionCode]);
add("审批发起-整车", "逻辑校验", "P1", "验证整车基础采购价为空时不能提交", "采购价必填", ["进入整车商品新建或编辑页面", "其他必需业务字段已填写"], ["清空基础采购价", "点击保存并提交审批"], "基础采购价为空的表单不可提交。", [SRC.create, SRC.edit]);
add("审批发起-整车", "功能需求", "P2", "验证取消整车价格提交确认不产生审批", "取消提交确认", ["整车基础采购价已修改", "提交确认弹窗已打开"], ["点击取消或关闭提交确认弹窗"], "本次修改不生成基础采购价审批单。", [SRC.common, SRC.existing]);

add("审批发起-配件", "业务流程", "P0", "验证新建配件商品提交基础采购价审批", "新建配件基础采购价", ["基础采购价审批规则已启用", "准备可创建配件商品的完整业务数据", "基础采购价填写为 100 元"], ["进入配件商品新建页面", "填写全部必需业务字段", "点击“保存并提交审批”", "确认提交"], "目标配件 SKU 的基础采购价审批进入“审核中”状态。", [SRC.partCreate, SRC.accessoryCode]);
add("审批发起-配件", "业务流程", "P1", "验证修改配件SKU基础采购价发起审批", "配件采购价变更", ["配件 SKU 当前基础采购价为 100 元", "该 SKU 不存在审核中的采购价申请", "基础采购价审批规则已启用"], ["进入配件商品编辑页面", "将基础采购价修改为 120 元", "保存并提交审批"], "目标金额 120 元的基础采购价变更进入“审核中”状态。", [SRC.partEdit, SRC.accessoryCode]);
add("审批发起-配件", "逻辑校验", "P1", "验证配件采购价审核中保留当前生效价", "审核中当前价", ["配件 SKU 当前基础采购价为 100 元", "目标金额 120 元的采购价变更处于审核中"], ["查看配件 SKU 当前基础采购价"], "当前基础采购价仍显示为 100 元。", [SRC.price, SRC.accessoryCode]);
add("审批发起-配件", "业务流程", "P1", "验证新增配件规格提交首次采购价审批", "新增规格首次定价", ["配件商品已存在", "基础采购价审批规则已启用", "准备一个尚不存在的新规格"], ["进入配件商品编辑页面", "新增规格并填写基础采购价", "保存并提交审批"], "新规格的基础采购价审批进入“审核中”状态。", [SRC.partEdit, SRC.accessoryCode]);
add("审批发起-配件", "逻辑校验", "P1", "验证未修改配件基础采购价时不重复发起审批", "未变更不发起", ["配件 SKU 已有生效基础采购价", "本次只修改非价格信息"], ["进入配件商品编辑页面", "修改非价格信息", "保存"], "目标 SKU 不新增基础采购价审批单。", [SRC.partEdit, SRC.accessoryCode]);
add("审批发起-配件", "异常用例", "P1", "验证配件SKU存在审核中采购价时不能重复提交", "重复待审申请", ["配件 SKU 已存在审核中的基础采购价申请"], ["再次修改该 SKU 的基础采购价", "尝试提交审批"], "新的基础采购价审批申请被阻止。", [SRC.accessoryCode]);
add("审批发起-配件", "异常用例", "P1", "验证采购价审批规则不可用时配件不能提交", "规则缺失或停用", ["基础采购价审批规则不存在或已停用", "配件价格编辑数据已填写完整"], ["点击提交审批"], "基础采购价审批申请被阻止。", [SRC.partCreate, SRC.partEdit, SRC.accessoryCode]);
add("审批发起-配件", "逻辑校验", "P1", "验证配件基础采购价为空时不能提交", "采购价必填", ["进入配件商品新建或编辑页面", "其他必需业务字段已填写"], ["清空基础采购价", "点击保存并提交审批"], "基础采购价为空的表单不可提交。", [SRC.partCreate, SRC.partEdit]);

add("审批操作", "业务流程", "P1", "验证首个审批节点通过后流转到下一节点", "首节点通过", ["采购价审批配置至少两个顺序节点", "当前用户是首节点审批人", "审批状态为审核中"], ["点击“通过”", "完成二次确认"], "下一审批节点进入待处理状态。", [SRC.rule, SRC.systemCode, SRC.executionDoc]);
add("审批操作", "业务流程", "P1", "验证中间审批节点通过后继续顺序流转", "中间节点通过", ["采购价审批配置至少三个顺序节点", "首节点已通过", "当前用户是中间节点审批人"], ["点击“通过”", "完成二次确认"], "下一个顺序审批节点进入待处理状态。", [SRC.rule, SRC.systemCode]);
add("审批操作", "业务流程", "P0", "验证最终审批节点通过且未配置执行人时审批生效", "无执行人的最终通过", ["采购价审批未配置执行人", "前序审批节点均已通过", "当前用户是最终节点审批人"], ["点击“通过”", "完成二次确认"], "基础采购价审批状态变为“通过”。", [SRC.execution, SRC.executionDoc, SRC.systemCode]);
add("价格生效与回显", "业务流程", "P0", "验证采购价最终通过后应用目标价格", "目标价格生效", ["SKU 当前基础采购价为 1000 元", "目标金额 1050 元的审批已最终通过", "该审批未配置执行人"], ["刷新 SKU 价格信息"], "SKU 当前基础采购价更新为 1050 元。", [SRC.statusDoc, SRC.versionCode]);
add("审批操作", "功能需求", "P2", "验证通过采购价时审批意见可不填写", "通过意见可选", ["当前用户是采购价审批当前节点审批人", "审批项处于审核中"], ["不填写审批意见", "点击“通过”", "完成二次确认"], "当前审批节点通过成功。", [SRC.executionDoc, SRC.taskCode]);
add("审批操作", "功能需求", "P2", "验证取消首次通过确认不改变审批状态", "取消首次通过确认", ["当前用户可审批目标采购价", "首次通过确认弹窗已打开"], ["点击取消或关闭弹窗"], "目标审批项保持原审核状态。", [SRC.audit, SRC.common]);
add("审批操作", "功能需求", "P2", "验证取消二次通过确认不改变审批状态", "取消二次通过确认", ["当前用户可审批目标采购价", "二次不可逆确认弹窗已打开"], ["点击取消或关闭弹窗"], "目标审批项保持原审核状态。", [SRC.audit, SRC.common]);
add("审批操作", "逻辑校验", "P1", "验证驳回原因为空时不能驳回采购价", "驳回原因必填", ["当前用户可驳回目标采购价", "驳回弹窗已打开"], ["不填写驳回原因", "点击确认驳回"], "目标审批项保持“审核中”状态。", [SRC.audit, SRC.common, SRC.systemCode]);
add("审批操作", "业务流程", "P0", "验证审批节点驳回后结束采购价审批", "单项驳回", ["采购价审批处于审核中", "当前用户是当前节点审批人", "准备明确的驳回原因"], ["点击“驳回”", "填写驳回原因", "完成二次确认"], "基础采购价审批状态变为“驳回”。", [SRC.audit, SRC.systemCode, SRC.executionDoc]);
add("价格生效与回显", "逻辑校验", "P1", "验证采购价被驳回后保留原生效价格", "驳回后价格不变", ["SKU 当前基础采购价为 1000 元", "目标金额 1050 元的审批已被驳回"], ["刷新 SKU 价格信息"], "SKU 当前基础采购价仍为 1000 元。", [SRC.statusDoc, SRC.versionCode]);
add("审批操作", "业务流程", "P1", "验证批量通过处理当前用户可审批的采购价", "批量通过可操作项", ["同一审批单元有 3 个审核中价格项", "当前用户可审批其中 2 个价格项"], ["点击“全部通过”", "完成二次确认"], "2 个当前可审批价格项均完成本节点通过。", [SRC.audit, SRC.common, SRC.executionDoc]);
add("审批操作", "逻辑校验", "P2", "验证批量通过不重复处理已结束价格项", "批量通过跳过已结束项", ["同一审批单元包含审核中、通过、驳回三种价格项", "当前用户可审批其中的审核中价格项"], ["点击“全部通过”", "完成二次确认"], "已结束价格项的审批状态保持不变。", [SRC.audit, SRC.common]);
add("审批操作", "异常用例", "P2", "验证没有待处理项时不能执行批量通过", "无待处理项批量通过", ["审批单元中的价格项均已通过或驳回"], ["尝试执行“全部通过”"], "系统不发起任何审批任务操作。", [SRC.common]);
add("审批操作", "异常用例", "P1", "验证重复或并发审批只产生一次有效状态流转", "重复审批幂等", ["当前用户可审批目标采购价", "准备两个并发的相同审批请求"], ["同时提交两个通过请求", "刷新审批任务状态"], "只有一个请求完成该审批任务的状态变更。", [SRC.systemCode, SRC.existing]);

add("审批记录", "功能需求", "P2", "验证审核中采购价展示节点进度", "审核中审批记录", ["多节点采购价审批处于审核中", "至少一个前序节点已完成"], ["点击该审批项的“审批记录”"], "审批记录展示已完成节点和当前待处理节点的顺序进度。", [SRC.common, SRC.executionDoc]);
add("审批记录", "功能需求", "P2", "验证已通过采购价展示完整审批记录", "通过审批记录", ["多节点采购价审批已通过"], ["点击该审批项的“审批记录”"], "审批记录展示从提交到最终通过的完整节点轨迹。", [SRC.common, SRC.executionDoc]);
add("审批记录", "功能需求", "P1", "验证被驳回采购价记录驳回原因", "驳回原因记录", ["采购价审批已被驳回", "驳回时填写原因“成本资料不完整”"], ["点击该审批项的“审批记录”"], "审批记录展示驳回原因“成本资料不完整”。", [SRC.common, SRC.systemCode]);

add("执行状态", "功能需求", "P2", "验证列表全部无执行人时隐藏执行状态列", "全量无执行人", ["当前列表所有审批项均未配置执行人"], ["打开商品定价审批列表"], "列表不展示“执行状态”列。", [SRC.execution]);
add("执行状态", "功能需求", "P2", "验证列表存在执行人时展示执行状态列", "混合执行人列表", ["当前列表至少一个基础采购价审批项配置了执行人"], ["打开商品定价审批列表"], "列表展示“执行状态”列。", [SRC.execution]);
add("执行状态", "功能需求", "P2", "验证混合列表中无执行人审批项显示占位符", "无执行人行占位", ["列表已展示执行状态列", "目标基础采购价审批项未配置执行人"], ["查看目标审批项的执行状态"], "目标审批项的执行状态显示为“—”。", [SRC.execution]);
add("执行状态", "功能需求", "P2", "验证审核中采购价不展示执行进度", "审核中执行状态", ["列表已展示执行状态列", "目标基础采购价审批处于审核中"], ["查看目标审批项的执行状态"], "目标审批项的执行状态显示为“—”。", [SRC.execution]);
add("执行状态", "功能需求", "P2", "验证已驳回采购价不展示执行进度", "驳回执行状态", ["列表已展示执行状态列", "目标基础采购价审批已驳回"], ["查看目标审批项的执行状态"], "目标审批项的执行状态显示为“—”。", [SRC.execution]);
add("执行状态", "业务流程", "P1", "验证配置执行人的采购价通过后进入待执行", "通过后待执行", ["基础采购价审批配置了执行人", "前序节点均已通过", "当前用户是最终节点审批人"], ["通过最终审批节点", "刷新审批列表"], "目标审批项的执行状态显示为“待执行”。", [SRC.execution, SRC.executionDoc, SRC.systemCode]);
add("执行状态", "功能需求", "P2", "验证已完成执行的采购价展示已执行状态", "已执行状态展示", ["已通过的基础采购价审批配置了执行人", "通过接口或测试数据准备使执行任务处于已完成状态"], ["打开商品定价审批列表", "查看目标审批项的执行状态"], "目标审批项的执行状态显示为“已执行”。", [SRC.execution, SRC.executionDoc, SRC.executionCode]);
add("执行状态", "功能需求", "P3", "验证采购价审批页面不提供执行状态筛选", "无执行状态筛选", ["进入商品定价审批页面"], ["查看整车审批和配件审批筛选区"], "筛选区不展示执行状态条件。", [SRC.execution]);
add("执行状态", "逻辑校验", "P2", "验证待执行采购价不计入审核中菜单角标", "待执行不计角标", ["不存在审核中的 SKU 审批单元", "存在 1 个状态为通过且执行状态为待执行的采购价审批项"], ["查看价格审批菜单角标"], "菜单角标不显示待执行审批项数量。", [SRC.annotations, SRC.execution]);

add("价格生效与回显", "功能需求", "P1", "验证采购价审核中时价格总览保留当前价", "价格总览当前价", ["SKU 当前基础采购价为 1000 元", "目标金额 1050 元的采购价变更处于审核中"], ["进入当前价格总览", "定位目标 SKU"], "当前价格栏显示 1000 元。", [SRC.price, SRC.statusDoc]);
add("价格生效与回显", "功能需求", "P1", "验证采购价审核中时展示目标价格信息", "待审目标价信息", ["SKU 当前基础采购价为 1000 元", "目标金额 1050 元的采购价变更处于审核中"], ["查看目标 SKU 的采购价审批信息"], "审批信息显示目标金额 1050 元。", [SRC.statusDoc]);
add("价格生效与回显", "功能需求", "P2", "验证采购价审核中时展示申请编号", "待审申请编号", ["SKU 存在审核中的基础采购价申请", "该申请已有审批编号"], ["查看目标 SKU 的采购价审批信息"], "审批信息展示对应的申请编号。", [SRC.statusDoc]);
add("价格生效与回显", "功能需求", "P1", "验证采购价生效后价格总览展示新价格", "生效价格回显", ["SKU 原基础采购价为 1000 元", "目标金额 1050 元的审批已生效"], ["进入当前价格总览", "定位目标 SKU"], "当前价格栏显示 1050 元。", [SRC.price, SRC.statusDoc]);
add("价格生效与回显", "功能需求", "P2", "验证采购价被驳回后展示驳回状态", "驳回状态回显", ["SKU 的基础采购价变更已被驳回"], ["查看目标 SKU 的采购价审批信息"], "采购价审批状态显示为“已驳回”。", [SRC.statusDoc]);

add("采购下单联动", "异常用例", "P0", "验证整车采购价审核中时不能提交采购订单", "整车下单拦截", ["整车 SKU 存在审核中的基础采购价申请", "采购订单已选择该 SKU"], ["填写采购订单必需信息", "提交采购订单"], "采购订单提交被阻止。", [SRC.create, SRC.orderCode]);
add("采购下单联动", "异常用例", "P1", "验证配件采购价审核中时不能提交采购订单", "配件下单拦截", ["配件 SKU 存在审核中的基础采购价申请", "采购订单已选择该 SKU"], ["填写采购订单必需信息", "提交采购订单"], "采购订单提交被阻止。", [SRC.partCreate, SRC.orderCode]);
add("采购下单联动", "业务流程", "P1", "验证采购价生效后SKU可按新价格下单", "审批后恢复下单", ["SKU 原基础采购价为 1000 元", "目标金额 1050 元的审批已生效", "SKU 满足其他采购下单条件"], ["新建采购订单并选择目标 SKU", "提交采购订单"], "采购订单按基础采购价 1050 元创建成功。", [SRC.orderCode, SRC.statusDoc]);

add("采购折扣价联动", "异常用例", "P1", "验证基础采购价审核中时不能新建采购折扣申请", "待审时折扣申请拦截", ["SKU 存在审核中的基础采购价申请", "准备完整的采购折扣申请数据"], ["选择目标 SKU", "提交采购折扣申请"], "采购折扣申请提交被阻止。", [SRC.discountDoc, SRC.discountCode]);
add("采购折扣价联动", "功能需求", "P2", "验证采购价审核导致折扣提交失败时保留表单", "折扣表单保留", ["SKU 存在审核中的基础采购价申请", "采购折扣表单已填写完整"], ["提交采购折扣申请", "查看失败后的表单"], "已填写的采购折扣申请内容仍保留在表单中。", [SRC.discountDoc]);
add("采购折扣价联动", "业务流程", "P1", "验证基础采购价生效后终止当前有效采购折扣价", "终止当前有效折扣", ["SKU 存在当前有效的采购折扣价", "该 SKU 的基础采购价变更已生效"], ["刷新该 SKU 的采购折扣状态"], "原有效采购折扣价变为终止状态。", [SRC.discountDoc, SRC.discountCode]);
add("采购折扣价联动", "业务流程", "P1", "验证基础采购价生效后终止未来待生效采购折扣价", "终止未来折扣", ["SKU 存在未来生效的采购折扣价", "该 SKU 的基础采购价变更已生效"], ["刷新该 SKU 的采购折扣状态"], "原未来生效采购折扣价变为终止状态。", [SRC.discountDoc, SRC.discountCode]);
add("采购折扣价联动", "功能需求", "P1", "验证采购折扣终止原因记录采购价变更", "折扣终止原因", ["SKU 的基础采购价变更已生效", "该 SKU 的采购折扣价已自动终止"], ["查看采购折扣价终止原因"], "终止原因显示“SKU 基础采购价变更，采购折扣价自动失效”。", [SRC.discountDoc]);
add("采购折扣价联动", "逻辑校验", "P2", "验证刷新后展示采购折扣最新终止状态", "折扣状态刷新", ["基础采购价生效已触发采购折扣价终止", "前端仍显示刷新前状态"], ["刷新采购折扣列表或详情"], "页面展示服务端返回的采购折扣终止状态。", [SRC.discountDoc]);

add("变更记录", "业务流程", "P1", "验证基础采购价生效后生成价格变更记录", "生效变更日志", ["SKU 的基础采购价审批已生效"], ["进入价格变更记录页面", "查询目标 SKU"], "列表中存在本次基础采购价变更记录。", [SRC.oplog, SRC.versionCode, SRC.accessoryCode]);
add("变更记录", "功能需求", "P2", "验证采购价变更记录展示变更前后金额", "变更金额记录", ["SKU 基础采购价由 1000 元审批生效为 1050 元"], ["查看本次价格变更记录"], "变更内容显示 1000 元到 1050 元。", [SRC.oplog, SRC.versionCode]);

add("审批规则配置", "逻辑校验", "P2", "验证基础采购价审批项使用系统预置单一规则", "预置单规则", ["进入审批规则列表"], ["定位“基础采购价”审批项", "查看可用操作"], "基础采购价只展示一个可编辑的系统预置规则。", [SRC.ruleList]);
add("审批规则配置", "业务流程", "P1", "验证多节点采购价审批按配置顺序执行", "顺序审批节点", ["进入基础采购价审批规则编辑页", "准备两个有效审批账号"], ["配置节点 1 和节点 2", "保存并启用规则", "发起一笔基础采购价审批"], "新审批实例按节点 1 到节点 2 的顺序创建审批任务。", [SRC.rule, SRC.systemCode]);
add("审批规则配置", "逻辑校验", "P2", "验证审批节点名称为必填项", "节点名称必填", ["进入基础采购价审批规则编辑页", "已添加一个审批节点"], ["清空节点名称", "点击保存"], "审批规则不可保存。", [SRC.rule]);
add("审批规则配置", "逻辑校验", "P1", "验证审批节点必须指定审批账号", "审批账号必填", ["进入基础采购价审批规则编辑页", "已添加一个审批节点", "节点名称已填写"], ["不选择审批账号", "点击保存"], "审批规则不可保存。", [SRC.rule, SRC.systemCode]);
add("审批规则配置", "逻辑校验", "P2", "验证审批角色只用于筛选审批账号", "角色筛选账号", ["进入基础采购价审批规则编辑页", "系统存在多个角色和对应账号"], ["选择目标角色", "查看审批账号下拉列表"], "审批账号选项只展示目标角色下的账号。", [SRC.rule]);
add("审批规则配置", "功能需求", "P2", "验证采购价审批完成后通知抄送人", "完成后抄送", ["基础采购价审批规则配置了抄送人", "准备一笔可完成的采购价审批"], ["使该审批最终通过", "查看抄送人的审批通知"], "抄送人收到该审批已完成的通知。", [SRC.rule, SRC.executionDoc]);
add("审批规则配置", "异常用例", "P1", "验证停用基础采购价规则后阻止新申请", "停用规则阻止新申请", ["基础采购价审批规则当前启用"], ["停用该审批规则", "发起新的基础采购价审批"], "新的基础采购价审批申请被阻止。", [SRC.ruleList, SRC.rule, SRC.versionCode, SRC.accessoryCode]);
add("审批规则配置", "业务流程", "P1", "验证停用规则不影响已在途采购价审批", "在途审批沿用原规则", ["基础采购价审批已按规则 A 发起并处于审核中"], ["停用规则 A", "继续处理该在途审批"], "该在途审批仍按规则 A 的原节点流转。", [SRC.ruleList]);
add("审批规则配置", "业务流程", "P2", "验证重新启用基础采购价规则后允许新申请", "重新启用规则", ["基础采购价审批规则处于停用状态", "规则配置内容仍保留"], ["重新启用该规则", "发起新的基础采购价审批"], "新的基础采购价审批申请进入“审核中”状态。", [SRC.ruleList, SRC.rule]);

const questions = [];
function question(structure, item, basis, missing, impact) {
  const sequence = questions.length + 1;
  questions.push({
    问题编号: `Q-${String(sequence).padStart(3, "0")}`,
    功能模块: MODULE,
    功能结构: structure,
    待确认事项: item,
    已知依据: basis,
    缺失信息: missing,
    影响用例: impact,
    确认状态: "待确认",
  });
}

question("审批发起-整车/配件", "基础采购价允许的最小值、最大值、小数精度、零值和负数校验规则是什么？", "新建和编辑原型只标识基础采购价为必填；当前资料未形成完整数值约束。", "明确的金额边界、精度、舍入规则和错误提示。", "金额等价类与边界值用例");
question("审批操作", "批量驳回时驳回原因如何采集并应用到多个审批任务？", "原型提供“全部驳回”；后端单项驳回要求驳回原因。", "批量原因输入入口、是否允许分别填写、记录归属。", "批量驳回成功、原因必填、审批记录用例");
question("审批操作", "批量通过或批量驳回发生部分任务失败时采用全部回滚还是保留部分成功？", "前端资料表现为逐项提交任务；未发现批次原子性约定。", "事务范围、重试方式、页面最终提示和状态刷新规则。", "批量操作异常恢复与幂等用例");
question("审批接口", "审批任务通过和驳回接口最终使用 POST 还是 PUT？", "2026-06 接口文档写 POST；当前 ApprovalTaskController 代码使用 PUT。", "目标部署版本的最终接口契约。", "审批接口联调与自动化用例");
question("执行状态", "采购价待执行任务在产品中的操作入口位于哪里？", "执行接口文档和后端存在完成接口；P041 改动说明明确商品定价审批页不增加“标记已执行”操作。", "实际页面入口、按钮权限、操作文案和跳转路径。", "执行任务完成的端到端界面用例");
question("执行状态", "执行回调失败时用户可见状态、失败原因和重试入口如何定义？", "当前后端代码包含 FAILED 状态和失败原因；原型未提供对应交互。", "失败展示位置、重试权限、重试次数和终态规则。", "执行失败、重试与恢复用例");
question("采购折扣价联动", "基础采购价被驳回时既有采购折扣价是否保持原状态？", "正式接口文档只明确基础采购价生效会终止当前及未来采购折扣价。", "驳回场景的折扣状态业务约定。", "采购价驳回与折扣联动用例");
question("审批列表", "最终需要支持哪些查询条件和分页规则？", "原型提供状态、价格类型、车型/版本、配件关键字、提交人；后端请求还存在提交日期和 SKU 条件。", "最终筛选项、默认值、模糊匹配、页大小和空态文案。", "日期、SKU、分页和空态用例");
question("审批入口与权限", "采购价审批数据是否需要按组织、品牌或其他数据范围隔离？", "当前代码有页面查看权限校验；资料未明确不同组织可见数据边界。", "角色与组织的数据范围矩阵。", "跨组织数据权限用例");
question("变更记录", "价格变更记录中的操作人应记录申请人、最终审批人还是系统执行人？", "原型存在操作人字段；当前资料未明确采购价审批生效场景的取值口径。", "操作人字段来源和无执行人场景取值。", "价格变更记录操作人用例");
question("审批规则配置", "审批账号被停用、删除或调岗时，在途审批如何改派？", "规则按具体账号配置；当前资料未定义账号失效后的处理。", "自动改派、管理员干预、超时和通知规则。", "审批人失效与在途任务恢复用例");
question("价格生效与回显", "配置执行人后，基础采购价是在最终审批通过时生效还是在执行任务完成时生效？", "执行接口文档称最终审批后业务结果已同步；执行状态改动说明又描述通过后进入待执行。", "价格写入时点、待执行期间当前价和下单价口径。", "配置执行人的价格生效、下单和折扣联动用例");

function validatePayload(payload) {
  assert.deepEqual(Object.keys(payload), ["测试用例", "需求待确认"]);
  assert(payload.测试用例.length > 0);
  assert(payload.需求待确认.length > 0);
  const ids = new Set();
  const semantic = new Set();
  payload.测试用例.forEach((item, index) => {
    assert.deepEqual(Object.keys(item), caseHeaders, `第 ${index + 1} 条字段或顺序错误`);
    assert.equal(item.序号, index + 1);
    assert.equal(item.用例编号, `PPA-${String(index + 1).padStart(3, "0")}`);
    assert(!ids.has(item.用例编号), `用例编号重复：${item.用例编号}`);
    ids.add(item.用例编号);
    assert(validTypes.has(item.用例类型), `非法类型：${item.用例类型}`);
    assert(validPriorities.has(item.优先级), `非法优先级：${item.优先级}`);
    assert(validResults.has(item.测试结果), `非法测试结果：${item.测试结果}`);
    assert(item.用例描述.startsWith("验证"));
    assert(item.前置条件.length > 0 && item.操作步骤.length > 0);
    assert.equal(item.预期结果.length, 1, `${item.用例编号} 预期结果数量不为 1`);
    assert(!/[；\n\r]/.test(item.预期结果[0]), `${item.用例编号} 预期结果包含复合分隔符`);
    assert(!/(并且|同时)/.test(item.预期结果[0]), `${item.用例编号} 预期结果疑似合并独立结果`);
    assert(item.备注.length > 0 && item.备注.every((note) => note.startsWith("来源：")), `${item.用例编号} 缺少来源`);
    const key = [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join("|"), item.操作步骤.join("|"), item.预期结果[0]].join("::").replace(/\s+/g, "");
    assert(!semantic.has(key), `${item.用例编号} 语义重复`);
    semantic.add(key);
  });
  payload.需求待确认.forEach((item, index) => {
    assert.deepEqual(Object.keys(item), questionHeaders, `第 ${index + 1} 条待确认字段错误`);
    assert.equal(item.问题编号, `Q-${String(index + 1).padStart(3, "0")}`);
    assert(validQuestionStatus.has(item.确认状态));
  });
}

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
    const count = String(value ?? "").split("\n").reduce((sum, part) => sum + Math.max(1, Math.ceil([...part].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(180, Math.max(36, lines * 17 + 8));
}

function buildSheet(workbook, { name, headers, rows, widths, tableName, validations, priorityColumn }) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnName(headers.length - 1);
  const lastRow = rows.length + 1;
  const full = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  full.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  full.format = {
    font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#D4DEE9" },
  };
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#1F4E78",
    font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    rowHeightPx: 40,
    borders: { preset: "all", style: "thin", color: "#163A5A" },
  };
  validations.forEach(({ column, values }) => {
    sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  });
  if (priorityColumn) {
    const range = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    range.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    range.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => {
    sheet.getRange(`${columnName(index)}1`).format.columnWidth = width;
  });
  rows.forEach((row, index) => {
    sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths);
  });
  return { sheet, lastColumn, lastRow };
}

async function nextOutputPath() {
  await fs.mkdir(outputDir, { recursive: true });
  const names = await fs.readdir(outputDir);
  const pattern = new RegExp(`^总部后台-采购价审核-${dateCode}-(\\d{3})\\.xlsx$`);
  const highest = names.reduce((max, name) => {
    const match = name.match(pattern);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return path.join(outputDir, `总部后台-采购价审核-${dateCode}-${String(highest + 1).padStart(3, "0")}.xlsx`);
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
  if (!xml.includes("<x:autoFilter ")) {
    xml = xml.replace("</x:sheetData>", `</x:sheetData><x:autoFilter ref="A1:${lastColumn}${lastRow}" />`);
  }
  zip.file(entryName, xml);
}

await fs.mkdir(workDir, { recursive: true });
const payload = { 测试用例: cases, 需求待确认: questions };
validatePayload(payload);
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const outputPath = await nextOutputPath();
const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例",
  headers: caseHeaders,
  rows: cases.map(caseRow),
  widths: [8, 15, 16, 25, 13, 9, 34, 27, 42, 46, 44, 12, 14, 55],
  tableName: "PurchasePriceApprovalCases",
  validations: [
    { column: "E", values: [...validTypes] },
    { column: "F", values: [...validPriorities] },
    { column: "L", values: [...validResults] },
  ],
  priorityColumn: "F",
});
const pending = buildSheet(workbook, {
  name: "需求待确认",
  headers: questionHeaders,
  rows: questions.map(questionRow),
  widths: [14, 18, 28, 50, 58, 48, 36, 14],
  tableName: "PurchasePriceApprovalQuestions",
  validations: [{ column: "H", values: [...validQuestionStatus] }],
});

const inspection = {
  summary: (await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 14, tableMaxCellChars: 120 })).ndjson,
  mainHead: (await workbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:N7", maxChars: 15000 })).ndjson,
  mainTail: (await workbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, main.lastRow - 4)}:N${main.lastRow}`, maxChars: 12000 })).ndjson,
  pendingHead: (await workbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:H${Math.min(7, pending.lastRow)}`, maxChars: 12000 })).ndjson,
  formulaErrors: (await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(path.join(workDir, "inspection.json"), `${JSON.stringify(inspection, null, 2)}\n`, "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:N8", "preview-main.png"],
  ["需求待确认", `A1:H${Math.min(8, pending.lastRow)}`, "preview-pending.png"],
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
  outputPath,
  jsonPath,
  cases: cases.length,
  questions: questions.length,
  p0: cases.filter((item) => item.优先级 === "P0").length,
  structures: [...new Set(cases.map((item) => item.功能结构))],
  bytes: stat.size,
}, null, 2));
