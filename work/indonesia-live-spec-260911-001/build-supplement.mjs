import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const taskDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(taskDir, "../..");
const prototypeRoot = path.join(root, "liveshow-proto/prototype/pages");
const historyRoot = path.join(root, "work/liveshow-three-end-all-260911-001");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const readJson = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const writeJson = async (name, value) => fs.writeFile(path.join(taskDir, name), `${JSON.stringify(value, null, 2)}\n`);
const endConfig = {
  用户App: { dir: "user", code: "U", history: "user/current-testcase-candidate.json", json: "用户App-全部模块-测试用例-260911-002.json" },
  公会App: { dir: "guild", code: "G", history: "guild/current-testcase-candidate.json", json: "公会App-全部模块-测试用例-260911-002.json" },
  管理后台: { dir: "admin", code: "A", history: "admin/current-testcase-candidate.json", json: "管理后台-全部模块-测试用例-260911-002.json" },
};
const domainModule = {
  "账号、登录与资料": "账号与资料",
  "直播间与开播": "直播",
  "粉丝团、聊天与房管": "社交与房管",
  "金币、礼物与订单": "金币、礼物与订单",
  "任务、奖励与等级": "任务与等级",
  "公会与运营后台": "公会与运营",
};

const plans = {
  "REQ-ACC-001": { 用户App: ["语言设置（用户视角）", "user/profile/settings.html", "普通用户"], 公会App: ["语言设置（公会视角）", "guild/management/guild-settings.html", "公会长"], 管理后台: ["后台语言（平台管理员视角）", "admin/dashboard/admin-dashboard.html", "平台管理员"] },
  "REQ-ACC-002": { 用户App: ["登录与注册（用户视角）", "user/auth/auth-login-register.html", "未登录用户"], 公会App: ["公会登录（公会视角）", "guild/auth/guild-login.html", "未登录公会用户"] },
  "REQ-ACC-003": { 用户App: ["国家或地区区号（用户视角）", "user/auth/auth-country-select.html", "未登录用户"] },
  "REQ-ACC-004": { 用户App: ["邮箱登录（用户视角）", "user/auth/auth-email-login.html", "未登录用户"] },
  "REQ-ACC-005": { 用户App: ["资料编辑（用户视角）", "user/profile/profile-edit.html", "普通用户"] },
  "REQ-ACC-006": { 用户App: ["账号限制（用户视角）", "user/profile/settings.html", "被封禁用户"] },
  "REQ-ACC-007": { 用户App: ["账号注销（用户视角）", "user/profile/settings.html", "普通用户"] },
  "REQ-ACC-008": { 用户App: ["主播认证（申请人视角）", "user/guild/guild-application-form.html", "主播申请人"] },
  "REQ-ACC-009": { 用户App: ["手机号注册（用户视角）", "user/auth/auth-phone-login.html", "未注册用户"] },
  "REQ-ACC-010": { 用户App: ["头像与昵称上传（用户视角）", "user/profile/profile-edit.html", "普通用户"], 管理后台: ["用户资料管理（平台管理员视角）", "admin/user/admin-user-detail.html", "平台管理员"] },
  "REQ-ACC-011": { 用户App: ["系统通知（用户视角）", "user/social/system-notifications.html", "普通用户"], 管理后台: ["用户资料重置（平台管理员视角）", "admin/user/admin-user-detail.html", "平台管理员"] },
  "REQ-ACC-012": { 用户App: ["搜索结果（用户视角）", "user/home/search-results.html", "普通用户"] },
  "REQ-LIVE-001": { 用户App: ["受限直播间（观众视角）", "user/live/live-room.html", "观众"] },
  "REQ-LIVE-002": { 用户App: ["直播间礼物特效（观众视角）", "user/live/live-room.html", "观众"] },
  "REQ-LIVE-003": { 管理后台: ["礼物特效文件（平台管理员视角）", "admin/gifts/admin-gift-detail.html", "平台管理员"] },
  "REQ-LIVE-004": { 用户App: ["直播数据（主播视角）", "user/host/live-data.html", "主播"], 公会App: ["主播数据（公会长视角）", "guild/data/guild-host-data.html", "公会长"], 管理后台: ["直播统计（平台管理员视角）", "admin/analytics/admin-live-statistics.html", "平台管理员"] },
  "REQ-LIVE-005": { 用户App: ["主播直播间（主播视角）", "user/live/live-room-host.html", "主播"] },
  "REQ-LIVE-006": { 用户App: ["门票订单（观众视角）", "user/wallet/order-expense-detail.html", "已购票观众"], 管理后台: ["直播管理（平台管理员视角）", "admin/host/admin-live-management.html", "平台管理员"] },
  "REQ-LIVE-007": { 用户App: ["直播记录（主播视角）", "user/host/live-records.html", "主播"], 公会App: ["主播历史数据（公会长视角）", "guild/data/guild-host-data.html", "公会长"], 管理后台: ["主播历史记录（平台管理员视角）", "admin/host/admin-host-detail.html", "平台管理员"] },
  "REQ-LIVE-008": { 用户App: ["主播中心（主播视角）", "user/host/host-center.html", "主播"], 管理后台: ["主播详情（平台管理员视角）", "admin/host/admin-host-detail.html", "平台管理员"] },
  "REQ-LIVE-009": { 用户App: ["全部任务（用户视角）", "user/home/all-tasks.html", "普通用户"] },
  "REQ-LIVE-010": { 用户App: ["密码直播间（观众视角）", "user/live/live-room.html", "观众"] },
  "REQ-LIVE-011": { 用户App: ["直播中断处理（主播与观众视角）", "user/live/live-room-host.html", "主播与观众"] },
  "REQ-LIVE-012": { 用户App: ["直播广场轮播（用户视角）", "user/home/live-plaza.html", "普通用户"], 管理后台: ["运营位配置（平台管理员视角）", "admin/operations/admin-placement-detail.html", "平台管理员"] },
  "REQ-LIVE-013": { 用户App: ["系统通知（接收者视角）", "user/social/system-notifications.html", "普通用户"], 管理后台: ["推送管理（平台管理员视角）", "admin/operations/admin-push-management.html", "平台管理员"] },
  "REQ-LIVE-014": { 管理后台: ["礼物适用范围（平台管理员视角）", "admin/gifts/admin-gift-detail.html", "平台管理员"] },
  "REQ-LIVE-015": { 用户App: ["主播直播间（主播视角）", "user/live/live-room-host.html", "主播"] },
  "REQ-LIVE-016": { 用户App: ["开播设置（主播视角）", "user/host/start-live-settings.html", "主播"] },
  "REQ-LIVE-017": { 用户App: ["开播美颜（主播视角）", "user/host/start-live-settings.html", "主播"] },
  "REQ-LIVE-018": { 用户App: ["主播入口（非主播视角）", "user/profile/profile.html", "非主播用户"] },
  "REQ-LIVE-019": { 用户App: ["直播广场分类（用户视角）", "user/home/live-plaza.html", "普通用户"] },
  "REQ-LIVE-020": { 用户App: ["直播消息卡片（用户视角）", "user/social/message-center.html", "普通用户"] },
  "REQ-LIVE-021": { 管理后台: ["主播列表（平台管理员视角）", "admin/host/admin-host-list.html", "平台管理员"] },
  "REQ-LIVE-022": { 用户App: ["密码房可见范围（主播与观众视角）", "user/host/start-live-settings.html", "主播与观众"] },
  "REQ-LIVE-023": { 用户App: ["粉丝授权名单（主播视角）", "user/host/visible-fan-select.html", "主播"] },
  "REQ-LIVE-024": { 用户App: ["观众答谢（主播视角）", "user/live/live-room-host.html", "主播"] },
  "REQ-LIVE-025": { 用户App: ["直播贡献榜（用户视角）", "user/home/contribution-ranking.html", "主播或观众"] },
  "REQ-LIVE-026": { 用户App: ["主播主页（用户视角）", "user/social/host-home.html", "普通用户"] },
  "REQ-SOC-001": { 用户App: ["粉丝团（主播视角）", "user/host/fan-club.html", "主播"] },
  "REQ-SOC-002": { 用户App: ["粉丝团加入（用户视角）", "user/host/fan-club.html", "普通用户"] },
  "REQ-SOC-003": { 用户App: ["粉丝群聊（用户视角）", "user/social/fan-group-chat.html", "普通用户"] },
  "REQ-SOC-004": { 用户App: ["粉丝群聊历史（新成员视角）", "user/social/fan-group-chat.html", "新入团用户"] },
  "REQ-SOC-005": { 用户App: ["踢出后的直播间准入（观众视角）", "user/live/live-room.html", "被踢出观众"] },
  "REQ-SOC-006": { 用户App: ["陌生人私信（用户视角）", "user/social/direct-message.html", "非好友用户"] },
  "REQ-SOC-007": { 用户App: ["删除会话关系（双方用户视角）", "user/social/chat-settings.html", "聊天双方用户"] },
  "REQ-SOC-008": { 用户App: ["账号拉黑（观众视角）", "user/live/live-room.html", "被主播拉黑用户"] },
  "REQ-SOC-009": { 用户App: ["房管管理（主播视角）", "user/host/moderator-management.html", "主播"] },
  "REQ-SOC-010": { 用户App: ["巡房账号处置（巡房视角）", "user/live/live-room.html", "巡房账号"] },
  "REQ-SOC-011": { 用户App: ["单人禁言恢复（用户视角）", "user/live/live-room.html", "被禁言用户"] },
  "REQ-SOC-012": { 用户App: ["禁言组合状态（用户视角）", "user/live/live-room-host.html", "主播与被禁言用户"] },
  "REQ-SOC-013": { 用户App: ["拉黑与房管权限（主播视角）", "user/host/moderator-management.html", "主播与房管"] },
  "REQ-SOC-014": { 用户App: ["群资料编辑（成员视角）", "user/social/group-manage-member.html", "群成员或群主"] },
  "REQ-SOC-015": { 用户App: ["客服入口（用户视角）", "user/profile/settings.html", "普通用户"] },
  "REQ-FIN-001": { 用户App: ["金币余额（用户视角）", "user/wallet/balance-detail.html", "普通用户"], 管理后台: ["金币配置（平台管理员视角）", "admin/operations/admin-recharge-package-detail.html", "平台管理员"] },
  "REQ-FIN-002": { 管理后台: ["幸运礼物概率（平台管理员视角）", "admin/gifts/admin-lucky-gift-config.html", "平台管理员"] },
  "REQ-FIN-003": { 管理后台: ["幸运礼物 RTP（平台管理员视角）", "admin/gifts/admin-lucky-gift-detail.html", "平台管理员"] },
  "REQ-FIN-004": { 用户App: ["我的装扮（用户视角）", "user/profile/my-decoration.html", "普通用户"], 管理后台: ["道具配置（平台管理员视角）", "admin/gifts/admin-prop-detail.html", "平台管理员"] },
  "REQ-FIN-005": { 用户App: ["主播收益（主播视角）", "user/host/income-sharing.html", "主播"], 公会App: ["主播收益（公会长视角）", "guild/data/guild-income.html", "公会长"], 管理后台: ["主播收益报表（平台管理员视角）", "admin/analytics/admin-monthly-host-earnings.html", "平台管理员"] },
  "REQ-FIN-006": { 用户App: ["贡献榜（用户视角）", "user/home/contribution-ranking.html", "普通用户"], 管理后台: ["贡献统计（平台管理员视角）", "admin/analytics/admin-host-statistics.html", "平台管理员"] },
  "REQ-FIN-007": { 用户App: ["金额展示（用户视角）", "user/wallet/balance-detail.html", "普通用户"], 公会App: ["金额展示（公会视角）", "guild/data/guild-income.html", "公会长"], 管理后台: ["金额展示（后台视角）", "admin/analytics/admin-report-center.html", "平台管理员"] },
  "REQ-FIN-008": { 用户App: ["退款后限购（用户视角）", "user/wallet/recharge.html", "普通用户"], 管理后台: ["退款订单（平台管理员视角）", "admin/orders/admin-refund-order.html", "平台管理员"] },
  "REQ-FIN-009": { 用户App: ["退款后主播收益（主播视角）", "user/host/income-sharing.html", "主播"], 公会App: ["退款后主播收益（公会视角）", "guild/data/guild-income.html", "公会长"], 管理后台: ["退款后主播收益（后台视角）", "admin/analytics/admin-monthly-host-earnings.html", "平台管理员"] },
  "REQ-FIN-010": { 管理后台: ["订单退款（平台管理员视角）", "admin/orders/admin-recharge-order-detail.html", "平台管理员"] },
  "REQ-FIN-011": { 用户App: ["资金功能（用户视角）", "user/wallet/balance-detail.html", "普通用户"], 公会App: ["资金功能（公会视角）", "guild/data/guild-income.html", "公会长"], 管理后台: ["资金功能（后台视角）", "admin/finance/admin-host-account-balance.html", "平台管理员"] },
  "REQ-FIN-012": { 管理后台: ["财务统计（平台管理员视角）", "admin/analytics/admin-monthly-income-expense.html", "平台管理员"] },
  "REQ-FIN-013": { 用户App: ["充值套餐（用户视角）", "user/wallet/recharge.html", "普通用户"], 管理后台: ["充值套餐配置（平台管理员视角）", "admin/operations/admin-recharge-package-detail.html", "平台管理员"] },
  "REQ-FIN-014": { 用户App: ["资金账户（用户视角）", "user/wallet/balance-detail.html", "普通用户"], 管理后台: ["资金账户报表（平台管理员视角）", "admin/analytics/admin-recharge-order-detail-report.html", "平台管理员"] },
  "REQ-FIN-015": { 用户App: ["余额扣减（用户视角）", "user/wallet/balance-detail.html", "普通用户"], 管理后台: ["消费订单（平台管理员视角）", "admin/orders/admin-consumption-order-detail.html", "平台管理员"] },
  "REQ-FIN-016": { 用户App: ["退款后余额（用户视角）", "user/wallet/balance-detail.html", "普通用户"], 管理后台: ["充值退款（平台管理员视角）", "admin/orders/admin-refund-order.html", "平台管理员"] },
  "REQ-FIN-017": { 用户App: ["充值套餐展示（用户视角）", "user/wallet/recharge.html", "普通用户"], 管理后台: ["充值套餐配置（平台管理员视角）", "admin/operations/admin-recharge-package-detail.html", "平台管理员"] },
  "REQ-FIN-018": { 用户App: ["运营账号资金限制（运营账号视角）", "user/wallet/balance-detail.html", "运营账号"], 公会App: ["运营账号管理（公会视角）", "guild/operations/guild-operation-account-detail.html", "公会长"], 管理后台: ["运营账号管理（后台视角）", "admin/accounts/admin-operation-account-detail.html", "平台管理员"] },
  "REQ-FIN-019": { 用户App: ["直播间密码（主播视角）", "user/host/start-live-settings.html", "主播"] },
  "REQ-TASK-001": { 用户App: ["连续登录任务（用户视角）", "user/home/all-tasks.html", "普通用户"], 管理后台: ["任务配置（平台管理员视角）", "admin/operations/admin-task-config.html", "平台管理员"] },
  "REQ-TASK-002": { 管理后台: ["奖励档位配置（平台管理员视角）", "admin/operations/admin-task-detail.html", "平台管理员"] },
  "REQ-TASK-003": { 用户App: ["邀请与任务奖励（用户视角）", "user/home/invite-friends.html", "普通用户"], 管理后台: ["任务奖励配置（平台管理员视角）", "admin/operations/admin-task-config.html", "平台管理员"] },
  "REQ-TASK-004": { 用户App: ["新增奖励档位（用户视角）", "user/home/all-tasks.html", "普通用户"], 管理后台: ["奖励档位配置（平台管理员视角）", "admin/operations/admin-task-detail.html", "平台管理员"] },
  "REQ-TASK-005": { 用户App: ["奖励领取顺序（用户视角）", "user/home/all-tasks.html", "普通用户"] },
  "REQ-TASK-006": { 用户App: ["每日任务奖励（用户视角）", "user/home/all-tasks.html", "普通用户"] },
  "REQ-TASK-007": { 用户App: ["连续登录奖励（用户视角）", "user/home/all-tasks.html", "普通用户"], 管理后台: ["连续登录奖励配置（平台管理员视角）", "admin/operations/admin-task-detail.html", "平台管理员"] },
  "REQ-TASK-008": { 用户App: ["用户等级（用户视角）", "user/profile/profile.html", "普通用户或主播"], 管理后台: ["等级配置（平台管理员视角）", "admin/operations/admin-level-config.html", "平台管理员"] },
  "REQ-TASK-009": { 用户App: ["财富等级（用户视角）", "user/profile/profile.html", "普通用户"], 管理后台: ["财富等级配置（平台管理员视角）", "admin/operations/admin-level-config.html", "平台管理员"] },
  "REQ-GUILD-001": { 用户App: ["公会推荐（用户视角）", "user/home/live-plaza.html", "普通用户"], 公会App: ["公会状态（公会长视角）", "guild/home/guild-home.html", "公会长"], 管理后台: ["公会推荐（平台管理员视角）", "admin/operations/admin-guild-recommendation.html", "平台管理员"] },
  "REQ-GUILD-002": { 公会App: ["公会成员（公会长视角）", "guild/people/guild-member-list.html", "公会长"], 管理后台: ["公会详情（平台管理员视角）", "admin/guild/admin-guild-detail.html", "平台管理员"] },
  "REQ-GUILD-003": { 公会App: ["入会申请详情（公会长视角）", "guild/approval/guild-join-review-detail.html", "公会长"], 管理后台: ["主播认证详情（平台管理员视角）", "admin/host/admin-host-review-detail.html", "平台管理员"] },
  "REQ-GUILD-004": { 公会App: ["运营账号管理（公会长视角）", "guild/operations/guild-operation-accounts.html", "公会长"], 管理后台: ["运营账号管理（平台管理员视角）", "admin/accounts/admin-operation-accounts.html", "平台管理员"] },
  "REQ-GUILD-005": { 管理后台: ["用户列表（平台管理员视角）", "admin/user/admin-user-list.html", "平台管理员"] },
  "REQ-GUILD-006": { 管理后台: ["运营位配置（平台管理员视角）", "admin/operations/admin-placement-config.html", "平台管理员"] },
  "REQ-GUILD-007": { 管理后台: ["运营位排序（平台管理员视角）", "admin/operations/admin-placement-config.html", "平台管理员"] },
  "REQ-GUILD-008": { 管理后台: ["推送详情（平台管理员视角）", "admin/operations/admin-push-detail.html", "平台管理员"] },
};

