const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outJson = path.join(root, "source", "data-model", "mock-tests", "HSK1-mock-03.json");
const audioScriptDir = path.join(root, "docs", "mock-test-audio");
const img = (p) => `../in-class/images/${p}`;
const opt = (id, text, image) => image ? { id, text, image } : { id, text };

function listening(number, part, audioText, options, answer, knowledge, audioTurns) {
  return {
    skill: "listening",
    prompt: part === "L1_picture_choice" || part === "L3_dialogue_picture_choice" ? "听录音，选择正确图片。" : "听录音，选择合适的回答。",
    promptEn: part === "L1_picture_choice" || part === "L3_dialogue_picture_choice" ? "Listen and choose the correct picture." : "Listen and choose the best answer.",
    points: 1,
    sourceType: "mock_test",
    status: "draft",
    id: `L${String(number).padStart(2, "0")}`,
    number,
    part,
    audioText,
    ...(audioTurns ? { audioTurns } : {}),
    options,
    answer,
    knowledge
  };
}

function reading(number, part, question, fields) {
  return {
    skill: "reading",
    prompt: part === "R1_sentence_picture_match" ? "读句子，选择正确图片。" : part === "R2_question_answer_match" ? "选择合适的回答。" : part === "R3_fill_blank" ? "选择合适的词语填空。" : "读短文，选择正确答案。",
    promptEn: part === "R1_sentence_picture_match" ? "Read the sentence and choose the correct picture." : part === "R2_question_answer_match" ? "Choose the best answer." : part === "R3_fill_blank" ? "Choose the best word." : "Read and choose the correct answer.",
    points: 1,
    sourceType: "mock_test",
    status: "draft",
    id: `R${number}`,
    number,
    part,
    question,
    ...fields
  };
}

const l3Options = [
  opt("A", "早餐", img("vocab/hsk1-l13/14_zaofan.png")),
  opt("B", "写字", img("vocab/hsk1-l14/08_xie.png")),
  opt("C", "机场接人", img("vocab/hsk1-l15/14_jie.png")),
  opt("D", "喝茶", img("vocab/hsk1-l13/20_cha.png")),
  opt("E", "坐火车", img("vocab/hsk1-l14/02_huoche.png")),
  opt("F", "飞机", img("vocab/hsk1-l15/08_feiji.png"))
];

const r1Options = [
  opt("A", "打电话", img("vocab/hsk1-l13/05_dadianhua.png")),
  opt("B", "中学生", img("vocab/hsk1-l14/19_zhongxuesheng.png")),
  opt("C", "大兴机场", img("vocab/hsk1-l15/20_daxingjichang.png")),
  opt("D", "一杯茶", img("vocab/hsk1-l13/20_cha.png")),
  opt("E", "上学", img("vocab/hsk1-l14/21_shangxue.png")),
  opt("F", "北京", img("vocab/hsk1-l15/19_beijing.png"))
];

const r2Options = [
  opt("A", "可以，请问吧。"),
  opt("B", "我要一杯茶。"),
  opt("C", "我看了一个电影。"),
  opt("D", "九个小时。"),
  opt("E", "在大兴机场见。"),
  opt("F", "不客气。")
];

const r3Options = [
  opt("A", "可以"),
  opt("B", "面包"),
  opt("C", "写"),
  opt("D", "去年"),
  opt("E", "机场"),
  opt("F", "茶")
];

