import {page,model} from './design-current.mjs';
const A='管理后台';
// Current MainBasis form inputs; values below are test fixtures, not production defaults.
const forms=[
 ['admin-violation-type-detail.html','违规类型','四语名称分别为“测试类型”、Test Type、Jenis Uji、Jenis Ujian，排序 1，属性自定义，状态启用',['中文名称','英语名称','印尼语名称','马来语名称'],['排序']],
 ['admin-gift-detail.html','礼物','礼物 ID 为本轮未使用的 900101，四语名称为“测试礼物”、Test Gift、Hadiah Uji、Hadiah Ujian，图标为礼物图标.png，单价 100 金币，排序权重 10',['中文名称','英语名称','印尼语名称','马来语名称','图标'],['单价']],
 ['admin-lucky-gift-detail.html','幸运礼物','礼物 ID 为未使用的 900102，四语名称已填“测试幸运”、Test Lucky、Uji Keberuntungan、Ujian Tuah，图标为幸运图标.png，单次消耗 10 金币，开奖次数 1，奖励 0 和 10 的概率为 4% 和 96%',['中文名称','英语名称','印尼语名称','马来语名称','图标'],['单次消耗','开奖次数']],
 ['admin-prop-detail.html','道具','道具 ID 为未使用的 900103，四语名称为“测试头像框”、Test Frame、Bingkai Uji、Bingkai Ujian，类型头像框，单价 100 金币，图标和素材已上传当前类型可接受资源，排序 10，可佩戴期限从当天起至第 30 天',['中文名称','英语名称','印尼语名称','马来语名称','图标','素材'],['单价']],
 ['admin-recharge-package-detail.html','充值套餐','套餐 ID 为未使用的 900104，类型活动，封面已上传套餐封面.png，销售价格 1.50 USD，充值金币 100，赠送金币 20，限购 1，活动从今天到明天，排序 10',['类型','封面'],['充值金币']],
 ['admin-task-detail.html','任务','四语名称为“测试任务”、Test Task、Tugas Uji、Tugasan Ujian，时间从今天到明天，用户动作和指标选当前系统预置的一组可用组合，统计周期选择该指标支持的一个周期，达成条件为 1，奖励 10 金币',['中文名称','英语名称','印尼语名称','马来语名称'],['达成奖励']],
 ['admin-guild-recommendation-detail.html','公会推荐','推荐公会选择有效且尚未推荐的公会甲，排序权重 1',['推荐公会'],['排序权重']],
 ['admin-ticket-price-level-detail.html','门票价格档位','新建档位价格 100 金币且不存在同价档位，排序 1，另有启用价格 200 金币的档位',['门票价格'],['门票价格','排序']],
 ['admin-sensitive-words-detail.html','敏感词','敏感词为“测试词甲”，分类选当前列表一个启用项，规则包含匹配，使用场景选择公屏，替换内容“***”，状态启用',['敏感词','分类','替换内容'],[]],
 ['admin-system-account-detail.html','后台账号','登录账号 qa_admin_9001 未被使用，姓名“测试管理员”，所属角色为启用的测试运营角色，初始密码 QaTest#2026，状态启用',['后台账号','姓名','所属角色','初始密码'],[]],
 ['admin-system-role-detail.html','后台角色','角色名称“测试角色9001”未被使用，状态启用，菜单只勾选用户管理下的用户列表权限',['角色名称'],[]],
 ['admin-guild-detail.html','公会','公会名称“测试公会9001”，Logo 为公会标志.png，公会长“测试会长”，管理账号 qa_guild_9001 未被使用，初始密码 QaGuild#2026，状态启用',['名称','Logo','公会长','管理账号','初始密码'],[]],
];
for(const [key,object,fixture,required,positive] of forms){
 const pg=page(A,key,[`表单为新建${object}；${fixture}`]);
 const requirements=model.requirements.filter(r=>r.page===pg.p.key);
 const matchField=f=>requirements.filter(r=>r.field.includes(f)||(/名称/.test(f)&&/四语/.test(r.field))||(/金币/.test(f)&&r.field.includes('充值 / 赠送'))||(/图标/.test(f)&&r.field.includes('资源'))||(/初始密码/.test(f)&&r.body.includes('新建必填')));
 for(const field of required){const src=matchField(field);if(!src.length)throw Error(`Missing required ${key} ${field}`);
  pg.add(`${object}的${field}为空`,[],[`打开${pg.p.name}`,`${/图标|素材|Logo|封面/.test(field)?'删除':'清空'}${field}`,'点击保存'],[{point:`${field}必填性`,result:`本次${object}未保存`}],[],{sourceIds:src.map(r=>r.id)});
 }
 for(const field of positive){const src=matchField(field);if(!src.length)throw Error(`Missing numeric ${key} ${field}`);
  for(const v of [-1,0,0.5,1])pg.add(`${object}的${field}输入${v}`,[],[`打开${pg.p.name}`,`输入${field} ${v}`,'点击保存'],[{point:`${field}正整数约束`,result:v===1?`${object}保存后的${field}为 1`:`本次${object}未保存`}],[],{sourceIds:src.map(r=>r.id)});
 }
 for(const f of ['礼物 ID','道具 ID','套餐 ID','门票价格','角色名称','后台账号','管理账号']){
  const src=matchField(f).filter(r=>/唯一|不重复/.test(r.body));if(!src.length)continue;
  pg.add(`${object}拒绝重复${f}`,[`已存在一条${f}与本表单相同的记录`],[`打开${pg.p.name}`,'点击保存'],[{point:`${f}唯一性`,result:`未新增重复${f}的${object}`}],[],{sourceIds:src.map(r=>r.id)});
 }
 const id= requirements.find(r=>/ID/.test(r.field)&&/编辑.*只读|不可改/.test(r.body));
 if(id)pg.add(`编辑${object}不能修改系统标识`,[`已有${object}标识为 900001，本次切换为编辑该记录`],[`打开${object} 900001 的编辑页面`,`查看${id.field}`],[{point:'标识只读性',result:`${id.field}为只读`}],[],{sourceIds:[id.id]});
 const cancel=requirements.filter(r=>/取消.*不保存|返回.*不保存/.test(r.body));
 if(cancel.length)pg.add(`取消编辑${object}不保存修改`,[`${object}已存在且表单中有尚未提交的修改`],[`打开${pg.p.name}`,'点击取消'],[{point:'取消修改',result:`${object}保留修改前内容`}],[],{sourceIds:cancel.map(r=>r.id)});
}
const recharge=page(A,'admin-recharge-package-detail.html',['活动套餐甲：价格 1.50 USD、充值金币 100、赠送金币 20、限购 1，起止时间明天至后天，封面和其他必填项已完成']);
for(const v of [-0.01,0,0.001,0.01,12.34])recharge.add(`销售价格输入 ${v} USD`,[],['打开充值套餐编辑',`输入销售价格 ${v}`,'点击保存'],[{point:'销售金额精度和下界',result:v===0.01||v===12.34?`保存后的销售价格为 ${v.toFixed(2)} USD`:'本次充值套餐未保存'}],[/销售价格/]);
for(const field of ['赠送金币','限购次数'])for(const v of [-1,0,1,0.5])recharge.add(`${field}输入 ${v}`,[],['打开充值套餐编辑',`输入${field} ${v}`,'点击保存'],[{point:`${field}非负整数范围`,result:Number.isInteger(v)&&v>=0?`保存后的${field}为 ${v}`:'本次充值套餐未保存'}],[field==='赠送金币'?/赠送金币/:/限购次数/]);
const luck=page(A,'admin-lucky-gift-detail.html',['幸运礼物配置其余必填项已填，单次消耗 10 金币，开奖次数 10；奖励档位为 0 金币和 10 金币']);
for(const total of [99,100,101])luck.add(`幸运礼物概率合计 ${total}%`,[],['打开幸运礼物编辑','输入 0 金币档概率 4%',`输入 10 金币档概率 ${total-4}%`,'点击保存'],[{point:'概率总和',result:total===100?'保存后的概率合计为 100%':'幸运礼物概率配置未保存'}],[/概率|100%/]);
for(const v of [-1,0,1.5])luck.add(`奖励金币档位输入 ${v}`,['第二档奖励为 10 金币，第一档与第二档不重复'],['打开幸运礼物编辑',`输入第一档奖励金币 ${v}`,'点击保存'],[{point:'奖励金币非负整数',result:v===0?'第一档奖励金币保存为 0':'幸运礼物奖励档位未保存'}],[/奖励金币|档位/]);
luck.add('奖励金币档位不可重复',[],['打开幸运礼物编辑','输入两个奖励档位均为 10 金币','点击保存'],[{point:'奖励档位唯一性',result:'重复奖励档位未保存'}],[/奖励金币|档位/]);
const counts=page(A,'admin-gift-send-count-rule-detail.html',['规则为新建，存在未被其他启用规则关联的普通礼物甲']);
for(const quantities of [[],[1],[1,10],[1,1],[0],[-1],[1.5]])counts.add(`赠送数量配置为 ${quantities.length?quantities.join('、'):'空列表'}`,[],['打开购买份数配置详情',`将赠送数量列表填写为${quantities.length?quantities.join('、'):'空列表'}`,'选择礼物甲',...(quantities.length?[`选择默认数量 ${quantities[0]}`]:[]),'点击保存'],[{point:'赠送数量集合约束',result:quantities.length>0&&quantities.every(v=>Number.isInteger(v)&&v>0)&&new Set(quantities).size===quantities.length?`保存的赠送数量列表为 ${quantities.join('、')}`:'购买份数配置未保存'}],[/赠送数量|默认数量/]);
counts.add('默认数量只能从已配置集合选择',['当前赠送数量列表为 1、10'],['打开购买份数配置详情','展开默认数量选项'],[{point:'默认数量取值来源',result:'默认数量可选项仅为 1 和 10'}],[/默认数量/]);
counts.add('同一礼物不能关联两条启用份数规则',['礼物甲已关联启用规则 R001'],['打开新建购买份数配置','填写数量 1 和默认数量 1','选择礼物甲','启用规则','点击保存'],[{point:'启用规则冲突',result:'第二条启用规则未保存'}],[/启用|关联|冲突/]);
const schedule=page(A,'admin-inspection-schedule-create.html',['当前日期为测试日 D，测试用户甲为可用账号；巡房时段初值为 D+1 日 10:00 至 11:00']);
for(const [label,start,end,accepted] of [['结束早于开始','11:00','10:00',false],['起止相等','10:00','10:00',false],['结束晚于开始','10:00','11:00',true]])schedule.add(`巡房排班${label}`,[],['打开新建排班','选择日期 D+1',`输入开始时间 ${start}`,`输入结束时间 ${end}`,'选择测试用户甲','点击保存'],[{point:'排班时间顺序',result:accepted?'排班时段保存为 D+1 日 10:00 至 11:00':'巡房排班未保存'}],[/时间段|结束|开始/]);
for(const date of ['D-1','D','D+1'])schedule.add(`排班日期为 ${date}`,[],['打开新建排班',`选择日期 ${date}`,'输入开始时间 10:00 和结束时间 11:00','选择测试用户甲','点击保存'],[{point:'排班日期下界',result:date==='D-1'?'巡房排班未保存':`排班日期保存为 ${date}`}],[/日期|当前日期/]);
schedule.add('排班至少需要一名巡房人员',[],['打开新建排班','取消勾选所有巡房人员','点击保存'],[{point:'巡房人员最小数量',result:'巡房排班未保存'}],[/巡房人员|至少/]);
schedule.add('巡房人员列表不能重复选择同一账号',[],['打开新建排班','选择测试用户甲','再次选择测试用户甲'],[{point:'巡房人员去重',result:'已选人员中测试用户甲只出现一次'}],[/巡房人员|重复/]);
