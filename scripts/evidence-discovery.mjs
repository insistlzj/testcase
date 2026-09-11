import crypto from 'node:crypto';
import vm from 'node:vm';
import { checkScenarioCase } from './scenario-design.mjs';

export const DISCOVERY_VERSION = '3.1';
export const DIMENSIONS = ['正常主流程', '用户角色', '前置状态', '输入边界', '异常/失败', '中断/取消', '重试/恢复', '重复操作', '权限差异', '状态切换', '数据一致性', '重新进入/刷新状态保持', '接口成功但页面状态异常', '页面成功但后端状态未更新', '可观察结果'];
export const hash = value => crypto.createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
const id = (prefix, body) => `${prefix}-${hash(body).slice(0, 14).toUpperCase()}`;
const clean = s => s.replace(/^\s*(?:[-*]\s+|\d+\.\s*)/u, '').replace(/\*\*|<br\s*\/?\s*>/gu, '').replace(/\\([.\-])/gu,'$1').replace(/[。；\s]+$/u, '').trim();
const distinct = xs => [...new Set(xs)];

export const normalizeMeaning = value => String(value).normalize('NFKC').replace(/[“”"'\s，。、：:；;（）()]/gu,'')
  .replace(/切换至|切换到/gu,'切换').replace(/页面显示|模拟(?=系统.*弹窗)/gu,'显示').replace(/^页面(?=进入)/u,'')
  .replace(/通知授权说明|通知说明弹窗|通知说明/gu,'通知说明').replace(/普通用户|用户账号/gu,'用户')
  .replace(/当前封面|直播封面/gu,'封面');
const actionVerb = '(?:点击|选择|切换|输入|清空|取消|关闭|开启|确认|保存|退出|打开|进入|提交|发送|赠送|查看|恢复|返回|接受|拒绝|搜索|授权|删除|修改|重新加入|重新进入)';
const withoutQuotes = text => text.replace(/“[^”]*”|"[^"]*"/gu,m=>' '.repeat(m.length));

function tableRows(entries) {
  const tables = new Map();
  for (let i=0;i<entries.length;i++) if (/^\|\s*:?-+/u.test(entries[i].text)) {
    const header=entries[i-1];
    if(!header?.text.startsWith('|'))continue;
    const columns=header.text.split('|').slice(1,-1).map(clean);
    tables.set(i-1,{header:true});tables.set(i,{header:true});
    for(let j=i+1;j<entries.length&&entries[j].text.startsWith('|')&&entries[j].section===header.section;j++)tables.set(j,{columns});
  }
  return tables;
}

export function splitClauses(body) {
  const rows = []; let start = 0, quoted = false;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '“') quoted = true;
    if (body[i] === '”') quoted = false;
    if (!quoted && /[。；]/u.test(body[i])) { const part = clean(body.slice(start, i)); if (part) rows.push(part); start = i + 1; }
  }
  const tail = clean(body.slice(start)); if (tail) rows.push(tail);
  return rows;
}

export function readAnnotations(source) {
  const box = { window: {} };
  vm.runInNewContext(source, box, { timeout: 1500 });
  return box.window.PROTO_ANNOTATIONS;
}