const listeningItems = [
  listening(1, "L1_picture_choice", "请给我一杯茶。",
    [opt("A", "茶", img("vocab/hsk1-l13/20_cha.png")), opt("B", "面包", img("vocab/hsk1-l13/16_mianbao.png")), opt("C", "鸡蛋", img("vocab/hsk1-l13/17_jidan.png"))], "A", ["请", "给", "茶"]),
  listening(2, "L1_picture_choice", "他在打电话。",
    [opt("A", "听", img("vocab/hsk1-l14/13_ting.png")), opt("B", "打电话", img("vocab/hsk1-l13/05_dadianhua.png")), opt("C", "写", img("vocab/hsk1-l14/08_xie.png"))], "B", ["打电话"]),
  listening(3, "L1_picture_choice", "他们上火车了。",
    [opt("A", "火车", img("vocab/hsk1-l14/02_huoche.png")), opt("B", "飞机", img("vocab/hsk1-l15/08_feiji.png")), opt("C", "机场", img("vocab/hsk1-l15/13_jichang.png"))], "A", ["上", "火车", "了"]),
  listening(4, "L1_picture_choice", "孩子去上学。",
    [opt("A", "睡觉", img("vocab/hsk1-l14/23_wan.png")), opt("B", "上学", img("vocab/hsk1-l14/21_shangxue.png")), opt("C", "中午", img("vocab/hsk1-l14/03_zhongwu.png"))], "B", ["孩子", "上学"]),
  listening(5, "L1_picture_choice", "飞机到北京。",
    [opt("A", "西安", img("vocab/hsk1-l15/18_xian.png")), opt("B", "火车", img("vocab/hsk1-l14/02_huoche.png")), opt("C", "北京", img("vocab/hsk1-l15/19_beijing.png"))], "C", ["飞机", "北京"]),

  listening(6, "L2_answer_choice", "我可以问一个问题吗？",
    [opt("A", "可以。"), opt("B", "九个小时。"), opt("C", "在北京。")], "A", ["可以", "问问题"]),
  listening(7, "L2_answer_choice", "您喝什么？",
    [opt("A", "我去机场。"), opt("B", "我要一杯茶。"), opt("C", "我会写字。")], "B", ["喝什么", "茶"]),
  listening(8, "L2_answer_choice", "你们都会写汉字了吗？",
    [opt("A", "我们都在机场。"), opt("B", "这是面包。"), opt("C", "都会写了。")], "C", ["都", "写汉字", "了"]),
  listening(9, "L2_answer_choice", "飞机到北京要几个小时？",
    [opt("A", "九个小时。"), opt("B", "去年去了西安。"), opt("C", "我喜欢这个。")], "A", ["飞机", "北京", "小时"]),
  listening(10, "L2_answer_choice", "今年你想去哪儿？",
    [opt("A", "我看了电影。"), opt("B", "我想去北京。"), opt("C", "请坐。")], "B", ["今年", "想去北京"]),

  listening(11, "L3_dialogue_picture_choice", "男：你吃早饭了吗？女：吃了面包和鸡蛋。", l3Options, "A", ["早饭", "面包", "鸡蛋"], [{ voice: "A", text: "你吃早饭了吗？" }, { voice: "B", text: "吃了面包和鸡蛋。" }]),
  listening(12, "L3_dialogue_picture_choice", "女：你会写汉字了吗？男：我都会写了。", l3Options, "B", ["写", "汉字", "都"], [{ voice: "B", text: "你会写汉字了吗？" }, { voice: "A", text: "我都会写了。" }]),
  listening(13, "L3_dialogue_picture_choice", "男：谁去机场接你们？女：王老师的姐姐。", l3Options, "C", ["机场", "接"], [{ voice: "A", text: "谁去机场接你们？" }, { voice: "B", text: "王老师的姐姐。" }]),
  listening(14, "L3_dialogue_picture_choice", "女：你想喝什么？男：请给我一杯茶。", l3Options, "D", ["喝", "茶"], [{ voice: "B", text: "你想喝什么？" }, { voice: "A", text: "请给我一杯茶。" }]),
  listening(15, "L3_dialogue_picture_choice", "男：你们上火车了吗？女：上了。", l3Options, "E", ["上火车", "了"], [{ voice: "A", text: "你们上火车了吗？" }, { voice: "B", text: "上了。" }]),

  listening(16, "L4_sentence_question_answer", "王一雪还没吃早饭。问题：王一雪吃早饭了吗？",
    [opt("A", "吃了。"), opt("B", "还没吃。"), opt("C", "不知道。")], "B", ["还没", "早饭"], [{ text: "王一雪还没吃早饭。" }, { text: "王一雪吃早饭了吗？" }]),
  listening(17, "L4_sentence_question_answer", "陈天中看了一个电影。问题：陈天中做了什么？",
    [opt("A", "看了电影。"), opt("B", "打电话。"), opt("C", "买面包。")], "A", ["看了", "电影"], [{ text: "陈天中看了一个电影。" }, { text: "陈天中做了什么？" }]),
  listening(18, "L4_sentence_question_answer", "明年女儿上中学。问题：女儿明年上什么学校？",
    [opt("A", "小学。"), opt("B", "大学。"), opt("C", "中学。")], "C", ["明年", "中学"], [{ text: "明年女儿上中学。" }, { text: "女儿明年上什么学校？" }]),
  listening(19, "L4_sentence_question_answer", "去年安妮去了西安。问题：安妮去年去哪儿了？",
    [opt("A", "西安。"), opt("B", "北京。"), opt("C", "机场。")], "A", ["去年", "西安"], [{ text: "去年安妮去了西安。" }, { text: "安妮去年去哪儿了？" }]),
  listening(20, "L4_sentence_question_answer", "他们早上八点到大兴机场。问题：他们几点到机场？",
    [opt("A", "九个小时。"), opt("B", "早上八点。"), opt("C", "中午。")], "B", ["早上八点", "机场"], [{ text: "他们早上八点到大兴机场。" }, { text: "他们几点到机场？" }])
];

