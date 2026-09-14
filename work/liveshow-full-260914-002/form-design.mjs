import {rules,clean} from './read-basis.mjs';
import {add,designs} from './design-cases.mjs';
export const formReview=[];
const numericValues=(low,high)=>[low-1,low,low+1,...(high===null?[]:[high-1,high,high+1])].filter((v,i,a)=>a.indexOf(v)===i);
for(const r of rules){
 const p=r.page,text=clean(r.text);if(p.module==='账号与登录')continue;
 const field=text.match(/^([^：]{1,35})：(.*)$/u);if(!field)continue;
 const name=field[1].replaceAll(' / ','、'),body=field[2];
 if(!/必填|必选|正整数|非负|最多.*字符|最长|最大.*字符|不得.*(?:大于|小于)|取值.*\d|[0-9]\s*[-~～]\s*[0-9]/u.test(body))continue;
 if(/只读|排序|展示|统计|总量|单选框选择KTP/u.test(name)||/当前.*(?:总数|人数)|只读/u.test(body))continue;
 // These are input constraints, not rank limits, accumulated amounts or permission definitions.
 if(/贡献|榜单|排名|房管数量|在线|有效天|已佩戴数量|通知时间|截止/u.test(name))continue;
 const isField= /编辑|设置|配置|申请|举报|搜索|选择|新增|新建|密码|发放|补全|创建|退款|上传|批量|额度/u.test(p.name);
 if(!isField){formReview.push({规则:r.id,原因:'非编辑页面字段须回到明确入口设计',字段:name,页面:p.key});continue;}
 const role=p.end==='用户App'&&/开播|主播|room-password|beauty|visible|start-live/u.test(p.key)?'主播':p.role;
 const base=[`当前${p.name}表单其余字段均已载入已有有效记录A的值，仅修改“${name}”`];
 const submit=/搜索/u.test(name)?'点击“搜索”':/举报/u.test(p.name)?'点击“提交”':/申请/u.test(p.name)?'点击“提交”':/选择|房型|粉丝/u.test(p.name)?'点击“确认”':'点击“保存”';
 const put=(input,expect,label,dimension='输入边界')=>add(r,{label:`${p.name}的${name}${label}`,given:base,steps:[`打开${p.entry}`,input,submit],expected:expect,point:name,role,dimension});
 if(/必填|不能为空|必选/u.test(body)){
  if(/图片|照片|封面|头像|附件|文件/u.test(name))put(`删除“${name}”已选文件`,`不提交缺少${name}的记录`,'缺少文件');
  else if(/类型|原因|分类|性别|角色|权限|档位|目标|对象|房型|状态/u.test(name)||body.includes('必选'))put(`取消“${name}”的全部选择`,`不提交未选择${name}的记录`,'未选择');
  else{put(`清空“${name}”`,`不保存空${name}`,'留空');if(/去除首尾空格|不能为空/u.test(body))put(`输入${name}“   ”`,`不保存仅空格的${name}`,'仅空格');}
 }
 if(/正整数/u.test(body))for(const value of [-1,0,1,1.5])put(`输入${name}“${value}”`,value===1?`保存${name}为1`:`不保存${name}的非法值${value}`,`输入${value}`);
 else if(/非负整数/u.test(body))for(const value of [-1,0,1,0.5])put(`输入${name}“${value}”`,Number.isInteger(value)&&value>=0?`保存${name}为${value}`:`不保存${name}的非法值${value}`,`输入${value}`);
 const range=body.match(/(?:取值|范围(?:为)?|必须为)?\s*(\d+)\s*[-～~]\s*(\d+)\s*(?:个)?\s*(字符|位数字|个数字|位|%|金币)?/u);
 if(range){
  const low=Number(range[1]),high=Number(range[2]);
  const string=/数字|字符|密码|名称|昵称|备注|说明|账号/u.test(range[3]||'')||/密码|名称|昵称|备注|说明|账号/u.test(name);
  if(high<=1000)for(const v of numericValues(low,high)){
   if(v<0&&string)continue;
   const value=string?(/数字|密码|手机/u.test(name+body)?'1':'测').repeat(v):String(v);
   const ok=v>=low&&v<=high;
   put(`输入${name}“${value}”`,ok?string?`保存${name}为输入的${v}个字符`:`保存${name}为${v}`:`不保存超出${low}至${high}${string?'字符':'取值'}范围的${name}`,`${string?'长度':'取值'}${v}`);
  }
 }
 const length=body.match(/(?:最多|最长|不超过|最大(?:长度)?(?:为)?)\s*(\d+)\s*(?:个)?字符/u);
 if(length){const n=Number(length[1]);for(const len of [n-1,n,n+1]){const value='测'.repeat(len);put(`输入${name}“${value}”`,len<=n?`保存${name}为输入的${len}个字符`:`不保存长度超过${n}字符的${name}`,`长度${len}`);}}
 if(/不可重复|不能重复|唯一/u.test(body))put(`输入${name}为已有记录B使用的值`,`不保存与记录B重复的${name}`,'重复值');
 if(/去除首尾空格/u.test(body)&&!/数字/u.test(body))put(`输入${name}“  测试A  ”`,`保存${name}为“测试A”`,'去除首尾空格');
}
export default designs;
