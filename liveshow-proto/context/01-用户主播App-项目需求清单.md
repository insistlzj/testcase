# 用户App项目需求清单

> 当前系统概要优先，原型页面及结构化批注补充。带“需求待确认”标记的原文仅保留问题证据，不构成确定业务预期。
> 同页视图归入所属页面；测试用例的功能模块取原型页面目录结构。

## 首页与福利 / 首页 / live-plaza.html
页面入口：liveshow-proto/prototype/pages/user/home/live-plaza.html

- **REQ-610c705cfcda** 【正式规则】用户浏览直播列表，筛选内容并进入直播间。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；场景描述；SRC-USER-1
- **REQ-de3807b165f5** 【正式规则】直播卡片：展示本场封面、主题、主播、分类和本场直播间访问次数。访问次数 = 本场成功进入直播间的访问事件总数；同一用户重复进入重复累计，列表曝光、密码校验失败、购票失败等未进入行为不计入。场次开始时从 0 累计，结束后固化。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；字段；SRC-USER-4
- **REQ-d314df3cff19** 【正式规则】房型：普通房无准入标识；门票房展示金币价格；密码房展示密码准入提示。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；字段；SRC-USER-5
- **REQ-1b58b1ed94b0** 【正式规则】关注主播：仅展示当前用户已关注且正在直播的主播。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；字段；SRC-USER-6
- **REQ-50e085ca969a** 【正式规则】Banner：内容、排序、跳转和有效期由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；字段；SRC-USER-7
- **REQ-51536ff56a6e** 【正式规则】通知说明弹窗：标题“开启通知”；正文“开启后，你可以及时收到关注主播开播、互动消息及平台公告。”；按钮“暂不开启、开启通知”。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；字段；SRC-USER-8
- **REQ-e01e5153fdbe** 【正式规则】系统授权弹窗：模拟手机系统通知授权，按钮“不允许、允许”。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；字段；SRC-USER-9
- **REQ-35c36993dcc1** 【正式规则】1. 游客可查看主播榜、贡献榜和不同分类下的主播，并可进入福利页、邀请好友页。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-10
- **REQ-97cb3650fe69** 【正式规则】2. 游客点击直播间、搜索、消息、我的或其他账号动作时不执行原操作，直接跳转登录页。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-11
- **REQ-e84308a56604** 【正式规则】3. 热门排序权重、直播分类和运营 Banner 由后台配置。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-12
- **REQ-fb7a66574dee** 【正式规则】4. 关注区仅展示已关注且正在直播的主播；无符合数据时隐藏。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-13
- **REQ-8c792a13ce54** 【正式规则】5. 门票房购票后本场可重复进入；直播结束或被主播踢出后失效，购票写入消费明细。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-14
- **REQ-597d95281461** 【正式规则】6. “在广场展示”只控制密码房是否出现在首页热门区域，不参与准入校验；粉丝团成员限制按独立规则执行。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-15
- **REQ-c60b82c70f33** 【正式规则】7. 密码房校验正确后进入；校验失败时保留当前页面并提示重试。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-16
- **REQ-e3d637f9e33c** 【正式规则】8. 登录成功后首次进入首页显示通知授权说明；选择开启或暂不开启后均不在后续登录中重复展示。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；业务规则；SRC-USER-17
- **REQ-cc8c1531ecca** 【正式规则】1. 点击搜索 -> 进入搜索页。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；交互；SRC-USER-18
- **REQ-bdb476925878** 【正式规则】2. 切换热门或新人、选择分类 -> 刷新当前直播列表。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；交互；SRC-USER-19
- **REQ-4512d18dce05** 【原型说明】3. 进房演示固定为：Ayu 显示拉黑或踢出拦截，Intan 显示门票拦截；每次点击 Lala 时，密码房拦截和非粉丝团成员拦截交替显示；其他直播卡片直接进入。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；交互；SRC-USER-20
- **REQ-14b78bcef384** 【正式规则】4. 通知说明点击开启通知 -> 模拟系统通知授权弹窗；点击暂不开启 -> 仅关闭说明，不请求系统权限。
  来源：liveshow-proto/prototype/annotations/user.js；live-plaza.html；交互；SRC-USER-21
## 首页与福利 / 主播榜 / host-ranking.html
页面入口：liveshow-proto/prototype/pages/user/home/host-ranking.html

- **REQ-63b504130be0** 【正式规则】用户查看平台主播收礼排名。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；场景描述；SRC-USER-22
- **REQ-33cd853bde92** 【正式规则】周期：按平台业务时区计算：当日从当天 00:00 开始，本周从周一 00:00 开始，本月从每月 1 日 00:00 开始。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；字段；SRC-USER-25
- **REQ-5622d43e4988** 【正式规则】排名：依次按收礼值、主播等级、财富等级从高到低排序，仍相同时按主播 ID 数字部分从小到大排序；不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；字段；SRC-USER-26
- **REQ-ff8eb7db5623** 【正式规则】榜单数量：当日、本周、本月均最多显示前 30 名；第 30 名与第 31 名收礼值相同时，继续按排名规则确定顺序。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；字段；SRC-USER-27
- **REQ-585b985a1698** 【正式规则】主播：展示头像、昵称、主播等级和当前开播状态。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；字段；SRC-USER-28
- **REQ-2dda033a20f8** 【正式规则】收礼值：收礼值 = 周期内主播成功收到的非虚拟金币礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减收礼值；虚拟金币赠礼不计入主播榜。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；字段；SRC-USER-29
- **REQ-032d02ff7202** 【正式规则】1. 主播等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；业务规则；SRC-USER-30
- **REQ-fc5e1fb4082c** 【正式规则】2. 运营账号不进入任何榜单或排行；主播榜按收礼主播汇总，统计前过滤虚拟金币赠礼，不计入收礼值和排名。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；业务规则；SRC-USER-31
- **REQ-d8f336113fe5** 【正式规则】3. 账号注销后保留历史数值，名称显示“账号已注销”，且不能进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；业务规则；SRC-USER-32
- **REQ-7a1502e92272** 【正式规则】4. 数据范围：所选当日、本周或本月的主播收礼汇总，按字段表中的排名规则最多展示前 30 名。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；业务规则；SRC-USER-33
- **REQ-f03e5c1e9d4b** 【正式规则】1. 切换周期 -> 同步更新前三名、列表排名和收礼值。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；交互；SRC-USER-34
- **REQ-d59abe359d67** 【正式规则】2. 已登录用户点击主播 -> 进入该主播主页；游客点击 -> 直接跳转登录页。
  来源：liveshow-proto/prototype/annotations/user.js；host-ranking.html；交互；SRC-USER-35
## 首页与福利 / 贡献榜（平台） / contribution-ranking.html
页面入口：liveshow-proto/prototype/pages/user/home/contribution-ranking.html

- **REQ-b590092f3dcb** 【正式规则】用户查看平台用户送礼贡献排名。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；场景描述；SRC-USER-36
- **REQ-80976be5ecd9** 【正式规则】周期：按平台业务时区计算：当日从当天 00:00 开始，本周从周一 00:00 开始，本月从每月 1 日 00:00 开始。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；字段；SRC-USER-39
- **REQ-ffd3db36d66c** 【正式规则】排名：依次按贡献值、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；字段；SRC-USER-40
- **REQ-38ca02441e58** 【正式规则】榜单数量：当日、本周、本月均显示前 30 名；第 30 名与第 31 名贡献值相同时，继续按排名规则确定顺序。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；字段；SRC-USER-41
- **REQ-22a07b71d6ae** 【正式规则】统计对象：仅统计非运营账号；运营账号不进入任何榜单或排行。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；字段；SRC-USER-42
- **REQ-c29508343d1a** 【正式规则】用户：展示头像、昵称和财富等级。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；字段；SRC-USER-43
- **REQ-66e0fe389af9** 【正式规则】贡献值：贡献值 = 周期内非运营账号成功送出的各礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减贡献值；运营账号及其虚拟金币赠礼不计入贡献榜。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；字段；SRC-USER-44
- **REQ-502104d46b3e** 【正式规则】1. 财富等级最低为 1 级；排名按完整排序结果连续编号。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；业务规则；SRC-USER-45
- **REQ-62b9f0287e85** 【正式规则】2. 贡献榜按送礼用户汇总；运营账号不进入任何榜单或排行，统计前过滤运营账号及其贡献数据。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；业务规则；SRC-USER-46
- **REQ-436465a0d905** 【正式规则】3. 账号注销后保留历史数值，名称显示“账号已注销”，且不能进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；业务规则；SRC-USER-47
- **REQ-2c7116060751** 【正式规则】4. 数据范围：所选当日、本周或本月的用户送礼汇总，按字段表中的排名规则展示前 30 名。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；业务规则；SRC-USER-48
- **REQ-b504ff31752f** 【正式规则】1. 切换周期 -> 同步更新前三名、列表排名和贡献值。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；交互；SRC-USER-49
- **REQ-eeb943a25f48** 【正式规则】2. 已登录用户点击用户 -> 进入该用户主页；游客点击 -> 直接跳转登录页。
  来源：liveshow-proto/prototype/annotations/user.js；contribution-ranking.html；交互；SRC-USER-50
## 首页与福利 / 搜索 / search.html
页面入口：liveshow-proto/prototype/pages/user/home/search.html

- **REQ-a35ad3f561e3** 【正式规则】用户按昵称、用户 ID 或房间号查找账号。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；场景描述；SRC-USER-51
- **REQ-8b21f9d739b7** 【正式规则】搜索关键词：必填，去除首尾空格后不能为空；支持房间号、用户 ID 或用户昵称。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；字段；SRC-USER-54
- **REQ-b104da1ab1ba** 【正式规则】搜索历史：展示当前用户最近使用的搜索词，按最近使用倒序，去重后最多保留 10 条；不展示热门搜索词。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；字段；SRC-USER-55
- **REQ-dc1e8196cb18** 【正式规则】1. 搜索历史仅保存在当前用户侧，不随账号跨设备同步。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；业务规则；SRC-USER-56
- **REQ-11b764425a5b** 【正式规则】2. 提交关键词后写入搜索历史；相同关键词移到首位，不重复新增；超过 10 条时删除最早一条。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；业务规则；SRC-USER-57
- **REQ-b1de0a2b3ab1** 【正式规则】3. 数据范围：仅当前用户的搜索历史；按最近使用时间倒序、去重后最多 10 条。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；业务规则；SRC-USER-58
- **REQ-7a70be127373** 【正式规则】1. 进入页面 -> 自动聚焦搜索框。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；交互；SRC-USER-59
- **REQ-a3bc08b67703** 【正式规则】2. 关键词为空 -> 提示输入，不进入搜索结果页。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；交互；SRC-USER-60
- **REQ-a7a3ffdc822a** 【正式规则】3. 提交关键词或点击历史词 -> 写入最近使用记录并进入搜索结果页。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；交互；SRC-USER-61
- **REQ-87476f9cd323** 【正式规则】4. 点击历史词右侧删除 -> 仅删除该条；点击清空全部 -> 删除全部搜索历史并显示空状态。
  来源：liveshow-proto/prototype/annotations/user.js；search.html；交互；SRC-USER-62
## 首页与福利 / 搜索结果 / search-results.html
页面入口：liveshow-proto/prototype/pages/user/home/search-results.html

- **REQ-c977e00cbaac** 【正式规则】用户查看当前关键词匹配的账号。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；场景描述；SRC-USER-63
- **REQ-6b6017e3470c** 【正式规则】搜索关键词：回填来源页关键词；去除首尾空格后不能为空。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；字段；SRC-USER-66
- **REQ-df46e6a0e6d5** 【正式规则】用户头像、昵称：展示匹配账号的当前资料。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；字段；SRC-USER-67
- **REQ-809cf95d3b51** 【正式规则】房间号：账号有主播身份时显示房间号，非主播不显示。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；字段；SRC-USER-68
- **REQ-dda806a926fe** 【正式规则】1. 无匹配结果时保留搜索框并展示空状态。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；业务规则；SRC-USER-69
- **REQ-16d586a8ca94** 【正式规则】2. 按账号搜索，每个匹配账号展示一条结果；有主播身份且正在直播时显示「直播中」标记，未开播主播及非主播账号均不显示。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；业务规则；SRC-USER-70
- **REQ-3d16e43a8a3c** 【正式规则】3. 排序：精确匹配、前缀匹配、模糊匹配依次优先；同级按用户 ID 升序。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；业务规则；SRC-USER-71
- **REQ-438043ed7c5f** 【正式规则】1. 点击直播中的结果 -> 进入直播间。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；交互；SRC-USER-72
- **REQ-67390faddcce** 【正式规则】2. 点击未开播账号 -> 有主播身份进入主播主页，非主播进入用户主页。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；交互；SRC-USER-73
- **REQ-42995c9e0385** 【正式规则】3. 修改关键词并提交 -> 刷新搜索结果。
  来源：liveshow-proto/prototype/annotations/user.js；search-results.html；交互；SRC-USER-74
## 首页与福利 / 充值福利 / welfare-center.html
页面入口：liveshow-proto/prototype/pages/user/home/welfare-center.html

- **REQ-643327cded7b** 【正式规则】用户进入邀请好友、充值福利，并在每日签到和任务中心手动领取金币奖励。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；场景描述；SRC-USER-75
- **REQ-aefc10e7ae97** 【正式规则】邀请好友：展示当前活动配置的邀请奖励入口及奖励提示；点击进入邀请好友页。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-78
- **REQ-dbc47dfa9ef4** 【正式规则】充值福利：展示当前活动配置的充值赠送金币提示；点击进入充值页。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-79
- **REQ-9a7e95a36a10** 【正式规则】连续签到天数：展示当前账号连续手动签到成功的天数；仅登录不增加该数值。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-80
- **REQ-4139f026c8d8** 【正式规则】签到进度：按连续签到周期展示已签到日、今日和后续签到日；每个日期同时展示对应金币奖励。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-81
- **REQ-6fdece9d90ed** 【正式规则】签到操作状态：今日未签到时显示「签到」；领取成功后显示「已签到」并禁用。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-82
- **REQ-c5a452d7a59c** 【正式规则】任务项：展示后台配置的任务名称、当前进度、目标值、金币奖励和领取状态。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-83
- **REQ-5694b9ddb522** 【正式规则】任务操作状态：未完成显示去完成或不可领取提示；完成后显示领取；领取成功后显示已领取。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；字段；SRC-USER-84
- **REQ-90c67d2e3663** 【正式规则】1. 点击卡片进入「邀请好友」P009。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；邀请好友；SRC-USER-85
- **REQ-859c5438ae92** 【正式规则】2. 卡片「+10」数值取后台配置的每成功邀请 1 位好友可获得的金币奖励。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；邀请好友；SRC-USER-86
- **REQ-24be7f6754fb** 【正式规则】1. 点击卡片进入充值页。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；充值福利；SRC-USER-87
- **REQ-e37bfb986468** 【正式规则】2. 卡片「+10金币」取套餐中赠送金币最多的数值。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；充值福利；SRC-USER-88
- **REQ-5604066aa3bf** 【正式规则】1. 每日签到与任务中心统一由管理后台「运营配置 → 任务配置」维护；配置四语名称、启停状态、生效时间、用户动作、统计维度、统计周期及条件对应的金币奖励。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；配置来源；SRC-USER-89
- **REQ-475a54eafba4** 【正式规则】2. 仅启用且处于生效时间内的任务产生新进度；停用不回收已领取奖励。奖励仅为金币，不自动发放。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；配置来源；SRC-USER-90
- **REQ-921f6557c9c6** 【正式规则】3. 同一任务至少配置一个条件；条件为互不重复的正整数，每个条件对应正整数金币奖励。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；配置来源；SRC-USER-91
- **REQ-765a66d04ea9** 【正式规则】1. 对应后台「登录 App → 连续登录天数」，按「连续第 n 天」配置金币奖励；连续天数以手动签到成功为准，仅登录不计为签到。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；每日签到；SRC-USER-92
- **REQ-dc7a35b43bc7** 【正式规则】2. 页面展示连续天数、已签到日、今天及后续奖励；奖励数额取当前后台配置，原型示例金额不是固定奖励。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；每日签到；SRC-USER-93
- **REQ-7b0ddb4e6853** 【正式规则】3. 点击「签到」成功后才计入连续天数并领取当日金币；提示到账，按钮变为「已签到」并禁用，同一账号同一日不可重复领取。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；每日签到；SRC-USER-94
- **REQ-a95405fe5f1e** 【正式规则】4. 当日未手动签到即断签，即使已登录也拿不到当日奖励；次日登录后须重新手动签到，连续天数及奖励从第 1 天重算。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；每日签到；SRC-USER-95
- **REQ-effa6d967b5b** 【正式规则】5. 超过后台配置的最高连续天数 n 后，第 n+1 天及以后每天签到均领取第 n 天的奖励，直至断签；不自动循环。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；每日签到；SRC-USER-96
- **REQ-65c34a5aad5a** 【正式规则】6. 例如仅配置第 1 天 +20、第 2 天 +30，则连续第 3 天起每天签到均领取 +30；断签后重新签到按第 1 天领取 +20。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；每日签到；SRC-USER-97
- **REQ-a67a520054a9** 【正式规则】1. 任务使用后台预置动作及对应指标，如观看时长、赠礼次数或金币数、分享次数、有效邀请人数；展示名称、目标值、当前进度、金币奖励和领取状态。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心；SRC-USER-98
- **REQ-b1aadbc4d1de** 【正式规则】2. 每日、每周、每月任务在新周期开始时进度归零；无周期任务在任务有效期内持续累计。可选周期以后台对应指标为准。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心；SRC-USER-99
- **REQ-5ce22fbcbf43** 【正式规则】3. 达到条件后可手动领取该档金币；同一账号、同一任务周期内，每个条件独立领取一次。未达成不能领取，已领取不能重复领取。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心；SRC-USER-100
- **REQ-a25125d70fce** 【正式规则】4. 任务达标获得奖励后，须在获得奖励当天 23:59 之前手动领取；周期任务（每日、每周、每月）和无周期任务均适用，领取有效期不随任务周期延长。逾期奖励失效，不自动发放，也不能补领。领取时须校验有效期，已失效则不发放奖励并提示「奖励已失效」。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心；SRC-USER-101
- **REQ-4d23a709cc93** 【正式规则】1. 领取成功后更新领取记录、钱包金币余额及金币流水；重复点击或重试不得重复入账。领取失败时不改为已领取，提示失败并允许重试。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心领取；SRC-USER-102
- **REQ-e4a92d30d05c** 【正式规则】2. 当前 P012：观看任务未完成时点击奖励提示「任务尚未完成」；分享入口提示前往直播间分享；已达成的赠礼任务点击奖励后显示「已领取」。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心领取；SRC-USER-103
- **REQ-482718776c29** 【原型说明】3. 原型以 Toast 代替前往观看或分享的业务动作，仅模拟当前页领取状态；不实际发币、不持久化。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心领取；SRC-USER-104
- **REQ-2fd2fd89cad9** 【正式规则】4. 游客可浏览并进入邀请好友页；签到、领奖和充值操作跳转登录。运营账号只可进入福利一级页，点击其中任意功能入口提示“运营账号无法操作”，不参与签到、任务及领奖。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；任务中心领取；SRC-USER-105；采用系统概要3.7.4功能白名单
- **REQ-745067340177** 【正式规则】1. 不支持补签；跨日和任务周期按平台业务时区计算，每周从周一开始。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；边界；SRC-USER-106
- **REQ-269017c35087** 【正式规则】2. 任务停用前已获得的奖励，可在获得当天 23:59 前领取；逾期失效。
  来源：liveshow-proto/prototype/annotations/user.js；welfare-center.html；边界；SRC-USER-107
## 首页与福利 / 全部任务 / all-tasks.html
页面入口：liveshow-proto/prototype/pages/user/home/all-tasks.html

- **REQ-17296eaada9b** 【正式规则】用户查看充值福利页入口中的三项任务。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；场景描述；SRC-USER-108
- **REQ-a0c94350d760** 【正式规则】任务范围：仅展示观看直播 30 分钟、送出任意 1 个礼物、分享 1 个直播间。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；字段；SRC-USER-111
- **REQ-7e61da43a58a** 【正式规则】任务进度：展示当前值、目标值和完成状态。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；字段；SRC-USER-112
- **REQ-5e8c851b824e** 【正式规则】奖励：展示任务完成后可领取的金币数量。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；字段；SRC-USER-113
- **REQ-19351ae55401** 【正式规则】操作状态：包括去完成、领取和已领取。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；字段；SRC-USER-114
- **REQ-de47603f63a7** 【正式规则】1. 页面不展示任务统计和任务分类标题。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；业务规则；SRC-USER-115
- **REQ-851b017b646d** 【正式规则】2. 每个任务实例仅可领取一次，领取后生成对应资产流水。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；业务规则；SRC-USER-116
- **REQ-b04db7f5b711** 【正式规则】3. 运营账号不可进入本页、做任务或领取任务奖励。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；业务规则；SRC-USER-117
- **REQ-0a73fa01b9ff** 【正式规则】4. 数据范围：展示当前任务中心的观看直播、送礼和分享任务；按页面配置顺序排列。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；业务规则；SRC-USER-118
- **REQ-e9bc21a1e1fb** 【正式规则】1. 点击去完成 -> 进入对应功能或提示前往路径。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；交互；SRC-USER-119
- **REQ-5559d422b0d8** 【正式规则】2. 点击领取 -> 发放奖励并切换为已领取；点击已领取 -> 不重复发放。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；交互；SRC-USER-120
- **REQ-874fb8d9359c** 【正式规则】3. 点击返回 -> 回到充值福利页。
  来源：liveshow-proto/prototype/annotations/user.js；all-tasks.html；交互；SRC-USER-121
## 首页与福利 / 邀请好友 / invite-friends.html
页面入口：liveshow-proto/prototype/pages/user/home/invite-friends.html

- **REQ-cba01d841a88** 【正式规则】用户邀请新用户，并查看邀请人数、奖励和邀请记录。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；场景描述；SRC-USER-122
- **REQ-f71c9492f7e0** 【正式规则】已邀请好友：展示成功邀请的好友人数。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；字段；SRC-USER-125
- **REQ-5bd308033113** 【正式规则】累计获得金币：展示邀请好友获得的金币合计。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；字段；SRC-USER-126
- **REQ-8c4e64406efd** 【正式规则】邀请记录：展示好友昵称和邀请日期。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；字段；SRC-USER-127
- **REQ-3eee395aa8b8** 【需求待确认】1. 邀请奖励额度待确认：当前邀请页写每成功邀请1位好友获得10金币，福利页说明取后台配置；仅隔离奖励额度，不隔离分享及邀请记录。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；业务规则；SRC-USER-128；SRC-Q02 仅隔离奖励额度，不影响分享、邀请记录和入口覆盖。
- **REQ-8edde08dadba** 【正式规则】2. 累计获得金币 = 成功邀请好友人数 × 10；具体奖励以活动页面展示为准。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；业务规则；SRC-USER-129
- **REQ-f35327960b0a** 【正式规则】3. 数据范围：当前账号成功邀请的好友及对应奖励；邀请记录按邀请日期倒序展示并分页。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；业务规则；SRC-USER-130
- **REQ-90e3e627a418** 【正式规则】1. 切换奖励/邀请记录 -> 展示统计或记录列表。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；交互；SRC-USER-131
- **REQ-cf791ac96f71** 【正式规则】2. 邀请记录超过一页 -> 点击上一页/下一页翻页。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；交互；SRC-USER-132
- **REQ-146bb03be8d7** 【正式规则】3. 点击邀请好友 -> 打开复制链接、发送给好友和保存图片选项。
  来源：liveshow-proto/prototype/annotations/user.js；invite-friends.html；交互；SRC-USER-133
## 消息与社交 / 消息 / message-center.html
页面入口：liveshow-proto/prototype/pages/user/social/message-center.html

- **REQ-f5e1772e02cc** 【正式规则】用户查看系统通知、互动通知、私信和粉丝团会话，并进入对应消息页面。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；场景描述；SRC-USER-134
- **REQ-1156e7febc84** 【正式规则】会话：展示头像、名称、最后一条消息、最后消息时间和未读数。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；字段；SRC-USER-137
- **REQ-cf86a38c7fdc** 【正式规则】排序：系统通知、互动通知固定置顶；其余会话按最后消息时间倒序，时间相同时按会话 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；字段；SRC-USER-138
- **REQ-27293b9bf97f** 【正式规则】消息分类：包括系统通知、互动通知、私信和粉丝团群聊。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；字段；SRC-USER-139
- **REQ-68cc65a496e1** 【正式规则】1. 系统通知、互动通知固定置顶在顶部，不随最后消息时间参与会话排序；私信和粉丝群分别维护会话。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；业务规则；SRC-USER-140
- **REQ-418e98f23067** 【正式规则】2. 私信发送权限按好友、非好友 3 条上限和拉黑关系校验。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；业务规则；SRC-USER-141
- **REQ-51fe12ad4a7c** 【正式规则】3. 粉丝群仅对有效团籍成员开放；团籍失效后移除对应会话权限。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；业务规则；SRC-USER-142
- **REQ-70c26fde6a02** 【正式规则】4. 数据范围：当前登录账号的私信和有效粉丝团会话；系统通知、互动通知使用独立入口。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；业务规则；SRC-USER-143
- **REQ-384b56a6e981** 【正式规则】5. 排序：会话按最后消息时间倒序；时间相同按会话 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；业务规则；SRC-USER-144
- **REQ-db7132129157** 【正式规则】进入会话 -> 清除该会话未读数；收到新消息 -> 更新最后消息、时间、排序和未读数。
  来源：liveshow-proto/prototype/annotations/user.js；message-center.html；交互；SRC-USER-145
## 消息与社交 / 系统通知 / system-notifications.html
页面入口：liveshow-proto/prototype/pages/user/social/system-notifications.html

- **REQ-3710d7115b92** 【正式规则】用户查看平台发送的系统通知及账号、公会、主播相关处理结果。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；场景描述；SRC-USER-146
- **REQ-811c6e17b306** 【正式规则】通知类型：包括公会关系、主播身份、直播权限和平台系统通知。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；字段；SRC-USER-149
- **REQ-35040a540533** 【正式规则】通知时间：按服务端生成时间倒序；时间相同时按通知 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；字段；SRC-USER-150
- **REQ-5f92dd100dc8** 【正式规则】已读状态：首次进入或查看后记为已读。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；字段；SRC-USER-151
- **REQ-a8bc8b325a1d** 【正式规则】1. 通知内容只读，不提供跳转或业务操作；通知只用于传达结果，不进入私信会话，也不作为身份或权限的最终判断。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；业务规则；SRC-USER-152
- **REQ-6737e9c0a4ce** 【正式规则】2. 数据范围：发送给当前账号的系统通知。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；业务规则；SRC-USER-153
- **REQ-69afc5771ebd** 【正式规则】3. 排序：按通知生成时间倒序；时间相同按通知 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；system-notifications.html；业务规则；SRC-USER-154
## 我的 / 我的 / profile.html
页面入口：liveshow-proto/prototype/pages/user/profile/profile.html

- **REQ-d0ff9a7f8a11** 【正式规则】登录用户查看自己的资料、社交数量和金币余额，进入关系列表、充值、装扮、设置及主播相关功能。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；场景描述；SRC-USER-155
- **REQ-0ebf55274729** 【正式规则】用户资料：展示当前账号头像、昵称、用户 ID 和财富等级。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；字段；SRC-USER-158
- **REQ-114528b1be6b** 【正式规则】勋章：最多佩戴 5 个；在昵称下方最多展示 5 个当前有效且已佩戴的勋章，不足 5 个不占位，没有可展示勋章时隐藏该区域。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；字段；SRC-USER-159
- **REQ-2e5fdda15b11** 【正式规则】社交数据：粉丝数为当前仍关注我的账号数；关注数为我当前仍关注的账号数；好友数为当前有效好友数。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；字段；SRC-USER-160
- **REQ-1202c4bc134d** 【正式规则】金币余额：展示当前账号可用金币；负余额时不可消费。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；字段；SRC-USER-161
- **REQ-598d4368f3a8** 【正式规则】1. 用户和主播共用同一账号、个人资料、社交关系和金币资产。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；业务规则；SRC-USER-162
- **REQ-ddaaf4fed01e** 【正式规则】2. 未获得主播身份时进入主播申请流程；获得主播身份后仍须校验直播权限才能开播。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；业务规则；SRC-USER-163
- **REQ-d9a5bfe92f81** 【正式规则】进入社交数据 -> 打开对应关系列表；点击好友数 -> 进入好友列表 P043；点击粉丝数 -> 进入粉丝列表 P045；进入主播中心 -> 按主播身份和权限展示申请或主播工具；充值 -> 进入充值流程。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-164
- **REQ-ae626d4be99f** 【原型说明】表格列标题为入口、功能说明、权限判断；具体行为见各行。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-165
- **REQ-ad00e259e21c** 【正式规则】编辑资料：修改头像、昵称等个人资料。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-167
- **REQ-4dea09d7c768** 【正式规则】设置：管理账号、通知和隐私设置。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-168
- **REQ-37abd32eccf8** 【正式规则】充值：进入充值流程购买金币。：登录用户可用；受支付渠道限制。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-169
- **REQ-2f242c5620c8** 【正式规则】我的装扮：查看和佩戴头像框、聊天气泡、勋章。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-170
- **REQ-323dc321b2b6** 【正式规则】粉丝团：查看已加入的主播粉丝团。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-171
- **REQ-53bf5b633464** 【正式规则】邀请奖励：查看邀请规则并邀请好友。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-172
- **REQ-f2de1a11c6f7** 【正式规则】开始直播：进入开播设置或主播申请流程。：已具备主播身份进入主播中心，否则进入申请流程，页面：申请成为主播 P014-1。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-173
- **REQ-ff4f555990c0** 【正式规则】主播中心：查看主播数据和主播工具。：已具备主播身份进入主播中心，否则进入申请流程，页面：申请成为主播 P014-1。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-174
- **REQ-dc66cdb2b110** 【正式规则】公会中心：进入公会申请和关系页面。：登录用户可用；申请、管理操作按公会关系判断。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-175
- **REQ-97280db93d84** 【正式规则】黑名单：查看和管理已拉黑账号。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-176
- **REQ-744a361be5cb** 【正式规则】联系客服：进入客服联系方式页面。：登录用户可用。
  来源：liveshow-proto/prototype/annotations/user.js；profile.html；交互；SRC-USER-177
