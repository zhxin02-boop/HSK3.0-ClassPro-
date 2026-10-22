const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');
const crypto = require('crypto');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const builderPath = path.join(__dirname, 'build-hsk3-l12.js');
const jsonPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L12.json');
const referencePath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L08.json');
const sourcePath = path.join(root, 'textbook data', 'HSK3', 'L12.txt');

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

execFileSync(process.execPath, [builderPath], {stdio:'pipe'});
const firstHash = sha256(jsonPath);
execFileSync(process.execPath, [builderPath], {stdio:'pipe'});
const secondHash = sha256(jsonPath);
assert.equal(firstHash, secondHash, 'Two builder runs produced different JSON hashes.');

const lesson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const referenceLesson = JSON.parse(fs.readFileSync(referencePath, 'utf8'));

function collectIds(value, at = '$', seen = new Map()) {
  if (!value || typeof value !== 'object') return seen;
  if (value.id !== undefined) {
    const id = String(value.id);
    assert(!seen.has(id), `Duplicate id ${id}: ${seen.get(id)} and ${at}`);
    seen.set(id, at);
  }
  Object.entries(value).forEach(([key, child]) => collectIds(child, `${at}.${key}`, seen));
  return seen;
}

function labeledBlocks(label, stopPrefixes) {
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith(label)) continue;
    const block = [];
    const sameLine = lines[index].slice(label.length).trim();
    if (sameLine) block.push(sameLine);
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const line = lines[cursor].trim();
      if (stopPrefixes.some(prefix => line.startsWith(prefix))) break;
      if (line && !line.startsWith('*(')) block.push(line);
    }
    blocks.push(block);
  }
  return blocks;
}

function functionSource(html, name) {
  const start = html.indexOf(`function ${name}(`);
  assert(start >= 0, `Missing student function: ${name}`);
  const open = html.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = open; index < html.length; index += 1) {
    const char = html[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}' && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`Unclosed student function: ${name}`);
}

function testStudentMatching(pairs) {
  const html = fs.readFileSync(path.join(root, 'source', 'in-class', 'student.html'), 'utf8');
  const context = {console, document:{getElementById:() => ({innerHTML:''})}};
  vm.createContext(context);
  vm.runInContext(`
    var RM='test-room', LESSON='HSK3-L12';
    var matchLeft=null, matchRight=null, matchPairs={}, submittedPayload=null;
    var current={question:{id:'l12-match-test'},mode:'v7'};
    var nameReady=true;
    function saveDraft(){}
    function render(){}
    function qdata(){return {pairs:${JSON.stringify(pairs)}}}
    function confirmName(){}
    function name(){return '测试学生'}
    function sendAnswer(payload){submittedPayload=payload}
    ${functionSource(html,'matchRightUsed')}
    ${functionSource(html,'pickMatch')}
    ${functionSource(html,'submitMatching')}
  `, context);
  const submit = mapping => {
    context.matchLeft = null;
    context.matchRight = null;
    context.matchPairs = {};
    context.submittedPayload = null;
    mapping.forEach((right,left) => { context.pickMatch('L',left); context.pickMatch('R',right); });
    context.submitMatching();
    return context.submittedPayload;
  };
  const mixed = submit([1,0,2,3,4]);
  assert.equal(mixed.score, 3);
  assert.equal(mixed.total, 5);
  assert.equal(mixed.itemResults.filter(item => item.result === 'wrong').length, 2);
  const correct = submit([0,1,2,3,4]);
  assert.equal(correct.score, 5);
  assert.equal(correct.total, 5);
  return {mixed:{score:mixed.score,total:mixed.total,wrong:2},correct:{score:correct.score,total:correct.total}};
}

function compileInlineScripts(file) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/\bsrc\s*=/.test(match[1]) && !/type\s*=\s*["'](?!text\/javascript|application\/javascript)/i.test(match[1]));
  scripts.forEach((match,index) => new vm.Script(match[2], {filename:`${path.basename(file)}#inline-${index + 1}`}));
  return scripts.length;
}

function pngSize(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.toString('ascii',1,4), 'PNG', `${file} is not a PNG.`);
  return {width:data.readUInt32BE(16),height:data.readUInt32BE(20)};
}

function assertCaseExact(file) {
  const relative = path.relative(root, file);
  let current = root;
  for (const part of relative.split(path.sep)) {
    const names = fs.readdirSync(current);
    assert(names.includes(part), `Case mismatch in resource path: ${relative}`);
    current = path.join(current, part);
  }
}

