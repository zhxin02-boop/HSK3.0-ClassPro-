const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { build, outputPath } = require('./build-hsk3-l08-use-pilot');

const root = path.resolve(__dirname, '..');
const teacherJsPath = path.join(root, 'source', 'in-class', 'l08-use-pilot.js');
const studentBridgePath = path.join(root, 'source', 'in-class', 'l08-use-student-bridge.js');
const teacherHtmlPath = path.join(root, 'source', 'in-class', 'l08-use-pilot.html');
const lessonLoaderPath = path.join(root, 'source', 'in-class', 'lesson-data-loader.js');
const formalLessonPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L08.json');
const formalStudentPath = path.join(root, 'source', 'in-class', 'student.html');
const teacherHomePath = path.join(root, 'source', 'teacher', 'index.html');

function assert(condition, message) { if (!condition) throw new Error(message); }
function read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function hashJson(filePath) { return crypto.createHash('sha256').update(JSON.stringify(JSON.parse(read(filePath)))).digest('hex').toUpperCase(); }

const expected = build();
const actual = JSON.parse(read(outputPath));
assert(JSON.stringify(actual) === JSON.stringify(expected), 'Generated experiment is not deterministic or is stale');
assert(actual.schemaVersion === 'classpro-use-pilot/v2', 'Pilot schema must be v2');
assert(actual.experiment.sourceLesson === 'HSK3-L08', 'Wrong source lesson');
assert(!actual.sources.teacher.sha256 && !actual.sources.student.sha256, 'Shared runtime pages must not be pinned to unrelated whole-file hashes');
assert(actual.useGroups.length === 4, 'Pilot must provide one MINI loop for each L8 text');
assert(actual.useGroups.map(item => item.id).join(',') === 'T1,T2,T3,T4', 'MINI loop IDs must stay aligned with Text 1–4');
assert(actual.useGroups.every((item, index) => item.entry && item.exit && item.textIndex === index), 'Every MINI loop must have a start, an end, and the matching text index');
assert(actual.useGroups[0].entry.promptCn === '和大家分享你的生活习惯：一个好习惯，一个坏习惯。', 'Text 1 task must use the agreed habit prompt');
assert(actual.useGroups[1].entry.promptCn.includes('我今天有点儿不舒服'), 'Text 2 task must use the agreed WeChat moment');
assert(actual.useGroups[2].entry.promptCn.includes('我住院了，别担心'), 'Text 3 task must use the agreed hospital post');
assert(actual.useGroups[3].contextCn.includes('每天睡前吃一次') && actual.useGroups[3].contextCn.includes('每天吃三次'), 'Text 4 must include the agreed doctor message');
assert(actual.coreEvidence.join(',') === 'entry_expression,actual_learning_path,exit_expression', 'A MINI loop must keep exactly three core evidence types');

assert(actual.textLearning.length === 4, 'All four texts need integrated text-learning data');
actual.textLearning.forEach((item, index) => {
  assert(item.useGroupId === `T${index + 1}`, `Text ${index + 1} must link to its MINI loop`);
  assert(item.overviewChoices.length === 3, `Text ${index + 1} must begin with three overall choice questions`);
  assert(item.overviewChoices.map(question => question.focus).join(',') === 'main_idea,development,purpose', `Text ${index + 1} overview must check main idea, development, and communicative purpose`);
  assert(item.overviewChoices.every(question => !Object.prototype.hasOwnProperty.call(question, 'questionEn')), `Text ${index + 1} overview must not show English question explanations`);
  assert(item.detailQuestions.length === 5, `Text ${index + 1} must reuse five formal detail questions`);
  const detailQuestions = new Set(item.detailQuestions.map(question => question.questionCn));
  assert(item.overviewChoices.every(question => !detailQuestions.has(question.questionCn)), `Text ${index + 1} overview and detail questions must not repeat`);
  assert(item.paragraphPractice.index === index, `Text ${index + 1} must call its matching paragraph practice`);
  assert(item.grammarBridge.grammarIndex === index, `Text ${index + 1} must call its matching grammar point`);
});