## 我的 / 联系客服 / customer-service.html
页面入口：liveshow-proto/prototype/pages/user/profile/customer-service.html

- **REQ-57c03eb8886e** 【正式规则】用户查看并复制平台官方客服联系方式。
  来源：liveshow-proto/prototype/annotations/user.js；customer-service.html；场景描述；SRC-USER-178
- **REQ-9228f6e38779** 【正式规则】WhatsApp：展示运营配置的官方客服 WhatsApp 号码。
  来源：liveshow-proto/prototype/annotations/user.js；customer-service.html；字段；SRC-USER-181
- **REQ-f35201aeadba** 【正式规则】官方客服邮箱：展示运营配置的官方客服邮箱。
  来源：liveshow-proto/prototype/annotations/user.js；customer-service.html；字段；SRC-USER-182
- **REQ-4c4e80e7a304** 【正式规则】联系方式由运营统一配置；配置变更后更新页面展示内容。
  来源：liveshow-proto/prototype/annotations/user.js；customer-service.html；业务规则；SRC-USER-183
- **REQ-d90fce78fe99** 【正式规则】点击 WhatsApp 或官方客服邮箱 -> 复制对应内容，并提示“已复制”。
  来源：liveshow-proto/prototype/annotations/user.js；customer-service.html；交互；SRC-USER-184
## 消息与社交 / 粉丝列表 / follower-list.html
页面入口：liveshow-proto/prototype/pages/user/social/follower-list.html

- **REQ-b341ff28103d** 【正式规则】用户浏览和搜索关注自己的账号，点击头像进入对应用户或主播主页。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；场景描述；SRC-USER-185
- **REQ-de5f500a9898** 【正式规则】搜索关键词：按用户名模糊筛选，忽略大小写；空值展示全部粉丝。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；字段；SRC-USER-188
- **REQ-e2f4dcbc4e3f** 【正式规则】粉丝头像 / 昵称：展示当前仍关注我的账号资料。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；字段；SRC-USER-189
- **REQ-7cbc8e603094** 【正式规则】等级：展示该账号的财富等级。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；字段；SRC-USER-190
- **REQ-f7f6e22591a8** 【正式规则】勋章：展示该账号当前显示的勋章。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；字段；SRC-USER-191
- **REQ-cbcc00a5c60e** 【正式规则】1. 展示当前仍关注我的账号；粉丝关系与好友关系分别维护，取消关注后从列表移除。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；业务规则；SRC-USER-192
- **REQ-e38e92f87865** 【正式规则】2. 默认按关注时间倒序；搜索不改变结果的相对顺序。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；业务规则；SRC-USER-193
- **REQ-15eccc5e998d** 【正式规则】输入用户名 -> 实时模糊筛选；无匹配时显示空态。点击头像 -> 进入对应用户或主播主页。
  来源：liveshow-proto/prototype/annotations/user.js；follower-list.html；交互；SRC-USER-194
## 我的 / 我的关注 / my-following.html
页面入口：liveshow-proto/prototype/pages/user/profile/my-following.html

- **REQ-d7aceb72d38e** 【正式规则】用户浏览已关注账号，查看主播开播状态，并进入主页或正在直播的房间。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；场景描述；SRC-USER-195
- **REQ-d94699afffc3** 【正式规则】搜索关键词：按用户名模糊筛选，忽略大小写；空值展示全部关注。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；字段；SRC-USER-198
- **REQ-3662d9948b9d** 【正式规则】关注账号：展示头像、昵称及当前开播状态。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；字段；SRC-USER-199
- **REQ-053041f9a307** 【正式规则】开播状态：关联当前有效直播场次，场次结束后立即更新。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；字段；SRC-USER-200
- **REQ-3c5dc1c24bbd** 【正式规则】1. 仅展示当前有效关注关系；取消关注或拉黑后立即移出。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；业务规则；SRC-USER-201
- **REQ-f95e0e1fbdc3** 【正式规则】2. 按关注时间倒序排列，最新关注排在最前。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；业务规则；SRC-USER-202
- **REQ-d01803cda0ad** 【正式规则】输入用户名 -> 实时模糊筛选；无匹配时显示空态。开播主播 -> 按房间准入规则进入直播间；点击头像 -> 进入对应主页。
  来源：liveshow-proto/prototype/annotations/user.js；my-following.html；交互；SRC-USER-203
## 我的 / 我的装扮 / my-decoration.html
页面入口：liveshow-proto/prototype/pages/user/profile/my-decoration.html

- **REQ-8c1b9038aba6** 【正式规则】用户查看、购买和管理头像框、聊天气泡及勋章。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；场景描述；SRC-USER-204
- **REQ-be10bfca660b** 【正式规则】当前头像 / 勋章：展示当前账号头像及已佩戴勋章。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；字段；SRC-USER-207
- **REQ-0dd1bbe802ac** 【正式规则】页面分类：已拥有、装扮商城。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；字段；SRC-USER-208
- **REQ-f4134b455003** 【正式规则】已拥有分类：按头像框、聊天气泡、勋章三个 Tab 展示；卡片沿用各装扮原有展示样式，当前分类内每行展示 2 个道具。点击卡片直接佩戴或卸下，不跳转新页面。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；字段；SRC-USER-209
- **REQ-3434a58c5a0e** 【正式规则】勋章佩戴数量：勋章 Tab 显示“勋章数量/5”，如“勋章3/5”；列表下方不重复显示佩戴数量。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；字段；SRC-USER-210
- **REQ-e070dc7c8308** 【正式规则】商城商品：展示装扮效果、名称、可佩戴期限值和金币价格；页面不显示期限字段名，限时格式为 DD/MM/YYYY-DD/MM/YYYY；已购买商品显示“已获得”。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；字段；SRC-USER-211
- **REQ-c3a40eb587e1** 【正式规则】1. 道具可来自金币购买、任务、活动或平台发放；上下架只控制能否获得。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-212
- **REQ-f4b3ed688780** 【正式规则】2. 用户已持有道具可在后台配置的可佩戴期限内使用；结束日期为不限时，道具可永久佩戴。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-213
- **REQ-0bf0bf9c7368** 【正式规则】3. 有结束日期的道具过期后不可佩戴，并在用户端显示“已过期”。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-214
- **REQ-815416aefa21** 【正式规则】4. 仅后台标记为允许购买且已上架的道具进入商城；身份、等级和活动专属勋章不可购买。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-215
- **REQ-c555704c1014** 【正式规则】5. 永久和限时道具已拥有后均不可重复购买；购买成功不可退款。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-216
- **REQ-c68783fb1232** 【正式规则】6. 运营账号点击我的装扮入口提示“运营账号无法操作”，不得进入查看、佩戴或购买流程；虚拟金币仅可用于赠送普通礼物和定制礼物。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-217；采用系统概要3.7.4功能白名单
- **REQ-225dafdafaf3** 【正式规则】7. 头像框和聊天气泡同类最多佩戴 1 个，新佩戴会自动卸下旧道具；勋章最多同时佩戴 5 枚。已拥有列表按已佩戴、未佩戴、已失效排列，同一状态内按获得时间倒序排列。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；业务规则；SRC-USER-218
- **REQ-70dd8eb618a6** 【正式规则】已拥有卡片 -> 直接佩戴或卸下并刷新状态，不跳转新页面；失效道具不可点击。勋章达到 5 枚后，需先卸下一枚。购买 -> 打开购买弹窗。金币充足时依次展示装扮预览、道具名称及期限、金币价格和操作按钮，不显示标题及分隔线，价格不显示字段名；按钮为“取消”和“购买”。购买成功 -> 弹窗显示“购买成功”及“继续购买”“去佩戴”按钮；继续购买关闭弹窗并停留商城，去佩戴返回“我的装扮-已拥有”并自动切换至对应装扮分类。金币不足时仅显示“金币余额（金币图标 + 当前余额）不足，请先充值”及“取消”“去充值”按钮，不显示装扮、价格和“金币不足”标题。原型演示时，点击未获得商品交替展示金币满足和不足状态；实际状态根据用户实时金币余额判断。
  来源：liveshow-proto/prototype/annotations/user.js；my-decoration.html；交互；SRC-USER-219
## 我的 / 我的装扮 / views/my-decoration/store.html
页面入口：liveshow-proto/prototype/pages/user/profile/my-decoration.html

- **REQ-14cc937d954b** 【正式规则】商城按头像框、聊天气泡、勋章分类，展示名称、可佩戴期限和金币价格；已购买商品显示“已获得”。
  来源：liveshow-proto/prototype/annotations/user.js；views/my-decoration/store.html；字段；SRC-USER-220
- **REQ-6d45893c3c86** 【正式规则】仅展示允许购买且已上架的商品；已拥有商品不可重复购买。运营账号不可使用虚拟金币购买装扮，不展示购买入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/my-decoration/store.html；业务；SRC-USER-221
## 我的 / 我的装扮 / views/my-decoration/purchase-confirm.html
页面入口：liveshow-proto/prototype/pages/user/profile/my-decoration.html

- **REQ-57d7b7987914** 【正式规则】运营账号不进入本流程。普通用户取消 -> 关闭弹窗且不购买；购买 -> 再次校验商品状态、真实金币余额和持有状态，校验通过后扣款并加入已拥有。成功后弹窗显示“购买成功”及“继续购买”“去佩戴”按钮；继续购买关闭弹窗并停留商城，去佩戴返回“我的装扮-已拥有”并自动切换至对应装扮分类。
  来源：liveshow-proto/prototype/annotations/user.js；views/my-decoration/purchase-confirm.html；交互；SRC-USER-222
## 我的 / 我的装扮 / views/my-decoration/insufficient.html
页面入口：liveshow-proto/prototype/pages/user/profile/my-decoration.html

- **REQ-ad9b3d091439** 【正式规则】仅适用于普通用户。真实金币不足 -> 不生成购买记录；去充值 -> 进入充值页。运营账号不进入装扮购买或充值流程。
  来源：liveshow-proto/prototype/annotations/user.js；views/my-decoration/insufficient.html；交互；SRC-USER-223
## 直播 / 直播间-观众 / live-room.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-1a82b56159e2** 【正式规则】直播场次：每次开播生成唯一场次，关联主题、封面、分类和房型。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；字段；SRC-USER-226
- **REQ-74b96cc96a5d** 【正式规则】主播：展示主播账号、主播等级、财富等级和关系状态。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；字段；SRC-USER-227
- **REQ-536e8dc9811f** 【正式规则】在线人数：当前场次实时在线用户数。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；字段；SRC-USER-228
- **REQ-a4a990aaba9c** 【正式规则】本场贡献：本场贡献 = 当前场次内非运营账号成功送出的各礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减本场贡献；运营账号贡献值始终为 0，不进入任何榜单或排行。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；字段；SRC-USER-229
- **REQ-3265554039fb** 【正式规则】公屏消息：展示系统、评论、进房和礼物消息，按服务端时间排序。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；字段；SRC-USER-230
- **REQ-fb48978f0710** 【正式规则】1. 普通用户的账号封禁、双方账号拉黑和本场踢出优先于粉丝团成员、密码和门票准入规则；命中任一限制时不能进入。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-231
- **REQ-2efe965180ab** 【正式规则】2. 巡房人员从有效巡房任务进入时，以本次巡房会话身份绕过主播黑名单、本场踢出、粉丝团成员、密码和门票限制；不改变原账号关系、粉丝团身份或门票状态。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-232
- **REQ-d2757206555e** 【正式规则】3. 巡房会话期间，主播和房管不能将巡房人员拉黑或踢出；巡房结束后恢复普通用户规则。平台封禁或巡房权限失效仍不可进入。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-233
- **REQ-3156b33335c2** 【正式规则】4. 门票仅对当前场次有效，同场重复进入不收费；场次结束或被踢出后失效且不退款。运营账号进入门票房免票，不生成门票订单，不扣减虚拟金币。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-234
- **REQ-6239ce0ec64e** 【正式规则】5. 禁言仅限制当前场次公屏发言；踢出后本场不可重进；两种状态均在下一场恢复。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-235
- **REQ-17cd027e4846** 【正式规则】6. 成员限制仅在进房时校验；已在房内的非成员不退出，离开后再次进入时拦截。成员仍需输入密码，运营账号可绕过限制。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-236
- **REQ-600153ec957c** 【正式规则】7. 幸运礼物每个礼物独立开奖；实际消费 = 投入金币 - 返奖金币。x1、x10、x100 的长期平均返还比例分别为 96%、97%、98%。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；业务；SRC-USER-237
- **REQ-607e47a26898** 【正式规则】1. 进入普通房 -> 直接展示直播内容，不显示封面遮挡或操作弹窗。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；交互；SRC-USER-238
- **REQ-537f2394a4b3** 【正式规则】2. 普通用户进入密码房或门票房 -> 由全屏封面和毛玻璃遮挡直播内容，页面中央显示对应准入弹窗；密码房开启粉丝团成员限制时，非成员先显示访问受限，成员才显示密码输入。运营账号进入门票房免票。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；交互；SRC-USER-239
- **REQ-295c521ac36a** 【正式规则】3. 命中双方拉黑、本场踢出或非粉丝团成员限制 -> 显示访问受限拦截；点击“返回”回到来源页，无来源时返回首页。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；交互；SRC-USER-240
- **REQ-875e67d768ae** 【正式规则】4. 巡房任务进入 -> 不显示访问拦截，正常展示直播并显示“巡房中”；主播或房管端不展示对该巡房人员的拉黑、踢出操作，服务端同时拒绝相关请求。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；交互；SRC-USER-241
- **REQ-81ce2ba015d6** 【正式规则】5. 举报直播 -> 仅直播中生成当前场次举报工单；举报用户 -> 生成账号举报工单。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；交互；SRC-USER-242
- **REQ-c3541b3a350d** 【正式规则】6. 清屏 -> 仅清除当前设备上的公屏显示，不删除服务端消息记录。
  来源：liveshow-proto/prototype/annotations/user.js；live-room.html；交互；SRC-USER-243
## 消息与社交 / 举报直播间 / live-room-report.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-report.html

- **REQ-d1f4689437ac** 【正式规则】举报原因：必填，单选；选项由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-report.html；字段；SRC-USER-246
- **REQ-3a6dfd7b6b8c** 【正式规则】补充说明：选填，最多 200 个字符。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-report.html；字段；SRC-USER-247
- **REQ-97aa091d1aad** 【正式规则】1. 仅直播中可举报当前场次；场次结束后未处理的直播举报失效。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-report.html；业务；SRC-USER-248
- **REQ-79b9dcf90fd2** 【正式规则】2. 举报类型包括色情低俗、涉及宗教政治、暴恐血腥、未成年人有害、其他。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-report.html；业务；SRC-USER-249
- **REQ-805c79bddb30** 【正式规则】1. 未选择举报原因 -> 提交按钮不可用。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-report.html；交互；SRC-USER-250
- **REQ-15a86faa9547** 【正式规则】2. 提交成功 -> 生成直播场次举报工单并返回直播间。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-report.html；交互；SRC-USER-251
## 直播 / 举报用户 / live-room-user-report.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-user-report.html

- **REQ-a28222f95651** 【正式规则】举报原因：必填，单选；选项由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-user-report.html；字段；SRC-USER-254
- **REQ-3b17bb1c285c** 【正式规则】补充说明：选填，最多 200 个字符。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-user-report.html；字段；SRC-USER-255
- **REQ-7baf19b73bc9** 【正式规则】举报对象为当前账号；举报类型包括色情低俗、涉及宗教政治、暴恐血腥、未成年人有害、其他。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-user-report.html；业务；SRC-USER-256
- **REQ-c5549b4e74e3** 【正式规则】1. 未选择举报原因 -> 提交按钮不可用。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-user-report.html；交互；SRC-USER-257
- **REQ-773edb720337** 【正式规则】2. 提交成功 -> 生成账号举报工单并返回来源页。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-user-report.html；交互；SRC-USER-258
## 直播 / 直播间-主播 / live-room-host.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-b833ded20cec** 【正式规则】房间 ID：主播固定直播间标识；每次开播另生成直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；字段；SRC-USER-261
- **REQ-c9eca67d7255** 【正式规则】在线人数：当前场次实时在线用户数。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；字段；SRC-USER-262
- **REQ-aab0394942ab** 【正式规则】本场贡献：本场贡献 = 当前场次内非运营账号成功送出的各礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减本场贡献；运营账号贡献值始终为 0，不进入任何榜单或排行。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；字段；SRC-USER-263
- **REQ-7b33379f063e** 【正式规则】待处理连麦邀请：展示当前仍有效的邀请数量。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；字段；SRC-USER-264
- **REQ-cfb2da2d03b8** 【正式规则】公屏消息：展示评论、进房、礼物和系统消息；被屏蔽单条消息从当前公屏移除。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；字段；SRC-USER-265
- **REQ-629a0f171729** 【正式规则】1. 平台或公会关闭直播权限 -> 立即结束当前场次；历史消息、消费、处置和收益记录保留。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；业务；SRC-USER-266
- **REQ-f68a587c58a5** 【正式规则】2. 房管最多 3 人，授权长期有效；主播可取消房管、禁言、踢出或屏蔽单条评论。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；业务；SRC-USER-267
- **REQ-7572618ac4e5** 【正式规则】3. 禁言和恢复发言仅作用于当前场次；踢出后用户本场不可重进。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；业务；SRC-USER-268
- **REQ-e0a0e90bb37d** 【正式规则】4. 仅普通房支持两位主播连麦；双方须在播、未连麦且无账号拉黑关系。任一方结束直播 -> 邀请和连麦失效。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；业务；SRC-USER-269
- **REQ-fff3876be890** 【正式规则】1. 新连麦邀请 -> 更新待处理数量；提示停留 4 秒，期间新增邀请只更新当前提示。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；交互；SRC-USER-270
- **REQ-8f37c7bed24f** 【正式规则】2. 设置或取消房管、禁言或恢复发言、踢出用户、结束直播 -> 二次确认后执行；房管达到 3 人时保留入口，点击提示“已达3人上限”。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；交互；SRC-USER-271
- **REQ-12dabb818af0** 【正式规则】3. 屏蔽评论 -> 仅移除被选中的单条公屏消息。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；交互；SRC-USER-272
- **REQ-ca7827915d33** 【正式规则】4. 清屏 -> 仅清除当前主播设备上的公屏显示。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host.html；交互；SRC-USER-273
## 直播 / 直播间-主播-密码房 / live-room-host-password.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host-password.html

- **REQ-2d5ccadfbd9b** 【正式规则】房间密码：必填，必须为 4-12 个数字，归属当前直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；字段；SRC-USER-276
- **REQ-45d406b6e64e** 【正式规则】本场贡献榜：依次按贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；完整排序后显示前 99 名，不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；字段；SRC-USER-277
- **REQ-b4b13bc722f7** 【正式规则】在线观众排序：运营账号可展示但贡献值固定为 0；按贡献时依次比较贡献值、粉丝等级、财富等级、用户 ID；按停留时长时依次比较停留时长、贡献值、粉丝等级、财富等级、用户 ID。数值从高到低，ID 从小到大。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；字段；SRC-USER-278
- **REQ-e1d0dffecb87** 【正式规则】1. 用户输入当前有效密码后才可进入；账号封禁、拉黑或本场踢出仍优先拦截。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；业务；SRC-USER-279
- **REQ-4d4d553bf3a5** 【正式规则】2. 密码房不支持连麦。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；业务；SRC-USER-280
- **REQ-30ff6858eb62** 【正式规则】3. 主播修改密码后，已通过旧密码验证的在线用户不强制退出；用户退出后再次进入，必须输入新密码。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；业务；SRC-USER-281
- **REQ-025a5678c387** 【正式规则】4. 排序所需等级缺失时按 0 级处理；运营账号不进入任何榜单或排行，其虚拟金币赠礼不计入本场贡献。账号注销后保留历史贡献，名称显示“账号已注销”，且不能进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；业务；SRC-USER-282
- **REQ-51fd00be85ab** 【正式规则】修改密码 -> 仅接受 4-12 个数字；不符合时保留输入并提示“密码必须是4-12个数字”；校验通过后更新本场有效密码。转发 -> 选择粉丝群或好友并确认；结束直播 -> 二次确认后关闭本场。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-host-password.html；交互；SRC-USER-283
## 直播 / 直播间-连麦中-主播 / live-room-cohost-active.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-cohost-active.html

- **REQ-b8b2df21d338** 【正式规则】连麦主播：固定展示当前两位主播的账号和直播画面。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；字段；SRC-USER-286
- **REQ-965669a50779** 【正式规则】连麦状态：双方在播且连接有效时为连麦中。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；字段；SRC-USER-287
- **REQ-0d407226ed57** 【正式规则】本场数据：双方直播场次的观众、消息和收益分别累计，不合并账务。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；字段；SRC-USER-288
- **REQ-1bee929d5fb2** 【正式规则】本场贡献榜：依次按贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；完整排序后显示前 99 名，不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；字段；SRC-USER-289
- **REQ-31dee4e7266a** 【正式规则】在线观众排序：运营账号可展示但贡献值固定为 0；按贡献时依次比较贡献值、粉丝等级、财富等级、用户 ID；按停留时长时依次比较停留时长、贡献值、粉丝等级、财富等级、用户 ID。数值从高到低，ID 从小到大。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；字段；SRC-USER-290
- **REQ-9a468e217c1e** 【正式规则】1. 仅普通房支持两位主播连麦；不支持观众上麦、三人及以上连线。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；业务；SRC-USER-291
- **REQ-14213298b2a3** 【正式规则】2. 任一方结束直播 -> 连麦立即结束，另一方直播继续。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；业务；SRC-USER-292
- **REQ-086e916ebf43** 【正式规则】3. 排序所需等级缺失时按 0 级处理；运营账号不进入任何榜单或排行，其虚拟金币赠礼不计入本场贡献。账号注销后保留历史贡献，名称显示“账号已注销”，且不能进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；业务；SRC-USER-293
- **REQ-59b33810f50a** 【正式规则】退出连麦确认 -> 双方退出连麦，各自直播继续；取消 -> 保持连麦。
  来源：liveshow-proto/prototype/annotations/user.js；live-room-cohost-active.html；交互；SRC-USER-294
## 直播 / 直播结束页（观众） / live-end-viewer.html
页面入口：liveshow-proto/prototype/pages/user/live/live-end-viewer.html

- **REQ-85dbd5ef7455** 【正式规则】主播头像 / 名称：展示当前已结束直播场次对应主播的头像和名称。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；字段；SRC-USER-297
- **REQ-5b91148502a9** 【正式规则】直播结束状态：展示“主播名称 的直播已结束”，表示当前场次已关闭。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；字段；SRC-USER-298
- **REQ-6f25bb640903** 【正式规则】结束提示：展示“主播正在整理本场内容”；仅为结束后的页面提示，不代表新场次已创建。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；字段；SRC-USER-299
- **REQ-409fffcd563c** 【正式规则】返回首页：离开结束页并回到直播广场。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；字段；SRC-USER-300
- **REQ-28bc4ce2a4a9** 【正式规则】1. 当前直播场次已关闭，不能继续观看、评论、送礼或进入连麦。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；业务；SRC-USER-301
- **REQ-4a27859eea31** 【正式规则】2. 本场门票、密码验证和踢出/禁言状态同时失效；历史消费记录保留。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；业务；SRC-USER-302
- **REQ-3e9a159356f3** 【正式规则】3. 主播再次开播会创建新场次，须重新执行对应准入校验。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；业务；SRC-USER-303
- **REQ-fe3ff3fa6f4a** 【正式规则】返回首页 -> 离开结束页；重复打开已结束房间 -> 仍进入当前结束状态，不进入新场次。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-viewer.html；交互；SRC-USER-304
## 直播 / 直播结束页（主播） / live-end-host.html
页面入口：liveshow-proto/prototype/pages/user/live/live-end-host.html

- **REQ-4a2157d327b0** 【正式规则】直播时长：当前场次从开始到结束的有效直播时长。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-host.html；字段；SRC-USER-307
- **REQ-94bff089626b** 【正式规则】观看人数：当前场次累计进入人次。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-host.html；字段；SRC-USER-308
- **REQ-be0c51fd052a** 【正式规则】本场收益：普通/定制礼物收益 + 门票收益 + 幸运礼物收益；幸运礼物收益 = 送出价值 × 后台比例，默认 1%，返奖不影响。虚拟金币、失败或撤销消费不计入。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-host.html；字段；SRC-USER-309
- **REQ-22ebe11c049c** 【正式规则】结束后关闭当前场次；历史消息、消费、处置和收益记录保留，下一次开播创建新场次。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-host.html；业务；SRC-USER-310
- **REQ-2dac31b3bcf4** 【正式规则】查看直播数据 -> 进入当前场次或汇总数据；返回主播中心 -> 离开结束页。
  来源：liveshow-proto/prototype/annotations/user.js；live-end-host.html；交互；SRC-USER-311
## 消息与社交 / 好友列表 / friend-list.html
页面入口：liveshow-proto/prototype/pages/user/social/friend-list.html

- **REQ-003ea768237b** 【正式规则】用户浏览和搜索自己的好友，点击好友整行进入对应用户或主播主页。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；场景描述；SRC-USER-312
- **REQ-5487b7310161** 【正式规则】搜索关键词：按用户名模糊筛选，忽略大小写；空值展示全部好友。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；字段；SRC-USER-315
- **REQ-36af49b76e5d** 【正式规则】好友头像 / 昵称：展示当前有效好友的账号资料。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；字段；SRC-USER-316
- **REQ-00af40de8ba1** 【正式规则】等级：展示该好友的财富等级。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；字段；SRC-USER-317
- **REQ-f88c66cf2194** 【正式规则】勋章：展示该好友当前显示的勋章。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；字段；SRC-USER-318
- **REQ-3defb9627768** 【正式规则】1. 接受好友申请后双方进入好友列表；重复申请不生成新记录。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；业务规则；SRC-USER-319
- **REQ-1a1d9e60c302** 【正式规则】2. 删除好友或任一方拉黑 -> 立即从双方列表移除；取消拉黑不自动恢复。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；业务规则；SRC-USER-320
- **REQ-f39e2d7eac8b** 【正式规则】3. 好友关系与关注关系分别维护。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；业务规则；SRC-USER-321
- **REQ-27c3fbee902d** 【正式规则】4. 数据范围：当前账号仍有效的双向好友关系；搜索仅匹配这些好友。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；业务规则；SRC-USER-322
- **REQ-8b00fecf06a8** 【正式规则】5. 默认按好友关系建立时间倒序；搜索不改变结果的相对顺序。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；业务规则；SRC-USER-323
- **REQ-7ff85c42b2fb** 【正式规则】1. 输入用户名 -> 实时模糊筛选；无匹配时展示空状态。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；交互；SRC-USER-324
- **REQ-a545270e12c5** 【正式规则】2. 点击好友整行（头像、昵称、等级、勋章或行内空白）-> 进入对方主页；主播进入主播主页，普通用户进入用户主页。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；交互；SRC-USER-325
- **REQ-6d9a1458a8b3** 【正式规则】3. 点击返回 -> 进入消息中心。
  来源：liveshow-proto/prototype/annotations/user.js；friend-list.html；交互；SRC-USER-326
## 消息与社交 / 互动通知 / interaction-notifications.html
页面入口：liveshow-proto/prototype/pages/user/social/interaction-notifications.html

