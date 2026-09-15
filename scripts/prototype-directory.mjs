import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {fingerprint, localPath} from './requirement-traceability.mjs';

const check = (ok, message) => { if (!ok) throw new Error(message); };
const begin = '<!-- prototype-modules:v1:start -->', end = '<!-- prototype-modules:v1:end -->';
const nonempty = value => typeof value === 'string' && value.trim();

// ponytail: this viewer uses literal arrays/objects; reject computed configuration instead of executing index.html.
function literal(source, name) {
  const match = new RegExp(`\\bconst\\s+${name}\\s*=\\s*`).exec(source);
  check(match, `查看器缺少配置：${name}`);
  let offset = match.index + match[0].length;
  function token() {
    const pattern = /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*"|[A-Za-z_$][\w$]*|[{}\[\]:,;]/y;
    for (;;) {
      pattern.lastIndex = offset;
      const found = pattern.exec(source);
      check(found, `查看器 ${name} 含不支持的表达式，须更新目录解析器`);
      offset = pattern.lastIndex;
      if (!/^\s|^\/\//.test(found[0]) && !found[0].startsWith('/*')) return found[0];
    }
  }
  let current = token();
  const consume = expected => { check(current === expected, `查看器 ${name} 结构不完整`); current = token(); };
  const string = value => vm.runInNewContext(value, {}, {timeout:100}); // Only a single quoted string token reaches vm.
  function value() {
    if (/^['"]/.test(current)) { const result = string(current); current = token(); return result; }
    const array = current === '[';
    check(array || current === '{', `查看器 ${name} 只允许字符串、数组和对象`);
    consume(array ? '[' : '{');
    const result = array ? [] : Object.create(null), close = array ? ']' : '}';
    while (current !== close) {
      if (array) result.push(value());
      else {
        const key = /^['"]/.test(current) ? string(current) : current;
        check(/^[\w$]|^['"]/.test(current) && !Object.hasOwn(result,key), `查看器 ${name} 对象键非法或重复`);
        current = token(); consume(':'); result[key] = value();
      }
      if (current !== close) consume(',');
    }
    consume(close); return result;
  }
  const result = value(); check(current === ';', `查看器 ${name} 不是独立声明式配置`); return result;
}

export function extractPrototypeDirectory(text, sourcePath) {
  const paths = literal(text,'pagePaths'), rows = [];
  const userStart = text.indexOf('function addUserTree(');
  check(userStart >= 0, '缺少用户端页面树入口');
  for (const [endName, pagesName, groups] of [
    ['用户App','userPages',literal(text.slice(userStart),'groups').map(([title,files])=>({title,pageFiles:files,allFiles:files}))],
    ['公会App','guildPages',literal(text,'guildPageGroups')],
    ['管理后台','adminPages',literal(text,'adminPageGroups')],
  ]) {
    const pages = literal(text,pagesName), pageMap = new Map(pages.map(page=>[page.file,page]));
    check(pageMap.size === pages.length && pages.length, `${endName} 页面登记为空或重复`);
    const seen = new Set(), titles = new Set();
    for (const group of groups) {
      check(nonempty(group.title) && !titles.has(group.title), `${endName} 模块名为空或重复`); titles.add(group.title);
      const files = group.allFiles || group.pageFiles;
      check(Array.isArray(files) && files.length && Array.isArray(group.pageFiles) && new Set(group.pageFiles).size === group.pageFiles.length && group.pageFiles.every(file=>files.includes(file)), `${endName} 模块页面清单不完整或重复`);
      for (const file of files) {
        const page = pageMap.get(file);
        check(page && !seen.has(file) && nonempty(page.title), `${endName} 页面未注册或重复归组：${file}`);
        seen.add(file);
        const route=paths[file] || file;
        check(typeof route === 'string' && route.endsWith('.html') && !route.startsWith('/') && !route.split('/').includes('..'), `页面路径越界：${file}`);
        const pagePath = path.posix.join(path.posix.dirname(sourcePath),'pages',route);
        rows.push({端名:endName,功能模块:group.title,页面名称:page.title,页面路径:pagePath,登记方式:group.pageFiles.includes(file)?'直接页面':'关联详情页'});
      }
    }
    check(seen.size === pages.length, `${endName} 存在未归组页面`);
  }
  check(new Set(rows.map(row=>row.页面路径)).size === rows.length, '多个独立页面指向同一 HTML 文件');
  return {来源路径:sourcePath,来源SHA256:fingerprint(text),页面:rows};
}

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('|','&#124;').replaceAll('\n','&#10;');
const unescape = value => value.replaceAll('&#10;','\n').replaceAll('&#124;','|').replaceAll('&amp;','&');
export function renderModuleSection(directory) {
  const lines = [begin,'## 原型模块归属',`来源路径：${directory.来源路径}`,`来源 SHA-256：${directory.来源SHA256}`,
    '本节只定义模块名称和页面归属，不定义业务预期，也不代表测试覆盖。页面状态、弹窗、Tab 和角色视图沿用所属页面。'];
  let previousEnd, previousModule;
  for (const row of directory.页面) {
    if (row.端名 !== previousEnd) {lines.push('',`### ${escape(row.端名)}`); previousEnd=row.端名; previousModule=null;}
    if (row.功能模块 !== previousModule) {lines.push('',`#### ${escape(row.功能模块)}`,'','| 页面名称 | 页面路径 | 登记方式 |','| --- | --- | --- |'); previousModule=row.功能模块;}
    lines.push(`| ${[row.页面名称,row.页面路径,row.登记方式].map(escape).join(' | ')} |`);
  }
  return [...lines,end].join('\n');
}

export function moduleSection(text) {
  check(text.split(begin).length === 2 && text.split(end).length === 2, '缺少或重复原型模块目录区块');
  const start = text.indexOf(begin), finish = text.indexOf(end);
  check(finish > start, '原型模块目录区块边界错误'); return text.slice(start,finish+end.length);
}

export function readModuleDirectory(text) {
  const section = moduleSection(text), rows = [];
  let endName, moduleName;
  for (const line of section.split('\n')) {
    if (line.startsWith('### ')) {endName=unescape(line.slice(4)); moduleName=null;}
    else if (line.startsWith('#### ')) moduleName=unescape(line.slice(5));
    else if (line.startsWith('| ') && line !== '| 页面名称 | 页面路径 | 登记方式 |' && line !== '| --- | --- | --- |') {
      const cells = line.split('|').slice(1,-1).map(cell=>unescape(cell.trim()));
      check(endName && moduleName && cells.length === 3 && cells.every(nonempty), '模块目录页面行不完整');
      rows.push({端名:endName,功能模块:moduleName,页面名称:cells[0],页面路径:cells[1],登记方式:cells[2]});
    }
  }
  const directory = {来源路径:section.match(/^来源路径：(.+)$/m)?.[1],来源SHA256:section.match(/^来源 SHA-256：([a-f0-9]{64})$/m)?.[1],页面:rows};
  check(directory.来源路径 && directory.来源SHA256 && rows.length && renderModuleSection(directory) === section, '模块目录格式或来源版本无效');
  check(new Set(rows.map(row=>row.页面路径)).size === rows.length, '模块目录页面路径重复');
  return directory;
}

export async function expectedDirectory(root, project, policy) {
  const config = policy.原型目录结构;
  check(config && policy.派生需求清单.includes(config.输出) && config.输出.startsWith('context/'), '原型目录输出必须登记为 context 派生文件');
  const source = `${project}/${config.入口}`;
  const text = await fs.readFile(localPath(root,source),'utf8');
  const directory = extractPrototypeDirectory(text,source);
  for (const row of directory.页面) {
    const stat = await fs.lstat(localPath(root,row.页面路径));
    check(stat.isFile() && !stat.isSymbolicLink(), `原型页面不是普通文件：${row.页面路径}`);
  }
  check(fingerprint(await fs.readFile(localPath(root,source))) === directory.来源SHA256, '目录提取期间 index.html 已变化');
  return '# 原型页面目录结构\n\n' + renderModuleSection(directory) + '\n';
}

export async function updatePrototypeDirectory(root, project, policy, task) {
  if (!policy.原型目录结构) return;
  const target = `${project}/${policy.原型目录结构.输出}`, text = await expectedDirectory(root,project,policy);
  for (let parent=path.dirname(target); parent!=='.'; parent=path.dirname(parent)) {
    try {const stat=await fs.lstat(localPath(root,parent)); check(stat.isDirectory() && !stat.isSymbolicLink(), '目录输出不能经过符号链接或非目录');}
    catch(error) {if(error.code!=='ENOENT') throw error;}
  }
  let before = null;
  try {
    const stat=await fs.lstat(localPath(root,target)); check(stat.isFile() && !stat.isSymbolicLink(), '原型目录输出不是普通文件');
    before=await fs.readFile(localPath(root,target),'utf8');
  } catch(error) {if(error.code!=='ENOENT') throw error;}
  const report = {路径:target,修改前SHA256:before===null?null:fingerprint(before),修改后SHA256:fingerprint(text),修改前原文:before,修改后原文:text,有变化:before!==text};
  await fs.mkdir(localPath(root,task),{recursive:true});
  await fs.writeFile(localPath(root,`${task}/prototype-directory-sync.json`),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  if (before!==text) {
    await fs.mkdir(path.dirname(localPath(root,target)),{recursive:true});
    const temporary=localPath(root,`${target}.${randomUUID()}.tmp`);
    try {await fs.writeFile(temporary,text,{flag:'wx'}); await fs.rename(temporary,localPath(root,target));}
    finally {await fs.rm(temporary,{force:true});}
  }
  return report;
}

export function moduleNames(directory, endName) {
  const names = [...new Set(directory.页面.filter(row=>row.端名===endName).map(row=>row.功能模块))];
  check(names.length, `模块目录没有目标端：${endName}`); return names;
}

export function validateModuleAssignment(directory, scope, rules, questions = []) {
  const names = moduleNames(directory,scope.端名), requested = scope.模块名称 === '全部模块' ? names : scope.模块名称.split('、');
  check(requested.every(name=>names.includes(name)), '任务范围包含原型目录之外的模块');
  for (const rule of rules.filter(rule=>rule.可生成正式用例)) {
    check(requested.includes(rule.功能模块), `规则模块不属于本端范围：${rule.稳定规则标识}`);
    const page = directory.页面.find(row=>row.端名===scope.端名 && row.页面路径===rule.用例设计?.观察页面路径);
    check(page?.功能模块===rule.功能模块 && nonempty(rule.模块归属说明), `模块归属未匹配实际观察页面：${rule.稳定规则标识}`);
  }
  for (const question of questions) {
    // Pending business decisions may affect several modules; unknown classification stays visible, never guessed.
    check(question.功能模块 === '待映射' || (nonempty(question.功能模块) && question.功能模块.split('、').every(name=>requested.includes(name))), `需求问题使用未知模块：${question.问题编号}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [project,task] = process.argv.slice(2), root=process.cwd();
  try {
    check(project && task?.startsWith('work/'), '用法：prototype-directory.mjs <项目目录> <本次work目录>');
    const policy=JSON.parse(await fs.readFile(localPath(root,`${project}/需求来源策略.json`),'utf8'));
    const result=await updatePrototypeDirectory(root,project,policy,task);
    check(result,'项目未配置原型目录结构');
    console.log(JSON.stringify({路径:result.路径,有变化:result.有变化,修改后SHA256:result.修改后SHA256}));
  } catch(error) {console.error(error.message); process.exitCode=1;}
}
