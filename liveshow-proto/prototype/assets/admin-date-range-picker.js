(function () {
  const pad = (value) => String(value).padStart(2, "0");
  const monthText = (value) => value.slice(0, 7);
  const shiftMonth = (value, offset) => {
    const [year, month] = value.split("-").map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
  };
  const monthTitle = (value) => {
    const [year, month] = value.split("-").map(Number);
    return `${year}年 ${month}月`;
  };

  function create(options) {
    const root = options.root;
    const trigger = root.querySelector("[data-range-trigger]");
    const startText = root.querySelector("[data-range-start-text]");
    const endText = root.querySelector("[data-range-end-text]");
    const popover = root.querySelector("[data-range-popover]");
    const months = root.querySelector("[data-range-months]");
    const startInput = options.startInput;
    const endInput = options.endInput;
    let minDate = options.minDate || "0000-01-01";
    let viewMonth = monthText(startInput.value || minDate);
    let selectingEnd = false;

    function renderTrigger() {
      startText.textContent = startInput.value ? LUMA_FORMAT.date(startInput.value) : "--";
      endText.textContent = endInput.value ? LUMA_FORMAT.date(endInput.value) : "--";
    }

    function monthMarkup(value) {
      const [year, month] = value.split("-").map(Number);
      const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
      const dayCount = new Date(year, month, 0).getDate();
      const blanks = Array.from({ length: firstWeekday }, () => "<span></span>").join("");
      const days = Array.from({ length: dayCount }, (_, index) => {
        const date = `${value}-${pad(index + 1)}`;
        const classes = [
          date === startInput.value ? "range-start" : "",
          date === endInput.value ? "range-end" : "",
          startInput.value && endInput.value && date > startInput.value && date < endInput.value ? "in-range" : "",
        ].filter(Boolean).join(" ");
        return `<button class="${classes}" type="button" data-range-date="${date}"${date < minDate ? " disabled" : ""}>${index + 1}</button>`;
      }).join("");
      return `<section class="admin-range-calendar"><strong>${monthTitle(value)}</strong><div class="admin-range-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div class="admin-range-days">${blanks}${days}</div></section>`;
    }

    function renderCalendar() {
      months.innerHTML = monthMarkup(viewMonth) + monthMarkup(shiftMonth(viewMonth, 1));
      root.querySelector("[data-range-prev]").disabled = shiftMonth(viewMonth, -1) < monthText(minDate);
    }

    function close() {
      popover.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function open() {
      viewMonth = monthText(startInput.value || minDate);
      selectingEnd = false;
      renderCalendar();
      popover.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    function setRange(start = "", end = "", emit = false) {
      startInput.value = start;
      endInput.value = end;
      renderTrigger();
      if (emit) options.onChange?.(start, end);
    }

    trigger.onclick = () => popover.hidden ? open() : close();
    root.querySelector("[data-range-prev]").onclick = () => {
      viewMonth = shiftMonth(viewMonth, -1);
      renderCalendar();
    };
    root.querySelector("[data-range-next]").onclick = () => {
      viewMonth = shiftMonth(viewMonth, 1);
      renderCalendar();
    };
    months.onclick = (event) => {
      event.stopPropagation();
      const day = event.target.closest("[data-range-date]");
      if (!day || day.disabled) return;
      const date = day.dataset.rangeDate;
      if (!selectingEnd) {
        setRange(date, "", true);
        selectingEnd = true;
        renderCalendar();
        return;
      }
      const start = date < startInput.value ? date : startInput.value;
      const end = date < startInput.value ? startInput.value : date;
      setRange(start, end, true);
      close();
    };
    document.addEventListener("click", (event) => {
      if (!popover.hidden && !root.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    renderTrigger();

    return {
      clear: () => setRange(),
      setMin: (value) => { minDate = value; },
      setRange,
    };
  }

  window.LumaAdminDateRange = { create };
})();
