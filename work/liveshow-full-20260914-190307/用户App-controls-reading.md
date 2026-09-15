## 首页与发现 / 首页 · 用户主播端 · Luma Live / live-plaza.html
433: 搜索 { Luma.requireLogin() && Luma.toast('打开搜索') }
442: 主播榜 { location.href=Luma.guestUrl('host-ranking.html') }
443: 贡献榜 { location.href=Luma.guestUrl('contribution-ranking.html') }
449: 热门
450: 新人
466: 暂不开启
467: 开启通知
484: 不允许
485: 允许
492: ⌂首页 -> live-plaza.html
493: ♧福利 -> welfare-center.html
494: ◌消息 -> ../social/message-center.html
495: ♙我的 -> ../profile/profile.html
632: ${x} { chips.querySelectorAll('button').forEach(b=>b.classList.remove('active'));this.classList.add('active');Luma.toast('筛选 '+this.textContent) }

## 首页与发现 / 主播榜 · 首页 · Luma Live / host-ranking.html
176: ‹ { location.href=Luma.guestUrl('live-plaza.html') }
186: 当日
187: 本周
188: 本月
209: ${host.avatar}${host.rank}${host.name}◆ ${host.received} -> ../social/host-home.html?host=${encodeURIComponent(host.hostKey)}
216: ${host.rank}${host.avatar}${host.name}${host.level}◆${host.received} -> ../social/host-home.html?host=${encodeURIComponent(host.hostKey)}

## 首页与发现 / 贡献榜 · 首页 · Luma Live / contribution-ranking.html
176: ‹ { location.href=Luma.guestUrl('live-plaza.html') }
186: 当日
187: 本周
188: 本月
211: ${user.avatar}${user.rank}${user.name}◆ ${user.contribution} -> ${userHome(user.name)}
218: ${user.rank}${user.avatar}${user.name}${user.wealthLevel}◆${user.contribution} -> ${userHome(user.name)}

## 首页与发现 / 搜索 · 用户端 · Luma Live / search.html
144: 返回首页
152: 搜索房间号、用户 ID 或昵称
157: 搜索
163: 清空全部

