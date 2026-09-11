import './accounts.mjs';
import './social.mjs';
import './guild-fans.mjs';
import './live.mjs';
import './commerce.mjs';
import './admin.mjs';
import './reports.mjs';
import './supplement.mjs';
import './entry-checks.mjs';
import './coverage-links.mjs';
import './last-review.mjs';
import './closing-design.mjs';
import {baseline,save} from './source.mjs';
import {scenes,dispositions} from './design.mjs';
if(process.argv[2]==='missing'){
 const used=new Set(scenes.flatMap(s=>s.refs));
 const missing=baseline.entries.filter(e=>e.status==='基准规则'&&!used.has(e.id)&&!/^场景/u.test(e.section));
 const group=process.argv[3];
 const subset=missing.filter(e=>!group||e.module.startsWith(group));
 console.log('total',scenes.length,'unmapped',missing.length,'selected',subset.length);
 for(const e of subset)console.log(e.id,e.section,e.text);
}
