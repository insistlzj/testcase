#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      args[argv[i].slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function decodeEntities(value) {
  return String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function stripHtml(value) {
  return decodeEntities(
    String(value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function unique(values) {
  return [...new Set(values.map((v) => String(v).trim()).filter(Boolean))];
}

function regexTexts(html, pattern) {
  const values = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const text = stripHtml(match[1]);
    if (text) values.push(text);
  }
  return unique(values);
}

function visibleSegments(html) {
  return unique(
    stripHtml(html)
      .split(/\n|(?<=[。！？；])/)
      .map((part) => part.trim())
      .filter((part) => part && part.length <= 120)
  ).slice(0, 60);
}

function loadPrototype(prototypeDir) {
  const context = vm.createContext({
    window: {},
    console,
    URLSearchParams,
    setTimeout,
    clearTimeout,
  });

  const load = (relativePath) => {
    const fullPath = path.join(prototypeDir, relativePath);
    vm.runInContext(fs.readFileSync(fullPath, "utf8"), context, {
      filename: fullPath,
    });
  };

  load(path.join("assets", "page-data.js"));
  load(path.join("assets", "annotations.js"));
  load(path.join("assets", "common.js"));
  vm.runInContext("window.__EVIDENCE_RENDERERS = RENDERERS;", context);
  return context.window;
}

function buildEvidence(prototypeDir) {
  const runtime = loadPrototype(prototypeDir);
  const routes = runtime.PROTOTYPE_ROUTES || {};
  const routeMap = Object.fromEntries(
    Object.entries(routes).map(([id, route]) => [
      id,
      { page_key: route[0], state: route[1] },
    ])
  );

  const pages = (runtime.PROTOTYPE_PAGES || []).map((page, pageIndex) => {
    const stateEntries = Object.entries(page.states || {}).flatMap(
      ([dimension, options]) =>
        Object.entries(options).map(([state, label]) => ({
          dimension,
          state,
          label,
        }))
    );

    const renderer = runtime.__EVIDENCE_RENDERERS[page.key];
    const stateEvidence = stateEntries.map((stateInfo) => {
      const html = renderer(stateInfo.state);
      const routeIds = unique(
        [...html.matchAll(/go\('([^']+)'\)/g)].map((match) => match[1])
      );

      return {
        ...stateInfo,
        fields: regexTexts(
          html,
          /<div class="fl">([\s\S]*?)<\/div>/g
        ),
        placeholders: regexTexts(
          html,
          /<span class="ph[^"]*">([\s\S]*?)<\/span>/g
        ),
        action_texts: unique([
          ...regexTexts(
            html,
            /class="(?:btn|txtbtn|ct|pill|cb)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|span)>/g
          ),
          ...regexTexts(
            html,
            /onclick="[^"]*"[^>]*>([^<]{1,50})</g
          ),
        ]).slice(0, 30),
        route_ids: routeIds,
        routes: routeIds.map((routeId) => ({
          route_id: routeId,
          ...(routeMap[routeId] || { page_key: null, state: null }),
        })),
        visible_text: visibleSegments(html),
      };
    });

    const annotations = (
      runtime.getPrototypeAnnotations
        ? runtime.getPrototypeAnnotations(page.key)
        : []
    ).map(([topic, content]) => ({
      topic: stripHtml(topic),
      content: stripHtml(content),
    }));

    return {
      order: pageIndex + 1,
      group: page.group,
      page_key: page.key,
      page_id: page.fam,
      title: page.title,
      file: path.join("pages", page.file).replace(/\\/g, "/"),
      source_path: path.join(prototypeDir, "pages", page.file),
      default_state: page.defaultState,
      states: stateEntries,
      annotations,
      state_evidence: stateEvidence,
      source_quality: "high",
    };
  });

  return {
    generated_at: new Date().toISOString(),
    source_type: "local-static-html-prototype",
    prototype_root: prototypeDir,
    entry: path.join(prototypeDir, "index.html"),
    page_count: pages.length,
    evidence_sources: [
      path.join(prototypeDir, "UG代理App-原型说明.md"),
      path.join(prototypeDir, "assets", "page-data.js"),
      path.join(prototypeDir, "assets", "common.js"),
      path.join(prototypeDir, "assets", "annotations.js"),
      path.join(prototypeDir, "pages"),
    ],
    limitations: [
      "本证据包来自静态原型、页面状态与原型批注，不证明后端接口、数据库、真实权限、并发或资金处理已经实现。",
      "默认只提取功能与业务线索，不将颜色、字体、间距和像素布局作为测试范围。",
    ],
    pages,
  };
}

function summarizePage(page, pageTitleByKey) {
  const fields = unique(
    page.state_evidence.flatMap((state) => state.fields)
  );
  const actions = unique(
    page.state_evidence.flatMap((state) => state.action_texts)
  );
  const routes = unique(
    page.state_evidence.flatMap((state) =>
      state.routes.map((route) => {
        const targetTitle = pageTitleByKey[route.page_key] || route.page_key;
        return `${route.route_id} → ${targetTitle}（${route.state}）`;
      })
    )
  );
  const keyTexts = unique(
    page.state_evidence.flatMap((state) => state.visible_text)
  )
    .filter((text) => text.length <= 50)
    .slice(0, 24);
  const annotations = page.annotations.map(
    (item) => `${item.topic}：${item.content}`
  );
  return {
    order: page.order,
    group: page.group,
    page_key: page.page_key,
    page_id: page.page_id,
    title: page.title,
    file: page.file,
    source_path: page.source_path,
    default_state: page.default_state,
    states: page.states,
    fields,
    actions,
    routes,
    key_texts: keyTexts,
    annotations,
    source_quality: page.source_quality,
  };
}

function renderMarkdown(index) {
  const groups = {};
  for (const page of index.pages) {
    if (!groups[page.group]) groups[page.group] = [];
    groups[page.group].push(page);
  }

  const lines = [
    "# UG 代理 App 原型页面功能索引",
    "",
    `- 原型目录：\`${index.prototype_root}\``,
    `- 页面数量：${index.page_count}`,
    "- 证据范围：页面树、页面状态、可见字段与操作、路由、原型批注",
    "- 默认排除：颜色、字体、间距、像素和布局等视觉测试",
    "",
    "## 页面索引",
    "",
  ];

  for (const [group, pages] of Object.entries(groups)) {
    lines.push(`### ${group}`, "");
    for (const page of pages) {
      const states = page.states
        .map((state) => `${state.label}（${state.state}）`)
        .join("、");
      lines.push(
        `- [ ] **${page.title}**  \`${page.page_key}\``,
        `  - 文件：\`${page.file}\``,
        `  - 状态：${states || "默认"}`,
        `  - 字段：${page.fields.join("、") || "未提取到独立表单字段"}`,
        `  - 操作：${page.actions.join("、") || "以内容展示或列表跳转为主"}`,
        `  - 跳转：${page.routes.join("；") || "无跨页跳转"}`,
        `  - 关键文本：${page.key_texts.join("、") || "未提取到"}`,
        `  - 规则摘要：${page.annotations.join("；") || "当前页面无额外批注"}`,
        ""
      );
    }
  }

  lines.push(
    "## 选择方式",
    "",
    "回复模块名、页面编号或页面 key 均可，例如：",
    "",
    "- `全部页面`",
    "- `E 客户 + F 成长`",
    "- `login, bind-customer, withdraw-apply`",
    "",
    "若未补充业务规则，将依据原型和批注生成，并把后端限制、权限和异常行为标记为“待确认”。",
    ""
  );
  return lines.join("\n");
}

function createRulesTemplate(outputDir) {
  const supplementsDir = path.join(outputDir, "supplements");
  const rulesPath = path.join(supplementsDir, "rules.md");
  fs.mkdirSync(supplementsDir, { recursive: true });
  if (fs.existsSync(rulesPath)) return;

  fs.writeFileSync(
    rulesPath,
    `# UG 代理 App 测试规则补充

> 可选填写。原型中没有体现、但测试必须覆盖的后端规则、权限、状态和异常流程写在这里。
> 如果暂时不填写，生成器不会编造，会在测试用例备注中标记“待确认”。

## 示例：验证码发送限制
补充类型：字段校验
当前页面：E5 新增客户·验证码绑定
确认状态：待确认

补充内容：
- 验证码有效期：
- 同一手机号发送频率：
- 当日发送次数上限：
- 验证码错误次数限制：

## 示例：提现限制
补充类型：完整流程
当前页面：F4 成长值提现
关联页面：F1 成长概览页、F5 提现详情页、H1 消息中心
确认状态：待确认

补充内容：
- 最小提现金额：
- 最大提现金额：
- 金额精度：
- 手续费：
- 重复提交处理：
- 审核拒绝后的余额恢复时机：
`,
    "utf8"
  );
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.prototype || !args.output) {
    console.error(
      "Usage: node extract-prototype-evidence.cjs --prototype <dir> --output <dir>"
    );
    process.exit(2);
  }

  const prototypeDir = path.resolve(args.prototype);
  const outputDir = path.resolve(args.output);
  fs.mkdirSync(outputDir, { recursive: true });

  const evidence = buildEvidence(prototypeDir);
  const pageTitleByKey = Object.fromEntries(
    evidence.pages.map((page) => [page.page_key, page.title])
  );
  const index = {
    generated_at: evidence.generated_at,
    prototype_root: evidence.prototype_root,
    entry: evidence.entry,
    page_count: evidence.page_count,
    pages: evidence.pages.map((page) => summarizePage(page, pageTitleByKey)),
    limitations: evidence.limitations,
  };

  fs.writeFileSync(
    path.join(outputDir, "testcase-source.json"),
    `${JSON.stringify(evidence, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(outputDir, "page-info-index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(outputDir, "page-info-index.md"),
    renderMarkdown(index),
    "utf8"
  );
  createRulesTemplate(outputDir);

  console.log(
    JSON.stringify(
      {
        page_count: evidence.page_count,
        testcase_source: path.join(outputDir, "testcase-source.json"),
        page_info_index: path.join(outputDir, "page-info-index.json"),
        page_info_markdown: path.join(outputDir, "page-info-index.md"),
        rules: path.join(outputDir, "supplements", "rules.md"),
      },
      null,
      2
    )
  );
}

main();
