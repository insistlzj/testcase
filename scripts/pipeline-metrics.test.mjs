import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {startTask, finishTask, startStage, finishStage, skipStage, readMetrics, validateMetrics, summarizeMetrics, requiredStages} from './pipeline-metrics.mjs';

test('批次计时命令不会因交付检查循环导入而退出并遗留锁', async () => {
  const task = await fs.mkdtemp(path.join(os.tmpdir(), 'metrics-cli-'));
  try {
    await fs.writeFile(path.join(task, 'batch.json'), JSON.stringify({schemaVersion:'1.0', 项目目录:'project', 目标端:['用户App'], 交付要求:'允许部分交付', 端任务:[{端名:'用户App', 模块名称:'全部模块', 任务目录:'work/task/user'}]}));
    const output = execFileSync(process.execPath, ['scripts/pipeline-metrics.mjs', 'task-start', task], {encoding:'utf8', timeout:10000});
    assert.equal(JSON.parse(output).状态, '进行中');
    await assert.rejects(fs.stat(path.join(task, 'pipeline-metrics.json.lock')), {code:'ENOENT'});
  } finally { await fs.rm(task, {recursive:true, force:true}); }
});

test('返工保留全部尝试；失败、中断和缺失阶段不能冒充任务完成', async () => {
  const task = await fs.mkdtemp(path.join(os.tmpdir(), 'pipeline-metrics-'));
  try {
    await startTask(task);
    await assert.rejects(startTask(task), /不得重置/);
    await startStage(task, 'semantic-read', {输入数量:2});
    await assert.rejects(startStage(task, 'semantic-read'), /仍在进行中/);
    await assert.rejects(finishStage(task, 'semantic-read', {开始时间:'伪造时间'}), /不能覆盖时间/);
    await finishStage(task, 'semantic-read', {状态:'中断',原因:'来源解析中断'});
    await assert.rejects(finishTask(task), /阶段缺失或尚未完成/);
    await assert.rejects(startStage(task, 'semantic-read'), /返工原因/);
    await startStage(task, 'semantic-read', {原因:'修复解析后继续当前来源',输入数量:2});
    await finishStage(task, 'semantic-read', {输出数量:2});
    await assert.rejects(finishStage(task, 'semantic-read'), /已结束/);
    for (const stage of requiredStages.filter(name=>name!=='semantic-read')) {
      if (stage === 'history-compare') await skipStage(task, stage, '不适用：用户禁用');
      else { await startStage(task,stage); await finishStage(task,stage); }
    }
    const metrics = await readMetrics(task);
    assert.equal(metrics.阶段.filter(item=>item.阶段名称==='semantic-read').length,2);
    assert.equal(validateMetrics(metrics).返工次数,1);
    const summary = validateMetrics(metrics);
    assert.ok(summary.总墙钟耗时毫秒 >= 0);
    await assert.rejects(finishTask(task), /任务目录必须/);
    assert.equal((await readMetrics(task)).任务.状态,'进行中');
    assert.equal((await readMetrics(task)).任务.结束时间,undefined);
    // Closed-task behavior is independent of the business fixtures used by the batch gate.
    metrics.任务.状态 = '已结束'; metrics.任务.结束时间 = new Date().toISOString();
    await fs.writeFile(path.join(task,'pipeline-metrics.json'),JSON.stringify(metrics));
    await assert.rejects(startStage(task,'json-validate',{原因:'已交付后误重跑'}),/已结束任务/);
    await assert.rejects(finishTask(task), /禁止重置结束时间/);
    const recorded = await readMetrics(task);
    await fs.writeFile(path.join(task,'pipeline-metrics.json.lock'),'fixture');
    await assert.rejects(startTask(task), /EEXIST/);
    assert.deepEqual(await readMetrics(task),recorded);
  } finally { await fs.rm(task,{recursive:true,force:true}); }
});

test('整轮墙钟不等于阶段相加；重叠、返工与未记录时段分别统计', () => {
  const time = seconds => new Date(Date.UTC(2026,8,14,0,0,seconds)).toISOString();
  const summary = summarizeMetrics({任务:{开始时间:time(0),结束时间:time(20)},阶段:[
    {阶段名称:'语义读取',尝试:1,开始时间:time(2),结束时间:time(8),耗时毫秒:6000},
    {阶段名称:'生成',尝试:1,开始时间:time(4),结束时间:time(12),耗时毫秒:8000},
    {阶段名称:'生成',尝试:2,开始时间:time(14),结束时间:time(18),耗时毫秒:4000},
  ]});
  assert.deepEqual(summary,{耗时最长阶段:'生成',阶段累计耗时毫秒:18000,总墙钟耗时毫秒:20000,未归属耗时毫秒:6000,返工次数:1});
  assert.equal(summarizeMetrics({阶段:[]}).总墙钟耗时毫秒,null);
});