// Discovery accepts current source documents only. Neither cases nor historical
// catalogues are accepted here; this boundary is exercised by regression tests.
export function extractSourceRules(documents, pages) {
  const rules = new Map();
  const units = [];
  for (const doc of documents) {
    const tables = tableRows(doc.entries);
    for (const [entryIndex,entry] of doc.entries.entries()) {
      const page = pages[entry.page];
      if (!page) continue;
      const raw = entry.text;
      if (tables.get(entryIndex)?.header) continue;
      const table = raw.startsWith('|') ? raw.split('|').slice(1, -1).map(x => x.trim()) : null;
      const field = table?.[0] || '';
      const columns=tables.get(entryIndex)?.columns;
      const matrix=table&&table.length>2&&columns;
      const body = clean(matrix ? table.map((v,i)=>`${columns[i]}：${v}`).join('；') : entry.semanticText || (table ? table.slice(1).join('；') : raw));
      const source = { 路径: doc.path, SHA256: doc.sha256, 位置: entry.position, 原文: raw, 页面: entry.page };
      const unit = { 单元标识: id('SRC', [doc.path, entry.position, raw]), 页面: entry.page, 类型: entry.section, 字段: field, 原文: raw, 来源: source, 规则: [] };
      units.push(unit);
      if (/场景描述|^场景$/u.test(entry.section)) { unit.去向 = '入口上下文'; continue; }
      // A semicolon/sentence is an evidence clause, NOT automatically a testcase.
      // Do not split conjunctions: condition lists and field groups stay intact.
      const clauses = matrix ? [body] : splitClauses(body);
      const inheritedTrigger = entry.semanticText?.match(/^([^。；]+?)\s*->/u)?.[1];
      for (const clause of clauses) {
        const key = [page.role, page.object, field, clause.replace(/\s+/gu, '')];
        const ruleId = id('BR', key);
        let rule = rules.get(ruleId);
        if (!rule) {
          rule = { 规则标识: ruleId, 业务对象: page.object, 角色: page.role, 页面: [], 字段: field, 条款: clause,
            上下文: body, 章节:entry.section, 决策表:matrix?Object.fromEntries(columns.map((c,i)=>[c,clean(table[i]||'')])):null,
            继承触发: inheritedTrigger || '', 来源级别: doc.priority || 2, 规则类型: doc.kind === 'implementation' ? '实现推导' : '已确认规则', 来源: [], 单元: [], 模型: null };
          rules.set(ruleId, rule);
        }
        rule.页面 = distinct([...rule.页面, entry.page]);
        rule.来源.push(source);
        rule.单元.push(unit.单元标识);
        unit.规则.push(ruleId);
      }
      unit.去向 = '已提取条款，按模型状态复核';
    }
  }
  for (const rule of rules.values()) rule.模型 = parseRule(rule, [...rules.values()]);
  const conflicts = [];
  const invitationGroups = [...rules.values()].filter(r => /邀请/u.test(r.业务对象));
  const stronger = invitationGroups.find(r => r.来源级别 === 1 && /其他邀请保留/u.test(r.条款));
  if (stronger) {
    for (const lower of invitationGroups.filter(r => r.来源级别 > stronger.来源级别 && /其他邀请失效/u.test(r.条款))) {
      lower.被替代规则 = stronger.规则标识;
      conflicts.push({ 主题: '接受邀请后其他邀请的状态', 采用: stronger.规则标识, 被覆盖: lower.规则标识, 依据: '项目来源策略中系统概要优先', 采用原文: stronger.条款, 冲突原文: lower.条款 });
    }
  }
  const unresolved=new Set(['条款待建模','业务约束','数据定义','输入约束','配置来源','操作入口']);
  for (const rule of rules.values()) {
    const m=rule.模型;
    rule.建模状态=unresolved.has(m.类型)||(m.类型==='权限约束'&&!m.条件)?'生成待复核':
      ['界面文案','上下文说明','原型实现说明'].includes(m.类型)?'说明性证据':'已结构化';
    rule.建模说明=rule.建模状态==='生成待复核'?'已保留原文及上下文，尚无完整的条件、动作和结果模型；不计已完成建模':
      rule.建模状态==='说明性证据'?'保留为相关业务的文案或上下文依据，不单独计作业务分支':'结构化表达已建立；是否可执行、是否覆盖另行验证';
  }
  return { schemaVersion: DISCOVERY_VERSION, 规则: [...rules.values()], 证据单元: units, 来源冲突处理: conflicts };
}

function alternatives(text) {
  // Restore the subject and verb shared by explicit alternative actions.
  // Conjunctions are kept together; this is not a Cartesian product.
  const sharedSubject = text.match(/^(平台|公会|主播|房管|用户)或(平台|公会|主播|房管|用户)(.+)$/u);
  if (sharedSubject) return [`${sharedSubject[1]}${sharedSubject[3]}`, `${sharedSubject[2]}${sharedSubject[3]}`];
  if (!/或/u.test(text)) return [text];
  const parts=text.split(/、|或/u).filter(Boolean);
  const first=parts[0].match(new RegExp(`^(.*?)(${actionVerb})(.+)$`,'u'));
  const subject=parts[0].match(/^(任一方|游客|用户|主播|观众|运营账号)/u)?.[1]||'';
  let verb=first?.[2]||'';
  return parts.map((part,i)=>{
    if(!i)return part;
    const explicit=part.match(new RegExp(`^(${actionVerb})`,'u'));
    if(explicit)verb=explicit[1];
    const selfContained=/^(?:被|账号|平台|公会|主播|用户|观众|任一方)/u.test(part);
    return selfContained?part:`${subject}${explicit||/^(?:进入|变更|结束)/u.test(part)?'':verb}${part}`;
  });
}

