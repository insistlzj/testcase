# 管理后台 项目需求清单

来源：当前系统概要、活动原型页面和明确批注；同步批次 RSL-0034。系统概要优先；历史生成附录和历史任务链接已退出当前需求依据。原文件逐字保存在归档的 context-before 中。

## 公共业务规则

用户与主播共用账号；入会材料随申请提交，公会初审及平台终审均通过后入会成为主播；任一方驳回后申请失效。平台权限优先，锁定期间公会只读，解锁恢复原公会设置。公会停用解除主播关系、身份并结束直播，停用公会长账号只限制该账号登录。只有充值可退款，已完成礼物及门票消费不撤销；幸运礼物收益取赠送时配置比例，返奖不影响主播收益；虚拟金币不形成主播收益。系统不在线申请或审批结算，不计算具体分成；财务线下完成后上传结果。细则以 context/系统概要 .md 对应章节为准。

## 数据报表 · 工作台

原型：`liveshow-proto/prototype/pages/admin/dashboard/admin-dashboard.html`；视图：`admin-dashboard.html`。

执行角色：平台管理员；页面入口：工作台。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-33cc4be183：后台管理员点击趋势图的数据点可读取该点对应日期、指标名称和值。（原型交互依据：prototype/assets/admin-reporting.js）

- REQ-ADMIN-4663849a52：平台管理员查看最新经营指标、近 7 日趋势、被动退款和快捷入口。
- REQ-ADMIN-4bcad3fc9c：活跃用户 / 新增用户：最新自然日打开 App（启动或从后台切回前台）的去重登录用户数 / 完成注册的去重用户数。
- REQ-ADMIN-ecca85cbb8：总充值金额 / 人数：支付成功充值订单的实付金额合计 / 去重用户数。
- REQ-ADMIN-3cf8154857：新用户充值金额：最新自然日注册用户当日支付成功的充值金额合计。
- REQ-ADMIN-02fef82597：新用户 ARPU：新用户充值金额 / 新用户充值人数；分母为 0 时记 0。
- REQ-ADMIN-a544597acd：达成有效天主播：最新自然日累计有效直播不少于 3 小时的去重主播数。
- REQ-ADMIN-f31bacc937：被动退款：支付渠道发起的退款记录，按退款时间倒序。
- REQ-ADMIN-dfac5392d6：指标卡取最新自然日，趋势取截至该日最近 7 个自然日。
- REQ-ADMIN-e4a9bbad71：点击指标卡 -> 切换趋势；刷新 -> 重新取数；点击退款记录或快捷入口 -> 进入对应页面。
- REQ-PUB-14c0bdc0f0：指标卡取最新自然日汇总；点击指标卡切换近 7 日趋势。

## 用户管理 · 用户列表

原型：`liveshow-proto/prototype/pages/admin/user/admin-user-list.html`；视图：`admin-user-list.html`。

执行角色：平台管理员；页面入口：用户列表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-c18946e195：平台管理员查询用户并查看详情、封禁或解封。
- REQ-ADMIN-683356ae89：用户信息：头像、昵称和全局唯一用户 ID。
- REQ-ADMIN-0993ca8ece：账号状态：仅正常、封禁。
- REQ-ADMIN-3c67edaf29：财富等级：当前等级；筛选上下限为非负整数且上限不得小于下限。
- REQ-ADMIN-24d2608b4f：累计充值：支付成功充值订单实付金额合计。
- REQ-ADMIN-50459407e8：累计消费：普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 幸运礼物返奖；失败、撤销和虚拟金币不计。
- REQ-ADMIN-6981e54194：金币余额：当前真实金币余额；充值退款可使其为负。
- REQ-ADMIN-13552567ba：所属公会：当前有效关系，无公会显示“-”。
- REQ-ADMIN-9051784747：注册时间：首次注册时间；时间筛选首尾均包含。
- REQ-ADMIN-6d3d51b163：封禁后立即下线，正在直播时同时关播，未登录账号禁止登录。
- REQ-ADMIN-2648bcb6dc：查询 -> 条件取交集；导出 -> 当前筛选结果。
- REQ-ADMIN-2ab612c482：封禁或解封 -> 填写原因并确认 -> 更新并留痕。
- REQ-PUB-5ffffbea47：账号级状态仅包含正常和封禁；禁言不作为账号状态展示。

## 用户管理 · 用户详情

原型：`liveshow-proto/prototype/pages/admin/user/admin-user-detail.html`；视图：`admin-user-detail.html`。

执行角色：平台管理员；页面入口：用户详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-bc9733471e：平台管理员核对单个用户的资料、资产、设备、关系和违规记录。
- REQ-ADMIN-9f866d7979：基础资料：用户 ID、昵称、手机号、地区、注册时间和账号状态取当前值。
- REQ-ADMIN-bcf72d442b：金币余额：当前真实金币余额；负数时禁止消费。
- REQ-ADMIN-c5982c7d3b：充值流水：充值订单、基础金币、赠送金币、渠道和状态。
- REQ-ADMIN-cf99c37655：消费流水：商品、数量、扣减金币、主播和直播场次，只读。
- REQ-ADMIN-6cb4820287：登录设备：设备、系统、应用版本、最近登录时间和状态。
- REQ-ADMIN-d010dbe61b：关注 / 粉丝：当前有效关系。
- REQ-ADMIN-9e75aad000：违规记录：举报或审核来源、结论、处置和时间。
- REQ-ADMIN-c25ad4ca88：解封只恢复登录，不自动恢复直播权限。
- REQ-ADMIN-42a155b9ac：充值退款扣回原订单全部到账金币，但不撤销已完成消费。
- REQ-ADMIN-13615e7a7c：切换 Tab -> 加载明细；账号处置 -> 填写原因并确认 -> 更新并留痕。

## 主播管理 · 主播列表

原型：`liveshow-proto/prototype/pages/admin/host/admin-host-list.html`；视图：`admin-host-list.html`。

执行角色：平台管理员；页面入口：主播列表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-c21736b6b7：平台管理员查询主播并管理账号、直播权限和公会管理权限。
- REQ-ADMIN-cbc88fd888：主播 / 公会：主播身份来自认证通过；公会为当前有效关系。
- REQ-ADMIN-9b7dfb6bb1：账号状态：仅正常、封禁，独立于直播权限。
- REQ-ADMIN-b909d2723a：开播权限：账号可用、公会有效、认证通过；平台关闭时关闭，平台开启且未锁定时取公会设置，平台锁定开启时跟随平台，解锁恢复公会原设置。
- REQ-ADMIN-69bfe359fc：金币收益：普通、定制和门票按实际消费；幸运礼物按礼物价值 × 配置比例；虚拟金币不计。
- REQ-ADMIN-14a331483d：违规次数：已确认违规记录数，不含不成立或已作废。
- REQ-ADMIN-d389df27ff：平台关闭直播权限时立即关播并禁止再次开播。
- REQ-ADMIN-eac0d030b1：锁定期间公会设置跟随平台且不可改；解锁后恢复锁定前设置并重算权限。
- REQ-ADMIN-1d36dd2f89：变更权限、警告、封禁或解封 -> 填写原因并确认 -> 记录前后值、操作人和时间；导出当前筛选结果。

## 主播管理 · 主播详情

原型：`liveshow-proto/prototype/pages/admin/host/admin-host-detail.html`；视图：`admin-host-detail.html`。

执行角色：平台管理员；页面入口：主播详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-993f0f0a25：平台管理员查看主播身份、直播、收益、粉丝团和违规信息并执行处置。
- REQ-ADMIN-85c435202d：平台直播权限：平台控制项；关闭即结束当前直播。
- REQ-ADMIN-d7c46af41b：公会管理权限：关闭后公会不可修改；锁定期间保留公会原设置。
- REQ-ADMIN-ecba2cbc88：直播记录：每次开播生成独立场次并保留房型、时长、消费、处置和收益。
- REQ-ADMIN-1ed0122be1：收益：普通、定制、门票按实际消费；幸运礼物 = 礼物价值 × 配置比例，默认 1%。
- REQ-ADMIN-bf04f3220d：违规记录：已确认处置及时间。
- REQ-ADMIN-998aac75ce：封禁账号与关闭直播权限独立；解封不恢复直播权限。
- REQ-ADMIN-5d896ac3e2：切换 Tab -> 加载记录；权限或账号处置 -> 填写原因并确认 -> 更新并留痕。
- REQ-PUB-42eaf16ba2：初期每位主播仅可创建一个粉丝团。

## 主播管理 · 主播审核

原型：`liveshow-proto/prototype/pages/admin/host/admin-host-review.html`；视图：`admin-host-review.html`。

执行角色：平台管理员；页面入口：主播审核。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-a0a3d72662：平台管理员查询公会初审通过后提交的平台主播认证申请。
- REQ-ADMIN-dae2b57a66：申请单号：每次提交生成唯一单号；重新申请生成新单。
- REQ-ADMIN-b22bfb0f46：主播信息：通过前仍为用户。
- REQ-ADMIN-c2230604a9：公会信息：本次申请目标公会及 ID。
- REQ-ADMIN-85e7025aaf：认证状态：待审核、已通过、已驳回；处理后为终态。
- REQ-ADMIN-4cb76d2a50：提交时间：公会初审通过并提交平台的时间。
- REQ-ADMIN-05ad0f9627：平台通过前无主播身份；驳回后可修改材料重新提交。
- REQ-ADMIN-c3bf91eafb：状态、主播和公会筛选取交集；详情 -> 核验材料并处理。

## 主播管理 · 审核详情

原型：`liveshow-proto/prototype/pages/admin/host/admin-host-review-detail.html`；视图：`admin-host-review-detail.html`。

执行角色：平台管理员；页面入口：审核详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-64724c65c0：平台管理员核验身份材料并完成主播认证终审。
- REQ-ADMIN-680859b13d：申请单 / 申请人：只读，与列表所选申请一致。
- REQ-ADMIN-187f8ad1a1：认证材料：证件、实名、年龄和公会初审信息，按申请保留快照。
- REQ-ADMIN-2db358b32f：审核结果：仅通过、驳回。
- REQ-ADMIN-1ab4b011f6：直播权限：通过时设置平台权限初始值。
- REQ-ADMIN-8d206c6d5c：公会管理权限：通过时设置公会是否可管理。
- REQ-ADMIN-ccf2d699d7：驳回原因：驳回时必填并通知申请人。
- REQ-ADMIN-1358d766db：通过后加入申请公会并获得主播身份；开播仍需满足账号、公会和双重权限。
- REQ-ADMIN-afa547b300：仅待审核可处理；确认 -> 固化结果并禁止重复提交。

## 主播管理 · 直播场次

原型：`liveshow-proto/prototype/pages/admin/host/admin-live-management.html`；视图：`admin-live-management.html`。

执行角色：平台管理员；页面入口：直播场次。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-833264a665：平台管理员查询直播中和已结束场次并巡查或处置。
- REQ-ADMIN-f11b2bff8c：直播场次 ID：每次开播唯一；主播直播间 ID 长期不变。
- REQ-ADMIN-a24b954c3f：房型：普通、密码、门票，取开播时快照。
- REQ-ADMIN-6bb057052f：观众人数：本场成功进入的去重真实用户数。
- REQ-ADMIN-dfb3a9c13a：消费金币：本场普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 返奖；虚拟金币不计。
- REQ-ADMIN-2e7eeca6eb：直播时长：已结束 = 结束时间 - 开播时间；直播中 = 当前时间 - 开播时间。
- REQ-ADMIN-c03494ac0b：收礼数量：成功赠送数量合计；连送逐个计数。
- REQ-ADMIN-ef61769222：主播收益：普通、定制、门票按实际消费；幸运礼物按礼物价值 × 配置比例；虚拟金币不计。
- REQ-ADMIN-989c02dc3d：结束后保留消息、消费、处置和收益，历史场次不可重开。
- REQ-ADMIN-c6091dc52a：查询 -> 条件取交集；警告 -> 直播继续；关播 -> 立即结束当前场次。
- REQ-PUB-9f9c24e0dd：统一展示直播中与已结束场次；消费金币为本场观众消费的金币。

## 主播管理 · 直播详情

原型：`liveshow-proto/prototype/pages/admin/host/admin-live-detail.html`；视图：`admin-live-detail.html`。

执行角色：平台管理员；页面入口：直播详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-67d394c183：平台管理员查看单场直播画面、场次数据和巡房记录并即时处置。
- REQ-ADMIN-457ec42261：场次信息：场次 ID、主播、房型、标题和时间取本场快照。
- REQ-ADMIN-fb4e916612：观众人数：本场进入直播间的去重用户数。
- REQ-ADMIN-a8a11a9a6e：金币收益：本场普通礼物、定制礼物和门票扣减金币 + 幸运礼物扣减金币 - 幸运礼物返还金币；虚拟金币不计。该字段是用户实际消费，不是主播结算收益。
- REQ-ADMIN-b4b3dd15ed：收礼数量：本场成功送出的礼物数量合计；门票不计。
- REQ-ADMIN-fb1f419db1：巡房记录：巡房人员、进入时间、问题、处置和备注。
- REQ-ADMIN-4e1780d175：直播状态：直播中、已结束；已结束只读。
- REQ-ADMIN-eecaab2cc9：警告不改状态；关播只结束本场；关闭直播权限在举报处置或主播权限中执行。
- REQ-ADMIN-97202a67f2：警告或关播 -> 填写原因并确认 -> 通知主播并留痕；已结束时无即时处置。
- REQ-PUB-9447412ee2：消费金币为本场观众消费的金币。

## 主播管理 · 巡房排班

原型：`liveshow-proto/prototype/pages/admin/host/admin-inspection-schedule.html`；视图：`admin-inspection-schedule.html`。

执行角色：平台管理员；页面入口：巡房排班。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-3e2941e4fb：平台管理员查询、启停巡房排班并查看排班人员。
- REQ-ADMIN-54cb188abf：排班编号：创建时生成，全局唯一。
- REQ-ADMIN-d1a3a93292：日期 / 时间段：平台统一时区；结束时间晚于开始时间。
- REQ-ADMIN-985b98612e：排班人数：有效巡房人员数量。
- REQ-ADMIN-32bdfdd785：状态：待生效、生效中、已停用、已结束；按时间和启停状态计算。
- REQ-ADMIN-67ef2b6b6c：仅有效排班或任务期间赋予巡房会话身份；可进入任意直播间，无需密码或门票。
- REQ-ADMIN-a90944f6fd：巡房会话不受主播黑名单和本场踢出限制，主播与房管不可对其拉黑或踢出。
- REQ-ADMIN-e66c600f47：保护仅限巡房会话，原有拉黑关系不变；平台封禁或巡房权限失效仍不可进入。
- REQ-ADMIN-546b981d22：停用 -> 不再生效；重新启用 -> 按当前时间重算状态。

## 主播管理 · 新建排班

原型：`liveshow-proto/prototype/pages/admin/host/admin-inspection-schedule-create.html`；视图：`admin-inspection-schedule-create.html`。

执行角色：平台管理员；页面入口：新建排班。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-636938fee1：平台管理员创建巡房日期、时间段和人员名单。
- REQ-ADMIN-5da9e5c9fd：日期：必填，不早于当前日期。
- REQ-ADMIN-4af40a4896：时间段：起止必填，结束晚于开始。
- REQ-ADMIN-d962300871：巡房人员：至少 1 个可用账号，不可重复。
- REQ-ADMIN-acea948e6d：巡房人员从用户端可用账号中选择；平台封禁账号不可加入。
- REQ-ADMIN-ff7a37f338：添加 -> 搜索并勾选；全选仅作用当前结果；保存 -> 创建排班并返回列表。

