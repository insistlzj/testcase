# 用户App当前需求清单

本次依据当前系统概要、当前原型入口和结构化批注重新整理；不以旧用例、旧扫描或旧生成结果为业务来源。系统概要优先，原型和批注补充。

## 公共业务规则
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

## 首页与发现 / 首页
页面：live-plaza.html；实际承载：liveshow-proto/prototype/pages/user/home/live-plaza.html；实体页面。
- [META-fcbb89f1d229] 页面用途：用户浏览直播列表，筛选内容并进入直播间。〔来源：AN-f40ee1b6a901；liveshow-proto/prototype/annotations/user.js；live-plaza.html/场景描述/1〕
- [REQ-26266fc1addf] 直播卡片：展示本场封面、主题、主播、分类和本场直播间访问次数。访问次数 = 本场成功进入直播间的访问事件总数；同一用户重复进入重复累计，列表曝光、密码校验失败、购票失败等未进入行为不计入。场次开始时从 0 累计，结束后固化。〔来源：AN-fcbffb1397e3；liveshow-proto/prototype/annotations/user.js；live-plaza.html/字段/3〕
- [REQ-f407e5fbcd10] 房型：普通房无准入标识；门票房展示金币价格；密码房展示密码准入提示。〔来源：AN-08a5076398ea；liveshow-proto/prototype/annotations/user.js；live-plaza.html/字段/4〕
- [REQ-199b478e27ce] 关注主播：仅展示当前用户已关注且正在直播的主播。〔来源：AN-1e7eb629d605；liveshow-proto/prototype/annotations/user.js；live-plaza.html/字段/5〕
- [REQ-2d0b8f0363f7] Banner：内容、排序、跳转和有效期由平台配置。〔来源：AN-553f95fda924；liveshow-proto/prototype/annotations/user.js；live-plaza.html/字段/6〕
- [REQ-e8ec3f943f5b] 通知说明弹窗：标题“开启通知”；正文“开启后，你可以及时收到关注主播开播、互动消息及平台公告。”；按钮“暂不开启、开启通知”。〔来源：AN-bb28fcc70e7c；liveshow-proto/prototype/annotations/user.js；live-plaza.html/字段/7〕
- [REQ-7a7ace25c507] 系统授权弹窗：模拟手机系统通知授权，按钮“不允许、允许”。〔来源：AN-d7bc7aec366c；liveshow-proto/prototype/annotations/user.js；live-plaza.html/字段/8〕
- [REQ-d5aa38b782fd] 游客可查看主播榜、贡献榜和不同分类下的主播，并可进入福利页、邀请好友页。〔来源：AN-82e4b5012bde；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/1〕
- [REQ-e944097da140] 游客点击直播间、搜索、消息、我的或其他账号动作时不执行原操作，直接跳转登录页。〔来源：AN-260cd41fd6db；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/2〕
- [REQ-875a290366f8] 热门排序权重、直播分类和运营 Banner 由后台配置。〔来源：AN-de9fc7a6d5d9；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/3〕
- [REQ-288a28d5bee2] 关注区仅展示已关注且正在直播的主播；无符合数据时隐藏。〔来源：AN-7ffe4d71504e；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/4〕
- [REQ-37571523557b] 门票房购票后本场可重复进入；直播结束或被主播踢出后失效，购票写入消费明细。〔来源：AN-dadb38c52620；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/5〕
- [REQ-c1abe223a320] 密码房开启“仅粉丝团成员可进入直播间”后，广场展示开启时所有用户仍可看到卡片；非粉丝团成员点击后显示访问受限，粉丝团成员继续校验房间密码。〔来源：AN-5ca9a66c5282；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/6〕
- [REQ-5ccb1a22c513] 密码房校验正确后进入；校验失败时保留当前页面并提示重试。〔来源：AN-931ed3e3189d；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/7〕
- [REQ-b6e971fe282d] 登录成功后首次进入首页显示通知授权说明；选择开启或暂不开启后均不在后续登录中重复展示。〔来源：AN-9e092dd92be9；liveshow-proto/prototype/annotations/user.js；live-plaza.html/业务规则/8〕
- [REQ-509b608bd4e7] 点击搜索 -> 进入搜索页。〔来源：AN-342f3f82864d；liveshow-proto/prototype/annotations/user.js；live-plaza.html/交互/1〕
- [REQ-48ed6b7054ef] 切换热门或新人、选择分类 -> 刷新当前直播列表。〔来源：AN-084b5e881496；liveshow-proto/prototype/annotations/user.js；live-plaza.html/交互/2〕
- [REQ-76425e959ab6] 通知说明点击开启通知 -> 系统通知授权弹窗；点击暂不开启 -> 仅关闭说明，不请求系统权限。〔来源：AN-0611ac46356c；liveshow-proto/prototype/annotations/user.js；live-plaza.html/交互/4〕

## 首页与发现 / 主播榜
页面：host-ranking.html；实际承载：liveshow-proto/prototype/pages/user/home/host-ranking.html；实体页面。
- [META-e77df48f4636] 页面用途：用户查看平台主播收礼排名。〔来源：AN-e1c20af0d495；liveshow-proto/prototype/annotations/user.js；host-ranking.html/场景描述/1〕
- [REQ-bb13319d039b] 周期：按平台业务时区计算：当日从当天 00:00 开始，本周从周一 00:00 开始，本月从每月 1 日 00:00 开始。〔来源：AN-51da33ddf10d；liveshow-proto/prototype/annotations/user.js；host-ranking.html/字段/3〕
- [REQ-cfb0b2e6ae0f] 排名：依次按收礼值、主播等级、财富等级从高到低排序，仍相同时按主播 ID 数字部分从小到大排序；不设并列名次。〔来源：AN-ddad1eb3bd36；liveshow-proto/prototype/annotations/user.js；host-ranking.html/字段/4〕
- [REQ-9e4e83c848d1] 榜单数量：当日、本周、本月均最多显示前 30 名；第 30 名与第 31 名收礼值相同时，继续按排名规则确定顺序。〔来源：AN-4868561e6676；liveshow-proto/prototype/annotations/user.js；host-ranking.html/字段/5〕
- [REQ-bfa59063842c] 主播：展示头像、昵称、主播等级和当前开播状态。〔来源：AN-18ae006953d1；liveshow-proto/prototype/annotations/user.js；host-ranking.html/字段/6〕
- [REQ-61f3f54e13a7] 收礼值的真实金币部分：周期内主播成功收到的礼物单价 × 数量之和。幸运礼物按送出价值计算，返奖不冲减收礼值。〔来源：AN-58bdfd055651；liveshow-proto/prototype/annotations/user.js；host-ranking.html/字段/7〕
- [REQ-f3e7be9f9a0b] 主播等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。〔来源：AN-e25d0437a59e；liveshow-proto/prototype/annotations/user.js；host-ranking.html/业务规则/1〕
- [REQ-065256fe9347] 主播榜按收礼主播汇总真实金币赠礼；运营虚拟金币是否计入该榜的具体范围另见风险清单。〔来源：AN-e1486eaedae9；liveshow-proto/prototype/annotations/user.js；host-ranking.html/业务规则/2〕
- [REQ-3260f386f0f2] 有效消费冲正后重新计算收礼值和排名；充值退款不撤销已完成送礼。账号注销后保留历史数值，名称显示“账号已注销”，不能进入主页。〔来源：AN-baf51bbbcd73；liveshow-proto/prototype/annotations/user.js；host-ranking.html/业务规则/3〕
- [REQ-76353e4dbe44] 数据范围：所选当日、本周或本月的主播收礼汇总，按字段表中的排名规则最多展示前 30 名。〔来源：AN-569d627aacc1；liveshow-proto/prototype/annotations/user.js；host-ranking.html/业务规则/4〕
- [REQ-f7b4f8b5b63e] 切换周期 -> 同步更新前三名、列表排名和收礼值。〔来源：AN-febe369a4f49；liveshow-proto/prototype/annotations/user.js；host-ranking.html/交互/1〕
- [REQ-021f33d6dcb2] 已登录用户点击主播 -> 进入该主播主页；游客点击 -> 直接跳转登录页。〔来源：AN-12608f56e762；liveshow-proto/prototype/annotations/user.js；host-ranking.html/交互/2〕

## 首页与发现 / 贡献榜
页面：contribution-ranking.html；实际承载：liveshow-proto/prototype/pages/user/home/contribution-ranking.html；实体页面。
- [META-36984a722d2f] 页面用途：用户查看平台用户送礼贡献排名。〔来源：AN-42acc06fa5ea；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/场景描述/1〕
- [REQ-aa4b9b6bedf2] 周期：按平台业务时区计算：当日从当天 00:00 开始，本周从周一 00:00 开始，本月从每月 1 日 00:00 开始。〔来源：AN-ddee403025fc；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/字段/3〕
- [REQ-ad3b4b3d5e9b] 排名：依次按贡献值、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。〔来源：AN-f9f96aa9f92f；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/字段/4〕
- [REQ-3e39503ac52e] 榜单数量：当日、本周、本月均显示前 30 名；第 30 名与第 31 名贡献值相同时，继续按排名规则确定顺序。〔来源：AN-96ec2e4e43af；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/字段/5〕
- [REQ-0482ae7ce28b] 贡献榜统计真实用户的送礼贡献；运营账号是否进入该榜的具体范围另见风险清单。〔来源：AN-9076ce003939；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/字段/6〕
- [REQ-75038c4aca1b] 用户：展示头像、昵称和财富等级。〔来源：AN-6fb34ef9191b；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/字段/7〕
- [REQ-337ad0065e55] 贡献值的真实金币部分：周期内用户成功送出的各礼物单价 × 数量之和。幸运礼物按送出价值计算，返奖不冲减贡献值。〔来源：AN-5ac308118a3b；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/字段/8〕
- [REQ-338ca0cff70c] 财富等级最低为 1 级；排名按完整排序结果连续编号。〔来源：AN-6bd4c4fced38；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/业务规则/1〕
- [REQ-d8abb53c2c28] 贡献榜按送礼用户汇总；统计前过滤运营账号及其贡献数据。〔来源：AN-0e624b2dc753；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/业务规则/2〕
- [REQ-d78c5211c8a5] 有效消费冲正后重新计算贡献值和排名；充值退款不撤销已完成送礼。账号注销后保留历史数值，名称显示“账号已注销”，不能进入主页。〔来源：AN-0c3f301d1309；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/业务规则/3〕
- [REQ-fd19f623d02e] 数据范围：所选当日、本周或本月的用户送礼汇总，按字段表中的排名规则展示前 30 名。〔来源：AN-bfa4e6dc12c2；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/业务规则/4〕
- [REQ-c861a60701cb] 切换周期 -> 同步更新前三名、列表排名和贡献值。〔来源：AN-f992ccc2e9f1；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/交互/1〕
- [REQ-2a0dc67e1447] 已登录用户点击用户 -> 进入该用户主页；游客点击 -> 直接跳转登录页。〔来源：AN-98229c392b12；liveshow-proto/prototype/annotations/user.js；contribution-ranking.html/交互/2〕

## 首页与发现 / 搜索
页面：search.html；实际承载：liveshow-proto/prototype/pages/user/home/search.html；实体页面。
- [META-5c6844e96082] 页面用途：用户按昵称、用户 ID 或房间号查找账号。〔来源：AN-2259b63b67da；liveshow-proto/prototype/annotations/user.js；search.html/场景描述/1〕
- [REQ-c644e17bfb6f] 搜索关键词：必填，去除首尾空格后不能为空；支持房间号、用户 ID 或用户昵称。〔来源：AN-a84e7b990ff5；liveshow-proto/prototype/annotations/user.js；search.html/字段/3〕
- [REQ-e6e0d7e38a8f] 搜索历史：展示当前用户最近使用的搜索词，按最近使用倒序，去重后最多保留 10 条；不展示热门搜索词。〔来源：AN-b2a5423c9a42；liveshow-proto/prototype/annotations/user.js；search.html/字段/4〕
- [REQ-da88ffbc47a5] 搜索历史仅保存在当前用户侧，不随账号跨设备同步。〔来源：AN-c49729d1470a；liveshow-proto/prototype/annotations/user.js；search.html/业务规则/1〕
- [REQ-1206e925fd86] 提交关键词后写入搜索历史；相同关键词移到首位，不重复新增；超过 10 条时删除最早一条。〔来源：AN-547c19fe6b6f；liveshow-proto/prototype/annotations/user.js；search.html/业务规则/2〕
- [REQ-4d67a7a6560b] 数据范围：仅当前用户的搜索历史；按最近使用时间倒序、去重后最多 10 条。〔来源：AN-c617d81968dc；liveshow-proto/prototype/annotations/user.js；search.html/业务规则/3〕
- [REQ-a02e580d25de] 进入页面 -> 自动聚焦搜索框。〔来源：AN-c2920a20ff2c；liveshow-proto/prototype/annotations/user.js；search.html/交互/1〕
- [REQ-a0a19c423e65] 关键词为空 -> 提示输入，不进入搜索结果页。〔来源：AN-af90b858666c；liveshow-proto/prototype/annotations/user.js；search.html/交互/2〕
- [REQ-51257e5ecd35] 提交关键词或点击历史词 -> 写入最近使用记录并进入搜索结果页。〔来源：AN-f38c1bb4578b；liveshow-proto/prototype/annotations/user.js；search.html/交互/3〕
- [REQ-2b7db2f77439] 点击历史词右侧删除 -> 仅删除该条；点击清空全部 -> 删除全部搜索历史并显示空状态。〔来源：AN-da8a2bfd0e6b；liveshow-proto/prototype/annotations/user.js；search.html/交互/4〕

## 首页与发现 / 搜索结果
页面：search-results.html；实际承载：liveshow-proto/prototype/pages/user/home/search-results.html；实体页面。
- [META-350c893fcd28] 页面用途：用户查看当前关键词匹配的账号。〔来源：AN-2bc92c3c6380；liveshow-proto/prototype/annotations/user.js；search-results.html/场景描述/1〕
- [REQ-40e02f89bd30] 搜索关键词：回填来源页关键词；去除首尾空格后不能为空。〔来源：AN-1e913c560092；liveshow-proto/prototype/annotations/user.js；search-results.html/字段/3〕
- [REQ-2d4beeaefb29] 用户头像、昵称：展示匹配账号的当前资料。〔来源：AN-c1839edf31dc；liveshow-proto/prototype/annotations/user.js；search-results.html/字段/4〕
- [REQ-ca0a9c12ec62] 房间号：账号有主播身份时显示房间号，非主播不显示。〔来源：AN-78df0e65d158；liveshow-proto/prototype/annotations/user.js；search-results.html/字段/5〕
- [REQ-071020a0b13a] 无匹配结果时保留搜索框并展示空状态。〔来源：AN-aa19607f00c4；liveshow-proto/prototype/annotations/user.js；search-results.html/业务规则/1〕
- [REQ-0d5340455b00] 按账号搜索，每个匹配账号展示一条结果；有主播身份且正在直播时显示「直播中」标记，未开播主播及非主播账号均不显示。〔来源：AN-f32d316d898c；liveshow-proto/prototype/annotations/user.js；search-results.html/业务规则/2〕
- [REQ-517b2a4a3b1f] 点击直播中的结果 -> 进入直播间。〔来源：AN-675a735653c6；liveshow-proto/prototype/annotations/user.js；search-results.html/交互/1〕
- [REQ-77596e9bf81c] 点击未开播账号 -> 有主播身份进入主播主页，非主播进入用户主页。〔来源：AN-d9c61570ae30；liveshow-proto/prototype/annotations/user.js；search-results.html/交互/2〕
- [REQ-dcaeabbc4a86] 修改关键词并提交 -> 刷新搜索结果。〔来源：AN-c8da2ada1f6e；liveshow-proto/prototype/annotations/user.js；search-results.html/交互/3〕

## 首页与发现 / 充值福利
页面：welfare-center.html；实际承载：liveshow-proto/prototype/pages/user/home/welfare-center.html；实体页面。
- [META-d46b811f1699] 页面用途：用户进入邀请好友、充值福利，并在每日签到和任务中心手动领取金币奖励。〔来源：AN-2cb6333d2932；liveshow-proto/prototype/annotations/user.js；welfare-center.html/场景描述/1〕
- [REQ-3f2252f33285] 邀请好友：展示当前活动配置的邀请奖励入口及奖励提示；点击进入邀请好友页。〔来源：AN-b31d95a544b5；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/3〕
- [REQ-43b7a1560781] 充值福利：展示当前活动配置的充值赠送金币提示；点击进入充值页。〔来源：AN-420761c6605d；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/4〕
- [REQ-6333241d4b9b] 连续签到天数：展示当前账号连续手动签到成功的天数；仅登录不增加该数值。〔来源：AN-3c555e9d37c2；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/5〕
- [REQ-338d84306791] 签到进度：按连续签到周期展示已签到日、今日和后续签到日；每个日期同时展示对应金币奖励。〔来源：AN-ea813b9552b6；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/6〕
- [REQ-bcf3754632ce] 签到操作状态：今日未签到时显示「签到」；领取成功后显示「已签到」并禁用。〔来源：AN-ec0a591d228f；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/7〕
- [REQ-36bf288c0aac] 任务项：展示后台配置的任务名称、当前进度、目标值、金币奖励和领取状态。〔来源：AN-d825bb623db7；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/8〕
- [REQ-68d029516a5c] 任务操作状态：未完成显示去完成或不可领取提示；完成后显示领取；领取成功后显示已领取。〔来源：AN-305a0a9cfa81；liveshow-proto/prototype/annotations/user.js；welfare-center.html/字段/9〕
- [REQ-e29f8734021f] 点击卡片进入「邀请好友」P009。〔来源：AN-83c02ca3c91b；liveshow-proto/prototype/annotations/user.js；welfare-center.html/邀请好友/1〕
- [REQ-28f7a6e9b28a] 卡片「+10」数值取后台配置的每成功邀请 1 位好友可获得的金币奖励。〔来源：AN-f3af7c27fc9b；liveshow-proto/prototype/annotations/user.js；welfare-center.html/邀请好友/2〕
- [REQ-850b9e1ebe7d] 点击卡片进入充值页。〔来源：AN-3cd42b867d04；liveshow-proto/prototype/annotations/user.js；welfare-center.html/充值福利/1〕
- [REQ-18d996ff9b5b] 卡片「+10金币」取套餐中赠送金币最多的数值。〔来源：AN-fdb7a34736eb；liveshow-proto/prototype/annotations/user.js；welfare-center.html/充值福利/2〕
- [REQ-bf6df4adff21] 每日签到与任务中心统一由管理后台「运营配置 → 任务配置」维护；配置四语名称、启停状态、生效时间、用户动作、统计维度、统计周期及条件对应的金币奖励。〔来源：AN-f276a12af028；liveshow-proto/prototype/annotations/user.js；welfare-center.html/配置来源/1〕
- [REQ-9ef14bed6d45] 仅启用且处于生效时间内的任务产生新进度；停用不回收已领取奖励。奖励仅为金币，不自动发放。〔来源：AN-71e6a2b0e8db；liveshow-proto/prototype/annotations/user.js；welfare-center.html/配置来源/2〕
- [REQ-1ad040f36e2f] 同一任务至少配置一个条件；条件为互不重复的正整数，每个条件对应正整数金币奖励。〔来源：AN-018f207c4e3d；liveshow-proto/prototype/annotations/user.js；welfare-center.html/配置来源/3〕
- [REQ-97320cbd6d67] 对应后台「登录 App → 连续登录天数」，按「连续第 n 天」配置金币奖励；连续天数以手动签到成功为准，仅登录不计为签到。〔来源：AN-3704a5dba138；liveshow-proto/prototype/annotations/user.js；welfare-center.html/每日签到/1〕
- [REQ-ab820593d424] 页面展示连续签到天数、已签到日、今天及后续金币奖励；各天奖励取当前后台配置，不固定为演示金额。〔来源：AN-1a2efdd41676；liveshow-proto/prototype/annotations/user.js；welfare-center.html/每日签到/2〕
- [REQ-4d0358d54570] 点击「签到」成功后才计入连续天数并领取当日金币；提示到账，按钮变为「已签到」并禁用，同一账号同一日不可重复领取。〔来源：AN-5526ea7e1ce4；liveshow-proto/prototype/annotations/user.js；welfare-center.html/每日签到/3〕
- [REQ-87b984d32f90] 当日未手动签到即断签，即使已登录也拿不到当日奖励；次日登录后须重新手动签到，连续天数及奖励从第 1 天重算。〔来源：AN-ce1a866e72b7；liveshow-proto/prototype/annotations/user.js；welfare-center.html/每日签到/4〕
- [REQ-6a839b7cf44a] 超过后台配置的最高连续天数 n 后，第 n+1 天及以后每天签到均领取第 n 天的奖励，直至断签；不自动循环。〔来源：AN-73428c8255b7；liveshow-proto/prototype/annotations/user.js；welfare-center.html/每日签到/5〕
- [REQ-6015ad1aaa2f] 例如仅配置第 1 天 +20、第 2 天 +30，则连续第 3 天起每天签到均领取 +30；断签后重新签到按第 1 天领取 +20。〔来源：AN-6bac01a2fd00；liveshow-proto/prototype/annotations/user.js；welfare-center.html/每日签到/6〕
- [REQ-a1b71811e1c9] 任务使用后台预置动作及对应指标，如观看时长、赠礼次数或金币数、分享次数、有效邀请人数；展示名称、目标值、当前进度、金币奖励和领取状态。〔来源：AN-38aee9dd544a；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心/1〕
- [REQ-cf5cb96cec55] 每日、每周、每月任务在新周期开始时进度归零；无周期任务在任务有效期内持续累计。可选周期以后台对应指标为准。〔来源：AN-d8aec613d8b8；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心/2〕
- [REQ-c1796e8ee348] 达到条件后可手动领取该档金币；同一账号、同一任务周期内，每个条件独立领取一次。未达成不能领取，已领取不能重复领取。〔来源：AN-26eeeca7b67f；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心/3〕
- [REQ-dcd9abdf8544] 任务达标获得奖励后，须在获得奖励当天 23:59 之前手动领取；周期任务（每日、每周、每月）和无周期任务均适用，领取有效期不随任务周期延长。逾期奖励失效，不自动发放，也不能补领。领取时须校验有效期，已失效则不发放奖励并提示「奖励已失效」。〔来源：AN-93af6d8b7271；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心/4〕
- [REQ-4a4228d2744b] 领取成功后更新领取记录、钱包金币余额及金币流水；重复点击或重试不得重复入账。领取失败时不改为已领取，提示失败并允许重试。〔来源：AN-1b812744068d；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心领取/1〕
- [REQ-82a825a0e8be] 当前 P012：观看任务未完成时点击奖励提示「任务尚未完成」；分享入口提示前往直播间分享；已达成的赠礼任务点击奖励后显示「已领取」。〔来源：AN-d32a83fca466；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心领取/2〕
- [REQ-ee270bd5644f] 游客可浏览并进入邀请好友页；签到、领奖和充值操作跳转登录。运营账号可浏览福利一级页，点击其中任意功能入口提示“运营账号无法操作”，不参与签到、任务及领奖。〔来源：AN-6b16656f275c；liveshow-proto/prototype/annotations/user.js；welfare-center.html/任务中心领取/4〕

## 首页与发现 / 全部任务
页面：all-tasks.html；实际承载：liveshow-proto/prototype/pages/user/home/all-tasks.html；实体页面。
- [META-eaac41e7b27d] 页面用途：用户查看充值福利页入口中的三项任务。〔来源：AN-c3dd4f38015f；liveshow-proto/prototype/annotations/user.js；all-tasks.html/场景描述/1〕
- [REQ-3c7e1d9db425] 任务范围：仅展示观看直播 30 分钟、送出任意 1 个礼物、分享 1 个直播间。〔来源：AN-4febf99ec236；liveshow-proto/prototype/annotations/user.js；all-tasks.html/字段/3〕
- [REQ-c37bf0e509ae] 任务进度：展示当前值、目标值和完成状态。〔来源：AN-572282672944；liveshow-proto/prototype/annotations/user.js；all-tasks.html/字段/4〕
- [REQ-139bf5a1451b] 奖励：展示任务完成后可领取的金币数量。〔来源：AN-09bc3ecd9cdb；liveshow-proto/prototype/annotations/user.js；all-tasks.html/字段/5〕
- [REQ-30377b8c96cd] 操作状态：包括去完成、领取和已领取。〔来源：AN-25e1a9ba3c89；liveshow-proto/prototype/annotations/user.js；all-tasks.html/字段/6〕
- [REQ-0d35c6a64bd9] 页面不展示任务统计和任务分类标题。〔来源：AN-0051633d1322；liveshow-proto/prototype/annotations/user.js；all-tasks.html/业务规则/1〕
- [REQ-64027ca93b29] 每个任务实例仅可领取一次，领取后生成对应资产流水。〔来源：AN-48e51057bbc9；liveshow-proto/prototype/annotations/user.js；all-tasks.html/业务规则/2〕
- [REQ-3f5f1f726bc3] 运营账号不可进入本页、做任务或领取任务奖励。〔来源：AN-187a2e02c026；liveshow-proto/prototype/annotations/user.js；all-tasks.html/业务规则/3〕
- [REQ-ba1acdb7a8b1] 数据范围：展示当前任务中心的观看直播、送礼和分享任务；按页面配置顺序排列。〔来源：AN-ac6a52710bec；liveshow-proto/prototype/annotations/user.js；all-tasks.html/业务规则/4〕
- [REQ-29668ff3f5d8] 点击去完成 -> 进入对应功能或提示前往路径。〔来源：AN-8c95e92c24b3；liveshow-proto/prototype/annotations/user.js；all-tasks.html/交互/1〕
- [REQ-9d9b03964763] 点击领取 -> 发放奖励并切换为已领取；点击已领取 -> 不重复发放。〔来源：AN-3582b6ca8551；liveshow-proto/prototype/annotations/user.js；all-tasks.html/交互/2〕
- [REQ-c3c7d67d479f] 点击返回 -> 回到充值福利页。〔来源：AN-ae3a2acccdda；liveshow-proto/prototype/annotations/user.js；all-tasks.html/交互/3〕

## 首页与发现 / 邀请好友
页面：invite-friends.html；实际承载：liveshow-proto/prototype/pages/user/home/invite-friends.html；实体页面。
- [META-11cb19d2d658] 页面用途：用户邀请新用户，并查看邀请人数、奖励和邀请记录。〔来源：AN-d0f2ef28087b；liveshow-proto/prototype/annotations/user.js；invite-friends.html/场景描述/1〕
- [REQ-1028b23fcb3c] 已邀请好友：展示成功邀请的好友人数。〔来源：AN-3fc69f1a5b67；liveshow-proto/prototype/annotations/user.js；invite-friends.html/字段/3〕
- [REQ-99c9c053820e] 累计获得金币：展示邀请好友获得的金币合计。〔来源：AN-2c7972f441ca；liveshow-proto/prototype/annotations/user.js；invite-friends.html/字段/4〕
- [REQ-d8079cb13024] 邀请记录：展示好友昵称和邀请日期。〔来源：AN-8d536e869a99；liveshow-proto/prototype/annotations/user.js；invite-friends.html/字段/5〕
- [REQ-d2b2aa2425d8] 每成功邀请 1 位好友，可获得 10 金币。〔来源：AN-5583a1a6ac88；liveshow-proto/prototype/annotations/user.js；invite-friends.html/业务规则/1〕
- [REQ-7ccfa7f59f24] 累计获得金币 = 成功邀请好友人数 × 10；具体奖励以活动页面展示为准。〔来源：AN-56e96a672591；liveshow-proto/prototype/annotations/user.js；invite-friends.html/业务规则/2〕
- [REQ-abc8e1c873de] 数据范围：当前账号成功邀请的好友及对应奖励；邀请记录按邀请日期倒序展示并分页。〔来源：AN-287fe31857af；liveshow-proto/prototype/annotations/user.js；invite-friends.html/业务规则/3〕
- [REQ-14266a0a495d] 切换奖励/邀请记录 -> 展示统计或记录列表。〔来源：AN-4b34377e55a4；liveshow-proto/prototype/annotations/user.js；invite-friends.html/交互/1〕
- [REQ-0c5010af8a9d] 邀请记录超过一页 -> 点击上一页/下一页翻页。〔来源：AN-eb71aee2e760；liveshow-proto/prototype/annotations/user.js；invite-friends.html/交互/2〕
- [REQ-790ed0bb1222] 点击邀请好友 -> 打开复制链接、发送给好友和保存图片选项。〔来源：AN-3918a2a2caad；liveshow-proto/prototype/annotations/user.js；invite-friends.html/交互/3〕

## 消息与社交 / 消息
页面：message-center.html；实际承载：liveshow-proto/prototype/pages/user/social/message-center.html；实体页面。
- [META-bfc8c813d3cd] 页面用途：用户查看系统通知、互动通知、私信和粉丝团会话，并进入对应消息页面。〔来源：AN-52d6382965ba；liveshow-proto/prototype/annotations/user.js；message-center.html/场景描述/1〕
- [REQ-9ea66b054fba] 会话：展示头像、名称、最后一条消息、最后消息时间和未读数。〔来源：AN-b7e53f7b62de；liveshow-proto/prototype/annotations/user.js；message-center.html/字段/3〕
- [REQ-9b2c6b9ae474] 排序：系统通知、互动通知固定置顶；其余会话按最后消息时间倒序，时间相同时按会话 ID 从大到小排序。〔来源：AN-a790237a88be；liveshow-proto/prototype/annotations/user.js；message-center.html/字段/4〕
- [REQ-322341a6d597] 消息分类：包括系统通知、互动通知、私信和粉丝团群聊。〔来源：AN-cfebd2d0df34；liveshow-proto/prototype/annotations/user.js；message-center.html/字段/5〕
- [REQ-e39bf53173c0] 系统通知、互动通知固定置顶在顶部，不随最后消息时间参与会话排序；私信和粉丝群分别维护会话。〔来源：AN-8263771f000a；liveshow-proto/prototype/annotations/user.js；message-center.html/业务规则/1〕
- [REQ-ee1bffb9a9c7] 私信发送权限按好友、非好友 3 条上限和拉黑关系校验。〔来源：AN-639eb8dbec5d；liveshow-proto/prototype/annotations/user.js；message-center.html/业务规则/2〕
- [REQ-7cbf38d7f635] 粉丝群仅对有效团籍成员开放；团籍失效后移除对应会话权限。〔来源：AN-98f8dd6a2c78；liveshow-proto/prototype/annotations/user.js；message-center.html/业务规则/3〕
- [REQ-8dfe9d1f36e0] 数据范围：当前登录账号的私信和有效粉丝团会话；系统通知、互动通知使用独立入口。〔来源：AN-dffd02b88a88；liveshow-proto/prototype/annotations/user.js；message-center.html/业务规则/4〕
- [REQ-0030121a7cb5] 排序：会话按最后消息时间倒序；时间相同按会话 ID 从大到小排序。〔来源：AN-4d7c503518f3；liveshow-proto/prototype/annotations/user.js；message-center.html/业务规则/5〕
- [REQ-4f52093f9a0d] 进入会话 -> 清除该会话未读数；收到新消息 -> 更新最后消息、时间、排序和未读数。〔来源：AN-3d3e4aa39ede；liveshow-proto/prototype/annotations/user.js；message-center.html/交互/1〕

## 消息与社交 / 系统通知
页面：system-notifications.html；实际承载：liveshow-proto/prototype/pages/user/social/system-notifications.html；实体页面。
- [META-1321fe756915] 页面用途：用户查看平台发送的系统通知及账号、公会、主播相关处理结果。〔来源：AN-b9d3c2ef2929；liveshow-proto/prototype/annotations/user.js；system-notifications.html/场景描述/1〕
- [REQ-3da68feb6dc8] 通知类型：包括公会关系、主播身份、直播权限和平台系统通知。〔来源：AN-798caa9e7238；liveshow-proto/prototype/annotations/user.js；system-notifications.html/字段/3〕
- [REQ-b815484d7cf5] 通知时间：按服务端生成时间倒序；时间相同时按通知 ID 从大到小排序。〔来源：AN-3448d938573c；liveshow-proto/prototype/annotations/user.js；system-notifications.html/字段/4〕
- [REQ-76c920926c62] 已读状态：首次进入或查看后记为已读。〔来源：AN-d73af9fafa1d；liveshow-proto/prototype/annotations/user.js；system-notifications.html/字段/5〕
- [REQ-17348b568b27] 通知内容只读，不提供跳转或业务操作；通知只用于传达结果，不进入私信会话，也不作为身份或权限的最终判断。〔来源：AN-7a1fb86d90df；liveshow-proto/prototype/annotations/user.js；system-notifications.html/业务规则/1〕
- [REQ-de9855455478] 数据范围：发送给当前账号的系统通知。〔来源：AN-169a4c8e7b53；liveshow-proto/prototype/annotations/user.js；system-notifications.html/业务规则/2〕
- [REQ-593bd42602eb] 排序：按通知生成时间倒序；时间相同按通知 ID 从大到小排序。〔来源：AN-e8baa17d6702；liveshow-proto/prototype/annotations/user.js；system-notifications.html/业务规则/3〕

