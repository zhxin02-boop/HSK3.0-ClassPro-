(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {el, node} = W;
  const Review = window.SpecialStudentReview;
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
  const closeQueued = new Set();
  let guided = false;
  let openReportOnEntry = W.params.get('report') === '1';

  function released() {
    return state.draft ? Review.releasedSections(state.draft, classroomMode) : [];
  }

  function syncReviewAccess() {
    if (!classroomMode || !state.draft || control?.runId !== practiceRun) return;
    const closed = control.reviewSections || control.closedSections ||
      (control.phase === 'closed' ? Object.keys(skills) : []);
    const available = [...new Set([...(state.draft.released || []), ...closed])];
    if (available.length !== (state.draft.released?.length || 0)) {
      state.draft.released = available;
      saveDraft();
    }
  }

  function openReview(skill) {
    const draft = state.draft;
    Review.showReview(state.test, draft, state.scope, skill, classroomMode, grades => {
      if (state.draft !== draft || !draft.submissions.writing) return;
      draft.submissions.writing.grades = grades;
      saveDraft();
    });
  }

  function selectedScope() {
    const student = state.roster.find(item => item.id === el('student').value);
    return student ? W.scopeFor(el('class').value, student) : null;
  }

  function openReport() {
    const scope = el('entry').hidden ? state.scope : selectedScope();
    if (scope) Review.showReport(scope);
  }

  function maybeOpenReport() {
    if (!openReportOnEntry || !state.catalog.length || !selectedScope()) return;
    openReportOnEntry = false;
    openReport();
  }

  function submittedSections() {
    return Object.keys(skills).filter(key => state.draft.sent || state.draft.submissions[key]?.sent);
  }

  function sectionAvailable(key) {
    return !guided || state.draft.opened.includes(key);
  }

  function canEdit(key) {
    return isLiveOpen() && (!guided || control.activeSection === key);
  }

  function sectionLocked(key) {
    const part = state.draft.submissions[key];
    return state.draft.sent || Boolean(state.draft.bundle || part?.sent || part?.bundle) || !canEdit(key);
  }

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
    const current = control?.activeSection;
    el('classroom-state').textContent = !classroomReady ? '课堂连接未就绪，正在尝试连接。' :
      !control ? '请等待教师开放答题。' : control.phase === 'closed' ? '本场已收卷。可查询或重试已开始部分的提交。' :
      current ? '教师已开放' + skills[current] + (current === 'listening' ? '。听力录音由教师统一播放。' : '。') :
      Array.isArray(control.closedSections) ? '正在讲评，请等待教师开放下一部分。' : '教师已开放答题。';
    el('classroom-state').hidden = false;
  }

  function alignSet() {
    if (classroomMode && control && state.catalog.some(set => set.id === control.set)) el('set').value = control.set;
  }

  function isLiveOpen() {
    return !classroomMode || (control?.runId === practiceRun && control?.phase === 'open');
  }

  function submitIfClosed() {
    if (!classroomMode || !state.test || !state.draft || state.busy) return;
    const sameRun = control?.runId === practiceRun;
    const closed = guided ? (sameRun ? control.closedSections : state.draft.opened) :
      isLiveOpen() ? [] : Object.keys(skills);
    const keys = closed.filter(key => sectionAvailable(key) && !submittedSections().includes(key) && !closeQueued.has(key));
    if (!keys.length) return;
    keys.forEach(key => closeQueued.add(key));
    submitAttempts(keys, true);
  }

  function publishProgress() {
    if (!classroomReady || !state.test || !state.draft) return;
    const counts = Object.fromEntries(Object.keys(skills).map(key => [key, state.test[key].items.filter(answered).length]));
    classroom.progress({studentId: state.student.id, set: state.test.id, runId: practiceRun, counts,
      total: Object.values(counts).reduce((total, count) => total + count, 0),
      submittedSections: submittedSections(), submitted: submittedSections().length === 3}).catch(() => {});
  }

  function loadDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(cacheKey()) || 'null');
      if (saved && saved.answers && typeof saved.answers === 'object') {
        return {...saved, groupId: saved.groupId || window.SpecialRoom.id(), submissions: saved.submissions || {},
          opened: Array.isArray(saved.opened) ? saved.opened : []};
      }
    } catch (_) {}
    return {answers: {}, skill: 'listening', groupId: window.SpecialRoom.id(), submissions: {}, opened: []};
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
    el('entry-report').disabled = !state.catalog.length || !el('student').value || state.busy;
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
    maybeOpenReport();
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
    document.querySelectorAll('[data-panel]').forEach(div => {
      div.hidden = div.dataset.panel !== key || !sectionAvailable(key);
    });
    const waiting = el('waiting-section');
    waiting.hidden = sectionAvailable(key);
    waiting.textContent = control?.closedSections?.includes(key) ? skills[key] + '已结束。' : '请等待教师开放' + skills[key] + '。';
    document.querySelectorAll('[data-skill]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.skill === key));
    });
    updateProgress();
    if (focus) {
      saveDraft();
      const heading = document.querySelector('[data-panel="' + key + '"] h3');
      if (sectionAvailable(key)) heading.scrollIntoView({block: 'start'});
    }
  }

  function answered(q) { return Boolean(String(state.draft.answers[q.id] || '').trim()); }

  function updateProgress() {
    const done = submittedSections();
    for (const button of el('skills').children) {
      const key = button.dataset.skill;
      const items = state.test[key].items;
      const waiting = control?.closedSections?.includes(key) ? '已结束' : '待开放';
      button.textContent = skills[key] + (done.includes(key) ? ' · 已提交' :
        sectionAvailable(key) ? ' ' + items.filter(answered).length + '/' + items.length : ' · ' + waiting);
    }
    for (const panel of el('sections').children) {
      const locked = sectionLocked(panel.dataset.panel);
      panel.querySelectorAll('input, textarea').forEach(input => { input.disabled = locked; });
    }
    const key = state.draft.skill;
    const items = state.test[key].items;
    const part = state.draft.submissions[key];
    const submitted = done.includes(key);
    const pending = Boolean(part?.bundle || state.draft.bundle);
    const score = part?.summary?.scores[key] ?? state.draft.summary?.scores?.[key];
    const canReview = released().includes(key);
    const receipt = canReview && score != null ? ' · ' + score + '/' + (key === 'writing' ? 5 : items.length) +
      (key === 'writing' ? ' 补字分' : '分') : '';
    const available = sectionAvailable(key);
    el('progress').textContent = available ? skills[key] + ' ' + items.filter(answered).length + '/' + items.length +
      (submitted ? ' · 已提交' + receipt : pending ? ' · 待确认' : '') : '';
    el('practice-report').disabled = state.busy;
    el('section-review').hidden = !canReview;
    el('section-review').textContent = skills[key] + '得分与错题';
    el('receipt-review').hidden = !released().length;
    const status = el('section-review-status');
    status.hidden = !submitted || canReview;
    status.textContent = '已提交，等待教师开放讲评。';
    el('submit').textContent = submitted ? skills[key] + '已提交' : pending ? '重试提交' + skills[key] : '提交' + skills[key];
    el('submit').hidden = !available;
    el('submit').disabled = submitted || state.busy;
    el('switch').disabled = state.busy;
  }

  function rememberOpenSection() {
    if (!guided || !isLiveOpen() || !control.activeSection) return null;
    const key = control.activeSection;
    if (!state.draft.opened.includes(key)) state.draft.opened.push(key);
    return key;
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
    const active = rememberOpenSection();
    selectSkill(active || state.draft.skill);
    el('practice-title').focus();
    saveDraft();
    if (classroomMode) publishProgress();
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
    el('receipt-body').textContent = state.test.title + ' · ' + state.student.name + '。' +
      (released().length === 3 ? '可查看分段得分与错题。' : '教师开放讲评后即可查看本部分得分与错题。');
    el('receipt-review').hidden = !released().length;
    el('retry').hidden = classroomMode;
    if (!persistenceError) W.notice();
    el('receipt-title').focus();
    if (classroomMode) publishProgress();
  }

  function sheetText(text) {
    return /^[=+\-@]/.test(text) ? "'" + text : text;
  }

  function bundleAnswers(skill) {
    const scores = {listening: 0, reading: 0, writing: 0};
    const answers = {};
    const wrong = [];
    const manual = [];
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
    const submittedAt = new Date().toISOString();
    const attemptId = [state.test.id, state.draft.groupId, skill].join('-');
    const common = {action: 'mock_test_submit', recordType: 'mock_test', stage: 'mock_test',
      lesson: state.test.id, testId: state.test.id, ...state.scope, attemptId, sessionId: attemptId};
    const identity = {classId: state.scope.classId, studentId: state.scope.studentId};
    const summary = {answers, scores, wrong, answered: Object.keys(answers).length, identity,
      groupId: state.draft.groupId, section: skill};
    if (practiceRun) summary.runId = practiceRun;
    const score = scores[skill];
    const rows = [{...common, module: 'mock_test', questionId: state.test.id, score, total: skill === 'writing' ? 5 : 30,
      points: score, result: manual.some(item => item.value) ? 'pending_review' : 'submitted',
      weakPoints: wrong.length ? '错题：' + wrong.join('、') : '', answer: JSON.stringify(summary),
      submittedAt, questionText: state.test.title + ' · ' + skills[skill]}];
    manual.forEach(({q, value}, index) => {
      const at = new Date(Date.parse(submittedAt) + index + 1).toISOString();
      rows.push({...common, module: 'subjective', questionId: q.id, score: 0, total: q.points,
        answer: sheetText(value), result: 'submitted', openEnded: value ? 'yes' : 'no', needsReview: Boolean(value),
        submittedAt: at, questionText: '看图造句（' + q.word + '）｜图片：' + W.asset(q.image) +
          '｜参考答案：' + q.reference + '｜评分标准：' + Object.entries(state.test.writingRubric).map(([s, text]) => s + '分 ' + text).join(' ')});
    });
    state.draft.submissions[skill] = {summary, attemptId, submittedAt, bundle: {...common, action: 'mock_test_submit_bundle', submittedAt, records: rows}};
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
        const expected = bundle.records.length;
        const confirmed = expected === 1 ? receipt.count === 1 && receipt.main === 1 : receipt.complete === true;
        if (receipt.status === 'ok' && confirmed && receipt.attemptId === bundle.attemptId) return;
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
    closeQueued.clear();
    guided = classroomMode && Array.isArray(control?.closedSections);
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
      syncReviewAccess();
      if (submittedSections().length === 3) showReceipt();
      else renderPractice();
    } catch (_) {
      W.notice('题目加载失败，请检查网络后重试。', true);
    } finally {
      state.busy = false;
      if (state.test && state.draft && !el('practice').hidden) updateProgress();
      checkEntry();
      submitIfClosed();
    }
  });

  el('answers').addEventListener('input', event => {
    const {name, value} = event.target;
    const key = event.target.closest('[data-panel]')?.dataset.panel;
    if (!name || !key || sectionLocked(key)) return;
    if (value) state.draft.answers[name] = value;
    else delete state.draft.answers[name];
    saveDraft();
    updateProgress();
    if (classroomMode) {
      clearTimeout(progressTimer);
      progressTimer = setTimeout(publishProgress, 500);
    }
  });

  async function submitAttempts(requested, automatic) {
    if (state.busy || !state.draft || submittedSections().length === 3) return;
    const keys = requested.filter(key => !submittedSections().includes(key));
    if (!keys.length) return;
    const selected = keys[0];
    if (!automatic && !state.draft.bundle && !state.draft.submissions[selected]?.bundle) {
      const missing = state.test[selected].items.filter(q => !answered(q)).length;
      const message = '提交后将锁定' + skills[selected] + '。';
      if (!window.confirm((missing ? '这部分还有 ' + missing + ' 道题未答。' : '') + message + '确定提交吗？')) return;
    }
    state.busy = true;
    stopAudio();
    const failures = [];
    if (!state.draft.bundle) {
      for (const key of keys) if (!state.draft.submissions[key]?.bundle) bundleAnswers(key);
    }
    updateProgress();
    W.notice('正在保存答卷，请保持页面打开。');
    try {
      if (state.draft.bundle) {
        try {
          await sendBundle(state.draft.bundle);
          state.draft.sent = true;
          state.draft.submittedAt = state.draft.bundle.submittedAt;
          delete state.draft.bundle;
          saveDraft();
        } catch (_) {
          failures.push('整套旧答卷');
        }
      } else {
        for (const key of keys) {
          const part = state.draft.submissions[key];
          try {
            await sendBundle(part.bundle);
            part.sent = true;
            delete part.bundle;
            saveDraft();
            updateProgress();
            if (classroomMode) publishProgress();
          } catch (_) {
            failures.push(skills[key]);
          }
        }
      }
      if (submittedSections().length === 3) showReceipt();
      else if (failures.length) W.notice(failures.join('、') + '尚未收到回执，请切到相应部分重试。', true);
      else if (!persistenceError) W.notice(skills[selected] + '已提交，可以继续完成其他部分。');
    } finally {
      state.busy = false;
      updateProgress();
      checkEntry();
      submitIfClosed();
    }
  }

  el('answers').addEventListener('submit', event => {
    event.preventDefault();
    const skill = state.draft.skill;
    if (sectionAvailable(skill)) submitAttempts([skill], false);
  });

  el('class').addEventListener('change', changeClass);
  el('student').addEventListener('change', () => { checkEntry(); maybeOpenReport(); });
  for (const id of ['entry-report', 'practice-report', 'receipt-report']) el(id).addEventListener('click', openReport);
  el('section-review').addEventListener('click', () => openReview(state.draft.skill));
  el('receipt-review').addEventListener('click', () => openReview());
  el('retry').addEventListener('click', () => {
    if (classroomMode || state.busy || submittedSections().length !== 3) return;
    try {
      localStorage.setItem(cacheKey() + ':past:' + state.draft.groupId, JSON.stringify(state.draft));
      localStorage.removeItem(cacheKey());
    } catch (_) {
      W.notice('旧成绩还未保存，暂时无法开始重练。', true);
      return;
    }
    state.draft = loadDraft();
    renderPractice();
  });
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
        const previous = control;
        control = message;
        syncReviewAccess();
        alignSet();
        updateRoomLabel();
        checkEntry();
        if (state.test && state.draft && !el('practice').hidden) {
          const active = rememberOpenSection();
          if (active && previous?.activeSection !== active) {
            selectSkill(active);
            saveDraft();
          } else updateProgress();
        } else if (state.test && state.draft && !el('receipt').hidden) {
          el('receipt-review').hidden = !released().length;
          if (released().length === 3) el('receipt-body').textContent = state.test.title + ' · ' + state.student.name + '。可查看分段得分与错题。';
        }
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
  W.loadCatalog().then(data => {
    state.catalog = data.sets;
    W.choose(el('set'), data.sets.map(set => ({id: set.id, label: set.title})), W.params.get('set'));
    alignSet();
    checkEntry();
    maybeOpenReport();
  }).catch(() => W.notice('练习列表加载失败，请刷新重试。', true));
})();
