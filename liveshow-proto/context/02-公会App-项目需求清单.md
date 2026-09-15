# 公会App当前需求清单

本次依据当前系统概要、当前原型入口和结构化批注重新整理；不以旧用例、旧扫描或旧生成结果为业务来源。系统概要优先，原型和批注补充。

## 公共业务规则
- [COMMON-guild-date-format] 公会 App 的日期时间字段统一按 dd/mm/yyyy HH.mm 展示，纯日期不附加时间。格式不决定业务时区，业务日边界仍按 PENDING-business-zone 待确认。〔依据：prototype/Luma Live-原型说明.md / 视觉规则〕
- [COMMON-language] 用户App、公会App 支持中文、English、Bahasa Indonesia、Bahasa Melayu；管理后台一期交付中文。〔依据：context/系统概要 .md / 1.2 端口语言〕
- [COMMON-identity] 同一用户同一时刻只能有一笔处理中入会申请且只能属于一个公会。公会通过后自动进入平台终审，但尚未加入公会或成为主播。任一级驳回使申请作废，重新申请必须走新的公会初审和平台终审。平台通过后才建立公会关系和主播身份。〔依据：context/系统概要 .md / 3.1.2 主播的入会/退会〕
- [COMMON-guild-stop] 平台停用公会后，公会不可被搜索，公会长不能登录，主播关系解除，名下主播失去身份并停止开播，业务历史保留且后台可查看。单独停用公会长账号只影响该账号登录，不影响主播。〔依据：context/系统概要 .md / 3.2 公会账号与权限〕
- [COMMON-permission] 直播权限与主播身份分开。平台关闭时最终禁止开播；平台开启且未锁定时按公会开关；平台开启且锁定时最终允许开播，公会设置只读并跟随平台，原值被保留；解锁恢复原公会设定并重算。最终权限被关闭立即结束正在进行的直播，不能再开播。〔依据：context/系统概要 .md / 3.2.3 开播权限〕
- [COMMON-session] 主播拥有固定直播间 ID，每次开播生成新的场次 ID。场次结束保留封面、标题和统计快照，当前配置修改不改写历史场次。〔依据：context/系统概要 .md / 3.2.1 直播场次〕
- [COMMON-cohost] 仅普通房的两位未连麦主播且无账号拉黑关系可连麦。只能发出一个邀请，可收到多个邀请。接受邀请使自己发出的邀请失效，其他收到的邀请保留；连麦中不能再发起或接受邀请。结束连麦后双方各自直播继续；任一方结束直播使其邀请和连麦失效。〔依据：context/系统概要 .md / 3.2.4、3.3.4 连麦〕
- [COMMON-ticket] 门票只对当前场次有效，同场重复进入不再扣款；被踢出或场次结束后失效且不退款。账号封禁、账号拉黑、本场踢出优先于准入资格；运营账号免票。〔依据：context/系统概要 .md / 3.2.2、3.3.2、3.7.1〕
- [COMMON-consume] 真实金币共用同一账户，不可提现。消费成功只扣款一次并生成消费记录，余额不足或条件检查失败不扣款；负数余额不能继续消费。〔依据：context/系统概要 .md / 3.5.1 金币充值与消费〕
- [COMMON-refund] 只有充值订单支持退款或渠道拒付，用户端没有退款操作。退款扣除原订单全部到账金币，余额不足允许为负数；后续充值先抵扣负余额。退款不撤销已完成的送礼或门票消费，不回滚主播收益和分成。〔依据：context/系统概要 .md / 3.5.5、3.6.1〕
- [COMMON-income] 普通礼物、定制礼物和门票按实际成功消费金币 1:1 形成主播收益；幸运礼物按送出礼物价值乘后台比例，默认 1%，返奖不影响该收益；虚拟、失败或撤销消费不形成收益。〔依据：context/系统概要 .md / 3.6.1 主播收益〕
- [COMMON-finance] 系统不提供线上结算申请或审批，也不计算具体分成金额。财务在线下依据报表核算和结算，系统上传结果并供相关端只读查看；资金示例中的三方比例不构成固定计算规则。〔依据：context/系统概要 .md / 3.6.2、3.6.3〕
- [COMMON-operation] 运营账号由所属公会创建并发放虚拟金币；平台只可启停、锁定公会管理和设置月额度，不创建或发币。真实和虚拟金币完全隔离，虚拟金币仅可赠送普通及定制礼物，不形成主播收益或分成。〔依据：context/系统概要 .md / 3.7 运营账号〕
- [COMMON-operation-whitelist] 运营账号首页功能可用；福利页可浏览，但点击任意功能提示“运营账号无法操作”。消息可私信和使用好友功能，但不可加入粉丝团。我的允许编辑资料、未受限设置、关注、粉丝、好友、黑名单和客服；充值、我的装扮、粉丝团、邀请奖励、开播、主播中心、公会中心及绑定手机/邮箱、注销登录均提示“运营账号无法操作”。〔依据：context/系统概要 .md / 3.7.4 运营账号功能白名单〕
- [COMMON-report-end] 仅正在直播的场次提供举报入口。直播场次结束后，待处理举报工单自动作废，不能处罚下一场直播；账号举报与场次举报分别处理。〔依据：context/系统概要 .md / 3.4 举报与处置机制〕
- [COMMON-mute] 直播禁言仅限制当前场次公屏，下场恢复；群禁言仅限制对应粉丝群发言。每名主播最多 3 名房管，授权跨场次持续，房管可禁言、踢出和屏蔽单条评论。〔依据：context/系统概要 .md / 3.3.2、3.3.3〕
- [COMMON-fan-exit] 用户被移出或主动退出粉丝群后，失去团籍和群权限并卸下身份标识，粉丝等级和亲密度清零，重新加入从零累计；关注关系不因退团自动解除。〔依据：context/系统概要 .md / 3.3.3 粉丝群〕
- [COMMON-virtual-board] 虚拟金币可以计入氛围和榜单展示，但具体榜单范围存在下级批注冲突，必须按 PENDING-virtual-board 确认；真实金币榜单的排序和计算规则独立有效。〔依据：context/系统概要 .md / 3.7.3 虚拟金币隔离〕

## 账号与登录 / 公会登录
页面：guild-login.html；实际承载：liveshow-proto/prototype/pages/guild/auth/guild-login.html；实体页面。
- [REQ-c9e487982ba2] 公会账号：必填；使用平台创建的公会长账号。〔来源：AN-da8beea89096；liveshow-proto/prototype/annotations/guild.js；guild-login.html/字段/3〕
- [REQ-7aeca6163dd9] 密码：必填；错误时统一提示账号或密码错误。〔来源：AN-d000b624bd46；liveshow-proto/prototype/annotations/guild.js；guild-login.html/字段/4〕
- [REQ-0db0877f0fe5] 一期仅公会长可登录公会端；运营账号不能登录公会端。〔来源：AN-d10c1cc8ad7e；liveshow-proto/prototype/annotations/guild.js；guild-login.html/业务规则/1〕
- [REQ-0fc472689017] 公会长账号被停用后不可登录，不影响公会内主播账号。〔来源：AN-7d1d7a96e2f2；liveshow-proto/prototype/annotations/guild.js；guild-login.html/业务规则/2〕
- [REQ-edeab24ec66a] 登录校验通过 -> 进入「选择公会」；账号或密码错误 -> 停留当前页并提示“账号或密码错误”。〔来源：AN-b758f548a65a；liveshow-proto/prototype/annotations/guild.js；guild-login.html/交互规则/1〕

## 账号与登录 / 选择公会
页面：guild-switch.html；实际承载：liveshow-proto/prototype/pages/guild/auth/guild-switch.html；实体页面。
- [REQ-f087480a5ec3] 名称 / 用户 ID：当前登录公会长的名称和账号唯一标识。〔来源：AN-10b0b39c1a57；liveshow-proto/prototype/annotations/guild.js；guild-switch.html/公会长字段/3〕
- [REQ-91381ce452c7] 身份：当前登录角色为公会长。〔来源：AN-f9c7ac8fddb7；liveshow-proto/prototype/annotations/guild.js；guild-switch.html/公会长字段/4〕
- [REQ-1465c7186b08] 公会 Logo / 名称 / ID：可管理公会的标识、名称及唯一 ID。〔来源：AN-177a8f8d065f；liveshow-proto/prototype/annotations/guild.js；guild-switch.html/公会列表字段/3〕
- [REQ-c68c08b0d254] 当前公会：当前选中的公会显示「当前公会」，其他公会显示选择入口；不是启用状态。〔来源：AN-80e27636a83a；liveshow-proto/prototype/annotations/guild.js；guild-switch.html/公会列表字段/4〕
- [REQ-623425048656] 仅展示当前账号可管理且未解散的公会；已解散公会不可选择。〔来源：AN-265615ca6c6b；liveshow-proto/prototype/annotations/guild.js；guild-switch.html/业务规则/1〕
- [REQ-2b1c7a5786cf] 选择公会 -> 更新当前公会，返回首页并重新加载该公会数据。〔来源：AN-599b208fdc22；liveshow-proto/prototype/annotations/guild.js；guild-switch.html/交互规则/1〕

