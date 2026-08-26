(function () {
  function addReportCenterBackButton() {
    if ((document.body && document.body.dataset.reportCenterBack === 'false') || !document.querySelector('.admin-breadcrumb')?.textContent.includes('数据分析')) return;
    const pageHead = document.querySelector('.admin-page-head');
    const heading = pageHead && pageHead.querySelector('h1');
    if (!heading || pageHead.querySelector('.admin-report-back')) return;
    const titleGroup = document.createElement('div');
    titleGroup.className = 'admin-report-page-title';
    const back = document.createElement('a');
    back.className = 'admin-report-back';
    back.href = 'admin-report-center.html';
    back.title = '返回报表中心';
    back.setAttribute('aria-label', '返回报表中心');
    back.textContent = '←';
    heading.before(titleGroup);
    titleGroup.append(back, heading);
    const style = document.createElement('style');
    style.textContent = '.admin-report-page-title{display:flex;align-items:center;gap:10px}.admin-report-back{width:36px;height:36px;display:grid;place-items:center;border:1px solid var(--admin-border);border-radius:var(--admin-radius-sm);background:var(--admin-surface);color:var(--admin-ink);font-size:20px;line-height:1;text-decoration:none}.admin-report-back:hover{border-color:var(--admin-primary);background:var(--admin-primary-soft)}';
    document.head.appendChild(style);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addReportCenterBackButton);
  else addReportCenterBackButton();

  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const compact = (value) => window.LUMA_FORMAT.compact(value);
  const metricHelp = {
    '充值用户': '至少完成 1 笔有效充值订单的去重用户。',
    '充值订单': '有效充值订单总笔数，已取消和支付失败订单不计。',
    '充值金额': '有效充值订单实付金额合计。',
    '充值金币': '有效充值订单实际到账的购买金币合计，不包含活动赠送金币。',
    '赠送金币': '充值活动随有效订单赠送的金币合计。',
    '消费用户': '至少完成 1 笔有效金币消费的去重用户。',
    '消费金币': '有效消费流水扣除的金币合计。',
    '送礼物总价值': '有效送礼记录中的礼物金币价值合计。',
    '新增注册用户': '完成注册的去重用户。',
    '登录用户': '至少成功登录 1 次的去重用户。',
    '登录次数': '成功登录记录总数。',
    '活跃用户': '产生有效前台行为的去重用户。',
    '进入直播间用户': '至少进入 1 次直播间的去重用户。',
    '认证通过主播': '通过主播认证审核的主播。',
    '开播主播': '至少成功开播 1 次的主播。',
    '达成有效天主播': '按日统计单日累计直播达到 3 小时的主播，每名主播每个自然日最多计 1 次。',
    '违规主播': '至少产生 1 条有效违规记录的去重主播。',
    '违规次数': '已确认的违规记录总数。',
    '开播次数': '成功开始直播的场次总数。',
    '开播时长': '有效直播场次的直播时长合计。',
    '观众人数': '进入直播间的观众人数。',
    '用户充值金额': '有效充值订单实付金额合计。',
    '平台退款金额': '已完成的充值退款金额合计，包含用户申请退款和平台主动退款。',
    '公会分成金额': '按生效分成规则计算的公会应分成金额。',
    '主播分成金额': '按生效分成规则计算的主播应分成金额。',
    '平台净收益': '用户充值金额减去平台退款金额、支付渠道手续费、公会分成金额和主播分成金额。',
    '分成笔数': '生成的分成明细总笔数。',
    '已分成金额': '已完成分成的金额合计。',
    '平台分成金额': '按生效分成规则计算的平台应分成金额。',
    '申请提现用户': '提交提现申请的去重用户。',
    '申请提现笔数': '提交的提现申请总笔数。',
    '申请提现金额': '提现申请金额合计。',
    '提现成功笔数': '状态为提现成功的记录总笔数。',
    '提现成功金额': '成功到账的提现金额合计。',
    '提现失败金额': '提现失败记录的金额合计。',
    '分成笔数': '进入分成流程的明细总笔数。',
    '总分成金额': '主播侧分成金额与公会侧分成金额之和。',
    '主播侧分成金额': '向主播侧完成分成的金额合计。',
    '公会侧分成金额': '向公会侧完成分成的金额合计。',
    '已分成主播': '至少完成 1 笔分成的去重主播。',
    '已分成公会': '至少完成 1 笔分成的去重公会。',
    '分成失败金额': '分成失败记录的金额合计。'
  };

  const baseMetricLabel = (label) => label.replace(/（[^）]+）/g, '').trim();
  const conciseHelp = (value) => String(value).replace(/统计期内/g, '').replace(/当前筛选条件下(?:的)?/g, '');
  const metricDefinition = (label) => conciseHelp(metricHelp[baseMetricLabel(label)] || `${baseMetricLabel(label)}汇总值。`);

  function decorateRawMetricCards(root = document) {
    const cards = [];
    if (root.nodeType === 1 && root.matches('.raw-report-kpi')) cards.push(root);
    if (root.querySelectorAll) cards.push(...root.querySelectorAll('.raw-report-kpi'));
    cards.forEach((card) => {
      if (card.dataset.helpReady === 'true') return;
      const labelNode = card.querySelector(':scope > span');
      if (!labelNode) return;
      const label = labelNode.textContent.trim();
      const text = document.createElement('span');
      text.className = 'raw-report-kpi-label-text';
      text.textContent = label;
      const help = document.createElement('button');
      help.className = 'analytics-help';
      help.type = 'button';
      help.dataset.help = metricDefinition(label);
      help.setAttribute('aria-label', `${label}口径：${help.dataset.help}`);
      help.textContent = '?';
      labelNode.className = 'raw-report-kpi-label';
      labelNode.replaceChildren(text, help);
      card.dataset.helpReady = 'true';
    });
  }

  function observeRawMetricCards() {
    decorateRawMetricCards();
    new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === 1) decorateRawMetricCards(node);
    }))).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeRawMetricCards);
  else observeRawMetricCards();

  function metrics(target, items) {
    target.innerHTML = items.map((item) => {
      let label = item.label, value = String(item.value);
      const help = conciseHelp(item.help);
      if (value.startsWith('$')) { label = label.includes('（$）') ? label : `${label}（$）`; value = value.slice(1); }
      if (value.endsWith(' 金币')) { label = label.includes('（金币）') ? label : `${label}（金币）`; value = value.slice(0,-3); }
      return `<article class="admin-panel analytics-kpi">
      <span class="analytics-kpi-label"><strong>${escape(label)}</strong><button class="analytics-help" type="button" data-help="${escape(help)}" aria-label="${escape(label)}口径：${escape(help)}">?</button></span>
      <b class="analytics-kpi-value">${escape(value)}</b>
      <span class="analytics-kpi-foot"><em class="analytics-delta ${item.delta < 0 ? 'down' : 'up'}">${item.delta > 0 ? '+' : ''}${item.delta}%</em>${escape(item.compare || '较上期')}</span>
    </article>`;
    }).join('');
  }

  function lineChart(target, labels, series) {
    const width = 820, height = 250, left = 48, right = 18, top = 18, bottom = 32;
    const plotWidth = width - left - right, plotHeight = height - top - bottom;
    const values = series.flatMap((item) => item.values.map(Number));
    const max = Math.max(...values, 1), min = Math.min(0, ...values), span = max - min || 1;
    const x = (index) => left + plotWidth * index / Math.max(labels.length - 1, 1);
    const y = (value) => top + plotHeight - (value - min) / span * plotHeight;
    const grids = Array.from({ length: 5 }, (_, index) => {
      const gridY = top + plotHeight * index / 4;
      return `<line class="grid" x1="${left}" y1="${gridY}" x2="${width - right}" y2="${gridY}"/><text x="${left - 8}" y="${gridY + 3}" text-anchor="end">${compact(max - span * index / 4)}</text>`;
    }).join('');
    const paths = series.map((item, seriesIndex) => {
      const color = item.color || ['#222', '#777', '#aaa'][seriesIndex % 3];
      const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
      const dots = item.values.map((value, index) => `<circle class="point" cx="${x(index)}" cy="${y(value)}" r="3.5" fill="${color}"><title>${escape(labels[index])} ${escape(item.name)}：${escape(item.format ? item.format(value) : compact(value))}</title></circle>`).join('');
      return `<polyline class="line" points="${points}" stroke="${color}"/>${dots}`;
    }).join('');
    const axisLabels = labels.map((label, index) => `<text x="${x(index)}" y="${height - 8}" text-anchor="middle">${escape(label)}</text>`).join('');
    target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="趋势图">${grids}${paths}${axisLabels}</svg>`;
    const legend = target.parentElement.querySelector('.analytics-legend');
    if (legend) legend.innerHTML = series.map((item, index) => `<span><i style="background:${item.color || ['#222', '#777', '#aaa'][index % 3]}"></i>${escape(item.name)}</span>`).join('');
  }

  function bars(target, items, formatter = compact) {
    const max = Math.max(...items.map((item) => Number(item.value)), 1);
    target.innerHTML = `<div class="analytics-bars">${items.map((item, index) => `<div class="analytics-bar-item"><span class="analytics-bar-value">${escape(formatter(item.value))}</span><div class="analytics-bar" style="height:${Math.max(5, Number(item.value) / max * 86)}%;background:${['#222', '#666', '#999', '#bbb'][index % 4]}" title="${escape(item.label)}：${escape(formatter(item.value))}"></div><span class="analytics-bar-label" title="${escape(item.label)}">${escape(item.label)}</span></div>`).join('')}</div>`;
  }

  function groupedBars(target, labels, series) {
    const width = 820, height = 270, left = 50, right = 18, top = 24, bottom = 42;
    const plotWidth = width - left - right, plotHeight = height - top - bottom;
    const values = series.flatMap((item) => item.values.map(Number));
    const max = Math.max(...values, 1);
    const groupWidth = plotWidth / Math.max(labels.length, 1);
    const barWidth = Math.min(24, groupWidth / Math.max(series.length + 1, 2));
    const colors = ['#222', '#666', '#999', '#c4c4c4'];
    const grids = Array.from({ length: 5 }, (_, index) => {
      const gridY = top + plotHeight * index / 4;
      return `<line class="grid" x1="${left}" y1="${gridY}" x2="${width - right}" y2="${gridY}"/><text x="${left - 8}" y="${gridY + 3}" text-anchor="end">${compact(max - max * index / 4)}</text>`;
    }).join('');
    const marks = labels.map((label, labelIndex) => {
      const totalWidth = barWidth * series.length;
      const startX = left + groupWidth * labelIndex + (groupWidth - totalWidth) / 2;
      const rects = series.map((item, seriesIndex) => {
        const value = Number(item.values[labelIndex] || 0);
        const barHeight = value / max * plotHeight;
        const color = item.color || colors[seriesIndex % colors.length];
        return `<rect x="${startX + seriesIndex * barWidth}" y="${top + plotHeight - barHeight}" width="${Math.max(5, barWidth - 4)}" height="${barHeight}" fill="${color}"><title>${escape(label)} ${escape(item.name)}：${escape(item.format ? item.format(value) : compact(value))}</title></rect>`;
      }).join('');
      return `${rects}<text x="${left + groupWidth * labelIndex + groupWidth / 2}" y="${height - 10}" text-anchor="middle">${escape(label)}</text>`;
    }).join('');
    target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="分组柱状图">${grids}${marks}</svg>`;
    const legend = target.parentElement.querySelector('.analytics-legend');
    if (legend) legend.innerHTML = series.map((item, index) => `<span><i style="background:${item.color || colors[index % colors.length]}"></i>${escape(item.name)}</span>`).join('');
  }

  function validateDates(start, end) {
    if (start && end && start > end) {
      Luma.toast('结束日期不能早于开始日期');
      return false;
    }
    return true;
  }

  function bindTimePresets(startInput, endInput, onApply) {
    const anchor = new Date(`${endInput.value || '2026-08-07'}T00:00:00`);
    const buttons = [...document.querySelectorAll('[data-time-range]')];
    const copy = (date) => new Date(date.getTime());
    const shift = (date, days) => { const value = copy(date); value.setDate(value.getDate() + days); return value; };
    const format = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const resolve = (key) => {
      const weekday = anchor.getDay() || 7;
      if (key === 'today') return [anchor, anchor];
      if (key === 'yesterday') return [shift(anchor, -1), shift(anchor, -1)];
      if (key === 'last7') return [shift(anchor, -6), anchor];
      if (key === 'last30') return [shift(anchor, -29), anchor];
      if (key === 'thisWeek') return [shift(anchor, 1 - weekday), anchor];
      if (key === 'lastWeek') return [shift(anchor, -weekday - 6), shift(anchor, -weekday)];
      if (key === 'thisMonth') return [new Date(anchor.getFullYear(), anchor.getMonth(), 1), anchor];
      if (key === 'lastMonth') return [new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1), new Date(anchor.getFullYear(), anchor.getMonth(), 0)];
      return [shift(anchor, -6), anchor];
    };
    const apply = (key, emit = true) => {
      const [start, end] = resolve(key);
      startInput.value = format(start);
      endInput.value = format(end);
      buttons.forEach((button) => button.classList.toggle('active', button.dataset.timeRange === key));
      if (emit && onApply) onApply(buttons.find((button) => button.dataset.timeRange === key)?.textContent || '自定义时间');
    };
    buttons.forEach((button) => { button.onclick = () => apply(button.dataset.timeRange); });
    [startInput, endInput].forEach((input) => input.addEventListener('change', () => buttons.forEach((button) => button.classList.remove('active'))));
    return { apply };
  }

  function timeLabels(start, end, count = 7) {
    const startAt = new Date(`${start}T00:00:00`), endAt = new Date(`${end}T00:00:00`);
    if (!start || !end || Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) return [];
    if (start === end) return Array.from({ length: count }, (_, index) => `${String(Math.round(24 * index / Math.max(count - 1, 1))).padStart(2, '0')}.00`);
    const span = endAt.getTime() - startAt.getTime();
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(startAt.getTime() + span * index / Math.max(count - 1, 1));
      return window.LUMA_FORMAT.date(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    });
  }

  const exportReport = (name, count) => Luma.toast(`已按当前条件导出${name}，共 ${count} 条`);
  window.LUMA_REPORTING = { compact, metrics, lineChart, bars, groupedBars, validateDates, bindTimePresets, timeLabels, exportReport };
})();
