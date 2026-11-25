(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {el, node} = W;
  const report = window.SpecialReports;
  let attemptRun = W.params.get('attemptRun') || '';
  const state = {sets: [], results: [], request: 0, opened: new Set(), saving: false};
  const time = new Intl.DateTimeFormat('zh-CN', {dateStyle: 'short', timeStyle: 'short'});
  const records = window.SpecialRecords;
  const {value, isGraded, readRows} = records;
  const sectionLabels = {listening: '听力', reading: '阅读', writing: '书写'};
  const sectionKeys = records.sections;

  function current() { return state.sets.find(set => set.id === el('set').value); }

  function sums(result) {
    return {
      auto: Object.values(result.summary.scores).reduce((sum, n) => sum + Number(n || 0), 0),
      autoMax: result.sections.reduce((sum, section) => sum + (section === 'writing' ? 5 : 30), 0),
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
      const saved = rows.find(row => value(row, 'attempt') === value(record, 'attempt') &&
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
    const writingSubmitted = result.sections.includes('writing');
    visible.append(node('summary', result.name + (result.test ? ' · Test' : '') + ' · 已提交 ' +
      result.sections.length + '/3部分 · ' + (totals.pending ? totals.auto + '/' + totals.autoMax + ' 客观分，待批 ' + totals.pending + '题' :
        (totals.auto + totals.manual) + '/' + (totals.autoMax + (writingSubmitted ? 10 : 0)) + '分')));
    const descriptions = sectionKeys.map(section => {
      const label = sectionLabels[section] + ' ';
      if (!result.sections.includes(section)) return label + '待提交';
      const score = result.summary.scores[section];
      return label + (section === 'writing' ? '补字 ' + score + '/5，造句已得 ' + totals.manual + '/10' : score + '/30');
    });
    visible.append(node('p', '最近提交 ' + whenText(result.when)), node('p', descriptions.join('　')),
      window.SpecialTeacherFeedback.profileButton({id: result.studentId, name: result.name}, el('class').value));
    const breakdown = node('details');
    breakdown.append(node('summary', '各部分正确率'), report.accuracy(report.analyse([result]).breakdown));
    visible.append(breakdown);
    const objective = node('details');
    objective.append(node('summary', '逐题作答与错题'));
    const list = node('ol', null, 'answer-grid');
    for (const q of questions.slice(0, 65)) {
      if (!result.sections.includes(report.sectionFor(q.number))) continue;
      const wrong = result.summary.wrong.includes(q.number);
      list.append(node('li', q.number + '. ' + (result.summary.answers[q.id] || '未答') +
        (wrong ? '（应为 ' + q.answer + '）' : ''), wrong ? 'incorrect' : ''));
    }
    objective.append(list);
    visible.append(objective);
    result.manual.forEach(item => visible.append(figure(item, result)));
    return visible;
  }

  function displayClassReport(results, testOnly) {
    const box = el('class-report');
    box.hidden = !results.length;
    if (!results.length) return;
    const scores = report.analyse(results);
    const wrong = node('details');
    wrong.append(node('summary', '错题排名 · 按答错人数从高到低'));
    if (scores.ranking.length) wrong.append(report.ranking(scores.ranking, number => {
      const url = new URL(el('preview-link').href);
      url.hash = 'question-' + number;
      const link = node('a', '第' + number + '题');
      link.href = url.href;
      return link;
    }));
    else wrong.append(node('p', '已判题目暂无错题。', 'help'));
    box.replaceChildren(node('h2', testOnly ? '测试账号统计' : '班级成绩'), node('p', '各部分按已提交的答卷统计。造句满分计为正确，待批改的造句暂不计入正确率。', 'help'),
      report.accuracy(scores.breakdown), wrong);
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
    if (attemptRun) url.searchParams.set('attemptRun', attemptRun);
    else url.searchParams.delete('attemptRun');
    el('clear-run').hidden = !attemptRun;
    history.replaceState({}, '', url);
    const preview = new URL('preview.html', url);
    preview.search = url.search;
    el('preview-link').href = preview.href;
    el('home-link').href = '../../teacher/index.html?' + window.ClassProContext.buildQuery({lesson: W.lesson,
      classId, room: scope.room, student: '', studentId: ''}) + (W.params.get('direct') === '1' ? '&direct=1' : '');
    W.notice('正在读取提交记录…');
    el('refresh').disabled = true;
    el('export').disabled = true;
    el('results').hidden = true;
    el('class-report').hidden = true;
    try {
      const [bank, rows, roster] = await Promise.all([
        W.json(W.asset(set.file)), prefetched || readRows(set.id, classId), W.setRoster(classId)
      ]);
      if (request !== state.request) return;
      const questions = [bank.listening, bank.reading, bank.writing].flatMap(section => section.items);
      state.results = records.collect(rows, questions, roster, classId, {runId: attemptRun});
      const classResults = state.results.filter(row => !row.test);
      displayClassReport(classResults.length ? classResults : state.results, !classResults.length);
      const count = classResults.length;
      const test = state.results.length - count;
      const cards = state.results.map(result => displayResult(result, questions));
      el('results').replaceChildren(...cards);
      el('results').hidden = false;
      el('export').disabled = !state.results.length;
      const complete = classResults.filter(row => row.sections.length === 3).length;
      W.notice((attemptRun ? '本场练习 · ' : '') + '已交齐 ' + complete + ' 人 · 部分提交 ' + (count - complete) + ' 人' +
        (test ? '，另有 ' + test + ' 条测试账号记录' : '') + '。');
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
      '造句已得10分', '已得分', '待批题数', '错题', '已提交部分',
      ...report.analyse([]).breakdown.map(part => part.name + '正确率'),
      ...Array.from({length: 70}, (_, i) => '第' + (i + 1) + '题')];
    const rows = state.results.map(result => {
      const totals = sums(result), summary = result.summary;
      const answers = new Map(Object.entries(summary.answers).map(([id, text]) => [Number(id.split('-').at(-1)), text]));
      return [el('class').selectedOptions[0].textContent, current().title, result.name, result.when, summary.answered,
        summary.scores.listening, summary.scores.reading, summary.scores.writing, totals.manual,
        totals.auto + totals.manual, totals.pending, summary.wrong.join(' '), result.sections.map(key => sectionLabels[key]).join('、'),
        ...report.analyse([result]).breakdown.map(part => report.percentage(part.correct, part.correct + part.wrong)),
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
  function allAttempts() { attemptRun = ''; loadResults(); }
  el('class').addEventListener('change', allAttempts);
  el('set').addEventListener('change', allAttempts);
  el('clear-run').addEventListener('click', allAttempts);
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
