import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'archive/Luma-Live/260914-001');
const targets = [
  'work/indonesia-live-spec-260911-001',
  'work/liveshow-proto-global-evidence-cache',
  'work/liveshow-three-end-all-260911-001',
  'work/liveshow-user-live-discovery-260910-005',
  'work/liveshow-user-live-discovery-260910-006',
  'work/liveshow-user-live-profile-260910-003',
  'work/liveshow-user-live-profile-260910-004',
  'work/mainbasis-three-end-260911-001',
  'work/mainbasis-three-end-260911-002',
  'outputs/Luma Live-case',
  'liveshow-proto/MainBasis',
];
async function inventory(directory) {
  const files = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) files.push({ 路径: path.relative(directory, file), 链接目标: await fs.readlink(file) });
      else if (entry.isDirectory()) await walk(file);
      else { const data = await fs.readFile(file); files.push({ 路径: path.relative(directory, file), 字节: data.length, SHA256: crypto.createHash('sha256').update(data).digest('hex') }); }
    }
  }
  await walk(directory);
  return files.sort((a, b) => a.路径.localeCompare(b.路径));
}
await fs.mkdir(destination, { recursive: false });
const records = [];
for (const target of targets) {
  const original = path.join(root, target);
  const archived = path.join(destination, target);
  const before = await inventory(original);
  await fs.mkdir(path.dirname(archived), { recursive: true });
  await fs.rename(original, archived);
  if (JSON.stringify(before) !== JSON.stringify(await inventory(archived))) throw new Error(`归档校验失败：${target}`);
  records.push({ 原路径: target, 归档路径: path.relative(root, archived), 文件数: before.length, 文件: before, 状态: '已归档并核对一致' });
  await fs.writeFile(path.join(destination, 'archive-manifest.json'), JSON.stringify({ 时间: new Date().toISOString(), 用途: '只读归档，禁止作为后续生成输入', 归档: records }, null, 2) + '\n');
}
console.log(JSON.stringify({ 归档目录: destination, 目录数: records.length, 文件数: records.reduce((n, row) => n + row.文件数, 0), 保留: ['原始项目资料', 'work/liveshow-proto-project-onboarding', 'scripts/build-testcase-workbook.mjs', '其他项目输出'] }, null, 2));
