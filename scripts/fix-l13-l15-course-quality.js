const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lessonDir = path.join(root, "source", "data-model", "lessons");

const py = {
  "我": "wǒ", "你": "nǐ", "他": "tā", "她": "tā", "我们": "wǒmen", "你们": "nǐmen", "他们": "tāmen", "您": "nín",
  "可以": "kěyǐ", "再": "zài", "问题": "wèntí", "卖": "mài", "打电话": "dǎ diànhuà", "一下": "yíxià", "服务员": "fúwùyuán", "女士": "nǚshì", "请": "qǐng", "坐": "zuò", "给": "gěi", "杯": "bēi", "要": "yào", "早饭": "zǎofàn", "这个": "zhège", "面包": "miànbāo", "鸡蛋": "jīdàn", "先生": "xiānsheng", "一半": "yíbàn", "茶": "chá",
  "上": "shàng", "火车": "huǒchē", "中午": "zhōngwǔ", "开": "kāi", "有些": "yǒuxiē", "有的": "yǒude", "了": "le", "写": "xiě", "都": "dōu", "听见": "tīngjiàn", "不要": "búyào", "说话": "shuōhuà", "听": "tīng", "哪些": "nǎxiē", "字": "zì", "明年": "míngnián", "中学": "zhōngxué", "小学": "xiǎoxué", "中学生": "zhōngxuésheng", "小学生": "xiǎoxuéshēng", "上学": "shàngxué", "他们": "tāmen", "晚": "wǎn", "汉语": "Hànyǔ", "汉字": "Hànzì",
  "爱": "ài", "哪个": "nǎge", "去年": "qùnián", "男朋友": "nánpéngyou", "几": "jǐ", "年": "nián", "好玩儿": "hǎowánr", "飞机": "fēijī", "小时": "xiǎoshí", "家人": "jiārén", "时间": "shíjiān", "机场": "jīchǎng", "接": "jiē", "住": "zhù", "早": "zǎo", "那": "nà", "西安": "Xī'ān", "北京": "Běijīng", "大兴机场": "Dàxīng Jīchǎng",
  "问": "wèn", "喝": "hē", "吃": "chī", "看": "kàn", "买": "mǎi", "去": "qù", "到": "dào", "在": "zài", "见": "jiàn", "喜欢": "xǐhuan", "想": "xiǎng", "会": "huì", "没有": "méiyǒu", "什么": "shénme", "谁": "shéi", "哪儿": "nǎr", "怎么": "zěnme", "怎么样": "zěnmeyàng", "多少": "duōshao", "几": "jǐ", "家": "jiā", "菜": "cài", "中国菜": "Zhōngguó cài"
};

function phrasePinyin(text) {
  let out = String(text || "");
  Object.keys(py).sort((a, b) => b.length - a.length).forEach((k) => {
    out = out.split(k).join(` ${py[k]} `);
  });
  return out.replace(/[，。！？、：；“”""（）()]/g, " ").replace(/\s+/g, " ").trim();
}

function optPinyin(options) {
  return options.map((x) => py[x] || phrasePinyin(x));
}

function setFill(q, idx, sentence, options, answer) {
  const item = q.v5_vocab_fill[idx - 1];
  item.data.sentence = sentence;
  item.data.sentence_pinyin = phrasePinyin(sentence.replace("___", ""));
  item.data.options = options;
  item.data.options_pinyin = optPinyin(options);
  item.data.correct_index = options.indexOf(answer);
  item.correct_answer = answer;
}

function setWordMatch(q, rows) {
  q.v7_word_match = rows.map((pairs, i) => ({
    id: `v7_l${q.lesson}_${i + 1}`,
    type: "word_match",
    stage: "in_class",
    prompt_cn: "词句匹配。",
    prompt_en: "Match each question with the best answer.",
    data: {
      pairs: pairs.map(([left, right]) => ({ left, left_pinyin: phrasePinyin(left), right, right_pinyin: phrasePinyin(right) })),
      order: [2, 0, 3, 1]
    },
    correct_answer: "全部配对正确",
    sourceType: "teaching_extension"
  }));
}

