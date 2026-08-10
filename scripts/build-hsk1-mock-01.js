const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "source", "data-model", "mock-tests", "HSK1-mock-01.json");

function opt(id, text, image) {
  return image ? { id, text, image } : { id, text };
}

const img = {
  taxi: "../in-class/images/vocab/hsk1-l06/v22_chuzuche.png",
  cinema: "../in-class/images/vocab/hsk1-l07/v05_dianyingyuan.png",
  movie: "../in-class/images/vocab/hsk1-l07/v06_dianying.png",
  hospital: "../in-class/images/vocab/hsk1-l07/v09_yiyuan.png",
  milk: "../in-class/images/vocab/hsk1-l06/v12_niunai.png",
  book: "../in-class/images/vocab/hsk1-l09/v08_dushu.png",
  school: "../in-class/images/vocab/hsk1-l08/v08_xuexiao_qian.png",
  table: "../in-class/images/vocab/hsk1-l08/v05_zhuozi.png",
  cat: "../in-class/images/vocab/hsk1-l08/v03_mao.png",
  supermarket: "../in-class/images/vocab/hsk1-l06/v08_chaoshi.png",
  rice: "../in-class/images/vocab/hsk1-l06/v19_mifan.png",
  noodles: "../in-class/images/vocab/hsk1-l05/v12_miantiaor.png",
  dumplings: "../in-class/images/vocab/hsk1-l05/v13_jiaozi.png",
  phone: "../in-class/images/vocab/hsk1-l06/v01_shouji.png",
  room: "../in-class/images/vocab/hsk1-l08/v01_fangjian.png",
  deskUnder: "../in-class/images/vocab/hsk1-l08/v06_zhuozi_xia.png",
  work: "../in-class/images/vocab/hsk1-l07/v10_shangban.png",
  offWork: "../in-class/images/vocab/hsk1-l07/v11_xiaban.png",
  rest: "../in-class/images/vocab/hsk1-l05/v08_xiuxi.png",
  date: "../in-class/images/vocab/hsk1-l05/v03_yue_month.png"
};

