import {scenario,pages} from './model.mjs';
export function batch(page,base,entry,rows,defaults={}){
  for(const [title,point,pre,steps,result,options={}] of rows)scenario(page,title,point,[...base,...(Array.isArray(pre)?pre:pre?[pre]:[])],[...entry,...(Array.isArray(steps)?steps:steps?[steps]:[])],result,{...defaults,...options});
}
export const account=['用户账号可用且已登录'];
export const host=['执行账号为所选主播对应的用户账号，已登录'];
export const guild=['公会长账号已登录，当前公会启用，具备本页管理权限'];
export const admin=['后台账号已登录且拥有本页及本次操作的授权'];
export function calculation(formula,values,expression,answer,unit='金币',range='本条用例明确准备的业务记录'){
  return {公式:formula,数据范围:range,结果单位:unit,证据:[0],变量:Object.entries(values).map(([name,n])=>({名称:name,业务含义:name,数值:n,单位:/概率|比例|系数/.test(name)?'无量纲':/数量|次数/.test(name)?'次':unit})),表达式:expression,最终值:answer};
}
export const v=变量=>({变量}),op=(运算,...参数)=>({运算,参数});
export function fieldBounds(page,field,min,max,kind,opts={}){
  const entry=opts.entry||[`进入${pages.get(page).name}`], base=opts.base||account;
  const values=[...new Set([...(min!==null?[min-1,min,min+1]:[]),...(max!==null?[max-1,max,max+1]:[])])].filter(x=>x>=0);
  for(const value of values){
    const valid=(min===null||value>=min)&&(max===null||value<=max);
    const isLength=['length','digits'].includes(kind);
    const data=kind==='length'?`${value} 个“测”字符`:kind==='digits'?`“${'8'.repeat(value)}”`:String(value);
    const result=valid?`${field}接受本次${isLength?`${value} 字符`:`数值 ${value}`}输入`:`${field}不能保存超出${min!==null&&value<min?'下限':'上限'}的值`;
    batch(page,base,entry,[[`验证${field}${isLength?'长度':'数值'}为${value}时的校验`,`${field}${valid?'合法边界':'越界拦截'}`,`除${field}外的必填项已具备合法值`,[`清空${field}`,`输入${field}为${data}`,...(opts.submit?[opts.submit]:[])],result,{type:'逻辑校验',dimensions:['输入边界','可观察结果']}]],opts);
  }
}
