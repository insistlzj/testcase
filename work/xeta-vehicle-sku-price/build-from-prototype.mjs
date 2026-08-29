import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const projectRoot = "/Users/geekonup/testcase";
const workDir = path.join(projectRoot, "work/xeta-vehicle-sku-price");
const outputDir = path.join(projectRoot, "outputs/XETA-case");
const jsonPath = path.join(workDir, "总部后台-车辆SKU价格-原型重生成.json");
const reportPath = path.join(workDir, "总部后台-车辆SKU价格-原型重生成-检查报告.json");
const dateCode = "260828";
const moduleName = "车辆SKU价格管理";

const caseHeaders = [
  "序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述",
  "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注",
];
const questionHeaders = [
  "问题编号", "功能模块", "功能结构", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态",
];
const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionStatus = new Set(["待确认", "已确认", "无需处理"]);

const source = {
  list: "来源：xeta-proto/prototype/pages/list.html；整车商品信息维护页面与添加车型弹窗；基于静态原型分析，未动态验证。",
  create: "来源：xeta-proto/prototype/pages/create.html；添加版本规格页面与提交结果说明；基于静态原型分析，未动态验证。",
  edit: "来源：xeta-proto/prototype/pages/edit.html；编辑版本页面与价格提交说明；基于静态原型分析，未动态验证。",
  audit: "来源：xeta-proto/prototype/pages/audit.html；商品定价审批页面；基于静态原型分析，未动态验证。",
  common: "来源：xeta-proto/prototype/assets/common.js；原型交互逻辑；基于静态原型分析，未动态验证。",
  annotations: "来源：xeta-proto/prototype/assets/annotations.js；商品定价审批批注；基于静态原型分析，未动态验证。",
  execution: "来源：xeta-proto/prototype/审批执行状态-改动说明.md；商品定价审批执行状态规则；基于静态原型分析，未动态验证。",
};

const cases = [];
function add(structure, type, priority, description, point, preconditions, steps, expected, notes) {
  const sequence = cases.length + 1;
  cases.push({
    序号: sequence,
    用例编号: `VSP-${String(sequence).padStart(3, "0")}`,
    功能模块: moduleName,
    功能结构: structure,
    用例类型: type,
    优先级: priority,
    用例描述: description,
    验证用例子项: point,
    前置条件: preconditions,
    操作步骤: steps,
    预期结果: [expected],
    流程编号: "",
    测试结果: "未测",
    测试人员: "",
    备注: notes,
  });
}

const validVersionData = [
  "准备一个未被占用的版本名称",
  "准备合法的版本描述、版本主图和参数",
  "准备合法的SKU颜色、规格图片和三类价格",
  "准备一条未被其他SKU占用的料号",
];

// 入口、列表与车型
add("车辆维护入口", "业务流程", "P0", "验证进入整车商品信息维护页面", "整车维护入口",
  ["总部后台用户已登录"], ["进入商品中心", "点击整车商品信息维护"],
  "页面标题显示“整车商品信息维护”。", [source.list]);
add("车辆维护列表", "功能需求", "P2", "验证车型列表展示已有车型", "已有车型列表",
  ["整车商品信息维护页面已打开"], ["查看左侧车型区域"],
  "左侧车型区域显示已有车型名称。", [source.list]);
add("车辆维护列表", "功能需求", "P2", "验证版本规格列表展示业务字段", "版本规格列表字段",
  ["车型“小骑士”存在版本与SKU数据"], ["在左侧选择“小骑士”", "查看版本与规格列表表头"],
  "列表表头显示车型版本、颜色、规格描述、操作。", [source.list]);
add("新建车型", "功能需求", "P1", "验证添加车型弹窗的业务字段", "添加车型字段",
  ["整车商品信息维护页面已打开"], ["点击“+ 添加车型”"],
  "添加车型弹窗显示车型名称和车型主图。", [source.list]);
add("新建车型", "逻辑校验", "P1", "验证车型名称为必填项", "车型名称必填",
  ["添加车型弹窗已打开", "车型名称留空", "已选择车型主图"], ["点击“确定”"],
  "车型记录未被创建。", [source.list]);
add("新建车型", "逻辑校验", "P1", "验证车型主图为必填项", "车型主图必填",
  ["添加车型弹窗已打开", "车型名称填写合法值", "车型主图留空"], ["点击“确定”"],
  "车型记录未被创建。", [source.list]);
add("新建车型", "业务流程", "P0", "验证填写名称和主图后创建车型", "创建车型",
  ["准备一个未被占用的车型名称", "准备一张合法的车型主图"],
  ["点击“+ 添加车型”", "填写准备的车型名称", "上传准备的车型主图", "点击“确定”", "刷新整车商品信息维护页面"],
  "左侧车型列表显示本条测试车型名称。", [source.list, source.common]);
add("新建车型", "业务流程", "P2", "验证取消添加车型不创建记录", "取消添加车型",
  ["准备一个未被占用的车型名称", "准备一张合法的车型主图"],
  ["点击“+ 添加车型”", "填写准备的车型名称", "上传准备的车型主图", "点击“取消”", "刷新整车商品信息维护页面"],
  "左侧车型列表不显示本条测试车型名称。", [source.list, source.common]);
