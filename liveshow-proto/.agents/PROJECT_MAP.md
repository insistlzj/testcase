# 项目地图

> 用途：帮助 Agent 快速定位原型、规则、批注和页面，不代替当前文件。
>
> 维护模式：AI 自动生成，可自动刷新
>
> 生成日期：2026-08-26
>
> 项目根目录：`D:\testcase_html\liveshow-proto`
>
> 快照分支：`main`
>
> 快照 Commit：`a8f883348e220256822818fce744b7c09d3b6f74`

## 1. 快速定位表

| 问题关键词 | 首选模块 | 首选目录或文件 | 说明 |
|---|---|---|---|
| 全部端、页面树、模块归属 | 原型查看器 | `prototype/index.html` | 三端页面数组、模块组和路径映射的当前入口 |
| 用户、主播、直播、社交、钱包 | 用户/主播 App | `prototype/pages/user/` | 主播不是独立端，是用户 App 内身份和功能域 |
| 公会、主播管理、运营消息、公会收益 | 公会 App | `prototype/pages/guild/` | 公会移动端原型 |
| 审核、配置、订单、财务、报表 | 管理后台 | `prototype/pages/admin/` | 桌面 Web 原型 |
| 业务规则、角色、权限 | 需求上下文 | `context/` | 规则未明确时不得只凭页面文案推断 |
| 页面隐藏规则、交互、权限 | 原型批注 | `prototype/assets/annotations.js` | 页面可视内容之外的现行说明 |
| 用户、公会 Mock | 公共数据 | `prototype/assets/mock.js` | 跨页面实体应保持一致 |
| 后台 Mock、统计数据 | 后台数据 | `prototype/assets/admin-mock.js` | 报表与后台页面的展示数据 |

## 2. 原型阅读路线

1. 从 `项目说明.md` 确认产品范围和现行规则来源。
2. 从 `prototype/index.html` 确认端、模块、页面登记和实际文件路径。
3. 打开对应 `prototype/pages/<端>/<模块>/` 页面核对可见控件和跳转。
4. 读取 `prototype/assets/annotations.js` 核对页面外业务规则、权限和边界。
5. 读取 `prototype/assets/mock.js` 或 `admin-mock.js` 核对字段、状态和计算样例。
6. 涉及完整业务链路时继续读取 `context/` 下对应角色、需求和权限规则。

## 3. 端与模块地图

| 端 | 页面树模块 | 登记页面数 | 主要目录 | 定位 |
|---|---|---:|---|---|
| 用户/主播 App | 系统入口、首页与福利、直播、消息与社交、我的、公会关系、主播中心、钱包与账单 | 64 | `prototype/pages/user/` | 移动端；用户和主播共用账号及 App |
| 公会 App | 登录与首页、主播管理、运营工具、公会管理、数据与收益 | 31 | `prototype/pages/guild/` | 移动端；面向公会运营人员 |
| 管理后台 Web | 工作台、用户管理、主播管理、举报处理、公会管理、礼物道具、运营配置、订单管理、财务分成、数据分析、系统配置 | 83 | `prototype/pages/admin/` | 桌面端；其中 82 页被模块 `allFiles` 覆盖 |

### 用户/主播 App 目录

| 页面树模块 | 页面目录 | 主要能力 |
|---|---|---|
| 系统入口 | `user/auth/` | 登录、注册、手机号登录、资料补全 |
| 首页与福利 | `user/home/` | 直播广场、榜单、搜索、福利、邀请 |
| 直播 | `user/live/` | 观众/主播直播间、举报、密码房、连麦、结束页 |
| 消息与社交 | `user/social/` | 通知、私信、粉丝团群、好友、主页、举报和拉黑入口 |
| 我的 | `user/profile/`、`user/fan-club/` | 资料、装扮、设置、黑名单、关注、已加入粉丝团 |
| 公会关系 | `user/guild/` | 公会搜索、入会申请、我的公会、退会申请 |
| 主播中心 | `user/host/` | 主播申请、开播、房管、粉丝团、直播数据、分成与提现 |
| 钱包与账单 | `user/wallet/` | 充值、金币流水、充值/支出订单详情 |

### 公会 App 目录

| 页面树模块 | 页面目录 | 主要能力 |
|---|---|---|
| 登录与首页 | `guild/auth/`、`guild/home/` | 登录、选择公会、首页和通知 |
| 主播管理 | `guild/approval/`、`guild/people/`、`guild/data/` | 入退会审核、主播列表、业绩、数据和主页 |
| 运营工具 | `guild/operations/` | 运营消息、选择主播、运营账号 |
| 公会管理 | `guild/management/` | 公会资料、账号设置、修改密码 |
| 数据与收益 | `guild/data/` | 公会业绩、直播记录、违规、主播/公会分成记录 |

### 管理后台目录

