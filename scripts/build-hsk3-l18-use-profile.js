const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L18.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L18-USE-PILOT-V1.json');
const formalText = fs.readFileSync(formalPath, 'utf8');
const lesson = JSON.parse(formalText);
const formalHash = crypto.createHash('sha256').update(formalText.replace(/\r\n/g, '\n')).digest('hex').toUpperCase();

const miniDesigns = [
  {
    id:'T1', icon:'🧧', label:'课文 1', formalId:'mini_l18_t1_festival',
    goalEn:'Introduce one festival you like, when it is, and one activity you do with your family.',
    image:'images/hsk3-l18/photo-text-1-family-dumplings-gala.png', imageLabel:'一家人在春节一起包饺子、看晚会',
    entryPromptEn:'Which festival do you like?',
    words:['春节','怎样','过节','节日','联欢','大概'],
    textId:'t_hsk3_l18_01', grammarId:'g18_01', taskId:'l18_task_01', paragraphId:'l18_para_01'
  },
  {
    id:'T2', icon:'🥟', label:'课文 2', formalId:'mini_l18_t2_new_skill',
    goalEn:'Introduce one thing you have just learned to do and explain how you learned it.',
    image:'images/hsk3-l18/photo-text-2-learning-dumplings-video.png', imageLabel:'白家月看视频学习包饺子',
    entryPromptEn:'What is one thing you have just learned to do?',
    words:['阿姨','叔叔','收','总','见面','刚刚'],
    textId:'t_hsk3_l18_02', grammarId:'g18_02', taskId:'l18_task_02', paragraphId:'l18_para_02'
  },
  {
    id:'T3', icon:'📷', label:'课文 3', formalId:'mini_l18_t3_photo_story',
    goalEn:'Introduce an old photo that matters to you, when it was taken, and one part of its story.',
    image:'images/hsk3-l18/photo-text-3-airport-family-photo.png', imageLabel:'妈妈向客人介绍三四年前的机场全家照',
    entryPromptEn:'Do you have a photo you like?',
    words:['出发','不久','发生','刚','只要','学期','毕业'],
    textId:'t_hsk3_l18_03', grammarId:'g18_03', taskId:'l18_task_03', paragraphId:'l18_para_03'
  },
  {
    id:'T4', icon:'🎯', label:'课文 4', formalId:'mini_l18_t4_growth_goal',
    goalEn:'Introduce one goal, say when you will start, and explain one action you will keep doing.',
    image:'images/hsk3-l18/photo-text-4-study-goal-timeline.png', imageLabel:'学生通过每天学习和检查计划坚持完成目标',
    entryPromptEn:'Do you have a small goal now?',
    words:['出生','过去','懂得','坚持','完成','目标'],
    textId:'t_hsk3_l18_04', grammarId:'g18_04', taskId:'l18_task_04', paragraphId:'l18_para_04'
  }
];

const formalPlans = Object.fromEntries(lesson.usePreparation.formalResourcePlan.map((plan) => [plan.id, plan]));
const wordGroups = lesson.vocabularyGroups.map((group) => group.vocabularyIds);
const recognitionGroups = lesson.vocabularyGroups.map((group) => group.recognitionWordIds);
const byVocabularyId = Object.fromEntries(lesson.vocabulary.map((item) => [item.id, item]));
const byGrammarId = Object.fromEntries(lesson.grammar.map((item, index) => [item.id, {...item,index}]));
const byQuestionId = Object.fromEntries(
  Object.values(lesson.inClass.questionGroups)
    .flatMap((value) => Array.isArray(value) ? value : [])
    .map((item) => [item.id, item])
);
const allowedTypes = (word) => word.tier === 'expression'
  ? ['recognition','shape','input','collocation']
  : ['recognition','shape'];

function shapeOptions(word, groupIndex) {
  const numericId = Number(word.id.split('_').pop()) || 0;
  const pool = lesson.vocabulary.filter((item) => item.id !== word.id).map((item) => item.hanzi);
  const offset = (numericId + groupIndex * 5) % pool.length;
  const options = [0,1,2].map((step) => pool[(offset + step) % pool.length]);
  const answerIndex = (numericId + groupIndex) % 4;
  options.splice(answerIndex, 0, word.hanzi);
  return options;
}