## 首页与发现 / 首页
页面：guild-home.html；实际承载：liveshow-proto/prototype/pages/guild/home/guild-home.html；实体页面。
- [REQ-fe7aaa3b42c1] 公会 Logo / 名称 / ID：当前管理的公会；点击进入选择公会。〔来源：AN-e2b0a832a5dd；liveshow-proto/prototype/annotations/guild.js；guild-home.html/公会信息字段/3〕
- [REQ-a014380ae33b] 通知标记：通知入口上的未读提示；点击进入通知消息。〔来源：AN-6c46284c561f；liveshow-proto/prototype/annotations/guild.js；guild-home.html/公会信息字段/4〕
- [REQ-b3b81cfd00e4] 账号设置：进入当前公会长的账号设置。〔来源：AN-7bff7da771e6；liveshow-proto/prototype/annotations/guild.js；guild-home.html/公会信息字段/5〕
- [REQ-433881f19711] 当日收益：当前公会当日主播收益金币汇总，不是公会分成金额。〔来源：AN-65c9c758975c；liveshow-proto/prototype/annotations/guild.js；guild-home.html/今日概况字段/3〕
- [REQ-7ac74b3449f8] 直播中：当前时刻正在直播的去重主播数，单位为人。〔来源：AN-78a76e04848a；liveshow-proto/prototype/annotations/guild.js；guild-home.html/今日概况字段/4〕
- [REQ-66355bf4de83] 达成有效天：当日累计有效直播满 3 小时的主播数，单位为人。〔来源：AN-d43277481e7d；liveshow-proto/prototype/annotations/guild.js；guild-home.html/今日概况字段/5〕
- [REQ-bff46daf0b22] 普通礼物、定制礼物按成功实际消费金币计入；幸运礼物按礼物总价值 × 后台配置比例计入，默认 1%，返奖不影响主播收益。〔来源：AN-1f2c72223035；liveshow-proto/prototype/annotations/guild.js；guild-home.html/计算规则/1〕
- [REQ-1e95cd4b3385] 运营账号虚拟金币送礼、失败或已冲正消费不计入主播收益。〔来源：AN-990f4f03c111；liveshow-proto/prototype/annotations/guild.js；guild-home.html/计算规则/2〕
- [REQ-e54100a8dca9] 点击今日概况 -> 进入当日经营详情；功能入口进入对应列表。〔来源：AN-f3c6c8037932；liveshow-proto/prototype/annotations/guild.js；guild-home.html/交互规则/1〕

## 首页与发现 / 通知消息
页面：guild-notifications.html；实际承载：liveshow-proto/prototype/pages/guild/home/guild-notifications.html；实体页面。
- [REQ-8c6a1c183e1a] 标题：业务事件及结果。〔来源：AN-9f2f58ef9d71；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知列表字段/3〕
- [REQ-e2cda6c8e9f0] 摘要：对象、处理结果或待处理数量。〔来源：AN-5822bed10d12；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知列表字段/4〕
- [REQ-15916749586e] 时间：通知生成时间；按生成时间倒序排列。〔来源：AN-2c704f770a47；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知列表字段/5〕
- [REQ-b725b023c4f3] 未读标记：未读通知显示圆点，已读不显示。〔来源：AN-214f9a90b181；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知列表字段/6〕
- [REQ-fe77df8ea353] 入会申请待初审、平台终审结果；退会申请待审核。〔来源：AN-1babd4b4323a；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知类型/1〕
- [REQ-c6bead40e22f] 平台关闭直播场次、关闭或恢复直播权限。〔来源：AN-baa9f72a5b20；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知类型/2〕
- [REQ-dab2ae0821f7] 公会状态、公会长账号状态或运营账号管理权限变更。〔来源：AN-e1109521247a；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知类型/3〕
- [REQ-5b002603fe95] 主播分成、公会分成结果新增或冲正。〔来源：AN-d7696facac0a；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/通知类型/4〕
- [REQ-c75a323ec1ec] 点击通知 -> 进入通知详情；有关联业务时由详情进入对应记录。〔来源：AN-edf9228444c5；liveshow-proto/prototype/annotations/guild.js；guild-notifications.html/交互规则/1〕

## 首页与发现 / 通知详情
页面：guild-notification-detail.html；实际承载：liveshow-proto/prototype/pages/guild/home/guild-notification-detail.html；实体页面。
- [REQ-f1b1d7a499b3] 标题：对应通知的标题。〔来源：AN-6d877f8704d4；liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html/通知内容字段/3〕
- [REQ-b3a0c4bc92a4] 发送时间：通知生成时间。〔来源：AN-5df1c21ba366；liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html/通知内容字段/4〕
- [REQ-f3d0239d304c] 正文：业务对象、状态变化及处理信息。〔来源：AN-ff5ebf3ae479；liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html/通知内容字段/5〕
- [REQ-01bb2597a448] 业务入口：有关联记录且有权限时显示，进入对应业务记录。〔来源：AN-a4b45fcc44e5；liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html/通知内容字段/6〕
- [REQ-b8ea404c5252] 进入详情 -> 标记为已读；点击业务入口 -> 进入对应记录。〔来源：AN-34aba079f059；liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html/交互规则/1〕

## 审批管理 / 入会申请
页面：guild-join-review.html；实际承载：liveshow-proto/prototype/pages/guild/approval/guild-join-review.html；实体页面。
- [REQ-15f627e7928f] 状态 Tab / 数量：默认审核中；展示审核中、已通过、已驳回及各状态申请数量。〔来源：AN-dd94ac8a259e；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/筛选字段/3〕
- [REQ-457953c7b57a] 申请人头像 / 名称 / ID：提交入会申请的用户资料及用户 ID。〔来源：AN-c85775a1d9f8；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/申请列表字段/3〕
- [REQ-83968f78cc30] 申请时间：本次申请提交时间。〔来源：AN-e7bdfe291bef；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/申请列表字段/4〕
- [REQ-bbd9cc4ccd76] 状态：审核中包含待公会审核和平台审核中；驳回区分公会驳回、平台驳回。〔来源：AN-9ea2ac1c85f2；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/申请列表字段/5〕
- [REQ-a5054ddf8e35] 同一用户同时只能有一笔待处理入会申请，且只能加入一个公会。〔来源：AN-6f664472c8fd；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/业务规则/1〕
- [REQ-aad9d80d34b7] 公会驳回后关闭本次申请，用户重新申请时生成新申请单。〔来源：AN-a90854caffa4；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/业务规则/2〕
- [REQ-a259a5249a2e] 公会审核通过后自动进入平台审核，无需用户再次提交；平台驳回后本次申请作废，重新申请必须重新经过公会初审。〔来源：AN-41fe17955ff4；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/业务规则/3〕
- [REQ-6e63424342d0] 状态 Tab -> 筛选对应状态；点击申请卡片 -> 进入申请详情。〔来源：AN-435caa517765；liveshow-proto/prototype/annotations/guild.js；guild-join-review.html/交互规则/1〕

## 审批管理 / 入会申请详情
页面：guild-join-review-detail.html；实际承载：liveshow-proto/prototype/pages/guild/approval/guild-join-review-detail.html；实体页面。
- [REQ-c6402e3288ac] 头像 / 昵称 / 用户 ID：本次申请人的账号资料。〔来源：AN-ecce2f849890；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/申请人字段/3〕
- [REQ-47dad45c332e] 申请公会：本次申请目标公会名称。〔来源：AN-39b4a59d9407；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/申请人字段/4〕
- [REQ-8fbd435e36e5] 姓名：申请人提交的姓名，区别于账号昵称。〔来源：AN-90c8d6d4e07a；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/申请人字段/5〕
- [REQ-ba73c62f2098] 电话：申请人提交的联系电话。〔来源：AN-619b0b850c14；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/申请人字段/6〕
- [REQ-ead1380c96ec] 本人照片：申请提交的本人照片，可点开大图。〔来源：AN-c72ff1fae5bc；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/认证材料字段/3〕
- [REQ-f6891ba15597] 证件正面 / 反面：申请提交的证件图片，可分别查看。〔来源：AN-0ed7ce78c0ac；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/认证材料字段/4〕
- [REQ-e6229e5b4311] 节点 / 状态：用户提交、公会审核、平台审核、成为主播，显示当前处理阶段。〔来源：AN-91690de5acfa；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/审核进度字段/3〕
- [REQ-a0fd66fbb2fb] 节点时间：对应提交或审核完成时间；未发生不显示。〔来源：AN-e7138f3d2465；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/审核进度字段/4〕
- [REQ-cf1b70d3c79f] 驳回理由：驳回时选填，最多 200 字符；显示在对应审核节点，未填显示「未填写」。〔来源：AN-387ce046f154；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/审核进度字段/5〕
- [REQ-e2ac5e93afea] 查看主页：成为主播后进入该主播详情。〔来源：AN-3726a3048546；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/审核进度字段/6〕
- [REQ-889380bda48a] 公会审核通过后，自动进入平台审核节点，无需用户再次提交。〔来源：AN-54d2d0f50f51；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/业务规则/1〕
- [REQ-dee8a804952b] 平台驳回后本次申请作废；用户重新申请时生成新申请，重新经过公会初审和平台终审。〔来源：AN-42549dbbfb76；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/业务规则/2〕
- [REQ-01ce3495ca45] 已处理的公会审核结果只读，不可重复审核。〔来源：AN-5240353bed25；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/业务规则/3〕
- [REQ-da806b26301b] 通过 -> 二次确认 -> 提交平台终审；驳回 -> 填写可选理由 -> 结束申请。〔来源：AN-92947d7b5eeb；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/交互规则/1〕
- [REQ-20fd4dfde21d] 点击认证材料 -> 查看大图；成为主播后可进入主播详情。〔来源：AN-01f05a5cccb1；liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html/交互规则/2〕

