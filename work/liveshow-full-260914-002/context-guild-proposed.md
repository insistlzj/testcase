# 公会App 项目需求清单

来源：当前系统概要、活动原型页面和明确批注；同步批次 RSL-0034。系统概要优先；历史生成附录和历史任务链接已退出当前需求依据。原文件逐字保存在归档的 context-before 中。

## 公共业务规则

用户与主播共用账号；入会材料随申请提交，公会初审及平台终审均通过后入会成为主播；任一方驳回后申请失效。平台权限优先，锁定期间公会只读，解锁恢复原公会设置。公会停用解除主播关系、身份并结束直播，停用公会长账号只限制该账号登录。只有充值可退款，已完成礼物及门票消费不撤销；幸运礼物收益取赠送时配置比例，返奖不影响主播收益；虚拟金币不形成主播收益。系统不在线申请或审批结算，不计算具体分成；财务线下完成后上传结果。细则以 context/系统概要 .md 对应章节为准。

## 公会账号 · 公会登录

原型：`liveshow-proto/prototype/pages/guild/auth/guild-login.html`；视图：`guild-login.html`。

执行角色：公会长；页面入口：公会登录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-4c260c7f86：公会账号：必填；使用平台创建的公会长账号。
- REQ-GUILD-b219660bdb：密码：必填；错误时统一提示账号或密码错误。
- REQ-GUILD-3016605a40：一期仅公会长可登录公会端；运营账号不能登录公会端。
- REQ-GUILD-0ce3597fd2：公会长账号被停用后不可登录，不影响公会内主播账号。
- REQ-GUILD-422b478e0e：登录校验通过 -> 进入「选择公会」；账号或密码错误 -> 停留当前页并提示“账号或密码错误”。

## 公会账号 · 选择公会

原型：`liveshow-proto/prototype/pages/guild/auth/guild-switch.html`；视图：`guild-switch.html`。

执行角色：公会长；页面入口：选择公会。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-57ea6a0920：公会长：显示名称、用户 ID 和“公会长”身份。
- REQ-GUILD-ba93d1b5d2：公会：显示公会名称、公会 ID 和当前公会状态；不显示城市。
- REQ-GUILD-d5be20b876：仅展示当前账号可管理且未解散的公会；已解散公会不可选择。
- REQ-GUILD-f8b3b08691：选择公会 -> 更新当前公会，返回首页并重新加载该公会数据。

## 公会首页 · 首页

原型：`liveshow-proto/prototype/pages/guild/home/guild-home.html`；视图：`guild-home.html`。

执行角色：公会长；页面入口：首页。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-71b26ef779：当前公会：显示公会 Logo、名称和公会 ID。
- REQ-GUILD-e051472edc：今日概况：仅统计当前公会当日数据。
- REQ-GUILD-ff872f852f：当日收益：当前公会主播当日直播间计入收益的礼物金币总和；直播中：当前时刻正在直播的去重主播数；达成有效天：当日累计直播时长达到 3 小时的主播数。
- REQ-GUILD-6b470d98b1：普通礼物、定制礼物按成功实际消费金币计入；幸运礼物按礼物总价值 × 后台配置比例计入，默认 1%，返奖不影响主播收益。
- REQ-GUILD-ab86979826：运营账号虚拟金币送礼、失败或已冲正消费不计入主播收益。
- REQ-GUILD-54af699a17：点击今日概况 -> 进入当日经营详情；功能入口进入对应列表。

## 公会首页 · 通知消息

原型：`liveshow-proto/prototype/pages/guild/home/guild-notifications.html`；视图：`guild-notifications.html`。

执行角色：公会长；页面入口：通知消息。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-203d433f4c：标题：表达业务事件和当前结果。
- REQ-GUILD-ad41688c39：摘要：展示对象、结果或待处理数量。
- REQ-GUILD-b03616b010：时间：通知生成时间，按时间倒序。
- REQ-GUILD-221be2a3d6：已读状态：未读显示标记；进入详情后标记为已读。
- REQ-GUILD-a4f392a47c：入会申请待初审、平台终审结果；退会申请待审核。
- REQ-GUILD-25cc4b6322：平台关闭直播场次、关闭或恢复直播权限。
- REQ-GUILD-835a3cd01a：公会状态、公会长账号状态或运营账号管理权限变更。
- REQ-GUILD-956d70ce40：主播分成、公会分成结果新增或冲正。
- REQ-GUILD-4f825376c3：点击通知 -> 进入通知详情；有关联业务时由详情进入对应记录。

## 公会首页 · 通知详情

原型：`liveshow-proto/prototype/pages/guild/home/guild-notification-detail.html`；视图：`guild-notification-detail.html`。