export function effectParts(text) {
  const parts = text.split(/，|,/u).flatMap(part => {
    const m = part.match(/^(.+?)(?:同时)?(解除|清零)$/u);
    if (m) return m[1].replace(/同时$/u, '').split(/和|与|、/u).map(field => `${field}${m[2]}`);
    // Split a conjunction only when the right side starts another observable predicate.
    return part.split(/(?:并|且)(?=提示|显示|移除|更新|关闭|返回|进入|恢复|开放|生成|保留)/u);
  }).map(clean).filter(Boolean);
  return parts;
}

export function parseRule(rule, allRules = []) {
  const t = rule.条款;
  let m;
  if(rule.决策表)return {类型:'决策表',字段:rule.字段,列:rule.决策表};
  if(/^(?:标题|正文|按钮)[：“]|^(?:标题|正文|按钮)$/u.test(rule.字段)||/^(?:标题|正文|按钮)[：“]/u.test(t))return {类型:'界面文案',字段:rule.字段,结果:t};
  if(/^[-\\*\s]*$|^同上$|^.+：$/u.test(t))return {类型:'上下文说明',原因:'章节提示、空表格占位或引用，保留上下文，不作为独立业务分支'};
  if(/演示固定|模拟手机|固定高度|像素|毛玻璃|轻动效|素材由客户提供/u.test(t))return {类型:'原型实现说明',结果:t};
  if (/一期不做[，,]二期落地/u.test(t)) return {类型:'排除范围',原文:t,依据:'来源明确排除本期范围'};
  if (/待确认|尚未定义|未明确/u.test(t)) {
    const question=/明细列表的?排序依据待确认/u.test(t)?'直播数据明细列表采用哪种排序规则？':/敏感词/u.test(rule.上下文)&&/命中后/u.test(t)?'敏感词命中后，消息应如何处理？':t;
    return { 类型: '需求缺口', 问题: question };
  }
  if(/新版本口径/u.test(t)&&!/[:：=]/u.test(t))return {类型:'条款待建模',原因:'版本或计算口径尚未解析，不以关键词命中认定完成'};
  if (rule.继承触发 && !t.includes('->')) return { 类型: '状态转换', 触发: alternatives(rule.继承触发), 结果: effectParts(t), 显式因果: true };
  if((m=t.match(/(?:^|，)([^=，]+?)\s*=\s*(.+)$/u)))return {类型:'计算公式',字段:clean(m[1]),表达式:clean(m[2]),结果:t};
  if((m=t.match(/最多\s*(\d+)\s*个字符/u)))return {类型:'文本长度',字段:rule.字段,最大:Number(m[1]),必填:/必填|必选/u.test(rule.上下文),可空:/选填|可为空|非必填/u.test(rule.上下文)};
  if((m=t.match(/(?:最多(?:设置|主动发送)?|达到|只能存在|上限|满)\s*(\d+)\s*(?:名|人|个|条)(?:上限)?/u)))return {类型:'数量上限',字段:rule.字段||rule.业务对象,上限:Number(m[1]),结果:t};
  if((m=t.match(/^(.+?)停留\s*(\d+)\s*秒/u)))return {类型:'时间约束',对象:m[1],秒:Number(m[2]),结果:t};
  if ((m = t.match(/依次按(.+?)从高到低排序，仍相同时按(.+?)从小到大排序/u))) {
    return { 类型: '排序', 键: [...m[1].split(/、|，/u).map(clean), clean(m[2])].map((字段, i, a) => ({ 字段, 方向: i === a.length - 1 ? 'asc' : 'desc' })) };
  }
  if ((m = t.match(/第\s*(\d+)\s*名与第\s*(\d+)\s*名(.+?)相同时/u))) {
    return { 类型: '排名边界', 上限: Number(m[1]), 外侧: Number(m[2]), 同分字段: m[3], 排序规则: allRules.find(r => r.业务对象 === rule.业务对象 && /依次按.+从高到低排序/u.test(r.条款))?.规则标识 };
  }
  if ((m = t.match(/^(.+?)缺失时按\s*(\d+)\s*级(?:参与排序|处理)/u))) {
    const fields = m[1] === '排序所需等级' ? allRules.filter(r => r.角色 === rule.角色 && r.字段 === '本场贡献榜').flatMap(r => [...r.条款.matchAll(/粉丝等级|财富等级/gu)].map(x => x[0])) : m[1].split(/或|、/u);
    return { 类型: '缺失默认', 字段: distinct(fields), 默认值: Number(m[2]), 用途: '排序' };
  }
  if ((m = t.match(/(?:必须为|取值)\s*(\d+)\s*-\s*(\d+)\s*(个数字)?/u))) {
    return { 类型: '数值区间', 字段: rule.字段, 最小: Number(m[1]), 最大: Number(m[2]), 单位: m[3] ? '位数字' : '强度', 必填: /必填/u.test(rule.上下文) };
  }
  if ((m = t.match(/^(.+?)\s*->\s*(.+)$/u))) {
    const effects = m[2].split(/\s*->\s*/u).flatMap(effectParts);
    return { 类型: '状态转换', 触发: alternatives(m[1].trim()), 结果: effects, 显式因果: true };
  }
  if ((m = withoutQuotes(t).match(/^([^，。；]+?)后(?!台|续)(.+)$/u))) {
    const end=m[1].length+1;
    const effect=t.slice(end).replace(/^[，,]/u,'');
    return { 类型: '状态转换', 触发: alternatives(t.slice(0,m[1].length)), 结果: effectParts(effect), 显式因果: true };
  }
  if ((m = withoutQuotes(t).match(/^(.+?)(?<!及|同|小|届|即)时(?!长|间|效|段|点|序|限)([，,]?)(.+)$/u))) {
    const cut=m[1].length;
    return { 类型: '条件结果', 条件: alternatives(t.slice(0,cut)), 结果: t.slice(cut+1).replace(/^[，,]/u,'') };
  }
  if ((m = t.match(/^(.+?)(?:同时)?清零$/u))) return { 类型: '清理', 字段: m[1].replace(/与/gu, '和').split(/和|、/u), 值: 0 };
  if ((m = t.match(/^(.+?)与(.+?)(?:同时)?解除/u))) return { 类型: '清理', 字段: [m[1], m[2]], 值: '解除' };
  if ((m = t.match(/^(.+?)(?:，|,)(不重复叠加|不重复执行)$/u))) return { 类型: '重复处理', 触发: m[1], 结果: m[2] };
  if((m=t.match(/^(.*?)仅(?:展示|包含|返回|统计|可选择)(.+)$/u)))return {类型:'数据筛选',字段:rule.字段||clean(m[1])||rule.业务对象,范围:clean(m[2]),结果:t};
  if((m=t.match(/^数据范围[：:](.+)$/u)))return {类型:'数据筛选',字段:rule.业务对象,范围:m[1],结果:t};
  if((m=t.match(/^(.+?)(不再展示|不展示|不显示|显示|展示|隐藏)(.+)?$/u)))return {类型:'条件展示',字段:rule.字段||rule.业务对象,条件:m[1],行为:m[2],结果:m[3]||'',原文:t};
  if (/^(?:展示|显示)/u.test(t) && rule.字段) return { 类型: '字段展示', 字段: rule.字段, 结果: t };
  if (/默认/u.test(t)) return { 类型: '字段默认', 字段: rule.字段||rule.业务对象, 结果: t };
  if((m=t.match(/^(.*?)由(.+?)(?:配置|维护|发放|读取)$/u)))return {类型:'配置来源',字段:rule.字段,对象:clean(m[1]),来源:clean(m[2]),结果:t};
  if(/(?:必填|必选|选填)|只能单选|单选当前|支持多选|支持搜索|可选|可为|仅上传/u.test(t))return {类型:'输入约束',字段:rule.字段,结果:t};
  if((m=t.match(/^(.+?)(?:不可|不能|不得|不支持|不提供|不需要|无需|可|只能|仅可)(进入|观看|评论|发送|赠送|连麦|上麦|举报|私信|设置|取消|踢出|拉黑|开播|退款|处置|调起|修改|购买|输入|支持)(.*)$/u)))return {类型:'权限约束',条件:m[1],动作:m[2]+m[3],允许:!/(不可|不能|不得|不支持|不提供)/u.test(t),约束:t};
  if(/不支持|仅.+支持|需要.+权限|前提条件/u.test(t))return {类型:'权限约束',约束:t};
  if((m=t.match(/^(.+?)(?:停留|显示)\s*(\d+)\s*秒/u)))return {类型:'时间约束',对象:m[1],秒:Number(m[2]),结果:t};
  if((m=t.match(/^(?:重复|同场重复)(.+?)(不.+|只.+)$/u)))return {类型:'重复处理',触发:`重复${m[1]}`,结果:m[2]};
  if((m=t.match(/^(.+?)(?:即|触发)(.+)$/u))&&!/(?:不|未|无法|不会)$/u.test(m[1]))return {类型:'状态转换',触发:alternatives(m[1]),结果:effectParts(m[2]),显式因果:true};
  if((m=t.match(/^(?:若|如果)(.+?)[，,](?:则)?(.+)$/u)))return {类型:'条件结果',条件:alternatives(m[1]),结果:m[2]};
  if(/(?:属于|归属|关联|定义|标识|数值|口径|计算|统计|累计|不计入|不冲减|不影响|不改变|独立|有效|生效|失效|保留|同步|不清除|不清空|必须|须|等于|可用|使用|保存|清除|移除|作用于|限制|恢复|过滤|不合并|不重复|优先|更新|读取|记录|维护|预填|不形成|不赠送|不退款|不绕过|影响|不结束|不自动|关闭|配合|沿用|共用|生成|创建|新增|增加|需要|来自|处于|为|是|存在|按|从|负责)/u.test(t))return {类型:'业务约束',字段:rule.字段,约束:t};
  if(/类型|等级|标签|包括|分别|概率|榜单|长期上架|手动可调|金币.*档|模型|身份/u.test(t))return {类型:'数据定义',字段:rule.字段,定义:t};
  if(new RegExp(`(?:^|：)${actionVerb}`,'u').test(t))return {类型:'操作入口',字段:rule.字段,操作:t};
  return { 类型: '条款待建模', 原因: '已提取原始条款；需补充结构化语义解释，不能据此判为需求缺失或不适用' };
}

