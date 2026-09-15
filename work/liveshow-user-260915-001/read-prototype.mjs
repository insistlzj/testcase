import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const task='work/liveshow-user-260915-001';
const scan=JSON.parse(await fs.readFile(`${task}/global-evidence-scan-result.json`,'utf8'));
const sources=scan.文件清单.filter(f=>/\/prototype\/pages\/.*\.html$/.test(f.路径));
const texts=Object.fromEntries(await Promise.all(sources.map(async f=>[f.路径,await fs.readFile(f.路径,'utf8')])));
const result=spawnSync('/Users/geekonup/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',['scripts/parse-prototype-html.py'],{input:JSON.stringify(texts),encoding:'utf8',maxBuffer:30*1024*1024});
if(result.status!==0)throw new Error(result.stderr);
const controls=JSON.parse(result.stdout);
await fs.writeFile(`${task}/prototype-controls.json`,JSON.stringify(controls,null,2)+'\n');
const start=Number(process.argv[2]||0),count=Number(process.argv[3]||12);
for(const [file,items] of Object.entries(controls).filter(([f])=>f.includes('/pages/user/')).slice(start,start+count)){
 console.log(file);
 console.log([...new Set(items.map(c=>`${c.name.slice(0,80)}${c.attrs.onclick?' => '+c.attrs.onclick:''}${c.attrs.href?' => '+c.attrs.href:''}${c.attrs.maxlength?' 最大长度'+c.attrs.maxlength:''}`))].join('\n'));
}
