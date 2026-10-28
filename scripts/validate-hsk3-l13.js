const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L13.json');
const useProfilePath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L13-USE-PILOT-V1.json');
const sourcePath = path.join(root, 'textbook data', 'HSK3', 'L13.txt');
const builderPath = path.join(__dirname, 'build-hsk3-l13.js');
const referencePath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L08.json');
const errors = [];
const warnings = [];
const ok = (condition, message) => { if (!condition) errors.push(message); };
const exists = relative => fs.existsSync(path.join(root, relative));
const pngSize = file => {
  const buffer = fs.readFileSync(file);
  return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
};

ok(exists('scripts/build-hsk3-l13.js'), 'Missing L13 builder.');
ok(exists('textbook data/HSK3/L13.txt'), 'Missing L13 textbook source.');
ok(exists('source/data-model/lessons/HSK3-L13.json'), 'Missing generated formal JSON.');
ok(exists('source/data-model/experiments/HSK3-L13-USE-PILOT-V1.json'), 'Missing L13 shared Use profile.');
if (errors.length) finish();

const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
execFileSync(process.execPath,[builderPath],{stdio:'pipe'});
const firstHash = hash(jsonPath);
const firstUseHash = hash(useProfilePath);
execFileSync(process.execPath,[builderPath],{stdio:'pipe'});
const secondHash = hash(jsonPath);
const secondUseHash = hash(useProfilePath);
ok(firstHash === secondHash, 'Two builder runs produced different JSON hashes.');
ok(firstUseHash === secondUseHash, 'Two builder runs produced different Use profile hashes.');

const lesson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const useProfile = JSON.parse(fs.readFileSync(useProfilePath, 'utf8'));
const referenceLesson = JSON.parse(fs.readFileSync(referencePath, 'utf8'));
const source = fs.readFileSync(sourcePath, 'utf8');

ok(lesson.meta?.lessonKey === 'HSK3-L13', 'meta.lessonKey must be HSK3-L13.');
ok(lesson.meta?.title === '我的新邻居来自英国', 'Lesson title mismatch.');
ok(lesson.meta?.titleEn === 'My new neighbors come from the UK', 'English title must match the L13 document exactly.');
ok(lesson.meta?.sourceAuthority?.includes('textbook data/HSK3/L13.txt'), 'L13 source authority is not declared.');
ok(JSON.stringify(lesson.meta?.scopeExclusions) === JSON.stringify(['省','祝','准备','醉']), 'Scope exclusions must be 省、祝、准备、醉.');

const expectedWords = ['请客','南方','北方','做法','不同','加','的话','做客','邻居','放心','酒','放','客人','晚会','礼物','画家','盘子','一边','聊天儿','来自','夫妻','直到','地图','点','感到','东方','文化','英国'];
const sourceVocab = [...source.matchAll(/^\d+\.\s*([^|\r\n]+?)\s*\|\s*([^|\r\n]+?)\s*\|\s*([^|\r\n]+?)\s*\|\s*(.+)$/gm)].map(match=>({hanzi:match[1].trim(),pinyin:match[2].trim(),pos:match[3].trim(),english:match[4].trim()}));
ok(lesson.vocabulary?.length === 28, `Expected 28 vocabulary entries, got ${lesson.vocabulary?.length}.`);
ok(JSON.stringify(lesson.vocabulary?.map(item=>item.hanzi)) === JSON.stringify(expectedWords), 'Vocabulary order/content does not match the L13 document.');
ok(JSON.stringify(lesson.vocabulary?.map(({hanzi,pinyin,pos,english})=>({hanzi,pinyin,pos,english}))) === JSON.stringify(sourceVocab), 'Vocabulary hanzi/pinyin/POS/English does not exactly match the L13 document.');
ok(lesson.vocabulary?.find(item=>item.hanzi === '请客')?.english === 'stand treat', '请客 must use the user-confirmed English “stand treat”.');
for (const banned of ['省','祝','准备','醉']) ok(!lesson.vocabulary.some(item=>item.hanzi === banned), `${banned} must not be included in L13 vocabulary.`);
for (const item of lesson.vocabulary || []) {
  ok(item.sourceType === 'textbook' && item.sourceRef === 'textbook data/HSK3/L13.txt', `${item.id} lacks textbook source marking.`);
  ok(item.phraseSourceType === 'teaching_extension' && ['textbook','teaching_extension'].includes(item.exampleSourceType), `${item.id} phrase/example source marking is incomplete.`);
  ok(item.hanzi && item.pinyin && item.english && item.tags?.length === 1, `${item.id} is missing a required vocabulary field.`);
  ok(Array.isArray(item.phrases) && item.phrases.length >= 2 && item.example && item.examplePinyin, `${item.id} needs phrases and a complete example.`);
}