执行角色：公会长；页面入口：通知详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-02f397e9d4：标题：与列表标题一致。
- REQ-GUILD-f5b6d50b7c：发送时间：通知生成时间。
- REQ-GUILD-6c3478a4d5：正文：展示业务对象、状态变化和必要处理信息。
- REQ-GUILD-40d3386382：业务入口：仅有关联记录且当前账号有权限时显示。
- REQ-GUILD-c206a640a4：进入详情 -> 标记为已读；点击业务入口 -> 进入对应记录。

## 审批管理 · 入会申请

原型：`liveshow-proto/prototype/pages/guild/approval/guild-join-review.html`；视图：`guild-join-review.html`。

执行角色：公会长；页面入口：入会申请。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-40e43de8cd：申请人：用户名称、用户 ID。
- REQ-GUILD-37f4677588：申请时间：用户提交时间。
- REQ-GUILD-1c4425d923：状态：审核中包含待公会审核、平台审核中；已通过为平台终审通过；已驳回包含公会驳回、平台驳回。
- REQ-GUILD-7bf433486a：同一用户同时只能有一笔待处理入会申请，且只能加入一个公会。
- REQ-GUILD-7b22c2026c：公会驳回或平台驳回后本次申请结束，用户可重新提交。
- REQ-GUILD-4aaf45066c：公会通过后进入平台终审；平台通过后加入公会并获得主播身份。
- REQ-GUILD-ebebfb5db0：状态 Tab -> 筛选对应状态；点击申请卡片 -> 进入申请详情。

## 审批管理 · 入会申请详情

原型：`liveshow-proto/prototype/pages/guild/approval/guild-join-review-detail.html`；视图：`guild-join-review-detail.html`。

执行角色：公会长；页面入口：入会申请详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-0d3084ce76：申请信息：用户名称、用户 ID、申请公会、姓名、电话。
- REQ-GUILD-d6a605b8a2：认证材料：本人照片、证件照正面、证件照反面。
- REQ-GUILD-d2ad417fe6：审核进度：用户提交、公会审核、平台终审、成为主播。
- REQ-GUILD-4ea172e8d1：驳回理由：驳回时选填，最多 200 字；显示在对应驳回节点下。
- REQ-GUILD-133b2a87c6：公会通过仅提交平台终审；终审通过前申请人仍为普通用户。
- REQ-GUILD-44e4be1243：平台通过 -> 加入当前公会并获得主播身份；平台驳回 -> 本次申请结束。
- REQ-GUILD-d1fc88685f：已处理申请只读，不可重复审核。
- REQ-GUILD-387900e87e：通过 -> 二次确认 -> 提交平台终审；驳回 -> 填写可选理由 -> 结束申请。
- REQ-GUILD-25facb0ef4：点击认证材料 -> 查看大图；成为主播后可进入主播详情。

## 审批管理 · 退会申请

原型：`liveshow-proto/prototype/pages/guild/approval/guild-leave-review.html`；视图：`guild-leave-review.html`。

执行角色：公会长；页面入口：退会申请。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-aa4af48349：申请人：主播名称、主播 ID。
- REQ-GUILD-8d3987fbf4：申请时间：主播提交时间。
- REQ-GUILD-888a8728e6：状态：待审核、已通过、已驳回。
- REQ-GUILD-a76daa735b：退会申请仅由公会审核，不进入平台终审。
- REQ-GUILD-b97e1963f1：通过后立即结束当前直播、解除公会关系并失去主播身份；驳回后保留主播身份。
- REQ-GUILD-edba8098af：状态 Tab -> 筛选对应状态；点击申请卡片 -> 进入申请详情。

## 审批管理 · 退会申请详情

原型：`liveshow-proto/prototype/pages/guild/approval/guild-leave-review-detail.html`；视图：`guild-leave-review-detail.html`。

执行角色：公会长；页面入口：退会申请详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-81c7cb83f9：主播：名称、主播 ID。
- REQ-GUILD-9c5bea0a64：加入时间：当前公会关系生效时间。
- REQ-GUILD-2b6a7b9b04：申请时间：主播提交时间。
- REQ-GUILD-94c4278fd4：退会原因：申请人填写内容。
- REQ-GUILD-04848ee279：处理信息：已处理记录显示处理时间、结果；驳回理由显示在驳回节点下。
- REQ-GUILD-d6058775bb：通过 -> 立即结束当前直播、解除公会关系并失去主播身份。
- REQ-GUILD-80143e98b2：驳回 -> 保留主播身份和公会关系；主播可重新申请。
- REQ-GUILD-c0751a803f：通过需二次确认；驳回理由选填，最多 200 字；已处理记录只读。

## 主播管理 · 主播列表

原型：`liveshow-proto/prototype/pages/guild/people/guild-member-list.html`；视图：`guild-member-list.html`。

