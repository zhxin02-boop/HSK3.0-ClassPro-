const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {execFileSync, execFileSync: run} = require('child_process');

const root = path.join(__dirname, '..');
const builderPath = path.join(root, 'scripts/build-hsk3-l16.js');
const lessonPath = path.join(root, 'source/data-model/lessons/HSK3-L16.json');
const sourcePath = path.join(root, 'textbook data/HSK3/L16.txt');

let checks = 0;
const ok = (value, message) => {
  if (!value) throw new Error('VALIDATION FAILED: ' + message);
  checks += 1;
};
const same = (actual, expected, message) => ok(
  JSON.stringify(actual) === JSON.stringify(expected),
  message + '\nexpected: ' + JSON.stringify(expected) + '\nactual:   ' + JSON.stringify(actual)
);
const unique = (items, message) => ok(new Set(items).size === items.length, message);
const countBy = (items, fn) => items.reduce((acc, item) => {
  const key = fn(item);
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
const maxRun = (items) => {
  let best = 0;
  let current = 0;
  let previous = Symbol('start');
  items.forEach((item) => {
    if (item === previous) current += 1;
    else current = 1;
    previous = item;
    best = Math.max(best, current);
  });
  return best;
};
const walk = (value, visitor) => {
  if (!value || typeof value !== 'object') return;
  visitor(value);
  if (Array.isArray(value)) value.forEach((item) => walk(item, visitor));
  else Object.values(value).forEach((item) => walk(item, visitor));
};

ok(fs.existsSync(builderPath), 'builder exists');
ok(fs.existsSync(sourcePath), 'authoritative textbook source exists');
const sourceBytes = fs.readFileSync(sourcePath);
same(
  crypto.createHash('sha256').update(sourceBytes).digest('hex').toUpperCase(),
  '986972A637FBE30C6338EA572770BECD454F8403A6D611BC368FD6E5883A7ABF',
  'exact textbook SHA-256'
);

execFileSync(process.execPath, [builderPath], {cwd:root, stdio:'pipe'});
const firstBuild = fs.readFileSync(lessonPath);
execFileSync(process.execPath, [builderPath], {cwd:root, stdio:'pipe'});
const secondBuild = fs.readFileSync(lessonPath);
ok(firstBuild.equals(secondBuild), 'builder is deterministic across consecutive runs');

const lesson = JSON.parse(secondBuild.toString('utf8'));
const source = sourceBytes.toString('utf8');
const serialized = JSON.stringify(lesson);

same(lesson.schemaVersion, '1.0.0', 'schema version');
same(lesson.meta.lessonKey, 'HSK3-L16', 'lesson key');
same(lesson.meta.title, '我听说有的熊猫出国了', 'Chinese title');
same(lesson.meta.titleEn, 'I heard that some pandas have gone abroad', 'approved English title');
same(lesson.meta.sourceAuthority, ['textbook data/HSK3/L16.txt'], 'single textbook authority');
same(lesson.meta.missingResources.audio, [], 'all four textbook audio files are available');
same(lesson.sessions.map((s) => s.id), ['A','B','C'], 'three-session plan');
same(lesson.sessions.map((s) => s.textIds.length), [1,1,2], 'A/B/C text allocation');
same(lesson.sessions.map((s) => s.grammarIds.length), [1,1,2], 'A/B/C grammar allocation');

const curriculum = fs.readFileSync(path.join(root, 'source/data-model/hsk3-curriculum.js'), 'utf8');
ok(curriculum.includes('id: "HSK3-L16"'), 'curriculum contains L16');
ok(curriculum.includes('en: "I heard that some pandas have gone abroad"'), 'curriculum uses approved English title');
ok(/id: "HSK3-L16"[^\n]+openForUse: true[^\n]+status: "ready"[^\n]+useProfile: "pilot-v1"/.test(curriculum), 'L16 is ready and routed through pilot-v1');
same(lesson.usePreparation.status, 'active_shared_profile', 'active shared use profile');
ok(lesson.usePreparation.configurationCreated === true && lesson.usePreparation.profile === 'pilot-v1', 'final use profile is declared');
ok(fs.existsSync(path.join(root, 'source/data-model/experiments/HSK3-L16-USE-PILOT-V1.json')), 'L16 pilot profile exists');

const textbookWords = ['脏','可爱','一会儿','脚','照顾','好像','认得','周末','动物园','动物','大熊猫','奇怪','其实','竹子','国宝','全','野生','关于','饱','张','嘴','身边','半天','脸','大人','喜爱'];
same(lesson.vocabulary.map((v) => v.hanzi), textbookWords, '26 textbook words in exact order');
unique(lesson.vocabulary.map((v) => v.id), 'unique vocabulary IDs');
same(countBy(lesson.vocabulary, (v) => v.tier), {understanding:7,expression:19}, 'vocabulary tier distribution');
lesson.vocabulary.forEach((v) => {
  ok(source.includes(v.hanzi + ' | ' + v.pinyin), 'source word and pinyin: ' + v.hanzi);
  ok(v.sourceType === 'textbook' && v.sourceRef === 'textbook data/HSK3/L16.txt', 'vocabulary authority: ' + v.id);
  ok(v.english && v.meaningCn && v.phrases.length === 2, 'complete vocabulary fields: ' + v.id);
  ok(v.example && v.examplePinyin && !/相关表达|使用目标词/.test(v.example), 'natural vocabulary example: ' + v.id);
});
same(lesson.vocabularyCatalog, lesson.vocabulary.map((v) => v.id), 'vocabulary catalog references all words once');
same(lesson.vocabularyGroups.map((g) => g.vocabularyIds.length), [10,8,6,2], 'T1/T2/T3/T4 formal grouping');
lesson.vocabularyGroups.forEach((group) => {
  ok(group.activities.length === 4, 'four vocabulary activity types: ' + group.id);
  ok(group.recognitionWordIds.length <= 4, 'recognition cap: ' + group.id);
});

same(lesson.grammar.map((g) => g.id), ['g16_01','g16_02','g16_03','g16_04'], 'four grammar IDs');
lesson.grammar.forEach((g) => {
  ok(g.sourceType === 'textbook' && source.includes(g.explanation), 'textbook grammar explanation: ' + g.id);
  same(g.examples.length, 5, 'five examples: ' + g.id);
  same(g.examples.filter((e) => e.sourceType === 'textbook').length, 3, 'three textbook examples: ' + g.id);
  same(g.examples.filter((e) => e.sourceType === 'teaching_extension').length, 2, 'two extension examples: ' + g.id);
  g.examples.filter((e) => e.sourceType === 'textbook').forEach((e) => ok(source.includes(e.hanzi), 'exact textbook grammar example: ' + e.hanzi));
  g.examples.forEach((e) => ok(e.hanzi && e.pinyin && e.english, 'trilingual grammar example: ' + g.id));
  const note = lesson.grammarTeachingNotes[g.id];
  ok(note.presentationMode === 'progressive_grammar' && note.mergeNoticeObserve === true, 'progressive grammar mode: ' + g.id);
  same(note.observeHighlights.length, 5, 'highlight/example alignment: ' + g.id);
  same(note.examples.length, 5, 'teaching-note example alignment: ' + g.id);
  ok(note.visualLearning.blocks.length >= 2 && note.oralQuestions.length >= 3, 'visual and oral support: ' + g.id);
  ok(note.structureVariants.length >= 2, 'grammar variants: ' + g.id);
  ok(note.followUp.length === 1 && note.followUp[0].image && note.followUp[0].sampleAnswer && note.followUp[0].samplePinyin, 'image follow-up: ' + g.id);
});

same(lesson.texts.map((t) => t.id), ['t_hsk3_l16_01','t_hsk3_l16_02','t_hsk3_l16_03','t_hsk3_l16_04'], 'four text IDs');
same(lesson.texts.map((t) => t.lines.length), [8,9,7,1], 'complete text units 8/9/7/1');
same(lesson.texts.map((t) => t.audio), ['../../audio/HSK3/16-1.mp3','../../audio/HSK3/16-3.mp3','../../audio/HSK3/16-5.mp3','../../audio/HSK3/16-7.mp3'], 'audio mapping 1/3/5/7');
same(lesson.texts.map((t) => t.audioStatus), ['available','available','available','available'], 'all text audio available');
lesson.texts.forEach((text, index) => {
  text.lines.forEach((line) => {
    ok(source.includes(line.hanzi), 'exact textbook Chinese: ' + text.id);
    ok(source.includes(line.pinyin), 'exact textbook pinyin: ' + text.id);
    if (index < 3) {
      ok(line.englishSourceType === 'textbook', 'textbook English marker: ' + text.id);
      ok(source.includes(line.english), 'exact textbook English: ' + text.id);
    }
  });
});
ok(lesson.texts[3].format === 'diary' && lesson.texts[3].genre === '日记' && lesson.texts[3].author === '王一雪', 'text 4 uses diary layout');
ok(lesson.texts[3].lines[0].englishSourceType === 'teaching_extension', 'text 4 English is clearly an extension');
ok(lesson.texts[1].cultureNote && source.includes(lesson.texts[1].cultureNote), 'textbook cultural note preserved');

const audioFiles = ['16-1.mp3','16-3.mp3','16-5.mp3','16-7.mp3'];
audioFiles.forEach((name) => {
  const file = path.join(root, 'audio/HSK3', name);
  ok(fs.existsSync(file), 'audio exists: ' + name);
  ok(fs.statSync(file).size > 1000, 'audio non-empty: ' + name);
});

const sceneSteps = Object.values(lesson.vocabScenes).flatMap((group) => group.steps);
same(sceneSteps.length, 8, 'eight vocabulary scenes');
unique(sceneSteps.map((s) => s.id), 'unique scene IDs');
sceneSteps.forEach((step) => {
  const file = path.join(root, 'source/in-class', step.image);
  ok(fs.existsSync(file), 'scene image exists: ' + step.image);
  const buffer = fs.readFileSync(file);
  ok(buffer.slice(1,4).toString('ascii') === 'PNG', 'PNG format: ' + step.image);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  ok(width >= 1600 && height >= 900, 'projection resolution: ' + step.image);
  ok(Math.abs(width / height - 16 / 9) < 0.03, '16:9 aspect ratio: ' + step.image);
  ok(step.prompt && step.talkHint && step.sampleAnswers.length >= 2, 'specific scene teaching fields: ' + step.id);
  ok(step.labels.length >= 3 && step.labels.every((label) => label.text && label.x >= 0 && label.x <= 100 && label.y >= 0 && label.y <= 100), 'safe hotspots: ' + step.id);
});

const bannedOverviewWords = ['谈','顺序','特点','交际目的','发展','状态','哪类'];
const allOverview = [];
const approvedEndpoints = [
  '如果你想领养一只动物，你想领养什么？为什么？',
  '介绍一下你眼中的大熊猫。',
  '介绍一下熊猫的习惯。',
  '给第一次来北京旅游的家人朋友一些建议。'
];
lesson.texts.forEach((text, index) => {
  const note = lesson.textTeachingNotes[text.id];
  same(note.studentVisibleStages, ['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'], 'five text stages: ' + text.id);
  same(note.audioStatus, 'available', 'teaching-note audio status: ' + text.id);
  same(note.overallChoices.length, 3, 'three overview questions: ' + text.id);
  same(note.details.length, 5, 'five detail questions: ' + text.id);
  unique(note.overallChoices.map((q) => q.id), 'unique overview IDs: ' + text.id);
  unique(note.details.map((q) => q.id), 'unique detail IDs: ' + text.id);
  note.overallChoices.forEach((q) => {
    ok(q.options.length === 3 && q.answer === q.options[q.correctIndex], 'overview answer contract: ' + q.id);
    ok(!bannedOverviewWords.some((word) => q.question.includes(word)), 'easy overview wording: ' + q.id);
    allOverview.push(q);
  });
  note.details.forEach((q) => ok(q.question && q.answer && q.informationPoint, 'complete detail question: ' + q.id));
  ok(note.preReadingQuestions.length === 2 && note.keyPoints.length >= 4, 'pre-reading and key points: ' + text.id);
  ok(note.cultureDiscussion.questions.length >= 2 && note.cultureDiscussion.wordCards.length >= 4 && note.cultureDiscussion.sampleAnswers.length >= 2, 'culture/application support: ' + text.id);
  ok(note.retellScaffold.nodes.length === 5 && note.retellScaffold.frame, 'five-node retell: ' + text.id);
  same(note.languageAndApplication.personalPrompt, approvedEndpoints[index], 'approved endpoint: ' + text.id);
});
same(countBy(allOverview, (q) => ['A','B','C'][q.correctIndex]), {B:4,A:4,C:4}, '12 overview answers balanced A/B/C exactly 4 each');
ok(maxRun(allOverview.map((q) => q.correctIndex)) <= 2, 'overview answer position never repeats more than twice');

same(lesson.previewMissions.length, 3, 'three preview missions');
lesson.previewMissions.forEach((mission) => {
  same(mission.stages.map((s) => s.order), [1,2,3,4,5], 'five preview stages: ' + mission.id);
  same(mission.stages.map((s) => s.interactionType), ['study_list','practice_quiz','timed_match','practice_quiz','ranked_quiz'], 'preview interaction progression: ' + mission.id);
  ok(mission.stages[0].keywordCards.length >= 8 && mission.stages[0].photos.length === 1, 'preview study materials: ' + mission.id);
  ok(mission.stages[1].recognitionWordIds.length <= 4, 'preview recognition cap: ' + mission.id);
  same(mission.stages[2].pairs.length, 6, 'six preview match pairs: ' + mission.id);
  same(mission.stages[3].questions.length, 5, 'five preview context questions: ' + mission.id);
  same(mission.stages[4].questions.length, 10, 'ten scored preview questions: ' + mission.id);
  const finalPositions = mission.stages[4].questions.map((q) => q.correctIndex);
  same(countBy(finalPositions, (x) => x), {'0':3,'1':3,'2':2,'3':2}, 'preview answer positions balanced: ' + mission.id);
  ok(maxRun(finalPositions) <= 2, 'preview answer position run: ' + mission.id);
  mission.stages.slice(1).flatMap((s) => s.questions || []).forEach((q) => {
    ok(q.options.length === 4 && q.answer === q.options[q.correctIndex], 'preview question answer contract: ' + q.id);
  });
  same(mission.reportFields, ['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'], 'preview report fields: ' + mission.id);
  ok(mission.persistenceKeyPattern.includes('ClassProPreview_HSK3-L16_') && mission.persistenceKeyPattern.includes('{contentVersion}'), 'versioned preview key: ' + mission.id);
});

const groups = lesson.inClass.questionGroups;
same(groups.v5_vocab_fill.length, 3, 'three vocab-fill groups');
groups.v5_vocab_fill.forEach((group) => same(group.data.sentences.length, 5, 'five fill items: ' + group.id));
same(groups.v7_word_match.length, 3, 'three word-match groups');
groups.v7_word_match.forEach((group) => {
  same(group.data.pairs.length, 5, 'five full Q/A pairs: ' + group.id);
  ok(group.data.neutralBeforeSubmit && group.data.allowUndo && group.data.submitAll, 'neutral matching behavior: ' + group.id);
});
const expectedGroupSizes = {
  g1_ordering:5,scene_sentence_choice:10,v6_description_guess:10,v2_say_guess:8,
  v3_blind_box:4,g2_picture_complete:8,r2_passage_choice:5,r3_independent_reading:5,
  r4_paragraph_fill:5,t3_chain_sentence:5,t2_task_card:5,pk_question:3,
  info_match:2,textQa:4,pictureTalk:8
};
Object.entries(expectedGroupSizes).forEach(([name, size]) => same(groups[name].length, size, name + ' count'));
const sayGuessTargets = groups.v2_say_guess.map((item) => item.data.target);
same(sayGuessTargets, ['又脏又小','可爱小猫','小猫脚边','照顾小猫','爱吃竹子','中国国宝','张着嘴','看不清脸'], 'say-and-guess uses approved short phrases');
groups.v2_say_guess.forEach((item) => {
  const hanziLength = item.data.target.replace(/[^\u3400-\u9fff]/g, '').length;
  ok(hanziLength >= 3 && hanziLength <= 5, 'say-and-guess phrase length 3-5: ' + item.id);
  ok(item.data.pinyin && item.data.task && item.data.scaffold.words.length === 3, 'complete say-and-guess support: ' + item.id);
});
groups.g2_picture_complete.forEach((item) => {
  ok(item.data.keywords.length >= 3, 'picture sentence has prompt words: ' + item.id);
  ok(item.data.structure && item.data.task && item.data.sample && item.data.grammarId, 'picture sentence has structure, task, sample, and grammar route: ' + item.id);
});
groups.r2_passage_choice.forEach((item) => same(item.data.questions.length, 3, 'three questions per passage: ' + item.id));
groups.r3_independent_reading.forEach((item) => ok(item.data.passage.split(/[。！？]/).filter(Boolean).length >= 4, 'independent reading has 4+ sentences: ' + item.id));
groups.t3_chain_sentence.forEach((item) => same(item.data.keywords.length, 5, 'five chain keywords: ' + item.id));
same(groups.t2_task_card.slice(0,4).map((item) => item.data.output), approvedEndpoints, 'task cards align with approved endpoints');
same(groups.t2_task_card.slice(0,4).map((item) => item.data.minimum), ['一种动物＋一个理由','2—3句话','两个熊猫习惯','两条实用建议'], 'task-card minimum standards');

const objectiveBanks = [
  ['scene_sentence_choice',groups.scene_sentence_choice.map((x) => x.data.correct_index)],
  ['v6_description_guess',groups.v6_description_guess.map((x) => x.data.correct_index)]
];
objectiveBanks.forEach(([name, positions]) => {
  same(countBy(positions, (x) => x), {'0':4,'1':3,'2':3}, name + ' answer balance 4/3/3');
  ok(maxRun(positions) <= 2, name + ' no answer-position run over two');
});
const passagePositions = groups.r2_passage_choice.flatMap((item) => item.data.questions.map((q) => q.correct_index));
same(countBy(passagePositions, (x) => x), {'0':5,'1':5,'2':5}, 'passage questions balanced A/B/C');
ok(maxRun(passagePositions) <= 2, 'passage answer run');
same(groups.pk_question.map((x) => x.data.correct_index), [0,1,2], 'PK A/B/C balance');

const applicable = Object.entries(groups)
  .filter(([name]) => name !== 'battleGames')
  .flatMap(([, items]) => Array.isArray(items) ? items : [])
  .filter((item) => item.contentRole);
const roles = countBy(applicable, (item) => item.contentRole);
const totalRoles = applicable.length;
const ratios = {
  lesson:roles.lesson / totalRoles,
  transfer:roles.transfer / totalRoles,
  review:roles.review / totalRoles
};
ok(ratios.lesson >= 0.45 && ratios.lesson <= 0.55, 'lesson role ratio near 50%: ' + JSON.stringify(ratios));
ok(ratios.transfer >= 0.25 && ratios.transfer <= 0.35, 'transfer role ratio near 30%: ' + JSON.stringify(ratios));
ok(ratios.review >= 0.15 && ratios.review <= 0.25, 'review role ratio near 20%: ' + JSON.stringify(ratios));

same(groups.battleGames.roulette.length, 8, 'eight roulette challenges');
same(groups.battleGames.relay.length, 5, 'five relay starters');
same(groups.battleGames.monopoly.tasks.length, 16, '16 monopoly tasks');
same(groups.battleGames.studentRosterSource, 'source/shared/students.js', 'shared HSK3 roster source');

same(lesson.inClass.sessionTests.map((t) => t.id), ['l16_test_a','l16_test_b','l16_test_c'], 'Test A/B/C IDs');
same(lesson.inClass.sessionTests.map((t) => t.audio.length), [1,1,2], 'Test A/B/C audio coverage');
lesson.inClass.sessionTests.forEach((test) => {
  ok(test.audioRequired && test.sections.map((s) => s.type).join('|') === 'listening|vocabulary|grammar|speaking', 'complete test sections: ' + test.id);
});

const hw = lesson.postClassHomework;
ok(hw.wrongPointsDefaultCollapsed === true, 'homework weak points collapsed by default');
same(Object.keys(hw.sessions), ['A','B','C'], 'homework A/B/C');
const hwA = hw.sessions.A[0];
const hwB = hw.sessions.B[0];
const hwC = hw.sessions.C[0];
same([hwA.id,hwB.id,hwC.id], ['post_l16_a_animal_choice_card','post_l16_b_panda_in_my_eyes','post_l16_c_panda_beijing_tips'], 'approved homework IDs');
same(hwA.carryTo, ['B','C'], 'Homework A feeds B/C');
ok(hwB.carryFrom[0].taskId === hwA.id && hwB.carryTo[0] === 'C', 'Homework B reuses A and feeds C');
same(hwC.carryFrom.map((x) => x.taskId), [hwA.id,hwB.id], 'Homework C carries A/B');
ok(hwC.noAudioUpload === true && /No audio upload is required/.test(hwC.prompt_en), 'no audio upload requirement');
same([hwA.minimum,hwB.minimum,hwC.minimum], ['一种动物＋一个理由','2—3句话','两个熊猫习惯＋两条实用建议'], 'homework minimum standards');

same(lesson.usePreparation.formalResourcePlan.length, 4, 'four formal mini plans');
same(lesson.usePreparation.formalResourcePlan.map((m) => m.exit), approvedEndpoints, 'MINI exits align with approved endpoints');
same(lesson.usePreparation.formalResourcePlan.map((m) => m.id), ['mini_l16_t1_pet_adoption','mini_l16_t2_panda_questions','mini_l16_t3_panda_observation','mini_l16_t4_zoo_advice'], 'stable MINI IDs');
same(lesson.usePreparation.formalResourcePlan[1].entry, '关于大熊猫，你想知道什么？（问3个问题）', 'T2 MINI asks three panda questions at entry');
lesson.usePreparation.formalResourcePlan.forEach((mini) => {
  ['id','title','goal','goalEn','entry','exit','exitRequirements','supportCards','responseMode','textId','linkedResources','resourceLinks'].forEach((field) => ok(mini[field], 'MINI field ' + field + ': ' + mini.id));
});
same(lesson.usePreparation.stateContract.evidenceTypes, ['entry_expression','actual_learning_path','exit_expression'], 'only three core evidence types');

const allIds = [];
const collectCanonicalIds = (value) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.id === 'string') allIds.push(value.id);
  if (Array.isArray(value)) value.forEach(collectCanonicalIds);
  else Object.entries(value).forEach(([key, item]) => {
    if (!['overallChoice','classQuestions'].includes(key)) collectCanonicalIds(item);
  });
};
collectCanonicalIds(lesson);
unique(allIds, 'all embedded object IDs are unique');
ok(!/(正确答案|干扰项A|L16短文\d|完成口语任务\d|请根据图片使用目标词介绍场景)/.test(serialized), 'no placeholder content');
ok(lesson.meta.titleEn !== 'I heard that some pandas went abroad', 'old English course title removed while textbook dialogue stays exact');

const sharedDiff = run('git', ['diff','--name-only','--','source/shared','source/in-class/lesson-data-loader.js','source/in-class/teacher.html','source/in-class/student.html','source/in-class/l08-use-pilot.js','source/in-class/l08-use-pilot.html','source/pre-class'], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
same(sharedDiff, ['source/in-class/teacher.html'], 'only the generic picture-sentence renderer is changed in shared classroom runtime');
const teacherRuntime = fs.readFileSync(path.join(root, 'source/in-class/teacher.html'), 'utf8');
ok(teacherRuntime.includes("var keywords=d.keywords||") && teacherRuntime.includes("structure=d.structure||d.targetStructure||"), 'shared picture-sentence renderer consumes keywords and structure');

console.log('HSK3-L16 validation passed: ' + checks + ' checks.');
