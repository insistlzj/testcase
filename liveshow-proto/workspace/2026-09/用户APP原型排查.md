# 用户 APP 原型排查

日期：2026-09-09。仅排查，未修改原型。

## 范围与结论

- 以当前工作区《系统概要 .md》为依据，检查页面树中用户 APP 的 65 个独立页面，包含主播身份页面；不展开公会端、管理后台。
- 核对页面代码、公共脚本、Mock、视图注册及实际生效批注；浏览器抽查修改密码、私信额度、密码房开播、接受连麦邀请。
- **65 页均有批注，没有整页批注缺失。** 查看器优先读取 `prototype/annotations/user.js`，命中后不再展示 `assets/annotations.js` 中的同页批注。
- 可静态解析的页面内 HTML 跳转目标未发现文件不存在；主要问题是入口未接、跳错页面、未携带对象及状态缺失。此项不代表所有动态跳转均正确。
- 以下“缺状态”指缺少可查看的业务形态，不把未调用 `registerStates` 直接等同于未实现。后端动作已有 Toast 且批注说明结果的，不单独判为缺交互。

## 4. 本轮字段释义核对（2026-09-10）

本轮只核对 `pages/user/**` 独立页面及其用户 APP 批注中的“字段”分节，不重复处理上一轮的交互、跳转和状态问题。

| 页面 | 界面信息 | 批注缺漏 | 处理 |
| --- | --- | --- | --- |
| [充值福利 P012](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/welfare-center.html:121) | 邀请好友、充值福利、连续签到进度、签到奖励、任务名称、任务进度和领取状态 | 页面没有“字段”分节；现有批注分散描述了业务规则，但未逐项解释界面字段 | 补充字段分节 |
| [直播结束页（观众） P003-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-end-viewer.html:59) | 主播头像、主播名称、直播结束状态、结束提示和返回首页 | 只有业务和交互，没有界面字段释义 | 补充字段分节 |
| [主播中心 P027](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/host-center.html:296) | 主播资料、累计收益、粉丝、今日/本月指标、有效天进度、工具入口 | 当前已有“主播信息字段”和“数据中心字段”，覆盖界面信息 | 不修改 |

### 本轮修改页面清单

- `prototype/pages/user/home/welfare-center.html`：仅补对应批注字段释义，页面不改。
- `prototype/pages/user/live/live-end-viewer.html`：仅补对应批注字段释义，页面不改。

### 排除项

- 直播间及弹窗视图中的字段已有独立批注，动作确认类视图不因没有字段分节重复增加。
- 未从界面可见信息推导新的业务规则；金额、任务配置和结束后的消费处理沿用现有批注及项目需求清单。

## 1. 状态样式缺失

