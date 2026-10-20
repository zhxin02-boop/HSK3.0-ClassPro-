const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { build, outputPath, formalPath } = require('./build-hsk3-l10-use-profile');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'source', 'in-class', 'l08-use-pilot.js');
const bridgePath = path.join(root, 'source', 'in-class', 'l08-use-student-bridge.js');
const curriculumPath = path.join(root, 'source', 'data-model', 'hsk3-curriculum.js');
const teacherHomePath = path.join(root, 'source', 'teacher', 'index.html');

function assert(condition, message) { if (!condition) throw new Error(message); }
function read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function hash(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').toUpperCase(); }
function collectIds(value, result) {
  if (!value || typeof value !== 'object') return result;
  if (typeof value.id === 'string') result.add(value.id);
  Object.values(value).forEach(item => Array.isArray(item) ? item.forEach(child => collectIds(child, result)) : collectIds(item, result));
  return result;
}

const expected = build();
const actual = JSON.parse(read(outputPath));
const formal = JSON.parse(read(formalPath));
assert(JSON.stringify(actual) === JSON.stringify(expected), 'Generated L10 profile is stale or nondeterministic');
assert(actual.schemaVersion === 'classpro-use-profile/v3', 'L10 must use the shared v3 profile schema');
assert(actual.experiment.id === 'l10-use-pilot-v1' && actual.experiment.sourceLesson === 'HSK3-L10', 'L10 profile identity is wrong');
assert(actual.sources.lesson.sha256 === hash(formalPath), 'L10 profile must reference the unchanged formal lesson');
assert(actual.useGroups.length === 4 && actual.textLearning.length === 4, 'L10 needs four text-aligned MINI loops');
assert(actual.useGroups.every((item, index) => item.id === `T${index + 1}` && item.textId === formal.texts[index].id), 'MINI loops must align with formal texts');
assert(actual.useGroups.every(item => item.responseMode === 'teacherObservedWithTextOutline'), 'Every L10 loop must keep teacher observation plus a text outline');
assert(actual.coreEvidence.join(',') === 'entry_expression,actual_learning_path,exit_expression', 'L10 must keep exactly three core evidence types');
assert(actual.evidencePolicy.pathEvent === 'opened', 'The learning path must record actually opened resources');

assert(actual.useGroups[1].entry.stimulus.type === 'image', 'T2 entry must carry the configured exam-review image');
assert(fs.existsSync(path.join(root, 'source', 'in-class', actual.useGroups[1].entry.stimulus.image)), 'T2 stimulus image is missing');
assert(actual.timerPolicy.miniLoop.optionsMinutes.join(',') === '3,4,5', 'MINI timer must offer 3-5 minutes');
assert(actual.timerPolicy.vocabularyFocus.optionsMinutes.join(',') === '2,3,4,5', 'Vocabulary timer must offer 2-5 minutes');
assert(actual.timerPolicy.autoClose === false, 'Timers must not auto-submit or close');

assert(actual.textLearning.reduce((sum, item) => sum + item.overviewChoices.length, 0) === 12, 'L10 needs twelve overall-choice questions');
assert(actual.textLearning.reduce((sum, item) => sum + item.detailQuestions.length, 0) === 12, 'L10 needs twelve detail questions');
actual.textLearning.forEach((item, index) => {
  assert(item.overviewChoices.length === 3 && item.detailQuestions.length === 3, `Text ${index + 1} must keep three overall and three detail questions`);
  const overallText = item.overviewChoices.map(question => question.questionCn).join('|');
  item.detailQuestions.forEach(question => {
    assert(question.id && question.questionCn && question.questionPinyin && question.answer && question.answerPinyin && question.acceptedAnswers.length && question.informationPoint, `${question.id || 'Detail question'} is missing frozen metadata`);
    assert(!overallText.includes(question.questionCn), `${question.id} duplicates an overall question`);
  });
});

const catalog = actual.vocabularyCatalog;
assert(catalog.length === 28 && new Set(catalog.map(word => word.id)).size === 28, 'Vocabulary catalog must contain all 28 L10 words once');
assert(catalog.filter(word => word.tier === 'expression').length === 17, 'L10 must keep 17 expression-core words');
assert(catalog.filter(word => word.tier === 'understanding').length === 8, 'L10 must keep 8 understanding words');
assert(catalog.filter(word => word.tier === 'context').length === 3, 'L10 must keep 3 contextual-support words');
const activities = actual.vocabularyGroups.flatMap(group => group.activities);
assert(activities.filter(item => item.type === 'input').length === 17, 'Each expression-core word needs one input activity');
assert(activities.filter(item => item.type === 'collocation').length === 17, 'Each expression-core word needs one use activity');
assert(new Set(activities.map(item => item.id)).size === activities.length, 'Vocabulary activity IDs must be unique');
actual.vocabularyGroups.forEach(group => {
  assert(group.recognitionWordIds.length >= 4, `${group.id} needs at least four recognition choices`);
  group.recognitionWordIds.forEach(id => assert(group.wordIds.includes(id), `${group.id} recognition word is outside its vocabulary`));
});
catalog.forEach(word => assert(word.meaningCn && word.meaningCn.length <= 30 && !/[A-Za-z]/.test(word.meaningCn), `${word.id} needs a short Chinese explanation`));
activities.filter(item => item.type === 'shape').forEach(item => {
  assert(!item.promptCn.includes(item.answer) && !item.stimulus.includes(item.answer), `${item.id} reveals the target character`);
  assert(!/[\u3400-\u9fff]/u.test(item.stimulus), `${item.id} must use pinyin as the stimulus`);
});
activities.filter(item => item.type === 'collocation').forEach(item => assert(item.promptCn.includes('最多两句话') && item.promptEn, `${item.id} must limit production to two sentences and include English`));

const formalIds = collectIds(formal, new Set());
actual.useGroups.flatMap(group => group.resourceLinks).forEach(link => assert(formalIds.has(link.id), `Configured resource does not exist: ${link.id}`));
actual.resourceOverrides.forEach(override => assert(formalIds.has(override.id), `Override target does not exist: ${override.id}`));
const revisedIds = actual.useGroups.flatMap(group => group.resourceLinks).filter(link => link.status === 'needs_revision').map(link => link.id).sort();
assert(revisedIds.length === 10, 'L10 must keep exactly ten needs_revision resources in the overlay');
assert(JSON.stringify(revisedIds) === JSON.stringify(actual.resourceOverrides.map(item => item.id).sort()), 'Every needs_revision resource must be covered only by the overlay');
assert(actual.useGroups.map(group => group.linkedResources.grammar.grammarIndex).join(',') === '0,1,2,1', 'Grammar routes must be g10_01, g10_02, g10_03, then reused g10_02');
assert(actual.useGroups[3].linkedResources.practice.submodule === 'g2p' && actual.useGroups[3].linkedResources.practice.routeState.g2pi === 6, 'T4 must use the configured picture-production practice');

assert(actual.nativeTeaching.preserveCourseStyles === true, 'L10 must preserve native course styles');
formal.grammar.forEach(grammar => {
  const note = formal.grammarTeachingNotes[grammar.id];
  assert(note && note.presentationMode === 'progressive_grammar', `${grammar.id} lost progressive grammar mode`);
  assert(grammar.examples.length === 6, `${grammar.id} lost its six observation examples`);
  assert(note.structure && note.observeHighlights.length >= 5, `${grammar.id} lost structure highlights`);
  assert(note.oralQuestions.length >= 4, `${grammar.id} lost classroom expression prompts`);
  assert(note.followUp.length >= 1, `${grammar.id} lost picture follow-up practice`);
});
assert(formal.grammarTeachingNotes.g10_01.mergeNoticeObserve === true && formal.grammarTeachingNotes.g10_03.mergeNoticeObserve === true, 'L10 merged progressive grammar stages changed');
assert(formal.texts[3].format === 'email' && formal.texts[3].genre === '邮件', 'Text 4 must retain its email presentation');
assert(formal.meta.editorialNotes.some(note => note.textId === 't_hsk3_l10_03' && note.formal.includes('看不懂')), 'Text 3 correction 看不懂 must remain in formal data');

const runtime = read(runtimePath);
const bridge = read(bridgePath);
const curriculum = read(curriculumPath);
const teacherHome = read(teacherHomePath);
assert(runtime.includes('stimulus: task.stimulus || null') && runtime.includes('task-context-image'), 'Shared teacher runtime must render configured task stimuli');
assert(bridge.includes('interaction.stimulus || null') && bridge.includes('use-bridge-context img'), 'Unified student bridge must render the same task stimulus');
assert(runtime.includes('localStorage.setItem(STORAGE_KEY') && runtime.includes('state.nativeRoute'), 'Use state must persist while native resources are open');
assert(runtime.includes('app.hsk3GrammarPhase = 0') && !runtime.includes('app._tg ='), 'Use must enter native grammar without replacing its renderer');
assert(curriculum.includes('HSK3-L10') && curriculum.includes('useProfile: "pilot-v1"'), 'L10 curriculum must expose the upgrade profile');
assert(teacherHome.includes('legacyClassroomLink') && teacherHome.includes('selectedLesson.useProfile'), 'Teacher home must preserve both upgraded and legacy entries');

console.log('Validated: L10 config runs four text-aligned MINI loops on the shared teacher and student runtime.');
console.log('Validated: all selected resources and ten overlay targets exist in the unchanged formal L10 JSON.');
console.log('Validated: overall/detail questions, vocabulary tiers and 17 input/use pairs match the frozen checklist.');
console.log('Validated: native L10 progressive grammar and text/email presentation remain owned by the formal lesson.');
console.log('Validated: L8/L9-compatible shared runtime gained only optional configured stimulus rendering.');