## 主播管理 · 排班详情

原型：`liveshow-proto/prototype/pages/admin/host/admin-inspection-schedule-detail.html`；视图：`admin-inspection-schedule-detail.html`。

执行角色：平台管理员；页面入口：排班详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-5c572e57a2：平台管理员只读查看排班时间、状态和人员。
- REQ-ADMIN-a2f3205ca8：排班信息：编号、日期、起止时间、人数、状态和创建时间取创建记录。
- REQ-ADMIN-b53e2fcba4：巡房人员：头像、昵称、用户 ID 和当前等级；人数 = 有效人员行数。
- REQ-ADMIN-19579ba2c0：人员账号后续封禁时不可巡房，但历史排班名单保留。
- REQ-ADMIN-5778541807：排班有效期间进入直播间后生成巡房会话；会话结束后不再享有拉黑、踢出、密码和门票豁免。

## 内容审核 · 内容审核

原型：`liveshow-proto/prototype/pages/admin/content/admin-content-audit.html`；视图：`admin-content-audit.html`。

执行角色：平台管理员；页面入口：内容审核。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-de5fd38a35：平台管理员处理自动审核产生的直播内容告警。
- REQ-ADMIN-80d962af95：审核单号：每条机审告警唯一。
- REQ-ADMIN-7e025d96f3：命中类型 / 风险等级：机审结果，仅供人工判断，不直接处罚。
- REQ-ADMIN-21693ea90e：告警截图：命中时证据快照。
- REQ-ADMIN-10c044f17e：审核状态：待处理、人工复审中、已忽略、已处置。
- REQ-ADMIN-ca49250757：处置结果：未处理为“-”；处理后为最终动作。
- REQ-ADMIN-ae7d559722：忽略表示误报；转人工复审保持处理中；其他动作按选择结果执行。
- REQ-ADMIN-6c996a07b6：快捷忽略 -> 完成告警；处理 -> 选择动作并填写原因 -> 更新状态和记录。

## 内容审核 · 内容审核详情

原型：`liveshow-proto/prototype/pages/admin/content/admin-content-audit-detail.html`；视图：`admin-content-audit-detail.html`。

执行角色：平台管理员；页面入口：内容审核详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-581b5d7983：平台管理员核对告警材料并提交人工复审结论。
- REQ-ADMIN-3006b9c547：基础信息：审核单、场次、主播、命中类型、风险和时间只读。
- REQ-ADMIN-6c03efa1ae：告警材料：机审截图或视频，处理后保留。
- REQ-ADMIN-17adb450ba：处置类型：转人工复审、忽略及页面提供的处置项。
- REQ-ADMIN-2612789dd5：处置原因：提交时必填，同时保存审核人和时间。
- REQ-ADMIN-4345fbe960：忽略不改变直播或账号；已忽略、已处置为终态，复审中可继续处理。
- REQ-ADMIN-1129203065：提交 -> 校验动作和原因 -> 执行并固化复审记录。

## 内容审核 · 账号违规

原型：`liveshow-proto/prototype/pages/admin/content/admin-account-violation.html`；视图：`admin-account-violation.html`。

执行角色：平台管理员；页面入口：账号违规。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-f470c47859：平台管理员查询用户或主播账号举报工单。
- REQ-ADMIN-5fc03be2d6：被举报账号：昵称、账号 ID 和类型。
- REQ-ADMIN-15794f29ef：举报类型：提交时快照；配置变更不改历史。
- REQ-ADMIN-bb219a817a：账号状态：当前正常或封禁。
- REQ-ADMIN-aa1ba75872：处理状态：待处理、已处理；每单只处理一次。
- REQ-ADMIN-86b9bd84a0：提交时间：工单生成时间。
- REQ-ADMIN-5a69e3e8f9：举报不直接改变账号；处置仅不处置或封禁。
- REQ-ADMIN-5b7235b3f7：查询 -> 条件取交集；查看 -> 进入详情处理或查看结果。
- REQ-PUB-02a55de5b8：筛选项读取“违规类型”配置；列表提供五类默认示例数据。
- REQ-PUB-859c13c892：仅保留待处理和已处理；每个工单只能提交一次处理结果。

## 内容审核 · 直播间违规

原型：`liveshow-proto/prototype/pages/admin/content/admin-report-handling.html`；视图：`admin-report-handling.html`。

执行角色：平台管理员；页面入口：直播间违规。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-7f0aabe44c：平台管理员查询直播场次举报工单。
- REQ-ADMIN-5605a63fc9：直播场次 ID：关联被举报的单次场次。
- REQ-ADMIN-0a257aa8c2：举报类型：提交时快照。
- REQ-ADMIN-549efdf548：直播状态：直播中、已结束。
- REQ-ADMIN-da25734087：处理状态：待处理、已处理、已作废。
- REQ-ADMIN-1c4a0a5a20：提交时间：用户在直播中提交举报的时间。
- REQ-ADMIN-5099e05f72：直播举报入口仅在直播中开放；待处理期间直播结束，工单自动作废。
- REQ-ADMIN-7bf6da1b28：查看 -> 进入详情；已处理或已作废只读。
- REQ-PUB-8eb56b3dff：筛选项读取“违规类型”配置。
- REQ-PUB-d681912ffe：直播举报仅在直播中生成；场次结束后，未处理举报作废，不继续处罚后续场次。
- REQ-PUB-169024b79c：直播举报仅在直播中生成；场次结束后，未处理举报作废，不继续处罚后续场次。

## 内容审核 · 举报详情

原型：`liveshow-proto/prototype/pages/admin/content/admin-report-detail.html`；视图：`admin-report-detail.html`。

执行角色：平台管理员；页面入口：举报详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-89b22d14be：平台管理员核对举报对象、说明和证据并提交一次性处置。
- REQ-ADMIN-e7c23b0a6f：举报对象：账号举报关联账号；直播举报关联场次和主播。
- REQ-ADMIN-d5208511ba：内容 / 证据：用户提交快照，处理后保留。
- REQ-ADMIN-5b75c765e8：处置类型：账号：不处置、封禁；直播：不处置、警告、关播、关闭直播权限。
- REQ-ADMIN-564f4b9a35：处置原因：执行处罚时必填并写入日志。
- REQ-ADMIN-99a64ef358：通知：按结果通知举报人；直播处罚同时通知主播。
- REQ-ADMIN-4bff9e969c：警告继续直播；关播只结束本场；关闭直播权限同时关播并阻止再开播。
- REQ-ADMIN-42f36ab588：封禁账号立即下线并结束直播；待处理直播工单在直播结束时自动失效，页面状态显示“已作废”。
- REQ-ADMIN-4139f87ec8：处理 -> 选择合法处置并填写原因 -> 执行、通知并置为已处理；终态不可重复提交。
- REQ-PUB-16a2c96bad：举报内容、证据和处理结果同页展示；已处理工单不可再次处理。
- REQ-PUB-e90f76e069：直播中可警告、关播或关闭直播权限；场次结束后未处理直播举报失效，不补关下一场直播。
- REQ-PUB-9c6b2eb32d：举报不成立只能不处置；举报成立后才能选择处罚。

## 内容审核 · 违规类型

原型：`liveshow-proto/prototype/pages/admin/content/admin-violation-types.html`；视图：`admin-violation-types.html`。

执行角色：平台管理员；页面入口：违规类型。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-424dae46e0：平台管理员维护用户举报入口和后台筛选共用的违规类型。
- REQ-ADMIN-06eb8e3ac0：类型 ID：系统生成，全局唯一。
- REQ-ADMIN-3a19b9e35a：排序：正整数，数值越小越靠前。
- REQ-ADMIN-bbc45809e6：多语言名称：列表中文，用户端按语言展示。
- REQ-ADMIN-451703ddd2：类型属性：系统预置、自定义；预置不可删除。
- REQ-ADMIN-1b4185f07d：状态：预置固定启用；自定义可启停。
- REQ-ADMIN-71cd3e4b92：停用或删除后不用于新举报，历史保留提交时名称。
- REQ-ADMIN-a47b04d2e5：上下移 -> 更新排序；删除自定义类型 -> 确认后移除；编辑 -> 进入详情。
- REQ-PUB-42e913d498：默认前三类不可删除，可修改名称和排序；状态固定启用，不可修改。
- REQ-PUB-7fac1011ba：自定义类型支持启用和禁用；禁用后不再用于新的举报。
- REQ-PUB-5efe486613：仅自定义类型可删除；删除后不再用于新举报，历史举报保留提交时的类型名称。

## 内容审核 · 违规类型编辑

原型：`liveshow-proto/prototype/pages/admin/content/admin-violation-type-detail.html`；视图：`admin-violation-type-detail.html`。

执行角色：平台管理员；页面入口：违规类型编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-e11c2587e5：违规类型中文名称最多 20 字；英文、印尼语和马来语名称各最多 50 字。（原型交互依据：prototype/pages/admin/content/admin-violation-type-detail.html）

- REQ-ADMIN-351fff565b：平台管理员新增或编辑违规类型。
- REQ-ADMIN-d3e6ec4386：类型 ID：新建系统生成，编辑只读。
- REQ-ADMIN-358c04fd2e：四语名称：中文、英语、印尼语、马来语均必填，同语言不可重复。
- REQ-ADMIN-0f946bf44a：排序：必填正整数。
- REQ-ADMIN-d879a799ee：类型属性：创建后不可切换预置 / 自定义。
- REQ-ADMIN-4ca4de1fa8：状态：预置固定启用，自定义可调。
- REQ-ADMIN-6748893fb6：保存 -> 校验四语、唯一性和排序 -> 用于新举报及筛选。
- REQ-PUB-3ed5538087：违规类型支持中文、英文、印尼语和马来语，四项均必填；中文名称不可重复。
- REQ-PUB-69035fe877：保存后用于用户举报入口和后台举报筛选。

## 公会管理 · 公会列表

原型：`liveshow-proto/prototype/pages/admin/guild/admin-guild-list.html`；视图：`admin-guild-list.html`。

执行角色：平台管理员；页面入口：公会列表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-c7023050f9：平台管理员查询、新建、启停或解散公会。
- REQ-ADMIN-b79236ba65：公会信息：全局唯一 ID、当前名称和 Logo。
- REQ-ADMIN-c21352528b：公会长：昵称和管理账号。
- REQ-ADMIN-9d21aab89e：主播人数：当前公会有效主播关系去重计数。
- REQ-ADMIN-bb4fd2148c：公会状态：启用、停用、已解散；已解散为终态。
- REQ-ADMIN-5ea00223b4：公会停用时，该公会所有管理账号均不能登录，但各账号自身状态不变。
- REQ-ADMIN-0b77d68d48：公会长账号停用时，仅该账号不能登录，不改变公会状态，也不影响主播。
- REQ-ADMIN-5af177d900：解散前须结清全部主播收益；解散后账号失效、关系解除、主播失去身份并停止开播。
- REQ-ADMIN-08534bb1d4：新建 -> 详情编辑态；启停或解散 -> 校验并确认 -> 更新状态和关联对象。
- REQ-PUB-1cd823ea50：公会停用后不可被搜索；公会长无法登录，旗下主播将退出公会并失去直播权限。
- REQ-PUB-d71693b4d2：未结收益为 0 后确认解散。

## 公会管理 · 公会详情

原型：`liveshow-proto/prototype/pages/admin/guild/admin-guild-detail.html`；视图：`admin-guild-detail.html`。

执行角色：平台管理员；页面入口：公会详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-4ef461e2a0：平台管理员查看或编辑公会资料、主播和公会长账号。
- REQ-ADMIN-e80f4db877：公会 ID：系统生成，创建后不可改。
- REQ-ADMIN-d13cbc8518：名称 / Logo / 简介：名称和 Logo 必填。
- REQ-ADMIN-7dd40db9fc：公会长 / 管理账号：新建必填；管理账号全局唯一。
- REQ-ADMIN-3d8dcd8ee2：公会长账号状态：启用、停用；与公会状态分别保存。
- REQ-ADMIN-b4ecd379e9：初始密码：仅新建必填；重置后立即生效。
- REQ-ADMIN-64f7845def：主播列表：仅展示当前公会的主播。
- REQ-ADMIN-d2cdb2e4a3：累计收益：旗下所有主播的收益汇总。
- REQ-ADMIN-b1d1539c08：公会仅管理本公会主播，平台权限优先。
- REQ-ADMIN-0f37342da8：登录须同时满足公会启用和管理账号自身启用。公会停用会拦截全部管理账号；公会长账号停用只拦截该账号。
- REQ-ADMIN-cabf72851d：公会状态与公会长账号状态分别操作；账号状态通过开关切换。
- REQ-ADMIN-836fdf6189：资料和管理账号分别保存；重置密码不改账号；解散 -> 未结收益为 0 后确认。
- REQ-PUB-16de884e24：公会停用后不可被搜索；公会长无法登录，旗下主播将退出公会并失去直播权限。
- REQ-PUB-c5ec2a0c42：仅展示当前公会的主播，不存在普通成员；直播权限显示正常或关闭，可进入主播详情。
- REQ-PUB-9264a7bbe6：统计该公会旗下所有主播的收益汇总。
- REQ-PUB-d76ebede0f：公会长账号状态与公会状态独立；停用仅禁止该账号登录公会端 APP，连续确认两次后生效。
- REQ-PUB-4c7c3b5e12：未结收益为 0 后确认解散。

## 礼物与道具 · 普通礼物

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-gift-list.html`；视图：`admin-gift-list.html`。

执行角色：平台管理员；页面入口：普通礼物。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-89b41a7fba：平台管理员查询、新增、编辑和上下架普通礼物。
- REQ-ADMIN-0daf46fee3：礼物 ID：全局唯一，创建后不可改。
- REQ-ADMIN-512a54dffd：四语名称：中文、英语、印尼语、马来语均必填。
- REQ-ADMIN-7f9a747012：单价：正整数金币，赠送扣减 = 单价 × 数量。
- REQ-ADMIN-2739f9ca0c：图标 / 特效：图标必填；特效按资源要求上传。
- REQ-ADMIN-6d07fcecc2：排序权重：整数，数值越大面板越靠前。
- REQ-ADMIN-f962fe5d6a：状态：上架、下架；普通礼物由平台手动切换。
- REQ-ADMIN-18035dbdde：主播收益 = 成功赠送实际消费金币；下架只阻止新赠送，历史消费和收益保留。
- REQ-ADMIN-94c7c6d110：保存 -> 校验必填、ID 和价格 -> 更新列表；上下架或删除 -> 确认后执行。

## 礼物与道具 · 礼物详情

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-gift-detail.html`；视图：`admin-gift-detail.html`。

执行角色：平台管理员；页面入口：礼物详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-1d2b85f630：平台管理员新增或编辑普通、定制礼物的名称、资源、价格和状态。
- REQ-ADMIN-206d15251e：礼物 ID：新建时唯一，编辑时只读。
- REQ-ADMIN-9ef6c11fee：四语名称：四项均必填，按客户端语言展示。
- REQ-ADMIN-5082a78976：图标 / 特效：图标必填；删除素材后保存前须重新上传必填资源。
- REQ-ADMIN-38f9e5f793：单价：正整数金币。
- REQ-ADMIN-72c51c5fad：排序权重：整数，数值越大越靠前。
- REQ-ADMIN-7ee497310f：生效时间：仅定制礼物必填，失效时间晚于生效时间。
- REQ-ADMIN-9a63cdc3a1：操作记录：保存操作类型、说明、操作人和时间。
- REQ-ADMIN-e136132ea1：定制礼物到时自动生效和失效，可提前下架；普通、定制收益均按实际消费金币 1:1 计入。
- REQ-ADMIN-e56fa487e5：保存 -> 校验字段和时间 -> 留在当前详情；删除 -> 确认后返回列表。
- REQ-PUB-446bdb25b3：礼物名称支持中文、英文、印尼语和马来语，四项均必填。

