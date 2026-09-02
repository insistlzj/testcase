import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workDir = path.resolve("work/liveshow-user-live-records");
const outputDir = path.resolve("outputs/Luma Live-case");
const outputPath = path.join(outputDir, "用户App-直播记录模块-260831-001.xlsx");
const jsonPath = path.join(workDir, "用户App-直播记录模块-测试用例-260831-001.json");
const syncResultPath = path.join(workDir, "prototype-context-sync-result.json");
const inspectionPath = path.join(workDir, "inspection-260831-001.json");
const inspectNdjsonPath = `${outputPath}.inspect.ndjson`;

const strategyPath = path.resolve("liveshow-proto/需求来源策略.json");
const strategy = JSON.parse(await fs.readFile(strategyPath, "utf8"));
assert.equal(strategy.来源策略, "prototype-primary", "Luma Live 来源策略不是 prototype-primary");
assert.equal(strategy.生成前同步, true, "Luma Live 未开启生成前同步");

const baselinePaths = [
  "prototype/Luma Live-原型说明.md",
  "prototype/index.html",
  "prototype/assets/annotations.js",
  "prototype/assets/common.js",
  "prototype/assets/mock.js",
  "prototype/pages/user/host/host-center.html",
  "prototype/pages/user/host/live-data.html",
  "prototype/pages/user/host/live-records.html",
  "prototype/pages/user/live/live-end-host.html",
  "prototype/pages/user/host/start-live-settings.html",
];

