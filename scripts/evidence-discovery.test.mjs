import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { extractSourceRules, discoverScenarios, hash, verifyCoverageClaims, bindScenarioElements, verifyCaseContract } from './evidence-discovery.mjs';
import { designScenario, sourceContract, checkScenarioCase, mapCoverage } from './scenario-design.mjs';
import { collectLiveEvidence } from './liveshow-evidence.mjs';
import { spawnSync } from 'node:child_process';
import { validateDiscovery } from './validate-discovery.mjs';

const pages = { 'rank.html': { name: '贡献榜', object: '本场贡献榜', role: '观众', steps: ['打开本场贡献榜'], preconditions: ['观众已登录'] },
  'invite.html': { name: '连麦邀请', object: '连麦邀请', role: '主播', steps: ['打开待处理邀请列表'], preconditions: ['主播正在直播'] },
  'fan.html': { name: '粉丝团', object: '粉丝团关系', role: '观众', steps: ['打开粉丝团'], preconditions: ['观众已加入粉丝团'] } };
function discover(rows) {
  const document = { path: 'project/annotations.js', sha256: hash(rows), priority: 2, entries: rows.map(([page, text], i) => ({ page, text, section: '业务', position: `row ${i}` })) };
  const rules = extractSourceRules([document], pages);
  const scenarios = discoverScenarios(rules, pages);
  const byId = new Map(rules.规则.map(r => [r.规则标识, r]));
  scenarios.场景.forEach(s => designScenario(s, pages, byId));
  return { rules, scenarios: scenarios.场景 };
}

test('源规则改变名额和排序键，场景自动改变；不读取任何用例', () => {
  const rows = [['rank.html', '依次按本场贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序'],
    ['rank.html', '第 9 名与第 10 名贡献值相同时，继续按后续条件确定顺序']];
  const before = discover(rows), after = discover([rows[0], ['rank.html', rows[1][1].replace('9 名与第 10', '19 名与第 20')]]);
  assert.equal(before.scenarios.filter(s => s.场景类型 === '排序优先级').length, 4);
  assert.equal(before.scenarios.find(s => s.场景类型 === '排名截断同分').参数.limit, 9);
  assert.equal(after.scenarios.find(s => s.场景类型 === '排名截断同分').参数.limit, 19);
  assert.notEqual(hash(before.scenarios), hash(after.scenarios));
});

test('从因果原文提取邀请失效、重复事件及清理结果，无固定场景清单', () => {
  const found = discover([
    ['invite.html', '任一方结束直播、变更为受限房型或进入连麦 -> 不再满足的邀请失效'],
    ['invite.html', '新增邀请更新当前提示，不重复叠加'],
    ['fan.html', '主动退出、被主播移出或账号拉黑 -> 团籍和群籍同时解除，粉丝等级与亲密度清零'],
  ]);
  assert.equal(found.scenarios.filter(s => s.场景类型 === '状态转换' && s.业务对象 === '连麦邀请').length, 3);
  assert.ok(found.scenarios.some(s => s.场景类型 === '重复事件'));
  assert.ok(found.scenarios.some(s => s.参数.trigger === '主动退出' && s.结果 === '亲密度清零'));
  const changed = discover([['fan.html', '主动退出 -> 积分和余额清零']]);
  assert.deepEqual(changed.scenarios.map(s => s.结果), ['积分清零', '余额清零']);
});

test('门禁拒绝仅有场景编号、缺失断言、错误条件和无依据的不适用', () => {
  const { scenarios: all } = discover([['fan.html', '主动退出 -> 粉丝等级与亲密度清零'], ['fan.html','重新加入从 0 开始，不恢复历史等级和亲密度']]);
  const scenarios=all.filter(s=>s.设计);
  const cases = scenarios.map((s, i) => ({...s.设计, 序号: i + 1, 用例编号: `LIVE-${i + 1}`}));
  const claims = mapCoverage(scenarios, cases);
  assert.deepEqual(verifyCoverageClaims(scenarios, cases, claims), []);
  const bad = structuredClone(cases); bad[1].预期结果 = ['粉丝等级显示0'];
  const forged = structuredClone(claims); forged[1].用例SHA256 = hash(bad[1]);
  assert.ok(verifyCoverageClaims(scenarios, bad, forged).some(x => x.includes('预期结果缺少')));
  forged[0].状态 = '不适用';
  assert.ok(verifyCoverageClaims(scenarios, cases, forged).some(x => x.includes('不适用没有直接依据')));
});

test('未理解的原文保留为待建模，不能因关键词未命中自动不适用', () => {
  const result = discover([['fan.html', '关系结算采用新版本口径']]);
  assert.equal(result.rules.规则[0].模型.类型, '条款待建模');
  assert.equal(result.scenarios.length,0);
  assert.equal(result.rules.规则[0].建模状态,'生成待复核');
});

