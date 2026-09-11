import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const taskDir = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(taskDir, "sources");
const specPath = path.join(sourceDir, "需求规格说明.md");
const pendingPath = path.join(sourceDir, "需求待确认.md");

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const writeJson = (name, value) => fs.writeFile(path.join(taskDir, name), `${JSON.stringify(value, null, 2)}\n`);

function tableCells(line) {
  return line.split("|").slice(1, -1).map((cell) => cell.trim());
}

function parseSpec(text) {
  let domain = "";
  return text.split("\n").flatMap((line, index) => {
    if (line.startsWith("## ")) domain = line.slice(3).trim();
    const cells = tableCells(line);
    if (!/^REQ-[A-Z]+-\d{3}$/.test(cells[0] || "")) return [];
    return [{
      需求编号: cells[0],
      需求域: domain,
      需求原文: cells[1],
      原始问答编号: cells[2],
      业务规则来源: "需求规格说明.md",
      来源行: index + 1,
      证据状态: "正式业务规则（用户本次明确指定）",
    }];
  });
}

function parsePending(text) {
  let priority = "";
  return text.split("\n").flatMap((line, index) => {
    if (line.startsWith("## P")) priority = line.slice(3).trim();
    const cells = tableCells(line);
    if (!/^PENDING-\d{3}$/.test(cells[0] || "")) return [];
    const isConflict = priority.startsWith("P0");
    const hasFiveColumns = cells.length >= 5;
    return [{
      待确认编号: cells[0],
      优先级分类: priority,
      待确认事项: cells[1],
      当前已知或缺口: hasFiveColumns
        ? cells[2]
        : isConflict
          ? cells[2]
        : "原问题或答案依赖未附截图、撤回内容或完整上下文，现有文本不足以形成确定规则",
      仍需明确: hasFiveColumns
        ? cells[3]
        : isConflict
          ? "需确认冲突口径并形成可测试的最终规则"
          : "需补充原始证据后再形成可测试规则",
      原始问答编号: hasFiveColumns ? cells[4] : isConflict ? cells[3] : cells[2],
      风险来源: "需求待确认.md",
      来源行: index + 1,
      可定义正式业务规则: false,
    }];
  });
}