add("新建车型", "功能需求", "P2", "验证已创建车型不提供删除操作", "车型不可删除",
  ["左侧车型列表存在车型“小骑士”"], ["选择车型“小骑士”", "查看车型操作区域"],
  "车型操作区域不显示删除入口。", [source.list]);
add("车辆维护入口", "业务流程", "P1", "验证从车型进入添加版本规格页面", "添加版本入口",
  ["左侧车型列表存在车型“小骑士”"], ["选择车型“小骑士”", "点击“+ 添加版本规格”"],
  "页面标题显示“添加版本规格”。", [source.list, source.create]);
add("车辆维护入口", "业务流程", "P1", "验证从SKU行进入编辑页面", "版本编辑入口",
  ["车型“小骑士”存在普通版SKU"], ["选择车型“小骑士”", "点击普通版SKU行的“编辑”"],
  "页面显示车型版本信息编辑表单。", [source.list, source.edit]);

// 添加版本基础信息、参数和图片
add("添加版本-基础信息", "功能需求", "P2", "验证所属车型为只读字段", "所属车型只读",
  ["已从车型“小骑士”进入添加版本规格页面"], ["点击车型名称字段", "尝试修改字段值"],
  "车型名称字段保持“小骑士”。", [source.create]);
for (const [field, setup] of [
  ["版本名称", "版本名称留空"],
  ["版本描述", "版本描述留空"],
  ["版本主图", "版本主图留空"],
]) {
  add("添加版本-基础信息", "逻辑校验", "P1", `验证${field}为必填项`, `${field}必填`,
    ["车型“小骑士”已存在", setup, "其他必填字段填写合法值"],
    ["进入添加版本规格页面", "填写除目标字段外的必填字段", "点击“保存并提交审批”"],
    "版本规格记录未被创建。", [source.create]);
}
for (const [file, expected, type, priority] of [
  ["JPG图片（2MB）", "版本主图区域显示所选JPG图片。", "逻辑校验", "P2"],
  ["PNG图片（2MB）", "版本主图区域显示所选PNG图片。", "逻辑校验", "P2"],
  ["JPG图片（恰好10MB）", "版本主图区域显示所选10MB图片。", "逻辑校验", "P1"],
  ["JPG图片（10MB+1KB）", "版本主图区域不显示所选超限图片。", "异常用例", "P1"],
  ["GIF图片（2MB）", "版本主图区域不显示所选GIF图片。", "异常用例", "P2"],
]) {
  add("添加版本-基础信息", type, priority, `验证版本主图${expected.includes("不显示") ? "限制" : "支持"}${file.split("（")[0]}`, `版本主图${file}`,
    [`测试文件=${file}`], ["进入添加版本规格页面", "选择测试文件作为版本主图"], expected, [source.create]);
}
add("添加版本-参数", "功能需求", "P2", "验证添加参数入口新增参数行", "添加参数",
  ["添加版本规格页面已打开"], ["点击“+ 添加参数”"],
  "版本参数表新增一条参数行。", [source.create]);
add("添加版本-参数", "功能需求", "P2", "验证删除参数移除目标参数行", "删除参数",
  ["版本参数表存在参数“车辆长度 (mm)”"], ["点击该参数行的“删除”"],
  "版本参数表不再显示“车辆长度 (mm)”行。", [source.create]);

// SKU和ERP料号
add("添加版本-SKU", "功能需求", "P1", "验证添加颜色入口新增SKU行", "新增SKU行",
  ["添加版本规格页面已打开"], ["点击“+ 添加颜色”"],
  "规格及价格表新增一条可填写的SKU行。", [source.create]);
for (const [field, structure] of [
  ["颜色", "添加版本-SKU"],
  ["规格图片", "添加版本-SKU"],
  ["基础全国零售价", "添加版本-SKU"],
  ["基础采购价", "添加版本-SKU"],
  ["激活激励", "添加版本-SKU"],
  ["关联料号", "ERP料号关联"],
]) {
  add(structure, "逻辑校验", "P1", `验证${field}为必填项`, `${field}必填`,
    ["车型“小骑士”已存在", `${field}留空`, "其他必填字段填写合法值"],
    ["进入添加版本规格页面", "填写除目标字段外的必填字段", "点击“保存并提交审批”"],
    "版本规格记录未被创建。", [source.create]);
}
add("ERP料号关联", "功能需求", "P1", "验证关联入口打开料号选择弹窗", "打开料号弹窗",
  ["添加版本规格页面存在未关联料号的SKU行"], ["点击该SKU行的“关联”"],
  "页面显示“选择关联料号”弹窗。", [source.create, source.common]);
add("ERP料号关联", "逻辑校验", "P1", "验证料号只能选择一条", "料号单选",
  ["料号选择弹窗已打开", "未占用料号A处于选中状态", "未占用料号B可选择"], ["选择料号B"],
  "料号A变为未选中状态。", [source.create, source.common]);
add("ERP料号关联", "逻辑校验", "P1", "验证已关联料号不可选择", "已关联料号禁选",
  ["料号216160206102F已被其他SKU关联"], ["打开料号选择弹窗", "查看料号216160206102F"],
  "料号216160206102F处于不可选择状态。", [source.create]);
add("ERP料号关联", "逻辑校验", "P2", "验证未选择料号时不能确认关联", "未选择料号",
  ["料号选择弹窗已打开", "弹窗内没有选中项"], ["点击“确认关联”"],
  "页面提示“请选择一个料号”。", [source.common]);
