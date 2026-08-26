(function () {
  const hosts = window.LUMA_MOCK.guildPortal.guildHosts;
  const formerHosts = window.LUMA_MOCK.guildPortal.formerGuildHosts.map(host => ({ ...host, category: '聊天', live: false }));
  const allHosts = [...hosts, ...formerHosts];
  const profiles = {
    H102938: { ratio: 1, level: 'Lv.18' },
    H102954: { ratio: .88, level: 'Lv.16' },
    H103006: { ratio: .69, level: 'Lv.15' },
    H103121: { ratio: .73, level: 'Lv.17' },
    H103208: { ratio: .52, level: 'Lv.14' },
    U90326542: { ratio: 0, level: 'Lv.1' },
    H102711: { ratio: .46, level: 'Lv.8' },
    H102682: { ratio: .39, level: 'Lv.7' },
    H102645: { ratio: .34, level: 'Lv.6' }
  };
  const fixedDay = {
    H102938: { sessionCount: 2, duration: 206, views: 18620, fans: 86, coins: 31420, gifts: 684, gifters: 216 },
    H102954: { sessionCount: 1, duration: 178, views: 15840, fans: 65, coins: 28630, gifts: 532, gifters: 174 },
    H103006: { sessionCount: 1, duration: 72, views: 5420, fans: 18, coins: 8860, gifts: 164, gifters: 48 },
    H103121: { sessionCount: 1, duration: 134, views: 11960, fans: 41, coins: 39840, gifts: 742, gifters: 192 },
    H103208: { sessionCount: 0, duration: 0, views: 0, fans: 0, coins: 0, gifts: 0, gifters: 0 },
    U90326542: { sessionCount: 0, duration: 0, views: 0, fans: 0, coins: 0, gifts: 0, gifters: 0 },
    H102711: { sessionCount: 1, duration: 98, views: 3820, fans: 9, coins: 7240, gifts: 116, gifters: 36 },
    H102682: { sessionCount: 1, duration: 86, views: 3040, fans: 7, coins: 5680, gifts: 92, gifters: 28 },
    H102645: { sessionCount: 1, duration: 74, views: 2460, fans: 5, coins: 3960, gifts: 68, gifters: 21 }
  };
  const themes = {
    唱歌: ['周末点歌会', '流行金曲夜'],
    聊天: ['晚间聊天局', '粉丝问答'],
    才艺: ['才艺挑战赛', '创意表演夜'],
    舞蹈: ['热舞派对', '舞蹈练习室']
  };
  const dates = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 6, 17 + index));
    return date.toISOString().slice(0, 10);
  });
  const violationRecords = [
    { id: 'GV26081501', hostId: 'H102938', sessionId: 'LS2608150047', reportedAt: '2026-08-15 21:18', type: '色情低俗', disposition: '封禁', locale: 'zh' },
    { id: 'GV26081502', hostId: 'H102938', sessionId: 'LS2608150046', reportedAt: '2026-08-15 20:46', type: '色情低俗', disposition: '关播', locale: 'en' },
    { id: 'GV26081503', hostId: 'H102938', sessionId: 'LS2608150045', reportedAt: '2026-08-15 18:32', type: '色情低俗', disposition: '关播', locale: 'id' },
    { id: 'GV26081504', hostId: 'H103208', sessionId: 'LS2608150208', reportedAt: '2026-08-15 16:08', type: '未成年有害', disposition: '封禁' },
    { id: 'GV26081401', hostId: 'H103121', sessionId: 'LS2608140121', reportedAt: '2026-08-14 22:04', type: '其他', disposition: '关播' },
    { id: 'GV26081201', hostId: 'H103006', sessionId: 'LS2608120006', reportedAt: '2026-08-12 21:26', type: '色情低俗', disposition: '警告' },
    { id: 'GV26081001', hostId: 'H102938', sessionId: 'LS2608100038', reportedAt: '2026-08-10 19:42', type: '涉及宗教政治', disposition: '封禁' },
    { id: 'GV26080301', hostId: 'H102954', sessionId: 'LS2608030054', reportedAt: '2026-08-03 23:12', type: '暴恐血腥', disposition: '警告' },
    { id: 'GV26072601', hostId: 'H102938', sessionId: 'LS2607260018', reportedAt: '2026-07-26 21:18', type: '其他', disposition: '' }
  ];

  function formatDuration(minutes) {
    const value = Math.max(0, Math.round(minutes));
    return `${Math.floor(value / 60)}h ${value % 60}m`;
  }

  function formatSignedInteger(value) {
    const number = Number(value);
    const safeNumber = Number.isFinite(number) ? Math.trunc(number) : 0;
    return `${safeNumber > 0 ? '+' : ''}${LUMA_FORMAT.integer(safeNumber)}`;
  }

  function signClass(value) {
    const number = Number(value);
    if (number > 0) return 'is-positive';
    if (number < 0) return 'is-negative';
    return '';
  }

  function endTime(start, duration) {
    const [hours, minutes] = start.split(':').map(Number);
    const total = hours * 60 + minutes + Math.round(duration);
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  function splitValue(total, count, index) {
    if (count === 1) return total;
    return index === 0 ? Math.round(total * .46) : total - Math.round(total * .46);
  }

  function giftBreakdown(coins, quantity) {
    const coinParts = [Math.round(coins * .55), Math.round(coins * .22), Math.round(coins * .15)];
    coinParts.push(coins - coinParts.reduce((sum, value) => sum + value, 0));
    const quantityParts = [Math.round(quantity * .53), Math.round(quantity * .23), Math.round(quantity * .16)];
    quantityParts.push(quantity - quantityParts.reduce((sum, value) => sum + value, 0));
    return ['普通礼物', '定制礼物', '幸运礼物', '门票礼物'].map((type, index) => ({
      type,
      quantity: quantityParts[index],
      coins: coinParts[index]
    }));
  }

  function sessionId(hostId, date, index) {
    if (hostId === 'H102938' && date === '2026-08-15') return index === 0 ? 'LS2608150038' : 'LS2608150047';
    return `LS${date.slice(2).replaceAll('-', '')}${hostId.slice(-2)}${index + 1}`;
  }

  function buildSessions(host, date, stats) {
    const count = stats.sessionCount;
    if (!count) return [];
    const starts = count === 1 ? ['19:20'] : ['14:08', '19:20'];
    return Array.from({ length: count }, (_, index) => {
      const duration = splitValue(stats.duration, count, index);
      const views = splitValue(stats.views, count, index);
      const fans = splitValue(stats.fans, count, index);
      const coins = splitValue(stats.coins, count, index);
      const gifts = splitValue(stats.gifts, count, index);
      const gifters = splitValue(stats.gifters, count, index);
      const start = starts[index];
      const themeList = themes[host.category] || ['日常直播'];
      const roomTypes = ['普通房', '门票房', '密码房'];
      const roomIndex = (Number(date.slice(-2)) + Number(host.id.slice(-1)) + index) % roomTypes.length;
      return {
        id: sessionId(host.id, date, index),
        hostId: host.id,
        date,
        start,
        end: endTime(start, duration),
        duration,
        views,
        fans,
        gifters,
        giftQuantity: gifts,
        coins,
        gifts: giftBreakdown(coins, gifts),
        theme: themeList[index % themeList.length],
        type: host.category,
        room: roomTypes[roomIndex]
      };
    });
  }

  function getDay(hostId, date = '2026-08-15') {
    const host = allHosts.find(item => item.id === hostId) || hosts[0];
    let stats;
    if (date === '2026-08-15') {
      stats = { ...fixedDay[host.id] };
    } else if (profiles[host.id].ratio === 0) {
      stats = { sessionCount: 0, duration: 0, views: 0, fans: 0, coins: 0, gifts: 0, gifters: 0 };
    } else {
      const index = dates.indexOf(date);
      const hostIndex = hosts.findIndex(item => item.id === host.id);
      const ratio = profiles[host.id].ratio;
      const seed = Math.max(index, 0) + hostIndex * 5 + 17;
      const started = seed % 7 !== 0;
      const sessionCount = started ? (seed % 5 === 0 ? 2 : 1) : 0;
      const duration = started ? Math.round((145 + seed % 92) * ratio) + (seed % 4 === 0 ? 90 : 0) : 0;
      stats = {
        sessionCount,
        duration,
        views: started ? Math.round((7600 + seed * 420) * ratio) : 0,
        fans: started ? (seed % 11 === 0 ? -Math.round((8 + seed % 24) * ratio) : Math.round((28 + seed % 64) * ratio)) : 0,
        coins: started ? Math.round((11600 + seed * 760) * ratio / 10) * 10 : 0,
        gifts: started ? Math.round((230 + seed * 13) * ratio) : 0,
        gifters: started ? Math.round((82 + seed * 4) * ratio) : 0
      };
    }
    stats.effective = stats.duration >= 180;
    stats.sessions = buildSessions(host, date, stats);
    return { date, host, ...stats };
  }

  function getDays(hostId) {
    return dates.slice().reverse().map(date => getDay(hostId, date));
  }

  function getSummary(hostId) {
    const days = getDays(hostId);
    const totals = days.reduce((result, day) => {
      result.coins += day.coins;
      result.gifts += day.gifts;
      result.fans += day.fans;
      result.sessions += day.sessionCount;
      result.effectiveDays += day.effective ? 1 : 0;
      result.duration += day.duration;
      return result;
    }, { coins: 0, gifts: 0, fans: 0, sessions: 0, effectiveDays: 0, duration: 0 });
    return { host: days[0].host, days, ...totals };
  }

  function guildIncomeSources(totalCoins) {
    const values = [
      Math.round(totalCoins * .55),
      Math.round(totalCoins * .22),
      Math.round(totalCoins * .15)
    ];
    values.push(totalCoins - values.reduce((sum, value) => sum + value, 0));
    return ['普通礼物', '定制礼物', '幸运礼物', '门票'].map((label, index) => ({
      label,
      coins: values[index],
      income: values[index] / 10
    }));
  }

  function getGuildDay(date = '2026-08-15') {
    const selectedDate = dates.includes(date) ? date : dates[dates.length - 1];
    const dateIndex = dates.indexOf(selectedDate);
    const seed = dateIndex + 11;
    const totalCoins = selectedDate === '2026-08-15'
      ? 428620
      : Math.round((318000 + (seed % 7) * 17840 + (seed % 3) * 9620) / 10) * 10;
    const hostContributions = hosts.map(host => {
      const day = getDay(host.id, selectedDate);
      return {
        host,
        coins: day.coins,
        income: day.coins / 10,
        share: totalCoins ? day.coins / totalCoins * 100 : 0
      };
    }).sort((a, b) => b.coins - a.coins);
    return {
      date: selectedDate,
      coins: totalCoins,
      income: totalCoins / 10,
      sources: guildIncomeSources(totalCoins),
      effectiveHosts: selectedDate === '2026-08-15' ? 48 : 38 + seed % 12,
      startedHosts: selectedDate === '2026-08-15' ? 64 : 52 + seed % 14,
      sessions: selectedDate === '2026-08-15' ? 82 : 68 + seed % 18,
      duration: selectedDate === '2026-08-15' ? 12184 : (52 + seed % 14) * (168 + seed % 31),
      hostContributions
    };
  }

  function getGuildSummary() {
    const days = dates.slice().reverse().map(getGuildDay);
    return {
      days,
      income: days.reduce((sum, day) => sum + day.income, 0),
      coins: days.reduce((sum, day) => sum + day.coins, 0)
    };
  }

  function getSession(sessionIdValue, hostId = 'H102938', date = '2026-08-15') {
    const selected = getDay(hostId, date).sessions.find(item => item.id === sessionIdValue);
    if (selected) return selected;
    return getDay(hostId, date).sessions[0] || getDay('H102938', '2026-08-15').sessions[0];
  }

  function getViolations(start = dates[dates.length - 1], end = start) {
    return violationRecords.filter(record => {
      const date = record.reportedAt.slice(0, 10);
      return date >= start && date <= end;
    });
  }

  window.LUMA_GUILD_DATA = Object.freeze({
    hosts,
    profiles,
    dates,
    todaySummary: { hosts: 126, live: 18, effective: 48, started: 64, notStarted: 62 },
    formatDuration,
    formatSignedInteger,
    signClass,
    getDay,
    getDays,
    getSummary,
    getGuildDay,
    getGuildSummary,
    getSession,
    getViolations
  });
}());
