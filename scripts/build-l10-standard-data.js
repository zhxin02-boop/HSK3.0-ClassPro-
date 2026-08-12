const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "source", "data-model", "lessons", "HSK1-L10.json");

const vocab = [
  ["杯子", "bēizi", "名词", "cup; glass", "object"],
  ["售货员", "shòuhuòyuán", "名词", "shop assistant; salesperson", "person"],
  ["这边", "zhèbiān", "代词", "this side; here", "place"],
  ["钱", "qián", "名词", "money", "thing"],
  ["这些", "zhèxiē", "代词", "these", "function"],
  ["块", "kuài", "量词", "yuan; measure word for money", "money"],
  ["那些", "nàxiē", "代词", "those", "function"],
  ["这儿", "zhèr", "代词", "here", "place"],
  ["水果", "shuǐguǒ", "名词", "fruit", "food"],
  ["少", "shǎo", "形容词", "few; little", "adjective"],
  ["斤", "jīn", "量词", "jin; half a kilogram", "measure"],
  ["苹果", "píngguǒ", "名词", "apple", "food"],
  ["便宜", "piányi", "形容词", "cheap; affordable", "adjective"],
  ["商店", "shāngdiàn", "名词", "shop; store", "place"],
  ["衣服", "yīfu", "名词", "clothes", "thing"],
  ["件", "jiàn", "量词", "measure word for clothes", "measure"],
  ["元", "yuán", "量词", "yuan", "money"],
  ["怎么样", "zěnmeyàng", "代词", "how; what do you think", "function"],
  ["贵", "guì", "形容词", "expensive", "adjective"],
  ["穿", "chuān", "动词", "wear; put on", "action"],
  ["女", "nǚ", "形容词", "female", "person"],
  ["男", "nán", "形容词", "male", "person"],
  ["那儿", "nàr", "代词", "there", "place"]
].map((x, i) => ({
  id: `v_l10_${String(i + 1).padStart(2, "0")}`,
  hanzi: x[0],
  word: x[0],
  pinyin: x[1],
  pos: x[2],
  english: x[3],
  sourceType: "textbook",
  tags: ["L10"],
  category: x[4]
}));

const idOf = Object.fromEntries(vocab.map((v) => [v.word, v.id]));
const imageMap = {
  "杯子": "images/vocab/hsk1-l10/v01_beizi.png",
  "售货员": "images/vocab/hsk1-l10/v02_shouhuoyuan.png",
  "钱": "images/vocab/hsk1-l10/v03_qian.png",
  "水果": "images/vocab/hsk1-l10/v04_shuiguo.png",
  "苹果": "images/vocab/hsk1-l10/v05_pingguo.png",
  "商店": "images/vocab/hsk1-l10/v06_shangdian.png",
  "衣服": "images/vocab/hsk1-l10/v07_yifu.png",
  "贵": "images/vocab/hsk1-l10/v08_gui.png",
  "便宜": "images/vocab/hsk1-l10/v09_pianyi.png",
  "穿": "images/vocab/hsk1-l10/v10_chuan.png",
  "这边": "images/vocab/hsk1-l10/v11_zhebian.png",
  "那儿": "images/vocab/hsk1-l10/v12_nar.png",
  "这儿": "images/vocab/hsk1-l10/v11_zhebian.png",
  "那些": "images/vocab/hsk1-l10/v12_nar.png",
  "这些": "images/vocab/hsk1-l10/v11_zhebian.png"
};
vocab.forEach((v) => {
  if (imageMap[v.word]) v.image = imageMap[v.word];
});

