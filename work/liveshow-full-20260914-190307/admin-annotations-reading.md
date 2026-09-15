
## admin-dashboard.html / 场景
AN-cc9bb0c1db58 平台管理员查看最新经营指标、近 7 日趋势、被动退款和快捷入口。

## admin-dashboard.html / 字段
AN-7df2dfccb1d2 | 字段 | 规则 |
AN-7a6e5ff110aa | --- | --- |
AN-00dfaffcf1a5 | 活跃用户 / 新增用户 | 最新自然日打开 App（启动或从后台切回前台）的去重登录用户数 / 完成注册的去重用户数。 |
AN-11459fe3df11 | 总充值金额 / 人数 | 支付成功充值订单的实付金额合计 / 去重用户数。 |
AN-4bef2ff2fb69 | 新用户充值金额 | 最新自然日注册用户当日支付成功的充值金额合计。 |
AN-b9ce1ecd3e3e | 新用户 ARPU | 新用户充值金额 / 新用户充值人数；分母为 0 时记 0。 |
AN-a59e9a3d216e | 达成有效天主播 | 最新自然日累计有效直播不少于 3 小时的去重主播数。 |
AN-b72939b4a50d | 被动退款 | 支付渠道发起的退款记录，按退款时间倒序。 |

## admin-dashboard.html / 业务
AN-bcebd7964ac5 1. 指标卡取最新自然日，趋势取截至该日最近 7 个自然日。

## admin-dashboard.html / 交互
AN-b5eec9f5445f 1. 点击指标卡 -> 切换趋势；刷新 -> 重新取数；点击退款记录或快捷入口 -> 进入对应页面。

## admin-user-list.html / 场景
AN-26f7749a212b 平台管理员查询用户并查看详情、封禁或解封。

## admin-user-list.html / 字段
AN-87c2ea6784d1 | 字段 | 规则 |
AN-c2785bc64fe7 | --- | --- |
AN-b38a17856d8e | 用户信息 | 头像、昵称和全局唯一用户 ID。 |
AN-23bd47bf3712 | 账号状态 | 仅正常、封禁。 |
AN-f65a7fa8153a | 财富等级 | 当前等级；筛选上下限为非负整数且上限不得小于下限。 |
AN-982ff5ebac23 | 累计充值 | 支付成功充值订单实付金额合计。 |
AN-d36b011dbb1d | 累计消费 | 普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 幸运礼物返奖；失败、撤销和虚拟金币不计。 |
AN-5603a26c5f31 | 金币余额 | 当前真实金币余额；充值退款可使其为负。 |
AN-570927ed8715 | 所属公会 | 当前有效关系，无公会显示“-”。 |
AN-a5f3127e4491 | 注册时间 | 首次注册时间；时间筛选首尾均包含。 |

## admin-user-list.html / 业务
AN-df80a43706df 1. 封禁后立即下线，正在直播时同时关播，未登录账号禁止登录。

## admin-user-list.html / 交互
AN-dafbc5bef3f3 1. 查询 -> 条件取交集；导出 -> 当前筛选结果。
AN-b1b0df8f5c6e 2. 封禁或解封 -> 填写原因并确认 -> 更新并留痕。

## admin-user-detail.html / 场景
AN-cbaa015a3f74 平台管理员核对单个用户的资料、资产、设备、关系和违规记录。

## admin-user-detail.html / 字段
AN-67dec0e9c92c | 字段 | 规则 |
AN-325308f0873c | --- | --- |
AN-c337ca60d990 | 基础资料 | 用户 ID、昵称、手机号、地区、注册时间和账号状态取当前值。 |
AN-0bbabbf41819 | 金币余额 | 当前真实金币余额；负数时禁止消费。 |
AN-234fdb556308 | 充值流水 | 充值订单、基础金币、赠送金币、渠道和状态。 |
AN-a7c06c385013 | 消费流水 | 商品、数量、扣减金币、主播和直播场次，只读。 |
AN-f2be4a82597c | 登录设备 | 设备、系统、应用版本、最近登录时间和状态。 |
AN-e28fcf322356 | 关注 / 粉丝 | 当前有效关系。 |
AN-03b95525d37c | 违规记录 | 举报或审核来源、结论、处置和时间。 |

## admin-user-detail.html / 业务
AN-f9a56fcadf9f 1. 解封只恢复登录，不自动恢复直播权限。
AN-551d89bc5934 2. 充值退款扣回原订单全部到账金币，但不撤销已完成消费。

## admin-user-detail.html / 交互
AN-338424a23323 1. 切换 Tab -> 加载明细；账号处置 -> 填写原因并确认 -> 更新并留痕。

## admin-host-list.html / 场景
AN-c4daff641770 平台管理员查询主播并管理账号、直播权限和公会管理权限。

## admin-host-list.html / 字段
AN-e6489ef4e427 | 字段 | 规则 |
AN-15d4e803e6b8 | --- | --- |
AN-c4b444a4b002 | 主播 / 公会 | 主播身份来自认证通过；公会为当前有效关系。 |
AN-bde803d86a19 | 账号状态 | 仅正常、封禁，独立于直播权限。 |
AN-ded61b7178e8 | 开播权限 | 最终权限 = 账号可用且公会有效且认证通过且平台开启且公会开启。 |
AN-b4dc89118291 | 金币收益 | 普通、定制和门票按实际消费；幸运礼物按礼物价值 × 配置比例；虚拟金币不计。 |
AN-74b8e89a01ea | 违规次数 | 已确认违规记录数，不含不成立或已作废。 |

## admin-host-list.html / 业务
AN-5460cf7d4481 1. 平台关闭直播权限时立即关播并禁止再次开播。
AN-3fd7cb8d0060 2. 锁定期间公会设置跟随平台且不可改；解锁后恢复锁定前设置并重算权限。

## admin-host-list.html / 交互
AN-01c4a469c5dc 1. 变更权限、警告、封禁或解封 -> 填写原因并确认 -> 记录前后值、操作人和时间；导出当前筛选结果。

## admin-host-detail.html / 场景
AN-c9a4fdd44c61 平台管理员查看主播身份、直播、收益、粉丝团和违规信息并执行处置。

## admin-host-detail.html / 字段
AN-55a2cb5e1010 | 字段 | 规则 |
AN-66707d22ddc9 | --- | --- |
AN-dd9df7005090 | 平台直播权限 | 平台控制项；关闭即结束当前直播。 |
AN-0d2121df6a86 | 公会管理权限 | 关闭后公会不可修改；锁定期间保留公会原设置。 |
AN-822b65c528d4 | 直播记录 | 每次开播生成独立场次并保留房型、时长、消费、处置和收益。 |
AN-cd08802d95a7 | 收益 | 普通、定制、门票按实际消费；幸运礼物 = 礼物价值 × 配置比例，默认 1%。 |
AN-d315753952a4 | 违规记录 | 已确认处置及时间。 |

## admin-host-detail.html / 业务
AN-b90c18d94ed0 1. 封禁账号与关闭直播权限独立；解封不恢复直播权限。

## admin-host-detail.html / 交互
AN-c756d6b9c3bc 1. 切换 Tab -> 加载记录；权限或账号处置 -> 填写原因并确认 -> 更新并留痕。

## admin-host-review.html / 场景
AN-68ec54484b2f 平台管理员查询公会初审通过后提交的平台主播认证申请。

## admin-host-review.html / 字段
AN-6576f674aeac | 字段 | 规则 |
AN-00a0d70437ce | --- | --- |
AN-e8dbc747b7fb | 申请单号 | 每次提交生成唯一单号；重新申请生成新单。 |
AN-fda5e64fc6cc | 主播信息 | 通过前仍为用户。 |
AN-e20e7dc1f125 | 公会信息 | 本次申请目标公会及 ID。 |
AN-3919bb7231c0 | 认证状态 | 待审核、已通过、已驳回；处理后为终态。 |
AN-20ce7cc62b4e | 提交时间 | 公会初审通过并提交平台的时间。 |

## admin-host-review.html / 业务
AN-a0eda46f32fa 1. 平台通过前无主播身份；驳回后可修改材料重新提交。

## admin-host-review.html / 交互
AN-50aecb9b90aa 1. 状态、主播和公会筛选取交集；详情 -> 核验材料并处理。

## admin-host-review-detail.html / 场景
AN-147bfa3a6c9b 平台管理员核验身份材料并完成主播认证终审。

## admin-host-review-detail.html / 字段
AN-fe4a965fa3f9 | 字段 | 规则 |
AN-b79c3d59af68 | --- | --- |
AN-db35bb3f0b35 | 申请单 / 申请人 | 只读，与列表所选申请一致。 |
AN-6f5b6cf4b69c | 认证材料 | 证件、实名、年龄和公会初审信息，按申请保留快照。 |
AN-65bfd719bdfe | 审核结果 | 仅通过、驳回。 |
AN-b14aa415f991 | 直播权限 | 通过时设置平台权限初始值。 |
AN-7336d9f7d7ac | 公会管理权限 | 通过时设置公会是否可管理。 |
AN-cc98d7eff727 | 驳回原因 | 驳回时必填并通知申请人。 |

## admin-host-review-detail.html / 业务
AN-d7ad60032a86 1. 通过后加入申请公会并获得主播身份；开播仍需满足账号、公会和双重权限。

## admin-host-review-detail.html / 交互
AN-9e1bacc54bdd 1. 仅待审核可处理；确认 -> 固化结果并禁止重复提交。

## admin-live-management.html / 场景
AN-f1cfae8f7dbe 平台管理员查询直播中和已结束场次并巡查或处置。

## admin-live-management.html / 字段
AN-9a3dee62486d | 字段 | 规则 |
AN-3d36f68cca16 | --- | --- |
AN-eb64c32a664e | 直播场次 ID | 每次开播唯一；主播直播间 ID 长期不变。 |
AN-116c3fc4c02c | 房型 | 普通、密码、门票，取开播时快照。 |
AN-52542016d1a5 | 观众人数 | 本场成功进入的去重真实用户数。 |
AN-c75a148d96df | 消费金币 | 本场普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 返奖；虚拟金币不计。 |
AN-e5769d7f918b | 直播时长 | 已结束 = 结束时间 - 开播时间；直播中 = 当前时间 - 开播时间。 |
AN-e4e4a39f3902 | 收礼数量 | 成功赠送数量合计；连送逐个计数。 |
AN-907c9d9c270a | 主播收益 | 普通、定制、门票按实际消费；幸运礼物按礼物价值 × 配置比例；虚拟金币不计。 |

## admin-live-management.html / 业务
AN-56d6c84a96ba 1. 结束后保留消息、消费、处置和收益，历史场次不可重开。

## admin-live-management.html / 交互
AN-b8f2e2786e94 1. 查询 -> 条件取交集；警告 -> 直播继续；关播 -> 立即结束当前场次。

## admin-live-detail.html / 场景
AN-b024476c3105 平台管理员查看单场直播画面、场次数据和巡房记录并即时处置。

## admin-live-detail.html / 字段
AN-996d0358ef10 | 字段 | 规则 |
AN-a3a9f085dc5e | --- | --- |
AN-a8cc3f9df7b9 | 场次信息 | 场次 ID、主播、房型、标题和时间取本场快照。 |
AN-fa1292d4b034 | 观众人数 | 本场进入直播间的去重用户数。 |
AN-9ff196c9678d | 金币收益 | 本场普通礼物、定制礼物和门票扣减金币 + 幸运礼物扣减金币 - 幸运礼物返还金币；虚拟金币不计。该字段是用户实际消费，不是主播结算收益。 |
AN-8bc165c2a853 | 收礼数量 | 本场成功送出的礼物数量合计；门票不计。 |
AN-d3c43a02cfd1 | 巡房记录 | 巡房人员、进入时间、问题、处置和备注。 |
AN-a44fb43218d3 | 直播状态 | 直播中、已结束；已结束只读。 |

## admin-live-detail.html / 业务
AN-cb39cf6fd2cf 1. 警告不改状态；关播只结束本场；关闭直播权限在举报处置或主播权限中执行。

## admin-live-detail.html / 交互
AN-960d208afdde 1. 警告或关播 -> 填写原因并确认 -> 通知主播并留痕；已结束时无即时处置。

## admin-inspection-schedule.html / 场景
AN-b6ff0acb9cfd 平台管理员查询、启停巡房排班并查看排班人员。

## admin-inspection-schedule.html / 字段
AN-39ec1bc665a9 | 字段 | 规则 |
AN-cf2869435fde | --- | --- |
AN-9c3d003c09a4 | 排班编号 | 创建时生成，全局唯一。 |
AN-1a4ee13194b8 | 日期 / 时间段 | 平台统一时区；结束时间晚于开始时间。 |
AN-ebc6aec54662 | 排班人数 | 有效巡房人员数量。 |
AN-93a7f6d5c435 | 状态 | 待生效、生效中、已停用、已结束；按时间和启停状态计算。 |

