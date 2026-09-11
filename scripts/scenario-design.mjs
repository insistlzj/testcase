import { hash, normalizeMeaning, verifyCaseContract } from './evidence-discovery.mjs';

const normalizeField = s => s.replace(/当前主播粉丝团内的/u, '').replace(/本场累计|本场/u, '').replace(/数字部分/u, '').trim();
export const groupSources = (sources,includeText=false) => {
  const groups = new Map();
  for (const s of sources) { if (!groups.has(s.路径)) groups.set(s.路径, new Set()); for(const position of (s.页面 || s.位置 || '').split('、'))groups.get(s.路径).add(position); }
  return [...groups].map(([p, positions]) => `来源（${p.includes('annotations') ? '原型批注' : p.includes('context') ? '需求文档' : '原型页面'}）：${p}；${[...positions].join('、')}${includeText?'；已知原文：'+[...new Set(sources.filter(s=>s.路径===p).map(s=>s.原文).filter(Boolean))].join('；'):''}`);
};

export function mergeScenarioTrace(testcase,scenario) {
  const oldSources=testcase.备注.flatMap(note=>{const m=note.match(/^来源（[^）]+）：(.+?)；(.+)$/u);return m?[{路径:m[1],位置:m[2]}]:[];});
  const ruleIds=[...new Set([...testcase.备注.filter(n=>n.startsWith('规则：')).flatMap(n=>n.match(/BR-[A-Z0-9-]+/gu)||[]),...scenario.规则标识])];
  const sceneIds=[...new Set([...testcase.备注.filter(n=>n.startsWith('场景：')).flatMap(n=>n.match(/SC-[A-Z0-9]+/gu)||[]),scenario.场景标识])];
  testcase.备注=[...groupSources([...oldSources,...scenario.证据]),`规则：${ruleIds.join('、')}`,`场景：${sceneIds.join('、')}`,
    ...testcase.备注.filter(n=>!/^来源|^规则：|^场景：/u.test(n))];
}