const listening = [
  {
    id: "L01", number: 1, part: "L1_picture_choice",
    audioText: "我坐出租车去学校。",
    options: [opt("A", "坐出租车去学校", img.taxi), opt("B", "去电影院看电影", img.cinema), opt("C", "在医院工作", img.hospital)],
    answer: "A", knowledge: ["坐", "出租车", "去学校"]
  },
  {
    id: "L02", number: 2, part: "L1_picture_choice",
    audioText: "她在医院工作。",
    options: [opt("A", "买牛奶", img.milk), opt("B", "在医院工作", img.hospital), opt("C", "读书", img.book)],
    answer: "B", knowledge: ["医院", "工作"]
  },
  {
    id: "L03", number: 3, part: "L1_picture_choice",
    audioText: "我想买一些牛奶。",
    options: [opt("A", "看电影", img.movie), opt("B", "买牛奶", img.milk), opt("C", "吃米饭", img.rice)],
    answer: "B", knowledge: ["买", "一些", "牛奶"]
  },
  {
    id: "L04", number: 4, part: "L1_picture_choice",
    audioText: "小猫在桌子下边。",
    options: [opt("A", "桌子", img.table), opt("B", "小猫", img.cat), opt("C", "桌子下边", img.deskUnder)],
    answer: "C", knowledge: ["小猫", "桌子", "下边"]
  },
  {
    id: "L05", number: 5, part: "L1_picture_choice",
    audioText: "我们去超市买东西。",
    options: [opt("A", "学校前边", img.school), opt("B", "超市", img.supermarket), opt("C", "电影院", img.cinema)],
    answer: "B", knowledge: ["去", "超市", "买东西"]
  },
  {
    id: "L06", number: 6, part: "L2_answer_choice",
    audioText: "你叫什么名字？",
    options: [opt("A", "我叫安妮。"), opt("B", "我在学校。"), opt("C", "今天星期日。")],
    answer: "A", knowledge: ["叫什么", "名字"]
  },
  {
    id: "L07", number: 7, part: "L2_answer_choice",
    audioText: "你是哪国人？",
    options: [opt("A", "我是老师。"), opt("B", "我是俄罗斯人。"), opt("C", "我有两个孩子。")],
    answer: "B", knowledge: ["哪国人"]
  },
  {
    id: "L08", number: 8, part: "L2_answer_choice",
    audioText: "你几点下课？",
    options: [opt("A", "我下午四点半下课。"), opt("B", "我明天去学校。"), opt("C", "我喜欢小猫。")],
    answer: "A", knowledge: ["几点", "下课"]
  },
  {
    id: "L09", number: 9, part: "L2_answer_choice",
    audioText: "你的手机号是多少？",
    options: [opt("A", "我家有三口人。"), opt("B", "我的手机号是八八八八。"), opt("C", "我坐出租车去。")],
    answer: "B", knowledge: ["手机号", "多少"]
  },
  {
    id: "L10", number: 10, part: "L2_answer_choice",
    audioText: "你妈妈想吃什么？",
    options: [opt("A", "她想吃米饭。"), opt("B", "她在家里。"), opt("C", "她下午两点下班。")],
    answer: "A", knowledge: ["想吃", "什么"]
  },
  {
    id: "L11", number: 11, part: "L3_dialogue_picture_choice",
    audioText: "男：你去哪儿？女：我去电影院看电影。",
    options: [opt("A", "电影院", img.cinema), opt("B", "医院", img.hospital), opt("C", "学校", img.school)],
    answer: "A", knowledge: ["去哪儿", "电影院", "看电影"]
  },
  {
    id: "L12", number: 12, part: "L3_dialogue_picture_choice",
    audioText: "女：你想吃什么？男：我想吃饺子。",
    options: [opt("A", "米饭", img.rice), opt("B", "面条儿", img.noodles), opt("C", "饺子", img.dumplings)],
    answer: "C", knowledge: ["想吃", "饺子"]
  },
  {
    id: "L13", number: 13, part: "L3_dialogue_picture_choice",
    audioText: "男：你的手机在哪儿？女：在桌子上。",
    options: [opt("A", "手机", img.phone), opt("B", "桌子下边", img.deskUnder), opt("C", "房间", img.room)],
    answer: "A", knowledge: ["手机", "桌子上"]
  },
  {
    id: "L14", number: 14, part: "L3_dialogue_picture_choice",
    audioText: "女：你爸爸在哪儿工作？男：他在医院工作。",
    options: [opt("A", "医院", img.hospital), opt("B", "超市", img.supermarket), opt("C", "学校", img.school)],
    answer: "A", knowledge: ["爸爸", "医院", "工作"]
  },
  {
    id: "L15", number: 15, part: "L3_dialogue_picture_choice",
    audioText: "男：你晚上做什么？女：我晚上吃晚饭。",
    options: [opt("A", "吃米饭", img.rice), opt("B", "看电影", img.movie), opt("C", "下班", img.offWork)],
    answer: "A", knowledge: ["晚上", "晚饭"]
  },
  {
    id: "L16", number: 16, part: "L4_sentence_question_answer",
    audioText: "她明天上午在学校学习。问题：她明天上午在哪儿？",
    options: [opt("A", "在学校。"), opt("B", "在医院。"), opt("C", "在超市。")],
    answer: "A", knowledge: ["明天上午", "在哪儿"]
  },
  {
    id: "L17", number: 17, part: "L4_sentence_question_answer",
    audioText: "王一雪晚上六点半下班。问题：王一雪几点下班？",
    options: [opt("A", "早上八点。"), opt("B", "晚上六点半。"), opt("C", "上午十点十分。")],
    answer: "B", knowledge: ["几点", "下班"]
  },
  {
    id: "L18", number: 18, part: "L4_sentence_question_answer",
    audioText: "桌子上有一本书。问题：桌子上有什么？",
    options: [opt("A", "有一本书。"), opt("B", "有一只小猫。"), opt("C", "有一碗米饭。")],
    answer: "A", knowledge: ["桌子上", "有"]
  },
  {
    id: "L19", number: 19, part: "L4_sentence_question_answer",
    audioText: "她的手机在桌子上。问题：她的手机在哪儿？",
    options: [opt("A", "在医院。"), opt("B", "在桌子上。"), opt("C", "在电影院。")],
    answer: "B", knowledge: ["手机", "桌子上"]
  },
  {
    id: "L20", number: 20, part: "L4_sentence_question_answer",
    audioText: "小明喜欢吃面条儿，不喜欢吃饺子。问题：小明喜欢吃什么？",
    options: [opt("A", "喜欢吃米饭。"), opt("B", "喜欢吃饺子。"), opt("C", "喜欢吃面条儿。")],
    answer: "C", knowledge: ["喜欢", "面条儿"]
  }
];

