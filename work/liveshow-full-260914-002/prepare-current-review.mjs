import fs from 'node:fs/promises';
import {analyzed,designProblems} from './check-design.mjs';
import {task} from './read-basis.mjs';
import {ruleDesignHash} from '../../scripts/testcase-design.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
const previous=JSON.parse(await fs.readFile(task+'/review-snapshot.json','utf8'));
const previousHash=fingerprint(await fs.readFile(task+'/review-snapshot.json'));
const decisions=new Map();
for(const file of (await fs.readdir(task)).filter(n=>/^review-decisions(?:-\d+)?\.json$/u.test(n))){
 const data=JSON.parse(await fs.readFile(task+'/'+file,'utf8'));
 if(data.快照SHA256!==previousHash)throw Error('Wrong review snapshot '+file);
 for(const kind of ['通过','不通过'])for(const [i,note]of data[kind]||[]){if(decisions.has(i))throw Error('Duplicate review '+i);decisions.set(i,{状态:kind,说明:note,文件:file});}
}
if(designProblems.length)throw Error('Design problems remain');
const exact=new Map(previous.记录.map(x=>[x.设计SHA256,x]));
const rows=analyzed.map((d,i)=>{
 const hash=ruleDesignHash(d.rule),old=exact.get(hash),judgment=old&&decisions.get(old.序号);
 const related=previous.记录.filter(x=>x.规则.用例设计.场景===d.rule.用例设计.场景).map(x=>x.序号);
 return {序号:i+1,场景:d.id,设计SHA256:hash,规则:d.rule,同名原序号:related,合并说明:d.mergedFrom||[],已有判断:judgment?.状态==='通过'?{原序号:old.序号,...judgment}:null};
});
const output={说明:'只复用内容哈希完全相同的明确逐条判断；任何修改或新增仍待独立判断。',原快照SHA256:previousHash,记录:rows};
await fs.writeFile(task+'/review-current-snapshot.json',JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({count:rows.length,unchangedReviewed:rows.filter(x=>x.已有判断).length,requiresReview:rows.filter(x=>!x.已有判断).length,sha256:fingerprint(await fs.readFile(task+'/review-current-snapshot.json'))}));
