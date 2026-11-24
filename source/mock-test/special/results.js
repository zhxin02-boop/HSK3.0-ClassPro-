(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {el, node} = W;
  const state = {sets: [], results: [], request: 0, opened: new Set(), saving: false};
  const time = new Intl.DateTimeFormat('zh-CN', {dateStyle: 'short', timeStyle: 'short'});
  const columns = {
    time: [0, '提交时间'], student: [1, '姓名'], lesson: [2, '课程'], module: [4, '模块'],
    question: [5, '题号'], score: [6, '得分'], total: [7, '总分'],
    answer: [13, '学生作答'], status: [16, '批改状态'], attempt: [17, '课堂session'],
    submitted: [19, '原始提交时间'], classId: [22, '班级ID'], studentId: [23, '学生ID']
  };

  function value(row, field) {
    const [index, label] = columns[field];
    return row.__values?.[index] ?? row[label] ?? '';
  }

  function isGraded(row) { return /已批改|已归档|reviewed/i.test(value(row, 'status')); }

  function current() { return state.sets.find(set => set.id === el('set').value); }

  async function readRows(lesson, classId) {
    const {teacherId} = W.scopeFor(classId);
    const payload = await W.getRecords('get_data', {lesson, classId, teacherId});
    if (payload.status !== 'ok' || !Array.isArray(payload.data)) throw new Error('Invalid record response');
    return payload.data.filter(row => {
      const recordedClass = value(row, 'classId');
      return value(row, 'lesson') === lesson && value(row, 'attempt') &&
        (!recordedClass || recordedClass === classId);
    });
  }

  function legacyIdentity(name, classId, roster) {
    const student = roster.find(item => item.name === name);
    if (!student) return null;
    const elsewhere = W.classes.some(item => item.id !== classId &&
      window.ClassProClassCatalog.roster(item.id, W.lesson).some(row => row.name === name));
    return elsewhere ? null : {classId, studentId: student.id};
  }

  function collect(rows, questions, roster, classId) {
    const details = new Map();
    const latest = new Map();
    for (const row of rows) {
      const attempt = value(row, 'attempt');
      if (value(row, 'module') === 'subjective') {
        if (!details.has(attempt)) details.set(attempt, new Map());
        details.get(attempt).set(value(row, 'question'), row);
      } else if (value(row, 'module') === 'mock_test') {
        let summary;
        try { summary = JSON.parse(value(row, 'answer')); } catch (_) { continue; }
        if (!summary?.scores || !summary.answers || !Array.isArray(summary.wrong)) continue;
        const identity = value(row, 'classId')
          ? {classId: value(row, 'classId'), studentId: value(row, 'studentId') || summary.identity?.studentId}
          : summary.identity || legacyIdentity(value(row, 'student'), classId, roster);
        if (identity?.classId !== classId) continue;
        const studentId = identity.studentId || '';
        const key = studentId || value(row, 'student');
        const previous = latest.get(key);
        if (!previous || Date.parse(value(row, 'submitted')) > Date.parse(value(previous.row, 'submitted'))) {
          latest.set(key, {row, summary, studentId});
        }
      }
    }
    const results = [];
    for (const {row, summary, studentId} of latest.values()) {
      const attempt = value(row, 'attempt');
      const manual = questions.filter(q => q.type === 'pictureSentence').map(q => {
        const record = details.get(attempt)?.get(q.id);
        const response = summary.answers[q.id] || '';
        const graded = record && isGraded(record);
        return {q, record, value: response, points: graded ? Number(value(record, 'score')) : 0,
          pending: Boolean(response && !graded)};
      });
      const who = roster.find(student => student.id === studentId);
      results.push({name: value(row, 'student'), studentId, when: value(row, 'submitted'), attempt,
        summary, manual, test: who?.testAccount === true});
    }
    return results.sort((a, b) => Date.parse(b.when) - Date.parse(a.when));
  }

  function sums(result) {
    return {
      auto: Object.values(result.summary.scores).reduce((sum, n) => sum + Number(n), 0),
      manual: result.manual.reduce((sum, q) => sum + q.points, 0),
      pending: result.manual.filter(q => q.pending).length,
    };
  }

  function whenText(raw) {
    return Number.isNaN(Date.parse(raw)) ? '时间未记录' : time.format(new Date(raw));
  }

  async function grade(result, item, score, status, button) {
    const record = item.record;
    const set = current();
    const classId = el('class').value;
    if (!record || ![0, 1, 2].includes(score) || state.saving) return;
    const {teacherId} = W.scopeFor(classId);
    const payload = {action: 'save_score', lesson: set.id, classId, teacherId,
      studentName: result.name, studentId: result.studentId,
      timestamp: value(record, 'time'), originalSubmittedAt: value(record, 'submitted'), questionId: item.q.id,
      module: 'subjective', score, total: 2, result: score === 2 ? 'correct' : 'wrong'};
    state.saving = true;
    button.disabled = true;
    el('class').disabled = true;
    el('set').disabled = true;
    el('refresh').disabled = true;
    status.textContent = '正在保存并等待确认…';
    try {
      try {
        await fetch(window.ClassProShared.GAS_URL, {method: 'POST', mode: 'no-cors',
          headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify(payload),
          signal: W.timeout(18000)});
      } catch (_) {}
      const rows = await readRows(set.id, classId);
      const saved = rows.find(row => value(row, 'attempt') === result.attempt &&
        value(row, 'question') === item.q.id && isGraded(row) && Number(value(row, 'score')) === score);
      if (!saved) throw new Error('Grade not confirmed');
      await loadResults(rows);
      W.notice('第' + item.q.number + '题评分已保存。');
    } catch (_) {
      status.textContent = '服务器尚未确认，请重试。';
    } finally {
      state.saving = false;
      button.disabled = false;
      el('class').disabled = false;
      el('set').disabled = false;
      el('refresh').disabled = false;
    }
  }

  function figure(item, result) {
    const section = node('section', null, 'question');
    section.append(node('h3', '第' + item.q.number + '题 · ' + item.q.word));
    const image = node('img', null, 'question-photo');
    image.src = W.asset(item.q.image);
    image.alt = '第' + item.q.number + '题图片';
    image.loading = 'lazy';
    section.append(image, node('p', '学生作答 ' + (item.value || '未答')),
      node('p', '参考 ' + item.q.reference, 'help'));
    if (!item.value || !item.record) {
      section.append(node('p', item.value ? '等待造句记录同步' : '未答，0分', 'help'));
      return section;
    }
    const controls = node('div', null, 'actions');
    const score = node('select');
    score.setAttribute('aria-label', '第' + item.q.number + '题分数');
    W.choose(score, [{id: '', label: '选择分数'}, ...[0, 1, 2].map(n => ({id: String(n), label: n + '分'}))],
      item.pending ? '' : String(item.points));
    const status = node('span');
    status.setAttribute('role', 'status');
    const button = node('button', '保存评分');
    button.type = 'button';
    button.disabled = score.value === '';
    score.addEventListener('change', () => { button.disabled = score.value === ''; });
    button.addEventListener('click', () => grade(result, item, Number(score.value), status, button));
    controls.append(score, button, status);
    section.append(controls);
    return section;
  }

  function displayResult(result, questions) {
    const totals = sums(result);
    const visible = node('details', null, 'student-result');
    visible.open = state.opened.has(result.attempt);
    visible.addEventListener('toggle', () => {
      if (visible.open) state.opened.add(result.attempt);
      else state.opened.delete(result.attempt);
    });
    visible.append(node('summary', result.name + (result.test ? ' · Test' : '') + ' · ' +
      result.summary.answered + '/70题 · ' + (totals.pending ? totals.auto + '/65，待批 ' + totals.pending + '题' :
        (totals.auto + totals.manual) + '/75')));
    const {listening, reading, writing} = result.summary.scores;
    visible.append(node('p', '提交时间 ' + whenText(result.when)),
      node('p', '听力 ' + listening + '/30　阅读 ' + reading + '/30　补字 ' + writing + '/5　造句已得 ' + totals.manual + '/10'));
    const objective = node('details');
    objective.append(node('summary', '逐题作答与错题'));
    const list = node('ol', null, 'answer-grid');
    for (const q of questions.slice(0, 65)) {
      const wrong = result.summary.wrong.includes(q.number);
      list.append(node('li', q.number + '. ' + (result.summary.answers[q.id] || '未答') +
        (wrong ? '（应为 ' + q.answer + '）' : ''), wrong ? 'incorrect' : ''));
    }
    objective.append(list);
    visible.append(objective);
    result.manual.forEach(item => visible.append(figure(item, result)));
    return visible;
  }

  async function loadResults(prefetched) {
    const set = current();
    if (!set) return;
    const request = ++state.request;
    const classId = el('class').value;
    const scope = W.scopeFor(classId);
    const url = new URL(location.href);
    url.searchParams.set('classId', classId);
    url.searchParams.set('set', set.id);
    history.replaceState({}, '', url);
    el('home-link').href = '../../teacher/index.html?' + window.ClassProContext.buildQuery({lesson: W.lesson,
      classId, room: scope.room, student: '', studentId: ''}) + (W.params.get('direct') === '1' ? '&direct=1' : '');
    W.notice('正在读取提交记录…');
    el('refresh').disabled = true;
    el('export').disabled = true;
    el('results').hidden = true;
    try {
      const [bank, rows, roster] = await Promise.all([
        W.json(W.asset(set.file)), prefetched || readRows(set.id, classId), W.setRoster(classId)
      ]);
      if (request !== state.request) return;
      const questions = [bank.listening, bank.reading, bank.writing].flatMap(section => section.items);
      state.results = collect(rows, questions, roster, classId);
      const count = state.results.filter(row => !row.test).length;
      const test = state.results.length - count;
      const cards = state.results.map(result => displayResult(result, questions));
      el('results').replaceChildren(...cards);
      el('results').hidden = false;
      el('export').disabled = !state.results.length;
      W.notice('已提交 ' + count + ' 人' + (test ? '，另有 ' + test + ' 条测试账号记录' : '') + '。');
    } catch (_) {
      if (request === state.request) W.notice('暂时无法读取作答记录。请检查网络后点「刷新记录」。', true);
    } finally {
      if (request === state.request) el('refresh').disabled = false;
    }
  }

  function cell(value) {
    let raw = String(value ?? '');
    if (/^[=+\-@]/.test(raw)) raw = "'" + raw;
    return '"' + raw.replaceAll('"', '""') + '"';
  }

  function exportCsv() {
    const headers = ['班级', '练习', '姓名', '提交时间', '已答题数', '听力30分', '阅读30分', '补字5分',
      '造句已得10分', '已得75分', '待批题数', '错题', ...Array.from({length: 70}, (_, i) => '第' + (i + 1) + '题')];
    const rows = state.results.map(result => {
      const totals = sums(result), summary = result.summary;
      const answers = new Map(Object.entries(summary.answers).map(([id, text]) => [Number(id.split('-').at(-1)), text]));
      return [el('class').selectedOptions[0].textContent, current().title, result.name, result.when, summary.answered,
        summary.scores.listening, summary.scores.reading, summary.scores.writing, totals.manual,
        totals.auto + totals.manual, totals.pending, summary.wrong.join(' '),
        ...Array.from({length: 70}, (_, i) => answers.get(i + 1) || '')];
    });
    const csv = [headers, ...rows].map(row => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], {type: 'text/csv;charset=utf-8'}));
    const link = node('a');
    link.href = url;
    link.download = current().id + '-答题记录.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  W.choose(el('class'), W.classes.map(item => ({id: item.id, label: item.name})), W.initialClass?.id);
  W.json(W.asset('catalog.json')).then(data => {
    state.sets = data.sets;
    W.choose(el('set'), state.sets.map(set => ({id: set.id, label: set.title})), W.params.get('set'));
    el('share').disabled = false;
    loadResults();
  }).catch(() => W.notice('练习列表加载失败，请刷新重试。', true));
  el('class').addEventListener('change', () => loadResults());
  el('set').addEventListener('change', () => loadResults());
  el('refresh').addEventListener('click', () => loadResults());
  el('export').addEventListener('click', exportCsv);
  el('share').addEventListener('click', async () => {
    const link = W.setStudentLink(current().id, el('class').value);
    try {
      await navigator.clipboard.writeText(link);
      W.notice('学生作答链接已复制。');
    } catch (_) {
      window.prompt('复制学生作答链接', link);
    }
  });
})();