export function discoverScenarios(catalog, pages) {
  const result = [];
  const rules = new Map(catalog.规则.map(r => [r.规则标识, r]));
  function emit(rule, kind, condition, outcome, dimensions, payload = {}) {
    const semantic = [rule.业务对象, rule.角色, kind, condition, outcome];
    const cause=condition.触发||condition.条件||'';
    const eventDimensions=[];
    if(/取消|拒绝|中断/u.test(cause)) eventDimensions.push('中断/取消');
    if(/失败|超时|异常|错误|不足/u.test(cause)) eventDimensions.push('异常/失败');
    if(/重试|恢复|重新加入|重新进入/u.test(cause)) eventDimensions.push('重试/恢复');
    if(/重复|连续|再次/u.test(cause)) eventDimensions.push('重复操作');
    if(/权限|授权|禁言|拉黑/u.test(cause)) eventDimensions.push('权限差异');
    result.push({ 场景标识: id('SC', semantic), 规则标识: [rule.规则标识], 业务对象: rule.业务对象, 角色: rule.角色,
      页面: rule.页面, 场景类型: kind, 条件: condition, 结果: outcome, 维度: distinct([...dimensions, ...eventDimensions,'可观察结果']),
      参数: structuredClone(payload), 证据: structuredClone(rule.来源), 处理状态: '未覆盖', 生成状态: '待设计' });
  }
  for (const rule of catalog.规则) {
    if (rule.被替代规则) continue;
    const m = rule.模型;
    // Unparsed prose is an obligation to review, not a discovered scenario.
    if (['条款待建模','上下文说明','原型实现说明','界面文案','数据定义','业务约束','权限约束','输入约束','配置来源','操作入口'].includes(m.类型)) continue;
    if(m.类型==='决策表') {
      const entries=Object.entries(m.列),out=entries.find(([key])=>/最终.+权限|最终结果|允许开播/u.test(key));
      if(out&&/^(开启|关闭)$/u.test(out[1]))emit(rule,'决策表权限',Object.fromEntries(entries.filter(([key])=>key!==out[0])),out[1],['用户角色','前置状态','权限差异'],{条件列:Object.fromEntries(entries.filter(([key])=>key!==out[0])),结果列:out[0],结果:out[1]});
      else if(m.列.处置类型&&m.列['处置前/后直播间状态']) {
        const states=m.列['处置前/后直播间状态'].split('→').map(clean);
        emit(rule,'处置状态转换',{处置:m.列.处置类型,前置状态:states[0]},states[1],['状态切换','异常/失败'],{处置:m.列.处置类型,前置状态:states[0],后续状态:states[1],即时后果:m.列.即时后果});
      }
      continue;
    }
    if (m.类型 === '排除范围') {
      emit(rule,'本期范围排除',{},m.原文,[],m);
      result.at(-1).处理状态='不适用';result.at(-1).不适用依据={原文:m.原文,原因:m.依据};
      continue;
    }
    if (m.类型 === '排序') {
      m.键.forEach((key, i) => emit(rule, '排序优先级', { 相同键: m.键.slice(0, i), 比较键: key }, key.方向,
        ['前置状态', '数据一致性'], { keys: m.键, index: i }));
    } else if (m.类型 === '排名边界' && rules.has(m.排序规则)) {
      const sort = rules.get(m.排序规则);
      emit(rule, '排名截断同分', { 名次: [m.上限, m.外侧], 同分字段: m.同分字段 }, '按后续排序键确定入榜用户', ['输入边界', '数据一致性'], { limit: m.上限, keys: sort.模型.键 });
      result.at(-1).规则标识.push(sort.规则标识); result.at(-1).证据.push(...sort.来源);
    } else if (m.类型 === '缺失默认') {
      m.字段.forEach(field => emit(rule, '等级缺失排序', { 字段: field, 状态: '缺失' }, m.默认值, ['前置状态', '数据一致性'], { field, value: m.默认值 }));
    } else if (m.类型 === '数值区间') {
      const values = m.单位 === '位数字' ? [m.最小 - 1, m.最小, m.最大, m.最大 + 1] : [m.最小, m.最大];
      for (const value of values) emit(rule, '输入范围', { 字段: m.字段, 值: value, 单位: m.单位 }, value >= m.最小 && value <= m.最大 ? '范围内' : '范围外', ['输入边界'], { ...m, value });
      if (m.必填) emit(rule, '必填输入', { 字段: m.字段, 值: '' }, '空值不满足必填', ['输入边界'], m);
    } else if (m.类型 === '状态转换') {
      for (const trigger of m.触发) {
        for (const effect of m.结果) emit(rule, '状态转换', { 触发: trigger }, effect, ['状态切换', '前置状态'], { trigger, effect });
      }
    } else if (m.类型 === '条件结果') {
      for (const condition of m.条件) emit(rule, '条件结果', { 条件: condition }, m.结果, ['前置状态'], { condition, effect: m.结果 });
    } else if (m.类型 === '清理') {
      for (const field of m.字段) emit(rule, '状态清理', { 字段: field }, m.值, ['状态切换', '数据一致性'], { field, value: m.值, context: rule.上下文 });
    } else if (m.类型 === '重复处理') {
      emit(rule, '重复事件', { 触发: m.触发 }, m.结果, ['重复操作', '状态切换'], m);
    } else if (m.类型 === '需求缺口') {
      emit(rule, '需求待确认', {}, m.问题, [], m); result.at(-1).处理状态 = '待确认';
    } else if(m.类型==='文本长度') {
      for(const value of [...(m.必填||m.可空?[0]:[]),m.最大,m.最大+1])emit(rule,'文本长度',{字段:m.字段,长度:value},value<=m.最大&&(!m.必填||value>0)?'有效':'无效',['输入边界'],{...m,value});
    } else if(m.类型==='数量上限') {
      for(const value of [m.上限-1,m.上限])emit(rule,'容量边界',{字段:m.字段,当前数量:value},value<m.上限?'允许新增':'达到上限',['输入边界'],{...m,value});
    } else if(m.类型==='数据筛选') {
      emit(rule,'数据筛选',{范围:m.范围},m.结果,['前置状态','数据一致性'],m);
    } else if(m.类型==='条件展示') {
      emit(rule,'条件展示',{条件:m.条件},m.原文,['前置状态','可观察结果'],m);
    } else if(m.类型==='计算公式') {
      emit(rule,'计算公式',{},m.结果,['数据一致性'],m);
    } else {
      emit(rule, m.类型, {}, rule.条款, m.类型 === '字段展示' || m.类型 === '字段默认' ? ['正常主流程'] : [], m);
    }
  }
  const merged = new Map();
  for (const item of result) {
    const current = merged.get(item.场景标识);
    if (!current) merged.set(item.场景标识, item);
    else { current.规则标识 = distinct([...current.规则标识, ...item.规则标识]); current.页面 = distinct([...current.页面, ...item.页面]); current.证据.push(...item.证据); }
  }
  return { schemaVersion: DISCOVERY_VERSION, 规则库SHA256: hash(catalog), 场景: [...merged.values()],
    待建模条款: catalog.规则.filter(r => r.建模状态 === '生成待复核').map(r => r.规则标识) };
}

