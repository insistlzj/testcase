# 公会App项目需求清单

> 当前系统概要优先，原型页面及结构化批注补充。带“需求待确认”标记的原文仅保留问题证据，不构成确定业务预期。
> 同页视图归入所属页面；测试用例的功能模块取原型页面目录结构。

## 登录与首页 / 公会登录 / guild-login.html
页面入口：liveshow-proto/prototype/pages/guild/auth/guild-login.html

- **REQ-5f61f44b53b1** 【正式规则】公会账号：必填；使用平台创建的公会长账号。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-login.html；字段；SRC-GUILD-3
- **REQ-d7201c8835b7** 【正式规则】密码：必填；错误时统一提示账号或密码错误。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-login.html；字段；SRC-GUILD-4
- **REQ-76a4e00d61ef** 【正式规则】1. 一期仅公会长可登录公会端；运营账号不能登录公会端。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-login.html；业务规则；SRC-GUILD-5
- **REQ-15b87f23d830** 【正式规则】2. 公会长账号被停用后不可登录，不影响公会内主播账号。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-login.html；业务规则；SRC-GUILD-6
- **REQ-dda7dbff3ea0** 【正式规则】1. 登录校验通过 -> 进入「选择公会」；账号或密码错误 -> 停留当前页并提示“账号或密码错误”。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-login.html；交互规则；SRC-GUILD-7
## 登录与首页 / 选择公会 / guild-switch.html
页面入口：liveshow-proto/prototype/pages/guild/auth/guild-switch.html

- **REQ-3480df046bf9** 【正式规则】名称 / 用户 ID：当前登录公会长的名称和账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-switch.html；公会长字段；SRC-GUILD-10
- **REQ-ac0b60fbcabc** 【正式规则】身份：当前登录角色为公会长。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-switch.html；公会长字段；SRC-GUILD-11
- **REQ-c36f94897185** 【正式规则】公会 Logo / 名称 / ID：可管理公会的标识、名称及唯一 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-switch.html；公会列表字段；SRC-GUILD-14
- **REQ-225adc4fd6df** 【正式规则】当前公会：当前选中的公会显示「当前公会」，其他公会显示选择入口；不是启用状态。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-switch.html；公会列表字段；SRC-GUILD-15
- **REQ-b8c4f29fd3e0** 【正式规则】1. 仅展示当前账号可管理且未解散的公会；已解散公会不可选择。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-switch.html；业务规则；SRC-GUILD-16
- **REQ-b8cc4e99b745** 【正式规则】1. 选择公会 -> 更新当前公会，返回首页并重新加载该公会数据。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-switch.html；交互规则；SRC-GUILD-17
## 登录与首页 / 首页 / guild-home.html
页面入口：liveshow-proto/prototype/pages/guild/home/guild-home.html

- **REQ-6913df3ee9d5** 【正式规则】公会 Logo / 名称 / ID：当前管理的公会；点击进入选择公会。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；公会信息字段；SRC-GUILD-20
- **REQ-3b9a4901a62b** 【正式规则】通知标记：通知入口上的未读提示；点击进入通知消息。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；公会信息字段；SRC-GUILD-21
- **REQ-498d6cecdd5e** 【正式规则】账号设置：进入当前公会长的账号设置。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；公会信息字段；SRC-GUILD-22
- **REQ-6a94a8b12ee1** 【正式规则】当日收益：当前公会当日主播收益金币汇总，不是公会分成金额。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；今日概况字段；SRC-GUILD-25
- **REQ-e912d0aca3d6** 【正式规则】直播中：当前时刻正在直播的去重主播数，单位为人。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；今日概况字段；SRC-GUILD-26
- **REQ-6504613d1273** 【正式规则】达成有效天：当日累计有效直播满 3 小时的主播数，单位为人。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；今日概况字段；SRC-GUILD-27
- **REQ-d823c785cbbd** 【正式规则】1. 普通礼物、定制礼物按成功实际消费金币计入；幸运礼物按礼物总价值 × 后台配置比例计入，默认 1%，返奖不影响主播收益。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；计算规则；SRC-GUILD-28
- **REQ-cc1efac54a82** 【正式规则】2. 运营账号虚拟金币送礼及失败消费不计入主播收益。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；计算规则；SRC-GUILD-29
- **REQ-1d3b1a61a3da** 【正式规则】1. 点击今日概况 -> 进入当日经营详情；功能入口进入对应列表。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-home.html；交互规则；SRC-GUILD-30
## 登录与首页 / 通知消息 / guild-notifications.html
页面入口：liveshow-proto/prototype/pages/guild/home/guild-notifications.html

- **REQ-4aa953016658** 【正式规则】标题：业务事件及结果。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知列表字段；SRC-GUILD-33
- **REQ-2148c0172896** 【正式规则】摘要：对象、处理结果或待处理数量。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知列表字段；SRC-GUILD-34
- **REQ-11aaa73d412a** 【正式规则】时间：通知生成时间；按生成时间倒序排列。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知列表字段；SRC-GUILD-35
- **REQ-ec9c6cf09271** 【正式规则】未读标记：未读通知显示圆点，已读不显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知列表字段；SRC-GUILD-36
- **REQ-fbccc72d47be** 【正式规则】1. 入会申请待初审、平台终审结果；退会申请待审核。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知类型；SRC-GUILD-37
- **REQ-4d0543771bfa** 【正式规则】2. 平台关闭直播场次、关闭或恢复直播权限。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知类型；SRC-GUILD-38
- **REQ-ad9fa1638ecd** 【正式规则】3. 公会状态、公会长账号状态或运营账号管理权限变更。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知类型；SRC-GUILD-39
- **REQ-bb6cd0c38874** 【正式规则】4. 主播分成、公会分成结果新增或冲正。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；通知类型；SRC-GUILD-40
- **REQ-10ced19ffe25** 【正式规则】1. 点击通知 -> 进入通知详情；有关联业务时由详情进入对应记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notifications.html；交互规则；SRC-GUILD-41
## 登录与首页 / 通知详情 / guild-notification-detail.html
页面入口：liveshow-proto/prototype/pages/guild/home/guild-notification-detail.html

- **REQ-78c8d9aa028d** 【正式规则】标题：对应通知的标题。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html；通知内容字段；SRC-GUILD-44
- **REQ-36e42f069039** 【正式规则】发送时间：通知生成时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html；通知内容字段；SRC-GUILD-45
- **REQ-2ec1339592d2** 【正式规则】正文：业务对象、状态变化及处理信息。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html；通知内容字段；SRC-GUILD-46
- **REQ-90d3a493f427** 【正式规则】业务入口：有关联记录且有权限时显示，进入对应业务记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html；通知内容字段；SRC-GUILD-47
- **REQ-f325634a9fac** 【正式规则】1. 进入详情 -> 标记为已读；点击业务入口 -> 进入对应记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-notification-detail.html；交互规则；SRC-GUILD-48
## 主播管理 / 入会申请 / guild-join-review.html
页面入口：liveshow-proto/prototype/pages/guild/approval/guild-join-review.html

