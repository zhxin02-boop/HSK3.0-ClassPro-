(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {el, node} = W;
  const skills = {listening: '听力', reading: '阅读', writing: '书写'};
  const state = {catalog: [], roster: [], test: null, student: null, draft: null, busy: false};
  let rosterRequest = 0;
  let persistenceError = false;

  function cacheKey() {
    return ['ClassProSpecialW1v1', state.scope.classId, state.student.id, state.test.id].join(':');
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
    el('start').disabled = !state.catalog.length || !el('student').value || state.busy;
    el('start').textContent = state.busy ? '正在加载…' : '开始答题';
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

  function part(title, help) {
    const section = node('section', null, 'part');
    section.append(node('h3', title), node('p', help, 'help'));
    return section;
  }

  function photo(path, label, className) {
    const image = node('img', null, className);
    image.src = W.asset(path);
    image.alt = label;
    image.loading = 'lazy';
    image.decoding = 'async';
    return image;
  }

  function pool(values, kind) {
    const list = node('ul', null, 'pool ' + kind + '-pool');
    for (const [letter, value] of Object.entries(values)) {
      const item = node('li');
      if (kind === 'image') item.append(photo(value.image, '图片 ' + letter), node('span', letter));
      else item.append(node('b', letter + '　'), document.createTextNode(value));
      list.append(item);
    }
    return list;
  }

  function example(text, answer) {
    const block = node('div', null, 'example');
    if (text) block.append(node('p', text));
    block.append(node('p', '例题答案 ' + answer));
    return block;
  }

  function choices(question, options, lettersOnly) {
    const field = node('fieldset', null, 'question');
    field.append(node('legend', '第' + question.number + '题'));
    if (question.passage) field.append(node('p', question.passage, 'passage'));
    const prompt = question.question || question.prompt;
    if (prompt) for (const row of prompt.split('／')) field.append(node('p', row));
    const group = node('div', null, lettersOnly ? 'choices letters' : 'choices');
    for (const [key, text] of Object.entries(options)) {
      const label = node('label', null, 'choice');
      const input = node('input');
      input.type = 'radio';
      input.name = question.id;
      input.value = key;
      input.checked = state.draft.answers[question.id] === key;
      const value = node('span');
      value.append(node('b', key));
      if (!lettersOnly) value.append(document.createTextNode(text));
      label.append(input, value);
      group.append(label);
    }
    field.append(group);
    return field;
  }

  function showListening(parent) {
    const {listening} = state.test;
    const names = ['听对话选图片', '听对话和问题', '听短文和问题'];
    listening.audioParts.forEach((track, index) => {
      const from = index * 10 + 1;
      const section = part('第' + from + '–' + (from + 9) + '题 · ' + names[index],
        '点播放听录音，每题听两遍。');
      const audio = node('audio');
      audio.controls = true;
      audio.preload = 'none';
      audio.src = W.asset(track.file);
      audio.setAttribute('aria-label', '第' + from + '–' + (from + 9) + '题录音');
      audio.addEventListener('play', () => stopAudio(audio));
      audio.addEventListener('error', () => W.notice('录音加载失败。请检查网络后重新打开本套练习。', true));
      section.append(audio);
      const items = listening.items.slice(index * 10, index * 10 + 10);
      if (index === 0) {
        ['A', 'B'].forEach((key, groupIndex) => {
          const options = listening.pictureGroups[key].pictures;
          section.append(node('h3', groupIndex === 0 ? '第1–5题图片' : '第6–10题图片'), pool(options, 'image'));
          if (!groupIndex) section.append(example('', listening.examples.picture.answer));
          items.slice(groupIndex * 5, groupIndex * 5 + 5).forEach(q => section.append(choices(q, options, true)));
        });
      } else {
        const sample = listening.examples[index === 1 ? 'dialogue' : 'monologue'];
        const text = Object.entries(sample.options).map(([key, value]) => key + ' ' + value).join('　');
        section.append(example(text, sample.answer));
        items.forEach(q => section.append(choices(q, q.options, false)));
      }
      parent.append(section);
    });
  }

  function showReading(parent) {
    const {reading} = state.test;
    const sets = [
      [31, '句子配对', '给每句话选择合适的句子。'],
      [41, '选词填空', '给空格选择合适的词语。'],
      [51, '短文理解', '读短文，选择正确答案。'],
    ];
    sets.forEach(([from, title, help], index) => {
      const section = part('第' + from + '–' + (from + 9) + '题 · ' + title, help);
      let previousMaterial = null;
      if (index === 2) {
        const demo = reading.examples.E3;
        const sample = example(demo.passage, demo.answer);
        sample.insertBefore(node('p', demo.question), sample.lastChild);
        sample.insertBefore(node('p', Object.entries(demo.options).map(([k, v]) => k + ' ' + v).join('　')), sample.lastChild);
        section.append(sample);
      }
      for (const q of reading.items.slice(index * 10, index * 10 + 10)) {
        const material = reading.materials[q.materialId];
        if (material && q.materialId !== previousMaterial) {
          previousMaterial = q.materialId;
          if (material.passage) section.append(node('p', material.passage, 'example'));
          else {
            section.append(pool(material.options, index === 0 ? 'sentence' : 'word'));
            const sample = Object.values(reading.examples).find(row => row.materialId === q.materialId);
            if (sample) section.append(example(sample.prompt.replaceAll('／', '　'), sample.answer));
          }
        }
        section.append(choices(q, q.options || material.options, index < 2));
      }
      parent.append(section);
    });
  }

  function writingQuestion(q, isPinyin) {
    const field = node('fieldset', null, 'question');
    field.append(node('legend', '第' + q.number + '题'));
    const input = node(isPinyin ? 'input' : 'textarea');
    input.name = q.id;
    input.value = state.draft.answers[q.id] || '';
    input.setAttribute('aria-label', '第' + q.number + '题' + (isPinyin ? '填写一个汉字' : '用' + q.word + '写句子'));
    input.autocomplete = 'off';
    input.spellcheck = false;
    if (isPinyin) {
      const [before, after] = q.prompt.split('（　）');
      const prompt = node('p', before);
      const slot = node('span', null, 'pinyin-gap');
      slot.append(node('small', q.pinyin), node('span', '（　）'));
      prompt.append(slot, document.createTextNode(after));
      input.type = 'text';
      input.placeholder = '输入一个汉字';
      input.maxLength = 2;
      field.append(prompt);
    } else {
      field.append(photo(q.image, '第' + q.number + '题图片', 'question-photo'), node('p', '用这个词写句子：' + q.word));
      input.placeholder = '写一个完整的句子';
      input.maxLength = 200;
    }
    field.append(input);
    return field;
  }

  function showWriting(parent) {
    const {writing} = state.test;
    const pinyin = part('第61–65题 · 拼音补字', '根据拼音，填入一个汉字。');
    const hanzi = writing.examples.pinyinCharacter;
    pinyin.append(example(hanzi.prompt.replace('（　）', '（' + hanzi.pinyin + '）'), hanzi.answer));
    writing.items.slice(0, 5).forEach(q => pinyin.append(writingQuestion(q, true)));
    const sentence = part('第66–70题 · 看图造句', '用指定的词写一个完整的句子，由教师批改。');
    const demo = writing.examples.pictureSentence;
    const sample = example(demo.word, demo.answer);
    sample.prepend(photo(demo.image, '书写例题图片'));
    sentence.append(sample);
    writing.items.slice(5).forEach(q => sentence.append(writingQuestion(q, false)));
    parent.append(pinyin, sentence);
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
    const panels = [];
    const buttons = [];
    const renderers = [showListening, showReading, showWriting];
    Object.keys(skills).forEach((key, index) => {
      const section = node('div');
      section.dataset.panel = key;
      panels.push(section);
      renderers[index](section);
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
    if (state.busy) return;
    state.student = state.roster.find(item => item.id === el('student').value);
    const set = state.catalog.find(item => item.id === el('set').value);
    if (!state.student || !set) return;
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
    }
  });

  el('answers').addEventListener('input', event => {
    const {name, value} = event.target;
    if (!name || state.draft.bundle) return;
    if (value) state.draft.answers[name] = value;
    else delete state.draft.answers[name];
    saveDraft();
    updateProgress();
  });

  el('answers').addEventListener('submit', async event => {
    event.preventDefault();
    if (state.busy || state.draft.sent) return;
    if (!state.draft.bundle) {
      const done = questionList().filter(answered).length;
      if (!window.confirm(done < 70 ? '还有 ' + (70 - done) + ' 道题未答。确定提交吗？' : '确定提交这份练习吗？')) return;
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
  });

  el('class').addEventListener('change', changeClass);
  el('student').addEventListener('change', checkEntry);
  el('switch').addEventListener('click', toEntry);
  el('done').addEventListener('click', toEntry);
  el('home-link').href = '../../student/index.html?' + window.ClassProContext.buildQuery({lesson: W.lesson});
  W.choose(el('class'), W.classes.map(item => ({id: item.id, label: item.name})), W.initialClass?.id);
  if (W.initialClass) changeClass();
  W.json(W.asset('catalog.json')).then(data => {
    state.catalog = data.sets;
    W.choose(el('set'), data.sets.map(set => ({id: set.id, label: set.title})), W.params.get('set'));
    checkEntry();
  }).catch(() => W.notice('练习列表加载失败，请刷新重试。', true));
})();