const ext = {
  "杯子": [["一个杯子", "yí gè bēizi", "a cup"], ["买杯子", "mǎi bēizi", "buy cups"], ["这个杯子", "zhège bēizi", "this cup"]],
  "售货员": [["一个售货员", "yí gè shòuhuòyuán", "a salesperson"], ["问售货员", "wèn shòuhuòyuán", "ask the salesperson"], ["售货员说", "shòuhuòyuán shuō", "the salesperson says"]],
  "这边": [["在这边", "zài zhèbiān", "over here"], ["杯子在这边", "bēizi zài zhèbiān", "the cups are here"], ["请来这边", "qǐng lái zhèbiān", "please come here"]],
  "钱": [["多少钱", "duōshao qián", "how much money"], ["五块钱", "wǔ kuài qián", "five yuan"], ["七块钱", "qī kuài qián", "seven yuan"]],
  "这些": [["这些杯子", "zhèxiē bēizi", "these cups"], ["这些苹果", "zhèxiē píngguǒ", "these apples"], ["这些衣服", "zhèxiē yīfu", "these clothes"]],
  "块": [["五块", "wǔ kuài", "five yuan"], ["十块", "shí kuài", "ten yuan"], ["三块五", "sān kuài wǔ", "three yuan fifty"]],
  "那些": [["那些杯子", "nàxiē bēizi", "those cups"], ["那些衣服", "nàxiē yīfu", "those clothes"], ["那些苹果", "nàxiē píngguǒ", "those apples"]],
  "这儿": [["这儿的水果", "zhèr de shuǐguǒ", "the fruit here"], ["这儿真好", "zhèr zhēn hǎo", "it is really good here"], ["我在这儿", "wǒ zài zhèr", "I am here"]],
  "水果": [["买水果", "mǎi shuǐguǒ", "buy fruit"], ["这儿的水果", "zhèr de shuǐguǒ", "the fruit here"], ["水果不少", "shuǐguǒ bù shǎo", "there is a lot of fruit"]],
  "少": [["不少", "bù shǎo", "not few; quite a lot"], ["水果不少", "shuǐguǒ bù shǎo", "there is a lot of fruit"], ["钱不少", "qián bù shǎo", "not a small amount of money"]],
  "斤": [["一斤苹果", "yì jīn píngguǒ", "one jin of apples"], ["两斤水果", "liǎng jīn shuǐguǒ", "two jin of fruit"], ["三块五一斤", "sān kuài wǔ yì jīn", "3.5 yuan per jin"]],
  "苹果": [["买苹果", "mǎi píngguǒ", "buy apples"], ["两斤苹果", "liǎng jīn píngguǒ", "two jin of apples"], ["苹果真便宜", "píngguǒ zhēn piányi", "the apples are really cheap"]],
  "便宜": [["真便宜", "zhēn piányi", "really cheap"], ["苹果便宜", "píngguǒ piányi", "apples are cheap"], ["这儿的水果便宜", "zhèr de shuǐguǒ piányi", "the fruit here is cheap"]],
  "商店": [["一家商店", "yì jiā shāngdiàn", "a store"], ["这家商店", "zhè jiā shāngdiàn", "this store"], ["商店里", "shāngdiàn lǐ", "in the store"]],
  "衣服": [["买衣服", "mǎi yīfu", "buy clothes"], ["女孩子的衣服", "nǚ háizi de yīfu", "girls' clothes"], ["男孩子的衣服", "nán háizi de yīfu", "boys' clothes"]],
  "件": [["一件衣服", "yí jiàn yīfu", "one piece of clothing"], ["买一件", "mǎi yí jiàn", "buy one"], ["这件衣服", "zhè jiàn yīfu", "this piece of clothing"]],
  "元": [["一百元", "yìbǎi yuán", "one hundred yuan"], ["五元", "wǔ yuán", "five yuan"], ["十元", "shí yuán", "ten yuan"]],
  "怎么样": [["怎么样", "zěnmeyàng", "how is it"], ["这个杯子怎么样", "zhège bēizi zěnmeyàng", "how is this cup"], ["这件衣服怎么样", "zhè jiàn yīfu zěnmeyàng", "how is this clothing"]],
  "贵": [["不贵", "bú guì", "not expensive"], ["太贵了", "tài guì le", "too expensive"], ["也不贵", "yě bú guì", "also not expensive"]],
  "穿": [["能穿", "néng chuān", "can wear"], ["不能穿", "bù néng chuān", "cannot wear"], ["孩子穿的衣服", "háizi chuān de yīfu", "clothes children wear"]],
  "女": [["女孩子", "nǚ háizi", "girl"], ["女学生", "nǚ xuésheng", "female student"], ["女孩子的衣服", "nǚ háizi de yīfu", "girls' clothes"]],
  "男": [["男孩子", "nán háizi", "boy"], ["男学生", "nán xuésheng", "male student"], ["男孩子的衣服", "nán háizi de yīfu", "boys' clothes"]],
  "那儿": [["在那儿", "zài nàr", "over there"], ["衣服在那儿", "yīfu zài nàr", "the clothes are there"], ["男孩子的衣服在那儿", "nán háizi de yīfu zài nàr", "the boys' clothes are there"]]
};

const vocabExtensions = Object.fromEntries(vocab.map((v) => [v.id, {
  word: v.word,
  examples: ext[v.word].map((e) => ({ hanzi: e[0], pinyin: e[1], english: e[2], sourceType: "teaching_extension" })),
  collocations: ext[v.word].map((e) => ({ hanzi: e[0], pinyin: e[1], english: e[2], sourceType: "teaching_extension" }))
}]));

const texts = [
  {
    id: "t_l10_01",
    title: "课文一：买杯子",
    setting: "在一家小店，王一雪在买杯子。",
    lines: [
      ["王一雪", "请问，有杯子吗？", "Qǐngwèn, yǒu bēizi ma?", "Excuse me, do you have any cups?"],
      ["售货员", "有，杯子在这边。", "Yǒu, bēizi zài zhèbiān.", "Yes, the cups are over here."],
      ["王一雪", "多少钱一个？", "Duōshao qián yí gè?", "How much is one?"],
      ["售货员", "这些五块钱一个，那些十块钱一个。", "Zhèxiē wǔ kuài qián yí gè, nàxiē shí kuài qián yí gè.", "These are five yuan each, and those are ten yuan each."],
      ["王一雪", "我买这个吧。", "Wǒ mǎi zhège ba.", "I'll take this one, please."]
    ]
  },
  {
    id: "t_l10_02",
    title: "课文二：买苹果",
    setting: "在菜市场，王一雪在买水果。",
    lines: [
      ["王一雪", "这儿的水果真不少！", "Zhèr de shuǐguǒ zhēn bù shǎo!", "There's so much fruit here!"],
      ["售货员", "您想买什么？", "Nín xiǎng mǎi shénme?", "What would you like to buy?"],
      ["王一雪", "我想买两斤苹果。", "Wǒ xiǎng mǎi liǎng jīn píngguǒ.", "I'd like two jin of apples, please."],
      ["售货员", "苹果三块五一斤。这些七块二，七块钱吧。", "Píngguǒ sān kuài wǔ yì jīn. Zhèxiē qī kuài èr, qī kuài qián ba.", "The apples are 3.5 yuan per jin. That's 7.2 yuan in total; let's make it 7 yuan."],
      ["王一雪", "好的，这儿的苹果真便宜！", "Hǎo de, zhèr de píngguǒ zhēn piányi!", "Great! The apples here are really affordable!"]
    ]
  },
  {
    id: "t_l10_03",
    title: "课文三：买衣服",
    setting: "在商场里，刘明和王一雪在给孩子买衣服。",
    lines: [
      ["王一雪", "这家商店衣服真多！这件一百元，怎么样？", "Zhè jiā shāngdiàn yīfu zhēn duō! Zhè jiàn yìbǎi yuán, zěnmeyàng?", "There are so many clothes in this store! This one is 100 yuan. What do you think?"],
      ["刘明", "好看，也不贵。", "Hǎokàn, yě bú guì.", "It looks good, and it is not expensive."],
      ["王一雪", "小雪能穿，买一件吧。", "Xiǎoxuě néng chuān, mǎi yí jiàn ba.", "Xiaoxue can wear it. Let's buy one."],
      ["刘明", "好的。小明能穿吗？", "Hǎo de. Xiǎomíng néng chuān ma?", "Okay. Can Xiaoming wear it?"],
      ["王一雪", "不能。这些是女孩子穿的衣服，男孩子的衣服在那儿。", "Bù néng. Zhèxiē shì nǚ háizi chuān de yīfu, nán háizi de yīfu zài nàr.", "No. These are girls' clothes. Boys' clothes are over there."],
      ["刘明", "好的。", "Hǎo de.", "Alright."]
    ]
  }
].map((t) => ({
  ...t,
  sourceType: "textbook",
  lines: t.lines.map((x, i) => ({ order: i + 1, speaker: x[0], hanzi: x[1], pinyin: x[2], english: x[3], sourceType: "textbook" }))
}));

