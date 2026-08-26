import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.join(repoRoot, 'prototype');
const outputFile = path.join(repoRoot, '..', '管理后台', '管理后台原型03.html');
const pageDir = path.join(prototypeDir, 'pages');
const assetDir = path.join(prototypeDir, 'assets');
const analyticsPageFiles = [
  'admin-report-center.html',
  'admin-consumption-analysis.html',
  'admin-growth-analysis.html',
  'admin-host-operations-analysis.html',
  'admin-live-data-analysis.html',
  'admin-earnings-analysis.html',
  'admin-recharge-statistics.html',
  'admin-consumption-statistics.html',
  'admin-registration-statistics.html',
  'admin-login-activity-statistics.html',
  'admin-host-statistics.html',
  'admin-live-statistics.html',
  'admin-earnings-statistics.html',
  'admin-share-statistics.html',
  'admin-withdrawal-statistics.html',
  'admin-settlement-statistics.html'
];

const assets = new Map(
  fs.readdirSync(assetDir)
    .filter((file) => /\.(js|css)$/.test(file))
    .map((file) => [file, fs.readFileSync(path.join(assetDir, file), 'utf8')])
);

function scriptTag(source) {
  return `<script>${source.replace(/<\/script/gi, '<\\/script')}</script>`;
}

function inlinePage(file) {
  let html = fs.readFileSync(path.join(pageDir, file), 'utf8');
  html = html.replace(/<script\s+src="[^"]*assets\/([^"]+)"><\/script>/g, (_, asset) => scriptTag(assets.get(asset.split('?')[0]) || ''));
  html = html.replace(/<link\s+rel="stylesheet"\s+href="[^"]*assets\/([^"]+)">/g, (_, asset) => `<style>${assets.get(asset.split('?')[0]) || ''}</style>`);
  html = html.replaceAll('location.search', 'window.LUMA_PAGE_SEARCH');
  html = html.replaceAll('location.href', 'window.LUMA_NAVIGATION.href');
  html = html.replace('<head>', `<head><script>
window.LUMA_PAGE_FILE=${JSON.stringify(file)};
window.LUMA_PAGE_SEARCH=__LUMA_PAGE_SEARCH__;
window.LUMA_NAVIGATION={set href(value){
  const url=String(value);
  const parts=url.split('?');
  window.parent.postMessage({type:'luma-navigate',file:parts[0].split('/').pop(),query:parts[1]?'?'+parts.slice(1).join('?'):''},'*');
}};
</script>`);
  const navigationBridge = `<script>
document.addEventListener('click', function (event) {
  const link = event.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  const match = href && href.match(/(?:^|\\/)(admin-[^/?#]+\\.html)(\\?[^#]*)?/);
  if (!match) return;
  event.preventDefault();
  window.parent.postMessage({ type: 'luma-navigate', file: match[1], query: match[2] || '' }, '*');
}, true);
</script>`;
  return html.replace('</body>', `${navigationBridge}</body>`);
}

function listAdminPages(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name);
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listAdminPages(fullPath, relative);
    return /^admin-.*\.html$/.test(entry.name) ? [relative] : [];
  });
}

const pageFiles = listAdminPages(pageDir)
  .filter((file) => analyticsPageFiles.includes(path.basename(file)))
  .sort();
const pageDocs = Object.fromEntries(pageFiles.map((file) => [path.basename(file), inlinePage(file)]));
const serializedPages = JSON.stringify(pageDocs).replace(/</g, '\\u003c');

let viewer = fs.readFileSync(path.join(prototypeDir, 'index.html'), 'utf8');
viewer = viewer
  .replace('<title>Luma Live · 产品原型</title>', '<title>Luma Live · 数据分析原型</title>')
  .replace('<script src="assets/annotations.js"></script>', '<script>window.LUMA_ANNOTATIONS = {};</script>')
  .replace(/const userPages = \[[\s\S]*?\n    \];/, 'const userPages = [];')
  .replace(/const guildPages = \[[\s\S]*?\n    \];/, 'const guildPages = [];')
  .replace(
    /    const adminPages = \[([\s\S]*?)\n    \];\n    const adminPageGroups = \[[\s\S]*?\n    \];\n    adminPageGroups\.flatMap/,
    `    const allAdminPages = [$1\n    ];\n    const adminPages = allAdminPages.filter((page) => ${JSON.stringify(analyticsPageFiles)}.includes(page.file));\n    const adminPageGroups = [{\n      title: '数据分析',\n      pageFiles: ${JSON.stringify(analyticsPageFiles)},\n      allFiles: ${JSON.stringify(analyticsPageFiles)}\n    }];\n    adminPageGroups.flatMap`
  )
  .replace(
    'const pages = [...userPages, ...guildPages, ...adminPages];',
    () => `const pageDocs = ${serializedPages};\n    const pages = [...adminPages];`
  )
  .replace('let current = savedPage || userPages[0];', 'let current = savedPage || adminPages[0];')
  .replace(/    addUserTree\([^\n]+\);\n/g, '')
  .replace(/    addGuildTree\([^\n]+\);\n/g, '')
  .replaceAll('frame.src = currentUrl;', 'loadFrame(currentUrl);')
  .replace(
    '    function load(page, url = pageUrl(page), restoreControls = false) {',
    `    function loadFrame(url) {
      const file = url.slice(6).split('?')[0].split('/').pop();
      const query = url.includes('?') ? '?' + url.split('?').slice(1).join('?') : '';
      const source = pageDocs[file] || pageDocs['admin-report-center.html'];
      frame.srcdoc = source.replaceAll('__LUMA_PAGE_SEARCH__', () => JSON.stringify(query));
    }

    function load(page, url = pageUrl(page), restoreControls = false) {`
  )
  .replace(
    "    window.addEventListener('message', (event) => {\n      if (event.source !== frame.contentWindow) return;",
    `    window.addEventListener('message', (event) => {
      if (event.source !== frame.contentWindow) return;
      if (event.data && event.data.type === 'luma-navigate') {
        const page = adminPages.find((item) => item.file === event.data.file);
        if (page) load(page, pageUrl(page, event.data.query || ''));
        return;
      }
`
  );

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, viewer);
console.log(`Exported ${pageFiles.length} admin pages to ${outputFile}`);
