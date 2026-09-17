import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {validateTestcaseBatch} from '../../scripts/validate-testcase-delivery.mjs';
const require=createRequire(path.resolve('scripts/build-testcase-workbook.mjs'));
const {SpreadsheetFile}=await import(require.resolve('@oai/artifact-tool'));
const family='work/liveshow-user-repair-260915-001',task=`${family}/user`;
const output='outputs/Luma Live-case/用户App-全部模块-260915-005.xlsx';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const data=await fs.readFile(output),report=await read(`${task}/delivery-verification.json`);
assert.equal(fingerprint(data),report.工作簿SHA256);
const revised=execFileSync('python3',['scripts/pending-core-view.py'],{input:data,maxBuffer:64*1024*1024});
assert.deepEqual(execFileSync('python3',['scripts/pending-core-view.py'],{input:revised,maxBuffer:64*1024*1024}),revised,'格式处理必须幂等');
try{await fs.copyFile(output,`${task}/before-outline.xlsx`,fs.constants.COPYFILE_EXCL);}catch(e){if(e.code!=='EEXIST')throw e;}
await fs.writeFile(`${task}/verified-format.xlsx`,revised);
// Verify cell payloads independently of the rendering library, including formulas and validation ranges.
const xmlCheck=execFileSync('python3',['-c',String.raw`
import json,sys,zipfile,xml.etree.ElementTree as E
n={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(sys.argv[1]) as a, zipfile.ZipFile(sys.argv[2]) as b:
  assert b.testzip() is None
  for name in a.namelist():
    if name not in ['xl/worksheets/sheet3.xml','xl/styles.xml']: assert a.read(name)==b.read(name),name
  x,y=[E.fromstring(z.read('xl/worksheets/sheet3.xml')) for z in [a,b]]
  cells=lambda s:[(c.get('r'),c.get('t'),[(v.tag,v.text,v.attrib) for v in c]) for c in s.findall('.//s:c',n)]
  assert cells(x)==cells(y)
  assert E.tostring(x.find('s:dataValidations',n))==E.tostring(y.find('s:dataValidations',n))
  assert {int(c.get('min')) for c in y.find('s:cols',n) if c.get('hidden')!='1'}=={1,6,7,9,10,12,13,18,20}
  rows={int(r.get('r')):r for r in y.findall('s:sheetData/s:row',n)}
  for child,parent in [(35,34),(37,36),(40,39)]:
    assert rows[child].get('hidden')=='1' and rows[child].get('outlineLevel')=='1'
    assert rows[parent].get('hidden')!='1' and rows[parent].get('collapsed')=='1'
  pane=y.find('s:sheetViews/s:sheetView/s:pane',n)
  assert pane.get('xSplit')=='3' and pane.get('ySplit')=='1'
print(json.dumps({'coreColumns':9,'hiddenColumns':11,'foldedChildren':3,'cellChanges':0}))
`,output,`${task}/verified-format.xlsx`],{encoding:'utf8'});
const workbook=await SpreadsheetFile.importXlsx(revised),candidate=await read(`${task}/final-testcases.json`);
const display=(key,v)=>Array.isArray(v)?key==='预期结果'&&v.length===1?v[0]:v.map((x,i)=>`${key==='可选方案'?String.fromCharCode(65+i):i+1}. ${x}`).join('\n'):v??'';
for(const [sheet,records,last]of [['功能测试用例',candidate.测试用例,'O'],['需求待确认',candidate.需求待确认,'T']]){
  const actual=workbook.worksheets.getItem(sheet).getRange(`A1:${last}${records.length+1}`).values;
  const headers=actual[0];
  assert.deepEqual(actual.slice(1).map(r=>r.map(v=>v??'')),records.map(r=>headers.map(h=>display(h,r[h]))));
}
const image=await workbook.render({sheetName:'需求待确认',range:'A33:T41',scale:1,format:'png'});
await fs.writeFile(`${task}/previews/pending-groups.png`,new Uint8Array(await image.arrayBuffer()));
await fs.rename(`${task}/verified-format.xlsx`,output);
report.工作簿SHA256=fingerprint(revised);report.分级显示={默认折叠:true,子问题数:3,父问题保持可见:true};
report.核心字段显示=JSON.parse(xmlCheck);report.检查时间=new Date().toISOString();
await fs.writeFile(`${task}/delivery-verification.json`,JSON.stringify(report,null,2)+'\n');
const batch=await validateTestcaseBatch(`${family}/batch.json`,process.cwd(),{workbooks:true});
await fs.writeFile(`${family}/batch-delivery-check.json`,JSON.stringify(batch,null,2)+'\n');
console.log({交付检查:batch.状态,要求满足:batch.交付要求满足,覆盖性质:batch.交付性质,...JSON.parse(xmlCheck)});
