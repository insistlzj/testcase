import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "/Users/geekonup/testcase";
const project = path.join(root, "liveshow-proto");
const work = path.join(root, "work/liveshow-user-app-all-260901-001");
const output = path.join(root, "outputs/Luma Live-case/用户App-全部模块-260901-001.xlsx");
const jsonPath = path.join(work, "用户App-全部模块-测试用例-260901-001.json");
const scanPath = path.join(work, "global-evidence-scan-result.json");
const syncPath = path.join(work, "prototype-context-sync-result.json");
const coveragePath = path.join(work, "page-coverage-map.json");
const flowPath = path.join(work, "cross-module-flow-map.json");
const inspectionPath = path.join(work, "inspection-260901-001.json");
const cachePath = path.join(root, "work/liveshow-proto-global-evidence-cache/latest.json");
const liveSource = path.join(root, "work/liveshow-user-live-testcases-260901-004/用户App-直播模块-测试用例-260901-004.json");
const clone = (v) => JSON.parse(JSON.stringify(v));
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const now = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()).replace(" ", "T") + "+08:00";

await fs.mkdir(work, { recursive: true });
await fs.mkdir(path.dirname(output), { recursive: true });

const sourceFiles = {
  page: "context/01-用户主播App-页面架构.md",
  req: "context/01-用户主播App-项目需求清单.md",
  overview: "context/系统概要 .md",
  proto: "prototype/Luma Live-原型说明.md",
  anno: "prototype/assets/annotations.js",
};

const modules = {
  AUTH: "用户App-系统入口",
  HOME: "用户App-首页与福利",
  LIVE: "用户App-直播",
  SOCIAL: "用户App-消息与社交",
  PROFILE: "用户App-我的与粉丝团",
  GUILD: "用户App-公会关系",
  HOST: "用户App-主播中心",
  WALLET: "用户App-钱包与账单",
};
const moduleOrder = Object.keys(modules);
const cases = [];
const add = (prefix, structure, title, pre, steps, expected, options = {}) => {
  cases.push({
    _prefix: prefix,
    序号: 0,
    用例编号: "",
    功能模块: modules[prefix],
    功能结构: structure,
    用例类型: options.type ?? "功能需求",
    优先级: options.priority ?? "P2",
    用例描述: `验证${title}`,
    验证用例子项: options.point ?? title,
    前置条件: Array.isArray(pre) ? pre : [pre],
    操作步骤: Array.isArray(steps) ? steps : [steps],
    预期结果: [expected],
    流程编号: options.flow ?? "",
    测试结果: "未测",
    测试人员: "",
    备注: [
      ...(options.sources ?? [`来源：${sourceFiles.req}`, `来源：${options.page ? `prototype/pages/user/${options.page}` : sourceFiles.proto}`]),
      "静态分析：依据当前原型、批注和需求文件生成，未进行真实接口或设备动态验证",
      `全局证据追溯：work/liveshow-user-app-all-260901-001/global-evidence-scan-result.json`,
    ],
    _page: options.page ?? "",
  });
};

const pageCatalog = [
  ["AUTH", "auth/auth-login-register.html", "登录与注册", "Google、手机号及第三方登录入口"],
  ["AUTH", "auth/auth-phone-login.html", "手机号登录", "短信验证码与密码两种登录方式"],
  ["AUTH", "auth/auth-profile-completion.html", "资料补全", "默认资料、预置头像、昵称与跳过入口"],
  ["HOME", "home/host-ranking.html", "主播榜", "当日、本周、本月主播收礼排名"],
  ["HOME", "home/contribution-ranking.html", "平台贡献榜", "当日、本周、本月用户送礼贡献排名"],
  ["HOME", "home/search.html", "搜索", "房间号、主播 ID 与主播昵称搜索"],
  ["HOME", "home/search-results.html", "搜索结果", "匹配主播、房间号、直播状态与无结果状态"],
  ["HOME", "home/welfare-center.html", "福利中心", "签到、任务、邀请和充值福利"],
  ["HOME", "home/invite-friends.html", "邀请好友", "邀请奖励、邀请记录与分享选项"],
  ["SOCIAL", "social/message-center.html", "消息中心", "系统通知、互动通知、私信与粉丝团会话"],
  ["SOCIAL", "social/system-notifications.html", "系统通知", "公会、主播身份和直播权限通知"],
  ["SOCIAL", "social/interaction-notifications.html", "互动通知", "关注通知、好友申请与处理结果"],
  ["SOCIAL", "social/direct-message.html", "一对一私信", "文字、图片和语音消息"],
  ["SOCIAL", "social/fan-group-chat.html", "粉丝团群聊", "群消息、公告和直播房间卡片"],
  ["SOCIAL", "social/group-manage-member.html", "群管理（成员）", "群公告、免打扰、举报与退出"],
  ["SOCIAL", "social/group-manage-owner.html", "群管理（群主）", "群公告编辑、禁言和成员管理"],
  ["SOCIAL", "social/chat-settings.html", "聊天设置", "消息免打扰、举报和账号拉黑"],
  ["SOCIAL", "social/friend-list.html", "好友列表", "好友搜索与主页入口"],
  ["SOCIAL", "social/user-home.html", "用户主页", "资料、关系状态、关注、好友与私信操作"],
  ["SOCIAL", "social/host-home.html", "主播主页", "主播资料、粉丝团、礼物展馆、贡献榜与直播入口"],
  ["SOCIAL", "social/host-gift-gallery.html", "主播礼物展馆", "已收到和未收到礼物状态"],
  ["PROFILE", "profile/profile.html", "我的", "资料、资产、装扮、粉丝团、主播中心与公会入口"],
  ["PROFILE", "profile/profile-edit.html", "资料编辑", "头像、背景图、昵称、签名、性别、地区和生日"],
  ["PROFILE", "profile/my-following.html", "我的关注", "已关注主播与开播状态"],
  ["PROFILE", "profile/my-decoration.html", "我的装扮", "头像框、聊天气泡和勋章穿戴状态"],
  ["PROFILE", "profile/my-decoration-avatar-frame.html", "头像框", "有效头像框与单个穿戴状态"],
  ["PROFILE", "profile/my-decoration-chat-bubble.html", "聊天气泡", "有效期与单个穿戴状态"],
  ["PROFILE", "profile/my-decoration-medal.html", "勋章", "勋章列表与最多五个穿戴状态"],
  ["PROFILE", "profile/settings.html", "设置", "账号安全、通知、语言、注销与退出登录"],
  ["PROFILE", "profile/blacklist-management.html", "黑名单管理", "账号黑名单列表与解除入口"],
  ["PROFILE", "fan-club/my-fan-clubs.html", "我的粉丝团", "已加入粉丝团、群聊与贡献榜入口"],
  ["PROFILE", "fan-club/fan-contribution-ranking.html", "粉丝团贡献榜", "本周、本月、累计排名与我的排名"],
  ["GUILD", "guild/guild-management.html", "公会中心", "推荐公会、实时搜索与我的公会入口"],
  ["GUILD", "guild/guild-application-form.html", "申请加入公会", "申请资料和认证材料提交"],
  ["GUILD", "guild/guild-application-records.html", "我的公会", "当前账号申请过的公会"],
  ["GUILD", "guild/guild-detail.html", "公会详情", "入会和退会申请时间轴"],
  ["GUILD", "guild/guild-leave-application.html", "申请退出公会", "只读公会信息、退出原因与提交"],
  ["HOST", "host/host-center.html", "主播中心", "主播等级、收益、有效天、直播数据与主播工具"],
  ["HOST", "host/host-center-pending.html", "申请成为主播", "加入公会、申请直播权限和开始直播三步状态"],
  ["HOST", "host/moderator-management.html", "房管管理", "房管列表、添加与取消房管"],
  ["HOST", "host/host-guild-notifications.html", "公会通知", "纯文字、图片加文字和长内容展开"],
  ["HOST", "host/fan-list.html", "粉丝列表", "粉丝资料、财富等级与装扮图标"],
  ["HOST", "host/fan-club.html", "主播粉丝团", "成员、加入规则、排序与移除"],
  ["HOST", "host/fan-club-settings.html", "粉丝团设置", "名称、关注要求和累计贡献条件"],
  ["HOST", "host/live-data.html", "直播数据", "日数据、月数据、趋势和有效天"],
  ["HOST", "host/income-withdrawal.html", "收益与分成记录", "累计收益、账户金额和分成记录"],
  ["HOST", "host/my-bank-cards.html", "我的银行卡", "空态、已绑定银行卡和移除操作"],
  ["HOST", "host/add-bank-card.html", "添加银行卡", "银行、账号和收款人姓名"],
  ["HOST", "host/withdrawal-application.html", "提现填写", "提现金额和到账银行卡"],
  ["WALLET", "wallet/recharge.html", "余额充值", "金币余额、活动套餐和常规套餐"],
  ["WALLET", "wallet/balance-detail.html", "余额明细", "充值、礼物和门票金币流水"],
  ["WALLET", "wallet/order-income-detail.html", "充值订单详情", "套餐、金币入账、法币金额、渠道和状态"],
  ["WALLET", "wallet/order-expense-detail.html", "支出订单详情", "礼物或门票扣款与直播间信息"],
];

for (const [prefix, file, structure, content] of pageCatalog) {
  const role = prefix === "AUTH" ? "用户当前未登录" : prefix === "HOST" ? "已具备访问该主播页面所需身份或状态" : "用户已登录";
  add(prefix, structure, `${structure}核心业务信息`, [role, `已进入“${structure}”页面`], "查看页面主要业务区域", `页面展示${content}`, { page: file, point: `${structure}核心信息` });
}

// 系统入口
add("AUTH", "登录与注册", "首次启动必须同意协议", "用户首次启动 App 且尚未同意协议", ["保持协议未勾选", "尝试进入 App"], "App 不进入登录后的业务页面", { priority: "P0", type: "逻辑校验", page: "auth/auth-login-register.html" });
for (const provider of ["Google", "Facebook", "TikTok"]) add("AUTH", "登录与注册", `${provider} 老用户授权登录`, `已注册用户已绑定 ${provider} 账号`, [`点击“${provider}”登录`, "完成第三方授权"], "页面进入首页", { priority: "P0", type: "业务流程", page: "auth/auth-login-register.html" });
add("AUTH", "登录与注册", "Apple ID 仅在 iOS 展示", "分别准备 iOS 与 Android 设备", ["在两种设备进入登录与注册页", "查看第三方登录入口"], "Apple ID 登录入口仅在 iOS 设备展示", { type: "逻辑校验", page: "auth/auth-login-register.html" });
add("AUTH", "登录与注册", "第三方新用户进入资料补全", "第三方账号从未登录 Luma Live", ["选择任一已展示的第三方登录方式", "完成授权"], "页面直接进入资料补全", { priority: "P0", type: "业务流程", flow: "FLOW-UAPP-REGISTER-01", page: "auth/auth-login-register.html" });
add("AUTH", "资料补全", "保存非空昵称进入首页", "新用户已进入资料补全页", ["选择预置头像", "填写非空昵称", "点击保存"], "页面进入首页", { priority: "P0", type: "业务流程", flow: "FLOW-UAPP-REGISTER-01", page: "auth/auth-profile-completion.html" });
add("AUTH", "资料补全", "跳过资料补全保留默认资料", "新用户资料补全页已展示系统默认头像和昵称", "点击跳过", "页面进入首页且系统默认头像和昵称保持不变", { type: "业务流程", flow: "FLOW-UAPP-REGISTER-01", page: "auth/auth-profile-completion.html" });
add("AUTH", "手机号登录", "验证码登录成功", ["已注册手机号状态可用", "可接收短信验证码"], ["输入带国家区号的手机号", "获取并填写有效 6 位验证码", "点击登录"], "页面进入首页", { priority: "P0", type: "业务流程", page: "auth/auth-phone-login.html" });
add("AUTH", "手机号登录", "验证码 60 秒内不可重复获取", "用户已点击获取验证码", "在倒计时未结束时再次点击获取验证码", "获取验证码按钮保持不可用", { type: "逻辑校验", page: "auth/auth-phone-login.html" });
add("AUTH", "手机号登录", "验证码连续错误五次后失效", "用户已获取当前有效验证码", ["连续 5 次填写错误验证码并提交", "第 6 次填写原正确验证码并提交"], "原验证码不能继续完成登录", { priority: "P1", type: "异常用例", page: "auth/auth-phone-login.html" });
add("AUTH", "手机号登录", "过期验证码不能登录", "用户获取验证码后已超过 5 分钟", ["填写该验证码", "点击登录"], "用户不能使用已过期验证码完成登录", { priority: "P1", type: "异常用例", page: "auth/auth-phone-login.html" });
add("AUTH", "手机号登录", "短信下发失败后重新获取", "短信网关返回下发失败", ["点击获取验证码", "在重新获取入口可用后再次获取"], "系统重新发起验证码获取请求", { type: "异常用例", page: "auth/auth-phone-login.html" });
add("AUTH", "手机号登录", "有效密码登录", "已注册手机号已设置密码且账号可用", ["切换到密码登录", "填写有效手机号和密码", "点击登录"], "页面进入首页", { priority: "P0", type: "业务流程", page: "auth/auth-phone-login.html" });
add("AUTH", "手机号登录", "错误密码不进入首页", "已注册手机号状态可用", ["切换到密码登录", "填写错误密码", "点击登录"], "页面不进入首页", { type: "异常用例", page: "auth/auth-phone-login.html" });
add("AUTH", "账号绑定", "充值前要求绑定手机号", "第三方登录用户尚未绑定手机号", ["进入充值流程", "尝试提交充值"], "系统拦截充值提交并要求绑定手机号", { priority: "P1", type: "逻辑校验", flow: "FLOW-UAPP-ACCOUNT-BIND-01", page: "profile/profile.html" });
add("AUTH", "账号绑定", "主播认证前要求绑定手机号", "第三方登录用户尚未绑定手机号", ["进入申请成为主播流程", "尝试提交认证资料"], "系统拦截认证提交并要求绑定手机号", { priority: "P1", type: "逻辑校验", flow: "FLOW-UAPP-ACCOUNT-BIND-01", page: "host/host-center-pending.html" });