执行角色：公会长；页面入口：主播列表。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-befaac84de：主播：头像、名称、主播 ID。
- REQ-GUILD-9eec853ddb：加入时间：当前公会关系生效时间。
- REQ-GUILD-378892d6a6：状态：在会或已退会；已退会显示【退会】。
- REQ-GUILD-d5838d320f：仅展示当前公会的在会主播和历史退会主播；普通用户不进入主播列表。
- REQ-GUILD-df82e0c6b7：状态 Tab 和名称或 ID 搜索共同生效；点击主播 -> 进入主播详情。

## 主播管理 · 主播业绩

原型：`liveshow-proto/prototype/pages/guild/people/guild-host-list.html`；视图：`guild-host-list.html`。

执行角色：公会长；页面入口：主播业绩。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-6694d48805：支持今日、昨日、本周、上周、本月、上月、自定义；默认今日。
- REQ-GUILD-9d6e9a3c51：主播收益：所选日期范围内所有主播直播间计入收益的礼物金币总和；开播人数：所选日期范围内至少完成 1 场直播的去重主播数；达标人数：在开播主播中，累计有效天达到全部开播主播累计有效天中位数及以上的去重主播数；金币收益：当前主播在所选日期范围内直播间计入收益的礼物金币总和。
  - 风险 Q-003：主播等级成长值口径。
- REQ-GUILD-98b172065f：有效天按主播自然日累计直播时长达到 3 小时计 1 天。
- REQ-GUILD-e93617bfda：已退会主播保留历史业绩并显示【退会】；统计以直播发生时的公会关系为准。
- REQ-GUILD-49dffa95e2：日期变化 -> 刷新指标与列表；点击主播行 -> 进入「主播数据」。

## 数据与收益 · 主播数据

原型：`liveshow-proto/prototype/pages/guild/data/guild-host-summary.html`；视图：`guild-host-summary.html`。

执行角色：公会长；页面入口：主播数据。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-cd24c66145：显示头像、名称、主播 ID、等级；已退会主播显示【退会】。
- REQ-GUILD-9d0b7bc8b9：支持日数据、月数据。
- REQ-GUILD-87cd0c2ad9：日数据支持本周、上周、本月、上月、自定义，默认本月；月数据支持月份范围、近半年、近一年，默认近半年。
- REQ-GUILD-405d909252：有效天：主播当日累计直播时长达到 3 小时计 1 天，否则为 0 天；直播时长：主播当日全部直播场次时长之和，并区分是否达成有效天；新增粉丝：当日新增关注人数减去取消关注人数；金币收益：主播当日直播间计入收益的礼物金币总和。
- REQ-GUILD-d847f21d91：直播时长：主播当月全部直播场次时长之和；新增粉丝：当月新增关注人数减去取消关注人数；金币收益：主播当月直播间计入收益的礼物金币总和。
- REQ-GUILD-4c7ba2a9f0：点击日或月数据行 -> 进入「直播记录」，带入主播和对应日期或月份。
- REQ-GUILD-57ff5e6a38：点击主页入口 -> 进入主播详情。

## 主播管理 · 主播主页

原型：`liveshow-proto/prototype/pages/guild/people/guild-host-detail.html`；视图：`guild-host-detail.html`。

执行角色：公会长；页面入口：主播主页。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-c1a0929b52：主播信息：头像、名称、主播 ID、主播等级。
- REQ-GUILD-1605381521：退会状态：已退会主播显示【退会】。
- REQ-GUILD-f0f96bcd8b：快捷入口：直播记录、违规记录、主播分成。
- REQ-GUILD-241bf5e0e0：申请记录：加入或退出申请的申请时间、审核状态、处理时间、申请原因、驳回原因。
- REQ-GUILD-a7dee71ee5：粉丝数：当前主播的累计净粉丝数；总收益：当前主播历史直播间计入收益的礼物金币总和；直播次数：累计完成的直播场次数；直播时长：全部已完成直播场次时长总和；累计违规：直播间违规和账号违规记录总数。
- REQ-GUILD-b16dd026e8：开播需同时满足账号可用、公会有效、主播认证通过、最终直播权限开启（平台关闭时关闭；平台开启且未锁定时取公会设置，锁定开启时跟随平台；解锁恢复公会原设置）。
- REQ-GUILD-0b114d55e3：平台锁定公会管理权限时，公会直播权限开关只读；解除锁定后恢复锁定前设置。
- REQ-GUILD-89fe20dee1：关闭正在直播主播的权限 -> 二次确认后立即结束当前直播，并禁止再次开播。
- REQ-GUILD-5c30e8b3bb：存在未结清收益时移出公会按钮置灰；确认移出后结束当前直播并解除公会关系。
- REQ-GUILD-16b48895b9：点击业绩 -> 进入「主播数据」；点击认证材料 -> 查看大图；管理操作均需确认。

