import fs from 'node:fs/promises';
import path from 'node:path';
import {root,task,data,contexts,normalize} from './upstream-audit.mjs';
import {risks,additions} from './sync-decisions.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';
const edits=[], mappings=[], findings=[];
const riskRows=risks.map(([n,ends,module,topic,question,known,options,page])=>({id:`Q-${n}`,ends,module,topic,question,known,options:options.split('|'),page}));
let sortingNo=18;
const classify=(r)=>{
 let body=r.text.replace(/^【Q-[^】]+】/u,'');const comments=[];
 const risk=(id,detail)=>{comments.push(`风险 ${id}：${detail}`);};
 if(/排序.*待确认|排序依据待确认/u.test(body)){
  const existing=r.text.match(/^【(Q-\d+)/u)?.[1],id=existing||`Q-${String(sortingNo++).padStart(3,'0')}`;
  const clauses=body.split('；'),known=clauses.filter(s=>!/待确认/u.test(s)).join('；');
  if(!riskRows.some(x=>x.id===id))riskRows.push({id,ends:'用户App',module:r.heading.split(' · ')[0],topic:`${r.heading.split(' · ')[1]}排序`,question:`${r.heading.split(' · ')[1]}中未定义的排序及同值次序采用什么规则？`,known:body,options:['按业务发生时间倒序、同值按ID升序','按配置权重、同值按ID升序'],page:r.page});
  body=known; risk(id,'仅未定义的排序条件，已明确的数据范围、主排序和搜索行为仍有效');
 }
 if(/是否支持补签/u.test(body)){body='';risk('Q-010','补签支持范围');}
 if(/签到跨日及任务周期的时区/u.test(body)){body='';risk('Q-008','业务时区');risk('Q-009','任务停用后的领取资格');risk('Q-011','任务到期后的领取资格');risk('Q-038','每周任务起始日');}
 if(/等级规则待定/u.test(body)){body=body.split('；').filter(x=>!/等级规则待定/u.test(x)).join('；');risk('Q-003','主播等级成长值口径');}
 if(/收益和送礼贡献的具体计入范围/u.test(body)){body='';for(const id of ['Q-003','Q-035','Q-036'])risk(id,'等级成长、判级或追溯决定');}
 if(['REQ-PUB-8cd4c7bd73','REQ-USER-459c7142b5','REQ-USER-b2ffc117a9','REQ-USER-6ea46617d1'].includes(r.id)){
  body= r.id==='REQ-USER-6ea46617d1'?'财富等级展示服务端当前等级，无数据时不展示。':r.id==='REQ-PUB-8cd4c7bd73'?'昵称下方分别展示主播等级和财富等级；两类等级独立。':'财富等级展示账号当前等级。';risk('Q-003','成长值计入范围');
 }
 if(['REQ-USER-1a66c1910e','REQ-USER-16931b9ad7','REQ-USER-d3a718ef86','REQ-PUB-616b60ee08'].includes(r.id)){
  body=r.id==='REQ-PUB-616b60ee08'?'邀请奖励页展示已邀请人数和累计获得金币。':'';risk('Q-002','单次邀请金币和累计金额计算');
 }
 if(['REQ-ADMIN-fd038806ba','REQ-PUB-7de0f8289e'].includes(r.id)){body='平台可启停运营账号及锁定或解除公会管理权限。';risk('Q-005','资料编辑和重置密码');}
 if(r.id==='REQ-ADMIN-4402635424'){body='自定义道具类型四语名称必填且不可重复。';risk('Q-004','预置类型枚举');}
 if(r.id==='REQ-PUB-b2c9244b9a'){body='道具类型 Tab 分别展示对应类型的道具列表。';risk('Q-004','预置类型枚举');}
 if(r.id==='REQ-PUB-a2c0812133'){body='房间密码从直播设置打开，展示当前密码并支持修改。';risk('Q-001','直播中修改后的密码长度');}
 if(r.page.includes('live-room-host-password') && /4-12/u.test(body))risk('Q-001','只有直播中修改长度待确认；使用8位有效数字可验证独立的保存、取消及重新进房规则');
 if(['REQ-USER-962af3644b','REQ-PUB-53a4c32e6f'].includes(r.id)){
  body='直播权限满足时，开始直播进入开播设置；直播权限关闭时不能进入开播设置。';risk('Q-006','被拒绝的提示形式和文案');
 }
 if(['REQ-PUB-8a27e92b8f','REQ-USER-6228cc0479','REQ-USER-f92e8f3c2f'].includes(r.id)){
  body=body.replace(/显示“查询结果为空(?:或主播未在普通房直播)?”/gu,'展示无搜索结果状态');risk('Q-007','无结果提示的具体文案');
 }
 if(body.includes('道具奖励已进入背包')){body=body.replace('，道具奖励已进入背包，并分别生成资产记录','并生成资产记录');risk('Q-037','道具奖励是否属于本期任务');}
 body=body.replace('不能继续观看、评论、送礼或进入连麦','不能继续观看、评论或送礼');
 if(r.page==='views/live-data/month.html')body=body.replace('后续退款或冲正按平台财务口径更新','充值退款或拒付不改变已完成消费对应的主播收益和分成');
 // Explicit overview lock semantics override an unconditional AND of guild/platform toggles.
 if(/平台与公会直播权限均开启/u.test(body))body=body.replace('平台与公会直播权限均开启','最终直播权限开启（平台关闭时关闭；平台开启且未锁定时取公会设置，锁定开启时跟随平台；解锁恢复公会原设置）');
 return {body,comments};
};
for(const [i,context]of contexts.entries()){
 let updated=context.text; const model=data.models[i];
 for(const r of context.rows){
  const {body,comments}=classify(r),line=body?`- ${r.id}：${body}`:`- ${r.id}：本条业务决定见${comments.map(c=>c.match(/Q-\d+/u)[0]).join('、')}，不提供确定预期。`;
  const next=line+(comments.length?`\n  - ${comments.join('；')}。`:'');
  if(next!==r.raw){updated=updated.replace(r.raw,next);edits.push({文件:r.file,原文:r.raw,新文:next,原因:comments.length?'把未确认分支与已知规则分离':'依据当前原始证据撤销整条隔离或统一系统概要规则'});}
  const original=model.records.filter(s=>s.page===r.page&&normalize(s.text)===r.normalized);
  mappings.push({id:r.id,file:r.file,page:r.page,source:original.map(x=>x.id),text:body,comments});
 }
 for(const [key,page]of Object.entries(model.pages)){
  const needle=`原型：\`${page.file}\`；视图：\`${key}\`。`;
  let role=page.role;
  if(key==='group-manage-owner.html'||key==='views/fan-club/member-mute-confirm.html')role='主播';
  if(key==='host-center-pending.html')role='普通用户';
  if(key.startsWith('admin-system-'))role='超级管理员';
  const parent=model.pages[page.parent];
  const nav=key.startsWith('views/')?`${parent?.name||page.parent} → ${page.name}`:page.name;
  const value=`${needle}\n\n执行角色：${role}；页面入口：${nav}。其他角色按本节明确授权分别执行，不由通用角色名推定权限。`;
  if(updated.includes(needle)){updated=updated.replace(needle,value);edits.push({文件:context.file,原文:needle,新文:value,原因:'显式记录端侧角色和原型入口；群主、房管、普通申请人分离'});}
  const extra=additions.filter(a=>a[0]===key).map((a,index)=>`- REQ-EXT-${fingerprint([key,a[1]]).slice(0,10)}：${a[1]}（原型交互依据：${a[2]}）`);
  if(extra.length){updated=updated.replace(value,`${value}\n\n${extra.join('\n')}`);for(const raw of extra)edits.push({文件:context.file,原文:'',新文:raw,原因:'补入页面内嵌或共享交互中明确的原型行为，业务状态仍以概要及批注为准'});}
 }
 // Risk definitions are upstream context content before MainBasis is built.
 const relevant=riskRows.filter(r=>r.ends.split('、').includes(model.end));
 updated+=`\n## 需求缺口与局部冲突（本次独立复核）\n\n`+relevant.map(r=>`- GAP-${r.id}｜端：${r.ends}｜模块：${r.module}｜场景：${r.topic}｜待决策：${r.question}｜已知依据：${r.known}｜可选方案：${r.options.join(' / ')}｜关联原型：${r.page}`).join('\n')+'\n';
 await fs.writeFile(path.join(task,`context-${model.name}-proposed.md`),updated);
 findings.push({文件:context.file,行数:updated.split('\n').length});
}
await fs.writeFile(path.join(task,'sync-decisions.json'),JSON.stringify({edits,mappings,risks:riskRows,findings},null,2)+'\n');
console.log(JSON.stringify({edits:edits.length,riskCount:riskRows.length,findings}));