const points = {
  "REQ-ACC-001": ["用户 App 支持中文、英文、印尼语、马来语", "公会 App 支持中文、英文、印尼语、马来语", "管理后台仅要求中文"],
  "REQ-ACC-002": ["用户 App 正式上线后默认语言为印尼语", "公会 App 正式上线后默认语言为印尼语"],
  "REQ-ACC-003": ["手机号码区号可选择", "手机号码区号不得固定为单一区号"],
  "REQ-ACC-004": ["邮箱验证码可以完成邮箱登录", "邮箱密码可以完成邮箱登录"],
  "REQ-ACC-005": ["保存资料时同步触发风控校验", "约 3 秒校验期间显示加载状态", "风控校验成功后保存资料", "风控校验失败时提示“审核不通过”", "网络异常时提示“网络异常，请重试”"],
  "REQ-ACC-006": ["被封禁账号执行受限操作时显示明确提示"],
  "REQ-ACC-007": ["余额为负数的用户不能注销账号"],
  "REQ-ACC-008": ["主播认证仅接受 +62 手机号", "主播认证接受印尼本国驾驶证", "主播认证接受 KTP", "主播认证拒绝非印尼本国驾驶证或非 KTP 证件"],
  "REQ-ACC-009": ["注册流程屏蔽 +86 手机号"],
  "REQ-ACC-010": ["违规头像在上传阶段被拦截", "违规昵称在上传阶段被拦截", "管理后台不提供违规头像或昵称的资料重置功能"],
  "REQ-ACC-011": ["后台重置用户资料后向用户发送通知"],
  "REQ-ACC-012": ["系统不提供普通用户搜索能力", "搜索范围支持主播", "搜索范围支持直播内容"],
  "REQ-LIVE-001": ["受限直播间展示直播封面图", "受限直播间展示毛玻璃遮罩", "门票直播间展示购买门票弹窗", "密码直播间展示输入密码弹窗", "被拉黑用户进入直播间时展示拉黑提示弹窗"],
  "REQ-LIVE-002": ["直播间礼物支持特效", "个人装扮道具不使用礼物特效"],
  "REQ-LIVE-003": ["礼物详情页展示礼物特效文件", "礼物列表页不展示礼物特效文件"],
  "REQ-LIVE-004": ["直播访问量按进入次数统计且不按账号去重", "同一账号进入 5 次时访问量增加 5"],
  "REQ-LIVE-005": ["系统不提供“断流但场次不结束”的独立功能"],
  "REQ-LIVE-006": ["后台强制关闭门票直播间后不自动退还观众已支付门票"],
  "REQ-LIVE-007": ["主播退出旧公会并加入新公会后后台保留全部历史记录", "主播端只展示加入新公会后产生的数据", "旧公会只查看主播在旧公会期间的数据", "新公会只查看主播在新公会期间的数据"],
  "REQ-LIVE-008": ["主播 ID 与直播间 ID 使用同一标识", "主播退出身份后固定直播间不变化", "主播恢复身份后固定直播间不变化"],
  "REQ-LIVE-009": ["任务入口跳转到独立页面", "独立任务页面展示全部任务"],
  "REQ-LIVE-010": ["用户退出密码房且主播修改本场密码后再次进入必须输入新密码"],
  "REQ-LIVE-011": ["主播 App 切到后台时观众端展示最后一帧", "主播 App 在后台超过 120 秒后直播间自动结束", "主播 App 在后台暂停期间计入直播时长", "主播 App 被杀时直播间立即结束"],
  "REQ-LIVE-012": ["首页轮播支持多张素材滚动展示", "同一条轮播规则可配置多条轮播内容"],
  "REQ-LIVE-013": ["推送对象选择全部时推送给所有用户", "推送对象选择指定公会时只推送给该公会成员"],
  "REQ-LIVE-014": ["礼物适用范围选择器展示已上架礼物", "礼物适用范围选择器展示未上架礼物"],
  "REQ-LIVE-015": ["直播过程中不能转换直播间房型"],
  "REQ-LIVE-016": ["开播设置包含门票价格选择"],
  "REQ-LIVE-017": ["美颜采用选项与滑块组合交互", "可用美颜项数量由已购买套餐决定"],
  "REQ-LIVE-018": ["主播相关 3 个入口对所有用户展示", "非主播点击开始直播跳转主播身份引导页", "非主播点击主播中心跳转主播身份引导页"],
  "REQ-LIVE-019": ["首页热门列表不是用户关注列表", "首页新人列表不是用户关注列表"],
  "REQ-LIVE-020": ["直播消息卡片展示房间封面图", "直播消息卡片展示直播间主题", "直播消息卡片展示主播名称", "直播消息卡片展示房型信息", "普通房、密码房、门票房的直播消息卡片均展示封面图"],
  "REQ-LIVE-021": ["主播列表状态字段表示主播开播权限是否正常"],
  "REQ-LIVE-022": ["同时开启广场展示和粉丝授权可见时，仅授权用户能在首页看到密码房", "未授权用户不能在首页看到该密码房", "授权用户输入正确密码后可以进入直播间"],
  "REQ-LIVE-023": ["密码房授权名单再次设置时自动选中上次选择的用户"],
  "REQ-LIVE-024": ["主播答谢观众使用固定口头答谢内容", "点击答谢后进入对应答谢页面"],
  "REQ-LIVE-025": ["在线观众贡献榜仅反映在线观众", "本场累计贡献榜包含在线观众和已离线观众"],
  "REQ-LIVE-026": ["主播页面粉丝数按关注该主播的用户数统计", "主播页面粉丝数不按粉丝团人数统计"],
  "REQ-SOC-001": ["每个主播默认拥有 1 个粉丝团", "每个主播最多只能拥有 1 个粉丝团", "单个粉丝团成员上限为 500 人"],
  "REQ-SOC-002": ["用户达到入团条件后不会自动加入粉丝团", "符合条件的用户需主动加入粉丝团", "粉丝团达到 500 人时加入按钮置灰", "粉丝团达到 500 人时显示“成员已满”", "主播移除成员后新的符合条件用户可以加入"],
  "REQ-SOC-003": ["粉丝团与粉丝群聊是同一业务实体", "加入群聊时同步加入粉丝团", "群聊已满时不能加入粉丝团"],
  "REQ-SOC-004": ["用户加入粉丝团后不能查看加入前的群聊历史消息"],
  "REQ-SOC-005": ["被主播踢出直播间后本场结束前不能免费重新进入", "被主播踢出直播间后本场结束前不能再次付费进入"],
  "REQ-SOC-006": ["陌生人 A 到 B 最多发送 3 条私信", "陌生人 B 到 A 可独立发送最多 3 条私信"],
  "REQ-SOC-007": ["删除好友或会话关系后 A 端聊天记录清空", "删除好友或会话关系后 B 端聊天记录清空", "删除好友或会话关系后从 A 端对话列表删除", "删除好友或会话关系后从 B 端对话列表删除"],
  "REQ-SOC-008": ["直播间只使用账号级拉黑", "被主播拉黑的用户再次进入直播间时显示拉黑提示"],
  "REQ-SOC-009": ["主播不能处置其他房管"],
  "REQ-SOC-010": ["巡房账号可接收主播发起的拉黑操作", "巡房账号可接收主播发起的踢出操作", "主播拉黑巡房账号后巡房身份和能力不受影响", "主播踢出巡房账号后巡房身份和能力不受影响"],
  "REQ-SOC-011": ["解除单人禁言后用户立即恢复发言", "用户进入主播下一场直播时恢复发言"],
  "REQ-SOC-012": ["单人禁言与全员禁言分别独立生效", "仅解除单人禁言但全员禁言仍存在时用户保持禁言", "仅解除全员禁言但单人禁言仍存在时用户保持禁言", "单人禁言和全员禁言都解除后用户恢复发言"],
  "REQ-SOC-013": ["用户拉黑主播后自动取消该用户房管权限", "主播拉黑用户后自动取消该用户房管权限"],
  "REQ-SOC-014": ["普通群成员不能编辑群资料", "群主可以编辑群资料"],
  "REQ-SOC-015": ["客服入口优先跳转客户 WhatsApp 会话", "客服入口不跳转独立客服系统"],
  "REQ-FIN-001": ["金币以整数形式存储", "系统不接受小数金币"],
  "REQ-FIN-002": ["幸运礼物概率配置保留 1 位小数"],
  "REQ-FIN-003": ["幸运礼物 RTP 计算结果除不尽时向上取整", "幸运礼物 RTP 结果保留 1 位小数"],
  "REQ-FIN-004": ["道具上架后不会自动发放给所有用户", "本期支持道具配置", "本期不实现任务获得道具逻辑", "本期不实现金币购买道具逻辑", "本期不实现达到等级获得道具逻辑"],
  "REQ-FIN-005": ["门票按礼物价值计入主播收益", "普通礼物按礼物价值计入主播收益", "定制礼物按礼物价值计入主播收益", "幸运礼物按礼物价值的 1% 计入主播收益", "幸运礼物主播收益与返奖无关"],
  "REQ-FIN-006": ["门票按礼物价值计入榜单贡献", "普通礼物按礼物价值计入榜单贡献", "定制礼物按礼物价值计入榜单贡献", "幸运礼物按礼物价值计入榜单贡献"],
  "REQ-FIN-007": ["系统金额统一使用 USD", "金额展示统一使用 USD"],
  "REQ-FIN-008": ["支付成功订单全额退款后不恢复已占用的活动套餐限购次数"],
  "REQ-FIN-009": ["订单退款不影响主播收益计算", "订单冲正不影响主播收益计算"],
  "REQ-FIN-010": ["充值金币订单支持后台退款", "购买礼物订单不支持后台退款"],
  "REQ-FIN-011": ["系统不提供提现功能"],
  "REQ-FIN-012": ["财务统计保留收益指标", "财务统计保留累计充值指标", "财务统计保留累计退款指标", "财务统计不保留其他未列明指标"],
  "REQ-FIN-013": ["充值套餐赠送比例由套餐本金和赠送金币计算", "展示的赠送比例与实际赠送金币数量一致"],
  "REQ-FIN-014": ["用户只有 1 个资金账户", "不拆分本金账户和赠金账户", "除充值外获得的金币在报表中归类为赠金"],
  "REQ-FIN-015": ["所有消费统一从余额扣减", "系统不逐笔追踪消费使用了哪次充值获得的金币"],
  "REQ-FIN-016": ["充值订单退款时从当前余额扣除套餐本金金币与赠送金币总额"],
  "REQ-FIN-017": ["后台配置套餐赠送金币绝对数量", "后台不直接配置赠送百分比", "用户入口显示 +xxx 金币", "用户入口提示各套餐中的最高赠送比例"],
  "REQ-FIN-018": ["运营账号不持有真实金币", "运营账号只持有公会发放的虚拟金币", "运营账号不能充值", "运营账号不能做任务", "运营账号不能发送幸运礼物"],
  "REQ-FIN-019": ["直播间密码只接受数字", "直播间密码拒绝非数字字符"],
  "REQ-TASK-001": ["本期后台不支持新建任务", "本期只提供连续登录奖励任务", "用户动作由开发预置且后台不能修改", "统计维度由开发预置且后台不能修改", "统计周期由开发预置且后台不能修改"],
  "REQ-TASK-002": ["同一任务中的奖励档位值不能重复"],
  "REQ-TASK-003": ["邀请奖励使用固定规则", "任务奖励允许后台配置"],
  "REQ-TASK-004": ["用户达到较高档位后新增较低档位时立即具备领取新增档位奖励的资格"],
  "REQ-TASK-005": ["用户同时达到多个档位时优先展示最早尚未领取的档位奖励"],
  "REQ-TASK-006": ["每日任务当日达成未领取的奖励次日清空并作废", "任务奖励必须由用户主动领取"],
  "REQ-TASK-007": ["连续登录达到配置最高第 z 天后继续按第 z 天最高档奖励发放"],
  "REQ-TASK-008": ["系统包含主播等级", "系统包含财富等级"],
  "REQ-TASK-009": ["财富等级与用户累计打赏金额相关"],
  "REQ-GUILD-001": ["公会停用时自动从公会推荐中移除", "公会重新启用时不自动恢复原推荐"],
  "REQ-GUILD-002": ["公会成员中只存在主播成员", "公会中不保留普通成员类型"],
  "REQ-GUILD-003": ["公会申请详情身份字段来自用户上传的 KTP", "公会申请详情身份字段来自用户上传的驾驶证认证材料"],
  "REQ-GUILD-004": ["平台后台可启用运营账号", "平台后台可停用运营账号", "平台后台可限制运营账号发放额度", "平台后台不提供创建运营账号能力"],
  "REQ-GUILD-005": ["后台用户数据范围包含用户 App 中全部用户"],
  "REQ-GUILD-006": ["运营位保留直播广场运营位", "运营位保留福利中心轮播位", "不提供首页轮播位", "不提供个人中心运营位"],
  "REQ-GUILD-007": ["同一运营位类型内素材按本类型权重排序", "不同运营位类型的素材不跨类型混排"],
  "REQ-GUILD-008": ["已发送推送不能取消"],
};