const grammar = [
  {
    id: "g_l10_01",
    title: "钱数的表达",
    titleEn: "Expression of Amount of Money",
    structure: "数字 + 块/元 + 钱",
    explanation: "人民币单位由大到小是元、角、分；口语中常说块、毛、分。",
    examples: [
      ["三块", "sān kuài", "three yuan"],
      ["三块五", "sān kuài wǔ", "three yuan fifty"],
      ["七块钱", "qī kuài qián", "seven yuan"]
    ]
  },
  {
    id: "g_l10_02",
    title: "形容词谓语句",
    titleEn: "Adjectival-Predicate Sentences",
    structure: "主语 + 程度副词/否定副词 + 形容词",
    explanation: "形容词可以直接作谓语，前面常用很、真、太、不、也不等。",
    examples: [
      ["这儿的水果真不少！", "Zhèr de shuǐguǒ zhēn bù shǎo!", "There is really a lot of fruit here."],
      ["好看，也不贵。", "Hǎokàn, yě bú guì.", "It looks good and is not expensive."],
      ["这儿的苹果真便宜！", "Zhèr de píngguǒ zhēn piányi!", "The apples here are really cheap."]
    ]
  },
  {
    id: "g_l10_03",
    title: "疑问代词“怎么样”",
    titleEn: "Interrogative Pronoun 怎么样",
    structure: "……怎么样？",
    explanation: "“怎么样”用于征求意见或询问情况。",
    examples: [
      ["这个杯子怎么样？", "Zhège bēizi zěnmeyàng?", "What do you think of this cup?"],
      ["这件衣服怎么样？", "Zhè jiàn yīfu zěnmeyàng?", "What do you think of this clothing?"],
      ["这个苹果怎么样？", "Zhège píngguǒ zěnmeyàng?", "How is this apple?"]
    ]
  }
];

grammar.forEach((g) => {
  g.examples = g.examples.map((e) => ({
    hanzi: e[0],
    pinyin: e[1],
    english: e[2],
    sourceType: e[0].includes("这儿的") || e[0].includes("好看") ? "textbook" : "teaching_extension"
  }));
});

const grammarI18n = {
  g_l10_01: {
    structureEn: "number + kuai/yuan + qian",
    structureRu: "число + 块/元 + 钱",
    english: "Use 块 or 元 to talk about RMB amounts. In spoken Chinese, 块 is common; 钱 can be added after the amount. 三块五 means three yuan and five jiao.",
    russian: "Для цены в юанях используются 块 или 元. В разговорной речи чаще говорят 块; после суммы можно добавить 钱. 三块五 означает 3 юаня 5 цзяо."
  },
  g_l10_02: {
    structureEn: "subject + degree/negative adverb + adjective",
    structureRu: "подлежащее + наречие степени/отрицание + прилагательное",
    english: "In Chinese, an adjective can work as the predicate without 是. A degree word such as 很, 真, 太, or a negative word such as 不 often appears before the adjective.",
    russian: "В китайском языке прилагательное может быть сказуемым без 是. Перед прилагательным часто ставятся 很, 真, 太 или отрицание 不."
  },
  g_l10_03: {
    structureEn: "... zěnmeyàng?",
    structureRu: "... 怎么样?",
    english: "怎么样 asks for an opinion or evaluation. It is useful when asking what someone thinks about an item, a person, a place, or a plan.",
    russian: "怎么样 используется, чтобы спросить мнение или оценку. Эта структура подходит для вопроса о вещи, человеке, месте или плане."
  }
};

const grammarTeachingNotes = Object.fromEntries(grammar.map((g) => [g.id, {
  structure: g.structure,
  structureEn: grammarI18n[g.id].structureEn,
  structureRu: grammarI18n[g.id].structureRu,
  english: grammarI18n[g.id].english,
  russian: grammarI18n[g.id].russian,
  title: g.title,
  titleEn: g.titleEn,
  formula: {
    pattern: g.structure,
    patternEn: grammarI18n[g.id].structureEn,
    note: g.explanation,
    noteEn: grammarI18n[g.id].english,
    noteRu: grammarI18n[g.id].russian
  },
  explanation: g.explanation,
  examples: g.examples,
  teacherTips: ["先用实物/图片引出语义，再练问价和评价。", "钱数题要避免同时出现多个可接受答案。"]
}]));

