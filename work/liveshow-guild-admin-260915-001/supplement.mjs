import {add,table,calc,pages} from './design.mjs';

// Current MainBasis reverse review: missing observations, not a historic case comparison.
for(const [page,ids,kind] of [['guild-join-review.html','457953c7b57a,83968f78cc30','入会'],['guild-leave-review.html','acb4de4aef54,283dcbce445a','退会']]){
 add(page,ids,kind+'申请人身份核对','申请主体身份','存在两个申请人，姓名相似而实际ID不同',[],'每张申请卡片的头像、名称、ID取自同一申请人');
 add(page,ids,kind+'提交时间与审核时间不同','申请提交时间','申请9月1日提交、9月2日处理，已记录服务端提交时间',[],'申请时间显示9月1日对应的提交时间');
}
add('guild-join-review.html','a5054ddf8e35','同一用户在审申请唯一','待处理申请去重','同一用户已存在本会待处理入会申请，用户端重复提交被业务规则拒绝',['刷新申请列表'],'该用户只保留一笔待处理申请');
add('guild-join-review.html','aad9d80d34b7','公会驳回后收到新申请','新旧申请单隔离','旧申请被公会驳回后，该用户已重新向本会提交',['刷新申请列表'],'新的待审申请使用不同于旧申请的申请单ID',{flow:'JOIN'});
add('guild-leave-review-detail.html','4f04fbe0f282,dc1ca0561434','退会通过不进入平台审核','退会终审归属','本会主播有待审退会申请',['点击通过','确认二次确认弹窗'],'申请直接显示已通过，不出现平台待审节点',{flow:'LEAVE'});
add('guild-host-detail.html','c38fd8665271,cc2e01100f18','移出正在直播的主播','移出后的场次状态','本会主播正在直播且无未结清收益',['点击移出公会','确认移出','打开该主播直播记录'],'移出时的直播场次显示已结束',{flow:'LEAVE',transition:'HOST-REMOVE'});
for(const [page,ids]of [['guild-host-list.html','854e9365081d,dd888a11578e'],['guild-host-summary.html','b2509dc0e635,f1350c8e7f5a'],['guild-host-select.html','22d3084bfdfe,276cb5a06416'],['guild-income-day-detail.html','06ad3c0d866a,beddde584aab'],['guild-violation-host-select.html','4f1488c6ef14,893b7e4f0546']])
 add(page,ids,pages.get(page).name+'主播标识核对','头像名称与ID归属','本会两名主播使用相似昵称，已知各自真实ID及头像',[],'头像、名称和ID对应同一主播账号');
for(const [page,id]of [['guild-host-list.html','4916bb8dbe1d'],['guild-host-summary.html','8ed1344bc371'],['guild-host-detail.html','6e33633dfb70'],['guild-income-day-detail.html','9d262cff137e']])
 add(page,id,'主播等级排除虚拟赠礼','主播等级收益归属','主播分成前真实收益达到已配置2级门槛，尚未达到3级；虚拟赠礼与财富贡献足以达到更高档',[],'主播等级显示2级');
