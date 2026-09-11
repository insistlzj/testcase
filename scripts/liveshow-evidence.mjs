import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { hash, readAnnotations } from './evidence-discovery.mjs';
import { expandEvidenceDependencies } from './evidence-dependencies.mjs';

const scopeKey = key => /^(?:live-|start-live-settings|visible-fan-select|moderator-management)|^views\/(?:live-|start-live-settings)/u.test(key);
const stripTags = text => text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, '').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ').trim();

function literal(source, variable) {
  const start = source.indexOf(`const ${variable} = `);
  if (start < 0) throw new Error(`原型索引缺少${variable}`);
  const end = source.indexOf(';\n', start);
  return vm.runInNewContext(`(${source.slice(source.indexOf('{', start), end)})`, {}, { timeout: 1500 });
}

export async function collectLiveEvidence(root) {
  const project = 'liveshow-proto';
  const inventory = [];
  async function walk(dir) {
    for (const item of await fs.readdir(path.join(root, dir), { withFileTypes: true })) {
      if (['.git', '.DS_Store'].includes(item.name)) continue;
      const relative = `${dir}/${item.name}`;
      if (item.isDirectory()) await walk(relative);
      else if (item.isFile()) { const data = await fs.readFile(path.join(root, relative)); const stat = await fs.stat(path.join(root, relative)); inventory.push({ 路径: relative, 大小: data.length, 修改时间: stat.mtime.toISOString(), SHA256: hash(data) }); }
    }
  }
  await walk(project);
  const indexPath = `${project}/prototype/index.html`, annoPath = `${project}/prototype/annotations/user.js`;
  const indexText = await fs.readFile(path.join(root, indexPath), 'utf8');
  const annotationsText = await fs.readFile(path.join(root, annoPath), 'utf8');
  const annotations = readAnnotations(annotationsText), pagePaths = literal(indexText, 'pagePaths');
  const views = literal(indexText, 'liveReviewViews');
  for(const [key,items] of Object.entries(literal(indexText,'staticPageViews')))views[key]=[...(views[key]||[]),...items];
  const viewByKey = new Map();
  function register(items, parent) { for (const v of items) { if (v.file) viewByKey.set(v.file, { ...v, parent }); if (v.children) register(v.children, parent); } }
  for (const [parent, items] of Object.entries(views)) register(items, parent);
  const pages = {};
  for (const key of Object.keys(annotations).filter(scopeKey)) {
    const v = viewByKey.get(key);
    const parent = v?.parent || (key.startsWith('views/') ? `${key.split('/')[1]}.html` : key);
    const relative = pagePaths[parent];
    if (!relative) throw new Error(`当前直播批注没有物理页面映射：${key}`);
    const file = `${project}/prototype/pages/${relative}`;
    const html = await fs.readFile(path.join(root, file), 'utf8');
    const htitle = stripTags(html.match(/<title>([\s\S]*?)<\/title>/iu)?.[1] || parent).replace(/\s*[-|·].*$/u, '').replace(/（主播）/u, '');
    const settingNames = { beauty: '美颜设置', category: '直播分类', 'room-normal': '普通房设置', 'room-ticket': '门票房设置', 'room-password': '密码房设置', month: '月直播数据' };
    const name = key==='live-plaza.html'?'直播广场':v?.title.replace(/^视图-/u, '') || (key.startsWith('views/') ? settingNames[path.basename(key, '.html')] : null) || htitle;
    // The profile target may be a host; that does not change the viewer's role.
    const role = /^views\/live-room\/profile-moderator/u.test(key) ? '房管' :
      /^(?:live-room-host|live-room-cohost|live-end-host|start-live|moderator-management|visible-fan|live-data|live-records)/u.test(parent) ? '主播' : '观众';
    let object = name;
    if (/contribution-rank/u.test(key)) object = '本场贡献榜';
    if (/cohost-hosts|cohost-invite/u.test(key)) object = '连麦邀请';
    if (/fan-club-(?:joined|not-joined)/u.test(key)) object = '粉丝团关系';
    if (/^live-data\.html$|^views\/live-data\//u.test(key)) object='直播数据';
    const base = role === '主播' ? (/start-live|visible-fan/u.test(key) ? '主播具备开播资格' : /live-data|live-records/u.test(key) ? '主播已有直播记录' : '主播正在直播') : role === '房管' ? '房管账号已获得当前主播授权' : '观众已登录且可进入当前直播间';
    const steps = [key.startsWith('views/') ? `打开${name}` : `进入${name}`];
    if (/contribution-rank/u.test(key)) steps.splice(0, steps.length, '打开本场贡献榜');
    if (/cohost-hosts|cohost-invite/u.test(key)) steps.splice(0, steps.length, '打开连麦邀请');
    if (/fan-club/u.test(key)) steps.splice(0, steps.length, '打开粉丝团');
    if (/beauty/u.test(key)) steps.splice(0, steps.length, '进入开播设置', '打开美颜');
    if (/password/u.test(key) && role === '主播') {
      if (/start-live/u.test(key)) steps.splice(0, steps.length, '进入开播设置', '打开房型设置', '选择密码房');
      else steps.splice(0, steps.length, '打开更多功能', '点击房间密码');
    }
    if (/password-room-restricted/u.test(key)) steps.splice(0, steps.length, '进入目标密码房');
    pages[key] = { name, object, role, file, parent, selectors: v?.selectors || [], state: v?.state || null, steps, preconditions: [base] };
  }
  const contexts = inventory.filter(i => i.路径.includes('/context/') && i.路径.endsWith('.md')).map(i => i.路径);
  const seedPaths = [...new Set([annoPath, ...contexts, `${project}/项目说明.md`, `${project}/需求来源策略.json`, ...Object.values(pages).map(p => p.file),
    `${project}/prototype/annotations/admin.js`, `${project}/prototype/annotations/guild.js`, `${project}/prototype/assets/mock.js`, `${project}/prototype/assets/admin-mock.js`])].filter(p => inventory.some(i => i.路径 === p));
  const dependencies = await expandEvidenceDependencies(path.join(root, project), seedPaths.map(p => path.join(root, p)));
  const readPaths = [...new Set([indexPath, ...seedPaths, ...dependencies.语义文件.map(p => `${project}/${p}`)])];
  const texts = new Map(await Promise.all(readPaths.map(async p => [p, await fs.readFile(path.join(root, p), 'utf8')])));
  const documents = [{ path: annoPath, sha256: hash(annotationsText), priority: 2, kind: 'annotation', entries: [] }];
  for (const [key, value] of Object.entries(annotations).filter(([key]) => pages[key])) {
    for (const [si, section] of value.sections.entries()) for (const [ri, text] of section.d.entries()) {
      documents[0].entries.push({ page: key, section: section.t, text, position: `${key} / ${section.t} / ${si + 1}.${ri + 1}` });
    }
  }
  // The summary is read independently by section. It supplements and can override
  // annotation facts; derived requirement lists are cross-checks, not overrides.
  const summaryPath = `${project}/context/系统概要 .md`, summary = texts.get(summaryPath);
  const doc = { path: summaryPath, sha256: hash(summary), priority: 1, kind: 'requirement', entries: [] };
  let section = '';
  summary.split('\n').forEach((line, i) => {
    if (/^#{3,}/u.test(line)) section = line.replace(/^#+\s*/u, '');
    const page = /连麦机制|主播连麦/u.test(section) ? 'views/live-room-host/cohost-hosts.html'
      : /直播场次/u.test(section) ? 'live-room-host.html' : /开播权限/u.test(section) ? 'start-live-settings.html'
        : /直播间进入规则/u.test(section) ? 'live-room.html' : /粉丝群/u.test(section) ? 'views/live-room/fan-club-joined.html'
          : /主播收益/u.test(section) ? 'live-data.html' : /直播中主播/u.test(section) ? 'live-room-host.html'
            : /礼物[与和]门票|幸运礼物|金币充值与消费|创建与使用|虚拟金币隔离/u.test(section) ? 'views/live-room/gift.html' : null;
    if (!page || !line.trim() || /^#/u.test(line)) return;
    if (/^\*|^[\s\d.\\]+$/u.test(line)) return;
    const parts = line.startsWith('|') ? line.split('|').slice(1, -1).map(s => s.trim()) : null;
    const semanticText = parts && /主播连麦|粉丝群/u.test(section) ? `${parts[0].replace(/<br>/gu, '')} -> ${parts[1].replace(/<br>/gu, '')}` : undefined;
    doc.entries.push({ page, section, text: line, semanticText, position: `第${i + 1}行 / ${section}` });
  });
  documents.push(doc);
  // Derived requirements supplement discovery, but never override the summary
  // or reviewed annotations. Read complete matching sections, not keyword lines.
  for (const file of contexts.filter(p => p !== summaryPath)) {
    const extra = { path: file, sha256: hash(texts.get(file)), priority: 3, kind: 'derived-requirement', entries: [] };
    let heading = '', currentPage;
    for (const [i, line] of texts.get(file).split('\n').entries()) {
      if (/^#{1,6}\s/u.test(line)) {
        heading = line.replace(/^#+\s*/u, '');
        currentPage = /直播广场/u.test(heading) ? 'live-plaza.html' : /直播间|直播观看/u.test(heading) ? 'live-room.html' : /开播/u.test(heading) ? 'start-live-settings.html' : /连麦/u.test(heading) ? 'views/live-room-host/cohost-hosts.html' : /直播数据/u.test(heading) ? 'live-data.html' : /礼物与打赏/u.test(heading) ? 'views/live-room/gift.html' : null;
      }
      if (currentPage && line.trim() && !/^#/u.test(line)) extra.entries.push({ page: currentPage, section: heading, text: line, position: `第${i+1}行 / ${heading}` });
    }
    if (extra.entries.length) documents.push(extra);
  }
  const elements = [];
  const htmlFiles = Object.fromEntries([...new Set(Object.values(pages).map(p=>p.file))].map(file=>[file,texts.get(file)]));
  const parsed = spawnSync('python3', [path.join(import.meta.dirname,'parse-prototype-html.py')], { input: JSON.stringify(htmlFiles), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (parsed.status !== 0) throw new Error(`HTML解析失败：${parsed.stderr}`);
  const controlLines=[...texts].filter(([p])=>/\.(?:html|[cm]?js)$/u.test(p)&&!p.includes('/annotations/')).flatMap(([p,t])=>t.split('\n').flatMap((line,i)=>
    /querySelector|getElementById|closest|matches|addEventListener/u.test(line)?[{文件:p,行号:i+1,代码:line.trim(),证据性质:'实现定位；不独立证明业务规则'}]:[]));
  for (const [file, controls] of Object.entries(JSON.parse(parsed.stdout))) {
    const pageKeys = Object.keys(pages).filter(k=>pages[k].file===file);
    const parent = pages[pageKeys[0]].parent;
    for (const c of controls) {
      const id = c.attrs.id && !c.attrs.id.includes('${') ? `#${c.attrs.id}` : '';
      const locator = id || Object.entries(c.attrs).filter(([k])=>/^(?:data-|name$|aria-label$)/u.test(k)).map(([k,v])=>`[${k}${v ? `="${v}"` : ''}]`).join('') || `${c.tag}:source-${c.index}`;
      elements.push({ 元素标识: `EL-${hash([file,c.origin,c.line,c.templateOffset,c.index]).slice(0,12)}`, 页面: parent, 关联视图: pageKeys,
        文件:file, 行号:c.line, 类型:c.tag, 名称:c.name, 定位:locator, 属性:c.attrs, 容器:c.ancestors, 来源形态:c.origin,
        初始禁用:Object.hasOwn(c.attrs,'disabled'), 原文:c.raw });
      const tokens=[c.attrs.id,...Object.keys(c.attrs).filter(k=>k.startsWith('data-'))].filter(x=>x&&!x.includes('${'));
      elements.at(-1).实现引用=controlLines.filter(({代码:line})=>tokens.some(token=>line.includes(`'${token}'`)||line.includes(`"${token}"`)||line.includes(`#${token}`)||line.includes(`[${token}`)));
    }
  }
  // Preserve code branches with their actual local context. A partial call chain
  // is implementation evidence awaiting interpretation, not a business promise.
  const implementation = [];
  for (const [file, text] of texts) {
    if (!/\.(?:html|[cm]?js|tsx?|jsx|vue)$/u.test(file) || /annotations|index\.html/u.test(file)) continue;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (!/\bif\s*\(|\bcase\s+|\.catch\s*\(|\bcatch\s*\(|addEventListener\s*\(|\.onclick\s*=/u.test(line)) return;
      implementation.push({ 标识: `CODE-${hash([file,i+1,line]).slice(0,12)}`, 文件: file, 行号: i+1, 条件或入口: line.trim(),
        上下文: lines.slice(Math.max(0,i-2), Math.min(lines.length,i+8)).join('\n'), 页面: Object.keys(pages).filter(k=>pages[k].file===file),
        证据性质: '实现推导', 状态: '生成待复核', 原因: '需结合完整调用链确认条件、状态和结果，不能仅凭分支存在声明已覆盖' });
    });
  }
  return { inventory, documents, pages, dependencies, texts, implementation, elements };
}
