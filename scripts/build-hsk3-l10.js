const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L10.json');
const img = name => 'images/hsk3-l10/' + name + (/\.[a-z0-9]+$/i.test(name) ? '' : '.png');
const roleFor = (index, total) => index < Math.floor(total * 0.5) ? 'lesson' : index < Math.floor(total * 0.8) ? 'transfer' : 'review';

const vocabRows = [
  ['数学','shùxué','名词','mathematics; maths','A','我每天认真复习数学。','Wǒ měitiān rènzhēn fùxí shùxué.',['数学课','数学考试']],
  ['认真','rènzhēn','形容词','conscientious; serious','A','上课要认真听老师讲。','Shàngkè yào rènzhēn tīng lǎoshī jiǎng.',['认真听课','认真复习']],
  ['笔记','bǐjì','名词','notes','A','我把重点记在笔记里。','Wǒ bǎ zhòngdiǎn jì zài bǐjì li.',['记笔记','复习笔记']],
  ['清楚','qīngchu','形容词/动词','clear; know clearly','A','她的笔记写得很清楚。','Tā de bǐjì xiě de hěn qīngchu.',['看清楚','记得清楚']],
  ['黑板','hēibǎn','名词','blackboard','A','老师把例句写在黑板上。','Lǎoshī bǎ lìjù xiě zài hēibǎn shang.',['擦黑板','黑板上的题']],
  ['把','bǎ','介词','marks a handled object','A','请把名字写在本子上。','Qǐng bǎ míngzi xiě zài běnzi shang.',['把书放在桌上','把笔记给同学']],
  ['作业','zuòyè','名词','homework','A','写作业以前，我先看一遍笔记。','Xiě zuòyè yǐqián, wǒ xiān kàn yí biàn bǐjì.',['写作业','外语作业']],
  ['遍','biàn','量词','once through; time','A','这篇课文我读了两遍。','Zhè piān kèwén wǒ dúle liǎng biàn.',['看一遍','再讲一遍']],
  ['提高','tígāo','动词','improve; raise','A','好习惯能帮助我提高成绩。','Hǎo xíguàn néng bāngzhù wǒ tígāo chéngjì.',['提高成绩','提高水平']],
  ['历史','lìshǐ','名词','history','B','我觉得这次历史考试有点儿难。','Wǒ juéde zhè cì lìshǐ kǎoshì yǒudiǎnr nán.',['历史课','中国历史']],
  ['难','nán','形容词','hard; difficult','B','这道题不太难。','Zhè dào tí bú tài nán.',['有点儿难','一点儿也不难']],
  ['要求','yāoqiú','名词/动词','requirement; require','B','考试以前要先看清楚要求。','Kǎoshì yǐqián yào xiān kàn qīngchu yāoqiú.',['考试要求','按要求完成']],
  ['差','chà','形容词','poor; be short of','B','他这次考得比较差。','Tā zhè cì kǎo de bǐjiào chà.',['成绩差','差一点儿']],
  ['复习','fùxí','动词','review','B','明天考试，我们先复习外语吧。','Míngtiān kǎoshì, wǒmen xiān fùxí wàiyǔ ba.',['复习功课','认真复习']],
  ['外语','wàiyǔ','名词','foreign language','B','外语作业里有两个问题。','Wàiyǔ zuòyè li yǒu liǎng gè wèntí.',['外语课','学习外语']],
  ['当然','dāngrán','副词','certainly; of course','B','你有问题当然可以问我。','Nǐ yǒu wèntí dāngrán kěyǐ wèn wǒ.',['当然可以','当然知道']],
  ['遇到','yùdào','动词','encounter; meet','B','学习上遇到问题要及时问。','Xuéxí shang yùdào wèntí yào jíshí wèn.',['遇到问题','遇到老师']],
  ['办公室','bàngōngshì','名词','office','B','我们去办公室问李老师。','Wǒmen qù bàngōngshì wèn Lǐ lǎoshī.',['老师办公室','去办公室']],
  ['页','yè','量词','page','C','请打开书上第五页。','Qǐng dǎkāi shū shang dì-wǔ yè.',['第五页','一页书']],
  ['对话','duìhuà','名词/动词','dialogue; converse','C','这个对话我看不懂。','Zhège duìhuà wǒ kàn bu dǒng.',['读对话','完成对话']],
  ['明白','míngbai','动词/形容词','understand; clear','C','老师再讲一遍，我就明白了。','Lǎoshī zài jiǎng yí biàn, wǒ jiù míngbai le.',['听明白','说明白']],
  ['讲','jiǎng','动词','explain; speak','C','老师给我们讲这几个句子。','Lǎoshī gěi wǒmen jiǎng zhè jǐ gè jùzi.',['讲一遍','讲问题']],
  ['句','jù','量词','measure word for sentences','C','请用这个词说一句话。','Qǐng yòng zhège cí shuō yí jù huà.',['一句话','几句话']],
  ['句子','jùzi','名词','sentence','C','这些句子一点儿也不难。','Zhèxiē jùzi yìdiǎnr yě bù nán.',['写句子','三个句子']],
  ['年级','niánjí','名词','grade; year level','C','刘小雪现在上初中二年级。','Liú Xiǎoxuě xiànzài shàng chūzhōng èr niánjí.',['二年级','高年级']],
  ['后年','hòunián','名词','the year after next','C','她后年要考高中。','Tā hòunián yào kǎo gāozhōng.',['后年毕业','明年和后年']],
  ['一般','yìbān','形容词/副词','general; generally','C','中国的小学一般是六年。','Zhōngguó de xiǎoxué yìbān shì liù nián.',['一般来说','一般情况']],
  ['努力','nǔlì','形容词/动词','hard-working; make an effort','C','为了实现目标，她现在非常努力。','Wèile shíxiàn mùbiāo, tā xiànzài fēicháng nǔlì.',['努力学习','非常努力']]
];

const vocabulary = vocabRows.map((row, index) => ({
  id:'v10_' + String(index + 1).padStart(2, '0'),
  hanzi:row[0],pinyin:row[1],pos:row[2],english:row[3],tags:[row[4]],
  example:row[5],examplePinyin:row[6],phrases:row[7],sourceType:'textbook'
}));
const word = hanzi => vocabulary.find(item => item.hanzi === hanzi);
const card = hanzi => { const item = word(hanzi); return {hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,example:item.example,examplePinyin:item.examplePinyin}; };
const extension = (hanzi,pinyin,english,phrases,example,examplePinyin) => ({hanzi,pinyin,english,phrases,example,examplePinyin,sourceType:'teaching_extension'});

const texts = [
  {id:'t_hsk3_l10_01',textId:1,title:'认真记笔记',setting:'在教室里，刘小雪跟同学聊学习方法。',audio:'../../audio/HSK3/10-1.mp3',lines:[
    {speaker:'同学',hanzi:'你的数学越来越好，能不能介绍一下学习方法？',pinyin:'Nǐ de shùxué yuèláiyuè hǎo, néng bu néng jièshào yíxià xuéxí fāngfǎ?',english:'Your mathematics is getting better and better. Can you share your study methods?'},
    {speaker:'刘小雪',hanzi:'没有什么特别的方法，认真听课，认真记笔记。',pinyin:'Méiyǒu shénme tèbié de fāngfǎ, rènzhēn tīng kè, rènzhēn jì bǐjì.',english:'There is no special method: listen carefully and take notes carefully.'},
    {speaker:'同学',hanzi:'我看过你的笔记，记得非常清楚。',pinyin:'Wǒ kànguo nǐ de bǐjì, jì de fēicháng qīngchu.',english:'I have seen your notes; they are very clear.'},
    {speaker:'刘小雪',hanzi:'老师写在黑板上的题都很重要，所以我都会把这些题都记在本子上。',pinyin:'Lǎoshī xiě zài hēibǎn shang de tí dōu hěn zhòngyào, suǒyǐ wǒ dōu huì bǎ zhèxiē tí dōu jì zài běnzi shang.',english:'The questions the teacher writes on the board are important, so I copy them into my notebook.'},
    {speaker:'同学',hanzi:'你说得对。我没有记笔记的习惯。',pinyin:'Nǐ shuō de duì. Wǒ méiyǒu jì bǐjì de xíguàn.',english:'You are right. I do not have the habit of taking notes.'},
    {speaker:'刘小雪',hanzi:'笔记挺重要的，我每天写作业以前，都要看一遍。',pinyin:'Bǐjì tǐng zhòngyào de, wǒ měitiān xiě zuòyè yǐqián, dōu yào kàn yí biàn.',english:'Notes are quite important. I read them once before doing homework every day.'},
    {speaker:'同学',hanzi:'这个方法真好！我以后也试试，希望能提高成绩。',pinyin:'Zhège fāngfǎ zhēn hǎo! Wǒ yǐhòu yě shìshi, xīwàng néng tígāo chéngjì.',english:'That is a great method. I will try it and hope to improve my grades.'}
  ]},
  {id:'t_hsk3_l10_02',textId:2,title:'先复习外语吧',setting:'在教室里，刘小雪跟同学聊昨天的考试。',audio:'../../audio/HSK3/10-3.mp3',lines:[
    {speaker:'同学',hanzi:'小雪，昨天的考试，你考得怎么样？',pinyin:'Xiǎoxuě, zuótiān de kǎoshì, nǐ kǎo de zěnmeyàng?',english:'Xiaoxue, how did you do in yesterday’s exam?'},
    {speaker:'刘小雪',hanzi:'我觉得历史有点儿难，你呢？',pinyin:'Wǒ juéde lìshǐ yǒudiǎnr nán, nǐ ne?',english:'I thought history was a little difficult. What about you?'},
    {speaker:'同学',hanzi:'数学考试我没看清楚要求，做错了好几个题，考得挺差的。',pinyin:'Shùxué kǎoshì wǒ méi kàn qīngchu yāoqiú, zuòcuò le hǎo jǐ gè tí, kǎo de tǐng chà de.',english:'I did not read the maths instructions clearly, got several questions wrong and did rather poorly.'},
    {speaker:'刘小雪',hanzi:'明天还有考试呢，别想那么多了，先复习外语吧。',pinyin:'Míngtiān hái yǒu kǎoshì ne, bié xiǎng nàme duō le, xiān fùxí wàiyǔ ba.',english:'There is another exam tomorrow. Do not dwell on it; let us review the foreign language first.'},
    {speaker:'同学',hanzi:'外语作业里有几个问题，我可以问问你吗？',pinyin:'Wàiyǔ zuòyè li yǒu jǐ gè wèntí, wǒ kěyǐ wènwen nǐ ma?',english:'There are several questions in the foreign-language homework. May I ask you about them?'},
    {speaker:'刘小雪',hanzi:'当然可以。在学习上，遇到什么问题都可以问我。',pinyin:'Dāngrán kěyǐ. Zài xuéxí shang, yùdào shénme wèntí dōu kěyǐ wèn wǒ.',english:'Of course. You can ask me whenever you encounter a problem in your studies.'},
    {speaker:'刘小雪',hanzi:'不好意思，这几个题我也不会。咱们还是一起去办公室问问李老师吧。',pinyin:'Bù hǎoyìsi, zhè jǐ gè tí wǒ yě bú huì. Zánmen háishì yìqǐ qù bàngōngshì wènwen Lǐ lǎoshī ba.',english:'Sorry, I cannot do these questions either. Let us go to the office and ask Teacher Li.'}
  ]},
  {id:'t_hsk3_l10_03',textId:3,title:'明天再把书还给我',setting:'在李老师办公室，刘小雪跟同学问问题。',audio:'../../audio/HSK3/10-5.mp3',editorialNote:'教材中文“我看重”与拼音 kàn bu dǒng、英文 don’t understand 矛盾；教材附注明确实际应为“我看不懂”。',lines:[
    {speaker:'同学',hanzi:'李老师，书上有几个问题，我们想问问您。',pinyin:'Lǐ lǎoshī, shū shang yǒu jǐ gè wèntí, wǒmen xiǎng wènwen nín.',english:'Teacher Li, there are several questions in the book that we would like to ask you about.'},
    {speaker:'李老师',hanzi:'好，坐下说吧，哪个题不会？',pinyin:'Hǎo, zuòxia shuō ba, nǎge tí bú huì?',english:'All right, sit down. Which question do you not understand?'},
    {speaker:'同学',hanzi:'书上第五页的这个对话我看不懂，小雪也不明白。',pinyin:'Shū shang dì-wǔ yè de zhège duìhuà wǒ kàn bu dǒng, Xiǎoxuě yě bù míngbai.',english:'I do not understand the dialogue on page five, and Xiaoxue does not understand it either.'},
    {speaker:'李老师',hanzi:'我课上讲过这几句话，再给你们讲一遍。',pinyin:'Wǒ kè shang jiǎngguo zhè jǐ jù huà, zài gěi nǐmen jiǎng yí biàn.',english:'I explained these sentences in class; let me explain them once more.'},
    {speaker:'旁白',hanzi:'李老师给学生讲题。',pinyin:'Lǐ lǎoshī gěi xuésheng jiǎng tí.',english:'Teacher Li explains the questions to the students.',sourceType:'stage_direction'},
    {speaker:'同学',hanzi:'我终于懂了。这些句子一点儿也不难。',pinyin:'Wǒ zhōngyú dǒng le. Zhèxiē jùzi yìdiǎnr yě bù nán.',english:'I finally understand. These sentences are not difficult at all.'},
    {speaker:'刘小雪',hanzi:'我也明白了，谢谢您，李老师。',pinyin:'Wǒ yě míngbai le, xièxie nín, Lǐ lǎoshī.',english:'I understand too. Thank you, Teacher Li.'},
    {speaker:'李老师',hanzi:'我这本书上还有几个练习，你们回家也做一做，明天再把书还给我。',pinyin:'Wǒ zhè běn shū shang hái yǒu jǐ gè liànxí, nǐmen huí jiā yě zuò yi zuò, míngtiān zài bǎ shū huán gěi wǒ.',english:'There are more exercises in my book. Do them at home and return the book to me tomorrow.'}
  ]},
  {id:'t_hsk3_l10_04',textId:4,title:'学习越来越忙',format:'email',genre:'邮件',genreEn:'Email',author:'刘小雪',recipient:'家月姐姐',setting:'在家里，刘小雪在写邮件。',audio:'../../audio/HSK3/10-7.mp3',translationPolicy:'中文和拼音为教材原文；英文译文和教育体系说明为教学辅助。',lines:[
    {speaker:'刘小雪',hanzi:'家月姐姐：',pinyin:'Jiāyuè jiějie:',english:'Dear Jiayue,'},
    {speaker:'刘小雪',hanzi:'你最近怎么样？忙不忙？',pinyin:'Nǐ zuìjìn zěnmeyàng? Máng bu máng?',english:'How have you been recently? Are you busy?'},
    {speaker:'刘小雪',hanzi:'我现在上初中二年级，学习越来越忙，后年就要考高中了。中国的学校一般是小学六年，初中三年，高中三年。妈妈说想考上好大学，就得上一个好高中；为了考上好高中，初中就得有一个不错的成绩，所以我现在非常努力。',pinyin:'Wǒ xiànzài shàng chūzhōng èr niánjí, xuéxí yuèláiyuè máng, hòunián jiù yào kǎo gāozhōng le. Zhōngguó de xuéxiào yìbān shì xiǎoxué liù nián, chūzhōng sān nián, gāozhōng sān nián. Māma shuō xiǎng kǎoshang hǎo dàxué, jiù děi shàng yí gè hǎo gāozhōng; wèile kǎoshang hǎo gāozhōng, chūzhōng jiù děi yǒu yí gè búcuò de chéngjì, suǒyǐ wǒ xiànzài fēicháng nǔlì.',english:'I am now in the second year of junior middle school. Study is getting busier, and the year after next I will take the senior high school entrance exam. Schools in China generally have six years of primary school, three years of junior middle school and three years of senior high school. Mum says that to enter a good university, I need to attend a good senior high school; to enter a good senior high school, I need good grades in junior middle school, so I am working very hard now.'},
    {speaker:'刘小雪',hanzi:'家月姐姐，你知道吗？在你的影响下，我也开始喜欢拍照了。下次你再来北京，我给你看看我照的照片。',pinyin:'Jiāyuè jiějie, nǐ zhīdào ma? Zài nǐ de yǐngxiǎng xià, wǒ yě kāishǐ xǐhuan pāizhào le. Xià cì nǐ zài lái Běijīng, wǒ gěi nǐ kànkan wǒ zhào de zhàopiàn.',english:'Jiayue, did you know? Under your influence, I have also started to enjoy taking photos. Next time you come to Beijing, I will show you the photos I have taken.'}
  ]}
];

