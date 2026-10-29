const fs = require('fs');
const path = require('path');

const lessonKey = 'HSK3-L14';
const sourceRef = 'textbook data/HSK3/L14.txt';
const root = path.join(__dirname, '..');
const out = path.join(root, 'source', 'data-model', 'lessons', `${lessonKey}.json`);
const sourceText = fs.readFileSync(path.join(root, sourceRef), 'utf8');
const img = name => `images/hsk3-l14/${name}.png`;
const example = (hanzi, pinyin, english, sourceType = 'teaching_extension') => ({
  hanzi, pinyin, english, sourceType,
  hanziSourceType:sourceType,
  pinyinSourceType:sourceType === 'textbook' ? 'teaching_extension' : sourceType,
  englishSourceType:sourceType === 'textbook' ? 'teaching_extension' : sourceType
});
const sourceTypeFor = hanzi => sourceText.includes(hanzi) ? 'textbook' : 'teaching_extension';

const vocabRows = [
  ['词典','cídiǎn','名词','dictionary','A','expression',['一本词典','查词典'],'这本词典最好今天还。','Zhè běn cídiǎn zuìhǎo jīntiān huán.','解释词语意思和用法的书或电子工具'],
  ['最好','zuìhǎo','副词','had better','A','expression',['最好今天还','最好先问一下'],'这本词典最好今天还。','Zhè běn cídiǎn zuìhǎo jīntiān huán.','最合适的选择是'],
  ['节','jié','量词','(used to count class periods or sections of lessons)','A','context',['两节课','第一节课'],'下午我只有两节课。','Xiàwǔ wǒ zhǐ yǒu liǎng jié kè.','用来数课的量词'],
  ['图书馆','túshūguǎn','名词','library','A','expression',['去图书馆','图书馆借书'],'我去了好几次图书馆。','Wǒ qùle hǎo jǐ cì túshūguǎn.','借书、还书和看书的地方'],
  ['被','bèi','介词','(used to indicate the passive voice) by','A','expression',['被别人借走','被叫错名字'],'这本书被别人借走了。','Zhè běn shū bèi biérén jièzǒu le.','说明主语受到了某个动作的影响'],
  ['名人','míngrén','名词','celebrity','A','understanding',['名人的故事','一位名人'],'我想借《名人的故事》。','Wǒ xiǎng jiè “Míngrén de Gùshi”.','很多人知道的人'],
  ['故事','gùshi','名词','story','A','understanding',['一个故事','讲故事'],'这本书里有很多名人的故事。','Zhè běn shū li yǒu hěn duō míngrén de gùshi.','讲人或事情的一段内容'],
  ['然后','ránhòu','连词','then','B','expression',['然后去游泳','然后再回来'],'我要先去图书馆借书，然后去游泳。','Wǒ yào xiān qù túshūguǎn jiè shū, ránhòu qù yóuyǒng.','做完前一件事以后'],
  ['报纸','bàozhǐ','名词','newspaper','B','understanding',['中文报纸','看报纸'],'我想去图书馆看看中文报纸。','Wǒ xiǎng qù túshūguǎn kànkan Zhōngwén bàozhǐ.','报道新闻的纸质读物'],
  ['忘记','wàngjì','动词','forget','B','expression',['忘记带卡','忘记时间'],'我忘记校园卡放在哪儿了。','Wǒ wàngjì xiàoyuánkǎ fàng zài nǎr le.','没有记住或想不起来'],
  ['电子书','diànzǐshū','名词','e-book','B','expression',['一本电子书','看电子书'],'上网看看有没有电子书。','Shàngwǎng kànkan yǒu méiyǒu diànzǐshū.','在手机、电脑等设备上看的书'],
  ['女生','nǚshēng','名词','girl student','C','context',['几个女生','一位女生'],'我和几个女生要表演一个节目。','Wǒ hé jǐ gè nǚshēng yào biǎoyǎn yí gè jiémù.','女学生'],
  ['表演','biǎoyǎn','动词','perform','C','expression',['表演节目','一起表演'],'下周我们要在学校表演。','Xià zhōu wǒmen yào zài xuéxiào biǎoyǎn.','在别人面前唱、跳或演'],
  ['节目','jiémù','名词','program','C','expression',['表演节目','最喜欢的节目'],'每个班级的同学都表演节目了。','Měi gè bānjí de tóngxué dōu biǎoyǎn jiémù le.','晚会或演出中的一项内容'],
  ['怎么办','zěnme bàn','短语','what to do','C','expression',['不知道怎么办','现在怎么办'],'我还没找到人一起表演，不知道怎么办。','Wǒ hái méi zhǎodào rén yìqǐ biǎoyǎn, bù zhīdào zěnme bàn.','询问怎样解决问题'],
  ['校长','xiàozhǎng','名词','principal','C','context',['学校校长','校长面前'],'校长和老师也来看表演。','Xiàozhǎng hé lǎoshī yě lái kàn biǎoyǎn.','管理学校的负责人'],
  ['面前','miànqián','名词','presence','C','understanding',['大家面前','校长面前'],'他要在很多同学面前表演。','Tā yào zài hěn duō tóngxué miànqián biǎoyǎn.','人或东西前面的地方'],
  ['有些','yǒuxiē','副词','somewhat; rather','C','understanding',['有些紧张','有些担心'],'一想到表演，他就有些紧张。','Yì xiǎngdào biǎoyǎn, tā jiù yǒuxiē jǐnzhāng.','有一点儿'],
  ['相信','xiāngxìn','动词','believe','C','expression',['相信自己','相信朋友'],'你要相信自己。','Nǐ yào xiāngxìn zìjǐ.','觉得某人或某事可靠、真实'],
  ['新年','xīnnián','名词','New Year','C','expression',['新年晚会','新年快乐'],'昨天是学校的新年晚会。','Zuótiān shì xuéxiào de xīnnián wǎnhuì.','新的一年开始的时候'],
  ['班级','bānjí','名词','classes and grades (in school)','C','context',['每个班级','班级节目'],'每个班级都准备了节目。','Měi gè bānjí dōu zhǔnbèi le jiémù.','学校里一起上课的一组学生'],
  ['跳','tiào','动词','jump','C','understanding',['跳舞','又唱又跳'],'大家一块儿又唱又跳。','Dàjiā yíkuàir yòu chàng yòu tiào.','身体离开地面；本课也用于“跳舞”'],
  ['留学生','liúxuéshēng','名词','international student; overseas student','C','context',['几位留学生','留学生节目'],'我最喜欢留学生们跳舞。','Wǒ zuì xǐhuan liúxuéshēngmen tiàowǔ.','在外国学习的学生'],
  ['最后','zuìhòu','名词','the last; in the end','C','expression',['最后一个节目','最后大家跳舞'],'最后老师和校长也被叫起来跳舞。','Zuìhòu lǎoshī hé xiàozhǎng yě bèi jiào qǐlai tiàowǔ.','所有事情的末尾或结束时'],
  ['一块儿','yíkuàir','副词/名词','together; the same place','C','expression',['一块儿跳','一块儿表演'],'老师和校长一块儿跳舞。','Lǎoshī hé xiàozhǎng yíkuàir tiàowǔ.','一起'],
  ['网站','wǎngzhàn','名词','website','C','expression',['学校网站','打开网站'],'学校的网站上会有晚会的视频。','Xuéxiào de wǎngzhàn shang huì yǒu wǎnhuì de shìpín.','互联网上可以访问的一组页面'],
  ['视频','shìpín','名词','video','C','expression',['晚会视频','看视频'],'我打算再看一遍晚会视频。','Wǒ dǎsuàn zài kàn yí biàn wǎnhuì shìpín.','可以看到画面、通常也能听到声音的内容']
];

const vocabulary = vocabRows.map((row, index) => ({
  id:`v14_${String(index + 1).padStart(2,'0')}`, hanzi:row[0], pinyin:row[1], pos:row[2], english:row[3],
  tags:[row[4]], tier:row[5], phrases:row[6], phraseSourceType:'teaching_extension',
  example:row[7], examplePinyin:row[8], exampleSourceType:sourceTypeFor(row[7]),
  meaningCn:row[9], meaningCnSourceType:'teaching_extension', sourceType:'textbook', sourceRef
}));
const byWord = Object.fromEntries(vocabulary.map(item => [item.hanzi, item]));
const card = hanzi => {
  const item = byWord[hanzi];
  return {vocabularyId:item.id,hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,phrases:item.phrases,example:item.example,examplePinyin:item.examplePinyin,tier:item.tier};
};

const texts = [
  {id:'t_hsk3_l14_01',textId:1,title:'图书馆还书与借书',titleSourceType:'teaching_extension',format:'dialogue',genre:'对话',setting:'在校园餐厅，李文和白家月在聊天儿。',audio:null,audioStatus:'missing',plannedAudio:'../../audio/HSK3/14-1.mp3',sourceType:'textbook',sourceRef,lines:[
    ['李文','我借的这本词典最好今天还，但是我没时间去。','Wǒ jiè de zhè běn cídiǎn zuìhǎo jīntiān huán, dànshì wǒ méi shíjiān qù.','The dictionary I borrowed had better be returned today, but I don\'t have time to go.'],
    ['白家月','下午我只有两节课，可以帮你去图书馆还书。','Xiàwǔ wǒ zhǐ yǒu liǎng jié kè, kěyǐ bāng nǐ qù túshūguǎn huán shū.','I only have two classes this afternoon; I can help you go to the library to return the book.'],
    ['李文','那太感谢了。你能再帮我借本书吗？','Nà tài gǎnxiè le. Nǐ néng zài bāng wǒ jiè běn shū ma?','Thank you so much! Could you also help me borrow another book?'],
    ['白家月','行，你告诉我书名。','Xíng, nǐ gàosu wǒ shūmíng.','Sure, tell me the book title.'],
    ['李文','我把名字写在纸上吧。我去了好几次图书馆，这本书都被别人借走了。','Wǒ bǎ míngzi xiě zài zhǐ shang ba. Wǒ qùle hǎo jǐ cì túshūguǎn, zhè běn shū dōu bèi biérén jièzǒu le.','Let me write the title on a piece of paper. I\'ve been to the library several times, and this book has always been checked out by others.'],
    ['白家月','《名人的故事》？我有这本书。明天我借给你吧。','《Míngrén de Gùshi》? Wǒ yǒu zhè běn shū. Míngtiān wǒ jiè gěi nǐ ba.','“Stories of Celebrities”? I have this book. I\'ll lend it to you tomorrow.']
  ].map(([speaker,hanzi,pinyin,english])=>({speaker,hanzi,pinyin,english,englishSourceType:'textbook'}))},
  {id:'t_hsk3_l14_02',textId:2,title:'校园计划与校园卡',titleSourceType:'teaching_extension',format:'dialogue',genre:'对话',setting:'在校园里，白家月和安妮在聊天儿。',audio:null,audioStatus:'missing',plannedAudio:'../../audio/HSK3/14-3.mp3',sourceType:'textbook',sourceRef,lines:[
    ['安妮','今天下课早，你一会儿做什么？','Jīntiān xiàkè zǎo, nǐ yíhuìr zuò shénme?','Class dismissed early today. What are you doing in a bit?'],
    ['白家月','我今天忙得很，要先去图书馆借书，然后去游泳。','Wǒ jīntiān máng de hěn, yào xiān qù túshūguǎn jiè shū, ránhòu qù yóuyǒng.','I\'m very busy today; I need to go to the library to borrow books first, and then go swimming.'],
    ['安妮','咱们一起走吧，我想去图书馆看看中文报纸。','Zánmen yìqǐ zǒu ba, wǒ xiǎng qù túshūguǎn kànkan Zhōngwén bàozhǐ.','Let\'s go together; I\'d like to go to the library to read Chinese newspapers.'],
    ['白家月','等等，我的校园卡不见了，没有卡进不去图书馆。','Děngděng, wǒ de xiàoyuánkǎ bú jiàn le, méiyǒu kǎ jìn bu qù túshūguǎn.','Wait, my campus card is missing; I can\'t get into the library without a card.'],
    ['安妮','你想想上一次用是什么时候？','Nǐ xiǎngxiang shàng yí cì yòng shì shénme shíhou?','Think back: when was the last time you used it?'],
    ['白家月','我忘记了，可能被我放在家里了。','Wǒ wàngjì le, kěnéng bèi wǒ fàng zài jiā li le.','I forgot; it might have been left at home.'],
    ['安妮','进不去图书馆也没关系，上网看看有没有电子书。','Jìn bu qù túshūguǎn yě méi guānxi, shàngwǎng kànkan yǒu méiyǒu diànzǐshū.','It doesn\'t matter if you can\'t get into the library; check online to see if there are e-books available.'],
    ['白家月','不行，我必须去，我还得帮李文还书呢。','Bù xíng, wǒ bìxū qù, wǒ hái děi bāng Lǐ Wén huán shū ne.','No, I have to go; I still need to return a book for Li Wen.']
  ].map(([speaker,hanzi,pinyin,english])=>({speaker,hanzi,pinyin,english,englishSourceType:'textbook'}))},
  {id:'t_hsk3_l14_03',textId:3,title:'学校晚会与同伴鼓励',titleSourceType:'teaching_extension',format:'dialogue',genre:'对话',setting:'在校园餐厅，李文和白家月边吃边聊。',audio:null,audioStatus:'missing',plannedAudio:'../../audio/HSK3/14-5.mp3',sourceType:'textbook',sourceRef,lines:[
    ['李文','下周学校有晚会，你知道吗？','Xià zhōu xuéxiào yǒu wǎnhuì, nǐ zhīdào ma?','There\'s a party at school next week, do you know?'],
    ['白家月','知道，我和几个女生要表演一个节目。你也参加吗？','Zhīdào, wǒ hé jǐ gè nǚshēng yào biǎoyǎn yí gè jiémù. Nǐ yě cānjiā ma?','Yes, I know. A few other girls and I are performing a routine. Are you participating too?'],
    ['李文','我想唱中文歌，但是还没找到人一起表演，不知道怎么办。','Wǒ xiǎng chàng Zhōngwén gē, dànshì hái méi zhǎodào rén yìqǐ biǎoyǎn, bù zhīdào zěnme bàn.','I want to sing a Chinese song, but I haven\'t found anyone to perform with yet, and I don\'t know what to do.'],
    ['白家月','找不到人，你就一个人唱吧。','Zhǎo bu dào rén, nǐ jiù yí gè rén chàng ba.','If you can\'t find anyone, just sing by yourself.'],
    ['李文','一想到要在校长、老师和那么多同学面前表演，就有些紧张。','Yì xiǎngdào yào zài xiàozhǎng, lǎoshī hé nàme duō tóngxué miànqián biǎoyǎn, jiù yǒuxiē jǐnzhāng.','Whenever I think about performing in front of the principal, teachers, and so many students, I get somewhat nervous.'],
    ['白家月','紧张什么啊，我们都喜欢听你唱歌，你要相信自己。','Jǐnzhāng shénme a, wǒmen dōu xǐhuan tīng nǐ chàng gē, nǐ yào xiāngxìn zìjǐ.','What are you nervous about? We all love listening to you sing. You have to believe in yourself.']
  ].map(([speaker,hanzi,pinyin,english])=>({speaker,hanzi,pinyin,english,englishSourceType:'textbook'}))},
  {id:'t_hsk3_l14_04',textId:4,title:'学校新年晚会日记',titleSourceType:'teaching_extension',format:'diary',genre:'日记',genreEn:'Diary',author:'白家月',setting:'在家里，白家月在写日记。',audio:null,audioStatus:'missing',plannedAudio:'../../audio/HSK3/14-7.mp3',sourceType:'textbook',sourceRef,translationPolicy:'L14权威教材未提供课文四英文译文；正式数据不补写英文。',lines:[
    {speaker:'白家月',hanzi:'昨天是我们学校的新年晚会，每个班级的同学都表演节目了。晚会是八点开始的，差不多十二点才结束。我一个晚上跟大家一起又唱又跳，开心极了，也累坏了。我最喜欢的节目是留学生们跳舞，最后老师和校长也被叫起来一块儿跳，特别有意思。过几天学校的网站上会有晚会的视频，我打算再看一遍。',pinyin:'Zuótiān shì wǒmen xuéxiào de xīnnián wǎnhuì, měi gè bānjí de tóngxué dōu biǎoyǎn jiémù le. Wǎnhuì shì bā diǎn kāishǐ de, chàbuduō shí\'èr diǎn cái jiéshù. Wǒ yí gè wǎnshang gēn dàjiā yìqǐ yòu chàng yòu tiào, kāixīn jí le, yě lèi huài le. Wǒ zuì xǐhuan de jiémù shì liúxuéshēngmen tiàowǔ, zuìhòu lǎoshī hé xiàozhǎng yě bèi jiào qǐlai yíkuàir tiào, tèbié yǒu yìsi. Guò jǐ tiān xuéxiào de wǎngzhàn shang huì yǒu wǎnhuì de shìpín, wǒ dǎsuàn zài kàn yí biàn.',english:'',englishSourceType:'missing'}
  ]}
];

