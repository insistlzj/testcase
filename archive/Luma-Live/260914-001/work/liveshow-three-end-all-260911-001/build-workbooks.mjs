import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';
import { startStage, finishStage } from '../../scripts/pipeline-metrics.mjs';
import { validateDiscovery } from '../../scripts/validate-discovery.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const taskRoot = path.join(root, 'work/liveshow-three-end-all-260911-001');
const outputDir = path.join(root, 'outputs/Luma Live-case');
const ends = {
  用户App: { dir: 'user', json: '用户App-全部模块-测试用例-260911-001.json', table: 'UserAll' },
  公会App: { dir: 'guild', json: '公会App-全部模块-测试用例-260911-001.json', table: 'GuildAll' },
  管理后台: { dir: 'admin', json: '管理后台-全部模块-测试用例-260911-001.json', table: 'AdminAll' },
};
const caseHeaders = ['序号', '用例编号', '功能模块', '功能结构', '用例类型', '优先级', '用例描述', '验证用例子项', '前置条件', '操作步骤', '预期结果', '流程编号', '测试结果', '测试人员', '备注'];
const pendingHeaders = ['问题编号', '需求组编号', '父问题编号', '追问触发条件', '阻塞等级', '功能模块', '具体场景', '问题分类', '待决策问题', '可选方案', '测试建议', '产品结论', '结论补充', '已知依据', '影响范围', '已有用例编号', '确认后待补用例', '负责人', '期望确认时间', '确认状态'];
const border = { preset: 'all', style: 'thin', color: '#CBD5E1' };
const header = { fill: '#243447', font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true, borders: border };
const widths = {
  cases: [7, 14, 13, 25, 12, 8, 29, 22, 31, 34, 39, 18, 10, 12, 43],
  pending: [12, 13, 13, 22, 11, 13, 31, 19, 38, 44, 38, 12, 24, 38, 32, 20, 32, 12, 22, 12],
};

const list = (value, letters = false) => Array.isArray(value) ? value.map((item, index) => `${letters ? String.fromCharCode(65 + index) : index + 1}. ${item}`).join('\n') : String(value ?? '');
const rows = (items, headers, letterField = '') => items.map(item => headers.map(name => name === '预期结果' ? item[name][0] : Array.isArray(item[name]) ? list(item[name], name === letterField) : item[name] ?? ''));
const hashFile = async file => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const normalize = matrix => matrix.map(row => row.map(value => value ?? ''));

function styleSheet(sheet, headers, values, columnWidths, tableName) {
  const lastRow = values.length + 1, lastColumn = String.fromCharCode(64 + headers.length);
  sheet.getRange(`A1:${lastColumn}${lastRow}`).values = [headers, ...values];
  sheet.getRange(`A1:${lastColumn}${lastRow}`).format = { font: { name: 'Arial', size: 10, color: '#111827' }, verticalAlignment: 'center', wrapText: true, borders: border };
  sheet.getRange(`A1:${lastColumn}1`).format = header;
  sheet.getRange(`A1:${lastColumn}1`).format.rowHeight = 34;
  if (values.length) sheet.getRange(`A2:${lastColumn}${lastRow}`).format.rowHeight = 54;
  for (let index = 0; index < columnWidths.length; index += 1) sheet.getRangeByIndexes(0, index, lastRow, 1).format.columnWidth = columnWidths[index];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = 'TableStyleMedium2';
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
  return lastRow;
}

async function nextOutput(endName) {
  await fs.mkdir(outputDir, { recursive: true });
  const expression = new RegExp(`^${endName}-全部模块-260911-(\\d{3})\\.xlsx$`, 'u');
  const used = (await fs.readdir(outputDir)).map(name => Number(name.match(expression)?.[1] || 0));
  return path.join(outputDir, `${endName}-全部模块-260911-${String(Math.max(0, ...used) + 1).padStart(3, '0')}.xlsx`);
}

