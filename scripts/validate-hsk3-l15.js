const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const lessonPath = path.join(root, 'source/data-model/lessons/HSK3-L15.json');
const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
const source = fs.readFileSync(path.join(root, 'textbook data/HSK3/L15.txt'), 'utf8');
const serialized = JSON.stringify(lesson);

let checks = 0;
const ok = (value, message) => {
  if (!value) throw new Error(message);
  checks += 1;
};
const unique = (items, message) => ok(new Set(items).size === items.length, message);

ok(lesson.schemaVersion === '1.0.0', 'schema version');
ok(lesson.meta.lessonKey === 'HSK3-L15' && lesson.meta.title === '我是半个南京人', 'lesson identity');
ok(lesson.meta.sourceAuthority.length === 1, 'single textbook authority');
ok(lesson.meta.missingResources.audio.length === 4, 'missing audio is declared');
ok(lesson.sessions.map((item) => item.id).join('') === 'ABC', 'three-session plan');
ok(lesson.sessions[2].textIds.length === 2, 'C contains texts 3 and 4');

const textbookWords = ['蓝','段','附近','马路','平时','放学','游戏','老人','根据','了解','可是','以上','有名','景点','游客','外地','聊','河','关系','养','西北','经过','草地','遇见','南京','黄河'];
ok(lesson.vocabulary.length === 26, '26 vocabulary items');
ok(lesson.vocabulary.map((item) => item.hanzi).join('|') === textbookWords.join('|'), 'textbook vocabulary order');
unique(lesson.vocabulary.map((item) => item.id), 'unique vocabulary ids');
unique(lesson.vocabulary.map((item) => item.hanzi), 'unique vocabulary words');
ok(JSON.stringify(lesson.vocabulary.reduce((result, item) => {
  result[item.tier] = (result[item.tier] || 0) + 1;
  return result;
}, {})) === JSON.stringify({ context: 1, understanding: 7, expression: 18 }), 'vocabulary tiers 1/7/18');

lesson.vocabulary.forEach((item) => {
  ok(source.includes(item.hanzi), `source vocabulary: ${item.hanzi}`);
  ok(item.pinyin && item.english && item.meaningCn, `complete vocabulary fields: ${item.hanzi}`);
  ok(item.phrases.length === 2 && !item.phrases.some((phrase) => /相关表达|使用./.test(phrase)), `natural collocations: ${item.hanzi}`);
  ok(item.example && !item.example.startsWith('**') && item.examplePinyin, `bilingual example: ${item.hanzi}`);
});

ok(lesson.grammar.length === 4, 'four grammar points');
unique(lesson.grammar.map((item) => item.id), 'unique grammar ids');
lesson.grammar.forEach((item) => {
  ok(item.examples.length === 5, `five examples: ${item.id}`);
  ok(item.examples.filter((example) => example.sourceType === 'textbook').length === 3, `three textbook examples: ${item.id}`);
  ok(item.examples.filter((example) => example.sourceType === 'teaching_extension').length === 2, `two extension examples: ${item.id}`);
  item.examples.forEach((example) => ok(example.hanzi && example.pinyin && example.english && !example.hanzi.includes('**说明**'), 'audited bilingual grammar example'));
  const note = lesson.grammarTeachingNotes[item.id];
  ok(note.presentationMode === 'progressive_grammar' && note.mergeNoticeObserve, `four-step grammar mode: ${item.id}`);
  ok(note.observeHighlights.length === 5 && note.examples.length === 5, `highlight/example alignment: ${item.id}`);
  ok(note.visualLearning.blocks.length >= 2 && note.oralQuestions.length >= 3, `visual and oral support: ${item.id}`);
  ok(note.followUp.length === 1 && note.followUp[0].image && note.followUp[0].sampleAnswer, `image follow-up: ${item.id}`);
});
ok(lesson.grammar[2].examples[0].hanzi.includes('中国看人看来'), 'preserve textbook grammar typo');
ok(lesson.grammar[2].editorialNote && lesson.meta.editorialAudit.length === 1, 'editorial note present');