const grammar = [
  {id:'g14_01',title:'被动句（1）',titleEn:'Passive Sentences (1)',appliesTo:[1,2,4],scene:'观察书、校园卡和晚会人物怎样受到动作影响。',sceneSourceType:'teaching_extension',structure:'主语 + 被 + 宾语 + 动词 + 其他成分',structureSourceType:'textbook',explanation:'汉语中用带“被”字的句子表达被动意义，突出主语受到了某个动作的影响，语气常带有被动、无奈、负面等色彩。副词和能愿动词放在“被”字前面，“被”字后面的宾语可以省略。基本结构：主语 + 被 + 宾语 + 动词 + 其他成分。',explanationSourceType:'textbook',sourceType:'textbook',sourceRef,examples:[
    example('这本书被别人借走了。','Zhè běn shū bèi biérén jièzǒu le.','This book was checked out by someone else.','textbook'),
    example('水果可能被弟弟吃了。','Shuǐguǒ kěnéng bèi dìdi chī le.','The fruit may have been eaten by the younger brother.','textbook'),
    example('我们俩经常被叫错名字。','Wǒmen liǎ jīngcháng bèi jiào cuò míngzi.','Our names are often mixed up.','textbook'),
    example('我忘记了，可能被我放在家里了。','Wǒ wàngjì le, kěnéng bèi wǒ fàng zài jiā li le.','I forgot; it might have been left at home.','teaching_extension'),
    example('最后老师和校长也被叫起来一块儿跳。','Zuìhòu lǎoshī hé xiàozhǎng yě bèi jiào qǐlai yíkuàir tiào.','At the end, the teachers and principal were invited up to dance together.','teaching_extension')
  ]},
  {id:'g14_02',title:'承接复句“先……，再/然后……”',titleEn:'Successive Complex Sentence 先……，再/然后……',appliesTo:[2],scene:'观察校园任务的先后顺序。',sceneSourceType:'teaching_extension',structure:'先 + 动作一，再/然后 + 动作二',structureSourceType:'teaching_extension',explanation:'承接复句“先……，再/然后……”中，两个分句表示动作的先后顺序。',explanationSourceType:'textbook',sourceType:'textbook',sourceRef,examples:[
    example('我要先去图书馆借书，然后去游泳。','Wǒ yào xiān qù túshūguǎn jiè shū, ránhòu qù yóuyǒng.','I will go to the library first, then go swimming.','textbook'),
    example('你先去买门票，再来这里找我。','Nǐ xiān qù mǎi ménpiào, zài lái zhèli zhǎo wǒ.','Buy the ticket first, then come here to find me.','textbook'),
    example('你们先回房间休息一会儿，然后再出来吃晚饭。','Nǐmen xiān huí fángjiān xiūxi yíhuìr, ránhòu zài chūlai chī wǎnfàn.','Return to your room and rest first, then come out for dinner.','textbook'),
    example('我先帮李文还书，然后看中文报纸。','Wǒ xiān bāng Lǐ Wén huán shū, ránhòu kàn Zhōngwén bàozhǐ.','I will return Li Wen’s book first, then read a Chinese newspaper.','teaching_extension'),
    example('我们先看晚会视频，再说最喜欢的节目。','Wǒmen xiān kàn wǎnhuì shìpín, zài shuō zuì xǐhuan de jiémù.','We will watch the party video first, then talk about our favorite program.','teaching_extension')
  ]},
  {id:'g14_03',title:'固定格式“×什么（啊）”',titleEn:'Fixed Pattern ×什么（啊）',appliesTo:[3],scene:'观察朋友怎样否定担忧并给出安慰。',sceneSourceType:'teaching_extension',structure:'担忧或状态 + 什么（啊） + 安慰/理由',structureSourceType:'teaching_extension',explanation:'固定格式“×什么（啊）”通常用于否定对方的担忧、疑问或强调事实，带有反驳或安慰的语气。',explanationSourceType:'textbook',sourceType:'textbook',sourceRef,examples:[
    example('紧张什么啊，我们都喜欢听你唱歌，你要相信自己。','Jǐnzhāng shénme a, wǒmen dōu xǐhuan tīng nǐ chàng gē, nǐ yào xiāngxìn zìjǐ.','What are you nervous about? We all like hearing you sing; believe in yourself.','textbook'),
    example('胖什么啊，你看上去不胖也不瘦。','Pàng shénme a, nǐ kàn shangqu bú pàng yě bù shòu.','Why worry about being fat? You look neither fat nor thin.','textbook'),
    example('急什么啊，马上就到了。','Jí shénme a, mǎshàng jiù dào le.','Why the hurry? We are almost there.','textbook'),
    example('担心什么啊，我们都相信你。','Dānxīn shénme a, wǒmen dōu xiāngxìn nǐ.','Why worry? We all believe in you.','teaching_extension'),
    example('急什么啊，我们先上网看看有没有电子书。','Jí shénme a, wǒmen xiān shàngwǎng kànkan yǒu méiyǒu diànzǐshū.','Why hurry? Let us first check online for an e-book.','teaching_extension')
  ]}
];

const vocabScenes = {
  '1': {title:'课文1：图书馆帮忙',steps:[
    {id:'l14_vocab_scene_t1_01',title:'餐厅里的还书请求',image:img('photo-text-1-library-help'),prompt:'李文为什么需要白家月帮忙？',promptPinyin:'Lǐ Wén wèishénme xūyào Bái Jiāyuè bāngmáng?',promptEn:'Why does Li Wen need Bai Jiayue’s help?',talkHint:'先指出词典和课程表，再说明还书请求。',words:['词典','最好','节'].map(card),labels:[{text:'词典',x:28,y:58},{text:'两节课',x:69,y:38},{text:'李文',x:24,y:30}],sampleAnswers:['这本词典最好今天还。','白家月下午只有两节课，可以帮他还书。'],sourceType:'teaching_extension'},
    {id:'l14_vocab_scene_t1_02',title:'书已经被借走',image:img('photo-text-1-book-availability'),prompt:'图书馆里发生了什么？',promptPinyin:'Túshūguǎn li fāshēng le shénme?',promptEn:'What happened at the library?',talkHint:'观察书架、借阅状态和书名。',words:['图书馆','被','名人','故事'].map(card),labels:[{text:'图书馆',x:16,y:22},{text:'《名人的故事》',x:66,y:54},{text:'已借出',x:80,y:28}],sampleAnswers:['这本书被别人借走了。','白家月有《名人的故事》，明天可以借给李文。'],sourceType:'teaching_extension'}
  ]},
  '2': {title:'课文2：校园计划与校园卡',steps:[
    {id:'l14_vocab_scene_t2_01',title:'下午的校园路线',image:img('photo-text-2-campus-plan'),prompt:'白家月先做什么，然后做什么？',promptPinyin:'Bái Jiāyuè xiān zuò shénme, ránhòu zuò shénme?',promptEn:'What will Bai Jiayue do first and then?',talkHint:'沿着路线说出两个动作。',words:['然后','报纸','电子书'].map(card),labels:[{text:'中文报纸',x:28,y:50},{text:'电子书',x:55,y:63},{text:'游泳馆',x:81,y:32}],sampleAnswers:['她先去图书馆，然后去游泳。','安妮想在图书馆看中文报纸。'],sourceType:'teaching_extension'},
    {id:'l14_vocab_scene_t2_02',title:'找不到校园卡',image:img('photo-text-2-missing-card'),prompt:'校园卡可能在哪里？现在还有什么办法？',promptPinyin:'Xiàoyuánkǎ kěnéng zài nǎli? Xiànzài hái yǒu shénme bànfǎ?',promptEn:'Where might the campus card be, and what else can they do?',talkHint:'先说忘记了什么，再提出电子书办法。',words:['忘记','电子书','然后'].map(card),labels:[{text:'校园卡',x:35,y:64},{text:'手机电子书',x:70,y:55},{text:'白家月',x:23,y:31}],sampleAnswers:['她忘记校园卡放在哪儿了。','她们可以先上网看电子书，然后再想办法还书。'],sourceType:'teaching_extension'}
  ]},
  '3': {title:'课文3：晚会与鼓励',steps:[
    {id:'l14_vocab_scene_t3_01',title:'讨论晚会节目',image:img('photo-text-3-party-plan'),prompt:'大家准备表演什么节目？',promptPinyin:'Dàjiā zhǔnbèi biǎoyǎn shénme jiémù?',promptEn:'What program are the students preparing?',talkHint:'观察晚会海报和学生分工。',words:['女生','表演','节目','怎么办'].map(card),labels:[{text:'女生',x:26,y:42},{text:'节目单',x:63,y:48},{text:'晚会海报',x:82,y:24}],sampleAnswers:['几个女生要表演一个节目。','李文还没找到人一起表演，不知道怎么办。'],sourceType:'teaching_extension'},
    {id:'l14_vocab_scene_t3_02',title:'上台前的鼓励',image:img('photo-text-3-stage-encouragement'),prompt:'李文为什么有些紧张？朋友可以怎么说？',promptPinyin:'Lǐ Wén wèishénme yǒuxiē jǐnzhāng? Péngyou kěyǐ zěnme shuō?',promptEn:'Why is Li Wen nervous, and what can a friend say?',talkHint:'指出舞台、观众和安慰的人。',words:['校长','面前','有些','相信'].map(card),labels:[{text:'校长和老师',x:72,y:45},{text:'舞台',x:50,y:30},{text:'李文',x:28,y:52}],sampleAnswers:['他要在很多人面前表演，所以有些紧张。','紧张什么啊，你要相信自己。'],sourceType:'teaching_extension'}
  ]},
  '4': {title:'课文4：新年晚会日记',steps:[
    {id:'l14_vocab_scene_t4_01',title:'新年晚会节目',image:img('photo-text-4-new-year-party'),prompt:'晚会上有哪些人和节目？',promptPinyin:'Wǎnhuì shang yǒu nǎxiē rén hé jiémù?',promptEn:'Who and what programs are at the party?',talkHint:'观察班级、留学生和舞蹈节目。',words:['新年','班级','跳','留学生'].map(card),labels:[{text:'留学生',x:36,y:43},{text:'跳舞',x:52,y:58},{text:'班级节目',x:79,y:28}],sampleAnswers:['每个班级都表演节目了。','白家月最喜欢留学生们跳舞。'],sourceType:'teaching_extension'},
    {id:'l14_vocab_scene_t4_02',title:'最后一起跳舞',image:img('photo-text-4-school-video'),prompt:'晚会最后发生了什么？以后在哪里能再看？',promptPinyin:'Wǎnhuì zuìhòu fāshēng le shénme? Yǐhòu zài nǎli néng zài kàn?',promptEn:'What happened at the end, and where can people watch it later?',talkHint:'观察舞台和学校网站的视频页面。',words:['最后','一块儿','网站','视频'].map(card),labels:[{text:'老师和校长',x:35,y:43},{text:'一块儿跳',x:52,y:60},{text:'学校网站视频',x:82,y:35}],sampleAnswers:['最后老师和校长也被叫起来一块儿跳。','学校网站上会有晚会的视频。'],sourceType:'teaching_extension'}
  ]}
};

