import fs from 'node:fs/promises';
import path from 'node:path';
import { hash } from '../../scripts/evidence-discovery.mjs';

export const root = path.resolve(import.meta.dirname, '../..');
export const task = import.meta.dirname;
export const formal = 'MainBasis/统一需求文档.md';
export const risks = 'MainBasis/需求待确认清单.md';
export const save = async (name, data) => fs.writeFile(path.join(task, name), JSON.stringify(data, null, 2) + '\n');
export async function parse() {
  const text = await fs.readFile(path.join(root, formal), 'utf8');
  const entries = [], pages = {};
  let module = '系统概要', page = '', section = '', title = '', end = '', part = 0, parent = '';
  for (const [i, line] of text.split('\n').entries()) {
    if (/^## [3-8]\./u.test(line)) part = Number(line[3]);
    if (/^### M\d+/u.test(line)) module = line.slice(4);
    if (/^### 系统概要/u.test(line)) section = line.slice(4);
    if (/^#### /u.test(line)) { title = line.slice(5).replace(/（(?:用户\/主播 App|公会 App|管理后台)）$/u, ''); end = line.includes('用户/主播 App') ? '用户App' : line.includes('公会 App') ? '公会App' : '管理后台'; }
    const pageLink = line.match(/^页面：\[([^\]]+)\]/u);
    if (pageLink) { page = pageLink[1]; parent = page; pages[page] = { name: title, end, module, parent, line: i + 1 }; }
    if (/^##### /u.test(line)) { title = line.slice(6).replace(/（同页视图）/u, '').replace(/^视图-/u, ''); }
    if (/^\*\*.+\*\*$/u.test(line)) section = line.replaceAll('**', '');
    const m = line.match(/^- ((?:D-SYS|U|G|A)-[^〔]+)〔([^〕]+)〕 (.+)$/u);
    if (!m || part > 4) continue;
    const [, id, status, content] = m;
    if (id.includes('-views_')) { const key = id.replace(/^[UGA]-/u, '').replace(/-\d+$/u, ''); page = key; pages[page] ||= { name: title, end, module, parent, line: i + 1 }; }
    const body = content.replace(/（\[来源\]\([\s\S]*$/u, '').trim().replace(/[。]+$/u, '');
    entries.push({ id, status, text: body, raw: line, line: i + 1, module: id.startsWith('D-SYS') ? '系统概要' : module,
      page: id.startsWith('D-SYS') ? '' : page, section, end: id.startsWith('D-SYS') ? '' : end,
      questions: [...new Set([...content.matchAll(/\[Q(\d{3})\]/gu)].map(x => 'Q' + x[1]))] });
  }
  const riskText = await fs.readFile(path.join(root, risks), 'utf8');
  const questions = [...riskText.matchAll(/^### (Q\d{3}) ([^\n]+)\n([\s\S]*?)(?=^### Q\d{3}|^## |$(?![\s\S]))/gm)].map(m => ({
    id: m[1], title: m[2], body: m[3], decision: m[3].match(/^需要决定：(.+)$/mu)?.[1], impact: m[3].match(/^影响：(.+)$/mu)?.[1],
    priority: m[3].match(/优先级：(P\d)/u)?.[1], refs: [...new Set([...m[3].matchAll(/\[((?:D-SYS|U|G|A)-[^\]]+)\]/gu)].map(x => x[1]))],
  }));
  return { entries, pages, questions, sourceHashes: { [formal]: hash(text), [risks]: hash(riskText) } };
}
if (process.argv[1] === path.join(task, 'prepare.mjs')) {
  const baseline = await parse();
  await save('source-baseline.json', baseline);
  await save('source-policy-override.json', { 项目名称: 'Luma Live', 稳定项目身份: '既有三端直播项目', 来源策略: 'requirement-primary',
    用户原话: '现在我需要主要以MainBasis文件夹中的文件内容为基准，去生成3端的测试用例',
    主来源: formal, 风险来源: risks, 范围: ['用户App', '公会App', '管理后台'],
    来源根说明: '用户明确指定既有 Luma Live 项目的 MainBasis 为本次业务来源根，不是新增产品或跨项目拼接',
    历史输入: [], 原型用途: '只核对入口，不覆盖 MainBasis 业务规则', 时间: new Date().toISOString() });
  console.log(JSON.stringify({ entries: baseline.entries.length, pages: Object.keys(baseline.pages).length, questions: baseline.questions.length,
    statuses: Object.fromEntries([...new Set(baseline.entries.map(x => x.status))].map(s => [s, baseline.entries.filter(x => x.status === s).length])) }, null, 2));
}
