import {rules,clean,clauses} from './read-basis.mjs';
import {add} from './design-cases.mjs';
export const navigationInventory=[];
for(const r of rules){
 const p=r.page;
 for(const text of clauses(r.text)){
  // Only explicit direct navigation. Conditions, mixed choices and side effects stay in manual designs.
  const m=text.match(/^(点击|切换)([^；，：]{1,24})\s*->\s*((?:进入|打开|返回|回到|关闭)[^；，]{2,60})$/u);
  if(!m||/[\/、或和及]|成功|失败|审核|未|已|重|关闭|删除|提交|保存|确认|领取|发送|支付|充值|注销/u.test(m[2]))continue;
  const target=m[3].replace(/\s*P\d+(?:-\d+)?[。]?$/u,'');
  if(/后|并|选择.*和|提示|原型|可|或|仅|默认/u.test(target))continue;
  const role=p.role;
  add(r,{label:`${p.name}通过${m[2].trim()}进入关联页面`,point:'关联页面路由',given:[`当前${p.name}入口可访问；需选择对象时，本页存在可访问记录A，已记录其实际编号`],steps:[`打开${p.entry}`,`${m[1]}${m[2].trim()}`],expected:target,role,dimension:'正常主流程'});
  navigationInventory.push({source:r.标识,page:p.key,text});
 }
}