## 运营管理 · 运营消息

原型：`liveshow-proto/prototype/pages/guild/operations/guild-messages.html`；视图：`guild-messages.html`。

执行角色：公会长；页面入口：运营消息。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-7fa183e6dc：发送对象：全体主播，或指定主播的名称和主播 ID。
- REQ-GUILD-2f4bfcaedd：发送时间：消息实际发送时间。
- REQ-GUILD-892a5425d6：消息摘要：展示消息文字，超出列表长度截断。
- REQ-GUILD-a556170a3c：日期范围按发送时间筛选，默认本月。
- REQ-GUILD-b481e0233b：新建 -> 进入发送页；点击消息记录 -> 进入消息详情。

## 运营管理 · 新建运营消息

原型：`liveshow-proto/prototype/pages/guild/operations/guild-message-compose.html`；视图：`guild-message-compose.html`。

执行角色：公会长；页面入口：新建运营消息。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-7f4e5d2ca1：发送对象：全体主播或指定 1 名当前公会主播；指定主播时必选。
- REQ-GUILD-96de91147e：消息内容：必填，去除首尾空格后最多 500 字。
- REQ-GUILD-cf1de5cde0：图片：选填，最多 1 张；支持 JPG、PNG、WebP。
- REQ-GUILD-6f7caf01c1：发送对象和内容按确认时快照生成记录；发送后不支持编辑或撤回。
- REQ-GUILD-684d47f0cd：发送 -> 校验必填项 -> 二次确认接收范围 -> 生成记录并返回列表。

## 运营管理 · 选择主播

原型：`liveshow-proto/prototype/pages/guild/operations/guild-host-select.html`；视图：`guild-host-select.html`。

执行角色：公会长；页面入口：选择主播。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-4fa968b41e：搜索：按主播名称或主播 ID 模糊匹配。
- REQ-GUILD-f4899d5715：选择结果：仅可选择 1 名当前公会主播。
- REQ-GUILD-c634b883ca：完成 -> 回填新建运营消息；未选择时提示选择主播。
- REQ-PUB-682fded69b：仅可选择一位主播；完成后返回新建运营消息页并回填主播。

## 运营管理 · 运营消息详情

原型：`liveshow-proto/prototype/pages/guild/operations/guild-message-detail.html`；视图：`guild-message-detail.html`。

执行角色：公会长；页面入口：运营消息详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-02aaa569a7：发送对象：对象类型和实际接收人数；指定主播时显示主播。
- REQ-GUILD-c719f40c07：发送时间：消息实际发送时间。
- REQ-GUILD-db505c3095：发送人：执行发送的公会长名称。
- REQ-GUILD-7ea17f4e91：消息内容：发送时的文字和图片快照。
- REQ-GUILD-e99d1cfe8c：详情只读；接收人后续退会不改变历史记录。

## 运营管理 · 运营账号

原型：`liveshow-proto/prototype/pages/guild/operations/guild-operation-accounts.html`；视图：`guild-operation-accounts.html`。

执行角色：公会长；页面入口：运营账号。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-bf89b53228：本月已发放：当前公会本月向全部运营账号成功发放的虚拟金币总和；本月剩余可发：公会本月累计发放上限减去本月已发放，不小于 0；账户余额累计：全部运营账号可用虚拟金币余额之和；本月累计消费：全部运营账号本月成功送礼实际消费虚拟金币总和。
- REQ-GUILD-98cacb73c8：运营账号：名称、账号 ID。
- REQ-GUILD-5eb770523c：账户余额：当前可用虚拟金币。
- REQ-GUILD-999591f114：本月消费：本月成功送礼实际消费虚拟金币之和。
- REQ-GUILD-37e76eae9d：运营账号由公会创建，不对应真实用户。
- REQ-GUILD-6cd2d019f6：运营账号没有真实金币，只有虚拟金币；虚拟金币只能由所属公会发放，不能通过充值或任务获得。
- REQ-GUILD-7808da3c55：运营账号只能使用虚拟金币赠送普通、定制礼物，不可赠送幸运礼物；虚拟金币不可兑换，也不计入主播收益和分成。
- REQ-GUILD-efccbf1bf6：搜索按名称或账号 ID 匹配；创建 -> 新建账号；点击账号 -> 进入账号主页。

## 运营管理 · 创建运营账号

原型：`liveshow-proto/prototype/pages/guild/operations/guild-operation-account-compose.html`；视图：`guild-operation-account-compose.html`。

