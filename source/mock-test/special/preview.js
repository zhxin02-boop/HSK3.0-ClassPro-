(() => {
  'use strict';

  const W = window.SpecialWeek;
  const R = window.SpecialRecords;
  const report = window.SpecialReports;
  const {el, node} = W;
  const classId = W.initialClass?.id;
  let sets = [];
  let skill = 'listening';
  let request = 0;
  let reportRequest = 0;
  let bank;
  let classroom;
  let stats;
  const roster = classId ? W.setRoster(classId) : Promise.resolve([]);
  const linkedRun = W.params.get('attemptRun');
  const linkedSet = W.params.get('set');

  function stopAudio(except) {
    el('sections').querySelectorAll('audio').forEach(audio => {
      if (audio !== except && !audio.paused) audio.pause();
    });
  }

  function showSkill(next) {
    skill = next;
    stopAudio();
    for (const panel of el('sections').children) panel.hidden = panel.dataset.panel !== skill;
    for (const button of el('skills').children) button.setAttribute('aria-pressed', String(button.dataset.skill === skill));
    decorate();
  }

  function jump(number, reveal = false) {
    if (reveal) {
      el('show-answers').checked = true;
      el('sections').classList.add('show-answers');
      if (number <= 30 && !el('show-transcripts').disabled) {
        el('show-transcripts').checked = true;
        el('sections').classList.add('show-transcripts');
      }
    }
    showSkill(R.sectionFor(number));
    const element = el('sections').querySelector('[data-question="' + number + '"]');
    if (!element) return;
    element.classList.add('question-target');
    element.tabIndex = -1;
    element.focus({preventScroll: true});
    element.scrollIntoView({block: 'center'});
    setTimeout(() => element.classList.remove('question-target'), 1800);
  }

  function drawStatus(positions, sample, coverage, results) {
    const banner = el('teaching-cues');
    banner.hidden = false;
    const intro = node('strong', positions.length ? '建议讲解' :
      sample ? '本部分已判题目暂无错题' : '本部分正在等待已判分记录');
    const chips = node('div', null, 'actions');
    if (positions.length) {
      for (const item of positions) {
        const button = node('button', '第' + item.number + '题 · ' + item.wrong + '人答错', 'secondary');
        button.type = 'button';
        button.addEventListener('click', () => jump(item.number, true));
        chips.append(button);
      }
    }
    banner.replaceChildren(intro, chips);
    const ranked = new Set(positions.map(item => item.number));
    const panel = el('sections').querySelector('[data-panel="' + skill + '"]');
    const known = new Map(R.questions(bank).map(q => [q.number, q]));
    for (const field of panel.querySelectorAll('[data-question]')) {
      const question = Number(field.dataset.question);
      const stat = coverage[question - 1];
      if (!stat.wrong && !stat.correct) continue;
      field.classList.toggle('teach-priority', ranked.has(question));
      const text = (ranked.has(question) ? '建议讲解 · ' : '') + stat.wrong + '人答错 / ' +
        (stat.wrong + stat.correct) + '人已判分';
      const tag = node('p', text, 'question-stat');
      const q = known.get(question);
      if (q.number <= 60 && stat.wrong) {
        const wrongOptions = new Map();
        for (const result of results) {
          if (!result.summary.wrong.includes(q.number)) continue;
          const option = result.summary.answers[q.id];
          if (option) wrongOptions.set(option, (wrongOptions.get(option) || 0) + 1);
        }
        const first = [...wrongOptions].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
        if (first) tag.append(node('span', ' · 最常误选 ' + first[0] + '（' + first[1] + '人）'));
      }
      field.querySelector('legend').insertAdjacentElement('afterend', tag);
    }
  }

  function decorate() {
    const banner = el('teaching-cues');
    banner.hidden = true;
    for (const field of el('sections').querySelectorAll('.teach-priority')) field.classList.remove('teach-priority');
    for (const element of el('sections').querySelectorAll('.question-stat')) element.remove();
    if (!stats?.visible.includes(skill)) return;
    if (stats.failed) {
      banner.hidden = false;
      banner.replaceChildren(node('span', '暂未读取到讲解统计，可稍后刷新作答记录。'));
      return;
    }
    const ranked = stats.coverage.ranking.filter(q => R.sectionFor(q.number) === skill).slice(0, 3);
    const scored = stats.coverage.questions.some(q => R.sectionFor(q.number) === skill && (q.wrong || q.correct));
    drawStatus(ranked, scored, stats.coverage.questions, stats.results);
  }

  function reviewScope() {
    if (classroom?.runId !== linkedRun && linkedSet === bank.id && linkedRun) {
      return {runId: linkedRun, visible: R.sections};
    }
    if (classroom?.set === bank.id) {
      return {runId: classroom.runId, visible: classroom.closedSections ||
        (classroom.phase === 'closed' ? R.sections : [])};
    }
    return {runId: '', visible: R.sections};
  }

  let pending;
  async function refreshHighlights() {
    if (!classId || !bank || document.hidden) return;
    const currentBank = bank;
    const {runId, visible} = reviewScope();
    const scope = JSON.stringify([currentBank.id, runId, visible]);
    if (pending === scope) return;
    const id = ++reportRequest;
    pending = scope;
    if (stats?.scope !== scope) {
      stats = null;
      decorate();
    }
    try {
      if (!visible.length) return;
      const [rows, names] = await Promise.all([R.readRows(currentBank.id, classId), roster]);
      if (id !== reportRequest) return;
      const collected = R.collect(rows, R.questions(currentBank), names, classId, {runId});
      const real = collected.filter(result => !result.test);
      const results = real.length ? real : collected;
      stats = {scope, visible, results, coverage: report.analyse(results)};
      decorate();
    } catch (_) {
      if (id === reportRequest) {
        stats ||= {scope, visible, failed: true};
        decorate();
      }
    } finally {
      if (id === reportRequest) pending = null;
    }
  }

  async function loadSet() {
    const meta = sets.find(set => set.id === el('set').value);
    if (!meta) return;
    const loading = ++request;
    bank = null;
    stats = null;
    pending = null;
    reportRequest++;
    const current = new URL(location.href);
    if (current.searchParams.get('set') !== meta.id) {
      current.searchParams.delete('attemptRun');
      current.hash = '';
    }
    current.searchParams.set('week', String(W.week));
    current.searchParams.set('set', meta.id);
    if (classId) current.searchParams.set('classId', classId);
    history.replaceState({}, '', current);
    const records = new URL('results.html', current);
    records.search = current.search;
    el('records-link').href = records.href;
    window.dispatchEvent(new Event('special-preview-set'));
    if (loading !== request) return;
    if (classId) {
      el('student-link').href = W.setStudentLink(meta.id, classId);
      el('student-link').hidden = false;
    }
    W.notice('正在读取试题…');
    stopAudio();
    el('preview-content').hidden = true;
    el('sections').replaceChildren();
    el('show-answers').checked = false;
    el('show-transcripts').checked = false;
    try {
      const [test, media] = await Promise.all([W.json(W.asset(meta.file)), window.SpecialLearning.mediaFor(meta.id)]);
      if (loading !== request) return;
      bank = test;
      el('preview-title').textContent = test.title;
      el('sections').classList.remove('show-answers', 'show-transcripts');
      el('show-transcripts').disabled = !media.transcript;
      el('sections').replaceChildren(...window.SpecialQuestions.render(test, {}, {preview: true, onPlay: stopAudio,
        transcript: media.transcript}));
      el('preview-content').hidden = false;
      const target = current.hash.match(/^#question-(\d{1,2})$/);
      if (target && Number(target[1]) >= 1 && Number(target[1]) <= 70) {
        el('show-answers').checked = true;
        el('sections').classList.add('show-answers');
        if (Number(target[1]) <= 30 && media.transcript) {
          el('show-transcripts').checked = true;
          el('sections').classList.add('show-transcripts');
        }
        jump(Number(target[1]));
      } else showSkill(skill);
      W.notice();
      refreshHighlights();
    } catch (_) {
      if (loading === request) W.notice('试题加载失败，请刷新重试。', true);
    }
  }

  const home = new URL('../../teacher/index.html', location.href);
  const context = {lesson: W.params.get('lesson') || W.lesson, student: '', studentId: ''};
  if (classId) Object.assign(context, W.scopeFor(classId));
  home.search = window.ClassProContext.buildQuery(context);
  if (W.params.get('direct') === '1') home.searchParams.set('direct', '1');
  el('home-link').href = home.href;
  el('set').addEventListener('change', loadSet);
  el('show-answers').addEventListener('change', () => el('sections').classList.toggle('show-answers', el('show-answers').checked));
  el('show-transcripts').addEventListener('change', () =>
    el('sections').classList.toggle('show-transcripts', el('show-transcripts').checked));
  el('skills').addEventListener('click', event => {
    const button = event.target.closest('button[data-skill]');
    if (!button) return;
    showSkill(button.dataset.skill);
    el('sections').querySelector('[data-panel="' + skill + '"] h3').scrollIntoView({block: 'start'});
  });
  window.addEventListener('special-review-scope', event => {
    classroom = event.detail;
    refreshHighlights();
  });
  document.addEventListener('visibilitychange', refreshHighlights);
  const updates = setInterval(refreshHighlights, 12000);
  window.addEventListener('pagehide', event => { if (!event.persisted) clearInterval(updates); });
  W.loadCatalog().then(data => {
    sets = data.sets;
    W.choose(el('set'), sets.map(set => ({id: set.id, label: set.title})), W.params.get('set'));
    el('set').disabled = !sets.length;
    return loadSet();
  }).catch(() => W.notice('练习列表加载失败，请刷新重试。', true));
})();
