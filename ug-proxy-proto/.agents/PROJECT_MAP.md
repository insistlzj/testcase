# 项目地图

> 用途：帮助 Agent 快速定位原型实现，不代替当前文件。
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

## 1. 快速定位表

| 问题关键词 | 首选模块 | 首选目录或文件 | 说明 |
|---|---|---|---|
| 页面清单、状态、路由 | 原型导航 | `prototype/assets/page-data.js` | 页面树、页面状态和路由父子关系 |
| 字段、按钮、页面内容 | 页面渲染 | `prototype/assets/common.js` | 各页面的控件、数据和交互 |
| 业务规则、权限、口径 | 原型批注 | `prototype/assets/annotations.js` | 页面不可见的规则来源 |
| 页面范围和进度 | 项目说明 | `prototype/UG代理App-原型说明.md` | 20 个页面及状态摘要 |
| 原型查看 | 查看器 | `prototype/index.html` | 页面树、状态选择和批注面板 |

## 2. 请求或调用路线

`prototype/index.html` 加载页面树和批注 → iframe 打开 `prototype/pages/*.html` → 页面调用 `initPrototypePage` → `prototype/assets/common.js` 根据页面 key 和 state 渲染 → `go(...)` 通过 `page-data.js` 路由跳转或切换状态。

## 3. 模块地图

| 模块 | 启动入口 | 端口或运行方式 | 主要职责 | 主要目录 |
|---|---|---|---|---|
| 原型查看器 | `prototype/index.html` | 浏览器直接打开 | 页面树、状态切换、批注展示 | `prototype` |
| 页面壳 | `prototype/pages/*.html` | iframe 或直接打开 | 注册页面 key 并加载公共渲染器 | `prototype/pages` |
| 页面与路由数据 | `prototype/assets/page-data.js` | 浏览器脚本 | 页面、状态、路由、父子关系 | `prototype/assets` |
| 页面功能渲染 | `prototype/assets/common.js` | 浏览器脚本 | 字段、按钮、列表、弹窗和跳转 | `prototype/assets` |
| 业务批注 | `prototype/assets/annotations.js` | 浏览器脚本 | 业务口径、权限、状态和待确认项 | `prototype/assets` |

## 4. 代码分层和阅读顺序

- 页面范围：`prototype/UG代理App-原型说明.md`
- 页面树与状态：`prototype/assets/page-data.js`
- 页面功能：`prototype/assets/common.js`
- 业务规则：`prototype/assets/annotations.js`
- 单页入口：`prototype/pages/*.html`
- 通用样式：`prototype/assets/app.css`、`prototype/assets/tokens.js`
- 测试：未发现

## 5. 权限、身份和数据隔离导航

| 关注点 | 代码入口 | 待确认边界 |
|---|---|---|
| 登录与会话 | `common.js` 的 `A1`、`B1`、`J1` | 服务端认证、锁定和过期策略 |
| 客户信息权限 | `annotations.js` 的 `E1`、`E2` | 直推/间推的服务端数据权限 |
| 代理数据范围 | `annotations.js` 的 `E3`、`F1` | 层级和数据归属的后端校验 |

## 6. 数据与外部服务导航

| 能力 | 代码入口 | 真实副作用 |
|---|---|---|
| Mock 页面数据 | `prototype/assets/common.js` | 无 |
| 页面批注口径 | `prototype/assets/annotations.js` | 无 |
| 后端接口 | 未包含 | 待人工确认 |

## 7. 状态与规则导航

| 业务 | 状态或枚举文件 | 修改状态的主要代码 |
|---|---|---|
| 页面状态和路由 | `prototype/assets/page-data.js` | `prototype/assets/common.js` |
| 客户绑定 | `page-data.js` 的 `E5` 状态 | `common.js` 的 `E5` |
| 订单发放 | `page-data.js` 的 `E4` 状态 | `common.js` 的 `E4` |
| 成长与提现 | `page-data.js` 的 `F1/F4/F5` 状态 | `common.js` 的 `F1/F5/WD` |

## 8. 测试地图

| 模块 | 测试目录或文件 | 当前覆盖线索 |
|---|---|---|
| 全项目 | 未发现 | 原型页面、状态和批注可作为功能用例证据 |

## 9. 索引更新条件

- 当前分支或 Commit 与快照不一致时，本地图可能过期。
- 页面、路由、批注或公共渲染逻辑变化时，应以当前文件为准。
- 自动刷新不得覆盖下方人工补充章节。

## 人工补充（自动刷新时保留）

暂无。