## 礼物与道具 · 定制礼物

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-custom-gift.html`；视图：`admin-custom-gift.html`。

执行角色：平台管理员；页面入口：定制礼物。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-a73cc51cac：平台管理员维护有投放期限的定制礼物。
- REQ-ADMIN-dd352a2d66：名称 / 单价 / 资源 / 排序：与礼物详情同口径。
- REQ-ADMIN-174f05ed78：生效 / 失效时间：均必填，失效晚于生效；状态按当前时间计算。
- REQ-ADMIN-72b34e0b29：上下架状态：未生效、上架中、已下架；提前下架覆盖自动排期。
- REQ-ADMIN-43db0d16c4：到生效时间自动上架，到失效时间自动下架；下架不改历史赠送快照。
- REQ-ADMIN-bb59572dd8：新增或编辑 -> 礼物详情；提前下架 -> 确认后停止新赠送。

## 礼物与道具 · 幸运礼物

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-lucky-gift-config.html`；视图：`admin-lucky-gift-config.html`。

执行角色：平台管理员；页面入口：幸运礼物。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-a8865e3906：平台管理员查询、上下架和维护幸运礼物开奖配置。
- REQ-ADMIN-f6bbe6340a：幸运礼物收益比例：全部幸运礼物共用；默认 1%，可配置 0% 至 100%。
- REQ-ADMIN-affaa26772：单次消耗：每次独立开奖先扣减的正整数金币。
- REQ-ADMIN-92b8af5260：开奖次数：单笔礼物包含的独立开奖次数，正整数。
- REQ-ADMIN-abccae72be：单价：单次消耗 × 开奖次数。
- REQ-ADMIN-873c4a546b：RTP：Σ（奖励金币 × 中奖概率）/ 单次消耗 × 100%；按概率配置实时计算，结果超过一位小数时向上取整至一位小数。
- REQ-ADMIN-784ea0203b：状态：单礼物上下架；功能总开关关闭时全部幸运礼物不可见。
- REQ-ADMIN-17419d7b6f：每次开奖独立；单次期望返还 = Σ（奖励金币 × 中奖概率），用户实际消费 = 礼物价值 - 实际返还。
- REQ-ADMIN-b0fdc78961：返还金币进入用户余额；主播收益 = 幸运礼物价值 × 赠送时收益比例，默认 1%，返还结果不影响主播收益。
- REQ-ADMIN-12e8e89348：收益记录保存赠送时的比例快照，修改比例不重算历史收益。
- REQ-ADMIN-f3356fd6f9：下架不影响已完成开奖、消费和结算记录。
- REQ-ADMIN-f4fc23a623：点击编辑 -> 比例可输入、按钮变为保存；保存 -> 校验 0% 至 100% -> 对保存后的新赠送生效。
- REQ-ADMIN-dfbf58272c：礼物编辑 -> 进入配置详情；上下架或删除 -> 确认后执行。

## 礼物与道具 · 幸运礼物编辑

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-lucky-gift-detail.html`；视图：`admin-lucky-gift-detail.html`。

执行角色：平台管理员；页面入口：幸运礼物编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-ff629f570a：平台管理员配置幸运礼物价格、开奖次数、奖励档位和概率。
- REQ-ADMIN-04d6e08412：礼物 ID / 四语名称 / 资源：ID 唯一；四语和图标必填。
- REQ-ADMIN-bb7db57270：单次消耗：每次开奖消耗的正整数金币。
- REQ-ADMIN-def453c6f9：开奖次数：正整数；礼物单价 = 单次消耗 × 开奖次数。
- REQ-ADMIN-913a016c2b：奖励金币：每档非负整数，可为 0；档位不可重复。
- REQ-ADMIN-35c78d549f：中奖概率：每档 0% 至 100%，全部档位合计必须等于 100%。
- REQ-ADMIN-305f1020f0：RTP：Σ（奖励金币 × 概率）/ 单次消耗 × 100%；结果超过一位小数时向上取整至一位小数，保存前自动校验。
- REQ-ADMIN-1f85f48511：用户实际消费 = 礼物价值 - 实际返还；该值用于用户资产核对，不作为当前主播收益公式。
- REQ-ADMIN-94e63922c0：主播收益使用幸运礼物列表页的全局比例，返奖不影响收益。
- REQ-ADMIN-e57cd32b00：概率合计非 100% 或 RTP 未验证时不得生效。
- REQ-ADMIN-234a0b0b5a：增删档位或修改概率 -> 实时重算 RTP；保存 -> 校验全部公式和必填项 -> 更新配置。
- REQ-PUB-ea1c0115d1：幸运礼物名称支持中文、英文、印尼语和马来语，四项均必填。
- REQ-PUB-1ea13f57a7：单价 = 开奖次数 × 单次消耗金币，由系统自动计算，不支持修改。
- REQ-PUB-dbdd332b03：单礼物独立开奖，返还期望为各奖励值乘各自概率之和；RTP 为返还期望除以单礼物消耗。批量购买的总期望和总消耗同时乘礼物数量，比例不额外除以数量。
- REQ-PUB-2b711f163c：中奖概率合计必须为 100%；RTP 由档位配置自动计算。

## 礼物与道具 · 道具配置

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-prop-list.html`；视图：`admin-prop-list.html`。

执行角色：平台管理员；页面入口：道具配置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-14156cd3cb：平台管理员按类型查询、新增、编辑和上下架道具。
- REQ-ADMIN-4402635424：自定义道具类型四语名称必填且不可重复。
  - 风险 Q-004：预置类型枚举。
- REQ-ADMIN-8adfebad28：道具 ID：全局唯一。
- REQ-ADMIN-175c3a85b1：道具名称：四语配置，按客户端语言展示。
- REQ-ADMIN-29eb1cdb20：图标 / 排序：图标必填；排序权重越大越靠前。
- REQ-ADMIN-f1c1fb8c45：状态：上架、下架。
- REQ-ADMIN-d4e65f30f8：下架停止新发放，已发放道具按原有效期继续使用；到期自动停止展示。
- REQ-ADMIN-a407cf113b：类型 Tab -> 切换列表；新增或编辑 -> 详情；删除自定义类型或道具 -> 校验引用后确认。
- REQ-PUB-fbfbcd3897：道具类型名称支持中文、英文、印尼语和马来语，四项均必填。
- REQ-PUB-b2c9244b9a：道具类型 Tab 分别展示对应类型的道具列表。
  - 风险 Q-004：预置类型枚举。
- REQ-PUB-5a7a8ce7b6：新增页默认带入当前 Tab 的道具类型，运营可修改。

## 礼物与道具 · 道具详情

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-prop-detail.html`；视图：`admin-prop-detail.html`。

执行角色：平台管理员；页面入口：道具详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-3c7b603e07：平台管理员新增或编辑道具名称、类型、资源和状态。
- REQ-ADMIN-e7c2fbbd7d：道具 ID：新建唯一，编辑只读。
- REQ-ADMIN-69947234e7：四语名称：全部必填。
- REQ-ADMIN-738a741c75：道具类型：选择有效预置或自定义类型。
- REQ-ADMIN-320b946cb7：图标 / 素材：均必填，符合对应资源格式。
- REQ-ADMIN-e0cacd0605：排序权重：整数，数值越大越靠前。
- REQ-ADMIN-240568faf6：状态：上架、下架；下架不使已发放道具提前失效。
- REQ-ADMIN-b6f188a772：操作记录：保存变更说明、操作人和时间。
- REQ-ADMIN-82231ae35b：保存 -> 校验字段和资源 -> 留在详情并追加操作记录。
- REQ-PUB-cb0ee65039：道具名称支持中文、英文、印尼语和马来语，四项均必填。

## 礼物与道具 · 购买份数配置

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-gift-send-count-rules.html`；视图：`admin-gift-send-count-rules.html`。

执行角色：平台管理员；页面入口：购买份数配置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-ece8678758：平台管理员维护礼物面板的可选赠送数量。
- REQ-ADMIN-05ef076b58：规则 ID：系统生成，全局唯一。
- REQ-ADMIN-8ad8085865：赠送数量：一条规则包含多个互不重复的正整数，按配置顺序展示。
- REQ-ADMIN-b207aa9406：默认数量：必须属于当前赠送数量列表。
- REQ-ADMIN-a22be6fd9a：适用礼物：每个礼物只能关联一条启用规则。
- REQ-ADMIN-8a4dad81df：状态：启用、停用。
- REQ-ADMIN-ae169969d3：停用后关联礼物默认仅支持 ×1，不影响已完成赠送。
- REQ-ADMIN-528c59d35f：启用 -> 校验礼物冲突；编辑 -> 进入详情。
- REQ-PUB-27475600eb：集中管理普通、定制和幸运礼物的赠送数量。
- REQ-PUB-a4c4a4e746：每个礼物只能关联一条启用规则。
- REQ-PUB-ba224a0d2c：规则停用后，关联礼物不再使用该规则。

## 礼物与道具 · 购买份数配置详情

原型：`liveshow-proto/prototype/pages/admin/gifts/admin-gift-send-count-rule-detail.html`；视图：`admin-gift-send-count-rule-detail.html`。

执行角色：平台管理员；页面入口：购买份数配置详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-d3840ac491：平台管理员新增或编辑赠送数量及适用礼物。
- REQ-ADMIN-1159c4c1c1：赠送数量：至少 1 个，均为互不重复的正整数，支持拖动排序。
- REQ-ADMIN-3256e2a43a：默认数量：从当前赠送数量列表中选择。
- REQ-ADMIN-413eda2d56：适用礼物：按礼物类型筛选和全选；至少 1 个；每个礼物只能关联一条启用规则。
- REQ-ADMIN-51c1ca47a3：状态：启用前执行冲突校验。
- REQ-ADMIN-3f219b96b0：添加、删除或拖动数量 -> 实时更新默认数量选项；保存 -> 校验数量、默认数量、礼物和启用冲突。
- REQ-PUB-6ebeacc102：按礼物类型切换列表，选择该规则实际适用的礼物；每个礼物只能关联一条启用规则。
- REQ-PUB-3686d6e21b：赠送数量须为互不重复的正整数；默认数量须属于数量列表；启用规则时校验礼物关联冲突。

## 运营配置 · 展位配置

原型：`liveshow-proto/prototype/pages/admin/operations/admin-placement-config.html`；视图：`admin-placement-config.html`。

执行角色：平台管理员；页面入口：展位配置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-4a6d47b4c7：平台管理员查询客户端展示位及投放计划。
- REQ-ADMIN-5f60bffb0f：展示位置：仅直播广场运营位、福利中心轮播位。
- REQ-ADMIN-ead651c3c5：展示素材：显示当前配置内的轮播素材数量。
- REQ-ADMIN-d413ac4388：展示周期：按日期配置，开始日和结束日均包含。
- REQ-ADMIN-2467f873a1：状态：当前日期在展示周期内且配置启用时为展示，否则隐藏。
- REQ-ADMIN-4528ff76ab：同一展示位置的配置有效时间不得重叠；同一配置内的多项轮播内容共用排期、同时生效，不互相判定冲突。
- REQ-ADMIN-a3364b8d30：查询 -> 位置、周期和状态取交集；编辑 -> 详情；删除 -> 确认后停止投放。

## 运营配置 · 展示素材编辑

原型：`liveshow-proto/prototype/pages/admin/operations/admin-placement-detail.html`；视图：`admin-placement-detail.html`。

执行角色：平台管理员；页面入口：展示素材编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-3cc5316b4b：平台管理员配置展示位素材、跳转目标和展示周期。
- REQ-ADMIN-bc5dcc3cad：展示位置 / 状态：展示位置仅直播广场运营位、福利中心轮播位；状态关闭时不投放。
- REQ-ADMIN-6c3bc8ae0b：轮播内容：最少 1 项、最多 5 项；每项包含展示素材、跳转类型及对应目标内容，左侧序号即轮播顺序。
- REQ-ADMIN-fc14633413：展示素材：每项必传图片；点击已上传素材预览，删除后可重新上传。
- REQ-ADMIN-1576f270ce：跳转类型：APP 已有页面或活动长图页面。
- REQ-ADMIN-6bc6766177：目标内容：APP 页面须选择目标页面；活动长图页面须上传详情长图。
- REQ-ADMIN-54f61f4d76：展示周期：按日期配置，开始日和结束日均包含；同一配置内各项共用。
- REQ-ADMIN-4d431d0bd9：同一配置内允许多项内容同时生效，不判定排期冲突；不同配置按展示位置和展示周期校验冲突。
- REQ-ADMIN-4b8b98a165：保存后按当前序号轮播。删除已保存项须确认，新添加未保存项直接删除；只剩 1 项时禁止删除。
- REQ-ADMIN-5d4adf01cb：添加 -> 新增轮播行；拖动手柄 -> 调整顺序并更新序号。
- REQ-ADMIN-13b73aa3a7：切换跳转类型 -> 在目标页面选择器和活动长图上传间切换。
- REQ-ADMIN-86d44faaf9：保存 -> 逐行校验展示素材、跳转类型和目标内容，错误定位到对应行；通过后保留当前顺序。
- REQ-PUB-86486d9331：仅支持直播广场运营位、福利中心轮播位；两处均按配置顺序轮播。
- REQ-PUB-c2699f8b74：可跳转 APP 已有页面，或上传活动详情长图。
- REQ-PUB-66552e2139：按日期配置，开始日和结束日均包含。
- REQ-PUB-72f07ea6a9：APP 页面需选择目标页面；活动长图页面需上传详情长图。

## 运营配置 · 推送管理

原型：`liveshow-proto/prototype/pages/admin/operations/admin-push-management.html`；视图：`admin-push-management.html`。

执行角色：平台管理员；页面入口：推送管理。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-16c2bdf054：平台管理员查询、新建和查看推送任务。
- REQ-ADMIN-add8a54166：推送 ID / 标题：ID 唯一；列表标题按后台中文展示。
- REQ-ADMIN-3cb89e29cf：目标用户：全部用户或指定公会用户。
- REQ-ADMIN-5928582912：发送人数：实际成功发送的去重账号数。
- REQ-ADMIN-e8cf9e9a30：发送时间：计划时间；已发送后保留实际执行结果。
- REQ-ADMIN-825ea64998：已发送任务及发送结果只读。
- REQ-ADMIN-d3a4f9e0d0：查询 -> 内容、目标、状态和时间取交集；新建或待发送编辑 -> 详情。

## 运营配置 · 推送配置

原型：`liveshow-proto/prototype/pages/admin/operations/admin-push-detail.html`；视图：`admin-push-detail.html`。

执行角色：平台管理员；页面入口：推送配置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-2c06f628d2：推送中文标题最多 40 字，英文、印尼语、马来语标题各最多 80 字；中文正文最多 120 字，另外三语正文各最多 240 字。（原型交互依据：prototype/pages/admin/operations/admin-push-detail.html）

- REQ-ADMIN-1459bb74ef：平台管理员编辑推送文案和目标用户。
- REQ-ADMIN-2618b4914c：推送 ID：新建系统生成，已存在只读。
- REQ-ADMIN-c5743bedf5：四语标题 / 内容：中文、英语、印尼语、马来语均必填。
- REQ-ADMIN-b440ae96d0：目标用户：全部用户或一个有效公会用户范围。
- REQ-ADMIN-63d7d7cbd9：操作信息：记录最后操作人。
- REQ-ADMIN-6d9b07aef7：立即发送 -> 校验四语和目标用户 -> 模拟发送成功，状态变为已发送，当前页只读。
- REQ-PUB-e2f525ec4d：推送标题和正文支持中文、英文、印尼语和马来语，四项均必填。
- REQ-PUB-54a3ce6dd5：提交后立即向目标用户发送推送，状态变为已发送，当前页转为只读。原型仅模拟发送结果。

