import { discoverScenarios, hash, normalizeMeaning } from './evidence-discovery.mjs';
import { groupSources, mapCoverage } from './scenario-design.mjs';
import { splitAtomicResults } from './validate-testcase-json.mjs';

const action = /^(?:点击|选择|切换|输入|清空|取消|关闭|开启|确认|保存|退出|打开|进入|提交|发送|赠送|查看|恢复|返回|接受|拒绝|搜索|授权|删除|修改|上传|下载|刷新)/u;
const observable = /(?:进入|返回|停留|提示|不显示|显示|不展示|展示|隐藏|更新|写入|删除|清空|解除|退出|获得|失去|切换|移出|恢复|关闭|打开|调用|不保存|保存|回填|标记|发放|扣减|增加|刷新|形成|拒绝|拦截|不可|不能|不得|退款|不扣款|扣款|不计入|不改变|保持|保留|失效|有效|无效|允许|达到|排序|仅包含|只包含)/u;
const distinct = values => [...new Set(values)];
const annotationOnly = scene => scene.证据.length && scene.证据.every(source => source.路径.includes('/prototype/annotations/'));
const usableText = value => typeof value === 'string' && value.length <= 120 && splitAtomicResults(value).length === 1
  && !/待确认|相应|上述|等信息|等内容|等操作|根据实际|相关内容/u.test(value);

export function discoverScopeScenarios(catalog, pages) {
  const base = discoverScenarios(catalog, pages);
  const fields = new Map();
  for (const rule of catalog.规则) {
    if (!rule.字段 || !rule.来源.some(source => source.路径.includes('/prototype/annotations/'))) continue;
    if (/^(?:操作|场景|状态变化|条件|说明|结果|处理|交互|行为|规则|范围)$/u.test(rule.字段)) continue;
    for (const pageKey of rule.页面) {
      if (!pages[pageKey]) continue;
      const key = JSON.stringify([pageKey, rule.角色, rule.字段]);
      const current = fields.get(key);
      if (current) {
        current.规则标识.push(rule.规则标识);
        current.证据.push(...rule.来源.filter(source => source.路径.includes('/prototype/annotations/')));
        continue;
      }
      fields.set(key, {
        场景标识: `SC-${hash(['字段展示', pageKey, rule.角色, rule.字段]).slice(0, 14).toUpperCase()}`,
        规则标识: [rule.规则标识], 业务对象: rule.业务对象, 角色: rule.角色, 页面: [pageKey],
        场景类型: '字段存在', 条件: {}, 结果: `${pages[pageKey].name}显示“${rule.字段}”`, 维度: ['正常主流程', '可观察结果'],
        参数: { field: rule.字段 }, 证据: rule.来源.filter(source => source.路径.includes('/prototype/annotations/')),
        处理状态: '未覆盖', 生成状态: '待设计',
      });
    }
  }
  const scenes = [...base.场景.filter(scene => annotationOnly(scene)), ...fields.values()];
  const compound = scenes.find(scene => scene.处理状态 === '待确认' && /收益和送礼贡献的具体计入范围/u.test(String(scene.结果)));
  if (compound) {
    scenes.splice(scenes.indexOf(compound), 1, ...[
      '主播收益计入财富等级时应包含哪些收入类型？',
      '送礼贡献计入财富等级时应包含哪些消费类型？',
      '等级配置修改后应如何处理已有用户等级？',
    ].map((question, index) => ({ ...structuredClone(compound), 场景标识: `SC-${hash([compound.场景标识, index, question]).slice(0, 14).toUpperCase()}`, 结果: question })));
  }
  for (const scene of scenes) {
    scene.规则标识 = distinct(scene.规则标识);
    scene.证据 = [...new Map(scene.证据.map(source => [hash([source.路径, source.位置, source.原文]), source])).values()];
  }
  return { ...base, 场景: scenes };
}