assert.equal(lesson.meta.lessonKey, 'HSK3-L12');
assert.equal(lesson.vocabulary.length, 27, 'Expected 27 textbook words.');
assert(lesson.vocabulary.every(item => item.sourceType === 'textbook'));
assert.equal(lesson.grammar.length, 4);
assert(lesson.grammar.every(item => item.examples.length === 5), 'Every grammar point needs exactly five observation examples.');
assert.equal(lesson.texts.length, 4);
assert.equal(lesson.texts[3].format, 'diary', 'Text 4 must use the diary layout.');
assert.equal(lesson.texts[3].genre, '日记');
assert.equal(lesson.texts[3].author, '王一飞');

lesson.grammar.forEach(item => {
  const note = lesson.grammarTeachingNotes[item.id];
  assert.equal(note.observeMode, 'structure_rows', `${item.id} must use one-sentence-per-row observation.`);
  assert.equal(note.observeHighlights.length, 5, `${item.id} needs highlights for five observation examples.`);
  assert.equal(note.mergeNoticeObserve, true, `${item.id} should merge context and observation.`);
  assert(note.oralQuestions.length >= 3 && note.oralQuestions.length <= 5, `${item.id} needs 3-5 oral questions.`);
  assert(note.followUp.length >= 1, `${item.id} needs a transfer exercise.`);
});

const sourceHanzi = labeledBlocks('**中文**：', ['**拼音**：']).flat();
const sourcePinyin = labeledBlocks('**拼音**：', ['**英文**：','---','####']).flat();
const formalLines = lesson.texts.flatMap(text => text.lines);
assert.deepEqual(formalLines.map(line => line.hanzi), sourceHanzi, 'Formal Chinese differs from the textbook.');
assert.deepEqual(formalLines.map(line => line.pinyin), sourcePinyin, 'Formal pinyin differs from the textbook.');
assert.equal(lesson.meta.textbookIssues.length, 3);
assert(lesson.texts[2].lines[5].pinyin.includes('jīntiān'));
assert(lesson.texts[2].lines[6].pinyin.includes('jīntián dōngtiān'));
assert(!JSON.stringify(lesson.grammar).includes('不大多小'));

assert.deepEqual(lesson.sessions.map(item => item.textIds), [
  ['t_hsk3_l12_01'],
  ['t_hsk3_l12_02'],
  ['t_hsk3_l12_03','t_hsk3_l12_04']
]);
assert.deepEqual(lesson.sessions.map(item => item.previewMissionId), ['pm_hsk3_l12_a','pm_hsk3_l12_b','pm_hsk3_l12_c']);

assert.equal(lesson.previewMissions.length, 3);
lesson.previewMissions.forEach((mission,index) => {
  assert.equal(mission.session, ['A','B','C'][index]);
  assert.equal(mission.stages.length, 5, `${mission.session} must have exactly five preview stages.`);
  assert.equal(mission.stages[4].questions.length, 10, `${mission.session} must have a ten-question challenge.`);
  assert(mission.persistenceKeyPattern.includes('HSK3-L12'));
  assert(mission.persistenceKeyPattern.includes(`_${mission.session}_`));
  assert(mission.persistenceKeyPattern.includes('{student}'));
  assert(mission.persistenceKeyPattern.includes('_v1'));
  assert.deepEqual(mission.reportFields, ['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt']);
});
assert.deepEqual(lesson.preClass.progressIsolation.keyFields, ['lesson','session','student','contentVersion']);
assert.equal(lesson.preClass.progressIsolation.contentVersion, 'HSK3-L12-v1');

const sceneImages = [];
for (const [textNo,scene] of Object.entries(lesson.vocabScenes)) {
  assert.equal(scene.steps.length, 2, `Text ${textNo} must have two vocabulary scenes.`);
  scene.steps.forEach(step => {
    assert(step.labels.length >= 2 && step.labels.length <= 4, `${step.title} must have 2-4 hotspots.`);
    assert(step.words.length >= 2 && step.words.length <= 4, `${step.title} must render 2-4 hotspot cards.`);
    step.labels.forEach(label => {
      assert(label.x >= 0 && label.x <= 100 && label.y >= 0 && label.y <= 100);
      assert(label.targetX >= 0 && label.targetX <= 100 && label.targetY >= 0 && label.targetY <= 100);
    });
    assert(step.prompt && step.promptPinyin && step.promptEn, `${step.title} is missing a discussion layer.`);
    assert(step.sampleAnswers.length >= 2 && step.sampleAnswers.length <= 4, `${step.title} must have 2-4 sample answers.`);
    sceneImages.push(step.image);
  });
}
assert.equal(new Set(sceneImages).size, 8, 'Eight distinct scene images are required.');

