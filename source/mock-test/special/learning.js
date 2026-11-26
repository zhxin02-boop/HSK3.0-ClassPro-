(() => {
  'use strict';

  const W = window.SpecialWeek;
  const R = window.SpecialRecords;
  const {node} = W;
  const sections = {
    listening: ['听力', 'Listening'],
    reading: ['阅读', 'Reading'],
    writing: ['书写', 'Writing']
  };
  const axes = [
    {label: ['场景判断', 'Listening for context'], range: [1, 10], skill: 'listening',
      tip: ['先看图找出人物、地点和动作的不同，再听对应的信息。', 'Compare the people, places and actions in the pictures, then listen for those clues.']},
    {label: ['听取信息', 'Listening for details'], range: [11, 30], skill: 'listening',
      tip: ['先看选项，听的时候留意时间、地点和说话人最后的决定。', 'Read the choices first. Listen for times, places and the speakers’ final decision.']},
    {label: ['阅读理解', 'Reading comprehension'], range: [31, 60], skill: 'reading',
      tip: ['选答案前，先在句子或短文里找到能支持你判断的词句。', 'Find the words or sentence that support your answer before choosing it.']},
    {label: ['拼音写字', 'Writing characters'], range: [61, 65], skill: 'writing',
      tip: ['读完整个句子，先想空格里的词语，再根据拼音写字。', 'Read the whole sentence, work out the missing word, then use the pinyin to write the character.']},
    {label: ['看图写句', 'Writing from pictures'], range: [66, 70], skill: 'writing',
      tip: ['先说清楚图里谁在做什么，再用指定词写一个完整的句子。', 'Decide who is doing what in the picture, then write a complete sentence using the given word.']}
  ];

  function bilingual(tag, zh, en, className) {
    const element = node(tag, null, className);
    const english = node('span', en, 'english');
    english.lang = 'en';
    element.append(node('span', zh), english);
    return element;
  }

  function compute(history) {
    return axes.map(axis => {
      const [first, last] = axis.range;
      let points = 0;
      let total = 0;
      let samples = 0;
      let evidence;
      for (const {bank, result, media} of history) {
        if (!result.sections.includes(axis.skill)) continue;
        let scored = 0;
        for (const q of bank[axis.skill].items) {
          if (q.number < first || q.number > last) continue;
          const item = result.manual.find(row => row.q.id === q.id);
          if (item?.pending || (q.type === 'pictureSentence' && !item)) continue;
          const earned = item ? item.points : Number(!result.summary.wrong.includes(q.number));
          scored++;
          points += earned;
          total += q.points;
          if (!evidence && earned < q.points) evidence = {bank, result, q, media};
        }
        if (scored) samples++;
      }
      return {...axis, samples, rate: samples >= 2 ? points / total : null, evidence};
    });
  }

  function radar(result) {
    const figure = node('figure', null, 'radar-figure');
    const canvas = node('canvas', null, 'ability-radar');
    canvas.width = canvas.height = 420;
    canvas.setAttribute('aria-hidden', 'true');
    const pen = canvas.getContext('2d');
    if (pen) {
      const point = (i, weight) => {
        const angle = i * 2 * Math.PI / axes.length - Math.PI / 2;
        return [210 + 178 * weight * Math.cos(angle), 210 + 178 * weight * Math.sin(angle)];
      };
      function path(points, close = false) {
        pen.beginPath();
        pen.moveTo(...points[0]);
        points.slice(1).forEach(p => pen.lineTo(...p));
        if (close) pen.closePath();
      }
      pen.strokeStyle = '#c3d8d1';
      pen.lineWidth = 2;
      for (const radius of [.25, .5, .75, 1]) {
        path(axes.map((_, i) => point(i, radius)), true);
        pen.stroke();
      }
      axes.forEach((_, i) => { path([[210, 210], point(i, 1)]); pen.stroke(); });
      const dots = result.map((entry, i) => entry.rate == null ? null : point(i, entry.rate));
      pen.strokeStyle = pen.fillStyle = '#1b6d5b';
      pen.lineWidth = 4;
      if (dots.every(Boolean)) {
        path(dots, true);
        pen.fillStyle = '#257a6840';
        pen.fill();
        pen.stroke();
      } else {
        dots.forEach((dot, i) => {
          const neighbor = dots[(i + 1) % dots.length];
          if (dot && neighbor) { path([dot, neighbor]); pen.stroke(); }
        });
      }
      pen.fillStyle = '#1b6d5b';
      dots.filter(Boolean).forEach(dot => {
        pen.beginPath();
        pen.arc(...dot, 6, 0, 2 * Math.PI);
        pen.fill();
      });
    }
    const labels = node('ol', null, 'radar-labels');
    for (const axis of result) {
      const item = node('li');
      const value = axis.rate == null ? ['待评估', 'Awaiting evidence'] : [Math.round(axis.rate * 100) + '%', ''];
      item.append(bilingual('span', ...axis.label), bilingual('strong', ...value));
      labels.append(item);
    }
    figure.append(canvas, labels);
    return figure;
  }

  function scoreLabel(result, skill) {
    const score = R.score(result, skill);
    if (!score) return ['待提交', 'Not submitted'];
    const amount = score.points + ' / ' + score.total;
    return score.pending ? [
      amount + ' 已判分 · ' + score.pending + '题待批',
      amount + ' graded · ' + score.pending + ' awaiting review'
    ] : [amount, ''];
  }

  function change(history, skill) {
    const graded = history.map(entry => R.score(entry.result, skill)).filter(score => score && !score.pending);
    if (graded.length < 2) return null;
    const recent = graded[0];
    const first = graded.at(-1);
    const amount = recent.points - first.points;
    return amount > 0 ? [
      '最近一次比首次多得 ' + amount + ' 分。',
      'Your latest score is ' + amount + ' ' + (amount === 1 ? 'point' : 'points') + ' higher than your first.'
    ] : amount < 0 ? [
      '最近一次比首次少得 ' + Math.abs(amount) + ' 分。',
      'Your latest score is ' + Math.abs(amount) + ' ' + (amount === -1 ? 'point' : 'points') + ' lower than your first.'
    ] : ['最近一次和首次得分相同。', 'Your latest score matches your first.'];
  }

  function lookupOption(bank, q, value) {
    if (!value) return '未作答 / No answer';
    const option = q.options?.[value] || bank.reading.materials[q.materialId]?.options?.[value];
    return option ? value + ' · ' + option : value;
  }

  function questionEvidence(bank, result, q, media = {}) {
    const box = node('details', null, 'review-question');
    const item = result.manual.find(row => row.q.id === q.id);
    box.append(node('summary', '第' + q.number + '题 / Question ' + q.number +
      (item ? ' · ' + item.points + '/' + q.points : '')));
    if (q.pictureGroup) {
      const pictures = bank.listening.pictureGroups[q.pictureGroup]?.pictures || {};
      const group = node('div', null, 'review-pictures');
      const answer = result.summary.answers[q.id];
      for (const key of new Set([answer, q.answer].filter(Boolean))) {
        if (!pictures[key]) continue;
        const figure = node('figure');
        const image = node('img');
        image.src = W.asset(pictures[key].image, bank.id);
        image.alt = '图片 / Picture ' + key;
        image.loading = 'lazy';
        figure.append(image, node('figcaption', key));
        group.append(figure);
      }
      box.append(group);
    }
    const passage = q.passage || bank.reading.materials[q.materialId]?.passage;
    if (passage) box.append(node('p', passage, 'passage'));
    if (q.image) {
      const image = node('img', null, 'question-photo');
      image.src = W.asset(q.image, bank.id);
      image.alt = '试题图片 / Question image';
      image.loading = 'lazy';
      box.append(image);
    }
    if (q.word) box.append(node('p', '指定词 / Required word · ' + q.word));
    const prompt = q.question || (q.pinyin ? q.prompt.replace('（　）', '（' + q.pinyin + '）') : q.prompt);
    if (prompt) prompt.split('／').forEach(line => box.append(node('p', line)));
    const audio = media.transcript?.[q.id];
    if (audio?.length) {
      box.append(bilingual('h4', '听力原文', 'Listening transcript'));
      audio.forEach(line => box.append(node('p', line)));
    } else if (q.number <= 30) {
      box.append(bilingual('p', '听力原文暂未加载，请刷新讲评。', 'The transcript is unavailable. Refresh to try again.'));
    }
    const cue = bank.listening.audioParts.find(track => (track.part - 1) * 10 < q.number && track.part * 10 >= q.number);
    const timing = media.cues?.[q.id];
    if (timing) {
      const audioPlayer = node('audio');
      audioPlayer.controls = true;
      audioPlayer.preload = 'none';
      audioPlayer.src = W.asset(cue.file, bank.id) + '#t=' + timing.numberStart + ',' + timing.answerPauseStart;
      audioPlayer.setAttribute('aria-label', '重听第' + q.number + '题 / Replay question ' + q.number);
      box.append(audioPlayer);
    }
    box.append(node('p', '作答 / Your answer · ' + lookupOption(bank, q, result.summary.answers[q.id])));
    box.append(node('p', (item ? '参考句 / Sample answer · ' : '正确答案 / Correct answer · ') +
      (item ? q.reference : lookupOption(bank, q, q.answer)), 'review-correct'));
    if (item?.feedback) box.append(node('p', '教师评语 / Teacher feedback · ' + item.feedback));
    return box;
  }

  function reportContents(person, history, {partial = false, gradesPending = false} = {}) {
    const container = node('div', null, 'learning-report');
    const avatar = node('span', Array.from(person.name || '学')[0], 'student-avatar');
    avatar.setAttribute('aria-hidden', 'true');
    const name = node('h3', person.name, 'report-name');
    container.append(avatar, name);
    if (!history.length) {
      container.append(partial
        ? bilingual('p', '暂时无法读取成绩。', 'Scores are temporarily unavailable.')
        : bilingual('p', '暂无可查看的提交记录。', 'There are no submissions available to review.'));
      return container;
    }
    const render = () => {
      const lower = start.value ? Date.parse(start.value + 'T00:00:00') : -Infinity;
      const upper = end.value ? Date.parse(end.value + 'T00:00:00') : Infinity;
      const dated = history.filter(entry => {
        const time = Date.parse(entry.result.when);
        if (!start.value && !end.value) return true;
        return time >= lower && time < upper + 86400000;
      });
      if (lower > upper) {
        body.replaceChildren(bilingual('p', '结束日期应在开始日期之后。', 'Choose an end date on or after the start date.'));
        return;
      }
      if (!dated.length) {
        body.replaceChildren(bilingual('p', '这段时间没有已交练习。', 'There are no submissions in this period.'));
        return;
      }
      const assessed = compute(dated);
      body.replaceChildren(radar(assessed));
      body.append(bilingual('p', '每项至少有两次可判分练习后显示百分比。', 'Each axis shows a score after at least two graded attempts.', 'help'));
      for (const skill of R.sections) {
        const detail = node('section', null, 'skill-insight');
        detail.append(bilingual('h4', ...sections[skill]));
        const own = assessed.filter(axis => axis.skill === skill && axis.rate != null).sort((a, b) => a.rate - b.rate);
        if (!own.length) {
          detail.append(bilingual('p', '多完成几次练习后就能看出这一部分的表现。', 'Complete more practice to see your progress in this skill.'));
        } else {
          const weakest = own[0];
          const strongest = own.at(-1);
          if (strongest !== weakest && strongest.rate > weakest.rate) {
            detail.append(bilingual('p', '目前较稳的一项是' + strongest.label[0] + '。', strongest.label[1] + ' is your stronger area at the moment.'));
          }
          if (weakest.rate < 1) {
            detail.append(bilingual('p', ...weakest.tip));
            const item = weakest.evidence;
            if (item) detail.append(questionEvidence(item.bank, item.result, item.q, item.media));
          } else {
            detail.append(bilingual('p', '这一部分的已判分题目都做对了，继续保持。', 'You answered all graded questions in this skill correctly. Keep it up.'));
          }
        }
        const trend = change(dated, skill);
        if (trend) detail.append(bilingual('p', ...trend, 'help'));
        body.append(detail);
      }
      const archive = node('details', null, 'attempt-history');
      archive.append(node('summary', '历次成绩 / Score history · ' + dated.length));
      for (const {bank, result} of dated) {
        const stamp = Date.parse(result.when);
        const when = Number.isFinite(stamp) ? new Intl.DateTimeFormat('zh-CN', {dateStyle: 'short', timeStyle: 'short'}).format(stamp) : '';
        const week = bank.id.split('-')[1]?.slice(1);
        const label = bilingual('p', bank.title + (when ? ' · ' + when : ''),
          'Week ' + week + ' · Practice ' + bank.classInWeek + (when ? ' · ' + when : ''), 'history-title');
        const row = node('div', null, 'attempt-row');
        row.append(label);
        for (const skill of R.sections) {
          const cell = node('div');
          cell.append(bilingual('span', ...sections[skill]), bilingual('strong', ...scoreLabel(result, skill)));
          row.append(cell);
        }
        archive.append(row);
      }
      body.append(archive);
    };
    if (partial) container.append(bilingual('p', '有些课次暂未同步。', 'Some practice records could not be loaded.', 'notice'));
    if (gradesPending) container.append(bilingual('p', '部分造句评分暂未同步。', 'Some writing grades could not be synced.', 'help'));
    const filter = node('details', null, 'report-filter');
    filter.append(node('summary', '按学期日期筛选 / Filter by term dates'));
    const start = node('input'), end = node('input');
    for (const [input, label] of [[start,'开始日期 / Start date'], [end, '结束日期 / End date']]) {
      input.type = 'date';
      const field = node('label', label);
      field.append(input);
      input.addEventListener('change', render);
      filter.append(field);
    }
    const body = node('div');
    container.append(filter, body);
    render();
    return container;
  }

  let ordinal = 0;
  function dialog(title, load) {
    const panel = node('dialog', null, 'learning-dialog');
    const heading = bilingual('h2', ...title);
    heading.id = 'special-dialog-' + ++ordinal;
    panel.setAttribute('aria-labelledby', heading.id);
    const frame = node('div', null, 'dialog-heading');
    const close = node('button', '关闭 / Close', 'secondary');
    close.type = 'button';
    close.addEventListener('click', () => panel.close());
    frame.append(heading, close);
    const body = node('div', null, 'dialog-body');
    body.append(bilingual('p', '正在读取…', 'Loading…'));
    panel.append(frame, body);
    document.body.append(panel);
    panel.addEventListener('close', () => panel.remove(), {once: true});
    panel.showModal();
    Promise.resolve().then(load).then(content => {
      if (panel.open) body.replaceChildren(content);
    }).catch(() => {
      if (panel.open) body.replaceChildren(bilingual('p', '暂时无法加载，请关闭后重试。', 'Unable to load. Close this window and try again.'));
    });
  }

  const assets = new Map();
  function mediaFor(set) {
    const week = W.weekForSet(set) || W.week;
    if (!assets.has(week)) {
      const pending = Promise.allSettled(['teacher-audio.json', 'audio-cues.json'].map(file => W.json(W.asset(file, week))))
        .then(outcomes => {
          if (outcomes.some(result => result.status === 'rejected')) assets.delete(week);
          return outcomes.map(result => result.status === 'fulfilled' ? result.value : {});
        });
      assets.set(week, pending);
    }
    return assets.get(week).then(([transcript, cues]) => ({transcript: transcript[set], cues: cues[set]}));
  }

  window.SpecialLearning = {sections, bilingual, dialog, reportContents, questionEvidence, scoreLabel, mediaFor};
})();