- **REQ-7c3feec7bb55** 【正式规则】状态 Tab / 数量：默认审核中；展示审核中、已通过、已驳回及各状态申请数量。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；筛选字段；SRC-GUILD-51
- **REQ-d16e735ecacf** 【正式规则】申请人头像 / 名称 / ID：提交入会申请的用户资料及用户 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；申请列表字段；SRC-GUILD-54
- **REQ-9cbb2af001ee** 【正式规则】申请时间：本次申请提交时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；申请列表字段；SRC-GUILD-55
- **REQ-01aea7c3c29c** 【正式规则】状态：审核中包含待公会审核和平台审核中；驳回区分公会驳回、平台驳回。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；申请列表字段；SRC-GUILD-56
- **REQ-f955002a92d8** 【正式规则】1. 同一用户同时只能有一笔待处理入会申请，且只能加入一个公会。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；业务规则；SRC-GUILD-57
- **REQ-347fa03b678b** 【正式规则】2. 公会或平台驳回后，本次申请单结束；用户重新申请生成新单，须重新经过公会审核。旧单审核结果只读保留，不继承到新单。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；业务规则；SRC-GUILD-58
- **REQ-35b9e0216cef** 【正式规则】3. 本次申请的公会审核通过后自动进入平台审核，无需用户再次提交。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；业务规则；SRC-GUILD-59
- **REQ-2627f61b5dcf** 【正式规则】1. 状态 Tab -> 筛选对应状态；点击申请卡片 -> 进入申请详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review.html；交互规则；SRC-GUILD-60
## 主播管理 / 入会申请详情 / guild-join-review-detail.html
页面入口：liveshow-proto/prototype/pages/guild/approval/guild-join-review-detail.html

- **REQ-f5ae96afc3b9** 【正式规则】头像 / 昵称 / 用户 ID：本次申请人的账号资料。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；申请人字段；SRC-GUILD-63
- **REQ-f30ceeca123b** 【正式规则】申请公会：本次申请目标公会名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；申请人字段；SRC-GUILD-64
- **REQ-e3ed126d2036** 【正式规则】姓名：申请人提交的姓名，区别于账号昵称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；申请人字段；SRC-GUILD-65
- **REQ-3475235a94e5** 【正式规则】电话：申请人提交的联系电话。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；申请人字段；SRC-GUILD-66
- **REQ-72fecefb0261** 【正式规则】本人照片：申请提交的本人照片，可点开大图。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；认证材料字段；SRC-GUILD-69
- **REQ-7de42daabd25** 【正式规则】证件正面 / 反面：申请提交的证件图片，可分别查看。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；认证材料字段；SRC-GUILD-70
- **REQ-14cedfd463b3** 【正式规则】节点 / 状态：用户提交、公会审核、平台审核、成为主播，显示当前处理阶段。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；审核进度字段；SRC-GUILD-73
- **REQ-e5d474e04dec** 【正式规则】节点时间：对应提交或审核完成时间；未发生不显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；审核进度字段；SRC-GUILD-74
- **REQ-53046ad842aa** 【正式规则】驳回理由：驳回时选填，最多 200 字符；显示在对应审核节点，未填显示「未填写」。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；审核进度字段；SRC-GUILD-75
- **REQ-d32dd6d86d3c** 【正式规则】查看主页：成为主播后进入该主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；审核进度字段；SRC-GUILD-76
- **REQ-4520c38a9a13** 【正式规则】1. 本次申请公会审核通过后，自动进入平台审核节点，无需用户再次提交。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；业务规则；SRC-GUILD-77
- **REQ-894cab3df5ee** 【正式规则】2. 公会或平台驳回后，本次申请单结束；重新申请生成新单并重新由公会审核，旧单结果不继承。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；业务规则；SRC-GUILD-78
- **REQ-291af42ec723** 【正式规则】3. 已处理的旧单公会审核结果只读；新单须由公会重新审核。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；业务规则；SRC-GUILD-79
- **REQ-58a3b3083f47** 【正式规则】1. 通过 -> 二次确认 -> 提交平台终审；驳回 -> 填写可选理由 -> 结束申请。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；交互规则；SRC-GUILD-80
- **REQ-282f21a0e2d2** 【正式规则】2. 点击认证材料 -> 查看大图；成为主播后可进入主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-join-review-detail.html；交互规则；SRC-GUILD-81
## 主播管理 / 退会申请 / guild-leave-review.html
页面入口：liveshow-proto/prototype/pages/guild/approval/guild-leave-review.html

- **REQ-34f3e2e1e60c** 【正式规则】状态 Tab / 数量：默认审核中；展示审核中、已通过、已驳回及各状态申请数量。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；筛选字段；SRC-GUILD-84
- **REQ-1ec2195a8925** 【正式规则】申请人头像 / 名称 / ID：提交退会申请的主播资料及主播 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；申请列表字段；SRC-GUILD-87
- **REQ-244e380c3182** 【正式规则】申请时间：本次申请提交时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；申请列表字段；SRC-GUILD-88
- **REQ-458da153b105** 【正式规则】状态：审核中为待公会处理，已通过或已驳回为处理结果。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；申请列表字段；SRC-GUILD-89
- **REQ-d663601c7f44** 【正式规则】1. 退会申请仅由公会审核，不进入平台终审。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；业务规则；SRC-GUILD-90
- **REQ-6795c54d10ea** 【正式规则】2. 通过后立即结束当前直播、解除公会关系并失去主播身份；驳回后保留主播身份。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；业务规则；SRC-GUILD-91
- **REQ-e238b21c76a7** 【正式规则】1. 状态 Tab -> 筛选对应状态；点击申请卡片 -> 进入申请详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review.html；交互规则；SRC-GUILD-92
## 主播管理 / 退会申请详情 / guild-leave-review-detail.html
页面入口：liveshow-proto/prototype/pages/guild/approval/guild-leave-review-detail.html

- **REQ-a48ba6bfa371** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；主播信息字段；SRC-GUILD-95
- **REQ-26bf1cfca040** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；主播信息字段；SRC-GUILD-96
- **REQ-8fb398d1b1d8** 【正式规则】加入时间：当前公会关系生效日期。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；申请与处理字段；SRC-GUILD-99
- **REQ-bb414c358408** 【正式规则】申请时间：本次退会申请提交时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；申请与处理字段；SRC-GUILD-100
- **REQ-7cd6e6046561** 【正式规则】申请状态：待审核、已通过或已驳回。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；申请与处理字段；SRC-GUILD-101
- **REQ-c72b0d74078b** 【正式规则】退会原因：主播提交的退会原因。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；申请与处理字段；SRC-GUILD-102
- **REQ-d6b381f70c6f** 【正式规则】处理时间 / 结果：已处理后显示本次审核时间和结果。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；申请与处理字段；SRC-GUILD-103
- **REQ-30c7a0c47120** 【正式规则】驳回理由：选填，最多 200 字符；已驳回时显示，未填显示「未填写」。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；申请与处理字段；SRC-GUILD-104
- **REQ-b0f181b59384** 【正式规则】1. 通过 -> 立即结束当前直播、解除公会关系并失去主播身份。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；业务规则；SRC-GUILD-105
- **REQ-6bec92629c2b** 【正式规则】2. 驳回 -> 保留主播身份和公会关系；主播可重新申请。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；业务规则；SRC-GUILD-106
- **REQ-4e84386ce9a6** 【正式规则】1. 通过需二次确认；驳回理由选填，最多 200 字；已处理记录只读。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；交互规则；SRC-GUILD-107
- **REQ-13747281f46f** 【原型说明】通过退会前的二次确认尚未实现。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-leave-review-detail.html；原型待补齐；SRC-GUILD-108
## 主播管理 / 主播列表 / guild-member-list.html
页面入口：liveshow-proto/prototype/pages/guild/people/guild-member-list.html