const grammar = [
  {id:'g10_01',title:'“把”字句（1）：位置改变',titleEn:'把 sentences (1): change of location',scene:'Identify a specific object, then say where an action moves or places it.',structure:'主语 +（不 / 没 / 能愿动词）+ 把 + 宾语 + 动词 + 在 / 到 + 地点',explanation:'“把”前置确定的宾语，后面说明动作让它的位置发生变化；否定词和能愿动词放在“把”前。',examples:[
    {hanzi:'我会把这些题都记在本子上。',pinyin:'Wǒ huì bǎ zhèxiē tí dōu jì zài běnzi shang.',english:'I will write all these questions in my notebook.'},
    {hanzi:'老师把作业本放到桌子上了。',pinyin:'Lǎoshī bǎ zuòyèběn fàng dào zhuōzi shang le.',english:'The teacher put the homework books on the desk.'},
    {hanzi:'你能不能把名字写在这里？',pinyin:'Nǐ néng bu néng bǎ míngzi xiě zài zhèli?',english:'Can you write your name here?'},
    {hanzi:'我没把手机放在书包里。',pinyin:'Wǒ méi bǎ shǒujī fàng zài shūbāo li.',english:'I did not put my phone in the schoolbag.'},
    {hanzi:'请把椅子搬到教室后面。',pinyin:'Qǐng bǎ yǐzi bān dào jiàoshì hòumian.',english:'Please move the chair to the back of the classroom.'},
    {hanzi:'别把答案写在黑板上。',pinyin:'Bié bǎ dá’àn xiě zài hēibǎn shang.',english:'Do not write the answer on the board.'}
  ]},
  {id:'g10_02',title:'固定格式“在……上 / 中 / 下”',titleEn:'The patterns 在…上 / 中 / 下',scene:'Choose 上 for a field or aspect, 中 for an environment or period, and 下 for a condition or influence.',structure:'在 + 名词 + 上 / 中；在 + 定语 + 双音节动词 + 下',explanation:'“在……上”表示范围或方面，“在……中”表示环境或时间，“在……下”表示条件或影响。',examples:[
    {hanzi:'在学习上，遇到什么问题都可以问我。',pinyin:'Zài xuéxí shang, yùdào shénme wèntí dōu kěyǐ wèn wǒ.',english:'In your studies, you can ask me whenever you encounter a problem.'},
    {hanzi:'在工作上，他总是能给我很多帮助。',pinyin:'Zài gōngzuò shang, tā zǒngshì néng gěi wǒ hěn duō bāngzhù.',english:'At work, he can always give me a lot of help.'},
    {hanzi:'在比赛中，他得分最高。',pinyin:'Zài bǐsài zhōng, tā défēn zuì gāo.',english:'He scored the highest in the competition.'},
    {hanzi:'在假期中，我认识了几个新朋友。',pinyin:'Zài jiàqī zhōng, wǒ rènshile jǐ gè xīn péngyou.',english:'During the holiday, I met several new friends.'},
    {hanzi:'在她的影响下，我开始喜欢拍照。',pinyin:'Zài tā de yǐngxiǎng xià, wǒ kāishǐ xǐhuan pāizhào.',english:'Under her influence, I started to enjoy photography.'},
    {hanzi:'在老师的帮助下，我的成绩提高很快。',pinyin:'Zài lǎoshī de bāngzhù xià, wǒ de chéngjì tígāo hěn kuài.',english:'With the teacher’s help, my grades improved quickly.'}
  ]},
  {id:'g10_03',title:'“把”字句（2）：关系转移',titleEn:'把 sentences (2): transfer to a recipient',scene:'Say who transfers a specific object to whom.',structure:'主语 + 把 + 宾语₁ + 动词 + 给 + 宾语₂',explanation:'这个结构表示通过动作让确定的事物转移到另一个人那里。常见动词有还、送、带、交。',examples:[
    {hanzi:'你明天再把书还给我。',pinyin:'Nǐ míngtiān zài bǎ shū huán gěi wǒ.',english:'Return the book to me tomorrow.'},
    {hanzi:'请你把这本报纸带给老师。',pinyin:'Qǐng nǐ bǎ zhè běn bàozhǐ dài gěi lǎoshī.',english:'Please take this newspaper to the teacher.'},
    {hanzi:'我把礼物送给她了。',pinyin:'Wǒ bǎ lǐwù sòng gěi tā le.',english:'I gave the gift to her.'},
    {hanzi:'下课以后，我把作业交给老师。',pinyin:'Xiàkè yǐhòu, wǒ bǎ zuòyè jiāo gěi lǎoshī.',english:'After class, I hand my homework to the teacher.'},
    {hanzi:'他还没把照片发给我。',pinyin:'Tā hái méi bǎ zhàopiàn fā gěi wǒ.',english:'He has not sent the photo to me yet.'},
    {hanzi:'能不能把你的笔记借给我看一遍？',pinyin:'Néng bu néng bǎ nǐ de bǐjì jiè gěi wǒ kàn yí biàn?',english:'Could you lend me your notes to read once?'}
  ]}
];

const grammarTeachingNotes = {
  g10_01:{scene:'先观察五个完整句子：句中的物品经过动作以后，位置发生了什么变化？',structure:'主语 +（不 / 没 / 能愿动词）+ 把 + 宾语 + 动词 + 在 / 到 + 地点',structureEn:'subject + modal/negation + 把 + object + action + location',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'先找“把”后面的物品，再找表示新位置的“在 / 到”短语。',observeHighlights:[['把','记在'],['把','放到'],['能不能','把','写在'],['没','把','放在'],['把','搬到']],visualLearning:{leadExamples:[
    {english:'The object is specific: these questions.',hanzi:'这些题',pinyin:'zhèxiē tí'},
    {english:'The action changes their recorded location.',hanzi:'记在本子上',pinyin:'jì zài běnzi shang'},
    {english:'Put the handled object before the action.',hanzi:'我会把这些题都记在本子上。',pinyin:'Wǒ huì bǎ zhèxiē tí dōu jì zài běnzi shang.'}
  ],blocks:['主语 + 会','把 + 确定宾语','动作 + 在 / 到 + 地点'],blockLabelsEn:['subject and modal','handled object','action and new location']},oralQuestions:[
    {question:'你把每天的作业写在哪里？',pinyin:'Nǐ bǎ měitiān de zuòyè xiě zài nǎli?'},{question:'老师把重点写在哪里？',pinyin:'Lǎoshī bǎ zhòngdiǎn xiě zài nǎli?'},{question:'你能把这把椅子搬到哪里？',pinyin:'Nǐ néng bǎ zhè bǎ yǐzi bān dào nǎli?'},{question:'你没把什么放进书包？',pinyin:'Nǐ méi bǎ shénme fàng jìn shūbāo?'}
  ],structureVariants:[
    {label:'肯定',formula:'把 + 宾语 + 动词 + 在 / 到 + 地点',formulaEn:'Move or place the object',explanation:'说明物品经过动作后的具体位置。',example:'我把笔记放在桌子上。',examplePinyin:'Wǒ bǎ bǐjì fàng zài zhuōzi shang.'},
    {label:'否定或能愿',formula:'没 / 不 / 能愿动词 + 把……',formulaEn:'Negation or modal comes before 把',explanation:'“没、不、能、会、应该”等放在“把”的前面。',example:'我没把书放在办公室。',examplePinyin:'Wǒ méi bǎ shū fàng zài bàngōngshì.'}
  ],followUp:[{image:img('photo-text-1-note-taking'),promptEn:'Xiaoxue copies the questions from the board into her notebook.',target:'用“把”说明题从黑板信息变成了本子上的笔记。',sampleAnswer:'她把黑板上的题记在本子上。'}]},
  g10_02:{scene:'Compare problems in a field, events in an environment, and changes under an influence.',structure:'在……上 / 中 / 下',structureEn:'in an aspect / within an environment / under a condition',presentationMode:'progressive_grammar',observeMode:'structure_rows',observePrompt:'比较“上、中、下”前面的名词，判断它们分别表示方面、环境还是条件。',observeHighlights:[['在学习上'],['在工作上'],['在比赛中'],['在假期中'],['在她的影响下']],visualLearning:{leadExamples:[
    {english:'Aspect: in one’s studies',hanzi:'在学习上',pinyin:'zài xuéxí shang'},
    {english:'Environment: during an exam',hanzi:'在考试中',pinyin:'zài kǎoshì zhōng'},
    {english:'Condition: with the teacher’s help',hanzi:'在老师的帮助下',pinyin:'zài lǎoshī de bāngzhù xià'}
  ],blocks:['在 + 范围 + 上','在 + 环境 / 时间 + 中','在 + 条件 / 影响 + 下'],blockLabelsEn:['aspect','environment or period','condition or influence']},oralQuestions:[
    {question:'在学习上，你最近遇到了什么问题？',pinyin:'Zài xuéxí shang, nǐ zuìjìn yùdàole shénme wèntí?'},{question:'在考试中，你最需要注意什么？',pinyin:'Zài kǎoshì zhōng, nǐ zuì xūyào zhùyì shénme?'},{question:'在谁的帮助下，你进步得更快？',pinyin:'Zài shéi de bāngzhù xià, nǐ jìnbù de gèng kuài?'},{question:'在假期中，你学到了什么？',pinyin:'Zài jiàqī zhōng, nǐ xuédàole shénme?'}
  ],structureVariants:[
    {label:'范围或方面',formula:'在 + 名词 + 上',formulaEn:'in the area of',explanation:'说明谈论的范围或方面。',example:'在学习上，我会先整理问题。',examplePinyin:'Zài xuéxí shang, wǒ huì xiān zhěnglǐ wèntí.'},
    {label:'环境或时间',formula:'在 + 名词 + 中',formulaEn:'during or within',explanation:'说明动作发生的环境或时间。',example:'在考试中，要先看清楚要求。',examplePinyin:'Zài kǎoshì zhōng, yào xiān kàn qīngchu yāoqiú.'},
    {label:'条件或影响',formula:'在 + 定语 + 双音节动词 + 下',formulaEn:'under the influence/help/condition of',explanation:'说明变化发生的条件。',example:'在同学的影响下，我开始记笔记。',examplePinyin:'Zài tóngxué de yǐngxiǎng xià, wǒ kāishǐ jì bǐjì.'}
  ],followUp:[{image:img('photo-text-2-ask-for-help'),promptEn:'Two students organize their questions with help from a classmate before visiting the teacher.',target:'分别用“在学习上”和“在……帮助下”表达。',sampleAnswer:'在学习上遇到问题时，在同学的帮助下我们先整理问题。'}]},
  g10_03:{scene:'先观察五个完整句子：什么物品通过什么动作转移给了谁？',structure:'主语 + 把 + 物品 + 动词 + 给 + 接收者',structureEn:'subject + 把 + item + transfer verb + 给 + recipient',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'先找“把”后的物品，再找“给”后的接收者，并比较还、带、送、交、发。',observeHighlights:[['把','还给'],['把','带给'],['把','送给'],['把','交给'],['没','把','发给']],visualLearning:{leadExamples:[
    {english:'The item is specific: the book.',hanzi:'这本书',pinyin:'zhè běn shū'},
    {english:'The transfer returns it to Teacher Li.',hanzi:'还给李老师',pinyin:'huán gěi Lǐ lǎoshī'},
    {english:'Put the item before the transfer action.',hanzi:'明天把书还给李老师。',pinyin:'Míngtiān bǎ shū huán gěi Lǐ lǎoshī.'}
  ],blocks:['主语','把 + 确定物品','还 / 送 / 带 / 交 + 给 + 接收者'],blockLabelsEn:['giver','specific item','transfer action and recipient']},oralQuestions:[
    {question:'你什么时候把借的书还给同学？',pinyin:'Nǐ shénme shíhou bǎ jiè de shū huán gěi tóngxué?'},{question:'你想把什么礼物送给谁？',pinyin:'Nǐ xiǎng bǎ shénme lǐwù sòng gěi shéi?'},{question:'下课以后，你把作业交给谁？',pinyin:'Xiàkè yǐhòu, nǐ bǎ zuòyè jiāo gěi shéi?'},{question:'能把你的学习方法介绍给大家吗？',pinyin:'Néng bǎ nǐ de xuéxí fāngfǎ jièshào gěi dàjiā ma?'}
  ],structureVariants:[
    {label:'归还',formula:'把 + 物品 + 还给 + 原来的人',formulaEn:'return an item to its owner',explanation:'“还给”强调物品回到原来的人那里。',example:'我明天把书还给老师。',examplePinyin:'Wǒ míngtiān bǎ shū huán gěi lǎoshī.'},
    {label:'传递',formula:'把 + 物品 + 送 / 带 / 交给 + 接收者',formulaEn:'send, take or hand an item to someone',explanation:'动词表示不同的转移方式。',example:'请把这张学习卡交给同学。',examplePinyin:'Qǐng bǎ zhè zhāng xuéxí kǎ jiāo gěi tóngxué.'}
  ],followUp:[{image:img('photo-text-3-return-book'),promptEn:'A student returns a borrowed book to the teacher.',target:'用“把……还给……”说明物品和接收者。',sampleAnswer:'学生把借的书还给李老师。'}]}
};

