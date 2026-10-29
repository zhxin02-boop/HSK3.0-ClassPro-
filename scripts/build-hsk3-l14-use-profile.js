const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L14.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L14-USE-PILOT-V1.json');

function read(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return {
    sha256: crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex').toUpperCase(),
    data: JSON.parse(text)
  };
}

const miniDesigns = [
  {
    id:'T1', icon:'📚', label:'课文 1', title:'图书馆帮忙',
    goal:'请求同学帮助还书、借书，并说明书已经被别人借走。',
    goalEn:'Ask a classmate for help returning and borrowing books, and explain that a book has been checked out.',
    image:'images/hsk3-l14/photo-text-1-library-help.png', imageLabel:'图书馆帮忙',
    entryPromptCn:'你今天没课，想请同学帮你借本书，书的名字是《汉语世界》。',
    entryPromptEn:'Look at the picture and briefly say who needs help and what needs to be done.'
  },
  {
    id:'T2', icon:'🪪', label:'课文 2', title:'校园行动顺序',
    goal:'安排两个校园行动，说明校园卡问题并提出替代办法。',
    goalEn:'Put two campus actions in order, explain the campus-card problem, and offer an alternative.',
    image:'images/hsk3-l14/photo-text-2-campus-plan.png', imageLabel:'校园行动计划',
    entryPromptCn:'说说图上或者你自己今天的安排是什么。',
    entryPromptEn:'Look at the picture and name the two things to do this afternoon.'
  },
  {
    id:'T3', icon:'🎤', label:'课文 3', title:'晚会鼓励对话',
    goal:'说明表演担忧，并用合适的“×什么啊”表达安慰、理由和下一步。',
    goalEn:'Describe a performance worry, then use an appropriate ×什么啊 expression with reassurance and a next step.',
    image:'images/hsk3-l14/photo-text-3-stage-encouragement.png', imageLabel:'上台前的鼓励',
    entryPromptCn:'看图，先说表演者有什么担心，朋友可以怎样简单鼓励。',
    entryPromptEn:'Look at the picture and briefly state the performer’s worry and one encouraging response.'
  },
  {
    id:'T4', icon:'🎉', label:'课文 4', title:'新年晚会回顾',
    goal:'按日记顺序回顾新年晚会，说明活动、感受、最喜欢的节目和视频计划。',
    goalEn:'Give a diary-style review of the New Year party, including activities, feelings, a favorite program, and a video plan.',
    image:'images/hsk3-l14/photo-text-4-new-year-party.png', imageLabel:'新年晚会回顾',
    entryPromptCn:'看图，先用一两句话说晚会上有什么活动、你的感受怎样。',
    entryPromptEn:'Look at the picture and briefly describe one party activity and your feeling.'
  }
];

const wordGroups = [
  ['01','02','03','04','05','06','07'],
  ['08','09','10','11'],
  ['12','13','14','15','16','17','18','19'],
  ['20','21','22','23','24','25','26','27']
].map(numbers => numbers.map(number => `v14_${number}`));

const shapeOptions = {
  v14_01:['词典','词点','识典','词店'], v14_02:['最好','取好','最号','最后'],
  v14_03:['节','爷','印','却'], v14_04:['图书馆','图术馆','图书管','园书馆'],
  v14_05:['被','破','坡','皮'], v14_06:['名人','明人','民人','各人'],
  v14_07:['故事','古事','故是','做事'], v14_08:['然后','燃后','然候','虽后'],
  v14_09:['报纸','抱纸','报低','服纸'], v14_10:['忘记','忙记','忘纪','望记'],
  v14_11:['电子书','电字书','电子术','由子书'], v14_12:['女生','女人','好生','安生'],
  v14_13:['表演','麦演','表现','表滨'], v14_14:['节目','结目','节木','即目'],
  v14_15:['怎么办','怎样办','怎么为','什么办'], v14_16:['校长','较长','学校','校常'],
  v14_17:['面前','西前','面钱','前面'], v14_18:['有些','有此','友些','有点'],
  v14_19:['相信','想信','相心','香信'], v14_20:['新年','亲年','新生','今年'],
  v14_21:['班级','斑级','班极','年级'], v14_22:['跳','桃','逃','挑'],
  v14_23:['留学生','流学生','留学主','游学生'], v14_24:['最后','最候','醉后','后来'],
  v14_25:['一块儿','一快儿','一决儿','一会儿'], v14_26:['网站','网战','刚站','网点'],
  v14_27:['视频','视品','观频','视顺']
};

const grammarIndexes = [0,1,2,0];
const grammarLabels = ['被动句（1）','先……再/然后……','×什么（啊）','被动句（1）'];
const shapeMeaningOverrides = {v14_22:'身体离开地面的动作；本课也用于舞蹈'};

