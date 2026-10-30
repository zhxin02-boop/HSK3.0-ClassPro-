const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L15.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L15-USE-PILOT-V1.json');
const formalText = fs.readFileSync(formalPath, 'utf8');
const lesson = JSON.parse(formalText);
const formalHash = crypto.createHash('sha256').update(formalText.replace(/\r\n/g, '\n')).digest('hex').toUpperCase();

const miniDesigns = [
  {
    id:'T1', icon:'🏘️', label:'课文 1', title:'适合谁住的小区',
    goal:'介绍附近的生活设施、交通特点，并说明这里适合什么人居住。',
    goalEn:'Introduce nearby living facilities, transportation features, and who the place is suitable for.',
    image:'images/hsk3-l15/photo-text-1-community-talk.png', imageLabel:'小区环境与居民需要',
    entryPromptCn:'看图先说20—30秒：小区附近有什么？这里可能适合谁住？',
    entryPromptEn:'Look at the picture and briefly describe the community and who may live there.',
    steps:['介绍附近的生活设施','说明交通特点','说明适合什么人居住'],
    exitPromptCn:'介绍附近的生活设施、交通特点，并说明这里适合什么人居住。',
    exitPromptEn:'Introduce nearby living facilities, transportation features, and who the place is suitable for.',
    words:['附近','马路','平时','根据','老人'],
    textId:'t_hsk3_l15_01', grammarIndex:0, taskId:'l15_task_01', paragraphId:'l15_para_01'
  },
  {
    id:'T2', icon:'🏯', label:'课文 2', title:'半个本地人推荐',
    goal:'先问游客的兴趣，推荐两个地方，并分别说明推荐理由。',
    goalEn:'Ask about the visitor’s interests, recommend two places, and explain each recommendation.',
    image:'images/hsk3-l15/photo-text-2-nanjing-advice.png', imageLabel:'南京旅行建议',
    entryPromptCn:'看图先说20—30秒：游客想了解什么？你会先问什么？',
    entryPromptEn:'Look at the picture and briefly state what the visitor wants to know.',
    steps:['问问游客的兴趣','推荐两个地方','分别说明为什么推荐'],
    exitPromptCn:'先问问游客的兴趣，再推荐两个地方，并分别说明为什么推荐。',
    exitPromptEn:'Ask about the visitor’s interests, recommend two places, and explain each recommendation.',
    words:['了解','南京','有名','景点','外地'],
    textId:'t_hsk3_l15_02', grammarIndex:1, taskId:'l15_task_02', paragraphId:'l15_para_02'
  },
  {
    id:'T3', icon:'🌊', label:'课文 3', title:'我了解的黄河',
    goal:'请介绍一下你了解的“黄河”。',
    goalEn:'Introduce what you know about the Yellow River.',
    image:'images/hsk3-l15/photo-text-3-yellow-river-talk.png', imageLabel:'黄河与生活',
    entryPromptCn:'看图先说20—30秒：这是什么河？它为什么重要？',
    entryPromptEn:'Look at the picture and briefly say which river it is and why it matters.',
    steps:['说出黄河的名称和位置','介绍一个历史或生活事实','说明黄河的重要性'],
    exitPromptCn:'请介绍一下你了解的“黄河”。',
    exitPromptEn:'Introduce what you know about the Yellow River.',
    words:['河','关系','养','黄河'],
    textId:'t_hsk3_l15_03', grammarIndex:2, taskId:'l15_task_03', paragraphId:'l15_para_03'
  },
  {
    id:'T4', icon:'🌿', label:'课文 4', title:'我最喜欢的地方',
    goal:'讲一个最喜欢的地方，说明原因，并讲一个和这个地方有关的故事。',
    goalEn:'Talk about your favorite place, explain why, and tell your story with that place.',
    image:'images/hsk3-l15/photo-text-4-riverside-memory.png', imageLabel:'河边旧记忆',
    entryPromptCn:'看图先说20—30秒：这里有什么？人在这里可能会想起什么？',
    entryPromptEn:'Look at the picture and briefly describe the place and a possible memory.',
    steps:['说出最喜欢的地方','说明为什么喜欢','讲一个和这个地方有关的故事'],
    exitPromptCn:'讲一个你最喜欢的地方，说明为什么喜欢，并讲一个你和这个地方的故事。',
    exitPromptEn:'Talk about your favorite place, explain why, and tell your story with that place.',
    words:['西北','经过','草地','遇见'],
    textId:'t_hsk3_l15_04', grammarIndex:3, taskId:'l15_task_04', paragraphId:'l15_para_04'
  }
];

const wordGroups = [
  ['v15_01','v15_02','v15_03','v15_04','v15_05','v15_06','v15_07','v15_08','v15_09'],
  ['v15_10','v15_11','v15_12','v15_13','v15_14','v15_15','v15_16','v15_17','v15_25'],
  ['v15_18','v15_19','v15_20','v15_26'],
  ['v15_21','v15_22','v15_23','v15_24']
];