- **REQ-e2ef3227a460** 【正式规则】用户查看新增关注和好友申请通知，并处理待确认的好友申请。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；场景描述；SRC-USER-327
- **REQ-e1dfcc8eb745** 【正式规则】通知类型：包括新增关注、好友申请、好友申请通过和拒绝。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；字段；SRC-USER-330
- **REQ-3e38745b24e3** 【正式规则】处理状态：好友申请可为待处理、已同意、已拒绝或已失效。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；字段；SRC-USER-331
- **REQ-f4405460d518** 【正式规则】发生时间：按服务端时间倒序；时间相同时按通知 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；字段；SRC-USER-332
- **REQ-4bf78865972e** 【正式规则】1. 同一申请双方存在待处理记录时不可重复发送。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；业务规则；SRC-USER-333
- **REQ-6af5fa2eb1d1** 【正式规则】2. 同意 -> 建立好友关系；拒绝 -> 不建立关系；任一方拉黑 -> 待处理申请失效。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；业务规则；SRC-USER-334
- **REQ-4157b86c49f5** 【正式规则】3. 数据范围：与当前账号相关的关注和好友申请通知。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；业务规则；SRC-USER-335
- **REQ-22a89cc204f8** 【正式规则】4. 排序：按发生时间倒序；时间相同按通知 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；业务规则；SRC-USER-336
- **REQ-fdaee7eaa9ac** 【正式规则】同意或拒绝成功 -> 当前通知更新为处理结果且按钮不可重复点击；点击头像 -> 进入对应用户或主播主页。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；交互；SRC-USER-337
- **REQ-bc5973b1255d** 【正式规则】已失效的好友申请仅展示状态，不展示同意、拒绝按钮。
  来源：liveshow-proto/prototype/annotations/user.js；interaction-notifications.html；交互；SRC-USER-338
## 消息与社交 / 1 对 1 私信 / direct-message.html
页面入口：liveshow-proto/prototype/pages/user/social/direct-message.html

- **REQ-b54e1843aaa9** 【正式规则】用户与指定账号进行一对一聊天，发送文字、图片或语音，并进入单聊设置。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；场景描述；SRC-USER-339
- **REQ-7fba5902db42** 【正式规则】消息：支持文本、图片和语音，按服务端发送时间正序；时间相同时按消息 ID 从小到大排序。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；字段；SRC-USER-342
- **REQ-51ae2f7e87d9** 【正式规则】已读状态：对方进入会话后更新已读状态。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；字段；SRC-USER-343
- **REQ-44d578238dc8** 【正式规则】1. 好友之间可持续私信；非好友一方最多主动发送 3 条消息。双方各自独立计数，即 A→B 最多 3 条、B→A 最多 3 条。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；业务规则；SRC-USER-344
- **REQ-b8b4a1d18c79** 【正式规则】2. 任一方拉黑后，无法发送消息。见视图-拉黑关系
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；业务规则；SRC-USER-345
- **REQ-339118822a36** 【正式规则】3. 删除好友会解除好友关系并清空双方聊天记录。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；业务规则；SRC-USER-346
- **REQ-68f8be7ceb7b** 【正式规则】4. 同页视图-拉黑关系：在当前会话发送文本、语音或图片后，消息右侧显示红色“❕”，下方显示“消息发送失败，对方拒收”；拒收不计入成功发送条数。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；业务规则；SRC-USER-347
- **REQ-5b2e1ca7fbf9** 【正式规则】5. 数据范围：当前账号与所选对象的单聊记录。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；业务规则；SRC-USER-348
- **REQ-a9f8a0bc0f01** 【正式规则】6. 排序：消息按服务端发送时间正序；时间相同按消息 ID 从小到大排序。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；业务规则；SRC-USER-349
- **REQ-a11b5b0f63a1** 【正式规则】发送成功 -> 消息写入会话并更新消息中心；非好友发送满 3 条后继续发送 -> 不生成消息并提示“非好友最多发送三条”；发送失败 -> 显示失败图标并保留消息内容，点击失败图标重试。
  来源：liveshow-proto/prototype/annotations/user.js；direct-message.html；交互；SRC-USER-350
## 消息与社交 / 粉丝团群聊 / fan-group-chat.html
页面入口：liveshow-proto/prototype/pages/user/social/fan-group-chat.html

- **REQ-9f146f856fde** 【正式规则】粉丝团成员查看群公告和群消息，与主播及其他成员交流，进入群管理。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；场景描述；SRC-USER-351
- **REQ-d0304c059e66** 【正式规则】群消息：展示发送人、身份标签、内容和发送时间。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；字段；SRC-USER-354
- **REQ-45a3091775a6** 【正式规则】直播卡片：保存对应直播场次 ID、封面、主题和直播状态。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；字段；SRC-USER-355
- **REQ-558c541defc9** 【正式规则】发言状态：按有效团籍、单人禁言、全员禁言和平台限制计算。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；字段；SRC-USER-356
- **REQ-8e296eb8f43e** 【正式规则】1. 仅有效团籍成员可查看和发送群消息。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；业务规则；SRC-USER-357
- **REQ-31037d172fcc** 【正式规则】2. 退出、被移出或拉黑主播后立即失去群聊权限，历史消息不再开放。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；业务规则；SRC-USER-358
- **REQ-6c79fce41141** 【正式规则】3. 直播卡片关联具体场次，不自动跳转至主播后续新场次。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；业务规则；SRC-USER-359
- **REQ-cff879e8c2ea** 【正式规则】4. 数据范围：当前粉丝群内、当前账号有权限查看的消息。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；业务规则；SRC-USER-360
- **REQ-3e4effac33f6** 【正式规则】5. 排序：聊天消息按发送时间从早到晚展示。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；业务规则；SRC-USER-361
- **REQ-2051c0423e38** 【正式规则】发送成功 -> 写入群消息并更新会话摘要；点击直播中卡片 -> 按房间规则进入；场次已结束 -> 提示直播已结束。同页“视图-用户被禁言”中，输入框显示“当前被禁言”且不可输入或发送；点击语音、图片、表情均 Toast 提示“当前被禁言”，不打开对应功能。
  来源：liveshow-proto/prototype/annotations/user.js；fan-group-chat.html；交互；SRC-USER-362
## 消息与社交 / 群管理（成员） / group-manage-member.html
页面入口：liveshow-proto/prototype/pages/user/social/group-manage-member.html

- **REQ-c8c5e65b2820** 【正式规则】粉丝团成员查看群公告，设置群消息免打扰或退出粉丝群。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；场景描述；SRC-USER-363
- **REQ-fc0bd91289a4** 【正式规则】群公告：展示当前粉丝群的公告内容。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；字段；SRC-USER-366
- **REQ-9281249cef8e** 【正式规则】群消息免打扰：当前账号对此群的通知开关，不影响消息接收。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；字段；SRC-USER-367
- **REQ-4e0209363b8c** 【正式规则】1. 普通成员只能查看群资料、消息免打扰和退出粉丝团，不具备成员管理权限。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；业务规则；SRC-USER-368
- **REQ-124597933e34** 【正式规则】2. 群内发言按有效团籍、单人禁言、全员禁言和平台限制计算。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；业务规则；SRC-USER-369
- **REQ-8eff93cc5e44** 【正式规则】3. 主动退出 -> 团籍和群籍同时解除，粉丝等级与亲密度清零；关注关系不受影响。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；业务规则；SRC-USER-370
- **REQ-8ab61657c659** 【正式规则】退出粉丝团 -> 二次确认后离开群聊并返回消息中心；消息免打扰只关闭通知，不影响消息接收。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-member.html；交互；SRC-USER-371
## 消息与社交 / 群管理（群主） / group-manage-owner.html
页面入口：liveshow-proto/prototype/pages/user/social/group-manage-owner.html

- **REQ-2ecbec38ab36** 【正式规则】粉丝团群主查看和编辑群公告，设置免打扰，并进入群成员管理。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；场景描述；SRC-USER-372
- **REQ-2e3493588ff9** 【正式规则】群公告：展示当前粉丝群的公告内容，群主可编辑，最多 200 字符。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；字段；SRC-USER-375
- **REQ-aaf346990d6f** 【正式规则】群消息免打扰：当前账号对此群的通知开关，不影响其他成员。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；字段；SRC-USER-376
- **REQ-a3f8844f142d** 【正式规则】1. 数据范围：当前主播所属粉丝群的群公告和个人通知设置；仅所属主播可编辑公告、进入成员管理。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；业务规则；SRC-USER-377
- **REQ-ebed6e5a6579** 【正式规则】2. 免打扰只影响当前账号对此群的通知，不影响消息接收或其他成员。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；业务规则；SRC-USER-378
- **REQ-675082760130** 【正式规则】1. 编辑公告 -> 弹窗回填当前公告，支持换行并显示字符计数，最多输入 200 字符；空白内容不可保存。保存后关闭弹窗并更新公告，群成员查看更新后的内容；取消或关闭不保存修改。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；交互；SRC-USER-379
- **REQ-dfc1f2591989** 【正式规则】2. 切换群消息免打扰 -> 更新当前账号对此群的通知设置。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；交互；SRC-USER-380
- **REQ-82451b22fe04** 【正式规则】3. 点击群成员管理 -> 进入粉丝团成员页，执行禁言或移除等操作。
  来源：liveshow-proto/prototype/annotations/user.js；group-manage-owner.html；交互；SRC-USER-381
## 消息与社交 / 单聊设置 / chat-settings.html
页面入口：liveshow-proto/prototype/pages/user/social/chat-settings.html

- **REQ-66edbe31d587** 【正式规则】用户查看当前私信对象，设置该会话免打扰，或对聊天对象进行举报、拉黑。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；场景描述；SRC-USER-382
- **REQ-b02848ffd6b0** 【正式规则】聊天对象：展示当前私信对象的头像、昵称、等级与勋章。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；字段；SRC-USER-385
- **REQ-84cd5972d20a** 【正式规则】消息免打扰：控制该单聊通知，不影响消息收发。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；字段；SRC-USER-386
- **REQ-07d1d331e75b** 【正式规则】1. 消息免打扰仅关闭该单聊的消息通知，不影响消息收发。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；业务规则；SRC-USER-387
- **REQ-2a80e1b62785** 【正式规则】2. 拉黑后双方不能搜索、关注、申请好友、私信或进入对方主持的直播间。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；业务规则；SRC-USER-388
- **REQ-600d47ad00fd** 【正式规则】3. 拉黑会解除双方关注、好友和加入对方粉丝团的关系，使待处理好友申请失效，并删除双方私信会话和聊天记录；取消拉黑后不恢复。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；业务规则；SRC-USER-389
- **REQ-9ea07bd146dd** 【正式规则】拉黑 -> 显示确认弹窗；确认后执行并删除当前会话，取消不改变关系。举报 -> 进入当前账号的举报流程。
  来源：liveshow-proto/prototype/annotations/user.js；chat-settings.html；交互；SRC-USER-390
## 我的 / 黑名单管理 / blacklist-management.html
页面入口：liveshow-proto/prototype/pages/user/profile/blacklist-management.html

- **REQ-3560b2574e4f** 【正式规则】用户查看自己拉黑的账号，并通过确认操作取消拉黑。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；场景描述；SRC-USER-391
- **REQ-2df78e8bb05e** 【正式规则】黑名单用户：展示头像和昵称。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；字段；SRC-USER-394
- **REQ-1f877791fb70** 【正式规则】1. A 拉黑 B 后生成 A→B 的拉黑记录，B 进入 A 的黑名单；限制双向生效。若 B 另行拉黑 A，则两条记录分别取消。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-395
- **REQ-751406869dfa** 【正式规则】2. 拉黑后双向解除关注和好友关系，使待处理好友申请失效；双方加入对方粉丝团的关系和已有房管关系同步解除，粉丝团即对应粉丝群。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-396
- **REQ-0a0d3593195f** 【正式规则】3. 好友关系解除后，双方会话从私信列表删除并清空聊天记录。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-397
- **REQ-7a0b874eb963** 【正式规则】4. 拉黑期间双方不能搜索、关注、申请好友或私信；首页、分类、搜索和推荐不展示对方的直播间卡片。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-398
- **REQ-d20b10262dbd** 【正式规则】5. 双方不能进入对方主持的直播间；主播拉黑直播间内的对方时，对方立即退出。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-399
- **REQ-23b9731d40bc** 【正式规则】6. 双方处于同一第三方直播间时，不能查看对方主页或 @ 对方；处于同一第三方粉丝团时，不能点击查看对方主页。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-400
- **REQ-80008cfc0d32** 【正式规则】7. 取消拉黑仅解除当前拉黑记录，不恢复关注、好友、好友申请、粉丝团、房管、会话和聊天记录。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-401
- **REQ-14de5bab5a8a** 【正式规则】8. 平台管理员和有效巡房会话不受普通黑名单准入限制；巡房结束后恢复限制，原拉黑记录不删除。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-402
- **REQ-8bf90d3fcceb** 【正式规则】9. 数据范围：当前账号主动拉黑且尚未解除的账号，不列出仅拉黑了当前用户的账号。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-403
- **REQ-2e9fffbf12a8** 【正式规则】10. 按拉黑时间倒序排列，最新操作排在最前。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；业务规则；SRC-USER-404
- **REQ-139d25cdd142** 【正式规则】1. 从用户主页、主播主页或聊天设置点击拉黑 -> 显示确认弹窗；确认后执行并同步清理关系、会话和聊天记录，取消不改变状态。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；交互；SRC-USER-405
- **REQ-dc6b639e06cc** 【正式规则】2. 取消拉黑 -> 二次确认后从列表移除；请求失败 -> 保持原状态并提示“请求失败”。
  来源：liveshow-proto/prototype/annotations/user.js；blacklist-management.html；交互；SRC-USER-406
## 公会关系 / 公会中心 / guild-management.html
页面入口：liveshow-proto/prototype/pages/user/guild/guild-management.html

- **REQ-1f2adb7e81e1** 【正式规则】用户浏览公会、按公会名称或 ID 搜索，并选择公会填写入会申请；通过“我的”查看自己的公会关系和申请记录。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；场景描述；SRC-USER-407
- **REQ-1ecb9b85a4e9** 【正式规则】banner 图：后台配置。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；字段；SRC-USER-410
- **REQ-1edc36bdf8e1** 【正式规则】搜索关键词：按公会名称或 ID 模糊匹配；空值展示本页配置范围内全部公会。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；字段；SRC-USER-411
- **REQ-2850c1767d2d** 【正式规则】公会头像 / 名称 / ID：展示公会当前头像、名称和唯一标识。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；字段；SRC-USER-412
- **REQ-6adf279aab15** 【正式规则】公会简介：展示公会简介；超出单行的部分省略。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；字段；SRC-USER-413
- **REQ-b44c2d5d8f26** 【正式规则】主播人数：展示该公会的主播人数。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；字段；SRC-USER-414
- **REQ-41fd5cf0d936** 【正式规则】申请状态：申请、申请中或已入会；可用性遵循申请限制。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；字段；SRC-USER-415
- **REQ-b9e8f5290ba9** 【正式规则】1. 数据范围：展示平台后台配置为本页展示的公会；停用公会不展示、不可被搜索。示例数据的 5 条不代表数量上限。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；业务规则；SRC-USER-416
- **REQ-a925801a0b05** 【正式规则】2. 排序：沿用后台配置列表的顺序；搜索结果保持原有顺序，不按名称、ID 或主播人数重新排序。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；业务规则；SRC-USER-417
- **REQ-1cc6fed5c82d** 【正式规则】3. 搜索范围：在上述公会范围内按名称或 ID 模糊匹配；关键词为空时展示全部，包含已加入或申请中的公会。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；业务规则；SRC-USER-418
- **REQ-eaff5fb9d1cb** 【正式规则】4. 已加入公会或存在处理中入会申请时，不可再次申请其他公会。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；业务规则；SRC-USER-419
- **REQ-b2bd6abf1c0e** 【正式规则】1. 输入公会名称或 ID -> 实时筛选；点击搜索或按 Enter 结果一致；无匹配时展示空状态。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；交互；SRC-USER-420
- **REQ-7b9762e5e283** 【正式规则】2. 点击“申请” -> 携带所选公会进入填写申请单 P030-1；点击“我的” -> 进入我的公会 P032，查看公会关系和申请记录。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；交互；SRC-USER-421
- **REQ-5049e067986c** 【正式规则】3. 已加入公会或存在处理中入会申请时，申请按钮置灰，不可点击。
  来源：liveshow-proto/prototype/annotations/user.js；guild-management.html；交互；SRC-USER-422
## 公会关系 / 填写申请单 / guild-application-form.html
页面入口：liveshow-proto/prototype/pages/user/guild/guild-application-form.html

- **REQ-10b4fc8a94e3** 【正式规则】用户为所选公会填写姓名、电话并上传认证材料，提交入会申请。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；场景描述；SRC-USER-423
- **REQ-e2e049813326** 【正式规则】申请公会：来源于公会选择页，展示所选公会名称。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；字段；SRC-USER-426
- **REQ-c373504bd6ea** 【正式规则】姓名：必填，去除首尾空格后不能为空。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；字段；SRC-USER-427
- **REQ-a1ed479163ca** 【正式规则】电话：必填，使用 +62 印尼手机号。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；字段；SRC-USER-428
- **REQ-add5e105b1af** 【正式规则】本人照片：必填，仅上传图片。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；字段；SRC-USER-429
- **REQ-074e613f30ef** 【正式规则】证件类型：必选，使用单选框选择 KTP（印尼居民身份证）或 SIM（印尼驾驶证），默认选择 KTP。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；字段；SRC-USER-430
- **REQ-ba33f73617a5** 【正式规则】证件照片：正面、反面均必填，仅上传与所选证件类型对应的图片。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；字段；SRC-USER-431
- **REQ-37cbc6455740** 【正式规则】1. 数据范围：本次选择公会及当前用户填写的申请资料。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；业务规则；SRC-USER-432
- **REQ-172acb842562** 【正式规则】2. 同一用户只能存在一笔处理中入会申请，且只能加入一个公会。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；业务规则；SRC-USER-433
- **REQ-d39c26c44b13** 【正式规则】3. 提交后进入公会审核；公会同意后自动进入平台审核，无需用户重复提交。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；业务规则；SRC-USER-434
- **REQ-82c2e3b823f8** 【正式规则】4. 公会或平台驳回后，本次申请单结束；重新申请生成新单，重新由公会审核，公会通过后才进入平台审核。旧单的审核结果保留为历史，不继承到新单。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；业务规则；SRC-USER-435
- **REQ-323dde80f310** 【正式规则】1. 任一必填项未完成 -> 提交按钮不可用；切换证件类型 -> 清空已上传的证件正面和反面照片，需要重新上传。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；交互；SRC-USER-436
- **REQ-bad8f6fb0e31** 【正式规则】2. 提交成功 -> 生成处理中申请并进入公会详情。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；交互；SRC-USER-437
- **REQ-dd9f40619bbf** 【正式规则】3. 点击更换公会 -> 返回公会选择页。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-form.html；交互；SRC-USER-438
## 公会关系 / 我的公会 / guild-application-records.html
页面入口：liveshow-proto/prototype/pages/user/guild/guild-application-records.html

- **REQ-39ec2cb650c3** 【正式规则】用户查看自己申请过的公会及当前关系状态，进入公会详情查看入会、退出申请记录和处理结果。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；场景描述；SRC-USER-439
- **REQ-e4fe00ab5793** 【正式规则】公会头像：展示对应公会的头像。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；字段；SRC-USER-442
- **REQ-4a70c85b83b8** 【正式规则】公会名称：展示对应公会的当前名称。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；字段；SRC-USER-443
- **REQ-1aa0479bc347** 【正式规则】公会 ID：公会的唯一标识。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；字段；SRC-USER-444
- **REQ-eba4337f1fdd** 【正式规则】关系状态：展示当前账号与该公会的关系状态：申请中、已加入、已驳回或已退出。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；字段；SRC-USER-445
- **REQ-cb921566b6a2** 【正式规则】1. 数据范围：仅展示当前账号申请过的公会，包含申请中、已加入、申请被驳回及已退出的公会；历史记录不会因驳回或退出而移除。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；业务规则；SRC-USER-446
- **REQ-948c8b1a6937** 【正式规则】2. 展示单位：同一公会只展示一张卡片，多次入会、退出申请归入该公会详情。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；业务规则；SRC-USER-447
- **REQ-36a9ffbfb245** 【正式规则】3. 排序：按每个公会最近一次入会或退出申请的提交时间倒序排列，最近提交的在前。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；业务规则；SRC-USER-448
- **REQ-3e100a6bd5da** 【正式规则】4. 卡片展示当前公会关系状态；单笔申请的审核结果在详情中查看。退出申请被驳回时，仍保留已加入关系。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；业务规则；SRC-USER-449
- **REQ-e1d8e09f6bef** 【正式规则】点击公会卡片 -> 进入对应公会详情 P032-3，查看公会关系及申请时间轴。
  来源：liveshow-proto/prototype/annotations/user.js；guild-application-records.html；交互；SRC-USER-450
## 公会关系 / 公会详情 / guild-detail.html
页面入口：liveshow-proto/prototype/pages/user/guild/guild-detail.html

- **REQ-34c9fa777e58** 【正式规则】用户查看指定公会资料、当前关系和入会及退出申请时间轴，并在符合条件时申请退出。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；场景描述；SRC-USER-451
- **REQ-9bf15f3820f5** 【正式规则】公会头像 / 名称 / ID：展示所选公会的当前资料。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-454
- **REQ-ebb63dde04bf** 【正式规则】关系状态：当前账号与该公会的关系，不等同于单笔申请状态。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-455
- **REQ-1020d219d8da** 【正式规则】申请类型 / 状态：每条时间轴卡片展示加入或退出申请及其处理状态。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-456
- **REQ-8b6b89aac4b1** 【正式规则】提交时间：展示对应申请的提交时间，用于时间轴排序。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-457
- **REQ-dca1caffcc34** 【正式规则】处理时间：已处理且有处理时间时展示。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-458
- **REQ-888e2eaadfe7** 【正式规则】申请：展示该笔申请填写的原因；无内容时隐藏。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-459
- **REQ-069625c9e7d4** 【正式规则】驳回：申请被驳回且有驳回原因时展示。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-460
- **REQ-4eb845c0acb5** 【正式规则】姓名 / 电话：展开加入申请单的申请资料后，展示该笔申请提交时填写的姓名与电话，只读。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-461
- **REQ-70f0b04a2ddc** 【正式规则】本人照片：展示本次申请提交的本人照片材料。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-462
- **REQ-0ecd6ef481b8** 【正式规则】证件类型 / 正反面照片：展示申请时选择的 KTP 或 SIM 及对应正反面材料，只读。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；字段；SRC-USER-463
- **REQ-655a052e7f93** 【正式规则】1. 数据范围：当前账号与所选公会的关系及全部入会、退出申请。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；业务规则；SRC-USER-464
- **REQ-c634a48f93c8** 【正式规则】2. 排序：申请时间轴按提交时间倒序展示。最新排最前。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；业务规则；SRC-USER-465
- **REQ-b2bd124d4b62** 【正式规则】3. 公会与平台依次审核；公会通过后自动进入平台审核，无需用户再次提交。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；业务规则；SRC-USER-466
- **REQ-f890afba57e5** 【正式规则】4. 退会通过或被公会移除 -> 退出公会并失去主播身份；直播权限同步失效。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；业务规则；SRC-USER-467
- **REQ-05c67c3ed329** 【正式规则】5. 同页提供入会申请中、已加入、入会已驳回、退会申请中、退会已驳回、已退出六个视图。退会申请中或被驳回时，公会关系仍为已加入；退会通过后才变为已退出。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；业务规则；SRC-USER-468
- **REQ-bf514b5e5019** 【正式规则】6. 所有视图中的加入申请单均保留该笔申请的资料快照，不受审核状态或当前公会关系影响；资料只读，不随个人资料后续变更。图片以材料占位展示，不显示文件名。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；业务规则；SRC-USER-469
- **REQ-e70124732d4d** 【正式规则】1. 已加入且无处理中退会申请 -> 展示“申请退出”，点击进入退出申请页；其他状态不展示该入口。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；交互；SRC-USER-470
- **REQ-9ef443fd37de** 【正式规则】2. 点击返回 -> 进入我的公会 P032。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；交互；SRC-USER-471
- **REQ-abe8541b9a0e** 【正式规则】3. 每张加入申请单的申请资料默认收起；点击“申请资料”展开，再次点击收起，各申请单独立控制。
  来源：liveshow-proto/prototype/annotations/user.js；guild-detail.html；交互；SRC-USER-472
## 公会关系 / 申请退出公会 / guild-leave-application.html
页面入口：liveshow-proto/prototype/pages/user/guild/guild-leave-application.html

- **REQ-3781b18cb528** 【正式规则】已加入公会的用户填写退会原因，提交退出当前公会的申请。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；场景描述；SRC-USER-473
- **REQ-449c52680d03** 【正式规则】当前公会：来源于当前有效公会关系，只读。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；字段；SRC-USER-476
- **REQ-f9818da01bef** 【正式规则】退会原因：必填，去除首尾空格后不能为空。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；字段；SRC-USER-477
- **REQ-dd781919a064** 【正式规则】1. 同一时间只能存在一笔处理中退会申请。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；业务规则；SRC-USER-478
- **REQ-c20eeded10d6** 【正式规则】2. 公会驳回 -> 保留公会关系和主播身份，可重新提交。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；业务规则；SRC-USER-479
- **REQ-552ffe98a013** 【正式规则】3. 退会申请通过或被公会移出 -> 立即结束当前直播、退出公会并失去主播身份；主播创建的粉丝团立即解散，所有成员的团籍和群聊权限解除，粉丝等级和亲密度清零。以后重新认证成为主播时，需重新创建粉丝团。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；业务规则；SRC-USER-480
- **REQ-2d5808ee1052** 【正式规则】4. 数据范围：当前账号已加入的公会及本次退出原因；不得为其他用户或无关系公会提交退出。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；业务规则；SRC-USER-481
- **REQ-b07fa631b1b0** 【正式规则】退会原因为空 -> 提交按钮不可用；填写有效原因后按钮可用；提交成功 -> 生成处理中申请。
  来源：liveshow-proto/prototype/annotations/user.js；guild-leave-application.html；交互；SRC-USER-482
## 消息与社交 / 用户主页 / user-home.html
页面入口：liveshow-proto/prototype/pages/user/social/user-home.html

- **REQ-4f9437273de1** 【正式规则】用户查看指定账号的资料、社交数据及加入的粉丝团，并进行关注、加好友、私信、举报或拉黑。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；场景描述；SRC-USER-483
- **REQ-2bf36b331c84** 【正式规则】用户资料：展示头像、昵称、用户 ID、签名和有效装扮。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；字段；SRC-USER-486
- **REQ-3f14c9bc62a5** 【正式规则】粉丝/关注：粉丝数为当前仍关注该用户的账号数；关注数为该用户当前仍关注的账号数。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；字段；SRC-USER-487
- **REQ-14cfb05bd7a5** 【正式规则】送出：累计成功赠送的有效礼物消费。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；字段；SRC-USER-488
- **REQ-55bfe3180d5c** 【正式规则】关系状态：分别展示关注、好友和拉黑状态。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；字段；SRC-USER-489
- **REQ-8185eb3f1eda** 【正式规则】1. 粉丝数为关注该用户的账号数；关注数为该用户关注的账号数；送出为累计成功赠送的礼物价值。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；业务规则；SRC-USER-490
- **REQ-ce82731976c5** 【正式规则】2. 关注关系与好友关系分别维护。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；业务规则；SRC-USER-491
- **REQ-0fa367996b15** 【正式规则】3. 拉黑后解除双方关注、好友和加入对方粉丝团的关系，待处理好友申请失效，并删除双方私信会话和聊天记录；取消拉黑后不恢复。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；业务规则；SRC-USER-492
- **REQ-8fec17f7d1fc** 【正式规则】4. 数据范围：当前查看对象的资料、社交统计和已加入粉丝团；粉丝团按本次加入时间倒序。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；业务规则；SRC-USER-493
- **REQ-53d05a4a79aa** 【正式规则】1. 关注或取消关注成功 -> 同步更新关系状态和计数。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；交互；SRC-USER-494
- **REQ-47f70d2f770d** 【正式规则】2. 删除好友确认 -> 解除好友关系并清空双方聊天记录。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；交互；SRC-USER-495
- **REQ-de6b0276ede6** 【正式规则】3. 拉黑 -> 显示确认弹窗；确认后执行并切换为拉黑状态，取消不改变关系。
  来源：liveshow-proto/prototype/annotations/user.js；user-home.html；交互；SRC-USER-496
## 消息与社交 / 主播主页 / host-home.html
页面入口：liveshow-proto/prototype/pages/user/social/host-home.html

