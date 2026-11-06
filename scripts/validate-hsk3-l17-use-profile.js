const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const builderPath = path.join(root, 'scripts/build-hsk3-l17-use-profile.js');
const formalPath = path.join(root, 'source/data-model/lessons/HSK3-L17.json');
const profilePath = path.join(root, 'source/data-model/experiments/HSK3-L17-USE-PILOT-V1.json');
const formalText = fs.readFileSync(formalPath, 'utf8');
const lesson = JSON.parse(formalText);

let checks = 0;
const ok = (value, message) => {
  if (!value) throw new Error('L17 USE PROFILE VALIDATION FAILED: ' + message);
  checks += 1;
  console.log('✓ ' + message);
};
const same = (actual, expected, message) => ok(
  JSON.stringify(actual) === JSON.stringify(expected),
  message + '\n  expected ' + JSON.stringify(expected) + '\n  actual   ' + JSON.stringify(actual)
);
const unique = (items, message) => ok(new Set(items).size === items.length, message);
const maxRun = (items) => {
  let best = 0;
  let current = 0;
  let previous = Symbol('start');
  items.forEach((item) => {
    current = item === previous ? current + 1 : 1;
    previous = item;
    best = Math.max(best, current);
  });
  return best;
};

ok(fs.existsSync(builderPath), 'use-profile builder exists');
const formalBefore = fs.readFileSync(formalPath);
execFileSync(process.execPath, [builderPath], {cwd:root, stdio:'pipe'});
const firstBuild = fs.readFileSync(profilePath);
execFileSync(process.execPath, [builderPath], {cwd:root, stdio:'pipe'});
const secondBuild = fs.readFileSync(profilePath);
ok(firstBuild.equals(secondBuild), 'use-profile builder is deterministic');
ok(formalBefore.equals(fs.readFileSync(formalPath)), 'profile build does not modify formal JSON');

const profile = JSON.parse(secondBuild.toString('utf8'));
const runtime = fs.readFileSync(path.join(root, 'source/in-class/l08-use-pilot.js'), 'utf8');
const runtimeHtml = fs.readFileSync(path.join(root, 'source/in-class/l08-use-pilot.html'), 'utf8');
const teacherHome = fs.readFileSync(path.join(root, 'source/teacher/index.html'), 'utf8');
const curriculum = fs.readFileSync(path.join(root, 'source/data-model/hsk3-curriculum.js'), 'utf8');

same(profile.schemaVersion, 'classpro-use-profile/v3', 'profile schema');
same(profile.experiment.id, 'l17-use-pilot-v1', 'experiment ID');
same(profile.experiment.sourceLesson, 'HSK3-L17', 'source lesson');
same(profile.experiment.lessonLabel, '第17课', 'lesson label');
ok(profile.experiment.title && profile.experiment.scope.includes('四个课文MINI循环'), 'experiment labels and scope');
const formalHash = crypto.createHash('sha256').update(formalText.replace(/\r\n/g, '\n')).digest('hex').toUpperCase();
same(profile.sources.lesson.sha256, formalHash, 'formal resource hash');
same(profile.sources.lesson.path, '../lessons/HSK3-L17.json', 'formal resource path');
ok(profile.sources.teacher.path.endsWith('/teacher.html') && profile.sources.student.path.endsWith('/student.html'), 'native teacher/student resources');
ok(
  profile.nativeTeaching.preserveCourseStyles &&
  profile.nativeTeaching.grammar.preserveExamples &&
  profile.nativeTeaching.grammar.preserveHighlights &&
  profile.nativeTeaching.grammar.preserveOralQuestions &&
  profile.nativeTeaching.grammar.preserveFollowUp,
  'native grammar preservation'
);
ok(
  profile.nativeTeaching.text.preservePresentation &&
  profile.nativeTeaching.text.preserveDialogue &&
  profile.nativeTeaching.text.preserveDiary &&
  profile.nativeTeaching.text.preserveAudio,
  'native text genre and audio preservation'
);
ok(profile.nativeTeaching.vocabulary.preserveScenes && profile.nativeTeaching.vocabulary.preserveHotspots, 'native vocabulary-scene preservation');

ok(!runtime.includes('HSK3-L17') && !runtime.includes('L17'), 'no L17 branch in shared runtime');
ok(runtime.includes('CONFIG_URL') && runtime.includes('encodeURIComponent(PROFILE.toUpperCase())'), 'shared runtime loads generic profile path');
ok(/l08-use-pilot\.js\?v=\d+/.test(runtimeHtml), 'shared wrapper loads versioned runtime');
ok(teacherHome.includes('selectedLesson.useProfile') && teacherHome.includes("'../in-class/l08-use-pilot.html'"), 'teacher home routes configured lessons through shared Use wrapper');
ok(/id: "HSK3-L17"[^\n]+openForUse: true[^\n]+teacherVisible: true[^\n]+status: "ready"[^\n]+useProfile: "pilot-v1"/.test(curriculum), 'curriculum publishes L17 through pilot-v1');
ok(
  lesson.usePreparation.status === 'active_shared_profile' &&
  lesson.usePreparation.configurationCreated === true &&
  lesson.usePreparation.profile === 'pilot-v1',
  'formal lesson declares active shared profile'
);