const grammarTeachingNotes = {
  g14_01:{presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',scene:'观察书、校园卡和晚会人物怎样受到动作影响。',observePrompt:'每行先找受到影响的人或东西，再找“被”、动作执行者和结果。',observeHighlights:[['书','被别人','借走'],['水果','可能','被弟弟','吃了'],['我们俩','经常','被','叫错名字'],['可能','被我','放在家里'],['老师和校长','被','叫起来','一块儿跳']],examples:[...grammar[0].examples],visualLearning:{leadExamples:[{english:'The book is affected by another person’s action.',hanzi:'这本书被别人借走了。',pinyin:'Zhè běn shū bèi biérén jièzǒu le.'}],blocks:['受影响的人/事物','副词/能愿动词','被 + 动作执行者','动作 + 结果'],blockLabelsEn:['affected subject','adverb/modal','被 and agent','action and result']},oralQuestions:[
    {question:'你想借的书被别人借走了，你怎么办？',pinyin:'Nǐ xiǎng jiè de shū bèi biérén jièzǒu le, nǐ zěnme bàn?'},
    {question:'校园卡可能被你放在哪里了？',pinyin:'Xiàoyuánkǎ kěnéng bèi nǐ fàng zài nǎli le?'},
    {question:'你的名字被别人叫错过吗？',pinyin:'Nǐ de míngzi bèi biérén jiào cuòguo ma?'},
    {question:'晚会上谁被叫起来参加活动？',pinyin:'Wǎnhuì shang shéi bèi jiào qǐlai cānjiā huódòng?'}
  ],structureVariants:[
    {label:'动作执行者出现',formula:'主语 + 被 + 动作执行者 + 动词 + 结果',formulaEn:'subject + 被 + agent + action + result',explanation:'说明谁做了这个动作。',example:'这本书被别人借走了。',examplePinyin:'Zhè běn shū bèi biérén jièzǒu le.'},
    {label:'动作执行者省略',formula:'主语 + 被 + 动词 + 结果',formulaEn:'the agent may be omitted',explanation:'不知道或不需要说明谁做时，可以省略。',example:'老师和校长也被叫起来跳舞。',examplePinyin:'Lǎoshī hé xiàozhǎng yě bèi jiào qǐlai tiàowǔ.'},
    {label:'副词或能愿动词',formula:'主语 + 可能/经常 + 被……',formulaEn:'adverb or modal before 被',explanation:'“可能、经常”等放在“被”前。',example:'校园卡可能被我放在家里了。',examplePinyin:'Xiàoyuánkǎ kěnéng bèi wǒ fàng zài jiā li le.'}
  ],followUp:[{image:img('photo-text-1-book-availability'),promptEn:'The book is unavailable and the campus card is missing.',target:'用一个完整被动句说明书或校园卡发生了什么。',sampleAnswer:'这本书被别人借走了。'}],sourceType:'teaching_extension'},
  g14_02:{presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',scene:'观察校园任务怎样按顺序完成。',observePrompt:'每行圈出“先”和“再/然后”，再找两个动作。',observeHighlights:[['先','去图书馆借书','然后','去游泳'],['先','买门票','再','来这里找我'],['先','回房间休息','然后再','出来吃晚饭'],['先','帮李文还书','然后','看中文报纸'],['先','看晚会视频','再','说最喜欢的节目']],examples:[...grammar[1].examples],visualLearning:{leadExamples:[{english:'Put two campus actions in order.',hanzi:'先去图书馆，然后去游泳。',pinyin:'Xiān qù túshūguǎn, ránhòu qù yóuyǒng.'}],blocks:['先','动作一','再/然后','动作二'],blockLabelsEn:['first','action one','then','action two']},oralQuestions:[
    {question:'下课以后你先做什么，然后做什么？',pinyin:'Xiàkè yǐhòu nǐ xiān zuò shénme, ránhòu zuò shénme?'},
    {question:'去图书馆以前，你先准备什么？',pinyin:'Qù túshūguǎn yǐqián, nǐ xiān zhǔnbèi shénme?'},
    {question:'准备晚会时，大家先做什么，再做什么？',pinyin:'Zhǔnbèi wǎnhuì shí, dàjiā xiān zuò shénme, zài zuò shénme?'},
    {question:'周末你怎样安排两件事情？',pinyin:'Zhōumò nǐ zěnyàng ānpái liǎng jiàn shìqing?'}
  ],structureVariants:[
    {label:'使用“再”',formula:'先 A，再 B',formulaEn:'first A, then B',explanation:'“再”引出第二个动作。',example:'你先买门票，再来找我。',examplePinyin:'Nǐ xiān mǎi ménpiào, zài lái zhǎo wǒ.'},
    {label:'使用“然后”',formula:'先 A，然后 B',formulaEn:'first A, then B',explanation:'“然后”连接前后两个动作。',example:'我先去图书馆，然后去游泳。',examplePinyin:'Wǒ xiān qù túshūguǎn, ránhòu qù yóuyǒng.'},
    {label:'“然后再”',formula:'先 A，然后再 B',formulaEn:'finish A before moving to B',explanation:'强调完成前一步以后才做下一步。',example:'你们先休息，然后再出来吃饭。',examplePinyin:'Nǐmen xiān xiūxi, ránhòu zài chūlai chīfàn.'}
  ],followUp:[{image:img('photo-text-2-campus-plan'),promptEn:'Plan two campus tasks in a clear order.',target:'用“先……，再/然后……”说一个两步计划。',sampleAnswer:'我先去图书馆还书，然后去游泳。'}],sourceType:'teaching_extension'},
  g14_03:{presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'dialogue_rows',scene:'观察朋友怎样先否定担忧，再给理由或建议。',observePrompt:'先找担忧词，再观察“什么啊”后面怎样安慰。',observeHighlights:[['紧张','什么啊','相信自己'],['胖','什么啊','不胖也不瘦'],['急','什么啊','马上就到了'],['担心','什么啊','我们都相信你'],['急','什么啊','先上网看看']],examples:[...grammar[2].examples],visualLearning:{leadExamples:[{english:'A friend is nervous before performing.',hanzi:'紧张什么啊，我们都喜欢听你唱歌。',pinyin:'Jǐnzhāng shénme a, wǒmen dōu xǐhuan tīng nǐ chàng gē.'}],blocks:['担忧/状态','什么（啊）','安慰理由','下一步建议'],blockLabelsEn:['worry or state','friendly rebuttal','reason','next step']},oralQuestions:[
    {question:'同学要在很多人面前唱歌，很紧张，你怎么安慰？',pinyin:'Tóngxué yào zài hěn duō rén miànqián chànggē, hěn jǐnzhāng, nǐ zěnme ānwèi?'},
    {question:'朋友担心自己的中文不好，你怎么说？',pinyin:'Péngyou dānxīn zìjǐ de Zhōngwén bù hǎo, nǐ zěnme shuō?'},
    {question:'同学没找到表演伙伴，你能给什么建议？',pinyin:'Tóngxué méi zhǎodào biǎoyǎn huǒbàn, nǐ néng gěi shénme jiànyì?'},
    {question:'哪些场合不适合直接说“×什么啊”？',pinyin:'Nǎxiē chǎnghé bù héshì zhíjiē shuō “× shénme a”?'}
  ],structureVariants:[
    {label:'熟人间安慰',formula:'担忧词 + 什么啊 + 安慰理由',formulaEn:'friendly reassurance among people who know each other',explanation:'语气要友好，后面补充真实理由。',example:'紧张什么啊，我们都喜欢听你唱歌。',examplePinyin:'Jǐnzhāng shénme a, wǒmen dōu xǐhuan tīng nǐ chàng gē.'},
    {label:'使用限制',formula:'不用来嘲笑、正式批评或否定真实感受',formulaEn:'not for ridicule or formal criticism',explanation:'对陌生人、长辈或正式场合应选择更礼貌的表达。',example:'别担心，我们可以先练习。',examplePinyin:'Bié dānxīn, wǒmen kěyǐ xiān liànxí.'}
  ],followUp:[{image:img('photo-text-3-stage-encouragement'),promptEn:'A classmate is nervous before the school performance.',target:'用“×什么啊”安慰同学，并补充一个真实理由或下一步建议。',sampleAnswer:'紧张什么啊，我们都喜欢听你唱歌，你要相信自己。'}],sourceType:'teaching_extension'}
};

const detail = (id,question,pinyin,answer,answerPinyin,acceptedAnswers,informationPoint) => ({
  id,question,pinyin,question_pinyin:pinyin,answer,answerPinyin,answer_pinyin:answerPinyin,acceptedAnswers,informationPoint,sourceType:'teaching_extension'
});
const overall = (id,focus,question,pinyin,options,correctIndex) => ({id,focus,question,pinyin,options,correctIndex,answer:options[correctIndex],sourceType:'teaching_extension'});