## admin-inspection-schedule.html / 业务
AN-236aaf578937 1. 仅有效排班或任务期间赋予巡房会话身份；可进入任意直播间，无需密码或门票。
AN-46082632c40d 2. 巡房会话不受主播黑名单和本场踢出限制，主播与房管不可对其拉黑或踢出。
AN-578f97188e7f 3. 保护仅限巡房会话，原有拉黑关系不变；平台封禁或巡房权限失效仍不可进入。

## admin-inspection-schedule.html / 交互
AN-e6d0940b06a2 1. 停用 -> 不再生效；重新启用 -> 按当前时间重算状态。

## admin-inspection-schedule-create.html / 场景
AN-4b9d9ae39b42 平台管理员创建巡房日期、时间段和人员名单。

## admin-inspection-schedule-create.html / 字段
AN-5a6bab1801a8 | 字段 | 规则 |
AN-8cafa3086fd2 | --- | --- |
AN-852d650d7a97 | 日期 | 必填，不早于当前日期。 |
AN-31c150fd3778 | 时间段 | 起止必填，结束晚于开始。 |
AN-75d298052446 | 巡房人员 | 至少 1 个可用账号，不可重复。 |

## admin-inspection-schedule-create.html / 业务
AN-96b1ac77d833 1. 巡房人员从用户端可用账号中选择；平台封禁账号不可加入。

## admin-inspection-schedule-create.html / 交互
AN-61739e6a1104 1. 添加 -> 搜索并勾选；全选仅作用当前结果；保存 -> 创建排班并返回列表。

## admin-inspection-schedule-detail.html / 场景
AN-c0b00aab31ea 平台管理员只读查看排班时间、状态和人员。

## admin-inspection-schedule-detail.html / 字段
AN-b49a34ec691c | 字段 | 规则 |
AN-d09f83e0ed80 | --- | --- |
AN-d8bfc02b6da1 | 排班信息 | 编号、日期、起止时间、人数、状态和创建时间取创建记录。 |
AN-71e90a4212c0 | 巡房人员 | 头像、昵称、用户 ID 和当前等级；人数 = 有效人员行数。 |

## admin-inspection-schedule-detail.html / 业务
AN-375b0a2e9bfb 1. 人员账号后续封禁时不可巡房，但历史排班名单保留。
AN-e14c14d45355 2. 排班有效期间进入直播间后生成巡房会话；会话结束后不再享有拉黑、踢出、密码和门票豁免。

## admin-content-audit.html / 场景
AN-a532171e6837 平台管理员处理自动审核产生的直播内容告警。

## admin-content-audit.html / 字段
AN-587c647f3ef9 | 字段 | 规则 |
AN-20a33775a33c | --- | --- |
AN-64b7a2f9caba | 审核单号 | 每条机审告警唯一。 |
AN-586bb6cb36d4 | 命中类型 / 风险等级 | 机审结果，仅供人工判断，不直接处罚。 |
AN-e1d72c3c85ef | 告警截图 | 命中时证据快照。 |
AN-7beea72890fb | 审核状态 | 待处理、人工复审中、已忽略、已处置。 |
AN-e780b6bfd46e | 处置结果 | 未处理为“-”；处理后为最终动作。 |

## admin-content-audit.html / 业务
AN-558f51a6c1e8 1. 忽略表示误报；转人工复审保持处理中；其他动作按选择结果执行。

## admin-content-audit.html / 交互
AN-51b519978555 1. 快捷忽略 -> 完成告警；处理 -> 选择动作并填写原因 -> 更新状态和记录。

## admin-content-audit-detail.html / 场景
AN-4ac80311bf8a 平台管理员核对告警材料并提交人工复审结论。

## admin-content-audit-detail.html / 字段
AN-bc721f11a4ae | 字段 | 规则 |
AN-d9947fac8df7 | --- | --- |
AN-1ba4dc1df669 | 基础信息 | 审核单、场次、主播、命中类型、风险和时间只读。 |
AN-8388a93712c9 | 告警材料 | 机审截图或视频，处理后保留。 |
AN-a655c6512f16 | 处置类型 | 转人工复审、忽略及页面提供的处置项。 |
AN-836af31cda82 | 处置原因 | 提交时必填，同时保存审核人和时间。 |

## admin-content-audit-detail.html / 业务
AN-605762e7ad0d 1. 忽略不改变直播或账号；已忽略、已处置为终态，复审中可继续处理。

## admin-content-audit-detail.html / 交互
AN-b1ca19ad1723 1. 提交 -> 校验动作和原因 -> 执行并固化复审记录。

## admin-account-violation.html / 场景
AN-ce32511d2981 平台管理员查询用户或主播账号举报工单。

## admin-account-violation.html / 字段
AN-772a895910af | 字段 | 规则 |
AN-1939117ed478 | --- | --- |
AN-07fbf25b6039 | 被举报账号 | 昵称、账号 ID 和类型。 |
AN-3e6bfa551a30 | 举报类型 | 提交时快照；配置变更不改历史。 |
AN-a3d7ef48ce27 | 账号状态 | 当前正常或封禁。 |
AN-671dbe63f8de | 处理状态 | 待处理、已处理；每单只处理一次。 |
AN-779acd05bfc8 | 提交时间 | 工单生成时间。 |

## admin-account-violation.html / 业务
AN-e777487dd82b 1. 举报不直接改变账号；处置仅不处置或封禁。

## admin-account-violation.html / 交互
AN-54a676cfa368 1. 查询 -> 条件取交集；查看 -> 进入详情处理或查看结果。

## admin-report-handling.html / 场景
AN-97c86b5b16d4 平台管理员查询直播场次举报工单。

## admin-report-handling.html / 字段
AN-47631be7858a | 字段 | 规则 |
AN-3645dc6e69c5 | --- | --- |
AN-d3e62197476d | 直播场次 ID | 关联被举报的单次场次。 |
AN-5bbd1affa49f | 举报类型 | 提交时快照。 |
AN-e73691028697 | 直播状态 | 直播中、已结束。 |
AN-097f908a6a03 | 处理状态 | 待处理、已处理、已作废。 |
AN-a2dd773e1068 | 提交时间 | 用户在直播中提交举报的时间。 |

## admin-report-handling.html / 业务
AN-580020d61287 1. 直播举报入口仅在直播中开放；待处理期间直播结束，工单自动作废。

## admin-report-handling.html / 交互
AN-9e4f782b3f80 1. 查看 -> 进入详情；已处理或已作废只读。

## admin-report-detail.html / 场景
AN-9a40471ad027 平台管理员核对举报对象、说明和证据并提交一次性处置。

## admin-report-detail.html / 字段
AN-28d30b81d7b5 | 字段 | 规则 |
AN-1a9de2ebf875 | --- | --- |
AN-dc70455c16bf | 举报对象 | 账号举报关联账号；直播举报关联场次和主播。 |
AN-03eaa45db05a | 内容 / 证据 | 用户提交快照，处理后保留。 |
AN-624dd3de359a | 处置类型 | 账号：不处置、封禁；直播：不处置、警告、关播、关闭直播权限。 |
AN-deca32de7970 | 处置原因 | 执行处罚时必填并写入日志。 |
AN-fba0826659c0 | 通知 | 按结果通知举报人；直播处罚同时通知主播。 |

## admin-report-detail.html / 业务
AN-a6727e320d56 1. 警告继续直播；关播只结束本场；关闭直播权限同时关播并阻止再开播。
AN-a7b745ef6f0f 2. 封禁账号立即下线并结束直播；待处理直播工单在直播结束时自动失效，页面状态显示“已作废”。

## admin-report-detail.html / 交互
AN-1775e4be8fdc 1. 处理 -> 选择合法处置并填写原因 -> 执行、通知并置为已处理；终态不可重复提交。

## admin-violation-types.html / 场景
AN-fad048ccf722 平台管理员维护用户举报入口和后台筛选共用的违规类型。

## admin-violation-types.html / 字段
AN-ba48022b8a3e | 字段 | 规则 |
AN-5d60a788db32 | --- | --- |
AN-20ed744bf095 | 类型 ID | 系统生成，全局唯一。 |
AN-055f70051ef9 | 排序 | 正整数，数值越小越靠前。 |
AN-ecf38e92307e | 多语言名称 | 列表中文，用户端按语言展示。 |
AN-3519d1e338eb | 类型属性 | 系统预置、自定义；预置不可删除。 |
AN-fd7f817a29b2 | 状态 | 预置固定启用；自定义可启停。 |

## admin-violation-types.html / 业务
AN-602250e4d973 1. 停用或删除后不用于新举报，历史保留提交时名称。

## admin-violation-types.html / 交互
AN-f9012577c135 1. 上下移 -> 更新排序；删除自定义类型 -> 确认后移除；编辑 -> 进入详情。

## admin-violation-type-detail.html / 场景
AN-6a3250a6c63c 平台管理员新增或编辑违规类型。

## admin-violation-type-detail.html / 字段
AN-18f41d289999 | 字段 | 规则 |
AN-568a6f97ad86 | --- | --- |
AN-7e5cdd308c09 | 类型 ID | 新建系统生成，编辑只读。 |
AN-f23b04e3c4e5 | 四语名称 | 中文、英语、印尼语、马来语均必填，同语言不可重复。 |
AN-e16f0ecf21b0 | 排序 | 必填正整数。 |
AN-bd946cd1808f | 类型属性 | 创建后不可切换预置 / 自定义。 |
AN-5331d678b4e1 | 状态 | 预置固定启用，自定义可调。 |

## admin-violation-type-detail.html / 交互
AN-c34c2684ee2f 1. 保存 -> 校验四语、唯一性和排序 -> 用于新举报及筛选。

## admin-guild-list.html / 场景
AN-340a3061e7f3 平台管理员查询、新建、启停或解散公会。

## admin-guild-list.html / 字段
AN-56d1a4dfa42e | 字段 | 规则 |
AN-95c163a37523 | --- | --- |
AN-b54c8a4ed038 | 公会信息 | 全局唯一 ID、当前名称和 Logo。 |
AN-5248687a93a8 | 公会长 | 昵称和管理账号。 |
AN-4b5a7d4b5d2d | 主播人数 | 当前公会有效主播关系去重计数。 |
AN-76b323070272 | 公会状态 | 启用、停用、已解散；已解散为终态。 |

## admin-guild-list.html / 业务
AN-4a0943c8f2b0 1. 公会停用时，该公会所有管理账号均不能登录，但各账号自身状态不变。
AN-f811144264a0 2. 公会长账号停用时，仅该账号不能登录，不改变公会状态，也不影响主播。
AN-622822462103 3. 解散前须结清全部主播收益；解散后账号失效、关系解除、主播失去身份并停止开播。

## admin-guild-list.html / 交互
AN-afd9c9987ce6 1. 新建 -> 详情编辑态；启停或解散 -> 校验并确认 -> 更新状态和关联对象。

## admin-guild-detail.html / 场景
AN-031d4403a675 平台管理员查看或编辑公会资料、主播和公会长账号。

## admin-guild-detail.html / 字段
AN-3eb8e4dc67a1 | 字段 | 规则 |
AN-1490b4536aa0 | --- | --- |
AN-d57f549055f3 | 公会 ID | 系统生成，创建后不可改。 |
AN-cd93007a87f2 | 名称 / Logo / 简介 | 名称和 Logo 必填。 |
AN-7d6ff0230d69 | 公会长 / 管理账号 | 新建必填；管理账号全局唯一。 |
AN-26b37aa60de6 | 公会长账号状态 | 启用、停用；与公会状态分别保存。 |
AN-a3721dad95cd | 初始密码 | 仅新建必填；重置后立即生效。 |
AN-c39754b11ee0 | 主播列表 | 仅展示当前公会的主播。 |
AN-672966d1ac2b | 累计收益 | 旗下所有主播的收益汇总。 |

## admin-guild-detail.html / 业务
AN-a24b91993a04 1. 公会仅管理本公会主播，平台权限优先。
AN-24177def9cd3 2. 登录须同时满足公会启用和管理账号自身启用。公会停用会拦截全部管理账号；公会长账号停用只拦截该账号。

## admin-guild-detail.html / 交互
AN-337cc7b8faa0 1. 公会状态与公会长账号状态分别操作；账号状态通过开关切换。
AN-db3a515a2c2f 2. 资料和管理账号分别保存；重置密码不改账号；解散 -> 未结收益为 0 后确认。

## admin-gift-list.html / 场景
AN-5aa9e295bc0c 平台管理员查询、新增、编辑和上下架普通礼物。

