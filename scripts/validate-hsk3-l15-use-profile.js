const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const formalPath = path.join(root, 'source/data-model/lessons/HSK3-L15.json');
const formalText = fs.readFileSync(formalPath, 'utf8');
const lesson = JSON.parse(formalText);
const profile = JSON.parse(fs.readFileSync(path.join(root, 'source/data-model/experiments/HSK3-L15-USE-PILOT-V1.json'), 'utf8'));
const runtime = fs.readFileSync(path.join(root, 'source/in-class/l08-use-pilot.js'), 'utf8');
const curriculum = fs.readFileSync(path.join(root, 'source/data-model/hsk3-curriculum.js'), 'utf8');

let checks = 0;
const ok = (value, message) => {
  if (!value) throw new Error(message);
  checks += 1;
};
const unique = (items, message) => ok(new Set(items).size === items.length, message);

ok(profile.schemaVersion === 'classpro-use-profile/v3', 'profile schema');
ok(profile.experiment.id === 'l15-use-pilot-v1' && profile.experiment.sourceLesson === 'HSK3-L15', 'shared runtime identity');
ok(profile.experiment.title && profile.experiment.lessonLabel === '第15课' && profile.experiment.scope, 'experiment labels');
const hash = crypto.createHash('sha256').update(formalText.replace(/\r\n/g, '\n')).digest('hex').toUpperCase();
ok(profile.sources.lesson.sha256 === hash, 'formal resource hash');
ok(profile.sources.lesson.path === '../lessons/HSK3-L15.json', 'formal resource path');
ok(profile.sources.teacher.path.endsWith('/teacher.html') && profile.sources.student.path.endsWith('/student.html'), 'native teacher/student pages');
ok(profile.nativeTeaching.preserveCourseStyles && profile.nativeTeaching.grammar.preserveExamples && profile.nativeTeaching.text.preservePresentation && profile.nativeTeaching.vocabulary.preserveScenes, 'native teaching preservation');
ok(!runtime.includes('HSK3-L15') && !runtime.includes('L15'), 'no L15 branch in shared runtime');

ok(profile.useGroups.length === 4 && profile.textLearning.length === 4, 'four MINI loops');
unique(profile.useGroups.map((item) => item.id), 'unique MINI ids');
const approvedExitPrompts = ['介绍附近的生活设施、交通特点，并说明这里适合什么人居住。','先问问游客的兴趣，再推荐两个地方，并分别说明为什么推荐。','请介绍一下你了解的“黄河”。','讲一个你最喜欢的地方，说明为什么喜欢，并讲一个你和这个地方的故事。'];
const validTasks = new Set(lesson.inClass.questionGroups.t2_task_card.map((item) => item.id));
const validParagraphs = new Set(lesson.inClass.questionGroups.r4_paragraph_fill.map((item) => item.id));
profile.useGroups.forEach((group, index) => {
  ok(group.textId === lesson.texts[index].id, `MINI text mapping: ${group.id}`);
  ok(group.image && fs.existsSync(path.join(root, 'source/in-class', group.image)), `MINI image: ${group.id}`);
  ok(group.entry.stimulus.image === group.image && group.entry.promptCn && group.exit.promptCn, `MINI entry/exit: ${group.id}`);
  ok(group.exitRequirements.length >= 3 && group.exitRequirements.every((item) => item.id && item.label), `MINI exit steps: ${group.id}`);
  ok(group.exit.promptCn === approvedExitPrompts[index], `approved endpoint prompt: ${group.id}`);
  ok(group.supportCards.length === 2 && group.supportCards.every((item) => item.labelCn && item.labelEn && item.contentCn), `MINI support cards: ${group.id}`);
  ok(group.linkedResources.vocabulary.submodule === 'tv' && group.linkedResources.grammar.submodule === 'tg' && group.linkedResources.text.submodule === 'tt', `native resource routes: ${group.id}`);
  ok(group.linkedResources.practice.submodule === 't2k' && group.linkedResources.practice.routeState.t2ki === index, `practice route: ${group.id}`);
  ok(group.resourceLinks.length === 2, `two real resources: ${group.id}`);
  ok(validTasks.has(group.resourceLinks[0].id), `real task resource: ${group.id}`);
  ok(validParagraphs.has(group.resourceLinks[1].id), `real paragraph resource: ${group.id}`);
});