const textTeachingNotes = {
  t_hsk3_l14_01:{presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:'先读对话，判断谁需要帮助，以及事情和图书馆有什么关系。',audioStatus:'missing',preReadingQuestions:[{question:'你需要别人帮忙还书时会怎么说？',pinyin:'Nǐ xūyào biérén bāngmáng huán shū shí huì zěnme shuō?'},{question:'想借的书已经被借走，可以怎么办？',pinyin:'Xiǎng jiè de shū yǐjīng bèi jièzǒu, kěyǐ zěnme bàn?'}],overallChoices:[
    overall('l14_t1_overall_01','main_idea','对话主要谈什么？','Duìhuà zhǔyào tán shénme?',['互相帮忙还书和借书','准备学校晚会','寻找校园卡'],0),
    overall('l14_t1_overall_02','development','这件事最后怎样发展？','Zhè jiàn shì zuìhòu zěnyàng fāzhǎn?',['还书和借书的问题都有了办法','两个人决定不再借书','李文去参加晚会'],0),
    overall('l14_t1_overall_03','relationship','这段对话表现两位同学怎样的关系？','Zhè duàn duìhuà biǎoxiàn liǎng wèi tóngxué zěnyàng de guānxi?',['愿意互相帮助','互相不相信','只讨论上课'],0)
  ],details:[
    detail('l14_t1_detail_01','李文借的词典最好什么时候还？','Lǐ Wén jiè de cídiǎn zuìhǎo shénme shíhou huán?','今天。','Jīntiān.',['今天','最好今天还'],'还书时间'),
    detail('l14_t1_detail_02','李文为什么不能自己去还词典？','Lǐ Wén wèishénme bù néng zìjǐ qù huán cídiǎn?','因为他没时间去。','Yīnwèi tā méi shíjiān qù.',['他没时间','没时间去'],'不能亲自还书的原因'),
    detail('l14_t1_detail_03','白家月下午有几节课？','Bái Jiāyuè xiàwǔ yǒu jǐ jié kè?','她下午有两节课。','Tā xiàwǔ yǒu liǎng jié kè.',['两节','两节课'],'下午课程数量'),
    detail('l14_t1_detail_04','李文还请白家月帮他做什么？','Lǐ Wén hái qǐng Bái Jiāyuè bāng tā zuò shénme?','帮他再借一本书。','Bāng tā zài jiè yì běn shū.',['再借一本书','帮他借书'],'第二个请求'),
    detail('l14_t1_detail_05','白家月为什么说明天可以把《名人的故事》借给李文？','Bái Jiāyuè wèishénme shuō míngtiān kěyǐ bǎ “Míngrén de Gùshi” jiè gěi Lǐ Wén?','因为她有这本书。','Yīnwèi tā yǒu zhè běn shū.',['她有这本书','白家月有这本书'],'最后的解决办法')
  ],keyPoints:[],cultureDiscussion:{questions:['你所在的学校怎样借书和还书？','图书馆的书已经借出时通常有什么办法？'],wordCards:[{hanzi:'借书 / 还书',pinyin:'jiè shū / huán shū',english:'borrow / return a book'},{hanzi:'请同学帮忙',pinyin:'qǐng tóngxué bāngmáng',english:'ask a classmate for help'},{hanzi:'被别人借走',pinyin:'bèi biérén jièzǒu',english:'be borrowed by someone else'}],sampleAnswers:[{hanzi:'在我们学校，借书和还书都需要校园卡。',pinyin:'Zài wǒmen xuéxiào, jiè shū hé huán shū dōu xūyào xiàoyuánkǎ.'},{hanzi:'书被别人借走时，我会先找电子书，也可以请同学帮忙。',pinyin:'Shū bèi biérén jièzǒu shí, wǒ huì xiān zhǎo diànzǐshū, yě kěyǐ qǐng tóngxué bāngmáng.'}],sourceType:'teaching_extension'},retellScaffold:{nodes:[{label:'还词典',hint:'最好今天还'},{label:'困难',hint:'李文没时间'},{label:'帮忙',hint:'白家月去还'},{label:'借书',hint:'书被别人借走了'},{label:'办法',hint:'白家月有这本书'}],frame:'李文的词典最好……，但是……。白家月可以……。李文还想……，那本书……。最后……。'},languageAndApplication:{grammarIds:['g14_01'],personalPrompt:'说一次借书、还书或请同学帮忙的经历。',paragraphPracticeId:'l14_para_01',miniId:'T1'},sourceType:'teaching_extension'},
  t_hsk3_l14_02:{presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:'先读对话，判断白家月的计划是否顺利。',audioStatus:'missing',preReadingQuestions:[{question:'你去图书馆以前需要带什么？',pinyin:'Nǐ qù túshūguǎn yǐqián xūyào dài shénme?'},{question:'计划遇到问题时，你会先想什么办法？',pinyin:'Jìhuà yùdào wèntí shí, nǐ huì xiān xiǎng shénme bànfǎ?'}],overallChoices:[
    overall('l14_t2_overall_01','main_idea','对话主要围绕什么安排？','Duìhuà zhǔyào wéirào shénme ānpái?',['完成图书馆任务，再进行其他活动','准备晚会节目','选择一本名人故事'],0),
    overall('l14_t2_overall_02','development','计划进行时出现了什么变化？','Jìhuà jìnxíng shí chūxiàn le shénme biànhuà?',['进图书馆遇到问题，两人开始想别的办法','游泳已经结束','安妮决定回家'],0),
    overall('l14_t2_overall_03','purpose','两人主要在想办法做什么？','Liǎng rén zhǔyào zài xiǎng bànfǎ zuò shénme?',['继续完成今天必须做的事情','准备校长的节目','制作学校网站'],0)
  ],details:[
    detail('l14_t2_detail_01','安妮想去图书馆看什么？','Ānnī xiǎng qù túshūguǎn kàn shénme?','她想看中文报纸。','Tā xiǎng kàn Zhōngwén bàozhǐ.',['中文报纸','看中文报纸'],'安妮去图书馆的目的'),
    detail('l14_t2_detail_02','白家月为什么进不去图书馆？','Bái Jiāyuè wèishénme jìn bu qù túshūguǎn?','因为她的校园卡不见了。','Yīnwèi tā de xiàoyuánkǎ bú jiàn le.',['校园卡不见了','没有校园卡'],'无法进入图书馆的条件'),
    detail('l14_t2_detail_03','她觉得校园卡可能在哪里？','Tā juéde xiàoyuánkǎ kěnéng zài nǎli?','可能被她放在家里了。','Kěnéng bèi tā fàng zài jiā li le.',['在家里','可能放在家里'],'校园卡可能的位置'),
    detail('l14_t2_detail_04','安妮建议她怎么找书？','Ānnī jiànyì tā zěnme zhǎo shū?','上网看看有没有电子书。','Shàngwǎng kànkan yǒu méiyǒu diànzǐshū.',['上网找电子书','看看有没有电子书'],'替代解决办法'),
    detail('l14_t2_detail_05','白家月为什么说她必须去图书馆？','Bái Jiāyuè wèishénme shuō tā bìxū qù túshūguǎn?','因为她还得帮李文还书。','Yīnwèi tā hái děi bāng Lǐ Wén huán shū.',['帮李文还书','她还要还书'],'必须继续原计划的原因')
  ],keyPoints:[],cultureDiscussion:{questions:['你的学校进入图书馆需要什么？','没有实体书时，你会选择电子书吗？为什么？'],wordCards:[{hanzi:'校园卡',pinyin:'xiàoyuánkǎ',english:'campus card'},{hanzi:'先……然后……',pinyin:'xiān... ránhòu...',english:'first... then...'},{hanzi:'上网找电子书',pinyin:'shàngwǎng zhǎo diànzǐshū',english:'look online for an e-book'}],sampleAnswers:[{hanzi:'进入我们学校的图书馆需要校园卡。',pinyin:'Jìnrù wǒmen xuéxiào de túshūguǎn xūyào xiàoyuánkǎ.'},{hanzi:'没有实体书时，我会先上网找电子书，然后问问老师。',pinyin:'Méiyǒu shítǐshū shí, wǒ huì xiān shàngwǎng zhǎo diànzǐshū, ránhòu wènwen lǎoshī.'}],sourceType:'teaching_extension'},retellScaffold:{nodes:[{label:'下课早',hint:'今天的时间'},{label:'行动顺序',hint:'先去图书馆，然后游泳'},{label:'安妮',hint:'想看中文报纸'},{label:'问题',hint:'校园卡不见了'},{label:'替代办法',hint:'上网找电子书'},{label:'必须完成',hint:'帮李文还书'}],frame:'今天下课早，白家月先……，然后……。安妮想……。但是……。安妮建议……，白家月还是要……。'},languageAndApplication:{grammarIds:['g14_02','g14_01'],personalPrompt:'说一个两步课后计划，并说明遇到问题时的备用办法。',paragraphPracticeId:'l14_para_02',miniId:'T2'},sourceType:'teaching_extension'},
  t_hsk3_l14_03:{presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:'先读对话，判断两人在谈什么活动，以及李文的心情怎样变化。',audioStatus:'missing',preReadingQuestions:[{question:'学校晚会可以表演什么节目？',pinyin:'Xuéxiào wǎnhuì kěyǐ biǎoyǎn shénme jiémù?'},{question:'朋友上台前很紧张，你会怎么鼓励？',pinyin:'Péngyou shàngtái qián hěn jǐnzhāng, nǐ huì zěnme gǔlì?'}],overallChoices:[
    overall('l14_t3_overall_01','main_idea','两个人主要在谈什么？','Liǎng gè rén zhǔyào zài tán shénme?',['学校晚会和表演','图书馆借书','校园卡丢失'],0),
    overall('l14_t3_overall_02','development','李文的情况怎样变化？','Lǐ Wén de qíngkuàng zěnyàng biànhuà?',['从想参加表演变成有些担心','从紧张变成不参加','从借书变成看报纸'],0),
    overall('l14_t3_overall_03','purpose','白家月最后说话的主要目的是什么？','Bái Jiāyuè zuìhòu shuōhuà de zhǔyào mùdì shì shénme?',['鼓励李文相信自己','请李文去还书','让李文制作网站'],0)
  ],details:[
    detail('l14_t3_detail_01','白家月要和谁一起表演节目？','Bái Jiāyuè yào hé shéi yìqǐ biǎoyǎn jiémù?','她要和几个女生一起表演。','Tā yào hé jǐ gè nǚshēng yìqǐ biǎoyǎn.',['几个女生','和几个女生'],'白家月的表演伙伴'),
    detail('l14_t3_detail_02','李文想表演什么？','Lǐ Wén xiǎng biǎoyǎn shénme?','他想唱中文歌。','Tā xiǎng chàng Zhōngwén gē.',['唱中文歌','中文歌'],'李文计划的节目'),
    detail('l14_t3_detail_03','李文为什么不知道怎么办？','Lǐ Wén wèishénme bù zhīdào zěnme bàn?','因为他还没找到人一起表演。','Yīnwèi tā hái méi zhǎodào rén yìqǐ biǎoyǎn.',['没找到表演伙伴','没人和他一起表演'],'缺少表演伙伴'),
    detail('l14_t3_detail_04','李文为什么有些紧张？','Lǐ Wén wèishénme yǒuxiē jǐnzhāng?','因为要在校长、老师和很多同学面前表演。','Yīnwèi yào zài xiàozhǎng, lǎoshī hé hěn duō tóngxué miànqián biǎoyǎn.',['要在很多人面前表演','观众很多'],'紧张的原因'),
    detail('l14_t3_detail_05','白家月怎样鼓励李文？','Bái Jiāyuè zěnyàng gǔlì Lǐ Wén?','她说大家都喜欢听他唱歌，让他相信自己。','Tā shuō dàjiā dōu xǐhuan tīng tā chàng gē, ràng tā xiāngxìn zìjǐ.',['大家喜欢听他唱歌','相信自己'],'鼓励的理由和内容')
  ],keyPoints:[],cultureDiscussion:{questions:['学校晚会中怎样让每个人都有参与机会？','鼓励同学时，什么语气最合适？'],wordCards:[{hanzi:'一起表演',pinyin:'yìqǐ biǎoyǎn',english:'perform together'},{hanzi:'给同学机会',pinyin:'gěi tóngxué jīhuì',english:'give classmates an opportunity'},{hanzi:'相信自己',pinyin:'xiāngxìn zìjǐ',english:'believe in yourself'}],sampleAnswers:[{hanzi:'学校可以准备不同的节目，让想参加的同学都有机会。',pinyin:'Xuéxiào kěyǐ zhǔnbèi bùtóng de jiémù, ràng xiǎng cānjiā de tóngxué dōu yǒu jīhuì.'},{hanzi:'鼓励同学时，语气要友好，可以说“别紧张，我们都相信你”。',pinyin:'Gǔlì tóngxué shí, yǔqì yào yǒuhǎo, kěyǐ shuō “Bié jǐnzhāng, wǒmen dōu xiāngxìn nǐ”.'}],sourceType:'teaching_extension'},retellScaffold:{nodes:[{label:'学校晚会',hint:'下周举行'},{label:'白家月',hint:'和几个女生表演'},{label:'李文',hint:'想唱中文歌'},{label:'困难',hint:'没有表演伙伴'},{label:'担心',hint:'在很多人面前紧张'},{label:'鼓励',hint:'相信自己'}],frame:'下周学校……。白家月……。李文想……，但是……。他一想到……就……。白家月说……。'},languageAndApplication:{grammarIds:['g14_03'],personalPrompt:'表达一个安全、真实的担忧，再给同伴一句鼓励和一个建议。',paragraphPracticeId:'l14_para_03',miniId:'T3'},sourceType:'teaching_extension'},
  t_hsk3_l14_04:{presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:'阅读日记，判断活动是什么，以及作者的总体感受。',audioStatus:'missing',preReadingQuestions:[{question:'你参加过学校晚会吗？你做了什么？',pinyin:'Nǐ cānjiāguo xuéxiào wǎnhuì ma? Nǐ zuòle shénme?'},{question:'日记通常会记录哪些信息？',pinyin:'Rìjì tōngcháng huì jìlù nǎxiē xìnxī?'}],overallChoices:[
    overall('l14_t4_overall_01','main_idea','这篇日记主要记录什么？','Zhè piān rìjì zhǔyào jìlù shénme?',['学校新年晚会','图书馆借书','游泳计划'],0),
    overall('l14_t4_overall_02','attitude','作者对晚会的总体感受是什么？','Zuòzhě duì wǎnhuì de zǒngtǐ gǎnshòu shì shénme?',['很开心，也很累','很生气，也很急','很安静，也很无聊'],0),
    overall('l14_t4_overall_03','purpose','作者写这段日记主要想做什么？','Zuòzhě xiě zhè duàn rìjì zhǔyào xiǎng zuò shénme?',['回顾一次有意思的校园晚会','说明怎样借电子书','介绍怎样办校园卡'],0)
  ],details:[
    detail('l14_t4_detail_01','晚会几点开始，差不多几点结束？','Wǎnhuì jǐ diǎn kāishǐ, chàbuduō jǐ diǎn jiéshù?','八点开始，差不多十二点结束。','Bā diǎn kāishǐ, chàbuduō shí’èr diǎn jiéshù.',['八点到十二点','八点开始，十二点左右结束'],'晚会时间'),
    detail('l14_t4_detail_02','白家月在晚会上做了什么，感觉怎么样？','Bái Jiāyuè zài wǎnhuì shang zuòle shénme, gǎnjué zěnmeyàng?','她跟大家又唱又跳，很开心，也累坏了。','Tā gēn dàjiā yòu chàng yòu tiào, hěn kāixīn, yě lèi huài le.',['又唱又跳','开心也很累'],'作者参与和感受'),
    detail('l14_t4_detail_03','她最喜欢什么节目？','Tā zuì xǐhuan shénme jiémù?','她最喜欢留学生们跳舞。','Tā zuì xǐhuan liúxuéshēngmen tiàowǔ.',['留学生跳舞','留学生们跳舞'],'最喜欢的节目'),
    detail('l14_t4_detail_04','老师和校长最后怎么样了？','Lǎoshī hé xiàozhǎng zuìhòu zěnmeyàng le?','他们被叫起来一块儿跳。','Tāmen bèi jiào qǐlai yíkuàir tiào.',['被叫起来跳舞','和大家一块儿跳'],'被动参与活动'),
    detail('l14_t4_detail_05','白家月过几天打算怎样再看一次晚会？','Bái Jiāyuè guò jǐ tiān dǎsuàn zěnyàng zài kàn yí cì wǎnhuì?','她打算在学校网站上看晚会视频。','Tā dǎsuàn zài xuéxiào wǎngzhàn shang kàn wǎnhuì shìpín.',['看学校网站的视频','在网站上看晚会视频'],'视频来源和后续计划')
  ],keyPoints:[],cultureDiscussion:{questions:['你的学校怎样记录和分享活动？','晚会中怎样尊重不同班级和学生的节目？'],wordCards:[{hanzi:'拍照片 / 录视频',pinyin:'pāi zhàopiàn / lù shìpín',english:'take photos / record video'},{hanzi:'学校网站',pinyin:'xuéxiào wǎngzhàn',english:'school website'},{hanzi:'认真观看',pinyin:'rènzhēn guānkàn',english:'watch attentively'}],sampleAnswers:[{hanzi:'我们学校会拍照片和录视频，然后放在学校网站上。',pinyin:'Wǒmen xuéxiào huì pāi zhàopiàn hé lù shìpín, ránhòu fàng zài xuéxiào wǎngzhàn shang.'},{hanzi:'观看节目时要保持安静，表演结束以后为同学鼓掌。',pinyin:'Guānkàn jiémù shí yào bǎochí ānjìng, biǎoyǎn jiéshù yǐhòu wèi tóngxué gǔzhǎng.'}],sourceType:'teaching_extension'},retellScaffold:{nodes:[{label:'新年晚会',hint:'昨天在学校举行'},{label:'时间',hint:'八点到十二点'},{label:'活动和感受',hint:'又唱又跳，开心也累'},{label:'最喜欢',hint:'留学生跳舞'},{label:'最后',hint:'老师和校长也被叫起来'},{label:'后续计划',hint:'去网站看视频'}],frame:'昨天……。晚会从……到……。我跟大家……，觉得……。我最喜欢……。最后……。过几天……。'},languageAndApplication:{grammarIds:['g14_01'],personalPrompt:'按“事件—过程—感受—最喜欢的内容—后续计划”回顾一次校园活动。',paragraphPracticeId:'l14_para_04',miniId:'T4'},sourceType:'teaching_extension'}
};
for (const note of Object.values(textTeachingNotes)) {
  const {id:overallQuestionId,...overallChoice} = note.overallChoices[0];
  note.overallChoice = {...overallChoice,questionId:overallQuestionId};
  note.classQuestions = note.details.map(({id:questionId,...question})=>({...question,questionId}));
}

