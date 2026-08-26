# Luma Live 原型

## 视觉规则

默认使用黑白灰；仅特殊标记、重要按钮和重要状态可使用颜色。
用户 APP、公会 APP 支持英语、马来西亚语、印尼语；管理后台支持中文、英语、印尼语，一期仅交付中文界面，文案和可配置名称预留翻译能力。品牌、人名、平台、标识符和资源名可保留原文。
用户 APP 与公会 APP 的带日期时间字段统一为 `dd/mm/yyyy HH.mm`；纯日期不附加时间。
查看器中“用户 APP > 直播”页面下的页面状态、角色视角和弹层校对均为同一 HTML 的校对视图，不新增页面文件。

## 用户/主播端 页面清单

| 页面 | 文件 | 要点 |
| --- | --- | --- |
| 登录与注册 | `pages/user/auth/auth-login-register.html` | Google、手机号及其他第三方登录入口。 |
| 资料补全 | `pages/user/auth/auth-profile-completion.html` | A003，新用户授权成功后直接进入；展示系统默认头像和昵称，可更换预置头像、修改昵称，或跳过后进入首页。 |
| 手机号登录 | `pages/user/auth/auth-phone-login.html` | 手机号加短信验证码或密码登录，可切换。 |
| 首页 | `pages/user/home/live-plaza.html` | 热门/新人状态；关注直播头像、榜单、Banner、分类与直播流。 |
| 主播榜 | `pages/user/home/host-ranking.html` | P001-3，按当日、本周、本月展示主播收礼排名；点击主播进入主播主页。 |
| 贡献榜（平台） | `pages/user/home/contribution-ranking.html` | P001-4，按当日、本周、本月展示用户贡献排名；点击用户进入用户主页。 |
| 搜索 | `pages/user/home/search.html` | P001-2，输入房间号、主播 ID 或主播昵称后触发检索。 |
| 搜索结果 | `pages/user/home/search-results.html` | P001-1，展示主播头像、昵称与房间号；直播中可进入直播间，无结果展示空状态。 |
| 直播间（普通房） | `pages/user/live/live-room.html` | P006，默认普通观众；含密码房、门票房访问受限视图；可切换房管或被禁言，房管可从公屏或在线观众资料卡禁言、踢出用户并二次确认。 |
| 举报直播间 | `pages/user/live/live-room-report.html` | P006-1，举报类型为色情低俗、涉及宗教政治、暴恐血腥、未成年有害、其他；选择原因并填写补充说明后提交。 |
| 直播间-主播 | `pages/user/live/live-room-host.html` | P003，主播在普通房开播；管理观众互动与发起 PK。 |
| 直播间-主播-密码房 | `pages/user/live/live-room-host-password.html` | P004，主播在密码房开播；房间成员须通过密码校验，主播可修改房间密码；不支持发起连麦或 PK。 |
| 直播间-连麦-主播 | `pages/user/live/live-room-cohost-active.html` | P005，仅普通房支持两位主播左右分屏；门票房、密码房及超过两人的连线或 PK 均不支持。 |
| 充值福利 | `pages/user/home/welfare-center.html` | 签到、任务、邀请与充值福利入口。 |
| 邀请好友 | `pages/user/home/invite-friends.html` | P009，邀请奖励、邀请记录和活动说明；含“视图-邀请好友-选项”。 |
| 消息 | `pages/user/social/message-center.html` | 消息/粉丝团状态；通知与会话入口。 |
| 好友列表 | `pages/user/social/friend-list.html` | P043，搜索好友，查看头像、昵称、等级与勋章；点击头像进入用户或主播主页。 |
| 互动通知 | `pages/user/social/interaction-notifications.html` | 关注和好友申请通知；头像进入用户主页或主播主页，好友申请可同意或拒绝。 |
| 系统通知 | `pages/user/social/system-notifications.html` | 公会申请、主播身份和直播权限通知。 |
| 1 对 1 私信 | `pages/user/social/direct-message.html` | P011，好友间常规会话，支持文本、语音和图片发送。 |
| 粉丝团群聊 | `pages/user/social/fan-group-chat.html` | P011-1，粉丝团成员群聊，含群公告、直播房间卡片、成员入口，支持文本、语音和图片发送。 |
| 群管理（成员） | `pages/user/social/group-manage-member.html` | 群公告、消息免打扰与举报。 |
| 群管理（群主） | `pages/user/social/group-manage-owner.html` | 成员页全部能力，含公告编辑与群成员入口。 |
| 聊天设置 | `pages/user/social/chat-settings.html` | 私信用户信息、拉黑与举报。 |
| 用户主页 | `pages/user/social/user-home.html` | P038，头像左置展示昵称、ID、财富等级和签名；粉丝、关注、送出统一展示；黑名单时隐藏底部操作并显示状态文案；粉丝团头像进入对应主播主页。 |
| 主播主页 | `pages/user/social/host-home.html` | P035-1，头像左置展示昵称、ID、性别年龄和主播/财富等级；粉丝、关注、观众、送出统一展示；黑名单时隐藏底部操作并显示状态文案；已加入粉丝团进入 P011-5，未加入弹出入团弹层；直播中时背景图右侧可进入直播间，标题栏右侧提供更多操作。 |
| 主播礼物展馆 | `pages/user/social/host-gift-gallery.html` | P035-2，每行展示 3 个礼物；已收到显示数量，未收到置灰。 |
| 我的 | `pages/user/profile/profile.html` | 个人资料、钱包、粉丝团和主播中心入口。 |
| 我的关注 | `pages/user/profile/my-following.html` | P034-1，已关注主播的简介与开播状态；开播进入直播间，未开播进入主播主页。 |
| 我的装扮 | `pages/user/profile/my-decoration.html` | 展示当前佩戴的头像框、聊天气泡和勋章，并进入对应栏目。 |
| 头像框 | `pages/user/profile/my-decoration-avatar-frame.html` | 查看全部头像框并选择是否佩戴，最多 1 个。 |
| 聊天气泡 | `pages/user/profile/my-decoration-chat-bubble.html` | 查看全部聊天气泡并选择是否佩戴，最多 1 个。 |
| 勋章 | `pages/user/profile/my-decoration-medal.html` | 查看全部勋章并选择是否佩戴，最多 5 个。 |
| 资料编辑 | `pages/user/profile/profile-edit.html` | 编辑头像、背景图、昵称、签名、性别、地区和生日；头像或昵称提交后进入风控检测，通过自动生效，不通过时维持原资料。 |
| 设置 | `pages/user/profile/settings.html` | 账号安全、通知、语言、退出登录和账号注销。 |
| 黑名单管理 | `pages/user/profile/blacklist-management.html` | 查看已拉黑用户，二次确认后移除。 |
| 公会中心 | `pages/user/guild/guild-management.html` | 浏览平台后台配置的 5 个公会；可按名称或 ID 搜索并提交入会申请，顶栏“我的”进入我的公会。 |
| 申请加入公会 | `pages/user/guild/guild-application-form.html` | 填写姓名、电话及认证材料后提交；返回公会详情时间轴并显示加入审核中。 |
| 我的公会 | `pages/user/guild/guild-application-records.html` | 展示当前账号申请过的公会列表，点击公会进入详情页。 |
| 公会详情 | `pages/user/guild/guild-detail.html` | P032-3，加入申请单与退出公会申请单按提交时间倒序展示在同一时间轴；加入审核中与退出申请中均展示为待处理状态。 |
| 申请退出公会 | `pages/user/guild/guild-leave-application.html` | P032-1，展示已加入公会；填写原因必填，提交后返回公会详情时间轴。 |
| 我的粉丝团 | `pages/user/fan-club/my-fan-clubs.html` | 用户查看已加入的主播粉丝团、群聊和贡献榜入口。 |
| 贡献榜 | `pages/user/fan-club/fan-contribution-ranking.html` | 我的粉丝团的二级页，按本周、本月、累计查看指定主播粉丝团的贡献榜及我的排名。 |
| 主播中心 | `pages/user/host/host-center.html` | P027，昵称旁展示主播等级标签；包含累计收益、粉丝、今日/本月直播数据、当日有效天进度与主播工具；公会管理进入 P032，公会通知进入 P027-2 并显示未读数。 |
| 房管管理 | `pages/user/host/moderator-management.html` | P027-1，查看房管列表，添加或取消房管。 |
| 公会通知 | `pages/user/host/host-guild-notifications.html` | P027-2，展示纯文字、图片加文字两种公会通知；长内容在当前列表卡片展开或收起，无通知详情页。 |
| 申请成为主播 | `pages/user/host/host-center-pending.html` | 固定展示加入公会、申请直播权限和开始直播三步，按账号状态变化右侧状态与操作。 |
| 开播设置 | `pages/user/host/start-live-settings.html` | 全屏摄像头预览，支持切换前后摄像头；标题与封面预览、分类和房型设置、美颜/美型调节、开播倒计时。 |
| 粉丝列表 | `pages/user/host/fan-list.html` | P014-2，展示粉丝头像、昵称、财富等级和已佩戴装扮图标；点击进入用户主页。 |
| 粉丝团 | `pages/user/host/fan-club.html` | P026，主播查看粉丝团成员、加入规则，支持累计贡献、本月贡献和加入时间排序；左滑成员可移除。 |
| 粉丝团设置 | `pages/user/host/fan-club-settings.html` | P026-1，主播配置粉丝团名字、是否关注及累计贡献加入条件。 |
| 直播数据 | `pages/user/host/live-data.html` | 日数据近 7 天趋势与可按日期筛选的每日明细；月数据指标依次为累计收益、有效天数、开播时长、观众人次、新增粉丝、送礼人数，并展示趋势与每月明细。 |
| 直播记录 | `pages/user/host/live-records.html` | 主播历史开播场次，默认近 7 天；支持本月、本周、上月快捷筛选及自定义单日或连续日期范围。筛选下方汇总收益、总时长和直播场次，按开播时间倒序展示直播封面、直播间标题、数据与房间类型。 |
| 分成记录 | `pages/user/host/income-withdrawal.html` | 金额以美元展示，按印尼数字格式使用“.”分隔千位、“,”分隔小数。 |
| 我的银行卡 | `pages/user/host/my-bank-cards.html` | P037-1，默认空白；顶部虚线按钮进入添加银行卡页；已绑定态展示两张银行卡，账号每 4 位一组，银行名以标签展示，支持移除。 |
| 添加银行卡 | `pages/user/host/add-bank-card.html` | P037-2，填写银行和账号，自动回显收款人姓名；确认后返回我的银行卡。 |
| 提现填写 | `pages/user/host/withdrawal-application.html` | P037-3，填写提现金额并选择到账银行卡。 |
| 余额充值 | `pages/user/wallet/recharge.html` | 余额、活动套餐与常规套餐。 |
| 余额明细 | `pages/user/wallet/balance-detail.html` | 充值、礼物打赏与门票购买流水。 |
| 充值订单详情 | `pages/user/wallet/order-income-detail.html` | 套餐购买、金币入账与法币支付信息。 |
| 支出订单详情 | `pages/user/wallet/order-expense-detail.html` | 礼物/门票商品扣款与消费直播间。 |

