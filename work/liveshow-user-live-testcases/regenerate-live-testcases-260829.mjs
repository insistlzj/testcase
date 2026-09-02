import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workDir = path.resolve("work/liveshow-user-live-testcases");
const outputDir = path.resolve("outputs/Luma Live-case");
const seedPath = path.join(workDir, "用户App-直播模块-测试用例-260828.json");
const syncResultPath = path.join(workDir, "prototype-context-sync-result.json");
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260829-003.json");
const outputPath = path.join(outputDir, "用户App-直播模块-260829-003.xlsx");

const REQ = "来源：context/01-用户主播App-项目需求清单.md（2026-08-29 按原型同步，RSL-0002）";
const SYNC = "同步追溯：work/liveshow-user-live-testcases/prototype-context-sync-result.json；RSL-0002";
const PRECONDITION_AUDIT = "质量修正：按 RCL-0018 执行最小前置条件和单分支检查";
const ROLE = "来源：context/01-用户主播App-角色与用例.md";
const PERM = "来源：context/01-互动场景权限规则.md";
const SPEC = "来源：prototype/Luma Live-原型说明.md";
const ANNO = "来源：prototype/assets/annotations.js";
const PLAZA = "来源：prototype/pages/user/home/live-plaza.html 与当页交互脚本；未动态验证";
const START = "来源：prototype/pages/user/host/start-live-settings.html 与当页交互脚本；未动态验证";
const VIEWER = "来源：prototype/pages/user/live/live-room.html 与 prototype/assets/common.js；未动态验证";
const HOST = "来源：prototype/pages/user/live/live-room-host.html 与 prototype/assets/common.js；未动态验证";
const HOST_PASSWORD = "来源：prototype/pages/user/live/live-room-host-password.html 与 prototype/assets/common.js；未动态验证";
const COHOST = "来源：prototype/pages/user/live/live-room-cohost-active.html 与 prototype/assets/common.js；未动态验证";
const REPORT = "来源：prototype/pages/user/live/live-room-report.html、live-room-user-report.html 与当页交互脚本；未动态验证";
const END = "来源：prototype/pages/user/live/live-end-host.html 与 live-end-viewer.html；未动态验证";

const syncResult = JSON.parse(await fs.readFile(syncResultPath, "utf8"));
assert.notEqual(syncResult.同步状态, "阻塞", "原型与需求清单同步处于阻塞状态");
assert.equal(syncResult.需求清单变更日志编号.includes("RSL-0002"), true, "同步结果缺少 RSL-0002 追溯");
for (const baseline of syncResult.原型基线) {
  const filePath = path.resolve("liveshow-proto", baseline.相对路径);
  const digest = crypto.createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
  assert.equal(digest, baseline["SHA-256"], `原型基线已变化：${baseline.相对路径}`);
}

const seed = JSON.parse(await fs.readFile(seedPath, "utf8"));
const removedCaseIds = new Set([
  "LIVE-061", "LIVE-062", "LIVE-125", "LIVE-126", "LIVE-158", "LIVE-159",
  "LIVE-160", "LIVE-172", "LIVE-173", "LIVE-174", "LIVE-175", "LIVE-180",
  "LIVE-188", "LIVE-195", "LIVE-196", "LIVE-197", "LIVE-198", "LIVE-213",
]);

const caseUpdates = {
  "LIVE-001": { 用例描述: "验证直播卡片的通用信息", 验证用例子项: "直播卡片通用信息", 预期结果: ["直播卡片展示直播封面、主播昵称或头像、直播标题和房间类型标识"] },
  "LIVE-002": { 预期结果: ["直播列表展示新人直播数据"] },
  "LIVE-003": { 预期结果: ["直播列表展示热门直播数据"] },
  "LIVE-007": { 预期结果: ["刷新后的列表反映服务端最新在播状态"] },
  "LIVE-008": { 预期结果: ["列表追加后续直播数据且不重复已展示卡片"] },
  "LIVE-009": { 用例描述: "验证无直播数据时的空状态文案", 验证用例子项: "广场空状态文案", 预期结果: ["页面展示“暂无直播，去关注喜欢的主播”"] },
  "LIVE-010": { 用例描述: "验证用户无门槛进入普通房", 验证用例子项: "普通房无门槛进入", 预期结果: ["用户无需购票或输入密码即可进入目标普通房"] },
  "LIVE-013": { 预期结果: ["直播流使用用户选择的清晰度档位继续播放"] },
  "LIVE-014": { 预期结果: ["直播画面按横屏模式展示"] },
  "LIVE-026": { 预期结果: ["场次 A 结束后，进入场次 B 需重新购买场次 B 门票"] },
  "LIVE-027": { 预期结果: ["用户被踢出门票房后不得再次进入当前场次"] },
  "LIVE-029": { 预期结果: ["用户被踢出后，原购票消费明细保留"] },
  "LIVE-030": { 预期结果: ["当前密码验证通过后进入目标密码房"] },
  "LIVE-033": { 预期结果: ["密码输入面板关闭"] },
  "LIVE-034": { 预期结果: ["修改密码后，旧密码验证失败"] },
  "LIVE-035": { 预期结果: ["修改密码后，新密码验证通过"] },
  "LIVE-036": { 预期结果: ["从已知可见入口打开隐藏密码房时仍需验证房间密码"] },
  "LIVE-037": { 预期结果: ["当前用户与主播建立关注关系"] },
  "LIVE-039": { 预期结果: ["公屏消息发送成功后输入框清空"] },
  "LIVE-040": { 预期结果: ["输入空白内容时公屏不新增消息"] },
  "LIVE-045": { 预期结果: ["页面进入当前直播间主播的主页"] },
  "LIVE-046": { 预期结果: ["页面打开当前直播场次的在线观众列表"] },
  "LIVE-048": { 预期结果: ["页面离开当前直播间并返回直播广场"] },
  "LIVE-050": { 用例描述: "验证礼物面板的礼物信息", 验证用例子项: "礼物面板信息", 预期结果: ["礼物面板展示礼物图标、名称、金币价格、当前余额和充值入口"] },
  "LIVE-051": { 预期结果: ["赠送 1 个单价 20 金币的礼物后，用户余额 = 100 - 20 × 1 = 80 金币"] },
  "LIVE-055": { 预期结果: ["用户余额 19 金币小于礼物价格 20 金币时，目标礼物不送出"] },
  "LIVE-058": { 预期结果: ["连续赠送 5 个单价 20 金币的礼物后，用户余额 = 200 - 20 × 5 = 100 金币"] },
  "LIVE-065": { 预期结果: ["未选择举报原因时提交按钮不可用"] },
  "LIVE-082": { 预期结果: ["取消禁言确认后，目标用户的禁言状态不变"] },
  "LIVE-083": { 预期结果: ["房管踢出用户后，目标用户在当前场次不得再次进入"] },
  "LIVE-090": { 预期结果: ["保存后开播设置页回显新的直播标题"] },
  "LIVE-091": { 预期结果: ["空标题无法保存，页面提示“请设置直播标题”"] },
  "LIVE-094": { 预期结果: ["开播设置页使用所选图片作为本场封面预览"] },
  "LIVE-096": { 预期结果: ["选择“唱歌”后，开播设置页回显该分类"] },
  "LIVE-097": { 预期结果: ["普通房设置保存后房型回显为“普通”"] },
  "LIVE-098": { 预期结果: ["门票价格为空时页面提示“请设置门票价格”"] },
  "LIVE-099": { 预期结果: ["房间密码为空时页面提示“请设置房间密码”"] },
  "LIVE-100": { 预期结果: ["主播关闭“在广场展示”后，直播广场不展示该密码房"] },
  "LIVE-104": { 预期结果: ["切换标签后“磨皮”参数仍为 70"] },
  "LIVE-105": { 预期结果: ["切换标签后“大眼”参数仍为 30"] },
  "LIVE-106": { 预期结果: ["点击重置后，全部美颜和美型参数恢复为 50"] },
  "LIVE-121": { 预期结果: ["主播对同一非好友观众发送第 4 条本场私信时，该消息不发送"] },
  "LIVE-123": { 预期结果: ["观众回复本场直播间私信后，双方建立好友关系"] },
  "LIVE-124": { 预期结果: ["直播结束后，未建立好友关系的观众不得回复历史直播间私信"] },
  "LIVE-129": { 预期结果: ["已有 3 名房管时，第 4 名用户不得获得房管权限"] },
  "LIVE-138": { 预期结果: ["主播踢出用户后，目标用户在当前场次不得再次进入"] },
  "LIVE-149": { 预期结果: ["主播清屏后，当前公屏已展示的互动消息被移除"] },
  "LIVE-150": { 预期结果: ["取消结束直播后，当前场次仍保持直播中"] },
  "LIVE-151": { 预期结果: ["主播确认结束后，当前直播场次关闭"] },
  "LIVE-169": { 预期结果: ["门票房不提供可用的连麦或 PK 入口"] },
  "LIVE-170": { 用例描述: "验证密码房 PK 入口不可用", 验证用例子项: "密码房 PK 入口状态", 预期结果: ["密码房保留置灰且不可用的“PK”按钮"] },
  "LIVE-171": { 预期结果: ["两人连麦状态下第三位主播不得加入当前连麦"] },
  "LIVE-176": { 预期结果: ["观众结束页展示“Sari 的直播已结束”"] },
  "LIVE-181": { 用例描述: "验证普通房主播直播设置菜单", 验证用例子项: "普通房直播设置菜单", 预期结果: ["直播设置菜单展示美颜设置、禁言列表、房间密码、清屏和转至粉丝群"] },
  "LIVE-182": { 用例描述: "验证主播查看禁言用户列表", 验证用例子项: "禁言用户列表范围", 预期结果: ["“禁言用户”列表仅展示已被禁言的用户"] },
  "LIVE-184": { 操作步骤: ["打开房间密码面板", "输入新的 8 位数字密码", "点击“保存密码”"], 预期结果: ["房间密码更新为输入的 8 位数字"] },
  "LIVE-187": { 用例描述: "验证按 ID 或昵称筛选收到的连麦邀请", 验证用例子项: "收到的邀请筛选", 操作步骤: ["打开“连麦主播”面板", "输入已收到邀请的主播 ID", "改为输入该主播昵称"], 预期结果: ["两种搜索方式均只展示与目标主播匹配的已收到邀请"] },
  "LIVE-189": { 预期结果: ["“收到的邀请”列表同时展示多条待处理连麦邀请"] },
  "LIVE-190": { 预期结果: ["普通房的房间密码入口置灰且不打开密码编辑面板"] },
  "LIVE-191": { 预期结果: ["点击密码房的“PK”按钮后提示“密码房无法发起连麦”"] },
  "LIVE-192": { 预期结果: ["连麦中的房间密码入口置灰且不打开密码编辑面板"] },
  "LIVE-214": { 用例描述: "验证开播倒计时结束后的成功提示", 验证用例子项: "开播成功提示", 预期结果: ["倒计时结束后页面提示“已开始直播”"] },
};