执行角色：公会长；页面入口：创建运营账号。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-f16ebcefb0：头像：必填；支持 JPG、PNG、WebP。
- REQ-GUILD-1bb43b73b7：名称：必填，最多 30 字。
- REQ-GUILD-679adcbd4f：账号：必填，最多 30 字；全平台唯一；仅支持用户端登录。
- REQ-GUILD-99dcd2a0a0：初始密码：必填，至少 6 位。
- REQ-GUILD-50e00cdb53：发放金币：必填，默认 0；不得小于 0 或超过本次可发上限。
- REQ-GUILD-d991c0bf1b：账号状态：默认启用；禁用账号不可登录或送礼。
- REQ-GUILD-d9d4a78666：本次可发上限：取单账号月发放上限剩余额度与公会月累计发放上限剩余额度的较小值。
- REQ-GUILD-fe71fd0de2：创建时发放的是虚拟金币，资金来源为所属公会；运营账号没有真实金币，不能充值或通过任务获得金币。
- REQ-GUILD-b44bc1937a：确认创建 -> 校验字段和额度 -> 创建账号、记入发放额度并返回列表。

## 运营管理 · 运营账号主页

原型：`liveshow-proto/prototype/pages/guild/operations/guild-operation-account-detail.html`；视图：`guild-operation-account-detail.html`。

执行角色：公会长；页面入口：运营账号主页。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-0df7268274：账号信息：头像、名称、账号 ID、启用状态。
- REQ-GUILD-35f456e420：消费明细：按日期汇总成功送礼实际消费虚拟金币；默认本月。
- REQ-GUILD-b7e7abcf25：账户余额：累计成功发放虚拟金币减去累计成功消费虚拟金币；累计消费：账号历史成功送礼实际消费虚拟金币总和；本月发放：账号本月成功发放虚拟金币总和；本月消费：账号本月成功送礼实际消费虚拟金币总和。
- REQ-GUILD-5f5cf0067b：运营账号没有真实金币；虚拟金币只能由所属公会发放，不能充值或通过任务获得。
- REQ-GUILD-07019146fc：禁用后不可登录或送礼，历史记录和余额保留；重新启用后恢复。
- REQ-GUILD-a1e56d4012：平台锁定公会管理权限时仅可查看，不能启停或发放金币。
- REQ-GUILD-b3598d4023：发放上限取账号月剩余额度与公会月剩余额度的较小值。
- REQ-GUILD-1a716862b2：点击日期消费 -> 进入送礼记录并带入账号和日期；启停或发放成功后刷新指标。

## 运营管理 · 送礼记录

原型：`liveshow-proto/prototype/pages/guild/operations/guild-operation-gift-records.html`；视图：`guild-operation-gift-records.html`。

执行角色：公会长；页面入口：送礼记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-fb37ed1937：支持多选运营账号和今日、昨日、本周、上周、本月、上月、自定义；默认全部运营账号、今日。
- REQ-GUILD-0e39df42e9：总送礼次数：筛选范围内成功送礼记录数；总消费金币：筛选范围内各成功送礼记录的礼物单价乘赠送数量之和。
- REQ-GUILD-d7a0afa32a：列表：礼物名称、赠送时间、消费金币。
- REQ-GUILD-43e9b4c0c2：送礼详情：赠送时间、礼物名称、消费金币、礼物单价、礼物类型、赠送数量、主播名称、主播 ID。
- REQ-GUILD-f4bddcf80b：运营账号只能使用所属公会发放的虚拟金币赠送普通、定制礼物，不可赠送幸运礼物；虚拟金币送礼不计入主播收益或分成。
- REQ-GUILD-58832b30a1：点击记录 -> 打开送礼详情；筛选变化 -> 刷新汇总和列表。

## 运营管理 · 选择运营账号

原型：`liveshow-proto/prototype/pages/guild/operations/guild-operation-account-select.html`；视图：`guild-operation-account-select.html`。

执行角色：公会长；页面入口：选择运营账号。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-8b4dc314a0：搜索：按运营账号名称或账号 ID 模糊匹配。
- REQ-GUILD-23252d8e84：选择结果：支持多选和全选；全选作用于全部运营账号。
- REQ-GUILD-8770640f7e：完成 -> 返回送礼记录，回填账号并保留日期条件；取消全选 -> 清空选择。

## 公会管理 · 公会资料

原型：`liveshow-proto/prototype/pages/guild/management/guild-profile.html`；视图：`guild-profile.html`。

执行角色：公会长；页面入口：公会资料。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-6d027ebbe2：公会 ID：平台创建，永久只读。
- REQ-GUILD-49a29a93a3：公会 Logo：支持 JPG、PNG、WebP。
- REQ-GUILD-8f36dd7843：公会名称：必填，去除首尾空格后最多 40 字。
- REQ-GUILD-ba7269c678：公会简介：选填，最多 200 字。
- REQ-GUILD-431b87c74a：保存 -> 校验字段 -> 更新当前公会资料；不改变公会 ID 和公会关系。

