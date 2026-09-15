import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {validateWorkbookExportPaths} from '../../scripts/validate-testcase-delivery.mjs';

const repair='work/subitem-fix-260915-001',task='work/liveshow-user-260915-001/user';
const input='outputs/Luma Live-case/阶段性-用户App-全部模块-260915-002.xlsx';
const target='outputs/Luma Live-case/阶段性-用户App-全部模块-260915-003.xlsx';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const report=await read(`${repair}/revision-check.json`);
const verified=await read(`${repair}/before/${task}/delivery-verification.json`);
assert.equal(fingerprint(await fs.readFile(input)),verified.工作簿SHA256);
const original=await read(`${repair}/before/${task}/final-testcases.json`);
const revised=await read(`${task}/final-testcases.json`);
assert.equal(fingerprint(await fs.readFile(`${task}/final-testcases.json`)),report.候选SHA256);
const book=await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const sheet=book.worksheets.getItem('功能测试用例');
const headers=sheet.getRange('A1:O1').values[0];
assert.equal(headers[7],'验证用例子项');
const before=sheet.getRange(`A2:O${original.测试用例.length+1}`).values;
const render=async name=>{
  const png=await book.render({sheetName:'功能测试用例',range:'G369:K373',scale:1.5,format:'png'});
  await fs.writeFile(`${repair}/${name}.png`,new Uint8Array(await png.arrayBuffer()));
};
if(process.argv[2]==='preview') {
  console.log((await book.inspect({kind:'region',sheetId:'功能测试用例',range:'G370:K372',maxChars:1800})).ndjson);
  await render('before');
} else {
  assert.equal(process.argv[2],'edit');
  await validateWorkbookExportPaths(task,process.cwd(),`${task}/final-testcases.json`,target,{stage:true});
  const title=book.worksheets.getItem('产品决策概览').getRange('A1');
  assert.equal(title.values[0][0],'阶段性-用户App-全部模块-260915-002 产品决策概览');
  title.values=[['阶段性-用户App-全部模块-260915-003 产品决策概览']];
  for(const [i,c] of original.测试用例.entries()) {
    assert.equal(before[i][1],c.用例编号);
    assert.equal(before[i][7],c.验证用例子项);
    if(c.验证用例子项!==revised.测试用例[i].验证用例子项)sheet.getRange(`H${i+2}`).values=[[revised.测试用例[i].验证用例子项]];
  }
  const after=sheet.getRange(`A2:O${original.测试用例.length+1}`).values;
  for(const [i,row] of after.entries()) assert.deepEqual(row,before[i].map((v,col)=>col===7?revised.测试用例[i].验证用例子项:v));
  const errors=await book.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:30},summary:'修订后公式错误检查'});
  await fs.writeFile(`${repair}/formula-inspection.ndjson`,errors.ndjson);
  console.log(errors.ndjson);
  await render('after');
  const artifact=await SpreadsheetFile.exportXlsx(book);
  await artifact.save(`${repair}/authored.xlsx`);
  console.log({已编辑子项:report.修改条数,原有工作簿仍保留:true});
}