// 首页、榜单、搜索、福利与邀请
for (const [structure, page, target] of [["主播榜", "home/host-ranking.html", "主播收礼排名"], ["平台贡献榜", "home/contribution-ranking.html", "用户送礼贡献排名"]]) {
  for (const period of ["当日", "本周", "本月"]) add("HOME", structure, `${period}${target}`, `后台存在${period}${target}数据`, [`进入“${structure}”`, `切换到“${period}”`], `榜单按${period}${target}排序并展示对应数值`, { page, type: "逻辑校验" });
}
add("HOME", "主播榜", "点击主播进入主播主页", "主播榜存在目标主播记录", ["进入主播榜", "点击目标主播"], "页面进入该主播主页", { page: "home/host-ranking.html", type: "业务流程" });
add("HOME", "平台贡献榜", "点击用户进入用户主页", "平台贡献榜存在目标用户记录", ["进入平台贡献榜", "点击目标用户"], "页面进入该用户主页", { page: "home/contribution-ranking.html", type: "业务流程" });
for (const [kind, input, result] of [["房间号", "620100", "匹配该房间号的主播"], ["主播 ID", "目标主播 ID", "匹配该 ID 的主播"], ["主播昵称", "目标主播昵称", "匹配该昵称的主播"]]) add("HOME", "搜索", `${kind}搜索`, "存在可检索的目标主播", ["进入搜索页", `输入${input}`, "提交搜索"], `搜索结果只展示${result}`, { page: "home/search.html", type: "逻辑校验" });
add("HOME", "搜索", "空关键词不跳转", "用户已进入搜索页", ["保持搜索词为空", "提交搜索"], "页面停留在搜索页", { page: "home/search.html", type: "异常用例" });
add("HOME", "搜索结果", "直播中结果进入直播间", "搜索结果包含正在直播的目标主播", "点击该主播头像或“直播中”", "页面进入该主播当前直播间", { priority: "P1", page: "home/search-results.html", type: "业务流程" });
add("HOME", "搜索结果", "未直播结果进入主播主页", "搜索结果包含未直播的目标主播", "点击该主播头像", "页面进入该主播主页", { page: "home/search-results.html", type: "业务流程" });
add("HOME", "搜索结果", "搜索无匹配结果", "不存在与输入词匹配的主播或房间", ["输入无匹配关键词", "提交搜索"], "页面保留搜索框并展示无结果空状态", { page: "home/search-results.html", type: "异常用例" });
add("HOME", "福利中心", "领取签到奖励写入金币流水", "当天存在可领取的签到金币奖励", ["进入福利中心", "领取签到奖励", "进入余额明细"], "余额明细新增该签到金币入账记录", { priority: "P1", type: "业务流程", flow: "FLOW-UAPP-REWARD-01", page: "home/welfare-center.html" });
add("HOME", "福利中心", "已领取签到不可重复领取", "用户当天已领取签到奖励", "再次点击当天签到奖励", "系统不重复发放签到奖励", { priority: "P1", type: "逻辑校验", page: "home/welfare-center.html" });
add("HOME", "福利中心", "任务进度随用户动作更新", "存在观看直播任务且当前进度未完成", ["完成要求的观看直播动作", "返回福利中心刷新任务"], "该任务进度按本次动作增加", { type: "业务流程", flow: "FLOW-UAPP-TASK-01", page: "home/welfare-center.html" });
add("HOME", "福利中心", "领取任务奖励写入金币流水", "金币任务已完成且奖励待领取", ["领取任务奖励", "进入余额明细"], "余额明细新增该任务金币入账记录", { priority: "P1", type: "业务流程", flow: "FLOW-UAPP-TASK-01", page: "home/welfare-center.html" });
add("HOME", "福利中心", "运营下架任务后不再展示", "后台已将目标任务设为不生效", ["进入福利中心", "查看任务列表"], "任务列表不展示该目标任务", { type: "逻辑校验", page: "home/welfare-center.html", sources: [`来源：${sourceFiles.req}`, "来源：prototype/assets/annotations.js 的福利配置批注", "来源：context/03-管理后台-项目需求清单.md"] });
add("HOME", "邀请好友", "打开三种邀请分享选项", "用户已进入邀请好友页", "点击邀请好友", "页面展示复制邀请链接、发送邀请卡片和保存图片三种选项", { page: "home/invite-friends.html" });
add("HOME", "邀请好友", "复制邀请链接", "邀请分享选项已打开", "点击复制邀请链接", "系统反馈邀请链接已复制", { page: "home/invite-friends.html", type: "业务流程" });
add("HOME", "邀请好友", "邀请记录按成功时间展示", "用户已有多条邀请成功记录", ["进入邀请好友页", "切换到邀请记录"], "记录按邀请成功时间展示好友昵称和邀请日期", { page: "home/invite-friends.html", type: "逻辑校验" });
add("HOME", "邀请绑定", "新用户首次绑定邀请码", "新用户尚未绑定邀请关系且持有有效邀请码", ["在注册流程填写邀请码", "完成注册"], "系统建立新用户与邀请人的唯一绑定关系", { priority: "P1", type: "业务流程", flow: "FLOW-UAPP-INVITE-01", page: "home/invite-friends.html" });
add("HOME", "邀请绑定", "已绑定用户不能更换邀请人", "用户已存在邀请绑定关系", ["尝试填写另一邀请码", "提交绑定"], "原邀请绑定关系保持不变", { priority: "P1", type: "逻辑校验", flow: "FLOW-UAPP-INVITE-01", page: "home/invite-friends.html" });
add("HOME", "邀请奖励", "注册奖励发放给邀请人", "后台已配置邀请注册奖励且新用户成功绑定邀请关系", ["邀请人进入邀请好友页", "查看累计获赠金币"], "累计获赠金币包含本次注册奖励", { priority: "P1", type: "业务流程", flow: "FLOW-UAPP-INVITE-01", page: "home/invite-friends.html" });
add("HOME", "邀请奖励", "命中风控时奖励不进入可用余额", "邀请关系命中后台已配置的防刷规则", ["完成触发邀请奖励的注册或充值动作", "邀请人查看金币余额"], "本次邀请奖励不增加邀请人的可用金币余额", { priority: "P1", type: "逻辑校验", flow: "FLOW-UAPP-INVITE-01", page: "home/invite-friends.html" });

// 消息与社交
add("SOCIAL", "消息中心", "通知与会话分区", "用户存在系统通知、互动通知、私信和粉丝团消息", "进入消息中心", "系统通知、互动通知、私信与粉丝团消息分别展示在对应入口或会话区域", { page: "social/message-center.html" });
add("SOCIAL", "消息中心", "私信会话未读数更新", "目标私信会话存在未读消息", ["进入消息中心", "打开目标私信会话", "返回消息中心"], "目标私信会话的未读数被清除", { page: "social/message-center.html", type: "业务流程" });
add("SOCIAL", "系统通知", "公会申请结果不进入私信", "用户存在公会申请结果通知", ["进入消息中心", "打开系统通知"], "公会申请结果展示在系统通知列表", { page: "social/system-notifications.html", type: "逻辑校验" });
add("SOCIAL", "系统通知", "直播权限变更通知", "主播的直播权限已被开启或关闭", ["主播进入系统通知", "查看最新通知"], "列表展示与本次直播权限变更对应的通知", { priority: "P1", page: "social/system-notifications.html", type: "业务流程", flow: "FLOW-UAPP-HOST-PERMISSION-01" });
add("SOCIAL", "互动通知", "同意好友申请", "用户收到一条待处理好友申请", ["进入互动通知", "点击该申请的同意"], "该通知更新为已同意结果", { priority: "P1", page: "social/interaction-notifications.html", type: "业务流程", flow: "FLOW-UAPP-FRIEND-01" });
add("SOCIAL", "互动通知", "拒绝好友申请", "用户收到一条待处理好友申请", ["进入互动通知", "点击该申请的拒绝"], "该通知更新为已拒绝结果", { page: "social/interaction-notifications.html", type: "业务流程", flow: "FLOW-UAPP-FRIEND-01" });
add("SOCIAL", "互动通知", "处理后的申请不可重复处理", "好友申请已被同意或拒绝", "再次查看该条互动通知", "该通知不再展示同意或拒绝操作", { page: "social/interaction-notifications.html", type: "逻辑校验" });
for (const media of ["文字", "图片", "语音"]) add("SOCIAL", "一对一私信", `发送${media}消息`, "双方具备当前私信权限且不存在账号拉黑关系", ["进入一对一私信会话", `发送一条${media}消息`], `${media}消息插入当前消息流`, { page: "social/direct-message.html", type: "业务流程" });
add("SOCIAL", "一对一私信", "黑名单关系阻止发送消息", "当前用户与会话对象存在账号拉黑关系", ["进入原一对一会话", "尝试发送文字消息"], "文字消息不进入当前消息流", { priority: "P1", page: "social/direct-message.html", type: "逻辑校验", flow: "FLOW-UAPP-BLOCK-01" });
for (const media of ["文字", "图片", "语音"]) add("SOCIAL", "粉丝团群聊", `发送群聊${media}消息`, "用户具有有效团籍且未被群禁言或平台禁言", ["进入粉丝团群聊", `发送一条${media}消息`], `${media}消息插入当前群消息流`, { page: "social/fan-group-chat.html", type: "业务流程" });
add("SOCIAL", "粉丝团群聊", "直播中房间卡片进入直播间", "群消息包含仍在直播的房间卡片", "点击该直播房间卡片", "页面进入卡片对应直播间", { priority: "P1", page: "social/fan-group-chat.html", type: "业务流程" });
add("SOCIAL", "粉丝团群聊", "已结束房间卡片不能进房", "群消息包含已结束直播的房间卡片", "点击该直播房间卡片", "系统提示该直播已结束", { page: "social/fan-group-chat.html", type: "异常用例" });
add("SOCIAL", "粉丝团群聊", "无有效团籍不能发言", "用户的粉丝团团籍已解除", ["重新进入原粉丝团群聊", "尝试发送文字消息"], "文字消息不进入群消息流", { priority: "P1", page: "social/fan-group-chat.html", type: "逻辑校验", flow: "FLOW-UAPP-FANCLUB-01" });
add("SOCIAL", "群管理（成员）", "开启群消息免打扰不影响收发", "用户是粉丝团成员", ["进入群管理", "开启消息免打扰", "返回群聊并发送消息"], "发送的消息进入群消息流", { page: "social/group-manage-member.html", type: "逻辑校验" });
add("SOCIAL", "群管理（成员）", "主动退出同步解除团籍和群籍", "用户具有有效团籍和群籍", ["进入群管理", "点击退出群聊", "确认退出"], "用户的粉丝团团籍与群籍同时解除", { priority: "P1", page: "social/group-manage-member.html", type: "业务流程", flow: "FLOW-UAPP-FANCLUB-01" });
add("SOCIAL", "群管理（成员）", "取消退出保留团籍", "用户具有有效团籍和群籍", ["进入群管理", "点击退出群聊", "取消确认"], "用户的粉丝团团籍保持有效", { page: "social/group-manage-member.html", type: "逻辑校验" });
add("SOCIAL", "群管理（群主）", "编辑群公告", "主播是当前粉丝团群主", ["进入群管理", "编辑并保存群公告"], "群聊展示保存后的群公告内容", { priority: "P1", page: "social/group-manage-owner.html", type: "业务流程" });
add("SOCIAL", "群管理（群主）", "单人禁言限制目标成员发言", "主播是群主且目标成员具有有效团籍", ["在群管理选择目标成员", "执行单人禁言", "目标成员尝试发送消息"], "目标成员的消息不进入群消息流", { priority: "P1", page: "social/group-manage-owner.html", type: "业务流程" });
add("SOCIAL", "群管理（群主）", "移出成员同步解除团籍", "主播是群主且目标成员具有有效团籍", ["选择目标成员", "点击移出", "确认移出"], "目标成员的粉丝团团籍被解除", { priority: "P1", page: "social/group-manage-owner.html", type: "业务流程", flow: "FLOW-UAPP-FANCLUB-01" });
add("SOCIAL", "群管理（群主）", "移出成员清零前台关系成长值", "目标成员已有粉丝等级和亲密度", ["群主确认移出目标成员", "目标用户查看与该主播的粉丝团关系"], "目标用户的粉丝等级和亲密度在前台显示为 0", { priority: "P1", page: "social/group-manage-owner.html", type: "业务流程", flow: "FLOW-UAPP-FANCLUB-01" });
add("SOCIAL", "聊天设置", "开启单聊免打扰不影响收发", "用户与会话对象具备私信权限", ["进入聊天设置", "开启消息免打扰", "返回会话发送消息"], "发送的消息进入当前会话", { page: "social/chat-settings.html", type: "逻辑校验" });
add("SOCIAL", "聊天设置", "举报进入用户举报页", "用户已进入聊天设置", "点击举报", "页面进入举报用户流程", { page: "social/chat-settings.html", type: "业务流程" });
add("SOCIAL", "好友列表", "按昵称搜索好友", "好友列表存在目标好友", ["进入好友列表", "输入目标好友昵称"], "列表只展示昵称匹配的好友", { page: "social/friend-list.html", type: "逻辑校验" });
add("SOCIAL", "好友列表", "点击主播好友进入主播主页", "好友列表存在主播身份好友", "点击该好友头像", "页面进入该主播主页", { page: "social/friend-list.html", type: "业务流程" });
add("SOCIAL", "用户主页", "关注用户增加关系计数", "当前用户尚未关注目标用户且双方无账号拉黑关系", ["进入目标用户主页", "点击关注"], "当前用户关注数与目标用户粉丝数各增加 1", { priority: "P1", page: "social/user-home.html", type: "业务流程", flow: "FLOW-UAPP-FOLLOW-01" });
add("SOCIAL", "用户主页", "重复好友申请被阻止", "已向目标用户发送待处理好友申请", ["进入目标用户主页", "再次点击加好友"], "系统不生成第二条待处理好友申请", { priority: "P1", page: "social/user-home.html", type: "逻辑校验", flow: "FLOW-UAPP-FRIEND-01" });
add("SOCIAL", "用户主页", "删除好友解除好友关系", "双方当前是好友", ["进入目标用户主页更多操作", "选择删除好友", "确认删除"], "双方好友关系解除", { priority: "P1", page: "social/user-home.html", type: "业务流程", flow: "FLOW-UAPP-FRIEND-01" });
add("SOCIAL", "用户主页", "账号拉黑后隐藏底部操作", "双方当前不存在账号拉黑关系", ["进入目标用户主页更多操作", "选择拉黑并确认"], "目标用户主页隐藏关注、加好友和私信操作", { priority: "P1", page: "social/user-home.html", type: "业务流程", flow: "FLOW-UAPP-BLOCK-01" });
add("SOCIAL", "主播主页", "直播中展示进房入口", "目标主播正在直播且双方无账号拉黑关系", "进入目标主播主页", "主播主页展示当前直播间入口", { priority: "P1", page: "social/host-home.html", type: "功能需求" });
add("SOCIAL", "主播主页", "未直播时不展示进房入口", "目标主播当前未直播", "进入目标主播主页", "主播主页不展示直播间入口", { page: "social/host-home.html", type: "逻辑校验" });
add("SOCIAL", "主播主页", "已入团用户进入粉丝团贡献榜", "用户已加入目标主播粉丝团", ["进入目标主播主页", "点击粉丝团入口"], "页面进入该主播粉丝团贡献榜", { page: "social/host-home.html", type: "业务流程" });
add("SOCIAL", "主播主页", "未入团用户打开加入弹层", "用户尚未加入目标主播粉丝团", ["进入目标主播主页", "点击粉丝团入口"], "页面打开该主播粉丝团加入弹层", { page: "social/host-home.html", type: "业务流程" });
add("SOCIAL", "主播礼物展馆", "已收到礼物展示累计数量", "目标主播已收到目标礼物", "进入该主播礼物展馆", "目标礼物展示累计收到数量", { page: "social/host-gift-gallery.html", type: "逻辑校验" });
add("SOCIAL", "主播礼物展馆", "未收到礼物显示未收到状态", "目标主播从未收到目标礼物", "进入该主播礼物展馆", "目标礼物置灰并显示“未收到”", { page: "social/host-gift-gallery.html", type: "逻辑校验" });

