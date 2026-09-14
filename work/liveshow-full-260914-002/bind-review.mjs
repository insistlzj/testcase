import fs from 'node:fs/promises';
import {task} from './read-basis.mjs';
import {analyzed} from './check-design.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {ruleDesignHash} from '../../scripts/testcase-design.mjs';
const read=async n=>JSON.parse(await fs.readFile(task+'/'+n,'utf8'));
const snapshot=await read('review-current-snapshot.json'),decisions=await read('review-current-decisions.json');
if(fingerprint(await fs.readFile(task+'/review-current-snapshot.json'))!==decisions.快照SHA256)throw Error('Review snapshot changed');
const judgements=new Map();
for(const r of snapshot.记录)if(r.已有判断)judgements.set(r.设计SHA256,r.已有判断.说明);
for(const [indexes,note]of decisions.通过组)for(const index of indexes){const r=snapshot.记录.find(r=>r.序号===index);if(!r)throw Error('Unknown review index');judgements.set(r.设计SHA256,note);}
for(const [hash,note]of (await read('review-final-decisions.json')).通过)judgements.set(hash,note);
const ds=new Map(analyzed.map(d=>[d.rule.稳定规则标识,d]));
for(const dir of ['user','guild','admin']){
 const file=task+'/'+dir+'/business-rule-catalog.json',catalog=JSON.parse(await fs.readFile(file,'utf8'));
 for(const r of catalog.规则){
  const hash=ruleDesignHash(r),note=judgements.get(hash),d=ds.get(r.稳定规则标识);
  if(!note||!d||hash!==ruleDesignHash(d.rule))throw Error('No exact reviewed design: '+r.稳定规则标识);
  const merge=d.mergedFrom||[];
  r.去重复核={判定:merge.length?'合并':'保留',说明:note+(merge.length?'；本批次重复场景已合并：'+JSON.stringify(merge):'；依角色、前置条件、关键操作、单一结果保留本观察点')};
  r.设计复核={状态:'通过',说明:note,原始设计SHA256:hash,设计SHA256:ruleDesignHash(r)};
 }
 catalog.状态='所列正式设计逐条复核通过；全文覆盖另见覆盖清单';
 await fs.writeFile(file,JSON.stringify(catalog,null,2)+'\n');
 console.log(dir+': '+catalog.规则.length+' exact reviewed designs');
}