function designDirectScenario(s,pages,ruleById) {
  const page=pages[s.页面[0]],p=s.参数;
  if(!page)return null;
  const rules=s.规则标识.map(id=>ruleById.get(id)).filter(Boolean);
  const context=rules.map(r=>r.上下文).join('；');
  let pre=[...page.preconditions];
  if(/start-live|visible-fan/u.test(s.页面[0]))pre=['主播具备开播资格'];
  if(/live-plaza/u.test(s.页面[0]))pre=['用户账号已登录'];
  if(/live-end/u.test(s.页面[0]))pre=[`${s.角色}账号已登录`,'当前场次已结束'];
  if(/live-data|live-records/u.test(s.页面[0]))pre=['主播已有直播记录'];
  if(page.state)pre.push(`当前${page.state.group}为${page.state.name}`);
  let steps=[...page.steps],result,description,point=rules[0]?.字段||page.name;
  if(s.场景类型==='状态转换') {
    const trigger=p.trigger.trim();
    // A summary may define the business rule, but only an App interaction can
    // establish the button used by this direct UI renderer.
    if(!rules.some(r=>r.章节==='交互'&&r.来源.some(e=>e.路径.includes('/annotations/'))))return null;
    if(!/^(?:点击|选择|切换|关闭|取消|确认|退出|打开|输入|清空|恢复|返回|接受|拒绝|搜索|保存|提交|查看)/u.test(trigger))return null;
    if(/^(关闭|确认|取消|保存|返回)$/u.test(trigger)||/后|成功|失败|权限|普通用户|运营账号/u.test(trigger))return null;
    if(/相应|上述|身份和入口|同步更新|继续累计|才可|^其|^该|二次确认后|重新计算|不请求系统|或|无来源时|后续登录|后才|校验通过后/u.test(String(s.结果)))return null;
    result=String(s.结果).replace(/^仅关闭说明$/u,'通知说明弹窗关闭').replace(/^模拟系统/u,'显示系统');
    if(/点击.*通知|点击暂不开启/u.test(trigger)) {pre=['用户首次登录成功','当前显示通知说明弹窗'];steps=[];}
    if(/^(切换热门|切换新人)$/u.test(trigger)&&/刷新当前直播列表/u.test(result)) {
      pre=['用户账号已登录','热门和新人列表均有直播数据'];
      result=`直播列表刷新为${trigger.slice(2)}数据`;
    }
    if(/选择分类|关闭未选择/u.test(trigger)) {
      pre.push('当前分类为A，平台已启用分类A和B');
      if(trigger==='关闭未选择') {steps.push('不修改分类，点击关闭');result='分类仍为A';}
      else {steps.push('选择分类B');result=/live-plaza/u.test(s.页面[0])?'直播列表只显示分类B的直播':'开播设置中的分类回填为B';}
      point='分类选择结果';description=`验证${trigger==='关闭未选择'?'关闭分类选择保留原分类':'选择分类后显示目标分类'}`;
    } else if(/visible-fan/u.test(s.页面[0])) {
      pre.push('有效粉丝A、B均可选择，已保存名单只包含A');
      if(trigger==='点击全选') {
        if(/搜索|范围/u.test(result)){steps.push('输入粉丝A的昵称');}
        steps.push('点击全选');result='粉丝A、B均处于选中状态';point='全选范围';
      } else if(trigger==='点击返回') {
        if(/返回/u.test(result))return null;
        steps.push('勾选粉丝B','点击返回','重新打开选择可见粉丝');result='已选名单仍只包含粉丝A';point='取消选择的状态保留';
      } else if(trigger==='点击确认') {
        if(/返回|最新/u.test(result))return null;
        steps.push('勾选粉丝B','点击确认','重新打开选择可见粉丝');result='已选名单包含粉丝A、B';point='保存选择的状态保持';
      } else if(trigger==='输入昵称') {
        pre.push('A昵称为测试甲，B昵称为测试乙');steps.push('输入昵称测试甲');result='搜索结果只包含粉丝A';point='粉丝昵称搜索';
      } else return null;
      description=trigger==='点击返回'?'验证修改可见名单后返回不保存':trigger==='点击确认'?'验证保存可见名单后重新进入':trigger==='点击全选'?(steps.some(s=>s.startsWith('输入'))?'验证全选包含搜索范围外的有效粉丝':'验证全选勾选全部有效粉丝'):'验证按昵称筛选可见粉丝';
    } else if(/category/u.test(s.页面[0]))return null;
    else {
      // Only fully named observable predicates can use the general renderer.
      // Amounts, toggles and mutations need an operator-specific fixture above.
      const navigation=/^(?:进入|打开|调起|直接打开|返回)(?!对应|该|同一)(.+(?:页|主页|直播间|弹窗|选择器|系统分享|密码房设置|本场贡献榜))$/u.test(result);
      const closure=/^(?:关闭(?:菜单|资料卡|该邀请)|通知说明弹窗关闭)$/u.test(result);
      const tab=/^(?:直播列表刷新为(?:热门|新人)数据|显示系统通知授权弹窗)$/u.test(result);
      if(!navigation&&!closure&&!tab)return null;
      if(/点击用户|赠送用户|点击主页|私信|点击场次|点击结果|点击编辑图标|选择功能|取消拉黑|取消房管|取消禁言|取消锁定|取消勾选|\/|^拒绝$/u.test(trigger))return null;
      if(/连麦/u.test(result)&&!/连麦/u.test(pre.join(' ')))return null;
      if(/点击暂不开启/u.test(trigger))pre=['用户首次登录成功','当前显示通知说明弹窗'];
      steps.push(trigger);
      point=navigation?'目标页面':closure?'弹层关闭':'目标内容';
      description=`验证${trigger.replace(/^点击/u,'')}后${result}`;
    }
  } else if(s.场景类型==='字段展示') {
    return null; // A field list alone does not supply a discriminating fixture.
  } else if(s.场景类型==='条件展示') {
    if(/^(普通房|门票房|密码房)$/u.test(p.条件)) {
      pre.push(`存在一场正在直播的${p.条件}`);
      if(p.条件==='门票房')pre.push('本场门票价格为100金币');
      steps.push('查看该直播卡片');
      result=p.条件==='门票房'&&p.结果==='金币价格'?'该直播卡片显示门票价格100金币':p.原文;
    } else if(/^(普通用户|运营账号只?)$/u.test(p.条件)&&/余额/u.test(p.结果)) {
      s.角色=/运营/u.test(p.条件)?'运营账号':'观众';
      pre=[s.角色==='运营账号'?'运营账号所属公会虚拟金币余额为1000':'普通用户真实金币余额为1000'];
      steps.push('查看金币余额');result=`金币余额显示1000${s.角色==='运营账号'?'虚拟金币':'金币'}`;
    } else return null;
    description=`验证${p.条件.replace(/只$/u,'')}的${p.字段}展示`;
  } else if(s.场景类型==='数据筛选'&&/关注.*(?:正在直播|仍关注主播)|仍在线/u.test(p.范围)) {
    const isLive=/正在直播/u.test(p.范围),online=/仍在线/u.test(p.范围);
    pre.push(online?'本场观众只有A、B；A当前在线，B已离开当前直播间':isLive?'主播A已关注且正在直播；主播B已关注但未开播；主播C未关注且正在直播':'用户A仍关注当前主播；用户B已取消关注');
    steps.push(`查看${isLive?'关注直播区':online?'在线观众列表':p.字段}`);
    result=online?'在线观众列表仅包含用户A':isLive?'关注直播区只显示主播A':`${p.字段}只显示仍关注主播的用户A`;
    point=isLive?'关注直播筛选':online?'在线观众过滤':p.字段;
    description=`验证${isLive?'关注直播区':online?'观众列表':p.字段}按${online?'在线状态':isLive?'关注和直播状态':'关注关系'}筛选`;
  } else if(s.场景类型==='条件结果'&&/取消选择/u.test(p.condition)&&/保留原封面/u.test(String(s.结果))) {
    pre=['主播具备开播资格','当前直播封面为图片A'];
    steps=['进入开播设置','点击修改封面','取消系统照片选择'];result='直播封面仍为图片A';
    description='验证取消选择图片后保留原封面';point='取消封面修改';
  } else if(s.场景类型==='容量边界') {
    if(/房管/u.test(context+p.字段)&&s.角色==='主播') {
      pre=['主播正在直播',`当前有${p.value}名长期授权房管`,'用户A当前在线且不是房管，与主播无拉黑关系，未被本场踢出或加入直播间黑名单'];
      steps=['打开用户A的资料卡','点击设置房管'];
      if(p.value<p.上限){steps.push('确认设置房管','打开房管列表');result=`房管列表包含用户A，共${p.value+1}人`;}
      else {steps.push('打开房管列表');result='房管列表不包含用户A';}
      description=`验证已有${p.value}名房管时添加房管`;point='房管容量限制';
    } else if(/粉丝团/u.test(context+p.字段)&&s.角色==='观众') {
      pre=['观众未加入当前主播粉丝团，双方无拉黑关系','主播设置加入条件为已关注且累计贡献达到100金币；观众已关注且累计贡献100金币',`粉丝团当前有${p.value}名有效成员`];
      steps=['打开粉丝团','点击加入'];result=p.value<p.上限?'粉丝团面板显示已加入状态':'粉丝团面板仍显示未加入状态';
      description=`验证粉丝团已有${p.value}人时申请加入`;point='粉丝团满员边界';
    } else return null;
  } else if(s.场景类型==='时间约束'&&/邀请/u.test(context+p.对象)) {
    pre=['主播正在普通房直播且未连麦','主播A具备邀请资格'];
    steps=['接收主播A的连麦邀请',`查看提示出现${p.秒}秒后的直播画面`];result='连麦邀请浮层提示消失';
    description=`验证连麦邀请提示展示${p.秒}秒后消失`;point='邀请提示持续时间';
  } else if(s.场景类型==='重复事件'&&/重复确认/u.test(p.触发)&&/结束直播/u.test(context+page.name)) {
    pre=['主播正在直播','已打开结束直播确认弹窗'];steps=['连续点击两次确认结束直播'];
    result='直播记录中当前场次只出现一次';
    const record=Object.values(pages).find(x=>x.name==='直播记录');if(!record)return null;
    steps.push(...record.steps,'查看当前场次记录');
    description='验证重复确认结束直播只结束一次';point='重复结束直播';
  } else if(s.场景类型==='决策表权限'&&s.角色==='主播'&&p.条件列.平台&&p.条件列.公会) {
    const platform=p.条件列.平台.replace('权限锁定/未锁定','未锁定');
    pre=['主播已完成除平台、公会开关外的开播准备；相机和麦克风已授权，房型为普通房',`平台开播权限：${platform}`];
    if(/^(开启|关闭)$/u.test(p.条件列.公会))pre.push(`公会开播权限：${p.条件列.公会}`);
    else pre.push('公会原开播设置为关闭，当前跟随平台权限');
    steps=['进入开播设置','点击开始直播'];result=s.结果==='开启'?'页面进入主播直播间':'页面未进入主播直播间';
    description=`验证平台${platform}、公会${/^(开启|关闭)$/u.test(p.条件列.公会)?p.条件列.公会:'跟随平台'}时的开播权限`;
    point='平台与公会开播权限组合';
  } else if(s.场景类型==='处置状态转换'&&s.角色==='主播') {
    pre=['主播正在直播'];steps=[`接收平台对当前场次的“${p.处置}”处置结果`,'查看当前直播页面'];
    result=p.后续状态==='已结束'?'页面进入直播结束页':'页面保持直播中状态';
    description=`验证平台${p.处置}后的直播状态`;point='平台处置后的场次状态';
  } else if(s.场景类型==='文本长度') {
    // A maximum proves a size constraint, not a particular error toast or truncation UI.
    if(!/直播主题/u.test(p.字段)||!p.value)return null;
    steps.push(`输入由${p.value}个“测”组成的${p.字段}`);
    if(s.结果==='无效') {steps.push('点击开始直播');pre.push('封面和分类已设置，房型为普通房');result=`不能以超过${p.最大}个字符的直播主题开播`;}
    else result=`${p.字段}保留输入的${p.value}个字符`;
    description=`验证${p.value}字符${p.字段}的长度限制`;point=`${p.字段}长度上限`;
  } else return null;
  if(!result||/^(?:后|并|且)|^\s*$/u.test(result))return null;
  return {pre,steps:[...new Set(steps)],result,description,point};
}

