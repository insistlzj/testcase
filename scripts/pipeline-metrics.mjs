#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const fileName = "pipeline-metrics.json";

async function readMetrics(taskDir) {
  try {
    return JSON.parse(await fs.readFile(path.join(taskDir, fileName), "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { schemaVersion: "1.0", 阶段: [], 耗时最长阶段: null };
  }
}

async function saveMetrics(taskDir, metrics) {
  const completed = metrics.阶段.filter((item) => Number.isFinite(item.耗时毫秒));
  metrics.耗时最长阶段 = completed.sort((a, b) => b.耗时毫秒 - a.耗时毫秒)[0]?.阶段名称 ?? null;
  await fs.mkdir(taskDir, { recursive: true });
  await fs.writeFile(path.join(taskDir, fileName), `${JSON.stringify(metrics, null, 2)}\n`, "utf8");
}

export async function startStage(taskDir, stageName, counts = {}) {
  const metrics = await readMetrics(taskDir);
  metrics.阶段 = metrics.阶段.filter((item) => item.阶段名称 !== stageName);
  const stage = { 阶段名称: stageName, 开始时间: new Date().toISOString(), ...counts };
  metrics.阶段.push(stage);
  await saveMetrics(taskDir, metrics);
  return stage.开始时间;
}

export async function finishStage(taskDir, stageName, counts = {}) {
  const metrics = await readMetrics(taskDir);
  const stage = metrics.阶段.find((item) => item.阶段名称 === stageName);
  if (!stage?.开始时间) throw new Error(`阶段尚未开始：${stageName}`);
  stage.结束时间 = new Date().toISOString();
  stage.耗时毫秒 = Date.parse(stage.结束时间) - Date.parse(stage.开始时间);
  Object.assign(stage, counts);
  await saveMetrics(taskDir, metrics);
  return stage;
}

function parseCounts(values) {
  return Object.fromEntries(values.map((value) => {
    const [key, raw = ""] = value.split("=");
    const numeric = Number(raw);
    return [key, raw !== "" && Number.isFinite(numeric) ? numeric : raw];
  }));
}

async function main() {
  const [command, taskDirValue, stageName, ...values] = process.argv.slice(2);
  if (!new Set(["start", "finish"]).has(command) || !taskDirValue || !stageName) {
    throw new Error("用法：node scripts/pipeline-metrics.mjs <start|finish> <任务目录> <阶段名> [字段=值 ...]");
  }
  const taskDir = path.resolve(taskDirValue);
  const result = command === "start"
    ? await startStage(taskDir, stageName, parseCounts(values))
    : await finishStage(taskDir, stageName, parseCounts(values));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