function choice(id, prompt, options, answer, kp, extra = {}) {
  return { id, type: extra.type || "choice", stage: "in_class", prompt_cn: prompt, prompt_en: extra.prompt_en || "Choose the best answer.", data: { ...(extra.data || {}), options, correct_index: options.indexOf(answer) }, correct_answer: answer, kp, sourceType: extra.sourceType || "teaching_extension" };
}

const imagePool = ["杯子", "钱", "水果", "苹果", "商店", "衣服", "女", "男", "这边", "那儿", "售货员", "便宜"];
const imageGuess = ["杯子", "钱", "水果", "苹果", "商店", "衣服", "售货员", "便宜", "贵", "穿"].map((w, i) => {
  const options = [w].concat(imagePool.filter((x) => x !== w)).slice(0, 4);
  return choice(`v1_l10_${i + 1}`, "图片猜词。", options, w, w, { type: "image_guess", data: { image: imageMap[w], image_hint: w }, sourceType: "textbook" });
});

const fillItems = [
  ["请问，有___吗？", "Qǐngwèn, yǒu ___ ma?", ["杯子", "块", "斤", "件"], "杯子"],
  ["这些五___钱一个。", "Zhèxiē wǔ ___ qián yí gè.", ["块", "件", "斤", "本"], "块"],
  ["我想买两斤___。", "Wǒ xiǎng mǎi liǎng jīn ___.", ["苹果", "衣服", "杯子", "商店"], "苹果"],
  ["这儿的苹果真___！", "Zhèr de píngguǒ zhēn ___!", ["便宜", "女", "男", "少"], "便宜"],
  ["这家商店___真多！", "Zhè jiā shāngdiàn ___ zhēn duō!", ["衣服", "块", "斤", "元"], "衣服"],
  ["这件一百元，___？", "Zhè jiàn yìbǎi yuán, ___?", ["怎么样", "多少", "哪儿", "谁"], "怎么样"],
  ["好看，也不___。", "Hǎokàn, yě bú ___.", ["贵", "少", "男", "女"], "贵"],
  ["小雪能___，买一件吧。", "Xiǎoxuě néng ___, mǎi yí jiàn ba.", ["穿", "买", "去", "坐"], "穿"],
  ["男孩子的衣服在___。", "Nán háizi de yīfu zài ___.", ["那儿", "这些", "那些", "块"], "那儿"],
  ["杯子在___。", "Bēizi zài ___.", ["这边", "几块", "一斤", "便宜"], "这边"]
].map((x, i) => choice(`v5_l10_${i + 1}`, "选词填空。", x[2], x[3], x[3], { type: "vocab_fill", data: { sentence: x[0], sentence_pinyin: x[1] }, sourceType: i < 5 ? "textbook" : "teaching_extension" }));

const l10Pinyin = Object.assign({
  "我": "wǒ",
  "你": "nǐ",
  "您": "nín",
  "有": "yǒu",
  "在": "zài",
  "去": "qù",
  "买": "mǎi",
  "想": "xiǎng",
  "吧": "ba",
  "几": "jǐ",
  "什么": "shénme",
  "去哪儿": "qù nǎr",
  "一个": "yí gè",
  "一斤苹果": "yì jīn píngguǒ",
  "一斤": "yì jīn",
  "一件衣服": "yí jiàn yīfu",
  "一件": "yí jiàn",
  "两斤": "liǎng jīn",
  "三块五": "sān kuài wǔ",
  "五块钱": "wǔ kuài qián",
  "七块钱": "qī kuài qián",
  "十块钱": "shí kuài qián",
  "一百元": "yìbǎi yuán",
  "多少钱": "duōshao qián",
  "多不多": "duō bu duō",
  "在哪儿": "zài nǎr",
  "在那儿": "zài nàr",
  "在这边": "zài zhèbiān",
  "这件": "zhè jiàn",
  "这个": "zhège",
  "这些": "zhèxiē",
  "那些": "nàxiē",
  "这儿": "zhèr",
  "真": "zhēn",
  "不": "bù",
  "不太": "bú tài",
  "也": "yě",
  "能": "néng",
  "不能": "bù néng",
  "好看": "hǎokàn",
  "好吃": "hǎochī",
  "菜": "cài",
  "很": "hěn",
  "喜欢": "xǐhuan",
  "小明": "Xiǎomíng",
  "女孩子": "nǚ háizi",
  "男孩子": "nán háizi",
  "孩子": "háizi",
  "的": "de",
  "吗": "ma",
  "？": "",
  "。": "",
  "，": ""
}, Object.fromEntries(vocab.map((v) => [v.word, v.pinyin])));

function pinyinText(text) {
  let out = String(text || "");
  Object.keys(l10Pinyin).sort((a, b) => b.length - a.length).forEach((k) => {
    out = out.split(k).join(` ${l10Pinyin[k]} `);
  });
  return out.replace(/[，。？！,.?!：:；;]/g, " ").replace(/\s+/g, " ").trim();
}

