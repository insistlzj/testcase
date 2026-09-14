import fs from 'node:fs/promises';
import {analyzed,designProblems} from './check-design.mjs';
import {ruleDesignHash} from '../../scripts/testcase-design.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
const file=new URL('./review-snapshot.json',import.meta.url);
if(designProblems.length)throw Error('Design errors remain');
const snapshot={说明:'索引只定位本次已展示给生成执行者的设计，不授予复核通过；每条结论需另行明确记录。',记录:analyzed.map((d,i)=>({序号:i+1,场景:d.id,设计SHA256:ruleDesignHash(d.rule),规则:d.rule}))};
await fs.writeFile(file,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({count:snapshot.记录.length,sha256:fingerprint(await fs.readFile(file))}));