test('不同输入范围自动产生边界值；不借用固定4-12提示',()=>{
  const result=discover([['fan.html','| 密码 | 必填，必须为 6-8 个数字。 |']]);
  assert.deepEqual(result.scenarios.filter(s=>s.场景类型==='输入范围').map(s=>s.参数.value),[5,6,8,9]);
  assert.ok(result.scenarios.some(s=>s.场景类型==='必填输入'));
});

test('排序覆盖必须有区分顺序的数据和方向，篡改断言并重算哈希仍拒绝',()=>{
  const {scenarios}=discover([['rank.html','依次按贡献、粉丝等级从高到低排序，仍相同时按用户 ID 从小到大排序']]);
  const cases=scenarios.map((s,i)=>({...s.设计,用例编号:`LIVE-${i}`}));
  const claims=mapCoverage(scenarios,cases);
  assert.equal(claims.filter(c=>c.状态==='已覆盖').length,3);
  const changed=structuredClone(cases);changed[1].前置条件=['观众已登录','多人存在同分'];
  const forged=structuredClone(claims);forged[1].用例SHA256=hash(changed[1]);
  assert.ok(verifyCoverageClaims(scenarios,changed,forged).length);
  changed[0]=structuredClone(cases[0]);changed[0].预期结果=['用户B排在用户A之前'];forged[0].用例SHA256=hash(changed[0]);
  assert.ok(verifyCoverageClaims(scenarios,changed,forged).length);
});

test('真实发现产物：重算哈希仍拒绝伪造断言、错挂关联、无来源用例和删减条款',async(t)=>{
  const root=path.resolve(import.meta.dirname,'..'), original='work/liveshow-user-live-discovery-260910-006';
  if(!(await fs.stat(path.join(root,original,'coverage-after.json')).catch(()=>null)))return t.skip('尚未生成直播发现产物');
  const directory=await fs.mkdtemp(path.join(root,'work/discovery-gate-test-'));
  const read=async n=>JSON.parse(await fs.readFile(path.join(directory,n),'utf8'));
  const save=async(n,v)=>fs.writeFile(path.join(directory,n),JSON.stringify(v,null,2)+'\n');
  try{
    for(const n of (await fs.readdir(path.join(root,original))).filter(n=>n.endsWith('.json')))await fs.copyFile(path.join(root,original,n),path.join(directory,n));
    const manifest=await read('generation-input-manifest.json');
    const relative=path.relative(root,directory);
    manifest.任务工作目录=relative;
    manifest.输入文件.forEach(e=>{if(e.路径.startsWith(original+'/'))e.路径=relative+e.路径.slice(original.length);});
    const rehash=async()=>{for(const e of manifest.输入文件)e['SHA-256']=hash(await fs.readFile(path.join(root,e.路径)));await save('generation-input-manifest.json',manifest);};
    await rehash();
    try { await validateDiscovery(directory,root); }
    catch (error) { if (/项目清单已变化/u.test(error.message)) return t.skip('旧发现产物已被当前项目指纹变更正常失效'); throw error; }
    const library=await read('test-scenario-library.json'), coverage=await read('coverage-after.json'), candidate=await read('current-testcase-candidate.json');
    const scene=library.场景.find(s=>s.场景类型==='排序优先级'), claim=coverage.记录.find(c=>c.场景标识===scene.场景标识);
    const dimensions=await read('coverage-dimensions.json'), forgedDimensions=structuredClone(dimensions);
    const unrelated=forgedDimensions.规则.flatMap(r=>r.判断).find(d=>d.状态!=='已覆盖'&&!d.场景.length);
    unrelated.状态='已覆盖';unrelated.场景=[scene.场景标识];
    await save('coverage-dimensions.json',forgedDimensions);await rehash();
    await assert.rejects(validateDiscovery(directory,root),/维度声明与实际规则/u);
    await save('coverage-dimensions.json',dimensions);
    const elements=await read('page-element-coverage.json'), forgedElements=structuredClone(elements);
    forgedElements.元素[0].状态='已覆盖';forgedElements.元素[0].场景=[scene.场景标识];
    await save('page-element-coverage.json',forgedElements);await rehash();
    await assert.rejects(validateDiscovery(directory,root),/元素声明与具体页面/u);
    await save('page-element-coverage.json',elements);
    const report=await read('coverage-change-report.json');
    await save('coverage-change-report.json',{...report,仍未覆盖场景:0});await rehash();
    await assert.rejects(validateDiscovery(directory,root),/覆盖统计与实际证据不一致/u);
    await save('coverage-change-report.json',report);
    const extra=structuredClone(candidate);
    extra.测试用例.push({...extra.测试用例[0],序号:extra.测试用例.length+1,用例编号:'LIVE-0999',预期结果:['当前入口显示未开启']});
    await save('current-testcase-candidate.json',extra);await save(manifest.最终JSON,extra);await rehash();
    await assert.rejects(validateDiscovery(directory,root),/既无场景覆盖证明/u);
    await save('current-testcase-candidate.json',candidate);await save(manifest.最终JSON,candidate);
    const selected=candidate.测试用例.find(c=>c.用例编号===claim.用例编号);
    selected.前置条件=['主播正在直播','多名用户有并列数据'];
    coverage.记录.filter(c=>c.用例编号===selected.用例编号).forEach(c=>c.用例SHA256=hash(selected));
    await save('coverage-after.json',coverage);await save('current-testcase-candidate.json',candidate);await save(manifest.最终JSON,candidate);await rehash();
    await assert.rejects(validateDiscovery(directory,root),/前置条件缺少/u);
    const documents=await read('source-documents.json');documents[0].entries.pop();await save('source-documents.json',documents);await rehash();
    await assert.rejects(validateDiscovery(directory,root,{phase:'pre-generate'}),/原始文档条款或入口提取不完整/u);
  }finally{await fs.rm(directory,{recursive:true,force:true});}
});