async function build(endName) {
  const config = ends[endName], taskDir = path.join(taskRoot, config.dir), previewDir = path.join(taskDir, 'previews');
  const source = JSON.parse(await fs.readFile(path.join(taskDir, config.json), 'utf8'));
  const outputPath = await nextOutput(endName);
  await fs.mkdir(previewDir, { recursive: true });
  await startStage(taskDir, 'xlsx-build', { 输入数量: source.测试用例.length + source.需求待确认.length });
  const workbook = Workbook.create();
  const overview = workbook.worksheets.add('产品决策概览');
  const casesSheet = workbook.worksheets.add('功能测试用例');
  const pendingSheet = workbook.worksheets.add('需求待确认');
  const caseRows = rows(source.测试用例, caseHeaders);
  const pendingRows = rows(source.需求待确认, pendingHeaders, '可选方案');
  const caseLast = styleSheet(casesSheet, caseHeaders, caseRows, widths.cases, `${config.table}Cases`);
  const pendingLast = styleSheet(pendingSheet, pendingHeaders, pendingRows, widths.pending, `${config.table}Pending`);
  pendingSheet.freezePanes.freezeColumns(3);
  casesSheet.getRange(`E2:E${caseLast}`).dataValidation = { rule: { type: 'list', values: ['功能需求', '业务流程', '逻辑校验', '异常用例'] } };
  casesSheet.getRange(`F2:F${caseLast}`).dataValidation = { rule: { type: 'list', values: ['P0', 'P1', 'P2', 'P3'] } };
  casesSheet.getRange(`M2:M${caseLast}`).dataValidation = { rule: { type: 'list', values: ['未测', '通过', '不通过', '阻塞', '不适用'] } };
  pendingSheet.getRange(`E2:E${pendingLast}`).dataValidation = { rule: { type: 'list', values: ['阻塞测试', '部分阻塞', '不阻塞'] } };
  pendingSheet.getRange(`H2:H${pendingLast}`).dataValidation = { rule: { type: 'list', values: ['需求范围', '业务规则', '角色与权限', '流程与状态', '字段与数据校验', '计算与统计口径', '异常处理', '跨端与跨模块一致性', '配置和历史数据影响', '交互与文案规则'] } };
  pendingSheet.getRange(`L2:L${pendingLast}`).dataValidation = { rule: { type: 'list', values: ['A', 'B', 'C', 'D', '其他'] } };
  pendingSheet.getRange(`R2:R${pendingLast}`).dataValidation = { rule: { type: 'list', values: ['产品', '交互', '技术', '多方确认'] } };
  pendingSheet.getRange(`T2:T${pendingLast}`).dataValidation = { rule: { type: 'list', values: ['待前置结论', '待确认', '确认中', '已确认', '无需处理'] } };
  pendingSheet.getRange(`L2:M${pendingLast}`).format.fill = '#FFF4CC';

  overview.getRange('A1').values = [[`${endName}-全部模块 产品决策概览`]];
  overview.getRange('A2').values = [['数量由“需求待确认”工作表实时汇总']];
  overview.getRange('A4:B10').values = [['状态', '数量'], ['问题总数', null], ['当前可回答', null], ['待前置结论', null], ['确认中', null], ['已确认', null], ['无需处理', null]];
  overview.getRange('D4:E7').values = [['阻塞等级', '当前待确认'], ['阻塞测试', null], ['部分阻塞', null], ['不阻塞', null]];
  overview.getRange('G4:H8').values = [['负责人', '当前待确认'], ['产品', null], ['交互', null], ['技术', null], ['多方确认', null]];
  overview.getRange('B5:B10').formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pendingLast})`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"待确认")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"待前置结论")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"确认中")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"已确认")`], [`=COUNTIF('需求待确认'!$T$2:$T$${pendingLast},"无需处理")`]];
  overview.getRange('E5:E7').formulas = ['阻塞测试', '部分阻塞', '不阻塞'].map(value => [`=COUNTIFS('需求待确认'!$E$2:$E$${pendingLast},"${value}",'需求待确认'!$T$2:$T$${pendingLast},"待确认")`]);
  overview.getRange('H5:H8').formulas = ['产品', '交互', '技术', '多方确认'].map(value => [`=COUNTIFS('需求待确认'!$R$2:$R$${pendingLast},"${value}",'需求待确认'!$T$2:$T$${pendingLast},"待确认")`]);
  overview.getRange('A1:H10').format = { font: { name: 'Arial', size: 10, color: '#111827' }, verticalAlignment: 'center' };
  overview.getRange('A1').format.font = { name: 'Arial', size: 15, bold: true, color: '#111827' };
  overview.getRange('A2').format.font = { name: 'Arial', size: 10, italic: true, color: '#64748B' };
  for (const range of ['A4:B10', 'D4:E7', 'G4:H8']) overview.getRange(range).format.borders = border;
  for (const range of ['A4:B4', 'D4:E4', 'G4:H4']) overview.getRange(range).format = header;
  for (const [column, width] of [['A', 22], ['B', 12], ['C', 4], ['D', 18], ['E', 14], ['F', 4], ['G', 18], ['H', 14]]) overview.getRange(`${column}1:${column}10`).format.columnWidth = width;
  overview.getRange('1:1').format.rowHeight = 30;
  overview.showGridLines = false;
  overview.freezePanes.freezeRows(3);
  const exported = await SpreadsheetFile.exportXlsx(workbook);
  await exported.save(outputPath);
  await finishStage(taskDir, 'xlsx-build', { 输入数量: source.测试用例.length + source.需求待确认.length, 输出数量: 1, 复用数量: 0 });

  await startStage(taskDir, 'xlsx-verify', { 输入数量: 1 });
  const saved = await SpreadsheetFile.importXlsx(await fs.readFile(outputPath));
  const inspection = [];
  for (const request of [
    { kind: 'workbook,sheet,table', maxChars: 8000, tableMaxRows: 3, tableMaxCols: 6, tableMaxCellChars: 80 },
    { kind: 'table', range: '功能测试用例!A1:O6', include: 'values,formulas', tableMaxRows: 6, tableMaxCols: 15, maxChars: 16000 },
    { kind: 'table', range: `功能测试用例!A${Math.max(1, caseLast - 3)}:O${caseLast}`, include: 'values,formulas', tableMaxRows: 4, tableMaxCols: 15, maxChars: 16000 },
    { kind: 'table', range: `需求待确认!A1:T${pendingLast}`, include: 'values,formulas', tableMaxRows: Math.min(20, pendingLast), tableMaxCols: 20, maxChars: 30000 },
    { kind: 'table', range: '产品决策概览!A1:H10', include: 'values,formulas', tableMaxRows: 12, tableMaxCols: 8, maxChars: 12000 },
  ]) inspection.push((await saved.inspect(request)).ndjson);
  const errors = await saved.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 300 }, summary: 'formula error scan' });
  if (/"count"\s*:\s*[1-9]/u.test(errors.ndjson)) throw new Error(`${endName}工作簿存在公式错误：${errors.ndjson}`);
  inspection.push(errors.ndjson);
  await fs.writeFile(path.join(taskDir, 'workbook-inspection.ndjson'), `${inspection.join('\n')}\n`);
  const expectedCases = normalize([caseHeaders, ...caseRows]), expectedPending = normalize([pendingHeaders, ...pendingRows]);
  const actualCases = normalize(saved.worksheets.getItem('功能测试用例').getRange(`A1:O${caseLast}`).values);
  const actualPending = normalize(saved.worksheets.getItem('需求待确认').getRange(`A1:T${pendingLast}`).values);
  let differences = 0;
  for (const [actual, expected] of [[actualCases, expectedCases], [actualPending, expectedPending]]) for (let row = 0; row < expected.length; row += 1) for (let column = 0; column < expected[row].length; column += 1) if (actual[row]?.[column] !== expected[row][column]) differences += 1;
  await fs.writeFile(path.join(taskDir, 'delivery-verification.json'), `${JSON.stringify({ schemaVersion: '1.0', 状态: differences ? '不通过' : '通过', JSON一致性差异数: differences,
    工作簿SHA256: await hashFile(outputPath), 候选SHA256: await hashFile(path.join(taskDir, 'current-testcase-candidate.json')),
    工作表: { 产品决策概览: 'A1:H10', 功能测试用例: `A1:O${caseLast}`, 需求待确认: `A1:T${pendingLast}` }, 公式错误数: 0, 检查时间: new Date().toISOString() }, null, 2)}\n`);
  if (differences) throw new Error(`${endName} Excel 与最终 JSON 存在 ${differences} 个单元格差异`);
  for (const [name, sheetName, range] of [['overview', '产品决策概览', 'A1:H10'], ['cases-top', '功能测试用例', 'A1:O12'], ['cases-bottom', '功能测试用例', `A${Math.max(1, caseLast - 9)}:O${caseLast}`], ['pending', '需求待确认', `A1:T${pendingLast}`]]) {
    const image = await saved.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
  }
  const sidecar = `${outputPath}.inspect.ndjson`;
  if (await fs.stat(sidecar).catch(() => null)) await fs.rename(sidecar, path.join(taskDir, 'artifact-inspect.ndjson'));
  await validateDiscovery(taskDir, root, { phase: 'final', workbook: outputPath });
  await finishStage(taskDir, 'xlsx-verify', { 输入数量: 1, 输出数量: 4, 复用数量: 0 });
  return { 端: endName, 输出文件: outputPath, 测试用例数: source.测试用例.length, 需求待确认数: source.需求待确认.length, 预览目录: previewDir };
}

const results = [];
for (const endName of Object.keys(ends)) results.push(await build(endName));
console.log(JSON.stringify(results, null, 2));
