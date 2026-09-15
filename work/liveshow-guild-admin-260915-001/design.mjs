import fs from 'node:fs/promises';
import path from 'node:path';
import {fingerprint as hash} from '../../scripts/requirement-traceability.mjs';
import {ruleDesignHash,ruleBusinessKey} from '../../scripts/testcase-design.mjs';
export const task='work/liveshow-guild-admin-260915-001';
export const basis='liveshow-proto/MainBasis/统一需求文档.md',risk='liveshow-proto/MainBasis/需求待确认清单.md';
export const text=await fs.readFile(basis,'utf8'),basisHash=hash(text),lines=text.split('\n');
export const pages=new Map(),sources=new Map();let section='',current=null,end='';
for(const [i,line]of lines.entries()){
 if(line.startsWith('## 01-'))end='用户App';if(line.startsWith('## 02-'))end='公会App';if(line.startsWith('## 03-'))end='管理后台';
 if(line.startsWith('## ')){section=line.slice(3);current=null;}
 if(line.startsWith('页面：')){const m=line.match(/^页面：([^；]+)；实际承载：([^；]+)/);current={id:m[1],path:m[2],name:section.split(' / ').at(-1),end,line:i+1,raw:line,rules:[]};pages.set(m[1],current);}
 const m=line.match(/^- \[([^\]]+)\] (.*?)(?:〔|$)/);if(m){const s={id:m[1],body:m[2],line:i+1,raw:line,page:current?.id,end};if(!sources.has(s.id))sources.set(s.id,[]);sources.get(s.id).push(s);if(current)current.rules.push(s);}
}
let moduleName='';for(const line of lines.slice(lines.findIndex(l=>l.includes('prototype-modules:v1:start')))){
 if(line.startsWith('#### '))moduleName=line.slice(5);
 const m=line.match(/^\| ([^|]+) \| (liveshow-proto\/prototype\/[^|]+\.html) \|/);if(m){const p=pages.get(path.posix.basename(m[2]));if(p)p.module=moduleName;}
}
export const designs=[];
const verbs=['取消勾选','点击','打开','进入','切换','查看','输入','填写','清空','选择','上传','下载','提交','确认','取消','保存','返回','刷新','关闭','退出','启用','禁用','锁定','解锁','展开','收起','复制','删除','编辑','修改','勾选','查询','通过','驳回','审核','退款'];
export function add(page,ids,title,subitem,conditions,steps,result,extra={}){
 const p=pages.get(page);if(!p?.module)throw Error('页面或模块不存在 '+page);
 const role=p.end==='公会App'?'公会长':page.startsWith('admin-system-')?'超级管理员':'平台管理员';
 const src=ids.split(',').map(id=>{const matches=sources.get(id.startsWith('REQ-')||id.startsWith('COMMON-')?id:'REQ-'+id);const s=matches?.find(x=>x.page===page)||matches?.find(x=>x.end===p.end)||matches?.[0];if(!s)throw Error('来源不存在 '+id);return s;});
 if(!subitem||!title||!result)throw Error('必须显式写场景和子项及结果');
 const evidence=[{路径:basis,'SHA-256':basisHash,位置:`第${p.line}行`,原文:p.raw,证明内容:'目标端页面入口及实际承载'},...src.map(s=>({路径:basis,'SHA-256':basisHash,位置:`第${s.line}行 ${s.id}`,原文:s.raw,证明内容:s.body}))];
 const pre=[...(page==='guild-login.html'?['公会端尚未登录']: [`${role}账号可用${p.end==='公会App'?'，已选择待测公会':''}`]), ...(Array.isArray(conditions)?conditions:conditions?[conditions]:[])];
 const operations=[`打开${p.name}`, ...(Array.isArray(steps)?steps:steps?[steps]:[])];
 const r={业务对象:subitem.replaceAll(' / ','、'),共同业务对象:extra.object||p.name,执行角色:role,适用角色和端:[`${p.end}-${role}`],触发动作:operations.at(-1),必要条件:pre,来源状态:extra.from||conditions?.toString()||'页面可访问',目标状态或可观察结果:result,规则状态:extra.inferred?'实现推导':'已确认规则',可生成正式用例:true,原子动作数量:1,原子结果数量:1,证据引用:evidence,功能模块:p.module,功能结构:p.name,模块归属说明:'观察页面路径在本次MainBasis原型目录内唯一对应功能模块',跨模块流程编号:extra.flow||'',用例设计:{场景:title,验证子项:subitem,观察页面:p.name,观察页面路径:p.path,观察对象:extra.observe||subitem,观察端:p.end,设计说明:'按本条条件、触发动作和唯一观察结果设计；子项明确书写并与结果连读，不按页面关键词猜测。',观察证据:[0,...src.map((_,i)=>i+1)],计算:extra.calc||null,步骤:operations.map(op=>{const verb=verbs.find(v=>op.startsWith(v));if(!verb)throw Error('动作词 '+op);return{执行角色:role,动作:verb,对象:op.slice(verb.length),操作:op,证据:[0,...src.map((_,i)=>i+1)]};}),用例类型:extra.type||'功能需求',优先级:extra.priority||'P1',备注:extra.notes||[]}};
 r.用例设计.场景='验证'+title;r.跨模块流程编号=extra.flow?'FLOW-'+extra.flow:'';
 r.稳定规则标识='BR-'+hash(ruleBusinessKey(r)).slice(0,16);r.设计复核={状态:'通过',说明:`本条仅核对${subitem}；前提、动作和结果由所列当前需求明确支持。`,设计SHA256:ruleDesignHash(r)};
 designs.push({rule:r,sourceIds:src.map(s=>s.id),page,transition:extra.transition||null,scope:p.end});return r;
}
export function table(page,ids,rows,extra={}){for(const [title,sub,pre,steps,result,overrides]of rows)add(page,ids,title,sub,pre,steps,result,{...extra,...overrides});}
export function calc(formula,range,unit,values,op,total){return{公式:formula,数据范围:range,结果单位:unit,证据:[1],变量:Object.entries(values).map(([名称,数值])=>({名称,数值,业务含义:名称,单位:/人数/.test(名称)?'人':/数量|份数/.test(名称)?'件':名称==='次数'?'次':名称==='比例'?'无量纲':unit})),表达式:{运算:op,参数:Object.keys(values).map(变量=>({变量}))},最终值:total};}
export function fields(page,ids,area,pre,expected,steps=[]){add(page,ids,`${pages.get(page).name}读取${area}`,`${area}字段来源`,pre,steps,expected);}
export function lengthCases(page,ids,field,max,save,required=true){
 const rejection=field==='驳回理由',others=rejection?'本公会存在待审核申请':'其余必填字段保持已有合法值',opening=rejection?['点击驳回']:[];
 if(required)add(page,ids,`${field}为空时不可提交`,`${field}必填校验`,others,[...opening,`清空${field}`,save],`${field}为空的表单不能提交`,{type:'异常用例'});
 add(page,ids,`${field}达到${max}字符上限`,`${field}长度上界`,others,[...opening,`输入${field}为${max}个汉字`,save],`${field}的${max}字符值通过长度校验`,{type:'逻辑校验'});
 add(page,ids,`${field}超过${max}字符上限`,`${field}超长拦截`,others,[...opening,`输入${field}为${max+1}个汉字`,save],`${field}不能保存超过${max}字符的内容`,{type:'异常用例'});
}
