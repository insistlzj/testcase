import {baseline} from './source.mjs';
import {scenario as s,observe as o,navigation as nav,scenes} from './design.mjs';
const used=new Set(scenes.flatMap(c=>c.refs));
for(const e of baseline.entries){
 if(!e.page||e.status!=='基准规则')continue;
 const text=e.text;
 // 直接来源中的查询与导出动作逐页展开，测试数据明确设置包含、排除记录。
 if(/导出\s*->\s*当前/u.test(text)){
  s(e.id,'导出仅包含当前查询结果',['当前查询命中记录甲、乙，记录丙不满足当前筛选'],['点击导出','打开下载的结果文件'],'导出记录为甲、乙，不包含丙',{priority:'P2'});
 }
 if(/查询\s*->/u.test(text)&&/取交集|按.*过滤|按.*范围|按.*聚合/u.test(text)){
  const direct=text.match(/查询\s*->\s*(?:以|按)?([^；]+?)(?:取交集|过滤|聚合)/u)?.[1]?.replaceAll('条件','');
  const selectors=(direct||'').replace(/自然日范围|自然日/u,'日期').split(/、|和|或/u).map(x=>x.replace(/^(?:以|按)/u,'').trim()).filter(x=>x&&x.length<16);
  if(selectors.length){
   const fields=selectors.join('与');
   s(e.id,`${fields}共同筛选`,[selectors.length>1?`记录甲满足${fields}全部条件，记录乙仅满足其中部分条件，记录丙全不满足`:`记录甲满足${fields}条件，记录乙与丙均不满足`],[...selectors.map(k=>`选择${k}为记录甲对应值`),'点击查询'],'结果仅包含记录甲');
  }
 }
 if(used.has(e.id))continue;
 const field=text.match(/^([^：]+)：([^；。]+)(.*)$/u);
 if(field&&/字段|信息/u.test(e.section)){
  const [,label,body,rest]=field;
  if(/只读|不可改|系统生成/u.test(body)&&/ID|编号|单号/u.test(label)){
   o(e.id,`${label}标识不可编辑`,['目标记录已创建'],`已生成的${label}可查看但不可编辑`,{priority:'P2'});continue;
  }
  if(/状态$/u.test(label)&&/^[\u4e00-\u9fa5、， /]+$/u.test(body)&&body.length<30&&!/默认|时|按|固定|只有|可|不可|只读|关系|当前/u.test(body)){
   for(const state of body.split(/、|，/u))o(e.id,`${label}${state}回显`,[`所选记录${label}为${state}`],`${label}显示${state}`,{priority:'P2'});
   continue;
  }
  if(!rest&&!/[=×÷Σ]|合计|累计|总和|非负|正整数|大于|小于|最多|最少|至少|不小于|唯一|从|按|默认|仅|必填|支持|状态|启用|停用|可用|有效期|计入|数量|人数|值|时长|金额|余额|收益|贡献|消费|权限|门槛|规则/u.test(body)){
   o(e.id,`${label}资料对应`,[`已选中一条已存在记录，已记录其${label}原始值`],`页面${label}与所选记录一致：${body}`,{priority:'P2'});
  }
 }
 // 只抽取明确命名的单步页面跳转，不把“对应功能”等占位语变成用例。
 for(const part of text.split('；')){
  const m=part.match(/^(?:点击)?([^>]+?)\s*->\s*(?:进入|打开)([^，；。]+)$/u);
  if(m&&m[1].length<25&&m[2].length<28&&!/或|选择|状态|校验|对应|功能|详情$|查看|原型|提示|配置/u.test(m[1]+m[2]))nav(e.id,m[1].replace(/点击/u,'').trim(),m[2].trim());
 }
 if(/默认(?:全部[^；，]*[，、])?(今日|本月|近半年|近7天)/u.test(text)){
  const value=text.match(/默认(?:全部[^；，]*[，、])?(今日|本月|近半年|近7天)/u)[1];
  o(e.id,`首次进入默认${value}`,['本次首次进入该页且无上游带入筛选'],`日期范围默认${value}`,{priority:'P2'});
 }
}
