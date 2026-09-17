import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {readAnnotations} from '../../scripts/evidence-discovery.mjs';
import {readModuleDirectory} from '../../scripts/prototype-directory.mjs';
import {fingerprint} from '../../scripts/requirement-traceability.mjs';

// Current-source transcription only. This does not design cases or approve coverage.
const task='work/liveshow-full-260916-001', project='liveshow-proto';
const start=JSON.parse(await fs.readFile(`${task}/basis/mainbasis-start.json`,'utf8'));
const directory=readModuleDirectory(await fs.readFile(`${project}/context/原型页面目录结构.md`,'utf8'));
const endNames={user:'用户App',guild:'公会App',admin:'管理后台'};
const names={user:'01-用户主播App-项目需求清单.md',guild:'02-公会App-项目需求清单.md',admin:'03-管理后台-项目需求清单.md'};
const changes=[
  {end:'user',page:'welfare-center.html',from:'4. 游客可浏览并进入邀请好友页；签到、领奖和充值操作跳转登录。运营账号不参与签到、任务及领奖，不展示相关入口。',to:'4. 游客可浏览并进入邀请好友页；签到、领奖和充值操作跳转登录。运营账号只可进入福利一级页，点击其中任意功能入口提示“运营账号无法操作”，不参与签到、任务及领奖。',basis:'系统概要3.7.4功能白名单'},
  {end:'user',page:'my-decoration.html',from:'6. 运营账号不可使用虚拟金币购买装扮，不展示装扮商城购买入口；已拥有装扮仍可查看和佩戴。虚拟金币仅可用于赠送普通礼物和定制礼物。',to:'6. 运营账号点击我的装扮入口提示“运营账号无法操作”，不得进入查看、佩戴或购买流程；虚拟金币仅可用于赠送普通礼物和定制礼物。',basis:'系统概要3.7.4功能白名单'},
  {end:'guild',page:'guild-host-detail.html',from:'1. 开播需同时满足账号可用、公会有效、主播认证通过、平台与公会直播权限均开启。',to:'1. 开播需账号可用、公会有效且主播认证通过。平台关闭时禁止开播；平台开启且锁定公会权限时，实际开播权限跟随平台开启；未锁定时平台和公会权限均开启才允许开播；解锁后恢复公会锁定前设置。',basis:'系统概要3.2直播权限优先级表'}
];
const unused=new Set(changes), atoms=[], files=[];
await fs.mkdir(`${task}/basis/context-draft`,{recursive:true});
for(const [end,endName] of Object.entries(endNames)){
  const source=`${project}/prototype/annotations/${end}.js`, text=await fs.readFile(source,'utf8');
  assert.equal(fingerprint(text),start.上游.find(x=>x.路径===source)['SHA-256'],'原型批注在本次读取期间变化');
  const annotations=readAnnotations(text), lines=[`# ${endName}项目需求清单`,'', '> 当前上游整理草稿，逐项语义核对完成前不作为正式 MainBasis。',`> 业务优先级：context/系统概要 .md 优先；当前原型页面及结构化批注补充；不采用旧用例。`,''];
  for(const [page,annotation]of Object.entries(annotations)){
    const owner=page.startsWith('views/')?page.split('/')[1]+'.html':page;
    const entry=directory.页面.find(x=>x.端名===endName&&path.basename(x.页面路径)===owner);
    lines.push(`## ${entry?.功能模块||'未登记页面：范围待确认'} / ${entry?.页面名称||owner}${page.startsWith('views/')?` / ${path.basename(page,'.html')}`:''}`,`来源：${source}；批注键：${page}`);
    if(entry) lines.push(`页面入口：${entry.页面路径}；同页视图不新增独立模块。`);
    else lines.push('范围说明：物理页面或批注存在，但当前查看器未登记，不据此推定正式入口。');
    for(const[sectionIndex,section]of annotation.sections.entries()){
      lines.push(`### ${section.t}`);
      for(const[lineIndex,raw]of section.d.entries()){
        const change=changes.find(x=>x.end===end&&x.page===page&&x.from===raw);
        if(change)unused.delete(change);
        const value=change?.to||raw, id=`SRC-${end.toUpperCase()}-${atoms.filter(x=>x.end===end).length+1}`;
        lines.push(value);
        atoms.push({id,end,page,module:entry?.功能模块||null,pageName:entry?.页面名称||owner,entry:entry?.页面路径||null,source,section:section.t,sectionIndex,lineIndex,raw,value,...(change?{裁定依据:change.basis}:{}),待复核:true});
      }
      lines.push('');
    }
  }
  const output=`${task}/basis/context-draft/${names[end]}`;
  await fs.writeFile(output,lines.join('\n')+'\n'); files.push({end,output});
}
assert.equal(unused.size,0,'人工裁定原文没有匹配，禁止静默跳过');
assert.equal(new Set(atoms.map(x=>x.id)).size,atoms.length);
assert(atoms.every(x=>x.raw&&x.value));
await fs.writeFile(`${task}/basis/source-atoms.json`,JSON.stringify({schemaVersion:'1.0',说明:'上游独立摘录，待复核不代表已覆盖；用例阶段不得读取本文件作为业务输入。',atoms,changes,files},null,2)+'\n');
console.log(JSON.stringify({状态:'仅生成当前来源整理草稿',原型页面:directory.页面.length,批注原文条目:atoms.length,明确裁定:changes.length}));