## 审批管理 / 退会申请
页面：guild-leave-review.html；实际承载：liveshow-proto/prototype/pages/guild/approval/guild-leave-review.html；实体页面。
- [REQ-34ccb328cc03] 状态 Tab / 数量：默认审核中；展示审核中、已通过、已驳回及各状态申请数量。〔来源：AN-086c540f7259；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/筛选字段/3〕
- [REQ-acb4de4aef54] 申请人头像 / 名称 / ID：提交退会申请的主播资料及主播 ID。〔来源：AN-d75fbf6efc78；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/申请列表字段/3〕
- [REQ-283dcbce445a] 申请时间：本次申请提交时间。〔来源：AN-45a57fedd2d1；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/申请列表字段/4〕
- [REQ-38a749afe7fb] 状态：审核中为待公会处理，已通过或已驳回为处理结果。〔来源：AN-2dceca4675cb；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/申请列表字段/5〕
- [REQ-4f04fbe0f282] 退会申请仅由公会审核，不进入平台终审。〔来源：AN-d5ef3b88f7f7；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/业务规则/1〕
- [REQ-dc1ca0561434] 通过后立即结束当前直播、解除公会关系并失去主播身份；驳回后保留主播身份。〔来源：AN-080f704b84e5；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/业务规则/2〕
- [REQ-e9eaaac2af1c] 状态 Tab -> 筛选对应状态；点击申请卡片 -> 进入申请详情。〔来源：AN-39289b261589；liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html/交互规则/1〕

## 审批管理 / 退会申请详情
页面：guild-leave-review-detail.html；实际承载：liveshow-proto/prototype/pages/guild/approval/guild-leave-review-detail.html；实体页面。
- [REQ-c4f27cd5a1e2] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-216dbff70038；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/主播信息字段/3〕
- [REQ-f42e4484494b] 主播 ID：主播账号唯一标识。〔来源：AN-0929c77aa19a；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/主播信息字段/4〕
- [REQ-5c090b220506] 加入时间：当前公会关系生效日期。〔来源：AN-7817aa36ceb4；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/申请与处理字段/3〕
- [REQ-9fb4a71d06b5] 申请时间：本次退会申请提交时间。〔来源：AN-90d910e91113；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/申请与处理字段/4〕
- [REQ-c27f4dc80b59] 申请状态：待审核、已通过或已驳回。〔来源：AN-f78a25564252；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/申请与处理字段/5〕
- [REQ-e04cd7aa2abc] 退会原因：主播提交的退会原因。〔来源：AN-fb7133d405b1；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/申请与处理字段/6〕
- [REQ-0bb5af2f5376] 处理时间 / 结果：已处理后显示本次审核时间和结果。〔来源：AN-c3579d8ff7d5；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/申请与处理字段/7〕
- [REQ-6cafd7643204] 驳回理由：选填，最多 200 字符；已驳回时显示，未填显示「未填写」。〔来源：AN-0a9ac4973fc9；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/申请与处理字段/8〕
- [REQ-44d45e0c5d62] 通过 -> 立即结束当前直播、解除公会关系并失去主播身份。〔来源：AN-965e42871d60；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/业务规则/1〕
- [REQ-1ba98012803f] 驳回 -> 保留主播身份和公会关系；主播可重新申请。〔来源：AN-47d615a16634；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/业务规则/2〕
- [REQ-7126bee0f50e] 通过需二次确认；驳回理由选填，最多 200 字；已处理记录只读。〔来源：AN-6d653299072f；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/交互规则/1〕
- [REQ-305ac142e6f4] 通过退会申请前必须二次确认；〔来源：AN-1efa5ce84ce1；liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html/原型待补齐/1〕

## 主播管理 / 主播列表
页面：guild-member-list.html；实际承载：liveshow-proto/prototype/pages/guild/people/guild-member-list.html；实体页面。
- [REQ-6a1f0c635a7b] 在会 / 已退会及数量：默认在会；按当前或历史公会关系区分，并显示人数。〔来源：AN-36f559c4a36e；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/筛选字段/3〕
- [REQ-1037a5908f68] 搜索：按主播名称或 ID 模糊匹配，与状态筛选共同生效。〔来源：AN-d6331171c255；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/筛选字段/4〕
- [REQ-bae0f08d57d5] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-1cb287c58bb1；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/主播列表字段/3〕
- [REQ-0caffc93bbfd] 主播 ID：主播账号唯一标识。〔来源：AN-fa81a52eab23；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/主播列表字段/4〕
- [REQ-a228fa3a63d1] 加入时间：本次公会关系生效日期；列表按加入时间倒序。〔来源：AN-6f1bc17131e9；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/主播列表字段/5〕
- [REQ-ac6f0201e1ae] 仅展示当前公会的在会主播和历史退会主播；普通用户不进入主播列表。〔来源：AN-2b6a88927fca；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/业务规则/1〕
- [REQ-3b7b1bf1050e] 状态 Tab 和名称或 ID 搜索共同生效；点击主播 -> 进入主播详情。〔来源：AN-5dca800ed07b；liveshow-proto/prototype/annotations/guild.js；guild-member-list.html/交互规则/1〕

## 主播管理 / 主播业绩
页面：guild-host-list.html；实际承载：liveshow-proto/prototype/pages/guild/people/guild-host-list.html；实体页面。
- [REQ-48e0d62dff35] 日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。〔来源：AN-4bd6bf5f73c3；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/筛选字段/3〕
- [REQ-34c93fe323d0] 快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认今日。〔来源：AN-13947b60e597；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/筛选字段/4〕
- [REQ-8009ee5e1fdb] 搜索：按主播昵称或 ID 查找。〔来源：AN-4932ee09d6af；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/筛选字段/5〕
- [REQ-854e9365081d] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-8534e7ea5216；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/主播列表字段/3〕
- [REQ-dd888a11578e] 主播 ID：主播账号唯一标识。〔来源：AN-6969f756c1fc；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/主播列表字段/4〕
- [REQ-4916bb8dbe1d] 主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。〔来源：AN-7c03204bda9a；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/主播列表字段/5〕
- [REQ-c2705d48361c] 退会标记：历史退会主播显示【退会】，保留归属当前公会期间的业绩。〔来源：AN-42a97b3799d6；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/主播列表字段/6〕
- [REQ-8f3a10c61900] 金币收益：所选周期内该主播计入收益的金币数，非分成金额。〔来源：AN-fa107b89e23b；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/主播列表字段/7〕
- [REQ-3649c97c9a4e] 支持今日、昨日、本周、上周、本月、上月、自定义；默认今日。〔来源：AN-4890e9d677db；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/日期筛选/1〕
- [REQ-5e4ba2d8de06] 主播收益、开播人数、达标人数均随选中日期变化，统计所选周期内的数据。〔来源：AN-8055f9c5ffce；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/数据中心字段/1〕
- [REQ-045697d76e54] 主播收益：所选日期范围内所有主播直播间计入收益的礼物金币总和。〔来源：AN-baddd78bdd86；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/数据中心字段/4〕
- [REQ-b0b8fa948dee] 开播人数：所选日期范围内至少完成 1 场直播的去重主播数。〔来源：AN-c5be90e52e4f；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/数据中心字段/5〕
- [REQ-18e7374634ae] 达标人数：所选周期内达到有效天标准的去重主播人数。〔来源：AN-ee72c0f9a66f；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/数据中心字段/6〕
- [REQ-0516063a534b] 有效天按主播自然日累计直播时长达到 3 小时计 1 天。〔来源：AN-ec4ac849344b；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/业务规则/1〕
- [REQ-d6fc92786e6e] 已退会主播保留历史业绩并显示【退会】；统计以直播发生时的公会关系为准。〔来源：AN-8c340aff3a3c；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/业务规则/2〕
- [REQ-8bf87e9cdc14] 日期变化 -> 刷新指标与列表；点击主播行 -> 进入「主播数据」。〔来源：AN-46414c630fb8；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/交互规则/1〕
- [REQ-ed2709282730] 列表收益及汇总人数尚未完整随日期重新计算。〔来源：AN-41e28d446921；liveshow-proto/prototype/annotations/guild.js；guild-host-list.html/原型待补齐/1〕

## 数据与收益 / 主播数据
页面：guild-host-summary.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-host-summary.html；实体页面。
- [REQ-b2509dc0e635] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-cd3862265ee8；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/主播信息字段/3〕
- [REQ-f1350c8e7f5a] 主播 ID：主播账号唯一标识。〔来源：AN-244e4086ce8d；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/主播信息字段/4〕
- [REQ-8ed1344bc371] 主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。〔来源：AN-1a6b9ba53004；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/主播信息字段/5〕
- [REQ-a019a7eca4c0] 直播中标记：当前主播正在直播时显示，未开播时隐藏。〔来源：AN-bcaea93b6c22；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/主播信息字段/6〕
- [REQ-90465bc2b492] 退会标记 / 主页：已退会显示【退会】；主页入口进入主播详情。〔来源：AN-0220c992ec40；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/主播信息字段/7〕
- [REQ-1f2877f97492] 日数据 / 月数据：日数据可选本周、上周、本月、上月、自定义，默认本月；月数据当前无月份筛选控件。〔来源：AN-6e1b7c4dcbd6；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/筛选字段/3〕
- [REQ-207c8da2c9e0] 日期 / 月份：日数据一行一个自然日，月数据一行一个自然月。〔来源：AN-9bdb0cba5aae；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/数据列表字段/3〕
- [REQ-b510ba153f21] 直播时长：对应日或月的累计直播时长，按小时和分钟显示。〔来源：AN-7645b65b2e13；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/数据列表字段/4〕
- [REQ-5efb27f48e7f] 有效天标记：日数据时长旁 ✓ 表示当日满 3 小时有效直播，! 表示未达标。〔来源：AN-8d870e338460；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/数据列表字段/5〕
- [REQ-3ea539e255fe] 新增粉丝：对应日或月新增关注人数，不扣除取关，单位为人。〔来源：AN-4d61221b9b38；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/数据列表字段/6〕
- [REQ-77a6dcfb012c] 收益（金币）：对应日或月主播收益金币，不是分成金额。〔来源：AN-00898ef19163；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/数据列表字段/7〕
- [REQ-a400bf162d15] 点击日或月数据行 -> 进入「直播记录」，带入主播和对应日期或月份。〔来源：AN-a744a5db83e5；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/交互规则/1〕
- [REQ-2a2648300690] 点击主页入口 -> 进入主播详情。〔来源：AN-cce876688082；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/交互规则/2〕
- [REQ-470abdcad474] 新增粉丝是新增关注人数，为非负数；取消关注不扣减新增粉丝。〔来源：AN-367024f7e91b；liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html/原型待补齐/1〕

