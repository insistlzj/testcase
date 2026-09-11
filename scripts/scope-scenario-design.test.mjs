import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStateTransitionBaseline, discoverScopeScenarios, designScopeScenario, finalizeStateTransitionBaseline, mapScopeCoverage, projectStateTransitions, validateStateTransitionBaseline } from './scope-scenario-design.mjs';

const source = { 路径: 'liveshow-proto/prototype/annotations/admin.js', SHA256: 'a'.repeat(64), 位置: 'account.html / 字段 / 1.1', 原文: '| 账号状态 | 当前状态。 |', 页面: 'account.html' };
const pages = { 'account.html': { name: '账号详情', object: '账号详情', role: '平台管理员', module: '用户管理', file: 'liveshow-proto/prototype/pages/admin/user/account.html', steps: ['进入账号详情'], preconditions: ['平台管理员账号已登录且具备当前页面权限'] } };

test('字段证据生成单角色、单结果且可重演覆盖的用例', () => {
  const catalog = { schemaVersion: '3.1', 规则: [{ 规则标识: 'BR-FIELD', 业务对象: '账号详情', 角色: '平台管理员', 页面: ['account.html'], 字段: '账号状态', 条款: '当前状态', 上下文: '当前状态', 章节: '字段', 来源: [source], 单元: ['SRC-1'], 模型: { 类型: '业务约束' }, 建模状态: '生成待复核' }], 证据单元: [], 来源冲突处理: [] };
  const library = discoverScopeScenarios(catalog, pages);
  const scene = library.场景.find(item => item.场景类型 === '字段存在');
  const testcase = designScopeScenario(scene, pages);
  testcase.序号 = 1;
  testcase.用例编号 = 'AUSER-0001';
  assert.deepEqual(testcase.预期结果, ['账号详情显示“账号状态”']);
  assert.match(testcase.功能结构, /平台管理员视角/u);
  assert.equal(mapScopeCoverage(library.场景, [testcase]).find(item => item.场景标识 === scene.场景标识).状态, '已覆盖');
});

test('只有批注明确的动作和可观察结果才生成状态用例', () => {
  const catalog = { schemaVersion: '3.1', 规则: [{ 规则标识: 'BR-ACTION', 业务对象: '账号详情', 角色: '平台管理员', 页面: ['account.html'], 字段: '', 条款: '点击保存 -> 页面显示保存成功', 上下文: '点击保存 -> 页面显示保存成功', 章节: '交互', 来源: [source], 单元: ['SRC-2'], 模型: { 类型: '状态转换', 触发: ['点击保存'], 结果: ['页面显示保存成功'], 显式因果: true }, 建模状态: '已结构化' }], 证据单元: [], 来源冲突处理: [] };
  const library = discoverScopeScenarios(catalog, pages);
  const testcase = designScopeScenario(library.场景[0], pages);
  assert.ok(testcase.操作步骤.includes('点击保存'));
  assert.deepEqual(testcase.预期结果, ['页面显示保存成功']);
});

test('三端场景先组成业务对象状态机，再投影回各端', () => {
  const evidence = end => [{ ...source, 路径: `liveshow-proto/prototype/annotations/${end}.js` }];
  const models = [
    ['用户App', 'U-SC', '普通用户', '未申请', '提交入会申请', '待公会审核', ['用户App']],
    ['公会App', 'G-SC', '公会长', '待公会审核', '通过入会申请', '待平台终审', ['公会App']],
    ['管理后台', 'A-SC', '平台管理员', '待平台终审', '通过平台终审', '已加入公会', ['管理后台']],
  ].map(([endName, id, role, from, actionName, to, observers]) => {
    const page = `${id}.html`;
    const rule = { 规则标识: `${id}-BR`, 业务对象: `${endName}入会页`, 角色: role, 页面: [page], 来源: evidence(endName),
      生命周期: { 共同业务对象: '入会申请', 来源状态: from, 触发动作: actionName, 执行角色: role, 操作端: endName, 目标状态: to, 观察端: observers } };
    const scene = { 场景标识: id, 规则标识: [rule.规则标识], 业务对象: `${endName}入会页`, 角色: role, 页面: [page], 场景类型: '状态转换',
      条件: { 触发: actionName }, 结果: to, 参数: { trigger: actionName, effect: to }, 证据: evidence(endName), 处理状态: '未覆盖' };
    const library = { schemaVersion: '3.2', 场景: [scene], 待建模条款: [] };
    const localPages = { [page]: { endName } };
    return { endName, pages: localPages, catalog: { 规则: [rule] }, library };
  });
  const baseline = buildStateTransitionBaseline(models);
  assert.deepEqual(baseline.业务流程[0].状态转换.map(item => item.步骤序号), [1, 2, 3]);
  for (const model of models) projectStateTransitions(model.library, baseline, model.endName, true);
  finalizeStateTransitionBaseline(baseline);
  assert.equal(baseline.统计.跨端闭环数, 1);
  assert.deepEqual(validateStateTransitionBaseline(baseline, models), []);
  const forged = structuredClone(baseline);
  forged.业务流程[0].状态转换[1].来源状态 = '待其他审核';
  assert.ok(validateStateTransitionBaseline(forged, models).some(issue => issue.includes('跨端闭环声明不成立')));
  models[1].library.场景[0].流程编号 = '';
  assert.ok(validateStateTransitionBaseline(baseline, models).some(issue => issue.includes('缺少公会App场景投影')));
});