const structureOrder = ["直播广场", "普通房进房", "门票房进房", "密码房进房", "观众互动", "直播送礼", "直播间粉丝团", "直播间举报", "开播设置", "开播控制", "主播直播间", "房管协助管理", "主播连麦", "结束直播"];

let cases = seed.测试用例
  .filter((item) => !removedCaseIds.has(item.用例编号))
  .map((item) => ({ ...item, ...(caseUpdates[item.用例编号] ?? {}), _order: item.序号 }));

function addCase({ structure, type = "功能需求", priority = "P2", description, point, pre, steps, expected, flow = "", notes }) {
  cases.push({
    功能模块: "用户App-直播模块", 功能结构: structure, 用例类型: type, 优先级: priority,
    用例描述: description, 验证用例子项: point, 前置条件: pre, 操作步骤: steps,
    预期结果: [expected], 流程编号: flow, 测试结果: "未测", 测试人员: "", 备注: notes,
    _order: 10000 + cases.length,
  });
}

addCase({ structure: "直播广场", priority: "P1", description: "验证直播广场仅提供两个列表 Tab", point: "直播列表 Tab 范围", pre: ["用户已进入直播广场"], steps: ["查看直播列表顶部 Tab"], expected: "列表顶部仅展示“热门”和“新人”两个 Tab", notes: [REQ, PLAZA] });
addCase({ structure: "直播广场", priority: "P1", description: "验证关注且正在直播的主播展示在头像栏", point: "关注直播头像栏", pre: ["用户已关注 Sari", "Sari 正在直播"], steps: ["进入直播广场", "查看 Tab 上方的头像栏"], expected: "Tab 上方的头像栏展示 Sari 的直播头像入口", notes: [REQ, SPEC, PLAZA] });
addCase({ structure: "直播广场", type: "业务流程", priority: "P1", description: "验证从关注直播头像进入房间", point: "关注直播头像进房", pre: ["关注直播头像栏展示 Sari"], steps: ["点击 Sari 的头像"], expected: "页面进入 Sari 的直播间", notes: [REQ, PLAZA] });
addCase({ structure: "直播广场", priority: "P1", description: "验证普通房卡片展示在线人数", point: "普通房在线人数", pre: ["广场存在普通房卡片"], steps: ["查看目标普通房卡片"], expected: "目标普通房卡片展示在线人数", notes: [REQ, PLAZA] });
addCase({ structure: "直播广场", priority: "P1", description: "验证门票房卡片展示门票标识", point: "门票房标识", pre: ["广场存在门票房卡片"], steps: ["查看目标门票房卡片"], expected: "目标卡片展示门票金币价格标识", notes: [REQ, PLAZA] });
addCase({ structure: "直播广场", priority: "P1", description: "验证密码房卡片展示锁定标识", point: "密码房锁定标识", pre: ["广场存在可见的密码房卡片"], steps: ["查看目标密码房卡片"], expected: "目标密码房卡片展示锁定标识", notes: [REQ, PLAZA] });
addCase({ structure: "直播广场", priority: "P1", description: "验证密码房卡片隐藏在线人数", point: "密码房在线人数隐藏", pre: ["广场存在可见的密码房卡片"], steps: ["查看目标密码房卡片"], expected: "目标密码房卡片不展示在线人数", notes: [REQ, PLAZA] });
addCase({ structure: "直播广场", priority: "P2", description: "验证广场空状态提供去发现入口", point: "广场空状态入口", pre: ["当前列表范围没有正在直播的房间"], steps: ["进入直播广场"], expected: "空状态区域展示“去发现”按钮", notes: [REQ] });

addCase({ structure: "普通房进房", type: "业务流程", priority: "P0", description: "验证进入普通房后自动播放", point: "普通房自动播放", pre: ["目标普通房正在直播"], steps: ["从广场点击目标普通房卡片"], expected: "进入直播间后直播画面自动开始播放", notes: [REQ] });

addCase({ structure: "门票房进房", priority: "P1", description: "验证点击门票房打开购票面板", point: "购买门票面板", pre: ["广场存在 Maya 的门票房"], steps: ["点击 Maya 的门票房卡片"], expected: "页面底部打开“购买门票”面板", notes: [PLAZA] });
addCase({ structure: "门票房进房", priority: "P1", description: "验证购票面板显示房间与价格", point: "购票房间与价格", pre: ["Maya 的购票面板已打开"], steps: ["查看门票商品信息"], expected: "面板展示“Maya 的专场”、“入场门票 × 1”和对应金币价格", notes: [PLAZA] });
addCase({ structure: "门票房进房", priority: "P2", description: "验证购票面板的充值入口", point: "购票充值入口", pre: ["购票面板已打开"], steps: ["点击金币余额旁的充值按钮"], expected: "页面提示“打开充值”", notes: [PLAZA] });
addCase({ structure: "门票房进房", priority: "P2", description: "验证关闭购票面板不进入房间", point: "取消购票", pre: ["购票面板已打开"], steps: ["点击关闭按钮"], expected: "购票面板关闭且页面停留在直播广场", notes: [PLAZA] });

