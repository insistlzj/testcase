(function () {
  const dataModel = window.LUMA_GUILD_DATA;
  const viewType = document.body.dataset.recordOverview === 'violations' ? 'violations' : 'live';
  const params = new URLSearchParams(location.search);
  const requestedHostValue = params.has('hostIds') ? params.get('hostIds') : params.get('hostId') || '';
  const noHostsSelected = requestedHostValue === 'none';
  const requestedHostIds = requestedHostValue.split(',').filter(id => dataModel.hosts.some(host => host.id === id));
  const selectedHosts = dataModel.hosts.filter(host => requestedHostIds.includes(host.id));
  const selectedHostIds = new Set(selectedHosts.map(host => host.id));
  const hasHostFilter = noHostsSelected || (selectedHosts.length > 0 && selectedHosts.length < dataModel.hosts.length);
  const selectedHost = selectedHosts.length === 1 ? selectedHosts[0] : null;
  let currentViolationScope = params.get('scope') === 'account' ? 'account' : 'live';
  const allDates = dataModel.dates.slice().sort();
  const allDateSet = new Set(allDates);
  const dataTodayValue = allDates[allDates.length - 1];
  const availableMonths = [...new Set(allDates.map(date => date.slice(0, 7)))].sort().reverse();
  const shortcutLabels = { today: '今日', yesterday: '昨日', thisWeek: '本周', lastWeek: '上周', thisMonth: '本月', lastMonth: '上月', custom: '自定义' };
  const shortcutKeys = Object.keys(shortcutLabels);
  const rangePickerButton = document.getElementById('rangePickerButton');
  const rangePickerValue = document.getElementById('rangePickerValue');
  const shortcutPicker = document.getElementById('shortcutPicker');
  const shortcutPickerValue = document.getElementById('shortcutPickerValue');
  const shortcutMenu = document.getElementById('shortcutMenu');
  const violationScopePicker = document.getElementById('violationScopePicker');
  const violationScopeValue = document.getElementById('violationScopeValue');
  const violationScopeMenu = document.getElementById('violationScopeMenu');
  const hostPicker = document.getElementById('hostPicker');
  const recordList = document.getElementById('recordList');
  const rangeSheet = document.getElementById('rangeSheet');
  const rangeSheetCancel = document.getElementById('rangeSheetCancel');
  const rangeSheetConfirm = document.getElementById('rangeSheetConfirm');
  const calendarPrev = document.getElementById('calendarPrev');
  const calendarNext = document.getElementById('calendarNext');
  const calendarTitle = document.getElementById('calendarTitle');
  const calendarDays = document.getElementById('calendarDays');
  const rangeSelection = document.getElementById('rangeSelection');
  const violationCopy = {
    labels: ['违规主播', '违规类型', '举报时间', '处理结果'],
    types: { '色情低俗': '色情低俗', '涉及宗教政治': '涉及宗教政治', '暴恐血腥': '暴恐血腥', '未成年有害': '未成年有害', '其他': '其他' },
    results: { '封禁': '封禁', '警告': '警告', '关播': '关播' }
  };
  const violationTypes = ['色情低俗', '涉及宗教政治', '暴恐血腥', '未成年有害', '其他'];
  const accountViolations = [
    { id: 'AV26081501', hostId: 'H102938', type: '色情低俗', reportedAt: '2026-08-15 09:42', disposition: '警告', locale: 'zh' },
    { id: 'AV26081202', hostId: 'H103208', type: '未成年有害', reportedAt: '2026-08-12 16:20', disposition: '封禁', locale: 'zh' },
    { id: 'AV26080503', hostId: 'H102954', type: '其他', reportedAt: '2026-08-05 11:08', disposition: '警告', locale: 'zh' }
  ];

  function dateObject(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
  }

  function dateValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function compactDate(value) {
    const [, month, day] = value.split('-');
    return `${Number(day)}/${Number(month)}`;
  }

  function addDays(date, amount) {
    const value = new Date(date);
    value.setDate(value.getDate() + amount);
    return value;
  }

  function normalizeRange(start, end) {
    const dates = allDates.filter(date => date >= start && date <= end);
    return dates.length ? [dates[0], dates[dates.length - 1]] : [dataTodayValue, dataTodayValue];
  }

  function shortcutRange(shortcut) {
    const dataToday = dateObject(dataTodayValue);
    const weekday = dataToday.getDay() || 7;
    const thisWeekStart = addDays(dataToday, 1 - weekday);
    if (shortcut === 'yesterday') {
      const day = dateValue(addDays(dataToday, -1));
      return normalizeRange(day, day);
    }
    if (shortcut === 'thisWeek') return normalizeRange(dateValue(thisWeekStart), dataTodayValue);
    if (shortcut === 'lastWeek') return normalizeRange(dateValue(addDays(thisWeekStart, -7)), dateValue(addDays(thisWeekStart, -1)));
    if (shortcut === 'thisMonth') return normalizeRange(dateValue(new Date(dataToday.getFullYear(), dataToday.getMonth(), 1, 12)), dataTodayValue);
    if (shortcut === 'lastMonth') return normalizeRange(dateValue(new Date(dataToday.getFullYear(), dataToday.getMonth() - 1, 1, 12)), dateValue(new Date(dataToday.getFullYear(), dataToday.getMonth(), 0, 12)));
    return [dataTodayValue, dataTodayValue];
  }

  const requestedRangeStart = params.get('rangeStart') || '';
  const requestedRangeEnd = params.get('rangeEnd') || '';
  const hasRequestedRange = allDateSet.has(requestedRangeStart) && allDateSet.has(requestedRangeEnd) && requestedRangeEnd >= requestedRangeStart;
  const requestedShortcut = shortcutKeys.includes(params.get('shortcut')) ? params.get('shortcut') : null;
  let selectedShortcut = requestedShortcut || (hasRequestedRange ? 'custom' : 'today');
  const initialRange = hasRequestedRange ? [requestedRangeStart, requestedRangeEnd] : shortcutRange(selectedShortcut === 'custom' ? 'today' : selectedShortcut);
  let rangeStart = initialRange[0];
  let rangeEnd = initialRange[1];
  let pendingRangeStart = rangeStart;
  let pendingRangeEnd = rangeEnd;
  let calendarMonth = rangeEnd.slice(0, 7);

  function liveRows() {
    return dataModel.hosts.map(host => {
      const days = allDates.filter(date => date >= rangeStart && date <= rangeEnd).map(date => dataModel.getDay(host.id, date));
      return {
        host,
        sessions: days.reduce((sum, day) => sum + day.sessionCount, 0),
        effectiveDays: days.reduce((sum, day) => sum + (day.effective ? 1 : 0), 0),
        duration: days.reduce((sum, day) => sum + day.duration, 0)
      };
    }).filter(item => item.sessions > 0).sort((left, right) => right.sessions - left.sessions || right.duration - left.duration);
  }

  function renderLiveList() {
    const rows = liveRows();
    recordList.innerHTML = rows.length ? rows.map(item => {
      const query = new URLSearchParams({ hostId: item.host.id, from: 'all-live', hostPeriod: rangeEnd.slice(0, 7), rangeStart, rangeEnd });
      if (selectedShortcut !== 'custom') query.set('shortcut', selectedShortcut);
      return `<a class="guild-record-overview-row" href="guild-host-data.html?${query}">
        <span class="guild-record-overview-host"><i class="directory-avatar${item.host.live ? ' is-live' : ''}"${item.host.live ? ' aria-label="直播中"' : ''}>${item.host.avatar}</i><span><b>${item.host.name}</b><small>${item.host.id}</small></span></span>
        <b>${LUMA_FORMAT.integer(item.sessions)}</b>
        <b>${LUMA_FORMAT.integer(item.effectiveDays)}</b>
        <b>${dataModel.formatDuration(item.duration)}</b>
        <i class="review-arrow" aria-hidden="true">›</i>
      </a>`;
    }).join('') : '<div class="guild-page-empty"><b>暂无直播数据</b><span>请选择其他日期范围</span></div>';
  }

  function renderViolationList() {
    const sourceRecords = currentViolationScope === 'account' ? accountViolations : dataModel.getViolations(rangeStart, rangeEnd);
    const records = sourceRecords.filter(record => violationTypes.includes(record.type)).filter(record => record.reportedAt.slice(0, 10) >= rangeStart && record.reportedAt.slice(0, 10) <= rangeEnd).filter(record => !hasHostFilter || selectedHostIds.has(record.hostId));
    const rows = records.map(record => ({ ...record, host: dataModel.hosts.find(host => host.id === record.hostId) })).filter(item => item.host).sort((left, right) => right.reportedAt.localeCompare(left.reportedAt));
    const emptyState = noHostsSelected
      ? '<div class="guild-page-empty"><b>未选择主播</b><span>请选择主播后查看违规记录</span></div>'
      : '<div class="guild-page-empty"><b>暂无违规数据</b><span>请选择其他日期范围</span></div>';
    recordList.innerHTML = rows.length ? rows.map(item => {
      const query = new URLSearchParams({ id: item.host.id, from: 'all-violations', rangeStart, rangeEnd });
      const copy = violationCopy;
      const labels = currentViolationScope === 'account' ? ['违规账号', '违规类型', '发生时间', '处理结果'] : copy.labels;
      if (selectedShortcut !== 'custom') query.set('shortcut', selectedShortcut);
      if (selectedHost) query.set('hostId', selectedHost.id);
      else if (hasHostFilter) query.set('hostIds', selectedHosts.map(host => host.id).join(','));
      return `<article class="guild-record-overview-row guild-violation-record-row">
        <dl class="guild-violation-message-card">
          <div><dt>${labels[0]}</dt><dd><a href="../people/guild-host-detail.html?${query}" aria-label="查看${item.host.name}主播主页"><strong>${item.host.name}</strong> (${item.host.id})</a></dd></div>
          <div><dt>${labels[1]}</dt><dd><strong>${copy.types[item.type] || item.type}</strong></dd></div>
          <div><dt>${labels[2]}</dt><dd>${LUMA_FORMAT.dateTime(item.reportedAt)}</dd></div>
          <div><dt>${labels[3]}</dt><dd>${item.disposition ? (copy.results[item.disposition] || item.disposition) : '-'}</dd></div>
        </dl>
      </article>`;
    }).join('') : emptyState;
  }

  function renderList() {
    if (viewType === 'violations') renderViolationList();
    else renderLiveList();
  }

  function renderFilters() {
    rangePickerValue.textContent = `${LUMA_FORMAT.date(rangeStart)}～${LUMA_FORMAT.date(rangeEnd)}`;
    rangePickerButton.setAttribute('aria-label', `选择日期范围，当前${rangePickerValue.textContent}`);
    if (shortcutPicker && shortcutPickerValue && shortcutMenu) {
      shortcutPickerValue.textContent = shortcutLabels[selectedShortcut];
      shortcutPicker.setAttribute('aria-label', `快捷日期筛选，当前${shortcutLabels[selectedShortcut]}`);
      shortcutMenu.querySelectorAll('[data-range-shortcut]').forEach(button => {
        const active = button.dataset.rangeShortcut === selectedShortcut;
        button.classList.toggle('active', active);
        button.setAttribute('aria-checked', String(active));
      });
    }
    if (hostPicker) {
      const activeHosts = hasHostFilter ? selectedHosts : dataModel.hosts;
      if (viewType === 'violations') {
        hostPicker.innerHTML = `<span>已选${activeHosts.length}人</span><i aria-hidden="true">›</i>`;
        hostPicker.setAttribute('aria-label', `选择主播，已选${activeHosts.length}人`);
      } else if (activeHosts.length === 1) {
        const host = activeHosts[0];
        hostPicker.innerHTML = `<span><b>${host.name}</b><small>${host.id}</small></span><strong class="guild-selected-host-count">已选1人</strong><em aria-hidden="true">›</em>`;
        hostPicker.setAttribute('aria-label', `选择主播，当前${host.name}，${host.id}，已选1人`);
      } else {
        hostPicker.innerHTML = `<span><b>主播</b></span><strong class="guild-selected-host-count">已选${activeHosts.length}人</strong><em aria-hidden="true">›</em>`;
        hostPicker.setAttribute('aria-label', `选择主播，已选${activeHosts.length}人`);
      }
      const selectParams = new URLSearchParams(location.search);
      selectParams.delete('hostId');
      selectParams.delete('hostIds');
      if (noHostsSelected) selectParams.set('selected', 'none');
      else if (hasHostFilter) selectParams.set('selected', selectedHosts.map(host => host.id).join(','));
      else selectParams.delete('selected');
      hostPicker.href = `guild-violation-host-select.html${selectParams.size ? `?${selectParams}` : ''}`;
    }
    document.querySelectorAll('[data-violation-scope]').forEach(button => {
      const active = button.dataset.violationScope === currentViolationScope;
      button.classList.toggle('active', active);
      button.setAttribute('aria-checked', String(active));
    });
    if (violationScopeValue) violationScopeValue.textContent = currentViolationScope === 'account' ? '账号违规' : '直播间违规';
  }

  function applyRange(start, end, shortcut = 'custom') {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set('rangeStart', start);
    nextParams.set('rangeEnd', end);
    nextParams.set('shortcut', shortcut);
    location.search = nextParams.toString();
  }

  function renderCalendar() {
    const [yearText, monthText] = calendarMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const dayCount = new Date(year, month, 0).getDate();
    const monthIndex = availableMonths.indexOf(calendarMonth);
    calendarTitle.textContent = `${month}/${year}`;
    calendarPrev.disabled = monthIndex === availableMonths.length - 1;
    calendarNext.disabled = monthIndex <= 0;
    const blanks = Array.from({ length: firstWeekday }, () => '<span aria-hidden="true"></span>').join('');
    const days = Array.from({ length: dayCount }, (_, index) => {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
      const isStart = date === pendingRangeStart;
      const isEnd = date === pendingRangeEnd;
      const inRange = pendingRangeStart && pendingRangeEnd && date > pendingRangeStart && date < pendingRangeEnd;
      const classes = [isStart ? 'range-start' : '', isEnd ? 'range-end' : '', inRange ? 'in-range' : ''].filter(Boolean).join(' ');
      return `<button class="${classes}" type="button" role="gridcell" data-date="${date}"${allDateSet.has(date) ? '' : ' disabled'} aria-selected="${Boolean(isStart || isEnd || inRange)}">${index + 1}</button>`;
    }).join('');
    calendarDays.innerHTML = blanks + days;
    const end = pendingRangeEnd || pendingRangeStart;
    rangeSelection.textContent = pendingRangeStart ? `${LUMA_FORMAT.date(pendingRangeStart)}～${LUMA_FORMAT.date(end)}` : '请选择日期';
  }

  function openRangeSheet() {
    closeShortcutMenu();
    closeViolationScopeMenu();
    pendingRangeStart = rangeStart;
    pendingRangeEnd = rangeEnd;
    calendarMonth = rangeEnd.slice(0, 7);
    renderCalendar();
    rangeSheet.hidden = false;
    document.body.classList.add('guild-sheet-open');
  }

  function closeRangeSheet() {
    rangeSheet.hidden = true;
    document.body.classList.remove('guild-sheet-open');
    rangePickerButton.focus();
  }

  function closeShortcutMenu() {
    if (!shortcutMenu || !shortcutPicker) return;
    shortcutMenu.hidden = true;
    shortcutPicker.setAttribute('aria-expanded', 'false');
  }

  function closeViolationScopeMenu() {
    if (!violationScopeMenu || !violationScopePicker) return;
    violationScopeMenu.hidden = true;
    violationScopePicker.setAttribute('aria-expanded', 'false');
  }

  if (shortcutMenu) shortcutMenu.innerHTML = shortcutKeys.map(key => `<button type="button" role="menuitemradio" data-range-shortcut="${key}">${shortcutLabels[key]}</button>`).join('');
  rangePickerButton.onclick = openRangeSheet;
  rangeSheetCancel.onclick = closeRangeSheet;
  rangeSheetConfirm.onclick = () => {
    if (!pendingRangeStart) return;
    applyRange(pendingRangeStart, pendingRangeEnd || pendingRangeStart);
  };
  rangeSheet.onclick = event => { if (event.target === rangeSheet) closeRangeSheet(); };
  calendarPrev.onclick = () => {
    const nextMonth = availableMonths[availableMonths.indexOf(calendarMonth) + 1];
    if (nextMonth) { calendarMonth = nextMonth; renderCalendar(); }
  };
  calendarNext.onclick = () => {
    const nextMonth = availableMonths[availableMonths.indexOf(calendarMonth) - 1];
    if (nextMonth) { calendarMonth = nextMonth; renderCalendar(); }
  };
  calendarDays.onclick = event => {
    const option = event.target.closest('[data-date]');
    if (!option || option.disabled) return;
    const date = option.dataset.date;
    if (!pendingRangeStart || pendingRangeEnd) { pendingRangeStart = date; pendingRangeEnd = null; }
    else if (date < pendingRangeStart) { pendingRangeEnd = pendingRangeStart; pendingRangeStart = date; }
    else pendingRangeEnd = date;
    renderCalendar();
  };
  if (shortcutPicker && shortcutMenu) {
    shortcutPicker.onclick = event => {
      event.stopPropagation();
      shortcutMenu.hidden = !shortcutMenu.hidden;
      shortcutPicker.setAttribute('aria-expanded', String(!shortcutMenu.hidden));
    };
    shortcutMenu.onclick = event => event.stopPropagation();
    shortcutMenu.querySelectorAll('[data-range-shortcut]').forEach(button => {
      button.onclick = () => {
        const shortcut = button.dataset.rangeShortcut;
        closeShortcutMenu();
        if (shortcut === 'custom') { openRangeSheet(); return; }
        const [start, end] = shortcutRange(shortcut);
        applyRange(start, end, shortcut);
      };
    });
  }
  if (violationScopePicker && violationScopeMenu) {
    violationScopePicker.onclick = event => {
      event.stopPropagation();
      violationScopeMenu.hidden = !violationScopeMenu.hidden;
      violationScopePicker.setAttribute('aria-expanded', String(!violationScopeMenu.hidden));
    };
    violationScopeMenu.onclick = event => event.stopPropagation();
  }
  document.addEventListener('click', () => {
    closeShortcutMenu();
    closeViolationScopeMenu();
  });
  document.querySelectorAll('[data-violation-scope]').forEach(button => button.onclick = () => {
    const nextParams = new URLSearchParams(location.search);
    if (button.dataset.violationScope === 'account') nextParams.set('scope', 'account');
    else nextParams.delete('scope');
    location.search = nextParams.toString();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (violationScopeMenu && !violationScopeMenu.hidden) closeViolationScopeMenu();
    else if (shortcutMenu && !shortcutMenu.hidden) closeShortcutMenu();
    else if (!rangeSheet.hidden) closeRangeSheet();
  });
  renderFilters();
  renderList();
  if (viewType === 'violations' && selectedHost && params.get('from') === 'host-detail') {
    const backLink = document.getElementById('backLink');
    backLink.href = `../people/guild-host-detail.html?id=${encodeURIComponent(selectedHost.id)}`;
    backLink.setAttribute('aria-label', '返回主播主页');
  }
  window.parent.postMessage({ type: 'luma-page', file: viewType === 'violations' ? 'guild-all-violations.html' : 'guild-all-live.html', query: location.search }, '*');
}());
