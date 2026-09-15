## 账号与登录 / 公会登录 · 公会 APP / guild-login.html
25: account
31: password
36: 登录

## 账号与登录 / 选择公会 · 公会 APP / guild-switch.html
21: 返回 -> guild-login.html
48: ${guild.mark} ${guild.name}${guild.id} ${guild.id === current.id ? "当前公会" : "选择 ›"}

## 首页与发现 / 首页 · 公会 APP · Luma Live / guild-home.html
21: 切换公会 -> ../auth/guild-switch.html?from=home
33: 通知 -> guild-notifications.html
42: 账号设置
56: 查看今日概况 -> ../data/guild-income-day-detail.html?date=2026-08-15&from=home

## 首页与发现 / 通知消息 · 公会 APP / guild-notifications.html
21: ‹ -> guild-home.html
48: ${item.title}${item.summary}${LUMA_FORMAT.dateTime(item.time)}› -> guild-notification-detail.html?id=${item.id}

## 首页与发现 / 通知详情 · 公会 APP / guild-notification-detail.html
21: ‹ -> guild-notifications.html

## 审批管理 / 入会申请 · 待办审批 · 公会 APP / guild-join-review.html
21: 返回 -> ../home/guild-home.html
30: 审核中
31: 已通过
32: 已驳回
86: ${item.avatar}${item.name}${item.id}${statusLabel(item)}${LUMA_FORMAT.dateTime(item.appliedAt)}› -> guild-join-review-detail.html?id=${encodeURIComponent(
                      item.id,
                    )}&tab=${currentTab}

## 审批管理 / 入会申请详情 · 公会 APP / guild-join-review-detail.html
128: 返回入会申请列表 -> guild-join-review.html
160: 取消
161: 确认通过
176: 请输入驳回理由
182: 取消
183: 确认驳回
196: 关闭
301: 查看${label}大图

## 审批管理 / 退会申请 · 待办审批 · 公会 APP / guild-leave-review.html
21: 返回 -> ../home/guild-home.html
30: 审核中
31: 已通过
32: 已驳回
85: ${item.avatar}${item.name}${item.id} -> ../people/guild-host-detail.html?id=${encodeURIComponent(
                          item.id,
                        )}&from=roster
97: ${LUMA_FORMAT.dateTime(item.appliedAt)}› -> guild-leave-review-detail.html?id=${encodeURIComponent(
                        item.id,
                      )}&tab=${currentTab}

## 审批管理 / 退会申请详情 · 公会 APP / guild-leave-review-detail.html
21: 返回退会申请列表 -> guild-leave-review.html
44: 请输入驳回理由
50: 取消
51: 确认驳回

## 主播管理 / 主播列表 · 主播管理 · 公会 APP / guild-member-list.html
21: 返回 -> ../home/guild-home.html
30: 搜索主播昵称或 ID
40: 在会
49: 已退会
126: ${item.avatar}${item.name}${item.id}${item.joinedAt}› -> ${href}

## 主播管理 / 主播业绩 · 主播管理 · 公会 APP / guild-host-list.html
135: 返回 -> ../home/guild-home.html
145: 搜索主播
157: ⌄
168: 今日⌄
185: 今日
194: 昨日
202: 本周
210: 上周
218: 本月
226: 上月
234: 自定义
257: 取消 选择日期范围 确定 ‹2026年8月 › 日一二三四五六 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 { if(event.target===this){this.hidden=true;document.body.classList.remove('guild-sheet-open')} }
270: 取消 { document.getElementById('rangeSheet').hidden=true;document.body.classList.remove('guild-sheet-open') }
278: 确定 { document.getElementById('rangeSheet').hidden=true;document.body.classList.remove('guild-sheet-open') }
289: 上一个月
292: 下一个月
308: 1
310: 2
312: 3
314: 4
316: 5
318: 6
320: 7
322: 8
324: 9
326: 10
328: 11
330: 12
332: 13
334: 14
336: 15
338: 16
340: 17
342: 18
350: 19
352: 20
354: 21
356: 22
358: 23
360: 24
362: 25
364: 26
366: 27
368: 28
370: 29
372: 30
374: 31
592: ${index + 1}
681: ${item.avatar}${item.name}${formerTag}${meta}${performance}› -> ${href}