## 公会管理 · 账号设置

原型：`liveshow-proto/prototype/pages/guild/management/guild-settings.html`；视图：`guild-settings.html`。

执行角色：公会长；页面入口：账号设置。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-36797f8b8c：账号信息：公会长名称、公会 ID。
- REQ-GUILD-0c79823e75：语言：简体中文、英文、印尼语、马来语。
- REQ-GUILD-a1b3620d12：语言设置作用于当前登录账号的公会端，不修改公会或主播资料。
- REQ-GUILD-4f6cf43762：修改密码 -> 独立页面；退出登录 -> 二次确认 -> 清除会话并返回登录页。

## 公会管理 · 修改密码

原型：`liveshow-proto/prototype/pages/guild/management/guild-password.html`；视图：`guild-password.html`。

执行角色：公会长；页面入口：修改密码。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-c709043325：当前密码：必填，必须与当前密码一致。
- REQ-GUILD-9fea9b5d82：新密码：必填，至少 8 位，不能与当前密码相同。
- REQ-GUILD-4076e219a3：确认新密码：必填，必须与新密码一致。
- REQ-GUILD-57ab51f7ca：当前密码错误 -> 保留输入并提示“当前密码错误”；新密码与旧密码相同 -> 保留输入并提示“新密码不能和旧密码一样”；请求失败 -> 保留输入并提示“保存失败”；校验成功后更新密码并返回账号设置。

## 数据与收益 · 直播记录

原型：`liveshow-proto/prototype/pages/guild/data/guild-host-data.html`；视图：`guild-host-data.html`。

执行角色：公会长；页面入口：直播记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-111705c81b：主播支持多选，默认全部；日期支持今日、昨日、本周、上周、本月、上月、自定义，默认今日。
- REQ-GUILD-7fe57fc0ec：收益：所选主播在所选日期范围内计入收益的礼物金币总和；开播人数：所选日期范围内至少完成 1 场直播的去重主播数；直播场次：所选主播在所选日期范围内创建的直播场次总数。
- REQ-GUILD-4767cfa784：直播场次：直播主题、主播名称、主播 ID、开播时间、直播时长。
- REQ-GUILD-033a6d48e4：收益：当前场次计入收益的礼物金币总和。
- REQ-GUILD-5843185dea：观众：当前场次进入直播间的去重用户数。
- REQ-GUILD-64a1a5ea32：收礼数量：当前场次成功收到的礼物件数之和。
- REQ-GUILD-a1f06b296a：每次开播创建一个新场次；场次结束后消息、消费、处置和收益记录继续保留。
- REQ-GUILD-5ce224805e：点击直播场次 -> 进入「直播场次详情」，带入主播 ID、日期和场次 ID。

## 数据与收益 · 直播场次详情

原型：`liveshow-proto/prototype/pages/guild/data/guild-live-gift-detail.html`；视图：`guild-live-gift-detail.html`。

执行角色：公会长；页面入口：直播场次详情。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-fac09c456a：场次信息：直播主题、场次 ID、主播名称、主播 ID、开播时间、直播时长。
- REQ-GUILD-522c723ee0：送礼列表：赠送时间、礼物名称、消费金币。
- REQ-GUILD-a3b1ec8963：送礼详情：赠送时间、礼物名称、消费金币、礼物单价、礼物类型、赠送数量、用户名称、用户 ID、用户等级。
- REQ-GUILD-148a060873：观众数量：当前场次进入直播间的去重用户数；送礼观众：当前场次成功送礼的去重用户数；礼物数量：当前场次成功收到的礼物件数之和；礼物收益：当前场次计入主播收益的礼物金币总和。
- REQ-GUILD-e98ca16385：普通礼物、定制礼物按成功实际消费金币计入；幸运礼物按礼物总价值 × 后台配置比例计入，默认 1%，返奖不影响主播收益。
- REQ-GUILD-01d3777327：运营账号赠送的礼物不计入主播实际收益。
- REQ-GUILD-e136f472d2：点击送礼记录 -> 查看送礼详情；返回时保留主播和日期筛选条件。

## 数据与收益 · 违规记录

原型：`liveshow-proto/prototype/pages/guild/data/guild-all-violations.html`；视图：`guild-all-violations.html`。