| 页面 | 缺少的状态或展示 | 批注情况 |
| --- | --- | --- |
| [手机号登录 A002](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/auth/auth-phone-login.html:638)、[邮箱登录 A004](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/auth/auth-email-login.html:336) | 账号封禁、凭证错误、验证码过期及连续错误失效；当前填写满足格式后直接成功。 | 验证码时效已写；两个登录页未补封禁、验证失败的落点。第三方登录 A001 已有封禁演示。 |
| ✅[我的公会 P032](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-application-records.html:87)、[公会详情 P032-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-detail.html:200)、[申请成为主播 P014-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/host-center-pending.html:270) | 公会初审、平台终审分别处理中和分别驳回的状态；目前用“加入审核中、已通过、已驳回”合并，申请成为主播页仍是旧三步。 | [批注](/Users/szx/Documents/Geekup/Liveshow/prototype/annotations/user.js:1033)已列明两级审核；页面未对齐。 |
| ✅[我的 P019](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/profile.html:253)、[主播中心 P027](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/host-center.html:1)、[开播设置 P031](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/start-live-settings.html:1043) | 已有主播身份但直播权限关闭、因退会/移除/公会停用失去身份、直播中被关闭权限；缺开播拦截及对应结果画面。 | 开播条件已有说明；公会停用后在用户 APP 的通知、入口和去向未完整说明。 |
| [直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:1)、[直播间-主播 P008](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-host.html:1)、[直播间-连麦中-主播 P005](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-cohost-active.html:1)、[直播结束页（观众） P003-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-end-viewer.html:1) | 观众被动收到关播、账号强制下线；正常结束页有，但缺从直播中进入结束态的演示。连麦缺对方下播/邀请失效及连接失败形态。 | 场次结束、权限关闭、账号处置已有规则；不属于整页无批注。 |
| [1 对 1 私信 P015](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/direct-message.html:161)、[粉丝团群聊 P011-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/fan-group-chat.html:358)、[群管理（成员） P017](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/group-manage-member.html:1) | 好友不限量/非好友限额、✅拉黑不可聊；✅群聊单人禁言、全员禁言、失去团籍。✅群聊当前只有直播卡片“直播中/已结束”切换。 | [批注](/Users/szx/Documents/Geekup/Liveshow/prototype/annotations/user.js:795)、[批注](/Users/szx/Documents/Geekup/Liveshow/prototype/annotations/user.js:823)已说明，缺对应输入区和退出状态。 |
| [用户主页 P043](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/user-home.html:438)、[主播主页 P035-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/host-home.html:737)、[互动通知 P047](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/interaction-notifications.html:102) | 好友申请已发送/待处理、因拉黑失效；主页仍能反复点击加好友，通知只有同意/拒绝结果。 | 待处理不可重复及失效规则已写；主页未展示申请中状态。 |
| [头像框 P011-4-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/my-decoration-avatar-frame.html:88)、[聊天气泡 P011-4-2](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/my-decoration-chat-bubble.html:87)、[勋章 P011-4-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/my-decoration-medal.html:90) | 永久/到期时间、已过期、不可佩戴、到期自动卸下；当前数据只有佩戴状态，所有道具可操作。 | [批注](/Users/szx/Documents/Geekup/Liveshow/prototype/annotations/user.js:418)及分类批注已说明；缺样式与有效期数据。 |
| [余额充值 P038](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/recharge.html:223)、[充值订单详情 P040](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/order-income-detail.html:78)、[支出订单详情 P041](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/order-expense-detail.html:78)、[余额明细 P039](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/balance-detail.html:85) | 负余额；充值支付中/失败/取消/超时/退款/拒付；消费失败、幸运礼物投入和返奖、门票失效。订单详情目前连状态字段都未展示。 | 实际批注已列明这些状态和结果；缺演示。 |
| [直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:1)、[余额充值 P038](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/recharge.html:1)、[充值福利 P012](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/welfare-center.html:1)、[我的 P019](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/profile.html:1) | 运营账号视角：虚拟金币、普通/定制礼物可送、幸运礼物不可送、无需门票/密码、不可充值及领取福利。用户 APP 无对应身份切换和限制展示。 | 概要 §3.7 与礼物/充值/福利批注有规则；页面未实现。 |
| [直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:1)、[主播主页 P035-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/host-home.html:1)、[粉丝团 P026](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club.html:1) | 粉丝团满 500 人不能加入、未创建粉丝团及创建后状态。已有已加入/未加入、条件不足，不等于有满员或未创建态。 | 满员限制已有说明；首次创建流程未定义，见下表。 |
| [我的关注 P034-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/my-following.html:1)、[我的粉丝团 P025](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/fan-club/my-fan-clubs.html:1)、[消息 P014](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/message-center.html:1)、[系统通知 P054](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/system-notifications.html:1)、[互动通知 P047](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/interaction-notifications.html:1)、[我的公会 P032](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-application-records.html:1)、[粉丝列表 P014-2](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-list.html:1)、[粉丝团 P026](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club.html:1)、[余额明细 P039](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/balance-detail.html:1)、[分成记录 P037](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/income-sharing.html:1) | 暂无关注/团籍/会话/通知/申请/粉丝/成员/流水/结算记录的空态。当前列表无数据时没有完整的可评审空态。 | 我的关注已写空态；其他所列页面未明确无记录展示。 |
| [首页 P001](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/live-plaza.html:1)、[主播榜 P001-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/host-ranking.html:1)、[贡献榜（平台） P001-4](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/contribution-ranking.html:1)、[邀请好友 P009](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/invite-friends.html:1) | 分类无直播；榜单为空或不足 3 人；邀请记录为 0。榜单渲染直接取前三，邀请分页空数据时会得到 1 / 0。 | 首页仅说明无关注在播时隐藏关注栏；未补其余空态。 |

## 2. 批注缺漏或与概要冲突