const readingItems = [
  reading(21, "R1_sentence_picture_match", "她正在打电话。", { options: r1Options, answer: "A", knowledge: ["打电话"] }),
  reading(22, "R1_sentence_picture_match", "他是中学生。", { options: r1Options, answer: "B", knowledge: ["中学生"] }),
  reading(23, "R1_sentence_picture_match", "我们在大兴机场见。", { options: r1Options, answer: "C", knowledge: ["大兴机场"] }),
  reading(24, "R1_sentence_picture_match", "请给我一杯茶。", { options: r1Options, answer: "D", knowledge: ["给", "杯", "茶"] }),
  reading(25, "R1_sentence_picture_match", "孩子们去上学。", { options: r1Options, answer: "E", knowledge: ["上学"] }),

  reading(26, "R2_question_answer_match", "我可以问您一个问题吗？", { options: r2Options, answer: "A", knowledge: ["可以", "问"] }),
  reading(27, "R2_question_answer_match", "您喝什么？", { options: r2Options, answer: "B", knowledge: ["喝什么"] }),
  reading(28, "R2_question_answer_match", "你看了什么？", { options: r2Options, answer: "C", knowledge: ["看了"] }),
  reading(29, "R2_question_answer_match", "飞机到北京要几个小时？", { options: r2Options, answer: "D", knowledge: ["飞机", "小时"] }),
  reading(30, "R2_question_answer_match", "我们在哪儿见？", { options: r2Options, answer: "E", knowledge: ["在哪儿", "见"] }),

  reading(31, "R3_fill_blank", "我___再问您一个问题吗？", { options: r3Options, answer: "A", knowledge: ["可以"] }),
  reading(32, "R3_fill_blank", "我还没吃早饭，再要这个___吧。", { options: r3Options, answer: "B", knowledge: ["面包"] }),
  reading(33, "R3_fill_blank", "我们都会___汉字了。", { options: r3Options, answer: "C", knowledge: ["写"] }),
  reading(34, "R3_fill_blank", "___我和男朋友去了西安。", { options: r3Options, answer: "D", knowledge: ["去年"] }),
  reading(35, "R3_fill_blank", "她可以去___接你们。", { options: r3Options, answer: "E", knowledge: ["机场"] }),

  reading(36, "R4_reading_comprehension", "刘明在饭店。他要一斤饺子，还想喝茶。", {
    passage: "刘明在饭店。他要一斤饺子，还想喝茶。",
    question: "刘明想喝什么？",
    options: [opt("A", "茶"), opt("B", "牛奶"), opt("C", "水")],
    answer: "A",
    knowledge: ["饭店", "饺子", "茶"]
  }),
  reading(37, "R4_reading_comprehension", "中午车开后，有些人看书，有些人睡觉了。陈天中看了一个电影。", {
    passage: "中午车开后，有些人看书，有些人睡觉了。陈天中看了一个电影。",
    question: "陈天中做了什么？",
    options: [opt("A", "看书"), opt("B", "睡觉"), opt("C", "看电影")],
    answer: "C",
    knowledge: ["中午", "看了", "电影"]
  }),
  reading(38, "R4_reading_comprehension", "王老师说：请大家不要说话，请听老师的问题。", {
    passage: "王老师说：请大家不要说话，请听老师的问题。",
    question: "王老师让大家做什么？",
    options: [opt("A", "不要说话"), opt("B", "去机场"), opt("C", "买面包")],
    answer: "A",
    knowledge: ["不要", "说话", "听"]
  }),
  reading(39, "R4_reading_comprehension", "去年安妮去了西安。今年她想去北京。", {
    passage: "去年安妮去了西安。今年她想去北京。",
    question: "安妮今年想去哪儿？",
    options: [opt("A", "西安"), opt("B", "北京"), opt("C", "大连")],
    answer: "B",
    knowledge: ["去年", "今年", "北京"]
  }),
  reading(40, "R4_reading_comprehension", "王老师的家人都在北京。星期天她姐姐有时间，可以去机场接学生。", {
    passage: "王老师的家人都在北京。星期天她姐姐有时间，可以去机场接学生。",
    question: "谁可以去机场接学生？",
    options: [opt("A", "王老师的姐姐"), opt("B", "安妮"), opt("C", "刘明")],
    answer: "A",
    knowledge: ["家人", "时间", "机场接人"]
  })
];

