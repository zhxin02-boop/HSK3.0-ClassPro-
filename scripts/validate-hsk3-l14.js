const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L14.json');
const sourcePath = path.join(root, 'textbook data', 'HSK3', 'L14.txt');
const builderPath = path.join(__dirname, 'build-hsk3-l14.js');
const referencePath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L13.json');
const profilePath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L14-USE-PILOT-V1.json');
const errors = [];
const warnings = [];
const ok = (condition, message) => { if (!condition) errors.push(message); };
const exists = relative => fs.existsSync(path.join(root, relative));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const pngSize = file => { const b = fs.readFileSync(file); return {width:b.readUInt32BE(16),height:b.readUInt32BE(20)}; };

for (const file of ['scripts/build-hsk3-l14.js','textbook data/HSK3/L14.txt','docs/HSK3-L14完整课程内容蓝图-冻结版.md','source/data-model/lessons/HSK3-L14.json']) ok(exists(file), `Missing required file: ${file}.`);
ok(fs.existsSync(profilePath), 'L14 shared Use profile is missing.');
if (errors.length) finish();

execFileSync(process.execPath,[builderPath],{stdio:'pipe'});
const firstHash = hash(jsonPath);
execFileSync(process.execPath,[builderPath],{stdio:'pipe'});
ok(firstHash === hash(jsonPath), 'Two builder runs produced different formal JSON hashes.');

const lesson = JSON.parse(fs.readFileSync(jsonPath,'utf8'));
const source = fs.readFileSync(sourcePath,'utf8');
const reference = JSON.parse(fs.readFileSync(referencePath,'utf8'));
ok(lesson.meta?.lessonKey === 'HSK3-L14', 'meta.lessonKey must be HSK3-L14.');
ok(lesson.meta?.title === '这本书被别人借走了' && lesson.meta?.titleEn === 'This book is checked out', 'Lesson title does not exactly match L14.txt.');
ok(lesson.meta?.sourceAuthority?.includes('textbook data/HSK3/L14.txt'), 'L14 source authority is not declared.');
ok(lesson.meta?.missingResources?.textbookImages === true && lesson.meta?.missingResources?.textbookExercises === true, 'Missing textbook image/exercise status is not declared.');

const sourceVocab = [...source.matchAll(/^\d+\.\s*([^|\r\n]+?)\s*\|\s*([^|\r\n]+?)\s*\|\s*([^|\r\n]+?)\s*\|\s*(.+)$/gm)].map(match=>({hanzi:match[1].trim(),pinyin:match[2].trim(),pos:match[3].trim(),english:match[4].trim()}));
ok(sourceVocab.length === 27 && lesson.vocabulary?.length === 27, `Expected 27 vocabulary entries; source=${sourceVocab.length}, JSON=${lesson.vocabulary?.length}.`);
ok(JSON.stringify(lesson.vocabulary?.map(({hanzi,pinyin,pos,english})=>({hanzi,pinyin,pos,english}))) === JSON.stringify(sourceVocab), 'Vocabulary hanzi/pinyin/POS/English does not exactly match L14.txt.');
const expectedTiers = {
  expression:['词典','最好','图书馆','被','然后','忘记','电子书','表演','节目','怎么办','相信','新年','最后','一块儿','网站','视频'],
  understanding:['名人','故事','报纸','面前','有些','跳'],
  context:['节','女生','校长','班级','留学生']
};
for (const [tier,words] of Object.entries(expectedTiers)) ok(JSON.stringify(lesson.vocabulary.filter(item=>item.tier===tier).map(item=>item.hanzi)) === JSON.stringify(words), `${tier} vocabulary tier differs from the frozen blueprint.`);
for (const item of lesson.vocabulary || []) {
  ok(item.id?.match(/^v14_\d{2}$/), `Invalid vocabulary ID ${item.id}.`);
  ok(item.sourceType === 'textbook' && item.sourceRef === 'textbook data/HSK3/L14.txt', `${item.id} lacks textbook source marking.`);
  ok(item.meaningCn && item.meaningCnSourceType === 'teaching_extension' && item.phraseSourceType === 'teaching_extension', `${item.id} extension fields are not clearly marked.`);
  ok(item.tags?.length === 1 && ['A','B','C'].includes(item.tags[0]) && item.phrases?.length >= 2 && item.example && item.examplePinyin, `${item.id} is incomplete.`);
}