const qa = rows => rows.map(row => ({question:row[0],question_pinyin:row[1],answer:row[2],answer_pinyin:row[3]}));
const textTeachingNotes = {
  t_hsk3_l10_01:{presentationMode:'listen_first_progressive',listenPrompt:'先听同学为什么问学习方法、刘小雪怎样记笔记，以及她什么时候复习笔记。',preReadingQuestions:[{question:'你的数学学习方法是什么？',pinyin:'Nǐ de shùxué xuéxí fāngfǎ shì shénme?'},{question:'你一般把课堂重点记在哪里？',pinyin:'Nǐ yìbān bǎ kètáng zhòngdiǎn jì zài nǎli?'}],classQuestions:qa([
    ['同学为什么问刘小雪学习方法？','Tóngxué wèishénme wèn Liú Xiǎoxuě xuéxí fāngfǎ?','因为她的数学越来越好。','Yīnwèi tā de shùxué yuèláiyuè hǎo.'],
    ['刘小雪说自己的方法是什么？','Liú Xiǎoxuě shuō zìjǐ de fāngfǎ shì shénme?','认真听课，认真记笔记。','Rènzhēn tīng kè, rènzhēn jì bǐjì.'],
    ['她把哪些题记在本子上？','Tā bǎ nǎxiē tí jì zài běnzi shang?','老师写在黑板上的重要题。','Lǎoshī xiě zài hēibǎn shang de zhòngyào tí.'],
    ['她什么时候看一遍笔记？','Tā shénme shíhou kàn yí biàn bǐjì?','每天写作业以前。','Měitiān xiě zuòyè yǐqián.'],
    ['同学决定以后怎么做？','Tóngxué juédìng yǐhòu zěnme zuò?','试试这个方法，希望提高成绩。','Shìshi zhège fāngfǎ, xīwàng tígāo chéngjì.']
  ]),keyPoints:[{hanzi:'把这些题都记在本子上',pinyin:'Bǎ zhèxiē tí dōu jì zài běnzi shang.',note:'“把”前置确定的题，后面说明记录的位置。'},{hanzi:'写作业以前，都要看一遍',pinyin:'Xiě zuòyè yǐqián, dōu yào kàn yí biàn.',note:'“遍”计算从头到尾完整进行的次数。'}],cultureDiscussion:{title:'怎样做有效笔记？',titleEn:'What Makes Notes Useful?',questions:[{hanzi:'清楚的笔记应该有什么？',pinyin:'Qīngchu de bǐjì yīnggāi yǒu shénme?'},{hanzi:'你什么时候复习笔记最有效？',pinyin:'Nǐ shénme shíhou fùxí bǐjì zuì yǒuxiào?'}],wordCards:[{hanzi:'重点',pinyin:'zhòngdiǎn',english:'key point'},{hanzi:'例子',pinyin:'lìzi',english:'example'},{hanzi:'整理',pinyin:'zhěnglǐ',english:'organize'}],background:'课堂笔记可以记录重点、例子和自己的问题。学生应选择适合自己的方法，并说明具体做法。',sampleAnswers:[{hanzi:'我把重点写在左边，把问题写在右边。',pinyin:'Wǒ bǎ zhòngdiǎn xiě zài zuǒbian, bǎ wèntí xiě zài yòubian.'},{hanzi:'写作业以前，我先把当天的笔记看一遍。',pinyin:'Xiě zuòyè yǐqián, wǒ xiān bǎ dàngtiān de bǐjì kàn yí biàn.'}]},retellScaffold:{nodes:[{label:'变化',hint:'数学越来越好'},{label:'方法',hint:'认真听、记笔记'},{label:'内容',hint:'黑板上的重要题'},{label:'复习',hint:'作业以前看一遍'},{label:'结果',hint:'试试、提高成绩'}],frame:'同学发现刘小雪的……，所以问……。刘小雪说要……。她把……记在……，每天……以前……。同学决定……。'}},
  t_hsk3_l10_02:{presentationMode:'listen_first_progressive',listenPrompt:'先听两个人怎样评价考试、数学为什么考得差，以及遇到不会的问题准备找谁。',preReadingQuestions:[{question:'考试以后，你会先看分数还是先找原因？',pinyin:'Kǎoshì yǐhòu, nǐ huì xiān kàn fēnshù háishi xiān zhǎo yuányīn?'},{question:'学习上遇到问题时，你会问谁？',pinyin:'Xuéxí shang yùdào wèntí shí, nǐ huì wèn shéi?'}],classQuestions:qa([
    ['刘小雪觉得哪门考试有点儿难？','Liú Xiǎoxuě juéde nǎ mén kǎoshì yǒudiǎnr nán?','历史考试。','Lìshǐ kǎoshì.'],
    ['同学的数学为什么考得挺差？','Tóngxué de shùxué wèishénme kǎo de tǐng chà?','因为没看清楚要求，做错了好几个题。','Yīnwèi méi kàn qīngchu yāoqiú, zuòcuòle hǎo jǐ gè tí.'],
    ['明天还有什么考试？','Míngtiān hái yǒu shénme kǎoshì?','外语考试。','Wàiyǔ kǎoshì.'],
    ['刘小雪在学习上愿意怎样帮助同学？','Liú Xiǎoxuě zài xuéxí shang yuànyì zěnyàng bāngzhù tóngxué?','遇到什么问题都可以问她。','Yùdào shénme wèntí dōu kěyǐ wèn tā.'],
    ['两个人最后为什么去办公室？','Liǎng gè rén zuìhòu wèishénme qù bàngōngshì?','几个题都不会，要问李老师。','Jǐ gè tí dōu bú huì, yào wèn Lǐ lǎoshī.']
  ]),keyPoints:[{hanzi:'没看清楚要求',pinyin:'Méi kàn qīngchu yāoqiú.',note:'复盘时把原因说具体，才能提出可行办法。'},{hanzi:'在学习上，遇到什么问题都可以问我',pinyin:'Zài xuéxí shang, yùdào shénme wèntí dōu kěyǐ wèn wǒ.',note:'“在学习上”限定谈论的方面。'}],cultureDiscussion:{title:'考后复盘和求助',titleEn:'Reflecting After an Exam and Asking for Help',questions:[{hanzi:'一道题做错以后，可以怎样复盘？',pinyin:'Yí dào tí zuòcuò yǐhòu, kěyǐ zěnyàng fùpán?'},{hanzi:'问老师以前，应该准备哪些信息？',pinyin:'Wèn lǎoshī yǐqián, yīnggāi zhǔnbèi nǎxiē xìnxī?'}],wordCards:[{hanzi:'原因',pinyin:'yuányīn',english:'cause'},{hanzi:'错题',pinyin:'cuòtí',english:'incorrect question'},{hanzi:'求助',pinyin:'qiúzhù',english:'ask for help'}],background:'有效求助要说明页码、题号、已经尝试的方法和不明白的地方。',sampleAnswers:[{hanzi:'我先看清楚要求，再检查自己为什么做错。',pinyin:'Wǒ xiān kàn qīngchu yāoqiú, zài jiǎnchá zìjǐ wèishénme zuòcuò.'},{hanzi:'在学习上遇到不会的题，我先问同学，再问老师。',pinyin:'Zài xuéxí shang yùdào bú huì de tí, wǒ xiān wèn tóngxué, zài wèn lǎoshī.'}]},retellScaffold:{nodes:[{label:'考试',hint:'历史有点儿难'},{label:'原因',hint:'没看清要求、做错题'},{label:'下一步',hint:'先复习外语'},{label:'求助',hint:'作业有问题'},{label:'决定',hint:'办公室、李老师'}],frame:'昨天考试以后，刘小雪觉得……。同学因为……，数学考得……。明天还有……，他们先……。最后因为……，两个人决定……。'}},
  t_hsk3_l10_03:{presentationMode:'listen_first_progressive',listenPrompt:'先听学生不明白哪一页、李老师怎样帮助，以及书最后要还给谁。',preReadingQuestions:[{question:'问老师问题时，怎样说得更清楚？',pinyin:'Wèn lǎoshī wèntí shí, zěnyàng shuō de gèng qīngchu?'},{question:'借老师的书以后，应该记住什么？',pinyin:'Jiè lǎoshī de shū yǐhòu, yīnggāi jìzhù shénme?'}],classQuestions:qa([
    ['学生想问李老师什么？','Xuésheng xiǎng wèn Lǐ lǎoshī shénme?','书上的几个问题。','Shū shang de jǐ gè wèntí.'],
    ['他们看不懂哪一页的什么内容？','Tāmen kàn bu dǒng nǎ yí yè de shénme nèiróng?','第五页的对话。','Dì-wǔ yè de duìhuà.'],
    ['李老师怎样帮助他们？','Lǐ lǎoshī zěnyàng bāngzhù tāmen?','把课上讲过的几句话再讲一遍。','Bǎ kè shang jiǎngguo de jǐ jù huà zài jiǎng yí biàn.'],
    ['老师讲完以后，学生觉得句子怎么样？','Lǎoshī jiǎngwán yǐhòu, xuésheng juéde jùzi zěnmeyàng?','一点儿也不难。','Yìdiǎnr yě bù nán.'],
    ['他们什么时候把书还给李老师？','Tāmen shénme shíhou bǎ shū huán gěi Lǐ lǎoshī?','明天。','Míngtiān.']
  ]),keyPoints:[{hanzi:'再给你们讲一遍',pinyin:'Zài gěi nǐmen jiǎng yí biàn.',note:'“遍”强调完整地重新讲一次。'},{hanzi:'明天再把书还给我',pinyin:'Míngtiān zài bǎ shū huán gěi wǒ.',note:'“把……还给……”表示物品回到原来的持有人。'}],cultureDiscussion:{title:'怎样高效地问老师？',titleEn:'How Can We Ask a Teacher Efficiently?',questions:[{hanzi:'问问题时，页码和题号为什么重要？',pinyin:'Wèn wèntí shí, yèmǎ hé tíhào wèishénme zhòngyào?'},{hanzi:'老师讲完以后，可以怎样确认自己明白了？',pinyin:'Lǎoshī jiǎngwán yǐhòu, kěyǐ zěnyàng quèrèn zìjǐ míngbai le?'}],wordCards:[{hanzi:'页码',pinyin:'yèmǎ',english:'page number'},{hanzi:'题号',pinyin:'tíhào',english:'question number'},{hanzi:'自己的话',pinyin:'zìjǐ de huà',english:'one’s own words'}],background:'清楚地说出教材位置和困难点，可以让老师更快理解问题。借用资料后要确认归还时间。',sampleAnswers:[{hanzi:'第五页的这个对话我看不懂，请您再讲一遍。',pinyin:'Dì-wǔ yè de zhège duìhuà wǒ kàn bu dǒng, qǐng nín zài jiǎng yí biàn.'},{hanzi:'我会先用自己的话说一遍，再确认是不是明白了。',pinyin:'Wǒ huì xiān yòng zìjǐ de huà shuō yí biàn, zài quèrèn shì bu shì míngbai le.'}]},retellScaffold:{nodes:[{label:'位置',hint:'第五页、对话'},{label:'困难',hint:'看不懂、不明白'},{label:'帮助',hint:'再讲一遍'},{label:'结果',hint:'终于懂了、不难'},{label:'归还',hint:'做练习、明天还书'}],frame:'学生到……问李老师。他们看不懂……。李老师把……再讲……。学生终于……。老师让他们回家……，明天……。'}},
  t_hsk3_l10_04:{presentationMode:'listen_first_progressive',listenPrompt:'先听或读邮件，找出刘小雪的年级、升学时间、教育阶段和她开始喜欢拍照的原因。',preReadingQuestions:[{question:'介绍自己的学习阶段时，你会说哪些信息？',pinyin:'Jièshào zìjǐ de xuéxí jiēduàn shí, nǐ huì shuō nǎxiē xìnxī?'},{question:'谁的影响让你开始喜欢一项活动？',pinyin:'Shéi de yǐngxiǎng ràng nǐ kāishǐ xǐhuan yí xiàng huódòng?'}],classQuestions:qa([
    ['刘小雪现在上几年级？','Liú Xiǎoxuě xiànzài shàng jǐ niánjí?','初中二年级。','Chūzhōng èr niánjí.'],
    ['她什么时候要考高中？','Tā shénme shíhou yào kǎo gāozhōng?','后年。','Hòunián.'],
    ['邮件怎样介绍中国学校的三个阶段？','Yóujiàn zěnyàng jièshào Zhōngguó xuéxiào de sān gè jiēduàn?','小学六年、初中三年、高中三年。','Xiǎoxué liù nián, chūzhōng sān nián, gāozhōng sān nián.'],
    ['刘小雪为什么现在非常努力？','Liú Xiǎoxuě wèishénme xiànzài fēicháng nǔlì?','为了考上好高中，将来考上好大学。','Wèile kǎoshang hǎo gāozhōng, jiānglái kǎoshang hǎo dàxué.'],
    ['她在谁的影响下喜欢上拍照？','Tā zài shéi de yǐngxiǎng xià xǐhuan shang pāizhào?','家月姐姐。','Jiāyuè jiějie.']
  ]),keyPoints:[{hanzi:'中国的学校一般是小学六年，初中三年，高中三年',pinyin:'Zhōngguó de xuéxiào yìbān shì xiǎoxué liù nián, chūzhōng sān nián, gāozhōng sān nián.',note:'这是教材中的一般性介绍；具体教育路径可能因地区和个人情况不同。'},{hanzi:'在你的影响下，我也开始喜欢拍照了',pinyin:'Zài nǐ de yǐngxiǎng xià, wǒ yě kāishǐ xǐhuan pāizhào le.',note:'“在……影响下”说明兴趣变化发生的条件。'}],cultureDiscussion:{title:'教育阶段与个人学习目标',titleEn:'School Stages and Personal Learning Goals',questions:[{hanzi:'你所在地区的学校阶段怎样安排？',pinyin:'Nǐ suǒzài dìqū de xuéxiào jiēduàn zěnyàng ānpái?'},{hanzi:'成绩以外，学习还可以有什么目标？',pinyin:'Chéngjì yǐwài, xuéxí hái kěyǐ yǒu shénme mùbiāo?'}],wordCards:[{hanzi:'小学',pinyin:'xiǎoxué',english:'primary school'},{hanzi:'初中',pinyin:'chūzhōng',english:'junior middle school'},{hanzi:'高中',pinyin:'gāozhōng',english:'senior high school'},{hanzi:'大学',pinyin:'dàxué',english:'university'}],background:'教材概括了中国常见的六年小学、三年初中、三年高中路径。课堂比较时尊重不同国家、地区和个人的教育选择。',sampleAnswers:[{hanzi:'我现在上……年级，明年要……。',pinyin:'Wǒ xiànzài shàng... niánjí, míngnián yào...'},{hanzi:'在朋友的影响下，我开始喜欢读历史书。',pinyin:'Zài péngyou de yǐngxiǎng xià, wǒ kāishǐ xǐhuan dú lìshǐ shū.'}]},retellScaffold:{nodes:[{label:'问候',hint:'最近、忙不忙'},{label:'年级',hint:'初中二年级'},{label:'路径',hint:'小学、初中、高中'},{label:'目标',hint:'好高中、好大学、努力'},{label:'影响',hint:'家月、拍照、照片'}],frame:'刘小雪写邮件问……。她现在上……，后年……。她介绍中国学校一般……。为了……，她……。在家月姐姐的影响下，她……。'} }
};