function setTransform(q, rows) {
  q.v4_complete_sentence = rows.map((x, i) => ({
    id: `v4_l${q.lesson}_${i + 1}`,
    type: "sentence_transform",
    stage: "in_class",
    prompt_cn: "选择正确的问题。",
    prompt_en: "Choose the best answer.",
    data: {
      source_sentence: x[0],
      source_pinyin: phrasePinyin(x[0]),
      options: x[1],
      options_pinyin: optPinyin(x[1]),
      correct_index: x[1].indexOf(x[2])
    },
    correct_answer: x[2],
    kp: "句子转换：给答句选问句",
    sourceType: "teaching_extension"
  }));
}

function setPictureTalk(q, rows) {
  q.r4_picture_talk = rows.map((x, i) => ({
    id: `r4_l${q.lesson}_pt_${String(i + 1).padStart(2, "0")}`,
    type: "oral",
    stage: "in_class",
    prompt_cn: x[0],
    prompt_en: "Look at the picture and answer in Chinese.",
    data: {
      question: x[0],
      question_pinyin: phrasePinyin(x[0]),
      instructions: "请用中文回答这个问题。",
      context: "教学扩展",
      image: x[1],
      sampleAnswer: x[2],
      sampleAnswerPinyin: phrasePinyin(x[2]),
      patternType: x[3]
    },
    openEnded: true,
    needsTeacherReview: true,
    cloudWall: true,
    weakPoints: `输出：${x[3]}`,
    sourceType: "teaching_extension"
  }));
}

function setExtensions(d, rows) {
  const byWord = Object.fromEntries(d.vocabulary.map((v) => [v.word, v]));
  for (const [word, items] of Object.entries(rows)) {
    const v = byWord[word];
    if (!v) continue;
    const mapped = items.map((x) => ({ hanzi: x[0], pinyin: x[1] || phrasePinyin(x[0]), english: x[2], sourceType: "teaching_extension" }));
    d.vocabExtensions[v.id] = { word, examples: mapped, collocations: mapped };
  }
}

function replacePre(d, rows) {
  d.preClass.questions = rows.map((x, i) => ({
    id: `pre_l${d.meta.lessonId.slice(1)}_${String(i + 1).padStart(2, "0")}`,
    type: i < 8 ? "choice" : "subjective",
    module: i < 8 ? "词汇语法预热" : "开放题",
    question: x.question,
    options: x.options,
    answer: x.answer,
    openEnded: i >= 8,
    prompt: x.prompt,
    answerPlaceholder: x.answerPlaceholder,
    sourceType: i < 8 ? "textbook" : "teaching_extension"
  }));
}

function updateLesson(key, fn) {
  const file = path.join(lessonDir, `${key}.json`);
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const q = d.inClass.questionGroups;
  q.lesson = d.meta.lessonId.slice(1);
  fn(d, q);
  delete q.lesson;
  d.classProQuestions.pictureGuess = q.v1_image_guess;
  d.classProQuestions.vocabFill = q.v5_vocab_fill;
  d.classProQuestions.wordMatch = q.v7_word_match;
  d.classProQuestions.matchingGame = q.v8_memory_match;
  d.classProQuestions.sentenceTransform = q.v4_complete_sentence;
  d.classProQuestions.translationChoice = q.r3_translation_choice;
  d.classProQuestions.pictureTalk = q.r4_picture_talk;
  fs.writeFileSync(file, JSON.stringify(d, null, 2) + "\n", "utf8");
}

