# UG 代理 App 原型说明

参考源：`代理端14_高保真.html`。本目录为按通用规范拆分后的静态 HTML 原型。

## 页面清单

| 模块 | 页面 | 文件 | 状态 |
| --- | --- | --- | --- |
| A 启动与全局 | A1 启动页 | `pages/startup.html` | 启动页 / 重大更新弹窗 / 隐私保护确认 / 登录失效拦截 |
| B 登录与账号 | B1 密码登录页 | `pages/login.html` | 默认 / 登录失败 / 操作受限 / 会员非代理拦截 / 协议确认弹窗 / 忘记密码提示 |
| B 登录与账号 | B2 协议与隐私内容页 | `pages/agreement.html` | 用户协议 / 隐私政策 |
| D 首页 | D1 首页总览 | `pages/home.html` | 有数据 / 数据为空 |
| E 客户 | E1 客户列表页 | `pages/customer-list.html` | 有客户 / 空列表 |
| E 客户 | E2 客户详情页 | `pages/customer-detail.html` | 直推客户 / 间推客户 / 无订单 / 月份选择 Sheet / 状态选择 Sheet |
| E 客户 | E3 团队·下级代理页 | `pages/team-agents.html` | 有数据 / 空列表 |
| E 客户 | E4 订单详情页 | `pages/order-detail.html` | 待发放 / 已发放 / 已取消 / 退款 |
| E 客户 | E5 新增客户·验证码绑定 | `pages/bind-customer.html` | 默认表单 / 验证码已发送 / 绑定成功 / 非会员手机号 / 已绑定代理 |
| F 成长 | F1 成长概览页 | `pages/growth-overview.html` | 成长明细 / 提现记录 / 成长明细空 / 提现记录空 |
| F 成长 | F5 提现详情页 | `pages/withdraw-detail.html` | 已到帐 / 待审核 / 已拒绝 |
| F 成长 | F4 成长值提现 | `pages/withdraw-apply.html` | 首次提现·银行卡 / 已回显上次数据 / 支付宝 / 微信 / USDG |
| G 邀请 | G1 邀请页 | `pages/invite.html` | 默认 |
| H 消息 | H1 消息中心 | `pages/messages.html` | 有消息 / 空消息 |
| I 学习中心 | I1 学习中心 | `pages/learning-center.html` | 服务规范 / 品牌理念 / 合规须知 |
| I 学习中心 | I1-1 内容详情 | `pages/learning-detail.html` | 内容详情 |
| J 我的 / 设置 | J1 我的·设置页 | `pages/settings.html` | 默认 / 登录拦截 / 退出登录确认 / 退出成功反馈 |
| J 我的 / 设置 | J1-2 修改密码 | `pages/change-password.html` | 默认 |
| J 我的 / 设置 | J1-3 语言设置 | `pages/language.html` | 默认 |
| K 公共组件 | K 公共组件总览 | `pages/components.html` | 默认 |
