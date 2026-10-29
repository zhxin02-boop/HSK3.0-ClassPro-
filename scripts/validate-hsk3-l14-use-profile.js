const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {execFileSync, spawnSync} = require('child_process');
const {build, outputPath, formalPath} = require('./build-hsk3-l14-use-profile');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'source', 'in-class', 'l08-use-pilot.js');
const runtimeHtmlPath = path.join(root, 'source', 'in-class', 'l08-use-pilot.html');
const bridgePath = path.join(root, 'source', 'in-class', 'l08-use-student-bridge.js');
const curriculumPath = path.join(root, 'source', 'data-model', 'hsk3-curriculum.js');
const teacherHomePath = path.join(root, 'source', 'teacher', 'index.html');

function assert(condition, message) { if (!condition) throw new Error(message); }
function read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function normalizedHash(filePath) {
  return crypto.createHash('sha256').update(read(filePath).replace(/\r\n/g, '\n')).digest('hex').toUpperCase();
}
function collectIds(value, result = new Set()) {
  if (!value || typeof value !== 'object') return result;
  if (typeof value.id === 'string') result.add(value.id);
  Object.values(value).forEach(item => Array.isArray(item)
    ? item.forEach(child => collectIds(child, result))
    : collectIds(item, result));
  return result;
}
function normalized(value) { return String(value || '').replace(/[\s，。？！、“”‘’：；]/g, ''); }

const expected = build();
const actual = JSON.parse(read(outputPath));
const formal = JSON.parse(read(formalPath));
const questions = formal.inClass.questionGroups;

assert(JSON.stringify(actual) === JSON.stringify(expected), 'Generated L14 profile is stale or nondeterministic');
assert(actual.sources.lesson.sha256 === normalizedHash(formalPath), 'Profile formal-lesson hash is stale');
assert(actual.schemaVersion === 'classpro-use-profile/v3', 'L14 must use classpro-use-profile/v3');
assert(actual.experiment.id === 'l14-use-pilot-v1' && actual.experiment.sourceLesson === 'HSK3-L14', 'L14 profile identity is wrong');
assert(actual.nativeTeaching.preserveCourseStyles === true, 'Native L14 presentation must remain authoritative');
assert(actual.nativeTeaching.text.preserveDiary === true && formal.texts[3].format === 'diary', 'Text 4 diary presentation is not preserved');

assert(actual.useGroups.length === 4 && actual.textLearning.length === 4, 'L14 needs four text-aligned MINI loops');
const grammarIndexes = [0,1,2,0];
const entryPrompts = [
  '你今天没课，想请同学帮你借本书，书的名字是《汉语世界》。',
  '说说图上或者你自己今天的安排是什么。'
];
actual.useGroups.forEach((group, index) => {
  const number = index + 1;
  assert(group.id === `T${number}` && group.textId === formal.texts[index].id, `${group.id} text mapping is wrong`);
  assert(group.responseMode === 'teacherObservedWithTextOutline', `${group.id} response mode is wrong`);
  assert(group.linkedResources.vocabulary.vocabSession === String(number), `${group.id} vocabulary route is wrong`);
  assert(group.linkedResources.grammar.grammarIndex === grammarIndexes[index], `${group.id} grammar route is wrong`);
  assert(group.linkedResources.text.textIndex === index, `${group.id} text route is wrong`);
  assert(group.linkedResources.practice.module === 'practice' && group.linkedResources.practice.submodule === 't2k', `${group.id} practice module is wrong`);
  assert(group.linkedResources.practice.routeState.t2ki === index, `${group.id} task-card route state is wrong`);
  assert(group.resourceLinks.length === 2, `${group.id} should expose one task and one language-application paragraph link`);
  assert(group.resourceLinks[0].id === `l14_task_0${number}`, `${group.id} primary practice ID is wrong`);
  assert(group.resourceLinks[1].id === `l14_para_0${number}`, `${group.id} paragraph ID is wrong`);
  assert(fs.existsSync(path.join(root, 'source', 'in-class', group.entry.stimulus.image)), `${group.id} entry image is missing`);
  if (entryPrompts[index]) assert(group.entry.promptCn === entryPrompts[index] && group.entry.stimulus.instructionCn === entryPrompts[index], `${group.id} entry prompt is stale`);
});
assert(!JSON.stringify(actual.useGroups).includes('l14_task_05'), 'l14_task_05 must not be a MINI entry');
assert(!JSON.stringify(actual.useGroups).includes('l14_para_05'), 'l14_para_05 must not be a MINI entry');