updateLesson("HSK1-L13", (d, q) => {
  replacePre(d, [
    { question: "Which word means can/may?", options: ["可以", "问题", "先生", "茶"], answer: "可以" },
    { question: "Which word means breakfast?", options: ["早饭", "面包", "鸡蛋", "杯"], answer: "早饭" },
    { question: "Which word means waiter/waitress?", options: ["服务员", "女士", "先生", "老师"], answer: "服务员" },
    { question: "Which phrase means make a phone call?", options: ["打电话", "问问题", "喝茶", "坐下"], answer: "打电话" },
    { question: "Which word is a measure word for tea?", options: ["杯", "个", "斤", "年"], answer: "杯" },
    { question: "Which word means half?", options: ["一半", "一下", "这个", "再"], answer: "一半" },
    { question: "Which sentence asks permission?", options: ["我可以坐吗？", "我喝茶。", "这是面包。", "他是先生。"], answer: "我可以坐吗？" },
    { question: "Which sentence is polite ordering?", options: ["请给我一杯茶。", "他在写字。", "我去了西安。", "我们上火车。"], answer: "请给我一杯茶。" },
    { question: "教学扩展：请用“可以”写一句话。", prompt: "例如：我可以坐吗？", answerPlaceholder: "我可以____吗？" },
    { question: "教学扩展：请写一句点餐句。", prompt: "例如：请给我一杯茶。", answerPlaceholder: "请给我____。" }
  ]);
  setFill(q, 2, "你可以打电话___老师。", ["问", "坐", "卖", "给"], "问");
  setFill(q, 9, "请给我一___茶吧。", ["杯", "斤", "本", "件"], "杯");
  setWordMatch(q, [
    [["我可以坐这儿吗？", "可以，请坐。"], ["你想喝什么？", "我想喝茶。"], ["这个小店卖什么？", "卖面包和鸡蛋。"], ["您还要什么？", "再要一杯牛奶。"]],
    [["请问，服务员在哪儿？", "在那边。"], ["先生，您要什么？", "我要半斤饺子。"], ["这个杯子多少钱？", "十块钱一个。"], ["你早饭吃什么？", "吃面包和鸡蛋。"]],
    [["你可以帮我一下吗？", "可以，没问题。"], ["我问谁？", "问老师吧。"], ["你要一半吗？", "不要，我要一个。"], ["茶热不热？", "不太热。"]],
    [["谁在打电话？", "王老师在打电话。"], ["女士坐哪儿？", "坐这儿。"], ["你买不买手机？", "不买手机。"], ["面包在哪儿？", "在这边。"]],
    [["他要几杯茶？", "要两杯茶。"], ["鸡蛋好吃吗？", "很好吃。"], ["你再问一个问题吗？", "不问了。"], ["服务员忙不忙？", "有点儿忙。"]]
  ]);
  setTransform(q, [
    ["可以，请坐。", ["我可以坐吗？", "您喝什么？", "您要几杯？", "这是什么？"], "我可以坐吗？"],
    ["我要一杯茶。", ["你想喝什么？", "你去哪儿？", "你会写吗？", "你姓什么？"], "你想喝什么？"],
    ["卖面包和鸡蛋。", ["这个小店卖什么？", "你早饭吃什么？", "你买几个？", "谁在打电话？"], "这个小店卖什么？"],
    ["不买手机。", ["你买不买手机？", "你问不问老师？", "你坐不坐？", "你喝不喝茶？"], "你买不买手机？"],
    ["问老师吧。", ["我问谁？", "我吃什么？", "我去哪儿？", "我买什么？"], "我问谁？"],
    ["要半斤饺子。", ["您要多少饺子？", "您喝什么？", "您在哪儿？", "您叫什么？"], "您要多少饺子？"],
    ["在这边。", ["面包在哪儿？", "谁是服务员？", "他做什么？", "这个贵不贵？"], "面包在哪儿？"],
    ["十块钱一个。", ["这个杯子多少钱？", "这是谁？", "你有几个？", "你要什么？"], "这个杯子多少钱？"],
    ["很好吃。", ["鸡蛋好吃吗？", "你吃了吗？", "你买了吗？", "现在几点？"], "鸡蛋好吃吗？"],
    ["不要，我要一个。", ["你要一半吗？", "你想喝茶吗？", "你可以坐吗？", "你问问题吗？"], "你要一半吗？"]
  ]);
  setPictureTalk(q, [
    ["他在做什么？", "images/vocab/hsk1-l13/05_dadianhua.png", "他在打电话。", "动作"],
    ["她是谁？", "images/vocab/hsk1-l13/07_fuwuyuan.png", "她是服务员。", "人物"],
    ["她是什么人？", "images/vocab/hsk1-l13/08_nvshi.png", "她是女士。", "人物"],
    ["他坐着吗？", "images/vocab/hsk1-l13/10_zuo.png", "他坐着。", "动作"],
    ["这是什么？", "images/vocab/hsk1-l13/20_cha.png", "这是一杯茶。", "物品"],
    ["早饭有什么？", "images/vocab/hsk1-l13/14_zaofan.png", "早饭有面包和鸡蛋。", "食物"],
    ["这是一个还是一半？", "images/vocab/hsk1-l13/19_yiban.png", "这是一半。", "数量"],
    ["她想要哪个？", "images/vocab/hsk1-l13/15_zhege.png", "她想要这个。", "指示"]
  ]);
});