## 运营配置 · 充值套餐

原型：`liveshow-proto/prototype/pages/admin/operations/admin-recharge-package.html`；视图：`admin-recharge-package.html`。

执行角色：平台管理员；页面入口：充值套餐。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-dc70061538：平台管理员查询、新增、编辑和上下架充值套餐。
- REQ-ADMIN-f7854e3659：套餐类型：常规长期展示；活动按有效期展示。
- REQ-ADMIN-6806eed58a：销售价格：大于 0 的 USD 金额。
- REQ-ADMIN-74c82fd8d3：充值 / 赠送金币：基础金币大于 0，赠送金币不小于 0；到账 = 两者之和。
- REQ-ADMIN-c6c4573480：单用户限购：非负整数；0 表示不限。
- REQ-ADMIN-73a3556516：排序 / 状态：权重越大越靠前；下架后不可新购。
- REQ-ADMIN-9df5e9953f：配置变更不追溯已完成充值订单。
- REQ-ADMIN-e04e776dae：编辑 -> 详情；上下架或删除 -> 确认后仅影响后续购买。
- REQ-PUB-b3668e1e3a：套餐分为常规套餐和活动套餐。
- REQ-PUB-78b2fafa1a：限购次数按每位用户累计购买次数计算，0 表示不限购。

## 运营配置 · 充值套餐编辑

原型：`liveshow-proto/prototype/pages/admin/operations/admin-recharge-package-detail.html`；视图：`admin-recharge-package-detail.html`。

执行角色：平台管理员；页面入口：充值套餐编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-03b9df7690：平台管理员配置充值套餐价格、金币、封面和活动期限。
- REQ-ADMIN-85f546b445：套餐 ID：新建唯一，编辑只读。
- REQ-ADMIN-f5c0665f17：类型 / 封面：类型必选，封面必传。
- REQ-ADMIN-9efa98e5e6：销售价格：大于 0，最多两位小数，USD。
- REQ-ADMIN-d847d02c6e：充值 / 赠送金币：正整数 / 非负整数；到账金币 = 充值金币 + 赠送金币。
- REQ-ADMIN-dd484cf1a1：限购次数：活动套餐必填非负整数，0 为不限；用户每笔支付成功订单占用 1 次。
- REQ-ADMIN-9ee54399d9：有效时间：活动套餐必填，结束晚于开始。
- REQ-ADMIN-10d1dfd825：排序 / 状态：排序为整数；上架后按类型和有效期展示。
- REQ-ADMIN-c765deabe8：活动套餐订单支付成功后占用限购次数；后续发生全额退款时不恢复，防止用户反复购买、退款并重复获得活动资格。
- REQ-ADMIN-69b0e8e8e1：切换活动套餐 -> 显示并要求限购、有效时间；保存 -> 校验后更新。
- REQ-PUB-92d6404e00：套餐必须上传封面；活动套餐需配置有效期限。

## 运营配置 · 任务配置

原型：`liveshow-proto/prototype/pages/admin/operations/admin-task-config.html`；视图：`admin-task-config.html`。

执行角色：平台管理员；页面入口：任务配置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-45a60cd422：平台管理员查询、启停和维护客户端任务。
- REQ-ADMIN-37eb7d9d45：任务 ID / 名称：ID 唯一；名称按四语配置。
- REQ-ADMIN-06cc85f9a9：用户动作：登录、观看、赠礼、分享、邀请等系统预置动作。
- REQ-ADMIN-547c614cbb：生效时间：当前时间处于起止范围且状态启用时生效。
- REQ-ADMIN-6020d1207f：状态：启用、停用；停用后不产生新进度。
- REQ-ADMIN-d4cceec962：动作和指标由系统预置；本期奖励仅金币且由用户手动领取。
- REQ-ADMIN-c3b6d3d3ca：新增或编辑 -> 详情；启停 -> 确认后影响后续进度，不回收已领奖励。
- REQ-PUB-0b4fe8efe8：后台配置用户动作、达成条件和金币奖励的关系。
- REQ-PUB-b3946d1525：签到和邀请拉新不再独立配置，统一纳入任务配置。

## 运营配置 · 通用任务编辑

原型：`liveshow-proto/prototype/pages/admin/operations/admin-task-detail.html`；视图：`admin-task-detail.html`。

执行角色：平台管理员；页面入口：通用任务编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-c3e23a0fe9：平台管理员配置任务动作、指标、周期、阈值和金币奖励。
- REQ-ADMIN-e9ffe4d454：四语名称：全部必填。
- REQ-ADMIN-39e3514de9：生效时间：起止必填，结束晚于开始。
- REQ-ADMIN-da27cade58：用户动作 / 指标：指标随动作联动，只能选择系统预置组合。
- REQ-ADMIN-86741e5cf0：统计周期：仅展示该指标支持的每日、每周、每月或任务期累计。
- REQ-ADMIN-9bea90089e：达成条件：至少 1 条；同任务阈值互不重复且为正数。
- REQ-ADMIN-fe27b5660a：达成奖励：正整数金币；每个阈值独立可领取一次。
- REQ-ADMIN-40fca8e276：周期开始时周期型进度归零；任务期累计不归零；仅金币奖励且手动领取。
- REQ-ADMIN-f1bf6ea7f4：切换动作 -> 重置可选指标和周期；保存 -> 校验条件、阈值、奖励和时间。
- REQ-PUB-f33bf6913f：任务名称支持中文、英文、印尼语和马来语，四项均必填。
- REQ-PUB-de3f6f59f7：选择用户动作后，只能从该动作的固定条件中选择。
- REQ-PUB-ad67ae8cf6：每个条件配置金币数量，奖励由用户手动领取。

## 运营配置 · 公会推荐

原型：`liveshow-proto/prototype/pages/admin/operations/admin-guild-recommendation.html`；视图：`admin-guild-recommendation.html`。

执行角色：平台管理员；页面入口：公会推荐。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-1db87f4469：平台管理员维护客户端公会推荐顺序。
- REQ-ADMIN-d6b8afef81：公会信息：仅有效公会；同一公会只能配置一次。
- REQ-ADMIN-10e367514b：排序权重：正整数，数值越大越靠前。
- REQ-ADMIN-218dbbf2fd：更新时间：最近保存时间。
- REQ-ADMIN-24924b04a3：移除推荐不改变公会状态。
- REQ-ADMIN-1c78deb231：新增或编辑 -> 详情；移除 -> 确认后退出推荐。
- REQ-PUB-8599d30581：权重越大，推荐顺序越靠前。
- REQ-PUB-0cb04c96dc：推荐公会支持新增和移除。

## 运营配置 · 公会推荐编辑

原型：`liveshow-proto/prototype/pages/admin/operations/admin-guild-recommendation-detail.html`；视图：`admin-guild-recommendation-detail.html`。

执行角色：平台管理员；页面入口：公会推荐编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-91567974f0：平台管理员选择公会并设置推荐权重。
- REQ-ADMIN-c8dc2e5952：推荐公会：必选有效且未配置的公会；编辑时不可重复。
- REQ-ADMIN-d9f26cd09e：排序权重：必填正整数；相同权重按最近更新时间倒序。
- REQ-ADMIN-0c0a51dd50：保存 -> 校验公会有效性和重复配置 -> 更新推荐列表。

## 运营配置 · 等级配置

原型：`liveshow-proto/prototype/pages/admin/operations/admin-level-config.html`；视图：`admin-level-config.html`。

执行角色：平台管理员；页面入口：等级配置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-bfb51a566b：主播等级：等级、收益数值（金币）、勋章图。
- REQ-ADMIN-dae28464fc：财富等级：等级、送礼贡献（金币）、勋章图。
- REQ-ADMIN-85316c28c6：粉丝等级：等级、对主播送礼贡献（金币）、勋章图。
- REQ-ADMIN-72559deebb：粉丝团等级：等级、粉丝团累计收礼（金币）、勋章图。
- REQ-ADMIN-e6cb7a8740：四个 Tab 独立维护配置；切换时保留当前页未保存的输入。
- REQ-ADMIN-8a33014677：新增等级后填写数值；等级为不重复的正整数，数值必填且不小于 0。保存仅提交当前 Tab，成功后留在当前页。
- REQ-ADMIN-668d55ec8d：每行可上传或更换勋章图，选择有效图片后显示预览；切换 Tab 保留已选图片。图片无法读取时提示重选。
- REQ-ADMIN-7ebac29aa9：保存当前 Tab 的等级、金币数值和勋章图；原型仅在当前页预览，不实际上传或持久化，不触发用户等级变更。
- REQ-ADMIN-e7ea3bc8a5：本条业务决定见Q-003、Q-035、Q-036，不提供确定预期。
  - 风险 Q-003：等级成长、判级或追溯决定；风险 Q-035：等级成长、判级或追溯决定；风险 Q-036：等级成长、判级或追溯决定。

## 运营配置 · 直播类型

原型：`liveshow-proto/prototype/pages/admin/operations/admin-live-type.html`；视图：`admin-live-type.html`。

执行角色：平台管理员；页面入口：直播类型。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-8b1dfb52b6：直播类型中文名称最多 20 字；英文、印尼语和马来语名称各最多 40 字。（原型交互依据：prototype/pages/admin/operations/admin-live-type.html）

- REQ-ADMIN-874c7689d0：平台管理员维护主播开播时可选的直播类型。
- REQ-ADMIN-f8058197ad：类型 ID：系统生成，全局唯一。
- REQ-ADMIN-ec34b42500：四语名称：全部必填，同语言不可重复。
- REQ-ADMIN-3ec2e57a0e：状态：启用、停用；停用后不可用于新开播。
- REQ-ADMIN-444460953e：停用或删除不改变进行中和历史场次的类型快照。
- REQ-ADMIN-aaf129cc6e：新建或编辑 -> 保存四语和状态；删除 -> 无新场次引用后确认。
- REQ-PUB-f3e06096b1：直播类型名称支持中文、英文、印尼语和马来语，四项均必填。

## 运营配置 · 直播房型

原型：`liveshow-proto/prototype/pages/admin/operations/admin-feature-switch.html`；视图：`admin-feature-switch.html`。

执行角色：平台管理员；页面入口：直播房型。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-f1d1218c8c：平台管理员查看和控制门票房、密码房等直播房型的开放状态。
- REQ-ADMIN-5e1f3cc0b5：房型名称：系统预置，不可新增或编辑。
- REQ-ADMIN-0f22b6bf47：当前状态：通过列表开关控制。
- REQ-ADMIN-fd88a0aa57：操作信息：最后操作人和修改时间。
- REQ-ADMIN-9a4834559c：关闭房型后主播不可新建对应场次，不改变已开始或历史场次。
- REQ-ADMIN-045e314f07：切换开关 -> 立即更新房型状态；门票房价格配置 -> 进入价格档位列表。
- REQ-PUB-195524a518：门票房可进入价格档位列表；其他房型仅通过列表开关控制。

## 运营配置 · 门票价格档位

原型：`liveshow-proto/prototype/pages/admin/operations/admin-ticket-price-level.html`；视图：`admin-ticket-price-level.html`。

执行角色：平台管理员；页面入口：门票价格档位。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-a99674e0be：平台管理员维护付费直播间可选门票价格。
- REQ-ADMIN-0f90b6880d：档位 ID：系统生成，全局唯一。
- REQ-ADMIN-6b6fefd78c：门票价格：正整数金币且不得重复。
- REQ-ADMIN-3f79f61625：状态：至少保留一个启用档位。
- REQ-ADMIN-20293e34e7：排序：正整数，数值越小越靠前。
- REQ-ADMIN-af3fc40401：停用后不可用于新场次，已开播场次沿用创建时价格；门票收益按实际支付金币 1:1 计入。
- REQ-ADMIN-be08427d7f：停用最后一个有效档位 -> 阻止并提示；编辑 -> 详情。
- REQ-PUB-7070b51d09：停用档位后，主播新开门票房时不再显示该价格；已开播场次价格不变。
- REQ-PUB-852db98c84：门票房至少保留一个启用档位，最后一个启用档位不能停用。

## 运营配置 · 门票价格档位编辑

原型：`liveshow-proto/prototype/pages/admin/operations/admin-ticket-price-level-detail.html`；视图：`admin-ticket-price-level-detail.html`。

执行角色：平台管理员；页面入口：门票价格档位编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-209c9f098d：平台管理员新增或编辑门票价格档位。
- REQ-ADMIN-b82deaf426：档位 ID：新建系统生成，编辑只读。
- REQ-ADMIN-d9f7bfa1f1：门票价格：必填正整数金币，全局不重复。
- REQ-ADMIN-6854c6d003：排序：必填正整数。
- REQ-ADMIN-742f1c79a8：启用状态：停用时须保证仍有其他启用档位。
- REQ-ADMIN-ecdc4fd876：保存 -> 校验价格唯一、排序和至少一个启用档位 -> 更新。
- REQ-PUB-2acff394de：门票价格必须为正整数且不能与已有档位重复。

## 运营配置 · 敏感词库

原型：`liveshow-proto/prototype/pages/admin/operations/admin-sensitive-words.html`；视图：`admin-sensitive-words.html`。

执行角色：平台管理员；页面入口：敏感词库。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-67f4d8e95c：平台管理员查询、导入和维护敏感词。
- REQ-ADMIN-9a3155202e：敏感词 / 分类：词条内容和违法违规、辱骂攻击、广告引流等分类。
- REQ-ADMIN-5bdd8a7887：使用场景：公屏、私信、昵称、动态，可多选。
- REQ-ADMIN-5592f48a51：匹配规则：包含匹配或精确匹配。
- REQ-ADMIN-e9a5ee9690：替换内容：命中后用于替换展示。
- REQ-ADMIN-d46359a3f0：状态：启用、停用；停用后不拦截新内容。
- REQ-ADMIN-7e8f8f2504：删除不影响历史命中和处置记录。
- REQ-ADMIN-cb767f8d22：导入 -> 校验必填和重复词；启停或删除 -> 更新后续审核规则。

## 运营配置 · 敏感词编辑

原型：`liveshow-proto/prototype/pages/admin/operations/admin-sensitive-words-detail.html`；视图：`admin-sensitive-words-detail.html`。

执行角色：平台管理员；页面入口：敏感词编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-2773181d58：平台管理员新增或编辑敏感词规则。
- REQ-ADMIN-d6f319f352：词条 ID：新建系统生成，编辑只读。
- REQ-ADMIN-69272fc1db：敏感词 / 分类：必填；同匹配规则下词条不可重复。
- REQ-ADMIN-96597e760d：匹配规则：包含匹配或精确匹配。
- REQ-ADMIN-e948fe9728：使用场景：至少选择 1 个。
- REQ-ADMIN-57c8d33ba3：替换内容：必填。
- REQ-ADMIN-92183483f8：启用状态：启用后用于新内容检测。
- REQ-ADMIN-70e8febea3：保存 -> 校验重复词、场景和替换内容 -> 更新规则。

## 财务结算 · 充值订单

原型：`liveshow-proto/prototype/pages/admin/orders/admin-recharge-order.html`；视图：`admin-recharge-order.html`。