assert(actual.textLearning.reduce((sum, item) => sum + item.overviewChoices.length, 0) === 12, 'L14 needs twelve overview questions');
assert(actual.textLearning.reduce((sum, item) => sum + item.detailQuestions.length, 0) === 20, 'L14 needs twenty detail questions');
actual.textLearning.forEach((learning, index) => {
  const text = formal.texts[index];
  const note = formal.textTeachingNotes[text.id];
  assert(learning.textId === text.id && learning.useGroupId === `T${index + 1}`, `Text ${index + 1} profile identity is wrong`);
  assert(learning.overviewChoices.length === 3 && learning.detailQuestions.length === 5, `Text ${index + 1} must have 3 overview and 5 detail questions`);
  assert(JSON.stringify(learning.overviewChoices.map(item => [item.id,item.focus,item.questionCn,item.questionPinyin,item.options,item.correctIndex])) === JSON.stringify(note.overallChoices.map(item => [item.id,item.focus,item.question,item.pinyin,item.options,item.correctIndex])), `Text ${index + 1} overview questions drifted from formal L14`);
  assert(JSON.stringify(learning.detailQuestions.map(item => [item.id,item.questionCn,item.questionPinyin,item.answer,item.answerPinyin,item.acceptedAnswers,item.informationPoint])) === JSON.stringify(note.details.map(item => [item.id,item.question,item.question_pinyin,item.answer,item.answer_pinyin,item.acceptedAnswers,item.informationPoint])), `Text ${index + 1} detail questions drifted from formal L14`);
  const overview = new Set(learning.overviewChoices.map(item => normalized(item.questionCn)));
  learning.detailQuestions.forEach(item => {
    assert(item.id && item.questionCn && item.questionPinyin && item.answer && item.answerPinyin && item.acceptedAnswers.length && item.informationPoint, `${item.id || 'Detail question'} lacks required metadata`);
    assert(!overview.has(normalized(item.questionCn)), `${item.id} duplicates an overview question`);
  });
  assert(learning.grammarBridge.grammarIndex === grammarIndexes[index], `Text ${index + 1} grammar bridge is wrong`);
  assert(learning.paragraphPractice.index === index && questions.r4_paragraph_fill[index].id === `l14_para_0${index + 1}`, `Text ${index + 1} paragraph route is wrong`);
  assert(learning.lifeTransfer.promptCn === note.languageAndApplication.personalPrompt, `Text ${index + 1} personal transfer drifted`);
});

formal.grammar.forEach(grammar => {
  const note = formal.grammarTeachingNotes[grammar.id];
  assert(grammar.examples.length === 5, `${grammar.id} must expose five actual renderer examples`);
  assert(grammar.examples.slice(0,3).every(item => item.sourceType === 'textbook'), `${grammar.id} first three examples must be textbook`);
  assert(grammar.examples.slice(3).every(item => item.sourceType === 'teaching_extension'), `${grammar.id} last two examples must be teaching extensions`);
  assert(note.presentationMode === 'progressive_grammar' && note.mergeNoticeObserve === true, `${grammar.id} lost progressive grammar mode`);
  assert(note.examples.length === 5 && note.observeHighlights.length === 5, `${grammar.id} example/highlight rows are not aligned`);
  assert(JSON.stringify(note.examples.map(item => item.hanzi)) === JSON.stringify(grammar.examples.map(item => item.hanzi)), `${grammar.id} renderer examples and note examples differ`);
  assert(note.visualLearning && note.oralQuestions.length >= 4 && note.structureVariants.length >= 2 && note.followUp.length >= 1, `${grammar.id} four-step content is incomplete`);
});