ok(lesson.grammar?.length === 3, `Expected 3 grammar points, got ${lesson.grammar?.length}.`);
ok(JSON.stringify(lesson.grammar?.map(item=>item.id)) === JSON.stringify(['g13_01','g13_02','g13_03']), 'Grammar IDs/order mismatch.');
for (const grammar of lesson.grammar || []) {
  ok(grammar.sourceType === 'textbook' && grammar.sourceRef, `${grammar.id} lacks textbook source marking.`);
  ok(grammar.scene && grammar.structure && grammar.explanation, `${grammar.id} lacks scene, structure or explanation.`);
  ok(grammar.examples?.length >= 5, `${grammar.id} must have at least five examples.`);
  ok(grammar.examples?.every(item=>item.hanzi && item.pinyin && item.english && item.sourceType), `${grammar.id} has incomplete or unmarked examples.`);
  const note = lesson.grammarTeachingNotes?.[grammar.id];
  ok(note?.presentationMode === 'progressive_grammar' && note?.mergeNoticeObserve === true && note?.observeMode === 'structure_rows', `${grammar.id} must use the L11-L12 progressive grammar contract.`);
  ok(note?.observePrompt && note?.structure && note?.structureEn && note?.observeHighlights?.length >= 5, `${grammar.id} observation stage is incomplete.`);
  ok(note?.visualLearning?.blocks?.length >= 3 && note?.oralQuestions?.length >= 4 && note?.structureVariants?.length >= 2 && note?.followUp?.length >= 1, `${grammar.id} progressive teaching note is incomplete.`);
  ok(note.followUp.every(item=>item.image && item.promptEn && item.target && item.sampleAnswer), `${grammar.id} follow-up task is incomplete.`);
}

const sourceGrammarExamples = [
  '你们有时间的话，就来我家做客。','你觉得满意的话，咱们就买。','明天天好的话，我就去爬山。',
  '你把声音开得太大了。','他把球踢进去了吗？','妈妈把房间收拾得非常干净。','现在天气太热了，你应该把这些东西放进冰箱里。',
  '咱们一边吃蛋糕，一边聊天儿吧。','我喜欢一边跑步，一边听音乐。','你不应该一边开车一边打电话。'
];
for (const sentence of sourceGrammarExamples) ok(lesson.grammar.some(item=>item.examples.some(entry=>entry.hanzi === sentence)), `Missing textbook grammar example: ${sentence}`);