执行角色：平台管理员；页面入口：充值订单。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-2b7eb3b1f9：平台管理员查询和导出充值订单，并进入详情核对到账或退款。
- REQ-ADMIN-edadc771b1：订单号 / 渠道交易号：平台订单号全局唯一；渠道号用于渠道对账。
- REQ-ADMIN-1f328d6d45：充值金额：支付成功订单实付 USD 金额。
- REQ-ADMIN-30afe3b18b：基础 / 赠送金币：套餐购买金币 / 活动赠送金币。
- REQ-ADMIN-ad7265c50c：到账金币：基础金币 + 赠送金币。
- REQ-ADMIN-0b41433c53：状态：充值成功、已退款；失败订单不发金币。
- REQ-ADMIN-fe0a2ae8e4：成功时间：支付成功并完成金币入账的时间。
- REQ-ADMIN-b2205efc13：只有充值订单支持管理员主动退款或支付渠道退款；礼物和门票消费不退款。
- REQ-ADMIN-ccf4063143：查询 -> 条件取交集；导出 -> 当前结果；详情 -> 核对支付、到账和退款。

## 财务结算 · 充值订单详情

原型：`liveshow-proto/prototype/pages/admin/orders/admin-recharge-order-detail.html`；视图：`admin-recharge-order-detail.html`。

执行角色：平台管理员；页面入口：充值订单详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-91807a8a4d：平台管理员核对单笔充值的用户、套餐、支付、到账和退款信息。
- REQ-ADMIN-9f5e2d8eb1：订单 / 渠道信息：订单号、渠道交易号、支付渠道和时间只读。
- REQ-ADMIN-ff396b8c97：订单金额 / 实付金额：套餐标价 / 渠道实际支付金额，USD。
- REQ-ADMIN-506b3cbbc6：总到账金币：充值金币 + 赠送金币。
- REQ-ADMIN-e442fdfe65：退款金额：仅整单全额退款，等于原实付金额。
- REQ-ADMIN-88b1f2488d：扣回金币：原订单充值金币 + 赠送金币。
- REQ-ADMIN-2e2bea1931：退款记录：退款单号、主动或被动类型、渠道、原因、操作人和时间。
- REQ-ADMIN-c9a7f813d3：仅支付成功且未退款的订单可退，不支持部分或重复退款。
- REQ-ADMIN-5e93a998fd：退款后余额 = 退款前余额 - 原订单总到账金币，可为负；后续充值余额 = 原余额 + 新到账金币。
- REQ-ADMIN-d44cebfe28：退款不撤销已完成礼物或门票消费，不回滚主播收益和分成。
- REQ-ADMIN-d13e760fe0：手动退款 -> 填写原因并确认 -> 原渠道全额退款、扣回金币并生成退款单。

## 财务结算 · 消费订单

原型：`liveshow-proto/prototype/pages/admin/orders/admin-consumption-order.html`；视图：`admin-consumption-order.html`。

执行角色：平台管理员；页面入口：消费订单。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-e72652f44a：平台管理员查询和导出礼物、门票金币消费订单。
- REQ-ADMIN-7ba6fffc05：消费类型：普通礼物、定制礼物、幸运礼物、门票。
- REQ-ADMIN-b6da701ffc：数量：成功购买或赠送份数；连送逐个计数。
- REQ-ADMIN-a8e002f735：消费金币：订单扣减金币 = 商品单价 × 数量；幸运礼物返奖另记收入流水。
- REQ-ADMIN-0c83df21f4：用户净消耗：幸运礼物 = 订单扣减金币 - 实际返奖；其他类型 = 订单扣减金币。
- REQ-ADMIN-1533111695：状态：已支付；消费订单不产生退款状态。
- REQ-ADMIN-7a35cd607b：主播信息：礼物接收或门票所属主播。
- REQ-ADMIN-8c372b61b1：消费成功只扣减一次；余额不足或条件失败不生成成功订单。
- REQ-ADMIN-405cfd93d9：消费订单不支持退款，充值退款也不撤销已完成消费。
- REQ-ADMIN-17103282dc：查询 -> 条件取交集；导出 -> 当前结果；详情 -> 进入只读订单。
- REQ-PUB-3bff5df7d1：消费主播/ID 展示礼物或门票对应的主播，并支持按主播 ID 或昵称查询。

## 财务结算 · 消费订单详情

原型：`liveshow-proto/prototype/pages/admin/orders/admin-consumption-order-detail.html`；视图：`admin-consumption-order-detail.html`。

执行角色：平台管理员；页面入口：消费订单详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-8870c91421：平台管理员只读核对单笔消费、直播场次和主播收益归属。
- REQ-ADMIN-2cd1a8dfd1：商品 / 数量 / 单价：取消费发生时商品快照。
- REQ-ADMIN-358ec15ee2：扣减金币：单价 × 数量。
- REQ-ADMIN-9a5233e633：幸运礼物返奖：每次独立开奖的实际返还金币合计，另记用户收入。
- REQ-ADMIN-edf6f1d0e4：用户净消耗：扣减金币 - 返奖金币。
- REQ-ADMIN-524bc1573c：主播收益：普通、定制、门票 = 扣减金币；幸运礼物 = 礼物价值 × 配置比例，默认 1%，返奖不影响。
- REQ-ADMIN-78e1b508b9：消费去向：主播、公会和直播场次 ID。
- REQ-ADMIN-78ec5f9b91：消费订单只读且不可退款；仅充值订单可退款。
- REQ-ADMIN-04310df16c：页面只读返回或查看关联对象；不得执行消费退款。
- REQ-PUB-9a6c6938df：已成功赠送的礼物和已购买的门票不支持退款；只有充值订单支持整单退款或拒付，既有消费及主播收益不撤销。
- REQ-PUB-bb149a4491：已成功赠送的礼物和已购买的门票不支持退款；只有充值订单支持整单退款或拒付，既有消费及主播收益不撤销。

## 财务结算 · 退款订单

原型：`liveshow-proto/prototype/pages/admin/orders/admin-refund-order.html`；视图：`admin-refund-order.html`。

执行角色：平台管理员；页面入口：退款订单。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-95059ae42f：平台管理员查询和导出充值主动退款及支付渠道退款记录。
- REQ-ADMIN-00abaec894：退款单号：退款完成时生成，全局唯一。
- REQ-ADMIN-117db8a37a：原充值订单：必须关联支付成功且未退款的充值订单。
- REQ-ADMIN-9b322629e8：类型：手动退款或被动退款；被动退款指支付渠道发起的退款。
- REQ-ADMIN-aa0722b730：退款金额：原充值订单实付金额，全额退款。
- REQ-ADMIN-9b6071a81a：状态 / 时间：仅记录已完成结果及完成时间。
- REQ-ADMIN-7ea2a7972a：扣回金币 = 原订单基础金币 + 赠送金币；余额不足可为负，后续充值先抵扣。
- REQ-ADMIN-cc13d67d6f：已完成消费、主播收益和分成不回滚。
- REQ-ADMIN-a5f7c3f8cd：查询 -> 条件取交集；导出 -> 当前结果；查看 -> 进入原充值订单详情。
- REQ-PUB-8bac699b44：展示已完成退款的充值订单；详情进入原充值订单。

## 财务结算 · 主播分成记录

原型：`liveshow-proto/prototype/pages/admin/finance/admin-settlement-record.html`；视图：`admin-settlement-record.html`。

执行角色：平台管理员；页面入口：主播分成记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-af0c0c266d：后台管理员可在上传对话框下载 CSV 模板；主播模板列为主播名称、主播ID、公会名称、公会ID、分成金额。（原型交互依据：prototype/assets/admin-settlement-upload-page.js）
- REQ-EXT-33b5d90c2d：上传时间筛选包含开始日和结束日；结束日早于开始日时不查询并提示结束日期不能早于开始日期；重置清空筛选并恢复全部记录。（原型交互依据：prototype/assets/admin-settlement-upload-page.js）
- REQ-EXT-50100fbceb：上传文件和非空备注均必填；选择文件后回显文件名，确认上传只进入预览；关闭预览不生成分成记录，点击确认导入才生成记录并锁定。（原型交互依据：prototype/assets/admin-settlement-upload-page.js）

- REQ-ADMIN-4b04c5d5c3：平台管理员上传和查询财务线下核算的主播分成结果。
- REQ-ADMIN-6c36a4fc19：分成备注：必填，最长 100 字。
- REQ-ADMIN-a4542bed19：主播人数：导入文件中有效且去重的主播明细行数。
- REQ-ADMIN-35f5d4ee21：分成总金额：Σ 主播分成明细金额，USD。
- REQ-ADMIN-b6a1275ff4：上传文件：XLSX、XLS 或 CSV，字段按模板校验。
- REQ-ADMIN-6189e23820：上传人 / 时间：当前后台账号和确认导入时间，系统记录。
- REQ-ADMIN-474f14ea36：系统不计算具体分成，不提供线上申请或审批；财务线下核算后上传。
- REQ-ADMIN-81c3caec63：导入成功后记录锁定，不可编辑或删除。
- REQ-ADMIN-41fef2540e：上传 -> 解析并预览人数、总额和明细 -> 确认导入 -> 生成锁定记录。
- REQ-PUB-c6f2afe930：上传时系统记录当前操作账号为分成人和上传人；上传后不支持修改或删除。

## 财务结算 · 主播分成记录详情

原型：`liveshow-proto/prototype/pages/admin/finance/admin-settlement-record-detail.html`；视图：`admin-settlement-record-detail.html`。

执行角色：平台管理员；页面入口：主播分成记录详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-4b09ec474c：平台管理员只读核对一批主播分成上传结果。
- REQ-ADMIN-c06bc3b156：批次信息：备注、记录 ID、上传人和上传时间取导入快照。
- REQ-ADMIN-585b32c713：主播人数：去重主播明细数。
- REQ-ADMIN-aeb2ff5f03：主播明细：主播、所属公会和分成金额。
- REQ-ADMIN-af2909093d：分成总金额：Σ 全部主播明细金额，必须与批次总额一致。
- REQ-ADMIN-4d4ab10c33：详情是线下核算结果快照，只读且不承担审批。
- REQ-PUB-8ab102bb63：分成总金额等于该批次主播明细分成金额合计。

## 财务结算 · 主播账户余额

原型：`liveshow-proto/prototype/pages/admin/finance/admin-host-account-balance.html`；视图：`admin-host-account-balance.html`。

执行角色：平台管理员；页面入口：主播账户余额。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-f0f5a274b2：主播账户查询支持主播名称或 ID、所属公会名称或 ID，两个条件取交集；重置清空条件并恢复全部账户及余额汇总。（原型交互依据：prototype/assets/admin-account-balance-page.js）

- REQ-ADMIN-4353d0edd1：平台管理员查询主播线下结算账户及筛选范围汇总。
- REQ-ADMIN-3e0e0746cf：账户余额：已上传分成入账 + 正向修正 - 负向修正，USD。
- REQ-ADMIN-1ef2c092a8：汇总卡：Σ 当前筛选结果的账户余额。
- REQ-ADMIN-82aea95d07：查询 -> 更新列表和余额汇总；点击余额或变更记录 -> 进入该主播流水。
- REQ-PUB-13f0f57d70：账号余额按当前列表结果汇总。
- REQ-PUB-7d10018fa5：账户余额为主播分成入账及修正后的当前金额；点击余额或“变更记录”进入该主播余额变更记录。

## 财务结算 · 余额变更记录

原型：`liveshow-proto/prototype/pages/admin/finance/admin-host-balance-change-record.html`；视图：`admin-host-balance-change-record.html`。

执行角色：平台管理员；页面入口：余额变更记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-326f46c810：余额变更备注最多 100 字；变更对话框点击取消、关闭或遮罩时不提交；查询按变更类型与包含首尾的变更日期共同过滤，结束时间早于开始时间时不查询。（原型交互依据：prototype/assets/admin-account-balance-page.js）

- REQ-ADMIN-f9de15a24a：平台管理员查询并修正单个主播账户余额。
- REQ-ADMIN-3041333119：变更类型：收益分成、分成修正。
- REQ-ADMIN-8835726a7e：变更金额：正数增加、负数扣减；不得为 0，最多两位小数。
- REQ-ADMIN-f03822c5e6：变更后余额：变更前余额 + 有符号变更金额。
- REQ-ADMIN-bf8e234c1f：备注：分成修正必填，最长 100 字。
- REQ-ADMIN-a75dc1ae70：操作信息：记录编号、操作人和时间系统生成。
- REQ-ADMIN-a8e4463544：负向修正绝对值不得超过当前余额，账户余额不得因手工修正为负。
- REQ-ADMIN-7f223e8c24：余额变更 -> 输入金额和原因 -> 校验 -> 生成不可修改的修正流水并更新余额。
- REQ-PUB-62301e9e0e：收益分成增加余额；分成修正输入正数时增加余额，输入负数时扣减余额。
- REQ-PUB-49aedb4824：变更金额不能为 0；输入负数时，其绝对值不得超过当前账户余额。

## 财务结算 · 公会分成记录

原型：`liveshow-proto/prototype/pages/admin/finance/admin-guild-settlement-record.html`；视图：`admin-guild-settlement-record.html`。

执行角色：平台管理员；页面入口：公会分成记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-57c13094bc：后台管理员可在上传对话框下载 CSV 模板；公会模板列为公会名称、公会ID、分成金额(USD)。（原型交互依据：prototype/assets/admin-settlement-upload-page.js）
- REQ-EXT-2f8cc4033d：上传时间筛选包含开始日和结束日；结束日早于开始日时不查询并提示结束日期不能早于开始日期；重置清空筛选并恢复全部记录。（原型交互依据：prototype/assets/admin-settlement-upload-page.js）
- REQ-EXT-6f44ada418：上传文件和非空备注均必填；选择文件后回显文件名，确认上传只进入预览；关闭预览不生成分成记录，点击确认导入才生成记录并锁定。（原型交互依据：prototype/assets/admin-settlement-upload-page.js）

- REQ-ADMIN-69e076fcf1：平台管理员上传和查询财务线下核算的公会分成结果。
- REQ-ADMIN-0aa73fea7d：分成备注：必填，最长 100 字。
- REQ-ADMIN-688754c70e：公会数量：导入文件中有效且去重的公会明细数。
- REQ-ADMIN-feee96dabb：分成总金额：Σ 公会分成明细金额，USD。
- REQ-ADMIN-2f3c3a3327：上传文件：XLSX、XLS 或 CSV，按模板校验。
- REQ-ADMIN-819ad4b593：上传人 / 时间：当前后台账号和确认导入时间。
- REQ-ADMIN-02a0a0855d：结果由财务线下核算；导入成功后锁定且不可编辑或删除。
- REQ-ADMIN-e6bb8f228b：公会解散前须完成名下主播收益结算。
- REQ-ADMIN-d3618c4663：上传 -> 预览公会数、总额和明细 -> 确认 -> 生成锁定记录。
- REQ-PUB-e2964e358b：上传时系统记录当前操作账号为分成人和上传人；上传后不支持修改或删除。

## 财务结算 · 公会分成记录详情

原型：`liveshow-proto/prototype/pages/admin/finance/admin-guild-settlement-record-detail.html`；视图：`admin-guild-settlement-record-detail.html`。

执行角色：平台管理员；页面入口：公会分成记录详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-02b28ddb2e：平台管理员只读核对一批公会分成上传结果。
- REQ-ADMIN-2ebaca75d6：批次信息：备注、记录 ID、上传人和上传时间取导入快照。
- REQ-ADMIN-1de494e4dc：公会数量：去重公会明细数。
- REQ-ADMIN-fb40a223d7：公会明细：公会名称、ID 和分成金额。
- REQ-ADMIN-dfbfc95334：分成总金额：Σ 全部公会明细金额，必须等于批次总额。
- REQ-ADMIN-aa142cbdce：详情只读，不承担线上审批。
- REQ-PUB-24385d19ac：汇总金额等于该批次公会明细分成金额合计。

