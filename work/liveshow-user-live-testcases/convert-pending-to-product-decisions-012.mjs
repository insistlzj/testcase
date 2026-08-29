import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import JSZip from "jszip";

const workDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(workDir, "../..");
const workbookPath = path.join(rootDir, "outputs/Luma Live-case/用户App-直播模块-260828-012.xlsx");

const headers = [
  "问题编号", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议",
  "产品结论", "已知依据", "影响范围", "影响用例", "负责人", "期望确认时间", "确认状态",
];
const blockLevels = ["阻塞测试", "部分阻塞", "不阻塞"];
const categories = [
  "需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理",
  "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则",
];
const owners = ["产品", "交互", "技术", "多方确认"];
const statuses = ["待确认", "确认中", "已确认", "无需处理"];

const groups = [
  {
    root: "Q-001",
    basis: ["项目需求清单写明热门、新人、关注 3 个 Tab", "静态原型仅有热门、新人 Tab，关注主播位于顶部独立区域"],
    items: [
      {
        block: "部分阻塞", scenario: "观众进入直播广场查看已关注且正在直播的主播", category: "交互与文案规则",
        question: "关注直播应使用第三个 Tab 还是顶部独立区域？",
        options: ["A. 使用第三个“关注”Tab", "B. 使用顶部独立区域", "C. Tab 和顶部区域同时保留"],
        recommendation: "建议 B；与当前原型结构一致，用户进入广场即可看到关注主播。",
        scope: ["直播广场信息架构", "关注直播入口"], cases: ["关注直播入口", "直播广场导航"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "关注主播存在多个同时在播房间", category: "业务规则",
        question: "关注直播列表采用哪一种排序规则？",
        options: ["A. 沿用热门直播排序规则", "B. 按开播时间倒序", "C. 单独配置关注直播排序权重", "D. 其他：请补充排序规则"],
        recommendation: "建议 A；复用现有口径可以减少新增排序规则和跨页面差异。",
        scope: ["关注直播列表", "直播广场排序"], cases: ["关注直播多房间排序"], owner: "产品",
      },
      {
        block: "不阻塞", scenario: "用户没有任何已关注且正在直播的主播", category: "交互与文案规则",
        question: "关注直播为空时页面采用哪一种展示方式？",
        options: ["A. 展示空态并提供发现主播入口", "B. 展示空态且不提供跳转", "C. 直接展示平台推荐直播"],
        recommendation: "建议 A；既说明当前没有关注直播，也保留可继续浏览的路径。",
        scope: ["关注直播空态"], cases: ["关注直播空态", "空态操作入口"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-002",
    basis: ["项目需求清单写 WhatsApp、Facebook、Instagram", "业务沟通记录提出 WhatsApp、Facebook、TikTok 且不要 Instagram"],
    items: [
      {
        block: "阻塞测试", scenario: "观众从直播间打开外部分享面板", category: "需求范围",
        question: "当前版本最终支持哪一组外部分享平台？",
        options: ["A. WhatsApp、Facebook、Instagram", "B. WhatsApp、Facebook、TikTok", "C. 仅 WhatsApp 和 Facebook", "D. 其他：请补充平台范围"],
        recommendation: "建议 B；采用最新沟通提出的范围，但需产品明确其是否已替代正式需求。",
        scope: ["直播间外部分享", "分享平台图标和跳转"], cases: ["分享渠道展示", "外部平台跳转"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "用户选择设备未安装的外部分享应用", category: "异常处理",
        question: "目标分享应用未安装时应执行哪一种处理？",
        options: ["A. 提示未安装并停留在直播间", "B. 跳转应用商店", "C. 改为复制直播链接", "D. 其他：请补充处理方式"],
        recommendation: "建议 A；不会强制离开直播间，失败结果也最容易识别。",
        scope: ["外部分享失败处理"], cases: ["分享应用未安装"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "已打开外部应用但分享回调返回失败", category: "异常处理",
        question: "外部分享失败后直播 App 应如何反馈？",
        options: ["A. 回到直播间并提示分享失败", "B. 回到直播间且不提示", "C. 停留在外部应用", "D. 其他：请补充反馈"],
        recommendation: "建议 A；用户可以明确区分分享成功、取消和失败。",
        scope: ["外部分享回调", "直播间反馈"], cases: ["分享回调失败", "分享取消"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-003",
    basis: ["开播设置原型提示密码为 4 至 12 位", "主播密码房批注和观众输入原型使用 8 位数字"],
    items: [
      {
        block: "阻塞测试", scenario: "主播创建或修改密码房密码", category: "字段与数据校验",
        question: "房间密码最终采用哪一套长度和字符规则？",
        options: ["A. 固定 8 位数字", "B. 4 至 12 位数字", "C. 4 至 12 位字母或数字", "D. 其他：请补充完整规则"],
        recommendation: "建议 A；与修改密码和进房原型一致，规则单一且便于私下传递。",
        scope: ["创建密码房", "直播中修改密码", "观众输入密码"], cases: ["LIVE-030 至 LIVE-035", "LIVE-099", "LIVE-179", "LIVE-184", "LIVE-193"], owner: "产品",
      },
      {
        block: "阻塞测试", scenario: "同一密码在开播设置、直播中修改和观众进房三个入口使用", category: "跨端与跨模块一致性",
        question: "三个密码入口是否必须使用完全相同的校验规则？",
        options: ["A. 三个入口统一使用同一规则", "B. 创建密码与修改密码使用不同规则", "C. 观众输入兼容旧规则", "D. 其他：请补充适用关系"],
        recommendation: "建议 A；避免主播可保存但观众无法输入的跨入口冲突。",
        scope: ["密码配置和进房校验一致性"], cases: ["密码创建、修改和输入边界"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-004",
    basis: ["需求和原型仅明确门票价格必填", "资料未定义上下限、精度和前导零"],
    items: [
      {
        block: "阻塞测试", scenario: "主播设置门票房金币价格", category: "字段与数据校验",
        question: "门票价格最终采用哪一套数值规则？",
        options: ["A. 仅允许大于 0 的整数金币", "B. 允许 0 或正整数金币", "C. 允许最多两位小数的正数", "D. 其他：请补充最小值、最大值和精度"],
        recommendation: "建议 A；金币余额和消费流水均使用整数口径，能避免精度和舍入争议。",
        scope: ["门票房设置", "购票扣款和消费流水"], cases: ["LIVE-016 至 LIVE-025", "LIVE-098", "LIVE-178", "LIVE-210"], owner: "产品",
      },
      {
        block: "不阻塞", scenario: "主播输入不符合门票价格规则的内容", category: "交互与文案规则",
        question: "非法门票价格采用哪一种反馈方式？",
        options: ["A. 字段下方提示并保留输入", "B. Toast 提示并保留输入", "C. 自动修正为合法值", "D. 其他：请补充反馈"],
        recommendation: "建议 A；错误位置明确，主播可以直接修改原输入。",
        scope: ["门票价格字段校验反馈"], cases: ["门票价格等价类和边界"], owner: "交互",
      },
    ],
  },
  {
    root: "Q-005",
    basis: ["项目需求要求开播前和观看中支持多档清晰度", "当前开播设置原型未展示清晰度控件"],
    items: [
      {
        block: "部分阻塞", scenario: "主播开播前选择直播清晰度", category: "业务规则",
        question: "开播清晰度采用哪一套档位和默认策略？",
        options: ["A. 固定档位并使用中间档为默认", "B. 固定档位并使用自动档为默认", "C. 档位由后台配置且必须指定默认值", "D. 当前版本不提供开播前选择"],
        recommendation: "建议 C；可以适配不同设备和地区网络，同时保留明确默认值。",
        scope: ["开播设置", "推流参数"], cases: ["开播清晰度档位", "默认清晰度"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "直播中网络质量发生变化", category: "流程与状态",
        question: "网络变化时清晰度是否自动切换？",
        options: ["A. 自动降级且网络恢复后自动升级", "B. 仅自动降级，恢复由用户选择", "C. 始终由用户手动切换", "D. 其他：请补充切换规则"],
        recommendation: "建议 B；优先保证播放连续性，同时避免恢复时频繁自动切换。",
        scope: ["观看中清晰度切换", "断流恢复"], cases: ["LIVE-011 至 LIVE-013"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-006",
    basis: ["项目需求要求公屏接入后台敏感词库", "资料未描述命中后的具体处理"],
    items: [
      {
        block: "阻塞测试", scenario: "观众发送命中敏感词库的公屏消息", category: "业务规则",
        question: "敏感词命中后消息采用哪一种处理？",
        options: ["A. 阻止整条消息发送", "B. 替换敏感内容后发送", "C. 消息进入审核后再展示", "D. 其他：请补充处理方式"],
        recommendation: "建议 A；违规内容不会先进入公屏，结果也最明确。",
        scope: ["公屏发送", "内容安全"], cases: ["敏感词发送结果"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "消息包含大小写、空格或变形的敏感内容", category: "业务规则",
        question: "敏感词库采用哪一种匹配方式？",
        options: ["A. 仅精确匹配", "B. 忽略大小写和常见分隔符", "C. 使用模糊匹配和变形识别", "D. 由后台词条配置匹配类型"],
        recommendation: "建议 D；不同词条风险不同，配置化比统一模糊规则更可控。",
        scope: ["敏感词匹配", "后台词库配置"], cases: ["敏感词组合和变形边界"], owner: "多方确认",
      },
      {
        block: "不阻塞", scenario: "用户发送的消息因敏感词规则未进入公屏", category: "交互与文案规则",
        question: "敏感词拦截后用户端采用哪一种反馈？",
        options: ["A. 提示内容包含敏感词并保留输入", "B. 提示发送失败并清空输入", "C. 不提示，仅不展示消息", "D. 其他：请补充反馈"],
        recommendation: "建议 A；用户能理解失败原因并修改内容。",
        scope: ["公屏发送反馈"], cases: ["敏感词拦截提示", "输入框状态"], owner: "交互",
      },
    ],
  },
  {
    root: "Q-007",
    basis: ["项目需求写禁言时长可选", "权限规则写本场次到期或主播解除", "当前原型只有开关"],
    items: [
      {
        block: "阻塞测试", scenario: "主播或房管对直播间用户执行禁言", category: "流程与状态",
        question: "直播间禁言采用哪一套时长和默认规则？",
        options: ["A. 仅本场次有效且默认至直播结束", "B. 提供固定时长选项并默认最短时长", "C. 提供固定时长选项并默认至直播结束", "D. 其他：请补充时长集合和默认值"],
        recommendation: "建议 C；既满足时长可选，也与现有本场次作用域一致。",
        scope: ["主播禁言", "房管禁言", "禁言到期"], cases: ["LIVE-043 至 LIVE-044", "LIVE-079 至 LIVE-082", "LIVE-135 至 LIVE-137"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "禁言尚未到期或到期后恢复发言", category: "角色与权限",
        question: "禁言解除采用哪一种权限和恢复模型？",
        options: ["A. 仅主播可提前解除，到期自动恢复", "B. 主播和执行禁言的房管可提前解除，到期自动恢复", "C. 主播和任意房管均可提前解除", "D. 其他：请补充解除权限"],
        recommendation: "建议 A；长期权限变更由主播控制，房管仍可执行即时管理。",
        scope: ["解除禁言权限", "禁言到期恢复"], cases: ["LIVE-183", "LIVE-205", "LIVE-209"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-008",
    basis: ["正式需求写长按消息后二次确认", "原型批注写点击评论后出现按钮并直接移除"],
    items: [
      {
        block: "部分阻塞", scenario: "主播或房管定位需要屏蔽的单条评论", category: "交互与文案规则",
        question: "屏蔽指定评论应使用哪一种触发手势？",
        options: ["A. 长按评论", "B. 单击评论后选择屏蔽", "C. 评论右侧常驻更多按钮", "D. 其他：请补充手势"],
        recommendation: "建议 A；与正式需求一致，并降低误触概率。",
        scope: ["主播评论处置", "房管评论处置"], cases: ["屏蔽评论入口"], owner: "交互",
      },
      {
        block: "部分阻塞", scenario: "用户已经触发屏蔽指定评论操作", category: "流程与状态",
        question: "移除评论前是否必须二次确认？",
        options: ["A. 必须二次确认", "B. 直接移除并提供短暂撤销", "C. 直接移除且不可撤销"],
        recommendation: "建议 A；与正式需求一致，并避免不可恢复的误操作。",
        scope: ["评论屏蔽确认", "取消屏蔽操作"], cases: ["主播或房管屏蔽评论", "取消屏蔽确认"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-009",
    basis: ["权限规则只授权房管踢人、禁言和屏蔽评论", "观众资料卡原型在房管操作区展示“拉黑”"],
    items: [
      {
        block: "阻塞测试", scenario: "房管打开直播间观众资料卡", category: "角色与权限",
        question: "房管是否拥有拉黑用户的权限？",
        options: ["A. 房管没有拉黑权限", "B. 房管可以执行直播间黑名单", "C. 房管可以执行账号拉黑", "D. 房管可选择两种拉黑"],
        recommendation: "建议 A；与权限规则一致，永久关系操作保留给主播。",
        scope: ["房管资料卡权限", "直播间秩序管理"], cases: ["LIVE-078", "房管拉黑权限"], owner: "产品",
      },
      {
        block: "阻塞测试", scenario: "产品确认房管拥有拉黑权限后执行拉黑", category: "业务规则",
        question: "房管拉黑应写入哪一种黑名单？",
        options: ["A. 仅直播间黑名单", "B. 账号黑名单", "C. 同时写入两层黑名单", "D. 操作时由房管选择"],
        recommendation: "建议 A；房管职责限于直播间管理，不应改变账号级社交关系。",
        scope: ["直播间黑名单", "账号拉黑"], cases: ["房管拉黑作用域"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "房管已将用户加入允许的黑名单层级", category: "流程与状态",
        question: "房管拉黑记录采用哪一种存续和解除规则？",
        options: ["A. 长期有效且仅主播可解除", "B. 仅本场有效且结束直播自动解除", "C. 长期有效且主播或房管可解除", "D. 其他：请补充规则"],
        recommendation: "建议 A；若采用直播间黑名单，应与主播已有长期黑名单口径一致。",
        scope: ["拉黑存续", "解除入口"], cases: ["房管拉黑跨场限制", "房管拉黑解除"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-010",
    basis: ["业务口径定义直播间黑名单和账号拉黑两层独立关系", "主播资料卡原型仅展示一个“拉黑”按钮"],
    items: [
      {
        block: "阻塞测试", scenario: "主播从观众资料卡执行拉黑", category: "业务规则",
        question: "主播资料卡的拉黑入口应对应哪一种业务操作？",
        options: ["A. 单一入口默认加入直播间黑名单", "B. 单一入口默认执行账号拉黑", "C. 一个入口后选择黑名单层级", "D. 拆成两个独立按钮"],
        recommendation: "建议 D；两层后果差异明显，独立入口最不容易误操作。",
        scope: ["主播资料卡", "两层黑名单"], cases: ["LIVE-140 至 LIVE-148"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "主播确认执行任一层级的拉黑操作", category: "交互与文案规则",
        question: "拉黑生效前采用哪一种确认方式？",
        options: ["A. 每种拉黑均二次确认并说明后果", "B. 仅账号拉黑需要二次确认", "C. 两种拉黑均直接生效", "D. 其他：请补充确认方式"],
        recommendation: "建议 A；永久限制和社交影响需要在操作前明确告知。",
        scope: ["拉黑确认弹窗", "风险说明"], cases: ["主播拉黑确认", "取消拉黑"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "主播需要解除已经建立的黑名单关系", category: "流程与状态",
        question: "两层黑名单应从哪里分别解除？",
        options: ["A. 均在统一黑名单管理页分层解除", "B. 直播间黑名单在主播中心解除，账号拉黑在个人设置解除", "C. 均从目标用户资料卡解除", "D. 其他：请补充入口"],
        recommendation: "建议 A；统一入口便于查看层级和避免漏解除。",
        scope: ["直播间黑名单解除", "账号拉黑解除"], cases: ["LIVE-142", "LIVE-146 至 LIVE-148"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-011",
    basis: ["互动权限规则写账号拉黑不解除既有关注", "角色与用例文档写观众拉黑主播会取消关注"],
    items: [
      {
        block: "阻塞测试", scenario: "已关注主播的观众执行账号拉黑", category: "业务规则",
        question: "账号拉黑主播后既有关注关系是否取消？",
        options: ["A. 自动取消关注", "B. 保留关注关系但隐藏直播内容", "C. 保留关注关系且仅限制互动", "D. 其他：请补充关系变化"],
        recommendation: "建议 A；避免用户继续收到已拉黑主播的开播提醒。",
        scope: ["账号拉黑", "关注关系", "开播提醒"], cases: ["观众拉黑主播后的关注状态"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "观众解除对主播的账号拉黑", category: "配置和历史数据影响",
        question: "解除拉黑后原关注关系是否自动恢复？",
        options: ["A. 不恢复，用户需要重新关注", "B. 自动恢复拉黑前的关注关系", "C. 弹窗询问是否恢复关注"],
        recommendation: "建议 A；关系变更过程清晰，不会在用户不知情时重新关注。",
        scope: ["解除拉黑", "历史关注关系"], cases: ["解除拉黑后的关注状态"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-012",
    basis: ["项目需求明确礼物支持选择数量和连击", "资料未给出数量边界、连击窗口和部分成功规则"],
    items: [
      {
        block: "部分阻塞", scenario: "用户在礼物面板选择赠送数量", category: "字段与数据校验",
        question: "礼物数量采用哪一种可选范围？",
        options: ["A. 仅允许后台配置的固定数量", "B. 允许用户输入正整数并设置上限", "C. 固定数量和自定义数量同时支持", "D. 其他：请补充最小值和最大值"],
        recommendation: "建议 A；与当前原型的固定数量选项一致，能限制异常大额操作。",
        scope: ["礼物数量选择", "扣费和收益计算"], cases: ["LIVE-050 至 LIVE-060"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "用户连续点击赠送同一种礼物", category: "业务规则",
        question: "连续赠送采用哪一种连击时间规则？",
        options: ["A. 固定时间窗内累计，超时重新计数", "B. 每次成功后重新开始时间窗", "C. 不设时间窗，仅按连续操作累计", "D. 其他：请补充时间规则"],
        recommendation: "建议 B；用户每次成功赠送后都有完整的继续连击时间。",
        scope: ["礼物连击展示", "连续赠送"], cases: ["LIVE-058 至 LIVE-060"], owner: "产品",
      },
      {
        block: "阻塞测试", scenario: "用户余额只能支付所选礼物数量的一部分", category: "业务规则",
        question: "余额不足以完成整次赠送时是否允许部分成功？",
        options: ["A. 整次失败且不扣费", "B. 按余额可支付数量部分成功", "C. 引导充值后保留本次赠送", "D. 其他：请补充处理方式"],
        recommendation: "建议 A；交易原子性最清晰，也便于核对扣款和收益。",
        scope: ["赠礼扣款", "主播收益", "消费流水"], cases: ["LIVE-055 至 LIVE-057"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "用户快速重复点击礼物赠送按钮", category: "异常处理",
        question: "重复赠送请求采用哪一种幂等和流水模型？",
        options: ["A. 每次点击独立请求并生成独立流水", "B. 时间窗内合并为一笔请求和一条流水", "C. 处理中禁用按钮且只接受一次请求", "D. 其他：请补充模型"],
        recommendation: "建议 C；可以避免网络延迟导致的非预期重复扣款。",
        scope: ["赠礼重复提交", "消费流水"], cases: ["礼物重复点击", "重复请求去重"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-013",
    basis: ["原型支持五类举报原因和 200 字补充说明", "需求只说明举报联动后台审核处置"],
    items: [
      {
        block: "部分阻塞", scenario: "同一举报人短时间内重复提交举报", category: "业务规则",
        question: "直播举报采用哪一种频率限制？",
        options: ["A. 同一对象在固定时间窗内只允许一次", "B. 每日限制提交次数", "C. 不限制次数但后台做风险控制", "D. 其他：请补充频控规则"],
        recommendation: "建议 A；可以减少同一事件重复工单，同时保留后续时段重新举报能力。",
        scope: ["直播间举报", "用户举报"], cases: ["重复举报频控"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "同一用户对同一对象重复举报", category: "流程与状态",
        question: "重复举报记录采用哪一种合并方式？",
        options: ["A. 合并到原工单并累计次数", "B. 每次生成独立工单", "C. 拒绝重复举报且不新增记录", "D. 其他：请补充方式"],
        recommendation: "建议 A；后台可以看到举报热度，又不会产生大量重复工单。",
        scope: ["举报工单", "后台审核"], cases: ["重复举报记录"], owner: "多方确认",
      },
      {
        block: "不阻塞", scenario: "举报人需要补充文字之外的证据", category: "需求范围",
        question: "当前版本举报是否支持上传附件？",
        options: ["A. 当前版本不支持附件", "B. 支持图片附件", "C. 支持图片和视频附件", "D. 其他：请补充附件范围"],
        recommendation: "建议 A；当前原型没有附件入口，可将附件能力作为后续独立需求。",
        scope: ["举报表单", "举报证据"], cases: ["举报附件入口和上传"], owner: "产品",
      },
      {
        block: "不阻塞", scenario: "后台完成举报工单处置", category: "跨端与跨模块一致性",
        question: "举报处置结果是否通知举报人？",
        options: ["A. 通知最终处置结果", "B. 仅通知工单已受理", "C. 不向举报人回告", "D. 其他：请补充通知规则"],
        recommendation: "建议 B；确认平台已处理请求，同时避免暴露具体处罚细节。",
        scope: ["后台审核", "App 通知"], cases: ["举报受理通知", "举报结果通知"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-014",
    basis: ["需求要求创建直播场次并发送开播提醒", "资料未定义重复请求、推流失败或提醒失败的补偿"],
    items: [
      {
        block: "部分阻塞", scenario: "主播快速重复点击开始直播", category: "异常处理",
        question: "重复开播请求采用哪一种幂等处理？",
        options: ["A. 处理中禁用按钮且只创建一个场次", "B. 服务端按主播和时间窗去重", "C. 重复请求返回已有场次", "D. 其他：请补充幂等规则"],
        recommendation: "建议 A；端上反馈直接，服务端仍应保证最终只存在一个场次。",
        scope: ["开播按钮", "直播场次创建"], cases: ["LIVE-107 至 LIVE-110", "重复开播"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "开播请求长时间没有返回结果", category: "异常处理",
        question: "开播超时后页面采用哪一种状态？",
        options: ["A. 提示超时并提供查询结果入口", "B. 提示失败并允许直接重试", "C. 保持处理中直到服务端返回", "D. 其他：请补充终态"],
        recommendation: "建议 A；先查询是否已创建场次可以降低重复开播风险。",
        scope: ["开播处理中", "超时恢复"], cases: ["开播超时", "超时后查询"], owner: "多方确认",
      },
      {
        block: "阻塞测试", scenario: "直播场次已创建但推流 SDK 启动失败", category: "异常处理",
        question: "场次创建后推流失败采用哪一种补偿？",
        options: ["A. 关闭场次并允许重新开播", "B. 保留场次并在原场次重试推流", "C. 将场次标记异常并等待人工处理", "D. 其他：请补充补偿"],
        recommendation: "建议 B；可以保留已生成的场次对象，避免重复入口和提醒。",
        scope: ["直播场次", "推流 SDK"], cases: ["开播部分成功", "推流失败恢复"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "直播场次和观看入口已成功但开播提醒发送失败", category: "跨端与跨模块一致性",
        question: "开播提醒失败是否影响直播场次继续进行？",
        options: ["A. 直播继续，提醒异步重试", "B. 直播继续且不重试提醒", "C. 关闭直播场次", "D. 其他：请补充处理方式"],
        recommendation: "建议 A；提醒是附属链路，不应阻断已成功的直播主流程。",
        scope: ["直播场次", "关注用户提醒"], cases: ["LIVE-109 至 LIVE-110", "提醒失败补偿"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-015",
    basis: ["当前需求、角色用例和原型包含两人连麦", "早期沟通提出 PK 和多人房放到二期"],
    items: [
      {
        block: "阻塞测试", scenario: "确定当前版本直播验收范围", category: "需求范围",
        question: "两位主播视频连麦是否纳入当前版本验收？",
        options: ["A. 纳入当前版本", "B. 延后到下一期", "C. 仅保留入口但不验收完整流程"],
        recommendation: "建议 A；当前需求、角色用例和原型均已形成完整两人连麦流程。",
        scope: ["主播连麦全流程"], cases: ["LIVE-158 至 LIVE-175", "LIVE-187 至 LIVE-203"], owner: "产品",
      },
      {
        block: "阻塞测试", scenario: "确定当前版本 PK 能力范围", category: "需求范围",
        question: "带胜负或对战规则的 PK 是否纳入当前版本验收？",
        options: ["A. 纳入当前版本并补充完整 PK 规则", "B. 当前版本仅支持视频连麦，不支持 PK", "C. PK 入口展示但暂不可用"],
        recommendation: "建议 B；现有证据只有两人分屏连麦，没有胜负和计分规则。",
        scope: ["PK 入口", "PK 业务规则"], cases: ["PK 发起和结束", "特殊房型 PK 限制"], owner: "产品",
      },
      {
        block: "不阻塞", scenario: "普通房主播打开两人互动入口", category: "交互与文案规则",
        question: "当前版本入口统一使用“连麦”还是“PK”？",
        options: ["A. 统一使用“连麦”", "B. 统一使用“PK”", "C. 按实际能力分别展示两个入口"],
        recommendation: "建议 A；当前可验证能力是两位主播视频连麦，不包含完整 PK 规则。",
        scope: ["主播直播间入口文案", "连麦面板标题"], cases: ["LIVE-158", "LIVE-187", "LIVE-191"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-016",
    basis: ["角色与用例文档将删除好友后的后续场次私信保留为待确认", "完全阻断关系已有账号拉黑能力"],
    items: [
      {
        block: "部分阻塞", scenario: "主播和观众删除好友后进入后续直播场次", category: "业务规则",
        question: "主播在后续直播场次是否可以再次发起直播间私信？",
        options: ["A. 下一场直播可以重新发起", "B. 删除好友后持续禁止，直到重新成为好友", "C. 当前场次禁止，经过新的自然日后恢复", "D. 其他：请补充恢复条件"],
        recommendation: "建议 A；直播间私信属于场次经营能力，完全阻断可由账号拉黑承担。",
        scope: ["直播间私信", "好友关系"], cases: ["LIVE-120 至 LIVE-124", "删除好友后的后续场次私信"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-017",
    basis: ["需求要求设置直播封面", "静态原型只限制 image/*，没有业务校验"],
    items: [
      {
        block: "部分阻塞", scenario: "主播从本地选择直播封面文件", category: "字段与数据校验",
        question: "直播封面允许上传哪些文件格式和大小？",
        options: ["A. JPG 或 PNG，使用统一大小上限", "B. 支持所有 image/*，使用统一大小上限", "C. 格式和大小由后台配置", "D. 其他：请补充格式和大小"],
        recommendation: "建议 A；常用格式兼容性高，也便于控制文件解析风险。",
        scope: ["开播封面上传"], cases: ["LIVE-094", "封面格式和大小边界"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "主播上传不同尺寸或比例的直播封面", category: "业务规则",
        question: "不符合目标比例的封面采用哪一种处理？",
        options: ["A. 进入裁剪页后保存", "B. 自动居中裁剪", "C. 拒绝上传并提示目标比例", "D. 保持原图比例展示"],
        recommendation: "建议 A；主播可以确认最终展示区域，减少关键内容被自动截断。",
        scope: ["封面尺寸", "封面裁剪"], cases: ["封面尺寸和比例"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "直播封面命中内容审核规则", category: "流程与状态",
        question: "封面审核不通过时采用哪一种业务结果？",
        options: ["A. 不允许开播并要求更换封面", "B. 使用平台默认封面继续开播", "C. 允许开播后进入人工审核", "D. 其他：请补充处理方式"],
        recommendation: "建议 A；违规封面不会先进入直播广场。",
        scope: ["封面审核", "开始直播"], cases: ["封面审核失败", "开播拦截"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-018",
    basis: ["原型保存后提示“房间密码已修改”", "角色用例说明后续进房使用新密码"],
    items: [
      {
        block: "阻塞测试", scenario: "密码房主播在直播中保存新密码", category: "配置和历史数据影响",
        question: "新密码从哪个时点开始用于进房校验？",
        options: ["A. 保存成功后立即生效", "B. 主播关闭设置面板后生效", "C. 下一位新观众请求进房时生效", "D. 下一场直播生效"],
        recommendation: "建议 A；成功提示与实际生效时点一致，安全边界最清晰。",
        scope: ["直播中修改密码", "密码进房校验"], cases: ["LIVE-034", "LIVE-035", "LIVE-184", "LIVE-193"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "主播修改密码时观众已经在密码房内观看", category: "配置和历史数据影响",
        question: "已在房间内的观众是否需要重新验证新密码？",
        options: ["A. 不受影响，继续观看", "B. 立即要求重新验证", "C. 下一次重新进入时验证新密码"],
        recommendation: "建议 C；不中断当前观看，同时保证后续进房使用新密码。",
        scope: ["已在房观众", "重新进房"], cases: ["密码修改后的在房观众", "密码修改后重新进入"], owner: "产品",
      },
      {
        block: "阻塞测试", scenario: "观众已打开密码面板但尚未提交，主播此时保存新密码", category: "流程与状态",
        question: "观众随后提交旧密码时应按哪一种规则处理？",
        options: ["A. 旧密码立即失效", "B. 当前已打开面板允许旧密码使用一次", "C. 新旧密码在短暂时间窗内均有效", "D. 其他：请补充并发规则"],
        recommendation: "建议 A；不存在双密码并存窗口，规则最容易理解和验证。",
        scope: ["密码修改并发", "旧密码失效"], cases: ["LIVE-034", "并发提交旧密码"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "密码房已配置粉丝授权可见名单，主播只修改密码", category: "配置和历史数据影响",
        question: "修改密码后原授权可见名单是否保留？",
        options: ["A. 完整保留原名单", "B. 清空名单并要求重新授权", "C. 弹窗让主播选择是否保留"],
        recommendation: "建议 A；修改进房凭证不应无提示改变房间可见范围。",
        scope: ["密码房授权名单", "直播广场可见入口"], cases: ["LIVE-100", "LIVE-101", "LIVE-179"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-019",
    basis: ["动态原型对部分关键写操作提供成功提示", "部分操作只通过页面状态变化反馈"],
    items: [
      {
        block: "不阻塞", scenario: "用户完成直播模块中的关键写操作", category: "交互与文案规则",
        question: "哪些操作必须额外展示结果提示？",
        options: ["A. 仅没有持久可见结果的操作", "B. 所有写操作", "C. 仅支付、配置和管理操作", "D. 由各功能单独定义"],
        recommendation: "建议 A；避免重复提示，又能覆盖用户无法直接判断结果的操作。",
        scope: ["关注、评论、粉丝团、转发、密码修改、管理、购票和赠礼"], cases: ["LIVE-193 至 LIVE-214"], owner: "多方确认",
      },
      {
        block: "不阻塞", scenario: "关键操作返回成功、失败或处理中状态", category: "交互与文案规则",
        question: "三类操作状态采用哪一种反馈形式？",
        options: ["A. 成功用 Toast，失败用就地提示，处理中用按钮状态", "B. 三类状态均使用 Toast", "C. 三类状态均使用弹窗", "D. 各功能单独定义"],
        recommendation: "建议 A；反馈强度与处理需求匹配，失败信息也靠近操作位置。",
        scope: ["结果反馈形式"], cases: ["关键写操作成功、失败和处理中反馈"], owner: "交互",
      },
      {
        block: "不阻塞", scenario: "同一种关键操作在不同直播页面出现", category: "交互与文案规则",
        question: "相同业务结果是否必须使用统一提示文案？",
        options: ["A. 相同结果统一文案", "B. 允许各页面使用不同文案", "C. 仅错误文案统一", "D. 由交互规范另行定义"],
        recommendation: "建议 A；测试判断标准一致，用户也不会误解同一结果。",
        scope: ["普通房、密码房和连麦房提示文案"], cases: ["跨页面反馈文案一致性"], owner: "交互",
      },
    ],
  },
  {
    root: "Q-020",
    basis: ["需求和原型描述了多种直播间写操作的成功结果", "资料未统一描述提交中、超时和失败状态"],
    items: [
      {
        block: "部分阻塞", scenario: "直播间写操作提交后长时间没有返回", category: "异常处理",
        question: "操作超时后采用哪一种终态？",
        options: ["A. 标记结果未知并提供查询", "B. 直接判定失败并允许重试", "C. 保持处理中直到返回", "D. 各功能单独定义"],
        recommendation: "建议 A；可以避免服务端已成功但用户重复提交。",
        scope: ["关注、评论、粉丝团、转发、房间配置和直播管理"], cases: ["关键写操作超时"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "直播间写操作正在提交", category: "交互与文案规则",
        question: "请求处理中操作按钮采用哪一种状态？",
        options: ["A. 禁用按钮并展示处理中", "B. 保持可点击但服务端去重", "C. 隐藏按钮直到返回", "D. 各功能单独定义"],
        recommendation: "建议 A；能够阻止重复操作，并明确告知当前状态。",
        scope: ["关键写操作按钮"], cases: ["处理中重复点击"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "直播间写操作明确返回失败", category: "异常处理",
        question: "失败后采用哪一种重试方式？",
        options: ["A. 保留原输入并提供手动重试", "B. 自动重试一次后再提示", "C. 关闭操作面板并要求重新进入", "D. 各功能单独定义"],
        recommendation: "建议 A；用户可以控制重试时点，也不会丢失已填写内容。",
        scope: ["关键写操作失败恢复"], cases: ["失败后重试", "原输入保留"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "同一写操作因重复点击或网络重试到达服务端多次", category: "异常处理",
        question: "重复请求采用哪一种幂等规则？",
        options: ["A. 同一业务对象和操作令牌只生效一次", "B. 固定时间窗内相同请求只生效一次", "C. 每次请求独立生效", "D. 各功能单独定义"],
        recommendation: "建议 A；业务令牌比纯时间窗更能识别同一次用户操作。",
        scope: ["关键写操作幂等", "重复请求"], cases: ["重复提交不重复生效"], owner: "多方确认",
      },
    ],
  },
  {
    root: "Q-021",
    basis: ["需求明确禁言、踢出、拉黑和房管变更的业务作用域", "原型展示主播或房管侧操作入口"],
    items: [
      {
        block: "部分阻塞", scenario: "主播或房管成功禁言目标观众", category: "跨端与跨模块一致性",
        question: "禁言状态采用哪一种跨端生效模型？",
        options: ["A. 目标观众下一次发送时校验，列表刷新后更新", "B. 通过实时消息立即更新观众端和列表", "C. 观众重新进入房间后生效", "D. 其他：请补充模型"],
        recommendation: "建议 B；管理动作需要及时阻止继续发言，其他观察端也能同步识别状态。",
        scope: ["主播端", "房管端", "目标观众端", "在线列表和公屏"], cases: ["LIVE-043", "LIVE-079", "LIVE-135", "LIVE-204 至 LIVE-205"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "主播或房管成功踢出或拉黑目标观众", category: "跨端与跨模块一致性",
        question: "进房限制采用哪一种跨端生效模型？",
        options: ["A. 实时移出并在下一次进房请求校验", "B. 仅下一次重新进入时校验", "C. 列表刷新后再移出", "D. 其他：请补充模型"],
        recommendation: "建议 A；当前场次限制可以及时执行，后续进房也有服务端校验。",
        scope: ["目标观众端", "在线列表", "后续进房入口"], cases: ["LIVE-083", "LIVE-138", "LIVE-140", "LIVE-143", "LIVE-206"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "主播设置或取消长期房管", category: "跨端与跨模块一致性",
        question: "房管权限变更采用哪一种生效模型？",
        options: ["A. 当前直播立即生效并同步后续场次", "B. 当前直播不变，从下一场生效", "C. 目标用户重新进入当前房间后生效", "D. 其他：请补充模型"],
        recommendation: "建议 A；与长期房管关系的业务定义一致，主播操作后可立即使用。",
        scope: ["主播端", "房管端", "当前直播", "后续直播"], cases: ["LIVE-127 至 LIVE-134", "LIVE-207 至 LIVE-208"], owner: "产品",
      },
    ],
  },
  {
    root: "Q-022",
    basis: ["购票成功需要扣减金币、生成消费记录并获得本场资格", "资料未定义多系统部分成功的补偿"],
    items: [
      {
        block: "部分阻塞", scenario: "金币扣款成功但用户没有进入门票房", category: "异常处理",
        question: "扣款成功但进房失败时采用哪一种补偿？",
        options: ["A. 保留门票资格并提供重新进房", "B. 自动退回金币并关闭订单", "C. 标记异常并等待人工处理", "D. 其他：请补充补偿"],
        recommendation: "建议 A；门票本场可重复进入，保留资格可以避免不必要退款。",
        scope: ["金币余额", "门票资格", "进房"], cases: ["LIVE-017 至 LIVE-025", "扣款成功进房失败"], owner: "多方确认",
      },
      {
        block: "阻塞测试", scenario: "购票订单成功但本场门票资格未生成", category: "异常处理",
        question: "订单成功但资格未生效时采用哪一种补偿？",
        options: ["A. 自动补发本场资格", "B. 自动退款并关闭订单", "C. 查询后由用户选择补发或退款", "D. 进入人工处理"],
        recommendation: "建议 A；订单和扣款已成功时，补发资格最符合用户原始购买目的。",
        scope: ["购票订单", "本场门票资格"], cases: ["订单成功资格缺失"], owner: "多方确认",
      },
      {
        block: "部分阻塞", scenario: "支付回调重复到达或超时后迟到", category: "异常处理",
        question: "重复或迟到回调采用哪一种幂等结果？",
        options: ["A. 同一订单只扣款一次并只生成一份资格", "B. 重复回调生成多条记录后自动冲正", "C. 超时后的回调直接拒绝", "D. 其他：请补充规则"],
        recommendation: "建议 A；订单号天然适合作为幂等依据，可避免重复扣款和资格。",
        scope: ["支付回调", "金币余额", "消费流水", "门票资格"], cases: ["重复支付回调", "超时后实际成功"], owner: "技术",
      },
    ],
  },
  {
    root: "Q-023",
    basis: ["原型支持发出、取消、接受、拒绝和同时收到多条连麦邀请", "需求只限定在线、权限、普通房和两人上限"],
    items: [
      {
        block: "部分阻塞", scenario: "连麦邀请长期未被受邀主播处理", category: "流程与状态",
        question: "连麦邀请采用哪一种有效期模型？",
        options: ["A. 固定时间后自动失效", "B. 发起方取消前持续有效", "C. 任一方状态变化时失效", "D. 其他：请补充有效期"],
        recommendation: "建议 C；邀请只在双方仍满足连麦条件时有效，可以减少过期请求。",
        scope: ["发出邀请", "收到邀请"], cases: ["LIVE-158 至 LIVE-160", "LIVE-188", "邀请失效"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "邀请等待期间任一主播离线或结束直播", category: "流程与状态",
        question: "主播离线或结束直播后待处理邀请如何变化？",
        options: ["A. 所有相关邀请立即关闭", "B. 保留邀请直到原有效期结束", "C. 对方重新开播后恢复邀请", "D. 其他：请补充规则"],
        recommendation: "建议 A；双方已经不满足连麦前置条件，保留邀请容易产生迟到处理。",
        scope: ["主播在线状态", "直播场次", "连麦邀请"], cases: ["LIVE-172 至 LIVE-175", "邀请期间结束直播"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "邀请等待期间任一直播间切换为门票房或密码房", category: "流程与状态",
        question: "房型变为不支持连麦后待处理邀请如何变化？",
        options: ["A. 邀请立即关闭", "B. 保留邀请但禁止接受", "C. 房型恢复普通房后继续处理", "D. 其他：请补充规则"],
        recommendation: "建议 A；特殊房型不支持连麦，关闭邀请可以保持状态一致。",
        scope: ["房型变更", "连麦邀请"], cases: ["LIVE-169 至 LIVE-170", "LIVE-191 至 LIVE-192"], owner: "产品",
      },
      {
        block: "部分阻塞", scenario: "主播几乎同时处理多条邀请或收到迟到响应", category: "流程与状态",
        question: "并发处理连麦邀请采用哪一种终态规则？",
        options: ["A. 第一条成功后关闭其他待处理邀请", "B. 按服务端到达顺序逐条返回失败", "C. 用户选择保留哪些邀请", "D. 其他：请补充规则"],
        recommendation: "建议 A；两人上限确定后，第一条成功即可形成唯一终态。",
        scope: ["多条收到邀请", "两人连麦上限", "迟到响应"], cases: ["LIVE-171", "LIVE-189", "并发接受邀请"], owner: "多方确认",
      },
    ],
  },
];

function numbered(values) {
  return values.map((value, index) => `${index + 1}. ${value}`).join("\n");
}

function expectedMilestone(block) {
  if (block === "阻塞测试") return "进入对应功能测试前";
  if (block === "部分阻塞") return "本轮回归前";
  return "版本验收前";
}

const decisions = groups.flatMap((group) => group.items.map((item, index) => ({
  问题编号: group.items.length === 1 ? group.root : `${group.root}-${String(index + 1).padStart(2, "0")}`,
  阻塞等级: item.block,
  功能模块: "用户App-直播模块",
  具体场景: item.scenario,
  问题分类: item.category,
  待决策问题: item.question,
  可选方案: item.options,
  测试建议: item.recommendation,
  产品结论: "",
  已知依据: group.basis,
  影响范围: item.scope,
  影响用例: item.cases,
  负责人: item.owner,
  期望确认时间: expectedMilestone(item.block),
  确认状态: "待确认",
})));

const blockOrder = new Map(blockLevels.map((value, index) => [value, index]));
decisions.sort((left, right) => (
  blockOrder.get(left.阻塞等级) - blockOrder.get(right.阻塞等级)
  || left.功能模块.localeCompare(right.功能模块, "zh-CN")
  || left.具体场景.localeCompare(right.具体场景, "zh-CN")
  || left.问题编号.localeCompare(right.问题编号, "zh-CN")
));

const optionLabels = ["A.", "B.", "C.", "D."];
const ids = decisions.map((item) => item.问题编号);
assert.equal(new Set(ids).size, ids.length, "存在重复问题编号");
assert.equal(new Set(ids.map((id) => id.slice(0, 5))).size, 23, "没有覆盖全部 23 个原问题编号");
decisions.forEach((item) => {
  assert(blockLevels.includes(item.阻塞等级), `${item.问题编号} 阻塞等级无效`);
  assert(categories.includes(item.问题分类), `${item.问题编号} 问题分类无效`);
  assert(owners.includes(item.负责人), `${item.问题编号} 负责人无效`);
  assert(statuses.includes(item.确认状态), `${item.问题编号} 确认状态无效`);
  assert(item.待决策问题.endsWith("？"), `${item.问题编号} 待决策问题不是问句`);
  assert(!/以及|同时|[①②③④]/.test(item.待决策问题), `${item.问题编号} 待决策问题疑似包含多个决定`);
  assert(item.可选方案.length >= 2 && item.可选方案.length <= 4, `${item.问题编号} 可选方案数量无效`);
  item.可选方案.forEach((option, index) => assert(option.startsWith(optionLabels[index]), `${item.问题编号} 方案标签不连续`));
  const recommendation = item.测试建议.match(/^建议 ([A-D])；/);
  assert(recommendation, `${item.问题编号} 测试建议格式不正确`);
  assert(item.可选方案.some((option) => option.startsWith(`${recommendation[1]}.`)), `${item.问题编号} 建议方案不存在`);
  assert.equal(item.产品结论, "", `${item.问题编号} 初始产品结论必须为空`);
  assert(item.已知依据.length > 0 && item.影响范围.length > 0 && item.影响用例.length > 0, `${item.问题编号} 追溯信息不完整`);
});
for (let index = 1; index < decisions.length; index += 1) {
  assert(blockOrder.get(decisions[index - 1].阻塞等级) <= blockOrder.get(decisions[index].阻塞等级), "需求待确认未按阻塞等级排序");
}

if (process.argv.includes("--validate-only")) {
  console.log(JSON.stringify({ decisionRows: decisions.length, sourceQuestions: groups.length }, null, 2));
  process.exit(0);
}

const rows = decisions.map((item) => [
  item.问题编号,
  item.阻塞等级,
  item.功能模块,
  item.具体场景,
  item.问题分类,
  item.待决策问题,
  item.可选方案.join("\n"),
  item.测试建议,
  item.产品结论,
  numbered(item.已知依据),
  numbered(item.影响范围),
  numbered(item.影响用例),
  item.负责人,
  item.期望确认时间,
  item.确认状态,
]);

function estimateRowHeight(row, widths) {
  let lines = 1;
  row.forEach((value, index) => {
    const text = String(value ?? "");
    const width = Math.max(5, widths[index]);
    const count = text.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil([...line].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(180, Math.max(46, lines * 16 + 12));
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const functionalSheet = workbook.worksheets.getItem("功能测试用例");
const pendingSheet = workbook.worksheets.getItem("需求待确认");
const functionalBefore = functionalSheet.getUsedRange().values;
const functionalFormulasBefore = functionalSheet.getUsedRange().formulas;
const pendingBefore = pendingSheet.getUsedRange().values;
assert.equal(functionalBefore.length - 1, 214, "功能测试用例数量不是 214，停止编辑");
assert.equal(pendingBefore.length - 1, 23, "旧需求待确认数量不是 23，停止编辑以防重复转换");
assert.deepEqual(pendingBefore[0], ["问题编号", "功能模块", "功能结构", "问题分类", "待确认事项", "已知依据", "缺失信息", "影响用例", "确认状态"], "旧需求待确认列结构不符合预期");

const lastRow = rows.length + 1;
const oldLastRow = pendingBefore.length;
const clearLastRow = Math.max(lastRow, oldLastRow);
const existingTable = pendingSheet.tables.items[0];
assert(existingTable, "需求待确认工作表缺少表格");
existingTable.delete();
pendingSheet.getRange(`A1:O${clearLastRow}`).clear({ applyTo: "all" });
pendingSheet.getRange(`A1:O${lastRow}`).values = [headers, ...rows];

const table = pendingSheet.tables.add(`A1:O${lastRow}`, true, "PendingRequirements");
table.style = "TableStyleMedium2";
table.showHeaders = true;
table.showFilterButton = true;
table.showBandedRows = true;

const fullRange = pendingSheet.getRange(`A1:O${lastRow}`);
fullRange.format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
};
pendingSheet.getRange("A1:O1").format = {
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  rowHeightPx: 42,
  borders: { preset: "all", style: "thin", color: "#163A5A" },
};
pendingSheet.getRange(`A2:C${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`E2:E${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`M2:O${lastRow}`).format.horizontalAlignment = "center";
pendingSheet.getRange(`F2:F${lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pendingSheet.getRange(`H2:H${lastRow}`).format.fill = "#EAF4EA";
pendingSheet.getRange(`I2:I${lastRow}`).format = {
  fill: "#FFF4CC",
  font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6B656" },
};

pendingSheet.getRange(`B2:B${lastRow}`).dataValidation = { rule: { type: "list", values: blockLevels } };
pendingSheet.getRange(`E2:E${lastRow}`).dataValidation = { rule: { type: "list", values: categories } };
pendingSheet.getRange(`M2:M${lastRow}`).dataValidation = { rule: { type: "list", values: owners } };
pendingSheet.getRange(`O2:O${lastRow}`).dataValidation = { rule: { type: "list", values: statuses } };

const blockRange = pendingSheet.getRange(`B2:B${lastRow}`);
blockRange.conditionalFormats.deleteAll();
blockRange.conditionalFormats.add("containsText", { text: "阻塞测试", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
blockRange.conditionalFormats.add("containsText", { text: "部分阻塞", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
blockRange.conditionalFormats.add("containsText", { text: "不阻塞", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

const statusRange = pendingSheet.getRange(`O2:O${lastRow}`);
statusRange.conditionalFormats.deleteAll();
statusRange.conditionalFormats.add("containsText", { text: "确认中", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
statusRange.conditionalFormats.add("containsText", { text: "已确认", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

const widths = [15, 14, 20, 34, 22, 44, 58, 48, 44, 52, 38, 38, 16, 20, 14];
widths.forEach((width, index) => {
  const column = String.fromCharCode(65 + index);
  pendingSheet.getRange(`${column}1`).format.columnWidth = width;
});
rows.forEach((row, index) => {
  pendingSheet.getRange(`A${index + 2}:O${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths);
});
pendingSheet.freezePanes.freezeRows(1);
pendingSheet.freezePanes.freezeColumns(5);
pendingSheet.showGridLines = false;

assert.deepEqual(functionalSheet.getUsedRange().values, functionalBefore, "功能测试用例内容发生变化");
assert.deepEqual(functionalSheet.getUsedRange().formulas, functionalFormulasBefore, "功能测试用例公式发生变化");

const previewTop = await workbook.render({ sheetName: "需求待确认", range: "A1:O12", scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-product-decisions-top.png"), new Uint8Array(await previewTop.arrayBuffer()));
const previewBottom = await workbook.render({ sheetName: "需求待确认", range: `A${Math.max(2, lastRow - 10)}:O${lastRow}`, scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-product-decisions-bottom.png"), new Uint8Array(await previewBottom.arrayBuffer()));
const previewFunctional = await workbook.render({ sheetName: "功能测试用例", range: "A1:N8", scale: 1, format: "png" });
await fs.writeFile(path.join(workDir, "preview-012-functional-preserved.png"), new Uint8Array(await previewFunctional.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(workbookPath);

const zip = await JSZip.loadAsync(await fs.readFile(workbookPath));
for (const sheetNumber of [1, 2]) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `缺少 ${entryName}`);
  let xml = await entry.async("string");
  const freeze = sheetNumber === 2
    ? '<x:pane xSplit="5" ySplit="1" topLeftCell="F2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="F2" sqref="F2" />'
    : '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />';
  if (/<x:pane[^>]*\/>/.test(xml)) {
    xml = xml.replace(/<x:pane[^>]*\/>/, freeze.split("<x:selection")[0]);
  } else if (/<x:sheetView([^>]*)\/>/.test(xml)) {
    xml = xml.replace(/<x:sheetView([^>]*)\/>/, `<x:sheetView$1>${freeze}</x:sheetView>`);
  } else {
    xml = xml.replace(/(<x:sheetView[^>]*>)/, `$1${freeze}`);
  }
  zip.file(entryName, xml);
}
await fs.writeFile(workbookPath, await zip.generateAsync({ type: "nodebuffer" }));

const verified = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const verifiedFunctional = verified.worksheets.getItem("功能测试用例");
const verifiedPending = verified.worksheets.getItem("需求待确认");
assert.deepEqual(verifiedFunctional.getUsedRange().values, functionalBefore, "导出后功能测试用例内容发生变化");
assert.deepEqual(verifiedPending.getRange(`A1:O${lastRow}`).values.map((row) => row.map((value) => value ?? "")), [headers, ...rows], "需求待确认内容与预期不一致");

const formulaErrors = await verified.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
assert(formulaErrors.ndjson.includes("matched 0 entries"), "工作簿存在公式错误");
const inspectPath = `${workbookPath}.inspect.ndjson`;
try {
  await fs.rename(inspectPath, path.join(workDir, "012-product-decisions-formula-scan.inspect.ndjson"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const finalZip = await JSZip.loadAsync(await fs.readFile(workbookPath));
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
assert(pendingTableXml.includes(`ref="A1:O${lastRow}"`), "需求待确认表格范围不正确");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
assert(pendingSheetXml.includes(`sqref="B2:B${lastRow}"`), "阻塞等级单选范围不正确");
assert(pendingSheetXml.includes(`sqref="E2:E${lastRow}"`), "问题分类单选范围不正确");
assert(pendingSheetXml.includes(`sqref="M2:M${lastRow}"`), "负责人单选范围不正确");
assert(pendingSheetXml.includes(`sqref="O2:O${lastRow}"`), "确认状态单选范围不正确");
assert(pendingSheetXml.includes('state="frozen"'), "需求待确认未冻结窗格");
assert(pendingSheetXml.includes('xSplit="5"'), "需求待确认未冻结左侧五列");
assert(pendingSheetXml.includes('ySplit="1"'), "需求待确认未冻结首行");

const distribution = decisions.reduce((result, item) => {
  result[item.阻塞等级] = (result[item.阻塞等级] ?? 0) + 1;
  return result;
}, {});
const stat = await fs.stat(workbookPath);
console.log(JSON.stringify({
  workbookPath,
  casesPreserved: functionalBefore.length - 1,
  legacyQuestions: pendingBefore.length - 1,
  decisionRows: decisions.length,
  distribution,
  productConclusionsBlank: decisions.every((item) => item.产品结论 === ""),
  bytes: stat.size,
}, null, 2));
