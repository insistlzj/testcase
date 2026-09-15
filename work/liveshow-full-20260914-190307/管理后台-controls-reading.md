## 数据看板 / 工作台 · Luma Live 管理后台 / admin-dashboard.html
420: 工作台› -> admin-dashboard.html
422: 用户管理› -> ../user/admin-user-list.html
424: 主播管理› -> ../host/admin-host-list.html
426: 公会管理› -> ../guild/admin-guild-list.html
428: 礼物道具› -> ../gifts/admin-gift-list.html
430: 运营配置› -> ../operations/admin-placement-config.html
434: 财务分成› -> ../finance/admin-settlement-record.html
438: 数据分析›
440: 系统配置›
459: 刷新数据
504: 实时直播 -> ../host/admin-live-management.html
508: 内容告警 -> ../content/admin-content-audit.html
512: 举报处理 -> ../content/admin-report-handling.html
516: 主播审核 -> ../host/admin-host-review.html
520: 新建推送 -> ../operations/admin-push-detail.html?new=1
524: 配置展示位 -> ../operations/admin-placement-detail.html?new=1
563: ${metric.label}
600: 查看被动退款订单 ${item.orderNo} -> ../orders/admin-recharge-order-detail.html?id=${item.orderNo}

## 用户管理 / 用户列表 · 用户管理 · Luma Live 管理后台 / admin-user-list.html
25: 用户管理› -> admin-user-list.html
28: 主播管理› -> ../host/admin-host-list.html
31: 公会管理› -> ../guild/admin-guild-list.html
34: 礼物道具› -> ../gifts/admin-gift-list.html
37: 运营配置› -> ../operations/admin-placement-config.html
42: 财务分成› -> ../finance/admin-settlement-record.html
47: 数据分析›
50: 系统配置›
77: 输入用户昵称或 ID
85: 输入手机号
93: 输入公会名称
102: 最低
109: 最高
121: dateStart
123: dateEnd
128: 重置
129: 查询
136: 全部
138: 正常
140: 封禁
181: 上一页
183: 1
189: 下一页
207: 关闭
218: 取消
224: 确认
280: 详情 -> admin-user-detail.html?id=${user.id}
280: ${user.status === "banned" ? "解封" : "封禁"}
408: 基础资料
409: 充值流水
410: 消费流水
411: 登录设备
412: 关注 / 粉丝
413: 违规记录
437: 填写封禁原因

## 用户管理 / 用户详情 · 用户管理 · Luma Live 管理后台 / admin-user-detail.html
25: 用户管理› -> admin-user-list.html
28: 主播管理› -> ../host/admin-host-list.html
30: 公会管理› -> ../guild/admin-guild-list.html
33: 礼物道具› -> ../gifts/admin-gift-list.html
35: 运营配置› -> ../operations/admin-placement-config.html
39: 财务分成› -> ../finance/admin-settlement-record.html
43: 数据分析›
45: 系统配置›
64: ‹ 返回用户列表 -> admin-user-list.html
91: 消费流水
93: 充值流水
95: 账号违规记录
97: 粉丝
99: 关注
117: 关闭
128: 取消
134: 确认
255: ${user.status === "banned" ? "解封" : "封禁"}
292: banReason

## 主播管理 / 主播列表 · 主播管理 · Luma Live 管理后台 / admin-host-list.html
25: 用户管理› -> ../user/admin-user-list.html
28: 主播管理⌄
32: 主播审核 -> admin-host-review.html
33: 主播列表 -> admin-host-list.html
35: 直播场次 -> admin-live-management.html
37: 巡房排班 -> admin-inspection-schedule.html
39: 内容审核 -> ../content/admin-content-audit.html
41: 举报处理 -> ../content/admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
50: 礼物道具› -> ../gifts/admin-gift-list.html
52: 运营配置› -> ../operations/admin-placement-config.html
56: 财务分成› -> ../finance/admin-settlement-record.html
60: 数据分析›
62: 系统配置›
82: 导出
93: 输入主播昵称或 ID
101: 输入公会昵称或 ID
109: 全部状态 正常 已封禁
117: 全部状态 已开通 已关闭
125: 重置
126: 查询
132: 全部
134: 直播中
136: 未开播
173: ‹
174: 1
175: ›
190: ×
195: 取消
201: 确认
285: 详情 -> admin-host-detail.html?id=${host.id}
290: 更多
293: 直播权限
295: 警告
344: platformPermission
361: platformLock
374: permissionReason
384: warnReason
389: banReason
397: unbanReason

## 主播管理 / 主播详情 · 主播管理 · Luma Live 管理后台 / admin-host-detail.html
39: 用户管理› -> ../user/admin-user-list.html
41: 主播管理⌄
45: 主播审核 -> admin-host-review.html
46: 主播列表 -> admin-host-list.html
48: 直播场次 -> admin-live-management.html
50: 巡房排班 -> admin-inspection-schedule.html
52: 内容审核 -> ../content/admin-content-audit.html
54: 举报处理 -> ../content/admin-report-handling.html
60: 公会管理› -> ../guild/admin-guild-list.html
62: 礼物道具› -> ../gifts/admin-gift-list.html
64: 运营配置› -> ../operations/admin-placement-config.html
68: 财务分成› -> ../finance/admin-settlement-record.html
72: 数据分析›
74: 系统配置›
93: ‹ 返回主播列表 -> admin-host-list.html
116: 直播记录
118: 认证资料
119: 粉丝团
121: 直播间违规记录
139: ×
144: 取消
150: 确认
322: 直播权限
340: 公会管理权限
360: permissionReason
365: banReason
373: unbanReason

## 主播管理 / 主播审核 · 主播管理 · Luma Live 管理后台 / admin-host-review.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> admin-host-review.html
33: 主播列表 -> admin-host-list.html
34: 直播场次 -> admin-live-management.html
36: 巡房排班 -> admin-inspection-schedule.html
38: 内容审核 -> ../content/admin-content-audit.html
40: 举报处理 -> ../content/admin-report-handling.html
46: 公会管理› -> ../guild/admin-guild-list.html
48: 礼物道具› -> ../gifts/admin-gift-list.html
50: 运营配置› -> ../operations/admin-placement-config.html
54: 财务分成› -> ../finance/admin-settlement-record.html
58: 数据分析›
60: 系统配置›
84: 输入主播昵称或 ID
92: 输入公会昵称或 ID
100: 重置
101: 查询
107: 全部
109: 待审核
111: 已通过
113: 已驳回
144: ‹
145: 1
146: ›
201: 详情 -> admin-host-review-detail.html?id=${item.applicationNo}

## 主播管理 / 审核详情 · 主播管理 · Luma Live 管理后台 / admin-host-review-detail.html
43: 用户管理› -> ../user/admin-user-list.html
45: 主播管理⌄
49: 主播审核 -> admin-host-review.html
51: 主播列表 -> admin-host-list.html
52: 直播场次 -> admin-live-management.html
54: 巡房排班 -> admin-inspection-schedule.html
56: 内容审核 -> ../content/admin-content-audit.html
58: 举报处理 -> ../content/admin-report-handling.html
64: 公会管理› -> ../guild/admin-guild-list.html
66: 礼物道具› -> ../gifts/admin-gift-list.html
68: 运营配置› -> ../operations/admin-placement-config.html
72: 财务分成› -> ../finance/admin-settlement-record.html
76: 数据分析›
78: 系统配置›
93: ‹ 返回主播审核 -> admin-host-review.html
124: 关闭
147: auditResult
156: auditResult
171: livePermission
181: permissionLock
193: 填写驳回原因
201: 取消
207: 确认