const reading = [
  {
    id: "R21", number: 21, part: "R1_sentence_picture_match", question: "我坐出租车去学校。",
    options: [opt("A", "出租车", img.taxi), opt("B", "电影院", img.cinema), opt("C", "医院", img.hospital)],
    answer: "A", knowledge: ["出租车", "去学校"]
  },
  {
    id: "R22", number: 22, part: "R1_sentence_picture_match", question: "我喜欢读书。",
    options: [opt("A", "小猫", img.cat), opt("B", "读书", img.book), opt("C", "牛奶", img.milk)],
    answer: "B", knowledge: ["喜欢", "读书"]
  },
  {
    id: "R23", number: 23, part: "R1_sentence_picture_match", question: "我去超市买东西。",
    options: [opt("A", "超市", img.supermarket), opt("B", "学校", img.school), opt("C", "房间", img.room)],
    answer: "A", knowledge: ["去", "超市"]
  },
  {
    id: "R24", number: 24, part: "R1_sentence_picture_match", question: "小猫在桌子下边。",
    options: [opt("A", "桌子", img.table), opt("B", "小猫", img.cat), opt("C", "桌子下边", img.deskUnder)],
    answer: "C", knowledge: ["小猫", "桌子下边"]
  },
  {
    id: "R25", number: 25, part: "R1_sentence_picture_match", question: "她在医院工作。",
    options: [opt("A", "电影院", img.cinema), opt("B", "医院", img.hospital), opt("C", "超市", img.supermarket)],
    answer: "B", knowledge: ["医院", "工作"]
  },
  {
    id: "R26", number: 26, part: "R2_question_answer_match", question: "你叫什么名字？",
    options: [opt("A", "我在家。"), opt("B", "我叫白家月。"), opt("C", "我喜欢面条儿。")],
    answer: "B", knowledge: ["叫什么名字"]
  },
  {
    id: "R27", number: 27, part: "R2_question_answer_match", question: "你家有几口人？",
    options: [opt("A", "我明天上午上课。"), opt("B", "这是我的手机。"), opt("C", "我家有四口人。")],
    answer: "C", knowledge: ["几口人"]
  },
  {
    id: "R28", number: 28, part: "R2_question_answer_match", question: "你想吃什么？",
    options: [opt("A", "我想吃米饭。"), opt("B", "我在医院工作。"), opt("C", "我下午下班。")],
    answer: "A", knowledge: ["想吃什么"]
  },
  {
    id: "R29", number: 29, part: "R2_question_answer_match", question: "你几点下班？",
    options: [opt("A", "我在医院工作。"), opt("B", "我晚上六点半下班。"), opt("C", "我坐出租车去。")],
    answer: "B", knowledge: ["几点", "下班"]
  },
  {
    id: "R30", number: 30, part: "R2_question_answer_match", question: "小猫在哪儿？",
    options: [opt("A", "我喜欢小猫。"), opt("B", "小猫很漂亮。"), opt("C", "小猫在桌子下边。")],
    answer: "C", knowledge: ["小猫", "在哪儿"]
  },
  {
    id: "R31", number: 31, part: "R3_fill_blank", question: "我___陈天中。",
    options: [opt("A", "坐"), opt("B", "叫"), opt("C", "吃")],
    answer: "B", knowledge: ["叫"]
  },
  {
    id: "R32", number: 32, part: "R3_fill_blank", question: "今天___？",
    options: [opt("A", "几点"), opt("B", "几口人"), opt("C", "几月几号")],
    answer: "C", knowledge: ["几月几号"]
  },
  {
    id: "R33", number: 33, part: "R3_fill_blank", question: "我想吃___米饭。",
    options: [opt("A", "什么"), opt("B", "一些"), opt("C", "哪儿")],
    answer: "B", knowledge: ["一些"]
  },
  {
    id: "R34", number: 34, part: "R3_fill_blank", question: "电影院前边___一家超市。",
    options: [opt("A", "叫"), opt("B", "买"), opt("C", "有")],
    answer: "C", knowledge: ["有", "前边"]
  },
  {
    id: "R35", number: 35, part: "R3_fill_blank", question: "我明天上午___学校学习。",
    options: [opt("A", "在"), opt("B", "有"), opt("C", "叫")],
    answer: "A", knowledge: ["在", "学校"]
  },
  {
    id: "R36", number: 36, part: "R4_reading_comprehension",
    passage: "明天星期六。王一雪上午在学校学习，晚上和朋友去电影院看电影。",
    question: "王一雪晚上做什么？",
    options: [opt("A", "在医院工作"), opt("B", "去电影院看电影"), opt("C", "买一些牛奶")],
    answer: "B", knowledge: ["晚上", "电影院"]
  },
  {
    id: "R37", number: 37, part: "R4_reading_comprehension",
    passage: "桌子上有一本书，桌子下边有一只小猫。小猫很漂亮。",
    question: "小猫在哪儿？",
    options: [opt("A", "桌子上"), opt("B", "桌子下边"), opt("C", "学校前边")],
    answer: "B", knowledge: ["桌子下边", "小猫"]
  },
  {
    id: "R38", number: 38, part: "R4_reading_comprehension",
    passage: "我爸爸是医生。他在医院工作。他上午八点上班，晚上六点下班。",
    question: "爸爸在哪儿工作？",
    options: [opt("A", "在电影院"), opt("B", "在超市"), opt("C", "在医院")],
    answer: "C", knowledge: ["爸爸", "医院", "工作"]
  },
  {
    id: "R39", number: 39, part: "R4_reading_comprehension",
    passage: "小明明天上午在学校上课。他下午坐出租车去医院看爸爸。",
    question: "小明下午怎么去医院？",
    options: [opt("A", "坐出租车"), opt("B", "坐飞机"), opt("C", "走路")],
    answer: "A", knowledge: ["下午", "坐出租车", "医院"]
  },
  {
    id: "R40", number: 40, part: "R4_reading_comprehension",
    passage: "安妮今天休息。她上午在家，下午去超市买一些牛奶和米饭。",
    question: "安妮下午去哪儿？",
    options: [opt("A", "去学校"), opt("B", "去电影院"), opt("C", "去超市")],
    answer: "C", knowledge: ["下午", "超市"]
  }
];