const wordMatch = [
  [["多少钱一个？", "五块钱一个。"], ["您想买什么？", "我想买两斤苹果。"], ["这件衣服怎么样？", "好看，也不贵。"], ["杯子在哪儿？", "杯子在这边。"]],
  [["苹果多少钱一斤？", "三块五一斤。"], ["你买什么？", "我买这个吧。"], ["小明能穿吗？", "不能。"], ["男孩子的衣服在哪儿？", "在那儿。"]],
  [["这儿的水果多不多？", "这儿的水果真不少。"], ["这件多少钱？", "一百元。"], ["你喜欢这个杯子吗？", "我很喜欢，也不贵。"], ["你去哪儿买衣服？", "我去商店买衣服。"]],
  [["你想买几斤苹果？", "我想买两斤苹果。"], ["这些多少钱？", "七块钱。"], ["那些多少钱一个？", "十块钱一个。"], ["女孩子穿什么？", "女孩子穿这件衣服。"]],
  [["这个苹果怎么样？", "很好吃，也很便宜。"], ["这个菜怎么样？", "不太好吃。"], ["你有多少钱？", "我有十块钱。"], ["你在哪儿？", "我在这儿。"]]
].map((pairs, i) => ({ id: `v7_l10_${i + 1}`, type: "word_match", stage: "in_class", prompt_cn: "词句匹配。", prompt_en: "Match each question with the best answer.", data: { pairs: pairs.map((p) => ({ left: p[0], left_pinyin: pinyinText(p[0]), right: p[1], right_pinyin: pinyinText(p[1]) })) }, correct_answer: "全部配对正确", sourceType: "teaching_extension" }));

const memoryMatch = [
  [["杯子", "cup; glass"], ["售货员", "salesperson"], ["这边", "this side; here"], ["钱", "money"]],
  [["五块钱", "five yuan"], ["十块钱", "ten yuan"], ["三块五", "three yuan fifty"], ["一百元", "one hundred yuan"]],
  [["水果", "fruit"], ["苹果", "apple"], ["一斤苹果", "one jin of apples"], ["两斤苹果", "two jin of apples"]],
  [["商店", "shop; store"], ["衣服", "clothes"], ["一件衣服", "one piece of clothing"], ["男孩子的衣服", "boys' clothes"]],
  [["便宜", "cheap"], ["贵", "expensive"], ["怎么样", "how; what do you think"], ["穿", "wear"]]
].map((pairs, i) => ({
  id: `v8_l10_${i + 1}`,
  type: "memory_match",
  stage: "in_class",
  prompt_cn: "词了个词。",
  prompt_en: "Matching game.",
  data: {
    pairs: pairs.map((p) => ({ left: p[0], left_pinyin: pinyinText(p[0]), right: p[1] })),
    order: [2, 0, 3, 1]
  },
  correct_answer: "全部配对正确",
  sourceType: "teaching_extension"
}));

const sentenceTransform = [
  ["五块钱一个。", "Wǔ kuài qián yí gè.", ["多少钱一个？", "你在哪儿？", "你买什么？", "这个怎么样？"], ["Duōshao qián yí gè?", "Nǐ zài nǎr?", "Nǐ mǎi shénme?", "Zhège zěnmeyàng?"], "多少钱一个？"],
  ["我想买两斤苹果。", "Wǒ xiǎng mǎi liǎng jīn píngguǒ.", ["你想买什么？", "多少钱一斤？", "你在哪儿买？", "你几点买？"], ["Nǐ xiǎng mǎi shénme?", "Duōshao qián yì jīn?", "Nǐ zài nǎr mǎi?", "Nǐ jǐ diǎn mǎi?"], "你想买什么？"],
  ["杯子在这边。", "Bēizi zài zhèbiān.", ["杯子在哪儿？", "杯子多少钱？", "杯子怎么样？", "你买杯子吗？"], ["Bēizi zài nǎr?", "Bēizi duōshao qián?", "Bēizi zěnmeyàng?", "Nǐ mǎi bēizi ma?"], "杯子在哪儿？"],
  ["好看，也不贵。", "Hǎokàn, yě bú guì.", ["这件衣服怎么样？", "这件衣服在哪儿？", "谁买衣服？", "你买几件？"], ["Zhè jiàn yīfu zěnmeyàng?", "Zhè jiàn yīfu zài nǎr?", "Shéi mǎi yīfu?", "Nǐ mǎi jǐ jiàn?"], "这件衣服怎么样？"],
  ["男孩子的衣服在那儿。", "Nán háizi de yīfu zài nàr.", ["男孩子的衣服在哪儿？", "女孩子是谁？", "你买什么水果？", "多少钱一斤？"], ["Nán háizi de yīfu zài nǎr?", "Nǚ háizi shì shéi?", "Nǐ mǎi shénme shuǐguǒ?", "Duōshao qián yì jīn?"], "男孩子的衣服在哪儿？"],
  ["这儿的苹果真便宜。", "Zhèr de píngguǒ zhēn piányi.", ["这儿的苹果怎么样？", "你有几个苹果？", "苹果在哪儿？", "谁买苹果？"], ["Zhèr de píngguǒ zěnmeyàng?", "Nǐ yǒu jǐ gè píngguǒ?", "Píngguǒ zài nǎr?", "Shéi mǎi píngguǒ?"], "这儿的苹果怎么样？"],
  ["我买这个吧。", "Wǒ mǎi zhège ba.", ["你买哪个？", "你叫什么？", "现在几点？", "你在哪儿工作？"], ["Nǐ mǎi nǎge?", "Nǐ jiào shénme?", "Xiànzài jǐ diǎn?", "Nǐ zài nǎr gōngzuò?"], "你买哪个？"],
  ["这件一百元。", "Zhè jiàn yìbǎi yuán.", ["这件多少钱？", "你买几斤？", "这是谁？", "你几岁？"], ["Zhè jiàn duōshao qián?", "Nǐ mǎi jǐ jīn?", "Zhè shì shéi?", "Nǐ jǐ suì?"], "这件多少钱？"],
  ["小雪能穿。", "Xiǎoxuě néng chuān.", ["小雪能穿吗？", "小雪在哪儿？", "小雪买什么水果？", "小雪几点下课？"], ["Xiǎoxuě néng chuān ma?", "Xiǎoxuě zài nǎr?", "Xiǎoxuě mǎi shénme shuǐguǒ?", "Xiǎoxuě jǐ diǎn xiàkè?"], "小雪能穿吗？"],
  ["我在这儿。", "Wǒ zài zhèr.", ["你在哪儿？", "你买什么？", "这儿的苹果怎么样？", "你想去哪儿？"], ["Nǐ zài nǎr?", "Nǐ mǎi shénme?", "Zhèr de píngguǒ zěnmeyàng?", "Nǐ xiǎng qù nǎr?"], "你在哪儿？"]
].map((x, i) => choice(`v4_l10_${i + 1}`, "选择正确的问句。", x[2], x[4], "句型转换：给答句选问句", { type: "sentence_transform", data: { source_sentence: x[0], source_pinyin: x[1], options_pinyin: x[3] } }));