## 个人中心 / 我的
页面：profile.html；实际承载：liveshow-proto/prototype/pages/user/profile/profile.html；实体页面。
- [META-28cbc8b571bf] 页面用途：登录用户查看自己的资料、社交数量和金币余额，进入关系列表、充值、装扮、设置及主播相关功能。〔来源：AN-aac512aae374；liveshow-proto/prototype/annotations/user.js；profile.html/场景描述/1〕
- [REQ-0af0c40e3094] 用户资料：展示当前账号头像、昵称、用户 ID 和财富等级。〔来源：AN-a11e648c2aa9；liveshow-proto/prototype/annotations/user.js；profile.html/字段/3〕
- [REQ-375ca5bfa73a] 勋章：在昵称下方展示当前有效且已佩戴的勋章，最多展示 10 枚；不足 10 枚不占位，没有可展示勋章时隐藏该区域。〔来源：AN-289765009a1a；liveshow-proto/prototype/annotations/user.js；profile.html/字段/4〕
- [REQ-59d825f4d64b] 社交数据：粉丝数为当前仍关注我的账号数；关注数为我当前仍关注的账号数；好友数为当前有效好友数。〔来源：AN-c6cee87031ec；liveshow-proto/prototype/annotations/user.js；profile.html/字段/5〕
- [REQ-95d55a52be24] 金币余额：展示当前账号可用金币；负余额时不可消费。〔来源：AN-513c36bd3175；liveshow-proto/prototype/annotations/user.js；profile.html/字段/6〕
- [REQ-3da3ec958323] 用户和主播共用同一账号、个人资料、社交关系和金币资产。〔来源：AN-a694a642a077；liveshow-proto/prototype/annotations/user.js；profile.html/业务规则/1〕
- [REQ-9f3b94844a96] 未获得主播身份时进入主播申请流程；获得主播身份后仍须校验直播权限才能开播。〔来源：AN-e75adbf44229；liveshow-proto/prototype/annotations/user.js；profile.html/业务规则/2〕
- [REQ-a638e46b1a6a] 进入社交数据 -> 打开对应关系列表；点击好友数 -> 进入好友列表 P043；点击粉丝数 -> 进入粉丝列表 P045；进入主播中心 -> 按主播身份和权限展示申请或主播工具；充值 -> 进入充值流程。〔来源：AN-1bd6540f7b35；liveshow-proto/prototype/annotations/user.js；profile.html/交互/1〕
- [REQ-556ed1b3015d] 入口：功能说明；权限判断〔来源：AN-d7dc051f9317；liveshow-proto/prototype/annotations/user.js；profile.html/交互/2〕
- [REQ-d36d1a894d3a] 编辑资料：修改头像、昵称等个人资料。；登录用户可用。〔来源：AN-e66b4408c756；liveshow-proto/prototype/annotations/user.js；profile.html/交互/4〕
- [REQ-1f89377126bd] 设置：管理账号、通知和隐私设置。；登录用户可用。〔来源：AN-366b843f8dfe；liveshow-proto/prototype/annotations/user.js；profile.html/交互/5〕
- [REQ-12a79d7f6b5e] 充值：进入充值流程购买金币。；登录用户可用；受支付渠道限制。〔来源：AN-781e7d453d7e；liveshow-proto/prototype/annotations/user.js；profile.html/交互/6〕
- [REQ-4c86f5e6f24c] 我的装扮：查看和佩戴头像框、聊天气泡、勋章。；登录用户可用。〔来源：AN-1ff6d6ee4bf8；liveshow-proto/prototype/annotations/user.js；profile.html/交互/7〕
- [REQ-011cb5115ed5] 粉丝团：查看已加入的主播粉丝团。；登录用户可用。〔来源：AN-a59af0ed3a75；liveshow-proto/prototype/annotations/user.js；profile.html/交互/8〕
- [REQ-21f616b62d75] 邀请奖励：查看邀请规则并邀请好友。；登录用户可用。〔来源：AN-093a6a6b9248；liveshow-proto/prototype/annotations/user.js；profile.html/交互/9〕
- [REQ-e6f7cdd9a68b] 开始直播：进入开播设置或主播申请流程。；已具备主播身份进入主播中心，否则进入申请流程，页面：申请成为主播 P014-1。〔来源：AN-52423cc339e3；liveshow-proto/prototype/annotations/user.js；profile.html/交互/10〕
- [REQ-67663823ae82] 主播中心：查看主播数据和主播工具。；已具备主播身份进入主播中心，否则进入申请流程，页面：申请成为主播 P014-1。〔来源：AN-de322140c1a6；liveshow-proto/prototype/annotations/user.js；profile.html/交互/11〕
- [REQ-0e6ef4d24cf8] 公会中心：进入公会申请和关系页面。；登录用户可用；申请、管理操作按公会关系判断。〔来源：AN-a80a88b35d81；liveshow-proto/prototype/annotations/user.js；profile.html/交互/12〕
- [REQ-7b14e4db972c] 黑名单：查看和管理已拉黑账号。；登录用户可用。〔来源：AN-71f9c9bcd22f；liveshow-proto/prototype/annotations/user.js；profile.html/交互/13〕
- [REQ-436b5410bae5] 联系客服：进入客服联系方式页面。；登录用户可用。〔来源：AN-9836d9d972f1；liveshow-proto/prototype/annotations/user.js；profile.html/交互/14〕

## 个人中心 / 联系客服
页面：customer-service.html；实际承载：liveshow-proto/prototype/pages/user/profile/customer-service.html；实体页面。
- [META-9362005a2a0d] 页面用途：用户查看并复制平台官方客服联系方式。〔来源：AN-869c0c20a2e4；liveshow-proto/prototype/annotations/user.js；customer-service.html/场景描述/1〕
- [REQ-46c79377c746] WhatsApp：展示运营配置的官方客服 WhatsApp 号码。〔来源：AN-01e3d9bcfb52；liveshow-proto/prototype/annotations/user.js；customer-service.html/字段/3〕
- [REQ-fa4258fa09ce] 官方客服邮箱：展示运营配置的官方客服邮箱。〔来源：AN-ae09f3983f0d；liveshow-proto/prototype/annotations/user.js；customer-service.html/字段/4〕
- [REQ-af4c270dc656] 联系方式由运营统一配置；配置变更后更新页面展示内容。〔来源：AN-a2bcee4941d4；liveshow-proto/prototype/annotations/user.js；customer-service.html/业务规则/1〕
- [REQ-35c830c03f70] 点击 WhatsApp 或官方客服邮箱 -> 复制对应内容，并提示“已复制”。〔来源：AN-563daabf47e3；liveshow-proto/prototype/annotations/user.js；customer-service.html/交互/1〕

## 消息与社交 / 粉丝列表
页面：follower-list.html；实际承载：liveshow-proto/prototype/pages/user/social/follower-list.html；实体页面。
- [META-28c33dbf6ad0] 页面用途：用户浏览和搜索关注自己的账号，点击头像进入对应用户或主播主页。〔来源：AN-1359ee3a327d；liveshow-proto/prototype/annotations/user.js；follower-list.html/场景描述/1〕
- [REQ-971575bcd0ea] 搜索关键词：按用户名模糊筛选，忽略大小写；空值展示全部粉丝。〔来源：AN-ca7b5895f981；liveshow-proto/prototype/annotations/user.js；follower-list.html/字段/3〕
- [REQ-06781424f98c] 粉丝头像 / 昵称：展示当前仍关注我的账号资料。〔来源：AN-63468fadc254；liveshow-proto/prototype/annotations/user.js；follower-list.html/字段/4〕
- [REQ-06f48abd9575] 等级：展示该账号的财富等级。〔来源：AN-aa43712d1922；liveshow-proto/prototype/annotations/user.js；follower-list.html/字段/5〕
- [REQ-0a573c5787e8] 勋章：展示该账号当前显示的勋章。〔来源：AN-629221197c9e；liveshow-proto/prototype/annotations/user.js；follower-list.html/字段/6〕
- [REQ-65d4e3a6786a] 展示当前仍关注我的账号；粉丝关系与好友关系分别维护，取消关注后从列表移除。〔来源：AN-4a3c0a8f5de9；liveshow-proto/prototype/annotations/user.js；follower-list.html/业务规则/1〕
- [REQ-bd3781ae9b8f] 搜索不改变结果的相对顺序。〔来源：AN-0a26d56ce987；liveshow-proto/prototype/annotations/user.js；follower-list.html/业务规则/2〕
- [REQ-a59769f33803] 输入用户名 -> 实时模糊筛选；无匹配时显示空态。点击头像 -> 进入对应用户或主播主页。〔来源：AN-c0e2810ed4e8；liveshow-proto/prototype/annotations/user.js；follower-list.html/交互/1〕

## 个人中心 / 我的关注
页面：my-following.html；实际承载：liveshow-proto/prototype/pages/user/profile/my-following.html；实体页面。
- [META-c27a184f66d1] 页面用途：用户浏览已关注账号，查看主播开播状态，并进入主页或正在直播的房间。〔来源：AN-d04f92eee9bb；liveshow-proto/prototype/annotations/user.js；my-following.html/场景描述/1〕
- [REQ-6b2cbb975486] 搜索关键词：按用户名模糊筛选，忽略大小写；空值展示全部关注。〔来源：AN-07d63a7c7d36；liveshow-proto/prototype/annotations/user.js；my-following.html/字段/3〕
- [REQ-0d78c93a8230] 关注账号：展示头像、昵称及当前开播状态。〔来源：AN-74b587c11e08；liveshow-proto/prototype/annotations/user.js；my-following.html/字段/4〕
- [REQ-6c3299222bc1] 开播状态：关联当前有效直播场次，场次结束后立即更新。〔来源：AN-4c0efadc7c8e；liveshow-proto/prototype/annotations/user.js；my-following.html/字段/5〕
- [REQ-623dea81d02d] 仅展示当前有效关注关系；取消关注或拉黑后立即移出。〔来源：AN-4ba125be3ae5；liveshow-proto/prototype/annotations/user.js；my-following.html/业务规则/1〕
- [REQ-b18d9ab21ef7] 按关注时间倒序排列，最新关注排在最前。〔来源：AN-6d8e202e5a5c；liveshow-proto/prototype/annotations/user.js；my-following.html/业务规则/2〕
- [REQ-72beab840243] 输入用户名 -> 实时模糊筛选；无匹配时显示空态。开播主播 -> 按房间准入规则进入直播间；点击头像 -> 进入对应主页。〔来源：AN-4b8ab9a3870f；liveshow-proto/prototype/annotations/user.js；my-following.html/交互/1〕

## 个人中心 / 我的装扮
页面：my-decoration.html；实际承载：liveshow-proto/prototype/pages/user/profile/my-decoration.html；实体页面。
- [META-70671cf23579] 页面用途：用户查看、购买和管理头像框、聊天气泡及勋章。〔来源：AN-a2f48e558095；liveshow-proto/prototype/annotations/user.js；my-decoration.html/场景描述/1〕
- [REQ-82444db2b0ad] 当前头像 / 勋章：展示当前账号头像及已佩戴勋章。〔来源：AN-5f30b9e32ceb；liveshow-proto/prototype/annotations/user.js；my-decoration.html/字段/3〕
- [REQ-315592591f20] 页面分类：已拥有、装扮商城。〔来源：AN-a18c0f64b4a6；liveshow-proto/prototype/annotations/user.js；my-decoration.html/字段/4〕
- [REQ-7ec007a72525] 已拥有分类：按头像框、聊天气泡、勋章三个 Tab 展示；卡片沿用各装扮原有展示样式，当前分类内每行展示 2 个道具。点击卡片直接佩戴或卸下，不跳转新页面。〔来源：AN-8ce7b263b434；liveshow-proto/prototype/annotations/user.js；my-decoration.html/字段/5〕
- [REQ-d0c6e46cb920] 勋章佩戴数量：勋章 Tab 显示“勋章数量/5”，如“勋章3/5”；列表下方不重复显示佩戴数量。〔来源：AN-9d7242d8ae91；liveshow-proto/prototype/annotations/user.js；my-decoration.html/字段/6〕
- [REQ-9c8849c7f7ca] 商城商品：展示装扮效果、名称、可佩戴期限值和金币价格；页面不显示期限字段名，限时格式为 DD/MM/YYYY-DD/MM/YYYY；已购买商品显示“已获得”。〔来源：AN-6b5e056f647f；liveshow-proto/prototype/annotations/user.js；my-decoration.html/字段/7〕
- [REQ-121c9aebf014] 道具可来自金币购买、任务、活动或平台发放；上下架只控制能否获得。〔来源：AN-e71c31cfad1c；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/1〕
- [REQ-7228b94a5deb] 用户已持有道具可在后台配置的可佩戴期限内使用；结束日期为不限时，道具可永久佩戴。〔来源：AN-72287acff3f7；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/2〕
- [REQ-a634bce5f1b9] 有结束日期的道具过期后不可佩戴，并在用户端显示“已过期”。〔来源：AN-0aebcb1ff50b；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/3〕
- [REQ-d8055d299140] 仅后台标记为允许购买且已上架的道具进入商城；身份、等级和活动专属勋章不可购买。〔来源：AN-461bfdaebc7a；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/4〕
- [REQ-3a34cf10d98f] 永久和限时道具已拥有后均不可重复购买；购买成功不可退款。〔来源：AN-c773c62015d3；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/5〕
- [REQ-56f699ab014d] 运营账号点击我的装扮入口提示“运营账号无法操作”，不得进入查看、佩戴或购买流程；虚拟金币仅可赠送普通礼物和定制礼物。〔来源：AN-e981a0887e6f；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/6〕
- [REQ-135008fb4450] 头像框和聊天气泡同类最多佩戴 1 个，新佩戴会自动卸下旧道具；勋章最多同时佩戴 5 枚。已拥有列表按已佩戴、未佩戴、已失效排列，同一状态内按获得时间倒序排列。〔来源：AN-b30e4c8c7471；liveshow-proto/prototype/annotations/user.js；my-decoration.html/业务规则/7〕
- [REQ-971eafce429b] 已拥有卡片 -> 直接佩戴或卸下并刷新状态，不跳转新页面；失效道具不可点击。勋章达到 5 枚后，需先卸下一枚。购买 -> 打开购买弹窗。金币充足时依次展示装扮预览、道具名称及期限、金币价格和操作按钮，不显示标题及分隔线，价格不显示字段名；按钮为“取消”和“购买”。购买成功 -> 弹窗显示“购买成功”及“继续购买”“去佩戴”按钮；继续购买关闭弹窗并停留商城，去佩戴返回“我的装扮-已拥有”并自动切换至对应装扮分类。金币不足时仅显示“金币余额（金币图标 + 当前余额）不足，请先充值”及“取消”“去充值”按钮，不显示装扮、价格和“金币不足”标题。实际购买状态根据用户实时金币余额判断。〔来源：AN-5e830f924100；liveshow-proto/prototype/annotations/user.js；my-decoration.html/交互/1〕

## 个人中心 / 视图-装扮商城
页面：views/my-decoration/store.html；实际承载：liveshow-proto/prototype/pages/user/profile/my-decoration.html；同一实体页面的状态或弹层视图。
- [REQ-964e0be5b065] 商城按头像框、聊天气泡、勋章分类，展示名称、可佩戴期限和金币价格；已购买商品显示“已获得”。〔来源：AN-1e527ee8880f；liveshow-proto/prototype/annotations/user.js；views/my-decoration/store.html/字段/1〕
- [REQ-d2faa5ffb1d6] 仅展示允许购买且已上架的商品；已拥有商品不可重复购买。运营账号不可使用虚拟金币购买装扮，不展示购买入口。〔来源：AN-573c53ae64c4；liveshow-proto/prototype/annotations/user.js；views/my-decoration/store.html/业务/1〕

## 个人中心 / 视图-购买确认
页面：views/my-decoration/purchase-confirm.html；实际承载：liveshow-proto/prototype/pages/user/profile/my-decoration.html；同一实体页面的状态或弹层视图。
- [REQ-3399ecc6c459] 运营账号不进入本流程。普通用户取消 -> 关闭弹窗且不购买；购买 -> 再次校验商品状态、真实金币余额和持有状态，校验通过后扣款并加入已拥有。成功后弹窗显示“购买成功”及“继续购买”“去佩戴”按钮；继续购买关闭弹窗并停留商城，去佩戴返回“我的装扮-已拥有”并自动切换至对应装扮分类。〔来源：AN-ad7fe1b3241b；liveshow-proto/prototype/annotations/user.js；views/my-decoration/purchase-confirm.html/交互/1〕

## 个人中心 / 视图-金币不足
页面：views/my-decoration/insufficient.html；实际承载：liveshow-proto/prototype/pages/user/profile/my-decoration.html；同一实体页面的状态或弹层视图。
- [REQ-61c8fdb4de84] 仅适用于普通用户。真实金币不足 -> 不生成购买记录；去充值 -> 进入充值页。运营账号不进入装扮购买或充值流程。〔来源：AN-09df6133468a；liveshow-proto/prototype/annotations/user.js；views/my-decoration/insufficient.html/交互/1〕

## 直播 / 直播间（普通房）
页面：live-room.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；实体页面。
- [REQ-57159bd6dcea] 直播场次：每次开播生成唯一场次，关联主题、封面、分类和房型。〔来源：AN-397a7cc42b8a；liveshow-proto/prototype/annotations/user.js；live-room.html/字段/3〕
- [REQ-f17ba9344db0] 主播：展示主播账号、主播等级、财富等级和关系状态。〔来源：AN-d760abfcce0c；liveshow-proto/prototype/annotations/user.js；live-room.html/字段/4〕
- [REQ-74f873405346] 在线人数：当前场次实时在线用户数。〔来源：AN-0d9578b0495d；liveshow-proto/prototype/annotations/user.js；live-room.html/字段/5〕
- [REQ-4b70e3647a61] 本场贡献的真实金币部分：当前场次内成功送出的各礼物单价 × 数量之和；幸运礼物返奖不冲减本场贡献。〔来源：AN-25e88756980b；liveshow-proto/prototype/annotations/user.js；live-room.html/字段/6〕
- [REQ-b51596deb199] 公屏消息：展示系统、评论、进房和礼物消息，按服务端时间排序。〔来源：AN-5b54a2aed166；liveshow-proto/prototype/annotations/user.js；live-room.html/字段/7〕
- [REQ-13cdd1512b85] 普通用户的账号封禁、双方账号拉黑和本场踢出优先于粉丝团成员、密码和门票准入规则；命中任一限制时不能进入。〔来源：AN-ba434af2113c；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/1〕
- [REQ-af9fad486413] 巡房人员从有效巡房任务进入时，以本次巡房会话身份绕过主播黑名单、本场踢出、粉丝团成员、密码和门票限制；不改变原账号关系、粉丝团身份或门票状态。〔来源：AN-9d548a72ccac；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/2〕
- [REQ-b93f80b008ba] 巡房会话期间，主播和房管不能将巡房人员拉黑或踢出；巡房结束后恢复普通用户规则。平台封禁或巡房权限失效仍不可进入。〔来源：AN-f133bcdf3e47；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/3〕
- [REQ-376b8a19b5d1] 门票仅对当前场次有效，同场重复进入不收费；场次结束或被踢出后失效且不退款。运营账号进入门票房免票，不生成门票订单，不扣减虚拟金币。〔来源：AN-eb61763eaf04；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/4〕
- [REQ-4db2b3820871] 禁言仅限制当前场次公屏发言；踢出后本场不可重进；两种状态均在下一场恢复。〔来源：AN-3b3ea2fdcd25；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/5〕
- [REQ-917c1f13f2fe] 成员限制仅在进房时校验；已在房内的非成员不退出，离开后再次进入时拦截。成员仍需输入密码，运营账号可绕过限制。〔来源：AN-0400c806d230；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/6〕
- [REQ-da24c55c1f7b] 幸运礼物每个礼物独立开奖；实际消费 = 投入金币 - 返奖金币。x1、x10、x100 的长期平均返还比例分别为 96%、97%、98%。〔来源：AN-10c3cbb3bb8c；liveshow-proto/prototype/annotations/user.js；live-room.html/业务/7〕
- [REQ-f747b49f63f3] 进入普通房 -> 直接展示直播内容，不显示封面遮挡或操作弹窗。〔来源：AN-74f2e234ee4f；liveshow-proto/prototype/annotations/user.js；live-room.html/交互/1〕
- [REQ-8db6c2c015b3] 普通用户进入密码房或门票房 -> 由全屏封面和毛玻璃遮挡直播内容，页面中央显示对应准入弹窗；密码房开启粉丝团成员限制时，非成员先显示访问受限，成员才显示密码输入。运营账号进入门票房免票。〔来源：AN-6dc37ddc485a；liveshow-proto/prototype/annotations/user.js；live-room.html/交互/2〕
- [REQ-b74f97b0fa2e] 命中双方拉黑、本场踢出或非粉丝团成员限制 -> 显示访问受限拦截；点击“返回”回到来源页，无来源时返回首页。〔来源：AN-016664679769；liveshow-proto/prototype/annotations/user.js；live-room.html/交互/3〕
- [REQ-0e71e110e899] 巡房任务进入 -> 不显示访问拦截，正常展示直播并显示“巡房中”；主播或房管端不展示对该巡房人员的拉黑、踢出操作，服务端同时拒绝相关请求。〔来源：AN-6fb2f5c691e2；liveshow-proto/prototype/annotations/user.js；live-room.html/交互/4〕
- [REQ-76b2ce8de4d4] 举报直播 -> 仅直播中生成当前场次举报工单；举报用户 -> 生成账号举报工单。〔来源：AN-ba9730356cbe；liveshow-proto/prototype/annotations/user.js；live-room.html/交互/5〕
- [REQ-e79b6832166d] 清屏 -> 仅清除当前设备上的公屏显示，不删除服务端消息记录。〔来源：AN-d2f06861da3d；liveshow-proto/prototype/annotations/user.js；live-room.html/交互/6〕

## 直播 / 举报直播间
页面：live-room-report.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-report.html；实体页面。
- [REQ-5cd0945cbfbd] 举报原因：必填，单选；选项由平台配置。〔来源：AN-93a787aaa18f；liveshow-proto/prototype/annotations/user.js；live-room-report.html/字段/3〕
- [REQ-627cf0c2bdde] 补充说明：选填，最多 200 个字符。〔来源：AN-fa53b956ef2d；liveshow-proto/prototype/annotations/user.js；live-room-report.html/字段/4〕
- [REQ-70c22d54cfec] 仅直播中可举报当前场次；场次结束后未处理的直播举报失效。〔来源：AN-fb2c6837ab43；liveshow-proto/prototype/annotations/user.js；live-room-report.html/业务/1〕
- [REQ-34dd77b1a73d] 举报类型包括色情低俗、涉及宗教政治、暴恐血腥、未成年人有害、其他。〔来源：AN-5c93bf1cdfac；liveshow-proto/prototype/annotations/user.js；live-room-report.html/业务/2〕
- [REQ-c35cc339a6a2] 未选择举报原因 -> 提交按钮不可用。〔来源：AN-e0d380b2ae62；liveshow-proto/prototype/annotations/user.js；live-room-report.html/交互/1〕
- [REQ-70ff17b1f30a] 提交成功 -> 生成直播场次举报工单并返回直播间。〔来源：AN-70bb0dcd9935；liveshow-proto/prototype/annotations/user.js；live-room-report.html/交互/2〕

## 直播 / 举报用户
页面：live-room-user-report.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-user-report.html；实体页面。
- [REQ-8dc817ffb01f] 举报原因：必填，单选；选项由平台配置。〔来源：AN-7dd8416ab33a；liveshow-proto/prototype/annotations/user.js；live-room-user-report.html/字段/3〕
- [REQ-cd5a56a9a6ac] 补充说明：选填，最多 200 个字符。〔来源：AN-b1800366df25；liveshow-proto/prototype/annotations/user.js；live-room-user-report.html/字段/4〕
- [REQ-8c322038d82f] 举报对象为当前账号；举报类型包括色情低俗、涉及宗教政治、暴恐血腥、未成年人有害、其他。〔来源：AN-bfa79e34c152；liveshow-proto/prototype/annotations/user.js；live-room-user-report.html/业务/1〕
- [REQ-cec4572b7621] 未选择举报原因 -> 提交按钮不可用。〔来源：AN-25e55374fd36；liveshow-proto/prototype/annotations/user.js；live-room-user-report.html/交互/1〕
- [REQ-a9bb248fbeab] 提交成功 -> 生成账号举报工单并返回来源页。〔来源：AN-9a72fa3d329d；liveshow-proto/prototype/annotations/user.js；live-room-user-report.html/交互/2〕

## 直播 / 直播间（主播）
页面：live-room-host.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；实体页面。
- [REQ-9676a9ade1da] 房间 ID：主播固定直播间标识；每次开播另生成直播场次。〔来源：AN-db272e312739；liveshow-proto/prototype/annotations/user.js；live-room-host.html/字段/3〕
- [REQ-b10ded34886b] 在线人数：当前场次实时在线用户数。〔来源：AN-bad802712cc0；liveshow-proto/prototype/annotations/user.js；live-room-host.html/字段/4〕
- [REQ-42ac3281734a] 本场贡献的真实金币部分：当前场次内成功送出的各礼物单价 × 数量之和；幸运礼物返奖不冲减本场贡献。〔来源：AN-020e40af1cf9；liveshow-proto/prototype/annotations/user.js；live-room-host.html/字段/5〕
- [REQ-2a8f3fad0f15] 待处理连麦邀请：展示当前仍有效的邀请数量。〔来源：AN-012ff738576c；liveshow-proto/prototype/annotations/user.js；live-room-host.html/字段/6〕
- [REQ-7ba223129156] 公屏消息：展示评论、进房、礼物和系统消息；被屏蔽单条消息从当前公屏移除。〔来源：AN-2fe3665fbd7c；liveshow-proto/prototype/annotations/user.js；live-room-host.html/字段/7〕
- [REQ-5ebd79b1bbf8] 平台或公会关闭直播权限 -> 立即结束当前场次；历史消息、消费、处置和收益记录保留。〔来源：AN-1fce6f9b0b8c；liveshow-proto/prototype/annotations/user.js；live-room-host.html/业务/1〕
- [REQ-a19d6b159f0b] 房管最多 3 人，授权长期有效；主播可取消房管、禁言、踢出或屏蔽单条评论。〔来源：AN-92e2f717a12a；liveshow-proto/prototype/annotations/user.js；live-room-host.html/业务/2〕
- [REQ-683b4064d1ec] 禁言和恢复发言仅作用于当前场次；踢出后用户本场不可重进。〔来源：AN-2926bb2514e8；liveshow-proto/prototype/annotations/user.js；live-room-host.html/业务/3〕
- [REQ-dd74c6de0e69] 仅普通房支持两位主播连麦；双方须在播、未连麦且无账号拉黑关系。任一方结束直播 -> 邀请和连麦失效。〔来源：AN-08a893315808；liveshow-proto/prototype/annotations/user.js；live-room-host.html/业务/4〕
- [REQ-a23c71d1add5] 新连麦邀请 -> 更新待处理数量；提示停留 4 秒，期间新增邀请只更新当前提示。〔来源：AN-67d01003649d；liveshow-proto/prototype/annotations/user.js；live-room-host.html/交互/1〕
- [REQ-5d70e4b3fe67] 设置或取消房管、禁言或恢复发言、踢出用户、结束直播 -> 二次确认后执行；房管达到 3 人时保留入口，点击提示“已达3人上限”。〔来源：AN-59e844d7fe81；liveshow-proto/prototype/annotations/user.js；live-room-host.html/交互/2〕
- [REQ-70272cb84275] 屏蔽评论 -> 仅移除被选中的单条公屏消息。〔来源：AN-477c120c582c；liveshow-proto/prototype/annotations/user.js；live-room-host.html/交互/3〕
- [REQ-cb8c3a1edd82] 清屏 -> 仅清除当前主播设备上的公屏显示。〔来源：AN-10a565296311；liveshow-proto/prototype/annotations/user.js；live-room-host.html/交互/4〕

## 直播 / 直播间-主播-密码房
页面：live-room-host-password.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host-password.html；实体页面。
- [REQ-b6277a0d35dd] 房间密码：必填，必须为 4-12 个数字，归属当前直播场次。〔来源：AN-e53c0d97aa31；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/字段/3〕
- [REQ-c94dec07483e] 本场贡献榜：依次按贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；完整排序后显示前 99 名，不设并列名次。〔来源：AN-f9d56abdd3a5；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/字段/4〕
- [REQ-72bac391175c] 在线观众排序：按贡献时依次比较贡献值、粉丝等级、财富等级、用户 ID；按停留时长时依次比较停留时长、贡献值、粉丝等级、财富等级、用户 ID。数值从高到低，ID 从小到大。〔来源：AN-8146c54c50d7；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/字段/5〕
- [REQ-1983325e1d0c] 用户输入当前有效密码后才可进入；账号封禁、拉黑或本场踢出仍优先拦截。〔来源：AN-a2af8b34276c；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/业务/1〕
- [REQ-12c9166afbcd] 密码房不支持连麦。〔来源：AN-efd0b7913cf6；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/业务/2〕
- [REQ-8a690c62169c] 主播修改密码后，已通过旧密码验证的在线用户不强制退出；用户退出后再次进入，必须输入新密码。〔来源：AN-f106a962cd05；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/业务/3〕
- [REQ-26f99f94541b] 排序所需等级缺失时按 0 级处理；有效消费冲正后重新计算贡献值和排名。账号注销后保留历史贡献，名称显示“账号已注销”，不能进入主页。充值退款不撤销已完成消费。〔来源：AN-24493f38a0ee；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/业务/4〕
- [REQ-6bfb13242954] 修改密码 -> 仅接受 4-12 个数字；不符合时保留输入并提示“密码必须是4-12个数字”；校验通过后更新本场有效密码。转发 -> 选择粉丝群或好友并确认；结束直播 -> 二次确认后关闭本场。〔来源：AN-39787080bfba；liveshow-proto/prototype/annotations/user.js；live-room-host-password.html/交互/1〕

## 直播 / 直播间-连麦中-主播
页面：live-room-cohost-active.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-cohost-active.html；实体页面。
- [REQ-1c00ca749351] 连麦主播：固定展示当前两位主播的账号和直播画面。〔来源：AN-69375c951c10；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/字段/3〕
- [REQ-c6f9368faf6c] 连麦状态：双方在播且连接有效时为连麦中。〔来源：AN-23eb88921ffd；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/字段/4〕
- [REQ-2d333ddec570] 本场数据：双方直播场次的观众、消息和收益分别累计，不合并账务。〔来源：AN-040a81068d46；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/字段/5〕
- [REQ-461d464f7160] 本场贡献榜：依次按贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；完整排序后显示前 99 名，不设并列名次。〔来源：AN-4622718a4ae3；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/字段/6〕
- [REQ-3e8170f29339] 在线观众排序：按贡献时依次比较贡献值、粉丝等级、财富等级、用户 ID；按停留时长时依次比较停留时长、贡献值、粉丝等级、财富等级、用户 ID。数值从高到低，ID 从小到大。〔来源：AN-4c23049c8cac；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/字段/7〕
- [REQ-563e5bc0aaf7] 仅普通房支持两位主播连麦；不支持观众上麦、三人及以上连线。〔来源：AN-cd8c2cdaf938；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/业务/1〕
- [REQ-cbb251726985] 任一方结束直播 -> 连麦立即结束，另一方直播继续。〔来源：AN-3e026f392ede；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/业务/2〕
- [REQ-b7bee2c7134c] 排序所需等级缺失时按 0 级处理；有效消费冲正后重新计算贡献值和排名。账号注销后保留历史贡献，名称显示“账号已注销”，不能进入主页。充值退款不撤销已完成消费。〔来源：AN-dda781796f7c；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/业务/3〕
- [REQ-724f42aad9ee] 退出连麦确认 -> 双方退出连麦，各自直播继续；取消 -> 保持连麦。〔来源：AN-5f86b65e83ba；liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html/交互/1〕

## 直播 / 直播结束页（观众）
页面：live-end-viewer.html；实际承载：liveshow-proto/prototype/pages/user/live/live-end-viewer.html；实体页面。
- [REQ-744c9b682e12] 主播头像 / 名称：展示当前已结束直播场次对应主播的头像和名称。〔来源：AN-dc38d3bbc2ab；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/字段/3〕
- [REQ-087186b73746] 直播结束状态：展示“主播名称 的直播已结束”，表示当前场次已关闭。〔来源：AN-e2946198b756；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/字段/4〕
- [REQ-d96cf6926bbb] 结束提示：展示“主播正在整理本场内容”；仅为结束后的页面提示，不代表新场次已创建。〔来源：AN-cc0993eba57c；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/字段/5〕
- [REQ-093bf5df7b3b] 返回首页：离开结束页并回到直播广场。〔来源：AN-9f6e0a4b0a93；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/字段/6〕
- [REQ-c26340580604] 当前直播场次已关闭，不能继续观看、评论、送礼或进入连麦。〔来源：AN-584b9d39f8fb；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/业务/1〕
- [REQ-671e67c30c1e] 本场门票、密码验证和踢出/禁言状态同时失效；历史消费记录保留。〔来源：AN-e14df296d515；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/业务/2〕
- [REQ-294c9aea7171] 主播再次开播会创建新场次，须重新执行对应准入校验。〔来源：AN-dc02e3bd8e95；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/业务/3〕
- [REQ-c6340ce7c243] 返回首页 -> 离开结束页；重复打开已结束房间 -> 仍进入当前结束状态，不进入新场次。〔来源：AN-610c09fe9ff0；liveshow-proto/prototype/annotations/user.js；live-end-viewer.html/交互/1〕

## 直播 / 直播结束页（主播）
页面：live-end-host.html；实际承载：liveshow-proto/prototype/pages/user/live/live-end-host.html；实体页面。
- [REQ-f0b59fd6afb1] 直播时长：当前场次从开始到结束的有效直播时长。〔来源：AN-48a0fae87485；liveshow-proto/prototype/annotations/user.js；live-end-host.html/字段/3〕
- [REQ-67e8fc5109d4] 观看人数：当前场次累计进入人次。〔来源：AN-410216656af8；liveshow-proto/prototype/annotations/user.js；live-end-host.html/字段/4〕
- [REQ-cbc60c5d616f] 本场收益：普通/定制礼物收益 + 门票收益 + 幸运礼物收益；幸运礼物收益 = 送出价值 × 后台比例，默认 1%，返奖不影响。虚拟金币、失败或撤销消费不计入。〔来源：AN-dc9bf351762e；liveshow-proto/prototype/annotations/user.js；live-end-host.html/字段/5〕
- [REQ-26c90db50167] 结束后关闭当前场次；历史消息、消费、处置和收益记录保留，下一次开播创建新场次。〔来源：AN-95f6d1083e8c；liveshow-proto/prototype/annotations/user.js；live-end-host.html/业务/1〕
- [REQ-fd0617a068c8] 查看直播数据 -> 进入当前场次或汇总数据；返回主播中心 -> 离开结束页。〔来源：AN-b99724ded055；liveshow-proto/prototype/annotations/user.js；live-end-host.html/交互/1〕

