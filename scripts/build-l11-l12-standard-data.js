const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "source", "data-model", "lessons");
const imageBase = "images/vocab";

function id(lesson, n) {
  return `v_l${lesson}_${String(n).padStart(2, "0")}`;
}

function vocab(lesson, rows) {
  return rows.map((x, i) => ({
    id: id(lesson, i + 1),
    hanzi: x[0],
    word: x[0],
    pinyin: x[1],
    pos: x[2],
    english: x[3],
    sourceType: "textbook",
    tags: [`L${lesson}`],
    category: x[4] || "general",
    ...(x[5] ? { image: `${imageBase}/hsk1-l${lesson}/${x[5]}` } : {})
  }));
}

function textLine(x, i) {
  return { order: i + 1, speaker: x[0], hanzi: x[1], pinyin: x[2], english: x[3], sourceType: "textbook" };
}

function text(id, title, setting, lines) {
  return { id, title, setting, sourceType: "textbook", lines: lines.map(textLine) };
}

function pinyinFor(options, map) {
  return options.map((x) => map[x] || "");
}

function imageGuess(lesson, items) {
  return items.map((x, i) => ({
    id: `v1_l${lesson}_${i + 1}`,
    type: "image_guess",
    stage: "in_class",
    prompt_cn: "图片猜词。",
    prompt_en: "Choose the best answer.",
    data: {
      image: `${imageBase}/hsk1-l${lesson}/${x.image}`,
      image_hint: x.answer,
      options: x.options,
      correct_index: x.options.indexOf(x.answer)
    },
    correct_answer: x.answer,
    kp: x.answer,
    sourceType: "textbook"
  }));
}

function fill(lesson, items, py) {
  return items.map((x, i) => ({
    id: `v5_l${lesson}_${i + 1}`,
    type: "vocab_fill",
    stage: "in_class",
    prompt_cn: "选词填空。",
    prompt_en: "Choose the best answer.",
    data: {
      sentence: x.sentence,
      sentence_pinyin: x.sentencePinyin,
      options: x.options,
      options_pinyin: pinyinFor(x.options, py),
      correct_index: x.options.indexOf(x.answer)
    },
    correct_answer: x.answer,
    kp: x.kp || x.answer,
    sourceType: x.sourceType || "teaching_extension"
  }));
}

function phrasePinyin(text, py) {
  let out = String(text || "");
  const map = Object.assign({
    "我": "wǒ", "你": "nǐ", "他": "tā", "她": "tā", "谁": "shéi", "什么": "shénme", "哪里": "nǎli", "哪儿": "nǎr",
    "是": "shì", "的": "de", "了": "le", "呢": "ne", "吗": "ma", "没": "méi", "不": "bù", "在": "zài", "还": "hái",
    "有": "yǒu", "没有": "méiyǒu", "对": "duì", "非常": "fēicháng", "今天": "jīntiān", "昨天": "zuótiān",
    "去": "qù", "来": "lái", "到": "dào", "能": "néng", "做": "zuò", "玩": "wán", "和": "hé", "后": "hòu",
    "超市": "chāoshì", "后边": "hòubian", "医院": "yīyuàn", "医生": "yīshēng", "上班": "shàngbān",
    "怎么样": "zěnmeyàng", "怎么": "zěnme", "有点儿": "yǒudiǎnr", "一点儿": "yìdiǎnr", "太": "tài", "些": "xiē", "热水": "rè shuǐ"
  }, py || {});
  Object.keys(map).sort((a, b) => b.length - a.length).forEach((k) => {
    out = out.split(k).join(` ${map[k]} `);
  });
  return out.replace(/[，。？！,.?!：:；;]/g, " ").replace(/\s+/g, " ").trim();
}

function wordMatch(lesson, base, prefix, prompt, py) {
  return base.map((pairs, i) => ({
    id: `${prefix}_l${lesson}_${i + 1}`,
    type: "word_match",
    stage: "in_class",
    prompt_cn: prompt,
    prompt_en: "Match each question with the best answer.",
    data: { pairs: pairs.map(([left, right, leftPinyin, rightPinyin]) => ({ left, right, left_pinyin: leftPinyin || phrasePinyin(left, py), right_pinyin: rightPinyin || phrasePinyin(right, py) })) },
    correct_answer: "全部配对正确",
    sourceType: "teaching_extension"
  }));
}

function transform(lesson, items) {
  return items.map((x, i) => ({
    id: `v4_l${lesson}_${i + 1}`,
    type: "sentence_transform",
    stage: "in_class",
    prompt_cn: "选择正确的问句。",
    prompt_en: "Choose the best answer.",
    data: {
      source_sentence: x.source,
      source_pinyin: x.sourcePinyin,
      options_pinyin: x.optionsPinyin,
      options: x.options,
      correct_index: x.options.indexOf(x.answer)
    },
    correct_answer: x.answer,
    kp: "句型转换：给答句选问句",
    sourceType: "teaching_extension"
  }));
}

function ordering(lesson, items) {
  return items.map((x, i) => ({
    id: `g1_l${lesson}_${i + 1}`,
    type: "ordering",
    stage: "in_class",
    prompt_cn: "连词成句。",
    prompt_en: "Put the chunks in order.",
    data: { chunks: x.chunks, chunks_pinyin: x.chunksPinyin },
    correct_answer: x.answer,
    acceptable_answers: [x.answer, `${x.answer}。`, `${x.answer}？`],
    sourceType: "teaching_extension"
  }));
}

function translation(lesson, items) {
  return items.map((x, i) => ({
    id: `trc_l${lesson}_${i + 1}`,
    type: "translation_choice",
    stage: "in_class",
    prompt_cn: "根据英文和俄文选择中文句子。",
    prompt_en: `${x.en} / ${x.ru}`,
    data: {
      question_en: x.en,
      question_ru: x.ru,
      options: x.options,
      correct_index: x.options.indexOf(x.answer)
    },
    correct_answer: x.answer,
    kp: "译文选句",
    sourceType: x.sourceType || "textbook"
  }));
}

function textQa(lesson, groups) {
  return groups.map((g, i) => ({
    id: `ttq_l${lesson}_${i + 1}`,
    type: "text_qa_group",
    stage: "in_class",
    prompt_cn: "课文问答：根据课文内容回答。",
    prompt_en: "Text Q&A: answer from the dialogue.",
    data: {
      title: g.title,
      passage: g.passage,
      passage_pinyin: g.passagePinyin,
      questions: g.questions.map((q) => ({
        question_cn: q.question,
        question_pinyin: q.questionPinyin,
        answer: q.answer,
        answer_pinyin: q.answerPinyin,
        options: q.options,
        correct_index: q.options.indexOf(q.answer)
      }))
    },
    correct_answer: "见每题答案",
    sourceType: "textbook"
  }));
}

function pictureTalk(lesson, items) {
  return items.map((x, i) => ({
    id: `r4_l${lesson}_pt_${String(i + 1).padStart(2, "0")}`,
    type: "oral",
    stage: "in_class",
    prompt_cn: x.question,
    prompt_en: x.promptEn || "Answer in Chinese.",
    data: {
      question: x.question,
      question_pinyin: x.questionPinyin,
      instructions: "请用中文回答这个问题。",
      context: "教学扩展",
      image: `${imageBase}/hsk1-l${lesson}/${x.image}`,
      sampleAnswer: x.sampleAnswer,
      sampleAnswerPinyin: x.sampleAnswerPinyin,
      patternType: x.patternType
    },
    openEnded: true,
    needsTeacherReview: true,
    cloudWall: true,
    weakPoints: `输出：${x.patternType}`,
    sourceType: "teaching_extension"
  }));
}

function hanzi(chars) {
  return chars.split("").map((char) => ({ char, sourceType: "textbook" }));
}

function hanziRecognition(groups) {
  return {
    enabled: true,
    showPinyin: false,
    rounds: [
      { id: "hanzi_to_pinyin", title: "看汉字选拼音", titleEn: "Choose pinyin" },
      { id: "hanzi_to_meaning", title: "看汉字选意思", titleEn: "Choose meaning" },
      { id: "meaning_to_hanzi", title: "看意思选汉字", titleEn: "Choose character" }
    ],
    groups
  };
}

function grammar(lesson, rows) {
  return rows.map((g, i) => ({
    id: `g_l${lesson}_${String(i + 1).padStart(2, "0")}`,
    title: g.title,
    titleEn: g.titleEn,
    structure: g.structure,
    explanation: g.explanation,
    examples: g.examples.map((e) => ({ hanzi: e[0], pinyin: e[1], english: e[2], sourceType: e[3] || "teaching_extension" }))
  }));
}

