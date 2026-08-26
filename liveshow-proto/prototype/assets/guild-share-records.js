(function () {
  const dataModel = window.LUMA_GUILD_DATA;
  const hosts = dataModel.hosts;
  const hostById = new Map(hosts.map(host => [host.id, host]));
  const params = new URLSearchParams(location.search);
  const backLink = document.getElementById('backLink');
  const records = [
    { id: 'SR260815018', hostId: 'H102938', sharedAt: '2026-08-15 22:18', amount: 14310 },
    { id: 'SR260814026', hostId: 'H102954', sharedAt: '2026-08-14 21:06', amount: 8400 },
    { id: 'SR260814014', hostId: 'H103006', sharedAt: '2026-08-14 18:42', amount: 7300 },
    { id: 'SR260812031', hostId: 'H103208', sharedAt: '2026-08-12 23:10', amount: 4920 },
    { id: 'SR260811020', hostId: 'H102954', sharedAt: '2026-08-11 16:50', amount: -2260 },
    { id: 'SR260810022', hostId: 'H103121', sharedAt: '2026-08-10 20:36', amount: 5660 },
    { id: 'SR260808019', hostId: 'H102938', sharedAt: '2026-08-08 22:04', amount: 12280 },
    { id: 'SR260807024', hostId: 'H102954', sharedAt: '2026-08-07 21:28', amount: 7800 },
    { id: 'SR260805016', hostId: 'H103006', sharedAt: '2026-08-05 19:42', amount: 6420 },
    { id: 'SR260803009', hostId: 'H103121', sharedAt: '2026-08-03 18:16', amount: 4840 },
    { id: 'SR260801011', hostId: 'H103208', sharedAt: '2026-08-01 20:08', amount: 4180 },
    { id: 'SR260731028', hostId: 'H102938', sharedAt: '2026-07-31 22:12', amount: 11840 },
    { id: 'SR260728021', hostId: 'H102954', sharedAt: '2026-07-28 20:44', amount: 7200 },
    { id: 'SR260720017', hostId: 'H103006', sharedAt: '2026-07-20 19:26', amount: 5980 },
    { id: 'SR260712010', hostId: 'H103121', sharedAt: '2026-07-12 18:52', amount: 4620 },
    { id: 'SR260705006', hostId: 'H103208', sharedAt: '2026-07-05 21:14', amount: 3900 }
  ];

  const requestedMemberValue = params.get('members') || '';
  const requestedMembers = requestedMemberValue.split(',').filter(id => hostById.has(id));
  const noMembersSelected = requestedMemberValue === 'none';
  const selectedMemberIds = noMembersSelected ? new Set() : new Set(requestedMembers.length ? requestedMembers : hosts.map(host => host.id));
  const currentDate = '2026-08-24';
  const defaultRangeStart = '2026-08-01';
  const defaultRangeEnd = currentDate;
  const shortcutLabels = {
    today: '今日',
    yesterday: '昨日',
    thisWeek: '本周',
    lastWeek: '上周',
    thisMonth: '本月',
    lastMonth: '上月',
    custom: '自定义'
  };
  const requestedRangeStart = params.get('rangeStart') || '';
  const requestedRangeEnd = params.get('rangeEnd') || '';
  const hasRequestedRange = /^\d{4}-\d{2}-\d{2}$/.test(requestedRangeStart) && /^\d{4}-\d{2}-\d{2}$/.test(requestedRangeEnd) && requestedRangeStart <= requestedRangeEnd;
  let rangeStart = hasRequestedRange ? requestedRangeStart : defaultRangeStart;
  let rangeEnd = hasRequestedRange ? requestedRangeEnd : defaultRangeEnd;
  let selectedShortcut = hasRequestedRange && shortcutLabels[params.get('shortcut')] ? params.get('shortcut') : (hasRequestedRange ? 'custom' : 'thisMonth');

  if (params.get('from') === 'host-detail' && hostById.has(params.get('hostId'))) {
    backLink.href = `../people/guild-host-detail.html?${new URLSearchParams({ id: params.get('hostId') })}`;
    backLink.setAttribute('aria-label', '返回主播主页');
  }

  const memberPickerButton = document.getElementById('memberPickerButton');
  const list = document.getElementById('list');
  const shareRangePicker = document.getElementById('shareRangePicker');
  const shareRangeValue = document.getElementById('shareRangeValue');
  const shareShortcutPicker = document.getElementById('shareShortcutPicker');
  const shareShortcutValue = document.getElementById('shareShortcutValue');
  const shareShortcutMenu = document.getElementById('shareShortcutMenu');
  const shareRangeSheet = document.getElementById('shareRangeSheet');
  const shareRangeCancel = document.getElementById('shareRangeCancel');
  const shareRangeConfirm = document.getElementById('shareRangeConfirm');
  const shareCalendarPrev = document.getElementById('shareCalendarPrev');
  const shareCalendarNext = document.getElementById('shareCalendarNext');
  const shareCalendarTitle = document.getElementById('shareCalendarTitle');
  const shareCalendarDays = document.getElementById('shareCalendarDays');
  const shareRangeSelection = document.getElementById('shareRangeSelection');
  const earliestMonth = records.map(record => record.sharedAt.slice(0, 7)).sort()[0];
  const latestMonth = currentDate.slice(0, 7);
  const earliestDate = `${earliestMonth}-01`;
  let pendingRangeStart = rangeStart;
  let pendingRangeEnd = rangeEnd;
  let calendarMonth = rangeEnd.slice(0, 7);

  function dateObject(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
  }

  function dateValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function offsetDate(date, days) {
    const shifted = new Date(date);
    shifted.setDate(shifted.getDate() + days);
    return shifted;
  }

  function shortcutRange(shortcut) {
    const current = dateObject(currentDate);
    const weekdayOffset = (current.getDay() + 6) % 7;
    if (shortcut === 'today') return [currentDate, currentDate];
    if (shortcut === 'yesterday') {
      const yesterday = dateValue(offsetDate(current, -1));
      return [yesterday, yesterday];
    }
    if (shortcut === 'thisWeek') return [dateValue(offsetDate(current, -weekdayOffset)), currentDate];
    if (shortcut === 'lastWeek') {
      const end = offsetDate(current, -weekdayOffset - 1);
      return [dateValue(offsetDate(end, -6)), dateValue(end)];
    }
    if (shortcut === 'lastMonth') {
      return [dateValue(new Date(current.getFullYear(), current.getMonth() - 1, 1, 12)), dateValue(new Date(current.getFullYear(), current.getMonth(), 0, 12))];
    }
    return [defaultRangeStart, defaultRangeEnd];
  }

  function shiftMonth(value, amount) {
    const [year, month] = value.split('-').map(Number);
    return dateValue(new Date(year, month - 1 + amount, 1, 12)).slice(0, 7);
  }

  function renderCalendar() {
    const [yearText, monthText] = calendarMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const dayCount = new Date(year, month, 0).getDate();
    shareCalendarTitle.textContent = `${month}/${year}`;
    shareCalendarPrev.disabled = shiftMonth(calendarMonth, -1) < earliestMonth;
    shareCalendarNext.disabled = shiftMonth(calendarMonth, 1) > latestMonth;
    const blanks = Array.from({ length: firstWeekday }, () => '<span aria-hidden="true"></span>').join('');
    const days = Array.from({ length: dayCount }, (_, index) => {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
      const isStart = date === pendingRangeStart;
      const isEnd = date === pendingRangeEnd;
      const inRange = pendingRangeStart && pendingRangeEnd && date > pendingRangeStart && date < pendingRangeEnd;
      const classes = [isStart ? 'range-start' : '', isEnd ? 'range-end' : '', inRange ? 'in-range' : ''].filter(Boolean).join(' ');
      const disabled = date < earliestDate || date > currentDate;
      return `<button class="${classes}" type="button" role="gridcell" data-date="${date}"${disabled ? ' disabled' : ''} aria-selected="${Boolean(isStart || isEnd || inRange)}">${index + 1}</button>`;
    }).join('');
    shareCalendarDays.innerHTML = blanks + days;
    const end = pendingRangeEnd || pendingRangeStart;
    shareRangeSelection.textContent = pendingRangeStart ? `${LUMA_FORMAT.date(pendingRangeStart)}～${LUMA_FORMAT.date(end)}` : '请选择日期';
  }

  function renderMemberSummary() {
    const activeHosts = hosts.filter(host => selectedMemberIds.has(host.id));
    if (activeHosts.length === 1) {
      const host = activeHosts[0];
      memberPickerButton.innerHTML = `<span><b>${host.name}</b><small>${host.id}</small></span><strong class="guild-selected-host-count">已选1人</strong><em aria-hidden="true">›</em>`;
      memberPickerButton.setAttribute('aria-label', `选择主播，当前${host.name}，${host.id}，已选1人`);
    } else {
      memberPickerButton.innerHTML = `<span><b>主播</b></span><strong class="guild-selected-host-count">已选${activeHosts.length}人</strong><em aria-hidden="true">›</em>`;
      memberPickerButton.setAttribute('aria-label', `选择主播，已选${activeHosts.length}人`);
    }
    const selectParams = new URLSearchParams(location.search);
    selectParams.delete('members');
    selectParams.delete('month');
    selectParams.set('pickerTarget', 'share');
    if (noMembersSelected) selectParams.set('selected', 'none');
    else if (selectedMemberIds.size < hosts.length) selectParams.set('selected', [...selectedMemberIds].join(','));
    else selectParams.delete('selected');
    memberPickerButton.href = `guild-violation-host-select.html?${selectParams}`;
  }

  function renderList() {
    const rows = records.filter(record => {
      const sharedDate = record.sharedAt.slice(0, 10);
      return selectedMemberIds.has(record.hostId) && sharedDate >= rangeStart && sharedDate <= rangeEnd;
    }).sort((left, right) => right.sharedAt.localeCompare(left.sharedAt));
    list.innerHTML = rows.length ? rows.map(record => {
      const host = hostById.get(record.hostId);
      const negative = record.amount < 0;
      return `<article class="guild-share-record-row" role="row">
        <span class="guild-share-record-host" role="cell"><i class="directory-avatar">${host.avatar}</i><span><b>${host.name}</b><small>${host.id}</small></span></span>
        <time class="guild-share-record-period" role="cell">${LUMA_FORMAT.dateTime(record.sharedAt).replace(' ', '/')}</time>
        <strong class="guild-fiat-value${negative ? ' is-negative' : ''}" role="cell">${negative ? '-' : '+'}${LUMA_FORMAT.money(Math.abs(record.amount))}</strong>
      </article>`;
    }).join('') : '<div class="guild-page-empty"><b>暂无分成记录</b><span>请调整主播或日期范围</span></div>';
  }

  function updateUrl() {
    const nextParams = new URLSearchParams(location.search);
    nextParams.delete('month');
    nextParams.set('rangeStart', rangeStart);
    nextParams.set('rangeEnd', rangeEnd);
    nextParams.set('shortcut', selectedShortcut);
    history.replaceState(null, '', `guild-share-ledger.html?${nextParams}`);
    renderMemberSummary();
  }

  function updateRangeControls() {
    shareRangeValue.textContent = `${LUMA_FORMAT.date(rangeStart)}～${LUMA_FORMAT.date(rangeEnd)}`;
    shareRangePicker.setAttribute('aria-label', `选择分成日期范围，当前${shareRangeValue.textContent}`);
    shareShortcutValue.textContent = shortcutLabels[selectedShortcut];
    document.querySelectorAll('[data-share-shortcut]').forEach(button => {
      const active = button.dataset.shareShortcut === selectedShortcut;
      button.classList.toggle('active', active);
      button.setAttribute('aria-checked', String(active));
    });
  }

  function closeShortcutMenu() {
    shareShortcutMenu.hidden = true;
    shareShortcutPicker.setAttribute('aria-expanded', 'false');
  }

  function openRangeSheet() {
    closeShortcutMenu();
    pendingRangeStart = rangeStart;
    pendingRangeEnd = rangeEnd;
    calendarMonth = rangeEnd.slice(0, 7);
    renderCalendar();
    shareRangeSheet.hidden = false;
    document.body.classList.add('guild-sheet-open');
  }

  function closeRangeSheet() {
    shareRangeSheet.hidden = true;
    document.body.classList.remove('guild-sheet-open');
    shareRangePicker.focus();
  }

  function applyRange(start, end, shortcut) {
    rangeStart = start;
    rangeEnd = end;
    selectedShortcut = shortcut;
    updateUrl();
    updateRangeControls();
    renderList();
  }

  renderMemberSummary();
  shareRangePicker.onclick = openRangeSheet;
  shareShortcutPicker.onclick = event => {
    event.stopPropagation();
    shareShortcutMenu.hidden = !shareShortcutMenu.hidden;
    shareShortcutPicker.setAttribute('aria-expanded', String(!shareShortcutMenu.hidden));
  };
  shareShortcutMenu.onclick = event => event.stopPropagation();
  document.querySelectorAll('[data-share-shortcut]').forEach(button => {
    button.onclick = () => {
      closeShortcutMenu();
      if (button.dataset.shareShortcut === 'custom') {
        openRangeSheet();
        return;
      }
      const shortcut = button.dataset.shareShortcut;
      const [start, end] = shortcutRange(shortcut);
      applyRange(start, end, shortcut);
    };
  });
  shareRangeCancel.onclick = closeRangeSheet;
  shareRangeConfirm.onclick = () => {
    if (!pendingRangeStart) return;
    closeRangeSheet();
    applyRange(pendingRangeStart, pendingRangeEnd || pendingRangeStart, 'custom');
  };
  shareRangeSheet.onclick = event => { if (event.target === shareRangeSheet) closeRangeSheet(); };
  shareCalendarPrev.onclick = () => {
    const next = shiftMonth(calendarMonth, -1);
    if (next >= earliestMonth) { calendarMonth = next; renderCalendar(); }
  };
  shareCalendarNext.onclick = () => {
    const next = shiftMonth(calendarMonth, 1);
    if (next <= latestMonth) { calendarMonth = next; renderCalendar(); }
  };
  shareCalendarDays.onclick = event => {
    const option = event.target.closest('[data-date]');
    if (!option || option.disabled) return;
    const date = option.dataset.date;
    if (!pendingRangeStart || pendingRangeEnd) { pendingRangeStart = date; pendingRangeEnd = null; }
    else if (date < pendingRangeStart) { pendingRangeEnd = pendingRangeStart; pendingRangeStart = date; }
    else pendingRangeEnd = date;
    renderCalendar();
  };
  document.addEventListener('click', closeShortcutMenu);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !shareRangeSheet.hidden) closeRangeSheet(); });
  updateRangeControls();
  renderList();
  window.parent.postMessage({ type: 'luma-page', file: 'guild-share-ledger.html', query: location.search }, '*');
}());