addCase({ structure: "密码房进房", priority: "P1", description: "验证点击密码房打开密码面板", point: "密码输入面板", pre: ["广场存在可见密码房"], steps: ["点击目标密码房卡片"], expected: "页面打开“输入房间密码”面板", notes: [PLAZA] });
addCase({ structure: "密码房进房", priority: "P2", description: "验证密码面板显示目标房间", point: "密码面板房间信息", pre: ["Dewi 的密码面板已打开"], steps: ["查看密码面板房间信息"], expected: "密码面板展示 Dewi 的昵称和直播标题", notes: [PLAZA] });
addCase({ structure: "密码房进房", type: "逻辑校验", priority: "P1", description: "验证空密码时进房按钮不可用", point: "空密码按钮状态", pre: ["密码面板已打开"], steps: ["保持密码输入框为空", "查看“进入直播间”按钮"], expected: "“进入直播间”按钮保持不可用", notes: [PLAZA] });
addCase({ structure: "密码房进房", type: "逻辑校验", priority: "P1", description: "验证进房密码输入上限", point: "进房密码 8 位上限", pre: ["密码面板已打开"], steps: ["在密码输入框输入超过 8 位的内容"], expected: "密码输入框最多保留 8 位内容", notes: [REQ, PLAZA] });

addCase({ structure: "观众互动", priority: "P2", description: "验证关注主播后的页面提示", point: "关注主播提示", pre: ["用户正在观看 Sari 的直播", "用户未关注 Sari"], steps: ["点击主播信息区域的关注按钮"], expected: "页面提示“已关注 Sari”", notes: [VIEWER] });
addCase({ structure: "观众互动", priority: "P1", description: "验证观众更多功能不提供清屏", point: "观众端清屏入口移除", pre: ["用户以观众身份进入直播间"], steps: ["点击“…”打开更多功能", "查看功能入口"], expected: "观众端更多功能中不展示清屏入口", notes: [VIEWER] });
addCase({ structure: "观众互动", priority: "P2", description: "验证观众打开直播转发", point: "直播转发入口", pre: ["用户正在观看直播"], steps: ["打开更多功能", "点击“转发”"], expected: "页面提示“打开转发”", notes: [VIEWER] });

addCase({ structure: "直播送礼", priority: "P1", description: "验证礼物面板的三个分类", point: "礼物分类范围", pre: ["礼物面板已打开"], steps: ["查看礼物分类 Tab"], expected: "礼物面板展示“幸运”“普通”和“定制”三个 Tab", notes: [REQ, VIEWER] });
addCase({ structure: "直播送礼", type: "逻辑校验", priority: "P1", description: "验证礼物赠送数量选项", point: "赠送数量固定选项", pre: ["礼物面板已打开"], steps: ["打开赠送数量菜单"], expected: "数量菜单仅展示 x1、x10、x66、x188 和 x520", notes: [REQ, VIEWER] });
addCase({ structure: "直播送礼", priority: "P2", description: "验证选择礼物赠送数量", point: "赠送数量回显", pre: ["礼物面板已打开"], steps: ["打开赠送数量菜单", "选择 x66"], expected: "赠送数量按钮回显 66", notes: [VIEWER] });

addCase({ structure: "直播间举报", priority: "P1", description: "验证直播举报原因范围", point: "举报原因选项", pre: ["用户已进入直播举报页"], steps: ["查看举报原因列表"], expected: "页面展示“色情低俗”“涉及宗教政治”“暴恐血腥”“未成年有害”和“其他”五个原因", notes: [REQ, ANNO, REPORT] });
addCase({ structure: "直播间举报", priority: "P2", description: "验证选择举报原因后可以提交", point: "选择原因后提交状态", pre: ["直播举报页已打开", "尚未选择举报原因"], steps: ["选择“色情低俗”"], expected: "提交举报按钮变为可用", notes: [REPORT] });

addCase({ structure: "开播设置", type: "逻辑校验", priority: "P1", description: "验证开播设置页的密码输入提示", point: "开播密码提示", pre: ["主播已打开房型设置"], steps: ["选择“密码房”", "查看房间密码输入框"], expected: "密码输入框提示“设置 4-12 位密码”", notes: [REQ, START] });
addCase({ structure: "开播设置", type: "逻辑校验", priority: "P1", description: "验证开播设置页的密码输入上限", point: "开播密码 12 位上限", pre: ["主播已选择密码房"], steps: ["在房间密码输入框输入超过 12 位的内容"], expected: "房间密码输入框最多保留 12 位内容", notes: [REQ, START] });
addCase({ structure: "开播设置", priority: "P2", description: "验证选择直播封面后的提示", point: "封面选择提示", pre: ["主播已进入开播设置", "已准备一张可选择的图片"], steps: ["选择该图片作为直播封面"], expected: "页面提示“已选择封面：【文件名】”", notes: [START] });
addCase({ structure: "开播设置", priority: "P2", description: "验证重置美颜后清除选中项", point: "美颜选中项重置", pre: ["美颜和美型均已选择调整项"], steps: ["点击“重置”"], expected: "美颜和美型的当前选中项均被清除", notes: [REQ, ANNO, START] });
addCase({ structure: "开播设置", type: "业务流程", priority: "P0", description: "验证点击开始直播后进入三秒倒计时", point: "开播三秒倒计时", pre: ["开播设置已填写可保存的内容"], steps: ["点击“开始直播”"], expected: "开播遮罩首先显示数字 3 和“准备开播”", notes: [REQ, START] });
addCase({ structure: "开播设置", priority: "P1", description: "验证开播倒计时结束后显示进房入口", point: "倒计时后进房入口", pre: ["开播三秒倒计时已开始"], steps: ["等待倒计时结束"], expected: "页面显示“进入直播间”按钮", notes: [REQ, START] });
addCase({ structure: "开播设置", type: "业务流程", priority: "P0", description: "验证主播从开播结果进入直播间", point: "开播后进入主播房", pre: ["倒计时已结束", "页面已显示“进入直播间”按钮"], steps: ["点击“进入直播间”"], expected: "页面进入主播直播间", notes: [REQ, START] });

