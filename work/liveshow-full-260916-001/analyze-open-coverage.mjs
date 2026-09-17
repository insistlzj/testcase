import fs from 'node:fs';

const task = 'work/liveshow-full-260916-001';
for (const end of ['user', 'admin']) {
  const coverage = JSON.parse(fs.readFileSync(`${task}/${end}/requirement-coverage.json`));
  const units = JSON.parse(fs.readFileSync(`${task}/${end}/requirement-units.json`));
  const cases = JSON.parse(fs.readFileSync(`${task}/${end}/final.json`)).测试用例;
  const caseById = new Map(cases.map(item => [item.用例编号, item]));
  const unitById = new Map(units.map(unit => [unit.标识, unit]));
  const headings = units
    .filter(unit => unit.路径.endsWith('统一需求文档.md') && /^#{1,4} /.test(unit.原文))
    .sort((a, b) => a.行 - b.行);
  const groups = new Map();

  const wantedStatus = process.argv.includes('--uncovered') ? ['未覆盖'] : ['未覆盖', '部分覆盖'];
  for (const row of coverage.逐项.filter(row => wantedStatus.includes(row.状态))) {
    const unit = unitById.get(row.来源标识);
    const heading = headings.filter(item => item.行 <= unit.行).at(-1)?.原文 ?? '(无章节)';
    if (process.argv.includes('--page') && heading !== process.argv.at(-1)) continue;
    const group = groups.get(heading) ?? { 未覆盖: 0, 部分覆盖: 0, 结果数: 0, 条目: [] };
    group[row.状态] += 1;
    group.结果数 += row.结果基线?.length ?? 0;
    group.条目.push({
      规则: row.结果基线?.[0]?.标识?.replace(/-R\d+$/, '') ?? row.来源标识,
      行: unit.行,
      状态: row.状态,
      结果: row.结果基线?.map(result => result.结果说明) ?? [],
      已有用例: row.分支
        .filter(branch => branch.用例编号)
        .map(branch => `${branch.用例编号} ${caseById.get(branch.用例编号)?.用例描述 ?? ''}`),
    });
    groups.set(heading, group);
  }

  const sections = process.argv.includes('--summary')
    ? Object.fromEntries([...groups].map(([heading, group]) => [heading, { 未覆盖: group.未覆盖, 部分覆盖: group.部分覆盖, 结果数: group.结果数 }]))
    : process.argv.includes('--zero-uncovered-ids')
      ? Object.fromEntries([...groups]
        .filter(([, group]) => group.未覆盖 === 0)
        .map(([heading, group]) => [heading, group.条目.map(item => item.规则)]))
    : Object.fromEntries(groups);
  console.log(JSON.stringify({ 端: end, 章节: sections }, null, 2));
}