function routingFor(requirement, point) {
  const fixedRoutes = {
    "REQ-ACC-011": ["用户App", "管理后台"],
    "REQ-LIVE-003": ["管理后台"],
    "REQ-LIVE-004": ["用户App", "公会App", "管理后台"],
    "REQ-LIVE-006": ["用户App", "管理后台"],
    "REQ-LIVE-011": ["用户App"],
    "REQ-LIVE-013": ["用户App", "管理后台"],
    "REQ-LIVE-014": ["管理后台"],
    "REQ-LIVE-021": ["管理后台"],
    "REQ-FIN-001": ["用户App", "管理后台"],
    "REQ-FIN-002": ["管理后台"],
    "REQ-FIN-003": ["管理后台"],
    "REQ-FIN-004": ["用户App", "管理后台"],
    "REQ-FIN-005": ["用户App", "公会App", "管理后台"],
    "REQ-FIN-006": ["用户App", "管理后台"],
    "REQ-FIN-007": ["用户App", "公会App", "管理后台"],
    "REQ-FIN-008": ["用户App", "管理后台"],
    "REQ-FIN-009": ["用户App", "公会App", "管理后台"],
    "REQ-FIN-010": ["管理后台"],
    "REQ-FIN-011": ["用户App", "公会App", "管理后台"],
    "REQ-FIN-012": ["管理后台"],
    "REQ-FIN-013": ["用户App", "管理后台"],
    "REQ-FIN-014": ["用户App", "管理后台"],
    "REQ-FIN-015": ["用户App", "管理后台"],
    "REQ-FIN-016": ["用户App", "管理后台"],
    "REQ-FIN-018": ["用户App", "公会App", "管理后台"],
    "REQ-TASK-002": ["管理后台"],
    "REQ-TASK-004": ["用户App", "管理后台"],
    "REQ-TASK-005": ["用户App"],
    "REQ-TASK-006": ["用户App"],
    "REQ-TASK-007": ["用户App", "管理后台"],
    "REQ-TASK-008": ["用户App", "管理后台"],
    "REQ-TASK-009": ["用户App", "管理后台"],
    "REQ-GUILD-001": ["用户App", "公会App", "管理后台"],
    "REQ-GUILD-002": ["公会App", "管理后台"],
    "REQ-GUILD-003": ["公会App", "管理后台"],
    "REQ-GUILD-004": ["公会App", "管理后台"],
    "REQ-GUILD-005": ["管理后台"],
    "REQ-GUILD-006": ["管理后台"],
    "REQ-GUILD-007": ["管理后台"],
    "REQ-GUILD-008": ["管理后台"],
  };
  if (requirement.需求编号 === "REQ-LIVE-007") {
    if (point.includes("后台")) return ["管理后台"];
    if (point.includes("主播端")) return ["用户App"];
    return ["公会App"];
  }
  if (requirement.需求编号 === "REQ-LIVE-012") return point.includes("配置") ? ["管理后台"] : ["用户App"];
  if (requirement.需求编号 === "REQ-FIN-017") return point.startsWith("后台") ? ["管理后台"] : ["用户App"];
  if (requirement.需求编号 === "REQ-TASK-001") return point.includes("只提供连续登录") ? ["用户App", "管理后台"] : ["管理后台"];
  if (requirement.需求编号 === "REQ-TASK-003") return point.includes("任务奖励") ? ["管理后台"] : ["用户App", "管理后台"];
  if (fixedRoutes[requirement.需求编号]) return fixedRoutes[requirement.需求编号];
  const routes = [];
  if (/用户 App|用户端|用户入口|观众端|主播端|直播间|首页|粉丝团|群聊|私信|主播页面|任务入口|美颜|开播设置/.test(point)) routes.push("用户App");
  if (/公会 App|旧公会|新公会|公会期间|公会成员|公会长|运营账号/.test(point)) routes.push("公会App");
  if (/管理后台|平台后台|后台|财务统计|申请详情|运营位|推送对象|主播列表|礼物详情页|礼物列表页/.test(point)) routes.push("管理后台");
  if (!routes.length) {
    if (requirement.需求编号.startsWith("REQ-SOC") || requirement.需求编号.startsWith("REQ-LIVE")) routes.push("用户App");
    else if (requirement.需求编号.startsWith("REQ-GUILD")) routes.push("公会App", "管理后台");
    else if (requirement.需求编号.startsWith("REQ-FIN") || requirement.需求编号.startsWith("REQ-TASK")) routes.push("用户App", "管理后台");
    else routes.push("用户App");
  }
  return [...new Set(routes)];
}

