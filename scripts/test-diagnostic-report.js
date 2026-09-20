'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const diagnostic = require('../source/shared/diagnostic-report.js');
const progressData = require('../source/shared/progress-data.js');

const roster = Array.from({ length: 12 }, (_, index) => `Student ${index + 1}`);
const base = { lesson: 'HSK3-L01', stage: '预习' };
const row = (studentName, fields = {}) => Object.assign({ studentName, submittedAt: '2026-09-01T08:00:00Z' }, base, fields);
const summary = (studentName, session) => row(studentName, {
  module: 'pre_progress_summary',
  sessionCode: session,
  answer: JSON.stringify({ session, rate: 1 })
});

function report(rows, extra = {}) {
  return diagnostic.createReport(rows, Object.assign({ lesson: 'HSK3-L01', roster, progressData, generatedAt: '2026-09-20T00:00:00Z' }, extra));
}

const rows = [
  summary('Student 1', 'A'), summary('Student 1', 'B'), summary('Student 1', 'C'),
  row('  student   2 ', { module: 'pre_step_R0' }),
  row('Outsider', { module: 'quiz', questionId: 'q0', score: 0, total: 1 }),
  row('__CLASS__', { module: 'quiz', questionId: 'q0', score: 0, total: 1 }),
  row('Test', { module: 'quiz', questionId: 'q0', score: 0, total: 1 }),
  row('Student 2', { module: 'quiz', questionId: 'q1', score: 0, total: 1, weakPoints: '结果补语', submittedAt: '2026-09-01T08:01:00Z' }),
  row('Student 2', { module: 'quiz', questionId: 'q1', score: 1, total: 1, weakPoints: '结果补语', submittedAt: '2026-09-01T08:02:00Z' }),
  row('Student 2', { module: 'subjective', questionId: 'open1', openEnded: 'yes', status: '待批改', answer: '我去机场接朋友。' })
];

const result = report(rows);
assert.strictEqual(result.coverage.rosterTotal, 12, 'formal roster is the denominator');
assert.strictEqual(result.coverage.complete, 1, 'three completed HSK3 sessions are complete');
assert.strictEqual(result.coverage.partial, 1, 'a student with valid but incomplete records is partial');
assert.strictEqual(result.coverage.notStarted, 10, 'students without records are not started');
assert.strictEqual(result.coverage.complete + result.coverage.partial + result.coverage.notStarted, 12, 'completion states partition the roster');
assert.strictEqual(result.quality.excludedAccounts, 3, 'non-roster, class summary and test accounts are reported');
assert.strictEqual(result.quality.excludedRecords, 3, 'excluded records do not enter the formal report');
assert.deepStrictEqual(result.quality.excludedReasons.map(item => item.reason).sort(), ['班级汇总账号', '测试账号', '非正式名单账号'].sort());
assert.strictEqual(result.quality.duplicatesCollapsed, 1, 'repeated submissions collapse to the latest attempt');
assert.strictEqual(result.objective.records, 1, 'summary and progress marker records do not enter objective accuracy');
assert.strictEqual(result.objective.correct, 1, 'the latest objective submission is retained');
assert.strictEqual(result.quality.pendingReview, 1, 'pending subjective work is reported separately');
assert.strictEqual(report([], { roster: roster.concat('Test') }).coverage.rosterTotal, 12, 'obvious test accounts are not part of the formal denominator');
assert.strictEqual(result.sample.sufficient, false, 'two observed students are below the sample boundary');
assert.match(result.sample.conclusion, /需课堂补测/);
assert.ok(!JSON.stringify(result.suggestions).includes('全班掌握'), 'insufficient samples do not claim class mastery');

const noData = report([]);
assert.strictEqual(noData.coverage.observed, 0);
assert.strictEqual(noData.sample.conclusion, '暂无证据');
assert.strictEqual(noData.objective.accuracy, null, 'missing evidence is not represented as zero mastery');
assert.match(noData.coverage.sampleStatement, /暂无证据/);
assert.strictEqual(noData.timing.averageTaskMs, null, 'missing timing evidence stays null');