## 消息与社交 / 好友列表
页面：friend-list.html；实际承载：liveshow-proto/prototype/pages/user/social/friend-list.html；实体页面。
- [META-b19f206bc38a] 页面用途：用户浏览和搜索自己的好友，点击好友整行进入对应用户或主播主页。〔来源：AN-b9ba97d22d5e；liveshow-proto/prototype/annotations/user.js；friend-list.html/场景描述/1〕
- [REQ-1f98d757e221] 搜索关键词：按用户名模糊筛选，忽略大小写；空值展示全部好友。〔来源：AN-97df8b10b973；liveshow-proto/prototype/annotations/user.js；friend-list.html/字段/3〕
- [REQ-e2045547464c] 好友头像 / 昵称：展示当前有效好友的账号资料。〔来源：AN-2edabc2ec082；liveshow-proto/prototype/annotations/user.js；friend-list.html/字段/4〕
- [REQ-ee2d7fae7437] 等级：展示该好友的财富等级。〔来源：AN-5739dbb5a3ce；liveshow-proto/prototype/annotations/user.js；friend-list.html/字段/5〕
- [REQ-256b60dc5e1d] 勋章：展示该好友当前显示的勋章。〔来源：AN-0c74ebce9a6b；liveshow-proto/prototype/annotations/user.js；friend-list.html/字段/6〕
- [REQ-5080a485f149] 接受好友申请后双方进入好友列表；重复申请不生成新记录。〔来源：AN-698f1725fe9e；liveshow-proto/prototype/annotations/user.js；friend-list.html/业务规则/1〕
- [REQ-a500e6f13be3] 删除好友或任一方拉黑 -> 立即从双方列表移除；取消拉黑不自动恢复。〔来源：AN-a6b204a9f8e9；liveshow-proto/prototype/annotations/user.js；friend-list.html/业务规则/2〕
- [REQ-8676bba0cff0] 好友关系与关注关系分别维护。〔来源：AN-8e71af3d29c5；liveshow-proto/prototype/annotations/user.js；friend-list.html/业务规则/3〕
- [REQ-9149cae5b26b] 数据范围：当前账号仍有效的双向好友关系；搜索仅匹配这些好友。〔来源：AN-3fafe489485f；liveshow-proto/prototype/annotations/user.js；friend-list.html/业务规则/4〕
- [REQ-a41619271db7] 搜索不改变结果的相对顺序。〔来源：AN-67388dbeec3b；liveshow-proto/prototype/annotations/user.js；friend-list.html/业务规则/5〕
- [REQ-7adf09e79860] 输入用户名 -> 实时模糊筛选；无匹配时展示空状态。〔来源：AN-18670bd6222f；liveshow-proto/prototype/annotations/user.js；friend-list.html/交互/1〕
- [REQ-0e0a9d37b9cd] 点击好友整行（头像、昵称、等级、勋章或行内空白）-> 进入对方主页；主播进入主播主页，普通用户进入用户主页。〔来源：AN-ebc650e66819；liveshow-proto/prototype/annotations/user.js；friend-list.html/交互/2〕
- [REQ-6a0e0397b14c] 点击返回 -> 进入消息中心。〔来源：AN-b09cf7e66d85；liveshow-proto/prototype/annotations/user.js；friend-list.html/交互/3〕

## 消息与社交 / 互动通知
页面：interaction-notifications.html；实际承载：liveshow-proto/prototype/pages/user/social/interaction-notifications.html；实体页面。
- [META-a015a3f61cc1] 页面用途：用户查看新增关注和好友申请通知，并处理待确认的好友申请。〔来源：AN-4365cc9e66e5；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/场景描述/1〕
- [REQ-fa316e8ebde9] 通知类型：包括新增关注、好友申请、好友申请通过和拒绝。〔来源：AN-327348650413；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/字段/3〕
- [REQ-6638d0f48f9f] 处理状态：好友申请可为待处理、已同意、已拒绝或已失效。〔来源：AN-6e5bbd53c1ce；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/字段/4〕
- [REQ-ac7acaac8831] 发生时间：按服务端时间倒序；时间相同时按通知 ID 从大到小排序。〔来源：AN-d3d208d993a9；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/字段/5〕
- [REQ-039d749c962c] 同一申请双方存在待处理记录时不可重复发送。〔来源：AN-af3ed03ad4fa；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/业务规则/1〕
- [REQ-d3143269edb7] 同意 -> 建立好友关系；拒绝 -> 不建立关系；任一方拉黑 -> 待处理申请失效。〔来源：AN-17a0526e5010；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/业务规则/2〕
- [REQ-c2c029b3b74b] 数据范围：与当前账号相关的关注和好友申请通知。〔来源：AN-4c576c8b4a3a；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/业务规则/3〕
- [REQ-d209e483b9a4] 排序：按发生时间倒序；时间相同按通知 ID 从大到小排序。〔来源：AN-a649df436813；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/业务规则/4〕
- [REQ-d8329a9997bf] 同意或拒绝成功 -> 当前通知更新为处理结果且按钮不可重复点击；点击头像 -> 进入对应用户或主播主页。〔来源：AN-7203b589c4d4；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/交互/1〕
- [REQ-3dd405057a47] 已失效的好友申请仅展示状态，不展示同意、拒绝按钮。〔来源：AN-2e369034fc87；liveshow-proto/prototype/annotations/user.js；interaction-notifications.html/交互/2〕

## 消息与社交 / 1 对 1 私信
页面：direct-message.html；实际承载：liveshow-proto/prototype/pages/user/social/direct-message.html；实体页面。
- [META-0e4b2dceb08c] 页面用途：用户与指定账号进行一对一聊天，发送文字、图片或语音，并进入单聊设置。〔来源：AN-56df961f13d8；liveshow-proto/prototype/annotations/user.js；direct-message.html/场景描述/1〕
- [REQ-19ead9a24c54] 消息：支持文本、图片和语音，按服务端发送时间正序；时间相同时按消息 ID 从小到大排序。〔来源：AN-9b986d29b637；liveshow-proto/prototype/annotations/user.js；direct-message.html/字段/3〕
- [REQ-4fd122fd97bf] 已读状态：对方进入会话后更新已读状态。〔来源：AN-0662aa804c5e；liveshow-proto/prototype/annotations/user.js；direct-message.html/字段/4〕
- [REQ-ef2dad69af57] 好友之间可持续私信；非好友一方最多主动发送 3 条消息。双方各自独立计数，即 A→B 最多 3 条、B→A 最多 3 条。〔来源：AN-8629b26f9845；liveshow-proto/prototype/annotations/user.js；direct-message.html/业务规则/1〕
- [REQ-e8e4f8364d4b] 任一方拉黑后，无法发送消息。见视图-拉黑关系〔来源：AN-6e1a6f5c80d5；liveshow-proto/prototype/annotations/user.js；direct-message.html/业务规则/2〕
- [REQ-8c837cf03a1e] 删除好友会解除好友关系并清空双方聊天记录。〔来源：AN-15cbfc2ba4b3；liveshow-proto/prototype/annotations/user.js；direct-message.html/业务规则/3〕
- [REQ-ed062e4d11db] 同页视图-拉黑关系：在当前会话发送文本、语音或图片后，消息右侧显示红色“❕”，下方显示“消息发送失败，对方拒收”；拒收不计入成功发送条数。〔来源：AN-e75548b1acc4；liveshow-proto/prototype/annotations/user.js；direct-message.html/业务规则/4〕
- [REQ-4cc48aacf17c] 数据范围：当前账号与所选对象的单聊记录。〔来源：AN-a36144148183；liveshow-proto/prototype/annotations/user.js；direct-message.html/业务规则/5〕
- [REQ-0d1b839dbefd] 排序：消息按服务端发送时间正序；时间相同按消息 ID 从小到大排序。〔来源：AN-1ff48b86e2de；liveshow-proto/prototype/annotations/user.js；direct-message.html/业务规则/6〕
- [REQ-631a31f6df90] 发送成功 -> 消息写入会话并更新消息中心；非好友发送满 3 条后继续发送 -> 不生成消息并提示“非好友最多发送三条”；发送失败 -> 显示失败图标并保留消息内容，点击失败图标重试。〔来源：AN-5ffd1a1bd1f2；liveshow-proto/prototype/annotations/user.js；direct-message.html/交互/1〕

## 消息与社交 / 粉丝团群聊
页面：fan-group-chat.html；实际承载：liveshow-proto/prototype/pages/user/social/fan-group-chat.html；实体页面。
- [META-a7b2834bd0c7] 页面用途：粉丝团成员查看群公告和群消息，与主播及其他成员交流，进入群管理。〔来源：AN-ff3c765cbfda；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/场景描述/1〕
- [REQ-a4f295aca996] 群消息：展示发送人、身份标签、内容和发送时间。〔来源：AN-834874506f04；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/字段/3〕
- [REQ-b5c027940215] 直播卡片：保存对应直播场次 ID、封面、主题和直播状态。〔来源：AN-9e58ffd3d175；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/字段/4〕
- [REQ-f64015dd42d4] 发言状态：按有效团籍、单人禁言、全员禁言和平台限制计算。〔来源：AN-1bc5968af04a；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/字段/5〕
- [REQ-56ec777b9716] 仅有效团籍成员可查看和发送群消息。〔来源：AN-093916e9f365；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/业务规则/1〕
- [REQ-76011ad6260c] 退出、被移出或拉黑主播后立即失去群聊权限，历史消息不再开放。〔来源：AN-1b6fb8872e7a；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/业务规则/2〕
- [REQ-87cc31b3e391] 直播卡片关联具体场次，不自动跳转至主播后续新场次。〔来源：AN-b13d3f5adf87；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/业务规则/3〕
- [REQ-afe2b82a1204] 数据范围：当前粉丝群内、当前账号有权限查看的消息。〔来源：AN-aee03541c7b1；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/业务规则/4〕
- [REQ-844c798f0cd0] 排序：聊天消息按发送时间从早到晚展示。〔来源：AN-85fe9ab48254；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/业务规则/5〕
- [REQ-394bc92e0b45] 发送成功 -> 写入群消息并更新会话摘要；点击直播中卡片 -> 按房间规则进入；场次已结束 -> 提示直播已结束。同页“视图-用户被禁言”中，输入框显示“当前被禁言”且不可输入或发送；点击语音、图片、表情均 Toast 提示“当前被禁言”，不打开对应功能。〔来源：AN-9351fa6e54e8；liveshow-proto/prototype/annotations/user.js；fan-group-chat.html/交互/1〕

## 消息与社交 / 群管理（成员）
页面：group-manage-member.html；实际承载：liveshow-proto/prototype/pages/user/social/group-manage-member.html；实体页面。
- [META-78b004a0fb0c] 页面用途：粉丝团成员查看群公告，设置群消息免打扰、举报或退出粉丝群。〔来源：AN-c93bae6b2f3b；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/场景描述/1〕
- [REQ-be7d000d156f] 群公告：展示当前粉丝群的公告内容。〔来源：AN-b7dd30caa3ea；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/字段/3〕
- [REQ-afbde3ae27a9] 群消息免打扰：当前账号对此群的通知开关，不影响消息接收。〔来源：AN-b88387e69310；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/字段/4〕
- [REQ-26afc3a3ec61] 普通成员只能查看群资料、消息免打扰和退出粉丝团，不具备成员管理权限。〔来源：AN-ba09814b33de；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/业务规则/1〕
- [REQ-8bf7930dbac7] 群内发言按有效团籍、单人禁言、全员禁言和平台限制计算。〔来源：AN-58a47ce38adb；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/业务规则/2〕
- [REQ-a0492a84dfb6] 主动退出 -> 团籍和群籍同时解除，粉丝等级与亲密度清零；关注关系不受影响。〔来源：AN-4055bd235d8f；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/业务规则/3〕
- [REQ-43a003d8c23f] 退出粉丝团 -> 二次确认后离开群聊并返回消息中心；消息免打扰只关闭通知，不影响消息接收。〔来源：AN-9915d8699f58；liveshow-proto/prototype/annotations/user.js；group-manage-member.html/交互/1〕

## 消息与社交 / 群管理（群主）
页面：group-manage-owner.html；实际承载：liveshow-proto/prototype/pages/user/social/group-manage-owner.html；实体页面。
- [META-e51107a2a518] 页面用途：粉丝团群主查看和编辑群公告，设置免打扰，并进入群成员管理。〔来源：AN-7d12832a6496；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/场景描述/1〕
- [REQ-b01c59425713] 群公告：展示当前粉丝群的公告内容，群主可编辑，最多 200 字符。〔来源：AN-cd67b6e2a264；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/字段/3〕
- [REQ-75b4379e9eab] 群消息免打扰：当前账号对此群的通知开关，不影响其他成员。〔来源：AN-efe0c57c7772；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/字段/4〕
- [REQ-ad1c58c7a863] 数据范围：当前主播所属粉丝群的群公告和个人通知设置；仅所属主播可编辑公告、进入成员管理。〔来源：AN-03e504c18a50；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/业务规则/1〕
- [REQ-ed73a73d0917] 免打扰只影响当前账号对此群的通知，不影响消息接收或其他成员。〔来源：AN-d5b40d0f807d；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/业务规则/2〕
- [REQ-68d6b7d8d78b] 编辑公告 -> 弹窗回填当前公告，支持换行并显示字符计数，最多输入 200 字符；空白内容不可保存。保存后关闭弹窗并更新公告，群成员查看更新后的内容；取消或关闭不保存修改。〔来源：AN-554d2da4a75a；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/交互/1〕
- [REQ-036c0e60df9f] 切换群消息免打扰 -> 更新当前账号对此群的通知设置。〔来源：AN-86eb6a952e03；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/交互/2〕
- [REQ-46ecbad6fafe] 点击群成员管理 -> 进入粉丝团成员页，执行禁言或移除等操作。〔来源：AN-94cfd085b077；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/交互/3〕
- [REQ-bdc5b10ed889] 返回进入粉丝群聊天页。〔来源：AN-3bc6aef15073；liveshow-proto/prototype/annotations/user.js；group-manage-owner.html/交互/4〕

## 消息与社交 / 单聊设置
页面：chat-settings.html；实际承载：liveshow-proto/prototype/pages/user/social/chat-settings.html；实体页面。
- [META-df72ea46390c] 页面用途：用户查看当前私信对象，设置该会话免打扰，或对聊天对象进行举报、拉黑。〔来源：AN-63a6fe17d548；liveshow-proto/prototype/annotations/user.js；chat-settings.html/场景描述/1〕
- [REQ-0fea8101aff7] 聊天对象：展示当前私信对象的头像、昵称、等级与勋章。〔来源：AN-f0c85130b475；liveshow-proto/prototype/annotations/user.js；chat-settings.html/字段/3〕
- [REQ-c2ec1fe35a84] 消息免打扰：控制该单聊通知，不影响消息收发。〔来源：AN-926168221397；liveshow-proto/prototype/annotations/user.js；chat-settings.html/字段/4〕
- [REQ-5541ba5cbdc0] 消息免打扰仅关闭该单聊的消息通知，不影响消息收发。〔来源：AN-1b95ce54cabb；liveshow-proto/prototype/annotations/user.js；chat-settings.html/业务规则/1〕
- [REQ-9ebb6e575423] 拉黑后双方不能搜索、关注、申请好友、私信或进入对方主持的直播间。〔来源：AN-5a8f4a51cfac；liveshow-proto/prototype/annotations/user.js；chat-settings.html/业务规则/2〕
- [REQ-75dd5551e443] 拉黑会解除双方关注、好友和加入对方粉丝团的关系，使待处理好友申请失效，并删除双方私信会话和聊天记录；取消拉黑后不恢复。〔来源：AN-20203ede51e7；liveshow-proto/prototype/annotations/user.js；chat-settings.html/业务规则/3〕
- [REQ-fd903e6b2ca7] 拉黑 -> 显示确认弹窗；确认后执行并删除当前会话，取消不改变关系。举报 -> 进入当前账号的举报流程。〔来源：AN-111d3a1279eb；liveshow-proto/prototype/annotations/user.js；chat-settings.html/交互/1〕

## 个人中心 / 黑名单管理
页面：blacklist-management.html；实际承载：liveshow-proto/prototype/pages/user/profile/blacklist-management.html；实体页面。
- [META-72a88cab659c] 页面用途：用户查看自己拉黑的账号，并通过确认操作取消拉黑。〔来源：AN-020812bff616；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/场景描述/1〕
- [REQ-c126763bb274] 黑名单用户：展示头像和昵称。〔来源：AN-c8cbe24655e0；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/字段/3〕
- [REQ-000792392af7] A 拉黑 B 后生成 A→B 的拉黑记录，B 进入 A 的黑名单；限制双向生效。若 B 另行拉黑 A，则两条记录分别取消。〔来源：AN-0883144bde64；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/1〕
- [REQ-16cfbeeea18a] 拉黑后双向解除关注和好友关系，使待处理好友申请失效；双方加入对方粉丝团的关系和已有房管关系同步解除，粉丝团即对应粉丝群。〔来源：AN-840c14424fd4；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/2〕
- [REQ-143d6ffe8ceb] 好友关系解除后，双方会话从私信列表删除并清空聊天记录。〔来源：AN-4a12c83a7135；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/3〕
- [REQ-87fde6cd3083] 拉黑期间双方不能搜索、关注、申请好友或私信；首页、分类、搜索和推荐不展示对方的直播间卡片。〔来源：AN-01d350691744；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/4〕
- [REQ-8f59e22685d3] 双方不能进入对方主持的直播间；主播拉黑直播间内的对方时，对方立即退出。〔来源：AN-228e91502f9c；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/5〕
- [REQ-c67850bd3fe7] 双方处于同一第三方直播间时，不能查看对方主页或 @ 对方；处于同一第三方粉丝团时，不能点击查看对方主页。〔来源：AN-970fcbe5dcb2；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/6〕
- [REQ-f5e511bd4cd3] 取消拉黑仅解除当前拉黑记录，不恢复关注、好友、好友申请、粉丝团、房管、会话和聊天记录。〔来源：AN-4ea5bb9aa098；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/7〕
- [REQ-dc74156d7b15] 平台管理员和有效巡房会话不受普通黑名单准入限制；巡房结束后恢复限制，原拉黑记录不删除。〔来源：AN-a82b8926edf5；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/8〕
- [REQ-d8cf5577aee7] 数据范围：当前账号主动拉黑且尚未解除的账号，不列出仅拉黑了当前用户的账号。〔来源：AN-ac448770f6d4；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/9〕
- [REQ-f47128bb78d9] 按拉黑时间倒序排列，最新操作排在最前。〔来源：AN-75dca462b4e5；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/业务规则/10〕
- [REQ-6d27692459f2] 从用户主页、主播主页或聊天设置点击拉黑 -> 显示确认弹窗；确认后执行并同步清理关系、会话和聊天记录，取消不改变状态。〔来源：AN-593cbdc27774；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/交互/1〕
- [REQ-11ba82bb2413] 取消拉黑 -> 二次确认后从列表移除；请求失败 -> 保持原状态并提示“请求失败”。〔来源：AN-a80a833659a3；liveshow-proto/prototype/annotations/user.js；blacklist-management.html/交互/2〕

## 公会管理 / 公会中心
页面：guild-management.html；实际承载：liveshow-proto/prototype/pages/user/guild/guild-management.html；实体页面。
- [META-b585a6d04acf] 页面用途：用户浏览公会、按公会名称或 ID 搜索，并选择公会填写入会申请；通过“我的”查看自己的公会关系和申请记录。〔来源：AN-49247aa72a23；liveshow-proto/prototype/annotations/user.js；guild-management.html/场景描述/1〕
- [REQ-e52d5f8a66cb] banner 图：后台配置。〔来源：AN-b9900e8928f0；liveshow-proto/prototype/annotations/user.js；guild-management.html/字段/3〕
- [REQ-7b0a49843766] 搜索关键词：按公会名称或 ID 模糊匹配；空值展示本页配置范围内全部公会。〔来源：AN-9f2a104cbf10；liveshow-proto/prototype/annotations/user.js；guild-management.html/字段/4〕
- [REQ-c5c08a29841c] 公会头像 / 名称 / ID：展示公会当前头像、名称和唯一标识。〔来源：AN-a1ad8e6e7398；liveshow-proto/prototype/annotations/user.js；guild-management.html/字段/5〕
- [REQ-814c02fd6d93] 公会简介：展示公会简介；超出单行的部分省略。〔来源：AN-33e0eb9c7d72；liveshow-proto/prototype/annotations/user.js；guild-management.html/字段/6〕
- [REQ-a2f9d5efc6bf] 主播人数：展示该公会的主播人数。〔来源：AN-238153b2f747；liveshow-proto/prototype/annotations/user.js；guild-management.html/字段/7〕
- [REQ-1e84c6b05730] 申请状态：申请、申请中或已入会；可用性遵循申请限制。〔来源：AN-1d3ca050e956；liveshow-proto/prototype/annotations/user.js；guild-management.html/字段/8〕
- [REQ-0128eccb6fcd] 数据范围：展示平台后台配置为本页展示的公会；停用公会不展示、不可被搜索。公会数量不固定为 5 条。〔来源：AN-b0bb0ef7d709；liveshow-proto/prototype/annotations/user.js；guild-management.html/业务规则/1〕
- [REQ-331d58f28877] 排序：沿用后台配置列表的顺序；搜索结果保持原有顺序，不按名称、ID 或主播人数重新排序。〔来源：AN-3acf8f458d4c；liveshow-proto/prototype/annotations/user.js；guild-management.html/业务规则/2〕
- [REQ-0715b12323ee] 搜索范围：在上述公会范围内按名称或 ID 模糊匹配；关键词为空时展示全部，包含已加入或申请中的公会。〔来源：AN-9f8b63129352；liveshow-proto/prototype/annotations/user.js；guild-management.html/业务规则/3〕
- [REQ-df508ec6eaf4] 已加入公会或存在处理中入会申请时，不可再次申请其他公会。〔来源：AN-2e2dcc759c22；liveshow-proto/prototype/annotations/user.js；guild-management.html/业务规则/4〕
- [REQ-77184f7c489f] 输入公会名称或 ID -> 实时筛选；点击搜索或按 Enter 结果一致；无匹配时展示空状态。〔来源：AN-e3634feb787f；liveshow-proto/prototype/annotations/user.js；guild-management.html/交互/1〕
- [REQ-0c2c04b1a8b2] 点击“申请” -> 携带所选公会进入填写申请单 P030-1；点击“我的” -> 进入我的公会 P032，查看公会关系和申请记录。〔来源：AN-fa8c07eb3002；liveshow-proto/prototype/annotations/user.js；guild-management.html/交互/2〕
- [REQ-8e4e01d78b49] 已加入公会或存在处理中入会申请时，申请按钮置灰，不可点击。〔来源：AN-c99e8632e073；liveshow-proto/prototype/annotations/user.js；guild-management.html/交互/3〕

## 公会管理 / 申请加入公会
页面：guild-application-form.html；实际承载：liveshow-proto/prototype/pages/user/guild/guild-application-form.html；实体页面。
- [META-db17453f3d29] 页面用途：用户为所选公会填写姓名、电话并上传认证材料，提交入会申请。〔来源：AN-0a266c4069f6；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/场景描述/1〕
- [REQ-5ee3b6f134aa] 申请公会：来源于公会选择页，展示所选公会名称。〔来源：AN-f4749e6be4e1；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/字段/3〕
- [REQ-ceba4c98a7af] 姓名：必填，去除首尾空格后不能为空。〔来源：AN-e0a97e96d357；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/字段/4〕
- [REQ-346431dc118a] 电话：必填，使用 +62 印尼手机号。〔来源：AN-c6226d4697a9；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/字段/5〕
- [REQ-90b7bc82b314] 本人照片：必填，仅上传图片。〔来源：AN-70ba7e7bec28；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/字段/6〕
- [REQ-79d0bf462da2] 证件类型：必选，使用单选框选择 KTP（印尼居民身份证）或 SIM（印尼驾驶证），默认选择 KTP。〔来源：AN-09d838f91460；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/字段/7〕
- [REQ-eea2fc98ca34] 证件照片：正面、反面均必填，仅上传与所选证件类型对应的图片。〔来源：AN-0e6e2299facd；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/字段/8〕
- [REQ-133749c488a4] 数据范围：本次选择公会及当前用户填写的申请资料。〔来源：AN-25d89510f7cf；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/业务规则/1〕
- [REQ-6d8fea947ce0] 同一用户只能存在一笔处理中入会申请，且只能加入一个公会。〔来源：AN-ece328681f52；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/业务规则/2〕
- [REQ-ba11a1e6ab77] 提交后进入公会审核；公会同意后自动进入平台审核，无需用户重复提交。〔来源：AN-04dec364bc8c；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/业务规则/3〕
- [REQ-462242468d38] 公会或平台驳回后，本次入会申请作废；用户可以重新选择公会并提交新申请，重新经过公会初审和平台终审。〔来源：AN-183744e9e97d；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/业务规则/4〕
- [REQ-fff97e38fbb4] 任一必填项未完成 -> 提交按钮不可用；切换证件类型 -> 清空已上传的证件正面和反面照片，需要重新上传。〔来源：AN-710d61845466；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/交互/1〕
- [REQ-d2fbf9922c0b] 提交成功 -> 生成处理中申请并进入公会详情。〔来源：AN-1ef23b738d04；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/交互/2〕
- [REQ-f78668563215] 点击更换公会 -> 返回公会选择页。〔来源：AN-c2bf199bdc8e；liveshow-proto/prototype/annotations/user.js；guild-application-form.html/交互/3〕

## 公会管理 / 我的公会
页面：guild-application-records.html；实际承载：liveshow-proto/prototype/pages/user/guild/guild-application-records.html；实体页面。
- [META-8d99e0d0e08b] 页面用途：用户查看自己申请过的公会及当前关系状态，进入公会详情查看入会、退出申请记录和处理结果。〔来源：AN-c8b5351aa377；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/场景描述/1〕
- [REQ-d72906c23271] 公会头像：展示对应公会的头像。〔来源：AN-4d365c71df2d；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/字段/3〕
- [REQ-a928c89adce3] 公会名称：展示对应公会的当前名称。〔来源：AN-115118a9bb2b；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/字段/4〕
- [REQ-d51b9931ad53] 公会 ID：公会的唯一标识。〔来源：AN-0a9c8022cd9d；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/字段/5〕
- [REQ-a12fc7f0f101] 关系状态：展示当前账号与该公会的关系状态：申请中、已加入、已驳回或已退出。〔来源：AN-649118660ebe；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/字段/6〕
- [REQ-79ac284bd1ea] 数据范围：仅展示当前账号申请过的公会，包含申请中、已加入、申请被驳回及已退出的公会；历史记录不会因驳回或退出而移除。〔来源：AN-dffccbde9f0d；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/业务规则/1〕
- [REQ-3a4e7948c61c] 展示单位：同一公会只展示一张卡片，多次入会、退出申请归入该公会详情。〔来源：AN-497603445064；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/业务规则/2〕
- [REQ-33be2218af0e] 排序：按每个公会最近一次入会或退出申请的提交时间倒序排列，最近提交的在前。〔来源：AN-351f5eb5a73a；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/业务规则/3〕
- [REQ-a8135e417055] 卡片展示当前公会关系状态；单笔申请的审核结果在详情中查看。退出申请被驳回时，仍保留已加入关系。〔来源：AN-2cd62bae8340；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/业务规则/4〕
- [REQ-8d7f1a453117] 点击公会卡片 -> 进入对应公会详情 P032-3，查看公会关系及申请时间轴。〔来源：AN-9a16cef8c911；liveshow-proto/prototype/annotations/user.js；guild-application-records.html/交互/1〕

## 公会管理 / 公会详情
页面：guild-detail.html；实际承载：liveshow-proto/prototype/pages/user/guild/guild-detail.html；实体页面。
- [META-ce9e590c1f81] 页面用途：用户查看指定公会资料、当前关系和入会及退出申请时间轴，并在符合条件时申请退出。〔来源：AN-ff07eb474cff；liveshow-proto/prototype/annotations/user.js；guild-detail.html/场景描述/1〕
- [REQ-22354e754881] 公会头像 / 名称 / ID：展示所选公会的当前资料。〔来源：AN-9293f1c64a5e；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/3〕
- [REQ-047b25f77d5e] 关系状态：当前账号与该公会的关系，不等同于单笔申请状态。〔来源：AN-8cd27d28475f；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/4〕
- [REQ-d8e60bd1bed0] 申请类型 / 状态：每条时间轴卡片展示加入或退出申请及其处理状态。〔来源：AN-8cc6d2e746ea；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/5〕
- [REQ-6bdfad279b7f] 提交时间：展示对应申请的提交时间，用于时间轴排序。〔来源：AN-8034f17a026e；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/6〕
- [REQ-80ea107f9655] 处理时间：已处理且有处理时间时展示。〔来源：AN-f60a75c09755；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/7〕
- [REQ-7eee852b271d] 申请：展示该笔申请填写的原因；无内容时隐藏。〔来源：AN-1268ff14276f；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/8〕
- [REQ-d571945c611c] 驳回：申请被驳回且有驳回原因时展示。〔来源：AN-5ffe0018a167；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/9〕
- [REQ-5185e0770bd0] 姓名 / 电话：展开加入申请单的申请资料后，展示该笔申请提交时填写的姓名与电话，只读。〔来源：AN-8a3db400adb1；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/10〕
- [REQ-e98a2fb0de41] 本人照片：展示本次申请提交的本人照片材料。〔来源：AN-99767f5ae9db；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/11〕
- [REQ-818ba2c4fd10] 证件类型 / 正反面照片：展示申请时选择的 KTP 或 SIM 及对应正反面材料，只读。〔来源：AN-00ce352b0bee；liveshow-proto/prototype/annotations/user.js；guild-detail.html/字段/12〕
- [REQ-4197133d59b2] 数据范围：当前账号与所选公会的关系及全部入会、退出申请。〔来源：AN-f99c3dfa9ba7；liveshow-proto/prototype/annotations/user.js；guild-detail.html/业务规则/1〕
- [REQ-e30d8cd28d76] 排序：申请时间轴按提交时间倒序展示。最新排最前。〔来源：AN-1acc3e34f2c1；liveshow-proto/prototype/annotations/user.js；guild-detail.html/业务规则/2〕
- [REQ-6d5c72562ae0] 公会与平台依次审核；公会通过后自动进入平台审核，无需用户再次提交。〔来源：AN-f00186516e33；liveshow-proto/prototype/annotations/user.js；guild-detail.html/业务规则/3〕
- [REQ-3a03d55b07cd] 退会通过或被公会移除 -> 退出公会并失去主播身份；直播权限同步失效。〔来源：AN-60ee6a4c7ffd；liveshow-proto/prototype/annotations/user.js；guild-detail.html/业务规则/4〕
- [REQ-be4abada9332] 同页提供入会申请中、已加入、入会已驳回、退会申请中、退会已驳回、已退出六个视图。退会申请中或被驳回时，公会关系仍为已加入；退会通过后才变为已退出。〔来源：AN-3e481e4530f2；liveshow-proto/prototype/annotations/user.js；guild-detail.html/业务规则/5〕
- [REQ-bf5340d9ebc8] 所有视图中的加入申请单均保留该笔申请的资料快照，不受审核状态或当前公会关系影响；资料只读，不随个人资料后续变更。图片以材料占位展示，不显示文件名。〔来源：AN-fe3bea8863b4；liveshow-proto/prototype/annotations/user.js；guild-detail.html/业务规则/6〕
- [REQ-3f511ec12906] 已加入且无处理中退会申请 -> 展示“申请退出”，点击进入退出申请页；其他状态不展示该入口。〔来源：AN-7586f4f1b34f；liveshow-proto/prototype/annotations/user.js；guild-detail.html/交互/1〕
- [REQ-14e3be4a1844] 点击返回 -> 进入我的公会 P032。〔来源：AN-61753ed7daf0；liveshow-proto/prototype/annotations/user.js；guild-detail.html/交互/2〕
- [REQ-e8b8a4fe440a] 每张加入申请单的申请资料默认收起；点击“申请资料”展开，再次点击收起，各申请单独立控制。〔来源：AN-1ee06b6b79c9；liveshow-proto/prototype/annotations/user.js；guild-detail.html/交互/3〕

## 公会管理 / 申请退出公会
页面：guild-leave-application.html；实际承载：liveshow-proto/prototype/pages/user/guild/guild-leave-application.html；实体页面。
- [META-db4ddc1384c1] 页面用途：已加入公会的用户填写退会原因，提交退出当前公会的申请。〔来源：AN-6dbfbacce31a；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/场景描述/1〕
- [REQ-4adce05cbed3] 当前公会：来源于当前有效公会关系，只读。〔来源：AN-0af088f2160a；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/字段/3〕
- [REQ-02d8a01510f8] 退会原因：必填，去除首尾空格后不能为空。〔来源：AN-593458a405d9；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/字段/4〕
- [REQ-63e0747ae182] 同一时间只能存在一笔处理中退会申请。〔来源：AN-65382814c61e；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/业务规则/1〕
- [REQ-07eddabd29bb] 公会驳回 -> 保留公会关系和主播身份，可重新提交。〔来源：AN-413478aaa334；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/业务规则/2〕
- [REQ-187659c2dddc] 退会申请通过或被公会移出 -> 立即结束当前直播、退出公会并失去主播身份；主播创建的粉丝团立即解散，所有成员的团籍和群聊权限解除，粉丝等级和亲密度清零。以后重新认证成为主播时，需重新创建粉丝团。〔来源：AN-edb7015561b5；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/业务规则/3〕
- [REQ-f73c1b223eaa] 数据范围：当前账号已加入的公会及本次退出原因；不得为其他用户或无关系公会提交退出。〔来源：AN-b5727e4e82b0；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/业务规则/4〕
- [REQ-fd33dcc75cb2] 退会原因为空 -> 提交按钮不可用；填写有效原因后按钮可用；提交成功 -> 生成处理中申请。〔来源：AN-cd4eb385f8c2；liveshow-proto/prototype/annotations/user.js；guild-leave-application.html/交互/1〕

