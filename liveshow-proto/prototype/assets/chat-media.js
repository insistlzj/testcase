(() => {
  const composer = document.querySelector('.composer');
  const chat = document.querySelector('#chat');
  if (!composer || !chat || !window.LUMA_MOCK?.chatComposer) return;

  const media = window.LUMA_MOCK.chatComposer;
  const isGroup = Boolean(document.querySelector('.group-title'));
  let recordingTimer;
  let recordingSeconds = 0;

  const style = document.createElement('style');
  style.textContent = `
    .composer{gap:5px}.composer textarea{min-width:0}.composer .chat-media-entry{font-size:15px;font-weight:700}
    .chat-media-modal{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:24px;background:var(--overlay)}
    .chat-media-modal.state-hide{display:none}.chat-media-dialog{width:300px;padding:20px;border-radius:12px;background:var(--g7)}
    .chat-media-dialog h2{margin:0;font-size:17px}.chat-media-dialog p{margin:10px 0 16px;color:var(--g3);font-size:13px}
    .chat-media-time{margin:18px 0;text-align:center;color:var(--g1);font-size:24px}.chat-media-actions{display:flex;gap:10px;margin-top:16px}
    .chat-media-actions button{flex:1;height:38px;border:0;border-radius:8px;background:var(--g6);color:var(--g2);font:14px inherit;cursor:pointer}
    .chat-media-actions .primary{background:var(--g1);color:var(--g7)}.chat-media-actions .primary:disabled{background:var(--g5);cursor:default}
    .voice-bubble{display:flex;align-items:center;gap:7px;min-width:98px}.voice-bubble i{font-size:12px;font-style:normal}
    .image-bubble{width:168px;overflow:hidden;padding:0}.image-bubble .image-preview{height:116px;background:var(--g5);display:grid;place-items:center;color:var(--g3);font-size:12px}.image-bubble b{display:block;padding:7px 9px;font-size:12px;font-weight:500}
  `;
  document.head.append(style);

  const voiceButton = document.createElement('button');
  voiceButton.className = 'chat-media-entry';
  voiceButton.type = 'button';
  voiceButton.title = '发送语音';
  voiceButton.setAttribute('aria-label', '发送语音');
  voiceButton.textContent = '语';
  const imageButton = document.createElement('button');
  imageButton.className = 'chat-media-entry';
  imageButton.type = 'button';
  imageButton.title = '发送图片';
  imageButton.setAttribute('aria-label', '发送图片');
  imageButton.textContent = '图';
  composer.insertBefore(voiceButton, composer.querySelector('textarea'));
  composer.insertBefore(imageButton, composer.querySelector('textarea'));

  const createModal = (markup) => {
    const modal = document.createElement('section');
    modal.className = 'chat-media-modal state-hide';
    modal.innerHTML = markup;
    document.body.append(modal);
    return modal;
  };
  const voiceModal = createModal('<div class="chat-media-dialog"><h2>录音中</h2><div class="chat-media-time">00:00</div><div class="chat-media-actions"><button type="button" data-cancel>取消</button><button class="primary" type="button" data-send>发送</button></div></div>');

  const formatTime = (seconds) => `00:${String(Math.min(seconds, 59)).padStart(2, '0')}`;
  const append = (content, type) => {
    const item = document.createElement('div');
    item.className = 'msg me';
    const bubble = document.createElement('p');
    bubble.className = `bubble ${type || ''}`;
    if (typeof content === 'string') bubble.textContent = content;
    else bubble.append(content);
    if (isGroup) {
      const message = document.createElement('div');
      message.className = 'message';
      const sender = document.createElement('b');
      sender.textContent = 'Andi';
      message.append(sender, bubble);
      item.append(message);
    } else item.append(bubble);
    const avatar = document.createElement('i');
    avatar.className = 'avatar';
    avatar.textContent = '安';
    item.append(avatar);
    chat.append(item);
    item.scrollIntoView({ block: 'end' });
  };
  const closeVoice = () => {
    clearInterval(recordingTimer);
    voiceModal.classList.add('state-hide');
  };

  voiceButton.onclick = () => {
    recordingSeconds = 0;
    voiceModal.querySelector('.chat-media-time').textContent = formatTime(recordingSeconds);
    voiceModal.classList.remove('state-hide');
    clearInterval(recordingTimer);
    recordingTimer = setInterval(() => {
      recordingSeconds += 1;
      voiceModal.querySelector('.chat-media-time').textContent = formatTime(recordingSeconds);
    }, 1000);
  };
  voiceModal.querySelector('[data-cancel]').onclick = closeVoice;
  voiceModal.querySelector('[data-send]').onclick = () => {
    const voice = document.createElement('span');
    voice.textContent = `▸ ${media.voice.label}`;
    const duration = document.createElement('i');
    duration.textContent = recordingSeconds ? formatTime(recordingSeconds) : media.voice.duration;
    voice.append(duration);
    append(voice, 'voice-bubble');
    closeVoice();
    window.Luma.toast('语音已发送');
  };
  imageButton.onclick = () => {
    const image = document.createElement('span');
    const preview = document.createElement('span');
    preview.className = 'image-preview';
    preview.textContent = media.image.hint;
    const title = document.createElement('b');
    title.textContent = media.image.title;
    image.append(preview, title);
    append(image, 'image-bubble');
    window.Luma.toast('图片已发送');
  };
})();