same(profile.useGroups.map((group) => group.id), ['T1','T2','T3','T4'], 'four MINI loops');
unique(profile.useGroups.map((group) => group.id), 'unique MINI IDs');
const approvedEntries = [
  '说一个你觉得“很认真”的人。',
  '你以后想继续学习还是工作？',
  '你想去哪个国家或城市学习？',
  '以后你想做什么？'
];
const approvedExits = [
  '你想向谁学习？为什么？',
  '说说你想继续学习什么，并请同学给你一个建议。',
  '介绍一个你想去学习的国家或城市，说说你要怎么准备？',
  '介绍你毕业以后的打算：工作还是继续学习？为什么？'
];
const validTasks = new Set(lesson.inClass.questionGroups.t2_task_card.map((item) => item.id));
const validParagraphs = new Set(lesson.inClass.questionGroups.r4_paragraph_fill.map((item) => item.id));
profile.useGroups.forEach((group, index) => {
  same(group.textId, lesson.texts[index].id, 'MINI text mapping: ' + group.id);
  ok(group.image && fs.existsSync(path.join(root, 'source/in-class', group.image)), 'MINI image: ' + group.id);
  same(group.entry.promptCn, approvedEntries[index], 'approved MINI entry: ' + group.id);
  same(group.entry.stimulus.image, group.image, 'entry image mapping: ' + group.id);
  same(group.exit.promptCn, approvedExits[index], 'approved MINI exit: ' + group.id);
  same(group.exitRequirements.length, 2, 'two minimum requirements: ' + group.id);
  ok(group.exitRequirements.every((item) => item.id && item.label), 'labeled exit requirements: ' + group.id);
  same(group.supportCards.length, 2, 'two support cards: ' + group.id);
  ok(group.supportCards.every((item) => item.labelCn && item.labelEn && item.contentCn && item.contentEn), 'bilingual support cards: ' + group.id);
  ok(group.linkedResources.vocabulary.submodule === 'tv' && group.linkedResources.vocabulary.vocabSession === String(index + 1), 'native vocabulary route: ' + group.id);
  ok(group.linkedResources.grammar.submodule === 'tg' && group.linkedResources.grammar.grammarIndex === index, 'native grammar route: ' + group.id);
  ok(group.linkedResources.text.submodule === 'tt' && group.linkedResources.text.textIndex === index, 'native text route: ' + group.id);
  ok(group.linkedResources.practice.submodule === 't2k' && group.linkedResources.practice.routeState.t2ki === index, 'unique task-card route: ' + group.id);
  same(group.resourceLinks.length, 2, 'task and paragraph resources: ' + group.id);
  ok(validTasks.has(group.resourceLinks[0].id) && group.resourceLinks[0].status === 'ready', 'ready task-card resource: ' + group.id);
  ok(validParagraphs.has(group.resourceLinks[1].id) && group.resourceLinks[1].status === 'ready', 'ready paragraph resource: ' + group.id);
});
unique(profile.useGroups.flatMap((group) => group.resourceLinks.map((link) => link.id)), 'each configured task/paragraph resource is unique');
same(profile.resourceOverrides, [], 'no needs_revision overlays required');

same(profile.textLearning.length, 4, 'four text-learning configurations');
profile.textLearning.forEach((item, index) => {
  same(item.textId, lesson.texts[index].id, 'text-learning text mapping: T' + (index + 1));
  same(item.useGroupId, 'T' + (index + 1), 'text-learning MINI mapping: T' + (index + 1));
  same(item.stageContract, ['listen_or_read','overall_choice','detail_qa','show_text','language_and_application'], 'five-stage text contract: T' + (index + 1));
  same(item.overviewChoices.length, 3, 'three overview choices: T' + (index + 1));
  same(item.detailQuestions.length, 5, 'five detail questions: T' + (index + 1));
  ok(item.overviewChoices.every((question) => question.id && question.questionCn && question.options.length === 3 && Number.isInteger(question.correctIndex)), 'complete overview questions: T' + (index + 1));
  ok(item.detailQuestions.every((question) => question.id && question.questionCn && question.answer && question.acceptedAnswers.length && question.informationPoint), 'complete detail questions: T' + (index + 1));
  ok(item.grammarBridge.grammarIndex === index && item.grammarBridge.evidence && item.grammarBridge.focus, 'grammar bridge: T' + (index + 1));
  ok(item.paragraphPractice.submodule === 'r4p' && item.paragraphPractice.index === index, 'paragraph route: T' + (index + 1));
  same(item.lifeTransfer.promptCn, approvedExits[index], 'life-transfer endpoint: T' + (index + 1));
});