const ordering = [
  ["这儿的苹果真便宜", ["这儿", "的", "苹果", "真", "便宜"], ["zhèr", "de", "píngguǒ", "zhēn", "piányi"]],
  ["杯子在这边", ["杯子", "在", "这边"], ["bēizi", "zài", "zhèbiān"]],
  ["我想买两斤苹果", ["我", "想", "买", "两斤", "苹果"], ["wǒ", "xiǎng", "mǎi", "liǎng jīn", "píngguǒ"]],
  ["这些五块钱一个", ["这些", "五块钱", "一个"], ["zhèxiē", "wǔ kuài qián", "yí gè"]],
  ["男孩子的衣服在那儿", ["男孩子", "的", "衣服", "在", "那儿"], ["nán háizi", "de", "yīfu", "zài", "nàr"]],
  ["这件衣服怎么样", ["这件", "衣服", "怎么样"], ["zhè jiàn", "yīfu", "zěnmeyàng"]],
  ["这家商店衣服真多", ["这家", "商店", "衣服", "真", "多"], ["zhè jiā", "shāngdiàn", "yīfu", "zhēn", "duō"]],
  ["我买这个吧", ["我", "买", "这个", "吧"], ["wǒ", "mǎi", "zhège", "ba"]],
  ["小雪能穿", ["小雪", "能", "穿"], ["Xiǎoxuě", "néng", "chuān"]],
  ["这儿的水果真不少", ["这儿", "的", "水果", "真", "不少"], ["zhèr", "de", "shuǐguǒ", "zhēn", "bù shǎo"]]
].map((x, i) => ({ id: `g1_l10_${i + 1}`, type: "ordering", stage: "in_class", prompt_cn: "连词成句。", prompt_en: "Put the chunks in order.", data: { chunks: x[1], chunks_pinyin: x[2] }, correct_answer: x[0], acceptable_answers: [x[0], x[0] + "。", x[0] + "？"], sourceType: "teaching_extension" }));

const translationChoice = [
  ["The apples here are really cheap.", "Яблоки здесь очень дешевые.", "这儿的苹果真便宜。", ["这儿的苹果真便宜。", "这些五块钱一个。", "杯子在这边。", "我买这个吧。"], "textbook"],
  ["How much is one?", "Сколько стоит одна штука?", "多少钱一个？", ["多少钱一个？", "你在哪儿？", "这件怎么样？", "你买什么？"], "textbook"],
  ["I want to buy two jin of apples.", "Я хочу купить два цзиня яблок.", "我想买两斤苹果。", ["我想买两斤苹果。", "我买一个杯子。", "我去商店买衣服。", "我在这儿学习。"], "textbook"],
  ["These are clothes for girls.", "Это одежда для девочек.", "这些是女孩子穿的衣服。", ["这些是女孩子穿的衣服。", "男孩子的衣服在那儿。", "这家商店衣服真多。", "小雪能穿。"], "textbook"],
  ["It looks good and is not expensive.", "Красиво, и недорого.", "好看，也不贵。", ["好看，也不贵。", "这个菜不好吃。", "我很喜欢。", "这儿的水果不少。"], "textbook"],
  ["I want to buy a cup for my younger sister.", "Я хочу купить чашку для младшей сестры.", "我想给妹妹买一个杯子。", ["我想给妹妹买一个杯子。", "我想买两斤苹果。", "杯子在这边。", "这些杯子很贵。"], "teaching_extension"],
  ["This store has a lot of fruit.", "В этом магазине много фруктов.", "这家商店水果很多。", ["这家商店水果很多。", "这儿的苹果真便宜。", "售货员在这边。", "那些衣服不贵。"], "teaching_extension"],
  ["The boys' clothes are over there.", "Одежда для мальчиков там.", "男孩子的衣服在那儿。", ["男孩子的衣服在那儿。", "女孩子穿这件衣服。", "这件衣服不贵。", "这家商店真大。"], "textbook"],
  ["These cups are not too expensive.", "Эти чашки не слишком дорогие.", "这些杯子不太贵。", ["这些杯子不太贵。", "这些杯子五块钱一个。", "那些衣服在那儿。", "这儿的水果不少。"], "teaching_extension"],
  ["What do you think of this piece of clothing?", "Как тебе эта одежда?", "这件衣服怎么样？", ["这件衣服怎么样？", "这个杯子多少钱？", "这个杯子在哪儿？", "这件衣服是谁的？"], "teaching_extension"]
].map((x, i) => choice(`trc_l10_${i + 1}`, "根据英文和俄文选择中文句子。", x[3], x[2], "译文选句", { type: "translation_choice", prompt_en: `${x[0]} / ${x[1]}`, data: { question_en: x[0], question_ru: x[1] }, sourceType: x[4] }));