function lessonData(c) {
  const voc = vocab(c.lesson, c.vocabRows);
  const gr = grammar(c.lesson, c.grammarRows);
  function rowsFor(v) {
    const rows = (c.examples[v.word] || []).slice(0, 3);
    while (rows.length < 2) rows.push([`${v.word}呢`, `${v.pinyin} ne`, `${v.english} phrase`]);
    if (rows.length < 3) rows.push([`我会说“${v.word}”。`, `Wǒ huì shuō "${v.pinyin}".`, `I can say "${v.word}".`]);
    return rows.slice(0, 3);
  }
  const vocabExtensions = Object.fromEntries(voc.map((v) => [v.id, {
    word: v.word,
    examples: rowsFor(v).map((e) => ({ hanzi: e[0], pinyin: e[1], english: e[2], sourceType: "teaching_extension" })),
    collocations: rowsFor(v).map((e) => ({ hanzi: e[0], pinyin: e[1], english: e[2], sourceType: "teaching_extension" }))
  }]));
  const grammarTeachingNotes = Object.fromEntries(gr.map((g, i) => [g.id, {
    title: g.title,
    titleEn: g.titleEn,
    structure: g.structure,
    structureEn: c.grammarRows[i].structureEn,
    structureRu: c.grammarRows[i].structureRu,
    english: c.grammarRows[i].english,
    russian: c.grammarRows[i].russian,
    formula: { pattern: g.structure, patternEn: c.grammarRows[i].structureEn, patternRu: c.grammarRows[i].structureRu },
    examples: g.examples
  }]));
  const v1 = imageGuess(c.lesson, c.imageGuess);
  const v5 = fill(c.lesson, c.fill, c.py);
  const v7 = wordMatch(c.lesson, c.wordMatch, "v7", "词句匹配。", c.py);
  const v8 = wordMatch(c.lesson, c.memoryMatch, "v8", "词了个词。", c.py);
  const v4 = transform(c.lesson, c.transform);
  const g1 = ordering(c.lesson, c.ordering);
  const r3 = translation(c.lesson, c.translation);
  const r2 = textQa(c.lesson, c.textQa);
  const r4 = pictureTalk(c.lesson, c.pictureTalk);
  return {
    schemaVersion: "1.0.0",
    meta: {
      level: "HSK1",
      lessonId: `L${c.lesson}`,
      lessonKey: `HSK1-L${c.lesson}`,
      title: c.title,
      titleEn: c.titleEn,
      topic: c.topic,
      sourceTextPolicy: "保留教材原句；新增内容标记为教学扩展",
      dataQualityNotes: [`根据 textbook data/L${c.lesson}.txt 生成；L${c.lesson} 课文原句完整保留。`, "已按 L10 当前结构重制：课前 10 题、课中题型题量、汉字练习与英俄译文选句字段对齐。"]
    },
    features: { pinyin: true, hanziWritingDemo: true, vocabExamples: true, competition: true, postClassHomework: true },
    vocabulary: voc,
    grammar: gr,
    texts: c.texts,
    vocabExtensions,
    grammarTeachingNotes,
    preClass: { warmup: c.warmup, questions: c.preQuestions },
    inClass: { questionGroups: {
      v1_image_guess: v1,
      v5_vocab_fill: v5,
      v7_word_match: v7,
      v8_memory_match: v8,
      v4_complete_sentence: v4,
      g1_ordering: g1,
      r3_translation_choice: r3,
      r2_passage_choice: r2,
      r4_picture_talk: r4
    }},
    classProQuestions: { pictureGuess: v1, vocabFill: v5, wordMatch: v7, matchingGame: v8, sentenceTransform: v4, ordering: g1, translationChoice: r3, textQa: r2 },
    hanziWriting: { characters: hanzi(c.hanziChars) },
    hanziRecognition: hanziRecognition(c.hanziGroups),
    postClassHomework: c.postClassHomework,
    report: { focus: c.reportFocus }
  };
}

const l11Texts = [
  text("t_l11_01", "课文一：找饭店", "李文在找饭店，王一飞给他打电话。", [
    ["王一飞", "喂，李文，你什么时候能到饭店？", "Wèi, Lǐ Wén, nǐ shénme shíhou néng dào fàndiàn?", "Hello, Li Wen. When can you get to the restaurant?"],
    ["李文", "还不知道，正在找呢。它是不是在超市后边？", "Hái bù zhīdào, zhèngzài zhǎo ne. Tā shì bu shì zài chāoshì hòubian?", "I don't know yet. I'm looking for it. Is it behind the supermarket?"],
    ["王一飞", "是的。你开车没开车？", "Shì de. Nǐ kāichē méi kāichē?", "Yes. Are you driving or not?"],
    ["李文", "我没开车，坐车呢。", "Wǒ méi kāichē, zuò chē ne.", "I'm not driving. I'm taking a car."]
  ]),
  text("t_l11_02", "课文二：读大学", "王一飞和李文在饭店聊天儿。", [
    ["王一飞", "你还在读大学吗？", "Nǐ hái zài dú dàxué ma?", "Are you still studying at university?"],
    ["李文", "对，我读大学呢，还是大学生。", "Duì, wǒ dú dàxué ne, hái shì dàxuéshēng.", "Yes, I'm studying at university, and I'm still a university student."],
    ["王一飞", "你们学习忙不忙？", "Nǐmen xuéxí máng bu máng?", "Are your studies busy?"],
    ["李文", "非常忙，我学医，我们的课很多。", "Fēicháng máng, wǒ xué yī, wǒmen de kè hěn duō.", "Very busy. I study medicine, and we have many classes."]
  ]),
  text("t_l11_03", "课文三：还在睡觉", "星期六早上，刘明出门前和女儿对话。", [
    ["刘明", "弟弟起床没起床呢？", "Dìdi qǐchuáng méi qǐchuáng ne?", "Has your younger brother gotten up?"],
    ["刘小雪", "没起床呢，还在睡觉。", "Méi qǐchuáng ne, hái zài shuìjiào.", "No, he is still sleeping."],
    ["刘明", "还睡觉呢？他今天去不去那里？", "Hái shuìjiào ne? Tā jīntiān qù bu qù nàli?", "Still sleeping? Is he going there today?"],
    ["刘小雪", "去哪里？", "Qù nǎli?", "Where?"],
    ["刘明", "去超市。", "Qù chāoshì.", "To the supermarket."],
    ["刘小雪", "我昨天问他，他对我说，他不去，他今天要和小朋友玩。", "Wǒ zuótiān wèn tā, tā duì wǒ shuō, tā bú qù, tā jīntiān yào hé xiǎopéngyǒu wán.", "I asked him yesterday. He told me he isn't going. Today he is going to play with kids."]
  ])
];