export function sourceContract(s, pages) {
  const p = s.参数, page = pages[s.页面[0]];
  if (s.覆盖契约) return;
  const trigger = s.场景类型 === '状态转换' ? p.trigger : null;
  const condition = s.场景类型 === '条件结果' ? p.condition : trigger && /失败|超时|余额不足/u.test(trigger) ? trigger : null;
  // Direct assertions retain the entire source predicate, including negation.
  // An unbound pronoun or missing action cannot establish a coverage contract.
  if (typeof s.结果 !== 'string' || /相应|上述|待确认/u.test(s.结果)) return;
  if (trigger && /^(点击|选择|切换|关闭|取消|确认|退出|打开|输入|清空|恢复|返回)/u.test(trigger) && trigger.length > 3) {
    s.覆盖契约 = { 操作步骤: [[trigger]], 预期结果: [[s.结果]] };
  } else if (condition && page?.steps.length) {
    s.覆盖契约 = { 前置条件: [[condition]], 操作步骤: page.steps.map(step=>[step]), 预期结果: [[s.结果]] };
  }
}

// These are operator renderers. Values, trigger alternatives and effects come
// exclusively from the source model, never a list of pre-authored live cases.
export function designScenario(s, pages, ruleById) {
  let page = pages[s.页面[0]];
  if (/排序|排名/u.test(s.场景类型) && !/audience-viewers/u.test(s.页面[0])) {
    page = Object.entries(pages).find(([key, p]) => /contribution-rank/u.test(key) && p.role === s.角色)?.[1] || page;
  }
  const p = s.参数;
  const start = page?.steps || [];
  const prerequisite = page?.preconditions || [`${s.角色}账号已登录`];
  let description, point, pre = [...prerequisite], steps = [...start], result;
  if(s.角色==='观众' && /排序|排名/u.test(s.场景类型))pre=['观众已进入当前直播间'];
  let dimension = [...s.维度];
  if (s.场景类型 === '排序优先级') {
    const keys = p.keys.map(k => ({...k, 字段: normalizeField(k.字段)}));
    const index = p.index, current = keys[index];
    const data = keys.map((k, i) => i === index ? `${k.字段}：A=${k.方向 === 'asc' ? 1 : 2}，B=${k.方向 === 'asc' ? 2 : 1}` : /ID/u.test(k.字段) ? `${k.字段}：A=2，B=1` : `${k.字段}：A、B均为1`);
    pre.push(`用户A、B均在当前直播间，${data.join('；')}`);
    description = `验证${index ? '前序条件相同时按' : '按'}${current.字段}排序`;
    point = `${current.字段}排序优先级`;
    result = `${/audience-viewers/u.test(s.页面[0]) ? '在线观众列表' : '本场贡献榜'}中用户A排在用户B之前`;
    if (/audience-viewers/u.test(s.页面[0])) steps.push(`切换至${/时长/u.test(keys[0].字段) ? '按停留时长' : '按贡献'}`);
  } else if (s.场景类型 === '排名截断同分') {
    const secondary = normalizeField(p.keys[1].字段);
    pre.push(`本场共${p.limit + 1}名贡献用户，前${p.limit - 1}名贡献均为1000`);
    const tail=p.keys.slice(2).map(k=>/ID/u.test(k.字段)?`${normalizeField(k.字段)}分别为10和20`:`${normalizeField(k.字段)}均为1`);
    pre.push(`用户A、B${normalizeField(p.keys[0].字段)}均为500，${secondary}分别为${p.keys[1].方向==='asc'?'1和2':'2和1'}${tail.length?'，'+tail.join('，'):''}`);
    description = `验证第${p.limit}名同分时按后续条件入榜`;
    point = '入榜同分边界';
    result = `第${p.limit}名为用户A，用户B不在榜单内`;
  } else if (s.场景类型 === '等级缺失排序') {
    const field = normalizeField(p.field);
    pre.push(`用户A（ID 10）、B（ID 20）均在当前直播间，贡献均为100，${field}分别为缺失和${p.value}，其他等级均为1`);
    description = `验证${field}缺失按${p.value}级排序`;
    point = `${field}缺省排序值`;
    result = `${/audience-viewers/u.test(s.页面[0]) ? '在线观众列表' : '本场贡献榜'}中用户A排在用户B之前`;
    if (/audience-viewers/u.test(s.页面[0])) steps.push('切换至按贡献');
  } else if (s.场景类型 === '输入范围' && p.单位 === '强度') {
    description = `验证${p.字段}可设置为${p.value}`; point = `${p.字段}范围端点`;
    steps.push('选择美颜项目', `拖动强度到${p.value}`); result = `当前项目强度显示${p.value}`;
  } else if ((s.场景类型 === '输入范围' || s.场景类型 === '必填输入') && p.单位 === '位数字') {
    const value = s.场景类型 === '必填输入' ? '' : '1'.repeat(p.value);
    const valid = s.结果 === '范围内';
    if(s.角色==='观众')pre=['观众账号可用，未被主播拉黑或本场踢出'];
    if (s.角色 === '主播') {
      steps = s.页面.some(k => /start-live/u.test(k)) ? ['进入开播设置', '打开房型设置', '选择密码房'] : ['打开更多功能', '点击房间密码'];
      pre = s.页面.some(k => /start-live/u.test(k)) ? ['主播具备开播资格'] : ['主播正在密码房直播'];
    }
    const input = value ? `输入密码${value}` : '清空密码';
    description = `验证${value ? `${value.length}位` : '空'}密码${valid ? '符合格式要求' : '无法提交'}`;
    point = '密码输入边界';
    if (s.角色 === '观众' && valid) pre.push(`当前场次密码为${value}`);
    steps.push(input, s.角色 === '主播' && !s.页面.some(k=>/start-live/u.test(k)) ? '点击保存' : '点击确认');
    const related = [...ruleById.values()].filter(r => r.页面.some(k => s.页面.includes(k))).map(r => r.条款).join('；');
    const prompt = related.match(/提示[“"]([^”"]*密码[^”"]+)[”"]/u)?.[1];
    if (valid) result = s.角色 === '观众' ? '页面进入当前直播间' : s.页面.some(k=>/start-live/u.test(k)) ? '房型回填为密码房' : `当前有效密码为${value}`;
    else if (prompt) result = `页面提示“${prompt}”`;
    else return null;
  } else if (s.场景类型 === '状态转换') {
    const trigger = p.trigger.trim(), effect = p.effect.trim();
    if (/粉丝群/u.test(trigger)) return null; // group actions belong to messaging scope
    // A state mutation requires an object, a trigger path and an observable field.
    // Parse identities/effects from the rule; the page supplies only entry context.
    if (/清零|解除$/u.test(effect) && /粉丝|团籍|群籍|亲密度/u.test(effect)) {
      if (/群籍/u.test(effect)) return null; // group-internal verification is a different module
      if (/拉黑/u.test(trigger)) return null; // blocked viewers lack this App observation path
      const resetting = effect.endsWith('清零');
      pre = ['观众已加入当前主播粉丝团', '粉丝等级为3，亲密度为100'];
      if (/主动退出|退出粉丝团/u.test(trigger)) steps = [...start, '点击退出粉丝团', '确认退出'];
      else if (/移出|拉黑/u.test(trigger)) {
        steps = [...start, `接收${/移出/u.test(trigger) ? '被移出粉丝团' : '账号拉黑'}事件`];
      } else return null;
      const field = effect.replace(/清零|解除$/u, '');
      description = `验证${trigger}后${field}${effect.endsWith('清零') ? '清零' : '解除'}`;
      point = `${field}清理`;
      if (resetting) {
        const rejoin = [...ruleById.values()].find(r=>r.页面.some(k=>s.页面.includes(k)) && /重新加入从\s*0/u.test(r.条款));
        if (!rejoin) return null;
        s.规则标识 = [...new Set([...s.规则标识, rejoin.规则标识])];
        s.证据.push(...structuredClone(rejoin.来源));
        pre.push('退出后仍满足加入条件，粉丝团未满员');
        steps.push('重新打开粉丝团', '点击加入', `查看${field}`);
        description = `验证${trigger}后重新加入的${field}`;
        dimension.push('重试/恢复', '重新进入/刷新状态保持');
      }
      result = resetting ? `当前主播粉丝团的${field}显示0` : '粉丝团面板显示未加入状态';
      dimension.push('数据一致性');
    } else if (/邀请.*失效|其他邀请保留/u.test(effect) && /结束直播|受限房型|进入连麦|接受/u.test(trigger)) {
      if (/被接受|已发起/u.test(trigger + effect)) return null;
      pre = ['执行者为主播B；主播A、B、C均在普通房直播、未连麦且互不拉黑', '主播A、C分别向主播B发送了待处理邀请'];
      if (/接受/u.test(trigger)) steps = ['打开连麦主播面板的收到的邀请', '选择主播A的邀请', '点击接受', '重新打开连麦主播面板的收到的邀请'];
      else {
        const event = trigger.replace(/^任一方/u, '').replace('受限房型', '门票房');
        if (/进入连麦/u.test(event)) pre.push('主播D在普通房直播、未连麦且与主播A无拉黑关系');
        steps = ['打开连麦主播面板的收到的邀请', `接收主播A${event === '进入连麦' ? '与主播D建立连麦' : event}事件`, '查看收到的邀请'];
      }
      description = `验证${trigger}后的邀请${/保留/u.test(effect) ? '保留' : '失效'}`;
      point = '待处理邀请状态';
      result = /保留/u.test(effect) ? '收到的邀请仍保留主播C的邀请' : '收到的邀请不再显示主播A的邀请';
      dimension.push('数据一致性');
      if (/接受/u.test(trigger)) dimension.push('重复操作');
    } else {
      const direct=designDirectScenario(s,pages,ruleById);
      if(!direct)return null;
      ({description,point,pre,steps,result}=direct);
    }
  } else if (s.场景类型 === '重复事件' && /邀请/u.test(s.业务对象 + p.触发)) {
    pre = ['主播B正在普通房直播且未连麦', '主播A、C均具备邀请资格'];
    steps = ['接收主播A的邀请', '提示尚未消失时接收主播C的邀请'];
    description = '验证提示期间新增邀请更新原提示'; point = '邀请提示叠加'; result = '页面只显示一个邀请提示';
  } else {
    const direct=designDirectScenario(s,pages,ruleById);
    if(!direct)return null;
    ({description,point,pre,steps,result}=direct);
  }
  if (!steps.length || !result) return null;
  const testcase = { 序号: 0, 用例编号: '', 功能模块: '直播模块', 功能结构: `${page.name}（${s.角色}视角）`, 用例类型: dimension.includes('输入边界') ? '逻辑校验' : '业务流程', 优先级: 'P1',
    用例描述: description, 验证用例子项: point, 前置条件: pre, 操作步骤: steps, 预期结果: [result], 流程编号: '', 测试结果: '未测', 测试人员: '',
    备注: [...groupSources(s.证据), `规则：${s.规则标识.join('、')}`, `场景：${s.场景标识}`, '未动态验证'] };
  // Contract remains independent of the later candidate and includes the complete
  // discriminating fixture, target action and signed assertion, not field names.
  s.覆盖契约 = { 前置条件: pre.map(x => [x]), 操作步骤: steps.map(x => [x]), 预期结果: [[result]] };
  s.维度 = [...new Set(dimension)];
  s.生成状态 = '已设计';
  s.设计 = testcase;
  return testcase;
}