## 共享实体

用户 Andi（ID `88231007`）；主播 Sari、Dewi、Maya、Ayu、Intan、Lala。金币仅作虚构演示。

## 公会端页面清单

| 页面 | 文件 | 要点 |
| --- | --- | --- |
| 首页 | `pages/guild/home/guild-home.html` | 公会概览及全部功能入口；无底部导航。 |
| 入会审核 | `pages/guild/approval/guild-join-review.html` | 公会审核、平台终审状态及申请详情。 |
| 退会审核 | `pages/guild/approval/guild-leave-review.html` | 退会校验、申请详情及通过、驳回。 |
| 主播列表 | `pages/guild/people/guild-member-list.html` | 主播搜索、在会与已退会筛选及详情。 |
| 主播业绩 | `pages/guild/people/guild-host-list.html` | 日期范围、在职/离职查询及详情。 |
| 新建运营消息 | `pages/guild/operations/guild-message-compose.html` | 向全体成员或一位指定主播发送消息。 |
| 选择主播 | `pages/guild/operations/guild-host-select.html` | 搜索并单选一位主播，完成后返回新建页。 |
| 添加运营账号 | `pages/guild/operations/guild-operation-account-compose.html` | 选择成员及直播间后添加运营账号。 |
| 每日经营详情 | `pages/guild/data/guild-income-day-detail.html` | 展示当日公会收益、主播开播概况并进入主播数据。 |
| 违规记录 | `pages/guild/data/guild-all-violations.html` | 按主播查看直播间违规记录。 |
| 全部直播记录 | `pages/guild/data/guild-all-live.html` | 按日期范围和主播筛选全部直播汇总记录。 |
| 选择主播（多选） | `pages/guild/data/guild-violation-host-select.html` | 为违规记录、直播记录和主播分成记录选择筛选主播。 |
| 提现审核 | `pages/guild/approval/guild-withdrawal-review.html` | 查看提现申请并审核待处理记录。 |
| 修改密码 | `pages/guild/management/guild-password.html` | 校验并修改公会账号密码。 |

