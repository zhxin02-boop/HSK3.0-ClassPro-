(() => {
  'use strict';

  const W = window.SpecialWeek;
  const L = window.SpecialLearning;
  const R = window.SpecialRecords;
  const {node} = W;

  function releasedSections(draft, classroom) {
    const confirmed = R.sections.filter(key => draft.sent || draft.submissions?.[key]?.sent);
    return classroom ? confirmed.filter(key => draft.released?.includes(key)) : confirmed;
  }

  function drafts(classId, studentId) {
    const prefix = ['ClassProSpecialW1v1', classId, studentId, ''].join(':');
    const list = [];
    const seen = new Set();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(prefix)) continue;
        const [set, run = ''] = key.slice(prefix.length).split(':');
        if (!/^HSK3-W[1-3]-SP0[1-5]$/.test(set)) continue;
        const saved = JSON.parse(localStorage.getItem(key));
        const classroom = Boolean(run && run !== 'past');
        const identity = JSON.stringify([set, saved?.groupId || key]);
        if (saved && !seen.has(identity) && releasedSections(saved, classroom).length) {
          seen.add(identity);
          list.push({set, draft: saved, classroom});
        }
      }
    } catch (_) {}
    return list;
  }

  async function resultFor(bank, draft, scope, classroom) {
    const sections = releasedSections(draft, classroom);
    const summary = {scores: {}, wrong: [], answers: {}};
    for (const section of sections) {
      const part = draft.sent ? draft.summary : draft.submissions[section]?.summary;
      if (!part) continue;
      summary.scores[section] = Number(part.scores?.[section]) || 0;
      for (const q of bank[section].items) {
        if (part.answers?.[q.id]) summary.answers[q.id] = part.answers[q.id];
        if (part.wrong?.includes(q.number)) summary.wrong.push(q.number);
      }
    }
    let grades = draft.submissions?.writing?.grades || {};
    let confirmedGrades = false;
    let gradeSyncUnavailable = false;
    const when = sections.map(section => draft.submissions?.[section]?.submittedAt || draft.submittedAt || '')
      .sort().at(-1) || '';
    const manual = sections.includes('writing') ? bank.writing.items.filter(q => q.type === 'pictureSentence')
      .map(q => ({q, value: summary.answers[q.id] || ''})) : [];
    if (manual.some(item => item.value) && draft.groupId && !draft.sent) {
      const attemptId = draft.submissions.writing.attemptId || [bank.id, draft.groupId, 'writing'].join('-');
      try {
        const receipt = await W.getRecords('get_mock_attempt', {lesson: bank.id, student: scope.studentName,
          studentId: scope.studentId, classId: scope.classId, teacherId: scope.teacherId, attemptId, includeGrades: '1'});
        if (receipt.status === 'ok' && receipt.attemptId === attemptId && receipt.complete && Array.isArray(receipt.grades)) {
          grades = Object.fromEntries(receipt.grades.filter(row => Number.isInteger(row.score) &&
            manual.some(item => item.q.id === row.questionId && row.score >= 0 && row.score <= item.q.points))
            .map(row => [row.questionId, row]));
          confirmedGrades = true;
        } else gradeSyncUnavailable = true;
      } catch (_) { gradeSyncUnavailable = true; }
    }
    for (const item of manual) {
      const grade = grades[item.q.id];
      item.points = item.value && grade ? grade.score : 0;
      item.pending = Boolean(item.value && !grade);
      item.feedback = grade?.feedback || '';
    }
    return {sections, summary, manual, when, grades: confirmedGrades ? grades : null, gradeSyncUnavailable};
  }

  function showReview(bank, draft, scope, selected, classroom, onGrades) {
    const keys = releasedSections(draft, classroom).filter(key => !selected || key === selected);
    if (!keys.length) return;
    L.dialog(['得分与错题', 'Scores and missed questions'], async () => {
      const [result, media] = await Promise.all([resultFor(bank, draft, scope, classroom), L.mediaFor(bank.id)]);
      if (result.grades) onGrades(result.grades);
      const content = node('div', null, 'student-review');
      for (const key of keys) {
        const panel = node('section');
        const [zh, en] = L.sections[key];
        panel.append(L.bilingual('h3', zh, en), L.bilingual('p', ...L.scoreLabel(result, key), 'section-grade'));
        const missed = bank[key].items.filter(q => result.summary.wrong.includes(q.number) ||
          result.manual.some(item => item.q.id === q.id && !item.pending && item.points < q.points));
        if (key === 'writing' && result.gradeSyncUnavailable && R.score(result, key).pending) {
          panel.append(L.bilingual('p', '教师评分暂未同步。', 'Teacher grades could not be synced.', 'help'));
        }
        if (!missed.length && !R.score(result, key).pending) {
          panel.append(L.bilingual('p', '这一部分没有错题。', 'No missed questions in this section.'));
        }
        for (const q of missed) panel.append(L.questionEvidence(bank, result, q, media));
        content.append(panel);
      }
      return content;
    });
  }

  function showReport(scope) {
    L.dialog(['我的学习报告', 'My Learning Report'], async () => {
      const available = drafts(scope.classId, scope.studentId);
      const {sets, partial} = await W.loadCatalogs();
      const bySet = new Map();
      for (const record of available) {
        const metadata = sets.find(set => set.id === record.set);
        if (!metadata) continue;
        if (!bySet.has(record.set)) bySet.set(record.set, {metadata, drafts: []});
        bySet.get(record.set).drafts.push(record);
      }
      const outcome = await Promise.allSettled(Array.from(bySet.values(), async entry => {
        const bank = await W.json(W.asset(entry.metadata.file, entry.metadata.id));
        const media = await L.mediaFor(bank.id);
        const entries = [];
        for (const record of entry.drafts) {
          const result = await resultFor(bank, record.draft, scope, record.classroom);
          entries.push({bank, result, media});
        }
        return entries;
      }));
      const history = outcome.flatMap(entry => entry.status === 'fulfilled' ? entry.value : [])
        .sort((a, b) => (Date.parse(b.result.when) || 0) - (Date.parse(a.result.when) || 0));
      return L.reportContents({name: scope.studentName}, history,
        {partial: partial || outcome.some(entry => entry.status === 'rejected'),
        gradesPending: history.some(entry => entry.result.gradeSyncUnavailable)});
    });
  }

  window.SpecialStudentReview = {releasedSections, drafts, resultFor, showReview, showReport};
})();
