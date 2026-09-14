import {designs} from './design-cases.mjs';
const pairs=[
 ['消费订单详情统计普通礼物收益','普通礼物成功消费收入','同一消费详情的普通礼物1:1收益公式，仅算例金额不同'],
 ['消费订单详情统计定制礼物收益','定制礼物成功消费收入','同一消费详情的定制礼物1:1收益公式，仅算例金额不同'],
 ['消费订单详情统计幸运礼物收益','幸运礼物返奖0不改变收益','同一消费详情的幸运礼物按送出价值乘比例，不重复金额算例'],
 ['主播结算余额按筛选汇总','主播账户汇总只取筛选结果','同一主播账户筛选汇总，10+20与100+200没有不同业务条件'],
 ['公会结算余额按筛选汇总','公会账户汇总只取筛选结果','同一公会账户筛选汇总，合并仅金额不同的算例'],
 ['充值取消余额','充值取消结果','同一次取消渠道支付后的余额保持；保留返回充值页观察的明确路径'],
 ['充值超时余额','充值超时结果','同一支付超时不入账，保留返回充值页观察的明确路径'],
 ['被群禁言后不能发送文字','群单人禁言时使用文本','同一单人禁言输入框不可用，保留实际点击输入框路径'],
 ['主动下播后本场禁言状态失效','本场禁言不延续下一场','主播结束弹窗不能直接观察观众发言权限，归入观众下一场发送验证'],
 ['主动下播后本场踢出状态失效','踢出不延续到下一场','主播结束弹窗不能直接观察观众准入，归入观众下一场进入验证'],
 ];
for(const [from,to,reason]of pairs){
 const drop=designs.find(d=>d.label===from),keep=designs.find(d=>d.label===to);if(!drop||!keep)throw Error('Unresolved explicit merge '+from+' -> '+to);
 keep.sourceIds=[...new Set([...keep.sourceIds,...drop.sourceIds])];(keep.mergedFrom||=[]).push({label:from,reason});drop.excluded='本次语义合并：'+reason+'；保留 '+to;
}
const general=designs.find(d=>d.label==='冷静期取消注销的原有账号数据和关系保持不变'),specific=designs.filter(d=>d.label.startsWith('冷静期取消注销后保留'));
if(!general||specific.length!==5)throw Error('Missing recovery observations');
for(const d of specific)d.sourceIds=[...new Set([...d.sourceIds,...general.sourceIds])];
general.excluded='用五条具体账号、余额、好友、私信及粉丝团观察替代无法直接执行的笼统数据保持断言';
