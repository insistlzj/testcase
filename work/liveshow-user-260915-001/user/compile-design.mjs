import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fingerprint} from '../../../scripts/requirement-traceability.mjs';
import {casesFromCatalog,ruleDesignHash,validateRuleDesign,COVERAGE_DIMENSIONS} from '../../../scripts/testcase-design.mjs';
import {loadTestcaseLanguageRules,splitAtomicResults,validateTestcaseRecords} from '../../../scripts/validate-testcase-json.mjs';
import {calculationFor} from './calculation-design.mjs';
const task='work/liveshow-user-260915-001/user';
const read=async name=>JSON.parse(await fs.readFile(`${task}/${name}`,'utf8'));
const basis=await read('basis-index.json'), lang=await loadTestcaseLanguageRules();
const mainText=await fs.readFile(basis.输入[0].路径,'utf8'), lines=mainText.split(/\r?\n/);
assert.equal(fingerprint(mainText),basis.输入[0]['SHA-256']);
const inputNames=['auth','my','home','guild-wallet','social','host','live','decoration-fan','supplement','ranking','field','overview','completion','closure'].map(n=>`${n}-design-draft.json`);
const drafts=(await Promise.all(inputNames.map(read))).flat();
const atomicReview=await read('atomic-review.json');
const subitemDesign=await read('subitem-design.json');
const wording=new Map([
 ['完成第三方授权','确认第三方账号授权'],['完成授权','确认第三方账号授权'],
 ['等待10秒倒计时结束','查看10秒倒计时至结束'],['等待3秒倒计时结束','查看3秒倒计时至结束'],
 ['将搜索词改为B','修改搜索词为B'],['记录显示的公会','查看并记录显示的公会'],['按Enter','点击键盘Enter键'],
 ['记录顶部累计收益','查看并记录顶部累计收益'],['搜索目标用户ID','输入目标用户ID搜索'],['添加该用户为房管','点击添加该用户为房管'],
 ['搜索A的用户ID','输入A的用户ID搜索'],['开启成员限制','启用成员限制'],['将美颜参数调整为60','修改美颜参数为60'],
 ['将强度调整为0','修改强度为0'],['将强度调整为100','修改强度为100'],['左滑A成员行','向左滑动A成员行'],
 ['将贡献门槛改为100','修改贡献门槛为100'],['继续观看当前直播','查看当前直播画面'],['继续观看直播','查看当前直播画面'],
 ['离开房间','退出房间'],['将文案改为“@QA观众 感谢支持”','修改文案为“@QA观众 感谢支持”'],
 ['搜索B','输入B的主播ID进行搜索'],['搜索目标B','输入目标B的主播ID进行搜索'],['接受B邀请','点击接受B邀请'],
 ['尝试再次发起连麦','点击再次发起连麦'],['尝试接受该邀请','点击接受该邀请'],['尝试再次购买A','点击再次购买A'],
 ['尝试在公屏@B','输入@B并尝试发送公屏消息'],
]);
for(const d of drafts){
 d.steps=d.steps.map(s=>wording.get(s)||s);
 d.pre=d.pre.map((s,i)=>i===0?`执行角色为${s}`:s.replace(/^打开A确认时/,'A确认弹窗打开时'));
 if(d.steps.includes('输入正确密码')){d.pre.push('本次待验证的当前有效密码为QaTest123');d.steps=d.steps.map(s=>s==='输入正确密码'?'输入密码QaTest123':s);if(d.page==='live-plaza.html'){d.pre[d.pre.length-1]='本场有效密码为1234';d.steps=d.steps.map(s=>s==='输入密码QaTest123'?'输入密码1234':s);}}
 if(d.point==='关闭密码弹窗')d.point='密码校验取消返回';
}
function source(id){
 if(/^MAIN-\d+$/.test(id)){const n=Number(id.slice(5)),原文=lines[n-1];return {id,text:原文,unitId:fingerprint([basis.输入[0].路径,n,原文]),source:{...basis.输入[0],位置:`行${n}`,原文}};}
 const r=basis.条款.find(r=>r.id===id&&r.end==='用户App')||basis.条款.find(r=>r.id===id);assert(r,id);return r;
}
const verbs=Object.values(lang.actionVerbs).flat().sort((a,b)=>b.length-a.length);
const problems=[],splits=[],rules=[],sceneDraft=[],seen=new Map(),dedup=[];
for(const [di,d] of drafts.entries()){
 const page=basis.页面[d.page];assert(page,d.page);
 const refs=d.refs.map(source);
 const reviewed=atomicReview[String(di+1)]||{
  '卡片贡献本周范围':[['有效成员贡献排序','A排在B前'],['退团账号排除','不展示已退团C'],['运营账号排除','不展示运营号D']],
  '无团籍不显示粉丝身份':[['粉丝等级缺席','不展示A粉丝等级'],['灯牌缺席','不展示A灯牌'],['亲密度缺席','不展示A团内亲密度']],
  '好友资料沿用目标账号':[['头像来源','显示头像P'],['昵称来源','显示昵称QB']],
  '拉黑状态资料仍属目标':[['头像来源','显示头像P'],['昵称来源','显示昵称QB']],
 }[d.point];
 let results=reviewed?reviewed.map(x=>x[1]):splitAtomicResults(d.result);
 if(results.length>1)splits.push({草稿:di+1,场景:d.point,原结果:d.result,拆分:results});
 for(const [ri,rawResult] of results.entries()){
  const calculation=calculationFor(d,rawResult);
  const result=calculation?`${rawResult}（计算结果 = ${calculation.最终值} ${calculation.结果单位}）`:rawResult;
  const id=`BR-${fingerprint([d.page,d.role,d.pre,d.steps,result]).slice(0,16)}`;
  const explicit=subitemDesign.逐项[id];
  assert(explicit?.验证子项?.trim() && explicit.契约SHA256===fingerprint([d.page,d.role,d.pre,d.steps,result]), `${id}缺少当前契约的明确子项设计，须逐项核对，禁止关键词归类`);
  if(seen.has(id)){dedup.push({草稿:di+1,合并到:seen.get(id),依据:'同一页面、角色、条件、操作及原子结果完全相同，合并当前来源'});const previous=rules.find(r=>r.稳定规则标识===id);for(const ref of refs)if(!previous.证据引用.some(x=>x.位置===ref.source.位置))previous.证据引用.push({...ref.source,证明内容:ref.text});continue;}
  seen.set(id,di+1);
  const steps=d.steps.map((operation,i)=>{
   const verb=verbs.find(v=>operation.includes(v));
   if(!verb)problems.push({草稿:di+1,场景:d.point,问题:`步骤${i+1}无执行动词`,原文:operation});
   let object=verb?operation.slice(operation.indexOf(verb)+verb.length).trim():operation;
   if(!object)object=operation;
   return {执行角色:d.role,动作:verb||'',对象:object,操作:operation,证据:refs.map((_,i)=>i)};
  });
  const rule={稳定规则标识:id,业务对象:page.name.replace(/^视图-/,'').replaceAll(' / ','-'),共同业务对象:page.name,执行角色:d.role,适用角色和端:[`用户App-${d.role}`],触发动作:d.steps.at(-1),必要条件:d.pre,来源状态:d.pre.slice(1).join('；')||`${d.role}位于${page.name}`,目标状态或可观察结果:result,规则状态:'已确认规则',可生成正式用例:true,原子动作数量:1,原子结果数量:1,功能模块:page.module,功能结构:`${page.name.replace(/^视图-/,'')}（${d.role}视角）`,模块归属说明:`当前MainBasis目录：${page.path}属于${page.module}`,证据引用:[...refs.map(r=>({...r.source,证明内容:r.text})),{...page.entry,证明内容:'当前目标端实际页面及承载位置'}],
   跨模块流程编号:/举报/.test(d.point)?'FLOW-REPORT':/公会|入会|退会/.test(d.point+d.result)?'FLOW-GUILD':/退款|消费|金币|收益|充值|送礼/.test(d.point+d.result)?'FLOW-COIN':/连麦/.test(d.point+d.result)?'FLOW-COHOST':/好友|关注|拉黑|粉丝团|注销/.test(d.point+d.result)?'FLOW-RELATION':'',
   用例设计:{场景:`验证${d.point}${reviewed?`：${reviewed[ri][0]}`:results.length>1?`（${ri+1}）`:''}`,验证子项:explicit.验证子项,观察页面:page.name,观察页面路径:page.path,观察对象:d.point,观察端:'用户App',设计说明:`从当前MainBasis条款${d.refs.join('、')}设计；本条观察${result}`,观察证据:refs.map((_,i)=>i),步骤:steps,计算:calculation,用例类型:d.type,优先级:d.priority},
  };
  const issues=validateRuleDesign(rule,lang,{requireReview:false});
  for(const issue of issues)problems.push({草稿:di+1,场景:d.point,问题:issue});
  // Review is deliberately not marked passed here. This is the renderable review draft only.
  rules.push(rule);
  sceneDraft.push({场景标识:`SC-${id.slice(3)}`,执行角色:d.role,目标端:'用户App',入口:page.path,规则标识:[id],来源单元:refs.map(r=>r.unitId),来源条款:d.refs,用例契约:{前置条件:rule.必要条件,操作步骤:d.steps,预期结果:[result]},草稿位置:di+1});
 }
}
await fs.writeFile(`${task}/rule-design-review-draft.json`,JSON.stringify({schemaVersion:'1.0',项目名称:'Luma Live',目标范围:{端名:'用户App',模块名称:'全部模块'},规则:rules},null,2)+'\n');
await fs.writeFile(`${task}/scene-design-review-draft.json`,JSON.stringify({schemaVersion:'1.0',场景:sceneDraft},null,2)+'\n');
await fs.writeFile(`${task}/design-review-issues.json`,JSON.stringify({问题:problems,拆分:splits,精确去重:dedup},null,2)+'\n');
const tempCatalog={目标范围:{端名:'用户App',模块名称:'全部模块'},规则:rules.map(r=>({...r,设计复核:{状态:'通过',说明:'仅用于本次校验草稿渲染，不构成正式语义复核通过',设计SHA256:ruleDesignHash(r)}}))};
const rendered=casesFromCatalog(tempCatalog,{moduleDirectory:basis.模块目录});
const check=validateTestcaseRecords({测试用例:rendered,需求待确认:[]},lang);
await fs.writeFile(`${task}/language-review-draft.json`,JSON.stringify(check,null,2)+'\n');
console.log({原始设计:drafts.length,原子设计:rules.length,精确重复:dedup.length,需要查看拆分:splits.length,设计问题:problems.length,语言问题:check.问题.length});
console.log(problems.slice(0,15));console.log(check.问题.slice(0,20));