## admin-gift-list.html / 字段
AN-dd1acd64a010 | 字段 | 规则 |
AN-6976d76e6857 | --- | --- |
AN-a41845e4c973 | 礼物 ID | 全局唯一，创建后不可改。 |
AN-e139f2ee28a3 | 四语名称 | 中文、英语、印尼语、马来语均必填。 |
AN-f8e7fa67893f | 单价 | 正整数金币，赠送扣减 = 单价 × 数量。 |
AN-34c99e3b8b15 | 图标 / 特效 | 图标必填；特效按资源要求上传。 |
AN-77b98e0bc9d9 | 排序权重 | 整数，数值越大面板越靠前。 |
AN-ffc4ca3e0a86 | 状态 | 上架、下架；普通礼物由平台手动切换。 |

## admin-gift-list.html / 业务
AN-f8da41a33a78 1. 主播收益 = 成功赠送实际消费金币；下架只阻止新赠送，历史消费和收益保留。

## admin-gift-list.html / 交互
AN-3a672eeeff7b 1. 保存 -> 校验必填、ID 和价格 -> 更新列表；上下架或删除 -> 确认后执行。

## admin-gift-detail.html / 场景
AN-14f9ffe3dd26 平台管理员新增或编辑普通、定制礼物的名称、资源、价格和状态。

## admin-gift-detail.html / 字段
AN-d5a40d0bc7b9 | 字段 | 规则 |
AN-6a941cffb8bf | --- | --- |
AN-1dbb123da226 | 礼物 ID | 新建时唯一，编辑时只读。 |
AN-f631545e9eb0 | 四语名称 | 四项均必填，按客户端语言展示。 |
AN-cd50c56e0497 | 图标 / 特效 | 图标必填；删除素材后保存前须重新上传必填资源。 |
AN-f58c6b84e5bd | 单价 | 正整数金币。 |
AN-e3cdd731d50c | 排序权重 | 整数，数值越大越靠前。 |
AN-f9ec1e0a4daa | 生效时间 | 仅定制礼物必填，失效时间晚于生效时间。 |
AN-0aa6ddea57c5 | 操作记录 | 保存操作类型、说明、操作人和时间。 |

## admin-gift-detail.html / 业务
AN-9be609b2c6d9 1. 定制礼物到时自动生效和失效，可提前下架；普通、定制收益均按实际消费金币 1:1 计入。

## admin-gift-detail.html / 交互
AN-4f2dfabeff17 1. 保存 -> 校验字段和时间 -> 留在当前详情；删除 -> 确认后返回列表。

## admin-custom-gift.html / 场景
AN-bc69c96ca9dd 平台管理员维护有投放期限的定制礼物。

## admin-custom-gift.html / 字段
AN-451aa8197d16 | 字段 | 规则 |
AN-9e55c3633c56 | --- | --- |
AN-4e640becfc85 | 名称 / 单价 / 资源 / 排序 | 与礼物详情同口径。 |
AN-066e67c9ee85 | 生效 / 失效时间 | 均必填，失效晚于生效；状态按当前时间计算。 |
AN-c9bec498deb7 | 上下架状态 | 未生效、上架中、已下架；提前下架覆盖自动排期。 |

## admin-custom-gift.html / 业务
AN-296c5c284171 1. 到生效时间自动上架，到失效时间自动下架；下架不改历史赠送快照。

## admin-custom-gift.html / 交互
AN-d2bd8f632af1 1. 新增或编辑 -> 礼物详情；提前下架 -> 确认后停止新赠送。

## admin-lucky-gift-config.html / 场景
AN-75c908a5977d 平台管理员查询、上下架和维护幸运礼物开奖配置。

## admin-lucky-gift-config.html / 字段
AN-b9b78ed9dbcd | 字段 | 规则 |
AN-57826831aa5e | --- | --- |
AN-404019de5194 | 幸运礼物收益比例 | 全部幸运礼物共用；默认 1%，可配置 0% 至 100%。 |
AN-760853da0c15 | 单次消耗 | 每次独立开奖先扣减的正整数金币。 |
AN-87d84e91fe3a | 开奖次数 | 单笔礼物包含的独立开奖次数，正整数。 |
AN-9bc753ceaf25 | 单价 | 单次消耗 × 开奖次数。 |
AN-6b192196efe5 | RTP | Σ（奖励金币 × 中奖概率）/ 单次消耗 × 100%；按概率配置实时计算，结果超过一位小数时向上取整至一位小数。 |
AN-3f86f6c2058f | 状态 | 单礼物上下架；功能总开关关闭时全部幸运礼物不可见。 |

## admin-lucky-gift-config.html / 业务
AN-c7eed5dd2a06 1. 每次开奖独立；单次期望返还 = Σ（奖励金币 × 中奖概率），用户实际消费 = 礼物价值 - 实际返还。
AN-aca0b5792eca 2. 返还金币进入用户余额；主播收益 = 幸运礼物价值 × 赠送时收益比例，默认 1%，返还结果不影响主播收益。
AN-df76e79c6c3e 3. 收益记录保存赠送时的比例快照，修改比例不重算历史收益。
AN-c7a74af6110f 4. 下架不影响已完成开奖、消费和结算记录。

## admin-lucky-gift-config.html / 交互
AN-c834a9b7ecf6 1. 点击编辑 -> 比例可输入、按钮变为保存；保存 -> 校验 0% 至 100% -> 对保存后的新赠送生效。
AN-d4e43f832930 2. 礼物编辑 -> 进入配置详情；上下架或删除 -> 确认后执行。

## admin-lucky-gift-detail.html / 场景
AN-d9668d23df5a 平台管理员配置幸运礼物价格、开奖次数、奖励档位和概率。

## admin-lucky-gift-detail.html / 字段
AN-894abab7052f | 字段 | 规则 |
AN-9e9e208c7e8d | --- | --- |
AN-d8337565bfb2 | 礼物 ID / 四语名称 / 资源 | ID 唯一；四语和图标必填。 |
AN-f98a828d43e4 | 单次消耗 | 每次开奖消耗的正整数金币。 |
AN-268472d3111a | 开奖次数 | 正整数；礼物单价 = 单次消耗 × 开奖次数。 |
AN-78f05b777f89 | 奖励金币 | 每档非负整数，可为 0；档位不可重复。 |
AN-ecbde55066c6 | 中奖概率 | 每档 0% 至 100%，全部档位合计必须等于 100%。 |
AN-bb40af376860 | RTP | Σ（奖励金币 × 概率）/ 单次消耗 × 100%；结果超过一位小数时向上取整至一位小数，保存前自动校验。 |

## admin-lucky-gift-detail.html / 业务
AN-f234d4a74699 1. 用户实际消费 = 礼物价值 - 实际返还；该值用于用户资产核对，不作为当前主播收益公式。
AN-d5eea8dd484f 2. 主播收益使用幸运礼物列表页的全局比例，返奖不影响收益。
AN-ea0e1306b690 3. 概率合计非 100% 或 RTP 未验证时不得生效。

## admin-lucky-gift-detail.html / 交互
AN-8e3d837325fe 1. 增删档位或修改概率 -> 实时重算 RTP；保存 -> 校验全部公式和必填项 -> 更新配置。

## admin-prop-list.html / 场景
AN-51bff2449dcd 平台管理员按类型查询、新增、编辑和上下架道具。

## admin-prop-list.html / 字段
AN-f2ad73bfb8de | 字段 | 规则 |
AN-1b849ae4b099 | --- | --- |
AN-63854f1110ba | 道具类型 | 仅使用 APP 已支持的勋章、气泡、头像框，不支持新增；类型名称支持四语配置。 |
AN-84a27fc9deaf | 道具 ID | 全局唯一。 |
AN-7407622eb089 | 道具名称 | 四语配置，按客户端语言展示。 |
AN-cb13823c9784 | 单价 | 用户通过金币购买道具时，每件道具扣减的金币数量，必须为正整数。 |
AN-024c81107d90 | 图标 / 排序 | 图标必填；排序权重越大越靠前。 |
AN-b4fd88a87457 | 上下架状态 | 上架后，用户可通过活动或金币购买获得道具。 |
AN-c0d9b58bb99b | 可佩戴期限 | 获得道具用户期限内可佩戴，过期后不可佩戴，用户端显示已过期，修改配置只对未来用户生效。默认当天至当天后第 30 天；不限表示永久。 |

## admin-prop-list.html / 业务
AN-f248c217d822 1. 上下架仅控制能否获得；下架不影响已获得道具。
AN-5db3a358c460 2. 当前日期处于可佩戴期限内才可佩戴；过期后不可佩戴，用户端显示已过期。

## admin-prop-list.html / 交互
AN-3e7f42f127a6 1. 类型 Tab -> 切换列表；新增或编辑 -> 详情；删除道具 -> 校验引用后确认。

## admin-prop-detail.html / 场景
AN-7f0701c4f557 平台管理员新增或编辑道具名称、类型、资源和状态。

## admin-prop-detail.html / 字段
AN-f824883bc504 | 字段 | 规则 |
AN-1b5fb3b77102 | --- | --- |
AN-043369db5620 | 道具 ID | 新建唯一，编辑只读。 |
AN-88ebab4368cc | 四语名称 | 全部必填。 |
AN-a32351fe157c | 道具类型 | 只能选择 APP 已支持的固定类型。 |
AN-091c052601c2 | 单价 | 用户通过金币购买道具时，每件道具扣减的金币数量，必须为正整数。 |
AN-4f19d34f4665 | 图标 / 素材 | 均必填，符合对应资源格式。 |
AN-500bed52a613 | 排序权重 | 整数，数值越大越靠前。 |
AN-7ffc3d9bae42 | 上下架状态 | 上架后，用户可通过活动或金币购买获得道具。 |
AN-d17fc56d4c36 | 可佩戴期限 | 获得道具用户期限内可佩戴，过期后不可佩戴，用户端显示已过期，修改配置只对未来用户生效。默认当天至当天后第 30 天；开始日期不能早于当天，结束日期必须晚于开始日期；不限表示永久。 |
AN-7a1036377952 | 操作记录 | 保存变更说明、操作人和时间。 |

## admin-prop-detail.html / 业务
AN-9e14848e8536 1. 已获得道具仅在可佩戴期限内可佩戴；过期后不可佩戴，用户端显示已过期。

## admin-prop-detail.html / 交互
AN-298c696bc36d 1. 保存 -> 校验字段、资源和可佩戴期限 -> 留在详情并追加操作记录。

## admin-gift-send-count-rules.html / 场景
AN-13b5a9962c8c 平台管理员维护礼物面板的可选赠送数量。

## admin-gift-send-count-rules.html / 字段
AN-b0800e0565fb | 字段 | 规则 |
AN-f999607c8340 | --- | --- |
AN-f6eceb93b695 | 规则 ID | 系统生成，全局唯一。 |
AN-e848bf805831 | 赠送数量 | 一条规则包含多个互不重复的正整数，按配置顺序展示。 |
AN-f3b3f201d203 | 默认数量 | 必须属于当前赠送数量列表。 |
AN-f9bf9901e742 | 适用礼物 | 每个礼物只能关联一条启用规则。 |
AN-9e89d807d281 | 状态 | 启用、停用。 |

## admin-gift-send-count-rules.html / 业务
AN-e1f583be39dc 1. 停用后关联礼物默认仅支持 ×1，不影响已完成赠送。

## admin-gift-send-count-rules.html / 交互
AN-74644abc473f 1. 启用 -> 校验礼物冲突；编辑 -> 进入详情。

## admin-gift-send-count-rule-detail.html / 场景
AN-b7bcda27bd3a 平台管理员新增或编辑赠送数量及适用礼物。

## admin-gift-send-count-rule-detail.html / 字段
AN-b3a05f0b3a97 | 字段 | 规则 |
AN-215f1e45a1fa | --- | --- |
AN-341738474acc | 赠送数量 | 至少 1 个，均为互不重复的正整数，支持拖动排序。 |
AN-7a8959498217 | 默认数量 | 从当前赠送数量列表中选择。 |
AN-4dfc97613212 | 适用礼物 | 按礼物类型筛选和全选；至少 1 个；每个礼物只能关联一条启用规则。 |
AN-56b5df619fbd | 状态 | 启用前执行冲突校验。 |

## admin-gift-send-count-rule-detail.html / 交互
AN-b9e655b41d9c 1. 添加、删除或拖动数量 -> 实时更新默认数量选项；保存 -> 校验数量、默认数量、礼物和启用冲突。

## admin-placement-config.html / 场景
AN-835fc0ed3c30 平台管理员查询客户端展示位及投放计划。

## admin-placement-config.html / 字段
AN-c5bea9ebe3a0 | 字段 | 规则 |
AN-f68d1347aecb | --- | --- |
AN-108f03fcdaf0 | 展示位置 | 仅直播广场运营位、福利中心轮播位。 |
AN-b2bb5c029d03 | 展示素材 | 显示当前配置内的轮播素材数量。 |
AN-5ffcef066523 | 展示周期 | 按日期配置，开始日和结束日均包含。 |
AN-a01f1bcc0725 | 状态 | 当前日期在展示周期内且配置启用时为展示，否则隐藏。 |