function activitySet(word, miniNumber) {
  const prefix = `l14_m${miniNumber}_${word.id}`;
  const result = [{
    id:`${prefix}_shape`, type:'shape', targetWordIds:[word.id],
    promptCn:'根据拼音和简单中文解释选择正确的汉字词。',
    promptEn:'Choose the correct Chinese form from the pinyin and simple Chinese meaning.',
    stimulus:`${word.pinyin}：${shapeMeaningOverrides[word.id] || word.meaningCn}`, answer:word.hanzi,
    acceptedAnswers:[word.hanzi], options:shapeOptions[word.id], promptMode:'form', evaluation:'automatic'
  }];
  if (word.tier === 'expression') {
    result.push({
      id:`${prefix}_input`, type:'input', targetWordIds:[word.id],
      promptCn:'根据简单中文意思输入词语。', promptEn:'Type the Chinese word from the simple Chinese meaning.',
      stimulus:word.meaningCn, answer:word.hanzi, acceptedAnswers:[word.hanzi], options:[],
      promptMode:'meaning', evaluation:'automatic'
    });
    result.push({
      id:`${prefix}_use`, type:'collocation', targetWordIds:[word.id],
      promptCn:`用“${word.phrases[0]}”完成表达，最多两句话。`,
      promptEn:'Use the phrase in one or two complete sentences.',
      stimulus:word.phrases[0], answer:word.example, acceptedAnswers:[], options:[],
      promptMode:'open_use', evaluation:'teacher'
    });
  }
  return result;
}

