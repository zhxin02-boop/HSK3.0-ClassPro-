const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lessonDir = path.join(root, "source", "data-model", "lessons");

const PY = {
  "我":"wǒ","你":"nǐ","您":"nín","他":"tā","她":"tā","们":"men","我们":"wǒmen","你们":"nǐmen","他们":"tāmen",
  "的":"de","了":"le","吗":"ma","呢":"ne","吧":"ba","也":"yě","都":"dōu","不":"bù","没":"méi","没有":"méiyǒu",
  "是":"shì","在":"zài","有":"yǒu","和":"hé","跟":"gēn","给":"gěi","再":"zài","请":"qǐng","问":"wèn","可以":"kěyǐ",
  "什么":"shénme","谁":"shéi","哪儿":"nǎr","哪里":"nǎlǐ","哪个":"nǎge","哪些":"nǎxiē","几":"jǐ","多少":"duōshao","怎么样":"zěnmeyàng",
  "坐":"zuò","喝":"hē","吃":"chī","买":"mǎi","卖":"mài","要":"yào","叫":"jiào","看":"kàn","听":"tīng","听见":"tīngjiàn","说":"shuō","说话":"shuōhuà","写":"xiě","去":"qù","到":"dào","接":"jiē","住":"zhù","爱":"ài","喜欢":"xǐhuan","做":"zuò","上":"shàng","上学":"shàngxué","开":"kāi","睡觉":"shuìjiào",
  "问题":"wèntí","打电话":"dǎ diànhuà","一下":"yíxià","服务员":"fúwùyuán","女士":"nǚshì","先生":"xiānsheng","杯":"bēi","杯子":"bēizi","茶":"chá","早饭":"zǎofàn","面包":"miànbāo","鸡蛋":"jīdàn","一半":"yíbàn","半":"bàn","这个":"zhège","这":"zhè","这儿":"zhèr","这边":"zhèbiān","那":"nà","那儿":"nàr","那边":"nàbiān","小店":"xiǎodiàn","饭店":"fàndiàn","老师":"lǎoshī","学生":"xuésheng","朋友":"péngyou","手机":"shǒujī","钱":"qián","块":"kuài","斤":"jīn","本":"běn","件":"jiàn","饺子":"jiǎozi","牛奶":"niúnǎi","桌子":"zhuōzi","热":"rè","好吃":"hǎochī","贵":"guì","忙":"máng",
  "火车":"huǒchē","中午":"zhōngwǔ","有些":"yǒuxiē","有的":"yǒude","字":"zì","明年":"míngnián","中学":"zhōngxué","小学":"xiǎoxué","中学生":"zhōngxuésheng","小学生":"xiǎoxuéshēng","汉语":"Hànyǔ","汉字":"Hànzì","女儿":"nǚ'ér","儿子":"érzi","孩子":"háizi","电影":"diànyǐng","书":"shū","现在":"xiànzài","时候":"shíhou","晚上":"wǎnshang","晚":"wǎn","大家":"dàjiā","一点儿":"yìdiǎnr","会":"huì","能":"néng","看见":"kànjiàn","听不见":"tīng bú jiàn","安静":"ānjìng",
  "去年":"qùnián","男朋友":"nánpéngyou","年":"nián","今年":"jīnnián","好玩儿":"hǎowánr","飞机":"fēijī","小时":"xiǎoshí","家人":"jiārén","时间":"shíjiān","机场":"jīchǎng","早":"zǎo","早上":"zǎoshang","西安":"Xī'ān","北京":"Běijīng","大兴机场":"Dàxīng Jīchǎng","菜":"cài","中国菜":"Zhōngguó cài","漂亮":"piàoliang","久":"jiǔ","多久":"duō jiǔ","九":"jiǔ","八点":"bā diǎn","分钟":"fēnzhōng","旅行":"lǚxíng","家":"jiā","家里":"jiālǐ","姐姐":"jiějie","哥哥":"gēge","起飞":"qǐfēi","走":"zǒu","地方":"dìfang"
};