ok(lesson.texts.length === 4, 'four texts');
ok(lesson.texts.map((item) => item.lines.length).join(',') === '7,7,7,1', 'complete textbook lines 7/7/7/1');
let textLineCount = 0;
lesson.texts.forEach((text) => {
  text.lines.forEach((line) => {
    textLineCount += 1;
    ok(source.includes(line.hanzi) && source.includes(line.pinyin), 'exact textbook Chinese and pinyin');
    if (line.english) ok(source.includes(line.english), 'exact textbook English');
  });
  const note = lesson.textTeachingNotes[text.id];
  ok(note.studentVisibleStages.length === 5, `exactly five text stages: ${text.id}`);
  ok(note.overallChoices.length === 3 && note.details.length === 5, `3 overview + 5 details: ${text.id}`);
  unique(note.overallChoices.map((item) => item.id), `unique overview ids: ${text.id}`);
  unique(note.details.map((item) => item.id), `unique detail ids: ${text.id}`);
  ok(note.keyPoints.length >= 3 && note.keyPoints.every((item) => item.hanzi && item.note), `language key points: ${text.id}`);
  ok(note.cultureDiscussion.questions.length >= 3 && note.cultureDiscussion.wordCards.length >= 3 && note.cultureDiscussion.sampleAnswers.length >= 2, `culture/application content: ${text.id}`);
  ok(note.retellScaffold.nodes.length >= 5 && note.retellScaffold.frame && note.languageAndApplication.personalPrompt && note.languageAndApplication.paragraphPracticeId, `retell/application bridge: ${text.id}`);
});
ok(textLineCount === 22, '22 textbook text units');

ok(Object.keys(lesson.vocabScenes).length === 4, 'four vocabulary scene groups');
const sceneSteps = Object.values(lesson.vocabScenes).flatMap((group) => group.steps);
ok(sceneSteps.length === 8, 'eight vocabulary scenes');
sceneSteps.forEach((step) => {
  ok(step.words.length >= 3 && step.labels.length >= 3, `usable scene: ${step.id}`);
  ok(step.prompt && !/请根据图片使用目标词介绍场景/.test(step.prompt) && step.talkHint && step.sampleAnswers.length >= 2, `specific scene question: ${step.id}`);
  ok(fs.existsSync(path.join(root, 'source/in-class', step.image)), `scene image exists: ${step.image}`);
});

ok(lesson.previewMissions.length === 3, 'three preview missions');
lesson.previewMissions.forEach((mission) => {
  ok(mission.stages.length === 5, `five preview stages: ${mission.id}`);
  ok(mission.stages.map((stage) => stage.order).join(',') === '1,2,3,4,5', `preview order: ${mission.id}`);
  ok(mission.pilotMode === 'ranked_vocab_preview_v1', `ranked preview contract: ${mission.id}`);
  ok(mission.stages[0].keywordCards.length >= 8, `preview study cards: ${mission.id}`);
  ok(mission.stages[0].keywordCards.every((card) => card.hanzi && card.pinyin && card.english && card.example), `complete preview cards: ${mission.id}`);
  ok(mission.stages[0].photos.every((photo) => photo.src && fs.existsSync(path.join(root, 'source/pre-class', photo.src))), `preview photos exist: ${mission.id}`);
  ok(mission.stages[1].questions.length <= 4, `recognition limit: ${mission.id}`);
  ok(mission.stages[2].pairs.length >= 5 && mission.stages[2].pairs.every((pair) => pair.word && pair.meaning), `preview match contract: ${mission.id}`);
  ok(mission.stages[3].questions.length >= 5, `preview context practice: ${mission.id}`);
  ok(mission.stages[4].questions.length === 10, `ten final questions: ${mission.id}`);
  ok(mission.stages.slice(1).flatMap((stage) => stage.questions || []).every((item) => item.options.length >= 4 && item.options.includes(item.answer)), `preview answer contracts: ${mission.id}`);
  unique(mission.stages.flatMap((stage) => stage.questions || []).map((item) => item.id), `unique preview question ids: ${mission.id}`);
});

