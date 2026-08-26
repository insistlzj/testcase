# 用户/主播 App 页面架构

> 以 `prototype/index.html` 的用户 APP 页面树和 `prototype/pages/user/` 为准。
> 用户与主播共用同一 App；主播身份页面由“我的”进入，不另设底部导航。

## 一、主框架

- 底部导航：`首页 / 福利 / 消息 / 我的`。
- 用户 APP 页面树分为：系统入口、首页与福利、直播、消息与社交、我的、公会关系、主播中心、钱包与账单。
- 直播间、私信和粉丝团群是场景页；主播中心、钱包、公会关系是业务页，不占底部导航位。

| 底部页 | 主页面 | 核心入口 |
|---|---|---|
| 首页 | `live-plaza.html` | 榜单、搜索、直播间、主播主页 |
| 福利 | `welfare-center.html` | 签到、任务、邀请好友、充值福利 |
| 消息 | `message-center.html` | 系统通知、互动通知、私信、粉丝团群 |
| 我的 | `profile.html` | 资料、关注、装扮、粉丝团、主播中心、公会、设置 |

## 二、系统入口

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 登录与注册 | `pages/user/auth/auth-login-register.html` | 第三方、手机号、邮箱登录与注册入口。 |
| 资料补全 | `pages/user/auth/auth-profile-completion.html` | 新用户选择默认头像、填写昵称或跳过。 |
| 手机号登录 | `pages/user/auth/auth-phone-login.html` | 短信验证码或密码登录。 |

## 三、首页与福利

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 首页 | `pages/user/home/live-plaza.html` | 热门/新人直播流、关注主播、榜单、分类与搜索入口。 |
| 主播榜 | `pages/user/home/host-ranking.html` | 按日/周/月查看主播收礼排名。 |
| 平台贡献榜 | `pages/user/home/contribution-ranking.html` | 按日/周/月查看用户送礼贡献排名。 |
| 搜索 | `pages/user/home/search.html` | 搜索房间号、主播 ID 或主播昵称。 |
| 搜索结果 | `pages/user/home/search-results.html` | 展示匹配主播；直播中进入直播间，未直播进入主播主页。 |
| 福利 | `pages/user/home/welfare-center.html` | 签到、任务、邀请好友与充值福利。 |
| 邀请好友 | `pages/user/home/invite-friends.html` | 邀请奖励、邀请记录与活动说明。 |

## 四、直播

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 观众直播间 | `pages/user/live/live-room.html` | 普通房观看、公屏、送礼、贡献榜、粉丝团与在线观众。 |
| 直播间举报 | `pages/user/live/live-room-report.html` | 选择举报原因、填写说明并提交。 |
| 主播直播间 | `pages/user/live/live-room-host.html` | 普通房开播、用户经营、互动管理与 PK。 |
| 主播密码房 | `pages/user/live/live-room-host-password.html` | 密码房开播与密码管理；不支持连麦或 PK。 |
| 主播连麦中 | `pages/user/live/live-room-cohost-active.html` | 普通房双主播连麦分屏；一期不支持超过两人。 |
| 观众直播结束页 | `pages/user/live/live-end-viewer.html` | 直播结束后的观看侧承接页。 |
| 主播直播结束页 | `pages/user/live/live-end-host.html` | 主播结束直播后的数据与操作承接页。 |

## 五、消息与社交

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 消息 | `pages/user/social/message-center.html` | 私信与粉丝团消息入口。 |
| 系统通知 | `pages/user/social/system-notifications.html` | 公会、主播身份、直播权限及资料结果通知。 |
| 1 对 1 私信 | `pages/user/social/direct-message.html` | 好友私信会话。 |
| 粉丝团群聊 | `pages/user/social/fan-group-chat.html` | 团籍成员群聊与群内直播房间卡片。 |
| 群管理（成员） | `pages/user/social/group-manage-member.html` | 群公告、免打扰与举报。 |
| 群管理（群主） | `pages/user/social/group-manage-owner.html` | 群公告编辑、成员管理等群主操作。 |
| 聊天设置 | `pages/user/social/chat-settings.html` | 私信对象信息、拉黑与举报。 |
| 好友列表 | `pages/user/social/friend-list.html` | 搜索好友并进入用户或主播主页。 |
| 互动通知 | `pages/user/social/interaction-notifications.html` | 关注、好友申请及处理结果。 |
| 用户主页 | `pages/user/social/user-home.html` | 用户资料、关注、好友与拉黑状态。 |
| 主播主页 | `pages/user/social/host-home.html` | 主播资料、主播等级、粉丝团、送礼和直播入口。 |
| 主播礼物展馆 | `pages/user/social/host-gift-gallery.html` | 指定主播累计收到的礼物明细。 |