// An explicit, field-specific obligation is checked against a case's actual
// prerequisite/action/assertion. A scenario ID in a note proves nothing.
export function verifyCaseContract(contract, testcase) {
  const failures = [];
  for (const [field, alternatives] of Object.entries(contract || {})) {
    const value = Array.isArray(testcase[field]) ? testcase[field].join('\n') : String(testcase[field] || '');
    for (const group of alternatives) {
      if (!group.some(part => field==='预期结果'?normalizeMeaning(value)===normalizeMeaning(part):normalizeMeaning(value).includes(normalizeMeaning(part)))) failures.push(`${field}缺少：${group.join(' / ')}`);
    }
  }
  return failures;
}

// Historical links are provenance only; they never establish scenario coverage.
export function historicalReferences(testcase,rules,comparison,units=[]) {
  const atom=rules.find(r=>r.用例设计?.场景===testcase.用例描述&&r.目标状态或可观察结果===testcase.预期结果[0]);
  if(atom)return atom.证据引用||[];
  const previousId=comparison?.编号对应?.find(x=>x.本次用例===testcase.用例编号)?.原用例;
  const record=comparison?.比较结果?.find(x=>x.原用例===previousId);
  const ids=record?.当前规则||[];
  const notes=(testcase.备注||[]).join('\n');
  return [...new Map([...rules.filter(r=>ids.includes(r.规则标识)||notes.includes(r.规则标识)).flatMap(r=>r.来源||[]),
    ...units.filter(u=>record?.来源单元?.includes(u.单元标识)).map(u=>u.来源)].map(s=>[hash([s.路径,s.原文]),s])).values()];
}

