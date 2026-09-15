import assert from "node:assert/strict";
import test from "node:test";
import { COVERAGE_DIMENSIONS, caseFromRule, casesFromRule, evaluateCalculation, ruleBusinessKey, ruleDesignHash, validateCoverageExpansion, validateRuleDesign } from "./testcase-design.mjs";
import { loadTestcaseLanguageRules } from "./validate-testcase-json.mjs";

const language = await loadTestcaseLanguageRules();
function rule() {
  return {
    稳定规则标识: "BR-AUDIT-001", 业务对象: "初始密码", 执行角色: "公会长", 适用角色和端: ["公会App-公会长"],
    功能模块: "运营工具", 功能结构: "创建运营账号（公会长视角）", 触发动作: "提交账号资料", 来源状态: "创建表单未提交",
    可生成正式用例: true,
    必要条件: ["使用公会长身份进入创建运营账号页，其他必填项使用合法值", "初始密码准备为 5 位"],
    目标状态或可观察结果: "初始密码长度校验不通过", 证据引用: [{ 路径: "test-requirement.txt", 位置: "初始密码", 证明内容: "测试契约：至少 6 位" }],
    用例设计: { 场景: "验证初始密码为 5 位时提交账号资料", 验证子项: "初始密码最小长度", 用例类型: "异常用例", 优先级: "P1",
      观察端: "公会App", 观察页面: "创建运营账号", 观察对象: "初始密码校验", 观察证据: [0], 计算: null,
      设计说明: "用 5 位输入验证 6 位最小长度下界，其他字段排除独立阻断原因。",
      步骤: [{ 执行角色: "公会长", 动作: "输入", 对象: "初始密码", 操作: "输入已准备的 5 位初始密码", 证据: [0] },
        { 执行角色: "公会长", 动作: "提交", 对象: "账号资料", 操作: "提交账号资料", 证据: [0] }] },
  };
}
const reviewed = (value) => ({ ...value, 设计复核: { 状态: "通过", 说明: "测试中显式完成语义复核", 设计SHA256: ruleDesignHash(value) } });

test("未设计、未复核、修改后的设计均不能生成正式用例", () => {
  const sample = rule();
  assert.ok(validateRuleDesign(sample, language).length);
  const ready = reviewed(sample);
  assert.deepEqual(validateRuleDesign(ready, language), []);
  ready.用例设计.步骤[0].操作 = "输入已准备的 6 位初始密码";
  assert.ok(validateRuleDesign(ready, language).some((item) => item.includes("复核已失效")));
  assert.ok(validateRuleDesign({ 证据引用: [] }, language).some((item) => item.includes("结构化用例设计")));
});

test("外部管理员动作不能伪装成主播操作，引用空入口不能放行", () => {
  const sample = rule();
  sample.用例设计.步骤[0].执行角色 = "平台管理员";
  sample.用例设计.步骤[0].证据 = [];
  const issues = validateRuleDesign(reviewed(sample), language);
  assert.ok(issues.some((item) => item.includes("执行角色")));
  assert.ok(issues.some((item) => item.includes("入口或动作证据")));
});

test('子项按明确设计原样传递，允许同维度复用；缺失或修改后未复核不得导出', () => {
  const sample = rule();
  sample.用例设计.场景 = '验证邀请记录翻页';
  sample.用例设计.验证子项 = '邀请记录分页';
  sample.必要条件 = ['已登录用户的邀请记录超过一页'];
  sample.用例设计.步骤 = [{执行角色:sample.执行角色,动作:'点击',对象:'下一页',操作:'点击下一页',证据:[0]}];
  sample.目标状态或可观察结果 = '显示下一页邀请记录';
  const first = reviewed(sample);
  assert.equal(caseFromRule(first,1,'USER').验证用例子项,'邀请记录分页');
  const previous = structuredClone(sample);
  previous.用例设计.步骤[0].操作 = '点击上一页';
  previous.用例设计.步骤[0].对象 = '上一页';
  previous.目标状态或可观察结果 = '显示上一页邀请记录';
  assert.equal(caseFromRule(reviewed(previous),2,'USER').验证用例子项,'邀请记录分页');
  first.用例设计.验证子项 = '连麦邀请状态';
  assert.throws(()=>caseFromRule(first,1,'USER'),/复核已失效/);
  for (const value of [undefined,'','   ']) {
    sample.用例设计.验证子项 = value;
    assert.throws(()=>caseFromRule(reviewed(sample),1,'USER'),/缺少明确验证子项/);
  }
});

