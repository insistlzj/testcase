import {test,ref,page} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
const t=(k,w,l,g,s,e,x={})=>test(k,w,l,g,[`打开${page(k).entry}`,...s],e,{role:'平台管理员',...x});
const forms=[
 ['admin-gift-detail.html','礼物A：唯一ID已生成，四语名称分别为礼物A/Gift A/Hadiah A/Hadiah A、图标A、单价10、排序1'],
 ['admin-lucky-gift-detail.html','幸运礼物A：唯一ID已生成，四语名称均为Gift A、图标A、单次消耗100、开奖次数1、奖励0和100各50%，RTP已自动验证'],
 ['admin-prop-detail.html','道具A：唯一ID已生成，四语名称均为Prop A、有效头像框类型、图标A、类型要求的素材A、排序1'],
 ['admin-task-detail.html','任务A：四语名称均为Task A，登录动作及对应连续登录天数指标、阈值1奖励20金币、生效区间2026-09-14至2026-10-14'],
 ['admin-live-type.html','类型A：四语名称分别为类型A/Type A/Jenis A/Jenis A，状态启用'],
 ['admin-push-detail.html','未发送推送A：四语标题均为Title A、四语正文均为Content A，目标为有效公会G']
];
for(const [k,fixture]of forms)for(const lang of ['中文','英文','印尼语','马来语']){
 const word=page(k).rules.some(r=>r.text.startsWith('四语名称'))?'四语名称':k.includes('lucky')?'四语名称':k.includes('push')?'四语标题':'四语名称';
 t(k,word,`${page(k).name}缺少${lang}名称`,[fixture],k.includes('live-type')?['点击类型A“编辑”',`清空${lang}名称`,'点击“保存”']:[`清空${lang}${k.includes('push')?'标题':'名称'}`,k.includes('push')?'点击“立即发送”':'点击“保存”'],k.includes('push')?'不发送缺少标题的推送':`不保存缺少${lang}名称的配置`,{point:'四语必填'});
}
for(const [k,field,word,base,valid]of [
 ['admin-gift-detail.html','单价','单价：',forms[0][1],n=>Number.isInteger(n)&&n>0],
 ['admin-lucky-gift-detail.html','单次消耗','单次消耗：',forms[1][1],n=>Number.isInteger(n)&&n>0],
 ['admin-lucky-gift-detail.html','开奖次数','开奖次数：',forms[1][1],n=>Number.isInteger(n)&&n>0],
 ['admin-lucky-gift-detail.html','奖励金币','奖励金币：',forms[1][1],n=>Number.isInteger(n)&&n>=0],
 ['admin-recharge-package-detail.html','销售价格','销售价格：','已有常规套餐A，封面A、基础100金币、赠送10金币、销售价格1 USD，排序1',n=>n>0&&Number.isInteger(n*100)],
 ['admin-recharge-package-detail.html','充值金币','充值 / 赠送金币：','已有常规套餐A，封面A、基础100金币、赠送10金币、销售价格1 USD，排序1',n=>Number.isInteger(n)&&n>0],
 ['admin-recharge-package-detail.html','赠送金币','充值 / 赠送金币：','已有常规套餐A，封面A、基础100金币、赠送10金币、销售价格1 USD，排序1',n=>Number.isInteger(n)&&n>=0],
 ['admin-ticket-price-level-detail.html','门票价格','门票价格：','已有门票档位A价格100、排序1；另有启用档位B价格200',n=>Number.isInteger(n)&&n>0],
 ['admin-ticket-price-level-detail.html','排序','排序：','已有门票档位A价格100、排序1；另有启用档位B价格200',n=>Number.isInteger(n)&&n>0],
 ['admin-guild-recommendation-detail.html','排序权重','排序权重：','有效公会G尚未推荐；已在新增推荐表单选择公会G',n=>Number.isInteger(n)&&n>0]
])for(const n of field==='销售价格'?[-1,0,0.01,1.001]:[-1,0,1,1.5])t(k,word,`${page(k).name}${field}为${n}`,[base],[`输入${field}“${n}”`,'点击“保存”'],valid(n)?`${field}保存为${n}`:`不保存${field}的非法值${n}`,{point:field+'边界',dimension:'输入边界'});
for(const rate of [-1,0,1,100,101])t('admin-lucky-gift-config.html','校验 0% 至 100%',`幸运礼物收益比例${rate}%`,['当前全局比例1%'],['点击比例“编辑”',`输入比例“${rate}”`,'点击“保存”'],rate>=0&&rate<=100?`全局比例保存为${rate}%`:'不保存超出0%至100%的比例',{point:'全局比例范围',dimension:'输入边界'});
for(const sum of [99,100,101])t('admin-lucky-gift-detail.html','合计必须等于 100%',`幸运礼物概率合计${sum}%`,['已有礼物A，单次消耗100、开奖1次、四语名称图标完整；奖励0与100两个不重复档位'],['输入奖励0的概率“50”',`输入奖励100的概率“${sum-50}”`,'点击“保存”'],sum===100?'配置保存成功':'配置不能生效',{point:'概率总和',dimension:'输入边界'});
t('admin-lucky-gift-detail.html','档位不可重复','重复奖励档位',['已有礼物A，两个档位奖励0与100，各概率50%'],['输入第二档奖励金币“0”','点击“保存”'],'不保存重复奖励档位',{point:'奖档唯一性'});
t('admin-lucky-gift-detail.html','单价 = 开奖次数','幸运礼物单价计算',['单次消耗100金币、开奖次数10，其他字段有效'],['查看单价'],'单价=1000',{point:'幸运单价公式',calc:calculation('*',[100,10],['单次消耗','开奖次数'],'金币')});
for(const [p0,p100,rtp]of [[50,50,50],[0,100,100],[100,0,0]])t('admin-lucky-gift-detail.html','RTP：',`RTP期望值${rtp}%`,['单次消耗100金币、开奖1次，奖励金币档位0和100'],[`输入零奖励概率“${p0}”`,`输入100金币奖励概率“${p100}”`,'查看RTP'],`RTP显示${rtp}%`,{point:'RTP概率加权'});
t('admin-lucky-gift-detail.html','向上取整至一位小数','RTP向上取一位小数',['单次消耗3金币；奖励1金币概率100%'],['查看RTP'],'RTP显示33.4%',{point:'RTP取整'});
for(const copies of [1,10,100])t('admin-lucky-gift-detail.html','批量购买','批量购买'+copies+'份RTP不二次除数量',[`单价100金币、奖励0与100各50%；购买份数${copies}`],['查看RTP'],'RTP显示50%',{point:'RTP与份数独立'});
for(const [k,word,timefield]of [['admin-gift-detail.html','失效时间晚于生效时间','失效时间'],['admin-recharge-package-detail.html','结束晚于开始','结束时间'],['admin-task-detail.html','结束晚于开始','结束时间']])for(const end of ['2026-09-13 10:00','2026-09-14 10:00','2026-09-15 10:00'])t(k,word,`${page(k).name}结束时间${end}`,['已有配置A，开始时间2026-09-14 10:00；礼物为定制类型或套餐为活动类型；其余必填字段保留已保存值'],[`输入${timefield}“${end}”`,'点击“保存”'],end>'2026-09-14 10:00'?'保存新的有效期':'不保存结束不晚于开始的有效期',{point:'时间顺序',dimension:'输入边界'});
for(const k of ['admin-gift-detail.html','admin-prop-detail.html'])t(k,'编辑',`${page(k).name}已有ID只读`,['打开已创建的记录A，ID已记录'],['查看ID输入区'],'ID不可修改',{point:'标识不可变'});
for(const n of [0,1,5,6])t('admin-placement-detail.html','最少 1 项、最多 5 项',`轮播素材数量${n}`,[`已有一条配置，包含${Math.min(Math.max(n,1),5)}项有效图片及有效App目标页`],n===0?['点击唯一一项“删除”']:n===6?['点击“添加”']:['点击“保存”'],n===0?'唯一一项不可删除':n===6?'不能添加第6项':`保存${n}项轮播内容`,{point:'轮播项数量',dimension:'输入边界'});
for(const saved of [true,false])t('admin-placement-detail.html','删除已保存项须确认',`删除${saved?'已保存':'未保存'}轮播项`,['配置当前有2项；第二项'+(saved?'已经保存':'刚添加尚未保存')],['点击第二项“删除”'],saved?'展示删除确认弹窗':'第二项立即移除',{point:'删除确认边界'});
t('admin-placement-detail.html','当前序号轮播','轮播拖动排序',['当前轮播顺序为素材A、B、C，各项素材目标完整'],['拖动素材C至第一位','点击“保存”'],'保存顺序为C、A、B',{point:'素材排序'});
for(const samePosition of [true,false])t('admin-placement-config.html','有效时间不得重叠',`${samePosition?'同':'不同'}展示位相交周期`,['已有启用广场运营位A展示9月14日至16日；待保存配置B展示9月16日至18日'],['点击“新增”',`选择展示位置“${samePosition?'直播广场运营位':'福利中心轮播位'}”`,'上传素材B','选择有效App目标页','输入展示周期2026-09-16至2026-09-18','点击“保存”'],samePosition?'不保存重叠周期的同位置配置':'保存配置B',{point:'排期冲突'});
for(const lang of ['中文','英文','印尼语','马来语'])for(const field of ['标题','正文']){const max=lang==='中文'?(field==='标题'?40:120):(field==='标题'?80:240);for(const n of [max,max+1])t('admin-push-detail.html','中文标题最多',`${lang}${field}${n}字`,[forms[5][1]],[`输入由${n}个“测”组成的${lang}${field}`,'查看输入框'],`输入内容不超过${max}字`,{point:'推送文案长度',dimension:'输入边界'});}
t('admin-push-detail.html','当前页只读','推送成功后禁止再编辑',[forms[5][1]],['点击“立即发送”','查看文案和目标用户编辑区'],'当前推送任务只读',{point:'已发送终态'});
for(const values of [[],[1],[1,1],[0,1],[-1,1],[1,1.5],[1,10,100]])t('admin-gift-send-count-rule-detail.html','互不重复的正整数',`赠送数量集合${values.join('、')||'空'}`,['编辑数量规则A，关联礼物G没有其他启用规则'],['清空赠送数量',...values.map(v=>`输入并添加赠送数量“${v}”`),...(values.includes(1)?['选择默认数量1']:[]),'点击“保存”'],values.length&&new Set(values).size===values.length&&values.every(v=>Number.isInteger(v)&&v>0)?'保存数量规则':'不保存非法数量集合',{point:'赠送数量集合'});
t('admin-gift-send-count-rule-detail.html','礼物只能关联一条启用规则','同礼物启用规则冲突',['礼物G已关联启用规则A；正在编辑另一规则B，数量1默认1'],['选择礼物G','选择启用状态','点击“保存”'],'规则B不能启用',{point:'礼物关联唯一'});
t('admin-ticket-price-level.html','最后一个启用档位不能停用','最后有效门票档位保护',['全平台只剩价格100档位A启用'],['点击档位A“停用”'],'档位A保持启用',{point:'末个档位保护'});
t('admin-ticket-price-level-detail.html','不能与已有档位重复','门票价格重复',['已有档位A价格100，当前编辑B价格200'],['输入门票价格“100”','点击“保存”'],'不保存重复价格100',{point:'票价唯一性'});
for(const type of ['主播等级','财富等级','粉丝等级','粉丝团等级'])t('admin-level-config.html','四个 Tab 独立',`${type}未保存值切换保留`,['当前'+type+'等级1的金币值10，已记录原图A'],[`点击“${type}”`,'输入等级1金币值“20”','点击另一等级Tab',`点击“${type}”`],'等级1金币值仍为20',{point:'等级草稿隔离'});
for(const value of [0,-1,1,1.5])t('admin-level-config.html','等级为不重复的正整数',`等级编号${value}`,['当前Tab只有等级2、金币值100'],['点击“新增等级”',`输入等级“${value}”`,'输入金币值“0”','点击“保存”'],value===1?'保存等级1':'不保存非法等级编号',{point:'等级编号边界',dimension:'输入边界'});
for(const scene of ['公屏','私信','昵称','动态'])t('admin-sensitive-words-detail.html','使用场景：',`敏感词应用于${scene}`,['正在新增词条测试词A，包含匹配、分类辱骂攻击、替换内容***、状态启用'],[`选择使用场景“${scene}”`,'点击“保存”'],`保存使用场景${scene}`,{point:'敏感词场景'});
t('admin-sensitive-words-detail.html','至少选择 1 个','敏感词无使用场景',['已有规则A至少选中一个使用场景'],['取消勾选全部使用场景','点击“保存”'],'不保存没有使用场景的规则',{point:'场景必选'});
for(const [k,word,action,state]of [['admin-gift-list.html','确认后执行','下架','下架'],['admin-custom-gift.html','提前下架','提前下架','已下架'],['admin-prop-list.html','下架停止新发放','下架','下架'],['admin-task-config.html','启停 -> 确认','停用','停用'],['admin-recharge-package.html','确认后','下架','下架']])for(const confirm of [true,false])t(k,word,`${page(k).name}${action}${confirm?'确认':'取消'}`,['记录A当前有效并启用，已有成功业务记录B'],[`点击记录A“${action}”`,`点击“${confirm?'确认':'取消'}”`],confirm?`记录A状态变为${state}`:'记录A保留操作前状态',{point:'配置状态确认'});
