# 260914-002 三端用例进度

## 最新状态（以下旧记录仅作过程留档）

- 本次已导出三份 Excel 到 `outputs/liveshow-full-260914-002/`：用户1062、公会361、后台663，总计2086条。全部未测。
- 原2113设计的逐项判断、当前311变更判断、修复7项及新增12项主播粉丝列表判断均已保存并绑定实际设计哈希。正式JSON与Excel通过校验，最后证据见 `final-delivery-status.json`。
- 243个需求页面都有对应端、角色用例。**全文覆盖尚未闭环，不是完整覆盖交付**；保守未覆盖/部分覆盖项仍在 `requirement-coverage.json`，不可改成通过来隐藏生成缺口。
- 两份MainBasis仍为本文件下方登记的封存哈希，未回读历史用例。原61风险问题加7个局部观察问题，正式用例与待确认分开。
- `交付说明.md` 已解释当前范围、三端关联、检查与覆盖限制。不要把文件导出成功表述为业务全覆盖或产品测试通过。

## 前序过程记录（已过时）

当前任务继续执行，尚未交付 Excel。用户要求 liveshow-proto 三端用例，历史数据不读取不比较，只用本批封存 MainBasis 两文件。

## 需求阶段

上游全量扫描、context 同步与完整回读、两段传递、MainBasis 封存已完成。不要重新执行会修改上游的脚本。生成阶段业务来源仅 MainBasis 两文档。统一需求 SHA256 b829176e7f71883cd308c92d32fcefe7f596af1ed5be4dc9b8c7f9a308ae7014；风险 SHA256 5bb471cb26b5863d240671b46630095ad4693ef36452bc53e9bc9241ef8ed13e。61 个风险问题。

## 当前设计与复核

- `node check-design.mjs` 最新 2102 条，设计错误0、语言错误0。这不是完整业务覆盖证明。
- 本段新增 `manual-guild-completion.mjs`、`manual-user-coverage.mjs`、`manual-admin-coverage.mjs`。所有新增来源严格来自两文档；详见这些手工分支文件。
- 原始设计继续由 `current-design.mjs` 导入，末尾执行 `design-corrections.mjs`、`merge-decisions.mjs`、`review-fixes.mjs`。
- 精确去重键已加 page key，修复同名不同页面被合并的问题；两个公会主播选择器前置分别明确消息/违规入口。
- `review-snapshot.json` 固定了当时2113条设计，SHA256 b3af603b2f6916d2776e476db0f854aa511bae71b733984b66d096ec2af597bb。**不要覆盖快照**。里面每条有序号、场景ID、完整规则、设计hash。
- `review-decisions.json` 是对快照1–115逐条的明确判断，115通过。
- `review-decisions-02.json` 对快照116–253逐条判断，112通过、26不通过。
- `review-decisions-03.json` 对快照254–400逐条判断（全部已写判断），未通过项已在 `review-fixes.mjs` 修正或显式合并，但还需对修正后的设计重新绑定复核记录。
- 后续从快照 **401** 继续逐条阅读。批量脚本不得自动授予复核通过；每条实际判断用显式 `[快照序号,具体理由]` 记录。现有记录不是运行测试通过，也不是全文覆盖通过。
- 快照与当前设计因修复会有差异；今后应用判断时仅允许相同规则内容hash匹配。旧快照不通过项修正后，需要单独保存新版本的对应规则与明确复核判断，不可自动重新签通过。
- 直接/严格相同去重之外的语义合并在 `merge-decisions.mjs` 和 `review-fixes.mjs` 明确记载，保留目标 sources，drop.excluded 记录理由。历史产物未参与。

## 本段已修的重要问题

后台系统账号/角色操作改超级管理员；区号变更后需登录再看地区资料；取消注销后再次登录验证无冷静期；新增房管补确认；恢复发言失败补两次确认；公会/后台有效天部分指标改人数或人次；普通与定制礼物收益前置补消费类型防误合并；聊天和关系结果补真实观察入口；失效群入口不再虚构打开；主播下播的门票、邀请、连麦等结果转至可观察角色；公会退会或关权限后的结束页面由用户端观察，不伪造公会场次状态字段；当前公会记录只显示时长等，无显式“已结束”状态字段。

## 待完成

1. 快照401–2113逐条语义/去重检查，修正实际问题，并复核所有修复后的新设计（不能批量盖章）。前三批阅读记录和代码已保留，不重做相同内容。
2. `requirement-coverage.json` 目前仍为旧 assemble 生成的保守未覆盖/部分覆盖。需从全部 MainBasis 来源核对分支映射；未完成的生成缺口不能伪装产品待确认或完整覆盖。
3. `assemble.mjs` 会覆盖各端清单为“设计中”，最终审批前再运行一次；不要在最终审批后重跑。
4. `release-reviewed.mjs` 已准备但未运行，要求每条业务规则设计审批hash、显式去重复核、覆盖内容复核hash。当前没有最终candidate/final，也没有任何Excel。
5. release 目前工具登记正则需补 `merge-decisions` / `review-fixes` / `prepare-review` 以及实际判断文件，保证依赖完整。
6. 最终用根目录 `scripts/build-testcase-workbook.mjs` 与 @oai/artifact-tool 输出3份工作簿；marker 尚未调用（第一次工作簿author前一次 expected-output-count 3）。查看预览、校验全部单元格及公式、两文档封存新鲜度、实际阶段metrics，然后交付。

不读取旧任务/旧用例，不修改原型/context/封存需求，不编造全部覆盖或运行测试通过。本项目在 `/Users/geekonup/testcase/liveshow-proto`，不要混用 `/Users/geekonup/liveshow-proto`。