## 主播管理 / 直播场次 · Luma Live 管理后台 / admin-live-management.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> admin-host-review.html
32: 主播列表 -> admin-host-list.html
33: 直播场次 -> admin-live-management.html
35: 巡房排班 -> admin-inspection-schedule.html
37: 内容审核 -> ../content/admin-content-audit.html
39: 举报处理 -> ../content/admin-report-handling.html
45: 公会管理› -> ../guild/admin-guild-list.html
47: 礼物道具› -> ../gifts/admin-gift-list.html
49: 运营配置› -> ../operations/admin-placement-config.html
53: 财务分成› -> ../finance/admin-settlement-record.html
57: 数据分析›
59: 系统配置›
81: 输入主播昵称或 ID
89: 输入场次 ID
97: 全部房型 普通房 密码房 门票房
107: startDate
109: endDate
114: 重置
115: 查询
121: 全部
123: 直播中
125: 已结束
143: ‹
144: 1
145: ›
155: ×
162: actionReason
171: 取消
177: 确认
264: 查看 -> admin-live-detail.html?id=${item.sessionId}

## 主播管理 / 直播详情 · Luma Live 管理后台 / admin-live-detail.html
39: 用户管理› -> ../user/admin-user-list.html
41: 主播管理⌄
45: 主播审核 -> admin-host-review.html
46: 主播列表 -> admin-host-list.html
47: 直播场次 -> admin-live-management.html
49: 巡房排班 -> admin-inspection-schedule.html
51: 内容审核 -> ../content/admin-content-audit.html
53: 举报处理 -> ../content/admin-report-handling.html
59: 公会管理› -> ../guild/admin-guild-list.html
61: 礼物道具› -> ../gifts/admin-gift-list.html
63: 运营配置› -> ../operations/admin-placement-config.html
67: 财务分成› -> ../finance/admin-settlement-record.html
71: 数据分析›
73: 系统配置›
88: ‹ 返回直播场次 -> admin-live-management.html
105: 直播画面
107: 巡房记录
120: ×
127: actionReason
136: 取消
142: 确认

## 主播管理 / 巡房排班 · Luma Live 管理后台 / admin-inspection-schedule.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> admin-host-review.html
32: 主播列表 -> admin-host-list.html
33: 直播场次 -> admin-live-management.html
35: 巡房排班 -> admin-inspection-schedule.html
39: 内容审核 -> ../content/admin-content-audit.html
41: 举报处理 -> ../content/admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
80: 新建排班 -> admin-inspection-schedule-create.html
91: dateFilter
95: 输入姓名、账号或 ID
103: 重置
104: 查询
110: 全部
112: 待生效
114: 生效中
116: 已停用
118: 已结束
142: ‹
143: 1
144: ›
232: 停用
234: 启用
236: 详情 -> admin-inspection-schedule-detail.html?id=${item.id}

## 主播管理 / 新建排班 · Luma Live 管理后台 / admin-inspection-schedule-create.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> admin-host-review.html
32: 主播列表 -> admin-host-list.html
33: 直播场次 -> admin-live-management.html
35: 巡房排班 -> admin-inspection-schedule.html
39: 内容审核 -> ../content/admin-content-audit.html
41: 举报处理 -> ../content/admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
80: ‹ 返回巡房排班 -> admin-inspection-schedule.html
89: scheduleDate
100: startTime
106: endTime
122: 添加
139: 取消 -> admin-inspection-schedule.html
143: 保存
159: 关闭
172: 输入用户昵称或 ID
179: 重置
185: 查询
192: 全选当前筛选结果
205: 取消
207: 确认添加
228: 移除 ${user.name}

## 主播管理 / 排班详情 · Luma Live 管理后台 / admin-inspection-schedule-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> admin-host-review.html
32: 主播列表 -> admin-host-list.html
33: 直播场次 -> admin-live-management.html
35: 巡房排班 -> admin-inspection-schedule.html
39: 内容审核 -> ../content/admin-content-audit.html
41: 举报处理 -> ../content/admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
80: ‹ 返回巡房排班 -> admin-inspection-schedule.html

## 内容审核 / 内容审核 · Luma Live 管理后台 / admin-content-audit.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> ../host/admin-host-review.html
33: 主播列表 -> ../host/admin-host-list.html
35: 直播场次 -> ../host/admin-live-management.html
37: 巡房排班 -> ../host/admin-inspection-schedule.html
41: 内容审核 -> admin-content-audit.html
43: 举报处理 -> admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
83: 输入直播场次 ID
91: 输入主播 ID 或昵称
99: 全部类型 疑似站外引流 敏感词命中 画面疑似违规 站外联系方式 疑似低俗内容
110: 全部等级 高风险 中风险 低风险
120: startDate
122: endDate
127: 重置
128: 查询
134: 全部
136: 待处理
138: 人工复审中
140: 已忽略
142: 已处置
179: ‹
180: 1
181: ›
191: ×
198: 误报 违规成立 轻微违规
206: 忽略 转人工复审 警告 强制关播 封禁 内容下架
217: reviewReason
225: 取消
231: 确认
306: 详情 -> admin-content-audit-detail.html?id=${item.auditNo}
310: 忽略
316: ${item.status === "reviewing" ? "继续复审" : "处理"}

## 内容审核 / 内容审核详情 · Luma Live 管理后台 / admin-content-audit-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> ../host/admin-host-review.html
33: 主播列表 -> ../host/admin-host-list.html
35: 直播场次 -> ../host/admin-live-management.html
37: 巡房排班 -> ../host/admin-inspection-schedule.html
41: 内容审核 -> admin-content-audit.html
43: 举报处理 -> admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
76: ‹ 返回内容审核 -> admin-content-audit.html
94: 告警材料
96: 复审与处置记录
109: ×
116: 误报 违规成立 轻微违规
124: 忽略 转人工复审 警告 强制关播 封禁 内容下架
135: reviewReason
143: 取消
149: 确认
184: 忽略
184: ${item.status === "reviewing" ? "继续复审" : "处理"}

## 内容审核 / 账号违规 · 举报处理 · Luma Live 管理后台 / admin-account-violation.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理›
31: 主播审核 -> ../host/admin-host-review.html
33: 主播列表 -> ../host/admin-host-list.html
35: 直播场次 -> ../host/admin-live-management.html
37: 巡房排班 -> ../host/admin-inspection-schedule.html
41: 内容审核 -> admin-content-audit.html
45: 举报处理›
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
85: 输入账号昵称或 ID
93: 全部类型
100: startDate
102: endDate
107: 重置
108: 查询
114: 全部
116: 待处理
118: 已处理
151: ‹
152: 1
153: ›
220: 查看 -> admin-report-detail.html?id=${item.reportNo}&scope=account

