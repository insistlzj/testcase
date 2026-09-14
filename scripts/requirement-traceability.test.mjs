import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { textUnits, seedTransfer, seedCoverage, reviewHash, validateTransfer, validateCoverage, validateCoverageInput, fingerprint } from './requirement-traceability.mjs';

const reviewed = report => { report.语义复核 = { 说明: '合成需求逐项复核', 内容SHA256: reviewHash(report) }; return report; };
test('来源漏项、无来源新增、图片未查看均不能被哈希或通过状态掩盖', () => {
  const sources = textUnits('source.md', '条件甲产生结果甲\n条件乙产生结果乙');
  const targets = textUnits('context.md', '甲规则\n乙规则');
  const report = seedTransfer(sources, targets);
  report.逐项.forEach((r, i) => Object.assign(r, { 去向: '已同步', 说明: '对应条件和结果保留', 目标标识: [targets[i].标识] }));
  assert.equal(validateTransfer(sources, targets, reviewed(report)).来源单元, 2);
  const missing = structuredClone(report); missing.逐项.pop();
  assert.throws(() => validateTransfer(sources, targets, reviewed(missing)), /全部来源/);
  const invented = structuredClone(report); invented.逐项[1].目标标识 = [targets[0].标识];
  assert.throws(() => validateTransfer(sources, targets, reviewed(invented)), /没有上游依据/);
  const visual = [{ 标识: 'image', 路径: 'prototype.png', 行: 0, 二进制: true }];
  const imageReport = seedTransfer(visual, targets);
  Object.assign(imageReport.逐项[0], { 去向: '已同步', 说明: '有业务信息', 目标标识: targets.map(t => t.标识) });
  assert.throws(() => validateTransfer(visual, targets, reviewed(imageReport)), /实际查看范围/);
  Object.assign(imageReport.逐项[0], { 查看范围: '整图及弹窗', 视觉解读: '两个不同条件分别进入甲乙状态' });
  assert.doesNotThrow(() => validateTransfer(visual, targets, reviewed(imageReport)));
});