## 财务结算 · 公会账户余额

原型：`liveshow-proto/prototype/pages/admin/finance/admin-guild-account-balance.html`；视图：`admin-guild-account-balance.html`。

执行角色：平台管理员；页面入口：公会账户余额。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-3d650b3a7d：公会账户查询支持公会名称或 ID；重置清空条件并恢复全部账户及余额汇总。（原型交互依据：prototype/assets/admin-account-balance-page.js）

- REQ-ADMIN-0b8f982933：平台管理员查询公会线下结算账户及筛选范围汇总。
- REQ-ADMIN-460a8cfa07：账户余额：已上传分成入账 + 正向修正 - 负向修正，USD。
- REQ-ADMIN-e9ee6aa9d7：汇总卡：Σ 当前筛选结果的账户余额。
- REQ-ADMIN-df3099d438：查询 -> 更新列表和汇总；点击行或余额 -> 进入公会变更流水。
- REQ-PUB-ca911c183d：账号余额按当前列表结果汇总。
- REQ-PUB-0049dbb4a4：账户余额为公会分成入账及修正后的当前金额；点击余额或“变更记录”进入该公会余额变更记录。

## 财务结算 · 余额变更记录

原型：`liveshow-proto/prototype/pages/admin/finance/admin-guild-balance-change-record.html`；视图：`admin-guild-balance-change-record.html`。

执行角色：平台管理员；页面入口：余额变更记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-5f176752ec：余额变更备注最多 100 字；变更对话框点击取消、关闭或遮罩时不提交；查询按变更类型与包含首尾的变更日期共同过滤，结束时间早于开始时间时不查询。（原型交互依据：prototype/assets/admin-account-balance-page.js）

- REQ-ADMIN-0685164aa4：平台管理员查询并修正单个公会账户余额。
- REQ-ADMIN-2f365cbc71：变更类型：收益分成、分成修正。
- REQ-ADMIN-aca4fc05e3：变更金额：正数增加、负数扣减；不得为 0，最多两位小数。
- REQ-ADMIN-4e59013d6f：变更后余额：变更前余额 + 有符号变更金额。
- REQ-ADMIN-b8b610f5cb：备注：分成修正必填。
- REQ-ADMIN-34c2834697：操作信息：记录编号、操作人和时间系统生成。
- REQ-ADMIN-fff8646eaf：负向修正不得超过当前余额。
- REQ-ADMIN-dd53c8d065：余额变更 -> 输入金额和原因 -> 校验 -> 生成不可修改流水并更新余额。
- REQ-PUB-9ff6085277：收益分成增加余额；分成修正输入正数时增加余额，输入负数时扣减余额。
- REQ-PUB-1944aede61：变更金额不能为 0；输入负数时，其绝对值不得超过当前账户余额。

## 数据报表 · 报表中心

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-report-center.html`；视图：`admin-report-center.html`。

执行角色：平台管理员；页面入口：报表中心。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-f9036d81dd：平台管理员从统一入口进入基础数据和财务对账报表。
- REQ-ADMIN-9897487259：基础数据：每日统计、用户活跃、主播活跃、直播互动、充值消费和充值用户分层。
- REQ-ADMIN-506a090882：财务对账：月度汇总、直播记录、主播业绩、礼物及订单明细。
- REQ-ADMIN-64351c41fb：仅展示当前角色有权查看的入口；报表权限同时控制查询和导出。
- REQ-ADMIN-6f608b7d44：报表提供数据口径，不在系统内计算具体分成或执行结算审批。
- REQ-ADMIN-8716d94285：点击入口 -> 进入对应报表。
- REQ-PUB-d78f593b03：仅展示当前后台角色有权查看的报表入口。
- REQ-PUB-a7bdab7268：包含基础数据和财务对账报表。

## 数据报表 · 数据概览

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-data-overview.html`；视图：`admin-data-overview.html`。

执行角色：平台管理员；页面入口：数据概览。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-EXT-b78082f166：后台管理员点击趋势图的数据点可读取该点对应日期、指标名称和值；本页查询按逐自然日趋势规则，不采用共享演示函数的单日分时刻标签作为需求。（原型交互依据：prototype/assets/admin-reporting.js）

- REQ-ADMIN-b06471f7af：平台管理员按日期范围查看核心指标汇总和每日趋势。
- REQ-ADMIN-15a8cded0e：活跃 / 新增用户：范围内各日打开 App（启动或从后台切回前台）的去重登录用户数之和 / 注册去重人数之和。
- REQ-ADMIN-5e10276d6e：总充值金额 / 人数：支付成功实付金额合计 / 各日充值去重人数之和。
- REQ-ADMIN-e6a95f1579：新用户充值金额：注册当日支付成功的新用户充值金额合计。
- REQ-ADMIN-f140779cdb：新用户 ARPU：新用户充值金额合计 / 新用户充值人数合计；分母为 0 时记 0。
- REQ-ADMIN-f3980d1894：达成有效天主播：各日累计有效直播不少于 3 小时的主播人次，每主播每天最多 1 次。
- REQ-ADMIN-f86ba03bd7：指标卡按日期范围汇总，趋势逐自然日展示；起止同日为单日。
- REQ-ADMIN-6f84088242：点击指标卡 -> 切换趋势；查询 -> 校验结束日期不早于开始日期后取数。
- REQ-PUB-2e854e5af8：选择一个指标后，按所选日期范围展示每日趋势；起止日期相同即单日查询。

## 数据报表 · 每日统计

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-daily-statistics.html`；视图：`admin-daily-statistics.html`。

执行角色：平台管理员；页面入口：每日统计。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-c88b18af59：平台管理员查看每日用户、充值、直播和退款指标。
- REQ-ADMIN-6b15f0748c：活跃 / 新增用户：当日打开 App（启动或从后台切回前台）的去重登录用户数 / 注册的去重用户数。
- REQ-ADMIN-7d52815e32：总充值金额 / 人数：当日支付成功实付金额合计 / 去重充值用户数。
- REQ-ADMIN-0729749d43：新用户充值人数 / 金额：当日注册且充值成功的去重人数 / 实付金额合计。
- REQ-ADMIN-8748cad193：新用户 ARPU：新用户充值金额 / 新用户充值人数；分母为 0 时记 0。
- REQ-ADMIN-c020c4b0d9：开播人数：当日成功开播的去重主播数。
- REQ-ADMIN-d85cd33985：达成有效天主播：当日累计有效直播不少于 3 小时的去重主播数。
- REQ-ADMIN-9b4d1ef084：开播时长中位数：有效场次时长升序中位值；偶数取中间两项平均，无数据记 0。
- REQ-ADMIN-0888939ecd：退款订单数 / 金额：当日完成的充值退款单数 / 退款金额合计。
- REQ-ADMIN-fd2f152f94：日期按平台统一自然日；主动退款和支付渠道退款均按完成日统计。
- REQ-ADMIN-2d1320c185：查询 -> 日期首尾均包含；导出 -> 当前筛选结果。
- REQ-PUB-cbe1fac8c9：新用户指统计日注册的用户；新用户 ARPU = 新用户充值金额 ÷ 新用户充值人数；退款订单数和退款金额按统计日汇总。

## 数据报表 · 用户活跃汇总（每日）

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-user-active-statistics.html`；视图：`admin-user-active-statistics.html`。

执行角色：平台管理员；页面入口：用户活跃汇总（每日）。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-503ce679c3：平台管理员查看每日登录用户的新老分层和付费规模。
- REQ-ADMIN-bf67d085a7：登录用户：当日至少成功登录 1 次的去重用户。
- REQ-ADMIN-66830cc2fd：新用户：登录用户中当日注册的去重用户。
- REQ-ADMIN-5eabd4d6ff：老用户：登录用户中统计日前已注册的去重用户；登录用户 = 新用户 + 老用户。
- REQ-ADMIN-747559f804：付费用户：当日至少 1 笔支付成功充值订单的去重用户。
- REQ-ADMIN-57c59cec45：汇总卡：各日指标求和，不做跨日再次去重。
- REQ-ADMIN-17f653e0b6：查询 -> 按自然日范围过滤；导出 -> 当前结果。

## 数据报表 · 主播活跃汇总（每日）

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-host-statistics.html`；视图：`admin-host-statistics.html`。

执行角色：平台管理员；页面入口：主播活跃汇总（每日）。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-2a1bdb654a：平台管理员查看每日主播认证、开播、有效天、连麦和违规数据。
- REQ-ADMIN-15ae8cbc7c：新增主播：当日平台认证通过的去重主播数。
- REQ-ADMIN-067d726ffd：开播人数 / 场次：成功开播的去重主播数 / 新建场次数。
- REQ-ADMIN-a8902997d7：开播率：开播人数 / 当日有效主播总数 × 100%；分母为 0 时记 0。
- REQ-ADMIN-8535e82da1：有效天达标人数：当日累计有效直播不少于 3 小时的去重主播数。
- REQ-ADMIN-2629af8516：开播时长中位数：有效场次时长中位值；偶数取中间两项平均。
- REQ-ADMIN-a793017709：连麦场次：至少发生 1 次有效连麦的去重场次数。
- REQ-ADMIN-8394054012：违规主播 / 场次：确认违规的去重主播数 / 去重场次数。
- REQ-ADMIN-f2ea82668f：查询 -> 更新每日明细和汇总；导出 -> 当前结果。

## 数据报表 · 直播间互动汇总（每日）

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-live-statistics.html`；视图：`admin-live-statistics.html`。

执行角色：平台管理员；页面入口：直播间互动汇总（每日）。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-8c813f97ba：平台管理员查看每日直播间观看和访问数据。
- REQ-ADMIN-4b7e00b0b3：观众人数：当日成功进入直播间的去重真实用户数。
- REQ-ADMIN-1995a7e1e3：观看时长：有效观看秒数合计 / 60，四舍五入到分钟。
- REQ-ADMIN-d6d67a59c2：人均观看时长：有效观看秒数 / 观众人数 / 60，四舍五入到分钟；分母为 0 时记 0。
- REQ-ADMIN-f5bf1ede6e：直播间访问率：观众人数 / 直播间访问次数 × 100%，保留 1 位小数；分母为 0 时记 0。
- REQ-ADMIN-3f1529d356：查询 -> 按自然日过滤；导出 -> 当前结果。

## 数据报表 · 直播记录明细报表

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-host-live-record-report.html`；视图：`admin-host-live-record-report.html`。

执行角色：平台管理员；页面入口：直播记录明细报表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-3718470075：平台管理员按开播时间和主播查询直播场次明细。
- REQ-ADMIN-efabdead6b：主播 / 直播间 ID：主播 ID 唯一；直播间 ID 长期归属主播。
- REQ-ADMIN-72ec779666：房型：本场创建时快照。
- REQ-ADMIN-d4babb5f6c：时长：结束时间 - 开播时间。
- REQ-ADMIN-5a087e0b2d：是否达标：主播该自然日累计有效直播不少于 3 小时，不按单场判断。
- REQ-ADMIN-024c3ef4c3：观众人数：本场成功进入的去重真实用户数。
- REQ-ADMIN-85778b3273：消费金币：本场普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 返奖；虚拟金币不计。
- REQ-ADMIN-1ca6ac70e1：每次开播一条场次；结束后保留消费、处置和收益。
- REQ-ADMIN-9e66cf88d7：查询 -> 以开播日期和主播 ID 过滤；导出 -> 当前结果。
- REQ-PUB-7302cac854：按开播时间和主播 ID 查询；消费金币为对应场次观众消费的金币。

## 数据报表 · 充值消费汇总（每日）

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-recharge-statistics.html`；视图：`admin-recharge-statistics.html`。

执行角色：平台管理员；页面入口：充值消费汇总（每日）。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-a3179b56a4：平台管理员查看每日充值、金币发行和消费汇总。
- REQ-ADMIN-0e1395bab2：总充值金额 / 人数 / 订单：支付成功实付金额合计 / 去重用户数 / 订单数。
- REQ-ADMIN-960385e465：客单价：总充值金额 / 充值人数；分母为 0 时记 0。
- REQ-ADMIN-dea3535561：充值金币：支付成功订单基础金币合计。
- REQ-ADMIN-e3552873b7：充值赠送 / 系统赠送金币：套餐赠送 / 签到、任务、活动等发放合计。
- REQ-ADMIN-d54b6d3472：消费金币：普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 返奖。
- REQ-ADMIN-a8ce7a5f6f：金币净增量：充值金币 + 充值赠送金币 + 系统赠送金币 - 消费金币。
- REQ-ADMIN-fcb943ec14：退款扣回金币按退款资产流水单列，不并入消费金币。
- REQ-ADMIN-9c7060cc8e：查询 -> 更新明细和汇总；导出 -> 当前结果。

## 数据报表 · 充值用户分层汇总（每日）

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-user-activity-statistics.html`；视图：`admin-user-activity-statistics.html`。

执行角色：平台管理员；页面入口：充值用户分层汇总（每日）。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-cf1d4372a5：平台管理员查看每日新老用户充值分层。
- REQ-ADMIN-52b505a5e9：总充值金额：新用户充值金额 + 老用户充值金额。
- REQ-ADMIN-b1c52cab3c：总充值人数：新用户充值人数 + 老用户充值人数。
- REQ-ADMIN-38cc89f0ea：新 / 老用户：当日注册 / 统计日前注册且当日充值成功的去重用户。
- REQ-ADMIN-b279d15ea0：新用户 ARPU：新用户充值金额 / 新用户充值人数；分母为 0 时记 0。
- REQ-ADMIN-b0533e7075：老用户 ARPU：老用户充值金额 / 老用户充值人数；分母为 0 时记 0。
- REQ-ADMIN-9687f829e8：查询 -> 按自然日过滤；导出 -> 当前结果。
- REQ-PUB-2236a52b33：新用户指统计日注册的用户；老用户指统计日前已注册的用户。总充值为新老用户有效充值金额之和，金额以 USD 显示。

## 数据报表 · 月度收益支出汇总

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-monthly-income-expense.html`；视图：`admin-monthly-income-expense.html`。

执行角色：平台管理员；页面入口：月度收益支出汇总。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-8bf01d7844：平台管理员按自然月核对收益、累计充值和累计退款。
- REQ-ADMIN-796ed74e4a：收益：当月普通、定制、幸运礼物和门票形成的主播收益金币合计。
- REQ-ADMIN-392c0570f2：累计充值：当月支付成功充值实付金额合计。
- REQ-ADMIN-79af0ac45f：累计退款：当月完成充值退款金额合计。
- REQ-ADMIN-b14a9d74bc：充值退款不撤销已完成消费和收益。
- REQ-ADMIN-f415c699c4：列表展示全部月份；导出 -> 当前结果。
- REQ-PUB-b7a19c2e12：按月份汇总收益、累计充值和累计退款，列表展示全部月份。