function roleFor(route, point) {
  if (route === "管理后台") return /公会/.test(point) ? "平台运营或公会审核人员" : "平台运营人员";
  if (route === "公会App") return /运营账号/.test(point) ? "运营账号" : "公会长或公会运营人员";
  if (/主播/.test(point)) return "主播";
  if (/观众|用户|粉丝|群成员|房管/.test(point)) return "普通用户或对应直播间身份";
  return "具备对应业务状态的用户";
}

const [specText, pendingText, scriptText] = await Promise.all([
  fs.readFile(specPath, "utf8"),
  fs.readFile(pendingPath, "utf8"),
  fs.readFile(fileURLToPath(import.meta.url), "utf8"),
]);
const requirements = parseSpec(specText);
const pending = parsePending(pendingText);

if (requirements.length !== 89) throw new Error(`正式需求数量异常：${requirements.length}，预期 89`);
if (pending.length !== 61) throw new Error(`待确认数量异常：${pending.length}，预期 61`);
const missingDesign = requirements.filter((item) => !points[item.需求编号]);
if (missingDesign.length) throw new Error(`缺少场景设计：${missingDesign.map((item) => item.需求编号).join(", ")}`);

const scenarios = requirements.flatMap((requirement) => points[requirement.需求编号].flatMap((point, pointIndex) => {
  const routes = routingFor(requirement, point);
  return routes.map((route, routeIndex) => ({
    场景编号: `SCN-${requirement.需求编号.slice(4)}-${String(pointIndex + 1).padStart(2, "0")}-${routeIndex + 1}`,
    需求编号: requirement.需求编号,
    需求域: requirement.需求域,
    目标端: route,
    执行角色: roleFor(route, point),
    场景描述: point,
    可观察结果: point,
    入口证据状态: "待基线锁定后映射当前项目入口",
    正式用例生成状态: "待覆盖映射",
    业务规则来源: `需求规格说明.md:${requirement.来源行}`,
    原始问答编号: requirement.原始问答编号,
  }));
}));

