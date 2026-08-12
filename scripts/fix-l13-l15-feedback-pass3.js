const fs = require("fs");
const path = require("path");

const lessonDir = path.join(__dirname, "..", "source", "data-model", "lessons");

function readLesson(id) {
  return JSON.parse(fs.readFileSync(path.join(lessonDir, `${id}.json`), "utf8"));
}

function writeLesson(id, data) {
  const q = data.inClass.questionGroups;
  data.classProQuestions.pictureGuess = q.v1_image_guess;
  data.classProQuestions.wordMatch = q.v7_word_match;
  data.classProQuestions.sentenceTransform = q.v4_complete_sentence;
  data.classProQuestions.pictureTalk = q.r4_picture_talk;
  fs.writeFileSync(path.join(lessonDir, `${id}.json`), JSON.stringify(data, null, 2) + "\n", "utf8");
}

function pairGroups(lesson, groups) {
  return groups.map((pairs, i) => ({
    id: `v7_l${lesson}_${String(i + 1).padStart(2, "0")}`,
    type: "word_match",
    stage: "in_class",
    prompt_cn: "词句匹配。",
    prompt_en: "Match each question with the best answer.",
    data: {
      pairs: pairs.map(([left, left_pinyin, right, right_pinyin]) => ({
        left,
        left_pinyin,
        right,
        right_pinyin
      })),
      order: [2, 0, 3, 1]
    },
    correct_answer: "全部配对正确",
    sourceType: "teaching_extension"
  }));
}

function setPictureTalk(data, rows) {
  const byWord = Object.fromEntries((data.vocabulary || []).map((v) => [v.word, v]));
  data.inClass.questionGroups.r4_picture_talk = rows.map((r, i) => ({
    id: `r4_l${data.lessonNumber}_pt_${String(i + 1).padStart(2, "0")}`,
    type: "oral",
    stage: "in_class",
    prompt_cn: r.question,
    prompt_en: "Look at the picture and answer in Chinese.",
    data: {
      question: r.question,
      question_pinyin: r.pinyin,
      instructions: "请用学过的词，说一句或两句中文。",
      image: (byWord[r.word] && byWord[r.word].image) || "",
      sampleAnswer: r.sample,
      sampleAnswerPinyin: r.sample_pinyin,
      patternType: r.type
    },
    openEnded: true,
    needsTeacherReview: true,
    cloudWall: true,
    weakPoints: `输出：${r.type}`,
    sourceType: "teaching_extension"
  }));
}

const wm14 = [
  [
    ["火车几点开？", "Huǒchē jǐ diǎn kāi?", "十点开。", "Shí diǎn kāi."],
    ["你中午去哪儿？", "Nǐ zhōngwǔ qù nǎr?", "我去学校。", "Wǒ qù xuéxiào."],
    ["这些字你都会写吗？", "Zhèxiē zì nǐ dōu huì xiě ma?", "有些会写，有些不会。", "Yǒuxiē huì xiě, yǒuxiē bú huì."],
    ["上课可以说话吗？", "Shàngkè kěyǐ shuōhuà ma?", "不可以，请听老师。", "Bù kěyǐ, qǐng tīng lǎoshī."]
  ],
  [
    ["谁听见了？", "Shéi tīngjiàn le?", "前面的学生听见了。", "Qiánmiàn de xuésheng tīngjiàn le."],
    ["你写了哪些字？", "Nǐ xiě le nǎxiē zì?", "我写了人、口和大。", "Wǒ xiě le rén, kǒu hé dà."],
    ["明年你妹妹上什么学校？", "Míngnián nǐ mèimei shàng shénme xuéxiào?", "她上中学。", "Tā shàng zhōngxué."],
    ["他们在做什么？", "Tāmen zài zuò shénme?", "有的看书，有的写字。", "Yǒude kàn shū, yǒude xiě zì."]
  ],
  [
    ["现在走晚不晚？", "Xiànzài zǒu wǎn bu wǎn?", "不晚，火车还没开。", "Bù wǎn, huǒchē hái méi kāi."],
    ["小学生会写这些字吗？", "Xiǎoxuéshēng huì xiě zhèxiē zì ma?", "会写几个。", "Huì xiě jǐ ge."],
    ["老师说话你听见了吗？", "Lǎoshī shuōhuà nǐ tīngjiàn le ma?", "听见了。", "Tīngjiàn le."],
    ["谁明年上小学？", "Shéi míngnián shàng xiǎoxué?", "我弟弟明年上小学。", "Wǒ dìdi míngnián shàng xiǎoxué."]
  ],
  [
    ["你们都学汉语吗？", "Nǐmen dōu xué Hànyǔ ma?", "我们都学汉语。", "Wǒmen dōu xué Hànyǔ."],
    ["谁不要说话？", "Shéi búyào shuōhuà?", "后面的学生不要说话。", "Hòumiàn de xuésheng búyào shuōhuà."],
    ["火车开了吗？", "Huǒchē kāi le ma?", "还没有。", "Hái méiyǒu."],
    ["你中午有时间吗？", "Nǐ zhōngwǔ yǒu shíjiān ma?", "有，我可以帮你。", "Yǒu, wǒ kěyǐ bāng nǐ."]
  ],
  [
    ["他们为什么不去学校？", "Tāmen wèishénme bú qù xuéxiào?", "今天太晚了。", "Jīntiān tài wǎn le."],
    ["你能听懂这些汉语吗？", "Nǐ néng tīngdǒng zhèxiē Hànyǔ ma?", "有些能听懂。", "Yǒuxiē néng tīngdǒng."],
    ["中学生在写什么？", "Zhōngxuéshēng zài xiě shénme?", "他们在写名字。", "Tāmen zài xiě míngzi."],
    ["这个字你写对了吗？", "Zhège zì nǐ xiě duì le ma?", "没有，我写错了。", "Méiyǒu, wǒ xiě cuò le."]
  ]
];