ok(lesson.texts?.length === 4, `Expected 4 texts, got ${lesson.texts?.length}.`);
ok(lesson.texts?.[3]?.format === 'diary' && lesson.texts?.[3]?.genre === '日记', 'Text 4 must be presented as a diary.');
const expectedLineCounts = [8,7,6,1];
const requiredTextSnippets = [
  '今天我请客，你们想吃什么就点什么！',
  '我把饮料和酒都放进冰箱里了，客人来了再拿出来。',
  '我去把盘子拿过来，咱们一边吃蛋糕，一边聊天儿吧。',
  '我的新邻居是来自英国的夫妻。'
];
lesson.texts.forEach((text,index)=>{
  ok(text.id === `t_hsk3_l13_0${index+1}`, `Text ${index+1} ID mismatch.`);
  ok(text.lines?.length === expectedLineCounts[index], `Text ${index+1} line count mismatch.`);
  ok(text.sourceType === 'textbook' && text.sourceRef === 'textbook data/HSK3/L13.txt', `Text ${index+1} lacks textbook source marking.`);
  ok(text.titleSourceType === 'teaching_extension', `Text ${index+1} teaching title must be marked as an extension.`);
  ok(text.lines?.every(line=>line.hanzi && line.pinyin && line.english), `Text ${index+1} has incomplete lines.`);
  ok(text.lines?.every(line=>line.englishSourceType === (index < 3 ? 'textbook' : 'teaching_extension')), `Text ${index+1} English source marking is incorrect.`);
  ok(text.lines?.some(line=>line.hanzi.includes(requiredTextSnippets[index])), `Text ${index+1} does not preserve its required source text.`);
  const audio = text.audio.replace('../../','');
  ok(exists(audio), `Missing audio file ${audio}.`);
});
const sourceChinese = [...source.matchAll(/\*\*中文\*\*：(?:\r?\n)?([^\r\n]+)/g)].map(match=>match[1].trim());
const sourcePinyin = [...source.matchAll(/\*\*拼音\*\*：(?:\r?\n)?([^\r\n]+)/g)].map(match=>match[1].trim());
const sourceEnglish = [...source.matchAll(/\*\*英文\*\*：([^\r\n]+)/g)].map(match=>match[1].trim());
const lessonLines = lesson.texts.flatMap(text=>text.lines);
ok(JSON.stringify(lessonLines.map(line=>line.hanzi)) === JSON.stringify(sourceChinese), 'Textbook Chinese lines are not an exact L13 source match.');
ok(JSON.stringify(lessonLines.map(line=>line.pinyin)) === JSON.stringify(sourcePinyin), 'Textbook pinyin lines are not an exact L13 source match.');
ok(JSON.stringify(lessonLines.slice(0,sourceEnglish.length).map(line=>line.english)) === JSON.stringify(sourceEnglish), 'Textbook English lines for texts 1–3 are not an exact L13 source match.');
ok(lesson.texts[3].lines[0].englishSourceType === 'teaching_extension' && lesson.texts[3].translationPolicy, 'Text 4 English must be marked as a teaching extension.');
ok(source.includes('stand treat'), 'L13 source no longer contains the confirmed 请客 translation.');
ok(source.includes('我的新邻居是来自英国的夫妻。'), 'L13 source is missing text 4.');

ok(JSON.stringify(lesson.sessions?.map(item=>item.textIds)) === JSON.stringify([['t_hsk3_l13_01'],['t_hsk3_l13_02'],['t_hsk3_l13_03','t_hsk3_l13_04']]), 'Session text allocation must be A=1, B=2, C=3+4.');
for (const session of lesson.sessions || []) {
  ok(session.communicativeGoal && session.requiredVocabulary?.length && session.receptiveVocabulary?.length && session.grammarIds?.length && session.classOutput && session.preparation && session.homework && session.bridgeToNext, `Session ${session.id} is missing plan fields.`);
}

ok(lesson.previewMissions?.length === 3, 'Expected three preview missions.');
for (const mission of lesson.previewMissions || []) {
  ok(mission.stages?.length === 5, `${mission.id} must have five stages.`);
  ok(mission.stages?.map(stage=>stage.interactionType).join('|') === 'study_list|practice_quiz|timed_match|practice_quiz|ranked_quiz', `${mission.id} stage types mismatch.`);
  ok(mission.stages?.[4]?.questions?.length === 10, `${mission.id} final challenge must have 10 questions.`);
  ok(mission.persistenceKeyPattern?.includes(`HSK3-L13_${mission.session}`) && mission.persistenceKeyPattern?.includes('{student}') && mission.persistenceKeyPattern?.endsWith('_v1'), `${mission.id} persistence key is not isolated.`);
  ok(JSON.stringify(mission.reportFields) === JSON.stringify(['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt']), `${mission.id} report fields mismatch.`);
}