const L11 = lessonData({
  lesson: "11",
  title: "我读大学呢",
  titleEn: "I'm studying at university",
  topic: "表达正在做的事、正反问句、能愿动词“要”",
  vocabRows: [
    ["时候", "shíhou", "名词", "time", "time", "v01_shihou.png"],
    ["饭店", "fàndiàn", "名词", "restaurant", "place", "v02_fandian.png"],
    ["知道", "zhīdào", "动词", "know", "action", "v03_zhidao.png"],
    ["正在", "zhèngzài", "副词", "in the process of", "grammar", "v04_zhengzai.png"],
    ["找", "zhǎo", "动词", "look for", "action", "v05_zhao.png"],
    ["开车", "kāichē", "动词", "drive", "action", "v06_kaiche.png"],
    ["车", "chē", "名词", "vehicle", "thing", "v07_che.png"],
    ["在", "zài", "副词", "indicating ongoing action", "grammar", "v08_zai.png"],
    ["读", "dú", "动词", "study; attend school", "action", "v09_du.png"],
    ["大学", "dàxué", "名词", "university", "place", "v10_daxue.png"],
    ["大学生", "dàxuéshēng", "名词", "university student", "person", "v11_daxuesheng.png"],
    ["学", "xué", "动词", "study; learn", "action", "v12_xue.png"],
    ["医", "yī", "名词", "medicine", "study", "v13_yi.png"],
    ["弟弟", "dìdi", "名词", "younger brother", "person", "v14_didi.png"],
    ["起床", "qǐchuáng", "动词", "get up", "action", "v15_qichuang.png"],
    ["睡觉", "shuìjiào", "动词", "sleep", "action", "v16_shuijiao.png"],
    ["那里", "nàli", "代词", "there", "place", "v17_nali.png"],
    ["哪里", "nǎli", "代词", "where", "place", "v18_nali_question.png"],
    ["昨天", "zuótiān", "名词", "yesterday", "time", "v19_zuotian.png"],
    ["问", "wèn", "动词", "ask", "action", "v20_wen.png"],
    ["说", "shuō", "动词", "say", "action", "v21_shuo.png"],
    ["要", "yào", "能愿动词", "want; be going to", "grammar", "v22_yao.png"],
    ["小朋友", "xiǎopéngyǒu", "名词", "child; kid", "person", "v23_xiaopengyou.png"]
  ],
  py: { 时候:"shíhou", 饭店:"fàndiàn", 知道:"zhīdào", 正在:"zhèngzài", 找:"zhǎo", 开车:"kāichē", 车:"chē", 在:"zài", 读:"dú", 大学:"dàxué", 大学生:"dàxuéshēng", 学:"xué", 医:"yī", 弟弟:"dìdi", 起床:"qǐchuáng", 睡觉:"shuìjiào", 那里:"nàli", 哪里:"nǎli", 昨天:"zuótiān", 问:"wèn", 说:"shuō", 要:"yào", 小朋友:"xiǎopéngyǒu", 没:"méi", 不:"bù", 坐:"zuò", 忙:"máng", 李文:"Lǐ Wén", 课程:"kèchéng", 很多:"hěn duō" },
  examples: {
    时候:[["什么时候","shénme shíhou","when"],["这个时候","zhège shíhou","at this time"],["你什么时候到饭店？","Nǐ shénme shíhou dào fàndiàn?","When will you arrive at the restaurant?"]],
    饭店:[["到饭店","dào fàndiàn","arrive at the restaurant"],["找饭店","zhǎo fàndiàn","look for a restaurant"],["李文正在找饭店。","Lǐ Wén zhèngzài zhǎo fàndiàn.","Li Wen is looking for a restaurant."]],
    知道:[["不知道","bù zhīdào","do not know"],["还不知道","hái bù zhīdào","still do not know"],["我还不知道。","Wǒ hái bù zhīdào.","I still do not know."]],
    正在:[["正在找","zhèngzài zhǎo","looking for"],["正在睡觉","zhèngzài shuìjiào","sleeping"],["他正在找饭店。","Tā zhèngzài zhǎo fàndiàn.","He is looking for a restaurant."]],
    找:[["找饭店","zhǎo fàndiàn","look for a restaurant"],["找车","zhǎo chē","look for a car"],["我正在找饭店。","Wǒ zhèngzài zhǎo fàndiàn.","I am looking for a restaurant."]],
    开车:[["开车去","kāichē qù","drive there"],["没开车","méi kāichē","did not drive"],["你开车没开车？","Nǐ kāichē méi kāichē?","Are you driving or not?"]],
    车:[["坐车","zuò chē","take a car"],["开车","kāichē","drive"],["我没开车，坐车呢。","Wǒ méi kāichē, zuò chē ne.","I did not drive; I am taking a car."]],
    在:[["在找","zài zhǎo","be looking for"],["在睡觉","zài shuìjiào","be sleeping"],["他还在睡觉。","Tā hái zài shuìjiào.","He is still sleeping."]],
    读:[["读大学","dú dàxué","study at university"],["读书","dú shū","read; study"],["我读大学呢。","Wǒ dú dàxué ne.","I am studying at university."]],
    大学:[["读大学","dú dàxué","study at university"],["在大学","zài dàxué","at university"],["他在大学学习。","Tā zài dàxué xuéxí.","He studies at university."]],
    大学生:[["一个大学生","yí ge dàxuéshēng","a university student"],["还是大学生","hái shì dàxuéshēng","still a university student"],["他还是大学生。","Tā hái shì dàxuéshēng.","He is still a university student."]],
    学:[["学中文","xué Zhōngwén","study Chinese"],["学医","xué yī","study medicine"],["我学医。","Wǒ xué yī.","I study medicine."]],
    医:[["学医","xué yī","study medicine"],["医学生","yīxuéshēng","medical student"],["我在大学学医。","Wǒ zài dàxué xué yī.","I study medicine at university."]],
    弟弟:[["我弟弟","wǒ dìdi","my younger brother"],["弟弟起床","dìdi qǐchuáng","younger brother gets up"],["弟弟还在睡觉。","Dìdi hái zài shuìjiào.","My younger brother is still sleeping."]],
    起床:[["起床了","qǐchuáng le","got up"],["没起床","méi qǐchuáng","has not gotten up"],["弟弟起床了吗？","Dìdi qǐchuáng le ma?","Has your younger brother gotten up?"]],
    睡觉:[["在睡觉","zài shuìjiào","be sleeping"],["还睡觉","hái shuìjiào","still sleep"],["他还在睡觉。","Tā hái zài shuìjiào.","He is still sleeping."]],
    那里:[["去那里","qù nàli","go there"],["在那里","zài nàli","be there"],["他今天去不去那里？","Tā jīntiān qù bu qù nàli?","Is he going there today?"]],
    哪里:[["去哪里","qù nǎli","go where"],["在哪里","zài nǎli","be where"],["你要去哪里？","Nǐ yào qù nǎli?","Where are you going?"]],
    昨天:[["昨天问他","zuótiān wèn tā","asked him yesterday"],["昨天晚上","zuótiān wǎnshang","yesterday evening"],["我昨天问他。","Wǒ zuótiān wèn tā.","I asked him yesterday."]],
    问:[["问他","wèn tā","ask him"],["问老师","wèn lǎoshī","ask the teacher"],["我昨天问他。","Wǒ zuótiān wèn tā.","I asked him yesterday."]],
    说:[["对我说","duì wǒ shuō","say to me"],["说中文","shuō Zhōngwén","speak Chinese"],["他对我说，他不去。","Tā duì wǒ shuō, tā bú qù.","He told me he was not going."]],
    要:[["要去","yào qù","be going to go"],["要玩","yào wán","want to play"],["他今天要和小朋友玩。","Tā jīntiān yào hé xiǎopéngyǒu wán.","He is going to play with kids today."]],
    小朋友:[["和小朋友玩","hé xiǎopéngyǒu wán","play with kids"],["一个小朋友","yí ge xiǎopéngyǒu","a child"],["小朋友在玩。","Xiǎopéngyǒu zài wán.","The children are playing."]]
  },
  grammarRows: [
    { title:"正反问", titleEn:"Affirmative-Negative Questions", structure:"X + 不/没 + X", structureEn:"X + bu/mei + X", structureRu:"X + 不/没 + X", explanation:"正反问用肯定形式和否定形式连用来提问。", english:"Use an affirmative form plus a negative form to ask a yes-no question.", russian:"Утвердительная и отрицательная формы вместе образуют общий вопрос.", examples:[["你开车没开车？","Nǐ kāichē méi kāichē?","Are you driving or not?","textbook"],["你们学习忙不忙？","Nǐmen xuéxí máng bu máng?","Are your studies busy?","textbook"],["它是不是在超市后边？","Tā shì bu shì zài chāoshì hòubian?","Is it behind the supermarket?","textbook"]] },
    { title:"时间副词“在/正在”", titleEn:"Temporal Adverbs 在/正在", structure:"在/正在 + 动词 + 呢", structureEn:"zai/zhengzai + verb + ne", structureRu:"在/正在 + глагол + 呢", explanation:"“在/正在”表示动作正在进行。", english:"在/正在 marks an action in progress.", russian:"在/正在 показывает действие в процессе.", examples:[["正在找呢。","Zhèngzài zhǎo ne.","I'm looking for it.","textbook"],["坐车呢。","Zuò chē ne.","I'm taking a car.","textbook"],["我读大学呢。","Wǒ dú dàxué ne.","I'm studying at university.","textbook"]] },
    { title:"能愿动词“要”", titleEn:"Modal Verb 要", structure:"要 + 动词", structureEn:"yao + verb", structureRu:"要 + глагол", explanation:"“要”表示想做或打算做。", english:"要 before a verb means want to or be going to do something.", russian:"要 перед глаголом означает хотеть или собираться сделать что-то.", examples:[["他今天要和小朋友玩。","Tā jīntiān yào hé xiǎopéngyǒu wán.","He is going to play with kids today.","textbook"],["妈妈要去超市。","Māma yào qù chāoshì.","Mom is going to the supermarket."],["我要学习中文。","Wǒ yào xuéxí Zhōngwén.","I want to study Chinese."]] }
  ],
  texts: l11Texts,
  warmup: { title:"正在做什么", prompt:"Think about actions happening now.", intro:"这一课学完，你可以说自己正在做什么，也可以问别人忙不忙、去不去。", question:"如果你想说“我正在找饭店”，下面哪句话最合适？", questionEn:"Which sentence means 'I am looking for the restaurant'?", options:[{word:"我正在找饭店。",pinyin:"Wǒ zhèngzài zhǎo fàndiàn."},{word:"我叫李文。",pinyin:"Wǒ jiào Lǐ Wén."},{word:"我昨天去学校。",pinyin:"Wǒ zuótiān qù xuéxiào."}] },
  preQuestions: [
    { id:"pre_l11_01", type:"choice", module:"词汇预热", question:"Which word means restaurant?", options:["饭店","大学","车","小朋友"], answer:"饭店", sourceType:"textbook" },
    { id:"pre_l11_02", type:"choice", module:"词汇预热", question:"Which word means to look for?", options:["找","说","问","读"], answer:"找", sourceType:"textbook" },
    { id:"pre_l11_03", type:"choice", module:"交际预热", question:"Which sentence asks 'Are you driving or not?'", options:["你开车没开车？","你在哪里？","你叫什么？","你要什么？"], answer:"你开车没开车？", sourceType:"textbook" },
    { id:"pre_l11_04", type:"choice", module:"语法预热", question:"Which sentence shows an action in progress?", options:["我正在找呢。","我叫李文。","昨天星期六。","这个很便宜。"], answer:"我正在找呢。", sourceType:"textbook" },
    { id:"pre_l11_05", type:"choice", module:"语法预热", question:"Which sentence uses 要 + verb?", options:["他今天要和小朋友玩。","他正在睡觉。","他是大学生。","他很忙。"], answer:"他今天要和小朋友玩。", sourceType:"textbook" },
    { id:"pre_l11_06", type:"choice", module:"课文预判", question:"Where is the restaurant?", options:["在超市后边","在学校里","在医院前边","在家里"], answer:"在超市后边", sourceType:"textbook" },
    { id:"pre_l11_07", type:"choice", module:"课文预判", question:"What does Li Wen study?", options:["医","中文","电影","商店"], answer:"医", sourceType:"textbook" },
    { id:"pre_l11_08", type:"choice", module:"词汇预热", question:"Which word means younger brother?", options:["弟弟","哥哥","朋友","老师"], answer:"弟弟", sourceType:"textbook" },
    { id:"pre_l11_09", type:"subjective", module:"生活经验开放题", question:"教学扩展：你现在正在做什么？请写一个中文短句。 / What are you doing now? Write one short Chinese sentence.", openEnded:true, prompt:"例如：我正在学习中文。", answerPlaceholder:"我正在____。", sourceType:"teaching_extension" },
    { id:"pre_l11_10", type:"subjective", module:"计划表达开放题", question:"教学扩展：请用“要”写一个中文短句。 / Use 要 to write one short sentence.", openEnded:true, prompt:"例如：我要去学校。", answerPlaceholder:"我要____。", sourceType:"teaching_extension" }
  ],
  imageGuess: [
    {answer:"饭店", image:"v02_fandian.png", options:["饭店","大学","医院","商店"]},
    {answer:"找", image:"v05_zhao.png", options:["找","睡觉","开车","读"]},
    {answer:"开车", image:"v06_kaiche.png", options:["开车","坐车","睡觉","问"]},
    {answer:"读", image:"v09_du.png", options:["读","说","问","找"]},
    {answer:"大学", image:"v10_daxue.png", options:["大学","饭店","超市","公司"]},
    {answer:"大学生", image:"v11_daxuesheng.png", options:["大学生","医生","老师","售货员"]},
    {answer:"弟弟", image:"v14_didi.png", options:["弟弟","妹妹","爸爸","妈妈"]},
    {answer:"起床", image:"v15_qichuang.png", options:["起床","睡觉","看病","开车"]},
    {answer:"睡觉", image:"v16_shuijiao.png", options:["睡觉","读书","上课","唱歌"]},
    {answer:"小朋友", image:"v23_xiaopengyou.png", options:["小朋友","大学生","老师","医生"]}
  ],
  fill: [
    {sentence:"李文正在___饭店。", sentencePinyin:"Lǐ Wén zhèngzài ___ fàndiàn.", answer:"找", options:["找","睡觉","知道","读"], kp:"正在 + 动词"},
    {sentence:"你___没开车？", sentencePinyin:"Nǐ ___ méi kāichē?", answer:"开车", options:["开车","读","问","说"], kp:"正反问"},
    {sentence:"我没开车，坐___呢。", sentencePinyin:"Wǒ méi kāichē, zuò ___ ne.", answer:"车", options:["车","饭店","大学","时候"], kp:"坐车呢"},
    {sentence:"我___大学呢。", sentencePinyin:"Wǒ ___ dàxué ne.", answer:"读", options:["读","找","开车","问"], kp:"读大学"},
    {sentence:"他还是___。", sentencePinyin:"Tā hái shì ___.", answer:"大学生", options:["大学生","饭店","昨天","车"], kp:"大学生"},
    {sentence:"你们学习忙___忙？", sentencePinyin:"Nǐmen xuéxí máng ___ máng?", answer:"不", options:["不","没","在","要"], kp:"正反问"},
    {sentence:"弟弟___没起床呢？", sentencePinyin:"Dìdi ___ méi qǐchuáng ne?", answer:"起床", options:["起床","知道","读","开车"], kp:"起床没起床"},
    {sentence:"他还在___。", sentencePinyin:"Tā hái zài ___.", answer:"睡觉", options:["睡觉","饭店","大学","车"], kp:"在 + 动词"},
    {sentence:"我昨天___他。", sentencePinyin:"Wǒ zuótiān ___ tā.", answer:"问", options:["问","睡","医","那里"], kp:"问"},
    {sentence:"他今天___和小朋友玩。", sentencePinyin:"Tā jīntiān ___ hé xiǎopéngyǒu wán.", answer:"要", options:["要","在","没","哪里"], kp:"要 + 动词"}
  ],
  wordMatch: [
    [["你什么时候能到饭店？","还不知道，正在找呢。"],["你开车没开车？","我没开车，坐车呢。"],["它是不是在超市后边？","是的。"],["你还在读大学吗？","对，我读大学呢。"]],
    [["你们学习忙不忙？","非常忙。"],["你学什么？","我学医。"],["弟弟起床没起床呢？","没起床呢。"],["他今天去不去那里？","他不去。"]],
    [["去哪里？","去超市。"],["他今天要做什么？","要和小朋友玩。"],["谁还在睡觉？","弟弟还在睡觉。"],["谁读大学？","李文读大学。"]],
    [["饭店在哪儿？","在超市后边。"],["李文怎么去饭店？","坐车去。"],["李文学什么？","学医。"],["弟弟起床了吗？","没有。"]],
    [["正在找","饭店"],["读","大学"],["学","医"],["要","和小朋友玩"]]
  ],
  memoryMatch: [
    [["饭店","restaurant"],["知道","know"],["正在","in progress"],["找","look for"]],
    [["开车","drive"],["车","vehicle"],["读","study"],["大学","university"]],
    [["大学生","university student"],["学","learn"],["医","medicine"],["弟弟","younger brother"]],
    [["起床","get up"],["睡觉","sleep"],["那里","there"],["哪里","where"]],
    [["昨天","yesterday"],["问","ask"],["说","say"],["要","want / be going to"]]
  ],
  transform: [
    {source:"还不知道，正在找呢。", sourcePinyin:"Hái bù zhīdào, zhèngzài zhǎo ne.", options:["你正在做什么？","你叫什么名字？","今天星期几？","你多少钱？"], optionsPinyin:["Nǐ zhèngzài zuò shénme?","Nǐ jiào shénme míngzi?","Jīntiān xīngqī jǐ?","Nǐ duōshao qián?"], answer:"你正在做什么？"},
    {source:"我没开车，坐车呢。", sourcePinyin:"Wǒ méi kāichē, zuò chē ne.", options:["你开车没开车？","你读大学吗？","你在哪儿？","你要什么？"], optionsPinyin:["Nǐ kāichē méi kāichē?","Nǐ dú dàxué ma?","Nǐ zài nǎr?","Nǐ yào shénme?"], answer:"你开车没开车？"},
    {source:"对，我读大学呢。", sourcePinyin:"Duì, wǒ dú dàxué ne.", options:["你还在读大学吗？","你学什么？","你忙不忙？","你去哪儿？"], optionsPinyin:["Nǐ hái zài dú dàxué ma?","Nǐ xué shénme?","Nǐ máng bu máng?","Nǐ qù nǎr?"], answer:"你还在读大学吗？"},
    {source:"非常忙。", sourcePinyin:"Fēicháng máng.", options:["你们学习忙不忙？","你开车没开车？","他去不去？","你去哪儿？"], optionsPinyin:["Nǐmen xuéxí máng bu máng?","Nǐ kāichē méi kāichē?","Tā qù bu qù?","Nǐ qù nǎr?"], answer:"你们学习忙不忙？"},
    {source:"我学医。", sourcePinyin:"Wǒ xué yī.", options:["你学什么？","你叫什么？","你去哪儿？","你买什么？"], optionsPinyin:["Nǐ xué shénme?","Nǐ jiào shénme?","Nǐ qù nǎr?","Nǐ mǎi shénme?"], answer:"你学什么？"},
    {source:"没起床呢，还在睡觉。", sourcePinyin:"Méi qǐchuáng ne, hái zài shuìjiào.", options:["弟弟起床没起床呢？","你们忙不忙？","他开什么车？","哪里有饭店？"], optionsPinyin:["Dìdi qǐchuáng méi qǐchuáng ne?","Nǐmen máng bu máng?","Tā kāi shénme chē?","Nǎli yǒu fàndiàn?"], answer:"弟弟起床没起床呢？"},
    {source:"去超市。", sourcePinyin:"Qù chāoshì.", options:["去哪里？","什么时候？","学什么？","忙不忙？"], optionsPinyin:["Qù nǎli?","Shénme shíhou?","Xué shénme?","Máng bu máng?"], answer:"去哪里？"},
    {source:"他不去。", sourcePinyin:"Tā bú qù.", options:["他今天去不去那里？","他是不是大学生？","他起床了吗？","他在哪儿？"], optionsPinyin:["Tā jīntiān qù bu qù nàli?","Tā shì bu shì dàxuéshēng?","Tā qǐchuáng le ma?","Tā zài nǎr?"], answer:"他今天去不去那里？"},
    {source:"他今天要和小朋友玩。", sourcePinyin:"Tā jīntiān yào hé xiǎopéngyǒu wán.", options:["他今天要做什么？","他昨天问谁？","他学什么？","他几点起床？"], optionsPinyin:["Tā jīntiān yào zuò shénme?","Tā zuótiān wèn shéi?","Tā xué shénme?","Tā jǐ diǎn qǐchuáng?"], answer:"他今天要做什么？"},
    {source:"在超市后边。", sourcePinyin:"Zài chāoshì hòubian.", options:["饭店在哪儿？","弟弟在哪儿？","大学在哪儿？","车在哪儿？"], optionsPinyin:["Fàndiàn zài nǎr?","Dìdi zài nǎr?","Dàxué zài nǎr?","Chē zài nǎr?"], answer:"饭店在哪儿？"}
  ],
  ordering: [
    {chunks:["李文","正在","找","饭店"], chunksPinyin:["Lǐ Wén","zhèngzài","zhǎo","fàndiàn"], answer:"李文正在找饭店"},
    {chunks:["你","开车","没","开车"], chunksPinyin:["nǐ","kāichē","méi","kāichē"], answer:"你开车没开车"},
    {chunks:["我","读","大学","呢"], chunksPinyin:["wǒ","dú","dàxué","ne"], answer:"我读大学呢"},
    {chunks:["弟弟","还在","睡觉"], chunksPinyin:["dìdi","hái zài","shuìjiào"], answer:"弟弟还在睡觉"},
    {chunks:["他","今天","要","和小朋友玩"], chunksPinyin:["tā","jīntiān","yào","hé xiǎopéngyǒu wán"], answer:"他今天要和小朋友玩"}
  ],
  translation: [
    {en:"I am looking for the restaurant.", ru:"Я ищу ресторан.", options:["我正在找饭店。","我正在睡觉。","我在大学。","我知道饭店。"], answer:"我正在找饭店。"},
    {en:"Are you driving or not?", ru:"Ты за рулём или нет?", options:["你开车没开车？","你去不去？","你忙不忙？","你是不是老师？"], answer:"你开车没开车？"},
    {en:"I'm studying at university.", ru:"Я учусь в университете.", options:["我读大学呢。","我去饭店呢。","我开车呢。","我起床呢。"], answer:"我读大学呢。"},
    {en:"Are your studies busy?", ru:"Учёба у вас загруженная?", options:["你们学习忙不忙？","你们开车没开车？","你们去哪里？","你们买什么？"], answer:"你们学习忙不忙？"},
    {en:"I study medicine.", ru:"Я изучаю медицину.", options:["我学医。","我学车。","我找饭店。","我问他。"], answer:"我学医。"},
    {en:"He has not gotten up yet.", ru:"Он ещё не встал.", options:["他没起床呢。","他在大学呢。","他开车呢。","他知道呢。"], answer:"他没起床呢。"},
    {en:"He is still sleeping.", ru:"Он всё ещё спит.", options:["他还在睡觉。","他还在开车。","他还在问。","他还在说。"], answer:"他还在睡觉。"},
    {en:"Where are you going?", ru:"Куда ты идёшь?", options:["你去哪里？","你什么时候去？","你学什么？","你找谁？"], answer:"你去哪里？"},
    {en:"He is going to play with kids today.", ru:"Сегодня он собирается играть с детьми.", options:["他今天要和小朋友玩。","他昨天问小朋友。","他今天读大学。","他正在找小朋友。"], answer:"他今天要和小朋友玩。"},
    {en:"He told me he wasn't going.", ru:"Он сказал мне, что не пойдёт.", options:["他对我说，他不去。","他对我说，他很忙。","他对我说，他开车。","他对我说，他学医。"], answer:"他对我说，他不去。"}
  ],
  textQa: [
    {title:"课文一：找饭店", passage:"喂，李文，你什么时候能到饭店？还不知道，正在找呢。它是不是在超市后边？是的。你开车没开车？我没开车，坐车呢。", passagePinyin:"Wèi, Lǐ Wén, nǐ shénme shíhou néng dào fàndiàn? Hái bù zhīdào, zhèngzài zhǎo ne. Tā shì bu shì zài chāoshì hòubian? Shì de. Nǐ kāichē méi kāichē? Wǒ méi kāichē, zuò chē ne.", questions:[{question:"李文正在找什么？", questionPinyin:"Lǐ Wén zhèngzài zhǎo shénme?", answer:"饭店", answerPinyin:"fàndiàn", options:["饭店","大学","医院","学校"]},{question:"饭店在哪儿？", questionPinyin:"Fàndiàn zài nǎr?", answer:"超市后边", answerPinyin:"chāoshì hòubian", options:["超市后边","学校前边","医院里","家里"]},{question:"李文开车了吗？", questionPinyin:"Lǐ Wén kāichē le ma?", answer:"没有", answerPinyin:"méiyǒu", options:["没有","开车了","不知道","是的"]}]},
    {title:"课文二：读大学", passage:"你还在读大学吗？对，我读大学呢，还是大学生。你们学习忙不忙？非常忙，我学医，我们的课很多。", passagePinyin:"Nǐ hái zài dú dàxué ma? Duì, wǒ dú dàxué ne, hái shì dàxuéshēng. Nǐmen xuéxí máng bu máng? Fēicháng máng, wǒ xué yī, wǒmen de kè hěn duō.", questions:[{question:"李文还在读什么？", questionPinyin:"Lǐ Wén hái zài dú shénme?", answer:"大学", answerPinyin:"dàxué", options:["大学","小学","中学","中文"]},{question:"李文学什么？", questionPinyin:"Lǐ Wén xué shénme?", answer:"医", answerPinyin:"yī", options:["医","中文","开车","唱歌"]},{question:"他们的课多不多？", questionPinyin:"Tāmen de kè duō bu duō?", answer:"很多", answerPinyin:"hěn duō", options:["很多","很少","没有","不知道"]}]},
    {title:"课文三：还在睡觉", passage:"弟弟起床没起床呢？没起床呢，还在睡觉。他今天去不去那里？我昨天问他，他对我说，他不去，他今天要和小朋友玩。", passagePinyin:"Dìdi qǐchuáng méi qǐchuáng ne? Méi qǐchuáng ne, hái zài shuìjiào. Tā jīntiān qù bu qù nàli? Wǒ zuótiān wèn tā, tā duì wǒ shuō, tā bú qù, tā jīntiān yào hé xiǎopéngyǒu wán.", questions:[{question:"弟弟起床了吗？", questionPinyin:"Dìdi qǐchuáng le ma?", answer:"没有", answerPinyin:"méiyǒu", options:["没有","起床了","不知道","去了"]},{question:"弟弟还在做什么？", questionPinyin:"Dìdi hái zài zuò shénme?", answer:"睡觉", answerPinyin:"shuìjiào", options:["睡觉","开车","读大学","找饭店"]},{question:"弟弟今天要做什么？", questionPinyin:"Dìdi jīntiān yào zuò shénme?", answer:"和小朋友玩", answerPinyin:"hé xiǎopéngyǒu wán", options:["和小朋友玩","去超市","读大学","开车"]}]}
  ],
  pictureTalk: [
    {question:"他正在做什么？", questionPinyin:"Tā zhèngzài zuò shénme?", image:"v04_zhengzai.png", sampleAnswer:"他正在找东西。", sampleAnswerPinyin:"Tā zhèngzài zhǎo dōngxi.", patternType:"正在 + 动词"},
    {question:"他要去哪儿？", questionPinyin:"Tā yào qù nǎr?", image:"v02_fandian.png", sampleAnswer:"他要去饭店。", sampleAnswerPinyin:"Tā yào qù fàndiàn.", patternType:"要 + 地点"},
    {question:"他开车没开车？", questionPinyin:"Tā kāichē méi kāichē?", image:"v06_kaiche.png", sampleAnswer:"他开车了。", sampleAnswerPinyin:"Tā kāichē le.", patternType:"正反问"},
    {question:"他在做什么？", questionPinyin:"Tā zài zuò shénme?", image:"v09_du.png", sampleAnswer:"他在读书。", sampleAnswerPinyin:"Tā zài dú shū.", patternType:"在 + 动词"},
    {question:"你觉得他是谁？", questionPinyin:"Nǐ juéde tā shì shéi?", image:"v11_daxuesheng.png", sampleAnswer:"我觉得他是大学生。", sampleAnswerPinyin:"Wǒ juéde tā shì dàxuéshēng.", patternType:"身份"},
    {question:"弟弟起床了吗？", questionPinyin:"Dìdi qǐchuáng le ma?", image:"v15_qichuang.png", sampleAnswer:"弟弟起床了。", sampleAnswerPinyin:"Dìdi qǐchuáng le.", patternType:"起床"},
    {question:"他还在做什么？", questionPinyin:"Tā hái zài zuò shénme?", image:"v16_shuijiao.png", sampleAnswer:"他还在睡觉。", sampleAnswerPinyin:"Tā hái zài shuìjiào.", patternType:"还在"},
    {question:"他们要做什么？", questionPinyin:"Tāmen yào zuò shénme?", image:"v23_xiaopengyou.png", sampleAnswer:"他们要一起玩。", sampleAnswerPinyin:"Tāmen yào yìqǐ wán.", patternType:"要 + 动词"}
  ],
  hanziChars:"时候饭店知道正在找开车读大学医弟弟起床睡觉那里哪里昨天问说要小朋友",
  hanziGroups:[{id:"action_progress",title:"动作进行",vocabularyIds:["v_l11_04","v_l11_05","v_l11_08","v_l11_09","v_l11_15","v_l11_16"]},{id:"study_people",title:"学习与人物",vocabularyIds:["v_l11_10","v_l11_11","v_l11_12","v_l11_13","v_l11_14","v_l11_23"]},{id:"place_time",title:"地点与时间",vocabularyIds:["v_l11_01","v_l11_02","v_l11_17","v_l11_18","v_l11_19","v_l11_22"]}],
  postClassHomework:{mode:"required_optional",instructions:{required:"必选：完成汉字书写。",optional:"可选：选择一个输出任务完成。"},required:[{id:"post_l11_req_01",type:"handwriting",prompt_cn:"必选：书写本课汉字。",characters:"时候饭店知道正在找开车读大学医弟弟起床睡觉昨天问说要".split(""),instructions:"每个字至少写 3 次。",sourceType:"textbook"}],optional:[{id:"post_l11_opt_01",type:"writing",prompt_cn:"教学扩展：用“正在”和“要”各写一句话。",openEnded:true,sourceType:"teaching_extension"},{id:"post_l11_opt_02",type:"oral_prepare",prompt_cn:"准备 4 句对话：问别人正在做什么。",openEnded:true,sourceType:"teaching_extension"}]},
  reportFocus:["正在进行","正反问","要 + 动词","读大学/找饭店"]
});

