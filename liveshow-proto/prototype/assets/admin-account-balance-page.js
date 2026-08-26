(function () {
  const type = document.body.dataset.accountBalance;
  const mock = window.LUMA_ADMIN_MOCK;
  const format = window.LUMA_ADMIN_FORMAT;
  const root = document.getElementById('accountBalanceRoot');
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const money = (value) => `<b>${format.money(value)}</b>`;

  const configs = {
    host: {
      title: '主播账户余额', file: 'admin-host-account-balance.html', rows: mock.hostAccountBalances,
      fields: [{ id: 'hostKey', label: '主播 / ID', placeholder: '输入主播名称或 ID' }, { id: 'guildKey', label: '所属公会 / ID', placeholder: '输入公会名称或 ID' }],
      columns: ['主播/ID', '所属公会/ID', '账户余额（待提现）', '累计已提', '提现中', '操作'],
      matches: (item, values) => `${item.hostName} ${item.hostId}`.toLowerCase().includes(values.hostKey) && `${item.guildName} ${item.guildId}`.toLowerCase().includes(values.guildKey),
      cells: (item) => {
        const href = `admin-host-balance-change-record.html?hostId=${encodeURIComponent(item.hostId)}`;
        return [`<b>${escapeHtml(item.hostName)}</b><span class="admin-cell-sub">${escapeHtml(item.hostId)}</span>`, `<b>${escapeHtml(item.guildName)}</b><span class="admin-cell-sub">${escapeHtml(item.guildId)}</span>`, `<a class="admin-action admin-balance-link" href="${href}">${format.money(item.balance)}</a>`, money(item.withdrawnTotal), money(item.withdrawing), `<a class="admin-action" href="${href}">变更记录</a>`];
      }
    },
    guild: {
      title: '公会账户余额', file: 'admin-guild-account-balance.html', rows: mock.guildAccountBalances,
      fields: [{ id: 'guildKey', label: '公会 / ID', placeholder: '输入公会名称或 ID' }],
      columns: ['公会名/ID', '账户余额（待提现）', '累计已提', '提现中', '操作'],
      detailHref: (item) => `admin-guild-balance-change-record.html?guildId=${encodeURIComponent(item.guildId)}`,
      matches: (item, values) => `${item.guildName} ${item.guildId}`.toLowerCase().includes(values.guildKey),
      cells: (item) => {
        const href = `admin-guild-balance-change-record.html?guildId=${encodeURIComponent(item.guildId)}`;
        return [`<b>${escapeHtml(item.guildName)}</b><span class="admin-cell-sub">${escapeHtml(item.guildId)}</span>`, `<a class="admin-action admin-balance-link" href="${href}">${format.money(item.balance)}</a>`, money(item.withdrawnTotal), money(item.withdrawing), `<a class="admin-action" href="${href}">变更记录</a>`];
      }
    }
  };

  function balanceList(config) {
    document.title = `${config.title} · 财务分成 · Luma Live 管理后台`;
    root.innerHTML = `
      <div class="admin-page-head"><h1>${config.title}</h1></div>
      <section class="admin-panel admin-filter" aria-label="${config.title}筛选"><div class="admin-filter-grid">${config.fields.map((field) => `<div class="admin-field"><label for="${field.id}">${field.label}</label><input class="admin-input" id="${field.id}" placeholder="${field.placeholder}"></div>`).join('')}</div><div class="admin-filter-actions"><button class="admin-btn secondary" id="resetBtn" type="button">重置</button><button class="admin-btn" id="searchBtn" type="button">查询</button></div></section>
      <section class="raw-report-kpis three-columns account-balance-summary" aria-label="${config.title}汇总"><div class="raw-report-kpi"><span>账号余额汇总</span><b id="balanceTotal"></b></div><div class="raw-report-kpi"><span>提现中汇总</span><b id="withdrawingTotal"></b></div><div class="raw-report-kpi"><span>已提现汇总</span><b id="withdrawnTotal"></b></div></section>
      <section class="admin-panel admin-table-panel">${config.showTableToolbar ? `<div class="admin-table-toolbar"><strong>${config.title}</strong><span id="resultCount"></span></div>` : ''}<div class="admin-table-wrap"><table class="admin-table has-actions" style="min-width:${config.columns.length * 170}px"><thead><tr>${config.columns.map((column) => `<th>${column}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div><div class="admin-pagination" id="pagination"><span>20 条 / 页</span><button class="admin-page-btn" disabled>‹</button><button class="admin-page-btn active" disabled>1</button><button class="admin-page-btn" disabled>›</button></div></section>`;

    const rows = document.getElementById('rows');
    const pagination = document.getElementById('pagination');
    const resultCount = document.getElementById('resultCount');
    const values = () => Object.fromEntries(config.fields.map((field) => [field.id, document.getElementById(field.id).value.trim().toLowerCase()]));
    function updateSummary(items) {
      const total = (field) => items.reduce((sum, item) => sum + Number(item[field] || 0), 0);
      document.getElementById('balanceTotal').textContent = format.money(total('balance'));
      document.getElementById('withdrawingTotal').textContent = format.money(total('withdrawing'));
      document.getElementById('withdrawnTotal').textContent = format.money(total('withdrawnTotal'));
    }
    function render(items) {
      if (resultCount) resultCount.textContent = `共 ${items.length} 条`;
      updateSummary(items);
      pagination.classList.toggle('state-hide', !items.length);
      rows.innerHTML = items.length ? items.map((item) => {
        const detailHref = config.detailHref?.(item);
        const rowAttrs = detailHref ? ` class="balance-account-row" data-detail="${escapeHtml(detailHref)}" tabindex="0" role="link" aria-label="查看 ${escapeHtml(item.guildName)} 余额变更记录"` : '';
        return `<tr${rowAttrs}>${config.cells(item).map((cell) => `<td>${cell}</td>`).join('')}</tr>`;
      }).join('') : `<tr><td colspan="${config.columns.length}"><div class="admin-empty"><strong>暂无${config.title}数据</strong><span>请调整筛选条件后重新查询</span></div></td></tr>`;
    }
    function query(showToast = true) {
      const items = config.rows.filter((item) => config.matches(item, values()));
      render(items);
      if (showToast) Luma.toast(`已查询到 ${items.length} 条记录`);
    }
    document.getElementById('searchBtn').onclick = () => query();
    document.getElementById('resetBtn').onclick = () => { config.fields.forEach((field) => { document.getElementById(field.id).value = ''; }); render(config.rows); Luma.toast('筛选条件已重置'); };
    config.fields.forEach((field) => document.getElementById(field.id).addEventListener('keydown', (event) => { if (event.key === 'Enter') query(); }));
    if (config.detailHref) {
      rows.addEventListener('click', (event) => {
        if (event.target.closest('a,button')) return;
        const row = event.target.closest('[data-detail]');
        if (row) location.href = row.dataset.detail;
      });
      rows.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const row = event.target.closest('[data-detail]');
        if (!row) return;
        event.preventDefault();
        location.href = row.dataset.detail;
      });
    }
    render(config.rows);
    Luma.registerStates({ '正常列表': () => render(config.rows), '无查询结果': () => render([]) });
    window.parent.postMessage({ type: 'luma-page', file: config.file }, '*');
  }

  function balanceChangeRecords(kind) {
    const isHost = kind === 'host';
    const config = isHost ? {
      accountTitle: '主播账户余额', accountLabel: '主播账户', backFile: 'admin-host-account-balance.html', pageFile: 'admin-host-balance-change-record.html',
      idParam: 'hostId', idKey: 'hostId', nameKey: 'hostName', rows: mock.hostAccountBalances, records: mock.hostBalanceChanges, incomeType: '收益分成', withdrawalType: '主播提现', recordPrefix: 'HBC'
    } : {
      accountTitle: '公会账户余额', accountLabel: '公会账户', backFile: 'admin-guild-account-balance.html', pageFile: 'admin-guild-balance-change-record.html',
      idParam: 'guildId', idKey: 'guildId', nameKey: 'guildName', rows: mock.guildAccountBalances, records: mock.guildBalanceChanges, incomeType: '收益分成', withdrawalType: '公会提现', recordPrefix: 'GBC'
    };
    const params = new URLSearchParams(location.search);
    const account = config.rows.find((item) => item[config.idKey] === params.get(config.idParam)) || config.rows[0];
    const accountId = account[config.idKey];
    const accountName = account[config.nameKey];
    const records = config.records[accountId] || (config.records[accountId] = []);
    const profileMeta = isHost ? `<span>主播 ID：${escapeHtml(accountId)}</span><span>${escapeHtml(account.guildName)} / ${escapeHtml(account.guildId)}</span>` : `<span>公会 ID：${escapeHtml(accountId)}</span>`;
    document.title = `${accountName}余额变更记录 · 财务分成 · Luma Live 管理后台`;
    root.innerHTML = `
      <a class="admin-back-link" href="${config.backFile}">‹ 返回${config.accountTitle}</a>
      <div class="admin-page-head"><div><h1>余额变更记录</h1></div><button class="admin-btn" id="openCreateBtn" type="button">余额变更</button></div>
      <section class="admin-panel admin-profile-panel admin-balance-overview">
        <div class="admin-profile-summary"><div class="admin-balance-account"><h2>${escapeHtml(accountName)}</h2><div class="admin-profile-meta">${profileMeta}</div></div><div class="admin-metrics"><div class="admin-metric"><span>余额</span><b id="currentBalance">${format.money(account.balance)}</b></div><div class="admin-metric"><span>累计已提</span><b id="withdrawnTotal">${format.money(account.withdrawnTotal)}</b></div><div class="admin-metric"><span>提现中</span><b>${format.money(account.withdrawing)}</b></div></div></div>
      </section>
      <section class="admin-panel admin-filter" aria-label="余额变更记录筛选"><div class="admin-filter-grid"><div class="admin-field"><label for="filterType">变更类型</label><select class="admin-input" id="filterType"><option value="">全部类型</option><option>${config.incomeType}</option><option>${config.withdrawalType}</option><option>分成修正</option></select></div><div class="admin-field"><label>变更时间</label><div class="admin-range admin-date-range"><input class="admin-input" id="filterStart" type="date"><span>至</span><input class="admin-input" id="filterEnd" type="date"></div></div></div><div class="admin-filter-actions"><button class="admin-btn secondary" id="resetBtn" type="button">重置</button><button class="admin-btn" id="searchBtn" type="button">查询</button></div></section>
      <section class="admin-panel admin-table-panel"><div class="admin-table-wrap"><table class="admin-table host-balance-change-table"><thead><tr><th>记录编号</th><th>变更时间</th><th>变更类型</th><th>变更金额</th><th>变更前余额</th><th>变更后余额</th><th>操作人</th><th>备注</th></tr></thead><tbody id="changeRows"></tbody></table></div><div class="admin-pagination" id="pagination"><span>20 条 / 页</span><button class="admin-page-btn" disabled>‹</button><button class="admin-page-btn active" disabled>1</button><button class="admin-page-btn" disabled>›</button></div></section>
      <div class="admin-overlay" id="createOverlay"><section class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="createTitle"><div class="admin-modal-head"><h2 id="createTitle">余额变更</h2><button class="admin-icon-btn" type="button" data-close-create aria-label="关闭">×</button></div><form id="createForm"><div class="admin-modal-body">
        <div class="admin-balance-change-account"><span>${config.accountLabel}</span><b>${escapeHtml(accountName)} / ${escapeHtml(accountId)}</b></div>
        <div class="admin-form-row admin-balance-change-row"><label for="changeAmount">变更金额（USD）</label><input class="admin-input" id="changeAmount" type="number" step="0.01" placeholder="正数增加，负数扣减" required></div>
        <div class="admin-form-row admin-balance-change-row is-top"><label for="changeRemark">备注</label><textarea class="admin-textarea" id="changeRemark" maxlength="100" placeholder="填写变更原因" required></textarea></div>
      </div><div class="admin-modal-foot"><button class="admin-btn secondary" type="button" data-close-create>取消</button><button class="admin-btn" type="submit">确认变更</button></div></form></section></div>`;

    const rows = document.getElementById('changeRows');
    const pagination = document.getElementById('pagination');
    const overlay = document.getElementById('createOverlay');
    const form = document.getElementById('createForm');
    function render(items) {
      pagination.classList.toggle('state-hide', !items.length);
      rows.innerHTML = items.length ? items.map((item) => { const direction = item.type === config.incomeType ? 'in' : item.type === config.withdrawalType ? 'out' : item.direction; return `<tr><td>${escapeHtml(item.recordNo)}</td><td>${escapeHtml(item.createdAt)}</td><td><span class="admin-status">${escapeHtml(item.type)}</span></td><td class="balance-change-amount ${direction === 'in' ? 'is-positive' : 'is-negative'}"><b>${direction === 'in' ? '+' : '-'}${format.money(item.amount)}</b></td><td>${format.money(item.balanceBefore)}</td><td><b>${format.money(item.balanceAfter)}</b></td><td>${escapeHtml(item.operator)}</td><td>${escapeHtml(item.remark)}</td></tr>`; }).join('') : '<tr><td colspan="8"><div class="admin-empty"><strong>暂无余额变更记录</strong><span>可新建一条分成修正记录</span></div></td></tr>';
    }
    function filterRecords() {
      const selectedType = document.getElementById('filterType').value;
      const start = document.getElementById('filterStart').value;
      const end = document.getElementById('filterEnd').value;
      if (start && end && start > end) return Luma.toast('结束时间不能早于开始时间');
      const items = records.filter((item) => (!selectedType || item.type === selectedType) && (!start || item.createdAt.slice(0, 10) >= start) && (!end || item.createdAt.slice(0, 10) <= end));
      render(items);
      Luma.toast(`已查询到 ${items.length} 条记录`);
    }
    function openCreate() {
      form.reset();
      overlay.classList.add('show');
    }
    function closeCreate() { overlay.classList.remove('show'); }
    document.getElementById('openCreateBtn').onclick = openCreate;
    document.querySelectorAll('[data-close-create]').forEach((button) => { button.onclick = closeCreate; });
    overlay.onclick = (event) => { if (event.target === overlay) closeCreate(); };
    document.getElementById('searchBtn').onclick = filterRecords;
    document.getElementById('resetBtn').onclick = () => { document.getElementById('filterType').value = ''; document.getElementById('filterStart').value = ''; document.getElementById('filterEnd').value = ''; render(records); Luma.toast('筛选条件已重置'); };
    form.onsubmit = (event) => {
      event.preventDefault();
      const signedAmount = Number(document.getElementById('changeAmount').value);
      if (!Number.isFinite(signedAmount) || signedAmount === 0) return Luma.toast('请输入不为 0 的变更金额');
      if (signedAmount < 0 && Math.abs(signedAmount) > account.balance) return Luma.toast('扣减金额不能大于当前账户余额');
      const direction = signedAmount > 0 ? 'in' : 'out';
      const amount = Math.abs(signedAmount);
      const before = account.balance;
      const after = Number((before + signedAmount).toFixed(2));
      records.unshift({ recordNo: `${config.recordPrefix}20260821${String(records.length + 1).padStart(4, '0')}`, type: '分成修正', direction, amount, balanceBefore: before, balanceAfter: after, operator: '后台管理员', remark: document.getElementById('changeRemark').value.trim(), createdAt: '2026-08-21 10:30:00' });
      account.balance = after;
      document.getElementById('currentBalance').textContent = format.money(after);
      closeCreate();
      render(records);
      Luma.toast('余额变更成功');
    };
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCreate(); });
    render(records);
    Luma.registerStates({ '正常记录': () => { closeCreate(); render(records); }, '新建记录': openCreate, '空记录': () => { closeCreate(); render([]); } });
    window.parent.postMessage({ type: 'luma-page', file: config.pageFile, query: location.search }, '*');
  }

  if (type === 'host-changes') balanceChangeRecords('host');
  else if (type === 'guild-changes') balanceChangeRecords('guild');
  else if (configs[type]) balanceList(configs[type]);
})();
