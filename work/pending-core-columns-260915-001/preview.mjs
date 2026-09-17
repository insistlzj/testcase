import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {FileBlob, SpreadsheetFile} from '@oai/artifact-tool';
const version = process.argv[2] || '001';
for (const end of (process.argv[3] ? [process.argv[3]] : ['公会App', '管理后台'])) {
  const file = `outputs/Luma Live-case/阶段性-${end}-全部模块-260915-${version}.xlsx`;
  const book = await SpreadsheetFile.importXlsx(await FileBlob.load(file));
  console.log((await book.inspect({kind:'region',sheetId:'产品决策概览',range:'A4:H10',maxChars:2000})).ndjson);
  const errors = await book.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:30}});
  assert(!/"count"\s*:\s*[1-9]/u.test(errors.ndjson));
  console.log(errors.ndjson);
  for (const [sheetName, range] of [['需求待确认','A1:T4'],['产品决策概览','A1:H10']]) {
    const png = await book.render({sheetName,range,scale:1,format:'png'});
    await fs.writeFile(`work/pending-core-columns-260915-001/${end}-${version}-${sheetName}.png`,new Uint8Array(await png.arrayBuffer()));
  }
}