const catalog = actual.vocabularyCatalog;
assert(catalog.length === 27 && new Set(catalog.map(item => item.id)).size === 27, 'Vocabulary catalog must contain all 27 words once');
assert(catalog.filter(item => item.tier === 'expression').length === 16, 'Expression tier must contain 16 words');
assert(catalog.filter(item => item.tier === 'understanding').length === 6, 'Understanding tier must contain 6 words');
assert(catalog.filter(item => item.tier === 'context').length === 5, 'Context tier must contain 5 words');
assert(actual.vocabularyGroups.length === 4, 'L14 needs four vocabulary groups');
const activities = actual.vocabularyGroups.flatMap(group => group.activities);
assert(activities.length > 0 && actual.vocabularyGroups.every(group => group.activities.length > 0), 'Vocabulary activities must not be empty');
assert(new Set(activities.map(item => item.id)).size === activities.length, 'Vocabulary activity IDs must be unique');
actual.vocabularyGroups.forEach(group => {
  assert(group.recognitionWordIds.length === group.wordIds.length, `${group.id} recognition must include all group words`);
  assert(group.recognitionWordIds.every(id => group.wordIds.includes(id)), `${group.id} recognition contains an outside word`);
});
activities.filter(item => item.type === 'shape').forEach(item => {
  assert(item.promptMode === 'form' && item.evaluation === 'automatic' && item.answer && item.acceptedAnswers.includes(item.answer), `${item.id} shape metadata is incomplete`);
  assert(!item.promptCn.includes(item.answer) && !item.stimulus.includes(item.answer), `${item.id} reveals its target before the choices`);
});
activities.filter(item => item.type === 'input').forEach(item => assert(item.promptMode === 'meaning' && item.evaluation === 'automatic' && item.answer && item.acceptedAnswers.includes(item.answer), `${item.id} input metadata is incomplete`));
activities.filter(item => item.type === 'collocation').forEach(item => assert(item.promptMode === 'open_use' && item.evaluation === 'teacher' && item.answer && item.acceptedAnswers.length === 0 && item.promptCn.includes('最多两句话') && item.promptEn, `${item.id} use metadata is incomplete`));

assert(actual.coreEvidence.join(',') === 'entry_expression,actual_learning_path,exit_expression', 'Core evidence must contain exactly the three frozen types');
assert(actual.evidencePolicy.coreTypes.join(',') === actual.coreEvidence.join(',') && actual.evidencePolicy.pathEvent === 'opened', 'Evidence policy is wrong');
assert(actual.timerPolicy.miniLoop.optionsMinutes.join(',') === '3,4,5', 'MINI timer must offer 3, 4 and 5 minutes');
assert(actual.timerPolicy.vocabularyFocus.optionsMinutes.join(',') === '2,3,4,5', 'Vocabulary timer must offer 2, 3, 4 and 5 minutes');
assert(actual.timerPolicy.autoClose === false, 'Timers must only remind, never auto-close');
assert(actual.resourceOverrides.length === 0, 'L14 has no frozen needs_revision overlays');

const formalIds = collectIds(formal);
actual.useGroups.flatMap(group => group.resourceLinks).forEach(link => assert(formalIds.has(link.id), `Missing formal resource ${link.id}`));

