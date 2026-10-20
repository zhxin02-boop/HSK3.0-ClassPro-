const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L08.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L08-USE-PILOT-V1.json');

function read(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = filePath.endsWith('.json') ? JSON.parse(buffer.toString('utf8')) : null;
  return {
    sha256: crypto.createHash('sha256').update(data ? JSON.stringify(data) : buffer).digest('hex').toUpperCase(),
    data
  };
}

const taskDesigns = [
  {
    id: 'T1', textIndex: 0, icon: '🌱', label: '课文 1', title: '生活习惯：一个好习惯和一个坏习惯',
    goal: '分享一个好习惯和一个坏习惯，并在学习后补充频率、影响和以后的打算。',
    goalEn: 'Share one good habit and one bad habit, then add frequency, effects, and a future plan.',
    entry: {
      promptCn: '和大家分享你的生活习惯：一个好习惯，一个坏习惯。',
      promptEn: 'Share two habits with the class: one good habit and one bad habit.'
    },
    exit: {
      promptCn: '再分享一次你的两个习惯。说清楚你常做什么、有什么影响、以后想怎样做。',
      promptEn: 'Share the two habits again. Explain what you often do, its effect, and what you plan to do.'
    },
    supportCards: [
      { id: 't1_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '最近、常、习惯、健康、以后', contentEn: 'Choose only the words you need.' },
      { id: 't1_structure', labelCn: '表达结构', labelEn: 'Expression frame', contentCn: '我最近常……。这个习惯……。以后我想……。', contentEn: 'Use the frame with your own content.' },
      { id: 't1_grammar', labelCn: '“下去”提示', labelEn: 'Using 下去', contentCn: '动词 / 形容词 + 下去：已经开始，以后还会继续。', contentEn: 'An action or state has started and will continue.' }
    ]
  },
  {
    id: 'T2', textIndex: 1, icon: '💬', label: '课文 2', title: '朋友圈回复：朋友有点儿不舒服',
    goal: '自然地关心朋友、询问情况，并根据已经知道的信息给出合适回应。',
    goalEn: 'Show concern, ask what happened, and respond appropriately to what you know.',
    entry: {
      promptCn: '你今天刷微信的时候，看到好朋友的朋友圈写着：“我今天有点儿不舒服。”你会怎么回复他？',
      promptEn: 'Your friend posts, “I feel a little unwell today.” What would you reply?'
    },
    exit: {
      promptCn: '再写一条微信回复：先表示关心，再问一个问题，最后说说你建议他怎样做。',
      promptEn: 'Write the reply again: show concern, ask one question, and suggest what your friend can do.'
    },
    supportCards: [
      { id: 't2_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '不舒服、发烧、关心、注意、休息', contentEn: 'Choose only the words you need.' },
      { id: 't2_questions', labelCn: '追问提示', labelEn: 'Follow-up questions', contentCn: '你哪里不舒服？什么时候开始的？现在发烧吗？', contentEn: 'Ask before giving advice.' },
      { id: 't2_reply', labelCn: '回复结构', labelEn: 'Reply frame', contentCn: '听说你……，我很……。你……吗？如果……，就……。', contentEn: 'Keep the reply natural and personal.' }
    ]
  },
  {
    id: 'T3', textIndex: 2, icon: '🏥', label: '课文 3', title: '住院消息：怎样安慰并行动',
    goal: '回应朋友突然住院的消息，表达意外、担心、安慰和准备采取的行动。',
    goalEn: 'Respond to a friend’s hospital news with surprise, concern, comfort, and an action.',
    entry: {
      promptCn: '朋友突然发朋友圈说：“我住院了，别担心。”你会怎样回复？除了安慰，你还准备做什么？',
      promptEn: 'A friend posts, “I’m in hospital. Don’t worry.” How would you reply, and what would you do?'
    },
    exit: {
      promptCn: '再回复一次：说出你的第一反应、你的担心或安慰，以及你准备做的一件事。',
      promptEn: 'Reply again with your first reaction, concern or comfort, and one thing you plan to do.'
    },
    supportCards: [
      { id: 't3_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '突然、住院、担心、得、检查', contentEn: 'Choose only the words you need.' },
      { id: 't3_reply', labelCn: '回应结构', labelEn: 'Response frame', contentCn: '怎么突然……了？你现在……吗？别担心，我会……。', contentEn: 'Use the frame without copying a model answer.' },
      { id: 't3_action', labelCn: '行动提示', labelEn: 'Action ideas', contentCn: '去看他、打电话、问清情况、帮他带东西', contentEn: 'Choose an action that fits your relationship.' }
    ]
  },
  {
    id: 'T4', textIndex: 3, icon: '📱', label: '课文 4', title: '出院提醒：把医嘱说清楚',
    goal: '从医生的话中选择并重组重要信息，写成一条适合发给家人的清楚提醒。',
    goalEn: 'Select and reorganize the doctor’s information into a clear message for a family member.',
    contextCn: '医生说：“回家以后要注意休息。这里有三种药：这种每天睡前吃一次，其他两种每天吃三次，饭后吃。最近不要运动太多。如果腿还疼，就回来检查。”',
    contextEn: 'The doctor explains when to take three medicines, to rest, avoid too much exercise, and return if the leg still hurts.',
    entry: {
      promptCn: '爷爷或奶奶出院了。请把医生的话变成一条清楚的微信提醒，让他知道什么时候吃药，还要注意什么。',
      promptEn: 'Turn the doctor’s words into a clear WeChat reminder for your grandparent.'
    },
    exit: {
      promptCn: '再写一次提醒：分清一种药和其他两种药的时间、次数，再补充休息、运动和复查提醒。',
      promptEn: 'Rewrite the reminder with medicine times and frequency, plus rest, exercise, and follow-up information.'
    },
    supportCards: [
      { id: 't4_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '出院、种、方法、其他、睡前、饭后、检查', contentEn: 'Choose only the words you need.' },
      { id: 't4_order', labelCn: '信息顺序', labelEn: 'Information order', contentCn: '先说一种药 → 再说其他两种药 → 最后说休息、运动和复查。', contentEn: 'Organize the information before writing.' },
      { id: 't4_message', labelCn: '家人提醒', labelEn: 'Family reminder', contentCn: '别忘了……。还要注意……。如果……，就……。', contentEn: 'Write naturally to a family member.' }
    ]
  }
];

const overviewSets = [
  [
    ['这段对话主要说什么？', ['运动', '生病', '吃药'], 0],
    ['陈天中现在怎么样？', ['开始运动了', '已经住院了', '正在吃药'], 0],
    ['李文愿意帮陈天中吗？', ['愿意', '不愿意', '不知道'], 0]
  ],
  [
    ['这段对话主要说什么？', ['朋友不舒服', '一起运动', '出院吃药'], 0],
    ['安妮先做什么？', ['问他怎么了', '请他打球', '给他吃药'], 0],
    ['最后他们怎么做？', ['先休息，有问题再看医生', '马上去运动', '马上出院'], 0]
  ],
  [
    ['这段对话主要说什么？', ['朋友住院了', '朋友开始运动', '朋友出院了'], 0],
    ['安妮知道以后怎么样？', ['很担心', '很高兴', '不想管'], 0],
    ['安妮对朋友说什么？', ['好好休息', '多运动', '少吃药'], 0]
  ],
  [
    ['这篇短文主要说什么？', ['出院后的安排', '一次运动', '朋友住院'], 0],
    ['陈天中回家以后要做什么？', ['按医生说的做', '去打球', '去看朋友'], 0],
    ['陈天中写这段话，主要是为了什么？', ['记住出院后的事', '邀请朋友来医院', '介绍体育馆'], 0]
  ]
];

const grammarBridges = [
  ['不能再胖下去了。', '动词 / 形容词 + 下去：已经开始的动作或状态继续。', '进入“下去”语法'],
  ['游完泳以后，耳朵一直有点儿疼。', '离合词加补语：补语通常放在两个语素之间。', '进入离合词语法'],
  ['他上次来医院到现在差不多两年了。', '时量补语：说明动作完成以后到现在经过的时间。', '进入时量补语语法'],
  ['一种药每天睡前吃一次，其他几种每天饭后吃三次。', '“以前／以后”和“前／后”：组织时间与安排。', '进入时间表达语法']
];

const paragraphLabels = ['新的运动习惯', '身体不舒服', '住院以后', '出院安排'];
const lifeTransfers = [
  ['你生活中有什么好习惯和坏习惯？请选择一个说说它的影响。', 'What good and bad habits do you have? Choose one and explain its effect.'],
  ['朋友说不舒服时，你会先问什么，再怎样表示关心？', 'When a friend feels unwell, what would you ask before responding?'],
  ['朋友突然住院时，怎样安慰才自然？你会采取什么行动？', 'How can you comfort a hospitalized friend naturally, and what would you do?'],
  ['怎样把复杂的安排变成家人容易看懂的微信提醒？', 'How can you turn complex instructions into a clear family message?']
];

const vocabularyTiers = {
  v08_01: 'expression', v08_02: 'expression', v08_03: 'understanding', v08_04: 'expression',
  v08_05: 'understanding', v08_06: 'expression', v08_07: 'expression', v08_08: 'context',
  v08_09: 'understanding', v08_10: 'understanding', v08_11: 'expression', v08_12: 'context',
  v08_13: 'expression', v08_14: 'expression', v08_15: 'expression', v08_16: 'expression',
  v08_17: 'expression', v08_18: 'understanding', v08_19: 'context', v08_20: 'understanding',
  v08_21: 'expression', v08_22: 'understanding', v08_23: 'expression', v08_24: 'understanding',
  v08_25: 'expression', v08_26: 'expression', v08_27: 'expression', v08_28: 'context'
};

const shapeOptions = {
  v08_01: ['最近', '最进', '取近', '最斤'], v08_02: ['常', '长', '尝', '裳'],
  v08_04: ['习惯', '习贯', '夕惯', '习观'], v08_06: ['健康', '建康', '健慷', '建抗'],
  v08_07: ['以后', '已后', '以候', '己后'], v08_11: ['发烧', '发浇', '法烧', '发绕'],
  v08_13: ['关心', '观心', '关新', '官心'], v08_14: ['注意', '住意', '注义', '主意'],
  v08_15: ['突然', '突燃', '图然', '突如'], v08_16: ['住院', '注院', '往院', '祝院'],
  v08_17: ['担心', '但心', '胆心', '单心'], v08_21: ['得', '的', '地', '德'],
  v08_23: ['出院', '初院', '除院', '出原'], v08_25: ['种', '中', '钟', '重'],
  v08_26: ['方法', '方发', '放法', '仿法'], v08_27: ['其他', '其地', '期他', '其也']
};

const collocationOptions = {
  v08_01: ['最近几天', '最近羽毛球', '最近一种', '最近耳朵'],
  v08_02: ['常去体育馆', '常一个小时', '常三种药', '常的方法'],
  v08_04: ['养成习惯', '打开习惯', '一种习惯地', '习惯三次'],
  v08_06: ['健康习惯', '健康一种', '健康耳朵地', '健康三次'],
  v08_07: ['下课以后', '以后体育馆地', '以后一次药', '以后突然地'],
  v08_11: ['发低烧', '做发烧', '一种发烧', '发烧方法'],
  v08_13: ['关心朋友', '吃关心', '关心三次', '一种关心'],
  v08_14: ['注意休息', '做注意', '注意一种', '三次注意'],
  v08_15: ['突然住院', '一种突然', '吃突然', '突然方法'],
  v08_16: ['住院检查', '吃住院', '住院一种', '三次住院'],
  v08_17: ['担心朋友', '吃担心', '担心一种', '三次担心'],
  v08_21: ['得休息', '一种得', '得三次药', '很得方法'],
  v08_23: ['出院以后', '吃出院', '出院一种', '三次出院'],
  v08_25: ['三种药', '三种休息', '种三次地', '一种以后'],
  v08_26: ['吃药的方法', '方法三次地', '一种方法药', '方法出院了'],
  v08_27: ['其他两种药', '其他睡前地', '其他三次吃', '其他出院了']
};

function build() {
  const formal = read(formalPath);
  const lesson = formal.data;
  if (!lesson.meta || lesson.meta.lessonKey !== 'HSK3-L08') throw new Error('Unexpected formal lesson');
  if (!Array.isArray(lesson.texts) || lesson.texts.length !== 4) throw new Error('L8 must have four texts');

  const useGroups = taskDesigns.map(design => {
    const text = lesson.texts[design.textIndex];
    return {
      ...design,
      textId: text.id,
      entry: { id: `l08_${design.id.toLowerCase()}_use_entry`, label: '起点表达', labelEn: 'Starting expression', ...design.entry },
      exit: { id: `l08_${design.id.toLowerCase()}_use_exit`, label: '终点表达', labelEn: 'Upgraded expression', ...design.exit },
      linkedResources: {
        vocabulary: { module: 'teach', submodule: 'tv', label: `课文${design.textIndex + 1}词汇`, vocabSession: String(design.textIndex + 1) },
        grammar: { module: 'teach', submodule: 'tg', label: `课文${design.textIndex + 1}语法`, grammarIndex: design.textIndex },
        text: { module: 'teach', submodule: 'tt', label: `课文${design.textIndex + 1}`, textIndex: design.textIndex },
        practice: { module: 'practice', submodule: 'v5', label: '教师选题练习' }
      }
    };
  });

  const textLearning = lesson.texts.map((text, textIndex) => {
    const notes = lesson.textTeachingNotes[text.id];
    const group = useGroups[textIndex];
    if (!notes) throw new Error(`Missing teaching notes for ${text.id}`);
    return {
      textId: text.id,
      useGroupId: group.id,
      title: text.title,
      overviewChoices: overviewSets[textIndex].map((item, index) => ({
        id: `l08_t${textIndex + 1}_overview_${String(index + 1).padStart(2, '0')}`,
        focus: ['main_idea', 'development', 'purpose'][index],
        questionCn: item[0], options: item[1], correctIndex: item[2]
      })),
      detailQuestions: notes.classQuestions.map((item, index) => ({
        id: `l08_t${textIndex + 1}_detail_${String(index + 1).padStart(2, '0')}`,
        questionCn: item.question,
        questionPinyin: item.question_pinyin,
        answer: item.answer,
        answerPinyin: item.answer_pinyin
      })),
      grammarBridge: {
        evidence: grammarBridges[textIndex][0],
        focus: grammarBridges[textIndex][1],
        actionLabel: grammarBridges[textIndex][2],
        grammarIndex: textIndex
      },
      paragraphPractice: {
        label: `调用“${paragraphLabels[textIndex]}”段落填空`,
        module: 'practice', submodule: 'r4p', index: textIndex
      },
      lifeTransfer: { promptCn: lifeTransfers[textIndex][0], promptEn: lifeTransfers[textIndex][1] }
    };
  });

  const vocabularyGroups = taskDesigns.map((design, groupIndex) => {
    const ranges = [[0, 8], [8, 14], [14, 22], [22, 28]];
    const [start, end] = ranges[groupIndex];
    return {
      id: design.id,
      textIndex: design.textIndex,
      title: design.title,
      words: lesson.vocabulary.slice(start, end).map(word => {
        const tier = vocabularyTiers[word.id];
        const allowedTypes = ['recognition'];
        if (shapeOptions[word.id]) allowedTypes.push('shape');
        if (tier === 'expression') allowedTypes.push('input');
        if (collocationOptions[word.id]) allowedTypes.push('collocation');
        return {
          id: word.id, hanzi: word.hanzi, pinyin: word.pinyin, english: word.english,
          phrases: word.phrases || [], example: word.example || '', tier, allowedTypes,
          shapeOptions: shapeOptions[word.id] || [],
          collocationOptions: collocationOptions[word.id] || []
        };
      })
    };
  });

  return {
    schemaVersion: 'classpro-use-pilot/v2',
    experiment: {
      id: 'l08-use-pilot-v1',
      title: '第8课·以用为主线实验版',
      sourceLesson: 'HSK3-L08',
      scope: '验证四篇课文的独立MINI循环与教师确认后的词形巩固；不将路径固定为全局流程。'
    },
    sources: {
      lesson: { path: '../lessons/HSK3-L08.json', sha256: formal.sha256 },
      teacher: { path: '../../in-class/teacher.html' },
      student: { path: '../../in-class/student.html' }
    },
    useGroups,
    textLearning,
    vocabularyTaskTypes: [
      { id: 'recognition', labelCn: '认读', labelEn: 'Recognition' },
      { id: 'shape', labelCn: '辨形', labelEn: 'Character form' },
      { id: 'input', labelCn: '输入', labelEn: 'Type the word' },
      { id: 'collocation', labelCn: '搭配', labelEn: 'Collocation' }
    ],
    vocabularyGroups,
    supportOptions: [
      { id: 'vocabulary', labelCn: '我缺少合适的词', labelEn: 'I need the right words' },
      { id: 'organization', labelCn: '我不知道怎样组织信息', labelEn: 'I need help organizing my ideas' },
      { id: 'structure', labelCn: '我需要一个句子结构', labelEn: 'I need a sentence frame' },
      { id: 'teacher', labelCn: '我想获得老师的帮助', labelEn: 'I want help from the teacher' }
    ],
    feelingOptions: [
      { id: 'clearer', labelCn: '我说得更清楚了', labelEn: 'My expression is clearer' },
      { id: 'more_complete', labelCn: '我说得更完整了', labelEn: 'My expression is more complete' },
      { id: 'more_natural', labelCn: '我说得更自然了', labelEn: 'My expression is more natural' },
      { id: 'still_need_help', labelCn: '我还需要帮助', labelEn: 'I still need help' }
    ],
    coreEvidence: ['entry_expression', 'actual_learning_path', 'exit_expression'],
    capabilities: [
      'select_text_mini_loop', 'launch_interaction', 'independent_answer', 'support_request',
      'anonymous_return', 'open_support', 'reanswer', 'record_teacher_decision',
      'compare_entry_exit', 'teacher_selected_vocabulary_focus'
    ]
  };
}

if (require.main === module) {
  fs.writeFileSync(outputPath, `${JSON.stringify(build(), null, 2)}\n`, 'utf8');
  console.log(`Built ${path.relative(root, outputPath)}`);
}

module.exports = { build, outputPath };
