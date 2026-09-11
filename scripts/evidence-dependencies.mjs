import fs from "node:fs/promises";
import path from "node:path";

const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".svg", ".ts", ".tsx", ".jsx", ".vue"]);
const referencePatterns = [
  /\b(?:src|href)\s*=\s*["']([^"']+)["']/giu,
  /\b(?:import\s*(?:\([^)]*?\)|[^;]*?\sfrom\s*)|export\s+[^;]*?\sfrom\s*)["']([^"']+)["']/giu,
  /\b(?:location\.href\s*=|new\s+URL\s*\()[\s`"']+([^`"')]+)[`"']/giu,
  /\burl\(\s*["']?([^"')]+)["']?\s*\)/giu,
];

const normalize = (value) => value.split(path.sep).join("/");

async function isFile(file) {
  try { return (await fs.stat(file)).isFile(); } catch { return false; }
}

function referencesIn(text) {
  const references = new Map();
  for (const [index, pattern] of referencePatterns.entries()) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      if (/[${}()\s]/u.test(match[1])) continue;
      references.set(`${index}:${match[1]}`, { raw: match[1], navigation: index === 2 });
    }
  }
  return [...references.values()];
}

export async function expandEvidenceDependencies(projectDirectory, seedFiles) {
  const project = path.resolve(projectDirectory);
  const queue = seedFiles.map((file) => ({ file: path.resolve(file), document: null }));
  const visited = new Set();
  const contexts = new Set();
  const edges = [];
  const excluded = [];
  while (queue.length) {
    const item = queue.shift();
    const current = item.file;
    const document = current.endsWith('.html') ? current : item.document;
    const contextKey = `${current}|${document || ''}`;
    if (contexts.has(contextKey)) continue;
    contexts.add(contextKey);
    if (!(current === project || current.startsWith(`${project}${path.sep}`)) || !(await isFile(current))) continue;
    if (!textExtensions.has(path.extname(current).toLowerCase())) continue;
    visited.add(current);
    const source = await fs.readFile(current, "utf8");
    for (const { raw, navigation } of referencesIn(source)) {
      const cleaned = raw.split("#")[0].split("?")[0].trim();
      if (!cleaned || /^(?:data:|https?:|javascript:|mailto:|#)/iu.test(cleaned)) continue;
      const target = path.resolve(path.dirname(navigation && document ? document : current), cleaned);
      if (!(target === project || target.startsWith(`${project}${path.sep}`))) {
        excluded.push({ 来源: normalize(path.relative(project, current)), 引用: raw, 原因: "引用位于项目目录外" });
        continue;
      }
      if (!(await isFile(target))) {
        excluded.push({ 来源: normalize(path.relative(project, current)), 引用: raw, 原因: "引用不是当前项目内的可读文件" });
        continue;
      }
      edges.push({ 来源: normalize(path.relative(project, current)), 目标: normalize(path.relative(project, target)), ...(navigation && document ? { 页面上下文: normalize(path.relative(project, document)) } : {}) });
      queue.push({ file: target, document });
    }
  }
  return {
    入口文件: seedFiles.map((file) => normalize(path.relative(project, file))),
    语义文件: [...visited].map((file) => normalize(path.relative(project, file))).sort((a, b) => a.localeCompare(b, "zh-CN")),
    依赖关系: edges,
    排除引用: excluded,
  };
}