const visual = report([
  row('Student 1', { module: '词汇测试', questionId: 'word-1', questionText: '选择“机场”的意思', score: 1, total: 1, answer: JSON.stringify({ durationMs: 60000 }) }),
  row('Student 2', { module: '词汇测试', questionId: 'word-1', questionText: '选择“机场”的意思', score: 0, total: 1 }),
  row('Student 1', { module: '词汇测试', questionId: 'word-2', questionText: '选择“接”的意思', kp: '接', score: 1, total: 1 })
], { lessonData: { vocabulary: [
  { id: 'v1', hanzi: '机场', pinyin: 'jīchǎng', english: 'airport' },
  { id: 'v2', hanzi: '接', pinyin: 'jiē', english: 'meet' }
] } });
assert.strictEqual(visual.vocabulary.catalogSize, 2);
assert.strictEqual(visual.vocabulary.evidenceWords, 2, 'word-linked objective questions populate vocabulary evidence');
assert.strictEqual(visual.vocabulary.items.find(item => item.word === '机场').accuracy, 0.5);
assert.strictEqual(visual.vocabulary.items.find(item => item.word === '接').accuracy, 1);
assert.strictEqual(visual.timing.averageTaskMs, 60000, 'explicit whole-task timing is averaged');
assert.strictEqual(visual.timing.taskSamples, 1);
assert.strictEqual(visual.questions.length, 2, 'objective questions are aggregated separately');
assert.match(visual.questions.find(item => item.label.indexOf('机场') >= 0).possibleCause, /词义/);

const named = report([
  row('Student 1', { module: 'quiz', questionId: 'q1', score: 0, total: 1, kp: '结果补语', answer: 'Student 1 的答案' }),
  row('Student 2', { module: 'quiz', questionId: 'q1', score: 1, total: 1, kp: '结果补语' })
]);
const anonA = diagnostic.toExport(named, { keep: '保留导入活动' }, true);
const anonB = diagnostic.toExport(named, { keep: '保留导入活动' }, true);
assert.deepStrictEqual(anonA.coverage.students.map(student => student.name), anonB.coverage.students.map(student => student.name), 'anonymous aliases are stable');
const serialized = JSON.stringify(anonA);
roster.forEach(name => assert.ok(!serialized.includes(name), `anonymous export must not contain ${name}`));
assert.ok(serialized.includes('学生01'), 'anonymous export includes stable aliases');
assert.ok(!serialized.includes('Student 1 的答案'), 'anonymous export does not leak names embedded in answer text');
assert.ok(!Object.prototype.hasOwnProperty.call(anonA.issues[0], 'evidence'), 'diagnostic export omits raw answer evidence');
assert.strictEqual(anonA.teacherDecisions.keep, '保留导入活动');

const actualRows = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/learning-records.json'), 'utf8'));
const hsk3Roster = [
  'MTEWELE THEOFRIDA PHILEMON', 'LILLA LISA APSA', 'MTUI ELISIA LAURENCE', 'MTAMBI ALBERT EVANS',
  'MAKAA ATHUMAN SHABANI', 'BURIAN JERALD JURGEN', 'MABAMBA PAULINE ILDEPHONCE', 'MACHIRA MACHIRA SULEIMAN',
  'JAIPONG MISS SIRIWAN', 'CHERYL GRACIA WIJAYA', 'NI PUTU LUNA CAHYA DEWI', 'Ali Altphan'
];
const actual = diagnostic.createReport(actualRows, { lesson: 'HSK3-L01', roster: hsk3Roster, progressData, generatedAt: '2026-09-20T00:00:00Z' });
assert.strictEqual(actual.coverage.rosterTotal, 12);
assert.strictEqual(actual.coverage.complete + actual.coverage.partial + actual.coverage.notStarted, 12);
assert.strictEqual(actual.sample.sufficient, false, 'HSK3-L01 real pre-class sample requires an in-class check');

console.log('Diagnostic report tests passed.');
console.log(JSON.stringify({
  hsk3L01: {
    allLessonRecords: actualRows.filter(item => item.lesson === 'HSK3-L01').length,
    rawPreClassRecords: actual.quality.rawRecords,
    excludedAccounts: actual.quality.excludedAccounts,
    excludedRecords: actual.quality.excludedRecords,
    formalRecords: actual.quality.formalRecords,
    duplicatesCollapsed: actual.quality.duplicatesCollapsed,
    observedStudents: actual.coverage.observed,
    complete: actual.coverage.complete,
    partial: actual.coverage.partial,
    notStarted: actual.coverage.notStarted,
    sampleConclusion: actual.sample.conclusion
  }
}, null, 2));
