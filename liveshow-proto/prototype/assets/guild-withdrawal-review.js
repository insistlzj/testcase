(() => {
  const statusOrder = ['pending', 'approved', 'rejected'];
  const statusLabels = {
    pending: '待审核', approved: '已通过', rejected: '已驳回',
    firstApproved: '初审通过',
    firstRejected: '初审驳回',
    finalApproved: '终审通过',
    finalRejected: '终审驳回'
  };
  const storageKey = 'luma-guild-withdrawal-review-results-v1';
  const records = LUMA_MOCK.guildPortal.withdrawalApplications.map(item => ({ ...item }));
  const params = new URLSearchParams(location.search);
  let currentStatus = statusOrder.includes(params.get('status')) ? params.get('status') : 'pending';

  const statusTabs = document.getElementById('statusTabs');
  const recordCount = document.getElementById('recordCount');
  const withdrawalList = document.getElementById('withdrawalList');

  try {
    const savedResults = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    records.forEach(item => Object.assign(item, savedResults[item.requestId] || {}));
  } catch (error) {}

  function formatDateTime(value) {
    return LUMA_FORMAT.dateTime(value);
  }

  function statusGroup(status) {
    if (status === 'pending') return 'pending';
    return status.endsWith('Approved') ? 'approved' : 'rejected';
  }

  function recordFields(record) {
    return `<div class="guild-withdrawal-fields"><div class="guild-withdrawal-field"><span>提现时间</span><b>${formatDateTime(record.appliedAt)}</b></div><div class="guild-withdrawal-field amount"><span>提现金额</span><b class="guild-fiat-value">${record.amount}</b></div></div>`;
  }

  function renderTabs() {
    statusTabs.innerHTML = statusOrder.map(status => `<button class="${status === currentStatus ? 'active' : ''}" type="button" data-status="${status}">${statusLabels[status]}</button>`).join('');
    statusTabs.querySelectorAll('button').forEach(button => button.onclick = () => setStatus(button.dataset.status));
  }

  function renderList() {
    const visibleRecords = records.filter(item => statusGroup(item.status) === currentStatus);
    recordCount.textContent = `${statusLabels[currentStatus]} ${visibleRecords.length} 笔`;
    withdrawalList.innerHTML = visibleRecords.length ? visibleRecords.map(item => {
      const detailParams = new URLSearchParams({ id: item.requestId, status: currentStatus });
      return `<a class="guild-withdrawal-card" href="guild-withdrawal-review-detail.html?${detailParams}" aria-label="查看${item.name}的提现审核详情"><div class="guild-withdrawal-card-head"><div class="guild-withdrawal-host"><span class="directory-avatar">${item.avatar}</span><span class="guild-withdrawal-host-copy"><b>${item.name}</b><span>${item.hostId}</span></span></div><span class="guild-withdrawal-status ${item.status}">${statusLabels[item.status]}</span></div>${recordFields(item)}<i class="guild-withdrawal-card-chevron" aria-hidden="true">›</i></a>`;
    }).join('') : `<div class="guild-page-empty"><b>暂无提现申请</b><span>当前状态下没有记录</span></div>`;
  }

  function updateUrl() {
    const nextParams = new URLSearchParams();
    if (currentStatus !== 'pending') nextParams.set('status', currentStatus);
    history.replaceState(null, '', `guild-withdrawal-review.html${nextParams.size ? `?${nextParams}` : ''}`);
  }

  function setStatus(status) {
    currentStatus = status;
    updateUrl();
    renderTabs();
    renderList();
  }

  renderTabs();
  renderList();
  window.parent.postMessage({ type: 'luma-page', file: 'guild-withdrawal-review.html', query: location.search }, '*');
})();