const sceneData = {
  1:{title:'认真记笔记',subtitle:'从课堂记录到作业前复习，观察清楚笔记怎样帮助学习。',steps:[
    {title:'把黑板上的题记在本子上',talkHint:'先找黑板、笔记和正在记录的动作。',prompt:'刘小雪上课时是怎么学习的？',promptPinyin:'Liú Xiǎoxuě shàngkè shí shì zěnme xuéxí de?',promptEn:'How does Xiaoxue study during class?',image:img('photo-text-1-note-taking'),labels:[{word:'认真',x:12,y:14,targetX:48,targetY:57},{word:'笔记',x:88,y:82,targetX:57,targetY:72},{word:'黑板',x:88,y:14,targetX:67,targetY:30},{word:'把',x:12,y:82,targetX:52,targetY:55}],words:['认真','笔记','黑板','把'],sentence:'刘小雪认真听课，把黑板上的重要题记在本子上。',sampleAnswers:[{hanzi:'她认真听课，也认真记笔记。',pinyin:'Tā rènzhēn tīng kè, yě rènzhēn jì bǐjì.'},{hanzi:'她把黑板上的题记在本子上。',pinyin:'Tā bǎ hēibǎn shang de tí jì zài běnzi shang.'},{hanzi:'她的笔记记得非常清楚。',pinyin:'Tā de bǐjì jì de fēicháng qīngchu.'}]},
    {title:'写作业以前看一遍笔记',talkHint:'观察桌面上的数学作业和打开的笔记。',prompt:'写作业以前，你会怎样用笔记？',promptPinyin:'Xiě zuòyè yǐqián, nǐ huì zěnyàng yòng bǐjì?',promptEn:'How do you use your notes before doing homework?',image:img('photo-text-1-study-routine'),labels:[{word:'数学',x:12,y:14,targetX:41,targetY:69},{word:'作业',x:88,y:82,targetX:66,targetY:72},{word:'遍',x:12,y:82,targetX:48,targetY:55},{word:'提高',x:88,y:14,targetX:71,targetY:42}],words:['数学','作业','遍','提高',extension('清楚','qīngchu','clear; clearly',['看清楚','记得清楚'],'我先把要求看清楚。','Wǒ xiān bǎ yāoqiú kàn qīngchu.')],sentence:'她写数学作业以前先看一遍笔记，希望提高成绩。',sampleAnswers:[{hanzi:'我写作业以前先看一遍笔记。',pinyin:'Wǒ xiě zuòyè yǐqián xiān kàn yí biàn bǐjì.'},{hanzi:'我把不清楚的地方画出来。',pinyin:'Wǒ bǎ bù qīngchu de dìfang huà chūlai.'},{hanzi:'这个习惯可以帮助我提高成绩。',pinyin:'Zhège xíguàn kěyǐ bāngzhù wǒ tígāo chéngjì.'}]}
  ]},
  2:{title:'考试复盘与求助',subtitle:'找出考得不理想的原因，再整理问题并寻求帮助。',steps:[
    {title:'考试以后一起复盘',talkHint:'观察试卷、表情和被圈出的要求。',prompt:'数学考得不理想时，应该先找什么原因？',promptPinyin:'Shùxué kǎo de bù lǐxiǎng shí, yīnggāi xiān zhǎo shénme yuányīn?',promptEn:'What should you check first after a disappointing maths result?',image:img('photo-text-2-exam-review'),labels:[{word:'历史',x:12,y:14,targetX:31,targetY:68},{word:'难',x:88,y:14,targetX:46,targetY:42},{word:'要求',x:12,y:82,targetX:55,targetY:70},{word:'差',x:88,y:82,targetX:70,targetY:58}],words:['历史','难','要求','差'],sentence:'历史有点儿难；数学因为没看清楚要求，考得挺差。',sampleAnswers:[{hanzi:'我先看自己是不是没看清楚要求。',pinyin:'Wǒ xiān kàn zìjǐ shì bu shì méi kàn qīngchu yāoqiú.'},{hanzi:'我把做错的题再做一遍。',pinyin:'Wǒ bǎ zuòcuò de tí zài zuò yí biàn.'},{hanzi:'一次考得差不代表一直学不好。',pinyin:'Yí cì kǎo de chà bù dàibiǎo yìzhí xué bu hǎo.'}]},
    {title:'整理问题后去问老师',talkHint:'先说明科目和问题，再决定去哪里求助。',prompt:'学习上遇到不会的题，两个人准备怎样求助？',promptPinyin:'Xuéxí shang yùdào bú huì de tí, liǎng gè rén zhǔnbèi zěnyàng qiúzhù?',promptEn:'How do the two students plan to get help with questions they cannot solve?',image:img('photo-text-2-ask-for-help'),labels:[{word:'复习',x:12,y:14,targetX:34,targetY:62},{word:'外语',x:88,y:14,targetX:58,targetY:67},{word:'遇到',x:12,y:82,targetX:48,targetY:50},{word:'办公室',x:88,y:82,targetX:77,targetY:38}],words:['复习','外语','遇到','办公室',extension('当然','dāngrán','of course',['当然可以','当然知道'],'遇到问题当然可以问老师。','Yùdào wèntí dāngrán kěyǐ wèn lǎoshī.')],sentence:'他们复习外语时遇到问题，准备一起去办公室问李老师。',sampleAnswers:[{hanzi:'在学习上遇到问题，可以先问同学。',pinyin:'Zài xuéxí shang yùdào wèntí, kěyǐ xiān wèn tóngxué.'},{hanzi:'这几个题两个人都不会，所以要去办公室。',pinyin:'Zhè jǐ gè tí liǎng gè rén dōu bú huì, suǒyǐ yào qù bàngōngshì.'},{hanzi:'问老师以前，要把问题说清楚。',pinyin:'Wèn lǎoshī yǐqián, yào bǎ wèntí shuō qīngchu.'}]}
  ]},
  3:{title:'去办公室问问题',subtitle:'清楚说明页码和困难，听完解释后确认理解并约定还书。',steps:[
    {title:'第五页的对话看不懂',talkHint:'观察书页、对话和学生指着的位置。',prompt:'向老师提问时，怎样说得更清楚？',promptPinyin:'Xiàng lǎoshī tíwèn shí, zěnyàng shuō de gèng qīngchu?',promptEn:'How can you make a question clearer when asking a teacher?',image:img('photo-text-3-teacher-office'),labels:[{word:'页',x:12,y:82,targetX:45,targetY:66},{word:'对话',x:88,y:82,targetX:58,targetY:66},{word:'明白',x:12,y:14,targetX:38,targetY:44},{word:'讲',x:88,y:14,targetX:69,targetY:43}],words:['页','对话','明白','讲'],sentence:'学生说第五页的对话看不懂，请李老师再讲一遍。',sampleAnswers:[{hanzi:'第五页的这个对话我看不懂。',pinyin:'Dì-wǔ yè de zhège duìhuà wǒ kàn bu dǒng.'},{hanzi:'请您把这几句话再讲一遍。',pinyin:'Qǐng nín bǎ zhè jǐ jù huà zài jiǎng yí biàn.'},{hanzi:'老师讲完以后，我终于明白了。',pinyin:'Lǎoshī jiǎngwán yǐhòu, wǒ zhōngyú míngbai le.'}]},
    {title:'做完练习后归还书',talkHint:'观察学生把借来的书交回老师手中。',prompt:'借了老师的书，明天应该怎么做？',promptPinyin:'Jièle lǎoshī de shū, míngtiān yīnggāi zěnme zuò?',promptEn:'What should the student do tomorrow with the teacher\'s book?',image:img('photo-text-3-return-book'),labels:[{word:'句',x:12,y:14,targetX:36,targetY:62},{word:'句子',x:12,y:82,targetX:47,targetY:69},{word:'把',x:88,y:14,targetX:63,targetY:52},{word:'遍',x:88,y:82,targetX:60,targetY:66}],words:['句','句子','把','遍',extension('还给','huán gěi','return to someone',['把书还给老师','明天还给我'],'我明天把书还给李老师。','Wǒ míngtiān bǎ shū huán gěi Lǐ lǎoshī.')],sentence:'学生回家做书上的练习，第二天把书还给李老师。',sampleAnswers:[{hanzi:'我回家把书上的练习做一遍。',pinyin:'Wǒ huí jiā bǎ shū shang de liànxí zuò yí biàn.'},{hanzi:'我明天把书还给您。',pinyin:'Wǒ míngtiān bǎ shū huán gěi nín.'},{hanzi:'借别人的东西要记住归还时间。',pinyin:'Jiè biérén de dōngxi yào jìzhù guīhuán shíjiān.'}]}
  ]},
  4:{title:'写邮件介绍学习阶段',subtitle:'从个人年级和升学目标，连接中国常见教育阶段与兴趣影响。',steps:[
    {title:'在家写学习近况邮件',talkHint:'观察写邮件的人、学习材料和相机。',prompt:'给朋友介绍你最近的学习生活，你会说什么？',promptPinyin:'Gěi péngyou jièshào nǐ zuìjìn de xuéxí shēnghuó, nǐ huì shuō shénme?',promptEn:'What would you tell a friend about your recent school life?',image:img('photo-text-4-email-study'),labels:[{word:'年级',x:12,y:14,targetX:38,targetY:64},{word:'后年',x:88,y:14,targetX:55,targetY:47},{word:'努力',x:12,y:82,targetX:47,targetY:58},{word:'一般',x:88,y:82,targetX:70,targetY:63}],words:['年级','后年','努力','一般'],sentence:'刘小雪上初中二年级，后年要考高中，所以现在非常努力。',sampleAnswers:[{hanzi:'我现在上初中二年级。',pinyin:'Wǒ xiànzài shàng chūzhōng èr niánjí.'},{hanzi:'后年我要考高中，所以现在很努力。',pinyin:'Hòunián wǒ yào kǎo gāozhōng, suǒyǐ xiànzài hěn nǔlì.'},{hanzi:'我还会写最近开始喜欢的活动。',pinyin:'Wǒ hái huì xiě zuìjìn kāishǐ xǐhuan de huódòng.'}]},
    {title:'了解常见教育阶段',talkHint:'先找小学、初中、高中、大学，再联系自己的学习阶段。',prompt:'你现在上几年级？以后最想学什么？',promptPinyin:'Nǐ xiànzài shàng jǐ niánjí? Yǐhòu zuì xiǎng xué shénme?',promptEn:'What grade are you in now, and what would you most like to study later?',image:img('photo-text-4-education-path'),labels:[{word:'年级',x:12,y:14,targetX:24,targetY:55},{word:'一般',x:88,y:14,targetX:75,targetY:49},{word:'努力',x:12,y:82,targetX:51,targetY:63}],words:['年级','一般','努力',extension('小学','xiǎoxué','primary school',['上小学','小学六年'],'中国的小学一般是六年。','Zhōngguó de xiǎoxué yìbān shì liù nián.'),extension('初中','chūzhōng','junior middle school',['上初中','初中三年'],'刘小雪现在上初中二年级。','Liú Xiǎoxuě xiànzài shàng chūzhōng èr niánjí.'),extension('高中','gāozhōng','senior high school',['考高中','高中三年'],'她后年要考高中。','Tā hòunián yào kǎo gāozhōng.')],sentence:'教材介绍中国学校一般是小学六年、初中三年、高中三年。',sampleAnswers:[{hanzi:'中国的学校一般是小学六年、初中三年、高中三年。',pinyin:'Zhōngguó de xuéxiào yìbān shì xiǎoxué liù nián, chūzhōng sān nián, gāozhōng sān nián.'},{hanzi:'不同地区的教育阶段可能不完全一样。',pinyin:'Bùtóng dìqū de jiàoyù jiēduàn kěnéng bù wánquán yíyàng.'},{hanzi:'学习目标除了成绩，也可以包括兴趣和能力。',pinyin:'Xuéxí mùbiāo chúle chéngjì, yě kěyǐ bāokuò xìngqù hé nénglì.'}]}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {session:'A',title:'分享学习方法并说明笔记位置',words:['数学','认真','笔记','清楚','黑板','把','作业','遍','提高'],image:img('photo-text-1-note-taking'),introEn:'Learn how to describe a study routine, take clear notes and use a 把 sentence to say where something is recorded. The full textbook dialogue stays for class.',recognition:[
    q('a_rec_01','哪个词表示“mathematics”？','Choose the word for mathematics.',['数学','历史','外语','年级'],'数学'),q('a_rec_02','“认真听课”最接近哪个英文？','Choose the meaning.',['listen carefully in class','copy every answer','leave the classroom','take an exam'],'listen carefully in class'),q('a_rec_03','哪个词表示“notes”？','Choose the word.',['笔记','作业','黑板','句子'],'笔记'),q('a_rec_04','“看一遍”表示什么？','Choose the meaning.',['read once from beginning to end','look at one page only','read next year','read unclearly'],'read once from beginning to end'),q('a_rec_05','“提高成绩”最接近哪个英文？','Choose the meaning.',['improve grades','forget homework','move a desk','ask for a page'],'improve grades')
  ],matchWords:['数学','认真','笔记','黑板','提高'],contexts:[['我上课的时候会认真记____。','笔记',['笔记','历史','办公室','后年']],['老师把重要的题写在____上。','黑板',['黑板','外语','句子','年级']],['我把这些题记____本子上。','在',['在','给','中','下']],['写作业以前，我先看一____笔记。','遍',['遍','页','句','把']],['这个方法能帮助我____成绩。','提高',['提高','遇到','讲','还给']]],challenge:[
    q('a_ch_01','“记笔记”是什么学习行为？','Choose the meaning.',['take notes','return a book','review history','enter high school'],'take notes'),q('a_ch_02','哪一句说明笔记很清楚？','Choose the sentence.',['你的笔记记得非常清楚。','历史考试有点儿难。','我们去办公室吧。','后年我要考高中。'],'你的笔记记得非常清楚。'),q('a_ch_03','哪一句是正确的“把”字句？','Choose the correct 把 sentence.',['我把重点写在本子上。','我重点把本子写。','把我在重点写本子。','本子把重点我写。'],'我把重点写在本子上。'),q('a_ch_04','否定词应该放在哪里？','Choose the correct position.',['放在“把”前面','放在地点后面','只能放在句末','放在主语前面且不能移动'],'放在“把”前面'),q('a_ch_05','“我会把这些题都记在本子上”中的地点是什么？','Choose the location.',['本子上','这些题','我','都会'],'本子上'),q('a_ch_06','写作业以前看笔记的目的是什么？','Choose the purpose.',['复习重点并准备作业','改变年级','归还老师的书','介绍教育体系'],'复习重点并准备作业'),q('a_ch_07','哪一句最适合介绍自己的学习方法？','Choose the useful sentence.',['我认真听课，把重点记在本子上。','数学把清楚黑板。','我后年办公室。','句子给历史。'],'我认真听课，把重点记在本子上。'),q('a_ch_08','“遍”和“页”有什么不同？','Choose the difference.',['遍数动作次数，页数书页','两个词意思完全一样','遍数人，页数时间','遍只能用于考试'],'遍数动作次数，页数书页'),q('a_ch_09','想提高成绩，哪项行动最具体？','Choose the concrete action.',['每天作业前看一遍笔记','只说我要努力','不看考试要求','把问题留到以后'],'每天作业前看一遍笔记'),q('a_ch_10','课堂前要准备什么？','Choose the useful preparation.',['一种学习方法和具体步骤','所有考试答案','中国全部学校名单','一段强制录音'],'一种学习方法和具体步骤')
  ]},
  {session:'B',title:'复盘考试并有效求助',words:['历史','难','要求','差','复习','外语','当然','遇到','办公室'],image:img('photo-text-2-exam-review'),introEn:'Learn to identify a reason for an exam mistake, describe study problems in a specific area and prepare a clear request for help.',recognition:[
    q('b_rec_01','哪个词表示“history”？','Choose the word.',['历史','数学','外语','作业'],'历史'),q('b_rec_02','“要求”最接近哪个英文？','Choose the meaning.',['requirement','office','page','grade level'],'requirement'),q('b_rec_03','“考得挺差”表示什么？','Choose the meaning.',['did rather poorly','studied very clearly','explained twice','returned the book'],'did rather poorly'),q('b_rec_04','哪个词表示“review”？','Choose the word.',['复习','遇到','讲','努力'],'复习'),q('b_rec_05','“当然可以”表达什么态度？','Choose the meaning.',['willing agreement','strong refusal','unclear location','past grade'],'willing agreement')
  ],matchWords:['历史','要求','复习','外语','办公室'],contexts:[['我觉得____考试有点儿难。','历史',['历史','认真','年级','句子']],['数学考试我没看清楚____。','要求',['要求','黑板','笔记','当然']],['做错了好几个题，考得挺____的。','差',['差','清楚','一般','努力']],['明天还有考试，先____外语吧。','复习',['复习','提高','遇到','讲']],['咱们去____问问李老师。','办公室',['办公室','黑板','数学','对话']]],challenge:[
    q('b_ch_01','数学为什么考得差？','Choose the reason.',['没看清楚要求','没有带相机','把书还给老师','上了二年级'],'没看清楚要求'),q('b_ch_02','哪一句是在复盘具体原因？','Choose the sentence.',['我没看清楚要求，做错了几个题。','考试不好。','我不高兴。','明天再说。'],'我没看清楚要求，做错了几个题。'),q('b_ch_03','“在学习上”表示什么？','Choose the function.',['the area or aspect of study','inside a school building','under a book','after an exam'],'the area or aspect of study'),q('b_ch_04','哪一句正确使用“在……中”？','Choose the sentence.',['在考试中，要先看清楚要求。','在考试上，我坐教室。','在考试下，我写姓名。','考试中在要求。'],'在考试中，要先看清楚要求。'),q('b_ch_05','哪一句正确使用“在……下”？','Choose the sentence.',['在老师的帮助下，我明白了。','在老师下我去。','在帮助中老师。','老师在下帮助。'],'在老师的帮助下，我明白了。'),q('b_ch_06','问老师以前，哪组信息最有用？','Choose the useful details.',['页码、题号和不懂的地方','只说不会','全部考试分数','同学的私人信息'],'页码、题号和不懂的地方'),q('b_ch_07','同学不会，刘小雪也不会，应该怎么办？','Choose the next step.',['一起去办公室问老师','随便写一个答案','不再复习','把书送给别人'],'一起去办公室问老师'),q('b_ch_08','“遇到什么问题都可以问我”表达什么？','Choose the meaning.',['offers help for any study problem','requires a perfect score','refuses all questions','describes a page number'],'offers help for any study problem'),q('b_ch_09','哪一句给出了下一步行动？','Choose the action plan.',['先复习外语，再整理不会的题。','历史有点儿难。','我考得不好。','要求很长。'],'先复习外语，再整理不会的题。'),q('b_ch_10','课堂前要带来什么？','Choose the useful preparation.',['一个具体问题、已尝试的方法和求助句','完整背诵所有课文','强制上传录音','所有同学的成绩'],'一个具体问题、已尝试的方法和求助句')
  ]},
  {session:'C',title:'清楚提问、归还资料并介绍学习阶段',words:['页','对话','明白','讲','句','句子','年级','后年','一般','努力'],image:img('photo-text-3-teacher-office'),introEn:'Learn to identify a page and difficulty, transfer an item to a recipient with 把…给…, and give a short comparison of school stages and personal goals.',recognition:[
    q('c_rec_01','“第五页”在说明什么？','Choose the meaning.',['page five','five sentences','five grades','five exams'],'page five'),q('c_rec_02','哪个词表示“dialogue”？','Choose the word.',['对话','句子','年级','要求'],'对话'),q('c_rec_03','“再讲一遍”是什么意思？','Choose the meaning.',['explain once more from beginning to end','write one page','return next year','study one grade'],'explain once more from beginning to end'),q('c_rec_04','“后年”是什么时候？','Choose the meaning.',['the year after next','last year','tomorrow','this semester'],'the year after next'),q('c_rec_05','“努力学习”最接近哪个英文？','Choose the meaning.',['study hard','speak generally','read a dialogue','visit an office'],'study hard')
  ],matchWords:['页','对话','明白','讲','句子','年级','努力'],contexts:[['书上第五____的这个对话我看不懂。','页',['页','遍','句','把']],['请老师再给我们____一遍。','讲',['讲','提高','遇到','复习']],['这些____一点儿也不难。','句子',['句子','年级','办公室','历史']],['我现在上初中二____。','年级',['年级','对话','要求','数学']],['为了考上好高中，我现在非常____。','努力',['努力','当然','清楚','一般']]],challenge:[
    q('c_ch_01','学生看不懂什么？','Choose the answer.',['第五页的对话','黑板上的数学题','家月的照片','历史考试要求'],'第五页的对话'),q('c_ch_02','老师怎样帮助学生？','Choose the answer.',['把几句话再讲一遍','把考试取消','把照片送走','把年级改了'],'把几句话再讲一遍'),q('c_ch_03','哪一句表示把物品还给原来的人？','Choose the sentence.',['我明天把书还给老师。','我把书放在桌上。','我在书中看对话。','我看一遍书。'],'我明天把书还给老师。'),q('c_ch_04','哪一句表示把物品交给接收者？','Choose the sentence.',['请把作业交给李老师。','请把作业写在本子上。','在作业中有问题。','作业越来越难。'],'请把作业交给李老师。'),q('c_ch_05','中国学校在教材中一般怎样安排？','Choose the textbook description.',['小学六年、初中三年、高中三年','小学三年、初中六年','所有阶段都是两年','只有大学一个阶段'],'小学六年、初中三年、高中三年'),q('c_ch_06','刘小雪什么时候要考高中？','Choose the time.',['后年','明天','昨天','十年以后'],'后年'),q('c_ch_07','她为什么现在非常努力？','Choose the reason.',['为了考上好高中','为了少写作业','为了归还黑板','为了不问老师'],'为了考上好高中'),q('c_ch_08','她在家月姐姐的影响下开始喜欢什么？','Choose the hobby.',['拍照','数学考试','还书','讲句子'],'拍照'),q('c_ch_09','介绍教育路径时应该怎样表达？','Choose the responsible statement.',['说明教材介绍的是一般情况，并尊重差异','说所有地方完全相同','只评价分数高低','要求每个人走同一路径'],'说明教材介绍的是一般情况，并尊重差异'),q('c_ch_10','最终分享需要整合什么？','Choose the project plan.',['学习方法、问题求助和个人学习目标','所有考试答案','强制上传音频','背诵全国学校名单'],'学习方法、问题求助和个人学习目标')
  ]}
];

function mission(spec, index) {
  const prefix = spec.session.toLowerCase();
  const pairs = spec.matchWords.map((hanzi, i) => ({id:prefix + '_pair_' + String(i + 1).padStart(2, '0'),word:hanzi,meaning:word(hanzi).english}));
  const contextQuestions = spec.contexts.map((item, i) => q(prefix + '_ctx_' + String(i + 1).padStart(2, '0'),item[0],'Choose the expression that completes the full context.',item[2],item[1]));
  return {id:'pm_hsk3_l10_' + prefix,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:'第' + (index + 1) + '次课课前热身赛',titleEn:spec.title,subtitleEn:'Five stages prepare you for the next classroom task.',scenario:spec.title,goals:[spec.title,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:spec.introEn,stages:[
    {id:prefix + '1',title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先听、读并理解本次课的词语和必要背景。',screenPromptEn:spec.introEn,interactionType:'study_list',photos:[spec.image],keywordCards:spec.words.map(card)},
    {id:prefix + '2',title:'快速认词',titleEn:'Recognition',screenPrompt:'根据词义或情境选择答案。',screenPromptEn:'Choose the word or meaning that fits.',interactionType:'practice_quiz',questions:spec.recognition},
    {id:prefix + '3',title:'汉英配对',titleEn:'Chinese-English Match',screenPrompt:'把中文词语和英文意思配对。',screenPromptEn:'Match each Chinese card with its English meaning.',interactionType:'timed_match',pairs},
    {id:prefix + '4',title:'语境判断',titleEn:'Context Check',screenPrompt:'把词语放回完整语境。',screenPromptEn:'Choose the expression that completes each context.',interactionType:'practice_quiz',questions:contextQuestions},
    {id:prefix + '5',title:'正式挑战',titleEn:'Scored Challenge',screenPrompt:'独立完成10题正式挑战。',screenPromptEn:'Complete the 10-question scored challenge.',interactionType:'ranked_quiz',questions:spec.challenge}
  ],reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],persistenceKeyPattern:'ClassReadyPreview_HSK3-L10_' + spec.session + '_{student}_v1',completionMessageEn:'Preview complete. Bring one useful sentence to class.'};
}

const fills = [
  {id:'l10_fill_a',title:'学习方法',sentences:[['我的____越来越好。','数学',['数学','历史','外语','年级']],['上课要____听，也要认真记。','认真',['认真','一般','当然','清楚']],['我把重要的题记在____里。','笔记',['笔记','办公室','对话','要求']],['老师把例句写在____上。','黑板',['黑板','作业','句子','成绩']],['我写作业以前先看一遍笔记，希望____成绩。','提高',['提高','遇到','讲','归还']]]},
  {id:'l10_fill_b',title:'考试复盘',sentences:[['这次____考试有点儿难。','历史',['历史','数学','笔记','后年']],['我没看清楚考试____。','要求',['要求','清楚','一般','句']],['做错了几个题，考得挺____。','差',['差','认真','明白','努力']],['明天考外语，先____吧。','复习',['复习','提高','遇到','还给']],['不会的问题可以去____问老师。','办公室',['办公室','黑板','年级','作业']]]},
  {id:'l10_fill_c',title:'问问题与学习阶段',sentences:[['书上第五____的对话我看不懂。','页',['页','遍','句','把']],['请老师再____一遍。','讲',['讲','复习','遇到','提高']],['这些____一点儿也不难。','句子',['句子','要求','外语','历史']],['我现在上初中二____。','年级',['年级','对话','办公室','笔记']],['为了实现目标，我现在很____。','努力',['努力','差','难','一般']]]}
].map((group,gi) => ({id:group.id,type:'vocab_fill_group',stage:'in_class',contentRole:['lesson','transfer','review'][gi],prompt_cn:group.title,prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:group.sentences.map(item => item[1]),wordBank_pinyin:group.sentences.map(item => word(item[1]).pinyin),sentences:group.sentences.map(item => ({sentence:item[0],answer:item[1]})),speakingOutput:[
  {support:'任选两个词完成一句话。',core:'用三个词说明自己的学习方法。',stretch:'用五个词完成30秒学习方法介绍。'},
  {support:'任选两个词说明一次考试问题。',core:'用三个词说清问题和办法。',stretch:'用五个词完成30秒考试复盘。'},
  {support:'任选两个词完成一句话。',core:'用三个词介绍自己的学习阶段。',stretch:'用五个词说明问题、行动和目标。'}
][gi]}}));

const matchGroups = [
  {id:'l10_match_a',title:'学习问答',pairs:[
    ['上课时，老师把题写在哪里？','老师把题写在黑板上。'],
    ['刘小雪把黑板上的题记在哪里？','她把这些题记在本子上。'],
    ['她写作业以前先做什么？','她先看一遍笔记，再开始写作业。'],
    ['她认真学习以后，数学怎么样了？','她的数学越来越好了。'],
    ['想提高数学成绩，可以怎么做？','上课认真听，认真记笔记，作业也要认真做。']
  ]},
  {id:'l10_match_b',title:'考试和问老师',pairs:[
    ['这次数学为什么考得很差？','因为我没看清楚要求，做错了几个题。'],
    ['明天还有什么考试？','明天还有外语考试，我们先复习外语吧。'],
    ['在学习上遇到不会的问题，可以问谁？','可以先问同学，也可以去问老师。'],
    ['两个人都不会做这几个题，他们准备去哪儿？','他们准备去办公室问李老师。'],
    ['去问老师时，怎么说自己的问题？','可以说：“第五页的对话我看不懂。”']
  ]},
  {id:'l10_match_c',title:'问问题、还书和学习',pairs:[
    ['学生看不懂哪儿？','他看不懂第五页的对话。'],
    ['学生希望老师怎么帮助他？','他请老师把这几句话再讲一遍。'],
    ['借了老师的书，什么时候还给老师？','今天回家做练习，明天把书还给老师。'],
    ['刘小雪现在上几年级？','她现在上初中二年级。'],
    ['她为什么学习很努力？','因为她后年要考高中。']
  ]}
].map((group,index) => ({id:group.id,type:'question_answer_match',stage:'in_class',contentRole:['lesson','transfer','review'][index],prompt_cn:group.title + '：把问题和回答配对。',prompt_en:'Match each question with its answer.',data:{pairs:group.pairs.map((pair,k) => ({id:group.id + '_' + (k + 1),left:pair[0],right:pair[1]}))}}));

const orders = [
  ['我会把这些题都记在本子上。',['我会','把这些题','都','记在本子上']],
  ['在学习上，遇到问题可以问老师。',['在学习上','遇到问题','可以','问老师']],
  ['请把这本报纸带给李老师。',['请','把这本报纸','带给','李老师']],
  ['在老师的帮助下，我终于明白了。',['在老师的帮助下','我','终于','明白了']],
  ['为了提高成绩，我每天复习笔记。',['为了提高成绩','我','每天','复习笔记']]
].map((item,index,all) => ({id:'l10_order_' + String(index + 1).padStart(2,'0'),type:'ordering',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'排列成完整句子。',prompt_en:'Put the chunks in order.',correct_answer:item[0],data:{chunks:item[1]}}));

const sceneRows = [
  ['她把黑板上的重点记在哪里？',['记在本子上','交给老师','放到办公室','写在试卷外面'],'记在本子上'],['写作业以前，她先做什么？',['看一遍笔记','把书还给老师','考高中','拍照片'],'看一遍笔记'],['数学考得差的一个具体原因是什么？',['没看清楚要求','没有去拍照','年级太高','笔记太新'],'没看清楚要求'],['学习上遇到问题，可以怎么做？',['先整理再求助','随便猜答案','不再复习','只看分数'],'先整理再求助'],['学生怎样说明问题位置？',['第五页的对话','一个很难的东西','昨天的问题','什么都不会'],'第五页的对话'],['老师怎样帮助他们？',['再讲一遍','把书卖掉','改变年级','取消作业'],'再讲一遍'],['借来的书要怎样处理？',['按约定还给老师','放在黑板上','送给陌生人','一直不还'],'按约定还给老师'],['刘小雪现在上什么年级？',['初中二年级','小学一年级','高中三年级','大学二年级'],'初中二年级'],['她后年有什么计划？',['考高中','考小学','离开学校','不再学习'],'考高中'],['什么让她开始喜欢拍照？',['家月姐姐的影响','一次数学考试','李老师的书','黑板上的题'],'家月姐姐的影响']
];
const sceneChoices = sceneRows.map((item,index,all) => ({id:'l10_scene_' + String(index + 1).padStart(2,'0'),type:'choice',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:item[0],prompt_en:'Choose the answer that fits the situation.',correct_answer:item[2],data:{question_cn:item[0],options:item[1],correct_index:item[1].indexOf(item[2])}}));

const guessRows = [
  ['笔记','上课时记录重点，作业以前可以复习。'],['黑板','老师常常在上面写题或例句。'],['遍','表示一个动作从头到尾完成一次。'],['要求','做题以前必须先看清楚的说明。'],['办公室','学生可以到这里找老师问问题。'],['对话','两个人或多个人互相说话的内容。'],['年级','说明学生处于学校的哪一年。'],['后年','明年之后的那一年。'],['努力','为了目标认真行动，不轻易放弃。'],['复习','重新学习已经学过的内容。']
];
const guessDistractors = ['历史','数学','句子'];
const guesses = guessRows.map((item,index,all) => { const options=[item[0],...guessRows.filter((_,k)=>k!==index).slice(index%7,index%7+2).map(x=>x[0]),guessDistractors[index%guessDistractors.length]]; return {id:'l10_guess_' + String(index + 1).padStart(2,'0'),type:'description_guess',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:item[1],prompt_en:'Guess the word.',correct_answer:item[0],data:{description:item[1],options:[...new Set(options)].slice(0,4)}}; });

const sayRows = [
  ['认真',['认真听课','认真复习','态度']],['笔记',['课堂重点','本子','复习']],['要求',['考试','先看清楚','说明']],['复习',['已经学过','再看','准备考试']],['办公室',['老师工作','问问题','学校']],['明白',['听懂','看懂','解释以后']],['年级',['学校阶段','一年级','二年级']],['努力',['目标','行动','坚持']]
];
const sayGuess = sayRows.map((item,index,all) => ({id:'l10_say_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:item[0],boardIndex:index + 1,clues:[],scaffold:{words:item[1],frames:['这是一个……。','学习时，人们会……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));

const blindRows = [
  [['把','在'], '我把今天的重点写在笔记本上。'],[['在学习上','遇到'], '在学习上遇到问题时，我会先整理。'],[['把','给'], '请把这张问题卡交给李老师。'],[['为了','努力'], '为了提高外语成绩，我会努力复习。']
];
const blind = blindRows.map((item,index,all) => ({id:'l10_blind_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:item[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:item[1]}}));

const pictureRows = [
  ['photo-text-1-note-taking','把……记在……'],['photo-text-1-study-routine','写作业以前；看一遍'],['photo-text-2-exam-review','没看清楚要求；考得差'],['photo-text-2-ask-for-help','在学习上；遇到'],['photo-text-3-teacher-office','第五页；看不懂'],['photo-text-3-return-book','把……还给……'],['photo-text-4-email-study','后年；努力'],['photo-text-4-education-path','一般；年级']
];
const pictureComplete = pictureRows.map((item,index,all) => ({id:'l10_pic_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the target expressions to write one complete sentence about the photo.',data:{image:img(item[0]),keyword:item[1],task:'观察图片，用关键词写一个完整、自然的句子。',answerPlaceholder:'写一个完整的中文句子。'}}));

const readingQuestion = (question_cn,question_pinyin,options,correct_index,focus) => ({question_cn,question_pinyin,options,correct_index,answer:options[correct_index],focus});
const readingRows = [
  {title:'一页会用的笔记',role:'lesson',passage:'小林每天上课以前先看昨天的笔记。上课时，他把老师写在黑板上的重点记在本子上，还在不明白的地方画一个问号。写作业以前，他再看一遍，并先解决画问号的问题。一个月以后，他发现自己做题更清楚了。',pinyin:'Xiǎolín měitiān shàngkè yǐqián xiān kàn zuótiān de bǐjì. Shàngkè shí, tā bǎ lǎoshī xiě zài hēibǎn shang de zhòngdiǎn jì zài běnzi shang, hái zài bù míngbai de dìfang huà yí gè wènhào. Xiě zuòyè yǐqián, tā zài kàn yí biàn, bìng xiān jiějué huà wènhào de wèntí. Yí gè yuè yǐhòu, tā fāxiàn zìjǐ zuòtí gèng qīngchu le.',questions:[
    readingQuestion('小林上课以前先做什么？','Xiǎolín shàngkè yǐqián xiān zuò shénme?',['看昨天的笔记','去办公室问老师','把作业交给同学','准备体育比赛'],0,'提取时间顺序'),
    readingQuestion('他怎样标出不明白的地方？','Tā zěnyàng biāochū bù míngbai de dìfang?',['把它擦掉','画一个问号','只记在手机里','请同学替他写'],1,'提取具体做法'),
    readingQuestion('这段话最想说明什么？','Zhè duàn huà zuì xiǎng shuōmíng shénme?',['笔记越长越好','只要抄黑板就能提高成绩','笔记要在课前、课中和作业前真正使用','遇到问题不需要再复习'],2,'概括主旨')
  ]},
  {title:'先把错误变成方法',role:'lesson',passage:'安娜这次数学考得不太好。她没有只看分数，而是把错题和考试要求放在一起比较。她发现两道题是因为没看清楚要求，另一道题是计算过程写得太快。下次考试，她准备先圈出关键词，做完以后再检查一遍。',pinyin:'Ānnà zhè cì shùxué kǎo de bú tài hǎo. Tā méiyǒu zhǐ kàn fēnshù, érshì bǎ cuòtí hé kǎoshì yāoqiú fàng zài yìqǐ bǐjiào. Tā fāxiàn liǎng dào tí shì yīnwèi méi kàn qīngchu yāoqiú, lìng yí dào tí shì jìsuàn guòchéng xiě de tài kuài. Xià cì kǎoshì, tā zhǔnbèi xiān quān chū guānjiàncí, zuòwán yǐhòu zài jiǎnchá yí biàn.',questions:[
    readingQuestion('安娜把什么放在一起比较？','Ānnà bǎ shénme fàng zài yìqǐ bǐjiào?',['分数和年级','错题和考试要求','历史和外语','笔记和照片'],1,'把字句信息'),
    readingQuestion('她有几道题是因为没看清楚要求而做错的？','Tā yǒu jǐ dào tí shì yīnwèi méi kàn qīngchu yāoqiú ér zuòcuò de?',['一道','两道','三道','四道'],1,'数量信息'),
    readingQuestion('她为下次考试准备了什么办法？','Tā wèi xià cì kǎoshì zhǔnbèile shénme bànfǎ?',['先看分数，再问同学','只复习最难的题','圈关键词并在做完后检查','把试卷交给老师'],2,'行动计划')
  ]},
  {title:'带着问题卡去求助',role:'transfer',passage:'王明去办公室以前，把页码、题号、自己试过的方法和不明白的地方写在一张卡上。他先请同学看，同学也不会，两个人就一起去问老师。老师看了问题卡，很快就知道他们的问题在哪里，也能有针对性地再讲一遍。',pinyin:'Wáng Míng qù bàngōngshì yǐqián, bǎ yèmǎ, tíhào, zìjǐ shìguo de fāngfǎ hé bù míngbai de dìfang xiě zài yì zhāng kǎ shang. Tā xiān qǐng tóngxué kàn, tóngxué yě bú huì, liǎng gè rén jiù yìqǐ qù wèn lǎoshī. Lǎoshī kànle wèntí kǎ, hěn kuài jiù zhīdào tāmen de wèntí zài nǎli, yě néng yǒu zhēnduìxìng de zài jiǎng yí biàn.',questions:[
    readingQuestion('问题卡上没有写什么？','Wèntí kǎ shang méiyǒu xiě shénme?',['页码和题号','试过的方法','不明白的地方','最后考试分数'],3,'排除信息'),
    readingQuestion('为什么两个人一起去问老师？','Wèishénme liǎng gè rén yìqǐ qù wèn lǎoshī?',['他们都不会','办公室里有考试','老师要借书','他们想看照片'],0,'因果关系'),
    readingQuestion('问题卡怎样帮助老师？','Wèntí kǎ zěnyàng bāngzhù lǎoshī?',['让老师马上给成绩','让老师快速找到困难点并具体讲解','让老师少布置作业','让老师改变课文内容'],1,'推断作用')
  ]},
  {title:'按时归还资料',role:'transfer',passage:'图书馆的书可以借三周。小美每次借书以后，都把归还日期记在手机日历里，还把书放在书桌右边的“本周阅读区”。每周日她看一遍借书记录：读完的书下周一还给图书馆，没读完的书先确认能不能续借。',pinyin:'Túshūguǎn de shū kěyǐ jiè sān zhōu. Xiǎoměi měi cì jiè shū yǐhòu, dōu bǎ guīhuán rìqī jì zài shǒujī rìlì li, hái bǎ shū fàng zài shūzhuō yòubian de “běn zhōu yuèdú qū”. Měi Zhōurì tā kàn yí biàn jièshū jìlù: dúwán de shū xià Zhōuyī huán gěi túshūguǎn, méi dúwán de shū xiān quèrèn néng bu néng xùjiè.',questions:[
    readingQuestion('小美把归还日期记在哪里？','Xiǎoměi bǎ guīhuán rìqī jì zài nǎli?',['黑板上','手机日历里','书的第一页','老师办公室'],1,'位置改变把字句'),
    readingQuestion('她什么时候检查借书记录？','Tā shénme shíhou jiǎnchá jièshū jìlù?',['每天早上','每周日','三周以后','想起来的时候'],1,'时间信息'),
    readingQuestion('没读完的书应该怎样处理？','Méi dúwán de shū yīnggāi zěnyàng chǔlǐ?',['直接送给同学','一直留在家里','先确认能不能续借','把归还日期擦掉'],2,'条件判断')
  ]},
  {title:'让兴趣进入学习计划',role:'review',passage:'在朋友的影响下，我开始喜欢拍照。可是进入新年级以后，学习越来越忙，我不能只等有空再练。为了继续发展这个兴趣，我把拍照时间安排在周六下午，每周只选一张照片请同学提建议。这样既不影响复习，也能慢慢提高。',pinyin:'Zài péngyou de yǐngxiǎng xià, wǒ kāishǐ xǐhuan pāizhào. Kěshì jìnrù xīn niánjí yǐhòu, xuéxí yuèláiyuè máng, wǒ bù néng zhǐ děng yǒu kòng zài liàn. Wèile jìxù fāzhǎn zhège xìngqù, wǒ bǎ pāizhào shíjiān ānpái zài Zhōuliù xiàwǔ, měi zhōu zhǐ xuǎn yì zhāng zhàopiàn qǐng tóngxué tí jiànyì. Zhèyàng jì bù yǐngxiǎng fùxí, yě néng mànmàn tígāo.',questions:[
    readingQuestion('“我”为什么开始喜欢拍照？','“Wǒ” wèishénme kāishǐ xǐhuan pāizhào?',['因为朋友的影响','因为考试要求','因为老师借书','因为年级改变'],0,'在影响下'),
    readingQuestion('“我”把拍照时间安排在什么时候？','“Wǒ” bǎ pāizhào shíjiān ānpái zài shénme shíhou?',['每天晚上','周六下午','考试以前','后年'],1,'位置或时间安排'),
    readingQuestion('这个计划为什么比较现实？','Zhège jìhuà wèishénme bǐjiào xiànshí?',['完全停止复习','每周选择固定时间和一张照片','要求每天拍很多照片','只请别人完成'],1,'评价计划')
  ]}
];
const readPassages = readingRows.map((item,index) => ({id:'l10_read_' + String(index + 1).padStart(2,'0'),type:'passage_reading',stage:'in_class',contentRole:item.role,prompt_cn:'阅读短文，完成三道理解题。',prompt_en:'Read the passage and answer three comprehension questions.',correct_answer:item.questions.map(question => question.answer).join('；'),data:{title:item.title,passage:item.passage,passage_pinyin:item.pinyin,questions:item.questions}}));

const independentRows = [
  ['借来的词典','小周借了同桌的词典，原来说周五归还。周四晚上他还要查几个词，于是先给同桌发消息说明情况，并问能不能周一再还。同桌同意以后，小周马上把新的归还日期记在日历里。','小周为什么把新的归还日期记在日历里？','为了记住周一归还。',['为了记住周一归还。','为了把词典送给老师。','因为他不想再查词。','因为同桌不同意。'],'lesson'],
  ['考试中的三分钟','考试开始以后，林娜没有马上做题。她先用三分钟看清楚每一部分的要求，并把关键词圈出来。做完以后，她又按照题号检查了一遍。虽然这次题目比较难，但是她没有因为紧张而漏题。','考试开始以后，林娜先做了什么？','先看要求并圈出关键词。',['马上写所有答案。','先看要求并圈出关键词。','先问同学答案。','先把试卷交给老师。'],'lesson'],
  ['把问题分成三类','阿里复习时把问题分成三类：自己再看一遍就能明白的、可以和同学讨论的、需要请老师讲的。第二天，他只带着第三类问题去办公室，还写清了页码和自己的想法。','阿里把哪一类问题带给老师？','需要请老师讲的问题。',['自己能明白的问题。','可以和同学讨论的问题。','需要请老师讲的问题。','已经完全解决的问题。'],'transfer'],
  ['新年级的新目标','升入新年级以后，明月发现作业更多了。她没有简单地说“我要更努力”，而是把目标改成三个可以检查的行动：每天整理笔记、每周复习错题、月底比较一次变化。','明月把“更努力”变成了几个行动？','三个可以检查的行动。',['一个行动。','两个行动。','三个可以检查的行动。','五个行动。'],'transfer'],
  ['朋友的影响','朋友拍的校园照片让我开始注意每天经过的地方。我也开始拍照，但是没有完全照着朋友的方法做。我喜欢记录学习生活，所以把黑板、笔记和图书馆作为自己的主题。','作者为什么选择黑板、笔记和图书馆作为拍照主题？','因为他喜欢记录学习生活。',['因为老师要求他拍照。','因为他喜欢记录学习生活。','因为朋友只拍这些地方。','因为他不喜欢校园。'],'review']
];
const independent = independentRows.map((item,index) => ({id:'l10_ind_read_' + String(index + 1).padStart(2,'0'),type:'choice',stage:'in_class',contentRole:item[5],prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:item[0],passage:item[1],question_cn:item[2],options:item[4],correct_index:item[4].indexOf(item[3])},correct_answer:item[3]}));

const paragraphRows = [
  ['整理课堂笔记','老师把重点写在（1）上，我会认真记（2）。写作业以前，我再看一（3）。',['黑板','办公室'],['笔记','历史'],['遍','页']],
  ['考试以后','这次数学考得比较（1），因为我没看清楚（2）。明天还要考外语，我先认真（3）。',['差','清楚'],['要求','句子'],['复习','讲']],
  ['去问老师','书上第五（1）的（2）我看不懂，所以去办公室请老师再（3）一遍。',['页','遍'],['对话','年级'],['讲','提高']],
  ['归还资料','我先把书上的练习做一（1），明天再把书（2）给老师。这样做既认真，也符合老师的（3）。',['遍','句'],['还','写'],['要求','历史']],
  ['我的计划','我现在上二（1），后年要参加新的考试。为了实现目标，我会认真记笔记，遇到问题及时问，继续（2）学习，希望不断（3）。',['年级','办公室'],['努力','一般'],['提高','遇到']]
];
const paragraphOptionOrders = [[3,0,4,1,5,2],[1,3,5,0,4,2],[4,2,0,5,1,3],[2,4,0,3,1,5],[5,1,3,2,0,4]];
const paragraphs = paragraphRows.map((item,index) => { const flat=item.slice(2).flat(); const order=paragraphOptionOrders[index]; const options=order.map(k=>flat[k]); const answers=[options.indexOf(item[2][0]),options.indexOf(item[3][0]),options.indexOf(item[4][0])]; const passage=item[1].replace('（1）','____1____').replace('（2）','____2____').replace('（3）','____3____'); return {id:'l10_para_' + String(index + 1).padStart(2,'0'),type:'paragraph_fill',stage:'in_class',contentRole:roleFor(index,paragraphRows.length),prompt_cn:item[0],prompt_en:'Choose three words to complete the paragraph.',data:{title:item[0],passageParts:[passage],options,answers,optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange']}}; });

const chainRows = [
  ['一份清楚的笔记','今天的数学课开始了',['认真','黑板','笔记','作业','提高'],['rènzhēn','hēibǎn','bǐjì','zuòyè','tígāo']],
  ['考试复盘','昨天的考试结束以后',['要求','差','复习','外语','办公室'],['yāoqiú','chà','fùxí','wàiyǔ','bàngōngshì']],
  ['去问李老师','两个学生拿着书走进办公室',['页','对话','明白','讲','遍'],['yè','duìhuà','míngbai','jiǎng','biàn']],
  ['借书与还书','老师把一本书借给学生',['句子','练习','把','还给','明天'],['jùzi','liànxí','bǎ','huán gěi','míngtiān']],
  ['我的学习目标','新学期开始了',['年级','后年','一般','努力','影响'],['niánjí','hòunián','yìbān','nǔlì','yǐngxiǎng']]
];
const chains = chainRows.map((item,index,all) => ({id:'l10_chain_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'五词故事接龙。',prompt_en:'Build one story with five covered words.',openEnded:true,needsTeacherReview:true,data:{title:item[0],starter:item[1],steps:item[2].map((_,k) => `第${k+1}句：使用“${item[2][k]}”继续故事。`),keywords:item[2],keywords_pinyin:item[3],chainModes:['teacher','race','team'],instructions:'五个词先全部盖住，每次打开一个词并接一句，最后形成完整故事。',answerPlaceholder:'用当前打开的词继续故事。'}}));

const taskRows = [
  ['学习方法采访','同桌互访并给出一条可执行建议。',['认真','笔记','遍','提高'],['介绍一门想提高的科目。','说明现在的学习方法。','用“把”说清记录位置。','同伴提出一条建议。'],'两人各说至少四句。'],
  ['考试复盘会','把一次错误变成下一次行动计划。',['要求','差','复习','在学习上'],['描述一个具体错误。','找出原因。','说明下一次行动。'],'不公开真实分数也能完成。'],
  ['问题求助角色扮演','学生带着问题卡去问老师。',['页','对话','明白','讲一遍'],['说清页码和题号。','说明试过什么。','提出具体请求。','用自己的话确认理解。'],'三人轮换学生、同伴和老师。'],
  ['资料借还协商','练习借用、使用和按时归还资料。',['把','还给','明天','要求'],['说明借什么。','确认用途和时间。','约定归还。'],'完成一段自然对话。'],
  ['教育路径比较','尊重差异地介绍两地教育阶段。',['年级','一般','后年','努力'],['介绍教材中的一般情况。','介绍自己的情况。','说一个相同点和不同点。'],'每人都说明个人目标。']
];
const taskCards = taskRows.map((item,index,all) => ({id:'l10_task_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'任务卡：' + item[0] + '。',prompt_en:item[0],openEnded:true,needsTeacherReview:true,data:{title:item[0],titleEn:item[0],role:item[1],steps:item[3],keywords:item[2],output:item[4],answerPlaceholder:'请写下课堂表达。'}}));

const battleGames = {
  roulette:[
    {id:'l10_r_01',challenge:'介绍一种具体学习方法。',scene:'同学问你的数学为什么进步。',keywords:['认真','笔记','把'],sample:'我认真听课，把重点记在本子上。'},
    {id:'l10_r_02',challenge:'复盘一个考试问题并提出办法。',scene:'你因为没看清楚要求做错了题。',keywords:['要求','差','复习'],sample:'这次考得不理想，因为没看清要求；下次我会先圈关键词。'},
    {id:'l10_r_03',challenge:'清楚地向老师求助。',scene:'第五页的对话你看不懂。',keywords:['页','对话','讲一遍'],sample:'老师，第五页的对话我看不懂，请您再讲一遍。'},
    {id:'l10_r_04',challenge:'说明物品转移和归还时间。',scene:'你借了老师的练习书。',keywords:['把','还给','明天'],sample:'我今晚做练习，明天把书还给您。'}
  ],
  relay:[
    {id:'l10_relay_01',starter:'黑板上的重点',goal:'接一个位置改变的“把”字句。',mustUse:['把','记在']},
    {id:'l10_relay_02',starter:'学习问题',goal:'接一个“在……上/中/下”句。',mustUse:['在学习上','遇到']},
    {id:'l10_relay_03',starter:'借来的书',goal:'接一个关系转移的“把”字句。',mustUse:['把','还给']},
    {id:'l10_relay_04',starter:'我的目标',goal:'接一个 L09 复习目的句。',mustUse:['为了','练习']}
  ],
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：bǐjì',answer:'笔记'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：yāoqiú',answer:'要求'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：nǔlì',answer:'努力'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“认真”说一个短语。',answer:'认真听课 / 认真复习'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“提高”说一个短语。',answer:'提高成绩 / 提高水平'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“遇到”说一个短语。',answer:'遇到问题 / 遇到老师'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“在学习上”表示什么？',options:['学习这一方面','桌子上面','一个时间点'],answer:'学习这一方面'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“把书还给老师”表示什么？',options:['书转移回老师那里','书放在桌上','老师写书'],answer:'书转移回老师那里'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“把……写在……”说一句话。',answer:'我把名字写在本子上。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“在……帮助下”说一句话。',answer:'在老师的帮助下，我终于明白了。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“把……交给……”说一句话。',answer:'下课后我把作业交给老师。'}
  ]}
};

const homework = {
  mode:'hsk3_session_tasks',
  instructions:{required:'完成“我的学习方法与成长计划”的当次准备卡；A和B保存的材料必须用于C。',optional:'不需要上传录音；课堂展示可以携带自己的笔记示例、问题卡或教育阶段图。',aiPolicy:'先独立回顾自己的学习方法和真实问题，再使用工具检查语言。'},
  sessionMeta:{
    A:{label:'我的学习方法 · 第1步',goal:'选择一门想提高的科目，用具体步骤说明怎样听课、记笔记和复习。',suggested_minutes:'10-15分钟',suggested_mix:'完成学习方法卡；保存一张笔记示例或示意图，供B、C继续使用。'},
    B:{label:'我的学习方法 · 第2步',goal:'记录一个具体学习问题、已经尝试的办法和清楚的求助表达。',suggested_minutes:'10-15分钟',suggested_mix:'在A的方法卡上增加问题求助卡和下一步行动。'},
    C:{label:'课堂最终项目 · 我的学习方法与成长计划',goal:'整合A/B，完成1—2分钟课堂分享。',suggested_minutes:'15-20分钟',suggested_mix:'不强制上传录音；可小组彩排，但每位学生都要说。'}
  },
  sessions:{
    A:[
      {id:'post_l10_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'学习分享 1/3 · 选择科目',required:true,prompt_cn:'你最想提高哪一门课？你现在怎样听课、记笔记和复习？',prompt_en:'Which subject do you most want to improve? How do you currently listen, take notes and review?',answerPlaceholder:'我想提高……。上课时我……。写作业以前我……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l10_a_plan',type:'project_card',taskLabel:'学习方法卡',projectStage:'学习分享 1/3 · 保存到最终展示',required:true,prompt_cn:'准备一张真实笔记、自己制作的示意图或不含隐私的学习图片，说明科目、目标和三个具体步骤。至少用一次位置改变的“把”字句。',prompt_en:'Prepare one real note sample, your own diagram, or a privacy-safe study image. Explain the subject, goal and three concrete steps. Use one 把 sentence that describes where you put or record something.',answerPlaceholder:'科目：……。我想提高……。我认真……，把……记在……。写作业以前，我……。',needsTeacherReview:true,openEnded:true,wordBank:['数学','认真','笔记','清楚','黑板','把','作业','遍','提高'],picturePrompts:['一页不含私人信息的笔记或自制示意图','黑板重点与本子位置','作业前的复习步骤'],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框写4句话：科目、目标、记录位置和复习时间。'},
        {label:'标准层 / Core',instruction:'独立说明三个步骤，并用“把……写/记在……”连接物品与位置。'},
        {label:'挑战层 / Challenge',instruction:'解释每一步为什么有效，并比较现在和以前的方法。'}
      ]},
      {id:'post_l10_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Study Method Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Study Method Card',prompt_en:'Prepare your study image and three-step routine.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring one privacy-safe note sample, your own diagram, or a simple study image.',
        'Be ready to answer: Which subject do you want to improve? What do you do before, during and after class?',
        'Use at least four expressions from 数学, 认真, 笔记, 清楚, 黑板, 作业, 遍 and 提高.',
        'Use one location-change 把 sentence, such as 把重点记在本子上. You may rehearse with a partner; no audio upload is required.'
      ],classroomNote:'Keep this card. You will add a problem-and-help card in Homework B.'}
    ],
    B:[
      {id:'post_l10_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'学习分享 2/3 · 发现具体问题',required:true,prompt_cn:'你最近在学习上遇到了什么具体问题？你已经试过什么办法？',prompt_en:'What specific study problem have you encountered recently? What have you already tried?',answerPlaceholder:'在……上，我遇到……。我已经试过……，但是……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l10_b_plan',type:'project_card',taskLabel:'问题与求助卡',projectStage:'学习分享 2/3 · 保存问题和下一步',required:true,prompt_cn:'在A的学习方法卡上增加一个具体问题：写清科目、页码或题号、困难点、已经尝试的办法，以及要向同学或老师提出的具体请求。',prompt_en:'Add one specific problem to your Homework A card. State the subject, page or question number, difficulty, what you tried, and one clear request to a classmate or teacher.',answerPlaceholder:'在……上，我遇到……。第……页 / 第……题……。我试过……。请你 / 您……。',needsTeacherReview:true,openEnded:true,wordBank:['历史','难','要求','差','复习','外语','当然','遇到','办公室','在学习上'],picturePrompts:['一道不含答案和姓名的问题示意图','页码或题号','已经尝试的方法与下一步'],carryFrom:[{session:'A',taskId:'post_l10_a_plan',label:'A · 学习方法卡'}],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框写4—5句话，说明问题位置、困难和一个请求。'},
        {label:'标准层 / Core',instruction:'说明已经尝试的方法，并自然使用“在……上/中/下”中的一种。'},
        {label:'挑战层 / Challenge',instruction:'比较两种求助办法，解释哪一种更有效并提出后续检查方法。'}
      ]},
      {id:'post_l10_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Problem and Help Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Problem and Help Card',prompt_en:'Prepare one precise study problem and a clear request for help.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring your Homework A card and one privacy-safe problem card or simple diagram.',
        'Be ready to answer: What is the subject? Where is the problem? What did you try? What help do you need?',
        'Use one of 在学习上, 在考试中 or 在……的帮助下, and give a page or question number when relevant.',
        'Partners may role-play student and teacher. Keep personal grades private if you prefer; no audio upload is required.'
      ],classroomNote:'Save the problem, request and next step. You will combine them with Homework A in the final presentation.'}
    ],
    C:[
      {id:'post_l10_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'学习分享 3/3 · 组织展示',required:true,prompt_cn:'听众需要知道哪些信息，才能理解你的学习方法、问题、求助过程和下一阶段目标？',prompt_en:'What does your audience need to understand your study method, problem, help-seeking process and next-stage goal?',answerPlaceholder:'听众需要知道科目、方法、问题、求助、改进和目标。',needsTeacherReview:true,openEnded:true},
      {id:'post_l10_c_final',type:'portfolio_final',taskLabel:'最终展示稿',projectStage:'课堂大作业 · 我的学习方法与成长计划',required:true,prompt_cn:'整合A的学习方法卡和B的问题与求助卡，准备1—2分钟课堂分享。最后介绍自己的年级或学习阶段，并提出一个现实的下一步目标。',prompt_en:'Combine your Study Method Card from A with your Problem and Help Card from B. Prepare a 1–2 minute class presentation. Finish by introducing your grade or study stage and one realistic next goal.',answerPlaceholder:'我现在学习……。我认真……，把……记在……。在学习上，我遇到……。在……的帮助下，我……。我把……交给 / 还给……。我现在上……年级，下一步准备……。',needsTeacherReview:true,openEnded:true,wordBank:['认真','笔记','清楚','把','遍','提高','要求','复习','遇到','办公室','页','明白','年级','努力'],picturePrompts:['学习方法或笔记示意图','具体问题与求助卡','改进后的行动','个人学习阶段和下一步目标'],carryFrom:[
        {session:'A',taskId:'post_l10_a_plan',label:'A · 学习方法卡'},
        {session:'B',taskId:'post_l10_b_plan',label:'B · 问题与求助卡'}
      ],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框完成6—7句话，说明一种方法、一个问题和一个目标。'},
        {label:'标准层 / Core',instruction:'独立组织1—2分钟分享，讲清方法、原因、求助和改进。'},
        {label:'挑战层 / Challenge',instruction:'评价方法的效果，比较求助前后的变化，并尊重地连接不同教育阶段。'}
      ]},
      {id:'post_l10_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · My Study Method and Growth Plan',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Study Method and Growth Plan',prompt_en:'Present your learning project mainly in class.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring one to three images or diagrams plus your Study Method Card from A and Problem and Help Card from B.',
        'Answer: What do you want to improve? What is your routine? What problem did you encounter? What did you try? Who helped? What is your next goal?',
        'Use at least six lesson words and at least two lesson structures: a location-change 把 sentence, 在……上/中/下, or a transfer 把……给…… sentence.',
        'If you compare school stages, present the textbook description as a general case and respect regional and personal differences.',
        'Speak for 1–2 minutes. You may rehearse in pairs or small groups, but every student must speak. Audio upload is not required.'
      ],classroomNote:'Use the saved work from A and B. Mistakes and weak points stay collapsed until you choose to review them.'}
    ]
  }
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L10',lessonKey:'HSK3-L10',title:'你明天再把书还给我',titleEn:'You can return the book to me tomorrow',topic:'学习方法、考试复盘、有效求助、借还资料与教育阶段',courseModel:'三次课：介绍笔记方法 → 复盘考试并清楚求助 → 归还资料并完成学习成长分享',sourceTextPolicy:'四篇教材中文和拼音逐行保留；课文三“我看重”依据教材附注、同一行拼音 kàn bu dǒng 和英文 don’t understand 校订为“我看不懂”；课文四使用邮件布局；英文译文、教育体系说明、练习和任务属于教学扩展。',editorialNotes:[{textId:'t_hsk3_l10_03',status:'confirmed_correction',source:'书上第五页的这个对话我看重，小雪也不明白。',formal:'书上第五页的这个对话我看不懂，小雪也不明白。',evidence:'教材附注明确实际应为“我看不懂”；同一行拼音为 kàn bu dǒng，英文为 don’t understand。'}]},
  pedagogy:{exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'主观任务提供基础、标准、挑战三档支架；真实考试分数可以不公开，每位组员都要表达。',cultureFactPolicy:'教育体系只按教材概括为一般情况；比较不同地区时尊重制度和个人路径差异。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：介绍学习方法和笔记习惯',textIds:['t_hsk3_l10_01'],previewMissionId:'pm_hsk3_l10_a',focus:['数学学习方法','认真记笔记','把……记在……','学习方法卡']},
    {id:'B',title:'第二次课：复盘考试并有效求助',textIds:['t_hsk3_l10_02'],previewMissionId:'pm_hsk3_l10_b',focus:['考试问题和原因','在……上/中/下','整理问题并求助','问题与求助卡']},
    {id:'C',title:'第三次课：问问题、还书和介绍学习阶段',textIds:['t_hsk3_l10_03','t_hsk3_l10_04'],previewMissionId:'pm_hsk3_l10_c',focus:['页码与困难点','把……还给……','教育阶段与个人目标','1—2分钟学习成长分享']}
  ],
  vocabScenes:sceneData,vocabulary,grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(item => [item.id,{session:item.tags[0],phrases:item.phrases,sourceType:item.sourceType}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l10_a',vocabularyIds:vocabulary.map(item => item.id),grammarIds:grammar.map(item => item.id),progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L10-v1'},reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],readingData:[{id:'pre_l10_read',title:'我的学习方法与成长计划',text:'我先介绍一种具体学习方法，再整理一个学习问题和求助办法。最后，我会把两张卡合在一起，完成课堂学习成长分享。'}]},
  inClass:{questionGroups:{
    v5_vocab_fill:fills,g1_ordering:orders,r2_passage_choice:readPassages,t2_task_card:taskCards,battleGames,scene_sentence_choice:sceneChoices,v7_word_match:matchGroups,v6_description_guess:guesses,v2_say_guess:sayGuess,v3_blind_box:blind,g2_picture_complete:pictureComplete,r3_independent_reading:independent,r4_paragraph_fill:paragraphs,t3_chain_sentence:chains,
    info_match:[
      {id:'l10_info_01',type:'info_match',stage:'in_class',prompt_cn:'人物与信息匹配。',prompt_en:'Match each person with the information.',data:{people:['刘小雪','同学','李老师','家月姐姐'],clues:['认真记笔记并分享学习方法','考试后复盘并一起去求助','重新讲解并借练习书','影响刘小雪开始喜欢拍照'],answer:['刘小雪-认真记笔记并分享学习方法','同学-考试后复盘并一起去求助','李老师-重新讲解并借练习书','家月姐姐-影响刘小雪开始喜欢拍照']}},
      {id:'l10_info_02',type:'info_match',stage:'in_class',prompt_cn:'结构与功能匹配。',prompt_en:'Match each structure with its communicative job.',data:{people:['把……放在/到……','在……上','在……中','在……影响/帮助下','把……还给……'],clues:['说明位置改变','说明方面或范围','说明环境或时间','说明条件或影响','说明关系转移'],answer:['把……放在/到……-说明位置改变','在……上-说明方面或范围','在……中-说明环境或时间','在……影响/帮助下-说明条件或影响','把……还给……-说明关系转移']}}
    ],
    pk_question:[
      ['我把重点记____本子上。','在',['给','在','中','下'],'位置改变的“把”字句'],
      ['____学习上遇到问题，可以问老师。','在',['把','遍','在','页'],'方面表达'],
      ['明天把书还____李老师。','给',['在','中','下','给'],'关系转移的“把”字句']
    ].map((item,index) => ({id:'l10_pk_' + String(index + 1).padStart(2,'0'),type:'choice',prompt_cn:item[0],prompt_en:'Choose the expression that completes the sentence.',correct_answer:item[1],kp:item[3],data:{question_cn:item[0],question_en:'Choose the expression that completes the sentence.',options:item[2],correct_index:item[2].indexOf(item[1])}})),
    textQa:[],pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{focus:['学习方法与笔记词汇','位置改变的“把”字句','在……上/中/下','关系转移的“把”字句','考试复盘与有效求助','教育阶段与个人目标','我的学习方法与成长计划'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应A/B/C五阶段预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'用A的学习方法卡和B的问题求助卡重新完成一次1分钟学习成长分享。'}]}
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log('Wrote ' + out);
