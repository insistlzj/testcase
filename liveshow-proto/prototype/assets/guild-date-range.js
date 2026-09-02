(function () {
  function dateText(date) {
    return LUMA_FORMAT.date(date);
  }

  function monthText(date) {
    return date.slice(0, 7);
  }

  function shiftMonth(month, offset) {
    const [year, monthNumber] = month.split("-").map(Number);
    const value = new Date(year, monthNumber - 1 + offset, 1);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
  }

  function create(options) {
    const mask = options.mask;
    const titleId = `${mask.id || "guildRange"}Title`;
    mask.className = "guild-mask guild-host-date-mask";
    mask.hidden = true;
    mask.innerHTML = `<section class="guild-sheet guild-host-range-sheet" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
      <header class="guild-host-month-sheet-head">
        <button data-range-cancel type="button">取消</button>
        <h2 id="${titleId}">选择日期范围</h2>
        <button class="confirm" data-range-confirm type="button">确定</button>
      </header>
      <div class="guild-host-performance-calendar">
        <div class="guild-host-performance-calendar-nav">
          <button data-calendar-prev type="button" aria-label="上一个月">‹</button>
          <b data-calendar-title></b>
          <button data-calendar-next type="button" aria-label="下一个月">›</button>
        </div>
        <div class="guild-host-performance-calendar-week" aria-hidden="true"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
        <div class="guild-host-performance-calendar-days" data-calendar-days role="grid"></div>
      </div>
      <p class="guild-host-performance-range-hint" data-range-selection></p>
    </section>`;

    const cancelButton = mask.querySelector("[data-range-cancel]");
    const confirmButton = mask.querySelector("[data-range-confirm]");
    const previousButton = mask.querySelector("[data-calendar-prev]");
    const nextButton = mask.querySelector("[data-calendar-next]");
    const calendarTitle = mask.querySelector("[data-calendar-title]");
    const calendarDays = mask.querySelector("[data-calendar-days]");
    const rangeSelection = mask.querySelector("[data-range-selection]");
    const minDate = options.minDate || "2026-01-01";
    const maxDate = options.maxDate || "2026-08-29";
    let start = options.start;
    let end = options.end;
    let pendingStart = start;
    let pendingEnd = end;
    let calendarMonth = monthText(end || start || maxDate);

    function render() {
      const [year, month] = calendarMonth.split("-").map(Number);
      const firstWeekday = new Date(year, month - 1, 1).getDay();
      const dayCount = new Date(year, month, 0).getDate();
      calendarTitle.textContent = `${month}/${year}`;
      previousButton.disabled = shiftMonth(calendarMonth, -1) < monthText(minDate);
      nextButton.disabled = shiftMonth(calendarMonth, 1) > monthText(maxDate);
      const blanks = Array.from({ length: firstWeekday }, () => '<span aria-hidden="true"></span>').join("");
      const days = Array.from({ length: dayCount }, (_, index) => {
        const date = `${calendarMonth}-${String(index + 1).padStart(2, "0")}`;
        const disabled = date < minDate || date > maxDate;
        const selectedStart = date === pendingStart;
        const selectedEnd = date === pendingEnd;
        const inRange = pendingStart && pendingEnd && date > pendingStart && date < pendingEnd;
        const className = [selectedStart ? "range-start" : "", selectedEnd ? "range-end" : "", inRange ? "in-range" : ""].filter(Boolean).join(" ");
        return `<button class="${className}" type="button" role="gridcell" data-date="${date}"${disabled ? " disabled" : ""} aria-selected="${Boolean(selectedStart || selectedEnd || inRange)}">${index + 1}</button>`;
      }).join("");
      calendarDays.innerHTML = blanks + days;
      const selectedEnd = pendingEnd || pendingStart;
      rangeSelection.textContent = pendingStart ? `${dateText(pendingStart)}～${dateText(selectedEnd)}` : "请选择日期";
    }

    function close() {
      mask.hidden = true;
      document.body.classList.remove("guild-sheet-open");
    }

    function cancel() {
      pendingStart = start;
      pendingEnd = end;
      close();
    }

    function open() {
      pendingStart = start;
      pendingEnd = end;
      calendarMonth = monthText(end || start || maxDate);
      render();
      mask.hidden = false;
      document.body.classList.add("guild-sheet-open");
    }

    function setRange(nextStart, nextEnd) {
      start = nextStart;
      end = nextEnd || nextStart;
    }

    previousButton.onclick = () => {
      const month = shiftMonth(calendarMonth, -1);
      if (month < monthText(minDate)) return;
      calendarMonth = month;
      render();
    };
    nextButton.onclick = () => {
      const month = shiftMonth(calendarMonth, 1);
      if (month > monthText(maxDate)) return;
      calendarMonth = month;
      render();
    };
    calendarDays.onclick = (event) => {
      const option = event.target.closest("[data-date]");
      if (!option || option.disabled) return;
      const date = option.dataset.date;
      if (!pendingStart || pendingEnd) {
        pendingStart = date;
        pendingEnd = null;
      } else if (date < pendingStart) {
        pendingEnd = pendingStart;
        pendingStart = date;
      } else {
        pendingEnd = date;
      }
      render();
    };
    cancelButton.onclick = cancel;
    confirmButton.onclick = () => {
      if (!pendingStart) return;
      start = pendingStart;
      end = pendingEnd || pendingStart;
      close();
      options.onConfirm(start, end);
    };
    mask.onclick = (event) => {
      if (event.target === mask) cancel();
    };
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mask.hidden) cancel();
    });

    return { open, close, cancel, setRange };
  }

  window.LumaGuildDateRange = { create };
})();