- **REQ-0d0a38bc020e** 【正式规则】在会 / 已退会及数量：默认在会；按当前或历史公会关系区分，并显示人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；筛选字段；SRC-GUILD-111
- **REQ-946b654076e0** 【正式规则】搜索：按主播名称或 ID 模糊匹配，与状态筛选共同生效。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；筛选字段；SRC-GUILD-112
- **REQ-0ba7c960a009** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；主播列表字段；SRC-GUILD-115
- **REQ-18b92dc9135e** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；主播列表字段；SRC-GUILD-116
- **REQ-5f9e6c9e5f24** 【正式规则】加入时间：本次公会关系生效日期；列表按加入时间倒序。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；主播列表字段；SRC-GUILD-117
- **REQ-381281aaf488** 【正式规则】1. 仅展示当前公会的在会主播和历史退会主播；普通用户不进入主播列表。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；业务规则；SRC-GUILD-118
- **REQ-cbb7a2174f2f** 【正式规则】1. 状态 Tab 和名称或 ID 搜索共同生效；点击主播 -> 进入主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-member-list.html；交互规则；SRC-GUILD-119
## 主播管理 / 主播业绩 / guild-host-list.html
页面入口：liveshow-proto/prototype/pages/guild/people/guild-host-list.html

- **REQ-11ec1831d720** 【正式规则】日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；筛选字段；SRC-GUILD-122
- **REQ-8e961a9af293** 【正式规则】快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认今日。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；筛选字段；SRC-GUILD-123
- **REQ-b714dfa901eb** 【正式规则】搜索：按主播昵称或 ID 查找。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；筛选字段；SRC-GUILD-124
- **REQ-8c2c22c4168d** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；主播列表字段；SRC-GUILD-127
- **REQ-b4777791eb9d** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；主播列表字段；SRC-GUILD-128
- **REQ-5891c9734594** 【正式规则】主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；主播列表字段；SRC-GUILD-129
- **REQ-1eac88140da3** 【正式规则】退会标记：历史退会主播显示【退会】，保留归属当前公会期间的业绩。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；主播列表字段；SRC-GUILD-130
- **REQ-7b9651bd111c** 【正式规则】金币收益：所选周期内该主播计入收益的金币数，非分成金额。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；主播列表字段；SRC-GUILD-131
- **REQ-37610426be25** 【正式规则】支持今日、昨日、本周、上周、本月、上月、自定义；默认今日。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；日期筛选；SRC-GUILD-132
- **REQ-0d705a92bb23** 【正式规则】主播收益、开播人数、达标人数均随选中日期变化，统计所选周期内的数据。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；数据中心字段；SRC-GUILD-133
- **REQ-a6b491d7b1aa** 【正式规则】主播收益：所选日期范围内所有主播直播间计入收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；数据中心字段；SRC-GUILD-136
- **REQ-0f3fd7e3397f** 【正式规则】开播人数：所选日期范围内至少完成 1 场直播的去重主播数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；数据中心字段；SRC-GUILD-137
- **REQ-ad5f3403fb33** 【正式规则】达标人数：所选周期内达到有效天标准的去重主播人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；数据中心字段；SRC-GUILD-138
- **REQ-da175ce63bb2** 【正式规则】1. 有效天按主播自然日累计直播时长达到 3 小时计 1 天。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；业务规则；SRC-GUILD-139
- **REQ-67458be2a092** 【正式规则】2. 已退会主播保留历史业绩并显示【退会】；统计以直播发生时的公会关系为准。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；业务规则；SRC-GUILD-140
- **REQ-8c9d20b12f67** 【正式规则】1. 日期变化 -> 刷新指标与列表；点击主播行 -> 进入「主播数据」。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；交互规则；SRC-GUILD-141
- **REQ-5431281bea48** 【原型说明】列表收益及汇总人数尚未完整随日期重新计算。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-list.html；原型待补齐；SRC-GUILD-142
## 主播管理 / 主播数据 / guild-host-summary.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-host-summary.html

- **REQ-0996dff5d166** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；主播信息字段；SRC-GUILD-145
- **REQ-6c4f8435a29e** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；主播信息字段；SRC-GUILD-146
- **REQ-75eff86df698** 【正式规则】主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；主播信息字段；SRC-GUILD-147
- **REQ-dd4a60d7c8f3** 【正式规则】直播中标记：当前主播正在直播时显示，未开播时隐藏。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；主播信息字段；SRC-GUILD-148
- **REQ-396541118a33** 【正式规则】退会标记 / 主页：已退会显示【退会】；主页入口进入主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；主播信息字段；SRC-GUILD-149
- **REQ-601776b12c53** 【正式规则】日数据 / 月数据：日数据可选本周、上周、本月、上月、自定义，默认本月；月数据当前无月份筛选控件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；筛选字段；SRC-GUILD-152
- **REQ-1779db697186** 【正式规则】日期 / 月份：日数据一行一个自然日，月数据一行一个自然月。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；数据列表字段；SRC-GUILD-155
- **REQ-f997046439a2** 【正式规则】直播时长：对应日或月的累计直播时长，按小时和分钟显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；数据列表字段；SRC-GUILD-156
- **REQ-27451eaf9055** 【正式规则】有效天标记：日数据时长旁 ✓ 表示当日满 3 小时有效直播，! 表示未达标。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；数据列表字段；SRC-GUILD-157
- **REQ-287d99181822** 【正式规则】新增粉丝：对应日或月新增关注人数，不扣除取关，单位为人。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；数据列表字段；SRC-GUILD-158
- **REQ-542f71638053** 【正式规则】收益（金币）：对应日或月主播收益金币，不是分成金额。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；数据列表字段；SRC-GUILD-159
- **REQ-0a5f516ac158** 【正式规则】1. 点击日或月数据行 -> 进入「直播记录」，带入主播和对应日期或月份。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；交互规则；SRC-GUILD-160
- **REQ-4086521f7068** 【正式规则】2. 点击主页入口 -> 进入主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；交互规则；SRC-GUILD-161
- **REQ-7903a760b8c0** 【原型说明】新增粉丝应为非负新增人数；当前共享 Mock 仍包含负数示例，需同步调整数据。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-summary.html；原型待补齐；SRC-GUILD-162
## 主播管理 / 主播主页 / guild-host-detail.html
页面入口：liveshow-proto/prototype/pages/guild/people/guild-host-detail.html

