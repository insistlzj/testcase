import {test,P1,P2,enter,calculation,pages} from './case-design.mjs';
const g=(page,refs,title,point,pre,steps,result,o=P1)=>test(page,refs,'公会长',title,point,pre,steps,result,o);
for(const [page,ref,field,data,value]of [
 ['guild-switch.html','名称 / 用户 ID','用户ID','当前公会长用户ID为C001，当前公会ID为G001','C001'],
 ['guild-settings.html','公会 ID','公会ID','当前公会长用户ID为C001，当前公会ID为G001','G001'],
 ['guild-join-review-detail.html','姓名：','姓名','申请昵称为QA，实名为张甲','张甲'],
 ['guild-join-review-detail.html','电话：','联系电话','申请联系电话为+628123456789','+628123456789'],
 ['guild-join-review-detail.html','申请公会：','申请公会','该申请目标公会为QA公会','QA公会'],
 ['guild-leave-review-detail.html','退会原因：','退会原因','主播申请填写原因个人安排','个人安排'],
 ['guild-host-detail.html','姓名 / 电话：','认证姓名','主播昵称QA，认证实名张甲','张甲'],
 ['guild-message-detail.html','发送人：','发送人','发送时公会长名称为ChiefA','ChiefA'],
 ['guild-message-detail.html','正文：','正文','发送时消息正文为QA发布内容','QA发布内容'],
 ['guild-operation-accounts.html','不是登录账号','账号ID','运营账号唯一ID9001，登录账号loginQA','9001'],
 ['guild-operation-account-select.html','此处显示登录账号','登录账号','运营账号ID9001，登录账号loginQA','loginQA'],
 ['guild-live-gift-detail.html','不是房间号','场次ID','主播房间号1001，本场ID为S002','S002'],
 ['guild-operation-gift-records.html','本次赠送采用的单件','礼物单价','赠送时单价10，礼物现价20金币','10金币'],
 ['guild-live-gift-detail.html','本次赠送采用的单件','礼物单价','赠送时单价10，礼物现价20金币','10金币'],
])g(page,[ref],`${pages.get(page).name}${field}取正确业务对象`,`${pages.get(page).name}${field}`,[data],[enter(page)],`${field}显示${value}`,P2);
g('guild-notifications.html',['按生成时间倒序排列'],'公会通知按生成时间倒序','公会通知时间排序',['通知甲10点、乙11点生成'],[enter('guild-notifications.html')],'乙排列在甲之前',P2);
g('guild-notification-detail.html',['正文：业务对象、状态变化及处理信息'],'公会通知详情对应选中业务事件','公会通知详情内容',['通知N对应主播甲入会申请被平台驳回'],[enter('guild-notifications.html'),'点击|通知N'],'正文对应甲的该次平台驳回事件',P1);
g('guild-join-review.html',['审核中包含待公会审核和平台审核中'],'入会审核中包含两种待审阶段','公会入会审核中集合',['甲待公会审，乙待平台审，丙已平台通过'],[enter('guild-join-review.html'),'切换|审核中'],'列表仅包含甲和乙',P1);
g('guild-join-review.html',['驳回区分公会驳回、平台驳回'],'入会驳回列表区分平台驳回','公会入会驳回阶段',['申请A公会通过后被平台驳回'],[enter('guild-join-review.html'),'切换|已驳回'],'申请A状态显示平台驳回',P1);
g('guild-join-review-detail.html',['未发生不显示'],'未完成的平台审核不显示处理时间','入会未来审核节点时间',['公会已通过，平台待审核'],[enter('guild-join-review-detail.html')],'平台审核节点不显示处理完成时间',P2);
g('guild-leave-review-detail.html',['已处理后显示本次审核时间'],'退会详情显示本次处理时间','退会审核时间',['退会申请9月15日提交，9月16日10:00审核通过'],[enter('guild-leave-review-detail.html')],'处理时间对应9月16日10:00',P2);
g('guild-member-list.html',['默认在会'],'主播列表默认当前在会','公会主播默认分类',[],[enter('guild-member-list.html')],'默认选中在会',P2);
g('guild-member-list.html',['按加入时间倒序'],'主播列表按本次加入时间排序','公会成员加入排序',['甲9月1日加入，乙9月10日加入'],[enter('guild-member-list.html')],'乙排列在甲之前',P2);
for(const [page,word]of [['guild-member-list.html','搜索：'],['guild-host-list.html','搜索：'],['guild-host-select.html','搜索：'],['guild-violation-host-select.html','搜索：']])g(page,[word],`${pages.get(page).name}按主播ID查找`,`${pages.get(page).name}ID搜索`,['当前公会主播甲ID1001，乙ID1002'],[enter(page),'输入|搜索框|为1001'],'结果仅显示甲',P2);
for(const page of ['guild-host-list.html','guild-host-summary.html','guild-host-detail.html','guild-income-day-detail.html'])g(page,['主播等级：'],`${pages.get(page).name}主播等级不混用财富等级`,`${pages.get(page).name}主播等级`,['已生效主播等级门槛为1级0、2级100、3级300、4级1000金币；主播累计获得普通礼物真实收益300金币，另收到运营虚拟赠礼1000金币；财务已上传分成50USD；当前财富等级5'],[enter(page)],'主播等级显示3',{...P1,extra:[['admin-level-config.html','累计值大于或等于门槛']]});
for(const page of ['guild-host-list.html','guild-host-summary.html'])g(page,['退会标记'],`${pages.get(page).name}保留退会标识`,`${pages.get(page).name}退会标识`,['该主播有历史业绩且已退出当前公会'],[enter(page)],'该主播显示“退会”标记',P2);
for(const live of [true,false])g('guild-host-summary.html',['未开播时隐藏'],`主播${live?'在播':'未开播'}的实时标记`,'公会主播实时状态',[`目标主播当前${live?'正在直播':'未开播'}`],[enter('guild-host-summary.html')],live?'显示直播中标记':'不显示直播中标记',P2);
for(const field of ['本人照片','证件正面','证件反面'])g('guild-host-detail.html',['可分别查看大图'],`公会查看主播认证${field}`,`主播认证${field}详情`,[`主播认证材料包含${field}图片A`],[enter('guild-host-detail.html'),`点击|${field}`],'打开所选认证图片大图',P2);
g('guild-host-detail.html',['直播次数：累计完成'],'主播主页直播次数排除进行中场次','公会主播已完成直播次数',['已完成2场，另1场当前在播'],[enter('guild-host-detail.html')],'直播次数显示2',P1);
g('guild-host-detail.html',['全部已完成直播场次时长总和'],'主播主页时长仅累计已完成场次','公会主播历史直播时长',['已完成两场分别60分钟和90分钟，另有进行中场次20分钟'],[enter('guild-host-detail.html')],'直播时长显示2小时30分钟',P1);
g('guild-host-detail.html',['直播间违规和账号违规记录总数'],'主播主页违规统计包含两类','公会主播累计违规范围',['该主播直播间违规2条、账号违规1条'],[enter('guild-host-detail.html')],'累计违规显示3',P1);
g('guild-host-detail.html',['按提交时间倒序展示'],'主播申请记录按提交时间排序','主播申请记录顺序',['入会申请9月1日，退会申请9月15日'],[enter('guild-host-detail.html')],'退会申请排列在入会申请之前',P2);
g('guild-messages.html',['记录数量：'],'公会运营消息数量随日期筛选','公会消息筛选数量',['9月15日2条，9月16日1条发送记录'],[enter('guild-messages.html'),'选择|自定义日期|为9月15日'],'记录数量显示2',P1);
g('guild-messages.html',['点击消息记录'],'运营消息列表进入对应详情','公会消息详情入口',['列表存在消息A和B'],[enter('guild-messages.html'),'点击|消息B'],'详情为消息B',P2);
g('guild-message-compose.html',['发送前再次确认'],'全体主播消息确认显示接收人数','公会消息确认人数',['当前公会2名在会主播，1名已退会'],[enter('guild-message-compose.html'),'选择|对象类型|为全体主播','填写|文字内容|为QA通知','点击|发送'],'确认接收人数为2',P1);
for(const image of [true,false])g('guild-message-detail.html',['无图片时不显示'],`${image?'有':'无'}附图的公会消息详情`,'公会消息附图显示',[`已发送消息${image?'附带图片A':'没有附图'}`],[enter('guild-message-detail.html')],image?'显示发送时图片A':'不显示附图',P2);
g('guild-operation-accounts.html',['创建 -> 新建账号'],'公会运营账号列表进入创建页','运营账号创建入口',[],[enter('guild-operation-accounts.html'),'点击|创建'],'进入创建运营账号页',P2);
for(const [page,field,ref,total]of [
 ['guild-operation-accounts.html','本月已发放','本月已发放：',300],
 ['guild-operation-account-detail.html','本月发放','本月发放：',300],
 ['guild-operation-accounts.html','本月累计消费','本月累计消费：',100],
 ['guild-operation-account-detail.html','本月消费','本月消费：',100],
 ['guild-operation-account-detail.html','累计消费','累计消费：',150],
])g(page,[ref],`${pages.get(page).name}${field}按指定范围统计`,`${pages.get(page).name}${field}`,['公会仅当前一个运营账号，本月成功发放300金币，上月500金币；本月成功送礼100金币、失败20金币，上月成功消费50金币'],[enter(page)],`${field}显示${total}金币`,P1);
g('guild-operation-account-detail.html',['较小值'],'已建运营账号发放上限取双额度小值','运营账号追加发放上限',['账号剩余100金币，公会剩余50金币'],[enter('guild-operation-account-detail.html')],'可发上限显示50金币',P1);
g('guild-operation-account-select.html',['搜索结果数和所有已选账号数'],'搜索后已选数量不等于搜索结果数','运营账号已选统计',['先选甲乙2人，搜索仅命中甲'],[enter('guild-operation-account-select.html'),'输入|搜索框|为甲'],'已选数量仍为2',P1);
g('guild-operation-account-select.html',['登录账号模糊匹配'],'运营多选页支持登录账号搜索','运营账号登录名检索',['甲登录账号opsQA01，乙other01'],[enter('guild-operation-account-select.html'),'输入|搜索框|为opsQA'],'结果仅显示甲',P2);
for(const f of ['JPG','PNG','WebP'])g('guild-profile.html',['公会 Logo：'],`公会Logo上传${f}`,'公会Logo格式',[`本地存在有效qa.${f.toLowerCase()}图片`],[enter('guild-profile.html'),`上传|公会Logo|选择qa.${f.toLowerCase()}`,'点击|保存'],'公会Logo更新为所选图片',P2);
g('guild-password.html',['必须与新密码一致'],'公会改密确认密码必须一致','公会确认密码匹配',['旧密码有效，新密码QaNew!2026满足长度'],[enter('guild-password.html'),'填写|当前密码|为原正确密码','填写|新密码|为QaNew!2026','填写|确认新密码|为QaOther!2026','点击|保存'],'不能保存两次不一致的新密码',P1);
for(const field of ['当前密码','确认新密码'])g('guild-password.html',[`${field}：`],`公会改密${field}不能为空`,`公会${field}必填`,['其他密码字段完整有效'],[enter('guild-password.html'),`清空|${field}`,'点击|保存'],'不能提交缺少必填项的改密',P1);
const datePages=[['guild-host-list.html','今日'],['guild-host-data.html','今日'],['guild-messages.html','本月'],['guild-operation-account-detail.html','本月'],['guild-share-ledger.html','本月']];
for(const [page,defaultValue]of datePages){
 if(page!=='guild-operation-account-detail.html')g(page,[`默认${defaultValue}`],`${pages.get(page).name}默认日期周期`,`${pages.get(page).name}默认周期`,[],[enter(page)],`默认周期为${defaultValue}`,P2);
 for(const side of ['开始日','结束日'])g(page,['包含开始日和结束日'],`${pages.get(page).name}包含${side}记录`,`${pages.get(page).name}日期${side}边界`,[`日期范围9月1日至9月15日，${side}存在业务记录A，范围外存在B`],[enter(page),'选择|自定义日期|为9月1日至9月15日'],'筛选结果包含记录A',P1);
}
g('guild-host-data.html',['至少完成 1 场直播的去重主播数'],'直播记录汇总开播人数去重','公会直播记录开播人数',['甲完成2场乙完成1场，范围已包含'],[enter('guild-host-data.html')],'开播人数显示2',P1);
g('guild-host-data.html',['创建的直播场次总数'],'直播记录场次数包含每次开播','公会直播记录场次数',['甲创建2场，乙创建1场，其中一场正在直播'],[enter('guild-host-data.html')],'直播场次显示3',P1);
g('guild-live-gift-detail.html',['页面未展示用户等级'],'赠礼详情不显示未定义用户等级','公会赠礼用户资料范围',['场次有真实用户送礼记录'],[enter('guild-live-gift-detail.html'),'点击|送礼记录'],'详情不显示用户等级',P2);
g('guild-all-violations.html',['按该时间倒序'],'公会账号违规按发生时间排序','公会违规时间排序',['账号违规甲10点、乙11点，当前选择账号违规'],[enter('guild-all-violations.html')],'乙排列在甲之前',P2);
g('guild-all-violations.html',['未选择时提示选择主播'],'违规筛选未选择主播提示','公会违规主播筛选必选',['主播选择清空'],[enter('guild-all-violations.html')],'提示选择主播',P2);
g('guild-income-day-detail.html',['非今日显示历史标记'],'查看往日经营数据标记历史','公会每日历史标记',['当前目标日期为昨天'],[enter('guild-income-day-detail.html')],'显示历史标记',P2);
g('guild-share-ledger.html',['系统不在线计算或审批最终分成'],'公会主播分成不提供线上审批','公会主播分成只读范围',[],[enter('guild-share-ledger.html')],'不提供分成计算或审批操作',P1);
g('guild-operation-account-compose.html',['名称：'],'运营账号名称可以完整输入30字符','运营名称长度上边界',['已登录公会长账号，打开创建运营账号页'],['填写|名称|为30个连续大写A','查看|名称输入框'],'名称输入框完整保留30个A',P1);
g('guild-settings.html',['清除会话'],'退出公会后旧会话不能访问受保护页面','公会退出会话失效',['已登录公会长账号；账号设置页可操作'],[enter('guild-settings.html'),'点击|退出登录','点击|确认退出',enter('guild-profile.html'),'刷新|公会资料页面'],'未重新登录时不能读取受保护的公会资料',{...P1,observe:'guild-profile.html',extra:[['guild-profile.html','公会 ID：']]});
g('guild-leave-review-detail.html',['主播可重新申请','申请状态：'],'退会驳回后新申请进入公会审核','退会重申审核入口',['已登录公会长账号；主播甲在会，其退会申请A已被驳回','环境准备要求：甲在用户端重新提交退会申请B'],[enter('guild-leave-review.html'),'点击|甲的新退会申请B'],'B显示待审核',{...P1,extra:[['guild-leave-review.html','点击申请卡片']]});
g('guild-operation-gift-records.html',['支持多选运营账号和今日'],'运营送礼记录提供全部日期选项','运营赠礼日期选项',['已登录公会长账号'],[enter('guild-operation-gift-records.html'),'点击|日期筛选'],'可选今日、昨日、本周、上周、本月、上月、自定义',P2);
for(const [point,result]of [['送礼列表','列表仅包含9月15日的记录A'],['送礼次数','总送礼次数显示1'],['消费金币','总消费金币显示30金币']])g('guild-operation-gift-records.html',['筛选变化 -> 刷新汇总和列表','总送礼次数：','总消费金币：'],`运营送礼日期变化更新${point}`,`运营日期筛选${point}`,['已登录公会长账号；运营账号O001于9月15日成功送礼A，单价10金币数量3件；9月16日成功送礼B，单价20金币数量2件；没有其他记录'],[enter('guild-operation-gift-records.html'),'选择|自定义日期|为9月15日至9月15日'],result,P1);
g('guild-message-compose.html',['发送 -> 校验必填项','指定 1 名当前公会主播'],'指定主播消息未选收件人不能发送','运营消息收件人必填',['已登录公会长账号；未选择任何接收主播'],[enter('guild-message-compose.html'),'选择|对象类型|为指定主播','填写|文字内容|为QA通知','点击|发送'],'不能发送未指定接收主播的消息',P1);
for(const [page,point,result]of [['guild-live-gift-detail.html','历史消费','场次S1仍显示成功赠礼记录R1'],['guild-host-data.html','历史收益','场次S1收益仍为100金币']])g(page,[page==='guild-host-data.html'?'场次结束后消息、消费、处置和收益记录继续保留':'一行一笔赠送记录'],`直播结束后公会保留${point}`,`场次结束${point}留存`,['已登录公会长账号；本公会主播甲的场次S1收到真实用户普通赠礼R1，成功消费100金币，无其他收益','甲已主动结束S1'],[enter(page),'查看|甲的场次S1'],result,{...P1,extra:[['guild-host-data.html','场次结束后消息、消费、处置和收益记录继续保留']]});
g('guild-host-summary.html',['未开播时隐藏'],'平台封禁主播后公会在播标记消失','封禁后公会在播状态',['已登录公会长账号，甲原先正在直播','环境准备要求：平台管理员封禁甲的账号且处理成功'],[enter('guild-host-summary.html')],'甲不显示直播中标记',{...P1,extra:[['guild-all-violations.html','账号封禁']]});
g('guild-host-summary.html',['未开播时隐藏'],'平台仅警告后公会仍显示在播','警告后公会在播状态',['已登录公会长账号，甲正在直播','环境准备要求：平台对甲当前场次执行警告，未执行关闭场次或关闭权限'],[enter('guild-host-summary.html')],'甲仍显示直播中标记',{...P1,extra:[['guild-all-violations.html','警告不结束直播']]});
for(const event of ['礼物下架','充值退款','充值拒付'])g('guild-live-gift-detail.html',['礼物收益：'],`${event}不清除公会历史赠礼收益`,`公会${event}收益保留`,['已登录公会长账号；主播甲S1仅收到普通礼物真实消费100金币，收益已形成',`环境准备要求：由平台及支付测试环境对该笔${event==='礼物下架'?'礼物执行下架':'充值订单模拟'+event}并确认处理完成`],[enter('guild-live-gift-detail.html'),'查看|S1礼物收益'],'S1礼物收益仍为100金币',{...P1,commonEvidence:[event==='礼物下架'?'- 礼物下架后不能继续赠送，已完成的赠送、开奖、消费和结算记录继续保留。':'- 已消费完成的礼物和门票不因充值订单退款或拒付而撤销，对应主播收益和分成不受影响。']});
g('guild-host-data.html',['本场计入主播收益的金币'],'公会场次收益排除虚拟失败和撤销消费','场次收益有效消费范围',['已登录公会长账号；S1普通礼物真实成功消费100金币、运营虚拟消费200金币','环境准备要求：另准备失败消费300金币和未成功结算即撤销的消费400金币，不是已完成礼物退款'],[enter('guild-host-data.html'),'查看|S1收益'],'S1收益显示100金币',{...P1,commonEvidence:['- 虚拟金币消费、失败或撤销的消费不计入主播收益。']});