| 页面树模块 | 页面目录 | 主要能力 |
|---|---|---|
| 工作台 | `admin/dashboard/` | 实时指标、趋势和快捷入口 |
| 用户管理 | `admin/user/` | 用户、详情、封禁申诉 |
| 主播管理 | `admin/host/`、`admin/content/` | 主播审核、主播和直播管理、巡房排班、内容审核 |
| 举报处理 | `admin/content/` | 账号违规、直播间违规、举报详情 |
| 公会管理 | `admin/guild/` | 公会列表和详情 |
| 礼物道具 | `admin/gifts/` | 普通/定制/幸运礼物、道具、购买份数 |
| 运营配置 | `admin/operations/` | 展位、推送、充值套餐、任务、公会推荐、直播类型/房型、敏感词 |
| 订单管理 | `admin/orders/` | 充值、消费、退款订单 |
| 财务分成 | `admin/finance/` | 主播/公会分成、账户余额、余额变更 |
| 数据分析 | `admin/analytics/` | 概览、日报、活跃、直播、充值消费、月度和明细报表 |
| 系统配置 | `admin/system/` | 后台账号、角色权限、参数和审计日志 |

## 4. 文件分层和阅读顺序

- 产品范围入口：`项目说明.md`
- 页面树与路径入口：`prototype/index.html`
- 页面实现：`prototype/pages/`
- 公共交互和设计令牌：`prototype/assets/common.js`、`common.css`、`tokens.js`、`admin-tokens.js`
- 业务批注：`prototype/assets/annotations.js`
- 数据和字段：`prototype/assets/mock.js`、`prototype/assets/admin-mock.js`
- 页面专项脚本：`prototype/assets/*-page.js`、`admin-*.js`
- 需求与角色规则：`context/`
- 当前需求工作区：`workspace/2026-08/`
- 自动化测试：未发现

## 5. 权限、身份和数据隔离导航

| 关注点 | 入口 | 待确认边界 |
|---|---|---|
| 登录与用户身份 | `user/auth/`、`context/01-用户主播App-角色与用例.md` | 真实认证、会话与风控策略 |
| 主播身份和直播权限 | `user/host/`、`admin/host/`、原型批注 | 公会入会、平台认证、直播权限的完整状态机 |
| 公会人员权限 | `guild/`、`context/02-公会App-项目需求清单.md` | 公会内角色、主播数据范围和越权拦截 |
| 后台角色权限 | `admin/system/`、`context/03-管理后台-项目需求清单.md` | 菜单、操作、字段和数据权限矩阵 |
| 互动与黑名单 | `context/01-互动场景权限规则.md` | 关注、好友、粉丝团、拉黑和房管的交叉影响 |

## 6. 数据与外部服务导航

| 能力 | 入口 | 真实副作用 |
|---|---|---|
| 用户/公会 Mock | `prototype/assets/mock.js` | 无，均为本地虚构数据 |
| 后台 Mock/报表数据 | `prototype/assets/admin-mock.js` | 无，均为本地虚构数据 |
| 页面状态和查看偏好 | `prototype/index.html` | 仅浏览器本地存储 |
| 离线后台导出 | `export-admin-prototype.mjs` | 可能写入项目父目录，执行前复核目标 |
| 网络与真实接口 | 无 | 项目规则禁止静态原型发真实网络请求 |

## 7. 状态与规则导航

| 业务 | 规则/数据入口 | 页面入口 |
|---|---|---|
| 登录和资料风控 | `项目说明.md`、用户端需求和批注 | `user/auth/`、`user/profile/profile-edit.html` |
| 入退会与主播认证 | 用户/公会/后台需求文件和批注 | `user/guild/`、`guild/approval/`、`admin/host/` |
| 直播房型、连麦和结束 | 用户端需求、页面状态和批注 | `user/live/`、`user/host/start-live-settings.html` |
| 举报、拉黑、审核和处罚 | 互动权限规则、后台需求和批注 | `user/live/`、`user/social/`、`admin/content/` |
| 充值、消费和退款 | 需求、Mock 和批注 | `user/wallet/`、`admin/orders/` |
| 分成、余额和提现 | 资金规则、Mock 和批注 | `user/host/`、`guild/data/`、`admin/finance/` |
| 统计报表 | 后台需求、`admin-mock.js`、报表脚本 | `admin/analytics/` |

## 8. 页面树完整性快照

| 端 | 页面数组 | 磁盘 HTML | 未登记 HTML | 登记但缺文件 | 模块分组覆盖 |
|---|---:|---:|---|---|---|
| 用户/主播 App | 64 | 65 | `user/profile/my-outfits.html` | 无 | 64/64 |
| 公会 App | 31 | 31 | 无 | 无 | 31/31 |
| 管理后台 | 83 | 83 | 无 | 无 | 82/83；`admin-monthly-host-earnings.html` 未纳入数据分析组 |

补充：`prototype/Luma Live-原型说明.md` 仍引用 `guild-withdrawal-review.html`、`admin-withdrawal-review.html`、`admin-withdrawal-review-detail.html`，但这 3 个文件不在当前磁盘和页面树中；本地图未将其计入现行模块。

## 9. 索引更新条件

- 当前分支或 Commit 与快照不一致时，本地图可能过期。
- 页面数组、模块分组、路径映射、批注、Mock 或需求规则变化时，应以当前文件为准。
- 自动刷新不得覆盖下方人工补充章节。

## 人工补充（自动刷新时保留）

暂无。
