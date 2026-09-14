import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { collectScopeEvidence } from '../../scripts/liveshow-scope-evidence.mjs';
import { readAnnotations, hash } from '../../scripts/evidence-discovery.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const task = import.meta.dirname;
const save = (file, value) => fs.writeFile(path.join(task, file), JSON.stringify(value, null, 2) + '\n');
const sources = [];
const publicFile = 'liveshow-proto/prototype/assets/annotations.js';
const publicBox = { window: {} };
vm.runInNewContext(await fs.readFile(path.join(root, publicFile), 'utf8'), publicBox, { timeout: 1500 });
for (const [end, name] of [['用户App', 'user'], ['公会App', 'guild'], ['管理后台', 'admin']]) {
  const source = await collectScopeEvidence(root, end);
  const annotationFile = `liveshow-proto/prototype/annotations/${name}.js`;
  const annotations = readAnnotations(await fs.readFile(path.join(root, annotationFile), 'utf8'));
  const rows = [];
  for (const [page, data] of Object.entries(annotations)) for (const [si, section] of (data.sections || []).entries()) for (const [ri, raw] of (section.d || []).entries()) {
    if (/^\|\s*[-:]+\s*\|/.test(raw)) continue;
    rows.push({ id: `REQ-${name.toUpperCase()}-${hash([page, section.t, raw]).slice(0, 10)}`, end, page, section: section.t, raw, source: annotationFile, position: `${page} / ${section.t} / ${si + 1}.${ri + 1}`, pageInfo: source.pages[page] || null });
  }
  for (const [page, items] of Object.entries(publicBox.window.LUMA_ANNOTATIONS)) {
    if (!source.pages[page]) continue;
    for (const [i, [section, raw]] of items.entries()) rows.push({ id: `REQ-PUB-${hash([page, section, raw]).slice(0, 10)}`, end, page, section, raw, source: publicFile, position: `${page} / ${section} / ${i + 1}`, pageInfo: source.pages[page] });
  }
  await save(`${name}-upstream.json`, { rows, pages: source.pages, elements: source.elements, dependencies: source.dependencies, inventory: source.inventory });
  sources.push({ end, rows: rows.length, pages: Object.keys(source.pages).length, elements: source.elements.length });
}
console.log(JSON.stringify(sources, null, 2));