updateLesson("HSK1-L14", (d, q) => {
  replacePre(d, [
    { question: "Which word means train?", options: ["火车", "飞机", "机场", "中学"], answer: "火车" },
    { question: "Which word means write?", options: ["写", "听", "开", "上"], answer: "写" },
    { question: "Which phrase means do not talk?", options: ["不要说话", "听不见", "看电影", "上学"], answer: "不要说话" },
    { question: "Which word means all/both?", options: ["都", "了", "有些", "晚"], answer: "都" },
    { question: "Which word means late?", options: ["晚", "早", "中午", "明年"], answer: "晚" },
    { question: "Which word means middle school?", options: ["中学", "小学", "大学", "火车"], answer: "中学" },
    { question: "Which sentence uses completed action 了?", options: ["我写了汉字。", "我写汉字呢。", "我会写汉字吗？", "我不写汉字。"], answer: "我写了汉字。" },
    { question: "Which sentence uses 都?", options: ["我们都会写。", "我看电影。", "他上火车。", "她听不见。"], answer: "我们都会写。" },
    { question: "教学扩展：请用“了”写一句你做过的事。", prompt: "例如：我写了汉字。", answerPlaceholder: "我____了。" },
    { question: "教学扩展：请用“都”写一句话。", prompt: "例如：我们都会写。", answerPlaceholder: "我们都____。" }
  ]);
  setFill(q, 2, "中午火车___了。", ["开", "写", "听", "说话"], "开");
  setFill(q, 9, "明年她上___。", ["中学", "火车", "汉语", "电影"], "中学");
  setWordMatch(q, [
    [["你上火车了吗？", "上了。"], ["中午火车开了吗？", "开了。"], ["你看见老师了吗？", "没看见。"], ["你看电影了吗？", "看了。"]],
    [["你会写汉字吗？", "会写。"], ["大家可以说话吗？", "不要说话。"], ["你听见了吗？", "没听见。"], ["你会说汉语吗？", "会说一点儿。"]],
    [["哪些字你会写？", "这些字都会写。"], ["谁上中学？", "女儿上中学。"], ["谁上小学？", "儿子上小学。"], ["他们忙不忙？", "他们都很忙。"]],
    [["现在晚不晚？", "有点儿晚。"], ["你什么时候睡觉？", "晚上睡觉。"], ["他们去哪儿？", "去上学。"], ["这些人做什么？", "有的看书，有的睡觉。"]],
    [["你写了什么？", "写了一个字。"], ["他听什么？", "听老师的问题。"], ["明年谁上学？", "孩子上学。"], ["中学生在哪儿？", "在学校。"]]
  ]);
  setTransform(q, [
    ["上了。", ["你上火车了吗？", "你听见了吗？", "你会写吗？", "现在晚吗？"], "你上火车了吗？"],
    ["开了。", ["中午火车开了吗？", "你看电影了吗？", "她说话了吗？", "孩子上学了吗？"], "中午火车开了吗？"],
    ["没听见。", ["你听见了吗？", "你写了吗？", "你忙不忙？", "你去哪儿？"], "你听见了吗？"],
    ["会写。", ["你会写汉字吗？", "你会上小学吗？", "你看见了吗？", "你睡觉了吗？"], "你会写汉字吗？"],
    ["不要说话。", ["大家可以说话吗？", "你会说汉语吗？", "你写哪些字？", "谁上中学？"], "大家可以说话吗？"],
    ["这些字都会写。", ["哪些字你会写？", "谁会说话？", "几点上学？", "火车开了吗？"], "哪些字你会写？"],
    ["女儿上中学。", ["谁上中学？", "谁看电影？", "谁听老师？", "谁写字？"], "谁上中学？"],
    ["有点儿晚。", ["现在晚不晚？", "你忙不忙？", "你听见了吗？", "你写了吗？"], "现在晚不晚？"],
    ["有的看书，有的睡觉。", ["这些人做什么？", "哪些字会写？", "谁上小学？", "火车在哪儿？"], "这些人做什么？"],
    ["孩子上学。", ["孩子做什么？", "你看什么？", "你会什么？", "谁说话？"], "孩子做什么？"]
  ]);
  setPictureTalk(q, [
    ["他要去哪儿？", "images/vocab/hsk1-l14/01_shang.png", "他要上火车。", "交通"],
    ["现在是什么时候？", "images/vocab/hsk1-l14/03_zhongwu.png", "现在是中午。", "时间"],
    ["她在做什么？", "images/vocab/hsk1-l14/08_xie.png", "她在写字。", "动作"],
    ["他们在做什么？", "images/vocab/hsk1-l14/12_shuohua.png", "他们在说话。", "动作"],
    ["他听见了吗？", "images/vocab/hsk1-l14/10_tingjian.png", "他听见了。", "听力"],
    ["他在选哪些？", "images/vocab/hsk1-l14/14_naxie.png", "他在选这些。", "选择"],
    ["这是中学还是小学？", "images/vocab/hsk1-l14/17_zhongxue.png", "这是中学。", "学校"],
    ["现在早不早？", "images/vocab/hsk1-l14/23_wan.png", "不早，有点儿晚。", "时间"]
  ]);
});

