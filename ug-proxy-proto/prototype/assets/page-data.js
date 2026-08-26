window.PROTOTYPE_PAGES=[
  {
    "group": "A 启动与全局",
    "key": "startup",
    "file": "startup.html",
    "title": "A1 启动页",
    "defaultState": "cold",
    "fam": "A1",
    "states": {
      "启动状态": {
        "cold": "启动页",
        "update": "重大更新弹窗",
        "privacy": "隐私保护确认",
        "expire": "登录失效拦截"
      }
    }
  },
  {
    "group": "B 登录与账号",
    "key": "login",
    "file": "login.html",
    "title": "B1 密码登录页",
    "defaultState": "default",
    "fam": "B1",
    "states": {
      "页面状态": {
        "default": "默认",
        "fail": "登录失败",
        "limit": "操作受限",
        "member": "会员非代理拦截",
        "agree": "协议确认弹窗",
        "forgot": "忘记密码提示"
      }
    }
  },
  {
    "group": "B 登录与账号",
    "key": "agreement",
    "file": "agreement.html",
    "title": "B2 协议与隐私内容页",
    "defaultState": "user",
    "fam": "B2",
    "states": {
      "内容类型": {
        "user": "用户协议",
        "privacy": "隐私政策"
      }
    }
  },
  {
    "group": "D 首页",
    "key": "home",
    "file": "home.html",
    "title": "D1 首页总览",
    "defaultState": "data",
    "fam": "D1",
    "states": {
      "数据状态": {
        "data": "有数据",
        "empty": "数据为空"
      }
    }
  },
  {
    "group": "E 客户",
    "key": "customer-list",
    "file": "customer-list.html",
    "title": "E1 客户列表页",
    "defaultState": "list",
    "fam": "E1",
    "states": {
      "列表状态": {
        "list": "有客户",
        "empty": "空列表"
      }
    }
  },
  {
    "group": "E 客户",
    "key": "customer-detail",
    "file": "customer-detail.html",
    "title": "E2 客户详情页",
    "defaultState": "direct",
    "fam": "E2",
    "states": {
      "页面状态": {
        "direct": "直推客户",
        "indirect": "间推客户",
        "noorder": "无订单",
        "msheet": "月份选择 Sheet",
        "ssheet": "状态选择 Sheet"
      }
    }
  },
  {
    "group": "E 客户",
    "key": "team-agents",
    "file": "team-agents.html",
    "title": "E3 团队·下级代理页",
    "defaultState": "data",
    "fam": "E3",
    "states": {
      "列表状态": {
        "data": "有数据",
        "empty": "空列表"
      }
    }
  },
  {
    "group": "E 客户",
    "key": "order-detail",
    "file": "order-detail.html",
    "title": "E4 订单详情页",
    "defaultState": "wait",
    "fam": "E4",
    "states": {
      "发放状态": {
        "wait": "待发放",
        "done": "已发放",
        "cancel": "已取消 / 退款"
      }
    }
  },
  {
    "group": "E 客户",
    "key": "bind-customer",
    "file": "bind-customer.html",
    "title": "E5 新增客户·验证码绑定",
    "defaultState": "form",
    "fam": "E5",
    "states": {
      "绑定状态": {
        "form": "默认表单",
        "sent": "验证码已发送",
        "ok": "绑定成功",
        "nomember": "非会员手机号",
        "dup": "已绑定代理"
      }
    }
  },
  {
    "group": "F 成长",
    "key": "growth-overview",
    "file": "growth-overview.html",
    "title": "F1 成长概览页",
    "defaultState": "data",
    "fam": "F1",
    "states": {
      "页面状态": {
        "data": "成长明细",
        "withdraw": "提现记录",
        "empty": "成长明细空",
        "wempty": "提现记录空"
      }
    }
  },
  {
    "group": "F 成长",
    "key": "withdraw-detail",
    "file": "withdraw-detail.html",
    "title": "F5 提现详情页",
    "defaultState": "done",
    "fam": "F5",
    "states": {
      "审核状态": {
        "done": "已到帐",
        "wait": "待审核",
        "reject": "已拒绝"
      }
    }
  },
  {
    "group": "F 成长",
    "key": "withdraw-apply",
    "file": "withdraw-apply.html",
    "title": "F4 成长值提现",
    "defaultState": "bank",
    "fam": "F4",
    "states": {
      "收款方式": {
        "bank": "首次提现·银行卡",
        "echo": "已回显上次数据",
        "alipay": "支付宝",
        "wechat": "微信",
        "usdg": "USDG"
      }
    }
  },
  {
    "group": "G 邀请",
    "key": "invite",
    "file": "invite.html",
    "title": "G1 邀请页",
    "defaultState": "data",
    "fam": "G1",
    "states": {
      "页面状态": {
        "data": "默认"
      }
    }
  },
  {
    "group": "H 消息",
    "key": "messages",
    "file": "messages.html",
    "title": "H1 消息中心",
    "defaultState": "list",
    "fam": "H1",
    "states": {
      "列表状态": {
        "list": "有消息",
        "empty": "空消息"
      }
    }
  },
  {
    "group": "I 学习中心",
    "key": "learning-center",
    "file": "learning-center.html",
    "title": "I1 学习中心",
    "defaultState": "reg",
    "fam": "I1",
    "states": {
      "内容分类": {
        "reg": "服务规范",
        "idea": "品牌理念",
        "comp": "合规须知"
      }
    }
  },
  {
    "group": "I 学习中心",
    "key": "learning-detail",
    "file": "learning-detail.html",
    "title": "I1-1 内容详情",
    "defaultState": "detail",
    "fam": "I1",
    "states": {
      "页面状态": {
        "detail": "内容详情"
      }
    }
  },
  {
    "group": "J 我的 / 设置",
    "key": "settings",
    "file": "settings.html",
    "title": "J1 我的·设置页",
    "defaultState": "me",
    "fam": "J1",
    "states": {
      "页面状态": {
        "me": "默认",
        "block": "登录拦截",
        "logout": "退出登录确认",
        "logoutok": "退出成功反馈"
      }
    }
  },
  {
    "group": "J 我的 / 设置",
    "key": "change-password",
    "file": "change-password.html",
    "title": "J1-2 修改密码",
    "defaultState": "default",
    "fam": "J12",
    "states": {
      "页面状态": {
        "default": "默认"
      }
    }
  },
  {
    "group": "J 我的 / 设置",
    "key": "language",
    "file": "language.html",
    "title": "J1-3 语言设置",
    "defaultState": "default",
    "fam": "J13",
    "states": {
      "页面状态": {
        "default": "默认"
      }
    }
  },
  {
    "group": "K 公共组件",
    "key": "components",
    "file": "components.html",
    "title": "K 公共组件总览",
    "defaultState": "default",
    "fam": "K",
    "states": {
      "页面状态": {
        "default": "默认"
      }
    }
  }
];
window.PROTOTYPE_ROUTES={
  "A1": [
    "startup",
    "cold"
  ],
  "A1-1": [
    "startup",
    "update"
  ],
  "A1-2": [
    "startup",
    "privacy"
  ],
  "A1-3": [
    "startup",
    "expire"
  ],
  "B1": [
    "login",
    "default"
  ],
  "B1-fail": [
    "login",
    "fail"
  ],
  "B1-limit": [
    "login",
    "limit"
  ],
  "B1-member": [
    "login",
    "member"
  ],
  "B1-1": [
    "login",
    "agree"
  ],
  "B1-2": [
    "login",
    "forgot"
  ],
  "B2": [
    "agreement",
    "user"
  ],
  "B2-p": [
    "agreement",
    "privacy"
  ],
  "D1": [
    "home",
    "data"
  ],
  "D1-e": [
    "home",
    "empty"
  ],
  "E1": [
    "customer-list",
    "list"
  ],
  "E1-e": [
    "customer-list",
    "empty"
  ],
  "E2": [
    "customer-detail",
    "direct"
  ],
  "E2-i": [
    "customer-detail",
    "indirect"
  ],
  "E2-o": [
    "customer-detail",
    "noorder"
  ],
  "E2-m": [
    "customer-detail",
    "msheet"
  ],
  "E2-s": [
    "customer-detail",
    "ssheet"
  ],
  "E3": [
    "team-agents",
    "data"
  ],
  "E3-e": [
    "team-agents",
    "empty"
  ],
  "E4": [
    "order-detail",
    "wait"
  ],
  "E4-d": [
    "order-detail",
    "done"
  ],
  "E4-c": [
    "order-detail",
    "cancel"
  ],
  "E5": [
    "bind-customer",
    "form"
  ],
  "E5-sent": [
    "bind-customer",
    "sent"
  ],
  "E5-ok": [
    "bind-customer",
    "ok"
  ],
  "E5-nomember": [
    "bind-customer",
    "nomember"
  ],
  "E5-dup": [
    "bind-customer",
    "dup"
  ],
  "F1": [
    "growth-overview",
    "data"
  ],
  "F1-w": [
    "growth-overview",
    "withdraw"
  ],
  "F1-e": [
    "growth-overview",
    "empty"
  ],
  "F1-we": [
    "growth-overview",
    "wempty"
  ],
  "F5": [
    "withdraw-detail",
    "done"
  ],
  "F5-w": [
    "withdraw-detail",
    "wait"
  ],
  "F5-r": [
    "withdraw-detail",
    "reject"
  ],
  "F4": [
    "withdraw-apply",
    "bank"
  ],
  "F4-r": [
    "withdraw-apply",
    "echo"
  ],
  "F4-a": [
    "withdraw-apply",
    "alipay"
  ],
  "F4-w": [
    "withdraw-apply",
    "wechat"
  ],
  "F4-u": [
    "withdraw-apply",
    "usdg"
  ],
  "G1": [
    "invite",
    "data"
  ],
  "H1": [
    "messages",
    "list"
  ],
  "H1-e": [
    "messages",
    "empty"
  ],
  "I1": [
    "learning-center",
    "reg"
  ],
  "I1-idea": [
    "learning-center",
    "idea"
  ],
  "I1-comp": [
    "learning-center",
    "comp"
  ],
  "I1-1": [
    "learning-detail",
    "detail"
  ],
  "J1": [
    "settings",
    "me"
  ],
  "J1-block": [
    "settings",
    "block"
  ],
  "J1-4": [
    "settings",
    "logout"
  ],
  "J1-ok": [
    "settings",
    "logoutok"
  ],
  "J1-2": [
    "change-password",
    "default"
  ],
  "J1-3": [
    "language",
    "default"
  ],
  "K": [
    "components",
    "default"
  ]
};
window.PROTOTYPE_ROUTE_PARENTS={
  "E2": "E1",
  "E2-i": "E1",
  "E2-o": "E1",
  "E2-m": "E2",
  "E2-s": "E2",
  "E3": "D1",
  "E3-e": "D1",
  "E4": "E2",
  "E4-d": "E2",
  "E4-c": "E2",
  "E5": "D1",
  "E5-sent": "E5",
  "E5-ok": "E5",
  "E5-nomember": "E5",
  "E5-dup": "E5",
  "F4": "F1",
  "F4-r": "F1",
  "F4-a": "F1",
  "F4-w": "F1",
  "F4-u": "F1",
  "F5": "F1",
  "F5-w": "F1",
  "F5-r": "F1",
  "G1": "D1",
  "E1": "D1",
  "F1": "D1",
  "J1": "D1",
  "H1": "D1",
  "H1-e": "D1",
  "I1": "D1",
  "I1-idea": "D1",
  "I1-comp": "D1",
  "I1-1": "I1",
  "J1-2": "J1",
  "J1-3": "J1",
  "J1-4": "J1",
  "J1-ok": "J1",
  "J1-block": "J1",
  "B2": "B1",
  "B2-p": "B1"
};
window.PROTOTYPE_PAGE_FAMILIES={
  "startup": "A1",
  "login": "B1",
  "agreement": "B2",
  "home": "D1",
  "customer-list": "E1",
  "customer-detail": "E2",
  "team-agents": "E3",
  "order-detail": "E4",
  "bind-customer": "E5",
  "growth-overview": "F1",
  "withdraw-detail": "F5",
  "withdraw-apply": "F4",
  "invite": "G1",
  "messages": "H1",
  "learning-center": "I1",
  "learning-detail": "I1",
  "settings": "J1",
  "change-password": "J12",
  "language": "J13",
  "components": "K"
};
