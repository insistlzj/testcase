import {pages,rules} from './read-basis.mjs';
import {test,ref,add,designs} from './design-cases.mjs';
import {calculation} from './manual-finance.mjs';
for(const p of pages.filter(p=>p.rules.some(r=>/排名：.*从高到低排序/u.test(r.text)))){
 const rule=p.rules.find(r=>/排名：.*从高到低排序/u.test(r.text));
 const isHost=rule.text.includes('主播 ID');const metric=rule.text.includes('收礼值')?'收礼值':'贡献值';
 const levels=rule.text.includes('主播等级')?['主播等级','财富等级']:rule.text.includes('粉丝等级')?['粉丝等级','财富等级']:['财富等级'];
 const tiers=[metric,...levels,'ID'];
 for(const [i,tier]of tiers.entries()){
  const setup=tiers.slice(0,i).map(k=>`${k}相同`).join('、')||'其余排序字段无优先影响';
  test(p.key,'排名：',`${p.name}按${tier}破除同值`,[`对象A和B${setup}；${tier}分别为${tier==='ID'?'1001、1002':'20、10'}`],[`打开${p.entry}`],'A排列在B之前',{point:`排序条件${i+1}`,dimension:'输入边界'});
 }
 const absent=p.rules.find(r=>/缺失时按 0/u.test(r.text));
 if(absent)add(absent,{label:`${p.name}等级缺失按0参与排序`,given:[`A和B${metric}相同，A排序所需等级缺失，B该等级为1，其余排序条件相同`],steps:[`打开${p.entry}`],expected:'B排列在A之前',point:'缺失等级排序'});
 const cap=p.rules.find(r=>r.text.includes('前 99 名'));
 if(cap)for(const n of [98,99,100])add(cap,{label:`${p.name}有${n}名时的截断`,given:[`当前统计范围恰有${n}名对象具备有效贡献，按完整排序可唯一排序`],steps:[`打开${p.entry}`],expected:`榜单展示${Math.min(n,99)}名对象`,point:'榜单人数边界',dimension:'输入边界'});
 const deleted=p.rules.find(r=>r.text.includes('账号已注销'));
 if(deleted)for(const expectation of ['历史贡献数值保留','名称显示“账号已注销”','不能进入该账号主页'])add(deleted,{label:`${p.name}中的已注销账号${expectation}`,given:['对象A在本榜有有效历史贡献100，现账号已完成注销'],steps:[`打开${p.entry}`,...(expectation.includes('不能进入')?['点击已注销账号A']:[])],expected:expectation,point:'注销账号历史榜单'});
}
for(const p of pages.filter(p=>p.rules.some(r=>/当日从当天 00:00|本周从周一 00:00/u.test(r.text)))){
 const r=p.rules.find(r=>/当日从当天 00:00|本周从周一 00:00/u.test(r.text));
 const tabs=[...(r.text.includes('当日')?['当日']:[]),'本周','本月'];
 for(const tab of tabs){const start=tab==='本月'?'2026-09-01 00:00':'2026-09-14 00:00';add(r,{label:`${p.name}${tab}起点包含规则`,given:[`平台业务时区已确定，当前为2026-09-14 12:00；A在${start}有成功贡献10，起点前1秒另有贡献20`],steps:[`打开${p.entry}`,`切换“${tab}”`],expected:'A本周期贡献仅计入起点后的10金币',point:'周期边界',dimension:'输入边界'});}
}
for(const p of pages){
 const income=p.rules.find(r=>/普通.*定制/u.test(r.text)&&/幸运/u.test(r.text)&&/比例|1%/u.test(r.text)&&/收益/u.test(r.text));
 if(income&&/host-center|live-data|guild-(?:home|host-list|host-summary|host-data|live-gift-detail|income)|admin-(?:host-performance|consumption-order-detail)/u.test(p.key)){
  const terms=[['普通礼物',60],['定制礼物',60],['幸运礼物',.6]];
  for(const [type,result]of terms)add(income,{label:`${p.name}统计${type}收益`,given:[`当前对象和统计范围内仅一笔${type}成功赠送，单价20金币、数量3；幸运礼物赠送时收益比例1%`],steps:[`打开${p.entry}`,`查看${p.name}收益指标`],expected:`收益=${result}金币`,point:'礼物分类收益',calc:calculation('*',[60,type==='幸运礼物'?.01:1],['消费总额','收益比例'])});
 }
 const effective=p.rules.find(r=>/3 小时/u.test(r.text)&&/有效天/u.test(r.text));
 if(effective)for(const minutes of [179,180,181,360])add(effective,{label:`${p.name}单日${minutes}分钟有效天`,given:[`主播A当日有效直播累计${minutes}分钟，当前统计范围仅该自然日和该主播`],steps:[`打开${p.entry}`,'查看有效天指标'],expected:`A当日有效天=${minutes>=180?1:0}天`,point:'有效天阈值',dimension:'输入边界'});
 const visits=p.rules.find(r=>r.text.includes('同一用户重复进入重复累计'));
 if(visits)add(visits,{label:`${p.name}重复进入按访问事件累计`,given:['S1开始时访问0；用户A成功进入2次，B成功进入1次，另有1次密码失败及1次购票失败'],steps:[`打开${p.entry}`,'查看S1访问次数'],expected:'S1访问次数=3',point:'访问事件口径',calc:calculation('+',[2,1],['A成功进入事件','B成功进入事件'],'次')});
 const distinct=p.rules.find(r=>/当前场次.*(?:去重用户数|去重人数)/u.test(r.text));
 if(distinct)add(distinct,{label:`${p.name}同人反复进房只计一名观众`,given:['本场A成功进入2次，B成功进入1次，其他用户均未进入；当前统计仅该场次'],steps:[`打开${p.entry}`,'查看观众人数'],expected:'本场观众人数=2',point:'观众去重口径',calc:calculation('+',[1,1],['用户A','用户B'],'人')});
 const netFans=p.rules.find(r=>/新增关注人数减去取消关注人数/u.test(r.text));
 if(netFans)for(const [newN,oldN]of [[3,1],[1,3],[0,0]])add(netFans,{label:`${p.name}涨粉${newN}减${oldN}`,given:[`本统计范围新增关注${newN}人、取消关注${oldN}人，无其他关系变更`],steps:[`打开${p.entry}`,'查看新增粉丝'],expected:`新增粉丝=${newN-oldN}人`,point:'净增粉丝',calc:calculation('-',[newN,oldN],['新增关注','取消关注'],'人')});
}
test('guild-host-list.html','中位数', '主播达标人数采用奇数样本中位数',['本范围已完成直播的主播A、B、C累计有效天分别1、2、3天；另有D未开播'],['打开主播业绩'],'达标人数=2人',{point:'有效天中位数奇数样本',calc:calculation('+',[1,1],['B达标','C达标'],'人')});
test('guild-host-list.html','中位数', '主播达标人数采用偶数样本中位数',['本范围已完成直播的主播A、B、C、D累计有效天分别1、2、3、4天；中位数2.5天'],['打开主播业绩'],'达标人数=2人',{point:'有效天中位数偶数样本',calc:calculation('+',[1,1],['C达标','D达标'],'人')});
test('guild-host-list.html','发生时的公会关系','退会后历史业绩仍归发生公会',['A在G1期间产生100金币收益，退会后在G2期间产生200金币收益'],['打开G1主播业绩','选择包含两个时期的日期范围'],'G1只计A在会期间的100金币收益',{point:'历史关系统计快照'});
test('guild-income-day-detail.html','查看历史日期','历史日期直播中指标采用当日开播人数',['所选历史日有A、B开播，当前仅C正在直播'],['打开该历史日经营详情'],'历史日直播中指标显示2人',{point:'实时与历史统计口径'});

export default designs;