// L12 mirrors L10 structure as well.
const L12 = lessonData({
  lesson: "12",
  title: "昨天下雪了",
  titleEn: "It snowed yesterday",
  topic: "描述天气与病情、非主语句、语气助词“了”、太……了",
  vocabRows: [
    ["天气","tiānqì","名词","weather","weather","v01_tianqi.png"],["这里","zhèlǐ","代词","here","place","v02_zheli.png"],["天","tiān","名词","weather; day","weather","v03_tian.png"],["下雨","xià yǔ","动词短语","rain","weather","v04_xiayu.png"],["了","le","助词","modal particle le","grammar","v05_le.png"],["雨","yǔ","名词","rain","weather","v06_yu.png"],["有点儿","yǒudiǎnr","副词","a bit","adverb","v07_youdianr.png"],["觉得","juéde","动词","feel","action","v08_juede.png"],["冷","lěng","形容词","cold","adjective","v09_leng.png"],["雪","xuě","名词","snow","weather","v10_xue.png"],["公司","gōngsī","名词","company","place","v11_gongsi.png"],["生病","shēngbìng","动词","fall ill","health","v12_shengbing.png"],["看病","kànbìng","动词","see a doctor","health","v13_kanbing.png"],["病","bìng","名词/动词","illness; be sick","health","v14_bing.png"],["一点儿","yìdiǎnr","数词/量词","a little","quantity","v15_yidianr.png"],["药","yào","名词","medicine","health","v16_yao.png"],["回","huí","动词","return","action","v17_hui.png"],["再","zài","副词","then; again","adverb","v18_zai_again.png"],["喝","hē","动词","drink","action","v19_he.png"],["热","rè","形容词","hot; warm","adjective","v20_re.png"],["水","shuǐ","名词","water","thing","v21_shui.png"]
  ],
  py:{天气:"tiānqì",这里:"zhèlǐ",天:"tiān",下雨:"xià yǔ",了:"le",雨:"yǔ",有点儿:"yǒudiǎnr",觉得:"juéde",冷:"lěng",雪:"xuě",公司:"gōngsī",生病:"shēngbìng",看病:"kànbìng",病:"bìng",一点儿:"yìdiǎnr",药:"yào",回:"huí",再:"zài",喝:"hē",热:"rè",水:"shuǐ",医院:"yīyuàn", 不好:"bù hǎo", 大:"dà", 休息:"xiūxi", 半天:"bàn tiān"},
  examples:{
    天气:[["今天天气","jīntiān tiānqì","today's weather"],["天气不好","tiānqì bù hǎo","bad weather"],["今天天气怎么样？","Jīntiān tiānqì zěnmeyàng?","How is the weather today?"]],
    这里:[["这里的天","zhèlǐ de tiān","the weather here"],["在这里","zài zhèlǐ","be here"],["这里下雨了。","Zhèlǐ xià yǔ le.","It is raining here."]],
    天:[["这里的天","zhèlǐ de tiān","the sky/weather here"],["天不好","tiān bù hǎo","the weather is not good"],["这里的天不太好。","Zhèlǐ de tiān bú tài hǎo.","The weather here is not very good."]],
    下雨:[["下雨了","xià yǔ le","it is raining"],["这里下雨","zhèlǐ xià yǔ","it rains here"],["这里下雨了。","Zhèlǐ xià yǔ le.","It is raining here."]],
    了:[["下雨了","xià yǔ le","it is raining"],["病了","bìng le","got sick"],["我病了。","Wǒ bìng le.","I am sick."]],
    雨:[["雨大","yǔ dà","heavy rain"],["下雨","xià yǔ","rain"],["雨有点儿大。","Yǔ yǒudiǎnr dà.","The rain is a bit heavy."]],
    有点儿:[["有点儿大","yǒudiǎnr dà","a bit heavy"],["有点儿冷","yǒudiǎnr lěng","a bit cold"],["我觉得有点儿冷。","Wǒ juéde yǒudiǎnr lěng.","I feel a bit cold."]],
    觉得:[["觉得冷","juéde lěng","feel cold"],["觉得很好","juéde hěn hǎo","feel it is good"],["我觉得很冷。","Wǒ juéde hěn lěng.","I feel very cold."]],
    冷:[["很冷","hěn lěng","very cold"],["太冷了","tài lěng le","too cold"],["我觉得很冷。","Wǒ juéde hěn lěng.","I feel very cold."]],
    雪:[["下雪","xià xuě","snow"],["昨天下雪","zuótiān xià xuě","it snowed yesterday"],["昨天下雪了。","Zuótiān xià xuě le.","It snowed yesterday."]],
    公司:[["来公司","lái gōngsī","come to the company"],["在公司","zài gōngsī","at the company"],["你昨天没来公司。","Nǐ zuótiān méi lái gōngsī.","You did not come to the company yesterday."]],
    生病:[["生病了","shēngbìng le","got sick"],["没有生病","méiyǒu shēngbìng","not sick"],["他生病了。","Tā shēngbìng le.","He got sick."]],
    看病:[["去看病","qù kànbìng","go to see a doctor"],["去医院看病","qù yīyuàn kànbìng","go to the hospital to see a doctor"],["我昨天去医院看病了。","Wǒ zuótiān qù yīyuàn kànbìng le.","I went to the hospital yesterday."]],
    病:[["病了","bìng le","be sick"],["看病","kànbìng","see a doctor"],["医生，我病了。","Yīshēng, wǒ bìng le.","Doctor, I am sick."]],
    一点儿:[["一点儿药","yìdiǎnr yào","a little medicine"],["一点儿水","yìdiǎnr shuǐ","a little water"],["吃一点儿药。","Chī yìdiǎnr yào.","Take a little medicine."]],
    药:[["吃药","chī yào","take medicine"],["一点儿药","yìdiǎnr yào","a little medicine"],["医生让他吃药。","Yīshēng ràng tā chī yào.","The doctor told him to take medicine."]],
    回:[["回家","huí jiā","go home"],["回来","huí lái","come back"],["回家后再喝些热水。","Huí jiā hòu zài hē xiē rè shuǐ.","Drink warm water after going home."]],
    再:[["再喝","zài hē","then drink"],["再看","zài kàn","then look"],["回家后再喝些热水。","Huí jiā hòu zài hē xiē rè shuǐ.","Drink warm water after going home."]],
    喝:[["喝水","hē shuǐ","drink water"],["喝热水","hē rè shuǐ","drink warm water"],["回家后再喝些热水。","Huí jiā hòu zài hē xiē rè shuǐ.","Drink warm water after going home."]],
    热:[["热水","rè shuǐ","warm water"],["很热","hěn rè","very hot"],["他喝热水。","Tā hē rè shuǐ.","He drinks warm water."]],
    水:[["喝水","hē shuǐ","drink water"],["热水","rè shuǐ","warm water"],["回家后再喝些热水。","Huí jiā hòu zài hē xiē rè shuǐ.","Drink warm water after going home."]]
  },
  grammarRows:[
    {title:"非主语句",titleEn:"Non-Subject-Predicate Sentences",structure:"词/短语成句",structureEn:"word/phrase as a sentence",structureRu:"слово/фраза как предложение",explanation:"口语中可用词或短语直接成句。",english:"A word or phrase can stand as a sentence in spoken Chinese.",russian:"Слово или фраза могут быть предложением.",examples:[["下雨了。","Xià yǔ le.","It is raining.","textbook"],["下雪了。","Xià xuě le.","It snowed.","textbook"],["上课了。","Shàng kè le.","Class begins."]]},
    {title:"语气助词“了”",titleEn:"Modal Particle 了",structure:"句子 + 了",structureEn:"sentence + le",structureRu:"предложение + 了",explanation:"句末“了”表示出现新情况或状态变化。",english:"Sentence-final 了 marks a new situation or change of state.",russian:"了 в конце предложения показывает изменение.",examples:[["下雨了。","Xià yǔ le.","It is raining.","textbook"],["昨天下雪了。","Zuótiān xià xuě le.","It snowed yesterday.","textbook"],["我病了。","Wǒ bìng le.","I'm sick.","textbook"]]},
    {title:"“太……了”格式",titleEn:"太...了 Pattern",structure:"太 + 形容词 + 了",structureEn:"tai + adjective + le",structureRu:"太 + прилагательное + 了",explanation:"“太……了”用于感叹程度很高。",english:"太...了 expresses a high degree.",russian:"太...了 выражает высокую степень.",examples:[["太冷了。","Tài lěng le.","It is too cold.","textbook"],["这个杯子太小了。","Zhège bēizi tài xiǎo le.","This cup is too small."],["我们今天太高兴了！","Wǒmen jīntiān tài gāoxìng le!","We are so happy today!"]]}
  ],
  texts:[
    text("t_l12_01","课文一：今天天气怎么样","王一雪给王一飞打电话，问天气。",[["王一雪","今天天气怎么样？","Jīntiān tiānqì zěnmeyàng?","How is the weather today?"],["王一飞","这里的天不太好，下雨了。","Zhèlǐ de tiān bú tài hǎo, xià yǔ le.","The weather here is not very good. It is raining."],["王一雪","雨大吗？","Yǔ dà ma?","Is the rain heavy?"],["王一飞","有点儿大，我觉得很冷。","Yǒudiǎnr dà, wǒ juéde hěn lěng.","A bit heavy. I feel cold."]]),
    text("t_l12_02","课文二：生病了","王一雪和杨同乐在公司聊天儿。",[["王一雪","昨天下雪了。","Zuótiān xià xuě le.","It snowed yesterday."],["杨同乐","是的，太冷了。","Shì de, tài lěng le.","Yes, it was too cold."],["王一雪","你昨天没来公司，生病了？","Nǐ zuótiān méi lái gōngsī, shēngbìng le?","You didn't come to the company yesterday. Were you sick?"],["杨同乐","对，我昨天去医院看病了。","Duì, wǒ zuótiān qù yīyuàn kànbìng le.","Yes. I went to the hospital to see a doctor yesterday."]]),
    text("t_l12_03","课文三：看病","昨天在医院，医生给杨同乐看病。",[["杨同乐","医生，我病了。","Yīshēng, wǒ bìng le.","Doctor, I'm sick."],["胡医生","我看看。你觉得怎么样？","Wǒ kànkan. Nǐ juéde zěnmeyàng?","Let me take a look. How do you feel?"],["杨同乐","我很冷。","Wǒ hěn lěng.","I feel very cold."],["胡医生","好的，吃一点儿药，今天休息半天吧。","Hǎo de, chī yìdiǎnr yào, jīntiān xiūxi bàn tiān ba.","Okay. Take some medicine and rest for half a day today."],["杨同乐","好的。","Hǎo de.","Okay."],["胡医生","回家后再喝些热水。","Huí jiā hòu zài hē xiē rè shuǐ.","Drink some warm water after you get home."]])
  ],
  warmup:{title:"天气和身体感觉",prompt:"Think about weather and health.",intro:"这一课学完，你可以说天气变化，也可以说自己生病了、觉得冷。",question:"如果你想说“下雨了”，下面哪句话最合适？",questionEn:"Which sentence means 'It is raining'?",options:[{word:"下雨了。",pinyin:"Xià yǔ le."},{word:"我读大学。",pinyin:"Wǒ dú dàxué."},{word:"杯子在这边。",pinyin:"Bēizi zài zhèbiān."}]},
  preQuestions:[
    {id:"pre_l12_01",type:"choice",module:"词汇预热",question:"Which word means weather?",options:["天气","公司","药","水"],answer:"天气",sourceType:"textbook"},
    {id:"pre_l12_02",type:"choice",module:"词汇预热",question:"Which word means snow?",options:["雪","雨","水","药"],answer:"雪",sourceType:"textbook"},
    {id:"pre_l12_03",type:"choice",module:"交际预热",question:"Which sentence asks 'How is the weather today?'",options:["今天天气怎么样？","你叫什么名字？","多少钱一个？","你去哪儿？"],answer:"今天天气怎么样？",sourceType:"textbook"},
    {id:"pre_l12_04",type:"choice",module:"语法预热",question:"Which sentence uses 了 for a new situation?",options:["下雨了。","我叫李文。","他是学生。","她在学校。"],answer:"下雨了。",sourceType:"textbook"},
    {id:"pre_l12_05",type:"choice",module:"语法预热",question:"Which sentence uses 太……了?",options:["太冷了。","我很冷。","天气不好。","我病了。"],answer:"太冷了。",sourceType:"textbook"},
    {id:"pre_l12_06",type:"choice",module:"课文预判",question:"Why did Yang Tongle go to the hospital?",options:["生病了","买衣服","看电影","读大学"],answer:"生病了",sourceType:"textbook"},
    {id:"pre_l12_07",type:"choice",module:"词汇预热",question:"Which word means medicine?",options:["药","水","雨","天"],answer:"药",sourceType:"textbook"},
    {id:"pre_l12_08",type:"choice",module:"交际预热",question:"Which sentence means 'I feel cold'?",options:["我觉得很冷。","我很高兴。","我在学校。","我买苹果。"],answer:"我觉得很冷。",sourceType:"textbook"},
    {id:"pre_l12_09",type:"subjective",module:"天气开放题",question:"教学扩展：请写一句今天的天气。 / Write one sentence about today's weather.",openEnded:true,prompt:"例如：今天天气很好。",answerPlaceholder:"今天天气____。",sourceType:"teaching_extension"},
    {id:"pre_l12_10",type:"subjective",module:"身体感觉开放题",question:"教学扩展：请用“觉得”写一个中文短句。 / Use 觉得 to write one short sentence.",openEnded:true,prompt:"例如：我觉得很冷。",answerPlaceholder:"我觉得____。",sourceType:"teaching_extension"}
  ],
  imageGuess:[
    {answer:"天气",image:"v01_tianqi.png",options:["天气","公司","饭店","学校"]},{answer:"下雨",image:"v04_xiayu.png",options:["下雨","下雪","喝水","看病"]},{answer:"雨",image:"v06_yu.png",options:["雨","雪","水","药"]},{answer:"冷",image:"v09_leng.png",options:["冷","热","贵","便宜"]},{answer:"雪",image:"v10_xue.png",options:["雪","雨","水","药"]},{answer:"公司",image:"v11_gongsi.png",options:["公司","医院","商店","大学"]},{answer:"生病",image:"v12_shengbing.png",options:["生病","起床","开车","唱歌"]},{answer:"看病",image:"v13_kanbing.png",options:["看病","买衣服","读书","看电视"]},{answer:"药",image:"v16_yao.png",options:["药","水","杯子","钱"]},{answer:"热水",image:"v21_shui.png",options:["热水","牛奶","茶","水果"]}
  ],
  fill:[
    {sentence:"今天___怎么样？",sentencePinyin:"Jīntiān ___ zěnmeyàng?",answer:"天气",options:["天气","药","公司","水"],kp:"天气怎么样"},{sentence:"这里___了。",sentencePinyin:"Zhèlǐ ___ le.",answer:"下雨",options:["下雨","看病","回来","觉得"],kp:"下雨了"},{sentence:"雨有点儿___。",sentencePinyin:"Yǔ yǒudiǎnr ___.",answer:"大",options:["大","药","公司","水"],kp:"有点儿"},{sentence:"我觉得很___。",sentencePinyin:"Wǒ juéde hěn ___.",answer:"冷",options:["冷","雪","药","天"],kp:"觉得"},{sentence:"昨天___了。",sentencePinyin:"Zuótiān ___ le.",answer:"下雪",options:["下雪","看病","喝水","回来"],kp:"下雪了"},{sentence:"你昨天没来___。",sentencePinyin:"Nǐ zuótiān méi lái ___.",answer:"公司",options:["公司","天气","药","雨"],kp:"公司"},{sentence:"我昨天去医院___了。",sentencePinyin:"Wǒ zuótiān qù yīyuàn ___ le.",answer:"看病",options:["看病","下雨","喝","回"],kp:"看病了"},{sentence:"吃一点儿___。",sentencePinyin:"Chī yìdiǎnr ___.",answer:"药",options:["药","公司","天气","雪"],kp:"一点儿药"},{sentence:"回家后再___些热水。",sentencePinyin:"Huí jiā hòu zài ___ xiē rè shuǐ.",answer:"喝",options:["喝","来","下","看病"],kp:"喝热水"},{sentence:"太___了。",sentencePinyin:"Tài ___ le.",answer:"冷",options:["冷","药","水","公司"],kp:"太……了"}
  ],
  wordMatch:[ [["今天天气怎么样？","这里下雨了。"],["雨大吗？","有点儿大。"],["你觉得怎么样？","我觉得很冷。"],["昨天下雪了吗？","是的，下雪了。"]], [["你昨天来公司了吗？","没有。"],["你生病了吗？","对，我病了。"],["你去医院做什么？","看病。"],["医生说什么？","吃一点儿药。"]], [["下雨了","天气不好"],["下雪了","太冷了"],["病了","去看病"],["回家后","喝热水"]], [["天气","怎么样"],["有点儿","大"],["觉得","很冷"],["一点儿","药"]], [["公司","上班"],["医院","看病"],["药","吃"],["热水","喝"]] ],
  memoryMatch:[ [["天气","weather"],["下雨","rain"],["雨","rain"],["冷","cold"]], [["雪","snow"],["公司","company"],["生病","fall ill"],["看病","see a doctor"]], [["药","medicine"],["喝","drink"],["热","hot"],["水","water"]], [["有点儿","a bit"],["觉得","feel"],["一点儿","a little"],["再","then / again"]], [["下雨了","It is raining"],["太冷了","too cold"],["我病了","I am sick"],["喝热水","drink warm water"]] ],
  transform:[
    {source:"这里的天不太好，下雨了。",sourcePinyin:"Zhèlǐ de tiān bú tài hǎo, xià yǔ le.",options:["今天天气怎么样？","你叫什么名字？","你去哪儿？","你买什么？"],optionsPinyin:["Jīntiān tiānqì zěnmeyàng?","Nǐ jiào shénme míngzi?","Nǐ qù nǎr?","Nǐ mǎi shénme?"],answer:"今天天气怎么样？"},
    {source:"有点儿大。",sourcePinyin:"Yǒudiǎnr dà.",options:["雨大吗？","你病了吗？","你去哪儿？","你学什么？"],optionsPinyin:["Yǔ dà ma?","Nǐ bìng le ma?","Nǐ qù nǎr?","Nǐ xué shénme?"],answer:"雨大吗？"},
    {source:"我觉得很冷。",sourcePinyin:"Wǒ juéde hěn lěng.",options:["你觉得怎么样？","你叫什么？","你在哪儿？","你买什么？"],optionsPinyin:["Nǐ juéde zěnmeyàng?","Nǐ jiào shénme?","Nǐ zài nǎr?","Nǐ mǎi shénme?"],answer:"你觉得怎么样？"},
    {source:"昨天下雪了。",sourcePinyin:"Zuótiān xià xuě le.",options:["昨天天气怎么样？","你昨天去哪儿？","你昨天买什么？","你几点下班？"],optionsPinyin:["Zuótiān tiānqì zěnmeyàng?","Nǐ zuótiān qù nǎr?","Nǐ zuótiān mǎi shénme?","Nǐ jǐ diǎn xiàbān?"],answer:"昨天天气怎么样？"},
    {source:"太冷了。",sourcePinyin:"Tài lěng le.",options:["天气怎么样？","你病了吗？","你看病了吗？","你喝水吗？"],optionsPinyin:["Tiānqì zěnmeyàng?","Nǐ bìng le ma?","Nǐ kànbìng le ma?","Nǐ hē shuǐ ma?"],answer:"天气怎么样？"},
    {source:"我昨天去医院看病了。",sourcePinyin:"Wǒ zuótiān qù yīyuàn kànbìng le.",options:["你昨天去哪儿了？","你今天去哪儿？","你买什么药？","天气怎么样？"],optionsPinyin:["Nǐ zuótiān qù nǎr le?","Nǐ jīntiān qù nǎr?","Nǐ mǎi shénme yào?","Tiānqì zěnmeyàng?"],answer:"你昨天去哪儿了？"},
    {source:"医生，我病了。",sourcePinyin:"Yīshēng, wǒ bìng le.",options:["你怎么了？","你叫什么？","你去哪儿？","你买什么？"],optionsPinyin:["Nǐ zěnme le?","Nǐ jiào shénme?","Nǐ qù nǎr?","Nǐ mǎi shénme?"],answer:"你怎么了？"},
    {source:"吃一点儿药。",sourcePinyin:"Chī yìdiǎnr yào.",options:["医生说吃什么？","医生在哪儿？","你喝什么？","你看什么？"],optionsPinyin:["Yīshēng shuō chī shénme?","Yīshēng zài nǎr?","Nǐ hē shénme?","Nǐ kàn shénme?"],answer:"医生说吃什么？"},
    {source:"回家后再喝些热水。",sourcePinyin:"Huí jiā hòu zài hē xiē rè shuǐ.",options:["回家后喝什么？","回家后去哪儿？","回家后买什么？","回家后学什么？"],optionsPinyin:["Huí jiā hòu hē shénme?","Huí jiā hòu qù nǎr?","Huí jiā hòu mǎi shénme?","Huí jiā hòu xué shénme?"],answer:"回家后喝什么？"},
    {source:"这里的天不太好。",sourcePinyin:"Zhèlǐ de tiān bú tài hǎo.",options:["这里的天气好吗？","这里有饭店吗？","这里有大学吗？","这里有医院吗？"],optionsPinyin:["Zhèlǐ de tiānqì hǎo ma?","Zhèlǐ yǒu fàndiàn ma?","Zhèlǐ yǒu dàxué ma?","Zhèlǐ yǒu yīyuàn ma?"],answer:"这里的天气好吗？"}
  ],
  ordering:[
    {chunks:["今天","天气","怎么样"],chunksPinyin:["jīntiān","tiānqì","zěnmeyàng"],answer:"今天天气怎么样"},
    {chunks:["这里","下雨","了"],chunksPinyin:["zhèlǐ","xià yǔ","le"],answer:"这里下雨了"},
    {chunks:["我","觉得","很","冷"],chunksPinyin:["wǒ","juéde","hěn","lěng"],answer:"我觉得很冷"},
    {chunks:["昨天","下雪","了"],chunksPinyin:["zuótiān","xià xuě","le"],answer:"昨天下雪了"},
    {chunks:["回家后","再","喝","热水"],chunksPinyin:["huí jiā hòu","zài","hē","rè shuǐ"],answer:"回家后再喝热水"}
  ],
  translation:[
    {en:"How is the weather today?",ru:"Какая сегодня погода?",options:["今天天气怎么样？","你今天去哪儿？","你今天买什么？","你今天上班吗？"],answer:"今天天气怎么样？"},
    {en:"It is raining here.",ru:"Здесь идёт дождь.",options:["这里下雨了。","这里下雪了。","这里很热。","这里有药。"],answer:"这里下雨了。"},
    {en:"The rain is a bit heavy.",ru:"Дождь немного сильный.",options:["雨有点儿大。","雪有点儿冷。","水有点儿热。","药有点儿少。"],answer:"雨有点儿大。"},
    {en:"I feel very cold.",ru:"Мне очень холодно.",options:["我觉得很冷。","我觉得很热。","我喝热水。","我吃药。"],answer:"我觉得很冷。"},
    {en:"It snowed yesterday.",ru:"Вчера шёл снег.",options:["昨天下雪了。","昨天下雨了。","昨天看病了。","昨天回家了。"],answer:"昨天下雪了。"},
    {en:"It is too cold.",ru:"Слишком холодно.",options:["太冷了。","太热了。","有点儿大。","天气不好。"],answer:"太冷了。"},
    {en:"I went to the hospital to see a doctor yesterday.",ru:"Вчера я ходил в больницу к врачу.",options:["我昨天去医院看病了。","我昨天去公司了。","我昨天去商店了。","我昨天去大学了。"],answer:"我昨天去医院看病了。"},
    {en:"Doctor, I am sick.",ru:"Доктор, я заболел.",options:["医生，我病了。","老师，我来了。","医生，我回家了。","朋友，我很忙。"],answer:"医生，我病了。"},
    {en:"Take a little medicine.",ru:"Прими немного лекарства.",options:["吃一点儿药。","喝一点儿水。","买一点儿水果。","看一点儿书。"],answer:"吃一点儿药。"},
    {en:"Drink some warm water after going home.",ru:"После возвращения домой выпей тёплой воды.",options:["回家后再喝些热水。","回家后再吃些苹果。","回家后再看电影。","回家后再买衣服。"],answer:"回家后再喝些热水。"}
  ],
  textQa:[
    {title:"课文一：今天天气怎么样",passage:"今天天气怎么样？这里的天不太好，下雨了。雨大吗？有点儿大，我觉得很冷。",passagePinyin:"Jīntiān tiānqì zěnmeyàng? Zhèlǐ de tiān bú tài hǎo, xià yǔ le. Yǔ dà ma? Yǒudiǎnr dà, wǒ juéde hěn lěng.",questions:[{question:"今天天气怎么样？",questionPinyin:"Jīntiān tiānqì zěnmeyàng?",answer:"不太好",answerPinyin:"bú tài hǎo",options:["不太好","很好","很热","不知道"]},{question:"下雨了吗？",questionPinyin:"Xià yǔ le ma?",answer:"下雨了",answerPinyin:"xià yǔ le",options:["下雨了","下雪了","没下雨","不知道"]},{question:"王一飞觉得怎么样？",questionPinyin:"Wáng Yīfēi juéde zěnmeyàng?",answer:"很冷",answerPinyin:"hěn lěng",options:["很冷","很热","很忙","很好"]}]},
    {title:"课文二：生病了",passage:"昨天下雪了。是的，太冷了。你昨天没来公司，生病了？对，我昨天去医院看病了。",passagePinyin:"Zuótiān xià xuě le. Shì de, tài lěng le. Nǐ zuótiān méi lái gōngsī, shēngbìng le? Duì, wǒ zuótiān qù yīyuàn kànbìng le.",questions:[{question:"昨天天气怎么样？",questionPinyin:"Zuótiān tiānqì zěnmeyàng?",answer:"下雪了",answerPinyin:"xià xuě le",options:["下雪了","下雨了","很热","很好"]},{question:"杨同乐昨天来公司了吗？",questionPinyin:"Yáng Tónglè zuótiān lái gōngsī le ma?",answer:"没有",answerPinyin:"méiyǒu",options:["没有","来了","不知道","是的"]},{question:"杨同乐昨天去哪儿了？",questionPinyin:"Yáng Tónglè zuótiān qù nǎr le?",answer:"医院",answerPinyin:"yīyuàn",options:["医院","公司","商店","学校"]}]},
    {title:"课文三：看病",passage:"医生，我病了。我看看。你觉得怎么样？我很冷。好的，吃一点儿药，今天休息半天吧。回家后再喝些热水。",passagePinyin:"Yīshēng, wǒ bìng le. Wǒ kànkan. Nǐ juéde zěnmeyàng? Wǒ hěn lěng. Hǎo de, chī yìdiǎnr yào, jīntiān xiūxi bàn tiān ba. Huí jiā hòu zài hē xiē rè shuǐ.",questions:[{question:"杨同乐怎么了？",questionPinyin:"Yáng Tónglè zěnme le?",answer:"病了",answerPinyin:"bìng le",options:["病了","下雪了","回家了","上班了"]},{question:"医生让他吃什么？",questionPinyin:"Yīshēng ràng tā chī shénme?",answer:"药",answerPinyin:"yào",options:["药","苹果","米饭","牛奶"]},{question:"回家后喝什么？",questionPinyin:"Huí jiā hòu hē shénme?",answer:"热水",answerPinyin:"rè shuǐ",options:["热水","茶","牛奶","冷水"]}]}
  ],
  pictureTalk:[
    {question:"今天天气怎么样？",questionPinyin:"Jīntiān tiānqì zěnmeyàng?",image:"v01_tianqi.png",sampleAnswer:"今天天气很好。",sampleAnswerPinyin:"Jīntiān tiānqì hěn hǎo.",patternType:"天气怎么样"},
    {question:"这里怎么了？",questionPinyin:"Zhèlǐ zěnme le?",image:"v04_xiayu.png",sampleAnswer:"这里下雨了。",sampleAnswerPinyin:"Zhèlǐ xià yǔ le.",patternType:"了"},
    {question:"他觉得怎么样？",questionPinyin:"Tā juéde zěnmeyàng?",image:"v09_leng.png",sampleAnswer:"他觉得很冷。",sampleAnswerPinyin:"Tā juéde hěn lěng.",patternType:"觉得"},
    {question:"昨天天气怎么样？",questionPinyin:"Zuótiān tiānqì zěnmeyàng?",image:"v10_xue.png",sampleAnswer:"昨天下雪了。",sampleAnswerPinyin:"Zuótiān xià xuě le.",patternType:"下雪了"},
    {question:"这是哪里？",questionPinyin:"Zhè shì nǎli?",image:"v11_gongsi.png",sampleAnswer:"这是公司。",sampleAnswerPinyin:"Zhè shì gōngsī.",patternType:"地点"},
    {question:"他怎么了？",questionPinyin:"Tā zěnme le?",image:"v12_shengbing.png",sampleAnswer:"他生病了。",sampleAnswerPinyin:"Tā shēngbìng le.",patternType:"生病了"},
    {question:"他在做什么？",questionPinyin:"Tā zài zuò shénme?",image:"v13_kanbing.png",sampleAnswer:"他在看病。",sampleAnswerPinyin:"Tā zài kànbìng.",patternType:"看病"},
    {question:"医生让他喝什么？",questionPinyin:"Yīshēng ràng tā hē shénme?",image:"v21_shui.png",sampleAnswer:"医生让他喝热水。",sampleAnswerPinyin:"Yīshēng ràng tā hē rè shuǐ.",patternType:"热水"}
  ],
  hanziChars:"天气这里天下雨了觉得冷雪公司生病看病一点儿药回再喝热水",
  hanziGroups:[{id:"weather",title:"天气",vocabularyIds:["v_l12_01","v_l12_02","v_l12_03","v_l12_04","v_l12_06","v_l12_09","v_l12_10"]},{id:"health",title:"身体与看病",vocabularyIds:["v_l12_12","v_l12_13","v_l12_14","v_l12_15","v_l12_16"]},{id:"actions",title:"动作与感觉",vocabularyIds:["v_l12_07","v_l12_08","v_l12_17","v_l12_18","v_l12_19","v_l12_20","v_l12_21"]}],
  postClassHomework:{mode:"required_optional",instructions:{required:"必选：完成汉字书写。",optional:"可选：选择一个输出任务完成。"},required:[{id:"post_l12_req_01",type:"handwriting",prompt_cn:"必选：书写本课汉字。",characters:"天气这里下雨了觉得冷雪公司生病看病药回再喝热水".split(""),instructions:"每个字至少写 3 次。",sourceType:"textbook"}],optional:[{id:"post_l12_opt_01",type:"writing",prompt_cn:"教学扩展：写 3 句天气或身体情况。",openEnded:true,sourceType:"teaching_extension"},{id:"post_l12_opt_02",type:"oral_prepare",prompt_cn:"准备 4 句对话：问天气或问身体情况。",openEnded:true,sourceType:"teaching_extension"}]},
  reportFocus:["天气表达","了","太……了","生病/看病"]
});

fs.mkdirSync(outDir, { recursive: true });
for (const lesson of [L11, L12]) {
  const file = path.join(outDir, `${lesson.meta.lessonKey}.json`);
  fs.writeFileSync(file, JSON.stringify(lesson, null, 2) + "\n", "utf8");
  console.log(`Wrote ${file}`);
}
