import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import test from 'node:test';
import { startMainBasis, sealMainBasis, verifyMainBasis, validateMainBasisInput, prepareContext, reviewContext, prepareBasis } from './mainbasis.mjs';
import { reviewHash } from './requirement-traceability.mjs';
import { validateGenerationInput } from './validate-generation-input.mjs';
import { validateTestcaseDelivery } from './validate-testcase-delivery.mjs';

test('MainBasis 同步发布、版本漂移及共用入口隔离', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mainbasis-check-'));
  const hash = data => crypto.createHash('sha256').update(data).digest('hex');
  const save = async (file, data) => { await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true }); await fs.writeFile(path.join(root, file), data); };
  const json = async (file, data) => save(file, JSON.stringify(data));
  const read = async file => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
  try {
    for (const file of ['AGENTS.md', 'Cem Kaner.txt', '全局证据扫描指令.md', '原型与需求清单同步指令.md', '流程追溯文件说明.md', 'scripts/mainbasis.mjs', 'scripts/requirement-traceability.mjs']) await save(file, 'workflow-v1');
    await json('project/需求来源策略.json', { 来源策略: 'prototype-primary', 生成前同步: true, 用例生成模式: '全新生成', 历史比较: false, 派生需求清单: ['context/用户.md'], MainBasis: { 生成前更新: true, 正式需求: 'MainBasis/统一需求文档.md', 风险清单: 'MainBasis/需求待确认清单.md' } });
    await save('project/context/概要.md', '账号启用后可登录');
    await save('project/context/用户.md', '账号启用后可登录');
    await save('project/MainBasis/统一需求文档.md', '账号启用后可登录');
    await save('project/MainBasis/需求待确认清单.md', 'Q001 重试时限待确认');
    await assert.rejects(verifyMainBasis(root, 'project'), /缺少同步基线/);
    await startMainBasis(root, 'project', 'work/task');
    await assert.rejects(startMainBasis(root, 'project', 'work/task'), /EEXIST/);
    const start = await read('work/task/mainbasis-start.json');
    await assert.rejects(sealMainBasis(root, 'project', 'work/task'), /ENOENT/);
    const sync = {
      同步状态: '有非阻塞待确认', 阻塞异常: [],
      文件核对: [...start.上游.filter(file => file.路径 === 'project/context/用户.md'), ...start.文档].map(file => ({ 路径: file.路径, 修改前SHA256: file['SHA-256'], 修改后SHA256: file['SHA-256'], 核对说明: '当前输入与两份输出逐条核对，登录规则一致，重试边界仍保留为风险' })),
      MainBasis复核: { 业务优先级: '系统概要优先，原型和批注补充', 上游指纹: hash(JSON.stringify(start.上游)), 复核说明: '登录规则按概要保留；未定义重试时限，保持 Q001 隔离', 待确认问题: ['Q001'], 来源映射: [{ 来源路径: 'project/context/概要.md', 来源SHA256: hash('账号启用后可登录'), 来源位置: '第 1 行', 目标路径: 'project/MainBasis/统一需求文档.md', 目标原文: '账号启用后可登录' }] },
    };
    await json('work/task/prototype-context-sync-result.json', sync);
    await json('work/task/global-evidence-scan-result.json', { 扫描状态: '通过', 阻塞项: [], 文件清单: start.上游 });
    await assert.rejects(sealMainBasis(root, 'project', 'work/task'), /context-checkpoint/);
    async function completeTransfer(name, unitsFile) {
      const report = await read(`work/task/${name}`), units = await read(`work/task/${unitsFile}`);
      for (const row of report.逐项) Object.assign(row, { 去向: '已同步', 说明: '合成测试夹具的传递映射', 目标标识: units.目标.map(unit => unit.标识) });
      report.语义复核 = { 说明: '仅供自动化回归的合成记录', 内容SHA256: reviewHash(report) };
      await json(`work/task/${name}`, report);
    }
    await prepareContext(root, 'project', 'work/task');
    await assert.rejects(reviewContext(root, 'project', 'work/task'), /未完成处理/);
    await completeTransfer('context-transfer.json', 'context-units.json');
    await reviewContext(root, 'project', 'work/task');
    await prepareBasis(root, 'project', 'work/task');
    await completeTransfer('mainbasis-transfer.json', 'mainbasis-units.json');
    await sealMainBasis(root, 'project', 'work/task');
    const valid = await verifyMainBasis(root, 'project');
    const manifest = { 项目目录: 'project', 历史策略: '不读取不比较', MainBasis基线: { 路径: valid.config.baseline, 'SHA-256': valid.基线SHA256 }, 输入文件: valid.baseline.文档.map((file, index) => ({ ...file, 角色: index ? '风险与缺口' : '当前业务证据', 允许定义业务规则: !index })) };
    await validateMainBasisInput(root, manifest);
    await assert.rejects(validateMainBasisInput(root, { ...manifest, 历史用例比较结果: 'work/old.json' }), /不得指定历史比较/);
    await assert.rejects(validateMainBasisInput(root, { ...manifest, 输入文件: [...manifest.输入文件, { 路径: 'archive/old.json', 角色: '执行工具' }] }), /禁止历史或归档/);
    await json('work/task/generation-input-manifest.json', { ...manifest, schemaVersion: '1.0', 任务工作目录: 'work/task/user', 输入文件: [...manifest.输入文件, { 路径: 'work/previous/design.mjs', 角色: '执行工具' }] });
    await assert.rejects(validateGenerationInput(path.join(root, 'work/task/generation-input-manifest.json'), root, 'pre-generate'), /不得读取旧任务脚本/);
    await save('project/context/概要.md', '账号启用后仍不可登录');
    await assert.rejects(validateMainBasisInput(root, manifest), /上游文件/);
    await save('project/context/概要.md', '账号启用后可登录');
    await save('project/prototype/new.html', '<p>新入口</p>');
    await assert.rejects(verifyMainBasis(root, 'project'), /上游文件/);
    await fs.unlink(path.join(root, 'project/prototype/new.html'));
    await fs.rename(path.join(root, 'project/context/概要.md'), path.join(root, 'project/context/概要-new.md'));
    await assert.rejects(verifyMainBasis(root, 'project'), /上游文件/);
    await fs.rename(path.join(root, 'project/context/概要-new.md'), path.join(root, 'project/context/概要.md'));
    await save('project/MainBasis/需求待确认清单.md', 'Q001 已修改');
    await assert.rejects(verifyMainBasis(root, 'project'), /文档已变化/);
    await save('project/MainBasis/需求待确认清单.md', 'Q001 重试时限待确认');
    const stale = structuredClone(manifest); stale.MainBasis基线['SHA-256'] = '0'.repeat(64);
    await assert.rejects(validateMainBasisInput(root, stale), /未绑定当前/);
    const unsafe = structuredClone(manifest); unsafe.输入文件[1].角色 = '当前业务证据'; unsafe.输入文件[1].允许定义业务规则 = true;
    await assert.rejects(validateMainBasisInput(root, unsafe), /输入角色或版本/);
    const raw = structuredClone(manifest); raw.输入文件.push({ 路径: 'project/context/概要.md', 角色: '当前业务证据', 允许定义业务规则: true });
    await json('work/task/generation-input-manifest.json', { ...raw, schemaVersion: '3.1' });
    await assert.rejects(validateGenerationInput(path.join(root, 'work/task/generation-input-manifest.json'), root, 'pre-generate'), /只能是 MainBasis/);
    await assert.rejects(validateTestcaseDelivery(path.join(root, 'work/task'), root), /只能是 MainBasis/);
    await save('work/task/prototype-context-sync-result.json', '{}');
    await assert.rejects(verifyMainBasis(root, 'project'), /同步记录缺失或已变化/);
    await json('work/task/prototype-context-sync-result.json', sync);
    await startMainBasis(root, 'project', 'work/interrupted');
    await save('project/context/概要.md', '同步中途改变业务规则');
    await assert.rejects(sealMainBasis(root, 'project', 'work/interrupted'), /同步期间上游变化/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