const scenes = lesson.vocabScenes || {};
ok(Object.keys(scenes).join(',') === '1,2,3,4', 'Vocab scene selector must expose texts 1–4.');
const imagePaths = [];
for (const [textNo,scene] of Object.entries(scenes)) {
  ok(scene.steps?.length === 2, `Text ${textNo} must have two coherent scene steps.`);
  for (const step of scene.steps || []) {
    ok(step.image && step.prompt && step.promptPinyin && step.promptEn && step.talkHint, `Scene ${step.title} is incomplete.`);
    ok(step.words?.length >= 3 && step.words?.length <= 5, `Scene ${step.title} should teach 3–5 words.`);
    ok(step.labels?.length >= 3 && step.labels?.length <= 4, `Scene ${step.title} should contain 3–4 visual labels.`);
    ok(step.sampleAnswers?.length >= 2, `Scene ${step.title} needs at least two sample answers.`);
    imagePaths.push(step.image);
  }
}
ok(new Set(imagePaths).size === 8, 'The eight vocabulary scenes must use eight distinct images.');
for (const image of imagePaths) {
  const relative = path.join('source','in-class',image);
  ok(exists(relative), `Missing L13 scene image source/in-class/${image}.`);
  if (exists(relative)) {
    const size = pngSize(path.join(root,relative));
    ok(size.width > size.height && size.width >= 1500, `${image} must be a landscape PNG at least 1500px wide; got ${size.width}x${size.height}.`);
  }
}

ok(Object.keys(lesson.textTeachingNotes || {}).length === 4, 'Expected text teaching notes for all four texts.');
for (const [textId,note] of Object.entries(lesson.textTeachingNotes || {})) {
  ok(note.presentationMode === 'listen_first_progressive', `${textId} must use the L11-L12 progressive text contract.`);
  ok(note.listenPrompt && note.preReadingQuestions?.length >= 2, `${textId} listen-first stage is incomplete.`);
  ok(note.overallChoice?.id && note.overallChoice?.question && note.overallChoice?.pinyin && note.overallChoice?.options?.length === 4 && note.overallChoice?.answer, `${textId} overall choice is incomplete.`);
  ok(note.classQuestions?.length === 5, `${textId} must have exactly five detail questions.`);
  for (const item of note.classQuestions || []) ok(item.id && item.question && item.question_pinyin && item.answer && item.answer_pinyin && item.acceptedAnswers?.length && item.informationPoint, `${textId} has an incomplete detail question.`);
  ok(note.keyPoints?.length >= 3 && note.cultureDiscussion?.questions?.length >= 2 && note.retellScaffold?.nodes?.length >= 5 && note.retellScaffold?.frame, `${textId} teaching, application or retell stage is incomplete.`);
}

const groups = lesson.inClass?.questionGroups || {};
ok(JSON.stringify(Object.keys(groups).sort()) === JSON.stringify(Object.keys(referenceLesson.inClass.questionGroups).sort()), 'L13 practice group keys must match the shared L8 architecture.');
const expectedCounts = {v5_vocab_fill:3,v7_word_match:3,g1_ordering:5,scene_sentence_choice:10,v6_description_guess:10,v2_say_guess:8,v3_blind_box:4,g2_picture_complete:8,r2_passage_choice:5,r3_independent_reading:5,r4_paragraph_fill:5,t3_chain_sentence:5,t2_task_card:5,pk_question:3};
for (const [key,count] of Object.entries(expectedCounts)) ok(groups[key]?.length === count, `${key} expected ${count}, got ${groups[key]?.length}.`);
for (const [key,value] of Object.entries(groups)) {
  if (Array.isArray(value)) ok(value.every(item=>item.sourceType === 'teaching_extension'), `${key} items must be marked as teaching extensions.`);
}
ok(groups.v7_word_match?.every(group=>group.data?.pairs?.length === 5), 'Each word-match group must contain five pairs.');
ok(groups.v5_vocab_fill?.every(group=>group.data?.wordBank?.length === 5 && group.data?.wordBank_pinyin?.length === 5 && group.data?.sentences?.length === 5), 'Each vocabulary-fill group must contain five words and five sentences.');
ok(groups.v7_word_match?.every(group=>group.type === 'question_answer_match' && group.data?.neutralBeforeSubmit === true && group.data?.allowUndo === true && group.data?.submitAll === true), 'Word matching must use the shared submit-all interaction.');
ok(groups.v3_blind_box?.every(item=>item.data?.words?.length === 2 && item.data?.revealDecoration === 'none' && item.data?.uniformWordSize === true), 'Blind-box items must use two uniform undecorated expressions.');
ok(groups.v2_say_guess?.every(item=>!item.data?.competition && item.prompt_cn === '说一说、猜一猜。'), 'L13 say-and-guess must keep the established shared interaction without a new team-scoring branch.');
ok(groups.r2_passage_choice?.every(item=>item.data?.questions?.length === 3), 'Each passage must contain three questions.');
ok(groups.r2_passage_choice?.every(item=>item.data?.passage_pinyin && item.data.questions.every(question=>question.answer === question.options[question.correct_index])), 'Each reading passage needs pinyin and answer-index consistency.');
ok(groups.r3_independent_reading?.every(item=>item.correct_answer === item.data?.options?.[item.data?.correct_index]), 'Independent-reading answers are inconsistent.');
ok(groups.r4_paragraph_fill?.every(item=>item.data?.options?.length === 6 && item.data?.answers?.length === 3 && item.data?.slotColors?.join('|') === 'green|blue|orange'), 'Paragraph fills must use six options, three answers and shared colors.');
ok(groups.t3_chain_sentence?.every(item=>item.data?.keywords?.length === 5 && item.data?.keywords_pinyin?.length === 5 && item.data?.chainModes?.join('|') === 'teacher|race|team'), 'Chain tasks must contain five words, pinyin and three shared modes.');
ok(groups.battleGames?.roulette?.length >= 5 && groups.battleGames?.relay?.length >= 3 && groups.battleGames?.monopoly?.tasks?.length >= 12, 'Public game content is incomplete.');

