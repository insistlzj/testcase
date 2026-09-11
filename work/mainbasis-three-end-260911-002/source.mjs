import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from '../mainbasis-three-end-260911-001/prepare.mjs';

export const root = path.resolve(import.meta.dirname, '../..');
export const task = import.meta.dirname;
export const hash = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
export const save = async (name, value) => fs.writeFile(path.join(task, name), JSON.stringify(value, null, 2) + '\n');
export const read = async name => JSON.parse(await fs.readFile(path.join(task, name), 'utf8'));
export const baseline = await parse();
if (process.argv[2] === 'scan') {
  const inventory = [];
  for (const name of await fs.readdir(path.join(root, 'MainBasis'))) {
    const p = path.join(root, 'MainBasis', name), stat = await fs.stat(p);
    if (stat.isFile()) inventory.push({ 路径: `MainBasis/${name}`, 字节数: stat.size, 修改时间: stat.mtime.toISOString(), SHA256: hash(await fs.readFile(p)), 角色: '当前业务证据' });
  }
  await save('source-baseline.json', baseline);
  await save('generation-input-manifest.json', { schemaVersion: 'mainbasis-2', 项目名称: 'Luma Live', 项目目录: 'MainBasis', 来源策略: 'requirement-primary', 用户确认: '以 MainBasis 为主要依据，交付三端完整测试用例', 输入文件: inventory, 历史读取: [], 开始时间: new Date().toISOString() });
  await save('business-rule-catalog.json', { 证据哈希: baseline.sourceHashes, 规则: baseline.entries.map(e => ({ 稳定规则标识: `BR-${hash([e.id,e.text]).slice(0,14)}`, ...e })) });
  await save('pipeline-metrics.json', { 开始时间: new Date().toISOString(), 阶段: [{ 阶段: 'inventory-hash', 结束时间: new Date().toISOString(), 输入数量: inventory.length, 输出数量: baseline.entries.length, 复用数量: 0 }] });
  console.log({ 条目: baseline.entries.length, 页面视图: Object.keys(baseline.pages).length, 风险主题: baseline.questions.length, 哈希: baseline.sourceHashes });
} else if (process.argv[2] === 'show') {
  const subset = baseline.entries.filter(e => e.module.startsWith(process.argv[3]));
  const from = Number(process.argv[4] || 0), to = Number(process.argv[5] || subset.length);
  let page = '', section = '';
  for (const e of subset.slice(from, to)) {
    if (e.page !== page) { page = e.page; console.log(`\n${page} ${baseline.pages[page]?.name} ${e.end}`); }
    if (e.section !== section) { section = e.section; console.log(`[${section}]`); }
    console.log(`${e.id} ${e.status === '基准规则' ? '' : '[' + e.status + '] '}${e.text} ${e.questions.join(',')}`);
  }
}
