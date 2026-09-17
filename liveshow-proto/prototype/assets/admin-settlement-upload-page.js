(function () {
  const type = document.body.dataset.settlementType;
  const view = document.body.dataset.settlementView;
  const configs = {
    host: {
      label: '主播分成记录',
      shortLabel: '主播分成',
      countLabel: '主播人数',
      dataKey: 'hostSettlementUploads',
      listFile: 'admin-settlement-record.html',
      detailFile: 'admin-settlement-record-detail.html'
    },
    guild: {
      label: '公会分成记录',
      shortLabel: '公会分成',
      countLabel: '公会数量',
      dataKey: 'guildSettlementUploads',
      listFile: 'admin-guild-settlement-record.html',
      detailFile: 'admin-guild-settlement-record-detail.html'
    }
  };
  const config = configs[type];
  if (!config) return;

  const records = window.LUMA_ADMIN_MOCK[config.dataKey];
  const format = window.LUMA_ADMIN_FORMAT;
  const root = document.getElementById('settlementRoot');
  const pageTitle = document.getElementById('settlementPageTitle');
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const monthText = (value) => {
    const [year, month] = String(value).split('-');
    return month && year ? `${month}/${year}` : value;
  };
  const recordHref = (record) => {
    const params = new URLSearchParams({ id: record.id });
    if (record.temporary) {
      params.set('month', record.month);
      params.set('settler', record.settler);
      params.set('settlementDate', record.settlementDate);
      params.set('remark', record.remark || '');
      params.set('uploader', record.uploader);
      params.set('uploadedAt', record.uploadedAt);
      params.set('fileName', record.fileName);
    }
    return `${config.detailFile}?${params}`;
  };

  document.title = `${config.label}${view === 'detail' ? '详情' : ''} · 财务分成 · Luma Live 管理后台`;
  pageTitle.textContent = config.label;

  function listPage() {
    const personFilters = '';
    const tableToolbar = `<div class="admin-table-toolbar"><button class="admin-btn" id="openUploadBtn" type="button">上传${config.shortLabel}数据</button></div>`;
    const tableHeader = `<th>分成备注</th><th>${config.countLabel}</th><th>分成总金额</th><th>上传人</th><th>上传时间</th><th>操作</th>`;
    const tableColumnCount = 6;
    const filterDateLabel = '上传时间';
    const uploadFields = `<div class="admin-form-row"><label for="uploadRemark">备注</label><input class="admin-input" id="uploadRemark" maxlength="100" placeholder="填写分成备注" required></div>`;
    const uploadFileTitle = '上传文件';
    const uploadLockNote = '<span class="settlement-upload-note">上传成功后记录锁定，不支持修改或删除。</span>';
    root.innerHTML = `
      <div class="admin-page-head"><h1>${config.label}</h1></div>
      <section class="admin-panel admin-filter" aria-label="${config.label}筛选">
        <div class="admin-filter-grid">
          ${personFilters}
          <div class="admin-field"><label>${filterDateLabel}</label><div class="admin-range admin-date-range"><input class="admin-input" id="filterStart" type="date"><span>至</span><input class="admin-input" id="filterEnd" type="date"></div></div>
        </div>
        <div class="admin-filter-actions"><button class="admin-btn secondary" id="resetBtn" type="button">重置</button><button class="admin-btn" id="searchBtn" type="button">查询</button></div>
      </section>
      <section class="admin-panel admin-table-panel">
        ${tableToolbar}
        <div class="admin-table-wrap"><table class="admin-table has-actions settlement-upload-table"><thead><tr>${tableHeader}</tr></thead><tbody id="settlementRows"></tbody></table></div>
        <div class="admin-pagination" id="pagination"><span>20 条 / 页</span><button class="admin-page-btn" disabled>‹</button><button class="admin-page-btn active" disabled>1</button><button class="admin-page-btn" disabled>›</button></div>
      </section>
      <div class="admin-overlay" id="uploadOverlay"><section class="admin-modal wide" role="dialog" aria-modal="true" aria-labelledby="uploadTitle">
        <div class="admin-modal-head"><h2 id="uploadTitle">上传文件</h2><button class="admin-icon-btn" type="button" data-close-upload aria-label="关闭">×</button></div>
        <form id="uploadForm"><div class="admin-modal-body">
          <div class="admin-form-grid settlement-upload-fields">${uploadFields}</div>
          <div class="admin-media-upload"><div class="settlement-upload-file-head"><h4>${uploadFileTitle}</h4><button class="admin-action" id="downloadTemplateBtn" type="button">下载模板</button></div><div class="admin-media-upload-preview-wrap"><button class="admin-media-upload-preview is-empty" id="uploadPreview" type="button">点击上传 XLSX、XLS 或 CSV</button></div><input class="admin-file-input" id="uploadFile" type="file" accept=".xlsx,.xls,.csv"></div>
          ${type === 'host' ? '<section class="settlement-validation-error state-hide" id="uploadErrorResult" aria-live="polite"><div class="settlement-validation-head"><strong id="uploadErrorTitle"></strong><button class="admin-action" id="copyErrorsBtn" type="button">复制</button></div><pre class="settlement-validation-text" id="uploadErrorText"></pre></section>' : ''}
        </div><div class="admin-modal-foot">${uploadLockNote}<button class="admin-btn secondary" type="button" data-close-upload>取消</button><button class="admin-btn" id="uploadSubmitBtn" type="submit">确认上传</button></div></form>
      </section></div>`;

    const rows = document.getElementById('settlementRows');
    const resultCount = document.getElementById('resultCount');
    const pagination = document.getElementById('pagination');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const uploadForm = document.getElementById('uploadForm');
    const uploadFile = document.getElementById('uploadFile');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');
    const uploadErrorResult = document.getElementById('uploadErrorResult');
    let validationErrors = [];
    let nextHostUploadFails = false;

    function render(items) {
      if (resultCount) resultCount.textContent = `共 ${items.length} 条`;
      pagination.classList.toggle('state-hide', !items.length);
      rows.innerHTML = items.length ? items.map((item) => `
        <tr class="settlement-upload-row" data-detail="${escapeHtml(recordHref(item))}" tabindex="0" role="link" aria-label="查看 ${escapeHtml(item.remark)} ${config.label}明细">
          <td>${escapeHtml(item.remark)}</td><td>${format.integer(item.entityCount)}</td><td><b>${format.money(item.totalAmount)}</b></td><td>${escapeHtml(item.uploader)}</td><td>${escapeHtml(item.uploadedAt)}</td><td><a class="admin-action" href="${escapeHtml(recordHref(item))}">查看明细</a></td>
        </tr>`).join('') : `<tr><td colspan="${tableColumnCount}"><div class="admin-empty"><strong>未找到${config.label}</strong><span>请调整筛选条件后重新查询</span></div></td></tr>`;
    }

    function filterRecords() {
      const start = document.getElementById('filterStart').value;
      const end = document.getElementById('filterEnd').value;
      if (start && end && start > end) return Luma.toast(`${filterDateLabel}结束日期不能早于开始日期`);
      const items = records.filter((item) => {
        const date = item.uploadedAt.slice(0, 10);
        return (!start || date >= start) && (!end || date <= end);
      });
      render(items);
      Luma.toast(`已查询到 ${items.length} 条记录`);
    }

    function closeUpload() {
      uploadOverlay.classList.remove('show');
    }

    function createRecord(importData) {
      return {
        id: `${type === 'host' ? 'HSR' : 'GSR'}20260820${String(records.length + 1).padStart(3, '0')}`,
        month: '2026-08',
        entityCount: importData.details.length,
        totalAmount: importData.details.reduce((sum, item) => sum + item.amount, 0),
        settler: '后台管理员',
        settlementDate: '2026-08-20',
        remark: importData.remark,
        uploader: '后台管理员',
        uploadedAt: '2026-08-20 21:05:00',
        fileName: importData.fileName,
        details: importData.details,
        temporary: true
      };
    }

    function openUpload() {
      uploadForm.reset();
      uploadPreview.textContent = '点击上传 XLSX、XLS 或 CSV';
      uploadPreview.classList.add('is-empty');
      resetValidationError();
      uploadOverlay.classList.add('show');
    }

    function resetValidationError() {
      validationErrors = [];
      uploadErrorResult?.classList.add('state-hide');
      uploadSubmitBtn.textContent = '确认上传';
    }

    function showValidationErrors(errors, fileName) {
      validationErrors = errors;
      uploadPreview.textContent = fileName;
      uploadPreview.classList.remove('is-empty');
      document.getElementById('uploadErrorTitle').textContent = `上传失败，存在${errors.length}个主播ID无法查询`;
      document.getElementById('uploadErrorText').textContent = errors.map((error) => `第${error.row}行，未查询到主播ID${error.hostId}`).join('\n');
      uploadErrorResult.classList.remove('state-hide');
      uploadSubmitBtn.textContent = '重新上传';
    }

    function validateHostIds(details) {
      const accountIds = new Set(window.LUMA_ADMIN_MOCK.hostAccountBalances.map((account) => account.hostId));
      return details.flatMap((detail, index) => accountIds.has(detail.id) ? [] : [{ row: detail.row || index + 2, hostId: detail.id }]);
    }

    function failedHostDetails() {
      const rows = [8, 12, 20], ids = ['77219999', '77218888', '77217777'];
      return Array.from({ length: 52 }, (_, index) => ({ row: rows[index] || index + 18, id: ids[index] || String(77217000 + index) }));
    }

    function uploadedDetails() {
      return type === 'host' ? [
        { name: 'Sari', id: '77210411', guildName: 'Aurora Agency', guildId: 'G100021', amount: 168000 },
        { name: 'Maya', id: '77209318', guildName: 'Aurora Agency', guildId: 'G100021', amount: 142000 },
        { name: 'Dewi', id: '77208635', guildName: 'Star House', guildId: 'G100018', amount: 118000 }
      ] : [
        { name: 'Aurora Agency', id: 'G100021', amount: 12800 },
        { name: 'Star House', id: 'G100018', amount: 9600 },
        { name: 'Blue Ocean', id: 'G100014', amount: 7600 }
      ];
    }

    document.getElementById('openUploadBtn').onclick = openUpload;
    document.getElementById('searchBtn').onclick = filterRecords;
    document.getElementById('resetBtn').onclick = () => {
      document.querySelectorAll('.admin-filter input').forEach((input) => { input.value = ''; });
      render(records);
      Luma.toast('筛选条件已重置');
    };
    document.querySelectorAll('[data-close-upload]').forEach((button) => { button.onclick = closeUpload; });
    uploadOverlay.onclick = (event) => { if (event.target === uploadOverlay) closeUpload(); };
    uploadPreview.onclick = () => uploadFile.click();
    document.getElementById('downloadTemplateBtn').onclick = () => {
      const columns = type === 'host'
        ? ['主播名称', '主播ID', '公会名称', '公会ID', '分成金额']
        : ['公会名称', '公会ID', '分成金额(USD)'];
      const blob = new Blob([`\uFEFF${columns.join(',')}\n`], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${type}-settlement-template.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      Luma.toast('分成模板已下载');
    };
    uploadFile.onchange = () => {
      const file = uploadFile.files[0];
      resetValidationError();
      uploadPreview.textContent = file ? file.name : '点击上传 XLSX、XLS 或 CSV';
      uploadPreview.classList.toggle('is-empty', !file);
    };
    document.getElementById('copyErrorsBtn')?.addEventListener('click', () => {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('uploadErrorText'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      Luma.toast('错误数据已复制');
    });
    uploadForm.onsubmit = (event) => {
      event.preventDefault();
      if (validationErrors.length) {
        uploadFile.value = '';
        uploadPreview.textContent = '点击上传 XLSX、XLS 或 CSV';
        uploadPreview.classList.add('is-empty');
        resetValidationError();
        return;
      }
      const file = uploadFile.files[0];
      const remark = document.getElementById('uploadRemark').value.trim();
      if (!remark) return Luma.toast('请输入分成备注');
      const shouldFail = type === 'host' && nextHostUploadFails;
      if (type === 'host') nextHostUploadFails = !nextHostUploadFails;
      const details = shouldFail ? failedHostDetails() : uploadedDetails();
      const importData = { details, remark, fileName: file?.name || `${config.shortLabel}数据.xlsx` };
      const errors = type === 'host' ? validateHostIds(importData.details) : [];
      if (errors.length) return showValidationErrors(errors, file?.name || '未选择文件（演示）');
      const record = createRecord(importData);
      records.unshift(record);
      closeUpload();
      render(records);
      Luma.toast(`${config.shortLabel}数据已导入，记录已锁定`);
    };
    rows.onclick = (event) => {
      if (event.target.closest('a')) return;
      const row = event.target.closest('[data-detail]');
      if (row) location.href = row.dataset.detail;
    };
    rows.onkeydown = (event) => {
      const row = event.target.closest('[data-detail]');
      if (row && (event.key === 'Enter' || event.key === ' ')) location.href = row.dataset.detail;
    };
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeUpload(); });

    render(records);
    Luma.registerStates({
      '全部记录': () => render(records),
      '上传数据': openUpload,
      ...(type === 'host' ? { '上传校验失败': () => { openUpload(); document.getElementById('uploadRemark').value = '2026 年 8 月主播分成'; showValidationErrors(validateHostIds(failedHostDetails()), '2026年8月主播分成.xlsx'); } } : {}),
      '无查询结果': () => render([])
    });
  }

  function detailPage() {
    const params = new URLSearchParams(location.search);
    const details = type === 'host' ? [
      { name: 'Sari', id: '77210411', guildName: 'Aurora Agency', guildId: 'G100021', amount: 168000 },
      { name: 'Maya', id: '77209318', guildName: 'Aurora Agency', guildId: 'G100021', amount: 142000 },
      { name: 'Dewi', id: '77208635', guildName: 'Star House', guildId: 'G100018', amount: 118000 }
    ] : [
      { name: 'Aurora Agency', id: 'G100021', amount: 12800 },
      { name: 'Star House', id: 'G100018', amount: 9600 },
      { name: 'Blue Ocean', id: 'G100014', amount: 7600 }
    ];
    const item = records.find((record) => record.id === params.get('id')) || (params.has('month') ? {
      id: params.get('id'), month: params.get('month'), entityCount: details.length,
      totalAmount: details.reduce((sum, detail) => sum + detail.amount, 0),
      settler: params.get('settler'), settlementDate: params.get('settlementDate'),
      remark: params.get('remark'), uploader: params.get('uploader'), uploadedAt: params.get('uploadedAt'), fileName: params.get('fileName'), details
    } : records[0]);
    pageTitle.textContent = `${config.label}详情`;
    root.innerHTML = `
      <a class="admin-back-link" href="${config.listFile}">‹ 返回${config.label}</a>
      <section class="admin-panel admin-profile-panel admin-settlement-overview">
        <div class="admin-profile-summary"><div class="admin-settlement-record"><h2>${escapeHtml(item.remark)}</h2><div class="admin-profile-meta"><span>${escapeHtml(item.id)}</span></div></div><div class="admin-metrics is-settlement-compact">
          <div class="admin-metric"><span>${config.countLabel}</span><b>${format.integer(item.entityCount)}</b></div>
          <div class="admin-metric"><span>分成总金额</span><b class="admin-settlement-total">${format.money(item.totalAmount)}</b></div>
        </div></div>
        <div class="admin-detail-grid is-settlement-compact">
          <div class="admin-detail-item"><span>上传人</span><b>${escapeHtml(item.uploader)}</b></div><div class="admin-detail-item"><span>上传时间</span><b>${escapeHtml(item.uploadedAt)}</b></div>
        </div>
      </section>
      <section class="admin-panel admin-table-panel settlement-detail-panel">
        <div class="admin-table-toolbar"><strong>${config.shortLabel}明细</strong></div>
        <div class="admin-table-wrap"><table class="admin-table settlement-detail-table"><thead><tr>${type === 'host' ? '<th>主播信息</th><th>公会信息</th>' : '<th>公会信息</th>'}<th>${type === 'host' ? '分成金额' : '分成金额（USD）'}</th></tr></thead><tbody>${item.details.map((detail) => `<tr><td><b>${escapeHtml(detail.name)}</b><span class="admin-cell-sub">${escapeHtml(detail.id)}</span></td>${type === 'host' ? `<td><b>${escapeHtml(detail.guildName)}</b><span class="admin-cell-sub">${escapeHtml(detail.guildId)}</span></td>` : ''}<td><b>${format.money(detail.amount)}</b></td></tr>`).join('')}</tbody></table></div>
      </section>`;
    Luma.registerStates({ '查看详情': () => {} });
  }

  if (view === 'detail') detailPage();
  else listPage();
  window.parent.postMessage({ type: 'luma-page', file: view === 'detail' ? config.detailFile : config.listFile, query: location.search }, '*');
})();