export function verifyCoverageClaims(scenarios, cases, claims) {
  const problems = [];
  const caseById = new Map(cases.map(c => [c.用例编号, c]));
  const scenarioById = new Map(scenarios.map(s => [s.场景标识, s]));
  for (const claim of claims) {
    const scenario = scenarioById.get(claim.场景标识);
    if (!scenario) { problems.push('引用不存在的场景'); continue; }
    if (claim.状态 === '已覆盖') {
      if (!scenario.覆盖契约 || !Object.keys(scenario.覆盖契约).length) { problems.push(`${scenario.场景标识}没有独立覆盖契约`); continue; }
      const selected = caseById.get(claim.用例编号);
      if (!selected) { problems.push(`${scenario.场景标识}用例不存在`); continue; }
      if (!scenario.证据.length) problems.push(`${scenario.场景标识}缺少原始证据`);
      problems.push(...checkScenarioCase(scenario, selected).map(p => `${scenario.场景标识}：${p}`));
      if (claim.契约SHA256 !== hash(scenario.覆盖契约)) problems.push(`${scenario.场景标识}覆盖契约已变化`);
      if (claim.用例SHA256 !== hash(selected)) problems.push(`${scenario.场景标识}被验证的用例已变化`);
    } else if (claim.状态 === '不适用') {
      if (!scenario.不适用依据?.原文 || !scenario.证据.some(e => e.原文.includes(scenario.不适用依据.原文))) problems.push(`${scenario.场景标识}不适用没有直接依据`);
    } else if (!['未覆盖', '待确认'].includes(claim.状态)) problems.push(`${scenario.场景标识}覆盖状态无效`);
  }
  const ids = claims.map(c => c.场景标识);
  if (new Set(ids).size !== ids.length) problems.push('重复覆盖声明');
  for (const scenario of scenarios) if (!ids.includes(scenario.场景标识)) problems.push(`${scenario.场景标识}未记录处理去向`);
  return problems;
}