function renderAction(scene, page) {
  const p = scene.参数;
  let pre = [...page.preconditions];
  let steps = [...page.steps];
  let result = String(scene.结果);
  let description;
  let point;
  let type = scene.维度.includes('输入边界') ? '逻辑校验' : '功能需求';

  if (scene.场景类型 === '字段存在') {
    const field = p.field;
    steps.push(`查看${field}`);
    description = `验证${page.name}可查看${field}`;
    point = `${field}展示`;
  } else if (scene.场景类型 === '状态转换') {
    const trigger = String(p.trigger || '').trim();
    if (!usableText(result) || !observable.test(result)) return null;
    if (action.test(trigger)) steps.push(trigger);
    else {
      if (!trigger || trigger.length > 60 || /或|任一/u.test(trigger)) return null;
      pre.push(trigger);
      steps.push(`刷新${page.name}`);
    }
    description = `验证${trigger}后的${page.name}状态`;
    point = `${page.name}状态`;
    type = /失败|拒绝|不足|不可|不能/u.test(`${trigger}${result}`) ? '异常用例' : '业务流程';
  } else if (scene.场景类型 === '条件结果' || scene.场景类型 === '条件展示') {
    const condition = String(p.condition || p.条件 || '').trim();
    if (!condition || condition.length > 80 || action.test(condition) || !usableText(result) || !observable.test(result)) return null;
    pre.push(condition);
    steps.push(`查看${page.name}`);
    description = `验证${condition}时的${page.name}结果`;
    point = `${page.name}条件结果`;
  } else if (scene.场景类型 === '数据筛选') {
    const field = p.字段 || page.name;
    if (!usableText(result)) return null;
    pre.push(`存在符合和不符合“${p.范围}”的记录`);
    steps.push(`查看${field}`);
    description = `验证${field}按指定范围筛选`;
    point = `${field}数据范围`;
    type = '逻辑校验';
  } else if (scene.场景类型 === '字段默认') {
    if (!usableText(result)) return null;
    steps.push(`查看${p.字段 || page.name}`);
    description = `验证${p.字段 || page.name}的默认状态`;
    point = `${p.字段 || page.name}默认值`;
  } else if (scene.场景类型 === '文本长度') {
    const value = p.value;
    if (!p.字段 || !Number.isInteger(value)) return null;
    steps.push(value ? `输入由${value}个“测”组成的${p.字段}` : `清空${p.字段}`);
    result = scene.结果 === '有效' ? `${p.字段}保留${value}个字符` : `${p.字段}不能保留${value}个字符`;
    description = `验证${p.字段}输入${value}个字符`;
    point = `${p.字段}长度边界`;
    type = scene.结果 === '有效' ? '逻辑校验' : '异常用例';
  } else if (scene.场景类型 === '输入范围') {
    if (!p.字段 || !Number.isFinite(p.value)) return null;
    steps.push(`输入${p.字段}${p.value}`);
    result = scene.结果 === '范围内' ? `${p.字段}接受数值${p.value}` : `${p.字段}不接受数值${p.value}`;
    description = `验证${p.字段}输入${p.value}`;
    point = `${p.字段}取值边界`;
    type = scene.结果 === '范围内' ? '逻辑校验' : '异常用例';
  } else return null;

  if (!usableText(result) || !steps.length) return null;
  return { pre: distinct(pre), steps: distinct(steps), result, description, point, type };
}

export function designScopeScenario(scene, pages) {
  const page = pages[scene.页面[0]];
  if (!page || !annotationOnly(scene)) return null;
  const design = renderAction(scene, page);
  if (!design) return null;
  const testcase = {
    序号: 0, 用例编号: '', 功能模块: page.module, 功能结构: `${page.name}（${scene.角色}视角）`, 用例类型: design.type,
    优先级: 'P2',
    用例描述: design.description, 验证用例子项: design.point.slice(0, 30), 前置条件: design.pre, 操作步骤: design.steps,
    预期结果: [design.result], 流程编号: '', 测试结果: '未测', 测试人员: '',
    备注: [...groupSources(scene.证据), `页面：${scene.页面.join('、')}`, `规则：${scene.规则标识.join('、')}`, `场景：${scene.场景标识}`, '未动态验证'],
  };
  scene.覆盖契约 = { 前置条件: design.pre.map(value => [value]), 操作步骤: design.steps.map(value => [value]), 预期结果: [[design.result]] };
  scene.生成状态 = '已设计';
  scene.设计 = testcase;
  return testcase;
}

export const mapScopeCoverage = mapCoverage;

const stateResult = /(?:待(?:公会|平台|人工)?(?:审核|终审|处理)|审核中|申请中|已(?:通过|驳回|拒绝|加入|退出|结束|完成|冻结|解冻|封禁|解散|停用|启用|开通|关闭)|未(?:申请|认证|处理)|失效|生效|冻结|解冻|封禁|解散|停用|启用|开通|关闭|加入公会|退出公会|获得主播身份|失去主播身份)/u;

