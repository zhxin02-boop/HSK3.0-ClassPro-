(() => {
  'use strict';

  const W = window.SpecialWeek;
  const R = window.SpecialRoom;
  const {el, node} = W;
  if (!W.initialClass) return;
  const scope = W.scopeFor(W.initialClass.id);
  let control;
  let room;
  let auth;
  let connected = false;
  let busy = false;
  let roster = [];
  const reports = new Map();

  function selectedSet() { return el('set').value; }

  function refreshControls() {
    const open = control?.phase === 'open';
    const set = selectedSet();
    el('set').disabled = Boolean(open || !el('set').options.length);
    el('open-room').disabled = !connected || !set || busy || open;
    el('close-room').disabled = !connected || busy || !open;
    el('copy-room-link').disabled = !set || !auth;
    el('open-room-student').hidden = !set || !auth;
    if (set && auth) el('open-room-student').href = R.controlledLink(set, scope.classId, scope.room, auth.token);
    el('room-label').textContent = W.initialClass.name + ' · 房间 ' + scope.room;
    el('room-status').textContent = !connected ? '课堂连接未就绪' :
      !control ? '已连接 · 未开放' : open ? '已开放作答' : '已收卷';
    const records = new URL(el('records-link').href);
    if (set) records.searchParams.set('set', set);
    records.searchParams.set('classId', scope.classId);
    records.searchParams.set('room', scope.room);
    if (control?.set === set) records.searchParams.set('attemptRun', control.runId);
    else records.searchParams.delete('attemptRun');
    el('records-link').href = records.href;
  }

  function refreshProgress() {
    const now = Date.now();
    const enrolled = roster.filter(row => !row.testAccount);
    const rosterRows = roster.filter(row => !row.testAccount || reports.has(row.id));
    const list = node('div', null, 'room-roster');
    let started = 0;
    let submitted = 0;
    rosterRows.forEach(student => {
      const progress = reports.get(student.id);
      if (!student.testAccount && progress) {
        started++;
        if (progress.submitted) submitted++;
      }
      const active = progress && now - progress.seen < 35000;
      const label = progress?.submitted ? '已提交' : active ? '作答中' : progress ? '暂离' : '未开始';
      const row = node('div', null, 'room-roster-row');
      row.append(node('b', student.name + (student.testAccount ? ' · Test' : '')),
        node('span', progress ? progress.total + '/70题' : '—'), node('span', label));
      if (progress?.counts) {
        const {listening, reading, writing} = progress.counts;
        row.append(node('small', '听 ' + listening + '/30 · 读 ' + reading + '/30 · 写 ' + writing + '/10'));
      }
      list.append(row);
    });
    el('room-summary').textContent = '班级进度 · 已开始 ' + started + '/' + enrolled.length + ' · 已提交 ' + submitted;
    el('room-progress-list').replaceChildren(list);
  }

  async function restoreSubmitted(message) {
    try {
      const response = await W.getRecords('get_data', {lesson: message.set, classId: scope.classId, teacherId: scope.teacherId});
      if (control?.runId !== message.runId || response.status !== 'ok') return;
      for (const row of response.data || []) {
        const columns = row.__values || [];
        if (columns[4] !== 'mock_test') continue;
        let summary;
        try { summary = JSON.parse(columns[13]); } catch (_) { continue; }
        if (summary.runId !== message.runId || summary.identity?.classId !== scope.classId || !summary.identity.studentId) continue;
        const entry = reports.get(summary.identity.studentId);
        reports.set(summary.identity.studentId, {...entry, total:summary.answered, submitted:true, seen:Date.now()});
      }
      refreshProgress();
    } catch (_) {}
  }

  function accept(message) {
    if (control && message.changedAt < control.changedAt) return;
    const changed = control?.runId !== message.runId || control?.phase !== message.phase;
    if (control?.runId !== message.runId) reports.clear();
    control = message;
    if (changed) restoreSubmitted(message);
    if (control.phase === 'open' && selectedSet() && selectedSet() !== control.set) {
      el('set').value = control.set;
      el('set').dispatchEvent(new Event('change'));
    }
    refreshControls();
    refreshProgress();
  }

  const handlers = {
    teacher: true,
    onStatus(value) {
      connected = value;
      refreshControls();
      if (value && control) restoreSubmitted(control);
    },
    onControl: accept,
    onProgress(progress) {
      if (progress.runId !== control?.runId || progress.set !== control.set ||
          !Number.isInteger(progress.total) || progress.total < 0 || progress.total > 70) return;
      const current = reports.get(progress.studentId);
      if (current?.submitted && progress.submitted !== true) return;
      const counts = progress.counts;
      const valid = counts && ['listening','reading','writing'].every(key => Number.isInteger(counts[key]) && counts[key] >= 0 && counts[key] <= (key === 'writing' ? 10 : 30));
      reports.set(progress.studentId, {total: progress.total, counts: valid ? counts : null, submitted: progress.submitted === true, seen: Date.now()});
      refreshProgress();
    },
  };
  R.teacherAuth(scope).then(value => {
    auth = value;
    room = R.connect(scope, {...handlers, auth});
    refreshControls();
  }).catch(() => {
    el('room-message').textContent = '无法创建课堂连接。请用 ClassPro 的 HTTPS 页面重新打开。';
  });

  async function update(phase) {
    if (busy || !connected) return;
    const next = phase === 'open'
      ? {set: selectedSet(), runId: R.id(), phase, changedAt: Date.now()}
      : {...control, phase, changedAt: Date.now()};
    if (!next.set) return;
    if (phase === 'closed' && !confirm('确认收卷？已开始作答的学生会提交当前答案。')) return;
    busy = true;
    refreshControls();
    try {
      await room.control(next);
      accept(next);
      el('room-message').textContent = phase === 'open' ? '已开放。请发送本场学生链接。' : '已收卷。正在提交的答卷确认后会计入记录。';
    } catch (_) {
      el('room-message').textContent = '课堂服务器尚未确认，请检查连接后重试。';
    } finally {
      busy = false;
      refreshControls();
    }
  }

  el('open-room').addEventListener('click', () => update('open'));
  el('close-room').addEventListener('click', () => update('closed'));
  el('copy-room-link').addEventListener('click', async () => {
    const link = el('open-room-student').href;
    try {
      await navigator.clipboard.writeText(link);
      el('room-message').textContent = '本场学生链接已复制。';
    } catch (_) {
      prompt('复制本场学生作答链接', link);
    }
  });
  window.addEventListener('special-preview-set', () => {
    if (control?.phase === 'open' && selectedSet() !== control.set && el('set').options.length) {
      el('set').value = control.set;
      el('set').dispatchEvent(new Event('change'));
    }
    refreshControls();
  });
  W.setRoster(scope.classId).then(value => { roster = value; refreshProgress(); });
  const liveness = setInterval(refreshProgress, 10000);
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    clearInterval(liveness);
    room?.close();
  });
  refreshControls();
})();