addCase({ structure: "主播直播间", priority: "P1", description: "验证恢复发言的第一次确认", point: "恢复发言首次确认", pre: ["禁言用户列表存在 Nila"], steps: ["点击 Nila 的“恢复发言”"], expected: "页面显示“是否恢复用户在直播间评论发言”确认框", notes: [ANNO, HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证恢复发言需要第二次确认", point: "恢复发言二次确认", pre: ["恢复发言的首次确认框已打开"], steps: ["点击“恢复”"], expected: "页面再次显示恢复发言确认框", notes: [REQ, ANNO, HOST] });
addCase({ structure: "主播直播间", priority: "P2", description: "验证取消恢复发言后保留禁言", point: "取消恢复发言", pre: ["恢复发言确认框已打开", "Nila 当前处于禁言状态"], steps: ["点击“取消”"], expected: "Nila 仍保持禁言状态", notes: [ANNO, HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证密码房展示当前房间密码", point: "当前房间密码回显", pre: ["主播正在密码房直播"], steps: ["打开直播设置", "点击“房间密码”"], expected: "房间密码面板回显当前房间密码", notes: [REQ, ANNO, HOST_PASSWORD] });
addCase({ structure: "主播直播间", type: "逻辑校验", priority: "P1", description: "验证直播中修改密码的 8 位数字校验", point: "修改密码格式校验", pre: ["密码房的房间密码面板已打开"], steps: ["输入非 8 位数字的新密码", "点击“保存密码”"], expected: "页面提示“请输入 8 位数字密码”", notes: [REQ, ANNO, HOST_PASSWORD] });
addCase({ structure: "主播直播间", priority: "P2", description: "验证取消转发粉丝群", point: "取消转发粉丝群", pre: ["转发粉丝群确认框已打开"], steps: ["点击“取消”"], expected: "转发确认框关闭且未发送直播间卡片", notes: [HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证点击评论显示屏蔽入口", point: "屏蔽评论入口", pre: ["主播直播间公屏存在观众评论"], steps: ["点击目标观众评论"], expected: "目标评论旁显示“屏蔽此评论”按钮", notes: [REQ, ANNO, HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证屏蔽当前评论", point: "当前评论移除", pre: ["目标评论已显示“屏蔽此评论”按钮"], steps: ["点击“屏蔽此评论”"], expected: "目标评论从当前公屏移除", notes: [REQ, ANNO, HOST] });
addCase({ structure: "主播直播间", priority: "P2", description: "验证屏蔽评论成功提示", point: "屏蔽评论提示", pre: ["目标评论已显示“屏蔽此评论”按钮"], steps: ["点击“屏蔽此评论”"], expected: "页面提示“已屏蔽此评论”", notes: [HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证主播用户卡提供管理操作", point: "主播用户卡操作范围", pre: ["主播直播间存在在线观众"], steps: ["点击观众头像", "查看用户卡操作栏"], expected: "用户卡提供举报、禁言、踢出、拉黑和设为房管操作", notes: [REQ, ANNO, HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证主播直接发送答谢", point: "答谢成功提示", pre: ["主播已打开 Maya 的用户卡"], steps: ["点击“答谢”"], expected: "页面提示“已向 Maya 发送答谢”", notes: [REQ, HOST] });
addCase({ structure: "主播直播间", priority: "P1", description: "验证答谢不打开礼物面板", point: "答谢不选礼", pre: ["主播已打开 Maya 的用户卡"], steps: ["点击“答谢”"], expected: "页面不打开礼物选择面板", notes: [REQ, HOST] });

addCase({ structure: "主播连麦", priority: "P1", description: "验证普通房 PK 入口打开连麦面板", point: "PK 入口打开连麦", pre: ["主播正在普通房直播"], steps: ["点击“PK”"], expected: "页面打开标题为“连麦主播”的面板", notes: [REQ, COHOST] });
addCase({ structure: "主播连麦", priority: "P1", description: "验证连麦面板仅展示收到的邀请", point: "连麦面板当前范围", pre: ["“连麦主播”面板已打开"], steps: ["查看面板内容"], expected: "面板只展示“收到的邀请”列表", notes: [REQ, COHOST] });
addCase({ structure: "主播连麦", priority: "P1", description: "验证连麦面板不提供主动发起入口", point: "主动连麦入口缺省", pre: ["“连麦主播”面板已打开"], steps: ["查看面板全部操作"], expected: "面板不展示主动发起或取消连麦邀请的操作", notes: [REQ, COHOST] });
addCase({ structure: "主播连麦", priority: "P2", description: "验证连麦邀请筛选无结果", point: "连麦邀请筛选空状态", pre: ["“连麦主播”面板已打开"], steps: ["输入与已收到邀请都不匹配的内容"], expected: "邀请列表展示“暂无收到的邀请”", notes: [COHOST] });

addCase({ structure: "结束直播", priority: "P1", description: "验证结束直播前的确认内容", point: "结束直播确认", pre: ["主播正在直播"], steps: ["点击右上角结束按钮"], expected: "页面显示“更多观众正在赶来，是否结束直播？”确认框", notes: [HOST] });

// 收敛最小冒烟集，并把旧数据中的复合观察结果拆为独立用例。
cases = cases.filter((item) => item.用例描述 !== "验证开播后进入主播直播间");
const caseByPoint = (point) => {
  const item = cases.find((candidate) => candidate.验证用例子项 === point);
  assert(item, `未找到验证点：${point}`);
  return item;
};
for (const point of ["直播卡片通用信息", "普通房自动播放", "公屏文字展示", "用户扣费与余额", "开播三秒倒计时"]) {
  caseByPoint(point).优先级 = "P1";
}

caseByPoint("上拉加载").预期结果 = ["列表追加后续直播数据"];
addCase({ structure: "直播广场", type: "逻辑校验", priority: "P2", description: "验证上拉加载不重复已有直播卡片", point: "上拉加载去重", pre: ["直播广场已展示首批直播卡片", "后续页包含与首批相同的直播标识"], steps: ["上拉直播列表触发加载", "查看加载后的卡片"], expected: "同一直播标识在列表中只展示一次", notes: [REQ, PLAZA] });
Object.assign(caseByPoint("下拉刷新"), {
  前置条件: ["直播广场已加载", "服务端新增一场正在直播的房间"],
  预期结果: ["刷新后的列表展示服务端新增的直播房间"],
});
caseByPoint("下拉刷新").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "直播广场", type: "逻辑校验", priority: "P2", description: "验证下拉刷新移除已结束直播", point: "下拉刷新移除结束场次", pre: ["直播广场已展示目标直播房间", "服务端已结束目标直播场次"], steps: ["在直播列表顶部向下拖动并释放", "等待刷新完成"], expected: "刷新后的列表不再展示已结束的目标直播房间", notes: [REQ, PRECONDITION_AUDIT] });

caseByPoint("取消购票").预期结果 = ["购票面板关闭"];
addCase({ structure: "门票房进房", priority: "P2", description: "验证取消购票后不进入直播间", point: "取消购票进房结果", pre: ["购票面板已打开"], steps: ["点击关闭按钮"], expected: "用户不进入目标门票房", notes: [PLAZA] });

caseByPoint("公屏文字展示").预期结果 = ["公屏新增当前用户发送的文字消息"];
for (const point of ["公屏文字展示", "发送后输入区复位"]) {
  caseByPoint(point).前置条件 = ["用户已进入直播间", "用户未被禁言", "用户账号未被平台封禁"];
  caseByPoint(point).备注.push(PRECONDITION_AUDIT);
}
addCase({ structure: "观众互动", priority: "P1", description: "验证公屏消息的发送者信息", point: "公屏发送者标识", pre: ["当前用户具有昵称和已有身份标识", "用户已进入直播间"], steps: ["输入“今晚的歌很好听”", "点击“发送”"], expected: "新公屏消息展示当前用户昵称及已有身份标识", notes: [REQ, VIEWER] });
caseByPoint("评论 80 字边界").预期结果 = ["公屏完整展示本次提交的 80 个字符"];
caseByPoint("禁言发送限制").预期结果 = ["评论输入区域显示“已被禁言”"];
for (const point of ["禁言发送限制", "禁言历史消息"]) {
  caseByPoint(point).前置条件 = ["用户已被主播设置为当前场次禁言"];
  caseByPoint(point).备注.push(PRECONDITION_AUDIT);
}
caseByPoint("本场贡献榜").前置条件 = ["当前场次已有用户送礼贡献记录"];
caseByPoint("本场贡献榜").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "观众互动", type: "逻辑校验", priority: "P1", description: "验证禁言用户发送的内容不进入公屏", point: "禁言发送拦截", pre: ["当前用户已被主播禁言", "用户正在直播间"], steps: ["尝试输入并发送评论"], expected: "公屏不新增当前用户的评论", notes: [REQ, PERM, VIEWER] });

caseByPoint("粉丝团与群籍建立").预期结果 = ["直播间粉丝团状态更新为“已加入”"];
addCase({ structure: "直播间粉丝团", type: "业务流程", priority: "P1", description: "验证加入粉丝团后建立团籍", point: "粉丝团团籍建立", pre: ["用户未加入 Sari 粉丝团", "用户满足加入条件"], steps: ["在 Sari 直播间点击“加入粉丝团”", "完成加入操作", "查看用户的粉丝团列表"], expected: "用户的粉丝团列表新增 Sari 粉丝团", notes: [REQ, ROLE] });
addCase({ structure: "直播间粉丝团", type: "业务流程", priority: "P1", description: "验证加入粉丝团后建立群籍", point: "粉丝群群籍建立", pre: ["用户未加入 Sari 粉丝团", "用户满足加入条件"], steps: ["在 Sari 直播间点击“加入粉丝团”", "完成加入操作", "查看 Sari 粉丝群成员"], expected: "Sari 粉丝群成员中新增当前用户", notes: [REQ, ROLE] });
Object.assign(caseByPoint("举报关系无副作用"), {
  用例描述: "验证举报主播不改变关注关系",
  验证用例子项: "举报后关注关系保持",
  前置条件: ["用户已关注目标主播", "用户已登录"],
  操作步骤: ["提交目标主播的直播间举报", "举报成功后查看关注状态"],
  预期结果: ["举报完成后，用户与目标主播的关注关系保持不变"],
});
caseByPoint("举报后关注关系保持").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "直播间举报", type: "逻辑校验", priority: "P2", description: "验证举报用户不改变好友关系", point: "举报后好友关系保持", pre: ["当前用户与目标用户已是好友", "当前用户已登录"], steps: ["从目标用户资料卡提交用户举报", "举报成功后查看好友关系"], expected: "举报完成后，当前用户与目标用户的好友关系保持不变", notes: [PERM, REPORT, PRECONDITION_AUDIT] });
addCase({ structure: "直播间举报", type: "逻辑校验", priority: "P2", description: "验证举报主播不改变粉丝团团籍", point: "举报后粉丝团团籍保持", pre: ["用户已加入目标主播的粉丝团", "用户已登录"], steps: ["提交目标主播的直播间举报", "举报成功后查看粉丝团列表"], expected: "举报完成后，用户在目标主播粉丝团中的团籍保持不变", notes: [PERM, REPORT, PRECONDITION_AUDIT] });

for (const point of ["补充说明 200 字边界", "补充说明超长限制", "补充说明提交"]) {
  caseByPoint(point).前置条件 = ["用户已进入直播举报页面", "已选择举报原因"];
  caseByPoint(point).备注.push(PRECONDITION_AUDIT);
}
addCase({ structure: "直播间举报", type: "逻辑校验", priority: "P2", description: "验证用户举报补充说明可以输入 200 字", point: "用户举报补充说明 200 字边界", pre: ["用户已进入用户举报页面", "已选择举报原因"], steps: ["在补充说明输入 200 个字符"], expected: "输入框保留前 200 个字符", notes: [REPORT, PRECONDITION_AUDIT] });
addCase({ structure: "直播间举报", type: "逻辑校验", priority: "P2", description: "验证用户举报补充说明第 201 字被限制", point: "用户举报补充说明超长限制", pre: ["用户已进入用户举报页面", "已选择举报原因"], steps: ["在补充说明输入 200 个字符", "继续输入第 201 个字符"], expected: "第 201 个字符不进入输入框", notes: [REPORT, PRECONDITION_AUDIT] });
addCase({ structure: "直播间举报", type: "逻辑校验", priority: "P2", description: "验证用户举报的 200 字补充说明可以提交", point: "用户举报补充说明提交", pre: ["用户已进入用户举报页面", "已选择举报原因"], steps: ["输入 200 个字符", "点击“提交”"], expected: "已有 200 个字符可随用户举报原因一并提交", notes: [REPORT, PRECONDITION_AUDIT] });

caseByPoint("直播标题必填").预期结果 = ["页面提示“请设置直播标题”"];
caseByPoint("直播标题必填").操作步骤 = ["清空标题", "点击“保存”"];
caseByPoint("直播标题必填").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "开播设置", type: "逻辑校验", priority: "P1", description: "验证全空格直播标题触发必填提示", point: "全空格标题必填", pre: ["主播已进入开播设置"], steps: ["将直播标题填写为全空格", "点击“保存”"], expected: "页面提示“请设置直播标题”", notes: [REQ, START, PRECONDITION_AUDIT] });
addCase({ structure: "开播设置", type: "逻辑校验", priority: "P1", description: "验证空直播标题不写入开播设置", point: "空标题保存拦截", pre: ["主播已打开直播标题编辑"], steps: ["清空标题", "点击“保存”"], expected: "开播设置页不回显空标题为已保存主题", notes: [REQ, START, PRECONDITION_AUDIT] });
addCase({ structure: "开播设置", type: "逻辑校验", priority: "P1", description: "验证全空格直播标题不写入开播设置", point: "全空格标题保存拦截", pre: ["主播已打开直播标题编辑"], steps: ["将直播标题填写为全空格", "点击“保存”"], expected: "开播设置页不回显全空格标题为已保存主题", notes: [REQ, START, PRECONDITION_AUDIT] });
caseByPoint("标题 40 字边界").预期结果 = ["保存后开播设置页完整回显 40 个字符的标题"];
caseByPoint("普通房灰度隔离").预期结果 = ["房型设置保存为普通房"];
caseByPoint("门票房有效设置").预期结果 = ["房型设置保存为门票房"];
addCase({ structure: "开播设置", priority: "P1", description: "验证门票房价格保存后回显", point: "门票房价格回显", pre: ["主播已保存价格为 10 金币的门票房设置"], steps: ["再次打开房型设置"], expected: "门票价格回显为 10 金币", notes: [REQ, START] });
caseByPoint("密码房有效设置").预期结果 = ["房型设置保存为密码房"];
addCase({ structure: "开播设置", priority: "P1", description: "验证密码房可见范围保存后回显", point: "密码房可见范围回显", pre: ["主播已保存密码房的广场展示和粉丝授权设置"], steps: ["再次打开房型设置"], expected: "页面回显上次保存的密码房可见范围", notes: [REQ, START] });