- **REQ-a7b588eaaf63** 【正式规则】用户查看指定主播的资料与社交数据，进入其直播间、粉丝团、礼物展馆或贡献榜。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；场景描述；SRC-USER-497
- **REQ-c0818a907211** 【正式规则】主播资料：展示账号资料、主播等级、财富等级和当前开播状态。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；字段；SRC-USER-500
- **REQ-8bcc2f70dcb0** 【正式规则】粉丝/关注/观众：粉丝数为当前仍关注该主播的账号数；关注数为该主播当前仍关注的账号数；观众按历史直播场次累计。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；字段；SRC-USER-501
- **REQ-4f1cbe1f95c6** 【正式规则】礼物展馆：展示已收礼物种类数和历史成功收到数量。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；字段；SRC-USER-502
- **REQ-7e9d73bca365** 【正式规则】粉丝团：展示团名称、等级、成员数及当前用户团籍。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；字段；SRC-USER-503
- **REQ-c773181a40f7** 【正式规则】关系状态：分别展示关注、好友、拉黑和私信权限。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；字段；SRC-USER-504
- **REQ-e681a58e066a** 【正式规则】1. 主播等级与财富等级分别计算，不共用等级值；等级门槛由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；业务规则；SRC-USER-505
- **REQ-684f5bc31a0f** 【正式规则】2. 直播中才提供当前直播场次入口。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；业务规则；SRC-USER-506
- **REQ-c4c66a612fa6** 【正式规则】3. 拉黑后解除双方关注、好友和加入对方粉丝团的关系，删除双方私信会话和聊天记录，且不能进入该主播直播间；取消拉黑后不恢复。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；业务规则；SRC-USER-507
- **REQ-ad78fae47b29** 【正式规则】4. 粉丝团团籍和群籍同步；退出或被移出后等级与亲密度清零。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；业务规则；SRC-USER-508
- **REQ-34e12ed2d16f** 【正式规则】5. 运营账号不能加入粉丝团，不展示加入入口。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；业务规则；SRC-USER-509
- **REQ-b799320906d1** 【正式规则】6. 数据范围：当前查看主播的资料、历史统计和当前直播状态；不会汇总其他主播数据。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；业务规则；SRC-USER-510
- **REQ-cbf01ddc2ce1** 【正式规则】1. 普通用户已加入粉丝团 -> 进入贡献榜；未加入 -> 打开加入粉丝团视图；运营账号不展示加入入口。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；交互；SRC-USER-511
- **REQ-8e273f2007fd** 【正式规则】2. 好友可直接私信；非好友最多发送 3 条私信。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；交互；SRC-USER-512
- **REQ-7e55ca4e6ece** 【正式规则】3. 拉黑 -> 显示确认弹窗；确认后执行并切换为拉黑状态，取消不改变关系。
  来源：liveshow-proto/prototype/annotations/user.js；host-home.html；交互；SRC-USER-513
## 消息与社交 / 主播礼物展馆 / host-gift-gallery.html
页面入口：liveshow-proto/prototype/pages/user/social/host-gift-gallery.html

- **REQ-8143abc36b37** 【正式规则】用户查看指定主播累计收到的礼物、各礼物数量及尚未收到的礼物。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；场景描述；SRC-USER-514
- **REQ-cbca7a0d5cdb** 【正式规则】累计收到：当前主播累计收到的礼物件数。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；字段；SRC-USER-517
- **REQ-e119449ab46b** 【正式规则】礼物图标 / 名称：展示礼物目录中的礼物。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；字段；SRC-USER-518
- **REQ-28245a39d420** 【正式规则】收到数量：按当前主播展示对应礼物的收到数量；没有记录时显示未收到。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；字段；SRC-USER-519
- **REQ-b7fb64758b88** 【正式规则】1. 只统计成功礼物记录；失败或撤销记录不计入。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；业务规则；SRC-USER-520
- **REQ-b10390f6b485** 【正式规则】2. 礼物下架后不再接收，但历史收到数量和图鉴记录保留。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；业务规则；SRC-USER-521
- **REQ-a851490af66d** 【正式规则】3. 幸运礼物按礼物个数计入收到数量；对应主播收益 = 送出价值 × 后台比例，默认 1%，返奖不影响收益。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；业务规则；SRC-USER-522
- **REQ-7a0f6dc99def** 【正式规则】4. 数据范围：平台礼物目录与当前查看主播的收礼数量；未收到的礼物也展示。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；业务规则；SRC-USER-523
- **REQ-7a0d28f88831** 【正式规则】5. 排序：沿用礼物目录的配置顺序。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；业务规则；SRC-USER-524
- **REQ-1221f279d0cb** 【正式规则】点击返回 -> 回到对应主播主页。
  来源：liveshow-proto/prototype/annotations/user.js；host-gift-gallery.html；交互；SRC-USER-525
## 我的 / 我的粉丝团 / my-fan-clubs.html
页面入口：liveshow-proto/prototype/pages/user/fan-club/my-fan-clubs.html

- **REQ-d3c3feb9570b** 【正式规则】用户查看当前已加入的粉丝团及个人团内数据，进入对应粉丝群、贡献榜或主播直播间。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；场景描述；SRC-USER-526
- **REQ-8f7db9a3169a** 【正式规则】主播头像 / 主播昵称：该粉丝团所属主播的头像与昵称。头像本身不跳转；直播标记为独立入口。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-529
- **REQ-920beb44210f** 【正式规则】粉丝团名称：当前粉丝团名称。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-530
- **REQ-0677e72606b3** 【正式规则】团等级（团 Lv.n）：粉丝团整体等级，按该团累计收礼金币匹配后台粉丝团等级配置，不含运营号虚拟金币。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-531
- **REQ-a162f5102aa8** 【正式规则】加入日期：当前用户本次加入该粉丝团的日期；重新入团后更新为本次入团日期。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-532
- **REQ-5e858732d1b6** 【正式规则】直播标记：所属主播直播中时显示；未开播时隐藏。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-533
- **REQ-81e69fbf6d3b** 【正式规则】群聊：进入当前卡片对应粉丝群的操作入口，不是群聊数量。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-534
- **REQ-74b6f65f0732** 【正式规则】粉丝等级：当前用户对该主播的个人粉丝等级，仅按本次有效团籍期间的送礼贡献匹配后台配置；退团后清零，重新入团从 0 开始。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-535
- **REQ-7df43fc2a387** 【正式规则】亲密度：加入粉丝团后最近 30 天的有效观看分钟数 × 10；仅统计 App 前台、直播间可见且正常播放的时长，切后台、锁屏、暂停或断网时停止，恢复播放后继续；退出后重新加入，从 0 开始计算。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-536
- **REQ-dcfbbae26a94** 【正式规则】总贡献：当前用户给该主播累计刷出的贡献，入团前、入团后、退团期间及重新入团后的都算；以礼物成功送达为准，不含运营号虚拟金币。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-537
- **REQ-8853c15bb6e2** 【正式规则】贡献榜头像：展示本周贡献榜前三名用户头像，按排名顺序排列；不足三人按实际人数展示，至少展示 1 个头像，即自己。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-538
- **REQ-bef1b10b2fb4** 【正式规则】我的排名：当前用户在该主播粉丝团本周贡献榜中的名次，与贡献榜头像使用相同统计范围。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；字段；SRC-USER-539
- **REQ-190faef064f8** 【正式规则】1. 一张卡片对应一个当前有效团籍；团籍与群籍同步。退出、被移出或粉丝团解散后，移除对应卡片并解除群聊权限。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-540
- **REQ-ec21373e248a** 【正式规则】2. 主动退出或被移出不影响关注，但粉丝等级和亲密度清零，重新加入从 0 开始；历史贡献保留，重新加入后继续计入总贡献和对应周期榜单。拉黑主播会同步解除团籍和关注关系。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-541
- **REQ-cfe9b5f5b3db** 【正式规则】3. 团等级和个人粉丝等级使用各自后台配置，不可互用。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-542
- **REQ-7d7d2434d0e5** 【正式规则】4. 卡片贡献榜只展示当前有效团籍成员，按本周内给当前主播刷出的全部贡献排名，不按入团时间截断；只要给当前主播刷的都算。退团后不展示，重新入团后恢复对应周期内的贡献统计；运营号及其虚拟金币不计入。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-543
- **REQ-b1e24d4217ac** 【正式规则】5. 粉丝团按当前用户本次加入时间倒序排列，最新加入的排在最前。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-544
- **REQ-b92d5b15ccb1** 【正式规则】6. 无有效团籍时，显示占位图和「暂未加入粉丝团」，不显示粉丝团卡片；查看器「视图-空白」可演示。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-545
- **REQ-a4ddd4d12019** 【正式规则】7. 未进入贡献榜时显示「未上榜」；数值缺失时显示 0。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；业务规则；SRC-USER-546
- **REQ-fec1b88773ba** 【正式规则】1. 点击「群聊」进入该粉丝团群聊；点击贡献榜整行进入该主播粉丝团的本周贡献榜；点击头像上的直播标记进入该主播当前直播间；返回进入「我的」P019。
  来源：liveshow-proto/prototype/annotations/user.js；my-fan-clubs.html；交互；SRC-USER-547
## 我的 / 贡献榜 / fan-contribution-ranking.html
页面入口：liveshow-proto/prototype/pages/user/fan-club/fan-contribution-ranking.html

- **REQ-32396ffb570b** 【正式规则】用户查看指定主播粉丝团的本周、本月或累计贡献榜，以及自己的贡献和排名。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；场景描述；SRC-USER-548
- **REQ-57814f9983a5** 【正式规则】周期：默认本月；按平台业务时区计算，本周从周一 00:00 开始，本月从每月 1 日 00:00 开始，累计统计全部历史有效贡献。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；字段；SRC-USER-551
- **REQ-3af2bfd016aa** 【正式规则】贡献值：贡献值 = 当前用户在所选周期内向该主播成功送出的各礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减贡献值；运营账号不进入任何榜单或排行，其虚拟金币贡献不计入。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；字段；SRC-USER-552
- **REQ-54ebe2780e5b** 【正式规则】排名：依次按贡献值、当前主播粉丝团内的粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；字段；SRC-USER-553
- **REQ-48fc4cb314c4** 【正式规则】榜单数量：完成全部排序后显示前 99 名；第 99 名与第 100 名贡献值相同时，继续按后续条件确定顺序。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；字段；SRC-USER-554
- **REQ-d878cbc52877** 【正式规则】我的排名：底部置底显示自己的排名和贡献值。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；字段；SRC-USER-555
- **REQ-ca2b0e4e7737** 【正式规则】1. 粉丝等级和财富等级最低均为 1 级。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；业务规则；SRC-USER-556
- **REQ-940a4ef0b2e3** 【正式规则】2. 失败或撤销的赠送不计入贡献。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；业务规则；SRC-USER-557
- **REQ-3058258e3a66** 【正式规则】3. 账号注销后保留历史数值，名称显示“账号已注销”，不可进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；业务规则；SRC-USER-558
- **REQ-315fe79ab8e6** 【正式规则】4. 榜单只展示当前有效团籍成员；运营账号不能加入粉丝团，也不进入任何榜单或排行。本周、本月和累计贡献都不按入团时间截断，只要给当前主播刷的都算。退团后不展示，重新入团后恢复对应周期内的历史贡献。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；业务规则；SRC-USER-559
- **REQ-4e109b642f03** 【正式规则】切换周期 -> 同步更新前三名、完整榜单和我的排名；点击用户 -> 进入对应主页。
  来源：liveshow-proto/prototype/annotations/user.js；fan-contribution-ranking.html；交互；SRC-USER-560
## 主播中心 / 主播中心 / host-center.html
页面入口：liveshow-proto/prototype/pages/user/host/host-center.html

- **REQ-d48c3ac9114b** 【正式规则】主播查看个人资料、累计数据及今日/本月直播指标，进入主播工具。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；场景描述；SRC-USER-561
- **REQ-7c5142479027** 【正式规则】头像 / 昵称：当前主播账号的头像和昵称。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-564
- **REQ-13b8f8473155** 【正式规则】主播等级：昵称旁 Lv.n 为主播等级，按后台主播等级配置匹配分成前累计收益，不含运营号金币；不是财富等级。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-565
- **REQ-0113fe9800e8** 【正式规则】主播 ID：当前主播账号的唯一 ID。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-566
- **REQ-c8230f90cd65** 【正式规则】公会名称：当前所属公会名称；点击进入「我的公会」。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-567
- **REQ-a2798f39d6d1** 【正式规则】累计收益：当前主播历史累计收益，单位为金币；不随今日/本月切换，不是可提现余额。收益计入口径与数据中心一致。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-568
- **REQ-59fdf2456d37** 【正式规则】粉丝：当前关注该主播的用户数，单位为人；不是粉丝团成员数，也不是本期涨粉数。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-569
- **REQ-a519d6897093** 【正式规则】直播权限提示：权限关闭时显示「直播权限已关闭，请联系公会」；正常时不显示。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；主播信息字段；SRC-USER-570
- **REQ-8229e0363a0e** 【正式规则】统计周期：默认今日，可切换本月；今日为当前自然日，本月为当前自然月截至当前时间，按平台业务时区计算。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-573
- **REQ-0d86d0a94e39** 【正式规则】收益（今日） / 累计收益（本月）：所选周期内主播收益，单位为金币。普通/定制礼物及门票按成功支付金币汇总；幸运礼物按送出价值 × 后台比例计算，默认 1%；虚拟金币、失败或撤销消费不计入。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-574
- **REQ-25b38938479b** 【正式规则】时长：仅今日显示，表示当日累计直播时长，以小时、分钟展示；与下方有效直播时长分别统计。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-575
- **REQ-a80b7613a890** 【正式规则】有效天数：仅本月显示，表示本月达标自然日数量；单日累计有效直播满 3 小时计 1 天，每日最多计 1 天。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-576
- **REQ-b7b91d39103c** 【正式规则】观众人数：按所选今日或本月范围去重统计观众人数；同一用户在该周期内重复进入或观看多场直播只计 1 人。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-577
- **REQ-fd95d20f0cb3** 【正式规则】涨粉：所选今日或本月范围内的新增粉丝人数，不扣除取关人数，单位为人。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-578
- **REQ-019ce43757a6** 【正式规则】当日有效天进度：仅今日显示：当日累计有效直播时长 / 3h；进度条按两者比值展示，最高 100%。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-579
- **REQ-042b3215a51c** 【正式规则】有效天达标标记：满 3 小时后在「当日有效天」标题后显示 ✅；未达标时不显示标记。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-580
- **REQ-2fd462dd65f2** 【正式规则】数据中心入口：进入直播数据页，查看收益、时长、观众和粉丝等指标。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；数据中心字段；SRC-USER-581
- **REQ-3437b6f2b77c** 【正式规则】1. 主播身份和直播权限分别管理；账号可用、公会有效、主播认证通过且直播权限开启时才可开播。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；业务规则；SRC-USER-582
- **REQ-ea193f02002d** 【正式规则】2. 本页仅展示当前主播的数据；顶部历史累计收益、当前粉丝数与数据中心的周期指标分开统计。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；业务规则；SRC-USER-583
- **REQ-48c213d72b3a** 【正式规则】1. 切换今日/本月更新四项周期指标；本月隐藏当日有效天进度。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；交互；SRC-USER-584
- **REQ-ba292625292c** 【正式规则】2. 点击开始直播再次校验权限，通过后进入开播设置；权限关闭时弹窗提示「直播权限已关闭，请联系公会」，点击「知道了」关闭并留在当前页。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；交互；SRC-USER-585
- **REQ-717f12734eeb** 【正式规则】3. 粉丝列表、粉丝团管理、房管管理、分成记录分别进入对应页面；公会名称及公会管理进入「我的公会」。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；交互；SRC-USER-586
- **REQ-b807580c78cb** 【正式规则】4. 公会通知进入通知列表；角标为当前未读通知数量，0 条时隐藏。直播记录入口当前原型以提示代替跳转。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；交互；SRC-USER-587
- **REQ-0763cecd7068** 【正式规则】1. 仅统计正常推流时长，暂停或断流期间不计；跨自然日按平台业务时区拆分，数据在 5 分钟内更新。
  来源：liveshow-proto/prototype/annotations/user.js；host-center.html；有效直播时长；SRC-USER-588
## 主播中心 / 房管管理 / moderator-management.html
页面入口：liveshow-proto/prototype/pages/user/host/moderator-management.html

- **REQ-da22572e83e0** 【正式规则】主播查看当前房管，按用户 ID 搜索添加房管，或取消已有房管授权。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；场景描述；SRC-USER-589
- **REQ-0a6ff1916fd6** 【正式规则】房管：展示头像、昵称、用户 ID 和授权状态。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；字段；SRC-USER-592
- **REQ-eb7e57bba37e** 【正式规则】房管数量：最多 3 人，按当前长期授权关系统计。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；字段；SRC-USER-593
- **REQ-d1e61ae197bb** 【正式规则】1. 目标不得在该主播直播间黑名单内，且双方无账号拉黑关系。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；业务规则；SRC-USER-594
- **REQ-bb5de0b81123** 【正式规则】2. 已授权后任一方建立账号拉黑关系，房管身份自动解除；取消拉黑后不自动恢复。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；业务规则；SRC-USER-595
- **REQ-335345631585** 【正式规则】3. 授权长期有效，直至主播取消或双方建立账号拉黑关系；场次结束不清除。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；业务规则；SRC-USER-596
- **REQ-058c8d10efbd** 【正式规则】4. 房管可在直播间禁言、踢出和屏蔽单条评论。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；业务规则；SRC-USER-597
- **REQ-1e7cd4c1af37** 【正式规则】5. 数据范围：当前主播仍有效的房管授权；默认按授权时间倒序。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；业务规则；SRC-USER-598
- **REQ-0be527cc2d92** 【正式规则】搜索仅返回未在该直播间黑名单、双方无账号拉黑关系且当前非房管的用户；房管达到 3 人时保留添加入口，点击不执行并提示“已达3人上限”；取消房管 -> 二次确认后立即撤销权限并更新列表；因拉黑自动解除 -> 立即移出房管列表并更新人数。
  来源：liveshow-proto/prototype/annotations/user.js；moderator-management.html；交互；SRC-USER-599
## 主播中心 / 公会通知 / host-guild-notifications.html
页面入口：liveshow-proto/prototype/pages/user/host/host-guild-notifications.html

- **REQ-671eb11e822c** 【正式规则】主播查看公会通知的文字或图片内容，并在当前列表展开长内容。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；场景描述；SRC-USER-600
- **REQ-c4f4aacabc1f** 【正式规则】通知标题：展示公会发布的通知标题。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；字段；SRC-USER-603
- **REQ-b5037c115075** 【正式规则】通知内容 / 图片：支持纯文字和图片加文字；长内容可在卡片内展开。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；字段；SRC-USER-604
- **REQ-29e666f003dc** 【正式规则】未读标记：未读通知标题旁展示提示点。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；字段；SRC-USER-605
- **REQ-e83a506620db** 【正式规则】发送时间：展示公会实际发送通知的时间。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；字段；SRC-USER-606
- **REQ-193f4b9a8325** 【正式规则】1. 仅展示当前公会向该主播发送的有效通知；退会后不再接收新通知。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；业务规则；SRC-USER-607
- **REQ-9cd00b937b3d** 【正式规则】2. 默认按发送时间倒序。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；业务规则；SRC-USER-608
- **REQ-2d4dbab50dd6** 【正式规则】长内容在当前卡片展开或收起，不进入详情页；首次展开或进入列表后更新已读状态和未读数。
  来源：liveshow-proto/prototype/annotations/user.js；host-guild-notifications.html；交互；SRC-USER-609
## 我的 / 申请成为主播 / host-center-pending.html
页面入口：liveshow-proto/prototype/pages/user/host/host-center-pending.html

- **REQ-17d190677a53** 【正式规则】用户无主播身份，点击「主播中心」、「开播」，会进入到申请页。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；场景描述；SRC-USER-610
- **REQ-043a90f7702a** 【正式规则】banner 图：图片由后台上传。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；字段；SRC-USER-613
- **REQ-2b1c4fd4bb18** 【正式规则】申请步骤：使用时间线依次展示申请加入、公会审核、平台审核、成为主播。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；字段；SRC-USER-614
- **REQ-407af5fbf617** 【正式规则】公会名称：在公会审核中和平台审核中展示对应公会名称。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；字段；SRC-USER-615
- **REQ-9947e05d6361** 【正式规则】审核结果 / 时间：通过或驳回由步骤符号表示，不重复显示状态文字；下方显示通过时间或驳回时间。审核中和未开始不显示时间。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；字段；SRC-USER-616
- **REQ-e2133a44839a** 【正式规则】步骤状态 / 操作：未提交时，申请加入行显示“去加入”；提交后在该行展示提交时间和可展开的申请资料，不显示按钮。公会审核或平台审核只有驳回时才显示“重新申请”。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；字段；SRC-USER-617
- **REQ-b6dfb2162d93** 【正式规则】页面提示：说明当前审核阶段及后续可执行动作；公会或平台驳回均提示重新申请，可查看原因并修改资料。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；字段；SRC-USER-618
- **REQ-d9d345f8fd7f** 【正式规则】1. 公会审核通过后，自动进入平台审核节点，无需用户再次提交。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；业务规则；SRC-USER-619
- **REQ-f875a4334d0f** 【正式规则】2. 公会审核中：直播权限仍未申请；点击“审核中”查看公会申请记录。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；业务规则；SRC-USER-620
- **REQ-296a2ccdad29** 【正式规则】3. 公会驳回：本次申请单结束，展示驳回状态和原因；可重新选择公会并提交新单，平台审核不开始。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；业务规则；SRC-USER-621
- **REQ-87dc16af1c55** 【正式规则】4. 公会通过后自动进入平台审核；公会显示“已通过”，平台显示“审核中”，不能重复提交或开播。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；业务规则；SRC-USER-622
- **REQ-89cd24a6a436** 【正式规则】5. 平台驳回：本次申请单结束；旧单公会通过和平台驳回的记录只读保留。“重新申请”生成新单，从公会审核开始，不沿用旧单的通过结果。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；业务规则；SRC-USER-623
- **REQ-ef30ef06e0fd** 【正式规则】6. 平台审核通过后即成为主播，时间线最终节点显示已完成，不展示操作按钮。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；业务规则；SRC-USER-624
- **REQ-86f5be53b76b** 【正式规则】1. 点击“申请资料”在当前步骤展开或收起；“去加入”以及公会或平台驳回后的“重新申请”进入公会选择页，修改并提交新申请资料后重新由公会审核。
  来源：liveshow-proto/prototype/annotations/user.js；host-center-pending.html；交互；SRC-USER-625
## 主播中心 / 开播设置 / start-live-settings.html
页面入口：liveshow-proto/prototype/pages/user/host/start-live-settings.html

- **REQ-b4affbf2b6fd** 【正式规则】主播设置本场直播封面、主题、分类、房型、美颜及访问范围，并开始直播。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；场景描述；SRC-USER-626
- **REQ-a25bbb0d3d76** 【正式规则】封面：选填，仅上传图片；属于本次直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-629
- **REQ-807b9b7e9e84** 【正式规则】直播主题：最多 40 个字符；属于本次直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-630
- **REQ-b605e04a7d15** 【正式规则】分类：必选，选项由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-631
- **REQ-eae70e8ccbf2** 【正式规则】房型：必选，可选普通房、门票房、密码房；可用范围受平台开关控制。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-632
- **REQ-a9f847cb6817** 【正式规则】门票价格：门票房必选；后台已启用的价格档位全部平铺展示，只能单选；仅对本次直播场次生效。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-633
- **REQ-ab2a6fbfb801** 【正式规则】房间密码：密码房必填，必须为 4-12 个数字；仅对本次直播场次生效。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-634
- **REQ-3f9a27a952f4** 【正式规则】在广场展示：开启后在首页热门区域展示，关闭后不展示；无历史时默认开启。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-635
- **REQ-bef4c4dc66c8** 【正式规则】仅粉丝团成员可进入直播间：仅密码房展示。默认读取上次确认值；无历史时默认关闭。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；字段；SRC-USER-636
- **REQ-49ff7511e45a** 【正式规则】1. 账号可用、公会有效、主播认证通过且直播权限开启时才可开播；直播中权限被关闭 -> 立即结束当前场次。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-637
- **REQ-332bc7a429a3** 【正式规则】2. 每次开播创建新的直播场次；主题、封面、分类、房型、门票和密码均保存到本场，不覆盖历史场次。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-638
- **REQ-b1c8b7d023e2** 【正式规则】3. 仅普通房支持双主播连麦；门票房和密码房不支持连麦。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-639
- **REQ-e0ffc77743dc** 【正式规则】4. 开播需要相机和麦克风权限；不增加产品说明弹窗，首次使用时直接调用系统权限弹窗。开发需配置系统权限用途文案：“用于拍摄直播画面”“用于采集直播声音”。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-640
- **REQ-26d42a45bee5** 【正式规则】5. 上传封面使用系统照片选择器，仅读取用户选中的图片，不申请完整相册权限。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-641
- **REQ-e471d952a9bc** 【正式规则】6. “在广场展示”仅控制是否在首页热门区域展示，不参与任何用户准入或拦截判断。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-642
- **REQ-8d0100356511** 【正式规则】7. 开启“仅粉丝团成员可进入直播间”后，只有当前有效粉丝团成员可继续输入密码；非成员不可进入。主播未创建粉丝团时不可开启。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-643
- **REQ-5a448a325d76** 【正式规则】8. 两个开关在确认房型后保存为下次默认值；首次使用默认“在广场展示”开启、成员限制关闭。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；业务规则；SRC-USER-644
- **REQ-61318af1f7a5** 【正式规则】1. 选择门票房时，平铺展示后台已启用的门票价格档位，用户单选；未选择或档位已停用时不保存并提示“请选择有效的门票价格”。密码必须为 4-12 个数字；无效时保留输入并提示“密码必须是4-12个数字”。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；交互；SRC-USER-645
- **REQ-c34aef5219c4** 【正式规则】2. 恢复默认美颜 -> 清空当前选中项并将全部参数重置为 50。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；交互；SRC-USER-646
- **REQ-7f0adf55e85c** 【正式规则】3. 点击开始直播 -> 开播条件和场次字段校验通过后检查相机、麦克风权限；未申请时直接调用系统授权，已授权时创建新场次并显示 3 秒开播倒计时，倒计时结束后进入【直播间-主播视角】。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；交互；SRC-USER-647
- **REQ-c92730baa9aa** 【正式规则】4. 相机或麦克风权限被拒绝 -> 停留当前页，提示“权限未开启，请前往系统设置”，提供“取消、前往设置”。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；交互；SRC-USER-648
- **REQ-8db27934732a** 【正式规则】5. 点击修改封面 -> 直接打开系统照片选择器；取消选择时保留原封面。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；交互；SRC-USER-649
- **REQ-9579f4aa8f7b** 【正式规则】6. 切换两个访问开关后点击确认 -> 保存本场配置和下次默认值；关闭抽屉或点击遮罩 -> 不保存修改。
  来源：liveshow-proto/prototype/annotations/user.js；start-live-settings.html；交互；SRC-USER-650
## 主播中心 / 粉丝列表 / fan-list.html
页面入口：liveshow-proto/prototype/pages/user/host/fan-list.html

- **REQ-fe513b0ddaaa** 【正式规则】主播查看关注自己的粉丝资料，并点击粉丝进入对应用户主页。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；场景描述；SRC-USER-651
- **REQ-f8ed250c667f** 【正式规则】粉丝：仅展示当前仍关注该主播的用户。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；字段；SRC-USER-654
- **REQ-ae6ed73ebb47** 【正式规则】财富等级：按用户账号有效消费成长值计算。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；字段；SRC-USER-655
- **REQ-499e5e38b399** 【正式规则】装扮：展示当前已穿戴且有效的一个代表性装扮；过期后移除。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；字段；SRC-USER-656
- **REQ-bc4aaec95493** 【正式规则】1. 取消关注或拉黑主播后立即从粉丝列表移除；粉丝关系与好友、粉丝团关系分别维护。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；业务规则；SRC-USER-657
- **REQ-3175b7368c7c** 【正式规则】2. 数据范围：当前仍关注该主播的用户；默认按关注时间倒序。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；业务规则；SRC-USER-658
- **REQ-f94714b11f03** 【正式规则】点击用户 -> 进入对应用户主页；列表随新增关注和关系解除实时更新。
  来源：liveshow-proto/prototype/annotations/user.js；fan-list.html；交互；SRC-USER-659
## 主播中心 / 粉丝团 / fan-club.html
页面入口：liveshow-proto/prototype/pages/user/host/fan-club.html

