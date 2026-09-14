import fs from 'node:fs/promises';
import {task,root,pages} from './read-basis.mjs';
import {analyzed} from './check-design.mjs';
import {validateTestcaseDelivery} from '../../scripts/validate-testcase-delivery.mjs';
const started=new Date().toISOString(),outputs=[];
for(const [dir,end]of [['user','用户App'],['guild','公会App'],['admin','管理后台']]){
 const base=task+'/'+dir,workbook=root+'/outputs/liveshow-full-260914-002/'+end+'-全部模块-260914-002.xlsx';
 const result=await validateTestcaseDelivery(base,root,{phase:'final',workbook});
 const data=JSON.parse(await fs.readFile(base+'/final-testcases.json','utf8'));
 if(data.测试用例.some(c=>c.测试结果!=='未测'))throw Error('Unexecuted status changed');
 const verification=JSON.parse(await fs.readFile(base+'/delivery-verification.json','utf8'));
 outputs.push({端:end,正式用例:data.测试用例.length,需求待确认:data.需求待确认.length,文件:workbook,校验:result.状态,SHA256:verification.工作簿SHA256,单元格差异:verification.JSON一致性差异数,公式错误:verification.公式错误数});
}
const emptyPages=pages.filter(p=>!analyzed.some(d=>d.page===p.key));if(emptyPages.length)throw Error('Pages with no designs: '+emptyPages.map(p=>p.key));
const phases=[];
for(const dir of ['user','guild','admin'])phases.push(...JSON.parse(await fs.readFile(task+'/'+dir+'/pipeline-metrics.json','utf8')).阶段.map(s=>({...s,端:dir})));
const ended=new Date().toISOString();
phases.push({阶段名称:'三端最终交付校验',开始时间:started,结束时间:ended,耗时毫秒:Date.parse(ended)-Date.parse(started),输入数量:3,输出数量:3,复用数量:0});
await fs.writeFile(task+'/pipeline-metrics.json',JSON.stringify({schemaVersion:'1.0',阶段:phases,历史比较:'不适用：不读取不比较',未记录阶段:['清单与哈希','语义读取','同步','规则归一化','候选生成与去重','JSON首次校验'],说明:'前段没有独立计时，无法还原准确耗时；未编造时间，也不声称已完成流程性能优化。',耗时最长阶段:[...phases].sort((a,b)=>b.耗时毫秒-a.耗时毫秒)[0]?.阶段名称},null,2)+'\n');
const report={检查时间:ended,正式用例总数:outputs.reduce((n,x)=>n+x.正式用例,0),页面数:pages.length,无用例页面数:0,运行执行:'未执行产品测试',覆盖声明:'三端有可执行交付；全文仍有未闭环条款，不声明完整覆盖',视觉检查:'三端各工作表已查看；用户新增主播粉丝页另行查看',输出:outputs};
await fs.writeFile(task+'/final-delivery-status.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
