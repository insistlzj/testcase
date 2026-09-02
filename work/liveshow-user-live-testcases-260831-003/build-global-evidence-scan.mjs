import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = "/Users/geekonup/testcase";
const projectDir = path.join(rootDir, "liveshow-proto");
const workDir = path.join(rootDir, "work/liveshow-user-live-testcases-260831-003");
const cachePath = path.join(rootDir, "work/liveshow-proto-global-evidence-cache/latest.json");
const resultPath = path.join(workDir, "global-evidence-scan-result.json");
const schemaVersion = "1.0";

const readFiles = new Set([
  "AGENTS.md",
  "需求来源策略.json",
  "项目说明.md",
  "prototype/index.html",
  "prototype/Luma Live-原型说明.md",
  "prototype/批注核对清单.md",
  "prototype/assets/annotations.js",
  "prototype/assets/common.js",
  "prototype/assets/mock.js",
  "prototype/assets/admin-mock.js",
  "prototype/assets/operation-accounts.js",
  "prototype/assets/guild-data-model.js",
  "prototype/assets/guild-record-overviews.js",
  "prototype/assets/live-muted-users.js",
  "prototype/assets/start-live-config.js",
  "prototype/pages/user/home/live-plaza.html",
  "prototype/pages/user/home/contribution-ranking.html",
  "prototype/pages/user/host/host-center.html",
  "prototype/pages/user/host/host-center-pending.html",
  "prototype/pages/user/host/live-data.html",
  "prototype/pages/user/host/live-records.html",
  "prototype/pages/user/host/start-live-settings.html",
  "prototype/pages/user/live/live-end-host.html",
  "prototype/pages/user/live/live-end-viewer.html",
  "prototype/pages/user/live/live-room-cohost-active.html",
  "prototype/pages/user/live/live-room-host-password.html",
  "prototype/pages/user/live/live-room-host.html",
  "prototype/pages/user/live/live-room-report.html",
  "prototype/pages/user/live/live-room-user-report.html",
  "prototype/pages/user/live/live-room.html",
  "prototype/pages/user/wallet/balance-detail.html",
  "prototype/pages/admin/host/admin-live-management.html",
  "prototype/pages/admin/host/admin-live-detail.html",
  "prototype/pages/admin/content/admin-report-handling.html",
  "prototype/pages/admin/content/admin-report-detail.html",
  "prototype/pages/admin/operations/admin-live-type.html",
  "prototype/pages/admin/operations/admin-feature-switch.html",
  "prototype/pages/admin/operations/admin-feature-switch-detail.html",
  "prototype/pages/admin/operations/admin-ticket-price-level.html",
  "prototype/pages/admin/operations/admin-ticket-price-level-detail.html",
  "prototype/pages/admin/operations/admin-sensitive-words.html",
  "prototype/pages/admin/operations/admin-sensitive-words-detail.html",
  "prototype/pages/admin/gifts/admin-gift-list.html",
  "prototype/pages/admin/gifts/admin-gift-detail.html",
  "prototype/pages/admin/gifts/admin-custom-gift.html",
  "prototype/pages/admin/gifts/admin-lucky-gift-config.html",
  "prototype/pages/admin/gifts/admin-gift-send-count-rules.html",
  "prototype/pages/admin/gifts/admin-gift-send-count-rule-detail.html",
  "prototype/pages/admin/accounts/admin-operation-accounts.html",
  "prototype/pages/admin/accounts/admin-operation-gift-records.html",
  "prototype/pages/guild/people/guild-host-detail.html",
  "prototype/pages/guild/data/guild-all-live.html",
  "prototype/pages/guild/data/guild-host-data.html",
  "prototype/pages/guild/data/guild-live-gift-detail.html",
  "prototype/pages/guild/operations/guild-operation-accounts.html",
  "prototype/pages/guild/operations/guild-operation-gift-records.html",
]);

async function walk(directory, base = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath, base));
    else if (entry.isFile()) files.push(path.relative(base, absolutePath).split(path.sep).join("/"));
  }
  return files;
}

function category(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  if (relativePath.startsWith("context/")) return "需求与业务上下文";
  if (relativePath.startsWith("prototype/pages/user/")) return "用户App原型页面";
  if (relativePath.startsWith("prototype/pages/admin/")) return "管理后台原型页面";
  if (relativePath.startsWith("prototype/pages/guild/")) return "公会App原型页面";
  if (relativePath.startsWith("prototype/assets/") && [".js", ".json"].includes(extension)) return "公共脚本与Mock";
  if (relativePath.startsWith("prototype/assets/") && [".css", ".svg"].includes(extension)) return "样式与视觉资源";
  if (relativePath.startsWith("app-store-screenshots/")) return "竞品截图";
  if (relativePath.startsWith("workspace/")) return "其他需求工作区";
  if (relativePath.startsWith("prototype/")) return "原型说明与入口";
  return "项目规则与说明";
}