## 消息与社交 / 用户主页
页面：user-home.html；实际承载：liveshow-proto/prototype/pages/user/social/user-home.html；实体页面。
- [META-073415879674] 页面用途：用户查看指定账号的资料、社交数据及加入的粉丝团，并进行关注、加好友、私信、举报或拉黑。〔来源：AN-9ae1e9945860；liveshow-proto/prototype/annotations/user.js；user-home.html/场景描述/1〕
- [REQ-2d3dd2a1a9fc] 用户资料：展示头像、昵称、用户 ID、签名和有效装扮。〔来源：AN-d4cf361afe11；liveshow-proto/prototype/annotations/user.js；user-home.html/字段/3〕
- [REQ-5abada83e2e9] 粉丝/关注：粉丝数为当前仍关注该用户的账号数；关注数为该用户当前仍关注的账号数。〔来源：AN-cef07c9997d0；liveshow-proto/prototype/annotations/user.js；user-home.html/字段/4〕
- [REQ-98fbb4078051] 送出：累计成功赠送的有效礼物消费。〔来源：AN-415b32f2a5d6；liveshow-proto/prototype/annotations/user.js；user-home.html/字段/5〕
- [REQ-92eca975cc39] 关系状态：分别展示关注、好友和拉黑状态。〔来源：AN-1ff08c1814f1；liveshow-proto/prototype/annotations/user.js；user-home.html/字段/6〕
- [REQ-9b8279d86ad4] 粉丝数为关注该用户的账号数；关注数为该用户关注的账号数；送出为累计成功赠送的礼物价值。〔来源：AN-39e093211a85；liveshow-proto/prototype/annotations/user.js；user-home.html/业务规则/1〕
- [REQ-5273bfbbbf60] 关注关系与好友关系分别维护。〔来源：AN-f30e8996e613；liveshow-proto/prototype/annotations/user.js；user-home.html/业务规则/2〕
- [REQ-64c43dff585c] 拉黑后解除双方关注、好友和加入对方粉丝团的关系，待处理好友申请失效，并删除双方私信会话和聊天记录；取消拉黑后不恢复。〔来源：AN-269438008925；liveshow-proto/prototype/annotations/user.js；user-home.html/业务规则/3〕
- [REQ-59e385cd850a] 数据范围：当前查看对象的资料、社交统计和已加入粉丝团；〔来源：AN-d6f642464ad5；liveshow-proto/prototype/annotations/user.js；user-home.html/业务规则/4〕
- [REQ-96e662bf62f9] 关注或取消关注成功 -> 同步更新关系状态和计数。〔来源：AN-9d91a6fe4acf；liveshow-proto/prototype/annotations/user.js；user-home.html/交互/1〕
- [REQ-b90f85aeaa35] 删除好友确认 -> 解除好友关系并清空双方聊天记录。〔来源：AN-2f3694eb8dcc；liveshow-proto/prototype/annotations/user.js；user-home.html/交互/2〕
- [REQ-57fef5d354d0] 拉黑 -> 显示确认弹窗；确认后执行并切换为拉黑状态，取消不改变关系。〔来源：AN-30b5e95cf417；liveshow-proto/prototype/annotations/user.js；user-home.html/交互/3〕

## 消息与社交 / 主播主页
页面：host-home.html；实际承载：liveshow-proto/prototype/pages/user/social/host-home.html；实体页面。
- [META-9854a13be6a3] 页面用途：用户查看指定主播的资料与社交数据，进入其直播间、粉丝团、礼物展馆或贡献榜。〔来源：AN-46388e8a2948；liveshow-proto/prototype/annotations/user.js；host-home.html/场景描述/1〕
- [REQ-c41f05eeea81] 主播资料：展示账号资料、主播等级、财富等级和当前开播状态。〔来源：AN-a5202a0d938b；liveshow-proto/prototype/annotations/user.js；host-home.html/字段/3〕
- [REQ-879aeceedc7c] 粉丝/关注/观众：粉丝数为当前仍关注该主播的账号数；关注数为该主播当前仍关注的账号数；观众按历史直播场次累计。〔来源：AN-ef0d7ccf1525；liveshow-proto/prototype/annotations/user.js；host-home.html/字段/4〕
- [REQ-71c9dec335e9] 礼物展馆：展示已收礼物种类数和历史成功收到数量。〔来源：AN-4af6caed59ad；liveshow-proto/prototype/annotations/user.js；host-home.html/字段/5〕
- [REQ-523864988163] 粉丝团：展示团名称、等级、成员数及当前用户团籍。〔来源：AN-f1f1b2a4dfa6；liveshow-proto/prototype/annotations/user.js；host-home.html/字段/6〕
- [REQ-572f18705840] 关系状态：分别展示关注、好友、拉黑和私信权限。〔来源：AN-74b76f3e0b5f；liveshow-proto/prototype/annotations/user.js；host-home.html/字段/7〕
- [REQ-0db6b2327cfc] 主播等级与财富等级分别计算，不共用等级值；等级门槛由平台配置。〔来源：AN-1d7290013241；liveshow-proto/prototype/annotations/user.js；host-home.html/业务规则/1〕
- [REQ-9636ec52b474] 直播中才提供当前直播场次入口。〔来源：AN-10ea498cfad1；liveshow-proto/prototype/annotations/user.js；host-home.html/业务规则/2〕
- [REQ-28a73c937bba] 拉黑后解除双方关注、好友和加入对方粉丝团的关系，删除双方私信会话和聊天记录，且不能进入该主播直播间；取消拉黑后不恢复。〔来源：AN-7af00ff8f6c7；liveshow-proto/prototype/annotations/user.js；host-home.html/业务规则/3〕
- [REQ-1edf549c22f7] 粉丝团团籍和群籍同步；退出或被移出后等级与亲密度清零。〔来源：AN-eecaa60c11b1；liveshow-proto/prototype/annotations/user.js；host-home.html/业务规则/4〕
- [REQ-8262ce34db52] 运营账号不能加入粉丝团，不展示加入入口。〔来源：AN-844bf49db40a；liveshow-proto/prototype/annotations/user.js；host-home.html/业务规则/5〕
- [REQ-5de8b3f2a4a8] 数据范围：当前查看主播的资料、历史统计和当前直播状态；不会汇总其他主播数据。〔来源：AN-3287685d1e94；liveshow-proto/prototype/annotations/user.js；host-home.html/业务规则/6〕
- [REQ-94ebe8120ba8] 普通用户已加入粉丝团 -> 进入贡献榜；未加入 -> 打开加入粉丝团视图；运营账号不展示加入入口。〔来源：AN-d47f01f9c26c；liveshow-proto/prototype/annotations/user.js；host-home.html/交互/1〕
- [REQ-8f93d30f6ebf] 好友可直接私信；非好友最多发送 3 条私信。〔来源：AN-a6213885bb55；liveshow-proto/prototype/annotations/user.js；host-home.html/交互/2〕
- [REQ-9dcb86f165ae] 拉黑 -> 显示确认弹窗；确认后执行并切换为拉黑状态，取消不改变关系。〔来源：AN-c80a1764f9d4；liveshow-proto/prototype/annotations/user.js；host-home.html/交互/3〕

## 消息与社交 / 礼物展馆
页面：host-gift-gallery.html；实际承载：liveshow-proto/prototype/pages/user/social/host-gift-gallery.html；实体页面。
- [META-acf722bd0ba0] 页面用途：用户查看指定主播累计收到的礼物、各礼物数量及尚未收到的礼物。〔来源：AN-f0afe37e0304；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/场景描述/1〕
- [REQ-4602f74d4fdd] 累计收到：当前主播累计收到的礼物件数。〔来源：AN-35800ade10a6；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/字段/3〕
- [REQ-7ff8f9f58a0b] 礼物图标 / 名称：展示礼物目录中的礼物。〔来源：AN-50c73177827f；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/字段/4〕
- [REQ-aa63cfd1d413] 收到数量：按当前主播展示对应礼物的收到数量；没有记录时显示未收到。〔来源：AN-087150a562f3；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/字段/5〕
- [REQ-c758325242de] 只统计成功礼物记录；失败或撤销记录不计入。〔来源：AN-a76124dee23f；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/业务规则/1〕
- [REQ-f5b8a3424b62] 礼物下架后不再接收，但历史收到数量和图鉴记录保留。〔来源：AN-0a815ce05982；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/业务规则/2〕
- [REQ-8044906ab18d] 幸运礼物按礼物个数计入收到数量；对应主播收益 = 送出价值 × 后台比例，默认 1%，返奖不影响收益。〔来源：AN-118b25a67fb1；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/业务规则/3〕
- [REQ-7df8b071258b] 数据范围：平台礼物目录与当前查看主播的收礼数量；未收到的礼物也展示。〔来源：AN-9afb4c543fd9；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/业务规则/4〕
- [REQ-34e417b94f9f] 排序：沿用礼物目录的配置顺序。〔来源：AN-237ed77492dd；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/业务规则/5〕
- [REQ-161f7fee35c9] 点击返回 -> 回到对应主播主页。〔来源：AN-b7dc203ad411；liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html/交互/1〕

## 粉丝团 / 我的粉丝团
页面：my-fan-clubs.html；实际承载：liveshow-proto/prototype/pages/user/fan-club/my-fan-clubs.html；实体页面。
- [META-67774ea33c12] 页面用途：用户查看当前已加入的粉丝团及个人团内数据，进入对应粉丝群、贡献榜或主播直播间。〔来源：AN-15791ce9f97c；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/场景描述/1〕
- [REQ-e728d38fdf88] 主播头像 / 主播昵称：该粉丝团所属主播的头像与昵称。头像本身不跳转；直播标记为独立入口。〔来源：AN-8a059d34496e；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/3〕
- [REQ-fe45961bd66f] 粉丝团名称：当前粉丝团名称。〔来源：AN-752468fb703a；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/4〕
- [REQ-5e67af64734c] 团等级（团 Lv.n）：粉丝团整体等级，按该团累计收礼金币匹配后台粉丝团等级配置，不含运营号虚拟金币。〔来源：AN-a0e0d859fdb3；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/5〕
- [REQ-5773069f8c9b] 加入日期：当前用户本次加入该粉丝团的日期；重新入团后更新为本次入团日期。〔来源：AN-62a112bfd581；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/6〕
- [REQ-dc110b656375] 直播标记：所属主播直播中时显示；未开播时隐藏。〔来源：AN-4f94947d1703；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/7〕
- [REQ-68435087e853] 群聊：进入当前卡片对应粉丝群的操作入口，不是群聊数量。〔来源：AN-92d09a5df72e；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/8〕
- [REQ-91d599404b3b] 粉丝等级：当前用户对该主播的个人粉丝等级，仅按本次有效团籍期间的送礼贡献匹配后台配置；退团后清零，重新入团从 0 开始。〔来源：AN-45166558c871；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/9〕
- [REQ-9a127a6822af] 亲密度：当前用户与该主播的一对一关系数值；〔来源：AN-73b3892baa6f；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/10〕
- [REQ-1dccf04f8d96] 总贡献：当前用户给该主播累计刷出的贡献，入团前、入团后、退团期间及重新入团后的都算；以礼物成功送达为准，不含运营号虚拟金币。〔来源：AN-6b0040cea0d1；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/11〕
- [REQ-3f080fdffaf9] 贡献榜头像：展示本周贡献榜前三名用户头像，按排名顺序排列；不足三人按实际人数展示，至少展示 1 个头像，即自己。〔来源：AN-c73891c72088；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/12〕
- [REQ-b21b55b83439] 我的排名：当前用户在该主播粉丝团本周贡献榜中的名次，与贡献榜头像使用相同统计范围。〔来源：AN-25afdd74e027；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/字段/13〕
- [REQ-116da02e3d22] 一张卡片对应一个当前有效团籍；团籍与群籍同步。退出、被移出或粉丝团解散后，移除对应卡片并解除群聊权限。〔来源：AN-fba53f563975；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/业务规则/1〕
- [REQ-f9943d155e02] 主动退出或被移出不影响关注，但粉丝等级和亲密度清零，重新加入不恢复；历史贡献保留，重新加入后继续计入总贡献和对应周期榜单。拉黑主播会同步解除团籍和关注关系。〔来源：AN-fa227855ed93；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/业务规则/2〕
- [REQ-e0f392d27e3d] 团等级和个人粉丝等级使用各自后台配置，不可互用；退款只影响财富等级，不因此扣减此处两类等级。贡献值及榜单的退款调整不等同于等级下降。〔来源：AN-9e3a6724fca8；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/业务规则/3〕
- [REQ-e53313feaa8d] 卡片贡献榜只展示当前有效团籍成员，按本周内给当前主播刷出的全部贡献排名，不按入团时间截断；只要给当前主播刷的都算。退团后不展示，重新入团后恢复对应周期内的贡献统计；运营号及其虚拟金币不计入。〔来源：AN-8c0d30860fae；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/业务规则/4〕
- [REQ-f0b5607d3a9e] 粉丝团按当前用户本次加入时间倒序排列，最新加入的排在最前。〔来源：AN-ab4344fda427；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/业务规则/5〕
- [REQ-7246eea0cf07] 无有效团籍时，显示占位图和「暂未加入粉丝团」，不显示粉丝团卡片。〔来源：AN-217e6810b315；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/业务规则/6〕
- [REQ-afffb431b83e] 点击「群聊」进入该粉丝团群聊；点击贡献榜整行进入该主播粉丝团的本周贡献榜；点击头像上的直播标记进入该主播当前直播间；返回进入「我的」P019。〔来源：AN-d5b4d74da337；liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html/交互/1〕

## 粉丝团 / 贡献榜
页面：fan-contribution-ranking.html；实际承载：liveshow-proto/prototype/pages/user/fan-club/fan-contribution-ranking.html；实体页面。
- [META-29838fe0a083] 页面用途：用户查看指定主播粉丝团的本周、本月或累计贡献榜，以及自己的贡献和排名。〔来源：AN-1b5a5e63f755；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/场景描述/1〕
- [REQ-a28dd52dce0f] 周期：默认本月；按平台业务时区计算，本周从周一 00:00 开始，本月从每月 1 日 00:00 开始，累计统计全部历史有效贡献。〔来源：AN-7dea3e2d953b；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/字段/3〕
- [REQ-5bb579766f2a] 贡献值：贡献值 = 当前用户在所选周期内向该主播成功送出的各礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减贡献值；运营号及其虚拟金币贡献不计入榜单。〔来源：AN-5ae9973257ce；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/字段/4〕
- [REQ-f2d77ae32fb0] 排名：依次按贡献值、当前主播粉丝团内的粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。〔来源：AN-8bd1f0d74fab；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/字段/5〕
- [REQ-7eddb785c4b6] 榜单数量：完成全部排序后显示前 99 名；第 99 名与第 100 名贡献值相同时，继续按后续条件确定顺序。〔来源：AN-57211c3613be；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/字段/6〕
- [REQ-8d9332ffb195] 我的排名：底部置底显示自己的排名和贡献值。〔来源：AN-bb7dec6b0f14；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/字段/7〕
- [REQ-d76a006722e5] 粉丝等级和财富等级最低均为 1 级。〔来源：AN-e636114777c6；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/业务规则/1〕
- [REQ-38cc6d044efe] 失败或撤销的赠送不计入贡献；有效消费冲正后重新计算贡献值和排名，充值退款不撤销已完成送礼。〔来源：AN-b27eb79b7d5d；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/业务规则/2〕
- [REQ-a2041f1578e8] 账号注销后保留历史数值，名称显示“账号已注销”，不可进入主页。〔来源：AN-545548149c8b；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/业务规则/3〕
- [REQ-1804ee8d77c7] 榜单只展示当前有效团籍成员；本周、本月和累计贡献都不按入团时间截断，只要给当前主播刷的都算。退团后不展示，重新入团后恢复对应周期内的历史贡献。〔来源：AN-dc207bed9056；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/业务规则/4〕
- [REQ-87a3b3133e12] 切换周期 -> 同步更新前三名、完整榜单和我的排名；点击用户 -> 进入对应主页。〔来源：AN-e0de9b892dbf；liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html/交互/1〕

## 主播管理 / 主播中心
页面：host-center.html；实际承载：liveshow-proto/prototype/pages/user/host/host-center.html；实体页面。
- [META-8c808c2e3545] 页面用途：主播查看个人资料、累计数据及今日/本月直播指标，进入主播工具。〔来源：AN-9998d2328dd0；liveshow-proto/prototype/annotations/user.js；host-center.html/场景描述/1〕
- [REQ-f6687952acd1] 头像 / 昵称：当前主播账号的头像和昵称。〔来源：AN-f5a98748d0d4；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/3〕
- [REQ-e6b16676c243] 主播等级：昵称旁 Lv.n 为主播等级，按后台主播等级配置匹配分成前累计收益，不含运营号金币；不是财富等级。〔来源：AN-7deeb1188df6；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/4〕
- [REQ-c509c941bb55] 主播 ID：当前主播账号的唯一 ID。〔来源：AN-5c9c6864e457；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/5〕
- [REQ-ac4e8ce159f8] 公会名称：当前所属公会名称；点击进入「我的公会」。〔来源：AN-b55f771bdaa8；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/6〕
- [REQ-4a207c86fc90] 累计收益：当前主播历史累计收益，单位为金币；不随今日/本月切换，不是可提现余额。收益计入口径与数据中心一致。〔来源：AN-c200625677cc；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/7〕
- [REQ-53cfa67ab976] 粉丝：当前关注该主播的用户数，单位为人；不是粉丝团成员数，也不是本期涨粉数。〔来源：AN-ca885a7c217a；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/8〕
- [REQ-5029bd873a25] 直播权限提示：权限关闭时显示「直播权限已关闭，请联系公会」；正常时不显示。〔来源：AN-ebeef5939ff0；liveshow-proto/prototype/annotations/user.js；host-center.html/主播信息字段/9〕
- [REQ-f71f44ece401] 统计周期：默认今日，可切换本月；今日为当前自然日，本月为当前自然月截至当前时间，按平台业务时区计算。〔来源：AN-374a1615666b；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/3〕
- [REQ-2bd6e59a40ad] 收益（今日） / 累计收益（本月）：所选周期内主播收益，单位为金币。普通/定制礼物及门票按成功支付金币汇总；幸运礼物按送出价值 × 后台比例计算，默认 1%；虚拟金币、失败或撤销消费不计入。〔来源：AN-5531850752bc；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/4〕
- [REQ-ec4fe4579a1e] 时长：仅今日显示，表示当日累计直播时长，以小时、分钟展示；与下方有效直播时长分别统计。〔来源：AN-1a1b66868826；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/5〕
- [REQ-f6e3d053e9d0] 有效天数：仅本月显示，表示本月达标自然日数量；单日累计有效直播满 3 小时计 1 天，每日最多计 1 天。〔来源：AN-2991725904e3；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/6〕
- [REQ-ef98e4f35877] 观众人数：按所选今日或本月范围去重统计观众人数；同一用户在该周期内重复进入或观看多场直播只计 1 人。〔来源：AN-1406f942265e；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/7〕
- [REQ-f78a990c2c7d] 涨粉：所选今日或本月范围内的新增粉丝人数，不扣除取关人数，单位为人。〔来源：AN-d79f1d6bc1c0；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/8〕
- [REQ-93644daf8897] 当日有效天进度：仅今日显示：当日累计有效直播时长 / 3h；进度条按两者比值展示，最高 100%。〔来源：AN-62b1d0c87904；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/9〕
- [REQ-19d831cad83e] 有效天达标标记：满 3 小时后在「当日有效天」标题后显示 ✅；未达标时不显示标记。〔来源：AN-79584f5f63f2；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/10〕
- [REQ-c9d28cd68b6b] 数据中心入口：进入直播数据页，查看收益、时长、观众和粉丝等指标。〔来源：AN-c833de485df2；liveshow-proto/prototype/annotations/user.js；host-center.html/数据中心字段/11〕
- [REQ-dc9d1817d6ab] 主播身份和直播权限分别管理；账号可用、公会有效、主播认证通过且直播权限开启时才可开播。〔来源：AN-3cd5bc8d26fe；liveshow-proto/prototype/annotations/user.js；host-center.html/业务规则/1〕
- [REQ-735be47b57d3] 本页仅展示当前主播的数据；顶部历史累计收益、当前粉丝数与数据中心的周期指标分开统计。〔来源：AN-dc2f11c2f29a；liveshow-proto/prototype/annotations/user.js；host-center.html/业务规则/2〕
- [REQ-cdaa58824dac] 切换今日/本月更新四项周期指标；本月隐藏当日有效天进度。〔来源：AN-2acc8d848950；liveshow-proto/prototype/annotations/user.js；host-center.html/交互/1〕
- [REQ-eea47ec9a161] 点击开始直播再次校验权限，通过后进入开播设置；权限关闭时弹窗提示「直播权限已关闭，请联系公会」，点击「知道了」关闭并留在当前页。〔来源：AN-98a608034751；liveshow-proto/prototype/annotations/user.js；host-center.html/交互/2〕
- [REQ-db83d956ac86] 粉丝列表、粉丝团管理、房管管理、分成记录分别进入对应页面；公会名称及公会管理进入「我的公会」。〔来源：AN-4a440fd06a28；liveshow-proto/prototype/annotations/user.js；host-center.html/交互/3〕
- [REQ-5f53cf6bcc3e] 公会通知进入通知列表；角标为当前未读通知数量，0 条时隐藏。直播记录入口关联独立直播记录页，〔来源：AN-8d2a1570a53b；liveshow-proto/prototype/annotations/user.js；host-center.html/交互/4〕

## 主播管理 / 房管管理
页面：moderator-management.html；实际承载：liveshow-proto/prototype/pages/user/host/moderator-management.html；实体页面。
- [META-a739e3705c94] 页面用途：主播查看当前房管，按用户 ID 搜索添加房管，或取消已有房管授权。〔来源：AN-9f227e7d9477；liveshow-proto/prototype/annotations/user.js；moderator-management.html/场景描述/1〕
- [REQ-ddae36460c4f] 房管：展示头像、昵称、用户 ID 和授权状态。〔来源：AN-a43d442a7706；liveshow-proto/prototype/annotations/user.js；moderator-management.html/字段/3〕
- [REQ-6dde361727ce] 房管数量：最多 3 人，按当前长期授权关系统计。〔来源：AN-da1ddc909194；liveshow-proto/prototype/annotations/user.js；moderator-management.html/字段/4〕
- [REQ-82898d5df547] 目标不得在该主播直播间黑名单内，且双方无账号拉黑关系。〔来源：AN-d5c0689eaf9b；liveshow-proto/prototype/annotations/user.js；moderator-management.html/业务规则/1〕
- [REQ-fb48ea3b9666] 已授权后任一方建立账号拉黑关系，房管身份自动解除；取消拉黑后不自动恢复。〔来源：AN-ceccde22916c；liveshow-proto/prototype/annotations/user.js；moderator-management.html/业务规则/2〕
- [REQ-717f359e5a4f] 授权长期有效，直至主播取消或双方建立账号拉黑关系；场次结束不清除。〔来源：AN-8aa5a744b589；liveshow-proto/prototype/annotations/user.js；moderator-management.html/业务规则/3〕
- [REQ-f2ba90b0b147] 房管可在直播间禁言、踢出和屏蔽单条评论。〔来源：AN-46ff97605724；liveshow-proto/prototype/annotations/user.js；moderator-management.html/业务规则/4〕
- [REQ-94bc292839c6] 数据范围：当前主播仍有效的房管授权；〔来源：AN-6b663b6d1503；liveshow-proto/prototype/annotations/user.js；moderator-management.html/业务规则/5〕
- [REQ-93134b08beb0] 搜索仅返回未在该直播间黑名单、双方无账号拉黑关系且当前非房管的用户；房管达到 3 人时保留添加入口，点击不执行并提示“已达3人上限”；取消房管 -> 二次确认后立即撤销权限并更新列表；因拉黑自动解除 -> 立即移出房管列表并更新人数。〔来源：AN-388f26adec38；liveshow-proto/prototype/annotations/user.js；moderator-management.html/交互/1〕

## 主播管理 / 公会通知
页面：host-guild-notifications.html；实际承载：liveshow-proto/prototype/pages/user/host/host-guild-notifications.html；实体页面。
- [META-065279773533] 页面用途：主播查看公会通知的文字或图片内容，并在当前列表展开长内容。〔来源：AN-c1e769b57710；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/场景描述/1〕
- [REQ-6e53209ec69b] 通知标题：展示公会发布的通知标题。〔来源：AN-7eda1a76ad99；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/字段/3〕
- [REQ-60f97773a8af] 通知内容 / 图片：支持纯文字和图片加文字；长内容可在卡片内展开。〔来源：AN-1707f6e34ab5；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/字段/4〕
- [REQ-4a4d3dc2c8a5] 未读标记：未读通知标题旁展示提示点。〔来源：AN-32eb0e860ea7；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/字段/5〕
- [REQ-7bc85d9f5b42] 仅展示当前公会向该主播发送的有效通知；退会后不再接收新通知。〔来源：AN-d4c750c4fee9；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/业务规则/1〕
- [REQ-b77db77e85b4] 本页不展示发布时间。〔来源：AN-205fe7899e2d；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/业务规则/2〕
- [REQ-2cff677094c0] 长内容在当前卡片展开或收起，不进入详情页；首次展开或进入列表后更新已读状态和未读数。〔来源：AN-421a1f486619；liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html/交互/1〕

## 主播管理 / 申请成为主播
页面：host-center-pending.html；实际承载：liveshow-proto/prototype/pages/user/host/host-center-pending.html；实体页面。
- [META-6040a385e3f5] 页面用途：用户无主播身份，点击「主播中心」、「开播」，会进入到申请页。〔来源：AN-20961625eb7b；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/场景描述/1〕
- [REQ-2fd801fdacb6] banner 图：图片由后台上传。〔来源：AN-5de6bf46a26b；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/字段/3〕
- [REQ-82bbb7de6d03] 申请步骤：使用时间线依次展示申请加入、公会审核、平台审核、成为主播。〔来源：AN-171d3e468899；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/字段/4〕
- [REQ-67c887a336e5] 公会名称：在公会审核中和平台审核中展示对应公会名称。〔来源：AN-3b964bac2e23；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/字段/5〕
- [REQ-0c66d73b7fbc] 审核结果 / 时间：通过或驳回由步骤符号表示，不重复显示状态文字；下方显示通过时间或驳回时间。审核中和未开始不显示时间。〔来源：AN-3fd1d36e1673；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/字段/6〕
- [REQ-225e8c6289cd] 步骤状态 / 操作：未提交时，申请加入行显示“去加入”；提交后在该行展示提交时间和可展开的申请资料，不显示按钮。公会审核或平台审核只有驳回时才显示“重新申请”。〔来源：AN-590b9df59a81；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/字段/7〕
- [REQ-8e642e325f90] 页面提示：说明当前审核阶段及后续可执行动作；公会或平台驳回均提示重新申请。〔来源：AN-44d825b977cb；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/字段/8〕
- [REQ-1483b310b8a6] 公会审核通过后，自动进入平台审核节点，无需用户再次提交。〔来源：AN-3f9bf66e6376；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/业务规则/1〕
- [REQ-bca8e787b966] 公会审核中：直播权限仍未申请；点击“审核中”查看公会申请记录。〔来源：AN-291a4a8402c0；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/业务规则/2〕
- [REQ-d30322236a1a] 公会驳回：展示驳回状态和原因，可重新选择公会申请；平台审核不开始。〔来源：AN-89b268361424；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/业务规则/3〕
- [REQ-5eeedca6238d] 公会通过后自动进入平台审核；公会显示“已通过”，平台显示“审核中”，不能重复提交或开播。〔来源：AN-700a0e0675e0；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/业务规则/4〕
- [REQ-d4f2f719ead2] 平台驳回后，本次入会申请作废；点击重新申请进入公会选择并提交新申请，不沿用原公会通过结果。〔来源：AN-1d6ae3e6dc73；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/业务规则/5〕
- [REQ-04b54cbcba08] 平台审核通过后即成为主播，时间线最终节点显示已完成，不展示操作按钮。〔来源：AN-5081ca246018；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/业务规则/6〕
- [REQ-cf2723fa2f75] 点击申请资料在当前步骤展开或收起；去加入及公会或平台驳回后的重新申请，进入公会选择页。〔来源：AN-6c86438317ac；liveshow-proto/prototype/annotations/user.js；host-center-pending.html/交互/1〕

## 主播管理 / 开播设置
页面：start-live-settings.html；实际承载：liveshow-proto/prototype/pages/user/host/start-live-settings.html；实体页面。
- [META-090872021da8] 页面用途：主播设置本场直播封面、主题、分类、房型、美颜及访问范围，并开始直播。〔来源：AN-38c08861b346；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/场景描述/1〕
- [REQ-977cbf74d9f6] 封面：选填，仅上传图片；属于本次直播场次。〔来源：AN-497db8f23de4；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/3〕
- [REQ-6c33f6bc08d8] 直播主题：最多 40 个字符；属于本次直播场次。〔来源：AN-dfec109ac6b2；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/4〕
- [REQ-f3cafeef850c] 分类：必选，选项由平台配置。〔来源：AN-acc2192d40ef；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/5〕
- [REQ-87ffa9153ad7] 房型：必选，可选普通房、门票房、密码房；可用范围受平台开关控制。〔来源：AN-bda775c8f752；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/6〕
- [REQ-1e96fef03f07] 门票价格：门票房必选；后台已启用的价格档位全部平铺展示，只能单选；仅对本次直播场次生效。〔来源：AN-06916217e6e7；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/7〕
- [REQ-84bdac2197da] 房间密码：密码房必填，必须为 4-12 个数字；仅对本次直播场次生效。〔来源：AN-a5fe1166cab1；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/8〕
- [REQ-0fdf4b4486fb] 在广场展示：仅密码房展示。默认读取上次确认值；无历史时默认开启。〔来源：AN-d54c3209bbc0；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/9〕
- [REQ-7937ad3ed8f9] 仅粉丝团成员可进入直播间：仅密码房展示。默认读取上次确认值；无历史时默认关闭。〔来源：AN-0dc21227b806；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/字段/10〕
- [REQ-d3dcb9f11f0e] 账号可用、公会有效、主播认证通过且直播权限开启时才可开播；直播中权限被关闭 -> 立即结束当前场次。〔来源：AN-de6fe08c2559；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/1〕
- [REQ-c746884dbbc3] 每次开播创建新的直播场次；主题、封面、分类、房型、门票和密码均保存到本场，不覆盖历史场次。〔来源：AN-3a669136fa7b；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/2〕
- [REQ-87484b7f1c34] 仅普通房支持双主播连麦；门票房和密码房不支持连麦。〔来源：AN-0e1e8f67043e；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/3〕
- [REQ-9c8b33e8ea5e] 开播需要相机和麦克风权限；不增加产品说明弹窗，首次使用时直接调用系统权限弹窗。开发需配置系统权限用途文案：“用于拍摄直播画面”“用于采集直播声音”。〔来源：AN-3da360690198；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/4〕
- [REQ-b6bddb65ebc8] 上传封面使用系统照片选择器，仅读取用户选中的图片，不申请完整相册权限。〔来源：AN-bc02cebd4191；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/5〕
- [REQ-3b23ca2253e9] “在广场展示”只控制直播卡片是否出现在广场，与成员准入相互独立；关闭后仍可通过分享入口访问。〔来源：AN-8781fb04f2c6；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/6〕
- [REQ-ac3ba01de389] 开启“仅粉丝团成员可进入直播间”后，只有当前有效粉丝团成员可继续输入密码；非成员不可进入。主播未创建粉丝团时不可开启。〔来源：AN-45ccfdf31683；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/7〕
- [REQ-e1dfbcf8306b] 两个开关在确认房型后保存为下次默认值；首次使用默认“在广场展示”开启、成员限制关闭。〔来源：AN-3eb5943cbff0；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/业务规则/8〕
- [REQ-93757292f98c] 选择门票房时，平铺展示后台已启用的门票价格档位，用户单选；未选择或档位已停用时不保存并提示“请选择有效的门票价格”。密码必须为 4-12 个数字；无效时保留输入并提示“密码必须是4-12个数字”。〔来源：AN-7ad83b244a75；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/交互/1〕
- [REQ-f2df64639fd2] 恢复默认美颜 -> 清空当前选中项并将全部参数重置为 50。〔来源：AN-f12cedbfcdd4；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/交互/2〕
- [REQ-2afca99fcc33] 点击开始直播 -> 开播条件和场次字段校验通过后检查相机、麦克风权限；未申请时直接调用系统授权，已授权时创建新场次并显示 3 秒开播倒计时，倒计时结束后进入【直播间-主播视角】。〔来源：AN-9d5888b38f54；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/交互/3〕
- [REQ-e9225b315300] 相机或麦克风权限被拒绝 -> 停留当前页，提示“权限未开启，请前往系统设置”，提供“取消、前往设置”。〔来源：AN-ea8ab2456790；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/交互/4〕
- [REQ-63eef3ba7a60] 点击修改封面 -> 直接打开系统照片选择器；取消选择时保留原封面。〔来源：AN-b2a09103f580；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/交互/5〕
- [REQ-ecb92620b183] 切换两个访问开关后点击确认 -> 保存本场配置和下次默认值；关闭抽屉或点击遮罩 -> 不保存修改。〔来源：AN-d0226d133716；liveshow-proto/prototype/annotations/user.js；start-live-settings.html/交互/6〕

## 主播管理 / 粉丝列表
页面：fan-list.html；实际承载：liveshow-proto/prototype/pages/user/host/fan-list.html；实体页面。
- [META-53c94af29406] 页面用途：主播查看关注自己的粉丝资料，并点击粉丝进入对应用户主页。〔来源：AN-280e6f0fc10c；liveshow-proto/prototype/annotations/user.js；fan-list.html/场景描述/1〕
- [REQ-068090c151bc] 粉丝：仅展示当前仍关注该主播的用户。〔来源：AN-338ecf42cd29；liveshow-proto/prototype/annotations/user.js；fan-list.html/字段/3〕
- [REQ-cf6202984454] 财富等级：按用户账号有效消费成长值计算。〔来源：AN-cf9ed7f4f162；liveshow-proto/prototype/annotations/user.js；fan-list.html/字段/4〕
- [REQ-6022100a74a8] 装扮：展示当前已穿戴且有效的一个代表性装扮；过期后移除。〔来源：AN-a2a2bd50ce8d；liveshow-proto/prototype/annotations/user.js；fan-list.html/字段/5〕
- [REQ-accd19da544e] 取消关注或拉黑主播后立即从粉丝列表移除；粉丝关系与好友、粉丝团关系分别维护。〔来源：AN-01d9cb14d4ff；liveshow-proto/prototype/annotations/user.js；fan-list.html/业务规则/1〕
- [REQ-a2c4f896be88] 数据范围：当前仍关注该主播的用户；〔来源：AN-8adb4ebc8fae；liveshow-proto/prototype/annotations/user.js；fan-list.html/业务规则/2〕
- [REQ-a558a29aafc0] 点击用户 -> 进入对应用户主页；列表随新增关注和关系解除实时更新。〔来源：AN-4306a98ec7d7；liveshow-proto/prototype/annotations/user.js；fan-list.html/交互/1〕