ok(JSON.stringify(lesson.grammar?.map(item=>item.id)) === JSON.stringify(['g14_01','g14_02','g14_03']), 'Grammar IDs/order mismatch.');
const sourceGrammarExamples = ['这本书被别人借走了。','水果可能被弟弟吃了。','我们俩经常被叫错名字。','我要先去图书馆借书，然后去游泳。','你先去买门票，再来这里找我。','你们先回房间休息一会儿，然后再出来吃晚饭。','紧张什么啊，我们都喜欢听你唱歌，你要相信自己。','胖什么啊，你看上去不胖也不瘦。','急什么啊，马上就到了。'];
for (const sentence of sourceGrammarExamples) ok(lesson.grammar.some(item=>item.examples?.some(entry=>entry.hanzi===sentence && entry.sourceType==='textbook')), `Missing textbook grammar example: ${sentence}`);
const expectedGrammarExplanations = [
  '汉语中用带“被”字的句子表达被动意义，突出主语受到了某个动作的影响，语气常带有被动、无奈、负面等色彩。副词和能愿动词放在“被”字前面，“被”字后面的宾语可以省略。基本结构：主语 + 被 + 宾语 + 动词 + 其他成分。',
  '承接复句“先……，再/然后……”中，两个分句表示动作的先后顺序。',
  '固定格式“×什么（啊）”通常用于否定对方的担忧、疑问或强调事实，带有反驳或安慰的语气。'
];
for (const grammar of lesson.grammar || []) {
  ok(grammar.sourceType === 'textbook' && grammar.scene && grammar.structure && grammar.explanation, `${grammar.id} formal grammar data is incomplete.`);
  ok(grammar.explanation === expectedGrammarExplanations[lesson.grammar.indexOf(grammar)] && grammar.explanationSourceType === 'textbook', `${grammar.id} does not preserve the full textbook explanation.`);
  ok(grammar.sceneSourceType === 'teaching_extension' && ['textbook','teaching_extension'].includes(grammar.structureSourceType), `${grammar.id} scene/structure source fields are not explicit.`);
  ok(grammar.examples?.length === 5, `${grammar.id} must expose five examples to the progressive renderer.`);
  ok(grammar.examples?.slice(0,3).every(item=>item.sourceType==='textbook' && item.hanziSourceType==='textbook' && item.pinyinSourceType==='teaching_extension' && item.englishSourceType==='teaching_extension'), `${grammar.id} textbook examples are not marked correctly.`);
  ok(grammar.examples?.slice(3).every(item=>item.sourceType==='teaching_extension' && item.hanziSourceType==='teaching_extension' && item.pinyinSourceType==='teaching_extension' && item.englishSourceType==='teaching_extension'), `${grammar.id} extension examples are not marked correctly.`);
  const note = lesson.grammarTeachingNotes?.[grammar.id];
  ok(note?.presentationMode === 'progressive_grammar' && note?.mergeNoticeObserve === true && ['structure_rows','dialogue_rows'].includes(note?.observeMode), `${grammar.id} does not use progressive grammar.`);
  ok(note?.examples?.length === 5 && note?.observeHighlights?.length === 5, `${grammar.id} observation stage must contain exactly five aligned rows.`);
  ok(JSON.stringify(note?.examples?.map(item=>item.hanzi)) === JSON.stringify(grammar.examples.map(item=>item.hanzi)), `${grammar.id} teaching-note examples do not match grammar.examples.`);
  ok(note?.visualLearning?.blocks?.length >= 3 && note?.oralQuestions?.length >= 4 && note?.structureVariants?.length >= 2 && note?.followUp?.length >= 1, `${grammar.id} four-step grammar content is incomplete.`);
  ok(note.followUp.every(item=>item.image && item.promptEn && item.target && item.sampleAnswer), `${grammar.id} follow-up practice is incomplete.`);
}
ok(JSON.stringify(lesson.grammarTeachingNotes?.g14_03).includes('熟人') && JSON.stringify(lesson.grammarTeachingNotes?.g14_03).includes('正式') && JSON.stringify(lesson.grammarTeachingNotes?.g14_03).includes('真实感受'), 'g14_03 lacks the frozen tone/usage reminder.');