test("计算按已命名业务变量执行，拒绝未知公式、零分母和错误最终值", () => {
  const expression = { 运算: "*", 参数: [{ 变量: "price" }, { 变量: "quantity" }] };
  assert.equal(evaluateCalculation(expression, { price: 10, quantity: 3 }), 30);
  assert.equal(evaluateCalculation({ 运算: "min", 参数: [{ 变量: "account" }, { 变量: "guild" }] }, { account: 500, guild: 300 }), 300);
  assert.equal(evaluateCalculation({ 运算: "max", 参数: [{ 变量: "remainder" }, { 变量: "floor" }] }, { remainder: -5, floor: 0 }), 0);
  assert.equal(evaluateCalculation({ 运算: "round", 参数: [{ 运算: "/", 参数: [{ 变量: "seconds" }, { 变量: "minute" }] }, { 变量: "places" }] }, { seconds: 90, minute: 60, places: 0 }), 2);
  assert.throws(() => evaluateCalculation({ 运算: "round", 参数: [{ 变量: "amount" }, { 变量: "places" }] }, { amount: -1, places: 0 }), /仅支持非负/);
  assert.equal(evaluateCalculation({ 运算: "round", 参数: [{ 变量: "amount" }, { 变量: "places" }] }, { amount: 1.005, places: 2 }), 1.01);
  assert.throws(() => evaluateCalculation(expression, { price: 10 }), /缺少数值变量/);
  assert.throws(() => evaluateCalculation({ 运算: "/", 参数: [{ 变量: "a" }, { 变量: "b" }] }, { a: 10, b: 0 }), /零分母/);
  assert.throws(() => evaluateCalculation({ 运算: "guess", 参数: [{ 变量: "a" }, { 变量: "b" }] }, { a: 10, b: 3 }), /不支持/);
  const sample = rule();
  sample.用例设计.计算 = { 公式: "礼物单价 × 数量", 数据范围: "本场成功赠送", 结果单位: "金币", 证据: [0],
    变量: [{ 名称: "price", 数值: 10, 单位: "金币/个", 业务含义: "礼物单价" }, { 名称: "quantity", 数值: 3, 单位: "个", 业务含义: "成功送出数量" }],
    表达式: expression, 最终值: 150 };
  assert.ok(validateRuleDesign(reviewed(sample), language).some((item) => item.includes("独立复算")));
  sample.用例设计.计算.最终值 = 30;
  for (const expected of ['10 × 3 = 300 金币', '30 金币为测试输入，计算结果为 10 × 3 = 300 金币']) {
    sample.目标状态或可观察结果 = expected;
    assert.ok(validateRuleDesign(reviewed(sample), language).some(item => item.includes('算式末项')));
  }
  sample.目标状态或可观察结果 = '计算结果为 10 × 3 = 30 金币';
  assert.deepEqual(validateRuleDesign(reviewed(sample), language), []);
});

test('实现推导在正式备注中明确标记', () => {
  const sample = rule();
  sample.规则状态 = '实现推导';
  assert.ok(caseFromRule(reviewed(sample), 1, 'GAPP').备注.some(item => item.startsWith('实现推导：')));
});

test('来源按文件合并并标记来源类型', () => {
  const sample = rule();
  sample.证据引用 = [
    { 路径: 'liveshow-proto/prototype/annotations/user.js', 位置: '礼物面板 / 字段', 证明内容: '展示礼物' },
    { 路径: 'liveshow-proto/prototype/annotations/user.js', 位置: '礼物面板 / 业务', 证明内容: '赠送礼物' },
    { 路径: 'liveshow-proto/context/系统概要 .md', 位置: '商品和消费', 证明内容: '记录消费' },
  ];
  const notes = caseFromRule(reviewed(sample), 1, 'GAPP').备注.filter(item => item.startsWith('来源（'));
  assert.deepEqual(notes, [
    '来源（原型批注）：liveshow-proto/prototype/annotations/user.js；位置：礼物面板 / 字段、礼物面板 / 业务',
    '来源（需求文档）：liveshow-proto/context/系统概要 .md；位置：商品和消费',
  ]);
});

