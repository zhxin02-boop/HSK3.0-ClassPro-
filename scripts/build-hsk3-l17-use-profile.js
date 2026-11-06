const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L17.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L17-USE-PILOT-V1.json');
const formalText = fs.readFileSync(formalPath, 'utf8');
const lesson = JSON.parse(formalText);
const formalHash = crypto.createHash('sha256').update(formalText.replace(/\r\n/g, '\n')).digest('hex').toUpperCase();

const miniDesigns = [
  {
    id:'T1', icon:'🧭', label:'课文 1', title:'我想向谁学习',
    goal:'你想向谁学习？为什么？',
    goalEn:'Name one person you want to learn from and give one reason.',
    image:'images/hsk3-l17/photo-text-1-careful-work.png', imageLabel:'两名学生完成任务后的不同检查习惯',
    entryPromptCn:'说一个你觉得“很认真”的人。',
    entryPromptEn:'Name one person you think is careful and serious about their work.',
    steps:['说出一个人','说出一个理由'],
    words:['向','害怕','生气','常见','聪明','错','认为'],
    textId:'t_hsk3_l17_01', grammarId:'g17_01', taskId:'l17_task_01', paragraphId:'l17_para_01'
  },
  {
    id:'T2', icon:'📚', label:'课文 2', title:'我的学习方向',
    goal:'说说你想继续学习什么，并请同学给你一个建议。',
    goalEn:'Say what you want to continue studying and ask a classmate for one suggestion.',
    image:'images/hsk3-l17/photo-text-2-library-choice.png', imageLabel:'学生在图书馆比较学习和工作资料',
    entryPromptCn:'你以后想继续学习还是工作？',
    entryPromptEn:'Would you like to continue studying or start working?',
    steps:['说出一个学习内容','请同学给一个建议'],
    words:['到处','继续','同意','屋子','有关'],
    textId:'t_hsk3_l17_02', grammarId:'g17_02', taskId:'l17_task_02', paragraphId:'l17_para_02'
  },
  {
    id:'T3', icon:'🌍', label:'课文 3', title:'我要怎么准备',
    goal:'介绍一个你想去学习的国家或城市，说说你要怎么准备？',
    goalEn:'Introduce one country or city where you want to study and explain how you will prepare.',
    image:'images/hsk3-l17/photo-text-3-study-abroad-search.png', imageLabel:'学生在电脑前查学校和留学资料',
    entryPromptCn:'你想去哪个国家或城市学习？',
    entryPromptEn:'Which country or city would you like to study in?',
    steps:['说出一个国家或城市','说出一种准备办法'],
    words:['关机','前天','留学','国家','比如','查','有用'],
    textId:'t_hsk3_l17_03', grammarId:'g17_03', taskId:'l17_task_03', paragraphId:'l17_para_03'
  },
  {
    id:'T4', icon:'🎓', label:'课文 4', title:'毕业后的打算',
    goal:'介绍你毕业以后的打算：工作还是继续学习？为什么？',
    goalEn:'Explain whether you will work or continue studying after graduation and give one reason.',
    image:'images/hsk3-l17/photo-text-4-graduation-paths.png', imageLabel:'毕业生面对工作、继续学习和留学三条路',
    entryPromptCn:'以后你想做什么？',
    entryPromptEn:'What would you like to do in the future?',
    steps:['选择工作或继续学习','说出一个理由'],
    words:['容易','回答','方向','只有','真正','难题'],
    textId:'t_hsk3_l17_04', grammarId:'g17_04', taskId:'l17_task_04', paragraphId:'l17_para_04'
  }
];

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
  const offset = (numericId + groupIndex * 3) % pool.length;
  const options = [0,1,2].map((step) => pool[(offset + step) % pool.length]);
  const answerIndex = (numericId + groupIndex) % 4;
  options.splice(answerIndex, 0, word.hanzi);
  return options;
}

