// Numeric expectations authored against the current requirements; no business formula is inferred from a rendered case.
const variable=(名称,数值,业务含义,单位='金币')=>({名称,数值,业务含义,单位});
const ref=变量=>({变量});
const expr=(运算,...参数)=>({运算,参数:参数.map(p=>typeof p==='string'?ref(p):p)});
export function calculationFor(d,result){
 let vars,ast,formula,unit='金币';
 if(d.point==='成功支付金币到账'){vars=[variable('原余额',100,'支付前真实金币余额'),variable('基础',1000,'下单快照基础金币'),variable('赠送',100,'下单快照赠送金币')];ast=expr('+','原余额','基础','赠送');formula='支付后余额 = 原余额 + 下单基础金币 + 下单赠送金币';}
 if(d.point==='负余额充值先抵扣'){vars=[variable('原余额',-200,'退款后负余额'),variable('到账',1100,'本笔充值到账金币')];ast=expr('+','原余额','到账');formula='充值后余额 = 负余额 + 本笔到账金币';}
 if(d.point==='支付时套餐快照'){vars=[variable('基础',1000,'下单时基础金币'),variable('赠送',100,'下单时赠送金币')];ast=expr('+','基础','赠送');formula='本笔到账金币 = 下单基础金币 + 下单赠送金币';}
 if(d.point==='赠送比例标签'){vars=[variable('赠送',100,'套餐赠送金币'),variable('基础',1000,'套餐基础金币'),variable('百分数',100,'百分数换算常量','%')];ast=expr('*',expr('/','赠送','基础'),'百分数');formula='赠送比例 = 赠送金币 ÷ 基础金币 × 100%';unit='%';}
 if(d.point==='签到金币到账'){vars=[variable('原余额',100,'签到前真实金币余额'),variable('奖励',20,'今日签到档位奖励')];ast=expr('+','原余额','奖励');formula='签到后余额 = 原余额 + 今日签到奖励';}
 if(d.point==='礼物数量对应金额'){vars=[variable('单价',10,'所选礼物单价'),variable('数量',10,'本次赠送件数','件')];ast=expr('*','单价','数量');formula='所需金币 = 礼物单价 × 赠送数量';}
 if(d.point==='成功送礼扣款'){vars=[variable('原余额',100,'送礼前余额'),variable('价格',10,'本次一件礼物价值')];ast=expr('-','原余额','价格');formula='送礼后余额 = 原余额 - 单价 × 数量';}
 if(d.point==='运营普通礼物扣虚拟币'){vars=[variable('原余额',100,'送礼前虚拟金币余额','虚拟金币'),variable('价格',10,'本次一件普通礼物价值','虚拟金币')];ast=expr('-','原余额','价格');formula='送礼后虚拟余额 = 原虚拟余额 - 单价 × 数量';unit='虚拟金币';}
 if(d.point==='幸运礼物收益默认比例'){vars=[variable('价值',1000,'幸运礼物成功送出价值'),variable('比例',0.01,'后台主播收益比例','比例')];ast=expr('*','价值','比例');formula='幸运礼物主播收益 = 送出价值 × 后台比例';}
 if(d.point==='结束收益口径'){vars=[variable('普通',100,'本场普通礼物收益'),variable('门票',50,'本场门票收益'),variable('幸运价值',1000,'本场幸运礼物送出价值'),variable('比例',0.01,'后台幸运收益比例','比例')];ast=expr('+','普通','门票',expr('*','幸运价值','比例'));formula='本场收益 = 普通礼物收益 + 门票收益 + 幸运送出价值 × 比例';}
 if(d.point==='本场贡献正确累计'){vars=[variable('单价',10,'本场真实礼物单价'),variable('数量',3,'本场成功赠送件数','件')];ast=expr('*','单价','数量');formula='本场贡献 = 礼物单价 × 本场成功送出数量';}
 if(d.point==='退团历史总贡献保留'){vars=[variable('入团前',10,'入团前有效贡献'),variable('在团',20,'首次在团期间贡献'),variable('退团',30,'退团期间贡献'),variable('重入团',40,'重入团后贡献')];ast=expr('+','入团前','在团','退团','重入团');formula='历史总贡献 = 全历史阶段有效贡献之和';}
 if(d.point==='本周期贡献不按入团截断'){vars=[variable('入团前',100,'本月入团前贡献'),variable('入团后',50,'本月入团后贡献')];ast=expr('+','入团前','入团后');formula='本月贡献 = 本月入团前有效贡献 + 本月入团后有效贡献';}
 const lucky=d.point.match(/^幸运单抽返奖(\d+)$/);
 if(lucky){vars=[variable('原余额',100,'赠送前真实余额'),variable('扣款',10,'单个幸运礼物价格'),variable('返奖',Number(lucky[1]),'测试环境本次开奖实际返奖')];ast=expr('+',expr('-','原余额','扣款'),'返奖');formula='开奖后余额 = 原余额 - 礼物价值 + 本次实际返奖';}
 const group=d.point.match(/^幸运(10|100)连抽独立扣返$/);
 if(group){const n=Number(group[1]);vars=[variable('原余额',n*10,'赠送前真实余额'),variable('单价',10,'每个幸运礼物价格'),variable('数量',n,'本次独立开奖次数','件'),variable('返奖',0,'本组已准备的实际返奖合计')];ast=expr('+',expr('-','原余额',expr('*','单价','数量')),'返奖');formula='本组开奖后余额 = 原余额 - 单价 × 数量 + 各次返奖合计';}
 if(d.point==='邀请金币合计'){vars=[variable('人数',3,'成功邀请且奖励已到账人数','人'),variable('单人奖励',10,'当前活动每成功邀请一人奖励')];ast=expr('*','人数','单人奖励');formula='累计邀请金币 = 成功邀请人数 × 当前活动单人奖励';}
 if(d.point==='整笔充值退款形成负余额'){vars=[variable('原余额',0,'已消费后余额'),variable('原到账',1000,'被退款订单全部到账金币')];ast=expr('-','原余额','原到账');formula='退款后余额 = 当前余额 - 原订单全部到账金币';}
 if(d.point==='离开重进累计停留'){vars=[variable('首次',10,'本场首次在线分钟数','分钟'),variable('重进',5,'本场重进在线分钟数','分钟')];ast=expr('+','首次','重进');formula='本场累计在线时长 = 首次在线时长 + 重进后在线时长';unit='分钟';}
 if(d.point==='连续赠送逐件扣款'){vars=[variable('原余额',100,'赠送前真实金币余额'),variable('单价',10,'普通礼物价格'),variable('次数',3,'成功独立赠送次数','次')];ast=expr('-','原余额',expr('*','单价','次数'));formula='连续赠送后余额 = 原余额 - 单价 × 成功赠送次数';}
 if(['筛选直播收益求和','月收益统计范围'].includes(d.point)){vars=[variable('场次一',100,'范围内第一场收益'),variable('场次二',200,'范围内第二场收益')];ast=expr('+','场次一','场次二');formula='当前范围收益 = 范围内各场收益之和';}
 if(d.point==='月时长求和'){vars=[variable('场次一',30,'所选月第一场有效时长','分钟'),variable('场次二',60,'所选月第二场有效时长','分钟')];ast=expr('+','场次一','场次二');formula='月有效时长 = 所选月份各场有效时长之和';unit='分钟';}
 if(d.point==='本场礼物贡献不扣返奖'){vars=[variable('单价',10,'幸运礼物价格'),variable('数量',3,'本场成功赠送数量','件')];ast=expr('*','单价','数量');formula='本场礼物贡献 = 单价 × 成功赠送数量';}
 if(d.point==='快捷充值成功到账'){vars=[variable('原余额',20,'充值前余额'),variable('到账',100,'本次成功支付套餐总到账')];ast=expr('+','原余额','到账');formula='充值后余额 = 原余额 + 本次到账金币';}
 if(/^(今日|本月)主播收益类型汇总$/.test(d.point)){vars=[variable('普通',100,'成功普通礼物'),variable('定制',200,'成功定制礼物'),variable('门票',50,'成功门票'),variable('幸运',1000,'幸运礼物成功送出价值'),variable('比例',0.01,'后台幸运收益比例','比例')];ast=expr('+','普通','定制','门票',expr('*','幸运','比例'));formula='收益 = 普通 + 定制 + 门票 + 幸运送出价值 × 比例';}
 if(!ast)return null;
 const valueOf=n=>n.变量?vars.find(v=>v.名称===n.变量).数值:n.运算==='+'?n.参数.reduce((s,a)=>s+valueOf(a),0):n.运算==='*'?n.参数.reduce((s,a)=>s*valueOf(a),1):n.运算==='-'?valueOf(n.参数[0])-valueOf(n.参数[1]):valueOf(n.参数[0])/valueOf(n.参数[1]);
 return {公式:formula,数据范围:d.pre.slice(1).join('；'),结果单位:unit,证据:d.refs.map((_,i)=>i),变量:vars,表达式:ast,最终值:valueOf(ast)};
}
