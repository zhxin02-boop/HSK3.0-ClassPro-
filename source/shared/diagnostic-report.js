// Deterministic, side-effect-free learning diagnostic report builder.
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ClassProDiagnosticReport = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var INDEX = { time: 0, student: 1, lesson: 2, stage: 3, module: 4, question: 5, score: 6, total: 7, answer: 13, result: 14, feedback: 15, status: 16, session: 17 };
  var DEFAULT_MIN_STUDENTS = 3;
  var TEST_ACCOUNT = /^(?:test(?:ing)?\d*|student\d*|demo\d*|sample\d*|teacher|admin)$/i;

  function value(row, keys, index) {
    for (var i = 0; i < keys.length; i++) {
      if (row && row[keys[i]] != null && row[keys[i]] !== '') return row[keys[i]];
    }
    return row && Array.isArray(row.__values) && index != null && row.__values[index] != null ? row.__values[index] : '';
  }

  function normalizeName(name) { return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase(); }
  function studentOf(row) { return String(value(row, ['studentName', '姓名', '学生姓名', 'name', 'student'], INDEX.student) || '').trim(); }
  function lessonOf(row) { return String(value(row, ['lesson', '课程', '课程编号', 'lessonKey'], INDEX.lesson) || '').trim(); }
  function moduleOf(row) { return String(value(row, ['module', '模块', 'mode'], INDEX.module) || '').trim(); }
  function questionOf(row) { return String(value(row, ['questionId', '题号', '题目ID'], INDEX.question) || '').trim(); }
  function questionTextOf(row) { return String(value(row, ['questionText', '题目', '题目文本'], null) || '').trim(); }
  function answerOf(row) { return value(row, ['answer', '学生作答'], INDEX.answer); }
  function timeTextOf(row) { return String(value(row, ['submittedAt', 'timestamp', 'receivedAt', '提交时间'], INDEX.time) || '').trim(); }
  function timeOf(row) { return new Date(timeTextOf(row) || 0).getTime() || 0; }
  function numberOf(row, keys, index) {
    var raw = value(row, keys, index);
    return raw !== '' && Number.isFinite(Number(raw)) ? Number(raw) : null;
  }
  function parseJson(text) {
    if (text && typeof text === 'object') return text;
    try { return JSON.parse(String(text || '')); } catch (error) { return {}; }
  }
  function stageOf(row) {
    var stage = String(value(row, ['stage', '环节', '阶段'], INDEX.stage) || '').trim().toLowerCase().replace(/[\s-]/g, '');
    return stage === '预习' || stage === '课前' || stage === 'pre' || stage === 'preclass' || stage === 'pre_class' ? 'pre_class' : stage;
  }
  function sessionOf(row, progressData) {
    if (progressData && typeof progressData.sessionOf === 'function') return progressData.sessionOf(row);
    var direct = String(value(row, ['learningSession', 'courseSession', 'sessionCode', 'sessionId', '课堂session'], INDEX.session) || '').toUpperCase();
    if (/^[ABC]$/.test(direct)) return direct;
    var match = questionOf(row).toUpperCase().match(/(?:HOMEWORK|PREVIEW|SESSION)[_-]([ABC])(?:$|[_-])/);
    if (match) return match[1];
    var embedded = String(parseJson(answerOf(row)).session || '').toUpperCase();
    return /^[ABC]$/.test(embedded) ? embedded : '';
  }
  function statusOf(row) { return String(value(row, ['status', '批改状态', 'reviewStatus'], INDEX.status) || '').trim().toLowerCase(); }
  function resultOf(row) { return String(value(row, ['result', '结果', 'autoResult'], INDEX.result) || '').trim().toLowerCase(); }
  function isTruthy(value) { return /^(?:true|yes|1)$/i.test(String(value || '').trim()); }
  function isSummary(row) { return /^(?:pre_progress_summary|homework_summary|session_summary)$/i.test(moduleOf(row)); }
  function isProgressMarker(row) { return /^pre_step_R\d+$/i.test(moduleOf(row)); }
  function isReviewed(row) {
    var status = statusOf(row);
    var feedback = String(value(row, ['teacherFeedback', '教师批改', 'correction'], INDEX.feedback) || '').trim();
    return !!feedback || status === 'reviewed' || status.indexOf('已批改') >= 0 || status.indexOf('无需批改') >= 0;
  }
  function isPending(row) {
    if (isSummary(row) || isReviewed(row)) return false;
    var module = moduleOf(row).toLowerCase();
    var status = statusOf(row);
    return /(?:output|subjective|handwriting|最终输出)/i.test(module) ||
      isTruthy(value(row, ['needsReview', 'needs_teacher_review', 'needsTeacherReview'], null)) ||
      isTruthy(value(row, ['openEnded', 'open_ended', 'isOpenEnded'], null)) ||
      status.indexOf('待') >= 0 || status === 'pending';
  }
  function isObjective(row) {
    var total = numberOf(row, ['total', '总分'], INDEX.total);
    return total != null && total > 0 && !isSummary(row) && !isProgressMarker(row) && !isPending(row);
  }
  function isWrong(row) {
    var result = resultOf(row);
    if (result === 'wrong' || result === 'false' || result === '错' || result === '错误') return true;
    if (result === 'correct' || result === 'true' || result === '对' || result === '正确') return false;
    var score = numberOf(row, ['score', '得分'], INDEX.score);
    var total = numberOf(row, ['total', '总分'], INDEX.total);
    return total != null && total > 0 && score != null ? score < total : false;
  }
  function splitLabels(raw) {
    if (Array.isArray(raw)) return raw.map(String).map(function (x) { return x.trim(); }).filter(Boolean);
    return String(raw || '').split(/[、,，;；|]/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  function issueLabels(row) {
    var kp = value(row, ['kp', 'knowledgePoint', 'knowledgePoints', '知识点'], null);
    var weak = value(row, ['weakPoints', 'weakPoint', '薄弱点'], null);
    var labels = splitLabels(kp || weak);
    if (labels.length) return labels.map(function (label) { return { label: label, kind: '知识点' }; });
    var question = questionOf(row) || questionTextOf(row);
    if (question) return [{ label: question, kind: '题目' }];
    return [{ label: moduleOf(row) || '未标注题型', kind: '题型' }];
  }
  function fallbackQuestionKey(row) {
    // Historical rows often omit questionId. questionText is the most stable human-readable fallback;
    // preview JSON's embedded stage is next, and a module-level key is the final conservative fallback.
    var embedded = parseJson(answerOf(row));
    return questionTextOf(row) || String(embedded.stage || embedded.questionId || '') || '__module__';
  }
  function dedupeKey(row, progressData) {
    return [normalizeName(studentOf(row)), lessonOf(row).toLowerCase(), stageOf(row), sessionOf(row, progressData), moduleOf(row).toLowerCase(), questionOf(row) || fallbackQuestionKey(row)].join('|');
  }
  function classifyExcluded(name, rosterMap) {
    var normalized = normalizeName(name);
    if (normalized === '__class__') return '班级汇总账号';
    if (!normalized || TEST_ACCOUNT.test(normalized)) return '测试账号';
    return rosterMap[normalized] ? '' : '非正式名单账号';
  }
  function roundPercent(part, whole) { return whole ? Math.round(part / whole * 100) : 0; }
  function compactEvidence(row, displayName) {
    return {
      student: displayName,
      submittedAt: timeTextOf(row),
      module: moduleOf(row),
      questionId: questionOf(row),
      questionText: questionTextOf(row),
      score: numberOf(row, ['score', '得分'], INDEX.score),
      total: numberOf(row, ['total', '总分'], INDEX.total),
      result: resultOf(row),
      status: statusOf(row),
      answer: String(answerOf(row) == null ? '' : answerOf(row)).slice(0, 300)
    };
  }

  function buildAliases(roster) {
    var aliases = {};
    roster.forEach(function (name, index) { aliases[normalizeName(name)] = '学生' + String(index + 1).padStart(2, '0'); });
    return aliases;
  }

  function cleanRows(rows, options) {
    rows = Array.isArray(rows) ? rows : [];
    options = options || {};
    var lesson = String(options.lesson || '');
    var roster = (options.roster || []).map(function (name) { return String(name); }).filter(function (name) {
      var normalized = normalizeName(name);
      return normalized && normalized !== '__class__' && !TEST_ACCOUNT.test(normalized);
    });
    var rosterMap = {};
    roster.forEach(function (name) { rosterMap[normalizeName(name)] = name; });
    var lessonRows = rows.filter(function (row) { return lessonOf(row) === lesson; });
    var preRows = lessonRows.filter(function (row) { return stageOf(row) === 'pre_class'; });
    var excluded = {}, accepted = [];
    preRows.forEach(function (row) {
      var reason = classifyExcluded(studentOf(row), rosterMap);
      if (reason) {
        var normalized = normalizeName(studentOf(row)) || '(空账号)';
        var item = excluded[normalized] || (excluded[normalized] = { reason: reason, records: 0 });
        item.records++;
        return;
      }
      accepted.push(row);
    });
    var latest = {}, order = {};
    accepted.forEach(function (row, index) {
      var key = dedupeKey(row, options.progressData);
      var previous = latest[key];
      if (!previous || timeOf(row) > timeOf(previous) || (timeOf(row) === timeOf(previous) && index > order[key])) {
        latest[key] = row;
        order[key] = index;
      }
    });
    var deduped = Object.keys(latest).map(function (key) { return latest[key]; }).sort(function (a, b) { return timeOf(a) - timeOf(b); });
    var reasons = {};
    Object.keys(excluded).forEach(function (key) {
      var reason = excluded[key].reason;
      var bucket = reasons[reason] || (reasons[reason] = { accounts: 0, records: 0 });
      bucket.accounts++;
      bucket.records += excluded[key].records;
    });
    return {
      lessonRows: lessonRows,
      preRows: preRows,
      rows: deduped,
      roster: roster,
      rosterMap: rosterMap,
      quality: {
        rawRecords: preRows.length,
        formalRecordsBeforeDedupe: accepted.length,
        formalRecords: deduped.length,
        excludedAccounts: Object.keys(excluded).length,
        excludedRecords: preRows.length - accepted.length,
        excludedReasons: Object.keys(reasons).sort().map(function (reason) { return { reason: reason, accounts: reasons[reason].accounts, records: reasons[reason].records }; }),
        duplicatesCollapsed: accepted.length - deduped.length,
        pendingReview: deduped.filter(isPending).length
      }
    };
  }

  function completionFor(cleaned, options) {
    var byStudent = {};
    cleaned.rows.forEach(function (row) {
      var key = normalizeName(studentOf(row));
      (byStudent[key] || (byStudent[key] = [])).push(row);
    });
    var progressData = options.progressData;
    var students = cleaned.roster.map(function (name) {
      var normalized = normalizeName(name), rows = byStudent[normalized] || [], rate = 0;
      if (rows.length && progressData && typeof progressData.fromRows === 'function') {
        var canonicalRows = rows.map(function (row) {
          var copy = Object.assign({}, row, { studentName: name });
          if (Array.isArray(row.__values)) copy.__values = row.__values.slice();
          return copy;
        });
        rate = Number(progressData.fromRows(canonicalRows, { student: name, lesson: options.lesson, expectedSessions: options.expectedSessions }).rates.pre_class) || 0;
      } else if (rows.length) {
        rate = rows.some(isSummary) ? 1 : 0;
      }
      var status = !rows.length ? 'not_started' : rate >= 0.999 ? 'complete' : 'partial';
      return { name: name, status: status, progressRate: rate, records: rows.length };
    });
    var counts = { complete: 0, partial: 0, not_started: 0 };
    students.forEach(function (student) { counts[student.status]++; });
    var total = students.length, observed = counts.complete + counts.partial;
    return {
      rosterTotal: total,
      complete: counts.complete,
      partial: counts.partial,
      notStarted: counts.not_started,
      observed: observed,
      completePercent: roundPercent(counts.complete, total),
      partialPercent: roundPercent(counts.partial, total),
      notStartedPercent: roundPercent(counts.not_started, total),
      sampleStatement: observed ? '以下诊断基于 ' + observed + '/' + total + ' 名已有预习记录的学生，不代表全班整体掌握情况。' : '当前正式名单暂无有效预习记录；暂无证据，不能判断掌握情况。',
      students: students
    };
  }

  function aggregateIssues(cleaned) {
    var groups = {};
    cleaned.rows.filter(function (row) { return isObjective(row) || isPending(row); }).forEach(function (row) {
      issueLabels(row).forEach(function (meta) {
        var key = meta.kind + '|' + meta.label;
        var group = groups[key] || (groups[key] = { id: 'issue-' + (Object.keys(groups).length + 1), label: meta.label, kind: meta.kind, answered: {}, wrong: {}, involved: {}, pending: {}, evidence: [] });
        var student = cleaned.rosterMap[normalizeName(studentOf(row))] || studentOf(row);
        group.involved[normalizeName(student)] = student;
        if (isObjective(row)) {
          group.answered[normalizeName(student)] = student;
          if (isWrong(row)) group.wrong[normalizeName(student)] = student;
        }
        if (isPending(row)) group.pending[normalizeName(student)] = student;
        group.evidence.push(compactEvidence(row, student));
      });
    });
    return Object.keys(groups).map(function (key) {
      var group = groups[key];
      var answered = Object.keys(group.answered).length, wrong = Object.keys(group.wrong).length;
      return {
        id: group.id,
        label: group.label,
        kind: group.kind,
        answeredStudents: answered,
        wrongStudents: wrong,
        errorRate: answered ? wrong / answered : null,
        involvedStudents: Object.keys(group.involved).length,
        pendingReview: Object.keys(group.pending).length,
        wrongStudentNames: Object.keys(group.wrong).map(function (name) { return group.wrong[name]; }),
        involvedStudentNames: Object.keys(group.involved).map(function (name) { return group.involved[name]; }),
        evidence: group.evidence
      };
    }).filter(function (issue) { return issue.wrongStudents > 0 || issue.pendingReview > 0; }).sort(function (a, b) {
      return b.wrongStudents - a.wrongStudents || (b.errorRate || 0) - (a.errorRate || 0) || b.answeredStudents - a.answeredStudents || a.label.localeCompare(b.label);
    }).slice(0, 5);
  }

  function objectiveSummary(rows) {
    var objective = rows.filter(isObjective), correct = objective.filter(function (row) { return !isWrong(row); }).length;
    return { records: objective.length, correct: correct, accuracy: objective.length ? correct / objective.length : null };
  }

  function vocabularyCatalog(lessonData) {
    return (lessonData && Array.isArray(lessonData.vocabulary) ? lessonData.vocabulary : []).map(function (item) {
      return { id: String(item.id || ''), word: String(item.hanzi || item.word || '').trim(), pinyin: String(item.pinyin || '').trim(), english: String(item.english || '').trim() };
    }).filter(function (item) { return item.word; });
  }

  function vocabularyForRow(row, catalog) {
    var embedded = parseJson(answerOf(row));
    var directLabels = splitLabels(value(row, ['kp', 'knowledgePoint', 'knowledgePoints', '知识点', 'weakPoints', 'weakPoint', '薄弱点'], null));
    var text = [questionOf(row), questionTextOf(row), moduleOf(row)].join(' ');
    var exactAnswers = [];
    if (embedded && embedded.mode === 'ranked_vocab_preview_v1' && Number(embedded.wrongCount || 0) === 0 && embedded.answers) {
      exactAnswers = Object.keys(embedded.answers).map(function (key) { return String(embedded.answers[key] || '').trim(); });
    }
    return catalog.filter(function (item) {
      if (directLabels.indexOf(item.word) >= 0 || exactAnswers.indexOf(item.word) >= 0) return true;
      return item.word.length > 1 && text.indexOf(item.word) >= 0;
    });
  }

  function vocabularySummary(cleaned, coverage, options) {
    var catalog = vocabularyCatalog(options.lessonData), groups = {};
    var eligible = {};
    coverage.students.filter(function (student) { return student.status !== 'not_started'; }).forEach(function (student) { eligible[normalizeName(student.name)] = true; });
    cleaned.rows.filter(function (row) { return eligible[normalizeName(studentOf(row))] && isObjective(row); }).forEach(function (row) {
      vocabularyForRow(row, catalog).forEach(function (item) {
        var group = groups[item.id || item.word] || (groups[item.id || item.word] = { id: item.id, word: item.word, pinyin: item.pinyin, english: item.english, answered: {}, correct: {}, wrong: {}, evidence: [] });
        var key = normalizeName(studentOf(row)), displayName = cleaned.rosterMap[key] || studentOf(row);
        group.answered[key] = displayName;
        if (isWrong(row)) group.wrong[key] = displayName;
        else group.correct[key] = displayName;
        group.evidence.push(compactEvidence(row, displayName));
      });
    });
    var items = Object.keys(groups).map(function (key) {
      var group = groups[key], answered = Object.keys(group.answered).length, correct = Object.keys(group.correct).length, wrong = Object.keys(group.wrong).length;
      return { id: group.id, word: group.word, pinyin: group.pinyin, english: group.english, answeredStudents: answered, correctStudents: correct, wrongStudents: wrong, accuracy: answered ? correct / answered : null, evidence: group.evidence };
    }).sort(function (a, b) { return (b.accuracy || 0) - (a.accuracy || 0) || b.answeredStudents - a.answeredStudents || a.word.localeCompare(b.word); });
    return {
      catalogSize: catalog.length,
      evidenceWords: items.length,
      eligibleStudents: Object.keys(eligible).length,
      strong: items.filter(function (item) { return item.accuracy != null && item.accuracy >= 0.8; }),
      weak: items.filter(function (item) { return item.accuracy != null && item.accuracy < 0.8; }).sort(function (a, b) { return a.accuracy - b.accuracy || b.answeredStudents - a.answeredStudents; }),
      items: items,
      note: items.length ? '仅统计题目、知识点或无错词汇挑战中可与本课词表可靠对应的词。' : catalog.length ? '本课词表已加载，但当前有效记录缺少可追溯到单词的客观作答证据。' : '尚未加载本课词表，无法生成词汇强弱判断。'
    };
  }

  function explicitDuration(row) {
    var direct = numberOf(row, ['durationMs', 'elapsedMs', 'timeSpentMs', '用时毫秒'], null);
    var embedded = parseJson(answerOf(row));
    var taskMs = direct != null ? direct : Number(embedded.durationMs || embedded.elapsedMs || embedded.timeSpentMs);
    var stageMs = Number(embedded.matchSeconds) * 1000;
    return {
      taskMs: Number.isFinite(taskMs) && taskMs > 0 && taskMs <= 7200000 ? taskMs : null,
      stageMs: Number.isFinite(stageMs) && stageMs > 0 && stageMs <= 7200000 ? stageMs : null
    };
  }

  function timingSummary(rows) {
    var task = [], stages = [], students = {};
    rows.forEach(function (row) {
      var duration = explicitDuration(row);
      if (duration.taskMs != null) { task.push(duration.taskMs); students[normalizeName(studentOf(row))] = true; }
      if (duration.stageMs != null) stages.push(duration.stageMs);
    });
    function average(values) { return values.length ? Math.round(values.reduce(function (sum, item) { return sum + item; }, 0) / values.length) : null; }
    return {
      averageTaskMs: average(task),
      taskSamples: task.length,
      taskStudents: Object.keys(students).length,
      averageTimedStageMs: average(stages),
      timedStageSamples: stages.length,
      note: task.length ? '平均用时只采用记录中明确保存的整项任务 durationMs/elapsedMs，不用首末提交时间推算。' : '当前有效记录未保存整项任务用时；为避免把中断时间误算为学习时间，不用提交时间差推算。'
    };
  }

  function likelyCause(question, accuracy, answeredStudents, vocabularyWords) {
    if (answeredStudents < 2) return '样本较少，暂不能归因；建议课堂用同类题复核。';
    if (accuracy >= 0.8) return '当前完成较好，未见集中错误；可用迁移题确认是否真正掌握。';
    var text = (question.label + ' ' + question.module).toLowerCase();
    if (vocabularyWords.length || /词|配对|认读|vocab/.test(text)) return '可能是词义辨认、近义干扰或语境匹配不稳。';
    if (/排序|语序|ordering/.test(text)) return '可能是句子结构或语序规则不稳。';
    return '可能是题意理解或相关知识点辨析不稳，需用同类题进一步确认。';
  }

  function questionSummary(cleaned, options) {
    var catalog = vocabularyCatalog(options.lessonData), groups = {};
    cleaned.rows.filter(isObjective).forEach(function (row) {
      var label = questionTextOf(row) || questionOf(row) || moduleOf(row) || '未标注题目';
      var key = [sessionOf(row, options.progressData), questionOf(row) || label, moduleOf(row)].join('|');
      var group = groups[key] || (groups[key] = { id: 'question-' + (Object.keys(groups).length + 1), label: label, module: moduleOf(row), answered: {}, score: 0, total: 0, correct: 0, attempts: 0, evidence: [], vocabulary: {} });
      var studentKey = normalizeName(studentOf(row)), displayName = cleaned.rosterMap[studentKey] || studentOf(row);
      group.answered[studentKey] = displayName;
      group.score += numberOf(row, ['score', '得分'], INDEX.score) || 0;
      group.total += numberOf(row, ['total', '总分'], INDEX.total) || 0;
      group.correct += isWrong(row) ? 0 : 1;
      group.attempts++;
      vocabularyForRow(row, catalog).forEach(function (item) { group.vocabulary[item.word] = true; });
      group.evidence.push(compactEvidence(row, displayName));
    });
    return Object.keys(groups).map(function (key) {
      var group = groups[key], answered = Object.keys(group.answered).length, accuracy = group.total ? group.score / group.total : (group.attempts ? group.correct / group.attempts : null), words = Object.keys(group.vocabulary);
      var item = { id: group.id, label: group.label, module: group.module, answeredStudents: answered, attempts: group.attempts, score: group.score, total: group.total, accuracy: accuracy, vocabulary: words, evidence: group.evidence };
      item.possibleCause = likelyCause(item, accuracy, answered, words);
      return item;
    }).sort(function (a, b) { return (a.accuracy == null ? 2 : a.accuracy) - (b.accuracy == null ? 2 : b.accuracy) || b.answeredStudents - a.answeredStudents || a.label.localeCompare(b.label); });
  }

  function buildSuggestions(report) {
    var suggestions = [];
    if (!report.coverage.observed) {
      suggestions.push({ type: 'coverage', evidence: '正式名单 ' + report.coverage.rosterTotal + ' 人中尚无有效预习记录。', action: '先进行一道全员快速诊断题，暂不据此删减或重讲课程内容。', confirmation: '现场统计全员作答结果后再决定讲解深度。' });
    } else if (!report.sample.sufficient) {
      suggestions.push({ type: 'coverage', evidence: '目前只有 ' + report.coverage.observed + '/' + report.coverage.rosterTotal + ' 名学生留下有效预习记录，低于判断阈值 ' + report.sample.minimum + ' 人。', action: '先做全员快速诊断，再使用当前观察结果安排临时分层。', confirmation: '用同知识点的一道即时题确认错误是否扩展到全班。' });
    }
    report.issues.forEach(function (issue) {
      if (!issue.wrongStudents) return;
      var common = issue.answeredStudents >= 2 && issue.wrongStudents >= Math.ceil(issue.answeredStudents / 2);
      suggestions.push({
        type: common ? 'common_error' : 'focused_support',
        issueId: issue.id,
        evidence: '“' + issue.label + '”已作答 ' + issue.answeredStudents + ' 人，其中 ' + issue.wrongStudents + ' 人出错（' + issue.wrongStudents + '/' + issue.answeredStudents + '，' + roundPercent(issue.wrongStudents, issue.answeredStudents) + '%）。',
        action: common ? '用两个对比例句做约 5 分钟辨析，并安排一道同类练习。' : '给相关学生提供分层提示或同伴支持，其余学生继续迁移任务。',
        confirmation: '随后用一道全员即时题确认是否需要进一步重讲。'
      });
    });
    if (report.quality.pendingReview) {
      suggestions.push({ type: 'pending_review', evidence: '当前有 ' + report.quality.pendingReview + ' 条主观或开放作答待批改。', action: '先审核这些作答，再判断表达类内容是否需要加强。', confirmation: '批改后用统一量规抽查 2—3 个代表性答案。' });
    }
    if (report.sample.sufficient && report.objective.records && report.objective.accuracy >= 0.8 && !report.issues.some(function (issue) { return issue.wrongStudents >= Math.ceil(issue.answeredStudents / 2); })) {
      suggestions.push({ type: 'stable', evidence: '有效样本覆盖充分，客观作答正确 ' + report.objective.correct + '/' + report.objective.records + '（' + roundPercent(report.objective.correct, report.objective.records) + '%），未见集中共同错误。', action: '保留简短复现，把更多课堂时间用于迁移表达或拓展任务。', confirmation: '用一项新情境输出确认学生能否迁移使用。' });
    }
    return suggestions.slice(0, 6);
  }

  function createReport(rows, options) {
    options = options || {};
    var cleaned = cleanRows(rows, options);
    var coverage = completionFor(cleaned, options);
    var minimum = Math.max(Number(options.minimumStudents) || DEFAULT_MIN_STUDENTS, Math.ceil(coverage.rosterTotal / 2));
    var report = {
      schemaVersion: 2,
      lesson: String(options.lesson || ''),
      lessonTitle: String(options.lessonTitle || ''),
      generatedAt: options.generatedAt || new Date().toISOString(),
      dataSource: String(options.dataSource || 'ClassPro 学习记录'),
      scope: '当前课程正式名单的课前记录；不修改原始记录',
      coverage: coverage,
      quality: cleaned.quality,
      sample: { minimum: minimum, sufficient: coverage.observed >= minimum, conclusion: !coverage.observed ? '暂无证据' : coverage.observed >= minimum ? '样本达到班级判断阈值' : '需课堂补测，仅形成观察提示' },
      objective: objectiveSummary(cleaned.rows),
      vocabulary: vocabularySummary(cleaned, coverage, options),
      timing: timingSummary(cleaned.rows),
      questions: questionSummary(cleaned, options),
      issues: aggregateIssues(cleaned),
      aliases: buildAliases(cleaned.roster)
    };
    report.suggestions = buildSuggestions(report);
    return report;
  }

  function anonymizeReport(report) {
    var copy = JSON.parse(JSON.stringify(report));
    var aliases = copy.aliases || {};
    function escapeRegExp(text) { return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function redactText(text) {
      var result = String(text);
      Object.keys(aliases).sort(function (a, b) { return b.length - a.length; }).forEach(function (name) {
        var pattern = escapeRegExp(name).replace(/ /g, '\\s+');
        result = result.replace(new RegExp(pattern, 'gi'), aliases[name]);
      });
      return result;
    }
    function redact(value) {
      if (typeof value === 'string') return redactText(value);
      if (Array.isArray(value)) return value.map(redact);
      if (value && typeof value === 'object') {
        Object.keys(value).forEach(function (key) { value[key] = redact(value[key]); });
      }
      return value;
    }
    copy = redact(copy);
    delete copy.aliases;
    return copy;
  }

  function toExport(report, decisions, anonymous) {
    var copy = anonymous ? anonymizeReport(report) : JSON.parse(JSON.stringify(report));
    delete copy.aliases;
    (copy.issues || []).forEach(function (issue) {
      issue.evidenceCount = (issue.evidence || []).length;
      delete issue.evidence;
    });
    (copy.vocabulary && copy.vocabulary.items || []).forEach(function (item) {
      item.evidenceCount = (item.evidence || []).length;
      delete item.evidence;
    });
    (copy.vocabulary && copy.vocabulary.strong || []).forEach(function (item) { delete item.evidence; });
    (copy.vocabulary && copy.vocabulary.weak || []).forEach(function (item) { delete item.evidence; });
    (copy.questions || []).forEach(function (item) {
      item.evidenceCount = (item.evidence || []).length;
      delete item.evidence;
    });
    copy.anonymous = !!anonymous;
    copy.teacherDecisions = {
      keep: String(decisions && decisions.keep || ''),
      strengthen: String(decisions && decisions.strengthen || ''),
      reduce: String(decisions && decisions.reduce || ''),
      confirm: String(decisions && decisions.confirm || ''),
      savedAt: String(decisions && decisions.savedAt || '')
    };
    return copy;
  }

  return {
    DEFAULT_MIN_STUDENTS: DEFAULT_MIN_STUDENTS,
    normalizeName: normalizeName,
    cleanRows: cleanRows,
    createReport: createReport,
    anonymizeReport: anonymizeReport,
    toExport: toExport
  };
});