// A covered scene from a different rule or control is not a valid witness.
export function bindScenarioElements(scenes,pages,elements) {
  for(const s of scenes) {
    const files=[...new Set(s.页面.map(p=>pages[p]?.file).filter(Boolean))];
    s.物理页面=files;
    const steps=[...(s.覆盖契约?.操作步骤?.flat()||[]),...(s.参数.trigger?[s.参数.trigger]:[])];
    const actions=steps.map(step=>normalizeMeaning(step).replace(/^(?:点击|打开|选择|切换|进入|查看|输入|清空)/u,''));
    const sameFiles=elements.filter(e=>files.includes(e.文件));
    s.元素证据=[];
    for(const e of sameFiles) {
      const name=normalizeMeaning(e.名称);
      if(!name||!actions.some(a=>a===name||a===`${name}按钮`))continue;
      // Repeated labels such as 确认 cannot be bound without a container witness.
      const peers=sameFiles.filter(x=>normalizeMeaning(x.名称)===name);
      const selectors=s.页面.flatMap(p=>pages[p]?.selectors||[]);
      if(peers.length>1&&!selectors.includes(e.定位)&&!e.容器?.some(c=>c.id&&selectors.includes(`#${c.id}`)))continue;
      s.元素证据.push({元素标识:e.元素标识,文件:e.文件,定位:e.定位,操作:distinct(steps.filter(step=>normalizeMeaning(step).endsWith(name))),条件:s.条件,结果:s.结果,
        绑定性质:s.覆盖契约?'待用例证明的行为契约':'来自原文的行为候选，未证明可执行'});
    }
  }
}