## 六、我的

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 我的 | `pages/user/profile/profile.html` | 个人资料、资产、装扮、粉丝团、主播中心与公会入口。 |
| 资料编辑 | `pages/user/profile/profile-edit.html` | 编辑头像、昵称、背景图及其他资料；头像、昵称回显风控检测状态。 |
| 我的关注 | `pages/user/profile/my-following.html` | 已关注主播及其开播状态。 |
| 我的装扮 | `pages/user/profile/my-decoration.html` | 已佩戴装扮及分类入口。 |
| 头像框 | `pages/user/profile/my-decoration-avatar-frame.html` | 头像框列表与佩戴。 |
| 聊天气泡 | `pages/user/profile/my-decoration-chat-bubble.html` | 聊天气泡列表与佩戴。 |
| 勋章 | `pages/user/profile/my-decoration-medal.html` | 勋章列表与佩戴。 |
| 设置 | `pages/user/profile/settings.html` | 账号安全、通知、语言、注销与退出登录。 |
| 黑名单管理 | `pages/user/profile/blacklist-management.html` | 查看及解除账号拉黑。 |
| 我的粉丝团 | `pages/user/fan-club/my-fan-clubs.html` | 已加入粉丝团、群聊与贡献榜入口。 |
| 粉丝团贡献榜 | `pages/user/fan-club/fan-contribution-ranking.html` | 指定主播粉丝团的贡献排名与我的排名。 |

## 七、公会关系

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 公会中心 | `pages/user/guild/guild-management.html` | 浏览、搜索公会；提交入会申请；进入我的公会。 |
| 申请加入公会 | `pages/user/guild/guild-application-form.html` | 填写申请资料并提交。 |
| 我的公会 | `pages/user/guild/guild-application-records.html` | 查看当前申请和已加入公会。 |
| 公会详情 | `pages/user/guild/guild-detail.html` | 入会、退会申请时间轴及状态。 |
| 申请退出公会 | `pages/user/guild/guild-leave-application.html` | 提交退出申请。 |

## 八、主播中心

主播中心仅对主播相关账号开放；未满足条件时展示申请成为主播页，已开通直播权限后进入主播工作台和开播设置。

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 主播中心 | `pages/user/host/host-center.html` | 收益、有效天、直播数据、主播工具与公会入口。 |
| 房管管理 | `pages/user/host/moderator-management.html` | 查看、添加及取消房管。 |
| 公会通知 | `pages/user/host/host-guild-notifications.html` | 查看公会运营通知。 |
| 申请成为主播 | `pages/user/host/host-center-pending.html` | 加入公会、主播认证与直播权限状态。 |
| 开播设置 | `pages/user/host/start-live-settings.html` | 封面、标题、分类、房型、美颜及开播准备。 |
| 粉丝列表 | `pages/user/host/fan-list.html` | 查看粉丝并进入用户主页。 |
| 粉丝团 | `pages/user/host/fan-club.html` | 管理成员、加入条件与粉丝贡献。 |
| 粉丝团设置 | `pages/user/host/fan-club-settings.html` | 配置粉丝团名称和加入条件。 |
| 直播数据 | `pages/user/host/live-data.html` | 日/月数据、有效天和主播经营指标。 |
| 直播记录 | `pages/user/host/live-records.html` | 按日期筛选历史开播场次。 |
| 收益提现 | `pages/user/host/income-withdrawal.html` | 收益、可提现余额、冻结金额、提现工单与结算记录。 |

## 九、钱包与账单

| 页面 | 文件 | 内容与功能 |
|---|---|---|
| 余额充值 | `pages/user/wallet/recharge.html` | 余额、活动套餐与常规套餐。 |
| 余额明细 | `pages/user/wallet/balance-detail.html` | 充值、送礼、门票等金币流水。 |
| 充值订单详情 | `pages/user/wallet/order-income-detail.html` | 充值套餐、金币入账和法币支付信息。 |
| 支出订单详情 | `pages/user/wallet/order-expense-detail.html` | 礼物或门票的金币扣款明细。 |

## 十、页面边界

- 直播间内的礼物、贡献榜、在线观众、用户卡、房型校验和互动处置均为同页弹层或状态，不单列页面。
- 门票房观众侧入口、密码校验和普通房状态由直播间页面承接；当前独立页面仅覆盖主播密码房。
- 关注、好友和粉丝团是不同关系；关系与权限规则见《01-互动场景权限规则》。
- 业务规则见《01-用户主播App-项目需求清单》《01-用户主播App-角色与用例》；本文件只维护页面归属和入口。
