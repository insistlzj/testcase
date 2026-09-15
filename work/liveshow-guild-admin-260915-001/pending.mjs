// Options below remain QA proposals. No product decision is filled or used by a formal case.
export function refineQuestions(questions){
 const extra=[];
 for(const q of questions){
  q.具体场景=q.功能模块+'中，'+q.具体场景+'发生时的结果判定';
  q.测试建议='建议 A：采用首项所述明确口径，便于准备数据和复算；产品确认前仅作为候选，不据此验收。';
  q.已知依据=q.已知依据.map(s=>s.replace(/ 选项：.*?(?=影响端：)/,' '));
  const append=(suffix,question,options)=>extra.push({...q,问题编号:q.问题编号+'-'+suffix,父问题编号:'',待决策问题:question,可选方案:options,确认后待补用例:[question.replace(/[？?]$/,'')+'的边界与失败分支']});
  switch(q.问题编号){
   case 'PENDING-business-zone':
    q.待决策问题='签到、任务、榜单、直播有效天和报表，是否统一采用印尼雅加达时间 UTC+7？';
    q.可选方案=['全部统一采用 UTC+7，按该时区切分自然日','全部统一采用 UTC，按 UTC 切分自然日','全部统一采用 UTC+8，按该时区切分自然日'];
    append('week','任务的统计周从哪一天开始？',['周一 00:00 至下周一 00:00 前','周日 00:00 至下周日 00:00 前']);break;
   case 'PENDING-metric-latency':
    q.可选方案=['业务提交成功后 5 秒内更新对应指标','每 5 分钟汇总一次，汇总完成后展示新指标'];q.负责人='多方确认';break;
   case 'PENDING-effective-duration':
    q.可选方案=['仅累计服务端确认成功推流的时段，断流、后台挂起和暂停不计入','按直播会话持续时间累计，断流、后台挂起和暂停仍计入至场次结束'];break;
   case 'PENDING-coin-precision':
    q.待决策问题='不足 1 金币的单笔幸运收益，采用哪种存储与累计口径？';
    q.可选方案=['每笔截断为整数后累计','保留至 6 位小数，累计后再按展示精度显示','每笔四舍五入为整数后累计'];
    append('display','金币收益含小数时，页面显示几位小数？',['显示 2 位小数，四舍五入','显示 6 位小数，末尾零省略']);break;
   case 'PENDING-level-limit':
    q.可选方案=['四类等级阈值与累计值统一不超过 2147483647','四类等级阈值与累计值统一不超过 9007199254740991'];q.负责人='多方确认';break;
   case 'PENDING-badge-upload':
    q.待决策问题='等级勋章图片允许哪些文件格式？';q.可选方案=['只允许 PNG','允许 PNG、JPG、WebP'];
    append('size','单张等级勋章图文件大小上限是多少？',['不超过 2 MiB','不超过 5 MiB']);
    append('dimensions','等级勋章图允许哪些像素尺寸？',['固定 128×128 像素','宽高均为 64 至 512 像素且必须正方形']);break;
   case 'PENDING-intimacy-decay':q.可选方案=['不衰减，仅退团按已确认规则清零','连续 7 个业务日无互动时，从第 8 日开始每天扣当前积分的 10%，向下取整'];break;
   case 'PENDING-badge-refresh':q.可选方案=['保存后下一次加载资料时显示新图','仅重新登录后显示新图','最多缓存 5 分钟，缓存过期后的首次加载显示新图'];break;
  }
 }
 questions.push(...extra);
 const groups=new Map(),mapping=new Map();
 questions.sort((a,b)=>a.问题编号.localeCompare(b.问题编号,'en'));
 for(const [i,q]of questions.entries()){
  const source=q.问题编号.replace(/-(week|display|size|dimensions)$/,'');
  if(!groups.has(source))groups.set(source,'RQ-'+String(groups.size+1).padStart(3,'0'));
  const newId='Q-'+String(i+1).padStart(3,'0');mapping.set(q.问题编号,newId);q.问题编号=newId;q.需求组编号=groups.get(source);
 }
 return mapping;
}