## 主播管理 / 主播主页
页面：guild-host-detail.html；实际承载：liveshow-proto/prototype/pages/guild/people/guild-host-detail.html；实体页面。
- [REQ-8614a441253f] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-103eff9a21dd；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/主播信息字段/3〕
- [REQ-0645b37a4b08] 主播 ID：主播账号唯一标识。〔来源：AN-d8e69de42a2c；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/主播信息字段/4〕
- [REQ-6e33633dfb70] 主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。〔来源：AN-ec89d4cee6ac；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/主播信息字段/5〕
- [REQ-6f77f98b5fc5] 退会标记：已退会显示【退会】，不显示管理入口。〔来源：AN-54139f137f90；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/主播信息字段/6〕
- [REQ-03a9aa5421c2] 姓名 / 电话：主播认证时提交的姓名和联系电话。〔来源：AN-a1942245c722；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/认证信息字段/3〕
- [REQ-317007b56c63] 本人照片 / 证件正反面：认证图片，可分别查看大图。〔来源：AN-e292e7941cc4；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/认证信息字段/4〕
- [REQ-57c9a3ba03a1] 直播权限：当前公会侧直播权限开关；平台锁定或已退会时不可修改。〔来源：AN-566f7aa992e5；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理字段/3〕
- [REQ-5b2794c3a2dd] 权限已锁定：平台限制当前公会操作时显示。〔来源：AN-1763189185fa；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理字段/4〕
- [REQ-c38fd8665271] 移出公会：结束当前直播并解除公会关系，收益归属截止至移出时间。〔来源：AN-580f1cadc80e；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理字段/5〕
- [REQ-01e670797f57] 申请类型 / 状态：加入或退出申请及审核结果。〔来源：AN-aecd8fb70994；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/申请记录字段/3〕
- [REQ-39f4c81152d2] 申请时间：本次申请提交时间，按提交时间倒序展示。〔来源：AN-f592c8a58c35；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/申请记录字段/4〕
- [REQ-d2a5c66939bd] 审核节点 / 时间：公会审核、平台审核及各自处理时间；按申请类型显示。〔来源：AN-67e017ede7bc；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/申请记录字段/5〕
- [REQ-b8c06507c5bf] 申请原因 / 驳回原因：显示本次申请和驳回时填写内容。〔来源：AN-5d240a513090；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/申请记录字段/6〕
- [REQ-08945282e23d] 粉丝数：当前关注该主播的人数，不是周期新增粉丝累计。〔来源：AN-885770c0d127；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/数据中心字段（业绩）/3〕
- [REQ-70ca27a17af9] 总收益：当前主播历史直播间计入收益的礼物金币总和。〔来源：AN-bcde28c0e0fb；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/数据中心字段（业绩）/4〕
- [REQ-71267e7ac9bf] 直播次数：累计完成的直播场次数。〔来源：AN-714bad010cfb；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/数据中心字段（业绩）/5〕
- [REQ-32a21ffeb6ce] 直播时长：全部已完成直播场次时长总和。〔来源：AN-13aac6d3e0a2；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/数据中心字段（业绩）/6〕
- [REQ-8fd5344097e4] 累计违规：直播间违规和账号违规记录总数。〔来源：AN-6f2a4b527eba；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/数据中心字段（业绩）/7〕
- [REQ-44352c936b14] 开播需满足账号可用、公会有效、主播认证通过和最终直播权限开启。平台关闭时最终关闭；平台开启且未锁定时采用公会开关；平台开启且锁定时最终开启，公会开关只读并跟随平台；解锁恢复锁定前公会设定并重新计算。〔来源：AN-048c1429bc77；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理规则/1〕
- [REQ-3a054fa514c9] 平台锁定公会管理权限时，公会直播权限开关只读；解除锁定后恢复锁定前设置。〔来源：AN-df89e39cdc34；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理规则/2〕
- [REQ-5b67d7facca5] 关闭正在直播主播的权限 -> 二次确认后立即结束当前直播，并禁止再次开播。〔来源：AN-260d2fa74ffd；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理规则/3〕
- [REQ-cc2e01100f18] 存在未结清收益时移出公会按钮置灰；确认移出后结束当前直播并解除公会关系。〔来源：AN-7c6e54eb0a41；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/管理规则/4〕
- [REQ-bcccb9b4d7e1] 点击业绩 -> 进入「主播数据」；点击认证材料 -> 查看大图；管理操作均需确认。〔来源：AN-3e0ba42b7c3d；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/交互规则/1〕
- [REQ-e47c32840ee5] 粉丝数取当前关注该主播的用户人数，不使用周期涨粉汇总代替。〔来源：AN-8f6c5ac9d444；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/待确认/1〕
- [REQ-d52ad9ab7260] 存在未结清收益时禁止移出主播；〔来源：AN-16f1d377c809；liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html/原型待补齐/1〕

## 运营管理 / 运营消息
页面：guild-messages.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-messages.html；实体页面。
- [REQ-c875529c79de] 日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。〔来源：AN-0d84f4104bf8；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/筛选字段/3〕
- [REQ-6bb0d557d199] 快捷日期：本周、本月、自定义，默认本月；按发送时间筛选。〔来源：AN-5fb677bc1c3f；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/筛选字段/4〕
- [REQ-77b1cd84565d] 发送对象：全体主播，或指定主播名称和主播 ID。〔来源：AN-71c495d21dbf；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/发送记录字段/3〕
- [REQ-e8126dadbd4a] 发送时间：本次消息实际发送时间。〔来源：AN-992761aaa474；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/发送记录字段/4〕
- [REQ-ac1a81a4ddc2] 消息摘要：发送文字，超出卡片可见长度截断。〔来源：AN-b7d92a859fff；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/发送记录字段/5〕
- [REQ-58ccf650f17f] 记录数量：当前筛选条件下的发送记录条数。〔来源：AN-bc626f37d687；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/发送记录字段/6〕
- [REQ-d9e45606a774] 新建 -> 进入发送页；点击消息记录 -> 进入消息详情。〔来源：AN-e3c36954341e；liveshow-proto/prototype/annotations/guild.js；guild-messages.html/交互规则/1〕

## 运营管理 / 新建运营消息
页面：guild-message-compose.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-message-compose.html；实体页面。
- [REQ-61631c2a73b0] 对象类型：全体主播或指定 1 名当前公会主播。〔来源：AN-009ba2799c1c；liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html/发送对象字段/3〕
- [REQ-6e882aec84a0] 已选主播 / 接收人数：指定时回填所选主播；全体时显示预计接收人数，发送前再次确认。〔来源：AN-c423b1859ae1；liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html/发送对象字段/4〕
- [REQ-dfb0280c6c20] 文字内容 / 字数：必填，最多 500 字符，显示当前字数/500。〔来源：AN-b7d2d7ef2eb4；liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html/消息内容字段/3〕
- [REQ-e5b4036c1c77] 图片：选填，最多 1 张，支持 JPG、PNG、WebP，可预览和移除。〔来源：AN-b9255e97b6b5；liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html/消息内容字段/4〕
- [REQ-b23c987807fa] 发送对象和内容按确认时快照生成记录；发送后不支持编辑或撤回。〔来源：AN-244b4e50059f；liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html/业务规则/1〕
- [REQ-6caa3d6ba0bd] 发送 -> 校验必填项 -> 二次确认接收范围 -> 生成记录并返回列表。〔来源：AN-3a5d5c8d3c43；liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html/交互规则/1〕

## 运营管理 / 选择主播
页面：guild-host-select.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-host-select.html；实体页面。
- [REQ-72f407f193bf] 搜索：按当前公会主播名称或 ID 模糊匹配。〔来源：AN-53454e1da10a；liveshow-proto/prototype/annotations/guild.js；guild-host-select.html/选择字段/3〕
- [REQ-ffef8c8a4d81] 主播数量：当前搜索结果人数。〔来源：AN-a2ee82a59955；liveshow-proto/prototype/annotations/guild.js；guild-host-select.html/选择字段/4〕
- [REQ-22d3084bfdfe] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-c7dad23efacb；liveshow-proto/prototype/annotations/guild.js；guild-host-select.html/选择字段/5〕
- [REQ-276cb5a06416] 主播 ID：主播账号唯一标识。〔来源：AN-679e8c45582f；liveshow-proto/prototype/annotations/guild.js；guild-host-select.html/选择字段/6〕
- [REQ-0d20da6a1fa9] 选中标记：仅可选 1 人，选中行显示勾选；完成后回填消息发送对象。〔来源：AN-8ce433718bff；liveshow-proto/prototype/annotations/guild.js；guild-host-select.html/选择字段/7〕
- [REQ-5d699926b257] 完成 -> 回填新建运营消息；未选择时提示选择主播。〔来源：AN-3fd2a4c694a7；liveshow-proto/prototype/annotations/guild.js；guild-host-select.html/交互规则/1〕

