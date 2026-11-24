(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {el} = W;
  const classId = W.initialClass?.id;
  let sets = [];
  let skill = 'listening';
  let request = 0;
  const transcripts = W.json(W.asset('teacher-audio.json')).catch(() => ({}));

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
  }

  async function loadSet() {
    const meta = sets.find(set => set.id === el('set').value);
    if (!meta) return;
    const loading = ++request;
    const current = new URL(location.href);
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
      const [test, audio] = await Promise.all([W.json(W.asset(meta.file)), transcripts]);
      if (loading !== request) return;
      el('preview-title').textContent = test.title;
      el('sections').classList.remove('show-answers', 'show-transcripts');
      el('show-transcripts').disabled = !audio[meta.id];
      el('sections').replaceChildren(...window.SpecialQuestions.render(test, {}, {preview: true, onPlay: stopAudio, transcript: audio[meta.id]}));
      el('preview-content').hidden = false;
      showSkill(skill);
      W.notice();
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
  W.json(W.asset('catalog.json')).then(data => {
    sets = data.sets;
    W.choose(el('set'), sets.map(set => ({id: set.id, label: set.title})), W.params.get('set'));
    el('set').disabled = !sets.length;
    return loadSet();
  }).catch(() => W.notice('练习列表加载失败，请刷新重试。', true));
})();