## 数据与收益 / 主播数据 · 公会 APP / guild-host-summary.html
26: 返回 -> ../people/guild-host-list.html
39: 日数据
48: 月数据
58: 【退会】 主页› -> ../people/guild-host-detail.html
78: ⌄
89: ⌄
105: 本月
112: 上月
119: 本周
126: 上周
133: 自定义
172: 取消
174: 确定
180: 上一个月
183: 下一个月
346: ${dayMonth(day.date)} ${day.effective ? "✓" : "!"}${dataModel.formatDuration(day.duration)} ${dataModel.formatSignedInteger(day.fans)} ${LUMA_FORMAT.coins(day.coins)} › -> guild-host-data.html?${query}
382: ${value}/${year} ${dataModel.formatDuration(summary.duration)} ${dataModel.formatSignedInteger(summary.fans)} ${LUMA_FORMAT.coins(summary.coins)} › -> guild-host-data.html?${query}
440: ${index + 1}

## 主播管理 / 主播主页 · 公会 APP / guild-host-detail.html
22: 返回主播列表 -> guild-host-list.html
36: 管理
48: 直播记录 -> ../data/guild-host-data.html
55: 违规记录 -> ../data/guild-all-violations.html
64: 主播分成 -> ../data/guild-share-ledger.html
75: 查看主播业绩 -> ../data/guild-host-summary.html
109: 关闭
119: 移出公会
134: 取消
135: 确认
146: 关闭
307: 直播权限

## 运营管理 / 运营消息 · 公会 APP / guild-messages.html
26: ‹ -> ../home/guild-home.html
26: 新建 -> guild-message-compose.html
34: ⌄
45: 本月⌄
61: 本周
62: 本月
63: 自定义
165: ${audienceLabel(item)}${LUMA_FORMAT.dateTime(item.sentAt)}${item.content} -> guild-message-detail.html?id=${item.id}

## 运营管理 / 新建运营消息 · 公会 APP / guild-message-compose.html
21: ‹ -> guild-messages.html
28: 全体主播
30: 指定主播 -> guild-host-select.html
41: 输入消息内容
51: imageInput
58: 移除图片
66: 发送消息
77: 取消
78: 确认发送

## 运营管理 / 选择主播 · 公会 APP / guild-host-select.html
21: 返回新建运营消息 -> guild-message-compose.html?mode=host
27: 完成
40: 搜索主播昵称或 ID
79: ${item.avatar}${item.name}${item.id}${selectedHostId === item.id ? "✓" : ""}

## 运营管理 / 运营消息详情 · 公会 APP / guild-message-detail.html
21: ‹ -> guild-messages.html

## 运营管理 / 运营账号 · 公会 APP / guild-operation-accounts.html
3: ‹ -> ../home/guild-home.html
3: 创建 -> guild-operation-account-compose.html
7: ${a.name}${a.id}◆${fmt(a.balance)}◆${fmt(a.spentMonth)}› -> guild-operation-account-detail.html?id=${a.id}

## 运营管理 / 创建运营账号 · 公会 APP / guild-operation-account-compose.html
3: ‹ -> guild-operation-accounts.html
4: avatarInput
5: name
6: account
7: password
8: coins
9: 账号状态
10: 确认创建

## 运营管理 / 运营账号主页 · 公会 APP / guild-operation-account-detail.html
20: ‹ -> guild-operation-accounts.html
31: 管理
41: ⌄
45: 本月⌄
49: 今日
50: 昨日
51: 本周
52: 上周
53: 本月
54: 上月
55: 自定义
65: 关闭
66: 账号状态
67: 发放金币
74: coinAmount
75: 取消
75: 确认发放
131: 查看${LUMA_FORMAT.date(date)}送礼记录，消费${fmt(coins)}金币 -> guild-operation-gift-records.html?accountId=${encodeURIComponent(item.id)}&start=${date}&end=${date}

## 运营管理 / 送礼记录 · 公会 APP / guild-operation-gift-records.html
19: ‹ -> ../home/guild-home.html
24: 选择运营账号 -> guild-operation-account-select.html
30: ⌄
33: ⌄
37: 今日
38: 昨日
39: 本周
40: 上周
41: 本月
42: 上月
43: 自定义
64: 关闭
117: ${record.giftName}${LUMA_FORMAT.dateTime(record.occurredAt)} ${coinIcon}${fmt(record.unitPrice * record.quantity)} ›