## 内容审核 / 直播间违规 · 举报处理 · Luma Live 管理后台 / admin-report-handling.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理⌄
31: 主播审核 -> ../host/admin-host-review.html
33: 主播列表 -> ../host/admin-host-list.html
35: 直播场次 -> ../host/admin-live-management.html
37: 巡房排班 -> ../host/admin-inspection-schedule.html
41: 内容审核 -> admin-content-audit.html
43: 举报处理 -> admin-report-handling.html
47: 公会管理› -> ../guild/admin-guild-list.html
49: 礼物道具› -> ../gifts/admin-gift-list.html
51: 运营配置› -> ../operations/admin-placement-config.html
55: 财务分成› -> ../finance/admin-settlement-record.html
59: 数据分析›
61: 系统配置›
85: 输入场次 ID、主播昵称或 ID
93: 全部类型
100: startDate
102: endDate
107: 重置
108: 查询
114: 待处理
119: 已处理
122: 已作废
155: ‹
156: 1
157: ›
226: 查看 -> admin-report-detail.html?id=${item.reportNo}&scope=live

## 内容审核 / 举报详情 · Luma Live 管理后台 / admin-report-detail.html
33: 用户管理› -> ../user/admin-user-list.html
34: 主播管理⌄
36: 主播审核 -> ../host/admin-host-review.html
37: 主播列表 -> ../host/admin-host-list.html
38: 直播场次 -> ../host/admin-live-management.html
39: 巡房排班 -> ../host/admin-inspection-schedule.html
40: 内容审核 -> admin-content-audit.html
41: 举报处理 -> admin-report-handling.html
43: 公会管理› -> ../guild/admin-guild-list.html
44: 礼物道具› -> ../gifts/admin-gift-list.html
45: 运营配置› -> ../operations/admin-placement-config.html
46: 财务分成› -> ../finance/admin-settlement-record.html
47: 数据分析›
48: 系统配置›
58: backLink
73: ×
76: 请选择
77: processReason
81: 取消
81: 确认

## 内容审核 / 违规类型 · Luma Live 管理后台 / admin-violation-types.html
35: 新增违规类型 -> admin-violation-type-detail.html?new=1
63: ×
68: 取消
69: 确认删除
104: 上移 ${item.name}
105: 下移 ${item.name}
120: 编辑 -> admin-violation-type-detail.html?id=${item.id}

## 内容审核 / 违规类型编辑 · Luma Live 管理后台 / admin-violation-type-detail.html
28: ‹ 返回违规类型 -> admin-violation-types.html
39: typeNameZh
40: typeNameEn
41: typeNameId
42: typeNameMs
47: sort
56: enabled
64: 取消 -> admin-violation-types.html
65: 保存

## 公会管理 / 公会列表 · 公会管理 · Luma Live 管理后台 / admin-guild-list.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理⌄
33: 公会列表 -> admin-guild-list.html
37: 礼物道具› -> ../gifts/admin-gift-list.html
39: 运营配置› -> ../operations/admin-placement-config.html
43: 财务分成› -> ../finance/admin-settlement-record.html
47: 数据分析›
49: 系统配置›
68: 新建公会
74: 输入公会 ID
82: 输入公会名称
90: 输入公会长昵称或账号
99: guildStart
105: guildEnd
115: 重置
116: 查询
122: 全部
124: 正常
126: 停用
157: ‹
158: 1
159: ›
169: ×
176: 取消
182: 确认
223: 详情 -> admin-guild-detail.html?id=${guild.id}
357: 基础信息
359: 主播列表
360: 收益台账
361: 分成记录
362: 分成记录

## 公会管理 / 公会详情 · 公会管理 · Luma Live 管理后台 / admin-guild-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理⌄
33: 公会列表 -> admin-guild-list.html
37: 礼物道具› -> ../gifts/admin-gift-list.html
39: 运营配置› -> ../operations/admin-placement-config.html
43: 财务分成› -> ../finance/admin-settlement-record.html
47: 数据分析›
49: 系统配置›
66: ‹ 返回公会列表 -> admin-guild-list.html
88: 主播列表
90: 管理账号
108: ×
133: editGuildName
140: guildLogoPreview
145: 删除公会 Logo
155: guildLogoFile
166: editGuildDescription
189: editGuildLeaderName
197: editGuildLeaderAccount
205: 至少 8 位
219: 取消
225: 保存
234: ×
241: 取消
247: 确认
319: 详情 -> ../host/admin-host-detail.html?id=${i.id}
347: 公会长账号状态
359: 编辑
361: 重置密码
376: 编辑 -> admin-guild-detail.html?id=${guild.id}&edit=1
376: ${guild.status === "enabled" ? "停用公会" : "启用公会"}
432: leaderNameInput
432: leaderAccountInput
437: 至少 8 位

## 礼物与道具 / 普通礼物 · 礼物道具 · Luma Live 管理后台 / admin-gift-list.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具⌄
35: 普通礼物 -> admin-gift-list.html
37: 定制礼物 -> admin-custom-gift.html
38: 幸运礼物 -> admin-lucky-gift-config.html
40: 道具配置 -> admin-prop-list.html
42: 运营配置› -> ../operations/admin-placement-config.html
46: 财务分成› -> ../finance/admin-settlement-record.html
50: 数据分析›
52: 系统配置›
69: 新增普通礼物
75: 输入礼物 ID
83: 输入礼物名称
91: 重置
92: 查询
98: 全部
100: 上架
102: 下架
126: ‹
127: 1
128: ›
138: ×
148: editIconPreview
154: 删除图标
164: iconFile
174: editEffectPreview
180: 删除特效
190: effectFile
201: editGiftId
209: nameEn
213: nameId
217: nameMs
221: editPrice
231: editSort
243: editStatus
252: 取消
258: 保存
267: ×
280: ×
285: 取消
291: 确认
342: ${item.names.id} 上下架状态
353: 编辑 -> admin-gift-detail.html?id=${item.id}&from=admin-gift-list.html&edit=1
357: 删除

## 礼物与道具 / 礼物详情 · 礼物道具 · Luma Live 管理后台 / admin-gift-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具⌄
35: 普通礼物 -> admin-gift-list.html
40: 定制礼物 -> admin-custom-gift.html
45: 幸运礼物 -> admin-lucky-gift-config.html
50: 道具配置 -> admin-prop-list.html
52: 运营配置› -> ../operations/admin-placement-config.html
56: 财务分成› -> ../finance/admin-settlement-record.html
60: 数据分析›
62: 系统配置›
79: ‹ 返回普通礼物 -> admin-gift-list.html
95: 多语言名称
97: 特效信息
99: 操作记录
112: ×
126: editGiftId
133: nameZh
136: nameEn
139: nameId
142: nameMs
148: editSort
160: editStatus
171: editIconPreview
177: 删除礼物图标
187: iconFile
197: editEffectPreview
203: 删除礼物特效
213: effectFile
225: editPrice
237: editEffective
242: editExpired
252: 取消
258: 保存
267: ×
280: ×
285: 取消
291: 确认
375: ${displayName} 上下架状态
376: 编辑 -> admin-gift-detail.html?id=${item.id}&from=${from}&edit=1
376: 删除

## 礼物与道具 / 定制礼物 · 礼物道具 · Luma Live 管理后台 / admin-custom-gift.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具⌄
35: 普通礼物 -> admin-gift-list.html
36: 定制礼物 -> admin-custom-gift.html
38: 幸运礼物 -> admin-lucky-gift-config.html
40: 道具配置 -> admin-prop-list.html
42: 运营配置› -> ../operations/admin-placement-config.html
46: 财务分成› -> ../finance/admin-settlement-record.html
50: 数据分析›
52: 系统配置›
69: 新增定制礼物
78: 输入礼物 ID
86: 输入礼物名称
95: giftStart
97: giftEnd
102: 重置
103: 查询
109: 全部
111: 上架
113: 下架
139: ‹
140: 1
141: ›
151: ×
161: editIconPreview
167: 删除图标
177: iconFile
187: editEffectPreview
193: 删除特效
203: effectFile
214: editGiftId
218: nameEn
222: nameId
226: nameMs
230: editPrice
240: editSort
252: editStatus
261: editEffective
267: editExpired
278: 取消
284: 保存
293: ×
306: ×
311: 取消
317: 确认
366: ${item.names.id} 上下架状态
379: 编辑 -> admin-gift-detail.html?id=${item.id}&from=admin-custom-gift.html&edit=1
383: 删除