- **REQ-3c8eb26865ba** 【正式规则】主播查看粉丝团成员和贡献，切换成员排序、移除成员或进入粉丝团设置。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；场景描述；SRC-USER-660
- **REQ-33370591728d** 【正式规则】成员：展示头像、昵称、粉丝等级、亲密度和加入时间。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；字段；SRC-USER-663
- **REQ-e69be25ca77e** 【正式规则】成员数：按当前有效团籍统计，上限 500 人。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；字段；SRC-USER-664
- **REQ-574952171f60** 【正式规则】加入条件：展示当前关注和累计贡献门槛。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；字段；SRC-USER-665
- **REQ-7acf9cdc656e** 【正式规则】1. 加入条件由主播配置；一期每位主播仅一个粉丝团，满 500 人拒绝新成员。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；业务规则；SRC-USER-666
- **REQ-1da9b601c77a** 【正式规则】2. 移除成员后团籍和群籍同步解除；不影响关注，粉丝等级与亲密度清零，重新加入从 0 开始。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；业务规则；SRC-USER-667
- **REQ-0b30a90199cd** 【正式规则】3. 数据范围：当前主播粉丝团的有效成员。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；业务规则；SRC-USER-668
- **REQ-6d45f8a2a3e0** 【正式规则】4. 排序：默认按给当前主播刷出的全部历史贡献从高到低；“本月最多”按本月内的全部贡献从高到低；“最新加入”按加入时间从新到旧；数值或时间相同时按用户 ID 升序。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；业务规则；SRC-USER-669
- **REQ-074a6beb770c** 【正式规则】1. 切换累计最多、本月最多或最新加入 -> 按对应规则重新排列当前成员。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；交互；SRC-USER-670
- **REQ-7343342ce64f** 【正式规则】2. 单人禁言 -> 二次确认后限制该成员群内发言；左滑成员 -> 显示移除操作，确认移除后更新成员数、群聊权限和用户身份。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；交互；SRC-USER-671
- **REQ-501cfa2ab72f** 【正式规则】3. 点击粉丝团设置 -> 进入设置页；点击成员 -> 原型以资料提示反馈。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club.html；交互；SRC-USER-672
## 主播中心 / 粉丝团设置 / fan-club-settings.html
页面入口：liveshow-proto/prototype/pages/user/host/fan-club-settings.html

- **REQ-5c1ed2ca1023** 【正式规则】主播修改自己的粉丝团名称及加入条件，并保存设置。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；场景描述；SRC-USER-673
- **REQ-1ee33d401eff** 【正式规则】粉丝团名称：手动填写，不默认生成；首次创建为空，必填，最多 20 个字符。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；字段；SRC-USER-676
- **REQ-259639693d42** 【正式规则】需要关注：默认开启；开启后，新成员加入前必须已关注主播。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；字段；SRC-USER-677
- **REQ-e678accf83a1** 【正式规则】累计贡献：默认 0；必填，最小值为 0，仅允许整数；统计用户给当前主播刷出的全部历史贡献，不按入团时间截断。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；字段；SRC-USER-678
- **REQ-d49e26122786** 【正式规则】1. 仅粉丝团所属主播可修改；保存后的加入条件只用于后续加入校验，不移除已在团成员。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；业务规则；SRC-USER-679
- **REQ-28037b9efd8f** 【正式规则】2. 数据范围：仅当前主播自己的粉丝团名称和加入条件。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；业务规则；SRC-USER-680
- **REQ-f8569b40a2c1** 【正式规则】1. 名称为空或累计贡献无效 -> 保存按钮不可用。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；交互；SRC-USER-681
- **REQ-e2396617e63e** 【正式规则】2. 校验通过并保存成功 -> 更新粉丝团加入条件。
  来源：liveshow-proto/prototype/annotations/user.js；fan-club-settings.html；交互；SRC-USER-682
## 主播中心 / 直播数据 / live-data.html
页面入口：liveshow-proto/prototype/pages/user/host/live-data.html

- **REQ-226258f44f04** 【正式规则】主播按日或月查看直播收益、时长、观众及粉丝相关指标和趋势。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；场景描述；SRC-USER-683
- **REQ-0d82569c66ef** 【正式规则】收益：普通/定制礼物及门票按成功支付金币汇总；幸运礼物按送出价值 × 后台比例汇总，默认 1%，返奖不影响；虚拟金币、失败或撤销消费不计入。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；字段；SRC-USER-686
- **REQ-799f53f68c2e** 【正式规则】有效天：按主播所属自然日累计，有效直播时长满 3 小时计 1 天，每日最多 1 天。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；字段；SRC-USER-687
- **REQ-59bc005fbd42** 【正式规则】开播时长：汇总筛选范围内有效直播时长。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；字段；SRC-USER-688
- **REQ-c1025eff3ce1** 【正式规则】观众人次：按直播场次进入行为累计。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；字段；SRC-USER-689
- **REQ-c1a96eb87f5a** 【正式规则】新增粉丝/送礼人数：按筛选范围去重统计。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；字段；SRC-USER-690
- **REQ-1e7de4bbf9b4** 【正式规则】1. 数据来自已开始的直播场次；场次结束后保留历史快照。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；业务规则；SRC-USER-691
- **REQ-fe846a072cd5** 【正式规则】2. 数据范围：仅当前主播、当前日或月范围内的直播数据；日期趋势按时间顺序展示，明细列表默认按日期倒序。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；业务规则；SRC-USER-692
- **REQ-ed8c70a581a1** 【正式规则】切换日/月范围 -> 同步更新全部指标；进入直播记录 -> 保留当前日期范围。
  来源：liveshow-proto/prototype/annotations/user.js；live-data.html；交互；SRC-USER-693
## 主播中心 / 直播记录 / live-records.html
页面入口：liveshow-proto/prototype/pages/user/host/live-records.html

- **REQ-27d410895746** 【正式规则】主播按日期范围查看自己的直播场次、收益和时长汇总，并查看单场数据。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；场景描述；SRC-USER-694
- **REQ-5bff9def79de** 【正式规则】直播场次：展示场次 ID、开播主题、封面、房型和分类快照。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；字段；SRC-USER-697
- **REQ-bdf92bcd92b1** 【正式规则】开播/结束时间：使用服务端场次时间；直播中记录结束时间为空。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；字段；SRC-USER-698
- **REQ-5a4dde90986b** 【正式规则】时长：按场次有效直播时长计算。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；字段；SRC-USER-699
- **REQ-19805a429279** 【正式规则】观众人数/收益：观众人数使用场次统计值；收益按主播收益口径汇总，不等于榜单贡献值。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；字段；SRC-USER-700
- **REQ-45785a2fabd6** 【正式规则】1. 每场记录保存开播时的主题、封面、分类、房型和准入配置快照，历史记录不随当前设置变更。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-701
- **REQ-53e24ec49086** 【正式规则】2. 收益 = 当前筛选范围内各场次主播收益之和；普通/定制礼物和门票按成功支付金币，幸运礼物按送出价值 × 后台比例，默认 1%，返奖不影响。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-702
- **REQ-f7b1b48604a8** 【正式规则】3. 总时长 = 当前筛选范围内各场次有效结束时间 - 有效开始时间之和；直播场次 = 当前范围内已创建且实际开始的场次数。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-703
- **REQ-3c02ee10c31a** 【正式规则】4. 观众人数展示当前场次的统计值。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-704
- **REQ-64acde2cf0ed** 【正式规则】5. 开播时间使用 dd/mm/yyyy HH.mm；筛选条件只使用日期。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-705
- **REQ-63f0ac849672** 【正式规则】6. 数据范围：当前主播在筛选日期范围内已实际开始的直播场次；默认近 7 天。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-706
- **REQ-96f420bd2163** 【正式规则】7. 排序：按开播时间倒序展示。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；业务规则；SRC-USER-707
- **REQ-4113c879d00d** 【正式规则】1. 默认展示近 7 天；可选择本周、本月、上月、单日或连续日期范围。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；交互；SRC-USER-708
- **REQ-6dec50420322** 【正式规则】2. 日期范围变化 -> 同步更新场次列表和汇总指标。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；交互；SRC-USER-709
- **REQ-b86cbb1f8e64** 【正式规则】3. 点击场次 -> 查看该场次的数据和礼物明细。
  来源：liveshow-proto/prototype/annotations/user.js；live-records.html；交互；SRC-USER-710
## 主播中心 / 分成记录 / income-sharing.html
页面入口：liveshow-proto/prototype/pages/user/host/income-sharing.html

- **REQ-258d41860521** 【正式规则】主播查看已上传的分成记录及对应日期和金额。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；场景描述；SRC-USER-711
- **REQ-d5f8759fbfe2** 【正式规则】分成日期：展示对应分成记录的日期。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；字段；SRC-USER-714
- **REQ-0b79c673c324** 【正式规则】分成金额：财务上传的最终金额，以美元展示；千位用“.”、小数用“,”。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；字段；SRC-USER-715
- **REQ-d156fd1d4e74** 【正式规则】1. 系统不提供主播线上结算申请或审批，本页只展示财务线下结算后上传的结果。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；业务规则；SRC-USER-716
- **REQ-b96b28e872d4** 【正式规则】2. 主播收益按礼物和门票类型分别计算：普通/定制礼物及门票按成功支付金币；幸运礼物按送出价值 × 后台比例，默认 1%；具体分成由线下财务计算。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；业务规则；SRC-USER-717
- **REQ-ac6b807f937c** 【正式规则】3. 金额以美元展示，数字按印尼格式使用“.”分隔千位、“,”分隔小数。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；业务规则；SRC-USER-718
- **REQ-13eacdff45b1** 【正式规则】4. 数据范围：当前主播已上传的分成结果；按分成日期倒序展示。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；业务规则；SRC-USER-719
- **REQ-f425c72972fb** 【正式规则】1. 点击分成记录 -> 原型提示查看对应日期的记录。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；交互；SRC-USER-720
- **REQ-e200c40f2cf5** 【正式规则】2. 点击返回 -> 回到主播中心。
  来源：liveshow-proto/prototype/annotations/user.js；income-sharing.html；交互；SRC-USER-721
## 钱包与账单 / 余额充值 / recharge.html
页面入口：liveshow-proto/prototype/pages/user/wallet/recharge.html

- **REQ-e4d945e42c05** 【正式规则】用户查看金币余额和充值套餐，选择套餐发起支付或查看余额明细。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；场景描述；SRC-USER-722
- **REQ-d442e0bc55c7** 【正式规则】金币余额：当前账号可用金币余额，单位为金币；不是现金余额或主播收益。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-725
- **REQ-41b6b8fe39e4** 【正式规则】明细：金币收支明细入口，进入余额明细页。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-726
- **REQ-40198e88a16b** 【正式规则】套餐配图：使用后台上传的套餐封面。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-727
- **REQ-9a05bd1d3528** 【正式规则】基础金币：套餐包含的充值金币，不含赠送金币；取后台充值金币配置。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-728
- **REQ-185ad4ee3351** 【正式规则】赠送金币：「+数值」显示后台配置的赠送金币数量；到账金币 = 基础金币 + 赠送金币。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-729
- **REQ-b5dd13565b16** 【正式规则】赠送比例标签：赠送比例 = 赠送金币 ÷ 基础金币 × 100%，与赠送金币数量分别显示。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-730
- **REQ-cdba6f278d41** 【正式规则】首充特惠：标记由后台配置。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-731
- **REQ-02cae43a1888** 【正式规则】活动倒计时：限时套餐剩余可购买时间，格式为时:分:秒，对应后台活动结束时间。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-732
- **REQ-95e0f0047f41** 【正式规则】价格 / 支付按钮：当前套餐实际支付金额，单位 USD，保留两位小数；点击发起该套餐支付。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；字段；SRC-USER-733
- **REQ-eae1af036b98** 【正式规则】1. 仅展示当前账号可购买的上架套餐；活动套餐须处于有效期且未达到单用户限购次数。活动区在前，同类套餐按后台排序权重从高到低展示。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；业务规则；SRC-USER-734
- **REQ-016ad0387d8b** 【正式规则】2. 活动套餐每笔支付成功订单占用 1 次限购；0 表示不限购，全额退款不恢复次数。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；业务规则；SRC-USER-735
- **REQ-781fe0384137** 【正式规则】3. 到账金币以下单时套餐快照为准；支付成功后增加余额并生成充值记录，同一订单重复回调只入账一次；失败、超时或取消不增加余额。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；业务规则；SRC-USER-736
- **REQ-9213831ca4fd** 【正式规则】4. 用户侧不提供退款操作。后台退款或渠道拒付扣除该订单到账金币；余额不足时允许为负，后续充值先抵扣负余额；不撤销已完成的礼物和门票消费。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；业务规则；SRC-USER-737
- **REQ-6dc985679329** 【正式规则】5. 运营账号不可进入充值页或发起充值。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；业务规则；SRC-USER-738
- **REQ-71c48bf26e3f** 【正式规则】1. 点击套餐价格按钮发起支付；本页无支付渠道选择控件，原型以支付提示代替实际支付。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；交互；SRC-USER-739
- **REQ-e9d41c0167f3** 【正式规则】2. 支付成功后刷新余额和可购买套餐；失败或取消保留原余额并提示结果。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；交互；SRC-USER-740
- **REQ-95df786b7baf** 【正式规则】3. 点击「明细」进入余额明细页；点击返回进入「我的」。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；交互；SRC-USER-741
- **REQ-2a96f4832099** 【正式规则】1. 历史无成功充值订单时具有首充资格；首次充值成功后取消资格并隐藏首充标记。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；购买边界；SRC-USER-742
- **REQ-a763f69cfc41** 【正式规则】2. 下单前套餐失效则不可购买；订单已创建时按订单快照在支付有效期内完成。无可购套餐时显示空状态。
  来源：liveshow-proto/prototype/annotations/user.js；recharge.html；购买边界；SRC-USER-743
## 钱包与账单 / 余额明细 / balance-detail.html
页面入口：liveshow-proto/prototype/pages/user/wallet/balance-detail.html

- **REQ-40a02e6475f4** 【正式规则】用户查看自己的金币收支记录，按记录进入对应订单详情。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；场景描述；SRC-USER-744
- **REQ-8d844fc4e8e0** 【正式规则】变动类型：当前页面展示充值、充值退款、礼物打赏和购买门票。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；字段；SRC-USER-747
- **REQ-bd8a4c835fb7** 【正式规则】变动金币：正数表示收入，负数表示支出，按收支使用不同颜色。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；字段；SRC-USER-748
- **REQ-d813a417613d** 【正式规则】发生时间：展示该条金币流水的日期和时间。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；字段；SRC-USER-749
- **REQ-da4b64f4623e** 【正式规则】1. 流水只增不改；退款或拒付以独立冲正分录体现。余额允许因退款为负，负余额时不可消费，后续充值先抵扣负值。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；业务规则；SRC-USER-750
- **REQ-5392dcd051b2** 【正式规则】2. 数据范围：当前登录账号的金币流水；按发生时间倒序，时间相同按流水 ID 从大到小。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；业务规则；SRC-USER-751
- **REQ-16b2aa083fad** 【正式规则】点击流水 -> 按类型进入充值或支出详情；无法关联订单的赠送、任务等奖励只展示流水信息。
  来源：liveshow-proto/prototype/annotations/user.js；balance-detail.html；交互；SRC-USER-752
## 钱包与账单 / 充值订单详情 / order-income-detail.html
页面入口：liveshow-proto/prototype/pages/user/wallet/order-income-detail.html

- **REQ-e22a427eecd8** 【正式规则】用户查看一笔充值订单的购买套餐、数量、支付信息及到账金币。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；场景描述；SRC-USER-753
- **REQ-7ee09ae8f0aa** 【正式规则】购买套餐名称：充值时购买的套餐名称。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；字段；SRC-USER-756
- **REQ-4d419753eb3b** 【正式规则】数量：本笔订单购买的套餐数量。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；字段；SRC-USER-757
- **REQ-8d0444f9c09e** 【正式规则】支付时间：本笔订单的支付时间。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；字段；SRC-USER-758
- **REQ-265f31b95aef** 【正式规则】套餐金币 / 赠送金币：分别展示基础金币和赠送金币。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；字段；SRC-USER-759
- **REQ-c7b416ee772c** 【正式规则】支付渠道：本笔订单使用的支付渠道。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；字段；SRC-USER-760
- **REQ-53ca55ab9ec7** 【正式规则】支付金额：本笔订单实际支付的金额。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；字段；SRC-USER-761
- **REQ-f2cbdd1e3dc4** 【正式规则】1. 用户侧不提供退款操作；后台退款或渠道拒付生成冲正流水，不撤销已完成的礼物和门票消费。重复支付回调不得重复入账。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；业务规则；SRC-USER-762
- **REQ-5f2db2093423** 【正式规则】2. 数据范围：当前用户所选的单笔充值订单，金额与金币使用该订单的套餐快照。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；业务规则；SRC-USER-763
- **REQ-391c3aa24f10** 【正式规则】订单状态变化 -> 刷新状态、时间和关联余额流水；返回 -> 回到账单列表并保留筛选位置。
  来源：liveshow-proto/prototype/annotations/user.js；order-income-detail.html；交互；SRC-USER-764
## 钱包与账单 / 支出订单详情 / order-expense-detail.html
页面入口：liveshow-proto/prototype/pages/user/wallet/order-expense-detail.html

- **REQ-66152f4f0be9** 【正式规则】用户查看一笔支出订单的商品、数量、支付时间、扣款金币和消费直播间。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；场景描述；SRC-USER-765
- **REQ-17b93df45ee4** 【正式规则】付款商品名称：本笔消费对应的商品名称。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；字段；SRC-USER-768
- **REQ-f7d59b64b8c5** 【正式规则】数量：本笔消费的商品数量。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；字段；SRC-USER-769
- **REQ-ecdea3a257d8** 【正式规则】支付时间：本笔消费的支付时间。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；字段；SRC-USER-770
- **REQ-f066210a5484** 【正式规则】扣款金币：本笔消费实际扣除的金币。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；字段；SRC-USER-771
- **REQ-4a642d59e4d8** 【正式规则】消费直播间：展示消费对象的主播昵称和主播 ID。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；字段；SRC-USER-772
- **REQ-637b3a5f801c** 【正式规则】1. 消费成功只扣减一次金币并生成流水；余额不足或条件检查失败不扣减。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；业务规则；SRC-USER-773
- **REQ-1d930d74d66c** 【正式规则】2. 已成功赠送的礼物和已购买门票不支持退款。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；业务规则；SRC-USER-774
- **REQ-c610764f5eb7** 【正式规则】3. 门票仅对当前直播场次有效，同场重复进入不重复收费；被踢出或场次结束后失效且不退款。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；业务规则；SRC-USER-775
- **REQ-3c9f7fabb0c3** 【正式规则】4. 数据范围：当前用户所选的单笔支出订单，商品、数量和金币使用支付时记录。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；业务规则；SRC-USER-776
- **REQ-028b7406aba9** 【正式规则】点击业务对象 -> 进入仍可访问的主播或场次信息；对象已失效时仅保留订单快照，不重新发起消费。
  来源：liveshow-proto/prototype/annotations/user.js；order-expense-detail.html；交互；SRC-USER-777
## 系统入口 / 登录与注册 / auth-login-register.html
页面入口：liveshow-proto/prototype/pages/user/auth/auth-login-register.html

- **REQ-3c66e6d46189** 【正式规则】用户首次或再次进入 App，通过第三方账号、手机号或邮箱进入账号流程。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；场景描述；SRC-USER-778
- **REQ-37ecbd68b41b** 【正式规则】Google：第三方一键登录主入口；点击后唤起 Google 授权。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-781
- **REQ-be62444b30bc** 【正式规则】Facebook：第三方一键登录入口；点击后唤起 Facebook 授权。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-782
- **REQ-9c2867be64f3** 【正式规则】Apple ID：第三方一键登录入口，仅在 iOS 展示；点击后唤起 Apple 授权。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-783
- **REQ-253a54ee64bc** 【正式规则】TikTok：第三方一键登录入口；点击后唤起 TikTok 授权。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-784
- **REQ-fc06406a4505** 【正式规则】手机号：进入手机号密码或短信验证码登录页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-785
- **REQ-448cf582837b** 【正式规则】邮箱：进入邮箱密码或邮箱验证码登录页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-786
- **REQ-416c8b4c9df7** 【正式规则】游客进入：不创建登录会话，进入游客可访问页面。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-787
- **REQ-787e65bcf5bd** 【正式规则】协议确认：发起登录前必须同意当前版本《用户协议》和《隐私政策》。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；字段；SRC-USER-788
- **REQ-38800ca75409** 【正式规则】1. Google、Facebook、Apple ID、TikTok 授权成功后，按对应平台账号标识查询 Luma Live 账号。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-789
- **REQ-bf43560617e5** 【正式规则】2. 所有新注册账号首次授权成功 -> 自动创建账号，生成用户 ID、默认昵称和默认头像，并进入资料补全；已有账号 -> 建立登录会话并进入首页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-790
- **REQ-02e585ebcf9c** 【正式规则】3. 用户取消授权、授权失败或未取得有效账号标识 -> 不创建账号、不建立登录会话，停留本页并提示结果。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-791
- **REQ-c0780b9d4ddd** 【正式规则】4. 账号状态为封禁 -> 不建立登录会话，停留本页并提示“账号已封禁”；文案采用系统概要举报处置规则。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-792
- **REQ-6b7c22315843** 【正式规则】5. 账号处于注销冷静期 -> 不建立常规登录会话，展示注销冷静期弹窗；冷静期内账号及相关数据保留。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-793
- **REQ-9292c0fb0450** 【正式规则】6. Apple ID 仅在 iOS 展示。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-794
- **REQ-90ee1174bd4c** 【正式规则】7. 游客白名单为首页、主播榜、贡献榜、福利页和邀请好友页；其余页面及账号动作需登录。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；业务规则；SRC-USER-795
- **REQ-38be4b15dfad** 【正式规则】1. 未勾选协议 -> 点击 Google、Facebook、Apple ID 或 TikTok -> 提示先同意《用户协议》和《隐私政策》，不发起授权。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-796
- **REQ-9d7a8c8e2666** 【正式规则】2. 已勾选协议 -> 点击任一第三方入口 -> 唤起对应平台授权；授权成功后按新老账号分流。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-797
- **REQ-f0e50e63ecf5** 【正式规则】3. 第三方授权失败 -> 停留本页并 Toast 提示“登录失败，请重试”；取消授权 -> Toast 提示“已取消授权”。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-798
- **REQ-7d79ef943ccd** 【正式规则】4. 授权成功但账号已封禁 -> 停留本页并提示“账号已封禁”；文案采用系统概要举报处置规则。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-799
- **REQ-e9e0489a4bfa** 【正式规则】5. 账号处于注销冷静期 -> 展示可取消截止时间及“暂不取消、取消注销”；取消注销后恢复账号并直接登录。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-800
- **REQ-e73de14064d4** 【正式规则】6. 点击手机号登录 -> 进入手机号登录页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-801
- **REQ-845700acd2a8** 【正式规则】7. 点击邮箱 -> 进入邮箱登录页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-802
- **REQ-2643e9115884** 【正式规则】8. 点击游客进入 -> 不校验登录协议，直接以游客身份进入首页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-login-register.html；交互；SRC-USER-803
## 系统入口 / 资料补全 / auth-profile-completion.html
页面入口：liveshow-proto/prototype/pages/user/auth/auth-profile-completion.html

- **REQ-d9f920d30934** 【正式规则】新用户首次授权成功后补全头像和昵称。
  来源：liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html；场景描述；SRC-USER-804
- **REQ-13b22c492980** 【正式规则】头像：默认使用系统头像，可选择预置头像。
  来源：liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html；字段；SRC-USER-807
- **REQ-0e3f8c40945e** 【正式规则】昵称：默认使用系统昵称；保存时不能为空，最长 20 个字符。
  来源：liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html；字段；SRC-USER-808
- **REQ-8ec4e05aadd6** 【正式规则】仅用于新用户首次登录后的资料补全；保存后使用用户填写的资料，跳过则保留系统默认头像和昵称。
  来源：liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html；业务规则；SRC-USER-809
- **REQ-dbb54b52c62c** 【正式规则】1. 保存 -> 校验昵称 -> 保存资料并进入首页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html；交互；SRC-USER-810
- **REQ-956a1dfa8950** 【正式规则】2. 跳过 -> 保留系统默认资料并进入首页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-profile-completion.html；交互；SRC-USER-811
## 系统入口 / 手机号登录 / auth-phone-login.html
页面入口：liveshow-proto/prototype/pages/user/auth/auth-phone-login.html

- **REQ-b8faeef19c51** 【正式规则】用户使用手机号，通过密码或短信验证码登录。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；场景描述；SRC-USER-812
- **REQ-e52afb2775c4** 【正式规则】国家或地区区号：入口仅展示区号，不显示国旗；默认按设备地区匹配，无法识别时使用印度尼西亚 +62。点击进入独立选择页；不提供中国大陆 +86。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；字段；SRC-USER-815
- **REQ-10ec9ece918e** 【正式规则】手机号：8-15 位数字。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；字段；SRC-USER-816
- **REQ-e463b836cd88** 【正式规则】验证码：6 位数字，有效期 5 分钟；连续错误 5 次后当前验证码失效。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；字段；SRC-USER-817
- **REQ-7e2bd09e6f11** 【正式规则】密码：密码登录时必填。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；字段；SRC-USER-818
- **REQ-557bc9e8096c** 【正式规则】1. 从登录入口进入时默认使用短信验证码登录。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；业务规则；SRC-USER-819
- **REQ-e2710356864f** 【正式规则】2. 选择区号后返回本页，保留已输入手机号、登录方式和协议勾选状态。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；业务规则；SRC-USER-820
- **REQ-8dc7a2dd09e3** 【正式规则】3. 凭证验证成功但账号处于注销冷静期时，不建立常规登录会话，进入登录与注册页展示冷静期弹窗。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；业务规则；SRC-USER-821
- **REQ-e0bfe26ba39e** 【正式规则】1. 手机号有效 -> 可获取验证码；发送后倒计时 60 秒，期间不可重复获取。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；交互；SRC-USER-822
- **REQ-2c975fdfb3b5** 【正式规则】2. 手机号、登录凭证和协议均有效 -> 继续按钮可用；登录成功 -> 进入首页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；交互；SRC-USER-823
- **REQ-960abdc732e0** 【正式规则】3. 点击区号 -> 保存当前输入并进入选择国家/地区页；选择或返回后恢复登录表单。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；交互；SRC-USER-824
- **REQ-22f618bf6812** 【正式规则】4. 点击使用密码登录或短信验证码登录 -> 切换登录方式。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；交互；SRC-USER-825
- **REQ-b3638cfc1492** 【正式规则】5. 命中注销冷静期 -> 展示可取消截止时间及取消注销操作。
  来源：liveshow-proto/prototype/annotations/user.js；auth-phone-login.html；交互；SRC-USER-826
## 系统入口 / 选择国家/地区 / auth-country-select.html
页面入口：liveshow-proto/prototype/pages/user/auth/auth-country-select.html

- **REQ-2c4265067dde** 【正式规则】用户在手机号登录前选择国际区号。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；场景描述；SRC-USER-827
- **REQ-99b1d0952ccc** 【正式规则】搜索：支持按国家或地区名称、国际区号搜索；无结果时显示空状态。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；字段；SRC-USER-830
- **REQ-ffb018c681e7** 【正式规则】全部地区：页面不设置常用地区分组，统一展示当前业务支持的国家或地区、国旗和国际区号；中国大陆 +86 不在可选列表。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；字段；SRC-USER-831
- **REQ-b00fe2e27f2e** 【正式规则】当前选中项：使用勾选标识；未选择时按设备地区匹配，无法识别或设备地区为不支持项时使用印度尼西亚 +62。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；字段；SRC-USER-832
- **REQ-bbe701b6f1a7** 【正式规则】1. 可选范围覆盖多地区，不提供中国大陆 +86。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；业务规则；SRC-USER-833
- **REQ-4fc991cd34e3** 【正式规则】2. 区号只影响手机号登录标识，不改变账号地区资料。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；业务规则；SRC-USER-834
- **REQ-71a46a3267a6** 【正式规则】3. 数据范围：仅展示支持手机号登录的国家或地区；搜索只在可选地区中匹配。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；业务规则；SRC-USER-835
- **REQ-6e79d85315be** 【正式规则】4. 按本地化国家或地区名称排序；无法识别设备地区时默认选择印度尼西亚 +62。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；业务规则；SRC-USER-836
- **REQ-a52e61150319** 【正式规则】1. 输入名称或 +62 等区号 -> 实时过滤全部地区；清空搜索 -> 恢复全部地区。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；交互；SRC-USER-837
- **REQ-c93af8d76be2** 【正式规则】2. 选择地区 -> 保存区号并返回手机号登录页，保留已输入手机号、登录方式和协议勾选状态。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；交互；SRC-USER-838
- **REQ-c69c7286fec5** 【正式规则】3. 点击返回 -> 不改变原区号并返回手机号登录页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-country-select.html；交互；SRC-USER-839
## 系统入口 / 邮箱登录 / auth-email-login.html
页面入口：liveshow-proto/prototype/pages/user/auth/auth-email-login.html