test('前置条件只保留角色、初始状态和必要数据，备注使用短边界说明', () => {
  const sample = rule();
  const generated = caseFromRule(reviewed(sample), 1, 'GAPP');
  assert.ok(generated.备注.includes('未动态验证'));
  assert.ok(!generated.备注.some(item => item.startsWith('说明：依据当前资料')));
  sample.必要条件 = ['使用公会长身份进入创建运营账号页'];
  assert.ok(validateRuleDesign(reviewed(sample), language).some(item => item.includes('前置条件包含本次操作')));
});

test("展示省略号不会补上算式，也不截断同时、小时、时间等词", () => {
  const sample = rule();
  sample.目标状态或可观察结果 = "超过 5 人显示“...”";
  sample.用例设计.验证子项 = "头像超限省略";
  sample.用例设计.场景 = "验证报表权限同时生效，统计时间包含 1 小时";
  const generated = caseFromRule(reviewed(sample), 1, "GAPP");
  assert.deepEqual(generated.预期结果, [sample.目标状态或可观察结果]);
  assert.equal(generated.用例描述, sample.用例设计.场景);
  assert.equal(generated.验证用例子项, "头像超限省略");
});

test("去重保留不同条件、输入和正负号，忽略子项名称修饰", () => {
  const a = rule();
  const b = structuredClone(a);
  b.必要条件[1] = "初始密码准备为 6 位";
  assert.notEqual(ruleBusinessKey(a), ruleBusinessKey(b));
  b.必要条件 = a.必要条件;
  b.用例设计.验证子项 = "换个标题";
  assert.equal(ruleBusinessKey(a), ruleBusinessKey(b));
  a.目标状态或可观察结果 = "余额变动 +10 金币";
  b.目标状态或可观察结果 = "余额变动 -10 金币";
  assert.notEqual(ruleBusinessKey(a), ruleBusinessKey(b));
});

test("一条业务规则按有效条件展开多个独立分支", () => {
  const success = reviewed(rule());
  const failureDraft = structuredClone(rule());
  failureDraft.必要条件[1] = "初始密码准备为 6 位";
  failureDraft.目标状态或可观察结果 = "系统创建运营账号";
  failureDraft.用例设计.场景 = "验证有效初始密码提交账号资料";
  const failure = reviewed(failureDraft);
  const parent = {
    ...success,
    稳定规则标识: "BR-AUDIT-PASSWORD",
    覆盖判断: COVERAGE_DIMENSIONS.map((维度) => ({ 维度, 状态: ["正常主流程", "输入边界", "异常/失败", "可观察结果"].includes(维度) ? "已覆盖" : "不适用", 原因: "测试证据已完成判断" })),
    场景分支: [success, failure].map((原子规则, index) => ({ 分支标识: `BR-AUDIT-PASSWORD-B0${index + 1}`, 变化维度: index ? ["正常主流程", "输入边界", "可观察结果"] : ["输入边界", "异常/失败", "可观察结果"], 有效条件: 原子规则.必要条件, 拆分原因: "密码长度改变提交结果", 原子规则 })),
  };
  parent.设计复核 = { 状态: "通过", 说明: "父规则已复核", 设计SHA256: ruleDesignHash(parent) };
  assert.deepEqual(validateCoverageExpansion(parent, language), []);
  const cases = casesFromRule(parent, 1, "GAPP");
  assert.equal(cases.length, 2);
  assert.ok(cases.every((item) => item.备注.includes("规则：BR-AUDIT-PASSWORD")));
  assert.notEqual(cases[0].备注.find((item) => item.startsWith("分支：")), cases[1].备注.find((item) => item.startsWith("分支：")));
});