function configuredActivities(word, groupIndex) {
  const common = {targetWordIds:[word.id],acceptedAnswers:[word.hanzi]};
  const activities = [{
    ...common,
    id:'l18_m' + (groupIndex + 1) + '_' + word.id + '_shape',
    type:'shape',
    promptCn:'根据拼音和简单中文解释选择正确的汉字词。',
    promptEn:'Choose the correct Chinese form from the pinyin and simple Chinese meaning.',
    stimulus:word.pinyin + '：' + word.meaningCn,
    answer:word.hanzi,
    options:shapeOptions(word, groupIndex),
    promptMode:'form',
    evaluation:'automatic'
  }];
  if (word.tier === 'expression') {
    activities.push({
      ...common,
      id:'l18_m' + (groupIndex + 1) + '_' + word.id + '_input',
      type:'input',
      promptCn:'根据简单中文意思输入词语。',
      promptEn:'Type the Chinese word from the simple Chinese meaning.',
      stimulus:word.meaningCn,
      answer:word.hanzi,
      options:[],
      promptMode:'meaning',
      evaluation:'automatic'
    });
    activities.push({
      id:'l18_m' + (groupIndex + 1) + '_' + word.id + '_use',
      type:'collocation',
      targetWordIds:[word.id],
      promptCn:'用“' + word.phrases[0] + '”完成表达，最多两句话。',
      promptEn:'Use the phrase in one or two complete sentences.',
      stimulus:word.phrases[0],
      answer:word.example,
      acceptedAnswers:[],
      options:[],
      promptMode:'open_use',
      evaluation:'teacher'
    });
  }
  return activities;
}

const useGroups = miniDesigns.map((design, index) => {
  const formalPlan = formalPlans[design.formalId];
  const grammar = byGrammarId[design.grammarId];
  const task = byQuestionId[design.taskId];
  const paragraph = byQuestionId[design.paragraphId];
  return {
    id:design.id,
    icon:design.icon,
    label:design.label,
    title:formalPlan.title,
    goal:formalPlan.exit,
    goalEn:design.goalEn,
    image:design.image,
    imageLabel:design.imageLabel,
    entryPromptCn:formalPlan.entry,
    entryPromptEn:design.entryPromptEn,
    responseMode:'teacherObservedWithTextOutline',
    exitRequirements:formalPlan.exitRequirements.map((label, stepIndex) => ({id:'step_' + (stepIndex + 1),label})),
    supportCards:[
      {id:'t' + (index + 1) + '_words',labelCn:'词汇提示',labelEn:'Word support',contentCn:design.words.join('、'),contentEn:'Use only the words you need.'},
      {id:'t' + (index + 1) + '_order',labelCn:'表达步骤',labelEn:'Speaking steps',contentCn:formalPlan.exitRequirements.join(' → '),contentEn:'Complete the simple steps in order.'}
    ],
    textId:design.textId,
    entry:{
      id:'l18_t' + (index + 1) + '_use_entry',
      label:'起点表达',
      labelEn:'Starting expression',
      promptCn:formalPlan.entry,
      promptEn:design.entryPromptEn,
      stimulus:{type:'image',image:design.image,labelCn:design.imageLabel,altCn:design.imageLabel,instructionCn:formalPlan.entry,instructionEn:design.entryPromptEn}
    },
    exit:{id:'l18_t' + (index + 1) + '_use_exit',label:'终点表达',labelEn:'Upgraded expression',promptCn:formalPlan.exit,promptEn:design.goalEn},
    linkedResources:{
      vocabulary:{module:'teach',submodule:'tv',label:'课文' + (index + 1) + '词汇',vocabSession:String(index + 1)},
      grammar:{module:'teach',submodule:'tg',label:grammar.title,grammarIndex:grammar.index},
      text:{module:'teach',submodule:'tt',label:'课文' + (index + 1),textIndex:index},
      practice:{module:'practice',submodule:'t2k',label:'任务卡：' + formalPlan.title,routeState:{t2ki:index}}
    },
    resourceLinks:[
      {id:design.taskId,status:'ready',purpose:task.data.output},
      {id:design.paragraphId,status:'ready',purpose:paragraph.data.title}
    ]
  };
});

const textLearning = lesson.texts.map((text, index) => {
  const design = miniDesigns[index];
  const formalPlan = formalPlans[design.formalId];
  const note = lesson.textTeachingNotes[text.id];
  const grammar = byGrammarId[design.grammarId];
  return {
    textId:text.id,
    useGroupId:design.id,
    title:text.title,
    stageContract:['listen_or_read','overall_choice','detail_qa','show_text','language_and_application'],
    overviewChoices:note.overallChoices.map((item) => ({id:item.id,focus:item.focus,questionCn:item.questionCn || item.question,questionPinyin:item.questionPinyin || item.pinyin || '',options:item.options,correctIndex:item.correctIndex})),
    detailMode:'config',
    detailQuestions:note.details.map((item) => ({id:item.id,questionCn:item.questionCn || item.question,questionPinyin:item.questionPinyin || item.pinyin || '',answer:item.answer,answerPinyin:item.answerPinyin || '',acceptedAnswers:item.acceptedAnswers,informationPoint:item.informationPoint})),
    grammarBridge:{evidence:grammar.examples[0].hanzi,focus:grammar.structure,actionLabel:'进入“' + grammar.title + '”',grammarIndex:grammar.index},
    paragraphPractice:{label:'调用“' + byQuestionId[design.paragraphId].data.title + '”段落填空',module:'practice',submodule:'r4p',index},
    lifeTransfer:{promptCn:formalPlan.exit,promptEn:design.goalEn}
  };
});