## 数据报表 · 主播业绩分成报表

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-monthly-host-share.html`；视图：`admin-monthly-host-share.html`。

执行角色：平台管理员；页面入口：主播业绩分成报表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-31010aa4cc：平台管理员按日期范围核对主播有效天、场次和各类收益。
- REQ-ADMIN-a4fc802e99：统计天数：结束日期 - 开始日期 + 1。
- REQ-ADMIN-9d59434ab0：达标天数：单日累计有效直播不少于 3 小时的自然日数，每日最多 1 天。
- REQ-ADMIN-8bd43fbe27：直播场次：范围内成功开播场次数。
- REQ-ADMIN-e1f12c27ac：普通 / 定制 / 门票收益：对应成功真实金币消费合计。
- REQ-ADMIN-6a41cbad67：幸运礼物收益：Σ（礼物价值 × 当时配置比例），默认 1%。
- REQ-ADMIN-bf76e90f70：主播收益：普通 + 定制 + 幸运 + 门票收益。
- REQ-ADMIN-cb293e6b92：虚拟金币、失败或撤销消费不计；报表不计算具体分成。
- REQ-ADMIN-f90f19baf9：查询 -> 按日期、主播或公会聚合；导出 -> 当前结果。
- REQ-PUB-4f6c419dc6：统计天数为所选日期所含天数；达标天数、直播场次和收益数据按该范围汇总。

## 数据报表 · 主播礼物打赏明细报表

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-monthly-host-earnings.html`；视图：`admin-monthly-host-earnings.html`。

执行角色：平台管理员；页面入口：主播礼物打赏明细报表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-6d65441519：平台管理员按主播和礼物核对打赏数量及主播收益。
- REQ-ADMIN-de6e8b6477：单价 / 份数：赠送时礼物单价快照 / 成功赠送数量合计。
- REQ-ADMIN-dcacc74719：普通 / 定制收益：单价 × 份数。
- REQ-ADMIN-458a3419fd：幸运礼物收益：单价 × 份数 × 赠送时配置比例，默认 1%；返奖不影响。
- REQ-ADMIN-18e02c0648：虚拟金币记录：不进入本报表。
- REQ-ADMIN-23619f6940：查询 -> 按日期、主播、礼物和类型聚合；导出 -> 当前结果。
- REQ-PUB-37517a9886：按主播和礼物汇总所选日期范围内的礼物打赏数量及主播收益。

## 数据报表 · 用户消费汇总报表

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-monthly-viewer-consumption.html`；视图：`admin-monthly-viewer-consumption.html`。

执行角色：平台管理员；页面入口：用户消费汇总报表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-8e47a4f1ac：平台管理员按用户核对各类真实金币净消耗。
- REQ-ADMIN-46c8d2bc34：普通 / 定制 / 门票：成功订单扣减金币合计。
- REQ-ADMIN-22f547bfa8：幸运礼物：订单扣减金币 - 实际返奖金币。
- REQ-ADMIN-e908ccb69a：累计消费：普通 + 定制 + 幸运礼物净消耗 + 门票。
- REQ-ADMIN-13ac5cd085：失败、撤销和虚拟金币不计；充值退款不回滚已完成消费。
- REQ-ADMIN-82d36a4a7b：查询 -> 按日期和用户聚合；导出 -> 当前结果。
- REQ-PUB-ac228bec7b：按用户汇总所选日期范围内的有效金币消费，已红冲消费不计；累计充值为用户账户累计金额，以美元展示。

## 数据报表 · 礼物消费汇总报表

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-monthly-gift-sales.html`；视图：`admin-monthly-gift-sales.html`。

执行角色：平台管理员；页面入口：礼物消费汇总报表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-c80541742f：平台管理员按礼物核对成功赠送数量和礼物价值。
- REQ-ADMIN-a77febf29d：单价：赠送时商品金币单价快照。
- REQ-ADMIN-9fcb2df291：销量：成功赠送份数合计。
- REQ-ADMIN-80aacf635d：销售额：Σ（单价 × 份数），表示礼物价值；幸运礼物不减返奖。
- REQ-ADMIN-776ed33bfb：仅真实金币成功消费，虚拟金币送礼不计。
- REQ-ADMIN-d284428520：查询 -> 按日期、礼物和类型聚合；导出 -> 当前结果。
- REQ-PUB-101943230a：打赏金额为礼物单价乘以所选日期范围内的有效销量；默认展示本月全部礼物。

## 数据报表 · 消费订单明细

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-consumption-order-detail-report.html`；视图：`admin-consumption-order-detail-report.html`。

执行角色：平台管理员；页面入口：消费订单明细。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-d5c04754b5：平台管理员查询真实金币消费订单明细。
- REQ-ADMIN-9167e65b78：礼物单价 / 份数：消费时单价快照 / 成功数量。
- REQ-ADMIN-1441285519：消费金币：单价 × 份数；幸运礼物返奖另记。
- REQ-ADMIN-12ce942b83：主播收益：普通、定制、门票 = 消费金币；幸运礼物 = 礼物价值 × 配置比例。
- REQ-ADMIN-2c2449128e：场次 ID：消费发生的直播场次。
- REQ-ADMIN-03a1284a17：只统计成功真实金币消费；消费订单只读且不可退款。
- REQ-ADMIN-09d47c2e11：查询 -> 时间和关键字取交集；导出 -> 当前结果。
- REQ-PUB-ecb705747a：默认展示当月有效消费订单，已红冲消费不计。

## 数据报表 · 退款订单明细

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-refund-order-detail-report.html`；视图：`admin-refund-order-detail-report.html`。

执行角色：平台管理员；页面入口：退款订单明细。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-4d54fb09ab：平台管理员查询已完成充值退款明细。
- REQ-ADMIN-8464049975：退款时间：主动退款或支付渠道退款的完成时间。
- REQ-ADMIN-d715a9199c：退款用户 / 商品：原充值订单用户和套餐。
- REQ-ADMIN-adcc5ca932：退款金额：原订单实付金额，全额退款，USD。
- REQ-ADMIN-fc50100bb1：仅充值退款，不包含礼物或门票消费退款。
- REQ-ADMIN-d4c3ce8523：查询 -> 时间和用户取交集；导出 -> 当前结果。
- REQ-PUB-77cd4ba193：仅展示已完成退款的订单。

## 数据报表 · 充值订单明细

原型：`liveshow-proto/prototype/pages/admin/analytics/admin-recharge-order-detail-report.html`；视图：`admin-recharge-order-detail-report.html`。

执行角色：平台管理员；页面入口：充值订单明细。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-045469740f：平台管理员查询支付成功的充值订单明细。
- REQ-ADMIN-13eb93f2ef：充值时间：支付成功时间。
- REQ-ADMIN-9e1139faa0：充值用户 / 套餐：原订单用户和套餐快照。
- REQ-ADMIN-578d8abfa2：支付渠道：实际完成支付的渠道。
- REQ-ADMIN-59c792e1bb：充值金额：实付金额，USD。
- REQ-ADMIN-c80d3f06d8：仅支付成功订单；退款在退款报表单列。
- REQ-ADMIN-6b0925b7ba：查询 -> 时间和用户取交集；导出 -> 当前结果。
- REQ-PUB-62cd658634：仅展示已支付成功的充值订单，并展示购买的充值套餐名称。

## 运营账号 · 账号列表

原型：`liveshow-proto/prototype/pages/admin/accounts/admin-operation-accounts.html`；视图：`admin-operation-accounts.html`。

执行角色：平台管理员；页面入口：账号列表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-3d759d3652：平台管理员查询公会创建的运营账号，并执行平台允许的启停或权限锁定。
- REQ-ADMIN-9cba81ed0c：运营账号 / 公会：账号由所属公会创建，登录账号全局唯一。
- REQ-ADMIN-b45101cb76：累计 / 本月消费：虚拟金币成功送礼消耗合计 / 当月合计。
- REQ-ADMIN-f25da2b9ee：账户余额：虚拟金币发放合计 - 虚拟金币消费合计。
- REQ-ADMIN-c79bed2fe1：本月发放：当月公会发放虚拟金币合计。
- REQ-ADMIN-86cefdb542：状态：启用、停用；平台可启停并锁定公会管理权限。
- REQ-ADMIN-aa29347b07：运营账号没有真实金币，只有虚拟金币；虚拟金币只能由所属公会发放，不能通过充值或任务获得。平台不创建、不分配运营账号，也不发放虚拟金币。
- REQ-ADMIN-ff60611cd3：运营账号可发送普通、定制礼物和消息，不可发送幸运礼物；虚拟金币仅计氛围和榜单，不产生主播收益或公会分成。
- REQ-ADMIN-61a98e5f2e：查询 -> 条件取交集；详情 -> 查看账号、发放和送礼记录。
- REQ-PUB-7206d8b13a：运营账号由公会创建，不对应真实用户；平台仅查看并控制启用状态。
- REQ-PUB-2523dce8af：头像、名称、数字账号、所属公会、累计消费、账户余额、本月发放、本月消费、账号状态。
- REQ-PUB-2ec9bdf681：列表仅保留详情，重置密码在账号主页操作。

## 运营账号 · 运营账号主页

原型：`liveshow-proto/prototype/pages/admin/accounts/admin-operation-account-detail.html`；视图：`admin-operation-account-detail.html`。

执行角色：平台管理员；页面入口：运营账号主页。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-b5c0580ddd：平台管理员查看运营账号资料、虚拟金币发放和送礼记录。
- REQ-ADMIN-9fbe24b4a7：账号资料：头像、名称、登录账号和所属公会，由公会维护。
- REQ-ADMIN-ebbc9f8234：虚拟金币余额：Σ 发放金币 - Σ 成功消费金币。
- REQ-ADMIN-6b373b04d4：发放记录：发放后余额 = 发放前余额 + 发放金币。
- REQ-ADMIN-0f52047389：送礼记录：消费金币 = 礼物单价 × 数量。
- REQ-ADMIN-03087793cf：运营账号没有真实金币；虚拟金币只能由所属公会发放，不能充值或通过任务获得。
- REQ-ADMIN-bc38a3956e：账号可免票、免密码进入直播间，可发普通或定制礼物，不可发幸运礼物。
- REQ-ADMIN-fd038806ba：平台可启停运营账号及锁定或解除公会管理权限。
  - 风险 Q-005：资料编辑和重置密码。
- REQ-ADMIN-e8766f5ce9：切换 Tab -> 加载记录；平台启停或锁定 -> 确认后留痕。
- REQ-PUB-48e89dc13f：展示账号信息、账户余额、累计消费、本月发放和本月消费。
- REQ-PUB-7de0f8289e：平台可启停运营账号及锁定或解除公会管理权限。
  - 风险 Q-005：资料编辑和重置密码。
- REQ-PUB-0b81985753：通过发放记录和送礼记录两个页内标签，直接查看当前运营账号的数据。

## 运营账号 · 发放记录

原型：`liveshow-proto/prototype/pages/admin/accounts/admin-operation-issue-records.html`；视图：`admin-operation-issue-records.html`。

执行角色：平台管理员；页面入口：发放记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-6bd372044c：平台管理员只读查询公会向运营账号发放虚拟金币的记录。
- REQ-ADMIN-2e609afe12：发放金币：本次公会发放的正整数虚拟金币。
- REQ-ADMIN-c46ee0283f：发放后余额：发放前余额 + 发放金币。
- REQ-ADMIN-c752147d4c：操作人：实际执行发放的公会账号。
- REQ-ADMIN-e4f57be340：发放时间：发放成功时间，计入对应自然月额度。
- REQ-ADMIN-e38cbd621c：虚拟金币只能由所属公会发放，不能通过充值或任务获得；平台不执行发放。
- REQ-ADMIN-c2cc04f2d8：运营账号没有真实金币，虚拟金币与真实金币隔离且不可转换。
- REQ-ADMIN-384b85a33f：查询 -> 公会、账号和时间取交集。
- REQ-PUB-927ee934f1：支持按所属公会、运营账号名称或ID、日期范围查询。
- REQ-PUB-702989125d：运营账号、所属公会、发放前余额、发放金币、发放后余额、操作人、发放时间。

## 运营账号 · 送礼记录

原型：`liveshow-proto/prototype/pages/admin/accounts/admin-operation-gift-records.html`；视图：`admin-operation-gift-records.html`。

执行角色：平台管理员；页面入口：送礼记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-7ae7263cf0：平台管理员只读查询运营账号虚拟金币送礼记录。
- REQ-ADMIN-5b615b9795：礼物 / 主播：赠送时普通或定制礼物及接收主播快照。
- REQ-ADMIN-ac0a296b30：消费金币：礼物单价 × 赠送数量，从虚拟金币账户扣减。
- REQ-ADMIN-9ade660c97：赠送时间：成功扣减和送礼完成时间。
- REQ-ADMIN-aff61420a9：运营账号只能使用所属公会发放的虚拟金币赠送普通、定制礼物，不可赠送幸运礼物。
- REQ-ADMIN-be3ec7feae：虚拟送礼计入氛围和榜单，不计真实消费、主播收益或分成；页面中的幸运礼物示例不符合当前规则。
- REQ-ADMIN-5afa5041ca：查询 -> 公会、账号和时间取交集；详情 -> 查看完整快照。
- REQ-PUB-c5fc046dfe：支持按所属公会、运营账号和日期范围查询。
- REQ-PUB-2e6b9b1cf8：赠送时间、礼物名称、消费金币、礼物单价、礼物类型、赠送数量、主播名称、主播ID。

## 运营账号 · 额度限制

原型：`liveshow-proto/prototype/pages/admin/accounts/admin-operation-guild-controls.html`；视图：`admin-operation-guild-controls.html`。

执行角色：平台管理员；页面入口：额度限制。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-7c2fa9bdc0：平台管理员配置公会运营账号的月度虚拟金币额度。
- REQ-ADMIN-1f3d863409：单账号月度额度：单个运营账号自然月累计可获虚拟金币上限。
- REQ-ADMIN-d74f5495a3：公会月度额度：公会全部运营账号自然月累计发放上限。
- REQ-ADMIN-dfc5a03e9f：本月累计已发放：Σ 本月该公会成功发放金币。
- REQ-ADMIN-7781df07b0：账户余额累计：Σ 该公会全部运营账号当前虚拟金币余额。
- REQ-ADMIN-12780bf6a9：本月累计消费：Σ 本月虚拟金币成功送礼消费。
- REQ-ADMIN-eee93e14f1：本月剩余额度：max（公会月度额度 - 本月累计已发放，0）。
- REQ-ADMIN-4c0ad04178：额度只控制所属公会向运营账号发放的虚拟金币；运营账号不能通过充值或任务获得金币。
- REQ-ADMIN-7e1ab0a86b：公会总上限不得低于本月已发放；单账号上限不得低于本月单账号最高已发放，且不得高于公会总上限。
- REQ-ADMIN-00ba04135f：配置额度 -> 校验边界 -> 保存后限制公会后续发放。
- REQ-PUB-5768afc239：配置单月单账号发放上限和单月累计发放金币上限。
- REQ-PUB-ca7c5744db：显示本月累计已发放、账户余额累计、本月累计消费。
- REQ-PUB-903bddd2c7：支持按公会名称或ID查询。

## 系统配置 · 后台账号

原型：`liveshow-proto/prototype/pages/admin/system/admin-system-account.html`；视图：`admin-system-account.html`。

执行角色：超级管理员；页面入口：后台账号。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-4962ab0ca5：超级管理员查询、新建、编辑和启停后台账号。
- REQ-ADMIN-c86f258773：账号 ID：系统生成，全局唯一。
- REQ-ADMIN-cea57da21a：后台账号：登录名全局唯一。
- REQ-ADMIN-f9e721bd66：姓名 / 角色：姓名必填；角色决定菜单权限。
- REQ-ADMIN-c147e85e0f：状态：启用、停用；停用立即禁止登录。
- REQ-ADMIN-23818b9dc3：登录 / 更新时间：最近成功登录时间 / 最近资料或状态变更时间。
- REQ-ADMIN-22e541c70e：系统内置超级管理员账号不可停用。
- REQ-ADMIN-6551e340a8：启停 -> 填写原因并确认 -> 立即生效并留痕；编辑 -> 账号详情。
- REQ-PUB-2daab99cab：列表通过开关启用或停用账号，确认时必须填写操作原因；停用后立即禁止登录。
- REQ-PUB-07d020077f：超级管理员账号不可停用，避免系统失去可维护账号。