## 运营管理 / 运营消息详情
页面：guild-message-detail.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-message-detail.html；实体页面。
- [REQ-eb1fe01e4d16] 发送对象 / 人数：发送时的接收范围和实际人数。〔来源：AN-848b88fd32c2；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/发送信息字段/3〕
- [REQ-1ff8b13ac737] 接收人名称：指定接收人的名称列表，按发送时快照展示。〔来源：AN-b584521bb033；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/发送信息字段/4〕
- [REQ-3c8314c9f414] 发送时间：本次发送时间。〔来源：AN-bda2d4423a77；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/发送信息字段/5〕
- [REQ-9cd1caddc550] 发送人：执行发送的公会长名称。〔来源：AN-c95180f29768；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/发送信息字段/6〕
- [REQ-d26a7f3cbd0b] 正文：发送时的文字内容。〔来源：AN-89d7005a6d72；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/消息内容字段/3〕
- [REQ-bc6ffc5cf6cd] 图片：发送时附带的图片，无图片时不显示。〔来源：AN-ee66960dc2cd；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/消息内容字段/4〕
- [REQ-84d09063cc5c] 详情只读；接收人后续退会不改变历史记录。〔来源：AN-5f619b1bdf81；liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html/业务规则/1〕

## 运营管理 / 运营账号
页面：guild-operation-accounts.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-operation-accounts.html；实体页面。
- [REQ-9b5a10629a57] 搜索：按运营账号名称或账号 ID 匹配。〔来源：AN-1ed672fb6d5a；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/账号列表字段/3〕
- [REQ-caa3708e5b1d] 名称 / 账号 ID：运营账号名称及唯一标识，不是登录账号。〔来源：AN-5fecd7ed0489；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/账号列表字段/4〕
- [REQ-56bc7f0fa718] 余额：当前可用虚拟金币，单位为金币。〔来源：AN-29992775ad40；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/账号列表字段/5〕
- [REQ-015f48c33080] 本月消费：本自然月成功送礼消耗的虚拟金币。〔来源：AN-c4e5fba7d4c1；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/账号列表字段/6〕
- [REQ-cd0c1de92fde] 创建：进入创建运营账号页。〔来源：AN-15d55c43bcdc；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/账号列表字段/7〕
- [REQ-106a2ab4234a] 本月已发放：当前公会本月向全部运营账号成功发放的虚拟金币总和。〔来源：AN-68e85ddcd84b；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/数据中心字段/3〕
- [REQ-629a171defa4] 本月剩余可发：公会本月累计发放上限减去本月已发放，不小于 0。〔来源：AN-977a01b62ee3；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/数据中心字段/4〕
- [REQ-78fbc0a52b64] 账户余额累计：全部运营账号可用虚拟金币余额之和。〔来源：AN-879f1255afe1；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/数据中心字段/5〕
- [REQ-36c672501212] 本月累计消费：全部运营账号本月成功送礼实际消费虚拟金币总和。〔来源：AN-ddd9acc2a343；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/数据中心字段/6〕
- [REQ-316c2897c078] 运营账号由公会创建，不对应真实用户，也不能加入粉丝团。〔来源：AN-30bf2239077a；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/业务规则/1〕
- [REQ-9e71a2a944d1] 运营账号没有真实金币，只有虚拟金币；虚拟金币只能由所属公会发放，不能通过充值或任务获得。〔来源：AN-d704cf7ac40d；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/业务规则/2〕
- [REQ-e616dc5590e2] 虚拟金币仅可赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；可计入直播间氛围和榜单展示，不形成主播收益或分成。〔来源：AN-bbb10e3b591b；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/业务规则/3〕
- [REQ-44ae0e3ef059] 搜索按名称或账号 ID 匹配；创建 -> 新建账号；点击账号 -> 进入账号主页。〔来源：AN-3a5fd5d91586；liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html/交互规则/1〕

## 运营管理 / 创建运营账号
页面：guild-operation-account-compose.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-operation-account-compose.html；实体页面。
- [REQ-29384e98e3e9] 头像：必填；JPG、PNG、WebP，选择后预览。〔来源：AN-a9795e315d58；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/账号信息字段/3〕
- [REQ-de8f072dbdee] 名称：必填，最多 30 字符。〔来源：AN-5299c899c176；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/账号信息字段/4〕
- [REQ-61a40748d370] 账号：必填，最多 30 字符，全平台唯一；〔来源：AN-ff08deec1174；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/账号信息字段/5〕
- [REQ-85b9fe5809d5] 初始密码：必填，至少 6 位。〔来源：AN-fb5b5c3c2abd；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/账号信息字段/6〕
- [REQ-56080a546b14] 账号状态：默认启用；禁用后不可登录或送礼。〔来源：AN-b79286d249e0；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/账号信息字段/7〕
- [REQ-de31735abdfb] 发放金币：初始发放虚拟金币，默认 0，非负且不超过本次可发额度。〔来源：AN-57534e5cba4f；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/发放金币字段/3〕
- [REQ-701086bd886c] 最多可发放：取账号月剩余额度与公会月剩余额度的较小值，单位为金币。〔来源：AN-3d470c496933；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/发放金币字段/4〕
- [REQ-735a1d24cc32] 创建时发放的是虚拟金币，资金来源为所属公会；运营账号没有真实金币，不能充值或通过任务获得金币。〔来源：AN-2d5e025fc9e6；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/业务规则/1〕
- [REQ-075e0a28916f] 确认创建 -> 校验字段和额度 -> 创建账号、记入发放额度并返回列表。〔来源：AN-f3524bbe78ae；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html/交互规则/1〕

## 运营管理 / 运营账号主页
页面：guild-operation-account-detail.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-operation-account-detail.html；实体页面。
- [REQ-9a301f4fcc80] 头像 / 名称 / 账号 ID：当前运营账号资料和唯一标识。〔来源：AN-fc0ab5139085；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/账号信息字段/3〕
- [REQ-85ea55b175e8] 启用状态：启用或禁用；与平台管理锁定状态分开。〔来源：AN-d3aad89fcf16；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/账号信息字段/4〕
- [REQ-33d8544cba8f] 管理权限锁定提示：平台锁定时仅可查看，隐藏或禁用管理操作。〔来源：AN-118364c77e22；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/账号信息字段/5〕
- [REQ-6b41dca2bb99] 日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。〔来源：AN-0f0594dee501；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/消费明细字段/3〕
- [REQ-ffb5c04ae2bf] 快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认本月。〔来源：AN-8355157a8290；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/消费明细字段/4〕
- [REQ-0d183c1b1a8f] 日期 / 消费金币：按自然日汇总该账号虚拟金币消费；点击进入对应送礼记录。〔来源：AN-e47f467431e2；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/消费明细字段/5〕
- [REQ-404687aa8764] 账号状态开关：启用或禁用当前账号。〔来源：AN-0b04dc02a438；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/管理弹层字段/3〕
- [REQ-32378557ba74] 发放数量 / 可发上限：输入本次发放虚拟金币，受账号与公会月剩余额度共同限制。〔来源：AN-1613a42bf1a3；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/管理弹层字段/4〕
- [REQ-cdac02520c9e] 账户余额：累计成功发放虚拟金币减去累计成功消费虚拟金币。〔来源：AN-798a08837998；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/数据中心字段/3〕
- [REQ-cb2f1597cb22] 累计消费：账号历史成功送礼实际消费虚拟金币总和。〔来源：AN-37036c25330e；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/数据中心字段/4〕
- [REQ-6187fe048a35] 本月发放：账号本月成功发放虚拟金币总和。〔来源：AN-31442ad5c3ea；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/数据中心字段/5〕
- [REQ-94bff1c09560] 本月消费：账号本月成功送礼实际消费虚拟金币总和。〔来源：AN-02a896f5f5a5；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/数据中心字段/6〕
- [REQ-2fa9a7ac1d2e] 运营账号没有真实金币，不能加入粉丝团；虚拟金币只能由所属公会发放，不能充值或通过任务获得，仅可用于赠送普通礼物和定制礼物，不能购买装扮、门票或用于其他消费。〔来源：AN-0b8021111432；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/管理规则/1〕
- [REQ-722c17a54831] 禁用后不可登录或送礼，历史记录和余额保留；重新启用后恢复。〔来源：AN-b30e97144187；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/管理规则/2〕
- [REQ-805cf44f6817] 平台锁定公会管理权限时仅可查看，不能启停或发放金币。〔来源：AN-3be2433d8563；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/管理规则/3〕
- [REQ-43f3dfaba8d2] 发放上限取账号月剩余额度与公会月剩余额度的较小值。〔来源：AN-f73b3add19c2；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/管理规则/4〕
- [REQ-3cb9a733a5b0] 点击日期消费 -> 进入送礼记录并带入账号和日期；启停或发放成功后刷新指标。〔来源：AN-dec339e89210；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html/交互规则/1〕