const sessions = [
  {id:'A',title:'第一次课：图书馆帮忙',textIds:['t_hsk3_l14_01'],previewMissionId:'pm_hsk3_l14_a',communicativeGoal:'请求同学帮助还书、借书，并用被动句说明书已被借走。',requiredVocabulary:['词典','最好','图书馆','被'],receptiveVocabulary:['节','名人','故事'],grammarIds:['g14_01'],classOutput:'30—45秒图书馆帮忙对话；形成校园帮忙卡。',preparation:'完成A五阶段预习。',homework:'完成Homework A并保存Library Help Card。',bridgeToNext:'B在A的求助信息上增加校园行动顺序和备用办法。',sourceType:'teaching_extension'},
  {id:'B',title:'第二次课：校园计划与校园卡',textIds:['t_hsk3_l14_02'],previewMissionId:'pm_hsk3_l14_b',communicativeGoal:'安排校园行动顺序，处理校园卡问题并提出电子书等替代办法。',requiredVocabulary:['然后','忘记','电子书'],receptiveVocabulary:['报纸'],grammarIds:['g14_02','g14_01'],classOutput:'30—45秒下午行动计划；形成校园行动顺序卡。',preparation:'完成B五阶段预习并带A卡。',homework:'完成Homework B，在A材料上加入行动顺序和备用办法。',bridgeToNext:'C使用A/B材料支持晚会准备、鼓励和活动回顾。',sourceType:'teaching_extension'},
  {id:'C',title:'第三次课：校园晚会支持与回顾',textIds:['t_hsk3_l14_03','t_hsk3_l14_04'],previewMissionId:'pm_hsk3_l14_c',communicativeGoal:'鼓励准备表演的同学，并用日记式表达回顾学校晚会。',requiredVocabulary:['表演','节目','怎么办','相信','新年','最后','一块儿','网站','视频'],receptiveVocabulary:['女生','校长','面前','有些','班级','跳','留学生'],grammarIds:['g14_03','g14_01'],classOutput:'1—2分钟“校园晚会支持与回顾”小组展示。',preparation:'完成C五阶段预习，带A/B准备卡。',homework:'Homework C在课堂展示，不上传音频。',bridgeToNext:'为后续公共“用”机制保留四篇课文的稳定正式资源。',sourceType:'teaching_extension'}
];

const q = (id,question,options,correctIndex=0) => ({id,question,options,correctIndex,answer:options[correctIndex],sourceType:'teaching_extension'});
const makeMission = (session,title,wordIds,contextQuestions,challengeQuestions) => ({
  id:`pm_hsk3_l14_${session.toLowerCase()}`,session,title,storyRole:'You are helping with real campus tasks.',missionEn:title,
  persistenceKeyPattern:`HSK3-L14_${session}_{student}_v1`,
  reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],
  stages:[
    {id:`pre_l14_${session.toLowerCase()}_01`,order:1,title:'Meet the words',interactionType:'study_list',wordIds,sourceType:'teaching_extension'},
    {id:`pre_l14_${session.toLowerCase()}_02`,order:2,title:'Recognize meaning',interactionType:'practice_quiz',questions:contextQuestions.slice(0,4),sourceType:'teaching_extension'},
    {id:`pre_l14_${session.toLowerCase()}_03`,order:3,title:'Chinese–English match',interactionType:'timed_match',pairs:wordIds.map(id=>{const item=vocabulary.find(v=>v.id===id);return {id:`${id}_pair_${session}`,left:item.hanzi,right:item.english};}),sourceType:'teaching_extension'},
    {id:`pre_l14_${session.toLowerCase()}_04`,order:4,title:'Use the context',interactionType:'practice_quiz',questions:contextQuestions.slice(4),sourceType:'teaching_extension'},
    {id:`pre_l14_${session.toLowerCase()}_05`,order:5,title:'Final challenge',interactionType:'ranked_quiz',questions:challengeQuestions,sourceType:'teaching_extension'}
  ],sourceType:'teaching_extension'
});

const previewMissions = [
  makeMission('A','Library Help Mission',['v14_01','v14_02','v14_04','v14_05','v14_06','v14_07'],[
    q('pre_l14_a_ctx_01','哪一个词表示借书和还书的地方？',['图书馆','网站','晚会']),q('pre_l14_a_ctx_02','哪一个词用来说明主语受到动作影响？',['被','最好','节']),q('pre_l14_a_ctx_03','“一本____”最自然。',['词典','校长','班级']),q('pre_l14_a_ctx_04','“____今天还”最自然。',['最好','最后','有些']),q('pre_l14_a_ctx_05','书已经被别人借走，可以怎么说？',['这本书被别人借走了。','这本书然后图书馆。','这本书一块儿网站。']),q('pre_l14_a_ctx_06','请同学帮忙时，哪一句最合适？',['你能帮我还书吗？','紧张什么啊？','晚会八点开始。'])
  ],Array.from({length:10},(_,i)=>q(`pre_l14_a_final_${String(i+1).padStart(2,'0')}`,['“词典”的意思是什么？','哪一句表示最合适的选择？','哪一句是被动句？','哪一个词表示很多人知道的人？','“两____课”填什么？','图书馆可以做什么？','书被借走以后可以怎么办？','请同学帮忙借书，哪一句自然？','《名人的故事》是什么？','哪一句最适合作为A课输出？'][i],[['解释词语的书或工具','学校晚会','一段视频'],['最好今天还','最后今天还','有些今天还'],['这本书被别人借走了','我先去图书馆','我们一块儿跳'],['名人','女生','校长'],['节','个','本'],['借书和还书','表演节目','看晚会视频'],['找电子书或问同学','不再看书','去跳舞'],['你能帮我借本书吗？','你被书借走了吗？','网站一块儿视频。'],['书名','班级名','网站名'],['说明书的问题并请求帮助','只说一个词','讨论别的课程']][i]))),
  makeMission('B','Campus Plan Mission',['v14_08','v14_09','v14_10','v14_11'],[
    q('pre_l14_b_ctx_01','“做完前一件事以后”是哪一个词？',['然后','最后','被']),q('pre_l14_b_ctx_02','在手机上看的书是什么？',['电子书','报纸','词典']),q('pre_l14_b_ctx_03','“没有记住”是哪一个词？',['忘记','相信','表演']),q('pre_l14_b_ctx_04','哪一种是纸质新闻读物？',['报纸','视频','网站']),q('pre_l14_b_ctx_05','哪一句有清楚的先后顺序？',['我先还书，然后去游泳。','我被然后游泳。','我一块儿校园卡。']),q('pre_l14_b_ctx_06','校园卡不见了，哪个办法合理？',['先上网看看有没有电子书','马上参加晚会','让校长跳舞'])
  ],Array.from({length:10},(_,i)=>q(`pre_l14_b_final_${String(i+1).padStart(2,'0')}`,['“然后”的作用是什么？','“报纸”的意思是什么？','“忘记”的意思是什么？','“电子书”在哪里看？','哪一句使用“先……然后……”？','校园卡可能在哪里？','进不去图书馆还有什么办法？','白家月为什么必须去？','哪一句复现被动句？','哪一句最适合作为B课输出？'][i],[['连接前后动作','表示一个地点','表示一种人物'],['纸质新闻读物','电子地图','晚会节目'],['没有记住','非常相信','一起表演'],['手机或电脑上','只在舞台上','只在报纸上'],['先借书，然后游泳','被借书，然后','一块儿忘记'],['可能在家里','一定在舞台','一定在网站'],['找电子书','不再学习','只等校长'],['要帮李文还书','要准备节目','要看视频'],['校园卡可能被我放在家里了','我先看报纸','然后去游泳'],['说出计划、问题和办法','只说“忘记”','介绍别的课文']][i]))),
  makeMission('C','School Party Support and Review',['v14_13','v14_14','v14_15','v14_19','v14_20','v14_24','v14_25','v14_26','v14_27'],[
    q('pre_l14_c_ctx_01','学校晚会上的一项内容是什么？',['节目','词典','报纸']),q('pre_l14_c_ctx_02','“觉得某人可靠”是哪一个词？',['相信','忘记','然后']),q('pre_l14_c_ctx_03','“一起”还可以怎么说？',['一块儿','面前','最后']),q('pre_l14_c_ctx_04','在哪里可以看晚会视频？',['学校网站','校园卡','词典']),q('pre_l14_c_ctx_05','朋友紧张时，哪一句是友好鼓励？',['紧张什么啊，我们都相信你。','紧张什么啊，你真不好。','你被紧张了。']),q('pre_l14_c_ctx_06','哪一句适合回顾晚会？',['最后大家一块儿跳舞。','然后一本词典。','报纸被节目。'])
  ],Array.from({length:10},(_,i)=>q(`pre_l14_c_final_${String(i+1).padStart(2,'0')}`,['“表演”的意思是什么？','“节目”是什么？','“怎么办”用来做什么？','“相信自己”是什么意思？','“新年晚会”是什么活动？','“最后”表示什么？','“一块儿”是什么意思？','“网站”是什么？','哪一句是友好的“×什么啊”？','哪一句最适合作为C课输出？'][i],[['在别人面前唱、跳或演','去图书馆还书','看电子书'],['演出中的一项内容','一张校园卡','一节课'],['询问解决办法','表示一个时间','说明一个地方'],['觉得自己可以做到','忘记自己的名字','去网站看报纸'],['新年开始时的学校活动','图书馆借书活动','游泳比赛'],['事情的末尾','事情的开始','一个地点'],['一起','一个人','以后'],['互联网上的一组页面','纸质报纸','一节课'],['紧张什么啊，我们都喜欢听你唱歌。','紧张什么啊，你不要说话。','你被紧张了。'],['鼓励同学并回顾晚会','只说网站和视频','讨论图书馆卡']][i])))
];