function configuredActivities(word, groupIndex) {
  const common = {targetWordIds:[word.id],acceptedAnswers:[word.hanzi]};
  const activities = [{
    ...common,
    id:'l17_m' + (groupIndex + 1) + '_' + word.id + '_shape',
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
      id:'l17_m' + (groupIndex + 1) + '_' + word.id + '_input',
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
      id:'l17_m' + (groupIndex + 1) + '_' + word.id + '_use',
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
  const grammar = byGrammarId[design.grammarId];
  const task = byQuestionId[design.taskId];
  const paragraph = byQuestionId[design.paragraphId];
  return {
    id:design.id,
    icon:design.icon,
    label:design.label,
    title:design.title,
    goal:design.goal,
    goalEn:design.goalEn,
    image:design.image,
    imageLabel:design.imageLabel,
    entryPromptCn:design.entryPromptCn,
    entryPromptEn:design.entryPromptEn,
    responseMode:'teacherObservedWithTextOutline',
    exitRequirements:design.steps.map((label, stepIndex) => ({id:'step_' + (stepIndex + 1),label})),
    supportCards:[
      {id:'t' + (index + 1) + '_words',labelCn:'词汇提示',labelEn:'Word support',contentCn:design.words.join('、'),contentEn:'Use only the words you need.'},
      {id:'t' + (index + 1) + '_order',labelCn:'表达步骤',labelEn:'Speaking steps',contentCn:design.steps.join(' → '),contentEn:'Complete the simple steps in order.'}
    ],
    textId:design.textId,
    entry:{
      id:'l17_t' + (index + 1) + '_use_entry',
      label:'起点表达',
      labelEn:'Starting expression',
      promptCn:design.entryPromptCn,
      promptEn:design.entryPromptEn,
      stimulus:{type:'image',image:design.image,labelCn:design.imageLabel,altCn:design.imageLabel,instructionCn:design.entryPromptCn,instructionEn:design.entryPromptEn}
    },
    exit:{id:'l17_t' + (index + 1) + '_use_exit',label:'终点表达',labelEn:'Upgraded expression',promptCn:design.goal,promptEn:design.goalEn},
    linkedResources:{
      vocabulary:{module:'teach',submodule:'tv',label:'课文' + (index + 1) + '词汇',vocabSession:String(index + 1)},
      grammar:{module:'teach',submodule:'tg',label:grammar.title,grammarIndex:grammar.index},
      text:{module:'teach',submodule:'tt',label:'课文' + (index + 1),textIndex:index},
      practice:{module:'practice',submodule:'t2k',label:'任务卡：' + design.title,routeState:{t2ki:index}}
    },
    resourceLinks:[
      {id:design.taskId,status:'ready',purpose:task.data.output},
      {id:design.paragraphId,status:'ready',purpose:paragraph.data.title}
    ]
  };
});

const textLearning = lesson.texts.map((text, index) => {
  const design = miniDesigns[index];
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
    lifeTransfer:{promptCn:design.goal,promptEn:design.goalEn}
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
  phrases:word.phrases,example:word.example,tier:word.tier,allowedTypes:allowedTypes(word)
}));

const vocabularyGroups = wordGroups.map((ids, index) => ({
  id:'T' + (index + 1),
  textIndex:index,
  title:miniDesigns[index].title,
  wordIds:ids,
  recognitionWordIds:recognitionGroups[index],
  activities:ids.flatMap((id) => configuredActivities(byVocabularyId[id], index))
}));

const profile = {
  schemaVersion:'classpro-use-profile/v3',
  experiment:{
    id:'l17-use-pilot-v1',
    title:'第17课·以用为主线升级版',
    lessonLabel:'第17课',
    sourceLesson:'HSK3-L17',
    scope:'四个课文MINI循环；保留L17原生词汇场景、渐进式语法、对话与日记体裁、正式音频和完整练习。'
  },
  sources:{lesson:{path:'../lessons/HSK3-L17.json',sha256:formalHash},teacher:{path:'../../in-class/teacher.html'},student:{path:'../../in-class/student.html'}},
  nativeTeaching:{
    preserveCourseStyles:true,
    grammar:{source:'formal_lesson',preserveExamples:true,preserveHighlights:true,preserveOralQuestions:true,preserveFollowUp:true},
    text:{source:'formal_lesson',preservePresentation:true,preserveDialogue:true,preserveDiary:true,preserveAudio:true},
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