function excludedReason(relativePath, fileCategory) {
  if (fileCategory === "竞品截图") return "仅作为竞品视觉参考；本次默认不生成UI视觉用例，未用于业务预期。";
  if (fileCategory === "样式与视觉资源") return "仅承载样式或装饰素材；引用关系已由页面建档，本次不以视觉资源建立业务规则。";
  if (fileCategory === "其他需求工作区") return "属于资料修改风控或商品SKU等其他需求，不涉及用户App直播模块及已发现依赖。";
  if (relativePath.endsWith(".css")) return "纯样式文件；本次不生成颜色、字体、间距和排版用例。";
  if (relativePath.endsWith(".html")) return "页面已建档，但不属于用户App直播范围、公共规则或已发现的管理后台/公会端依赖。";
  if (relativePath.endsWith(".js")) return "脚本已建档，但未被目标直播页面或已发现跨端依赖引用。";
  return "文件已建档；内容与本次用户App直播模块及其跨端关联无直接关系。";
}

async function fileRecord(relativePath) {
  const absolutePath = path.join(projectDir, relativePath);
  const [bytes, stat] = await Promise.all([fs.readFile(absolutePath), fs.stat(absolutePath)]);
  return {
    相对路径: relativePath,
    文件大小: stat.size,
    修改时间: stat.mtime.toISOString(),
    "SHA-256": crypto.createHash("sha256").update(bytes).digest("hex"),
    文件类别: category(relativePath),
  };
}

async function ruleRecord(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const bytes = await fs.readFile(absolutePath);
  return { 相对路径: relativePath, "SHA-256": crypto.createHash("sha256").update(bytes).digest("hex") };
}

const paths = (await walk(projectDir)).sort((a, b) => a.localeCompare(b, "zh-CN"));
for (const relativePath of paths) {
  if (relativePath.startsWith("context/")) readFiles.add(relativePath);
}
const manifest = await Promise.all(paths.map(fileRecord));
const manifestByPath = new Map(manifest.map((item) => [item.相对路径, item]));
const actualReadFiles = [...readFiles].filter((item) => manifestByPath.has(item)).sort((a, b) => a.localeCompare(b, "zh-CN"));
const startBaseline = actualReadFiles.map((item) => ({ 相对路径: item, "SHA-256": manifestByPath.get(item)["SHA-256"] }));
const ruleBaseline = await Promise.all([
  "AGENTS.md",
  "Cem Kaner.txt",
  "全局证据扫描指令.md",
  "原型与需求清单同步指令.md",
].map(ruleRecord));
const fingerprintSource = JSON.stringify({ schemaVersion, project: path.basename(projectDir), manifest });
const projectFingerprint = crypto.createHash("sha256").update(fingerprintSource).digest("hex");
let previousCache = null;
try {
  previousCache = JSON.parse(await fs.readFile(cachePath, "utf8"));
} catch {}

const previousManifest = new Map((previousCache?.文件清单 ?? []).map((item) => [item.相对路径, item]));
const currentManifest = new Map(manifest.map((item) => [item.相对路径, item]));
const addedFiles = manifest.filter((item) => !previousManifest.has(item.相对路径)).map((item) => item.相对路径);
const modifiedFiles = manifest
  .filter((item) => previousManifest.has(item.相对路径) && previousManifest.get(item.相对路径)["SHA-256"] !== item["SHA-256"])
  .map((item) => item.相对路径);
const deletedFiles = [...previousManifest.keys()].filter((relativePath) => !currentManifest.has(relativePath));