## 主播管理 / 粉丝团
页面：fan-club.html；实际承载：liveshow-proto/prototype/pages/user/host/fan-club.html；实体页面。
- [META-97e273a83100] 页面用途：主播查看粉丝团成员和贡献，切换成员排序、移除成员或进入粉丝团设置。〔来源：AN-f199862c43ec；liveshow-proto/prototype/annotations/user.js；fan-club.html/场景描述/1〕
- [REQ-18b4a9d80c38] 成员：展示头像、昵称、粉丝等级、亲密度和加入时间。〔来源：AN-6caaaec43400；liveshow-proto/prototype/annotations/user.js；fan-club.html/字段/3〕
- [REQ-0d16909f59b9] 成员数：按当前有效团籍统计，上限 500 人。〔来源：AN-b4fff1eaab2c；liveshow-proto/prototype/annotations/user.js；fan-club.html/字段/4〕
- [REQ-083704f59270] 加入条件：展示当前关注和累计贡献门槛。〔来源：AN-c5962f839d99；liveshow-proto/prototype/annotations/user.js；fan-club.html/字段/5〕
- [REQ-d17e31415fb6] 加入条件由主播配置；一期每位主播仅一个粉丝团，满 500 人拒绝新成员。〔来源：AN-fe51eb04a274；liveshow-proto/prototype/annotations/user.js；fan-club.html/业务规则/1〕
- [REQ-5d55548c15b9] 移除成员后团籍和群籍同步解除；不影响关注，粉丝等级与亲密度清零，重新加入不恢复。〔来源：AN-bcfaca92fc8d；liveshow-proto/prototype/annotations/user.js；fan-club.html/业务规则/2〕
- [REQ-08663e4475e8] 数据范围：当前主播粉丝团的有效成员。〔来源：AN-4f6482fa3db0；liveshow-proto/prototype/annotations/user.js；fan-club.html/业务规则/3〕
- [REQ-694a96cbaed3] 排序：默认按给当前主播刷出的全部历史贡献从高到低；“本月最多”按本月内的全部贡献从高到低，均不按入团时间截断；“最新加入”按加入时间从新到旧；〔来源：AN-ef6b1570b239；liveshow-proto/prototype/annotations/user.js；fan-club.html/业务规则/4〕
- [REQ-2450d1ce84b9] 切换累计最多、本月最多或最新加入 -> 按对应规则重新排列当前成员。〔来源：AN-231c2fbc2e34；liveshow-proto/prototype/annotations/user.js；fan-club.html/交互/1〕
- [REQ-10e94366689d] 单人禁言 -> 二次确认后限制该成员群内发言；左滑成员 -> 显示移除操作，确认移除后更新成员数、群聊权限和用户身份。〔来源：AN-70421d699927；liveshow-proto/prototype/annotations/user.js；fan-club.html/交互/2〕
- [REQ-b9f1f37620c5] 点击粉丝团设置进入设置页；成员资料查看只依据实际成员身份和资料卡入口，不以原型 Toast 证明存在独立详情页。〔来源：AN-1902e4f47a69；liveshow-proto/prototype/annotations/user.js；fan-club.html/交互/3〕

## 主播管理 / 粉丝团设置
页面：fan-club-settings.html；实际承载：liveshow-proto/prototype/pages/user/host/fan-club-settings.html；实体页面。
- [META-369803bcf212] 页面用途：主播修改自己的粉丝团名称及加入条件，并保存设置。〔来源：AN-92ec67360204；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/场景描述/1〕
- [REQ-aa76d1f2aa67] 粉丝团名称：必填，最多 20 个字符。〔来源：AN-907936185431；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/字段/3〕
- [REQ-81d0d032931d] 需要关注：开启后，新成员加入前必须已关注主播。〔来源：AN-152c6d0135e4；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/字段/4〕
- [REQ-e145ac7a518b] 累计贡献：必填，最小值为 0，仅允许整数；统计用户给当前主播刷出的全部历史贡献，不按入团时间截断。〔来源：AN-62b8037aa75c；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/字段/5〕
- [REQ-c0bc6a748d7f] 仅粉丝团所属主播可修改；保存后的加入条件只用于后续加入校验，不移除已在团成员。〔来源：AN-e5f6a7326c05；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/业务规则/1〕
- [REQ-188125f1ce89] 数据范围：仅当前主播自己的粉丝团名称和加入条件。〔来源：AN-3190026fd57c；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/业务规则/2〕
- [REQ-73346c4d9ed3] 名称为空或累计贡献无效 -> 保存按钮不可用。〔来源：AN-1df690899e90；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/交互/1〕
- [REQ-cca460a0105a] 校验通过并保存成功 -> 更新粉丝团加入条件。〔来源：AN-0f5c7fb7a4c5；liveshow-proto/prototype/annotations/user.js；fan-club-settings.html/交互/2〕

## 主播管理 / 直播数据
页面：live-data.html；实际承载：liveshow-proto/prototype/pages/user/host/live-data.html；实体页面。
- [META-2e395941b518] 页面用途：主播按日或月查看直播收益、时长、观众及粉丝相关指标和趋势。〔来源：AN-626594d6399a；liveshow-proto/prototype/annotations/user.js；live-data.html/场景描述/1〕
- [REQ-baff079294bb] 收益：普通/定制礼物及门票按成功支付金币汇总；幸运礼物按送出价值 × 后台比例汇总，默认 1%，返奖不影响；虚拟金币、失败或撤销消费不计入。〔来源：AN-16a2268860d9；liveshow-proto/prototype/annotations/user.js；live-data.html/字段/3〕
- [REQ-20191ad956f6] 有效天：按主播所属自然日累计，有效直播时长满 3 小时计 1 天，每日最多 1 天。〔来源：AN-1d7e07daf670；liveshow-proto/prototype/annotations/user.js；live-data.html/字段/4〕
- [REQ-030a3364b270] 开播时长：汇总筛选范围内有效直播时长。〔来源：AN-e1bd43548bb1；liveshow-proto/prototype/annotations/user.js；live-data.html/字段/5〕
- [REQ-b08df9eb9f74] 观众人次：按直播场次进入行为累计。〔来源：AN-df9f19fbe25b；liveshow-proto/prototype/annotations/user.js；live-data.html/字段/6〕
- [REQ-4f538f26fc75] 新增粉丝/送礼人数：按筛选范围去重统计。〔来源：AN-4d4cdde91431；liveshow-proto/prototype/annotations/user.js；live-data.html/字段/7〕
- [REQ-11eaa943d562] 数据来自已开始的直播场次；场次结束后保留历史快照。充值订单退款或拒付不撤销已完成消费，对应主播收益和分成不受影响。〔来源：AN-10292fb62ca4；liveshow-proto/prototype/annotations/user.js；live-data.html/业务规则/1〕
- [REQ-01897e8920d5] 数据范围：仅当前主播、当前日或月范围内的直播数据；〔来源：AN-4a3fca14d996；liveshow-proto/prototype/annotations/user.js；live-data.html/业务规则/2〕
- [REQ-7d4f43bfbbaa] 切换日/月范围 -> 同步更新全部指标；进入直播记录 -> 保留当前日期范围。〔来源：AN-442d3d56ee60；liveshow-proto/prototype/annotations/user.js；live-data.html/交互/1〕

## 主播管理 / 直播记录
页面：live-records.html；实际承载：liveshow-proto/prototype/pages/user/host/live-records.html；实体页面。
- [META-e422a9e243ce] 页面用途：主播按日期范围查看自己的直播场次、收益和时长汇总，并查看单场数据。〔来源：AN-a0ff2e884f2e；liveshow-proto/prototype/annotations/user.js；live-records.html/场景描述/1〕
- [REQ-4fc2dd894f97] 直播场次：展示场次 ID、开播主题、封面、房型和分类快照。〔来源：AN-b894cc241b34；liveshow-proto/prototype/annotations/user.js；live-records.html/字段/3〕
- [REQ-c094f7abd18b] 开播/结束时间：使用服务端场次时间；直播中记录结束时间为空。〔来源：AN-68ba69e69802；liveshow-proto/prototype/annotations/user.js；live-records.html/字段/4〕
- [REQ-ec6a0cb31db7] 时长：按场次有效直播时长计算。〔来源：AN-92d64a99f1fd；liveshow-proto/prototype/annotations/user.js；live-records.html/字段/5〕
- [REQ-b552d3d74668] 观众人数/收益：观众人数使用场次统计值；收益按主播收益口径汇总，不等于榜单贡献值。〔来源：AN-63c8d0fc5164；liveshow-proto/prototype/annotations/user.js；live-records.html/字段/6〕
- [REQ-d023a2bf3fd4] 每场记录保存开播时的主题、封面、分类、房型和准入配置快照，历史记录不随当前设置变更。〔来源：AN-ca66a955b857；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/1〕
- [REQ-055449c7eb9d] 收益 = 当前筛选范围内各场次主播收益之和；普通/定制礼物和门票按成功支付金币，幸运礼物按送出价值 × 后台比例，默认 1%，返奖不影响。〔来源：AN-247b26f3b1d5；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/2〕
- [REQ-f1e1f573f151] 总时长 = 当前筛选范围内各场次有效结束时间 - 有效开始时间之和；直播场次 = 当前范围内已创建且实际开始的场次数。〔来源：AN-5e121ff1bf21；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/3〕
- [REQ-e8aae3a8555f] 观众人数展示当前场次的统计值。〔来源：AN-8fb19cbf0e45；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/4〕
- [REQ-55522cb020c6] 开播时间使用 dd/mm/yyyy HH.mm；筛选条件只使用日期。〔来源：AN-94121b25c5b0；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/5〕
- [REQ-217ee56feb5c] 数据范围：当前主播在筛选日期范围内已实际开始的直播场次；默认近 7 天。〔来源：AN-b193af29e812；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/6〕
- [REQ-659cc558be54] 排序：按开播时间倒序展示。〔来源：AN-4232befb3863；liveshow-proto/prototype/annotations/user.js；live-records.html/业务规则/7〕
- [REQ-9fe81bc4e92e] 默认展示近 7 天；可选择本周、本月、上月、单日或连续日期范围。〔来源：AN-58d50ef0e7f1；liveshow-proto/prototype/annotations/user.js；live-records.html/交互/1〕
- [REQ-6a021ec4ec30] 日期范围变化 -> 同步更新场次列表和汇总指标。〔来源：AN-0306004f9be1；liveshow-proto/prototype/annotations/user.js；live-records.html/交互/2〕
- [REQ-a6f849e9e52e] 点击场次 -> 查看该场次的数据和礼物明细。〔来源：AN-a12fd38440d1；liveshow-proto/prototype/annotations/user.js；live-records.html/交互/3〕

## 主播管理 / 分成记录
页面：income-sharing.html；实际承载：liveshow-proto/prototype/pages/user/host/income-sharing.html；实体页面。
- [META-2fb3a4f2cf7a] 页面用途：主播查看已上传的分成记录及对应日期和金额。〔来源：AN-33a7e9a258c5；liveshow-proto/prototype/annotations/user.js；income-sharing.html/场景描述/1〕
- [REQ-defd01187ffd] 分成日期：展示对应分成记录的日期。〔来源：AN-36614ed57f1e；liveshow-proto/prototype/annotations/user.js；income-sharing.html/字段/3〕
- [REQ-f523be65f8f8] 分成金额：财务上传的最终金额，以美元展示；千位用“.”、小数用“,”。〔来源：AN-938c3c7774b6；liveshow-proto/prototype/annotations/user.js；income-sharing.html/字段/4〕
- [REQ-c14d836f25cf] 系统不提供主播线上结算申请或审批，本页只展示财务线下结算后上传的结果。〔来源：AN-9d8474c49a59；liveshow-proto/prototype/annotations/user.js；income-sharing.html/业务规则/1〕
- [REQ-30aac05533fe] 主播收益按礼物和门票类型分别计算：普通/定制礼物及门票按成功支付金币；幸运礼物按送出价值 × 后台比例，默认 1%；具体分成由线下财务计算。〔来源：AN-7469af6ec65e；liveshow-proto/prototype/annotations/user.js；income-sharing.html/业务规则/2〕
- [REQ-95fd6cd9e563] 金额以美元展示，数字按印尼格式使用“.”分隔千位、“,”分隔小数。〔来源：AN-50595c997657；liveshow-proto/prototype/annotations/user.js；income-sharing.html/业务规则/3〕
- [REQ-fba5f1526c9c] 数据范围：当前主播已上传的分成结果；按分成日期倒序展示。〔来源：AN-268078b56066；liveshow-proto/prototype/annotations/user.js；income-sharing.html/业务规则/4〕
- [REQ-75a3b148aa3c] 分成记录按日期展示已上传的线下结算结果。〔来源：AN-7fdf6bcdd026；liveshow-proto/prototype/annotations/user.js；income-sharing.html/交互/1〕
- [REQ-e5697a7f1e6c] 点击返回 -> 回到主播中心。〔来源：AN-c91004cf41e9；liveshow-proto/prototype/annotations/user.js；income-sharing.html/交互/2〕

## 钱包与充值 / 余额充值
页面：recharge.html；实际承载：liveshow-proto/prototype/pages/user/wallet/recharge.html；实体页面。
- [META-481e3245973b] 页面用途：用户查看金币余额和充值套餐，选择套餐发起支付或查看余额明细。〔来源：AN-d5e6bd3fce6e；liveshow-proto/prototype/annotations/user.js；recharge.html/场景描述/1〕
- [REQ-b1863c50e3dc] 金币余额：当前账号可用金币余额，单位为金币；不是现金余额或主播收益。〔来源：AN-1b48120b51d0；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/3〕
- [REQ-df533863abd0] 明细：金币收支明细入口，进入余额明细页。〔来源：AN-c3b54c8e1bc5；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/4〕
- [REQ-9d874f15239d] 套餐配图：使用后台上传的套餐封面。〔来源：AN-aff32f68d6c8；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/5〕
- [REQ-22e4a9e542d4] 基础金币：套餐包含的充值金币，不含赠送金币；取后台充值金币配置。〔来源：AN-c1e8bb4042af；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/6〕
- [REQ-afb2e3c341b6] 赠送金币：「+数值」显示后台配置的赠送金币数量；到账金币 = 基础金币 + 赠送金币。〔来源：AN-ac7a176e5228；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/7〕
- [REQ-052afe1173a5] 赠送比例标签：赠送比例 = 赠送金币 ÷ 基础金币 × 100%，与赠送金币数量分别显示。〔来源：AN-ed47fa536d26；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/8〕
- [REQ-070263614a92] 首充特惠：标记由后台配置。〔来源：AN-eaa192f0d589；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/9〕
- [REQ-79763345a96e] 活动倒计时：限时套餐剩余可购买时间，格式为时:分:秒，对应后台活动结束时间。〔来源：AN-af9c1ed932e4；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/10〕
- [REQ-b605fa170d72] 价格 / 支付按钮：当前套餐实际支付金额，单位 USD，保留两位小数；点击发起该套餐支付。〔来源：AN-1ec0a34c5b93；liveshow-proto/prototype/annotations/user.js；recharge.html/字段/11〕
- [REQ-de06a87195aa] 仅展示当前账号可购买的上架套餐；活动套餐须处于有效期且未达到单用户限购次数。活动区在前，同类套餐按后台排序权重从高到低展示。〔来源：AN-1cbd88e52697；liveshow-proto/prototype/annotations/user.js；recharge.html/业务规则/1〕
- [REQ-eccfb73ebed1] 活动套餐每笔支付成功订单占用 1 次限购；0 表示不限购，全额退款不恢复次数。〔来源：AN-a58304326915；liveshow-proto/prototype/annotations/user.js；recharge.html/业务规则/2〕
- [REQ-7f4554ffc2b6] 到账金币以下单时套餐快照为准；支付成功后增加余额并生成充值记录，同一订单重复回调只入账一次；失败、超时或取消不增加余额。〔来源：AN-f98ec3faf54c；liveshow-proto/prototype/annotations/user.js；recharge.html/业务规则/3〕
- [REQ-33923242e1a4] 用户侧不提供退款操作。后台退款或渠道拒付扣除该订单到账金币；余额不足时允许为负，后续充值先抵扣负余额；不撤销已完成的礼物和门票消费。〔来源：AN-60b4adc78c87；liveshow-proto/prototype/annotations/user.js；recharge.html/业务规则/4〕
- [REQ-bbc2901df8d5] 运营账号不可进入充值页或发起充值。〔来源：AN-c0f36c2dff84；liveshow-proto/prototype/annotations/user.js；recharge.html/业务规则/5〕
- [REQ-75ea9808f9ef] 点击套餐价格按钮发起支付；本页无支付渠道选择控件。〔来源：AN-24a6a7b16986；liveshow-proto/prototype/annotations/user.js；recharge.html/交互/1〕
- [REQ-dd6df4e4ca51] 支付成功后刷新余额和可购买套餐；失败或取消保留原余额并提示结果。〔来源：AN-3d25ebb2bc99；liveshow-proto/prototype/annotations/user.js；recharge.html/交互/2〕
- [REQ-60ec2f938995] 点击「明细」进入余额明细页；点击返回进入「我的」。〔来源：AN-d0eb599c97cc；liveshow-proto/prototype/annotations/user.js；recharge.html/交互/3〕

## 钱包与充值 / 余额明细
页面：balance-detail.html；实际承载：liveshow-proto/prototype/pages/user/wallet/balance-detail.html；实体页面。
- [META-51839a7ed655] 页面用途：用户查看自己的金币收支记录，按记录进入对应订单详情。〔来源：AN-34a7f2e42cca；liveshow-proto/prototype/annotations/user.js；balance-detail.html/场景描述/1〕
- [REQ-1cdb25ebdb71] 变动类型包含充值、充值退款、礼物打赏、购买门票和当前业务实际发生的奖励入账；不提供礼物退款，已完成的礼物与门票消费不可退回。〔来源：AN-7dc268a2e28c；liveshow-proto/prototype/annotations/user.js；balance-detail.html/字段/3〕
- [REQ-8f8e2789fd80] 变动金币：正数表示收入，负数表示支出，按收支使用不同颜色。〔来源：AN-911f85f30eb9；liveshow-proto/prototype/annotations/user.js；balance-detail.html/字段/4〕
- [REQ-b38495f92d9c] 发生时间：展示该条金币流水的日期和时间。〔来源：AN-5b7d2361710f；liveshow-proto/prototype/annotations/user.js；balance-detail.html/字段/5〕
- [REQ-b5d63468de7c] 流水只增不改；退款或拒付以独立冲正分录体现。余额允许因退款为负，负余额时不可消费，后续充值先抵扣负值。〔来源：AN-509ec708ac9b；liveshow-proto/prototype/annotations/user.js；balance-detail.html/业务规则/1〕
- [REQ-7ab0289dec79] 数据范围：当前登录账号的金币流水；按发生时间倒序，时间相同按流水 ID 从大到小。〔来源：AN-2d0041ae4d28；liveshow-proto/prototype/annotations/user.js；balance-detail.html/业务规则/2〕
- [REQ-eafc3fc8d84c] 点击流水 -> 按类型进入充值或支出详情；无法关联订单的赠送、任务等奖励只展示流水信息。〔来源：AN-ee10c3cf0a26；liveshow-proto/prototype/annotations/user.js；balance-detail.html/交互/1〕

## 钱包与充值 / 充值订单详情
页面：order-income-detail.html；实际承载：liveshow-proto/prototype/pages/user/wallet/order-income-detail.html；实体页面。
- [META-e3930b802007] 页面用途：用户查看一笔充值订单的购买套餐、数量、支付信息及到账金币。〔来源：AN-dad48f899e81；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/场景描述/1〕
- [REQ-4ab23800ac22] 购买套餐名称：充值时购买的套餐名称。〔来源：AN-ccc3b209e318；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/字段/3〕
- [REQ-091d8b5cb74e] 数量：本笔订单购买的套餐数量。〔来源：AN-645f9382627f；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/字段/4〕
- [REQ-0a26352e5fc0] 支付时间：本笔订单的支付时间。〔来源：AN-aaccf98c2096；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/字段/5〕
- [REQ-c7081347bfbe] 套餐金币 / 赠送金币：分别展示基础金币和赠送金币。〔来源：AN-b00cbf385634；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/字段/6〕
- [REQ-11b92bd4952d] 支付渠道：本笔订单使用的支付渠道。〔来源：AN-8ce8d632c02e；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/字段/7〕
- [REQ-ba5024fab83c] 支付金额：本笔订单实际支付的金额。〔来源：AN-4517c195635a；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/字段/8〕
- [REQ-4a50409c7746] 用户侧不提供退款操作；后台退款或渠道拒付生成冲正流水，不撤销已完成的礼物和门票消费。重复支付回调不得重复入账。〔来源：AN-6b7025449d0d；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/业务规则/1〕
- [REQ-cc0d5de370b6] 数据范围：当前用户所选的单笔充值订单，金额与金币使用该订单的套餐快照。〔来源：AN-784c018a53bc；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/业务规则/2〕
- [REQ-f8adde5ec148] 订单状态变化 -> 刷新状态、时间和关联余额流水；返回 -> 回到账单列表并保留筛选位置。〔来源：AN-769f839b4216；liveshow-proto/prototype/annotations/user.js；order-income-detail.html/交互/1〕

## 钱包与充值 / 支出订单详情
页面：order-expense-detail.html；实际承载：liveshow-proto/prototype/pages/user/wallet/order-expense-detail.html；实体页面。
- [META-1722ed24b210] 页面用途：用户查看一笔支出订单的商品、数量、支付时间、扣款金币和消费直播间。〔来源：AN-ef50e26ed67c；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/场景描述/1〕
- [REQ-853c4cf85da1] 付款商品名称：本笔消费对应的商品名称。〔来源：AN-c4ebb4d59d1f；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/字段/3〕
- [REQ-91d4b92fa29f] 数量：本笔消费的商品数量。〔来源：AN-e94b435637da；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/字段/4〕
- [REQ-f33b17c3d436] 支付时间：本笔消费的支付时间。〔来源：AN-f31f7cf99679；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/字段/5〕
- [REQ-6940c29d89cb] 扣款金币：本笔消费实际扣除的金币。〔来源：AN-edbda59b0adf；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/字段/6〕
- [REQ-2091adedd0e7] 消费直播间：展示消费对象的主播昵称和主播 ID。〔来源：AN-e8db8da39fd1；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/字段/7〕
- [REQ-e2b2cac19dd9] 消费成功只扣减一次金币并生成流水；余额不足或条件检查失败不扣减。〔来源：AN-ac9608859c5e；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/业务规则/1〕
- [REQ-9c7ac2554e43] 已成功赠送的礼物和已购买门票不支持退款。〔来源：AN-ea0546aaf21b；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/业务规则/2〕
- [REQ-20e1d6131bd0] 门票仅对当前直播场次有效，同场重复进入不重复收费；被踢出或场次结束后失效且不退款。〔来源：AN-0ce121ec004c；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/业务规则/3〕
- [REQ-694754332629] 数据范围：当前用户所选的单笔支出订单，商品、数量和金币使用支付时记录。〔来源：AN-af2fe22d66a5；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/业务规则/4〕
- [REQ-c8634d02c96a] 点击业务对象 -> 进入仍可访问的主播或场次信息；对象已失效时仅保留订单快照，不重新发起消费。〔来源：AN-ab67735e782c；liveshow-proto/prototype/annotations/user.js；order-expense-detail.html/交互/1〕

## 账号与登录 / 登录与注册
页面：auth-login-register.html；实际承载：liveshow-proto/prototype/pages/user/auth/auth-login-register.html；实体页面。
- [META-fd309d505e14] 页面用途：用户首次或再次进入 App，通过第三方账号、手机号或邮箱进入账号流程。〔来源：AN-edffb8c83559；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/场景描述/1〕
- [REQ-40eeb040fd0b] Google：第三方一键登录主入口；点击后唤起 Google 授权。〔来源：AN-a81b55619ff2；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/3〕
- [REQ-fd8fa4b8e076] Facebook：第三方一键登录入口；点击后唤起 Facebook 授权。〔来源：AN-e99715cbf4f4；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/4〕
- [REQ-b89d6085cb6c] Apple ID：第三方一键登录入口，仅在 iOS 展示；点击后唤起 Apple 授权。〔来源：AN-d0d66fb7aaf5；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/5〕
- [REQ-7cace569fd6a] TikTok：第三方一键登录入口；点击后唤起 TikTok 授权。〔来源：AN-93b9395e72b8；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/6〕
- [REQ-38961d098c06] 手机号：进入手机号密码或短信验证码登录页。〔来源：AN-c56302d0747a；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/7〕
- [REQ-848f796728b0] 邮箱：进入邮箱密码或邮箱验证码登录页。〔来源：AN-2860e97389f1；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/8〕
- [REQ-99f5b6a332c2] 游客进入：不创建登录会话，进入游客可访问页面。〔来源：AN-7a3c6d3066fe；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/9〕
- [REQ-4ad5d176f4e9] 协议确认：发起登录前必须同意当前版本《用户协议》和《隐私政策》。〔来源：AN-c0e280d8de93；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/字段/10〕
- [REQ-b176b815ee3f] Google、Facebook、Apple ID、TikTok 授权成功后，按对应平台账号标识查询 Luma Live 账号。〔来源：AN-7b268497588b；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/1〕
- [REQ-af1de9dc6f1d] 所有新注册账号首次授权成功 -> 自动创建账号，生成用户 ID、默认昵称和默认头像，并进入资料补全；已有账号 -> 建立登录会话并进入首页。〔来源：AN-ec38b188e5c8；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/2〕
- [REQ-d73f453a6aba] 用户取消授权、授权失败或未取得有效账号标识 -> 不创建账号、不建立登录会话，停留本页并提示结果。〔来源：AN-9cb358540760；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/3〕
- [REQ-c006ed524230] 账号状态为封禁 -> 不建立登录会话，停留本页并 Toast 提示“账号已被封禁”。〔来源：AN-c356407e1e60；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/4〕
- [REQ-b4c289296364] 账号处于注销冷静期 -> 不建立常规登录会话，展示注销冷静期弹窗；冷静期内账号及相关数据保留。〔来源：AN-583f25f6f2ac；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/5〕
- [REQ-a550afe9b682] Apple ID 仅在 iOS 展示。〔来源：AN-03d40af95876；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/6〕
- [REQ-cd0830f37016] 游客白名单为首页、主播榜、贡献榜、福利页和邀请好友页；其余页面及账号动作需登录。〔来源：AN-c1d49b897305；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/业务规则/7〕
- [REQ-527b389bdcda] 未勾选协议 -> 点击 Google、Facebook、Apple ID 或 TikTok -> 提示先同意《用户协议》和《隐私政策》，不发起授权。〔来源：AN-9aea788bc50f；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/1〕
- [REQ-76e70fcba89b] 已勾选协议 -> 点击任一第三方入口 -> 唤起对应平台授权；授权成功后按新老账号分流。〔来源：AN-de4750748e08；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/2〕
- [REQ-a018ce659c74] 第三方授权失败 -> 停留本页并 Toast 提示“登录失败，请重试”；取消授权 -> Toast 提示“已取消授权”。〔来源：AN-70777904a42e；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/3〕
- [REQ-f07ba4f39c72] 授权成功但账号已封禁 -> 停留本页并 Toast 提示“账号已被封禁”。〔来源：AN-00f18da85fc1；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/4〕
- [REQ-56ba02295864] 账号处于注销冷静期 -> 展示可取消截止时间及“暂不取消、取消注销”；取消注销后恢复账号并直接登录。〔来源：AN-71c23711ae60；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/5〕
- [REQ-5747707e2366] 点击手机号登录 -> 进入手机号登录页。〔来源：AN-1793994af4d9；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/6〕
- [REQ-33b03452c3c7] 点击邮箱 -> 进入邮箱登录页。〔来源：AN-fccdef2d4f6c；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/7〕
- [REQ-34712a13e43f] 点击游客进入 -> 不校验登录协议，直接以游客身份进入首页。〔来源：AN-da6fb0fb90e2；liveshow-proto/prototype/annotations/user.js；auth-login-register.html/交互/8〕

## 账号与登录 / 资料补全
页面：auth-profile-completion.html；实际承载：liveshow-proto/prototype/pages/user/auth/auth-profile-completion.html；实体页面。
- [META-0dd0ffe7973f] 页面用途：新用户首次授权成功后补全头像和昵称。〔来源：AN-2cdc6496209c；liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html/场景描述/1〕
- [REQ-4fbd7f2670b0] 头像：默认使用系统头像，可选择预置头像。〔来源：AN-3933bdb90b19；liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html/字段/3〕
- [REQ-01f0e1f8b741] 昵称：默认使用系统昵称；保存时不能为空，最长 20 个字符。〔来源：AN-500bfff8150d；liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html/字段/4〕
- [REQ-52eaf2e65674] 仅用于新用户首次登录后的资料补全；保存后使用用户填写的资料，跳过则保留系统默认头像和昵称。〔来源：AN-3773e270257b；liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html/业务规则/1〕
- [REQ-aa7f3f33dfc4] 保存 -> 校验昵称 -> 保存资料并进入首页。〔来源：AN-32001a5bf521；liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html/交互/1〕
- [REQ-92108788a9ad] 跳过 -> 保留系统默认资料并进入首页。〔来源：AN-19a4cf1cb8e6；liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html/交互/2〕

## 账号与登录 / 手机号登录
页面：auth-phone-login.html；实际承载：liveshow-proto/prototype/pages/user/auth/auth-phone-login.html；实体页面。
- [META-4a66cd678806] 页面用途：用户使用手机号，通过密码或短信验证码登录。〔来源：AN-7d627012b57d；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/场景描述/1〕
- [REQ-1c46961734ed] 国家或地区区号：入口仅展示区号，不显示国旗；默认按设备地区匹配，无法识别时使用印度尼西亚 +62。点击进入独立选择页；不提供中国大陆 +86。〔来源：AN-73588a2495d6；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/字段/3〕
- [REQ-769e98db4e74] 手机号：8-15 位数字。〔来源：AN-be5d4eee211d；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/字段/4〕
- [REQ-43f78ae14856] 验证码：6 位数字，有效期 5 分钟；连续错误 5 次后当前验证码失效。〔来源：AN-c8a22682c99d；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/字段/5〕
- [REQ-c45bffcc76df] 密码：密码登录时必填。〔来源：AN-2b5756b05eb0；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/字段/6〕
- [REQ-efd41a453368] 从登录入口进入时默认使用短信验证码登录。〔来源：AN-4e70e0db486d；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/业务规则/1〕
- [REQ-235781692515] 选择区号后返回本页，保留已输入手机号、登录方式和协议勾选状态。〔来源：AN-256961f963ee；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/业务规则/2〕
- [REQ-89e915f8f5a2] 凭证验证成功但账号处于注销冷静期时，不建立常规登录会话，进入登录与注册页展示冷静期弹窗。〔来源：AN-b0dcae10e0cd；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/业务规则/3〕
- [REQ-d11325bdaeb3] 手机号有效 -> 可获取验证码；发送后倒计时 60 秒，期间不可重复获取。〔来源：AN-da8f875908c8；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/交互/1〕
- [REQ-710f264aa1d8] 手机号、登录凭证和协议均有效 -> 继续按钮可用；登录成功 -> 进入首页。〔来源：AN-9b5c850da1bd；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/交互/2〕
- [REQ-b16a9f3760bc] 点击区号 -> 保存当前输入并进入选择国家/地区页；选择或返回后恢复登录表单。〔来源：AN-823dd02dbfec；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/交互/3〕
- [REQ-d2a5c2bc5ab7] 点击使用密码登录或短信验证码登录 -> 切换登录方式。〔来源：AN-16e953195879；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/交互/4〕
- [REQ-97f1a2157119] 命中注销冷静期 -> 展示可取消截止时间及取消注销操作。〔来源：AN-a74a95192405；liveshow-proto/prototype/annotations/user.js；auth-phone-login.html/交互/5〕

## 账号与登录 / 选择国家/地区
页面：auth-country-select.html；实际承载：liveshow-proto/prototype/pages/user/auth/auth-country-select.html；实体页面。
- [META-7be0ed912efb] 页面用途：用户在手机号登录前选择国际区号。〔来源：AN-932df263c77f；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/场景描述/1〕
- [REQ-016b98abdeb4] 搜索：支持按国家或地区名称、国际区号搜索；无结果时显示空状态。〔来源：AN-0b58fa3ea7ae；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/字段/3〕
- [REQ-9964c7ed44cf] 全部地区：页面不设置常用地区分组，统一展示当前业务支持的国家或地区、国旗和国际区号；中国大陆 +86 不在可选列表。〔来源：AN-7d6aed487d83；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/字段/4〕
- [REQ-928c2429a102] 当前选中项：使用勾选标识；未选择时按设备地区匹配，无法识别或设备地区为不支持项时使用印度尼西亚 +62。〔来源：AN-9baca6770f34；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/字段/5〕
- [REQ-69c9aabd57c2] 可选范围覆盖多地区，不提供中国大陆 +86。〔来源：AN-98754e0666cf；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/业务规则/1〕
- [REQ-9ac0d78eb22f] 区号只影响手机号登录标识，不改变账号地区资料。〔来源：AN-5d35db60053b；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/业务规则/2〕
- [REQ-7ebdd25780d5] 数据范围：仅展示支持手机号登录的国家或地区；搜索只在可选地区中匹配。〔来源：AN-9d5b0b771447；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/业务规则/3〕
- [REQ-5efb5b6424f2] 输入名称或 +62 等区号 -> 实时过滤全部地区；清空搜索 -> 恢复全部地区。〔来源：AN-e49de2f5c742；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/交互/1〕
- [REQ-dde5b29e8c31] 选择地区 -> 保存区号并返回手机号登录页，保留已输入手机号、登录方式和协议勾选状态。〔来源：AN-559f2ca0ea9a；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/交互/2〕
- [REQ-b77a464b1c11] 点击返回 -> 不改变原区号并返回手机号登录页。〔来源：AN-8d61d8d3148e；liveshow-proto/prototype/annotations/user.js；auth-country-select.html/交互/3〕

## 账号与登录 / 邮箱登录
页面：auth-email-login.html；实际承载：liveshow-proto/prototype/pages/user/auth/auth-email-login.html；实体页面。
- [META-3fae9e69edb0] 页面用途：用户使用邮箱，通过密码或邮箱验证码登录。〔来源：AN-f63c0174197d；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/场景描述/1〕
- [REQ-830b83c03a0b] 邮箱：必须为有效邮箱地址。〔来源：AN-d7eebd613c71；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/字段/3〕
- [REQ-6093735e3bc3] 验证码：6 位数字，有效期 5 分钟；连续错误 5 次后当前验证码失效。〔来源：AN-c5dd8488d162；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/字段/4〕
- [REQ-ded540825cfd] 密码：密码登录时必填。〔来源：AN-9dc6d3b104dc；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/字段/5〕
- [REQ-76e9f678da24] 默认使用邮箱验证码登录。〔来源：AN-494c87d7ad7b；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/业务规则/1〕
- [REQ-23a6b59cab38] 凭证验证成功但账号处于注销冷静期时，不建立常规登录会话，进入登录与注册页展示冷静期弹窗。〔来源：AN-3abdfbff4f73；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/业务规则/2〕
- [REQ-73f4f8991460] 邮箱有效 -> 可获取验证码；发送后倒计时 60 秒，期间不可重复获取。〔来源：AN-ab7d4665f10b；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/交互/1〕
- [REQ-b92d5c7ef6a0] 邮箱、登录凭证和协议均有效 -> 继续按钮可用；登录成功 -> 进入首页。〔来源：AN-bf70ecc38cfe；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/交互/2〕
- [REQ-6369e820dcd5] 点击使用密码登录或邮箱验证码登录 -> 切换登录方式。〔来源：AN-b5345a26ffcc；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/交互/3〕
- [REQ-a2908a770369] 命中注销冷静期 -> 展示可取消截止时间及取消注销操作。〔来源：AN-0f3dee4941fd；liveshow-proto/prototype/annotations/user.js；auth-email-login.html/交互/4〕

