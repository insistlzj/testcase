import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { hash, readAnnotations } from './evidence-discovery.mjs';
import { expandEvidenceDependencies } from './evidence-dependencies.mjs';

const project = 'liveshow-proto';

const CONFIG = {
  用户App: {
    annotation: 'user', prefix: 'user/', role: '用户', requirement: 'context/01-用户主播App-项目需求清单.md',
    modules: { auth: '账号与登录', home: '首页与发现', live: '直播模块', social: '消息与社交', profile: '个人中心', 'fan-club': '粉丝团', guild: '公会', host: '主播中心', wallet: '钱包与充值' },
  },
  公会App: {
    annotation: 'guild', prefix: 'guild/', role: '公会长', requirement: 'context/02-公会App-项目需求清单.md',
    modules: { auth: '公会账号', home: '公会首页', approval: '审批管理', people: '主播管理', operations: '运营管理', management: '公会管理', data: '数据与收益' },
  },
  管理后台: {
    annotation: 'admin', prefix: 'admin/', role: '平台管理员', requirement: 'context/03-管理后台-项目需求清单.md',
    modules: { dashboard: '数据报表', user: '用户管理', host: '主播管理', guild: '公会管理', live: '直播管理', content: '内容审核', gifts: '礼物与道具', operations: '运营配置', accounts: '运营账号', orders: '财务结算', finance: '财务结算', analytics: '数据报表', system: '系统配置' },
  },
};

const stripTags = text => text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, '').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ').trim();

function literal(source, variable) {
  const start = source.indexOf(`const ${variable} = `);
  if (start < 0) return {};
  const end = source.indexOf(';\n', start);
  return vm.runInNewContext(`(${source.slice(source.indexOf('{', start), end)})`, {}, { timeout: 1500 });
}

function roleFor(endName, key, file) {
  if (endName !== '用户App') return CONFIG[endName].role;
  if (/profile-moderator/u.test(key)) return '房管';
  if (/\/host\/|live-room-host|live-end-host|moderator-management|visible-fan/u.test(`${file} ${key}`)) return '主播';
  if (/live-room|live-end-viewer/u.test(`${file} ${key}`)) return '观众';
  return '用户';
}

function routePattern(text, endName) {
  const routes = [
    [/运营账号|虚拟金币/u, /operation-account|operation-guild|operation-issue|operation-gift/u],
    [/分成|结算|收益|账户余额|对账/u, /income|share|settlement|balance|reconciliation/u],
    [/礼物|道具|RTP|返奖/u, /gift|prop/u],
    [/举报|违规|内容审核|告警/u, /report|violation|audit/u],
    [/直播|开播|连麦|房间/u, /live|host-center|start-live/u],
    [/公会|入会|退会/u, endName === '公会App' ? /join|leave|member|host|guild/u : /guild/u],
    [/登录|账号状态/u, /login|account/u],
    [/用户|资料|社交|好友|粉丝/u, /user|profile|friend|follower|fan/u],
    [/充值|金币|消费|退款/u, /recharge|wallet|order|finance/u],
    [/榜单|统计|报表|数据/u, /ranking|analytics|statistics|data/u],
    [/权限|角色|系统参数/u, /permission|role|system/u],
  ];
  return routes.find(([expression]) => expression.test(text))?.[1];
}