const wm15 = [
  [
    ["你爱吃哪个菜？", "Nǐ ài chī nǎge cài?", "我爱吃这个菜。", "Wǒ ài chī zhège cài."],
    ["这些菜都好吃吗？", "Zhèxiē cài dōu hǎochī ma?", "有的好吃，有的不好吃。", "Yǒude hǎochī, yǒude bù hǎochī."],
    ["去年你跟谁去了西安？", "Qùnián nǐ gēn shéi qù le Xī'ān?", "我跟男朋友去了。", "Wǒ gēn nánpéngyou qù le."],
    ["西安好玩儿吗？", "Xī'ān hǎowánr ma?", "很好玩儿。", "Hěn hǎowánr."]
  ],
  [
    ["去北京要几个小时？", "Qù Běijīng yào jǐ ge xiǎoshí?", "坐飞机要一个小时。", "Zuò fēijī yào yí ge xiǎoshí."],
    ["你家人在北京吗？", "Nǐ jiārén zài Běijīng ma?", "我姐姐在北京。", "Wǒ jiějie zài Běijīng."],
    ["你有时间去机场吗？", "Nǐ yǒu shíjiān qù jīchǎng ma?", "有，我可以去接你。", "Yǒu, wǒ kěyǐ qù jiē nǐ."],
    ["你们住哪儿？", "Nǐmen zhù nǎr?", "我们住朋友家。", "Wǒmen zhù péngyou jiā."]
  ],
  [
    ["你们在哪个机场见？", "Nǐmen zài nǎge jīchǎng jiàn?", "在大兴机场见。", "Zài Dàxīng Jīchǎng jiàn."],
    ["飞机几点到北京？", "Fēijī jǐ diǎn dào Běijīng?", "早上八点到。", "Zǎoshang bā diǎn dào."],
    ["那我们怎么去？", "Nà wǒmen zěnme qù?", "先坐车，再走。", "Xiān zuò chē, zài zǒu."],
    ["你想住几年？", "Nǐ xiǎng zhù jǐ nián?", "我想住一年。", "Wǒ xiǎng zhù yì nián."]
  ],
  [
    ["谁去机场接你？", "Shéi qù jīchǎng jiē nǐ?", "王老师的姐姐去接我。", "Wáng lǎoshī de jiějie qù jiē wǒ."],
    ["你去年去哪儿了？", "Nǐ qùnián qù nǎr le?", "去了西安，也去了北京。", "Qù le Xī'ān, yě qù le Běijīng."],
    ["你的家人都住北京吗？", "Nǐ de jiārén dōu zhù Běijīng ma?", "不都住北京。", "Bù dōu zhù Běijīng."],
    ["今天早上走早不早？", "Jīntiān zǎoshang zǒu zǎo bu zǎo?", "不早，正好。", "Bù zǎo, zhènghǎo."]
  ],
  [
    ["你爱坐飞机吗？", "Nǐ ài zuò fēijī ma?", "不太爱。", "Bù tài ài."],
    ["哪个地方好玩儿？", "Nǎge dìfang hǎowánr?", "西安好玩儿，北京也好玩儿。", "Xī'ān hǎowánr, Běijīng yě hǎowánr."],
    ["你还有时间看书吗？", "Nǐ hái yǒu shíjiān kàn shū ma?", "没有时间。", "Méiyǒu shíjiān."],
    ["大兴机场在哪儿？", "Dàxīng Jīchǎng zài nǎr?", "在北京。", "Zài Běijīng."]
  ]
];

