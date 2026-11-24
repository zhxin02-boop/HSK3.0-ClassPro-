(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {el, node} = W;
  const skills = {listening: '听力', reading: '阅读', writing: '书写'};
  const state = {catalog: [], roster: [], test: null, student: null, draft: null, busy: false};
  let rosterRequest = 0;
  let persistenceError = false;
  const classroomMode = W.params.get('mode') === 'classroom';
  let classroom;
  let classroomReady = false;
  let control;
  let progressTimer;
  let practiceRun = '';

  function draftKey(classId, studentId, set, runId) {
    const keys = ['ClassProSpecialW1v1', classId, studentId, set];
    if (runId) keys.push(runId);
    return keys.join(':');
  }

  function cacheKey() {
    return draftKey(state.scope.classId, state.student.id, state.test.id, practiceRun);
  }

  function mayEnterRoom() {
    if (!classroomMode) return true;
    if (!classroomReady || !control) return false;
    if (control.phase === 'open') return true;
    try {
      return Boolean(localStorage.getItem(draftKey(el('class').value, el('student').value, control.set, control.runId)));
    } catch (_) { return false; }
  }

  function updateRoomLabel() {
    if (!classroomMode) return;
    el('classroom-state').textContent = !classroomReady ? '课堂连接未就绪，正在尝试连接。' :
      !control ? '请等待教师开放答题。' : control.phase === 'open' ? '教师已开放答题。听力录音由教师统一播放。' :
      '教师已收卷。已开始的答卷会提交，未确认时可查询或重试。';
    el('classroom-state').hidden = false;
  }

  function alignSet() {
    if (classroomMode && control && state.catalog.some(set => set.id === control.set)) el('set').value = control.set;
  }

  function isLiveOpen() {
    return !classroomMode || (control?.runId === practiceRun && control?.phase === 'open');
  }

  function submitIfClosed() {
    if (classroomMode && !isLiveOpen() && state.test && state.draft && !state.draft.sent) submitAttempt(true);
  }

  function publishProgress() {
    if (!classroomReady || !state.test || !state.draft) return;
    const counts = Object.fromEntries(Object.keys(skills).map(key => [key, state.test[key].items.filter(answered).length]));
    classroom.progress({studentId: state.student.id, set: state.test.id, runId: practiceRun, counts,
      total: Object.values(counts).reduce((total, count) => total + count, 0),
      submitted: state.draft.sent === true}).catch(() => {});
  }

  function loadDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(cacheKey()) || 'null');
      if (saved && saved.answers && typeof saved.answers === 'object') return saved;
    } catch (_) {}
    return {answers: {}, skill: 'listening'};
  }

  function saveDraft() {
    try {
      localStorage.setItem(cacheKey(), JSON.stringify(state.draft));
      persistenceError = false;
    } catch (_) {
      persistenceError = true;
      W.notice('此浏览器无法保存本机进度。请保持页面打开，完成后提交。', true);
    }
  }

  function checkEntry() {
    el('start').disabled = !state.catalog.length || !el('student').value || state.busy || !mayEnterRoom();
    el('start').textContent = state.busy ? '正在加载…' :
      classroomMode && control?.phase === 'closed' ? '查看提交状态' : '开始答题';
  }

  async function changeClass() {
    const classId = el('class').value;
    const requested = ++rosterRequest;
    const previous = el('student').value;
    W.choose(el('student'), [{id: '', label: '正在读取名单…'}], '');
    el('student').disabled = true;
    checkEntry();
    const rows = await W.setRoster(classId);
    if (requested !== rosterRequest) return;
    state.roster = rows;
    const remembered = W.context.classId === classId &&
      rows.find(item => item.id === W.context.studentId || item.name === W.context.student);
    W.choose(el('student'), [{id: '', label: '选择姓名'}, ...rows.map(item => ({
      id: item.id, label: item.name + (item.testAccount ? ' · Test' : '')
    }))], previous || remembered?.id || '');
    el('student').disabled = false;
    checkEntry();
  }

  function stopAudio(except) {
    document.querySelectorAll('#sections audio').forEach(audio => {
      if (audio !== except && !audio.paused) audio.pause();
    });
  }

  function selectSkill(key, focus = false) {
    if (!(key in skills)) key = 'listening';
    stopAudio();
    state.draft.skill = key;
    document.querySelectorAll('[data-panel]').forEach(div => { div.hidden = div.dataset.panel !== key; });
    document.querySelectorAll('[data-skill]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.skill === key));
    });
    if (focus) {
      saveDraft();
      document.querySelector('[data-panel="' + key + '"] h3').scrollIntoView({block: 'start'});
    }
  }

  function questionList() {
    return Object.keys(skills).flatMap(skill => state.test[skill].items);
  }

  function answered(q) { return Boolean(String(state.draft.answers[q.id] || '').trim()); }

  function updateProgress() {
    const count = questionList().filter(answered).length;
    el('progress').textContent = '已答 ' + count + ' / 70';
    for (const button of el('skills').children) {
      const key = button.dataset.skill;
      const items = state.test[key].items;
      button.textContent = skills[key] + ' ' + items.filter(answered).length + '/' + items.length;
    }
  }

  function renderPractice() {
    const panels = window.SpecialQuestions.render(state.test, state.draft.answers, {teacherAudio: classroomMode, onPlay: stopAudio});
    const buttons = [];
    Object.keys(skills).forEach(key => {
      const button = node('button', skills[key]);
      button.type = 'button';
      button.dataset.skill = key;
      button.addEventListener('click', () => selectSkill(key, true));
      buttons.push(button);
    });
    el('skills').replaceChildren(...buttons);
    el('sections').replaceChildren(...panels);
    el('practice-title').textContent = state.test.title;
    el('student-label').textContent = state.student.name;
    el('entry').hidden = true;
    el('receipt').hidden = true;
    el('practice').hidden = false;
    selectSkill(state.draft.skill);
    if (state.draft.bundle) {
      lockAnswers();
      W.notice('上一次提交尚未确认。请点「重试提交」查询并补交同一份答卷。', true);
    } else {
      el('submit').textContent = '提交练习';
    }
    updateProgress();
    el('practice-title').focus();
    if (classroomMode) {
      saveDraft();
      publishProgress();
    }
  }

  function lockAnswers() {
    stopAudio();
    el('sections').querySelectorAll('input, textarea').forEach(input => { input.disabled = true; });
    el('submit').textContent = '重试提交';
  }

  function toEntry() {
    if (state.busy) return;
    stopAudio();
    el('sections').replaceChildren();
    state.test = null;
    state.draft = null;
    alignSet();
    checkEntry();
    el('entry').hidden = false;
    el('practice').hidden = true;
    el('receipt').hidden = true;
    W.notice();
    el('set').focus();
  }

  function showReceipt() {
    stopAudio();
    el('practice').hidden = true;
    el('entry').hidden = true;
    el('receipt').hidden = false;
    const scores = state.draft.summary.scores;
    el('receipt-body').textContent = state.test.title + ' · ' + state.student.name +
      '。自动计分 ' + (scores.listening + scores.reading + scores.writing) + '/65。听力 ' + scores.listening +
      '/30，阅读 ' + scores.reading + '/30，补字 ' + scores.writing + '/5。看图造句由教师批改。';
    if (!persistenceError) W.notice();
    el('receipt-title').focus();
    if (classroomMode) publishProgress();
  }

  function sheetText(text) {
    return /^[=+\-@]/.test(text) ? "'" + text : text;
  }

  function bundleAnswers() {
    const scores = {listening: 0, reading: 0, writing: 0};
    const answers = {};
    const wrong = [];
    const manual = [];
    for (const skill of Object.keys(skills)) {
      for (const q of state.test[skill].items) {
        const value = String(state.draft.answers[q.id] || '').trim();
        if (value) answers[q.id] = value;
        if (q.type === 'pictureSentence') {
          manual.push({q, value});
        } else if (value.normalize('NFC') === q.answer) {
          scores[skill] += 1;
        } else {
          wrong.push(q.number);
        }
      }
    }
    const submittedAt = new Date().toISOString();
    const attemptId = state.test.id + '-' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
    const common = {action: 'mock_test_submit', recordType: 'mock_test', stage: 'mock_test',
      lesson: state.test.id, testId: state.test.id, ...state.scope, attemptId, sessionId: attemptId};
    const identity = {classId: state.scope.classId, studentId: state.scope.studentId};
    const summary = {answers, scores, wrong, answered: Object.keys(answers).length, identity};
    if (practiceRun) summary.runId = practiceRun;
    const score = Object.values(scores).reduce((sum, points) => sum + points, 0);
    const rows = [{...common, module: 'mock_test', questionId: state.test.id, score, total: 65,
      points: score, result: manual.some(item => item.value) ? 'pending_review' : 'submitted',
      weakPoints: wrong.length ? '错题：' + wrong.join('、') : '', answer: JSON.stringify(summary),
      submittedAt, questionText: state.test.title}];
    manual.forEach(({q, value}, index) => {
      const at = new Date(Date.parse(submittedAt) + index + 1).toISOString();
      rows.push({...common, module: 'subjective', questionId: q.id, score: 0, total: q.points,
        answer: sheetText(value), result: 'submitted', openEnded: value ? 'yes' : 'no', needsReview: Boolean(value),
        submittedAt: at, questionText: '看图造句（' + q.word + '）｜图片：' + W.asset(q.image) +
          '｜参考答案：' + q.reference + '｜评分标准：' + Object.entries(state.test.writingRubric).map(([s, text]) => s + '分 ' + text).join(' ')});
    });
    state.draft.summary = summary;
    state.draft.bundle = {...common, action: 'mock_test_submit_bundle', submittedAt, records: rows};
    saveDraft();
  }

  async function sendBundle(bundle) {
    const query = {lesson: bundle.lesson, student: bundle.studentName, attemptId: bundle.attemptId,
      classId: bundle.classId, teacherId: bundle.teacherId};
    for (let retry = 0; retry < 2; retry++) {
      try {
        await fetch(window.ClassProShared.GAS_URL, {method: 'POST', mode: 'no-cors',
          headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify(bundle),
          signal: W.timeout(18000)});
      } catch (_) {}
      try {
        const receipt = await W.getRecords('get_mock_attempt', query);
        if (receipt.status === 'ok' && receipt.complete && receipt.attemptId === bundle.attemptId) return;
      } catch (_) {}
    }
    throw new Error('No cloud receipt');
  }

  el('entry').addEventListener('submit', async event => {
    event.preventDefault();
    if (state.busy || !mayEnterRoom()) return;
    state.student = state.roster.find(item => item.id === el('student').value);
    const set = state.catalog.find(item => item.id === el('set').value);
    if (!state.student || !set) return;
    practiceRun = classroomMode ? control.runId : '';
    state.test = null;
    state.draft = null;
    state.busy = true;
    checkEntry();
    W.notice();
    try {
      state.scope = W.scopeFor(el('class').value, state.student);
      state.test = await W.json(W.asset(set.file));
      if (state.test.id !== set.id) throw new Error('Unexpected test data');
      state.draft = loadDraft();
      if (state.draft.sent) showReceipt();
      else renderPractice();
    } catch (_) {
      W.notice('题目加载失败，请检查网络后重试。', true);
    } finally {
      state.busy = false;
      checkEntry();
      submitIfClosed();
    }
  });

  el('answers').addEventListener('input', event => {
    const {name, value} = event.target;
    if (!name || state.draft.bundle || !isLiveOpen()) return;
    if (value) state.draft.answers[name] = value;
    else delete state.draft.answers[name];
    saveDraft();
    updateProgress();
    if (classroomMode) {
      clearTimeout(progressTimer);
      progressTimer = setTimeout(publishProgress, 500);
    }
  });

  async function submitAttempt(automatically) {
    if (state.busy || state.draft.sent) return;
    if (!state.draft.bundle) {
      const done = questionList().filter(answered).length;
      if (!automatically && !window.confirm(done < 70 ? '还有 ' + (70 - done) + ' 道题未答。确定提交吗？' : '确定提交这份练习吗？')) return;
      bundleAnswers();
      lockAnswers();
    }
    state.busy = true;
    el('submit').disabled = true;
    el('switch').disabled = true;
    W.notice('正在保存并等待服务器确认，请保持页面打开。');
    try {
      await sendBundle(state.draft.bundle);
      state.draft.sent = true;
      delete state.draft.bundle;
      saveDraft();
      showReceipt();
    } catch (_) {
      W.notice('服务器还未确认。答案已保留在当前页面，请检查网络后点「重试提交」。', true);
    } finally {
      state.busy = false;
      el('submit').disabled = false;
      el('switch').disabled = false;
      checkEntry();
    }
  }

  el('answers').addEventListener('submit', event => {
    event.preventDefault();
    submitAttempt(false);
  });

  el('class').addEventListener('change', changeClass);
  el('student').addEventListener('change', checkEntry);
  el('switch').addEventListener('click', toEntry);
  el('done').addEventListener('click', toEntry);
  el('home-link').href = '../../student/index.html?' + window.ClassProContext.buildQuery({lesson: W.lesson});
  W.choose(el('class'), W.classes.map(item => ({id: item.id, label: item.name})), W.initialClass?.id);
  if (W.initialClass) changeClass();
  if (classroomMode && W.initialClass) {
    el('class').disabled = true;
    el('set').disabled = true;
    el('switch').hidden = true;
    updateRoomLabel();
    const roomHandlers = {
      onStatus(value) {
        classroomReady = value;
        updateRoomLabel();
        checkEntry();
        if (value) publishProgress();
      },
      onControl(message) {
        if (control && message.changedAt < control.changedAt) return;
        control = message;
        alignSet();
        updateRoomLabel();
        checkEntry();
        submitIfClosed();
      },
    };
    window.SpecialRoom.studentAuth(W.params.get('invite')).then(auth => {
      classroom = window.SpecialRoom.connect(W.scopeFor(W.initialClass.id), {...roomHandlers, auth});
    }).catch(() => {
      el('classroom-state').textContent = '此课堂链接无效。请打开教师发出的本场作答链接。';
    });
    const heartbeat = setInterval(publishProgress, 12000);
    window.addEventListener('pagehide', event => {
      if (event.persisted) return;
      clearInterval(heartbeat);
      clearTimeout(progressTimer);
      classroom?.close();
    });
  }
  W.json(W.asset('catalog.json')).then(data => {
    state.catalog = data.sets;
    W.choose(el('set'), data.sets.map(set => ({id: set.id, label: set.title})), W.params.get('set'));
    alignSet();
    checkEntry();
  }).catch(() => W.notice('练习列表加载失败，请刷新重试。', true));
})();