add("ERP料号关联", "业务流程", "P1", "验证确认关联后回显料号", "料号回显",
  ["料号选择弹窗已打开", "料号216160207100Q未被其他SKU关联"], ["选择料号216160207100Q", "点击“确认关联”"],
  "当前SKU行显示料号216160207100Q。", [source.create, source.common]);
add("ERP料号关联", "业务流程", "P2", "验证返回不改变原料号", "取消料号选择",
  ["当前SKU行显示料号216160207100Q", "料号选择弹窗已打开"], ["选择另一条可用料号", "点击“返回”"],
  "当前SKU行仍显示料号216160207100Q。", [source.create, source.common]);

// 新建版本提交
add("添加版本-提交", "业务流程", "P0", "验证完整填写后创建版本规格", "完整创建版本规格",
  ["车型“小骑士”已存在", "三类价格对应的审批规则可用", ...validVersionData],
  ["进入添加版本规格页面", "填写准备的版本信息和参数", "填写准备的SKU信息", "关联准备的料号", "点击“保存并提交审批”"],
  "页面显示“已创建并提交审批”弹窗。", [source.create, source.common]);
add("添加版本-提交", "功能需求", "P1", "验证车辆信息和参数的处理方式", "非价格信息处理方式",
  ["保存并提交审批说明已显示"], ["查看车辆信息、参数对应的处理方式"],
  "车辆信息、参数的处理方式显示“保存即生效 · 不审批”。", [source.create]);
add("添加版本-提交", "功能需求", "P1", "验证基础采购价每次提交审批", "基础采购价审批规则",
  ["保存并提交审批说明已显示"], ["查看基础采购价对应的处理方式"],
  "基础采购价的处理方式显示“提交财务审批（每次必审）”。", [source.create]);
add("添加版本-提交", "功能需求", "P1", "验证激活激励每次提交审批", "激活激励审批规则",
  ["保存并提交审批说明已显示"], ["查看激活激励对应的处理方式"],
  "激活激励的处理方式显示“提交财务审批（每次必审）”。", [source.create]);
add("添加版本-提交", "功能需求", "P1", "验证全国零售价首次定价提交审批", "全国零售价首次审批",
  ["保存并提交审批说明已显示"], ["查看全国零售价对应的处理方式"],
  "全国零售价的处理方式显示“首次定价 · 提交审批”。", [source.create]);
add("添加版本-提交", "业务流程", "P2", "验证创建结果可返回列表", "创建后返回列表",
  ["“已创建并提交审批”弹窗已打开"], ["点击“返回列表”"],
  "页面标题显示“整车商品信息维护”。", [source.create, source.common]);
add("添加版本-提交", "业务流程", "P2", "验证创建结果可查看审核进度", "创建后查看审核",
  ["“已创建并提交审批”弹窗已打开"], ["点击“查看审核进度”"],
  "页面标题显示“商品定价审批”。", [source.create, source.common]);
add("添加版本-提交", "业务流程", "P1", "验证审批期间采购侧暂停下单", "采购侧下单暂停",
  ["目标SKU的价格审批处于审核中", "采购侧可进入目标SKU下单页面"], ["在采购侧选择目标SKU", "尝试提交采购订单"],
  "目标SKU的采购订单未被提交。", [source.create]);
add("添加版本-提交", "业务流程", "P1", "验证价格审批通过后SKU具备上架条件", "审批通过后可上架",
  ["目标SKU的价格审批已全部通过", "用户具有商品上架权限"], ["进入目标SKU的上架管理页面", "查看目标SKU上架控制"],
  "目标SKU的上架控制处于可操作状态。", [source.create]);

// 编辑版本及价格
for (const [point, expected] of [
  ["车型名称回显", "车型名称字段显示“小骑士”。"],
  ["版本名称回显", "版本名称字段显示目标版本名称。"],
  ["版本描述回显", "版本描述字段显示目标版本描述。"],
  ["版本参数回显", "版本参数表显示目标版本的已保存参数。"],
  ["SKU信息回显", "规格及价格表显示目标版本的已保存SKU。"],
]) {
  add("编辑版本-页面回显", "功能需求", "P2", `验证${point}`, point,
    ["车型“小骑士”的目标版本已保存对应数据"], ["进入目标版本编辑页面", "查看对应区域"], expected, [source.edit]);
}
add("编辑版本-页面回显", "功能需求", "P1", "验证审批中的基础采购价不可编辑", "基础采购价审批锁定",
  ["目标SKU的基础采购价处于审批中"], ["进入目标版本编辑页面", "查看基础采购价输入框"],
  "基础采购价输入框处于不可编辑状态。", [source.edit]);
add("编辑版本-页面回显", "功能需求", "P1", "验证审批中的激活激励不可编辑", "激活激励审批锁定",
  ["目标SKU的激活激励处于审批中"], ["进入目标版本编辑页面", "查看激活激励输入框"],
  "激活激励输入框处于不可编辑状态。", [source.edit]);
add("编辑版本-页面回显", "业务流程", "P2", "验证已有SKU可以打开料号修改弹窗", "修改料号入口",
  ["目标SKU已关联料号216160207100Q"], ["进入目标版本编辑页面", "点击料号后的“修改”"],
  "页面显示“选择关联料号”弹窗。", [source.edit, source.common]);
