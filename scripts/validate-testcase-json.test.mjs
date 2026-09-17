import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadTestcaseLanguageRules, validateTestcaseJson, validateTestcaseRecords } from "./validate-testcase-json.mjs";

const validCase = {
  序号: 1,
  用例编号: "UAPP-0001",
  功能模块: "直播",
  功能结构: "双主播连麦（主播视角）",
  用例类型: "逻辑校验",
  优先级: "P1",
  用例描述: "验证主播在普通直播间发起双主播连麦",
  验证用例子项: "双主播连麦适用范围",
  前置条件: ["主播已进入普通直播间"],
  操作步骤: ["点击“双主播连麦”按钮"],
  预期结果: ["普通直播间支持双主播连麦"],
  流程编号: "",
  测试结果: "未测",
  测试人员: "",
  备注: ["规则：BR-TEST-001"],
};

async function validate(value) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "testcase-json-"));
  const file = path.join(directory, "case.json");
  try {
    await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
    return await validateTestcaseJson(file);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

test("AGENTS.md 机器语言规则可解析且词表无重复", async () => {
  const rules = await loadTestcaseLanguageRules();
  const verbs = Object.values(rules.actionVerbs).flat();
  assert.equal(new Set(verbs).size, verbs.length);
});

test("具体字段通过，通用占位内容失败", async () => {
  const passed = await validate({ 测试用例: [validCase], 需求待确认: [] });
  assert.equal(passed.状态, "通过");
  assert.equal((await validate({ 测试用例: [{ ...validCase, 优先级: "P4" }], 需求待确认: [] })).状态, "通过");

  const failed = await validate({
    测试用例: [{
      ...validCase,
      用例描述: "验证双主播连麦操作结果",
      验证用例子项: "双主播连麦业务规则",
      操作步骤: ["执行目标操作"],
      预期结果: ["1. 普通直播间支持双主播连麦"],
    }],
    需求待确认: [],
  });
  assert.equal(failed.状态, "失败");
  assert.ok(failed.问题.some((issue) => issue.includes("用例描述使用通用占位尾词")));
  assert.ok(failed.问题.some((issue) => issue.includes("验证用例子项使用通用占位尾词")));
  assert.ok(failed.问题.some((issue) => issue.includes("操作步骤使用通用占位内容")));
  assert.ok(failed.问题.some((issue) => issue.includes("预期结果不得包含序号")));
});

test("逐步检查动作，结果句和查看页面状态不能蒙混通过", async () => {
  const rules = await loadTestcaseLanguageRules();
  for (const steps of [["提交成功"], ["点击“双主播连麦”按钮", "业务已完成"], ["在直播记录完成“场次结束”后查看页面状态"]]) {
    const result = validateTestcaseRecords({ 测试用例: [{ ...validCase, 操作步骤: steps }], 需求待确认: [] }, rules);
    assert.equal(result.状态, "失败", steps.join("；"));
  }
});

test("字段应各司其职，不用机械缩短代替可读性", async () => {
  const rules = await loadTestcaseLanguageRules();
  const failed = {
    ...validCase,
    前置条件: ["使用主播身份进入直播结束页"],
    操作步骤: ["点击“评论”"],
    预期结果: ["检查评论入口是否显示"],
    备注: ["规则：BR-TEST-001", "说明：依据当前资料静态设计，未动态验证产品行为"],
  };
  const issues = validateTestcaseRecords({ 测试用例: [failed], 需求待确认: [] }, rules).问题;
  assert.ok(issues.some(item => item.includes("前置条件包含本次操作")));
  assert.ok(issues.some(item => item.includes("预期结果写成检查动作")));
  assert.ok(issues.some(item => item.includes("备注使用冗长固定说明")));

  const readable = {
    ...validCase,
    用例描述: "验证场次结束后的评论入口",
    验证用例子项: "评论入口",
    前置条件: ["用户", "当前场次已结束"],
    操作步骤: ["进入直播结束页"],
    预期结果: ["评论入口不显示"],
    备注: ["来源（原型页面）：live-end-viewer.html；位置：结束页", "规则：BR-TEST-001", "未动态验证"],
  };
  assert.equal(validateTestcaseRecords({ 测试用例: [readable], 需求待确认: [] }, rules).状态, "通过");
  readable.预期结果 = ["确认按钮保持禁用"];
  assert.equal(validateTestcaseRecords({ 测试用例: [readable], 需求待确认: [] }, rules).状态, "通过");
});

test("展示 RTP 配置值不需要附加无关算式，显式计算仍需数据及最终值", async () => {
  const rules = await loadTestcaseLanguageRules();
  const display = { ...validCase, 用例描述: "验证配置页回显已保存的 RTP", 验证用例子项: "RTP 配置回显", 操作步骤: ["查看“RTP”"], 预期结果: ["RTP 显示 96%"] };
  assert.equal(validateTestcaseRecords({ 测试用例: [display], 需求待确认: [] }, rules).状态, "通过");
  const missingData = { ...display, 预期结果: ["计算结果为 10 + 20 = 30 金币"] };
  assert.ok(validateTestcaseRecords({ 测试用例: [missingData], 需求待确认: [] }, rules).问题.some(item => item.includes("具体测试数据")));
  const inputInStep = { ...missingData, 前置条件: ['变更前余额为 10 金币'], 操作步骤: ['输入变更金额 20 金币', '点击“确认”'] };
  assert.equal(validateTestcaseRecords({ 测试用例: [inputInStep], 需求待确认: [] }, rules).状态, '通过');
});

test("同一子项的不同输入边界可以保留，同条件冲突必须失败", async () => {
  const rules = await loadTestcaseLanguageRules();
  const base = { ...validCase, 用例类型: "功能需求", 用例描述: "验证填写初始密码后提交账号资料", 验证用例子项: "初始密码最小长度", 操作步骤: ["输入已准备的初始密码", "点击“确认”"] };
  const short = { ...base, 前置条件: ["已准备 5 位初始密码，其他字段合法"], 预期结果: ["初始密码长度校验不通过"] };
  const boundary = { ...base, 序号: 2, 用例编号: "UAPP-0002", 前置条件: ["已准备 6 位初始密码，其他字段合法"], 预期结果: ["初始密码长度校验通过"] };
  assert.equal(validateTestcaseRecords({ 测试用例: [short, boundary], 需求待确认: [] }, rules).状态, "通过");
  boundary.前置条件 = short.前置条件;
  assert.ok(validateTestcaseRecords({ 测试用例: [short, boundary], 需求待确认: [] }, rules).问题.some((item) => item.includes("预期结果冲突")));
});

test("改子项名称不能掩盖完全重复，正负数不能被归一化成相同结果", async () => {
  const rules = await loadTestcaseLanguageRules();
  const copy = { ...validCase, 序号: 2, 用例编号: "UAPP-0002", 验证用例子项: "另一名称" };
  assert.ok(validateTestcaseRecords({ 测试用例: [validCase, copy], 需求待确认: [] }, rules).问题.some((item) => item.includes("完全重复")));
  const a = { ...validCase, 用例类型: "功能需求", 预期结果: ["余额变动为 +10 金币"] };
  const b = { ...copy, 验证用例子项: a.验证用例子项, 预期结果: ["余额变动为 -10 金币"] };
  assert.ok(validateTestcaseRecords({ 测试用例: [a, b], 需求待确认: [] }, rules).问题.some((item) => item.includes("预期结果冲突")));
});

test('输入空格不得在去重时丢失，保存值的空格差异仍属于结果冲突', async () => {
  const rules = await loadTestcaseLanguageRules();
  const a = { ...validCase, 用例描述: '验证输入主播昵称后查询', 验证用例子项: '主播昵称检索', 操作步骤: ['输入“Nadia”'], 预期结果: ['搜索结果包含 Nadia'] };
  const b = { ...a, 序号: 2, 用例编号: 'UAPP-0002', 操作步骤: ['输入“  Nadia  ”'] };
  assert.equal(validateTestcaseRecords({测试用例:[a,b],需求待确认:[]},rules).状态,'通过');
  b.操作步骤=a.操作步骤;
  a.预期结果=['昵称保存为“Nadia”'];
  b.预期结果=['昵称保存为“ Nadia ”'];
  assert.ok(validateTestcaseRecords({测试用例:[a,b],需求待确认:[]},rules).问题.some(issue=>issue.includes('预期结果冲突')));
});