const transitionValue = value => typeof value === 'string' ? value.trim() : '';
const transitionEnds = value => distinct((Array.isArray(value) ? value : value ? [value] : []).map(transitionValue).filter(Boolean));

function transitionCandidate(rule, pages, fallbackEnd, explicit) {
  const page = pages[rule.页面?.[0]];
  const target = transitionValue(explicit.目标状态);
  const action = transitionValue(explicit.触发动作);
  const source = transitionValue(explicit.来源状态);
  const operationEnd = transitionValue(explicit.操作端 || page?.endName || fallbackEnd);
  const observationEnds = transitionEnds(explicit.观察端 || operationEnd);
  const object = transitionValue(explicit.共同业务对象 || rule.共同业务对象 || rule.业务对象);
  const missing = [!object && '共同业务对象', !source && '来源状态', !action && '触发动作', !target && '目标状态',
    !operationEnd && '操作端', !observationEnds.length && '观察端'].filter(Boolean);
  const role = transitionValue(explicit.执行角色 || rule.执行角色 || rule.角色);
  const body = [object, source, action, target, operationEnd, role];
  return {
    状态转换标识: `ST-${hash(body).slice(0, 14).toUpperCase()}`,
    共同业务对象: object,
    来源状态: source,
    触发动作: action,
    执行角色: role,
    操作端: operationEnd,
    目标状态: target,
    观察端: observationEnds,
    分支类型: transitionValue(explicit.分支类型 || (/失败|驳回|拒绝|取消|异常/u.test(`${action}${target}`) ? '失败分支' : '正常分支')),
    失败分支: transitionEnds(explicit.失败分支),
    规则标识: [rule.规则标识],
    证据: rule.来源 || [],
    场景投影: [],
    建模状态: missing.length ? '待补状态' : '已确认',
    缺失字段: missing,
  };
}

function ruleTransitions(rule, pages, fallbackEnd) {
  const explicit = Array.isArray(rule.生命周期) ? rule.生命周期 : rule.生命周期 ? [rule.生命周期] : [];
  if (explicit.length) return explicit.map(item => transitionCandidate(rule, pages, fallbackEnd, item));
  const model = rule.模型 || {};
  if (model.类型 === '决策表' && model.列?.['处置前/后直播间状态']) {
    const [source, target] = model.列['处置前/后直播间状态'].split('→').map(transitionValue);
    return [transitionCandidate(rule, pages, fallbackEnd, { 来源状态: source, 触发动作: model.列.处置类型, 目标状态: target, 分支类型: '处置分支' })];
  }
  if (model.类型 !== '状态转换') return [];
  return (model.触发 || []).flatMap(action => (model.结果 || []).filter(result => stateResult.test(String(result))).map(target => transitionCandidate(rule, pages, fallbackEnd, {
    来源状态: model.来源状态 || rule.来源状态 || '', 触发动作: action, 目标状态: target,
  })));
}

function connected(transitions, initial, terminal) {
  const adjacency = new Map();
  for (const item of transitions) {
    if (!adjacency.has(item.来源状态)) adjacency.set(item.来源状态, new Set());
    adjacency.get(item.来源状态).add(item.目标状态);
  }
  const seen = new Set(initial), queue = [...initial];
  while (queue.length) for (const next of adjacency.get(queue.shift()) || []) if (!seen.has(next)) { seen.add(next); queue.push(next); }
  return transitions.every(item => seen.has(item.来源状态) && seen.has(item.目标状态)) && terminal.every(state => seen.has(state));
}

function orderTransitions(transitions, initial) {
  const depth = new Map(initial.map(state => [state, 0]));
  const queue = [...initial];
  while (queue.length) {
    const state = queue.shift();
    for (const item of transitions.filter(entry => entry.来源状态 === state)) {
      const next = (depth.get(state) || 0) + 1;
      if (!depth.has(item.目标状态) || depth.get(item.目标状态) > next) { depth.set(item.目标状态, next); queue.push(item.目标状态); }
    }
  }
  transitions.sort((a, b) => (depth.get(a.来源状态) ?? Number.MAX_SAFE_INTEGER) - (depth.get(b.来源状态) ?? Number.MAX_SAFE_INTEGER)
    || a.来源状态.localeCompare(b.来源状态, 'zh-CN') || a.目标状态.localeCompare(b.目标状态, 'zh-CN'));
  transitions.forEach(item => { item.步骤序号 = (depth.get(item.来源状态) ?? 0) + 1; });
}