## 个人中心 / 资料编辑
页面：profile-edit.html；实际承载：liveshow-proto/prototype/pages/user/profile/profile-edit.html；实体页面。
- [META-5a0ce6f72364] 页面用途：用户修改自己的背景图、头像、昵称和其他个人资料，并保存修改。〔来源：AN-9a2fbef6cad4；liveshow-proto/prototype/annotations/user.js；profile-edit.html/场景描述/1〕
- [REQ-59280d283c2f] 用户 ID：系统生成，只读，不可修改。〔来源：AN-b37400deca97；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/3〕
- [REQ-8c58e8fa81be] 背景图：选填，仅上传图片。〔来源：AN-30f9b7939fff；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/4〕
- [REQ-552d2028f671] 头像：选填，仅上传图片；修改后须通过内容风控。〔来源：AN-57b26c9e7758；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/5〕
- [REQ-41075150ffa5] 昵称：必填，最多 20 个字符；修改后须通过内容风控。〔来源：AN-526efaf082b7；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/6〕
- [REQ-4cae8cac1309] 签名：选填，最多 80 个字符。〔来源：AN-abf5b25728e7；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/7〕
- [REQ-532d60fbd167] 性别：可选男、女、不公开。〔来源：AN-12749d73c061；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/8〕
- [REQ-9e1bd4a47438] 地区：选填，最多 30 个字符。〔来源：AN-ea3db0fe9c0c；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/9〕
- [REQ-98f890ca51ec] 生日：选填，不得晚于当前日期。〔来源：AN-b07ebcb71a1e；liveshow-proto/prototype/annotations/user.js；profile-edit.html/字段/10〕
- [REQ-7e0f389ab1db] 头像或昵称修改后保存须进行合规校验；校验成功后直接保存，校验失败或网络异常时不保存并保留编辑内容。其他资料直接生效。〔来源：AN-f26f4f455a25；liveshow-proto/prototype/annotations/user.js；profile-edit.html/业务规则/1〕
- [REQ-8ab770457b43] 昵称为空 -> 保存按钮不可用；昵称、签名或地区达到最大长度后阻止继续输入，不增加提示。〔来源：AN-7f9a13f8e861；liveshow-proto/prototype/annotations/user.js；profile-edit.html/交互/1〕
- [REQ-8a531c0c3ed1] 头像或昵称有修改 -> 点击保存后显示 loading 并进行合规校验。〔来源：AN-e142974e0407；liveshow-proto/prototype/annotations/user.js；profile-edit.html/交互/2〕
- [REQ-5aba1b5144e9] 校验成功 -> 直接保存；校验失败 -> 提示“头像或昵称不合规”；网络异常 -> 提示“网络异常，请重试”。〔来源：AN-c7098e76260b；liveshow-proto/prototype/annotations/user.js；profile-edit.html/交互/3〕
- [REQ-cdf78baeafcf] 头像或昵称保存校验失败或网络异常时保留编辑内容，不修改已生效的原资料；成功、不合规、网络异常是独立业务结果，不能按点击次数交替判定。〔来源：AN-2f56fef4b111；liveshow-proto/prototype/annotations/user.js；profile-edit.html/交互/4〕

## 个人中心 / 设置
页面：settings.html；实际承载：liveshow-proto/prototype/pages/user/profile/settings.html；实体页面。
- [META-f68c168ec493] 页面用途：用户管理账号安全、通知及语言设置，查看应用信息，退出登录或申请注销账号。〔来源：AN-446d89eb4bd6；liveshow-proto/prototype/annotations/user.js；settings.html/场景/1〕
- [REQ-a7b87f8491c2] 手机号：展示已绑定手机号，国家/地区区号保留，号码中间部分脱敏。〔来源：AN-5a6d5d7130a7；liveshow-proto/prototype/annotations/user.js；settings.html/字段/3〕
- [REQ-2ff6e6688c79] 邮箱：展示已绑定邮箱，邮箱账号部分脱敏。〔来源：AN-b7671d5d23d7；liveshow-proto/prototype/annotations/user.js；settings.html/字段/4〕
- [REQ-da54d083fb0a] 登录密码：仅显示“已设置”或“未设置”；不展示密码内容。〔来源：AN-98bbcefa717b；liveshow-proto/prototype/annotations/user.js；settings.html/字段/5〕
- [REQ-0586497bc3b2] 系统通知：展示手机系统通知权限状态：未开启、已拒绝或已开启。〔来源：AN-80c5121c5cd0；liveshow-proto/prototype/annotations/user.js；settings.html/字段/6〕
- [REQ-e4981ba9af32] 开播提醒、互动通知：App 内通知分类偏好，不代表手机系统通知权限。〔来源：AN-6971621a5b06；liveshow-proto/prototype/annotations/user.js；settings.html/字段/7〕
- [REQ-3ee060d90dc8] 语言：用户端与主播端均支持中文、English、Bahasa Indonesia、Bahasa Melayu，默认 Bahasa Indonesia。〔来源：AN-3c1f5f534239；liveshow-proto/prototype/annotations/user.js；settings.html/字段/8〕
- [REQ-dcd63415d40b] 协议入口：展示当前有效版本的用户协议和隐私政策。〔来源：AN-f1d05cc1f831；liveshow-proto/prototype/annotations/user.js；settings.html/字段/9〕
- [REQ-e3bd04a8a537] 注销条件：金币余额低于 100。〔来源：AN-c00bd35d297e；liveshow-proto/prototype/annotations/user.js；settings.html/字段/10〕
- [REQ-57c184e99e79] 注销状态：包括金币余额不少于 100、金币余额低于 100 和提交后的七日冷静期。〔来源：AN-1a43401ac6ca；liveshow-proto/prototype/annotations/user.js；settings.html/字段/11〕
- [REQ-4fdff45d29cb] 手机号、邮箱和登录密码直接展示在设置页；登录页不提供设置、修改或忘记密码入口。〔来源：AN-a222e2fb9270；liveshow-proto/prototype/annotations/user.js；settings.html/业务/1〕
- [REQ-620f415b6634] 登录密码归属当前账号；设置后，已绑定手机号和邮箱均可使用同一密码登录。〔来源：AN-fd9b8f7025a6；liveshow-proto/prototype/annotations/user.js；settings.html/业务/2〕
- [REQ-fa68f3aa79be] 退出登录只清除当前设备登录会话，不删除账号和资产。〔来源：AN-2c9cc82d203c；liveshow-proto/prototype/annotations/user.js；settings.html/业务/3〕
- [REQ-2cf14872bf9d] 系统通知未开启时不展示站外推送；系统通知、互动通知等消息仍保留在站内通知中心。〔来源：AN-e16201153ae2；liveshow-proto/prototype/annotations/user.js；settings.html/业务/4〕
- [REQ-e9cc51e4642f] 开播提醒和互动通知仅控制对应 App 内分类偏好。〔来源：AN-6871288604ce；liveshow-proto/prototype/annotations/user.js；settings.html/业务/5〕
- [REQ-be3c83058cc1] 金币余额不少于 100 时不可注销；余额低于 100 时可进入确认流程。〔来源：AN-4ef93ea8c797；liveshow-proto/prototype/annotations/user.js；settings.html/业务/6〕
- [REQ-f8bcc68ab027] 提交注销申请后进入七日冷静期；期间账号、资产、社交关系、聊天记录及创建的粉丝团均保留。〔来源：AN-24e2780ab01c；liveshow-proto/prototype/annotations/user.js；settings.html/业务/7〕
- [REQ-d52be80ea0fa] 冷静期内可取消注销；期满仍未取消时，才解除社交关系、解散创建的粉丝团并最终删除账号及相关数据。〔来源：AN-131a67301e47；liveshow-proto/prototype/annotations/user.js；settings.html/业务/8〕
- [REQ-f186d449c143] 密码已设置 -> 显示“修改密码”，点击进入修改密码页；密码未设置 -> 显示“设置密码”，点击进入设置密码页。〔来源：AN-f732487d3f76；liveshow-proto/prototype/annotations/user.js；settings.html/交互/1〕
- [REQ-3d4e3a11a99d] 点击语言 -> 从页面底部打开语言选择抽屉；选择后立即更新当前语言并关闭抽屉。〔来源：AN-3b769bcbfbd7；liveshow-proto/prototype/annotations/user.js；settings.html/交互/2〕
- [REQ-39ee3da3f10b] 系统通知从未申请 -> 点击后模拟系统授权弹窗；拒绝后状态改为已拒绝。〔来源：AN-703d9e951b3c；liveshow-proto/prototype/annotations/user.js；settings.html/交互/3〕
- [REQ-344eeae4d06a] 系统通知已拒绝 -> 点击后提示前往手机系统设置，提供暂不开启和前往设置；已授权时显示已开启。〔来源：AN-4726a674c0b4；liveshow-proto/prototype/annotations/user.js；settings.html/交互/4〕
- [REQ-ac7a51ae49a5] 同一会话内每次点击注销账号，按金币余额不少于 100、低于 100 两种情况持续交替；离开设置页后不重置。〔来源：AN-5450609415f9；liveshow-proto/prototype/annotations/user.js；settings.html/交互/5〕
- [REQ-cfb4ff48756b] 两种弹窗均显示三条提示：余额低于 100 可注销、最终注销后解除全部社交关系并解散粉丝团、注销后七日内可取消注销。〔来源：AN-67996c0424c2；liveshow-proto/prototype/annotations/user.js；settings.html/交互/6〕
- [REQ-33f07a94908c] 金币余额不少于 100 -> 按钮从左到右为“查看余额、取消”。〔来源：AN-e8bb750d7238；liveshow-proto/prototype/annotations/user.js；settings.html/交互/7〕
- [REQ-24324b2a4408] 金币余额低于 100 -> 按钮从左到右为“确认注销、取消”；点击确认注销 -> 新弹窗自动倒计时 10 秒，仅显示取消按钮。〔来源：AN-7f025b88e45c；liveshow-proto/prototype/annotations/user.js；settings.html/交互/8〕
- [REQ-68795c484bd7] 倒计时结束 -> 提交注销申请，记录七日后的最终删除时间，展示提交结果并退出到登录与注册页；点击取消 -> 停止倒计时，不提交申请。〔来源：AN-fce61bfb6cd4；liveshow-proto/prototype/annotations/user.js；settings.html/交互/9〕
- [REQ-b22f236ee654] 冷静期内重新登录 -> 在登录与注册页展示可操作弹窗；取消注销后清除待注销状态并进入首页，暂不取消则关闭弹窗。〔来源：AN-4983e3eedfc7；liveshow-proto/prototype/annotations/user.js；settings.html/交互/10〕
- [REQ-7d818f9c9cf0] 退出登录 -> 二次确认；确认后返回登录页。〔来源：AN-5d70a95ebfcd；liveshow-proto/prototype/annotations/user.js；settings.html/交互/11〕

## 个人中心 / 视图-未设置密码
页面：views/settings/password-not-set.html；实际承载：liveshow-proto/prototype/pages/user/profile/settings.html；同一实体页面的状态或弹层视图。
- [META-d4f3f1926cd3] 页面用途：当前账号尚未设置登录密码。〔来源：AN-70737d50c802；liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html/场景/1〕
- [REQ-8e68ce40cbbb] 密码状态：显示“未设置”。〔来源：AN-ce5d1acba618；liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html/字段/3〕
- [REQ-4e91ea8783af] 操作：显示“设置密码”。〔来源：AN-6ea2e6247cfc；liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html/字段/4〕
- [REQ-6247f34fa79d] 密码设置完成前，手机号和邮箱仅可使用验证码登录。〔来源：AN-cb2a832b1e40；liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html/业务/1〕
- [REQ-c12238909b43] 点击设置密码 -> 进入设置密码页。〔来源：AN-8e3acbdd23b9；liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html/交互/1〕

## 个人中心 / 设置密码
页面：account-password-set.html；实际承载：liveshow-proto/prototype/pages/user/profile/account-password-set.html；实体页面。
- [META-d2c15a44d41d] 页面用途：已登录且尚未设置密码的用户，通过已绑定手机号或邮箱验证身份后设置登录密码。〔来源：AN-040d61ccc2b0；liveshow-proto/prototype/annotations/user.js；account-password-set.html/场景/1〕
- [REQ-3c60189f3c4a] 验证方式：可选择已绑定手机号或邮箱；联系方式脱敏展示。〔来源：AN-2929f95c6c56；liveshow-proto/prototype/annotations/user.js；account-password-set.html/字段/3〕
- [REQ-c07e0565f660] 验证码：必填，6 位数字；仅校验当前选中的手机号或邮箱收到的有效验证码。〔来源：AN-aac296f733aa；liveshow-proto/prototype/annotations/user.js；account-password-set.html/字段/4〕
- [REQ-411887a2a4e8] 登录密码：必填，至少 8 位。〔来源：AN-ef4ad6891958；liveshow-proto/prototype/annotations/user.js；account-password-set.html/字段/5〕
- [REQ-2585099ecfdd] 确认密码：必填，必须与登录密码一致。〔来源：AN-4b76d1068e5d；liveshow-proto/prototype/annotations/user.js；account-password-set.html/字段/6〕
- [REQ-4e7e16723ecf] 设置密码前必须完成当前账号的手机号或邮箱验证。〔来源：AN-068ad5367c0f；liveshow-proto/prototype/annotations/user.js；account-password-set.html/业务/1〕
- [REQ-33ded318ec34] 验证码错误、失效或已使用时不设置密码，并保留当前输入。〔来源：AN-f7ea7c6417a4；liveshow-proto/prototype/annotations/user.js；account-password-set.html/业务/2〕
- [REQ-db0051cdeede] 设置成功后，已绑定手机号和邮箱均可使用该密码登录。〔来源：AN-15ce388cc763；liveshow-proto/prototype/annotations/user.js；account-password-set.html/业务/3〕
- [REQ-60b0a17f6e8a] 点击获取验证码 -> 向当前选中的手机号或邮箱发送验证码，按钮进入 60 秒倒计时；倒计时结束后可重新获取。〔来源：AN-9ea2f4985cb3；liveshow-proto/prototype/annotations/user.js；account-password-set.html/交互/1〕
- [REQ-d895775a7fc5] 验证码不是 6 位或密码少于 8 位 -> 完成按钮不可用。〔来源：AN-f98503d70166；liveshow-proto/prototype/annotations/user.js；account-password-set.html/交互/2〕
- [REQ-d0cbebd513bc] 两次密码不一致 -> 不提交并提示；校验成功 -> 设置密码并返回设置页。〔来源：AN-76c933ddec80；liveshow-proto/prototype/annotations/user.js；account-password-set.html/交互/3〕

## 个人中心 / 修改密码
页面：account-password-change.html；实际承载：liveshow-proto/prototype/pages/user/profile/account-password-change.html；实体页面。
- [META-70f1f9b59f9f] 页面用途：已设置密码的用户使用当前密码修改登录密码。〔来源：AN-d068f5a42e37；liveshow-proto/prototype/annotations/user.js；account-password-change.html/场景/1〕
- [REQ-0817f48c7b49] 当前密码：必填，必须与当前有效密码一致。〔来源：AN-4dbc1c4d6dda；liveshow-proto/prototype/annotations/user.js；account-password-change.html/字段/3〕
- [REQ-18e752488ec8] 新密码：必填，至少 8 位，不能与当前密码相同。〔来源：AN-5d8aa6c165fe；liveshow-proto/prototype/annotations/user.js；account-password-change.html/字段/4〕
- [REQ-e92850c13ccf] 确认新密码：必填，必须与新密码一致。〔来源：AN-530e632e906a；liveshow-proto/prototype/annotations/user.js；account-password-change.html/字段/5〕
- [REQ-ea6b3f0953a4] 当前密码验证失败时不修改密码。〔来源：AN-e4bc87c7e4c3；liveshow-proto/prototype/annotations/user.js；account-password-change.html/业务/1〕
- [REQ-ce587729acac] 修改成功后新密码立即生效，旧密码不可再用于登录。〔来源：AN-3d8bec2f96ca；liveshow-proto/prototype/annotations/user.js；account-password-change.html/业务/2〕
- [REQ-d64401c506c6] 忘记当前密码时必须通过已绑定手机号或邮箱重置。〔来源：AN-6fa951124a78；liveshow-proto/prototype/annotations/user.js；account-password-change.html/业务/3〕
- [REQ-fe17f707f9b9] 当前密码错误、新密码与当前密码相同或两次新密码不一致 -> 保留输入并提示对应错误。〔来源：AN-4cd7c5fcdca5；liveshow-proto/prototype/annotations/user.js；account-password-change.html/交互/1〕
- [REQ-6920f539ff83] 点击忘记当前密码 -> 进入忘记密码页。〔来源：AN-bcae1d50d19b；liveshow-proto/prototype/annotations/user.js；account-password-change.html/交互/2〕
- [REQ-f4bd9b045d80] 校验成功 -> 修改密码并返回设置页。〔来源：AN-c9b340ff6c9a；liveshow-proto/prototype/annotations/user.js；account-password-change.html/交互/3〕

## 个人中心 / 忘记密码
页面：account-password-reset.html；实际承载：liveshow-proto/prototype/pages/user/profile/account-password-reset.html；实体页面。
- [META-b5ea8e9a7366] 页面用途：已登录用户忘记当前密码，通过已绑定手机号或邮箱验证身份后重置密码。〔来源：AN-825bbaa43526；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/场景/1〕
- [REQ-956eee627217] 验证方式：可选择已绑定手机号或邮箱；联系方式脱敏展示。〔来源：AN-cb32bbae830d；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/字段/3〕
- [REQ-da9ec0c10c8c] 验证码：必填，6 位数字；仅校验当前选中的手机号或邮箱收到的有效验证码。〔来源：AN-4e3ab9b40973；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/字段/4〕
- [REQ-4223d6635f79] 新密码：必填，至少 8 位。〔来源：AN-f48b7a69bffd；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/字段/5〕
- [REQ-eb63a688e121] 确认新密码：必填，必须与新密码一致。〔来源：AN-dda9cded1f22；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/字段/6〕
- [REQ-a17ae8f2bc3a] 重置密码前必须完成当前账号的手机号或邮箱验证。〔来源：AN-e15cf8aabdb5；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/业务/1〕
- [REQ-31ee1e2d297f] 验证码错误、失效或已使用时不重置密码，并保留当前输入。〔来源：AN-d04c56e0cd3a；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/业务/2〕
- [REQ-c59e965587e7] 重置成功后新密码立即生效，旧密码不可再用于登录。〔来源：AN-a50f02e4f5b1；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/业务/3〕
- [REQ-6ab1d015eba7] 点击获取验证码 -> 向当前选中的手机号或邮箱发送验证码，按钮进入 60 秒倒计时；倒计时结束后可重新获取。〔来源：AN-31031eb517fa；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/交互/1〕
- [REQ-76059c30b9b8] 验证码不是 6 位或密码少于 8 位 -> 重置密码按钮不可用。〔来源：AN-f9fbac0206fd；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/交互/2〕
- [REQ-ab6de0e5ca05] 两次密码不一致 -> 不提交并提示；校验成功 -> 重置密码并返回设置页。〔来源：AN-711686ecf3de；liveshow-proto/prototype/annotations/user.js；account-password-reset.html/交互/3〕

## 账号与登录 / 视图-注销冷静期
页面：views/auth-login-register/deletion-cooling.html；实际承载：liveshow-proto/prototype/pages/user/auth/auth-login-register.html；同一实体页面的状态或弹层视图。
- [META-e3cf4889437a] 页面用途：用户提交注销申请后七日内再次进入或登录 App。〔来源：AN-748b836ea4c9；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/场景描述/1〕
- [REQ-2deaeae43b2d] 可取消截止时间：注销申请提交时间加七日，格式为 MM/DD HH:mm。〔来源：AN-72b510ed286b；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/字段/3〕
- [REQ-4aba6dda321b] 操作：暂不取消、取消注销。〔来源：AN-33ddb805570e；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/字段/4〕
- [REQ-5fc094115b81] 冷静期内保留账号、资产、社交关系、聊天记录及创建的粉丝团，不执行最终删除。〔来源：AN-e8b063ba7298；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/业务规则/1〕
- [REQ-af8c536b44b6] 冷静期满仍未取消 -> 解除社交关系、解散创建的粉丝团并最终删除账号及相关数据。〔来源：AN-bfd2760092e2；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/业务规则/2〕
- [REQ-8b071c7b7730] 取消注销 -> 清除待注销状态，原有数据和关系保持不变。〔来源：AN-f0d6f98b40a3；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/业务规则/3〕
- [REQ-1cb452c4f51b] 点击暂不取消 -> 关闭弹窗并停留登录与注册页；点击取消注销 -> 清除待注销状态并直接登录。〔来源：AN-ee1ede28b7a6；liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html/交互/1〕

## 首页与发现 / 视图-首次登录通知说明
页面：views/live-plaza/notification-intro.html；实际承载：liveshow-proto/prototype/pages/user/home/live-plaza.html；同一实体页面的状态或弹层视图。
- [META-2d36da9d38fb] 页面用途：登录成功后首次进入首页，先向用户说明通知用途。〔来源：AN-ae2f3c1cb7b9；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html/场景描述/1〕
- [REQ-840ceceb0e3e] 标题：开启通知〔来源：AN-aaff877ae96c；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html/字段/3〕
- [REQ-524f47cf9134] 正文：开启后，你可以及时收到关注主播开播、互动消息及平台公告。〔来源：AN-5f0e2e852418；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html/字段/4〕
- [REQ-656ce1cd9ca9] 按钮：暂不开启、开启通知。〔来源：AN-bb7bc77f6b2d；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html/字段/5〕
- [REQ-c5181f8521fc] 首次登录进入首页时展示；选择开启或暂不开启后，后续登录不再展示。〔来源：AN-644ea27b27a9；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html/业务规则/1〕
- [REQ-1c8b0773d23f] 点击开启通知 -> 系统通知授权弹窗；点击暂不开启 -> 关闭说明且后续登录不再展示。〔来源：AN-765b80f7994d；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html/交互/1〕

## 首页与发现 / 视图-系统通知授权弹窗
页面：views/live-plaza/notification-permission.html；实际承载：liveshow-proto/prototype/pages/user/home/live-plaza.html；同一实体页面的状态或弹层视图。
- [META-f7f5230b8956] 页面用途：用户在首页同意开启通知后，选择是否授予系统通知权限。〔来源：AN-1d1eb921bf5f；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html/场景描述/1〕
- [REQ-1a2d13936555] 标题：“Luma Live”想给你发送通知〔来源：AN-183ed78b7152；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html/字段/3〕
- [REQ-e1ba2fcbd256] 正文：通知可能包括提醒、声音和图标标记。〔来源：AN-1c09f70f970e；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html/字段/4〕
- [REQ-1fdd47463976] 按钮：不允许、允许。〔来源：AN-d41a93159b85；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html/字段/5〕
- [REQ-16dc8a06fc75] 记录当前设备的系统授权结果；拒绝不影响站内通知接收。〔来源：AN-d56d8d42ee6c；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html/业务规则/1〕
- [REQ-37f11691aa7c] 模拟手机系统通知授权；允许后记录为已开启，不允许后记录为已拒绝。〔来源：AN-9af401959f37；liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html/交互/1〕

## 个人中心 / 视图-系统通知-从未申请
页面：views/settings/notification-default.html；实际承载：liveshow-proto/prototype/pages/user/profile/settings.html；同一实体页面的状态或弹层视图。
- [META-1c2b6d5f44cb] 页面用途：用户在设置页查看从未申请的系统通知权限，并发起授权。〔来源：AN-c300eee9d024；liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html/场景描述/1〕
- [REQ-37faac19e032] 系统通知：当前状态为未开启，尚未申请系统授权。〔来源：AN-cca398079843；liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html/字段/3〕
- [REQ-d7571534c73f] 通知权限属于当前设备；未获授权时不发送站外推送，站内通知仍保留。〔来源：AN-251be40f2342；liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html/业务规则/1〕
- [REQ-ab88d1d0a940] 系统通知从未申请时，点击入口调起模拟系统授权弹窗。〔来源：AN-378a55da7647；liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html/交互/1〕

## 个人中心 / 视图-系统通知-已拒绝
页面：views/settings/notification-denied.html；实际承载：liveshow-proto/prototype/pages/user/profile/settings.html；同一实体页面的状态或弹层视图。
- [META-93a0ba0f9c46] 页面用途：用户在设置页查看已拒绝的系统通知权限，并前往系统设置调整。〔来源：AN-65b36c9ea3dd；liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html/场景描述/1〕
- [REQ-97aec6dbac13] 系统通知：当前状态为已拒绝。〔来源：AN-2c02550cd04d；liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html/字段/3〕
- [REQ-6b526b040fc3] 操作：暂不开启关闭提示；前往设置用于调整系统权限。〔来源：AN-a5c3422b5b28；liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html/字段/4〕
- [REQ-3e1ae5ebbc5e] 系统权限已被拒绝时需在系统设置中调整；App 内分类开关不能代替系统授权。〔来源：AN-b3b5f2e84eb5；liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html/业务规则/1〕
- [REQ-ab2e5019404e] 系统通知已拒绝时，点击入口提示前往手机系统设置，提供暂不开启和前往设置。〔来源：AN-a919a97081e1；liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html/交互/1〕

## 个人中心 / 视图-系统通知-已授权
页面：views/settings/notification-granted.html；实际承载：liveshow-proto/prototype/pages/user/profile/settings.html；同一实体页面的状态或弹层视图。
- [META-bb97df1dff3d] 页面用途：用户在设置页查看已开启的系统通知权限。〔来源：AN-81a386f96576；liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html/场景描述/1〕
- [REQ-476f36a09670] 系统通知：当前状态为已开启。〔来源：AN-d2c66beeb2de；liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html/字段/3〕
- [REQ-44a79bfd880e] 开播提醒 / 互动通知：独立的 App 内通知分类偏好。〔来源：AN-320a083e78ce；liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html/字段/4〕
- [REQ-d5b5caf244b0] 获得系统权限后，开播提醒和互动通知仍分别受 App 内分类偏好控制。〔来源：AN-1c9593fa07b3；liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html/业务规则/1〕
- [REQ-38dd8250cdfd] 点击系统通知 -> 提示“系统通知已开启”；分类通知开关仍可独立切换。〔来源：AN-60c6fe1129bc；liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html/交互/1〕

## 直播 / 视图-礼物
页面：views/live-room/gift.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-b99fe888bb33] 礼物：展示名称、图标、单价和可用状态，均由平台配置。〔来源：AN-cd4a63db463e；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/字段/3〕
- [REQ-80a63c1ae2ea] 赠送数量：必选，实际扣减金币 = 单价 × 数量；幸运礼物按独立开奖次数计算。〔来源：AN-37aa841bb831；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/字段/4〕
- [REQ-661e85b151ed] 金币余额：普通用户显示真实金币余额；运营账号只显示所属公会发放的虚拟金币余额。〔来源：AN-d768cfd60b6b；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/字段/5〕
- [REQ-007896e4eadc] 礼物须处于上架且未过期状态；下架后不可继续赠送，历史记录保留。〔来源：AN-9fff67e7f8e4；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/业务/1〕
- [REQ-da5fddbef267] 幸运礼物用户实际消耗 = 送出价值 - 返奖金币；主播收益 = 送出价值 × 后台比例，默认 1%，返奖不影响主播收益。〔来源：AN-9fbb03fac905；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/业务/2〕
- [REQ-266b9b9485db] 运营账号没有真实金币；虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费。〔来源：AN-8435d28cf745；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/业务/3〕
- [REQ-8645b66c4c1b] 虚拟金币送礼可计入直播间氛围和榜单展示，但不形成主播收益或分成；具体榜单范围另见风险清单。〔来源：AN-ba0acac09cff；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/业务/4〕
- [REQ-dc247741b433] 运营账号不能加入粉丝团。〔来源：AN-3ee65908aa95；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/业务/5〕
- [REQ-4d7983ee3408] 成功赠送不可退款；请求失败或余额不足时不扣减金币。〔来源：AN-31c94e97f55c；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/业务/6〕
- [REQ-f453a49afcc1] 选择礼物和数量 -> 显示本次所需金币。〔来源：AN-f071634c44b5；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/交互/1〕
- [REQ-066734efc56b] 普通用户赠送成功 -> 扣减金币、播放礼物效果并更新余额和本场贡献；运营账号赠送成功 -> 扣减虚拟金币并播放礼物效果，只更新公屏氛围。〔来源：AN-beb5a28011d0；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/交互/2〕
- [REQ-bed789897c95] 普通用户余额不足 -> 不扣款并打开充值视图；运营账号虚拟金币不足 -> 不显示充值入口并提示联系公会发放。〔来源：AN-b4c169d7e861；liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html/交互/3〕

## 直播 / 视图-充值
页面：views/live-room/gift-recharge.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [META-13c042530b7d] 页面用途：用户赠送礼物时金币不足，在直播间内进入快捷充值。〔来源：AN-2ea14ada8192；liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html/场景/1〕
- [REQ-59889fd16fd0] 充值套餐、赠送金币和支付渠道按当前端及后台配置展示。〔来源：AN-9a4db5e16fa8；liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html/业务/1〕
- [REQ-9c3dd005dcb3] 支付成功后增加金币并生成充值记录；失败、取消或超时不增加余额。〔来源：AN-e05951839933；liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html/业务/2〕
- [REQ-bec14efd7f60] 运营账号没有真实金币，不可进入本视图或充值；虚拟金币只能由所属公会发放。〔来源：AN-308c8e6e6c9a；liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html/业务/3〕
- [REQ-e2dac29206f1] 选择套餐并支付成功 -> 刷新金币余额并返回礼物视图，原礼物不自动补送。〔来源：AN-465a4143fafb；liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html/交互/1〕
- [REQ-8407b3301ceb] 关闭或支付失败 -> 返回礼物视图，保留原礼物和数量选择。〔来源：AN-bf1d9831b7c1；liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html/交互/2〕

## 主播管理 / 视图-单人禁言确认
页面：views/fan-club/member-mute-confirm.html；实际承载：liveshow-proto/prototype/pages/user/host/fan-club.html；同一实体页面的状态或弹层视图。
- [META-c36aab35cc6d] 页面用途：主播在粉丝团成员列表中禁言指定成员前进行确认。〔来源：AN-f6738d79cca9；liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html/场景描述/1〕
- [REQ-b621cae1ce07] 确认对象：展示本次待禁言成员的昵称。〔来源：AN-e1ca294fb85e；liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html/字段/3〕
- [REQ-61ccc5511526] 操作：取消、确认禁言。〔来源：AN-9a01f213394a；liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html/字段/4〕
- [REQ-4ebe7fad319b] 禁言仅限制该成员在当前粉丝群内发言，不影响团籍、关注和直播间发言权限。〔来源：AN-2c6a6b8830e5；liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html/业务规则/1〕
- [REQ-085b31edbfa8] 确认 -> 禁止该成员在群内发言并提示成功；取消或请求失败 -> 保持原状态。〔来源：AN-286053f763c4；liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html/交互/1〕

## 直播 / 视图-粉丝团-未加入
页面：views/live-room/fan-club-not-joined.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-180019e43b1b] 粉丝团：展示主播粉丝团名称、成员数和当前等级。〔来源：AN-62be0f707f9c；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/字段/3〕
- [REQ-ec1fe27866b5] 加入条件：由主播配置，可包含已关注和累计贡献门槛；累计贡献统计用户给当前主播刷出的全部历史贡献，不按入团时间截断。〔来源：AN-89362d6252b2；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/字段/4〕
- [REQ-279bac8282bb] 权益：展示加入后可获得的群聊、灯牌和等级权益。〔来源：AN-518e9f6d56c8；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/字段/5〕
- [REQ-b534d337d5ab] 运营账号不能进入加入流程或加入粉丝团。〔来源：AN-ad3a19a5a76a；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/业务/1〕
- [REQ-5e497d5f205b] 普通用户须满足全部加入条件，且与主播不存在拉黑关系。〔来源：AN-5c78b36b3c91；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/业务/2〕
- [REQ-a182b35936fd] 每位主播一期仅有一个粉丝团；达到 500 人上限后不可加入。〔来源：AN-42ffd2eaf937；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/业务/3〕
- [REQ-8d9134a2137d] 加入成功后同步获得团籍和群籍，粉丝等级与亲密度从当前有效值开始累计。〔来源：AN-b79c18c4d0bf；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/业务/4〕
- [REQ-9eb5570eb0b5] 运营账号进入本视图 -> 拒绝并返回直播间。〔来源：AN-9f3fa58a5936；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/交互/1〕
- [REQ-5f0ad5d51315] 条件未满足或加入请求失败 -> 不加入并提示“未满足进群条件”。〔来源：AN-7f9cc845043e；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/交互/2〕
- [REQ-9577b57d4264] 加入成功 -> 切换为已加入视图并开放粉丝群入口。〔来源：AN-f57f3a8c1252；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html/交互/3〕

## 直播 / 视图-粉丝团-已加入
页面：views/live-room/fan-club-joined.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-6cb7cd274866] 粉丝等级：用户在当前主播粉丝团内的社群身份等级。〔来源：AN-ec466b8ca613；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/字段/3〕
- [REQ-619a03c41f22] 亲密度：用户与当前主播的一对一关系数值。〔来源：AN-e9f183487dee；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/字段/4〕
- [REQ-37f0730a9355] 团籍状态：与粉丝群成员资格同步。〔来源：AN-296790ab01ce；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/字段/5〕
- [REQ-befef46a7065] 有效团籍用户可进入粉丝群并展示对应灯牌和粉丝等级。〔来源：AN-fb481a28ab21；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/业务/1〕
- [REQ-c1c02f0ed440] 主动退出、被主播移出或账号拉黑 -> 团籍和群籍同时解除，粉丝等级与亲密度清零。〔来源：AN-c39bc8780e1f；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/业务/2〕
- [REQ-0f1b9b9f419d] 重新加入从 0 开始，不恢复历史等级和亲密度。〔来源：AN-d60f0aa2d9c8；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/业务/3〕
- [REQ-13a3700c77c0] 查看贡献 -> 进入当前主播贡献榜；退出粉丝团 -> 二次确认后立即更新身份和入口。〔来源：AN-e0d89d4d59a2；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html/交互/1〕