caseByPoint("消费收益流水关联").预期结果 = ["消费流水和收益流水使用同一直播场次标识"];
Object.assign(caseByPoint("隐藏房间仍校验密码"), {
  前置条件: ["主播关闭密码房的广场展示", "用户通过已知房间号找到该房间"],
  操作步骤: ["点击房间号对应的密码房入口"],
  预期结果: ["从房间号入口打开隐藏密码房时仍需验证房间密码"],
});
caseByPoint("隐藏房间仍校验密码").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "密码房进房", type: "逻辑校验", priority: "P1", description: "验证粉丝授权入口不绕过密码校验", point: "粉丝授权入口仍校验密码", pre: ["主播关闭密码房的广场展示", "当前用户在主播授权可见的粉丝名单中"], steps: ["从粉丝授权入口打开目标密码房"], expected: "从粉丝授权入口打开隐藏密码房时仍需验证房间密码", notes: [REQ, START, PRECONDITION_AUDIT] });

for (const point of ["平台直播权限限制", "直播权限关闭原因", "直播权限优先级"]) {
  caseByPoint(point).前置条件 = ["主播认证已通过", "平台已关闭该主播直播权限"];
  caseByPoint(point).备注.push(PRECONDITION_AUDIT);
}
caseByPoint("直播权限优先级").预期结果 = ["工会侧开启操作不能覆盖平台关闭状态"];

Object.assign(caseByPoint("长期房管权限"), { 操作步骤: ["在房管设置中输入目标用户 ID", "开启“设为房管”"] });
Object.assign(caseByPoint("房管授权记录"), { 操作步骤: ["在房管设置中输入目标用户 ID", "开启“设为房管”"] });
for (const point of ["长期房管权限", "房管授权记录"]) caseByPoint(point).备注.push(PRECONDITION_AUDIT);

Object.assign(caseByPoint("黑名单用户房管限制"), {
  前置条件: ["主播正在直播", "目标用户已在该主播直播间黑名单内", "主播与目标用户不存在账号拉黑关系"],
  操作步骤: ["打开房管设置", "尝试将目标用户设置为房管"],
});
Object.assign(caseByPoint("黑名单关系保持"), {
  前置条件: ["主播正在直播", "目标用户已在该主播直播间黑名单内", "主播与目标用户不存在账号拉黑关系"],
  操作步骤: ["打开房管设置", "尝试将目标用户设置为房管", "查看直播间黑名单"],
});
Object.assign(caseByPoint("账号拉黑房管限制"), {
  前置条件: ["主播正在直播", "主播与目标用户存在账号拉黑关系", "目标用户不在该主播直播间黑名单内"],
  操作步骤: ["打开房管设置", "尝试将目标用户设置为房管"],
});
Object.assign(caseByPoint("账号拉黑关系保持"), {
  前置条件: ["主播正在直播", "主播与目标用户存在账号拉黑关系", "目标用户不在该主播直播间黑名单内"],
  操作步骤: ["打开房管设置", "尝试将目标用户设置为房管", "查看账号拉黑关系"],
});
for (const point of ["黑名单用户房管限制", "黑名单关系保持", "账号拉黑房管限制", "账号拉黑关系保持"]) caseByPoint(point).备注.push(PRECONDITION_AUDIT);

Object.assign(caseByPoint("直播间黑名单进房限制"), {
  前置条件: ["目标用户当前可以进入该主播直播间", "主播与目标用户不存在账号拉黑关系"],
  操作步骤: ["主播将目标用户加入直播间黑名单", "目标用户尝试进入该主播当前及后续直播间"],
});
Object.assign(caseByPoint("直播间黑名单作用域"), {
  用例描述: "验证直播间黑名单不影响私信",
  验证用例子项: "直播间黑名单私信隔离",
  前置条件: ["主播与目标用户不存在账号拉黑关系", "目标用户当前可以发送私信"],
  操作步骤: ["主播将目标用户加入直播间黑名单", "目标用户向主播发送私信"],
  预期结果: ["仅加入直播间黑名单不阻止目标用户向主播发送私信"],
});
caseByPoint("直播间黑名单进房限制").备注.push(PRECONDITION_AUDIT);
caseByPoint("直播间黑名单私信隔离").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "主播直播间", type: "逻辑校验", priority: "P1", description: "验证直播间黑名单不影响好友申请", point: "直播间黑名单好友申请隔离", pre: ["主播与目标用户不存在账号拉黑关系", "目标用户当前可以发起好友申请"], steps: ["主播将目标用户加入直播间黑名单", "目标用户向主播发起好友申请"], expected: "仅加入直播间黑名单不阻止目标用户向主播发起好友申请", notes: [ROLE, PERM, PRECONDITION_AUDIT] });
caseByPoint("解除直播间黑名单").前置条件 = ["目标用户在该主播直播间黑名单内", "双方不存在账号拉黑关系", "双方账号均未被平台封禁"];
caseByPoint("解除直播间黑名单").备注.push(PRECONDITION_AUDIT);

