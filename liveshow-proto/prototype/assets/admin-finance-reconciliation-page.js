(function () {
  const F = window.LUMA_FORMAT;
  const R = window.LUMA_REPORTING;
  const DATA = window.LUMA_ADMIN_MOCK.analytics.financeReconciliation;
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const entity = (name, id) => `<b>${escape(name)}</b><span class="admin-cell-sub">${escape(id)}</span>`;
  const reportTime = (value) => `<strong class="admin-report-time">${escape(value)}</strong>`;
  const monthText = (value) => { const [year, month] = value.split('-'); return reportTime(`${month}/${year}`); };
  const DEFAULT_START_DATE = '2026-08-01';
  const DEFAULT_END_DATE = '2026-08-20';
  let activeStartDate = DEFAULT_START_DATE;
  let activeEndDate = DEFAULT_END_DATE;
  const dateRangeText = () => reportTime(`${F.date(activeStartDate)} - ${F.date(activeEndDate)}`);
  const dateRangeDays = () => Math.floor((Date.parse(activeEndDate) - Date.parse(activeStartDate)) / 86400000) + 1;
  const text = (value) => escape(value);
  const coins = (value) => F.integer(value);
  const money = (value) => F.money(value);
  const dateTime = (value) => reportTime(F.dateTime(value));

  const configs = {
    monthlyIncomeExpense: {
      title: '月度收益支出汇总', file: 'admin-monthly-income-expense.html', rows: DATA.monthlyIncomeExpense,
      allMonths: true, minWidth: 1020,
      columns: [
        ['月份', (item) => monthText(item.month)], ['收益', (item) => coins(item.totalRevenue)], ['公会分成金额$', (item) => money(item.guildShareAmount)],
        ['主播分成$', (item) => money(item.hostShareAmount)], ['用户累计充值', (item) => money(item.userRechargeAmount)],
        ['用户累计退款', (item) => money(item.userRefundAmount)]
      ]
    },
    monthlyHostShare: {
      title: '主播业绩分成报表', file: 'admin-monthly-host-share.html', rows: DATA.monthlyHostShare,
      dateRange: true, groupKey: 'hostId', sumFields: ['effectiveDays', 'liveSessions', 'monthlyRevenue', 'normalGift', 'customGift', 'luckyGift', 'ticket'],
      keywordLabel: '主播 / 公会', keywordPlaceholder: '主播昵称、公会名称 / ID', minWidth: 1720,
      columns: [
        ['所选日期', () => dateRangeText()], ['主播信息', (item) => entity(item.hostName, item.hostId)], ['公会信息', (item) => entity(item.guildName, item.guildId)],
        ['统计天数', () => coins(dateRangeDays())], ['达标天数', (item) => coins(Math.min(item.effectiveDays, dateRangeDays()))],
        ['直播场次', (item) => coins(item.liveSessions)],
        ['主播收益', (item) => coins(item.monthlyRevenue)],
        ['普通礼物', (item) => coins(item.normalGift)], ['定制礼物', (item) => coins(item.customGift)],
        ['幸运礼物', (item) => coins(item.luckyGift)], ['门票', (item) => coins(item.ticket)]
      ]
    },
    monthlyHostEarnings: {
      title: '主播礼物打赏明细报表', file: 'admin-monthly-host-earnings.html', rows: DATA.monthlyHostEarnings,
      dateRange: true, groupKey: 'hostGiftKey', sumFields: ['quantity', 'earnings'],
      keywordLabel: '主播 / 礼物', keywordPlaceholder: '主播昵称、礼物名称 / ID', typeFilter: true, minWidth: 960,
      columns: [
        ['所选日期', () => dateRangeText()], ['主播信息', (item) => entity(item.hostName, item.hostId)],
        ['礼物信息', (item) => entity(item.giftName, item.giftId)], ['礼物类型', (item) => text(item.giftType)],
        ['单价', (item) => coins(item.unitPrice)], ['份数', (item) => coins(item.quantity)],
        ['收益', (item) => coins(item.earnings)]
      ]
    },
    monthlyViewerConsumption: {
      title: '用户消费汇总报表', file: 'admin-monthly-viewer-consumption.html', rows: DATA.monthlyViewerConsumption,
      dateRange: true, groupKey: 'viewerId', sumFields: ['monthlyConsumption', 'normalGift', 'customGift', 'luckyGift', 'ticket'],
      keywordLabel: '用户', keywordPlaceholder: '用户昵称/ID', minWidth: 1280,
      columns: [
        ['所选日期', () => dateRangeText()], ['用户信息', (item) => entity(item.viewerName, item.viewerId)], ['累计消费', (item) => coins(item.monthlyConsumption)],
        ['普通礼物', (item) => coins(item.normalGift)], ['定制礼物', (item) => coins(item.customGift)],
        ['幸运礼物', (item) => coins(item.luckyGift)], ['门票', (item) => coins(item.ticket)]
      ]
    },
    monthlyGiftSales: {
      title: '礼物消费汇总报表', file: 'admin-monthly-gift-sales.html', rows: DATA.monthlyGiftSales,
      dateRange: true, groupKey: 'giftId', sumFields: ['salesVolume', 'monthlySales'],
      keywordLabel: '礼物', keywordPlaceholder: '礼物名称/ID', typeFilter: true, minWidth: 1080,
      columns: [
        ['所选日期', () => dateRangeText()], ['礼物信息', (item) => entity(item.giftName, item.giftId)], ['礼物类型', (item) => text(item.giftType)],
        ['单价', (item) => coins(item.unitPrice)], ['销量', (item) => coins(item.salesVolume)],
        ['销售额', (item) => coins(item.monthlySales)]
      ]
    },
    consumptionOrderDetail: {
      title: '消费订单明细', file: 'admin-consumption-order-detail-report.html', rows: DATA.consumptionOrderDetail, detail: true, dateField: 'consumedAt',
      keywordLabel: '主播 / 用户', keywordPlaceholder: '主播昵称、用户昵称/ID', minWidth: 1500,
      columns: [
        ['消费时间', (item) => dateTime(item.consumedAt)], ['用户信息', (item) => entity(item.viewerName, item.viewerId)], ['礼物类型', (item) => text(item.productType)],
        ['礼物信息', (item) => entity(item.productName, item.productId)], ['礼物单价', (item) => coins(item.unitPrice)],
        ['消费份数', (item) => coins(item.quantity)], ['消费金币', (item) => coins(item.consumptionCoins)],
        ['主播收益', (item) => coins(item.hostEarnings)], ['主播信息', (item) => entity(item.hostName, item.hostId)],
        ['公会信息', (item) => entity(item.guildName, item.guildId)], ['直播场次ID', (item) => text(item.sessionId)]
      ]
    },
    refundOrderDetail: {
      title: '退款订单明细', file: 'admin-refund-order-detail-report.html', rows: DATA.refundOrderDetail, detail: true, dateField: 'refundedAt',
      keywordLabel: '退款用户', keywordPlaceholder: '用户昵称/ID', minWidth: 980,
      columns: [
        ['退款时间', (item) => dateTime(item.refundedAt)], ['用户信息', (item) => entity(item.userName, item.userId)],
        ['退款商品', (item) => text(item.refundProduct)], ['退款金额$', (item) => money(item.refundAmount)]
      ]
    },
    rechargeOrderDetail: {
      title: '充值订单明细', file: 'admin-recharge-order-detail-report.html', rows: DATA.rechargeOrderDetail, detail: true, dateField: 'rechargedAt',
      keywordLabel: '充值用户', keywordPlaceholder: '用户昵称/ID', minWidth: 1120,
      columns: [
        ['充值时间', (item) => dateTime(item.rechargedAt)], ['用户信息', (item) => entity(item.userName, item.userId)],
        ['充值套餐名', (item) => text(item.packageName)], ['支付渠道', (item) => text(item.paymentChannel)],
        ['充值金额$', (item) => money(item.rechargeAmount)]
      ]
    }
  };

  const key = document.body.dataset.financeReport;
  const config = configs[key];
  if (!config) return;
  const root = document.getElementById('financeReportRoot');
  const dateField = config.allMonths ? '' : `
    <div class="admin-field"><label>${config.dateRange ? '日期范围' : '时段'}</label><div class="admin-range admin-date-range"><input class="admin-input" id="startDate" type="date" value="${DEFAULT_START_DATE}"><span>至</span><input class="admin-input" id="endDate" type="date" value="${DEFAULT_END_DATE}"></div></div>`;
  const keywordField = config.keywordLabel ? `
      <div class="admin-field"><label>${escape(config.keywordLabel)}</label><input class="admin-input" id="keywordInput" placeholder="${escape(config.keywordPlaceholder)}"></div>` : '';
  const typeField = config.typeFilter ? `
    <div class="admin-field"><label>礼物类型</label><select class="admin-select" id="typeSelect"><option value="">全部类型</option><option>普通礼物</option><option>定制礼物</option><option>幸运礼物</option><option>门票</option></select></div>` : '';
  const filterSection = config.allMonths ? '' : `
    <section class="admin-panel admin-filter finance-reconciliation-filter"><div class="admin-filter-grid">${dateField}${keywordField}${typeField}
    </div><div class="admin-filter-actions"><button class="admin-btn secondary" id="resetBtn">重置</button><button class="admin-btn" id="searchBtn">查询</button></div></section>`;

  root.innerHTML = `
    <div class="admin-page-head"><h1>${escape(config.title)}</h1><button class="admin-btn secondary" id="exportBtn">导出报表</button></div>
    ${filterSection}
    <section class="admin-panel admin-table-panel"><div class="admin-table-wrap"><table class="admin-table finance-reconciliation-table" style="min-width:${config.minWidth}px"><thead><tr>${config.columns.map(([label]) => `<th>${escape(label)}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div><div class="admin-pagination" id="pagination"><span>20 条 / 页</span><button class="admin-page-btn" disabled>‹</button><button class="admin-page-btn active" disabled>1</button><button class="admin-page-btn" disabled>›</button></div></section>`;

  const rows = document.getElementById('rows');
  const pagination = document.getElementById('pagination');
  const keywordInput = document.getElementById('keywordInput');
  let visible = config.rows;
  const searchable = (item) => Object.values(item).join(' ').toLowerCase();
  function render(items) {
    visible = items;
    pagination.classList.toggle('state-hide', !items.length);
    rows.innerHTML = items.length ? items.map((item) => `<tr>${config.columns.map(([, format]) => `<td>${format(item)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${config.columns.length}"><div class="admin-empty"><strong>暂无${escape(config.title)}数据</strong><span>请调整筛选条件后重新查询</span></div></td></tr>`;
  }
  function aggregateRange(items) {
    if (!config.groupKey) return items;
    const groups = new Map();
    items.forEach((item) => {
      const group = groups.get(item[config.groupKey]);
      if (!group) {
        groups.set(item[config.groupKey], { ...item });
        return;
      }
      config.sumFields.forEach((field) => { group[field] += item[field]; });
    });
    return [...groups.values()];
  }
  function rangeRows(start, end) {
    const startMonth = start.slice(0, 7);
    const endMonth = end.slice(0, 7);
    return aggregateRange(config.rows.filter((item) => item.month >= startMonth && item.month <= endMonth));
  }
  function defaultRows() {
    if (config.allMonths) return config.rows;
    if (config.dateRange) return rangeRows(DEFAULT_START_DATE, DEFAULT_END_DATE);
    return config.rows.filter((item) => {
      const date = item[config.dateField].slice(0, 10);
      return date >= DEFAULT_START_DATE && date <= DEFAULT_END_DATE;
    });
  }
  function query() {
    const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
    let items = config.rows;
    if (config.detail || config.dateRange) {
      const start = document.getElementById('startDate').value;
      const end = document.getElementById('endDate').value;
      if (config.dateRange && (!start || !end)) { Luma.toast('请选择完整的日期范围'); return; }
      if (!R.validateDates(start, end)) return;
      if (config.dateRange) {
        activeStartDate = start;
        activeEndDate = end;
        items = rangeRows(start, end);
      } else {
        items = items.filter((item) => { const date = item[config.dateField].slice(0, 10); return (!start || date >= start) && (!end || date <= end); });
      }
    }
    if (keyword) items = items.filter((item) => searchable(item).includes(keyword));
    if (config.typeFilter && document.getElementById('typeSelect').value) items = items.filter((item) => item.giftType === document.getElementById('typeSelect').value);
    render(items);
    Luma.toast(`已更新${config.title}`);
  }
  function reset() {
    if (keywordInput) keywordInput.value = '';
    if (!config.allMonths) {
      document.getElementById('startDate').value = DEFAULT_START_DATE;
      document.getElementById('endDate').value = DEFAULT_END_DATE;
      if (config.dateRange) {
        activeStartDate = DEFAULT_START_DATE;
        activeEndDate = DEFAULT_END_DATE;
      }
    }
    if (config.typeFilter) document.getElementById('typeSelect').value = '';
    render(defaultRows());
    Luma.toast('筛选条件已重置');
  }
  if (!config.allMonths) {
    document.getElementById('searchBtn').onclick = query;
    document.getElementById('resetBtn').onclick = reset;
  }
  document.getElementById('exportBtn').onclick = () => R.exportReport(config.title, visible.length);
  if (keywordInput) keywordInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') query(); });
  render(defaultRows());
  window.parent.postMessage({ type: 'luma-page', file: config.file }, '*');
  Luma.registerStates({ '默认': reset, '无查询结果': () => render([]) });
})();