const runtime = read(runtimePath);
const runtimeHtml = read(runtimeHtmlPath);
const bridge = read(bridgePath);
const curriculum = read(curriculumPath);
const teacherHome = read(teacherHomePath);
assert(runtime.includes('selected.size < 4') && runtime.includes('configured.slice(0, 4).map'), 'Shared teacher vocabulary selection must allow and render up to four words');
assert(bridge.includes('(interaction.items || []).map'), 'Unified student must render all selected vocabulary items');
assert(runtime.includes("timerPicker('miniLoop'") && runtime.includes("timerPicker('vocabularyFocus'") && bridge.includes('countdownMarkup(interaction)'), 'Shared timer paths are incomplete');
assert(runtime.includes('localStorage.setItem(STORAGE_KEY') && runtime.includes('state.nativeRoute'), 'Use state/native route persistence is missing');
assert(runtime.includes('app.hsk3GrammarPhase = 0') && !runtime.includes('app._tg ='), 'Use must enter native grammar without replacing the native renderer');
assert(runtime.includes("addTrail('resource'") && runtime.includes("stage === 'entry'") && runtime.includes("stage === 'exit'"), 'Three evidence paths are not recordable');
assert(bridge.indexOf('client.subscribe([TOPICS.control, TOPICS.ack]') < bridge.indexOf('sendPresence(true);'), 'Student must subscribe before requesting current state');
assert(!runtime.includes("LESSON === 'HSK3-L14'") && !runtime.includes('LESSON === "HSK3-L14"') && !bridge.includes("LESSON === 'HSK3-L14'") && !bridge.includes('LESSON === "HSK3-L14"'), 'Shared runtime contains an L14-specific branch');
assert(runtime.includes("PARAMS.get('dataVersion')") && runtime.includes('CONFIG_VERSION') && runtime.includes('encodeURIComponent(CONFIG_VERSION)'), 'Shared Use runtime must support generic data-version cache busting');
assert(runtimeHtml.includes('l08-use-pilot.js?v=27'), 'Shared Use HTML must load the current cache-busting runtime version');
assert(/HSK3-L14[^\n]+openForUse:\s*true[^\n]+status:\s*"ready"[^\n]+useProfile:\s*"pilot-v1"/.test(curriculum), 'L14 curriculum must be ready/open with pilot-v1 configured');
assert(teacherHome.includes('legacyClassroomLink') && teacherHome.includes('selectedLesson.useProfile'), 'Teacher home must preserve upgraded and legacy entries');

const unchangedPaths = [
  'source/in-class/l08-use-student-bridge.js',
  'source/in-class/teacher.html','source/in-class/student.html',
  ...['10','11','12','13'].flatMap(number => [`source/data-model/lessons/HSK3-L${number}.json`,`source/data-model/experiments/HSK3-L${number}-USE-PILOT-V1.json`])
];
const diff = spawnSync('git', ['diff','--quiet','HEAD','--',...unchangedPaths], {cwd:root});
assert(diff.status === 0, 'Shared runtime or L10-L13 formal/profile data changed');

const formalBefore = normalizedHash(formalPath);
execFileSync(process.execPath, [path.join(__dirname, 'build-hsk3-l14-use-profile.js')], {stdio:'pipe'});
assert(formalBefore === normalizedHash(formalPath), 'Use-profile builder modified formal L14 JSON');
assert(JSON.stringify(JSON.parse(read(outputPath))) === JSON.stringify(build()), 'Use-profile builder is not repeatable');

console.log('Validated: L14 profile is deterministic and references the current generated formal JSON.');
console.log('Validated: four MINI loops map to vocabulary, grammar, text, task card and paragraph resources exactly once.');
console.log('Validated: 12 overview and 20 detail questions are read unchanged from formal L14 through textLearning.');
console.log('Validated: all three grammar points expose five aligned examples through progressive grammar.');
console.log('Validated: 27-word tiers and non-empty recognition, shape, input and use activities satisfy v3 rules.');
console.log('Validated: shared teacher/student state, timers, evidence and native-return contracts remain generic.');
console.log('Validated: curriculum publishes L14 as ready/open; L10-L13 data and teaching behavior remain unchanged.');