## 状态

查看器顶部可切换首页的热门/新人、消息的消息/粉丝团、福利的视图和我的的已认证主播/普通用户；福利视图为同一 HTML 的校对状态，树中直接显示为“视图-充值福利-已领取”。

## 管理后台页面清单

| 页面 | 文件 | 要点 |
| --- | --- | --- |
| 工作台 | `pages/admin/dashboard/admin-dashboard.html` | 展示今日实时数据、近 7 日指标趋势、退款和快捷操作。 |
| 用户列表 | `pages/admin/user/admin-user-list.html` | 用户筛选、列表和账号处置。 |
| 用户详情 | `pages/admin/user/admin-user-detail.html` | 基础信息、充值、消费、设备、关注、粉丝和违规记录。 |
| 封禁申诉 | `pages/admin/user/admin-ban-appeal.html` | 申诉筛选和申诉处置。 |
| 申诉详情 | `pages/admin/user/admin-ban-appeal-detail.html` | 展示基础信息和申诉内容，支持处理申诉。 |
| 主播列表 | `pages/admin/host/admin-host-list.html` | 主播查询、直播权限、平台锁定、警告和封禁。 |
| 主播详情 | `pages/admin/host/admin-host-detail.html` | 基础信息、收益摘要、认证、权限、直播、粉丝团和违规记录。 |
| 认证主播 | `pages/admin/host/admin-host-review.html` | 认证筛选、通过与驳回。 |
| 认证详情 | `pages/admin/host/admin-host-review-detail.html` | 基础信息、认证资料和审核记录。 |
| 直播场次 | `pages/admin/host/admin-live-management.html` | 统一展示直播中与已结束场次，支持筛选、巡房和直播处置。 |
| 直播详情 | `pages/admin/host/admin-live-detail.html` | 基础信息、直播画面、巡房和处置记录。 |
| 内容审核 | `pages/admin/content/admin-content-audit.html` | 机审告警筛选、复审和处置。 |
| 内容审核详情 | `pages/admin/content/admin-content-audit-detail.html` | 告警材料和复审处置记录。 |
| 举报处理 | `pages/admin/content/admin-report-handling.html` | 账号违规、直播间违规共用用户端 P006 的五类举报类型，支持筛选和处置。 |
| 举报详情 | `pages/admin/content/admin-report-detail.html` | 举报内容、证据和处理记录。 |
| 公会列表 | `pages/admin/guild/admin-guild-list.html` | 公会筛选、新建编辑、账号与状态管理。 |
| 公会详情 | `pages/admin/guild/admin-guild-detail.html` | 基础信息、合并成员列表和分成记录。 |
| 充值订单 | `pages/admin/orders/admin-recharge-order.html` | 充值订单筛选、查询和导出。 |
| 消费订单 | `pages/admin/orders/admin-consumption-order.html` | 礼物、门票等消费订单筛选；列表首列展示消费时间，消费主播展示昵称和 ID。 |
| 消费订单详情 | `pages/admin/orders/admin-consumption-order-detail.html` | 商品、消费对象、手动退款确认、金币退回结果和退款记录。 |
| 退款订单 | `pages/admin/orders/admin-refund-order.html` | 已完成退款的充值订单筛选、查询和原订单详情入口。 |
| 提现审核 | `pages/admin/finance/admin-withdrawal-review.html` | 提现申请筛选、金额与审核状态。 |
| 提现审核详情 | `pages/admin/finance/admin-withdrawal-review-detail.html` | 申请人、提现金额、收款账户与审核处理。 |
| 主播分成记录 | `pages/admin/finance/admin-settlement-record.html` | 按月上传、查询主播分成批次。 |
| 主播分成记录详情 | `pages/admin/finance/admin-settlement-record-detail.html` | 查看主播分成汇总与主播明细。 |
| 主播账户余额 | `pages/admin/finance/admin-host-account-balance.html` | 展示账号余额、提现中和已提现汇总，查询主播待提现余额并进入余额变更记录。 |
| 主播余额变更记录 | `pages/admin/finance/admin-host-balance-change-record.html` | 查询收益分成、主播提现、分成修正流水；仅分成修正可手动新建。 |
| 公会分成记录 | `pages/admin/finance/admin-guild-settlement-record.html` | 按月上传、查询公会分成批次。 |
| 公会分成记录详情 | `pages/admin/finance/admin-guild-settlement-record-detail.html` | 查看公会分成汇总与公会明细。 |
| 公会账户余额 | `pages/admin/finance/admin-guild-account-balance.html` | 展示账号余额、提现中和已提现汇总，查询公会待提现余额并进入余额变更记录。 |
| 公会余额变更记录 | `pages/admin/finance/admin-guild-balance-change-record.html` | 查询收益分成、公会提现、分成修正流水；仅分成修正可手动新建。 |
| 展位配置 | `pages/admin/operations/admin-placement-config.html` | 展示位筛选、投放状态与配置管理。 |
| 展示位编辑 | `pages/admin/operations/admin-placement-detail.html` | 展示素材、跳转目标与投放规则配置。 |
| 推送管理 | `pages/admin/operations/admin-push-management.html` | 推送记录筛选、发送状态与效果指标。 |
| 推送编辑 | `pages/admin/operations/admin-push-detail.html` | 推送内容、目标用户、跳转与发送时间配置。 |
| 充值套餐 | `pages/admin/operations/admin-recharge-package.html` | 常规、活动套餐的筛选、新建和上下架管理。 |
| 充值套餐编辑 | `pages/admin/operations/admin-recharge-package-detail.html` | 配置封面、价格、金币、限购次数、有效期和排序权重。 |
| 任务配置 | `pages/admin/operations/admin-task-config.html` | 查询自由组合动作、统计维度和周期的任务。 |
| 通用任务编辑 | `pages/admin/operations/admin-task-detail.html` | 配置任务、统计口径、达成条件和金币奖励。 |
| 公会推荐 | `pages/admin/operations/admin-guild-recommendation.html` | 新建推荐公会，按权重排序，支持编辑和删除。 |
| 公会推荐编辑 | `pages/admin/operations/admin-guild-recommendation-detail.html` | 选择推荐公会并配置权重。 |
| 直播房型 | `pages/admin/operations/admin-feature-switch.html` | 查询并管理普通房、门票房和密码房。 |
| 直播房型编辑 | `pages/admin/operations/admin-feature-switch-detail.html` | 配置开放范围和启用状态。 |
| 敏感词库 | `pages/admin/operations/admin-sensitive-words.html` | 查询、导入、新建和管理敏感词。 |
| 敏感词编辑 | `pages/admin/operations/admin-sensitive-words-detail.html` | 配置敏感词、匹配规则和使用场景。 |
| 普通礼物 | `pages/admin/gifts/admin-gift-list.html` | 长期礼物筛选、新增编辑、特效绑定和上下架。 |
| 定制礼物 | `pages/admin/gifts/admin-custom-gift.html` | 活动礼物排期、新增编辑、特效绑定和上下架。 |
| 幸运礼物 | `pages/admin/gifts/admin-lucky-gift-config.html` | 支持筛选、新建，每个幸运礼物独立配置。 |
| 幸运礼物详情 | `pages/admin/gifts/admin-lucky-gift-detail.html` | 展示礼物配置和奖励概率，支持页内新建与编辑。 |
| 礼物详情 | `pages/admin/gifts/admin-gift-detail.html` | 礼物基础信息、多语言名称、特效和操作记录。 |
| 道具配置 | `pages/admin/gifts/admin-prop-list.html` | 6类道具 Tab、道具筛选、新增编辑和上下架。 |
| 道具详情 | `pages/admin/gifts/admin-prop-detail.html` | 道具基础信息、资源、发放规则和操作记录。 |
| 报表中心 | `pages/admin/analytics/admin-report-center.html` | 基础数据和财务对账入口。 |
| 数据概览 | `pages/admin/analytics/admin-data-overview.html` | 日期范围内汇总活跃、充值和主播指标；选择指标卡后按日展示趋势。 |
| 每日统计 | `pages/admin/analytics/admin-daily-statistics.html` | 按日汇总活跃及新增用户、充值、退款和主播有效天数据。 |
| 用户活跃汇总（每日） | `pages/admin/analytics/admin-user-active-statistics.html` | 按日统计登录、新老及付费用户。 |
| 主播活跃汇总（每日） | `pages/admin/analytics/admin-host-statistics.html` | 按日统计主播开播、有效天、连麦及违规。 |
| 直播间互动汇总（每日） | `pages/admin/analytics/admin-live-statistics.html` | 按日统计观看和直播间访问数据。 |
| 直播记录明细报表 | `pages/admin/analytics/admin-host-live-record-report.html` | 财务对账报表，按开播时间和主播 ID 查询直播场次、时长、达标、观众及消费金币。 |
| 充值消费汇总（每日） | `pages/admin/analytics/admin-recharge-statistics.html` | 按日统计充值、金币发放、消费及净增量。 |
| 充值用户分层汇总（每日） | `pages/admin/analytics/admin-user-activity-statistics.html` | 按日统计新老用户充值人数、金额及 ARPU。 |
| 月度收益支出汇总 | `pages/admin/analytics/admin-monthly-income-expense.html` | 按月汇总收益、分成、充值及退款。 |
| 主播业绩分成报表 | `pages/admin/analytics/admin-monthly-host-share.html` | 按日期范围汇总主播有效天、直播场次、收益来源及分成。 |
| 用户消费汇总报表 | `pages/admin/analytics/admin-monthly-viewer-consumption.html` | 按日期范围汇总用户消费来源。 |
| 礼物消费汇总报表 | `pages/admin/analytics/admin-monthly-gift-sales.html` | 按日期范围汇总礼物消费数量及金额。 |
| 消费订单明细 | `pages/admin/analytics/admin-consumption-order-detail-report.html` | 展示观众消费、主播收益及关联场次。 |
| 退款订单明细 | `pages/admin/analytics/admin-refund-order-detail-report.html` | 展示已完成退款订单。 |
| 充值订单明细 | `pages/admin/analytics/admin-recharge-order-detail-report.html` | 展示已支付充值订单及充值套餐名称。 |

管理后台使用桌面画布。详情均打开独立页面，基础信息位于顶部，其他内容通过下方 Tab 展示。
管理后台日期使用日/月/年格式且不补零，例如 `8/12/2026` 表示 2026 年 12 月 8 日；时间使用点号分隔，例如 `14.30`；日期时间格式为 `8/12/2026 14.30`。
管理后台小数输入使用逗号作为分隔符，例如 `10,4`。
缺少明确字段名的值，鼠标移入时显示“字段名：值”。
管理后台展示字段默认不脱敏，仅在需求明确要求时脱敏。
APP 上架审核期的功能灰度仅隐藏端内入口，不改变后台功能和礼物配置，不在单个礼物上设置端内灰度状态。
普通、定制、幸运礼物共用礼物 ID、名称、图标、金币单价、特效资源、排序权重和上下架状态；定制礼物增加生效时效，幸运礼物增加概率配置。