const textQa = texts.map((t, i) => ({
  id: `ttq_l10_${i + 1}`,
  type: "text_qa_group",
  stage: "in_class",
  prompt_cn: "课文问答：根据课文内容回答。",
  prompt_en: "Text Q&A: answer from the dialogue.",
  data: {
    title: t.title,
    passage: t.lines.map((l) => l.hanzi).join(""),
    passage_pinyin: t.lines.map((l) => l.pinyin).join(" "),
    questions: i === 0 ? [
      { question_cn: "王一雪买什么？", question_pinyin: "Wáng Yīxuě mǎi shénme?", answer: "杯子", answer_pinyin: "bēizi", options: ["杯子", "苹果", "衣服", "水果"], correct_index: 0 },
      { question_cn: "杯子在哪儿？", question_pinyin: "Bēizi zài nǎr?", answer: "这边", answer_pinyin: "zhèbiān", options: ["这边", "那儿", "学校", "医院"], correct_index: 0 },
      { question_cn: "这些杯子多少钱一个？", question_pinyin: "Zhèxiē bēizi duōshao qián yí gè?", answer: "五块钱一个", answer_pinyin: "wǔ kuài qián yí gè", options: ["五块钱一个", "十块钱一个", "三块五一斤", "一百元一件"], correct_index: 0 }
    ] : i === 1 ? [
      { question_cn: "王一雪想买什么？", question_pinyin: "Wáng Yīxuě xiǎng mǎi shénme?", answer: "两斤苹果", answer_pinyin: "liǎng jīn píngguǒ", options: ["两斤苹果", "一个杯子", "一件衣服", "两个孩子"], correct_index: 0 },
      { question_cn: "苹果多少钱一斤？", question_pinyin: "Píngguǒ duōshao qián yì jīn?", answer: "三块五一斤", answer_pinyin: "sān kuài wǔ yì jīn", options: ["三块五一斤", "五块钱一个", "七块钱一个", "一百元一件"], correct_index: 0 },
      { question_cn: "这儿的苹果怎么样？", question_pinyin: "Zhèr de píngguǒ zěnmeyàng?", answer: "真便宜", answer_pinyin: "zhēn piányi", options: ["真便宜", "太贵了", "不好吃", "很少"], correct_index: 0 }
    ] : [
      { question_cn: "这件衣服多少钱？", question_pinyin: "Zhè jiàn yīfu duōshao qián?", answer: "一百元", answer_pinyin: "yìbǎi yuán", options: ["一百元", "十块钱", "五块钱", "七块钱"], correct_index: 0 },
      { question_cn: "刘明觉得这件衣服怎么样？", question_pinyin: "Liú Míng juéde zhè jiàn yīfu zěnmeyàng?", answer: "好看，也不贵", answer_pinyin: "hǎokàn, yě bú guì", options: ["好看，也不贵", "不好看，也很贵", "很少，也便宜", "很好吃，也不贵"], correct_index: 0 },
      { question_cn: "男孩子的衣服在哪儿？", question_pinyin: "Nán háizi de yīfu zài nǎr?", answer: "那儿", answer_pinyin: "nàr", options: ["那儿", "这边", "家里", "学校"], correct_index: 0 }
    ]
  },
  correct_answer: "见每题答案",
  sourceType: "textbook"
}));

const hanziWritingChars = Array.from(new Set("杯售货员这边钱些块那水果少斤苹果便宜商店衣服件元怎么样贵穿女男儿".split(""))).map((ch) => ({ char: ch, sourceType: "textbook" }));
const hanziRecognition = {
  enabled: true,
  showPinyin: false,
  rounds: [
    { id: "hanzi_to_pinyin", title: "看汉字选拼音", titleEn: "Choose pinyin" },
    { id: "hanzi_to_meaning", title: "看汉字选意思", titleEn: "Choose meaning" },
    { id: "meaning_to_hanzi", title: "看意思选汉字", titleEn: "Choose character" }
  ],
  groups: [
    { id: "money_goods", title: "商品与钱", vocabularyIds: ["杯子", "钱", "块", "元", "苹果", "衣服"].map((w) => idOf[w]) },
    { id: "shopping_place", title: "购物地点与人物", vocabularyIds: ["售货员", "这边", "这儿", "商店", "那儿", "那些"].map((w) => idOf[w]) },
    { id: "description", title: "评价与数量", vocabularyIds: ["水果", "少", "斤", "便宜", "贵", "怎么样"].map((w) => idOf[w]) }
  ]
};