## admin-placement-config.html / 业务
AN-3540cac5f2f2 1. 同一展示位置的配置有效时间不得重叠；同一配置内的多项轮播内容共用排期、同时生效，不互相判定冲突。

## admin-placement-config.html / 交互
AN-98fd65f516ba 1. 查询 -> 位置、周期和状态取交集；编辑 -> 详情；删除 -> 确认后停止投放。

## admin-placement-detail.html / 场景
AN-0dde74ab20f8 平台管理员配置展示位素材、跳转目标和展示周期。

## admin-placement-detail.html / 字段
AN-2695290f5d98 | 字段 | 规则 |
AN-c3dab20f70cf | --- | --- |
AN-66e8b266e57b | 展示位置 / 状态 | 展示位置仅直播广场运营位、福利中心轮播位；状态关闭时不投放。 |
AN-96dafa1f01e3 | 轮播内容 | 最少 1 项、最多 5 项；每项包含展示素材、跳转类型及对应目标内容，左侧序号即轮播顺序。 |
AN-4274d44854bd | 展示素材 | 每项必传图片；点击已上传素材预览，删除后可重新上传。 |
AN-e4d981c0ef20 | 跳转类型 | APP 已有页面或活动长图页面。 |
AN-f79e046252f1 | 目标内容 | APP 页面须选择目标页面；活动长图页面须上传详情长图。 |
AN-19cc510e05ef | 展示周期 | 按日期配置，开始日和结束日均包含；同一配置内各项共用。 |

## admin-placement-detail.html / 业务
AN-b7017cc07d43 1. 同一配置内允许多项内容同时生效，不判定排期冲突；不同配置按展示位置和展示周期校验冲突。
AN-5f461ba7914b 2. 保存后按当前序号轮播。删除已保存项须确认，新添加未保存项直接删除；只剩 1 项时禁止删除。

## admin-placement-detail.html / 交互
AN-15e6551ecfd8 1. 添加 -> 新增轮播行；拖动手柄 -> 调整顺序并更新序号。
AN-73c2f452cb87 2. 切换跳转类型 -> 在目标页面选择器和活动长图上传间切换。
AN-981c40fce23e 3. 保存 -> 逐行校验展示素材、跳转类型和目标内容，错误定位到对应行；通过后保留当前顺序。

## admin-push-management.html / 场景
AN-abbea0c38d8e 平台管理员查询、新建和查看推送任务。

## admin-push-management.html / 字段
AN-416dec78c745 | 字段 | 规则 |
AN-847cd58268fa | --- | --- |
AN-0f8e56ab8096 | 推送 ID / 标题 | ID 唯一；列表标题按后台中文展示。 |
AN-6059290e21ea | 目标用户 | 全部用户或指定公会用户。 |
AN-55242c6bcdbc | 发送人数 | 实际成功发送的去重账号数。 |
AN-dbfb5d74ac70 | 发送时间 | 计划时间；已发送后保留实际执行结果。 |

## admin-push-management.html / 业务
AN-f2d1e446b86b 1. 已发送任务及发送结果只读。

## admin-push-management.html / 交互
AN-6a62b4af444c 1. 查询 -> 内容、目标、状态和时间取交集；新建或待发送编辑 -> 详情。

## admin-push-detail.html / 场景
AN-17207c08b027 平台管理员编辑推送文案和目标用户。

## admin-push-detail.html / 字段
AN-2761794679d2 | 字段 | 规则 |
AN-5cc83acb8628 | --- | --- |
AN-87493f1a3d1f | 推送 ID | 新建系统生成，已存在只读。 |
AN-de87cbe9b904 | 四语标题 / 内容 | 中文、英语、印尼语、马来语均必填。 |
AN-d2783e37a16a | 目标用户 | 全部用户或一个有效公会用户范围。 |
AN-3800659eea3c | 操作信息 | 记录最后操作人。 |

## admin-push-detail.html / 交互
AN-32ca0d8a1fc2 1. 立即发送 -> 校验四语和目标用户 -> 模拟发送成功，状态变为已发送，当前页只读。

## admin-recharge-package.html / 场景
AN-1e5b184720eb 平台管理员查询、新增、编辑和上下架充值套餐。

## admin-recharge-package.html / 字段
AN-9b3d545243b9 | 字段 | 规则 |
AN-e07d58458c05 | --- | --- |
AN-c0b609636311 | 套餐类型 | 常规长期展示；活动按有效期展示。 |
AN-2e78d5fafd60 | 销售价格 | 大于 0 的 USD 金额。 |
AN-c71f735933bd | 充值 / 赠送金币 | 基础金币大于 0，赠送金币不小于 0；到账 = 两者之和。 |
AN-e342d47daf82 | 单用户限购 | 非负整数；0 表示不限。 |
AN-a239312cb6f1 | 排序 / 状态 | 权重越大越靠前；下架后不可新购。 |

## admin-recharge-package.html / 业务
AN-816798a552d2 1. 配置变更不追溯已完成充值订单。

## admin-recharge-package.html / 交互
AN-cd101518f63c 1. 编辑 -> 详情；上下架或删除 -> 确认后仅影响后续购买。

## admin-recharge-package-detail.html / 场景
AN-9eb4ce8e0d44 平台管理员配置充值套餐价格、金币、封面和活动期限。

## admin-recharge-package-detail.html / 字段
AN-f6b3408ac23d | 字段 | 规则 |
AN-74ac018535a3 | --- | --- |
AN-59ebe3b15707 | 套餐 ID | 新建唯一，编辑只读。 |
AN-b1635fdeb3e8 | 类型 / 封面 | 类型必选，封面必传。 |
AN-291770bbe783 | 销售价格 | 大于 0，最多两位小数，USD。 |
AN-acc9d8c18abe | 充值 / 赠送金币 | 正整数 / 非负整数；到账金币 = 充值金币 + 赠送金币。 |
AN-5bad3e4d513e | 限购次数 | 活动套餐必填非负整数，0 为不限；用户每笔支付成功订单占用 1 次。 |
AN-a4980e93dbcb | 有效时间 | 活动套餐必填，结束晚于开始。 |
AN-b987deeaff58 | 排序 / 状态 | 排序为整数；上架后按类型和有效期展示。 |

## admin-recharge-package-detail.html / 业务
AN-e32aa3acfb2d 1. 活动套餐订单支付成功后占用限购次数；后续发生全额退款时不恢复，防止用户反复购买、退款并重复获得活动资格。

## admin-recharge-package-detail.html / 交互
AN-5db148585fa1 1. 切换活动套餐 -> 显示并要求限购、有效时间；保存 -> 校验后更新。

## admin-task-config.html / 场景
AN-2caced1afa58 平台管理员查询、启停和维护客户端任务。

## admin-task-config.html / 字段
AN-8ef8d854b9e4 | 字段 | 规则 |
AN-254c5e907865 | --- | --- |
AN-7ef7df5c2d16 | 任务 ID / 名称 | ID 唯一；名称按四语配置。 |
AN-2a55c9772356 | 用户动作 | 登录、观看、赠礼、分享、邀请等系统预置动作。 |
AN-3dc6716ae5e3 | 生效时间 | 当前时间处于起止范围且状态启用时生效。 |
AN-d1c87bb6ae6c | 状态 | 启用、停用；停用后不产生新进度。 |

## admin-task-config.html / 业务
AN-a91f4b4cfc61 1. 动作和指标由系统预置；本期奖励仅金币且由用户手动领取。

## admin-task-config.html / 交互
AN-aafaaff7da64 1. 新增或编辑 -> 详情；启停 -> 确认后影响后续进度，不回收已领奖励。

## admin-task-detail.html / 场景
AN-3a40fa11c94b 平台管理员配置任务动作、指标、周期、阈值和金币奖励。

## admin-task-detail.html / 字段
AN-1fd3fba54d7b | 字段 | 规则 |
AN-7e70cd465459 | --- | --- |
AN-b917246c1afe | 四语名称 | 全部必填。 |
AN-55c610c22630 | 生效时间 | 起止必填，结束晚于开始。 |
AN-48d15d1cc84a | 用户动作 / 指标 | 指标随动作联动，只能选择系统预置组合。 |
AN-c7f91a9ec959 | 统计周期 | 仅展示该指标支持的每日、每周、每月或任务期累计。 |
AN-2e31794dd3a2 | 达成条件 | 至少 1 条；同任务阈值互不重复且为正数。 |
AN-33312aed38f7 | 达成奖励 | 正整数金币；每个阈值独立可领取一次。 |

## admin-task-detail.html / 业务
AN-ac9c91dd62d7 1. 周期开始时周期型进度归零；任务期累计不归零；仅金币奖励且手动领取。

## admin-task-detail.html / 交互
AN-d2bd70c33107 1. 切换动作 -> 重置可选指标和周期；保存 -> 校验条件、阈值、奖励和时间。

## admin-guild-recommendation.html / 场景
AN-d95ea882985e 平台管理员维护客户端公会推荐顺序。

## admin-guild-recommendation.html / 字段
AN-cc55ad18b821 | 字段 | 规则 |
AN-ea4b861ccd6b | --- | --- |
AN-da635faf0f91 | 公会信息 | 仅有效公会；同一公会只能配置一次。 |
AN-83ba69540055 | 排序权重 | 正整数，数值越大越靠前。 |
AN-42595e391a4b | 更新时间 | 最近保存时间。 |

## admin-guild-recommendation.html / 业务
AN-0167f49fbb31 1. 移除推荐不改变公会状态。

## admin-guild-recommendation.html / 交互
AN-dbfdf3e244e8 1. 新增或编辑 -> 详情；移除 -> 确认后退出推荐。

## admin-guild-recommendation-detail.html / 场景
AN-751bb85407eb 平台管理员选择公会并设置推荐权重。

## admin-guild-recommendation-detail.html / 字段
AN-7eb803c669c0 | 字段 | 规则 |
AN-d5c418cbb0ad | --- | --- |
AN-09261b9e9b3e | 推荐公会 | 必选有效且未配置的公会；编辑时不可重复。 |
AN-4ed91ca604f2 | 排序权重 | 必填正整数；相同权重按最近更新时间倒序。 |

## admin-guild-recommendation-detail.html / 交互
AN-4318fb367b13 1. 保存 -> 校验公会有效性和重复配置 -> 更新推荐列表。

## admin-level-config.html / 字段与数据归属
AN-a4ab172dd0aa | Tab | 统计对象 | 配置字段 |
AN-65ae3baa5afa | --- | --- | --- |
AN-8e6f9fc85433 | 主播等级 | 单个主播累计获得的收益。 | 等级、收益数值（金币）、勋章图。 |
AN-7aa75c15244f | 财富等级 | 单个用户向所有主播累计送礼的贡献。 | 等级、送礼贡献（金币）、勋章图。 |
AN-8f02df5e328a | 粉丝等级 | 单个用户对单个主播的送礼贡献，不同主播分别计算。 | 等级、对主播送礼贡献（金币）、勋章图。 |
AN-a0a2a8f0c599 | 粉丝团等级 | 单个粉丝团累计收礼。 | 等级、粉丝团累计收礼（金币）、勋章图。 |

## admin-level-config.html / 业务规则
AN-dbf70d618387 1. 四类等级独立配置、独立计算；同一账号可同时具有主播等级、财富等级及面向不同主播的粉丝等级。粉丝团等级属于粉丝团，不等同于成员的粉丝等级。
AN-963d3a7905f6 2. 四类等级默认均为 1 级，1 级门槛固定为 0；每行配置一个等级对应的金币门槛及勋章图，此处配置不直接增加收益、送礼贡献或钱包金币。
AN-1723ae964535 3. 已有粉丝团规则：用户退出或被移出后，粉丝等级与亲密度清零；主播的粉丝团解散后，成员团籍和群聊权限解除。粉丝等级统计需遵循该重置规则，不能直接用永久历史送礼总额恢复。
AN-afd4b575e717 4. 主播等级的收益按分成前金币收益计入。
AN-0d7928a446b6 5. 退款只影响财富等级，不影响主播等级、粉丝等级和粉丝团等级。
AN-eeaef6186bdb 6. 已有门槛修改并保存后，立即按新配置重算对应类型的已有等级；等级编号由系统生成，不提供手动修改。
AN-83f5cdecd8c1 7. 填写的金币数值为达到该等级所需的累计门槛；累计值大于或等于门槛即达标，同时满足多档时取最高等级，允许一次跨越多级。
AN-1cccc63361fa 8. 运营账号的虚拟金币不计入主播等级收益、财富等级送礼贡献、粉丝等级对主播送礼贡献或粉丝团等级累计收礼。