- **REQ-9c8365970619** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；主播信息字段；SRC-GUILD-165
- **REQ-fa2507b4d6df** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；主播信息字段；SRC-GUILD-166
- **REQ-a82a66570557** 【正式规则】主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；主播信息字段；SRC-GUILD-167
- **REQ-81fc8f1e04b7** 【正式规则】退会标记：已退会显示【退会】，不显示管理入口。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；主播信息字段；SRC-GUILD-168
- **REQ-e351e91ed44f** 【正式规则】姓名 / 电话：主播认证时提交的姓名和联系电话。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；认证信息字段；SRC-GUILD-171
- **REQ-be79750ac19b** 【正式规则】本人照片 / 证件正反面：认证图片，可分别查看大图。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；认证信息字段；SRC-GUILD-172
- **REQ-cc076c5df509** 【正式规则】直播权限：当前公会侧直播权限开关；平台锁定或已退会时不可修改。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理字段；SRC-GUILD-175
- **REQ-2bdde8e39011** 【正式规则】权限已锁定：平台限制当前公会操作时显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理字段；SRC-GUILD-176
- **REQ-3adcb5adabe3** 【正式规则】移出公会：结束当前直播并解除公会关系，收益归属截止至移出时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理字段；SRC-GUILD-177
- **REQ-a4148668b89f** 【正式规则】申请类型 / 状态：加入或退出申请及审核结果。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；申请记录字段；SRC-GUILD-180
- **REQ-1a81bbf86bd2** 【正式规则】申请时间：本次申请提交时间，按提交时间倒序展示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；申请记录字段；SRC-GUILD-181
- **REQ-5bf9d823291d** 【正式规则】审核节点 / 时间：公会审核、平台审核及各自处理时间；按申请类型显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；申请记录字段；SRC-GUILD-182
- **REQ-ccb9a3faf7eb** 【正式规则】申请原因 / 驳回原因：显示本次申请和驳回时填写内容。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；申请记录字段；SRC-GUILD-183
- **REQ-4e9b69496562** 【正式规则】粉丝数：当前关注该主播的人数，不是周期新增粉丝累计。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；数据中心字段（业绩）；SRC-GUILD-186
- **REQ-4fb585b39a12** 【正式规则】总收益：当前主播历史直播间计入收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；数据中心字段（业绩）；SRC-GUILD-187
- **REQ-bccc67cb07b8** 【正式规则】直播次数：累计完成的直播场次数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；数据中心字段（业绩）；SRC-GUILD-188
- **REQ-0e48ead52cc5** 【正式规则】直播时长：全部已完成直播场次时长总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；数据中心字段（业绩）；SRC-GUILD-189
- **REQ-8af217e09909** 【正式规则】累计违规：直播间违规和账号违规记录总数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；数据中心字段（业绩）；SRC-GUILD-190
- **REQ-3bc8908ef0a3** 【正式规则】1. 开播需账号可用、公会有效且主播认证通过。平台关闭时禁止开播；平台开启且锁定公会权限时，实际开播权限跟随平台开启；未锁定时平台和公会权限均开启才允许开播；解锁后恢复公会锁定前设置。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理规则；SRC-GUILD-191；采用系统概要3.2直播权限优先级表
- **REQ-4fc6cf0d0919** 【正式规则】2. 平台锁定公会管理权限时，公会直播权限开关只读；解除锁定后恢复锁定前设置。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理规则；SRC-GUILD-192
- **REQ-d7578655d74c** 【正式规则】3. 关闭正在直播主播的权限 -> 二次确认后立即结束当前直播，并禁止再次开播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理规则；SRC-GUILD-193
- **REQ-e479d67b9151** 【正式规则】4. 存在未结清收益时移出公会按钮置灰；确认移出后结束当前直播并解除公会关系。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；管理规则；SRC-GUILD-194
- **REQ-49bae997141c** 【正式规则】1. 点击业绩 -> 进入「主播数据」；点击认证材料 -> 查看大图；管理操作均需确认。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；交互规则；SRC-GUILD-195
- **REQ-0b6fe0501b60** 【原型说明】粉丝数应取当前关注人数；当前 Mock 使用周期涨粉汇总，数据来源需校正。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；待确认；SRC-GUILD-196
- **REQ-f9c23f8d8811** 【原型说明】存在未结清收益时应禁止移出，当前原型尚未接入该判断。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-detail.html；原型待补齐；SRC-GUILD-197
## 运营工具 / 运营消息 / guild-messages.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-messages.html

- **REQ-47c155de9784** 【正式规则】日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；筛选字段；SRC-GUILD-200
- **REQ-84fcbbb4bde2** 【正式规则】快捷日期：本周、本月、自定义，默认本月；按发送时间筛选。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；筛选字段；SRC-GUILD-201
- **REQ-c8958e03713f** 【正式规则】发送对象：全体主播，或指定主播名称和主播 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；发送记录字段；SRC-GUILD-204
- **REQ-2263ce51fcbc** 【正式规则】发送时间：本次消息实际发送时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；发送记录字段；SRC-GUILD-205
- **REQ-e187f162f7b8** 【正式规则】消息摘要：发送文字，超出卡片可见长度截断。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；发送记录字段；SRC-GUILD-206
- **REQ-d94cf97e0735** 【正式规则】记录数量：当前筛选条件下的发送记录条数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；发送记录字段；SRC-GUILD-207
- **REQ-b89ae6ba9123** 【正式规则】1. 新建 -> 进入发送页；点击消息记录 -> 进入消息详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-messages.html；交互规则；SRC-GUILD-208
## 运营工具 / 新建运营消息 / guild-message-compose.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-message-compose.html

- **REQ-071be1de5357** 【正式规则】对象类型：全体主播或指定 1 名当前公会主播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html；发送对象字段；SRC-GUILD-211
- **REQ-290b9184d089** 【正式规则】已选主播 / 接收人数：指定时回填所选主播；全体时显示预计接收人数，发送前再次确认。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html；发送对象字段；SRC-GUILD-212
- **REQ-ad8aa90131f0** 【正式规则】文字内容 / 字数：必填，最多 500 字符，显示当前字数/500。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html；消息内容字段；SRC-GUILD-215
- **REQ-2230182a7752** 【正式规则】图片：选填，最多 1 张，支持 JPG、PNG、WebP，可预览和移除。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html；消息内容字段；SRC-GUILD-216
- **REQ-8eb222b06950** 【正式规则】1. 发送对象和内容按确认时快照生成记录；发送后不支持编辑或撤回。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html；业务规则；SRC-GUILD-217
- **REQ-48fe35060417** 【正式规则】1. 发送 -> 校验必填项 -> 二次确认接收范围 -> 生成记录并返回列表。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-compose.html；交互规则；SRC-GUILD-218
## 运营工具 / 选择主播 / guild-host-select.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-host-select.html

- **REQ-7012869c65e6** 【正式规则】搜索：按当前公会主播名称或 ID 模糊匹配。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-select.html；选择字段；SRC-GUILD-221
- **REQ-df4b3542a7c2** 【正式规则】主播数量：当前搜索结果人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-select.html；选择字段；SRC-GUILD-222
- **REQ-97cd72373bf2** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-select.html；选择字段；SRC-GUILD-223
- **REQ-dc31b1a4e9a0** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-select.html；选择字段；SRC-GUILD-224
- **REQ-3711cde5fe62** 【正式规则】选中标记：仅可选 1 人，选中行显示勾选；完成后回填消息发送对象。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-select.html；选择字段；SRC-GUILD-225
- **REQ-ab3611f8dec0** 【正式规则】1. 完成 -> 回填新建运营消息；未选择时提示选择主播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-select.html；交互规则；SRC-GUILD-226
## 运营工具 / 消息详情 / guild-message-detail.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-message-detail.html

- **REQ-bea99a86a3b3** 【正式规则】发送对象 / 人数：发送时的接收范围和实际人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；发送信息字段；SRC-GUILD-229
- **REQ-933d994eee0b** 【正式规则】接收人名称：指定接收人的名称列表，按发送时快照展示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；发送信息字段；SRC-GUILD-230
- **REQ-ca337fc6ee2d** 【正式规则】发送时间：本次发送时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；发送信息字段；SRC-GUILD-231
- **REQ-297b5e0e3bf7** 【正式规则】发送人：执行发送的公会长名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；发送信息字段；SRC-GUILD-232
- **REQ-a4835c8a89b4** 【正式规则】正文：发送时的文字内容。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；消息内容字段；SRC-GUILD-235
- **REQ-e882b7259ce5** 【正式规则】图片：发送时附带的图片，无图片时不显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；消息内容字段；SRC-GUILD-236
- **REQ-46295ce894ac** 【正式规则】1. 详情只读；接收人后续退会不改变历史记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-message-detail.html；业务规则；SRC-GUILD-237
## 运营工具 / 运营账号 / guild-operation-accounts.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-operation-accounts.html