const actions = {
  "REQ-ACC-001": "依次选择或切换规格要求的语言并重新进入目标页，记录页面文案语言",
  "REQ-ACC-002": "清除应用数据或首次安装后启动应用，不手动选择语言，进入登录首页",
  "REQ-ACC-003": "打开手机号区号选择器，选择 +62 后返回，再改选另一个可用区号",
  "REQ-ACC-004": "分别选择邮箱验证码登录和邮箱密码登录，输入有效测试邮箱及对应凭证后提交登录",
  "REQ-ACC-005": "编辑头像或昵称后点击保存，按当前场景让风控服务返回成功、不通过、约 3 秒延迟或网络异常",
  "REQ-ACC-006": "使用已封禁账号进入受限功能并点击提交、发送或开播按钮",
  "REQ-ACC-007": "将测试账号余额调整为 -1，再从设置页发起注销并确认",
  "REQ-ACC-008": "选择主播认证，分别输入 +62 与非 +62 手机号并上传 KTP、印尼驾驶证及其他证件后提交",
  "REQ-ACC-009": "在手机号注册页选择 +86 并输入格式正确的号码，尝试获取验证码或提交注册",
  "REQ-ACC-010": "上传已标记违规的头像或输入违规昵称并提交；后台场景同时检查用户资料操作区",
  "REQ-ACC-011": "平台管理员重置测试用户资料后，使用该用户账号刷新系统通知列表",
  "REQ-ACC-012": "分别输入普通用户昵称、主播昵称和直播主题执行搜索，检查返回对象类型",
  "REQ-LIVE-001": "分别从门票房、密码房和已拉黑关系的直播卡片进入直播间，停留在准入校验层",
  "REQ-LIVE-002": "在直播间发送普通礼物，再启用个人装扮道具并发送消息，对比两类展示效果",
  "REQ-LIVE-003": "打开同一礼物的列表行和详情页，定位特效文件字段或预览区域",
  "REQ-LIVE-004": "使用同一账号连续进入并退出同一直播间 5 次，再刷新各端访问统计",
  "REQ-LIVE-005": "主播开播后模拟网络断流，检查直播控制区可用操作及场次状态",
  "REQ-LIVE-006": "平台管理员强制关闭已有付费观众的门票房，再刷新观众订单与余额",
  "REQ-LIVE-007": "让主播退出旧公会并加入新公会，在三个目标端分别查询变更前后直播历史",
  "REQ-LIVE-008": "记录主播与直播间 ID，完成主播退出身份和恢复身份，再次查询两个标识",
  "REQ-LIVE-009": "点击任务入口并等待跳转完成，滚动检查任务列表首尾记录",
  "REQ-LIVE-010": "观众退出密码房，主播修改本场密码后，观众再次从直播卡片进入并输入旧密码",
  "REQ-LIVE-011": "主播先将 App 切换到后台 119 秒并返回，再切换到后台超过 120 秒；新开一场直播后关闭主播 App 进程",
  "REQ-LIVE-012": "后台为同一轮播规则配置多条素材并启用，用户端停留一个完整轮播周期",
  "REQ-LIVE-013": "分别创建推送对象为全部和指定公会的消息，使用公会内外账号检查接收结果",
  "REQ-LIVE-014": "打开礼物适用范围选择器，分别搜索一件已上架礼物和一件未上架礼物",
  "REQ-LIVE-015": "主播开播后打开房型设置，尝试从当前房型切换到另一房型并提交",
  "REQ-LIVE-016": "主播进入开播设置并选择门票房，定位门票价格选择控件",
  "REQ-LIVE-017": "主播进入美颜设置，切换美颜项并拖动滑块；再更换套餐账号比较可用项",
  "REQ-LIVE-018": "使用非主播账号查看三个主播入口，并分别点击开始直播和主播中心",
  "REQ-LIVE-019": "在同一账号下依次打开热门、新人和关注列表，记录三个列表的数据集合",
  "REQ-LIVE-020": "分别创建普通房、密码房和门票房直播并发送直播消息卡片，接收端打开卡片",
  "REQ-LIVE-021": "准备开播权限正常和受限的主播，在主播列表对比状态字段并打开详情核对",
  "REQ-LIVE-022": "主播同时开启广场展示和粉丝授权，分别用授权与未授权账号查看首页并用授权账号输入正确密码",
  "REQ-LIVE-023": "主播保存一次粉丝授权名单，退出设置后再次进入授权选择页",
  "REQ-LIVE-024": "主播在观众资料卡点击答谢，检查预填内容并继续进入答谢流程",
  "REQ-LIVE-025": "准备一名在线和一名已离线且均有贡献的观众，分别打开在线贡献榜与本场累计贡献榜",
  "REQ-LIVE-026": "准备关注人数与粉丝团人数不同的主播，刷新主播主页并核对粉丝数",
  "REQ-SOC-001": "为主播查询粉丝团数量，并将成员数依次准备为 499、500，尝试创建第二个粉丝团或加入新成员",
  "REQ-SOC-002": "让符合条件的用户在 499 人和 500 人粉丝团中打开加入页，分别尝试主动加入；随后主播移除一名成员后重试",
  "REQ-SOC-003": "使用同一用户加入粉丝群聊并刷新粉丝团状态；再将群成员填满后用新用户尝试加入",
  "REQ-SOC-004": "先由老成员发送 3 条群聊消息，再让新用户加入粉丝团并从群聊顶部向上滑动",
  "REQ-SOC-005": "主播踢出已进入的观众，在本场未结束时分别从免费入口和付费入口再次进入",
  "REQ-SOC-006": "A 与 B 保持非好友关系，A 连续向 B 发送 4 条消息，再由 B 向 A 连续发送 4 条消息",
  "REQ-SOC-007": "A 与 B 先产生聊天记录，再删除好友或会话关系，双方分别刷新会话列表并重新打开对话",
  "REQ-SOC-008": "主播在账号维度拉黑观众，观众退出后再次进入该主播直播间",
  "REQ-SOC-009": "将两名用户设为房管，主播打开其中一名房管资料卡并点击禁言、踢出或拉黑入口",
  "REQ-SOC-010": "主播对巡房账号分别发起拉黑和踢出，巡房账号重新进入并执行巡房操作",
  "REQ-SOC-011": "主播对用户执行单人禁言后解除，再新开下一场直播让同一用户发言",
  "REQ-SOC-012": "依次组合单人禁言和全员禁言，分别解除其中一个或全部后让目标用户发送消息",
  "REQ-SOC-013": "先授予用户房管权限，再分别由用户拉黑主播、主播拉黑用户，刷新房管列表",
  "REQ-SOC-014": "使用普通群成员和群主账号分别打开群资料编辑入口并尝试保存同一项修改",
  "REQ-SOC-015": "点击客服入口并记录系统实际唤起的应用或页面",
  "REQ-FIN-001": "在可输入金币数量的业务入口分别提交整数 1 和小数 1.5，并核对余额或保存结果",
  "REQ-FIN-002": "在幸运礼物概率配置中输入多位小数并保存，重新打开详情读取保存值",
  "REQ-FIN-003": "点击编辑，输入单次消耗 7 金币、开奖 1 次以及两档奖励和概率，点击保存并刷新详情",
  "REQ-FIN-004": "后台上架测试道具后使用未获取该道具的用户登录，并检查任务、购买和等级入口",
  "REQ-FIN-005": "购买一张门票并分别发送普通礼物、定制礼物和幸运礼物，再查询礼物价值、返奖及主播收益",
  "REQ-FIN-006": "分别产生门票、普通礼物、定制礼物和幸运礼物交易，刷新贡献榜并记录贡献增量",
  "REQ-FIN-007": "打开包含金额的目标页面并完成一笔交易，核对输入、明细和汇总币种",
  "REQ-FIN-008": "购买达到活动套餐限购上限后完成全额退款，再次尝试购买同一活动套餐",
  "REQ-FIN-009": "记录退款前主播收益，对订单分别执行退款和冲正后重新查询收益",
  "REQ-FIN-010": "在后台分别打开充值金币订单和购买礼物订单详情，检查并尝试执行退款",
  "REQ-FIN-011": "遍历资金相关页面及操作菜单，搜索并尝试进入提现入口",
  "REQ-FIN-012": "打开财务统计页并核对指标列表，再与收益、累计充值、累计退款的源订单汇总比对",
  "REQ-FIN-013": "后台配置套餐本金与赠送金币，用户端打开套餐并按两项数值人工计算赠送比例",
  "REQ-FIN-014": "让同一用户通过充值和非充值途径获得金币，查询余额账户及后台报表分类",
  "REQ-FIN-015": "让余额包含多次充值和赠金后完成消费，查询余额扣减及订单明细的资金追踪字段",
  "REQ-FIN-016": "记录退款前余额，对含本金金币和赠送金币的充值订单执行退款，再读取当前余额",
  "REQ-FIN-017": "后台录入套餐本金和赠送金币绝对值并保存，用户端刷新套餐卡片和最高赠送提示",
  "REQ-FIN-018": "使用运营账号分别查看余额、尝试充值、领取任务和发送幸运礼物；公会与后台同时核对发放记录",
  "REQ-FIN-019": "主播在开播设置中分别输入纯数字密码和含字母或符号的密码并提交",
  "REQ-TASK-001": "后台进入任务配置检查新建入口及可编辑字段，用户端打开全部任务列表",
  "REQ-TASK-002": "在同一任务中新增两个相同奖励档位值并保存",
  "REQ-TASK-003": "分别打开邀请奖励和普通任务奖励配置，尝试修改规则并在用户端刷新",
  "REQ-TASK-004": "先让用户达到较高档位，再由后台新增较低档位并保存，用户端立即刷新任务页",
  "REQ-TASK-005": "让用户同时达到多个未领取档位，重新进入任务页并记录优先展示项",
  "REQ-TASK-006": "用户当日完成每日任务但不领取，跨日后刷新；另完成一项任务后不点击领取检查余额",
  "REQ-TASK-007": "后台将连续登录最高档配置到第 z 天，用户连续登录到 z+1 天及以后并领取奖励",
  "REQ-TASK-008": "分别打开用户资料、主播中心和后台等级配置，定位主播等级与财富等级",
  "REQ-TASK-009": "准备累计打赏金额不同的用户，刷新财富等级并在后台核对等级数据",
  "REQ-GUILD-001": "后台停用当前推荐公会并刷新用户端推荐，再重新启用该公会并再次刷新",
  "REQ-GUILD-002": "在公会成员列表筛选或新增成员类型，核对可选类型和现有成员类型",
  "REQ-GUILD-003": "用户分别用 KTP 和驾驶证提交认证，公会或后台打开对应申请详情读取身份字段",
  "REQ-GUILD-004": "平台后台检查运营账号操作菜单并分别执行启用、停用和额度限制；公会端刷新账号状态",
  "REQ-GUILD-005": "准备用户 App 中不同身份和状态的用户，后台用户列表逐一查询并核对总数",
  "REQ-GUILD-006": "打开运营位类型选择器，核对可选类型并尝试搜索已取消的类型",
  "REQ-GUILD-007": "为两个运营位类型分别配置不同权重，保存后刷新各类型素材顺序",
  "REQ-GUILD-008": "创建并发送一条推送，进入已发送详情后检查并尝试取消",
};