const sourceChinese = [...source.matchAll(/\*\*中文\*\*：[ \t]*(?:\r?\n[ \t]*)?([^\r\n]+)/g)].map(match=>match[1].trim());
const sourcePinyin = [...source.matchAll(/\*\*拼音\*\*：[ \t]*(?:\r?\n[ \t]*)?([^\r\n]+)/g)].map(match=>match[1].trim());
const sourceEnglish = [...source.matchAll(/\*\*英文\*\*：[ \t]*([^\r\n]+)/g)].map(match=>match[1].trim());
const lines = lesson.texts?.flatMap(text=>text.lines) || [];
ok(lesson.texts?.length === 4 && JSON.stringify(lesson.texts.map(text=>text.lines.length)) === JSON.stringify([6,8,6,1]), 'Expected four texts with line counts 6/8/6/1.');
ok(JSON.stringify(lines.map(line=>line.hanzi)) === JSON.stringify(sourceChinese), 'Text Chinese is not an exact L14.txt match.');
ok(JSON.stringify(lines.map(line=>line.pinyin)) === JSON.stringify(sourcePinyin), 'Text pinyin is not an exact L14.txt match.');
ok(JSON.stringify(lines.slice(0,sourceEnglish.length).map(line=>line.english)) === JSON.stringify(sourceEnglish), 'Text 1–3 English is not an exact L14.txt match.');
ok(lesson.texts?.[3]?.format === 'diary' && lesson.texts[3].lines[0].english === '' && lesson.texts[3].lines[0].englishSourceType === 'missing' && lesson.texts[3].translationPolicy, 'Text 4 must be a diary with explicitly missing English, not an invented translation.');
const plannedAudio = ['../../audio/HSK3/14-1.mp3','../../audio/HSK3/14-3.mp3','../../audio/HSK3/14-5.mp3','../../audio/HSK3/14-7.mp3'];
lesson.texts?.forEach((text,index)=>{
  ok(text.id === `t_hsk3_l14_0${index+1}` && text.sourceType === 'textbook' && text.titleSourceType === 'teaching_extension', `Text ${index+1} identity/source marking is invalid.`);
  ok(text.audio === null && text.audioStatus === 'missing' && text.plannedAudio === plannedAudio[index], `Text ${index+1} audio state/path mismatch.`);
});

ok(JSON.stringify(lesson.sessions?.map(item=>item.textIds)) === JSON.stringify([['t_hsk3_l14_01'],['t_hsk3_l14_02'],['t_hsk3_l14_03','t_hsk3_l14_04']]), 'Session allocation must be A=1, B=2, C=3+4.');
ok(JSON.stringify(lesson.sessions?.map(item=>item.id)) === JSON.stringify(['A','B','C']), 'Session IDs must be A/B/C.');
for (const session of lesson.sessions || []) ok(session.communicativeGoal && session.requiredVocabulary?.length && session.receptiveVocabulary?.length && session.grammarIds?.length && session.classOutput && session.preparation && session.homework && session.bridgeToNext, `Session ${session.id} is incomplete.`);
ok(lesson.sessions?.[2]?.classOutput?.includes('校园晚会支持与回顾'), 'Session C final output is not the frozen task.');

ok(lesson.previewMissions?.length === 3, 'Expected three preview missions.');
for (const mission of lesson.previewMissions || []) {
  ok(mission.stages?.length === 5, `${mission.id} must have five stages.`);
  ok(mission.stages?.map(stage=>stage.interactionType).join('|') === 'study_list|practice_quiz|timed_match|practice_quiz|ranked_quiz', `${mission.id} stage types mismatch.`);
  ok(mission.stages?.[4]?.questions?.length === 10, `${mission.id} final challenge must have 10 questions.`);
  ok(mission.persistenceKeyPattern?.includes(`HSK3-L14_${mission.session}`) && mission.persistenceKeyPattern?.includes('{student}') && mission.persistenceKeyPattern?.endsWith('_v1'), `${mission.id} persistence key is not isolated.`);
}