for (const [point, data, action, expected, priority] of [
  ["版本名称保存", "准备一个未被占用的新版本名称", "修改版本名称", "重新进入后版本名称字段显示测试新名称。", "P1"],
  ["版本描述保存", "准备一段合法的新版本描述", "修改版本描述", "重新进入后版本描述字段显示测试新描述。", "P2"],
  ["版本参数保存", "车辆长度从1875修改为1880", "修改车辆长度参数", "重新进入后车辆长度参数显示1880。", "P2"],
  ["规格图片保存", "准备一张合法的新规格图片", "更换规格图片", "重新进入后规格图片区域显示新上传图片。", "P2"],
]) {
  add("编辑版本-仅保存", "业务流程", priority, `验证${point}`, point,
    ["目标版本不存在价格改动", data, "执行后恢复测试数据"],
    ["进入目标版本编辑页面", action, "点击“仅保存”", "重新进入目标版本编辑页面"], expected, [source.edit]);
}
add("编辑版本-新增SKU", "业务流程", "P0", "验证编辑页新增SKU并保存", "编辑新增SKU",
  ["目标版本不存在待新增的SKU颜色", "三类价格对应的审批规则可用", "准备合法的SKU信息和一条未占用料号"],
  ["进入目标版本编辑页面", "点击“+ 添加颜色”", "填写准备的SKU信息", "关联准备的料号", "点击“保存并提交审批”", "确认提交", "重新进入目标版本编辑页面"],
  "规格及价格表显示本条新增SKU颜色。", [source.edit, source.common]);
add("编辑版本-价格提交", "功能需求", "P1", "验证价格改动提交前显示处理说明", "价格提交确认弹窗",
  ["目标SKU存在待提交的价格改动", "三类价格对应的审批规则可用"], ["点击“保存并提交审批”"],
  "页面显示“保存并提交审批”确认弹窗。", [source.edit, source.common]);
for (const [label, current, target, priority] of [
  ["基础采购价", "1000.00", "980.00", "P0"],
  ["激活激励", "100.00", "120.00", "P0"],
]) {
  add("编辑版本-价格提交", "业务流程", priority, `验证修改${label}后生成待审批记录`, `${label}编辑审批`,
    [`目标SKU当前${label}=${current}元`, `目标${label}=${target}元`, "对应审批规则可用"],
    ["进入目标版本编辑页面", `将${label}修改为${target}元`, "点击“保存并提交审批”", "点击“确认提交”", "进入商品定价审批", `按目标SKU和${label}查找记录`],
    `审批列表显示${label}从${current}元调整为${target}元的审核中记录。`, [source.edit, source.audit, source.common]);
}
add("编辑版本-价格提交", "业务流程", "P2", "验证取消提交保留在编辑页面", "取消价格提交",
  ["保存并提交审批确认弹窗已打开"], ["点击“取消”"],
  "页面仍显示当前版本编辑表单。", [source.edit]);
add("编辑版本-价格提交", "异常用例", "P1", "验证激励金审批规则缺失时拦截提交", "激励金规则缺失",
  ["目标SKU存在待提交的价格改动", "激励金审批规则未配置"], ["点击“保存并提交审批”"],
  "页面显示包含“激活激励”事项的无法提交审批提示。", [source.edit, source.common]);
add("编辑版本-价格提交", "异常用例", "P1", "验证采购价审批规则停用时拦截提交", "采购价规则停用",
  ["目标SKU存在待提交的价格改动", "采购价审批规则已停用"], ["点击“保存并提交审批”"],
  "页面显示包含“基础采购价”事项的无法提交审批提示。", [source.edit, source.common]);
add("编辑版本-价格提交", "业务流程", "P1", "验证确认提交后进入商品定价审批", "确认价格提交",
  ["保存并提交审批确认弹窗已打开"], ["点击“确认提交”"],
  "页面标题显示“商品定价审批”。", [source.edit, source.common]);

// 商品定价审批中的关联观察点
add("商品定价审批", "功能需求", "P1", "验证整车审批筛选条件", "整车审批筛选项",
  ["商品定价审批页面已打开", "整车审批页签已选中"], ["查看筛选区域"],
  "筛选区域显示审核状态、价格类型、车型、版本、提交人。", [source.audit]);
add("商品定价审批", "功能需求", "P1", "验证SKU审批卡展示提交信息", "审批卡提交信息",
  ["整车审批列表存在目标SKU记录"], ["查看目标SKU审批卡头部"],
  "卡片头部显示SKU名称、颜色、提交人、提交时间。", [source.audit]);
add("商品定价审批", "功能需求", "P1", "验证价格审批行展示业务字段", "审批价格字段",
  ["目标SKU审批卡已展开"], ["查看价格审批表头"],
  "表头显示价格类型、变更前、变更后、状态、执行状态、审批时间、操作。", [source.audit]);