async function baselineEntry(relativePath) {
  const absolutePath = path.resolve("liveshow-proto", relativePath);
  const bytes = await fs.readFile(absolutePath);
  const stat = await fs.stat(absolutePath);
  return {
    相对路径: relativePath,
    修改时间: new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(stat.mtime).replace(" ", "T") + "+08:00",
    "SHA-256": crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

const baseline = await Promise.all(baselinePaths.map(baselineEntry));
const syncResult = {
  项目名称: "Luma Live",
  来源策略: "prototype-primary",
  同步状态: "有非阻塞待确认",
  执行时间: "2026-08-31 09:59:02 CST",
  原型基线: baseline,
  扫描范围: [
    "用户 App / 主播中心 / 直播记录",
    "关联入口：主播中心、直播数据",
    "关联流程：结束直播生成记录、开播封面与标题快照",
    "公共来源：原型说明、页面树、批注、Mock、日期与数字格式函数",
  ],
  目标需求清单: ["context/01-用户主播App-项目需求清单.md"],
  差异统计: { 新增: 1, 修改: 1, 明确删除: 0, 原型未覆盖: 5, 来源冲突: 0, 无法定位: 0 },
  需求清单变更日志编号: ["RSL-0003"],
  受影响用例: [
    { 范围: "历史直播模块 Excel", 状态: "继续有效", 数量: 0 },
    { 范围: "上一版直播模块的结束直播记录用例", 状态: "继续有效", 数量: 1 },
  ],
  阻塞异常: [],
  非阻塞待确认: [
    "主播中心直播记录入口的最终跳转方式",
    "默认近 7 天和日期筛选的时区边界",
    "观众人数与收礼数量统计口径",
    "结束直播后的记录可查询时效",
    "单场记录后续详情、大量历史记录加载和保留范围",
  ],
};

await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(syncResultPath, `${JSON.stringify(syncResult, null, 2)}\n`, "utf8");

const MODULE = "用户App-直播记录模块";
const REQ = "来源：context/01-用户主播App-项目需求清单.md（2026-08-31 按原型同步，RSL-0003）";
const ROLE = "来源：context/01-用户主播App-角色与用例.md";
const SPEC = "来源：prototype/Luma Live-原型说明.md";
const ANNO = "来源：prototype/assets/annotations.js";
const MOCK = "来源：prototype/assets/mock.js 的 liveRecords 字段口径";
const RECORD = "来源：prototype/pages/user/host/live-records.html 与当页交互脚本；未连接真实后端动态验证";
const HOST_CENTER = "来源：prototype/pages/user/host/host-center.html；未连接真实后端动态验证";
const LIVE_DATA = "来源：prototype/pages/user/host/live-data.html；未连接真实后端动态验证";
const END = "来源：context/01-用户主播App-角色与用例.md 的结束直播业务结果";
const SYNC = "同步追溯：work/liveshow-user-live-records/prototype-context-sync-result.json；RSL-0003";
const QUALITY = "质量检查：按 RCL-0018 使用最小前置条件和单一业务分支";

const cases = [];
function addCase({ structure, type = "功能需求", priority = "P2", description, point, pre, steps, expected, flow = "", notes = [] }) {
  cases.push({
    序号: 0,
    用例编号: "",
    功能模块: MODULE,
    功能结构: structure,
    用例类型: type,
    优先级: priority,
    用例描述: description,
    验证用例子项: point,
    前置条件: pre,
    操作步骤: steps,
    预期结果: [expected],
    流程编号: flow,
    测试结果: "未测",
    测试人员: "",
    备注: [...notes, SYNC, QUALITY],
  });
}

addCase({ structure: "入口与导航", type: "业务流程", priority: "P0", description: "验证从直播数据进入直播记录", point: "直播数据入口", pre: ["主播账号已登录", "日数据列表存在一条历史记录"], steps: ["进入主播中心的直播数据页", "点击日数据列表中的历史记录"], expected: "页面进入标题为“直播记录”的页面", notes: [LIVE_DATA, SPEC] });
addCase({ structure: "入口与导航", priority: "P2", description: "验证从直播记录返回主播中心", point: "返回主播中心", pre: ["主播已进入直播记录页"], steps: ["点击页面左上角返回按钮"], expected: "页面返回主播中心", notes: [RECORD] });

addCase({ structure: "默认记录", type: "逻辑校验", priority: "P1", description: "验证默认列表按已显示日期范围筛选", point: "默认日期范围筛选", pre: ["页面默认日期范围内存在 2026-08-12、2026-08-15、2026-08-17 三场记录", "页面默认日期范围外存在 2026-08-09 一场记录"], steps: ["进入直播记录页", "查看默认记录列表"], expected: "默认记录列表结果集仅包含 2026-08-12、2026-08-15、2026-08-17 三场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "默认记录", type: "逻辑校验", priority: "P1", description: "验证默认范围收益汇总", point: "默认收益汇总", pre: ["收益定义为当前日期范围内各场本场收益的整数之和", "默认范围内三场收益依次为 3,156、1,904、624", "默认范围外记录不计入收益"], steps: ["进入直播记录页", "查看收益汇总"], expected: "收益 = 3,156 + 1,904 + 624 = 5,684", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "默认记录", type: "逻辑校验", priority: "P1", description: "验证默认范围总时长汇总", point: "默认总时长汇总", pre: ["总时长定义为当前日期范围内各场直播时长按分钟相加", "默认范围内三场时长依次为 2h18m、1h42m、56m", "默认范围外记录不计入总时长"], steps: ["进入直播记录页", "查看总时长汇总"], expected: "总时长 = 138 分钟 + 102 分钟 + 56 分钟 = 296 分钟 = 4h56m", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "默认记录", type: "逻辑校验", priority: "P1", description: "验证默认范围直播场次汇总", point: "默认场次汇总", pre: ["直播场次定义为当前日期范围内的直播记录数量", "默认范围内有 3 场记录", "默认范围外有 1 场记录"], steps: ["进入直播记录页", "查看直播场次汇总"], expected: "直播场次 = 3", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "默认记录", type: "逻辑校验", priority: "P1", description: "验证记录按开播时间倒序展示", point: "开播时间倒序", pre: ["当前日期范围内存在开播时间依次为 2026-08-12 21:12、2026-08-15 19:38、2026-08-17 20:06 的三场记录"], steps: ["进入直播记录页", "查看记录排列顺序"], expected: "记录顺序从上到下为 2026-08-17 20:06、2026-08-15 19:38、2026-08-12 21:12", notes: [REQ, SPEC, MOCK] });

addCase({ structure: "快捷日期筛选", priority: "P1", description: "验证快捷日期菜单选项范围", point: "快捷日期选项", pre: ["主播已进入直播记录页"], steps: ["点击右侧快捷日期按钮"], expected: "快捷日期菜单展示“本月”“本周”“上月”“自定义”四个选项", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P2", description: "验证点击菜单外关闭快捷日期菜单", point: "快捷菜单外部关闭", pre: ["快捷日期菜单已打开"], steps: ["点击筛选区域外的页面位置"], expected: "快捷日期菜单关闭", notes: [RECORD] });
addCase({ structure: "快捷日期筛选", type: "逻辑校验", priority: "P1", description: "验证本月筛选记录范围", point: "本月记录范围", pre: ["测试环境业务日期为 2026-08-17", "2026 年 8 月存在三场记录", "2026 年 7 月存在一场记录"], steps: ["打开快捷日期菜单", "选择“本月”", "查看记录列表"], expected: "记录列表结果集仅包含 2026 年 8 月的三场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P2", description: "验证选择本月后的快捷标签", point: "本月标签回显", pre: ["主播已进入直播记录页"], steps: ["打开快捷日期菜单", "选择“本月”"], expected: "右侧快捷日期按钮回显“本月”", notes: [RECORD] });
addCase({ structure: "快捷日期筛选", type: "逻辑校验", priority: "P1", description: "验证本周筛选记录范围", point: "本周记录范围", pre: ["测试环境业务日期为 2026-08-17", "2026-08-17 至 2026-08-23 内存在一场记录", "2026-08-16 存在一场记录"], steps: ["打开快捷日期菜单", "选择“本周”", "查看记录列表"], expected: "记录列表结果集仅包含 2026-08-17 至 2026-08-23 内的一场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P2", description: "验证选择本周后的快捷标签", point: "本周标签回显", pre: ["主播已进入直播记录页"], steps: ["打开快捷日期菜单", "选择“本周”"], expected: "右侧快捷日期按钮回显“本周”", notes: [RECORD] });
addCase({ structure: "快捷日期筛选", type: "逻辑校验", priority: "P1", description: "验证上月筛选记录范围", point: "上月记录范围", pre: ["测试环境业务日期为 2026-08-17", "2026 年 7 月存在 2026-07-05、2026-07-31 两场记录", "2026 年 8 月存在一场记录"], steps: ["打开快捷日期菜单", "选择“上月”", "查看记录列表"], expected: "记录列表结果集仅包含 2026-07-05、2026-07-31 两场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P2", description: "验证选择上月后的快捷标签", point: "上月标签回显", pre: ["主播已进入直播记录页"], steps: ["打开快捷日期菜单", "选择“上月”"], expected: "右侧快捷日期按钮回显“上月”", notes: [RECORD] });
addCase({ structure: "快捷日期筛选", priority: "P1", description: "验证自定义选项打开日期选择器", point: "自定义日期入口", pre: ["主播已进入直播记录页"], steps: ["打开快捷日期菜单", "选择“自定义”"], expected: "页面打开标题为“选择日期”的日期选择器", notes: [REQ, ANNO, RECORD] });

addCase({ structure: "自定义日期筛选", priority: "P1", description: "验证日期按钮打开日期选择器", point: "日期按钮入口", pre: ["主播已进入直播记录页"], steps: ["点击左侧日期范围按钮"], expected: "页面打开标题为“选择日期”的日期选择器", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证取消关闭日期选择器", point: "取消日期选择", pre: ["日期选择器已打开"], steps: ["点击“取消”"], expected: "日期选择器关闭", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P2", description: "验证取消后保留已应用日期", point: "取消保留日期", pre: ["已应用日期范围为 12/8/2026 ~ 15/8/2026", "日期选择器已打开"], steps: ["在日历中选择 17/8/2026", "点击“取消”"], expected: "日期范围按钮仍显示 12/8/2026 ~ 15/8/2026", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P3", description: "验证点击遮罩关闭日期选择器", point: "遮罩关闭日期选择", pre: ["日期选择器已打开"], steps: ["点击日期选择器外的遮罩区域"], expected: "日期选择器关闭", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证日历切换到上个月", point: "上个月切换", pre: ["日期选择器当前显示 2026 年 8 月"], steps: ["点击日历左侧月份切换按钮"], expected: "日历标题显示“2026年7月”", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", priority: "P2", description: "验证日历切换到下个月", point: "下个月切换", pre: ["日期选择器当前显示 2026 年 8 月"], steps: ["点击日历右侧月份切换按钮"], expected: "日历标题显示“2026年9月”", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证确认单日后回显纯日期", point: "单日日期回显", pre: ["日期选择器已打开"], steps: ["选择 15/8/2026", "点击“确定”"], expected: "日期范围按钮显示“15/8/2026”", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证单日筛选记录范围", point: "单日记录范围", pre: ["2026-08-15 存在一场记录", "2026-08-12 存在一场记录"], steps: ["将自定义日期设置为 15/8/2026", "查看记录列表"], expected: "记录列表结果集仅包含 2026-08-15 的一场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证单日筛选收益汇总", point: "单日收益汇总", pre: ["收益定义为所选日期内各场本场收益的整数之和", "2026-08-15 仅有一场收益为 1,904 的记录"], steps: ["将自定义日期设置为 15/8/2026", "查看收益汇总"], expected: "收益 = 1,904", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证单日筛选总时长汇总", point: "单日总时长汇总", pre: ["总时长定义为所选日期内各场直播时长按分钟相加", "2026-08-15 仅有一场时长为 1h42m 的记录"], steps: ["将自定义日期设置为 15/8/2026", "查看总时长汇总"], expected: "总时长 = 102 分钟 = 1h42m", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证单日筛选直播场次汇总", point: "单日场次汇总", pre: ["直播场次定义为所选日期内的直播记录数量", "2026-08-15 仅有一场记录"], steps: ["将自定义日期设置为 15/8/2026", "查看直播场次汇总"], expected: "直播场次 = 1", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证反向选择日期后按先后顺序回显", point: "反向日期归一", pre: ["日期选择器已打开"], steps: ["先选择 15/8/2026", "再选择 12/8/2026", "点击“确定”"], expected: "日期范围按钮显示“12/8/2026 ~ 15/8/2026”", notes: [RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证连续日期范围包含起止日", point: "日期范围闭区间", pre: ["2026-08-12 和 2026-08-15 各存在一场记录", "2026-08-17 存在一场记录"], steps: ["将自定义日期范围设置为 12/8/2026 ~ 15/8/2026", "查看记录列表"], expected: "记录列表结果集仅包含 2026-08-12、2026-08-15 两场记录", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证连续日期范围收益汇总", point: "日期范围收益汇总", pre: ["收益定义为所选范围内各场本场收益的整数之和", "2026-08-12 收益为 624", "2026-08-15 收益为 1,904"], steps: ["将自定义日期范围设置为 12/8/2026 ~ 15/8/2026", "查看收益汇总"], expected: "收益 = 624 + 1,904 = 2,528", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证连续日期范围总时长汇总", point: "日期范围总时长汇总", pre: ["总时长定义为所选范围内各场直播时长按分钟相加", "2026-08-12 时长为 56m", "2026-08-15 时长为 1h42m"], steps: ["将自定义日期范围设置为 12/8/2026 ~ 15/8/2026", "查看总时长汇总"], expected: "总时长 = 56 分钟 + 102 分钟 = 158 分钟 = 2h38m", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P1", description: "验证连续日期范围直播场次汇总", point: "日期范围场次汇总", pre: ["直播场次定义为所选范围内的直播记录数量", "2026-08-12 至 2026-08-15 内有 2 场记录"], steps: ["将自定义日期范围设置为 12/8/2026 ~ 15/8/2026", "查看直播场次汇总"], expected: "直播场次 = 2", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "自定义日期筛选", type: "逻辑校验", priority: "P2", description: "验证连续选择同一天保持单日范围", point: "重复日期单日范围", pre: ["日期选择器已打开"], steps: ["选择 15/8/2026", "再次选择 15/8/2026", "点击“确定”"], expected: "日期范围按钮显示“15/8/2026”", notes: [RECORD] });

addCase({ structure: "无记录日期", priority: "P2", description: "验证无记录日期的列表结果", point: "无记录列表", pre: ["2026-07-01 没有直播记录"], steps: ["将自定义日期设置为 1/7/2026", "查看记录列表"], expected: "记录列表不展示任何直播记录卡片", notes: [RECORD] });
addCase({ structure: "无记录日期", type: "逻辑校验", priority: "P2", description: "验证无记录日期的收益汇总", point: "无记录收益", pre: ["收益定义为所选日期内各场本场收益的整数之和", "2026-07-01 没有直播记录"], steps: ["将自定义日期设置为 1/7/2026", "查看收益汇总"], expected: "收益 = 0", notes: [ANNO, RECORD] });
addCase({ structure: "无记录日期", type: "逻辑校验", priority: "P2", description: "验证无记录日期的总时长汇总", point: "无记录总时长", pre: ["总时长定义为所选日期内各场直播时长按分钟相加", "2026-07-01 没有直播记录"], steps: ["将自定义日期设置为 1/7/2026", "查看总时长汇总"], expected: "总时长 = 0 分钟 = 0h0m", notes: [ANNO, RECORD] });
addCase({ structure: "无记录日期", type: "逻辑校验", priority: "P2", description: "验证无记录日期的直播场次汇总", point: "无记录场次", pre: ["直播场次定义为所选日期内的直播记录数量", "2026-07-01 没有直播记录"], steps: ["将自定义日期设置为 1/7/2026", "查看直播场次汇总"], expected: "直播场次 = 0", notes: [ANNO, RECORD] });

addCase({ structure: "记录卡片", priority: "P1", description: "验证记录卡片展示开播时标题", point: "历史标题展示", pre: ["目标历史记录的开播时标题为“今晚唱到你睡着”"], steps: ["进入直播记录页", "查看目标记录标题"], expected: "目标记录标题显示“今晚唱到你睡着”", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证记录卡片展示开播时封面", point: "历史封面展示", pre: ["目标历史记录已保存开播时封面"], steps: ["进入直播记录页", "查看目标记录封面"], expected: "目标记录展示该场直播开播时保存的封面", notes: [REQ, ANNO, MOCK, RECORD] });
addCase({ structure: "记录卡片", type: "逻辑校验", priority: "P1", description: "验证记录卡片的开播时间格式", point: "开播时间格式", pre: ["目标历史记录的开播时间为 2026-08-17 20:06"], steps: ["进入直播记录页", "查看目标记录开播时间"], expected: "目标记录开播时间显示为“17/8/2026 20.06”", notes: [REQ, ANNO, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证记录卡片展示直播时长", point: "直播时长展示", pre: ["目标历史记录的直播时长为 2h18m"], steps: ["进入直播记录页", "查看目标记录直播时长"], expected: "目标记录直播时长显示“2h18m”", notes: [REQ, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证记录卡片展示本场收益", point: "本场收益展示", pre: ["目标历史记录的本场收益为 3,156"], steps: ["进入直播记录页", "查看目标记录本场收益"], expected: "目标记录本场收益显示“+3.156”", notes: [REQ, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证记录卡片展示观众人数", point: "观众人数展示", pre: ["目标历史记录的观众人数为 1,286"], steps: ["进入直播记录页", "查看目标记录观众人数"], expected: "目标记录观众人数显示“1.286”", notes: [REQ, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证记录卡片展示收礼数量", point: "收礼数量展示", pre: ["目标历史记录的收礼数量为 4,820"], steps: ["进入直播记录页", "查看目标记录收礼数量"], expected: "目标记录收礼数量显示“4.820”", notes: [REQ, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证门票房记录展示房型标识", point: "门票房标识", pre: ["目标历史记录的房间类型为门票房"], steps: ["进入直播记录页", "查看目标记录标题区域"], expected: "目标记录标题区域展示门票房标识", notes: [REQ, SPEC, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P1", description: "验证密码房记录展示房型标识", point: "密码房标识", pre: ["目标历史记录的房间类型为密码房"], steps: ["进入直播记录页", "查看目标记录标题区域"], expected: "目标记录标题区域展示密码房标识", notes: [REQ, SPEC, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P2", description: "验证普通房记录不展示特殊房型标识", point: "普通房标识", pre: ["目标历史记录的房间类型为普通房"], steps: ["进入直播记录页", "查看目标记录标题区域"], expected: "目标记录标题区域不展示门票房标识和密码房标识", notes: [REQ, SPEC, MOCK, RECORD] });
addCase({ structure: "记录卡片", priority: "P2", description: "验证点击单场记录的操作反馈", point: "单场记录点击反馈", pre: ["直播记录列表存在一场记录"], steps: ["点击该场直播记录卡片"], expected: "页面提示“查看本场直播数据”", notes: [REQ, RECORD] });

addCase({ structure: "记录生成", type: "业务流程", priority: "P1", description: "验证结束直播后生成历史记录", point: "结束直播生成记录", pre: ["主播存在一场进行中的直播", "本场直播标识为 LIVE-SESSION-001"], steps: ["主播确认结束 LIVE-SESSION-001", "进入直播记录页", "查询 LIVE-SESSION-001"], expected: "直播记录列表新增 LIVE-SESSION-001 对应的历史记录", flow: "FLOW-LREC-001", notes: [END, ROLE, "流程阶段：主播结束直播后在直播记录模块观察记录生成", "共同业务对象：直播场次 LIVE-SESSION-001"] });
addCase({ structure: "记录生成", type: "业务流程", priority: "P1", description: "验证新记录计入收益汇总", point: "新记录收益汇总", pre: ["筛选范围原有三场收益为 3,156、1,904、624 的记录", "新结束场次 LIVE-SESSION-001 的本场收益为 100", "LIVE-SESSION-001 的日期位于当前筛选范围内"], steps: ["结束 LIVE-SESSION-001", "进入直播记录页", "查看当前范围收益汇总"], expected: "收益 = 3,156 + 1,904 + 624 + 100 = 5,784", flow: "FLOW-LREC-001", notes: [END, REQ, "流程阶段：结束直播后在直播记录模块观察收益汇总", "共同业务对象：直播场次 LIVE-SESSION-001"] });
addCase({ structure: "记录生成", type: "业务流程", priority: "P1", description: "验证新记录计入总时长汇总", point: "新记录总时长汇总", pre: ["筛选范围原有三场时长为 2h18m、1h42m、56m 的记录", "新结束场次 LIVE-SESSION-001 的直播时长为 30m", "LIVE-SESSION-001 的日期位于当前筛选范围内"], steps: ["结束 LIVE-SESSION-001", "进入直播记录页", "查看当前范围总时长汇总"], expected: "总时长 = 138 分钟 + 102 分钟 + 56 分钟 + 30 分钟 = 326 分钟 = 5h26m", flow: "FLOW-LREC-001", notes: [END, REQ, "流程阶段：结束直播后在直播记录模块观察总时长汇总", "共同业务对象：直播场次 LIVE-SESSION-001"] });
addCase({ structure: "记录生成", type: "业务流程", priority: "P1", description: "验证新记录计入直播场次汇总", point: "新记录场次汇总", pre: ["筛选范围原有 3 场直播记录", "新结束场次 LIVE-SESSION-001 的日期位于当前筛选范围内"], steps: ["结束 LIVE-SESSION-001", "进入直播记录页", "查看当前范围直播场次汇总"], expected: "直播场次 = 3 + 1 = 4", flow: "FLOW-LREC-001", notes: [END, REQ, "流程阶段：结束直播后在直播记录模块观察场次汇总", "共同业务对象：直播场次 LIVE-SESSION-001"] });
addCase({ structure: "历史快照", type: "业务流程", priority: "P1", description: "验证历史标题不随当前开播设置变更", point: "历史标题快照保持", pre: ["历史场次 LIVE-SESSION-002 的开播时标题为“深夜聊天局”", "主播当前开播设置标题已改为“周末唱歌局”"], steps: ["进入直播记录页", "查看 LIVE-SESSION-002 的标题"], expected: "LIVE-SESSION-002 的标题仍显示“深夜聊天局”", flow: "FLOW-LREC-002", notes: [REQ, ANNO, "流程阶段：修改当前开播设置后观察历史标题", "共同业务对象：历史场次 LIVE-SESSION-002"] });
addCase({ structure: "历史快照", type: "业务流程", priority: "P1", description: "验证历史封面不随当前开播设置变更", point: "历史封面快照保持", pre: ["历史场次 LIVE-SESSION-002 的开播时封面为封面 A", "主播当前开播设置封面已改为封面 B"], steps: ["进入直播记录页", "查看 LIVE-SESSION-002 的封面"], expected: "LIVE-SESSION-002 仍展示封面 A", flow: "FLOW-LREC-002", notes: [REQ, ANNO, "流程阶段：修改当前开播设置后观察历史封面", "共同业务对象：历史场次 LIVE-SESSION-002"] });

cases.forEach((item, index) => {
  item.序号 = index + 1;
  item.用例编号 = `LREC-${String(index + 1).padStart(3, "0")}`;
});

const questions = [
  {
    问题编号: "Q-001", 需求组编号: "RQ-001", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播在主播中心点击“直播记录”工具入口",
    问题分类: "流程与状态", 待决策问题: "主播中心的“直播记录”入口点击后应执行哪一种结果？",
    可选方案: ["A. 直接进入直播记录页", "B. 先进入直播数据页，再由主播选择日数据进入直播记录页", "C. 从主播中心移除直播记录入口"],
    测试建议: "建议 A；直播记录已作为主播中心独立页面登记，直接进入路径最短，也符合工具入口的用户预期。",
    产品结论: "", 结论补充: "", 已知依据: ["主播中心展示“直播记录”工具入口", "当前按钮仅提示“进入直播记录”，没有页面跳转", "直播记录页已在页面树独立登记"],
    影响范围: ["用户 App 主播中心", "直播记录入口", "主播返回路径"], 已有用例编号: ["LREC-001", "LREC-002"], 确认后待补用例: ["主播中心直播记录入口"],
    负责人: "产品", 期望确认时间: "进入直播记录功能测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-002", 需求组编号: "RQ-002", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播首次进入直播记录页，系统计算默认近 7 天范围",
    问题分类: "计算与统计口径", 待决策问题: "默认“近 7 天”采用哪一种起止范围？",
    可选方案: ["A. 包含当天及前 6 个自然日，共 7 个自然日", "B. 包含当天及前 7 个自然日，共 8 个自然日", "C. 从进入页面时刻向前滚动 168 小时"],
    测试建议: "建议 A；自然日口径便于主播理解，列表和三项汇总也能使用同一日期边界。",
    产品结论: "", 结论补充: "", 已知依据: ["原型批注写明默认近 7 天", "静态示例日期为 10/8/2026 至 17/8/2026", "原型未解释示例是否包含当天及前 7 日"],
    影响范围: ["默认记录列表", "默认收益汇总", "默认总时长汇总", "默认直播场次汇总"], 已有用例编号: ["LREC-003 至 LREC-006"], 确认后待补用例: ["默认日期起止边界"],
    负责人: "产品", 期望确认时间: "进入日期筛选测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-003", 需求组编号: "RQ-003", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "直播发生在日期切换边界，主播使用默认、快捷和自定义日期筛选",
    问题分类: "计算与统计口径", 待决策问题: "直播记录日期归属和筛选边界使用哪个时区？",
    可选方案: ["A. 使用主播账号所属时区", "B. 使用主播设备系统时区", "C. 固定使用 Asia/Jakarta 时区"],
    测试建议: "建议 A；与有效天按主播所属自然日计算的既有口径一致，可减少同一主播跨设备结果变化。",
    产品结论: "", 结论补充: "", 已知依据: ["有效天使用主播所属自然日", "直播记录原型只比较日期字段", "直播记录批注未定义时区"],
    影响范围: ["默认日期范围", "本周、本月、上月筛选", "自定义日期筛选", "汇总指标"], 已有用例编号: ["LREC-003 至 LREC-037"], 确认后待补用例: ["跨日开播和跨日结束的日期归属", "时区切换边界"],
    负责人: "多方确认", 期望确认时间: "进入日期筛选测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-004", 需求组编号: "RQ-004", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "一场直播存在用户重复进出和并发观看，记录卡片展示观众人数",
    问题分类: "计算与统计口径", 待决策问题: "单场记录的“观众人数”采用哪一种统计口径？",
    可选方案: ["A. 按用户 ID 去重后的观看人数", "B. 直播期间的最高同时在线人数", "C. 用户每次进入直播间均累计一次"],
    测试建议: "建议 A；字段名称为人数，按用户去重最符合人数语义，也便于与重复进房行为区分。",
    产品结论: "", 结论补充: "", 已知依据: ["记录卡片展示观众人数", "Mock 仅提供 viewers 数值", "原型未说明重复进入和并发统计方式"],
    影响范围: ["记录卡片观众人数", "单场直播数据", "主播数据对账"], 已有用例编号: ["LREC-043"], 确认后待补用例: ["重复进入统计", "并发观看统计"],
    负责人: "产品", 期望确认时间: "进入记录字段测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-005", 需求组编号: "RQ-005", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "一场直播中同一用户批量赠送礼物，记录卡片展示收礼数量",
    问题分类: "计算与统计口径", 待决策问题: "单场记录的“收礼数量”采用哪一种统计口径？",
    可选方案: ["A. 累计所有礼物的商品件数", "B. 累计用户执行赠送的操作次数", "C. 统计本场收到的不同礼物种类数"],
    测试建议: "建议 A；“数量”按商品件数可以直接覆盖 x1、x10 等批量赠送，也便于收益对账。",
    产品结论: "", 结论补充: "", 已知依据: ["记录卡片展示收礼数量", "直播送礼支持批量数量", "Mock 仅提供 gifts 数值"],
    影响范围: ["记录卡片收礼数量", "直播送礼", "主播数据对账"], 已有用例编号: ["LREC-044"], 确认后待补用例: ["批量赠礼数量统计", "多礼物类型统计"],
    负责人: "产品", 期望确认时间: "进入记录字段测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-006", 需求组编号: "RQ-006", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播结束直播后进入直播记录查询刚结束的场次",
    问题分类: "跨端与跨模块一致性", 待决策问题: "结束直播后，新场次记录最迟应在什么时候可以查询？",
    可选方案: ["A. 直播结束结果页出现时即可查询", "B. 直播结束后 30 秒内可以查询", "C. 直播结束后 5 分钟内可以查询", "D. 该场结算完成后可以查询"],
    测试建议: "建议 A；主播结束后通常会立即查看本场数据，立即可查可以减少重复刷新和误判。",
    产品结论: "", 结论补充: "", 已知依据: ["需求写明结束直播后生成本场记录、收益和数据", "原型未定义生成时效和刷新动作"],
    影响范围: ["结束直播", "直播记录生成", "收益、时长和场次汇总"], 已有用例编号: ["LREC-049 至 LREC-052"], 确认后待补用例: ["记录生成时效边界", "超时后的页面结果"],
    负责人: "多方确认", 期望确认时间: "进入跨模块流程测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-007", 需求组编号: "RQ-007", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "主播点击直播记录列表中的单场记录卡片",
    问题分类: "流程与状态", 待决策问题: "点击单场直播记录后应进入哪一种查看方式？",
    可选方案: ["A. 进入独立的单场直播详情页", "B. 在当前页打开单场数据抽屉", "C. 仅提示“查看本场直播数据”，不展示更多内容"],
    测试建议: "建议 A；独立详情页更适合承载单场数据和后续扩展，也能形成明确返回路径。",
    产品结论: "", 结论补充: "", 已知依据: ["记录卡片具有点击交互", "当前原型只提示“查看本场直播数据”", "原型没有单场详情页面"],
    影响范围: ["记录卡片点击", "单场数据查看", "详情返回路径"], 已有用例编号: ["LREC-048"], 确认后待补用例: ["单场记录详情入口"],
    负责人: "产品", 期望确认时间: "进入记录卡片交互测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-007-01", 需求组编号: "RQ-007", 父问题编号: "Q-007", 追问触发条件: "Q-007 选择 A 或 B 后", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "产品决定点击单场记录后展示详情页或数据抽屉",
    问题分类: "需求范围", 待决策问题: "单场详情首版展示哪一组数据？",
    可选方案: ["A. 仅展示记录卡片已有的标题、封面、开播时间、时长、收益、观众人数、收礼数量和房型", "B. 在 A 的基础上增加新增粉丝人数和送礼人数", "C. 展示结束直播页已有的开播时长、观众人数、新增粉丝和本场收益"],
    测试建议: "建议 A；完全复用当前已有字段，范围明确且不新增未定义统计口径。",
    产品结论: "", 结论补充: "", 已知依据: ["记录卡片已有八类信息", "结束直播页存在另一组本场数据", "当前没有单场详情字段说明"],
    影响范围: ["单场直播详情页", "单场数据抽屉", "记录字段来源"], 已有用例编号: [], 确认后待补用例: ["单场详情字段展示", "单场详情数据一致性"],
    负责人: "产品", 期望确认时间: "Q-007 确认后进入详情开发前", 确认状态: "待前置结论",
  },
  {
    问题编号: "Q-008", 需求组编号: "RQ-008", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "普通用户、直播权限关闭主播和曾经开播的账号访问直播记录页",
    问题分类: "角色与权限", 待决策问题: "哪些账号可以查看自己的历史直播记录？",
    可选方案: ["A. 仅当前具有直播权限的主播可以查看", "B. 曾经产生直播记录的主播在权限关闭后仍可查看", "C. 所有登录用户均可进入，未开播用户展示空记录"],
    测试建议: "建议 B；历史记录属于已发生业务数据，权限关闭后保留只读查询更利于主播核对。",
    产品结论: "", 结论补充: "", 已知依据: ["直播记录位于主播中心", "主播中心仅对主播相关账号开放", "原型未展示权限关闭后的历史查询规则"],
    影响范围: ["主播中心权限", "直播记录访问", "历史数据可见范围"], 已有用例编号: [], 确认后待补用例: ["非主播访问", "直播权限关闭后访问", "历史主播访问"],
    负责人: "产品", 期望确认时间: "进入权限测试前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-009", 需求组编号: "RQ-009", 父问题编号: "", 追问触发条件: "", 阻塞等级: "不阻塞", 功能模块: MODULE,
    具体场景: "主播在较长日期范围内拥有超过一屏的历史直播记录",
    问题分类: "业务规则", 待决策问题: "历史直播记录数量较多时使用哪一种加载方式？",
    可选方案: ["A. 每页 20 条，通过页码切换", "B. 首次 20 条，上拉后每次再加载 20 条", "C. 单次最多加载 1,000 条，超过后要求缩小日期范围"],
    测试建议: "建议 B；符合移动端连续浏览习惯，也能控制首次加载数据量。",
    产品结论: "", 结论补充: "", 已知依据: ["当前原型一次渲染全部 Mock 记录", "原型没有分页、上拉加载和上限说明"],
    影响范围: ["直播记录列表", "日期范围筛选", "大量历史记录"], 已有用例编号: [], 确认后待补用例: ["首批加载", "后续加载", "重复记录去重", "加载结束状态"],
    负责人: "产品", 期望确认时间: "版本验收前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-010", 需求组编号: "RQ-010", 父问题编号: "", 追问触发条件: "", 阻塞等级: "不阻塞", 功能模块: MODULE,
    具体场景: "主播查询一年以上的历史直播记录",
    问题分类: "配置和历史数据影响", 待决策问题: "用户 App 中的直播记录保留多长时间？",
    可选方案: ["A. 永久保留并允许查询", "B. 保留最近 1 年", "C. 保留最近 2 年", "D. 保留最近 3 年"],
    测试建议: "建议 B；覆盖常用年度核对范围，并限制移动端长期历史查询成本。",
    产品结论: "", 结论补充: "", 已知依据: ["当前原型只提供日期筛选", "需求和原型均未定义保留期限"],
    影响范围: ["直播记录历史数据", "日期选择器可选范围", "过期记录查询"], 已有用例编号: [], 确认后待补用例: ["保留期限内记录", "保留期限边界", "过期记录处理"],
    负责人: "产品", 期望确认时间: "版本验收前", 确认状态: "待确认",
  },
  {
    问题编号: "Q-011", 需求组编号: "RQ-011", 父问题编号: "", 追问触发条件: "", 阻塞等级: "部分阻塞", 功能模块: MODULE,
    具体场景: "直播因断网、App 崩溃或平台强制关闭而结束",
    问题分类: "异常处理", 待决策问题: "非主播手动结束的直播场次是否生成直播记录？",
    可选方案: ["A. 所有已经开始的直播场次均生成记录", "B. 仅直播时长达到 1 分钟的场次生成记录", "C. 仅主播手动结束的场次生成记录"],
    测试建议: "建议 A；保留全部已发生场次便于主播核对，也有利于异常追踪和数据对账。",
    产品结论: "", 结论补充: "", 已知依据: ["需求只写明主播结束直播后生成记录", "原型没有异常结束和强制关闭后的记录规则"],
    影响范围: ["异常结束直播", "直播记录生成", "汇总指标"], 已有用例编号: ["LREC-049 至 LREC-052"], 确认后待补用例: ["断网结束生成记录", "App 崩溃后生成记录", "平台强制关闭后生成记录"],
    负责人: "多方确认", 期望确认时间: "进入异常流程测试前", 确认状态: "待确认",
  },
];

const blockRank = { 阻塞测试: 0, 部分阻塞: 1, 不阻塞: 2 };
const groupRank = new Map();
for (const item of questions) groupRank.set(item.需求组编号, Math.min(groupRank.get(item.需求组编号) ?? 9, blockRank[item.阻塞等级]));
const groups = [...new Set(questions.map((item) => item.需求组编号))].sort((a, b) => groupRank.get(a) - groupRank.get(b) || a.localeCompare(b, "zh-CN", { numeric: true }));
const orderedQuestions = [];
for (const group of groups) {
  const members = questions.filter((item) => item.需求组编号 === group);
  const children = new Map();
  for (const item of members) {
    const parent = item.父问题编号 || "";
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(item);
  }
  for (const list of children.values()) list.sort((a, b) => a.问题编号.localeCompare(b.问题编号, "zh-CN", { numeric: true }));
  const visit = (item) => {
    orderedQuestions.push(item);
    for (const child of children.get(item.问题编号) ?? []) visit(child);
  };
  for (const root of children.get("") ?? []) visit(root);
}

const payload = { 测试用例: cases, 需求待确认: orderedQuestions };
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionStatus = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);

assert(cases.length > 0, "测试用例为空");
assert(new Set(cases.map((item) => item.用例编号)).size === cases.length, "用例编号重复");
assert(new Set(orderedQuestions.map((item) => item.问题编号)).size === orderedQuestions.length, "问题编号重复");
assert(cases.filter((item) => item.优先级 === "P0").length <= 2, "P0 不是最小冒烟集");
for (const [index, item] of cases.entries()) {
  assert.equal(item.序号, index + 1, `序号不连续 ${item.用例编号}`);
  assert(validTypes.has(item.用例类型), `用例类型不合法 ${item.用例编号}`);
  assert(validPriorities.has(item.优先级), `优先级不合法 ${item.用例编号}`);
  assert(item.用例描述.startsWith("验证"), `用例描述未以验证开头 ${item.用例编号}`);
  assert(item.验证用例子项.trim(), `验证用例子项为空 ${item.用例编号}`);
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0, `前置条件缺失 ${item.用例编号}`);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0, `操作步骤缺失 ${item.用例编号}`);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1 && item.预期结果[0].trim(), `预期结果数量错误 ${item.用例编号}`);
  assert(Array.isArray(item.备注) && item.备注.some((note) => note.startsWith("来源：")), `缺少来源 ${item.用例编号}`);
  assert(!item.前置条件.some((condition) => /场景\s*[A-ZＡ-Ｚ][：:]/.test(condition)), `前置条件包含可替代场景 ${item.用例编号}`);
  assert(!item.前置条件.some((condition) => condition.includes("或")), `前置条件包含未收敛的“或”分支 ${item.用例编号}`);
  assert(!item.前置条件.some((condition) => condition.includes("分别")), `前置条件包含未收敛的“分别”分支 ${item.用例编号}`);
  assert(!item.操作步骤.some((step) => step.includes("或")), `操作步骤包含未收敛的“或”分支 ${item.用例编号}`);
  assert(!/yyyyMMdd|\/product\//.test(JSON.stringify(item)), `存在技术占位内容 ${item.用例编号}`);
  if (item.流程编号) {
    assert(["FLOW-LREC-001", "FLOW-LREC-002"].includes(item.流程编号), `流程编号不合法 ${item.用例编号}`);
    assert(item.备注.some((note) => note.startsWith("流程阶段：")), `流程阶段缺失 ${item.用例编号}`);
    assert(item.备注.some((note) => note.startsWith("共同业务对象：")), `共同业务对象缺失 ${item.用例编号}`);
  }
}

const signature = (item) => [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join("|"), item.操作步骤.join("|"), item.预期结果[0]].join("||");
assert.equal(new Set(cases.map(signature)).size, cases.length, "存在语义签名重复用例");

const questionById = new Map(orderedQuestions.map((item) => [item.问题编号, item]));
for (const item of orderedQuestions) {
  assert(validQuestionBlocks.has(item.阻塞等级), `阻塞等级不合法 ${item.问题编号}`);
  assert(validQuestionCategories.has(item.问题分类), `问题分类不合法 ${item.问题编号}`);
  assert(validQuestionOwners.has(item.负责人), `负责人不合法 ${item.问题编号}`);
  assert(validQuestionStatus.has(item.确认状态), `确认状态不合法 ${item.问题编号}`);
  assert(item.产品结论 === "" && item.结论补充 === "", `初始结论未留空 ${item.问题编号}`);
  assert(item.可选方案.length >= 2 && item.可选方案.length <= 4, `选项数量不合法 ${item.问题编号}`);
  assert(item.已有用例编号.length + item.确认后待补用例.length > 0, `影响用例字段为空 ${item.问题编号}`);
  assert(item.可选方案.every((option, index) => option.startsWith(`${String.fromCharCode(65 + index)}.`)), `选项标签不连续 ${item.问题编号}`);
  assert(item.可选方案.every((option) => !option.includes("其他：") && !option.includes("另行定义") && !option.includes("视情况")), `存在逃生选项 ${item.问题编号}`);
  if (item.父问题编号) {
    assert(questionById.has(item.父问题编号), `父问题不存在 ${item.问题编号}`);
    assert.equal(questionById.get(item.父问题编号).需求组编号, item.需求组编号, `父问题跨组 ${item.问题编号}`);
    assert(item.追问触发条件.includes(item.父问题编号), `追问触发条件未指向父问题 ${item.问题编号}`);
    assert.equal(item.确认状态, "待前置结论", `子问题状态错误 ${item.问题编号}`);
  } else {
    assert.equal(item.确认状态, "待确认", `根问题状态错误 ${item.问题编号}`);
  }
}

for (const item of orderedQuestions) {
  if (!item.父问题编号) continue;
  assert(orderedQuestions.indexOf(questionById.get(item.父问题编号)) < orderedQuestions.indexOf(item), `子问题早于父问题 ${item.问题编号}`);
}

const testHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const questionHeaders = ["问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号", "确认后待补用例", "负责人", "期望确认时间", "确认状态"];
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");
const caseRow = (item) => [item.序号, item.用例编号, item.功能模块, item.功能结构, item.用例类型, item.优先级, item.用例描述, item.验证用例子项, numbered(item.前置条件), numbered(item.操作步骤), item.预期结果[0], item.流程编号, item.测试结果, item.测试人员, numbered(item.备注)];
const questionRow = (item) => questionHeaders.map((header) => {
  if (header === "可选方案") return item[header].join("\n");
  if (["已知依据", "影响范围", "已有用例编号", "确认后待补用例"].includes(header)) return numbered(item[header]);
  return item[header];
});

function columnName(index) {
  let value = index + 1;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function estimateRowHeight(row, widths) {
  let lines = 1;
  row.forEach((value, index) => {
    const text = String(value ?? "");
    const width = Math.max(5, widths[index]);
    const count = text.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil([...line].length / width)), 0);
    lines = Math.max(lines, count);
  });
  return Math.min(188, Math.max(38, lines * 16 + 10));
}

function buildSheet(workbook, { name, headers, rows, widths, tableName, validations = [], priorityColumn = null }) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnName(headers.length - 1);
  const lastRow = rows.length + 1;
  const range = sheet.getRange(`A1:${lastColumn}${lastRow}`);
  range.values = [headers, ...rows];
  const table = sheet.tables.add(`A1:${lastColumn}${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showHeaders = true;
  table.showFilterButton = true;
  table.showBandedRows = true;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
  range.format = {
    font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#D6DEE8" },
  };
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#1F4E78",
    font: { name: "Microsoft YaHei", size: 11, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    rowHeightPx: 40,
    borders: { preset: "all", style: "thin", color: "#163A5A" },
  };
  for (const { column, values } of validations) sheet.getRange(`${column}2:${column}${lastRow}`).dataValidation = { rule: { type: "list", values } };
  if (priorityColumn) {
    const priorityRange = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    priorityRange.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    priorityRange.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${columnName(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => { sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths); });
  return { sheet, lastColumn, lastRow };
}

const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例",
  headers: testHeaders,
  rows: cases.map(caseRow),
  widths: [8, 15, 19, 24, 13, 9, 36, 27, 46, 46, 54, 18, 12, 14, 50],
  tableName: "LiveRecordTestCases",
  validations: [
    { column: "E", values: [...validTypes] },
    { column: "F", values: [...validPriorities] },
    { column: "M", values: [...validResults] },
  ],
  priorityColumn: "F",
});

const pending = buildSheet(workbook, {
  name: "需求待确认",
  headers: questionHeaders,
  rows: orderedQuestions.map(questionRow),
  widths: [15, 15, 16, 38, 14, 20, 36, 22, 46, 58, 50, 15, 34, 52, 40, 26, 40, 16, 20, 16],
  tableName: "LiveRecordPendingRequirements",
  validations: [
    { column: "E", values: [...validQuestionBlocks] },
    { column: "H", values: [...validQuestionCategories] },
    { column: "L", values: ["A", "B", "C", "D", "其他"] },
    { column: "R", values: [...validQuestionOwners] },
    { column: "T", values: [...validQuestionStatus] },
  ],
});
pending.sheet.freezePanes.freezeColumns(3);
pending.sheet.getRange(`A2:C${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`E2:F${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`H2:H${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`R2:T${pending.lastRow}`).format.horizontalAlignment = "center";
pending.sheet.getRange(`I2:I${pending.lastRow}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#172033" };
pending.sheet.getRange(`K2:K${pending.lastRow}`).format.fill = "#EAF4EA";
pending.sheet.getRange(`L2:M${pending.lastRow}`).format = { fill: "#FFF4CC", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#6B4F00" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6B656" } };
const pendingBlockRange = pending.sheet.getRange(`E2:E${pending.lastRow}`);
pendingBlockRange.conditionalFormats.add("containsText", { text: "阻塞测试", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
pendingBlockRange.conditionalFormats.add("containsText", { text: "部分阻塞", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
pendingBlockRange.conditionalFormats.add("containsText", { text: "不阻塞", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });
const pendingStatusRange = pending.sheet.getRange(`T2:T${pending.lastRow}`);
pendingStatusRange.conditionalFormats.add("containsText", { text: "待前置结论", format: { fill: "#EEF2F7", font: { bold: true, color: "#475569" } } });
pendingStatusRange.conditionalFormats.add("containsText", { text: "确认中", format: { fill: "#E8F1FB", font: { bold: true, color: "#1D4E89" } } });
pendingStatusRange.conditionalFormats.add("containsText", { text: "已确认", format: { fill: "#E7F5EC", font: { bold: true, color: "#166534" } } });

let previousGroup = "";
orderedQuestions.forEach((item, index) => {
  const rowNumber = index + 2;
  if (item.需求组编号 !== previousGroup) {
    pending.sheet.getRange(`A${rowNumber}:T${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } };
    previousGroup = item.需求组编号;
  }
  if (item.父问题编号) {
    pending.sheet.getRange(`A${rowNumber}:D${rowNumber}`).format.fill = "#EAF2F8";
    pending.sheet.getRange(`C${rowNumber}:D${rowNumber}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#24557A" };
  } else pending.sheet.getRange(`B${rowNumber}`).format.fill = "#DDEBF7";
});

const overview = workbook.worksheets.add("产品决策概览");
overview.showGridLines = false;
overview.mergeCells("A1:H1");
overview.getRange("A1").values = [["产品决策概览"]];
overview.getRange("A1:H1").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 52 };
overview.mergeCells("A2:H2");
overview.getRange("A2").values = [["先处理主播中心入口，再在“需求待确认”中选择产品结论；子问题会在父问题结论明确后展开。"]];
overview.getRange("A2:H2").format = { fill: "#EAF2F8", font: { name: "Microsoft YaHei", size: 10, color: "#334155" }, horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 34 };
overview.getRange("A4:H4").values = [["问题总数", "", "当前可回答", "", "待前置结论", "", "已确认", ""]];
overview.getRange("A5:H5").values = [["", "", "", "", "", "", "", ""]];
for (const range of ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]) {
  overview.getRange(range).format = { fill: "#DDEBF7", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 30 };
}
for (const range of ["A5:B5", "C5:D5", "E5:F5", "G5:H5"]) {
  overview.getRange(range).format = { fill: "#FFFFFF", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#B8C7D5" }, rowHeightPx: 42 };
}
for (const range of ["A4:B4", "A5:B5", "C4:D4", "C5:D5", "E4:F4", "E5:F5", "G4:H4", "G5:H5"]) overview.mergeCells(range);
overview.getRange("A5").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})`]];
overview.getRange("C5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]];
overview.getRange("E5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待前置结论")`]];
overview.getRange("G5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"已确认")`]];
overview.getRange("A7:H7").values = [["按状态", "数量", "按阻塞等级", "待确认", "按负责人", "待确认", "结构检查", "数量"]];
overview.getRange("A7:H7").format = { fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#163A5A" }, rowHeightPx: 32 };
const statusValues = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"];
const blockValues = ["阻塞测试", "部分阻塞", "不阻塞"];
const ownerValues = ["产品", "交互", "技术", "多方确认"];
overview.getRange("A8:A12").values = statusValues.map((value) => [value]);
overview.getRange("C8:C10").values = blockValues.map((value) => [value]);
overview.getRange("E8:E11").values = ownerValues.map((value) => [value]);
overview.getRange("G8:G11").values = [["需求组"], ["追问子问题"], ["未填写产品结论"], ["选择其他但未补充"]];
statusValues.forEach((status, index) => { overview.getRange(`B${index + 8}`).formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"${status}")`]]; });
blockValues.forEach((level, index) => { overview.getRange(`D${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$E$2:$E$${pending.lastRow},"${level}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
ownerValues.forEach((owner, index) => { overview.getRange(`F${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$R$2:$R$${pending.lastRow},"${owner}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
overview.getRange("H8").values = [[new Set(orderedQuestions.map((item) => item.需求组编号)).size]];
overview.getRange("H9").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})-COUNTBLANK('需求待确认'!$C$2:$C$${pending.lastRow})`]];
overview.getRange("H10").formulas = [[`=COUNTBLANK('需求待确认'!$L$2:$L$${pending.lastRow})`]];
overview.getRange("H11").formulas = [[`=COUNTIFS('需求待确认'!$L$2:$L$${pending.lastRow},"其他",'需求待确认'!$M$2:$M$${pending.lastRow},"")`]];
overview.getRange("A8:H12").format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" }, rowHeightPx: 31 };
for (const range of ["A8:A12", "C8:C10", "E8:E11", "G8:G11"]) overview.getRange(range).format.horizontalAlignment = "left";
for (const range of ["B8:B12", "D8:D10", "F8:F11", "H8:H11"]) overview.getRange(range).format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A14:H14");
overview.getRange("A14").values = [["处理顺序：先确认主播中心入口；展开父问题左侧分级按钮后，再处理由单场记录查看方式触发的详情范围问题。"]];
overview.getRange("A14:H14").format = { fill: "#F8FAFC", font: { name: "Microsoft YaHei", size: 10, color: "#475569" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, rowHeightPx: 34, borders: { preset: "all", style: "thin", color: "#D6DEE8" } };
[22, 11, 22, 11, 22, 11, 24, 11].forEach((width, index) => { overview.getRange(`${columnName(index)}1`).format.columnWidth = width; });
overview.freezePanes.freezeRows(2);

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

function setOrReplaceXmlAttribute(tag, name, value) {
  const pattern = new RegExp(`\\s${name}="[^"]*"`);
  if (pattern.test(tag)) return tag.replace(pattern, ` ${name}="${value}"`);
  if (/\s*\/>$/.test(tag)) return tag.replace(/\s*\/>$/, ` ${name}="${value}" />`);
  return tag.replace(/>$/, ` ${name}="${value}">`);
}
function patchXmlFreeze(xml, freeze) {
  if (/<x:pane[^>]*\/>/.test(xml)) return xml.replace(/<x:pane[^>]*\/>/, freeze.split("<x:selection")[0]);
  if (/<x:sheetView([^>]*)\/>/.test(xml)) return xml.replace(/<x:sheetView([^>]*)\/>/, `<x:sheetView$1>${freeze}</x:sheetView>`);
  return xml.replace(/(<x:sheetView[^>]*>)/, `$1${freeze}`);
}
function patchXmlRow(xml, rowNumber, attributes) {
  const pattern = new RegExp(`<x:row\\s+([^>]*\\br="${rowNumber}"[^>]*)>`);
  return xml.replace(pattern, (tag) => Object.entries(attributes).reduce((updated, [name, value]) => setOrReplaceXmlAttribute(updated, name, value), tag));
}

const zip = await JSZip.loadAsync(await fs.readFile(outputPath));
const freezes = [
  [1, '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />'],
  [2, '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'],
  [3, '<x:pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A3" sqref="A3" />'],
];
for (const [sheetNumber, freeze] of freezes) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `missing ${entryName}`);
  let xml = patchXmlFreeze(await entry.async("string"), freeze);
  if (sheetNumber === 2) {
    if (!/<x:sheetPr>/.test(xml)) xml = xml.replace(/(<x:sheetViews>)/, '<x:sheetPr><x:outlinePr summaryBelow="0" summaryRight="1" /></x:sheetPr>$1');
    else if (!/<x:outlinePr/.test(xml)) xml = xml.replace(/(<x:sheetPr>)/, '$1<x:outlinePr summaryBelow="0" summaryRight="1" />');
    for (const column of [6, 8, 14, 15, 16, 17]) {
      const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${column}"[^>]*\\bmax="${column}"[^>]*\/>`);
      xml = xml.replace(pattern, (tag) => setOrReplaceXmlAttribute(tag, "hidden", "1"));
    }
    const parentIds = new Set(orderedQuestions.filter((item) => item.父问题编号).map((item) => item.父问题编号));
    orderedQuestions.forEach((item, index) => {
      const attributes = {};
      if (item.父问题编号) {
        attributes.hidden = "1";
        attributes.outlineLevel = "1";
      }
      if (parentIds.has(item.问题编号)) attributes.collapsed = "1";
      if (Object.keys(attributes).length > 0) xml = patchXmlRow(xml, index + 2, attributes);
    });
    xml = xml.replace(/<x:sheetFormatPr([^>]*)\/>/, (tag) => setOrReplaceXmlAttribute(tag, "outlineLevelRow", "1"));
  }
  assert(xml.includes('state="frozen"'), `freeze pane patch failed for ${entryName}`);
  zip.file(entryName, xml);
}

const workbookEntry = zip.file("xl/workbook.xml");
assert(workbookEntry, "missing xl/workbook.xml");
let workbookXml = await workbookEntry.async("string");
if (/<x:workbookView[^>]*\/>/.test(workbookXml)) workbookXml = workbookXml.replace(/<x:workbookView[^>]*\/>/, '<x:workbookView activeTab="2" />');
else if (/<x:bookViews>/.test(workbookXml)) workbookXml = workbookXml.replace(/<x:bookViews>/, '<x:bookViews><x:workbookView activeTab="2" />');
else workbookXml = workbookXml.replace(/(<x:sheets>)/, '<x:bookViews><x:workbookView activeTab="2" /></x:bookViews>$1');
if (!/<x:calcPr/.test(workbookXml)) workbookXml = workbookXml.replace(/<\/x:workbook>/, '<x:calcPr calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>');
zip.file("xl/workbook.xml", workbookXml);
await fs.writeFile(outputPath, await zip.generateAsync({ type: "nodebuffer" }));

const finalBytes = await fs.readFile(outputPath);
const finalZip = await JSZip.loadAsync(finalBytes);
const mainTableXml = await finalZip.file("xl/tables/table1.xml").async("string");
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
const finalWorkbookXml = await finalZip.file("xl/workbook.xml").async("string");
assert(mainTableXml.includes(`ref="A1:O${main.lastRow}"`), "main table range invalid");
assert.equal((mainTableXml.match(/<x:tableColumn /g) ?? []).length, 15, "main table column count invalid");
assert(pendingTableXml.includes(`ref="A1:T${pending.lastRow}"`), "pending table range invalid");
assert.equal((pendingTableXml.match(/<x:tableColumn /g) ?? []).length, 20, "pending table column count invalid");
assert.equal((pendingSheetXml.match(/hidden="1" outlineLevel="1"/g) ?? []).length, orderedQuestions.filter((item) => item.父问题编号).length, "collapsed child count invalid");
assert(finalWorkbookXml.includes('activeTab="2"'), "overview is not active by default");

const finalWorkbook = await SpreadsheetFile.importXlsx(finalBytes);
assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"], "工作表结构异常");
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 140 })).ndjson,
  mainHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O8", maxChars: 18000 })).ndjson,
  mainTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, main.lastRow - 5)}:O${main.lastRow}`, maxChars: 18000 })).ndjson,
  pendingHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:T${Math.min(8, pending.lastRow)}`, maxChars: 20000 })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 16000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(inspectionPath, `${JSON.stringify(inspection, null, 2)}\n`, "utf8");
await fs.writeFile(inspectNdjsonPath, Object.values(inspection).join("\n"), "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O9", "preview-260831-001-main.png"],
  ["需求待确认", `A1:T${Math.min(8, pending.lastRow)}`, "preview-260831-001-pending.png"],
  ["产品决策概览", "A1:H14", "preview-260831-001-overview.png"],
]) {
  const preview = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

for (const item of baseline) {
  const current = await baselineEntry(item.相对路径);
  assert.equal(current["SHA-256"], item["SHA-256"], `生成期间原型基线变化：${item.相对路径}`);
}

const stat = await fs.stat(outputPath);
assert(stat.size > 0, "exported workbook is empty");
console.log(JSON.stringify({ outputPath, jsonPath, syncResultPath, sheets: ["功能测试用例", "需求待确认", "产品决策概览"], cases: cases.length, questions: orderedQuestions.length, childQuestions: orderedQuestions.filter((item) => item.父问题编号).length, p0: cases.filter((item) => item.优先级 === "P0").length, bytes: stat.size }, null, 2));