// 我的、资料、装扮与粉丝团
add("PROFILE", "我的", "底部四项导航互相切换", "用户已登录", ["依次点击首页、福利、消息、我的"], "每次点击均进入对应底部主页面", { priority: "P0", page: "profile/profile.html", type: "业务流程" });
add("PROFILE", "我的", "普通用户进入主播申请页", "当前账号尚未成为主播", ["进入我的", "点击主播中心"], "页面进入申请成为主播页", { priority: "P1", page: "profile/profile.html", type: "业务流程" });
add("PROFILE", "我的", "已认证主播进入主播中心", "当前账号已获得主播身份", ["进入我的", "点击主播中心"], "页面进入主播中心", { priority: "P1", page: "profile/profile.html", type: "业务流程" });
add("PROFILE", "资料编辑", "头像修改进入风控检测", "用户已进入资料编辑页", ["选择新头像", "提交资料"], "头像显示风控检测中状态", { priority: "P1", page: "profile/profile-edit.html", type: "业务流程", flow: "FLOW-UAPP-PROFILE-RISK-01" });
add("PROFILE", "资料编辑", "头像检测通过后生效", "新头像已提交且后台风控检测通过", ["重新进入资料编辑页", "查看头像"], "页面回显检测通过的新头像", { priority: "P1", page: "profile/profile-edit.html", type: "业务流程", flow: "FLOW-UAPP-PROFILE-RISK-01" });
add("PROFILE", "资料编辑", "头像检测不通过保留原头像", "新头像已提交且后台风控检测不通过", ["重新进入资料编辑页", "查看头像"], "页面仍回显提交前的原头像", { priority: "P1", page: "profile/profile-edit.html", type: "业务流程", flow: "FLOW-UAPP-PROFILE-RISK-01" });
add("PROFILE", "资料编辑", "昵称修改进入风控检测", "用户已进入资料编辑页", ["填写新昵称", "提交资料"], "昵称显示风控检测中状态", { priority: "P1", page: "profile/profile-edit.html", type: "业务流程", flow: "FLOW-UAPP-PROFILE-RISK-01" });
add("PROFILE", "资料编辑", "昵称检测不通过保留原昵称", "新昵称已提交且后台风控检测不通过", ["重新进入资料编辑页", "查看昵称"], "页面仍回显提交前的原昵称", { priority: "P1", page: "profile/profile-edit.html", type: "业务流程", flow: "FLOW-UAPP-PROFILE-RISK-01" });
for (const field of ["背景图", "个性签名", "性别", "地区", "生日"]) add("PROFILE", "资料编辑", `${field}修改直接生效`, "用户已进入资料编辑页", [`修改${field}`, "保存资料", "重新进入资料编辑页"], `页面回显保存后的${field}`, { page: "profile/profile-edit.html", type: "业务流程" });
add("PROFILE", "我的关注", "开播主播进入直播间", "关注列表存在正在直播的主播", "点击该主播", "页面进入该主播当前直播间", { page: "profile/my-following.html", type: "业务流程" });
add("PROFILE", "我的关注", "未开播主播进入主播主页", "关注列表存在未直播的主播", "点击该主播", "页面进入该主播主页", { page: "profile/my-following.html", type: "业务流程" });
add("PROFILE", "头像框", "穿戴头像框替换同类旧装扮", "用户已拥有两个有效头像框且已穿戴其中一个", ["进入头像框页面", "穿戴另一个头像框"], "新头像框变为穿戴中且原头像框取消穿戴", { page: "profile/my-decoration-avatar-frame.html", type: "业务流程" });
add("PROFILE", "聊天气泡", "过期聊天气泡不可穿戴", "用户拥有一个已过期聊天气泡", ["进入聊天气泡页面", "尝试穿戴该气泡"], "该聊天气泡不会变为穿戴中", { priority: "P1", page: "profile/my-decoration-chat-bubble.html", type: "逻辑校验" });
add("PROFILE", "勋章", "最多穿戴五个勋章", "用户已穿戴 5 个有效勋章并另有 1 个未穿戴勋章", ["进入勋章页面", "尝试穿戴第 6 个勋章"], "已穿戴勋章数量保持为 5", { priority: "P1", page: "profile/my-decoration-medal.html", type: "逻辑校验" });
add("PROFILE", "我的装扮", "道具到期后停止展示", "用户当前穿戴的头像框已到期", ["重新进入我的装扮", "查看头像框状态"], "已到期头像框不再显示为穿戴中", { priority: "P1", page: "profile/my-decoration.html", type: "逻辑校验" });
add("PROFILE", "设置", "切换英语", "当前界面语言不是英语", ["进入设置", "将语言切换为英语"], "用户 App 的可翻译界面文案切换为英语", { page: "profile/settings.html", type: "业务流程" });
add("PROFILE", "设置", "切换马来西亚语", "当前界面语言不是马来西亚语", ["进入设置", "将语言切换为马来西亚语"], "用户 App 的可翻译界面文案切换为马来西亚语", { page: "profile/settings.html", type: "业务流程" });
add("PROFILE", "设置", "切换印尼语", "当前界面语言不是印尼语", ["进入设置", "将语言切换为印尼语"], "用户 App 的可翻译界面文案切换为印尼语", { page: "profile/settings.html", type: "业务流程" });
add("PROFILE", "设置", "退出登录仅清除当前设备会话", "同一账号已在两台设备登录", ["在设备 A 进入设置", "点击退出登录", "在设备 B 刷新登录态"], "设备 B 的登录会话保持有效", { priority: "P1", page: "profile/settings.html", type: "逻辑校验" });
add("PROFILE", "设置", "有未消费金币时不能提交注销", "用户金币余额大于 0", ["进入设置的账号注销", "确认提交注销申请"], "系统不接受本次注销申请", { priority: "P1", page: "profile/settings.html", type: "逻辑校验" });
add("PROFILE", "设置", "有未处理收益时不能提交注销", "主播存在未处理收益", ["进入设置的账号注销", "确认提交注销申请"], "系统不接受本次注销申请", { priority: "P1", page: "profile/settings.html", type: "逻辑校验" });
add("PROFILE", "黑名单管理", "解除账号拉黑", "账号黑名单中存在目标用户", ["进入黑名单管理", "点击目标用户的解除", "确认解除"], "目标用户从账号黑名单列表移除", { priority: "P1", page: "profile/blacklist-management.html", type: "业务流程", flow: "FLOW-UAPP-BLOCK-01" });
add("PROFILE", "黑名单管理", "账号黑名单不包含直播间黑名单", "主播仅在某场直播中将目标用户加入直播间黑名单", "进入账号黑名单管理", "账号黑名单列表不因该直播间黑名单关系新增目标用户", { priority: "P1", page: "profile/blacklist-management.html", type: "逻辑校验" });
add("PROFILE", "我的粉丝团", "进入粉丝团群聊", "用户已加入目标主播粉丝团", ["进入我的粉丝团", "点击该粉丝团群聊入口"], "页面进入该粉丝团群聊", { page: "fan-club/my-fan-clubs.html", type: "业务流程" });
for (const period of ["本周", "本月", "累计"]) add("PROFILE", "粉丝团贡献榜", `${period}贡献排名`, `目标粉丝团存在${period}贡献数据`, [`进入粉丝团贡献榜`, `切换到“${period}”`], `前三、榜单列表和我的排名同步展示${period}数据`, { page: "fan-club/fan-contribution-ranking.html", type: "逻辑校验" });

