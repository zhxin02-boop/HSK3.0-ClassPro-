(() => {
  'use strict';

  const W = window.SpecialWeek;
  const sections = ['listening', 'reading', 'writing'];
  const columns = {
    time: [0, '提交时间'], student: [1, '姓名'], lesson: [2, '课程'], module: [4, '模块'],
    question: [5, '题号'], score: [6, '得分'], total: [7, '总分'], answer: [13, '学生作答'],
    feedback: [15, '教师批改'], status: [16, '批改状态'], attempt: [17, '课堂session'],
    submitted: [19, '原始提交时间'], classId: [22, '班级ID'], studentId: [23, '学生ID']
  };

  function value(row, field) {
    const [index, label] = columns[field];
    return row.__values?.[index] ?? row[label] ?? '';
  }

  function isGraded(row) { return /已批改|已归档|reviewed/i.test(value(row, 'status')); }

  function sectionFor(number) {
    return number <= 30 ? sections[0] : number <= 60 ? sections[1] : sections[2];
  }

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
    const matches = roster.filter(item => item.name === name);
    if (matches.length !== 1) return null;
    const elsewhere = W.classes.some(item => item.id !== classId &&
      window.ClassProClassCatalog.roster(item.id, W.lesson).some(row => row.name === name));
    return elsewhere ? null : {classId, studentId: matches[0].id};
  }

  function collect(rows, questions, roster, classId, {runId = '', all = false} = {}) {
    const details = new Map();
    const sittings = new Map();
    for (const row of rows) {
      const attempt = value(row, 'attempt');
      const module = value(row, 'module');
      if (module === 'subjective') {
        if (!details.has(attempt)) details.set(attempt, new Map());
        details.get(attempt).set(value(row, 'question'), row);
        continue;
      }
      if (module !== 'mock_test') continue;
      let summary;
      try { summary = JSON.parse(value(row, 'answer')); } catch (_) { continue; }
      if (!summary?.scores || !summary.answers || !Array.isArray(summary.wrong)) continue;
      if (runId && summary.runId !== runId) continue;
      const name = value(row, 'student');
      const recordedClass = value(row, 'classId');
      const studentId = value(row, 'studentId') || summary.identity?.studentId;
      if ((recordedClass && recordedClass !== classId) || (summary.identity?.classId && summary.identity.classId !== classId)) continue;
      const identity = studentId ? {classId, studentId} : legacyIdentity(name, classId, roster);
      if (!identity) continue;
      const grouped = sections.includes(summary.section) && Boolean(summary.groupId);
      if (summary.section && !grouped) continue;
      const group = grouped ? summary.groupId : attempt;
      const sittingKey = JSON.stringify([identity.studentId, group]);
      const when = value(row, 'submitted') || value(row, 'time');
      if (!sittings.has(sittingKey)) {
        sittings.set(sittingKey, {name, studentId: identity.studentId, group, when, parts: new Map()});
      }
      const sitting = sittings.get(sittingKey);
      if (Date.parse(when) > Date.parse(sitting.when)) sitting.when = when;
      for (const section of grouped ? [summary.section] : sections) {
        const previous = sitting.parts.get(section);
        if (!previous || Date.parse(when) >= Date.parse(previous.when)) sitting.parts.set(section, {summary, attempt, when});
      }
    }
    const ordered = [...sittings.values()].sort((a, b) => Date.parse(b.when) - Date.parse(a.when));
    const seen = new Set();
    return ordered.filter(sitting => {
      if (!all && seen.has(sitting.studentId)) return false;
      seen.add(sitting.studentId);
      return true;
    }).map(sitting => {
      const submitted = sections.filter(key => sitting.parts.has(key));
      const summary = {answers: {}, scores: {}, wrong: [], answered: 0};
      for (const section of submitted) {
        const part = sitting.parts.get(section).summary;
        summary.scores[section] = Number(part.scores[section]) || 0;
        for (const q of questions.filter(q => sectionFor(q.number) === section)) {
          if (part.answers[q.id]) summary.answers[q.id] = part.answers[q.id];
          if (part.wrong.includes(q.number)) summary.wrong.push(q.number);
        }
      }
      summary.answered = Object.keys(summary.answers).length;
      const writing = sitting.parts.get('writing');
      const manual = writing ? questions.filter(q => q.type === 'pictureSentence').map(q => {
        const record = details.get(writing.attempt)?.get(q.id);
        const response = summary.answers[q.id] || '';
        const points = gradePoints(record, q.points);
        return {q, record, value: response, points: points ?? 0, pending: Boolean(response && points == null),
          feedback: record ? value(record, 'feedback') : ''};
      }) : [];
      const who = roster.find(student => student.id === sitting.studentId);
      return {name: who?.name || sitting.name, studentId: sitting.studentId, when: sitting.when,
        attempt: sitting.group, summary, sections: submitted, manual, test: who?.testAccount === true};
    });
  }

  function gradePoints(record, maximum) {
    if (!record || !isGraded(record)) return null;
    const score = Number(value(record, 'score'));
    return Number.isFinite(score) && score >= 0 && score <= maximum ? score : null;
  }

  function questions(bank) { return sections.flatMap(key => bank[key].items); }

  function score(result, section) {
    if (!result.sections.includes(section)) return null;
    const objective = Number(result.summary.scores[section]) || 0;
    if (section !== 'writing') return {points: objective, total: 30, pending: 0};
    const pending = result.manual.filter(item => item.pending).length;
    return {points: objective + result.manual.reduce((total, item) => total + item.points, 0),
      total: 15 - 2 * pending, pending};
  }

  window.SpecialRecords = {collect, readRows, value, isGraded, score, questions, sectionFor, sections};
})();