## admin-level-config.html / 配置校验与操作
AN-0a7a28dddf6f 1. 等级为从 1 开始连续递增的固定数字，不可编辑；四个 Tab 各自独立编号。1 级金币数值固定为 0 且不可修改；2 级及以上必填，并且必须大于上一级，否则禁止保存并定位到错误等级。
AN-ebfd666ada12 2. 每次新增等级，当前 Tab 的等级编号自动加 1，金币数值留空待填写；当前页不提供删除入口。
AN-c6c9b616b8ca 3. 切换 Tab 保留各自未保存的输入和图片。保存只校验并提交当前 Tab；无效数值或缺少勋章图均阻止保存，成功后留在当前 Tab。

## admin-level-config.html / 勋章图
AN-0a1b91ebcd94 1. 每个等级单独上传或更换图片，选择可读取的图片后显示预览；预览不改变图片比例。勋章图必填，缺少图片时提示对应等级并阻止保存。
AN-6e67304db3ba 2. 取消选择保留原图片；非图片或损坏图片提示重新选择，保留原有有效图片。上传及更换仅影响对应 Tab 的对应等级。
AN-f205606825f1 3. 勋章图在客户端的展示位置、是否随等级自动替换及是否允许手动佩戴，需与装扮规则确认后实施。

## admin-level-config.html / 保存边界（待确认）
AN-e4e4872e0998 1. 建议保存整组配置时全部成功或全部失败；失败保留输入供重试，重复提交不新增重复档位；多人同时编辑时提示配置已变更，避免覆盖他人修改。原型尚未模拟服务端保存失败或并发编辑。

## admin-level-config.html / 其他待确认边界
AN-3839cfde3299 1. 普通、定制、幸运礼物的计入范围；粉丝团收礼的归属条件；金币小数精度与数值上限。
AN-4c265a228f16 2. 退款对财富等级的进度扣减与降级方式；冲正或撤销对各类等级的影响；统计数据延迟时何时更新等级。
AN-10e4cbde5c33 3. 勋章图修改后的客户端刷新时机；重算后历史记录使用旧等级还是新等级。
AN-d8d7a1c44fc2 4. 勋章图允许的格式、大小和尺寸；无可用图片时的客户端展示方式。

## admin-level-config.html / 原型范围
AN-b8869b7759ac 编辑、图片预览和保存反馈仅在当前页面模拟；刷新后恢复 Mock 数据，不实际上传、持久化或触发用户等级变化。以上待确认方案未作为正式计算逻辑实现。

## admin-live-type.html / 场景
AN-f06a6f5a28be 平台管理员维护主播开播时可选的直播类型。

## admin-live-type.html / 字段
AN-96ced13a70ef | 字段 | 规则 |
AN-e7d17ed0e3f2 | --- | --- |
AN-7b50a6d20f06 | 类型 ID | 系统生成，全局唯一。 |
AN-29ca41efda76 | 四语名称 | 全部必填，同语言不可重复。 |
AN-424972ac3250 | 状态 | 启用、停用；停用后不可用于新开播。 |

## admin-live-type.html / 业务
AN-b83508a1bd00 1. 停用或删除不改变进行中和历史场次的类型快照。

## admin-live-type.html / 交互
AN-bdeedc515586 1. 新建或编辑 -> 保存四语和状态；删除 -> 无新场次引用后确认。

## admin-feature-switch.html / 场景
AN-9a356d7f7579 平台管理员查看和控制门票房、密码房等直播房型的开放状态。

## admin-feature-switch.html / 字段
AN-56dba70b4d08 | 字段 | 规则 |
AN-a13ba2c39386 | --- | --- |
AN-e5235792584c | 房型名称 | 系统预置，不可新增或编辑。 |
AN-15ba1a47a9c6 | 当前状态 | 通过列表开关控制。 |
AN-e0a594eeecc5 | 操作信息 | 最后操作人和修改时间。 |

## admin-feature-switch.html / 业务
AN-8ab98394e770 1. 关闭房型后主播不可新建对应场次，不改变已开始或历史场次。

## admin-feature-switch.html / 交互
AN-c85d56425c5d 1. 切换开关 -> 立即更新房型状态；门票房价格配置 -> 进入价格档位列表。

## admin-ticket-price-level.html / 场景
AN-cb4f89caec70 平台管理员维护付费直播间可选门票价格。

## admin-ticket-price-level.html / 字段
AN-ebdf08f3d087 | 字段 | 规则 |
AN-659ec7184b24 | --- | --- |
AN-e3ceb0d6c66a | 档位 ID | 系统生成，全局唯一。 |
AN-558ac84b7d8f | 门票价格 | 正整数金币且不得重复。 |
AN-9d5ba2d0b0a2 | 状态 | 至少保留一个启用档位。 |
AN-a04565c0147e | 排序 | 正整数，数值越小越靠前。 |

## admin-ticket-price-level.html / 业务
AN-b121bb4291db 1. 停用后不可用于新场次，已开播场次沿用创建时价格；门票收益按实际支付金币 1:1 计入。

## admin-ticket-price-level.html / 交互
AN-fd0636fd21b5 1. 停用最后一个有效档位 -> 阻止并提示；编辑 -> 详情。

## admin-ticket-price-level-detail.html / 场景
AN-b8838b8778c3 平台管理员新增或编辑门票价格档位。

## admin-ticket-price-level-detail.html / 字段
AN-0ec60ce9ba2e | 字段 | 规则 |
AN-99194ac989b3 | --- | --- |
AN-f4bfcefc6736 | 档位 ID | 新建系统生成，编辑只读。 |
AN-b4610f3d6199 | 门票价格 | 必填正整数金币，全局不重复。 |
AN-180344565716 | 排序 | 必填正整数。 |
AN-5f9b7731a331 | 启用状态 | 停用时须保证仍有其他启用档位。 |

## admin-ticket-price-level-detail.html / 交互
AN-5bffda7759e8 1. 保存 -> 校验价格唯一、排序和至少一个启用档位 -> 更新。

## admin-sensitive-words.html / 场景
AN-f39d442ff03b 平台管理员查询、导入和维护敏感词。

## admin-sensitive-words.html / 字段
AN-fe1c7b87ab86 | 字段 | 规则 |
AN-0874c7092ffc | --- | --- |
AN-f287cab2b09f | 敏感词 / 分类 | 词条内容和违法违规、辱骂攻击、广告引流等分类。 |
AN-4ecc57e5f628 | 使用场景 | 公屏、私信、昵称、动态，可多选。 |
AN-b32cb4cba724 | 匹配规则 | 包含匹配或精确匹配。 |
AN-2ac1a5b93b02 | 替换内容 | 命中后用于替换展示。 |
AN-c867a2468dcf | 状态 | 启用、停用；停用后不拦截新内容。 |

## admin-sensitive-words.html / 业务
AN-975deaaa1a98 1. 删除不影响历史命中和处置记录。

## admin-sensitive-words.html / 交互
AN-c51f7f53e149 1. 导入 -> 校验必填和重复词；启停或删除 -> 更新后续审核规则。

## admin-sensitive-words-detail.html / 场景
AN-0a3f5ebc8005 平台管理员新增或编辑敏感词规则。

## admin-sensitive-words-detail.html / 字段
AN-4095c0a3974f | 字段 | 规则 |
AN-6bc678510269 | --- | --- |
AN-0b1d0833b57a | 词条 ID | 新建系统生成，编辑只读。 |
AN-7babf9b526c5 | 敏感词 / 分类 | 必填；同匹配规则下词条不可重复。 |
AN-96a4a78f4cb2 | 匹配规则 | 包含匹配或精确匹配。 |
AN-d56ac645b7b6 | 使用场景 | 至少选择 1 个。 |
AN-97bebb99a3af | 替换内容 | 必填。 |
AN-dba11688f892 | 启用状态 | 启用后用于新内容检测。 |

## admin-sensitive-words-detail.html / 交互
AN-53083e0652dd 1. 保存 -> 校验重复词、场景和替换内容 -> 更新规则。

## admin-recharge-order.html / 场景
AN-8c1ded33f6b8 平台管理员查询和导出充值订单，并进入详情核对到账或退款。

## admin-recharge-order.html / 字段
AN-678ba38213fa | 字段 | 规则 |
AN-44bdec8b1ddc | --- | --- |
AN-b7da15e69a35 | 订单号 / 渠道交易号 | 平台订单号全局唯一；渠道号用于渠道对账。 |
AN-d3af9f6cb1f3 | 充值金额 | 支付成功订单实付 USD 金额。 |
AN-c74739b50a43 | 基础 / 赠送金币 | 套餐购买金币 / 活动赠送金币。 |
AN-03ec96c4ccfb | 到账金币 | 基础金币 + 赠送金币。 |
AN-988cb08842bd | 状态 | 充值成功、已退款；失败订单不发金币。 |
AN-6b5280f21756 | 成功时间 | 支付成功并完成金币入账的时间。 |

## admin-recharge-order.html / 业务
AN-576d81767b3b 1. 只有充值订单支持管理员主动退款或支付渠道退款；礼物和门票消费不退款。

## admin-recharge-order.html / 交互
AN-4cd5aa994355 1. 查询 -> 条件取交集；导出 -> 当前结果；详情 -> 核对支付、到账和退款。

## admin-recharge-order-detail.html / 场景
AN-10b46255d7f4 平台管理员核对单笔充值的用户、套餐、支付、到账和退款信息。

## admin-recharge-order-detail.html / 字段
AN-543049d6ccbb | 字段 | 规则 |
AN-df5c635c0a18 | --- | --- |
AN-210cb2e02260 | 订单 / 渠道信息 | 订单号、渠道交易号、支付渠道和时间只读。 |
AN-cbb5baa2f83f | 订单金额 / 实付金额 | 套餐标价 / 渠道实际支付金额，USD。 |
AN-91bca9d42db5 | 总到账金币 | 充值金币 + 赠送金币。 |
AN-e56bdad9947a | 退款金额 | 仅整单全额退款，等于原实付金额。 |
AN-93f76f0ad537 | 扣回金币 | 原订单充值金币 + 赠送金币。 |
AN-86980025c678 | 退款记录 | 退款单号、主动或被动类型、渠道、原因、操作人和时间。 |

## admin-recharge-order-detail.html / 业务
AN-679d7d23cdfd 1. 仅支付成功且未退款的订单可退，不支持部分或重复退款。
AN-1da45b03e224 2. 退款后余额 = 退款前余额 - 原订单总到账金币，可为负；后续充值余额 = 原余额 + 新到账金币。
AN-a9b30af0c12d 3. 退款不撤销已完成礼物或门票消费，不回滚主播收益和分成。

## admin-recharge-order-detail.html / 交互
AN-831537ac6a78 1. 手动退款 -> 填写原因并确认 -> 原渠道全额退款、扣回金币并生成退款单。

## admin-consumption-order.html / 场景
AN-b5bbecd73bbd 平台管理员查询和导出礼物、门票金币消费订单。

## admin-consumption-order.html / 字段
AN-c90864c77b0f | 字段 | 规则 |
AN-a1b5fc35d574 | --- | --- |
AN-3217b23c8796 | 消费类型 | 普通礼物、定制礼物、幸运礼物、门票。 |
AN-6fab1b13c4b0 | 数量 | 成功购买或赠送份数；连送逐个计数。 |
AN-d741211f9265 | 消费金币 | 订单扣减金币 = 商品单价 × 数量；幸运礼物返奖另记收入流水。 |
AN-d6df5d677ff3 | 用户净消耗 | 幸运礼物 = 订单扣减金币 - 实际返奖；其他类型 = 订单扣减金币。 |
AN-4f3d8c5b6c2a | 状态 | 已支付；消费订单不产生退款状态。 |
AN-37099829d8e3 | 主播信息 | 礼物接收或门票所属主播。 |

## admin-consumption-order.html / 业务
AN-e53313ea7e81 1. 消费成功只扣减一次；余额不足或条件失败不生成成功订单。
AN-266cee9dadd0 2. 消费订单不支持退款，充值退款也不撤销已完成消费。

## admin-consumption-order.html / 交互
AN-ce659351527c 1. 查询 -> 条件取交集；导出 -> 当前结果；详情 -> 进入只读订单。

## admin-consumption-order-detail.html / 场景
AN-b05ddf264396 平台管理员只读核对单笔消费、直播场次和主播收益归属。

## admin-consumption-order-detail.html / 字段
AN-27e5dd578213 | 字段 | 规则 |
AN-8976c07279c2 | --- | --- |
AN-afbd48fd5bfc | 商品 / 数量 / 单价 | 取消费发生时商品快照。 |
AN-d14a85eac016 | 扣减金币 | 单价 × 数量。 |
AN-457175d645e7 | 幸运礼物返奖 | 每次独立开奖的实际返还金币合计，另记用户收入。 |
AN-a38b46603ddb | 用户净消耗 | 扣减金币 - 返奖金币。 |
AN-5d1e903c1a04 | 主播收益 | 普通、定制、门票 = 扣减金币；幸运礼物 = 礼物价值 × 配置比例，默认 1%，返奖不影响。 |
AN-7f6692f035e6 | 消费去向 | 主播、公会和直播场次 ID。 |

