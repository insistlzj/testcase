window.LUMA_FORMAT = Object.freeze({
  date(value) {
    const match = String(value ?? '').trim().match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})$/);
    return match ? `${Number(match[3])}/${Number(match[2])}/${match[1]}` : String(value ?? '');
  },
  dateTime(value) {
    const text = String(value ?? '').trim();
    const match = text.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!match) return text;
    const date = `${Number(match[3])}/${Number(match[2])}/${match[1]}`;
    if (!match[4]) return date;
    return `${date} ${match[4]}.${match[5]}${match[6] ? `.${match[6]}` : ''}`;
  },
  time(value) {
    const text = String(value ?? '').trim();
    const match = text.match(/^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
    return match ? `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}` : text;
  },
  number(value, maximumFractionDigits = 2) {
    const number = Number(value);
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits
    }).format(Number.isFinite(number) ? number : 0);
  },
  decimalInput(value, maximumFractionDigits = 20) {
    const number = typeof value === 'number' ? value : window.LUMA_FORMAT.parseDecimal(value);
    if (!Number.isFinite(number)) return '';
    return new Intl.NumberFormat('id-ID', {
      useGrouping: false,
      maximumFractionDigits
    }).format(number);
  },
  parseDecimal(value) {
    const text = String(value ?? '').trim();
    if (/^[+-]?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(text)) return Number(text.replaceAll('.', '').replace(',', '.'));
    if (/^[+-]?\d+(?:,\d+)?$/.test(text)) return Number(text.replace(',', '.'));
    if (/^[+-]?\d+(?:\.\d+)?$/.test(text)) return Number(text);
    return NaN;
  },
  integer(value) {
    const number = Number(value);
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number.isFinite(number) ? Math.trunc(number) : 0);
  },
  compact(value) {
    const number = Number(value);
    const safeNumber = Number.isFinite(number) ? number : 0;
    const absolute = Math.abs(safeNumber);
    const units = [
      { value: 1e9, suffix: 'B' },
      { value: 1e6, suffix: 'M' },
      { value: 1e3, suffix: 'K' }
    ];
    const unit = units.find((item) => absolute >= item.value);
    return unit ? `${window.LUMA_FORMAT.number(safeNumber / unit.value, 1)}${unit.suffix}` : window.LUMA_FORMAT.integer(safeNumber);
  },
  coins(value) {
    const number = Number(value);
    const safeNumber = Number.isFinite(number) ? Math.trunc(number) : 0;
    const isBackoffice = /\/pages\/(admin|guild)\//.test(window.location?.pathname || '');
    if (!isBackoffice) return window.LUMA_FORMAT.compact(safeNumber);
    const units = [
      { value: 1e9, suffix: 'M' },
      { value: 1e6, suffix: 'B' },
      { value: 1e3, suffix: 'K' }
    ];
    const unit = units.find((item) => Math.abs(safeNumber) >= item.value && safeNumber % item.value === 0);
    return unit ? `${window.LUMA_FORMAT.integer(safeNumber / unit.value)}${unit.suffix}` : window.LUMA_FORMAT.integer(safeNumber);
  },
  money(value) {
    return `$${window.LUMA_FORMAT.number(value, 2)}`;
  },
  signedMoney(value) {
    const number = Number(value);
    const safeNumber = Number.isFinite(number) ? number : 0;
    return `${safeNumber > 0 ? '+' : safeNumber < 0 ? '-' : ''}${window.LUMA_FORMAT.money(Math.abs(safeNumber))}`;
  },
  parse(value) {
    const match = String(value).trim().match(/^([+-]?)([0-9][0-9.,]*)([kKmMbB]?)$/);
    if (!match) return NaN;
    const [, sign, digits, suffix] = match;
    const lastComma = digits.lastIndexOf(',');
    const lastDot = digits.lastIndexOf('.');
    let normalized = digits;
    if (lastComma >= 0 && lastDot >= 0) {
      const decimal = lastComma > lastDot ? ',' : '.';
      normalized = digits.split(decimal === ',' ? '.' : ',').join('').replace(decimal, '.');
    } else if (lastComma >= 0 || lastDot >= 0) {
      const separator = lastComma >= 0 ? ',' : '.';
      const pieces = digits.split(separator);
      normalized = pieces.length > 2 || pieces[pieces.length - 1].length === 3 ? pieces.join('') : digits.replace(separator, '.');
    }
    const multiplier = ({ k: 1e3, m: 1e6, b: 1e9 })[suffix.toLowerCase()] || 1;
    return Number(`${sign}${normalized}`) * multiplier;
  },
  parseCoins(value) {
    const match = String(value).trim().match(/^([+-]?)([0-9][0-9.,]*)([kKmMbB]?)$/);
    if (!match) return NaN;
    const [, sign, digits, suffix] = match;
    const lastComma = digits.lastIndexOf(',');
    const lastDot = digits.lastIndexOf('.');
    let normalized = digits;
    if (lastComma >= 0 && lastDot >= 0) {
      const decimal = lastComma > lastDot ? ',' : '.';
      normalized = digits.split(decimal === ',' ? '.' : ',').join('').replace(decimal, '.');
    } else if (lastComma >= 0 || lastDot >= 0) {
      const separator = lastComma >= 0 ? ',' : '.';
      const pieces = digits.split(separator);
      normalized = pieces.length > 2 || pieces[pieces.length - 1].length === 3 ? pieces.join('') : digits.replace(separator, '.');
    }
    const multiplier = ({ k: 1e3, b: 1e6, m: 1e9 })[suffix.toLowerCase()] || 1;
    return Number(`${sign}${normalized}`) * multiplier;
  }
});

window.Luma = {
  format: window.LUMA_FORMAT,
  tip(value, label) {
    const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    const displayValue = /\/pages\/admin\//.test(location.pathname) ? window.LUMA_FORMAT.time(window.LUMA_FORMAT.dateTime(value)) : value;
    return `<span class="admin-hover-tip" data-admin-tip="${escape(`${label}：${displayValue}`)}">${escape(displayValue)}</span>`;
  },
  id(value, label) { return window.Luma.tip(value, label); },
  setTip(element, value, label) {
    const displayValue = /\/pages\/admin\//.test(location.pathname) ? window.LUMA_FORMAT.time(window.LUMA_FORMAT.dateTime(value)) : value;
    element.textContent = displayValue;
    element.classList.add('admin-hover-tip');
    element.dataset.adminTip = `${label}：${displayValue}`;
  },
  toast(message) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.replaceChildren();
    String(message).split('◎').forEach((part, index, parts) => {
      if (part) el.append(document.createTextNode(part));
      if (index < parts.length - 1) {
        const icon = document.createElement('i');
        icon.className = 'coin';
        icon.setAttribute('aria-label', '钻石');
        el.append(icon);
      }
    });
    el.classList.add('show');
    clearTimeout(window.__lumaToast); window.__lumaToast = setTimeout(() => el.classList.remove('show'), 1600);
  },
  stateRegistry: {},
  registerStates(states) {
    const grouped = Object.values(states).every((value) => value && typeof value === 'object');
    window.Luma.stateRegistry = grouped
      ? { ...Object.fromEntries(Object.entries(window.Luma.stateRegistry).filter(([, value]) => value && typeof value === 'object')), ...states }
      : states;
    if (Object.prototype.hasOwnProperty.call(states, '当前身份')) delete window.Luma.stateRegistry['直播间角色'];
    const allGrouped = Object.values(window.Luma.stateRegistry).every((value) => value && typeof value === 'object');
    const groups = allGrouped ? Object.fromEntries(Object.entries(window.Luma.stateRegistry).map(([name, values]) => [name, Object.keys(values)])) : { '页面状态': Object.keys(window.Luma.stateRegistry) };
    window.parent.postMessage({ type: 'luma-states', groups, grouped: allGrouped }, '*');
  },
  applyState(group, name) {
    if (name === undefined) {
      const fn = window.Luma.stateRegistry[group];
      if (typeof fn === 'function') fn();
      return;
    }
    const groupStates = window.Luma.stateRegistry[group];
    const fn = groupStates && typeof groupStates === 'object' ? groupStates[name] : window.Luma.stateRegistry[name];
    if (fn) fn();
  }
};

window.LUMA_GUILD_CONTEXT = (() => {
  const storageKey = 'luma-guild-current-v1';
  const guilds = [
    {
      id: 'G10021', mark: 'JS', name: 'Jakarta Star Guild', region: 'Jakarta', role: '公会长',
      summary: {
        month: { label: '本月', income: '$178,360', delta: '较上月同期 +11.2%', settleable: '$146,820' },
        week: { label: '近7天', income: '$128,460', delta: '较上周 +12.8%', settleable: '$102,680' }
      },
      overview: [
        { label: '直播中', value: '18', detail: '较昨日 +3' },
        { label: '达成有效天', value: '48', detail: '较昨日 +5' }
      ]
    },
    {
      id: 'G10046', mark: 'BN', name: 'Bandung Nova Guild', region: 'Bandung', role: '公会长',
      summary: {
        month: { label: '本月', income: '$96,240', delta: '较上月同期 +8.6%', settleable: '$77,820' },
        week: { label: '近7天', income: '$68,510', delta: '较上周 +6.9%', settleable: '$54,360' }
      },
      overview: [
        { label: '直播中', value: '9', detail: '较昨日 +1' },
        { label: '达成有效天', value: '28', detail: '较昨日 +2' }
      ]
    },
    {
      id: 'G10073', mark: 'SS', name: 'Surabaya Spark Guild', region: 'Surabaya', role: '公会长',
      summary: {
        month: { label: '本月', income: '$68,400', delta: '较上月同期 +15.4%', settleable: '$53,160' },
        week: { label: '近7天', income: '$47,820', delta: '较上周 +10.5%', settleable: '$36,940' }
      },
      overview: [
        { label: '直播中', value: '6', detail: '较昨日 +2' },
        { label: '达成有效天', value: '19', detail: '较昨日 +3' }
      ]
    }
  ];
  const getCurrent = () => guilds.find((guild) => guild.id === sessionStorage.getItem(storageKey)) || guilds[0];
  const setCurrent = (id) => {
    if (!guilds.some((guild) => guild.id === id)) return false;
    sessionStorage.setItem(storageKey, id);
    return true;
  };
  return Object.freeze({ guilds, getCurrent, setCurrent });
})();

(() => {
  if (!/\/guild\/management\/guild-profile\.html$/.test(location.pathname)) return;
  const syncGuildProfile = () => {
    const guild = window.LUMA_GUILD_CONTEXT.getCurrent();
    const logo = document.querySelector('.guild-logo-editor .guild-mark');
    const idValue = document.querySelector('#guildProfileId');
    const nameInput = document.querySelector('#name');
    if (logo) logo.textContent = guild.mark;
    if (idValue) idValue.textContent = guild.id;
    if (nameInput) nameInput.value = guild.name;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncGuildProfile, { once: true });
  else syncGuildProfile();
})();