test('覆盖入口核对场景契约、状态转换投影及真实候选', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'trace-input-'));
  const source = '允许用户提交申请', sourceFile = 'project/MainBasis/需求.md', task = 'work/new/user';
  const units = textUnits(sourceFile, source), report = seedCoverage(units);
  const contract = { 前置条件: ['用户尚未申请'], 操作步骤: ['点击提交'], 预期结果: ['生成待审核申请'] };
  const scene = { 场景标识: 'S1', 执行角色: '用户', 目标端: '用户App', 入口: '申请页', 用例契约: contract, 状态转换标识: 'T1' };
  Object.assign(report.逐项[0], { 状态: '已覆盖', 说明: '申请进入待审核', 分支: [{ ...scene, 标识: 'B1', 状态: '已设计', 说明: '提交分支', 来源片段: source, 用例编号: 'C1' }] });
  report.状态转换处理 = [{ 状态转换标识: 'T1', 状态: '已映射', 说明: '本端提交结果', 场景标识: ['S1'] }];
  report.交付性质 = '完整覆盖';
  const manifest = { 任务工作目录: task, 目标范围: { 端名: '用户App' }, 需求覆盖清单: `${task}/coverage.json`, 独立场景库: `${task}/scenes.json`, 状态转换基线: `${task}/states.json`, 当前候选用例: `${task}/candidate.json`, 输入文件: [] };
  const save = async (file, value, role = '本次派生产物') => {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true }); await fs.writeFile(path.join(root, file), text);
    manifest.输入文件 = manifest.输入文件.filter(e => e.路径 !== file);
    manifest.输入文件.push({ 路径: file, 角色: role, 'SHA-256': fingerprint(text) });
  };
  try {
    await save(sourceFile, source, '当前业务证据');
    await save(manifest.需求覆盖清单, reviewed(report));
    await save(manifest.独立场景库, { 场景: [scene] });
    await save(manifest.状态转换基线, { 状态转换: [{ 状态转换标识: 'T1', 共同业务对象: '申请', 来源状态: '未申请', 触发动作: '提交', 执行角色: '用户', 操作端: '用户App', 目标状态: '待审核', 观察端: ['用户App'] }] });
    await save(manifest.当前候选用例, { 测试用例: [{ 用例编号: 'C1', ...contract }], 需求待确认: [] });
    assert.equal((await validateCoverageInput(root, manifest, 'final')).交付性质, '完整覆盖');
    await save(manifest.独立场景库, { 场景: [{ ...scene, 入口: '另一个入口' }] });
    await assert.rejects(validateCoverageInput(root, manifest, 'pre-generate'), /独立场景/);
    await save(manifest.独立场景库, { 场景: [scene] });
    const omitted = structuredClone(report); omitted.状态转换处理 = [];
    await save(manifest.需求覆盖清单, reviewed(omitted));
    await assert.rejects(validateCoverageInput(root, manifest, 'pre-generate'), /全部来源/);
    await save(manifest.需求覆盖清单, reviewed(report));
    await save(manifest.当前候选用例, { 测试用例: [{ 用例编号: 'C1', ...contract, 预期结果: ['申请已通过'] }], 需求待确认: [] });
    await assert.rejects(validateCoverageInput(root, manifest, 'final'), /实际条件、步骤与结果/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('全部需求作为分母；不相同的状态分支、条件和断言不能互相冒充', () => {
  const units = textUnits('MainBasis/需求.md', '到期后不能新佩戴\n已佩戴装扮到期自动解除');
  const report = seedCoverage(units);
  const cases = units.map((u, i) => ({ 用例编号: `C${i}`, 前置条件: [i ? '装扮正在佩戴且随后到期' : '装扮已到期且未佩戴'], 操作步骤: [i ? '查看已佩戴装扮' : '点击佩戴'], 预期结果: [i ? '已解除佩戴' : '拒绝佩戴'] }));
  report.逐项.forEach((row, i) => Object.assign(row, { 状态: '已覆盖', 说明: '条件与结果分支已拆分', 分支: [{ 标识: `B${i}`, 状态: '已设计', 说明: units[i].原文, 来源片段: units[i].原文, 执行角色: '用户', 目标端: '用户App', 入口: '装扮页', 场景标识: `S${i}`, 用例编号: `C${i}`, 用例契约: { 前置条件: cases[i].前置条件, 操作步骤: cases[i].操作步骤, 预期结果: cases[i].预期结果 } }] }));
  report.交付性质 = '完整覆盖';
  assert.equal(validateCoverage(units, reviewed(report), { phase: 'final', cases }).交付性质, '完整覆盖');
  const missing = structuredClone(report); missing.逐项.pop();
  assert.throws(() => validateCoverage(units, reviewed(missing)), /全部来源/);
  const wrong = structuredClone(report); wrong.逐项[1].分支[0].用例编号 = 'C0';
  assert.throws(() => validateCoverage(units, reviewed(wrong), { phase: 'final', cases }), /实际条件、步骤与结果/);
  const partial = structuredClone(report); Object.assign(partial.逐项[1], { 状态: '未覆盖', 说明: '尚未设计到期状态转换', 分支: [] });
  assert.throws(() => validateCoverage(units, reviewed(partial)), /禁止声明完整/);
  partial.交付性质 = '部分覆盖';
  assert.equal(validateCoverage(units, reviewed(partial), { phase: 'final', cases: [cases[0]] }).条款处理统计.未覆盖, 1);
  const hidden = structuredClone(report); hidden.逐项[0].分支.push({ 标识: 'missing-branch', 状态: '未覆盖', 说明: '另一个分支' });
  assert.throws(() => validateCoverage(units, reviewed(hidden)), /隐藏了未覆盖分支/);
  const risk = units.map(u => ({ ...u, 风险: true })), unsafe = structuredClone(report);
  unsafe.来源指纹 = seedCoverage(risk).来源指纹;
  assert.throws(() => validateCoverage(risk, reviewed(unsafe)), /风险清单/);
  const modified = structuredClone(report); modified.逐项[0].说明 = '已改动未复核';
  assert.throws(() => validateCoverage(units, modified), /内容已变化/);
});