- **REQ-56cd13972b64** 【正式规则】搜索：按运营账号名称或账号 ID 匹配。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；账号列表字段；SRC-GUILD-240
- **REQ-48472b42ff0b** 【正式规则】名称 / 账号 ID：运营账号名称及唯一标识，不是登录账号。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；账号列表字段；SRC-GUILD-241
- **REQ-7a47312e00c4** 【正式规则】余额：当前可用虚拟金币，单位为金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；账号列表字段；SRC-GUILD-242
- **REQ-f40c8344e1ab** 【正式规则】本月消费：本自然月成功送礼消耗的虚拟金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；账号列表字段；SRC-GUILD-243
- **REQ-35c9e8637b4f** 【正式规则】创建：进入创建运营账号页。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；账号列表字段；SRC-GUILD-244
- **REQ-5479c2595a0d** 【正式规则】本月已发放：当前公会本月向全部运营账号成功发放的虚拟金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；数据中心字段；SRC-GUILD-247
- **REQ-07ccfe1b17c0** 【正式规则】本月剩余可发：公会本月累计发放上限减去本月已发放，不小于 0。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；数据中心字段；SRC-GUILD-248
- **REQ-c7b698bb777a** 【正式规则】账户余额累计：全部运营账号可用虚拟金币余额之和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；数据中心字段；SRC-GUILD-249
- **REQ-bf39582dcdf6** 【正式规则】本月累计消费：全部运营账号本月成功送礼实际消费虚拟金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；数据中心字段；SRC-GUILD-250
- **REQ-e8a2b32cb1d2** 【正式规则】1. 运营账号由公会创建，不对应真实用户，也不能加入粉丝团。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；业务规则；SRC-GUILD-251
- **REQ-c2d7804c13c5** 【正式规则】2. 运营账号没有真实金币，只有虚拟金币；虚拟金币只能由所属公会发放，不能通过充值或任务获得。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；业务规则；SRC-GUILD-252
- **REQ-fa31c1b4ff57** 【正式规则】3. 在各类观众名单中，运营账号只进入在线观众列表，贡献值始终为 0，不进入任何榜单或排行；虚拟金币仅可用于赠送普通礼物和定制礼物，只计入公屏消息和礼物效果，不计入主播收益或分成；不能赠送幸运礼物，不能购买装扮、门票或用于其他消费。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；业务规则；SRC-GUILD-253
- **REQ-25f5f780296f** 【正式规则】1. 搜索按名称或账号 ID 匹配；创建 -> 新建账号；点击账号 -> 进入账号主页。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-accounts.html；交互规则；SRC-GUILD-254
## 运营工具 / 创建运营账号 / guild-operation-account-compose.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-operation-account-compose.html

- **REQ-9d6081f3950c** 【正式规则】头像：必填；JPG、PNG、WebP，选择后预览。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；账号信息字段；SRC-GUILD-257
- **REQ-26ba8fb92142** 【正式规则】名称：必填，最多 30 字符。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；账号信息字段；SRC-GUILD-258
- **REQ-ba4adee83342** 【正式规则】账号：必填，最多30字符，全平台唯一；登录名格式见需求待确认。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；账号信息字段；SRC-GUILD-259
- **REQ-37d509ce6e38** 【正式规则】初始密码：必填，至少 6 位。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；账号信息字段；SRC-GUILD-260
- **REQ-dcf9b5ec5baf** 【正式规则】账号状态：默认启用；禁用后不可登录或送礼。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；账号信息字段；SRC-GUILD-261
- **REQ-6f2664020d2b** 【正式规则】发放金币：初始发放虚拟金币，默认 0，非负且不超过本次可发额度。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；发放金币字段；SRC-GUILD-264
- **REQ-cd6a03e29391** 【正式规则】最多可发放：取账号月剩余额度与公会月剩余额度的较小值，单位为金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；发放金币字段；SRC-GUILD-265
- **REQ-1a64eca3ec7e** 【正式规则】1. 创建时发放的是虚拟金币，资金来源为所属公会；运营账号没有真实金币，不能充值或通过任务获得金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；业务规则；SRC-GUILD-266
- **REQ-18e6f92ab030** 【正式规则】1. 确认创建 -> 校验字段和额度 -> 创建账号、记入发放额度并返回列表。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；交互规则；SRC-GUILD-267
- **REQ-bf9cdcdc206d** 【需求待确认】页面说明使用邮箱登录，但当前示例 nadia_ops 不是邮箱；需明确账号格式及校验。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-compose.html；待确认；SRC-GUILD-268
## 运营工具 / 运营账号主页 / guild-operation-account-detail.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-operation-account-detail.html

- **REQ-d25b35a4df90** 【正式规则】头像 / 名称 / 账号 ID：当前运营账号资料和唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；账号信息字段；SRC-GUILD-271
- **REQ-7646c62698b9** 【正式规则】启用状态：启用或禁用；与平台管理锁定状态分开。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；账号信息字段；SRC-GUILD-272
- **REQ-08aa8f7fddb5** 【正式规则】管理权限锁定提示：平台锁定时仅可查看，隐藏或禁用管理操作。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；账号信息字段；SRC-GUILD-273
- **REQ-6e7a5925d5b4** 【正式规则】日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；消费明细字段；SRC-GUILD-276
- **REQ-366c4df6d782** 【正式规则】快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认本月。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；消费明细字段；SRC-GUILD-277
- **REQ-4b572c434fc6** 【正式规则】日期 / 消费金币：按自然日汇总该账号虚拟金币消费；点击进入对应送礼记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；消费明细字段；SRC-GUILD-278
- **REQ-d4d0020a6fb9** 【正式规则】账号状态开关：启用或禁用当前账号。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；管理弹层字段；SRC-GUILD-281
- **REQ-679e814edf80** 【正式规则】发放数量 / 可发上限：输入本次发放虚拟金币，受账号与公会月剩余额度共同限制。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；管理弹层字段；SRC-GUILD-282
- **REQ-829bf72e5c0a** 【正式规则】账户余额：累计成功发放虚拟金币减去累计成功消费虚拟金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；数据中心字段；SRC-GUILD-285
- **REQ-3b632dcb59da** 【正式规则】累计消费：账号历史成功送礼实际消费虚拟金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；数据中心字段；SRC-GUILD-286
- **REQ-07cd82ef5b3a** 【正式规则】本月发放：账号本月成功发放虚拟金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；数据中心字段；SRC-GUILD-287
- **REQ-30339bdad58d** 【正式规则】本月消费：账号本月成功送礼实际消费虚拟金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；数据中心字段；SRC-GUILD-288
- **REQ-74a5fc1cae99** 【正式规则】1. 运营账号没有真实金币，不能加入粉丝团；虚拟金币只能由所属公会发放，不能充值或通过任务获得，仅可用于赠送普通礼物和定制礼物，不能购买装扮、门票或用于其他消费。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；管理规则；SRC-GUILD-289
- **REQ-6c9432dc3f2d** 【正式规则】2. 禁用后不可登录或送礼，历史记录和余额保留；重新启用后恢复。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；管理规则；SRC-GUILD-290
- **REQ-7e3fb4be88e3** 【正式规则】3. 平台锁定公会管理权限时仅可查看，不能启停或发放金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；管理规则；SRC-GUILD-291
- **REQ-027d2650847b** 【正式规则】4. 发放上限取账号月剩余额度与公会月剩余额度的较小值。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；管理规则；SRC-GUILD-292
- **REQ-ff9041624126** 【正式规则】1. 点击日期消费 -> 进入送礼记录并带入账号和日期；启停或发放成功后刷新指标。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-detail.html；交互规则；SRC-GUILD-293
## 运营工具 / 送礼记录 / guild-operation-gift-records.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-operation-gift-records.html