const pictureTalk = {
  "HSK1-L13": [
    ["你看到了什么？", "Nǐ kàn dào le shénme?", "打电话", "我看到一个人在打电话。", "Wǒ kàn dào yí ge rén zài dǎ diànhuà.", "观察"],
    ["她是谁？", "Tā shì shéi?", "服务员", "她是服务员。", "Tā shì fúwùyuán.", "人物"],
    ["她在做什么？", "Tā zài zuò shénme?", "坐", "她在坐着。", "Tā zài zuò zhe.", "动作"],
    ["桌子上有什么？", "Zhuōzi shàng yǒu shénme?", "茶", "桌子上有一杯茶。", "Zhuōzi shàng yǒu yì bēi chá.", "物品"],
    ["早饭有什么？", "Zǎofàn yǒu shénme?", "早饭", "早饭有面包和鸡蛋。", "Zǎofàn yǒu miànbāo hé jīdàn.", "食物"],
    ["你想要哪个？", "Nǐ xiǎng yào nǎge?", "这个", "我想要这个。", "Wǒ xiǎng yào zhège.", "选择"]
  ],
  "HSK1-L14": [
    ["你看到了什么？", "Nǐ kàn dào le shénme?", "火车", "我看到了火车。", "Wǒ kàn dào le huǒchē.", "观察"],
    ["他们在哪儿？", "Tāmen zài nǎr?", "中学", "他们在学校。", "Tāmen zài xuéxiào.", "地点"],
    ["他们在做什么？", "Tāmen zài zuò shénme?", "说话", "他们在说话。", "Tāmen zài shuōhuà.", "动作"],
    ["她在做什么？", "Tā zài zuò shénme?", "写", "她在写字。", "Tā zài xiě zì.", "动作"],
    ["你看见哪些字？", "Nǐ kànjiàn nǎxiē zì?", "字", "我看见一些汉字。", "Wǒ kànjiàn yìxiē Hànzì.", "汉字"],
    ["现在早不早？", "Xiànzài zǎo bu zǎo?", "晚", "不早，有点儿晚。", "Bù zǎo, yǒudiǎnr wǎn.", "时间"]
  ],
  "HSK1-L15": [
    ["你看到了什么？", "Nǐ kàn dào le shénme?", "爱", "我看到一些菜。", "Wǒ kàn dào yìxiē cài.", "观察"],
    ["这是哪里？", "Zhè shì nǎli?", "西安", "这是西安。", "Zhè shì Xī'ān.", "地点"],
    ["他是谁？", "Tā shì shéi?", "男朋友", "他是男朋友。", "Tā shì nánpéngyou.", "人物"],
    ["这个地方怎么样？", "Zhège dìfang zěnmeyàng?", "好玩儿", "这个地方很好玩儿。", "Zhège dìfang hěn hǎowánr.", "评价"],
    ["这是什么？", "Zhè shì shénme?", "飞机", "这是飞机。", "Zhè shì fēijī.", "交通"],
    ["他们在哪儿见？", "Tāmen zài nǎr jiàn?", "大兴机场", "他们在大兴机场见。", "Tāmen zài Dàxīng Jīchǎng jiàn.", "地点"]
  ]
};

for (const id of ["HSK1-L13", "HSK1-L14", "HSK1-L15"]) {
  const data = readLesson(id);
  if (id === "HSK1-L14") data.inClass.questionGroups.v7_word_match = pairGroups("14", wm14);
  if (id === "HSK1-L15") data.inClass.questionGroups.v7_word_match = pairGroups("15", wm15);
  setPictureTalk(data, pictureTalk[id].map(([question, pinyin, word, sample, sample_pinyin, type]) => ({ question, pinyin, word, sample, sample_pinyin, type })));
  writeLesson(id, data);
}

console.log("Applied L13-L15 feedback pass 3.");