export function mapCoverage(scenarios, cases) {
  return scenarios.map(s => {
    const match = s.覆盖契约 && cases.find(c => checkScenarioCase(s, c).length === 0);
    return { 场景标识: s.场景标识, 状态: match ? '已覆盖' : ['待确认','不适用'].includes(s.处理状态) ? s.处理状态 : '未覆盖',
      用例编号: match?.用例编号 || '', 契约SHA256: s.覆盖契约 ? hash(s.覆盖契约) : '', 用例SHA256: match ? hash(match) : '',
      原因: match ? '必要条件、触发步骤和有符号断言逐项匹配' : s.处理状态==='不适用'?s.不适用依据.原因 : s.覆盖契约 ? '已有用例未同时具备本场景的必要条件、动作和断言' : '已保留证据，结构化设计尚未完成' };
  });
}

export function checkScenarioCase(s, c) {
  if (!s.覆盖契约) return ['没有来源独立覆盖契约'];
  const sameRole = c.功能结构.includes(`${s.角色}视角`) || (s.角色 === '观众' && c.功能结构.includes('用户视角'));
  if (!sameRole) return ['执行角色不同'];
  const pageMatch=[...s.页面,...(s.物理页面||[]).map(p=>p.split('/').at(-1))].some(page=>c.备注?.some(note=>note.includes(page)));
  const exact = verifyCaseContract(s.覆盖契约, c);
  if (!exact.length) return pageMatch ? [] : ['未绑定当前场景的页面来源'];
  const norm = value => String(value).replace(/[\s“”"，。、：:；;（）()]/gu, '');
  const steps = norm(c.操作步骤.join(' ')), pre = norm(c.前置条件.join(' ')), result = norm(c.预期结果.join(' '));
  const cause=s.参数.condition || s.参数.trigger || '';
  if(pageMatch&&s.场景类型==='条件结果'&&/取消选择/u.test(cause)&&/保留原封面/u.test(String(s.结果))) {
    const oldValue=normalizeMeaning(c.前置条件.join(' ')).match(/封面为(?:图片)?([^；，。]+)/u)?.[1];
    if(oldValue&&/取消系统照片选择/u.test(steps)&&normalizeMeaning(c.预期结果[0])===`封面仍为图片${oldValue}`)return [];
  }
  if(s.场景类型==='状态转换'&&/^(切换热门|切换新人)$/u.test(cause)) {
    const target=cause.slice(2);
    if(pageMatch&&normalizeMeaning(c.操作步骤.join(' ')).includes(cause)&&normalizeMeaning(c.预期结果[0]).replace(/^页面/u,'')===`直播列表刷新为${target}数据`)return [];
  }
  if(s.场景类型==='状态转换'&&/点击开启通知/u.test(cause)&&/系统通知授权弹窗/u.test(String(s.结果))) {
    if(pageMatch&&normalizeMeaning(c.操作步骤.join(' ')).includes('点击开启通知')&&normalizeMeaning(c.预期结果[0])==='显示系统通知授权弹窗')return [];
  }
  if(pageMatch && /请求失败|支付失败|加入失败|超时/u.test(cause)) {
    const object=s.业务对象+s.页面.join(' ');
    const submitted=/邀请|cohost/u.test(object)?/点击邀请/u.test(steps):/recharge|充值/u.test(object)?/点击确认支付/u.test(steps):/fan-club|粉丝团/u.test(object)?/点击加入/u.test(steps):/gift|礼物/u.test(object)?/点击赠送/u.test(steps):false;
    const normalizeCondition=t=>norm(t).replace(/请求返回|请求/u,'').replace(/^本次/u,'');
    const state=normalizeCondition(cause);
    const preMatches=normalizeCondition(pre).includes(state) || (state==='失败' && /请求返回失败|请求失败/u.test(pre));
    const outcome=norm(s.结果);
    const direct=result.includes(outcome.replace(/^页面/u,''));
    const noNewInvitation=/不生成邀请/u.test(outcome)&&/邀请/u.test(result)&&/不新增|不生成/u.test(result);
    const noMembership=/未加入|不改变团籍/u.test(outcome)&&/仍.*未加入/u.test(result);
    const beforeBalance=pre.match(/余额(\d+)金币/u)?.[1], afterBalance=result.match(/余额(?:保持|仍为)(\d+)金币/u)?.[1];
    const noCharge=/不扣(?:减)?|不增加|保持.*余额/u.test(outcome)&&beforeBalance!==undefined&&beforeBalance===afterBalance;
    if(submitted && preMatches && (direct||noNewInvitation||noMembership||noCharge))return [];
  }
  if ((s.场景类型 === '输入范围' || s.场景类型 === '必填输入') && s.参数.单位 === '位数字') {
    const input = c.操作步骤.join(' ').match(/输入(?:房间)?密码\s*(\d+)/u)?.[1];
    const isSameValueClass = s.场景类型 === '必填输入' ? /清空.*密码/u.test(steps) : input?.length === s.参数.value;
    const setting = /开播设置|房型/u.test(steps) || /具备开播资格|已选择密码房/u.test(pre), wantsSetting = s.页面.some(p => /start-live/u.test(p));
    const viewing = s.角色 === '观众';
    const pathMatches = viewing ? /密码房/u.test(pre + steps) : setting === wantsSetting;
    const assertion = s.结果 === '范围内' ? viewing ? /^(?:页面)?进入.*直播间$/u.test(result) && pre.includes(input) : wantsSetting ? result==='房型回填为密码房' : result===`当前有效密码为${input}`
      : s.设计 && norm(s.设计.预期结果[0]) === result;
    if (isSameValueClass && pathMatches && assertion) return [];
  }
  if (s.场景类型 === '输入范围' && s.参数.单位 === '强度') {
    if (steps.includes(`拖动强度到${s.参数.value}`) && result.includes(`强度显示${s.参数.value}`) && /美颜项目|当前项目/u.test(result)) return [];
  }
  if (s.场景类型 === '状态转换' && /清零$/u.test(s.参数.effect) && /主动退出/u.test(s.参数.trigger)) {
    const field = s.参数.effect.replace(/清零$/u, '');
    if (pre.includes(field) && steps.includes('退出粉丝团') && steps.includes('确认退出') && steps.includes('点击加入') && result.includes(field) && /(?:清零|为0|显示0)/u.test(result)) return [];
  }
  return exact;
}