## 首页与发现 / 搜索结果 · 用户端 · Luma Live / search-results.html
253: 返回搜索
261: 搜索房间号、用户 ID 或昵称
266: 搜索
282: 关闭资料卡
296: 取消
297: 设为房管
347: 查看 ${item.name} 的资料卡
347: 查看资料
355: 直播中
357: 进入${isLive ? 

## 首页与发现 / 充值福利 · 用户主播端 · Luma Live / welfare-center.html
124: 邀请好友+ ◎ 10 -> invite-friends.html
127: 充值福利+◆ 30 { Luma.requireLogin() && Luma.toast('打开充值福利') }
148: 签到 ◎ 30
163: 20 { Luma.requireLogin() && Luma.toast('任务尚未完成') }
178: 10
189: 15 { Luma.requireLogin() && Luma.toast('前往直播间分享') }
200: ⌂首页 -> live-plaza.html
201: ♧福利 -> welfare-center.html
202: ◌消息 -> ../social/message-center.html
203: ♙我的 -> ../profile/profile.html

## 首页与发现 / 全部任务 · 用户主播端 · Luma Live / all-tasks.html
113: 返回充值福利 { window.parent.postMessage({type:'luma-page',file:'welfare-center.html'},'*');location.href='welfare-center.html' }
132: 去完成
146: 领取
158: 去完成

## 首页与发现 / 邀请好友 · 福利 · Luma Live / invite-friends.html
259: 返回 -> welfare-center.html
268: 邀请好友
272: 奖励
279: 邀请记录
292: 上一页
294: 下一页
311: ⌁复制链接
313: ↗发送给好友
315: ▣保存图片
317: 取消

## 消息与社交 / 消息 · 用户主播端 · Luma Live / message-center.html
108: 消息 5
110: 粉丝团 11
111: ♙ { Luma.toast('打开通讯录') }
114: 通 系统通知 10:24 -> system-notifications.html
118: 互 互动通知 09:502 -> interaction-notifications.html
123: S Sari 直播间私信 谢谢你的礼物，回复消息我们就是好友啦 19:411 { Luma.toast('打开与 Sari 的会话') }
131: B Budi 明天一起看 Maya 的专场吗？ 18:12 { Luma.toast('打开与 Budi 的会话') }
141: 团 Sari 的粉丝团 群主：今晚 8 点专场，记得来！ 20:039 { Luma.toast('打开 Sari 的粉丝团') }
149: 团 Maya 的粉丝团 Rina: 上次的歌太好听了 19:522 { Luma.toast('打开 Maya 的粉丝团') }
160: ⌂首页 -> ../home/live-plaza.html
161: ♧福利 -> ../home/welfare-center.html
162: ◌消息 -> message-center.html
163: ♙我的 -> ../profile/profile.html

## 消息与社交 / 系统通知 · 消息 · Luma Live / system-notifications.html
84: 返回 -> message-center.html

## 个人中心 / 我的 · 用户主播端 · Luma Live / profile.html
184: 编辑资料 { location.href='profile-edit.html' }
190: 设置 { location.href='settings.html' }
206: 查看我的关注 -> my-following.html
208: 查看粉丝列表 -> ../social/follower-list.html
208: 查看好友列表 -> ../social/friend-list.html
213: 充值 { Luma.toast('进入充值') }
216: ♧我的装扮 { location.href='my-decoration.html' }
218: ♡粉丝团 { location.href='../fan-club/my-fan-clubs.html' }
220: ♢邀请奖励 -> ../home/invite-friends.html
226: ◉开始直播
228: ♙主播中心
230: ⌂公会中心 { location.href='../guild/guild-application-form.html' }
235: 黑名单› { Luma.toast('进入黑名单') }
237: 联系客服› { location.href='customer-service.html' }
243: ⌂首页 -> ../home/live-plaza.html
244: ♧福利 -> ../home/welfare-center.html
245: ◌消息 -> ../social/message-center.html
246: ♙我的 -> profile.html

## 个人中心 / 联系客服 · 我的 · Luma Live / customer-service.html
40: ‹ { location.href='profile.html' }
43: WhatsApp⧉
46: 官方客服邮箱⧉

## 消息与社交 / 粉丝列表 · 消息 · Luma Live / follower-list.html
108: 返回 -> ../profile/profile.html
115: 搜索用户名
155: 进入 ${follower.name} 的${profileLabel} -> ${profilePage}

## 个人中心 / 我的关注 · 我的 · Luma Live / my-following.html
142: 返回 -> profile.html
149: 搜索用户名
176: 进入 ${host.name} 的${host.isHost ?  -> ${profile}
176: ${host.name}${host.description} -> ${target}
176: ${host.live ? "直播中" : "未开播"} -> ${target}

## 个人中心 / 我的装扮 · 我的 · Luma Live / my-decoration.html
297: ‹ { location.href='profile.html' }
306: 已拥有
307: 装扮商城
315: 头像框
316: 聊天气泡
317: 勋章3/5
323: 头像框
324: 聊天气泡
325: 勋章
331: 关闭
338: 取消
339: 购买
406: ${visual}${item.name}${item.validity}${status}
427: ${item.mark}${item.name}${item.validity}${status}

## 直播 / 直播间（普通房） · 用户主播 App · Luma Live / live-room.html
367: SSari+ { Luma.toast('打开主播主页') }
368: 进入主播主页 -> ../social/host-home.html
381: 关注主播
383: ADMN12.4K { Luma.toast('打开在线观众') }
386: 退出直播间 -> ../home/live-plaza.html
391: 本场贡献榜 { Luma.toast('打开本场贡献榜') }
392: 打开 Sari 粉丝团，等级 3 { Luma.toast('打开 Sari 粉丝团') }
426: ✦鲜花◎ 10
428: ☆星光◎ 50
430: ♩麦克风◎ 100
441: 关闭粉丝团
475: 加入粉丝团
486: 更多操作
490: icon举报
498: icon踢出直播间
501: icon拉黑
505: 取消
514: 进入用户主页 -> ../social/user-home.html
523: 加好友
530: 私信
537: @Ta
552: 取消
553: 举报
558: 说点什么...
558: 发送
565: 打开礼物面板
729: 关闭全部功能
736: 清屏
742: 转发
748: 举报 -> live-room-report.html
1391: 贡献 TOP10
1393: 观众
1394: 关闭本场观众
1457: 送礼
1714: 关闭重点观众
1719: LLina高财富未转粉Lv.18
1722: MMaya新进粉丝粉丝 Lv.9
1725: RRina本场贡献高◆ 3.260
1883: 充值
1892: 关闭充值
1899: 活动1.200 金币额外赠送 1.200Rp 49.000
1902: 限时2.500 金币额外赠送 2.500Rp 99.000
1911: 金币100 金币Rp 12.000
1913: 金币250 金币Rp 25.000
1915: 金币600 金币Rp 59.000
1917: 金币1.600 金币Rp 159.000
2104: 充值
2464: 关闭重点观众
2469: LLina高财富未转粉Lv.18
2472: MMaya新进粉丝粉丝 Lv.9
2475: RRina本场贡献高◆ 3.260
2534: 贡献榜（${Math.min(contributionCount, 99)}）
2540: 收到礼物
2541: 关闭本场贡献
2903: 取消
2903: 确认

## 直播 / 举报直播间 · 用户主播 App · Luma Live / live-room-report.html
186: 返回直播间 -> live-room.html
200: 请填写补充说明（选填）
209: 取消 -> live-room.html
210: 提交

## 直播 / 举报用户 · 用户主播 App · Luma Live / live-room-user-report.html
186: 返回直播间 -> live-room.html
200: 请填写补充说明（选填）
209: 取消 -> live-room.html
210: 提交

## 直播 / 直播间（主播） · 用户主播 App · Luma Live / live-room-host.html
370: SSari+ { Luma.toast('打开主播主页') }
371: 进入主播主页 -> ../social/host-home.html
384: 关注主播
386: ADMN12.4K { Luma.toast('打开在线观众') }
389: 结束直播
394: 本场贡献榜 { Luma.toast('打开本场贡献榜') }
395: 打开 Sari 粉丝团，等级 3 { Luma.toast('打开 Sari 粉丝团') }
442: 关闭粉丝团
476: 加入粉丝团
487: 更多操作
491: icon举报
499: icon踢出直播间
502: icon拉黑
511: 取消
520: 进入用户主页 -> ../social/user-home.html
529: 加好友
536: 私信
543: @Ta
545: 答谢
560: 取消
561: 举报
575: 取消
576: 结束直播
581: 说点什么...
581: 发送
590: 发起主播连麦
592: 直播设置
599: 打开全部功能
1430: 贡献 TOP10
1432: 观众
1433: 关闭本场观众
1516: 按贡献
1522: 按停留时长
1899: 重点观众 Lina，财富等级 18
1899: 重点观众 Maya，粉丝
1899: 重点观众 Rina，本场贡献 350
1986: 关闭重点观众
1991: LLina高财富未转粉Lv.18
1994: MMaya新进粉丝粉丝 Lv.9
1997: RRina本场贡献高◆ 3.260

## 直播 / 直播间-主播-密码房 · 用户主播 App · Luma Live / live-room-host-password.html
446: SSari+ { Luma.toast('打开主播主页') }
447: 进入主播主页 -> ../social/host-home.html
460: 关注主播
462: ADMN12.4K { Luma.toast('打开在线观众') }
465: 结束直播
470: 本场贡献榜 { Luma.toast('打开本场贡献榜') }
471: 打开 Sari 粉丝团，等级 3 { Luma.toast('打开 Sari 粉丝团') }
518: 关闭粉丝团
552: 加入粉丝团
563: 更多操作
567: icon举报
575: icon踢出直播间
578: icon拉黑
587: 取消
596: 进入用户主页 -> ../social/user-home.html
605: 加好友
612: 私信
619: @Ta
621: 答谢
636: 取消
637: 举报
651: 取消
652: 结束直播
666: 关闭
670: 在广场展示
674: 仅粉丝团成员可进入直播间
676: 确认
680: 说点什么...
680: 发送
689: 主播连麦不可用
691: 直播设置
698: 打开全部功能
1593: 贡献 TOP10
1595: 观众
1596: 关闭本场观众
1679: 按贡献
1685: 按停留时长
2062: 重点观众 Lina，财富等级 18
2062: 重点观众 Maya，粉丝
2062: 重点观众 Rina，本场贡献 350
2149: 关闭重点观众
2154: LLina高财富未转粉Lv.18
2157: MMaya新进粉丝粉丝 Lv.9
2160: RRina本场贡献高◆ 3.260
2332: 私信
2345: 私信
2358: 私信
2476: 贡献榜（99）
2482: 收到礼物
2483: 关闭本场贡献
2833: 取消
2833: 确认

## 直播 / 直播间-连麦中-主播 · 用户主播 App · Luma Live / live-room-cohost-active.html
366: SSari+ { Luma.toast('打开主播主页') }
367: 进入主播主页 -> ../social/host-home.html
380: 关注主播
382: ADMN12.4K { Luma.toast('打开在线观众') }
385: 结束直播
390: 本场贡献榜 { Luma.toast('打开本场贡献榜') }
432: 更多操作
436: icon举报
444: icon踢出直播间
447: icon拉黑
456: 取消
465: 进入用户主页 -> ../social/user-home.html
474: 加好友
481: 私信
488: @Ta
490: 答谢
505: 取消
506: 举报
520: 取消
521: 结束直播
526: 说点什么...
526: 发送
535: 退出主播连麦
537: 直播设置
544: 打开全部功能
1334: 贡献 TOP10
1336: 观众
1337: 关闭本场观众
1420: 按贡献
1426: 按停留时长
1803: 重点观众 Lina，财富等级 18
1803: 重点观众 Maya，粉丝
1803: 重点观众 Rina，本场贡献 350
1890: 关闭重点观众
1895: LLina高财富未转粉Lv.18
1898: MMaya新进粉丝粉丝 Lv.9
1901: RRina本场贡献高◆ 3.260

## 直播 / 直播结束页（观众） · 用户主播 App · Luma Live / live-end-viewer.html
61: ‹ { location.href='../home/live-plaza.html' }
69: 返回首页 -> ../home/live-plaza.html

## 直播 / 直播结束页（主播） · 用户主播 App · Luma Live / live-end-host.html
103: 查看直播数据 -> ../host/live-data.html
104: 返回主播中心 -> ../host/host-center.html

## 消息与社交 / 好友列表 · 消息 · Luma Live / friend-list.html
105: 返回 -> message-center.html
112: 搜索用户名

## 消息与社交 / 互动通知 · 消息 · Luma Live / interaction-notifications.html
96: 返回 -> message-center.html
119: 拒绝
119: 同意
123: 查看${notice.name}主页 -> ${profileHref(notice)}

## 消息与社交 / 1 对 1 私信 · 消息 · Luma Live / direct-message.html
153: ‹ { location.href='message-center.html' }
176: ☺ { Luma.toast('打开表情') }
177: 发送消息
178: 发送
203: 发送失败，点击重试

## 消息与社交 / 粉丝团群聊 · 消息 · Luma Live / fan-group-chat.html
281: ‹ { location.href='message-center.html' }
291: 成员 › { Luma.toast('查看群成员') }
299: 查看完整公告
340: ☺ { Luma.toast('打开表情') }
341: 发送消息
342: 发送
351: 知道了

## 消息与社交 / 群管理（成员）· 粉丝团群聊 · Luma Live / group-manage-member.html
149: 返回 -> fan-group-chat.html
157: 群消息免打扰
162: 举报›
164: 退出粉丝群›
175: 取消
176: confirm

## 消息与社交 / 群管理（群主）· 粉丝团群聊 · Luma Live / group-manage-owner.html
121: 返回 -> fan-group-chat.html
126: 编辑公告
130: 群消息免打扰
135: 群成员管理› -> ../host/fan-club.html
141: 举报›
150: 公告内容
152: 取消
152: 保存

## 消息与社交 / 单聊设置 · 1 对 1 私信 · Luma Live / chat-settings.html
180: 返回 -> direct-message.html
182: SSariLv.20勋章1勋章2› -> user-home.html
196: 消息免打扰
202: 拉黑›
204: 举报›
219: 取消
220: 确认

## 个人中心 / 黑名单管理 · 我的 · Luma Live / blacklist-management.html
107: 返回 -> profile.html
121: 取消
122: 确认

## 公会管理 / 公会中心 · 我的 · Luma Live / guild-management.html
205: 返回 -> ../profile/profile.html
205: 我的 -> guild-application-records.html
216: 搜索公会名称或 ID
223: 搜索
282: ${labels[guild.applicationState]}

## 公会管理 / 申请加入公会 · 我的 · Luma Live / guild-application-form.html
195: ‹ { location.href='guild-management.html' }
206: 更换 { location.href='guild-management.html' }
216: 请输入真实姓名
220: +62 手机号
233: portrait
242: documentType
244: documentType
252: documentFront
256: documentBack
264: 提交申请

## 公会管理 / 我的公会 · 我的 · Luma Live / guild-application-records.html
89: 返回 -> guild-management.html
107: 查看 ${guild.name} 公会详情

## 公会管理 / 公会详情 · 我的 · Luma Live / guild-detail.html
190: ‹ { location.href='guild-application-records.html' }
196: 申请退出

## 公会管理 / 申请退出公会 · 我的 · Luma Live / guild-leave-application.html
109: ‹
120: 请填写原因
122: 提交申请

## 消息与社交 / 用户主页 · Luma Live / user-home.html
316: 返回 { goBack() }
319: 更多
349: 删除好友
351: 举报
352: 拉黑
353: 取消
366: 取消
367: 确认删除
382: 取消
383: 确认拉黑
388: +关注
389: +加好友
390: ✉私信
425: 进入 ${club.hostName} 的主播主页 -> host-home.html?host=${encodeURIComponent(club.hostKey)}

## 消息与社交 / 主播主页 · 用户端 · Luma Live / host-home.html
526: 返回
528: 更多
530: ▮▮直播中
558: ♡› -> ../fan-club/my-fan-clubs.html
564: ◇礼物展馆› -> host-gift-gallery.html
570: ♙贡献榜› -> ../fan-club/fan-contribution-ranking.html
588: 举报
589: 拉黑
590: 取消
603: 取消
604: 确认拉黑
609: +关注
610: +加好友
611: ✉私信
655: 关闭粉丝团
692: 加入粉丝团

## 消息与社交 / 礼物展馆 · 主播主页 · Luma Live / host-gift-gallery.html
101: 返回

## 粉丝团 / 我的粉丝团 · 我的 · Luma Live / my-fan-clubs.html
213: ‹ { location.href='../profile/profile.html' }
239: 进入 ${club.name} 粉丝群 -> ../social/fan-group-chat.html?club=${club.id}
258: ♙贡献榜${club.leaders .map( (avatar) => /* HTML */ { location.href='fan-contribution-ranking.html' }

## 粉丝团 / 贡献榜 · 我的粉丝团 · Luma Live / fan-contribution-ranking.html
228: ‹ { location.href='my-fan-clubs.html' }
237: 本周
238: 本月
239: 累计

## 主播管理 / 主播中心 · 我的 · Luma Live / host-center.html
294: ‹ { location.href='../profile/profile.html' }
309: Jakarta Star Agency -> ../guild/guild-application-records.html
327: 今日
329: 本月
331: 数据中心 › -> live-data.html
349: 开始直播 { startLive() }
359: 粉丝列表 { location.href='fan-list.html' }
370: 粉丝团管理 { location.href='fan-club.html' }
381: 房管管理 { location.href='moderator-management.html' }
391: 分成记录 { location.href='income-sharing.html' }
401: 直播记录 { Luma.toast('进入直播记录') }
411: 公会管理 { Luma.toast('进入公会管理') }
420: 公会通知 -> host-guild-notifications.html
433: 知道了

## 主播管理 / 房管管理 · 主播中心 · Luma Live / moderator-management.html
156: 返回主播中心 { location.href='host-center.html' }
164: 添加
184: 取消
185: 确认
219: 取消房管

## 主播管理 / 公会通知 · 主播中心 · Luma Live / host-guild-notifications.html
115: ‹ { location.href='host-center.html' }
146: ${item.expanded ? "收起" : "展开全文"}

## 主播管理 / 申请成为主播 · 我的 · Luma Live / host-center-pending.html
289: ‹ { location.href='../profile/profile.html' }
313: ×
318: birthDate
323: KTP 身份证件 驾驶证
330: documentFront
334: documentBack
338: identityPhoto
340: 提交审核

## 主播管理 / 开播设置 · 主播中心 · Luma Live / start-live-settings.html
513: 返回主播中心 { location.href='host-center.html' }
520: 切换摄像头
533: cover
533: 修改封面 { document.querySelector('#cover').click() }
540: 今晚唱到你睡着修改主题
545: 唱歌 ›
547: 普通 ›
549: 美颜设置
551: ◉ 开始直播
555: ×
559: titleInput
564: 保存
569: ×
578: ×
584: roomType
588: roomType
592: roomType
608: 设置 4-12 位密码
617: 在广场展示
623: 仅粉丝团成员可进入直播间
628: 确认
635: 美颜
637: 美型
639: 恢复默认
641: ×
649: 美颜参数
724: ticketPrice
754: ${item}
804: ${item}

## 主播管理 / 粉丝列表 · 主播中心 · Luma Live / fan-list.html
89: ‹ { location.href='host-center.html' }
106: 查看 ${fan.name} 的主页

## 主播管理 / 粉丝团 · 主播中心 · Luma Live / fan-club.html
223: ‹ { location.href='host-center.html' }
225: 编辑
235: 累计最多
236: 本月最多
237: 最新加入
240: RRinaLv.18Sari 灯牌 8粉丝 Lv.11亲密度 8.860加入 2026.06.18◆25.600移除 { Luma.toast('查看 Rina 的资料') }
258: 移除
260: MMayaLv.15Sari 灯牌 6粉丝 Lv.9亲密度 6.480加入 2026.06.26◆18.240移除 { Luma.toast('查看 Maya 的资料') }
278: 移除
280: DDewiLv.12Sari 灯牌 5粉丝 Lv.7亲密度 4.260加入 2026.07.04◆9.860移除 { Luma.toast('查看 Dewi 的资料') }
298: 移除
300: 安AndiLv.12Sari 灯牌 3粉丝 Lv.3亲密度 1.860加入 2026.07.13◆4.820移除 { Luma.toast('查看 Andi 的资料') }
318: 移除
327: 取消
328: 确认移除

## 主播管理 / 粉丝团设置 · 主播中心 · Luma Live / fan-club-settings.html
120: 返回粉丝团 { location.href='fan-club.html' }
132: clubName
141: followSwitch
154: contribution
166: 保存

## 主播管理 / 直播数据 · 主播中心 · Luma Live / live-data.html
322: ‹ { location.href='host-center.html' }
327: 日数据
328: 月数据
354: 08/2026⌄
380: 取消
381: 确定
570: ${column[index + 1]}
678: ${metric.label}${metric.value}

## 主播管理 / 直播记录 · 主播中心 · Luma Live / live-records.html
326: ‹ { location.href='host-center.html' }
331: 10/8/2026 ~ 17/8/2026⌄
340: 本月⌄
350: 本月
352: 本周
354: 上月
360: 自定义
380: 取消
381: 确定
527: ${day}
529: 上个月
529: 下个月

## 主播管理 / 分成记录 · 主播中心 · Luma Live / income-sharing.html
75: ‹ { location.href='host-center.html' }
80: 分成记录
83: 03/08/2026$3.156,00 { Luma.toast('查看 03/08/2026 分成记录') }
89: 02/08/2026$1.904,00 { Luma.toast('查看 02/08/2026 分成记录') }
95: 01/08/2026$624,00 { Luma.toast('查看 01/08/2026 分成记录') }

## 钱包与充值 / 余额充值 · 用户主播 App · Luma Live / recharge.html
193: 返回 -> ../profile/profile.html
193: 明细 -> balance-detail.html
214: activityPrice
221: limitedPrice
245: ${item.price}

## 钱包与充值 / 余额明细 · 用户主播 App · Luma Live / balance-detail.html
90: 返回 -> recharge.html

## 钱包与充值 / 充值订单详情 · 余额 · Luma Live / order-income-detail.html
61: 返回 -> balance-detail.html

## 钱包与充值 / 支出订单详情 · 余额 · Luma Live / order-expense-detail.html
58: 返回 -> balance-detail.html

## 账号与登录 / 登录与注册 · 账号 · Luma Live / auth-login-register.html
213: 游客进入 ›
221: G使用 Google 账号
224: 使用手机号
230: 邮箱登录
232: Apple 登录
234: TikTok 登录
236: Facebook 登录
245: agreement
246: 《用户协议》 -> #
247: 《隐私政策》 -> #
261: 进入首页
274: 暂不取消
276: 取消注销

## 账号与登录 / 资料补全 · 账号 · Luma Live / auth-profile-completion.html
171: 更换头像
177: 更换头像
184: 输入昵称
192: 保存并进入首页
193: 先跳过 以后再改
207: 取消

## 账号与登录 / 手机号登录 · 账号 · Luma Live / auth-phone-login.html
223: 返回登录
232: 选择国家或地区区号
240: 输入手机号
249: 输入 6 位验证码
254: 获取验证码
259: 输入密码
265: 使用密码登录
268: agreement
270: 《用户协议》 -> #
271: 《隐私政策》 -> #
273: 继续
286: 进入首页

## 账号与登录 / 选择国家/地区 · 账号 · Luma Live / auth-country-select.html
116: 返回手机号登录
121: 搜索国家/地区或区号

## 账号与登录 / 邮箱登录 · 账号 · Luma Live / auth-email-login.html
202: 返回登录
211: 输入邮箱地址
220: 输入密码
229: 输入 6 位验证码
234: 获取验证码
236: 使用密码登录
239: agreement
241: 《用户协议》 -> #
242: 《隐私政策》 -> #
244: 继续
257: 进入首页

## 个人中心 / 资料编辑 · 我的 · Luma Live / profile-edit.html
185: ‹ { window.parent.postMessage({type:'luma-page',file:'profile.html'},'*');location.href='profile.html' }
191: 保存
193: coverFile
195: 编辑背景图
205: avatarFile
205: 修改头像
217: userId
220: nickname
223: signature
227: 男 女 不公开
234: region
237: birthday

## 个人中心 / 设置 · 我的 · Luma Live / settings.html
242: ‹ { window.parent.postMessage({type:'luma-page',file:'profile.html'},'*');location.href='profile.html' }
254: 修改密码已设置› -> account-password-change.html
260: 系统通知›
278: 语言›
281: 关于 Luma Live›
283: 退出登录›
285: 注销账号›
301: 取消
302: 确认
321: 关闭
331: 中文✓
339: English✓
347: Bahasa Indonesia✓
355: Bahasa Melayu✓

## 个人中心 / 设置密码 · 账号与安全 · Luma Live / account-password-set.html
13: ‹ { go('settings.html') }
16: 手机号
16: 邮箱
18: 输入 6 位验证码
18: 获取验证码
19: 至少 8 位
19: 显示
20: 再次输入密码
20: 显示
21: 完成

## 个人中心 / 修改密码 · 账号与安全 · Luma Live / account-password-change.html
13: ‹ { go('settings.html') }
16: 输入当前密码
16: 显示
17: 至少 8 位
17: 显示
18: 再次输入新密码
18: 显示
19: 忘记当前密码 -> account-password-reset.html
20: 保存

## 个人中心 / 忘记密码 · 账号与安全 · Luma Live / account-password-reset.html
13: ‹ { go('account-password-change.html') }
16: 手机号
16: 邮箱
18: 输入 6 位验证码
18: 获取验证码
19: 至少 8 位
19: 显示
20: 再次输入新密码
20: 显示
21: 重置密码