## 系统配置 · 账号编辑

原型：`liveshow-proto/prototype/pages/admin/system/admin-system-account-detail.html`；视图：`admin-system-account-detail.html`。

执行角色：超级管理员；页面入口：账号编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-f9a22b0633：超级管理员新增或编辑后台账号及所属角色。
- REQ-ADMIN-9df1741af2：账号 ID：新建系统生成，编辑只读。
- REQ-ADMIN-c59fc9b3ec：后台账号 / 姓名：均必填；登录账号全局唯一。
- REQ-ADMIN-652e56f63b：所属角色：必选启用角色，权限继承角色配置。
- REQ-ADMIN-10b4ed4c28：初始密码：新建必填，符合密码策略。
- REQ-ADMIN-2ba8ca3b55：新密码 / 确认：两次一致并符合策略，保存后立即生效。
- REQ-ADMIN-27a1cbdebb：状态：启用、停用。
- REQ-ADMIN-8b3041faab：超级管理员内置账号的账号、角色和状态不可修改。
- REQ-ADMIN-60587dd816：保存 -> 校验唯一性和角色 -> 更新；重置密码 -> 校验两次输入 -> 替换旧密码。
- REQ-PUB-b78658bb99：后台登录账号全局唯一；新建时设置初始密码。
- REQ-PUB-59117dd1b1：账号菜单权限继承所属角色。
- REQ-PUB-2bc554e667：编辑账号时可重置密码；新密码保存后立即生效。

## 系统配置 · 角色管理

原型：`liveshow-proto/prototype/pages/admin/system/admin-system-role.html`；视图：`admin-system-role.html`。

执行角色：超级管理员；页面入口：角色管理。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-9a1c974e99：超级管理员查询、新建、编辑和启停后台角色。
- REQ-ADMIN-e644934514：角色 ID：系统生成，全局唯一。
- REQ-ADMIN-f678ca805c：角色名称：全局不可重复。
- REQ-ADMIN-9a481661e9：关联账号：当前绑定该角色的后台账号数。
- REQ-ADMIN-d0f15fe9f7：状态：启用、停用；停用后关联账号立即失去该角色权限。
- REQ-ADMIN-7466b84920：内置超级管理员角色拥有全部权限，不可修改或停用。
- REQ-ADMIN-6fbf3fefc8：启停 -> 确认影响账号后执行；编辑 -> 角色详情。
- REQ-PUB-621d8e1021：列表通过开关启用或停用角色；停用后关联账号失去该角色授予的权限。
- REQ-PUB-8f116bc934：超级管理员角色拥有全部权限，不允许修改或停用。

## 系统配置 · 角色编辑

原型：`liveshow-proto/prototype/pages/admin/system/admin-system-role-detail.html`；视图：`admin-system-role-detail.html`。

执行角色：超级管理员；页面入口：角色编辑。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-ADMIN-a0f143749f：超级管理员新增或编辑角色及菜单权限。
- REQ-ADMIN-f59656672e：角色 ID：新建系统生成，编辑只读。
- REQ-ADMIN-75e6575149：角色名称：必填且全局唯一。
- REQ-ADMIN-c538e3f0b9：角色状态：启用、停用。
- REQ-ADMIN-8391a40d85：菜单权限：与后台一级、二级菜单一致；已选择数 = 勾选叶子权限数。
- REQ-ADMIN-54c459dbb7：勾选父级联动全部子级；取消全部子级同步取消父级。
- REQ-ADMIN-8b41748ac4：内置超级管理员默认全部权限且不可修改。
- REQ-ADMIN-59b756040b：全选或全不选 -> 更新权限树；保存 -> 校验名称和权限 -> 对关联账号立即生效。
- REQ-PUB-76dc9a384a：权限树与后台一级、二级菜单保持一致；父级与子级权限联动。
- REQ-PUB-845dd2c618：超级管理员默认拥有全部权限，不允许修改。

## 需求缺口与局部冲突（本次独立复核）

- GAP-Q-002｜端：用户App、管理后台｜模块：任务与邀请｜场景：邀请奖励金额｜待决策：每次成功邀请奖励是固定 10 金币，还是由后台任务配置决定？｜已知依据：邀请页写固定 10，福利页写后台配置；系统概要仅明确邀请可获得金币。｜可选方案：使用后台任务配置 / 固定 10 金币｜关联原型：invite-friends.html
- GAP-Q-003｜端：用户App、公会App、管理后台｜模块：等级｜场景：成长计入范围｜待决策：四类等级各自的成长值应计入哪些业务金额？｜已知依据：用户端出现收礼贡献、消费成长，公会端出现主播收益；等级配置明确计入范围待确认。｜可选方案：各等级分别按配置字段口径 / 统一按实际净消费和收益口径｜关联原型：admin-level-config.html
- GAP-Q-004｜端：管理后台｜模块：礼物与道具｜场景：道具类型｜待决策：一期预置道具类型是三类还是六类？｜已知依据：结构化批注与当前类型选择器是勋章、气泡、头像框；公共批注还含灯牌、头衔、座驾。｜可选方案：三类 / 六类｜关联原型：admin-prop-list.html
- GAP-Q-005｜端：管理后台｜模块：运营账号｜场景：资料和密码权限｜待决策：平台管理员能否编辑运营账号资料和重置密码？｜已知依据：系统概要明确平台启停和锁定，但未说明资料与密码；结构化批注禁止，公共批注与页面入口允许。｜可选方案：平台不可编辑和重置 / 平台有权限时可编辑和重置｜关联原型：admin-operation-account-detail.html
- GAP-Q-008｜端：用户App、公会App、管理后台｜模块：跨日统计｜场景：业务时区｜待决策：三端自然日与奖励截止时间统一使用哪个时区？｜已知依据：均使用业务自然日，但没有明确时区；印尼多时区，设备区号不能替代业务时区。｜可选方案：Asia/Jakarta / UTC｜关联原型：welfare-center.html
- GAP-Q-009｜端：用户App、管理后台｜模块：任务与邀请｜场景：停用后领取资格｜待决策：任务停用时已达成且当天未过期的奖励能否领取？｜已知依据：只明确停用不再产生进度、不回收已领取；未领取奖励的去向未明确。｜可选方案：当天有效奖励仍可领取 / 停用立即失去领取资格｜关联原型：welfare-center.html
- GAP-Q-010｜端：用户App、管理后台｜模块：任务与邀请｜场景：补签｜待决策：是否支持补签？｜已知依据：签到章节明确“是否支持补签”待确认。连续签到和断签重置规则已有依据。｜可选方案：一期不支持 / 支持并另定补签资格｜关联原型：welfare-center.html
- GAP-Q-011｜端：用户App、管理后台｜模块：任务与邀请｜场景：任务到期领取资格｜待决策：任务有效期结束时已达成但尚未到当日截止时间的奖励能否领取？｜已知依据：任务有效期与当天 23:59 的领取时限均存在，二者优先级未定义。｜可选方案：到期立即失效 / 允许领取到当天截止｜关联原型：welfare-center.html
- GAP-Q-012｜端：用户App、管理后台｜模块：任务与邀请｜场景：成功邀请认定｜待决策：被邀请人完成什么动作才算一次成功邀请？｜已知依据：页面定义成功邀请数和奖励，未定义注册、首次登录或其他有效条件。｜可选方案：完成注册即成功 / 完成注册及指定激活条件｜关联原型：invite-friends.html
- GAP-Q-015｜端：用户App、公会App、管理后台｜模块：账号与权限｜场景：并发登录｜待决策：同一账号在第二台设备登录后第一台会话如何处理？｜已知依据：退出登录明确仅当前设备；并发登录数量与旧会话失效未定义。｜可选方案：允许多设备同时登录 / 新登录使旧设备下线｜关联原型：auth-login-register.html
- GAP-Q-035｜端：用户App、公会App、管理后台｜模块：等级｜场景：等级判定｜待决策：成长值介于两个已配置等级阈值之间时如何判级？｜已知依据：配置等级和阈值明确，等级匹配方法由批注明确列为待确认。｜可选方案：取已达到的最高阈值等级 / 使用区间上下界规则｜关联原型：admin-level-config.html
- GAP-Q-036｜端：用户App、公会App、管理后台｜模块：等级｜场景：等级追溯｜待决策：修改等级配置后已有账号等级是否立即重算？｜已知依据：等级配置明确对已有等级影响待确认；原型仅本页预览不能证明线上结果。｜可选方案：立即重算已有等级 / 仅对后续成长生效｜关联原型：admin-level-config.html
- GAP-Q-037｜端：用户App、管理后台｜模块：任务与邀请｜场景：任务奖励类型｜待决策：任务一期是否允许道具奖励？｜已知依据：任务配置明确仅金币；已领取视图却写道具进入背包。｜可选方案：仅金币 / 金币与道具均支持｜关联原型：views/welfare-center/claimed.html
- GAP-Q-038｜端：用户App、管理后台｜模块：任务与邀请｜场景：任务周期起点｜待决策：每周任务从星期几开始新周期？｜已知依据：榜单明确周一，任务章节单独将周起始日列为待确认，不能直接套用。｜可选方案：周一 / 周日｜关联原型：welfare-center.html
- GAP-Q-042｜端：用户App、管理后台｜模块：钱包与充值｜场景：支付结果未回显｜待决策：支付渠道成功但客户端超时后，用户应通过何种入口确认及恢复支付结果？｜已知依据：成功回调只入账一次明确，客户端超时恢复路径和时限未定义。｜可选方案：自动查询原订单结果 / 用户从订单详情主动查询｜关联原型：recharge.html
- GAP-Q-043｜端：用户App、管理后台｜模块：直播模块｜场景：送礼处理中下架｜待决策：服务端已受理送礼请求后礼物下架，本次赠送是否完成？｜已知依据：下架阻止新赠送、已完成赠送保留；处理中受理与扣款界限未定义。｜可选方案：已受理继续完成 / 未完成一律取消并恢复资产｜关联原型：views/live-room/gift.html
- GAP-Q-044｜端：用户App、管理后台｜模块：直播模块｜场景：购票处理中结束｜待决策：购票已受理但未完成时场次结束，本次购票是否扣款？｜已知依据：成功门票场次结束不退款，未完成请求的扣款边界未定义。｜可选方案：完成扣款后按已购票处理 / 取消未完成购票且不扣款｜关联原型：views/live-room/ticket-room-restricted.html
- GAP-Q-045｜端：用户App、管理后台｜模块：礼物与道具｜场景：送礼处理中改比例｜待决策：幸运礼物请求处理中修改收益比例，应使用哪个时点的比例快照？｜已知依据：只明确赠送时比例及完成后不追溯，尚未定义受理、扣款、入账哪个时点。｜可选方案：请求受理时 / 成功扣款入账时｜关联原型：admin-lucky-gift-config.html
- GAP-Q-046｜端：用户App、公会App、管理后台｜模块：审批管理｜场景：审核处理中停用公会｜待决策：平台终审处理中目标公会被停用，该申请如何结束？｜已知依据：停用公会与终审通过后入会结果明确，两个操作竞争的先后边界未明确。｜可选方案：取消未完成申请 / 终审提交时重新校验公会｜关联原型：admin-host-review-detail.html
- GAP-Q-047｜端：公会App、管理后台｜模块：运营账号｜场景：并发发放额度｜待决策：多笔虚拟金币发放并发竞争剩余额度时按什么提交边界分配？｜已知依据：单笔不能超额明确，未定义同时请求的序列、失败回显或补偿边界。｜可选方案：按服务端成功落账顺序 / 预占额度并按受理顺序｜关联原型：guild-operation-account-detail.html
- GAP-Q-048｜端：管理后台｜模块：财务结算｜场景：重复导入｜待决策：重复上传同一批分成结果时是否应阻止重复入账？｜已知依据：导入后锁定明确，但缺少批次去重键和重复上传规则。｜可选方案：按业务批次唯一性拒绝 / 允许再次导入独立记录｜关联原型：admin-settlement-record.html
- GAP-Q-049｜端：管理后台｜模块：财务结算｜场景：导入重复对象｜待决策：分成文件中同一对象出现多行时如何处理？｜已知依据：人数按去重对象统计，明细按模板校验，未说明重复明细金额是否合并。｜可选方案：拒绝重复对象行 / 合并同对象金额｜关联原型：admin-settlement-record.html
- GAP-Q-050｜端：管理后台｜模块：财务结算｜场景：分成金额取值｜待决策：上传分成结果是否允许零金额和负金额？｜已知依据：手工修正规则明确，上传模板只写金额字段，不能套用修正规则。｜可选方案：仅正金额 / 允许有符号金额｜关联原型：admin-settlement-record.html
- GAP-Q-051｜端：管理后台｜模块：财务结算｜场景：部分无效导入｜待决策：分成文件含无效对象时是整批拒绝还是导入有效行？｜已知依据：只有解析预览确认流程，原型使用固定示例，不能证明真实异常策略。｜可选方案：整批拒绝 / 导入有效行并提供失败明细｜关联原型：admin-settlement-record.html
- GAP-Q-052｜端：用户App、公会App、管理后台｜模块：跨日统计｜场景：跨日时长｜待决策：跨自然日直播的有效时长如何分摊？｜已知依据：单日累计满三小时规则明确，但跨午夜场次切分和异常时长扣除未定义。｜可选方案：按实际在线区间拆日 / 全量归开播日｜关联原型：live-data.html
- GAP-Q-055｜端：公会App、管理后台｜模块：公会管理｜场景：未结清收益｜待决策：阻止移出或解散的“未结清收益”如何由线下结果确定？｜已知依据：概要规定线下结算和上传；页面有未结收益门槛，未定义结清标记和对账算法。｜可选方案：按明确结清标记 / 按待结收益减已上传结算计算｜关联原型：guild-host-detail.html
- GAP-Q-056｜端：用户App、公会App、管理后台｜模块：直播模块｜场景：群主身份失效｜待决策：公会停用导致主播失去身份时，粉丝团是否同退会通过一样解散？｜已知依据：退会或移出明确解散，概要公会停用只明确关系身份与关播，没有直接说明粉丝团。｜可选方案：立即解散 / 保留群并冻结管理｜关联原型：admin-guild-list.html
- GAP-Q-058｜端：管理后台｜模块：系统配置｜场景：后台初始密码｜待决策：后台账号新建密码长度与复杂度采用什么标准？｜已知依据：新建提示至少8位，重置提示8-32位；批注只写符合密码策略，没有明确统一复杂度。｜可选方案：统一8-32位并规定复杂度 / 新建和重置分别设置策略｜关联原型：admin-system-account-detail.html
- GAP-Q-059｜端：管理后台｜模块：系统配置｜场景：系统参数范围｜待决策：未登记到当前查看器和导航的系统参数页面是否属于本期范围？｜已知依据：系统参数列表和详情文件存在且有公共批注，但活动页面索引及公共导航没有入口；不能把文件存在等同于当前功能已交付。｜可选方案：不纳入本期 / 纳入本期并明确菜单入口｜关联原型：admin-system-parameter.html
- GAP-Q-060｜端：管理后台｜模块：系统配置｜场景：操作审计范围｜待决策：未登记到当前查看器和导航的操作审计页面是否属于本期范围？｜已知依据：审计列表和详情文件及只读批注存在，但当前菜单仅后台账号和角色管理。业务处置记录仍按各模块明确要求测试。｜可选方案：不纳入本期独立审计页 / 纳入本期并明确菜单入口｜关联原型：admin-system-audit.html