- **REQ-bcb12c6e3d70** 【正式规则】礼物名称 / 赠送时间：每行一笔成功赠送记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼列表字段；SRC-GUILD-296
- **REQ-b1708057eef3** 【正式规则】消费金币：单价 × 数量，均为运营账号虚拟金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼列表字段；SRC-GUILD-297
- **REQ-3a16fbf7a035** 【正式规则】赠送时间：该笔成功赠送发生时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-300
- **REQ-b3ddda9fea5f** 【正式规则】礼物名称：赠送礼物名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-301
- **REQ-67a193e4ec8d** 【正式规则】消费金币：礼物单价 × 赠送数量，不等于主播分成。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-302
- **REQ-097e125c296e** 【正式规则】礼物单价：本次赠送采用的单件礼物金币价格。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-303
- **REQ-36de063203a5** 【正式规则】礼物类型：对应普通、定制等礼物类型。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-304
- **REQ-6d53a55f5980** 【正式规则】赠送数量：该笔礼物件数，单位为件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-305
- **REQ-43f811c0f6ae** 【正式规则】主播名称 / 主播 ID：该笔礼物接收主播的名称及唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；送礼详情字段；SRC-GUILD-306
- **REQ-cbaa9bccc9de** 【正式规则】支持多选运营账号和今日、昨日、本周、上周、本月、上月、自定义；默认全部运营账号、今日。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；筛选；SRC-GUILD-307
- **REQ-81a3ed5abf3a** 【正式规则】总送礼次数：筛选范围内成功送礼记录数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；数据中心字段；SRC-GUILD-310
- **REQ-7d4a601f95fa** 【正式规则】总消费金币：筛选范围内各成功送礼记录的礼物单价乘赠送数量之和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；数据中心字段；SRC-GUILD-311
- **REQ-93bf5f228dfe** 【正式规则】1. 虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；虚拟金币送礼不计入主播收益或分成。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；业务规则；SRC-GUILD-312
- **REQ-507664dd9eeb** 【正式规则】1. 点击记录 -> 打开送礼详情；筛选变化 -> 刷新汇总和列表。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-gift-records.html；交互规则；SRC-GUILD-313
## 运营工具 / 选择运营账号（多选） / guild-operation-account-select.html
页面入口：liveshow-proto/prototype/pages/guild/operations/guild-operation-account-select.html

- **REQ-ef0c0a831aa2** 【正式规则】搜索：按运营账号名称或登录账号模糊匹配。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html；选择字段；SRC-GUILD-316
- **REQ-174d0cbda32b** 【正式规则】头像 / 名称 / 登录账号：显示当前公会运营账号资料；此处显示登录账号，不是账号 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html；选择字段；SRC-GUILD-317
- **REQ-0c9d662848b4** 【正式规则】结果数量 / 已选数量：分别表示搜索结果数和所有已选账号数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html；选择字段；SRC-GUILD-318
- **REQ-731cc63e8bb2** 【正式规则】全选 / 选中标记：支持多选；全选作用于全部运营账号，取消全选清空选择。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html；选择字段；SRC-GUILD-319
- **REQ-ec36dd70dcff** 【正式规则】1. 完成 -> 返回送礼记录，回填账号并保留日期条件；取消全选 -> 清空选择。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-operation-account-select.html；交互规则；SRC-GUILD-320
## 公会管理 / 公会资料 / guild-profile.html
页面入口：liveshow-proto/prototype/pages/guild/management/guild-profile.html

- **REQ-c68ea3b46fc7** 【正式规则】公会 ID：平台创建，永久只读。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-profile.html；字段；SRC-GUILD-323
- **REQ-bdd6386bbb66** 【正式规则】公会 Logo：支持 JPG、PNG、WebP。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-profile.html；字段；SRC-GUILD-324
- **REQ-827721b095f8** 【正式规则】公会名称：必填，去除首尾空格后最多 40 字。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-profile.html；字段；SRC-GUILD-325
- **REQ-db923df69f8a** 【正式规则】公会简介：选填，最多 200 字。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-profile.html；字段；SRC-GUILD-326
- **REQ-70ec7b1e0c3d** 【正式规则】1. 保存 -> 校验字段 -> 更新当前公会资料；不改变公会 ID 和公会关系。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-profile.html；交互规则；SRC-GUILD-327
## 公会管理 / 账号设置 / guild-settings.html
页面入口：liveshow-proto/prototype/pages/guild/management/guild-settings.html

- **REQ-24f58a645007** 【正式规则】头像 / 公会长名称：当前登录公会长资料。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；账号信息字段；SRC-GUILD-330
- **REQ-8be05b68b85e** 【正式规则】公会 ID：当前管理公会的 ID，不是公会长用户 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；账号信息字段；SRC-GUILD-331
- **REQ-abaa8f0c3396** 【正式规则】语言：中文、English、Bahasa Indonesia、Bahasa Melayu；选择后更新当前语言显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；设置字段；SRC-GUILD-334
- **REQ-2bd29732456c** 【正式规则】修改密码：进入修改密码页。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；设置字段；SRC-GUILD-335
- **REQ-5924278ce187** 【正式规则】退出登录：二次确认后清除会话并返回登录页。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；设置字段；SRC-GUILD-336
- **REQ-3203791f25d8** 【正式规则】1. 语言设置作用于当前登录账号的公会端，不修改公会或主播资料。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；业务规则；SRC-GUILD-337
- **REQ-308eb014e34f** 【正式规则】1. 修改密码 -> 独立页面；退出登录 -> 二次确认 -> 清除会话并返回登录页。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-settings.html；交互规则；SRC-GUILD-338
## 公会管理 / 修改密码 / guild-password.html
页面入口：liveshow-proto/prototype/pages/guild/management/guild-password.html

- **REQ-8ca419878fbb** 【正式规则】当前密码：必填，必须与当前密码一致。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-password.html；字段；SRC-GUILD-341
- **REQ-e6fec0352ac9** 【正式规则】新密码：必填，至少 8 位，不能与当前密码相同。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-password.html；字段；SRC-GUILD-342
- **REQ-b84a8280b95e** 【正式规则】确认新密码：必填，必须与新密码一致。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-password.html；字段；SRC-GUILD-343
- **REQ-ebcb7b632099** 【正式规则】1. 当前密码错误 -> 保留输入并提示“当前密码错误”；新密码与旧密码相同 -> 保留输入并提示“新密码不能和旧密码一样”；请求失败 -> 保留输入并提示“保存失败”；校验成功后更新密码并返回账号设置。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-password.html；交互规则；SRC-GUILD-344
## 数据与收益 / 直播记录 / guild-host-data.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-host-data.html

- **REQ-08faa1304783** 【正式规则】主播 / 已选人数：支持多选，默认全部；进入选择页回填，保留日期条件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；筛选字段；SRC-GUILD-347
- **REQ-1be57bba4047** 【正式规则】日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；筛选字段；SRC-GUILD-348
- **REQ-b5fab014efd8** 【正式规则】快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认今日；从其他页进入可带入范围。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；筛选字段；SRC-GUILD-349
- **REQ-e3767edd9c7b** 【正式规则】直播主题：该直播场次标题。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-352
- **REQ-442147718fe6** 【正式规则】房型图标：区分普通、门票、密码等直播房型。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-353
- **REQ-1221acc6aa29** 【正式规则】主播名称 / 主播 ID：多主播范围显示所属主播信息，单主播范围由顶部标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-354
- **REQ-27679ba94edc** 【正式规则】开播时间：本场直播开始时间；列表按开播时间倒序。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-355
- **REQ-dd0807235d97** 【正式规则】直播时长：当前场次累计时长，以小时、分钟展示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-356
- **REQ-6b593d7d38f6** 【正式规则】收益：本场计入主播收益的金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-357
- **REQ-4f9b330976db** 【正式规则】观众：本场进入直播间的去重用户数，重复进入只计 1 人。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-358
- **REQ-b0dd1ad499ca** 【正式规则】收礼数量：本场成功收到的礼物件数总和，不是送礼人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；直播记录字段；SRC-GUILD-359
- **REQ-56ed49642530** 【正式规则】收益：所选主播在所选日期范围内计入收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；数据中心字段；SRC-GUILD-362
- **REQ-8fc59d945f54** 【正式规则】开播人数：所选日期范围内至少完成 1 场直播的去重主播数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；数据中心字段；SRC-GUILD-363
- **REQ-0c21593960fd** 【正式规则】直播场次：所选主播在所选日期范围内创建的直播场次总数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；数据中心字段；SRC-GUILD-364
- **REQ-a5a3a5ccbbb6** 【正式规则】1. 每次开播创建一个新场次；场次结束后消息、消费、处置和收益记录继续保留。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；业务规则；SRC-GUILD-365
- **REQ-26d51d07b374** 【正式规则】1. 点击直播场次 -> 进入「直播场次详情」，带入主播 ID、日期和场次 ID。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；交互规则；SRC-GUILD-366
- **REQ-249f40923889** 【原型说明】开播人数当前固定为 20，尚未按所选主播及日期范围计算。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-host-data.html；原型待补齐；SRC-GUILD-367
## 数据与收益 / 直播场次详情 / guild-live-gift-detail.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-live-gift-detail.html