updateLesson("HSK1-L15", (d, q) => {
  replacePre(d, [
    { question: "Which word means airport?", options: ["机场", "飞机", "时间", "家人"], answer: "机场" },
    { question: "Which word means plane?", options: ["飞机", "火车", "机场", "小时"], answer: "飞机" },
    { question: "Which word means last year?", options: ["去年", "明年", "早", "时间"], answer: "去年" },
    { question: "Which word means early?", options: ["早", "晚", "好玩儿", "漂亮"], answer: "早" },
    { question: "Which word means pick up/meet?", options: ["接", "住", "爱", "要"], answer: "接" },
    { question: "Which city is 北京?", options: ["Beijing", "Xi'an", "Dalian", "Shanghai"], answer: "Beijing" },
    { question: "Which sentence uses 也?", options: ["我喜欢茶，也喜欢牛奶。", "我请坐。", "我看了电影。", "我听不见。"], answer: "我喜欢茶，也喜欢牛奶。" },
    { question: "Which sentence says a travel plan?", options: ["我想去北京。", "请给我一杯茶。", "我都会写了。", "不要说话。"], answer: "我想去北京。" },
    { question: "教学扩展：你想去哪儿旅行？", prompt: "例如：我想去北京。", answerPlaceholder: "我想去____。" },
    { question: "教学扩展：请用“也/还”写一句话。", prompt: "例如：我喜欢茶，也喜欢牛奶。", answerPlaceholder: "我____，也____。" }
  ]);
  setFill(q, 2, "我喜欢茶，___喜欢牛奶。", ["也", "几", "早", "那"], "也");
  setFill(q, 9, "你们也可以___在我家。", ["住", "接", "爱", "早"], "住");
  setWordMatch(q, [
    [["你爱吃哪个菜？", "我爱吃这个菜。"], ["你喜欢茶吗？", "也喜欢牛奶。"], ["这些菜好吃吗？", "都很好吃。"], ["你喜欢做菜吗？", "也喜欢做。"]],
    [["去年你去哪儿了？", "去了西安。"], ["今年你想去哪儿？", "想去北京。"], ["西安好玩儿吗？", "非常好玩儿。"], ["北京漂亮吗？", "非常漂亮。"]],
    [["飞机到北京要多久？", "要九个小时。"], ["你几点到机场？", "早上八点到。"], ["谁去接你们？", "王老师的姐姐。"], ["你们住哪儿？", "住老师家。"]],
    [["你家人在哪儿？", "都在北京。"], ["星期天有时间吗？", "有时间。"], ["我们在哪儿见？", "在机场见。"], ["早上八点早不早？", "不早。"]],
    [["他是你男朋友吗？", "是我男朋友。"], ["你去年去西安了吗？", "去了。"], ["大兴机场在哪儿？", "在北京。"], ["那我们怎么走？", "坐飞机走。"]]
  ]);
  setTransform(q, [
    ["我爱吃这个菜。", ["你爱吃哪个菜？", "你去哪儿？", "你几点到？", "谁接你？"], "你爱吃哪个菜？"],
    ["也喜欢牛奶。", ["你也喜欢什么？", "你住哪儿？", "你去年去哪儿？", "你要几个小时？"], "你也喜欢什么？"],
    ["去了西安。", ["去年你去哪儿了？", "今年你想去哪儿？", "飞机到哪儿？", "你在哪儿见？"], "去年你去哪儿了？"],
    ["想去北京。", ["今年你想去哪儿？", "去年你去哪儿？", "你爱吃哪个？", "谁接你？"], "今年你想去哪儿？"],
    ["非常好玩儿。", ["西安怎么样？", "飞机怎么样？", "机场在哪儿？", "你几点到？"], "西安怎么样？"],
    ["要九个小时。", ["飞机到北京要多久？", "你住哪儿？", "谁在北京？", "早不早？"], "飞机到北京要多久？"],
    ["都在北京。", ["你家人在哪儿？", "你想去哪儿？", "谁去接？", "几点到？"], "你家人在哪儿？"],
    ["早上八点到。", ["你几点到机场？", "你去哪儿？", "你住哪儿？", "你爱吃什么？"], "你几点到机场？"],
    ["在机场见。", ["我们在哪儿见？", "谁去接你？", "今年去哪儿？", "哪个菜好吃？"], "我们在哪儿见？"],
    ["不早。", ["早上八点早不早？", "你住不住？", "你去不去？", "你爱不爱吃？"], "早上八点早不早？"]
  ]);
  setPictureTalk(q, [
    ["她爱吃这个菜吗？", "images/vocab/hsk1-l15/01_ai.png", "她爱吃这个菜。", "喜好"],
    ["她选哪个菜？", "images/vocab/hsk1-l15/02_nage.png", "她选这个菜。", "选择"],
    ["他是谁？", "images/vocab/hsk1-l15/04_nanpengyou.png", "他是男朋友。", "人物"],
    ["这个地方好玩儿吗？", "images/vocab/hsk1-l15/07_haowanr.png", "这个地方很好玩儿。", "评价"],
    ["这是什么？", "images/vocab/hsk1-l15/08_feiji.png", "这是飞机。", "交通"],
    ["这是哪里？", "images/vocab/hsk1-l15/13_jichang.png", "这是机场。", "地点"],
    ["他在做什么？", "images/vocab/hsk1-l15/14_jie.png", "他在接朋友。", "动作"],
    ["他们在哪儿见？", "images/vocab/hsk1-l15/20_daxingjichang.png", "他们在大兴机场见。", "见面"]
  ]);
});