执行角色：公会长；页面入口：违规记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-9321757e74：违规范围支持直播间违规、账号违规；主播支持多选，默认全部；日期支持今日、昨日、本周、上周、本月、上月、自定义，默认今日。
- REQ-GUILD-d542e490ae：违规主播：主播名称、主播 ID。
- REQ-GUILD-0d06ea13d4：违规类型：读取管理后台启用的违规类型配置。
- REQ-GUILD-9902db8804：发生时间：违规或举报记录生成时间。
- REQ-GUILD-16ea1da16c：处理结果：警告、关闭场次、关闭直播权限、账号封禁或无处置；无结果显示“-”。
- REQ-GUILD-a5c0c94011：警告不结束直播；关闭场次仅结束当前直播；关闭直播权限立即结束当前直播并阻止再次开播。
- REQ-GUILD-43263125f2：账号封禁后当前会话下线；直播中同时结束当前场次。
- REQ-GUILD-6b5adfb547：筛选变化 -> 刷新记录；点击主播 -> 进入主播详情。

## 数据与收益 · 公会业绩

原型：`liveshow-proto/prototype/pages/guild/data/guild-income.html`；视图：`guild-income.html`。

执行角色：公会长；页面入口：公会业绩。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-14ec09beb8：支持日数据、月数据；日数据支持本周、上周、本月、上月、自定义，默认本月。
- REQ-GUILD-8062268f3e：公会收益：所选日期范围内全部主播计入收益的礼物金币总和；直播场次：所选日期范围内全部主播创建的直播场次总数；开播人数：所选日期范围内至少完成 1 场直播的去重主播数；达成有效天：所选日期范围内全部主播自然日累计直播满 3 小时产生的有效天总数。
- REQ-GUILD-4fc7d12382：公会收益：历史全部月份计入收益的礼物金币总和；直播场次：历史全部月份创建的直播场次总数；开播人数：历史全部月份至少完成 1 场直播的去重主播数；达成有效天：历史全部月份产生的有效天总数。
- REQ-GUILD-39bcd7bca2：日数据列表：日期、直播场次、达标主播、收益。
- REQ-GUILD-3d66cf0de7：月数据列表：月份、收益、开播人数。
- REQ-GUILD-fdc94a857a：点击指标卡片 -> 切换对应趋势；日数据按日期展示，月数据按月份展示。
- REQ-GUILD-0bda2dc8b2：点击日数据行 -> 进入主播业绩并带入日期；点击月数据行 -> 带入月份。

## 数据与收益 · 每日

原型：`liveshow-proto/prototype/pages/guild/data/guild-income-day-detail.html`；视图：`guild-income-day-detail.html`。

执行角色：公会长；页面入口：每日。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-758abdd6fe：日期：当前查看的自然日。
- REQ-GUILD-7ea4fd386a：主播列表：头像、名称、主播 ID、等级、当日收益、当日直播时长、有效天状态。
- REQ-GUILD-39d35988a7：开播状态：已开播、未开播；已开播按当日收益倒序。
- REQ-GUILD-79dc795bd9：当日收益：全部主播当日计入收益的礼物金币总和；直播中：查看今日时为当前正在直播的去重主播数，查看历史日期时为当日开播主播数；达成有效天：当日累计直播时长达到 3 小时的主播数。
- REQ-GUILD-e9469e919e：切换开播状态 -> 更新列表；点击主播 -> 进入主播数据并带入当前日期。

## 数据与收益 · 主播分成记录

原型：`liveshow-proto/prototype/pages/guild/data/guild-share-ledger.html`；视图：`guild-share-ledger.html`。

执行角色：公会长；页面入口：主播分成记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-3ff1775556：主播支持多选，默认全部；日期支持今日、昨日、本周、上周、本月、上月、自定义，默认本月；按分成时间筛选。
- REQ-GUILD-5c2ae2c0b6：主播：主播名称、主播 ID。
- REQ-GUILD-8767458563：分成时间：财务结果入账时间，格式为日/月/年/时.分。
- REQ-GUILD-2d8e867eda：分成金额：法定货币；正数为增加，绿色；负数为冲正或扣减，红色。
- REQ-GUILD-2609402806：系统不在线计算或审批最终分成；财务线下确定比例和金额后上传结果。
- REQ-GUILD-fe257f894c：分成时间与收益所属周期可以跨月；按分成时间倒序。

## 数据与收益 · 公会分成记录

原型：`liveshow-proto/prototype/pages/guild/data/guild-share-income.html`；视图：`guild-share-income.html`。

执行角色：公会长；页面入口：公会分成记录。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-576ab16c31：分成时间：当前公会分成结果入账时间，格式为日/月/年/时.分。
- REQ-GUILD-8e2e55f2ef：分成金额：法定货币；正数为增加，绿色；负数为冲正或扣减，红色。
- REQ-GUILD-b2deabb1ee：仅展示当前公会的财务上传结果，不提供日期筛选或在线分成计算。
- REQ-GUILD-ff98feb1d0：按分成时间倒序；分成时间与收益所属周期可以跨月。

## 数据与收益 · 选择主播