## 运营管理 / 送礼记录
页面：guild-operation-gift-records.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-operation-gift-records.html；实体页面。
- [REQ-21482a338b4c] 礼物名称 / 赠送时间：每行一笔成功赠送记录。〔来源：AN-1ee99814bbd8；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼列表字段/3〕
- [REQ-b62796c68fa1] 消费金币：单价 × 数量，均为运营账号虚拟金币。〔来源：AN-0d43436bea2e；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼列表字段/4〕
- [REQ-8886e923a248] 赠送时间：该笔成功赠送发生时间。〔来源：AN-8e0cc81a6786；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/3〕
- [REQ-9e277d7deccf] 礼物名称：赠送礼物名称。〔来源：AN-167dc0f06533；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/4〕
- [REQ-044bfc926083] 消费金币：礼物单价 × 赠送数量，不等于主播分成。〔来源：AN-8d47b9c44bcc；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/5〕
- [REQ-35bd384b5c24] 礼物单价：本次赠送采用的单件礼物金币价格。〔来源：AN-989b2564d013；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/6〕
- [REQ-24c46a7ac13f] 礼物类型：对应普通、定制等礼物类型。〔来源：AN-5f71a39905ab；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/7〕
- [REQ-f738c96c68a0] 赠送数量：该笔礼物件数，单位为件。〔来源：AN-b4e7b85b2814；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/8〕
- [REQ-fe92bf460795] 主播名称 / 主播 ID：该笔礼物接收主播的名称及唯一标识。〔来源：AN-67e7c0a8efb4；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/送礼详情字段/9〕
- [REQ-18cc1beb60b8] 支持多选运营账号和今日、昨日、本周、上周、本月、上月、自定义；默认全部运营账号、今日。〔来源：AN-9a886926f153；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/筛选/1〕
- [REQ-9d12cfa29c07] 总送礼次数：筛选范围内成功送礼记录数。〔来源：AN-2bd4b5c75dc0；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/数据中心字段/3〕
- [REQ-18e1e75f6ebd] 总消费金币：筛选范围内各成功送礼记录的礼物单价乘赠送数量之和。〔来源：AN-a04c9060b6b2；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/数据中心字段/4〕
- [REQ-d6b57fc1c481] 虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；虚拟金币送礼不计入主播收益或分成。〔来源：AN-ef751060aaf5；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/业务规则/1〕
- [REQ-d50e680d0a9b] 点击记录 -> 打开送礼详情；筛选变化 -> 刷新汇总和列表。〔来源：AN-82792ec815f2；liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html/交互规则/1〕

## 运营管理 / 选择运营账号
页面：guild-operation-account-select.html；实际承载：liveshow-proto/prototype/pages/guild/operations/guild-operation-account-select.html；实体页面。
- [REQ-3357f27fc152] 搜索：按运营账号名称或登录账号模糊匹配。〔来源：AN-c95da1f5c561；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html/选择字段/3〕
- [REQ-79212888b0a2] 头像 / 名称 / 登录账号：显示当前公会运营账号资料；此处显示登录账号，不是账号 ID。〔来源：AN-ef0e52d99457；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html/选择字段/4〕
- [REQ-93b398b52072] 结果数量 / 已选数量：分别表示搜索结果数和所有已选账号数。〔来源：AN-c4496d9c2fd4；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html/选择字段/5〕
- [REQ-a0bb60a7cf49] 全选 / 选中标记：支持多选；全选作用于全部运营账号，取消全选清空选择。〔来源：AN-b427f7017d6d；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html/选择字段/6〕
- [REQ-1a233850b6a8] 完成 -> 返回送礼记录，回填账号并保留日期条件；取消全选 -> 清空选择。〔来源：AN-3d8e5eebe243；liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html/交互规则/1〕

## 公会设置 / 公会资料
页面：guild-profile.html；实际承载：liveshow-proto/prototype/pages/guild/management/guild-profile.html；实体页面。
- [REQ-bfb5dec0051f] 公会 ID：平台创建，永久只读。〔来源：AN-37f3a01727e4；liveshow-proto/prototype/annotations/guild.js；guild-profile.html/字段/3〕
- [REQ-67367b9e484f] 公会 Logo：支持 JPG、PNG、WebP。〔来源：AN-2f389569a328；liveshow-proto/prototype/annotations/guild.js；guild-profile.html/字段/4〕
- [REQ-719b170ec807] 公会名称：必填，去除首尾空格后最多 40 字。〔来源：AN-e1f010c02c08；liveshow-proto/prototype/annotations/guild.js；guild-profile.html/字段/5〕
- [REQ-d816064a736d] 公会简介：选填，最多 200 字。〔来源：AN-184e4ae9d3d0；liveshow-proto/prototype/annotations/guild.js；guild-profile.html/字段/6〕
- [REQ-27f2001713c4] 保存 -> 校验字段 -> 更新当前公会资料；不改变公会 ID 和公会关系。〔来源：AN-25d7d9dc7cc1；liveshow-proto/prototype/annotations/guild.js；guild-profile.html/交互规则/1〕

## 公会设置 / 账号设置
页面：guild-settings.html；实际承载：liveshow-proto/prototype/pages/guild/management/guild-settings.html；实体页面。
- [REQ-3cecb107f6b2] 头像 / 公会长名称：当前登录公会长资料。〔来源：AN-320f5038b5e8；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/账号信息字段/3〕
- [REQ-1f3eaeeb6874] 公会 ID：当前管理公会的 ID，不是公会长用户 ID。〔来源：AN-a9ca2fcabab8；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/账号信息字段/4〕
- [REQ-d6a1139e269a] 语言：中文、English、Bahasa Indonesia、Bahasa Melayu；选择后更新当前语言显示。〔来源：AN-33e231b61df2；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/设置字段/3〕
- [REQ-8f05fd294d21] 修改密码：进入修改密码页。〔来源：AN-17806db1e771；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/设置字段/4〕
- [REQ-64fae34ac59a] 退出登录：二次确认后清除会话并返回登录页。〔来源：AN-6912cd943575；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/设置字段/5〕
- [REQ-8826ed80561a] 语言设置作用于当前登录账号的公会端，不修改公会或主播资料。〔来源：AN-b5d66e54a591；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/业务规则/1〕
- [REQ-e855670b3ded] 修改密码 -> 独立页面；退出登录 -> 二次确认 -> 清除会话并返回登录页。〔来源：AN-e67861778d49；liveshow-proto/prototype/annotations/guild.js；guild-settings.html/交互规则/1〕

## 公会设置 / 修改密码
页面：guild-password.html；实际承载：liveshow-proto/prototype/pages/guild/management/guild-password.html；实体页面。
- [REQ-e433f84a8574] 当前密码：必填，必须与当前密码一致。〔来源：AN-0a66d9dd802e；liveshow-proto/prototype/annotations/guild.js；guild-password.html/字段/3〕
- [REQ-91704eabb038] 新密码：必填，至少 8 位，不能与当前密码相同。〔来源：AN-9b601887b730；liveshow-proto/prototype/annotations/guild.js；guild-password.html/字段/4〕
- [REQ-b2fb543894d9] 确认新密码：必填，必须与新密码一致。〔来源：AN-d38a92926291；liveshow-proto/prototype/annotations/guild.js；guild-password.html/字段/5〕
- [REQ-1e4230a9bda5] 当前密码错误 -> 保留输入并提示“当前密码错误”；新密码与旧密码相同 -> 保留输入并提示“新密码不能和旧密码一样”；请求失败 -> 保留输入并提示“保存失败”；校验成功后更新密码并返回账号设置。〔来源：AN-1e7b3854922b；liveshow-proto/prototype/annotations/guild.js；guild-password.html/交互规则/1〕

## 数据与收益 / 直播记录
页面：guild-host-data.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-host-data.html；实体页面。
- [REQ-bc61f595358c] 主播 / 已选人数：支持多选，默认全部；进入选择页回填，保留日期条件。〔来源：AN-ad793b74306c；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/筛选字段/3〕
- [REQ-ea9a5bdb93b9] 日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。〔来源：AN-b39bd0b10032；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/筛选字段/4〕
- [REQ-4ff7e197f956] 快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认今日；从其他页进入可带入范围。〔来源：AN-45b7f874fb2e；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/筛选字段/5〕
- [REQ-b8fbc07e8999] 直播主题：该直播场次标题。〔来源：AN-26d25f83831d；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/3〕
- [REQ-682303c96745] 房型图标：区分普通、门票、密码等直播房型。〔来源：AN-1b499bde4061；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/4〕
- [REQ-bcdfbce8488c] 主播名称 / 主播 ID：多主播范围显示所属主播信息，单主播范围由顶部标识。〔来源：AN-ab5d5b7d3e19；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/5〕
- [REQ-636637b2a0cc] 开播时间：本场直播开始时间；列表按开播时间倒序。〔来源：AN-3b211bd1cda6；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/6〕
- [REQ-fb2f7046d77a] 直播时长：当前场次累计时长，以小时、分钟展示。〔来源：AN-74ad79e168b1；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/7〕
- [REQ-06ce5f7ae15a] 收益：本场计入主播收益的金币。〔来源：AN-9256c3df7d39；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/8〕
- [REQ-af1d816ec2c6] 观众：本场进入直播间的去重用户数，重复进入只计 1 人。〔来源：AN-34a9c5ec4abf；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/9〕
- [REQ-87e274cd7605] 收礼数量：本场成功收到的礼物件数总和，不是送礼人数。〔来源：AN-5b78ef3f65e5；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/直播记录字段/10〕
- [REQ-978ae84c9129] 收益：所选主播在所选日期范围内计入收益的礼物金币总和。〔来源：AN-08f9a6f9ffaa；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/数据中心字段/3〕
- [REQ-b852b846541e] 开播人数：所选日期范围内至少完成 1 场直播的去重主播数。〔来源：AN-704c7b093718；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/数据中心字段/4〕
- [REQ-5a047639c8df] 直播场次：所选主播在所选日期范围内创建的直播场次总数。〔来源：AN-8b93018b4030；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/数据中心字段/5〕
- [REQ-d1ff9ee9a737] 每次开播创建一个新场次；场次结束后消息、消费、处置和收益记录继续保留。〔来源：AN-73340a0b5c13；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/业务规则/1〕
- [REQ-201858313f73] 点击直播场次 -> 进入「直播场次详情」，带入主播 ID、日期和场次 ID。〔来源：AN-0dc745dd7d9f；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/交互规则/1〕
- [REQ-a31a4484f0c8] 开播人数当前固定为 20，尚未按所选主播及日期范围计算。〔来源：AN-cdac4fbe2fcb；liveshow-proto/prototype/annotations/guild.js；guild-host-data.html/原型待补齐/1〕