const dependencies = [
  { 上游: "管理后台/直播房型", 共同业务对象: "房型配置", 当前模块: "开播设置", 规则: "启用状态和开放用户范围决定主播可选择的房型", 证据: ["context/01-用户主播App-项目需求清单.md", "context/03-管理后台-项目需求清单.md", "prototype/pages/admin/operations/admin-feature-switch-detail.html"] },
  { 上游: "管理后台/直播类型", 共同业务对象: "直播分类", 当前模块: "直播广场、开播设置", 规则: "启用分类决定用户端筛选和主播开播分类", 证据: ["context/01-用户主播App-项目需求清单.md", "prototype/pages/admin/operations/admin-live-type.html", "prototype/assets/start-live-config.js"] },
  { 上游: "管理后台/礼物道具", 共同业务对象: "礼物配置", 当前模块: "直播送礼", 规则: "上架状态、名称、图标、金币价格和分类影响用户端礼物面板", 证据: ["context/01-用户主播App-项目需求清单.md", "context/03-管理后台-项目需求清单.md", "prototype/pages/admin/gifts/admin-gift-list.html"] },
  { 上游: "管理后台/购买份数配置", 共同业务对象: "礼物赠送数量", 当前模块: "直播送礼", 规则: "后台可配置购买份数，但用户端原型固定五个数量，最终来源关系待确认", 证据: ["prototype/pages/admin/gifts/admin-gift-send-count-rules.html", "prototype/assets/admin-mock.js", "prototype/assets/common.js"] },
  { 上游: "管理后台/敏感词库", 共同业务对象: "公屏消息", 当前模块: "观众互动", 规则: "词库适用于公屏，命中后的用户端处理方式待确认", 证据: ["context/01-用户主播App-项目需求清单.md", "context/03-管理后台-项目需求清单.md", "prototype/pages/admin/operations/admin-sensitive-words-detail.html"] },
  { 上游: "用户App/举报提交", 共同业务对象: "举报工单", 当前模块: "直播间举报", 下游: "管理后台/举报处理", 规则: "提交生成工单，后台处置后按处置类型通知举报人和主播", 证据: ["context/系统概要 .md", "prototype/assets/annotations.js", "prototype/pages/admin/content/admin-report-detail.html"] },
  { 上游: "管理后台/强制关播", 共同业务对象: "直播场次", 当前模块: "观众直播间、门票资格", 规则: "立即结束场次，观众收到结束提示并返回广场，门票不退款", 证据: ["context/03-管理后台-项目需求清单.md", "prototype/pages/admin/host/admin-live-detail.html", "prototype/pages/user/live/live-end-viewer.html"] },
  { 上游: "公会App/关闭直播权限", 共同业务对象: "主播直播权限和进行中场次", 当前模块: "主播直播间、主播权限状态", 规则: "关闭权限时当前直播结束，后续不能创建场次", 证据: ["context/02-公会App-项目需求清单.md", "prototype/pages/guild/people/guild-host-detail.html", "context/01-用户主播App-项目需求清单.md"] },
  { 上游: "管理后台、公会App/运营账号", 共同业务对象: "虚拟金币送礼", 当前模块: "进房、送礼、贡献榜、主播实时收益", 规则: "运营账号免门票和密码校验、不能赠送幸运礼物；虚拟送礼计入氛围和榜单但不计主播真实收益", 证据: ["context/系统概要 .md", "context/02-公会App-项目需求清单.md", "context/03-管理后台-项目需求清单.md", "prototype/assets/annotations.js"] },
  { 上游: "用户App/主播结束直播", 共同业务对象: "直播场次", 当前模块: "直播记录", 下游: "公会App、管理后台直播记录", 规则: "同一场次形成用户端历史记录及其他端统计来源", 证据: ["context/系统概要 .md", "context/01-用户主播App-项目需求清单.md", "context/02-公会App-项目需求清单.md", "context/03-管理后台-项目需求清单.md"] },
];

const result = {
  schemaVersion,
  项目名称: "Luma Live",
  项目目录: "liveshow-proto",
  测试范围: { 目标端: "用户App", 功能模块: "直播模块", UI视觉测试: false, 其他端用途: "仅作为配置来源、状态影响和下游结果证据" },
  扫描模式: "fallback-full",
  模式依据: [
    "用户要求重新生成，并明确采用全局证据与缓存组合方案。",
    "与上次缓存相比只有 7 个文件变化，未达到数量阈值，但 6 个被删除文件包含旧用例依赖的业务对象、角色和互动权限规则。",
    "新增《系统概要》与被删除文件之间没有可核对的显式替代声明，旧依赖映射失效，因此执行 fallback-full 全量重建。",
  ],
  上次缓存: previousCache ? { 存在: true, 状态: previousCache.扫描状态 ?? "未知", 项目指纹: previousCache.项目指纹 ?? "" } : { 存在: false },
  规则基线: ruleBaseline,
  项目指纹: projectFingerprint,
  文件清单: manifest,
  文件变化: { 新增: addedFiles, 修改: modifiedFiles, 删除: deletedFiles, 重命名候选: [] },
  已读取文件: actualReadFiles.map((relativePath) => ({ 相对路径: relativePath, 用途: manifestByPath.get(relativePath).文件类别 })),
  复用证据: [],
  未纳入文件: manifest.filter((item) => !readFiles.has(item.相对路径)).map((item) => ({ 相对路径: item.相对路径, 原因: excludedReason(item.相对路径, item.文件类别) })),
  依赖关系: dependencies,
  关联映射: dependencies.map((item, index) => ({ 映射编号: `MAP-LIVE-${String(index + 1).padStart(3, "0")}`, ...item, 处理结果: index === 3 || index === 4 ? "需求待确认" : "正式用例或已有覆盖" })),
  证据缺口: [
    "礼物购买份数后台配置与用户App固定数量菜单的最终来源关系未明确，新增Q-037。",
    "敏感词命中后的拦截、替换、反馈和匹配规则仍由Q-006组确认。",
    "平台强制关闭等非手动结束场次是否生成用户App直播记录仍由Q-036确认。",
    "《系统概要》写直播结束后举报工单自动作废，原型批注写已提交工单继续审核；按 prototype-primary 采用原型批注并保留冲突追溯。",
  ],
  阻塞项: [],
  开始基线: startBaseline,
  输出前复核: { 状态: "待执行", 变化文件: [] },
  扫描状态: "有非阻塞待确认",
};

await fs.mkdir(workDir, { recursive: true });
await fs.writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ resultPath, mode: result.扫描模式, files: manifest.length, read: actualReadFiles.length, excluded: result.未纳入文件.length, dependencies: dependencies.length, fingerprint: projectFingerprint }, null, 2));
