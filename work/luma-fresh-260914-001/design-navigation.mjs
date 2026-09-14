import {requirements,pages,scenes,scenario} from './model.mjs';
// 只转换有明确目标的导航条款；更新、加载、刷新等未指定结果的条款留在覆盖审查中。
const seen=new Set();
for(const r of requirements){
 if(r.status!=='已确认'||!pages.has(r.page)||/原型|演示|建议|固定显示/.test(r.text))continue;
 const p=pages.get(r.page);
 for(const clause of r.text.split(/[；。]/)){
  const match=clause.trim().match(/^(点击[^→]+?)\s*(?:->|→)\s*((?:进入|返回|回到|打开)[^；。]+)$/);
  if(!match||/[或及]|并|后|时|已登录|游客/.test(match[1])||/[或；]|并|提示|更新/.test(match[2]))continue;
  const action=match[1].trim(),result=match[2].trim();
  if(result.length>55||action.length>32)continue;
  const key=[r.page,action,result].join('|');if(seen.has(key))continue;seen.add(key);
  if(scenes.some(s=>s.page===r.page&&s.result===result&&s.steps.includes(action)))continue;
  const pre=[`${p.role}已登录且拥有${p.name}访问权限`];
  if(/记录|通知|用户|主播|场次|粉丝团/.test(action))pre.push('本页存在可点击的目标记录；目标仍有效且属于当前账号可见范围');
  const id=scenario(r.page,`验证${action.replace(/^点击/,'')}导航到指定页面`,'页面导航',pre,[`进入${p.name}`,action],result,{match:r.text});
  scenes.find(s=>s.id===id).sourceIds=[r.id];
 }
}