for (const [label, before, after] of [
  ["基础采购价", "1000", "980"],
  ["激活激励", "100", "120"],
  ["基础全国零售价", "首次定价", "2100"],
]) {
  add("商品定价审批", "功能需求", "P1", `验证${label}待审记录的价格信息`, `${label}待审价格`,
    [`目标SKU存在${label}审核中记录`], ["进入整车审批", "展开目标SKU审批卡", `查看${label}行`],
    `${label}行显示变更前${before}和变更后${after}。`, [source.audit]);
}
add("商品定价审批", "业务流程", "P1", "验证通过操作需要再次确认", "通过二次确认",
  ["目标价格行状态为审核中"], ["点击目标行的“通过”", "在首次确认弹窗点击“通过”"],
  "页面显示标题为“确认通过”的二次确认弹窗。", [source.audit, source.common]);
add("商品定价审批", "业务流程", "P1", "验证确认通过后价格审核状态变更", "确认通过审核",
  ["目标基础采购价行状态为审核中", "标题为“确认通过”的二次确认弹窗已打开"],
  ["点击“确认提交”", "查看目标基础采购价行的状态"],
  "目标基础采购价行状态显示“通过”。", [source.audit, source.common]);
add("商品定价审批", "逻辑校验", "P1", "验证驳回原因不能为空", "驳回原因必填",
  ["目标价格行状态为审核中"], ["点击目标行的“驳回”", "保持驳回原因为空", "点击“确认驳回”"],
  "页面提示“请填写驳回原因”。", [source.audit, source.common]);
add("商品定价审批", "业务流程", "P1", "验证确认驳回后价格审核终止", "驳回终止审核",
  ["目标价格行状态为审核中", "驳回原因=价格信息需修正"], ["点击目标行的“驳回”", "填写驳回原因", "点击“确认驳回”", "在二次确认弹窗点击“确认驳回”"],
  "目标价格行状态显示“驳回”。", [source.audit, source.common]);
add("商品定价审批", "功能需求", "P2", "验证审批记录入口展示流程记录", "审批记录",
  ["目标价格行存在审批记录入口"], ["点击目标行的“审批记录”"],
  "页面显示目标SKU与价格类型的审批记录弹窗。", [source.audit, source.common]);
add("商品定价审批", "功能需求", "P1", "验证菜单数字代表审核中SKU单据数", "商品定价审批菜单数字",
  ["SKU-A有2条审核中价格事项", "SKU-B和SKU-C各有1条审核中价格事项", "SKU-D的价格事项均已通过"],
  ["进入商品中心", "查看商品定价审批菜单数字"],
  "商品定价审批菜单数字显示3（审核中SKU单据数=SKU-A+SKU-B+SKU-C=3）。", [source.annotations]);

// 执行状态
add("审批执行状态", "功能需求", "P1", "验证未配置执行人时隐藏执行状态列", "执行状态列隐藏",
  ["当前列表内所有审批事项均未配置执行人"], ["进入商品定价审批", "查看列表表头"],
  "列表表头不显示“执行状态”。", [source.execution]);
add("审批执行状态", "功能需求", "P1", "验证任一事项配置执行人时显示执行状态列", "执行状态列显示",
  ["当前列表至少有一项基础采购价或激励金规则配置执行人"], ["进入商品定价审批", "查看列表表头"],
  "列表表头显示“执行状态”。", [source.execution]);
add("审批执行状态", "功能需求", "P1", "验证待审核记录不显示执行状态值", "待审核执行状态",
  ["执行状态列已显示", "目标价格行状态为审核中"], ["查看目标价格行的执行状态"],
  "目标价格行的执行状态显示“—”。", [source.execution]);
add("审批执行状态", "功能需求", "P1", "验证已驳回记录不显示执行状态值", "驳回执行状态",
  ["执行状态列已显示", "目标价格行状态为驳回"], ["查看目标价格行的执行状态"],
  "目标价格行的执行状态显示“—”。", [source.execution]);
add("审批执行状态", "业务流程", "P1", "验证配置执行人后审批通过进入待执行", "审批通过待执行",
  ["目标基础采购价审批规则已配置执行人", "目标价格行已审批通过", "执行动作尚未完成"], ["进入商品定价审批", "查看目标价格行的执行状态"],
  "目标价格行的执行状态显示“待执行”。", [source.execution]);
add("审批执行状态", "业务流程", "P1", "验证执行完成后显示已执行", "执行完成状态",
  ["目标激活激励审批规则已配置执行人", "目标激活激励行的执行动作已完成"], ["进入商品定价审批", "查看目标激活激励行的执行状态"],
  "目标激活激励行的执行状态显示“已执行”。", [source.execution]);
add("审批执行状态", "功能需求", "P1", "验证全国零售价不进入执行环节", "全国零售价无执行状态",
  ["执行状态列因其他事项配置执行人而显示", "目标全国零售价审批已通过"], ["查看全国零售价行的执行状态"],
  "全国零售价行的执行状态显示“—”。", [source.execution]);

