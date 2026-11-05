const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L16.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L16-USE-PILOT-V1.json');
const formalText = fs.readFileSync(formalPath, 'utf8');
const lesson = JSON.parse(formalText);
const formalHash = crypto.createHash('sha256').update(formalText.replace(/\r\n/g, '\n')).digest('hex').toUpperCase();

const miniDesigns = [
  {
    id:'T1', icon:'🐾', label:'课文 1', title:'我想领养的动物',
    goal:'如果你想领养一只动物，你想领养什么？为什么？',
    goalEn:'Say which animal you would adopt and give one simple reason.',
    image:'images/hsk3-l16/photo-text-1-adoption-shop.png', imageLabel:'宠物领养店里的小猫',
    entryPromptCn:'看图先说一句：你喜欢什么动物？',
    entryPromptEn:'Look at the picture and name one animal you like.',
    steps:['说出想领养的动物','说出一个简单理由'],
    exitPromptCn:'如果你想领养一只动物，你想领养什么？为什么？',
    exitPromptEn:'Which animal would you adopt, and why?',
    words:['动物','可爱','照顾','周末'],
    textId:'t_hsk3_l16_01', grammarIndex:0, taskId:'l16_task_01', paragraphId:'l16_para_01'
  },
  {
    id:'T2', icon:'🐼', label:'课文 2', title:'我眼中的大熊猫',
    goal:'介绍一下你眼中的大熊猫。',
    goalEn:'Introduce the giant panda in your eyes in two or three sentences.',
    image:'images/hsk3-l16/photo-text-2-panda-questions.png', imageLabel:'孩子在熊猫馆提问题',
    entryPromptCn:'关于大熊猫，你想知道什么？（问3个问题）',
    entryPromptEn:'What would you like to know about giant pandas? Ask three questions.',
    steps:['说出你觉得大熊猫怎么样','说一个大熊猫事实','连成2—3句话'],
    exitPromptCn:'介绍一下你眼中的大熊猫。',
    exitPromptEn:'Introduce the giant panda in your eyes.',
    words:['大熊猫','竹子','国宝','关于','其实'],
    textId:'t_hsk3_l16_02', grammarIndex:1, taskId:'l16_task_02', paragraphId:'l16_para_02'
  },
  {
    id:'T3', icon:'🔎', label:'课文 3', title:'熊猫的习惯',
    goal:'介绍一下熊猫的习惯。',
    goalEn:'Introduce two panda habits.',
    image:'images/hsk3-l16/photo-text-3-panda-observation.png', imageLabel:'两只大熊猫的不同动作',
    entryPromptCn:'看图先说一个你看到的熊猫动作。',
    entryPromptEn:'Look at the picture and name one visible panda action.',
    steps:['说出一个吃的习惯','说出一个睡觉或活动习惯'],
    exitPromptCn:'介绍一下熊猫的习惯。',
    exitPromptEn:'Introduce two panda habits.',
    words:['饱','嘴','身边','半天','脸'],
    textId:'t_hsk3_l16_03', grammarIndex:2, taskId:'l16_task_03', paragraphId:'l16_para_03'
  },
  {
    id:'T4', icon:'🧭', label:'课文 4', title:'第一次来北京的参观建议',
    goal:'给第一次来北京旅游的家人朋友一些建议。',
    goalEn:'Give two practical tips to family or friends visiting Beijing for the first time.',
    image:'images/hsk3-l16/photo-text-4-winter-summer-zoo.png', imageLabel:'冬天和夏天参观动物园',
    entryPromptCn:'看图先说一句：你想什么时候去动物园？',
    entryPromptEn:'Look at the picture and say when you would like to visit the zoo.',
    steps:['给出第一条实用建议','给出第二条实用建议'],
    exitPromptCn:'给第一次来北京旅游的家人朋友一些建议。',
    exitPromptEn:'Give two practical tips to family or friends visiting Beijing for the first time.',
    words:['大人','喜爱','动物园','大熊猫','比','早点儿'],
    textId:'t_hsk3_l16_04', grammarIndex:3, taskId:'l16_task_04', paragraphId:'l16_para_04'
  }
];