## admin-consumption-order-detail.html / 业务
AN-b84f8d82e107 1. 消费订单只读且不可退款；仅充值订单可退款。

## admin-consumption-order-detail.html / 交互
AN-f285ef590733 1. 页面只读返回或查看关联对象；不得执行消费退款。

## admin-refund-order.html / 场景
AN-d0ecfd3edc68 平台管理员查询和导出充值主动退款及支付渠道退款记录。

## admin-refund-order.html / 字段
AN-e40f262ebf42 | 字段 | 规则 |
AN-e444497e7e6b | --- | --- |
AN-62836edf6da4 | 退款单号 | 退款完成时生成，全局唯一。 |
AN-e0bf2e3a0258 | 原充值订单 | 必须关联支付成功且未退款的充值订单。 |
AN-f4943849a374 | 类型 | 手动退款或被动退款；被动退款指支付渠道发起的退款。 |
AN-4e9a9c921bbb | 退款金额 | 原充值订单实付金额，全额退款。 |
AN-43880ced24a8 | 状态 / 时间 | 仅记录已完成结果及完成时间。 |

## admin-refund-order.html / 业务
AN-95414cabea77 1. 扣回金币 = 原订单基础金币 + 赠送金币；余额不足可为负，后续充值先抵扣。
AN-652a42149117 2. 已完成消费、主播收益和分成不回滚。

## admin-refund-order.html / 交互
AN-47669c5ed58d 1. 查询 -> 条件取交集；导出 -> 当前结果；查看 -> 进入原充值订单详情。

## admin-settlement-record.html / 场景
AN-b48ad676a92f 平台管理员上传和查询财务线下核算的主播分成结果。

## admin-settlement-record.html / 字段
AN-b6bc390231bd | 字段 | 规则 |
AN-8d524c5d059b | --- | --- |
AN-a40f1eee4c0c | 分成备注 | 必填，最长 100 字。 |
AN-8aa003500723 | 主播人数 | 导入文件中有效且去重的主播明细行数。 |
AN-afcfaa8cc8c2 | 分成总金额 | Σ 主播分成明细金额，USD。 |
AN-8c223418d610 | 上传文件 | XLSX、XLS 或 CSV，字段按模板校验。 |
AN-f9da3e47d765 | 上传人 / 时间 | 当前后台账号和确认导入时间，系统记录。 |

## admin-settlement-record.html / 业务
AN-3e9d59aab118 1. 系统不计算具体分成，不提供线上申请或审批；财务线下核算后上传。
AN-4270e933caef 2. 导入成功后记录锁定，不可编辑或删除。

## admin-settlement-record.html / 交互
AN-c08a64dbc639 1. 上传 -> 解析并预览人数、总额和明细 -> 确认导入 -> 生成锁定记录。

## admin-settlement-record-detail.html / 场景
AN-72c84a497fb3 平台管理员只读核对一批主播分成上传结果。

## admin-settlement-record-detail.html / 字段
AN-c13e0845d1f9 | 字段 | 规则 |
AN-de1c8b4805aa | --- | --- |
AN-5ceb8a866ec8 | 批次信息 | 备注、记录 ID、上传人和上传时间取导入快照。 |
AN-ea9e19e6c185 | 主播人数 | 去重主播明细数。 |
AN-7f06b2ad723e | 主播明细 | 主播、所属公会和分成金额。 |
AN-14d8fe1ecad4 | 分成总金额 | Σ 全部主播明细金额，必须与批次总额一致。 |

## admin-settlement-record-detail.html / 业务
AN-6af6c8aad4de 1. 详情是线下核算结果快照，只读且不承担审批。

## admin-host-account-balance.html / 场景
AN-37ac7e2371e0 平台管理员查询主播线下结算账户及筛选范围汇总。

## admin-host-account-balance.html / 字段
AN-6fa78826f0aa | 字段 | 规则 |
AN-b97827de32fe | --- | --- |
AN-41a411101f1a | 账户余额 | 已上传分成入账 + 正向修正 - 负向修正，USD。 |
AN-acf7c1ee989f | 汇总卡 | Σ 当前筛选结果的账户余额。 |

## admin-host-account-balance.html / 交互
AN-8059888d1e40 1. 查询 -> 更新列表和余额汇总；点击余额或变更记录 -> 进入该主播流水。

## admin-host-balance-change-record.html / 场景
AN-69cf37b6cf91 平台管理员查询并修正单个主播账户余额。

## admin-host-balance-change-record.html / 字段
AN-38a7f2f7432f | 字段 | 规则 |
AN-9ce65e8bd395 | --- | --- |
AN-4998bddebd22 | 变更类型 | 收益分成、分成修正。 |
AN-2e0d03568fbd | 变更金额 | 正数增加、负数扣减；不得为 0，最多两位小数。 |
AN-3dc4adbdbbfc | 变更后余额 | 变更前余额 + 有符号变更金额。 |
AN-bb87bd8f2602 | 备注 | 分成修正必填，最长 100 字。 |
AN-c6dc294347cc | 操作信息 | 记录编号、操作人和时间系统生成。 |

## admin-host-balance-change-record.html / 业务
AN-b72cffdca535 1. 负向修正绝对值不得超过当前余额，账户余额不得因手工修正为负。

## admin-host-balance-change-record.html / 交互
AN-803cea94901c 1. 余额变更 -> 输入金额和原因 -> 校验 -> 生成不可修改的修正流水并更新余额。

## admin-guild-settlement-record.html / 场景
AN-ce9c62c533b8 平台管理员上传和查询财务线下核算的公会分成结果。

## admin-guild-settlement-record.html / 字段
AN-bca7869111ff | 字段 | 规则 |
AN-334004d9eefa | --- | --- |
AN-46f71b446b41 | 分成备注 | 必填，最长 100 字。 |
AN-97eb067c8f58 | 公会数量 | 导入文件中有效且去重的公会明细数。 |
AN-b36fa161c4f7 | 分成总金额 | Σ 公会分成明细金额，USD。 |
AN-aed5bd5d21e8 | 上传文件 | XLSX、XLS 或 CSV，按模板校验。 |
AN-b9bb792a1812 | 上传人 / 时间 | 当前后台账号和确认导入时间。 |

## admin-guild-settlement-record.html / 业务
AN-4a6e0d67b7b0 1. 结果由财务线下核算；导入成功后锁定且不可编辑或删除。
AN-7263975aa94b 2. 公会解散前须完成名下主播收益结算。

## admin-guild-settlement-record.html / 交互
AN-e61ff938c8d8 1. 上传 -> 预览公会数、总额和明细 -> 确认 -> 生成锁定记录。

## admin-guild-settlement-record-detail.html / 场景
AN-7ac9dfb99c44 平台管理员只读核对一批公会分成上传结果。

## admin-guild-settlement-record-detail.html / 字段
AN-e2a86c187d5e | 字段 | 规则 |
AN-e68e68f6492a | --- | --- |
AN-e3a3f499ae01 | 批次信息 | 备注、记录 ID、上传人和上传时间取导入快照。 |
AN-258b90b7f3eb | 公会数量 | 去重公会明细数。 |
AN-5b61195fbb1e | 公会明细 | 公会名称、ID 和分成金额。 |
AN-876d903a0ad8 | 分成总金额 | Σ 全部公会明细金额，必须等于批次总额。 |

## admin-guild-settlement-record-detail.html / 业务
AN-36f569cef54e 1. 详情只读，不承担线上审批。

## admin-guild-account-balance.html / 场景
AN-19306eb70748 平台管理员查询公会线下结算账户及筛选范围汇总。

## admin-guild-account-balance.html / 字段
AN-7ff9d6d38ce8 | 字段 | 规则 |
AN-8f1fd544dfe7 | --- | --- |
AN-da196561cd67 | 账户余额 | 已上传分成入账 + 正向修正 - 负向修正，USD。 |
AN-fdc39c7cba6b | 汇总卡 | Σ 当前筛选结果的账户余额。 |

## admin-guild-account-balance.html / 交互
AN-6fed3cb3ee0a 1. 查询 -> 更新列表和汇总；点击行或余额 -> 进入公会变更流水。

## admin-guild-balance-change-record.html / 场景
AN-566d8e3d3e68 平台管理员查询并修正单个公会账户余额。

## admin-guild-balance-change-record.html / 字段
AN-ad1e2ab1f559 | 字段 | 规则 |
AN-766771d47169 | --- | --- |
AN-f0522e98c6bc | 变更类型 | 收益分成、分成修正。 |
AN-8fb8ac11205c | 变更金额 | 正数增加、负数扣减；不得为 0，最多两位小数。 |
AN-33ab3bc4420a | 变更后余额 | 变更前余额 + 有符号变更金额。 |
AN-bc41672dc600 | 备注 | 分成修正必填。 |
AN-fe2e750e481b | 操作信息 | 记录编号、操作人和时间系统生成。 |

## admin-guild-balance-change-record.html / 业务
AN-841c039e82c5 1. 负向修正不得超过当前余额。

## admin-guild-balance-change-record.html / 交互
AN-78152dd2e03c 1. 余额变更 -> 输入金额和原因 -> 校验 -> 生成不可修改流水并更新余额。

## admin-report-center.html / 场景
AN-4da86069c2b9 平台管理员从统一入口进入基础数据和财务对账报表。

## admin-report-center.html / 字段
AN-931c56ff6a7a | 字段 | 规则 |
AN-809beaaa32ba | --- | --- |
AN-d43f210eb3e5 | 基础数据 | 每日统计、用户活跃、主播活跃、直播互动、充值消费和充值用户分层。 |
AN-3da345585bcf | 财务对账 | 月度汇总、直播记录、主播业绩、礼物及订单明细。 |

## admin-report-center.html / 业务
AN-e6a36b50549b 1. 仅展示当前角色有权查看的入口；报表权限同时控制查询和导出。
AN-6f04b3d6c148 2. 报表提供数据口径，不在系统内计算具体分成或执行结算审批。

## admin-report-center.html / 交互
AN-f09667c13d9c 1. 点击入口 -> 进入对应报表。

## admin-data-overview.html / 场景
AN-ae5352a6eca7 平台管理员按日期范围查看核心指标汇总和每日趋势。

## admin-data-overview.html / 字段
AN-397e25c3affc | 指标 | 计算方式 |
AN-d78c1bf8caa2 | --- | --- |
AN-a04335a791bb | 活跃 / 新增用户 | 范围内各日打开 App（启动或从后台切回前台）的去重登录用户数之和 / 注册去重人数之和。 |
AN-d084cdde9f26 | 总充值金额 / 人数 | 支付成功实付金额合计 / 各日充值去重人数之和。 |
AN-d04ee38dce55 | 新用户充值金额 | 注册当日支付成功的新用户充值金额合计。 |
AN-e3c9ca69a14e | 新用户 ARPU | 新用户充值金额合计 / 新用户充值人数合计；分母为 0 时记 0。 |
AN-b4984566f9a3 | 达成有效天主播 | 各日累计有效直播不少于 3 小时的主播人次，每主播每天最多 1 次。 |

## admin-data-overview.html / 业务
AN-6108f46556e1 1. 指标卡按日期范围汇总，趋势逐自然日展示；起止同日为单日。

## admin-data-overview.html / 交互
AN-97a82ae58251 1. 点击指标卡 -> 切换趋势；查询 -> 校验结束日期不早于开始日期后取数。

## admin-daily-statistics.html / 场景
AN-97fe8561d194 平台管理员查看每日用户、充值、直播和退款指标。

## admin-daily-statistics.html / 字段
AN-b0f84cd00e3b | 指标 | 计算方式 |
AN-9ce03796d480 | --- | --- |
AN-33d39d0d3eb0 | 活跃 / 新增用户 | 当日打开 App（启动或从后台切回前台）的去重登录用户数 / 注册的去重用户数。 |
AN-74fae530899b | 总充值金额 / 人数 | 当日支付成功实付金额合计 / 去重充值用户数。 |
AN-f27922936aab | 新用户充值人数 / 金额 | 当日注册且充值成功的去重人数 / 实付金额合计。 |
AN-45f006c54300 | 新用户 ARPU | 新用户充值金额 / 新用户充值人数；分母为 0 时记 0。 |
AN-4884a4cc4587 | 开播人数 | 当日成功开播的去重主播数。 |
AN-261982bf16c6 | 达成有效天主播 | 当日累计有效直播不少于 3 小时的去重主播数。 |
AN-79e9e7aa016e | 开播时长中位数 | 有效场次时长升序中位值；偶数取中间两项平均，无数据记 0。 |
AN-8d4662b95bdc | 退款订单数 / 金额 | 当日完成的充值退款单数 / 退款金额合计。 |

