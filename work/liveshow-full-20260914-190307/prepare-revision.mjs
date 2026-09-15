import fs from 'node:fs/promises';
const original='work/liveshow-full-20260914-190307',revision=`${original}/basis-revision-2`;
for(const name of ['requirements-source-ledger.json','page-inventory.json','global-evidence-scan-result.json','user-annotation-atoms.json','guild-annotation-atoms.json','admin-annotation-atoms.json'])await fs.copyFile(`${original}/${name}`,`${revision}/${name}`,fs.constants.COPYFILE_EXCL);
const ledger=JSON.parse(await fs.readFile(`${revision}/requirements-source-ledger.json`,'utf8'));
const contexts=['01-用户主播App-项目需求清单.md','03-管理后台-项目需求清单.md'];
for(const name of contexts){const text=await fs.readFile(`liveshow-proto/context/${name}`,'utf8');
 for(const line of text.split('\n')){
  const m=line.match(/^- \[(PENDING-(?:profile-live-entry|badge-location|badge-auto|badge-wear))\] (.+?)：(.+?) 选项：(.+?)。影响端：(.+?)。依据：(.+?)。$/);if(!m||ledger.问题.some(q=>q.id===m[1]))continue;
  const [,id,scene,question,options,ends,atoms]=m;
  ledger.问题.push({id,module:id.includes('profile')?'个人中心':'运营管理',scene,question,options:options.split(/；[A-D]\. /).map(v=>v.replace(/^[A-D]\. /,'')),ends:ends.split('、'),atoms:atoms.split('、')});
 }
}
await fs.writeFile(`${revision}/requirements-source-ledger.json`,JSON.stringify(ledger,null,2)+'\n');
console.log({问题数:ledger.问题.length,说明:'仅复用本次刚完成的上游读取事实；未读取历史任务数据。'});