const groups = lesson.inClass.questionGroups;
const minimums = { v5_vocab_fill:3, v7_word_match:3, g1_ordering:5, scene_sentence_choice:10, v6_description_guess:10, v2_say_guess:8, v3_blind_box:4, g2_picture_complete:8, r2_passage_choice:5, r3_independent_reading:5, r4_paragraph_fill:5, t3_chain_sentence:5, t2_task_card:5, pk_question:3, info_match:2, textQa:4, pictureTalk:8 };
Object.entries(minimums).forEach(([key, minimum]) => ok(groups[key]?.length >= minimum, `${key} minimum ${minimum}`));
ok(groups.v5_vocab_fill.reduce((sum, item) => sum + item.data.sentences.length, 0) === 15, '15 vocabulary fill sentences');
ok(groups.v7_word_match.every((item) => item.data.pairs.length === 5 && item.data.interaction === 'free_pair_then_submit' && item.data.pairs.every((pair) => /[？?]$/.test(pair.left) && pair.right.length >= 2)), 'three complete question-answer matching groups');
ok(groups.v2_say_guess.every((item) => item.data.target.length <= 2 && item.data.pinyin), 'say-and-guess uses complete short word cards');
ok(groups.r2_passage_choice.every((item) => item.data.questions.length === 3), 'five readings with three questions each');
ok(groups.r3_independent_reading.every((item) => item.data.title && item.data.passage.length >= 25 && item.data.question_cn && item.data.options.length === 3), 'independent reading includes five complete passages');
ok(groups.g1_ordering.every((item) => item.data.chunks.length >= 4), 'real sentence-order chunks');
ok(groups.t2_task_card.every((item) => item.data.role && item.data.keywords.length >= 3 && item.data.steps.length >= 3 && item.data.output), 'complete task cards');
const endpointPrompts = ['介绍附近的生活设施、交通特点，并说明这里适合什么人居住。','先问问游客的兴趣，再推荐两个地方，并分别说明为什么推荐。','请介绍一下你了解的“黄河”。','讲一个你最喜欢的地方，说明为什么喜欢，并讲一个你和这个地方的故事。'];
ok(groups.t2_task_card.slice(0,4).map((item) => item.data.output).join('|') === endpointPrompts.join('|'), 'four approved endpoint tasks');
ok(groups.battleGames.roulette.length === 8 && groups.battleGames.relay.length === 4 && groups.battleGames.monopoly.tasks.length === 16, 'complete competition games');
ok(groups.battleGames.roulette.every((item) => item.challenge && item.scene && item.prompt && item.keywords.length >= 3 && item.sample), 'roulette has eight visible tasks');
ok(!/正确答案|干扰项|L15短文|真实语境。|请联系本课主题|L15棋盘任务|完成L15口语任务|独立阅读理解题/.test(serialized), 'no placeholder exercise content');

const roleItems = Object.values(groups).flatMap((value) => Array.isArray(value) ? value : []).filter((item) => item?.contentRole);
const roleCounts = roleItems.reduce((result, item) => {
  result[item.contentRole] = (result[item.contentRole] || 0) + 1;
  return result;
}, {});
const percentage = (name) => roleCounts[name] * 100 / roleItems.length;
ok(Math.abs(percentage('lesson') - 50) < 2, 'lesson ratio near 50%');
ok(Math.abs(percentage('transfer') - 30) < 2, 'transfer ratio near 30%');
ok(Math.abs(percentage('review') - 20) < 2, 'review ratio near 20%');

const allIds = [];
const collectIds = (value) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.id === 'string') allIds.push(value.id);
  Object.values(value).forEach(collectIds);
};
collectIds(lesson.inClass);
unique(allIds, 'unique in-class ids');

ok(lesson.inClass.sessionTests.length === 3, 'three session tests');
ok(lesson.postClassHomework.sessions.A.length && lesson.postClassHomework.sessions.B.length && lesson.postClassHomework.sessions.C.length, 'A/B/C homework');
ok(lesson.postClassHomework.sessions.B[0].carryFrom.some((item) => item.session === 'A'), 'B uses A homework');
ok(lesson.postClassHomework.sessions.C[0].carryFrom.map((item) => item.session).join('') === 'AB', 'C uses A and B homework');
ok(lesson.postClassHomework.sessions.C[0].requiredStructures.length === 4, 'C integrates four grammar structures');
ok(lesson.usePreparation.status === 'active_shared_profile' && lesson.usePreparation.configurationCreated, 'active use profile');
ok(lesson.usePreparation.formalResourcePlan.length === 4, 'four MINI resource plans');

console.log(`HSK3-L15 formal validation passed: ${checks} checks.`);
