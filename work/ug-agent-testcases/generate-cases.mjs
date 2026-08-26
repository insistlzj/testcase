import fs from "node:fs/promises";
import path from "node:path";
import { normalizeTestcasePayload } from "./testcase-schema.mjs";

const cases = [];

function lines(value) {
  return Array.isArray(value) ? value : [value];
}

function add(module, page, type, priority, subPage, title, precondition, step, expected, remarks) {
  cases.push({
    module,
    page,
    type,
    priority,
    page_01: subPage || "/",
    title: title.startsWith("验证") ? title : `验证${title}`,
    precondition: lines(precondition),
    step: lines(step),
    expected_result: lines(expected),
    Remarks: lines(remarks),
  });
}

const staticLimit = "验证方式：基于当前代码与本地 HTML 原型静态分析生成；未连接数据库、Redis、短信、支付或生产环境。";
const codeVersion = "代码快照：ug-server dev@dac9290；ug-app-agent main@10d2be8；原型 main@7d7e6d0。";
const testRule = "测试数据说明：示例费率与金额仅用于验证公式，不代表生产配置。";

// 1. 身份、会话与访问边界
add("身份与会话", "代理端登录/受保护接口", "业务流程", "P0", "代理身份",
  "验证总代理登录后可访问代理商核心数据",
  ["存在启用状态的 GENERAL 代理账号", "账号已完成协议确认并取得 agent 角色会话"],
  ["使用该账号登录代理端", "进入首页并请求 /agent/home/overview"],
  ["登录进入首页，首页概览接口返回该代理自身数据范围，不混入其他代理树数据"],
  ["原型有描述：B1 密码登录页、D1 首页总览", "代码：gateway/.../SaTokenConfig.java；common-base/.../AgentLevel.java", staticLimit, codeVersion]);

add("身份与会话", "代理端登录/受保护接口", "业务流程", "P0", "代理身份",
  "验证普通代理登录后可访问代理商核心数据",
  ["存在启用状态的 NORMAL 代理账号", "账号已取得 agent 角色会话"],
  ["使用该账号登录代理端", "进入首页、客户列表和成长概览"],
  ["首页、客户和成长数据按当前普通代理的下级关系树返回"],
  ["原型有描述：B1 密码登录页", "代码：common-base/.../AgentLevel.java 的 isAgent；各 agent Service 的 getCurrentAgentId", staticLimit]);

add("身份与会话", "代理端登录/受保护接口", "逻辑校验", "P0", "非代理拦截",
  "验证会员或非会员不能调用代理端接口",
  ["准备 MEMBER 或 NONMEMBER 账号", "账号没有 agent 角色"],
  ["携带该账号会话直接请求 /agent/home/overview"],
  ["网关拒绝请求并返回无权限响应，代理商数据不返回"],
  ["原型有描述：B1 会员非代理拦截", "代码：gateway/.../SaTokenConfig.java 对 /agent/** 校验 agent 角色", staticLimit]);

add("身份与会话", "代理端登录/受保护接口", "异常用例", "P0", "会话失效",
  "验证登录失效后受保护页面不保留旧数据",
  ["代理账号曾成功登录并加载首页", "使会话过期或撤销"],
  ["重新进入首页", "触发首页概览请求"],
  ["页面进入登录失效处理，不继续展示可被误认为当前有效的旧统计数据"],
  ["原型有描述：A1 登录失效拦截、K7 登录拦截", "代码：gateway/.../SaTokenConfig.java 返回 unauthorized", staticLimit]);