const flowLinks = new Map([
  ["完整创建版本规格", ["FLOW-VSP-001", "01 创建版本并提交价格审批", "以本次准备的车型、版本、颜色和ERP料号标识后续环节使用的同一SKU"]],
  ["创建后查看审核", ["FLOW-VSP-001", "02 进入价格审批", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["采购侧下单暂停", ["FLOW-VSP-001", "02 审批期间验证采购限制", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["基础全国零售价待审价格", ["FLOW-VSP-001", "02 核对首次零售价审批记录", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["全国零售价无执行状态", ["FLOW-VSP-001", "03 核对零售价审批后状态", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["审批通过后可上架", ["FLOW-VSP-001", "04 验证审批终态后的上架条件", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["基础采购价编辑审批", ["FLOW-VSP-002", "01 提交基础采购价变更", "使用同一目标SKU，记录车型、版本、颜色和ERP料号"]],
  ["激活激励编辑审批", ["FLOW-VSP-002", "01 提交激活激励变更", "使用同一目标SKU，记录车型、版本、颜色和ERP料号"]],
  ["确认价格提交", ["FLOW-VSP-002", "01 确认提交价格变更", "使用同一目标SKU，记录车型、版本、颜色和ERP料号"]],
  ["基础采购价待审价格", ["FLOW-VSP-002", "02 核对基础采购价审批记录", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["激活激励待审价格", ["FLOW-VSP-002", "02 核对激活激励审批记录", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["通过二次确认", ["FLOW-VSP-002", "03 确认基础采购价审批", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["确认通过审核", ["FLOW-VSP-002", "03 完成基础采购价审批", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["审批通过待执行", ["FLOW-VSP-002", "04 核对审批通过后的待执行状态", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
  ["执行完成状态", ["FLOW-VSP-002", "05 核对执行终态", "使用本流程记录的车型、版本、颜色和ERP料号定位同一SKU"]],
]);

for (const item of cases) {
  const link = flowLinks.get(item.验证用例子项);
  if (!link) continue;
  const [flowId, stage, businessObject] = link;
  item.流程编号 = flowId;
  item.前置条件.unshift(`共同业务对象：${businessObject}`);
  item.备注.push(`流程阶段：${stage}；共同业务对象：目标车辆SKU。`);
}

const questions = [];
function question(structure, matter, known, missing, impact) {
  const id = `Q-${String(questions.length + 1).padStart(3, "0")}`;
  questions.push({
    问题编号: id,
    功能模块: moduleName,
    功能结构: structure,
    待确认事项: matter,
    已知依据: known,
    缺失信息: missing,
    影响用例: impact,
    确认状态: "待确认",
  });
}

question("新建车型", "车型名称是否要求唯一？", "原型仅标记车型名称必填。", "唯一范围、大小写与空格处理规则、重复提示。", "重复车型名称用例");
question("新建车型", "车型名称的长度和允许字符是什么？", "原型没有给出文本边界。", "最小长度、最大长度、字符集与超限提示。", "车型名称边界用例");
question("新建车型", "车型主图支持哪些格式、大小和尺寸？", "原型仅标记车型主图必填。", "格式、文件大小、像素、比例与失败提示。", "车型主图上传边界用例");
question("添加版本-基础信息", "同一车型下版本名称是否要求唯一？", "原型仅标记版本名称必填。", "唯一范围、规范化规则与重复提示。", "重复版本名称用例");
question("添加版本-基础信息", "版本名称和版本描述的长度及允许字符是什么？", "原型没有给出文本边界。", "长度、字符集与超限提示。", "版本文本边界用例");
question("添加版本-参数", "可添加的参数来源、必填规则和重复参数处理方式是什么？", "原型展示添加参数和删除参数入口。", "参数选择范围、默认值、重复规则与空值规则。", "参数选择和校验用例");
question("添加版本-SKU", "规格图片支持哪些格式、大小和尺寸？", "原型仅标记规格图片必填。", "格式、文件大小、像素、比例与失败提示。", "规格图片上传边界用例");
question("添加版本-SKU", "同一版本是否允许重复颜色名称？", "原型支持一个版本维护多条颜色SKU。", "唯一范围、空格处理、大小写规则与重复提示。", "重复颜色用例");
question("SKU价格校验", "三类价格是否必须大于0？", "原型仅标记三类价格必填。", "是否允许0、负数与对应提示。", "价格等价类用例");
question("SKU价格校验", "三类价格的整数位、小数精度和舍入规则是什么？", "原型没有给出金额边界。", "最大值、最小正数、小数位与舍入规则。", "价格边界值用例");
question("SKU价格校验", "价格输入包含非数字、科学计数法或千分位时如何处理？", "原型没有给出输入格式化规则。", "合法输入格式、解析方式与提示。", "价格格式用例");
question("添加版本-提交", "重复点击或超时重试时如何避免重复创建版本、SKU和审批记录？", "原型只描述一次提交结果。", "幂等依据、重试机制与结果查询方式。", "重复提交和超时恢复用例");
question("添加版本-提交", "三类价格审批记录部分创建失败时如何处理？", "原型说明三类价格均会提交审批。", "整单回滚、部分保留、补偿和重试规则。", "部分成功与补偿用例");
question("添加版本-提交", "采购侧暂停下单的具体页面状态和提示是什么？", "原型只说明审批期间采购侧暂停下单。", "禁用入口、提交拦截位置、提示文案与恢复时点。", "采购侧暂停下单细化用例");
question("编辑版本-价格提交", "全国零售价首次审批后的再次修改是否需要审批？", "原型只明确首次定价提交审批。", "后续修改的审批规则和生效方式。", "全国零售价再次修改用例");
question("编辑版本-价格提交", "已有同类价格审核中时是否允许再次提交？", "原型展示采购价和激励金审批中锁定。", "重复申请规则、冲突提示和覆盖规则。", "待审价格重复提交用例");
question("编辑版本-页面回显", "全国零售价审核中时是否锁定输入框？", "原型只明确展示采购价和激励金的审批中锁定状态。", "零售价待审期间的编辑规则。", "全国零售价待审锁定用例");
question("编辑版本-新增SKU", "已有SKU颜色和ERP料号在什么状态下允许修改？", "原型展示颜色输入框和料号修改入口。", "允许修改的状态、限制条件与历史数据影响。", "已有SKU颜色和料号修改用例");
question("编辑版本-新增SKU", "新增但未保存的SKU行是否允许删除？", "原型展示添加颜色入口但未展示删除操作。", "删除入口、确认规则与页面恢复方式。", "未保存SKU删除用例");
question("添加版本-基础信息", "存在未保存内容时返回、刷新或关闭页面如何处理？", "原型提供返回入口。", "离开拦截范围、提示与草稿规则。", "未保存退出用例");
question("车辆SKU价格管理", "新建车型、添加版本、编辑价格和审批分别需要哪些权限？", "原型公共实体仅说明当前登录人为超级管理员。", "角色权限矩阵、组织数据范围与越权反馈。", "权限和数据范围用例");
question("编辑版本-价格提交", "全国零售价审批规则不可用时如何反馈？", "原型只演示激励金规则未配置和采购价规则停用。", "零售价规则缺失或停用时的拦截内容。", "全国零售价规则异常用例");
question("价格审批与执行", "配置执行人时，价格生效节点与跨模块可见时效是什么？", "添加与编辑页面写明审批通过后价格生效；执行状态说明又规定配置执行人后，审批通过进入待执行。", "当前价写入节点、待执行期间采购与上架读取值、跨模块可见时限、刷新或重试方式以及执行失败后的恢复规则。", "新建版本、编辑价格、采购限制、商品上架和审批执行状态用例");
question("商品定价审批", "全部通过和全部驳回是否需要统一驳回原因及逐条留痕？", "原型展示批量操作和二次确认。", "批量驳回原因、部分失败与审批记录规则。", "批量审批用例");

const payload = { 测试用例: cases, 需求待确认: questions };

function normalizeIntent(text) {
  return String(text).replace(/[\s，。、“”‘’：:（）()\-_/]/g, "").toLowerCase();
}

function validatePayload() {
  const errors = [];
  assert.equal(Object.getPrototypeOf(payload), Object.prototype);
  assert(Array.isArray(payload.测试用例));
  assert(Array.isArray(payload.需求待确认));
  const ids = new Set();
  const intents = new Set();
  const vague = /功能正常|结果正确|有合理提示|无异常|符合预期|同步正常/;
  const endpoint = /\/product\/|https?:\/\/|\b(GET|POST|PUT|PATCH|DELETE)\b/i;
  const rawPlaceholder = /yyyyMMddHHmmss|(?:model|version|sku)-(?:main|new|limit|over)\.(?:jpg|png|gif)/i;
  const unresolvedVariable = /(?:^|[^A-Z])N(?:[^A-Z]|$)/;
  cases.forEach((item, index) => {
    const row = index + 1;
    if (item.序号 !== row) errors.push(`序号不连续：${item.用例编号}`);
    if (item.用例编号 !== `VSP-${String(row).padStart(3, "0")}`) errors.push(`编号不连续：${item.用例编号}`);
    if (ids.has(item.用例编号)) errors.push(`编号重复：${item.用例编号}`);
    ids.add(item.用例编号);
    if (typeof item.流程编号 !== "string") errors.push(`流程编号字段非法：${item.用例编号}`);
    if (!validTypes.has(item.用例类型)) errors.push(`用例类型非法：${item.用例编号}`);
    if (!validPriorities.has(item.优先级)) errors.push(`优先级非法：${item.用例编号}`);
    if (!item.用例描述.startsWith("验证")) errors.push(`用例描述未以验证开头：${item.用例编号}`);
    if (!item.验证用例子项.trim()) errors.push(`验证用例子项为空：${item.用例编号}`);
    if (!Array.isArray(item.前置条件) || item.前置条件.length === 0) errors.push(`前置条件非法：${item.用例编号}`);
    if (!Array.isArray(item.操作步骤) || item.操作步骤.length === 0) errors.push(`操作步骤非法：${item.用例编号}`);
    if (!Array.isArray(item.预期结果) || item.预期结果.length !== 1) errors.push(`预期结果数量非法：${item.用例编号}`);
    if (vague.test(item.预期结果[0])) errors.push(`预期结果不可判断：${item.用例编号}`);
    if (!validResults.has(item.测试结果)) errors.push(`测试结果非法：${item.用例编号}`);
    if (!Array.isArray(item.备注) || !item.备注.some((note) => note.startsWith("来源："))) errors.push(`来源缺失：${item.用例编号}`);
    if (endpoint.test(JSON.stringify(item))) errors.push(`包含接口地址或HTTP方法：${item.用例编号}`);
    if (rawPlaceholder.test(JSON.stringify(item))) errors.push(`包含普通用例技术占位符或虚构文件名：${item.用例编号}`);
    if (unresolvedVariable.test(item.预期结果[0])) errors.push(`预期结果包含未解析变量：${item.用例编号}`);
    const flowLink = flowLinks.get(item.验证用例子项);
    if (flowLink) {
      if (!item.前置条件.some((condition) => condition.startsWith("共同业务对象："))) errors.push(`流程用例缺少共同业务对象：${item.用例编号}`);
      if (item.流程编号 !== flowLink[0]) errors.push(`流程编号不匹配：${item.用例编号}`);
      if (!item.备注.some((note) => note.startsWith(`流程阶段：${flowLink[1]}；`))) errors.push(`流程用例缺少流程阶段：${item.用例编号}`);
    } else if (item.流程编号 !== "") {
      errors.push(`普通用例流程编号应留空：${item.用例编号}`);
    }
    const intent = normalizeIntent(`${item.功能模块}|${item.功能结构}|${item.验证用例子项}|${item.前置条件.join("|")}|${item.操作步骤.join("|")}|${item.预期结果[0]}`);
    if (intents.has(intent)) errors.push(`语义键重复：${item.用例编号}`);
    intents.add(intent);
  });
  const questionIds = new Set();
  questions.forEach((item, index) => {
    const id = `Q-${String(index + 1).padStart(3, "0")}`;
    if (item.问题编号 !== id) errors.push(`问题编号不连续：${item.问题编号}`);
    if (questionIds.has(item.问题编号)) errors.push(`问题编号重复：${item.问题编号}`);
    questionIds.add(item.问题编号);
    if (!validQuestionStatus.has(item.确认状态)) errors.push(`确认状态非法：${item.问题编号}`);
  });
  const p0Count = cases.filter((item) => item.优先级 === "P0").length;
  if (p0Count > 6) errors.push(`P0不是最小冒烟集：${p0Count}`);
  const flowStages = new Map();
  cases.filter((item) => item.流程编号).forEach((item) => item.备注.filter((note) => note.startsWith("流程阶段：")).forEach((note) => {
    const match = note.match(/^流程阶段：(\d{2})/);
    if (!match) return;
    if (!flowStages.has(item.流程编号)) flowStages.set(item.流程编号, new Set());
    flowStages.get(item.流程编号).add(match[1]);
  }));
  for (const [flowId, requiredStages] of Object.entries({ "FLOW-VSP-001": ["01", "02", "03", "04"], "FLOW-VSP-002": ["01", "02", "03", "04", "05"] })) {
    const actual = flowStages.get(flowId) || new Set();
    requiredStages.forEach((stage) => { if (!actual.has(stage)) errors.push(`流程阶段缺失：${flowId}-${stage}`); });
  }
  return { passed: errors.length === 0, errors, summary: { cases: cases.length, questions: questions.length, p0: p0Count, flows: [...flowStages.keys()] } };
}

const quality = validatePayload();
assert.equal(quality.passed, true, JSON.stringify(quality.errors, null, 2));

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}
function caseRow(item) {
  return [
    item.序号, item.用例编号, item.功能模块, item.功能结构, item.用例类型, item.优先级,
    item.用例描述, item.验证用例子项, numbered(item.前置条件), numbered(item.操作步骤),
    item.预期结果[0], item.流程编号, item.测试结果, item.测试人员, numbered(item.备注),
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
    const width = Math.max(5, widths[index] || 12);
    const count = String(value ?? "").split("\n").reduce((sum, part) => sum + Math.max(1, Math.ceil([...part].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(180, Math.max(34, lines * 17 + 8));
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
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#CBD5E1" },
  };
  for (const column of leftColumns) sheet.getRange(`${column}2:${column}${lastRow}`).format.horizontalAlignment = "left";
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#166534",
    font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    rowHeightPx: 40,
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
await fs.writeFile(reportPath, `${JSON.stringify(quality, null, 2)}\n`, "utf8");

const outputPath = process.argv[2] ? path.resolve(process.argv[2]) : await nextOutputPath();
const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例",
  headers: caseHeaders,
  rows: cases.map(caseRow),
  widths: [8, 15, 19, 24, 13, 9, 36, 27, 47, 52, 45, 19, 12, 14, 58],
  tableName: "VehicleSkuPriceCasesPrototype",
  validations: [
    { column: "E", values: [...validTypes] },
    { column: "F", values: [...validPriorities] },
    { column: "M", values: [...validResults] },
  ],
  priorityColumn: "F",
  leftColumns: ["G", "H", "I", "J", "K", "O"],
});
const pending = buildSheet(workbook, {
  name: "需求待确认",
  headers: questionHeaders,
  rows: questions.map(questionRow),
  widths: [14, 20, 28, 52, 54, 50, 38, 14],
  tableName: "VehicleSkuPriceQuestionsPrototype",
  validations: [{ column: "H", values: [...validQuestionStatus] }],
  leftColumns: ["D", "E", "F", "G"],
});

const inspection = {
  summary: (await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 15, tableMaxCellChars: 120 })).ndjson,
  mainHead: (await workbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O8", maxChars: 16000 })).ndjson,
  pendingHead: (await workbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:H${Math.min(9, pending.lastRow)}`, maxChars: 14000 })).ndjson,
  formulaErrors: (await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "formula error scan" })).ndjson,
};
assert(inspection.formulaErrors.includes("Cell search matched 0 entries."), "formula error found before export");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O8", "preview-main-prototype.png"],
  ["需求待确认", `A1:H${Math.min(9, pending.lastRow)}`, "preview-pending-prototype.png"],
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
  reportPath,
  cases: cases.length,
  questions: questions.length,
  p0: quality.summary.p0,
  bytes: stat.size,
}, null, 2));