const groups = lesson.inClass.questionGroups;
const referenceGroups = referenceLesson.inClass.questionGroups;
assert.deepEqual(Object.keys(groups).sort(), Object.keys(referenceGroups).sort(), 'L12 practice types must match L8.');
Object.keys(referenceGroups).forEach(key => {
  if (Array.isArray(referenceGroups[key])) assert.equal(groups[key].length, referenceGroups[key].length, `${key} count must match L8.`);
});
assert.equal(groups.v5_vocab_fill.length, 3);
groups.v5_vocab_fill.forEach(group => {
  assert.equal(group.data.wordBank.length, 5);
  assert.equal(group.data.wordBank_pinyin.length, 5);
  assert.equal(group.data.sentences.length, 5);
});
assert.equal(groups.v7_word_match.length, 3);
groups.v7_word_match.forEach(group => {
  assert.equal(group.title, '问答匹配 / Question–Answer Match');
  assert.equal(group.type, 'question_answer_match');
  assert.equal(group.data.pairs.length, 5);
  assert.equal(group.data.neutralBeforeSubmit, true);
  assert.equal(group.data.allowUndo, true);
  assert.equal(group.data.submitAll, true);
  assert(group.data.pairs.every(pair => pair.left.endsWith('？') && pair.right.length >= 8));
});
assert.equal(groups.g1_ordering.length, 5);
assert.equal(groups.scene_sentence_choice.length, 10);
assert.equal(groups.v6_description_guess.length, 10);
assert.equal(groups.v2_say_guess.length, 8);
assert.equal(groups.v3_blind_box.length, 4);
groups.v3_blind_box.forEach(item => {
  assert.equal(item.data.words.length, 2);
  assert.equal(item.data.revealDecoration, 'none');
  assert.equal(item.data.uniformWordSize, true);
});
assert.equal(groups.g2_picture_complete.length, 8);
assert.equal(groups.r2_passage_choice.length, 5);
groups.r2_passage_choice.forEach(item => {
  assert(item.data.passage_pinyin, `${item.id} needs passage pinyin.`);
  assert.equal(item.data.questions.length, 3, `${item.id} needs three reading questions.`);
  item.data.questions.forEach(question => assert.equal(question.answer, question.options[question.correct_index]));
});
assert.equal(groups.r3_independent_reading.length, 5);
groups.r3_independent_reading.forEach(item => assert.equal(item.correct_answer, item.data.options[item.data.correct_index]));
assert.equal(groups.r4_paragraph_fill.length, 5);
const answerSignatures = new Set();
groups.r4_paragraph_fill.forEach(item => {
  assert.equal(item.type, 'paragraph_fill');
  assert.equal(item.data.options.length, 6);
  assert.equal(item.data.answers.length, 3);
  assert.equal(new Set(item.data.answers).size, 3);
  assert.deepEqual(item.data.slotColors, ['green','blue','orange']);
  assert.equal(item.data.optionDisplay, 'plain_continuous_hanzi');
  answerSignatures.add(item.data.answers.join(','));
});
assert(answerSignatures.size >= 4, 'Paragraph-fill answer positions need meaningful variation.');
assert.equal(groups.t3_chain_sentence.length, 5);
groups.t3_chain_sentence.forEach(item => {
  assert.equal(item.data.keywords.length, 5);
  assert.equal(item.data.keywords_pinyin.length, 5);
  assert.deepEqual(item.data.chainModes, ['teacher','race','team']);
});
assert.equal(groups.t2_task_card.length, 5);
assert.equal(groups.pk_question.length, 3);

const roleItems = [];
Object.values(groups).forEach(group => {
  if (Array.isArray(group)) group.forEach(item => { if (item.contentRole) roleItems.push(item); });
});
const roleCounts = roleItems.reduce((out,item) => {
  out[item.contentRole] = (out[item.contentRole] || 0) + 1;
  return out;
}, {});
assert.deepEqual(roleCounts, {lesson:34,transfer:25,review:17});
const rolePercent = Object.fromEntries(Object.entries(roleCounts).map(([key,value]) => [key,Math.round(value / roleItems.length * 100)]));

