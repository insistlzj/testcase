import fs from "node:fs/promises";
import path from "node:path";
import { canonicalToLegacy, normalizeTestcasePayload } from "./testcase-schema.mjs";

const basePath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);
const basePayload = normalizeTestcasePayload(JSON.parse(await fs.readFile(basePath, "utf8")));
const baseCases = basePayload.测试用例.map(canonicalToLegacy);

const methodByType = {
  业务流程: "真实用户链路与状态落地",
  逻辑校验: "等价类、边界值、状态或权限",
  异常用例: "失败、恢复、回滚或重复操作",
  功能需求: "最小功能单元与可观察结果",
};

const cases = baseCases.map((item) => ({
  ...item,
  precondition: Array.isArray(item.precondition) ? item.precondition : [item.precondition],
  step: Array.isArray(item.step) ? item.step : [item.step],
  expected_result: Array.isArray(item.expected_result) ? item.expected_result : [item.expected_result],
  Remarks: [
    ...(Array.isArray(item.Remarks) ? item.Remarks : [item.Remarks]),
    `测试设计方法：Cem Kaner；覆盖${methodByType[item.type] || "独立可执行场景"}。`,
  ],
}));

function add(module, page, type, priority, subPage, title, precondition, step, expected, remarks) {
  cases.push({
    module,
    page,
    type,
    priority,
    page_01: subPage || "/",
    title: title.startsWith("验证") ? title : `验证${title}`,
    precondition: Array.isArray(precondition) ? precondition : [precondition],
    step: Array.isArray(step) ? step : [step],
    expected_result: Array.isArray(expected) ? expected : [expected],
    Remarks: [
      ...(Array.isArray(remarks) ? remarks : [remarks]),
      `测试设计方法：Cem Kaner；覆盖${methodByType[type] || "独立可执行场景"}。`,
    ],
  });
}

const staticLimit = "验证方式：当前版本静态代码与本地原型分析；未连接数据库、Redis、短信、支付或生产环境。";

// 身份与会话：补足用户交互与可信边界
add("身份与会话", "B1 密码登录页", "逻辑校验", "P1", "协议确认",
  "验证未勾选协议并取消确认时不发起登录",
  ["代理账号和密码有效", "协议勾选状态为未选中"],
  ["点击登录", "在协议确认弹窗点击取消"],
  ["停留在登录页且不建立登录会话"],
  ["原型有描述：B1 未勾选协议时弹出确认，可取消", "代码：ug-app-agent 登录页面与控制器", staticLimit]);

add("身份与会话", "代理端受保护接口", "异常用例", "P0", "角色与实体不一致",
  "验证持有 agent 角色但代理实体不存在时不能读取业务数据",
  ["构造已登录且带 agent 角色的账号", "该账号没有有效 agent_info 记录"],
  ["直接请求 /agent/home/overview"],
  ["请求失败且不返回其他代理的默认或兜底数据"],
  ["原型未描述：网关角色与业务代理实体不一致", "代码：gateway/SaTokenConfig.java；各服务通过 StpUserUtil.getAgentId 获取代理实体", staticLimit]);