Object.assign(caseByPoint("账号拉黑进房限制"), {
  前置条件: ["主播与目标用户不存在账号拉黑关系", "目标用户当前可以进入该主播直播间", "目标用户不在该主播直播间黑名单内"],
  操作步骤: ["主播拉黑目标用户账号", "目标用户尝试进入该主播直播间"],
});
Object.assign(caseByPoint("账号拉黑社交限制"), {
  用例描述: "验证账号拉黑限制私信",
  验证用例子项: "账号拉黑私信限制",
  前置条件: ["主播与目标用户不存在账号拉黑关系", "双方当前可以发送私信"],
  操作步骤: ["主播拉黑目标用户账号", "双方尝试发送私信"],
  预期结果: ["主播与目标用户之间不能继续发送私信"],
});
Object.assign(caseByPoint("账号拉黑团籍保持"), {
  前置条件: ["主播与目标用户不存在账号拉黑关系", "目标用户已加入该主播粉丝团"],
  操作步骤: ["主播拉黑目标用户账号", "检查目标用户的粉丝团团籍"],
});
caseByPoint("账号拉黑进房限制").备注.push(PRECONDITION_AUDIT);
caseByPoint("账号拉黑私信限制").备注.push(PRECONDITION_AUDIT);
caseByPoint("账号拉黑团籍保持").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "主播直播间", type: "逻辑校验", priority: "P1", description: "验证账号拉黑限制好友申请", point: "账号拉黑好友申请限制", pre: ["主播与目标用户不存在账号拉黑关系", "双方当前可以发起好友申请"], steps: ["主播拉黑目标用户账号", "双方尝试发起好友申请"], expected: "主播与目标用户之间不能继续发起或处理好友申请", notes: [ROLE, PERM, PRECONDITION_AUDIT] });

caseByPoint("禁言用户列表范围").前置条件 = ["主播正在直播", "当前场次同时存在一名已禁言用户和一名已踢出用户"];
caseByPoint("禁言用户列表范围").备注.push(PRECONDITION_AUDIT);
caseByPoint("举报原因必选").操作步骤 = ["保持举报原因未选择", "保持补充说明为空", "观察“提交”按钮"];
caseByPoint("举报原因必选").备注.push(PRECONDITION_AUDIT);
caseByPoint("主播主页入口").操作步骤 = ["点击直播间顶部主播头像"];
caseByPoint("在线观众列表").操作步骤 = ["点击直播间在线人数入口"];
caseByPoint("直播间清屏").操作步骤 = ["打开直播设置", "点击“清屏”"];
for (const point of ["主播主页入口", "在线观众列表", "直播间清屏"]) caseByPoint(point).备注.push(PRECONDITION_AUDIT);

Object.assign(caseByPoint("门票房连麦限制"), {
  用例描述: "验证门票房不提供可用连麦入口",
  验证用例子项: "门票房连麦入口限制",
  前置条件: ["主播正在门票房直播"],
  操作步骤: ["进入门票房主播端", "查看连麦入口"],
  预期结果: ["门票房不提供可用的连麦入口"],
});
caseByPoint("门票房连麦入口限制").备注.push(PRECONDITION_AUDIT);
addCase({ structure: "主播连麦", type: "逻辑校验", priority: "P1", description: "验证门票房不提供可用 PK 入口", point: "门票房 PK 入口限制", pre: ["主播正在门票房直播"], steps: ["进入门票房主播端", "查看 PK 入口"], expected: "门票房不提供可用的 PK 入口", notes: [REQ, ANNO, PRECONDITION_AUDIT] });
caseByPoint("密码房 PK 入口状态").前置条件 = ["主播正在密码房直播"];
caseByPoint("密码房 PK 入口状态").操作步骤 = ["进入密码房主播端", "查看“PK”入口"];
caseByPoint("密码房 PK 入口状态").备注.push(PRECONDITION_AUDIT);
caseByPoint("取消房管").预期结果 = ["目标用户的房管权限被取消"];
caseByPoint("解除直播间黑名单").预期结果 = ["目标用户恢复进入该主播直播间的资格"];
caseByPoint("普通房密码入口限制").预期结果 = ["普通房的房间密码入口置灰"];
addCase({ structure: "主播直播间", priority: "P2", description: "验证普通房不打开密码编辑面板", point: "普通房密码面板拦截", pre: ["主播正在普通房直播"], steps: ["打开直播设置", "点击置灰的“房间密码”入口"], expected: "页面不打开密码编辑面板", notes: [REQ, HOST] });
caseByPoint("取消转发粉丝群").预期结果 = ["转发确认框关闭"];
addCase({ structure: "主播直播间", priority: "P2", description: "验证取消转发后不发送直播间卡片", point: "取消转发发送结果", pre: ["转发粉丝群确认框已打开"], steps: ["点击“取消”", "查看目标粉丝群"], expected: "目标粉丝群不新增本场直播卡片", notes: [HOST] });
caseByPoint("连麦中密码入口限制").预期结果 = ["连麦中的房间密码入口置灰"];
addCase({ structure: "主播连麦", priority: "P2", description: "验证连麦中不打开密码编辑面板", point: "连麦中密码面板拦截", pre: ["主播正在两人连麦", "直播设置菜单已打开"], steps: ["点击置灰的“房间密码”入口"], expected: "页面不打开密码编辑面板", notes: [REQ, COHOST] });

cases.sort((a, b) => structureOrder.indexOf(a.功能结构) - structureOrder.indexOf(b.功能结构) || a._order - b._order);
cases = cases.map((item, index) => {
  const result = { ...item, 序号: index + 1, 用例编号: `LIVE-${String(index + 1).padStart(3, "0")}` };
  delete result._order;
  if (!result.备注.includes(SYNC)) result.备注.push(SYNC);
  if (result.流程编号) {
    const flowObjects = {
      "FLOW-LIVE-001": "共同业务对象：同一直播场次",
      "FLOW-LIVE-002": "共同业务对象：同一门票房场次和购票资格",
      "FLOW-LIVE-003": "共同业务对象：同一密码房场次",
      "FLOW-LIVE-004": "共同业务对象：同一礼物赠送记录",
      "FLOW-LIVE-005": "共同业务对象：同一主播连麦会话",
    };
    if (!result.备注.some((note) => note.startsWith("共同业务对象："))) result.备注.push(flowObjects[result.流程编号]);
    if (!result.备注.some((note) => note.startsWith("流程阶段："))) result.备注.push(`流程阶段：${result.验证用例子项}`);
  }
  return result;
});

const removedQuestionIds = new Set(["Q-001-01", "Q-008-01", "Q-008-02", "Q-012-01"]);
const removedQuestionGroups = new Set(["RQ-015", "RQ-019", "RQ-020"]);
let questions = seed.需求待确认
  .filter((item) => !removedQuestionIds.has(item.问题编号) && !removedQuestionGroups.has(item.需求组编号))
  .map((item) => ({
    ...item,
    可选方案: item.可选方案.filter((option) => !option.startsWith("D. 其他：")),
    产品结论: "",
    结论补充: "",
    已有用例编号: [],
    确认后待补用例: item.确认后待补用例.length ? item.确认后待补用例 : [`补充或重审：${item.具体场景}`],
    确认状态: item.父问题编号 ? "待前置结论" : "待确认",
  }));

function addQuestion(item) {
  questions.push({
    父问题编号: "", 追问触发条件: "", 产品结论: "", 结论补充: "", 已有用例编号: [],
    期望确认时间: "进入对应功能测试前", 确认状态: "待确认", ...item,
  });
}