profile.textLearning.forEach((item, index) => {
  ok(item.textId === lesson.texts[index].id && item.useGroupId === `T${index + 1}`, `text learning mapping: T${index + 1}`);
  ok(item.overviewChoices.length === 3 && item.detailQuestions.length === 5, `3 overview + 5 details: T${index + 1}`);
  ok(item.overviewChoices.every((question) => question.questionCn && question.options.length === 3), `complete overview questions: T${index + 1}`);
  ok(item.detailQuestions.every((question) => question.questionCn && question.answer && question.acceptedAnswers.length), `complete detail questions: T${index + 1}`);
  ok(item.grammarBridge.grammarIndex === index && item.grammarBridge.evidence && item.grammarBridge.focus, `grammar bridge: T${index + 1}`);
  ok(item.paragraphPractice.submodule === 'r4p' && item.paragraphPractice.index === index, `paragraph route: T${index + 1}`);
  ok(item.lifeTransfer.promptCn && item.lifeTransfer.promptEn, `life transfer: T${index + 1}`);
});

ok(profile.vocabularyTaskTypes.map((item) => item.id).join('|') === 'recognition|shape|input|collocation', 'four vocabulary task types');
const expectedGroups = [
  ['v15_01','v15_02','v15_03','v15_04','v15_05','v15_06','v15_07','v15_08','v15_09'],
  ['v15_10','v15_11','v15_12','v15_13','v15_14','v15_15','v15_16','v15_17','v15_25'],
  ['v15_18','v15_19','v15_20','v15_26'],
  ['v15_21','v15_22','v15_23','v15_24']
];
ok(profile.vocabularyCatalog.length === 26 && profile.vocabularyGroups.length === 4, 'complete vocabulary configuration');
profile.vocabularyCatalog.forEach((word) => {
  const formal = lesson.vocabulary.find((item) => item.id === word.id);
  ok(formal && word.hanzi === formal.hanzi && word.meaningCn && word.phrases.length === 2 && word.example, `catalog word: ${word.id}`);
  ok(word.allowedTypes.includes('recognition') && word.allowedTypes.includes('shape'), `base activities: ${word.id}`);
  ok(word.tier === 'expression' ? word.allowedTypes.join('|') === 'recognition|shape|input|collocation' : word.allowedTypes.join('|') === 'recognition|shape', `tier activities: ${word.id}`);
});

profile.vocabularyGroups.forEach((group, index) => {
  ok(group.wordIds.join('|') === expectedGroups[index].join('|'), `correct vocabulary mapping: ${group.id}`);
  ok(group.recognitionWordIds.length <= 4 && group.recognitionWordIds.every((id) => group.wordIds.includes(id)), `recognition maximum: ${group.id}`);
  group.wordIds.forEach((id) => {
    const word = profile.vocabularyCatalog.find((item) => item.id === id);
    const activities = group.activities.filter((item) => item.targetWordIds.includes(id));
    const expected = word.tier === 'expression' ? 'collocation|input|shape' : 'shape';
    ok(activities.map((item) => item.type).sort().join('|') === expected, `configured activities: ${id}`);
  });
});

const activities = profile.vocabularyGroups.flatMap((group) => group.activities);
unique(activities.map((item) => item.id), 'unique activity ids');
activities.filter((item) => item.type === 'shape').forEach((item) => {
  unique(item.options, `unique shape options: ${item.id}`);
  ok(item.options.length === 4 && item.options.includes(item.answer) && item.stimulus !== item.answer, `shape answer without prompt leak: ${item.id}`);
});
activities.filter((item) => item.type === 'input').forEach((item) => ok(item.evaluation === 'automatic' && item.acceptedAnswers.includes(item.answer), `automatic input: ${item.id}`));
activities.filter((item) => item.type === 'collocation').forEach((item) => ok(item.promptEn && /最多两句话/.test(item.promptCn) && item.stimulus && item.answer.length > item.stimulus.length, `bounded bilingual collocation: ${item.id}`));

ok(profile.evidencePolicy.coreTypes.join('|') === 'entry_expression|actual_learning_path|exit_expression', 'three evidence types');
ok(profile.evidencePolicy.pathEvent === 'opened', 'actual path event');
ok(profile.supportOptions.length === 4 && profile.feelingOptions.length === 4, 'support and reflection options');
ok(profile.timerPolicy.miniLoop.optionsMinutes.join() === '3,4,5' && profile.timerPolicy.miniLoop.defaultMinutes === 4, 'MINI timer');
ok(profile.timerPolicy.vocabularyFocus.optionsMinutes.join() === '2,3,4,5' && profile.timerPolicy.vocabularyFocus.defaultMinutes === 2, 'vocabulary timer');
ok(!profile.timerPolicy.autoClose && !profile.timerPolicy.autoSubmit, 'timer never auto-closes/submits');
ok(profile.capabilities.includes('state_restore') && profile.capabilities.includes('native_course_resource_return') && profile.capabilities.includes('compare_entry_exit'), 'restore, return, and comparison');
ok(/\{[^}]*id:\s*"HSK3-L15"[^}]*openForUse:\s*true[^}]*status:\s*"ready"[^}]*\}/.test(curriculum), 'curriculum exposes L15 as ready');

console.log(`HSK3-L15 use-profile validation passed: ${checks} checks.`);