function documentFromMarkdown(file, text, pages, endName, priority, kind) {
  const entries = [];
  let section = '';
  const physical = Object.entries(pages).filter(([, page]) => !page.virtual);
  for (const [index, line] of text.split('\n').entries()) {
    if (/^#{2,6}\s/u.test(line)) { section = line.replace(/^#+\s*/u, ''); continue; }
    if (!line.trim() || /^\s*>|^\s*```/u.test(line)) continue;
    const pattern = routePattern(`${section} ${line}`, endName);
    if (!pattern) continue;
    const match = physical.find(([key, page]) => pattern.test(`${key} ${page.file} ${page.name}`));
    if (!match) continue;
    entries.push({ page: match[0], section, text: line, position: `第${index + 1}行 / ${section}` });
  }
  return { path: file, sha256: hash(text), priority, kind, entries };
}

export async function collectScopeEvidence(root, endName) {
  const config = CONFIG[endName];
  if (!config) throw new Error(`不支持的端：${endName}`);
  const inventory = [];
  async function walk(directory) {
    for (const item of await fs.readdir(path.join(root, directory), { withFileTypes: true })) {
      if (['.git', '.DS_Store'].includes(item.name)) continue;
      const relative = `${directory}/${item.name}`;
      if (item.isDirectory()) await walk(relative);
      else if (item.isFile()) {
        const data = await fs.readFile(path.join(root, relative));
        const stat = await fs.stat(path.join(root, relative));
        inventory.push({ 路径: relative, 大小: data.length, 修改时间: stat.mtime.toISOString(), SHA256: hash(data) });
      }
    }
  }
  await walk(project);
  inventory.sort((a, b) => a.路径.localeCompare(b.路径, 'zh-CN'));

  const indexPath = `${project}/prototype/index.html`;
  const annotationPath = `${project}/prototype/annotations/${config.annotation}.js`;
  const summaryPath = `${project}/context/系统概要 .md`;
  const requirementPath = `${project}/${config.requirement}`;
  const [indexText, annotationText, summaryText, requirementText] = await Promise.all([
    fs.readFile(path.join(root, indexPath), 'utf8'), fs.readFile(path.join(root, annotationPath), 'utf8'),
    fs.readFile(path.join(root, summaryPath), 'utf8'), fs.readFile(path.join(root, requirementPath), 'utf8'),
  ]);
  const pagePaths = literal(indexText, 'pagePaths');
  const viewGroups = ['liveReviewViews', 'guildReviewViews', 'staticPageViews'].map(name => literal(indexText, name));
  const viewByKey = new Map();
  function register(items, parent) {
    for (const view of items || []) {
      if (view.file) viewByKey.set(view.file, { ...view, parent });
      if (view.children) register(view.children, parent);
    }
  }
  for (const groups of viewGroups) for (const [parent, items] of Object.entries(groups)) register(items, parent);

  const annotations = readAnnotations(annotationText);
  const pages = {};
  for (const key of Object.keys(annotations)) {
    if (key === '*') continue;
    const view = viewByKey.get(key);
    const parent = view?.parent || key;
    const relative = pagePaths[parent];
    if (!relative?.startsWith(config.prefix)) continue;
    const file = `${project}/prototype/pages/${relative}`;
    const html = await fs.readFile(path.join(root, file), 'utf8');
    const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/iu)?.[1] || parent).replace(/\s*[|·-].*$/u, '').replace(/^视图-/u, '');
    const name = view?.title?.replace(/^视图-/u, '') || title;
    const moduleKey = relative.split('/')[1];
    pages[key] = {
      name, object: name, role: roleFor(endName, key, relative), endName, module: config.modules[moduleKey] || moduleKey,
      file, parent, selectors: view?.selectors || [], state: view?.state || null,
      steps: [key.startsWith('views/') ? `打开${name}` : `进入${name}`],
      preconditions: [`${roleFor(endName, key, relative)}账号已登录且具备当前页面权限`],
    };
  }
  if (!Object.keys(pages).length) throw new Error(`${endName}没有可映射的批注页面`);

  const contexts = inventory.filter(item => item.路径.includes('/context/') && item.路径.endsWith('.md')).map(item => item.路径);
  const annotationFiles = ['user', 'guild', 'admin'].map(name => `${project}/prototype/annotations/${name}.js`);
  const seedPaths = [...new Set([indexPath, annotationPath, summaryPath, requirementPath, `${project}/项目说明.md`, `${project}/需求来源策略.json`,
    ...contexts, ...annotationFiles, `${project}/prototype/assets/mock.js`, `${project}/prototype/assets/admin-mock.js`, ...Object.values(pages).map(page => page.file)])]
    .filter(file => inventory.some(item => item.路径 === file));
  const dependencies = await expandEvidenceDependencies(path.join(root, project), seedPaths.map(file => path.join(root, file)));
  const readPaths = [...new Set([...seedPaths, ...dependencies.语义文件.map(file => `${project}/${file}`)])];
  const texts = new Map(await Promise.all(readPaths.map(async file => [file, await fs.readFile(path.join(root, file), 'utf8')])));

  const annotationDocument = { path: annotationPath, sha256: hash(annotationText), priority: 2, kind: 'annotation', entries: [] };
  for (const [key, value] of Object.entries(annotations)) {
    if (!pages[key]) continue;
    for (const [sectionIndex, section] of (value.sections || []).entries()) {
      for (const [rowIndex, text] of (section.d || []).entries()) annotationDocument.entries.push({
        page: key, section: section.t, text, position: `${key} / ${section.t} / ${sectionIndex + 1}.${rowIndex + 1}`,
      });
    }
  }
  const documents = [
    documentFromMarkdown(summaryPath, summaryText, pages, endName, 1, 'requirement'),
    annotationDocument,
    documentFromMarkdown(requirementPath, requirementText, pages, endName, 3, 'derived-requirement'),
  ].filter(document => document.entries.length);

  const elements = [];
  const htmlFiles = Object.fromEntries([...new Set(Object.values(pages).map(page => page.file))].map(file => [file, texts.get(file)]));
  const parsed = spawnSync('python3', [path.join(import.meta.dirname, 'parse-prototype-html.py')], {
    input: JSON.stringify(htmlFiles), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  if (parsed.status !== 0) throw new Error(`HTML解析失败：${parsed.stderr}`);
  for (const [file, controls] of Object.entries(JSON.parse(parsed.stdout))) {
    const pageKeys = Object.keys(pages).filter(key => pages[key].file === file);
    for (const control of controls) {
      const locator = control.attrs.id && !control.attrs.id.includes('${') ? `#${control.attrs.id}`
        : Object.entries(control.attrs).filter(([key]) => /^(?:data-|name$|aria-label$)/u.test(key)).map(([key, value]) => `[${key}${value ? `="${value}"` : ''}]`).join('') || `${control.tag}:source-${control.index}`;
      elements.push({ 元素标识: `EL-${hash([file, control.origin, control.line, control.index]).slice(0, 12)}`, 页面: pages[pageKeys[0]]?.parent,
        关联视图: pageKeys, 文件: file, 行号: control.line, 类型: control.tag, 名称: control.name, 定位: locator,
        属性: control.attrs, 容器: control.ancestors, 来源形态: control.origin, 初始禁用: Object.hasOwn(control.attrs, 'disabled'), 原文: control.raw });
    }
  }
  return { inventory, documents, pages, dependencies, texts, implementation: [], elements, endName };
}

export const supportedScopeEnds = () => Object.keys(CONFIG);
