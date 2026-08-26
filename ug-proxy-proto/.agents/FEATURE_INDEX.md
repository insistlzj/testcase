# 功能索引

> 用途：根据业务关键词快速定位原型页面和规则。
>
> 维护模式：AI 自动生成，可自动刷新
>
> 生成日期：2026-07-29
>
> 项目根目录：`D:\testcase_html\ug-proxy-proto`
>
> 快照分支：`main`
>
> 快照 Commit：`7d7e6d00fb9c73d9b2b1589af90680fe0eee7011`

## 1. 使用方法

1. 根据业务关键词定位页面。
2. 读取 `page-data.js` 中的页面和状态。
3. 读取 `common.js` 对应渲染函数。
4. 读取 `annotations.js` 对应批注。
5. 本索引只用于定位，具体结论以当前原型为准。

## 2. 功能总表

| 功能或关键词 | 所属模块 | 页面入口 | 核心实现 | 数据与规则 | 状态或权限 | 外部副作用 |
|---|---|---|---|---|---|---|
| 启动、更新、隐私、登录失效 | A 启动与全局 | `pages/startup.html` | `common.js:A1` | `page-data.js:A1` | 更新、隐私确认、会话失效 | 无 |
| 登录、协议、忘记密码 | B 登录与账号 | `pages/login.html`、`agreement.html` | `common.js:B1/B2` | `page-data.js:B1/B2` | 登录失败、限制、非代理拦截 | 无 |
| 首页指标与导航 | D 首页 | `pages/home.html` | `common.js:D1` | `annotations.js:D1` | 有数据、空数据 | 无 |
| 客户列表与详情 | E 客户 | `customer-list.html`、`customer-detail.html` | `common.js:E1/E2` | `annotations.js:E1/E2` | 直推完整、间推脱敏和限制 | 无 |
| 团队代理 | E 客户 | `team-agents.html` | `common.js:E3` | `annotations.js:E3` | 下一层、下二层 | 无 |
| 订单详情 | E 客户 | `order-detail.html` | `common.js:E4` | `annotations.js:E4` | 待发放、已发放、取消/退款 | 无 |
| 验证码绑定客户 | E 客户 | `bind-customer.html` | `common.js:E5` | `annotations.js:E5` | 已发送、成功、非会员、已绑定 | 无 |
| 成长概览 | F 成长 | `growth-overview.html` | `common.js:F1` | `annotations.js:F1` | 明细/提现记录及空态 | 无 |
| 成长值提现 | F 成长 | `withdraw-apply.html`、`withdraw-detail.html` | `common.js:WD/F5` | `annotations.js:F4/F5` | 收款方式、待审核、到账、拒绝 | 无 |
| 邀请 | G 邀请 | `invite.html` | `common.js:G1` | `annotations.js:G1` | 邀请码复制和规则 | 无 |
| 消息 | H 消息 | `messages.html` | `common.js:H1` | `annotations.js:H1` | 有消息、空消息、详情跳转 | 无 |
| 学习中心 | I 学习中心 | `learning-center.html`、`learning-detail.html` | `common.js:I1/I1d` | `annotations.js:I1` | 分类、内容有效性待确认 | 无 |
| 设置、退出、改密、语言 | J 我的/设置 | `settings.html`、`change-password.html`、`language.html` | `common.js:J1/J12/J13` | `annotations.js:J1/J12/J13` | 登录拦截、退出、密码规则 | 无 |
| 通用状态 | K 公共组件 | `components.html` | `common.js:K` | `annotations.js:K` | 加载、空、异常、权限、失效 | 无 |

## 3. 按模块展开

### 核心业务链路

| 功能 | 入口 | 核心实现 | 数据与状态 | 证据 |
|---|---|---|---|---|
| 登录进入首页 | A1/B1 | `common.js:A1/B1/D1` | 会话、协议、失败和限制 | `page-data.js`、`annotations.js` |
| 绑定并查看客户 | D1/E5/E1/E2 | `common.js:D1/E5/E1/E2` | 手机号唯一性、永久归属、直推 | `annotations.js:E5/E1/E2` |
| 客户订单与成长 | E2/E4/F1 | `common.js:E2/E4/F1` | 订单状态、成长值状态和统计 | `annotations.js:E2/E4/F1` |
| 成长值提现 | F1/F4/F5 | `common.js:F1/WD/F5` | 收款方式、审核、到账和拒绝 | `annotations.js:F1/F4/F5` |

## 4. 跨模块功能

| 功能 | 涉及模块 | 完整阅读范围 |
|---|---|---|
| 登录和权限 | A、B、J、K | 启动失效、登录、受保护页面拦截、退出 |
| 客户归属 | D、E、G | 首页入口、验证码绑定、邀请、列表和详情 |
| 订单与成长值 | E、F、H | 订单状态、成长明细、消息跳转和统计口径 |
| 提现 | F、H | 可提现余额、收款信息、审核结果和消息 |

## 5. 常见问题的最小阅读集合

| 用户问题 | 至少阅读 |
|---|---|
| 页面有哪些状态 | `page-data.js` + 项目原型说明 |
| 页面能做什么 | `common.js` 对应函数 |
| 字段和统计口径 | `annotations.js` 对应模块 |
| 页面如何跳转 | `page-data.js` 路由 + `common.js` 中 `go(...)` |
| 谁能看到什么 | `annotations.js` 权限批注 + 对应页面渲染 |
| 是否存在问题 | 切换到完整代码检查流程 |

## 6. 当前索引边界

- 未运行浏览器交互测试。
- 未连接后端、数据库或真实账号。
- 原型只证明页面可见规则和批注，不证明服务端已实现。
- 自动刷新不得覆盖下方人工补充章节。

## 人工补充（自动刷新时保留）

暂无。