| 页面/范围 | 问题 | 建议补齐 |
| --- | --- | --- |
| [设置 P011-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/settings.html:260)、[登录与注册 A001](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/auth/auth-login-register.html:1) | “修改登录密码”有入口，但登录页不处理 `flow=reset`，批注也没有修改/重置密码流程。 | 补验证身份、设置新密码、失败反馈和完成去向。依据概要“管理账号”。 |
| [直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:1) 礼物视图 | 已有扣款和开奖规则，但缺本人中奖/未中奖结果如何呈现，以及连续赠送的交互说明；当前循环播放他人的中奖提示不能替代本人开奖结果。 | 明确连续送礼触发/结束、本人结果展示和失败中断；无需模拟真实概率。 |
| [粉丝团 P026](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club.html:1)、[粉丝团设置 P026-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club-settings.html:1) | 概要包含“创建并设置粉丝团”；当前只有已创建团及编辑页，没有首次创建入口、表单及批注。 | 明确首次创建触发、必填内容和创建成功后的页面。 |
| [直播间-主播 P008](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-host.html:1)、[直播间-连麦中-主播 P005](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-cohost-active.html:1) | 概要 §3.3.4 明确“接受邀请后，已收到的其他邀请保留”；连麦邀请提示批注却写“其他邀请失效”。 | 统一接受邀请后的其他邀请状态及可操作性。[冲突批注](/Users/szx/Documents/Geekup/Liveshow/prototype/annotations/user.js:2285) |
| [直播间-主播 P008](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-host.html:1) 清屏 | 概要 §3.3.2 描述主播/观众均看不到被屏蔽评论并清空公屏；主播页及更多视图批注将清屏限定为“仅当前主播设备”。 | 明确主播清屏与观众本地清屏的作用范围，不混用。[批注](/Users/szx/Documents/Geekup/Liveshow/prototype/annotations/user.js:617) |
| [余额明细 P039](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/balance-detail.html:1)、[直播数据 P035](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/live-data.html:1)及榜单 | 概要规定成功礼物/门票不可退，充值退款不撤销既有消费及收益；流水原型却有“礼物退款”，部分数据/榜单批注笼统要求退款后重算。 | 移除与概要冲突的礼物退款演示；明确冲正对象，避免将充值退款解释为撤销历史贡献/收益。 |
| [公会中心 P030](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-management.html:1)、[公会详情 P032-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-detail.html:1)、[系统通知 P054](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/system-notifications.html:1) | 当前概要新增公会停用后解除主播关系、失去身份并停播；用户 APP 公会批注没有说明该原因下的结果状态，系统通知还保留“加入公会后继续申请直播权限”的旧分步文案。 | 补公会停用导致关系解除的用户侧通知与入口变化，统一两级审核后的身份口径。 |
| [设置 P011-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/settings.html:1) | 概要要求维护“隐私”，当前只有协议/隐私政策及通知设置，未见可维护的隐私选项。 | 先确认隐私管理具体范围；不据此擅自新增开关。 |

## 3. 交互原型缺失或跳转错误

