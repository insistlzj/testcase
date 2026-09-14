import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
export const task=import.meta.dirname,root=path.resolve(task,'../..');
export const formalPath='liveshow-proto/MainBasis/统一需求文档.md',riskPath='liveshow-proto/MainBasis/需求待确认清单.md';
export const hash=x=>crypto.createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
export const save=(name,data)=>fs.writeFile(path.join(task,name),JSON.stringify(data,null,2)+'\n');
export const formalText=await fs.readFile(path.join(root,formalPath),'utf8');
export const riskText=await fs.readFile(path.join(root,riskPath),'utf8');
export const formalHash=hash(formalText),riskHash=hash(riskText);
export const pages=new Map([...formalText.matchAll(/<!-- PAGE (.+) -->/g)].map(m=>{const p=JSON.parse(m[1]);return[p.key,p];}));
export const requirements=[...formalText.matchAll(/<!-- RULE (.+) -->\n\n\*\*[^\n]+\*\*\n\n([\s\S]*?)\n\n来源：/g)].map(m=>({...JSON.parse(m[1]),text:m[2]}));
export const questions=[...riskText.matchAll(/<!-- QUESTION (.+) -->/g)].map(m=>JSON.parse(m[1]));
export const evidence=r=>({路径:formalPath,'SHA-256':formalHash,位置:r.id,证明内容:r.text,原文:r.text});
export function find(page,match){
  const result=requirements.filter(r=>(page==='*'||r.page===page)&&(!match||(match instanceof RegExp?match.test(r.text):r.text.includes(match))));
  if(!result.length)throw new Error(`未找到本轮 MainBasis 依据：${page} ${match}`);
  return result;
}
export const scenes=[],transitions=[];
export function transition(object,from,action,role,end,to,observers,sourcePage,match,branch='成功'){
  const sources=find(sourcePage,match).filter(r=>r.status!=='待确认');if(!sources.length)throw new Error('未确认转换');
  const id=`ST-${hash([object,from,action,role,end,to]).slice(0,12)}`;
  const flow=`FLOW-${hash(object).slice(0,8)}`;
  transitions.push({状态转换标识:id,流程编号:flow,共同业务对象:object,来源状态:from,触发动作:action,执行角色:role,操作端:end,目标状态:to,观察端:observers,分支类型:branch,规则标识:sources.map(r=>r.id),证据:sources.map(evidence),状态:'已确认'});
  return id;
}
export function scenario(pageKey,title,point,conditions,steps,result,options={}){
  const p=pages.get(pageKey);if(!p)throw new Error(`缺少页面 ${pageKey}`);
  const sourcePages=options.sources||[pageKey];
  const sources=sourcePages.flatMap(key=>find(key,options.match)).filter(r=>r.status!=='演示或视觉说明'&&(r.status!=='待确认'||options.commonPart));
  if(!sources.length)throw new Error(`场景没有明确依据：${title}`);
  const role=options.role||p.role, id=`SC-${hash([p.endName,pageKey,role,title,conditions,steps,result]).slice(0,14)}`;
  if(scenes.some(s=>s.id===id))throw new Error(`场景重复 ${title}`);
  const transitionId=options.transition||'';
  const t=transitionId?transitions.find(t=>t.状态转换标识===transitionId):null;
  if(transitionId&&!t)throw new Error(`状态转换不存在 ${title}`);
  scenes.push({id,page:pageKey,end:p.endName,module:p.module,structure:`${p.name}（${role}）`,role,title,point,conditions,steps,result,
    sourceIds:sources.map(r=>r.id),type:options.type||'功能需求',priority:options.priority||'P1',dimensions:options.dimensions||['正常主流程','可观察结果'],
    transition:transitionId,flow:t?.流程编号||options.flow||'',from:t?.来源状态||options.from||'',to:t?.目标状态||options.to||'',object:t?.共同业务对象||options.object||p.name,
    observationPage:options.observationPage||pageKey,calculation:options.calculation||null,notes:options.notes||[],review:options.review||'已按当前 MainBasis 对照角色、入口、必要数据和唯一观察点；未从演示固定值推断业务阈值'});
  return id;
}
export async function freezeRequirements(){
  await save('independent-rule-baseline.json',{schemaVersion:'1.0',创建时间:new Date().toISOString(),历史策略:'不读取不比较',输入:[{路径:formalPath,'SHA-256':formalHash},{路径:riskPath,'SHA-256':riskHash}],规则:requirements,页面:[...pages.values()]});
}