## 数据与收益 / 直播场次详情
页面：guild-live-gift-detail.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-live-gift-detail.html；实体页面。
- [REQ-cee0274fdc6e] 直播主题 / 场次 ID：当前直播主题及本场唯一 ID；不是房间号。〔来源：AN-72468bc89ae1；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/场次信息字段/3〕
- [REQ-931746f514f1] 主播名称 / 主播 ID：当前场次所属主播。〔来源：AN-22e78dc87c3d；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/场次信息字段/4〕
- [REQ-eeff117f8090] 开播时间：本场开始时间。〔来源：AN-4152f3bad699；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/场次信息字段/5〕
- [REQ-116762a0f46a] 直播时长：本场累计时长。〔来源：AN-b8397cbe7f76；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/场次信息字段/6〕
- [REQ-522c5292c024] 礼物名称 / 赠送时间：一行一笔赠送记录。〔来源：AN-a8e2e74ec87e；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼列表字段/3〕
- [REQ-61bbf5f75bd1] 金币：本次礼物消费金币，点击进入详情。〔来源：AN-d2c92415b7ed；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼列表字段/4〕
- [REQ-ce17809e6029] 赠送时间：该笔成功赠送发生时间。〔来源：AN-0f0441041e38；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/3〕
- [REQ-d9fa75022018] 礼物名称：赠送礼物名称。〔来源：AN-287b7bf26a22；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/4〕
- [REQ-2f94055c070c] 消费金币：礼物单价 × 赠送数量，不等于主播分成。〔来源：AN-c62014897903；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/5〕
- [REQ-0be76a1f4058] 礼物单价：本次赠送采用的单件礼物金币价格。〔来源：AN-88ac535562b3；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/6〕
- [REQ-056fee828da5] 礼物类型：对应普通、定制等礼物类型。〔来源：AN-1b04d104ec2d；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/7〕
- [REQ-fb723479307b] 赠送数量：该笔礼物件数，单位为件。〔来源：AN-b02560c557e8；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/8〕
- [REQ-fbb528057483] 用户名称 / 用户 ID：赠送礼物的用户资料和唯一标识；页面未展示用户等级。〔来源：AN-7de1eda1850e；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/送礼详情字段/9〕
- [REQ-8bae2a494638] 观众数量：当前场次进入直播间的去重用户数。〔来源：AN-f46c2a8e3ef1；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/数据中心字段/3〕
- [REQ-27630e55c9ee] 送礼观众：当前场次成功送礼的去重用户数。〔来源：AN-d1c864c2202b；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/数据中心字段/4〕
- [REQ-77644e12086b] 礼物数量：当前场次成功收到的礼物件数之和。〔来源：AN-6c85cfad35ac；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/数据中心字段/5〕
- [REQ-5e39153fcfa6] 礼物收益：当前场次计入主播收益的礼物金币总和。〔来源：AN-704b2da420d9；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/数据中心字段/6〕
- [REQ-8526bb52368c] 普通礼物、定制礼物按成功实际消费金币计入；幸运礼物按礼物总价值 × 后台配置比例计入，默认 1%，返奖不影响主播收益。〔来源：AN-658b12888a85；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/计算规则/1〕
- [REQ-916c296c5395] 运营账号赠送的礼物不计入主播实际收益。〔来源：AN-62fc887d131b；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/计算规则/2〕
- [REQ-74649f6b30de] 点击送礼记录 -> 查看送礼详情；返回时保留主播和日期筛选条件。〔来源：AN-d504c6598c47；liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html/交互规则/1〕

## 数据与收益 / 违规记录
页面：guild-all-violations.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-all-violations.html；实体页面。
- [REQ-d7800825d926] 违规范围：直播间违规或账号违规。〔来源：AN-6791d881cb85；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/筛选字段/3〕
- [REQ-7eadb622865d] 主播 / 已选人数：支持多选，默认全部；未选择时提示选择主播。〔来源：AN-bbeb6b9235fd；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/筛选字段/4〕
- [REQ-f4b1abc721d8] 日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。〔来源：AN-21ba3118d97d；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/筛选字段/5〕
- [REQ-32e86242c0d5] 违规主播 / 违规账号：对应主播或账号名称和 ID，可进入主播详情。〔来源：AN-a90839c738b0；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/违规明细字段/3〕
- [REQ-e6e62d583779] 违规类型：读取平台违规类型配置。〔来源：AN-b761eca5f6b4；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/违规明细字段/4〕
- [REQ-0e93ad444dd2] 举报时间 / 发生时间：直播间违规显示举报时间，账号违规显示发生时间；按该时间倒序。〔来源：AN-9490d0b96e48；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/违规明细字段/5〕
- [REQ-02eb22f92b59] 处理结果：警告、关闭场次、关闭直播权限、账号封禁等；无处置结果显示“-”。〔来源：AN-c52205d0a34f；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/违规明细字段/6〕
- [REQ-b8c55635b4fb] 警告不结束直播；关闭场次仅结束当前直播；关闭直播权限立即结束当前直播并阻止再次开播。〔来源：AN-ba602f0a4f58；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/业务规则/1〕
- [REQ-739f70aff6e8] 账号封禁后当前会话下线；直播中同时结束当前场次。〔来源：AN-3b29515faca3；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/业务规则/2〕
- [REQ-040968bcc9fe] 筛选变化 -> 刷新记录；点击主播 -> 进入主播详情。〔来源：AN-6a4f73d00f10；liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html/交互规则/1〕

## 数据与收益 / 公会业绩
页面：guild-income.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-income.html；实体页面。
- [REQ-4b5984b00419] 日数据 / 月数据：切换统计粒度并更新汇总、趋势和列表。〔来源：AN-906caf012976；liveshow-proto/prototype/annotations/guild.js；guild-income.html/筛选字段/3〕
- [REQ-3fd81bfc06b9] 日范围：本周、上周、本月、上月、自定义，默认本月。〔来源：AN-baf9e95169a5；liveshow-proto/prototype/annotations/guild.js；guild-income.html/筛选字段/4〕
- [REQ-d313b28021e1] 月范围：近半年、近一年、自定义，默认近半年；统计所选月份，不是全部历史。〔来源：AN-6b0f6787eccb；liveshow-proto/prototype/annotations/guild.js；guild-income.html/筛选字段/5〕
- [REQ-1ff0ca58162f] 日期：对应自然日。〔来源：AN-dac491554857；liveshow-proto/prototype/annotations/guild.js；guild-income.html/日数据列表字段/3〕
- [REQ-af64b1bbaea6] 直播场次：该日直播场次数，单位为场。〔来源：AN-50b3221a1784；liveshow-proto/prototype/annotations/guild.js；guild-income.html/日数据列表字段/4〕
- [REQ-14ba7a1cd732] 达标主播：该日有效直播满 3 小时的主播人数。〔来源：AN-9dcba79d2030；liveshow-proto/prototype/annotations/guild.js；guild-income.html/日数据列表字段/5〕
- [REQ-ccb51d7a71ad] 收益（金币）：该日当前公会主播收益汇总，非公会分成金额。〔来源：AN-714188580dd0；liveshow-proto/prototype/annotations/guild.js；guild-income.html/日数据列表字段/6〕
- [REQ-631cfc9ae98a] 月份：对应自然月。〔来源：AN-dc5fbb2b969f；liveshow-proto/prototype/annotations/guild.js；guild-income.html/月数据列表字段/3〕
- [REQ-5f23a2ca2390] 收益：该月主播收益金币汇总。〔来源：AN-0d00f890516d；liveshow-proto/prototype/annotations/guild.js；guild-income.html/月数据列表字段/4〕
- [REQ-4df17b6aa9fa] 开播人数：该月有开播的去重主播人数。〔来源：AN-1e02ab83d380；liveshow-proto/prototype/annotations/guild.js；guild-income.html/月数据列表字段/5〕
- [REQ-b44be692034b] 公会收益：所选日期范围内全部主播计入收益的礼物金币总和。〔来源：AN-abd56f5ae3b4；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（日数据）/3〕
- [REQ-6e67ed0c3023] 直播场次：所选日期范围内全部主播创建的直播场次总数。〔来源：AN-0aadca89a5ae；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（日数据）/4〕
- [REQ-895dd4ecd051] 开播人数：所选日期范围内至少完成 1 场直播的去重主播数。〔来源：AN-cd298e3f54c3；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（日数据）/5〕
- [REQ-a7fc2f515b8e] 达成有效天：所选日期范围内全部主播自然日累计直播满 3 小时产生的有效天总数。〔来源：AN-7d57dde17a40；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（日数据）/6〕
- [REQ-99876c93fae7] 公会收益：所选月份范围内计入收益的礼物金币总和。〔来源：AN-a726ba8ae1e5；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（月数据）/3〕
- [REQ-3f1eb3fc164d] 直播场次：所选月份范围内创建的直播场次总数。〔来源：AN-75ec4f109e6d；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（月数据）/4〕
- [REQ-c4d52f906bd9] 开播人数：所选月份范围内至少完成 1 场直播的去重主播数。〔来源：AN-be2cd569022b；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（月数据）/5〕
- [REQ-c045b44e5312] 达成有效天：所选月份范围内产生的有效天总数。〔来源：AN-b5b1671e4db5；liveshow-proto/prototype/annotations/guild.js；guild-income.html/数据中心字段（月数据）/6〕
- [REQ-0023c31a5da8] 点击指标卡片 -> 切换对应趋势；日数据按日期展示，月数据按月份展示。〔来源：AN-5c4961672cdb；liveshow-proto/prototype/annotations/guild.js；guild-income.html/趋势与交互/1〕
- [REQ-8f470024aa8e] 点击日数据行 -> 进入主播业绩并带入日期；点击月数据行 -> 带入月份。〔来源：AN-80bd7f191813；liveshow-proto/prototype/annotations/guild.js；guild-income.html/趋势与交互/2〕
- [REQ-3257800206c1] 跨日或跨月开播人数按主播去重，不能取每日人数最大值，也不能累加每日去重人数。〔来源：AN-012481b9281d；liveshow-proto/prototype/annotations/guild.js；guild-income.html/原型待补齐/1〕