## 礼物与道具 / 幸运礼物 · 礼物道具 · Luma Live 管理后台 / admin-lucky-gift-config.html
30: 用户管理› -> ../user/admin-user-list.html
32: 主播管理› -> ../host/admin-host-list.html
34: 公会管理› -> ../guild/admin-guild-list.html
36: 礼物道具⌄
40: 普通礼物 -> admin-gift-list.html
41: 定制礼物 -> admin-custom-gift.html
42: 幸运礼物 -> admin-lucky-gift-config.html
44: 道具配置 -> admin-prop-list.html
46: 运营配置› -> ../operations/admin-placement-config.html
50: 财务分成› -> ../finance/admin-settlement-record.html
54: 数据分析›
56: 系统配置›
73: 新增幸运礼物
83: 幸运礼物收益比例
102: 编辑
110: 输入礼物 ID
118: 输入礼物名称
126: 重置
127: 查询
133: 全部
135: 上架
137: 下架
164: ‹
165: 1
166: ›
176: 关闭
180: 取消
181: 确认
268: ${item.names.id} 当前${item.status === 
274: ${item.status === "online" ? "下架" : "上架"}
276: 编辑 -> admin-lucky-gift-detail.html?id=${item.id}
280: 删除

## 礼物与道具 / 幸运礼物编辑 · 礼物道具 · Luma Live 管理后台 / admin-lucky-gift-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具⌄
35: 普通礼物 -> admin-gift-list.html
36: 定制礼物 -> admin-custom-gift.html
37: 幸运礼物 -> admin-lucky-gift-config.html
39: 道具配置 -> admin-prop-list.html
41: 运营配置› -> ../operations/admin-placement-config.html
45: 财务分成› -> ../finance/admin-settlement-record.html
49: 数据分析›
51: 系统配置›
68: ‹ 返回幸运礼物 -> admin-lucky-gift-config.html
75: 取消
81: 保存
91: editId
98: nameZh
101: nameEn
104: nameId
107: nameMs
113: editSort
125: editStatus
136: editIconPreview
142: 删除礼物图标
152: iconFile
162: editEffectPreview
168: 删除礼物特效
178: effectFile
189: editPrice
199: editComboCount
267: ×

## 礼物与道具 / 道具配置 · 礼物道具 · Luma Live 管理后台 / admin-prop-list.html
106: 用户管理› -> ../user/admin-user-list.html
108: 主播管理› -> ../host/admin-host-list.html
110: 公会管理› -> ../guild/admin-guild-list.html
112: 礼物道具⌄
116: 普通礼物 -> admin-gift-list.html
117: 定制礼物 -> admin-custom-gift.html
118: 幸运礼物 -> admin-lucky-gift-config.html
120: 道具配置 -> admin-prop-list.html
124: 运营配置› -> ../operations/admin-placement-config.html
128: 财务分成› -> ../finance/admin-settlement-record.html
132: 数据分析›
134: 系统配置›
151: 新增道具
169: 输入道具 ID
177: 输入道具名称
185: 重置
186: 查询
192: 全部
194: 上架
196: 下架
223: ‹
224: 1
225: ›
237: ×
246: typeNameZh
247: typeNameEn
248: typeNameId
249: typeNameMs
254: 取消
260: 保存
269: ×
277: editIconPreview
283: 删除图标
293: iconFile
303: editMaterialPreview
309: 删除素材
319: materialFile
330: editId
334: nameZh
338: nameEn
342: nameId
346: nameMs
350: 勋章 气泡 头像框
358: editSort
370: editStatus
380: --→--
384: 上一个月
384: 下一个月
387: editWearableStart
388: editWearableEnd
391: editWearableUnlimited
398: editPrice
404: 取消
410: 保存
419: ×
432: ×
437: 取消
443: 确认
527: ${type.name}
527: 修改${type.name}
558: ${item.names.zh || item.names.id} 上下架状态
569: 编辑 -> admin-prop-detail.html?id=${item.id}&edit=1
573: 删除

## 礼物与道具 / 道具详情 · 礼物道具 · Luma Live 管理后台 / admin-prop-detail.html
26: 用户管理› -> ../user/admin-user-list.html
28: 主播管理› -> ../host/admin-host-list.html
30: 公会管理› -> ../guild/admin-guild-list.html
32: 礼物道具⌄
36: 普通礼物 -> admin-gift-list.html
37: 定制礼物 -> admin-custom-gift.html
38: 幸运礼物 -> admin-lucky-gift-config.html
40: 道具配置 -> admin-prop-list.html
44: 运营配置› -> ../operations/admin-placement-config.html
48: 财务分成› -> ../finance/admin-settlement-record.html
52: 数据分析›
54: 系统配置›
71: ‹ 返回道具配置 -> admin-prop-list.html
88: 多语言名称
90: 资源信息
92: 操作记录
106: 取消
112: 保存
122: editId
129: nameZh
132: nameEn
135: nameId
138: nameMs
144: editType
148: editSort
160: editStatus
170: --→--
174: 上一个月
174: 下一个月
177: editWearableStart
178: editWearableEnd
181: editWearableUnlimited
188: editPrice
196: editIconPreview
202: 删除道具图标
212: iconFile
222: editMaterialPreview
228: 删除道具素材
238: materialFile
255: ×
268: ×
273: 取消
279: 确认
370: ${item.names.zh || item.names.id} 上下架状态
371: 编辑 -> admin-prop-detail.html?id=${item.id}&edit=1
371: 删除

## 礼物与道具 / 购买份数配置 · 礼物道具 · Luma Live 管理后台 / admin-gift-send-count-rules.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具⌄
34: 普通礼物 -> admin-gift-list.html
35: 定制礼物 -> admin-custom-gift.html
36: 幸运礼物 -> admin-lucky-gift-config.html
38: 道具配置 -> admin-prop-list.html
39: 购买份数配置 -> admin-gift-send-count-rules.html
45: 运营配置› -> ../operations/admin-placement-config.html
49: 财务分成› -> ../finance/admin-settlement-record.html
53: 数据分析›
55: 系统配置›
74: 新建规则 -> admin-gift-send-count-rule-detail.html?new=1&edit=1
87: 输入规则ID
95: 全部类型 普通礼物 定制礼物 幸运礼物
104: 全部状态 启用 停用
112: 重置
114: 查询
141: ‹
142: 1
143: ›
225: 编辑 -> admin-gift-send-count-rule-detail.html?id=${rule.id}&edit=1

## 礼物与道具 / 购买份数配置详情 · 礼物道具 · Luma Live 管理后台 / admin-gift-send-count-rule-detail.html
220: 用户管理› -> ../user/admin-user-list.html
222: 主播管理› -> ../host/admin-host-list.html
224: 公会管理› -> ../guild/admin-guild-list.html
226: 礼物道具⌄
230: 普通礼物 -> admin-gift-list.html
231: 定制礼物 -> admin-custom-gift.html
232: 幸运礼物 -> admin-lucky-gift-config.html
234: 道具配置 -> admin-prop-list.html
235: 购买份数配置 -> admin-gift-send-count-rules.html
241: 运营配置› -> ../operations/admin-placement-config.html
245: 财务分成› -> ../finance/admin-settlement-record.html
249: 数据分析›
251: 系统配置›
270: ‹ 返回购买份数配置 -> admin-gift-send-count-rules.html
285: 输入正整数
293: 添加
303: defaultCount
309: ruleEnabled
329: 取消 -> admin-gift-send-count-rules.html
333: 保存
479: 删除 ×${count}
501: 全选${label}
501: ${label}${selected}/${items.length}
520: 选择 ${item.names.zh}

## 运营管理 / 展位配置 · 运营配置 · Luma Live 管理后台 / admin-placement-config.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置⌄
37: 展位配置 -> admin-placement-config.html
39: 推送管理 -> admin-push-management.html
41: 充值套餐 -> admin-recharge-package.html
43: 任务配置 -> admin-task-config.html
44: 公会推荐 -> admin-guild-recommendation.html
46: 直播类型 -> admin-live-type.html
47: 直播房型 -> admin-feature-switch.html
49: 敏感词库 -> admin-sensitive-words.html
53: 财务分成› -> ../finance/admin-settlement-record.html
57: 数据分析›
59: 系统配置›
78: 新建展示素材 -> admin-placement-detail.html?new=1&edit=1
86: 全部位置 直播广场运营位 福利中心轮播位
95: placementStart
100: placementEnd
105: 重置
106: 查询
116: 全部
118: 展示
119: 隐藏
141: ‹
142: 1
143: ›
153: ×
158: 取消
164: 确认删除
239: 编辑 -> admin-placement-detail.html?id=${item.id}&edit=1
243: 删除

## 运营管理 / 展示素材编辑 · 运营配置 · Luma Live 管理后台 / admin-placement-detail.html
47: 用户管理› -> ../user/admin-user-list.html
49: 主播管理› -> ../host/admin-host-list.html
51: 公会管理› -> ../guild/admin-guild-list.html
53: 礼物道具› -> ../gifts/admin-gift-list.html
55: 运营配置⌄
59: 展位配置 -> admin-placement-config.html
61: 推送管理 -> admin-push-management.html
63: 充值套餐 -> admin-recharge-package.html
65: 任务配置 -> admin-task-config.html
66: 公会推荐 -> admin-guild-recommendation.html
68: 直播类型 -> admin-live-type.html
69: 直播房型 -> admin-feature-switch.html
71: 敏感词库 -> admin-sensitive-words.html
75: 财务分成› -> ../finance/admin-settlement-record.html
79: 数据分析›
81: 系统配置›
99: ‹ 返回展位配置 -> admin-placement-config.html
108: 直播广场运营位 福利中心轮播位
117: enabled
127: 添加轮播内容
136: 点击上传
142: 删除展示素材
152: materialFile
163: APP 已有页面 活动长图页面
170: 充值页面 福利中心 任务中心 直播广场 公会页面 个人中心
187: 点击上传
193: 删除活动详情长图
203: detailImageFile
216: periodStart
222: periodEnd
232: 取消 -> admin-placement-config.html
236: 保存
247: ×
371: ${escapeHtml(name === "未上传" ? "点击上传" : name)}
379: 拖动第 ${index + 1} 项
383: APP 已有页面 活动长图页面
394: 删除轮播内容 ${index + 1}

## 运营管理 / 推送管理 · 运营配置 · Luma Live 管理后台 / admin-push-management.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置⌄
37: 展位配置 -> admin-placement-config.html
39: 推送管理 -> admin-push-management.html
41: 充值套餐 -> admin-recharge-package.html
43: 任务配置 -> admin-task-config.html
44: 公会推荐 -> admin-guild-recommendation.html
46: 直播类型 -> admin-live-type.html
47: 直播房型 -> admin-feature-switch.html
49: 敏感词库 -> admin-sensitive-words.html
53: 财务分成› -> ../finance/admin-settlement-record.html
57: 数据分析›
59: 系统配置›
78: 新建推送 -> admin-push-detail.html?new=1&edit=1
86: 输入推送 ID、标题或内容
94: 全部目标用户 全部用户 公会用户（Aurora Agency） 公会用户（Star House） 公会用户（Blue Ocean） 公会用户（Moonlight）
107: 全部状态 待发送 已发送
116: pushStart
118: pushEnd
123: 重置
124: 查询
156: ‹
157: 1
158: ›
212: ${item.status === "sent" ? "查看" : "编辑"} -> admin-push-detail.html?id=${item.id}&edit=1

## 运营管理 / 推送配置 · 运营配置 · Luma Live 管理后台 / admin-push-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置⌄
37: 展位配置 -> admin-placement-config.html
39: 推送管理 -> admin-push-management.html
41: 充值套餐 -> admin-recharge-package.html
43: 任务配置 -> admin-task-config.html
44: 公会推荐 -> admin-guild-recommendation.html
46: 直播类型 -> admin-live-type.html
47: 直播房型 -> admin-feature-switch.html
49: 敏感词库 -> admin-sensitive-words.html
53: 财务分成› -> ../finance/admin-settlement-record.html
57: 数据分析›
59: 系统配置›
76: ‹ 返回推送管理 -> admin-push-management.html
91: pushTitleZh
92: pushTitleEn
93: pushTitleId
94: pushTitleMs
99: 全部用户 公会用户（Aurora Agency） 公会用户（Star House） 公会用户（Blue Ocean） 公会用户（Moonlight）
116: pushContentZh
117: pushContentEn
118: pushContentId
119: pushContentMs
128: 取消 -> admin-push-management.html
130: 立即发送

## 运营管理 / 充值套餐 · 运营配置 · Luma Live 管理后台 / admin-recharge-package.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
45: 直播类型 -> admin-live-type.html
46: 直播房型 -> admin-feature-switch.html
48: 敏感词库 -> admin-sensitive-words.html
52: 财务分成› -> ../finance/admin-settlement-record.html
56: 数据分析›
58: 系统配置›
77: 新增套餐 -> admin-recharge-package-detail.html?new=1&edit=1
88: 输入套餐 ID
96: 全部类型 常规 活动
104: 输入金币数量
114: 重置
115: 查询
125: 全部
127: 上架
129: 下架
170: ‹
171: 1
172: ›
182: ×
187: 取消
193: 确认删除
265: 编辑 -> admin-recharge-package-detail.html?id=${item.id}&edit=1
269: 删除

## 运营管理 / 充值套餐编辑 · 运营配置 · Luma Live 管理后台 / admin-recharge-package-detail.html
32: 用户管理› -> ../user/admin-user-list.html
34: 主播管理› -> ../host/admin-host-list.html
36: 公会管理› -> ../guild/admin-guild-list.html
38: 礼物道具› -> ../gifts/admin-gift-list.html
40: 运营配置⌄
44: 展位配置 -> admin-placement-config.html
46: 推送管理 -> admin-push-management.html
48: 充值套餐 -> admin-recharge-package.html
50: 任务配置 -> admin-task-config.html
51: 公会推荐 -> admin-guild-recommendation.html
53: 直播类型 -> admin-live-type.html
54: 直播房型 -> admin-feature-switch.html
56: 敏感词库 -> admin-sensitive-words.html
60: 财务分成› -> ../finance/admin-settlement-record.html
64: 数据分析›
66: 系统配置›
84: ‹ 返回充值套餐 -> admin-recharge-package.html
97: 常规 活动
104: sort
116: enabled
127: coverPreview
132: 删除套餐封面
142: coverFile
153: price
166: coins
176: bonus
186: purchaseLimit
203: startAt
208: endAt
227: 取消 -> admin-recharge-package.html
231: 保存

## 运营管理 / 任务配置 · 运营配置 · Luma Live 管理后台 / admin-task-config.html
29: 用户管理› -> ../user/admin-user-list.html
31: 主播管理› -> ../host/admin-host-list.html
33: 公会管理› -> ../guild/admin-guild-list.html
35: 礼物道具› -> ../gifts/admin-gift-list.html
37: 运营配置⌄
41: 展位配置 -> admin-placement-config.html
43: 推送管理 -> admin-push-management.html
45: 充值套餐 -> admin-recharge-package.html
47: 任务配置 -> admin-task-config.html
49: 公会推荐 -> admin-guild-recommendation.html
51: 直播类型 -> admin-live-type.html
52: 直播房型 -> admin-feature-switch.html
54: 敏感词库 -> admin-sensitive-words.html
58: 财务分成› -> ../finance/admin-settlement-record.html
62: 数据分析›
64: 系统配置›
83: 新建任务 -> admin-task-detail.html?new=1&edit=1
91: 输入任务 ID 或名称
99: 全部动作 登录 App 观看直播 赠送礼物 分享直播间 邀请拉新
110: 全部周期 每日 每周 每月 无周期（数据持续累计）
120: 全部状态 开启 关闭
128: 重置
129: 查询
163: ‹
164: 1
165: ›
175: 关闭
179: 取消
180: 确认
432: ${item.names?.zh || item.name} 启停状态 { window.openTaskStatusConfirm(this.dataset.id) }
443: 编辑 -> admin-task-detail.html?id=${item.id}&edit=1

## 运营管理 / 通用任务编辑 · 运营配置 · Luma Live 管理后台 / admin-task-detail.html
75: 用户管理› -> ../user/admin-user-list.html
77: 主播管理› -> ../host/admin-host-list.html
79: 公会管理› -> ../guild/admin-guild-list.html
81: 礼物道具› -> ../gifts/admin-gift-list.html
83: 运营配置⌄
87: 展位配置 -> admin-placement-config.html
89: 推送管理 -> admin-push-management.html
91: 充值套餐 -> admin-recharge-package.html
93: 任务配置 -> admin-task-config.html
95: 公会推荐 -> admin-guild-recommendation.html
97: 直播类型 -> admin-live-type.html
98: 直播房型 -> admin-feature-switch.html
100: 敏感词库 -> admin-sensitive-words.html
104: 财务分成› -> ../finance/admin-settlement-record.html
108: 数据分析›
110: 系统配置›
129: ‹ 返回任务配置 -> admin-task-config.html
143: taskNameZh
144: taskNameEn
145: taskNameId
146: taskNameMs
153: taskEnabled
162: startAt
168: endAt
183: 登录 App 观看直播 赠送礼物 分享直播间 邀请拉新
193: taskMetric
201: taskCycle
226: 添加条件
236: 取消 -> admin-task-config.html
238: 保存
520: 0
520: 删除

## 运营管理 / 公会推荐 · 运营配置 · Luma Live 管理后台 / admin-guild-recommendation.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
47: 直播类型 -> admin-live-type.html
48: 直播房型 -> admin-feature-switch.html
50: 敏感词库 -> admin-sensitive-words.html
54: 财务分成› -> ../finance/admin-settlement-record.html
58: 数据分析›
60: 系统配置›
79: 新增推荐公会 -> admin-guild-recommendation-detail.html?new=1&edit=1
110: ‹
111: 1
112: ›
122: ×
127: 取消
133: 确认移除
178: 移除

## 运营管理 / 公会推荐编辑 · 运营配置 · Luma Live 管理后台 / admin-guild-recommendation-detail.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
47: 直播类型 -> admin-live-type.html
48: 直播房型 -> admin-feature-switch.html
50: 敏感词库 -> admin-sensitive-words.html
54: 财务分成› -> ../finance/admin-settlement-record.html
58: 数据分析›
60: 系统配置›
79: ‹ 返回公会推荐 -> admin-guild-recommendation.html
88: Aurora Agency（G100021） Star House（G100018） Blue Ocean（G100014） Moonlight（G100009） Sunrise Club（G100003）
98: sort
114: 取消 -> admin-guild-recommendation.html
118: 保存

## 运营管理 / 等级配置 · 运营配置 · Luma Live 管理后台 / admin-level-config.html
41: 主播等级
42: 财富等级
43: 粉丝等级
44: 粉丝团等级
46: 新增等级
56: 保存
81: ${row.badgeImage ? '更换图片' : '上传图片'}
82: 第 ${index + 1} 行勋章图

## 运营管理 / 直播类型 · 运营配置 · Luma Live 管理后台 / admin-live-type.html
38: 用户管理› -> ../user/admin-user-list.html
40: 主播管理› -> ../host/admin-host-list.html
42: 公会管理› -> ../guild/admin-guild-list.html
44: 礼物道具› -> ../gifts/admin-gift-list.html
46: 运营配置⌄
50: 展位配置 -> admin-placement-config.html
52: 推送管理 -> admin-push-management.html
54: 充值套餐 -> admin-recharge-package.html
56: 任务配置 -> admin-task-config.html
57: 公会推荐 -> admin-guild-recommendation.html
59: 直播类型 -> admin-live-type.html
61: 直播房型 -> admin-feature-switch.html
63: 敏感词库 -> admin-sensitive-words.html
67: 财务分成› -> ../finance/admin-settlement-record.html
71: 数据分析›
73: 系统配置›
92: 新建直播类型
127: ×
136: typeNameZh
137: typeNameEn
138: typeNameId
139: typeNameMs
146: typeEnabled
154: 取消
160: 保存
174: ×
185: 取消
191: 确认删除
290: 编辑

## 运营管理 / 直播房型 · 运营配置 · Luma Live 管理后台 / admin-feature-switch.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
45: 直播类型 -> admin-live-type.html
46: 直播房型 -> admin-feature-switch.html
48: 敏感词库 -> admin-sensitive-words.html
52: 财务分成› -> ../finance/admin-settlement-record.html
56: 数据分析›
58: 系统配置›
126: 价格配置 -> admin-ticket-price-level.html

## 运营管理 / 门票价格档位 · 直播房型 · Luma Live 管理后台 / admin-ticket-price-level.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
45: 直播类型 -> admin-live-type.html
46: 直播房型 -> admin-feature-switch.html
48: 敏感词库 -> admin-sensitive-words.html
52: 财务分成› -> ../finance/admin-settlement-record.html
56: 数据分析›
58: 系统配置›
77: ‹ 返回直播房型 -> admin-feature-switch.html
82: 新增价格档位 -> admin-ticket-price-level-detail.html?new=1
168: 编辑 -> admin-ticket-price-level-detail.html?id=${item.id}

## 运营管理 / 门票价格档位编辑 · 直播房型 · Luma Live 管理后台 / admin-ticket-price-level-detail.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
45: 直播类型 -> admin-live-type.html
46: 直播房型 -> admin-feature-switch.html
48: 敏感词库 -> admin-sensitive-words.html
52: 财务分成› -> ../finance/admin-settlement-record.html
56: 数据分析›
58: 系统配置›
77: ‹ 返回门票价格档位 -> admin-ticket-price-level.html
91: price
103: sort
116: enabled
124: 取消 -> admin-ticket-price-level.html
128: 保存

## 运营管理 / 敏感词库 · 运营配置 · Luma Live 管理后台 / admin-sensitive-words.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
45: 直播类型 -> admin-live-type.html
46: 直播房型 -> admin-feature-switch.html
48: 敏感词库 -> admin-sensitive-words.html
52: 财务分成› -> ../finance/admin-settlement-record.html
56: 数据分析›
58: 系统配置›
77: 批量导入
79: 新增敏感词 -> admin-sensitive-words-detail.html?new=1&edit=1
90: 输入敏感词
98: 全部分类 违法违规 辱骂攻击 广告引流
107: 全部场景 公屏 私信 昵称 动态
117: 重置
118: 查询
144: ‹
145: 1
146: ›
234: 编辑 -> admin-sensitive-words-detail.html?id=${item.id}&edit=1
239: 删除

## 运营管理 / 敏感词编辑 · 运营配置 · Luma Live 管理后台 / admin-sensitive-words-detail.html
24: 用户管理› -> ../user/admin-user-list.html
26: 主播管理› -> ../host/admin-host-list.html
28: 公会管理› -> ../guild/admin-guild-list.html
30: 礼物道具› -> ../gifts/admin-gift-list.html
32: 运营配置⌄
36: 展位配置 -> admin-placement-config.html
38: 推送管理 -> admin-push-management.html
40: 充值套餐 -> admin-recharge-package.html
42: 任务配置 -> admin-task-config.html
43: 公会推荐 -> admin-guild-recommendation.html
45: 直播类型 -> admin-live-type.html
46: 直播房型 -> admin-feature-switch.html
48: 敏感词库 -> admin-sensitive-words.html
52: 财务分成› -> ../finance/admin-settlement-record.html
72: ‹ 返回敏感词库 -> admin-sensitive-words.html
85: word
89: 违法违规 辱骂攻击 广告引流
97: 包含匹配 精确匹配
106: scene
112: scene
118: scene
124: scene
134: replace
140: enabled
148: 取消 -> admin-sensitive-words.html
150: 保存

## 订单管理 / 充值订单 · 订单管理 · Luma Live 管理后台 / admin-recharge-order.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置› -> ../operations/admin-placement-config.html
37: 财务分成› -> ../finance/admin-settlement-record.html
41: 数据分析›
43: 系统配置›
67: 输入充值订单号
75: 输入用户 ID 或昵称
83: 全部渠道 Google Play App Store DANA GoPay H5 · Airwallex PayerMax
95: 全部状态 充值成功 已退款
104: startDate
106: endDate
111: 重置
112: 查询
120: 导出
160: ‹
161: 1
162: ›
217: 详情 -> admin-recharge-order-detail.html?id=${item.orderNo}

## 订单管理 / 充值订单详情 · 订单管理 · Luma Live 管理后台 / admin-recharge-order-detail.html
71: 用户管理› -> ../user/admin-user-list.html
73: 主播管理› -> ../host/admin-host-list.html
75: 公会管理› -> ../guild/admin-guild-list.html
77: 礼物道具› -> ../gifts/admin-gift-list.html
79: 运营配置› -> ../operations/admin-placement-config.html
83: 财务分成› -> ../finance/admin-settlement-record.html
87: 数据分析›
89: 系统配置›
108: ‹ 返回充值订单 -> admin-recharge-order.html
114: 手动退款
176: 关闭
190: 请输入核对结果和退款原因
203: 取消
209: 确认

## 订单管理 / 消费订单 · 订单管理 · Luma Live 管理后台 / admin-consumption-order.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置› -> ../operations/admin-placement-config.html
37: 财务分成› -> ../finance/admin-settlement-record.html
41: 数据分析›
43: 系统配置›
67: 输入消费订单号
75: 输入用户 ID 或昵称
83: 全部类型 普通礼物 定制礼物 幸运礼物 门票
93: 全部状态 已支付 已退款
101: 输入主播 ID 或昵称
110: startDate
112: endDate
117: 重置
118: 查询
126: 导出
164: ‹
165: 1
166: ›
230: 详情 -> admin-consumption-order-detail.html?id=${item.orderNo}

## 订单管理 / 消费订单详情 · 订单管理 · Luma Live 管理后台 / admin-consumption-order-detail.html
32: 用户管理› -> ../user/admin-user-list.html
34: 主播管理› -> ../host/admin-host-list.html
36: 公会管理› -> ../guild/admin-guild-list.html
38: 礼物道具› -> ../gifts/admin-gift-list.html
40: 运营配置› -> ../operations/admin-placement-config.html
44: 财务分成› -> ../finance/admin-settlement-record.html
48: 数据分析›
50: 系统配置›
69: ‹ 返回消费订单 -> admin-consumption-order.html
90: 消费去向

## 订单管理 / 退款订单 · 订单管理 · Luma Live 管理后台 / admin-refund-order.html
45: 输入退款单号
53: 输入原充值订单号
61: 输入用户 ID 或昵称
69: 全部类型 手动退款 被动退款
77: 全部渠道 Google Play App Store DANA
87: startDate
89: endDate
94: 重置
95: 查询
103: 导出
139: ‹
140: 1
141: ›
198: 详情 -> admin-recharge-order-detail.html?id=${item.orderNo}

## 财务结算 / 主播分成记录 · 财务分成 · Luma Live 管理后台 / admin-settlement-record.html


## 财务结算 / 主播分成记录详情 · 财务分成 · Luma Live 管理后台 / admin-settlement-record-detail.html


## 财务结算 / 主播账户余额 · 财务分成 · Luma Live 管理后台 / admin-host-account-balance.html


## 财务结算 / 余额变更记录 · 主播账户余额 · Luma Live 管理后台 / admin-host-balance-change-record.html


## 财务结算 / 公会分成记录 · 财务分成 · Luma Live 管理后台 / admin-guild-settlement-record.html


## 财务结算 / 公会分成记录详情 · 财务分成 · Luma Live 管理后台 / admin-guild-settlement-record-detail.html


## 财务结算 / 公会账户余额 · 财务分成 · Luma Live 管理后台 / admin-guild-account-balance.html


## 财务结算 / 余额变更记录 · 公会账户余额 · Luma Live 管理后台 / admin-guild-balance-change-record.html


## 数据报表 / 报表中心 · 数据分析 · Luma Live 管理后台 / admin-report-center.html
24: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
30: 公会管理› -> ../guild/admin-guild-list.html
33: 礼物道具› -> ../gifts/admin-gift-list.html
36: 运营配置› -> ../operations/admin-placement-config.html
41: 财务分成› -> ../finance/admin-settlement-record.html
46: 数据分析›
49: 系统配置›
76: 日每日统计› -> admin-daily-statistics.html
84: 活用户活跃汇总（每日）› -> admin-user-active-statistics.html
92: 播主播活跃汇总（每日）› -> admin-host-statistics.html
100: 互直播间互动汇总（每日）› -> admin-live-statistics.html
108: 充充值消费汇总（每日）› -> admin-recharge-statistics.html
116: 统充值用户分层汇总（每日）› -> admin-user-activity-statistics.html
133: 汇月度收益支出汇总› -> admin-monthly-income-expense.html
141: 录直播记录明细报表› -> admin-host-live-record-report.html
149: 绩主播业绩分成报表› -> admin-monthly-host-share.html
157: 赏主播礼物打赏明细报表› -> admin-monthly-host-earnings.html
165: 消用户消费汇总报表› -> admin-monthly-viewer-consumption.html
173: 礼礼物消费汇总报表› -> admin-monthly-gift-sales.html
181: 单消费订单明细› -> admin-consumption-order-detail-report.html
189: 退退款订单明细› -> admin-refund-order-detail-report.html
197: 充充值订单明细› -> admin-recharge-order-detail-report.html

## 数据报表 / 数据概览 · 数据分析 · Luma Live 管理后台 / admin-data-overview.html
115: startDate
121: endDate
131: 重置
132: 查询
195: ${metric.label}

## 数据报表 / 每日统计 · 数据分析 · Luma Live 管理后台 / admin-daily-statistics.html
43: 导出报表
50: startDate
56: endDate
66: 重置
67: 查询
98: ‹
99: 1
100: ›

## 数据报表 / 用户活跃汇总（每日） · Luma Live 管理后台 / admin-user-active-statistics.html


## 数据报表 / 主播活跃汇总（每日） · Luma Live 管理后台 / admin-host-statistics.html


## 数据报表 / 直播间互动汇总（每日） · Luma Live 管理后台 / admin-live-statistics.html


## 数据报表 / 直播记录明细报表 · 财务对账 · Luma Live 管理后台 / admin-host-live-record-report.html
42: 导出报表
51: startDate
57: endDate
67: 请输入主播 id
75: 重置
77: 查询
106: ‹
107: 1
109: ›

## 数据报表 / 充值消费汇总（每日） · Luma Live 管理后台 / admin-recharge-statistics.html


## 数据报表 / 充值用户分层汇总（每日） · Luma Live 管理后台 / admin-user-activity-statistics.html


## 数据报表 / 月度收益支出汇总 · 财务对账 · Luma Live 管理后台 / admin-monthly-income-expense.html


## 数据报表 / 主播业绩分成报表 · 财务对账 · Luma Live 管理后台 / admin-monthly-host-share.html


## 数据报表 / 主播礼物打赏明细报表 · 财务对账 · Luma Live 管理后台 / admin-monthly-host-earnings.html


## 数据报表 / 用户消费汇总报表 · 财务对账 · Luma Live 管理后台 / admin-monthly-viewer-consumption.html


## 数据报表 / 礼物消费汇总报表 · 财务对账 · Luma Live 管理后台 / admin-monthly-gift-sales.html


## 数据报表 / 消费订单明细 · 财务对账 · Luma Live 管理后台 / admin-consumption-order-detail-report.html


## 数据报表 / 退款订单明细 · 财务对账 · Luma Live 管理后台 / admin-refund-order-detail-report.html


## 数据报表 / 充值订单明细 · 财务对账 · Luma Live 管理后台 / admin-recharge-order-detail-report.html


## 运营账号 / 账号列表 · 运营账号 · Luma Live 管理后台 / admin-operation-accounts.html
23: 名称或账号
24: 全部公会
25: 全部状态启用禁用
27: 重置
27: 查询
38: ‹
38: 1
38: ›
73: 详情 -> admin-operation-account-detail.html?id=${account.id}

## 运营账号 / 运营账号主页 · 运营账号 · Luma Live 管理后台 / admin-operation-account-detail.html
20: ‹ 返回账号列表 -> admin-operation-accounts.html
25: 编辑资料
25: 重置密码
37: statusToggle
38: managementToggle
44: 发放记录
45: 送礼记录
56: ×
57: 上传头像
57: editAvatarInput
58: nameInput
58: accountInput
58: guildInput
59: 取消
59: 保存
61: ×
61: 取消
61: 确认重置

## 运营账号 / 发放记录 · 运营账号 · Luma Live 管理后台 / admin-operation-issue-records.html
19: 全部公会
20: 输入名称或 ID
21: startDate
21: endDate
23: 重置
23: 查询
28: ‹
28: 1
28: ›

## 运营账号 / 送礼记录 · 运营账号 · Luma Live 管理后台 / admin-operation-gift-records.html
19: 全部公会
20: 全部账号
21: startDate
21: endDate
23: 重置
23: 查询
28: ‹
28: 1
28: ›
33: ×
33: 关闭
41: 详情

## 运营账号 / 额度限制 · 运营账号 · Luma Live 管理后台 / admin-operation-guild-controls.html
29: 公会名称或 ID
30: 重置
30: 查询
57: ×
61: singleLimitValue
62: monthlyLimitValue
64: 取消
64: 保存
103: 配置额度

## 系统管理 / 后台账号 · 系统配置 · Luma Live 管理后台 / admin-system-account.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置› -> ../operations/admin-placement-config.html
37: 财务分成› -> ../finance/admin-settlement-record.html
41: 数据分析› -> ../analytics/admin-report-center.html
45: 系统配置›
64: 新建账号 -> admin-system-account-detail.html?new=1
72: 输入账号或姓名
80: 全部角色
86: 全部状态 启用 停用
94: 重置
95: 查询
101: 全部
103: 启用
105: 停用
130: ‹
131: 1
132: ›
142: ×
148: statusReason
157: 取消
159: 确认
193: ${x.username} 账号状态
208: 编辑 -> admin-system-account-detail.html?id=${x.id}

## 系统管理 / 账号编辑 · 系统配置 · Luma Live 管理后台 / admin-system-account-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置› -> ../operations/admin-placement-config.html
37: 财务分成› -> ../finance/admin-settlement-record.html
41: 数据分析› -> ../analytics/admin-report-center.html
45: 系统配置›
65: ‹ 返回后台账号 -> admin-system-account.html
72: 取消 -> admin-system-account.html
74: 保存
87: username
96: displayName
105: roleId
109: 至少 8 位字符
122: 重置密码
135: enabled
163: 关闭
175: 8-32 位字符
188: 再次输入新密码
201: 取消
208: 确认重置

## 系统管理 / 角色管理 · 系统配置 · Luma Live 管理后台 / admin-system-role.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置› -> ../operations/admin-placement-config.html
37: 财务分成› -> ../finance/admin-settlement-record.html
41: 数据分析› -> ../analytics/admin-report-center.html
45: 系统配置›
64: 新建角色 -> admin-system-role-detail.html?new=1
72: 输入角色名称
80: 全部状态 启用 停用
88: 重置
89: 查询
113: ‹
114: 1
115: ›
125: ×
129: 取消
131: 确认
163: ${x.name} 角色状态
177: 编辑 -> admin-system-role-detail.html?id=${x.id}

## 系统管理 / 角色编辑 · 系统配置 · Luma Live 管理后台 / admin-system-role-detail.html
25: 用户管理› -> ../user/admin-user-list.html
27: 主播管理› -> ../host/admin-host-list.html
29: 公会管理› -> ../guild/admin-guild-list.html
31: 礼物道具› -> ../gifts/admin-gift-list.html
33: 运营配置› -> ../operations/admin-placement-config.html
37: 财务分成› -> ../finance/admin-settlement-record.html
41: 数据分析› -> ../analytics/admin-report-center.html
45: 系统配置›
65: ‹ 返回角色管理 -> admin-system-role.html
72: 取消 -> admin-system-role.html
74: 保存
87: roleName
98: enabled
112: 全部展开
113: 全部收起
114: 全选
115: 全不选
