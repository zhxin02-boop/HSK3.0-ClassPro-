const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outJson = path.join(root, "source", "data-model", "mock-tests", "HSK1-mock-02.json");
const audioScriptDir = path.join(root, "docs", "mock-test-audio");

const img = (p) => `../in-class/images/${p}`;

function opt(id, text, image) {
  return image ? { id, text, image } : { id, text };
}

function listening(number, part, prompt, audioText, options, answer, knowledge, audioTurns) {
  return {
    skill: "listening",
    prompt,
    promptEn: part === "L1_picture_choice" || part === "L3_dialogue_picture_choice"
      ? "Listen and choose the correct picture."
      : "Listen and choose the best answer.",
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

function reading(number, part, prompt, fields) {
  return {
    skill: "reading",
    prompt,
    promptEn: part === "R1_sentence_picture_match"
      ? "Read the sentence and choose the correct picture."
      : part === "R2_question_answer_match"
        ? "Choose the best answer."
        : part === "R3_fill_blank"
          ? "Choose the best word."
          : "Read and choose the correct answer.",
    points: 1,
    sourceType: "mock_test",
    status: "draft",
    id: `R${number}`,
    number,
    part,
    ...fields
  };
}

const listeningItems = [
  listening(1, "L1_picture_choice", "听录音，选择正确图片。", "外边下雨了。",
    [
      opt("A", "下雨", img("vocab/hsk1-l08/v02_wai.png")),
      opt("B", "看电影", img("vocab/hsk1-l07/v06_dianying.png")),
      opt("C", "买水果", img("vocab/hsk1-l10/v04_shuiguo.png"))
    ], "A", ["外边", "下雨了"]),
  listening(2, "L1_picture_choice", "听录音，选择正确图片。", "他正在读书。",
    [
      opt("A", "看电视", img("vocab/hsk1-l09/v11_dianshi.png")),
      opt("B", "读书", img("vocab/hsk1-l09/v08_dushu.png")),
      opt("C", "唱歌", img("vocab/hsk1-l09/v10_changge.png"))
    ], "B", ["正在", "读书"]),
  listening(3, "L1_picture_choice", "听录音，选择正确图片。", "妹妹在睡觉。",
    [
      opt("A", "妹妹", img("l04_pic_12_meimei.png")),
      opt("B", "医生", img("vocab/hsk1-l08/v12_yisheng_bingren.png")),
      opt("C", "椅子", img("vocab/hsk1-l09/v03_yizi.png"))
    ], "A", ["妹妹", "睡觉"]),
  listening(4, "L1_picture_choice", "听录音，选择正确图片。", "她去商店买衣服。",
    [
      opt("A", "杯子", img("vocab/hsk1-l10/v01_beizi.png")),
      opt("B", "商店", img("vocab/hsk1-l10/v06_shangdian.png")),
      opt("C", "学校前边", img("vocab/hsk1-l08/v08_xuexiao_qian.png"))
    ], "B", ["商店", "买", "衣服"]),
  listening(5, "L1_picture_choice", "听录音，选择正确图片。", "医生给他看病。",
    [
      opt("A", "出租车", img("vocab/hsk1-l06/v22_chuzuche.png")),
      opt("B", "朋友", img("vocab/hsk1-l09/v09_pengyou.png")),
      opt("C", "医生看病", img("vocab/hsk1-l08/v12_yisheng_bingren.png"))
    ], "C", ["医生", "看病"]),

  listening(6, "L2_answer_choice", "听问题，选择合适的回答。", "你觉得冷不冷？",
    [opt("A", "我觉得很冷。"), opt("B", "我叫李文。"), opt("C", "她在公司。")], "A", ["觉得", "冷不冷"]),
  listening(7, "L2_answer_choice", "听问题，选择合适的回答。", "你什么时候去饭店？",
    [opt("A", "我有一本书。"), opt("B", "明天晚上。"), opt("C", "天气很好。")], "B", ["什么时候", "饭店"]),
  listening(8, "L2_answer_choice", "听问题，选择合适的回答。", "他是不是大学生？",
    [opt("A", "不客气。"), opt("B", "我在找手机。"), opt("C", "是，他是大学生。")], "C", ["是不是", "大学生"]),
  listening(9, "L2_answer_choice", "听问题，选择合适的回答。", "今天天气怎么样？",
    [opt("A", "下雨了，有点儿冷。"), opt("B", "我去学校。"), opt("C", "八块钱。")], "A", ["天气", "怎么样", "下雨"]),
  listening(10, "L2_answer_choice", "听问题，选择合适的回答。", "你开车没开车？",
    [opt("A", "我在睡觉。"), opt("B", "没开车，我坐车。"), opt("C", "这个杯子很贵。")], "B", ["开车没开车", "坐车"]),

  listening(11, "L3_dialogue_picture_choice", "听对话，选择正确图片。", "男：你在做什么？女：我在看电视呢。",
    [
      opt("A", "看电视", img("vocab/hsk1-l09/v11_dianshi.png")),
      opt("B", "唱歌", img("vocab/hsk1-l09/v10_changge.png")),
      opt("C", "读大学", img("vocab/hsk1-l09/v08_dushu.png"))
    ], "A", ["在做什么", "看电视"], [{ voice: "A", text: "你在做什么？" }, { voice: "B", text: "我在看电视呢。" }]),
  listening(12, "L3_dialogue_picture_choice", "听对话，选择正确图片。", "女：你去哪儿？男：我去医院看病。",
    [
      opt("A", "商店", img("vocab/hsk1-l10/v06_shangdian.png")),
      opt("B", "医院", img("vocab/hsk1-l07/v09_yiyuan.png")),
      opt("C", "电影院", img("vocab/hsk1-l07/v05_dianyingyuan.png"))
    ], "B", ["去哪儿", "医院", "看病"], [{ voice: "B", text: "你去哪儿？" }, { voice: "A", text: "我去医院看病。" }]),
  listening(13, "L3_dialogue_picture_choice", "听对话，选择正确图片。", "男：弟弟起床了吗？女：没有，还在睡觉。",
    [
      opt("A", "学生", img("l01-vocab-student-group.png")),
      opt("B", "医生", img("vocab/hsk1-l08/v12_yisheng_bingren.png")),
      opt("C", "睡觉", img("vocab/hsk1-l08/v01_fangjian.png"))
    ], "C", ["起床了", "睡觉"], [{ voice: "A", text: "弟弟起床了吗？" }, { voice: "B", text: "没有，还在睡觉。" }]),
  listening(14, "L3_dialogue_picture_choice", "听对话，选择正确图片。", "女：你买什么？男：我买一个杯子。",
    [
      opt("A", "杯子", img("vocab/hsk1-l10/v01_beizi.png")),
      opt("B", "苹果", img("vocab/hsk1-l10/v05_pingguo.png")),
      opt("C", "衣服", img("vocab/hsk1-l10/v07_yifu.png"))
    ], "A", ["买", "杯子"], [{ voice: "B", text: "你买什么？" }, { voice: "A", text: "我买一个杯子。" }]),
  listening(15, "L3_dialogue_picture_choice", "听对话，选择正确图片。", "男：你的书在哪儿？女：在桌子上。",
    [
      opt("A", "前边", img("vocab/hsk1-l09/v01_qianbian.png")),
      opt("B", "桌子", img("vocab/hsk1-l08/v05_zhuozi.png")),
      opt("C", "桌子下边", img("vocab/hsk1-l08/v06_zhuozi_xia.png"))
    ], "B", ["书", "桌子上"], [{ voice: "A", text: "你的书在哪儿？" }, { voice: "B", text: "在桌子上。" }]),

  listening(16, "L4_sentence_question_answer", "听句子和问题，选择合适的回答。", "王老师正在找手机。问题：王老师在找什么？",
    [opt("A", "找手机。"), opt("B", "找饭店。"), opt("C", "找医生。")], "A", ["正在", "找手机"], [{ text: "王老师正在找手机。" }, { text: "王老师在找什么？" }]),
  listening(17, "L4_sentence_question_answer", "听句子和问题，选择合适的回答。", "李文读大学呢。问题：李文是不是大学生？",
    [opt("A", "不是。"), opt("B", "是。"), opt("C", "不知道。")], "B", ["读大学", "是不是"], [{ text: "李文读大学呢。" }, { text: "李文是不是大学生？" }]),
  listening(18, "L4_sentence_question_answer", "听句子和问题，选择合适的回答。", "昨天下雪了，太冷了。问题：昨天天气怎么样？",
    [opt("A", "很热。"), opt("B", "下雨了。"), opt("C", "下雪了，很冷。")], "C", ["下雪了", "太冷了"], [{ text: "昨天下雪了，太冷了。" }, { text: "昨天天气怎么样？" }]),
  listening(19, "L4_sentence_question_answer", "听句子和问题，选择合适的回答。", "妈妈要去超市买水果。问题：妈妈要去哪儿？",
    [opt("A", "去超市。"), opt("B", "去饭店。"), opt("C", "去公司。")], "A", ["要", "超市", "水果"], [{ text: "妈妈要去超市买水果。" }, { text: "妈妈要去哪儿？" }]),
  listening(20, "L4_sentence_question_answer", "听句子和问题，选择合适的回答。", "他生病了，要吃一点儿药。问题：他要吃什么？",
    [opt("A", "热水。"), opt("B", "药。"), opt("C", "米饭。")], "B", ["生病了", "药"], [{ text: "他生病了，要吃一点儿药。" }, { text: "他要吃什么？" }])
];

const readingItems = [
  reading(21, "R1_sentence_picture_match", "读句子，选择正确图片。", {
    question: "我想买这件衣服。",
    options: [
      opt("A", "衣服", img("vocab/hsk1-l10/v07_yifu.png")),
      opt("B", "杯子", img("vocab/hsk1-l10/v01_beizi.png")),
      opt("C", "出租车", img("vocab/hsk1-l06/v22_chuzuche.png"))
    ],
    answer: "A",
    knowledge: ["衣服", "买"]
  }),
  reading(22, "R1_sentence_picture_match", "读句子，选择正确图片。", {
    question: "他正在看电视。",
    options: [
      opt("A", "读书", img("vocab/hsk1-l09/v08_dushu.png")),
      opt("B", "看电视", img("vocab/hsk1-l09/v11_dianshi.png")),
      opt("C", "唱歌", img("vocab/hsk1-l09/v10_changge.png"))
    ],
    answer: "B",
    knowledge: ["正在", "看电视"]
  }),
  reading(23, "R1_sentence_picture_match", "读句子，选择正确图片。", {
    question: "学校前边有一家商店。",
    options: [
      opt("A", "医院", img("vocab/hsk1-l07/v09_yiyuan.png")),
      opt("B", "电影院", img("vocab/hsk1-l07/v05_dianyingyuan.png")),
      opt("C", "商店", img("vocab/hsk1-l10/v06_shangdian.png"))
    ],
    answer: "C",
    knowledge: ["前边", "商店"]
  }),
  reading(24, "R1_sentence_picture_match", "读句子，选择正确图片。", {
    question: "医生在医院工作。",
    options: [
      opt("A", "医生", img("vocab/hsk1-l08/v12_yisheng_bingren.png")),
      opt("B", "学生", img("l01-vocab-student-group.png")),
      opt("C", "售货员", img("vocab/hsk1-l10/v02_shouhuoyuan.png"))
    ],
    answer: "A",
    knowledge: ["医生", "医院", "工作"]
  }),
  reading(25, "R1_sentence_picture_match", "读句子，选择正确图片。", {
    question: "桌子下边有一只小猫。",
    options: [
      opt("A", "桌子", img("vocab/hsk1-l08/v05_zhuozi.png")),
      opt("B", "桌子下边", img("vocab/hsk1-l08/v06_zhuozi_xia.png")),
      opt("C", "房间", img("vocab/hsk1-l08/v01_fangjian.png"))
    ],
    answer: "B",
    knowledge: ["桌子下边", "小猫"]
  }),

  reading(26, "R2_question_answer_match", "选择合适的回答。", {
    question: "你今天要去哪儿？",
    options: [opt("A", "我要去饭店。"), opt("B", "我觉得很冷。"), opt("C", "他在睡觉。")],
    answer: "A",
    knowledge: ["要", "去哪儿"]
  }),
  reading(27, "R2_question_answer_match", "选择合适的回答。", {
    question: "这件衣服多少钱？",
    options: [opt("A", "她是医生。"), opt("B", "八十块。"), opt("C", "下雨了。")],
    answer: "B",
    knowledge: ["多少钱", "块"]
  }),
  reading(28, "R2_question_answer_match", "选择合适的回答。", {
    question: "你妈妈生病了吗？",
    options: [opt("A", "我在大学学习。"), opt("B", "这个苹果很便宜。"), opt("C", "没有，她很好。")],
    answer: "C",
    knowledge: ["生病了", "没有"]
  }),
  reading(29, "R2_question_answer_match", "选择合适的回答。", {
    question: "你开车没开车？",
    options: [opt("A", "没开车，我坐车。"), opt("B", "我喜欢喝茶。"), opt("C", "他是大学生。")],
    answer: "A",
    knowledge: ["开车没开车"]
  }),
  reading(30, "R2_question_answer_match", "选择合适的回答。", {
    question: "今天天气怎么样？",
    options: [opt("A", "我买一个杯子。"), opt("B", "有点儿冷。"), opt("C", "她叫王一雪。")],
    answer: "B",
    knowledge: ["天气", "怎么样"]
  }),

  reading(31, "R3_fill_blank", "选择合适的词填空。", {
    question: "王老师正在___手机。",
    options: [opt("A", "找"), opt("B", "贵"), opt("C", "冷")],
    answer: "A",
    knowledge: ["正在", "找"]
  }),
  reading(32, "R3_fill_blank", "选择合适的词填空。", {
    question: "昨天___了，今天很冷。",
    options: [opt("A", "学生"), opt("B", "下雪"), opt("C", "杯子")],
    answer: "B",
    knowledge: ["下雪了"]
  }),
  reading(33, "R3_fill_blank", "选择合适的词填空。", {
    question: "这个苹果三块钱，不___。",
    options: [opt("A", "哪里"), opt("B", "睡觉"), opt("C", "贵")],
    answer: "C",
    knowledge: ["贵"]
  }),
  reading(34, "R3_fill_blank", "选择合适的词填空。", {
    question: "弟弟还在___呢。",
    options: [opt("A", "睡觉"), opt("B", "公司"), opt("C", "多少")],
    answer: "A",
    knowledge: ["还在", "睡觉"]
  }),
  reading(35, "R3_fill_blank", "选择合适的词填空。", {
    question: "医生说，回家后再喝些___。",
    options: [opt("A", "衣服"), opt("B", "热水"), opt("C", "大学")],
    answer: "B",
    knowledge: ["热水"]
  }),

  reading(36, "R4_reading_comprehension", "读短文，选择正确答案。", {
    passage: "李文正在找饭店。他没开车，坐车去。",
    question: "李文怎么去饭店？",
    options: [opt("A", "坐车"), opt("B", "开车"), opt("C", "坐飞机")],
    answer: "A",
    knowledge: ["正在", "找饭店", "坐车"]
  }),
  reading(37, "R4_reading_comprehension", "读短文，选择正确答案。", {
    passage: "王一雪昨天没来公司。她生病了，去医院看病了。",
    question: "王一雪昨天去哪儿了？",
    options: [opt("A", "去商店"), opt("B", "去医院"), opt("C", "去学校")],
    answer: "B",
    knowledge: ["公司", "生病了", "医院"]
  }),
  reading(38, "R4_reading_comprehension", "读短文，选择正确答案。", {
    passage: "这里的天不太好，下雨了。我觉得有点儿冷。",
    question: "这里天气怎么样？",
    options: [opt("A", "很热"), opt("B", "很好"), opt("C", "下雨了，有点儿冷")],
    answer: "C",
    knowledge: ["天气", "下雨了", "冷"]
  }),
  reading(39, "R4_reading_comprehension", "读短文，选择正确答案。", {
    passage: "白家月读大学呢。她学医，课很多。",
    question: "白家月学什么？",
    options: [opt("A", "学医"), opt("B", "学中文"), opt("C", "学开车")],
    answer: "A",
    knowledge: ["读大学", "学医"]
  }),
  reading(40, "R4_reading_comprehension", "读短文，选择正确答案。", {
    passage: "妈妈要去超市买水果。她想买苹果。",
    question: "妈妈想买什么？",
    options: [opt("A", "衣服"), opt("B", "苹果"), opt("C", "杯子")],
    answer: "B",
    knowledge: ["要", "超市", "水果", "苹果"]
  })
];

const sharedL3Options = [
  opt("A", "看电视", img("vocab/hsk1-l09/v11_dianshi.png")),
  opt("B", "医院", img("vocab/hsk1-l07/v09_yiyuan.png")),
  opt("C", "睡觉", img("vocab/hsk1-l08/v01_fangjian.png")),
  opt("D", "杯子", img("vocab/hsk1-l10/v01_beizi.png")),
  opt("E", "桌子", img("vocab/hsk1-l08/v05_zhuozi.png")),
  opt("F", "商店", img("vocab/hsk1-l10/v06_shangdian.png"))
];
const sharedR1Options = [
  opt("A", "衣服", img("vocab/hsk1-l10/v07_yifu.png")),
  opt("B", "看电视", img("vocab/hsk1-l09/v11_dianshi.png")),
  opt("C", "商店", img("vocab/hsk1-l10/v06_shangdian.png")),
  opt("D", "医生", img("vocab/hsk1-l08/v12_yisheng_bingren.png")),
  opt("E", "桌子下边", img("vocab/hsk1-l08/v06_zhuozi_xia.png")),
  opt("F", "杯子", img("vocab/hsk1-l10/v01_beizi.png"))
];
const sharedR2Options = [
  opt("A", "我要去饭店。"),
  opt("B", "八十块。"),
  opt("C", "没有，她很好。"),
  opt("D", "没开车，我坐车。"),
  opt("E", "有点儿冷。"),
  opt("F", "谢谢。")
];
const sharedR3Options = [
  opt("A", "找"),
  opt("B", "下雪"),
  opt("C", "贵"),
  opt("D", "睡觉"),
  opt("E", "热水"),
  opt("F", "药")
];

for (const item of listeningItems) {
  if (item.part === "L3_dialogue_picture_choice") {
    item.options = sharedL3Options;
  }
}
for (const item of readingItems) {
  if (item.part === "R1_sentence_picture_match") {
    item.options = sharedR1Options;
  }
  if (item.part === "R2_question_answer_match") {
    item.options = sharedR2Options;
  }
  if (item.part === "R3_fill_blank") {
    item.options = sharedR3Options;
  }
}

Object.assign(listeningItems.find((item) => item.number === 14), { answer: "D" });
Object.assign(listeningItems.find((item) => item.number === 15), { answer: "E" });
Object.assign(readingItems.find((item) => item.number === 24), { answer: "D" });
Object.assign(readingItems.find((item) => item.number === 25), { answer: "E" });
Object.assign(readingItems.find((item) => item.number === 29), { answer: "D" });
Object.assign(readingItems.find((item) => item.number === 30), { answer: "E" });
Object.assign(readingItems.find((item) => item.number === 34), { answer: "D" });
Object.assign(readingItems.find((item) => item.number === 35), { answer: "E" });

const test = {
  schemaVersion: "mock-test-1.0.0",
  testId: "HSK1-mock-02",
  recordLesson: "HSK1-MOCK-02",
  level: "HSK1",
  title: "HSK1 Mock Test 02",
  titleCn: "HSK1 模拟测试 02",
  mode: "mock_test",
  durationMinutes: 35,
  sourcePolicy: "自建题库；样题只作题型、题量和版式参考；词汇与语法范围为 HSK1-L01 至 HSK1-L12。L11-L12 依据 textbook data/L11.txt 与 L12.txt 命题。",
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
  audioParts: [
    { part: "L1_picture_choice", title: "听力第一部分 1-5", file: "../data-model/mock-tests/audio/HSK1-mock-02-listening-01.mp3", itemNumbers: [1, 2, 3, 4, 5] },
    { part: "L2_answer_choice", title: "听力第二部分 6-10", file: "../data-model/mock-tests/audio/HSK1-mock-02-listening-02.mp3", itemNumbers: [6, 7, 8, 9, 10] },
    { part: "L3_dialogue_picture_choice", title: "听力第三部分 11-15", file: "../data-model/mock-tests/audio/HSK1-mock-02-listening-03.mp3", itemNumbers: [11, 12, 13, 14, 15] },
    { part: "L4_sentence_question_answer", title: "听力第四部分 16-20", file: "../data-model/mock-tests/audio/HSK1-mock-02-listening-04.mp3", itemNumbers: [16, 17, 18, 19, 20] }
  ],
  sections: [
    { id: "listening", title: "听力", titleEn: "Listening", items: listeningItems },
    { id: "reading", title: "阅读", titleEn: "Reading", items: readingItems }
  ]
};

function audioScriptFor(part, items) {
  return items
    .filter((item) => item.part === part)
    .map((item) => {
      const lines = [`### ${item.number}`];
      lines.push(`第${item.number}题。`);
      const turns = item.audioTurns || [{ text: item.audioText }];
      for (const turn of turns) {
        const prefix = turn.voice ? `[${turn.voice}] ` : "";
        lines.push(`${prefix}${turn.text}`);
      }
      return lines.join("\n");
    })
    .join("\n\n") + "\n";
}

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.mkdirSync(audioScriptDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(test, null, 2) + "\n", "utf8");

for (const [idx, part] of ["L1_picture_choice", "L2_answer_choice", "L3_dialogue_picture_choice", "L4_sentence_question_answer"].entries()) {
  const n = String(idx + 1);
  const file = path.join(audioScriptDir, `HSK1-mock-02-L${n}_${part.replace(/^L\d_/, "")}-edge-tts.txt`);
  fs.writeFileSync(file, audioScriptFor(part, listeningItems), "utf8");
}

console.log(outJson);
console.log(audioScriptDir);