let roleCursor = 0;
const roleCycle = ['lesson','lesson','lesson','lesson','lesson','transfer','transfer','transfer','review','review'];
const tag = item => ({...item,stage:item.stage || 'in_class',contentRole:item.contentRole || roleCycle[roleCursor++ % roleCycle.length],sourceType:'teaching_extension'});
const sentence = (id,text,pinyin,answer) => ({id,sentence:text,sentence_pinyin:pinyin,answer,sourceType:'teaching_extension'});
const fillGroup = (id,prompt,words,sentences,speakingLevels) => tag({id,type:'vocab_fill_group',prompt_en:prompt,data:{wordBank:words,wordBank_pinyin:words.map(word=>byWord[word]?.pinyin || ''),sentences,speakingLevels}});
const matchGroup = (id,pairs) => tag({id,type:'question_answer_match',title:'问答匹配 / Question–Answer Match',prompt_cn:'把左侧完整问题和右侧完整回答配对，全部完成后一次提交。',prompt_en:'Match each complete question with its answer. Submit all five together.',data:{interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,pairs:pairs.map((pair,index)=>({id:`${id}_${index+1}`,left:pair[0],right:pair[1],sourceType:'teaching_extension'}))}});
const orderItem = (id,chunks,answer) => tag({id,type:'sentence_order',prompt_cn:'连词成句。',prompt_en:'Put the chunks in order.',correct_answer:answer,data:{chunks,answer}});
const choiceItem = (id,prompt,options,correctIndex=0) => tag({id,type:'choice',prompt_cn:prompt,prompt_en:'Choose the most natural answer.',correct_answer:options[correctIndex],data:{question_cn:prompt,options,correct_index:correctIndex,sourceType:'teaching_extension'}});
const guessItem = (id,description,answer,options) => tag({id,type:'description_guess',prompt_cn:description,prompt_en:'Guess the lesson word.',correct_answer:answer,data:{description,options}});
const openItem = (id,type,promptCn,promptEn,data) => tag({id,type,prompt_cn:promptCn,prompt_en:promptEn,openEnded:true,needsTeacherReview:true,data});
const readingItem = (id,title,passage,pinyin,qa) => tag({id,type:'passage_reading',prompt_cn:'阅读短文，完成三道理解题。',prompt_en:'Read the passage and answer three comprehension questions.',correct_answer:qa.map(item=>item[3][item[4]]).join('；'),data:{title,passage,passage_pinyin:pinyin,questions:qa.map((item,index)=>({id:`${id}_q${index+1}`,question_cn:item[0],question_pinyin:item[1],options:item[3],correct_index:item[4],answer:item[3][item[4]],focus:item[2],sourceType:'teaching_extension'})),sourceType:'teaching_extension'}});
const chainPinyin = {
  '最好今天还':'zuìhǎo jīntiān huán','两节课':'liǎng jié kè','图书馆':'túshūguǎn','被借走':'bèi jièzǒu','明天借给你':'míngtiān jiè gěi nǐ',
  '先去图书馆':'xiān qù túshūguǎn','中文报纸':'Zhōngwén bàozhǐ','校园卡不见':'xiàoyuánkǎ bú jiàn','电子书':'diànzǐshū','然后去游泳':'ránhòu qù yóuyǒng',
  '几个女生':'jǐ gè nǚshēng','表演节目':'biǎoyǎn jiémù','没有伙伴':'méiyǒu huǒbàn','有些紧张':'yǒuxiē jǐnzhāng','相信自己':'xiāngxìn zìjǐ',
  '每个班级':'měi gè bānjí','又唱又跳':'yòu chàng yòu tiào','留学生跳舞':'liúxuéshēng tiàowǔ','一块儿跳':'yíkuàir tiào','网站视频':'wǎngzhàn shìpín',
  '词典':'cídiǎn','校园卡':'xiàoyuánkǎ','晚会节目':'wǎnhuì jiémù','鼓励同学':'gǔlì tóngxué','活动回顾':'huódòng huígù'
};

