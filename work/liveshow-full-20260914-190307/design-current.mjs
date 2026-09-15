import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {hash} from '../../scripts/evidence-discovery.mjs';
import {splitAtomicResults,loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';
import {evaluateCalculation} from '../../scripts/testcase-design.mjs';
export const task='work/liveshow-full-20260914-190307';
export const model=JSON.parse(await fs.readFile(`${task}/mainbasis-model.json`,'utf8'));
export const fullText=await fs.readFile(model.formal.路径,'utf8');assert.equal(hash(fullText),model.formal.SHA256);
export const language=await loadTestcaseLanguageRules();
export const plans=[],transitions=[];
export function computed(point,formula,vars,expression,unit='金币',range='本条前置条件指定的业务记录'){
 const variables=Object.entries(vars).map(([名称,数值])=>({名称,业务含义:名称,单位:/比例|概率/.test(名称)?'比例':/数量|人数|次数/.test(名称)?'个':unit,数值}));
 const final=evaluateCalculation(expression,vars);
 return {point,result:`${point} = ${final} ${unit}`,calculation:{公式:formula,数据范围:range,结果单位:unit,证据:[0],变量:variables,表达式:expression,最终值:final}};
}
export const v=变量=>({变量});
export const op=(运算,...参数)=>({运算,参数});
const asArray=x=>Array.isArray(x)?x:[x];
const wording=new Map([['完成测试身份甲的授权','点击授权页的确认授权'],['使用授权失败的测试账号完成授权','登录会返回授权失败的测试账号并点击确认授权'],['完成账号甲授权','点击账号甲授权页的确认授权'],['等待 10 秒倒计时结束','查看10秒倒计时结束后的按钮状态'],['恢复测试网络','关闭测试网络故障开关并恢复连接'],['搜索运营甲','输入运营甲并点击查询'],['解除封禁','点击解封'],['停用公会','点击公会停用'],['停用公会长账号','点击公会长账号停用']]);
function actionText(s){
 if(wording.has(s))return wording.get(s);
 if(/^将滑块调整至 /.test(s))return s.replace('将滑块调整至','拖动滑块至');
 if(/^设置财富等级/.test(s))return s.replace('设置财富等级','输入财富等级范围');
 if(/^设置/.test(s))return s.replace(/^设置/,'选择');
 if(/^停用 /.test(s)||/^停用价格/.test(s))return `点击${s}`;
 if(/^将达成条件设为/.test(s))return s.replace('将达成条件设为','编辑达成条件为');
 if(s==='将各条件奖励设为10金币')return '输入各条件奖励10金币';
 return s;
}
export function page(end,key,base=[]){
 const p=model.pages[`${end}:${key}`];assert(p,`${end}:${key}`);
 const req=model.requirements.filter(r=>r.page===p.key);
 return {p,req,add:(description,pre,steps,results,sourcePatterns=[],opts={})=>{
  const sources=opts.sourceIds?req.filter(r=>opts.sourceIds.includes(r.id)):sourcePatterns.length?req.filter(r=>sourcePatterns.some(re=>re.test(`${r.field}：${r.body}`))):opts.support?[]:req;
  if(opts.support)sources.push(...model.requirements.filter(r=>opts.support.some(re=>re.test(r.body))));
  assert(sources.length,`No source: ${p.key} ${description}`);
  for(const [n,result] of asArray(results).entries()){
   const r=typeof result==='string'?{point:description,result}:result;
   const conditions=[`${opts.role||p.role}为本条执行者`,...base,...pre];
   const body={page:p.key,role:opts.role||p.role,description,point:r.point,pre:conditions,steps:steps.map(actionText),result:r.result,sources:sources.map(s=>s.id),flow:opts.flow||'',transition:opts.transition||null,type:opts.type||(/拒绝|不足|失败|禁止|封禁|不允许|无效|为空/.test(description)?'异常用例':'功能需求'),priority:opts.priority||(/支付|充值|审核|金币|权限|登录|退款|封禁/.test(description+p.module)?'P1':'P2'),calculation:r.calculation||null,review:null};
   body.id=`SC-${hash([body.page,body.role,body.pre,body.steps,body.result]).slice(0,14).toUpperCase()}`;
   plans.push(body);
  }
 }};
}
export function lifecycle(object,from,action,to,operator,end,observe,branch='正常分支'){
 const value={共同业务对象:object,来源状态:from,触发动作:action,目标状态:to,执行角色:operator,操作端:end,观察端:observe,分支类型:branch};
 value.状态转换标识=`ST-${hash(value).slice(0,14).toUpperCase()}`;value.流程编号=`FLOW-${hash(object).slice(0,8).toUpperCase()}`;
 transitions.push(value);return value;
}
export async function savePlans(){
 const byId=new Map();const merged=[];
 for(const p of plans){const scope=model.pages[p.page],key=hash([scope.endName,scope.module,scope.name,p.role,p.pre,p.steps,p.result]);if(byId.has(key)){const old=byId.get(key);old.sources=[...new Set([...old.sources,...p.sources])];merged.push({保留:old.id,合并:p.id,重复说明:p.description,说明:'本次相同功能、角色、条件、具体动作和结果合并；保留全部当前来源。'});}else byId.set(key,p);}
 const values=[...byId.values()];
 const errors=values.flatMap(p=>splitAtomicResults(p.result).length>1?[{id:p.id,description:p.description,result:p.result,parts:splitAtomicResults(p.result)}]:[]);
 await fs.writeFile(`${task}/scenario-design-draft.json`,JSON.stringify({业务输入:model.formal,场景:values,状态转换:transitions,去重:merged,单结果待处理:errors},null,2)+'\n');
 await fs.writeFile(`${task}/scenario-design-reading.txt`,values.map(p=>`${p.id} ${p.page} ${p.description}\n前提：${p.pre.join('；')}\n步骤：${p.steps.join(' → ')}\n预期：${p.result}\n来源：${p.sources.join('、')}`).join('\n\n')+'\n');
 console.log({设计:values.length,去重:merged.length,多结果:errors.length,状态转换:transitions.length});
}