for(const [page,ids,label,scope]of [
 ['guild-host-list.html','8f3a10c61900,045697d76e54,5e4ba2d8de06','主播收益','所选周期内本会主播'],
 ['guild-host-summary.html','77a6dcfb012c','收益','所选主播及日或月'],
 ['guild-host-detail.html','70ca27a17af9','总收益','当前主播全部历史'],
 ['guild-host-data.html','06ce5f7ae15a,978ae84c9129','收益','所选主播及日期范围'],
 ['guild-income.html','ccb51d7a71ad,5f23a2ca2390,b44be692034b,99876c93fae7','公会收益','所选日或月范围本会主播'],
 ['guild-income-day-detail.html','1db91ec3c02e,87ec9467d4df','当日收益','本会所选日主播']
])add(page,ids,label+'统计成功真实礼物','收益范围汇总',scope+'普通礼物100金币、定制200金币、幸运1000金币且赠送时比例1%；虚拟500金币、失败50金币、范围外300金币',[],label+'计算结果=100+200+10=310金币',{type:'逻辑校验',calc:calc('普通+定制+幸运比例收益',scope+'，排除虚拟、失败及范围外','金币',{普通:100,定制:200,幸运收益:10},'+',310)});
table('guild-host-detail.html','71267e7ac9bf,32a21ffeb6ce,8fd5344097e4',[
 ['累计完成场次','历史直播次数','该主播已完成2场，另有1场正在直播',[],'直播次数显示2场'],
 ['已完成场次时长汇总','历史直播时长','已完成两场分别30和60分钟，另有正在直播的场次',[],'直播时长计算结果=30+60=90分钟',{calc:calc('已完成场次时长合计','当前主播已完成场次','分钟',{第一场:30,第二场:60},'+',90)}],
 ['账号与直播违规累计','累计违规范围','当前主播账号违规1条、直播违规2条，另有其他主播违规',[],'累计违规显示3条']
]);
for(const [page,ids,metric]of [['guild-host-data.html','5a047639c8df','直播场次'],['guild-income.html','af64b1bbaea6,6e67ed0c3023,3f1eb3fc164d','直播场次']])add(page,ids,'创建场次按所选周期统计',metric+'统计范围','当前范围成功创建3场，其中1场尚在直播；另有范围外场次',[],metric+'显示3场');
add('guild-income.html','1ff0ca58162f,631cfc9ae98a','日月记录日期归属','统计周期标识','本公会存在跨自然月的两日数据',['切换月数据'],'各行月份对应数据所属自然月');
add('guild-income.html','4df17b6aa9fa,c4d52f906bd9','月开播人数跨日去重','月开播主体去重','所选月主播一完成3场，主播二完成1场，其他主播没有完成直播',['切换月数据'],'月开播人数显示2人');
for(const [page,ids]of [['guild-income.html','14ba7a1cd732'],['guild-income-day-detail.html','f41d28f9fe68']])for(const [minutes,count]of [[179,0],[180,1],[181,1]])add(page,ids,'当日累计'+minutes+'分钟达标判断','当日达标人数边界','本会仅一名主播，当日有效时长累计'+minutes+'分钟，无跨日或中断',[],'当日达标主播人数显示'+count+'人');
add('guild-operation-accounts.html','cd0c1de92fde','运营账号创建入口','创建页面路由','公会有运营账号管理权限',['点击创建'],'进入创建运营账号页面');
add('guild-operation-accounts.html','56bc7f0fa718','列表余额币种','虚拟余额展示','目标运营账号可用虚拟金币100，未持有真实金币',[],'余额显示100虚拟金币');
add('guild-operation-account-detail.html','9a301f4fcc80','运营账号详情身份','运营账号资料归属','两个运营账号昵称相似而ID不同，已知目标账号头像',[],'账号详情的头像、名称和ID属于所选运营账号');
for(const [id,label,period]of [['cb2f1597cb22','累计消费','全部历史'],['6187fe048a35','本月发放','当前自然月'],['94bff1c09560','本月消费','当前自然月']])add('guild-operation-account-detail.html',id,label+'排除失败记录',label+'汇总',period+'两笔成功记录100、200金币，失败记录50金币，其他账号400金币',[],label+'计算结果=100+200=300金币',{calc:calc('符合范围成功记录合计','当前运营账号'+period,'金币',{第一笔:100,第二笔:200},'+',300)});

