(function () {
  function initMutedUsers() {
    if (!location.pathname.endsWith('/live-room-host.html')) return;
    var room = document.querySelector('.room');
    var mutedButton = document.querySelector('.host-settings-sheet [data-host-setting="muted"]');
    if (!room || !mutedButton) return;

    var users = (window.LUMA_MOCK?.liveRoom?.mutedUsers || []).map(function (user) {
      return Object.assign({}, user);
    });
    var sheet = room.querySelector('.muted-users-sheet') || document.createElement('section');
    var confirm = document.createElement('section');
    var style = document.createElement('style');
    var pendingName = null;
    var confirmationStep = 0;

    style.textContent = '.muted-users-sheet,.muted-users-confirm{position:absolute;inset:0;z-index:40}.muted-users-sheet.state-hide,.muted-users-confirm.state-hide{display:none!important}.muted-users-sheet{display:flex;align-items:flex-end;background:color-mix(in srgb,var(--g1) 36%,transparent)}.muted-users-sheet>div{width:100%;min-height:300px;padding:0 16px 22px;box-sizing:border-box;border-radius:12px 12px 0 0;background:var(--g7)}.muted-users-sheet header{height:52px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--g6)}.muted-users-sheet header b{font-size:16px}.muted-users-sheet header button{width:36px;height:36px;padding:0;border:0;background:transparent;color:var(--g2);font:26px/1 inherit;cursor:pointer}.muted-users-sheet article{min-height:64px;border-bottom:1px solid var(--g6);display:flex;align-items:center;gap:10px}.muted-users-sheet article>i{width:38px;height:38px;flex:none;border:1px solid var(--g5);border-radius:50%;background:var(--g6);display:grid;place-items:center;color:var(--g1);font-size:13px;font-style:normal}.muted-users-sheet article>b{min-width:0;flex:1;font-size:14px}.muted-users-sheet article button{height:30px;padding:0 10px;border:1px solid var(--g5);border-radius:8px;background:var(--g7);color:var(--g1);font:12px inherit;cursor:pointer}.muted-users-empty{padding:30px 0;color:var(--g3);font-size:13px;text-align:center}.muted-users-confirm{display:grid;place-items:center;background:color-mix(in srgb,var(--g1) 36%,transparent)}.muted-users-confirm>div{width:276px;padding:20px 16px 16px;box-sizing:border-box;border-radius:8px;background:var(--g7);text-align:center}.muted-users-confirm b{display:block;font-size:17px}.muted-users-confirm p{margin:8px 0 18px;color:var(--g3);font-size:13px}.muted-users-confirm footer{display:flex;gap:10px}.muted-users-confirm footer button{height:38px;flex:1;border:0;border-radius:8px;font:14px inherit;cursor:pointer}.muted-users-confirm [data-cancel-restore]{background:var(--g6);color:var(--g2)}.muted-users-confirm [data-confirm-restore]{background:var(--g1);color:var(--g7)}';
    document.head.append(style);

    sheet.className = 'muted-users-sheet state-hide';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', '禁言用户');
    sheet.innerHTML = '<div><header><b>禁言用户</b><button type="button" data-close-muted-users aria-label="关闭禁言用户">×</button></header><section data-muted-users-list></section></div>';

    confirm.className = 'muted-users-confirm state-hide';
    confirm.setAttribute('role', 'dialog');
    confirm.setAttribute('aria-modal', 'true');
    confirm.setAttribute('aria-label', '恢复发言确认');
    confirm.innerHTML = '<div><b></b><footer><button type="button" data-cancel-restore>取消</button><button type="button" data-confirm-restore>恢复</button></footer></div>';
    room.append(sheet, confirm);

    var list = sheet.querySelector('[data-muted-users-list]');
    function renderList() {
      if (!users.length) {
        list.innerHTML = '<p class="muted-users-empty">暂无被禁言用户</p>';
        return;
      }
      list.innerHTML = users.map(function (user) {
        return '<article><i>' + user.avatar + '</i><b>' + user.name + '</b><button type="button" data-restore-user="' + user.name + '">恢复发言</button></article>';
      }).join('');
      list.querySelectorAll('[data-restore-user]').forEach(function (button) {
        button.onclick = function () {
          pendingName = button.dataset.restoreUser;
          confirmationStep = 1;
          openConfirmation();
        };
      });
    }

    function openConfirmation() {
      confirm.querySelector('b').textContent = '是否恢复用户在直播间评论发言';
      confirm.classList.remove('state-hide');
    }

    mutedButton.onclick = function () {
      mutedButton.closest('.host-settings-sheet').classList.add('state-hide');
      renderList();
      sheet.classList.remove('state-hide');
    };
    sheet.querySelector('[data-close-muted-users]').onclick = function () {
      sheet.classList.add('state-hide');
    };
    confirm.querySelector('[data-cancel-restore]').onclick = function () {
      confirm.classList.add('state-hide');
      pendingName = null;
      confirmationStep = 0;
    };
    confirm.querySelector('[data-confirm-restore]').onclick = function () {
      if (confirmationStep === 1) {
        confirmationStep = 2;
        openConfirmation();
        return;
      }
      users = users.filter(function (user) { return user.name !== pendingName; });
      confirm.classList.add('state-hide');
      renderList();
      Luma.toast('已恢复 ' + pendingName + ' 的发言');
      pendingName = null;
      confirmationStep = 0;
    };
  }

  window.addEventListener('load', initMutedUsers);
})();
