#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { validateTestcaseDelivery } from "./validate-testcase-delivery.mjs";
import { validateMetrics } from './pipeline-metrics.mjs';

const repoRoot = path.resolve(process.argv[2] || process.cwd());
const taskDir = path.resolve(process.argv[3] || "");
const workbookPath = path.resolve(process.argv[4] || "");
if (!process.argv[3] || !process.argv[4]) throw new Error("用法：node scripts/publish-evidence-cache.mjs <仓库根目录> <任务目录> <工作簿>");

const cacheDir = path.join(repoRoot, "work/liveshow-proto-global-evidence-cache");
const hashFile = async (file) => crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");
const writeJson = async (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const manifestFile = path.join(taskDir, "generation-input-manifest.json");
await validateTestcaseDelivery(taskDir, repoRoot, { workbook: workbookPath });
const inputPolicy = JSON.parse(await fs.readFile(manifestFile, 'utf8'));
if (inputPolicy.历史策略 === '不读取不比较') {
  process.stdout.write('全新生成模式不发布用例历史缓存。\n');
  process.exit(0);
}
const [scan, verification, comparison, metrics, manifest] = await Promise.all([
  fs.readFile(path.join(taskDir, "global-evidence-scan-result.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(taskDir, "delivery-verification.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(taskDir, "historical-case-comparison.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(taskDir, "pipeline-metrics.json"), "utf8").then(JSON.parse),
  fs.readFile(manifestFile, "utf8").then(JSON.parse),
]);

if (scan.输出前复核?.状态 !== "通过") throw new Error("输出前证据复核未通过，禁止发布缓存");
if (verification.状态 !== "通过") throw new Error("Excel 交付检查未通过，禁止发布缓存");
if ((comparison.待人工复核 || []).length) throw new Error("历史比较仍有待人工复核，禁止发布缓存");
validateMetrics(metrics);

const candidatePath = path.join(repoRoot, manifest.当前候选用例);
const finalPath = path.join(repoRoot, manifest.最终用例JSON);
if (await hashFile(candidatePath) !== await hashFile(finalPath)) throw new Error("候选与最终 JSON 哈希不一致");

const layerFiles = {
  "evidence-atoms": ["evidence-atom-index.json"],
  "normalized-rules": ["business-rule-catalog.json"],
  "cases-history": ["semantic-dedup-review.json", "historical-case-comparison.json", "quality-context.json"],
};
await fs.mkdir(path.join(cacheDir, "layers/inventory"), { recursive: true });
await writeJson(path.join(cacheDir, "layers/inventory/latest.json"), {
  schemaVersion: "1.0",
  项目指纹: scan.项目指纹,
  文件清单: scan.文件清单,
});
for (const [layer, files] of Object.entries(layerFiles)) {
  const directory = path.join(cacheDir, "layers", layer);
  await fs.mkdir(directory, { recursive: true });
  for (const file of files) await fs.copyFile(path.join(taskDir, file), path.join(directory, file));
}
await fs.mkdir(path.join(cacheDir, "layers/workbook"), { recursive: true });
await writeJson(path.join(cacheDir, "layers/normalized-rules/dependency-index.json"), {
  schemaVersion: "1.0",
  细粒度依赖索引: scan.细粒度依赖索引,
});
await writeJson(path.join(cacheDir, "layers/workbook/latest.json"), {
  schemaVersion: "1.0",
  路径: path.relative(repoRoot, workbookPath).split(path.sep).join("/"),
  "SHA-256": await hashFile(workbookPath),
});

const layerIndex = [];
for (const layer of ["inventory", "evidence-atoms", "normalized-rules", "cases-history", "workbook"]) {
  const directory = path.join(cacheDir, "layers", layer);
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const file = path.join(directory, entry.name);
    files.push({ 路径: path.relative(cacheDir, file).split(path.sep).join("/"), "SHA-256": await hashFile(file) });
  }
  layerIndex.push({ 层: layer, Schema: "1.0", 文件: files });
}
const latest = {
  schemaVersion: "1.5",
  状态: scan.扫描状态,
  项目名称: scan.项目名称,
  项目目录: scan.项目目录,
  项目指纹: scan.项目指纹,
  规则基线: scan.规则基线,
  来源任务: path.relative(repoRoot, taskDir).split(path.sep).join("/"),
  缓存层: layerIndex,
  发布时间: new Date().toISOString(),
};
const temporary = path.join(cacheDir, "latest.json.tmp");
await writeJson(temporary, latest);
await fs.rename(temporary, path.join(cacheDir, "latest.json"));

const publication = { 状态: "成功", 缓存目录: path.relative(repoRoot, cacheDir).split(path.sep).join("/"), 层数: layerIndex.length, 发布时间: latest.发布时间 };
await writeJson(path.join(taskDir, "cache-publication-result.json"), publication);
process.stdout.write(`${JSON.stringify(publication, null, 2)}\n`);