// 客户绑定：字段等价类、精确时间边界、失败恢复和取消
add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "姓名必填",
  "验证姓名为空或纯空格时不能获取验证码",
  ["当前账号为代理"],
  ["姓名留空或输入纯空格", "输入格式有效的手机号", "点击获取验证码"],
  ["客户端或服务端拒绝请求，不生成验证码记录"],
  ["原型有描述：E5 姓名输入项", "代码：AgentCustomerBindSendCodeRequest.realName @NotBlank", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "手机号必填",
  "验证手机号为空或纯空格时不能获取验证码",
  ["当前账号为代理"],
  ["输入姓名", "手机号留空或输入纯空格", "点击获取验证码"],
  ["客户端或服务端拒绝请求，不生成验证码记录"],
  ["原型有描述：E5 手机号输入项", "代码：AgentCustomerBindSendCodeRequest.phoneFull @NotBlank", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "手机号长度",
  "验证少于 7 位数字的手机号不能获取验证码",
  ["当前账号为代理"],
  ["输入姓名", "输入 6 位数字手机号", "点击获取验证码"],
  ["客户端阻止发送，不调用验证码接口"],
  ["原型有描述：E5 手机号输入", "代码：ug-app-agent BindCustomerController 校验数字位数不少于 7", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "验证码最小长度",
  "验证 3 位验证码不能提交绑定",
  ["已针对当前姓名和手机号发送验证码"],
  ["输入 3 位数字验证码", "点击确认绑定"],
  ["客户端阻止提交，不调用绑定确认接口"],
  ["原型有描述：E5 验证码输入", "代码：ug-app-agent BindCustomerController 仅接受 4 至 6 位验证码", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "验证码最大长度",
  "验证 7 位验证码不能提交绑定",
  ["已针对当前姓名和手机号发送验证码"],
  ["输入 7 位数字验证码", "点击确认绑定"],
  ["客户端阻止提交，不调用绑定确认接口"],
  ["原型有描述：E5 验证码输入", "代码：ug-app-agent BindCustomerController 仅接受 4 至 6 位验证码", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "错误次数未达上限",
  "验证验证码连续错误 1 至 4 次时不绑定客户",
  ["目标会员可绑定", "账号和手机号尚未进入错误锁定"],
  ["连续 4 次提交错误验证码"],
  ["四次均不建立 parent_id，错误次数累计但尚未进入第 5 次触发的锁定状态"],
  ["原型未描述：验证码错误计数", "代码：AgentCustomerBindServiceImpl 最大失败次数为 5", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "业务流程", "P1", "锁定恢复",
  "验证验证码错误锁定满 10 分钟后可重新绑定",
  ["同一账号和手机号已因 5 次错误锁定", "锁定时间已满 10 分钟", "目标会员仍可绑定"],
  ["重新获取验证码", "提交最新正确验证码"],
  ["锁定被视为已过期，客户完成一次绑定并清除失败计数"],
  ["原型未描述：验证码锁定恢复", "代码：AgentCustomerBindServiceImpl failure lock=10m，成功后清理失败状态", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "发送间隔边界",
  "验证验证码发送满 60 秒后允许再次发送",
  ["已成功发送一次验证码", "距上次发送时间等于或略大于 60 秒", "当日发送次数未达上限"],
  ["再次点击获取验证码"],
  ["生成新的 SENT 验证码并将其作为最新验证码"],
  ["原型有描述：E5 60 秒倒计时", "代码：AgentCustomerBindServiceImpl send interval=60s", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "发送次数正向边界",
  "验证当日第 20 次验证码发送仍按上限口径处理",
  ["同一手机号当日已有 19 次成功发送", "当前不在 60 秒冷却期"],
  ["请求第 20 次验证码"],
  ["第 20 次发送成功并把当日计数更新为 20；下一次请求由已有上限用例验证拒绝"],
  ["原型未描述：每日 20 次边界的包含关系", "代码：AgentCustomerBindServiceImpl daily count>=20 时预检拒绝，19 增加到 20 后允许", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "异常用例", "P1", "短信依赖失败",
  "验证短信服务失败时不能留下可用于绑定的错误授权状态",
  ["使用需要真实短信发送的非 +86 手机号", "模拟短信提供商返回失败"],
  ["点击获取验证码"],
  ["页面提示发送失败，目标客户不被绑定；失败请求产生的验证码不得被当作已授权结果使用"],
  ["原型未描述：短信外部依赖失败", "代码：AgentCustomerBindServiceImpl 非 +86 分支调用短信服务", "待验证：事务回滚是否覆盖验证码记录", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "功能需求", "P2", "取消绑定",
  "验证获取验证码后返回不会建立客户关系",
  ["已获取验证码但尚未提交确认"],
  ["返回客户列表或关闭当前页面"],
  ["目标客户 parent_id 保持为空，客户列表不新增该客户"],
  ["原型有描述：E5 绑定需确认提交", "代码：发送验证码与确认绑定为两个独立接口", staticLimit]);

add("客户绑定", "E5 新增客户→E1 我的客户", "业务流程", "P0", "绑定结果落地",
  "验证绑定完成后客户列表和首页客户数同步增加",
  ["目标会员可绑定且当前不在代理关系树", "记录绑定前首页客户数"],
  ["完成验证码绑定", "返回客户列表", "刷新首页"],
  ["客户列表出现一条 relationLayer=1 的新客户，首页累计客户数增加 1"],
  ["原型有描述：E5 绑定后返回 E1，D1 统计客户", "代码：绑定写 parent_id；首页与客户列表按关系树查询", staticLimit]);

// 客户列表、详情与订单：补足空值、交互切换和分页状态
add("客户管理", "E1 我的客户列表", "功能需求", "P2", "空关键词",
  "验证清空搜索关键词后恢复当前标签的完整列表",
  ["当前标签下存在多名客户", "已执行一次有结果的关键词搜索"],
  ["清空搜索框", "重新触发查询"],
  ["列表恢复当前标签对应的全部客户，分页从第一页开始"],
  ["原型有描述：E1 客户搜索", "代码：ug-app-agent 客户列表 Controller 查询与分页状态", staticLimit]);

add("客户管理", "E1 我的客户列表", "功能需求", "P2", "无匹配结果",
  "验证不存在的关键词返回空结果而不是旧列表",
  ["当前标签已加载客户列表"],
  ["输入不会匹配任何可见客户的关键词", "执行搜索"],
  ["列表进入空结果状态且不继续展示上一次查询的数据"],
  ["原型有描述：E1 搜索与空数据", "代码：客户分页接口 keyword 条件", staticLimit]);

add("客户管理", "E1 我的客户列表", "逻辑校验", "P1", "标签分页重置",
  "验证切换直接或间接标签后分页从第一页重新加载",
  ["全部客户标签已加载到第二页", "直接和间接客户均有数据"],
  ["切换到直接客户标签"],
  ["请求页码重置为 1，列表只包含直接客户且不混入旧标签第二页数据"],
  ["原型有描述：E1 全部/直接/间接标签", "代码：ug-app-agent 客户列表 Controller 分页状态", staticLimit]);

add("客户管理", "E2 客户详情·成长记录", "功能需求", "P1", "成长记录分页",
  "验证客户成长记录按每页 30 条连续加载",
  ["直接客户存在 31 条可见成长记录"],
  ["进入客户详情", "加载首批记录", "继续加载下一页"],
  ["两次加载合计 31 条且 consumeNo 不重复"],
  ["原型有描述：E2 客户成长记录", "代码：ug-app-agent 客户详情成长记录 pageSize=30", staticLimit]);

add("客户管理", "E4 订单详情", "功能需求", "P1", "余额支付订单",
  "验证余额支付流水可关联到对应业务订单详情",
  ["存在 change_type=payment 的负向余额流水", "source_id 与 source_code 对应当前代理可见客户的业务订单"],
  ["使用该 balance_log_id 打开订单详情"],
  ["返回与 source_id、source_code 一致的订单，不关联到其他同金额订单"],
  ["原型有描述：E4 订单详情", "代码：AgentOrderMapper.xml payment CTE 与三类订单分支", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P1", "短编号脱敏",
  "验证不足 5 个字符的间接客户编号脱敏后仍追加标记",
  ["间接客户 userCode 长度小于 5"],
  ["进入该客户详情"],
  ["编号保留现有全部字符并追加 **，不越界、不显示空值"],
  ["原型有描述：E2 间接客户脱敏", "代码：AgentCustomerPrivacyUtil.maskUserCode 使用 min(5, codePointCount)", staticLimit]);

// 首页与团队：补足数据变化后的联动和空状态
add("首页统计", "D1 首页总览", "业务流程", "P0", "绑定后实时统计",
  "验证新客户绑定后本月新增客户同步增加",
  ["本月内可完成一名新会员绑定", "记录绑定前本月新增客户数"],
  ["完成客户绑定", "刷新首页"],
  ["本月新增客户数增加 1，累计客户数同步增加 1"],
  ["原型有描述：D1 实时统计、E5 客户绑定", "代码：findHomeOverview 按 bind_time 和关系树统计", staticLimit]);

add("首页统计", "D1 首页总览", "业务流程", "P0", "部分退款后统计",
  "验证订单部分退款后订单笔数不变且消费净额减少",
  ["一笔已计入首页的订单实付 1000.00", "记录退款前订单数与消费总额"],
  ["对该订单退款 250.00", "刷新首页和成长概览"],
  ["订单笔数保持不变，累计消费金额减少 250.00"],
  ["原型有描述：D1 订单统计、E4 退款状态", "代码：AgentPaidOrderCte 保留订单并使用 GREATEST(pay-refund,0)", staticLimit]);

add("团队统计", "E3 我的团队", "功能需求", "P1", "空团队",
  "验证没有下级代理时团队概览返回零值",
  ["当前代理没有第 1、2 层 GENERAL/NORMAL 下级"],
  ["进入团队页面"],
  ["团队人数、贡献、客户数和订单数均为 0，列表为空"],
  ["原型有描述：E3 团队空数据", "代码：AgentInfoServiceImpl 对空概览补零；团队查询 CTE", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P1", "零贡献同分",
  "验证零贡献团队成员仍按稳定规则排名",
  ["两名可见团队代理贡献均为 0", "A.agentId 小于 B.agentId"],
  ["打开团队列表"],
  ["A 排在 B 前，重复刷新后顺序不变"],
  ["原型有描述：E3 团队排名", "代码：AgentInfoMapper.xml 按 contribution DESC、team_agent_id 排序", staticLimit]);

add("团队统计", "E3 我的团队", "异常用例", "P2", "重复加载",
  "验证团队分页请求未完成时重复触发不会追加重复行",
  ["团队列表正在加载下一页"],
  ["在首个请求返回前再次触发加载更多"],
  ["客户端只保留一个有效分页请求，列表不重复追加同一团队成员"],
  ["原型未描述：快速滚动重复加载", "代码：ug-app-agent TeamController 有 duplicate-request guard", staticLimit]);

// 佣金：补足无效订单、配置缺失、精确冻结边界和虚拟受益人
add("佣金结算", "订单完成→佣金生成", "逻辑校验", "P0", "零实付订单",
  "验证实付金额为 0 的订单不生成佣金",
  ["订单状态满足类型条件", "pay_amount=0", "订单尚无佣金记录"],
  ["运行佣金生成任务"],
  ["该订单不进入可佣金订单集合，不生成佣金记录"],
  ["原型未描述：零实付佣金资格", "代码：findCommissionableOrders 要求 pay amount>0", staticLimit]);

add("佣金结算", "订单完成→佣金生成", "逻辑校验", "P0", "待支付或取消订单",
  "验证待支付和已取消商品订单不生成佣金",
  ["分别准备 WAIT_PAY 与 CANCEL 商品订单", "两笔订单均无佣金记录"],
  ["运行佣金生成任务"],
  ["两笔订单均不生成冻结佣金"],
  ["原型有描述：E4 订单状态", "代码：findCommissionableOrders 仅商品 FINISH 订单", staticLimit]);

add("佣金结算", "订单完成→佣金生成", "异常用例", "P0", "无有效规则",
  "验证没有生效佣金规则时不生成半成品记录",
  ["存在可佣金订单", "当前没有有效 AgentCommissionRule"],
  ["运行佣金生成任务"],
  ["订单不产生不完整佣金记录，后续可在规则恢复后重新处理"],
  ["原型未描述：佣金规则缺失", "代码：AgentCommissionRecordServiceImpl 获取有效规则后计算", "待验证：无规则时任务返回和日志行为", staticLimit]);

add("佣金结算", "佣金规则", "逻辑校验", "P1", "分配比例正向边界",
  "验证三层分配比例合计恰好 100% 时规则可用",
  ["准备 direct=70%、indirect1=20%、indirect2=10%", "平台费率与成本费率合计不超过 100%"],
  ["保存并启用规则"],
  ["规则通过比例合计与层级递减校验，可被后续订单计算读取"],
  ["原型未描述：佣金后台规则保存", "代码：AgentCommissionRuleSaveRequestTest#acceptsPrototypeDistributionRates", staticLimit]);

add("佣金结算", "冻结→发放", "逻辑校验", "P0", "冻结截止边界",
  "验证到达冻结截止时间的佣金可进入结算",
  ["佣金状态 FROZEN", "当前时间等于 freezeUntil", "订单未退款且仍有效"],
  ["执行到期结算任务"],
  ["该佣金完成一次发放，不再继续停留在待发放集合"],
  ["原型有描述：F1 待发放转已发放", "代码：AgentCommissionRecordServiceImpl 按 freezeUntil 判断到期", staticLimit]);

add("佣金结算", "冻结→发放", "逻辑校验", "P0", "虚拟受益人",
  "验证平台成本和总池虚拟记录不会增加真实代理钱包",
  ["订单生成平台、成本、总池和真实代理佣金记录", "全部达到结算条件"],
  ["执行到期结算任务"],
  ["只有真实代理受益记录增加对应钱包余额，虚拟受益人记录不写入真实代理钱包"],
  ["原型未描述：虚拟受益人钱包处理", "代码：AgentCommissionRecordServiceImpl 对平台、成本、总池虚拟 ID 分支处理", staticLimit]);

// 成长趋势：补足负增长、零到零和组合筛选
add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "负增长",
  "验证本期低于前期时返回负的环比趋势",
  ["前一期总额=300.00", "本期总额=200.00"],
  ["请求统计趋势"],
  ["本期趋势为 -0.33，按两位小数四舍五入"],
  ["原型未描述：负增长趋势公式", "代码：AgentCommissionRecordServiceImpl (current-previous)/previous", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "连续零值",
  "验证前期和本期均为零时趋势为零",
  ["前一期总额=0", "本期总额=0"],
  ["请求统计趋势"],
  ["本期趋势值为 0，不返回 NaN 或无穷"],
  ["原型未描述：零值趋势公式", "代码：AgentCommissionRecordServiceImpl 对 previous=0 分支处理", staticLimit]);

add("成长统计", "成长明细", "逻辑校验", "P1", "月份与状态组合",
  "验证月份和状态组合筛选同时生效",
  ["目标月存在 RELEASED 与 FROZEN 记录", "其他月份也存在 RELEASED 记录"],
  ["选择目标月份", "选择已发放状态"],
  ["只返回目标月份的 RELEASED 记录，不混入本月待发放或其他月份已发放记录"],
  ["原型有描述：成长明细月份和状态筛选", "代码：AgentCommissionRecordMapper.xml 动态 month/status 条件", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "直推间推合计",
  "验证每个周期总额等于直推与间推之和",
  ["某周期 directAmount=120.00、indirectAmount=30.00"],
  ["请求该周期统计"],
  ["该周期总额为 150.00"],
  ["原型有描述：F1 直推与间推统计", "代码：AgentCommissionCountResponse.totalAmount=directAmount+indirectAmount", staticLimit]);

// 提现：补足余额精确边界、重复提交、历史快照、数据库保护和空列表
add("提现", "F4 成长值提现", "逻辑校验", "P0", "余额上界",
  "验证提现金额等于可用余额时允许申请",
  ["钱包 available=500.00、frozen=0", "收款信息有效"],
  ["提交提现 500.00"],
  ["生成 PENDING 记录，available=0、frozen=500.00"],
  ["原型有描述：F4 可用余额限制", "代码：AgentWalletMapper 使用 available_balance>=amount", staticLimit]);

add("提现", "F4 成长值提现", "异常用例", "P0", "重复点击",
  "验证快速重复点击确认不会生成两笔相同提现",
  ["钱包余额足以覆盖一笔申请", "提现表单已填写完成"],
  ["快速连续点击确认两次"],
  ["只生成一笔有效提现申请且钱包只冻结一次对应金额"],
  ["原型未描述：提现重复点击", "代码：钱包乐观锁可防透支，但请求级幂等入口需验证", "待验证：客户端是否在请求期间禁用提交", staticLimit]);

add("提现", "F4 成长值提现", "功能需求", "P1", "最近收款人顺序",
  "验证同一提现方式回填最近一次收款人",
  ["当前代理同一方式存在两次历史提现，旧记录收款人为 A，新记录收款人为 B"],
  ["选择该提现方式"],
  ["自动回填 B，不回填 A"],
  ["原型有描述：F4 自动填充上次收款人", "代码：AgentWithdrawRecordServiceImpl last payee 查询", staticLimit]);

add("提现", "F5 提现详情", "逻辑校验", "P1", "历史收款快照",
  "验证删除保存的收款账户不改变历史提现记录",
  ["已有提现记录保存收款人 A 的快照", "随后删除对应 payee account"],
  ["打开历史提现详情"],
  ["详情仍展示申请时的收款人 A 快照"],
  ["原型有描述：F5 提现详情", "代码：WithdrawRecordModel 保存 payeeName/payeeAccount 快照", staticLimit]);

add("提现", "F5 提现详情", "异常用例", "P0", "冻结余额不足",
  "验证审核完成时冻结余额不足不会把钱包扣成负数",
  ["存在 PENDING 提现 300.00", "构造钱包 frozen<300.00 的异常数据"],
  ["管理员提交 COMPLETED"],
  ["钱包条件更新失败，冻结余额不为负，提现不能被错误标记为已完成"],
  ["原型未描述：异常钱包数据", "代码：AgentWalletMapper complete guard frozen_balance>=amount", staticLimit]);

add("提现", "提现记录列表", "功能需求", "P2", "空记录",
  "验证没有提现记录时列表显示空状态",
  ["当前代理从未提交提现"],
  ["进入提现记录列表"],
  ["列表为空且不展示其他代理记录"],
  ["原型有描述：F5/公共空状态", "代码：AgentWithdrawRecordServiceImpl 按 current agent 分页", staticLimit]);

add("提现", "F4 成长值提现→F1 成长概览", "业务流程", "P0", "申请后回显",
  "验证提现申请成功后成长概览余额立即同步",
  ["钱包 available=800.00、frozen=100.00", "提现信息有效"],
  ["申请提现 200.00", "返回成长概览并刷新"],
  ["成长概览显示 available=600.00、frozen=300.00"],
  ["原型有描述：F4 提现与 F1 成长概览联动", "代码：提现申请钱包转移；growth overview 查询钱包", staticLimit]);

// 增量去重：按页面、标题、主要预期识别重复业务意图。
const unique = [];
const seen = new Set();
for (const item of cases) {
  const key = [
    item.module,
    item.page,
    item.title,
    (item.expected_result || []).join("|"),
  ].join("::").replace(/\s+/g, "");
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(item);
  }
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const payload = normalizeTestcasePayload({
  测试用例: unique,
  需求待确认: basePayload.需求待确认,
});
await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");

const byModule = Object.fromEntries(
  [...new Set(payload.测试用例.map((item) => item.功能模块))].map((module) => [
    module,
    payload.测试用例.filter((item) => item.功能模块 === module).length,
  ]),
);

console.log(JSON.stringify({
  sourceCases: baseCases.length,
  generatedCases: cases.length,
  uniqueCases: payload.测试用例.length,
  addedCases: payload.测试用例.length - baseCases.length,
  pendingCount: payload.需求待确认.length,
  outputPath,
  byModule,
}, null, 2));
