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
  const sectionLabels = {listening: '听力', reading: '阅读', writing: '书写'};
  const sections = Object.keys(sectionLabels);

  function selectedSet() { return el('set').value; }

  function refreshControls() {
    const open = control?.phase === 'open';
    const set = selectedSet();
    const guided = Array.isArray(control?.closedSections);
    const active = open && guided ? control.activeSection : null;
    const upcoming = open && guided ? sections[control.closedSections.length] : sections[0];
    el('set').disabled = Boolean(open || !el('set').options.length);
    el('open-room').textContent = '开放' + (sectionLabels[upcoming] || '答题');
    el('open-room').disabled = !connected || !set || busy || (open && (!guided || Boolean(active) || !upcoming));
    el('end-section').textContent = active ? '结束' + sectionLabels[active] : '结束当前部分';
    el('end-section').disabled = !connected || busy || !active;
    el('close-room').disabled = !connected || busy || !open;
    el('copy-room-link').disabled = !set || !auth;
    el('open-room-student').hidden = !set || !auth;
    if (set && auth) el('open-room-student').href = R.controlledLink(set, scope.classId, scope.room, auth.token);
    el('room-label').textContent = W.initialClass.name + ' · 房间 ' + scope.room;
    el('room-status').textContent = !connected ? '课堂连接未就绪' :
      !control ? '已连接 · 未开放' : !open ? '已收卷' : !guided ? '已开放作答' :
      active ? sectionLabels[active] + '作答中' : '讲评时段 · 等待开放' + sectionLabels[upcoming];
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
    let partial = 0;
    rosterRows.forEach(student => {
      const progress = reports.get(student.id);
      if (!student.testAccount && progress) {
        started++;
        if (progress.sections.length === 3) submitted++;
        else if (progress.sections.length) partial++;
      }
      const active = progress && now - progress.seen < 35000;
      const label = progress?.sections.length === 3 ? '已交齐' :
        progress?.sections.length ? '部分提交' : active ? '作答中' : progress ? '暂离' : '未开始';
      const row = node('div', null, 'room-roster-row');
      row.append(node('b', student.name + (student.testAccount ? ' · Test' : '')),
        node('span', progress ? progress.total + '/70题' : '—'), node('span', label));
      if (progress?.counts) {
        const {listening, reading, writing} = progress.counts;
        row.append(node('small', '听 ' + listening + '/30 · 读 ' + reading + '/30 · 写 ' + writing + '/10'));
      }
      if (progress?.sections.length) row.append(node('small', '已交：' + progress.sections.map(key => sectionLabels[key]).join('、')));
      list.append(row);
    });
    el('room-summary').textContent = '班级进度 · 已开始 ' + started + '/' + enrolled.length + ' · 已交齐 ' + submitted + ' · 部分提交 ' + partial;
    el('room-progress-list').replaceChildren(list);
  }

  async function restoreSubmitted(message) {
    try {
      const response = await W.getRecords('get_data', {lesson: message.set, classId: scope.classId, teacherId: scope.teacherId});
      if (control?.runId !== message.runId || response.status !== 'ok') return;
      const restored = new Map();
      for (const row of response.data || []) {
        const columns = row.__values || [];
        if (columns[4] !== 'mock_test') continue;
        let summary;
        try { summary = JSON.parse(columns[13]); } catch (_) { continue; }
        if (summary.runId !== message.runId || summary.identity?.classId !== scope.classId || !summary.identity.studentId) continue;
        const student = summary.identity.studentId;
        const group = summary.groupId || columns[17];
        if (!restored.has(student)) restored.set(student, new Map());
        const attempts = restored.get(student);
        if (!attempts.has(group)) attempts.set(group, {when: 0, counts: {}, total: 0, complete: false});
        const attempt = attempts.get(group);
        attempt.when = Math.max(attempt.when, Date.parse(columns[19] || columns[0]) || 0);
        if (sections.includes(summary.section)) attempt.counts[summary.section] = Number(summary.answered || 0);
        else {
          attempt.total = Number(summary.answered || 0);
          attempt.complete = true;
        }
      }
      for (const [student, attempts] of restored) {
        const latest = [...attempts.values()].sort((a, b) => b.when - a.when)[0];
        const entry = reports.get(student);
        const accepted = latest.complete ? sections : Object.keys(latest.counts);
        const counts = entry?.counts || (latest.complete ? null : {listening: 0, reading: 0, writing: 0, ...latest.counts});
        const total = latest.complete ? latest.total : Object.values(latest.counts).reduce((sum, count) => sum + count, 0);
        reports.set(student, {counts, total: Math.max(entry?.total || 0, total),
          sections: sections.filter(key => accepted.includes(key) || entry?.sections.includes(key)), seen: entry?.seen || Date.now()});
      }
      refreshProgress();
    } catch (_) {}
  }

  function accept(message) {
    if (control && message.changedAt < control.changedAt) return;
    const changed = control?.runId !== message.runId || control?.phase !== message.phase ||
      control?.closedSections?.length !== message.closedSections?.length;
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
      if (current?.sections.length === 3 && progress.submitted !== true) return;
      const counts = progress.counts;
      const valid = counts && ['listening','reading','writing'].every(key => Number.isInteger(counts[key]) && counts[key] >= 0 && counts[key] <= (key === 'writing' ? 10 : 30));
      const accepted = Array.isArray(progress.submittedSections) ? progress.submittedSections : progress.submitted ? sections : [];
      reports.set(progress.studentId, {total: progress.total, counts: valid ? counts : null,
        sections: sections.filter(key => accepted.includes(key) || current?.sections.includes(key)), seen: Date.now()});
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

  async function update(action) {
    if (busy || !connected) return;
    const open = control?.phase === 'open';
    const guided = Array.isArray(control?.closedSections);
    const active = control?.activeSection;
    const now = Date.now();
    let next;
    if (action === 'open') {
      if (!open) next = {set: selectedSet(), runId: R.id(), phase: 'open', activeSection: sections[0], closedSections: [], changedAt: now};
      else if (guided && !active && sections[control.closedSections.length]) {
        next = {...control, activeSection: sections[control.closedSections.length], changedAt: now};
      }
    } else if (action === 'end' && open && guided && active) {
      const closedSections = [...control.closedSections, active];
      next = {...control, activeSection: null, closedSections,
        phase: closedSections.length === 3 ? 'closed' : 'open', changedAt: now};
    } else if (action === 'close' && open) {
      if (!confirm('确认结束本场？正在作答的部分会收卷。')) return;
      next = {...control, phase: 'closed', changedAt: now};
      if (guided) {
        next.activeSection = null;
        next.closedSections = active ? [...control.closedSections, active] : control.closedSections;
      }
    }
    if (!next?.set) return;
    busy = true;
    refreshControls();
    try {
      await room.control(next);
      accept(next);
      if (!next.activeSection) document.querySelectorAll('#sections audio').forEach(audio => audio.pause());
      el('room-message').textContent = next.phase === 'closed' ? '本场已收卷。收到回执后即可查看各部分成绩。' :
        next.activeSection ? '已开放' + sectionLabels[next.activeSection] + '。' :
        '当前部分已收卷，可以先讲评，准备好后再开放下一部分。';
    } catch (_) {
      el('room-message').textContent = '课堂服务器尚未确认，请检查连接后重试。';
    } finally {
      busy = false;
      refreshControls();
    }
  }

  el('open-room').addEventListener('click', () => update('open'));
  el('end-section').addEventListener('click', () => update('end'));
  el('close-room').addEventListener('click', () => update('close'));
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