## admin-daily-statistics.html / 业务
AN-ec069906d9f3 1. 日期按平台统一自然日；主动退款和支付渠道退款均按完成日统计。

## admin-daily-statistics.html / 交互
AN-d917f244e0a7 1. 查询 -> 日期首尾均包含；导出 -> 当前筛选结果。

## admin-user-active-statistics.html / 场景
AN-0a55b131e6fc 平台管理员查看每日登录用户的新老分层和付费规模。

## admin-user-active-statistics.html / 字段
AN-a04a2bf246db | 指标 | 计算方式 |
AN-ee31e69080de | --- | --- |
AN-9b5a6bc15a55 | 登录用户 | 当日至少成功登录 1 次的去重用户。 |
AN-00f27a067d07 | 新用户 | 登录用户中当日注册的去重用户。 |
AN-a6cd23799c68 | 老用户 | 登录用户中统计日前已注册的去重用户；登录用户 = 新用户 + 老用户。 |
AN-5333baa65dd9 | 付费用户 | 当日至少 1 笔支付成功充值订单的去重用户。 |
AN-7d9e1dda531b | 汇总卡 | 各日指标求和，不做跨日再次去重。 |

## admin-user-active-statistics.html / 交互
AN-91cb36980718 1. 查询 -> 按自然日范围过滤；导出 -> 当前结果。

## admin-host-statistics.html / 场景
AN-62fbc1b86581 平台管理员查看每日主播认证、开播、有效天、连麦和违规数据。

## admin-host-statistics.html / 字段
AN-803b05b6a945 | 指标 | 计算方式 |
AN-cfc02d9a7d65 | --- | --- |
AN-fc00986283b9 | 新增主播 | 当日平台认证通过的去重主播数。 |
AN-799d5e121fe7 | 开播人数 / 场次 | 成功开播的去重主播数 / 新建场次数。 |
AN-b4c7f0faabfd | 开播率 | 开播人数 / 当日有效主播总数 × 100%；分母为 0 时记 0。 |
AN-392ac065bfa7 | 有效天达标人数 | 当日累计有效直播不少于 3 小时的去重主播数。 |
AN-d109fa3a896b | 开播时长中位数 | 有效场次时长中位值；偶数取中间两项平均。 |
AN-f244b5a0cf40 | 连麦场次 | 至少发生 1 次有效连麦的去重场次数。 |
AN-9df8f8bb92f8 | 违规主播 / 场次 | 确认违规的去重主播数 / 去重场次数。 |

## admin-host-statistics.html / 交互
AN-db821f5fad40 1. 查询 -> 更新每日明细和汇总；导出 -> 当前结果。

## admin-live-statistics.html / 场景
AN-f77797030589 平台管理员查看每日直播间观看和访问数据。

## admin-live-statistics.html / 字段
AN-3d853ad7da5e | 指标 | 计算方式 |
AN-e8f1b7e97611 | --- | --- |
AN-245c4f587c03 | 观众人数 | 当日成功进入直播间的去重真实用户数。 |
AN-b1025c60ca4f | 观看时长 | 有效观看秒数合计 / 60，四舍五入到分钟。 |
AN-315c0682abfd | 人均观看时长 | 有效观看秒数 / 观众人数 / 60，四舍五入到分钟；分母为 0 时记 0。 |
AN-f10485c3a741 | 直播间访问率 | 观众人数 / 直播间访问次数 × 100%，保留 1 位小数；分母为 0 时记 0。 |

## admin-live-statistics.html / 交互
AN-b15efa447d28 1. 查询 -> 按自然日过滤；导出 -> 当前结果。

## admin-host-live-record-report.html / 场景
AN-553b2d243199 平台管理员按开播时间和主播查询直播场次明细。

## admin-host-live-record-report.html / 字段
AN-818e6510a0a0 | 字段 | 规则 |
AN-84cca9558053 | --- | --- |
AN-d06c5beeb23b | 主播 / 直播间 ID | 主播 ID 唯一；直播间 ID 长期归属主播。 |
AN-b0c17f0e34e3 | 房型 | 本场创建时快照。 |
AN-c5391aa0ea8c | 时长 | 结束时间 - 开播时间。 |
AN-0be533b2d3cd | 是否达标 | 主播该自然日累计有效直播不少于 3 小时，不按单场判断。 |
AN-a2c0b6f682ec | 观众人数 | 本场成功进入的去重真实用户数。 |
AN-d9b38b19bead | 消费金币 | 本场普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 返奖；虚拟金币不计。 |

## admin-host-live-record-report.html / 业务
AN-190da88ccb6f 1. 每次开播一条场次；结束后保留消费、处置和收益。

## admin-host-live-record-report.html / 交互
AN-0537c602707b 1. 查询 -> 以开播日期和主播 ID 过滤；导出 -> 当前结果。

## admin-recharge-statistics.html / 场景
AN-9d71b246d6ed 平台管理员查看每日充值、金币发行和消费汇总。

## admin-recharge-statistics.html / 字段
AN-dd7986818066 | 指标 | 计算方式 |
AN-6e1c6c3c7ebd | --- | --- |
AN-9f7b023d35fa | 总充值金额 / 人数 / 订单 | 支付成功实付金额合计 / 去重用户数 / 订单数。 |
AN-15cb5a79a12d | 客单价 | 总充值金额 / 充值人数；分母为 0 时记 0。 |
AN-6635b682e853 | 充值金币 | 支付成功订单基础金币合计。 |
AN-2017a07be0d2 | 充值赠送 / 系统赠送金币 | 套餐赠送 / 签到、任务、活动等发放合计。 |
AN-5d8e88cb64f6 | 消费金币 | 普通、定制、门票扣减金币 + 幸运礼物扣减金币 - 返奖。 |
AN-99cf78079ee4 | 金币净增量 | 充值金币 + 充值赠送金币 + 系统赠送金币 - 消费金币。 |

## admin-recharge-statistics.html / 业务
AN-2fed4d5a53e5 1. 退款扣回金币按退款资产流水单列，不并入消费金币。

## admin-recharge-statistics.html / 交互
AN-0ffddd5044ce 1. 查询 -> 更新明细和汇总；导出 -> 当前结果。

## admin-user-activity-statistics.html / 场景
AN-af7e85757027 平台管理员查看每日新老用户充值分层。

## admin-user-activity-statistics.html / 字段
AN-3c246490f6e1 | 指标 | 计算方式 |
AN-8b23ca869e50 | --- | --- |
AN-753e54fd0fb7 | 总充值金额 | 新用户充值金额 + 老用户充值金额。 |
AN-02a9514d571a | 总充值人数 | 新用户充值人数 + 老用户充值人数。 |
AN-8cad12c5c825 | 新 / 老用户 | 当日注册 / 统计日前注册且当日充值成功的去重用户。 |
AN-4bb799ae2034 | 新用户 ARPU | 新用户充值金额 / 新用户充值人数；分母为 0 时记 0。 |
AN-11369e7a99f2 | 老用户 ARPU | 老用户充值金额 / 老用户充值人数；分母为 0 时记 0。 |

## admin-user-activity-statistics.html / 交互
AN-595ef4016b9c 1. 查询 -> 按自然日过滤；导出 -> 当前结果。

## admin-monthly-income-expense.html / 场景
AN-cb6b4efe2cd4 平台管理员按自然月核对收益、累计充值和累计退款。

## admin-monthly-income-expense.html / 字段
AN-84dfd10d35fb | 指标 | 计算方式 |
AN-dfb1664bfc20 | --- | --- |
AN-af623001c8b6 | 收益 | 当月普通、定制、幸运礼物和门票形成的主播收益金币合计。 |
AN-b90e83253b13 | 累计充值 | 当月支付成功充值实付金额合计。 |
AN-965b63d85fdf | 累计退款 | 当月完成充值退款金额合计。 |

## admin-monthly-income-expense.html / 业务
AN-fc0499d1d010 1. 充值退款不撤销已完成消费和收益。

## admin-monthly-income-expense.html / 交互
AN-56ddf0e350da 1. 列表展示全部月份；导出 -> 当前结果。

## admin-monthly-host-share.html / 场景
AN-e33638acb66f 平台管理员按日期范围核对主播有效天、场次和各类收益。

## admin-monthly-host-share.html / 字段
AN-57d916e900ab | 指标 | 计算方式 |
AN-e9761029d6a3 | --- | --- |
AN-f07f4634cfb0 | 统计天数 | 结束日期 - 开始日期 + 1。 |
AN-74eeb36a2d0f | 达标天数 | 单日累计有效直播不少于 3 小时的自然日数，每日最多 1 天。 |
AN-603e66743612 | 直播场次 | 范围内成功开播场次数。 |
AN-db674833805e | 普通 / 定制 / 门票收益 | 对应成功真实金币消费合计。 |
AN-b00e2f1d6e16 | 幸运礼物收益 | Σ（礼物价值 × 当时配置比例），默认 1%。 |
AN-3382d902698c | 主播收益 | 普通 + 定制 + 幸运 + 门票收益。 |

## admin-monthly-host-share.html / 业务
AN-147971db7994 1. 虚拟金币、失败或撤销消费不计；报表不计算具体分成。

## admin-monthly-host-share.html / 交互
AN-7c90c8903c3f 1. 查询 -> 按日期、主播或公会聚合；导出 -> 当前结果。

## admin-monthly-host-earnings.html / 场景
AN-b936e582bb71 平台管理员按主播和礼物核对打赏数量及主播收益。

## admin-monthly-host-earnings.html / 字段
AN-a9d8d0d3e4ed | 指标 | 计算方式 |
AN-cddde73e6804 | --- | --- |
AN-17e81dc574b1 | 单价 / 份数 | 赠送时礼物单价快照 / 成功赠送数量合计。 |
AN-70749ba01266 | 普通 / 定制收益 | 单价 × 份数。 |
AN-655f4a2f6172 | 幸运礼物收益 | 单价 × 份数 × 赠送时配置比例，默认 1%；返奖不影响。 |
AN-8702029f98e5 | 虚拟金币记录 | 不进入本报表。 |

## admin-monthly-host-earnings.html / 交互
AN-c9d1de7a4dee 1. 查询 -> 按日期、主播、礼物和类型聚合；导出 -> 当前结果。

## admin-monthly-viewer-consumption.html / 场景
AN-d59992614b60 平台管理员按用户核对各类真实金币净消耗。

## admin-monthly-viewer-consumption.html / 字段
AN-3435c67b3f42 | 指标 | 计算方式 |
AN-f4cc5a63ab89 | --- | --- |
AN-e9f46c35f9f2 | 普通 / 定制 / 门票 | 成功订单扣减金币合计。 |
AN-7fc286877a53 | 幸运礼物 | 订单扣减金币 - 实际返奖金币。 |
AN-20614fe093bb | 累计消费 | 普通 + 定制 + 幸运礼物净消耗 + 门票。 |

## admin-monthly-viewer-consumption.html / 业务
AN-befae6fe62ab 1. 失败、撤销和虚拟金币不计；充值退款不回滚已完成消费。

## admin-monthly-viewer-consumption.html / 交互
AN-66f78390bf36 1. 查询 -> 按日期和用户聚合；导出 -> 当前结果。

## admin-monthly-gift-sales.html / 场景
AN-a4a19d0dc853 平台管理员按礼物核对成功赠送数量和礼物价值。

## admin-monthly-gift-sales.html / 字段
AN-67e7081b1cdb | 指标 | 计算方式 |
AN-12d063c56f87 | --- | --- |
AN-9f8dba19b969 | 单价 | 赠送时商品金币单价快照。 |
AN-c62c705f2545 | 销量 | 成功赠送份数合计。 |
AN-5b0173ae0cbe | 销售额 | Σ（单价 × 份数），表示礼物价值；幸运礼物不减返奖。 |

## admin-monthly-gift-sales.html / 业务
AN-81c63ac13a7f 1. 仅真实金币成功消费，虚拟金币送礼不计。

## admin-monthly-gift-sales.html / 交互
AN-dcd647308f8d 1. 查询 -> 按日期、礼物和类型聚合；导出 -> 当前结果。

## admin-consumption-order-detail-report.html / 场景
AN-67e8a4806a9f 平台管理员查询真实金币消费订单明细。

## admin-consumption-order-detail-report.html / 字段
AN-06aecdce339e | 字段 | 计算方式 |
AN-1f19cbf03cf3 | --- | --- |
AN-97023a0e1d31 | 礼物单价 / 份数 | 消费时单价快照 / 成功数量。 |
AN-cc27d653bdad | 消费金币 | 单价 × 份数；幸运礼物返奖另记。 |
AN-bcd74a831db0 | 主播收益 | 普通、定制、门票 = 消费金币；幸运礼物 = 礼物价值 × 配置比例。 |
AN-9b2080d282a8 | 场次 ID | 消费发生的直播场次。 |