// Backend metrics each use a named observable column and prepared positive/negative data.
for(const [page,id,label,formula,values,op,total,pre]of [
 ['admin-user-list.html','33a581e8cc89','累计充值','成功实付之和',{第一笔:10,第二笔:20},'+',30,'所选用户成功充值10和20USD，失败30USD'],
 ['admin-user-list.html','63a48e394be8','累计消费','真实扣款-幸运返奖',{扣款:1400,返奖:500},'-',900,'普通100、定制200、门票100、幸运1000金币扣款，返奖500；另有失败、撤销、虚拟各100'],
 ['admin-host-list.html','cb2ee54a238a','金币收益','普通+定制+门票+幸运比例收益',{普通:100,定制:200,门票:100,幸运:10},'+',410,'成功真实普通100、定制200、门票100、幸运1000金币且比例1%，另有虚拟500'],
 ['admin-host-detail.html','16afc0c47b28','收益','普通+定制+门票+幸运比例收益',{普通:100,定制:200,门票:100,幸运:10},'+',410,'成功真实普通100、定制200、门票100、幸运1000金币且比例1%，另有虚拟500'],
 ['admin-live-management.html','a2374b2652c3','消费金币','真实扣款-幸运返奖',{扣款:1400,返奖:500},'-',900,'本场普通100、定制200、门票100、幸运1000金币扣款，返奖500；另有虚拟100'],
 ['admin-live-management.html','34b65e1d70aa','主播收益','普通+定制+门票+幸运比例收益',{普通:100,定制:200,门票:100,幸运:10},'+',410,'本场成功普通100、定制200、门票100、幸运1000金币且比例1%；虚拟500不计'],
 ['admin-guild-detail.html','a7d89bf6f91b','累计收益','旗下主播收益合计',{主播一:100,主播二:200},'+',300,'本会两名主播收益100及200金币，其他公会主播500'],
 ['admin-recharge-order-detail.html','eeb7b92fa90a','总到账金币','基础+赠送',{基础:100,赠送:20},'+',120,'该订单基础100金币、赠送20金币，已支付成功'],
 ['admin-consumption-order.html','ce5a3ea958dd','消费金币','单价×数量',{单价:10,数量:3},'*',30,'订单赠送时单价10金币、成功数量3件，当前配置价已改为20'],
 ['admin-consumption-order.html','1c89bea50533','用户净消耗','幸运扣款-实际返奖',{扣款:100,返奖:30},'-',70,'当前幸运订单扣款100金币、返奖30金币'],
 ['admin-refund-order.html','27321fae974e','扣回金币','原订单基础+赠送',{基础:100,赠送:20},'+',120,'原充值订单到账基础100及赠送20金币，退款已完成'],
 ['admin-host-live-record-report.html','be31da7b2eeb','消费金币','真实扣款-幸运返奖',{扣款:1400,返奖:500},'-',900,'本场普通100、定制200、门票100、幸运1000金币扣款，返奖500，虚拟500不计'],
 ['admin-recharge-statistics.html','744564064a24','充值金币','成功基础金币合计',{第一笔:100,第二笔:200},'+',300,'当日成功订单基础金币100和200，赠送50金币，失败100金币'],
 ['admin-recharge-statistics.html','d34b8527989d','消费金币','真实扣款-幸运返奖',{扣款:1400,返奖:500},'-',900,'当日普通100、定制200、门票100、幸运1000金币扣款，返奖500，虚拟500不计'],
 ['admin-user-activity-statistics.html','23e37fab7ffe','总充值金额','新用户金额+老用户金额',{新用户:10,老用户:20},'+',30,'当日新用户充值10USD、老用户充值20USD，均支付成功'],
 ['admin-user-activity-statistics.html','cc7c6eee1660','总充值人数','新用户人数+老用户人数',{新用户:2,老用户:3},'+',5,'当日新用户2人、老用户3人成功充值，重复充值按用户去重'],
 ['admin-monthly-host-earnings.html','1828b7702c16,6b1e8290c6b3','普通礼物收益','赠送快照单价×份数',{单价:100,份数:3},'*',300,'所选主播普通礼物赠送时单价100金币、成功3件，当前价格已改为200'],
 ['admin-consumption-order-detail-report.html','e744c2638e3b','消费金币','快照单价×份数',{单价:100,份数:3},'*',300,'成功幸运礼物快照单价100金币、3件，返奖200另记'],
 ['admin-operation-accounts.html','86cc5bde0a36','账户余额','虚拟发放-成功消费',{发放:500,消费:200},'-',300,'运营账号历史发放500虚拟金币、成功消费200，失败消费50不计'],
 ['admin-operation-account-detail.html','fcdd1d15e729','发放后余额','发放前余额+发放金币',{发放前:100,发放:200},'+',300,'成功发放记录的发放前余额100、当次发放200虚拟金币'],
 ['admin-operation-account-detail.html','4a613da41048','消费金币','快照单价×数量',{单价:100,数量:3},'*',300,'目标送礼记录快照单价100金币、数量3件']
]){const unit=label.includes('充值金额')||label==='累计充值'?'USD':label==='总充值人数'?'人':'金币';add(page,id,label+'数值核算',label+'计算口径',pre,[],label+'计算结果='+total+unit,{type:'逻辑校验',calc:calc(formula,'所选账号、场次或报表周期，排除失败及范围外',unit,values,op,total)});}
for(const [page,id,title,sub,pre,result]of [
 ['admin-live-detail.html','ce619832ef38','单场观众反复进房','场次观众去重','本场两名用户，用户一进入3次','观众人数显示2人'],
 ['admin-live-detail.html','ad22be919d87','礼物数量排除门票','收礼数量范围','本场成功礼物2件和3件，另有门票1张及失败礼物4件','收礼数量显示5件'],
 ['admin-inspection-schedule.html','5f386a705f5e','不同排班编号','排班ID唯一性','已成功创建两条排班','两条排班编号不同'],
 ['admin-inspection-schedule.html','2db231775368','排班有效人数','巡房人员计数','排班包含2名有效巡房人员','排班人数显示2人'],
 ['admin-content-audit.html','e590d8c206ba','不同机审告警单号','审核单ID唯一性','同场次产生两条独立机审告警','两条审核单号不同'],
 ['admin-content-audit.html','85d55cf81d3e','命中时画面不同于当前','告警图片快照','告警命中画面已保存，直播画面随后改变','告警截图仍为命中时快照'],
 ['admin-report-handling.html','4d96b77b512a','违规类型修改后查看旧举报','举报类型快照','举报提交后后台已修改类型名称','旧举报保留提交时举报类型'],
 ['admin-report-handling.html','023ad4e2285f','直播结束后查询举报','举报关联场次状态','举报关联场次已结束','直播状态显示已结束'],
 ['admin-report-handling.html','a893b2deecb9','举报提交与处理日不同','举报提交时间归属','举报9月1日提交、9月2日处理','提交时间显示9月1日对应的提交时刻'],
 ['admin-violation-types.html','adc7433c0f2b','两种违规类型编号','违规类型ID唯一性','已创建两种违规类型','两种类型ID不同'],
 ['admin-guild-list.html','233ac94a1aae','公会身份核对','公会标识归属','已知两家公会真实ID、名称与Logo','每行ID、名称、Logo对应同一公会'],
 ['admin-guild-list.html','869d538c363d','公会长账号区分昵称','公会长账号归属','目标公会长昵称与登录账号不同','公会长列保留该昵称对应的真实管理账号'],
 ['admin-prop-list.html','c9fd2890d1af','多个道具编号','道具ID唯一性','已创建两个不同类型道具','两个道具ID不同'],
 ['admin-gift-send-count-rules.html','6acc2c6b9807','多个数量规则编号','数量规则ID唯一性','已创建两条数量规则','两条规则ID不同'],
 ['admin-placement-config.html','89ac12a5971f','多素材展示位','轮播素材计数','某展示位已配置3项素材','素材数量显示3'],
 ['admin-push-management.html','f7780237be26','指定公会推送范围','推送受众归属','存在面向指定公会的推送任务','目标用户显示该指定公会用户'],
 ['admin-push-management.html','2dd362e08d82','已执行推送查看时间','推送执行记录','计划时间与实际发送时间不同，任务已执行','已发送记录保留实际执行结果'],
 ['admin-task-config.html','315ec2f293f7','不同任务使用独立编号','任务ID唯一性','已创建两个名称相同但配置不同的任务','两条任务ID不同'],
 ['admin-live-type.html','e875cd2ebc54','不同直播类型编号','直播类型ID唯一性','已创建两个直播类型','两个类型ID不同'],
 ['admin-feature-switch.html','05b0b9fc4ecb','功能开关修改留痕','开关操作人归属','已知当前管理员账号','最后操作人显示最近完成开关修改的管理员'],
 ['admin-ticket-price-level.html','b5fe3b90da8c','不同门票档位编号','门票档位ID唯一性','已创建两个不同价格档位','两个档位ID不同'],
 ['admin-sensitive-words.html','28e6cec9a590','不同词条分类核对','敏感词分类归属','存在违法违规和广告引流两个分类的词条','每条词条保留其已配置分类'],
 ['admin-sensitive-words.html','8b3680ae62c2','词条替换内容核对','替换文案配置快照','目标词条替换内容已配置为***','替换内容列显示***'],
 ['admin-recharge-order.html','7c224188f2bc','两笔渠道交易核对','订单渠道交易归属','用户有两笔不同渠道交易，已知各自平台订单号','平台订单号对应各自渠道交易号'],
 ['admin-recharge-order.html','3d354bb90a70','套餐标价不同于实付','充值实付金额','成功订单套餐标价10USD、实际支付8USD','充值金额显示8USD'],
 ['admin-recharge-order.html','772e68079212','套餐赠送区别基础','充值金币分类','成功订单基础100金币、活动赠送20金币','基础金币列显示100金币'],
 ['admin-recharge-order.html','63c70e1efb57','下单时间不同于成功时间','支付成功时间','订单下单与支付到账时刻不同','成功时间采用支付成功且完成入账的时刻'],
 ['admin-consumption-order.html','dc9baeddde27','四类成功消费查询','订单消费类型','普通、定制、幸运礼物和门票各有成功订单','每笔订单消费类型与实际业务一致'],
 ['admin-consumption-order.html','fa2f2cd06047','连送按件数累计','订单赠送份数','一笔成功连送包含3件礼物','数量显示3件'],
 ['admin-consumption-order.html','c53594bd8972','接收主播与支付用户不同','消费归属主播','用户甲向主播乙赠礼，已知双方ID','主播信息对应接收礼物的主播乙'],
 ['admin-consumption-order.html','ad02ff530d39','余额不足的消费结果','失败消费订单隔离','用户余额不足的赠礼请求已失败','列表不出现该请求的成功消费订单'],
 ['admin-data-overview.html','18bcd1c76b11','有效天主播跨日统计','有效天主播人次','同一主播两日均累计直播满3小时','汇总达成有效天主播显示2人次'],
 ['admin-daily-statistics.html','48996c6b8991','反复切到前台','日活跃账号去重','同日两名登录用户各启动或切回前台3次','活跃用户显示2人'],
 ['admin-daily-statistics.html','55f7ff02cf61','同一主播开播多场','日开播主体去重','当日一名主播成功开播3场','开播人数显示1人'],
 ['admin-user-active-statistics.html','6c5623b4402b','一人多笔成功充值','付费人数去重','当日用户甲成功充值3笔，用户乙仅充值失败','付费用户显示1人'],
 ['admin-host-live-record-report.html','0b2daeef07ef','同主播多场固定房号','长期直播间ID','同一主播先后完成两场直播','两条场次记录使用同一长期直播间ID'],
 ['admin-host-live-record-report.html','18e4ad700223','主播下场更换房型','历史房型快照','当前场次为普通房，上一场为门票房','上一场仍显示门票房'],
 ['admin-host-live-record-report.html','ed3244207fd4','场次首尾时刻计算','直播时长差值','目标已结束场次同日10:00开播、10:45结束','时长显示45分钟'],
 ['admin-host-live-record-report.html','0d89bdb920c1','真实观众进出多次','真实观众去重','真实用户甲进入3次、乙进入1次，另有运营号进房','观众人数显示2人'],
 ['admin-monthly-host-share.html','18c35f8e5fcf','范围内成功开播场次','分成报表场次数','所选主播周期内成功开播3场，另有失败开播1次','直播场次显示3场'],
 ['admin-system-account.html','89676cf95254','后台账号独立编号','后台账号ID唯一性','已新建两个后台账号','两个账号ID不同'],
 ['admin-system-account.html','2bb34a782f2b','登录成功时间区别失败尝试','账号最近登录时间','某账号成功登录后又发生一次登录失败','最近登录时间保持最后成功登录时刻'],
 ['admin-system-role.html','b6e2cc2a69a9','后台角色独立编号','角色ID唯一性','已新建两个角色','两个角色ID不同']
])add(page,id,title,sub,pre,[],result);
for(const [page,id]of [['admin-daily-statistics.html','d2d60905bd17'],['admin-host-statistics.html','d549c0e4c62c']])for(const [minutes,n]of [[179,0],[180,1],[181,1]])add(page,id,'有效直播'+minutes+'分钟','日有效天人数边界','当日仅一名主播，累计有效时长'+minutes+'分钟，无跨日中断',[],'有效天达标人数显示'+n+'人');
for(const [page,id,label]of [['admin-operation-guild-controls.html','36053d84572c','本月累计已发放'],['admin-operation-guild-controls.html','427b8bb7cc2a','账户余额累计'],['admin-operation-guild-controls.html','20c0aeada4ca','本月累计消费'],['admin-operation-accounts.html','26286348d506','本月发放'],['admin-operation-accounts.html','d0e6f8d8c385','本月消费']])add(page,id,label+'所属公会隔离',label+'汇总','目标范围内两条可计入虚拟记录100和200金币，其他公会500金币、失败50金币、非当前自然月80金币均不计',[],label+'计算结果=100+200=300金币',{calc:calc('所选范围记录合计','当前运营账号或公会，月指标限当前自然月','金币',{第一条:100,第二条:200},'+',300)});
for(const [page,id]of [['admin-gift-detail.html','78f436fbafe6'],['admin-prop-detail.html','94868bc2521f']]){
 add(page,id,'权重不接受小数','排序整数限制','其他必填配置有效',['输入排序权重为1,5','点击保存'],'小数权重不能保存');
 add(page,id,'较大排序权重在前','排序权重方向','同类两个上架项目权重分别1和2，已保存',['返回列表'],'权重2的项目排列在权重1之前');
}
add('admin-prop-detail.html','dd209e012169','道具固定类型限制','支持类型范围','已记录本期App支持的固定道具类型',['展开道具类型'],'可选项只包含本期已支持的道具类型');
add('admin-system-role-detail.html','e526fd25c280','保存角色为停用','角色停用状态','目标角色存在，其他字段合法',['选择角色状态为停用','点击保存','打开该角色详情'],'角色状态显示停用');
add('admin-account-violation.html','bc718c5754c4','账号举报联合筛选','账号举报条件交集','有用户甲两条不同状态举报及用户乙举报',['输入用户甲ID','选择待处理','点击查询'],'仅显示用户甲待处理的举报');
add('admin-account-violation.html','bc718c5754c4','账号举报打开详情','举报单身份透传','列表两条举报针对不同用户',['点击一条举报的查看'],'进入所选举报单详情');
for(const [page,id,period]of [['admin-data-overview.html','91fd6701b329','所选两日'],['admin-daily-statistics.html','8781b01f2d8b','所选自然日'],['admin-recharge-statistics.html','65f55f1ab8b0','所选自然日']]){
 add(page,id,'成功实付金额汇总','充值金额去向',period+'两笔成功实付10和20USD，另有失败30USD',[],'总充值金额计算结果=10+20=30USD',{calc:calc('成功实付合计',period,'USD',{第一笔:10,第二笔:20},'+',30)});
 add(page,id,'同人充值次数区别人数','充值人数统计口径',period+'同一账号在每一日成功充值两笔',[],page.includes('overview')?'所选两日充值人数汇总显示2人次':'总充值人数显示1人');
}
add('admin-recharge-statistics.html','65f55f1ab8b0','一个用户两笔成功订单','成功订单计数','同一账号当日成功充值2笔、失败1笔',[],'充值订单数显示2笔');
for(const [page,id]of [['admin-data-overview.html','8b7a0351fdf4'],['admin-daily-statistics.html','31d2771015bf']])add(page,id,'注册当天成功充值','新用户充值金额范围','用户甲当日注册且成功充值10USD、乙此前注册当日充值20USD',[],'新用户充值金额显示10USD');
add('admin-daily-statistics.html','31d2771015bf','新用户多笔充值','新充值用户去重','当日注册用户甲成功充值2笔、用户乙仅充值失败',[],'新用户充值人数显示1人');
for(const [label,pre,total]of [['充值赠送','当日成功套餐赠送10和20金币，任务另赠送50金币',30],['系统赠送','当日签到10、任务20、活动30金币，充值套餐另赠送50金币',60]])add('admin-recharge-statistics.html','d4b1fac84335',label+'分类汇总',label+'币源隔离',pre,[],label+'金币显示'+total+'金币');
add('admin-user-activity-statistics.html','b60963ee1f46','注册日与充值日划分新老','老充值用户判定','用户昨日注册、今日首次成功充值',['选择今日','点击查询'],'该用户计入今日老用户充值人数');
for(const [kind,value,ratio,total]of [['普通礼物',100,1,100],['定制礼物',100,1,100],['门票',100,1,100],['幸运礼物',1000,0.01,10]])add('admin-consumption-order-detail-report.html','656f13f679bf',kind+'收益口径',kind+'主播收益','成功'+kind+'消费价值'+value+'金币；幸运赠送时配置比例1%，虚拟金币不计',[],'主播收益计算结果='+value+'×'+ratio+'='+total+'金币',{calc:calc('价值×本类型收益比例','所选成功真实'+kind,'金币',{价值:value,比例:ratio},'*',total)});
add('admin-user-detail.html','62408ea5498f','退款后消费记录继续存在','已完成消费保留','当前用户曾成功赠送普通礼物，随后原充值订单已全额退款',['查看该用户消费记录'],'原成功消费记录仍保留',{flow:'RECHARGE'});
add('admin-host-list.html','1d332a93d537','账号封禁与权限关闭不同','主播账号状态独立','目标主播账号正常，直播权限已关闭',[],'账号状态仍显示正常');
add('admin-violation-types.html','de91d123b531','中文后台类型名称','违规类型显示语言','同一类型四语名称不同且均已配置',[],'列表显示该类型中文名称');
add('admin-guild-recommendation.html','4a4ab5c8a860','编辑推荐后重新读取','推荐更新时间','该推荐上次更新时间早于本次操作',['点击编辑','输入排序权重为2','点击保存','返回列表'],'更新时间更新为本次保存时刻');
add('admin-recharge-package-detail.html','ed49dba31267','套餐排序输入小数','套餐排序整数限制','其他字段有效',['输入排序权重为1,5','点击保存'],'小数排序权重不能保存');
for(const [id,kind]of [['e0ca23f64a01','主播等级'],['295ff7b3ed75','财富等级'],['47e024b25fbc','粉丝等级'],['2fe37a75330f','粉丝团等级']])add('admin-level-config.html',id,'切换'+kind+'配置对象',kind+'阈值归属','四类等级已分别保存不同的2级阈值',['切换'+kind],'2级阈值显示该类型保存值，不使用其他等级类型配置');
add('admin-system-account.html','5a7a4e85264d','账号角色资料核对','后台账号角色归属','两个账号分配不同角色',[],'每行角色对应实际分配给该账号的角色');
add('admin-dashboard.html','COMMON-language','中文后台工作台','后台首期语言','管理员打开一期后台工作台',[],'功能名称及操作文案采用中文');
add('admin-user-list.html','COMMON-admin-field-label','无标签数值的字段提示','字段提示内容','目标用户行有未明确显示字段名的值，已知实际字段名与值',['查看该数值的悬停提示（将鼠标移入该值）'],'提示采用“字段名：值”且对应当前悬停数据');
add('admin-user-detail.html','COMMON-admin-field-label','没有脱敏要求的展示值','默认完整字段值','用户手机号已知，当前字段没有专门脱敏要求',[],'该展示字段保留完整值');
add('admin-gift-list.html','COMMON-admin-review-gray','App审核灰度不改变礼物配置','审核灰度配置隔离','App端已进入上架审核灰度；后台某礼物原为上架',['刷新礼物列表'],'该礼物后台状态仍为上架');
add('admin-gift-detail.html','COMMON-admin-review-gray','单礼物无端内灰度状态','礼物状态范围','当前后台可编辑礼物',['展开礼物状态'],'礼物状态不增加App审核灰度选项');
add('admin-live-management.html','d7c78e90d406','直播中账号封禁后查看场次','封禁后的场次结束','目标主播刚被平台封禁，封禁时存在正在直播的场次',['刷新直播管理列表'],'该场次显示已结束',{flow:'ACCOUNT-REPORT'});
add('admin-placement-detail.html','1545c71e3e17','展示周期只占一个自然日','起止日闭区间','其他展示位字段有效',['选择开始日和结束日均为同一未来日期','点击保存'],'仅包含所选自然日的展示周期可保存');
