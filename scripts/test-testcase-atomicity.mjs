#!/usr/bin/env node

import assert from "node:assert/strict";
import { descriptionRepeatsVerificationPoint, hasBalancedDelimiters, splitAtomicResults } from "./validate-testcase-json.mjs";

assert.deepEqual(splitAtomicResults("资产状态变化后同步更新个人资料和直播间展示"), [
  "资产状态变化后同步更新个人资料",
  "资产状态变化后同步更新直播间展示",
]);
assert.deepEqual(splitAtomicResults("退款不撤销已完成礼物消费，不回滚主播收益和分成"), [
  "退款不撤销已完成礼物消费",
  "不回滚主播收益",
  "不回滚分成",
]);
assert.equal(splitAtomicResults("新用户 ARPU = 新用户充值金额 / 新用户充值人数").length, 1);
assert.equal(splitAtomicResults("场次结束后消息、消费、处置和收益记录继续保留").length, 4);
assert.equal(splitAtomicResults("初始密码：必填，至少 6 位").length, 2);
assert.equal(splitAtomicResults('只展示当前端、地区和账号可用的支付渠道').length, 1);
assert.equal(splitAtomicResults('仅展示当前端可用的支付渠道和余额').length, 2);
assert.equal(hasBalancedDelimiters("提示“密码错误”"), true);
assert.equal(hasBalancedDelimiters("提示“密码错误"), false);
assert.equal(descriptionRepeatsVerificationPoint("验证主播本场贡献计算口径", "本场贡献计算口径", "直播间（主播视角）"), true);
assert.equal(descriptionRepeatsVerificationPoint("验证主播进入直播间并查看“本场贡献”", "本场贡献单价与数量计算口径", "直播间（主播视角）"), false);

process.stdout.write("atomicity checks passed\n");