const audioParts = [
  { part: "L1_picture_choice", title: "听力第一部分 1-5", file: "../data-model/mock-tests/audio/HSK1-mock-03-listening-01.wav", itemNumbers: [1, 2, 3, 4, 5] },
  { part: "L2_answer_choice", title: "听力第二部分 6-10", file: "../data-model/mock-tests/audio/HSK1-mock-03-listening-02.wav", itemNumbers: [6, 7, 8, 9, 10] },
  { part: "L3_dialogue_picture_choice", title: "听力第三部分 11-15", file: "../data-model/mock-tests/audio/HSK1-mock-03-listening-03.wav", itemNumbers: [11, 12, 13, 14, 15] },
  { part: "L4_sentence_question_answer", title: "听力第四部分 16-20", file: "../data-model/mock-tests/audio/HSK1-mock-03-listening-04.wav", itemNumbers: [16, 17, 18, 19, 20] }
];

const test = {
  schemaVersion: "mock-test-1.0.0",
  testId: "HSK1-mock-03",
  recordLesson: "HSK1-MOCK-03",
  level: "HSK1",
  title: "HSK1 Mock Test 03",
  titleCn: "HSK1 模拟测试 03",
  mode: "mock_test",
  durationMinutes: 35,
  sourcePolicy: "自建题库；样题只作题型、题量和版式参考；词汇与语法范围为 HSK1-L01 至 HSK1-L15。",
  audioPolicy: {
    mode: "teacher_controlled_audio_with_edge_tts",
    studentAudioControls: false,
    teacherControlledFinal: true,
    ttsVoiceA: "zh-CN-YunyangNeural",
    ttsVoiceB: "zh-CN-XiaoyiNeural",
    ttsRate: "-35%",
    itemPauseSeconds: 4.5,
    repeat: 2,
    repeatGapSeconds: 1.5,
    turnGapSeconds: 0.8,
    note: "学生端不显示音频按钮；教师端按大题播放 MP3。Yunyang 男声 -35% 为用户确认的默认主声线。"
  },
  audioParts,
  sections: [
    { id: "listening", title: "听力", titleEn: "Listening", items: listeningItems },
    { id: "reading", title: "阅读", titleEn: "Reading", items: readingItems }
  ]
};

function audioScriptFor(part, items) {
  return items.filter((item) => item.part === part).map((item) => {
    const turns = item.audioTurns || [{ text: item.audioText }];
    return [`### ${item.number}`, `第${item.number}题。`, ...turns.map((turn) => `${turn.voice ? `[${turn.voice}] ` : ""}${turn.text}`)].join("\n");
  }).join("\n\n") + "\n";
}

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.mkdirSync(audioScriptDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(test, null, 2) + "\n", "utf8");

for (const [idx, part] of ["L1_picture_choice", "L2_answer_choice", "L3_dialogue_picture_choice", "L4_sentence_question_answer"].entries()) {
  const file = path.join(audioScriptDir, `HSK1-mock-03-L${idx + 1}_${part.replace(/^L\d_/, "")}-edge-tts.txt`);
  fs.writeFileSync(file, audioScriptFor(part, listeningItems), "utf8");
}

console.log(outJson);
console.log(audioScriptDir);
