// Build compact lesson progress from ClassPro learning records.
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ClassProProgressData = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var INDEX = { time: 0, student: 1, lesson: 2, stage: 3, module: 4, question: 5, score: 6, total: 7, answer: 13, session: 17 };

  function value(row, keys, index) {
    for (var i = 0; i < keys.length; i++) {
      if (row && row[keys[i]] != null && row[keys[i]] !== '') return row[keys[i]];
    }
    return row && Array.isArray(row.__values) && row.__values[index] != null ? row.__values[index] : '';
  }

  function parseJson(text) {
    if (text && typeof text === 'object') return text;
    try { return JSON.parse(String(text || '')); } catch (error) { return {}; }
  }

  function stageOf(row) {
    var stage = String(value(row, ['stage', '环节', '阶段'], INDEX.stage) || '').trim().toLowerCase().replace(/[\s-]/g, '');
    if (stage === '预习' || stage === '课前' || stage === 'pre' || stage === 'preclass' || stage === 'pre_class') return 'pre_class';
    if (stage === '课中' || stage === 'inclass' || stage === 'in_class') return 'in_class';
    if (stage === '课后' || stage === 'post' || stage === 'postclass' || stage === 'post_class') return 'post_class';
    return stage;
  }

  function moduleOf(row) { return String(value(row, ['module', '模块', 'mode'], INDEX.module) || ''); }
  function questionOf(row) { return String(value(row, ['questionId', '题号', '题目ID'], INDEX.question) || ''); }
  function studentOf(row) { return String(value(row, ['studentName', '姓名', '学生姓名', 'name'], INDEX.student) || ''); }
  function answerOf(row) { return value(row, ['answer', '学生作答'], INDEX.answer); }
  function timeOf(row) { return new Date(value(row, ['submittedAt', 'timestamp', '提交时间'], INDEX.time) || 0).getTime() || 0; }

  function sessionOf(row) {
    var direct = String(value(row, ['learningSession', 'courseSession', 'sessionCode', 'sessionId', '课堂session'], INDEX.session) || '').toUpperCase();
    if (/^[ABC]$/.test(direct)) return direct;
    var question = questionOf(row).toUpperCase();
    var match = question.match(/(?:HOMEWORK|PREVIEW|SESSION)[_-]([ABC])(?:$|[_-])/);
    if (match) return match[1];
    var data = parseJson(answerOf(row));
    var embedded = String(data.session || data.tier || '').toUpperCase();
    return /^[ABC]$/.test(embedded) ? embedded : '';
  }

  function summaryRate(row) {
    var data = parseJson(answerOf(row));
    if (data.rate != null) return clamp(data.rate);
    if (data.completed != null && Number(data.required) > 0) return clamp(Number(data.completed) / Number(data.required));
    var total = Number(value(row, ['total', '总分'], INDEX.total));
    var score = Number(value(row, ['score', '得分'], INDEX.score));
    return total > 0 ? clamp(score / total) : 0;
  }

  function clamp(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return 0;
    if (number > 1) number = number / 100;
    return Math.max(0, Math.min(1, number));
  }

  function latestBySession(rows) {
    var result = {};
    rows.slice().sort(function (a, b) { return timeOf(a) - timeOf(b); }).forEach(function (row) {
      var session = sessionOf(row);
      if (session) result[session] = row;
    });
    return result;
  }

  function preClassRate(studentRows, expectedSessions) {
    var rows = studentRows.filter(function (row) { return stageOf(row) === 'pre_class'; });
    var summaries = rows.filter(function (row) { return moduleOf(row) === 'pre_progress_summary'; });
    if (summaries.length) {
      var bySession = latestBySession(summaries);
      var sessions = Object.keys(bySession);
      if (expectedSessions.length && sessions.length) {
        return clamp(expectedSessions.reduce(function (sum, session) { return sum + (bySession[session] ? summaryRate(bySession[session]) : 0); }, 0) / expectedSessions.length);
      }
      return summaryRate(summaries.slice().sort(function (a, b) { return timeOf(b) - timeOf(a); })[0]);
    }

    var finalOutputs = rows.filter(function (row) { return /最终输出|mission_complete/i.test(moduleOf(row)); });
    var missionSessions = latestBySession(finalOutputs);
    var missionRate = expectedSessions.length && Object.keys(missionSessions).length
      ? Object.keys(missionSessions).filter(function (session) { return expectedSessions.indexOf(session) >= 0; }).length / expectedSessions.length
      : (finalOutputs.length ? 1 : 0);
    var steps = {};
    rows.forEach(function (row) {
      var match = moduleOf(row).match(/^pre_step_R(\d+)$/i);
      if (match) steps[match[1]] = true;
    });
    return clamp(Math.max(missionRate, Object.keys(steps).length / 6));
  }

  function inClassRate(allRows, studentRows) {
    var issued = {}, answered = {};
    allRows.forEach(function (row) {
      if (stageOf(row) !== 'in_class') return;
      var question = questionOf(row);
      if (question && moduleOf(row) !== 'session_summary') issued[question] = true;
      if (moduleOf(row) === 'session_summary') {
        var data = parseJson(answerOf(row));
        (data.publishedQuestionIds || []).forEach(function (id) { if (id) issued[String(id)] = true; });
      }
    });
    studentRows.forEach(function (row) {
      if (stageOf(row) !== 'in_class') return;
      var question = questionOf(row);
      if (question && moduleOf(row) !== 'session_summary') answered[question] = true;
    });
    var total = Object.keys(issued).length;
    return total ? clamp(Object.keys(answered).filter(function (id) { return issued[id]; }).length / total) : 0;
  }

  function postClassRate(studentRows, expectedSessions) {
    var summaries = studentRows.filter(function (row) { return stageOf(row) === 'post_class' && moduleOf(row) === 'homework_summary'; });
    if (!summaries.length) return 0;
    if (!expectedSessions.length) return 1;
    var bySession = latestBySession(summaries);
    var sessions = Object.keys(bySession).filter(function (session) { return expectedSessions.indexOf(session) >= 0; });
    return sessions.length ? clamp(sessions.length / expectedSessions.length) : 1;
  }

  function fromRows(rows, options) {
    rows = Array.isArray(rows) ? rows : [];
    options = options || {};
    var student = String(options.student || '');
    var lesson = String(options.lesson || '');
    var expectedSessions = options.expectedSessions || (/^HSK3-/i.test(lesson) ? ['A', 'B', 'C'] : []);
    var lessonRows = rows.filter(function (row) {
      var rowLesson = String(value(row, ['lesson', '课程', '课程编号', 'lessonKey'], INDEX.lesson) || '');
      return !lesson || rowLesson === lesson;
    });
    var studentRows = lessonRows.filter(function (row) { return studentOf(row) === student; });
    var rates = {
      pre_class: preClassRate(studentRows, expectedSessions),
      in_class: inClassRate(lessonRows, studentRows),
      post_class: postClassRate(studentRows, expectedSessions)
    };
    return { rates: rates, records: studentRows.length, issuedQuestions: lessonRows.filter(function (row) { return stageOf(row) === 'in_class' && questionOf(row); }).length };
  }

  return { fromRows: fromRows, stageOf: stageOf, sessionOf: sessionOf };
});