Object.assign(PY, {
  "已经":"yǐjīng","还":"hái","十":"shí","以后":"yǐhòu","以前":"yǐqián","学校":"xuéxiào","课":"kè","上课":"shàngkè","下课":"xiàkè",
  "这些":"zhèxiē","左边":"zuǒbiān","右边":"yòubiān","前面":"qiánmiàn","后面":"hòumiàn","后面的":"hòumian de","后天":"hòutiān","明天":"míngtiān","今天":"jīntiān","下午":"xiàwǔ","每天":"měitiān","时候":"shíhou",
  "一点儿":"yìdiǎnr","点儿":"diǎnr","非常":"fēicháng","很":"hěn","但是":"dànshì","短":"duǎn","长":"cháng","慢":"màn","小":"xiǎo","大":"dà","太":"tài","错":"cuò","写错":"xiě cuò","写对":"xiě duì","对":"duì",
  "城市":"chéngshì","中国":"Zhōngguó","夏天":"xiàtiān","来":"lái","来了":"lái le","飞":"fēi","坐飞机":"zuò fēijī","飞机票":"fēijī piào","大连":"Dàlián","从":"cóng","大约":"dàyuē","一个多小时":"yí gè duō xiǎoshí","多":"duō","约":"yuē",
  "一起":"yìqǐ","父母":"fùmǔ","不在":"bú zài","先":"xiān","然后":"ránhòu","马上":"mǎshàng","饭店":"fàndiàn","市区":"shìqū","地铁":"dìtiě","坐车":"zuò chē","开车":"kāi chē","远":"yuǎn","近":"jìn","离":"lí","客人":"kèrén","接客人":"jiē kèrén","接人":"jiē rén",
  "不太":"bú tài","累":"lèi","不错":"búcuò","最":"zuì","最好玩儿":"zuì hǎowánr","有点儿":"yǒudiǎnr","回家":"huí jiā","后天":"hòutiān","住宿":"zhùsù",
  "一":"yī","二":"èr","两":"liǎng","三":"sān","四":"sì","五":"wǔ","六":"liù","七":"qī","八":"bā","九":"jiǔ","十个":"shí gè","几个":"jǐ gè","一个":"yí gè","两个":"liǎng gè","个人":"gè rén","个":"gè",
  "把":"bǎ","名字":"míngzi","自己的":"zìjǐ de","自己":"zìjǐ","认识":"rènshi","教室":"jiàoshì","宿舍":"sùshè","小声":"xiǎoshēng","声音":"shēngyīn","安静":"ānjìng","前面的":"qiánmian de"
});