const scenes = lesson.vocabScenes || {};
ok(Object.keys(scenes).join(',') === '1,2,3,4', 'Vocab scenes must expose texts 1–4.');
const imagePaths = [];
for (const [textNo,scene] of Object.entries(scenes)) {
  ok(scene.steps?.length === 2, `Text ${textNo} must have two scenes.`);
  for (const step of scene.steps || []) {
    ok(step.image && step.prompt && step.promptPinyin && step.promptEn && step.talkHint && step.sampleAnswers?.length >= 2, `${step.id} scene data is incomplete.`);
    ok(step.words?.length >= 3 && step.words?.length <= 4 && step.labels?.length >= 3 && step.labels?.length <= 4, `${step.id} word/label count is outside the frozen design.`);
    imagePaths.push(step.image);
  }
}
ok(new Set(imagePaths).size === 8, 'The eight scenes must use eight distinct images.');
for (const image of imagePaths) {
  const relative = path.join('source','in-class',image);
  ok(exists(relative), `Missing formal image source/in-class/${image}.`);
  if (exists(relative)) { const size=pngSize(path.join(root,relative)); ok(size.width > size.height && size.width >= 1500, `${image} must be landscape and at least 1500px wide; got ${size.width}x${size.height}.`); }
}

const fiveStages = ['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'];
ok(Object.keys(lesson.textTeachingNotes || {}).length === 4, 'Expected teaching notes for four texts.');
for (const [textId,note] of Object.entries(lesson.textTeachingNotes || {})) {
  ok(note.presentationMode === 'listen_first_progressive' && JSON.stringify(note.studentVisibleStages) === JSON.stringify(fiveStages), `${textId} does not use the frozen five-stage path.`);
  ok(note.overallChoices?.length === 3, `${textId} must have exactly three overall-choice questions.`);
  ok(note.classQuestions?.length === 5 && note.details?.length === 5, `${textId} must have exactly five detail questions.`);
  for (const item of note.details || []) ok(item.id && item.question && item.question_pinyin && item.answer && item.answer_pinyin && item.acceptedAnswers?.length && item.informationPoint, `${textId} has an incomplete detail question.`);
  ok(note.classQuestions?.every(item=>item.questionId && item.question && item.question_pinyin && item.answer && item.answer_pinyin && item.acceptedAnswers?.length && item.informationPoint), `${textId} shared-renderer detail aliases are incomplete.`);
  ok(Array.isArray(note.keyPoints) && note.keyPoints.length === 0, `${textId} must not render duplicate teaching cards below the textbook text.`);
  ok(note.cultureDiscussion?.questions?.length === 2 && note.cultureDiscussion?.wordCards?.length >= 3 && note.cultureDiscussion?.sampleAnswers?.length >= 2, `${textId} life-transfer prompts need questions, keyword cards and post-discussion reference expressions.`);
  ok(note.retellScaffold?.nodes?.length >= 5 && note.retellScaffold.nodes.every(item=>item.label && item.hint) && note.retellScaffold?.frame, `${textId} retell scaffold needs visible keyword labels, hints and a sentence frame.`);
  ok(note.languageAndApplication?.grammarIds?.length && note.languageAndApplication?.personalPrompt && note.languageAndApplication?.paragraphPracticeId && note.languageAndApplication?.miniId, `${textId} language-and-application stage is incomplete.`);
}