addQuestion({
  问题编号: "Q-024", 需求组编号: "RQ-024", 阻塞等级: "阻塞测试", 功能模块: "用户App-直播模块",
  具体场景: "主播在观众用户卡点击“答谢”，页面提示已发送答谢",
  问题分类: "业务规则", 待决策问题: "“答谢”成功后应产生哪一种可追溯的业务结果？",
  可选方案: ["A. 仅展示成功提示，不生成消息、礼物或记录", "B. 向目标观众发送一条固定答谢消息并生成消息记录", "C. 向目标观众发送一个固定免费答谢道具并生成道具记录"],
  测试建议: "建议 A；与当前原型只显示成功提示的行为一致，也不会误产生礼物扣款。",
  已知依据: ["原型点击答谢后只提示“已向【用户昵称】发送答谢”", "最新需求已明确不打开礼物选择面板"],
  影响范围: ["主播直播间用户卡", "观众收到的答谢内容", "答谢记录"], 确认后待补用例: ["答谢在观众端的展示与记录"], 负责人: "产品",
});
addQuestion({
  问题编号: "Q-025", 需求组编号: "RQ-025", 阻塞等级: "部分阻塞", 功能模块: "用户App-直播模块",
  具体场景: "主播在直播中点击清屏，主播端当前互动消息被移除",
  问题分类: "跨端与跨模块一致性", 待决策问题: "主播清屏后，观众端的当前公屏应采用哪一种结果？",
  可选方案: ["A. 所有在线观众的当前公屏同步清空", "B. 仅主播端本地清空，观众端保留原消息", "C. 在线观众保留原消息，清屏后新进观众仅看到清屏后的消息"],
  测试建议: "建议 A；清屏作为主播管理动作时，全部在线观众一致更易理解和验收。",
  已知依据: ["原型脚本只能观察到主播当前页面移除互动消息", "最新需求未明确观众端的清屏范围"],
  影响范围: ["主播直播间清屏", "在线观众公屏", "清屏后新进观众公屏"], 确认后待补用例: ["主播清屏后的观众端结果"], 负责人: "产品",
});

const questionById = new Map(questions.map((item) => [item.问题编号, item]));
for (const item of questions) {
  assert(item.可选方案.length >= 2 && item.可选方案.length <= 4, `${item.问题编号} 选项数量不合法`);
  if (item.父问题编号) {
    assert(questionById.has(item.父问题编号), `${item.问题编号} 父问题不存在`);
    assert(questionById.get(item.父问题编号).需求组编号 === item.需求组编号, `${item.问题编号} 父问题跨组`);
  }
}
const blockRank = { "阻塞测试": 0, "部分阻塞": 1, "不阻塞": 2 };
const groupRank = new Map();
for (const item of questions) groupRank.set(item.需求组编号, Math.min(groupRank.get(item.需求组编号) ?? 9, blockRank[item.阻塞等级]));
const groups = [...new Set(questions.map((item) => item.需求组编号))].sort((a, b) => groupRank.get(a) - groupRank.get(b) || a.localeCompare(b, "zh-CN", { numeric: true }));
const orderedQuestions = [];
for (const group of groups) {
  const items = questions.filter((item) => item.需求组编号 === group);
  const children = new Map();
  for (const item of items) {
    const parent = item.父问题编号 || "";
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(item);
  }
  for (const list of children.values()) list.sort((a, b) => a.问题编号.localeCompare(b.问题编号, "zh-CN", { numeric: true }));
  const visit = (item) => { orderedQuestions.push(item); for (const child of children.get(item.问题编号) ?? []) visit(child); };
  for (const root of children.get("") ?? []) visit(root);
}
questions = orderedQuestions;

const payload = { 测试用例: cases, 需求待确认: questions };
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionStatus = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);

assert(cases.length > 0 && questions.length > 0, "用例或待确认为空");
assert(new Set(cases.map((item) => item.用例编号)).size === cases.length, "用例编号重复");
assert(new Set(questions.map((item) => item.问题编号)).size === questions.length, "问题编号重复");
assert(cases.filter((item) => item.优先级 === "P0").length <= 8, "P0 未收敛为最小冒烟集");
cases.forEach((item, index) => {
  assert(item.序号 === index + 1, `序号不连续 ${item.用例编号}`);
  assert(validTypes.has(item.用例类型), `用例类型不合法 ${item.用例编号}`);
  assert(validPriorities.has(item.优先级), `优先级不合法 ${item.用例编号}`);
  assert(item.用例描述.startsWith("验证"), `用例描述未以验证开头 ${item.用例编号}`);
  assert(Array.isArray(item.前置条件) && item.前置条件.length > 0, `前置条件缺失 ${item.用例编号}`);
  assert(Array.isArray(item.操作步骤) && item.操作步骤.length > 0, `步骤缺失 ${item.用例编号}`);
  assert(Array.isArray(item.预期结果) && item.预期结果.length === 1 && item.预期结果[0].trim(), `预期结果数量错误 ${item.用例编号}`);
  assert(Array.isArray(item.备注) && item.备注.some((note) => note.startsWith("来源：")), `缺少来源 ${item.用例编号}`);
  assert(!item.前置条件.some((condition) => /场景\s*[A-ZＡ-Ｚ][：:]/.test(condition)), `前置条件包含可替代场景 ${item.用例编号}`);
  assert(!item.前置条件.some((condition) => condition.includes("或")), `前置条件包含未收敛的“或”分支 ${item.用例编号}`);
  assert(!item.前置条件.some((condition) => condition.includes("分别")), `前置条件包含未收敛的“分别”分支 ${item.用例编号}`);
  assert(!item.操作步骤.some((step) => step.includes("或")), `操作步骤包含未收敛的“或”分支 ${item.用例编号}`);
  assert(!/yyyyMMdd|\/product\/vehicle-skus/.test(JSON.stringify(item)), `存在技术占位内容 ${item.用例编号}`);
});
questions.forEach((item) => {
  assert(validQuestionBlocks.has(item.阻塞等级), `阻塞等级不合法 ${item.问题编号}`);
  assert(validQuestionCategories.has(item.问题分类), `问题分类不合法 ${item.问题编号}`);
  assert(validQuestionOwners.has(item.负责人), `负责人不合法 ${item.问题编号}`);
  assert(validQuestionStatus.has(item.确认状态), `确认状态不合法 ${item.问题编号}`);
  assert(item.产品结论 === "" && item.结论补充 === "", `初始结论未留空 ${item.问题编号}`);
  assert(item.已有用例编号.length + item.确认后待补用例.length > 0, `影响用例字段为空 ${item.问题编号}`);
  assert(item.可选方案.every((option) => !option.includes("其他：")), `存在逃生选项 ${item.问题编号}`);
});

const testHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const questionHeaders = [
  "问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类",
  "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号",
  "确认后待补用例", "负责人", "期望确认时间", "确认状态",
];

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}
function caseRow(item) {
  return [item.序号, item.用例编号, item.功能模块, item.功能结构, item.用例类型, item.优先级, item.用例描述, item.验证用例子项, numbered(item.前置条件), numbered(item.操作步骤), item.预期结果[0], item.流程编号, item.测试结果, item.测试人员, numbered(item.备注)];
}
function questionRow(item) {
  return questionHeaders.map((header) => {
    if (header === "可选方案") return item[header].join("\n");
    if (["已知依据", "影响范围", "已有用例编号", "确认后待补用例"].includes(header)) return numbered(item[header]);
    return item[header];
  });
}
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
  return Math.min(180, Math.max(38, lines * 16 + 10));
}
function addValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = { rule: { type: "list", values } };
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
  validations.forEach(({ column, values }) => addValidation(sheet, `${column}2:${column}${lastRow}`, values));
  if (priorityColumn) {
    const priorityRange = sheet.getRange(`${priorityColumn}2:${priorityColumn}${lastRow}`);
    priorityRange.conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FDE8E8", font: { bold: true, color: "#9B1C1C" } } });
    priorityRange.conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF4D6", font: { bold: true, color: "#8A4B08" } } });
  }
  widths.forEach((width, index) => { sheet.getRange(`${columnName(index)}1`).format.columnWidth = width; });
  rows.forEach((row, index) => { sheet.getRange(`A${index + 2}:${lastColumn}${index + 2}`).format.rowHeightPx = estimateRowHeight(row, widths); });
  return { sheet, lastColumn, lastRow };
}