const vocabularyTaskTypes = [
  {id:'recognition',labelCn:'认读',labelEn:'Recognition'},
  {id:'shape',labelCn:'辨形',labelEn:'Character form'},
  {id:'input',labelCn:'输入',labelEn:'Type the word'},
  {id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}
];

const vocabularyCatalog = lesson.vocabulary.map((word) => ({
  id:word.id,hanzi:word.hanzi,pinyin:word.pinyin,english:word.english,meaningCn:word.meaningCn,
  phrases:word.phrases,example:word.example,tier:word.tier,properNoun:Boolean(word.properNoun),allowedTypes:allowedTypes(word)
}));

const vocabularyGroups = wordGroups.map((ids, index) => ({
  id:'T' + (index + 1),
  textIndex:index,
  title:formalPlans[miniDesigns[index].formalId].title,
  wordIds:ids,
  recognitionWordIds:recognitionGroups[index],
  activities:ids.flatMap((id) => configuredActivities(byVocabularyId[id], index))
}));

const profile = {
  schemaVersion:'classpro-use-profile/v3',
  experiment:{
    id:'l18-use-pilot-v1',
    title:'第18课·以用为主线升级版',
    lessonLabel:'第18课',
    sourceLesson:'HSK3-L18',
    scope:'四个课文MINI循环；保留L18原生词汇场景、渐进式语法、对话与日记体裁、教材音频、课文4教学扩展英文和完整练习。'
  },
  sources:{lesson:{path:'../lessons/HSK3-L18.json',sha256:formalHash},teacher:{path:'../../in-class/teacher.html'},student:{path:'../../in-class/student.html'}},
  nativeTeaching:{
    preserveCourseStyles:true,
    grammar:{source:'formal_lesson',preserveExamples:true,preserveHighlights:true,preserveOralQuestions:true,preserveFollowUp:true},
    text:{source:'formal_lesson',preservePresentation:true,preserveDialogue:true,preserveDiary:true,preserveAudio:true,preserveExtensionEnglish:true},
    vocabulary:{source:'formal_lesson',preserveScenes:true,preserveHotspots:true}
  },
  useGroups,
  textLearning,
  vocabularyTaskTypes,
  timerPolicy:{miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:4},vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2},autoClose:false,autoSubmit:false},
  vocabularyCatalog,
  vocabularyGroups,
  resourceOverrides:[],
  supportOnlyStructures:['目标语法用于支架和挑战层，不要求所有学生在第一次终点表达中全部使用。'],
  evidencePolicy:{coreTypes:['entry_expression','actual_learning_path','exit_expression'],pathEvent:'opened',optionalSignals:['support_request','self_reflection']},
  supportOptions:[
    {id:'vocabulary',labelCn:'我缺少合适的词',labelEn:'I need the right words'},
    {id:'organization',labelCn:'我不知道怎样组织信息',labelEn:'I need help organizing my ideas'},
    {id:'structure',labelCn:'我需要一个句子结构',labelEn:'I need a sentence frame'},
    {id:'teacher',labelCn:'我想获得老师的帮助',labelEn:'I want help from the teacher'}
  ],
  feelingOptions:[
    {id:'clearer',labelCn:'我说得更清楚了',labelEn:'My expression is clearer'},
    {id:'more_complete',labelCn:'我说得更完整了',labelEn:'My expression is more complete'},
    {id:'more_natural',labelCn:'我说得更自然了',labelEn:'My expression is more natural'},
    {id:'still_need_help',labelCn:'我还需要帮助',labelEn:'I still need help'}
  ],
  coreEvidence:['entry_expression','actual_learning_path','exit_expression'],
  capabilities:['select_text_mini_loop','launch_interaction','independent_answer','support_request','anonymous_return','open_support','reanswer','record_teacher_decision','compare_entry_exit','teacher_selected_vocabulary_focus','shared_countdown','native_course_resource_return','configured_task_stimulus','state_restore']
};

fs.mkdirSync(path.dirname(outputPath), {recursive:true});
fs.writeFileSync(outputPath, JSON.stringify(profile, null, 2) + '\n', 'utf8');
console.log('Built ' + path.relative(root, outputPath));