same(profile.vocabularyTaskTypes.map((item) => item.id), ['recognition','shape','input','collocation'], 'four vocabulary task types');
same(profile.vocabularyCatalog.length, 27, 'complete 27-word catalog');
same(profile.vocabularyGroups.length, 4, 'four vocabulary groups');
profile.vocabularyCatalog.forEach((word) => {
  const formal = lesson.vocabulary.find((item) => item.id === word.id);
  ok(formal && word.hanzi === formal.hanzi && word.pinyin === formal.pinyin && word.english === formal.english, 'catalog identity: ' + word.id);
  ok(word.meaningCn && word.phrases.length === 2 && word.example, 'catalog learning fields: ' + word.id);
  same(word.allowedTypes, word.tier === 'expression' ? ['recognition','shape','input','collocation'] : ['recognition','shape'], 'tier activities: ' + word.id);
});
profile.vocabularyGroups.forEach((group, index) => {
  const formalGroup = lesson.vocabularyGroups[index];
  same(group.wordIds, formalGroup.vocabularyIds, 'vocabulary mapping: ' + group.id);
  same(group.recognitionWordIds, formalGroup.recognitionWordIds, 'recognition mapping: ' + group.id);
  ok(group.recognitionWordIds.length <= 4, 'recognition maximum: ' + group.id);
  group.wordIds.forEach((id) => {
    const word = profile.vocabularyCatalog.find((item) => item.id === id);
    const activities = group.activities.filter((item) => item.targetWordIds.includes(id));
    same(activities.map((item) => item.type).sort(), word.tier === 'expression' ? ['collocation','input','shape'] : ['shape'], 'configured activities: ' + group.id + '/' + id);
  });
});

const activities = profile.vocabularyGroups.flatMap((group) => group.activities);
unique(activities.map((item) => item.id), 'unique activity IDs');
profile.vocabularyGroups.forEach((group) => {
  const shapePositions = group.activities.filter((item) => item.type === 'shape').map((item) => item.options.indexOf(item.answer));
  ok(shapePositions.every((index) => index >= 0 && index < 4), 'shape answers present: ' + group.id);
  ok(new Set(shapePositions).size >= Math.min(3, shapePositions.length), 'shape answers use varied positions: ' + group.id);
  ok(maxRun(shapePositions) <= 2, 'shape answer position never repeats more than twice: ' + group.id);
});
activities.filter((item) => item.type === 'shape').forEach((item) => {
  unique(item.options, 'unique shape options: ' + item.id);
  ok(item.options.length === 4 && item.options.includes(item.answer), 'four-option shape answer: ' + item.id);
  ok(item.stimulus !== item.answer && !item.stimulus.startsWith(item.answer + '：'), 'shape prompt does not reveal answer: ' + item.id);
});
activities.filter((item) => item.type === 'input').forEach((item) => ok(item.evaluation === 'automatic' && item.acceptedAnswers.includes(item.answer), 'automatic input: ' + item.id));
activities.filter((item) => item.type === 'collocation').forEach((item) => {
  ok(item.evaluation === 'teacher' && item.promptEn && /最多两句话/.test(item.promptCn), 'bounded bilingual collocation: ' + item.id);
  ok(item.stimulus && item.answer.length > item.stimulus.length, 'usable collocation sample: ' + item.id);
});

same(profile.evidencePolicy.coreTypes, ['entry_expression','actual_learning_path','exit_expression'], 'three core evidence types');
same(profile.coreEvidence, profile.evidencePolicy.coreTypes, 'core evidence alias');
same(profile.evidencePolicy.pathEvent, 'opened', 'actual learning-path event');
same(profile.supportOptions.length, 4, 'four support options');
same(profile.feelingOptions.length, 4, 'four reflection options');
same(profile.timerPolicy.miniLoop.optionsMinutes, [3,4,5], 'MINI timer choices');
same(profile.timerPolicy.miniLoop.defaultMinutes, 4, 'MINI timer default');
same(profile.timerPolicy.vocabularyFocus.optionsMinutes, [2,3,4,5], 'vocabulary timer choices');
same(profile.timerPolicy.vocabularyFocus.defaultMinutes, 2, 'vocabulary timer default');
ok(!profile.timerPolicy.autoClose && !profile.timerPolicy.autoSubmit, 'timer never auto-closes or submits');
ok(profile.capabilities.includes('state_restore') && profile.capabilities.includes('native_course_resource_return') && profile.capabilities.includes('compare_entry_exit'), 'restore, native return, and entry/exit comparison');
ok(profile.supportOnlyStructures.length === 1 && profile.supportOnlyStructures[0].includes('不要求所有学生'), 'target grammar remains support/challenge');

const serialized = JSON.stringify(profile);
ok(!/[A-Z]:\\|file:\/\//.test(serialized), 'profile has no absolute filesystem paths');
ok(!/(正确答案|干扰项A|L17短文\d|完成口语任务\d)/.test(serialized), 'profile has no placeholders');
const sharedDiff = execFileSync('git', ['diff','--name-only','--','source/shared','source/in-class/lesson-data-loader.js','source/in-class/teacher.html','source/in-class/student.html','source/in-class/l08-use-pilot.js','source/in-class/l08-use-pilot.html','source/pre-class'], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
same(sharedDiff, [], 'stage 4 does not modify shared runtime');

console.log('\nHSK3-L17 use-profile validation passed: ' + checks + ' checks.');
