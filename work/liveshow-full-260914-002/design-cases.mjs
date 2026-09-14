import fs from 'node:fs/promises';
import path from 'node:path';
import {root,task,formal,risk,hashes,units,pages,rules,overview,questions,clean,clauses} from './read-basis.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
import {splitAtomicResults,loadTestcaseLanguageRules} from '../../scripts/validate-testcase-json.mjs';
export const designs=[],dispositions=new Map(),unresolved=[];
export function add(r,{label,given=[],steps=[],expected,role=r.page.role,point,dimension='正常主流程',flow='',state='',next='',object,calc=null,sources=[]}){
 const p=r.page;const observation=expected.trim().replace(/[。；]+$/u,'');
 const login=role==='游客'?'当前设备为游客会话，未登录账号':/auth-|login/u.test(p.key)||/未登录|待注销/u.test(role)?`${role}处于${/password-reset/u.test(p.key)?'密码重置':'未登录'}页面可访问状态`:`当前执行账号具有${p.end}会话，身份为${role}；具体账号及权限变化按以下条件准备`;
 const prerequisites=[login,...given];
 const sourceIds=[r.标识,...sources.map(s=>s.标识)];
 const d={id:'SC-'+fingerprint([p.end,role,object||p.name,prerequisites,steps,observation]).slice(0,16),end:p.end,page:p.key,entry:p.entry,module:p.module,role,label:label||`${p.name}：${point||observation}`,point:point||p.name,prerequisites,steps,expected:observation,dimension,flow,state,next,object:object||p.name,calc,sourceIds,metaIds:p.meta.map(x=>x.标识)};
 designs.push(d);return d;
}
export const page=(key)=>{const p=pages.find(p=>p.key===key);if(!p)throw Error('unknown page '+key);return p;};
export const ref=(key,word)=>{const p=page(key);const r=p.rules.find(r=>r.text.includes(word));if(!r)throw Error('no source '+key+' '+word);return r;};
export function test(key,word,label,given,steps,expected,extra={}){return add(ref(key,word),{label,given,steps,expected,...extra});}
export function cover(r,ds,reason){dispositions.set(r.标识,{reason,designs:ds.map(d=>d.id)});}
const prepField=(field)=>/密码/u.test(field)?'Abc12345':/邮箱/u.test(field)?'qa.user@example.com':/手机/u.test(field)?'81234567890':/昵称|姓名|名称|标题|主题|备注|说明|公告|正文/u.test(field)?'测试A':/ID|账号/u.test(field)?'620100':/价格|金额/u.test(field)?'10':/数量|人数|份数|等级|排序/u.test(field)?'1':'测试A';
const actionLabels=['确认退出','恢复发言','取消房管','设为房管','申请好友','删除好友','取消关注','取消拉黑','加入粉丝团','退出粉丝团','移出成员','退出公会','开始直播','结束直播','发起连麦','取消邀请','接受邀请','拒绝邀请','取消禁言','全员禁言','单人禁言','解除禁言','关闭直播权限','开启直播权限','同意','驳回','通过','拒绝','撤销','拉黑','关注','禁言','踢出','清屏','转发','举报','点赞','领取','签到','去完成','购票','送礼','发送','保存','提交','确认','取消','关闭','返回','登录','注册','上传','下载','导出','搜索','查询','重置','删除','启用','停用','禁用','解锁','锁定'];
const inferSteps=(p,trigger)=>{
 const t=trigger.replace(/^(?:当前用户|用户|主播|观众|房管|公会长|平台管理员|管理员)/u,'').trim();
 if(/^(点击|选择|切换|打开|进入|关闭|返回|清空|删除|勾选|取消勾选|输入|长按|滑动|确认|提交|保存|取消|复制|下载|上传|发送|登录|刷新|查询)/u.test(t)&&t.length<75&&!/成功|失败|异常|不足|无效|不存在|未登录/u.test(t))return [`打开${p.entry}`,t.replace(/ ->.*/u,'')];
 const label=actionLabels.find(s=>t.includes(s));
 if(label)return [`打开${p.entry}`,`点击“${label}”`];
 return null;
};
// Explicitly authored branch designs are imported before the generic field/navigation drafting below.
export function draftRemaining(){
 for(const r of rules){if(dispositions.has(r.标识))continue;const p=r.page;const body=clean(r.text);const parts=clauses(body),all=[];
  if(/^(用户|管理员|平台管理员|公会长|主播|房管)(查看|管理|配置|维护|浏览|进入|处理|发起|创建|接收|选择|完成|申请|审核)/u.test(body)&&parts.length===1&&!/限制|不能|不得|最多|至少|成功|失败|上限/u.test(body)){
   unresolved.push({r:r.id,page:p.key,kind:'概述映射',text:body});continue;
  }
  let subject=body.match(/^([^：]{1,22})：/u)?.[1]||p.name;subject=subject.replaceAll(' / ','、');
  let previousTrigger='';
  for(const [i,original]of parts.entries()){
   let segment=original.replace(/^([^：]{1,22})：/u,'');let trigger='',result=segment;
   const arrow=segment.split(/\s*(?:->|→)\s*/u);
   if(arrow.length===2){trigger=arrow[0];result=arrow[1];previousTrigger=trigger;}
   const observable=/展示|显示|隐藏|回填|保留|不展示|不显示/u.test(result);
   if(!trigger&&observable&&!/后|成功|失败|校验|异常/u.test(result)){
    // Static/field observation drafts; semantic review must supply any needed data before acceptance.
    const displays=splitAtomicResults(result);for(const expected of displays){
     all.push(add(r,{label:`${p.name}中${subject}的可见内容`,point:subject,given:[`测试对象A属于本页明确的数据范围；其${subject}数据已按本条需求准备并记录原始值`],steps:[`打开${p.entry}`,`查看${subject}`],expected:expected.startsWith(subject)?expected:`${subject}${expected}`,dimension:'可观察结果'}));
    }continue;
   }
   if(trigger){
    const steps=inferSteps(p,trigger);if(steps){for(const expected of splitAtomicResults(result))all.push(add(r,{label:`${p.name}执行${trigger}后的${subject}`,point:subject,given:[`测试对象A的${subject}处于“${trigger}”适用的源状态`],steps,expected,dimension:/取消|关闭|返回/u.test(trigger)?'中断/取消':/失败|异常|不足|错误/u.test(trigger)?'异常/失败':'正常主流程'}));continue;}
   }
   unresolved.push({r:r.id,page:p.key,kind:'业务分支待设计',part:i,text:original,subject});
  }
  if(all.length)dispositions.set(r.标识,{reason:'已建立部分字段与明确操作路径草稿；剩余分支须逐条补齐',designs:all.map(d=>d.id)});
 }
}
if(process.argv[1]===import.meta.filename){
 draftRemaining();await fs.writeFile(path.join(task,'design-draft.json'),JSON.stringify({来源:hashes,设计:designs,未完成:unresolved,处理:[...dispositions]},null,2)+'\n');
 console.log(JSON.stringify({designs:designs.length,unresolved:unresolved.length,byKind:unresolved.reduce((o,r)=>(o[r.kind]=(o[r.kind]||0)+1,o),{})}));
}