for (const session of ['A','B','C']) {
  const tasks = lesson.postClassHomework.sessions[session];
  assert.equal(tasks.length, 3, `Homework ${session} needs three tasks.`);
  const project = tasks.find(item => Array.isArray(item.scaffoldLevels));
  assert(project, `Homework ${session} is missing scaffold levels.`);
  assert.deepEqual(project.scaffoldLevels.map(item => item.label.split(' / ')[1]), ['Support','Core','Challenge']);
  const presentation = tasks.find(item => Array.isArray(item.presentationPlan));
  assert(presentation && presentation.presentationPlan.length >= 4, `Homework ${session} needs complete English instructions.`);
  assert(presentation.presentationPlan.some(line => /No audio upload/i.test(line)));
}
assert(lesson.postClassHomework.sessions.B.some(item => Array.isArray(item.carryFrom) && item.carryFrom.some(link => link.session === 'A')));
assert(lesson.postClassHomework.sessions.C.some(item => Array.isArray(item.carryFrom) && item.carryFrom.length === 2));
assert(lesson.postClassHomework.sessions.C.some(item => item.submissionRequired === false && item.classroomOnly === true));
assert.equal(lesson.postClassHomework.wrongPointsDefaultCollapsed, true);

const ids = collectIds(lesson);
const fileChecks = [
  ...sceneImages.map(image => path.join(root,'source','in-class',image)),
  ...lesson.texts.map(text => path.resolve(root,'source','in-class',text.audio)),
  path.join(root,'source','in-class','images','hsk3-characters','wang-yifei.svg'),
  path.join(root,'source','in-class','images','hsk3-characters','bai-jiayue.png')
];
fileChecks.forEach(file => {
  assert(fs.existsSync(file), `Missing resource: ${path.relative(root,file)}`);
  assertCaseExact(file);
});
const imageSizes = sceneImages.map(image => ({image,...pngSize(path.join(root,'source','in-class',image))}));
imageSizes.forEach(size => assert(size.width > size.height && size.width >= 1500, `${size.image} is not a suitable landscape image.`));

const curriculum = fs.readFileSync(path.join(root,'source','data-model','hsk3-curriculum.js'),'utf8');
assert(/HSK3-L12[^\n]+openForUse:\s*false[^\n]+status:\s*"preparing"/.test(curriculum), 'L12 must remain preparing until teacher approval.');
const studentSource = fs.readFileSync(path.join(root,'source','in-class','student.html'),'utf8');
const teacherSource = fs.readFileSync(path.join(root,'source','in-class','teacher.html'),'utf8');
assert(studentSource.includes('../shared/students.js'));
assert(teacherSource.includes('../shared/students.js'));
assert(teacherSource.includes("cur.format==='diary'"));
assert(teacherSource.includes('question:q'));
assert(teacherSource.includes('this.currentQuestionId=q.id'));
assert(teacherSource.includes('this.mq.publish("classpro/room/"+RM+"/question",JSON.stringify(payload))'));
assert(studentSource.includes('current.question.id'));

const staleScan = fs.readFileSync(builderPath,'utf8') + fs.readFileSync(jsonPath,'utf8');
assert(!/HSK3-L11|l11_|hsk3-l11/i.test(staleScan), 'Stale L11 identifier found in L12 files.');

const matching = testStudentMatching(groups.v7_word_match[0].data.pairs);
const inlineScripts = {};
[
  path.join(root,'source','pre-class','index.html'),
  path.join(root,'source','in-class','teacher.html'),
  path.join(root,'source','in-class','student.html'),
  path.join(root,'source','post-class','student-report.html')
].forEach(file => { inlineScripts[path.relative(root,file)] = compileInlineScripts(file); });

console.log(JSON.stringify({
  lesson:lesson.meta.lessonKey,
  hashes:{first:firstHash,second:secondHash,identical:firstHash === secondHash},
  ids:ids.size,
  roleCounts,
  rolePercent,
  images:imageSizes,
  audio:lesson.texts.map(text=>text.audio),
  matching,
  textbookIssues:lesson.meta.textbookIssues,
  inlineScripts,
  status:'static validation passed'
}, null, 2));
