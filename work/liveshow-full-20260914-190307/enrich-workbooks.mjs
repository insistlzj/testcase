import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {SpreadsheetFile} from '@oai/artifact-tool';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {validateTestcaseDelivery} from '../../scripts/validate-testcase-delivery.mjs';
const root=process.cwd(),task='work/liveshow-full-20260914-190307';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const batch=await read(task+'/batch.json');
const item=batch.端任务.find(x=>x.端名===process.argv[2]);assert(item,'指定目标端');
const dir=item.任务目录,file=item.工作簿,data=await read(dir+'/final-testcases.json'),gaps=await read(dir+'/coverage-gaps.json'),isolated=await read(dir+'/isolated-designs.json');
await validateTestcaseDelivery(path.resolve(dir),root,{phase:'final',workbook:path.resolve(file)});
const book=await SpreadsheetFile.importXlsx(await fs.readFile(file));
const overview=book.worksheets.getItem('产品决策概览');
overview.getRange('A12:B16').values=[['用例交付','当前已确认部分'],['完整覆盖校验','未通过'],['正式用例数',data.测试用例.length],['本端模块数',new Set(data.测试用例.map(c=>c.功能模块)).size],['执行状态','全部未测']];
overview.getRange('D12:H16').values=[['覆盖说明','','','',''],['三端全部模块均有用例；完整需求分支核验尚未闭合。','','','',''],['“覆盖核验清单”中的未映射或未核验条款必须继续处理。','','','',''],['需求待确认单列；不把生成缺口转成产品问题。','','','',''],['计数用于追溯，不代表业务覆盖率或测试通过率。','','','','']];
overview.getRange('A12:B16').format={font:{name:'Arial',size:10},wrapText:true,borders:{preset:'all',style:'thin',color:'#CBD5E1'}};
overview.getRange('A13:B13').format.fill='#FFF1D6';
// Text overflows the following empty cells; keep it on one line at a readable size.
overview.getRange('D12:H16').format={font:{name:'Arial',size:10},wrapText:false};
overview.getRange('12:16').format.rowHeight=30;
const header=['需求编号','功能模块','来源行','需求内容','处理状态','关联正式用例','待完成事项'];
const rows=gaps.map(g=>[g.需求编号||`概要-${g.行}`,g.模块,g.行,g.原文.replace(/〔来源：.*$/,'').replace(/^- \[[^\]]+\] /,''),g.状态==='未覆盖'?'尚未建立场景映射':'整段分支核验未闭合',g.关联用例.join('、'),g.待补.join('\n')||g.说明]);
for(const x of isolated)if(x.性质!=='本次语义重复')rows.push([x.规则.独立来源规则.join('、'),x.规则.功能模块,'',x.规则.用例设计.场景,'局部隔离','',x.原因]);
const sheet=book.worksheets.add('覆盖核验清单'),last=rows.length+1;
sheet.getRange(`A1:G${last}`).values=[header,...rows];
sheet.getRange(`A1:G${last}`).format={font:{name:'Arial',size:10,color:'#111827'},wrapText:true,verticalAlignment:'center',borders:{preset:'all',style:'thin',color:'#CBD5E1'}};
sheet.getRange('A1:G1').format={fill:'#7C4A03',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true};
const widths=[25,17,10,70,24,40,68];
for(let i=0;i<widths.length;i++)sheet.getRangeByIndexes(0,i,last,1).format.columnWidth=widths[i];
sheet.getRange('1:1').format.rowHeight=34;
for(let i=0;i<rows.length;i++){
 const count=Math.max(...rows[i].map((value,c)=>String(value).split('\n').reduce((n,line)=>n+Math.max(1,Math.ceil([...line].reduce((w,ch)=>w+(/[^\x00-\x7F]/.test(ch)?2:1),0)/(widths[c]*.9))),0)));
 sheet.getRangeByIndexes(i+1,0,1,7).format.rowHeight=Math.min(409,Math.max(44,15*count+12));
}
sheet.tables.add(`A1:G${last}`,true,'CoverageReviewTable').style='TableStyleMedium2';
sheet.freezePanes.freezeRows(1);sheet.freezePanes.freezeColumns(2);sheet.showGridLines=false;
const temporary=file+'.coverage.tmp.xlsx';
try{const xlsx=await SpreadsheetFile.exportXlsx(book);await xlsx.save(temporary);await fs.rename(temporary,file);}finally{await fs.rm(temporary,{force:true});}
const saved=await SpreadsheetFile.importXlsx(await fs.readFile(file));
const fieldList=['序号','用例编号','功能模块','功能结构','用例类型','优先级','用例描述','验证用例子项','前置条件','操作步骤','预期结果','流程编号','测试结果','测试人员','备注'];
const list=(value,key)=>Array.isArray(value)?key==='预期结果'&&value.length===1?value[0]:value.map((x,i)=>`${i+1}. ${x}`).join('\n'):value??'';
const expected=[fieldList,...data.测试用例.map(c=>fieldList.map(k=>list(c[k],k)))];
const actual=saved.worksheets.getItem('功能测试用例').getRange(`A1:O${expected.length}`).values.map(row=>row.map(v=>v??''));
assert.deepEqual(actual,expected,'追加覆盖清单不得改变任何正式用例字段');
const pendingHeaders=['问题编号','需求组编号','父问题编号','追问触发条件','阻塞等级','功能模块','具体场景','问题分类','待决策问题','可选方案','测试建议','产品结论','结论补充','已知依据','影响范围','已有用例编号','确认后待补用例','负责人','期望确认时间','确认状态'];
const pendingRows=[pendingHeaders,...data.需求待确认.map(q=>pendingHeaders.map(k=>Array.isArray(q[k])?q[k].map((v,i)=>`${k==='可选方案'?String.fromCharCode(65+i):i+1}. ${v}`).join('\n'):q[k]??''))];
assert.deepEqual(saved.worksheets.getItem('需求待确认').getRange(`A1:T${pendingRows.length}`).values.map(r=>r.map(v=>v??'')),pendingRows,'追加覆盖清单不得改变需求决策记录');
assert.deepEqual(saved.worksheets.getItem('覆盖核验清单').getRange(`A1:G${last}`).values.map(r=>r.map(v=>v??'')),[header,...rows],'覆盖核验清单逐格核对');
const errors=await saved.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:100}});
assert(!/"count"\s*:\s*[1-9]/u.test(errors.ndjson),'公式错误');
for(const [name,sheetName,range] of [['overview','产品决策概览','A1:H16'],['coverage','覆盖核验清单','A1:G7']]){
 const picture=await saved.render({sheetName,range,scale:1,format:'png'});await fs.writeFile(dir+'/previews/'+name+'.png',new Uint8Array(await picture.arrayBuffer()));
}
const report=await read(dir+'/delivery-verification.json');report.工作簿SHA256=fingerprint(await fs.readFile(file));report.工作表.覆盖核验清单=`A1:G${last}`;report.工作表.产品决策概览='A1:H16';report.覆盖清单逐格差异数=0;report.检查时间=new Date().toISOString();report.交付性质='部分覆盖';report.完整覆盖校验='未通过';
await fs.writeFile(dir+'/delivery-verification.json',JSON.stringify(report,null,2)+'\n');
await validateTestcaseDelivery(path.resolve(dir),root,{phase:'final',workbook:path.resolve(file)});
console.log(JSON.stringify({端:item.端名,文件:file,正式用例:data.测试用例.length,覆盖核验行:rows.length,JSON差异:0,公式错误:0}));