const words = actual.vocabularyGroups.flatMap(group => group.words);
assert(words.length === 28 && new Set(words.map(word => word.id)).size === 28, 'Vocabulary layer must contain all 28 L8 words exactly once');
assert(words.filter(word => word.tier === 'expression').length === 16, 'L8 must keep 16 expression-core words');
assert(words.filter(word => word.tier === 'understanding').length === 8, 'L8 must keep 8 understanding-core words');
assert(words.filter(word => word.tier === 'context').length === 4, 'L8 must keep 4 contextual-support words');
assert(words.filter(word => word.tier === 'expression').every(word => ['recognition', 'shape', 'input', 'collocation'].every(type => word.allowedTypes.includes(type))), 'Every expression-core word must support all four agreed task types');
assert(actual.supportOptions.every(item => item.labelCn && item.labelEn), 'Support options must be bilingual');
assert(actual.feelingOptions.every(item => item.labelCn && item.labelEn), 'Feeling options must be bilingual');

const teacherHtml = read(teacherHtmlPath);
const teacherJs = read(teacherJsPath);
const studentBridge = read(studentBridgePath);
const lessonLoader = read(lessonLoaderPath);
const teacherHome = read(teacherHomePath);
assert(teacherHtml.includes('id="classproFrame"'), 'Teacher pilot must embed the formal ClassPro classroom');
assert(teacherHtml.includes('id="useLayer" class="use-layer hidden"'), 'Pilot must open on the formal ClassPro home screen');
assert(teacherHtml.includes('onclick="returnTeacherHome()"'), 'Use must provide a return-to-teacher-home button');
assert(teacherJs.includes('teacher.html?lesson='), 'Teacher pilot must route through the formal teacher page');
assert(teacherJs.includes('dataVersion=${encodeURIComponent(DATA_VERSION)}'), 'Teacher pilot must request fresh formal course data');
assert(teacherJs.includes('installNativeDataFetch'), 'Teacher pilot must refresh native test data when it is opened');
assert(teacherJs.includes('wireQrButtons') && teacherJs.includes('button[title="学生扫码进入"]'), 'Opening the native QR code must hide the Use layer first');
assert(teacherJs.includes("button.textContent = '用'"), 'Teacher pilot must add the Use entry');
assert(teacherJs.includes("card.id = 'usePilotHomeCard'"), 'Teacher pilot must add Use to the formal home cards');
assert(teacherJs.includes('repeat(5,minmax(0,1fr))'), 'Formal home must display five main modules');
assert(teacherJs.includes('oldRibbon.remove()') && !teacherJs.includes('ribbon.innerHTML'), 'The green goal ribbon must remain removed');
assert(teacherJs.includes('openUseGroup') && teacherJs.includes('renderUseHome'), 'Use home must expose four independent MINI loops');
assert(teacherJs.includes('groupRecords') && teacherJs.includes('THREE CORE EVIDENCE'), 'Teacher evidence must be grouped by MINI loop and limited to the three core evidence types');
assert(teacherJs.includes('exportVisualReport') && teacherJs.includes('-class-report.html'), 'Shared Use runtime must provide a standalone visual classroom report');
assert(teacherHtml.includes('导出原始 JSON') && teacherHtml.includes('导出可视化报告'), 'Shared Use page must retain JSON alongside the visual report');
assert(teacherJs.includes('resources.vocabulary') && teacherJs.includes('resources.grammar') && teacherJs.includes('resources.text') && teacherJs.includes('resources.practice'), 'Each MINI loop must route to native resources');
assert(teacherJs.includes('vocabSession') && teacherJs.includes('grammarIndex') && teacherJs.includes('textIndex'), 'Resource routes must target the current text instead of using random content');
assert(teacherJs.includes('installVocabularyFocus') && teacherJs.includes('publishVocabularyFocus'), 'Vocabulary story must add a teacher-selected focus task');
assert(teacherJs.includes('一次最多选择4个词'), 'Vocabulary focus must remain a small teacher-selected batch');
assert(teacherJs.includes('installIntegratedTextFlow'), 'Formal text flow must be extended in place');
assert(!teacherJs.includes('function injectTextLearningDock'), 'The duplicate text-learning dock must stay removed');
assert(teacherJs.includes("['先听 / 读', 'Listen / Read']") && teacherJs.includes("['整体选择', 'Choose']") && teacherJs.includes("['细节问答', 'Q&A']") && teacherJs.includes("['展示课文', 'Text']") && teacherJs.includes("['语言与应用', 'Use']"), 'Text learning must keep the agreed five-step flow');
assert(teacherJs.includes('startTextOverview') && teacherJs.includes('publishTextChoiceResults'), 'Text overview choices must support independent answers and common return');
assert(teacherJs.includes('只抓主题、发展和交际目的') && teacherJs.includes('进入细节：逐题找出人物、时间、原因和关键信息'), 'Teacher text flow must visibly distinguish gist from detail');
assert(!teacherJs.includes('item.questionEn'), 'Teacher overview must not show English question explanations');
assert(teacherJs.includes('Array.from({ length: ROSTER.length }'), 'Anonymous wall must reserve one visible place per student');
assert(teacherJs.includes('localStorage.setItem(STORAGE_KEY'), 'Use state must persist while native resources are open');
assert(!teacherJs.includes('resourceCatalog'), 'Interaction must not be attached to every resource item');