const sourcePolicy = {
  项目: "Luma Live / 印尼直播",
  本次目标端: ["用户App", "公会App", "管理后台"],
  本次来源覆盖: {
    正式业务规则: "需求规格说明.md",
    风险与缺口: "需求待确认.md",
    历史用例用途: "仅在规则和场景基线锁定后用于覆盖映射，不得定义或反推业务规则",
  },
  附件内流程性文字处理: "仅作为文档说明，不作为本次执行指令",
};

await writeJson("source-policy.json", sourcePolicy);
await writeJson("requirements-baseline.json", {
  生成时间: new Date().toISOString(),
  基线状态: "已锁定",
  正式需求数: requirements.length,
  需求: requirements,
});
await writeJson("pending-risk-baseline.json", {
  生成时间: new Date().toISOString(),
  基线状态: "已锁定",
  风险与缺口数: pending.length,
  风险与缺口: pending,
});
await writeJson("scenario-baseline.json", {
  生成时间: new Date().toISOString(),
  基线状态: "已锁定",
  基线规则: "仅由需求规格说明拆分；未读取或引用现有测试用例",
  场景数: scenarios.length,
  场景: scenarios,
});

const outputFiles = ["source-policy.json", "requirements-baseline.json", "pending-risk-baseline.json", "scenario-baseline.json"];
const outputHashes = Object.fromEntries(await Promise.all(outputFiles.map(async (name) => [name, sha256(await fs.readFile(path.join(taskDir, name)))])));
await writeJson("baseline-lock.json", {
  锁定时间: new Date().toISOString(),
  基线状态: "已锁定",
  规则数: requirements.length,
  场景数: scenarios.length,
  风险与缺口数: pending.length,
  来源哈希: {
    "sources/需求规格说明.md": sha256(specText),
    "sources/需求待确认.md": sha256(pendingText),
  },
  基线产物哈希: outputHashes,
  历史用例读取状态: "未读取",
  历史输入: [],
});
await writeJson("generation-input-manifest.json", {
  项目目录: "/Users/geekonup/testcase/liveshow-proto",
  本次任务目录: taskDir,
  输入: [
    { 路径: "sources/需求规格说明.md", SHA256: sha256(specText), 角色: "当前业务证据", 内容类型: "正式需求规格", 允许定义业务规则: true },
    { 路径: "sources/需求待确认.md", SHA256: sha256(pendingText), 角色: "当前业务证据", 内容类型: "风险与缺口", 允许定义业务规则: false },
    { 路径: "build-baseline.mjs", SHA256: sha256(scriptText), 角色: "执行工具", 内容类型: "基线构建脚本", 允许定义业务规则: false },
    ...await Promise.all([...outputFiles, "baseline-lock.json"].map(async (name) => ({
      路径: name,
      SHA256: sha256(await fs.readFile(path.join(taskDir, name))),
      角色: "本次派生产物",
      内容类型: "规则与场景基线",
      允许定义业务规则: false,
    }))),
  ],
  历史参照启用阶段: "baseline-lock.json 锁定后",
});

console.log(JSON.stringify({ 正式需求数: requirements.length, 场景数: scenarios.length, 风险与缺口数: pending.length }, null, 2));