| 页面/路径 | 实际缺口 | 验证 |
| --- | --- | --- |
| [设置 P011-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/settings.html:260) → 登录与注册 | 修改密码进入普通登录首页，未进入密码重置流程。 | 浏览器复现。 |
| [开播设置 P031](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/start-live-settings.html:765) → 直播间 | 选择密码房并保存后，进入直播间仍固定到普通主播房；门票房同样共用这个固定目标。密码房页面虽存在，但没有从此开播链路接入。 | 密码房浏览器复现；门票房由同一固定跳转确认。 |
| [直播间-主播 P008](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-host.html:1) → [直播间-连麦中-主播 P005](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-cohost-active.html:1) | 接受邀请只关闭弹层并提示成功，不进入双人连麦画面；已存在的连麦页未接到接受邀请流程。发起邀请后被接受的路径也缺失。 | [处理代码](/Users/szx/Documents/Geekup/Liveshow/prototype/assets/common.js:1318)；接受邀请浏览器复现。 |
| [1 对 1 私信 P015](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/direct-message.html:163) | 文本无论好友身份都使用三条上限；图片/语音走另一套发送入口，绕过文本限额。 | 浏览器复现文本达限后图片仍可发送；语音同类代码证据见 [媒体发送](/Users/szx/Documents/Geekup/Liveshow/prototype/assets/chat-media.js:88)。 |
| [粉丝团群聊 P011-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/fan-group-chat.html:1) → [群管理（群主） P018](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/group-manage-owner.html:1) / [粉丝团 P026](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club.html:1) | 群聊“更多”固定进入成员管理页，群主页无正常入链；群主页无全员禁言控件；单人禁言只有 Toast，缺已禁言/解除禁言；“编辑公告”仅 Toast。 | [群聊入口](/Users/szx/Documents/Geekup/Liveshow/prototype/assets/common.js:834)；[群管理（群主） P018](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/group-manage-owner.html:141)；[粉丝团 P026](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club.html:402) |
| [用户主页 P043](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/user-home.html:476)、[主播主页 P035-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/host-home.html:765) → 私信/举报 | 私信未传目标账号，始终打开 Sari 会话；举报直接提示已提交，没有选择举报原因。 | 页面与公共脚本核对。 |
| [单聊设置 P042](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/chat-settings.html:1) → [举报用户 P006-2](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room-user-report.html:186) | 举报页返回、取消和提交成功均固定返回观众直播间，不返回聊天设置/原来源。 | 页面代码确认；与“返回来源页”批注不符。 |
| [搜索结果 P001-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/search-results.html:347)、[我的关注 P034-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/profile/my-following.html:123)、[我的粉丝团 P025](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/fan-club/my-fan-clubs.html:1) | 搜索未开播主播跳至 `user-home.html?host=...`，目标页不读取该参数；多个直播/粉丝群入口未携带或未读取对象，Maya 等入口会落到固定 Sari 内容，房型准入也没有按对象衔接。 | 目标页面参数与公共脚本核对。 |
| [公会中心 P030](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-management.html:276) → [公会详情 P032-3](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-detail.html:1) / [申请加入公会 P030-1](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/guild/guild-application-form.html:1) | 只按单个公会按钮状态禁用，当前已有公会/处理中申请仍可点其他公会申请；公会中心卡片无详情点击；详情页缺未加入或驳回后的申请入口。 | 代码与 Mock 确认；同一账号的目录/我的公会状态还互相不一致。 |
| [系统通知 P054](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/system-notifications.html:109)、[消息 P014](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/message-center.html:131) | 系统通知点击只标已读/Toast，没有按业务对象进入公会或申请页；Budi 私信会话仍只有 Toast。 | 已排除公共脚本补接的 Sari 会话和通讯录入口。 |
| [直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:3424) 门票视图 | 充值按钮只提示“打开充值”；购买直接成功，缺余额不足转充值、已购门票重复进入及失败结果的可操作分支。 | 购票成功可用 Toast；问题在缺必要分支。 |
| [余额充值 P038](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/recharge.html:237)、[直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:1) 礼物/充值视图 | 均只展示发起支付/赠送成功，未提供支付结果、余额不足或礼物不可用状态演示，也未说明本轮原型用批注替代这些交互。 | 需补状态演示，不要求真实支付或真实开奖。 |
| [余额明细 P039](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/balance-detail.html:91) → [充值订单详情 P040](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/order-income-detail.html:1) / [支出订单详情 P041](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/wallet/order-expense-detail.html:1) | 点击各充值记录始终展示同一个首充订单；门票、充值退款、礼物都进入固定“星光礼物”支出详情，没有按订单/消费类型区分。 | 静态数据及跳转代码确认。 |
| [直播记录 P036](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/live-records.html:407)、[分成记录 P037](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/income-sharing.html:85)、[直播数据 P035](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/live-data.html:650) | 直播记录/分成记录点击仅 Toast，无对应场次或结算结果；直播数据进入直播记录不带日期范围；分成页没有批注所述周期切换。 | 公共脚本未补接这些详情。 |
| [好友列表 P043](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/social/friend-list.html:136)、[粉丝团 P026](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/host/fan-club.html:486) | 好友列表批注写有“点击私信”，页面无私信入口；粉丝团成员资料点击仍只 Toast。 | 页面和公共脚本确认。 |
| [直播间-观众 P006](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/live/live-room.html:769)、[邀请好友 P009](/Users/szx/Documents/Geekup/Liveshow/prototype/pages/user/home/invite-friends.html:1) | 观众转发仅提示“打开转发”；邀请好友有选项，但发送给好友/保存图片只 Toast，没有对应选择或结果演示；群管理两页“举报”也仅 Toast。 | 系统分享可用模拟面板或明确批注替代；当前未声明简化边界。 |

## 已有实现，不作为缺失

- 搜索历史清空、搜索无结果、好友搜索无结果、公会搜索无结果、可见粉丝搜索无结果均已有空态；黑名单清空、房管清空也有空态。
- 登录与注册已有第三方登录失败/取消/封禁/注销冷静期；资料编辑已有保存中、不合规和网络异常结果。
- 直播间已有密码输入错误、门票准入、拉黑/踢出拦截、禁言输入态、房管确认；不能笼统归为“无状态”。
- “我的”充值/黑名单、消息通讯录、Sari 私信及粉丝群入口由公共脚本补接，不能仅凭 HTML 中原有 Toast 判错。
- 全部任务的“去完成”使用提示前往路径，实际批注明确允许该简化，不单独记为交互遗漏。

## 建议顺序

1. 先统一入会认证、公会停用、连麦邀请、清屏和退款口径，避免按错误批注补页面。
2. 接通修改密码、房型开播、连麦、群主管理、举报返回及对象详情跳转。
3. 补权限、群聊禁言、支付/消费、道具到期、运营账号状态；再补列表空态。

本报告不要求实现后端、真实支付或跨页面持久化；状态可通过查看器切换，流程可使用明确的 Mock 参数演示。未逐页进行全量浏览器回归。