(() => {
  if (!/\/pages\/(admin|guild)\//.test(location.pathname)) return;
  const format = window.LUMA_FORMAT;
  const isAdmin = /\/pages\/admin\//.test(location.pathname);
  const isGuild = /\/pages\/guild\//.test(location.pathname);
  const moneyPattern = /([+-]?)\$\s*([0-9](?:[0-9.,]*[0-9])?)([kKmMbB]?)/g;
  const coinAfterPattern = /([+-]?[0-9](?:[0-9.,]*[0-9])?[kKmMbB]?)(?=\s*金币)/g;
  const coinBeforePattern = /(金币\s*)([+-]?[0-9](?:[0-9.,]*[0-9])?[kKmMbB]?)/g;
  const groupedPattern = /\b[0-9]{1,3}(?:,[0-9]{3})+\b/g;
  const decimalPattern = /(\d+)\.(\d+)(?=\s*(?:%|h\b))/g;
  const dateTimePattern = /\b(\d{4})[-.](\d{2})[-.](\d{2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/g;
  const timePattern = /\b([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?\b/g;
  const fiatPattern = /[+-]?\$\s*[0-9](?:[0-9.,]*[0-9])?[kKmMbB]?/g;
  const excludedParents = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION']);

  function normalizeText(value) {
    const normalized = value
      .replace(moneyPattern, (_, sign, amount, suffix) => {
        const number = format.parse(`${amount}${suffix}`);
        return Number.isFinite(number) ? `${sign}${format.money(number)}` : `${sign}$${amount}${suffix}`;
      })
      .replace(coinAfterPattern, (amount) => {
        const number = format.parseCoins(amount);
        return Number.isFinite(number) ? format.coins(number) : amount;
      })
      .replace(coinBeforePattern, (_, prefix, amount) => {
        const number = format.parseCoins(amount);
        return Number.isFinite(number) ? `${prefix}${format.coins(number)}` : `${prefix}${amount}`;
      })
      .replace(groupedPattern, (amount) => amount.replaceAll(',', '.'))
      .replace(decimalPattern, '$1,$2');
    return isAdmin || isGuild ? normalized
      .replace(dateTimePattern, (match) => format.dateTime(match))
      .replace(timePattern, (match) => format.time(match)) : normalized;
  }

  function enhanceDateInput(input) {
    if (!isAdmin || input.dataset.lumaDateEnhanced === 'true') return;
    input.dataset.lumaDateEnhanced = 'true';
    const type = input.type;
    const wrapper = document.createElement('span');
    wrapper.className = 'luma-date-field';
    const display = document.createElement('span');
    display.className = 'luma-date-display';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.append(input, display);

    const sync = () => {
      const value = input.value;
      display.textContent = value
        ? (type === 'datetime-local' ? format.dateTime(value) : type === 'time' ? format.time(value) : format.date(value))
        : (input.dataset.lumaDatePlaceholder || (type === 'datetime-local' ? '日/月/年 HH.mm' : type === 'time' ? 'HH.mm' : '日/月/年'));
      display.classList.toggle('is-placeholder', !value);
    };
    const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (valueDescriptor?.get && valueDescriptor?.set) {
      Object.defineProperty(input, 'value', {
        configurable: true,
        enumerable: valueDescriptor.enumerable,
        get() { return valueDescriptor.get.call(this); },
        set(value) { valueDescriptor.set.call(this, value); queueMicrotask(sync); }
      });
    }
    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    input.addEventListener('click', () => {
      if (typeof input.showPicker !== 'function') return;
      try { input.showPicker(); } catch {}
    });
    sync();
  }

  function enhanceDateInputs(root) {
    if (!isAdmin || !(root instanceof Element)) return;
    if (root.matches('input[type="date"],input[type="datetime-local"],input[type="time"]')) enhanceDateInput(root);
    root.querySelectorAll('input[type="date"],input[type="datetime-local"],input[type="time"]').forEach(enhanceDateInput);
  }

  function enhanceDecimalInput(input) {
    if (!isAdmin || input.dataset.lumaDecimalEnhanced === 'true') return;
    input.dataset.lumaDecimalEnhanced = 'true';
    const validate = () => {
      if (!input.value.trim()) {
        input.setCustomValidity('');
        return;
      }
      const value = format.parseDecimal(input.value);
      const min = input.hasAttribute('min') ? Number(input.getAttribute('min')) : -Infinity;
      const max = input.hasAttribute('max') ? Number(input.getAttribute('max')) : Infinity;
      const step = Number(input.getAttribute('step'));
      let message = '';
      if (!Number.isFinite(value)) message = '请输入有效数字，使用逗号作为小数分隔符';
      else if (value < min) message = `请输入不小于 ${format.decimalInput(min)} 的数字`;
      else if (value > max) message = `请输入不大于 ${format.decimalInput(max)} 的数字`;
      else if (Number.isFinite(step) && step > 0) {
        const precision = (String(step).split('.')[1] || '').length;
        const scaled = value * 10 ** precision;
        if (Math.abs(scaled - Math.round(scaled)) > 1e-8) message = `最多输入 ${precision} 位小数`;
      }
      input.setCustomValidity(message);
    };
    input.addEventListener('input', validate);
    input.addEventListener('blur', () => {
      const value = format.parseDecimal(input.value);
      if (Number.isFinite(value)) input.value = format.decimalInput(value);
      validate();
    });
    const initialValue = format.parseDecimal(input.value);
    if (Number.isFinite(initialValue)) input.value = format.decimalInput(initialValue);
    validate();
  }

  function enhanceDecimalInputs(root) {
    if (!isAdmin || !(root instanceof Element)) return;
    if (root.matches('input[data-luma-decimal]')) enhanceDecimalInput(root);
    root.querySelectorAll('input[data-luma-decimal]').forEach(enhanceDecimalInput);
  }

  function normalizeNode(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (excludedParents.has(root.parentElement?.tagName)) return;
      const normalized = normalizeText(root.nodeValue);
      if (normalized !== root.nodeValue) root.nodeValue = normalized;
      if (isAdmin) highlightFiatNode(root);
      return;
    }
    if (!(root instanceof Element) || excludedParents.has(root.tagName)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(normalizeNode);
  }

  function highlightFiatNode(node) {
    if (!node.nodeValue.includes('$') || node.parentElement?.closest('.admin-fiat-value')) return;
    const value = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let match;
    fiatPattern.lastIndex = 0;
    while ((match = fiatPattern.exec(value))) {
      if (match.index > cursor) fragment.append(document.createTextNode(value.slice(cursor, match.index)));
      const amount = document.createElement('span');
      amount.className = 'admin-fiat-value';
      amount.textContent = match[0];
      fragment.append(amount);
      cursor = match.index + match[0].length;
    }
    if (!cursor) return;
    if (cursor < value.length) fragment.append(document.createTextNode(value.slice(cursor)));
    node.replaceWith(fragment);
  }

  let observerStarted = false;
  const ready = () => {
    if (!document.body) {
      requestAnimationFrame(ready);
      return;
    }
    if (observerStarted) return;
    observerStarted = true;
    normalizeNode(document.body);
    enhanceDateInputs(document.body);
    enhanceDecimalInputs(document.body);
    new MutationObserver((mutations) => mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') normalizeNode(mutation.target);
      mutation.addedNodes.forEach((node) => {
        normalizeNode(node);
        enhanceDateInputs(node);
        enhanceDecimalInputs(node);
      });
    }))
      .observe(document.body, { childList: true, characterData: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();

(() => {
  const highlightAttribute = 'data-luma-note-highlight';
  const hoverAttribute = 'data-luma-note-hover';
  let selectionMode = false;

  const escapeSelector = (value) => window.CSS?.escape ? CSS.escape(value) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  const clearAttribute = (name) => document.querySelectorAll(`[${name}]`).forEach((element) => element.removeAttribute(name));
  const selectableTarget = (target) => target instanceof Element ? target.closest('button,a,input,select,textarea,label,th,td,[role],.admin-panel,.admin-detail-item,.admin-form-row,section,article,h1,h2,h3,h4,p') || target : null;

  function selectorFor(element) {
    if (element.id) return `#${escapeSelector(element.id)}`;
    const parts = [];
    let current = element;
    while (current && current !== document.body) {
      if (current.id) {
        parts.unshift(`#${escapeSelector(current.id)}`);
        break;
      }
      const parent = current.parentElement;
      let part = current.tagName.toLowerCase();
      const stableClass = [...current.classList].find((name) => !['active', 'show', 'state-hide', 'selected'].includes(name));
      if (stableClass) part += `.${escapeSelector(stableClass)}`;
      if (parent) {
        const peers = [...parent.children].filter((child) => child.tagName === current.tagName);
        if (peers.length > 1) part += `:nth-of-type(${peers.indexOf(current) + 1})`;
      }
      parts.unshift(part);
      current = parent;
    }
    return parts.join(' > ');
  }

  function labelFor(element) {
    const fieldLabel = element.id ? document.querySelector(`label[for="${escapeSelector(element.id)}"]`) : null;
    const label = element.getAttribute('aria-label') || element.getAttribute('title') || fieldLabel?.textContent || element.getAttribute('placeholder') || element.innerText || element.textContent || element.tagName;
    return String(label).replace(/\s+/g, ' ').trim().slice(0, 36) || '已选元素';
  }

  function setSelectionMode(enabled) {
    selectionMode = enabled;
    document.documentElement.classList.toggle('luma-note-selecting', enabled);
    clearAttribute(hoverAttribute);
  }

  const annotationStyle = document.createElement('style');
  annotationStyle.textContent = `
    .luma-note-selecting,.luma-note-selecting *{cursor:crosshair!important}
    [${hoverAttribute}]{outline:2px dashed #555!important;outline-offset:2px!important}
    [${highlightAttribute}]{outline:3px solid #333!important;outline-offset:3px!important}
  `;
  document.head.appendChild(annotationStyle);

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === 'luma-apply-state') {
      window.Luma.applyState(event.data.group, event.data.name);
      return;
    }
    if (event.data.type === 'luma-review-actions') {
      (Array.isArray(event.data.selectors) ? event.data.selectors : []).slice(0, 4).forEach((selector, index) => {
        if (typeof selector !== 'string' || !selector) return;
        window.setTimeout(() => document.querySelector(selector)?.click(), index * 80);
      });
      window.setTimeout(() => {
        (Array.isArray(event.data.hideSelectors) ? event.data.hideSelectors : []).slice(0, 4).forEach((selector) => {
          if (typeof selector !== 'string' || !selector) return;
          document.querySelector(selector)?.classList.add('state-hide');
        });
      }, (Array.isArray(event.data.selectors) ? event.data.selectors : []).length * 80 + 30);
      return;
    }
    if (event.data.type === 'luma-note-mode') setSelectionMode(Boolean(event.data.enabled));
    if (event.data.type === 'luma-note-clear') {
      clearAttribute(highlightAttribute);
      clearAttribute(hoverAttribute);
    }
    if (event.data.type === 'luma-note-highlight') {
      clearAttribute(highlightAttribute);
      const target = document.querySelector(event.data.selector);
      if (target) {
        target.setAttribute(highlightAttribute, 'true');
        target.scrollIntoView({ block: 'center', inline: 'center' });
      }
    }
  });

  document.addEventListener('mouseover', (event) => {
    if (!selectionMode) return;
    clearAttribute(hoverAttribute);
    selectableTarget(event.target)?.setAttribute(hoverAttribute, 'true');
  }, true);

  document.addEventListener('click', (event) => {
    if (!selectionMode) return;
    const target = selectableTarget(event.target);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    clearAttribute(hoverAttribute);
    clearAttribute(highlightAttribute);
    target.setAttribute(highlightAttribute, 'true');
    setSelectionMode(false);
    window.parent.postMessage({ type: 'luma-note-target', selector: selectorFor(target), label: labelFor(target) }, '*');
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!selectionMode || event.key !== 'Escape') return;
    setSelectionMode(false);
    window.parent.postMessage({ type: 'luma-note-cancel' }, '*');
  }, true);

  const ready = () => window.parent.postMessage({ type: 'luma-note-ready' }, '*');
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();

(() => {
  const groups = {
    '举报处理': [
      ['../content/admin-account-violation.html', '账号违规'],
      ['../content/admin-report-handling.html', '直播间违规']
    ],
    '订单管理': [
      ['../orders/admin-recharge-order.html', '充值订单'],
      ['../orders/admin-consumption-order.html', '消费订单'],
      ['../orders/admin-refund-order.html', '退款订单']
    ],
    '财务分成': [
      ['../finance/admin-settlement-record.html', '主播分成记录'],
      ['../finance/admin-host-account-balance.html', '主播账户余额'],
      ['../finance/admin-guild-settlement-record.html', '公会分成记录'],
      ['../finance/admin-guild-account-balance.html', '公会账户余额']
    ],
    '数据分析': [
      ['../analytics/admin-data-overview.html', '数据概览'],
      ['../analytics/admin-report-center.html', '报表中心']
    ],
    '运营账号': [
      ['../accounts/admin-operation-accounts.html', '账号列表'],
      ['../accounts/admin-operation-issue-records.html', '发放记录'],
      ['../accounts/admin-operation-gift-records.html', '送礼记录'],
      ['../accounts/admin-operation-guild-controls.html', '额度限制']
    ]
  };
  const currentFile = location.pathname.split('/').pop();
  const currentCategory = location.pathname.split('/').slice(-2, -1)[0];
  const categoryByGroup = { '订单管理': 'orders', '财务分成': 'finance', '数据分析': 'analytics', '运营账号': 'accounts' };
  const reportFiles = ['admin-account-violation.html', 'admin-report-handling.html', 'admin-report-detail.html'];

  function groupName(trigger) {
    const name = trigger.dataset.menu || trigger.querySelector('span')?.textContent.trim();
    return groups[name] ? name : '';
  }

  function setExpanded(trigger, submenu, expanded) {
    trigger.setAttribute('aria-expanded', String(expanded));
    submenu.classList.toggle('state-hide', !expanded);
    const indicator = trigger.querySelector('span:last-child');
    if (indicator) indicator.textContent = expanded ? '⌄' : '›';
  }

  function setupAdminNavigation() {
    const nav = document.querySelector('.admin-nav');
    if (!nav) return;

    if (!nav.children.length) {
      nav.innerHTML = '<a class="admin-nav-item" href="../user/admin-user-list.html"><span>用户管理</span><span>›</span></a><a class="admin-nav-item" href="../host/admin-host-list.html"><span>主播管理</span><span>›</span></a><a class="admin-nav-item" href="../guild/admin-guild-list.html"><span>公会管理</span><span>›</span></a><a class="admin-nav-item" href="../gifts/admin-gift-list.html"><span>礼物道具</span><span>›</span></a><a class="admin-nav-item" href="../operations/admin-placement-config.html"><span>运营配置</span><span>›</span></a><a class="admin-nav-item" href="../finance/admin-settlement-record.html"><span>财务分成</span><span>›</span></a><button class="admin-nav-item" data-menu="数据分析"><span>数据分析</span><span>›</span></button>';
    }

    [...nav.querySelectorAll(':scope > .admin-nav-item')]
      .filter((entry) => entry.textContent.trim().startsWith('系统配置'))
      .forEach((entry) => {
        const submenu = entry.nextElementSibling;
        if (submenu?.classList.contains('admin-nav-submenu')) submenu.remove();
        entry.remove();
      });

    if (!nav.querySelector('a[href$="admin-dashboard.html"]')) {
      const dashboardEntry = document.createElement('a');
      dashboardEntry.className = 'admin-nav-item';
      dashboardEntry.href = '../dashboard/admin-dashboard.html';
      dashboardEntry.innerHTML = '<span>工作台</span><span>›</span>';
      nav.prepend(dashboardEntry);
    }

    if (!nav.querySelector('[data-menu="订单管理"]')) {
      const orderEntry = document.createElement('button');
      orderEntry.className = 'admin-nav-item';
      orderEntry.type = 'button';
      orderEntry.dataset.menu = '订单管理';
      orderEntry.innerHTML = '<span>订单管理</span><span>›</span>';
      const financeEntry = [...nav.querySelectorAll(':scope > .admin-nav-item')]
        .find((entry) => entry.textContent.trim().startsWith('财务分成'));
      if (financeEntry) financeEntry.insertAdjacentElement('beforebegin', orderEntry);
      else nav.appendChild(orderEntry);
    }

    nav.querySelectorAll('.admin-nav-submenu a[href$="admin-report-handling.html"]').forEach((link) => link.remove());
    if (!nav.querySelector('[data-menu="举报处理"]')) {
      const reportEntry = document.createElement('button');
      reportEntry.className = 'admin-nav-item';
      reportEntry.type = 'button';
      reportEntry.dataset.menu = '举报处理';
      reportEntry.innerHTML = '<span>举报处理</span><span>›</span>';
      const guildEntry = [...nav.querySelectorAll(':scope > .admin-nav-item')]
        .find((entry) => entry.textContent.trim().startsWith('公会管理'));
      if (guildEntry) guildEntry.insertAdjacentElement('beforebegin', reportEntry);
      else nav.appendChild(reportEntry);
    }

    if (!nav.querySelector('[data-menu="运营账号"]')) {
      const operationAccountEntry = document.createElement('button');
      operationAccountEntry.className = 'admin-nav-item';
      operationAccountEntry.type = 'button';
      operationAccountEntry.dataset.menu = '运营账号';
      operationAccountEntry.innerHTML = '<span>运营账号</span><span>›</span>';
      nav.appendChild(operationAccountEntry);
    }

    if (reportFiles.includes(currentFile)) {
      nav.querySelectorAll(':scope > .admin-nav-item').forEach((entry) => {
        entry.classList.remove('active');
        const submenu = entry.nextElementSibling;
        if (submenu?.classList.contains('admin-nav-submenu')) setExpanded(entry, submenu, false);
      });
      nav.querySelectorAll('.admin-nav-sub').forEach((link) => link.classList.remove('active'));
    }

    const propEntry = nav.querySelector('.admin-nav-submenu a[href$="admin-prop-list.html"]');
    if (propEntry && !nav.querySelector('a[href$="admin-gift-send-count-rules.html"]')) {
      const ruleEntry = document.createElement('a');
      ruleEntry.className = 'admin-nav-sub';
      ruleEntry.href = 'admin-gift-send-count-rules.html';
      ruleEntry.textContent = '购买份数配置';
      if (currentFile.startsWith('admin-gift-send-count-rule')) ruleEntry.classList.add('active');
      propEntry.insertAdjacentElement('afterend', ruleEntry);
    }

    [...nav.querySelectorAll(':scope > .admin-nav-item')].forEach((trigger) => {
      const configuredName = groupName(trigger);
      let submenu = trigger.nextElementSibling;
      const hasExistingSubmenu = submenu?.classList.contains('admin-nav-submenu');
      const isStaticGroup = trigger.tagName === 'BUTTON' && hasExistingSubmenu;
      if (!configuredName && !isStaticGroup) return;

      const name = configuredName || trigger.querySelector('span')?.textContent.trim();
      if (!name) return;

      trigger.dataset.adminNavGroup = name;
      if (trigger.tagName === 'BUTTON') trigger.type = 'button';

      if (!hasExistingSubmenu) {
        submenu = document.createElement('div');
        submenu.className = 'admin-nav-submenu';
        submenu.dataset.adminNavSubmenu = name;
        groups[configuredName].forEach(([href, label]) => {
          const link = document.createElement('a');
          link.className = 'admin-nav-sub';
          link.href = href;
          link.textContent = label;
          const pageBase = href.split('/').pop().replace('.html', '');
          const reportScope = new URLSearchParams(location.search).get('scope');
          const reportParent = currentFile === 'admin-report-detail.html'
            ? (reportScope === 'account' ? 'admin-account-violation' : 'admin-report-handling')
            : '';
          if (currentFile === `${pageBase}.html` || currentFile.startsWith(`${pageBase}-detail`) || reportParent === pageBase) link.classList.add('active');
          submenu.appendChild(link);
        });
        trigger.insertAdjacentElement('afterend', submenu);
      }

      if (configuredName === '财务分成') {
        const hostSettlementLink = submenu.querySelector('a[href$="admin-settlement-record.html"]');
        if (hostSettlementLink) hostSettlementLink.textContent = '主播分成记录';
        if (!submenu.querySelector('a[href$="admin-guild-settlement-record.html"]')) {
          const guildSettlementLink = document.createElement('a');
          guildSettlementLink.className = 'admin-nav-sub';
          guildSettlementLink.href = '../finance/admin-guild-settlement-record.html';
          guildSettlementLink.textContent = '公会分成记录';
          hostSettlementLink?.insertAdjacentElement('afterend', guildSettlementLink);
        }
        const guildSettlementLink = submenu.querySelector('a[href$="admin-guild-settlement-record.html"]');
        const accountBalanceLinks = [
          ['admin-host-account-balance.html', '主播账户余额', hostSettlementLink],
          ['admin-guild-account-balance.html', '公会账户余额', guildSettlementLink]
        ];
        accountBalanceLinks.forEach(([file, label, anchor]) => {
          if (submenu.querySelector(`a[href$="${file}"]`)) return;
          const link = document.createElement('a');
          link.className = 'admin-nav-sub';
          link.href = `../finance/${file}`;
          link.textContent = label;
          anchor?.insertAdjacentElement('afterend', link);
        });
        submenu.querySelectorAll('a').forEach((link) => {
          const pageBase = link.href.split('/').pop().replace('.html', '');
          const accountChangeParent = {
            'admin-host-balance-change-record.html': 'admin-host-account-balance',
            'admin-guild-balance-change-record.html': 'admin-guild-account-balance'
          }[currentFile];
          link.classList.toggle('active', currentFile === `${pageBase}.html` || currentFile.startsWith(`${pageBase}-detail`) || accountChangeParent === pageBase);
        });
      }

      const containsCurrentPage = configuredName
        ? (configuredName === '举报处理'
          ? reportFiles.includes(currentFile)
          : currentCategory === categoryByGroup[configuredName])
        : trigger.classList.contains('active') || Boolean(submenu.querySelector('.admin-nav-sub.active'));
      trigger.classList.toggle('active', containsCurrentPage);
      setExpanded(trigger, submenu, containsCurrentPage);
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const willExpand = trigger.getAttribute('aria-expanded') !== 'true';
        nav.querySelectorAll(':scope > .admin-nav-item[data-admin-nav-group]').forEach((item) => {
          if (item === trigger) return;
          const itemSubmenu = item.nextElementSibling;
          if (itemSubmenu?.classList.contains('admin-nav-submenu')) setExpanded(item, itemSubmenu, false);
        });
        setExpanded(trigger, submenu, willExpand);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupAdminNavigation, { once: true });
  else setupAdminNavigation();
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.admin-shell')) return;
  const rechargeEntry = document.querySelector('.wallet .btn');
  if (rechargeEntry) rechargeEntry.onclick = () => { location.href = '../wallet/recharge.html'; };
  const walletBalance = document.querySelector('.wallet > span');
  if (walletBalance && walletBalance.firstChild?.textContent.includes('◎')) {
    walletBalance.firstChild.remove();
    const diamond = document.createElement('i');
    diamond.className = 'coin'; diamond.setAttribute('aria-hidden', 'true');
    walletBalance.prepend(diamond, ' ');
  }
  const blacklistEntry = [...document.querySelectorAll('.menu button')].find(item => item.firstElementChild?.textContent === '黑名单');
  if (blacklistEntry) blacklistEntry.onclick = () => { location.href = 'blacklist-management.html'; };
  const guildCenterEntry = [...document.querySelectorAll('.icons button')].find(item => item.textContent.includes('公会中心'));
  if (guildCenterEntry) guildCenterEntry.onclick = () => { location.href = '../guild/guild-management.html'; };
  const coinValue = document.querySelector('.coin-value');
  if (coinValue) {
    coinValue.className = 'coin';
    coinValue.style.cssText = 'font-size:14px;color:var(--g1)';
  }
  if (document.querySelector('.peer') && document.querySelector('.chat')) {
    const directMessageStyle = document.createElement('style');
    directMessageStyle.textContent = '.chat .msg{align-items:flex-start}.chat .bubble{margin:0}.chat-head .chat-more{width:32px;height:32px;border:0;border-radius:8px;background:var(--g6);color:var(--g2);font:16px inherit;cursor:pointer}';
    document.head.append(directMessageStyle);
    const chatMore = document.createElement('button');
    chatMore.className = 'chat-more'; chatMore.textContent = '...'; chatMore.setAttribute('aria-label', '聊天设置');
    chatMore.onclick = () => { location.href = 'chat-settings.html'; };
    document.querySelector('.chat-head').append(chatMore);
  }
  const groupTitleElement = document.querySelector('.group-title');
  const groupChat = groupTitleElement ? document.querySelector('#chat') : null;
  if (groupChat instanceof Node) {
    const groupStyle = document.createElement('style');
    groupStyle.textContent = '.group-title b{display:flex;align-items:center;gap:5px}.group-title .group-level-tag{padding:2px 5px;border:1px solid var(--g4);border-radius:5px;color:var(--g3);font-size:10px;font-style:normal;font-weight:400}.group-title .member-count{color:var(--g4);font-size:12px;font-style:normal;font-weight:400}.group-chat-meta{display:flex!important;align-items:center;gap:4px}.group-chat-meta span{font-style:normal}.group-chat-meta i{padding:1px 4px;border-radius:5px;font-size:10px;font-style:normal;font-weight:400}.group-chat-meta .level-tag{border:1px solid var(--g4);color:var(--g3)}.group-chat-meta .lamp-tag{background:var(--g3);color:var(--g7)}';
    document.head.append(groupStyle);
    const groupTitle = groupTitleElement, groupHeading = groupTitle.querySelector('b');
    groupTitle.querySelector('span')?.remove();
    groupHeading.innerHTML = 'Sari 的粉丝团<i class="group-level-tag">Lv.20</i><em class="member-count">(184)</em>';
    const groupMore = document.querySelector('.members');
    groupMore.textContent = '...'; groupMore.setAttribute('aria-label', '更多操作');
    groupMore.onclick = () => { location.href = 'group-manage-member.html'; };
    const outfits = { Rina: ['Lv.8', 'Sari 灯牌 2'], 'Sari · 群主': ['Lv.20', 'Sari 灯牌 10'], Andi: ['Lv.12', 'Sari 灯牌 3'] };
    const decorateGroupMessage = (message) => {
      const body = message.querySelector('.message');
      if (!body) return;
      let sender = body.querySelector('b');
      if (!sender) { sender = document.createElement('b'); sender.textContent = message.classList.contains('me') ? 'Andi' : '成员'; body.prepend(sender); }
      if (sender.dataset.decorated) return;
      const name = sender.textContent.trim(), outfit = outfits[name] || ['Lv.1', 'Sari 灯牌 1'];
      sender.dataset.decorated = 'true'; sender.className = 'group-chat-meta';
      sender.innerHTML = `<span>${name}</span><i class="level-tag">${outfit[0]}</i><i class="lamp-tag">${outfit[1]}</i>`;
    };
    groupChat.querySelectorAll('.msg').forEach(decorateGroupMessage);
    new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => { if (node.nodeType === 1 && node.classList.contains('msg')) decorateGroupMessage(node); }))).observe(groupChat, { childList: true });
  }

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.textContent = tab.textContent.replace(/^[^\u4e00-\u9fff]+/, '').trim();
  });

  const shortcuts = {
    '我的装扮': '<path d="M6 8V6a6 6 0 0 1 12 0v2M4 8h16l-1.5 13h-13z"/>',
    '粉丝团': '<path d="M12 20s-7-4.4-9-9c-1.2-2.8.6-6 3.8-6 2 0 3.6 1.2 5.2 3.4C13.6 6.2 15.2 5 17.2 5c3.2 0 5 3.2 3.8 6-2 4.6-9 9-9 9z"/>',
    '邀请奖励': '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8v12M4 12h16M8 8C6 8 5 6.8 5 5.5S6.3 3 7.5 3 12 5 12 8c0-3 3-5 4.5-5S21 4.3 21 5.5 20 8 18 8"/>',
    '开始直播': '<path d="M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM17 10l5-2.5v9L17 14"/>',
    '主播中心': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    '公会中心': '<path d="M3 21V8l4-4 4 4v13M11 21V12l5-3 5 3v9M3 21h18"/>'
  };
  document.querySelectorAll('.icons button').forEach((button) => {
    const label = button.textContent.trim().replace(/^[^\u4e00-\u9fff]+/, '');
    if (shortcuts[label]) button.innerHTML = `<svg class="shortcut-icon" viewBox="0 0 24 24">${shortcuts[label]}</svg><span>${label}</span>`;
    if (label === '主播中心' && button.id !== 'roleCenterButton') button.onclick = () => { location.href = 'host-center.html'; };
    if (label === '开始直播' && button.id !== 'roleStartButton') button.onclick = () => { if (button.textContent.includes('申请成为主播')) Luma.toast('申请成为主播'); else location.href = 'start-live-settings.html'; };
  });

  const notificationIcons = {
    '系统通知': '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    '互动通知': '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="m19 16 .6 1.8L21 18.4l-1.4.6L19 21l-.6-2-1.4-.6 1.4-.6z"/>'
  };
  document.querySelectorAll('.conv').forEach((conversation) => {
    const label = conversation.querySelector('b')?.childNodes[0]?.textContent.trim();
    const avatar = conversation.querySelector('.avatar');
    if (notificationIcons[label] && avatar) {
      avatar.classList.add('notification-avatar');
      avatar.innerHTML = `<svg viewBox="0 0 24 24">${notificationIcons[label]}</svg>`;
    }
  });

  document.querySelectorAll('.tool').forEach((tool) => {
    if (tool.textContent.trim() === '粉丝团管理') tool.onclick = () => { location.href = 'fan-club.html'; };
    if (tool.textContent.trim() === '直播记录') tool.onclick = () => { location.href = 'live-records.html'; };
    if (tool.textContent.trim() === '分成记录') tool.onclick = () => { location.href = 'income-withdrawal.html'; };
  });

  document.querySelectorAll('.section-title button').forEach((button) => {
    if (button.textContent.trim() === '查看数据 ›') button.onclick = () => { location.href = 'live-data.html'; };
  });

  document.querySelectorAll('.conv').forEach((conversation) => {
    const name = conversation.querySelector('b')?.childNodes[0]?.textContent.trim();
    if (name === 'Sari') conversation.onclick = () => { location.href = 'direct-message.html'; };
    if (name === 'Sari 的粉丝团') conversation.onclick = () => { location.href = 'fan-group-chat.html'; };
  });
  document.querySelectorAll('#fans .conv').forEach((conversation) => {
    conversation.onclick = () => { location.href = 'fan-group-chat.html'; };
  });

  const fanClubEntry = document.querySelector('.quick button:nth-child(2)');
  if (fanClubEntry) {
    fanClubEntry.classList.add('fan-club-entry');
    fanClubEntry.innerHTML = '<span>Sari 粉丝团</span><i>Lv.3</i>';
    fanClubEntry.setAttribute('aria-label', '打开 Sari 粉丝团，等级 3');
    fanClubEntry.onclick = () => window.Luma.toast('打开 Sari 粉丝团');
  }

  const roomFollow = document.querySelector('.room #follow');
  const setRoomFollowState = (followed) => {
    if (!roomFollow) return;
    roomFollow.textContent = followed ? '✓' : '+';
    roomFollow.classList.toggle('sub', followed);
    roomFollow.setAttribute('aria-label', followed ? '已关注主播' : '关注主播');
  };

  const room = document.querySelector('.room');
  if (room && fanClubEntry) {
    const fanClubSheet = document.querySelector('#fanClubSheet') || document.createElement('section');
    fanClubSheet.id = 'fanClubSheet';
    fanClubSheet.className = 'fan-club-sheet state-hide';
    fanClubSheet.setAttribute('role', 'dialog');
    fanClubSheet.setAttribute('aria-modal', 'true');
    let joinedFanClub = false;
    const renderFanClubSheet = () => {
      fanClubSheet.innerHTML = `<button type="button" class="fan-club-sheet-close" aria-label="关闭粉丝团">×</button><header><i class="avatar">S</i><div class="fan-club-summary"><div class="fan-club-name"><b>Sari 粉丝团</b><i class="fan-club-level">Lv.3</i></div><div class="fan-club-meta"><span class="fan-club-count">356 人</span><div class="fan-club-rank"><em>粉丝榜</em><i>R</i><i>M</i><i>D</i></div></div></header><section class="fan-club-benefits"><h2>粉丝团权益</h2><div><article><i>◆</i><span><b>粉丝灯牌</b><small>发言展示主播专属灯牌</small></span></article><article><i>↗</i><span><b>进房提示</b><small>进入直播间时显示提示</small></span></article></div></section><button type="button" class="fan-club-primary" data-fan-club-action>${joinedFanClub ? '进入粉丝团群聊' : '加入粉丝团'}</button>`;
      fanClubSheet.querySelector('.fan-club-sheet-close').onclick = () => fanClubSheet.classList.add('state-hide');
      const fanClubAction = fanClubSheet.querySelector('[data-fan-club-action]');
      if (joinedFanClub) {
        fanClubAction.remove();
        return;
      }
      fanClubAction.onclick = () => {
        if (joinedFanClub) { location.href = 'fan-group-chat.html'; return; }
        joinedFanClub = true;
        renderFanClubSheet();
        window.Luma.toast('已加入 Sari 粉丝团');
      };
    };
    const openFanClubSheet = (joined) => {
      joinedFanClub = joined;
      renderFanClubSheet();
      fanClubSheet.classList.remove('state-hide');
      document.querySelector('.gift-drawer')?.classList.add('state-hide');
      document.querySelector('.all-actions')?.classList.add('state-hide');
      document.querySelector('.host-sheet')?.classList.add('state-hide');
    };
    const setFanClubState = (joined) => {
      joinedFanClub = joined;
      window.__fanClubJoined = joined;
      if (joined) fanClubSheet.querySelectorAll('[data-fan-club-action]').forEach((action) => action.remove());
      fanClubSheet.classList.add('state-hide');
    };
    window.Luma.openFanClubSheet = openFanClubSheet;
    window.Luma.setFanClubState = setFanClubState;
    if (!fanClubSheet.isConnected) room.append(fanClubSheet);
    fanClubEntry.onclick = null;
    fanClubEntry.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openFanClubSheet(joinedFanClub);
    });
    roomFollow?.addEventListener('click', () => setRoomFollowState(true));
    window.Luma.registerStates({
      '粉丝团状态': { '未加入': () => setFanClubState(false), '已加入': () => setFanClubState(true) },
      '直播间角色': { '用户': () => window.setRoomRole?.('用户'), '房管': () => window.setRoomRole?.('房管') }
    });
  }

  const roomGiftTotal = document.querySelector('.quick button:first-child');
  if (roomGiftTotal) roomGiftTotal.innerHTML = '<i class="diamond contribution-diamond">◆</i><span>3.26K</span>';

  const roomChat = document.querySelector('.room #chat');
  if (roomChat) {
    const roomNotice = document.createElement('div');
    roomNotice.className = 'room-notice';
    roomNotice.textContent = '请文明互动，友善交流。';
    roomChat.insertBefore(roomNotice, roomChat.querySelector('.chat-item'));
    const compactComment = (item) => {
      item.querySelector(':scope > .avatar')?.remove();
      const meta = item.querySelector('.chat-meta');
      const name = meta?.querySelector('b');
      if (meta && name) {
        const outfits = [...meta.querySelectorAll('.wealth,.lamp,.new-badge')];
        meta.replaceChildren(...outfits, name);
      }
      item.classList.add('text-chat-item');
    };
    roomChat.querySelectorAll('.chat-item').forEach(compactComment);
    new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.classList.contains('chat-item')) compactComment(node);
    }))).observe(roomChat, { childList: true });
    const clearScreen = document.querySelector('[data-clear-screen]');
    if (clearScreen) clearScreen.onclick = () => {
      roomChat.querySelectorAll('.system,.gift-feed,.chat-item').forEach((item) => item.remove());
      document.querySelector('.all-actions')?.classList.add('state-hide');
      window.Luma.toast('已清屏');
    };
  }

  if (location.pathname.endsWith('/live-room.html')) {
    document.querySelector('.all-actions [data-clear-screen]')?.remove();
    const viewerProfileSheet = document.querySelector('#userProfileSheet');
    const viewerProfileActions = viewerProfileSheet?.querySelector('.user-profile-actions');
    if (viewerProfileSheet && viewerProfileActions) {
      viewerProfileSheet.querySelector('.profile-more')?.remove();
      if (!viewerProfileActions.querySelector('[data-viewer-profile-report]')) {
        const reportButton = document.createElement('button');
        reportButton.type = 'button';
        reportButton.dataset.viewerProfileReport = '';
        reportButton.innerHTML = '<b>!</b><span>举报</span>';
        reportButton.onclick = () => window.openRoomReportConfirm?.(viewerProfileSheet.querySelector('[data-user-name]').textContent);
        viewerProfileActions.append(reportButton);
      }
    }
  }

  const hostChip = document.querySelector('.room .host-chip');
  if (hostChip) {
    const hostSheet = document.createElement('section');
    hostSheet.className = 'host-sheet state-hide';
    hostSheet.setAttribute('role', 'dialog');
    hostSheet.setAttribute('aria-modal', 'true');
    hostSheet.setAttribute('aria-label', '主播信息');
    hostSheet.innerHTML = '<header><i class="avatar">S</i><div><b>Sari</b><span>ID: 102938</span></div><button type="button" class="profile-report" data-host-report aria-label="举报">!</button></header><div class="host-badges"><i>Lv.20</i><i>音乐勋章</i></div><p class="host-intro">每晚 9 点，和 Sari 一起听歌聊天。</p><dl class="host-stats"><div><dd>1.8K</dd><dt>粉丝团</dt></div><div><dd>3.26K</dd><dt>本场礼物</dt></div><div><dd>48.7K</dd><dt>粉丝</dt></div></dl><footer><button type="button" class="host-sheet-follow" data-host-follow><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6z"/></svg><span>关注</span></button><button type="button" data-host-gift aria-label="送礼" title="送礼"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8v12M4 12h16M8 8C6 8 5 6.8 5 5.5S6.3 3 7.5 3 12 5 12 8c0-3 3-5 4.5-5S21 4.3 21 5.5 20 8 18 8"/></svg><span>送礼</span></button><button type="button" data-host-message aria-label="私信" title="私信"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>私信</span></button><button type="button" data-host-at aria-label="@Ta" title="@Ta"><span>@</span><em>@Ta</em></button></footer>';
    document.querySelector('.room').append(hostSheet);
    const closeHostSheet = () => hostSheet.classList.add('state-hide');
    const openHostSheet = (event) => {
      event?.preventDefault();
      hostSheet.classList.remove('state-hide');
      document.querySelector('.gift-drawer')?.classList.add('state-hide');
      document.querySelector('.all-actions')?.classList.add('state-hide');
    };
    hostChip.onclick = openHostSheet;
    document.querySelector('.stream')?.addEventListener('click', closeHostSheet);
    hostSheet.querySelector('[data-host-follow]').onclick = (event) => {
      event.stopPropagation();
      const button = event.currentTarget;
      button.classList.add('followed');
      button.querySelector('span').textContent = '已关注';
    };
    hostSheet.querySelector('[data-host-report]').onclick = () => window.openRoomReportConfirm?.('Sari');
    hostSheet.querySelector('[data-host-gift]').onclick = () => { closeHostSheet(); document.querySelector('.gift-drawer')?.classList.remove('state-hide'); };
    hostSheet.querySelector('[data-host-message]').onclick = () => { location.href = 'direct-message.html'; };
    hostSheet.querySelector('[data-host-at]').onclick = () => { const input = document.querySelector('#comment'); closeHostSheet(); if (input) { input.value = '@Sari '; input.dispatchEvent(new Event('input')); input.focus(); } };
  }

  const roomExit = document.querySelector('.room .exit[href]');
  if (roomExit && !location.pathname.endsWith('/live-room.html')) {
    const exitConfirm = document.createElement('section');
    exitConfirm.className = 'exit-confirm state-hide';
    exitConfirm.setAttribute('role', 'dialog');
    exitConfirm.setAttribute('aria-modal', 'true');
    exitConfirm.setAttribute('aria-label', '退出直播间确认');
    exitConfirm.innerHTML = '<div class="exit-confirm-card"><b>是否退出直播间</b><p>退出后将返回首页</p><div><button type="button" data-cancel-exit>取消</button><button type="button" data-confirm-exit>退出</button></div></div>';
    document.querySelector('.room').append(exitConfirm);
    const closeExitConfirm = () => exitConfirm.classList.add('state-hide');
    const openExitConfirm = (event) => {
      event?.preventDefault();
      exitConfirm.classList.remove('state-hide');
    };
    roomExit.onclick = openExitConfirm;
    exitConfirm.querySelector('[data-cancel-exit]').onclick = closeExitConfirm;
    exitConfirm.querySelector('[data-confirm-exit]').onclick = () => { location.href = roomExit.getAttribute('href'); };
  }

  const contacts = document.querySelector('.contact');
  if (contacts) {
    contacts.innerHTML = '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="2.6"/><path d="M8 17c.8-1.8 2.4-2.6 4-2.6s3.2.8 4 2.6M4 7H3M4 12H3M4 17H3"/></svg>';
    contacts.onclick = () => { location.href = 'friend-list.html'; };
  }

  const welfareHero = document.querySelector('.hero');
  if (welfareHero) {
    const firstRechargeEntry = [...welfareHero.querySelectorAll('button')].find((button) => button.textContent.includes('充值福利'));
    if (firstRechargeEntry) firstRechargeEntry.onclick = () => { location.href = '../wallet/recharge.html'; };
    const banners = [
      ['新用户福利', '首充最高加赠 10%', '立即领取'],
      ['邀请好友', '成功邀请可获金币奖励', '查看邀请奖励'],
      ['本周任务', '完成直播任务领取金币', '前往任务中心']
    ];
    const carousel = document.createElement('section');
    carousel.className = 'welfare-carousel';
    carousel.innerHTML = '<div class="welfare-slide"></div><div class="welfare-dots"></div>';
    const slide = carousel.querySelector('.welfare-slide');
    const dots = carousel.querySelector('.welfare-dots');
    const showBanner = (index) => {
      const item = banners[index];
      slide.innerHTML = `<div><small>${item[0]}</small><strong>${item[1]}</strong><span>${item[2]} ›</span></div><i class="welfare-art"><b></b><b></b><b></b></i>`;
      dots.innerHTML = banners.map((_, i) => `<button class="${i === index ? 'active' : ''}" aria-label="第 ${i + 1} 张 Banner"></button>`).join('');
      dots.querySelectorAll('button').forEach((button, i) => button.onclick = () => showBanner(i));
    };
    showBanner(0);
    welfareHero.before(carousel);
  }

  const settings = document.querySelector('.cover button');
  if (settings) settings.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.06-.4.1-.8.1-1.2z"/></svg>';

  document.querySelectorAll('.rank button:not(.rank-search)').forEach((button, index) => {
    const label = button.textContent.trim();
    const people = index === 0 ? ['S', 'D', 'M'] : ['A', 'B', 'R'];
    button.innerHTML = `<span>${label}</span><i class="rank-avatars">${people.map((person) => `<b>${person}</b>`).join('')}</i>`;
    button.style.background = 'var(--g5)';
    button.querySelectorAll('.rank-avatars b').forEach((avatar) => {
      avatar.style.background = 'var(--g6)';
    });
  });

  const giftDrawer = document.querySelector('.gift-drawer');
  const giftList = giftDrawer?.querySelector('.gift-list');
  if (giftDrawer && giftList) {
    giftDrawer.querySelector('.gift-head')?.remove();
    const closeGiftDrawer = document.createElement('button');
    closeGiftDrawer.className = 'gift-drawer-close';
    closeGiftDrawer.type = 'button';
    closeGiftDrawer.setAttribute('aria-label', '关闭礼物面板');
    closeGiftDrawer.textContent = '×';
    closeGiftDrawer.onclick = () => giftDrawer.classList.add('state-hide');
    giftDrawer.prepend(closeGiftDrawer);
    const giftTabs = document.createElement('div');
    giftTabs.className = 'gift-tabs';
    giftTabs.innerHTML = '<button type="button" data-gift-tab="lucky">幸运</button><button type="button" data-gift-tab="normal">普通</button><button type="button" data-gift-tab="custom">定制</button>';
    giftList.before(giftTabs);
    const giftSets = {
      lucky: [['✹', '幸运礼物', '10', 'x1', 10], ['✹', '幸运礼物', '10', 'x10', 100], ['✹', '幸运礼物', '10', 'x100', 1000]],
      normal: [['✦', '鲜花', '10', '', 10], ['☆', '星光', '50', '', 50], ['♩', '麦克风', '100', '', 100]],
      custom: [['✦', '专属花束', '188', '', 188], ['☆', '专属灯牌', '520', '', 520], ['♩', '专属座驾', '1.000', '', 1000]]
    };
    const giftQuantities = [1, 10, 66, 188, 520];
    const giftFooter = document.createElement('footer');
    giftFooter.className = 'gift-footer';
    giftFooter.innerHTML = `<div class="gift-balance"><span class="coin">12.580</span><button type="button" data-recharge aria-label="充值">+</button></div><div class="gift-confirm"><div class="gift-quantity-wrap"><button type="button" class="gift-quantity" data-gift-quantity aria-haspopup="listbox" aria-expanded="false" aria-label="赠送数量 1"><span>1</span><i>⌃</i></button><div class="gift-quantity-menu state-hide" role="listbox">${giftQuantities.map((quantity) => `<button type="button" role="option" data-gift-quantity-option="${quantity}">x${quantity}</button>`).join('')}</div></div><button type="button" data-send-gift>赠送</button></div>`;
    giftList.after(giftFooter);
    let currentTab = 'lucky';
    let selectedGift;
    let giftQuantity = 1;
    const quantityButton = giftFooter.querySelector('[data-gift-quantity]');
    const quantityMenu = giftFooter.querySelector('.gift-quantity-menu');
    const updateQuantity = (quantity) => {
      giftQuantity = quantity;
      quantityButton.querySelector('span').textContent = quantity;
      quantityButton.setAttribute('aria-label', `赠送数量 ${quantity}`);
      quantityButton.setAttribute('aria-expanded', 'false');
      quantityMenu.classList.add('state-hide');
    };
    const selectGift = (gift, index) => {
      selectedGift = gift;
      giftList.querySelectorAll('.gift-item').forEach((item, itemIndex) => item.classList.toggle('selected', itemIndex === index));
      quantityMenu.classList.add('state-hide');
      quantityButton.setAttribute('aria-expanded', 'false');
    };
    const renderGiftTab = (tab) => {
      currentTab = tab;
      giftTabs.querySelectorAll('button').forEach((button) => {
        const active = button.dataset.giftTab === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      const pages = [];
      for (let start = 0; start < giftSets[tab].length; start += 6) pages.push(giftSets[tab].slice(start, start + 6));
      giftList.innerHTML = pages.map((page, pageIndex) => `<div class="gift-page">${page.map(([icon, name, cost, batch], itemIndex) => {
        const index = pageIndex * 6 + itemIndex;
        return `<button class="gift-item" data-gift-index="${index}">${batch ? `<span class="gift-batch">${batch}</span>` : ''}<i>${icon}</i>${name}<small class="coin">${cost}</small></button>`;
      }).join('')}</div>`).join('');
      selectGift(giftSets[tab][0], 0);
    };
    giftTabs.onclick = (event) => {
      const button = event.target.closest('[data-gift-tab]');
      if (button) renderGiftTab(button.dataset.giftTab);
    };
    giftList.onclick = (event) => {
      const item = event.target.closest('[data-gift-index]');
      if (!item) return;
      const index = Number(item.dataset.giftIndex);
      selectGift(giftSets[currentTab][index], index);
    };
    quantityButton.onclick = () => {
      const isOpen = !quantityMenu.classList.contains('state-hide');
      quantityMenu.classList.toggle('state-hide', isOpen);
      quantityButton.setAttribute('aria-expanded', String(!isOpen));
    };
    quantityMenu.onclick = (event) => {
      const option = event.target.closest('[data-gift-quantity-option]');
      if (option) updateQuantity(Number(option.dataset.giftQuantityOption));
    };
    giftFooter.querySelector('[data-recharge]').onclick = () => window.Luma.toast('打开充值');
    giftFooter.querySelector('[data-send-gift]').onclick = () => {
      giftDrawer.classList.add('state-hide');
      window.Luma.toast(`已赠送 ${selectedGift[1]} x${giftQuantity}`);
    };
    renderGiftTab('lucky');
  }

  if (['/live-room-host.html', '/live-room-host-password.html', '/live-room-cohost-active.html'].some((path) => location.pathname.endsWith(path))) {
    const isPasswordHostRoom = location.pathname.endsWith('/live-room-host-password.html');
    const cohostRoom = document.querySelector('.room');
    const pkButton = document.querySelector('[data-host-pk]');
    if (cohostRoom && pkButton) {
      if (!isPasswordHostRoom) {
        const contributionTrigger = cohostRoom.querySelector('[aria-label="本场收到礼物 3.26K"]');
        if (contributionTrigger) {
          const contributionStyle = document.createElement('style');
          contributionStyle.textContent = '.session-gift-sheet{position:absolute;left:0;right:0;bottom:0;z-index:26;height:500px;box-sizing:border-box;padding:16px;border-top:1px solid var(--g5);border-radius:12px 12px 0 0;background:var(--g7);display:flex;flex-direction:column}.session-gift-sheet.state-hide{display:none!important}.session-gift-tabs{height:35px;flex:none;display:flex;align-items:flex-start;gap:22px;margin-bottom:8px;border-bottom:1px solid var(--g6)}.session-gift-tabs button{height:35px;padding:0;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--g4);font:14px inherit;cursor:pointer}.session-gift-tabs button.active{border-color:var(--g1);color:var(--g1);font-weight:600}.session-gift-tabs [data-close-session-gift]{width:32px;margin-left:auto;border-bottom:0;color:var(--g2);font-size:26px;line-height:1}.session-gift-sheet [data-session-panel=contribution]{min-height:0;flex:1;overflow:auto}.session-gift-sheet [data-session-panel].state-hide{display:none!important}.session-donor-list article{min-height:62px;padding:7px 2px;border-bottom:1px solid var(--g6);display:flex;align-items:center;gap:8px}.session-donor-list em{width:20px;flex:none;color:var(--g3);font:12px inherit;text-align:center}.session-donor-list article:nth-child(-n+3)>em{color:var(--g1);font-weight:700}.session-donor-list article>i{width:34px;height:34px;flex:none;border:1px solid var(--g1);border-radius:50%;background:var(--g7);display:grid;place-items:center;font-size:12px;font-style:normal}.session-donor-list span{min-width:0;flex:1}.session-donor-list span>b{display:block;margin:0 0 3px;font-size:14px}.session-donor-list span>small{display:inline-block;margin-right:3px;padding:2px 4px;border-radius:5px;background:var(--g6);color:var(--g3);font-size:9px;white-space:nowrap}.session-donor-list strong{min-width:58px;color:var(--g1);font-size:14px;font-weight:700;text-align:right;white-space:nowrap}.session-gift-sheet [data-session-panel=gifts]{min-height:0;flex:1}.session-gift-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding-top:8px}.session-gift-grid article{min-height:112px;padding:10px 4px;border:1px solid var(--g5);border-radius:8px;background:var(--g6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center}.session-gift-grid i{width:42px;height:42px;border-radius:50%;background:var(--g7);display:grid;place-items:center;color:var(--g1);font-size:22px;font-style:normal}.session-gift-grid b{font-size:12px;white-space:nowrap}.session-gift-grid strong{color:var(--g1);font-size:17px;line-height:1}';
          document.head.append(contributionStyle);
          const contributionSheet = document.createElement('section');
          contributionSheet.className = 'session-gift-sheet state-hide';
          contributionSheet.setAttribute('role', 'dialog');
          contributionSheet.setAttribute('aria-modal', 'true');
          contributionSheet.setAttribute('aria-label', '本场贡献');
          contributionSheet.innerHTML = `<nav class="session-gift-tabs"><button type="button" class="active" data-session-tab="contribution">贡献榜</button><button type="button" data-session-tab="gifts">收到礼物</button><button type="button" data-close-session-gift aria-label="关闭本场贡献">×</button></nav><section data-session-panel="contribution"><div class="session-donor-list"><article><em>1</em><i>R</i><span><b>Rina</b><small>财富 Lv.18</small><small>粉丝 Lv.11</small></span><strong>◆ 3.260</strong></article><article><em>2</em><i>M</i><span><b>Maya</b><small>财富 Lv.15</small><small>粉丝 Lv.9</small></span><strong>◆ 1.860</strong></article><article><em>3</em><i>L</i><span><b>Lina</b><small>财富 Lv.18</small><small>粉丝 Lv.8</small></span><strong>◆ 960</strong></article><article><em>4</em><i>D</i><span><b>Dewi</b><small>财富 Lv.12</small><small>粉丝 Lv.7</small></span><strong>◆ 720</strong></article></div></section><section class="state-hide" data-session-panel="gifts"><div class="session-gift-grid"><article><i>✦</i><b>星光</b><strong>x28</strong></article><article><i>♔</i><b>钻石王冠</b><strong>x12</strong></article><article><i>✿</i><b>鲜花</b><strong>x36</strong></article></div></section>`;
          cohostRoom.append(contributionSheet);
          contributionTrigger.onclick = () => contributionSheet.classList.remove('state-hide');
          contributionSheet.querySelector('[data-close-session-gift]').onclick = () => contributionSheet.classList.add('state-hide');
          contributionSheet.querySelectorAll('[data-session-tab]').forEach((tab) => {
            tab.onclick = () => {
              contributionSheet.querySelectorAll('[data-session-tab]').forEach((item) => item.classList.toggle('active', item === tab));
              contributionSheet.querySelectorAll('[data-session-panel]').forEach((panel) => panel.classList.toggle('state-hide', panel.dataset.sessionPanel !== tab.dataset.sessionTab));
            };
          });
        }
      }
      const cohostStyle = document.createElement('style');
      cohostStyle.textContent = `
        .cohost-sheet{position:absolute;left:0;right:0;bottom:0;z-index:20;max-height:82%;padding:16px 16px 20px;border-top:1px solid var(--g5);border-radius:12px 12px 0 0;background:var(--g7);box-shadow:0 -10px 24px rgba(0,0,0,.12);overflow:auto}
        .cohost-sheet.state-hide{display:none!important}
        .cohost-sheet-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.cohost-sheet-head b{font-size:17px}.cohost-sheet-close{width:32px;height:32px;padding:0;border:0;background:transparent;color:var(--g2);font:26px/1 inherit;cursor:pointer}
        .cohost-search{display:flex;align-items:center;height:42px;padding:0 12px;border-radius:8px;background:var(--g6);color:var(--g3)}.cohost-search span{margin-right:7px;font-size:16px}.cohost-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--g1);font:14px inherit}.cohost-search input::placeholder{color:var(--g4)}
        .cohost-section{margin-top:18px}.cohost-section h2{display:flex;align-items:center;justify-content:space-between;margin:0 0 8px;font-size:14px}.cohost-section h2 small{color:var(--g3);font-size:11px;font-weight:400}.cohost-row{display:flex;align-items:center;gap:10px;min-height:58px;padding:8px 0;border-bottom:1px solid var(--g6)}.cohost-row:last-child{border-bottom:0}.cohost-avatar{width:38px;height:38px;flex:none;border-radius:50%;background:var(--g5);color:var(--g1);display:grid;place-items:center;font-size:13px;font-style:normal}.cohost-copy{min-width:0;flex:1}.cohost-copy b{display:block;overflow:hidden;font-size:14px;white-space:nowrap;text-overflow:ellipsis}.cohost-copy small{display:block;margin-top:3px;color:var(--g3);font-size:11px}.cohost-action{height:30px;padding:0 12px;border:0;border-radius:8px;background:var(--g1);color:var(--g7);font:12px inherit;cursor:pointer}.cohost-action.secondary{background:var(--g6);color:var(--g2)}.cohost-action.icon{width:30px;padding:0;border-radius:50%;font:18px/1 inherit}.cohost-invite-actions{display:flex;gap:7px}.cohost-empty{margin:14px 0 0;color:var(--g3);font-size:13px;text-align:center}[data-host-pk].is-disabled{background:var(--g5);color:var(--g4);cursor:not-allowed}
      `;
      document.head.append(cohostStyle);
      const cohostSheet = document.createElement('section');
      cohostSheet.className = 'cohost-sheet state-hide';
      cohostSheet.setAttribute('role', 'dialog');
      cohostSheet.setAttribute('aria-modal', 'true');
      cohostSheet.setAttribute('aria-label', '连麦主播');
      cohostSheet.innerHTML = `
        <header class="cohost-sheet-head"><b>连麦主播</b><button type="button" class="cohost-sheet-close" data-close-cohost aria-label="关闭连麦主播">×</button></header>
        <label class="cohost-search"><span>⌕</span><input type="search" data-cohost-search placeholder="搜索 ID、名字" aria-label="搜索 ID、名字"></label>
        <section class="cohost-section state-hide" data-cohost-search-results><div data-cohost-search-hosts></div></section>
        <section class="cohost-section" data-cohost-outgoing-section><h2>发出的请求</h2><div data-cohost-outgoing></div></section>
        <section class="cohost-section" data-cohost-invite-section><h2>收到的邀请</h2><div data-cohost-invites></div></section>
      `;
      cohostRoom.append(cohostSheet);
      const incomingInvites = [
        { name: 'Nadia', id: '88421109', avatar: 'N' },
        { name: 'Lina', id: '71249663', avatar: 'L' },
        { name: 'Ayu', id: '62874015', avatar: 'A' }
      ];
      const searchableHosts = [
        { name: 'Zara', id: '62389741', avatar: 'Z' },
        { name: 'Putri', id: '69017245', avatar: 'P' },
        { name: 'Fajar', id: '69736281', avatar: 'F' }
      ];
      let outgoingInvite = { name: 'Sinta', id: '69427158', avatar: 'S' };
      const searchResults = cohostSheet.querySelector('[data-cohost-search-results]');
      const searchHostList = cohostSheet.querySelector('[data-cohost-search-hosts]');
      const outgoingSection = cohostSheet.querySelector('[data-cohost-outgoing-section]');
      const inviteSection = cohostSheet.querySelector('[data-cohost-invite-section]');
      const outgoingList = cohostSheet.querySelector('[data-cohost-outgoing]');
      const inviteList = cohostSheet.querySelector('[data-cohost-invites]');
      const renderInvites = (keyword = '') => {
        const normalized = keyword.trim().toLowerCase();
        const items = incomingInvites.filter((host) => !normalized || host.name.toLowerCase().includes(normalized) || host.id.includes(normalized));
        const outgoingMatches = outgoingInvite && (!normalized || outgoingInvite.name.toLowerCase().includes(normalized) || outgoingInvite.id.includes(normalized));
        const matchedHosts = normalized ? searchableHosts.filter((host) => host.name.toLowerCase().includes(normalized) || host.id.includes(normalized)) : [];
        searchResults.classList.toggle('state-hide', !normalized);
        outgoingSection.classList.toggle('state-hide', Boolean(normalized));
        inviteSection.classList.toggle('state-hide', Boolean(normalized));
        searchHostList.innerHTML = matchedHosts.length ? matchedHosts.map((host) => `<article class="cohost-row"><i class="cohost-avatar">${host.avatar}</i><span class="cohost-copy"><b>${host.name}</b><small>ID：${host.id}</small></span><button type="button" class="cohost-action icon" data-start-cohost="${host.name}" aria-label="向 ${host.name} 发起连麦" title="发起连麦">↗</button></article>`).join('') : '<p class="cohost-empty">暂无匹配主播</p>';
        outgoingList.innerHTML = outgoingMatches ? `<article class="cohost-row"><i class="cohost-avatar">${outgoingInvite.avatar}</i><span class="cohost-copy"><b>${outgoingInvite.name}</b><small>ID：${outgoingInvite.id}</small></span><button type="button" class="cohost-action secondary" data-cancel-outgoing>取消</button></article>` : '<p class="cohost-empty">暂无发出的请求</p>';
        inviteList.innerHTML = items.length ? items.map((host) => `<article class="cohost-row"><i class="cohost-avatar">${host.avatar}</i><span class="cohost-copy"><b>${host.name}</b><small>ID：${host.id}</small></span><span class="cohost-invite-actions"><button type="button" class="cohost-action secondary" data-decline-invite="${host.name}">拒绝</button><button type="button" class="cohost-action" data-accept-invite="${host.name}">接受</button></span></article>`).join('') : '<p class="cohost-empty">暂无收到的邀请</p>';
      };
      const closeCohostSheet = () => cohostSheet.classList.add('state-hide');
      if (isPasswordHostRoom) {
        pkButton.classList.add('is-disabled');
        pkButton.setAttribute('aria-disabled', 'true');
        pkButton.setAttribute('aria-label', 'PK，密码房不可发起连麦');
        pkButton.title = '密码房无法发起连麦';
        pkButton.onclick = () => window.Luma.toast('密码房无法发起连麦');
      } else {
        pkButton.onclick = () => { renderInvites(); cohostSheet.querySelector('[data-cohost-search]').value = ''; cohostSheet.classList.remove('state-hide'); };
      }
      cohostSheet.querySelector('[data-close-cohost]').onclick = closeCohostSheet;
      cohostSheet.querySelector('[data-cohost-search]').oninput = (event) => renderInvites(event.currentTarget.value);
      searchHostList.onclick = (event) => {
        const button = event.target.closest('[data-start-cohost]');
        if (!button) return;
        const host = searchableHosts.find((item) => item.name === button.dataset.startCohost);
        if (!host) return;
        if (outgoingInvite) {
          window.Luma.toast('已有发出的连麦请求');
          return;
        }
        outgoingInvite = host;
        const searchInput = cohostSheet.querySelector('[data-cohost-search]');
        searchInput.value = '';
        renderInvites();
        window.Luma.toast(`已向 ${host.name} 发起连麦请求`);
      };
      outgoingList.onclick = (event) => {
        if (!event.target.closest('[data-cancel-outgoing]') || !outgoingInvite) return;
        const name = outgoingInvite.name;
        outgoingInvite = null;
        renderInvites(cohostSheet.querySelector('[data-cohost-search]').value);
        window.Luma.toast(`已取消向 ${name} 发出的连麦请求`);
      };
      inviteList.onclick = (event) => {
        const button = event.target.closest('[data-accept-invite],[data-decline-invite]');
        if (!button) return;
        const accepted = Boolean(button.dataset.acceptInvite);
        const name = button.dataset.acceptInvite || button.dataset.declineInvite;
        incomingInvites.splice(incomingInvites.findIndex((invite) => invite.name === name), 1);
        renderInvites(cohostSheet.querySelector('[data-cohost-search]').value);
        if (accepted) { closeCohostSheet(); window.Luma.toast(`已接受 ${name} 的连麦邀请`); }
        else window.Luma.toast(`已拒绝 ${name} 的连麦邀请`);
      };
      window.Luma.registerStates({
        连麦主播: {
          搜索结果: () => {
            const searchInput = cohostSheet.querySelector('[data-cohost-search]');
            searchInput.value = 'Zara';
            renderInvites(searchInput.value);
            cohostSheet.classList.remove('state-hide');
          }
        }
      });

      const hostSettingsButton = cohostRoom.querySelector('[data-host-settings]');
      const hostMoreButton = cohostRoom.querySelector('#moreActions');
      hostSettingsButton?.remove();
      if (hostMoreButton) {
        const hostSettingsSheet = document.createElement('section');
        hostSettingsSheet.className = 'host-settings-sheet state-hide';
        hostSettingsSheet.setAttribute('role', 'dialog');
        hostSettingsSheet.setAttribute('aria-modal', 'true');
        hostSettingsSheet.setAttribute('aria-label', '直播设置');
        hostSettingsSheet.innerHTML = `
          <button type="button" class="host-settings-close" data-close-host-settings aria-label="关闭设置">×</button>
          <div class="host-settings-grid">
            <button type="button" data-host-setting="beauty"><i>美</i><span>美颜设置</span></button>
            <button type="button" data-host-setting="muted"><i>禁</i><span>禁言列表</span></button>
            <button type="button" data-host-setting="password"><i>密</i><span>房间密码</span></button>
            <button type="button" data-host-setting="clear"><i>清</i><span>清屏</span></button>
          </div>
        `;
        const hostSettingsStyle = document.createElement('style');
        hostSettingsStyle.textContent = `
          .host-settings-sheet{position:absolute;left:0;right:0;bottom:0;z-index:24;padding:28px 16px 20px;border-top:1px solid var(--g5);border-radius:12px 12px 0 0;background:var(--g7);box-shadow:0 -10px 24px rgba(0,0,0,.12)}.host-settings-sheet.state-hide{display:none!important}.host-settings-close{position:absolute;top:8px;right:10px;width:32px;height:32px;padding:0;border:0;background:transparent;color:var(--g2);font:26px/1 inherit;cursor:pointer}.host-settings-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.host-settings-grid button{height:82px;padding:8px 2px;border:0;border-radius:8px;background:var(--g6);color:var(--g1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;font:12px inherit;cursor:pointer}.host-settings-grid button:hover{background:var(--g5)}.host-settings-grid button:disabled{opacity:.38;cursor:not-allowed}.host-settings-grid button:disabled:hover{background:var(--g6)}.host-settings-grid button>i{width:32px;height:32px;border-radius:8px;background:var(--g7);color:var(--g2);display:grid;place-items:center;font-size:13px;font-style:normal}.host-settings-grid button>span{white-space:nowrap}.room-password-sheet{position:absolute;left:0;right:0;bottom:0;z-index:25;padding:16px 16px 20px;border-top:1px solid var(--g5);border-radius:12px 12px 0 0;background:var(--g7);box-shadow:0 -10px 24px rgba(0,0,0,.12)}.room-password-sheet.state-hide{display:none!important}.room-password-sheet header{height:34px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.room-password-sheet header b{font-size:17px}.room-password-sheet header button{width:32px;height:32px;padding:0;border:0;background:transparent;color:var(--g2);font:26px/1 inherit;cursor:pointer}.room-password-current{display:flex;align-items:center;justify-content:space-between;padding:12px;border-radius:8px;background:var(--g6);font-size:13px}.room-password-current b{font-size:16px;letter-spacing:1px}.room-password-sheet label{display:block;margin-top:14px;font-size:13px}.room-password-sheet input{box-sizing:border-box;width:100%;height:42px;margin-top:7px;padding:0 12px;border:1px solid var(--g5);border-radius:8px;background:var(--g7);color:var(--g1);font:15px inherit;letter-spacing:1px;outline:0}.room-password-sheet [data-save-room-password]{width:100%;height:40px;margin-top:16px;border:0;border-radius:8px;background:var(--g1);color:var(--g7);font:14px inherit;cursor:pointer}
        `;
        document.head.append(hostSettingsStyle);
        cohostRoom.append(hostSettingsSheet);
        const mutedUsersSheet = document.createElement('section');
        mutedUsersSheet.className = 'muted-users-sheet state-hide';
        mutedUsersSheet.setAttribute('role', 'dialog');
        mutedUsersSheet.setAttribute('aria-modal', 'true');
        mutedUsersSheet.setAttribute('aria-label', '禁用用户');
        mutedUsersSheet.innerHTML = '<header><b>禁用用户</b><button type="button" data-close-muted-users aria-label="关闭禁用用户">×</button></header><section data-muted-user-list></section><div class="muted-users-empty state-hide">暂无禁用用户</div>';
        const mutedUsersStyle = document.createElement('style');
        mutedUsersStyle.textContent = '.muted-users-sheet{position:absolute;left:0;right:0;bottom:0;z-index:25;min-height:360px;padding:16px;border-top:1px solid var(--g5);border-radius:12px 12px 0 0;background:var(--g7);box-shadow:0 -10px 24px rgba(0,0,0,.12)}.muted-users-sheet.state-hide{display:none!important}.muted-users-sheet header{height:34px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--g6)}.muted-users-sheet header b{font-size:17px}.muted-users-sheet header button{width:32px;height:32px;padding:0;border:0;background:transparent;color:var(--g2);font:26px/1 inherit;cursor:pointer}.muted-user-row{min-height:62px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--g6)}.muted-user-row .avatar{width:38px;height:38px;font-size:13px}.muted-user-row span{min-width:0;flex:1}.muted-user-row span b{display:block;font-size:14px}.muted-user-row button{height:30px;padding:0 11px;border:1px solid var(--g5);border-radius:15px;background:var(--g7);color:var(--g2);font:12px inherit;white-space:nowrap;cursor:pointer}.muted-users-empty{padding:46px 0;color:var(--g3);font-size:14px;text-align:center}.muted-users-empty.state-hide{display:none!important}';
        document.head.append(mutedUsersStyle);
        cohostRoom.append(mutedUsersSheet);
        const mutedUsers = [
          { name: 'Rina' },
          { name: 'Maya' },
          { name: 'Dewi' }
        ];
        const renderMutedUsers = () => {
          const list = mutedUsersSheet.querySelector('[data-muted-user-list]');
          list.innerHTML = mutedUsers.map((user) => `<article class="muted-user-row"><i class="avatar">${user.name.slice(0, 1)}</i><span><b>${user.name}</b></span><button type="button" data-unmute-user="${user.name}">恢复发言</button></article>`).join('');
          mutedUsersSheet.querySelector('.muted-users-empty').classList.toggle('state-hide', mutedUsers.length > 0);
        };
        mutedUsersSheet.querySelector('[data-close-muted-users]').onclick = () => mutedUsersSheet.classList.add('state-hide');
        mutedUsersSheet.addEventListener('click', (event) => {
          const button = event.target.closest('[data-unmute-user]');
          if (!button) return;
          const index = mutedUsers.findIndex((user) => user.name === button.dataset.unmuteUser);
          if (index < 0) return;
          const [user] = mutedUsers.splice(index, 1);
          renderMutedUsers();
          window.Luma.toast(`已恢复 ${user.name} 的发言`);
        });
        const fanGroupSetting = document.createElement('button');
        fanGroupSetting.type = 'button';
        fanGroupSetting.dataset.hostSetting = 'share';
        fanGroupSetting.innerHTML = '<i>转</i><span>转发</span>';
        hostSettingsSheet.querySelector('.host-settings-grid').append(fanGroupSetting);
        const fanGroupLiveCard = window.LUMA_MOCK?.fanGroupLiveRoomCard?.live || {};
        const fanGroupCoverUrl = new URL(`../../../assets/${fanGroupLiveCard.coverAsset || 'live-room-cover.svg'}`, location.href).href;
        const fanGroupForwardConfirm = document.createElement('section');
        fanGroupForwardConfirm.className = 'fan-group-forward-confirm state-hide';
        fanGroupForwardConfirm.setAttribute('role', 'dialog');
        fanGroupForwardConfirm.setAttribute('aria-modal', 'true');
        fanGroupForwardConfirm.setAttribute('aria-label', '转发确认');
        fanGroupForwardConfirm.innerHTML = `<div><p class="fan-group-forward-title">转发至粉丝群</p><article class="fan-group-forward-card"><span class="fan-group-forward-cover"><img src="${fanGroupCoverUrl}" alt="${fanGroupLiveCard.host || 'Sari'} 的直播间封面"><i>${fanGroupLiveCard.status || '直播中'}</i></span><span class="fan-group-forward-copy"><b>${fanGroupLiveCard.title || '今晚唱到你睡着'}</b><span>${fanGroupLiveCard.host || 'Sari'} 的直播间</span></span></article><footer><button type="button" data-cancel-fan-group-forward>取消</button><button type="button" data-confirm-fan-group-forward>发送</button></footer></div>`;
        const fanGroupForwardStyle = document.createElement('style');
        fanGroupForwardStyle.textContent = '.fan-group-forward-confirm{position:absolute;inset:0;z-index:28;display:grid;place-items:center;background:color-mix(in srgb,var(--g1) 36%,transparent)}.fan-group-forward-confirm.state-hide{display:none!important}.fan-group-forward-confirm>div{width:290px;padding:20px 16px 16px;box-sizing:border-box;border-radius:8px;background:var(--g7);text-align:center}.fan-group-forward-title{margin:0 0 16px;color:var(--g3);font-size:13px}.fan-group-forward-card{width:168px;overflow:hidden;margin:0 auto;border:1px solid var(--g5);border-radius:8px;background:var(--g7);color:var(--g1);text-align:left}.fan-group-forward-cover{position:relative;display:block;width:100%;height:158px;background:var(--g5)}.fan-group-forward-cover img{display:block;width:100%;height:100%;object-fit:cover}.fan-group-forward-cover i{position:absolute;top:7px;left:7px;max-width:calc(100% - 14px);padding:3px 6px;border-radius:5px;background:var(--danger);color:var(--g7);font-size:10px;font-style:normal;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fan-group-forward-copy{display:block;padding:8px 9px 9px}.fan-group-forward-copy b,.fan-group-forward-copy span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fan-group-forward-copy b{font-size:12px;line-height:1.3}.fan-group-forward-copy span{margin-top:3px;color:var(--g4);font-size:10px}.fan-group-forward-confirm footer{display:flex;gap:10px;margin-top:20px}.fan-group-forward-confirm footer button{height:38px;flex:1;border:0;border-radius:8px;font:14px inherit;cursor:pointer}.fan-group-forward-confirm [data-cancel-fan-group-forward]{background:var(--g6);color:var(--g2)}.fan-group-forward-confirm [data-confirm-fan-group-forward]{background:var(--g1);color:var(--g7)}';
        document.head.append(fanGroupForwardStyle);
        cohostRoom.append(fanGroupForwardConfirm);
        const shareRecipientSheet = document.createElement('section');
        shareRecipientSheet.className = 'share-recipient-sheet state-hide';
        shareRecipientSheet.setAttribute('role', 'dialog');
        shareRecipientSheet.setAttribute('aria-modal', 'true');
        shareRecipientSheet.setAttribute('aria-label', '选择分享对象');
        shareRecipientSheet.innerHTML = '<header><b>选择分享对象</b><button type="button" data-close-share-recipient aria-label="关闭选择分享对象">×</button></header><button type="button" class="share-recipient-row fan-group" data-share-recipient="Sari 粉丝团"><i>群</i><span><b>Sari 粉丝团</b><small>356 人</small></span></button><button type="button" class="share-recipient-row" data-share-recipient="Rina"><i>R</i><span><b>Rina</b><small>财富 Lv.18</small></span></button><button type="button" class="share-recipient-row" data-share-recipient="Maya"><i>M</i><span><b>Maya</b><small>财富 Lv.15</small></span></button><button type="button" class="share-recipient-row" data-share-recipient="Dewi"><i>D</i><span><b>Dewi</b><small>财富 Lv.12</small></span></button>';
        const shareRecipientStyle = document.createElement('style');
        shareRecipientStyle.textContent = '.share-recipient-sheet{position:absolute;right:0;bottom:0;left:0;z-index:27;min-height:520px;max-height:86%;padding:16px 16px 20px;border-top:1px solid var(--g5);border-radius:12px 12px 0 0;background:var(--g7);box-shadow:0 -10px 24px rgba(0,0,0,.12);overflow:auto}.share-recipient-sheet.state-hide{display:none!important}.share-recipient-sheet header{display:flex;align-items:center;justify-content:space-between;height:32px;margin-bottom:12px}.share-recipient-sheet header b{font-size:17px}.share-recipient-sheet header button{width:32px;height:32px;padding:0;border:0;background:transparent;color:var(--g2);font:26px/1 inherit;cursor:pointer}.share-recipient-row{display:flex;width:100%;min-height:58px;align-items:center;gap:10px;padding:8px 0;border:0;border-bottom:1px solid var(--g6);background:transparent;color:var(--g1);font:14px inherit;text-align:left;cursor:pointer}.share-recipient-row.fan-group{margin-bottom:8px;padding:8px;border:1px solid var(--g5);border-radius:8px;background:var(--g6)}.share-recipient-row>i{display:grid;width:38px;height:38px;flex:none;border-radius:50%;background:var(--g5);color:var(--g2);place-items:center;font-size:13px;font-style:normal}.share-recipient-row>span{min-width:0;flex:1}.share-recipient-row b,.share-recipient-row small{display:block}.share-recipient-row b{overflow:hidden;font-size:14px;white-space:nowrap;text-overflow:ellipsis}.share-recipient-row small{margin-top:3px;color:var(--g3);font-size:11px}.share-recipient-row:hover{background:var(--g6)}';
        document.head.append(shareRecipientStyle);
        cohostRoom.append(shareRecipientSheet);
        let shareRecipient = fanGroupLiveCard.fanGroupName || 'Sari 粉丝团';
        const openShareConfirm = (recipient) => {
          shareRecipient = recipient;
          fanGroupForwardConfirm.querySelector('.fan-group-forward-title').textContent = `转发至 ${recipient}`;
          fanGroupForwardConfirm.setAttribute('aria-label', `转发至 ${recipient} 确认`);
          fanGroupForwardConfirm.classList.remove('state-hide');
        };
        fanGroupForwardConfirm.querySelector('[data-cancel-fan-group-forward]').onclick = () => fanGroupForwardConfirm.classList.add('state-hide');
        fanGroupForwardConfirm.querySelector('[data-confirm-fan-group-forward]').onclick = () => {
          fanGroupForwardConfirm.classList.add('state-hide');
          window.Luma.toast(`已转发至 ${shareRecipient}`);
        };
        shareRecipientSheet.querySelector('[data-close-share-recipient]').onclick = () => shareRecipientSheet.classList.add('state-hide');
        shareRecipientSheet.querySelectorAll('[data-share-recipient]').forEach((item) => {
          item.onclick = () => {
            shareRecipientSheet.classList.add('state-hide');
            openShareConfirm(item.dataset.shareRecipient);
          };
        });
        const passwordSetting = hostSettingsSheet.querySelector('[data-host-setting="password"]');
        passwordSetting.disabled = !isPasswordHostRoom;
        if (!isPasswordHostRoom) passwordSetting.setAttribute('aria-label', '房间密码，仅密码房可修改');
        let roomPassword = '82641935';
        const roomPasswordSheet = document.createElement('section');
        roomPasswordSheet.className = 'room-password-sheet state-hide';
        roomPasswordSheet.setAttribute('role', 'dialog');
        roomPasswordSheet.setAttribute('aria-modal', 'true');
        roomPasswordSheet.setAttribute('aria-label', '房间密码');
        roomPasswordSheet.innerHTML = '<header><b>房间密码</b><button type="button" data-close-room-password aria-label="关闭房间密码">×</button></header><div class="room-password-current"><span>当前房间密码</span><b data-current-room-password></b></div><label>新密码<input type="text" inputmode="numeric" maxlength="8" data-room-password-input aria-label="新密码，8 位数字"></label><button type="button" data-save-room-password>保存密码</button>';
        cohostRoom.append(roomPasswordSheet);
        const roomPasswordInput = roomPasswordSheet.querySelector('[data-room-password-input]');
        const syncRoomPassword = () => {
          roomPasswordSheet.querySelector('[data-current-room-password]').textContent = roomPassword;
          roomPasswordInput.value = roomPassword;
        };
        roomPasswordSheet.querySelector('[data-close-room-password]').onclick = () => roomPasswordSheet.classList.add('state-hide');
        roomPasswordSheet.querySelector('[data-save-room-password]').onclick = () => {
          const nextPassword = roomPasswordInput.value.trim();
          if (!/^\d{8}$/.test(nextPassword)) { window.Luma.toast('请输入 8 位数字密码'); return; }
          roomPassword = nextPassword;
          syncRoomPassword();
          roomPasswordSheet.classList.add('state-hide');
          window.Luma.toast('房间密码已修改');
        };
        hostMoreButton.onclick = () => {
          document.querySelector('.all-actions')?.classList.add('state-hide');
          hostSettingsSheet.classList.remove('state-hide');
        };
        hostSettingsSheet.querySelector('[data-close-host-settings]').onclick = () => hostSettingsSheet.classList.add('state-hide');
        hostSettingsSheet.querySelectorAll('[data-host-setting]').forEach((item) => {
          item.onclick = () => {
            hostSettingsSheet.classList.add('state-hide');
            if (item.dataset.hostSetting === 'password' && isPasswordHostRoom) {
              syncRoomPassword();
              roomPasswordSheet.classList.remove('state-hide');
              return;
            }
            if (item.dataset.hostSetting === 'share') {
              shareRecipientSheet.classList.remove('state-hide');
              return;
            }
            if (item.dataset.hostSetting === 'muted') {
              renderMutedUsers();
              mutedUsersSheet.classList.remove('state-hide');
              return;
            }
            if (item.dataset.hostSetting === 'clear') {
              cohostRoom.querySelector('#chat')?.querySelectorAll('.system,.gift-feed,.chat-item').forEach((message) => message.remove());
              window.Luma.toast('已清屏');
              return;
            }
            window.Luma.toast(`打开${item.querySelector('span').textContent}`);
          };
        });
      }

      const hostChat = cohostRoom.querySelector('#chat');
      if (hostChat) {
        const commentModerationStyle = document.createElement('style');
        commentModerationStyle.textContent = '.room #chat .chat-item{position:relative;pointer-events:auto;cursor:pointer}.comment-block-action{position:absolute;right:0;bottom:calc(100% + 7px);z-index:3;width:82px;height:30px;padding:0;border:1px solid var(--g5);border-radius:15px;background:var(--g7);box-shadow:0 3px 10px rgba(0,0,0,.1);color:var(--g2);font:11px inherit;white-space:nowrap;cursor:pointer}.comment-block-action:after{content:"";position:absolute;right:14px;bottom:-5px;border:5px solid transparent;border-top-color:var(--g7);border-bottom:0}.comment-block-action:hover{background:var(--g6);color:var(--g1)}';
        document.head.append(commentModerationStyle);
        hostChat.addEventListener('click', (event) => {
          const action = event.target.closest('.comment-block-action');
          if (action) {
            const commentItem = action.closest('.chat-item');
            commentItem?.remove();
            window.Luma.toast('已屏蔽此评论');
            return;
          }
          const commentItem = event.target.closest('.chat-item');
          if (!commentItem) return;
          hostChat.querySelectorAll('.comment-block-action').forEach((button) => button.remove());
          const blockButton = document.createElement('button');
          blockButton.type = 'button';
          blockButton.className = 'comment-block-action';
          blockButton.textContent = '屏蔽此评论';
          commentItem.append(blockButton);
        });
        cohostRoom.querySelector('.stream')?.addEventListener('click', () => hostChat.querySelectorAll('.comment-block-action').forEach((button) => button.remove()));
      }

      const hostProfileSheet = cohostRoom.querySelector('#userProfileSheet');
      const hostProfileActions = hostProfileSheet?.querySelector('.user-profile-actions');
      if (hostProfileSheet && hostProfileActions) {
        hostProfileSheet.querySelector('.profile-more')?.remove();
        hostProfileActions.classList.add('host-profile-actions-scroll');
        hostProfileActions.querySelectorAll('[data-host-profile-action]').forEach((button) => button.remove());
        const hostProfileActionStyle = document.createElement('style');
        hostProfileActionStyle.textContent = '.host-profile-actions-scroll{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;width:100%!important;box-sizing:border-box!important;padding:14px 16px 2px!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain;scrollbar-width:none}.host-profile-actions-scroll::-webkit-scrollbar{display:none}.host-profile-actions-scroll button{box-sizing:border-box!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:34px!important;padding:0 10px!important;white-space:nowrap!important}.host-profile-actions-scroll [data-host-profile-action] b{font-size:13px!important}.host-profile-actions-scroll [data-host-profile-action].active{background:var(--g1)!important;color:var(--g7)!important}';
        document.head.append(hostProfileActionStyle);
        const operations = [
          ['report', '!', '举报'],
          ['mute', '−', '禁言'],
          ['remove', '×', '踢出'],
          ['block', '⊘', '拉黑'],
          ['manager', '房', '设房管']
        ];
        operations.forEach(([action, icon, label]) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.dataset.hostProfileAction = action;
          button.innerHTML = `<b>${icon}</b><span>${label}</span>`;
          hostProfileActions.append(button);
        });
        hostProfileActions.querySelector('[data-host-profile-action="report"]').onclick = () => window.openRoomReportConfirm?.(hostProfileSheet.querySelector('[data-user-name]').textContent);
        hostProfileActions.querySelector('[data-host-profile-action="mute"]').onclick = (event) => {
          const button = event.currentTarget;
          const muted = button.classList.toggle('active');
          button.querySelector('span').textContent = muted ? '解除禁言' : '禁言';
          window.Luma.toast(muted ? '已禁言' : '已解除禁言');
        };
        hostProfileActions.querySelector('[data-host-profile-action="remove"]').onclick = () => window.Luma.toast('已踢出直播间');
        hostProfileActions.querySelector('[data-host-profile-action="block"]').onclick = () => window.Luma.toast('已拉黑该用户');
        hostProfileActions.querySelector('[data-host-profile-action="manager"]').onclick = (event) => {
          const button = event.currentTarget;
          const manager = button.classList.toggle('active');
          button.querySelector('span').textContent = manager ? '取消房管' : '设房管';
          window.Luma.toast(manager ? '已设为房管' : '已取消房管');
        };
      }

      if (['/live-room-host.html', '/live-room-host-password.html', '/live-room-cohost-active.html'].some((path) => location.pathname.endsWith(path))) {
        window.addEventListener('load', () => {
          const focusSheet = cohostRoom.querySelector('.focus-sheet');
          const focusList = focusSheet?.querySelector('.focus-list');
          if (!focusSheet || !focusList) return;
          focusSheet.querySelector('header>b').textContent = '重点在线观众';
          const focusViewers = window.LUMA_MOCK?.liveRoom?.focusViewers || [];
          if (!focusViewers.length || focusList.dataset.hostFocusRendered) return;
          const focusStyle = document.createElement('style');
          focusStyle.textContent = '.focus-list .host-focus-row{box-sizing:border-box;width:100%;min-height:64px;padding:8px 2px;border-bottom:1px solid var(--g6);background:transparent;color:var(--g1);display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer}.focus-list .host-focus-row:last-child{border-bottom:0}.focus-list .host-focus-row>i{width:36px;height:36px;flex:none;border:1px solid var(--g1);border-radius:50%;background:var(--g7);display:grid;place-items:center;font-size:12px;font-style:normal}.focus-list .host-focus-copy{min-width:0;flex:1}.focus-list .host-focus-name{display:flex;align-items:center;gap:5px;min-width:0}.focus-list .host-focus-name>b{min-width:0;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.focus-list .host-focus-badges{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.focus-list .host-focus-badges em{padding:2px 5px;border-radius:5px;background:var(--g6);color:var(--g3);font:10px/1.2 inherit;font-style:normal;white-space:nowrap}.focus-list .host-focus-special{flex:none;padding:2px 5px;border-radius:5px;background:var(--g1)!important;color:var(--g7)!important;font:600 10px/1.2 inherit;white-space:nowrap}.focus-list .host-focus-actions{flex:0 0 86px;display:grid;grid-template-columns:repeat(2,1fr);gap:5px}.focus-list .host-focus-row .host-focus-actions button{box-sizing:border-box;width:40px;min-height:30px;height:30px;padding:0;border:1px solid var(--g5);border-radius:6px;background:var(--g7);color:var(--g2);display:flex;align-items:center;justify-content:center;text-align:center;font:11px inherit;line-height:1;white-space:nowrap;cursor:pointer}.focus-list .host-focus-row .host-focus-actions button:hover{border-color:var(--g1);color:var(--g1)}';
          document.head.append(focusStyle);
          focusList.replaceChildren();
          focusList.dataset.hostFocusRendered = 'true';
          focusViewers.forEach((focusViewer) => {
            const row = document.createElement('article');
            row.className = 'host-focus-row';
            row.dataset.focusProfile = focusViewer.name;
            row.innerHTML = `<i>${focusViewer.avatar}</i><span class="host-focus-copy"><span class="host-focus-name"><b>${focusViewer.name}</b>${focusViewer.specialTag ? `<em class="host-focus-special">${focusViewer.specialTag}</em>` : ''}</span><span class="host-focus-badges"><em>${focusViewer.wealthLevel}</em><em>${focusViewer.medal}</em></span></span><div class="host-focus-actions"><button type="button" data-focus-message>私信</button><button type="button" data-focus-at>@Ta</button></div>`;
            row.onclick = () => { focusSheet.classList.add('state-hide'); window.openRoomUserProfile?.(focusViewer.name); };
            row.querySelector('[data-focus-message]').onclick = (event) => { event.stopPropagation(); window.Luma.toast(`打开与 ${focusViewer.name} 的私信`); };
            row.querySelector('[data-focus-at]').onclick = (event) => {
              event.stopPropagation();
              focusSheet.classList.add('state-hide');
              const input = cohostRoom.querySelector('#comment');
              if (input) { input.value = `@${focusViewer.name} `; input.dispatchEvent(new Event('input')); input.focus(); }
            };
            focusList.append(row);
          });
        });
      }

      window.addEventListener('load', () => {
        window.Luma.registerStates({
          '资料卡权限': {
            '主播': () => window.setRoomRole?.('主播'),
            '管理员': () => window.setRoomRole?.('管理员')
          }
        });
      });
    }
  }

  if (location.pathname.endsWith('/live-room-cohost-active.html')) {
    const activeRoom = document.querySelector('.room');
    const activeStream = activeRoom?.querySelector('.stream');
    const activePkButton = activeRoom?.querySelector('[data-host-pk]');
    if (activeRoom && activeStream) {
      document.title = '直播间-连麦-主播 · 用户主播 App · Luma Live';
      activeRoom.classList.add('cohost-active-room');
      activeStream.innerHTML = '<section class="cohost-video-grid" aria-label="主播连麦画面"><article class="cohost-video-panel cohost-video-self"><span class="cohost-video-label"><i>S</i>Sari</span><em>直播画面</em></article><article class="cohost-video-panel"><span class="cohost-video-label"><i>M</i>Maya</span><em>直播画面</em></article></section>';
      const activeStyle = document.createElement('style');
      activeStyle.textContent = `
        .cohost-active-room .stream{display:block;background:var(--g5)}.cohost-video-grid{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--g7)}.cohost-video-panel{position:relative;min-width:0;background:var(--g4);display:flex;align-items:center;justify-content:center;color:var(--g2)}.cohost-video-panel:nth-child(2){background:var(--g3);color:var(--g7)}.cohost-video-panel em{padding:6px 9px;border-radius:8px;background:var(--g7);color:var(--g3);font:12px inherit;font-style:normal}.cohost-video-panel:nth-child(2) em{background:var(--g5);color:var(--g2)}.cohost-video-label{position:absolute;top:10px;left:9px;display:flex;align-items:center;gap:5px;padding:4px 7px;border-radius:8px;background:var(--g7);color:var(--g1);font-size:11px}.cohost-video-label i{width:18px;height:18px;border-radius:50%;background:var(--g5);display:grid;place-items:center;font-size:8px;font-style:normal}.cohost-video-panel:nth-child(2) .cohost-video-label{background:var(--g5);color:var(--g1)}.cohost-active-room .chat{bottom:78px}.cohost-active-room [data-host-pk]{background:var(--g1);color:var(--g7)}.cohost-exit-confirm{position:absolute;inset:0;z-index:30;background:rgba(0,0,0,.28);display:grid;place-items:center}.cohost-exit-confirm.state-hide{display:none!important}.cohost-exit-confirm-card{width:276px;padding:20px 16px 16px;border-radius:8px;background:var(--g7);text-align:center}.cohost-exit-confirm-card b{display:block;font-size:17px}.cohost-exit-confirm-card p{margin:8px 0 18px;color:var(--g3);font-size:13px}.cohost-exit-confirm-card footer{display:flex;gap:10px}.cohost-exit-confirm-card button{flex:1;height:38px;border:0;border-radius:8px;font:14px inherit;cursor:pointer}.cohost-exit-confirm-card [data-cancel-cohost-exit]{background:var(--g6);color:var(--g2)}.cohost-exit-confirm-card [data-confirm-cohost-exit]{background:var(--g1);color:var(--g7)}
      `;
      activeStyle.textContent += '.cohost-active-room .stream{inset:152px 0 296px}';
      document.head.append(activeStyle);
      if (activePkButton) {
        const cohostExitConfirm = document.createElement('section');
        cohostExitConfirm.className = 'cohost-exit-confirm state-hide';
        cohostExitConfirm.setAttribute('role', 'dialog');
        cohostExitConfirm.setAttribute('aria-modal', 'true');
        cohostExitConfirm.setAttribute('aria-label', '退出连麦确认');
        cohostExitConfirm.innerHTML = '<div class="cohost-exit-confirm-card"><b>是否退出连麦？</b><p>退出后将恢复为单人直播。</p><footer><button type="button" data-cancel-cohost-exit>取消</button><button type="button" data-confirm-cohost-exit>确认退出</button></footer></div>';
        activeRoom.append(cohostExitConfirm);
        activePkButton.textContent = '退出';
        activePkButton.setAttribute('aria-label', '退出连麦');
        activePkButton.onclick = () => cohostExitConfirm.classList.remove('state-hide');
        cohostExitConfirm.querySelector('[data-cancel-cohost-exit]').onclick = () => cohostExitConfirm.classList.add('state-hide');
        cohostExitConfirm.querySelector('[data-confirm-cohost-exit]').onclick = () => {
          cohostExitConfirm.classList.add('state-hide');
          activeRoom.classList.remove('cohost-active-room');
          activeStream.innerHTML = '<div class="stream-mark"><i>直播画面</i></div>';
          document.title = '直播间-主播 · 用户主播 App · Luma Live';
          activePkButton.textContent = 'PK';
          activePkButton.setAttribute('aria-label', '打开 PK');
          activePkButton.onclick = () => window.Luma.toast('打开 PK');
          window.Luma.toast('已退出连麦');
        };
      }
      window.addEventListener('load', () => {
        window.Luma.registerStates({
          '资料卡权限': {
            '主播': () => window.setRoomRole?.('主播'),
            '管理员': () => window.setRoomRole?.('管理员')
          }
        });
      });
    }
  }

  if (['/live-room-host.html', '/live-room-cohost-active.html'].some((path) => location.pathname.endsWith(path))) {
    window.addEventListener('load', () => {
      const room = document.querySelector('.room');
      const sheet = document.querySelector('#audienceSheet, #hostAudienceSheet');
      if (!room || !sheet) return;

      const nav = sheet.querySelector('.audience-tabs');
      const close = nav?.querySelector('.audience-close');
      const viewerPanel = sheet.querySelector('[data-audience-panel="viewers"]');
      if (!nav || !close || !viewerPanel) return;

      sheet.querySelector('[data-audience-tab="contribution"]')?.remove();
      sheet.querySelector('[data-audience-panel="contribution"]')?.remove();
      nav.querySelector('[data-audience-tab="viewers"]')?.remove();
      nav.querySelectorAll('[data-manager-tab]').forEach((node) => node.remove());
      sheet.querySelectorAll('[data-manager-panel]').forEach((node) => node.remove());
      nav.querySelector('.audience-title')?.remove();

      const onlineTab = document.createElement('button');
      onlineTab.type = 'button';
      onlineTab.dataset.managerTab = 'online';
      onlineTab.textContent = '在线观众';
      onlineTab.className = 'active';

      const managersTab = document.createElement('button');
      managersTab.type = 'button';
      managersTab.dataset.managerTab = 'managers';
      managersTab.textContent = '房管';
      nav.insertBefore(onlineTab, close);
      nav.insertBefore(managersTab, close);

      viewerPanel.dataset.managerPanel = 'online';
      viewerPanel.classList.remove('state-hide');
      const managersPanel = document.createElement('section');
      managersPanel.className = 'audience-panel state-hide';
      managersPanel.dataset.managerPanel = 'managers';
      managersPanel.innerHTML = '<div class="manager-list"><article><i>A</i><b>Ari</b></article><article><i>D</i><b>Dewi</b></article><article><i>M</i><b>Maya</b></article></div>';
      viewerPanel.after(managersPanel);

      nav.querySelectorAll('[data-manager-tab]').forEach((tab) => {
        tab.onclick = () => {
          nav.querySelectorAll('[data-manager-tab]').forEach((item) => item.classList.toggle('active', item === tab));
          sheet.querySelectorAll('[data-manager-panel]').forEach((panel) => panel.classList.toggle('state-hide', panel.dataset.managerPanel !== tab.dataset.managerTab));
        };
      });

      managersPanel.querySelectorAll('.manager-list article').forEach((row) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const track = document.createElement('span');
        input.type = 'checkbox';
        input.checked = true;
        input.dataset.managerToggle = '';
        label.append(input, track);
        row.append(label);
      });

      const confirm = document.createElement('section');
      confirm.className = 'manager-cancel-confirm state-hide';
      confirm.innerHTML = '<div><b></b><p></p><footer><button type="button" data-cancel-manager>取消</button><button type="button" data-confirm-manager>确认</button></footer></div>';
      room.append(confirm);

      let pendingToggle = null;
      let confirmRound = 0;
      const openConfirm = () => {
        confirm.querySelector('b').textContent = confirmRound === 1 ? '取消房管？' : '再次确认取消房管？';
        confirm.querySelector('p').textContent = confirmRound === 1 ? '取消后将失去房管权限。' : '确认取消该用户的房管权限？';
        confirm.classList.remove('state-hide');
      };
      managersPanel.querySelectorAll('[data-manager-toggle]').forEach((toggle) => {
        toggle.onchange = () => {
          if (toggle.checked) return;
          toggle.checked = true;
          pendingToggle = toggle;
          confirmRound = 1;
          openConfirm();
        };
      });
      confirm.querySelector('[data-cancel-manager]').onclick = () => {
        confirm.classList.add('state-hide');
        pendingToggle = null;
      };
      confirm.querySelector('[data-confirm-manager]').onclick = () => {
        if (confirmRound === 1) {
          confirmRound = 2;
          openConfirm();
          return;
        }
        if (pendingToggle) pendingToggle.checked = false;
        confirm.classList.add('state-hide');
        window.Luma.toast('已取消房管');
        pendingToggle = null;
      };

      if (!document.querySelector('[data-host-audience-standard]')) {
        const style = document.createElement('style');
        style.dataset.hostAudienceStandard = '';
        style.textContent = '.audience-tabs [data-manager-tab]{height:34px;padding:0;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--g4);font:14px inherit;cursor:pointer}.audience-tabs [data-manager-tab].active{border-color:var(--g1);color:var(--g1);font-weight:600}.manager-list article{min-height:58px;padding:8px 2px;border-bottom:1px solid var(--g6);display:flex;align-items:center;gap:10px}.manager-list article:last-child{border-bottom:0}.manager-list article>i{width:36px;height:36px;border:1px solid var(--g1);border-radius:50%;background:var(--g7);display:grid;place-items:center;font-size:12px;font-style:normal}.manager-list article>b{min-width:0;flex:1;font-size:14px}.manager-list label{position:relative;width:38px;height:22px}.manager-list label input{position:absolute;opacity:0}.manager-list label span{position:absolute;inset:0;border-radius:11px;background:var(--g5);cursor:pointer}.manager-list label span:after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--g7);transition:transform .18s}.manager-list label input:checked+span{background:var(--g1)}.manager-list label input:checked+span:after{transform:translateX(16px)}.manager-cancel-confirm{position:absolute;inset:0;z-index:20;background:rgba(0,0,0,.28);display:grid;place-items:center}.manager-cancel-confirm.state-hide{display:none!important}.manager-cancel-confirm>div{width:276px;padding:20px 16px 16px;border-radius:8px;background:var(--g7);text-align:center}.manager-cancel-confirm b{display:block;font-size:17px}.manager-cancel-confirm p{margin:8px 0 18px;color:var(--g3);font-size:13px}.manager-cancel-confirm footer{display:flex;gap:10px}.manager-cancel-confirm footer button{flex:1;height:38px;border:0;border-radius:8px;font:14px inherit;cursor:pointer}.manager-cancel-confirm [data-cancel-manager]{background:var(--g6);color:var(--g2)}.manager-cancel-confirm [data-confirm-manager]{background:var(--g1);color:var(--g7)}';
        document.head.append(style);
      }
    });
  }

  const coinWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const coinNodes = [];
  while (coinWalker.nextNode()) {
    const node = coinWalker.currentNode;
    if (node.nodeValue.includes('◎') && !['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName) && !node.parentElement?.closest('.medals')) coinNodes.push(node);
  }
  coinNodes.forEach((node) => {
    const parts = node.nodeValue.split('◎');
    const fragment = document.createDocumentFragment();
    parts.forEach((part, index) => {
      if (part) fragment.append(document.createTextNode(part));
      if (index < parts.length - 1) {
        const icon = document.createElement('i');
        icon.className = 'coin';
        icon.setAttribute('aria-label', '钻石');
        fragment.append(icon);
      }
    });
    node.replaceWith(fragment);
  });

  document.querySelectorAll('.diamond,.diamond-icon').forEach((icon) => {
    icon.textContent = '◆';
    icon.setAttribute('aria-label', '钻石');
  });

  const normalGiftFeed = document.querySelector('.gift-feed');
  if (normalGiftFeed && document.title.includes('普通房')) {
    const cycleNormalGiftFeed = () => {
      normalGiftFeed.classList.remove('leaving');
      setTimeout(() => {
        normalGiftFeed.classList.add('leaving');
        setTimeout(cycleNormalGiftFeed, 4000);
      }, 5000);
    };
    cycleNormalGiftFeed();
  }

  document.querySelectorAll('.lamp').forEach((lamp) => {
    const level = lamp.textContent.match(/\d+/)?.[0];
    if (level) lamp.textContent = `灯牌 ${level}`;
  });

  const outfitsEntry = [...document.querySelectorAll('button')].find((button) => button.textContent.includes('我的装扮'));
  if (outfitsEntry) outfitsEntry.onclick = () => { location.href = 'my-decoration.html'; };

  if (location.pathname.endsWith('/profile.html')) {
    const editProfileEntry = document.querySelector('.cover-actions .edit-profile');
    if (editProfileEntry) {
      editProfileEntry.textContent = '编辑资料';
      editProfileEntry.onclick = () => { location.href = 'profile-edit.html'; };
    }
  }

  if (location.pathname.endsWith('/live-plaza.html')) {
    const searchEntry = document.querySelector('.rank-search');
    if (searchEntry) searchEntry.onclick = () => { location.href = 'search.html'; };
  }
});