const questionGroups = {
  v5_vocab_fill:[
    fillGroup('l14_fill_group_01','Complete the library-help contexts.',['词典','最好','图书馆','名人','故事'],[
      sentence('l14_fill_01_01','我借的这本____最好今天还。','Wǒ jiè de zhè běn ____ zuìhǎo jīntiān huán.','词典'),
      sentence('l14_fill_01_02','这本书____今天还。','Zhè běn shū ____ jīntiān huán.','最好'),
      sentence('l14_fill_01_03','下午我去____帮你还书。','Xiàwǔ wǒ qù ____ bāng nǐ huán shū.','图书馆'),
      sentence('l14_fill_01_04','这本书介绍了很多____。','Zhè běn shū jièshào le hěn duō ____.','名人'),
      sentence('l14_fill_01_05','我喜欢听这个____。','Wǒ xǐhuan tīng zhège ____.','故事')
    ],{support:'用词库完成一句。',core:'完成还书和借书表达。',challenge:'加入被动句说明问题。'}),
    fillGroup('l14_fill_group_02','Complete the campus-plan contexts.',['然后','报纸','忘记','电子书','被'],[
      sentence('l14_fill_02_01','我先去图书馆，____去游泳。','Wǒ xiān qù túshūguǎn, ____ qù yóuyǒng.','然后'),
      sentence('l14_fill_02_02','安妮想看中文____。','Ānnī xiǎng kàn Zhōngwén ____.','报纸'),
      sentence('l14_fill_02_03','我____校园卡放在哪儿了。','Wǒ ____ xiàoyuánkǎ fàng zài nǎr le.','忘记'),
      sentence('l14_fill_02_04','进不去图书馆，可以上网找____。','Jìn bu qù túshūguǎn, kěyǐ shàngwǎng zhǎo ____.','电子书'),
      sentence('l14_fill_02_05','校园卡可能____我放在家里了。','Xiàoyuánkǎ kěnéng ____ wǒ fàng zài jiā li le.','被')
    ],{support:'完成一个校园计划句。',core:'说明计划、问题和办法。',challenge:'同时使用顺序句和被动句。'}),
    fillGroup('l14_fill_group_03','Complete the school-party contexts.',['表演','节目','相信','最后','视频'],[
      sentence('l14_fill_03_01','几个女生要____一个节目。','Jǐ gè nǚshēng yào ____ yí gè jiémù.','表演'),
      sentence('l14_fill_03_02','你最喜欢哪个____？','Nǐ zuì xǐhuan nǎge ____?','节目'),
      sentence('l14_fill_03_03','别紧张，你要____自己。','Bié jǐnzhāng, nǐ yào ____ zìjǐ.','相信'),
      sentence('l14_fill_03_04','____老师和校长也上台了。','____ lǎoshī hé xiàozhǎng yě shàngtái le.','最后'),
      sentence('l14_fill_03_05','学校网站上会有晚会的____。','Xuéxiào wǎngzhàn shang huì yǒu wǎnhuì de ____.','视频')
    ],{support:'完成一个晚会句。',core:'说清节目、感受和结果。',challenge:'加入鼓励和晚会回顾。'})
  ],
  v7_word_match:[
    matchGroup('l14_match_01',[
      ['这本词典什么时候还？','最好今天还，不要超过借阅时间。'],
      ['你为什么不能自己去？','因为我今天没有时间去图书馆。'],
      ['白家月能帮什么忙？','她可以帮李文还书，也可以帮他借书。'],
      ['为什么李文一直没借到那本书？','因为那本书总是被别人借走。'],
      ['最后怎样解决？','白家月有那本书，明天可以借给李文。']
    ]),
    matchGroup('l14_match_02',[
      ['下课以后白家月先去哪儿？','她先去图书馆借书和还书。'],
      ['安妮想在图书馆看什么？','她想看看中文报纸。'],
      ['为什么白家月进不去？','因为她的校园卡不见了。'],
      ['没有校园卡还能怎样找书？','可以先上网看看有没有电子书。'],
      ['为什么她还是必须去？','因为她还得帮李文还书。']
    ]),
    matchGroup('l14_match_03',[
      ['白家月准备什么节目？','她和几个女生一起表演。'],
      ['李文为什么不知道怎么办？','因为他没找到一起表演的人。'],
      ['李文为什么紧张？','因为要在校长、老师和很多同学面前表演。'],
      ['白家月怎样安慰李文？','她说大家喜欢听他唱歌，让他相信自己。'],
      ['晚会以后怎样再看节目？','可以在学校网站上看晚会视频。']
    ])
  ],
  g1_ordering:[
    orderItem('l14_order_01',['这本书','被别人','借走了'],'这本书被别人借走了。'),
    orderItem('l14_order_02',['校园卡','可能被我','放在家里了'],'校园卡可能被我放在家里了。'),
    orderItem('l14_order_03',['我先去图书馆还书','然后','去游泳'],'我先去图书馆还书，然后去游泳。'),
    orderItem('l14_order_04',['你先休息一会儿','然后再','出来吃饭'],'你先休息一会儿，然后再出来吃饭。'),
    orderItem('l14_order_05',['紧张什么啊','我们都喜欢','听你唱歌'],'紧张什么啊，我们都喜欢听你唱歌。')
  ],
  scene_sentence_choice:[
    choiceItem('l14_scene_01','词典今天到期，哪一句最合适？',['这本词典最好今天还。','这本词典最后网站。','这本词典一块儿跳。']),
    choiceItem('l14_scene_02','想借的书没有了，哪一句说明原因？',['这本书被别人借走了。','这本书先去游泳。','这本书相信自己。']),
    choiceItem('l14_scene_03','下午有两个任务，哪一句顺序清楚？',['我先去图书馆，然后去游泳。','我被图书馆，然后游泳。','我一块儿忘记。']),
    choiceItem('l14_scene_04','校园卡不见了，哪一句是合理办法？',['先上网看看有没有电子书。','先去表演节目。','先让校长跳舞。']),
    choiceItem('l14_scene_05','同学没找到表演伙伴，哪一句合适？',['我们可以先一起练习。','这本书被借走了。','网站有中文报纸。']),
    choiceItem('l14_scene_06','同学上台前紧张，哪一句是友好鼓励？',['紧张什么啊，我们都相信你。','紧张什么啊，你真不好。','你被紧张了。']),
    choiceItem('l14_scene_07','晚会结束时，哪一句最自然？',['最后老师和校长也被叫起来一块儿跳。','最后词典去游泳。','最后报纸相信自己。']),
    choiceItem('l14_scene_08','想再看晚会，哪一句最合适？',['学校网站上会有晚会视频。','图书馆里有校长。','电子书被表演。']),
    choiceItem('l14_scene_09','复习邀请表达，哪一句自然？',['你有时间的话，就来参加晚会吧。','你被有时间参加晚会。','你一块儿什么啊。']),
    choiceItem('l14_scene_10','复习同时动作，哪一句自然？',['我们一边看节目，一边聊天儿。','我们先被节目。','我们然后什么啊。'])
  ],
  v6_description_guess:[
    guessItem('l14_guess_01','解释词语意思和用法的书或电子工具。','词典',['词典','报纸','视频','网站']),
    guessItem('l14_guess_02','借书、还书和看书的地方。','图书馆',['图书馆','班级','面前','晚会']),
    guessItem('l14_guess_03','很多人知道的人。','名人',['名人','女生','校长','留学生']),
    guessItem('l14_guess_04','做完前一件事以后。','然后',['然后','最后','最好','有些']),
    guessItem('l14_guess_05','在手机或电脑上看的书。','电子书',['电子书','报纸','词典','故事']),
    guessItem('l14_guess_06','在别人面前唱、跳或演。','表演',['表演','相信','忘记','被']),
    guessItem('l14_guess_07','晚会或演出中的一项内容。','节目',['节目','班级','网站','节']),
    guessItem('l14_guess_08','觉得某人或某事可靠、真实。','相信',['相信','忘记','表演','然后']),
    guessItem('l14_guess_09','在外国学习的学生。','留学生',['留学生','校长','名人','女生']),
    guessItem('l14_guess_10','互联网上可以访问的一组页面。','网站',['网站','视频','报纸','电子书'])
  ],
  v2_say_guess:[
    openItem('l14_say_01','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'校园餐厅里的词典和还书请求',boardIndex:1,clues:[],scaffold:{words:['词典','最好','节'],frames:['这是……。','它最好……。','同学可以……。']},task:'说明什么东西需要什么时候还。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_02','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'图书馆借阅状态',boardIndex:2,clues:[],scaffold:{words:['图书馆','被','故事'],frames:['这本书……。','它已经被……。']},task:'说明一本书为什么借不到。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_03','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'校园下午路线',boardIndex:3,clues:[],scaffold:{words:['然后','报纸'],frames:['先……，然后……。']},task:'说明两个校园动作的顺序。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_04','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'找不到校园卡',boardIndex:4,clues:[],scaffold:{words:['忘记','电子书'],frames:['我忘记……。','可以先……。']},task:'说明问题和一个替代办法。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_05','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'晚会节目讨论',boardIndex:5,clues:[],scaffold:{words:['女生','表演','节目'],frames:['几个人正在……。','她们准备……。']},task:'说明人物和节目。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_06','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'上台前的紧张和鼓励',boardIndex:6,clues:[],scaffold:{words:['面前','有些','相信'],frames:['他要在……。','……什么啊……。']},task:'说明担忧并给一句鼓励。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_07','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'新年晚会节目',boardIndex:7,clues:[],scaffold:{words:['新年','班级','留学生'],frames:['这是……。','最喜欢……。']},task:'说明活动和喜欢的节目。',answerPlaceholder:'写下你的中文提示。'}),
    openItem('l14_say_08','open_response','说一说、猜一猜。','Describe the covered scene without naming it.',{target:'学校网站上的晚会视频',boardIndex:8,clues:[],scaffold:{words:['最后','网站','视频'],frames:['最后……。','过几天……。']},task:'说明晚会结果和后续计划。',answerPlaceholder:'写下你的中文提示。'})
  ],
  v3_blind_box:[
    openItem('l14_blind_01','open_response','盲盒造句。','Make one natural sentence with both expressions.',{words:['词典','被借走'],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:'我想借的词典被别人借走了。',revealDecoration:'none',uniformWordSize:true}),
    openItem('l14_blind_02','open_response','盲盒造句。','Make one natural sentence with both expressions.',{words:['先','然后'],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:'我先去图书馆，然后去游泳。',revealDecoration:'none',uniformWordSize:true}),
    openItem('l14_blind_03','open_response','盲盒造句。','Make one natural sentence with both expressions.',{words:['有些紧张','相信自己'],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:'我有些紧张，但是我要相信自己。',revealDecoration:'none',uniformWordSize:true}),
    openItem('l14_blind_04','open_response','盲盒造句。','Make one natural sentence with both expressions.',{words:['学校网站','晚会视频'],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:'学校网站上会有晚会视频。',revealDecoration:'none',uniformWordSize:true})
  ],
  g2_picture_complete:[
    ['photo-text-1-library-help','词典、最好','说明什么东西需要什么时候还。'],
    ['photo-text-1-book-availability','被、故事','说明一本书发生了什么。'],
    ['photo-text-2-campus-plan','先、然后','说明两个校园动作的顺序。'],
    ['photo-text-2-missing-card','忘记、电子书','说明问题和替代办法。'],
    ['photo-text-3-party-plan','表演、节目','说明学生准备什么活动。'],
    ['photo-text-3-stage-encouragement','有些、相信','说明紧张并给出鼓励。'],
    ['photo-text-4-new-year-party','留学生、跳','说明最喜欢的节目。'],
    ['photo-text-4-school-video','最后、网站、视频','回顾晚会结果和后续计划。']
  ].map((row,index)=>openItem(`l14_picture_${String(index+1).padStart(2,'0')}`,'open_response','看图造句。','Use the keywords to write one complete sentence about the photo.',{image:img(row[0]),keyword:row[1],task:row[2],answerPlaceholder:'写一个完整的中文句子。'})),
  r2_passage_choice:[
    readingItem('l14_read_01','借不到的书','李文想借一本书，但是这本书又被别人借走了。白家月正好有这本书，答应明天借给他。','Lǐ Wén xiǎng jiè yì běn shū, dànshì zhè běn shū yòu bèi biérén jièzǒu le. Bái Jiāyuè zhènghǎo yǒu zhè běn shū, dāying míngtiān jiè gěi tā.',[
      ['李文遇到什么问题？','Lǐ Wén yùdào shénme wèntí?','问题',['书被别人借走了','校园卡不见了','晚会结束了'],0],
      ['谁有这本书？','Shéi yǒu zhè běn shū?','人物',['白家月','安妮','校长'],0],
      ['最后怎样解决？','Zuìhòu zěnyàng jiějué?','结果',['白家月明天借给他','李文不看书了','他们去游泳'],0]
    ]),
    readingItem('l14_read_02','下午的安排','白家月先去图书馆还书和借书，然后去游泳。校园卡不见了，她先找电子书，也请同学帮忙想办法。','Bái Jiāyuè xiān qù túshūguǎn huán shū hé jiè shū, ránhòu qù yóuyǒng. Xiàoyuánkǎ bú jiàn le, tā xiān zhǎo diànzǐshū, yě qǐng tóngxué bāngmáng xiǎng bànfǎ.',[
      ['她先去哪儿？','Tā xiān qù nǎr?','顺序',['图书馆','游泳馆','晚会'],0],
      ['什么不见了？','Shénme bú jiàn le?','问题',['校园卡','词典','节目单'],0],
      ['她先找什么替代资源？','Tā xiān zhǎo shénme tìdài zīyuán?','办法',['电子书','晚会视频','节目'],0]
    ]),
    readingItem('l14_read_03','上台以前','李文准备唱中文歌，但是没有表演伙伴。他想到要面对很多老师和同学，就有些紧张。朋友让他相信自己。','Lǐ Wén zhǔnbèi chàng Zhōngwén gē, dànshì méiyǒu biǎoyǎn huǒbàn. Tā xiǎngdào yào miànduì hěn duō lǎoshī hé tóngxué, jiù yǒuxiē jǐnzhāng. Péngyou ràng tā xiāngxìn zìjǐ.',[
      ['李文准备做什么？','Lǐ Wén zhǔnbèi zuò shénme?','节目',['唱中文歌','跳舞','看报纸'],0],
      ['他为什么紧张？','Tā wèishénme jǐnzhāng?','原因',['要面对很多观众','校园卡不见了','书被借走了'],0],
      ['朋友怎样帮助他？','Péngyou zěnyàng bāngzhù tā?','鼓励',['让他相信自己','替他还书','给他电子书'],0]
    ]),
    readingItem('l14_read_04','晚会以后','新年晚会结束以后，学校把节目视频放到网站上。学生可以先看视频，然后选择最喜欢的节目写一段回顾。','Xīnnián wǎnhuì jiéshù yǐhòu, xuéxiào bǎ jiémù shìpín fàng dào wǎngzhàn shang. Xuéshēng kěyǐ xiān kàn shìpín, ránhòu xuǎnzé zuì xǐhuan de jiémù xiě yí duàn huígù.',[
      ['视频放在哪里？','Shìpín fàng zài nǎli?','位置',['学校网站','图书馆','游泳馆'],0],
      ['学生先做什么？','Xuéshēng xiān zuò shénme?','顺序',['看视频','还词典','买报纸'],0],
      ['然后做什么？','Ránhòu zuò shénme?','任务',['写活动回顾','找校园卡','借名人故事'],0]
    ]),
    readingItem('l14_read_05','校园活动支持小组','小组先检查图书馆任务，然后帮助同学准备晚会。有人负责还书，有人帮助找节目伙伴，最后大家一块儿回顾活动。','Xiǎozǔ xiān jiǎnchá túshūguǎn rènwu, ránhòu bāngzhù tóngxué zhǔnbèi wǎnhuì. Yǒurén fùzé huán shū, yǒurén bāngzhù zhǎo jiémù huǒbàn, zuìhòu dàjiā yíkuàir huígù huódòng.',[
      ['小组先检查什么？','Xiǎozǔ xiān jiǎnchá shénme?','顺序',['图书馆任务','晚会视频','游泳计划'],0],
      ['他们还帮助准备什么？','Tāmen hái bāngzhù zhǔnbèi shénme?','活动',['晚会','电子书','报纸'],0],
      ['最后大家做什么？','Zuìhòu dàjiā zuò shénme?','结果',['一块儿回顾活动','一个人离开','不再交流'],0]
    ])
  ],
  r3_independent_reading:[
    choiceItem('l14_ind_read_01','学校图书馆通知：今天下午五点以前归还的书不会过期。小王四点半去还书。哪一句正确？',['小王按时还书','小王没有还书','图书馆四点关门']),
    choiceItem('l14_ind_read_02','小林先上课，然后去图书馆，最后参加排练。第二件事是什么？',['去图书馆','上课','参加排练']),
    choiceItem('l14_ind_read_03','小周找不到节目伙伴，朋友陪他练习，还告诉他要相信自己。朋友主要做什么？',['鼓励并帮助他','请他还书','让他回家']),
    choiceItem('l14_ind_read_04','晚会视频星期五上传到学校网站。学生星期六打开网站。学生能做什么？',['看晚会视频','借纸质报纸','进入图书馆']),
    choiceItem('l14_ind_read_05','大家都参加了班级节目，只有小李负责拍视频。小李主要做什么？',['记录活动','跳舞','借书'])
  ],
  r4_paragraph_fill:[
    ['l14_para_01','图书馆帮忙','李文借的____1____最好今天还。白家月可以帮他去____2____。他想借的书又____3____。',['电子书','词典','被别人借走了','节目','图书馆','一块儿跳'],[1,4,2]],
    ['l14_para_02','校园行动计划','白家月要____1____去图书馆，____2____去游泳。校园卡不见了，她可以先找____3____。',['最后','先','电子书','然后','新年','表演'],[1,3,2]],
    ['l14_para_03','晚会鼓励','李文想____1____中文歌，但是没有伙伴。他在很多人____2____有些紧张。白家月让他____3____自己。',['相信','表演','网站','面前','报纸','最后'],[1,3,0]],
    ['l14_para_04','新年晚会','每个____1____都有节目。留学生们____2____，老师和校长最后也被叫起来____3____跳。',['一块儿','班级','图书馆','跳舞','电子书','故事'],[1,3,0]],
    ['l14_para_05','校园活动回顾','我们先完成图书馆任务，____1____准备晚会。表演前大家互相____2____，活动结束后在网站看____3____。',['然后','忘记','相信','视频','词典','报纸'],[0,2,3]]
  ].map(row=>tag({id:row[0],type:'paragraph_fill',prompt_cn:row[1],prompt_en:'Choose three expressions to complete the paragraph.',data:{title:row[1],passageParts:[row[2]],options:row[3],answers:row[4],optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange'],sourceType:'teaching_extension'}})),
  t3_chain_sentence:[
    ['l14_chain_01','图书馆求助','我今天要还词典。',['最好今天还','两节课','图书馆','被借走','明天借给你']],
    ['l14_chain_02','校园下午计划','今天下课很早。',['先去图书馆','中文报纸','校园卡不见','电子书','然后去游泳']],
    ['l14_chain_03','晚会节目','下周学校有晚会。',['几个女生','表演节目','没有伙伴','有些紧张','相信自己']],
    ['l14_chain_04','新年晚会日记','昨天是学校的新年晚会。',['每个班级','又唱又跳','留学生跳舞','一块儿跳','网站视频']],
    ['l14_chain_05','校园支持小组','我们先检查今天的任务。',['词典','校园卡','晚会节目','鼓励同学','活动回顾']]
  ].map(row=>openItem(row[0],'open_response','五词故事接龙。','Build one connected story.',{title:row[1],starter:row[2],keywords:row[3],keywords_pinyin:row[3].map(word=>chainPinyin[word]),steps:row[3].map((word,index)=>`第${index+1}句使用“${word}”。`),chainModes:['teacher','race','team'],answerPlaceholder:'用当前词语继续故事。',sourceType:'teaching_extension'})),
  t2_task_card:[
    ['l14_task_01','图书馆帮忙','需要帮助的学生',['词典','最好','图书馆','被'],['说明什么书要还','请求同学帮忙','说明书被借走','接受一个解决办法'],'完成30—45秒图书馆帮忙对话。'],
    ['l14_task_02','校园行动顺序','安排下午任务的学生',['然后','报纸','忘记','电子书'],['说出两个校园任务','使用先……然后……','说明校园卡问题','提出替代办法'],'完成30—45秒下午行动计划。'],
    ['l14_task_03','晚会鼓励对话','准备上台的学生和朋友',['表演','节目','怎么办','相信'],['说明准备的节目','表达一个担忧','使用“×什么啊”安慰','补充理由和下一步'],'完成一轮担忧—安慰对话。'],
    ['l14_task_04','新年晚会回顾','日记分享者',['新年','最后','一块儿','网站','视频'],['说明晚会时间','说活动和感受','介绍最喜欢的节目','使用被动句','说明视频计划'],'完成45—60秒日记式回顾。'],
    ['l14_task_05','校园晚会支持与回顾','校园活动支持小组',['词典','然后','表演','相信','视频'],['使用A的帮忙卡','使用B的顺序卡','鼓励表演同学','回顾活动并说明视频计划'],'完成1—2分钟小组展示。']
  ].map(row=>openItem(row[0],'open_response',`任务卡：${row[1]}。`,row[1],{title:row[1],role:row[2],keywords:row[3],steps:row[4],output:row[5],answerPlaceholder:'请记录课堂表达。',sourceType:'teaching_extension'})),
  pk_question:[
    choiceItem('l14_pk_01','这本书____别人借走了。',['被','先','然后','一块儿']),
    choiceItem('l14_pk_02','我____去图书馆，____去游泳。',['先；然后','被；最后','一块儿；被','有些；最好']),
    choiceItem('l14_pk_03','同学上台前很紧张，哪一句最合适？',['紧张什么啊，我们都相信你。','你被紧张了。','最后一本词典。','然后网站视频。'])
  ],
  info_match:[
    tag({id:'l14_info_01',type:'info_match',prompt_cn:'把人物和任务配对。',prompt_en:'Match each person with the task.',data:{pairs:[['李文','请求帮忙还书和借书'],['白家月','帮李文完成图书馆任务'],['安妮','提出电子书办法']],sourceType:'teaching_extension'}}),
    tag({id:'l14_info_02',type:'info_match',prompt_cn:'把活动和结果配对。',prompt_en:'Match each activity with the result.',data:{pairs:[['图书馆任务','书被借走或需要归还'],['晚会表演','同学需要准备和鼓励'],['学校网站','以后可以看晚会视频']],sourceType:'teaching_extension'}})
  ],
  textQa:[],
  pictureTalk:[]
};

questionGroups.battleGames = {
  roulette:[
    {id:'l14_game_roulette_01',prompt:'用“被”说明一本书发生了什么。'},
    {id:'l14_game_roulette_02',prompt:'用“先……然后……”说下课后的计划。'},
    {id:'l14_game_roulette_03',prompt:'请同学帮你还书。'},
    {id:'l14_game_roulette_04',prompt:'校园卡不见了，提出一个办法。'},
    {id:'l14_game_roulette_05',prompt:'用“×什么啊”鼓励准备表演的同学。'},
    {id:'l14_game_roulette_06',prompt:'介绍一个晚会节目。'},
    {id:'l14_game_roulette_07',prompt:'回顾晚会中最喜欢的内容。'},
    {id:'l14_game_roulette_08',prompt:'说明以后在哪里看晚会视频。'}
  ],
  relay:[
    {id:'l14_game_relay_01',starter:'我先去图书馆……',keywords:['然后','报纸','电子书']},
    {id:'l14_game_relay_02',starter:'下周学校有晚会……',keywords:['表演','节目','相信']},
    {id:'l14_game_relay_03',starter:'昨天是新年晚会……',keywords:['班级','留学生','最后']},
    {id:'l14_game_relay_04',starter:'我们是校园支持小组……',keywords:['词典','校园卡','鼓励','视频']}
  ],
  monopoly:{theme:'light',boardShape:'winding',tasks:[
    ...['读出一个L14词语','说一个被动句','说两步校园计划','提出一个借书请求','说明校园卡问题','说一个电子书办法','介绍一个晚会节目','鼓励一位同学','说“×什么啊”并补理由','回顾最喜欢的节目','使用“一块儿”造句','说明网站和视频的关系','复述课文1','复述课文2','复述课文3','复述课文4'].map((prompt,index)=>({id:`l14_game_monopoly_${String(index+1).padStart(2,'0')}`,type:['vocabulary','grammar','text','task'][index%4],prompt}))
  ]},
  sourceType:'teaching_extension'
};

const preClass = {
  mode:'preview_mission',missionId:'pm_hsk3_l14_a',vocabularyIds:vocabulary.map(item=>item.id),grammarIds:grammar.map(item=>item.id),
  progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L14-v1'},
  reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],
  readingData:[{id:'pre_l14_read',title:'校园活动支持小组',text:'我先完成图书馆任务，然后帮助同学准备晚会。活动结束以后，我会回顾最喜欢的节目，并在学校网站上看视频。',sourceType:'teaching_extension'}]
};

const sessionTests = [
  {id:'l14_test_a',session:'A',title:'Test A · 图书馆帮忙',focus:['课文1','被动句（1）','图书馆求助'],questionIds:['l14_order_01','l14_scene_01','l14_scene_02','l14_guess_01','l14_guess_02','l14_ind_read_01','l14_pk_01'],audioRequired:false,sourceType:'teaching_extension'},
  {id:'l14_test_b',session:'B',title:'Test B · 校园行动顺序',focus:['课文2','先……再/然后……','校园卡问题'],questionIds:['l14_order_03','l14_order_04','l14_scene_03','l14_scene_04','l14_guess_04','l14_guess_05','l14_ind_read_02'],audioRequired:false,sourceType:'teaching_extension'},
  {id:'l14_test_c',session:'C',title:'Test C · 晚会支持与回顾',focus:['课文3—4','×什么（啊）','日记理解','综合表达'],questionIds:['l14_order_05','l14_scene_05','l14_scene_06','l14_scene_07','l14_scene_08','l14_guess_06','l14_guess_07','l14_guess_08','l14_guess_09','l14_guess_10','l14_ind_read_03','l14_ind_read_04','l14_ind_read_05'],audioRequired:false,sourceType:'teaching_extension'}
];

const scaffold = (support,core,challenge) => [
  {label:'基础层 / Support',instruction:support},
  {label:'标准层 / Core',instruction:core},
  {label:'挑战层 / Challenge',instruction:challenge}
];
const postClassHomework = {
  mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,
  instructions:{required:'完成当次校园活动准备卡；A和B保存的材料必须用于C。',optional:'不需要上传录音；只带自制卡片或隐私安全图片。',aiPolicy:'先独立选择真实或合理的信息，再使用工具检查语言。'},
  sessionMeta:{A:{title:'Library Help Card',carryTo:'B、C',sourceType:'teaching_extension'},B:{title:'Campus Plan Card',carryTo:'C',sourceType:'teaching_extension'},C:{title:'校园晚会支持与回顾',presentation:'1—2分钟课堂展示',sourceType:'teaching_extension'}},
  sessions:{
    A:[
      {id:'post_l14_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'校园支持 1/3 · 确定图书馆问题',required:true,prompt_cn:'选择一本真实或虚构的书：什么时候要还？你需要别人帮什么忙？',prompt_en:'Choose a real or fictional book. When must it be returned, and what help do you need?',answerPlaceholder:'这本……最好……。我需要……。',needsTeacherReview:true,openEnded:true,sourceType:'teaching_extension'},
      {id:'post_l14_a_plan',type:'project_card',taskLabel:'Library Help Card',projectStage:'校园支持 1/3 · 保存到最终展示',required:true,prompt_cn:'完成一张图书馆帮忙卡：说明书、时间、问题、请求和解决办法。至少使用“词典、最好、图书馆、被”中的三个词和一个被动句。',prompt_en:'Create a Library Help Card with the book, deadline, problem, request and solution. Use three target words and one passive sentence.',answerPlaceholder:'这本……最好……。它被……。你能帮我……吗？',needsTeacherReview:true,openEnded:true,wordBank:['词典','最好','图书馆','被'],requiredStructures:['被动句（1）'],picturePrompts:['一张自制书卡','一张图书馆任务卡'],scaffoldLevels:scaffold('按句框完成4句。','独立说明问题、请求和办法。','加入施事省略或“可能/经常 + 被”。'),sourceType:'teaching_extension'},
      {id:'post_l14_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Library Help Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Library Help Card',prompt_en:'Bring your self-made Library Help Card.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one self-made book card and Library Help Card.','Be ready to answer: What book? When must it be returned? What happened? What help do you need?','Use at least three L14 words and one passive sentence.','Partners may check language, but every student must speak. No audio upload is required.'],classroomNote:'保留这张卡；Homework B要加入行动顺序和备用办法。',sourceType:'teaching_extension'}
    ],
    B:[
      {id:'post_l14_b_observe',type:'reflection_prompt',taskLabel:'行动检查',projectStage:'校园支持 2/3 · 安排顺序',required:true,prompt_cn:'承接A的图书馆任务：你先做什么，然后做什么？如果校园卡不见了，有什么办法？',prompt_en:'Continue from Homework A. What will you do first and then, and what can you do if the campus card is missing?',answerPlaceholder:'我先……，然后……。如果……，可以……。',needsTeacherReview:true,openEnded:true,carryFrom:[{session:'A',taskId:'post_l14_a_plan',use:'继续使用同一本书和同一个图书馆任务。'}],sourceType:'teaching_extension'},
      {id:'post_l14_b_plan',type:'project_card',taskLabel:'Campus Plan Card',projectStage:'校园支持 2/3 · 保存到最终展示',required:true,prompt_cn:'写一个两步校园计划和一个备用办法。使用“然后、忘记、电子书”以及“先……再/然后……”。',prompt_en:'Write a two-step campus plan and one backup solution. Use 然后, 忘记, 电子书 and 先……再/然后…….',answerPlaceholder:'我先……，然后……。我忘记……，所以可以先……。',needsTeacherReview:true,openEnded:true,wordBank:['然后','报纸','忘记','电子书'],requiredStructures:['先……再/然后……'],picturePrompts:['A的Library Help Card','一张自制校园路线卡'],carryFrom:[{session:'A',taskId:'post_l14_a_plan',use:'把A的还书或借书任务放进第一步。'}],scaffoldLevels:scaffold('按两步句框完成3句。','独立说明顺序、问题和备用办法。','同时使用顺序句和被动句。'),sourceType:'teaching_extension'},
      {id:'post_l14_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Campus Plan Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Campus Plan Card',prompt_en:'Bring Homework A and your Campus Plan Card.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring Homework A and your two-step Campus Plan Card.','Be ready to answer: What first? What next? What problem may occur? What backup solution will you use?','Use at least three L14 words and one complete 先……再/然后…… sentence.','Groups may compare routes, but every student must explain one plan. No audio upload is required.'],classroomNote:'保留A和B；Homework C要用它们支持校园晚会任务。',sourceType:'teaching_extension'}
    ],
    C:[
      {id:'post_l14_c_outline',type:'reflection_prompt',taskLabel:'整合提纲',projectStage:'校园支持 3/3 · 连接A/B材料',required:true,prompt_cn:'把A的图书馆帮忙、B的行动顺序和C的晚会鼓励、活动回顾连接成六个要点。',prompt_en:'Combine the A library help, B campus plan, and C performance support and event review into six points.',answerPlaceholder:'1. 书…… 2. 请求…… 3. 顺序…… 4. 表演…… 5. 鼓励…… 6. 回顾……',needsTeacherReview:true,openEnded:true,carryFrom:[{session:'A',taskId:'post_l14_a_plan',use:'书、问题、请求和办法。'},{session:'B',taskId:'post_l14_b_plan',use:'行动顺序和备用办法。'}],sourceType:'teaching_extension'},
      {id:'post_l14_c_project',type:'project_card',taskLabel:'校园晚会支持与回顾',projectStage:'校园支持 3/3 · 完成最终作品',required:true,prompt_cn:'准备1—2分钟课堂展示：说明校园资源任务和行动顺序，鼓励准备表演的同学，再用日记式表达回顾晚会。至少使用8个L14词和三个本课结构。',prompt_en:'Prepare a 1–2 minute in-class presentation: explain the campus resource task and action order, encourage a performer, and give a diary-style review of the party. Use at least eight L14 words and all three lesson structures.',answerPlaceholder:'这本……被……。我们先……，然后……。紧张什么啊……。昨天的晚会……。',needsTeacherReview:true,openEnded:true,minimumLessonWords:8,requiredStructures:['被动句（1）','先……再/然后……','×什么（啊）'],picturePrompts:['A的Library Help Card','B的Campus Plan Card','一张隐私安全的校园晚会图片或节目卡'],carryFrom:[{session:'A',taskId:'post_l14_a_plan',use:'第一部分校园资源问题。'},{session:'B',taskId:'post_l14_b_plan',use:'第二部分行动顺序和备用办法。'}],scaffoldLevels:scaffold('按六部分句框准备，每部分1句话。','独立完成1—2分钟连贯展示。','加入同伴提问和临时问题，现场协商解决。'),sourceType:'teaching_extension'},
      {id:'post_l14_c_present',type:'showcase_plan',taskLabel:'课堂展示',projectStage:'最终课堂作品 · 1—2 minutes',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: Campus Party Support and Review',prompt_en:'Give a 1–2 minute in-class presentation or exchange. No audio upload is required.',presentationTitle:'Presentation Checklist',presentationPlan:['Bring the A Library Help Card, B Campus Plan Card and one privacy-safe campus-party image or program card.','Answer six points: resource problem, request, action order, performance concern, encouragement, and event review.','Use at least eight L14 words plus one passive sentence, one 先……再/然后…… sentence and one suitable ×什么啊 expression.','Groups may share visual materials, but every student must speak for a meaningful turn. Present for 1–2 minutes. No audio upload is required.'],classroomNote:'错题和薄弱点默认折叠，学生选择后再展开。',carryFrom:[{session:'A',taskId:'post_l14_a_plan',use:'图书馆帮忙材料。'},{session:'B',taskId:'post_l14_b_plan',use:'校园行动顺序材料。'}],sourceType:'teaching_extension'}
    ]
  }
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L14',lessonKey,title:'这本书被别人借走了',titleEn:'This book is checked out',topic:'校园图书馆任务、校园行动顺序、同伴鼓励和新年晚会回顾',courseModel:'三次课：图书馆帮忙 → 校园计划与问题解决 → 校园晚会支持与回顾',sourceTextPolicy:'教材中文、拼音、正式词汇英文释义、语法说明与教材例句以L14.txt为准；中文简释、教学标题、问题、场景、任务、练习、游戏和作业均为教学扩展；课文四未提供英文译文，不补写。',sourceAuthority:[sourceRef],missingResources:{audio:['14-1.mp3','14-3.mp3','14-5.mp3','14-7.mp3'],textbookImages:true,textbookExercises:true}},
  pedagogy:{exerciseMix:{lessonTargetPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'每位学生必须有有效发言；Homework C以课堂展示为主，不要求上传录音。',cultureFactPolicy:'校园活动表达允许多元答案，不把单一学校做法设为唯一标准答案。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions,
  usePreparation:{status:'active_shared_profile',configurationCreated:true,profile:'pilot-v1',formalResourcePlan:[
    {id:'T1',textId:'t_hsk3_l14_01',vocabularySession:'1',grammarId:'g14_01',practiceId:'l14_task_01'},
    {id:'T2',textId:'t_hsk3_l14_02',vocabularySession:'2',grammarId:'g14_02',practiceId:'l14_task_02'},
    {id:'T3',textId:'t_hsk3_l14_03',vocabularySession:'3',grammarId:'g14_03',practiceId:'l14_task_03'},
    {id:'T4',textId:'t_hsk3_l14_04',vocabularySession:'4',grammarId:'g14_01',practiceId:'l14_task_04'}
  ],sourceType:'teaching_extension'},
  vocabScenes,
  vocabulary,
  grammar,
  texts,
  grammarTeachingNotes,
  textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(item=>[item.id,{session:item.tags[0],tier:item.tier,meaningCn:item.meaningCn,phrases:item.phrases,sourceType:'teaching_extension',sourceRef}])),
  previewMissions,
  preClass,
  inClass:{questionGroups,sessionTests},
  postClassHomework,
  report:{focus:['图书馆还书与借书','被动句（1）','校园行动顺序','先……再/然后……','学校晚会与同伴鼓励','×什么（啊）的语气与使用场合','新年晚会日记','校园晚会支持与回顾'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应A/B/C五阶段预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'使用A的帮忙卡和B的顺序卡重新完成一次1分钟校园晚会支持与回顾。'}]}
};

fs.mkdirSync(path.dirname(out), {recursive:true});
fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log(`Built ${path.relative(root,out)}`);
console.log(`Words: ${vocabulary.length}; grammar: ${grammar.length}; texts: ${texts.length}; previews: ${previewMissions.length}`);