const groups = lesson.inClass?.questionGroups || {};
ok(JSON.stringify(Object.keys(groups).sort()) === JSON.stringify(Object.keys(reference.inClass.questionGroups).sort()), 'L14 practice group keys must match the current L13 shared architecture.');
const counts = {v5_vocab_fill:3,v7_word_match:3,g1_ordering:5,scene_sentence_choice:10,v6_description_guess:10,v2_say_guess:8,v3_blind_box:4,g2_picture_complete:8,r2_passage_choice:5,r3_independent_reading:5,r4_paragraph_fill:5,t3_chain_sentence:5,t2_task_card:5,pk_question:3,info_match:2,textQa:0,pictureTalk:0};
for (const [key,count] of Object.entries(counts)) ok(groups[key]?.length === count, `${key} expected ${count}, got ${groups[key]?.length}.`);
for (const [key,value] of Object.entries(groups)) if (Array.isArray(value)) ok(value.every(item=>item.sourceType === 'teaching_extension'), `${key} contains an unmarked exercise.`);
ok(groups.v5_vocab_fill?.every(item=>item.data?.wordBank?.length===5 && item.data?.sentences?.length===5), 'Vocabulary fill must be 3×5.');
ok(groups.v7_word_match?.every(item=>item.data?.pairs?.length===5 && item.data?.submitAll===true), 'Question-answer match must be 3×5 with submit-all behavior.');
ok(groups.r2_passage_choice?.every(item=>item.data?.questions?.length===3 && item.data.questions.every(q=>q.answer===q.options[q.correct_index])), 'Passage reading data is inconsistent.');
ok(groups.r3_independent_reading?.every(item=>item.correct_answer===item.data?.options?.[item.data?.correct_index]), 'Independent reading answers are inconsistent.');
ok(groups.r4_paragraph_fill?.every(item=>item.data?.options?.length===6 && item.data?.answers?.length===3), 'Paragraph fills must have six options and three answers.');
ok(groups.t3_chain_sentence?.every(item=>item.data?.keywords?.length===5 && item.data?.keywords_pinyin?.length===5 && item.data.keywords_pinyin.every(Boolean)), 'Chain tasks need five keywords and five non-empty pinyin strings.');
ok(JSON.stringify(groups.t2_task_card?.map(item=>item.id)) === JSON.stringify(['l14_task_01','l14_task_02','l14_task_03','l14_task_04','l14_task_05']), 'Task-card IDs/order differ from the frozen blueprint.');
ok(groups.battleGames?.roulette?.length>=8 && groups.battleGames?.relay?.length>=4 && groups.battleGames?.monopoly?.tasks?.length>=16, 'Shared game data is incomplete.');
const roleItems = Object.values(groups).flatMap(value=>Array.isArray(value)?value:[]).filter(item=>item.contentRole);
const roleCounts = roleItems.reduce((acc,item)=>(acc[item.contentRole]=(acc[item.contentRole]||0)+1,acc),{});
const ratios = Object.fromEntries(['lesson','transfer','review'].map(role=>[role,Math.round((roleCounts[role]||0)*100/(roleItems.length||1))]));
ok(Math.abs(ratios.lesson-50)<=5 && Math.abs(ratios.transfer-30)<=5 && Math.abs(ratios.review-20)<=5, `Exercise role mix is ${ratios.lesson}/${ratios.transfer}/${ratios.review}, outside tolerance.`);

const tests = lesson.inClass?.sessionTests || [];
ok(JSON.stringify(tests.map(item=>item.session)) === JSON.stringify(['A','B','C']) && tests.every(item=>item.audioRequired===false && item.questionIds?.length>=7 && item.sourceType==='teaching_extension'), 'Test A/B/C mapping is incomplete or contains fake listening requirements.');
const topQuestionIds = new Set(Object.values(groups).flatMap(value=>Array.isArray(value)?value:[]).map(item=>item.id));
for (const test of tests) for (const id of test.questionIds || []) ok(topQuestionIds.has(id), `${test.id} references missing question ${id}.`);

const homework = lesson.postClassHomework;
ok(homework?.wrongPointsDefaultCollapsed === true && ['A','B','C'].every(session=>homework.sessions?.[session]?.length===3), 'Homework A/B/C shape is invalid.');
for (const session of ['A','B','C']) {
  const project=homework.sessions[session][1], showcase=homework.sessions[session][2];
  ok(project.sourceType==='teaching_extension' && project.scaffoldLevels?.map(x=>x.label).join('|').includes('Support') && project.scaffoldLevels?.map(x=>x.label).join('|').includes('Core') && project.scaffoldLevels?.map(x=>x.label).join('|').includes('Challenge'), `Homework ${session} lacks extension marking or three scaffolds.`);
  ok(showcase.presentationPlan?.some(line=>line.includes('No audio upload')), `Homework ${session} must state that no audio upload is required.`);
}
ok(homework.sessions.B[1].carryFrom?.some(item=>item.session==='A') && homework.sessions.C[1].carryFrom?.length===2, 'Homework B/C carry-forward dependency is incomplete.');
ok(homework.sessions.C[2].classroomOnly===true && homework.sessions.C[2].submissionRequired===false, 'Homework C final presentation must be classroom-only with no upload.');

