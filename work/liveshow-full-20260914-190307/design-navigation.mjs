import {model,page} from './design-current.mjs';
for(const r of model.requirements){
 const p=model.pages[r.page];
 for(const sentence of r.body.split(/[。；]/).filter(Boolean)){
  const m=sentence.trim().match(/^(点击[^，；。]{2,28}|点击返回|返回)\s*->\s*(进入[^，；。]{2,35}|返回[^，；。]{2,35}|回到[^，；。]{2,35})$/);
  if(!m||/或|、|后|若|时|其中|对应|继续|该|有效|仍|模拟|授权|登录成功|主播或|筛选位置/.test(m[0]))continue;
  const pg=page(p.endName,p.原型页面,[`${p.name.replace(/^视图-/,'')}已展示；涉及列表记录时，列表中存在可选择的本账号记录甲`]);
  pg.add(`${p.name.replace(/^视图-/,'')}使用${m[1].replace(/^点击/,'')}` ,[],[m[1]==='返回'?'点击返回':m[1]],[{point:'目标入口',result:m[2]}],[],{sourceIds:[r.id]});
 }
}
