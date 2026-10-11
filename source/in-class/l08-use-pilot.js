(function () {
  'use strict';

  const PARAMS = new URLSearchParams(location.search);
  const LESSON = PARAMS.get('lesson') || 'HSK3-L08';
  const PROFILE = PARAMS.get('profile') || 'pilot-v1';
  const LESSON_CODE = (LESSON.split('-').pop() || 'L08').toLowerCase();
  const EXPERIMENT = `${LESSON_CODE}-use-${PROFILE}`;
  const ROOM = PARAMS.get('room') || '8808';
  const DATA_VERSION = `${EXPERIMENT}-v1`;
  const CONFIG_URL = `../data-model/experiments/${encodeURIComponent(LESSON)}-USE-${encodeURIComponent(PROFILE.toUpperCase())}.json?v=3`;
  const STORAGE_KEY = `ClassProUsePilot_${EXPERIMENT}_${ROOM}`;
  const TOPIC_ROOT = `classpro/use/${EXPERIMENT}/${ROOM}`;
  const TOPICS = { control: `${TOPIC_ROOT}/control`, answers: `${TOPIC_ROOT}/answers`, presence: `${TOPIC_ROOT}/presence`, ack: `${TOPIC_ROOT}/ack` };
  const ROSTER = window.ClassProStudentsForLesson ? window.ClassProStudentsForLesson(LESSON) : (window.CLASS_STUDENTS || []);

  let config;
  let client;
  let frameObserver;
  let state = freshState();

  function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
  function now() { return new Date().toISOString(); }
  function clock(iso) { const d = new Date(iso || Date.now()); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
  function timerPolicy(kind) {
    const policy = config && config.timerPolicy && config.timerPolicy[kind];
    if (!policy || !Array.isArray(policy.optionsMinutes)) return null;
    const optionsMinutes = policy.optionsMinutes.map(Number).filter(value => Number.isFinite(value) && value > 0);
    if (!optionsMinutes.length) return null;
    const requestedDefault = Number(policy.defaultMinutes);
    return { optionsMinutes, defaultMinutes: optionsMinutes.includes(requestedDefault) ? requestedDefault : optionsMinutes[0] };
  }
  function timerPicker(kind, id, selectedValue, changeCode) {
    const policy = timerPolicy(kind);
    if (!policy) return '';
    const selected = policy.optionsMinutes.includes(Number(selectedValue)) ? Number(selectedValue) : policy.defaultMinutes;
    const change = changeCode ? ` onchange="${changeCode}"` : '';
    return `<label class="use-timer-picker"><span>活动计时 <small>Timer</small></span><select id="${esc(id)}"${change}>${policy.optionsMinutes.map(minutes => `<option value="${minutes}" ${minutes === selected ? 'selected' : ''}>${minutes}分钟 / ${minutes} min</option>`).join('')}</select></label>`;
  }
  function chosenTimerSeconds(kind, id, root) {
    const policy = timerPolicy(kind);
    if (!policy) return 0;
    const field = (root || document).getElementById(id);
    const minutes = field && policy.optionsMinutes.includes(Number(field.value)) ? Number(field.value) : policy.defaultMinutes;
    return minutes * 60;
  }
  function timerRemaining(interaction) {
    const duration = Number(interaction && interaction.timerSeconds) || 0;
    const started = Date.parse(interaction && interaction.startedAt);
    if (!duration) return 0;
    if (!Number.isFinite(started)) return duration;
    return Math.max(0, duration - Math.floor((Date.now() - started) / 1000));
  }
  function formatCountdown(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  function countdownMarkup(interaction) {
    if (!interaction || !Number(interaction.timerSeconds)) return '';
    const remaining = timerRemaining(interaction);
    return `<div class="use-countdown ${remaining ? '' : 'expired'}" data-use-countdown data-started-at="${esc(interaction.startedAt)}" data-timer-seconds="${Number(interaction.timerSeconds)}"><span>剩余时间 <small>Time left</small></span><b>${remaining ? formatCountdown(remaining) : '时间到'}</b><em>${remaining ? '' : "Time's up"}</em></div>`;
  }
  function refreshCountdowns(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('[data-use-countdown]').forEach(node => {
      const remaining = timerRemaining({ startedAt: node.dataset.startedAt, timerSeconds: node.dataset.timerSeconds });
      node.classList.toggle('expired', remaining === 0);
      const value = node.querySelector('b');
      const note = node.querySelector('em');
      if (value) value.textContent = remaining ? formatCountdown(remaining) : '时间到';
      if (note) note.textContent = remaining ? '' : "Time's up";
    });
  }
  function refreshAllCountdowns() {
    refreshCountdowns(document);
    const frame = document.getElementById('classproFrame');
    if (frame && frame.contentDocument) refreshCountdowns(frame.contentDocument);
  }
  function lessonLabel() {
    const match = LESSON.match(/-L(\d+)$/i);
    return (config && config.experiment.lessonLabel) || (match ? `第${Number(match[1])}课` : LESSON);
  }

  function freshState() {
    return {
      schema: 2,
      controllerId: uid('use_teacher'),
      selectedGroupId: '',
      selectedNode: 'home',
      interaction: null,
      records: [],
      observations: {},
      presence: {},
      trail: [],
      controlRevision: 0,
      nativeRoute: ''
    };
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.schema === 2) state = Object.assign(freshState(), saved);
    } catch (_) {}
  }

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function group(groupId) {
    const id = groupId || state.selectedGroupId;
    return config.useGroups.find(item => item.id === id) || config.useGroups[0];
  }
  function addTrail(type, text, meta) {
    state.trail.unshift({ id: uid('trail'), groupId: (meta && meta.groupId) || state.selectedGroupId || '', type, text, meta: meta || {}, at: now() });
    save();
  }

  function records(kind, interactionId) {
    const id = interactionId || (state.interaction && state.interaction.id);
    const map = {};
    state.records.filter(r => r.interactionId === id && (!kind || r.kind === kind)).forEach(r => {
      const key = `${r.kind}:${String(r.participantId || r.studentName).toLowerCase()}`;
      map[key] = r;
    });
    return Object.values(map);
  }

  function groupRecords(kind, stage, groupId) {
    const id = groupId || state.selectedGroupId;
    const latest = {};
    state.records.filter(record => (!id || record.groupId === id) && (!kind || record.kind === kind) && (!stage || record.stage === stage)).forEach(record => {
      const key = `${record.kind}:${String(record.participantId || record.studentName).toLowerCase()}`;
      latest[key] = record;
    });
    return Object.values(latest);
  }

  function connectedCount() {
    return new Set(Object.values(state.presence).filter(p => Date.now() - Date.parse(p.seenAt || 0) < 180000).map(p => p.participantId || p.studentName)).size;
  }

  function evidenceSnapshot() {
    const first = records('attempt1');
    const counts = {};
    first.forEach(r => (r.supportIds || []).forEach(id => { counts[id] = (counts[id] || 0) + 1; }));
    return { submitted: first.length, roster: ROSTER.length, online: connectedCount(), supportNeeds: counts, capturedAt: now() };
  }

  function setConnection(text, error) {
    const node = document.getElementById('connection');
    node.textContent = `● ${text}`;
    node.className = `status${error ? ' error' : ''}`;
  }

  function controlMessage(targetClientId) {
    return {
      type: 'use_control',
      lesson: LESSON,
      experiment: EXPERIMENT,
      room: ROOM,
      controllerId: state.controllerId,
      revision: state.controlRevision,
      targetClientId: targetClientId || '',
      interaction: state.interaction,
      wall: state.interaction && state.interaction.currentAction === 'wall' ? anonymousWall() : [],
      choiceSummary: state.interaction && state.interaction.currentAction === 'choice_results' ? choiceSummaryData(state.interaction) : null,
      vocabSummary: state.interaction && state.interaction.currentAction === 'vocab_results' ? vocabularySummaryData(state.interaction) : null,
      sentAt: now()
    };
  }

  function publishControl(targetClientId) {
    if (!client || !client.connected) return;
    client.publish(TOPICS.control, JSON.stringify(controlMessage(targetClientId)), { qos: 1, retain: false });
  }

  function connect() {
    if (!window.mqtt) return setConnection('连接组件未加载', true);
    client = mqtt.connect('wss://05d1d5baec9d4cb3a21f5517b430cff1.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'classpro', password: 'Classpro2026', clientId: `${LESSON_CODE}use_t_${Math.random().toString(36).slice(2, 10)}`, reconnectPeriod: 3000, connectTimeout: 8000
    });
    client.on('connect', () => {
      setConnection(`已连接·房间 ${ROOM}`);
      client.subscribe(TOPICS.answers);
      client.subscribe(TOPICS.presence);
      publishControl();
    });
    client.on('message', (topic, buffer) => {
      try {
        const message = JSON.parse(buffer.toString());
        if (message.lesson !== LESSON || message.experiment !== EXPERIMENT || message.room !== ROOM) return;
        if (topic === TOPICS.presence && message.type === 'use_presence') {
          state.presence[message.clientId || message.participantId] = message;
          if (message.requestCurrent) publishControl(message.clientId);
          save(); renderSidebars();
          return;
        }
        if (topic !== TOPICS.answers || message.type !== 'use_answer' || message.controllerId !== state.controllerId) return;
        if (!state.interaction || message.interactionId !== state.interaction.id) return;
        if (!state.records.some(r => r.submissionId === message.submissionId)) state.records.push(message);
        client.publish(TOPICS.ack, JSON.stringify({ type: 'use_ack', lesson: LESSON, experiment: EXPERIMENT, room: ROOM, submissionId: message.submissionId }), { qos: 1 });
        save(); render();
      } catch (error) { console.warn(error); }
    });
    client.on('error', () => setConnection('连接失败', true));
    client.on('close', () => setConnection('正在重连'));
  }

  function setupFrame() {
    const frame = document.getElementById('classproFrame');
    frame.src = `teacher.html?lesson=${encodeURIComponent(LESSON)}&room=${encodeURIComponent(ROOM)}&dataVersion=${encodeURIComponent(DATA_VERSION)}`;
    frame.addEventListener('load', () => {
      installNativeDataFetch(frame.contentWindow);
      installUnifiedStudentEntry(frame.contentWindow);
      applyResourceOverrides(frame.contentWindow);
      injectNativeUi();
      const body = frame.contentDocument && frame.contentDocument.body;
      if (body) {
        if (frameObserver) frameObserver.disconnect();
        frameObserver = new MutationObserver(() => injectNativeUi());
        frameObserver.observe(body, { childList: true, subtree: true });
      }
    });
  }

  function installNativeDataFetch(frameWindow) {
    if (!frameWindow || frameWindow.__usePilotDataFetch || typeof frameWindow.fetch !== 'function') return;
    const nativeFetch = frameWindow.fetch.bind(frameWindow);
    frameWindow.__usePilotDataFetch = true;
    frameWindow.fetch = function (input, init) {
      if (typeof input !== 'string' || input.indexOf('../data-model/') !== 0) return nativeFetch(input, init);
      const separator = input.indexOf('?') >= 0 ? '&' : '?';
      return nativeFetch(`${input}${separator}dataVersion=${encodeURIComponent(DATA_VERSION)}`, init);
    };
  }

  function unifiedStudentUrl() {
    return `student.html?lesson=${encodeURIComponent(LESSON)}&room=${encodeURIComponent(ROOM)}&profile=${encodeURIComponent(PROFILE)}&experiment=${encodeURIComponent(EXPERIMENT)}&dataVersion=${encodeURIComponent(DATA_VERSION)}`;
  }

  function mergeObject(target, patch) {
    Object.keys(patch || {}).forEach(key => {
      const value = patch[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {};
        mergeObject(target[key], value);
      } else target[key] = Array.isArray(value) ? value.slice() : value;
    });
    return target;
  }

  function applyResourceOverrides(frameWindow) {
    const overrides = config && Array.isArray(config.resourceOverrides) ? config.resourceOverrides : [];
    const banks = frameWindow && frameWindow.LESSON_DATA && frameWindow.LESSON_DATA.classProQuestions;
    if (!banks || !overrides.length) return;
    overrides.forEach(override => {
      Object.keys(banks).some(bankId => {
        const bank = banks[bankId];
        if (!Array.isArray(bank)) return false;
        const item = bank.find(candidate => candidate.id === override.id);
        if (!item) return false;
        mergeObject(item, override.patch || {});
        return true;
      });
    });
  }

  function installUnifiedStudentEntry(frameWindow) {
    if (!frameWindow || frameWindow.__usePilotStudentEntry) return;
    frameWindow.__usePilotStudentEntry = true;
    frameWindow.rawStudentUrl = function () { return new URL(unifiedStudentUrl(), frameWindow.location.href).href; };
    frameWindow.studentUrl = function () { return encodeURIComponent(frameWindow.rawStudentUrl()); };
  }

  function choiceSummaryData(interaction) {
    if (!interaction || interaction.responseType !== 'choice_set') return null;
    const submissions = records('attempt1', interaction.id);
    return {
      total: submissions.length,
      items: (interaction.items || []).map(item => ({
        id: item.id,
        counts: item.options.map((_, optionIndex) => submissions.filter(record => Number((record.choiceAnswers || {})[item.id]) === optionIndex).length)
      }))
    };
  }

  function activeTextLearning(app) {
    const nativeApp = app || (document.getElementById('classproFrame').contentWindow || {}).ap;
    const index = nativeApp ? Math.max(0, Math.min(Number(nativeApp.ti) || 0, config.textLearning.length - 1)) : 0;
    return config.textLearning[index];
  }

  function activeVocabularyGroup(app) {
    const nativeApp = app || (document.getElementById('classproFrame').contentWindow || {}).ap;
    const session = nativeApp && nativeApp.hsk3VocabSession ? String(nativeApp.hsk3VocabSession) : String((group().textIndex || 0) + 1);
    const source = config.vocabularyGroups[Math.max(0, Number(session) - 1)] || config.vocabularyGroups[0];
    if (!source || Array.isArray(source.words)) return source;
    const catalog = Array.isArray(config.vocabularyCatalog) ? config.vocabularyCatalog : [];
    return Object.assign({}, source, { words: (source.wordIds || []).map(id => catalog.find(word => word.id === id)).filter(Boolean) });
  }

  function normalizeAnswer(value) { return String(value == null ? '' : value).replace(/\s+/g, '').toLowerCase(); }
  function matchesAnswer(value, item) { return (item.acceptedAnswers || [item.answer]).some(answer => normalizeAnswer(value) === normalizeAnswer(answer)); }

  function vocabularySummaryData(interaction) {
    if (!interaction || interaction.responseType !== 'vocab_focus') return null;
    const submissions = records('attempt1', interaction.id);
    return {
      total: submissions.length,
      items: (interaction.items || []).map(item => ({
        id: item.id,
        correct: item.evaluation === 'teacher' ? null : submissions.filter(record => matchesAnswer((record.vocabAnswers || {})[item.id], item)).length
      }))
    };
  }

  function vocabularyWordSupports(vocabularyGroup, word, type) {
    if (type === 'recognition' && Array.isArray(vocabularyGroup.recognitionWordIds)) return vocabularyGroup.recognitionWordIds.includes(word.id);
    return word.allowedTypes.includes(type);
  }

  function rotateOptions(options, offset) {
    if (!options.length) return [];
    const move = Math.abs(Number(offset) || 0) % options.length;
    return options.slice(move).concat(options.slice(0, move));
  }

  function vocabularyFocusItems(vocabularyGroup, selectedIds, type) {
    const selectedWords = selectedIds.map(id => vocabularyGroup.words.find(word => word.id === id)).filter(word => word && vocabularyWordSupports(vocabularyGroup, word, type));
    if (type === 'recognition' && selectedWords.length && selectedWords.every(word => word.meaningCn)) {
      const available = vocabularyGroup.words.filter(word => vocabularyWordSupports(vocabularyGroup, word, 'recognition') && word.meaningCn);
      return selectedWords.slice(0, 4).map(word => {
        const wordIndex = available.findIndex(item => item.id === word.id);
        const meanings = [word.meaningCn];
        for (let step = 1; meanings.length < 4 && step < available.length; step += 1) {
          const candidate = available[(wordIndex + step) % available.length].meaningCn;
          if (candidate && !meanings.includes(candidate)) meanings.push(candidate);
        }
        const options = rotateOptions(meanings, wordIndex);
        return {
          id: `vocab_recognition_${word.id}`,
          wordId: word.id,
          taskType: type,
          promptCn: `“${word.hanzi}”是什么意思？`,
          promptEn: 'Choose the closest Chinese explanation.',
          stimulus: word.hanzi,
          options,
          answer: word.meaningCn,
          acceptedAnswers: [word.meaningCn],
          evaluation: 'automatic'
        };
      });
    }
    const configured = (vocabularyGroup.activities || []).filter(activity => activity.type === type && (activity.targetWordIds || []).some(id => selectedIds.includes(id)));
    if (configured.length) return configured.slice(0, 4).map(activity => ({
      id: activity.id,
      wordId: (activity.targetWordIds || [])[0] || '',
      taskType: type,
      promptMode: activity.promptMode || '',
      promptCn: activity.promptCn,
      promptEn: activity.promptEn || '',
      stimulus: activity.stimulus || '',
      options: activity.options || [],
      answer: activity.answer,
      acceptedAnswers: activity.acceptedAnswers || [activity.answer],
      evaluation: activity.evaluation || 'automatic'
    }));
    return selectedIds.map(id => {
      const word = vocabularyGroup.words.find(item => item.id === id);
      const wordIndex = vocabularyGroup.words.findIndex(item => item.id === id);
      if (!word || !word.allowedTypes.includes(type)) return null;
      let promptCn = '';
      let promptEn = '';
      let stimulus = '';
      let options = [];
      let answer = word.hanzi;
      if (type === 'recognition') {
        promptCn = `“${word.hanzi}”是什么意思？`;
        promptEn = 'Choose the meaning.';
        stimulus = word.hanzi;
        const meanings = [word.english];
        for (let step = 1; meanings.length < 4 && step < vocabularyGroup.words.length; step += 1) {
          const candidate = vocabularyGroup.words[(wordIndex + step) % vocabularyGroup.words.length].english;
          if (candidate && !meanings.includes(candidate)) meanings.push(candidate);
        }
        options = rotateOptions(meanings, wordIndex);
        answer = word.english;
      } else if (type === 'shape') {
        promptCn = '请选择正确的汉字。';
        promptEn = 'Choose the correct character form.';
        stimulus = `${word.pinyin} · ${word.english}`;
        options = rotateOptions(word.shapeOptions, wordIndex);
      } else if (type === 'input') {
        promptCn = '请根据拼音和英文输入词语。';
        promptEn = 'Type the word from its pinyin and meaning.';
        stimulus = `${word.pinyin} · ${word.english}`;
      } else if (type === 'collocation') {
        promptCn = '请选择最自然的搭配。';
        promptEn = 'Choose the most natural collocation.';
        stimulus = word.hanzi;
        options = rotateOptions(word.collocationOptions, wordIndex);
        answer = word.collocationOptions[0];
      }
      return {
        id: `vocab_${type}_${word.id}`,
        wordId: word.id,
        type,
        promptCn,
        promptEn,
        stimulus,
        options,
        answer,
        correctIndex: options.length ? options.indexOf(answer) : -1
      };
    }).filter(Boolean);
  }

  function renderOverviewQuestions(interaction, showResults) {
    const items = interaction && interaction.items ? interaction.items : activeTextLearning().overviewChoices;
    const summary = interaction ? choiceSummaryData(interaction) : null;
    return `<div class="use-overview-list">${items.map((item, itemIndex) => {
      const counts = summary ? summary.items[itemIndex].counts : [];
      return `<article><h4><span>${itemIndex + 1}</span>${esc(item.questionCn)}</h4><div>${item.options.map((option, optionIndex) => {
        const correct = showResults && optionIndex === item.correctIndex;
        return `<p class="${correct ? 'correct' : ''}"><b>${String.fromCharCode(65 + optionIndex)}</b><span>${esc(option)}</span>${showResults ? `<em>${counts[optionIndex] || 0}人${correct ? ' · ✓' : ''}</em>` : ''}</p>`;
      }).join('')}</div></article>`;
    }).join('')}</div>`;
  }

  function phaseTabsHtml(phase) {
    const labels = [['先听 / 读', 'Listen / Read'], ['整体选择', 'Choose'], ['细节问答', 'Q&A'], ['展示课文', 'Text'], ['语言与应用', 'Use']];
    return `<div class="hsk3-text-phase-tabs">${labels.map((item, index) => `<button class="${phase === index ? 'active' : ''}" onclick="ap.hsk3TextPhase=${index};ap.hsk3TextAnswer=false;ap._r()"><b>${index + 1}</b><span>${item[0]}</span><small>${item[1]}</small></button>`).join('')}</div>`;
  }

  function nativeTextHtml(app, original, phase) {
    const current = app.hsk3TextPhase;
    try {
      app.hsk3TextPhase = phase;
      return original.call(app);
    } finally {
      app.hsk3TextPhase = current;
    }
  }

  function htmlNode(doc, html) {
    const template = doc.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function replaceTextTabs(doc, panel, phase) {
    const tabs = panel.querySelector('.hsk3-text-phase-tabs');
    if (tabs) tabs.replaceWith(htmlNode(doc, phaseTabsHtml(phase)));
  }

  function renderOverallChoiceStage(doc) {
    const learning = activeTextLearning();
    const interaction = state.interaction && state.interaction.stage === 'text_overview' && state.interaction.groupId === learning.useGroupId ? state.interaction : null;
    const submitted = interaction ? records('attempt1', interaction.id).length : 0;
    const showingResults = !!(interaction && interaction.currentAction === 'choice_results');
    let status = '';
    let actions = '<button class="use-text-action primary" onclick="parent.startTextOverview()">发布给全班</button>';
    if (interaction && !interaction.flags.closed) {
      status = `<span class="use-inline-status">已提交 ${submitted}/${ROSTER.length}</span>`;
      actions = `${!showingResults && submitted ? '<button class="use-text-action primary" onclick="parent.publishTextChoiceResults()">统一回流</button>' : ''}<button class="use-text-action" onclick="parent.closeInteraction()">结束</button>`;
    } else if (interaction && interaction.flags.closed) {
      status = `<span class="use-inline-status">本轮 ${submitted}/${ROSTER.length}</span>`;
      actions = '<button class="use-text-action" onclick="parent.startTextOverview()">重新发布</button>';
    }
    return htmlNode(doc, `<section class="hsk3-text-stage use-overview-stage"><div class="hsk3-stage-heading"><span>STEP 2 · OVERALL CHOICE</span><h3>整体选择</h3><p>只抓主题、发展和交际目的，不检查人物、时间、原因等细节。</p></div>${renderOverviewQuestions(interaction, showingResults)}<div class="use-text-actions">${status}${actions}</div></section>`);
  }

  function renderConfiguredDetailStage(doc, learning) {
    const questions = learning.detailQuestions || [];
    const cards = questions.map((item, index) => `<article><header><span>${index + 1}</span><div><b>${esc(item.questionCn)}</b><small>${esc(item.questionPinyin || '')}</small></div></header><details><summary>参考答案</summary><p>${esc(item.answer)}</p><small>${esc(item.answerPinyin || '')}</small>${item.acceptedAnswers && item.acceptedAnswers.length ? `<em>可接受：${esc(item.acceptedAnswers.join('；'))}</em>` : ''}</details></article>`).join('');
    return htmlNode(doc, `<section class="hsk3-text-stage use-detail-stage"><div class="hsk3-stage-heading"><span>STEP 3 · DETAIL Q&amp;A</span><h3>细节问答</h3><p>进入细节：逐题找出原因、变化、人物意图和课文证据，再看参考答案。</p></div><div class="use-detail-list">${cards}</div></section>`);
  }

  function renderIntegratedTextFlow(app, original, doc) {
    const learning = activeTextLearning(app);
    const phase = Math.max(0, Math.min(Number(app.hsk3TextPhase) || 0, 4));
    const inputMode = app.hsk3TextInputMode === 'read' ? 'read' : 'listen';
    const sourcePhase = phase === 0 ? (inputMode === 'read' ? 2 : 0) : phase === 1 ? 0 : phase === 2 ? 1 : phase === 3 ? 2 : 3;
    const panel = htmlNode(doc, nativeTextHtml(app, original, sourcePhase));
    if (!panel) return nativeTextHtml(app, original, sourcePhase);
    replaceTextTabs(doc, panel, phase);
    const oldStepControls = panel.querySelector('.teach-nav');
    if (oldStepControls) oldStepControls.remove();
    let stage = panel.querySelector('.hsk3-text-stage');
    if (!stage) return panel.outerHTML;

    if (phase === 0) {
      const heading = stage && stage.querySelector('.hsk3-stage-heading');
      if (inputMode === 'listen') {
        const preQuestions = stage.querySelector('.hsk3-grammar-oral');
        if (preQuestions) preQuestions.remove();
        const note = stage.querySelector(':scope > small');
        if (note) note.remove();
        if (heading) {
          const marker = heading.querySelector('span');
          const title = heading.querySelector('h3');
          const prompt = heading.querySelector('p');
          if (marker) marker.textContent = 'STEP 1 · LISTEN';
          if (title) title.textContent = '先听音频';
          if (prompt) prompt.textContent = '先听懂整体。';
        }
      } else {
        const teaching = stage.querySelector('.hsk3-text-teaching-grid');
        if (teaching) teaching.remove();
        if (heading) {
          const marker = heading.querySelector('span');
          const title = heading.querySelector('h3');
          const prompt = heading.querySelector('p');
          if (marker) marker.textContent = 'STEP 1 · READ';
          if (title) title.textContent = '先读课文';
          if (prompt) prompt.textContent = '先读懂整体。';
        }
      }
      const switcher = htmlNode(doc, `<div class="use-input-switch"><button class="${inputMode === 'listen' ? 'active' : ''}" onclick="ap.hsk3TextInputMode='listen';ap._r()">听音频</button><button class="${inputMode === 'read' ? 'active' : ''}" onclick="ap.hsk3TextInputMode='read';ap._r()">读课文</button></div>`);
      stage.insertBefore(switcher, stage.firstChild);
    } else if (phase === 1) {
      stage.replaceWith(renderOverallChoiceStage(doc));
    } else if (phase === 2) {
      if (learning.detailMode === 'config') stage.replaceWith(renderConfiguredDetailStage(doc, learning));
      else {
        const marker = stage.querySelector('.hsk3-stage-heading>span');
        if (marker) marker.textContent = marker.textContent.replace('STEP 2', 'STEP 3');
        const prompt = stage.querySelector('.hsk3-stage-heading>p');
        if (prompt) prompt.textContent = '进入细节：逐题找出人物、时间、原因和关键信息，再看参考答案。';
      }
    } else if (phase === 3) {
      const marker = stage.querySelector('.hsk3-stage-heading>span');
      if (marker) marker.textContent = 'STEP 4 · TEXT';
      const heading = stage.querySelector('.hsk3-stage-heading>h3');
      if (heading) heading.textContent = '展示课文';
      const prompt = stage.querySelector('.hsk3-stage-heading>p');
      if (prompt) prompt.textContent = '切换汉字、拼音或英文。';
    } else {
      const applyTab = Math.max(0, Math.min(Number(app.hsk3TextApplyTab) || 0, 2));
      if (applyTab === 1) {
        const retellPanel = htmlNode(doc, nativeTextHtml(app, original, 4));
        stage.replaceWith(retellPanel.querySelector('.hsk3-text-stage'));
      } else if (applyTab === 2) {
        stage.replaceWith(htmlNode(doc, `<section class="hsk3-text-stage use-paragraph-stage"><div class="hsk3-stage-heading"><span>STEP 5 · PARAGRAPH PRACTICE</span><h3>篇章练习</h3><p>${esc(learning.paragraphPractice.label)}</p></div><button class="use-text-action primary" onclick="parent.goTextParagraph()">进入练习</button></section>`));
      }
      const bridge = learning.grammarBridge ? htmlNode(doc, `<div class="use-language-bridge"><div><b>${esc(learning.grammarBridge.evidence)}</b><span>${esc(learning.grammarBridge.focus)}</span></div><button onclick="parent.goTextGrammar()">${esc(learning.grammarBridge.actionLabel)}</button></div>`) : null;
      const applyTabs = htmlNode(doc, `<div class="use-apply-tabs"><button class="${applyTab === 0 ? 'active' : ''}" onclick="ap.hsk3TextApplyTab=0;ap._r()">联系生活</button><button class="${applyTab === 1 ? 'active' : ''}" onclick="ap.hsk3TextApplyTab=1;ap._r()">表达</button><button class="${applyTab === 2 ? 'active' : ''}" onclick="ap.hsk3TextApplyTab=2;ap._r()">篇章练习</button></div>`);
      stage = panel.querySelector('.hsk3-text-stage');
      const marker = stage.querySelector('.hsk3-stage-heading>span');
      if (marker) marker.textContent = 'STEP 5 · LANGUAGE AND USE';
      if (bridge) panel.insertBefore(bridge, stage);
      panel.insertBefore(applyTabs, stage);
    }
    return panel.outerHTML;
  }

  function installIntegratedTextFlow(doc) {
    const frame = document.getElementById('classproFrame');
    const app = frame.contentWindow && frame.contentWindow.ap;
    const oldDock = doc.getElementById('useTextLearningDock');
    if (oldDock) oldDock.remove();
    if (!app || typeof app._tt !== 'function' || app.__useIntegratedTextFlow) return;
    const original = app._tt;
    app.__useIntegratedTextFlow = true;
    app.__useOriginalTextRenderer = original;
    app._tt = function () { return renderIntegratedTextFlow(app, original, doc); };
    if (app.mt === 'teach' && (app.st === 'tt' || app.st === 'ttq')) app._r();
  }

  function refreshIntegratedTextFlow() {
    const frame = document.getElementById('classproFrame');
    const app = frame && frame.contentWindow && frame.contentWindow.ap;
    if (app && app.__useIntegratedTextFlow && app.mt === 'teach' && (app.st === 'tt' || app.st === 'ttq')) app._r();
  }

  function vocabularyTierLabel(tier) {
    return tier === 'expression' ? '表达核心' : tier === 'understanding' ? '理解核心' : '情境辅助';
  }

  function vocabularyFocusPanel(app) {
    const vocabularyGroup = activeVocabularyGroup(app);
    if (!app.hsk3VocabSession || !vocabularyGroup) return '';
    const type = app.hsk3UseVocabType || 'recognition';
    const selected = Array.isArray(app.hsk3UseVocabWords) ? app.hsk3UseVocabWords : [];
    const available = vocabularyGroup.words.filter(word => vocabularyWordSupports(vocabularyGroup, word, type));
    const validSelected = selected.filter(id => available.some(word => word.id === id));
    app.hsk3UseVocabWords = validSelected;
    const current = state.interaction && state.interaction.responseType === 'vocab_focus' && state.interaction.groupId === vocabularyGroup.id ? state.interaction : null;
    const submitted = current ? records('attempt1', current.id).length : 0;
    const summary = current && current.currentAction === 'vocab_results' ? vocabularySummaryData(current) : null;
    const typeButtons = config.vocabularyTaskTypes.map(item => `<button class="${type === item.id ? 'active' : ''}" onclick="parent.setVocabularyFocusType('${item.id}')"><b>${esc(item.labelCn)}</b><small>${esc(item.labelEn)}</small></button>`).join('');
    const wordButtons = vocabularyGroup.words.map(word => {
      const enabled = vocabularyWordSupports(vocabularyGroup, word, type);
      return `<button class="use-vocab-word ${validSelected.includes(word.id) ? 'selected' : ''}" ${enabled ? `onclick="parent.toggleVocabularyFocusWord('${word.id}')"` : 'disabled'}><b>${esc(word.hanzi)}</b><span>${esc(word.pinyin)}</span><em>${vocabularyTierLabel(word.tier)}</em></button>`;
    }).join('');
    const preview = validSelected.length ? `<div class="use-vocab-preview"><b>本轮已选 ${validSelected.length} 个词</b><span>${validSelected.map(id => esc(vocabularyGroup.words.find(word => word.id === id).hanzi)).join('、')}</span></div>` : '<div class="use-vocab-preview muted">先选择题型，再选择需要巩固的词。</div>';
    const timing = current && !current.flags.closed ? countdownMarkup(current) : timerPicker('vocabularyFocus', 'useVocabularyMinutes', app.hsk3UseVocabMinutes, 'ap.hsk3UseVocabMinutes=Number(this.value)');
    let actions = '<button class="use-text-action primary" onclick="parent.publishVocabularyFocus()">发布给学生</button>';
    if (current && !current.flags.closed) {
      actions = `<span class="use-inline-status">已提交 ${submitted}/${ROSTER.length}</span>${current.currentAction !== 'vocab_results' && submitted ? '<button class="use-text-action primary" onclick="parent.publishVocabularyResults()">统一回流</button>' : ''}<button class="use-text-action" onclick="parent.closeInteraction()">结束</button>`;
    }
    if (current && current.flags.closed) actions = '<button class="use-text-action" onclick="parent.publishVocabularyFocus()">重新发布</button>';
    const result = summary ? `<div class="use-vocab-results">${current.items.map((item, index) => `<span>${index + 1}. ${esc(item.answer)} <b>${summary.items[index].correct == null ? `${summary.total}份·教师查看` : `${summary.items[index].correct}/${summary.total}`}</b></span>`).join('')}</div>` : '';
    return `<section class="use-vocab-focus"><div class="hsk3-stage-heading"><span>ACTIVE RECALL · 教师选题</span><h3>离开图片，再认、再选、再输入</h3><p>只发布教师确认的词和题型。</p></div><div class="use-vocab-types">${typeButtons}</div><div class="use-vocab-words">${wordButtons}</div>${preview}${timing}${result}<div class="use-text-actions">${actions}</div></section>`;
  }

  function installVocabularyFocus(doc) {
    const frame = document.getElementById('classproFrame');
    const app = frame.contentWindow && frame.contentWindow.ap;
    if (!app || typeof app._tv !== 'function' || app.__useVocabularyFocus) return;
    const original = app._tv;
    app.__useVocabularyFocus = true;
    app.__useOriginalVocabularyRenderer = original;
    app._tv = function () {
      const panel = htmlNode(doc, original.call(app));
      const focus = vocabularyFocusPanel(app);
      if (panel && focus) panel.appendChild(htmlNode(doc, focus));
      return panel ? panel.outerHTML : original.call(app);
    };
    if (app.mt === 'teach' && app.st === 'tv') app._r();
  }

  function refreshVocabularyFocus() {
    const frame = document.getElementById('classproFrame');
    const app = frame && frame.contentWindow && frame.contentWindow.ap;
    if (app && app.__useVocabularyFocus && app.mt === 'teach' && app.st === 'tv') app._r();
  }

  window.setVocabularyFocusType = function (type) {
    const app = document.getElementById('classproFrame').contentWindow.ap;
    if (!app) return;
    app.hsk3UseVocabType = type;
    app.hsk3UseVocabWords = [];
    app._r();
  };

  window.toggleVocabularyFocusWord = function (wordId) {
    const app = document.getElementById('classproFrame').contentWindow.ap;
    if (!app) return;
    const selected = new Set(Array.isArray(app.hsk3UseVocabWords) ? app.hsk3UseVocabWords : []);
    if (selected.has(wordId)) selected.delete(wordId);
    else if (selected.size < 4) selected.add(wordId);
    else return alert('一次最多选择4个词');
    app.hsk3UseVocabWords = Array.from(selected);
    app._r();
  };

  window.publishVocabularyFocus = function () {
    const app = document.getElementById('classproFrame').contentWindow.ap;
    const vocabularyGroup = activeVocabularyGroup(app);
    const type = app.hsk3UseVocabType || 'recognition';
    const selected = Array.isArray(app.hsk3UseVocabWords) ? app.hsk3UseVocabWords : [];
    const items = vocabularyFocusItems(vocabularyGroup, selected, type);
    if (!items.length) return alert('请先选择需要巩固的词');
    state.selectedGroupId = vocabularyGroup.id;
    createInteraction('vocab_focus', '完成老师刚刚选择的词汇巩固。', 'Complete the vocabulary task selected by your teacher.', {
      groupId: vocabularyGroup.id,
      responseType: 'vocab_focus',
      taskType: type,
      items,
      supportOptions: [],
      collectFeeling: false,
      timerSeconds: chosenTimerSeconds('vocabularyFocus', 'useVocabularyMinutes', document.getElementById('classproFrame').contentDocument)
    });
  };

  window.publishVocabularyResults = function () {
    lockFirst();
    updateInteraction('vocab_results', '统一回流词汇巩固结果');
  };

  function injectNativeUi() {
    const frame = document.getElementById('classproFrame');
    const doc = frame.contentDocument;
    if (!doc) return;
    const sidebar = doc.querySelector('.cp-sidebar');
    if (!doc.getElementById('usePilotStyles')) {
      const style = doc.createElement('style');
      style.id = 'usePilotStyles';
      style.textContent = '.home-cards{grid-template-columns:repeat(5,minmax(0,1fr))!important;max-width:1180px!important}.home-card.use{background:linear-gradient(145deg,#fff8e8,#eef8ef)!important;box-shadow:0 26px 70px rgba(242,123,66,.24)!important}.home-card.use .label{color:#176b51!important}.use-text-action,.use-input-switch button,.use-apply-tabs button{border:1px solid #d8e5dd;border-radius:11px;background:#fff;color:#315b49;padding:10px 15px;font-weight:900;cursor:pointer}.use-text-action.primary,.use-input-switch button.active,.use-apply-tabs button.active{border-color:#176b50;background:#176b50;color:#fff}.use-input-switch{display:flex;justify-content:center;gap:8px;margin-bottom:24px}.use-overview-stage,.use-detail-stage{min-height:auto!important}.use-overview-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px}.use-overview-list article{padding:16px;border:1px solid #dce8dd;border-radius:15px;background:#fbfdfb}.use-overview-list h4{display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:center;margin:0;color:#213b31;font-size:18px}.use-overview-list h4 span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#edf4ee;color:#3f7f32}.use-overview-list article>small{display:block;margin:7px 0 12px;color:#7b8b82}.use-overview-list article>div{display:grid;gap:7px}.use-overview-list p{display:grid;grid-template-columns:24px 1fr auto;gap:8px;align-items:center;margin:0;padding:9px 10px;border-radius:9px;background:#fff}.use-overview-list p>b{color:#2f6fd6}.use-overview-list p.correct{background:#eaf6ee;color:#176b50}.use-overview-list p em{font-style:normal;font-size:12px}.use-detail-list{display:grid;gap:10px;margin-top:20px}.use-detail-list article{padding:15px;border:1px solid #dce8dd;border-radius:14px;background:#fbfdfb}.use-detail-list header{display:grid;grid-template-columns:32px 1fr;gap:10px}.use-detail-list header>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#176b50;color:#fff;font-weight:900}.use-detail-list header b,.use-detail-list header small,.use-detail-list details small,.use-detail-list details em{display:block}.use-detail-list header b{font-size:20px;line-height:1.45}.use-detail-list header small,.use-detail-list details small,.use-detail-list details em{margin-top:4px;color:#718078}.use-detail-list details{margin:10px 0 0 42px}.use-detail-list summary{color:#176b50;font-weight:900;cursor:pointer}.use-detail-list details p{margin:9px 0 0;font-size:19px}.use-text-actions{display:flex;align-items:center;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:20px}.use-inline-status{color:#176b50;font-weight:900}.use-language-bridge{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;padding:12px 16px;border:1px solid #dce8dd;border-radius:14px;background:#f5faf7}.use-language-bridge div{display:flex;align-items:baseline;gap:12px}.use-language-bridge b{font-family:KaiTi,STKaiti,"Kaiti SC",serif;font-size:24px}.use-language-bridge span{color:#66766d}.use-language-bridge button{border:0;border-radius:10px;background:#176b50;color:#fff;padding:9px 13px;font-weight:900;cursor:pointer}.use-apply-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0}.use-paragraph-stage{display:grid;place-content:center;text-align:center;min-height:390px!important}.use-paragraph-stage .use-text-action{margin:24px auto 0}@media(max-width:1100px){.home-cards{grid-template-columns:repeat(3,minmax(0,1fr))!important;max-width:900px!important}.use-overview-list{grid-template-columns:1fr}}@media(max-width:700px){.home-cards{grid-template-columns:1fr!important}.use-language-bridge{align-items:flex-start;flex-direction:column}.use-language-bridge div{align-items:flex-start;flex-direction:column;gap:3px}.use-apply-tabs{grid-template-columns:1fr}}';
      style.textContent += '.use-vocab-focus{margin-top:24px;padding:22px;border:1px solid #d8e5dd;border-radius:20px;background:#fffdfa}.use-vocab-types{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:16px 0}.use-vocab-types button{padding:10px;border:1px solid #d8e5dd;border-radius:12px;background:#fff;color:#315b49;font-weight:900}.use-vocab-types button small{display:block;color:#7b8b82}.use-vocab-types button.active{background:#176b50;color:#fff}.use-vocab-types button.active small{color:#d7eee5}.use-vocab-words{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.use-vocab-word{display:grid;gap:2px;padding:12px;border:1px solid #d8e5dd;border-radius:12px;background:#fff;text-align:left;color:#173f34}.use-vocab-word b{font:900 23px/1.2 KaiTi,STKaiti,serif}.use-vocab-word span,.use-vocab-word em{font-size:11px;color:#7b8b82;font-style:normal}.use-vocab-word.selected{border-color:#176b50;background:#eaf6f0;box-shadow:inset 0 0 0 2px #176b50}.use-vocab-word:disabled{opacity:.35;cursor:not-allowed}.use-vocab-preview{display:flex;gap:12px;align-items:center;margin:14px 0;padding:12px 14px;border-radius:12px;background:#f4f8f5}.use-vocab-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}.use-vocab-results span{display:flex;justify-content:space-between;padding:10px;border-radius:10px;background:#edf8f1}@media(max-width:900px){.use-vocab-types,.use-vocab-words{grid-template-columns:repeat(2,minmax(0,1fr))}}';
      style.textContent += '.use-timer-picker,.use-countdown{display:flex;align-items:center;justify-content:center;gap:14px;margin:14px 0;padding:12px 15px;border:1px solid #d8e5dd;border-radius:13px;background:#f5faf7}.use-timer-picker span,.use-countdown span{font-weight:900;color:#315b49}.use-timer-picker small,.use-countdown small{display:block;color:#718078;font-weight:600}.use-timer-picker select{padding:8px 10px;border:1px solid #bcd4c6;border-radius:9px;background:#fff;color:#173f34;font-weight:900}.use-countdown b{font-size:25px;color:#176b50}.use-countdown em{font-size:12px;color:#b5482b;font-style:normal}.use-countdown.expired{border-color:#edb091;background:#fff5ee}.use-countdown.expired b{color:#b5482b}';
      doc.head.appendChild(style);
    }
    const oldRibbon = doc.getElementById('useGoalRibbon');
    if (oldRibbon) oldRibbon.remove();
    if (sidebar && !doc.getElementById('usePilotButton')) {
      const button = doc.createElement('button');
      button.id = 'usePilotButton';
      button.className = 'sb-btn';
      button.textContent = '用';
      button.title = '回到课堂主线';
      button.addEventListener('click', () => window.openUse());
      const logo = sidebar.querySelector('.cp-logo');
      logo.insertAdjacentElement('afterend', button);
      sidebar.querySelectorAll('.sb-btn:not(#usePilotButton)').forEach(nativeButton => nativeButton.addEventListener('click', () => hideUse()));
    }
    wireQrButtons(doc);
    const homeCards = doc.querySelector('.home-cards');
    if (homeCards && !doc.getElementById('usePilotHomeCard')) {
      const card = doc.createElement('div');
      card.id = 'usePilotHomeCard';
      card.className = 'home-card use';
      card.innerHTML = '<div class="emoji">🎯</div><div class="label">应用</div><div class="desc">起点 · 学习路径 · 终点</div>';
      card.addEventListener('click', () => window.openUse());
      homeCards.prepend(card);
    }
    installIntegratedTextFlow(doc);
    installVocabularyFocus(doc);
  }

  function wireQrButtons(doc) {
    const headerButton = Array.from(doc.querySelectorAll('button[title="学生扫码进入"]'));
    const sidebarButton = Array.from(doc.querySelectorAll('.sb-bottom')).filter(button => button.textContent.trim() === 'QR');
    headerButton.concat(sidebarButton).forEach(button => {
      if (button.dataset.useQrWired) return;
      button.dataset.useQrWired = '1';
      button.addEventListener('click', () => hideUse(), true);
    });
  }

  function hideUse() {
    document.getElementById('useLayer').classList.add('hidden');
    const doc = document.getElementById('classproFrame').contentDocument;
    if (doc) {
      const useButton = doc.getElementById('usePilotButton');
      if (useButton) useButton.classList.remove('active');
    }
  }

  window.openUse = function () {
    document.getElementById('useLayer').classList.remove('hidden');
    const doc = document.getElementById('classproFrame').contentDocument;
    if (doc) {
      doc.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
      const useButton = doc.getElementById('usePilotButton');
      if (useButton) useButton.classList.add('active');
    }
    render();
  };

  window.openUseHome = function () {
    state.selectedNode = 'home';
    save();
    render();
  };

  window.openUseGroup = function (groupId) {
    state.selectedGroupId = groupId;
    state.selectedNode = 'entry';
    save();
    render();
  };

  window.returnTeacherHome = function () {
    hideUse();
    const frameWindow = document.getElementById('classproFrame').contentWindow;
    if (frameWindow.ap && typeof frameWindow.ap.stb === 'function') frameWindow.ap.stb('home');
  };

  function openNativeResource(resource, prepare) {
    if (!resource) return;
    state.nativeRoute = resource.label;
    if (state.interaction) state.interaction.currentAction = 'waiting';
    addTrail('resource', `调用「${resource.label}」`, { groupId: state.selectedGroupId, route: resource, evidence: evidenceSnapshot() });
    state.controlRevision += 1;
    save(); publishControl();
    hideUse();
    const frameWindow = document.getElementById('classproFrame').contentWindow;
    if (frameWindow.ap && typeof frameWindow.ap.stb === 'function') {
      frameWindow.ap.stb(resource.module, resource.submodule);
      Object.keys(resource.routeState || {}).forEach(key => {
        const value = resource.routeState[key];
        frameWindow.ap[key] = Array.isArray(value) ? value.slice() : value;
      });
      if (prepare) prepare(frameWindow.ap);
      if (resource.submodule === 'ttq') { frameWindow.ap.st = 'ttq'; frameWindow.ap._r(); }
      else if (prepare) frameWindow.ap._r();
    }
    setTimeout(injectNativeUi, 100);
  }

  window.goResource = function (key) {
    const resource = group().linkedResources[key];
    openNativeResource(resource, app => {
      if (resource.vocabSession) {
        app.hsk3VocabSession = resource.vocabSession;
        app.vsi = 0;
        app.hsk3VocabWord = '';
      }
      if (Number.isInteger(resource.grammarIndex)) {
        app.sg = resource.grammarIndex;
        app.hsk3GrammarPhase = 0;
      }
      if (Number.isInteger(resource.textIndex)) {
        app.ti = resource.textIndex;
        app.hsk3TextPhase = 0;
        app.hsk3TextAnswer = false;
      }
    });
  };

  window.selectUseNode = function (node) {
    state.selectedNode = node;
    save(); render();
  };

  function createInteraction(stage, promptCn, promptEn, options) {
    const groupId = (options && options.groupId) || state.selectedGroupId || group().id;
    state.interaction = {
      id: uid(`${LESSON_CODE}_${groupId.toLowerCase()}_${stage}`),
      groupId,
      stage,
      prompt: { cn: promptCn, en: promptEn || '' },
      supportOptions: config.supportOptions,
      currentAction: 'collect',
      openedSupportCards: [],
      collectFeeling: stage === 'exit',
      startedAt: now(),
      flags: { acceptingFirst: true, firstLocked: false, revisionOpen: false, closed: false }
    };
    Object.assign(state.interaction, options || {});
    state.controlRevision += 1;
    const stageLabel = stage === 'entry' ? '起点' : stage === 'exit' ? '终点' : stage === 'text_overview' ? '课文整体理解' : stage === 'text_detail' ? '课文细节' : stage === 'text_life' ? '课文联系生活' : 'MINI';
    addTrail('interaction', `发起${stageLabel}任务`, { groupId, interactionId: state.interaction.id, prompt: promptCn });
    save(); publishControl(); render();
  }

  window.startUseTask = function (stage) {
    const task = group()[stage];
    createInteraction(stage, task.promptCn, task.promptEn, {
      contextCn: group().contextCn || '',
      contextEn: group().contextEn || '',
      requirements: stage === 'exit' ? (group().exitRequirements || []) : [],
      responseMode: stage === 'exit' ? (group().responseMode || 'text') : 'text',
      timerSeconds: chosenTimerSeconds('miniLoop', 'useMiniMinutes', document)
    });
  };

  window.startMiniTask = function () {
    const cn = document.getElementById('miniPromptCn').value.trim();
    const en = document.getElementById('miniPromptEn').value.trim();
    if (!cn) return alert('请先输入一个问题');
    createInteraction('checkpoint', cn, en, { timerSeconds: chosenTimerSeconds('miniLoop', 'miniTimerMinutes', document) });
  };

  window.startTextOverview = function () {
    const learning = activeTextLearning();
    state.selectedGroupId = learning.useGroupId;
    createInteraction('text_overview', '先独立判断课文的主题、发展和交际目的，不必回忆每个细节。', 'Identify the main idea, development, and communicative purpose. Do not focus on details yet.', {
      groupId: learning.useGroupId,
      responseType: 'choice_set',
      items: learning.overviewChoices,
      supportOptions: [],
      collectFeeling: false
    });
  };

  window.publishTextChoiceResults = function () {
    lockFirst();
    updateInteraction('choice_results', '统一回流课文整体理解结果');
  };

  window.goTextGrammar = function () {
    const learning = activeTextLearning();
    const resource = group(learning.useGroupId).linkedResources.grammar;
    if (!resource || !learning.grammarBridge) return;
    state.selectedGroupId = learning.useGroupId;
    openNativeResource(resource, app => { app.sg = learning.grammarBridge.grammarIndex; app.hsk3GrammarPhase = 0; });
  };

  window.goTextParagraph = function () {
    const learning = activeTextLearning();
    const practice = learning.paragraphPractice;
    state.selectedGroupId = learning.useGroupId;
    openNativeResource(practice, app => { app.r4pi = Number(practice.index) || 0; });
  };

  function updateInteraction(action, text) {
    if (!state.interaction) return;
    state.interaction.currentAction = action;
    state.controlRevision += 1;
    addTrail('interaction', text, { interactionId: state.interaction.id });
    save(); publishControl(); render();
  }

  function lockFirst() {
    if (!state.interaction) return;
    state.interaction.flags.acceptingFirst = false;
    state.interaction.flags.firstLocked = true;
  }

  window.openWall = function () { lockFirst(); updateInteraction('wall', '开放匿名答案回流'); };
  window.openSupport = function () {
    const cards = group(state.interaction && state.interaction.groupId).supportCards || [];
    const selectedCards = Array.from(document.querySelectorAll('input[name="supportCard"]:checked')).map(input => cards.find(card => card.id === input.value)).filter(Boolean);
    if (!selectedCards.length) return alert('请先选择要开放的提示');
    lockFirst();
    state.interaction.openedSupportCards = selectedCards;
    updateInteraction('support', '开放教师确认的支架');
  };
  window.openRevision = function () { lockFirst(); state.interaction.flags.revisionOpen = true; updateInteraction('revision', '开放再次表达'); };
  window.openCompare = function () { updateInteraction('compare', '展示表达前后对比'); };
  window.closeInteraction = function () { lockFirst(); state.interaction.flags.closed = true; updateInteraction('closed', '结束当前互动'); };

  function anonymousWall() {
    return records('attempt1').map((r, index) => ({ id: r.submissionId, label: `想法 ${String(index + 1).padStart(2, '0')}`, answer: r.answer }));
  }

  function renderWallBoard() {
    const wall = anonymousWall();
    return `<div class="wall-heading"><b>全班想法墙</b><span>${wall.length}/${ROSTER.length} · 按提交顺序匿名展示</span></div><div class="wall-grid">${Array.from({ length: ROSTER.length }, (_, index) => {
      const item = wall[index];
      if (item) return `<article class="wall-card"><b>${esc(item.label)}</b><p>${esc(item.answer)}</p></article>`;
      return `<article class="wall-card waiting"><b>想法 ${String(index + 1).padStart(2, '0')}</b><p>等待提交</p></article>`;
    }).join('')}</div>`;
  }

  function render() {
    if (!config) return;
    document.getElementById('roomLabel').textContent = `房间 ${ROOM}`;
    const homeMode = state.selectedNode === 'home';
    document.getElementById('goalTitle').textContent = homeMode ? '选择一个真实表达任务' : group().title;
    document.querySelector('.use-grid').classList.toggle('home-mode', homeMode);
    document.querySelector('.goal-strip').classList.toggle('home-mode', homeMode);
    document.querySelectorAll('.use-node').forEach(button => button.classList.toggle('active', button.dataset.node === state.selectedNode));
    document.querySelectorAll('.route-dots button').forEach((button, index) => button.classList.toggle('active', ['entry', 'journey', 'exit'][index] === state.selectedNode));
    renderStage();
    renderSidebars();
    injectNativeUi();
    refreshIntegratedTextFlow();
    refreshVocabularyFocus();
  }

  function cycleStatus(useGroup) {
    const entryCount = groupRecords('attempt1', 'entry', useGroup.id).length;
    const exitCount = groupRecords('attempt1', 'exit', useGroup.id).length;
    const pathCount = state.trail.filter(item => item.groupId === useGroup.id && item.type === 'resource').length;
    if (exitCount) return { label: '已完成终点', className: 'done', entryCount, exitCount, pathCount };
    if (entryCount || pathCount) return { label: '进行中', className: 'active', entryCount, exitCount, pathCount };
    return { label: '未开始', className: 'new', entryCount, exitCount, pathCount };
  }

  function renderUseHome(host) {
    host.innerHTML = `<span class="eyebrow">${esc(lessonLabel())} · FOUR MINI LOOPS</span><h1>从一篇课文，走完一次“起点—学习—终点”</h1><p class="en">四个任务可以独立开始和继续，教师按课堂需要选择，不固定顺序。</p><div class="loop-card-grid">${config.useGroups.map(useGroup => {
      const status = cycleStatus(useGroup);
      return `<article class="loop-card"><header><span>${esc(useGroup.icon)}</span><div><small>${esc(useGroup.label)}</small><h2>${esc(useGroup.title)}</h2></div><em class="${status.className}">${status.label}</em></header><div class="loop-prompt">${esc(useGroup.entry.promptCn)}</div><footer><span>起点 ${status.entryCount}</span><span>调用 ${status.pathCount}</span><span>终点 ${status.exitCount}</span><button onclick="openUseGroup('${esc(useGroup.id)}')">${status.className === 'new' ? '进入' : '继续'} →</button></footer></article>`;
    }).join('')}</div>`;
  }

  function renderStage() {
    const host = document.getElementById('useStage');
    if (state.selectedNode === 'home') {
      renderUseHome(host);
      return;
    }
    if (state.selectedNode === 'journey') {
      host.innerHTML = `<span class="eyebrow">ACTUAL LEARNING PATH</span><h1>${esc(group().label)}实际走过的学习路径</h1><p class="en">系统只记录教师实际调用的资源，不预设固定顺序。</p><div class="task-card"><h2>发起一次关键节点互动</h2><p class="en">只在需要观察学生独立思考时使用，不必附着在每道题上。</p><div class="mini-form"><textarea id="miniPromptCn" placeholder="写下这一轮真正需要全员独立思考的问题"></textarea><textarea id="miniPromptEn" placeholder="English note (optional)"></textarea>${timerPicker('miniLoop', 'miniTimerMinutes')}<button class="primary" onclick="startMiniTask()">发起 MINI 互动</button></div></div><div class="task-card"><h2>本轮已发生的路径</h2>${renderTrail(group().id)}</div>`;
      return;
    }
    const stage = state.selectedNode;
    const task = group()[stage];
    const interaction = state.interaction && state.interaction.stage === stage && state.interaction.groupId === group().id ? state.interaction : null;
    const visual = stage === 'entry'
      ? `<div class="cycle-hero"><span>${esc(group().icon)}</span><div><small>${esc(group().label)}</small><b>${esc(group().title)}</b><em>从自己的第一句话开始</em></div></div>`
      : '<div class="progress-hero"><div><span>课堂开始</span><b>我原来能怎么说？</b><small>START</small></div><strong>→</strong><div class="after"><span>现在</span><b>我的表达升级了吗？</b><small>NOW</small></div></div>';
    const context = group().contextCn ? `<div class="task-context"><b>医生的话</b><p>${esc(group().contextCn)}</p><small>${esc(group().contextEn || '')}</small></div>` : '';
    const requirements = stage === 'exit' && (group().exitRequirements || []).length ? `<div class="support-tags">${group().exitRequirements.map(item => `<span class="tag">${esc(item.label)}</span>`).join('')}</div>` : '';
    host.innerHTML = `<span class="eyebrow">${esc(task.labelEn)}</span><h1>${esc(stage === 'entry' ? '先说出你现在的想法' : '回到同一个任务，看见进步')}</h1><div class="lesson-goal-line"><span>共同目标</span><b>${esc(group().goal)}</b><small>${esc(group().goalEn)}</small></div>${visual}${context}<div class="task-card focus-task"><h2>${esc(stage === 'entry' ? '起点表达' : '终点表达')}</h2><div class="prompt">${esc(task.promptCn)}</div><p class="en">${esc(task.promptEn)}</p>${requirements}${interaction ? renderInteraction(interaction) : `${timerPicker('miniLoop', 'useMiniMinutes')}<button class="primary start-button" onclick="startUseTask('${stage}')">▶ 开始 / START</button>`}</div>`;
  }

  function renderInteraction(interaction) {
    const first = records('attempt1');
    const second = records('attempt2');
    if (interaction.flags.closed) return `<div class="waiting-route"><b>这一轮已经结束</b><p>如需重新收集，请选择时长后重新开始。</p>${timerPicker('miniLoop', 'useMiniMinutes')}<button class="primary start-button" onclick="startUseTask('${esc(interaction.stage)}')">▶ 重新开始 / START AGAIN</button></div>`;
    const canCompare = second.length || (interaction.stage === 'exit' && first.length);
    const supportAction = interaction.stage === 'exit' ? '' : '<button class="secondary" onclick="openSupport()">开放支架</button>';
    const actions = interaction.flags.closed || !first.length ? '' : `<div class="action-row"><button class="secondary" onclick="openWall()">匿名回流</button>${supportAction}<button class="secondary" onclick="openRevision()">再次表达</button>${canCompare ? '<button class="secondary" onclick="openCompare()">前后对比</button>' : ''}<button class="secondary" onclick="closeInteraction()">结束本轮</button></div>`;
    let current = '';
    if (interaction.currentAction === 'wall') current = renderWallBoard();
    if (interaction.currentAction === 'support') current = `<div class="support-picker">${interaction.openedSupportCards.map(card => `<article class="support-card"><b>${esc(card.labelCn)}</b><small>${esc(card.labelEn)}</small><p>${esc(card.contentCn)}</p><small>${esc(card.contentEn)}</small></article>`).join('')}</div>`;
    if (interaction.currentAction === 'compare') current = interaction.stage === 'exit' ? renderEntryExitComparisons(first, second) : renderCurrentComparisons(first, second);
    if (interaction.currentAction === 'waiting') current = '<div class="waiting-route"><b>已回到原课堂资源</b><p>完成讲解或练习后，再回到“用”决定下一步。</p></div>';
    const supportCards = group(interaction.groupId).supportCards || [];
    const supportPicker = first.length && interaction.stage !== 'exit' ? `<div class="support-picker">${supportCards.map(card => `<label><input type="checkbox" name="supportCard" value="${esc(card.id)}"><span><b>${esc(card.labelCn)}</b><small>${esc(card.labelEn)}</small></span></label>`).join('')}</div>` : '';
    return `${countdownMarkup(interaction)}${supportPicker}<p class="en">${first.length ? `已收到 ${first.length} 份独立表达${second.length ? `，${second.length} 份再次表达` : ''}。` : '任务已发布，等待学生独立表达。'}</p>${current}${actions}`;
  }

  function renderCurrentComparisons(first, second) {
    const after = new Map(second.map(r => [String(r.participantId || r.studentName).toLowerCase(), r]));
    return first.map(r => ({ before: r, after: after.get(String(r.participantId || r.studentName).toLowerCase()) })).filter(x => x.after).map(x => `<article class="compare-card"><div class="before">${esc(x.before.answer)}</div><b>→</b><div class="after">${esc(x.after.answer)}</div></article>`).join('') || '<div class="empty">等待再次表达。</div>';
  }

  function renderEntryExitComparisons(exitFirst, exitSecond) {
    const entry = new Map();
    state.records.filter(r => r.kind === 'attempt1' && r.stage === 'entry' && r.groupId === (state.interaction && state.interaction.groupId)).forEach(r => entry.set(String(r.participantId || r.studentName).toLowerCase(), r));
    const revised = new Map(exitSecond.map(r => [String(r.participantId || r.studentName).toLowerCase(), r]));
    return exitFirst.map(r => {
      const key = String(r.participantId || r.studentName).toLowerCase();
      return { before: entry.get(key), after: revised.get(key) || r };
    }).filter(row => row.before).map(row => `<article class="compare-card"><div class="before">${esc(row.before.answer)}</div><b>→</b><div class="after">${esc(row.after.answer)}</div></article>`).join('') || '<div class="empty">等待学生完成起点和终点表达。</div>';
  }

  function recordKey(record) { return String(record.participantId || record.studentName).toLowerCase(); }
  function observationMap(groupId) {
    if (!state.observations[groupId]) state.observations[groupId] = {};
    return state.observations[groupId];
  }
  window.toggleTeacherObservation = function (token) {
    const key = decodeURIComponent(token);
    const observed = observationMap(state.selectedGroupId);
    observed[key] = !observed[key];
    save(); renderSidebars();
  };
  function answerCard(record, supportLabels, feelingLabels) {
    const observedMode = state.interaction && state.interaction.stage === 'exit' && group().responseMode === 'teacherObservedWithTextOutline';
    const key = recordKey(record);
    const confirmed = !!observationMap(state.selectedGroupId)[key];
    const observation = observedMode ? `<button class="secondary" onclick="toggleTeacherObservation('${encodeURIComponent(key)}')">${confirmed ? '✓ 已确认口头表达' : '确认口头表达'}</button>` : '';
    return `<article class="answer-card"><header><b>${esc(record.studentName)}</b><small>${esc(record.elapsedSeconds || '--')}s</small></header><p>${esc(record.answer)}</p><div class="support-tags">${(record.supportIds || []).map(id => `<span class="tag">${esc(supportLabels[id] || id)}</span>`).join('')}${(record.feelingIds || []).map(id => `<span class="tag">${esc(feelingLabels[id] || id)}</span>`).join('')}</div>${observation}</article>`;
  }

  function renderSidebars() {
    if (!config) return;
    const first = records('attempt1');
    const supportLabels = Object.fromEntries(config.supportOptions.map(option => [option.id, `${option.labelCn} / ${option.labelEn}`]));
    const feelingLabels = Object.fromEntries(config.feelingOptions.map(option => [option.id, `${option.labelCn} / ${option.labelEn}`]));
    const entryCount = groupRecords('attempt1', 'entry').length;
    const exitCount = groupRecords('attempt1', 'exit').length;
    const pathCount = state.trail.filter(item => item.groupId === state.selectedGroupId && item.type === 'resource').length;
    const host = document.getElementById('evidence');
    host.innerHTML = `<span class="eyebrow">THREE CORE EVIDENCE</span><h2>本轮三份核心证据</h2><div class="metric-grid core-three"><div class="metric"><b>${entryCount}/${ROSTER.length}</b><span>起点表达</span></div><div class="metric"><b>${pathCount}</b><span>实际学习路径</span></div><div class="metric"><b>${exitCount}/${ROSTER.length}</b><span>终点表达</span></div></div>${first.length ? `<div class="answer-list">${first.map(r => answerCard(r, supportLabels, feelingLabels)).join('')}</div>` : '<div class="empty">当前互动尚未收到提交。</div>'}`;

    const decision = document.getElementById('teacherDecision');
    const resources = group().linkedResources || {};
    decision.innerHTML = `<span class="eyebrow">TEACHER DECISION</span><h2>根据证据，下一步去哪里？</h2>${resources.vocabulary ? '<button class="route-button" onclick="goResource(\'vocabulary\')">补充词汇</button>' : ''}${resources.grammar ? '<button class="route-button" onclick="goResource(\'grammar\')">进入语法</button>' : ''}${resources.text ? '<button class="route-button" onclick="goResource(\'text\')">回到课文</button>' : ''}${resources.practice ? '<button class="route-button" onclick="goResource(\'practice\')">调用练习</button>' : ''}<button class="secondary" onclick="selectUseNode('journey')">查看课堂路径</button>`;
    document.querySelectorAll('.native-links button').forEach(button => {
      const match = button.getAttribute('onclick').match(/goResource\('([^']+)'\)/);
      if (match) button.disabled = !resources[match[1]];
    });
  }

  function renderTrail(groupId) {
    const items = state.trail.filter(item => !groupId || item.groupId === groupId);
    return items.length ? `<div class="trail">${items.map(item => `<div class="trail-item"><time>${clock(item.at)}</time><p>${esc(item.text)}</p></div>`).join('')}</div>` : '<div class="empty">当教师发起任务或调用资源后，这里才会形成本轮路径。</div>';
  }

  window.openStudent = function () {
    window.open(unifiedStudentUrl(), '_blank');
  };

  function reportTime(value) {
    const date = new Date(value || Date.now());
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('zh-CN', { hour12: false });
  }

  function reportRecordMap(items) {
    const map = new Map();
    items.forEach(item => map.set(recordKey(item), item));
    return map;
  }

  function reportSignalText(record) {
    if (!record) return '—';
    const support = new Map((config.supportOptions || []).map(item => [item.id, item.labelCn]));
    const feelings = new Map((config.feelingOptions || []).map(item => [item.id, item.labelCn]));
    const labels = (record.supportIds || []).map(id => support.get(id) || id).concat((record.feelingIds || []).map(id => feelings.get(id) || id));
    return labels.length ? labels.join('；') : '—';
  }

  function visualReportHtml() {
    const generatedAt = now();
    const groupSections = config.useGroups.map(useGroup => {
      const entryRecords = groupRecords('attempt1', 'entry', useGroup.id);
      const exitRecords = groupRecords('attempt1', 'exit', useGroup.id);
      const exitRevisions = groupRecords('attempt2', 'exit', useGroup.id);
      const entry = reportRecordMap(entryRecords);
      const exit = reportRecordMap(exitRecords);
      exitRevisions.forEach(record => exit.set(recordKey(record), record));
      const keys = Array.from(new Set([...entry.keys(), ...exit.keys()]));
      const comparisons = keys.length ? keys.map(key => {
        const before = entry.get(key);
        const after = exit.get(key);
        const name = (after && after.studentName) || (before && before.studentName) || '未知学生';
        const status = before && after ? '完整' : before ? '缺少终点' : '缺少起点';
        const observation = (state.observations[useGroup.id] || {})[key] ? '已确认口头表达' : '';
        return `<tr><td>${esc(name)}</td><td>${before ? esc(before.answer) : '<span class="missing">尚未提交</span>'}</td><td>${after ? esc(after.answer) : '<span class="missing">尚未提交</span>'}</td><td>${esc(reportSignalText(after))}${observation ? `<small>${esc(observation)}</small>` : ''}</td><td><span class="status ${before && after ? 'complete' : 'incomplete'}">${status}</span></td></tr>`;
      }).join('') : '<tr><td colspan="5" class="empty">尚无起点或终点表达数据。</td></tr>';
      const trail = state.trail.filter(item => item.groupId === useGroup.id).slice().reverse();
      const trailRows = trail.length ? trail.map(item => `<li><time>${esc(reportTime(item.at))}</time><span>${esc(item.text)}</span></li>`).join('') : '<li class="empty">尚无课堂路径记录。</li>';
      const pathCount = trail.filter(item => item.type === 'resource').length;
      const matchedCount = keys.filter(key => entry.has(key) && exit.has(key)).length;
      return `<section class="loop"><header><div><span>${esc(useGroup.label)}</span><h2>${esc(useGroup.title)}</h2></div><div class="loop-metrics"><b>${entryRecords.length}<small>起点</small></b><b>${pathCount}<small>资源调用</small></b><b>${exitRecords.length}<small>终点</small></b><b>${matchedCount}<small>完整对比</small></b></div></header><h3>起点—终点表达对比</h3><div class="table-wrap"><table><thead><tr><th>学生</th><th>起点表达</th><th>终点表达</th><th>学习信号</th><th>状态</th></tr></thead><tbody>${comparisons}</tbody></table></div><h3>课堂实际路径</h3><ol class="timeline">${trailRows}</ol></section>`;
    }).join('');
    const otherRecords = state.records.filter(record => !['entry', 'exit'].includes(record.stage));
    const otherRows = otherRecords.length ? otherRecords.map(record => `<tr><td>${esc(group(record.groupId).label)}</td><td>${esc(record.stage || '互动')}</td><td>${esc(record.studentName || '—')}</td><td>${esc(record.answer || '—')}</td><td>${esc(record.elapsedSeconds || '—')}s</td><td>${esc(reportTime(record.submittedAt))}</td></tr>`).join('') : '<tr><td colspan="6" class="empty">尚无其他课堂互动提交。</td></tr>';
    const entryTotal = config.useGroups.reduce((sum, item) => sum + groupRecords('attempt1', 'entry', item.id).length, 0);
    const exitTotal = config.useGroups.reduce((sum, item) => sum + groupRecords('attempt1', 'exit', item.id).length, 0);
    const pathTotal = state.trail.filter(item => item.type === 'resource').length;
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(config.experiment.title)} · 课堂报告</title><style>:root{--ink:#173f34;--muted:#66776f;--green:#176b50;--soft:#eef8f2;--orange:#dd7138;--line:#d9e5de}*{box-sizing:border-box}body{margin:0;background:#f3f7f4;color:var(--ink);font:15px/1.6 "Segoe UI","Microsoft YaHei",sans-serif}.page{max-width:1180px;margin:0 auto;padding:32px}.hero,.loop,.other{margin-bottom:22px;padding:24px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 10px 28px rgba(34,86,68,.06)}.hero{background:linear-gradient(135deg,#173f34,#28795f);color:#fff}.hero-top,.loop>header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.hero h1{margin:4px 0;font-size:32px}.hero p{margin:4px 0;color:#d8eee5}.print{border:0;border-radius:11px;background:#fff;color:var(--green);padding:10px 15px;font-weight:800}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px}.summary div{padding:16px;border-radius:14px;background:rgba(255,255,255,.12)}.summary b,.summary span{display:block}.summary b{font-size:27px}.summary span{font-size:12px;color:#d8eee5}.loop>header span{color:var(--orange);font-weight:900}.loop h2{margin:2px 0;font-size:24px}.loop h3,.other h2{margin:22px 0 10px}.loop-metrics{display:grid;grid-template-columns:repeat(4,minmax(74px,1fr));gap:8px}.loop-metrics b{padding:10px;border-radius:12px;background:var(--soft);text-align:center;font-size:21px}.loop-metrics small{display:block;color:var(--muted);font-size:11px}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:11px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:#f5f9f6;font-size:12px}td small{display:block;color:var(--muted)}.status{display:inline-block;padding:3px 8px;border-radius:999px;font-size:12px;font-weight:800}.complete{background:#e5f5eb;color:#176b50}.incomplete{background:#fff0e7;color:#a64c27}.missing,.empty{color:#89968f}.timeline{margin:0;padding-left:24px}.timeline li{padding:7px 0 7px 8px}.timeline time{display:inline-block;min-width:160px;color:var(--muted);font-size:12px}.report-note{color:var(--muted);font-size:12px}@media(max-width:760px){.page{padding:12px}.hero-top,.loop>header{display:block}.summary{grid-template-columns:1fr}.loop-metrics{margin-top:14px;grid-template-columns:repeat(2,1fr)}}@media print{body{background:#fff}.page{max-width:none;padding:0}.hero,.loop,.other{box-shadow:none;break-inside:avoid}.print{display:none}}</style></head><body><main class="page"><section class="hero"><div class="hero-top"><div><small>CLASSPRO · 课堂学习证据报告</small><h1>${esc(config.experiment.title)}</h1><p>${esc(lessonLabel())} · 房间 ${esc(ROOM)} · 导出时间 ${esc(reportTime(generatedAt))}</p></div><button class="print" onclick="window.print()">打印 / 保存为 PDF</button></div><div class="summary"><div><b>${entryTotal}</b><span>起点表达提交</span></div><div><b>${pathTotal}</b><span>实际资源调用</span></div><div><b>${exitTotal}</b><span>终点表达提交</span></div></div></section>${groupSections}<section class="other"><h2>其他课堂互动记录</h2><div class="table-wrap"><table><thead><tr><th>MINI</th><th>互动类型</th><th>学生</th><th>提交内容</th><th>用时</th><th>提交时间</th></tr></thead><tbody>${otherRows}</tbody></table></div></section><p class="report-note">说明：起点与终点按同一 MINI 循环和同一学生身份匹配；本报告由教师端现有课堂数据生成，不会新增证据类型。</p></main></body></html>`;
  }

  window.exportVisualReport = function () {
    const blob = new Blob([visualReportHtml()], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${LESSON}-${ROOM}-class-report.html`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  window.exportTrail = function () {
    const blob = new Blob([JSON.stringify({ lesson: LESSON, experiment: EXPERIMENT, room: ROOM, trail: state.trail, records: state.records }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${LESSON}-${ROOM}-use-trail.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  fetch(CONFIG_URL).then(response => {
    if (!response.ok) throw new Error(`Config ${response.status}`);
    return response.json();
  }).then(data => {
    if (!data.experiment || data.experiment.sourceLesson !== LESSON || data.experiment.id !== EXPERIMENT) throw new Error('课程配置与当前入口不匹配');
    config = data;
    document.title = `${config.experiment.title} · ClassPro`;
    const subtitle = document.getElementById('useSubtitle');
    if (subtitle) subtitle.textContent = `${lessonLabel()} · ${config.useGroups.length}个表达 MINI 循环`;
    document.getElementById('roomLabel').textContent = `房间 ${ROOM}`;
    restore();
    setupFrame();
    render();
    connect();
  }).catch(error => {
    document.getElementById('useStage').innerHTML = `<div class="empty">加载失败：${esc(error.message)}</div>`;
    console.error(error);
  });
  setInterval(refreshAllCountdowns, 1000);
})();