export function buildStateTransitionBaseline(endModels) {
  const confirmed = [], pending = [];
  for (const model of endModels) {
    for (const rule of model.catalog.规则) {
      for (const item of ruleTransitions(rule, model.pages, model.endName)) {
      (item.建模状态 === '已确认' ? confirmed : pending).push(item);
      }
    }
  }
  const merged = new Map();
  for (const item of confirmed) {
    const current = merged.get(item.状态转换标识);
    if (!current) { merged.set(item.状态转换标识, structuredClone(item)); continue; }
    current.规则标识 = distinct([...current.规则标识, ...item.规则标识]);
    current.观察端 = distinct([...current.观察端, ...item.观察端]);
    current.证据 = [...new Map([...current.证据, ...item.证据].map(source => [hash([source.路径, source.位置, source.原文]), source])).values()];
  }
  const groups = new Map();
  for (const item of merged.values()) {
    if (!groups.has(item.共同业务对象)) groups.set(item.共同业务对象, []);
    groups.get(item.共同业务对象).push(item);
  }
  const flows = [...groups].map(([object, transitions]) => {
    const sources = new Set(transitions.map(item => item.来源状态));
    const targets = new Set(transitions.map(item => item.目标状态));
    const initial = [...sources].filter(state => !targets.has(state));
    const terminal = [...targets].filter(state => !sources.has(state));
    const ends = distinct(transitions.flatMap(item => [item.操作端, ...item.观察端]));
    const stateClosed = initial.length > 0 && terminal.length > 0 && connected(transitions, initial, terminal);
    const flowId = `FLOW-${hash(object).slice(0, 12).toUpperCase()}`;
    orderTransitions(transitions, initial);
    transitions.forEach(item => { item.流程编号 = flowId; });
    return { 流程编号: flowId, 共同业务对象: object, 初始状态: initial, 终态: terminal,
      状态集合: distinct(transitions.flatMap(item => [item.来源状态, item.目标状态])), 涉及端: ends,
      闭环状态: ends.length > 1 ? stateClosed ? '待场景投影' : '跨端状态未闭合' : '单端已建模', 状态转换: transitions };
  }).sort((a, b) => a.流程编号.localeCompare(b.流程编号));
  return { schemaVersion: '1.0', 建模方式: '当前业务规则 -> 业务对象状态转换 -> 目标端场景投影', 业务流程: flows,
    待补转换: pending, 统计: { 业务流程数: flows.length, 已确认转换数: confirmed.length, 待补转换数: pending.length,
      跨端闭环数: 0 } };
}

const transitionSceneMatch = (transition, scene) => scene.规则标识?.some(id => transition.规则标识.includes(id))
  && normalizeMeaning(scene.参数?.trigger || scene.参数?.处置 || scene.条件?.触发 || scene.条件?.处置 || '') === normalizeMeaning(transition.触发动作)
  && normalizeMeaning(scene.参数?.后续状态 || scene.参数?.effect || scene.结果 || '') === normalizeMeaning(transition.目标状态);

export function projectStateTransitions(library, baseline, endName, record = false) {
  for (const scene of library.场景) {
    let match;
    for (const flow of baseline.业务流程) {
      const transition = flow.状态转换.find(item => transitionSceneMatch(item, scene));
      if (transition) { match = { flow, transition }; break; }
    }
    if (!match || ![match.transition.操作端, ...match.transition.观察端].includes(endName)) continue;
    scene.流程编号 = match.flow.流程编号;
    scene.状态转换标识 = match.transition.状态转换标识;
    scene.流程阶段 = match.transition.步骤序号;
    if (scene.设计) {
      scene.设计.流程编号 = match.flow.流程编号;
      scene.设计.备注.push(`状态转换：${match.transition.状态转换标识}；${match.transition.来源状态} -> ${match.transition.目标状态}`);
    }
    if (record && !match.transition.场景投影.some(item => item.目标端 === endName && item.场景标识 === scene.场景标识)) match.transition.场景投影.push({ 目标端: endName, 场景标识: scene.场景标识 });
  }
  return library;
}