const byVocabularyId = Object.fromEntries(lesson.vocabulary.map((item) => [item.id, item]));
const byQuestionId = Object.fromEntries(Object.values(lesson.inClass.questionGroups).flatMap((value) => Array.isArray(value) ? value : []).map((item) => [item.id, item]));
const allowedTypes = (word) => word.tier === 'expression' ? ['recognition','shape','input','collocation'] : ['recognition','shape'];
const shapeOptions = (word, groupIndex) => [word.hanzi, ...lesson.vocabulary.filter((item) => item.id !== word.id).slice(groupIndex + 1, groupIndex + 4).map((item) => item.hanzi)];

function configuredActivities(word, groupIndex) {
  const common = { targetWordIds:[word.id], acceptedAnswers:[word.hanzi] };
  const activities = [{
    ...common,
    id:`l15_m${groupIndex + 1}_${word.id}_shape`, type:'shape',
    promptCn:'根据拼音和简单中文解释选择正确的汉字词。',
    promptEn:'Choose the correct Chinese form from the pinyin and simple Chinese meaning.',
    stimulus:`${word.pinyin}：${word.meaningCn}`, answer:word.hanzi,
    options:shapeOptions(word, groupIndex), promptMode:'form', evaluation:'automatic'
  }];
  if (word.tier === 'expression') {
    activities.push({
      ...common,
      id:`l15_m${groupIndex + 1}_${word.id}_input`, type:'input',
      promptCn:'根据简单中文意思输入词语。', promptEn:'Type the Chinese word from the simple Chinese meaning.',
      stimulus:word.meaningCn, answer:word.hanzi, options:[], promptMode:'meaning', evaluation:'automatic'
    });
    activities.push({
      id:`l15_m${groupIndex + 1}_${word.id}_use`, type:'collocation', targetWordIds:[word.id],
      promptCn:`用“${word.phrases[0]}”完成表达，最多两句话。`, promptEn:'Use the phrase in one or two complete sentences.',
      stimulus:word.phrases[0], answer:word.example, acceptedAnswers:[], options:[], promptMode:'open_use', evaluation:'teacher'
    });
  }
  return activities;
}

const useGroups = miniDesigns.map((design, index) => {
  const grammar = lesson.grammar[design.grammarIndex];
  const task = byQuestionId[design.taskId];
  const paragraph = byQuestionId[design.paragraphId];
  const exitPrompt = design.exitPromptCn;
  return {
    id:design.id, icon:design.icon, label:design.label, title:design.title,
    goal:design.goal, goalEn:design.goalEn, image:design.image, imageLabel:design.imageLabel,
    entryPromptCn:design.entryPromptCn, entryPromptEn:design.entryPromptEn,
    responseMode:'teacherObservedWithTextOutline',
    exitRequirements:design.steps.map((label, stepIndex) => ({ id:`step_${stepIndex + 1}`, label })),
    supportCards:[
      { id:`t${index + 1}_words`, labelCn:'词汇提示', labelEn:'Word support', contentCn:design.words.join('、'), contentEn:'' },
      { id:`t${index + 1}_order`, labelCn:'表达顺序', labelEn:'Organization support', contentCn:design.steps.join(' → '), contentEn:'' }
    ],
    textId:design.textId,
    entry:{
      id:`l15_t${index + 1}_use_entry`, label:'起点表达', labelEn:'Starting expression',
      promptCn:design.entryPromptCn, promptEn:design.entryPromptEn,
      stimulus:{ type:'image', image:design.image, labelCn:design.imageLabel, altCn:design.imageLabel, instructionCn:design.entryPromptCn, instructionEn:design.entryPromptEn }
    },
    exit:{ id:`l15_t${index + 1}_use_exit`, label:'终点表达', labelEn:'Upgraded expression', promptCn:exitPrompt, promptEn:design.exitPromptEn },
    linkedResources:{
      vocabulary:{ module:'teach', submodule:'tv', label:`课文${index + 1}词汇`, vocabSession:String(index + 1) },
      grammar:{ module:'teach', submodule:'tg', label:grammar.title, grammarIndex:design.grammarIndex },
      text:{ module:'teach', submodule:'tt', label:`课文${index + 1}`, textIndex:index },
      practice:{ module:'practice', submodule:'t2k', label:`任务卡：${task.data.title}`, routeState:{ t2ki:index } }
    },
    resourceLinks:[
      { id:design.taskId, status:'ready', purpose:task.data.title },
      { id:design.paragraphId, status:'ready', purpose:paragraph.data.title }
    ]
  };
});