await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const main = buildSheet(workbook, {
  name: "功能测试用例",
  headers: testHeaders,
  rows: cases.map(caseRow),
  widths: [8, 15, 18, 26, 13, 9, 36, 28, 42, 48, 54, 18, 12, 14, 48],
  tableName: "FunctionalTestCases",
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
  rows: questions.map(questionRow),
  widths: [15, 15, 16, 38, 14, 20, 34, 22, 44, 58, 48, 15, 34, 52, 38, 26, 38, 16, 20, 16],
  tableName: "PendingRequirements",
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
let previousQuestionGroup = "";
questions.forEach((item, index) => {
  const rowNumber = index + 2;
  if (item.需求组编号 !== previousQuestionGroup) {
    pending.sheet.getRange(`A${rowNumber}:T${rowNumber}`).format.borders = { top: { style: "medium", color: "#6B879F" } };
    previousQuestionGroup = item.需求组编号;
  }
  if (item.父问题编号) {
    pending.sheet.getRange(`A${rowNumber}:D${rowNumber}`).format.fill = "#EAF2F8";
    pending.sheet.getRange(`C${rowNumber}:D${rowNumber}`).format.font = { name: "Microsoft YaHei", size: 10, bold: true, color: "#24557A" };
  } else {
    pending.sheet.getRange(`B${rowNumber}`).format.fill = "#DDEBF7";
  }
});

const overview = workbook.worksheets.add("产品决策概览");
overview.showGridLines = false;
overview.mergeCells("A1:H1");
overview.getRange("A1").values = [["产品决策概览"]];
overview.getRange("A1:H1").format = {
  fill: "#1F4E78", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 52,
};
overview.mergeCells("A2:H2");
overview.getRange("A2").values = [["先查看阻塞问题，再在“需求待确认”中选择产品结论；子问题会在父问题结论明确后展开处理。"]];
overview.getRange("A2:H2").format = {
  fill: "#EAF2F8", font: { name: "Microsoft YaHei", size: 10, color: "#334155" },
  horizontalAlignment: "left", verticalAlignment: "center", rowHeightPx: 34,
};
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
overview.getRange("H8").values = [[new Set(questions.map((item) => item.需求组编号)).size]];
overview.getRange("H9").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})-COUNTBLANK('需求待确认'!$C$2:$C$${pending.lastRow})`]];
overview.getRange("H10").formulas = [[`=COUNTBLANK('需求待确认'!$L$2:$L$${pending.lastRow})`]];
overview.getRange("H11").formulas = [[`=COUNTIFS('需求待确认'!$L$2:$L$${pending.lastRow},"其他",'需求待确认'!$M$2:$M$${pending.lastRow},"")`]];
overview.getRange("A8:H12").format = { font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D6DEE8" }, rowHeightPx: 31 };
for (const range of ["A8:A12", "C8:C10", "E8:E11", "G8:G11"]) overview.getRange(range).format.horizontalAlignment = "left";
for (const range of ["B8:B12", "D8:D10", "F8:F11", "H8:H11"]) overview.getRange(range).format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A14:H14");
overview.getRange("A14").values = [["处理顺序：先回答“待确认”父问题；展开父问题左侧分级按钮后，再处理由该结论触发的追问。"]];
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
for (const [sheetNumber, freeze] of [
  [1, '<x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A2" sqref="A2" />'],
  [2, '<x:pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen" /><x:selection pane="bottomRight" activeCell="D2" sqref="D2" />'],
  [3, '<x:pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen" /><x:selection pane="bottomLeft" activeCell="A3" sqref="A3" />'],
]) {
  const entryName = `xl/worksheets/sheet${sheetNumber}.xml`;
  const entry = zip.file(entryName);
  assert(entry, `missing ${entryName}`);
  let xml = patchXmlFreeze(await entry.async("string"), freeze);
  if (sheetNumber === 2) {
    if (!/<x:sheetPr>/.test(xml)) xml = xml.replace(/(<x:sheetViews>)/, '<x:sheetPr><x:outlinePr summaryBelow="0" summaryRight="1" /></x:sheetPr>$1');
    else if (!/<x:outlinePr/.test(xml)) xml = xml.replace(/(<x:sheetPr>)/, '$1<x:outlinePr summaryBelow="0" summaryRight="1" />');
    [6, 8, 14, 15, 16, 17].forEach((column) => {
      const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${column}"[^>]*\\bmax="${column}"[^>]*\/>`);
      xml = xml.replace(pattern, (tag) => setOrReplaceXmlAttribute(tag, "hidden", "1"));
    });
    const pendingQuestionById = new Map(questions.map((item) => [item.问题编号, item]));
    const questionDepth = (item, stack = new Set()) => {
      if (!item.父问题编号) return 0;
      assert(!stack.has(item.问题编号), `question cycle ${item.问题编号}`);
      const next = new Set(stack);
      next.add(item.问题编号);
      return 1 + questionDepth(pendingQuestionById.get(item.父问题编号), next);
    };
    const parentIds = new Set(questions.filter((item) => item.父问题编号).map((item) => item.父问题编号));
    questions.forEach((item, index) => {
      const attributes = {};
      const depth = questionDepth(item);
      if (depth > 0) {
        attributes.hidden = "1";
        attributes.outlineLevel = String(depth);
      }
      if (parentIds.has(item.问题编号)) attributes.collapsed = "1";
      if (Object.keys(attributes).length > 0) xml = patchXmlRow(xml, index + 2, attributes);
    });
    xml = xml.replace(/<x:sheetFormatPr([^>]*)\/>/, (tag) => setOrReplaceXmlAttribute(tag, "outlineLevelRow", "2"));
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
assert((mainTableXml.match(/<x:tableColumn /g) ?? []).length === 15, "main table column count invalid");
assert(pendingTableXml.includes(`ref="A1:T${pending.lastRow}"`), "pending table range invalid");
assert((pendingTableXml.match(/<x:tableColumn /g) ?? []).length === 20, "pending table column count invalid");
assert((pendingSheetXml.match(/hidden="1" outlineLevel="[12]"/g) ?? []).length === questions.filter((item) => item.父问题编号).length, "collapsed child count invalid");
assert(finalWorkbookXml.includes('activeTab="2"'), "overview is not active by default");

const finalWorkbook = await SpreadsheetFile.importXlsx(finalBytes);
assert.deepEqual(finalWorkbook.worksheets.items.map((sheet) => sheet.name), ["功能测试用例", "需求待确认", "产品决策概览"], "工作表结构异常");
const inspection = {
  summary: (await finalWorkbook.inspect({ kind: "workbook,sheet,table", maxChars: 10000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 140 })).ndjson,
  mainHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O8", maxChars: 16000 })).ndjson,
  mainTail: (await finalWorkbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, main.lastRow - 4)}:O${main.lastRow}`, maxChars: 14000 })).ndjson,
  pendingHead: (await finalWorkbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:T${Math.min(8, pending.lastRow)}`, maxChars: 18000 })).ndjson,
  overview: (await finalWorkbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 14000 })).ndjson,
  formulas: (await finalWorkbook.inspect({ kind: "formula", sheetId: "产品决策概览", range: "A1:H14", maxChars: 14000 })).ndjson,
  formulaErrors: (await finalWorkbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(path.join(workDir, "inspection-260829-003.json"), `${JSON.stringify(inspection, null, 2)}\n`, "utf8");
for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O9", "preview-260829-003-main.png"],
  ["需求待确认", `A1:T${Math.min(8, pending.lastRow)}`, "preview-260829-003-pending.png"],
  ["产品决策概览", "A1:H14", "preview-260829-003-overview.png"],
]) {
  const preview = await finalWorkbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}
const stat = await fs.stat(outputPath);
assert(stat.size > 0, "exported workbook is empty");
console.log(JSON.stringify({ outputPath, jsonPath, sheets: ["功能测试用例", "需求待确认", "产品决策概览"], cases: cases.length, questions: questions.length, childQuestions: questions.filter((item) => item.父问题编号).length, p0: cases.filter((item) => item.优先级 === "P0").length, bytes: stat.size }, null, 2));