- **REQ-5ed8b83f5414** 【正式规则】用户使用邮箱，通过密码或邮箱验证码登录。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；场景描述；SRC-USER-840
- **REQ-96db5c1c1de1** 【正式规则】邮箱：必须为有效邮箱地址。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；字段；SRC-USER-843
- **REQ-69fac681ba67** 【正式规则】验证码：6 位数字，有效期 5 分钟；连续错误 5 次后当前验证码失效。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；字段；SRC-USER-844
- **REQ-38ab03f09781** 【正式规则】密码：密码登录时必填。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；字段；SRC-USER-845
- **REQ-cd6279269c69** 【正式规则】1. 默认使用邮箱验证码登录。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；业务规则；SRC-USER-846
- **REQ-12d1cc820a8a** 【正式规则】2. 凭证验证成功但账号处于注销冷静期时，不建立常规登录会话，进入登录与注册页展示冷静期弹窗。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；业务规则；SRC-USER-847
- **REQ-ebd04770613b** 【正式规则】1. 邮箱有效 -> 可获取验证码；发送后倒计时 60 秒，期间不可重复获取。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；交互；SRC-USER-848
- **REQ-f898bc14589e** 【正式规则】2. 邮箱、登录凭证和协议均有效 -> 继续按钮可用；登录成功 -> 进入首页。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；交互；SRC-USER-849
- **REQ-a818b26feb5c** 【正式规则】3. 点击使用密码登录或邮箱验证码登录 -> 切换登录方式。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；交互；SRC-USER-850
- **REQ-4001e879f74f** 【正式规则】4. 命中注销冷静期 -> 展示可取消截止时间及取消注销操作。
  来源：liveshow-proto/prototype/annotations/user.js；auth-email-login.html；交互；SRC-USER-851
## 我的 / 资料编辑 / profile-edit.html
页面入口：liveshow-proto/prototype/pages/user/profile/profile-edit.html

- **REQ-5fc896bd9b9b** 【正式规则】用户修改自己的背景图、头像、昵称和其他个人资料，并保存修改。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；场景描述；SRC-USER-852
- **REQ-7631abda0172** 【正式规则】用户 ID：系统生成，只读，不可修改。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-855
- **REQ-dacffe746c74** 【正式规则】背景图：选填，仅上传图片。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-856
- **REQ-d304e86864ec** 【正式规则】头像：选填，仅上传图片；修改后须通过内容风控。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-857
- **REQ-e19809919b44** 【正式规则】昵称：必填，最多 20 个字符；修改后须通过内容风控。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-858
- **REQ-e0ffa128dc3f** 【正式规则】签名：选填，最多 80 个字符。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-859
- **REQ-6aca265fbeaa** 【正式规则】性别：可选男、女、不公开。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-860
- **REQ-e9291daf27fd** 【正式规则】地区：选填，最多 30 个字符。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-861
- **REQ-71505557b4d9** 【正式规则】生日：选填，不得晚于当前日期。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；字段；SRC-USER-862
- **REQ-e7aae38d0cd9** 【正式规则】头像或昵称修改后保存须进行合规校验；校验成功后直接保存，校验失败或网络异常时不保存并保留编辑内容。其他资料直接生效。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；业务规则；SRC-USER-863
- **REQ-3845ca28a192** 【正式规则】1. 昵称为空 -> 保存按钮不可用；昵称、签名或地区达到最大长度后阻止继续输入，不增加提示。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；交互；SRC-USER-864
- **REQ-f8a6abd0466c** 【正式规则】2. 头像或昵称有修改 -> 点击保存后显示 loading 并进行合规校验。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；交互；SRC-USER-865
- **REQ-5f31a4be8f02** 【正式规则】3. 校验成功 -> 直接保存；校验失败 -> 提示“头像或昵称不合规”；网络异常 -> 提示“网络异常，请重试”。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；交互；SRC-USER-866
- **REQ-1bea6d587134** 【正式规则】4. 头像或昵称修改后保存失败或网络异常时保留编辑内容；成功、不合规、网络异常的轮流演示不作为业务规则。
  来源：liveshow-proto/prototype/annotations/user.js；profile-edit.html；交互；SRC-USER-867
## 我的 / 设置 / settings.html
页面入口：liveshow-proto/prototype/pages/user/profile/settings.html

- **REQ-d5d33745b589** 【正式规则】用户管理账号安全、通知及语言设置，查看应用信息，退出登录或申请注销账号。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；场景；SRC-USER-868
- **REQ-ad6e7c052282** 【正式规则】手机号：展示已绑定手机号，国家/地区区号保留，号码中间部分脱敏。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-871
- **REQ-fc4961f17554** 【正式规则】邮箱：展示已绑定邮箱，邮箱账号部分脱敏。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-872
- **REQ-c04057c765c9** 【正式规则】登录密码：仅显示“已设置”或“未设置”；不展示密码内容。第三方登录且未绑定手机号或邮箱时，“设置密码”禁用。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-873
- **REQ-5224771f5d56** 【正式规则】系统通知：展示手机系统通知权限状态：未开启、已拒绝或已开启。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-874
- **REQ-29812331980d** 【正式规则】开播提醒、互动通知：App 内通知分类偏好，不代表手机系统通知权限。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-875
- **REQ-5ff91b0709f0** 【正式规则】语言：用户端与主播端均支持中文、English、Bahasa Indonesia、Bahasa Melayu，默认 Bahasa Indonesia。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-876
- **REQ-61f895a7bd57** 【正式规则】协议入口：展示当前有效版本的用户协议和隐私政策。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-877
- **REQ-5774dcebd724** 【正式规则】注销条件：金币余额低于 100。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-878
- **REQ-aca0fa9eb10b** 【正式规则】注销状态：包括金币余额不少于 100、金币余额低于 100 和提交后的七日冷静期。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；字段；SRC-USER-879
- **REQ-998c0332340d** 【正式规则】1. 手机号、邮箱和登录密码直接展示在设置页；登录页不提供设置、修改或忘记密码入口。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-880
- **REQ-35ded3ea58b0** 【正式规则】2. 登录密码归属当前账号；设置后，已绑定手机号和邮箱均可使用同一密码登录。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-881
- **REQ-adb0215eef58** 【正式规则】3. 第三方登录且未绑定手机号或邮箱时，不能设置密码；下次登录只能继续使用原第三方账号。绑定手机号或邮箱后，才可设置密码。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-882
- **REQ-7828a215227e** 【正式规则】4. 退出登录只清除当前设备登录会话，不删除账号和资产。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-883
- **REQ-de4351f1339e** 【正式规则】5. 系统通知未开启时不展示站外推送；系统通知、互动通知等消息仍保留在站内通知中心。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-884
- **REQ-5124458d0897** 【正式规则】6. 开播提醒和互动通知仅控制对应 App 内分类偏好。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-885
- **REQ-f02f4f29636b** 【正式规则】7. 金币余额不少于 100 时不可注销；余额低于 100 时可进入确认流程。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-886
- **REQ-135fd6241321** 【正式规则】8. 提交注销申请后进入七日冷静期；期间账号、资产、社交关系、聊天记录及创建的粉丝团均保留。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-887
- **REQ-0064d0e055ca** 【正式规则】9. 冷静期内可取消注销；期满仍未取消时，才解除社交关系、解散创建的粉丝团并最终删除账号及相关数据。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；业务；SRC-USER-888
- **REQ-4dde945be88c** 【正式规则】1. 密码已设置 -> 显示“修改密码”；密码未设置且已绑定手机号或邮箱 -> 显示可点击的“设置密码”；第三方登录且两者均未绑定 -> “设置密码”禁用。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-889
- **REQ-a13d09656728** 【正式规则】2. 点击语言 -> 从页面底部打开语言选择抽屉；选择后立即更新当前语言并关闭抽屉。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-890
- **REQ-04e8339d2260** 【正式规则】3. 系统通知从未申请 -> 点击后模拟系统授权弹窗；拒绝后状态改为已拒绝。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-891
- **REQ-9f189c07e2ca** 【正式规则】4. 系统通知已拒绝 -> 点击后提示前往手机系统设置，提供暂不开启和前往设置；已授权时显示已开启。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-892
- **REQ-c863e571f9ac** 【原型说明】5. 同一会话内每次点击注销账号，按金币余额不少于 100、低于 100 两种情况持续交替；离开设置页后不重置。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-893
- **REQ-85a967f09010** 【正式规则】6. 两种弹窗均显示三条提示：余额低于 100 可注销、最终注销后解除全部社交关系并解散粉丝团、注销后七日内可取消注销。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-894
- **REQ-70aefc6d09b5** 【正式规则】7. 金币余额不少于 100 -> 按钮从左到右为“查看余额、取消”。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-895
- **REQ-00aed59ef539** 【正式规则】8. 金币余额低于 100 -> 按钮从左到右为“确认注销、取消”；点击确认注销 -> 新弹窗自动倒计时 10 秒，仅显示取消按钮。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-896
- **REQ-ff3830dca5aa** 【正式规则】9. 倒计时结束 -> 提交注销申请，记录七日后的最终删除时间，展示提交结果并退出到登录与注册页；点击取消 -> 停止倒计时，不提交申请。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-897
- **REQ-22a8015ad00f** 【正式规则】10. 冷静期内重新登录 -> 在登录与注册页展示可操作弹窗；取消注销后清除待注销状态并进入首页，暂不取消则关闭弹窗。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-898
- **REQ-7a459170bf05** 【正式规则】11. 退出登录 -> 二次确认；确认后返回登录页。
  来源：liveshow-proto/prototype/annotations/user.js；settings.html；交互；SRC-USER-899
## 我的 / 设置 / views/settings/password-not-set.html
页面入口：liveshow-proto/prototype/pages/user/profile/settings.html

- **REQ-16e9f8f14302** 【正式规则】当前账号尚未设置登录密码。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html；场景；SRC-USER-900
- **REQ-39fb463d1b2c** 【正式规则】密码状态：显示“未设置”。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html；字段；SRC-USER-903
- **REQ-4802c4c32560** 【正式规则】密码设置完成前，手机号和邮箱仅可使用验证码登录。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html；业务；SRC-USER-905
- **REQ-b4327faf7fdd** 【正式规则】点击设置密码 -> 进入设置密码页。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/password-not-set.html；交互；SRC-USER-906
## 我的 / 设置密码 / account-password-set.html
页面入口：liveshow-proto/prototype/pages/user/profile/account-password-set.html

- **REQ-e36bd55ca432** 【正式规则】已登录且尚未设置密码的用户，通过已绑定手机号或邮箱验证身份后设置登录密码。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；场景；SRC-USER-907
- **REQ-e521ca8c0220** 【正式规则】验证方式：可选择已绑定手机号或邮箱；联系方式脱敏展示。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；字段；SRC-USER-910
- **REQ-ee17cfb338ea** 【正式规则】验证码：必填，6 位数字；仅校验当前选中的手机号或邮箱收到的有效验证码。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；字段；SRC-USER-911
- **REQ-04e19edbdfd8** 【正式规则】登录密码：必填，至少 8 位。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；字段；SRC-USER-912
- **REQ-ead183854af5** 【正式规则】确认密码：必填，必须与登录密码一致。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；字段；SRC-USER-913
- **REQ-cf00fca1b85e** 【正式规则】1. 设置密码前必须完成当前账号的手机号或邮箱验证。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；业务；SRC-USER-914
- **REQ-202f6cc26131** 【正式规则】2. 验证码错误、失效或已使用时不设置密码，并保留当前输入。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；业务；SRC-USER-915
- **REQ-358866015834** 【正式规则】3. 设置成功后，已绑定手机号和邮箱均可使用该密码登录。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；业务；SRC-USER-916
- **REQ-9a03381a884e** 【正式规则】1. 点击获取验证码 -> 向当前选中的手机号或邮箱发送验证码，按钮进入 60 秒倒计时；倒计时结束后可重新获取。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；交互；SRC-USER-917
- **REQ-368c512806db** 【正式规则】2. 验证码不是 6 位或密码少于 8 位 -> 完成按钮不可用。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；交互；SRC-USER-918
- **REQ-f627112e8c5a** 【正式规则】3. 两次密码不一致 -> 不提交并提示；校验成功 -> 设置密码并返回设置页。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-set.html；交互；SRC-USER-919
## 我的 / 修改密码 / account-password-change.html
页面入口：liveshow-proto/prototype/pages/user/profile/account-password-change.html

- **REQ-dc9661e0549e** 【正式规则】已设置密码的用户使用当前密码修改登录密码。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；场景；SRC-USER-920
- **REQ-3af6a428ec35** 【正式规则】当前密码：必填，必须与当前有效密码一致。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；字段；SRC-USER-923
- **REQ-1f7d1ec805ad** 【正式规则】新密码：必填，至少 8 位，不能与当前密码相同。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；字段；SRC-USER-924
- **REQ-0d3cf4d05b34** 【正式规则】确认新密码：必填，必须与新密码一致。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；字段；SRC-USER-925
- **REQ-a60a154fd295** 【正式规则】1. 当前密码验证失败时不修改密码。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；业务；SRC-USER-926
- **REQ-2568b2aa4aee** 【正式规则】2. 修改成功后新密码立即生效，旧密码不可再用于登录。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；业务；SRC-USER-927
- **REQ-a404186832b4** 【正式规则】3. 忘记当前密码时必须通过已绑定手机号或邮箱重置。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；业务；SRC-USER-928
- **REQ-9083e6121737** 【正式规则】1. 当前密码错误、新密码与当前密码相同或两次新密码不一致 -> 保留输入并提示对应错误。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；交互；SRC-USER-929
- **REQ-db64ce3eeaad** 【正式规则】2. 点击忘记当前密码 -> 进入忘记密码页。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；交互；SRC-USER-930
- **REQ-0a60dd1daf1e** 【正式规则】3. 校验成功 -> 修改密码并返回设置页。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-change.html；交互；SRC-USER-931
## 我的 / 忘记密码 / account-password-reset.html
页面入口：liveshow-proto/prototype/pages/user/profile/account-password-reset.html

- **REQ-fdf50694e7f8** 【正式规则】已登录用户忘记当前密码，通过已绑定手机号或邮箱验证身份后重置密码。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；场景；SRC-USER-932
- **REQ-42636fba5427** 【正式规则】验证方式：可选择已绑定手机号或邮箱；联系方式脱敏展示。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；字段；SRC-USER-935
- **REQ-0ce99b7c4046** 【正式规则】验证码：必填，6 位数字；仅校验当前选中的手机号或邮箱收到的有效验证码。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；字段；SRC-USER-936
- **REQ-eae168e6c728** 【正式规则】新密码：必填，至少 8 位。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；字段；SRC-USER-937
- **REQ-ca890d3dcce6** 【正式规则】确认新密码：必填，必须与新密码一致。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；字段；SRC-USER-938
- **REQ-e7241dcf1a97** 【正式规则】1. 重置密码前必须完成当前账号的手机号或邮箱验证。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；业务；SRC-USER-939
- **REQ-8721a29b58b2** 【正式规则】2. 验证码错误、失效或已使用时不重置密码，并保留当前输入。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；业务；SRC-USER-940
- **REQ-26bff3d7427b** 【正式规则】3. 重置成功后新密码立即生效，旧密码不可再用于登录。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；业务；SRC-USER-941
- **REQ-2dfc0ac54952** 【正式规则】1. 点击获取验证码 -> 向当前选中的手机号或邮箱发送验证码，按钮进入 60 秒倒计时；倒计时结束后可重新获取。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；交互；SRC-USER-942
- **REQ-5f6e725529fd** 【正式规则】2. 验证码不是 6 位或密码少于 8 位 -> 重置密码按钮不可用。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；交互；SRC-USER-943
- **REQ-0015ab49705d** 【正式规则】3. 两次密码不一致 -> 不提交并提示；校验成功 -> 重置密码并返回设置页。
  来源：liveshow-proto/prototype/annotations/user.js；account-password-reset.html；交互；SRC-USER-944
## 系统入口 / 登录与注册 / views/auth-login-register/deletion-cooling.html
页面入口：liveshow-proto/prototype/pages/user/auth/auth-login-register.html

- **REQ-97ff2f57ecda** 【正式规则】用户提交注销申请后七日内再次进入或登录 App。
  来源：liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html；场景描述；SRC-USER-945
- **REQ-a98c7872ce39** 【正式规则】可取消截止时间：注销申请提交时间加七日；日期时间显示格式单独列入SRC-Q12，不影响七日截止时间的计算。
  来源：liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html；字段；SRC-USER-948
- **REQ-f4d2098ae491** 【正式规则】1. 冷静期内保留账号、资产、社交关系、聊天记录及创建的粉丝团，不执行最终删除。
  来源：liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html；业务规则；SRC-USER-950
- **REQ-fb809f9f7a01** 【正式规则】2. 冷静期满仍未取消 -> 解除社交关系、解散创建的粉丝团并最终删除账号及相关数据。
  来源：liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html；业务规则；SRC-USER-951
- **REQ-3914ead21639** 【正式规则】3. 取消注销 -> 清除待注销状态，原有数据和关系保持不变。
  来源：liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html；业务规则；SRC-USER-952
- **REQ-845b4bbf84ed** 【正式规则】点击暂不取消 -> 关闭弹窗并停留登录与注册页；点击取消注销 -> 清除待注销状态并直接登录。
  来源：liveshow-proto/prototype/annotations/user.js；views/auth-login-register/deletion-cooling.html；交互；SRC-USER-953
## 首页与福利 / 首页 / views/live-plaza/notification-intro.html
页面入口：liveshow-proto/prototype/pages/user/home/live-plaza.html

- **REQ-aad36cadfeac** 【正式规则】登录成功后首次进入首页，先向用户说明通知用途。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html；场景描述；SRC-USER-954
- **REQ-28bedb3d9986** 【正式规则】标题：开启通知
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html；字段；SRC-USER-957
- **REQ-78522c7aef85** 【正式规则】正文：开启后，你可以及时收到关注主播开播、互动消息及平台公告。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html；字段；SRC-USER-958
- **REQ-d4c32c66677e** 【正式规则】按钮：暂不开启、开启通知。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html；字段；SRC-USER-959
- **REQ-e477ec7cbc1b** 【正式规则】首次登录进入首页时展示；选择开启或暂不开启后，后续登录不再展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html；业务规则；SRC-USER-960
- **REQ-5866d8110212** 【正式规则】点击开启通知 -> 模拟系统通知授权弹窗；点击暂不开启 -> 关闭说明且后续登录不再展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-intro.html；交互；SRC-USER-961
## 首页与福利 / 首页 / views/live-plaza/notification-permission.html
页面入口：liveshow-proto/prototype/pages/user/home/live-plaza.html

- **REQ-bfc8be88e588** 【正式规则】用户在首页同意开启通知后，选择是否授予系统通知权限。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html；场景描述；SRC-USER-962
- **REQ-54f501bf2231** 【正式规则】标题：“Luma Live”想给你发送通知
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html；字段；SRC-USER-965
- **REQ-52c892b48c0c** 【正式规则】正文：通知可能包括提醒、声音和图标标记。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html；字段；SRC-USER-966
- **REQ-f40ca1136389** 【正式规则】按钮：不允许、允许。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html；字段；SRC-USER-967
- **REQ-004f11c2cef2** 【正式规则】记录当前设备的系统授权结果；拒绝不影响站内通知接收。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html；业务规则；SRC-USER-968
- **REQ-1a1733d433d5** 【正式规则】模拟手机系统通知授权；允许后记录为已开启，不允许后记录为已拒绝。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-plaza/notification-permission.html；交互；SRC-USER-969
## 我的 / 设置 / views/settings/notification-default.html
页面入口：liveshow-proto/prototype/pages/user/profile/settings.html

- **REQ-52689d9dbfaf** 【正式规则】用户在设置页查看从未申请的系统通知权限，并发起授权。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html；场景描述；SRC-USER-970
- **REQ-9c9a7b16eaec** 【正式规则】系统通知：当前状态为未开启，尚未申请系统授权。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html；字段；SRC-USER-973
- **REQ-a3f235349455** 【正式规则】通知权限属于当前设备；未获授权时不发送站外推送，站内通知仍保留。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html；业务规则；SRC-USER-974
- **REQ-b2643c7dc725** 【正式规则】系统通知从未申请时，点击入口调起模拟系统授权弹窗。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-default.html；交互；SRC-USER-975
## 我的 / 设置 / views/settings/notification-denied.html
页面入口：liveshow-proto/prototype/pages/user/profile/settings.html

- **REQ-c7c2a06596e9** 【正式规则】用户在设置页查看已拒绝的系统通知权限，并前往系统设置调整。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html；场景描述；SRC-USER-976
- **REQ-09580cc8c4bb** 【正式规则】系统通知：当前状态为已拒绝。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html；字段；SRC-USER-979
- **REQ-05db870200db** 【正式规则】系统权限已被拒绝时需在系统设置中调整；App 内分类开关不能代替系统授权。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html；业务规则；SRC-USER-981
- **REQ-67f289b5e495** 【正式规则】系统通知已拒绝时，点击入口提示前往手机系统设置，提供暂不开启和前往设置。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-denied.html；交互；SRC-USER-982
## 我的 / 设置 / views/settings/notification-granted.html
页面入口：liveshow-proto/prototype/pages/user/profile/settings.html

- **REQ-bce6ea876eaa** 【正式规则】用户在设置页查看已开启的系统通知权限。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html；场景描述；SRC-USER-983
- **REQ-44618f2bda0b** 【正式规则】系统通知：当前状态为已开启。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html；字段；SRC-USER-986
- **REQ-02f50c5cf61f** 【正式规则】开播提醒 / 互动通知：独立的 App 内通知分类偏好。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html；字段；SRC-USER-987
- **REQ-65df9db01960** 【正式规则】获得系统权限后，开播提醒和互动通知仍分别受 App 内分类偏好控制。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html；业务规则；SRC-USER-988
- **REQ-75ebb4115a7b** 【正式规则】点击系统通知 -> 提示“系统通知已开启”；分类通知开关仍可独立切换。
  来源：liveshow-proto/prototype/annotations/user.js；views/settings/notification-granted.html；交互；SRC-USER-989
## 直播 / 直播间-观众 / views/live-room/gift.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-1ee80e8ea5fa** 【正式规则】礼物：展示名称、图标、单价和可用状态，均由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；字段；SRC-USER-992
- **REQ-cde97638007c** 【正式规则】赠送数量：实际扣减金币 = 单价 × 数量；幸运礼物按独立开奖次数计算。默认数量是否固定为1或取后台配置见SRC-Q04，不能同时采用相反规则。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；字段；SRC-USER-993
- **REQ-02b4cec6f712** 【正式规则】金币余额：普通用户显示真实金币余额；运营账号只显示所属公会发放的虚拟金币余额。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；字段；SRC-USER-994
- **REQ-278c89968d7e** 【正式规则】1. 礼物须处于上架且未过期状态；下架后不可继续赠送，历史记录保留。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；业务；SRC-USER-995
- **REQ-a3146ce60af1** 【正式规则】2. 幸运礼物用户实际消耗 = 送出价值 - 返奖金币；主播收益 = 送出价值 × 后台比例，默认 1%，返奖不影响主播收益。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；业务；SRC-USER-996
- **REQ-f3b24519bf81** 【正式规则】3. 运营账号没有真实金币；虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；业务；SRC-USER-997
- **REQ-f67af203355d** 【正式规则】4. 在各类观众名单中，运营账号只进入在线观众列表，贡献值始终为 0，不进入任何榜单或排行；虚拟金币仅计入公屏消息和礼物效果，不计入主播收益或分成。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；业务；SRC-USER-998
- **REQ-af789570ab08** 【正式规则】5. 运营账号不能加入粉丝团。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；业务；SRC-USER-999
- **REQ-41e896d6a4df** 【正式规则】6. 成功赠送不可退款；请求失败或余额不足时不扣减金币。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；业务；SRC-USER-1000
- **REQ-e2368fc28d21** 【正式规则】1. 选择礼物和数量 -> 显示本次所需金币。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；交互；SRC-USER-1001
- **REQ-a90e378cb478** 【正式规则】2. 普通用户赠送成功 -> 扣减金币、播放礼物效果并更新余额和本场贡献；运营账号赠送成功 -> 扣减虚拟金币并播放礼物效果，只更新公屏氛围。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；交互；SRC-USER-1002
- **REQ-4786c8e013e1** 【正式规则】3. 普通用户余额不足 -> 不扣款并打开充值视图；运营账号虚拟金币不足 -> 不显示充值入口并提示联系公会发放。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift.html；交互；SRC-USER-1003
## 直播 / 直播间-观众 / views/live-room/gift-recharge.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-0855c41075b0** 【正式规则】用户赠送礼物时金币不足，在直播间内进入快捷充值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html；场景；SRC-USER-1004
- **REQ-8d5982a87ed5** 【正式规则】1. 充值套餐、赠送金币和支付渠道按当前端及后台配置展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html；业务；SRC-USER-1005
- **REQ-c73a34af776f** 【正式规则】2. 支付成功后增加金币并生成充值记录；失败、取消或超时不增加余额。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html；业务；SRC-USER-1006
- **REQ-f9ab60ae94cf** 【正式规则】3. 运营账号没有真实金币，不可进入本视图或充值；虚拟金币只能由所属公会发放。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html；业务；SRC-USER-1007
- **REQ-9727ca682096** 【正式规则】1. 选择套餐并支付成功 -> 刷新金币余额并返回礼物视图，原礼物不自动补送。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html；交互；SRC-USER-1008
- **REQ-b0d4b14138c7** 【正式规则】2. 关闭或支付失败 -> 返回礼物视图，保留原礼物和数量选择。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/gift-recharge.html；交互；SRC-USER-1009
## 主播中心 / 粉丝团 / views/fan-club/member-mute-confirm.html
页面入口：liveshow-proto/prototype/pages/user/host/fan-club.html

- **REQ-eb4c43eef4eb** 【正式规则】主播在粉丝团成员列表中禁言指定成员前进行确认。
  来源：liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html；场景描述；SRC-USER-1010
- **REQ-bc94f3ccb9de** 【正式规则】确认对象：展示本次待禁言成员的昵称。
  来源：liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html；字段；SRC-USER-1013
- **REQ-335b51de2acb** 【正式规则】禁言仅限制该成员在当前粉丝群内发言，不影响团籍、关注和直播间发言权限。
  来源：liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html；业务规则；SRC-USER-1015
