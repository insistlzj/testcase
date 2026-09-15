# 公会 APP 批注校对清单

2026-09-11。检查 33 页，修订 30 页批注；登录、公会资料、修改密码 3 页保留。页面树新增 🟢，修订批注标红。

本轮修改批注及查看器标记，未改动公会 APP 页面交互和业务 Mock。

| 页面 | 更正内容 |
| --- | --- |
| [选择公会-02](pages/guild/auth/guild-switch.html) | 拆分公会长与公会列表，纠正“当前公会”为选中标记。 |
| [首页-03](pages/guild/home/guild-home.html) | 补齐公会信息与今日概况，明确金币收益和分成的区别。 |
| [通知消息-04](pages/guild/home/guild-notifications.html) | 补齐未读标记含义并合并时间排序说明。 |
| [通知详情-05](pages/guild/home/guild-notification-detail.html) | 按内容模块整理通知字段。 |
| [入会申请-06](pages/guild/approval/guild-join-review.html) | 补齐状态数量、申请人头像及审核阶段，统一列表状态名称。 |
| [入会申请详情-07](pages/guild/approval/guild-join-review-detail.html) | 按申请人、认证材料、审核进度拆表，补齐节点时间与入口。 |
| [退会申请-08](pages/guild/approval/guild-leave-review.html) | 补齐状态数量、申请人头像及审核阶段，统一列表状态名称。 |
| [退会申请详情-09](pages/guild/approval/guild-leave-review-detail.html) | 补齐申请状态，明确处理后字段；删除待结算收益及相关待确认项。 |
| [主播列表-10](pages/guild/people/guild-member-list.html) | 补齐搜索、状态人数与加入时间排序，删除列表不存在的退会标签描述。 |
| [主播业绩-11](pages/guild/people/guild-host-list.html) | 补齐日期、搜索、主播资料与收益字段，校正等级配置来源；三个指标统计所选周期，达标人数按去重人数统计。 |
| [主播数据-12](pages/guild/data/guild-host-summary.html) | 拆分资料、筛选和数据列表；新增粉丝改为新增，删除不存在的月份筛选。 |
| [主播主页-13](pages/guild/people/guild-host-detail.html) | 拆分主播、认证、管理和申请记录，补齐权限锁定及处理时间。 |
| [运营消息-14](pages/guild/operations/guild-messages.html) | 补齐日期选项和筛选后的记录数量。 |
| [新建运营消息-15](pages/guild/operations/guild-message-compose.html) | 拆分对象和内容，补齐接收人数、字数及图片移除。 |
| [选择主播-16](pages/guild/operations/guild-host-select.html) | 补齐主播资料、搜索结果数量和单选标记。 |
| [消息详情-17](pages/guild/operations/guild-message-detail.html) | 拆分发送信息和正文，补齐接收名单与图片。 |
| [运营账号-18](pages/guild/operations/guild-operation-accounts.html) | 补齐搜索、创建入口，区分账号 ID 与登录账号。 |
| [创建运营账号-19](pages/guild/operations/guild-operation-account-compose.html) | 拆分账号与发放额度；标出邮箱登录说明与示例格式冲突。 |
| [运营账号主页-20](pages/guild/operations/guild-operation-account-detail.html) | 拆分账号、消费明细及管理弹层，补齐锁定状态与发放字段。 |
| [送礼记录-21](pages/guild/operations/guild-operation-gift-records.html) | 拆分列表与详情，逐项补充单价、数量和虚拟金币含义。 |
| [选择运营账号（多选）-22](pages/guild/operations/guild-operation-account-select.html) | 纠正列表显示的是登录账号，补齐数量和选择标记。 |
| [账号设置-24](pages/guild/management/guild-settings.html) | 拆分账号与设置，明确公会 ID、语言及入口。 |
| [公会业绩-26](pages/guild/data/guild-income.html) | 拆分日期筛选与日/月列表，纠正月数据为所选月份。 |
| [每日-27](pages/guild/data/guild-income-day-detail.html) | 补齐历史标记、Tab 数量、主播等级及未开播展示。 |
| [直播记录-28](pages/guild/data/guild-host-data.html) | 补齐筛选、房型、时间及单场指标，明确去重与件数。 |
| [直播场次详情-29](pages/guild/data/guild-live-gift-detail.html) | 拆分场次、送礼列表和详情，删除不存在的用户等级字段。 |
| [违规记录-30](pages/guild/data/guild-all-violations.html) | 拆分筛选和违规明细，区分举报时间与发生时间。 |
| [主播分成记录-31](pages/guild/data/guild-share-ledger.html) | 拆分筛选与记录，明确 USD 单位。 |
| [公会分成记录-32](pages/guild/data/guild-share-income.html) | 明确公会分成金额为 USD，与金币收益区分。 |
| [选择主播（多选）-33](pages/guild/data/guild-violation-host-select.html) | 补齐主播资料、搜索结果人数和选中标记。 |

## 待确认口径

- 已确认并更正：公会审核通过后自动进入平台审核，无需用户再次提交。
- 已确认：平台驳回后关闭申请单；重新申请按新申请处理，重新经过公会审核，通过后自动进入平台审核。
- 创建运营账号：邮箱登录说明与非邮箱示例账号不一致。

## 原型仍存在的缺口

- 退会申请详情：通过前缺少二次确认。
- 主播详情：未结清收益的移出拦截缺失，粉丝数来源错误。
- 主播数据：新增粉丝 Mock 含负数，需改为新增口径。
- 主播业绩：日期筛选未完整更新列表收益及人数。
- 直播记录：开播人数固定为 20。
- 公会业绩：跨日、跨月开播人数尚未按主播去重。

## 校验

- 逐页核对 HTML、共享渲染脚本与 Mock 字段，所有 33 页均有批注。
- 批注脚本语法、33 页覆盖、30 页改动、表格列数及差异空白检查通过。
- 浏览器验证主播数据页的字段分组、页面树 🟢 和红色修订正常显示。