test('表格保留列含义；引用文案中的及时不变成条件；笼统业务约束不算建模完成',()=>{
  const {rules,scenarios}=discover([
    ['fan.html','标题“开启通知”；正文“开启后，你可以及时收到消息。”；按钮“开启通知”'],
    ['fan.html','| 平台开播 | 公会开播 | 结果 |'],['fan.html','| --- | --- | --- |'],['fan.html','| 关闭 | 开启 | 禁止开播 |'],
    ['fan.html','历史数据保持原有统计口径']]);
  assert.equal(scenarios.filter(s=>JSON.stringify(s.条件).includes('及时')).length,0);
  const row=rules.规则.find(r=>r.模型.类型==='决策表');
  assert.deepEqual(row.模型.列,{'平台开播':'关闭','公会开播':'开启','结果':'禁止开播'});
  assert.equal(rules.规则.find(r=>r.条款.includes('历史数据')).建模状态,'生成待复核');
});

test('合法换行结束标签不合并按钮；同名弹窗按钮不得靠页面名绑定',()=>{
  const parsed=spawnSync('python3',[path.join(import.meta.dirname,'parse-prototype-html.py')],{input:JSON.stringify({'page.html':'<button data-tab="hot">热门</button\n><button data-tab="new">新人</button><section id="a"><button>确认</button></section><section id="b"><button>确认</button></section>'}),encoding:'utf8'});
  assert.equal(parsed.status,0);const controls=JSON.parse(parsed.stdout)['page.html'];
  assert.deepEqual(controls.map(c=>c.name),['热门','新人','确认','确认']);
  const localPages={p:{file:'page.html',selectors:[]}};
  const elements=controls.map((c,i)=>({元素标识:`E${i}`,文件:'page.html',名称:c.name,定位:`#${i}`}));
  const s={页面:['p'],条件:{},结果:'关闭弹窗',参数:{trigger:'点击确认'}};
  bindScenarioElements([s],localPages,elements);assert.equal(s.元素证据.length,0);
});

test('真实原型：热门/新人分离；通知归属不受虚拟页遍历顺序影响；合成契约允许等价措辞但拒绝相反断言',async()=>{
  const root=path.resolve(import.meta.dirname,'..'),e=await collectLiveEvidence(root);
  assert.equal(e.pages['views/live-room/host-profile.html'].role,'观众');
  const controls=e.elements.filter(e=>/live-plaza.html$/u.test(e.文件));
  assert.ok(controls.some(c=>c.名称==='热门'));assert.ok(controls.some(c=>c.名称==='新人'));
  assert.equal(controls.find(c=>c.定位==='#notificationLater').页面,'live-plaza.html');
  const rules=extractSourceRules(e.documents,e.pages),l=discoverScenarios(rules,e.pages),byId=new Map(rules.规则.map(r=>[r.规则标识,r]));
  l.场景.forEach(s=>{designScenario(s,e.pages,byId);sourceContract(s,e.pages)});
  bindScenarioElements(l.场景,e.pages,e.elements);
  const reordered=structuredClone(l.场景);bindScenarioElements(reordered,Object.fromEntries(Object.entries(e.pages).reverse()),e.elements);
  assert.deepEqual(reordered,l.场景);
  // Synthetic verifier inputs: no dependency on archived task output or its business design.
  for(const [expected,paraphrase] of [['显示系统通知授权弹窗','页面显示系统通知授权弹窗'],['显示新人列表','页面显示新人列表']]) {
    const contract={预期结果:[[expected]]}, candidate={预期结果:[paraphrase]};
    assert.deepEqual(verifyCaseContract(contract,candidate),[]);
    assert.ok(verifyCaseContract(contract,{预期结果:['不'+expected]}).length);
  }
  assert.ok(verifyCaseContract({预期结果:[['显示系统通知授权弹窗']]},{预期结果:['不显示系统通知授权弹窗']}).length);
});