const preClass = {
  warmup: {
    title: "买东西和问价格",
    prompt: "Think about shopping and prices.",
    intro: "这一课学完，你可以问商品价格，也可以说东西贵不贵、便宜不便宜。",
    question: "如果你想问价格，下面哪句话最合适？",
    questionEn: "Which sentence asks for the price?",
    options: [{ word: "多少钱一个？", pinyin: "Duōshao qián yí gè?" }, { word: "你在哪儿？", pinyin: "Nǐ zài nǎr?" }, { word: "现在几点？", pinyin: "Xiànzài jǐ diǎn?" }]
  },
  questions: [
    { id: "pre_l10_01", type: "choice", module: "词汇预热", question: "Which word means apple?", options: ["苹果", "杯子", "衣服", "钱"], answer: "苹果", sourceType: "teaching_extension" },
    { id: "pre_l10_02", type: "choice", module: "交际预热", question: "Which sentence asks 'How much is one?'", options: ["多少钱一个？", "这个怎么样？", "你买什么？", "杯子在这边。"], answer: "多少钱一个？", sourceType: "teaching_extension" },
    { id: "pre_l10_03", type: "choice", module: "语法预热", question: "Which sentence uses an adjective predicate?", options: ["这儿的苹果真便宜。", "我买这个吧。", "杯子在这边。", "我想买苹果。"], answer: "这儿的苹果真便宜。", sourceType: "teaching_extension" },
    { id: "pre_l10_04", type: "choice", module: "钱数预热", question: "What does 三块五 mean?", options: ["3.5 yuan", "5 yuan", "35 yuan", "three apples"], answer: "3.5 yuan", sourceType: "teaching_extension" },
    { id: "pre_l10_05", type: "choice", module: "词汇预热", question: "Which word means salesperson?", options: ["售货员", "商店", "水果", "衣服"], answer: "售货员", sourceType: "teaching_extension" },
    { id: "pre_l10_06", type: "choice", module: "量词预热", question: "Which measure word is used with 衣服 in this lesson?", options: ["件", "斤", "块", "个"], answer: "件", sourceType: "teaching_extension" },
    { id: "pre_l10_07", type: "choice", module: "句意理解", question: "Which Chinese sentence means 'These cups are five yuan each'?", options: ["这些五块钱一个。", "那些十块钱一个。", "这件一百元。", "苹果三块五一斤。"], answer: "这些五块钱一个。", sourceType: "teaching_extension" },
    { id: "pre_l10_08", type: "choice", module: "交际预热", question: "Which sentence asks for an opinion?", options: ["这件衣服怎么样？", "你买什么？", "你在哪儿？", "现在几点？"], answer: "这件衣服怎么样？", sourceType: "teaching_extension" },
    { id: "pre_l10_09", type: "subjective", module: "生活经验开放题", question: "教学扩展：你常买什么水果？请写一个中文短句。 / Teaching extension: What fruit do you often buy? Write one short Chinese sentence.", openEnded: true, prompt: "例如：我常买苹果。 / Example: 我常买苹果。", answerPlaceholder: "例如：我常买苹果。", sourceType: "teaching_extension" },
    { id: "pre_l10_10", type: "subjective", module: "购物表达开放题", question: "教学扩展：请用“多少钱”写一个问价句。 / Teaching extension: Use 多少钱 to write one price question.", openEnded: true, prompt: "例如：这个杯子多少钱？ / Example: 这个杯子多少钱？", answerPlaceholder: "例如：这个杯子多少钱？", sourceType: "teaching_extension" }
  ]
};

const postClassHomework = {
  mode: "required_optional",
  instructions: { required: "必选：完成汉字书写。", optional: "可选：选择一个输出任务完成。" },
  required: [
    { id: "post_l10_req_01", type: "handwriting", prompt_cn: "必选：书写本课汉字：杯、货、钱、些、块、水、果、少、斤、苹、便、宜、商、店、衣、服、件、元、贵、穿、女、男", characters: "杯货钱些块水果少斤苹便宜商店衣服件元贵穿女男".split(""), instructions: "每个字至少写 3 次。", sourceType: "textbook" }
  ],
  optional: [
    { id: "post_l10_opt_01", type: "writing", prompt_cn: "教学扩展：随机选择今天所学生词 3-5 个，写一段购物小短文。", instructions: "建议使用：买、多少钱、块、苹果、便宜、贵、衣服、怎么样。", openEnded: true, sourceType: "teaching_extension" },
    { id: "post_l10_opt_02", type: "oral_prepare", prompt_cn: "教学扩展：准备话题“买东西”。", instructions: "请准备一个 4-6 句对话：你想买什么？多少钱？贵不贵？你买不买？", sampleAnswer: "A：这个杯子多少钱？B：五块钱一个。A：不贵。我买这个吧。", openEnded: true, sourceType: "teaching_extension" },
    { id: "post_l10_opt_03", type: "reflection", prompt_cn: "教学扩展：今天哪一个钱数或购物句子最难？", instructions: "请写中文或英文反思。", openEnded: true, sourceType: "teaching_extension" }
  ]
};

const lesson = {
  schemaVersion: "1.0.0",
  meta: {
    level: "HSK1",
    lessonId: "L10",
    lessonKey: "HSK1-L10",
    title: "这儿的苹果真便宜！",
    titleEn: "The apples here are really affordable!",
    topic: "谈论商品价格、形容词谓语句、疑问代词“怎么样”、认识人民币",
    sourceTextPolicy: "保留教材原句；新增内容标记为教学扩展",
    dataQualityNotes: ["根据 textbook data/L10.txt 生成；L10 课文原句完整保留。", "图片资源暂未生成，图片猜词使用文字提示兜底。"]
  },
  features: { pinyin: true, hanziWritingDemo: true, vocabExamples: true, competition: true, postClassHomework: true },
  vocabulary: vocab,
  grammar,
  texts,
  vocabExtensions,
  grammarTeachingNotes,
  preClass,
  inClass: {
    questionGroups: {
      v1_image_guess: imageGuess,
      v5_vocab_fill: fillItems,
      v7_word_match: wordMatch,
      v8_memory_match: memoryMatch,
      v4_complete_sentence: sentenceTransform,
      g1_ordering: ordering,
      r3_translation_choice: translationChoice,
      r2_passage_choice: textQa
    }
  },
  classProQuestions: {
    pictureGuess: imageGuess,
    vocabFill: fillItems,
    wordMatch,
    matchingGame: memoryMatch,
    sentenceTransform,
    ordering,
    translationChoice,
    textQa
  },
  hanziWriting: { characters: hanziWritingChars },
  hanziRecognition,
  postClassHomework,
  report: { focus: ["购物问价", "钱数表达", "形容词谓语句", "怎么样"] }
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + "\n", "utf8");
console.log(`Wrote ${out}`);