export function finalizeStateTransitionBaseline(baseline) {
  for (const flow of baseline.业务流程) {
    if (flow.闭环状态 !== '待场景投影') continue;
    const projected = flow.状态转换.every(item => distinct([item.操作端, ...item.观察端]).every(endName => item.场景投影.some(entry => entry.目标端 === endName)));
    flow.闭环状态 = projected ? '已闭环' : '跨端场景未闭环';
  }
  baseline.统计.跨端闭环数 = baseline.业务流程.filter(flow => flow.闭环状态 === '已闭环').length;
  return baseline;
}

export function validateStateTransitionBaseline(baseline, libraries = []) {
  const issues = [];
  if (baseline?.schemaVersion !== '1.0' || !Array.isArray(baseline.业务流程) || !Array.isArray(baseline.待补转换)) return ['状态转换基线结构不合法'];
  const flowIds = new Set(), transitionIds = new Set();
  for (const flow of baseline.业务流程) {
    if (!flow.流程编号 || flowIds.has(flow.流程编号)) issues.push(`流程编号缺失或重复：${flow.流程编号 || '(空)'}`);
    flowIds.add(flow.流程编号);
    if (!flow.共同业务对象 || !Array.isArray(flow.状态转换) || !flow.状态转换.length) issues.push(`${flow.流程编号}缺少共同业务对象或状态转换`);
    if (flow.共同业务对象 && flow.流程编号 !== `FLOW-${hash(flow.共同业务对象).slice(0, 12).toUpperCase()}`) issues.push(`${flow.流程编号}与共同业务对象不一致`);
    for (const item of flow.状态转换 || []) {
      if (!item.状态转换标识 || transitionIds.has(item.状态转换标识)) issues.push(`状态转换标识缺失或重复：${item.状态转换标识 || '(空)'}`);
      transitionIds.add(item.状态转换标识);
      if (item.建模状态 !== '已确认' || [item.来源状态, item.触发动作, item.执行角色, item.操作端, item.目标状态].some(value => !transitionValue(value)) || !item.观察端?.length || !item.证据?.length) issues.push(`${item.状态转换标识}不能作为已确认状态转换`);
      const expectedId = `ST-${hash([flow.共同业务对象, item.来源状态, item.触发动作, item.目标状态, item.操作端, item.执行角色]).slice(0, 14).toUpperCase()}`;
      if (item.共同业务对象 !== flow.共同业务对象 || item.流程编号 !== flow.流程编号 || item.状态转换标识 !== expectedId) issues.push(`${item.状态转换标识}与流程业务键不一致`);
      if (!Array.isArray(item.场景投影)) issues.push(`${item.状态转换标识}缺少场景投影清单`);
    }
    if (flow.闭环状态 === '已闭环') {
      if (flow.涉及端.length < 2 || !flow.初始状态.length || !flow.终态.length || !connected(flow.状态转换, flow.初始状态, flow.终态)) issues.push(`${flow.流程编号}的跨端闭环声明不成立`);
    }
  }
  for (const item of baseline.待补转换) if (item.建模状态 !== '待补状态' || !item.缺失字段?.length) issues.push(`${item.状态转换标识 || '(空)'}待补转换未声明缺失字段`);
  const availableEnds = new Set(libraries.map(item => item.endName));
  for (const flow of baseline.业务流程) for (const item of flow.状态转换) for (const projection of item.场景投影 || []) {
    if (!availableEnds.has(projection.目标端)) continue;
    const scene = libraries.find(entry => entry.endName === projection.目标端)?.library.场景.find(entry => entry.场景标识 === projection.场景标识);
    if (!scene || scene.状态转换标识 !== item.状态转换标识 || scene.流程编号 !== item.流程编号) issues.push(`${item.状态转换标识}缺少${projection.目标端}场景投影`);
    if (scene?.设计 && scene.设计.流程编号 !== item.流程编号) issues.push(`${scene.场景标识}的用例设计缺少流程编号`);
  }
  if (libraries.length > 1) for (const flow of baseline.业务流程.filter(item => item.闭环状态 === '已闭环')) for (const item of flow.状态转换) {
    for (const endName of distinct([item.操作端, ...item.观察端])) if (!item.场景投影.some(projection => projection.目标端 === endName)) issues.push(`${item.状态转换标识}缺少${endName}场景投影`);
  }
  return issues;
}