assert(teacherJs.includes('installUnifiedStudentEntry') && teacherJs.includes('unifiedStudentUrl'), 'Teacher QR and student button must open the unified student page');
assert(teacherJs.includes('experiment=${encodeURIComponent(EXPERIMENT)}'), 'Unified student entry must activate the Use bridge');
assert(read(formalStudentPath).includes('l08-use-student-bridge.js'), 'Formal student page must load the optional Use bridge');
assert(studentBridge.includes('EXPECTED_EXPERIMENT') && studentBridge.includes('EXPERIMENT !== EXPECTED_EXPERIMENT'), 'Use bridge must stay inactive for ordinary student links');
assert(studentBridge.includes('classpro/use/${EXPERIMENT}/${ROOM}'), 'Use bridge must use the isolated experiment topic');
assert(studentBridge.includes('groupId: control.interaction.groupId'), 'Student evidence must retain its MINI-loop identity');
assert(studentBridge.includes('entryAnswers'), 'Student must preserve a separate starting expression for every MINI loop');
assert(studentBridge.includes('function renderChoiceSet') && studentBridge.includes('choiceAnswers: answers'), 'Student must complete text overview choices independently');
assert(studentBridge.includes('先抓大意，不找细节') && studentBridge.includes('先确认主题和发展，再进入细节问答'), 'Student text flow must visibly distinguish gist from detail');
assert(!studentBridge.includes('item.questionEn'), 'Student overview must not show English question explanations');
assert(studentBridge.includes('function renderVocabularyFocus') && studentBridge.includes('vocabAnswers: answers'), 'Student must receive and submit teacher-selected vocabulary focus tasks');
assert(studentBridge.includes('function renderVocabularyResults'), 'Student must receive the common vocabulary return');
assert(studentBridge.includes("interaction.currentAction === 'waiting'") && studentBridge.includes('restoreNative()'), 'Use bridge must return to the original student page for native resources');
assert(teacherJs.includes('classpro/use/${EXPERIMENT}/${ROOM}'), 'Use protocol must use an isolated topic');
assert(!teacherJs.includes('classpro/room/'), 'Use protocol must not write to the formal classroom topic');
assert(lessonLoader.includes("params.get('dataVersion')") && lessonLoader.includes("withDataVersion('../data-model/lessons/' + lesson + '.json')"), 'Shared lesson loader must honor the pilot data version');
assert(teacherHome.includes('selectedLesson.useProfile') && teacherHome.includes("'../in-class/l08-use-pilot.html'"), 'Teacher home must route configured lessons to the shared Use pilot');

assert(hashJson(formalLessonPath) === '69BD49407B2C11212026F1FA6FE7F572523022BD929D106554880D357F9A3C94', 'Formal L8 lesson changed during the pilot upgrade');

console.log('Validated: four independent Text 1–4 MINI loops share exactly three core evidence types.');
console.log('Validated: each loop routes to its matching vocabulary, grammar, text, and paragraph practice.');
console.log('Validated: vocabulary focus is teacher-selected and supports recognition, form, input, and collocation.');
console.log('Validated: generated L8 config matches the formal lesson source; shared teacher/student pages stay reusable.');
console.log('Validated: shared classroom export provides both visual HTML and raw JSON.');
