const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { build, outputPath, formalPath } = require('./build-hsk3-l12-use-profile');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'source', 'in-class', 'l08-use-pilot.js');
const bridgePath = path.join(root, 'source', 'in-class', 'l08-use-student-bridge.js');
const curriculumPath = path.join(root, 'source', 'data-model', 'hsk3-curriculum.js');
const teacherHomePath = path.join(root, 'source', 'teacher', 'index.html');
const canonicalFormalHash = '4CD015BF7370534206A85A77016DFD919E2652952545973103A6DC447B752489';

function assert(condition, message) { if (!condition) throw new Error(message); }
function read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function hash(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').toUpperCase(); }
function collectIds(value, result) {
  if (!value || typeof value !== 'object') return result;
  if (typeof value.id === 'string') result.add(value.id);
  Object.values(value).forEach(item => Array.isArray(item) ? item.forEach(child => collectIds(child, result)) : collectIds(item, result));
  return result;
}
function normalized(value) { return String(value || '').replace(/[\s，。？！、“”‘’：；]/g, ''); }

const expected = build();
const actual = JSON.parse(read(outputPath));
const formal = JSON.parse(read(formalPath));
const questions = formal.inClass.questionGroups;

assert(JSON.stringify(actual) === JSON.stringify(expected), 'Generated L12 profile is stale or nondeterministic');
assert(hash(formalPath) === canonicalFormalHash, 'Formal L12 JSON changed from the frozen canonical hash');
assert(actual.sources.lesson.sha256 === canonicalFormalHash, 'L12 profile does not reference the unchanged formal lesson');
assert(actual.schemaVersion === 'classpro-use-profile/v3', 'L12 must use the shared v3 profile schema');
assert(actual.experiment.id === 'l12-use-pilot-v1' && actual.experiment.sourceLesson === 'HSK3-L12', 'L12 profile identity is wrong');
assert(actual.useGroups.length === 4 && actual.textLearning.length === 4, 'L12 needs four text-aligned MINI loops');
assert(actual.useGroups.every((item, index) => item.id === `T${index + 1}` && item.textId === formal.texts[index].id), 'MINI loops must align with the four formal texts');
assert(actual.useGroups.every(item => item.responseMode === 'teacherObservedWithTextOutline'), 'Every loop must use the existing teacher-observed text-outline mode');
assert(actual.coreEvidence.join(',') === 'entry_expression,actual_learning_path,exit_expression', 'L12 must keep exactly three core evidence types');
assert(actual.evidencePolicy.pathEvent === 'opened', 'Learning path evidence must record only resources actually opened');

actual.useGroups.forEach((group, index) => {
  const image = group.entry.stimulus && group.entry.stimulus.image;
  assert(image && fs.existsSync(path.join(root, 'source', 'in-class', image)), `${group.id} entry image is missing`);
  assert(group.linkedResources.grammar.grammarIndex === index, `${group.id} primary grammar route is wrong`);
  assert(group.linkedResources.text.textIndex === index, `${group.id} text route is wrong`);
  assert(group.linkedResources.vocabulary.vocabSession === String(index + 1), `${group.id} vocabulary scene route is wrong`);
  assert(group.linkedResources.practice && !Object.prototype.hasOwnProperty.call(group.linkedResources.practice, 'resourceId'), `${group.id} must keep formal IDs separate from route state`);
});
assert(actual.useGroups[1].linkedResources.grammar.grammarIndex === 1, 'T2 teacher-decision grammar must open g12_02');
assert(actual.textLearning[1].grammarBridge.grammarIndex === 2, 'T2 text grammar bridge must open g12_03');

const practiceIds = [questions.t2_task_card[0].id, questions.t2_task_card[1].id, questions.g2_picture_complete[5].id, questions.t2_task_card[3].id];
assert(practiceIds.join(',') === 'l12_task_01,l12_task_02,l12_pic_06,l12_task_04', 'Configured practice indexes do not point to the frozen L12 resource IDs');
assert(actual.useGroups[0].linkedResources.practice.submodule === 't2k' && actual.useGroups[0].linkedResources.practice.routeState.t2ki === 0, 'T1 practice route is wrong');
assert(actual.useGroups[1].linkedResources.practice.submodule === 't2k' && actual.useGroups[1].linkedResources.practice.routeState.t2ki === 1, 'T2 practice route is wrong');
assert(actual.useGroups[2].linkedResources.practice.submodule === 'g2p' && actual.useGroups[2].linkedResources.practice.routeState.g2pi === 5, 'T3 practice route is wrong');
assert(actual.useGroups[3].linkedResources.practice.submodule === 't2k' && actual.useGroups[3].linkedResources.practice.routeState.t2ki === 3, 'T4 practice route is wrong');

const paragraphIndexes = [0,1,3,2];
actual.textLearning.forEach((learning, index) => {
  const paragraphIndex = paragraphIndexes[index];
  assert(learning.paragraphPractice.index === paragraphIndex, `${learning.useGroupId} paragraph route index is wrong`);
  assert(questions.r4_paragraph_fill[paragraphIndex].id === ['l12_para_01','l12_para_02','l12_para_04','l12_para_03'][index], `${learning.useGroupId} paragraph route points to the wrong formal resource`);
});

assert(actual.timerPolicy.miniLoop.optionsMinutes.join(',') === '3,4,5', 'MINI timer must offer 3-5 minutes');
assert(actual.timerPolicy.vocabularyFocus.optionsMinutes.join(',') === '2,3,4,5', 'Vocabulary timer must offer 2-5 minutes');
assert(actual.timerPolicy.autoClose === false, 'Timers must not auto-submit or close');

assert(actual.textLearning.reduce((sum, item) => sum + item.overviewChoices.length, 0) === 12, 'L12 needs twelve overall-choice questions');
assert(actual.textLearning.reduce((sum, item) => sum + item.detailQuestions.length, 0) === 16, 'L12 needs sixteen detailed questions');
actual.textLearning.forEach((item, index) => {
  assert(item.overviewChoices.length === 3 && item.detailQuestions.length === 4, `Text ${index + 1} must keep three overall and four detail questions`);
  assert(item.overviewChoices.map(question => question.focus).join(',') === 'main_idea,development,purpose', `Text ${index + 1} overall focuses are wrong`);
  const overall = new Set(item.overviewChoices.map(question => normalized(question.questionCn)));
  item.detailQuestions.forEach(question => {
    assert(question.id && question.questionCn && question.questionPinyin && question.answer && question.answerPinyin && question.acceptedAnswers.length && question.informationPoint, `${question.id || 'Detail question'} is missing frozen metadata`);
    assert(!overall.has(normalized(question.questionCn)), `${question.id} duplicates an overall question`);
  });
});
assert(actual.textLearning[0].overviewChoices[2].questionCn === '王一飞今天没时间，两个人最后怎么办？', 'T1 overall question 3 must use the simplified frozen wording');
assert(actual.textLearning[2].overviewChoices[1].questionCn === '他们怎么说这里的冬天？', 'T3 overall question 2 must use the simplified frozen wording');
assert(actual.textLearning[2].overviewChoices[2].questionCn === '他们为什么说到下雪？', 'T3 overall question 3 must use the simplified frozen wording');
assert(!actual.textLearning[2].overviewChoices.some(question => /先谈什么|后来谈什么|前面|后面/.test(question.questionCn)), 'T3 overall questions must avoid mechanical before/after wording');
assert(!JSON.stringify(actual.textLearning).includes('白露'), 'L12 configured questions must use the formal character name 白家月');
assert(!actual.textLearning[0].detailQuestions[2].answer.includes('他今天'), 'Wang Yifei pronoun must match the formal lesson');

const catalog = actual.vocabularyCatalog;
assert(catalog.length === 27 && new Set(catalog.map(word => word.id)).size === 27, 'Vocabulary catalog must contain all 27 L12 words once');
assert(catalog.filter(word => word.tier === 'expression').length === 17, 'L12 must keep 17 required expression words');
assert(catalog.filter(word => word.tier === 'understanding').length === 9, 'L12 must keep 9 understanding words');
assert(catalog.filter(word => word.tier === 'context').length === 1, 'L12 must keep 1 context word');
catalog.forEach(word => assert(word.meaningCn && !/[A-Za-z]/.test(word.meaningCn), `${word.id} needs a simple Chinese explanation`));

const activities = actual.vocabularyGroups.flatMap(group => group.activities);
const inputActivities = activities.filter(item => item.type === 'input');
const useActivities = activities.filter(item => item.type === 'collocation');
const shapeActivities = activities.filter(item => item.type === 'shape');
assert(inputActivities.length === 21 && useActivities.length === 21, 'The frozen L12 list needs 21 input and 21 use activities');
assert(shapeActivities.length === 22, 'The frozen L12 list needs 22 shape activities');
assert(new Set(activities.map(item => item.id)).size === activities.length, 'Vocabulary activity IDs must be unique');
inputActivities.forEach(item => assert(item.promptMode === 'meaning' && item.evaluation === 'automatic' && item.answer && item.acceptedAnswers.length, `${item.id} is missing automatic input metadata`));
useActivities.forEach(item => assert(item.promptMode === 'open_use' && item.evaluation === 'teacher' && item.answer && item.acceptedAnswers.length === 0 && item.promptCn.includes('最多两句话') && item.promptEn, `${item.id} must be teacher-reviewed, limited to two sentences, and include English guidance`));
shapeActivities.forEach(item => {
  assert(item.promptMode === 'form' && item.evaluation === 'automatic', `${item.id} is missing shape metadata`);
  assert(!item.promptCn.includes(item.answer) && !item.stimulus.includes(item.answer), `${item.id} reveals the target word before the choices`);
});
actual.vocabularyGroups.forEach(group => {
  assert(group.recognitionWordIds.length === group.wordIds.length, `${group.id} must expose every group word as a recognition candidate`);
  group.recognitionWordIds.forEach(id => assert(group.wordIds.includes(id), `${group.id} recognition word is outside its vocabulary`));
});

const formalIds = collectIds(formal, new Set());
actual.useGroups.flatMap(group => group.resourceLinks).forEach(link => assert(formalIds.has(link.id), `Configured resource does not exist: ${link.id}`));
actual.resourceOverrides.forEach(override => assert(formalIds.has(override.id), `Override target does not exist: ${override.id}`));
const revisedIds = actual.useGroups.flatMap(group => group.resourceLinks).filter(link => link.status === 'needs_revision').map(link => link.id).sort();
assert(revisedIds.join(',') === 'l12_task_02,l12_task_04', 'The frozen needs_revision set changed');
assert(revisedIds.join(',') === actual.resourceOverrides.map(item => item.id).sort().join(','), 'Every needs_revision item must be covered only by the overlay');
assert(actual.resourceOverrides.every(override => !read(formalPath).includes(JSON.stringify(override.patch))), 'Upgrade patches must not be written into the formal JSON');

assert(actual.nativeTeaching.preserveCourseStyles === true, 'L12 must preserve native course styles');
formal.grammar.forEach(grammar => {
  const note = formal.grammarTeachingNotes[grammar.id];
  assert(note && note.presentationMode === 'progressive_grammar', `${grammar.id} lost progressive grammar mode`);
  assert(grammar.examples.length === 5, `${grammar.id} lost its five observation examples`);
  assert(note.structure && note.observeHighlights.length === 5, `${grammar.id} lost structure highlights`);
  assert(note.oralQuestions.length >= 4, `${grammar.id} lost classroom expression prompts`);
  assert(note.structureVariants.length >= 2, `${grammar.id} lost structure variants`);
  assert(note.followUp.length >= 1 && note.visualLearning, `${grammar.id} lost visual follow-up practice`);
});
assert(Object.keys(formal.vocabScenes).join(',') === '1,2,3,4', 'L12 must retain four native vocabulary scene groups');
Object.values(formal.vocabScenes).forEach(scene => assert(scene.steps.length === 2, 'Every L12 vocabulary group must retain two native scenes'));
assert(formal.texts[3].format === 'diary' && formal.texts[3].genre === '日记', 'Text 4 must retain its diary presentation');

const runtime = read(runtimePath);
const bridge = read(bridgePath);
const curriculum = read(curriculumPath);
const teacherHome = read(teacherHomePath);
assert(runtime.includes('selected.size < 4') && runtime.includes('selectedWords.slice(0, 4).map'), 'Teacher vocabulary selection must allow up to four words');
assert(runtime.includes("configured.slice(0, 4).map") && bridge.includes('(interaction.items || []).map'), 'Unified student view must render every selected vocabulary item');
assert(runtime.includes("timerPicker('miniLoop'") && runtime.includes("timerPicker('vocabularyFocus'") && bridge.includes('countdownMarkup(interaction)'), 'Both shared timers must remain active on teacher and student views');
assert(bridge.indexOf("client.subscribe([TOPICS.control, TOPICS.ack]") < bridge.indexOf('sendPresence(true);'), 'Student must subscribe before requesting the current teacher interaction');
assert(runtime.includes('localStorage.setItem(STORAGE_KEY') && runtime.includes('state.nativeRoute'), 'Use state must persist while native resources are open');
assert(runtime.includes('app.hsk3GrammarPhase = 0') && !runtime.includes('app._tg ='), 'Use must enter native grammar without replacing its renderer');
assert(runtime.includes("addTrail('resource'") && runtime.includes("stage === 'entry'") && runtime.includes("stage === 'exit'"), 'Entry, opened-resource path, and exit evidence must remain recordable');
assert(!runtime.includes("LESSON === 'HSK3-L12'") && !runtime.includes('LESSON === "HSK3-L12"'), 'Shared runtime contains an L12-specific branch');
assert(curriculum.includes('id: "HSK3-L12"') && curriculum.includes('id: "HSK3-L12", no: 12') && /HSK3-L12[^\n]+openForUse:\s*true[^\n]+status:\s*"ready"[^\n]+useProfile:\s*"pilot-v1"/.test(curriculum), 'L12 curriculum must expose the shared upgrade profile');
assert(teacherHome.includes('legacyClassroomLink') && teacherHome.includes('selectedLesson.useProfile'), 'Teacher home must preserve both upgraded and legacy entries');

for (const lesson of ['08','09','10','11']) {
  const module = require(`./build-hsk3-l${lesson}-use-${lesson === '08' ? 'pilot' : 'profile'}`);
  assert(JSON.stringify(module.build()) === JSON.stringify(JSON.parse(read(module.outputPath))), `L${lesson} profile changed or became stale`);
}

console.log('Validated: L12 profile is deterministic and references the unchanged formal JSON hash.');
console.log('Validated: four MINI loops map to the frozen texts, vocabulary scenes, grammar, practices and paragraph resources.');
console.log('Validated: overall/detail questions, 27-word tiers, recognition, shape, input and use activities satisfy v3 rules.');
console.log('Validated: only l12_task_02 and l12_task_04 are changed through the upgrade overlay.');
console.log('Validated: native progressive grammar, vocabulary scenes and diary presentation remain owned by formal L12.');
console.log('Validated: shared teacher/student state, timers, evidence, legacy entry and L8-L11 profiles remain intact.');
