(function () {
  const config = window.LUMA_MOCK && window.LUMA_MOCK.startLive;
  if (config) config.categories = config.roomTypeTags;

  document.addEventListener('DOMContentLoaded', () => {
    const entry = document.querySelector('#categoryEntry');
    const title = document.querySelector('#categorySheet h2');
    if (entry && entry.firstChild) entry.firstChild.nodeValue = '类型：';
    if (title) title.textContent = '选择直播间类型';
  });
})();