## 直播 / 视图-被禁言
页面：views/live-room/comment-muted.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-45a34d176517] 禁言只限制当前直播场次的公屏发言，不影响观看、送礼和私信。〔来源：AN-0fca3fe21762；liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html/业务/1〕
- [REQ-356e381feef2] 主播或房管解除禁言后，用户立即恢复发言。〔来源：AN-3e364768b923；liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html/业务/2〕
- [REQ-d2b99245e75b] 本场未解除禁言时，用户进入同一主播的下一场直播后恢复发言。〔来源：AN-b6c052b79876；liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html/业务/3〕
- [REQ-bcffb5921e06] 输入框显示禁言状态并不可提交；尝试发送时不生成消息、不写入公屏记录。〔来源：AN-e4269e83ec71；liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html/交互/1〕

## 直播 / 视图-密码房-访问受限
页面：views/live-room/password-room-restricted.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-cd6f289d70fd] 房间密码：必填，必须为 4-12 个数字；校验当前直播场次的有效密码。〔来源：AN-46386c2c586f；liveshow-proto/prototype/annotations/user.js；views/live-room/password-room-restricted.html/字段/3〕
- [REQ-40ec20ca1e69] 普通用户的账号封禁、双方拉黑或本场踢出优先于密码校验；巡房人员从有效巡房任务进入时无需密码，平台封禁仍优先拦截。〔来源：AN-c9df241391df；liveshow-proto/prototype/annotations/user.js；views/live-room/password-room-restricted.html/业务/1〕
- [REQ-2a32a0758d0d] 密码不是 4-12 个数字 -> 保留输入并提示“密码必须是4-12个数字”；密码格式有效但不正确 -> 保留输入并提示“密码错误，请重新输入”；密码正确 -> 进入直播间；关闭 -> 返回来源页。〔来源：AN-730182f5ce11；liveshow-proto/prototype/annotations/user.js；views/live-room/password-room-restricted.html/交互/1〕

## 直播 / 视图-门票房-访问受限
页面：views/live-room/ticket-room-restricted.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-77269d830ed3] 门票价格：主播开播时从后台已启用的价格档位中选择，以金币计价。〔来源：AN-32a202dcc6ba；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/字段/3〕
- [REQ-1795e7168741] 金币余额：普通用户使用当前账号实时真实金币余额；运营账号免票，不读取虚拟金币用于购票。〔来源：AN-aa64246f3f54；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/字段/4〕
- [REQ-13c2c3d88f23] 门票仅对当前直播场次有效，同场重复进入不重复收费。〔来源：AN-f01211e7e1c6；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/业务/1〕
- [REQ-1cfb42cb266a] 场次结束或被踢出后门票失效；已支付金币不退款。〔来源：AN-23095bb8e04e；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/业务/2〕
- [REQ-c9fb86f8370c] 普通用户的账号封禁、双方拉黑或本场踢出优先于购票状态；巡房人员从有效巡房任务进入时无需购票，平台封禁仍优先拦截。〔来源：AN-287750ad376b；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/业务/3〕
- [REQ-53b1de5b3615] 运营账号进入门票房时免票，不展示购票弹窗、不生成门票订单、不扣减虚拟金币。〔来源：AN-4cfdeb029910；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/业务/4〕
- [REQ-897e4e886499] 普通用户进入直播间后由封面图和毛玻璃完全遮挡直播内容，中央显示购票弹窗；余额充足并确认购买 -> 扣减一次真实金币、生成支出记录并移除遮挡；余额不足 -> 不扣款并打开充值入口；取消 -> 返回来源页。运营账号 -> 免票直接进入直播间。〔来源：AN-5fb3b18f06f7；liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html/交互/1〕

## 直播 / 视图-非粉丝团成员-访问受限
页面：views/live-room/fan-club-room-restricted.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [META-1ff0d4ad580f] 页面用途：非粉丝团成员进入已开启成员限制的密码房。〔来源：AN-9f6f13e06db4；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html/场景/1〕
- [REQ-709536067902] 广场展示开启时，非成员仍可看到直播卡片，但点击后不能进入。〔来源：AN-e46c31128993；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html/业务/1〕
- [REQ-856bb0bf75be] 已在房内的非成员不退出，离开后再次进入时拦截；有效成员继续校验房间密码。〔来源：AN-032170b2af9b；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html/业务/2〕
- [REQ-fe06e09de42d] 账号封禁、双方拉黑和本场踢出优先；巡房人员和运营账号可绕过成员限制。〔来源：AN-4decf6d602d7；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html/业务/3〕
- [REQ-10710e09600b] 显示直播封面毛玻璃遮挡，标题“无法进入直播间”，提示“访问直播间需先加入主播粉丝团”；点击“返回”回到来源页，无来源时返回首页。〔来源：AN-22382e32d1d0；liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html/交互/1〕

## 直播 / 视图-被拉黑或踢出-访问受限
页面：views/live-room/blocked-room-restricted.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [META-48df87a45423] 页面用途：普通用户进入已被主播拉黑或本场踢出的直播间。〔来源：AN-a8c4a4533b6f；liveshow-proto/prototype/annotations/user.js；views/live-room/blocked-room-restricted.html/场景/1〕
- [REQ-cdfae3392221] 主播黑名单和本场踢出状态优先于密码、门票状态；普通用户不可观看直播、评论或送礼。巡房人员从有效巡房任务进入时不应用此拦截。〔来源：AN-1f89e2cd0b36；liveshow-proto/prototype/annotations/user.js；views/live-room/blocked-room-restricted.html/业务/1〕
- [REQ-156063d236d2] 进入直播间后由封面图和毛玻璃完全遮挡直播内容，中央提示“与主播存在拉黑或被踢出关系”；点击“返回” -> 回到来源页，无来源时返回首页。〔来源：AN-da5ac7cd01bd；liveshow-proto/prototype/annotations/user.js；views/live-room/blocked-room-restricted.html/交互/1〕

## 直播 / 视图-在线观众-观众列表
页面：views/live-room/audience-online.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-52f4b1869e7b] 用户：展示头像、昵称及当前身份。〔来源：AN-7cf44d3694f6；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/字段/3〕
- [REQ-a205593a7c87] 财富等级：按账号有效消费成长值计算。〔来源：AN-db2f825de40c；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/字段/4〕
- [REQ-3bea5c2fc073] 房管状态：已授权房管展示房管标识。〔来源：AN-511b57662f65；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/字段/5〕
- [REQ-a0337be4b642] 仅展示当前直播场次仍在线的观众，进入和离开后实时更新。〔来源：AN-c9d275b0a75c；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/业务/1〕
- [REQ-4131788f5e35] 被踢出用户立即移出列表，且本场不可重新进入。〔来源：AN-877790b3eb11；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/业务/2〕
- [REQ-ce2e988e4307] 主播、房管和普通观众的可执行操作按当前查看者权限展示。〔来源：AN-f4ab11a58205；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/业务/3〕
- [REQ-b7924f176c59] 点击用户 -> 打开对应资料卡；切换至房管 -> 展示当前主播已授权房管。〔来源：AN-1677328dd85e；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html/交互/1〕

## 直播 / 视图-在线观众-房管列表
页面：views/live-room/audience-managers.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-87f9adb35bc9] 房管：展示头像、昵称和在线状态。〔来源：AN-7f3303659f7a；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/字段/3〕
- [REQ-6aa2ed812b38] 授权状态：按主播与用户的长期房管关系读取，不随场次结束清除。〔来源：AN-d5afe58dadb0；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/字段/4〕
- [REQ-1308957fd585] 每位主播最多设置 3 名房管；目标用户不得与主播互相拉黑。〔来源：AN-7ec13b158a96；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/业务/1〕
- [REQ-39e6e8a40af8] 已授权后任一方建立账号拉黑关系，房管身份自动解除；取消拉黑后不自动恢复。〔来源：AN-918e3a5f3129；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/业务/2〕
- [REQ-a39354cda7ef] 房管可在主播直播间执行禁言、踢出和屏蔽单条评论。〔来源：AN-0117260cb139；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/业务/3〕
- [REQ-16aa6fb8b07f] 主播取消授权后立即失去管理权限，不影响其普通观众身份。〔来源：AN-91431471d76f；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/业务/4〕
- [REQ-9afe74673c0a] 主播取消房管 -> 二次确认后更新列表；因拉黑自动解除 -> 立即更新房管列表和管理权限；普通观众只读查看，不显示授权操作。〔来源：AN-4206d7a7462a；liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html/交互/1〕

## 直播 / 视图-用户资料卡-普通观众
页面：views/live-room/profile-viewer.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-e8ca95fbaeb6] 用户资料：展示头像、昵称、用户 ID、财富等级和粉丝团身份。〔来源：AN-454eead05737；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html/字段/3〕
- [REQ-24d552ed2e8a] 关系状态：分别读取关注、好友和拉黑关系。〔来源：AN-3dc79692d65c；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html/字段/4〕
- [REQ-b495d13b037f] 关注、好友和私信权限分别校验；非好友最多主动发送 3 条私信。〔来源：AN-139a8a1ca9ac；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html/业务/1〕
- [REQ-a9962f44fbc9] 任一方拉黑后不能关注、申请好友或私信，已有相关关系解除。〔来源：AN-677aabac69c9；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html/业务/2〕
- [REQ-019f8584f54c] 关注或申请好友成功 -> 更新关系状态；举报 -> 进入账号举报流程；点击主页 -> 进入该用户主页。〔来源：AN-141c22c8fd50；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html/交互/1〕

## 直播 / 视图-用户资料卡-房管
页面：views/live-room/profile-moderator.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-e37fd98de8ad] 房管拥有普通资料卡操作，并可对当前场次普通观众执行禁言和踢出。〔来源：AN-7ce9589ef530；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html/业务/1〕
- [REQ-8068c209e737] 房管不能处置主播本人。〔来源：AN-d9648977b157；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html/业务/2〕
- [REQ-0ab6c2bbea8e] 巡房会话中的人员不可被拉黑或踢出。〔来源：AN-74539c759988；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html/业务/3〕
- [REQ-c1b7c1798471] 禁言和踢出只作用于当前直播场次。〔来源：AN-364eebce2406；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html/业务/4〕
- [REQ-0165e1efd627] 禁言或踢出 -> 打开对应确认视图；取消 -> 保持用户当前状态。〔来源：AN-25983269614d；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html/交互/1〕

## 直播 / 视图-禁言确认
页面：views/live-room/profile-moderator-mute.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-405d165ca7cd] 禁言仅限制目标用户当前场次公屏发言，不影响观看、送礼和私信；下一场默认恢复。〔来源：AN-6f001cfac877；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-mute.html/业务/1〕
- [REQ-c1cf1dffdbca] 确认 -> 写入本场禁言状态并更新输入框、资料卡和禁言列表；取消或关闭 -> 不改变状态。〔来源：AN-d8d36012e5ae；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-mute.html/交互/1〕

## 直播 / 视图-踢出确认
页面：views/live-room/profile-moderator-remove.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-46bf665b8202] 踢出只作用于当前直播场次；目标用户下一场可重新进入。门票房被踢出后门票失效且不退款。巡房会话中的人员不可被踢出。〔来源：AN-b4c5e15aa298；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-remove.html/业务/1〕
- [REQ-fcc05c0f3df1] 确认 -> 用户立即退出、写入本场踢出状态并从在线列表移除；取消或关闭 -> 不改变状态。〔来源：AN-6e12fc7adeb1；liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-remove.html/交互/1〕

## 直播 / 视图-本场贡献-贡献榜
页面：views/live-room/contribution-rank.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-f824d220c8d2] 榜单数量：完成全部排序后显示前 99 名；第 99 名与第 100 名贡献值相同时，继续按后续条件确定顺序。〔来源：AN-825c9a9aff56；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/字段/3〕
- [REQ-2e0be6049dd2] 排名：依次按本场贡献值、当前主播粉丝团内的粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。〔来源：AN-cdb59dca6d05；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/字段/4〕
- [REQ-7937da5f4be3] 本场贡献值的真实金币部分：当前场次内成功送出的各礼物单价 × 数量之和；幸运礼物返奖不冲减贡献值。〔来源：AN-cfe78c65542c；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/字段/5〕
- [REQ-6b2e57f33816] 我的排名：固定显示在榜单底部；进入榜单时显示排名，未进入榜单时显示“-”。〔来源：AN-a9a1e87f6730；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/字段/6〕
- [REQ-68eb3122d10e] 粉丝等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。〔来源：AN-b6fb5bbc0bad；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/业务/1〕
- [REQ-5d9d7f962139] 失败或撤销赠送不计入；有效消费冲正后重新计算贡献值和排名，充值退款不撤销已完成送礼。〔来源：AN-2461ddda09db；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/业务/2〕
- [REQ-9186ff81b630] 场次结束后榜单作为历史快照保留。账号注销后保留历史贡献，名称显示“账号已注销”，且不能进入主页。〔来源：AN-e28327cda48e；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/业务/3〕
- [REQ-10a3463ba691] 榜单滚动 -> 我的排名固定在底部。〔来源：AN-c59533abecb7；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/交互/1〕
- [REQ-340fbe842669] 切换贡献榜或收到礼物 -> 保持当前场次范围；点击用户 -> 打开用户资料卡。〔来源：AN-d5de49201b93；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html/交互/2〕

## 直播 / 视图-本场贡献-收到礼物
页面：views/live-room/contribution-gifts.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-3bf510084052] 礼物：展示礼物名称、图标和当前场次收到数量。〔来源：AN-463afe5102e0；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html/字段/3〕
- [REQ-f3aa67f19ddf] 赠送用户：展示本场成功赠送该礼物的用户。〔来源：AN-134d15d516d2；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html/字段/4〕
- [REQ-e4023aa2b5d8] 贡献值：贡献值 = 礼物单价 × 本场成功送出数量；幸运礼物返奖不冲减该值。〔来源：AN-7bc321725424；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html/字段/5〕
- [REQ-c03f091d9922] 仅统计成功赠送记录；幸运礼物展示送出数量和开奖结果，用户净消耗与主播收益按各自口径计算；失败或撤销记录不展示。〔来源：AN-725787570b6a；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html/业务/1〕
- [REQ-f7cba1074b52] 切换至贡献榜 -> 返回同一场次的用户排名；点击赠送用户 -> 打开用户资料卡。〔来源：AN-f18b25043408；liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html/交互/1〕

## 直播 / 视图-更多功能（用户）
页面：views/live-room/more-actions.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-e7b0a1e901ab] 转发不改变房间准入规则，接收人仍须完成门票、密码和账号关系校验。〔来源：AN-20540e9dae05；liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html/业务/1〕
- [REQ-1555772049b0] 举报直播仅在直播中生成当前场次举报工单。〔来源：AN-babb60986c2c；liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html/业务/2〕
- [REQ-21c978d77e36] 清屏只清除当前设备公屏显示，不删除服务端消息。〔来源：AN-691fba7232ef；liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html/业务/3〕
- [REQ-5595f6c46cc3] 选择转发 -> 调起系统分享；选择举报 -> 进入直播举报页；选择清屏 -> 立即清空当前显示并关闭菜单；点击遮罩 -> 关闭菜单。〔来源：AN-6e2075f4ddd0；liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html/交互/1〕

## 直播 / 视图-主播资料卡
页面：views/live-room/host-profile.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room.html；同一实体页面的状态或弹层视图。
- [REQ-6b8f1d1789a8] 主播资料：展示头像、昵称、主播等级、财富等级和用户 ID。〔来源：AN-2593e96da04a；liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html/字段/3〕
- [REQ-2f00157ac134] 直播状态：关联当前直播场次；场次结束后更新为未开播。〔来源：AN-9e873ac1fce7；liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html/字段/4〕
- [REQ-4b36047617a5] 关系状态：分别读取关注、好友、粉丝团和拉黑关系。〔来源：AN-5810685c5693；liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html/字段/5〕
- [REQ-a17f58e5344e] 用户与主播共用账号和社交关系；拉黑后不能关注、申请好友、私信、观看直播或加入粉丝团。〔来源：AN-edc801b32ab7；liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html/业务/1〕
- [REQ-f6baa5b5497f] 进入主页、关注、申请好友、私信和举报均作用于当前主播账号；状态变更后同步更新直播间入口。〔来源：AN-1f6aaa7d2a7a；liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html/交互/1〕

## 直播 / 视图-本场贡献-贡献榜
页面：views/live-room-host/contribution-rank.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-0dc836b4c15d] 统计范围：统计当前直播场次内所有产生有效贡献的非运营账号，包含当前在线和已经离线的用户。〔来源：AN-fa23a2a2adc8；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/字段/3〕
- [REQ-ca2bec752921] 榜单数量：完成全部排序后显示前 99 名；第 99 名与第 100 名贡献值相同时，继续按后续条件确定顺序。〔来源：AN-ccfefa156707；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/字段/4〕
- [REQ-d641aedb45b9] 排名：依次按本场累计贡献值、当前主播粉丝团内的粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。〔来源：AN-b69a49808534；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/字段/5〕
- [REQ-b614f798a960] 用户身份：展示头像、昵称、财富等级、粉丝等级、灯牌和亲密度；无对应身份时不展示。〔来源：AN-20964653f51c；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/字段/6〕
- [REQ-2bbd67ce639a] 禁言状态：当前场次被禁言用户展示禁言标识。〔来源：AN-4adf3b43164a；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/字段/7〕
- [REQ-97187d7ee032] 本场贡献榜为当前场次累计榜，统计在线和非在线的非运营账号；用户离开直播间后仍保留本场贡献值和排名。〔来源：AN-e062dbd4ae13；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/业务/1〕
- [REQ-c5411596f1d1] 粉丝等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。〔来源：AN-528ad55c06e5；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/业务/2〕
- [REQ-9de8ffee4407] 当前场次贡献值按成功送出礼物价值累计；幸运礼物按单价 × 送出数量计算，返奖不冲减贡献值。〔来源：AN-1a1d3a391806；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/业务/3〕
- [REQ-6d8fdcaf95b2] 失败或撤销赠送不计入贡献；有效消费冲正后重新计算贡献值和排名。充值退款不撤销已完成的礼物消费。〔来源：AN-a426a911d2f5；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/业务/4〕
- [REQ-ac295ec06da1] 场次结束后榜单保留为历史快照。账号注销后保留历史贡献，名称显示“账号已注销”，且不能进入主页。〔来源：AN-5906b85bb68f；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/业务/5〕
- [REQ-1a53896d30e7] 切换至观众 -> 展示当前在线观众；点击用户 -> 打开主播权限资料卡；私信 -> 进入与该用户的单聊。〔来源：AN-d70f1747b656；liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html/交互/1〕

## 直播 / 视图-在线观众-观众列表
页面：views/live-room-host/audience-viewers.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [META-aa7272057a71] 页面用途：主播查看当前直播场次在线观众，按贡献或停留时长识别重点用户并发起私信。〔来源：AN-4ce2f61fa930；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/场景/1〕
- [REQ-75ca663f5469] 用户：展示头像和昵称；仅包含当前仍在线的观众。〔来源：AN-cd05bdb85a26；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/字段/3〕
- [REQ-1588ce2d4e7d] 财富等级：按累计充值/消费成长值匹配后台等级配置；前端展示服务端等级，无数据时不展示。〔来源：AN-bae56d019a02；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/字段/4〕
- [REQ-dfcfbb57f874] 灯牌/粉丝等级/亲密度：用户属于当前主播粉丝团时展示；无有效团籍时不展示。〔来源：AN-9a0aded21447；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/字段/5〕
- [REQ-b989ba5f4b18] 停留时长：用户在本场次直播间在线的累计时长。〔来源：AN-5339e350ab40；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/字段/6〕
- [REQ-308e1c0a8899] 在线观众贡献：展示当前在线观众在本场累计的有效贡献值；已经离线的用户不在本列表展示。〔来源：AN-0539d28ed36f；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/字段/7〕
- [REQ-dd5c94f29b4f] 禁言状态：当前场次被禁言时展示禁言标识。〔来源：AN-c4e5e68c603d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/字段/8〕
- [REQ-4bdbfbdd6c9a] 在线观众列表只统计当前在线用户；用户离线后从本列表移除，但其贡献仍保留在本场贡献榜。〔来源：AN-5b64f9f46ffb；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/业务/1〕
- [REQ-e7a516b36cee] 列表随进入、离开和踢出实时更新；踢出后立即移除且本场不可重进。〔来源：AN-cb2910bfe4bf；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/业务/2〕
- [REQ-c54be6966791] 按贡献时，依次按本场贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序。〔来源：AN-2ab0a2a852ff；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/业务/3〕
- [REQ-bd7034620e3a] 按停留时长时，依次按本场累计在线时长、本场贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序。〔来源：AN-894db86f2a7d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/业务/4〕
- [REQ-f5c9c76a625a] 粉丝等级或财富等级缺失时按 0 级参与排序；排序只改变展示顺序，不改变用户身份、权限和处置状态。〔来源：AN-1f7c1b538054；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/业务/5〕
- [REQ-5054f5f63ecd] 房管身份单独维护；取消房管后用户仍可作为普通观众留在列表。〔来源：AN-f4662d441eac；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/业务/6〕
- [REQ-c6e10e34854a] 切换贡献 TOP10/观众 -> 在当前弹层切换榜单和在线列表。〔来源：AN-be82713b590e；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/交互/1〕
- [REQ-83a1d7cf23e6] 切换按贡献/按停留时长 -> 立即重排，不关闭弹层。〔来源：AN-544e63ab54cf；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/交互/2〕
- [REQ-20675b67160f] 点击私信 -> 进入与该用户的单聊；发送权限仍按好友和拉黑关系校验。〔来源：AN-fcf54b9d283f；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/交互/3〕
- [REQ-d261bc4d304f] 点击用户 -> 打开主播权限资料卡；关闭 -> 返回直播间且保留直播状态。〔来源：AN-009fd63f2d6e；liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html/交互/4〕

## 直播 / 视图-禁用用户
页面：views/live-room-host/muted-users.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-d6b7442a2603] 用户：展示头像、昵称及执行禁言时的身份信息。〔来源：AN-5e513c2e3396；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/字段/3〕
- [REQ-44ec20cb5bff] 操作人：记录执行禁言的主播或房管。〔来源：AN-3e21e1cabab7；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/字段/4〕
- [REQ-26cd3af5bbb1] 禁言状态：仅关联当前直播场次。〔来源：AN-2ecba0ef4ac7；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/字段/5〕
- [REQ-a5c4d32cf5b0] 仅展示当前场次仍处于禁言状态的用户。〔来源：AN-8d0e76baebc7；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/业务/1〕
- [REQ-bd789fc1319f] 场次结束后全部本场禁言失效，下一场默认恢复。〔来源：AN-b698a9c058ec；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/业务/2〕
- [REQ-f03b4e917469] 用户离开直播间不自动解除禁言；本场重进后继续生效。〔来源：AN-f928efbb09f1；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/业务/3〕
- [REQ-64a7e2a16f10] 恢复发言 -> 打开确认视图；确认成功后移出列表并同步更新资料卡和评论输入状态；请求失败时保持禁言并提示“请求失败”。〔来源：AN-c8e2506aed4d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html/交互/1〕

## 直播 / 视图-恢复发言确认
页面：views/live-room-host/restore-speaking-confirm.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-0ef5361aead4] 仅可恢复当前场次仍被禁言的用户；用户已恢复或场次已结束时不重复执行。〔来源：AN-0e6a54b6f49b；liveshow-proto/prototype/annotations/user.js；views/live-room-host/restore-speaking-confirm.html/业务/1〕
- [REQ-26841d4c5bb2] 确认 -> 解除本场禁言、移出禁言列表并恢复公屏输入；取消、关闭或请求失败 -> 保持原状态并给出结果反馈。〔来源：AN-43ac1264105d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/restore-speaking-confirm.html/交互/1〕

## 直播 / 视图-观众资料卡-主播
页面：views/live-room-host/profile-host.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-fb165905feb1] 用户资料：展示头像、昵称、用户 ID、财富等级和粉丝团身份。〔来源：AN-f3a002763dc6；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/字段/3〕
- [REQ-f9c368552fe8] 房管状态：读取该用户与当前主播的长期房管关系。〔来源：AN-6ccadf6bee11；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/字段/4〕
- [REQ-e6f248de1637] 本场状态：展示在线、禁言和踢出状态。〔来源：AN-c7f9b0a6cae4；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/字段/5〕
- [REQ-3712a1e7b851] 主播可使用快捷答谢、私信、@、举报，并设置或取消房管、禁言和踢出。〔来源：AN-5571fde475fa；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/业务/1〕
- [REQ-fbdd86f2bdcf] 快捷答谢只预填公屏文案，不赠送礼物、不自动发送。〔来源：AN-7b52adc650ef；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/业务/2〕
- [REQ-30c04f250716] 房管最多 3 人；双方存在拉黑关系或目标已被踢出时不可新增房管。〔来源：AN-6ba591ad38e2；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/业务/3〕
- [REQ-50aaf6e7f126] 禁言和踢出只作用于当前场次；房管授权长期有效。〔来源：AN-2df0b6abc40a；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/业务/4〕
- [REQ-0448a822e711] 目标处于巡房会话时不展示拉黑和踢出操作，服务端拒绝相关请求。〔来源：AN-e6b4bea3cfb7；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/业务/5〕
- [REQ-4c226126ff33] 点击答谢 -> 关闭资料卡并预填答谢文案；设置或取消房管、禁言或恢复发言、踢出 -> 使用同一确认弹窗；房管达到上限 -> 不执行并提示“已达3人上限”；状态变更后同步更新在线列表、禁言列表和资料卡。〔来源：AN-c62dff715775；liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html/交互/1〕

## 直播 / 视图-快捷答谢
页面：views/live-room-host/thank-message.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-b3eec5b5991d] 答谢对象：使用当前资料卡用户昵称，并以 @用户名 开头。〔来源：AN-06cd48d4e04d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html/字段/3〕
- [REQ-29f1904d9d95] 答谢语：固定预填“谢谢你送的礼物！”，主播可在发送前修改。〔来源：AN-1908d332bf2f；liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html/字段/4〕
- [REQ-255b690d719b] 快捷答谢本质为公屏文案预填，不赠送礼物，不产生礼物记录，也不自动发送。〔来源：AN-a4b44e78a65f；liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html/业务/1〕
- [REQ-c99d1c5027bc] 点击答谢 -> 关闭资料卡并返回直播间输入区 -> 预填“@用户名 谢谢你送的礼物！”并聚焦输入框 -> 主播修改或直接点击发送后才写入公屏。〔来源：AN-09d1fac32dbb；liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html/交互/1〕

## 直播 / 视图-重点观众
页面：views/live-room-host/focus-viewers.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-ff153d502611] 重点标签：可标记新粉丝、本场贡献最高、未加入粉丝团；同一用户可命中多个标签。〔来源：AN-14a2f5268fb6；liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html/字段/3〕
- [REQ-2e624b28feca] 用户信息：展示头像、昵称、财富等级、粉丝身份和本场贡献。〔来源：AN-b181d882afef；liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html/字段/4〕
- [REQ-a1d053f257e3] 重点观众根据当前场次和粉丝关系实时计算，不是人工授权身份。〔来源：AN-20c7c32464ae；liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html/业务/1〕
- [REQ-d43c0b4437c9] 标签只用于主播识别，不改变用户权限；用户离线后从当前列表移除。〔来源：AN-e564162d2eee；liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html/业务/2〕
- [REQ-b506e33894b6] 点击用户 -> 打开主播权限资料卡；私信或 @ -> 作用于所选用户。〔来源：AN-7aa5a5aad88b；liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html/交互/1〕

## 直播 / 视图-连麦主播
页面：views/live-room-host/cohost-hosts.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-5c70fc647de5] 主播：展示头像、昵称、主播 ID 和当前直播状态。〔来源：AN-f1a3f0554689；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/字段/3〕
- [REQ-f9623e60781e] 邀请状态：可为可邀请、邀请中、已接受、已拒绝或已失效。〔来源：AN-7e3fdd9def45；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/字段/4〕
- [REQ-250e13b31320] 仅普通房支持连麦，固定两位主播，不支持观众上麦。〔来源：AN-8e9093a07685；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/业务/1〕
- [REQ-fcf4f0b8f117] 双方须正在直播、均未处于连麦中且不存在账号拉黑关系。〔来源：AN-8c5b6b724c1e；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/业务/2〕
- [REQ-00c732684671] 发起方同一时间只能存在 1 个待处理邀请；接收方可以收到多个邀请。〔来源：AN-21570ea5cbd2；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/业务/3〕
- [REQ-fed69bde9ff8] 任一方结束直播、变更为受限房型或进入连麦 -> 不再满足的邀请失效。〔来源：AN-78012834aa35；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/业务/4〕
- [REQ-b5c3e7b92403] 邀请成功 -> 标记邀请中并禁止重复发送；搜索无结果或主播未在普通房直播 -> 显示“查询结果为空或主播未在普通房直播”；请求失败 -> 不生成邀请并提示“请求失败”；搜索结果在固定高度覆盖层展示。〔来源：AN-d6532f646323；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html/交互/1〕

## 直播 / 视图-连麦主播-搜索结果
页面：views/live-room-host/cohost-hosts-search-result.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-df6f8435c673] 搜索关键词：必填，支持主播 ID 或昵称，去除首尾空格后匹配。〔来源：AN-271ae9424ee6；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html/字段/3〕
- [REQ-5830c74dc05c] 搜索结果：展示主播身份、开播状态和可邀请状态。〔来源：AN-0f1d792b923e；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html/字段/4〕
- [REQ-dce26fcff56a] 仅返回当前在普通房直播、未连麦且双方无账号拉黑关系的主播。〔来源：AN-35e3d97e62b4；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html/业务/1〕
- [REQ-a49ccecb1483] 关键词为空 -> 返回未搜索状态；无匹配或主播未在普通房直播 -> 显示“查询结果为空或主播未在普通房直播”；点击结果 -> 发送邀请；已有发出的请求 -> 提示“已有发出请求，请先取消”。〔来源：AN-44028111cf4b；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html/交互/1〕

## 直播 / 视图-收到连麦邀请
页面：views/live-room-host/cohost-invite-notice.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-9fa5cc4e0691] 邀请主播：展示头像、昵称和当前待处理邀请数。〔来源：AN-4bc60fb5c419；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html/字段/3〕
- [REQ-710201f95e6c] 有效状态：邀请双方仍在播、未连麦且房型为普通房时有效。〔来源：AN-fd5f536df95d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html/字段/4〕
- [REQ-2ca651adc6a8] 仅展示当前有效邀请；失效邀请立即关闭或从列表移除。〔来源：AN-95646da5ea86；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html/业务/1〕
- [REQ-834d5ef87be0] 单个邀请提示停留 4 秒；新增邀请更新当前提示，不重复叠加。〔来源：AN-f3d8594a1deb；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html/业务/2〕
- [REQ-1a86c568fda4] 接受一条邀请并建立连麦后，自己发出的邀请失效，其他收到的邀请保留；连麦中不能接受其他邀请或发起新邀请。〔来源：AN-38f38c6d49d3；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html/业务/3〕
- [REQ-7ccdccc5eb39] 接受 -> 再次校验条件后建立连麦；拒绝 -> 关闭该邀请；点击提示 -> 打开全部待处理邀请；处理后同步更新数量。〔来源：AN-13a80d109b75；liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html/交互/1〕

## 直播 / 视图-选择分享对象
页面：views/live-room-host/share-recipient.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-81268f52c87e] 接收对象：可选当前主播粉丝群或好友；无权限对象不展示。〔来源：AN-c9e2b4a2a5d1；liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html/字段/3〕
- [REQ-88879db53cf1] 分享内容：使用当前直播场次标题、封面和房间入口。〔来源：AN-e46f1ca32227；liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html/字段/4〕
- [REQ-531c82c6382d] 分享不绕过门票、密码、拉黑、封禁和本场踢出校验；接收人仍按进入规则处理。〔来源：AN-b32beaa1814d；liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html/业务/1〕
- [REQ-24a770ddc379] 选择对象并确认 -> 发送直播房间卡片并提示成功；取消或关闭 -> 不生成消息；发送失败 -> 不生成消息并提示“发送失败”。〔来源：AN-162ea341e9a3；liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html/交互/1〕

## 直播 / 视图-更多功能
页面：views/live-room-host/more-actions.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-99aefa286dad] 美颜参数仅影响主播画面。〔来源：AN-3b3190d945e0；liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html/业务/1〕
- [REQ-c6ad3af08593] 禁用用户读取当前场次禁言列表。〔来源：AN-001c3189c9a7；liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html/业务/2〕
- [REQ-67952e2adc44] 房间密码仅密码房可修改；普通房和门票房入口不可用。〔来源：AN-a5bddb03f2bd；liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html/业务/3〕
- [REQ-a85d012601bf] 清屏只清除主播当前设备显示，不删除服务端消息。〔来源：AN-7d9924fd296a；liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html/业务/4〕
- [REQ-4756a9dfab09] 选择功能 -> 打开对应设置或视图；转发 -> 进入接收对象视图；点击遮罩或关闭 -> 返回直播间。〔来源：AN-5207c694f84e；liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html/交互/1〕

## 直播 / 视图-结束直播确认
页面：views/live-room-host/end-confirm.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host.html；同一实体页面的状态或弹层视图。
- [REQ-fd0092181557] 结束直播会关闭当前场次，使连麦、待处理邀请、门票和本场禁言/踢出状态失效；历史消息、消费、处置和收益记录保留。〔来源：AN-594da460ef2c；liveshow-proto/prototype/annotations/user.js；views/live-room-host/end-confirm.html/业务/1〕
- [REQ-8576b6c9d4ef] 确认 -> 结束场次并进入主播结束页；取消或关闭 -> 返回直播间继续直播；重复确认只处理一次。〔来源：AN-beec1b975959；liveshow-proto/prototype/annotations/user.js；views/live-room-host/end-confirm.html/交互/1〕