function pinyin(text) {
  let s = String(text || "");
  Object.keys(PY).sort((a, b) => b.length - a.length).forEach((k) => {
    s = s.split(k).join(` ${PY[k]} `);
  });
  return s
    .replace(/___/g, "")
    .replace(/[，。！？、；：“”《》（）,.!?;:()]/g, " ")
    .replace(/[\u4e00-\u9fff]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function optPy(options) {
  return options.map(pinyin);
}

function qid(lesson, prefix, i) {
  return `${prefix}_l${lesson}_${String(i + 1).padStart(2, "0")}`;
}

function setExtensions(d, rows) {
  const byWord = Object.fromEntries(d.vocabulary.map((v) => [v.word, v]));
  Object.keys(rows).forEach((word) => {
    const v = byWord[word];
    if (!v) return;
    const examples = rows[word].map(([hanzi, py, english]) => ({
      hanzi,
      pinyin: py || pinyin(hanzi),
      english,
      sourceType: "teaching_extension"
    }));
    d.vocabExtensions[v.id] = { word, examples, collocations: examples };
  });
}

function wordMatch(lesson, groups) {
  return groups.map((pairs, i) => ({
    id: qid(lesson, "v7", i),
    type: "word_match",
    stage: "in_class",
    prompt_cn: "词句匹配。",
    prompt_en: "Match each question with the best answer.",
    data: {
      pairs: pairs.map(([left, right]) => ({
        left,
        left_pinyin: pinyin(left),
        right,
        right_pinyin: pinyin(right)
      })),
      order: [2, 0, 3, 1]
    },
    correct_answer: "全部配对正确",
    sourceType: "teaching_extension"
  }));
}

function transform(lesson, rows) {
  return rows.map(([source, options, answer], i) => ({
    id: qid(lesson, "v4", i),
    type: "sentence_transform",
    stage: "in_class",
    prompt_cn: "根据答句，选择最合适的问题。",
    prompt_en: "Choose the question that best matches the answer.",
    data: {
      source_sentence: source,
      source_pinyin: pinyin(source),
      options,
      options_pinyin: optPy(options),
      correct_index: options.indexOf(answer)
    },
    correct_answer: answer,
    kp: "句子转换：答句选问句",
    sourceType: "teaching_extension"
  }));
}

function syncClassPro(d) {
  const q = d.inClass.questionGroups;
  d.classProQuestions.pictureGuess = q.v1_image_guess;
  d.classProQuestions.vocabFill = q.v5_vocab_fill;
  d.classProQuestions.wordMatch = q.v7_word_match;
  d.classProQuestions.matchingGame = q.v8_memory_match;
  d.classProQuestions.sentenceTransform = q.v4_complete_sentence;
  d.classProQuestions.translationChoice = q.r3_translation_choice;
  d.classProQuestions.pictureTalk = q.r4_picture_talk;
}

function cleanPinyinFields(x, inPinyin) {
  if (typeof x === "string") return inPinyin && /[\u4e00-\u9fff]/.test(x) ? pinyin(x) : x;
  if (Array.isArray(x)) {
    for (let i = 0; i < x.length; i++) x[i] = cleanPinyinFields(x[i], inPinyin);
    return x;
  }
  if (!x || typeof x !== "object") return x;
  Object.keys(x).forEach((k) => {
    const v = x[k];
    if (typeof v === "string" && /pinyin/i.test(k) && /[\u4e00-\u9fff]/.test(v)) {
      x[k] = pinyin(v);
    } else {
      const cleaned = cleanPinyinFields(v, inPinyin || /pinyin/i.test(k));
      if (cleaned !== undefined) x[k] = cleaned;
    }
  });
  return x;
}

function saveLesson(key, fn) {
  const file = path.join(lessonDir, `${key}.json`);
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  fn(d, d.inClass.questionGroups);
  cleanPinyinFields(d);
  syncClassPro(d);
  fs.writeFileSync(file, JSON.stringify(d, null, 2) + "\n", "utf8");
}

const ext14 = {
  "上": [["上火车", "shàng huǒchē", "get on the train"], ["上中学", "shàng zhōngxué", "start middle school"], ["明年她要上中学。", "Míngnián tā yào shàng zhōngxué.", "She will start middle school next year."]],
  "火车": [["坐火车", "zuò huǒchē", "take a train"], ["火车开了", "huǒchē kāi le", "the train has departed"], ["中午的火车已经开了。", "Zhōngwǔ de huǒchē yǐjīng kāi le.", "The noon train has already departed."]],
  "中午": [["中午吃饭", "zhōngwǔ chī fàn", "eat at noon"], ["中午休息", "zhōngwǔ xiūxi", "rest at noon"], ["中午我在学校吃饭。", "Zhōngwǔ wǒ zài xuéxiào chī fàn.", "At noon I eat at school."]],
  "开": [["开车", "kāi chē", "drive"], ["开门", "kāi mén", "open the door"], ["火车十点开。", "Huǒchē shí diǎn kāi.", "The train leaves at ten."]],
  "有些": [["有些学生", "yǒuxiē xuésheng", "some students"], ["有些汉字", "yǒuxiē Hànzì", "some Chinese characters"], ["有些学生会写这些字。", "Yǒuxiē xuésheng huì xiě zhèxiē zì.", "Some students can write these characters."]],
  "有的": [["有的人", "yǒude rén", "some people"], ["有的学生", "yǒude xuésheng", "some students"], ["有的学生看书，有的学生写字。", "Yǒude xuésheng kàn shū, yǒude xuésheng xiě zì.", "Some students read, and some write characters."]],
  "了": [["看了电影", "kàn le diànyǐng", "watched a movie"], ["写了汉字", "xiě le Hànzì", "wrote Chinese characters"], ["我昨天写了十个汉字。", "Wǒ zuótiān xiě le shí gè Hànzì.", "Yesterday I wrote ten Chinese characters."]],
  "写": [["写汉字", "xiě Hànzì", "write Chinese characters"], ["写名字", "xiě míngzi", "write a name"], ["请把你的名字写在这儿。", "Qǐng bǎ nǐ de míngzi xiě zài zhèr.", "Please write your name here."]],
  "都": [["都可以", "dōu kěyǐ", "both/all are fine"], ["都听见了", "dōu tīngjiàn le", "all heard it"], ["这些字我们都认识。", "Zhèxiē zì wǒmen dōu rènshi.", "We know all these characters."]],
  "听见": [["听见老师说话", "tīngjiàn lǎoshī shuōhuà", "hear the teacher speak"], ["没听见问题", "méi tīngjiàn wèntí", "did not hear the question"], ["后面的学生没听见。", "Hòumian de xuésheng méi tīngjiàn.", "The students in the back did not hear it."]],
  "不要": [["不要说话", "búyào shuōhuà", "do not talk"], ["不要写错", "búyào xiě cuò", "do not write it wrong"], ["上课的时候不要说话。", "Shàngkè de shíhou búyào shuōhuà.", "Do not talk during class."]],
  "说话": [["小声说话", "xiǎoshēng shuōhuà", "speak quietly"], ["不要说话", "búyào shuōhuà", "do not talk"], ["他们在教室里说话。", "Tāmen zài jiàoshì lǐ shuōhuà.", "They are talking in the classroom."]],
  "听": [["听老师", "tīng lǎoshī", "listen to the teacher"], ["听汉语", "tīng Hànyǔ", "listen to Chinese"], ["请听老师的问题。", "Qǐng tīng lǎoshī de wèntí.", "Please listen to the teacher's question."]],
  "哪些": [["哪些字", "nǎxiē zì", "which characters"], ["哪些学生", "nǎxiē xuésheng", "which students"], ["你会写哪些汉字？", "Nǐ huì xiě nǎxiē Hànzì?", "Which Chinese characters can you write?"]],
  "字": [["一个字", "yí gè zì", "one character"], ["写字", "xiě zì", "write characters"], ["这个字不太好写。", "Zhège zì bú tài hǎo xiě.", "This character is not very easy to write."]],
  "明年": [["明年上学", "míngnián shàngxué", "start school next year"], ["明年去中国", "míngnián qù Zhōngguó", "go to China next year"], ["明年我想学汉语。", "Míngnián wǒ xiǎng xué Hànyǔ.", "Next year I want to study Chinese."]],
  "中学": [["上中学", "shàng zhōngxué", "go to middle school"], ["中学老师", "zhōngxué lǎoshī", "middle school teacher"], ["我妹妹明年上中学。", "Wǒ mèimei míngnián shàng zhōngxué.", "My younger sister will start middle school next year."]],
  "小学": [["上小学", "shàng xiǎoxué", "go to primary school"], ["小学老师", "xiǎoxué lǎoshī", "primary school teacher"], ["他儿子今年上小学。", "Tā érzi jīnnián shàng xiǎoxué.", "His son starts primary school this year."]],
  "中学生": [["一个中学生", "yí gè zhōngxuésheng", "a middle school student"], ["中学生宿舍", "zhōngxuésheng sùshè", "middle school student dormitory"], ["这些中学生都会说一点儿汉语。", "Zhèxiē zhōngxuésheng dōu huì shuō yìdiǎnr Hànyǔ.", "These middle school students can all speak a little Chinese."]],
  "小学生": [["小学生写字", "xiǎoxuéshēng xiě zì", "a primary school student writes"], ["两个小学生", "liǎng gè xiǎoxuéshēng", "two primary school students"], ["小学生在教室里写汉字。", "Xiǎoxuéshēng zài jiàoshì lǐ xiě Hànzì.", "The primary school students are writing Chinese characters in the classroom."]],
  "上学": [["去上学", "qù shàngxué", "go to school"], ["上学时间", "shàngxué shíjiān", "school time"], ["孩子们早上八点上学。", "Háizimen zǎoshang bā diǎn shàngxué.", "The children go to school at eight in the morning."]],
  "他们": [["他们都来了", "tāmen dōu lái le", "they all came"], ["他们在说话", "tāmen zài shuōhuà", "they are talking"], ["他们有的看书，有的写字。", "Tāmen yǒude kàn shū, yǒude xiě zì.", "Some of them read, and some write."]],
  "晚": [["有点儿晚", "yǒudiǎnr wǎn", "a bit late"], ["太晚了", "tài wǎn le", "too late"], ["现在走有点儿晚。", "Xiànzài zǒu yǒudiǎnr wǎn.", "Leaving now is a bit late."]],
  "汉语": [["说汉语", "shuō Hànyǔ", "speak Chinese"], ["听汉语", "tīng Hànyǔ", "listen to Chinese"], ["我每天听十分钟汉语。", "Wǒ měitiān tīng shí fēnzhōng Hànyǔ.", "I listen to Chinese for ten minutes every day."]],
  "汉字": [["写汉字", "xiě Hànzì", "write Chinese characters"], ["认识汉字", "rènshi Hànzì", "recognize Chinese characters"], ["这些汉字你都认识吗？", "Zhèxiē Hànzì nǐ dōu rènshi ma?", "Do you know all these Chinese characters?"]]
};

const ext15 = {
  "爱": [["爱吃中国菜", "ài chī Zhōngguó cài", "love eating Chinese food"], ["爱坐飞机", "ài zuò fēijī", "like taking planes"], ["我爱吃这个菜，也爱喝茶。", "Wǒ ài chī zhège cài, yě ài hē chá.", "I love this dish and also love drinking tea."]],
  "哪个": [["哪个菜", "nǎge cài", "which dish"], ["哪个机场", "nǎge jīchǎng", "which airport"], ["你想去哪个城市？", "Nǐ xiǎng qù nǎge chéngshì?", "Which city do you want to go to?"]],
  "去年": [["去年夏天", "qùnián xiàtiān", "last summer"], ["去年去西安", "qùnián qù Xī'ān", "went to Xi'an last year"], ["去年我跟朋友去了西安。", "Qùnián wǒ gēn péngyou qù le Xī'ān.", "Last year I went to Xi'an with a friend."]],
  "男朋友": [["我的男朋友", "wǒ de nánpéngyou", "my boyfriend"], ["男朋友的家人", "nánpéngyou de jiārén", "boyfriend's family"], ["她男朋友明年要来北京。", "Tā nánpéngyou míngnián yào lái Běijīng.", "Her boyfriend will come to Beijing next year."]],
  "几": [["几个人", "jǐ gè rén", "how many people"], ["几小时", "jǐ xiǎoshí", "how many hours"], ["飞机要飞几个小时？", "Fēijī yào fēi jǐ gè xiǎoshí?", "How many hours will the plane fly?"]],
  "年": [["今年", "jīnnián", "this year"], ["明年", "míngnián", "next year"], ["我在中国住了一年。", "Wǒ zài Zhōngguó zhù le yì nián.", "I lived in China for one year."]],
  "好玩儿": [["很好玩儿", "hěn hǎowánr", "very fun"], ["西安好玩儿", "Xī'ān hǎowánr", "Xi'an is fun"], ["这个地方好玩儿，也很漂亮。", "Zhège dìfang hǎowánr, yě hěn piàoliang.", "This place is fun and also beautiful."]],
  "飞机": [["坐飞机", "zuò fēijī", "take a plane"], ["飞机票", "fēijī piào", "plane ticket"], ["我们明天坐飞机去北京。", "Wǒmen míngtiān zuò fēijī qù Běijīng.", "Tomorrow we will fly to Beijing."]],
  "要": [["要九个小时", "yào jiǔ gè xiǎoshí", "take nine hours"], ["要去机场", "yào qù jīchǎng", "need to go to the airport"], ["从这儿到机场要一个小时。", "Cóng zhèr dào jīchǎng yào yí gè xiǎoshí.", "It takes one hour from here to the airport."]],
  "小时": [["一个小时", "yí gè xiǎoshí", "one hour"], ["九个小时", "jiǔ gè xiǎoshí", "nine hours"], ["到北京要几个小时？", "Dào Běijīng yào jǐ gè xiǎoshí?", "How many hours does it take to get to Beijing?"]],
  "家人": [["我的家人", "wǒ de jiārén", "my family"], ["家人在北京", "jiārén zài Běijīng", "family are in Beijing"], ["她的家人都住在北京。", "Tā de jiārén dōu zhù zài Běijīng.", "Her family all live in Beijing."]],
  "时间": [["有时间", "yǒu shíjiān", "have time"], ["没有时间", "méiyǒu shíjiān", "have no time"], ["你今天下午有时间吗？", "Nǐ jīntiān xiàwǔ yǒu shíjiān ma?", "Do you have time this afternoon?"]],
  "机场": [["去机场", "qù jīchǎng", "go to the airport"], ["在机场见", "zài jīchǎng jiàn", "meet at the airport"], ["我们早上八点在机场见。", "Wǒmen zǎoshang bā diǎn zài jīchǎng jiàn.", "We will meet at the airport at eight in the morning."]],
  "接": [["接朋友", "jiē péngyou", "pick up a friend"], ["去机场接人", "qù jīchǎng jiē rén", "go to the airport to pick someone up"], ["我姐姐会去机场接你。", "Wǒ jiějie huì qù jīchǎng jiē nǐ.", "My older sister will pick you up at the airport."]],
  "住": [["住在北京", "zhù zài Běijīng", "live in Beijing"], ["住我家", "zhù wǒ jiā", "stay at my home"], ["你们可以住在我家。", "Nǐmen kěyǐ zhù zài wǒ jiā.", "You can stay at my home."]],
  "早": [["早上八点", "zǎoshang bā diǎn", "eight in the morning"], ["来得太早", "lái de tài zǎo", "come too early"], ["现在走不早了。", "Xiànzài zǒu bù zǎo le.", "Leaving now is not early anymore."]],
  "那": [["那我们走吧", "nà wǒmen zǒu ba", "then let's go"], ["那就在机场见", "nà jiù zài jīchǎng jiàn", "then let's meet at the airport"], ["那我们明天早上见。", "Nà wǒmen míngtiān zǎoshang jiàn.", "Then we will meet tomorrow morning."]],
  "西安": [["去西安", "qù Xī'ān", "go to Xi'an"], ["西安很漂亮", "Xī'ān hěn piàoliang", "Xi'an is beautiful"], ["去年我去了西安，那里很好玩儿。", "Qùnián wǒ qù le Xī'ān, nàlǐ hěn hǎowánr.", "Last year I went to Xi'an; it was very fun there."]],
  "北京": [["去北京", "qù Běijīng", "go to Beijing"], ["北京机场", "Běijīng jīchǎng", "Beijing airport"], ["我家人都在北京。", "Wǒ jiārén dōu zài Běijīng.", "My family are all in Beijing."]],
  "大兴机场": [["到大兴机场", "dào Dàxīng Jīchǎng", "arrive at Daxing Airport"], ["在大兴机场见", "zài Dàxīng Jīchǎng jiàn", "meet at Daxing Airport"], ["飞机早上到大兴机场。", "Fēijī zǎoshang dào Dàxīng Jīchǎng.", "The plane arrives at Daxing Airport in the morning."]]
};

const wm14 = [
  [["火车已经开了吗？", "还没有，十分钟以后开。"], ["中午以后你去哪儿？", "我去学校听汉语课。"], ["这些学生都会写汉字吗？", "不都会，有些还不会写。"], ["上课的时候可以说话吗？", "不要说话，请听老师。"]],
  [["谁听见老师的问题了？", "前面的学生都听见了。"], ["你写了哪些字？", "我写了人、口和大。"], ["明年你妹妹上什么学校？", "她明年上中学。"], ["他们在教室里做什么？", "有的看书，有的写字。"]],
  [["现在走会不会太晚？", "不晚，火车还没开。"], ["小学生能写这些汉字吗？", "能写几个，不是都会写。"], ["老师说话你听见了吗？", "听见了，但是后面有点儿小。"], ["明年谁上小学？", "我弟弟明年上小学。"]],
  [["你们都学汉语吗？", "我们都学，但是有的人学得慢。"], ["哪些人不要说话？", "后面说话的学生不要说话。"], ["火车开了以后还能上车吗？", "不能上车了。"], ["你中午有时间吗？", "有，我中午可以帮你写字。"]],
  [["他们为什么不上学？", "今天太晚了，明天再去。"], ["你能听懂这些汉语吗？", "有些能听懂，有些听不懂。"], ["中学生在写什么？", "他们在写自己的名字。"], ["这个字你写对了吗？", "没有，我写错了一个。"]]
];

const tr14 = [
  ["还没开，十分钟以后开。", ["火车已经开了吗？", "你明年上中学吗？", "谁听见老师说话？", "哪些字你会写？"], "火车已经开了吗？"],
  ["不都会，有些学生还不会写。", ["这些学生都会写汉字吗？", "你会说汉语吗？", "你听见了吗？", "你写了几个字？"], "这些学生都会写汉字吗？"],
  ["请听老师，不要说话。", ["上课的时候可以说话吗？", "火车中午开吗？", "谁上小学？", "你几点去学校？"], "上课的时候可以说话吗？"],
  ["我写了人、口和大。", ["你写了哪些字？", "你听见什么了？", "他们都在做什么？", "你中午去哪儿？"], "你写了哪些字？"],
  ["她明年上中学。", ["你妹妹明年上什么学校？", "你妹妹会写字吗？", "你妹妹听见了吗？", "你妹妹现在在哪儿？"], "你妹妹明年上什么学校？"],
  ["有的看书，有的写字。", ["他们在教室里做什么？", "他们什么时候上学？", "他们会写哪些字？", "他们听见了吗？"], "他们在教室里做什么？"],
  ["不晚，火车还没开。", ["现在走会不会太晚？", "火车为什么开了？", "你中午听课吗？", "谁不要说话？"], "现在走会不会太晚？"],
  ["听见了，但是后面有点儿小。", ["老师说话你听见了吗？", "你会不会写这个字？", "哪些学生上中学？", "他们都来了没有？"], "老师说话你听见了吗？"],
  ["有些能听懂，有些听不懂。", ["你能听懂这些汉语吗？", "你能写这些汉字吗？", "谁在说话？", "现在晚不晚？"], "你能听懂这些汉语吗？"],
  ["没有，我写错了一个。", ["这个字你写对了吗？", "你看电影了吗？", "你中午上车了吗？", "你们都学汉语吗？"], "这个字你写对了吗？"]
];

const wm15 = [
  [["你爱吃哪个中国菜？", "我爱吃这个，也爱吃那个。"], ["这些菜都好吃吗？", "不都好吃，左边这个有点儿贵。"], ["去年你跟谁去了西安？", "我跟男朋友一起去了。"], ["西安好玩儿吗？", "很好玩儿，但是旅行时间有点儿短。"]],
  [["从大连到北京要多久？", "坐飞机大约要一个多小时。"], ["你家人在北京吗？", "我姐姐在北京，父母不在。"], ["明天你有时间去机场吗？", "有时间，我可以去接你。"], ["你们晚上住哪儿？", "先住朋友家，后天住饭店。"]],
  [["你们在哪个机场见？", "我们在大兴机场见。"], ["飞机几点到北京？", "早上八点到，但是可能会晚。"], ["那我们怎么去市区？", "先坐车，再坐地铁。"], ["你想在北京住几年？", "我想住一年，然后回家。"]],
  [["谁去机场接客人？", "王老师的姐姐去接客人。"], ["你去年去哪儿旅行了？", "去了西安，也去了北京。"], ["这些家人都住一起吗？", "不住一起，有的住北京，有的住西安。"], ["今天早上走早不早？", "不早，去机场要一个小时。"]],
  [["你爱坐飞机吗？", "不太爱，坐久了有点儿累。"], ["哪个地方最好玩儿？", "西安最好玩儿，北京也不错。"], ["你还有时间看书吗？", "没有时间，马上要去机场。"], ["大兴机场离你家远吗？", "有点儿远，开车要一个多小时。"]]
];

const tr15 = [
  ["我爱吃这个，也爱吃那个。", ["你爱吃哪个中国菜？", "你去年去哪儿？", "你几点到机场？", "谁去接你？"], "你爱吃哪个中国菜？"],
  ["不都好吃，左边这个有点儿贵。", ["这些菜都好吃吗？", "哪个机场更近？", "你有时间吗？", "你住哪儿？"], "这些菜都好吃吗？"],
  ["我跟男朋友一起去了。", ["去年你跟谁去了西安？", "你男朋友住北京吗？", "谁接你们？", "你们几点走？"], "去年你跟谁去了西安？"],
  ["很好玩儿，但是旅行时间有点儿短。", ["西安好玩儿吗？", "北京机场大不大？", "你爱吃中国菜吗？", "你家人在哪儿？"], "西安好玩儿吗？"],
  ["坐飞机大约要一个多小时。", ["从大连到北京要多久？", "飞机几点起飞？", "你要去哪儿？", "你住几年？"], "从大连到北京要多久？"],
  ["有时间，我可以去接你。", ["明天你有时间去机场吗？", "你爱坐飞机吗？", "哪个地方好玩儿？", "你家人去机场吗？"], "明天你有时间去机场吗？"],
  ["我们在大兴机场见。", ["你们在哪个机场见？", "你们住在哪儿？", "你们去年去哪儿？", "你们爱吃什么？"], "你们在哪个机场见？"],
  ["早上八点到，但是可能会晚。", ["飞机几点到北京？", "你几年去北京？", "你喜欢哪个菜？", "你家人都来吗？"], "飞机几点到北京？"],
  ["先住朋友家，后天住饭店。", ["你们晚上住哪儿？", "谁接你们？", "那我们怎么走？", "大兴机场远吗？"], "你们晚上住哪儿？"],
  ["没有时间，马上要去机场。", ["你还有时间看书吗？", "你要坐飞机吗？", "你去过西安吗？", "哪个菜好吃？"], "你还有时间看书吗？"]
];

saveLesson("HSK1-L14", (d, q) => {
  setExtensions(d, ext14);
  q.v7_word_match = wordMatch("14", wm14);
  q.v4_complete_sentence = transform("14", tr14);
});

saveLesson("HSK1-L15", (d, q) => {
  setExtensions(d, ext15);
  q.v7_word_match = wordMatch("15", wm15);
  q.v4_complete_sentence = transform("15", tr15);
});

saveLesson("HSK1-L13", () => {});

console.log("Applied L13-L15 quality pass 2.");