## 数据与收益 / 每日
页面：guild-income-day-detail.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-income-day-detail.html；实体页面。
- [REQ-cd4e81aab118] 日期 / 历史标记：当前查看的自然日；非今日显示历史标记。〔来源：AN-3f85ecbf051e；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/日期与筛选字段/3〕
- [REQ-d5648134233d] 已开播 / 未开播及人数：按当日是否有直播区分主播列表，已开播按当日收益倒序。〔来源：AN-d4512a2f311f；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/日期与筛选字段/4〕
- [REQ-06ad3c0d866a] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-dc5af40d9f79；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/主播列表字段/3〕
- [REQ-beddde584aab] 主播 ID：主播账号唯一标识。〔来源：AN-4001bbed7953；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/主播列表字段/4〕
- [REQ-9d262cff137e] 主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。〔来源：AN-4eada7c3f866；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/主播列表字段/5〕
- [REQ-1db91ec3c02e] 当日收益：已开播主播当日收益金币。〔来源：AN-eb93dc1d745b；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/主播列表字段/6〕
- [REQ-df3be85b3d95] 直播时长 / 有效天状态：当日累计时长及是否达成有效天，未开播不显示业绩。〔来源：AN-34fde20b2ddc；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/主播列表字段/7〕
- [REQ-87ec9467d4df] 当日收益：全部主播当日计入收益的礼物金币总和。〔来源：AN-66e30a5e3edb；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/数据中心字段/3〕
- [REQ-b03f834055b4] 直播中：查看今日时为当前正在直播的去重主播数，查看历史日期时为当日开播主播数。〔来源：AN-2c28588d4e3c；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/数据中心字段/4〕
- [REQ-f41d28f9fe68] 达成有效天：当日累计直播时长达到 3 小时的主播数。〔来源：AN-0088e9543531；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/数据中心字段/5〕
- [REQ-92eb7753253a] 切换开播状态 -> 更新列表；点击主播 -> 进入主播数据并带入当前日期。〔来源：AN-99f6213922e3；liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html/交互规则/1〕

## 数据与收益 / 主播分成记录
页面：guild-share-ledger.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-share-ledger.html；实体页面。
- [REQ-955b8a81aa0e] 主播 / 已选人数：默认全部，支持多选；保留日期条件。〔来源：AN-a76f78af0a1e；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/筛选字段/3〕
- [REQ-226cf54bb205] 日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。〔来源：AN-1bbd3a071848；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/筛选字段/4〕
- [REQ-40165a196f29] 快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认本月；按分成时间筛选。〔来源：AN-1df58584aace；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/筛选字段/5〕
- [REQ-a4961bd70b3f] 主播名称 / 主播 ID：该笔分成所属主播。〔来源：AN-30a78fed6d11；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/分成记录字段/3〕
- [REQ-7363006e887b] 分成时间：财务结果入账时间，以页面本地化日期时间展示。〔来源：AN-e835883b6111；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/分成记录字段/4〕
- [REQ-d5475168b9b4] 分成金额：USD 金额，保留两位小数；正数增加，负数冲正或扣减。〔来源：AN-f45010ee5b04；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/分成记录字段/5〕
- [REQ-a00c25f0c736] 系统不在线计算或审批最终分成；财务线下确定比例和金额后上传结果。〔来源：AN-8b39965beed2；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/业务规则/1〕
- [REQ-50ee1a396c02] 分成时间与收益所属周期可以跨月；按分成时间倒序。〔来源：AN-ac212cf7fa6e；liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html/业务规则/2〕

## 数据与收益 / 公会分成记录
页面：guild-share-income.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-share-income.html；实体页面。
- [REQ-97eddfd7336d] 分成时间：当前公会财务结果入账时间，按时间倒序。〔来源：AN-d79b538b6de5；liveshow-proto/prototype/annotations/guild.js；guild-share-income.html/公会分成记录字段/3〕
- [REQ-290d0c4a70a5] 分成金额：USD 金额，保留两位小数；正数增加、绿色，负数冲正或扣减、红色。〔来源：AN-4e4766c37d52；liveshow-proto/prototype/annotations/guild.js；guild-share-income.html/公会分成记录字段/4〕
- [REQ-ab7fad33ca13] 仅展示当前公会的财务上传结果，不提供日期筛选或在线分成计算。〔来源：AN-b0302da97345；liveshow-proto/prototype/annotations/guild.js；guild-share-income.html/业务规则/1〕
- [REQ-26b0cd31708d] 按分成时间倒序；分成时间与收益所属周期可以跨月。〔来源：AN-24d23f8fa2b6；liveshow-proto/prototype/annotations/guild.js；guild-share-income.html/业务规则/2〕

## 数据与收益 / 选择主播
页面：guild-violation-host-select.html；实际承载：liveshow-proto/prototype/pages/guild/data/guild-violation-host-select.html；实体页面。
- [REQ-255a51e425fe] 搜索：按主播名称或主播 ID 模糊匹配。〔来源：AN-f42d15b674aa；liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html/选择字段/3〕
- [REQ-4f1488c6ef14] 头像 / 名称：当前主播账号头像和名称。〔来源：AN-6195f52acc73；liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html/选择字段/4〕
- [REQ-893b7e4f0546] 主播 ID：主播账号唯一标识。〔来源：AN-dbe2b7f33b89；liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html/选择字段/5〕
- [REQ-2ab5ed661332] 结果人数 / 已选人数：搜索结果人数与当前已选主播数分别显示。〔来源：AN-16d5fed430ef；liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html/选择字段/6〕
- [REQ-fb9bcb201c95] 全选 / 选中标记：支持多选，全选全部主播；全部选中后切换取消全选。〔来源：AN-7afe16a9aa40；liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html/选择字段/7〕
- [REQ-809ef5b87a67] 支持多选；完成后返回违规记录、直播记录或主播分成记录，回填主播并保留其他筛选条件。〔来源：AN-56e2725bb8ae；liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html/交互规则/1〕

## 需求待确认（不作为确定业务规则）
- [PENDING-virtual-board] 虚拟金币榜单范围：系统概要允许虚拟赠礼计入榜单展示，具体适用于哪些榜单？ 选项：A. 仅本场氛围榜；B. 本场榜及平台双榜；C. 由后台逐榜配置。影响端：用户App、公会App、管理后台。依据：AN-58bdfd055651、AN-9076ce003939、AN-ba0acac09cff、AN-bbb10e3b591b、AN-7861fb19ad1a。
- [PENDING-guild-notice-sort] 公会通知顺序：主播端公会通知列表如何排序？ 选项：A. 生成时间倒序；B. 未读优先再按生成时间倒序。影响端：用户App、公会App。依据：AN-205fe7899e2d。
- [PENDING-operation-login-format] 运营账号登录格式：运营账号必须是可接收验证码的邮箱，还是允许普通登录名？ 选项：A. 必须为有效邮箱地址；B. 允许普通登录名并使用密码登录。影响端：用户App、公会App、管理后台。依据：AN-ff08deec1174、AN-053fd74e2f42。
- [PENDING-business-zone] 业务日和周界限：签到、任务、榜单、直播有效天和报表分别采用什么业务时区；任务周是否统一从周一开始？ 选项：A. 全端统一指定业务时区且周一开始；B. 按业务分别指定时区和周起始日。影响端：用户App、公会App、管理后台。依据：AN-6162c5b34166、AN-2d643ddb84e1。
- [PENDING-effective-duration] 有效时长排除条件：断流、后台挂起和暂停期间哪些时长计入每日 3 小时门槛？ 选项：A. 仅连续成功推流时长；B. 会话持续时长扣除配置的无效区间。影响端：用户App、公会App、管理后台。依据：AN-2d643ddb84e1。
- [PENDING-cross-day-live] 跨日直播时长分配：跨自然日的一场直播如何分配每天的有效时长及收益？ 选项：A. 按事件发生时间切分到各日；B. 全部归入开播日。影响端：用户App、公会App、管理后台。依据：AN-2d643ddb84e1。
- [PENDING-metric-latency] 指标刷新时效：直播、收益和等级变动后，各端指标最迟何时应更新？ 选项：A. 实时更新并指定秒级上限；B. 按固定汇总周期更新。影响端：用户App、公会App、管理后台。依据：AN-2d643ddb84e1、AN-4c265a228f16。
- [PENDING-coin-precision] 金币和收益精度：幸运礼物收益出现不足 1 金币的小数时如何存储、累计和展示？ 选项：A. 每笔截断为整数；B. 保留小数累计后统一展示；C. 按明确精度四舍五入。影响端：用户App、公会App、管理后台。依据：AN-3839cfde3299。
- [PENDING-level-history] 历史等级快照：调整等级阈值后历史记录展示原等级还是重算等级？ 选项：A. 保留事件发生时等级；B. 显示当前重算等级。影响端：用户App、公会App、管理后台。依据：AN-10e4cbde5c33。