## admin-consumption-order-detail-report.html / 业务
AN-a0d52c5b6611 1. 只统计成功真实金币消费；消费订单只读且不可退款。

## admin-consumption-order-detail-report.html / 交互
AN-06fce8fb3f55 1. 查询 -> 时间和关键字取交集；导出 -> 当前结果。

## admin-refund-order-detail-report.html / 场景
AN-cd45386dfbab 平台管理员查询已完成充值退款明细。

## admin-refund-order-detail-report.html / 字段
AN-45fc68908ee0 | 字段 | 规则 |
AN-500080f9db35 | --- | --- |
AN-78bbbbf6b16d | 退款时间 | 主动退款或支付渠道退款的完成时间。 |
AN-c93c891c38b2 | 退款用户 / 商品 | 原充值订单用户和套餐。 |
AN-ee6ee2e8b022 | 退款金额 | 原订单实付金额，全额退款，USD。 |

## admin-refund-order-detail-report.html / 业务
AN-ff9654486855 1. 仅充值退款，不包含礼物或门票消费退款。

## admin-refund-order-detail-report.html / 交互
AN-b17bce6cbb07 1. 查询 -> 时间和用户取交集；导出 -> 当前结果。

## admin-recharge-order-detail-report.html / 场景
AN-78fdcc91c091 平台管理员查询支付成功的充值订单明细。

## admin-recharge-order-detail-report.html / 字段
AN-08767d59f748 | 字段 | 规则 |
AN-fd18b12e9fda | --- | --- |
AN-150e04fe66e7 | 充值时间 | 支付成功时间。 |
AN-70b59a02caf6 | 充值用户 / 套餐 | 原订单用户和套餐快照。 |
AN-72fb0a7a3a9f | 支付渠道 | 实际完成支付的渠道。 |
AN-cbe984777a64 | 充值金额 | 实付金额，USD。 |

## admin-recharge-order-detail-report.html / 业务
AN-58bb427a3f6d 1. 仅支付成功订单；退款在退款报表单列。

## admin-recharge-order-detail-report.html / 交互
AN-daffd34488d3 1. 查询 -> 时间和用户取交集；导出 -> 当前结果。

## admin-operation-accounts.html / 场景
AN-febd48f9687e 平台管理员查询公会创建的运营账号，并执行平台允许的启停或权限锁定。

## admin-operation-accounts.html / 字段
AN-05e327a9a7ed | 字段 | 规则 |
AN-a5cd46249b25 | --- | --- |
AN-1d6a824a61d6 | 运营账号 / 公会 | 账号由所属公会创建，登录账号全局唯一。 |
AN-1c32754247df | 累计 / 本月消费 | 虚拟金币成功送礼消耗合计 / 当月合计。 |
AN-9313fce8965c | 账户余额 | 虚拟金币发放合计 - 虚拟金币消费合计。 |
AN-7c430b40fc76 | 本月发放 | 当月公会发放虚拟金币合计。 |
AN-19d0ad386778 | 状态 | 启用、停用；平台可启停并锁定公会管理权限。 |

## admin-operation-accounts.html / 业务
AN-8d65cb93879a 1. 运营账号没有真实金币，只有虚拟金币；虚拟金币只能由所属公会发放，不能通过充值或任务获得。平台不创建、不分配运营账号，也不发放虚拟金币。
AN-7861fb19ad1a 2. 虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；运营账号可以发送消息，但不能加入粉丝团。虚拟金币仅计入公屏氛围，不计入主播榜、贡献榜、主播收益或公会分成。

## admin-operation-accounts.html / 交互
AN-13b653f0ee7c 1. 查询 -> 条件取交集；详情 -> 查看账号、发放和送礼记录。

## admin-operation-account-detail.html / 场景
AN-3997280d3a19 平台管理员查看运营账号资料、虚拟金币发放和送礼记录。

## admin-operation-account-detail.html / 字段
AN-a48497ac4de0 | 字段 | 规则 |
AN-4e4460de344b | --- | --- |
AN-6bd378cb5500 | 账号资料 | 头像、名称、登录账号和所属公会，由公会维护。 |
AN-222517d645d1 | 虚拟金币余额 | Σ 发放金币 - Σ 成功消费金币。 |
AN-20f053e35003 | 发放记录 | 发放后余额 = 发放前余额 + 发放金币。 |
AN-0b967aa55afd | 送礼记录 | 消费金币 = 礼物单价 × 数量。 |

## admin-operation-account-detail.html / 业务
AN-cb3aa12de4f9 1. 运营账号没有真实金币；虚拟金币只能由所属公会发放，不能充值或通过任务获得。
AN-f289338a8c92 2. 账号可免票、免密码进入直播间；虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费；运营账号不能加入粉丝团。
AN-7d9b2f04d065 3. 平台当前只查看、启停或锁定；页面“编辑资料、重置密码”属于公会权限，平台不得执行。

## admin-operation-account-detail.html / 交互
AN-c5e65289ad83 1. 切换 Tab -> 加载记录；平台启停或锁定 -> 确认后留痕。

## admin-operation-issue-records.html / 场景
AN-1e92ca0f54f2 平台管理员只读查询公会向运营账号发放虚拟金币的记录。

## admin-operation-issue-records.html / 字段
AN-48db112e519e | 字段 | 计算方式 |
AN-caed5732647c | --- | --- |
AN-55166111c921 | 发放金币 | 本次公会发放的正整数虚拟金币。 |
AN-572fd8156c53 | 发放后余额 | 发放前余额 + 发放金币。 |
AN-0add7f513f72 | 操作人 | 实际执行发放的公会账号。 |
AN-b2d206c77302 | 发放时间 | 发放成功时间，计入对应自然月额度。 |

## admin-operation-issue-records.html / 业务
AN-bb3a7d99244e 1. 虚拟金币只能由所属公会发放，不能通过充值或任务获得；平台不执行发放。
AN-6d243b65b011 2. 运营账号没有真实金币，虚拟金币与真实金币隔离且不可转换。

## admin-operation-issue-records.html / 交互
AN-298fb1ad48b0 1. 查询 -> 公会、账号和时间取交集。

## admin-operation-gift-records.html / 场景
AN-40117a452b93 平台管理员只读查询运营账号虚拟金币送礼记录。

## admin-operation-gift-records.html / 字段
AN-48abb15c3e46 | 字段 | 计算方式 |
AN-a39271ab1226 | --- | --- |
AN-5c4eee0a2cf9 | 礼物 / 主播 | 赠送时普通或定制礼物及接收主播快照。 |
AN-0e99e1136911 | 消费金币 | 礼物单价 × 赠送数量，从虚拟金币账户扣减。 |
AN-4b41092cfbd5 | 赠送时间 | 成功扣减和送礼完成时间。 |

## admin-operation-gift-records.html / 业务
AN-2f4da6fcda81 1. 虚拟金币仅可用于赠送普通礼物和定制礼物，不能赠送幸运礼物，不能购买装扮、门票或用于其他消费。
AN-29d3d78e9e67 2. 虚拟送礼仅计入公屏氛围，不计入主播榜、贡献榜、真实消费、主播收益或分成；页面中的幸运礼物示例不符合当前规则。

## admin-operation-gift-records.html / 交互
AN-a21c23313d22 1. 查询 -> 公会、账号和时间取交集；详情 -> 查看完整快照。

## admin-operation-guild-controls.html / 场景
AN-7b49dc2e7491 平台管理员配置公会运营账号的月度虚拟金币额度。

## admin-operation-guild-controls.html / 字段
AN-4b0ae9a96b4b | 字段 | 计算方式 |
AN-f586a6fb5b6c | --- | --- |
AN-0a3ba705bb3c | 单账号月度额度 | 单个运营账号自然月累计可获虚拟金币上限。 |
AN-4c75295c7654 | 公会月度额度 | 公会全部运营账号自然月累计发放上限。 |
AN-5fc2e8936510 | 本月累计已发放 | Σ 本月该公会成功发放金币。 |
AN-4f8ebda90463 | 账户余额累计 | Σ 该公会全部运营账号当前虚拟金币余额。 |
AN-29275b3b3cc2 | 本月累计消费 | Σ 本月虚拟金币成功送礼消费。 |
AN-07540be996cf | 本月剩余额度 | max（公会月度额度 - 本月累计已发放，0）。 |

## admin-operation-guild-controls.html / 业务
AN-37a1c6914f6a 1. 额度只控制所属公会向运营账号发放的虚拟金币；运营账号不能通过充值或任务获得金币。
AN-07793818204a 2. 公会总上限不得低于本月已发放；单账号上限不得低于本月单账号最高已发放，且不得高于公会总上限。

## admin-operation-guild-controls.html / 交互
AN-9d7398048b79 1. 配置额度 -> 校验边界 -> 保存后限制公会后续发放。

## admin-system-account.html / 场景
AN-a90c6fedaf93 超级管理员查询、新建、编辑和启停后台账号。

## admin-system-account.html / 字段
AN-7b60dd0405ed | 字段 | 规则 |
AN-037c7d28fd6b | --- | --- |
AN-dc1c7874f520 | 账号 ID | 系统生成，全局唯一。 |
AN-aca1e95ddec7 | 后台账号 | 登录名全局唯一。 |
AN-3b0204311dcb | 姓名 / 角色 | 姓名必填；角色决定菜单权限。 |
AN-feefb279df6f | 状态 | 启用、停用；停用立即禁止登录。 |
AN-61867cb54d80 | 登录 / 更新时间 | 最近成功登录时间 / 最近资料或状态变更时间。 |

## admin-system-account.html / 业务
AN-49c3587c6263 1. 系统内置超级管理员账号不可停用。

## admin-system-account.html / 交互
AN-80f029d9dfb9 1. 启停 -> 填写原因并确认 -> 立即生效并留痕；编辑 -> 账号详情。

## admin-system-account-detail.html / 场景
AN-e2366ddad515 超级管理员新增或编辑后台账号及所属角色。

## admin-system-account-detail.html / 字段
AN-77939ca45705 | 字段 | 规则 |
AN-24316fcaaa3b | --- | --- |
AN-98cbc2163524 | 账号 ID | 新建系统生成，编辑只读。 |
AN-d5ef65c0c482 | 后台账号 / 姓名 | 均必填；登录账号全局唯一。 |
AN-a2237cc5e18d | 所属角色 | 必选启用角色，权限继承角色配置。 |
AN-bcea8c05e98f | 初始密码 | 新建必填，符合密码策略。 |
AN-cd3f25529381 | 新密码 / 确认 | 两次一致并符合策略，保存后立即生效。 |
AN-ee2222429d52 | 状态 | 启用、停用。 |

## admin-system-account-detail.html / 业务
AN-bb97802fc5de 1. 超级管理员内置账号的账号、角色和状态不可修改。

## admin-system-account-detail.html / 交互
AN-1ab52f008d71 1. 保存 -> 校验唯一性和角色 -> 更新；重置密码 -> 校验两次输入 -> 替换旧密码。

## admin-system-role.html / 场景
AN-f7c471d20c71 超级管理员查询、新建、编辑和启停后台角色。

## admin-system-role.html / 字段
AN-294730b88459 | 字段 | 规则 |
AN-c872a4b3108e | --- | --- |
AN-03c4a6814eff | 角色 ID | 系统生成，全局唯一。 |
AN-3e0adf4a4824 | 角色名称 | 全局不可重复。 |
AN-daa882ee4b68 | 关联账号 | 当前绑定该角色的后台账号数。 |
AN-ce3877a81108 | 状态 | 启用、停用；停用后关联账号立即失去该角色权限。 |

## admin-system-role.html / 业务
AN-74b4ebaab58d 1. 内置超级管理员角色拥有全部权限，不可修改或停用。

## admin-system-role.html / 交互
AN-f90e891d7656 1. 启停 -> 确认影响账号后执行；编辑 -> 角色详情。

## admin-system-role-detail.html / 场景
AN-27fe459aa917 超级管理员新增或编辑角色及菜单权限。

## admin-system-role-detail.html / 字段
AN-8887369b5b5e | 字段 | 规则 |
AN-43d226fc78b0 | --- | --- |
AN-060b54af5980 | 角色 ID | 新建系统生成，编辑只读。 |
AN-d0904680727d | 角色名称 | 必填且全局唯一。 |
AN-cc2d8cfd5196 | 角色状态 | 启用、停用。 |
AN-3a64cc6f53a4 | 菜单权限 | 与后台一级、二级菜单一致；已选择数 = 勾选叶子权限数。 |

## admin-system-role-detail.html / 业务
AN-1ce22b681441 1. 勾选父级联动全部子级；取消全部子级同步取消父级。
AN-c97f94b52d42 2. 内置超级管理员默认全部权限且不可修改。

## admin-system-role-detail.html / 交互
AN-37d7ad34f20b 1. 全选或全不选 -> 更新权限树；保存 -> 校验名称和权限 -> 对关联账号立即生效。