原型：`liveshow-proto/prototype/pages/guild/data/guild-violation-host-select.html`；视图：`guild-violation-host-select.html`。

执行角色：公会长；页面入口：选择主播。其他角色按本节明确授权分别执行，不由通用角色名推定权限。

- REQ-GUILD-39c40631ef：搜索：按主播名称或主播 ID 模糊匹配。
- REQ-GUILD-87de936b64：已选人数：实时显示已选择主播数。
- REQ-GUILD-c375190340：全选：全选全部主播；全部已选时切换为取消全选。
- REQ-GUILD-7f36ab0fea：支持多选；完成后返回违规记录、直播记录或主播分成记录，回填主播并保留其他筛选条件。

## 需求缺口与局部冲突（本次独立复核）

- GAP-Q-003｜端：用户App、公会App、管理后台｜模块：等级｜场景：成长计入范围｜待决策：四类等级各自的成长值应计入哪些业务金额？｜已知依据：用户端出现收礼贡献、消费成长，公会端出现主播收益；等级配置明确计入范围待确认。｜可选方案：各等级分别按配置字段口径 / 统一按实际净消费和收益口径｜关联原型：admin-level-config.html
- GAP-Q-008｜端：用户App、公会App、管理后台｜模块：跨日统计｜场景：业务时区｜待决策：三端自然日与奖励截止时间统一使用哪个时区？｜已知依据：均使用业务自然日，但没有明确时区；印尼多时区，设备区号不能替代业务时区。｜可选方案：Asia/Jakarta / UTC｜关联原型：welfare-center.html
- GAP-Q-015｜端：用户App、公会App、管理后台｜模块：账号与权限｜场景：并发登录｜待决策：同一账号在第二台设备登录后第一台会话如何处理？｜已知依据：退出登录明确仅当前设备；并发登录数量与旧会话失效未定义。｜可选方案：允许多设备同时登录 / 新登录使旧设备下线｜关联原型：auth-login-register.html
- GAP-Q-035｜端：用户App、公会App、管理后台｜模块：等级｜场景：等级判定｜待决策：成长值介于两个已配置等级阈值之间时如何判级？｜已知依据：配置等级和阈值明确，等级匹配方法由批注明确列为待确认。｜可选方案：取已达到的最高阈值等级 / 使用区间上下界规则｜关联原型：admin-level-config.html
- GAP-Q-036｜端：用户App、公会App、管理后台｜模块：等级｜场景：等级追溯｜待决策：修改等级配置后已有账号等级是否立即重算？｜已知依据：等级配置明确对已有等级影响待确认；原型仅本页预览不能证明线上结果。｜可选方案：立即重算已有等级 / 仅对后续成长生效｜关联原型：admin-level-config.html
- GAP-Q-046｜端：用户App、公会App、管理后台｜模块：审批管理｜场景：审核处理中停用公会｜待决策：平台终审处理中目标公会被停用，该申请如何结束？｜已知依据：停用公会与终审通过后入会结果明确，两个操作竞争的先后边界未明确。｜可选方案：取消未完成申请 / 终审提交时重新校验公会｜关联原型：admin-host-review-detail.html
- GAP-Q-047｜端：公会App、管理后台｜模块：运营账号｜场景：并发发放额度｜待决策：多笔虚拟金币发放并发竞争剩余额度时按什么提交边界分配？｜已知依据：单笔不能超额明确，未定义同时请求的序列、失败回显或补偿边界。｜可选方案：按服务端成功落账顺序 / 预占额度并按受理顺序｜关联原型：guild-operation-account-detail.html
- GAP-Q-052｜端：用户App、公会App、管理后台｜模块：跨日统计｜场景：跨日时长｜待决策：跨自然日直播的有效时长如何分摊？｜已知依据：单日累计满三小时规则明确，但跨午夜场次切分和异常时长扣除未定义。｜可选方案：按实际在线区间拆日 / 全量归开播日｜关联原型：live-data.html
- GAP-Q-055｜端：公会App、管理后台｜模块：公会管理｜场景：未结清收益｜待决策：阻止移出或解散的“未结清收益”如何由线下结果确定？｜已知依据：概要规定线下结算和上传；页面有未结收益门槛，未定义结清标记和对账算法。｜可选方案：按明确结清标记 / 按待结收益减已上传结算计算｜关联原型：guild-host-detail.html
- GAP-Q-056｜端：用户App、公会App、管理后台｜模块：直播模块｜场景：群主身份失效｜待决策：公会停用导致主播失去身份时，粉丝团是否同退会通过一样解散？｜已知依据：退会或移出明确解散，概要公会停用只明确关系身份与关播，没有直接说明粉丝团。｜可选方案：立即解散 / 保留群并冻结管理｜关联原型：admin-guild-list.html