const textLearning = lesson.texts.map((text, index) => {
  const note = lesson.textTeachingNotes[text.id];
  const grammar = lesson.grammar[miniDesigns[index].grammarIndex];
  return {
    textId:text.id, useGroupId:`T${index + 1}`, title:text.title,
    overviewChoices:note.overallChoices.map((item) => ({ id:item.id, focus:item.focus, questionCn:item.questionCn || item.question, questionPinyin:item.questionPinyin || item.pinyin || '', options:item.options, correctIndex:item.correctIndex })),
    detailMode:'config',
    detailQuestions:note.details.map((item) => ({ id:item.id, questionCn:item.questionCn || item.question, questionPinyin:item.questionPinyin || item.pinyin || '', answer:item.answer, answerPinyin:item.answerPinyin || '', acceptedAnswers:item.acceptedAnswers, informationPoint:item.informationPoint })),
    grammarBridge:{ evidence:grammar.examples[0].hanzi, focus:grammar.structure, actionLabel:`进入“${grammar.title}”`, grammarIndex:miniDesigns[index].grammarIndex },
    paragraphPractice:{ label:`调用“${byQuestionId[miniDesigns[index].paragraphId].data.title}”段落填空`, module:'practice', submodule:'r4p', index },
    lifeTransfer:{ promptCn:note.languageAndApplication.personalPrompt, promptEn:miniDesigns[index].goalEn }
  };
});

const vocabularyTaskTypes = [
  { id:'recognition', labelCn:'认读', labelEn:'Recognition' },
  { id:'shape', labelCn:'辨形', labelEn:'Character form' },
  { id:'input', labelCn:'输入', labelEn:'Type the word' },
  { id:'collocation', labelCn:'搭配与使用', labelEn:'Collocation and use' }
];

const vocabularyCatalog = lesson.vocabulary.map((word) => ({
  id:word.id, hanzi:word.hanzi, pinyin:word.pinyin, english:word.english,
  meaningCn:word.meaningCn, phrases:word.phrases, example:word.example,
  tier:word.tier, allowedTypes:allowedTypes(word)
}));

const vocabularyGroups = wordGroups.map((ids, index) => ({
  id:`T${index + 1}`, textIndex:index, title:miniDesigns[index].title,
  wordIds:ids, recognitionWordIds:ids.slice(0, 4),
  activities:ids.flatMap((id) => configuredActivities(byVocabularyId[id], index))
}));

const profile = {
  schemaVersion:'classpro-use-profile/v3',
  experiment:{
    id:'l15-use-pilot-v1', title:'第15课·以用为主线升级版', lessonLabel:'第15课', sourceLesson:'HSK3-L15',
    scope:'四个课文MINI循环；保留L15原生词汇场景、渐进式语法、课文体裁和正式练习。'
  },
  sources:{
    lesson:{ path:'../lessons/HSK3-L15.json', sha256:formalHash },
    teacher:{ path:'../../in-class/teacher.html' },
    student:{ path:'../../in-class/student.html' }
  },
  nativeTeaching:{
    preserveCourseStyles:true,
    grammar:{ source:'formal_lesson', preserveExamples:true, preserveHighlights:true, preserveOralQuestions:true, preserveFollowUp:true },
    text:{ source:'formal_lesson', preservePresentation:true, preserveDiary:true },
    vocabulary:{ source:'formal_lesson', preserveScenes:true, preserveHotspots:true }
  },
  useGroups,
  textLearning,
  vocabularyTaskTypes,
  timerPolicy:{ miniLoop:{ optionsMinutes:[3,4,5], defaultMinutes:4 }, vocabularyFocus:{ optionsMinutes:[2,3,4,5], defaultMinutes:2 }, autoClose:false, autoSubmit:false },
  vocabularyCatalog,
  vocabularyGroups,
  resourceOverrides:[],
  supportOnlyStructures:[],
  evidencePolicy:{ coreTypes:['entry_expression','actual_learning_path','exit_expression'], pathEvent:'opened', optionalSignals:['support_request','self_reflection'] },
  supportOptions:[
    { id:'vocabulary', labelCn:'我缺少合适的词', labelEn:'I need the right words' },
    { id:'organization', labelCn:'我不知道怎样组织信息', labelEn:'I need help organizing my ideas' },
    { id:'structure', labelCn:'我需要一个句子结构', labelEn:'I need a sentence frame' },
    { id:'teacher', labelCn:'我想获得老师的帮助', labelEn:'I want help from the teacher' }
  ],
  feelingOptions:[
    { id:'clearer', labelCn:'我说得更清楚了', labelEn:'My expression is clearer' },
    { id:'more_complete', labelCn:'我说得更完整了', labelEn:'My expression is more complete' },
    { id:'more_natural', labelCn:'我说得更自然了', labelEn:'My expression is more natural' },
    { id:'still_need_help', labelCn:'我还需要帮助', labelEn:'I still need help' }
  ],
  coreEvidence:['entry_expression','actual_learning_path','exit_expression'],
  capabilities:['select_text_mini_loop','launch_interaction','independent_answer','support_request','anonymous_return','open_support','reanswer','record_teacher_decision','compare_entry_exit','teacher_selected_vocabulary_focus','shared_countdown','native_course_resource_return','configured_task_stimulus','state_restore']
};

fs.mkdirSync(path.dirname(outputPath), { recursive:true });
fs.writeFileSync(outputPath, `${JSON.stringify(profile, null, 2)}\n`);
console.log(`Built ${path.relative(root, outputPath)}`);
