(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const EXPERIMENT = params.get('experiment');
  if (EXPERIMENT !== 'l08-use-pilot-v1') return;

  const LESSON = params.get('lesson') || 'HSK3-L08';
  const ROOM = params.get('room') || '8808';
  const TOPIC_ROOT = `classpro/use/${EXPERIMENT}/${ROOM}`;
  const TOPICS = { control: `${TOPIC_ROOT}/control`, answers: `${TOPIC_ROOT}/answers`, presence: `${TOPIC_ROOT}/presence`, ack: `${TOPIC_ROOT}/ack` };
  const FALLBACK_FEELINGS = [
    { id: 'clearer', labelCn: '我说得更清楚了', labelEn: 'My expression is clearer' },
    { id: 'more_complete', labelCn: '我说得更完整了', labelEn: 'My expression is more complete' },
    { id: 'more_natural', labelCn: '我说得更自然了', labelEn: 'My expression is more natural' },
    { id: 'still_need_help', labelCn: '我还需要帮助', labelEn: 'I still need help' }
  ];

  let client;
  let control;
  let state = freshState();
  let activeStudent = '';
  let useViewActive = false;
  let feelingOptions = FALLBACK_FEELINGS;

  function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function studentName() { return typeof window.name === 'function' ? window.name() : ''; }
  function freshState() {
    return { schema: 2, participantId: uid('use_student'), controllerId: '', interactionId: '', firstAnswer: '', firstSent: false, choiceAnswers: {}, vocabAnswers: {}, supportIds: [], feelingIds: [], secondAnswer: '', secondSent: false, entryAnswers: {}, outbox: [], control: null };
  }
  function storageKey() { return `ClassProUseStudent_${LESSON}_${EXPERIMENT}_${ROOM}_${activeStudent}`; }
  function save() { if (activeStudent) localStorage.setItem(storageKey(), JSON.stringify(state)); }
  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey()) || 'null');
      state = saved && saved.schema === 2 ? Object.assign(freshState(), saved) : freshState();
      control = state.control || null;
    } catch (_) {
      state = freshState();
      control = null;
    }
  }
  function resetForInteraction(nextControl) {
    const previous = state;
    state = freshState();
    state.participantId = previous.participantId;
    state.entryAnswers = previous.entryAnswers || {};
    state.outbox = previous.outbox || [];
    state.controllerId = nextControl.controllerId;
    state.interactionId = nextControl.interaction ? nextControl.interaction.id : '';
    state.control = nextControl;
    control = nextControl;
    save();
  }

  function injectStyles() {
    if (document.getElementById('l08UseStudentBridgeStyle')) return;
    const style = document.createElement('style');
    style.id = 'l08UseStudentBridgeStyle';
    style.textContent = `
      #app.l08-use-bridge{display:block;max-width:960px;margin:0 auto;padding:8px 0}
      .use-bridge-card{padding:22px;border:1px solid #dbe8df;border-radius:18px;background:#fffdf8;box-shadow:0 8px 24px rgba(26,78,55,.06)}
      .use-bridge-card h1{margin:4px 0 12px;font-size:30px;line-height:1.25;color:#173f34}
      .use-bridge-kicker{font-size:12px;font-weight:900;letter-spacing:.08em;color:#dd7138}
      .use-bridge-prompt{margin:14px 0;padding:16px 18px;border-radius:14px;background:#f2f7f3;font-size:23px;font-weight:900;line-height:1.55;color:#173f34}
      .use-bridge-context{margin:12px 0;padding:13px 16px;border:1px solid #f0d8bd;border-radius:13px;background:#fff7ed;line-height:1.6}
      .use-bridge-muted{color:#64756d;line-height:1.55}.use-bridge-muted small{display:block;margin-top:3px}
      .use-bridge-card textarea,.use-bridge-card input[type=text]{box-sizing:border-box;width:100%;margin:14px 0;padding:14px;border:2px solid #dfeac8;border-radius:14px;background:#fff;font:20px/1.5 KaiTi,STKaiti,"Kaiti SC","Microsoft YaHei",serif}
      .use-bridge-submit{width:100%;margin-top:12px;padding:13px 18px;border:0;border-radius:13px;background:#176b50;color:#fff;font-size:17px;font-weight:900;cursor:pointer}
      .use-bridge-list{display:grid;gap:8px;margin:14px 0}.use-bridge-list label{display:grid;grid-template-columns:20px 28px minmax(0,1fr);gap:9px;align-items:center;padding:12px 14px;border:1px solid #dbe8df;border-radius:12px;background:#fff;cursor:pointer}
      .use-bridge-list input,.use-bridge-supports input{box-sizing:border-box;width:18px!important;height:18px!important;margin:0!important;padding:0!important;accent-color:#176b50}.use-bridge-list b,.use-bridge-results b{color:#2f6fd6}.use-bridge-list span{min-width:0;line-height:1.5;word-break:normal}.use-bridge-list small{display:block;margin-top:3px;color:#718078}.use-bridge-list label:has(input:checked){border-color:#6eae8d;background:#eef8f2;box-shadow:inset 0 0 0 1px #6eae8d}
      .use-bridge-choices{display:grid;gap:14px;margin:16px 0}.use-bridge-question{padding:15px;border:1px solid #dbe8df;border-radius:15px;background:#fff}.use-bridge-question h2{margin:0 0 10px;font-size:20px;line-height:1.45}.use-bridge-question h2 span{display:inline-grid;place-items:center;width:27px;height:27px;margin-right:8px;border-radius:50%;background:#eaf4ec;color:#3f7f32;font-size:16px}
      .use-bridge-results{display:grid;gap:8px}.use-bridge-results>div{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;align-items:center;padding:12px 14px;border:1px solid #dbe8df;border-radius:12px;background:#fff}.use-bridge-results .correct{border-color:#8bcaa4;background:#edf8f0}.use-bridge-results em{color:#61736a;font-size:12px;font-style:normal}
      .use-bridge-supports{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.use-bridge-supports label{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;align-items:center;min-height:68px;padding:12px 14px;border:1px solid #dbe8df;border-radius:12px;background:#fff;cursor:pointer}.use-bridge-supports label>span{min-width:0}.use-bridge-supports b{display:block;line-height:1.4}.use-bridge-supports small{display:block;margin-top:3px;color:#718078;line-height:1.4}.use-bridge-supports label:has(input:checked){border-color:#6eae8d;background:#eef8f2;box-shadow:inset 0 0 0 1px #6eae8d}
      .use-bridge-note,.use-bridge-wall,.use-bridge-compare{margin:14px 0;padding:16px;border-radius:14px;background:#f3f8f4;line-height:1.6}.use-bridge-wall{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;background:transparent;padding:0}.use-bridge-wall article{padding:13px;border:1px solid #dbe8df;border-radius:13px;background:#fff}.use-bridge-wall p{margin:7px 0 0}.use-bridge-compare{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}.use-bridge-compare>div{padding:12px;border-radius:10px;background:#fff}.use-bridge-compare strong{font-size:24px;color:#176b50}
      @media(max-width:640px){.use-bridge-card{padding:16px}.use-bridge-card h1{font-size:25px}.use-bridge-prompt{font-size:20px}.use-bridge-supports{grid-template-columns:1fr}.use-bridge-compare{grid-template-columns:1fr}.use-bridge-compare strong{text-align:center;transform:rotate(90deg)}}`;
    document.head.appendChild(style);
  }

  function connect() {
    if (client || !window.mqtt) return;
    const clientId = `l08use_s_${Math.random().toString(36).slice(2, 10)}`;
    client = mqtt.connect('wss://05d1d5baec9d4cb3a21f5517b430cff1.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'classpro', password: 'Classpro2026', clientId, reconnectPeriod: 3000, connectTimeout: 8000
    });
    client.on('connect', () => {
      client.subscribe(TOPICS.control);
      client.subscribe(TOPICS.ack);
      sendPresence(true);
      flushOutbox();
    });
    client.on('message', (topic, buffer) => {
      try {
        const message = JSON.parse(buffer.toString());
        if (topic === TOPICS.ack) {
          if (message.type === 'use_ack' && message.lesson === LESSON && message.experiment === EXPERIMENT && message.room === ROOM) {
            state.outbox = state.outbox.filter(item => item.submissionId !== message.submissionId);
            save();
          }
          return;
        }
        if (topic !== TOPICS.control || message.type !== 'use_control') return;
        if (message.lesson !== LESSON || message.experiment !== EXPERIMENT || message.room !== ROOM) return;
        if (message.targetClientId && message.targetClientId !== clientId) return;
        const nextId = message.interaction ? message.interaction.id : '';
        if (state.controllerId !== message.controllerId || state.interactionId !== nextId) resetForInteraction(message);
        else { control = message; state.control = message; save(); }
        renderUse();
      } catch (error) { console.warn(error); }
    });
  }

  function sendPresence(requestCurrent) {
    if (!client || !client.connected || !activeStudent) return;
    client.publish(TOPICS.presence, JSON.stringify({ type: 'use_presence', lesson: LESSON, experiment: EXPERIMENT, room: ROOM, studentName: activeStudent, participantId: state.participantId, clientId: client.options.clientId, requestCurrent, seenAt: new Date().toISOString() }), { qos: requestCurrent ? 1 : 0 });
  }
  function publish(message) { if (client && client.connected) client.publish(TOPICS.answers, JSON.stringify(message), { qos: 1 }); }
  function flushOutbox() { state.outbox.slice().forEach(publish); }
  function send(kind, payload) {
    if (!control || !control.interaction) return;
    const message = Object.assign({ type: 'use_answer', kind, lesson: LESSON, experiment: EXPERIMENT, room: ROOM, controllerId: control.controllerId, interactionId: control.interaction.id, groupId: control.interaction.groupId || '', stage: control.interaction.stage, questionId: `${control.interaction.id}__${kind}`, studentName: activeStudent, participantId: state.participantId, clientId: client ? client.options.clientId : `offline_${state.participantId}`, submissionId: uid(`use_${kind}`), submittedAt: new Date().toISOString() }, payload || {});
    state.outbox.push(message);
    save();
    publish(message);
  }

  function restoreNative() {
    if (!useViewActive) return;
    useViewActive = false;
    const host = document.getElementById('app');
    if (host) host.classList.remove('l08-use-bridge');
    if (typeof window.render === 'function') window.render();
  }
  function renderUse() {
    const interaction = control && control.interaction;
    if (!interaction || interaction.currentAction === 'waiting') { restoreNative(); return; }
    const host = document.getElementById('app');
    if (!host) return;
    injectStyles();
    useViewActive = true;
    host.classList.add('l08-use-bridge');
    if (!state.firstSent) {
      if (interaction.responseType === 'choice_set') return renderChoiceSet(host, interaction);
      if (interaction.responseType === 'vocab_focus') return renderVocabularyFocus(host, interaction);
      return renderFirst(host, interaction);
    }
    if (interaction.currentAction === 'choice_results') return renderChoiceResults(host, interaction);
    if (interaction.currentAction === 'vocab_results') return renderVocabularyResults(host, interaction);
    if (interaction.currentAction === 'wall') return renderWall(host, interaction);
    if (interaction.currentAction === 'support') return renderSupport(host, interaction);
    if (interaction.currentAction === 'revision') return state.secondSent ? renderSaved(host, true) : renderRevision(host, interaction);
    if (interaction.currentAction === 'compare') return renderComparison(host, interaction);
    return renderSaved(host, interaction.currentAction === 'closed');
  }
  function card(title, en, content) { return `<section class="use-bridge-card"><div class="use-bridge-kicker">${esc(en)}</div><h1>${esc(title)}</h1>${content}</section>`; }
  function prompt(interaction) {
    const context = interaction.contextCn ? `<div class="use-bridge-context"><b>情境 / Context</b><br>${esc(interaction.contextCn)}${interaction.contextEn ? `<small>${esc(interaction.contextEn)}</small>` : ''}</div>` : '';
    return `${context}<div class="use-bridge-prompt">${esc(interaction.prompt.cn)}</div>${interaction.prompt.en ? `<div class="use-bridge-muted"><small>${esc(interaction.prompt.en)}</small></div>` : ''}`;
  }
  function supportOptions(items, selected, name, type) {
    const inputType = type || 'checkbox';
    return `<div class="use-bridge-supports">${items.map(item => `<label><input type="${inputType}" name="${name}" value="${esc(item.id)}" ${selected.includes(item.id) ? 'checked' : ''}><span><b>${esc(item.labelCn)}</b><small>${esc(item.labelEn)}</small></span></label>`).join('')}</div>`;
  }
  function checked(name) { return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value); }

  function renderFirst(host, interaction) {
    const entry = state.entryAnswers[interaction.groupId] || '';
    const previous = interaction.stage === 'exit' && entry ? `<div class="use-bridge-note"><b>课堂开始时，你这样说：</b><br>${esc(entry)}</div>` : '';
    const support = interaction.stage === 'exit' ? '' : `<div class="use-bridge-note"><b>你现在需要什么帮助？ <small>What support do you need now?</small></b><div class="use-bridge-muted"><small>可选；不选就是先自己试试。 / Choose only if needed.</small></div>${supportOptions(interaction.supportOptions || [], state.supportIds, 'useSupport')}</div>`;
    const feelings = interaction.collectFeeling ? `<div class="use-bridge-note"><b>你觉得今天的表达有什么变化？ <small>What changed in your expression?</small></b>${supportOptions(feelingOptions, state.feelingIds, 'useFeeling', 'radio')}</div>` : '';
    host.innerHTML = card(interaction.stage === 'exit' ? '完成你的升级表达' : '请先独立表达', interaction.stage === 'exit' ? 'UPGRADED EXPRESSION' : 'YOUR FIRST IDEA', `${previous}${prompt(interaction)}<textarea id="useFirstAnswer" rows="4" placeholder="先写下你自己的想法。 / Write your own idea first.">${esc(state.firstAnswer)}</textarea>${support}${feelings}<button class="use-bridge-submit" onclick="submitUseFirst()">保存这次表达 · Save</button>`);
  }
  window.submitUseFirst = function () {
    const field = document.getElementById('useFirstAnswer');
    const answer = field ? field.value.trim() : '';
    if (!answer) return alert('请先写下你的想法 / Please write your idea first.');
    state.firstAnswer = answer;
    state.supportIds = control.interaction.stage === 'exit' ? [] : checked('useSupport');
    state.feelingIds = control.interaction.collectFeeling ? checked('useFeeling') : [];
    state.firstSent = true;
    if (control.interaction.stage === 'entry') state.entryAnswers[control.interaction.groupId] = answer;
    send('attempt1', { answer, supportIds: state.supportIds, feelingIds: state.feelingIds, elapsedSeconds: Math.max(1, Math.round((Date.now() - Date.parse(control.interaction.startedAt)) / 1000)) });
    save();
    renderUse();
  };

  function renderChoiceSet(host, interaction) {
    const items = (interaction.items || []).map((item, index) => `<article class="use-bridge-question"><h2><span>${index + 1}</span>${esc(item.questionCn)}</h2><div class="use-bridge-list">${item.options.map((option, optionIndex) => `<label><input type="radio" name="useChoice_${esc(item.id)}" value="${optionIndex}" ${Number(state.choiceAnswers[item.id]) === optionIndex ? 'checked' : ''}><b>${String.fromCharCode(65 + optionIndex)}</b><span>${esc(option)}</span></label>`).join('')}</div></article>`).join('');
    host.innerHTML = card('先抓大意，不找细节', 'OVERALL CHOICE', `${prompt(interaction)}<div class="use-bridge-choices">${items}</div><button class="use-bridge-submit" onclick="submitUseChoices()">提交整体选择 · Submit</button>`);
  }
  window.submitUseChoices = function () {
    const answers = {};
    for (const item of control.interaction.items || []) {
      const selected = document.querySelector(`input[name="useChoice_${item.id}"]:checked`);
      if (!selected) return alert('请完成每一道题 / Please answer every question.');
      answers[item.id] = Number(selected.value);
    }
    state.choiceAnswers = answers;
    state.firstAnswer = (control.interaction.items || []).map((item, index) => `Q${index + 1}:${String.fromCharCode(65 + answers[item.id])}`).join('；');
    state.firstSent = true;
    send('attempt1', { answer: state.firstAnswer, choiceAnswers: answers, supportIds: [], feelingIds: [], elapsedSeconds: Math.max(1, Math.round((Date.now() - Date.parse(control.interaction.startedAt)) / 1000)) });
    save();
    renderUse();
  };
  function renderChoiceResults(host, interaction) {
    const summaries = Object.fromEntries(((control.choiceSummary && control.choiceSummary.items) || []).map(item => [item.id, item]));
    const items = (interaction.items || []).map((item, index) => {
      const counts = (summaries[item.id] && summaries[item.id].counts) || [];
      return `<article class="use-bridge-question"><h2><span>${index + 1}</span>${esc(item.questionCn)}</h2><div class="use-bridge-results">${item.options.map((option, optionIndex) => `<div class="${optionIndex === item.correctIndex ? 'correct' : ''}"><b>${String.fromCharCode(65 + optionIndex)}</b><span>${esc(option)}</span><em>${counts[optionIndex] || 0}人${Number(state.choiceAnswers[item.id]) === optionIndex ? ' · 我的选择' : ''}${optionIndex === item.correctIndex ? ' · ✓' : ''}</em></div>`).join('')}</div></article>`;
    }).join('');
    host.innerHTML = card('一起回看课文大意', 'REVIEW THE GIST', `<p class="use-bridge-muted">先确认主题和发展，再进入细节问答。</p><div class="use-bridge-choices">${items}</div>`);
  }

  function renderVocabularyFocus(host, interaction) {
    const items = (interaction.items || []).map((item, index) => `<article class="use-bridge-question"><h2><span>${index + 1}</span>${esc(item.promptCn)}</h2><div class="use-bridge-muted"><small>${esc(item.promptEn || '')}</small></div><div class="use-bridge-prompt">${esc(item.stimulus)}</div>${item.options && item.options.length ? `<div class="use-bridge-list">${item.options.map((option, optionIndex) => `<label><input type="radio" name="useVocab_${esc(item.id)}" value="${esc(option)}" ${state.vocabAnswers[item.id] === option ? 'checked' : ''}><b>${String.fromCharCode(65 + optionIndex)}</b><span>${esc(option)}</span></label>`).join('')}</div>` : `<input type="text" id="useVocab_${esc(item.id)}" value="${esc(state.vocabAnswers[item.id] || '')}" placeholder="输入汉字 / Type the word">`}</article>`).join('');
    host.innerHTML = card('词汇巩固', 'VOCABULARY FOCUS', `<p class="use-bridge-muted">这是老师选择的词，请先独立完成。</p><div class="use-bridge-choices">${items}</div><button class="use-bridge-submit" onclick="submitUseVocabulary()">提交词汇任务 · Submit</button>`);
  }
  window.submitUseVocabulary = function () {
    const answers = {};
    for (const item of control.interaction.items || []) {
      if (item.options && item.options.length) {
        const selected = document.querySelector(`input[name="useVocab_${item.id}"]:checked`);
        if (!selected) return alert('请完成每一道题 / Please answer every question.');
        answers[item.id] = selected.value;
      } else {
        const field = document.getElementById(`useVocab_${item.id}`);
        const value = field ? field.value.trim() : '';
        if (!value) return alert('请完成每一道题 / Please answer every question.');
        answers[item.id] = value;
      }
    }
    state.vocabAnswers = answers;
    state.firstAnswer = (control.interaction.items || []).map((item, index) => `Q${index + 1}:${answers[item.id]}`).join('；');
    state.firstSent = true;
    send('attempt1', { answer: state.firstAnswer, vocabAnswers: answers, supportIds: [], feelingIds: [], elapsedSeconds: Math.max(1, Math.round((Date.now() - Date.parse(control.interaction.startedAt)) / 1000)) });
    save();
    renderUse();
  };
  function renderVocabularyResults(host, interaction) {
    const summaries = Object.fromEntries(((control.vocabSummary && control.vocabSummary.items) || []).map(item => [item.id, item]));
    const rows = (interaction.items || []).map((item, index) => {
      const mine = state.vocabAnswers[item.id] || '';
      const correct = String(mine).replace(/\s+/g, '').toLowerCase() === String(item.answer).replace(/\s+/g, '').toLowerCase();
      const summary = summaries[item.id] || {};
      return `<div class="use-bridge-note"><b>${index + 1}. ${esc(item.stimulus)}</b><br>我的答案：${esc(mine)}<br><strong>正确答案：${esc(item.answer)}</strong><small>${summary.correct || 0}/${(control.vocabSummary && control.vocabSummary.total) || 0} 人答对</small></div>`;
    }).join('');
    host.innerHTML = card('一起核对词形和词义', 'VOCABULARY REVIEW', rows);
  }

  function renderSaved(host, closed) {
    host.innerHTML = card('这次表达已经保存', 'SAVED', `<div class="use-bridge-note"><b>我的表达</b><p>${esc(state.secondSent ? state.secondAnswer : state.firstAnswer)}</p></div><p class="use-bridge-muted">${closed ? '这一轮已经结束。' : '请保留自己的想法，等待老师决定下一步。'}<small>${closed ? 'This interaction has ended.' : 'Keep your idea and wait for the next step.'}</small></p>`);
  }
  function renderWall(host) {
    host.innerHTML = card('看看班里不同的想法', 'IDEA WALL', `<div class="use-bridge-wall">${(control.wall || []).map(item => `<article><b>${esc(item.label)}</b><p>${esc(item.answer)}</p></article>`).join('')}</div>`);
  }
  function renderSupport(host, interaction) {
    host.innerHTML = card('选择对你有用的提示', 'LEARNING SUPPORT', `${(interaction.openedSupportCards || []).map(item => `<div class="use-bridge-note"><b>${esc(item.labelCn)}</b><small>${esc(item.labelEn)}</small><p>${esc(item.contentCn)}</p><small>${esc(item.contentEn)}</small></div>`).join('')}`);
  }
  function renderRevision(host) {
    host.innerHTML = card('再说一次', 'EXPRESS AGAIN', `<div class="use-bridge-compare"><div><b>第一次</b><p>${esc(state.firstAnswer)}</p></div><strong>→</strong><div><b>现在</b><p>尝试说得更清楚或更完整</p></div></div><textarea id="useSecondAnswer" rows="4" placeholder="用你自己的话再表达一次。 / Express it again in your own words.">${esc(state.secondAnswer)}</textarea><button class="use-bridge-submit" onclick="submitUseSecond()">保存再次表达 · Save</button>`);
  }
  window.submitUseSecond = function () {
    const field = document.getElementById('useSecondAnswer');
    const answer = field ? field.value.trim() : '';
    if (!answer) return alert('请先完成再次表达 / Please complete your revision.');
    state.secondAnswer = answer;
    state.secondSent = true;
    send('attempt2', { answer, firstAnswer: state.firstAnswer, supportIds: state.supportIds });
    save();
    renderUse();
  };
  function renderComparison(host, interaction) {
    const before = interaction.stage === 'exit' && state.entryAnswers[interaction.groupId] ? state.entryAnswers[interaction.groupId] : state.firstAnswer;
    const after = state.secondSent ? state.secondAnswer : state.firstAnswer;
    host.innerHTML = card('看见自己的变化', 'SEE YOUR PROGRESS', `<div class="use-bridge-compare"><div><b>开始时</b><p>${esc(before)}</p></div><strong>→</strong><div><b>现在</b><p>${esc(after)}</p></div></div>`);
  }

  function activate() {
    const nextStudent = studentName();
    if (!nextStudent || !window.nameReady) return;
    if (nextStudent !== activeStudent) {
      activeStudent = nextStudent;
      restore();
    }
    connect();
    sendPresence(true);
    renderUse();
  }

  const nativeConfirmName = window.confirmName;
  window.confirmName = function () {
    const result = nativeConfirmName.apply(this, arguments);
    activate();
    return result;
  };
  fetch('../data-model/experiments/HSK3-L08-USE-PILOT-V1.json?v=10').then(response => response.ok ? response.json() : null).then(data => {
    if (data && Array.isArray(data.feelingOptions)) feelingOptions = data.feelingOptions;
    if (useViewActive) renderUse();
  }).catch(() => {});
  activate();
})();
