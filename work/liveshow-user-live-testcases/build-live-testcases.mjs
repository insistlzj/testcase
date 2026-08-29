import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workDir = path.resolve("work/liveshow-user-live-testcases");
const outputDir = path.resolve("outputs/Luma Live-case");
const outputPath = path.join(outputDir, "用户App-直播模块-260828-012.xlsx");
const jsonPath = path.join(workDir, "用户App-直播模块-测试用例-260828.json");

const MODULE = "用户App-直播模块";
const REQ = "来源：context/01-用户主播App-项目需求清单.md";
const ROLE = "来源：context/01-用户主播App-角色与用例.md";
const PERM = "来源：context/01-互动场景权限规则.md";
const SPEC = "来源：prototype/Luma Live-原型说明.md";
const ANNO = "来源：prototype/assets/annotations.js";
const STATIC = "来源：对应 HTML 静态原型；未动态验证";

const cases = [];
function addCase({ structure, type, priority, description, point, pre, steps, expected, notes }) {
  const sequence = cases.length + 1;
  cases.push({
    序号: sequence,
    用例编号: `LIVE-${String(sequence).padStart(3, "0")}`,
    功能模块: MODULE,
    功能结构: structure,
    用例类型: type,
    优先级: priority,
    用例描述: description,
    验证用例子项: point,
    前置条件: pre,
    操作步骤: steps,
    预期结果: expected,
    测试结果: "未测",
    测试人员: "",
    备注: notes,
  });
}