export function coverageReviews(rules, scenes, coverage, elements) {
  const dimension = { 规则: rules.map(rule => ({ 规则标识: rule.规则标识, 判断: DIMENSIONS.map(维度 => {
    if (rule.模型.类型 === '排除范围') return { 维度, 状态: '不适用', 场景: [], 原因: rule.模型.依据, 直接依据: rule.来源 };
    const selected = scenes.filter(s => s.规则标识.includes(rule.规则标识) && s.维度.includes(维度));
    const records = coverage.filter(c => selected.some(s => s.场景标识 === c.场景标识));
    return { 维度, 状态: records.length && records.every(c => c.状态 === '已覆盖') ? '已覆盖' : '待确认',
      复核类型:records.some(c=>c.状态==='待确认')?'需求决定':records.some(c=>c.状态==='未覆盖')?'用例设计或映射缺口':records.length?'覆盖证明':'适用性尚未建模',
      场景: selected.map(s => s.场景标识), 原因: records.length ? '按本维度所有适用场景的逐字段覆盖结果汇总；未覆盖不等于需求缺失' : '没有建立本维度的适用性依据；须继续建模，不自动判不适用' };
  }) })) };
  const element = { 说明: '元素须同时绑定来源场景、具体操作及断言；同页有用例不能替代本元素验证', 元素: elements.map(e => {
    const selected = scenes.filter(s => s.元素证据?.some(b=>b.元素标识===e.元素标识));
    return { ...e, 场景: selected.map(s => s.场景标识), 状态: selected.length && selected.every(s => coverage.find(c => c.场景标识 === s.场景标识)?.状态 === '已覆盖') ? '已覆盖' : '未覆盖',
      原因: selected.length ? '按元素关联场景的条件、操作、断言逐项验证' : e.来源形态==='template'?'动态模板元素，尚需核对实际渲染条件和处理结果':e.实现引用?.length?'已定位到实现引用，业务行为尚需与原始需求建立完整关联':'尚无明确的元素行为绑定；不按同页面名称认定覆盖' };
  }) };
  return { dimension, element };
}