// 公会关系
add("GUILD", "公会中心", "默认只展示后台配置的五个公会", "后台已配置 5 个推荐公会且存在其他未推荐公会", "进入公会中心", "默认列表仅展示后台配置的 5 个推荐公会", { priority: "P1", page: "guild/guild-management.html", type: "逻辑校验", sources: [`来源：${sourceFiles.req}`, "来源：prototype/assets/annotations.js 的公会展示范围批注", "来源：context/03-管理后台-项目需求清单.md"] });
for (const [kind, input] of [["公会名称", "目标公会名称"], ["公会 ID", "目标公会 ID"]]) add("GUILD", "公会中心", `${kind}实时搜索`, "存在不在默认五个公会中的目标公会", ["进入公会中心", `输入${input}`], "搜索结果展示目标公会", { page: "guild/guild-management.html", type: "逻辑校验" });
add("GUILD", "公会中心", "无匹配公会显示空态", "不存在与关键词匹配的公会", ["进入公会中心", "输入无匹配关键词"], "列表展示无匹配结果空态", { page: "guild/guild-management.html", type: "异常用例" });
add("GUILD", "公会中心", "我的入口进入申请记录", "用户已提交过公会申请", ["进入公会中心", "点击我的"], "页面进入我的公会并展示当前账号申请记录", { page: "guild/guild-management.html", type: "业务流程" });
add("GUILD", "申请加入公会", "有效资料提交入会申请", "用户未加入公会且不存在处理中入会申请", ["选择目标公会", "填写真实姓名和手机号", "上传原型要求的认证材料", "提交申请"], "系统生成一笔待审核入会申请", { priority: "P0", page: "guild/guild-application-form.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "申请加入公会", "提交后进入公会详情时间轴", "用户未加入公会且申请资料合法", ["提交目标公会入会申请", "查看返回页面"], "公会详情时间轴展示本次加入审核中记录", { priority: "P1", page: "guild/guild-application-form.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "申请加入公会", "处理中申请阻止再次提交", "用户已存在一笔待审核或平台终审中的入会申请", ["选择另一公会", "尝试提交入会申请"], "系统不生成第二笔处理中入会申请", { priority: "P1", page: "guild/guild-application-form.html", type: "逻辑校验", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "申请加入公会", "已加入公会阻止再次入会", "用户已加入一个有效公会", ["进入另一公会申请页", "尝试提交入会申请"], "系统不生成新的入会申请", { priority: "P1", page: "guild/guild-application-form.html", type: "逻辑校验", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "我的公会", "只展示当前账号申请过的公会", "账号申请过两个公会且平台还有其他公会", "进入我的公会", "列表只展示当前账号申请过的两个公会", { page: "guild/guild-application-records.html", type: "逻辑校验" });
add("GUILD", "公会详情", "申请时间轴按提交时间倒序", "用户存在多笔已结束的入会或退会申请", "进入公会详情", "申请记录按提交时间倒序排列", { page: "guild/guild-detail.html", type: "逻辑校验" });
add("GUILD", "公会详情", "公会驳回后可重新申请", "原入会申请已被公会驳回", ["进入公会详情", "重新发起入会申请"], "页面允许进入新的入会申请流程", { priority: "P1", page: "guild/guild-detail.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "公会详情", "平台驳回后可重新申请", "原入会申请已被平台驳回", ["进入公会详情", "重新发起入会申请"], "页面允许进入新的入会申请流程", { priority: "P1", page: "guild/guild-detail.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "公会关系", "平台终审通过后成为主播", "入会申请已由公会通过并由平台终审通过", ["重新进入我的公会", "进入主播中心"], "账号以主播身份进入主播中心", { priority: "P0", page: "guild/guild-detail.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("GUILD", "申请退出公会", "退出原因必填", "主播已加入有效公会且不存在处理中退会申请", ["进入申请退出公会页", "保持退出原因为空", "提交申请"], "系统不生成退会申请", { priority: "P1", page: "guild/guild-leave-application.html", type: "逻辑校验", flow: "FLOW-UAPP-GUILD-LEAVE-01" });
add("GUILD", "申请退出公会", "有效原因提交退会申请", "主播已加入有效公会且不存在处理中退会申请", ["进入申请退出公会页", "填写退出原因", "提交申请"], "系统生成一笔待审核退会申请", { priority: "P1", page: "guild/guild-leave-application.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-LEAVE-01" });
add("GUILD", "申请退出公会", "处理中退会申请不可重复发起", "主播已存在一笔待审核退会申请", ["进入公会详情", "查看退会操作"], "页面不提供再次发起退会申请的可用操作", { priority: "P1", page: "guild/guild-detail.html", type: "逻辑校验", flow: "FLOW-UAPP-GUILD-LEAVE-01" });
add("GUILD", "公会关系", "退会驳回后保持主播身份", "退会申请已被公会驳回", ["进入我的公会", "进入主播中心"], "账号仍以主播身份进入主播中心", { priority: "P1", page: "guild/guild-detail.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-LEAVE-01" });
add("GUILD", "公会关系", "退会通过后失去主播身份", "退会申请已被公会通过", ["进入我的公会", "进入主播中心"], "账号进入申请成为主播页而非主播工作台", { priority: "P0", page: "guild/guild-detail.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-LEAVE-01" });

// 主播中心（开播设置、直播记录和直播间由直播模块基线覆盖）
add("HOST", "申请成为主播", "未入会时下一步为加入公会", "普通用户尚未加入公会", "进入申请成为主播页", "加入公会步骤展示唯一可执行的下一步操作", { priority: "P1", page: "host/host-center-pending.html", type: "逻辑校验" });
add("HOST", "申请成为主播", "入会申请中回显申请状态", "用户已提交入会申请且仍在审核中", "进入申请成为主播页", "加入公会步骤展示申请中状态", { priority: "P1", page: "host/host-center-pending.html", type: "业务流程", flow: "FLOW-UAPP-GUILD-JOIN-01" });
add("HOST", "申请成为主播", "主播身份与直播权限分别回显", "账号已获得主播身份但直播权限尚未开启", "进入申请成为主播页", "页面显示主播身份已具备且直播权限未开通", { priority: "P1", page: "host/host-center-pending.html", type: "逻辑校验", flow: "FLOW-UAPP-HOST-PERMISSION-01" });
add("HOST", "主播中心", "直播权限开启后进入开播设置", "主播认证通过且直播权限已开启", ["进入主播中心", "点击开始直播"], "页面进入开播设置", { priority: "P0", page: "host/host-center.html", type: "业务流程", flow: "FLOW-UAPP-HOST-PERMISSION-01" });
add("HOST", "主播中心", "主播等级与财富等级分开展示", "主播同时具有主播等级和财富等级", "进入主播中心", "昵称旁展示主播等级且不以财富等级替代", { page: "host/host-center.html", type: "逻辑校验" });
add("HOST", "主播中心", "公会通知未读数", "主播存在多条未读公会通知", "进入主播中心", "公会通知入口展示对应未读数量", { page: "host/host-center.html", type: "逻辑校验" });
add("HOST", "公会通知", "长通知在当前卡片展开", "公会通知列表存在长内容通知", ["进入公会通知", "点击展开长内容"], "长内容在当前通知卡片内展开", { page: "host/host-guild-notifications.html", type: "业务流程" });
add("HOST", "公会通知", "通知不进入独立详情页", "公会通知列表存在长内容通知", ["进入公会通知", "点击该通知内容"], "页面保持在公会通知列表", { page: "host/host-guild-notifications.html", type: "逻辑校验" });
add("HOST", "房管管理", "通过用户 ID 添加房管", ["主播当前房管少于 3 人", "目标用户不在直播间黑名单内且双方无账号拉黑关系"], ["进入房管管理", "输入目标用户 ID", "确认添加"], "目标用户加入该主播房管列表", { priority: "P1", page: "host/moderator-management.html", type: "业务流程" });
add("HOST", "房管管理", "添加离线非好友用户为房管", ["目标用户当前离线且不是主播好友", "主播当前房管少于 3 人", "双方无账号拉黑且目标不在直播间黑名单"], ["输入目标用户 ID", "确认添加"], "目标用户加入该主播房管列表", { priority: "P1", page: "host/moderator-management.html", type: "逻辑校验" });
add("HOST", "房管管理", "第四名房管不能添加", "主播已有 3 名房管", ["输入另一合法用户 ID", "确认添加"], "主播房管数量保持为 3", { priority: "P1", page: "host/moderator-management.html", type: "逻辑校验" });
add("HOST", "房管管理", "直播间黑名单用户不能设为房管", "目标用户在该主播直播间黑名单内", ["输入目标用户 ID", "确认添加"], "目标用户不加入房管列表", { priority: "P1", page: "host/moderator-management.html", type: "逻辑校验" });
add("HOST", "房管管理", "账号拉黑关系阻止房管授权", "主播与目标用户存在账号拉黑关系", ["输入目标用户 ID", "确认添加"], "目标用户不加入房管列表", { priority: "P1", page: "host/moderator-management.html", type: "逻辑校验" });
add("HOST", "房管管理", "取消长期房管授权", "目标用户已是该主播的长期房管", ["进入房管管理", "取消目标用户房管", "确认取消"], "目标用户从房管列表移除", { priority: "P1", page: "host/moderator-management.html", type: "业务流程" });
add("HOST", "粉丝列表", "点击粉丝进入用户主页", "粉丝列表存在目标粉丝", ["进入粉丝列表", "点击目标粉丝"], "页面进入目标粉丝的用户主页", { page: "host/fan-list.html", type: "业务流程" });
for (const sort of ["累计贡献", "本月贡献", "加入时间"]) add("HOST", "主播粉丝团", `按${sort}排序成员`, `粉丝团存在可区分${sort}顺序的成员`, ["进入主播粉丝团", `选择按${sort}排序`], `成员列表按${sort}排列`, { page: "host/fan-club.html", type: "逻辑校验" });
add("HOST", "主播粉丝团", "满五百人拒绝新成员", "主播粉丝团已有 500 名有效成员", ["另一用户满足加入条件", "尝试加入该粉丝团"], "该用户不会成为第 501 名成员", { priority: "P1", page: "host/fan-club.html", type: "逻辑校验", flow: "FLOW-UAPP-FANCLUB-01" });
add("HOST", "主播粉丝团", "主播只能创建一个粉丝团", "主播已拥有一个粉丝团", "尝试再次创建粉丝团", "系统不创建第二个粉丝团", { priority: "P1", page: "host/fan-club.html", type: "逻辑校验" });
add("HOST", "粉丝团设置", "保存名称和加入条件", "主播已创建粉丝团", ["进入粉丝团设置", "填写名称并设置关注和累计贡献条件", "保存设置"], "页面回显保存后的粉丝团名称和加入条件", { priority: "P1", page: "host/fan-club-settings.html", type: "业务流程" });
add("HOST", "粉丝团设置", "新加入用户按新条件校验", "主播已提高累计贡献加入条件", ["未达到新条件的用户尝试加入", "达到新条件的另一用户尝试加入"], "未达到新条件的用户不能加入粉丝团", { priority: "P1", page: "host/fan-club-settings.html", type: "逻辑校验" });
add("HOST", "直播数据", "单日累计满三小时计一个有效天", "主播同一自然日多场直播累计恰好 3 小时", ["进入直播数据", "查看该自然日有效天"], "该自然日计为 1 个有效天", { priority: "P1", page: "host/live-data.html", type: "逻辑校验" });
add("HOST", "直播数据", "单日不足三小时不计有效天", "主播同一自然日累计直播 2 小时 59 分钟", ["进入直播数据", "查看该自然日有效天"], "该自然日计为 0 个有效天", { priority: "P1", page: "host/live-data.html", type: "逻辑校验" });
add("HOST", "直播数据", "单日超过三小时仍最多一个有效天", "主播同一自然日累计直播 7 小时", ["进入直播数据", "查看该自然日有效天"], "该自然日只计 1 个有效天", { priority: "P1", page: "host/live-data.html", type: "逻辑校验" });
for (const metric of ["累计收益", "有效天数", "开播时长", "观众人次", "新增粉丝", "送礼人数"]) add("HOST", "直播数据", `月数据展示${metric}`, `主播当月存在可复算的${metric}数据`, ["进入直播数据", "切换到月数据"], `月数据展示当月${metric}`, { page: "host/live-data.html", type: "逻辑校验" });
add("HOST", "收益与分成记录", "金额使用美元和印尼数字格式", "主播存在分成金额 1234.50 美元的记录", "进入收益与分成记录", "金额显示为 $1.234,50", { page: "host/income-withdrawal.html", type: "逻辑校验" });
add("HOST", "收益与分成记录", "分成记录按当前账号展示", "当前主播与另一主播均有分成记录", "进入收益与分成记录", "列表只展示当前主播的分成记录", { priority: "P1", page: "host/income-withdrawal.html", type: "逻辑校验" });

// 钱包与账单
add("WALLET", "余额充值", "iOS 使用 Apple IAP", "用户在 iOS 设备进入充值页", ["选择一个可购买金币套餐", "提交购买"], "系统进入 Apple IAP 支付流程", { priority: "P0", page: "wallet/recharge.html", type: "业务流程", flow: "FLOW-UAPP-RECHARGE-01" });
add("WALLET", "余额充值", "Android 使用第三方支付通道", "用户在 Android 设备进入充值页", ["选择一个可购买金币套餐", "提交购买"], "系统进入 Android 配置的第三方支付流程", { priority: "P0", page: "wallet/recharge.html", type: "业务流程", flow: "FLOW-UAPP-RECHARGE-01" });
add("WALLET", "余额充值", "支付成功增加金币一次", "用户金币余额为 100 且选择到账 1000 金币的套餐", ["完成支付", "返回充值页查看余额"], "用户金币余额变为 1100", { priority: "P0", page: "wallet/recharge.html", type: "业务流程", flow: "FLOW-UAPP-RECHARGE-01" });
add("WALLET", "余额充值", "支付成功生成充值记录", "用户完成一笔有效充值支付", ["进入余额明细", "查看最新充值记录"], "余额明细新增一笔对应充值入账记录", { priority: "P1", page: "wallet/balance-detail.html", type: "业务流程", flow: "FLOW-UAPP-RECHARGE-01" });
add("WALLET", "余额充值", "支付超时不增加金币", "用户创建充值订单后未在支付时限内完成支付", ["等待订单超时", "返回充值页查看余额"], "用户金币余额不因该订单增加", { priority: "P1", page: "wallet/recharge.html", type: "异常用例", flow: "FLOW-UAPP-RECHARGE-01" });
add("WALLET", "余额充值", "用户取消支付不增加金币", "用户已创建待支付充值订单", ["在支付流程取消订单", "返回充值页查看余额"], "用户金币余额不因该订单增加", { priority: "P1", page: "wallet/recharge.html", type: "异常用例", flow: "FLOW-UAPP-RECHARGE-01" });
add("WALLET", "余额充值", "活动套餐超出限购次数不可购买", "后台配置目标活动套餐每用户限购 1 次且用户已购买 1 次", ["进入充值页", "尝试再次购买该套餐"], "系统不创建第二笔该活动套餐订单", { priority: "P1", page: "wallet/recharge.html", type: "逻辑校验" });
add("WALLET", "余额充值", "失效活动套餐不展示", "后台配置的目标活动套餐已超过有效期", "进入充值页", "充值套餐列表不展示该活动套餐", { page: "wallet/recharge.html", type: "逻辑校验" });
add("WALLET", "余额明细", "金币流水只增不改", "用户已有一笔历史充值入账记录", ["后台对该充值执行退款或拒付", "用户进入余额明细"], "余额明细保留原入账记录并新增一笔冲正记录", { priority: "P1", page: "wallet/balance-detail.html", type: "业务流程", flow: "FLOW-UAPP-REFUND-01" });
add("WALLET", "余额明细", "退款可形成负数余额", "用户充值到账 1000 金币后已全部消费且余额为 0", ["后台完成该充值订单退款", "用户查看余额"], "用户金币余额变为 -1000", { priority: "P1", page: "wallet/balance-detail.html", type: "业务流程", flow: "FLOW-UAPP-REFUND-01" });
add("WALLET", "余额明细", "负余额时不能继续消费", "用户金币余额为 -100", ["进入直播间选择任一可赠送普通礼物", "尝试赠送"], "系统不扣减金币且不生成礼物消费记录", { priority: "P1", page: "wallet/balance-detail.html", type: "逻辑校验", flow: "FLOW-UAPP-REFUND-01" });
add("WALLET", "余额明细", "后续充值先抵扣负余额", "用户金币余额为 -1000", ["完成到账 2000 金币的充值", "查看余额"], "用户可用金币余额变为 1000", { priority: "P1", page: "wallet/balance-detail.html", type: "业务流程", flow: "FLOW-UAPP-REFUND-01" });
add("WALLET", "充值订单详情", "待支付订单不显示金币入账", "用户存在一笔待支付充值订单", "进入该充值订单详情", "订单详情不显示已完成的金币入账结果", { page: "wallet/order-income-detail.html", type: "逻辑校验" });
add("WALLET", "充值订单详情", "支付成功订单展示支付信息", "用户存在一笔支付成功充值订单", "进入该充值订单详情", "详情展示套餐、金币入账、法币金额、支付渠道和支付成功状态", { page: "wallet/order-income-detail.html", type: "功能需求" });
add("WALLET", "充值订单详情", "用户端不提供充值退款操作", "用户存在一笔支付成功充值订单", "进入该充值订单详情", "页面不提供退款提交入口", { priority: "P1", page: "wallet/order-income-detail.html", type: "逻辑校验" });
add("WALLET", "支出订单详情", "礼物消费展示对应直播间", "用户存在一笔已完成礼物消费", "进入该支出订单详情", "详情展示礼物商品、扣减金币和消费对应直播间", { page: "wallet/order-expense-detail.html", type: "功能需求" });
add("WALLET", "支出订单详情", "门票消费展示对应直播场次", "用户存在一笔已完成门票购买", "进入该支出订单详情", "详情展示门票扣减金币和对应直播场次", { page: "wallet/order-expense-detail.html", type: "功能需求" });
add("WALLET", "支出订单详情", "充值退款不撤销已完成消费", "充值订单已退款且该金币此前已用于完成礼物消费", "进入该礼物支出订单详情", "该已完成礼物消费记录仍保留", { priority: "P1", page: "wallet/order-expense-detail.html", type: "逻辑校验", flow: "FLOW-UAPP-REFUND-01" });

// 合并已验证的直播模块基线，并纠正旧版连麦入口误判。
const livePayload = JSON.parse(await fs.readFile(liveSource, "utf8"));
const removedLiveIds = new Set(["LIVE-253", "LIVE-254"]);
const oldLiveToObject = new Map();
for (const source of livePayload.测试用例) {
  if (removedLiveIds.has(source.用例编号)) continue;
  const item = clone(source);
  item._prefix = "LIVE";
  item.功能模块 = modules.LIVE;
  item._page = "live/";
  item.备注 = item.备注.map((value) => value.replaceAll("work/liveshow-user-live-testcases-260901-004", "work/liveshow-user-app-all-260901-001"));
  cases.push(item);
  oldLiveToObject.set(source.用例编号, item);
}
add("LIVE", "主播连麦", "连麦面板同时提供收到邀请和主播搜索", "普通房主播正在直播且当前未连麦", ["点击 PK 打开连麦主播面板", "查看面板内容"], "面板展示收到的邀请区域和可搜索主播的操作区域", { priority: "P1", page: "live/live-room-host.html", type: "功能需求", sources: ["来源：prototype/assets/annotations.js 第 82 行连麦主播批注", "来源：prototype/assets/common.js 的连麦搜索和邀请操作"] });
add("LIVE", "主播连麦", "按主播 ID 搜索可邀请主播", ["双方均在普通房直播且均未连麦", "双方不存在账号拉黑关系"], ["打开连麦主播面板", "输入目标主播 ID 搜索"], "搜索结果展示目标主播及可发起连麦的操作", { priority: "P1", page: "live/live-room-host.html", type: "逻辑校验" });
add("LIVE", "主播连麦", "从搜索结果发起连麦邀请", ["双方均在普通房直播且均未连麦", "双方不存在账号拉黑关系"], ["搜索目标主播", "点击发起连麦"], "发出邀请区域展示该目标主播的一条待处理邀请", { priority: "P1", page: "live/live-room-host.html", type: "业务流程", flow: "FLOW-LIVE-COHOST-01" });
add("LIVE", "主播连麦", "取消已发出的连麦邀请", "主播已向目标主播发出一条待处理连麦邀请", ["打开连麦主播面板", "点击该发出邀请的取消"], "该发出邀请从面板中移除并失效", { priority: "P1", page: "live/live-room-host.html", type: "业务流程", flow: "FLOW-LIVE-COHOST-01" });

// 按模块稳定前缀连续编号。
cases.sort((a, b) => moduleOrder.indexOf(a._prefix) - moduleOrder.indexOf(b._prefix));
const prefixCounters = Object.fromEntries(moduleOrder.map((key) => [key, 0]));
const oldLiveToNew = new Map();
cases.forEach((item, index) => {
  const oldId = item.用例编号;
  prefixCounters[item._prefix] += 1;
  item.序号 = index + 1;
  item.用例编号 = `${item._prefix}-${String(prefixCounters[item._prefix]).padStart(3, "0")}`;
  if (/^LIVE-\d{3}$/.test(oldId)) oldLiveToNew.set(oldId, item.用例编号);
  delete item._prefix;
});

const questions = [];
const questionReviewStatus = new WeakMap();
const addQ = (moduleKey, scenario, category, question, options, known, impact, supplement, extra = {}) => {
  const item = {
    问题编号: "",
    需求组编号: "",
    父问题编号: "",
    追问触发条件: "",
    阻塞等级: extra.block ?? "部分阻塞",
    功能模块: modules[moduleKey],
    具体场景: scenario,
    问题分类: category,
    待决策问题: question,
    可选方案: options.map((value, index) => `${String.fromCharCode(65 + index)}. ${value}`),
    测试建议: extra.suggestion ?? `建议 ${extra.recommend ?? "A"}；该方案规则明确且便于形成可重复验证的边界。`,
    产品结论: "",
    结论补充: "",
    已知依据: known,
    影响范围: impact,
    已有用例编号: extra.existing ?? [],
    确认后待补用例: supplement,
    负责人: extra.owner ?? "产品",
    期望确认时间: extra.when ?? "进入对应功能测试前",
    确认状态: "待确认",
  };
  questionReviewStatus.set(item, extra.reviewStatus ?? "证据缺口");
  questions.push(item);
};

// 复用直播模块待确认并重映射用例编号。
const remapLiveReference = (value) => {
  const exact = value.match(/^LIVE-(\d{3})$/);
  if (exact) return oldLiveToNew.get(value) ? [oldLiveToNew.get(value)] : [];
  const range = value.match(/^LIVE-(\d{3}) 至 LIVE-(\d{3})$/);
  if (!range) return [value];
  const ids = [];
  for (let i = Number(range[1]); i <= Number(range[2]); i += 1) {
    const mapped = oldLiveToNew.get(`LIVE-${String(i).padStart(3, "0")}`);
    if (mapped) ids.push(mapped);
  }
  return ids;
};
const liveConflictGroups = new Set(["RQ-001", "RQ-002", "RQ-003", "RQ-009", "RQ-038"]);
for (const source of livePayload.需求待确认) {
  const item = clone(source);
  item.功能模块 = modules.LIVE;
  item.已有用例编号 = item.已有用例编号.flatMap(remapLiveReference);
  questionReviewStatus.set(item, liveConflictGroups.has(source.需求组编号) ? "来源冲突" : "证据缺口");
  questions.push(item);
}

addQ("AUTH", "手机号密码登录失败后继续尝试登录", "业务规则", "连续密码错误达到多少次后限制继续登录？", ["连续错误 5 次后限制", "连续错误 10 次后限制", "不按次数限制，仅依赖统一风控"], ["手机号验证码已定义连续错误 5 次失效", "当前需求未定义密码错误次数和恢复方式"], ["手机号密码登录", "账号安全风控"], ["密码错误次数边界", "限制后的恢复方式"], { block: "部分阻塞", owner: "多方确认" });
addQ("AUTH", "邮箱注册或登录时获取并填写邮箱验证码", "业务规则", "邮箱验证码的有效期和连续错误失效次数采用哪一组规则？", ["有效期 5 分钟，连续错误 5 次失效", "有效期 10 分钟，连续错误 5 次失效", "读取统一验证码配置作为唯一依据"], ["需求明确支持邮箱验证码注册或登录", "当前资料只明确手机号验证码有效期和错误次数"], ["邮箱注册", "邮箱验证码登录", "邮箱重置密码"], ["邮箱验证码有效期", "邮箱验证码错误次数边界"], { block: "阻塞测试" });
addQ("AUTH", "满足资产条件的用户提交账号注销申请", "业务规则", "账号注销冷静期采用哪一种时长规则？", ["7 个自然日", "15 个自然日", "30 个自然日", "读取平台账号注销配置作为唯一依据"], ["需求和批注均要求进入注销冷静期", "当前资料未给出具体时长"], ["账号注销提交", "冷静期内登录", "冷静期结束后的清除"], ["冷静期边界", "冷静期撤销注销", "期满账号清除"], { block: "阻塞测试" });
addQ("HOME", "用户连续签到后发生一天断签", "业务规则", "断签后连续签到进度如何处理？", ["次日从第 1 天重新累计", "保留累计天数但连续天数清零", "允许使用补签道具后延续原连续进度"], ["需求要求展示断签重置规则", "当前原型和需求未给出最终处理方式"], ["福利中心签到进度", "连续签到额外奖励"], ["断签后的进度", "补签规则", "连续奖励重算"], { block: "部分阻塞" });
addQ("HOME", "任务达到完成条件后等待领取奖励", "业务规则", "当前版本的任务奖励采用哪一种领取方式？", ["全部由用户手动领取", "全部自动发放", "按后台任务配置决定手动或自动"], ["需求写手动或自动领取", "后台任务批注写奖励由用户手动领取"], ["福利中心任务状态", "金币或道具奖励到账"], ["任务完成后的状态", "手动领取", "自动到账"], { block: "部分阻塞", suggestion: "建议 A；当前后台批注明确奖励由用户手动领取。", reviewStatus: "来源冲突" });
addQ("HOME", "邀请关系命中设备、支付账号或异常绑定风控", "异常处理", "命中邀请风控后的奖励最终采用哪一种状态？", ["不生成奖励记录", "生成冻结奖励记录，审核后解冻或作废", "按风控等级分别不发放或冻结，并读取后台配置"], ["需求写奖励不发放或冻结", "原型未展示冻结记录及其后续状态"], ["邀请累计奖励", "邀请成员返利明细", "金币余额"], ["不发放记录", "冻结记录", "审核后的状态"], { block: "部分阻塞", owner: "多方确认" });
addQ("SOCIAL", "非好友用户尝试向另一用户或主播发送私信", "业务规则", "非好友私信最终采用哪一种权限规则？", ["非好友最多发送 3 条私信", "用户私聊主播必须先成为好友，其他非好友也不可私信", "主播私聊用户不限，普通用户之间非好友最多 3 条，用户私聊主播必须成为好友"], ["系统概要写非好友最多发送三条私信", "用户 App 需求写主播私聊用户不限，用户私聊主播需先成为好友", "两份规则的适用角色范围未完全一致"], ["用户主页私信", "主播主页私信", "直播间资料卡私信", "一对一会话"], ["非好友第 1 至第 4 条私信", "用户私聊主播", "主播私聊用户"], { block: "阻塞测试", owner: "产品", suggestion: "建议 C；它保留两份现行规则各自明确的角色差异。", reviewStatus: "来源冲突" });
addQ("SOCIAL", "用户将好友账号加入账号黑名单后再解除", "业务规则", "账号拉黑对既有好友关系最终采用哪一种处理？", ["拉黑立即解除好友关系，解除拉黑后不恢复", "拉黑保留好友关系但暂时不可用，解除后恢复资格"], ["系统概要写拉黑解除粉丝、关注、好友和粉丝团关系且取消后不恢复", "聊天设置批注写已有好友关系保留但不可用，解除后恢复资格"], ["用户主页", "聊天设置", "好友列表", "互动通知", "私信会话"], ["拉黑后的好友关系", "解除拉黑后的好友关系", "好友列表回显"], { block: "阻塞测试", suggestion: "建议 A；系统概要覆盖账号关系的完整后果，但需产品确认批注是否应同步修正。", reviewStatus: "来源冲突" });
addQ("SOCIAL", "双方账号拉黑后查看粉丝团群聊历史消息", "业务规则", "账号拉黑双方的历史群消息如何展示？", ["仅隐藏拉黑生效后的新消息", "历史和新消息均互相不可见", "历史消息保留，新消息折叠并允许手动查看"], ["批注明确账号拉黑双方群消息互相不可见", "未明确是否追溯到历史消息"], ["粉丝团群聊历史", "拉黑生效后的新消息"], ["历史消息可见性", "新消息可见性"], { block: "部分阻塞" });
addQ("PROFILE", "用户修改昵称、签名或其他文本资料", "字段与数据校验", "各文本资料字段的长度与字符限制采用哪一组规则？", ["按产品给出的固定字段上限", "读取后台字段配置作为唯一依据", "仅限制非空字段，当前版本不设额外长度上限"], ["原型提供资料编辑入口", "现行资料未给出昵称、签名等字段长度和字符规则"], ["昵称", "个性签名", "地区自定义内容"], ["最小长度", "最大长度", "特殊字符和空白字符"], { block: "部分阻塞" });
addQ("PROFILE", "用户满足资产条件并进入账号注销冷静期", "配置和历史数据影响", "冷静期内重新登录后注销申请如何处理？", ["登录即自动撤销注销", "允许登录但注销申请继续", "禁止登录，只提供撤销注销入口"], ["需求只说明按平台规则冷静期后清除账号", "未定义冷静期内登录与撤销关系"], ["登录", "账号注销状态", "冷静期撤销"], ["冷静期登录", "撤销注销", "再次提交注销"], { block: "部分阻塞" });
addQ("PROFILE", "用户重新加入曾退出或被移出的粉丝团", "流程与状态", "重新入团后的粉丝等级和亲密度从什么初始值开始？", ["两项均从 0 开始", "两项均从后台配置的初始值开始", "粉丝等级从 0 开始，亲密度从后台配置初始值开始"], ["系统概要和批注写重新加入不恢复旧值", "未明确新关系的初始值是否固定为 0 或可配置"], ["粉丝团关系", "粉丝等级", "亲密度"], ["重新入团初始值", "首次行为后的成长值"], { block: "部分阻塞" });
addQ("PROFILE", "项目中存在 my-outfits.html 装扮分类页，但用户 App 页面树、页面架构和现行导航均未登记入口", "需求范围", "my-outfits.html 装扮分类页在当前版本如何处理？", ["补充用户端入口并作为现行装扮分类页", "明确废弃该孤立页面，以现有我的装扮及三个分类页为准", "仅保留为原型调试视图，不作为可交付用户功能"], ["prototype/pages/user/profile/my-outfits.html 实现全部、头像框、勋章和气泡分类", "prototype/index.html 和 context/01-用户主播App-页面架构.md 未登记该页", "profile.html 与 my-decoration.html 未发现进入该页的导航"], ["我的装扮", "用户 App 页面树", "头像框、勋章和气泡入口"], ["页面入口", "分类筛选", "穿戴互斥", "空态"], { block: "部分阻塞", owner: "产品", suggestion: "建议 B；现行页面树已由我的装扮主页和三个明确分类页完整承载该功能。" });
addQ("GUILD", "用户填写入会申请并上传认证材料", "字段与数据校验", "入会申请的材料必填范围、文件类型和大小限制采用哪一种规则？", ["姓名、手机号、人像、证件正反面全部必填，并按产品给出文件限制", "姓名和手机号必填，认证图片允许后补", "读取后台认证材料配置作为唯一依据"], ["原型展示姓名、手机号、人像和证件正反面上传", "当前资料未完整定义必填标识、类型和大小"], ["入会申请表", "主播认证审核", "材料重提"], ["字段必填", "图片类型", "图片大小", "缺失材料提交"], { block: "阻塞测试" });
addQ("GUILD", "主播正在直播或存在未结算收益时提交退会申请", "流程与状态", "退会限制在用户端何时生效？", ["提交申请时直接阻止", "允许提交，公会审批通过时阻止", "允许审批通过，待直播结束且收益结清后自动退会"], ["公会端批注写正在直播或存在未结算收益时不可通过退会申请", "用户端当前资料未说明提交阶段是否拦截"], ["退会申请提交", "公会审批", "主播身份和直播状态"], ["直播中提交退会", "有未结算收益提交退会", "条件消除后的处理"], { block: "部分阻塞", owner: "多方确认" });
addQ("HOST", "主播查看主播等级标签和升级进度", "计算与统计口径", "主播等级阈值和升级权益采用哪一种来源？", ["读取后台主播等级配置作为唯一依据", "当前版本仅展示等级数字，不展示升级权益", "按产品给出的固定阈值和权益表"], ["项目说明和需求写主播等级按累计收到贡献值计算", "等级阈值和权益尚未定义"], ["主播中心", "主播主页", "排行榜"], ["等级边界", "升级回显", "等级权益"], { block: "部分阻塞" });
addQ("HOST", "主播查看直播数据中的观众人次和送礼人数", "计算与统计口径", "观众人次与送礼人数的去重口径采用哪一种？", ["观众人次不去重，送礼人数按用户去重", "两项均按用户去重", "两项均按场次累计不去重"], ["需求列出观众人次和送礼人数指标", "当前资料未完整定义跨场次去重口径"], ["主播中心本月数据", "直播数据日/月汇总", "公会和后台报表对账"], ["单场去重", "跨场次去重", "日月汇总"], { block: "阻塞测试", owner: "多方确认" });
addQ("HOST", "主播从收益页进入银行卡或提现填写页面", "需求范围", "当前版本是否启用主播线上绑卡和提现申请流程？", ["启用线上绑卡和提现申请，由后台审核后线下打款", "不启用线上流程，仅展示收益和线下结算记录", "仅灰度开放给指定主播"], ["项目说明写主播在线发起提现申请、后台审核、财务线下打款", "系统概要和用户 App 需求写系统不提供线上申请或审批且主播端仅展示记录", "原型包含我的银行卡、添加银行卡和提现填写页面"], ["收益页", "银行卡", "提现填写", "后台提现审核", "主播余额"], ["绑卡", "移除银行卡", "提现金额边界", "提现提交和状态"], { block: "阻塞测试", owner: "多方确认", suggestion: "建议 A；当前项目说明和完整原型链路均支持线上发起，但必须统一现行需求文件。", reviewStatus: "来源冲突" });
addQ("WALLET", "用户创建充值订单后等待支付", "业务规则", "充值订单支付倒计时采用多长时间？", ["10 分钟", "15 分钟", "30 分钟", "读取支付渠道返回的超时时间作为唯一依据"], ["需求要求 H5 充值订单支付倒计时", "原型批注存在超时自动取消状态", "当前资料未给出具体时长"], ["充值页", "充值订单详情", "支付回调"], ["倒计时边界", "超时取消", "超时回调"], { block: "阻塞测试", owner: "多方确认" });
addQ("WALLET", "后台退款或支付渠道拒付导致用户余额变为负数", "交互与文案规则", "用户端负余额采用哪一种展示和提醒方式？", ["余额直接展示负数，并禁止消费", "余额显示 0，可在明细中查看欠款", "余额直接展示负数，并在进入钱包时展示欠款说明"], ["系统概要明确余额允许为负且负余额不能消费", "用户端页面未定义负余额展示和说明"], ["我的钱包", "充值页", "余额明细", "直播间消费拦截"], ["负余额展示", "消费拦截反馈", "后续充值抵扣说明"], { block: "部分阻塞", owner: "产品" });

// 重新编号所有待确认，保持原直播问题的父子关系不丢失。
const oldQuestionMap = new Map();
const groupMap = new Map();
let groupCounter = 0;
questions.forEach((item, index) => {
  const old = item.问题编号;
  const groupKey = item.需求组编号 || `NEW-${index}`;
  if (!groupMap.has(groupKey)) {
    groupCounter += 1;
    groupMap.set(groupKey, `RQ-${String(groupCounter).padStart(3, "0")}`);
  }
  const id = `Q-${String(index + 1).padStart(3, "0")}`;
  if (old) oldQuestionMap.set(old, id);
  item.问题编号 = id;
  item.需求组编号 = groupMap.get(groupKey);
});
questions.forEach((item) => {
  if (item.父问题编号) item.父问题编号 = oldQuestionMap.get(item.父问题编号) ?? "";
  if (item.追问触发条件) for (const [old, current] of oldQuestionMap) item.追问触发条件 = item.追问触发条件.replaceAll(old, current);
});

// 按需求组最高阻塞等级排序，同时保留组内父问题优先顺序。
const blockRank = { 阻塞测试: 0, 部分阻塞: 1, 不阻塞: 2 };
const groupedQuestions = new Map();
questions.forEach((item, index) => {
  if (!groupedQuestions.has(item.需求组编号)) groupedQuestions.set(item.需求组编号, { index, items: [], rank: 2 });
  const group = groupedQuestions.get(item.需求组编号);
  group.items.push(item);
  group.rank = Math.min(group.rank, blockRank[item.阻塞等级]);
});
const orderedQuestions = [...groupedQuestions.values()].sort((a, b) => a.rank - b.rank || a.index - b.index).flatMap((group) => group.items);
const currentToFinalQ = new Map();
const currentToFinalGroup = new Map();
let finalGroupCounter = 0;
orderedQuestions.forEach((item, index) => {
  if (!currentToFinalGroup.has(item.需求组编号)) {
    finalGroupCounter += 1;
    currentToFinalGroup.set(item.需求组编号, `RQ-${String(finalGroupCounter).padStart(3, "0")}`);
  }
  currentToFinalQ.set(item.问题编号, `Q-${String(index + 1).padStart(3, "0")}`);
});
orderedQuestions.forEach((item) => {
  const oldId = item.问题编号;
  const oldGroup = item.需求组编号;
  item.问题编号 = currentToFinalQ.get(oldId);
  item.需求组编号 = currentToFinalGroup.get(oldGroup);
  if (item.父问题编号) item.父问题编号 = currentToFinalQ.get(item.父问题编号) ?? "";
  if (item.追问触发条件) for (const [old, current] of currentToFinalQ) item.追问触发条件 = item.追问触发条件.replaceAll(old, current);
});

const caseFields = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const qFields = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];
const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validOwners = new Set(["产品", "交互", "技术", "多方确认"]);

for (const [index, item] of cases.entries()) {
  assert.equal(item.序号, index + 1);
  assert(caseFields.every((field) => Object.hasOwn(item, field)), `用例缺字段：${item.用例编号}`);
  assert(validTypes.has(item.用例类型));
  assert(validPriorities.has(item.优先级));
  assert(item.用例描述.startsWith("验证"));
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1);
  assert(Array.isArray(item.备注) && item.备注.some((value) => value.startsWith("来源：")));
  assert(!item.用例描述.includes("验证连麦面板不提供主动发起入口"));
  assert(!item.预期结果[0].includes("不展示主动发起或取消连麦邀请"));
}
for (const item of orderedQuestions) {
  assert(qFields.every((field) => Object.hasOwn(item, field)), `待确认缺字段：${item.问题编号}`);
  assert(validBlocks.has(item.阻塞等级));
  assert(validCategories.has(item.问题分类));
  assert(validOwners.has(item.负责人));
  assert(item.可选方案.length >= 2 && item.可选方案.length <= 4);
  assert(item.已有用例编号.length + item.确认后待补用例.length > 0);
  if (item.父问题编号) {
    const parent = orderedQuestions.find((value) => value.问题编号 === item.父问题编号);
    assert(parent && parent.需求组编号 === item.需求组编号, `父子需求组错误：${item.问题编号}`);
  }
}

const normalize = (value) => String(value).replace(/[\s，。；：、“”‘’（）()\-_/]/g, "").toLowerCase();
const semanticKeys = new Set();
for (const item of cases) {
  const key = [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join(""), item.操作步骤.join(""), item.预期结果[0]].map(normalize).join("|");
  assert(!semanticKeys.has(key), `语义重复：${item.用例编号} ${item.用例描述}`);
  semanticKeys.add(key);
}
assert.equal(new Set(cases.map((item) => item.用例编号)).size, cases.length);
assert.equal(new Set(orderedQuestions.map((item) => item.问题编号)).size, orderedQuestions.length);

// 页面覆盖清单：每个用户端 HTML 至少有正式用例或待确认承接。
async function walk(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    if ([".git", "node_modules", ".DS_Store"].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(absolute, base));
    else if (entry.isFile()) out.push(path.relative(base, absolute).split(path.sep).join("/"));
  }
  return out;
}
const userPages = (await walk(path.join(project, "prototype/pages/user"))).filter((value) => value.endsWith(".html")).sort();
const pageCoverage = userPages.map((relative) => {
  let matched = cases.filter((item) => item._page === relative).map((item) => item.用例编号);
  if (relative === "home/live-plaza.html") matched = cases.filter((item) => item.功能结构 === "直播广场").map((item) => item.用例编号);
  if (relative === "host/start-live-settings.html") matched = cases.filter((item) => item.功能结构 === "开播设置").map((item) => item.用例编号);
  if (relative === "host/live-records.html") matched = cases.filter((item) => item.功能结构.startsWith("直播记录")).map((item) => item.用例编号);
  if (relative.startsWith("live/")) matched = cases.filter((item) => item.功能模块 === modules.LIVE).map((item) => item.用例编号);
  const pendingIds = relative === "profile/my-outfits.html" ? orderedQuestions.filter((item) => item.待决策问题.includes("my-outfits.html")).map((item) => item.问题编号) : [];
  return { 页面: `prototype/pages/user/${relative}`, 正式用例编号: matched, 需求待确认编号: pendingIds, 覆盖状态: matched.length ? "正式用例覆盖" : pendingIds.length ? "待确认承接" : "未覆盖" };
});
assert.equal(userPages.length, 65);
assert.equal(pageCoverage.filter((item) => item.覆盖状态 === "未覆盖").length, 0, JSON.stringify(pageCoverage.filter((item) => item.覆盖状态 === "未覆盖")));
await fs.writeFile(coveragePath, `${JSON.stringify({ 目标端: "用户/主播共用 App", 页面总数: userPages.length, 正式用例覆盖页面数: pageCoverage.filter((item) => item.覆盖状态 === "正式用例覆盖").length, 待确认承接页面数: pageCoverage.filter((item) => item.覆盖状态 === "待确认承接").length, 未承接页面数: pageCoverage.filter((item) => item.覆盖状态 === "未覆盖").length, 页面覆盖: pageCoverage }, null, 2)}\n`);

const flowGroups = new Map();
for (const item of cases.filter((value) => value.流程编号)) {
  if (!flowGroups.has(item.流程编号)) flowGroups.set(item.流程编号, []);
  flowGroups.get(item.流程编号).push(item);
}
const flows = [...flowGroups].map(([id, items]) => ({
  流程编号: id,
  共同业务对象: items[0].功能结构,
  触发端与角色: "用户/主播 App 当前账号",
  模块阶段顺序: [...new Set(items.map((item) => `${item.功能模块}/${item.功能结构}`))],
  来源状态: items[0].前置条件,
  目标状态: items.map((item) => item.预期结果[0]),
  观察端: "用户/主播 App；其他端仅作证据",
  证据: [...new Set(items.flatMap((item) => item.备注.filter((value) => value.startsWith("来源："))))],
  对应用例: items.map((item) => item.用例编号),
}));
await fs.writeFile(flowPath, `${JSON.stringify({ 流程数: flows.length, 流程清单: flows }, null, 2)}\n`);

for (const item of cases) delete item._page;
const payload = { 测试用例: cases, 需求待确认: orderedQuestions };
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);

const allProjectPaths = (await walk(project)).sort((a, b) => a.localeCompare(b));
const category = (relative) => {
  if (relative.startsWith("context/")) return "需求与业务上下文";
  if (relative.startsWith("prototype/pages/user/")) return "用户App原型页面";
  if (relative.startsWith("prototype/pages/admin/")) return "管理后台原型页面";
  if (relative.startsWith("prototype/pages/guild/")) return "公会App原型页面";
  if (relative.startsWith("prototype/assets/") && [".js", ".json"].includes(path.extname(relative))) return "公共脚本与Mock";
  if (relative.startsWith("prototype/assets/")) return "样式与视觉资源";
  if (relative.startsWith("app-store-screenshots/")) return "竞品截图";
  if (relative.startsWith("workspace/")) return "其他需求工作区";
  if (relative.startsWith("prototype/")) return "原型入口与说明";
  return "项目规则与说明";
};
const manifest = await Promise.all(allProjectPaths.map(async (relative) => {
  const absolute = path.join(project, relative);
  const [bytes, stat] = await Promise.all([fs.readFile(absolute), fs.stat(absolute)]);
  return { 相对路径: relative, 文件大小: stat.size, 修改时间: stat.mtime.toISOString(), "SHA-256": hash(bytes), 文件类别: category(relative) };
}));
const manifestMap = new Map(manifest.map((item) => [item.相对路径, item]));
const rootRules = ["AGENTS.md", "Cem Kaner.txt", "全局证据扫描指令.md", "原型与需求清单同步指令.md"];
const ruleBaseline = await Promise.all(rootRules.map(async (relative) => ({ 相对路径: relative, "SHA-256": hash(await fs.readFile(path.join(root, relative))) })));
const actualRead = new Set([
  "需求来源策略.json", "项目说明.md", "AGENTS.md", "prototype/index.html", "prototype/Luma Live-原型说明.md", "prototype/assets/annotations.js", "prototype/assets/common.js", "prototype/assets/mock.js", "prototype/assets/admin-mock.js", "prototype/assets/start-live-config.js",
  ...manifest.filter((item) => item.相对路径.startsWith("context/")).map((item) => item.相对路径),
  ...manifest.filter((item) => item.相对路径.startsWith("prototype/pages/user/")).map((item) => item.相对路径),
  ...manifest.filter((item) => /prototype\/pages\/(admin|guild)\/(operations|accounts|people|content|finance|data)/.test(item.相对路径)).map((item) => item.相对路径),
]);
const readPaths = [...actualRead].filter((value) => manifestMap.has(value)).sort();
const startBaseline = readPaths.map((relative) => ({ 相对路径: relative, "SHA-256": manifestMap.get(relative)["SHA-256"] }));
let previousCache = null;
try { previousCache = JSON.parse(await fs.readFile(cachePath, "utf8")); } catch {}
const previousMap = new Map((previousCache?.文件清单 ?? []).filter((item) => item.相对路径 !== ".DS_Store").map((item) => [item.相对路径, item]));
const currentMap = new Map(manifest.map((item) => [item.相对路径, item]));
const fileChanges = {
  新增: manifest.filter((item) => !previousMap.has(item.相对路径)).map((item) => item.相对路径),
  修改: manifest.filter((item) => previousMap.has(item.相对路径) && previousMap.get(item.相对路径)["SHA-256"] !== item["SHA-256"]).map((item) => item.相对路径),
  删除: [...previousMap.keys()].filter((value) => !currentMap.has(value)),
  重命名候选: [],
};
const fingerprint = hash(JSON.stringify({ schemaVersion: "1.1", project: "liveshow-proto", manifest }));
const dependencies = [
  { 上游: "管理后台/登录与风控", 共同业务对象: "用户账号", 当前模块: "系统入口、设置", 规则: "验证码、账号状态和注销策略影响登录与账号生命周期", 证据: [sourceFiles.req, sourceFiles.overview, "context/03-管理后台-项目需求清单.md"] },
  { 上游: "管理后台/任务与邀请配置", 共同业务对象: "任务实例和邀请奖励", 当前模块: "福利与邀请", 规则: "动作条件、奖励和风控状态决定用户端进度与金币到账", 证据: [sourceFiles.req, sourceFiles.anno, "context/03-管理后台-项目需求清单.md"] },
  { 上游: "管理后台/关系与举报处置", 共同业务对象: "账号关系和举报工单", 当前模块: "消息与社交", 规则: "好友、拉黑和举报处理结果在用户端回显", 证据: [sourceFiles.overview, sourceFiles.anno, "context/03-管理后台-项目需求清单.md"] },
  { 上游: "公会App、管理后台/入会审核", 共同业务对象: "入会申请单", 当前模块: "公会关系、主播申请", 规则: "公会初审和平台终审共同决定主播身份", 证据: [sourceFiles.overview, "context/02-公会App-项目需求清单.md", "context/03-管理后台-项目需求清单.md"] },
  { 上游: "公会App/退会审核", 共同业务对象: "退会申请单", 当前模块: "公会关系、主播中心", 规则: "公会审核结果决定公会关系和主播身份", 证据: [sourceFiles.overview, "context/02-公会App-项目需求清单.md", sourceFiles.anno] },
  { 上游: "管理后台、公会App/直播权限", 共同业务对象: "主播直播权限", 当前模块: "主播中心、直播", 规则: "平台和公会权限共同决定开播资格及进行中场次", 证据: [sourceFiles.overview, "context/02-公会App-项目需求清单.md", "context/03-管理后台-项目需求清单.md"] },
  { 上游: "管理后台/礼物和房型配置", 共同业务对象: "礼物、门票房、密码房", 当前模块: "直播、钱包", 规则: "配置决定可见入口、价格、购买资格、金币扣减和收益", 证据: [sourceFiles.req, sourceFiles.overview, sourceFiles.anno] },
  { 上游: "支付渠道、管理后台/充值退款", 共同业务对象: "充值订单和金币账户", 当前模块: "钱包与账单", 规则: "支付、退款和拒付决定订单状态、流水及可用余额", 证据: [sourceFiles.overview, sourceFiles.anno, "context/03-管理后台-项目需求清单.md"] },
  { 上游: "管理后台/资料风控", 共同业务对象: "头像和昵称检测记录", 当前模块: "资料编辑", 规则: "检测通过后生效，未通过时保留原资料", 证据: [sourceFiles.overview, sourceFiles.req, sourceFiles.anno] },
  { 上游: "平台财务、管理后台/主播结算", 共同业务对象: "主播收益和提现记录", 当前模块: "主播收益", 规则: "线上发起与线下结算的来源冲突进入需求待确认", 证据: ["项目说明.md", sourceFiles.overview, sourceFiles.req, sourceFiles.anno] },
];
const ruleReviews = orderedQuestions.map((item) => ({
  规则标识: `PENDING-${item.问题编号}`,
  相关问题编号: item.问题编号,
  业务对象: item.具体场景,
  角色: item.功能模块.includes("主播") ? "主播" : "用户或主播",
  动作或状态: item.待决策问题,
  检索词: [...new Set(`${item.具体场景}${item.待决策问题}`.match(/[\u3400-\u9fffA-Za-z0-9]+/g) ?? [])].slice(0, 12),
  已查文件: [sourceFiles.req, sourceFiles.overview, sourceFiles.page, sourceFiles.anno, "prototype/Luma Live-原型说明.md", "context/02-公会App-项目需求清单.md", "context/03-管理后台-项目需求清单.md"],
  命中位置: item.已知依据,
  命中规则: item.已知依据,
  采用结论: `${item.问题编号} 保留为需求待确认，确认后补充或重审所列用例范围。`,
  未采用原因: questionReviewStatus.get(item) === "来源冲突" ? "现行来源对同一范围给出不同规则，且没有完整替代关系。" : "现行来源只覆盖部分条件，不能唯一确定完成可执行预期所需的业务结果。",
  复核状态: questionReviewStatus.get(item) ?? "证据缺口",
}));
ruleReviews.unshift({
  规则标识: "RULE-COHOST-ACTIVE-INVITE",
  相关问题编号: "",
  业务对象: "主播连麦邀请",
  角色: "普通房主播",
  动作或状态: "搜索主播、发起邀请、取消邀请、同时收到多个邀请",
  检索词: ["连麦", "邀请", "搜索", "发起", "取消", "多个邀请", "PK"],
  已查文件: [sourceFiles.overview, sourceFiles.req, sourceFiles.anno, "prototype/assets/common.js", "prototype/pages/user/live/live-room-host.html"],
  命中位置: ["context/系统概要 .md 第231至244行", "prototype/assets/annotations.js 第82行", "prototype/assets/common.js 第1213至1249行"],
  命中规则: ["发起方只能保留一个邀请", "被邀请方可同时收到多个邀请", "搜索结果可发起连麦，发出的邀请可取消"],
  采用结论: "删除旧版无依据的仅展示邀请和不提供主动入口用例，生成搜索、发起和取消正式用例。",
  未采用原因: "不适用；现行证据已经形成完整可执行规则。",
  复核状态: "已确认规则",
});
const scan = {
  schemaVersion: "1.1",
  项目名称: "Luma Live",
  项目目录: "liveshow-proto",
  测试范围: { 目标端: "用户/主播共用 App", 功能模块: "全部模块", 页面数: userPages.length, UI视觉测试: false, 其他端用途: "仅作为配置来源、状态影响和下游结果证据" },
  扫描模式: "full",
  模式依据: ["本次范围由直播单模块扩大为用户/主播 App 全部 65 个页面，原模块缓存不能覆盖新增依赖。", "重新读取全部 context、全部用户端页面、公共批注与 Mock，并展开公会端和管理后台依赖。"],
  上次缓存: previousCache ? { 存在: true, 状态: previousCache.扫描状态 ?? "未知", 项目指纹: previousCache.项目指纹 ?? "" } : { 存在: false },
  规则基线: ruleBaseline,
  项目指纹: fingerprint,
  文件清单: manifest,
  文件变化: fileChanges,
  已读取文件: readPaths.map((relative) => ({ 相对路径: relative, 用途: manifestMap.get(relative).文件类别 })),
  复用证据: [{ 来源: "work/liveshow-user-live-testcases-260901-004", 范围: "用户App直播模块正式用例与待确认", 复核: "重新对照当前系统概要、批注和连麦实现；删除旧 LIVE-253、LIVE-254，并重新连续编号" }],
  未纳入文件: manifest.filter((item) => !actualRead.has(item.相对路径)).map((item) => ({ 相对路径: item.相对路径, 原因: item.文件类别 === "竞品截图" ? "仅作竞品视觉参考，本次不生成 UI 视觉用例。" : item.文件类别 === "样式与视觉资源" ? "仅承载样式或装饰资源，不用于建立业务预期。" : "已建档，与用户端业务入口及本次发现的跨端依赖无直接关系。" })),
  依赖关系: dependencies,
  关联映射: dependencies.map((item, index) => ({ 映射编号: `MAP-UAPP-${String(index + 1).padStart(3, "0")}`, ...item, 处理结果: item.共同业务对象 === "主播收益和提现记录" ? "需求待确认" : "正式用例或待确认已覆盖" })),
  规则缺失复核: ruleReviews,
  证据缺口: orderedQuestions.map((item) => `${item.问题编号}：${item.待决策问题}`),
  阻塞项: [],
  开始基线: startBaseline,
  输出前复核: { 状态: "待执行", 变化文件: [] },
  扫描状态: "有非阻塞待确认",
};
await fs.writeFile(scanPath, `${JSON.stringify(scan, null, 2)}\n`);

const sync = {
  项目名称: "Luma Live",
  来源策略: "prototype-primary",
  同步状态: "有非阻塞待确认",
  执行时间: now(),
  原型基线: manifest.filter((item) => item.相对路径.startsWith("prototype/")).map((item) => ({ 相对路径: item.相对路径, 修改时间: item.修改时间, "SHA-256": item["SHA-256"] })),
  扫描范围: ["用户/主播 App 全部 65 个页面", "全部 context 文件", "公共批注、Mock 与共享脚本", "公会端入退会与主播权限依赖", "管理后台配置、审核、风控、订单与结算依赖"],
  目标需求清单: ["context/01-用户主播App-项目需求清单.md"],
  差异统计: { 新增: 0, 修改: 0, 明确删除: 0, 原型未覆盖: orderedQuestions.filter((item) => ruleReviews.find((review) => review.相关问题编号 === item.问题编号)?.复核状态 === "证据缺口").length, 来源冲突: orderedQuestions.filter((item) => ruleReviews.find((review) => review.相关问题编号 === item.问题编号)?.复核状态 === "来源冲突").length, 无法定位: 0 },
  需求清单变更日志编号: [],
  受影响用例: [
    { 范围: "用户App-直播模块-260901-004.xlsx / 旧 LIVE-253", 状态: "应当废弃", 原因: "连麦面板并非只展示收到的邀请" },
    { 范围: "用户App-直播模块-260901-004.xlsx / 旧 LIVE-254", 状态: "应当废弃", 原因: "原型和共享脚本明确提供搜索、发起和取消邀请" },
    { 范围: "用户App-直播模块-260901-004.xlsx 其他正式用例", 状态: "继续有效并重新编号" },
  ],
  阻塞异常: [],
  同步摘要: ["本次未修改 context 或 prototype。", "完整读取全部用户端页面后，页面与需求章节均可定位。", "旧版两条连麦主动入口误判已在新工作簿中移除并以正确用例替代。", "线上提现与线下结算、账号拉黑关系、非好友私信等冲突进入需求待确认。"],
};
await fs.writeFile(syncPath, `${JSON.stringify(sync, null, 2)}\n`);

const numbered = (values) => values.map((value, index) => `${index + 1}. ${value}`).join("\n");
const caseRows = cases.map((item) => [item.序号, item.用例编号, item.功能模块, item.功能结构, item.用例类型, item.优先级, item.用例描述, item.验证用例子项, numbered(item.前置条件), numbered(item.操作步骤), item.预期结果[0], item.流程编号, item.测试结果, item.测试人员, numbered(item.备注)]);
const qRows = orderedQuestions.map((item) => qFields.map((field) => {
  if (field === "可选方案") return item[field].join("\n");
  if (["已知依据", "影响范围", "已有用例编号", "确认后待补用例"].includes(field)) return numbered(item[field]);
  return item[field];
}));
const col = (index) => {
  let value = index + 1;
  let out = "";
  while (value) { out = String.fromCharCode(65 + ((value - 1) % 26)) + out; value = Math.floor((value - 1) / 26); }
  return out;
};
const estimateHeight = (row, widths) => {
  let lines = 1;
  row.forEach((value, index) => {
    const width = Math.max(5, widths[index]);
    const count = String(value ?? "").split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil([...line].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(190, Math.max(38, lines * 16 + 10));
};
const buildSheet = (workbook, { name, headers, rows, widths, tableName, validations = [], priorityColumn = "" }) => {
  const sheet = workbook.worksheets.add(name);
  const lastCol = col(headers.length - 1);
  const lastRow = rows.length + 1;
  const range = sheet.getRange(`A1:${lastCol}${lastRow}`);
  range.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastCol}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
  range.format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
  sheet.getRange(`A1:${lastCol}1`).format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, rowHeightPx: 40, borders: { preset: "all", style: "thin", color: "#163A5A" } };
  validations.forEach(({ column, values }) => { sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } }; });
  if (priorityColumn) {
    const rangePriority = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    rangePriority.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    rangePriority.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${col(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => { sheet.getRange(`A${index + 2}:${lastCol}${index + 2}`).format.rowHeightPx = estimateHeight(row, widths); });
  return { sheet, lastRow, lastCol };
};

const workbook = Workbook.create();
const overview = workbook.worksheets.add("产品决策概览");
const main = buildSheet(workbook, { name: "功能测试用例", headers: caseFields, rows: caseRows, widths: [8, 15, 20, 27, 13, 9, 36, 28, 46, 46, 54, 19, 12, 14, 54], tableName: "UserAppAllTestCases", validations: [{ column: "E", values: [...validTypes] }, { column: "F", values: [...validPriorities] }, { column: "M", values: ["未测", "通过", "不通过", "阻塞", "不适用"] }], priorityColumn: "F" });
const pending = buildSheet(workbook, { name: "需求待确认", headers: qFields, rows: qRows, widths: [15, 15, 16, 38, 14, 20, 40, 22, 48, 60, 50, 15, 36, 54, 44, 28, 44, 16, 22, 16], tableName: "UserAppAllPending", validations: [{ column: "E", values: [...validBlocks] }, { column: "H", values: [...validCategories] }, { column: "L", values: ["A", "B", "C", "D", "其他"] }, { column: "R", values: [...validOwners] }, { column: "T", values: ["待前置结论", "待确认", "确认中", "已确认", "无需处理"] }] });
overview.showGridLines = false;
overview.mergeCells("A1:L1");
overview.getRange("A1").values = [["用户 App 全部模块 · 产品决策概览"]];
overview.getRange("A1:L1").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 52 };
overview.mergeCells("A2:L2");
overview.getRange("A2").values = [[`覆盖 ${userPages.length} 个用户/主播 App 页面；正式用例和需求待确认均已按当前全局证据生成。`]];
overview.getRange("A2:L2").format = { fill: "#EAF2F8", font: { name: "Microsoft YaHei", size: 10, color: "#334155" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 34 };
const cards = [["问题总数", `=COUNTA('需求待确认'!$A$2:$A$${qRows.length + 1})`], ["当前可回答", `=COUNTIF('需求待确认'!$T$2:$T$${qRows.length + 1},"待确认")`], ["待前置结论", `=COUNTIF('需求待确认'!$T$2:$T$${qRows.length + 1},"待前置结论")`], ["确认中", `=COUNTIF('需求待确认'!$T$2:$T$${qRows.length + 1},"确认中")`], ["已确认", `=COUNTIF('需求待确认'!$T$2:$T$${qRows.length + 1},"已确认")`], ["无需处理", `=COUNTIF('需求待确认'!$T$2:$T$${qRows.length + 1},"无需处理")`]];
cards.forEach(([label, formula], index) => {
  const start = index * 2;
  const range1 = `${col(start)}4:${col(start + 1)}4`;
  const range2 = `${col(start)}5:${col(start + 1)}5`;
  overview.mergeCells(range1); overview.mergeCells(range2);
  overview.getRange(col(start) + "4").values = [[label]];
  overview.getRange(col(start) + "5").formulas = [[formula]];
  overview.getRange(range1).format = { fill: "#DDEBF7", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 30 };
  overview.getRange(range2).format = { fill: "#FFFFFF", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 42 };
});
overview.getRange("A7:L7").values = [["按状态", "数量", "按阻塞等级", "待确认", "按负责人", "待确认", "用例概览", "数量", "模块", "用例数", "页面覆盖", "数量"]];
overview.getRange("A7:L7").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#163A5A" }, rowHeightPx: 32 };
const statuses = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"];
const blocks = ["阻塞测试", "部分阻塞", "不阻塞"];
const owners = ["产品", "交互", "技术", "多方确认"];
overview.getRange("A8:A12").values = statuses.map((value) => [value]);
overview.getRange("C8:C10").values = blocks.map((value) => [value]);
overview.getRange("E8:E11").values = owners.map((value) => [value]);
overview.getRange("G8:G11").values = [["正式用例"], ["P0"], ["P1"], ["跨模块流程"]];
overview.getRange("I8:I15").values = moduleOrder.map((key) => [modules[key].replace("用户App-", "")]);
overview.getRange("K8:K11").values = [["用户端页面"], ["正式用例覆盖"], ["待确认承接"], ["未承接页面"]];
statuses.forEach((value, index) => { overview.getRange(`B${index + 8}`).formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${qRows.length + 1},"${value}")`]]; });
blocks.forEach((value, index) => { overview.getRange(`D${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$E$2:$E$${qRows.length + 1},"${value}",'需求待确认'!$T$2:$T$${qRows.length + 1},"待确认")`]]; });
owners.forEach((value, index) => { overview.getRange(`F${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$R$2:$R$${qRows.length + 1},"${value}",'需求待确认'!$T$2:$T$${qRows.length + 1},"待确认")`]]; });
overview.getRange("H8:H11").values = [[cases.length], [cases.filter((item) => item.优先级 === "P0").length], [cases.filter((item) => item.优先级 === "P1").length], [flows.length]];
moduleOrder.forEach((key, index) => { overview.getRange(`J${index + 8}`).values = [[cases.filter((item) => item.功能模块 === modules[key]).length]]; });
overview.getRange("L8:L11").values = [[userPages.length], [pageCoverage.filter((item) => item.覆盖状态 === "正式用例覆盖").length], [pageCoverage.filter((item) => item.覆盖状态 === "待确认承接").length], [pageCoverage.filter((item) => item.覆盖状态 === "未覆盖").length]];
overview.getRange("A8:L15").format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" }, rowHeightPx: 31 };
for (const range of ["A8:A12", "C8:C10", "E8:E11", "G8:G11", "I8:I15", "K8:K11"]) overview.getRange(range).format.horizontalAlignment = "left";
for (const range of ["B8:B12", "D8:D10", "F8:F11", "H8:H11", "J8:J15", "L8:L11"]) overview.getRange(range).format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A17:L17");
overview.getRange("A17").values = [["处理顺序：先确认阻塞测试根问题，再处理其子问题和部分阻塞问题；正式用例可先执行不依赖待确认结论的范围。"]];
overview.getRange("A17:L17").format = { fill: "#F8FAFC", font: { name: "Microsoft YaHei", size: 10, color: "#475569" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, rowHeightPx: 34, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
[20, 10, 20, 10, 20, 10, 20, 10, 22, 11, 22, 11].forEach((width, index) => { overview.getRange(`${col(index)}1`).format.columnWidth = width; });
overview.freezePanes.freezeRows(2);

pending.sheet.freezePanes.freezeColumns(3);
pending.sheet.getRange(`A2:C${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`E2:F${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`H2:H${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`R2:T${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`I2:I${pending.lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pending.sheet.getRange(`K2:K${pending.lastRow}`).format.fill = "#EAF4EA";
pending.sheet.getRange(`L2:M${pending.lastRow}`).format = { fill: "#FFF4CC", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6B656" } };
for (const [value, fill, color] of [["阻塞测试", "#FDE8E8", "#9B1C1C"], ["部分阻塞", "#FFF4D6", "#8A4B08"], ["不阻塞", "#E7F5EC", "#166534"]]) pending.sheet.getRange(`E2:E${pending.lastRow}`).conditionalFormats.add("containsText", { text: value, format: { fill, font: { bold: true, color } } });
let previousGroup = "";
orderedQuestions.forEach((item, index) => {
  const row = index + 2;
  if (item.需求组编号 !== previousGroup) { pending.sheet.getRange(`A${row}:T${row}`).format.borders = { top: { style: "medium", color: "#6B879F" } }; previousGroup = item.需求组编号; }
  if (item.父问题编号) pending.sheet.getRange(`A${row}:D${row}`).format.fill = "#EAF2F8";
  else pending.sheet.getRange(`B${row}`).format.fill = "#DDEBF7";
});

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(output);

const finalWorkbook = await SpreadsheetFile.importXlsx(await fs.readFile(output));
assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["产品决策概览", "功能测试用例", "需求待确认"]);
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 12000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 160 })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:L17", maxChars: 20000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:L17", maxChars: 20000 })).ndjson,
  cohost: (await finalWorkbook.inspect({ kind: "match", searchTerm: "连麦面板同时提供|按主播 ID 搜索可邀请主播|从搜索结果发起连麦邀请|取消已发出的连麦邀请", options: { useRegex: true, maxResults: 50 }, summary: "连麦主动发起规则复核" })).ndjson,
  badCohost: (await finalWorkbook.inspect({ kind: "match", searchTerm: "不提供主动发起入口|不展示主动发起或取消连麦邀请|连麦面板仅展示收到的邀请", options: { useRegex: true, maxResults: 50 }, summary: "旧版错误连麦用例复核" })).ndjson,
  withdrawalConflict: (await finalWorkbook.inspect({ kind: "match", searchTerm: "当前版本是否启用主播线上绑卡和提现申请流程", options: { useRegex: false, maxResults: 20 }, summary: "提现来源冲突" })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "公式错误扫描" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`);
for (const [sheetName, range, file] of [["产品决策概览", "A1:L17", "preview-overview.png"], ["功能测试用例", "A1:O35", "preview-cases-top.png"], ["功能测试用例", `A${Math.max(2, cases.findIndex((item) => item.验证用例子项 === "连麦面板同时提供收到邀请和主播搜索") - 2)}:O${Math.min(cases.length + 1, cases.findIndex((item) => item.验证用例子项 === "取消已发出的连麦邀请") + 4)}`, "preview-cohost-correction.png"], ["需求待确认", "A1:T25", "preview-pending-top.png"], ["需求待确认", `A${Math.max(2, orderedQuestions.findIndex((item) => item.待决策问题.includes("线上绑卡")))}:T${Math.min(orderedQuestions.length + 1, orderedQuestions.findIndex((item) => item.待决策问题.includes("线上绑卡")) + 4)}`, "preview-withdrawal-conflict.png"]]) {
  const image = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(work, file), new Uint8Array(await image.arrayBuffer()));
}

const changed = [];
for (const item of startBaseline) {
  try { if (hash(await fs.readFile(path.join(project, item.相对路径))) !== item["SHA-256"]) changed.push(item.相对路径); } catch { changed.push(item.相对路径); }
}
for (const item of ruleBaseline) {
  try { if (hash(await fs.readFile(path.join(root, item.相对路径))) !== item["SHA-256"]) changed.push(item.相对路径); } catch { changed.push(item.相对路径); }
}
assert.deepEqual(changed, []);
scan.输出前复核 = { 状态: "通过", 变化文件: [] };
scan.交付产物 = { JSON: path.relative(root, jsonPath), Excel: path.relative(root, output), 页面覆盖: path.relative(root, coveragePath), 跨模块流程: path.relative(root, flowPath), 正式用例数: cases.length, 需求待确认数: orderedQuestions.length };
await fs.writeFile(scanPath, `${JSON.stringify(scan, null, 2)}\n`);
await fs.mkdir(path.dirname(cachePath), { recursive: true });
await fs.writeFile(cachePath, `${JSON.stringify(scan, null, 2)}\n`);
const stat = await fs.stat(output);
assert(stat.size > 0);
console.log(JSON.stringify({ output, jsonPath, scanPath, syncPath, coveragePath, flowPath, cases: cases.length, questions: orderedQuestions.length, pages: userPages.length, flows: flows.length, p0: cases.filter((item) => item.优先级 === "P0").length, p1: cases.filter((item) => item.优先级 === "P1").length, bytes: stat.size }, null, 2));