- **REQ-485fbcc7adeb** 【正式规则】确认 -> 禁止该成员在群内发言并提示成功；取消或请求失败 -> 保持原状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/fan-club/member-mute-confirm.html；交互；SRC-USER-1016
## 直播 / 直播间-观众 / views/live-room/fan-club-not-joined.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-2e9fee72d8e3** 【正式规则】粉丝团：展示主播粉丝团名称、成员数和当前等级。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；字段；SRC-USER-1019
- **REQ-edf7e2e2c7ec** 【正式规则】加入条件：由主播配置，可包含已关注和累计贡献门槛；累计贡献统计用户给当前主播刷出的全部历史贡献，不按入团时间截断。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；字段；SRC-USER-1020
- **REQ-6379266ca1db** 【正式规则】权益：展示加入后可获得的群聊、灯牌和等级权益。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；字段；SRC-USER-1021
- **REQ-d3e5e8ead69b** 【正式规则】1. 运营账号不能进入加入流程或加入粉丝团。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；业务；SRC-USER-1022
- **REQ-3494acc3bd79** 【正式规则】2. 普通用户须满足全部加入条件，且与主播不存在拉黑关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；业务；SRC-USER-1023
- **REQ-785952646d33** 【正式规则】3. 每位主播一期仅有一个粉丝团；达到 500 人上限后不可加入。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；业务；SRC-USER-1024
- **REQ-7a6c1f83dda8** 【正式规则】4. 加入成功后同步获得团籍和群籍；退出后重新加入，粉丝等级和亲密度均从 0 开始。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；业务；SRC-USER-1025
- **REQ-b5a13d0464ec** 【正式规则】1. 运营账号进入本视图 -> 拒绝并返回直播间。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；交互；SRC-USER-1026
- **REQ-cf1973bfe6b6** 【正式规则】2. 条件未满足或加入请求失败 -> 不加入并提示“未满足进群条件”。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；交互；SRC-USER-1027
- **REQ-60deeb4a1919** 【正式规则】3. 加入成功 -> 切换为已加入视图并开放粉丝群入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-not-joined.html；交互；SRC-USER-1028
## 直播 / 直播间-观众 / views/live-room/fan-club-joined.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-4e9798c9a8db** 【正式规则】粉丝等级：用户在当前主播粉丝团内的社群身份等级。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；字段；SRC-USER-1031
- **REQ-8386d8e09e30** 【正式规则】亲密度：用户与当前主播的一对一关系数值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；字段；SRC-USER-1032
- **REQ-8b1e1bef6c14** 【正式规则】团籍状态：与粉丝群成员资格同步。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；字段；SRC-USER-1033
- **REQ-3e1e69cedd1b** 【正式规则】1. 有效团籍用户可进入粉丝群并展示对应灯牌和粉丝等级。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；业务；SRC-USER-1034
- **REQ-c6d052f5db40** 【正式规则】2. 主动退出、被主播移出或账号拉黑 -> 团籍和群籍同时解除，粉丝等级与亲密度清零。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；业务；SRC-USER-1035
- **REQ-d103c8a922b0** 【正式规则】3. 重新加入从 0 开始，不恢复历史等级和亲密度。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；业务；SRC-USER-1036
- **REQ-819f89443862** 【正式规则】查看贡献 -> 进入当前主播贡献榜；退出粉丝团 -> 二次确认后立即更新身份和入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-joined.html；交互；SRC-USER-1037
## 直播 / 直播间-观众 / views/live-room/comment-muted.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-93ef57c009fe** 【正式规则】1. 禁言只限制当前直播场次的公屏发言，不影响观看、送礼和私信。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html；业务；SRC-USER-1038
- **REQ-5227b9ba0f6c** 【正式规则】2. 主播或房管解除禁言后，用户立即恢复发言。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html；业务；SRC-USER-1039
- **REQ-6ea938c58840** 【正式规则】3. 本场未解除禁言时，用户进入同一主播的下一场直播后恢复发言。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html；业务；SRC-USER-1040
- **REQ-941d07bff4b1** 【正式规则】输入框显示禁言状态并不可提交；尝试发送时不生成消息、不写入公屏记录。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/comment-muted.html；交互；SRC-USER-1041
## 直播 / 直播间-观众 / views/live-room/password-room-restricted.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-ba1bd242d5e7** 【正式规则】房间密码：必填，必须为 4-12 个数字；校验当前直播场次的有效密码。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/password-room-restricted.html；字段；SRC-USER-1044
- **REQ-4477c4640fc4** 【正式规则】普通用户的账号封禁、双方拉黑或本场踢出优先于密码校验；巡房人员从有效巡房任务进入时无需密码，平台封禁仍优先拦截。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/password-room-restricted.html；业务；SRC-USER-1045
- **REQ-d9556b7edbc4** 【正式规则】密码不是 4-12 个数字 -> 保留输入并提示“密码必须是4-12个数字”；密码格式有效但不正确 -> 保留输入并提示“密码错误，请重新输入”；密码正确 -> 进入直播间；关闭 -> 返回来源页。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/password-room-restricted.html；交互；SRC-USER-1046
## 直播 / 直播间-观众 / views/live-room/ticket-room-restricted.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-69bd7efa2dc5** 【正式规则】门票价格：主播开播时从后台已启用的价格档位中选择，以金币计价。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；字段；SRC-USER-1049
- **REQ-e8b864cc1485** 【正式规则】金币余额：普通用户使用当前账号实时真实金币余额；运营账号免票，不读取虚拟金币用于购票。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；字段；SRC-USER-1050
- **REQ-765e7055902b** 【正式规则】1. 门票仅对当前直播场次有效，同场重复进入不重复收费。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；业务；SRC-USER-1051
- **REQ-e0aef5d75df8** 【正式规则】2. 场次结束或被踢出后门票失效；已支付金币不退款。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；业务；SRC-USER-1052
- **REQ-ca229929749e** 【正式规则】3. 普通用户的账号封禁、双方拉黑或本场踢出优先于购票状态；巡房人员从有效巡房任务进入时无需购票，平台封禁仍优先拦截。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；业务；SRC-USER-1053
- **REQ-b2574c5a37c3** 【正式规则】4. 运营账号进入门票房时免票，不展示购票弹窗、不生成门票订单、不扣减虚拟金币。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；业务；SRC-USER-1054
- **REQ-24c6113769f2** 【正式规则】普通用户进入直播间后由封面图和毛玻璃完全遮挡直播内容，中央显示购票弹窗；余额充足并确认购买 -> 扣减一次真实金币、生成支出记录并移除遮挡；余额不足 -> 不扣款并打开充值入口；取消 -> 返回来源页。运营账号 -> 免票直接进入直播间。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/ticket-room-restricted.html；交互；SRC-USER-1055
## 直播 / 直播间-观众 / views/live-room/fan-club-room-restricted.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-3fe8df6c3654** 【正式规则】非粉丝团成员进入已开启成员限制的密码房。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html；场景；SRC-USER-1056
- **REQ-7dd2257dd6c7** 【正式规则】1. 粉丝团成员限制与热门区域展示相互独立；非成员进入时按成员限制拦截。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html；业务；SRC-USER-1057
- **REQ-9470fed93329** 【正式规则】2. 已在房内的非成员不退出，离开后再次进入时拦截；有效成员继续校验房间密码。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html；业务；SRC-USER-1058
- **REQ-a401161a1903** 【正式规则】3. 账号封禁、双方拉黑和本场踢出优先；巡房人员和运营账号可绕过成员限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html；业务；SRC-USER-1059
- **REQ-aa5c81fdeda9** 【正式规则】显示直播封面毛玻璃遮挡，标题“无法进入直播间”，提示“访问直播间需先加入主播粉丝团”；点击“返回”回到来源页，无来源时返回首页。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/fan-club-room-restricted.html；交互；SRC-USER-1060
## 直播 / 直播间-观众 / views/live-room/blocked-room-restricted.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-65606d40f4f8** 【正式规则】普通用户进入已被主播拉黑或本场踢出的直播间。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/blocked-room-restricted.html；场景；SRC-USER-1061
- **REQ-b10e1a5c8177** 【正式规则】主播黑名单和本场踢出状态优先于密码、门票状态；普通用户不可观看直播、评论或送礼。巡房人员从有效巡房任务进入时不应用此拦截。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/blocked-room-restricted.html；业务；SRC-USER-1062
- **REQ-7db103b62067** 【正式规则】进入直播间后由封面图和毛玻璃完全遮挡直播内容，中央提示“与主播存在拉黑或被踢出关系”；点击“返回” -> 回到来源页，无来源时返回首页。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/blocked-room-restricted.html；交互；SRC-USER-1063
## 直播 / 直播间-观众 / views/live-room/audience-online.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-4553c1104aa2** 【正式规则】用户：展示头像、昵称及当前身份。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；字段；SRC-USER-1066
- **REQ-aec31acc46bc** 【正式规则】财富等级：按账号有效消费成长值计算。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；字段；SRC-USER-1067
- **REQ-d84ab4e18694** 【正式规则】贡献值：非运营账号展示本场有效贡献值；运营账号固定显示 0。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；字段；SRC-USER-1068
- **REQ-362e0f933368** 【正式规则】房管状态：已授权房管展示房管标识。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；字段；SRC-USER-1069
- **REQ-8a03281a3986** 【正式规则】1. 仅展示当前直播场次仍在线的观众，进入和离开后实时更新。运营账号可以进入在线观众列表，但不进入任何榜单、排行或重点在线观众列表。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；业务；SRC-USER-1070
- **REQ-e365cd2352ca** 【正式规则】2. 被踢出用户立即移出列表，且本场不可重新进入。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；业务；SRC-USER-1071
- **REQ-8cb19b9c119c** 【正式规则】3. 主播、房管和普通观众的可执行操作按当前查看者权限展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；业务；SRC-USER-1072
- **REQ-3f7bd4ee2cee** 【正式规则】点击用户 -> 打开对应资料卡；切换至房管 -> 展示当前主播已授权房管。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-online.html；交互；SRC-USER-1073
## 直播 / 直播间-观众 / views/live-room/audience-managers.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-206d26684951** 【正式规则】房管：展示头像、昵称和在线状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；字段；SRC-USER-1076
- **REQ-f4ce4badd79b** 【正式规则】授权状态：按主播与用户的长期房管关系读取，不随场次结束清除。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；字段；SRC-USER-1077
- **REQ-0819d6cfa48e** 【正式规则】1. 每位主播最多设置 3 名房管；目标用户不得与主播互相拉黑。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；业务；SRC-USER-1078
- **REQ-5a81b3070058** 【正式规则】2. 已授权后任一方建立账号拉黑关系，房管身份自动解除；取消拉黑后不自动恢复。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；业务；SRC-USER-1079
- **REQ-2323cf93fbd8** 【正式规则】3. 房管可在主播直播间执行禁言、踢出和屏蔽单条评论。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；业务；SRC-USER-1080
- **REQ-efab8f963bea** 【正式规则】4. 主播取消授权后立即失去管理权限，不影响其普通观众身份。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；业务；SRC-USER-1081
- **REQ-af9185b720a4** 【正式规则】主播取消房管 -> 二次确认后更新列表；因拉黑自动解除 -> 立即更新房管列表和管理权限；普通观众只读查看，不显示授权操作。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/audience-managers.html；交互；SRC-USER-1082
## 直播 / 直播间-观众 / views/live-room/profile-viewer.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-c386007f05ae** 【正式规则】用户资料：展示头像、昵称、用户 ID、财富等级和粉丝团身份。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html；字段；SRC-USER-1085
- **REQ-0d7e0170e723** 【正式规则】关系状态：分别读取关注、好友和拉黑关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html；字段；SRC-USER-1086
- **REQ-785a3aeb0170** 【正式规则】1. 关注、好友和私信权限分别校验；非好友最多主动发送 3 条私信。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html；业务；SRC-USER-1087
- **REQ-c05d8324a465** 【正式规则】2. 任一方拉黑后不能关注、申请好友或私信，已有相关关系解除。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html；业务；SRC-USER-1088
- **REQ-08e236864c85** 【正式规则】关注或申请好友成功 -> 更新关系状态；举报 -> 进入账号举报流程；点击主页 -> 进入该用户主页。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-viewer.html；交互；SRC-USER-1089
## 直播 / 直播间-观众 / views/live-room/profile-moderator.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-ff8bd44d8b1c** 【正式规则】1. 房管拥有普通资料卡操作，并可对当前场次普通观众执行禁言和踢出。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html；业务；SRC-USER-1090
- **REQ-2bccad5544d4** 【正式规则】2. 房管不能处置主播本人。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html；业务；SRC-USER-1091
- **REQ-b6588491762d** 【正式规则】3. 巡房会话中的人员不可被拉黑或踢出。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html；业务；SRC-USER-1092
- **REQ-6d0e56db7930** 【正式规则】4. 禁言和踢出只作用于当前直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html；业务；SRC-USER-1093
- **REQ-93171f01d8ce** 【正式规则】禁言或踢出 -> 打开对应确认视图；取消 -> 保持用户当前状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator.html；交互；SRC-USER-1094
## 直播 / 直播间-观众 / views/live-room/profile-moderator-mute.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-f057de01c25a** 【正式规则】禁言仅限制目标用户当前场次公屏发言，不影响观看、送礼和私信；下一场默认恢复。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-mute.html；业务；SRC-USER-1095
- **REQ-dfd7d9d8f0c0** 【正式规则】确认 -> 写入本场禁言状态并更新输入框、资料卡和禁言列表；取消或关闭 -> 不改变状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-mute.html；交互；SRC-USER-1096
## 直播 / 直播间-观众 / views/live-room/profile-moderator-remove.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-e1ed9f93e14e** 【正式规则】踢出只作用于当前直播场次；目标用户下一场可重新进入。门票房被踢出后门票失效且不退款。巡房会话中的人员不可被踢出。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-remove.html；业务；SRC-USER-1097
- **REQ-b703802588d7** 【正式规则】确认 -> 用户立即退出、写入本场踢出状态并从在线列表移除；取消或关闭 -> 不改变状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/profile-moderator-remove.html；交互；SRC-USER-1098
## 直播 / 直播间-观众 / views/live-room/contribution-rank.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-893bf42c6af8** 【正式规则】榜单数量：完成全部排序后显示前 99 名；第 99 名与第 100 名贡献值相同时，继续按后续条件确定顺序。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；字段；SRC-USER-1101
- **REQ-3bcbca07ff17** 【正式规则】排名：依次按本场贡献值、当前主播粉丝团内的粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；字段；SRC-USER-1102
- **REQ-ffb9aa7d5e83** 【正式规则】贡献值：贡献值 = 当前场次内非运营账号成功送出的各礼物单价 × 数量之和。幸运礼物按送出礼物价值计算，返奖不冲减贡献值；运营账号及其虚拟金币赠礼不计入。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；字段；SRC-USER-1103
- **REQ-19f134dd3bd2** 【正式规则】我的排名：固定显示在榜单底部；进入榜单时显示排名，未进入榜单时显示“-”。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；字段；SRC-USER-1104
- **REQ-f962dfa52fa4** 【正式规则】1. 运营账号不进入任何榜单或排行；粉丝等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；业务；SRC-USER-1105
- **REQ-3459b28e36fa** 【正式规则】2. 失败或撤销赠送不计入。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；业务；SRC-USER-1106
- **REQ-4f6c746f7dd4** 【正式规则】3. 场次结束后榜单作为历史快照保留。账号注销后保留历史贡献，名称显示“账号已注销”，且不能进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；业务；SRC-USER-1107
- **REQ-b9d08b47167e** 【正式规则】1. 榜单滚动 -> 我的排名固定在底部。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；交互；SRC-USER-1108
- **REQ-35f0f2cdb8bb** 【正式规则】2. 切换贡献榜或收到礼物 -> 保持当前场次范围；点击用户 -> 打开用户资料卡。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-rank.html；交互；SRC-USER-1109
## 直播 / 直播间-观众 / views/live-room/contribution-gifts.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-2164425858fe** 【正式规则】礼物：展示名称、图标和当前场次收到数量，仅统计非运营账号的有效赠送。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html；字段；SRC-USER-1112
- **REQ-d6898a750ac9** 【正式规则】赠送用户：展示本场成功赠送该礼物的非运营账号。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html；字段；SRC-USER-1113
- **REQ-e171728ee878** 【正式规则】贡献值：贡献值 = 礼物单价 × 本场成功送出数量；幸运礼物返奖不冲减该值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html；字段；SRC-USER-1114
- **REQ-73a6c452ef87** 【正式规则】仅统计非运营账号的成功赠送记录；运营账号及其虚拟金币赠礼不进入本明细。幸运礼物展示送出数量和开奖结果，用户净消耗与主播收益按各自口径计算；失败或撤销记录不展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html；业务；SRC-USER-1115
- **REQ-b06b488ac6e5** 【正式规则】切换至贡献榜 -> 返回同一场次的用户排名；点击赠送用户 -> 打开用户资料卡。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/contribution-gifts.html；交互；SRC-USER-1116
## 直播 / 直播间-观众 / views/live-room/more-actions.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-f0047775b3e8** 【正式规则】1. 转发不改变房间准入规则，接收人仍须完成门票、密码和账号关系校验。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html；业务；SRC-USER-1117
- **REQ-1ccf0e47fd86** 【正式规则】2. 举报直播仅在直播中生成当前场次举报工单。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html；业务；SRC-USER-1118
- **REQ-997f0e4ce8f5** 【正式规则】3. 清屏只清除当前设备公屏显示，不删除服务端消息。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html；业务；SRC-USER-1119
- **REQ-c01d5eba49b8** 【正式规则】选择转发 -> 调起系统分享；选择举报 -> 进入直播举报页；选择清屏 -> 立即清空当前显示并关闭菜单；点击遮罩 -> 关闭菜单。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/more-actions.html；交互；SRC-USER-1120
## 直播 / 直播间-观众 / views/live-room/host-profile.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room.html

- **REQ-6277a3604858** 【正式规则】主播资料：展示头像、昵称、主播等级、财富等级和用户 ID。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html；字段；SRC-USER-1123
- **REQ-c345f34b1f34** 【正式规则】直播状态：关联当前直播场次；场次结束后更新为未开播。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html；字段；SRC-USER-1124
- **REQ-9ec645b7cc32** 【正式规则】关系状态：分别读取关注、好友、粉丝团和拉黑关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html；字段；SRC-USER-1125
- **REQ-c4b9ccfef696** 【正式规则】用户与主播共用账号和社交关系；拉黑后不能关注、申请好友、私信、观看直播或加入粉丝团。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html；业务；SRC-USER-1126
- **REQ-8b4de2e92bfd** 【正式规则】进入主页、关注、申请好友、私信和举报均作用于当前主播账号；状态变更后同步更新直播间入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room/host-profile.html；交互；SRC-USER-1127
## 直播 / 直播间-主播 / views/live-room-host/contribution-rank.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-e9993dab3cf5** 【正式规则】统计范围：统计当前直播场次内所有产生有效贡献的非运营账号，包含当前在线和已经离线的用户。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；字段；SRC-USER-1130
- **REQ-63f26c9bcb72** 【正式规则】榜单数量：完成全部排序后显示前 99 名；第 99 名与第 100 名贡献值相同时，继续按后续条件确定顺序。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；字段；SRC-USER-1131
- **REQ-8f07aacf2009** 【正式规则】排名：依次按本场累计贡献值、当前主播粉丝团内的粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序；不设并列名次。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；字段；SRC-USER-1132
- **REQ-c6a2ea42bd56** 【正式规则】用户身份：展示头像、昵称、财富等级、粉丝等级、灯牌和亲密度；无对应身份时不展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；字段；SRC-USER-1133
- **REQ-8c1e857ba17a** 【正式规则】禁言状态：当前场次被禁言用户展示禁言标识。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；字段；SRC-USER-1134
- **REQ-c9cfb5c9cd10** 【正式规则】1. 本场贡献榜为当前场次累计榜，统计在线和非在线的非运营账号；用户离开直播间后仍保留本场贡献值和排名。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；业务；SRC-USER-1135
- **REQ-2693e6205dac** 【正式规则】2. 粉丝等级或财富等级缺失时按 0 级参与排序；排名按完整排序结果连续编号。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；业务；SRC-USER-1136
- **REQ-eb2515f68348** 【正式规则】3. 当前场次贡献值按成功送出礼物价值累计；幸运礼物按单价 × 送出数量计算，返奖不冲减贡献值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；业务；SRC-USER-1137
- **REQ-0e86a476b42c** 【正式规则】4. 运营账号不进入任何榜单或排行，其虚拟金币赠礼不计入本场贡献；失败或撤销赠送不计入。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；业务；SRC-USER-1138
- **REQ-724683519c53** 【正式规则】5. 场次结束后榜单保留为历史快照。账号注销后保留历史贡献，名称显示“账号已注销”，且不能进入主页。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；业务；SRC-USER-1139
- **REQ-de01b695afdc** 【正式规则】切换至观众 -> 展示当前在线观众；点击用户 -> 打开主播权限资料卡；私信 -> 进入与该用户的单聊。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/contribution-rank.html；交互；SRC-USER-1140
## 直播 / 直播间-主播 / views/live-room-host/audience-viewers.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-60b6f9175a54** 【正式规则】主播查看当前直播场次在线观众，按贡献或停留时长识别重点用户并发起私信。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；场景；SRC-USER-1141
- **REQ-1a60536b206e** 【正式规则】用户：展示头像和昵称；仅包含当前仍在线的观众。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；字段；SRC-USER-1144
- **REQ-e54798ae0be9** 【正式规则】财富等级：按累计充值/消费成长值匹配后台等级配置；前端展示服务端等级，无数据时不展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；字段；SRC-USER-1145
- **REQ-cac6d612641a** 【正式规则】灯牌/粉丝等级/亲密度：用户属于当前主播粉丝团时展示；无有效团籍时不展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；字段；SRC-USER-1146
- **REQ-c52d4fdc3625** 【正式规则】停留时长：用户在本场次直播间在线的累计时长。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；字段；SRC-USER-1147
- **REQ-9fca28656a0b** 【正式规则】在线观众贡献：非运营账号展示本场累计有效贡献值；运营账号固定显示 0；已经离线的用户不在本列表展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；字段；SRC-USER-1148
- **REQ-be88a6fab6fe** 【正式规则】禁言状态：当前场次被禁言时展示禁言标识。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；字段；SRC-USER-1149
- **REQ-2578644e5986** 【正式规则】1. 在线观众列表只统计当前在线用户；运营账号仅在本列表展示，贡献值始终为 0，不进入任何榜单、排行或重点在线观众列表。用户离线后从本列表移除，但非运营账号的贡献仍保留在本场贡献榜。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；业务；SRC-USER-1150
- **REQ-c7062d098b61** 【正式规则】2. 列表随进入、离开和踢出实时更新；踢出后立即移除且本场不可重进。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；业务；SRC-USER-1151
- **REQ-dd57da0be4ae** 【正式规则】3. 按贡献时，依次按本场贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；业务；SRC-USER-1152
- **REQ-7b013fce63eb** 【正式规则】4. 按停留时长时，依次按本场累计在线时长、本场贡献值、粉丝等级、财富等级从高到低排序，仍相同时按用户 ID 数字部分从小到大排序。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；业务；SRC-USER-1153
- **REQ-b524a0982a30** 【正式规则】5. 粉丝等级或财富等级缺失时按 0 级参与排序；排序只改变展示顺序，不改变用户身份、权限和处置状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；业务；SRC-USER-1154
- **REQ-c6f5c0f64742** 【正式规则】6. 房管身份单独维护；取消房管后用户仍可作为普通观众留在列表。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；业务；SRC-USER-1155
- **REQ-a063a662e1a3** 【正式规则】1. 切换贡献 TOP10/观众 -> 在当前弹层切换榜单和在线列表。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；交互；SRC-USER-1156
- **REQ-2ffc2695490b** 【正式规则】2. 切换按贡献/按停留时长 -> 立即重排，不关闭弹层。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；交互；SRC-USER-1157
- **REQ-8045bae114a1** 【正式规则】3. 点击私信 -> 进入与该用户的单聊；发送权限仍按好友和拉黑关系校验。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；交互；SRC-USER-1158
- **REQ-46279368c328** 【正式规则】4. 点击用户 -> 打开主播权限资料卡；关闭 -> 返回直播间且保留直播状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/audience-viewers.html；交互；SRC-USER-1159
## 直播 / 直播间-主播 / views/live-room-host/muted-users.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-c71bf30e48ff** 【正式规则】用户：展示头像、昵称及执行禁言时的身份信息。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；字段；SRC-USER-1162
- **REQ-ab7207db7280** 【正式规则】操作人：记录执行禁言的主播或房管。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；字段；SRC-USER-1163
- **REQ-958a73b91b82** 【正式规则】禁言状态：仅关联当前直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；字段；SRC-USER-1164
- **REQ-9c6fd3c3c700** 【正式规则】1. 仅展示当前场次仍处于禁言状态的用户。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；业务；SRC-USER-1165
- **REQ-9af627af6297** 【正式规则】2. 场次结束后全部本场禁言失效，下一场默认恢复。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；业务；SRC-USER-1166
- **REQ-6069a3962a42** 【正式规则】3. 用户离开直播间不自动解除禁言；本场重进后继续生效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；业务；SRC-USER-1167
- **REQ-3edbe4dea7a0** 【正式规则】恢复发言 -> 打开确认视图；确认成功后移出列表并同步更新资料卡和评论输入状态；请求失败时保持禁言并提示“请求失败”。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/muted-users.html；交互；SRC-USER-1168
## 直播 / 直播间-主播 / views/live-room-host/restore-speaking-confirm.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-c3219f87f834** 【正式规则】仅可恢复当前场次仍被禁言的用户；用户已恢复或场次已结束时不重复执行。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/restore-speaking-confirm.html；业务；SRC-USER-1169
- **REQ-2ac3f25807c2** 【正式规则】确认 -> 解除本场禁言、移出禁言列表并恢复公屏输入；取消、关闭或请求失败 -> 保持原状态并给出结果反馈。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/restore-speaking-confirm.html；交互；SRC-USER-1170
## 直播 / 直播间-主播 / views/live-room-host/profile-host.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-8d5c13a69dac** 【正式规则】用户资料：展示头像、昵称、用户 ID、财富等级和粉丝团身份。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；字段；SRC-USER-1173
- **REQ-95831a7a37b6** 【正式规则】房管状态：读取该用户与当前主播的长期房管关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；字段；SRC-USER-1174
- **REQ-539f6028caf6** 【正式规则】本场状态：展示在线、禁言和踢出状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；字段；SRC-USER-1175
- **REQ-0becd67b5ba4** 【正式规则】1. 主播可使用快捷答谢、私信、@、举报，并设置或取消房管、禁言和踢出。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；业务；SRC-USER-1176
- **REQ-5344fcc58302** 【正式规则】2. 快捷答谢只预填公屏文案，不赠送礼物、不自动发送。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；业务；SRC-USER-1177
- **REQ-e02746e1cd78** 【正式规则】3. 房管最多 3 人；双方存在拉黑关系或目标已被踢出时不可新增房管。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；业务；SRC-USER-1178
- **REQ-38db67c70784** 【正式规则】4. 禁言和踢出只作用于当前场次；房管授权长期有效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；业务；SRC-USER-1179
- **REQ-bd214d0c95c6** 【正式规则】5. 目标处于巡房会话时不展示拉黑和踢出操作，服务端拒绝相关请求。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；业务；SRC-USER-1180
- **REQ-2f0fee4f4eac** 【正式规则】点击答谢 -> 关闭资料卡并预填答谢文案；设置或取消房管、禁言或恢复发言、踢出 -> 使用同一确认弹窗；房管达到上限 -> 不执行并提示“已达3人上限”；状态变更后同步更新在线列表、禁言列表和资料卡。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/profile-host.html；交互；SRC-USER-1181
## 直播 / 直播间-主播 / views/live-room-host/thank-message.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-ff25c01afcb1** 【正式规则】答谢对象：使用当前资料卡用户昵称，并以 @用户名 开头。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html；字段；SRC-USER-1184
- **REQ-e7b78f113f73** 【正式规则】答谢语：固定预填“谢谢你送的礼物！”，主播可在发送前修改。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html；字段；SRC-USER-1185
- **REQ-b7ca7912b354** 【正式规则】快捷答谢本质为公屏文案预填，不赠送礼物，不产生礼物记录，也不自动发送。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html；业务；SRC-USER-1186
- **REQ-f69ebd531763** 【正式规则】点击答谢 -> 关闭资料卡并返回直播间输入区 -> 预填“@用户名 谢谢你送的礼物！”并聚焦输入框 -> 主播修改或直接点击发送后才写入公屏。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/thank-message.html；交互；SRC-USER-1187
## 直播 / 直播间-主播 / views/live-room-host/focus-viewers.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-aec7812cf44d** 【正式规则】1. 展示数据：底部抽屉展示 20 名重点在线观众；顶部入口展示排序后的前 3 名头像。（不包含运营账号）
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html；；SRC-USER-1188
- **REQ-067a480d10c4** 【正式规则】2. 筛选排序：依次按本场贡献值、财富等级、粉丝等级，从高到低排序，仍相同时按用户 ID 数字部分从小到大排序。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html；；SRC-USER-1189
- **REQ-39a403574b44** 【正式规则】3. 标签：只命中这 20 名重点在线观众，同一个用户可展示多个标签
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html；；SRC-USER-1190
- **REQ-c6eb7b3bd094** 【正式规则】　a. 新粉丝：本场直播首次关注主播，且关注关系仍有效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html；；SRC-USER-1191
- **REQ-3861789a522d** 【正式规则】　b. 本场最高：有效贡献值最高的用户。并列最高时均显示该标签。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html；；SRC-USER-1192
- **REQ-269d917500e3** 【正式规则】　c. 未加入粉丝团：当前未加入该主播粉丝团的用户。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/focus-viewers.html；；SRC-USER-1193
## 直播 / 直播间-主播 / views/live-room-host/cohost-hosts.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-b51157ca2a95** 【正式规则】主播：展示头像、昵称、主播 ID 和当前直播状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；字段；SRC-USER-1196
- **REQ-7663ba4adb12** 【正式规则】邀请状态：可为可邀请、邀请中、已接受、已拒绝或已失效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；字段；SRC-USER-1197
- **REQ-ba440454dea1** 【正式规则】1. 仅普通房支持连麦，固定两位主播，不支持观众上麦。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；业务；SRC-USER-1198
- **REQ-998a409d3f74** 【正式规则】2. 双方须正在直播、均未处于连麦中且不存在账号拉黑关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；业务；SRC-USER-1199
- **REQ-d39b60626045** 【正式规则】3. 发起方同一时间只能存在 1 个待处理邀请；接收方可以收到多个邀请。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；业务；SRC-USER-1200
- **REQ-896cb3d54181** 【正式规则】4. 任一邀请被接受并建立连麦后，双方发出的邀请和收到的邀请均失效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；业务；SRC-USER-1201
- **REQ-9cabc0052bd3** 【正式规则】5. 任一方结束直播或变更为受限房型 -> 不再满足的邀请失效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；业务；SRC-USER-1202
- **REQ-c61820f3a34e** 【正式规则】邀请成功 -> 标记邀请中并禁止重复发送；搜索无结果或主播未在普通房直播 -> 显示“查询结果为空或主播未在普通房直播”；请求失败 -> 不生成邀请并提示“请求失败”；搜索结果在固定高度覆盖层展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts.html；交互；SRC-USER-1203
## 直播 / 直播间-主播 / views/live-room-host/cohost-hosts-search-result.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-10d9464e5cf8** 【正式规则】搜索关键词：必填，支持主播 ID 或昵称，去除首尾空格后匹配。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html；字段；SRC-USER-1206
- **REQ-23f21efd608e** 【正式规则】搜索结果：展示主播身份、开播状态和可邀请状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html；字段；SRC-USER-1207
- **REQ-06320379990c** 【正式规则】仅返回当前在普通房直播、未连麦且双方无账号拉黑关系的主播。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html；业务；SRC-USER-1208
- **REQ-01ba04ab6f1d** 【正式规则】关键词为空 -> 返回未搜索状态；无匹配或主播未在普通房直播 -> 显示“查询结果为空或主播未在普通房直播”；点击结果 -> 发送邀请；已有发出的请求 -> 提示“已有发出请求，请先取消”。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-hosts-search-result.html；交互；SRC-USER-1209
## 直播 / 直播间-主播 / views/live-room-host/cohost-invite-notice.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-dd505ebbc191** 【正式规则】邀请主播：展示头像、昵称和当前待处理邀请数。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html；字段；SRC-USER-1212
- **REQ-b7298736c3da** 【正式规则】有效状态：邀请双方仍在播、未连麦且房型为普通房时有效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html；字段；SRC-USER-1213
- **REQ-4448685eca10** 【正式规则】1. 仅展示当前有效邀请；失效邀请立即关闭或从列表移除。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html；业务；SRC-USER-1214
- **REQ-daca7ba050e7** 【正式规则】2. 单个邀请提示停留 4 秒；新增邀请更新当前提示，不重复叠加。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html；业务；SRC-USER-1215
- **REQ-a23e1aaf6516** 【正式规则】3. 任一邀请被接受并建立连麦后，双方发出的邀请和收到的邀请均失效。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html；业务；SRC-USER-1216
- **REQ-8e073f67f5ac** 【正式规则】接受 -> 再次校验条件后建立连麦；拒绝 -> 关闭该邀请；点击提示 -> 打开全部待处理邀请；处理后同步更新数量。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/cohost-invite-notice.html；交互；SRC-USER-1217
## 直播 / 直播间-主播 / views/live-room-host/share-recipient.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-80ec6ee3fa86** 【正式规则】接收对象：可选当前主播粉丝群或好友；无权限对象不展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html；字段；SRC-USER-1220
- **REQ-15691da28a36** 【正式规则】分享内容：使用当前直播场次标题、封面和房间入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html；字段；SRC-USER-1221
- **REQ-6c45269587e6** 【正式规则】分享不绕过门票、密码、拉黑、封禁和本场踢出校验；接收人仍按进入规则处理。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html；业务；SRC-USER-1222
- **REQ-25526c8fa9c1** 【正式规则】选择对象并确认 -> 发送直播房间卡片并提示成功；取消或关闭 -> 不生成消息；发送失败 -> 不生成消息并提示“发送失败”。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/share-recipient.html；交互；SRC-USER-1223
## 直播 / 直播间-主播 / views/live-room-host/more-actions.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-acd2a2f137b3** 【正式规则】1. 美颜参数仅影响主播画面。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html；业务；SRC-USER-1224
- **REQ-b9c319df6a6f** 【正式规则】2. 禁用用户读取当前场次禁言列表。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html；业务；SRC-USER-1225
- **REQ-f54a4a618c3d** 【正式规则】3. 房间密码仅密码房可修改；普通房和门票房入口不可用。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html；业务；SRC-USER-1226
- **REQ-25a1824a7fdf** 【正式规则】4. 清屏只清除主播当前设备显示，不删除服务端消息。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html；业务；SRC-USER-1227
- **REQ-2b995b5918ee** 【正式规则】选择功能 -> 打开对应设置或视图；转发 -> 进入接收对象视图；点击遮罩或关闭 -> 返回直播间。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/more-actions.html；交互；SRC-USER-1228
## 直播 / 直播间-主播 / views/live-room-host/end-confirm.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host.html