const roleItems = Object.values(groups).flatMap(value=>Array.isArray(value)?value:[]).filter(item=>item?.contentRole);
const roleCounts = roleItems.reduce((acc,item)=>(acc[item.contentRole]=(acc[item.contentRole]||0)+1,acc),{});
const roleTotal = roleItems.length || 1;
const ratios = Object.fromEntries(['lesson','transfer','review'].map(role=>[role,Math.round((roleCounts[role]||0)*100/roleTotal)]));
ok(Math.abs(ratios.lesson-50) <= 5 && Math.abs(ratios.transfer-30) <= 5 && Math.abs(ratios.review-20) <= 5, `Exercise role mix is ${ratios.lesson}/${ratios.transfer}/${ratios.review}, outside tolerance.`);

const homework = lesson.postClassHomework;
ok(homework?.wrongPointsDefaultCollapsed === true, 'Homework wrong points must be collapsed by default.');
ok(['A','B','C'].every(session=>homework.sessions?.[session]?.length === 3), 'Each homework session must have three tasks.');
for (const session of ['A','B','C']) {
  ok(homework.sessions[session].every(item=>item.sourceType === 'teaching_extension'), `Homework ${session} tasks must be marked as teaching extensions.`);
  const project = homework.sessions[session][1];
  ok(project.scaffoldLevels?.map(item=>item.label).join('|').includes('Support') && project.scaffoldLevels?.map(item=>item.label).join('|').includes('Core') && project.scaffoldLevels?.map(item=>item.label).join('|').includes('Challenge'), `Homework ${session} lacks Support/Core/Challenge.`);
  ok(project.picturePrompts?.length >= 2, `Homework ${session} lacks required materials/picture prompts.`);
  const showcase = homework.sessions[session][2];
  ok(showcase.presentationPlan?.some(line=>line.includes('No audio upload')), `Homework ${session} must explicitly say no audio upload.`);
}
ok(homework.sessions.B[0].carryFrom?.some(item=>item.session==='A') && homework.sessions.B[1].carryFrom?.some(item=>item.session==='A'), 'Homework B must carry A material.');
ok(homework.sessions.C[0].carryFrom?.length === 2 && homework.sessions.C[1].carryFrom?.length === 2, 'Homework C must carry both A and B material.');
ok(homework.sessions.C[2].classroomOnly === true && homework.sessions.C[2].submissionRequired === false, 'Homework C final presentation must be classroom-only with no upload.');