// 2. 客户绑定
add("客户绑定", "E5 新增客户·验证码绑定", "业务流程", "P0", "国内手机号",
  "验证已有会员通过短信授权绑定为直接客户",
  ["当前账号为代理", "目标账号是已激活会员且存在有效会员卡", "目标尚未绑定上级且不是代理"],
  ["输入与会员档案一致的姓名和完整手机号", "获取验证码", "输入最新验证码并确认绑定"],
  ["目标 agent_info.parent_id 原子写入当前代理 ID，目标成为当前代理的直接客户且只绑定一次"],
  ["原型有描述：E5 App 只绑定既有会员、不创建账号、短信代表授权", "代码：agent/.../AgentCustomerBindServiceImpl.java", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "姓名校验",
  "验证姓名与会员档案不一致时不能发送验证码",
  ["当前账号为代理", "手机号对应一个可绑定会员"],
  ["输入该手机号和不一致姓名", "点击获取验证码"],
  ["请求被拒绝，不生成 SENT 验证码记录，也不改变客户归属"],
  ["原型有描述：E5 姓名与手机号用于识别会员", "代码：AgentCustomerBindServiceImplTest#rejectsNameThatDoesNotMatchMemberProfileWhenAgentRealNameIsEmpty", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "会员资格",
  "验证非会员不能被绑定",
  ["手机号存在用户账号", "该用户 memberLevel<=0 或不是会员"],
  ["输入姓名与手机号", "点击获取验证码"],
  ["请求被拒绝，不生成验证码，不建立代理关系"],
  ["原型有描述：E5 仅支持既有会员", "代码：agent/.../AgentCustomerBindServiceImpl.java", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "会员卡状态",
  "验证没有有效会员卡的账号不能被绑定",
  ["手机号对应会员账号", "该账号没有有效会员卡"],
  ["输入匹配的姓名与手机号", "点击获取验证码"],
  ["请求被拒绝，客户归属保持不变"],
  ["原型未描述：会员卡是后端绑定资格条件", "代码：AgentCustomerBindServiceImplTest#rejectsCustomerWithoutAnActiveMemberCard", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P0", "已绑定客户",
  "验证已有上级的会员不能再次绑定",
  ["目标会员的 parent_id 已指向其他代理"],
  ["当前代理为该会员获取验证码或提交绑定"],
  ["请求被拒绝，原上级关系不变，不出现重复或迁移绑定"],
  ["原型有描述：E5 关联关系永久、已绑定时阻断", "代码：AgentCustomerBindServiceImpl.java 的 parentId 校验与条件更新", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P0", "代理账号",
  "验证代理账号不能作为普通客户被绑定",
  ["目标手机号对应 GENERAL 或 NORMAL 代理"],
  ["当前代理输入目标姓名和手机号", "点击获取验证码"],
  ["请求被拒绝，不改变任何层级关系"],
  ["原型有描述：E5 绑定会员", "代码：AgentCustomerBindServiceImpl.java 排除 agentLevel.isAgent()", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "异常用例", "P0", "层级环路",
  "验证不能把祖先代理绑定到其后代名下",
  ["当前代理位于目标代理的后代关系链", "构造可提交的绑定请求"],
  ["提交验证码绑定"],
  ["服务拒绝产生层级环路，现有祖先和后代关系保持不变"],
  ["原型未描述：层级环路防护", "代码：AgentCustomerBindServiceImplTest#rejectsBindingAnAncestorBelowItsDescendant", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "发送冷却",
  "验证同一手机号 60 秒内不能重复发送验证码",
  ["当前代理已为目标手机号成功发送一次验证码", "距上次发送不足 60 秒"],
  ["再次点击获取验证码"],
  ["请求被限流，不新增第二条有效 SENT 验证码"],
  ["原型有描述：E5 验证码倒计时", "代码默认值：send interval=60s；AgentCustomerBindServiceImplTest#sendRejectsRequestInsideSixtySecondCooldown", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "每日上限",
  "验证同一手机号达到每日 20 次后不能继续发送验证码",
  ["同一手机号当日已达到 20 次发送记录", "当前不在 60 秒冷却期"],
  ["再次请求验证码"],
  ["请求被拒绝，当日发送计数不再增加"],
  ["原型未描述：发送次数上限", "代码默认值：daily limit=20；agent/.../AgentCustomerBindServiceImpl.java", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "验证码有效期",
  "验证超过 5 分钟的验证码不能用于绑定",
  ["已生成验证码", "验证码创建时间超过 5 分钟且未使用"],
  ["输入该验证码并确认绑定"],
  ["提交被拒绝，验证码不生效，客户 parent_id 仍为空"],
  ["原型未描述：验证码有效期", "代码默认值：expiry=5m；AgentCustomerBindServiceImpl.java", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "最新验证码",
  "验证只有最新一条已发送验证码可以绑定",
  ["同一代理与目标先后生成旧验证码和新验证码", "两条记录均未手工标记使用"],
  ["输入旧验证码提交"],
  ["旧验证码被拒绝，客户不绑定；只有最新 SENT 验证码具备消费资格"],
  ["原型未描述：最新验证码规则", "代码：AgentCustomerBindServiceImplTest#rejectsAnOlderCodeWhenTheLatestSentCodeDiffers", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P0", "验证码单次消费",
  "验证已使用验证码不能重复绑定",
  ["验证码已成功用于一次绑定并标记 USED"],
  ["重放同一确认请求"],
  ["重放被拒绝，不产生第二次绑定和重复审计记录"],
  ["原型有描述：验证码用于一次授权", "代码：AgentCustomerBindServiceImpl.java 条件消费 SENT→USED", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P1", "失败锁定",
  "验证连续 5 次验证码错误后锁定 10 分钟",
  ["目标仍可绑定", "同一账号与手机号已连续错误 4 次"],
  ["第 5 次输入错误验证码", "立即再输入正确验证码"],
  ["第 5 次错误触发 10 分钟锁定；锁定期内正确验证码也不能完成绑定"],
  ["原型未描述：错误次数与锁定窗口", "代码默认值：max failures=5、lock=10m；AgentCustomerBindServiceImpl.java", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "异常用例", "P0", "并发绑定",
  "验证两个代理并发绑定同一客户只允许一个成功",
  ["目标客户 parent_id 为空", "两个代理分别持有可提交的验证码"],
  ["同时提交两笔绑定确认"],
  ["仅一个条件更新成功，最终只有一个 parent_id；另一笔返回不可绑定，不出现双重归属"],
  ["原型有描述：关联关系唯一且永久", "代码：AgentCustomerBindServiceImpl.java 的 update parent only if null", staticLimit]);

add("客户绑定", "E5 新增客户·验证码绑定", "逻辑校验", "P2", "前端字段联动",
  "验证修改姓名或手机号后旧验证码状态失效",
  ["客户端已发送验证码并进入倒计时"],
  ["修改姓名或手机号", "尝试直接提交原验证码"],
  ["客户端清空验证码与已发送状态，必须针对新目标重新获取验证码"],
  ["原型有描述：E5 验证码绑定", "代码：ug-app-agent/.../BindCustomerController 修改目标后 invalidate sent state", staticLimit]);

// 3. 客户、订单与隐私
add("客户管理", "E1 我的客户列表", "功能需求", "P0", "全部客户",
  "验证客户列表只统计当前代理下 1 至 3 层去重客户",
  ["当前代理下分别存在第 1、2、3、4 层客户", "各客户 agent_id 唯一"],
  ["进入客户列表并选择全部"],
  ["列表和总数包含第 1 至 3 层客户且每人只计一次，不包含第 4 层"],
  ["原型有描述：E1 直接+间接客户；总关系层级 1..3", "代码：agent/.../AgentInfoMapper.xml 的 customer_tree relation_layer<3", staticLimit]);

add("客户管理", "E1 我的客户列表", "逻辑校验", "P1", "直接/间接筛选",
  "验证直接和间接客户筛选口径",
  ["当前代理下存在第 1、2、3 层客户"],
  ["依次选择直接、间接筛选"],
  ["直接仅返回 relationLayer=1；间接仅返回 relationLayer=2 或 3，集合互斥且并集等于全部"],
  ["原型有描述：E1 直接/间接标签", "代码：AgentInfoMapper.xml relation type DIRECT/INDIRECT", staticLimit]);

add("客户管理", "E1 我的客户列表", "逻辑校验", "P1", "关键词搜索",
  "验证直接客户可按完整编号姓名手机号搜索",
  ["存在直接客户，准备其完整 userCode、姓名和完整手机号"],
  ["分别输入三种关键词搜索"],
  ["三次均只返回匹配的直接客户"],
  ["原型有描述：E1 搜索", "代码：AgentInfoMapper.xml 对直接客户搜索完整 code/name/phone", staticLimit]);

add("客户管理", "E1 我的客户列表", "逻辑校验", "P0", "间接客户搜索隐私",
  "验证不能用间接客户完整隐私信息反查客户",
  ["存在间接客户，掌握其完整姓名、手机号和编号"],
  ["分别用完整姓名、完整手机号、编号被遮蔽部分搜索"],
  ["结果不因隐私字段命中而暴露该客户；仅允许使用接口返回的脱敏可见值进行受限搜索"],
  ["原型有描述：E2 间接客户脱敏", "代码：AgentInfoMapper.xml 间接搜索仅使用 masked code/name", staticLimit]);

add("客户管理", "E1 我的客户列表", "逻辑校验", "P1", "默认排序",
  "验证客户列表按最近订单时间排序",
  ["准备多名客户，最近订单时间不同，其中一人无订单"],
  ["进入客户列表"],
  ["有订单客户按最近订单时间倒序排列；无订单客户按实现的空值次序稳定展示"],
  ["原型有描述：E1 按最新订单排序", "代码：AgentInfoMapper.xml 支持 latest order/latest added 排序", "待确认：无订单客户与同时间客户的最终产品排序口径", staticLimit]);

add("客户管理", "E1 我的客户列表", "功能需求", "P1", "分页",
  "验证客户列表分页不重复不漏数",
  ["当前代理有 41 名可见客户", "客户端页大小为 20"],
  ["连续加载第 1、2、3 页"],
  ["三页分别返回 20、20、1 条，跨页 agent_id 不重复，总数为 41"],
  ["原型有描述：E1 客户列表", "代码：ug-app-agent 客户列表 pageSize=20", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P0", "直接客户隐私",
  "验证直接客户详情保留完整身份信息",
  ["目标是当前代理第 1 层直接客户"],
  ["从列表进入客户详情"],
  ["姓名、用户编号和手机号按数据源完整返回，并允许进入订单详情"],
  ["原型有描述：E2 直接客户完整数据且可查看订单", "代码：AgentCustomerPrivacyUtil.java 对 direct=true 不脱敏", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P0", "间接客户隐私",
  "验证间接客户及其上级信息被脱敏",
  ["目标是当前代理第 2 或 3 层间接客户"],
  ["从列表进入客户详情"],
  ["客户姓名仅首字符可见后缀 **，编号最多前 5 个字符后缀 **，手机号按统一规则脱敏；上级姓名和编号同样脱敏"],
  ["原型有描述：E2 间接客户脱敏", "代码：agent/.../AgentCustomerPrivacyUtil.java", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P0", "间接订单限制",
  "验证间接客户不能打开订单详情",
  ["目标是第 2 或 3 层间接客户", "该客户存在成长记录"],
  ["在成长记录中尝试进入订单详情", "或直接请求记录中的 consumeNo"],
  ["客户端不提供可用入口；服务端直接访问也只能在当前代理数据范围内返回，产品层面不得借此暴露间接客户完整订单隐私"],
  ["原型有描述：E2 间接客户不能查看订单详情", "代码：客户端根据 direct 控制入口；AgentOrderMapper.xml 仍允许关系树 1..3", "待确认：后端是否也应强制仅 relation_layer=1", staticLimit]);

add("客户管理", "E2 客户详情", "异常用例", "P0", "越权客户",
  "验证不属于当前代理关系树的客户详情不可访问",
  ["准备另一代理树下的 customerAgentId"],
  ["直接请求该客户详情接口"],
  ["返回资源不存在或等价拒绝，不返回客户身份、消费和成长数据"],
  ["原型有描述：K4 无权限、K5 内容失效", "代码：AgentHomeServiceImpl 先按当前 agentId 约束详情查询", staticLimit]);

add("客户管理", "E4 订单详情", "异常用例", "P0", "越权订单",
  "验证不属于当前代理关系树的订单不可访问",
  ["获取另一代理树客户的 consumeNo"],
  ["直接请求 /agent/order/{consumeNo}"],
  ["返回资源不存在，不返回订单金额、门店和客户信息"],
  ["原型有描述：E4 订单详情、K4 无权限", "代码：AgentOrderServiceImpl.java；AgentOrderMapper.xml customer_tree", staticLimit]);

add("客户管理", "E4 订单详情", "功能需求", "P1", "订单类型",
  "验证商品项目和医材订单详情按支付流水关联",
  ["分别准备 goods、project、medical_material 支付流水", "订单属于当前代理可见关系树"],
  ["依次打开三类订单详情"],
  ["每类都返回对应订单号、类型、支付金额、退款金额、时间及门店/项目字段，不串单"],
  ["原型有描述：E4 订单详情", "代码：AgentOrderMapper.xml 三个 UNION 分支；AgentOrderMapperXmlTest", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P0", "成长值合计",
  "验证客户总成长值等于已发放加待发放",
  ["客户有已发放 120.00、待发放 30.00、已回滚 50.00 的佣金记录"],
  ["进入客户详情"],
  ["已发放为 120.00，待发放为 30.00，总成长值为 150.00；已回滚 50.00 不计入"],
  ["原型有描述：E2 成长统计", "代码：AgentInfoMapper.xml detail growth sums；AgentHomeServiceImpl 默认空值为 0", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P0", "消费净额",
  "验证客户累计消费按支付额减退款额且不为负",
  ["客户有支付 1000.00 退款 250.00 的订单、支付 300.00 退款 300.00 的订单"],
  ["进入客户详情"],
  ["累计消费金额为 750.00，单笔退款不允许使净消费为负数"],
  ["原型有描述：E2 累计消费", "代码：AgentInfoMapper.xml AgentPaidOrderCte 使用 GREATEST(pay-refund,0)", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P1", "订单笔数去重",
  "验证订单笔数按订单类型和订单 ID 去重",
  ["同一业务订单产生多条余额流水或佣金受益人记录", "另有不同类型但相同数值 ID 的订单"],
  ["查看客户详情订单数"],
  ["同一类型同一订单 ID 只计 1 笔；不同类型即使 ID 相同也分别计数"],
  ["原型有描述：E2 订单笔数", "代码：AgentInfoMapper.xml COUNT(DISTINCT CONCAT(order_type,':',order_id))", staticLimit]);

add("客户管理", "E2 客户详情", "逻辑校验", "P1", "全额退款历史订单",
  "验证全额退款订单保留历史笔数但消费净额归零",
  ["商品订单已支付 500.00 后全额退款 500.00，订单未被物理删除"],
  ["查看客户详情"],
  ["历史订单笔数仍包含该订单，累计消费对该订单贡献为 0.00"],
  ["原型未描述：退款后历史订单计数口径", "代码：AgentPaidOrderCte 保留已支付订单并将净额压到 0", staticLimit]);

add("客户管理", "E2 客户详情", "功能需求", "P2", "空数据",
  "验证无订单无成长客户详情显示零值",
  ["直接客户已绑定但没有订单和佣金记录"],
  ["进入客户详情"],
  ["订单数、累计消费、已发放、待发放、总成长值均显示 0，不显示 null"],
  ["原型有描述：E2 空数据", "代码：AgentHomeServiceImpl 对 totalGrowthAmount 等空值补 0；客户端模型有默认值", staticLimit]);

// 4. 首页统计
add("首页统计", "D1 首页总览", "逻辑校验", "P0", "累计客户",
  "验证首页累计客户按当前代理 1 至 3 层去重",
  ["关系树有第 1 层 2 人、第 2 层 3 人、第 3 层 4 人、第 4 层 5 人"],
  ["打开首页总览"],
  ["累计客户显示 9，不包含第 4 层且同一 agent_id 不重复"],
  ["原型有描述：D1 当前代理直接+间接客户去重", "代码：AgentInfoMapper.xml findHomeOverview", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P0", "本月新增客户",
  "验证本月新增客户以绑定时间落月统计",
  ["准备上月末、本月首日 00:00、本月中和下月首日 00:00 绑定的客户"],
  ["打开首页总览"],
  ["仅本月首日含边界到下月首日前的客户计入本月新增"],
  ["原型有描述：D1 本月新增客户按关联时间", "代码：AgentInfoMapper.xml 月度条件", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P0", "累计订单",
  "验证首页累计订单跨类型去重统计",
  ["客户树中存在多类已支付订单及重复流水", "另有待支付和取消订单"],
  ["打开首页总览"],
  ["只统计符合支付/消费条件的业务订单，并按 order_type+order_id 去重；待支付和取消不计入"],
  ["原型有描述：D1 累计订单", "代码：AgentInfoMapper.xml AgentPaidOrderCte、distinct order key", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P0", "本月订单",
  "验证本月订单按业务统计时间落月",
  ["准备月界前后完成或支付的订单"],
  ["打开首页总览"],
  ["本月订单只包含代码口径下统计时间位于本月区间的订单"],
  ["原型有描述：D1 本月订单", "代码：AgentInfoMapper.xml findHomeOverview", "待确认：不同订单类型统一采用支付时间还是完成/核销时间作为月度口径", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P0", "累计成长值",
  "验证首页累计成长值排除已回滚记录",
  ["当前代理有 RELEASED 200.00、FROZEN 80.00、ROLLED_BACK 50.00 佣金"],
  ["打开首页总览"],
  ["累计成长值显示 280.00，已回滚 50.00 不计入"],
  ["原型有描述：D1 累计成长值含已发放+待发放", "代码：AgentInfoMapper.xml commission_total status<>rolled_back", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P0", "本月成长值",
  "验证本月成长值按佣金记录时间且排除回滚",
  ["准备本月与上月佣金记录，并包含本月 ROLLED_BACK 记录"],
  ["打开首页总览"],
  ["本月成长值仅汇总本月非回滚佣金，跨月和已回滚金额不计入"],
  ["原型有描述：D1 本月成长值", "代码：AgentInfoMapper.xml commission_month", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P1", "消费金额",
  "验证首页消费总额按退款后净额累计",
  ["客户树内有支付 1200.00、退款 200.00 的订单", "另有客户树外支付订单"],
  ["进入成长概览或首页关联统计"],
  ["当前代理范围内消费总额为 1000.00，树外订单不计入"],
  ["原型有描述：D1/E2 数据统计", "代码：AgentInfoMapper.xml growth overview total_consume_amount", staticLimit]);

add("首页统计", "D1 首页总览", "功能需求", "P1", "零值",
  "验证没有客户订单和佣金时首页返回完整零值",
  ["新代理无下级、无订单、无佣金、无钱包记录"],
  ["打开首页"],
  ["客户、订单、成长值和本月指标均为 0，不出现 null、NaN 或加载失败"],
  ["原型有描述：D1 数据为空显示 0", "代码：AgentHomeServiceImpl.java 和客户端模型默认值", staticLimit]);

add("首页统计", "D1 首页总览", "逻辑校验", "P1", "未读消息",
  "验证首页未读消息按登录账号而不是代理实体统计",
  ["同一代理实体关联明确的登录 accountId", "该 accountId 有 3 条未读消息，其他账号有 2 条"],
  ["打开首页"],
  ["未读消息数显示 3，不混入其他账号消息"],
  ["原型有描述：D1 消息入口", "代码：AgentHomeServiceImplTest#homeOverviewCountsUnreadMessagesByLoginAccountId", staticLimit]);

add("首页统计", "D1 首页总览", "异常用例", "P1", "刷新失败",
  "验证首页刷新失败不把旧统计误写成零",
  ["首页已加载一组有效统计", "模拟网络或依赖错误"],
  ["下拉刷新首页"],
  ["页面展示请求失败与重试入口；旧数据若保留必须明确为旧值，不用默认零覆盖已加载结果"],
  ["原型有描述：K3 网络异常", "原型未描述：失败时旧数据保留策略", "待确认：客户端具体缓存展示策略", staticLimit]);

// 5. 团队
add("团队统计", "E3 我的团队", "功能需求", "P0", "团队范围",
  "验证团队成员只包含下级第 1 和第 2 层代理",
  ["当前代理下有第 1、2、3 层 GENERAL/NORMAL 代理及普通会员"],
  ["进入团队列表"],
  ["仅列出第 1、2 层 GENERAL/NORMAL 代理；第 3 层代理及 MEMBER/NONMEMBER 不作为团队成员"],
  ["原型有描述：E3 下一层+第二层团队", "代码：AgentInfoMapper.xml AgentTeamCommonCtes", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P0", "团队人数",
  "验证团队人数按代理 ID 去重",
  ["同一团队成员通过多条业务记录参与统计"],
  ["查看团队概览"],
  ["团队人数等于第 1、2 层有效代理的 distinct agent_id 数量"],
  ["原型有描述：E3 团队人数", "代码：AgentInfoMapper.xml COUNT(DISTINCT team_agent_id)", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P0", "团队贡献",
  "验证团队贡献只汇总团队代理直接客户产生的非回滚佣金",
  ["团队代理 A 的直接客户产生 RELEASED 100、FROZEN 50、ROLLED_BACK 20", "A 的间接客户另有佣金 30"],
  ["查看团队概览和 A 的列表行"],
  ["A 的贡献为 150.00，不计已回滚 20.00和不属于其直接客户口径的 30.00"],
  ["原型有描述：E3 团队贡献", "代码：AgentInfoMapper.xml contribution CTE", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P0", "团队客户数",
  "验证团队客户数使用团队后代关系层级口径",
  ["构造团队成员及其下级第 2、3 层客户，包含重复业务记录"],
  ["查看团队概览"],
  ["客户数按代码定义的团队后代层级与 distinct agent_id 汇总，不因订单或佣金多行重复"],
  ["原型有描述：E3 客户统计", "代码：AgentInfoMapper.xml team customer_count", "待确认：产品希望统计相对当前代理第 2/3 层，还是每名团队代理各自直接/间接客户", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P0", "团队订单数",
  "验证团队订单数按业务订单去重",
  ["团队范围客户有多类型订单和重复支付/佣金记录"],
  ["查看团队概览与成员行"],
  ["订单数按 order_type+order_id 去重，不按流水行或佣金受益人数量放大"],
  ["原型有描述：E3 订单统计", "代码：AgentInfoMapper.xml team order_count", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P1", "贡献排名",
  "验证团队按贡献降序并用代理 ID 稳定破同分",
  ["A 贡献 300、B 贡献 500、C 贡献 300，且 A.agentId<C.agentId"],
  ["打开团队列表"],
  ["B 排名在前；A 与 C 同分时按 team_agent_id 升序稳定排序，分页前后顺序不跳动"],
  ["原型有描述：E3 团队排行", "代码：AgentInfoMapper.xml ORDER BY contribution DESC, team_agent_id", staticLimit]);

add("团队统计", "E3 我的团队", "功能需求", "P1", "分页",
  "验证团队列表分页累计排名连续",
  ["当前代理有 21 名可见团队代理", "客户端页大小 20"],
  ["加载第 1 页和第 2 页"],
  ["第一页 20 条、第二页 1 条；排名从 1 连续到 21，无重复或跳号"],
  ["原型有描述：E3 团队列表", "代码：ug-app-agent TeamController pageSize=20", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P1", "普通代理权限",
  "验证普通代理按当前实现可访问团队概览和列表",
  ["使用 NORMAL 代理登录", "其下存在代理成员"],
  ["请求团队概览和团队分页接口"],
  ["当前实现返回该普通代理自身关系树的团队数据"],
  ["代码：AgentInfoServiceImplTest#normalAgentCanAccessTeamData", "待确认：Controller 注释与产品原型是否期望仅 GENERAL 可见；当前服务实现允许 NORMAL", staticLimit]);

add("团队统计", "E3 我的团队", "逻辑校验", "P0", "树外隔离",
  "验证团队统计不混入其他代理树",
  ["另一个顶级代理树存在高贡献团队成员和大量订单"],
  ["当前代理查看团队概览和列表"],
  ["人数、贡献、客户和订单均不包含另一棵代理树数据"],
  ["原型有描述：E3 当前代理团队", "代码：AgentInfoMapper.xml recursive roots by current agentId", staticLimit]);

// 6. 订单佣金生成、退款与结算
add("佣金结算", "订单完成→佣金生成", "业务流程", "P0", "商品订单",
  "验证已完成商品订单生成冻结佣金",
  ["商品订单已支付且状态 FINISH", "当前有效佣金规则存在", "订单尚无佣金记录"],
  ["等待佣金任务扫描该订单"],
  ["为订单生成平台、成本、实际代理层级或总池记录；代理佣金状态为 FROZEN，pendingAmount 等于佣金金额，冻结截止时间为完成时间加 7 天"],
  ["原型有描述：F1 待发放成长值、E4 订单详情", "代码：admin/.../AgentCommissionRecordServiceImpl.java；CommissionTask.java", staticLimit]);

add("佣金结算", "订单完成→佣金生成", "逻辑校验", "P0", "项目订单已消费",
  "验证部分核销项目订单可生成佣金",
  ["项目订单状态 WAIT_USE", "totalCount=3、remainCount=2", "存在已扣减工单且未生成佣金"],
  ["运行佣金生成任务"],
  ["该项目订单被识别为可佣金订单并生成冻结记录"],
  ["原型未描述：项目订单核销资格", "代码：OrderCompletionCommissionServiceTest#partiallyConsumedProjectIsEligibleForCommissionSettlement", staticLimit]);

add("佣金结算", "订单完成→佣金生成", "逻辑校验", "P0", "项目订单未消费",
  "验证完全未核销项目订单不生成佣金",
  ["项目订单 WAIT_USE，totalCount=remainCount=3"],
  ["运行佣金生成任务"],
  ["订单不进入可佣金集合，不生成佣金记录"],
  ["原型未描述：项目订单核销资格", "代码：OrderCompletionCommissionServiceTest#unusedProjectIsNotEligibleForCommissionSettlement", staticLimit]);

add("佣金结算", "订单完成→佣金生成", "逻辑校验", "P0", "医材订单",
  "验证已支付且已扣减工单的医材订单生成佣金",
  ["医材订单状态 PAID", "关联工单已扣减", "订单尚无佣金记录"],
  ["运行佣金生成任务"],
  ["订单生成冻结佣金记录；未扣减工单的医材订单不生成"],
  ["原型有描述：E4 订单详情", "代码：AgentCommissionRecordMapper.findCommissionableOrders SQL", staticLimit]);

add("佣金结算", "佣金规则", "逻辑校验", "P0", "分配比例合计",
  "验证直推与两层间推分配比例必须合计 100%",
  ["准备规则 direct=50%、indirect1=30%、indirect2=10%"],
  ["保存或启用该规则"],
  ["规则被拒绝，不能用于订单佣金生成"],
  ["原型未描述：佣金后台规则校验", "代码：AgentCommissionRuleSaveRequestTest#rejectsDistributionRatesThatDoNotTotalOne", staticLimit]);

add("佣金结算", "佣金规则", "逻辑校验", "P0", "层级比例顺序",
  "验证分配比例不能随层级加深而升高",
  ["准备 direct=50%、indirect1=20%、indirect2=30%"],
  ["保存或启用该规则"],
  ["规则被拒绝，不能产生层级越深比例反而越高的分配"],
  ["原型未描述：佣金后台规则校验", "代码：AgentCommissionRuleSaveRequestTest#rejectsDistributionRatesThatIncreaseByLayer", staticLimit]);

add("佣金结算", "佣金规则", "逻辑校验", "P0", "基础扣减比例",
  "验证平台费率与成本费率合计不能超过 100%",
  ["准备 platform=60%、cost=50% 的规则"],
  ["保存或启用该规则"],
  ["规则被拒绝，避免可分配金额为负数"],
  ["原型未描述：佣金后台规则校验", "代码：AgentCommissionRuleSaveRequestTest#rejectsBaseRatesAboveOneHundredPercent", staticLimit]);

add("佣金结算", "佣金计算", "逻辑校验", "P0", "标准金额",
  "验证佣金按平台成本扣减后再按层级比例分配",
  ["订单实付 1000.00", "测试规则 platform=10%、cost=20%、direct=50%、indirect1=30%、indirect2=20%", "三层受益代理均存在"],
  ["触发订单佣金生成"],
  ["平台金额=100.00，成本金额=200.00，可分配金额=700.00；直推=350.00，间推1=210.00，间推2=140.00，分配合计与可分配金额一致"],
  ["原型未描述：平台、成本与层级金额的后端精确公式", "代码：AgentCommissionRecordServiceImpl.java 先扣平台和成本再分层", testRule, staticLimit]);

add("佣金结算", "佣金计算", "逻辑校验", "P0", "两位小数残差",
  "验证舍入残差由最后一层吸收且总额守恒",
  ["订单实付 100.01", "测试规则 platform=10%、cost=20%、direct=50%、indirect1=30%、indirect2=20%", "三层受益代理均存在"],
  ["触发佣金生成"],
  ["平台=10.00、成本=20.00、可分配=70.01；直推=35.01、间推1=21.00、间推2=14.00，三层合计严格等于 70.01"],
  ["原型未描述：两位小数与残差分配规则", "代码：AgentCommissionRecordServiceImpl.java scale2 HALF_UP，indirect2 使用残差", testRule, staticLimit]);

add("佣金结算", "佣金计算", "逻辑校验", "P0", "缺失上级",
  "验证缺失的间推层金额进入总池",
  ["订单实付 1000.00", "测试规则 platform=30%、cost=30%、direct=70%、indirect1=20%、indirect2=10%", "仅直推总代理存在，后两层不存在"],
  ["触发佣金生成"],
  ["平台=300.00、成本=300.00、直推代理=280.00；缺失两层合计 120.00 进入总池，不凭空消失或错误给直推代理"],
  ["原型未描述：缺失层级金额进入总池", "代码：OrderCompletionCommissionServiceTest#generalAgentAtDirectLayerUsesUniversalRateAndMissingLayersFlowIntoPool", testRule, staticLimit]);

add("佣金结算", "佣金计算", "逻辑校验", "P0", "重复任务",
  "验证同一订单被重复扫描不会重复生成佣金",
  ["某订单已生成完整佣金记录", "定时任务再次扫描同一订单"],
  ["再次执行佣金生成任务"],
  ["不新增该订单的第二组佣金记录，首页和成长统计不翻倍"],
  ["原型未描述：定时任务幂等", "代码：findCommissionableOrders 排除已有 commission records", staticLimit]);

add("佣金结算", "佣金计算", "逻辑校验", "P1", "批量边界",
  "验证单轮最多处理 200 笔且后续轮次可继续",
  ["准备 201 笔符合条件且未生成佣金的订单"],
  ["执行一次任务", "再执行下一次任务"],
  ["第一轮最多生成 200 笔，下一轮处理剩余订单；最终 201 笔各生成一次"],
  ["原型未描述：批处理", "代码：AgentCommissionRecordServiceImpl batch size=200；CommissionTask 每分钟执行", staticLimit]);

add("佣金结算", "冻结→发放", "逻辑校验", "P0", "冻结期内",
  "验证完成后未满 7 天的佣金保持待发放",
  ["订单完成时间加 7 天尚未到达", "佣金状态 FROZEN"],
  ["执行到期结算任务"],
  ["佣金仍为 FROZEN，pendingAmount 不变，代理可用余额不增加"],
  ["原型有描述：F1 待发放成长值", "代码：AgentCommissionRecordServiceImpl freeze days=7", staticLimit]);

add("佣金结算", "冻结→发放", "业务流程", "P0", "到期发放",
  "验证满 7 天且订单仍有效时佣金发放到钱包",
  ["佣金冻结截止时间已到", "订单未退款且仍满足佣金资格", "钱包可用余额为 100.00，待发放佣金 35.00"],
  ["执行到期结算任务"],
  ["佣金变为 RELEASED，releasedAmount=35.00、pendingAmount=0；钱包可用余额变为 135.00"],
  ["原型有描述：F1 可用/已发放/待发放", "代码：AgentCommissionRecordServiceImpl settlement；AgentWalletMapper", staticLimit]);

add("佣金结算", "退款→回滚", "业务流程", "P0", "冻结期全额退款",
  "验证冻结期内全额退款将佣金全部回滚",
  ["订单实付 1000.00 后全额退款 1000.00", "相关佣金仍为 FROZEN"],
  ["触发退款回滚或结算扫描"],
  ["全部佣金变为 ROLLED_BACK，pendingAmount=0，不增加代理钱包余额，成长统计不再计入"],
  ["原型有描述：E4 已退款、F1 成长统计", "代码：AgentCommissionRecordServiceImpl full refund rollback", staticLimit]);

add("佣金结算", "退款→回滚", "逻辑校验", "P0", "冻结期部分退款",
  "验证部分退款按未退款比例保留佣金",
  ["订单实付 1000.00，退款 250.00", "某代理原冻结佣金 350.00"],
  ["触发退款回滚处理"],
  ["退款比例=25%；该代理保留佣金 262.50，减少 87.50，后续只按 262.50 发放且不重复缩放"],
  ["原型有描述：E4 部分/已退款状态", "代码：AgentCommissionRecordServiceImpl refund ratio 与 rollbackTime 防重复缩放", testRule, staticLimit]);

add("佣金结算", "退款→回滚", "逻辑校验", "P0", "重复部分退款事件",
  "验证相同累计退款金额重复通知不会二次缩减佣金",
  ["订单已按累计退款 25% 将佣金 350.00 缩减到 262.50", "重复投递相同退款状态"],
  ["再次执行退款回滚处理"],
  ["佣金仍为 262.50，不再次乘以 75%"],
  ["原型未描述：退款事件幂等", "代码：AgentCommissionRecordServiceImpl 使用 rollbackTime/状态避免重复缩放", staticLimit]);

add("佣金结算", "退款→回滚", "逻辑校验", "P0", "超额退款防护",
  "验证退款金额大于等于实付时按全额退款处理",
  ["订单实付 1000.00，累计退款记录为 1000.00 或 1100.00"],
  ["执行退款处理"],
  ["退款比例封顶为 100%，相关佣金全部回滚，不出现负佣金或负保留额"],
  ["原型未描述：异常退款金额", "代码：AgentCommissionRecordServiceImpl refund>=pay -> ratio 1", staticLimit]);

add("佣金结算", "退款→回滚", "逻辑校验", "P1", "退款后明细",
  "验证部分退款保留一条成长明细而全额退款金额归零",
  ["分别准备部分退款与全额退款订单"],
  ["查看成长明细和客户成长记录"],
  ["部分退款订单仍为一条业务成长记录且金额为保留额；全额回滚记录不再贡献成长金额"],
  ["原型有描述：F5/E4 退款相关明细", "代码：AgentCommissionRecordMapperXmlTest#keepsOneGrowthRecordForPartialRefundAndZerosOnlyFullRollback", staticLimit]);

add("佣金结算", "冻结→发放", "异常用例", "P0", "并发结算",
  "验证并发结算同一佣金只入账一次",
  ["一条到期 FROZEN 佣金由两个任务实例同时扫描"],
  ["并发执行结算"],
  ["佣金最多一次变为 RELEASED，钱包可用余额只增加一次，消息最多产生一次有效发放通知"],
  ["原型未描述：任务并发", "代码：CommissionTask Redis 锁与状态更新", staticLimit]);

// 7. 成长概览、明细、趋势
add("成长统计", "F1 成长概览", "逻辑校验", "P0", "钱包与成长口径",
  "验证成长概览区分可用余额冻结余额已发放和待发放",
  ["钱包 available=700.00、frozen=300.00", "非回滚佣金 RELEASED=450.00、FROZEN=120.00"],
  ["进入成长概览"],
  ["可用余额=700.00、冻结余额=300.00、已发放=450.00、待发放=120.00、总成长值=570.00"],
  ["原型有描述：F1 可用/已发放/待发放", "代码：AgentInfoMapper.xml findGrowthOverview；AgentGrowthOverview 模型", staticLimit]);

add("成长统计", "F1 成长概览", "逻辑校验", "P0", "回滚排除",
  "验证已回滚佣金不进入成长概览",
  ["除正常佣金外存在 ROLLED_BACK 200.00"],
  ["进入成长概览"],
  ["released、pending 和 total 均不包含该 200.00"],
  ["原型有描述：F1 成长值统计", "代码：AgentInfoMapper.xml status<>rolled_back", staticLimit]);

add("成长统计", "F1 成长概览", "功能需求", "P1", "零值",
  "验证无钱包和佣金记录时成长概览显示零",
  ["新代理没有 agent_wallet 和 commission record"],
  ["进入成长概览"],
  ["所有金额与计数为 0，不出现 null 或 NaN"],
  ["原型有描述：F1 空数据", "代码：AgentHomeServiceImpl.java 默认空值；AgentGrowthOverview 默认值", staticLimit]);

add("成长统计", "成长明细", "逻辑校验", "P0", "直推与间推",
  "验证成长明细按 layer 区分直推和间推",
  ["当前代理分别有 layer=1、2、3 的佣金记录"],
  ["查看全部成长明细并按直推/间推筛选"],
  ["直推只包含 layer=1；间推包含 layer=2、3；金额合计与全部明细一致"],
  ["原型有描述：F1/F5 直推与间推", "代码：AgentCommissionRecordMapper.java direct layer=1、indirect layer<>1", staticLimit]);

add("成长统计", "成长明细", "逻辑校验", "P0", "状态筛选",
  "验证已发放待发放已退款状态筛选",
  ["准备 RELEASED、FROZEN、全额退款/回滚相关业务记录"],
  ["依次选择各状态筛选"],
  ["每个筛选仅返回对应业务状态，且退款分支不因缺少佣金记录而漏掉可识别的全额退款订单"],
  ["原型有描述：E2/F5 状态筛选", "代码：AgentCommissionRecordMapperXmlTest#filtersCustomerGrowthRecordsByStatusInBothUnionBranches、#customerFullRefundFallback...", staticLimit]);

add("成长统计", "成长明细", "逻辑校验", "P0", "间接客户脱敏",
  "验证间推成长明细不泄露完整客户标识",
  ["存在间接客户成长记录"],
  ["查看成长明细"],
  ["客户姓名仅首字符可见后缀 **，客户编号最多前 5 个字符后缀 **"],
  ["原型有描述：E2 间接客户脱敏", "代码：AgentCommissionRecordMapperXmlTest#mainCommissionDetailMasksIndirectCustomerNamesInSql；AgentCustomerPrivacyUtil", staticLimit]);

add("成长统计", "成长明细", "逻辑校验", "P1", "月份筛选",
  "验证成长明细按月份边界筛选",
  ["准备月初 00:00、月末、下月初 00:00 的佣金/消费记录"],
  ["选择目标月份"],
  ["包含目标月起始边界至下月起始前记录，不包含下月初记录"],
  ["原型有描述：成长明细月份筛选", "代码：AgentCommissionRecordMapper.xml 动态 month 条件", staticLimit]);

add("成长统计", "成长明细", "逻辑校验", "P1", "业务订单合并",
  "验证同一订单多个受益记录在客户明细中只形成一条业务记录",
  ["同一消费订单产生平台、成本、总池和多层代理记录"],
  ["查看该客户成长记录"],
  ["按真实付款人和业务订单聚合成一条记录，不按受益人行数重复展示消费金额"],
  ["原型有描述：E2 客户成长记录", "代码：AgentCommissionRecordMapperXmlTest#customerDetailUsesOneBusinessOrderRowForTheActualPayer", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "日维度补零",
  "验证日趋势固定返回 60 个连续周期并补零",
  ["60 日窗口内仅 2 天有佣金"],
  ["请求 day 维度佣金统计"],
  ["返回连续 60 个日周期，缺失日期 directAmount 和 indirectAmount 均为 0，周期按时间升序"],
  ["原型有描述：F1 成长趋势", "代码：CommissionController day size=60；AgentCommissionRecordServiceImpl fill missing periods", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "周维度补零",
  "验证周趋势固定返回 24 个周期",
  ["24 周窗口存在跨年周且部分周无佣金"],
  ["请求 week 维度统计"],
  ["返回连续 24 周，跨年周不串组，缺失周金额为 0"],
  ["原型有描述：F1 成长趋势", "代码：CommissionController week size=24；Mapper 按年+week 分组", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "月年维度数量",
  "验证月趋势 12 期和年趋势 6 期",
  ["准备跨月跨年的佣金数据"],
  ["分别请求 month 和 year 维度"],
  ["月维度返回 12 期且 periodStr=yyyy-MM；年维度返回 6 期且按年份连续"],
  ["原型有描述：F1 成长趋势", "代码：CommissionController month=12、year=6；AgentCommissionRecordServiceImpl", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "趋势首期",
  "验证序列首期趋势固定为 0",
  ["统计序列第一期金额大于 0"],
  ["请求任一维度统计"],
  ["第一期趋势值为 0，不因没有前一期而报错或显示无穷"],
  ["原型未描述：趋势计算细节", "代码：AgentCommissionRecordServiceImpl first trend=0", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "前期为零",
  "验证前期为零且本期有值时趋势为 100%",
  ["前一期总额=0，本期总额=100.00"],
  ["请求统计趋势"],
  ["本期趋势值为 1.00，即 100%"],
  ["原型未描述：零基数趋势", "代码：AgentCommissionRecordServiceImpl previous=0,current>0 ->1", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P1", "常规涨跌",
  "验证趋势按环比公式四舍五入到两位",
  ["前一期总额=200.00，本期总额=300.00"],
  ["请求统计趋势"],
  ["本期趋势=(300-200)/200=0.50，按两位小数返回"],
  ["原型未描述：趋势公式", "代码：AgentCommissionRecordServiceImpl divide scale4 HALF_UP 后 setScale2", staticLimit]);

add("成长统计", "佣金趋势统计", "逻辑校验", "P0", "回滚数据",
  "验证趋势统计排除已回滚佣金",
  ["某周期 RELEASED=100.00、ROLLED_BACK=80.00"],
  ["请求该周期佣金统计"],
  ["该周期总额为 100.00，不包含 80.00 回滚记录"],
  ["原型有描述：成长值不含已退款/回滚", "代码：AgentCommissionRecordMapper.java status<>rolled_back", staticLimit]);

add("成长统计", "客户列表成长值", "逻辑校验", "P0", "跨页面回滚一致性",
  "验证客户列表成长汇总与详情均排除已回滚金额",
  ["某客户 RELEASED=100.00、FROZEN=20.00、ROLLED_BACK=80.00"],
  ["分别查看客户列表行和客户详情"],
  ["两个页面的总成长值均为 120.00，不出现列表 200.00、详情 120.00 的不一致"],
  ["原型有描述：E1/E2 成长统计应一致", "代码检查：AgentInfoMapper.xml 客户详情显式排除 rolled_back；客户列表 growth_stat 需重点回归", "待验证：列表聚合 SQL 当前未见显式 rolled_back 过滤", staticLimit]);

// 8. 提现
add("提现", "F4 成长值提现", "业务流程", "P0", "申请提现",
  "验证提现申请将可用余额转为冻结余额",
  ["代理钱包 available=1000.00、frozen=100.00", "使用受支持收款方式", "提交金额 300.00"],
  ["确认提现"],
  ["生成 PENDING 提现记录；available=700.00、frozen=400.00，钱包总额仍为 1100.00"],
  ["原型有描述：F4 提现申请", "代码：AgentWithdrawRecordServiceImpl.java；AgentWalletMapper.applyWithdrawUpdateBalance", staticLimit]);

add("提现", "F4 成长值提现", "逻辑校验", "P0", "最小金额",
  "验证提现金额下限为 0.01",
  ["代理可用余额充足"],
  ["分别提交 0、0.001、0.01"],
  ["0 和 0.001 被拒绝；0.01 可进入后续收款与余额校验"],
  ["原型有描述：F4 提现金额", "代码：ApplyWithdrawInsertRequest @DecimalMin 0.01；客户端同样校验", staticLimit]);

add("提现", "F4 成长值提现", "逻辑校验", "P0", "余额不足",
  "验证提现金额超过可用余额时不冻结资金",
  ["钱包 available=100.00、frozen=20.00"],
  ["提交提现 100.01"],
  ["请求被拒绝，available 仍为 100.00、frozen 仍为 20.00，不生成 PENDING 记录"],
  ["原型有描述：F4 可用余额限制", "代码：AgentWithdrawRecordServiceImpl 余额校验；AgentWalletMapper sufficient balance guard", staticLimit]);

add("提现", "F4 成长值提现", "逻辑校验", "P0", "收款方式",
  "验证不支持的收款方式在变更钱包前被拒绝",
  ["钱包余额充足", "构造非支持 withdrawMethod"],
  ["提交提现"],
  ["请求在钱包扣减前被拒绝，余额与提现记录均不变化"],
  ["原型有描述：F4 收款方式", "代码：AgentWithdrawRecordServiceImplTest#defensivelyRejectsUnsupportedDirectWithdrawMethodBeforeChangingWallet", staticLimit]);

add("提现", "F4 成长值提现", "逻辑校验", "P1", "直接收款信息",
  "验证未选择已保存收款人时姓名和账号必填",
  ["不传 payeeId", "金额与方式有效"],
  ["分别缺少 payeeName 或 payeeAccount 提交"],
  ["请求被拒绝，不冻结余额；两字段完整时才可创建申请"],
  ["原型有描述：F4 收款信息", "代码：ApplyWithdrawInsertRequest；AgentWithdrawRecordServiceImpl", staticLimit]);

add("提现", "F4 成长值提现", "逻辑校验", "P0", "收款人归属",
  "验证不能使用其他代理保存的收款人",
  ["获取另一代理的 payeeId", "当前代理余额充足"],
  ["使用该 payeeId 提交提现"],
  ["请求被拒绝，不泄露收款人信息且不变更钱包"],
  ["原型未描述：收款人跨账号归属", "代码：AgentWithdrawRecordServiceImpl 按当前 agentId 查询 payee", staticLimit]);

add("提现", "F4 成长值提现", "功能需求", "P1", "最近收款人",
  "验证按提现方式自动回填上次收款人快照",
  ["当前代理 BANK_CARD 最近一次提现收款人为 A", "EWALLET 最近一次为 B"],
  ["选择 BANK_CARD", "再切换 EWALLET"],
  ["分别回填 A 和 B，不跨提现方式混用；从未使用的方式返回空"],
  ["原型有描述：F4 自动填写上次收款人", "代码：AgentWithdrawRecordServiceImplTest#returnsLastPayeeSnapshotForSelectedMethod/#returnsNull...", staticLimit]);

add("提现", "F5 提现详情", "业务流程", "P0", "审核完成",
  "验证待处理提现完成后扣减冻结余额",
  ["申请后钱包 available=700.00、frozen=400.00", "其中本次 PENDING 金额=300.00"],
  ["管理员将该记录审核为 COMPLETED"],
  ["记录变为 COMPLETED，frozen=100.00、available=700.00；写入审核时间和到账时间"],
  ["原型有描述：F5 提现到账", "代码：admin/.../AgentWithdrawRecordServiceImpl.java；AgentWalletMapper.completeWithdrawUpdateBalance", staticLimit]);

add("提现", "F5 提现详情", "业务流程", "P0", "审核拒绝",
  "验证待处理提现拒绝后冻结金额退回可用余额",
  ["申请后钱包 available=700.00、frozen=400.00", "本次 PENDING 金额=300.00"],
  ["管理员填写拒绝原因并审核为 REJECTED"],
  ["记录变为 REJECTED；available=1000.00、frozen=100.00，拒绝原因可在详情查看"],
  ["原型有描述：F5 提现详情", "代码：admin AgentWithdrawRecordServiceImpl；AgentWalletMapper.rejectWithdrawUpdateBalance", staticLimit]);

add("提现", "F5 提现详情", "逻辑校验", "P0", "拒绝原因",
  "验证拒绝提现必须填写原因且不会先动余额",
  ["存在 PENDING 提现"],
  ["管理员以空拒绝原因提交 REJECTED"],
  ["审核被拒绝，提现仍为 PENDING，钱包余额不变化"],
  ["原型未描述：拒绝原因必填", "代码：AgentWithdrawRecordServiceImplTest#rejectsBlankRejectionRemarkBeforeChangingWallet", staticLimit]);

add("提现", "F5 提现详情", "逻辑校验", "P0", "重复审核",
  "验证已完成或已拒绝提现不能再次处理",
  ["提现状态已为 COMPLETED 或 REJECTED"],
  ["再次提交完成或拒绝"],
  ["请求被拒绝，状态、审核时间和钱包余额保持不变"],
  ["原型有描述：F5 状态展示", "代码：admin AgentWithdrawRecordServiceImpl 仅 PENDING 可处理", staticLimit]);

add("提现", "F4 成长值提现", "异常用例", "P0", "并发申请",
  "验证并发提现不会透支可用余额",
  ["钱包 available=500.00", "准备两笔各 400.00 的申请"],
  ["并发提交两笔提现"],
  ["最多一笔成功；最终 available>=0，成功金额进入 frozen，不出现总计冻结 800.00"],
  ["原型未描述：并发提现", "代码：AgentWalletMapper optimistic version 与 available>=amount 条件", staticLimit]);

add("提现", "F5 提现详情", "异常用例", "P0", "详情归属",
  "验证不能查看其他代理的提现详情",
  ["获取另一代理的 withdrawId"],
  ["当前代理直接请求该提现详情"],
  ["返回资源不存在或等价拒绝，不返回收款姓名、账号和金额"],
  ["原型有描述：F5 提现详情、K4 无权限", "代码：AgentWithdrawRecordServiceImpl detail constrained by current agent", staticLimit]);

add("提现", "提现记录列表", "功能需求", "P1", "记录字段",
  "验证提现列表状态金额和收款快照与申请一致",
  ["当前代理存在 PENDING、COMPLETED、REJECTED 记录"],
  ["进入提现记录列表并打开详情"],
  ["每条记录展示申请时的金额、方式、收款人快照和正确状态；后续修改收款账户不篡改历史记录"],
  ["原型有描述：F5 提现详情", "代码：AgentWithdrawRecordServiceImpl page/detail response；客户端 WithdrawRecordModel", staticLimit]);

add("提现", "F4/F5 提现金额", "逻辑校验", "P1", "金额精度",
  "验证超过两位小数的提现金额处理口径",
  ["钱包余额充足"],
  ["提交提现金额 10.001"],
  ["系统按最终确认的产品口径明确拒绝或统一舍入，且申请记录、钱包扣减和审核金额三者完全一致"],
  ["原型未描述：金额小数位", "代码：当前请求仅见最小值校验，未见 @Digits", "待确认：是否强制两位小数以及舍入方式", staticLimit]);

add("提现", "F4/F5 提现单位", "逻辑校验", "P0", "币种单位",
  "验证提现页接口记录和消息使用同一金额单位",
  ["准备可识别金额 123.45"],
  ["查看成长概览", "申请提现", "查看提现详情和到账消息"],
  ["四处显示数值与单位一致，不发生 100 倍换算或 POC/元混用"],
  ["原型有描述：F1/F4 使用 POC", "代码注释：ApplyWithdrawInsertRequest 金额单位写“元”", "待确认：代理成长值与提现的法定单位、兑换关系及展示文案", staticLimit]);

// 9. 跨页面、跨状态一致性
add("跨页面一致性", "首页→客户列表", "业务流程", "P0", "客户总数",
  "验证首页累计客户与客户列表总数一致",
  ["当前代理关系树稳定，无并发新增客户"],
  ["记录首页累计客户数", "进入客户列表全部标签并记录总数"],
  ["两处均按 1 至 3 层 distinct agent_id 统计，数值一致"],
  ["原型有描述：D1 首页、E1 客户列表联动", "代码：两处均基于 current agent customer_tree", staticLimit]);

add("跨页面一致性", "首页→客户详情→订单详情", "业务流程", "P0", "订单数据",
  "验证订单笔数和金额在三处使用同一业务口径",
  ["客户有正常、部分退款、全额退款和重复流水订单"],
  ["记录首页订单数", "查看客户详情订单数和消费额", "打开直接客户订单详情"],
  ["订单去重、退款净额和单笔明细可相互核对，不因流水或佣金行数导致统计放大"],
  ["原型有描述：D1/E2/E4 跨页链路", "代码：AgentPaidOrderCte、AgentOrderMapper.xml", staticLimit]);

add("跨页面一致性", "订单→成长概览→客户详情", "业务流程", "P0", "佣金生命周期",
  "验证订单从冻结到发放后所有页面同步更新",
  ["订单已生成 FROZEN 佣金"],
  ["记录首页、成长概览和客户详情的待发放金额", "推进到期结算", "刷新三个页面"],
  ["待发放同时减少、已发放和可用余额同时增加；总成长值在状态转换前后保持不变"],
  ["原型有描述：D1/F1/E2 数据联动", "代码：佣金状态与钱包更新服务、各查询 Mapper", staticLimit]);

add("跨页面一致性", "退款→统计回滚", "业务流程", "P0", "全额退款",
  "验证全额退款后所有成长统计同步剔除",
  ["订单佣金曾出现在首页、客户列表、客户详情和成长趋势"],
  ["执行全额退款并完成回滚", "刷新相关页面"],
  ["各页面均不再把回滚金额计入成长值，客户历史订单仍按明确口径保留且消费净额为 0"],
  ["原型有描述：E4 退款、D1/F1/E2 统计", "代码：ROLLED_BACK 排除逻辑；客户列表聚合需重点回归", staticLimit]);

add("跨页面一致性", "提现→消息→详情", "业务流程", "P1", "提现通知",
  "验证提现完成或拒绝后消息和详情状态一致",
  ["存在 PENDING 提现并已加载首页未读数"],
  ["管理员完成或拒绝提现", "代理刷新首页并打开消息与提现详情"],
  ["消息事件、未读数、提现状态、金额及拒绝原因/到账时间一致，点击消息进入对应详情"],
  ["原型有描述：H1 消息中心可跳 F5 提现详情", "代码：提现审核服务写消息；首页按 accountId 统计未读", staticLimit]);

const outputPath = path.resolve(process.argv[2] || "test-cases.json");
await fs.mkdir(path.dirname(outputPath), { recursive: true });
const payload = normalizeTestcasePayload(cases);
await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");

const byModule = Object.fromEntries(
  [...new Set(payload.测试用例.map((item) => item.功能模块))].map((module) => [
    module,
    payload.测试用例.filter((item) => item.功能模块 === module).length,
  ]),
);
console.log(JSON.stringify({
  outputPath,
  count: payload.测试用例.length,
  pendingCount: payload.需求待确认.length,
  byModule,
}, null, 2));