## 直播 / 视图-更多功能
页面：views/live-room-host-password/more-actions.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host-password.html；同一实体页面的状态或弹层视图。
- [REQ-5075653b7fff] 密码房不提供连麦入口。〔来源：AN-020b757f327e；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html/业务/1〕
- [REQ-40d93242f27b] 可使用美颜、禁用用户、修改本场密码、访问范围、清屏和转发。〔来源：AN-e510e69784e3；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html/业务/2〕
- [REQ-86af49d72cf5] 主播修改密码后，已通过旧密码验证的在线用户不强制退出；用户退出后再次进入，必须输入新密码。〔来源：AN-c7f4a9e19949；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html/业务/3〕
- [REQ-c5fadd4364b6] 选择访问范围或房间密码 -> 打开对应视图；其他操作沿用主播直播间规则；关闭 -> 返回直播间。〔来源：AN-e0d947eaac21；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html/交互/1〕

## 直播 / 视图-房间密码
页面：views/live-room-host-password/room-password.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host-password.html；同一实体页面的状态或弹层视图。
- [REQ-a4b2f7b4767c] 房间密码：必填，必须为 4-12 个数字，归属当前直播场次。〔来源：AN-dd9480324b93；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/room-password.html/字段/3〕
- [REQ-09b3f94b60db] 主播修改密码后，已通过旧密码验证的在线用户不强制退出；用户退出后再次进入，必须输入新密码。〔来源：AN-ce41242b6be1；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/room-password.html/业务/1〕
- [REQ-20f02ee2cc80] 密码不是 4-12 个数字 -> 不保存、保留输入并提示“密码必须是4-12个数字”；保存成功 -> 更新本场有效密码并关闭视图；取消 -> 保留原密码。〔来源：AN-d1453ca3d78e；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/room-password.html/交互/1〕

## 直播 / 视图-访问范围
页面：views/live-room-host-password/access-scope.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-host-password.html；同一实体页面的状态或弹层视图。
- [REQ-068797d40d88] 在广场展示：默认读取上次确认值；无历史时默认开启。〔来源：AN-2daf263e8005；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html/字段/3〕
- [REQ-cbb4675278fd] 仅粉丝团成员可进入直播间：默认读取上次确认值；无历史时默认关闭。〔来源：AN-554a65223672；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html/字段/4〕
- [REQ-9d00b29113b9] 仅修改当前密码房的访问范围；两个开关相互独立，并将确认值保存为下次默认值。〔来源：AN-cfd8acca57e1；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html/业务/1〕
- [REQ-9ff44d48307f] 成员限制只对后续进房生效；已在房内的非成员不退出，离开后再次进入时拦截。〔来源：AN-c772568a0047；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html/业务/2〕
- [REQ-d1ec9589dc51] 成员仍需通过房间密码校验；主播未创建粉丝团时不可开启。〔来源：AN-d2065d90cec7；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html/业务/3〕
- [REQ-99988c5196e4] 点击确认 -> 设置生效并关闭；关闭或点击遮罩 -> 不保存。〔来源：AN-f7f0e2e83a4c；liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html/交互/1〕

## 直播 / 视图-更多功能
页面：views/live-room-cohost-active/more-actions.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-cohost-active.html；同一实体页面的状态或弹层视图。
- [REQ-c0af0b921588] 连麦中仍可使用美颜、观众管理、清屏和转发。〔来源：AN-b6839a02464e；liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/more-actions.html/业务/1〕
- [REQ-7e68a3a874e3] 连麦期间不得切换为门票房或密码房，也不得再次发起连麦。〔来源：AN-c23ec9e84add；liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/more-actions.html/业务/2〕
- [REQ-f807b7375218] 选择观众管理或转发 -> 打开对应视图且不中断连麦；尝试受限操作 -> 不执行并提示先退出连麦。〔来源：AN-909f8b1621db；liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/more-actions.html/交互/1〕

## 直播 / 视图-退出连麦确认
页面：views/live-room-cohost-active/cohost-exit-confirm.html；实际承载：liveshow-proto/prototype/pages/user/live/live-room-cohost-active.html；同一实体页面的状态或弹层视图。
- [REQ-6516ede9aac0] 主动退出只结束双方连麦关系，不结束任何一方的直播场次；本场贡献、消息和观众数据继续累计。〔来源：AN-8f80bf2ea72a；liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/cohost-exit-confirm.html/业务/1〕
- [REQ-9669e16fa307] 确认 -> 双方退出连麦画面并恢复各自单人直播；取消或关闭 -> 保持连麦；请求失败 -> 保持当前画面并提示“退出失败”。〔来源：AN-3439503b1af1；liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/cohost-exit-confirm.html/交互/1〕

## 首页与发现 / 视图-充值福利-已领取
页面：views/welfare-center/claimed.html；实际承载：liveshow-proto/prototype/pages/user/home/welfare-center.html；同一实体页面的状态或弹层视图。
- [META-d8d2799d9df8] 页面用途：用户查看签到和任务奖励均已领取的状态。〔来源：AN-aebba15773c6；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/场景描述/1〕
- [REQ-9ecc2ec4021b] 签到 / 任务奖励：展示当前账号的签到及任务奖励。〔来源：AN-38f5b4a1807b；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/字段/3〕
- [REQ-9d8161e2d2a2] 领取状态：当前视图中均为已领取，不可重复领取。〔来源：AN-e2cf6102ecf4；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/字段/4〕
- [REQ-79150d93c909] 已领取奖励不可再次领取；领取状态按任务实例保存。〔来源：AN-399172c72af5；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/业务规则/1〕
- [REQ-dd6d795f15ac] 金币奖励领取后进入钱包，并生成金币资产记录。〔来源：AN-a7de732767b6；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/业务规则/2〕
- [REQ-766a354bc835] 任务配置后续变更不重复补发已领取实例。〔来源：AN-f95b85107a13；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/业务规则/3〕
- [REQ-0a3b19c8f769] 已领取项保持禁用，不重复发放资产。〔来源：AN-f9d734bdbe8d；liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html/交互/1〕

## 首页与发现 / 视图-邀请好友-选项
页面：views/invite-friends/share-options.html；实际承载：liveshow-proto/prototype/pages/user/home/invite-friends.html；同一实体页面的状态或弹层视图。
- [META-0df5bf6b3450] 页面用途：用户选择邀请内容的分享方式。〔来源：AN-31e4669dc37c；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/场景描述/1〕
- [REQ-fb3af64eb689] 分享方式：复制链接、发送给好友、保存图片。〔来源：AN-8195854526e5；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/字段/3〕
- [REQ-8331dedb9c7b] 分享内容关联当前账号的邀请信息；分享动作本身不计为成功邀请。〔来源：AN-44bf55c43d24；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/业务规则/1〕
- [REQ-f02ca831c50d] 复制链接 -> 提示“复制成功”。〔来源：AN-fdf6d24dc181；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/交互/1〕
- [REQ-1c675ff25b98] 发送给好友 -> 调起系统分享能力。〔来源：AN-fe847b12abdc；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/交互/2〕
- [REQ-302147eb36d7] 保存图片 -> 给出保存结果反馈。〔来源：AN-f89274bad5a1；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/交互/3〕
- [REQ-c4b268c81d8b] 点击取消或遮罩 -> 关闭分享选项。〔来源：AN-2c9a9bff3118；liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html/交互/4〕

## 消息与社交 / 视图-粉丝团群聊
页面：views/message-center/fan-group.html；实际承载：liveshow-proto/prototype/pages/user/social/message-center.html；同一实体页面的状态或弹层视图。
- [META-b6246e712dcc] 页面用途：用户在消息中心切换至粉丝团，查看自己的粉丝群会话。〔来源：AN-98ddc42d069b；liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html/场景描述/1〕
- [REQ-b749819a362c] 会话：展示粉丝团名称、主播头像、最后一条消息和未读数。〔来源：AN-62d35350de56；liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html/字段/3〕
- [REQ-1aba695437ae] 群成员状态：读取当前有效团籍；团籍与群籍同步。〔来源：AN-773b1b5e3990；liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html/字段/4〕
- [REQ-58f472356186] 粉丝群会话与私信分开；只有有效团籍用户可进入。主动退出、被移出或拉黑主播后立即失去群聊权限。〔来源：AN-f0af1c12db9d；liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html/业务规则/1〕
- [REQ-12b73498ee66] 数据范围：当前账号有效团籍对应的粉丝群会话；按最后消息时间倒序，时间相同时按会话 ID 从大到小排序。〔来源：AN-b406e5700cf2；liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html/业务规则/2〕
- [REQ-b50d6a9e70fe] 进入会话 -> 清除当前会话未读数；团籍失效后立即从消息列表移除，不再保留入口。〔来源：AN-bcef5a7eb4a5；liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html/交互/1〕

## 消息与社交 / 视图-好友
页面：views/user-home/friend.html；实际承载：liveshow-proto/prototype/pages/user/social/user-home.html；同一实体页面的状态或弹层视图。
- [META-ee6e11043e24] 页面用途：用户查看已建立好友关系的账号主页。〔来源：AN-7efcd7e1d307；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/场景描述/1〕
- [REQ-fd6c62574131] 账号资料 / 社交数据：沿用当前用户主页的数据。〔来源：AN-dbe3c67f124c；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/字段/3〕
- [REQ-1a0ff54cb54b] 好友状态：当前双方已建立好友关系，提供删除好友操作。〔来源：AN-bf7f6f9b5957；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/字段/4〕
- [REQ-a83aeaa009e6] 好友关系建立后双方可持续私信，关注关系仍独立管理。〔来源：AN-51936a079a05；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/业务规则/1〕
- [REQ-eebc6e392955] 删除好友只解除好友关系并清空双方聊天记录，不自动取消关注。〔来源：AN-07938dcdd6d9；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/业务规则/2〕
- [REQ-2e9b84451f00] 任一方拉黑时好友关系立即解除，并删除双方私信会话和聊天记录。〔来源：AN-c461b41861d7；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/业务规则/3〕
- [REQ-5e8b58e43195] 私信 -> 进入单聊；删除好友 -> 二次确认后更新主页关系状态；关注或取消关注 -> 仅更新关注关系。〔来源：AN-a0e01a303c26；liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html/交互/1〕

## 消息与社交 / 视图-拉黑
页面：views/user-home/blocked.html；实际承载：liveshow-proto/prototype/pages/user/social/user-home.html；同一实体页面的状态或弹层视图。
- [META-c8a93583216e] 页面用途：用户查看已拉黑账号的主页状态。〔来源：AN-37838f873bb4；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/场景描述/1〕
- [REQ-43d2f18f40e8] 账号资料：沿用当前查看对象的资料。〔来源：AN-d58376074af0；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/字段/3〕
- [REQ-4911c9f85e5d] 拉黑状态：当前账号已拉黑该对象，隐藏关注、好友和私信操作。〔来源：AN-8ea1d546599b；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/字段/4〕
- [REQ-02339b59cf43] 双方不能搜索、关注、申请好友、私信或进入对方主持的直播间。〔来源：AN-855f36a500b4；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/业务规则/1〕
- [REQ-cc9e49e80e24] 已有关注、好友、好友申请和加入对方粉丝团的关系立即解除；双方私信会话和聊天记录清空。〔来源：AN-a60760c108db；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/业务规则/2〕
- [REQ-abc9a04b4c60] 取消拉黑只解除当前拉黑记录，不恢复任何历史关系、会话、聊天记录、粉丝等级或亲密度。〔来源：AN-1a793d7a25f9；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/业务规则/3〕
- [REQ-586155102c1f] 拉黑状态下隐藏关注、好友和私信操作；取消拉黑确认 -> 恢复可操作状态，但关系均显示未建立。〔来源：AN-be06de514960；liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html/交互/1〕

## 消息与社交 / 视图-拉黑确认
页面：views/user-home/block-confirm.html；实际承载：liveshow-proto/prototype/pages/user/social/user-home.html；同一实体页面的状态或弹层视图。
- [META-561428c30240] 页面用途：用户确认是否拉黑当前查看或聊天的账号。〔来源：AN-414978ade25b；liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html/场景描述/1〕
- [REQ-0e212575798c] 确认对象：展示当前要拉黑的账号昵称。〔来源：AN-91779b41be7d；liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html/字段/3〕
- [REQ-3f6a2f729865] 后果说明：提示拉黑后的关系和聊天限制。〔来源：AN-a0991b8266b8；liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html/字段/4〕
- [REQ-8ed00684c40e] 确认拉黑后同步解除双方关注、好友和加入对方粉丝团的关系，使好友申请失效，并删除双方私信会话和聊天记录。〔来源：AN-f8d9a7efe3b0；liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html/业务规则/1〕
- [REQ-38cca962f38b] 确认拉黑 -> 执行并切换为拉黑状态；取消或关闭 -> 不改变现有关系。〔来源：AN-bbe1d69632ea；liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html/交互/1〕

## 消息与社交 / 视图-拉黑确认
页面：views/host-home/block-confirm.html；实际承载：liveshow-proto/prototype/pages/user/social/host-home.html；同一实体页面的状态或弹层视图。
- [META-de21379626af] 页面用途：用户确认是否拉黑当前查看或聊天的账号。〔来源：AN-0217e12fbb65；liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html/场景描述/1〕
- [REQ-021b938a9ceb] 确认对象：展示当前要拉黑的账号昵称。〔来源：AN-7539ccb9698b；liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html/字段/3〕
- [REQ-24696928cf80] 后果说明：提示拉黑后的关系和聊天限制。〔来源：AN-a424e976e632；liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html/字段/4〕
- [REQ-6690e4018de2] 主播与用户共用账号关系；拉黑后果与用户主页一致。〔来源：AN-232738544bf1；liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html/业务规则/1〕
- [REQ-255f93b3ae45] 确认拉黑 -> 执行并切换为拉黑状态；取消或关闭 -> 不改变现有关系。〔来源：AN-034a1167982b；liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html/交互/1〕

## 消息与社交 / 视图-拉黑确认
页面：views/chat-settings/block-confirm.html；实际承载：liveshow-proto/prototype/pages/user/social/chat-settings.html；同一实体页面的状态或弹层视图。
- [META-baf8a12d37d3] 页面用途：用户确认是否拉黑当前查看或聊天的账号。〔来源：AN-c9b78ddd18c4；liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html/场景描述/1〕
- [REQ-d9b5c1056043] 确认对象：展示当前要拉黑的账号昵称。〔来源：AN-28e821b0617f；liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html/字段/3〕
- [REQ-d2a042417034] 后果说明：提示拉黑后的关系和聊天限制。〔来源：AN-3d71bbb3e6b5；liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html/字段/4〕
- [REQ-bf0e1564d12b] 确认拉黑后删除双方私信会话并清空聊天记录，同时按账号拉黑规则解除相关关系。〔来源：AN-9fe7a3c9812f；liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html/业务规则/1〕
- [REQ-4b0b89a9c815] 确认拉黑 -> 执行并退出当前会话；取消或关闭 -> 不改变现有关系。〔来源：AN-ebba56cbadf7；liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html/交互/1〕

## 主播管理 / 视图-选类型
页面：views/start-live-settings/category.html；实际承载：liveshow-proto/prototype/pages/user/host/start-live-settings.html；同一实体页面的状态或弹层视图。
- [META-08dc91562652] 页面用途：主播为本场直播选择直播分类。〔来源：AN-3b2d791008b0；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html/场景描述/1〕
- [REQ-70169de03bcb] 直播分类：必选，名称、排序和上下架状态由平台配置。〔来源：AN-a4ae48abb3be；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html/字段/3〕
- [REQ-1764da61e3f5] 分类归属本次直播场次；已下架分类不可新选，历史场次仍保留原分类快照。〔来源：AN-e7f6494bdcf4；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html/业务规则/1〕
- [REQ-138a520f76a0] 数据范围：平台当前已启用的直播分类；按平台配置顺序展示。〔来源：AN-03adb35d4e0f；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html/业务规则/2〕
- [REQ-2c08ab173cfb] 选择分类 -> 回填并关闭视图；关闭未选择 -> 保留原分类。〔来源：AN-05f4d52f37c3；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html/交互/1〕

## 主播管理 / 视图-房型（普通）
页面：views/start-live-settings/room-normal.html；实际承载：liveshow-proto/prototype/pages/user/host/start-live-settings.html；同一实体页面的状态或弹层视图。
- [META-9079f798dce5] 页面用途：主播在房型设置中选择普通房。〔来源：AN-bf8f1deaba83；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html/场景描述/1〕
- [REQ-573171c66dc7] 房型：当前选中普通房，无门票或密码必填项。〔来源：AN-8334835c771e；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html/字段/3〕
- [REQ-64e92abb7f2e] 账号可用、与主播无拉黑关系且未被本场踢出的用户可免费进入。〔来源：AN-8fe74c9ea504；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html/业务规则/1〕
- [REQ-bab7a8f221e5] 普通房支持固定两位主播连麦，不支持观众上麦。〔来源：AN-e176ad4bbed5；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html/业务规则/2〕
- [REQ-681920ccd67d] 房型归属本次直播场次，历史场次不随修改变化。〔来源：AN-11239b3a35b9；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html/业务规则/3〕
- [REQ-63b73dc008c4] 选择普通房 -> 清除门票和密码必填校验；确认 -> 回填房型并关闭视图。〔来源：AN-b813dcf4339d；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html/交互/1〕

## 主播管理 / 视图-房型（门票房）
页面：views/start-live-settings/room-ticket.html；实际承载：liveshow-proto/prototype/pages/user/host/start-live-settings.html；同一实体页面的状态或弹层视图。
- [META-d81025edacdc] 页面用途：主播选择门票房并设置本场门票价格。〔来源：AN-ca4a166bcc9b；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html/场景描述/1〕
- [REQ-4ec3abe6a8f5] 门票价格：必选；后台已启用的价格档位全部平铺展示，按后台排序，只能单选。〔来源：AN-1dad51b0ec1d；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html/字段/3〕
- [REQ-65340745223f] 门票房受平台功能开关控制，关闭时不可选择。〔来源：AN-54ace9520167；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html/业务规则/1〕
- [REQ-ca2877e2e19c] 选中的价格保存到当前场次；后台后续调整档位不影响已创建场次。同场重复进入不收费；场次结束或被踢出后失效且不退款。〔来源：AN-49400c9b1d6f；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html/业务规则/2〕
- [REQ-e20d55c5351e] 门票房不支持连麦。〔来源：AN-c6f1bed54938；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html/业务规则/3〕
- [REQ-11d5dc6af0d0] 选择门票房 -> 平铺展示后台已启用的价格档位；点击档位 -> 切换单选；未选择或档位已停用 -> 不保存并提示“请选择有效的门票价格”；选择有效档位 -> 回填门票房和价格。〔来源：AN-b9134dc25574；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html/交互/1〕

## 主播管理 / 视图-房型（密码房）
页面：views/start-live-settings/room-password.html；实际承载：liveshow-proto/prototype/pages/user/host/start-live-settings.html；同一实体页面的状态或弹层视图。
- [META-87d4a4c5453f] 页面用途：主播选择密码房并配置密码、广场展示和粉丝团成员限制。〔来源：AN-7be602ab165e；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/场景描述/1〕
- [REQ-1722b0f28c3d] 房间密码：必填，必须为 4-12 个数字。〔来源：AN-6d2eca14bf61；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/字段/3〕
- [REQ-c543f6e52b46] 广场展示：开启后可在直播广场展示；关闭后仅通过分享入口访问。无历史时默认开启。〔来源：AN-263151214c12；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/字段/4〕
- [REQ-e84116c2b0a5] 仅粉丝团成员可进入直播间：开启后仅当前有效粉丝团成员可进入；无历史时默认关闭。〔来源：AN-d5322a6404e7；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/字段/5〕
- [REQ-fdaf1d80f713] 密码房受平台功能开关控制，关闭时不可选择。〔来源：AN-04256f3edd6b；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/业务规则/1〕
- [REQ-5c1e9ea40f09] 密码归属当前场次；密码房不支持连麦。〔来源：AN-412b4b507548；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/业务规则/2〕
- [REQ-50d6f565540b] “在广场展示”仅控制卡片展示；成员限制开启时，非成员可看到卡片但点击后被拦截，成员输入正确密码后方可进入。〔来源：AN-86411d74d2d9；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/业务规则/3〕
- [REQ-8a88b16f144e] 账号封禁、拉黑和本场踢出优先于成员及密码校验；巡房人员和运营账号可绕过成员限制。〔来源：AN-a27570c197b4；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/业务规则/4〕
- [REQ-1a2e6b2db8a7] 两个开关读取上次确认值；首次使用默认广场展示开启、成员限制关闭。主播未创建粉丝团时不可开启成员限制。〔来源：AN-47e1f1bb5d19；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/业务规则/5〕
- [REQ-1edf72f6bdd0] 密码不是 4-12 个数字 -> 不保存、保留输入并提示“密码必须是4-12个数字”。〔来源：AN-b1528f09c237；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/交互/1〕
- [REQ-b7597dce37d8] 切换访问开关后点击确认 -> 保存本场配置和下次默认值并回填；关闭抽屉或点击遮罩 -> 不保存修改。〔来源：AN-f9ba8a7f61d4；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html/交互/2〕

## 主播管理 / 视图-美颜设置
页面：views/start-live-settings/beauty.html；实际承载：liveshow-proto/prototype/pages/user/host/start-live-settings.html；同一实体页面的状态或弹层视图。
- [META-d4183b2bb9c4] 页面用途：主播开播前调整美颜、美型项目及强度。〔来源：AN-1af37de332a1；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html/场景描述/1〕
- [REQ-c6e804b0e922] 模式：可切换美颜和美型，两组参数独立保存。〔来源：AN-eabc83fda711；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html/字段/3〕
- [REQ-f37aeaefa70d] 项目：每个模式单选当前调整项。〔来源：AN-5f24a43cd016；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html/字段/4〕
- [REQ-797aed10c781] 强度：取值 0-100，默认 50。〔来源：AN-e7b651393b26；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html/字段/5〕
- [REQ-58a921917bfa] 美颜参数只影响主播视频画面，不改变上传封面和历史直播记录。〔来源：AN-dc093422eaaa；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html/业务规则/1〕
- [REQ-947f26075775] 选择项目并拖动 -> 实时预览；恢复默认 -> 清除选中项并将全部参数重置为 50；完成 -> 保留当前参数并关闭。〔来源：AN-c1fe10917d7a；liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html/交互/1〕

## 主播管理 / 视图-月数据
页面：views/live-data/month.html；实际承载：liveshow-proto/prototype/pages/user/host/live-data.html；同一实体页面的状态或弹层视图。
- [META-b67aa1952425] 页面用途：主播查看所选月份的直播数据。〔来源：AN-baa2a7e72c11；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/场景描述/1〕
- [REQ-1694230f1d67] 月份：默认当前自然月，可切换有数据的历史月份；无数据月份全部指标显示 0。〔来源：AN-5734216be9ac；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/字段/3〕
- [REQ-00d9339c8a24] 收益：汇总所选月份主播收益：普通/定制礼物及门票按成功支付金币；幸运礼物按送出价值 × 后台比例，默认 1%；虚拟金币、失败或撤销消费不计入。〔来源：AN-4ad8ee0405e5；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/字段/4〕
- [REQ-017c27f81759] 有效天：按主播所属自然日汇总有效直播时长；单日累计 >= 3 小时计 1 天，每日最多 1 天。〔来源：AN-38e62ea9df30；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/字段/5〕
- [REQ-b6983d1d63d6] 开播时长：所选月份各场次有效直播时长之和；进行中场次使用实时值。〔来源：AN-88956e1879c0；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/字段/6〕
- [REQ-1efa1ebf4f78] 观众人次：展示所选月份的观看统计值。〔来源：AN-d5876b30fd41；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/字段/7〕
- [REQ-c1b745ad45f1] 新增粉丝/送礼人数：展示所选月份的统计值。〔来源：AN-b516e9412ef4；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/字段/8〕
- [REQ-6fa3d081c1f0] 仅统计已形成有效记录的直播场次；场次结束后数据保留，后续退款或冲正按平台财务口径更新。〔来源：AN-bb55052160e7；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/业务规则/1〕
- [REQ-690c750b81b8] 数据范围：当前主播所选自然月的有效直播记录；〔来源：AN-b6f8607b601f；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/业务规则/2〕
- [REQ-bcaeb38298cb] 切换月份 -> 同步更新全部指标和明细入口；无数据月份展示 0，不沿用上一月份数据。〔来源：AN-813dd6e2bcc0；liveshow-proto/prototype/annotations/user.js；views/live-data/month.html/交互/1〕

## 需求待确认（不作为确定业务规则）
- [PENDING-reward-prop-conflict] 任务道具奖励冲突：任务配置及福利页说明仅奖励金币，但已领取视图仍写道具入背包；本期是否允许任务奖励道具？ 选项：A. 本期只支持金币并修正领取视图；B. 增加道具奖励并补充后台配置规则。影响端：用户App、管理后台。依据：AN-a7de732767b6。
- [PENDING-virtual-board] 虚拟金币榜单范围：系统概要允许虚拟赠礼计入榜单展示，具体适用于哪些榜单？ 选项：A. 仅本场氛围榜；B. 本场榜及平台双榜；C. 由后台逐榜配置。影响端：用户App、公会App、管理后台。依据：AN-58bdfd055651、AN-9076ce003939、AN-ba0acac09cff、AN-bbb10e3b591b、AN-7861fb19ad1a。
- [PENDING-search-sort] 搜索结果优先级：昵称、用户 ID、房间号同时命中时，搜索结果按什么优先级排序？ 选项：A. 精确匹配优先再按账号 ID；B. 直播中优先再按匹配程度；C. 按后台搜索权重。影响端：用户App。依据：AN-8adebba29dc6。
- [PENDING-follower-sort] 粉丝列表排序：粉丝列表按哪个字段排序及处理相同值？ 选项：A. 关注时间倒序后按 ID；B. 昵称升序后按 ID；C. 财富等级倒序后按 ID。影响端：用户App。依据：AN-0a26d56ce987、AN-8adb4ebc8fae。
- [PENDING-friend-sort] 好友列表排序：好友列表采用什么排序？ 选项：A. 成为好友时间倒序后按 ID；B. 昵称升序后按 ID；C. 最近互动时间倒序后按 ID。影响端：用户App。依据：AN-67388dbeec3b。
- [PENDING-profile-clubs-sort] 他人主页的粉丝团顺序：他人主页展示多个粉丝团时如何排序？ 选项：A. 最近加入优先；B. 贡献最高优先；C. 粉丝等级最高优先。影响端：用户App。依据：AN-d6f642464ad5。
- [PENDING-moderator-sort] 房管列表排序：房管列表以什么顺序展示？ 选项：A. 授权时间倒序；B. 授权时间正序；C. 账号 ID 升序。影响端：用户App。依据：AN-6b663b6d1503。
- [PENDING-guild-notice-sort] 公会通知顺序：主播端公会通知列表如何排序？ 选项：A. 生成时间倒序；B. 未读优先再按生成时间倒序。影响端：用户App、公会App。依据：AN-205fe7899e2d。
- [PENDING-fan-tie] 成员列表同值排序：粉丝团管理的贡献或加入时间相同时，使用什么次序？ 选项：A. 用户 ID 升序；B. 另一贡献字段倒序后按 ID。影响端：用户App。依据：AN-ef6b1570b239。
- [PENDING-live-detail-sort] 直播数据明细排序：直播数据的日和月明细按什么顺序排列？ 选项：A. 日期倒序；B. 日期正序。影响端：用户App。依据：AN-4a3fca14d996、AN-b6f8607b601f。
- [PENDING-country-sort] 区号列表顺序：国家和地区区号列表按什么规则排序？ 选项：A. 当前语言名称升序；B. 英文名称升序；C. 国际区号升序。影响端：用户App。依据：AN-5f1c2d451728。
- [PENDING-operation-login-format] 运营账号登录格式：运营账号必须是可接收验证码的邮箱，还是允许普通登录名？ 选项：A. 必须为有效邮箱地址；B. 允许普通登录名并使用密码登录。影响端：用户App、公会App、管理后台。依据：AN-ff08deec1174、AN-053fd74e2f42。
- [PENDING-intimacy] 亲密度计算：亲密度由哪些行为累计，采用什么单位？ 选项：A. 有效送礼金币累计；B. 按行为配置独立积分。影响端：用户App、管理后台。依据：AN-88f3346c11fe、AN-73b3892baa6f。
- [PENDING-intimacy-decay] 亲密度衰减：除退团清零外，是否按不活跃时间衰减亲密度？ 选项：A. 不衰减；B. 按配置的不活跃周期衰减。影响端：用户App、管理后台。依据：AN-88f3346c11fe。
- [PENDING-rank-unlisted] 未上榜提示：不在粉丝团贡献榜前 99 名时，本人排名显示什么？ 选项：A. 显示真实名次；B. 显示未上榜。影响端：用户App。依据：AN-13788c4bdaec。
- [PENDING-rank-missing] 贡献数据缺失：贡献数据无法取得时如何区分零贡献和加载失败？ 选项：A. 保留上次数据并提示失败；B. 显示独立缺失态并允许重试。影响端：用户App。依据：AN-13788c4bdaec。
- [PENDING-checkin-repair] 补签：是否支持对漏签日期进行补签？ 选项：A. 不支持补签；B. 支持按配置补签。影响端：用户App、管理后台。依据：AN-5ea05985e150。
- [PENDING-business-zone] 业务日和周界限：签到、任务、榜单、直播有效天和报表分别采用什么业务时区；任务周是否统一从周一开始？ 选项：A. 全端统一指定业务时区且周一开始；B. 按业务分别指定时区和周起始日。影响端：用户App、公会App、管理后台。依据：AN-6162c5b34166、AN-2d643ddb84e1。
- [PENDING-reward-disabled] 任务关闭后的待领奖励：任务到期或停用时，当天已达成且未超过领取截止时间的奖励是否还能领取？ 选项：A. 仍可在原截止时间前领取；B. 任务到期或停用立即失效。影响端：用户App、管理后台。依据：AN-6162c5b34166。
- [PENDING-effective-duration] 有效时长排除条件：断流、后台挂起和暂停期间哪些时长计入每日 3 小时门槛？ 选项：A. 仅连续成功推流时长；B. 会话持续时长扣除配置的无效区间。影响端：用户App、公会App、管理后台。依据：AN-2d643ddb84e1。
- [PENDING-cross-day-live] 跨日直播时长分配：跨自然日的一场直播如何分配每天的有效时长及收益？ 选项：A. 按事件发生时间切分到各日；B. 全部归入开播日。影响端：用户App、公会App、管理后台。依据：AN-2d643ddb84e1。
- [PENDING-metric-latency] 指标刷新时效：直播、收益和等级变动后，各端指标最迟何时应更新？ 选项：A. 实时更新并指定秒级上限；B. 按固定汇总周期更新。影响端：用户App、公会App、管理后台。依据：AN-2d643ddb84e1、AN-4c265a228f16。
- [PENDING-first-recharge] 首充资格：首充资格按哪种充值成功记录判定？ 选项：A. 账号首次任意渠道成功充值；B. 各活动分别以首次购买判定。影响端：用户App、管理后台。依据：AN-b13d526e82bf。
- [PENDING-first-recharge-hide] 首充购买后的展示：首充套餐成功购买后，是否继续展示？ 选项：A. 隐藏该套餐；B. 保留套餐并显示不可购买。影响端：用户App。依据：AN-b13d526e82bf。
- [PENDING-recharge-expiry] 支付中套餐过期：支付已经发起但尚未完成时套餐过期，订单能否按快照继续完成？ 选项：A. 在原订单有效期内继续支付；B. 过期即取消未支付订单。影响端：用户App、管理后台。依据：AN-b13d526e82bf。
- [PENDING-recharge-empty] 无可购套餐：没有可购充值套餐时页面如何展示并引导？ 选项：A. 空态且不可发起支付；B. 展示下架套餐但不可购买。影响端：用户App。依据：AN-b13d526e82bf。
- [PENDING-level-gift-scope] 等级贡献计入类型：财富等级和粉丝等级分别计入哪些礼物类型，幸运礼物按何种价值计入？ 选项：A. 全部真实礼物按送出价值；B. 全部真实礼物按扣除返奖后的净消耗；C. 由等级类型分别配置。影响端：用户App、管理后台。依据：AN-3839cfde3299。
- [PENDING-club-level-attribution] 粉丝团累计收礼归属：粉丝团等级累计收礼是否只计有效团员在入团期间的赠礼？ 选项：A. 只计有效团员在团期间赠礼；B. 计入该主播的全部有效收礼。影响端：用户App、管理后台。依据：AN-3839cfde3299。
- [PENDING-coin-precision] 金币和收益精度：幸运礼物收益出现不足 1 金币的小数时如何存储、累计和展示？ 选项：A. 每笔截断为整数；B. 保留小数累计后统一展示；C. 按明确精度四舍五入。影响端：用户App、公会App、管理后台。依据：AN-3839cfde3299。
- [PENDING-level-reversal] 等级冲正与降级：充值退款、消费冲正或撤销分别是否回扣成长值，以及是否降级？ 选项：A. 按被撤销的有效赠礼回扣并重算等级；B. 回扣成长值但保留已达等级。影响端：用户App、管理后台。依据：AN-4c265a228f16。
- [PENDING-level-history] 历史等级快照：调整等级阈值后历史记录展示原等级还是重算等级？ 选项：A. 保留事件发生时等级；B. 显示当前重算等级。影响端：用户App、公会App、管理后台。依据：AN-10e4cbde5c33。
- [PENDING-badge-refresh] 等级勋章图刷新：后台修改等级勋章图后，客户端何时刷新？ 选项：A. 下一次加载资料时更新；B. 重新登录后更新；C. 按明确缓存有效期更新。影响端：用户App、管理后台。依据：AN-10e4cbde5c33。
- [PENDING-badge-fallback] 等级勋章图片缺失：等级勋章图无法加载时客户端显示什么？ 选项：A. 显示默认等级图；B. 只显示等级文字。影响端：用户App、管理后台。依据：AN-d8d7a1c44fc2。
- [PENDING-share-detail] 分成记录详情：主播点击分成日期记录后是否提供可操作的详情页，详情包含哪些内容？ 选项：A. 仅保留当前只读列表；B. 新增该笔分成详情页。影响端：用户App。依据：AN-7fdf6bcdd026。
- [PENDING-group-report] 粉丝群举报对象：群管理的举报针对群、群主还是具体消息？ 选项：A. 举报群主账号；B. 举报指定消息及其发送者；C. 单独举报粉丝群。影响端：用户App、管理后台。依据：AN-3bc6aef15073。
