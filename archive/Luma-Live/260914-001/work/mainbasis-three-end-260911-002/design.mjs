import { baseline, hash } from './source.mjs';
export const entries = new Map(baseline.entries.map(e => [e.id,e]));
export const scenes = [], dispositions = new Map(), transitions = [];
export const ends = ['用户App','公会App','管理后台'];
export const refs = (prefix, numbers) => numbers.split(',').flatMap(v => {
  const [a,b] = v.split('-').map(Number); return Array.from({length:(b || a)-a+1},(_,i)=>`${prefix}-${String(a+i).padStart(3,'0')}`);
});
export function pageRole(page) {
  const p=baseline.pages[page];
  if(p.end==='公会App') return page.startsWith('guild-login')?'待登录公会长':'公会长';
  if(p.end==='管理后台') return page.includes('system-')?'超级管理员':'平台管理员';
  if(/^(auth-|views_auth-)/u.test(page)) return '待登录用户';
  if(/profile-moderator/u.test(page)) return '房管';
  if(/patrol-room/u.test(page)) return '巡房人员';
  if(/(?:^host-center|^host-guild|^live-data|^views_live-data|^live-records|^income-sharing|^start-live|^views_start-live|^visible-fan|^moderator-management|^fan-list|^fan-club|^views_fan-club|live-room-host|live-room-cohost|^live-end-host|group-manage-owner)/u.test(page)) return '主播';
  if(/fan-group-chat|group-manage-member/u.test(page)) return '粉丝团成员';
  return '用户';
}
export function pageSteps(page) {
  const p=baseline.pages[page];
  return p.parent===page?[`进入「${p.name}」页`]:[`进入「${baseline.pages[p.parent].name}」页`,`打开「${p.name}」视图`];
}
export function scenario(ids,point,pre,steps,result,options={}) {
  options=Object.fromEntries(Object.entries(options).filter(([,v])=>v!==undefined));
  ids=Array.isArray(ids)?ids:[ids];
  for(const id of ids) if(!entries.has(id)) throw Error(`来源不存在 ${id}`);
  const page=options.page || entries.get(ids.find(id=>entries.get(id).page))?.page;
  if(!page || !baseline.pages[page]) throw Error(`缺少目标页面 ${ids}`);
  const p=baseline.pages[page], role=options.role || pageRole(page);
  for(const id of ids) if(entries.get(id).status!=='基准规则') throw Error(`正式场景引用非确定条款 ${id}`);
  const conditions=[role.startsWith('待登录')?`执行者为${role}，尚未建立登录会话`:role==='游客'?'执行者为未登录游客':`已登录${role}账号`,...pre];
  const actions=options.fullSteps?steps:[...pageSteps(page),...steps];
  const s={id:`SC-${hash([page,role,conditions,actions,result]).slice(0,14)}`,refs:ids,page,end:p.end,module:p.module.split(' ')[0],role,point,
    pre:conditions,steps:actions,result,description:options.description || `验证${point}`,priority:options.priority || 'P1',type:options.type || '功能需求',dimensions:options.dimensions || ['正常主流程','可观察结果'],flow:options.flow || '',transition:options.transition || '',...options};
  scenes.push(s); return s;
}
export const observe=(ids,point,pre,result,options={})=>scenario(ids,point,pre,[`查看${point.replace(/（[^）]*）/gu,'')}`],result,options);
export function context(ids,why,related=[]) {for(const id of ids) if(entries.get(id)?.status==='基准规则') dispositions.set(id,{type:'上下文或重复说明',why,related});}
export function exclude(ids,why) {for(const id of ids) dispositions.set(id,{type:'不属于业务测试',why});}
export function question(ids,q,why) {for(const id of ids) dispositions.set(id,{type:'需求待确认',q,why});}
export function transition(object,from,action,role,end,to,ids,observed,branch='正常') {
  const flow=`FLOW-${hash(object).slice(0,8).toUpperCase()}`, id=`ST-${hash([object,from,action,role,end,to]).slice(0,12).toUpperCase()}`;
  for(const ref of ids) if(entries.get(ref)?.status!=='基准规则') throw Error(`状态缺少规则 ${ref}`);
  const row={id,flow,object,from,action,role,end,to,refs:ids,observed,branch};transitions.push(row);return row;
}
export function field(id,name,pre=[],options={}) {return observe(id,`${name}回显`,pre,`「${name}」显示所选对象记录中的${name}`,{priority:'P2',...options});}
export function textBoundary(id,name,max,{required=false,trim=false,button='保存',blockInput=false,...options}={}) {
  for(const n of [...new Set([0,1,max-1,max,max+1])]) {
    const value=n?`${n}个「测」字符`:'空字符串',valid=(!required || n>0)&&n<=max;
    scenario(id,`${name}${n}字符${valid?'可填写':'限制'}`,['其他必填字段为合法值'],[n?`在「${name}」输入${value}`:`清空「${name}」`,...(blockInput?[]:[`点击「${button}」`])],
      valid?`「${name}」保留${n}个字符`:blockInput&&n>max?`「${name}」最多保留${max}个字符`:`${name}未通过校验，无法${button}`,
      {type:valid?'逻辑校验':'异常用例',dimensions:['输入边界','可观察结果'],...options});
  }
  if(required&&trim) scenario(id,`${name}仅空格限制`,['其他必填字段为合法值'],[`在「${name}」输入3个空格`,`点击「${button}」`],`${name}去除首尾空格后为空，无法${button}`,{type:'异常用例',...options});
}
export function numbers(id,name,values,{valid,button='保存',...options}) {
  for(const v of values) scenario(id,`${name}输入${v}`,['其他必填字段为合法值'],[`在「${name}」输入${v}`,`点击「${button}」`],valid(v)?`「${name}」接受数值${v}`:`「${name}」不接受数值${v}`,{type:valid(v)?'逻辑校验':'异常用例',dimensions:['输入边界','可观察结果'],...options});
}
export function required(id,names,button='保存',options={}) {
  for(const name of names) scenario(id,`${name}缺失限制`,['其他必填字段为合法值'],[`清空「${name}」`,`点击「${button}」`],`${name}未填写，无法${button}`,{type:'异常用例',...options});
}
export function navigation(id,button,target,pre=[],options={}) {return scenario(id,`${button}入口`,pre,[`点击「${button}」`],`页面进入「${target}」`,{priority:'P2',...options});}