const wordGroups = [
  ['v16_01','v16_02','v16_03','v16_04','v16_05','v16_06','v16_07','v16_08','v16_09','v16_10'],
  ['v16_11','v16_12','v16_13','v16_14','v16_15','v16_16','v16_17','v16_18'],
  ['v16_19','v16_20','v16_21','v16_22','v16_23','v16_24'],
  ['v16_25','v16_26','v16_09','v16_11','v16_16','v16_08']
];

const byVocabularyId = Object.fromEntries(lesson.vocabulary.map((item) => [item.id, item]));
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
  const offset = (numericId + groupIndex) % 12;
  const distractors = lesson.vocabulary
    .filter((item) => item.id !== word.id)
    .slice(offset, offset + 3)
    .map((item) => item.hanzi);
  const options = distractors.slice(0, 3);
  const answerIndex = (numericId + groupIndex) % 4;
  options.splice(answerIndex, 0, word.hanzi);
  return options;
}

function configuredActivities(word, groupIndex) {
  const common = {targetWordIds:[word.id],acceptedAnswers:[word.hanzi]};
  const activities = [{
    ...common,
    id:'l16_m' + (groupIndex + 1) + '_' + word.id + '_shape',
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
      id:'l16_m' + (groupIndex + 1) + '_' + word.id + '_input',
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
      id:'l16_m' + (groupIndex + 1) + '_' + word.id + '_use',
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
  const grammar = lesson.grammar[design.grammarIndex];
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
    exitRequirements:design.steps.map((label, stepIndex) => ({
      id:'step_' + (stepIndex + 1),
      label
    })),
    supportCards:[
      {
        id:'t' + (index + 1) + '_words',
        labelCn:'词汇提示',
        labelEn:'Word support',
        contentCn:design.words.join('、'),
        contentEn:'Use only the words you need.'
      },
      {
        id:'t' + (index + 1) + '_order',
        labelCn:'表达步骤',
        labelEn:'Speaking steps',
        contentCn:design.steps.join(' → '),
        contentEn:'Complete the simple steps in order.'
      }
    ],
    textId:design.textId,
    entry:{
      id:'l16_t' + (index + 1) + '_use_entry',
      label:'起点表达',
      labelEn:'Starting expression',
      promptCn:design.entryPromptCn,
      promptEn:design.entryPromptEn,
      stimulus:{
        type:'image',
        image:design.image,
        labelCn:design.imageLabel,
        altCn:design.imageLabel,
        instructionCn:design.entryPromptCn,
        instructionEn:design.entryPromptEn
      }
    },
    exit:{
      id:'l16_t' + (index + 1) + '_use_exit',
      label:'终点表达',
      labelEn:'Upgraded expression',
      promptCn:design.exitPromptCn,
      promptEn:design.exitPromptEn
    },
    linkedResources:{
      vocabulary:{
        module:'teach',
        submodule:'tv',
        label:'课文' + (index + 1) + '词汇',
        vocabSession:String(index + 1)
      },
      grammar:{
        module:'teach',
        submodule:'tg',
        label:grammar.title,
        grammarIndex:design.grammarIndex
      },
      text:{
        module:'teach',
        submodule:'tt',
        label:'课文' + (index + 1),
        textIndex:index
      },
      practice:{
        module:'practice',
        submodule:'t2k',
        label:'任务卡：' + task.data.title,
        routeState:{t2ki:index}
      }
    },
    resourceLinks:[
      {id:design.taskId,status:'ready',purpose:task.data.title},
      {id:design.paragraphId,status:'ready',purpose:paragraph.data.title}
    ]
  };
});