ok(lesson.usePreparation?.status==='active_shared_profile' && lesson.usePreparation?.configurationCreated===true && lesson.usePreparation?.profile==='pilot-v1', 'Formal lesson must point to the shared pilot-v1 profile.');
const formalPlan = lesson.usePreparation?.formalResourcePlan || [];
ok(JSON.stringify(formalPlan.map(item=>[item.id,item.grammarId,item.textId,item.practiceId])) === JSON.stringify([
  ['T1','g14_01','t_hsk3_l14_01','l14_task_01'],['T2','g14_02','t_hsk3_l14_02','l14_task_02'],['T3','g14_03','t_hsk3_l14_03','l14_task_03'],['T4','g14_01','t_hsk3_l14_04','l14_task_04']
]), 'Frozen MINI formal-resource mapping is incorrect.');

for (const page of ['source/in-class/teacher.html','source/in-class/student.html','source/pre-class/index.html','source/post-class/student-report.html']) ok(exists(page), `Missing shared page ${page}.`);
const jsFiles = ['scripts/build-hsk3-l14.js','scripts/validate-hsk3-l14.js','scripts/build-hsk3-l14-use-profile.js','scripts/validate-hsk3-l14-use-profile.js','source/data-model/course-data-adapter.js','source/in-class/lesson-data-loader.js','source/pre-class/lesson-data-loader.js','source/post-class/lesson-data-loader.js','source/shared/class-config.js','source/shared/students.js','source/shared/context.js'];
for (const file of jsFiles) if (exists(file)) { try { new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}); } catch (error) { errors.push(`${file} does not parse: ${error.message}`); } }
const scanFiles = ['source/in-class/lesson-data-loader.js','source/pre-class/lesson-data-loader.js','source/post-class/lesson-data-loader.js','source/in-class/teacher.html','source/in-class/student.html','source/pre-class/index.html','source/post-class/student-report.html'];
for (const file of scanFiles) ok(!/lesson\s*===\s*["']HSK3-L14["']/.test(fs.readFileSync(path.join(root,file),'utf8')), `${file} contains a forbidden L14 runtime branch.`);
const teacherPage = fs.readFileSync(path.join(root,'source/in-class/teacher.html'),'utf8');
ok(teacherPage.includes('.hsk3-story-image img{object-fit:contain!important}') && teacherPage.includes('height:min(56vh,520px)!important'), 'Shared vocabulary-scene CSS does not guarantee full image visibility.');
const rosterConfig = fs.readFileSync(path.join(root,'source/shared/class-config.js'),'utf8');
ok(rosterConfig.includes('if (!students || !students.length)') && fs.readFileSync(path.join(root,'source/shared/students.js'),'utf8').includes('if (names.length) return names'), 'Shared roster fallback is missing.');
const curriculum = fs.readFileSync(path.join(root,'source/data-model/hsk3-curriculum.js'),'utf8');
ok(/id:\s*["']HSK3-L14["']/.test(curriculum) && /title:\s*["']这本书被别人借走了["']/.test(curriculum) && /id:\s*["']HSK3-L14["'][^\n]+openForUse:\s*true[^\n]+status:\s*["']ready["'][^\n]+useProfile:\s*["']pilot-v1["']/.test(curriculum), 'Curriculum metadata must publish L14 as ready/open with pilot-v1.');

function compileInlineScripts(relative) {
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match=>!(/\bsrc\s*=/.test(match[1])) && !/type\s*=\s*["'](?!text\/javascript|application\/javascript)/i.test(match[1]));
  scripts.forEach((match,index)=>new vm.Script(match[2],{filename:`${relative}#inline-${index+1}`}));
}
for (const page of ['source/in-class/teacher.html','source/in-class/student.html','source/pre-class/index.html','source/post-class/student-report.html']) try { compileInlineScripts(page); } catch (error) { errors.push(`${page} inline script does not compile: ${error.message}`); }

function simulateLoader(loaderRelative,pageUrl) {
  const loaderPath=path.join(root,loaderRelative), baseDir=path.dirname(loaderPath);
  class MockXHR { open(method,url){this.url=url;} send(){const file=path.resolve(baseDir,String(this.url).split('?')[0]); this.status=fs.existsSync(file)?200:404; this.responseText=this.status===200?fs.readFileSync(file,'utf8'):'';} }
  const context={console,URLSearchParams,XMLHttpRequest:MockXHR,location:new URL(pageUrl),document:{write(){}}}; context.window=context; vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'source/data-model/course-data-adapter.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(loaderPath,'utf8'),context);
  return context;
}
try {
  const teacher=simulateLoader('source/in-class/lesson-data-loader.js','http://localhost:18765/source/in-class/teacher.html?lesson=HSK3-L14&room=8888');
  ok(teacher.LESSON_DATA?.meta?.lessonKey==='HSK3-L14' && teacher.LESSON_DATA?.vocabulary?.length===27, 'Shared teacher/student loader did not normalize L14.');
  ok(Object.keys(teacher.LESSON_DATA?.classProQuestions || {}).sort().join('|')===Object.keys(groups).sort().join('|'), 'Shared classroom loader lost an L14 question group.');
  for (const session of ['A','B','C']) { const preview=simulateLoader('source/pre-class/lesson-data-loader.js',`http://localhost:18765/source/pre-class/index.html?lesson=HSK3-L14&session=${session}`); ok(preview.D?.preClass?.missionId===`pm_hsk3_l14_${session.toLowerCase()}`, `Shared pre-class loader did not select L14 session ${session}.`); }
  const post=simulateLoader('source/post-class/lesson-data-loader.js','http://localhost:18765/source/post-class/student-report.html?lesson=HSK3-L14');
  ok(Object.keys(post.LESSON_DATA?.postClassHomework?.sessions || {}).join('|')==='A|B|C', 'Shared homework loader did not expose L14 A/B/C.');
} catch (error) { errors.push(`Shared loader simulation failed: ${error.message}`); }

const ids=[];
function collectIds(value){if(!value||typeof value!=='object')return;if(typeof value.id==='string')ids.push(value.id);if(Array.isArray(value))value.forEach(collectIds);else Object.values(value).forEach(collectIds);}
collectIds(lesson);
const duplicates=[...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
ok(duplicates.length===0, `Duplicate IDs: ${duplicates.join(', ')}`);
ok(!JSON.stringify(lesson).match(/(?:^|["'])l(?:0?[1-9]|1[0-3])_/i), 'Found stale L1–L13 item IDs in L14 JSON.');

const untouched = ['source/data-model/lessons/HSK3-L08.json','source/data-model/lessons/HSK3-L09.json','source/data-model/lessons/HSK3-L10.json','source/data-model/lessons/HSK3-L11.json','source/data-model/lessons/HSK3-L12.json','source/data-model/lessons/HSK3-L13.json','source/in-class/teacher.html','source/in-class/student.html','source/in-class/lesson-data-loader.js','source/pre-class/index.html','source/pre-class/lesson-data-loader.js','source/post-class/student-report.html','source/post-class/lesson-data-loader.js','source/shared/class-config.js','source/shared/students.js'];
try { execFileSync('git',['diff','--quiet','HEAD','--',...untouched],{cwd:root,stdio:'pipe'}); } catch { errors.push('One or more L8–L13 formal-course/shared-runtime files changed.'); }

finish();
function finish(){
  warnings.forEach(message=>console.warn(`WARN: ${message}`));
  if(errors.length){errors.forEach(message=>console.error(`ERROR: ${message}`));console.error(`HSK3-L14 validation failed with ${errors.length} error(s).`);process.exit(1);}
  console.log('HSK3-L14 formal-course validation passed.');
  console.log(`Checked 27 words, 3 grammar points, 4 texts, 3 previews, 8 images, ${roleItems.length} role-tagged exercises (${ratios.lesson}/${ratios.transfer}/${ratios.review}), games, tests, homework, shared loaders and L8–L13 boundaries.`);
}
