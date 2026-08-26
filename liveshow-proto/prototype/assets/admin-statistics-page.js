(function () {
  const configs = {
    userActive: {
      file: 'admin-user-active-statistics.html', title: '用户活跃汇总（每日）',
      filters: [],
      cards: [['loginUsers','登录用户'],['newUsers','新用户'],['oldUsers','老用户'],['payingUsers','付费用户']],
      columns: [['loginUsers','登录用户'],['newUsers','新用户'],['oldUsers','老用户'],['payingUsers','付费用户']],
      base: {loginUsers:25160,newUsers:1820,oldUsers:23340,payingUsers:2753}
    },
    host: {
      file: 'admin-host-statistics.html', title: '主播活跃汇总（每日）',
      filters: [],
      cards: [['newHosts','新增主播'],['liveHosts','开播人数'],['sessions','开播场次'],['violationSessions','违规场次']],
      columns: [['newHosts','新增主播'],['liveHosts','开播人数'],['sessions','开播场次'],['liveRate','开播率','percent'],['effectiveHosts','有效天达标人数'],['medianDuration','开播时长中位数','duration'],['cohostSessions','连麦场次'],['violationHosts','违规主播人数'],['violationSessions','违规场次']],
      base: {newHosts:48,totalHosts:360,liveHosts:168,sessions:496,effectiveHosts:142,medianDuration:185,cohostSessions:86,violationHosts:12,violationSessions:18},
      derive: item => ({...item,liveRate:item.liveHosts/item.totalHosts*100})
    },
    liveInteraction: {
      file: 'admin-live-statistics.html', title: '直播间互动汇总（每日）',
      filters: [],
      cards: [],
      columns: [['viewers','观众人数'],['watchDuration','观看时长','duration'],['averageWatchDuration','人均观看时长','duration'],['roomVisitRate','直播间访问率','percent']],
      base: {viewers:68400,watchSeconds:5759280,roomVisits:86200},
      derive: item => ({...item,watchDuration:Math.round(item.watchSeconds/60),averageWatchDuration:Math.round(item.watchSeconds/item.viewers/60),roomVisitRate:item.viewers/item.roomVisits*100})
    },
    rechargeConsumption: {
      file: 'admin-recharge-statistics.html', title: '充值消费汇总（每日）',
      filters: [],
      cards: [['totalRecharge','总充值金额','money'],['rechargeUsers','总充值人数'],['orders','充值订单数'],['consumptionCoins','消费金币','coin'],['coinNet','金币净增量','coin']],
      columns: [['totalRecharge','总充值金额','money'],['rechargeUsers','总充值人数'],['orders','充值订单数'],['averageOrderValue','客单价','money'],['rechargeCoins','充值金币','coin'],['rechargeBonusCoins','充值赠送金币','coin'],['systemBonusCoins','系统赠送金币','coin'],['consumptionCoins','消费金币','coin'],['coinNet','金币净增量','coin']],
      base: {totalRecharge:294720,rechargeUsers:12460,orders:18420,rechargeCoins:29472000,rechargeBonusCoins:1268000,systemBonusCoins:486000,consumptionCoins:18100000},
      derive: item => ({...item,averageOrderValue:item.totalRecharge/item.rechargeUsers,coinNet:item.rechargeCoins+item.rechargeBonusCoins+item.systemBonusCoins-item.consumptionCoins})
    },
    rechargeUsers: {
      file: 'admin-user-activity-statistics.html', title: '充值用户分层汇总（每日）',
      filters: [],
      cards: [['dailyTotalRecharge','总充值金额','rechargeMoney'],['newRechargeUsers','新用户充值人数'],['newRechargeAmount','新用户充值金额','rechargeMoney'],['oldRechargeAmount','老用户充值金额','rechargeMoney']],
      columns: [['dailyTotalRecharge','总充值金额','rechargeMoney'],['totalRechargeUsers','总充值人数'],['newRechargeUsers','新用户充值人数'],['newRechargeAmount','新用户充值金额','rechargeMoney'],['newUserArpu','新用户 ARPU','money'],['oldRechargeUsers','老用户充值人数'],['oldRechargeAmount','老用户充值金额','rechargeMoney'],['oldUserArpu','老用户 ARPU','money']],
      data: () => window.LUMA_ADMIN_MOCK.analytics.userRechargeStatistics.map(item => {
        const oldRechargeUsers = Math.round(item.oldRechargeAmount / 37.8);
        return {...item,oldRechargeUsers,totalRechargeUsers:item.newRechargeUsers+oldRechargeUsers,oldUserArpu:item.oldRechargeAmount/oldRechargeUsers};
      })
    }
  };

  const key = document.body.dataset.statistics;
  const config = configs[key];
  if (!config) return;
  config.filters = [];
  document.body.classList.add('analytics-report-page');
  const R = window.LUMA_REPORTING;
  const dates = ['2026-08-07','2026-08-06','2026-08-05','2026-08-04','2026-08-03','2026-08-02','2026-08-01'];
  const weights = [1,.94,.97,.89,.82,1.08,1.04];
  const moneyKeys = new Set([...config.cards,...config.columns].filter(item => item[2] === 'money').map(item => item[0]));
  const data = config.data ? config.data().map((item) => ({...item})) : dates.map((date,index) => {
    const item = Object.fromEntries([['date',date],...Object.entries(config.base).map(([metric,value]) => [metric,Math.max(1,Math.round(value*weights[index]))])]);
    return config.derive ? config.derive(item) : item;
  });
  const number = value => window.LUMA_FORMAT.integer(value);
  const money = value => window.LUMA_FORMAT.number(value,2);
  const formatDuration = value => {
    const hours = Math.floor(value / 60);
    const minutes = Math.round(value % 60);
    return `${hours ? `${number(hours)}h` : ''}${minutes ? `${minutes}m` : ''}` || '0m';
  };
  const format = (metric,value,type) => type === 'duration' ? formatDuration(value) : type === 'percent' ? `${window.LUMA_FORMAT.number(value,1)}%` : type === 'coin' ? window.LUMA_FORMAT.coins(value) : (type === 'money' || moneyKeys.has(metric)) ? window.LUMA_FORMAT.money(value) : number(value);
  const formatMetric = (metric,value,type) => (type === 'money' || type === 'rechargeMoney')
    ? `<span class="statistics-recharge-money" style="color:${window.LUMA_ADMIN_TOKENS.success};font-weight:700">${window.LUMA_FORMAT.money(value)}</span>`
    : format(metric,value,type);
  const columnLabel = ([,label]) => label;
  const sum = (items,metric) => items.reduce((total,item) => total + Number(item[metric] || 0),0);
  const filterField = ([id,label,options]) => options === 'text'
    ? `<div class="admin-field"><label for="${id}">${label}</label><input class="admin-input" id="${id}" placeholder="输入${label} ID 或昵称"></div>`
    : `<div class="admin-field"><label for="${id}">${label}</label><select class="admin-select" id="${id}">${options.map((option,index) => `<option value="${index ? option : ''}">${option}</option>`).join('')}</select></div>`;

  document.body.innerHTML = `<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-brand"><span class="admin-brand-mark">L</span><span>Luma 管理后台</span></div><nav class="admin-nav"></nav><div class="admin-sidebar-foot">Luma Live 管理后台</div></aside><div class="admin-main"><header class="admin-topbar"><div class="admin-breadcrumb">数据分析&nbsp;&nbsp;/&nbsp;&nbsp;基础数据&nbsp;&nbsp;/&nbsp;&nbsp;<strong>${config.title}</strong></div><div class="admin-account"><span class="admin-account-avatar">管</span><span>后台管理员</span><span>⌄</span></div></header><main class="admin-content"><div class="admin-page-head"><h1>${config.title}</h1><button class="admin-btn secondary" id="exportBtn">导出报表</button></div><section class="admin-panel admin-filter statistics-filter"><div class="admin-filter-grid"><div class="admin-field"><label>时段</label><div class="admin-range admin-date-range"><input class="admin-input" id="startDate" type="date" value="2026-08-01"><span>至</span><input class="admin-input" id="endDate" type="date" value="2026-08-07"></div></div>${config.filters.map(filterField).join('')}</div><div class="admin-filter-actions"><button class="admin-btn secondary" id="resetBtn">重置</button><button class="admin-btn" id="searchBtn">查询</button></div></section>${config.cards.length ? `<section class="raw-report-kpis ${config.cards.length === 6 ? 'six-columns' : ''}" id="summaryCards"></section>` : ''}<section class="admin-panel admin-table-panel"><div class="admin-table-wrap"><table class="admin-table statistics-table"><thead><tr><th>日期</th>${config.columns.map(column => `<th>${columnLabel(column)}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div><div class="admin-pagination" id="pagination"><span>20 条 / 页</span><button class="admin-page-btn" disabled>‹</button><button class="admin-page-btn active" disabled>1</button><button class="admin-page-btn" disabled>›</button></div></section></main></div></div>`;

  const startDate = document.getElementById('startDate'), endDate = document.getElementById('endDate'), summaryCards = document.getElementById('summaryCards'), rows = document.getElementById('rows'), pagination = document.getElementById('pagination');
  let visible = data;
  function selectedScale() { return config.filters.reduce((scale,[id]) => scale * (document.getElementById(id).value ? .32 : 1),1); }
  function scaled(items) { const scale=selectedScale(); if(scale===1)return items; return items.map(item=>Object.fromEntries(Object.entries(item).map(([metric,value])=>[metric,metric==='date'?value:Math.max(1,Math.round(value*scale))]))); }
  function render(items) {
    visible=items;
    if(summaryCards)summaryCards.innerHTML=config.cards.map(([metric,label,type])=>`<article class="admin-panel raw-report-kpi"><span>${label}</span><b>${formatMetric(metric,sum(items,metric),type)}</b></article>`).join('');
    pagination.classList.toggle('state-hide',!items.length);
    rows.innerHTML=items.length?items.map(item=>`<tr><td><b>${item.date}</b></td>${config.columns.map(([metric,,type])=>`<td>${formatMetric(metric,item[metric],type)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${config.columns.length+1}"><div class="admin-empty"><strong>暂无${config.title}数据</strong><span>请调整筛选条件后重新查询</span></div></td></tr>`;
  }
  function query(){if(!R.validateDates(startDate.value,endDate.value))return;const items=data.filter(item=>(!startDate.value||item.date>=startDate.value)&&(!endDate.value||item.date<=endDate.value));render(scaled(items));Luma.toast(`已更新${config.title}`);}
  document.getElementById('searchBtn').onclick=query;
  document.getElementById('resetBtn').onclick=()=>{startDate.value='2026-08-01';endDate.value='2026-08-07';config.filters.forEach(([id])=>document.getElementById(id).value='');render(data);Luma.toast('筛选条件已重置');};
  document.getElementById('exportBtn').onclick=()=>R.exportReport(config.title,visible.length);
  render(data); window.parent.postMessage({type:'luma-page',file:config.file},'*');
  Luma.registerStates({'默认':()=>render(data),'单日数据':()=>{startDate.value='2026-08-07';endDate.value='2026-08-07';query()},'无查询结果':()=>render([])});
})();