- **REQ-a0e4f03ffc67** 【正式规则】结束直播会关闭当前场次，使连麦、待处理邀请、门票和本场禁言/踢出状态失效；历史消息、消费、处置和收益记录保留。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/end-confirm.html；业务；SRC-USER-1229
- **REQ-774cd6cae0ac** 【正式规则】确认 -> 结束场次并进入主播结束页；取消或关闭 -> 返回直播间继续直播；重复确认只处理一次。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host/end-confirm.html；交互；SRC-USER-1230
## 直播 / 直播间-主播-密码房 / views/live-room-host-password/more-actions.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host-password.html

- **REQ-4bedc9a19849** 【正式规则】1. 密码房不提供连麦入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html；业务；SRC-USER-1231
- **REQ-5dee32f8a8be** 【正式规则】2. 可使用美颜、禁用用户、修改本场密码、访问范围、清屏和转发。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html；业务；SRC-USER-1232
- **REQ-a4ddee5fdfc4** 【正式规则】3. 主播修改密码后，已通过旧密码验证的在线用户不强制退出；用户退出后再次进入，必须输入新密码。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html；业务；SRC-USER-1233
- **REQ-641de67315f1** 【正式规则】选择访问范围或房间密码 -> 打开对应视图；其他操作沿用主播直播间规则；关闭 -> 返回直播间。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/more-actions.html；交互；SRC-USER-1234
## 直播 / 直播间-主播-密码房 / views/live-room-host-password/room-password.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host-password.html

- **REQ-230cf3d4b4a5** 【正式规则】房间密码：必填，必须为 4-12 个数字，归属当前直播场次。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/room-password.html；字段；SRC-USER-1237
- **REQ-864985142d88** 【正式规则】主播修改密码后，已通过旧密码验证的在线用户不强制退出；用户退出后再次进入，必须输入新密码。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/room-password.html；业务；SRC-USER-1238
- **REQ-981e32a661ac** 【正式规则】密码不是 4-12 个数字 -> 不保存、保留输入并提示“密码必须是4-12个数字”；保存成功 -> 更新本场有效密码并关闭视图；取消 -> 保留原密码。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/room-password.html；交互；SRC-USER-1239
## 直播 / 直播间-主播-密码房 / views/live-room-host-password/access-scope.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-host-password.html

- **REQ-3ca7c3b2c774** 【正式规则】在广场展示：开启后在首页热门区域展示，关闭后不展示；无历史时默认开启。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html；字段；SRC-USER-1242
- **REQ-f78755ed9c16** 【正式规则】仅粉丝团成员可进入直播间：默认读取上次确认值；无历史时默认关闭。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html；字段；SRC-USER-1243
- **REQ-dea285737e5c** 【正式规则】1. 仅修改当前密码房的访问范围；两个开关相互独立，并将确认值保存为下次默认值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html；业务；SRC-USER-1244
- **REQ-b6676dac093c** 【正式规则】2. 成员限制只对后续进房生效；已在房内的非成员不退出，离开后再次进入时拦截。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html；业务；SRC-USER-1245
- **REQ-ff750ec7237b** 【正式规则】3. 成员仍需通过房间密码校验；主播未创建粉丝团时不可开启。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html；业务；SRC-USER-1246
- **REQ-cdb294f63f09** 【正式规则】点击确认 -> 设置生效并关闭；关闭或点击遮罩 -> 不保存。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-host-password/access-scope.html；交互；SRC-USER-1247
## 直播 / 直播间-连麦中-主播 / views/live-room-cohost-active/more-actions.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-cohost-active.html

- **REQ-1b3723e69429** 【正式规则】1. 连麦中仍可使用美颜、观众管理、清屏和转发。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/more-actions.html；业务；SRC-USER-1248
- **REQ-dfcc81329516** 【正式规则】2. 连麦期间不得切换为门票房或密码房，也不得再次发起连麦。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/more-actions.html；业务；SRC-USER-1249
- **REQ-3faa678d6809** 【正式规则】选择观众管理或转发 -> 打开对应视图且不中断连麦；尝试受限操作 -> 不执行并提示先退出连麦。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/more-actions.html；交互；SRC-USER-1250
## 直播 / 直播间-连麦中-主播 / views/live-room-cohost-active/cohost-exit-confirm.html
页面入口：liveshow-proto/prototype/pages/user/live/live-room-cohost-active.html

- **REQ-48103598b4fd** 【正式规则】主动退出只结束双方连麦关系，不结束任何一方的直播场次；本场贡献、消息和观众数据继续累计。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/cohost-exit-confirm.html；业务；SRC-USER-1251
- **REQ-cb749c9028a7** 【正式规则】确认 -> 双方退出连麦画面并恢复各自单人直播；取消或关闭 -> 保持连麦；请求失败 -> 保持当前画面并提示“退出失败”。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-room-cohost-active/cohost-exit-confirm.html；交互；SRC-USER-1252
## 首页与福利 / 充值福利 / views/welfare-center/claimed.html
页面入口：liveshow-proto/prototype/pages/user/home/welfare-center.html

- **REQ-c170e2d091ee** 【正式规则】用户查看签到和任务奖励均已领取的状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；场景描述；SRC-USER-1253
- **REQ-8662e6ad9b0b** 【正式规则】签到 / 任务奖励：展示当前账号的签到及任务奖励。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；字段；SRC-USER-1256
- **REQ-b6f72bec0506** 【正式规则】领取状态：当前视图中均为已领取，不可重复领取。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；字段；SRC-USER-1257
- **REQ-6632f4e4635a** 【正式规则】1. 已领取奖励不可再次领取；领取状态按任务实例保存。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；业务规则；SRC-USER-1258
- **REQ-73f8074b14bd** 【正式规则】2. 金币奖励进入钱包，生成余额明细。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；业务规则；SRC-USER-1259
- **REQ-26eaaaab69d2** 【正式规则】3. 任务配置后续变更不重复补发已领取实例。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；业务规则；SRC-USER-1260
- **REQ-56f0069c550e** 【正式规则】1. 已领取项保持禁用，不重复发放资产。
  来源：liveshow-proto/prototype/annotations/user.js；views/welfare-center/claimed.html；交互；SRC-USER-1261
## 首页与福利 / 邀请好友 / views/invite-friends/share-options.html
页面入口：liveshow-proto/prototype/pages/user/home/invite-friends.html

- **REQ-d11c75bf62bb** 【正式规则】用户选择邀请内容的分享方式。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；场景描述；SRC-USER-1262
- **REQ-62c75b3707ef** 【正式规则】分享方式：复制链接、发送给好友、保存图片。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；字段；SRC-USER-1265
- **REQ-e0252e896677** 【正式规则】分享内容关联当前账号的邀请信息；分享动作本身不计为成功邀请。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；业务规则；SRC-USER-1266
- **REQ-fbfb1eb51f5d** 【正式规则】1. 复制链接 -> 提示“复制成功”。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；交互；SRC-USER-1267
- **REQ-3604372c499d** 【正式规则】2. 发送给好友 -> 调起系统分享能力。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；交互；SRC-USER-1268
- **REQ-da2608c6a06e** 【正式规则】3. 保存图片 -> 给出保存结果反馈。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；交互；SRC-USER-1269
- **REQ-a8641093d479** 【正式规则】4. 点击取消或遮罩 -> 关闭分享选项。
  来源：liveshow-proto/prototype/annotations/user.js；views/invite-friends/share-options.html；交互；SRC-USER-1270
## 消息与社交 / 消息 / views/message-center/fan-group.html
页面入口：liveshow-proto/prototype/pages/user/social/message-center.html

- **REQ-776a489d82e2** 【正式规则】用户在消息中心切换至粉丝团，查看自己的粉丝群会话。
  来源：liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html；场景描述；SRC-USER-1271
- **REQ-166ac32cece0** 【正式规则】会话：展示粉丝团名称、主播头像、最后一条消息和未读数。
  来源：liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html；字段；SRC-USER-1274
- **REQ-ee8338f0b419** 【正式规则】群成员状态：读取当前有效团籍；团籍与群籍同步。
  来源：liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html；字段；SRC-USER-1275
- **REQ-c30267385ce8** 【正式规则】粉丝群会话与私信分开；只有有效团籍用户可进入。主动退出、被移出或拉黑主播后立即失去群聊权限。
  来源：liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html；业务规则；SRC-USER-1276
- **REQ-c86066227c11** 【正式规则】数据范围：当前账号有效团籍对应的粉丝群会话；按最后消息时间倒序，时间相同时按会话 ID 从大到小排序。
  来源：liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html；业务规则；SRC-USER-1277
- **REQ-a51dadac6c4f** 【正式规则】进入会话 -> 清除当前会话未读数；团籍失效后立即从消息列表移除，不再保留入口。
  来源：liveshow-proto/prototype/annotations/user.js；views/message-center/fan-group.html；交互；SRC-USER-1278
## 消息与社交 / 用户主页 / views/user-home/friend.html
页面入口：liveshow-proto/prototype/pages/user/social/user-home.html

- **REQ-955a0c8a7a36** 【正式规则】用户查看已建立好友关系的账号主页。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；场景描述；SRC-USER-1279
- **REQ-5eefd02c9370** 【正式规则】账号资料 / 社交数据：沿用当前用户主页的数据。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；字段；SRC-USER-1282
- **REQ-50aab0344e7b** 【正式规则】好友状态：当前双方已建立好友关系，提供删除好友操作。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；字段；SRC-USER-1283
- **REQ-a50d5998177c** 【正式规则】1. 好友关系建立后双方可持续私信，关注关系仍独立管理。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；业务规则；SRC-USER-1284
- **REQ-9a9717d9ef11** 【正式规则】2. 删除好友只解除好友关系并清空双方聊天记录，不自动取消关注。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；业务规则；SRC-USER-1285
- **REQ-082f25a3ebd8** 【正式规则】3. 任一方拉黑时好友关系立即解除，并删除双方私信会话和聊天记录。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；业务规则；SRC-USER-1286
- **REQ-99fc9d284772** 【正式规则】私信 -> 进入单聊；删除好友 -> 二次确认后更新主页关系状态；关注或取消关注 -> 仅更新关注关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/friend.html；交互；SRC-USER-1287
## 消息与社交 / 用户主页 / views/user-home/blocked.html
页面入口：liveshow-proto/prototype/pages/user/social/user-home.html

- **REQ-a60f062e2394** 【正式规则】用户查看已拉黑账号的主页状态。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；场景描述；SRC-USER-1288
- **REQ-dc194989e388** 【正式规则】账号资料：沿用当前查看对象的资料。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；字段；SRC-USER-1291
- **REQ-474f1a8540ea** 【正式规则】拉黑状态：当前账号已拉黑该对象，隐藏关注、好友和私信操作。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；字段；SRC-USER-1292
- **REQ-32dea9afdf9e** 【正式规则】1. 双方不能搜索、关注、申请好友、私信或进入对方主持的直播间。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；业务规则；SRC-USER-1293
- **REQ-d36b7292b0f0** 【正式规则】2. 已有关注、好友、好友申请和加入对方粉丝团的关系立即解除；双方私信会话和聊天记录清空。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；业务规则；SRC-USER-1294
- **REQ-d3bf358fce83** 【正式规则】3. 取消拉黑只解除当前拉黑记录，不恢复任何历史关系、会话、聊天记录、粉丝等级或亲密度。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；业务规则；SRC-USER-1295
- **REQ-1926bb76e519** 【正式规则】拉黑状态下隐藏关注、好友和私信操作；取消拉黑确认 -> 恢复可操作状态，但关系均显示未建立。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/blocked.html；交互；SRC-USER-1296
## 消息与社交 / 用户主页 / views/user-home/block-confirm.html
页面入口：liveshow-proto/prototype/pages/user/social/user-home.html

- **REQ-c97601e7e371** 【正式规则】用户确认是否拉黑当前查看或聊天的账号。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html；场景描述；SRC-USER-1297
- **REQ-b75796eb46ec** 【正式规则】确认对象：展示当前要拉黑的账号昵称。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html；字段；SRC-USER-1300
- **REQ-9995ab8d0cb0** 【正式规则】后果说明：提示拉黑后的关系和聊天限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html；字段；SRC-USER-1301
- **REQ-0fa927605373** 【正式规则】确认拉黑后同步解除双方关注、好友和加入对方粉丝团的关系，使好友申请失效，并删除双方私信会话和聊天记录。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html；业务规则；SRC-USER-1302
- **REQ-abe87a69eeb6** 【正式规则】确认拉黑 -> 执行并切换为拉黑状态；取消或关闭 -> 不改变现有关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/user-home/block-confirm.html；交互；SRC-USER-1303
## 消息与社交 / 主播主页 / views/host-home/block-confirm.html
页面入口：liveshow-proto/prototype/pages/user/social/host-home.html

- **REQ-95129d4005b1** 【正式规则】用户确认是否拉黑当前查看或聊天的账号。
  来源：liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html；场景描述；SRC-USER-1304
- **REQ-9cde91427f94** 【正式规则】确认对象：展示当前要拉黑的账号昵称。
  来源：liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html；字段；SRC-USER-1307
- **REQ-cae5bdc6b7ff** 【正式规则】后果说明：提示拉黑后的关系和聊天限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html；字段；SRC-USER-1308
- **REQ-df99dc71b10b** 【正式规则】主播与用户共用账号关系；拉黑后果与用户主页一致。
  来源：liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html；业务规则；SRC-USER-1309
- **REQ-11a57e28b885** 【正式规则】确认拉黑 -> 执行并切换为拉黑状态；取消或关闭 -> 不改变现有关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/host-home/block-confirm.html；交互；SRC-USER-1310
## 消息与社交 / 单聊设置 / views/chat-settings/block-confirm.html
页面入口：liveshow-proto/prototype/pages/user/social/chat-settings.html

- **REQ-2109aeeed62f** 【正式规则】用户确认是否拉黑当前查看或聊天的账号。
  来源：liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html；场景描述；SRC-USER-1311
- **REQ-37eae32c2ffc** 【正式规则】确认对象：展示当前要拉黑的账号昵称。
  来源：liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html；字段；SRC-USER-1314
- **REQ-954bde6b1cb5** 【正式规则】后果说明：提示拉黑后的关系和聊天限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html；字段；SRC-USER-1315
- **REQ-8ae64e9a5101** 【正式规则】确认拉黑后删除双方私信会话并清空聊天记录，同时按账号拉黑规则解除相关关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html；业务规则；SRC-USER-1316
- **REQ-8aeb21c36ba4** 【正式规则】确认拉黑 -> 执行并退出当前会话；取消或关闭 -> 不改变现有关系。
  来源：liveshow-proto/prototype/annotations/user.js；views/chat-settings/block-confirm.html；交互；SRC-USER-1317
## 主播中心 / 开播设置 / views/start-live-settings/category.html
页面入口：liveshow-proto/prototype/pages/user/host/start-live-settings.html

- **REQ-ab4898c01e48** 【正式规则】主播为本场直播选择直播分类。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html；场景描述；SRC-USER-1318
- **REQ-1819a9adf380** 【正式规则】直播分类：必选，名称、排序和上下架状态由平台配置。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html；字段；SRC-USER-1321
- **REQ-ed88a88d979f** 【正式规则】分类归属本次直播场次；已下架分类不可新选，历史场次仍保留原分类快照。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html；业务规则；SRC-USER-1322
- **REQ-7abbae2cbf4f** 【正式规则】数据范围：平台当前已启用的直播分类；按平台配置顺序展示。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html；业务规则；SRC-USER-1323
- **REQ-fc7e894ddfad** 【正式规则】选择分类 -> 回填并关闭视图；关闭未选择 -> 保留原分类。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/category.html；交互；SRC-USER-1324
## 主播中心 / 开播设置 / views/start-live-settings/room-normal.html
页面入口：liveshow-proto/prototype/pages/user/host/start-live-settings.html

- **REQ-44b5cc6539d5** 【正式规则】主播在房型设置中选择普通房。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html；场景描述；SRC-USER-1325
- **REQ-64b6978e29d1** 【正式规则】房型：当前选中普通房，无门票或密码必填项。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html；字段；SRC-USER-1328
- **REQ-5cfa79a9f8a9** 【正式规则】1. 账号可用、与主播无拉黑关系且未被本场踢出的用户可免费进入。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html；业务规则；SRC-USER-1329
- **REQ-6028b1185755** 【正式规则】2. 普通房支持固定两位主播连麦，不支持观众上麦。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html；业务规则；SRC-USER-1330
- **REQ-4c51ca6d2856** 【正式规则】3. 房型归属本次直播场次，历史场次不随修改变化。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html；业务规则；SRC-USER-1331
- **REQ-093fe1dd2a00** 【正式规则】选择普通房 -> 清除门票和密码必填校验；确认 -> 回填房型并关闭视图。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-normal.html；交互；SRC-USER-1332
## 主播中心 / 开播设置 / views/start-live-settings/room-ticket.html
页面入口：liveshow-proto/prototype/pages/user/host/start-live-settings.html

- **REQ-6529d274aaae** 【正式规则】主播选择门票房并设置本场门票价格。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html；场景描述；SRC-USER-1333
- **REQ-c121ced11e59** 【正式规则】门票价格：必选；后台已启用的价格档位全部平铺展示，按后台排序，只能单选。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html；字段；SRC-USER-1336
- **REQ-cbdd46f3182a** 【正式规则】1. 门票房受平台功能开关控制，关闭时不可选择。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html；业务规则；SRC-USER-1337
- **REQ-72c8527da96e** 【正式规则】2. 选中的价格保存到当前场次；后台后续调整档位不影响已创建场次。同场重复进入不收费；场次结束或被踢出后失效且不退款。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html；业务规则；SRC-USER-1338
- **REQ-7a7c2492aa7e** 【正式规则】3. 门票房不支持连麦。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html；业务规则；SRC-USER-1339
- **REQ-f0338018c836** 【正式规则】选择门票房 -> 平铺展示后台已启用的价格档位；点击档位 -> 切换单选；未选择或档位已停用 -> 不保存并提示“请选择有效的门票价格”；选择有效档位 -> 回填门票房和价格。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-ticket.html；交互；SRC-USER-1340
## 主播中心 / 开播设置 / views/start-live-settings/room-password.html
页面入口：liveshow-proto/prototype/pages/user/host/start-live-settings.html

- **REQ-89b127255488** 【正式规则】主播选择密码房并配置密码、广场展示和粉丝团成员限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；场景描述；SRC-USER-1341
- **REQ-86e289d6cfe3** 【正式规则】房间密码：必填，必须为 4-12 个数字。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；字段；SRC-USER-1344
- **REQ-dc235f7c2bf6** 【正式规则】广场展示：开启后在首页热门区域展示，关闭后不展示；无历史时默认开启。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；字段；SRC-USER-1345
- **REQ-3bdf3754e70c** 【正式规则】仅粉丝团成员可进入直播间：开启后仅当前有效粉丝团成员可进入；无历史时默认关闭。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；字段；SRC-USER-1346
- **REQ-53e9b6c33224** 【正式规则】1. 密码房受平台功能开关控制，关闭时不可选择。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；业务规则；SRC-USER-1347
- **REQ-88382db58b6e** 【正式规则】2. 密码归属当前场次；密码房不支持连麦。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；业务规则；SRC-USER-1348
- **REQ-d9b6ac40d0c0** 【正式规则】3. “在广场展示”仅控制是否在首页热门区域展示，不参与任何用户准入或拦截判断。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；业务规则；SRC-USER-1349
- **REQ-06d8ee744d9c** 【正式规则】4. 账号封禁、拉黑和本场踢出优先于成员及密码校验；巡房人员和运营账号可绕过成员限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；业务规则；SRC-USER-1350
- **REQ-e062a47c85b6** 【正式规则】5. 两个开关读取上次确认值；首次使用默认广场展示开启、成员限制关闭。主播未创建粉丝团时不可开启成员限制。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；业务规则；SRC-USER-1351
- **REQ-d4f53c27a496** 【正式规则】1. 密码不是 4-12 个数字 -> 不保存、保留输入并提示“密码必须是4-12个数字”。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；交互；SRC-USER-1352
- **REQ-bd41a7851fc0** 【正式规则】2. 切换访问开关后点击确认 -> 保存本场配置和下次默认值并回填；关闭抽屉或点击遮罩 -> 不保存修改。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/room-password.html；交互；SRC-USER-1353
## 主播中心 / 开播设置 / views/start-live-settings/beauty.html
页面入口：liveshow-proto/prototype/pages/user/host/start-live-settings.html

- **REQ-521a5a094ae5** 【正式规则】主播开播前调整美颜、美型项目及强度。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html；场景描述；SRC-USER-1354
- **REQ-fb4014206a18** 【正式规则】模式：可切换美颜和美型，两组参数独立保存。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html；字段；SRC-USER-1357
- **REQ-1ca4723b430e** 【正式规则】强度：取值 0-100，默认 50。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html；字段；SRC-USER-1359
- **REQ-bf6d09e6b9e0** 【正式规则】美颜参数只影响主播视频画面，不改变上传封面和历史直播记录。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html；业务规则；SRC-USER-1360
- **REQ-2285196251a6** 【正式规则】选择项目并拖动 -> 实时预览；恢复默认 -> 清除选中项并将全部参数重置为 50；完成 -> 保留当前参数并关闭。
  来源：liveshow-proto/prototype/annotations/user.js；views/start-live-settings/beauty.html；交互；SRC-USER-1361
## 主播中心 / 直播数据 / views/live-data/month.html
页面入口：liveshow-proto/prototype/pages/user/host/live-data.html

- **REQ-bf10c86d8e47** 【正式规则】主播查看所选月份的直播数据。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；场景描述；SRC-USER-1362
- **REQ-c402888007e4** 【正式规则】月份：默认当前自然月，可切换有数据的历史月份；无数据月份全部指标显示 0。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；字段；SRC-USER-1365
- **REQ-fe275bdddcc6** 【正式规则】收益：汇总所选月份主播收益：普通/定制礼物及门票按成功支付金币；幸运礼物按送出价值 × 后台比例，默认 1%；虚拟金币、失败或撤销消费不计入。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；字段；SRC-USER-1366
- **REQ-5a1a0b9e97d6** 【正式规则】有效天：按主播所属自然日汇总有效直播时长；单日累计 >= 3 小时计 1 天，每日最多 1 天。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；字段；SRC-USER-1367
- **REQ-6377954ab1f2** 【正式规则】开播时长：所选月份各场次有效直播时长之和；进行中场次使用实时值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；字段；SRC-USER-1368
- **REQ-9cd4428aac1c** 【正式规则】观众人次：展示所选月份的观看统计值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；字段；SRC-USER-1369
- **REQ-32c93326751c** 【正式规则】新增粉丝/送礼人数：展示所选月份的统计值。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；字段；SRC-USER-1370
- **REQ-35b563854ebd** 【正式规则】仅统计已形成有效记录的直播场次；场次结束后数据保留。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；业务规则；SRC-USER-1371
- **REQ-7bd77999d6f0** 【正式规则】数据范围：当前主播所选自然月的有效直播记录；按时间顺序展示趋势，明细列表默认按日期倒序。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；业务规则；SRC-USER-1372
- **REQ-3fd9ae9a2d19** 【正式规则】切换月份 -> 同步更新全部指标和明细入口；无数据月份展示 0，不沿用上一月份数据。
  来源：liveshow-proto/prototype/annotations/user.js；views/live-data/month.html；交互；SRC-USER-1373

## 跨页面公共约定

- **COMMON-user-1** 【正式规则】用户App日期时间字段使用dd/mm/yyyy HH.mm，纯日期不附加时间。注销冷静期另有格式批注的差异保留待确认。
  来源：liveshow-proto/prototype/Luma Live-原型说明.md:视觉规则

## 来源差异和范围问题

- **SRC-Q04** 【需求待确认】礼物赠送初始数量是否固定为1，还是取后台defaultCount配置？用户端批注与后台可编辑表单存在冲突，待确认前隔离默认选择结果，仍覆盖主动选择数量后的扣款和开奖。
  依据：views/live-room/gift.html批注与admin-gift-send-count-rule-detail.html当前表单。

- **SRC-Q09** 【需求待确认】系统概要禁止运营账号‘注销登录’，该限制是仅注销账号、仅退出登录，还是两者都禁止？
  依据：系统概要3.7.4与settings页面的两个独立入口。
- **SRC-Q12** 【需求待确认】注销冷静期截止时间采用App通用dd/mm/yyyy HH.mm，还是该视图批注中的MM/DD HH:mm？
  依据：prototype/Luma Live-原型说明.md与deletion-cooling视图。