- **REQ-7a61e5f92e6d** 【正式规则】直播主题 / 场次 ID：当前直播主题及本场唯一 ID；不是房间号。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；场次信息字段；SRC-GUILD-370
- **REQ-d7b1689b308d** 【正式规则】主播名称 / 主播 ID：当前场次所属主播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；场次信息字段；SRC-GUILD-371
- **REQ-bc39746dc10e** 【正式规则】开播时间：本场开始时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；场次信息字段；SRC-GUILD-372
- **REQ-3a4675da5911** 【正式规则】直播时长：本场累计时长。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；场次信息字段；SRC-GUILD-373
- **REQ-55e89c691eee** 【正式规则】礼物名称 / 赠送时间：一行一笔赠送记录。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼列表字段；SRC-GUILD-376
- **REQ-a52a416cf13e** 【正式规则】金币：本次礼物消费金币，点击进入详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼列表字段；SRC-GUILD-377
- **REQ-11c07952190f** 【正式规则】赠送时间：该笔成功赠送发生时间。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-380
- **REQ-196da5d367ee** 【正式规则】礼物名称：赠送礼物名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-381
- **REQ-64e41a53b88f** 【正式规则】消费金币：礼物单价 × 赠送数量，不等于主播分成。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-382
- **REQ-5b1eecfc9a27** 【正式规则】礼物单价：本次赠送采用的单件礼物金币价格。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-383
- **REQ-58b2254a0941** 【正式规则】礼物类型：对应普通、定制等礼物类型。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-384
- **REQ-b2197c3c2e58** 【正式规则】赠送数量：该笔礼物件数，单位为件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-385
- **REQ-93d5b7f8688f** 【正式规则】用户名称 / 用户 ID：赠送礼物的用户资料和唯一标识；页面未展示用户等级。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；送礼详情字段；SRC-GUILD-386
- **REQ-b6422feedd6e** 【正式规则】观众数量：当前场次进入直播间的去重用户数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；数据中心字段；SRC-GUILD-389
- **REQ-7d068e075206** 【正式规则】送礼观众：当前场次成功送礼的去重用户数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；数据中心字段；SRC-GUILD-390
- **REQ-f6239cd9ae7b** 【正式规则】礼物数量：当前场次成功收到的礼物件数之和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；数据中心字段；SRC-GUILD-391
- **REQ-748319f69b03** 【正式规则】礼物收益：当前场次计入主播收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；数据中心字段；SRC-GUILD-392
- **REQ-50afce4f563f** 【正式规则】1. 普通礼物、定制礼物按成功实际消费金币计入；幸运礼物按礼物总价值 × 后台配置比例计入，默认 1%，返奖不影响主播收益。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；计算规则；SRC-GUILD-393
- **REQ-b409f84ccf77** 【正式规则】2. 运营账号赠送的礼物不计入主播实际收益。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；计算规则；SRC-GUILD-394
- **REQ-9714708419d5** 【正式规则】1. 点击送礼记录 -> 查看送礼详情；返回时保留主播和日期筛选条件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-live-gift-detail.html；交互规则；SRC-GUILD-395
## 数据与收益 / 违规记录 / guild-all-violations.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-all-violations.html

- **REQ-209e305f2a95** 【正式规则】违规范围：直播间违规或账号违规。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；筛选字段；SRC-GUILD-398
- **REQ-bb3258b612d5** 【正式规则】主播 / 已选人数：支持多选，默认全部；未选择时提示选择主播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；筛选字段；SRC-GUILD-399
- **REQ-3caa16d1492a** 【正式规则】日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；筛选字段；SRC-GUILD-400
- **REQ-be1399973dbd** 【正式规则】违规主播 / 违规账号：对应主播或账号名称和 ID，可进入主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；违规明细字段；SRC-GUILD-403
- **REQ-b6b51e83e296** 【正式规则】违规类型：读取平台违规类型配置。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；违规明细字段；SRC-GUILD-404
- **REQ-2193ff33f58c** 【正式规则】举报时间 / 发生时间：直播间违规显示举报时间，账号违规显示发生时间；按该时间倒序。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；违规明细字段；SRC-GUILD-405
- **REQ-fbc17ab917b7** 【正式规则】处理结果：警告、关闭场次、关闭直播权限、账号封禁等；无处置结果显示“-”。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；违规明细字段；SRC-GUILD-406
- **REQ-b40230356129** 【正式规则】1. 警告不结束直播；关闭场次仅结束当前直播；关闭直播权限立即结束当前直播并阻止再次开播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；业务规则；SRC-GUILD-407
- **REQ-64e251686c55** 【正式规则】2. 账号封禁后当前会话下线；直播中同时结束当前场次。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；业务规则；SRC-GUILD-408
- **REQ-532e40bab209** 【正式规则】1. 筛选变化 -> 刷新记录；点击主播 -> 进入主播详情。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-all-violations.html；交互规则；SRC-GUILD-409
## 数据与收益 / 公会业绩 / guild-income.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-income.html