function build() {
  const formal = read(formalPath);
  const lesson = formal.data;
  if (lesson.meta?.lessonKey !== 'HSK3-L14') throw new Error('Unexpected formal lesson');
  if (lesson.texts?.length !== 4) throw new Error('L14 must have four texts');

  const questions = lesson.inClass.questionGroups;
  const taskCards = questions.t2_task_card;
  const paragraphs = questions.r4_paragraph_fill;
  const formalIds = new Set(taskCards.map(item => item.id));
  const paragraphIds = new Set(paragraphs.map(item => item.id));

  const practiceRoutes = miniDesigns.map((_, index) => ({
    module:'practice', submodule:'t2k', label:`任务卡：${taskCards[index].data.title}`,
    routeState:{ t2ki:index }
  }));
  const paragraphRoutes = miniDesigns.map((_, index) => ({
    label:`调用“${paragraphs[index].data.title}”段落填空`, module:'practice', submodule:'r4p', index
  }));

  const useGroups = miniDesigns.map((design, index) => {
    const task = taskCards[index];
    if (!formalIds.has(`l14_task_0${index + 1}`)) throw new Error(`Missing task ${index + 1}`);
    if (!paragraphIds.has(`l14_para_0${index + 1}`)) throw new Error(`Missing paragraph ${index + 1}`);
    return {
      ...design,
      responseMode:'teacherObservedWithTextOutline',
      exitRequirements:task.data.steps.map((label, stepIndex) => ({ id:`step_${stepIndex + 1}`, label })),
      supportCards:[
        {id:`t${index + 1}_words`,labelCn:'词汇提示',labelEn:'Word support',contentCn:task.data.keywords.join('、'),contentEn:''},
        {id:`t${index + 1}_order`,labelCn:'表达顺序',labelEn:'Organization support',contentCn:task.data.steps.join(' → '),contentEn:''}
      ],
      textId:lesson.texts[index].id,
      entry:{
        id:`l14_t${index + 1}_use_entry`, label:'起点表达', labelEn:'Starting expression',
        promptCn:design.entryPromptCn, promptEn:design.entryPromptEn,
        stimulus:{type:'image',image:design.image,labelCn:design.imageLabel,altCn:design.imageLabel,instructionCn:design.entryPromptCn,instructionEn:design.entryPromptEn}
      },
      exit:{
        id:`l14_t${index + 1}_use_exit`, label:'终点表达', labelEn:'Upgraded expression',
        promptCn:`${task.data.output} ${task.data.steps.join('；')}。`,
        promptEn:`Complete the ${task.data.title} task using the listed steps.`
      },
      linkedResources:{
        vocabulary:{module:'teach',submodule:'tv',label:`课文${index + 1}词汇`,vocabSession:String(index + 1)},
        grammar:{module:'teach',submodule:'tg',label:grammarLabels[index],grammarIndex:grammarIndexes[index]},
        text:{module:'teach',submodule:'tt',label:`课文${index + 1}`,textIndex:index},
        practice:practiceRoutes[index]
      },
      resourceLinks:[
        {id:task.id,status:'ready',purpose:task.data.title},
        {id:paragraphs[index].id,status:'ready',purpose:paragraphs[index].data.title}
      ]
    };
  });

  const grammarBridges = miniDesigns.map((_, index) => {
    const grammar = lesson.grammar[grammarIndexes[index]];
    return {
      evidence:grammar.examples[0].hanzi,
      focus:grammar.structure,
      actionLabel:`进入“${grammar.title}”`,
      grammarIndex:grammarIndexes[index]
    };
  });

  const textLearning = lesson.texts.map((text, index) => {
    const note = lesson.textTeachingNotes[text.id];
    return {
      textId:text.id,
      useGroupId:`T${index + 1}`,
      title:text.title,
      overviewChoices:note.overallChoices.map(item => ({
        id:item.id, focus:item.focus, questionCn:item.question, questionPinyin:item.pinyin,
        options:item.options.slice(), correctIndex:item.correctIndex
      })),
      detailMode:'config',
      detailQuestions:note.details.map(item => ({
        id:item.id, questionCn:item.question, questionPinyin:item.question_pinyin || item.pinyin,
        answer:item.answer, answerPinyin:item.answer_pinyin || item.answerPinyin,
        acceptedAnswers:item.acceptedAnswers.slice(), informationPoint:item.informationPoint
      })),
      grammarBridge:grammarBridges[index],
      paragraphPractice:paragraphRoutes[index],
      lifeTransfer:{promptCn:note.languageAndApplication.personalPrompt,promptEn:miniDesigns[index].goalEn}
    };
  });

  const vocabularyGroups = wordGroups.map((wordIds, index) => ({
    id:`T${index + 1}`, textIndex:index, title:miniDesigns[index].title,
    wordIds, recognitionWordIds:wordIds.slice(),
    activities:wordIds.flatMap(id => activitySet(lesson.vocabulary.find(word => word.id === id), index + 1))
  }));
  const allActivities = vocabularyGroups.flatMap(group => group.activities);
  const vocabularyCatalog = lesson.vocabulary.map(word => ({
    id:word.id, hanzi:word.hanzi, pinyin:word.pinyin, english:word.english,
    meaningCn:word.meaningCn, phrases:(word.phrases || []).slice(), example:word.example || '', tier:word.tier,
    allowedTypes:Array.from(new Set(['recognition', ...allActivities.filter(item => item.targetWordIds.includes(word.id)).map(item => item.type)]))
  }));

  return {
    schemaVersion:'classpro-use-profile/v3',
    experiment:{id:'l14-use-pilot-v1',title:'第14课·以用为主线升级版',lessonLabel:'第14课',sourceLesson:'HSK3-L14',scope:'四个课文MINI循环；保留L14原生词汇场景、渐进式语法、课文体裁和正式练习。'},
    sources:{lesson:{path:'../lessons/HSK3-L14.json',sha256:formal.sha256},teacher:{path:'../../in-class/teacher.html'},student:{path:'../../in-class/student.html'}},
    nativeTeaching:{preserveCourseStyles:true,grammar:{source:'formal_lesson',preserveExamples:true,preserveHighlights:true,preserveOralQuestions:true,preserveFollowUp:true},text:{source:'formal_lesson',preservePresentation:true,preserveDiary:true},vocabulary:{source:'formal_lesson',preserveScenes:true,preserveHotspots:true}},
    useGroups,
    textLearning,
    vocabularyTaskTypes:[{id:'recognition',labelCn:'认读',labelEn:'Recognition'},{id:'shape',labelCn:'辨形',labelEn:'Character form'},{id:'input',labelCn:'输入',labelEn:'Type the word'},{id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}],
    timerPolicy:{miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:4},vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2},autoClose:false},
    vocabularyCatalog,
    vocabularyGroups,
    resourceOverrides:[],
    supportOnlyStructures:[],
    evidencePolicy:{coreTypes:['entry_expression','actual_learning_path','exit_expression'],pathEvent:'opened',optionalSignals:['support_request','self_reflection','teacher_observation']},
    supportOptions:[{id:'vocabulary',labelCn:'我缺少合适的词',labelEn:'I need the right words'},{id:'organization',labelCn:'我不知道怎样组织信息',labelEn:'I need help organizing my ideas'},{id:'structure',labelCn:'我需要一个句子结构',labelEn:'I need a sentence frame'},{id:'teacher',labelCn:'我想获得老师的帮助',labelEn:'I want help from the teacher'}],
    feelingOptions:[{id:'clearer',labelCn:'我说得更清楚了',labelEn:'My expression is clearer'},{id:'more_complete',labelCn:'我说得更完整了',labelEn:'My expression is more complete'},{id:'more_natural',labelCn:'我说得更自然了',labelEn:'My expression is more natural'},{id:'still_need_help',labelCn:'我还需要帮助',labelEn:'I still need help'}],
    coreEvidence:['entry_expression','actual_learning_path','exit_expression'],
    capabilities:['select_text_mini_loop','launch_interaction','independent_answer','support_request','anonymous_return','open_support','reanswer','record_teacher_decision','compare_entry_exit','teacher_selected_vocabulary_focus','shared_countdown','native_course_resource_return','configured_task_stimulus']
  };
}

if (require.main === module) {
  fs.mkdirSync(path.dirname(outputPath), {recursive:true});
  fs.writeFileSync(outputPath, `${JSON.stringify(build(), null, 2)}\n`, 'utf8');
  console.log(`Built ${path.relative(root, outputPath)}`);
}

module.exports = {build, outputPath, formalPath};