const textLearning = lesson.texts.map((text, index) => {
  const note = lesson.textTeachingNotes[text.id];
  const grammar = lesson.grammar[miniDesigns[index].grammarIndex];
  return {
    textId:text.id,
    useGroupId:'T' + (index + 1),
    title:text.title,
    stageContract:['listen_or_read','overall_choice','detail_qa','show_text','language_and_application'],
    overviewChoices:note.overallChoices.map((item) => ({
      id:item.id,
      focus:item.focus,
      questionCn:item.questionCn || item.question,
      questionPinyin:item.questionPinyin || item.pinyin || '',
      options:item.options,
      correctIndex:item.correctIndex
    })),
    detailMode:'config',
    detailQuestions:note.details.map((item) => ({
      id:item.id,
      questionCn:item.questionCn || item.question,
      questionPinyin:item.questionPinyin || item.pinyin || '',
      answer:item.answer,
      answerPinyin:item.answerPinyin || '',
      acceptedAnswers:item.acceptedAnswers,
      informationPoint:item.informationPoint
    })),
    grammarBridge:{
      evidence:grammar.examples[0].hanzi,
      focus:grammar.structure,
      actionLabel:'进入“' + grammar.title + '”',
      grammarIndex:miniDesigns[index].grammarIndex
    },
    paragraphPractice:{
      label:'调用“' + byQuestionId[miniDesigns[index].paragraphId].data.title + '”段落填空',
      module:'practice',
      submodule:'r4p',
      index
    },
    lifeTransfer:{
      promptCn:note.languageAndApplication.personalPrompt,
      promptEn:miniDesigns[index].goalEn
    }
  };
});

const vocabularyTaskTypes = [
  {id:'recognition',labelCn:'认读',labelEn:'Recognition'},
  {id:'shape',labelCn:'辨形',labelEn:'Character form'},
  {id:'input',labelCn:'输入',labelEn:'Type the word'},
  {id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}
];

const vocabularyCatalog = lesson.vocabulary.map((word) => ({
  id:word.id,
  hanzi:word.hanzi,
  pinyin:word.pinyin,
  english:word.english,
  meaningCn:word.meaningCn,
  phrases:word.phrases,
  example:word.example,
  tier:word.tier,
  allowedTypes:allowedTypes(word)
}));

const vocabularyGroups = wordGroups.map((ids, index) => ({
  id:'T' + (index + 1),
  textIndex:index,
  title:miniDesigns[index].title,
  wordIds:ids,
  recognitionWordIds:ids.slice(0,4),
  activities:ids.flatMap((id) => configuredActivities(byVocabularyId[id], index))
}));

const profile = {
  schemaVersion:'classpro-use-profile/v3',
  experiment:{
    id:'l16-use-pilot-v1',
    title:'第16课·以用为主线升级版',
    lessonLabel:'第16课',
    sourceLesson:'HSK3-L16',
    scope:'四个课文MINI循环；保留L16原生词汇场景、渐进式语法、对话与日记体裁、正式音频和完整练习。'
  },
  sources:{
    lesson:{path:'../lessons/HSK3-L16.json',sha256:formalHash},
    teacher:{path:'../../in-class/teacher.html'},
    student:{path:'../../in-class/student.html'}
  },
  nativeTeaching:{
    preserveCourseStyles:true,
    grammar:{
      source:'formal_lesson',
      preserveExamples:true,
      preserveHighlights:true,
      preserveOralQuestions:true,
      preserveFollowUp:true
    },
    text:{
      source:'formal_lesson',
      preservePresentation:true,
      preserveDialogue:true,
      preserveDiary:true,
      preserveAudio:true
    },
    vocabulary:{
      source:'formal_lesson',
      preserveScenes:true,
      preserveHotspots:true
    }
  },
  useGroups,
  textLearning,
  vocabularyTaskTypes,
  timerPolicy:{
    miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:4},
    vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2},
    autoClose:false,
    autoSubmit:false
  },
  vocabularyCatalog,
  vocabularyGroups,
  resourceOverrides:[],
  supportOnlyStructures:[
    '目标语法用于支架和挑战层，不要求所有学生在第一次终点表达中全部使用。'
  ],
  evidencePolicy:{
    coreTypes:['entry_expression','actual_learning_path','exit_expression'],
    pathEvent:'opened',
    optionalSignals:['support_request','self_reflection']
  },
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
  capabilities:[
    'select_text_mini_loop',
    'launch_interaction',
    'independent_answer',
    'support_request',
    'anonymous_return',
    'open_support',
    'reanswer',
    'record_teacher_decision',
    'compare_entry_exit',
    'teacher_selected_vocabulary_focus',
    'shared_countdown',
    'native_course_resource_return',
    'configured_task_stimulus',
    'state_restore'
  ]
};

fs.mkdirSync(path.dirname(outputPath), {recursive:true});
fs.writeFileSync(outputPath, JSON.stringify(profile, null, 2) + '\n', 'utf8');
console.log('Built ' + path.relative(root, outputPath));