window.addEventListener('load', () => {
  if (!location.pathname.endsWith('/live-room.html')) return;
  setTimeout(() => {

  const room = document.querySelector('.room');
  const profileSheet = document.querySelector('#userProfileSheet');
  const profileActions = profileSheet?.querySelector('.user-profile-actions');
  const commentForm = document.querySelector('#commentForm');
  if (!room || !profileSheet || !profileActions || !commentForm) return;

  const removedUsers = new Set();
  const mutedUsers = new Set();
  let role = '普通观众';
  let pendingAction = null;
  let confirmationRound = 0;

  const muteButton = document.createElement('button');
  muteButton.type = 'button';
  muteButton.className = 'viewer-profile-manager-action state-hide';
  muteButton.setAttribute('aria-label', '禁言');
  muteButton.innerHTML = '<b>−</b><span>禁言</span>';
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'viewer-profile-manager-action viewer-profile-remove state-hide';
  removeButton.setAttribute('aria-label', '踢出直播间');
  removeButton.innerHTML = '<b>×</b><span>踢出</span>';
  profileActions.classList.add('host-profile-actions-scroll');
  profileActions.append(removeButton, muteButton);

  const confirmation = document.createElement('section');
  confirmation.className = 'viewer-manager-confirm state-hide';
  confirmation.setAttribute('role', 'dialog');
  confirmation.setAttribute('aria-modal', 'true');
  confirmation.innerHTML = '<div><b></b><p></p><footer><button type="button" data-cancel-viewer-manager>取消</button><button type="button" data-confirm-viewer-manager>确认</button></footer></div>';
  room.append(confirmation);

  const style = document.createElement('style');
  style.dataset.viewerManagerProfile = '';
  style.textContent = '.viewer-manager-confirm{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:rgba(0,0,0,.28)}.viewer-manager-confirm.state-hide{display:none!important}.viewer-manager-confirm>div{width:276px;padding:20px 16px 16px;border-radius:8px;background:var(--g7);text-align:center}.viewer-manager-confirm b{display:block;font-size:17px}.viewer-manager-confirm p{margin:8px 0 18px;color:var(--g3);font-size:13px}.viewer-manager-confirm footer{display:flex;gap:10px}.viewer-manager-confirm footer button{flex:1;height:38px;border:0;border-radius:8px;font:14px inherit;cursor:pointer}.viewer-manager-confirm [data-cancel-viewer-manager]{background:var(--g6);color:var(--g2)}.viewer-manager-confirm [data-confirm-viewer-manager]{background:var(--g1);color:var(--g7)}.viewer-muted-state{margin:4px 0 0;color:var(--danger);font-size:12px}.room-user-muted{opacity:.58}.room-user-muted .chat-meta b:after,.audience-row.room-user-muted span>b:after{content:" 禁言";margin-left:4px;color:var(--danger);font-size:10px;font-weight:500}.room-comment-muted input{background:var(--g5)!important;color:var(--g4)!important;cursor:not-allowed}.room-comment-muted input::placeholder{color:var(--g4)}.profile-more [data-viewer-manager-actions].state-hide{display:none!important}';
  document.head.append(style);
  const managerStyle = document.createElement('style');
  managerStyle.textContent = '.host-profile-actions-scroll{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;width:100%!important;box-sizing:border-box!important;padding:14px 16px 2px!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain;scrollbar-width:none}.host-profile-actions-scroll::-webkit-scrollbar{display:none}.host-profile-actions-scroll button{box-sizing:border-box!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:34px!important;padding:0 10px!important;white-space:nowrap!important}.host-profile-actions-scroll .viewer-profile-manager-action.state-hide{display:none!important}.host-profile-actions-scroll .viewer-profile-manager-action b{font-size:13px!important}';
  document.head.append(managerStyle);

  const audienceSheet = document.querySelector('#audienceSheet');
  const watchChip = document.querySelector('.watch-chip');
  const profileName = () => profileSheet.querySelector('[data-user-name]')?.textContent.trim() || '';

  function syncProfileActions() {
    const hideManagerActions = role !== '房管';
    muteButton.classList.toggle('state-hide', hideManagerActions);
    removeButton.classList.toggle('state-hide', hideManagerActions);
    profileSheet.querySelector('.viewer-muted-state')?.remove();
    if (mutedUsers.has(profileName())) {
      const status = document.createElement('p');
      status.className = 'viewer-muted-state';
      status.textContent = '已禁言，无法发言';
      profileSheet.querySelector('.user-profile-outfits')?.after(status);
    }
  }

  function syncUserState(name) {
    document.querySelectorAll('#chat .chat-item, #audienceSheet .audience-row, .watch-chip .people i').forEach((item) => {
      const itemName = item.matches('.people i') ? item.textContent.trim() : item.querySelector('b')?.textContent.trim();
      if (itemName !== name) return;
      if (removedUsers.has(name)) item.remove();
      else item.classList.toggle('room-user-muted', mutedUsers.has(name));
    });
  }

  function closeConfirmation() {
    confirmation.classList.add('state-hide');
    pendingAction = null;
    confirmationRound = 0;
  }

  function openConfirmation() {
    const verb = pendingAction.type === 'mute' ? '禁言' : '踢出直播间';
    const repeat = confirmationRound === 2;
    confirmation.querySelector('b').textContent = repeat ? `再次确认${verb}？` : `${verb}？`;
    confirmation.querySelector('p').textContent = repeat
      ? `确认后立即${verb} ${pendingAction.name}。`
      : pendingAction.type === 'mute' ? `${pendingAction.name} 将无法在当前直播间继续发言。` : `${pendingAction.name} 将从当前在线观众中移除。`;
    confirmation.classList.remove('state-hide');
  }

  function openUserProfile(name) {
    if (!name || removedUsers.has(name)) return;
    window.openRoomUserProfile?.(name);
    requestAnimationFrame(syncProfileActions);
  }

  const originalOpenUserProfile = window.openRoomUserProfile;
  window.openRoomUserProfile = (name) => {
    if (!name || removedUsers.has(name)) return;
    originalOpenUserProfile?.(name);
    requestAnimationFrame(syncProfileActions);
  };

  window.setRoomRole = (nextRole) => {
    role = nextRole === '房管' ? '房管' : '普通观众';
    window.__roomRole = role;
    audienceSheet?.classList.toggle('state-hide', role !== '房管');
    syncProfileActions();
  };

  const commentInput = commentForm.querySelector('#comment');
  const commentSend = commentForm.querySelector('#send');
  window.setRoomCommentState = (muted) => {
    commentForm.classList.toggle('room-comment-muted', muted);
    commentInput.disabled = muted;
    commentInput.placeholder = muted ? '已被禁言' : '说点什么...';
    commentSend.disabled = muted || !commentInput.value.trim();
  };

  window.Luma.registerStates({
    '粉丝团状态': {
      '未加入': () => window.Luma.setFanClubState?.(false),
      '已加入': () => window.Luma.setFanClubState?.(true)
    },
    '当前身份': {
      '普通观众': () => window.setRoomRole('普通观众'),
      '房管': () => window.setRoomRole('房管')
    },
    '发言状态': {
      '正常': () => window.setRoomCommentState(false),
      '被禁言': () => window.setRoomCommentState(true)
    }
  });
  window.setRoomRole('普通观众');
  window.setRoomCommentState(false);

  if (watchChip && audienceSheet) {
    const audienceTrigger = watchChip.cloneNode(true);
    watchChip.replaceWith(audienceTrigger);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.watch-chip')) return;
      event.preventDefault();
      event.stopPropagation();
      audienceSheet.classList.remove('state-hide');
    }, true);
  }

  muteButton.onclick = () => {
    pendingAction = { type: 'mute', name: profileName() };
    confirmationRound = 1;
    openConfirmation();
  };
  removeButton.onclick = () => {
    pendingAction = { type: 'remove', name: profileName() };
    confirmationRound = 1;
    openConfirmation();
  };
  confirmation.querySelector('[data-cancel-viewer-manager]').onclick = closeConfirmation;
  confirmation.querySelector('[data-confirm-viewer-manager]').onclick = () => {
    if (confirmationRound === 1) {
      confirmationRound = 2;
      openConfirmation();
      return;
    }
    const { type, name } = pendingAction;
    if (type === 'mute') mutedUsers.add(name);
    else removedUsers.add(name);
    syncUserState(name);
    profileSheet.classList.add('state-hide');
    closeConfirmation();
    window.Luma.toast(type === 'mute' ? `已禁言 ${name}` : `已将 ${name} 踢出直播间`);
  };

  room.addEventListener('click', (event) => {
    if (role !== '房管') return;
    const trigger = event.target.closest('#chat .chat-meta b, #chat .avatar, #audienceSheet .audience-row b, #audienceSheet .audience-row .avatar');
    if (!trigger) return;
    const row = trigger.closest('.chat-item,.audience-row');
    const name = row?.querySelector('.chat-meta b, span>b')?.textContent.trim() || trigger.textContent.trim();
    if (!name || removedUsers.has(name)) return;
    event.stopImmediatePropagation();
    openUserProfile(name);
  }, true);
  }, 0);
});

window.addEventListener('load', () => {
  if (!['/live-room.html', '/live-room-host.html'].some((path) => location.pathname.endsWith(path))) return;
  document.querySelector('#reportConfirm')?.remove();
  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-user-report],[data-viewer-profile-report],[data-host-report],[data-host-profile-action]');
    if (!action || !action.textContent.includes('举报')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const name = document.querySelector('[data-user-name]')?.textContent.trim() || 'Andi';
    location.href = `live-room-user-report.html?name=${encodeURIComponent(name)}`;
  }, true);
});