## 运营管理 / 选择运营账号 · 公会 APP / guild-operation-account-select.html
18: 返回送礼记录 -> guild-operation-gift-records.html
23: 搜索运营账号名称或账号
27: 全选运营账号
73: ${account.avatar}${account.name}${account.account}${selected ? "✓" : ""}

## 公会设置 / 公会资料 · 公会 APP / guild-profile.html
21: ‹ -> ../home/guild-home.html
27: 更换公会 Logo
34: name
40: 专注音乐、聊天和才艺主播运营，提供培训及活动支持。
43: 保存资料

## 公会设置 / 账号设置 · 公会 APP / guild-settings.html
21: ‹ -> ../home/guild-home.html
31: 修改密码› -> guild-password.html
33: 语言
37: 退出登录
52: 关闭
62: 中文
65: English
68: Bahasa Indonesia
71: Bahasa Melayu
82: 取消
83: 退出登录

## 公会设置 / 修改密码 · 公会 APP / guild-password.html
21: 返回账号设置 -> guild-settings.html
33: 输入当前密码
41: 至少 8 位
50: 再次输入新密码
60: 确认修改

## 数据与收益 / 直播记录 · 公会 APP / guild-host-data.html
26: 返回 -> ../home/guild-home.html
42: hostSwitchLink -> guild-violation-host-select.html
45: ⌄
53: ⌄
69: 今日
76: 昨日
83: 本周
90: 上周
97: 本月
104: 上月
111: 自定义
139: 取消
141: 确定
147: 上一个月
150: 下一个月
449: 查看${session.theme}直播场次详情，${startedAt} -> guild-live-gift-detail.html?${detailQuery}
544: ${index + 1}

## 数据与收益 / 直播场次详情 · 公会 APP / guild-live-gift-detail.html
26: 返回直播记录 -> guild-host-data.html
60: 关闭
188: 查看${record.giftName || record.name}送礼详情

## 数据与收益 / 违规记录 · 公会 APP / guild-all-violations.html
26: 返回 -> ../home/guild-home.html
38: 直播间违规⌄
55: 直播间违规
64: 账号违规
74: hostPicker -> guild-violation-host-select.html
79: ⌄
109: 取消
111: 确定
117: 上一个月
120: 下一个月

## 数据与收益 / 公会业绩 · 公会 APP / guild-income.html
26: 返回首页 -> ../home/guild-home.html
35: 日数据
44: 月数据
55: ⌄
66: ⌄
82: 本月
89: 上月
96: 本周
103: 上周
110: 自定义
125: ⌄
136: ⌄
152: 近半年
159: 近一年
166: 自定义
252: 取消
254: 确定
260: 上一个月
263: 下一个月
289: 取消
291: 确定
297: 上一年
300: 下一年
589: ${displayDate(day.date)} ${number(day.sessions)} ${number(day.effectiveHosts)} ${coin(day.coins)} › -> ../people/guild-host-list.html?${query}
607: ${monthShortLabel(row.month)} ${coin(row.coins)} ${number(row.startedHosts)} -> ../people/guild-host-list.html?${query}
703: ${metric.label} ${metric.format(metric.value)}
902: ${index + 1}
959: ${index + 1}月

## 数据与收益 / 每日 · 15/08/2026 · 公会 APP / guild-income-day-detail.html
26: 返回经营数据 -> guild-income.html
34: 历史 -> guild-income.html
138: ${host.avatar} ${host.name}${host.id} · ${level} ${started ? -> guild-host-summary.html?${query}

## 数据与收益 / 主播分成记录 · 公会 APP / guild-share-ledger.html
26: 返回首页 -> ../home/guild-home.html
37: memberPickerButton -> guild-violation-host-select.html
43: ⌄
55: 本月⌄
71: 今日
79: 昨日
87: 本周
95: 上周
103: 本月
112: 上月
120: 自定义
151: 取消
153: 确定
159: 上一个月
162: 下一个月

## 数据与收益 / 公会分成记录 · 公会 APP / guild-share-income.html
25: 返回首页 -> ../home/guild-home.html

## 数据与收益 / 选择主播 · 公会 APP / guild-violation-host-select.html
22: 返回违规记录 -> guild-all-violations.html
35: 搜索主播昵称或 ID
43: 全选主播
140: ${host.avatar}${host.name}${host.id}${selected ? "✓" : ""}