- **REQ-dbc501aa1134** 【正式规则】日数据 / 月数据：切换统计粒度并更新汇总、趋势和列表。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；筛选字段；SRC-GUILD-412
- **REQ-d37771cb543f** 【正式规则】日范围：本周、上周、本月、上月、自定义，默认本月。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；筛选字段；SRC-GUILD-413
- **REQ-1c1f3cfd5125** 【正式规则】月范围：近半年、近一年、自定义，默认近半年；统计所选月份，不是全部历史。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；筛选字段；SRC-GUILD-414
- **REQ-a53e83783e87** 【正式规则】日期：对应自然日。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；日数据列表字段；SRC-GUILD-417
- **REQ-c1a6e3b703bb** 【正式规则】直播场次：该日直播场次数，单位为场。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；日数据列表字段；SRC-GUILD-418
- **REQ-1955ff14d117** 【正式规则】达标主播：该日有效直播满 3 小时的主播人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；日数据列表字段；SRC-GUILD-419
- **REQ-90228a85fe97** 【正式规则】收益（金币）：该日当前公会主播收益汇总，非公会分成金额。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；日数据列表字段；SRC-GUILD-420
- **REQ-b4ecf178659c** 【正式规则】月份：对应自然月。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；月数据列表字段；SRC-GUILD-423
- **REQ-0c6a7c118842** 【正式规则】收益：该月主播收益金币汇总。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；月数据列表字段；SRC-GUILD-424
- **REQ-32710a91047a** 【正式规则】开播人数：该月有开播的去重主播人数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；月数据列表字段；SRC-GUILD-425
- **REQ-120491ce9925** 【正式规则】公会收益：所选日期范围内全部主播计入收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（日数据）；SRC-GUILD-428
- **REQ-d15b0fa3a16a** 【正式规则】直播场次：所选日期范围内全部主播创建的直播场次总数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（日数据）；SRC-GUILD-429
- **REQ-024f8f36e810** 【正式规则】开播人数：所选日期范围内至少完成 1 场直播的去重主播数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（日数据）；SRC-GUILD-430
- **REQ-9ed85696f36b** 【正式规则】达成有效天：所选日期范围内全部主播自然日累计直播满 3 小时产生的有效天总数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（日数据）；SRC-GUILD-431
- **REQ-36b7dd55bc1a** 【正式规则】公会收益：所选月份范围内计入收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（月数据）；SRC-GUILD-434
- **REQ-4a356878298a** 【正式规则】直播场次：所选月份范围内创建的直播场次总数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（月数据）；SRC-GUILD-435
- **REQ-646b45ea7bb0** 【正式规则】开播人数：所选月份范围内至少完成 1 场直播的去重主播数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（月数据）；SRC-GUILD-436
- **REQ-91e61389b432** 【正式规则】达成有效天：所选月份范围内产生的有效天总数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；数据中心字段（月数据）；SRC-GUILD-437
- **REQ-1e99a6258a1d** 【正式规则】1. 点击指标卡片 -> 切换对应趋势；日数据按日期展示，月数据按月份展示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；趋势与交互；SRC-GUILD-438
- **REQ-b4a379f3681c** 【正式规则】2. 点击日数据行 -> 进入主播业绩并带入日期；点击月数据行 -> 带入月份。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；趋势与交互；SRC-GUILD-439
- **REQ-1cf968ab51be** 【原型说明】跨日或跨月的开播人数应按主播去重；当前 Mock 以每日人数最大值代替。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income.html；原型待补齐；SRC-GUILD-440
## 数据与收益 / 每日 / guild-income-day-detail.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-income-day-detail.html

- **REQ-136eaaa6e25c** 【正式规则】日期 / 历史标记：当前查看的自然日；非今日显示历史标记。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；日期与筛选字段；SRC-GUILD-443
- **REQ-7f4dbabfcda9** 【正式规则】已开播 / 未开播及人数：按当日是否有直播区分主播列表，已开播按当日收益倒序。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；日期与筛选字段；SRC-GUILD-444
- **REQ-89a5c71d337c** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；主播列表字段；SRC-GUILD-447
- **REQ-85c8b60ca454** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；主播列表字段；SRC-GUILD-448
- **REQ-588e794e69c3** 【正式规则】主播等级：按后台主播等级累计门槛匹配分成前收益，不含运营号金币，与财富等级分开。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；主播列表字段；SRC-GUILD-449
- **REQ-12600d763965** 【正式规则】当日收益：已开播主播当日收益金币。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；主播列表字段；SRC-GUILD-450
- **REQ-6359ffa4e7fc** 【正式规则】直播时长 / 有效天状态：当日累计时长及是否达成有效天，未开播不显示业绩。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；主播列表字段；SRC-GUILD-451
- **REQ-48b8679384f1** 【正式规则】当日收益：全部主播当日计入收益的礼物金币总和。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；数据中心字段；SRC-GUILD-454
- **REQ-7e73bff3ce0c** 【正式规则】直播中：查看今日时为当前正在直播的去重主播数，查看历史日期时为当日开播主播数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；数据中心字段；SRC-GUILD-455
- **REQ-f24885176749** 【正式规则】达成有效天：当日累计直播时长达到 3 小时的主播数。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；数据中心字段；SRC-GUILD-456
- **REQ-3d4df208c603** 【正式规则】1. 切换开播状态 -> 更新列表；点击主播 -> 进入主播数据并带入当前日期。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-income-day-detail.html；交互规则；SRC-GUILD-457
## 数据与收益 / 主播分成记录 / guild-share-ledger.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-share-ledger.html

- **REQ-8ce55a2012b9** 【正式规则】主播 / 已选人数：默认全部，支持多选；保留日期条件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；筛选字段；SRC-GUILD-460
- **REQ-7f9821d8e4a3** 【正式规则】日期范围：按当前筛选起止日期统计，包含开始日和结束日；随快捷日期或自定义日期更新。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；筛选字段；SRC-GUILD-461
- **REQ-e9c530534e0b** 【正式规则】快捷日期：今日、昨日、本周、上周、本月、上月、自定义，默认本月；按分成时间筛选。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；筛选字段；SRC-GUILD-462
- **REQ-55421b93ab90** 【正式规则】主播名称 / 主播 ID：该笔分成所属主播。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；分成记录字段；SRC-GUILD-465
- **REQ-91564db9a916** 【正式规则】分成时间：财务结果入账时间，以页面本地化日期时间展示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；分成记录字段；SRC-GUILD-466
- **REQ-e04b2fc8da54** 【正式规则】分成金额：USD 金额，保留两位小数；正数增加，负数冲正或扣减。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；分成记录字段；SRC-GUILD-467
- **REQ-2010984afb60** 【正式规则】1. 系统不在线计算或审批最终分成；财务线下确定比例和金额后上传结果。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；业务规则；SRC-GUILD-468
- **REQ-bc96b41ae0a2** 【正式规则】2. 分成时间与收益所属周期可以跨月；按分成时间倒序。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-ledger.html；业务规则；SRC-GUILD-469
## 数据与收益 / 公会分成记录 / guild-share-income.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-share-income.html

- **REQ-38b9fe91cceb** 【正式规则】分成时间：当前公会财务结果入账时间，按时间倒序。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-income.html；公会分成记录字段；SRC-GUILD-472
- **REQ-39e59f822231** 【正式规则】分成金额：USD 金额，保留两位小数；正数增加、绿色，负数冲正或扣减、红色。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-income.html；公会分成记录字段；SRC-GUILD-473
- **REQ-1afa9bbb787d** 【正式规则】1. 仅展示当前公会的财务上传结果，不提供日期筛选或在线分成计算。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-income.html；业务规则；SRC-GUILD-474
- **REQ-bc29e36d3b72** 【正式规则】2. 按分成时间倒序；分成时间与收益所属周期可以跨月。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-share-income.html；业务规则；SRC-GUILD-475
## 数据与收益 / 选择主播（多选） / guild-violation-host-select.html
页面入口：liveshow-proto/prototype/pages/guild/data/guild-violation-host-select.html

- **REQ-2ee500261795** 【正式规则】搜索：按主播名称或主播 ID 模糊匹配。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html；选择字段；SRC-GUILD-478
- **REQ-a55c36ffadaa** 【正式规则】头像 / 名称：当前主播账号头像和名称。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html；选择字段；SRC-GUILD-479
- **REQ-30e2a7348149** 【正式规则】主播 ID：主播账号唯一标识。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html；选择字段；SRC-GUILD-480
- **REQ-49205bdc523a** 【正式规则】结果人数 / 已选人数：搜索结果人数与当前已选主播数分别显示。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html；选择字段；SRC-GUILD-481
- **REQ-74d9c44c037d** 【正式规则】全选 / 选中标记：支持多选，全选全部主播；全部选中后切换取消全选。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html；选择字段；SRC-GUILD-482
- **REQ-9b94ebc6e08d** 【正式规则】1. 支持多选；完成后返回违规记录、直播记录或主播分成记录，回填主播并保留其他筛选条件。
  来源：liveshow-proto/prototype/annotations/guild.js；guild-violation-host-select.html；交互规则；SRC-GUILD-483

## 跨页面公共约定

- **COMMON-guild-1** 【正式规则】公会App日期时间字段使用dd/mm/yyyy HH.mm，纯日期不附加时间。
  来源：liveshow-proto/prototype/Luma Live-原型说明.md:视觉规则

## 来源差异和范围问题
