const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { build, outputPath, formalPath } = require('./build-hsk3-l09-use-profile');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'source', 'in-class', 'l08-use-pilot.js');
const bridgePath = path.join(root, 'source', 'in-class', 'l08-use-student-bridge.js');
const pagePath = path.join(root, 'source', 'in-class', 'l08-use-pilot.html');
const teacherPath = path.join(root, 'source', 'in-class', 'teacher.html');
const studentPath = path.join(root, 'source', 'in-class', 'student.html');
const curriculumPath = path.join(root, 'source', 'data-model', 'hsk3-curriculum.js');
const teacherHomePath = path.join(root, 'source', 'teacher', 'index.html');

function assert(condition, message) { if (!condition) throw new Error(message); }
function read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function hash(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').toUpperCase(); }
function collectIds(value, result) {
  if (!value || typeof value !== 'object') return result;
  if (typeof value.id === 'string') result.add(value.id);
  Object.values(value).forEach(item => {
    if (Array.isArray(item)) item.forEach(child => collectIds(child, result));
    else collectIds(item, result);
  });
  return result;
}

const expected = build();
const actual = JSON.parse(read(outputPath));
const formal = JSON.parse(read(formalPath));
assert(JSON.stringify(actual) === JSON.stringify(expected), 'Generated L9 profile is stale or nondeterministic');
assert(actual.schemaVersion === 'classpro-use-profile/v3', 'L9 profile must use the public v3 schema');
assert(actual.experiment.id === 'l09-use-pilot-v1' && actual.experiment.sourceLesson === 'HSK3-L09', 'L9 profile identity is wrong');
assert(actual.sources.lesson.sha256 === hash(formalPath), 'L9 profile must point at the unchanged current formal lesson');
assert(actual.useGroups.length === 4 && actual.useGroups.every((item, index) => item.id === `T${index + 1}` && item.textIndex === index), 'L9 must keep four text-aligned MINI loops');
assert(actual.coreEvidence.join(',') === 'entry_expression,actual_learning_path,exit_expression', 'L9 must keep exactly three core evidence types');
assert(actual.evidencePolicy.pathEvent === 'opened', 'Learning path must record resources actually opened');
assert(actual.timerPolicy.miniLoop.optionsMinutes.join(',') === '3,4,5' && actual.timerPolicy.miniLoop.defaultMinutes === 3, 'MINI loop timer must offer 3-5 minutes');
assert(actual.timerPolicy.vocabularyFocus.optionsMinutes.join(',') === '2,3,4,5' && actual.timerPolicy.vocabularyFocus.defaultMinutes === 2, 'Vocabulary timer must offer 2-5 minutes');
assert(actual.timerPolicy.autoClose === false, 'Countdown must not auto-submit or auto-close interactions');

assert(actual.textLearning.reduce((sum, item) => sum + item.overviewChoices.length, 0) === 12, 'L9 must provide twelve overall-choice items');
assert(actual.textLearning.reduce((sum, item) => sum + item.detailQuestions.length, 0) === 17, 'L9 must provide the frozen seventeen detail questions');
actual.textLearning.forEach((item, index) => {
  assert(item.detailMode === 'config', `Text ${index + 1} must use the frozen detail metadata`);
  assert(item.overviewChoices.length === 3, `Text ${index + 1} needs three overview questions`);
  assert(new Set(item.overviewChoices.map(question => question.correctIndex)).size >= 2, `Text ${index + 1} overview answers must not all stay in one position`);
  item.detailQuestions.forEach(question => assert(question.id && question.questionCn && question.questionPinyin && question.answer && question.answerPinyin && question.acceptedAnswers.length, `${question.id || 'Detail question'} is missing metadata`));
});

const catalog = actual.vocabularyCatalog;
assert(catalog.length === 28 && new Set(catalog.map(word => word.id)).size === 28, 'Vocabulary catalog must contain all 28 L9 words once');
assert(catalog.filter(word => word.tier === 'expression').length === 12, 'L9 must keep 12 expression-core words');
assert(catalog.filter(word => word.tier === 'understanding').length === 13, 'L9 must keep 13 understanding-core words');
assert(catalog.filter(word => word.tier === 'context').length === 3, 'L9 must keep 3 contextual-support words');
const activities = actual.vocabularyGroups.flatMap(group => group.activities);
actual.vocabularyGroups.forEach(group => {
  assert(group.recognitionWordIds.length >= 4, `${group.id} must offer at least four words for recognition`);
  group.recognitionWordIds.forEach(id => {
    assert(group.wordIds.includes(id), `${group.id} recognition word is outside its text vocabulary: ${id}`);
    const word = catalog.find(item => item.id === id);
    assert(word && word.allowedTypes.includes('recognition'), `${id} is not enabled for recognition`);
    assert(word.meaningCn && word.meaningCn.length <= 30 && !/[A-Za-z]/.test(word.meaningCn), `${id} needs a short Chinese explanation`);
  });
});
catalog.filter(word => word.tier === 'expression').forEach(word => {
  assert(activities.some(item => item.type === 'input' && item.targetWordIds.includes(word.id)), `${word.id} needs an input activity`);
  assert(activities.some(item => item.type === 'collocation' && item.targetWordIds.includes(word.id)), `${word.id} needs a collocation/use activity`);
});
activities.filter(item => item.type === 'shape').forEach(item => {
  assert(!item.promptCn.includes(item.answer) && !item.stimulus.includes(item.answer), `${item.id} shape prompt reveals the target character`);
  assert(!/[\u3400-\u9fff]/u.test(item.stimulus), `${item.id} shape stimulus must use pinyin instead of hanzi`);
});
activities.filter(item => item.promptMode === 'open_use').forEach(item => {
  assert(item.promptCn.includes('最多两句话') && item.promptEn, `${item.id} must limit production to two sentences and include an English note`);
});

const formalIds = collectIds(formal, new Set());
actual.useGroups.flatMap(group => group.resourceLinks).forEach(link => assert(formalIds.has(link.id), `Configured resource does not exist: ${link.id}`));
actual.resourceOverrides.forEach(override => assert(formalIds.has(override.id), `Override target does not exist: ${override.id}`));
assert(actual.useGroups[2].linkedResources.grammar.grammarIndex === 2, 'T3 must route to g09_03');
assert(!actual.useGroups[3].linkedResources.grammar && !actual.textLearning[3].grammarBridge, 'T4 must not invent a fourth formal grammar point');

assert(actual.nativeTeaching.preserveCourseStyles === true, 'Profile must preserve native course teaching styles');
assert(actual.nativeTeaching.grammar.phases.join(',') === '观察例句,结构归纳,课堂表达,跟进练习', 'L9 grammar phase contract changed');
formal.grammar.forEach(grammar => {
  const note = formal.grammarTeachingNotes[grammar.id];
  assert(note && note.presentationMode === 'progressive_grammar', `${grammar.id} lost progressive grammar mode`);
  assert((grammar.examples || []).length >= 5, `${grammar.id} lost its complete observation examples`);
  assert(note.structure && Array.isArray(note.observeHighlights) && note.observeHighlights.length >= 5, `${grammar.id} lost structure highlights`);
  assert(Array.isArray(note.oralQuestions) && note.oralQuestions.length >= 4, `${grammar.id} lost classroom expression prompts`);
  assert(Array.isArray(note.followUp) && note.followUp.length >= 2, `${grammar.id} lost picture follow-up tasks`);
});

const runtime = read(runtimePath);
const bridge = read(bridgePath);
const page = read(pagePath);
const teacher = read(teacherPath);
const student = read(studentPath);
const curriculum = read(curriculumPath);
const teacherHome = read(teacherHomePath);
assert(runtime.includes("PARAMS.get('lesson')") && runtime.includes("PARAMS.get('profile')"), 'Shared Use runtime must load lesson and profile parameters');
assert(runtime.includes('applyResourceOverrides') && runtime.includes('resourceOverrides'), 'Shared runtime must apply config-only resource overrides');
assert(runtime.includes("type === 'recognition'") && runtime.includes('selectedWords.slice(0, 4)') && runtime.includes('word.meaningCn'), 'Shared runtime must publish one Chinese-meaning item per selected recognition word');
assert(runtime.includes('localStorage.setItem(STORAGE_KEY') && runtime.includes('state.nativeRoute'), 'Use state must persist while native resources are open');
assert(runtime.includes("app.hsk3GrammarPhase = 0") && !runtime.includes('app._tg ='), 'Use must route to native grammar without replacing its renderer');
assert(runtime.includes("timerPicker('miniLoop'") && runtime.includes("timerPicker('vocabularyFocus'") && runtime.includes('timerSeconds: chosenTimerSeconds'), 'Shared teacher runtime must apply configured MINI and vocabulary timers');
assert(runtime.includes('data-use-countdown') && runtime.includes("Time's up") && runtime.includes('setInterval(refreshAllCountdowns, 1000)'), 'Shared teacher runtime must display and refresh the countdown');
assert(runtime.includes('exportVisualReport') && runtime.includes('visualReportHtml') && runtime.includes('-class-report.html'), 'Shared teacher runtime must export a standalone visual classroom report');
assert(runtime.includes('exportTrail') && page.includes('导出原始 JSON') && page.includes('导出可视化报告'), 'Visual report must not replace the raw JSON export');
assert(teacher.includes('hsk3-progressive-grammar') && teacher.includes('hsk3-grammar-follow-grid'), 'Native teacher page must retain L9 progressive grammar rendering');
assert(bridge.includes('EXPECTED_EXPERIMENT') && bridge.includes('CONFIG_URL'), 'Unified student bridge must be profile-driven');
assert(bridge.includes('countdownMarkup(interaction)') && bridge.includes('data-use-countdown') && bridge.includes('setInterval(refreshCountdowns, 1000)'), 'Unified student bridge must display the same interaction countdown');
assert(student.includes('l08-use-student-bridge.js'), 'Unified student page must keep the optional shared bridge');
assert(page.includes('id="useSubtitle"') && !page.includes('第8课 · 四个表达') && !runtime.includes('LESSON 8 · FOUR MINI LOOPS'), 'Shared Use page must not hardcode the L8 lesson label');
assert(curriculum.includes('HSK3-L09') && curriculum.includes('useProfile: "pilot-v1"'), 'L9 curriculum entry must expose the upgrade profile');
assert(teacherHome.includes('legacyClassroomLink') && teacherHome.includes('selectedLesson.useProfile'), 'Teacher home must keep both upgraded and original classroom entries');

console.log('Validated: L9 config runs four text-aligned MINI loops with three core evidence types.');
console.log('Validated: all configured L9 resources and override targets exist in the unchanged formal JSON.');
console.log('Validated: recognition, character form and two-sentence vocabulary production follow the revised L9 rules.');
console.log('Validated: configured MINI and vocabulary countdowns appear on teacher and unified student views without auto-closing.');
console.log('Validated: shared teacher page exports a standalone visual report while retaining raw JSON.');
console.log('Validated: native L9 grammar keeps observation, structure, classroom expression and picture follow-up stages.');
console.log('Validated: shared Use runtime and unified student bridge are lesson/profile driven without L9 pages.');