g('guild-join-review.html',['同时只能有一笔待处理入会申请'],'同一用户只保留一笔待处理入会申请','入会申请待处理唯一性',['用户U001已向当前公会提交待处理申请A；环境准备要求：U001再次提交入会申请'],[enter('guild-join-review.html'),'切换|审核中'],'U001仅显示申请A一笔待处理记录',P1);
g('guild-leave-review-detail.html',['失去主播身份'],'公会通过退会后主播身份失效','退会通过主播身份',['主播甲退会申请待审核且当前在会'],[enter('guild-leave-review-detail.html'),'点击|通过','点击|确认',enter('guild-host-detail.html')],'甲不显示主播管理入口',{...P1,observe:'guild-host-detail.html',extra:[['guild-host-detail.html','已退会显示【退会】']],flow:'FLOW-GUILD-LEAVE'});
g('guild-leave-review-detail.html',['保留主播身份和公会关系'],'公会驳回退会后保留主播身份','退会驳回主播身份',['主播甲退会申请待审核且当前在会'],[enter('guild-leave-review-detail.html'),'点击|驳回','点击|确认',enter('guild-host-detail.html')],'甲仍显示主播管理入口',{...P1,observe:'guild-host-detail.html',extra:[['guild-host-detail.html','管理操作均需确认']]});
g('guild-host-detail.html',['禁止再次开播'],'公会关闭直播权限后不产生新场次','公会关权开播拦截',['主播甲直播权限已由公会关闭；环境准备要求：甲在用户端再次尝试开播'],[enter('guild-host-detail.html'),'点击|主播数据'],'甲没有新增直播场次',{...P1,observe:'guild-host-data.html',extra:[['guild-host-data.html','每次开播创建一个新场次']]});
g('guild-operation-account-compose.html',['最多30字符'],'运营账号登录名30字符可创建','运营登录名长度上边界',['其他必填字段有效且登录名全平台唯一'],[enter('guild-operation-account-compose.html'),'填写|账号|为30个连续小写a','填写|初始密码|为Qa1234','点击|确认创建'],'成功创建该运营账号',P1);
g('guild-operation-account-compose.html',['至少 6 位'],'运营账号初始密码6位可创建','运营初始密码长度下边界',['其他必填字段有效且账号唯一'],[enter('guild-operation-account-compose.html'),'填写|初始密码|为Qa1234','点击|确认创建'],'成功创建运营账号',P1);
g('guild-operation-account-compose.html',['账号状态：默认启用'],'创建时选择禁用状态','运营初始禁用状态',['其他必填字段有效且账号唯一'],[enter('guild-operation-account-compose.html'),'选择|账号状态|为禁用','点击|确认创建',enter('guild-operation-account-detail.html')],'账号状态显示禁用',{...P1,observe:'guild-operation-account-detail.html',extra:[['guild-operation-account-detail.html','启用或禁用']]});
for(const amount of [0,100])g('guild-operation-account-compose.html',['非负且不超过本次可发额度'],`初始发放${amount}金币边界可创建`,'初始虚拟金币合法边界',['本次可发额度100金币，其他必填字段有效且账号唯一'],[enter('guild-operation-account-compose.html'),`填写|发放金币|为${amount}`,'点击|确认创建'],`账户余额显示${amount}金币`,P1);
g('guild-operation-account-compose.html',['资金来源为所属公会'],'创建运营账号扣减本公会发放额度','运营初始金币资金来源',['当前公会本月剩余可发100金币，其他必填字段有效且账号唯一'],[enter('guild-operation-account-compose.html'),'填写|发放金币|为30','点击|确认创建',enter('guild-operation-accounts.html')],'本月剩余可发减少30金币',{...P1,observe:'guild-operation-accounts.html',extra:[['guild-operation-accounts.html','本月剩余可发']]});
for(const [attempt,result]of [['登录','该运营账号不能完成登录'],['送礼','送礼记录不新增该次记录']])g('guild-operation-account-detail.html',['禁用后不可登录或送礼'],`禁用运营账号不能${attempt}`,`运营账号禁用${attempt}限制`,[`运营账号O001已禁用；环境准备要求：O001尝试${attempt}`],[enter('guild-operation-account-detail.html'),...(attempt==='送礼'?['点击|送礼记录']:[])],result,P1);
g('guild-operation-account-detail.html',['启停或发放成功后刷新指标'],'禁用运营账号后刷新状态','运营账号启停刷新',['运营账号O001当前启用'],[enter('guild-operation-account-detail.html'),'关闭|账号状态','点击|确认'],'启用状态刷新为禁用',P1);
g('guild-live-gift-detail.html',['点击送礼记录 -> 查看送礼详情'],'公会场次点击送礼记录打开详情','场次送礼详情入口',['场次S1存在送礼记录R1'],[enter('guild-live-gift-detail.html'),'点击|送礼记录R1'],'打开R1送礼详情',P2);
g('guild-live-gift-detail.html',['返回时保留主播和日期筛选条件'],'送礼详情返回保留主播筛选','送礼详情返回主播条件',['从主播甲、9月15日筛选结果进入S1送礼记录R1'],[enter('guild-live-gift-detail.html'),'点击|送礼记录R1','点击|返回'],'主播筛选仍为甲',P2);
for(const [point,result]of [['当前场次结束','S1显示已结束'],['历史场次保留','S0历史记录仍可查看']])g('guild-all-violations.html',['关闭场次仅结束当前直播'],`平台关闭场次后${point}`,`关闭场次${point}`,['主播甲场次S1在播且历史S0已结束；环境准备要求：平台对S1执行关闭场次'],[enter('guild-all-violations.html'),enter('guild-host-data.html')],result,{...P1,observe:'guild-host-data.html',extra:[['guild-host-data.html','每次开播创建一个新场次']],flow:'FLOW-LIVE-CLOSE'});
g('guild-all-violations.html',['关闭直播权限立即结束当前直播并阻止再次开播'],'平台关闭直播权限后公会不见新场次','平台关权影响',['主播甲原S1在播；环境准备要求：平台关闭甲直播权限后，甲再次尝试开播'],[enter('guild-all-violations.html'),enter('guild-host-data.html')],'S1结束且没有新增直播场次',{...P1,observe:'guild-host-data.html',extra:[['guild-host-data.html','每次开播创建一个新场次']]});
g('guild-all-violations.html',['账号封禁后当前会话下线'],'平台封禁主播后会话下线','账号封禁会话',['主播甲原账号在线；环境准备要求：平台封禁甲账号'],[enter('guild-all-violations.html'),enter('guild-host-detail.html')],'甲账号状态显示封禁且不再在线',{...P1,observe:'guild-host-detail.html',extra:[['guild-host-detail.html','当前主播账号']]});
for(const [view,result]of [['日数据','汇总、日趋势和日列表均切换为日数据'],['月数据','汇总、月趋势和月列表均切换为月数据']])g('guild-income.html',['切换统计粒度并更新汇总、趋势和列表'],`公会业绩切换${view}`,`公会业绩${view}联动`,['已准备日、月统计结果且数值不同'],[enter('guild-income.html'),`切换|${view}`],result,P1);
g('guild-operation-accounts.html',['不对应真实用户'],'运营账号列表不进入真实用户资料','运营账号与真实用户分离',['公会已创建运营账号O001'],[enter('guild-operation-accounts.html'),'点击|O001'],'进入运营账号主页而不是用户资料页',{...P1,observe:'guild-operation-account-detail.html',extra:[['guild-operation-account-detail.html','当前运营账号资料']]});
g('guild-operation-account-detail.html',['不能加入粉丝团'],'运营账号主页不提供粉丝团关系','运营账号粉丝团限制',['运营账号O001已创建'],[enter('guild-operation-account-detail.html')],'不显示粉丝团加入或团籍操作',P1);
for(const action of ['充值','任务领取'])g('guild-operation-account-detail.html',['不能充值或通过任务获得'],'运营账号不提供'+action,'运营账号'+action+'限制',['运营账号O001已创建且启用'],[enter('guild-operation-account-detail.html')],`不显示${action}入口`,P1);
g('guild-operation-account-detail.html',['运营账号没有真实金币'],'运营账号余额仅为虚拟金币账户','运营账号金币账户类型',['运营账号O001累计发放100、消费30'],[enter('guild-operation-account-detail.html')],'账户余额显示70虚拟金币',P1);
g('guild-operation-account-detail.html',['没有真实金币'],'运营账号不提供真实金币转换','虚拟真实金币隔离',['运营账号O001余额70虚拟金币'],[enter('guild-operation-account-detail.html')],'不显示虚拟金币与真实金币互转操作',P1);
for(const gift of ['普通礼物','定制礼物'])g('guild-operation-gift-records.html',['仅可用于赠送普通礼物和定制礼物'],`运营账号成功赠送${gift}`,`运营${gift}可用`,[`运营账号O001余额100金币；环境准备要求：O001成功赠送单价10金币的${gift}1件`],[enter('guild-operation-gift-records.html')],`送礼记录新增${gift}消费10金币`,P1);
for(const item of ['幸运礼物','装扮','门票'])g('guild-operation-gift-records.html',['不能赠送幸运礼物，不能购买装扮、门票'],`运营账号不能消费${item}`,`运营${item}限制`,[`运营账号O001余额100金币；环境准备要求：O001尝试消费${item}`],[enter('guild-operation-gift-records.html')],`送礼记录不新增${item}成功消费`,P1);
g('guild-operation-gift-records.html',['不计入主播收益或分成'],'运营账号送礼不增加主播收益','运营赠礼收益排除',['主播甲原收益100金币；环境准备要求：运营账号O001成功赠送普通礼物20金币'],[enter('guild-operation-gift-records.html'),enter('guild-host-data.html')],'主播甲收益仍为100金币',{...P1,observe:'guild-host-data.html',extra:[['guild-host-data.html','本场计入主播收益的金币']],flow:'FLOW-VIRTUAL-GIFT'});