function withCommon(item) {
  const prompts = {
    L1_picture_choice: ["听录音，选择正确图片。", "Listen and choose the correct picture."],
    L2_answer_choice: ["听问题，选择合适的回答。", "Listen to the question and choose the best answer."],
    L3_dialogue_picture_choice: ["听对话，选择正确图片。", "Listen to the dialogue and choose the correct picture."],
    L4_sentence_question_answer: ["听句子和问题，选择合适的回答。", "Listen to the sentence and question. Choose the best answer."],
    R1_sentence_picture_match: ["读句子，选择正确图片。", "Read the sentence and choose the correct picture."],
    R2_question_answer_match: ["选择合适的回答。", "Choose the best answer."],
    R3_fill_blank: ["选择合适的词填空。", "Choose the best word."],
    R4_reading_comprehension: ["读短文，选择正确答案。", "Read and choose the correct answer."]
  };
  const p = prompts[item.part] || ["选择正确答案。", "Choose the best answer."];
  return {
    skill: item.number <= 20 ? "listening" : "reading",
    prompt: p[0],
    promptEn: p[1],
    points: 1,
    sourceType: "mock_test",
    status: "draft",
    ...item
  };
}

const test = {
  schemaVersion: "mock-test-1.0.0",
  testId: "HSK1-mock-01",
  recordLesson: "HSK1-MOCK-01",
  level: "HSK1",
  title: "HSK1 Mock Test 01",
  titleCn: "HSK1 模拟测试 01",
  mode: "mock_test",
  durationMinutes: 35,
  sourcePolicy: "自建题库；样题只作题型参考；词汇与语法优先来自 HSK1-L01 至 HSK1-L08 已学内容。第22题按教师要求保留“我喜欢读书”。",
  audioPolicy: {
    mode: "teacher_controlled_audio_with_tts_fallback",
    studentAudioControls: false,
    teacherControlledFinal: true,
    ttsRate: 0.62,
    note: "学生端不显示音频按钮；教师端优先按大题播放音频文件，文件不可用时回退慢速浏览器 TTS。音频文件上线前必须人工验收。"
  },
  audioParts: [
    { part: "L1_picture_choice", title: "听力第一部分 1-5", file: "../data-model/mock-tests/audio/HSK1-mock-01-listening-01.wav", itemNumbers: [1, 2, 3, 4, 5] },
    { part: "L2_answer_choice", title: "听力第二部分 6-10", file: "../data-model/mock-tests/audio/HSK1-mock-01-listening-02.wav", itemNumbers: [6, 7, 8, 9, 10] },
    { part: "L3_dialogue_picture_choice", title: "听力第三部分 11-15", file: "../data-model/mock-tests/audio/HSK1-mock-01-listening-03.wav", itemNumbers: [11, 12, 13, 14, 15] },
    { part: "L4_sentence_question_answer", title: "听力第四部分 16-20", file: "../data-model/mock-tests/audio/HSK1-mock-01-listening-04.wav", itemNumbers: [16, 17, 18, 19, 20] }
  ],
  sections: [
    {
      id: "listening",
      title: "听力",
      titleEn: "Listening",
      items: listening.map(withCommon)
    },
    {
      id: "reading",
      title: "阅读",
      titleEn: "Reading",
      items: reading.map(withCommon)
    }
  ]
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(test, null, 2) + "\n", "utf8");
console.log(`Wrote ${out}`);