addCase({
  structure: "直播广场", type: "业务流程", priority: "P0",
  description: "验证用户进入直播广场并识别可观看直播",
  point: "广场入口与直播卡片",
  pre: ["用户已登录", "后台存在普通房、门票房和密码房直播数据"],
  steps: ["进入首页直播广场", "查看热门列表中的直播卡片"],
  expected: ["直播卡片展示直播间封面、主播昵称或头像、直播标题、在线人数和分类标签", "普通房、门票房和密码房具有可区分的进入状态"],
  notes: [REQ, SPEC, STATIC],
});
addCase({
  structure: "直播广场", type: "功能需求", priority: "P1",
  description: "验证热门与新人列表切换",
  point: "热门/新人 Tab",
  pre: ["热门与新人列表均存在直播数据"],
  steps: ["进入直播广场", "点击“新人”", "点击“热门”"],
  expected: ["选择“新人”后展示新人直播数据且“新人”处于选中状态", "选择“热门”后展示按后台热门权重返回的直播数据且“热门”处于选中状态"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "直播广场", type: "逻辑校验", priority: "P1",
  description: "验证按后台配置分类筛选直播间",
  point: "分类筛选",
  pre: ["后台已配置至少两个直播分类", "不同分类下均存在直播中的房间"],
  steps: ["进入直播广场", "选择分类 A", "记录列表房间", "切换到分类 B"],
  expected: ["分类选项与后台启用配置一致", "分类 A 列表仅包含归属分类 A 的房间", "切换分类 B 后列表更新为归属分类 B 的房间"],
  notes: [REQ, ANNO],
});
addCase({
  structure: "直播广场", type: "功能需求", priority: "P2",
  description: "验证下拉刷新直播列表",
  point: "下拉刷新",
  pre: ["直播广场已加载", "服务端新增或结束一场直播"],
  steps: ["在直播列表顶部向下拖动并释放", "等待刷新完成"],
  expected: ["页面完成一次直播列表刷新", "刷新后的列表反映服务端最新在播状态"],
  notes: [REQ],
});
addCase({
  structure: "直播广场", type: "功能需求", priority: "P2",
  description: "验证上拉加载后续直播数据",
  point: "上拉加载",
  pre: ["当前分类的直播数据超过首屏加载数量"],
  steps: ["进入直播广场", "滑动到当前列表底部", "继续上拉"],
  expected: ["列表追加后续直播数据", "已展示的直播卡片不重复"],
  notes: [REQ],
});
addCase({
  structure: "直播广场", type: "异常用例", priority: "P1",
  description: "验证无直播数据时展示空状态",
  point: "广场空状态",
  pre: ["当前筛选范围内没有直播中的房间"],
  steps: ["进入直播广场"],
  expected: ["页面展示“暂无直播，去关注喜欢的主播”", "页面展示“去发现”按钮", "页面不展示失效的直播卡片"],
  notes: [REQ],
});
addCase({
  structure: "普通房进房", type: "业务流程", priority: "P0",
  description: "验证用户免费进入普通房并自动播放",
  point: "普通房首次进入",
  pre: ["用户已登录", "目标普通房正在直播且用户无进房限制"],
  steps: ["在直播广场点击目标普通房卡片", "等待直播间加载"],
  expected: ["页面进入目标直播间", "直播画面自动开始播放", "用户无需支付金币或输入密码"],
  notes: [REQ, SPEC],
});
addCase({
  structure: "普通房进房", type: "异常用例", priority: "P1",
  description: "验证直播断流后的重连提示与恢复",
  point: "断流重连",
  pre: ["用户正在观看普通房", "可模拟直播流中断后恢复"],
  steps: ["中断直播流连接", "观察直播间状态", "恢复直播流连接"],
  expected: ["断流期间页面展示重连提示", "流恢复后直播画面继续播放"],
  notes: [REQ],
});
addCase({
  structure: "普通房进房", type: "功能需求", priority: "P2",
  description: "验证观看中切换清晰度",
  point: "清晰度切换",
  pre: ["用户正在观看普通房", "当前直播流提供多个可用清晰度档位"],
  steps: ["打开清晰度选项", "选择另一个可用档位"],
  expected: ["所选清晰度显示为当前档位", "直播流切换为所选档位并继续播放"],
  notes: [REQ],
});
addCase({
  structure: "普通房进房", type: "功能需求", priority: "P2",
  description: "验证直播画面横竖屏切换",
  point: "横竖屏切换",
  pre: ["用户正在观看普通房"],
  steps: ["将直播画面切换为横屏", "再切换回竖屏"],
  expected: ["横屏时直播画面按横屏模式展示且直播不中断", "返回竖屏后直播画面恢复竖屏模式"],
  notes: [REQ],
});
addCase({
  structure: "门票房进房", type: "业务流程", priority: "P0",
  description: "验证用户购买门票后进入直播间",
  point: "门票购买与首次进入",
  pre: ["门票房灰度开关已开启", "目标门票房正在直播", "门票价格为 10 金币", "用户余额为 20 金币且未购买本场门票"],
  steps: ["在直播广场点击目标门票房", "核对门票价格", "点击“购买”"],
  expected: ["购票前展示本场门票价格 10 金币和当前余额", "购买成功后进入目标直播间", "用户余额由 20 减为 10 金币", "消费明细新增一条 10 金币的本场门票记录"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "门票房进房", type: "异常用例", priority: "P1",
  description: "验证金币不足时无法购买门票",
  point: "门票余额不足",
  pre: ["目标门票价格为 10 金币", "用户余额为 9 金币", "用户未购买本场门票"],
  steps: ["点击目标门票房", "点击“购买”"],
  expected: ["用户不进入目标直播间", "用户金币余额不变", "页面提供充值入口"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "门票房进房", type: "逻辑校验", priority: "P1",
  description: "验证同一场已购票用户重复进入不再收费",
  point: "已购票重复进入",
  pre: ["用户已购买目标门票房当前场次门票", "当前场次尚未结束且用户未被踢出"],
  steps: ["退出直播间", "再次点击同一场门票房"],
  expected: ["用户可再次进入目标直播间", "再次进入不扣减金币", "消费明细不新增重复门票记录"],
  notes: [REQ],
});
addCase({
  structure: "门票房进房", type: "逻辑校验", priority: "P1",
  description: "验证直播结束后原门票失效",
  point: "场次结束后门票失效",
  pre: ["用户已购买场次 A 的门票", "场次 A 已结束", "同一主播开启新的门票场次 B"],
  steps: ["点击场次 B 的直播卡片"],
  expected: ["页面重新展示场次 B 的门票购买信息", "场次 A 的门票不能作为场次 B 的进入凭证"],
  notes: [REQ],
});
addCase({
  structure: "门票房进房", type: "业务流程", priority: "P1",
  description: "验证门票房被踢后门票失效且不退款",
  point: "被踢后的门票处理",
  pre: ["用户已购买并进入当前门票房", "用户金币余额和购票流水已记录"],
  steps: ["由主播将该用户踢出直播间", "用户再次尝试进入当前场次", "查看金币余额和消费明细"],
  expected: ["用户被移出直播间且本场次不可重新进入", "已支付门票不退回金币", "原消费明细保留且不生成退款流水"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "密码房进房", type: "业务流程", priority: "P0",
  description: "验证用户输入有效密码进入密码房",
  point: "有效密码进房",
  pre: ["密码房灰度开关已开启", "目标密码房正在直播", "用户已获得当前房间密码"],
  steps: ["点击目标密码房入口", "输入当前房间密码", "点击“进入直播间”"],
  expected: ["密码验证通过", "页面进入目标密码房并播放直播"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "密码房进房", type: "异常用例", priority: "P1",
  description: "验证错误密码不能进入密码房",
  point: "错误密码校验",
  pre: ["目标密码房正在直播"],
  steps: ["点击目标密码房入口", "输入与当前密码不一致的内容", "点击“进入直播间”"],
  expected: ["页面不进入直播间", "密码输入区域显示“密码错误，请重新输入”"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "密码房进房", type: "功能需求", priority: "P2",
  description: "验证关闭密码输入后取消进房",
  point: "取消密码输入",
  pre: ["密码输入面板已打开"],
  steps: ["填写任意密码", "点击关闭按钮"],
  expected: ["密码输入面板关闭", "用户停留在原页面且未进入直播间"],
  notes: [SPEC, STATIC],
});
addCase({
  structure: "密码房进房", type: "逻辑校验", priority: "P1",
  description: "验证主播重置密码后新旧密码的进入结果",
  point: "密码重置生效",
  pre: ["目标密码房正在直播", "主播已将房间密码从旧值重置为新值"],
  steps: ["使用旧密码尝试进入", "返回后使用新密码再次进入"],
  expected: ["旧密码验证失败且用户不能进入", "新密码验证通过并进入目标密码房"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "密码房进房", type: "逻辑校验", priority: "P1",
  description: "验证隐藏展示入口不绕过密码校验",
  point: "隐藏房间仍校验密码",
  pre: ["主播关闭密码房的广场展示", "用户通过已知房间号或授权入口找到该房间"],
  steps: ["点击目标密码房入口"],
  expected: ["进入直播内容前仍展示密码校验", "未通过密码校验时不能观看直播"],
  notes: [ROLE, ANNO],
});
addCase({
  structure: "观众互动", type: "功能需求", priority: "P1",
  description: "验证观众关注直播中的主播",
  point: "直播间关注主播",
  pre: ["用户正在观看直播", "用户尚未关注当前主播"],
  steps: ["点击主播信息区域的关注按钮"],
  expected: ["当前用户与主播建立关注关系", "关注按钮更新为已关注状态", "主播的关注关系数据包含当前用户"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "观众互动", type: "业务流程", priority: "P0",
  description: "验证观众发送有效公屏文字消息",
  point: "发送公屏文字",
  pre: ["用户已进入直播间", "用户未被禁言或平台封禁"],
  steps: ["在评论框输入“今晚的歌很好听”", "点击“发送”"],
  expected: ["公屏新增当前用户发送的文字消息", "消息展示当前用户昵称及已有身份标识", "输入框清空且发送按钮恢复不可用状态"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "观众互动", type: "逻辑校验", priority: "P2",
  description: "验证空白评论不能发送",
  point: "空白评论拦截",
  pre: ["用户已进入直播间且可发言"],
  steps: ["在评论框输入空格", "观察发送按钮", "尝试提交"],
  expected: ["发送按钮保持不可用", "公屏不新增消息"],
  notes: [STATIC],
});
addCase({
  structure: "观众互动", type: "逻辑校验", priority: "P2",
  description: "验证公屏文字输入的 80 字边界",
  point: "评论长度上限",
  pre: ["用户已进入直播间且可发言"],
  steps: ["输入 80 个字符并发送", "再次输入超过 80 个字符的内容"],
  expected: ["80 个字符的消息可提交并展示在公屏", "输入框最多保留 80 个字符"],
  notes: [STATIC],
});
addCase({
  structure: "观众互动", type: "逻辑校验", priority: "P1",
  description: "验证被禁言用户不能发送公屏消息",
  point: "本场禁言限制",
  pre: ["用户已被主播或房管设置为当前场次禁言"],
  steps: ["查看评论输入区域", "尝试点击并输入内容"],
  expected: ["评论输入区域显示“已被禁言”", "用户不能输入或发送公屏消息", "用户已发送的历史消息仍保留"],
  notes: [PERM, ANNO],
});
addCase({
  structure: "观众互动", type: "功能需求", priority: "P2",
  description: "验证从直播间进入主播主页",
  point: "主播主页入口",
  pre: ["用户正在观看直播"],
  steps: ["点击直播间顶部主播头像或昵称"],
  expected: ["页面进入当前主播主页", "主播主页展示的账号与当前直播间主播一致"],
  notes: [REQ, SPEC],
});
addCase({
  structure: "观众互动", type: "功能需求", priority: "P2",
  description: "验证查看当前在线观众列表",
  point: "在线观众列表",
  pre: ["直播间内存在多名在线观众"],
  steps: ["点击直播间在线人数或头像入口"],
  expected: ["页面打开当前直播间在线观众列表", "列表中的用户均属于当前场次在线范围"],
  notes: [REQ, ANNO],
});
addCase({
  structure: "观众互动", type: "功能需求", priority: "P2",
  description: "验证查看本场贡献榜",
  point: "本场贡献榜",
  pre: ["当前场次已有用户送礼或购票贡献记录"],
  steps: ["点击“本场贡献榜”入口"],
  expected: ["页面展示当前场次贡献用户及贡献数值", "榜单数据范围不包含其他直播场次"],
  notes: [REQ, ANNO],
});
addCase({
  structure: "观众互动", type: "功能需求", priority: "P2",
  description: "验证观众主动退出直播间",
  point: "退出直播间",
  pre: ["用户正在观看直播"],
  steps: ["点击直播间退出按钮"],
  expected: ["页面离开当前直播间并返回直播广场", "主播直播场次保持进行中"],
  notes: [SPEC, STATIC],
});
addCase({
  structure: "直播送礼", type: "功能需求", priority: "P1",
  description: "验证礼物面板展示可赠送信息",
  point: "礼物面板内容",
  pre: ["用户正在观看直播", "后台已上架礼物并配置价格和分类"],
  steps: ["点击礼物按钮", "切换礼物分类"],
  expected: ["面板展示礼物分类、图标、名称和金币价格", "面板展示当前金币余额和充值入口", "切换分类后仅展示该分类的可用礼物"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "直播送礼", type: "业务流程", priority: "P0",
  description: "验证赠送普通礼物后的金币、收益和公屏记录",
  point: "普通礼物单次赠送",
  pre: ["普通礼物“鲜花”单价为 20 金币", "用户余额为 100 金币", "主播当前实时收益为 500 金币"],
  steps: ["打开礼物面板", "选择“鲜花”及数量 1", "点击赠送"],
  expected: ["用户消费金额 = 20 × 1 = 20 金币", "用户余额 = 100 - 20 = 80 金币", "主播实时收益 = 500 + 20 = 520 金币", "公屏新增当前用户“送出 鲜花”的播报", "消费流水记录礼物、数量、20 金币和当前直播场次"],
  notes: [REQ, ROLE],
});
addCase({
  structure: "直播送礼", type: "异常用例", priority: "P1",
  description: "验证金币不足时不能赠送礼物",
  point: "送礼余额不足",
  pre: ["目标礼物总价为 100 金币", "用户余额为 99 金币"],
  steps: ["选择目标礼物和数量", "点击赠送"],
  expected: ["礼物未赠送且公屏不新增送礼播报", "用户余额不变", "主播收益不变", "页面提供充值入口"],
  notes: [REQ],
});
addCase({
  structure: "直播送礼", type: "逻辑校验", priority: "P1",
  description: "验证普通礼物连续赠送按数量累计",
  point: "连送数量累计",
  pre: ["目标普通礼物单价为 20 金币", "用户余额为 200 金币"],
  steps: ["选择目标礼物和数量 5", "点击赠送"],
  expected: ["本次消耗 = 20 × 5 = 100 金币", "用户余额 = 200 - 100 = 100 金币", "主播实时收益增加 100 金币", "公屏播报目标礼物及累计数量 5"],
  notes: [REQ],
});
addCase({
  structure: "直播送礼", type: "逻辑校验", priority: "P1",
  description: "验证幸运礼物按结算周期净消耗计入主播收益",
  point: "幸运礼物收益公式",
  pre: ["同一结算周期仅有本组幸运礼物记录", "用户累计投入 1,000 金币", "中奖返还累计 200 金币", "幸运礼物收益计入比例为 1%"],
  steps: ["完成结算周期", "查看主播收益流水和结算汇总"],
  expected: ["用户净消耗 = 1,000 - 200 = 800 金币", "主播收益原值 = 800 × 1% = 8 金币", "按结算周期汇总后舍去小数，最终计入主播收益 8 金币", "收益流水可追溯到该结算周期的投入和返还范围"],
  notes: [ROLE, "来源：角色与用例文档的业务口径 3"],
});
addCase({
  structure: "直播间粉丝团", type: "业务流程", priority: "P2",
  description: "验证满足条件的观众从直播间加入粉丝团",
  point: "直播间加入粉丝团",
  pre: ["主播已创建粉丝团", "当前用户未加入且满足主播配置的加入条件", "粉丝团人数少于 500"],
  steps: ["点击直播间粉丝团入口", "查看粉丝团权益和条件", "点击加入"],
  expected: ["用户建立该主播粉丝团团籍和群籍", "直播间粉丝团状态更新为已加入", "用户获得该粉丝团身份标识"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "直播间举报", type: "逻辑校验", priority: "P1",
  description: "验证未选择举报原因时不能提交",
  point: "举报原因必选",
  pre: ["用户已进入举报直播间页面"],
  steps: ["不选择举报原因", "填写或不填写补充说明", "观察“提交”按钮"],
  expected: ["“提交”按钮保持不可用", "系统不生成举报工单"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "直播间举报", type: "业务流程", priority: "P1",
  description: "验证用户提交直播间举报",
  point: "直播间举报提交",
  pre: ["用户已登录并正在观看目标直播间"],
  steps: ["打开更多功能", "点击“举报”", "选择“色情低俗”", "填写补充说明", "点击“提交”"],
  expected: ["系统生成关联当前直播间和举报人的举报工单", "页面提示“举报已提交”", "页面返回原直播间"],
  notes: [REQ, PERM, ANNO, STATIC],
});
addCase({
  structure: "直播间举报", type: "业务流程", priority: "P1",
  description: "验证用户从资料卡举报其他用户",
  point: "直播间用户举报",
  pre: ["用户已登录", "直播间在线列表中存在目标用户"],
  steps: ["打开目标用户资料卡", "点击“举报”", "选择举报原因", "点击“提交”"],
  expected: ["系统生成关联目标用户和举报人的举报工单", "页面提示“举报已提交”", "页面返回原直播间"],
  notes: [REQ, PERM, ANNO, STATIC],
});
addCase({
  structure: "直播间举报", type: "逻辑校验", priority: "P2",
  description: "验证举报操作不改变既有互动关系",
  point: "举报关系无副作用",
  pre: ["用户与被举报主播或用户存在可识别的关注、好友或粉丝团关系", "用户已登录"],
  steps: ["提交一条直播间举报或用户举报", "举报成功后查看双方原有互动关系"],
  expected: ["举报前已存在的关注、好友或粉丝团关系保持不变", "举报操作仅生成举报工单，不新增拉黑或直播间限制"],
  notes: [PERM],
});
addCase({
  structure: "直播间举报", type: "功能需求", priority: "P2",
  description: "验证取消举报不生成工单",
  point: "取消举报",
  pre: ["直播间举报页面已打开且已选择举报原因"],
  steps: ["点击“取消”"],
  expected: ["页面返回原直播间", "系统不生成举报工单"],
  notes: [STATIC],
});
addCase({
  structure: "直播间举报", type: "逻辑校验", priority: "P2",
  description: "验证举报补充说明的 200 字边界",
  point: "补充说明长度上限",
  pre: ["用户已进入直播间或用户举报页面", "已选择举报原因"],
  steps: ["在补充说明输入 200 个字符", "继续输入第 201 个字符"],
  expected: ["输入框保留前 200 个字符", "第 201 个字符不进入输入框", "已有 200 个字符可随举报原因一并提交"],
  notes: [STATIC],
});
addCase({
  structure: "房管协助管理", type: "功能需求", priority: "P1",
  description: "验证房管资料卡展示受限管理操作",
  point: "房管操作范围",
  pre: ["当前用户已被主播设置为房管", "当前直播仍在进行"],
  steps: ["以房管身份进入直播间", "打开在线观众资料卡"],
  expected: ["资料卡提供禁言和踢出直播间操作", "房管不能设置或取消其他房管", "房管不能执行主播专属的直播结束操作"],
  notes: [ROLE, PERM, ANNO],
});
addCase({
  structure: "房管协助管理", type: "业务流程", priority: "P1",
  description: "验证房管确认禁言在线用户",
  point: "房管禁言",
  pre: ["房管和目标用户均在当前直播间", "目标用户可正常发言"],
  steps: ["房管打开目标用户资料卡", "选择禁言", "在确认提示中点击确认", "目标用户尝试发送公屏消息"],
  expected: ["目标用户在当前场次不能继续发送公屏消息", "目标用户已发送消息不受影响", "系统保留房管、目标用户、场次和操作时间记录"],
  notes: [ROLE, PERM, ANNO],
});
addCase({
  structure: "房管协助管理", type: "功能需求", priority: "P2",
  description: "验证房管取消禁言操作后状态不变",
  point: "取消房管禁言",
  pre: ["房管已打开对可发言用户的禁言确认提示"],
  steps: ["点击“取消”", "由目标用户发送公屏消息"],
  expected: ["目标用户仍可发送公屏消息", "系统不新增禁言操作记录"],
  notes: [ANNO],
});
addCase({
  structure: "房管协助管理", type: "业务流程", priority: "P1",
  description: "验证房管踢出当前直播间用户",
  point: "房管踢人",
  pre: ["房管和目标用户均在当前直播间"],
  steps: ["房管打开目标用户资料卡", "点击“踢出直播间”", "在确认提示中点击确认", "目标用户再次尝试进入当前场次"],
  expected: ["目标用户被移出当前直播间", "目标用户本场次不能重新进入", "下一场直播不继承本次踢出限制", "系统保留房管、目标用户、场次和操作时间记录"],
  notes: [ROLE, PERM, ANNO],
});
addCase({
  structure: "开播设置", type: "业务流程", priority: "P0",
  description: "验证具备直播权限的主播进入开播设置",
  point: "开播设置入口",
  pre: ["用户已加入工会并通过主播认证", "平台与工会均已开启直播权限"],
  steps: ["进入主播中心", "点击“开始直播”"],
  expected: ["页面进入开播设置", "页面展示摄像头预览、标题、封面、分类、房型和美颜设置入口"],
  notes: [REQ, ROLE, SPEC],
});
addCase({
  structure: "开播设置", type: "异常用例", priority: "P1",
  description: "验证直播权限关闭时不能开始直播",
  point: "直播权限总开关",
  pre: ["主播认证已通过", "平台关闭或锁定该主播直播权限"],
  steps: ["进入主播中心", "尝试进入开播设置并开始直播"],
  expected: ["主播不能创建直播场次", "直播权限状态展示已关闭及已有原因", "工会侧开启操作不能覆盖平台关闭或锁定状态"],
  notes: [REQ, ROLE],
});
addCase({
  structure: "开播设置", type: "功能需求", priority: "P1",
  description: "验证主播保存有效直播标题",
  point: "直播标题保存",
  pre: ["主播已进入开播设置"],
  steps: ["点击“修改主题”", "输入“今晚唱到你睡着”", "点击“保存”"],
  expected: ["标题抽屉关闭", "开播设置页回显保存后的直播标题", "本次开播使用该标题"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P1",
  description: "验证空直播标题不能保存",
  point: "直播标题必填",
  pre: ["主播已打开“修改主题”"],
  steps: ["清空标题或仅输入空格", "点击“保存”"],
  expected: ["页面提示“请设置直播标题”", "标题抽屉保持打开", "开播设置页原标题不变"],
  notes: [STATIC],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P2",
  description: "验证直播标题的 40 字边界",
  point: "直播标题长度上限",
  pre: ["主播已打开“修改主题”"],
  steps: ["输入 40 个字符并保存", "再次打开并继续输入第 41 个字符"],
  expected: ["40 个字符的标题可保存并回显", "输入框最多保留 40 个字符"],
  notes: [STATIC],
});
addCase({
  structure: "开播设置", type: "功能需求", priority: "P2",
  description: "验证主播选择有效图片作为直播封面",
  point: "直播封面选择",
  pre: ["主播已进入开播设置", "设备中存在可访问的有效图片"],
  steps: ["点击“修改封面”", "从设备选择一张有效图片"],
  expected: ["系统接受所选图片", "开播设置页使用所选图片作为本场封面预览"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "开播设置", type: "功能需求", priority: "P1",
  description: "验证主播选择后台启用的直播分类",
  point: "直播分类选择",
  pre: ["后台至少启用两个直播分类", "主播已进入开播设置"],
  steps: ["点击分类入口", "选择分类“唱歌”"],
  expected: ["分类列表仅展示后台启用的分类", "选择后页面回显“唱歌”并作为本场直播分类"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "开播设置", type: "功能需求", priority: "P1",
  description: "验证主播选择普通房",
  point: "普通房设置",
  pre: ["主播已进入房型设置"],
  steps: ["选择“普通房”", "点击“确认”"],
  expected: ["房型设置关闭", "开播设置页房型回显为“普通”", "普通房无需门票价格或房间密码"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P1",
  description: "验证门票房未填写价格不能保存",
  point: "门票价格必填",
  pre: ["门票房灰度开关已开启", "主播已进入房型设置"],
  steps: ["选择“门票房”", "保持门票价格为空", "点击“确认”"],
  expected: ["页面提示“请设置门票价格”", "房型设置保持打开", "开播设置页原房型不变"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P1",
  description: "验证密码房未填写密码不能保存",
  point: "房间密码必填",
  pre: ["密码房灰度开关已开启", "主播已进入房型设置"],
  steps: ["选择“密码房”", "保持房间密码为空", "点击“确认”"],
  expected: ["页面提示“请设置房间密码”", "房型设置保持打开", "开播设置页原房型不变"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P1",
  description: "验证密码房展示范围不代替进房密码",
  point: "密码房可见范围",
  pre: ["密码房灰度开关已开启", "主播已选择密码房并设置有效密码"],
  steps: ["关闭“在广场展示”", "开启“从粉丝中授权可见”并选择两名粉丝", "保存房型", "分别由授权粉丝和非授权用户通过已知入口尝试进入"],
  expected: ["广场不展示该密码房", "授权名单仅影响可见入口", "授权粉丝和非授权用户进入直播内容前均需通过房间密码校验"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "开播设置", type: "功能需求", priority: "P2",
  description: "验证切换前后摄像头预览",
  point: "摄像头切换",
  pre: ["设备前后摄像头可用", "主播已进入开播设置"],
  steps: ["点击切换摄像头", "再次点击切换摄像头"],
  expected: ["首次点击后预览从前置切换为后置", "再次点击后预览恢复前置"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "功能需求", priority: "P2",
  description: "验证美颜与美型参数分别保留",
  point: "美颜参数记忆",
  pre: ["美颜 SDK 可用", "主播已打开美颜设置"],
  steps: ["在“美颜”选择“磨皮”并将数值调整为 70", "切换到“美型”选择“大眼”并调整为 30", "在两个分类间来回切换"],
  expected: ["“磨皮”保持选中且数值为 70", "“大眼”保持选中且数值为 30"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P2",
  description: "验证恢复默认重置全部美颜参数",
  point: "美颜恢复默认",
  pre: ["美颜和美型均已选择项目并修改参数"],
  steps: ["点击“恢复默认”", "分别查看美颜和美型"],
  expected: ["美颜和美型均清空当前选中项目", "全部参数重置为 50", "页面提示“已恢复默认”"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "业务流程", priority: "P0",
  description: "验证主播完成设置后开始直播",
  point: "创建直播场次",
  pre: ["主播具备直播权限", "已设置有效标题、封面、分类和房型", "摄像头与直播 SDK 可用"],
  steps: ["点击“开始直播”", "等待开播倒计时完成", "点击“进入直播间”"],
  expected: ["系统创建一场进行中的直播场次", "页面进入该主播直播间"],
  notes: [REQ, ROLE, STATIC],
});
addCase({
  structure: "开播控制", type: "业务流程", priority: "P1",
  description: "验证开播成功后直播场次进入直播广场",
  point: "开播后的广场入口",
  pre: ["主播已成功创建一场进行中的直播", "直播标题、封面、分类和房型已保存"],
  steps: ["由另一名用户刷新直播广场", "查找该主播的直播场次"],
  expected: ["直播广场展示该场次的可用观看入口", "直播卡片的主播、标题、封面、分类和房型与本场开播设置一致"],
  notes: [REQ, ROLE],
});
addCase({
  structure: "开播控制", type: "业务流程", priority: "P1",
  description: "验证开播成功后向关注用户发送提醒",
  point: "关注用户开播提醒",
  pre: ["用户 A 已关注目标主播并允许接收开播提醒", "用户 B 未关注目标主播", "目标主播尚未开播"],
  steps: ["目标主播成功开始直播", "分别查看用户 A 和用户 B 的通知"],
  expected: ["用户 A 收到关联本场直播的开播提醒", "用户 B 不因本次开播收到关注主播开播提醒"],
  notes: [REQ, ROLE],
});
addCase({
  structure: "开播设置", type: "逻辑校验", priority: "P1",
  description: "验证特殊房型受后台灰度开关控制",
  point: "门票房/密码房灰度",
  pre: ["后台关闭门票房和密码房灰度开关", "主播已进入房型设置"],
  steps: ["查看可选房型", "尝试选择门票房和密码房"],
  expected: ["主播不能保存被关闭的特殊房型", "普通房仍可选择并保存"],
  notes: [REQ, ROLE],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P1",
  description: "验证主播查看在线用户经营标识",
  point: "在线用户身份标识",
  pre: ["主播正在直播", "在线用户覆盖新用户、老粉、粉丝团成员、高贡献用户、财富等级用户和受限用户"],
  steps: ["点击在线观众入口", "查看各类用户资料"],
  expected: ["列表按用户实际状态展示新用户、关注或老粉、粉丝团、贡献、财富等级和限制状态标识", "标识数据均属于当前直播间和对应用户"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播直播间", type: "逻辑校验", priority: "P1",
  description: "验证本场收礼与实时收益数据一致",
  point: "本场收益一致性",
  pre: ["主播本场初始普通礼物收益为 500 金币", "观众随后赠送价值 100 金币的普通礼物", "无其他收益变动"],
  steps: ["查看本场收礼入口", "查看主播实时收益", "查看对应消费和收益流水"],
  expected: ["本场普通礼物收礼增加 100 金币", "实时收益 = 500 + 100 = 600 金币", "消费流水与收益流水关联同一直播场次且金额均为 100 金币"],
  notes: [REQ, ROLE],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P2",
  description: "验证主播按贡献和停留时长排序在线观众",
  point: "在线观众排序",
  pre: ["主播正在直播", "至少三名在线用户具有不同贡献和停留时长"],
  steps: ["打开在线观众", "选择按贡献排序", "切换为按停留时长排序"],
  expected: ["按贡献排序时列表顺序依据本场贡献值", "按停留时长排序时列表顺序依据本场停留时长"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P2",
  description: "验证主播从用户卡发送 @ 欢迎",
  point: "@欢迎用户",
  pre: ["主播正在直播", "目标用户在线且可接收公屏消息"],
  steps: ["打开目标用户资料卡", "点击“@Ta”", "填写欢迎内容并发送"],
  expected: ["公屏新增包含目标用户标识的欢迎消息", "消息发送者为当前主播"],
  notes: [REQ, ROLE, STATIC],
});
addCase({
  structure: "主播直播间", type: "逻辑校验", priority: "P1",
  description: "验证主播单场向同一非好友观众最多发送三条私信",
  point: "直播间私信单场上限",
  pre: ["主播正在自己的直播场次", "目标观众在线、非好友且双方未拉黑", "本场尚未向目标发送直播间私信"],
  steps: ["通过目标用户卡连续发送三条私信", "再次尝试发送第四条私信"],
  expected: ["前三条私信以普通私信样式进入目标主消息列表", "第四条私信不发送", "系统记录本场对该用户已发送三条直播间私信"],
  notes: [ROLE, "来源：角色与用例文档的业务口径 10"],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证非好友观众回复直播间私信后建立好友关系",
  point: "回复私信自动加好友",
  pre: ["当前直播场次仍在进行", "主播已向在线非好友观众发送有效直播间私信", "双方未拉黑"],
  steps: ["由观众回复该私信", "双方继续互发私信"],
  expected: ["观众回复消息发送成功", "双方自动建立好友关系", "建立好友后双方可按好友规则继续发送私信"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "逻辑校验", priority: "P1",
  description: "验证场次结束后非好友不能回复直播间私信",
  point: "直播结束后的非好友回复",
  pre: ["主播曾在场次 A 向非好友观众发送直播间私信", "场次 A 已结束", "观众在场次内未回复且双方仍非好友"],
  steps: ["由观众在历史会话中尝试回复该私信"],
  expected: ["观众消息不发送", "双方不建立好友关系", "历史会话本身不授予发送权限"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P2",
  description: "验证主播向观众发送答谢礼物",
  point: "送礼答谢",
  pre: ["主播正在直播", "目标观众在线", "主播具备可用的答谢礼物"],
  steps: ["打开目标观众资料卡", "点击“答谢”", "选择答谢礼物并确认"],
  expected: ["目标观众收到答谢礼物", "系统生成关联主播、观众和当前直播场次的答谢礼物记录"],
  notes: [REQ, ROLE, STATIC],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证主播设置符合条件的长期房管",
  point: "设置房管",
  pre: ["主播已设置的房管少于 3 人", "目标用户不在直播间黑名单内", "双方无账号拉黑关系"],
  steps: ["输入目标用户 ID 或打开目标用户资料卡", "开启“设为房管”"],
  expected: ["目标用户获得该主播的房管权限", "授权在该主播后续直播中持续有效，直至主播取消", "系统保存主播与房管的授权关系"],
  notes: [REQ, ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "逻辑校验", priority: "P1",
  description: "验证房管达到三人后不能继续添加",
  point: "房管人数上限",
  pre: ["主播已存在 3 名有效房管", "第 4 名目标用户满足其他房管条件"],
  steps: ["尝试将第 4 名用户设置为房管"],
  expected: ["第 4 名用户未获得房管权限", "现有 3 名房管关系不变"],
  notes: [REQ, ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "异常用例", priority: "P1",
  description: "验证黑名单或账号拉黑关系阻止设置房管",
  point: "房管目标关系限制",
  pre: ["场景 A：目标用户在该主播直播间黑名单内", "场景 B：主播与目标用户存在任一方向账号拉黑"],
  steps: ["在场景 A 尝试设置目标用户为房管", "在场景 B 尝试设置目标用户为房管"],
  expected: ["两个场景下目标用户均未获得房管权限", "既有黑名单或拉黑关系不变"],
  notes: [REQ, ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证主播取消长期房管授权",
  point: "取消房管",
  pre: ["目标用户是该主播的有效房管"],
  steps: ["主播打开房管列表", "对目标用户执行取消房管", "在确认提示中确认", "进入该主播后续直播场次"],
  expected: ["目标用户的房管授权被收回", "目标用户在后续场次不再获得房管管理操作"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证主播禁言当前场次在线用户",
  point: "主播禁言用户",
  pre: ["主播正在直播", "目标用户在线且可发言"],
  steps: ["主播打开目标用户资料卡", "执行禁言并确认", "目标用户尝试发送公屏消息"],
  expected: ["目标用户在当前场次不能继续发送公屏消息", "目标用户已发送消息保留", "系统记录主播的禁言操作"],
  notes: [REQ, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证主播踢出用户且限制本场重进",
  point: "主播踢出用户",
  pre: ["主播正在直播", "目标用户在线"],
  steps: ["主播打开目标用户资料卡", "点击“踢出直播间”并确认", "目标用户再次尝试进入当前场次", "目标用户尝试进入主播下一场直播"],
  expected: ["目标用户退出当前直播间并在本场不可重进", "下一场直播不继承本次踢出限制"],
  notes: [REQ, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证直播间黑名单仅永久限制进入该主播直播间",
  point: "直播间黑名单作用域",
  pre: ["主播与目标用户不存在账号拉黑", "目标用户当前可私信或申请好友"],
  steps: ["主播将目标用户加入直播间黑名单", "目标用户尝试进入该主播当前及后续直播间", "目标用户尝试私信或申请好友"],
  expected: ["目标用户不能进入该主播当前及后续直播间", "仅加入直播间黑名单不阻止私信或好友申请"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证解除直播间黑名单后恢复进房资格",
  point: "解除直播间黑名单",
  pre: ["目标用户在该主播直播间黑名单内", "双方不存在账号拉黑或平台封禁"],
  steps: ["主播在直播间黑名单中解除目标用户", "目标用户尝试进入该主播直播间"],
  expected: ["目标用户的直播间黑名单记录被解除", "目标用户恢复进入该主播直播间的资格"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证主播拉黑账号后叠加直播间与社交限制",
  point: "主播拉黑账号",
  pre: ["主播与目标用户未拉黑", "目标用户可进入直播间并发起私信或好友申请"],
  steps: ["主播拉黑目标用户账号", "目标用户尝试进入该主播直播间", "双方尝试私信和好友申请", "检查既有粉丝团团籍"],
  expected: ["目标用户不能进入该主播直播间", "双方不能私信或发起、处理好友申请", "已有粉丝团团籍不变"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证解除账号拉黑后恢复账号互动资格",
  point: "解除账号拉黑",
  pre: ["主播与目标用户存在账号拉黑关系", "双方不存在平台封禁", "目标用户不在该主播直播间黑名单内"],
  steps: ["解除双方账号拉黑关系", "目标用户尝试进入该主播直播间", "双方尝试发送私信和好友申请"],
  expected: ["双方恢复私信和好友申请资格", "目标用户恢复进入该主播直播间的资格", "其他独立限制不因解除账号拉黑而变化"],
  notes: [ROLE, PERM],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P2",
  description: "验证主播清屏仅清除当前公屏展示",
  point: "直播间清屏",
  pre: ["当前公屏存在多条互动消息", "主播正在直播"],
  steps: ["打开直播设置或更多功能", "点击“清屏”"],
  expected: ["当前直播间公屏已展示消息被清空", "主播直播场次保持进行中"],
  notes: [REQ, PERM, ANNO, STATIC],
});
addCase({
  structure: "结束直播", type: "功能需求", priority: "P2",
  description: "验证主播取消结束直播后继续开播",
  point: "取消结束直播",
  pre: ["主播正在直播"],
  steps: ["点击结束直播按钮", "在确认提示中点击“取消”"],
  expected: ["结束确认提示关闭", "当前直播场次保持进行中", "观众仍可继续观看"],
  notes: [REQ, STATIC],
});
addCase({
  structure: "结束直播", type: "业务流程", priority: "P0",
  description: "验证主播确认结束直播并生成场次数据",
  point: "结束直播场次",
  pre: ["主播存在进行中的直播场次", "本场已有观看、礼物和涨粉数据"],
  steps: ["点击结束直播按钮", "在确认提示中点击“结束直播”"],
  expected: ["当前直播场次关闭且不再接受新观众进入", "在线观众进入观众直播结束页", "主播进入主播直播结束页", "系统生成本场直播记录、收益和数据概览"],
  notes: [REQ, ROLE, STATIC],
});
addCase({
  structure: "结束直播", type: "逻辑校验", priority: "P1",
  description: "验证主播结束页数据与本场记录一致",
  point: "主播结束页数据",
  pre: ["主播刚结束一场直播", "本场时长、观看人数和收益已结算到场次记录"],
  steps: ["查看主播直播结束页", "核对直播时长、观看人数和本场收益"],
  expected: ["结束页展示的直播时长、观看人数和本场收益与本场直播记录一致"],
  notes: [REQ, ROLE, STATIC],
});
addCase({
  structure: "结束直播", type: "功能需求", priority: "P2",
  description: "验证主播结束页进入直播数据",
  point: "查看直播数据入口",
  pre: ["主播位于本场直播结束页"],
  steps: ["点击“查看直播数据”"],
  expected: ["页面进入当前主播的直播数据页"],
  notes: [SPEC, STATIC],
});
addCase({
  structure: "结束直播", type: "功能需求", priority: "P2",
  description: "验证主播结束页返回主播中心",
  point: "返回主播中心入口",
  pre: ["主播位于本场直播结束页"],
  steps: ["点击“返回主播中心”"],
  expected: ["页面进入当前主播的主播中心"],
  notes: [SPEC, STATIC],
});
addCase({
  structure: "主播连麦", type: "业务流程", priority: "P1",
  description: "验证普通房主播发起两人视频连麦邀请",
  point: "发起主播连麦",
  pre: ["连麦功能已纳入当前版本并开启", "双方均在普通房、在线且具备连麦权限", "双方当前未连麦"],
  steps: ["主播 A 点击 PK 或连麦入口", "选择主播 B", "发送邀请"],
  expected: ["系统生成一条待主播 B 处理的连麦邀请", "主播 B 收到该邀请", "主播 A 在对方接受前保持单主播直播状态"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播连麦", type: "业务流程", priority: "P1",
  description: "验证受邀主播接受后建立两人分屏连麦",
  point: "接受主播连麦",
  pre: ["主播 B 存在主播 A 发出的有效邀请", "双方仍在普通房且在线"],
  steps: ["主播 B 打开连麦邀请", "点击接受"],
  expected: ["系统建立主播 A 与主播 B 的连麦关系", "双方直播间展示两位主播左右分屏画面", "连麦参与主播数量为 2"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播连麦", type: "业务流程", priority: "P1",
  description: "验证连麦主播确认退出后恢复单人直播",
  point: "结束主播连麦",
  pre: ["两位主播正在连麦"],
  steps: ["任一主播点击退出连麦", "在确认提示中确认退出"],
  expected: ["两位主播的连麦关系解除", "双方恢复各自单主播直播画面", "普通房恢复可用的连麦入口", "两场直播均保持进行中"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播连麦", type: "逻辑校验", priority: "P1",
  description: "验证门票房和密码房不提供连麦或 PK 能力",
  point: "特殊房型禁用连麦",
  pre: ["主播分别在门票房和密码房直播"],
  steps: ["查看两类直播间底部操作", "尝试从直播设置或其他入口发起连麦或 PK"],
  expected: ["门票房和密码房均不提供可用的连麦或 PK 入口", "系统不生成连麦邀请"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播连麦", type: "逻辑校验", priority: "P1",
  description: "验证两人连麦中不能加入第三位主播",
  point: "连麦人数上限",
  pre: ["主播 A 与主播 B 正在普通房连麦", "主播 C 在线且具备连麦权限"],
  steps: ["尝试邀请主播 C 加入当前连麦"],
  expected: ["主播 C 不加入当前连麦", "当前连麦仍仅包含主播 A 和主播 B"],
  notes: [REQ, ROLE, ANNO],
});
addCase({
  structure: "主播连麦", type: "异常用例", priority: "P2",
  description: "验证不满足在线或权限条件时不创建连麦邀请",
  point: "连麦邀请条件",
  pre: ["场景 A：目标主播离线", "场景 B：目标主播无连麦权限"],
  steps: ["在场景 A 发起邀请", "在场景 B 发起邀请"],
  expected: ["两个场景均不生成有效连麦邀请", "发起方保持原直播状态"],
  notes: [ROLE],
});
addCase({
  structure: "结束直播", type: "功能需求", priority: "P1",
  description: "验证主播结束后观众进入直播结束页",
  point: "观众直播结束页",
  pre: ["观众正在观看直播", "主播结束当前直播"],
  steps: ["查看观众端页面状态"],
  expected: ["观众进入当前主播的直播结束页", "页面展示当前主播直播已结束"],
  notes: [SPEC, STATIC],
});
addCase({
  structure: "结束直播", type: "功能需求", priority: "P2",
  description: "验证观众从直播结束页返回直播广场",
  point: "观众结束页返回",
  pre: ["观众位于直播结束页"],
  steps: ["点击“返回首页”"],
  expected: ["页面返回直播广场"],
  notes: [SPEC, STATIC],
});

addCase({
  structure: "开播设置", type: "业务流程", priority: "P1",
  description: "验证主播保存有效门票房设置",
  point: "门票房有效设置",
  pre: ["主播具备直播权限", "门票房灰度开关已开启"],
  steps: ["进入开播设置", "打开房型设置", "选择“门票”", "填写门票价格 10 金币", "保存房型设置"],
  expected: ["房型设置保存为门票房并回显门票价格 10 金币"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "开播设置", type: "业务流程", priority: "P1",
  description: "验证主播保存有效密码房设置",
  point: "密码房有效设置",
  pre: ["主播具备直播权限", "密码房灰度开关已开启", "使用符合当前原型 4 至 12 位提示的测试密码"],
  steps: ["进入开播设置", "打开房型设置", "选择“密码”", "填写有效密码", "设置广场展示范围和粉丝授权名单", "保存房型设置"],
  expected: ["房型设置保存为密码房并回显本次可见范围配置"],
  notes: [REQ, ANNO, STATIC, "说明：密码精确长度与字符类型仍以 Q-003 确认为准。"],
});
addCase({
  structure: "观众互动", type: "功能需求", priority: "P2",
  description: "验证观众清屏仅清除本地互动展示",
  point: "观众端清屏",
  pre: ["观众正在直播间观看", "当前公屏已有评论和礼物消息"],
  steps: ["打开“全部功能”", "点击“清屏”"],
  expected: ["当前观众端的互动消息区域被清空，直播播放保持进行中"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P1",
  description: "验证普通房主播打开直播设置",
  point: "普通房直播设置菜单",
  pre: ["主播正在普通房直播"],
  steps: ["点击直播间底部“…”"],
  expected: ["直播设置菜单提供美颜设置、禁用用户、清屏和转发操作，房间密码入口为不可用状态"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P1",
  description: "验证主播查看本场禁用用户",
  point: "禁用用户列表",
  pre: ["主播正在直播", "当前场次已有被禁言或被踢出的用户"],
  steps: ["打开直播设置", "点击“禁用用户”"],
  expected: ["禁用用户列表展示当前场次受限制的用户及其限制状态"],
  notes: [ANNO, "来源：prototype/assets/live-muted-users.js", STATIC],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证主播二次确认后解除用户禁言",
  point: "解除禁言确认",
  pre: ["主播正在直播", "目标用户处于当前场次禁言状态"],
  steps: ["进入禁用用户列表", "点击目标用户的解除禁言操作", "完成两次确认"],
  expected: ["目标用户的当前场次禁言状态被解除"],
  notes: [ANNO, "来源：prototype/assets/live-muted-users.js", STATIC],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P1",
  description: "验证密码房主播修改房间密码",
  point: "直播中修改密码",
  pre: ["主播正在密码房直播", "准备符合最终密码规则的新密码"],
  steps: ["打开直播设置", "进入房间密码设置", "输入新密码", "确认修改"],
  expected: ["密码房保存新密码，后续进房校验使用新密码"],
  notes: [ROLE, ANNO, STATIC, "说明：密码精确长度与字符类型仍以 Q-003 确认为准。"],
});
addCase({
  structure: "主播直播间", type: "业务流程", priority: "P2",
  description: "验证主播确认转发直播间给粉丝群",
  point: "转发至粉丝群",
  pre: ["主播正在直播", "主播已创建粉丝群"],
  steps: ["打开直播设置", "点击“转发”", "选择置顶的粉丝群", "确认转发"],
  expected: ["目标粉丝群收到可进入当前直播间的直播房间卡片"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播直播间", type: "功能需求", priority: "P1",
  description: "验证主播查看本场贡献和收到礼物",
  point: "本场贡献与收礼入口",
  pre: ["主播正在直播", "当前场次已有观众送礼数据"],
  steps: ["点击直播间顶部的本场贡献数值"],
  expected: ["页面展示当前场次的贡献榜和收到礼物记录"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播连麦", type: "功能需求", priority: "P1",
  description: "验证主播按 ID 或名字搜索连麦对象",
  point: "连麦主播搜索",
  pre: ["主播正在普通房直播", "目标主播在线且具备连麦权限"],
  steps: ["打开连麦主播面板", "分别按目标主播 ID 和名字搜索"],
  expected: ["两种搜索方式均返回身份与目标主播一致的可邀请记录"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "主播连麦", type: "业务流程", priority: "P2",
  description: "验证主播取消已发出的连麦请求",
  point: "取消发出请求",
  pre: ["主播 A 已向主播 B 发出连麦请求", "主播 B 尚未处理"],
  steps: ["在发出的请求中选择主播 B", "点击取消请求"],
  expected: ["主播 B 对应的待处理连麦请求被取消"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播连麦", type: "逻辑校验", priority: "P1",
  description: "验证被邀请主播可同时收到多条连麦邀请",
  point: "多条收到邀请",
  pre: ["主播 B 正在普通房直播且未连麦", "主播 A 和主播 C 均满足连麦条件"],
  steps: ["由主播 A 向主播 B 发起邀请", "由主播 C 向主播 B 发起邀请", "查看主播 B 的收到邀请列表"],
  expected: ["主播 B 的收到邀请列表同时保留主播 A 和主播 C 的两条待处理邀请"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播直播间", type: "逻辑校验", priority: "P2",
  description: "验证普通房房间密码入口不可用",
  point: "普通房密码入口限制",
  pre: ["主播正在普通房直播"],
  steps: ["打开直播设置", "查看并点击房间密码入口"],
  expected: ["房间密码入口保持置灰且不打开密码编辑面板"],
  notes: [ANNO, STATIC],
});
addCase({
  structure: "主播连麦", type: "逻辑校验", priority: "P1",
  description: "验证密码房 PK 入口不可用",
  point: "密码房 PK 限制",
  pre: ["主播正在密码房直播"],
  steps: ["点击 PK 入口"],
  expected: ["页面不发起连麦并提示“密码房无法发起连麦”"],
  notes: [REQ, ANNO, STATIC],
});
addCase({
  structure: "主播连麦", type: "逻辑校验", priority: "P2",
  description: "验证连麦中房间密码入口不可用",
  point: "连麦中密码入口限制",
  pre: ["主播正在普通房两人连麦中"],
  steps: ["打开直播设置", "查看并点击房间密码入口"],
  expected: ["房间密码入口保持置灰且不打开密码编辑面板"],
  notes: [ANNO, STATIC],
});

const sourceCases = cases.map((item) => ({ ...item }));

// Legacy mechanical splitting is intentionally disabled. Delivery compilation below
// requires explicit child-case metadata and never derives titles from expected results.
if (false) {
const atomicExpectedOverrides = new Map([
  ["选择“新人”后展示新人直播数据且“新人”处于选中状态", ["选择“新人”后展示新人直播数据", "“新人”处于选中状态"]],
  ["选择“热门”后展示按后台热门权重返回的直播数据且“热门”处于选中状态", ["选择“热门”后展示按后台热门权重返回的直播数据", "“热门”处于选中状态"]],
  ["直播流切换为所选档位并继续播放", ["直播流切换为所选清晰度档位", "清晰度切换过程中直播继续播放"]],
  ["横屏时直播画面按横屏模式展示且直播不中断", ["横屏时直播画面按横屏模式展示", "切换横屏时直播播放不中断"]],
  ["用户被移出直播间且本场次不可重新进入", ["用户被移出当前直播间", "用户本场次不能重新进入"]],
  ["原消费明细保留且不生成退款流水", ["原门票消费明细保持不变", "消费明细中不生成门票退款流水"]],
  ["页面进入目标密码房并播放直播", ["页面进入目标密码房", "目标密码房的直播画面开始播放"]],
  ["用户停留在原页面且未进入直播间", ["用户停留在原页面", "用户未进入目标直播间"]],
  ["旧密码验证失败且用户不能进入", ["旧密码验证失败", "使用旧密码不能进入目标密码房"]],
  ["新密码验证通过并进入目标密码房", ["新密码验证通过", "使用新密码进入目标密码房"]],
  ["输入框清空且发送按钮恢复不可用状态", ["消息发送后输入框清空", "消息发送后发送按钮恢复不可用状态"]],
  ["80 个字符的消息可提交并展示在公屏", ["80 个字符的消息可以提交", "已提交的 80 个字符消息展示在公屏"]],
  ["页面离开当前直播间并返回直播广场", ["页面返回直播广场"]],
  ["礼物未赠送且公屏不新增送礼播报", ["目标礼物未赠送", "公屏不新增本次送礼播报"]],
  ["用户建立该主播粉丝团团籍和群籍", ["用户建立该主播的粉丝团团籍", "用户建立该主播粉丝群的群籍"]],
  ["举报操作仅生成举报工单，不新增拉黑或直播间限制", ["举报操作不新增账号拉黑关系", "举报操作不新增直播间限制"]],
  ["40 个字符的标题可保存并回显", ["40 个字符的标题可以保存", "开播设置页回显已保存的 40 个字符标题"]],
  ["选择后页面回显“唱歌”并作为本场直播分类", ["选择后页面回显直播分类“唱歌”", "本场直播分类保存为“唱歌”"]],
  ["普通房仍可选择并保存", ["普通房仍可选择", "普通房可以保存为当前房型"]],
  ["授权粉丝和非授权用户进入直播内容前均需通过房间密码校验", ["授权粉丝进入直播内容前需要通过房间密码校验", "非授权用户通过已知入口进入直播内容前需要通过房间密码校验"]],
  ["“磨皮”保持选中且数值为 70", ["“磨皮”保持选中状态", "“磨皮”参数值保持为 70"]],
  ["“大眼”保持选中且数值为 30", ["“大眼”保持选中状态", "“大眼”参数值保持为 30"]],
  ["美颜和美型均清空当前选中项目", ["美颜分类清空当前选中项目", "美型分类清空当前选中项目"]],
  ["消费流水与收益流水关联同一直播场次且金额均为 100 金币", ["消费流水记录的直播场次为当前场次，金额为 100 金币", "收益流水记录的直播场次为当前场次，金额为 100 金币"]],
  ["建立好友后双方可按好友规则继续发送私信", ["建立好友后主播可按好友规则向观众发送私信", "建立好友后观众可按好友规则向主播发送私信"]],
  ["两个场景下目标用户均未获得房管权限", ["直播间黑名单内的目标用户未获得房管权限", "与主播存在账号拉黑关系的目标用户未获得房管权限"]],
  ["既有黑名单或拉黑关系不变", ["目标用户原有的直播间黑名单关系保持不变", "主播与目标用户原有的账号拉黑关系保持不变"]],
  ["目标用户退出当前直播间并在本场不可重进", ["目标用户退出当前直播间", "目标用户在本场直播中不能重新进入"]],
  ["仅加入直播间黑名单不阻止私信或好友申请", ["仅加入直播间黑名单不阻止双方发送私信", "仅加入直播间黑名单不阻止双方发起好友申请"]],
  ["双方不能私信或发起、处理好友申请", ["主播不能向目标用户发送私信", "目标用户不能向主播发送私信", "主播不能向目标用户发起好友申请", "目标用户不能向主播发起好友申请", "主播不能处理目标用户的好友申请", "目标用户不能处理主播的好友申请"]],
  ["双方恢复私信和好友申请资格", ["主播恢复向目标用户发送私信的资格", "目标用户恢复向主播发送私信的资格", "主播恢复向目标用户发起好友申请的资格", "目标用户恢复向主播发起好友申请的资格"]],
  ["当前直播场次关闭且不再接受新观众进入", ["当前直播场次状态变为已关闭", "当前直播场次不再接受新观众进入"]],
  ["系统生成本场直播记录、收益和数据概览", ["系统生成本场直播记录", "系统生成本场收益数据", "系统生成本场数据概览"]],
  ["结束页展示的直播时长、观看人数和本场收益与本场直播记录一致", ["结束页展示的直播时长与本场直播记录一致", "结束页展示的观看人数与本场直播记录一致", "结束页展示的本场收益与本场直播记录一致"]],
  ["双方直播间展示两位主播左右分屏画面", ["主播 A 的直播间展示两位主播左右分屏画面", "主播 B 的直播间展示两位主播左右分屏画面"]],
  ["双方恢复各自单主播直播画面", ["主播 A 的直播间恢复单主播直播画面", "主播 B 的直播间恢复单主播直播画面"]],
  ["两场直播均保持进行中", ["主播 A 的直播场次保持进行中", "主播 B 的直播场次保持进行中"]],
  ["门票房和密码房均不提供可用的连麦或 PK 入口", ["门票房不提供可用的连麦或 PK 入口", "密码房不提供可用的连麦或 PK 入口"]],
  ["系统不生成连麦邀请", ["门票房不生成连麦邀请", "密码房不生成连麦邀请"]],
  ["两个场景均不生成有效连麦邀请", ["目标主播离线时不生成有效连麦邀请", "目标主播无连麦权限时不生成有效连麦邀请"]],
  ["发起方保持原直播状态", ["目标主播离线时发起方保持原直播状态", "目标主播无连麦权限时发起方保持原直播状态"]],
]);

const p0PreferredExpected = new Map([
  ["LIVE-001", "直播卡片展示直播间封面、主播昵称或头像、直播标题、在线人数和分类标签"],
  ["LIVE-007", "页面进入目标直播间"],
  ["LIVE-011", "购买成功后进入目标直播间"],
  ["LIVE-016", "页面进入目标密码房"],
  ["LIVE-021", "当前用户与主播建立关注关系"],
  ["LIVE-022", "公屏新增当前用户发送的文字消息"],
  ["LIVE-031", "用户余额 = 100 - 20 = 80 金币"],
  ["LIVE-046", "页面进入开播设置"],
  ["LIVE-060", "系统创建一场进行中的直播场次"],
  ["LIVE-084", "当前直播场次状态变为已关闭"],
]);

function expectedLabel(expected) {
  return expected
    .replace(/^页面/, "")
    .replace(/^系统/, "")
    .replace(/^当前/, "")
    .replace(/[；。]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 42);
}

function refineCaseForAtomicResult(source, expected) {
  const refined = {
    ...source,
    用例描述: `验证${source.验证用例子项}中的${expectedLabel(expected)}`,
    验证用例子项: `${source.验证用例子项}-${expectedLabel(expected)}`,
    前置条件: [...source.前置条件],
    操作步骤: [...source.操作步骤],
    预期结果: [expected],
    备注: [...source.备注, `追溯：拆分自 ${source.用例编号}。`],
  };

  if (source.用例编号 === "LIVE-002") {
    refined.操作步骤 = expected.includes("新人")
      ? ["进入直播广场", "点击“新人”"]
      : ["进入直播广场", "点击“热门”"];
  }

  if (source.用例编号 === "LIVE-003") {
    if (expected.includes("分类选项")) refined.操作步骤 = ["进入直播广场", "查看分类选项"];
    else if (expected.includes("分类 A")) refined.操作步骤 = ["进入直播广场", "选择分类 A", "查看直播列表"];
    else if (expected.includes("分类 B")) refined.操作步骤 = ["进入直播广场", "选择分类 B", "查看直播列表"];
  }

  if (source.用例编号 === "LIVE-010" && !expected.includes("竖屏")) {
    refined.操作步骤 = ["将直播画面切换为横屏"];
  }

  if (source.用例编号 === "LIVE-019") {
    refined.操作步骤 = expected.includes("旧密码")
      ? ["使用旧密码尝试进入"]
      : ["使用新密码尝试进入"];
  }

  if (source.用例编号 === "LIVE-024") {
    refined.操作步骤 = expected.includes("最多保留")
      ? ["输入超过 80 个字符的内容"]
      : ["输入 80 个字符", "点击“发送”"];
  }

  if (source.用例编号 === "LIVE-041") {
    if (expected.includes("保留前 200")) refined.操作步骤 = ["在补充说明输入 200 个字符"];
    else if (expected.includes("第 201")) refined.操作步骤 = ["在补充说明输入 200 个字符", "继续输入第 201 个字符"];
    else refined.操作步骤 = ["在补充说明输入 200 个字符", "点击“提交”"];
  }

  if (source.用例编号 === "LIVE-057") {
    refined.操作步骤 = expected.includes("首次点击")
      ? ["点击切换摄像头"]
      : ["点击切换摄像头", "再次点击切换摄像头"];
  }

  if (source.用例编号 === "LIVE-058") {
    refined.操作步骤 = expected.includes("磨皮")
      ? ["在“美颜”选择“磨皮”并将数值调整为 70", "切换到“美型”", "切换回“美颜”"]
      : ["切换到“美型”并选择“大眼”", "将数值调整为 30", "切换到“美颜”", "切换回“美型”"];
  }

  if (source.用例编号 === "LIVE-062") {
    refined.操作步骤 = expected.includes("用户 A")
      ? ["目标主播成功开始直播", "查看用户 A 的通知"]
      : ["目标主播成功开始直播", "查看用户 B 的通知"];
  }

  if (source.用例编号 === "LIVE-066") {
    refined.操作步骤 = expected.includes("贡献")
      ? ["打开在线观众", "选择按贡献排序"]
      : ["打开在线观众", "选择按停留时长排序"];
  }

  if (source.用例编号 === "LIVE-074") {
    if (expected.includes("直播间黑名单")) {
      refined.前置条件 = ["目标用户在该主播直播间黑名单内"];
      refined.操作步骤 = ["尝试将目标用户设置为房管"];
    } else if (expected.includes("账号拉黑")) {
      refined.前置条件 = ["主播与目标用户存在任一方向账号拉黑"];
      refined.操作步骤 = ["尝试将目标用户设置为房管"];
    }
  }

  if (source.用例编号 === "LIVE-093") {
    if (expected.includes("离线")) {
      refined.前置条件 = ["目标主播离线"];
      refined.操作步骤 = ["向离线主播发起连麦邀请"];
    } else if (expected.includes("无连麦权限")) {
      refined.前置条件 = ["目标主播无连麦权限"];
      refined.操作步骤 = ["向无连麦权限的主播发起连麦邀请"];
    }
  }

  if (source.用例编号 === "LIVE-091") {
    refined.前置条件 = expected.includes("门票房") ? ["主播正在门票房直播"] : ["主播正在密码房直播"];
    refined.操作步骤 = ["查看直播间底部操作", "尝试从直播设置或其他入口发起连麦或 PK"];
  }

  return refined;
}

const sourceCases = cases.map((item) => ({ ...item }));
const atomicCases = [];
for (const source of sourceCases) {
  const expectedResults = source.预期结果.flatMap((expected) => atomicExpectedOverrides.get(expected) ?? [expected]);
  for (const expected of expectedResults) {
    const item = refineCaseForAtomicResult(source, expected);
    if (source.优先级 === "P0" && p0PreferredExpected.get(source.用例编号) !== expected) item.优先级 = "P1";
    atomicCases.push(item);
  }
}
cases.splice(0, cases.length, ...atomicCases);
cases.forEach((item, index) => {
  item.序号 = index + 1;
  item.用例编号 = `LIVE-${String(index + 1).padStart(3, "0")}`;
});
}

// Rebuild from the business-level source cases. The earlier mechanical splitter is
// kept only for historical comparison; delivery uses these semantically grouped results.
const semanticSplitGroups = new Map([
  ["LIVE-002", [[0], [1]]], ["LIVE-003", [[0], [1], [2]]],
  ["LIVE-008", [[0], [1]]], ["LIVE-010", [[0], [1]]],
  ["LIVE-011", [[0], [1], [2], [3]]], ["LIVE-012", [[0], [1], [2]]],
  ["LIVE-013", [[0], [1], [2]]], ["LIVE-015", [[0], [1], [2]]],
  ["LIVE-017", [[0], [1]]], ["LIVE-019", [[0], [1]]],
  ["LIVE-022", [[0, 1], [2]]], ["LIVE-024", [[0], [1]]],
  ["LIVE-025", [[0, 1], [2]]], ["LIVE-029", [[0], [1]]],
  ["LIVE-031", [[0, 1], [2], [3], [4]]], ["LIVE-032", [[0, 1], [2], [3]]],
  ["LIVE-033", [[0, 1], [2], [3]]], ["LIVE-034", [[0, 1, 2], [3]]],
  ["LIVE-035", [[0, 1], [2]]], ["LIVE-037", [[0], [1], [2]]],
  ["LIVE-038", [[0], [1], [2]]], ["LIVE-040", [[0], [1]]],
  ["LIVE-041", [[0], [1], [2]]], ["LIVE-043", [[0], [1], [2]]],
  ["LIVE-045", [[0, 1], [2], [3]]], ["LIVE-047", [[0], [1], [2]]],
  ["LIVE-050", [[0], [1]]], ["LIVE-052", [[0], [1]]],
  ["LIVE-056", [[0, 1], [2]]], ["LIVE-057", [[0], [1]]],
  ["LIVE-058", [[0], [1]]], ["LIVE-060", [[0], [1]]],
  ["LIVE-063", [[0], [1]]], ["LIVE-065", [[0], [1], [2]]],
  ["LIVE-066", [[0], [1]]], ["LIVE-068", [[0], [1, 2]]],
  ["LIVE-069", [[0], [1, 2]]], ["LIVE-071", [[0], [1]]],
  ["LIVE-072", [[0, 1], [2]]], ["LIVE-074", [[0], [1], [0], [1]]],
  ["LIVE-076", [[0], [1], [2]]], ["LIVE-077", [[0], [1]]],
  ["LIVE-078", [[0], [1]]], ["LIVE-080", [[0], [1], [2]]],
  ["LIVE-081", [[0], [1], [2]]], ["LIVE-084", [[0], [1], [2], [3]]],
  ["LIVE-088", [[0], [1], [2]]], ["LIVE-089", [[0, 2], [1], [1]]],
  ["LIVE-090", [[0], [1], [1], [2], [3]]], ["LIVE-091", [[0, 1], [0, 1]]],
  ["LIVE-093", [[0], [1], [0], [1]]],
]);

const semanticP0Part = new Map([
  ["LIVE-001", 1], ["LIVE-007", 1], ["LIVE-011", 2], ["LIVE-016", 1],
  ["LIVE-021", 1], ["LIVE-022", 1], ["LIVE-031", 1], ["LIVE-046", 1],
  ["LIVE-060", 1], ["LIVE-084", 1],
]);

const semanticExpectedOverrides = new Map([
  ["LIVE-007#1", "用户无需支付金币或输入密码即可进入目标普通房，直播画面自动开始播放"],
  ["LIVE-014#1", "场次 A 结束后原门票失效，进入场次 B 时重新展示场次 B 的购票信息"],
  ["LIVE-015#1", "用户被踢出门票房后离开当前直播间，本场次不可重新进入"],
  ["LIVE-016#1", "当前密码验证通过后进入目标密码房，直播画面开始播放"],
  ["LIVE-018#1", "密码输入面板关闭，用户停留在原页面且未进入目标直播间"],
  ["LIVE-020#1", "隐藏密码房的可见入口不能绕过进房密码校验，未验证用户无法观看直播"],
  ["LIVE-021#1", "当前用户与主播建立关注关系，直播间关注按钮回显已关注状态"],
  ["LIVE-023#1", "空白内容不能提交，公屏不新增消息"],
  ["LIVE-028#1", "贡献榜仅展示当前直播场次的用户贡献数据和对应数值"],
  ["LIVE-031#1", "用户消费金额 = 20 × 1 = 20 金币，余额 = 100 - 20 = 80 金币"],
  ["LIVE-032#1", "余额 19 金币小于礼物价格 20 金币时，目标礼物不送出，用户余额保持 19 金币"],
  ["LIVE-033#1", "连续赠送 5 个单价 20 金币的礼物，本次消耗 = 20 × 5 = 100 金币，余额 = 200 - 100 = 100 金币"],
  ["LIVE-034#1", "用户净消耗 = 1,000 - 200 = 800 金币，主播收益 = 800 × 1% = 8 金币，结算周期汇总舍去小数后的最终值为 8 金币"],
  ["LIVE-036#1", "未选择举报原因时提交按钮不可用，系统不生成举报工单"],
  ["LIVE-042#1", "房管资料卡仅提供禁言、踢出和有依据的评论处置能力，不提供房管授权或结束直播能力"],
  ["LIVE-044#1", "取消房管禁言确认后目标用户状态不变，系统不新增禁言操作记录"],
  ["LIVE-046#1", "具备权限的主播进入开播设置页，可见摄像头预览、标题、封面、分类、房型和美颜入口"],
  ["LIVE-048#1", "有效直播标题保存后在开播设置页回显，本次开播使用该标题"],
  ["LIVE-049#1", "空标题无法保存，标题面板保持打开并提示“请设置直播标题”"],
  ["LIVE-053#1", "普通房设置保存后回显为“普通”，无需填写门票价格或房间密码"],
  ["LIVE-054#1", "门票价格为空时房型设置无法保存，页面提示“请设置门票价格”"],
  ["LIVE-055#1", "房间密码为空时房型设置无法保存，页面提示“请设置房间密码”"],
  ["LIVE-059#1", "恢复默认后美颜与美型均清空选中项目，全部参数重置为 50"],
  ["LIVE-061#1", "开播成功后直播广场出现本场观看入口，卡片的主播、标题、封面、分类和房型与开播设置一致"],
  ["LIVE-062#1", "仅已关注目标主播的用户 A 收到本场开播提醒，未关注的用户 B 不收到该提醒"],
  ["LIVE-064#1", "在线用户列表按实际用户状态展示新用户、关注或老粉、粉丝团、贡献、财富等级和限制标识"],
  ["LIVE-067#1", "公屏新增由当前主播发送且包含目标用户标识的欢迎消息"],
  ["LIVE-070#1", "直播结束后非好友观众不能回复历史直播间私信，双方不会因此建立好友关系"],
  ["LIVE-073#1", "已有 3 名房管时第 4 名用户不能获得房管权限，现有房管关系保持不变"],
  ["LIVE-075#1", "取消房管后目标用户失去长期房管权限，后续场次不再获得房管操作"],
  ["LIVE-079#1", "解除直播间黑名单后对应记录被移除，目标用户恢复进入该主播直播间的资格"],
  ["LIVE-082#1", "主播清屏后当前公屏消息被清除，直播场次保持进行中"],
  ["LIVE-083#1", "取消结束直播后确认提示关闭，当前场次和观众观看均保持进行中"],
  ["LIVE-085#1", "主播结束页的直播时长、观看人数和本场收益分别与当前场次记录一致"],
  ["LIVE-089#1", "系统建立主播 A 与主播 B 的两人连麦关系，参与主播数量为 2"],
  ["LIVE-089#2", "主播 A 的直播间展示主播 A 与主播 B 的左右分屏画面"],
  ["LIVE-089#3", "主播 B 的直播间展示主播 A 与主播 B 的左右分屏画面"],
  ["LIVE-090#2", "主播 A 的直播间恢复主播 A 的单人直播画面"],
  ["LIVE-090#3", "主播 B 的直播间恢复主播 B 的单人直播画面"],
  ["LIVE-091#1", "门票房不提供可用的连麦或 PK 入口，系统不生成连麦邀请"],
  ["LIVE-091#2", "密码房不提供可用的连麦或 PK 入口，系统不生成连麦邀请"],
  ["LIVE-092#1", "两人连麦中主播 C 不能加入，当前连麦关系仍仅包含主播 A 和主播 B"],
  ["LIVE-074#1", "直播间黑名单内的目标用户未获得房管权限"],
  ["LIVE-074#2", "目标用户原有的直播间黑名单关系保持不变"],
  ["LIVE-074#3", "与主播存在账号拉黑关系的目标用户未获得房管权限"],
  ["LIVE-074#4", "主播与目标用户原有的账号拉黑关系保持不变"],
  ["LIVE-093#1", "目标主播离线时系统不生成有效连麦邀请"],
  ["LIVE-093#2", "邀请离线主播后发起方保持原直播状态"],
  ["LIVE-093#3", "目标主播无连麦权限时系统不生成有效连麦邀请"],
  ["LIVE-093#4", "邀请无连麦权限主播后发起方保持原直播状态"],
  ["LIVE-094#1", "主播结束直播后观众进入对应结束页，页面展示“Sari 的直播已结束”"],
]);

function childCase(description, point) {
  return { description, point };
}

const semanticCaseDefinitions = new Map([
  ["LIVE-002#1", childCase("验证切换至新人直播列表", "新人直播列表切换")],
  ["LIVE-002#2", childCase("验证切换至热门直播列表", "热门直播列表切换")],
  ["LIVE-003#1", childCase("验证直播分类来源", "直播分类选项")],
  ["LIVE-003#2", childCase("验证分类 A 的直播筛选", "分类 A 直播筛选")],
  ["LIVE-003#3", childCase("验证分类 B 的直播筛选", "分类 B 直播筛选")],
  ["LIVE-008#1", childCase("验证直播断流时展示重连提示", "断流重连提示")],
  ["LIVE-008#2", childCase("验证直播流中断后的自动恢复", "断流恢复播放")],
  ["LIVE-010#1", childCase("验证直播画面切换为横屏", "横屏切换")],
  ["LIVE-010#2", childCase("验证直播画面恢复为竖屏", "竖屏恢复")],
  ["LIVE-011#1", childCase("验证门票购买信息展示", "门票购买信息")],
  ["LIVE-011#2", childCase("验证购买门票后进入直播间", "购票成功进房")],
  ["LIVE-011#3", childCase("验证购买门票扣减用户余额", "购票余额扣减")],
  ["LIVE-011#4", childCase("验证购买门票生成消费流水", "购票流水记录")],
  ["LIVE-012#1", childCase("验证余额不足时不能购买门票", "余额不足购票拦截")],
  ["LIVE-012#2", childCase("验证购票失败后用户余额不变", "购票失败余额")],
  ["LIVE-012#3", childCase("验证余额不足时提供充值入口", "购票充值入口")],
  ["LIVE-013#1", childCase("验证已购票用户再次进入同一场次", "已购票再次进房")],
  ["LIVE-013#2", childCase("验证重复进房不重复扣费", "重复进房扣费")],
  ["LIVE-013#3", childCase("验证重复进房不生成重复流水", "重复进房流水")],
  ["LIVE-015#1", childCase("验证门票房被踢后的进房限制", "被踢后进房限制")],
  ["LIVE-015#2", childCase("验证门票房被踢后不退款", "被踢后门票退款")],
  ["LIVE-015#3", childCase("验证门票房被踢后的消费流水", "被踢后门票流水")],
  ["LIVE-017#1", childCase("验证错误密码无法进入直播间", "错误密码进房拦截")],
  ["LIVE-017#2", childCase("验证错误密码校验提示", "错误密码提示")],
  ["LIVE-019#1", childCase("验证重置密码后旧密码失效", "旧密码失效")],
  ["LIVE-019#2", childCase("验证重置密码后新密码生效", "新密码生效")],
  ["LIVE-022#1", childCase("验证公屏文字消息展示", "公屏文字展示")],
  ["LIVE-022#2", childCase("验证消息发送后的输入区状态", "发送后输入区复位")],
  ["LIVE-024#1", childCase("验证 80 字评论可以发送", "评论 80 字边界")],
  ["LIVE-024#2", childCase("验证评论输入长度上限", "评论超长限制")],
  ["LIVE-025#1", childCase("验证禁言用户无法发送评论", "禁言发送限制")],
  ["LIVE-025#2", childCase("验证禁言不删除历史消息", "禁言历史消息")],
  ["LIVE-029#1", childCase("验证观众主动退出后返回直播广场", "观众退出返回")],
  ["LIVE-029#2", childCase("验证观众退出不结束直播场次", "观众退出场次状态")],
  ["LIVE-031#1", childCase("验证普通礼物扣费和用户余额", "用户扣费与余额")],
  ["LIVE-031#2", childCase("验证普通礼物计入主播实时收益", "主播实时收益")],
  ["LIVE-031#3", childCase("验证普通礼物生成公屏播报", "公屏送礼播报")],
  ["LIVE-031#4", childCase("验证普通礼物生成消费流水", "礼物消费流水")],
  ["LIVE-032#1", childCase("验证余额不足时拒绝送礼", "余额不足送礼拦截")],
  ["LIVE-032#2", childCase("验证送礼失败不增加主播收益", "送礼失败主播收益")],
  ["LIVE-032#3", childCase("验证送礼余额不足时提供充值入口", "送礼充值入口")],
  ["LIVE-033#1", childCase("验证连送礼物累计扣费", "连送扣费与余额")],
  ["LIVE-033#2", childCase("验证连送礼物累计主播收益", "连送主播收益")],
  ["LIVE-033#3", childCase("验证连送礼物累计公屏数量", "连送公屏播报")],
  ["LIVE-034#1", childCase("验证幸运礼物主播收益计算", "幸运礼物收益计算")],
  ["LIVE-034#2", childCase("验证幸运礼物收益流水可追溯", "幸运礼物收益追溯")],
  ["LIVE-035#1", childCase("验证加入粉丝团后建立团籍和群籍", "粉丝团与群籍建立")],
  ["LIVE-035#2", childCase("验证加入粉丝团后的身份权益", "入团身份权益")],
  ["LIVE-037#1", childCase("验证提交直播间举报生成工单", "直播间举报工单")],
  ["LIVE-037#2", childCase("验证提交直播间举报的成功提示", "直播间举报提示")],
  ["LIVE-037#3", childCase("验证提交直播间举报后返回直播间", "直播间举报返回")],
  ["LIVE-038#1", childCase("验证提交用户举报生成工单", "用户举报工单")],
  ["LIVE-038#2", childCase("验证提交用户举报的成功提示", "用户举报提示")],
  ["LIVE-038#3", childCase("验证提交用户举报后返回直播间", "用户举报返回")],
  ["LIVE-040#1", childCase("验证取消举报后返回直播间", "取消举报返回")],
  ["LIVE-040#2", childCase("验证取消举报不生成工单", "取消举报工单")],
  ["LIVE-041#1", childCase("验证补充说明可以输入 200 字", "补充说明 200 字边界")],
  ["LIVE-041#2", childCase("验证补充说明第 201 字被限制", "补充说明超长限制")],
  ["LIVE-041#3", childCase("验证 200 字补充说明可以提交", "补充说明提交")],
  ["LIVE-043#1", childCase("验证房管禁言限制用户发言", "房管禁言生效")],
  ["LIVE-043#2", childCase("验证房管禁言保留历史消息", "房管禁言历史消息")],
  ["LIVE-043#3", childCase("验证房管禁言操作留痕", "房管禁言记录")],
  ["LIVE-045#1", childCase("验证房管踢人限制本场重进", "房管踢人当前场次")],
  ["LIVE-045#2", childCase("验证房管踢人不影响下一场直播", "房管踢人跨场恢复")],
  ["LIVE-045#3", childCase("验证房管踢人操作留痕", "房管踢人记录")],
  ["LIVE-047#1", childCase("验证平台关闭直播权限后不能开播", "平台直播权限限制")],
  ["LIVE-047#2", childCase("验证直播权限关闭原因展示", "直播权限关闭原因")],
  ["LIVE-047#3", childCase("验证工会不能覆盖平台直播权限", "直播权限优先级")],
  ["LIVE-050#1", childCase("验证 40 字直播标题可以保存", "标题 40 字边界")],
  ["LIVE-050#2", childCase("验证直播标题输入长度上限", "标题超长限制")],
  ["LIVE-052#1", childCase("验证直播分类仅使用后台启用项", "启用分类范围")],
  ["LIVE-052#2", childCase("验证保存并回显直播分类", "分类选择保存")],
  ["LIVE-056#1", childCase("验证密码房广场展示范围", "密码房可见范围")],
  ["LIVE-056#2", childCase("验证授权名单不能绕过房间密码", "授权用户密码校验")],
  ["LIVE-057#1", childCase("验证摄像头从前置切换为后置", "后置摄像头切换")],
  ["LIVE-057#2", childCase("验证摄像头从后置切换回前置", "前置摄像头恢复")],
  ["LIVE-058#1", childCase("验证美颜参数切换后保留", "美颜参数记忆")],
  ["LIVE-058#2", childCase("验证美型参数切换后保留", "美型参数记忆")],
  ["LIVE-060#1", childCase("验证开播时创建直播场次", "直播场次创建")],
  ["LIVE-060#2", childCase("验证开播后进入主播直播间", "开播页面跳转")],
  ["LIVE-063#1", childCase("验证灰度关闭时不能保存特殊房型", "特殊房型灰度限制")],
  ["LIVE-063#2", childCase("验证特殊房型关闭不影响普通房", "普通房灰度隔离")],
  ["LIVE-065#1", childCase("验证普通礼物计入本场收礼", "本场收礼金额")],
  ["LIVE-065#2", childCase("验证普通礼物计入实时收益", "实时收益金额")],
  ["LIVE-065#3", childCase("验证礼物消费和收益流水关联", "消费收益流水关联")],
  ["LIVE-066#1", childCase("验证在线观众按贡献排序", "观众贡献排序")],
  ["LIVE-066#2", childCase("验证在线观众按停留时长排序", "观众停留时长排序")],
  ["LIVE-068#1", childCase("验证单场前三条直播间私信可以发送", "前三条私信发送")],
  ["LIVE-068#2", childCase("验证单场第四条直播间私信被拦截", "第四条私信拦截")],
  ["LIVE-069#1", childCase("验证观众可以回复直播间私信", "观众回复私信")],
  ["LIVE-069#2", childCase("验证回复直播间私信后建立好友关系", "回复后建立好友关系")],
  ["LIVE-071#1", childCase("验证主播答谢礼物送达观众", "答谢礼物送达")],
  ["LIVE-071#2", childCase("验证主播答谢礼物生成记录", "答谢礼物记录")],
  ["LIVE-072#1", childCase("验证长期房管授权生效", "长期房管权限")],
  ["LIVE-072#2", childCase("验证房管授权关系留存", "房管授权记录")],
  ["LIVE-074#1", childCase("验证直播间黑名单用户不能设为房管", "黑名单用户房管限制")],
  ["LIVE-074#2", childCase("验证房管设置失败不改变直播间黑名单", "黑名单关系保持")],
  ["LIVE-074#3", childCase("验证账号拉黑用户不能设为房管", "账号拉黑房管限制")],
  ["LIVE-074#4", childCase("验证房管设置失败不改变账号拉黑关系", "账号拉黑关系保持")],
  ["LIVE-076#1", childCase("验证主播禁言限制用户发言", "主播禁言生效")],
  ["LIVE-076#2", childCase("验证主播禁言保留历史消息", "主播禁言历史消息")],
  ["LIVE-076#3", childCase("验证主播禁言操作留痕", "主播禁言记录")],
  ["LIVE-077#1", childCase("验证主播踢人限制本场重进", "主播踢人当前场次")],
  ["LIVE-077#2", childCase("验证主播踢人不影响下一场直播", "主播踢人跨场恢复")],
  ["LIVE-078#1", childCase("验证直播间黑名单持续限制进房", "直播间黑名单进房限制")],
  ["LIVE-078#2", childCase("验证直播间黑名单不影响账号互动", "直播间黑名单作用域")],
  ["LIVE-080#1", childCase("验证账号拉黑限制进入主播直播间", "账号拉黑进房限制")],
  ["LIVE-080#2", childCase("验证账号拉黑限制私信和好友申请", "账号拉黑社交限制")],
  ["LIVE-080#3", childCase("验证账号拉黑不改变既有粉丝团团籍", "账号拉黑团籍保持")],
  ["LIVE-081#1", childCase("验证解除账号拉黑恢复账号互动", "解除拉黑社交恢复")],
  ["LIVE-081#2", childCase("验证解除账号拉黑恢复进房资格", "解除拉黑进房恢复")],
  ["LIVE-081#3", childCase("验证解除账号拉黑不清除其他限制", "解除拉黑限制隔离")],
  ["LIVE-084#1", childCase("验证主播结束直播后关闭场次", "直播场次关闭")],
  ["LIVE-084#2", childCase("验证主播结束直播后观众进入结束页", "观众端结束页")],
  ["LIVE-084#3", childCase("验证结束直播后的主播端落点", "主播端结束页")],
  ["LIVE-084#4", childCase("验证结束直播后生成场次数据", "直播结束数据生成")],
  ["LIVE-088#1", childCase("验证主播发起连麦请求", "连麦请求创建")],
  ["LIVE-088#2", childCase("验证被邀请主播收到连麦请求", "连麦邀请接收")],
  ["LIVE-088#3", childCase("验证连麦接受前发起方保持单人直播", "连麦等待状态")],
  ["LIVE-089#1", childCase("验证受邀主播接受后建立两人连麦", "两人连麦关系")],
  ["LIVE-089#2", childCase("验证主播 A 进入两人分屏画面", "主播 A 连麦分屏")],
  ["LIVE-089#3", childCase("验证主播 B 进入两人分屏画面", "主播 B 连麦分屏")],
  ["LIVE-090#1", childCase("验证退出连麦后的会话状态", "连麦退出结果")],
  ["LIVE-090#2", childCase("验证主播 A 退出连麦后恢复单人画面", "主播 A 单人画面恢复")],
  ["LIVE-090#3", childCase("验证主播 B 退出连麦后恢复单人画面", "主播 B 单人画面恢复")],
  ["LIVE-090#4", childCase("验证退出连麦后恢复连麦入口", "连麦入口恢复")],
  ["LIVE-090#5", childCase("验证退出连麦不结束双方直播场次", "连麦退出场次状态")],
  ["LIVE-091#1", childCase("验证门票房禁用连麦和 PK", "门票房连麦限制")],
  ["LIVE-091#2", childCase("验证密码房禁用连麦和 PK", "密码房连麦限制")],
  ["LIVE-093#1", childCase("验证不能向离线主播创建连麦邀请", "离线主播邀请限制")],
  ["LIVE-093#2", childCase("验证邀请离线主播不改变发起方直播状态", "离线邀请状态保持")],
  ["LIVE-093#3", childCase("验证不能向无权限主播创建连麦邀请", "无权限主播邀请限制")],
  ["LIVE-093#4", childCase("验证邀请无权限主播不改变发起方直播状态", "无权限邀请状态保持")],
]);

const semanticStepOverrides = new Map([
  ["LIVE-002#1", ["进入直播广场", "点击“新人”"]], ["LIVE-002#2", ["进入直播广场", "点击“热门”"]],
  ["LIVE-003#1", ["进入直播广场", "查看分类选项"]], ["LIVE-003#2", ["选择分类 A", "查看直播列表"]], ["LIVE-003#3", ["选择分类 B", "查看直播列表"]],
  ["LIVE-011#3", ["记录购票前余额", "购买门票", "进入金币钱包查看余额"]],
  ["LIVE-011#4", ["购买门票", "进入金币消费明细", "查看本场门票记录"]],
  ["LIVE-013#2", ["记录当前余额", "退出并重新进入同一门票场次", "再次查看余额"]],
  ["LIVE-013#3", ["记录购票流水数量", "退出并重新进入同一门票场次", "再次查看消费明细"]],
  ["LIVE-015#2", ["记录被踢前余额", "由主播踢出用户", "查看用户金币余额"]],
  ["LIVE-015#3", ["由主播踢出用户", "进入金币消费明细", "查看原门票流水和退款流水"]],
  ["LIVE-019#1", ["使用旧密码尝试进入"]], ["LIVE-019#2", ["使用新密码尝试进入"]],
  ["LIVE-024#1", ["输入 80 个字符", "点击“发送”"]], ["LIVE-024#2", ["输入超过 80 个字符的内容"]],
  ["LIVE-031#2", ["记录主播当前实时收益", "观众赠送 1 个鲜花", "切换到主播端查看实时收益"]],
  ["LIVE-031#3", ["观众赠送 1 个鲜花", "查看直播间公屏"]],
  ["LIVE-031#4", ["观众赠送 1 个鲜花", "进入用户金币消费明细", "查看本次礼物流水"]],
  ["LIVE-037#1", ["选择任一举报原因", "点击“提交”", "检查举报记录"]],
  ["LIVE-037#2", ["选择任一举报原因", "点击“提交”", "查看页面反馈"]],
  ["LIVE-038#1", ["打开目标用户资料卡", "点击举报", "选择任一原因并提交", "检查举报记录"]],
  ["LIVE-038#2", ["打开目标用户资料卡", "点击举报", "选择任一原因并提交", "查看页面反馈"]],
  ["LIVE-041#1", ["在补充说明输入 200 个字符"]], ["LIVE-041#2", ["在补充说明输入 200 个字符", "继续输入第 201 个字符"]], ["LIVE-041#3", ["选择举报原因", "输入 200 个字符", "点击“提交”"]],
  ["LIVE-057#1", ["点击切换摄像头"]], ["LIVE-057#2", ["点击切换摄像头", "再次点击切换摄像头"]],
  ["LIVE-058#1", ["选择“磨皮”并调至 70", "切换分类后返回“美颜”"]], ["LIVE-058#2", ["选择“大眼”并调至 30", "切换分类后返回“美型”"]],
  ["LIVE-065#1", ["记录本场收礼值", "观众赠送 100 金币普通礼物", "查看本场收礼"]],
  ["LIVE-065#2", ["记录主播实时收益 500 金币", "观众赠送 100 金币普通礼物", "查看实时收益"]],
  ["LIVE-065#3", ["观众赠送 100 金币普通礼物", "分别查看消费流水和收益流水"]],
  ["LIVE-066#1", ["打开在线观众", "选择按贡献排序"]], ["LIVE-066#2", ["打开在线观众", "选择按停留时长排序"]],
  ["LIVE-074#1", ["将目标用户加入直播间黑名单", "尝试将其设置为房管"]],
  ["LIVE-074#2", ["将目标用户加入直播间黑名单", "尝试将其设置为房管", "查看直播间黑名单"]],
  ["LIVE-074#3", ["建立任一方向账号拉黑关系", "尝试将目标用户设置为房管"]],
  ["LIVE-074#4", ["建立任一方向账号拉黑关系", "尝试将目标用户设置为房管", "查看账号拉黑关系"]],
  ["LIVE-084#1", ["主播点击结束直播", "确认结束", "查询本场场次状态"]], ["LIVE-084#2", ["主播确认结束直播", "查看在线观众页面"]],
  ["LIVE-084#3", ["主播确认结束直播", "查看主播端页面"]], ["LIVE-084#4", ["主播确认结束直播", "查看本场直播记录和数据概览"]],
  ["LIVE-088#1", ["主播 A 搜索主播 B", "点击发起连麦", "查看发出请求"]], ["LIVE-088#2", ["主播 A 向主播 B 发起连麦", "切换到主播 B 查看收到邀请"]],
  ["LIVE-088#3", ["主播 A 向主播 B 发起连麦", "在主播 B 接受前查看主播 A 的直播画面"]],
  ["LIVE-089#2", ["主播 B 接受主播 A 的邀请", "查看主播 A 的直播画面"]],
  ["LIVE-089#3", ["主播 B 接受主播 A 的邀请", "查看主播 B 的直播画面"]],
  ["LIVE-090#1", ["连麦主播点击退出", "确认退出", "查询连麦关系"]],
  ["LIVE-090#2", ["连麦主播确认退出", "查看主播 A 的直播画面"]],
  ["LIVE-090#3", ["连麦主播确认退出", "查看主播 B 的直播画面"]],
  ["LIVE-090#4", ["连麦主播确认退出", "查看普通房连麦入口"]],
  ["LIVE-090#5", ["连麦主播确认退出", "查看主播 A 和主播 B 的直播场次状态"]],
  ["LIVE-091#1", ["进入门票房主播端", "查看并尝试连麦或 PK 入口"]], ["LIVE-091#2", ["进入密码房主播端", "查看并尝试连麦或 PK 入口"]],
  ["LIVE-093#1", ["向离线主播发起连麦邀请", "查询连麦邀请记录"]],
  ["LIVE-093#2", ["向离线主播发起连麦邀请", "查看发起方直播状态"]],
  ["LIVE-093#3", ["向无连麦权限的主播发起连麦邀请", "查询连麦邀请记录"]],
  ["LIVE-093#4", ["向无连麦权限的主播发起连麦邀请", "查看发起方直播状态"]],
]);

const semanticFlows = new Map([
  ["LIVE-060#1", ["FLOW-LIVE-001", "阶段 01：主播创建普通直播场次；共同业务对象：LIVE-SESSION-N01。"]],
  ["LIVE-061#1", ["FLOW-LIVE-001", "阶段 02：直播广场出现观看入口；共同业务对象：LIVE-SESSION-N01。"]],
  ["LIVE-007#1", ["FLOW-LIVE-001", "阶段 03：观众进入直播间；共同业务对象：LIVE-SESSION-N01。"]],
  ["LIVE-084#1", ["FLOW-LIVE-001", "阶段 04：主播关闭场次；共同业务对象：LIVE-SESSION-N01。"]],
  ["LIVE-094#1", ["FLOW-LIVE-001", "阶段 05：观众进入结束页；共同业务对象：LIVE-SESSION-N01。"]],
  ["LIVE-085#1", ["FLOW-LIVE-001", "阶段 06：主播核对结束页数据；共同业务对象：LIVE-SESSION-N01。"]],
  ["LIVE-096#1", ["FLOW-LIVE-002", "阶段 01：主播保存门票房设置；共同业务对象：LIVE-SESSION-T01。"]],
  ["LIVE-011#2", ["FLOW-LIVE-002", "阶段 02：观众购票进入；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-011#3", ["FLOW-LIVE-002", "阶段 03：核对购票后余额；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-011#4", ["FLOW-LIVE-002", "阶段 04：核对门票消费流水；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-013#1", ["FLOW-LIVE-002", "阶段 05：观众重复进入同一场次；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-015#1", ["FLOW-LIVE-002", "阶段 06：观众被踢后限制重进；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-015#2", ["FLOW-LIVE-002", "阶段 07：核对被踢后余额；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-015#3", ["FLOW-LIVE-002", "阶段 08：核对被踢后流水；共同业务对象：LIVE-SESSION-T01、USER-T01。"]],
  ["LIVE-097#1", ["FLOW-LIVE-003", "阶段 01：主播保存密码房设置；共同业务对象：LIVE-SESSION-P01。"]],
  ["LIVE-016#1", ["FLOW-LIVE-003", "阶段 02：观众使用当前密码进房；共同业务对象：LIVE-SESSION-P01、USER-P01。"]],
  ["LIVE-102#1", ["FLOW-LIVE-003", "阶段 03：主播直播中修改密码；共同业务对象：LIVE-SESSION-P01。"]],
  ["LIVE-019#1", ["FLOW-LIVE-003", "阶段 04：观众使用旧密码验证；共同业务对象：LIVE-SESSION-P01、USER-P01。"]],
  ["LIVE-019#2", ["FLOW-LIVE-003", "阶段 05：观众使用新密码验证；共同业务对象：LIVE-SESSION-P01、USER-P01。"]],
  ["LIVE-031#1", ["FLOW-LIVE-004", "阶段 01：观众送礼并核对余额；共同业务对象：GIFT-TXN-01。"]],
  ["LIVE-031#2", ["FLOW-LIVE-004", "阶段 02：主播核对实时收益；共同业务对象：GIFT-TXN-01。"]],
  ["LIVE-031#3", ["FLOW-LIVE-004", "阶段 03：直播间核对礼物播报；共同业务对象：GIFT-TXN-01。"]],
  ["LIVE-031#4", ["FLOW-LIVE-004", "阶段 04：用户核对消费流水；共同业务对象：GIFT-TXN-01。"]],
  ["LIVE-088#1", ["FLOW-LIVE-005", "阶段 01：主播 A 发起邀请；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-088#2", ["FLOW-LIVE-005", "阶段 02：主播 B 收到邀请；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-089#1", ["FLOW-LIVE-005", "阶段 03：双方建立连麦关系；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-089#2", ["FLOW-LIVE-005", "阶段 04：主播 A 进入分屏；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-089#3", ["FLOW-LIVE-005", "阶段 05：主播 B 进入分屏；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-090#1", ["FLOW-LIVE-005", "阶段 06：解除连麦关系；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-090#2", ["FLOW-LIVE-005", "阶段 07：主播 A 恢复单人画面；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-090#3", ["FLOW-LIVE-005", "阶段 08：主播 B 恢复单人画面；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-090#4", ["FLOW-LIVE-005", "阶段 09：恢复普通房连麦入口；共同业务对象：COHOST-SESSION-01。"]],
  ["LIVE-090#5", ["FLOW-LIVE-005", "阶段 10：双方直播场次继续；共同业务对象：COHOST-SESSION-01。"]],
]);

const semanticCases = [];
const usedCaseDefinitions = new Set();
for (const source of sourceCases) {
  const groups = semanticSplitGroups.get(source.用例编号) ?? [source.预期结果.map((_, index) => index)];
  groups.forEach((indexes, groupIndex) => {
    const part = groupIndex + 1;
    const traceKey = `${source.用例编号}#${part}`;
    const expected = semanticExpectedOverrides.get(traceKey) ?? indexes.map((index) => source.预期结果[index]).join("，");
    const flow = semanticFlows.get(traceKey);
    const split = groups.length > 1;
    const definition = semanticCaseDefinitions.get(traceKey);
    if (indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= source.预期结果.length)) {
      throw new Error(`${traceKey} 引用了不存在的预期结果索引`);
    }
    if (split && !definition) {
      throw new Error(`${traceKey} 缺少显式子用例定义；禁止根据预期结果生成标题`);
    }
    if (definition) usedCaseDefinitions.add(traceKey);
    semanticCases.push({
      序号: 0,
      用例编号: "",
      功能模块: source.功能模块,
      功能结构: source.功能结构,
      用例类型: source.用例类型,
      优先级: source.优先级 === "P0" && semanticP0Part.get(source.用例编号) !== part ? "P1" : source.优先级,
      用例描述: split ? definition.description : source.用例描述,
      验证用例子项: split ? definition.point : source.验证用例子项,
      前置条件: [...source.前置条件],
      操作步骤: semanticStepOverrides.get(traceKey) ?? [...source.操作步骤],
      预期结果: [expected],
      流程编号: flow?.[0] ?? "",
      测试结果: source.测试结果,
      测试人员: source.测试人员,
      备注: [...source.备注, `追溯：业务底稿 ${source.用例编号}。`, ...(flow ? [`流程：${flow[1]}`] : [])],
    });
  });
}
const unusedCaseDefinitions = [...semanticCaseDefinitions.keys()].filter((key) => !usedCaseDefinitions.has(key));
if (unusedCaseDefinitions.length > 0) {
  throw new Error(`存在未使用的显式子用例定义：${unusedCaseDefinitions.join(", ")}`);
}
cases.splice(0, cases.length, ...semanticCases);
cases.forEach((item, index) => {
  item.序号 = index + 1;
  item.用例编号 = `LIVE-${String(index + 1).padStart(3, "0")}`;
});

const questions = [];
function addQuestion(structure, item, basis, missing, impact) {
  questions.push({
    问题编号: `Q-${String(questions.length + 1).padStart(3, "0")}`,
    功能模块: MODULE,
    功能结构: structure,
    待确认事项: item,
    已知依据: basis,
    缺失信息: missing,
    影响用例: impact,
    确认状态: "待确认",
  });
}

addQuestion("直播广场", "确认“关注”是直播列表的第三个 Tab，还是顶部仅展示已关注且在播主播的独立区域。", "项目需求清单写明热门、新人、关注 3 个 Tab；静态原型仅有热门、新人 Tab，关注主播位于顶部独立区域。", "最终信息架构、关注列表排序与空态规则。", "关注直播入口、Tab 切换和空态");
addQuestion("直播间分享", "确认直播间外部分享平台的最终范围。", "项目需求清单写 WhatsApp、Facebook、Instagram；业务沟通记录提出 WhatsApp、Facebook、TikTok 且不要 Instagram。", "最终支持平台、各平台失败或未安装时的处理。", "分享渠道展示与外部跳转");
addQuestion("密码房设置", "确认房间密码长度和字符类型。", "开播设置原型提示 4–12 位密码；主播密码房批注写支持修改为 8 位数字；观众输入原型 maxlength=8。", "最终最小/最大长度、是否仅数字、修改时校验文案。", "密码创建、修改和输入边界");
addQuestion("门票房设置", "确认门票金币价格的有效范围和精度。", "需求和原型仅明确门票价格必填，未说明最小值、最大值、是否允许 0、负数、小数或前导零。", "价格上下限、整数/小数规则、错误提示。", "门票价格等价类与边界");
addQuestion("开播设置", "确认直播清晰度的具体档位、默认值和自动降级规则。", "项目需求清单要求开播前和观看中支持多档清晰度；当前开播设置原型未展示清晰度控件。", "档位名称、默认档、网络变化时是否自动切换及回显。", "开播清晰度设置与观看切换");
addQuestion("观众互动", "确认敏感词命中后的处理规则。", "项目需求清单要求公屏接入后台敏感词库，但未描述命中后是拦截、替换还是进入审核。", "匹配方式、替换/拦截结果、提示文案、组合或变形词规则。", "敏感词发送、提示和记录");
addQuestion("房管协助管理", "确认直播间禁言时长选项及解除方式。", "项目需求清单写禁言时长可选；互动权限规则写本场次到期或主播解除；当前原型仅有开关，没有时长选择。", "可选时长、默认时长、是否允许房管解除、到期状态。", "禁言时长边界、到期恢复和主动解除");
addQuestion("评论处置", "确认屏蔽指定评论的最终手势和确认流程。", "正式需求写长按消息后二次确认；原型批注写点击评论后出现按钮并直接移除，二者冲突。", "触发手势、确认层级、取消后的页面状态。", "主播/房管屏蔽评论及取消");
addQuestion("房管协助管理", "确认房管是否拥有“拉黑”操作以及该操作对应直播间黑名单还是账号拉黑。", "权限规则仅授权房管踢人、禁言、屏蔽评论；观众资料卡静态原型在房管操作区展示“拉黑”。", "房管权限边界、拉黑层级、存续范围和解除入口。", "房管拉黑权限与后果");
addQuestion("主播直播间", "确认主播资料卡中的“拉黑”按钮是加入直播间黑名单、账号拉黑，还是需要拆成两个独立操作。", "业务口径定义两层独立黑名单且后果不同；当前静态原型仅展示一个“拉黑”文案。", "按钮命名、二次确认文案、默认层级和两层独立解除入口。", "主播拉黑操作和解除");
addQuestion("账号拉黑", "确认观众拉黑主播后是否自动取消既有关注。", "互动权限规则写账号拉黑不解除既有关注；角色与用例业务口径 9 写用户拉黑主播会取消关注。", "最终关注关系变化及解除拉黑后是否恢复关注。", "观众拉黑主播的直播可见性与关注关系");
addQuestion("直播送礼", "确认礼物数量、连送上限、连击时间窗和余额不足时是否允许部分成功。", "项目需求清单明确支持选择数量和连击，但未给出边界及部分成功规则。", "最小/最大数量、连击窗口、重复点击去重、部分成功与流水规则。", "礼物数量边界、连击和重复提交");
addQuestion("直播间举报", "确认举报频控、重复举报合并、附件能力及后台处置结果是否回告举报人。", "原型只支持五类原因和 200 字补充说明；需求只说明联动后台审核处置。", "重复/频控规则、证据附件、工单状态和通知方式。", "重复举报、证据上传与处置通知");
addQuestion("开播控制", "确认开播创建超时、重复点击和直播 SDK 部分成功时的恢复规则。", "需求要求创建直播场次并发送开播提醒，未定义重复请求、推流失败或提醒失败的补偿。", "幂等键、超时时间、失败状态、重试入口、已创建场次和推送的回滚/补偿。", "重复开播、网络中断和部分成功恢复");
addQuestion("主播连麦", "确认主播连麦/PK 是否纳入当前一期验收范围，以及页面统一使用“连麦”还是“PK”。", "当前项目需求、角色用例和原型包含两人连麦；早期业务沟通记录提出 PK 和多人房放到二期。", "当前发布范围、入口命名、PK 是否仅为连麦入口文案。", "连麦全流程和特殊房型限制");
addQuestion("主播直播间", "确认删除好友后主播能否在后续直播场次再次向该用户发起直播间私信。", "角色与用例文档已将此项保留为待确认，建议需要完全阻断时使用账号拉黑。", "后续场次是否重置发起资格及历史删除关系的判断条件。", "删除好友后的后续场次私信");
addQuestion("开播设置", "确认直播封面的文件格式、大小、尺寸和违规内容处理。", "需求要求设置直播封面；静态原型仅限制选择 image/*，未给出业务校验。", "支持格式、文件大小、尺寸比例、压缩和审核失败结果。", "封面格式、大小、尺寸和审核异常");

const testHeaders = ["序号", "用例编号", "功能模块", "功能结构", "用例类型", "优先级", "用例描述", "验证用例子项", "前置条件", "操作步骤", "预期结果", "流程编号", "测试结果", "测试人员", "备注"];
const questionHeaders = [
  "问题编号", "需求组编号", "父问题编号", "追问触发条件", "阻塞等级", "功能模块", "具体场景", "问题分类",
  "待决策问题", "可选方案", "测试建议", "产品结论", "结论补充", "已知依据", "影响范围", "已有用例编号",
  "确认后待补用例", "负责人", "期望确认时间", "确认状态",
];
try {
  const existingPayload = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  if (Array.isArray(existingPayload.测试用例)
      && existingPayload.测试用例.length > 0
      && JSON.stringify(Object.keys(existingPayload.测试用例[0])) === JSON.stringify(testHeaders)) {
    cases.splice(0, cases.length, ...existingPayload.测试用例);
  }
  if (Array.isArray(existingPayload.需求待确认)
      && existingPayload.需求待确认.length > 0
      && JSON.stringify(Object.keys(existingPayload.需求待确认[0])) === JSON.stringify(questionHeaders)) {
    questions.splice(0, questions.length, ...existingPayload.需求待确认);
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const payload = { 测试用例: cases, 需求待确认: questions };

const validTypes = new Set(["功能需求", "业务流程", "逻辑校验", "异常用例"]);
const validPriorities = new Set(["P0", "P1", "P2", "P3"]);
const validResults = new Set(["未测", "通过", "不通过", "阻塞", "不适用"]);
const validQuestionStatus = new Set(["待前置结论", "待确认", "确认中", "已确认", "无需处理"]);
const validQuestionBlocks = new Set(["阻塞测试", "部分阻塞", "不阻塞"]);
const validQuestionCategories = new Set(["需求范围", "业务规则", "角色与权限", "流程与状态", "字段与数据校验", "计算与统计口径", "异常处理", "跨端与跨模块一致性", "配置和历史数据影响", "交互与文案规则"]);
const validQuestionOwners = new Set(["产品", "交互", "技术", "多方确认"]);
const validQuestionConclusions = new Set(["", "A", "B", "C", "D", "其他"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizedText(value) {
  return String(value)
    .replace(/^验证/, "")
    .replace(/[\s，。；：、“”‘’（）()\-_/]/g, "")
    .toLowerCase();
}

function copiesExpected(fieldValue, expectedValue) {
  const field = normalizedText(fieldValue);
  const expected = normalizedText(expectedValue);
  if (!field || !expected) return false;
  if (field === expected) return true;
  const shorter = field.length <= expected.length ? field : expected;
  const longer = field.length <= expected.length ? expected : field;
  return shorter.length >= 8 && longer.includes(shorter) && shorter.length / longer.length >= 0.65;
}

function validatePayload() {
  assert(payload && !Array.isArray(payload), "JSON root must be object");
  assert(Array.isArray(payload.测试用例) && Array.isArray(payload.需求待确认), "missing root arrays");
  const ids = new Set();
  const semanticKeys = new Set();
  cases.forEach((item, index) => {
    assert(JSON.stringify(Object.keys(item)) === JSON.stringify(testHeaders), `case fields invalid at ${index + 1}`);
    assert(item.序号 === index + 1, `sequence invalid at ${index + 1}`);
    assert(item.用例编号 === `LIVE-${String(index + 1).padStart(3, "0")}`, `id sequence invalid at ${index + 1}`);
    assert(!ids.has(item.用例编号), `duplicate id ${item.用例编号}`);
    ids.add(item.用例编号);
    assert(validTypes.has(item.用例类型), `invalid type ${item.用例编号}`);
    assert(validPriorities.has(item.优先级), `invalid priority ${item.用例编号}`);
    assert(item.用例描述.startsWith("验证"), `description invalid ${item.用例编号}`);
    assert(item.验证用例子项.trim(), `point empty ${item.用例编号}`);
    [item.前置条件, item.操作步骤, item.预期结果, item.备注].forEach((value) => assert(Array.isArray(value) && value.length > 0 && value.every((part) => String(part).trim()), `array field invalid ${item.用例编号}`));
    assert(item.预期结果.length === 1, `expected result count must be 1 at ${item.用例编号}`);
    assert(normalizedText(item.用例描述) !== normalizedText(item.验证用例子项), `description repeats point ${item.用例编号}`);
    assert(!copiesExpected(item.用例描述, item.预期结果[0]), `description copies expected result ${item.用例编号}`);
    assert(!copiesExpected(item.验证用例子项, item.预期结果[0]), `point copies expected result ${item.用例编号}`);
    assert(validResults.has(item.测试结果), `result invalid ${item.用例编号}`);
    assert(item.备注.some((note) => note.startsWith("来源：")), `source missing ${item.用例编号}`);
    const semanticKey = [item.功能模块, item.功能结构, item.验证用例子项, item.前置条件.join("|"), item.操作步骤.join("|")].join("||");
    assert(!semanticKeys.has(semanticKey), `semantic duplicate ${item.用例编号}`);
    semanticKeys.add(semanticKey);
  });
  const questionIds = new Set();
  const questionById = new Map();
  questions.forEach((item, index) => {
    assert(JSON.stringify(Object.keys(item)) === JSON.stringify(questionHeaders), `question fields invalid at ${index + 1}`);
    assert(/^Q-\d{3}(?:-\d{2}){0,2}$/.test(item.问题编号), `question id invalid at ${index + 1}`);
    assert(/^RQ-\d{3}$/.test(item.需求组编号), `question group invalid ${item.问题编号}`);
    assert(!questionIds.has(item.问题编号), `duplicate question ${item.问题编号}`);
    questionIds.add(item.问题编号);
    questionById.set(item.问题编号, item);
    assert(validQuestionBlocks.has(item.阻塞等级), `question block invalid ${item.问题编号}`);
    assert(validQuestionCategories.has(item.问题分类), `question category invalid ${item.问题编号}`);
    assert(validQuestionOwners.has(item.负责人), `question owner invalid ${item.问题编号}`);
    assert(validQuestionStatus.has(item.确认状态), `question status invalid ${item.问题编号}`);
    ["问题编号", "需求组编号", "阻塞等级", "功能模块", "具体场景", "问题分类", "待决策问题", "测试建议", "已知依据", "影响范围", "负责人", "期望确认时间", "确认状态"].forEach((field) => {
      const value = item[field];
      assert(Array.isArray(value) ? value.length > 0 && value.every((part) => String(part).trim()) : String(value ?? "").trim(), `question field empty ${item.问题编号}:${field}`);
    });
    assert(Array.isArray(item.可选方案) && item.可选方案.length >= 2 && item.可选方案.length <= 4, `question options invalid ${item.问题编号}`);
    item.可选方案.forEach((option, optionIndex) => assert(option.startsWith(`${String.fromCharCode(65 + optionIndex)}.`), `question option label invalid ${item.问题编号}`));
    assert(Array.isArray(item.已有用例编号) && Array.isArray(item.确认后待补用例), `question impact fields invalid ${item.问题编号}`);
    assert(item.已有用例编号.length + item.确认后待补用例.length > 0, `question impact empty ${item.问题编号}`);
    const productText = [item.具体场景, item.待决策问题, ...item.可选方案, item.测试建议].join(" | ");
    assert(!/(各功能单独定义|另行定义|视情况处理|固定时间后|统一大小上限|中间档|短暂时间窗|短暂撤销|设置上限|超过等待时限|长时间没有|操作令牌|跨端生效模型|关键写操作|所有写操作|终态|幂等)/.test(productText), `question contains abstract wording or placeholder ${item.问题编号}`);
    assert(item.影响范围.every((value) => !/^(相关功能|所有操作|关键操作|写操作|直播模块所有功能)$/.test(String(value).trim())), `question scope too broad ${item.问题编号}`);
    item.已有用例编号.forEach((reference) => {
      const match = reference.match(/^([A-Z][A-Z0-9]*-\d{3})(?:\s+至\s+([A-Z][A-Z0-9]*-\d{3}))?$/);
      assert(match && ids.has(match[1]) && (!match[2] || ids.has(match[2])), `question case reference invalid ${item.问题编号}:${reference}`);
    });
    assert(item.确认后待补用例.every((value) => !/^[A-Z][A-Z0-9]*-\d{3}/.test(value)), `question pending case contains existing id ${item.问题编号}`);
    assert(validQuestionConclusions.has(item.产品结论), `question conclusion invalid ${item.问题编号}`);
    assert(typeof item.结论补充 === "string", `question conclusion supplement invalid ${item.问题编号}`);
    assert(item.产品结论 !== "其他" || item.结论补充.trim(), `question conclusion supplement required ${item.问题编号}`);
  });
  const questionPosition = new Map(questions.map((item, index) => [item.问题编号, index]));
  const depthOf = (item, stack = new Set()) => {
    if (!item.父问题编号) return 0;
    assert(!stack.has(item.问题编号), `question cycle ${item.问题编号}`);
    const parent = questionById.get(item.父问题编号);
    assert(parent, `orphan parent ${item.问题编号}`);
    assert(parent.需求组编号 === item.需求组编号, `cross-group parent ${item.问题编号}`);
    assert(questionPosition.get(parent.问题编号) < questionPosition.get(item.问题编号), `child before parent ${item.问题编号}`);
    assert(String(item.追问触发条件).trim(), `trigger missing ${item.问题编号}`);
    assert(!/(确认后|范围明确后|规则明确后)$/.test(item.追问触发条件), `trigger is not tied to a parent option or business condition ${item.问题编号}`);
    assert(item.确认状态 === "待前置结论", `child status invalid ${item.问题编号}`);
    const next = new Set(stack);
    next.add(item.问题编号);
    return 1 + depthOf(parent, next);
  };
  questions.forEach((item) => {
    if (!item.父问题编号) {
      assert(item.追问触发条件 === "", `root has trigger ${item.问题编号}`);
      assert(item.确认状态 === "待确认", `root status invalid ${item.问题编号}`);
    }
    assert(depthOf(item) <= 2, `question depth invalid ${item.问题编号}`);
  });
  const blockOrder = new Map(["阻塞测试", "部分阻塞", "不阻塞"].map((value, index) => [value, index]));
  const grouped = new Map();
  questions.forEach((item) => {
    if (!grouped.has(item.需求组编号)) grouped.set(item.需求组编号, []);
    grouped.get(item.需求组编号).push(item);
  });
  const expectedGroups = [...grouped.entries()].map(([id, items]) => ({
    id,
    severity: Math.min(...items.map((item) => blockOrder.get(item.阻塞等级))),
    items,
  })).sort((left, right) => left.severity - right.severity || left.id.localeCompare(right.id));
  const seenGroups = [];
  questions.forEach((item) => {
    if (seenGroups.at(-1) !== item.需求组编号) seenGroups.push(item.需求组编号);
  });
  assert(new Set(seenGroups).size === seenGroups.length, "question group is not contiguous");
  assert(JSON.stringify(seenGroups) === JSON.stringify(expectedGroups.map((group) => group.id)), "question group order invalid");
  expectedGroups.forEach((group) => {
    const children = new Map();
    group.items.forEach((item) => {
      const parentId = item.父问题编号 || "";
      if (!children.has(parentId)) children.set(parentId, []);
      children.get(parentId).push(item);
    });
    children.forEach((items) => items.sort((left, right) => left.问题编号.localeCompare(right.问题编号)));
    const expectedIds = [];
    const visit = (item) => {
      expectedIds.push(item.问题编号);
      (children.get(item.问题编号) ?? []).forEach(visit);
    };
    (children.get("") ?? []).forEach(visit);
    assert(JSON.stringify(expectedIds) === JSON.stringify(group.items.map((item) => item.问题编号)), `question tree order invalid ${group.id}`);
  });
  const p0Count = cases.filter((item) => item.优先级 === "P0").length;
  assert(p0Count >= 5 && p0Count <= 10, `P0 is not a minimal smoke set: ${p0Count}`);
}

validatePayload();
if (process.argv.includes("--validate-only")) {
  console.log(JSON.stringify({ cases: cases.length, questions: questions.length, childQuestions: questions.filter((item) => item.父问题编号).length }, null, 2));
  process.exit(0);
}
await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
JSON.parse(await fs.readFile(jsonPath, "utf8"));

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
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  rowHeightPx: 52,
};
overview.mergeCells("A2:H2");
overview.getRange("A2").values = [["决策明细以“需求待确认”为准；产品选择 A/B/C/D/其他，选择“其他”时填写结论补充。"]];
overview.getRange("A2:H2").format = {
  fill: "#EAF2F8",
  font: { name: "Microsoft YaHei", size: 10, color: "#334155" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  rowHeightPx: 34,
};

overview.getRange("A4:H4").values = [["问题总数", "", "当前可回答", "", "待前置结论", "", "已确认", ""]];
overview.getRange("A5:H5").values = [["", "", "", "", "", "", "", ""]];
for (const range of ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]) {
  overview.getRange(range).format = {
    fill: "#DDEBF7",
    font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F3A52" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "all", style: "thin", color: "#B8C7D5" },
    rowHeightPx: 30,
  };
}
for (const range of ["A5:B5", "C5:D5", "E5:F5", "G5:H5"]) {
  overview.getRange(range).format = {
    fill: "#FFFFFF",
    font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#1F4E78" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "all", style: "thin", color: "#B8C7D5" },
    rowHeightPx: 42,
  };
}
for (const range of ["A4:B4", "A5:B5", "C4:D4", "C5:D5", "E4:F4", "E5:F5", "G4:H4", "G5:H5"]) overview.mergeCells(range);
overview.getRange("A5").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})`]];
overview.getRange("C5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]];
overview.getRange("E5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"待前置结论")`]];
overview.getRange("G5").formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"已确认")`]];

overview.getRange("A7:H7").values = [["按状态", "数量", "按阻塞等级", "待确认", "按负责人", "待确认", "结构检查", "数量"]];
overview.getRange("A7:H7").format = {
  fill: "#1F4E78",
  font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#163A5A" },
  rowHeightPx: 32,
};
const statusValues = ["待前置结论", "待确认", "确认中", "已确认", "无需处理"];
const blockValues = ["阻塞测试", "部分阻塞", "不阻塞"];
const ownerValues = ["产品", "交互", "技术", "多方确认"];
overview.getRange("A8:A12").values = statusValues.map((value) => [value]);
overview.getRange("C8:C10").values = blockValues.map((value) => [value]);
overview.getRange("E8:E11").values = ownerValues.map((value) => [value]);
overview.getRange("G8:G11").values = [["需求组"], ["追问子问题"], ["未填写产品结论"], ["选其他但未补充"]];
statusValues.forEach((status, index) => { overview.getRange(`B${index + 8}`).formulas = [[`=COUNTIF('需求待确认'!$T$2:$T$${pending.lastRow},"${status}")`]]; });
blockValues.forEach((level, index) => { overview.getRange(`D${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$E$2:$E$${pending.lastRow},"${level}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
ownerValues.forEach((owner, index) => { overview.getRange(`F${index + 8}`).formulas = [[`=COUNTIFS('需求待确认'!$R$2:$R$${pending.lastRow},"${owner}",'需求待确认'!$T$2:$T$${pending.lastRow},"待确认")`]]; });
overview.getRange("H8").values = [[new Set(questions.map((item) => item.需求组编号)).size]];
overview.getRange("H9").formulas = [[`=COUNTA('需求待确认'!$A$2:$A$${pending.lastRow})-COUNTBLANK('需求待确认'!$C$2:$C$${pending.lastRow})`]];
overview.getRange("H10").formulas = [[`=COUNTBLANK('需求待确认'!$L$2:$L$${pending.lastRow})`]];
overview.getRange("H11").formulas = [[`=COUNTIFS('需求待确认'!$L$2:$L$${pending.lastRow},"其他",'需求待确认'!$M$2:$M$${pending.lastRow},"")`]];
overview.getRange("A8:H12").format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
  rowHeightPx: 31,
};
for (const range of ["A8:A12", "C8:C10", "E8:E11", "G8:G11"]) overview.getRange(range).format.horizontalAlignment = "left";
for (const range of ["B8:B12", "D8:D10", "F8:F11", "H8:H11"]) overview.getRange(range).format.font = { name: "Microsoft YaHei", size: 11, bold: true, color: "#1F4E78" };
overview.mergeCells("A14:H14");
overview.getRange("A14").values = [["处理顺序：先回答当前可回答的问题；展开父问题左侧分级按钮后，再处理由该结论触发的追问。"]];
overview.getRange("A14:H14").format = {
  fill: "#F8FAFC",
  font: { name: "Microsoft YaHei", size: 10, color: "#475569" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  rowHeightPx: 34,
  borders: { preset: "all", style: "thin", color: "#D6DEE8" },
};
[22, 11, 22, 11, 22, 11, 24, 11].forEach((width, index) => { overview.getRange(`${columnName(index)}1`).format.columnWidth = width; });
overview.freezePanes.freezeRows(2);

const inspection = {
  summary: (await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 8000, tableMaxRows: 4, tableMaxCols: 20, tableMaxCellChars: 120 })).ndjson,
  mainHead: (await workbook.inspect({ kind: "region", sheetId: "功能测试用例", range: "A1:O6", maxChars: 12000 })).ndjson,
  mainTail: (await workbook.inspect({ kind: "region", sheetId: "功能测试用例", range: `A${Math.max(2, main.lastRow - 3)}:O${main.lastRow}`, maxChars: 10000 })).ndjson,
  pendingHead: (await workbook.inspect({ kind: "region", sheetId: "需求待确认", range: `A1:T${Math.min(6, pending.lastRow)}`, maxChars: 12000 })).ndjson,
  overview: (await workbook.inspect({ kind: "region", sheetId: "产品决策概览", range: "A1:H14", maxChars: 12000 })).ndjson,
  formulaErrors: (await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" })).ndjson,
};
await fs.writeFile(path.join(workDir, "inspection.json"), `${JSON.stringify(inspection, null, 2)}\n`, "utf8");

for (const [sheetName, range, fileName] of [
  ["功能测试用例", "A1:O9", "preview-main.png"],
  ["需求待确认", `A1:I${Math.min(9, pending.lastRow)}`, "preview-pending.png"],
  ["产品决策概览", "A1:H14", "preview-product-overview.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(workDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

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
  return xml.replace(pattern, (tag) => Object.entries(attributes).reduce(
    (updated, [name, value]) => setOrReplaceXmlAttribute(updated, name, value),
    tag,
  ));
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
      const pattern = new RegExp(`<x:col\\s+[^>]*\\bmin="${column}"[^>]*\\bmax="${column}"[^>]*/>`);
      xml = xml.replace(pattern, (tag) => setOrReplaceXmlAttribute(tag, "hidden", "1"));
    });
    const questionById = new Map(questions.map((item) => [item.问题编号, item]));
    const questionDepth = (item, stack = new Set()) => {
      if (!item.父问题编号) return 0;
      assert(!stack.has(item.问题编号), `question cycle ${item.问题编号}`);
      const next = new Set(stack);
      next.add(item.问题编号);
      return 1 + questionDepth(questionById.get(item.父问题编号), next);
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

const finalZip = await JSZip.loadAsync(await fs.readFile(outputPath));
const pendingTableXml = await finalZip.file("xl/tables/table2.xml").async("string");
const pendingSheetXml = await finalZip.file("xl/worksheets/sheet2.xml").async("string");
const finalWorkbookXml = await finalZip.file("xl/workbook.xml").async("string");
assert(pendingTableXml.includes(`ref="A1:T${pending.lastRow}"`), "pending table range invalid");
assert((pendingTableXml.match(/<x:tableColumn /g) ?? []).length === 20, "pending table column count invalid");
assert((pendingSheetXml.match(/hidden="1" outlineLevel="[12]"/g) ?? []).length === questions.filter((item) => item.父问题编号).length, "collapsed child count invalid");
assert(finalWorkbookXml.includes('activeTab="2"'), "overview is not active by default");
const stat = await fs.stat(outputPath);
assert(stat.size > 0, "exported workbook is empty");

console.log(JSON.stringify({ outputPath, jsonPath, sheets: ["功能测试用例", "需求待确认", "产品决策概览"], cases: cases.length, questions: questions.length, childQuestions: questions.filter((item) => item.父问题编号).length, p0: cases.filter((item) => item.优先级 === "P0").length, bytes: stat.size }, null, 2));