function extraPreconditions(point) {
  const result = [];
  if (point.includes("500")) result.push("目标粉丝团成员数已按场景准备为 499 或 500 人");
  if (point.includes("5 次")) result.push("记录首次进入前的访问量基线");
  if (point.includes("120")) result.push("测试设备可保持后台运行并精确记录 119 秒与 121 秒");
  if (point.includes("负数")) result.push("测试账号当前余额为 -1");
  if (point.includes("网络异常")) result.push("可将保存请求切换为断网或超时响应");
  if (point.includes("审核不通过")) result.push("准备会命中风控拒绝规则的头像或昵称");
  if (point.includes("1%")) result.push("测试礼物价值应使 1% 收益可以独立人工核算");
  if (point.includes("幸运礼物 RTP")) result.push("单次消耗 7 金币、开奖 1 次；两个奖励档位各 1 金币，中奖概率分别为 86.2% 和 13.8%，按页面公式得到未舍入 RTP 14.2857%");
  if (point.includes("退款") || point.includes("冲正")) result.push("准备一笔已支付且满足退款或冲正条件的订单");
  return result;
}

function dimensionFor(point) {
  const normalized = String(point)
    .replace(/^(?:用户 App|公会 App|管理后台|平台后台|后台|系统|主播端|观众端)/u, "")
    .replace(/(?:应|仅|可以|可|必须|不得|不能|不提供|不保留|不接受|不允许|支持|展示|显示|保持|使用|自动|统一)/gu, "")
    .replace(/[“”`]/gu, "")
    .trim();
  return (normalized || "目标结果").slice(0, 24);
}

const stableRuleId = (scenario) => `BR-${sha256(`${scenario.需求编号}|${scenario.目标端}|${scenario.场景编号}|${scenario.可观察结果}`).slice(0, 14).toUpperCase()}`;

function expectedFor(scenario) {
  if (scenario.需求编号 === "REQ-LIVE-010") return "主播修改本场密码后，已退出密码房的用户再次进入时必须输入新密码";
  if (scenario.需求编号 === "REQ-LIVE-007" && scenario.场景描述.includes("后台保留")) return "后台保留主播在旧公会期间及加入新公会后的全部历史记录";
  if (scenario.需求编号 === "REQ-FIN-003" && scenario.场景描述.includes("向上取整")) return "按当前页面公式得到 14.2857% 时，RTP 计算结果为 14.3%";
  if (scenario.需求编号 === "REQ-FIN-003" && scenario.场景描述.includes("1 位小数")) return "RTP 以 1 位小数格式显示为 14.3%";
  return scenario.可观察结果;
}

function caseEligible(scenario, plan) {
  if (!plan) return false;
  if (scenario.需求编号 === "REQ-FIN-007" && scenario.场景描述.startsWith("系统金额统一")) return false;
  return true;
}

const crossFlowIds = new Set(["REQ-ACC-011", "REQ-LIVE-006", "REQ-LIVE-007", "REQ-LIVE-011", "REQ-LIVE-012", "REQ-LIVE-013", "REQ-FIN-005", "REQ-FIN-006", "REQ-FIN-008", "REQ-FIN-009", "REQ-FIN-013", "REQ-FIN-014", "REQ-FIN-015", "REQ-FIN-016", "REQ-FIN-017", "REQ-FIN-018", "REQ-TASK-003", "REQ-TASK-004", "REQ-TASK-007", "REQ-GUILD-001", "REQ-GUILD-003", "REQ-GUILD-004"]);

function routePending(item) {
  const text = `${item.待确认事项} ${item.当前已知或缺口} ${item.仍需明确}`;
  const result = new Set();
  if (/公会|公会长|运营账号/.test(text)) result.add("公会App");
  if (/后台|配置|统计|排序|支付|退款|OCR|审核|运营位|推送|服务商|套餐|额度|财务|报表/.test(text)) result.add("管理后台");
  if (/用户|主播|观众|直播|登录|注销|密码|粉丝|群|消息|礼物|金币|充值|任务|奖励|等级|勋章|客服|表情|私信|拉黑|禁言/.test(text)) result.add("用户App");
  if (!result.size) result.add("用户App");
  return [...result];
}

function pendingRecord(item, end) {
  const code = endConfig[end].code;
  return {
    问题编号: `IDN-${code}-${item.待确认编号}`,
    需求组编号: item.待确认编号,
    父问题编号: "",
    追问触发条件: "",
    阻塞等级: item.优先级分类.startsWith("P0") ? "部分阻塞" : "不阻塞",
    功能模块: "印尼直播需求缺口",
    具体场景: `${end}：${item.待确认事项}`,
    问题分类: item.优先级分类.startsWith("P0") ? "业务规则" : "流程与状态",
    待决策问题: item.仍需明确,
    可选方案: ["补充可测试的正式结论及适用范围", "明确本期不实现并记录后续版本范围"],
    测试建议: "确认后按最终规则补充正常、异常、边界及跨端一致性用例",
    产品结论: "",
    结论补充: "",
    已知依据: [`需求待确认.md:${item.来源行}`, `来源：${item.原始问答编号}`, item.当前已知或缺口],
    影响范围: [`${end} ${item.待确认事项}`],
    已有用例编号: [],
    确认后待补用例: [item.仍需明确],
    负责人: "产品",
    期望确认时间: "进入对应功能测试前",
    确认状态: "待确认",
  };
}

const [requirementsBaseline, scenarioBaseline, pendingBaseline, coverage] = await Promise.all([
  readJson(path.join(taskDir, "requirements-baseline.json")),
  readJson(path.join(taskDir, "scenario-baseline.json")),
  readJson(path.join(taskDir, "pending-risk-baseline.json")),
  readJson(path.join(taskDir, "coverage-mapping.json")),
]);
const requirements = new Map(requirementsBaseline.需求.map((item) => [item.需求编号, item]));
const coverageByScenario = new Map(coverage.场景映射.map((item) => [item.场景编号, item]));
const baselineLock = await readJson(path.join(taskDir, "baseline-lock.json"));
const entryEvidence = [];
for (const [id, byEnd] of Object.entries(plans)) for (const [end, [, relativePage]] of Object.entries(byEnd)) {
  const absolutePage = path.join(prototypeRoot, relativePage);
  const text = await fs.readFile(absolutePage, "utf8");
  entryEvidence.push({ 需求编号: id, 目标端: end, 页面: `liveshow-proto/prototype/pages/${relativePage}`, SHA256: sha256(text), 用途: "仅证明当前入口，不定义业务规则" });
}
await writeJson("entry-evidence-map.json", { 生成时间: new Date().toISOString(), 页面入口数: entryEvidence.length, 入口证据: entryEvidence });

const ruleCatalog = scenarioBaseline.场景.map((scenario) => {
  const requirement = requirements.get(scenario.需求编号);
  const plan = plans[scenario.需求编号]?.[scenario.目标端];
  return {
    稳定规则标识: stableRuleId(scenario),
    需求编号: scenario.需求编号,
    业务对象: dimensionFor(scenario.场景描述),
    执行角色: plan?.[2] || "待确认",
    适用角色和端: [scenario.目标端],
    触发动作: plan ? actions[scenario.需求编号] : "",
    必要条件: extraPreconditions(scenario.场景描述),
    来源状态: "需求规格说明正式规则",
    目标状态或可观察结果: scenario.可观察结果,
    规则状态: caseEligible(scenario, plan) ? "已确认" : "入口待确认",
    可生成正式用例: caseEligible(scenario, plan),
    证据引用: [{ 路径: "sources/需求规格说明.md", SHA256: baselineLock.来源哈希["sources/需求规格说明.md"], 位置: `第${requirement.来源行}行`, 证明内容: requirement.需求原文 }],
  };
});
await writeJson("business-rule-catalog.json", { 生成时间: new Date().toISOString(), 规则数: ruleCatalog.length, 规则: ruleCatalog });

const results = {};
const dispositions = [];
for (const [end, config] of Object.entries(endConfig)) {
  const history = await readJson(path.join(historyRoot, config.history));
  const additions = [];
  const entryGaps = new Map();
  for (const scenario of scenarioBaseline.场景.filter((item) => item.目标端 === end)) {
    const mapped = coverageByScenario.get(scenario.场景编号);
    if (mapped.覆盖状态 === "已覆盖") {
      dispositions.push({ ...mapped, 处理去向: "现有用例覆盖", 最终用例编号: mapped.最佳匹配用例编号 });
      continue;
    }
    const plan = plans[scenario.需求编号]?.[end];
    if (!caseEligible(scenario, plan)) {
      entryGaps.set(scenario.需求编号, [...(entryGaps.get(scenario.需求编号) || []), scenario]);
      dispositions.push({ ...mapped, 处理去向: "目标端入口待确认", 最终用例编号: "" });
      continue;
    }
    const requirement = requirements.get(scenario.需求编号);
    const [structure, relativePage, role] = plan;
    const dimension = dimensionFor(scenario.场景描述);
    const ruleId = stableRuleId(scenario);
    const sequence = additions.length + 1;
    const caseId = `IDN-${config.code}-${String(sequence).padStart(4, "0")}`;
    const negativeCase = /不|不能|不得|拒绝|屏蔽|拦截|作废|清空|移除|置灰|结束/.test(scenario.可观察结果);
    additions.push({
      序号: history.测试用例.length + sequence,
      用例编号: caseId,
      功能模块: domainModule[requirement.需求域],
      功能结构: structure,
      用例类型: negativeCase ? "异常用例" : "功能需求",
      优先级: /账号|密码|封禁|注销|门票|收益|退款|充值|余额|金币|支付|权限|拉黑|禁言/.test(scenario.可观察结果) ? "P1" : "P2",
      用例描述: `验证${structure}在“${dimension}”场景下的处理`,
      验证用例子项: `${dimension}观察项`,
      前置条件: [
        `${role}账号及关联业务数据已准备，账号可进入当前页面`,
        ...extraPreconditions(scenario.场景描述),
      ],
      操作步骤: [
        `使用${role}账号从当前端导航进入【${structure}】`,
        actions[scenario.需求编号],
        `刷新【${structure}】，查询“${dimension}”对应的业务记录或界面反馈`,
      ],
      预期结果: [expectedFor(scenario)],
      流程编号: crossFlowIds.has(scenario.需求编号) ? `FLOW-${scenario.需求编号.slice(4)}-${config.code}` : "",
      测试结果: "未测",
      测试人员: "",
      备注: [
        `需求：${scenario.需求编号}`,
        `业务规则来源：需求规格说明.md:${requirement.来源行}`,
        `原始问答：${requirement.原始问答编号}`,
        `入口证据：liveshow-proto/prototype/pages/${relativePage}`,
        `规则：${ruleId}`,
        `基线场景：${scenario.场景编号}`,
        `补充前覆盖：${mapped.覆盖状态}；最佳匹配 ${mapped.最佳匹配用例编号}；预期分数 ${mapped.最佳匹配预期分数}`,
        "未动态验证",
      ],
    });
    dispositions.push({ ...mapped, 处理去向: "新增正式用例", 最终用例编号: caseId });
  }

  const pendingFromSource = pendingBaseline.风险与缺口.filter((item) => routePending(item).includes(end)).map((item) => pendingRecord(item, end));
  const pendingFromEntry = [...entryGaps.entries()].map(([id, scenes], index) => ({
    问题编号: `IDN-${config.code}-ENTRY-${String(index + 1).padStart(3, "0")}`,
    需求组编号: id,
    父问题编号: "",
    追问触发条件: "",
    阻塞等级: "部分阻塞",
    功能模块: domainModule[requirements.get(id).需求域],
    具体场景: `${end}缺少可确认的当前入口：${scenes.map((item) => item.场景描述).join("；")}`,
    问题分类: "角色与权限",
    待决策问题: `请确认 ${id} 是否适用于${end}；如适用，请提供页面入口、执行角色和可观察位置`,
    可选方案: ["适用并补充明确入口", "本端不适用并指定覆盖端"],
    测试建议: "入口确认后再生成正式用例，不使用其他端或历史用例推定本端入口",
    产品结论: "",
    结论补充: "",
    已知依据: [`需求规格说明.md:${requirements.get(id).来源行}`, `需求：${id}`],
    影响范围: scenes.map((item) => `${end} ${item.场景编号}`),
    已有用例编号: scenes.map((item) => coverageByScenario.get(item.场景编号).最佳匹配用例编号),
    确认后待补用例: scenes.map((item) => item.场景描述),
    负责人: "产品",
    期望确认时间: "进入对应功能测试前",
    确认状态: "待确认",
  }));

  const existingPendingIds = new Set(history.需求待确认.map((item) => item.问题编号));
  const newPending = [...pendingFromSource, ...pendingFromEntry].filter((item) => !existingPendingIds.has(item.问题编号));
  const final = { 测试用例: [...history.测试用例, ...additions], 需求待确认: [...history.需求待确认, ...newPending] };
  const outDir = path.join(taskDir, config.dir);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, config.json), `${JSON.stringify(final, null, 2)}\n`);
  await fs.writeFile(path.join(outDir, "new-testcases.json"), `${JSON.stringify({ 测试用例: additions }, null, 2)}\n`);
  await fs.writeFile(path.join(outDir, "new-pending.json"), `${JSON.stringify({ 需求待确认: newPending }, null, 2)}\n`);
  results[end] = { 原有用例: history.测试用例.length, 新增用例: additions.length, 最终用例: final.测试用例.length, 原有待确认: history.需求待确认.length, 新增待确认: newPending.length, 最终待确认: final.需求待确认.length, 入口缺口需求数: entryGaps.size };
}

await writeJson("scenario-disposition.json", { 生成时间: new Date().toISOString(), 场景数: dispositions.length, 场景处理: dispositions });
await writeJson("supplement-summary.json", { 生成时间: new Date().toISOString(), 基线规则数: requirements.size, 基线场景数: scenarioBaseline.场景.length, 覆盖复核: coverage.覆盖汇总, 分端结果: results });

const manifestPath = path.join(taskDir, "generation-input-manifest.json");
const manifest = await readJson(manifestPath);
manifest.输入 = manifest.输入.filter((item) => !["当前入口证据", "本次最终产物"].includes(item.角色));
for (const evidence of entryEvidence) manifest.输入.push({ 路径: path.relative(taskDir, path.join(root, evidence.页面)), SHA256: evidence.SHA256, 角色: "当前入口证据", 内容类型: `${evidence.目标端}页面入口`, 允许定义业务规则: false });
for (const [end, config] of Object.entries(endConfig)) {
  const relative = `${config.dir}/${config.json}`;
  manifest.输入.push({ 路径: relative, SHA256: sha256(await fs.readFile(path.join(taskDir, relative))), 角色: "本次最终产物", 内容类型: `${end}最终测试用例JSON`, 允许定义业务规则: false });
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify(results, null, 2));