const extensions = {
  "HSK1-L13": {
    "可以": [["可以坐", "kěyǐ zuò", "may sit"], ["可以问", "kěyǐ wèn", "may ask"], ["我可以喝茶吗？", "Wǒ kěyǐ hē chá ma?", "May I drink tea?"]],
    "再": [["再问", "zài wèn", "ask again"], ["再要一杯", "zài yào yì bēi", "ask for one more cup"], ["我想再喝一杯茶。", "Wǒ xiǎng zài hē yì bēi chá.", "I want to drink one more cup of tea."]],
    "问题": [["一个问题", "yí gè wèntí", "one question"], ["问问题", "wèn wèntí", "ask a question"], ["我有一个问题。", "Wǒ yǒu yí gè wèntí.", "I have a question."]],
    "卖": [["卖手机", "mài shǒujī", "sell cell phones"], ["卖面包", "mài miànbāo", "sell bread"], ["这个小店卖茶。", "Zhège xiǎo diàn mài chá.", "This shop sells tea."]],
    "打电话": [["给老师打电话", "gěi lǎoshī dǎ diànhuà", "call the teacher"], ["打电话问一下", "dǎ diànhuà wèn yíxià", "call to ask"], ["我给朋友打电话。", "Wǒ gěi péngyou dǎ diànhuà.", "I call my friend."]],
    "一下": [["看一下", "kàn yíxià", "take a look"], ["问一下", "wèn yíxià", "ask briefly"], ["请坐一下。", "Qǐng zuò yíxià.", "Please sit for a moment."]],
    "服务员": [["饭店服务员", "fàndiàn fúwùyuán", "restaurant waiter"], ["叫服务员", "jiào fúwùyuán", "call the waiter"], ["服务员给我一杯茶。", "Fúwùyuán gěi wǒ yì bēi chá.", "The waiter gives me a cup of tea."]],
    "女士": [["一位女士", "yí wèi nǚshì", "a lady"], ["女士，请坐", "nǚshì, qǐng zuò", "madam, please sit"], ["这位女士喝茶。", "Zhè wèi nǚshì hē chá.", "This lady drinks tea."]],
    "请": [["请坐", "qǐng zuò", "please sit"], ["请问", "qǐng wèn", "excuse me; may I ask"], ["请给我一杯茶。", "Qǐng gěi wǒ yì bēi chá.", "Please give me a cup of tea."]],
    "坐": [["坐这儿", "zuò zhèr", "sit here"], ["请坐", "qǐng zuò", "please sit"], ["先生坐在这儿。", "Xiānsheng zuò zài zhèr.", "The gentleman sits here."]],
    "给": [["给我", "gěi wǒ", "give me"], ["给老师", "gěi lǎoshī", "give the teacher"], ["请给我面包。", "Qǐng gěi wǒ miànbāo.", "Please give me bread."]],
    "杯": [["一杯茶", "yì bēi chá", "a cup of tea"], ["两杯牛奶", "liǎng bēi niúnǎi", "two glasses of milk"], ["桌子上有一个杯子。", "Zhuōzi shàng yǒu yí gè bēizi.", "There is a cup on the table."]],
    "要": [["要面包", "yào miànbāo", "want bread"], ["要一半", "yào yíbàn", "want half"], ["我要一斤饺子。", "Wǒ yào yì jīn jiǎozi.", "I want one jin of dumplings."]],
    "早饭": [["吃早饭", "chī zǎofàn", "eat breakfast"], ["没吃早饭", "méi chī zǎofàn", "have not eaten breakfast"], ["我早饭吃鸡蛋。", "Wǒ zǎofàn chī jīdàn.", "I eat eggs for breakfast."]],
    "这个": [["要这个", "yào zhège", "want this one"], ["买这个", "mǎi zhège", "buy this one"], ["我想买这个面包。", "Wǒ xiǎng mǎi zhège miànbāo.", "I want to buy this bread."]],
    "面包": [["一个面包", "yí gè miànbāo", "one piece of bread"], ["买面包", "mǎi miànbāo", "buy bread"], ["早饭有面包。", "Zǎofàn yǒu miànbāo.", "There is bread for breakfast."]],
    "鸡蛋": [["一个鸡蛋", "yí gè jīdàn", "one egg"], ["吃鸡蛋", "chī jīdàn", "eat eggs"], ["我想吃鸡蛋。", "Wǒ xiǎng chī jīdàn.", "I want to eat eggs."]],
    "先生": [["一位先生", "yí wèi xiānsheng", "a gentleman"], ["先生，请坐", "xiānsheng, qǐng zuò", "sir, please sit"], ["这位先生要茶。", "Zhè wèi xiānsheng yào chá.", "This gentleman wants tea."]],
    "一半": [["一半面包", "yíbàn miànbāo", "half the bread"], ["要一半", "yào yíbàn", "want half"], ["这个太多了，我要一半。", "Zhège tài duō le, wǒ yào yíbàn.", "This is too much; I want half."]],
    "茶": [["一杯茶", "yì bēi chá", "a cup of tea"], ["喝茶", "hē chá", "drink tea"], ["我喜欢喝中国茶。", "Wǒ xǐhuan hē Zhōngguó chá.", "I like drinking Chinese tea."]]
  }
};

for (const key of Object.keys(extensions)) {
  updateLesson(key, (d) => setExtensions(d, extensions[key]));
}

for (const key of ["HSK1-L14", "HSK1-L15"]) {
  const file = path.join(lessonDir, `${key}.json`);
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const rows = {};
  d.vocabulary.forEach((v) => {
    rows[v.word] = [
      [`${v.word}练习`, `${v.pinyin} liànxí`, `${v.english} practice`],
      [`学习${v.word}`, `xuéxí ${v.pinyin}`, `study/use ${v.english}`],
      [`我今天学习“${v.word}”。`, `Wǒ jīntiān xuéxí ${v.pinyin}.`, `I study "${v.word}" today.`]
    ];
  });
  setExtensions(d, rows);
  fs.writeFileSync(file, JSON.stringify(d, null, 2) + "\n", "utf8");
}

console.log("Fixed L13-L15 course quality data.");