ok(lesson.usePreparation?.status === 'active_shared_profile' && lesson.usePreparation?.configurationCreated === true && lesson.usePreparation?.profile === 'pilot-v1' && lesson.usePreparation?.tasks?.length === 4, 'L13 must declare its active shared Use profile for all four texts.');
ok(useProfile.schemaVersion === 'classpro-use-profile/v3' && useProfile.experiment?.id === 'l13-use-pilot-v1' && useProfile.experiment?.sourceLesson === 'HSK3-L13', 'L13 Use profile identity is invalid.');
ok(useProfile.useGroups?.length === 4 && useProfile.textLearning?.length === 4 && useProfile.vocabularyGroups?.length === 4, 'L13 Use profile must expose four aligned mini loops, text flows and vocabulary groups.');
ok(useProfile.useGroups?.every((group,index)=>group.textIndex === index && group.linkedResources?.text?.textIndex === index && group.entry?.stimulus?.image && group.exitRequirements?.length >= 4), 'L13 Use groups are not aligned with the four texts.');
ok(useProfile.textLearning?.every(item=>item.overviewChoices?.length === 3 && item.detailMode === 'config' && item.detailQuestions?.length === 5 && item.grammarBridge && item.paragraphPractice && item.lifeTransfer), 'L13 five-stage text-learning configuration must contain three overall choices and five detail questions per text.');
ok(useProfile.sources?.lesson?.sha256 === crypto.createHash('sha256').update(fs.readFileSync(jsonPath)).digest('hex').toUpperCase(), 'L13 Use profile lesson hash is stale.');
for (const page of ['source/in-class/teacher.html','source/in-class/student.html','source/pre-class/index.html','source/post-class/student-report.html']) ok(exists(page), `Missing shared page ${page}.`);
const jsFiles = ['scripts/build-hsk3-l13.js','scripts/validate-hsk3-l13.js','source/in-class/l08-use-pilot.js','source/in-class/lesson-data-loader.js','source/pre-class/lesson-data-loader.js','source/post-class/lesson-data-loader.js','source/shared/class-config.js','source/shared/students.js','source/shared/context.js'];
for (const file of jsFiles) {
  ok(exists(file), `Missing JavaScript ${file}.`);
  if (exists(file)) {
    try { new vm.Script(fs.readFileSync(path.join(root,file),'utf8'), {filename:file}); } catch (error) { errors.push(`${file} does not parse: ${error.message}`); }
  }
}
const scanFiles = ['source/in-class/lesson-data-loader.js','source/pre-class/lesson-data-loader.js','source/post-class/lesson-data-loader.js','source/in-class/teacher.html','source/in-class/student.html','source/pre-class/index.html','source/post-class/student-report.html'];
for (const file of scanFiles) {
  const body = fs.readFileSync(path.join(root,file),'utf8');
  ok(!/lesson\s*===\s*["']HSK3-L13["']/.test(body), `${file} contains a forbidden L13 runtime branch.`);
}
const teacherPage = fs.readFileSync(path.join(root,'source/in-class/teacher.html'),'utf8');
const useWrapper = fs.readFileSync(path.join(root,'source/in-class/l08-use-pilot.js'),'utf8');
ok(!teacherPage.includes('class="home-card use"') && !teacherPage.includes('_use(){'), 'Base teacher page must remain the fixed four-card interface; Use is injected only by the shared wrapper.');
ok(useWrapper.includes("const LESSON = PARAMS.get('lesson')") && useWrapper.includes('usePilotHomeCard') && useWrapper.includes("['先听 / 读', 'Listen / Read']") && useWrapper.includes("['语言与应用', 'Use']"), 'Shared Use wrapper must dynamically load the lesson and install the L12 five-stage text path.');
ok(teacherPage.includes('CLASSROOM_DANDELION') && teacherPage.includes("classroomModuleIcon('teach')") && teacherPage.includes('home-brand-mark'), 'Shared teacher home must use the latest dandelion brand and module-icon shell.');
ok(useWrapper.includes("frame.contentWindow.classroomModuleIcon('use')"), 'Shared Use wrapper must use the current application module icon when available.');
ok(teacherPage.includes('.hsk3-story-image img{object-fit:contain!important}') && teacherPage.includes('height:min(56vh,520px)!important'), 'Shared vocabulary scenes must keep the full projected image visible.');
ok(!teacherPage.includes('hsk3GuessCompetition') && !teacherPage.includes('两步都完成才能得分'), 'Deferred group-PK changes must not be present in the shared teacher renderer.');
const rosterConfig = fs.readFileSync(path.join(root,'source/shared/class-config.js'),'utf8');
ok(rosterConfig.includes('if (!students || !students.length)') && fs.readFileSync(path.join(root,'source/shared/students.js'),'utf8').includes('if (names.length) return names'), 'Shared roster must fall back when a stale class has no roster for the active lesson level.');
function compileInlineScripts(relative) {
  const html = fs.readFileSync(path.join(root,relative),'utf8');
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match=>!/\bsrc\s*=/.test(match[1]) && !/type\s*=\s*["'](?!text\/javascript|application\/javascript)/i.test(match[1]));
  scripts.forEach((match,index)=>new vm.Script(match[2],{filename:`${relative}#inline-${index+1}`}));
  return scripts.length;
}
for (const page of ['source/in-class/teacher.html','source/in-class/student.html','source/pre-class/index.html','source/post-class/student-report.html']) {
  try { compileInlineScripts(page); } catch (error) { errors.push(`${page} inline script does not compile: ${error.message}`); }
}

function simulateLoader(loaderRelative, pageUrl) {
  const loaderPath = path.join(root,loaderRelative);
  const baseDir = path.dirname(loaderPath);
  class MockXHR {
    open(method,url) { this.url = url; }
    send() {
      const clean = String(this.url).split('?')[0];
      const file = path.resolve(baseDir,clean);
      if (!fs.existsSync(file)) { this.status = 404; this.responseText = ''; return; }
      this.status = 200;
      this.responseText = fs.readFileSync(file,'utf8');
    }
  }
  const context = {console,URLSearchParams,XMLHttpRequest:MockXHR,location:new URL(pageUrl),document:{write(){}}};
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'source','data-model','course-data-adapter.js'),'utf8'),context,{filename:'source/data-model/course-data-adapter.js'});
  vm.runInContext(fs.readFileSync(loaderPath,'utf8'),context,{filename:loaderRelative});
  return context;
}
try {
  const teacherLoad = simulateLoader('source/in-class/lesson-data-loader.js','http://localhost:18765/source/in-class/teacher.html?lesson=HSK3-L13&room=8888');
  ok(teacherLoad.LESSON_DATA?.meta?.lessonKey === 'HSK3-L13' && teacherLoad.LESSON_DATA?.vocabulary?.length === 28, 'Shared in-class loader did not normalize L13 correctly.');
  ok(Object.keys(teacherLoad.LESSON_DATA?.classProQuestions || {}).sort().join('|') === Object.keys(groups).sort().join('|'), 'Shared in-class loader lost an L13 practice group.');
  const previewLoad = simulateLoader('source/pre-class/lesson-data-loader.js','http://localhost:18765/source/pre-class/index.html?lesson=HSK3-L13&session=B');
  ok(previewLoad.D?.lessonTitle?.includes('我的新邻居来自英国') && previewLoad.D?.preClass?.missionId === 'pm_hsk3_l13_b', 'Shared pre-class loader did not select L13 session B.');
  const homeworkLoad = simulateLoader('source/post-class/lesson-data-loader.js','http://localhost:18765/source/post-class/student-report.html?lesson=HSK3-L13');
  ok(Object.keys(homeworkLoad.LESSON_DATA?.postClassHomework?.sessions || {}).join('|') === 'A|B|C', 'Shared post-class loader did not expose L13 A/B/C homework.');
} catch (error) {
  errors.push(`Shared loader simulation failed: ${error.message}`);
}

const ids = [];
function collectIds(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.id === 'string') ids.push(value.id);
  if (Array.isArray(value)) value.forEach(collectIds); else Object.values(value).forEach(collectIds);
}
collectIds(lesson);
const duplicates = [...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
ok(duplicates.length === 0, `Duplicate IDs: ${duplicates.join(', ')}`);
ok(!JSON.stringify(lesson).match(/l(?:0?[1-9]|1[0-2])_/i), 'Found stale L1–L12 item IDs in L13 JSON.');

finish();

function finish() {
  if (warnings.length) warnings.forEach(message=>console.warn(`WARN: ${message}`));
  if (errors.length) {
    errors.forEach(message=>console.error(`ERROR: ${message}`));
    console.error(`HSK3-L13 validation failed with ${errors.length} error(s).`);
    process.exit(1);
  }
  console.log('HSK3-L13 validation passed.');
  console.log(`Checked ${lesson?.vocabulary?.length || 0} words, ${lesson?.grammar?.length || 0} grammar points, ${lesson?.texts?.length || 0} texts, 3 previews, classroom practice, games, homework and shared boundaries.`);
}
