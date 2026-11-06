const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceRef = 'textbook data/HSK3/L17.txt';
const out = path.join(root, 'source/data-model/lessons/HSK3-L17.json');
const sourceType = 'teaching_extension';
const pad = (n) => String(n).padStart(2, '0');
const image = (name) => 'images/hsk3-l17/' + name + '.png';

const vocabRows = [
  ['向','xiàng','介词','to; toward',1,'expression','朝着某个方向或对着某个人',['向前走','向老师学习'],'以后我要多向认真的人学习。','Yǐhòu wǒ yào duō xiàng rènzhēn de rén xuéxí.'],
  ['楼梯','lóutī','名词','stairs',1,'context','楼与楼之间供人上下走的台阶',['走楼梯','楼梯那儿'],'我在楼梯那儿等你。','Wǒ zài lóutī nàr děng nǐ.'],
  ['害怕','hàipà','动词','fear; be afraid',1,'expression','心里不安，不敢面对',['很害怕','害怕见老师'],'我害怕见李老师。','Wǒ hàipà jiàn Lǐ lǎoshī.'],
  ['生气','shēngqì','动词','get angry',1,'expression','因为不高兴而发火',['别生气','怕老师生气'],'我怕李老师生气。','Wǒ pà Lǐ lǎoshī shēngqì.'],
  ['常见','chángjiàn','形容词','common',1,'understanding','经常可以看到或遇到',['很常见','常见的问题'],'做错事情是很常见的。','Zuòcuò shìqing shì hěn chángjiàn de.'],
  ['聪明','cōngming','形容词','smart; clever',1,'expression','学得快，想得明白',['很聪明','聪明的学生'],'有的人虽然很聪明，但是会在简单的事情中出错。','Yǒu de rén suīrán hěn cōngming, dànshì huì zài jiǎndān de shìqing zhōng chūcuò.'],
  ['错','cuò','名词','mistake',1,'expression','不正确的地方或结果',['做错事情','一个错'],'最近我做错了好几件事。','Zuìjìn wǒ zuòcuò le hǎo jǐ jiàn shì.'],
  ['认为','rènwéi','动词','think; consider',1,'expression','心里有一种看法',['我认为','认为很简单'],'因为他们认为事情简单，就不会认真去做。','Yīnwèi tāmen rènwéi shìqing jiǎndān, jiù bú huì rènzhēn qù zuò.'],
  ['到处','dàochù','副词','everywhere',2,'understanding','各个地方',['到处找','到处看看'],'同学们都在到处找工作呢。','Tóngxuémen dōu zài dàochù zhǎo gōngzuò ne.'],
  ['继续','jìxù','动词','go on; continue',2,'expression','一件事没有停，接着做',['继续学习','继续工作'],'我不想现在就工作，还想继续学习。','Wǒ bù xiǎng xiànzài jiù gōngzuò, hái xiǎng jìxù xuéxí.'],
  ['同意','tóngyì','动词','agree (with/to)',2,'expression','觉得别人的想法可以接受',['同意这个想法','父母同意'],'我爸妈也同意。','Wǒ bàmā yě tóngyì.'],
  ['可','kě','连词','but',2,'understanding','表示后面的意思和前面不同',['可我还没想好','可是不知道'],'可我还没想好学什么。','Kě wǒ hái méi xiǎnghǎo xué shénme.'],
  ['屋子','wūzi','名词','room',2,'context','房间',['那个屋子','走进屋子'],'我记得那个屋子里有些跟电脑有关的书。','Wǒ jìde nàge wūzi li yǒuxiē gēn diànnǎo yǒuguān de shū.'],
  ['有关','yǒuguān','动词/介词','have something to do with; about',2,'expression','有关系；关于',['跟电脑有关','有关的书'],'我记得那个屋子里有些跟电脑有关的书。','Wǒ jìde nàge wūzi li yǒuxiē gēn diànnǎo yǒuguān de shū.'],
  ['关机','guānjī','动词短语','turn off a mobile phone',3,'understanding','手机或电脑停止工作',['手机关机','已经关机'],'你的手机怎么关机了？','Nǐ de shǒujī zěnme guānjī le?'],
  ['前天','qiántiān','名词','the day before yesterday',3,'expression','昨天的前一天',['前天看见','前天晚上'],'前天我看见家月了。','Qiántiān wǒ kànjiàn Jiāyuè le.'],
  ['留学','liúxué','动词','study abroad',3,'expression','到别的国家学习',['出国留学','继续留学'],'她告诉我你打算继续留学？','Tā gàosu wǒ nǐ dǎsuàn jìxù liúxué?'],
  ['国家','guójiā','名词','country',3,'expression','有共同土地和管理的地方',['哪个国家','很多国家'],'我更没想好去哪个国家。','Wǒ gèng méi xiǎnghǎo qù nǎge guójiā.'],
  ['比如','bǐrú','动词','for example; such as',3,'expression','举一个例子来说明',['比如北京','比如说'],'比如可以去北京、上海这样的大城市。','Bǐrú kěyǐ qù Běijīng, Shànghǎi zhèyàng de dà chéngshì.'],
  ['查','chá','动词','look up; consult',3,'expression','找资料，了解信息',['上网查','查一查'],'好，那我上网查一查。','Hǎo, nà wǒ shàngwǎng chá yi chá.'],
  ['有用','yǒuyòng','形容词','useful',3,'expression','能帮助解决问题',['有用的网站','很有用'],'我给你介绍几个有用的网站。','Wǒ gěi nǐ jièshào jǐ gè yǒuyòng de wǎngzhàn.'],
  ['容易','róngyì','形容词','easy',4,'expression','做起来不难',['不容易','很容易回答'],'这个问题真不容易回答。','Zhège wèntí zhēn bù róngyì huídá.'],
  ['回答','huídá','动词','answer',4,'expression','对问题说出答案或想法',['回答问题','不容易回答'],'这个问题真不容易回答。','Zhège wèntí zhēn bù róngyì huídá.'],
  ['方向','fāngxiàng','名词','direction',4,'expression','前进或选择的目标',['选择方向','不同方向'],'大家选择的方向都不同。','Dàjiā xuǎnzé de fāngxiàng dōu bù tóng.'],
  ['只有','zhǐyǒu','连词','only',4,'expression','说明不能少的条件',['只有……才……','只有这样'],'只有想清楚自己真正喜欢什么，才能做出最合适的选择。','Zhǐyǒu xiǎng qīngchu zìjǐ zhēnzhèng xǐhuan shénme, cái néng zuòchū zuì héshì de xuǎnzé.'],
  ['真正','zhēnzhèng','副词','really; indeed',4,'expression','确实，不是表面上的',['真正喜欢','真正了解'],'只有想清楚自己真正喜欢什么，才能做出最合适的选择。','Zhǐyǒu xiǎng qīngchu zìjǐ zhēnzhèng xǐhuan shénme, cái néng zuòchū zuì héshì de xuǎnzé.'],
  ['难题','nántí','名词','difficult problem',4,'expression','不容易解决的问题',['一个难题','解决难题'],'想清楚“真正喜欢什么”是个难题。','Xiǎng qīngchu “zhēnzhèng xǐhuan shénme” shì ge nántí.']
];

const textSession = {1:'A',2:'B',3:'C',4:'C'};
const vocabulary = vocabRows.map((r, i) => ({
  id:'v17_' + pad(i + 1),hanzi:r[0],pinyin:r[1],pos:r[2],english:r[3],
  tags:[textSession[r[4]]],textId:r[4],tier:r[5],meaningCn:r[6],phrases:r[7],
  phraseSourceType:sourceType,example:r[8],examplePinyin:r[9],exampleSourceType:'textbook',
  meaningCnSourceType:sourceType,sourceType:'textbook',sourceRef
}));
const byWord = Object.fromEntries(vocabulary.map((v) => [v.hanzi,v]));
const card = (hanzi) => { const v=byWord[hanzi]; return {vocabularyId:v.id,hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,phrases:v.phrases,example:v.example,examplePinyin:v.examplePinyin,tier:v.tier}; };

const grammarRows = [
  {id:'g17_01',title:'介词“向”',titleEn:'Preposition 向',appliesTo:[1],scene:'动作朝向一个地方，或一个人向另一个人学习、请教。',structure:'向 + 地方/人 + 动作',explanation:'介词“向”后加代词、名词或名词性短语，表示动作的方向或对象。',variants:[['方向','向 + 地方 + 移动'],['对象','向 + 人 + 学习/请教/介绍']],followImage:'photo-text-1-careful-work',followTarget:'使用“向＋人＋学习”说出榜样和理由。',followSample:'我想向右边的同学学习，因为他做完以后会认真检查。',followPinyin:'Wǒ xiǎng xiàng yòubian de tóngxué xuéxí, yīnwèi tā zuòwán yǐhòu huì rènzhēn jiǎnchá.',oral:['你想向谁学习？','你遇到难题时会向谁请教？','你可以向谁介绍自己的计划？'],examples:[
    ['别再向前走了。','Bié zài xiàng qián zǒu le.','Do not walk forward any farther.','textbook'],
    ['以后我要多向认真的人学习。','Yǐhòu wǒ yào duō xiàng rènzhēn de rén xuéxí.','From now on, I will learn more from people who are careful.','textbook'],
    ['孩子一看见妈妈，就向她跑过去了。','Háizi yí kànjiàn māma, jiù xiàng tā pǎo guòqu le.','As soon as the child saw his mother, he ran toward her.','textbook'],
    ['我想向同桌学习，因为他做事很认真。','Wǒ xiǎng xiàng tóngzhuō xuéxí, yīnwèi tā zuòshì hěn rènzhēn.','I want to learn from my deskmate because he works carefully.','teaching_extension'],
    ['有问题的时候，我会向老师请教。','Yǒu wèntí de shíhou, wǒ huì xiàng lǎoshī qǐngjiào.','When I have a question, I ask the teacher for help.','teaching_extension']]},
  {id:'g17_02',title:'反问句“不是……吗？”',titleEn:'Rhetorical question 不是……吗？',appliesTo:[2],scene:'朋友根据已经知道的信息进行提醒、确认或提出建议。',structure:'主语 + 不是 + 已知情况 + 吗？',explanation:'反问句“不是……吗？”可表达不理解、不满、提醒或确认；否定形式表达肯定意思。',variants:[['友好提醒','你不是 + 已知情况 + 吗？+ 建议'],['确认疑问','事情不是 + 已知情况 + 吗？']],followImage:'photo-text-2-computer-books',followTarget:'用“不是……吗？”友好提醒，再补一句建议。',followSample:'你不是喜欢玩电脑吗？可以先看看这些有关的书。',followPinyin:'Nǐ bú shì xǐhuan wán diànnǎo ma? Kěyǐ xiān kànkan zhèxiē yǒuguān de shū.',oral:['朋友喜欢电脑但不知道学什么，你怎样提醒他？','朋友忘了带准备好的材料，你怎样确认？','怎样让“不是……吗？”听起来更友好？'],examples:[
    ['你不是喜欢玩电脑吗？你可以去看看跟电脑有关系的书。','Nǐ bú shì xǐhuan wán diànnǎo ma? Nǐ kěyǐ qù kànkan gēn diànnǎo yǒu guānxì de shū.','Do you not like computers? You can look at books related to computers.','textbook'],
    ['你不是说今天有事吗？你怎么来了？','Nǐ bú shì shuō jīntiān yǒu shì ma? Nǐ zěnme lái le?','Did you not say you were busy today? Why did you come?','textbook'],
    ['考试不是下个月吗？你怎么今天就开始复习了？','Kǎoshì bú shì xià ge yuè ma? Nǐ zěnme jīntiān jiù kāishǐ fùxí le?','Is the exam not next month? Why did you start reviewing today?','textbook'],
    ['你不是想继续学习吗？我们一起去图书馆看看吧。','Nǐ bú shì xiǎng jìxù xuéxí ma? Wǒmen yìqǐ qù túshūguǎn kànkan ba.','Do you not want to continue studying? Let us look in the library.','teaching_extension'],
    ['你不是对设计感兴趣吗？可以先查一查有关的课程。','Nǐ bú shì duì shèjì gǎn xìngqù ma? Kěyǐ xiān chá yi chá yǒuguān de kèchéng.','Are you not interested in design? You can first research related courses.','teaching_extension']]},
  {id:'g17_03',title:'递进复句“……，更……”',titleEn:'Progressive complex sentence ……，更……',appliesTo:[3],scene:'第一个想法还没有确定，第二个问题比第一个更难确定。',structure:'分句1，+ 更 + 分句2',explanation:'第二个分句表示在第一个分句的基础上程度更深一层。',variants:[['否定递进','没……，更没……'],['需要递进','要……，更要……'],['结果递进','会……，更……']],followImage:'photo-text-3-study-abroad-search',followTarget:'用“……，更……”说出两层准备内容。',followSample:'我想先了解学校的课程，更想了解这个方向适不适合我。',followPinyin:'Wǒ xiǎng xiān liǎojiě xuéxiào de kèchéng, gèng xiǎng liǎojiě zhège fāngxiàng shì bu shìhé wǒ.',oral:['学好中文要做什么？','选择学习地点时，你先想了解什么，更想了解什么？','准备留学要查什么，更要做什么？'],examples:[
    ['我还没想好学什么，更没想好去哪个国家。','Wǒ hái méi xiǎnghǎo xué shénme, gèng méi xiǎnghǎo qù nǎge guójiā.','I have not decided what to study, much less which country to go to.','textbook'],
    ['想提高中文水平要多听多看，更要多说多练。','Xiǎng tígāo Zhōngwén shuǐpíng yào duō tīng duō kàn, gèng yào duō shuō duō liàn.','To improve Chinese, listen and read more, and even more importantly speak and practise more.','textbook'],
    ['来中国学习，我学会了中文，更了解了中国文化。','Lái Zhōngguó xuéxí, wǒ xuéhuìle Zhōngwén, gèng liǎojiěle Zhōngguó wénhuà.','Studying in China, I learned Chinese and gained a deeper understanding of Chinese culture.','textbook'],
    ['选学校要看课程，更要看这个方向适不适合自己。','Xuǎn xuéxiào yào kàn kèchéng, gèng yào kàn zhège fāngxiàng shì bu shìhé zìjǐ.','When choosing a school, look at courses and, more importantly, whether the direction suits you.','teaching_extension'],
    ['我想了解这个国家，更想知道那里的大学生活。','Wǒ xiǎng liǎojiě zhège guójiā, gèng xiǎng zhīdào nàli de dàxué shēnghuó.','I want to learn about this country and even more about university life there.','teaching_extension']]},
  {id:'g17_04',title:'条件复句“只有……，才……”',titleEn:'Conditional complex sentence 只有……，才……',appliesTo:[4],scene:'从多个选择中先确定不可少的条件，再做决定。',structure:'只有 + 必要条件，+ 才 + 结果',explanation:'“只有”后是实现结果的必要条件；没有这个条件，一般不会产生“才”后的结果。',variants:[['一般条件','只有 + 条件，才 + 结果'],['能愿动词','只有 + 条件，才能/才会 + 结果']],followImage:'photo-text-4-next-step-plan',followTarget:'用“只有……，才……”说出做决定前的一项必要条件。',followSample:'只有先想清楚自己真正喜欢什么，我才能选择合适的方向。',followPinyin:'Zhǐyǒu xiān xiǎng qīngchu zìjǐ zhēnzhèng xǐhuan shénme, wǒ cái néng xuǎnzé héshì de fāngxiàng.',oral:['怎样才能选到适合自己的方向？','怎样才能真正提高中文水平？','决定工作还是继续学习以前要做什么？'],examples:[
    ['只有想清楚自己真正喜欢什么，才能做出最合适的选择。','Zhǐyǒu xiǎng qīngchu zìjǐ zhēnzhèng xǐhuan shénme, cái néng zuòchū zuì héshì de xuǎnzé.','Only by understanding what you truly like can you make the most suitable choice.','textbook'],
    ['只有每天锻炼身体，才会越来越健康。','Zhǐyǒu měitiān duànliàn shēntǐ, cái huì yuèláiyuè jiànkāng.','Only by exercising every day will you become healthier.','textbook'],
    ['只有多听、多说、多看，你的中文水平才能提高。','Zhǐyǒu duō tīng, duō shuō, duō kàn, nǐ de Zhōngwén shuǐpíng cái néng tígāo.','Only by listening, speaking and reading more can your Chinese improve.','textbook'],
    ['只有查清楚课程和费用，我才会决定去哪里学习。','Zhǐyǒu chá qīngchu kèchéng hé fèiyòng, wǒ cái huì juédìng qù nǎli xuéxí.','Only after checking courses and costs will I decide where to study.','teaching_extension'],
    ['只有认真了解自己，我才能选择合适的方向。','Zhǐyǒu rènzhēn liǎojiě zìjǐ, wǒ cái néng xuǎnzé héshì de fāngxiàng.','Only by understanding myself carefully can I choose a suitable direction.','teaching_extension']]}
];

const grammar = grammarRows.map((g) => ({
  id:g.id,title:g.title,titleEn:g.titleEn,appliesTo:g.appliesTo,scene:g.scene,sceneSourceType:sourceType,
  structure:g.structure,structureSourceType:'textbook',explanation:g.explanation,explanationSourceType:'textbook',
  sourceType:'textbook',sourceRef,examples:g.examples.map((e) => ({hanzi:e[0],pinyin:e[1],english:e[2],sourceType:e[3],hanziSourceType:e[3],pinyinSourceType:e[3],englishSourceType:e[3]})),
  editorialNote:g.id==='g17_04'?'教材原始文件将“选择”误写为“名择”；已按用户确认更正。':null
}));

const textRows = [
  {id:'t_hsk3_l17_01',textId:1,title:'做错以后怎么办',format:'dialogue',genre:'对话',setting:'在教学楼里，刘小雪和同学边走边聊。',audio:'../../audio/HSK3/17-1.mp3',lines:[
    ['刘小雪','别再向前走了，李老师的办公室已经到了。','Bié zài xiàng qián zǒu le, Lǐ lǎoshī de bàngōngshì yǐjīng dào le.',"Don't walk forward anymore; Teacher Li's office is already here."],
    ['同学','你进去吧，我在楼梯那儿等你。我害怕见李老师。','Nǐ jìnqu ba, wǒ zài lóutī nàr děng nǐ. Wǒ hàipà jiàn Lǐ lǎoshī.',"You go in; I'll wait for you by the stairs. I'm afraid of seeing Teacher Li."],
    ['刘小雪','怎么回事？','Zěnme huí shì?',"What's the matter?"],
    ['同学','最近我做错了好几件事，我怕李老师生气。','Zuìjìn wǒ zuòcuò le hǎo jǐ jiàn shì, wǒ pà Lǐ lǎoshī shēngqì.',"I've done several things wrong recently, and I'm afraid Teacher Li is angry."],
    ['刘小雪','你想多了，做错事情是很常见的。','Nǐ xiǎng duō le, zuòcuò shìqing shì hěn chángjiàn de.',"You're overthinking. Making mistakes is very common."],
    ['同学','我把简单的事情做错了，李老师一定觉得我不认真。','Wǒ bǎ jiǎndān de shìqing zuòcuò le, Lǐ lǎoshī yídìng juéde wǒ bù rènzhēn.',"I made mistakes on simple things; Teacher Li must think I'm not being conscientious."],
    ['刘小雪','有的人虽然很聪明，但是会在简单的事情中出错，因为他们认为事情简单，就不会认真去做。','Yǒu de rén suīrán hěn cōngming, dànshì huì zài jiǎndān de shìqing zhōng chūcuò, yīnwèi tāmen rènwéi shìqing jiǎndān, jiù bú huì rènzhēn qù zuò.',"Some people are very smart, but make mistakes in simple things because they assume it's easy and don't take it seriously."],
    ['同学','你说得就是我，以后我要多向认真的人学习。','Nǐ shuō de jiù shì wǒ, yǐhòu wǒ yào duō xiàng rènzhēn de rén xuéxí.',"You're describing me! From now on, I need to learn more from conscientious people."]]},
  {id:'t_hsk3_l17_02',textId:2,title:'去图书馆找方向',format:'dialogue',genre:'对话',setting:'在阅览室门口，白家月碰到了陈天中。',audio:'../../audio/HSK3/17-3.mp3',lines:[
    ['白家月','太阳从西边出来了？这几天怎么总是在图书馆看见你？','Tàiyáng cóng xībian chūlai le? Zhè jǐ tiān zěnme zǒngshì zài túshūguǎn kànjiàn nǐ?',"Did the sun rise from the west? How come I always see you in the library these days?"],
    ['陈天中','这有什么奇怪的？我是来学习的。','Zhè yǒu shénme qíguài de? Wǒ shì lái xuéxí de.',"What's so strange about that? I came to study."],
    ['白家月','你怎么还来图书馆学习？同学们都在到处找工作呢。','Nǐ zěnme hái lái túshūguǎn xuéxí? Tóngxuémen dōu zài dàochù zhǎo gōngzuò ne.',"Why are you still coming to the library to study? The other classmates are all looking for jobs everywhere."],
    ['陈天中','我不想现在就工作，还想继续学习，我爸妈也同意。可我还没想好学什么，所以来图书馆看看。','Wǒ bù xiǎng xiànzài jiù gōngzuò, hái xiǎng jìxù xuéxí, wǒ bàmā yě tóngyì. Kě wǒ hái méi xiǎnghǎo xué shénme, suǒyǐ lái túshūguǎn kànkan.',"I don't want to work right now; I'd like to continue studying, and my parents agree. But I haven't decided what to study yet, so I came to the library to look around."],
    ['白家月','你不是喜欢玩电脑吗？你可以去看看跟电脑有关系的书。','Nǐ bú shì xǐhuan wán diànnǎo ma? Nǐ kěyǐ qù kànkan gēn diànnǎo yǒu guānxì de shū.',"Don't you like working with computers? You can go check out some books related to computers."],
    ['陈天中','你说得对，我记得那个屋子里有些跟电脑有关的书，我去找找。','Nǐ shuō de duì, wǒ jìde nàge wūzi li yǒuxiē gēn diànnǎo yǒuguān de shū, wǒ qù zhǎozhao.',"You're right. I remember there are some books related to computers in that room; I'll go have a look."]]},
  {id:'t_hsk3_l17_03',textId:3,title:'查一查留学信息',format:'dialogue',genre:'对话',setting:'在校园里，李文和陈天中在聊天儿。',audio:'../../audio/HSK3/17-5.mp3',lines:[
    ['李文','天中，你的手机怎么关机了？','Tiānzhōng, nǐ de shǒujī zěnme guānjī le?',"Tianzhong, why was your phone turned off?"],
    ['陈天中','我的手机没电了。你找我有事吗？','Wǒ de shǒujī méi diàn le. Nǐ zhǎo wǒ yǒu shì ma?',"My phone ran out of battery. Did you need something from me?"],
    ['李文','前天我看见家月了，她告诉我你打算继续留学？','Qiántiān wǒ kànjiàn Jiāyuè le, tā gàosu wǒ nǐ dǎsuàn jìxù liúxué?',"I saw Jiayue the day before yesterday, and she told me you plan to continue studying abroad?"],
    ['陈天中','是，可是我还没想好学什么，更没想好去哪个国家。','Shì, kěshì wǒ hái méi xiǎnghǎo xué shénme, gèng méi xiǎnghǎo qù nǎge guójiā.',"Yes, but I haven't figured out what to study yet, much less which country to go to."],
    ['李文','你可以去中国学中文啊。比如可以去北京、上海这样的大城市，那里有很多好大学，也有很多留学生。','Nǐ kěyǐ qù Zhōngguó xué Zhōngwén a. Bǐrú kěyǐ qù Běijīng, Shànghǎi zhèyàng de dà chéngshì, nàli yǒu hěn duō hǎo dàxué, yě yǒu hěn duō liúxuéshēng.',"You can go to China to learn Chinese. For example, you could go to big cities like Beijing or Shanghai; there are many great universities and international students there."],
    ['陈天中','好，那我上网查一查。','Hǎo, nà wǒ shàngwǎng chá yi chá.',"Okay, then I'll look it up online."],
    ['李文','我给你介绍几个有用的网站。','Wǒ gěi nǐ jièshào jǐ gè yǒuyòng de wǎngzhàn.',"Let me recommend a few useful websites for you."]]},
  {id:'t_hsk3_l17_04',textId:4,title:'毕业后的选择',format:'diary',genre:'日记',author:'陈天中',setting:'在家里，陈天中在写日记。',audio:'../../audio/HSK3/17-7.mp3',lines:[
    ['陈天中','大学生活马上就要结束了，我最近经常被问到一个问题——“你以后想做什么”，这个问题真不容易回答。我也问了几个同学，大家选择的方向都不同。有的想继续在学校学习，有的打算出国留学，还有的决定先找工作。我认为只有想清楚自己真正喜欢什么，才能做出最合适的选择。对我来说，想清楚“真正喜欢什么”是个难题。','Dàxué shēnghuó mǎshàng jiù yào jiéshù le, wǒ zuìjìn jīngcháng bèi wèndào yí gè wèntí——“nǐ yǐhòu xiǎng zuò shénme”, zhège wèntí zhēn bù róngyì huídá. Wǒ yě wènle jǐ gè tóngxué, dàjiā xuǎnzé de fāngxiàng dōu bù tóng. Yǒude xiǎng jìxù zài xuéxiào xuéxí, yǒude dǎsuàn chūguó liúxué, hái yǒude juédìng xiān zhǎo gōngzuò. Wǒ rènwéi zhǐyǒu xiǎng qīngchu zìjǐ zhēnzhèng xǐhuan shénme, cái néng zuòchū zuì héshì de xuǎnzé. Duì wǒ lái shuō, xiǎng qīngchu “zhēnzhèng xǐhuan shénme” shì ge nántí.',"University life is about to end. Recently, I am often asked a question—'What do you want to do in the future?' This question is really not easy to answer. I also asked several classmates, and everyone chose a different direction. Some want to continue studying at school, some plan to study abroad, and others decide to find a job first. I think only by figuring out what you truly like can you make the most suitable choice. For me, figuring out what I 'truly like' is a difficult problem."] ]}
];

const texts = textRows.map((t) => ({...t,session:textSession[t.textId],audioStatus:'available',audioSourceType:'textbook',sourceType:'textbook',sourceRef,lines:t.lines.map((line,i)=>({id:t.id+'_line_'+pad(i+1),speaker:line[0],hanzi:line[1],pinyin:line[2],english:line[3],sourceType:'textbook',hanziSourceType:'textbook',pinyinSourceType:'textbook',englishSourceType:'textbook'}))}));

const sessions = [
  {id:'A',title:'第一次课：我想向谁学习',textIds:[texts[0].id],previewMissionId:'pm_hsk3_l17_a',communicativeGoal:'介绍一个自己想向他或她学习的人，并说明理由。',grammarIds:['g17_01'],classroomOutput:'30—45秒“我想向谁学习”',sourceType},
  {id:'B',title:'第二次课：我的学习方向',textIds:[texts[1].id],previewMissionId:'pm_hsk3_l17_b',communicativeGoal:'说出自己想继续学习的内容，并请同学给一个建议。',grammarIds:['g17_02'],classroomOutput:'30—45秒“我的学习方向”',sourceType},
  {id:'C',title:'第三次课：我的下一步计划',textIds:[texts[2].id,texts[3].id],previewMissionId:'pm_hsk3_l17_c',communicativeGoal:'介绍想去学习的地方和准备办法，并说明毕业后想工作还是继续学习以及理由。',grammarIds:['g17_03','g17_04'],classroomOutput:'1—2分钟“My Next Step Plan”',sourceType}
];

const sceneSpecs = [
  [1,'l17_vocab_scene_t1_01','办公室门口的担心','photo-text-1-office-stairs','同学为什么站在楼梯旁边，不进李老师的办公室？','看办公室门、楼梯、同学的表情和刘小雪的动作。',['楼梯','害怕','生气','错'],[['楼梯',18,58]],['他害怕李老师生气，所以在楼梯那儿等。','刘小雪认为做错事情很常见。']],
  [1,'l17_vocab_scene_t1_02','认真检查的小事','photo-text-1-careful-work','两个学生做同一件小事，谁做得更认真？为什么？','看桌面、检查动作和完成结果。',['聪明','错','认为','向'],[],['左边的学生很聪明，可是没有认真检查。','右边的学生做完以后又看了一次，我想向她学习。']],
  [2,'l17_vocab_scene_t2_01','图书馆门口的选择','photo-text-2-library-choice','陈天中为什么最近总来图书馆？','看阅览室、求职资料、学习资料和他的选择。',['到处','继续','同意'],[],['同学们在到处找工作，可是他还想继续学习。','他还没想好学什么，所以来图书馆看看。']],
  [2,'l17_vocab_scene_t2_02','去找电脑书','photo-text-2-computer-books','白家月给了陈天中什么建议？','看电脑书架、两个人指向的书和屋子位置。',['屋子','有关','继续'],[['屋子',52,24]],['她说他不是喜欢玩电脑吗，可以看看有关的书。','他同意这个建议，准备去那个屋子找书。']],
  [3,'l17_vocab_scene_t3_01','没电的手机和计划','photo-text-3-phone-and-plan','李文为什么没有联系上陈天中？他们后来在说什么？','看没电的手机、两个人和留学资料。',['关机','前天','留学','国家'],[['关机',45,45]],['陈天中的手机没电了，所以关机了。','他们在说继续留学的计划。']],
  [3,'l17_vocab_scene_t3_02','上网查留学信息','photo-text-3-study-abroad-search','陈天中要怎么准备？','看电脑、地图、大学资料和检查表。',['比如','查','有用','国家'],[],['他要上网查课程和学校，更要想这个方向适不适合自己。','李文会给他介绍几个有用的网站。']],
  [4,'l17_vocab_scene_t4_01','毕业后的三条路','photo-text-4-graduation-paths','毕业以后，同学们有哪些不同选择？','看继续学习、出国留学、找工作三种准备。',['方向','回答','容易'],[],['有的同学继续学习，有的出国留学，还有的先找工作。','大家选择的方向不同。']],
  [4,'l17_vocab_scene_t4_02','想清楚下一步','photo-text-4-next-step-plan','做选择以前，陈天中需要先想清楚什么？','看兴趣卡、方向卡、计划表和思考中的人物。',['只有','真正','难题','方向'],[],['这个问题不容易回答，对他来说是一个难题。','只有想清楚自己真正喜欢什么，才能做出合适的选择。']]
];

const vocabScenes = Object.fromEntries([1,2,3,4].map((n)=>[String(n),{title:'课文'+n+'词汇场景',steps:sceneSpecs.filter((s)=>s[0]===n).map((s)=>({id:s[1],title:s[2],image:image(s[3]),prompt:s[4],promptPinyin:'',promptEn:'Observe the image and answer the specific scene question in Chinese.',talkHint:s[5],words:s[6].map(card),labels:s[7].map((x)=>({text:x[0],x:x[1],y:x[2]})),sampleAnswers:s[8],sourceType}))}]));

const grammarTeachingNotes = Object.fromEntries(grammarRows.map((g,i)=>[g.id,{presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',scene:g.scene,observePrompt:'先观察例句中反复出现的部分，再说它帮助我们表达什么。',observeHighlights:g.examples.map((e)=>e[0].split(/[，。；？]/).filter(Boolean)),examples:grammar[i].examples,visualLearning:{leadExamples:[grammar[i].examples[0]],blocks:g.structure.split('+').map((x)=>x.trim()),blockLabelsEn:['condition or topic','cue','person or action','result']},oralQuestions:g.oral.map((question)=>({question,pinyin:''})),structureVariants:g.variants.map((v)=>({label:v[0],formula:v[1],formulaEn:v[1],explanation:g.explanation,example:g.examples[0][0],examplePinyin:g.examples[0][1]})),followUp:[{image:image(g.followImage),promptEn:'Use the target structure to describe the image.',target:g.followTarget,sampleAnswer:g.followSample,samplePinyin:g.followPinyin}],editorialNote:g.id==='g17_04'?'教材原始文件将“选择”误写为“名择”；已按用户确认更正。':null,sourceType}]));

const overallRows = [
  [['l17_t1_overall_01','刘小雪和同学走到哪里了？',['图书馆门口','李老师办公室门口','学生宿舍'],1],['l17_t1_overall_02','同学见李老师前觉得怎么样？',['很高兴','很生气','很害怕'],2],['l17_t1_overall_03','同学以后想怎么做？',['多向认真的人学习','马上去找工作','不再见李老师'],0]],
  [['l17_t2_overall_01','白家月在哪里碰到陈天中？',['阅览室门口','教师办公室','学生宿舍'],0],['l17_t2_overall_02','陈天中现在还想做什么？',['马上找工作','继续学习','回家休息'],1],['l17_t2_overall_03','白家月建议他看什么？',['找工作的报纸','留学国家的地图','跟电脑有关的书'],2]],
  [['l17_t3_overall_01','陈天中的手机为什么关机了？',['手机坏了','手机没电了','他不想接电话'],1],['l17_t3_overall_02','他们在说陈天中的什么事？',['继续留学','做错事情','找电脑书'],0],['l17_t3_overall_03','李文最后准备做什么？',['帮他给手机充电','陪他去找老师','介绍几个有用的网站'],2]],
  [['l17_t4_overall_01','陈天中的大学生活怎么了？',['马上要结束了','刚刚开始','暂时停止了'],0],['l17_t4_overall_02','同学们毕业后的选择一样吗？',['一样，都找工作','不一样，有不同选择','一样，都去留学'],1],['l17_t4_overall_03','陈天中觉得做选择前要先做什么？',['先问所有同学','先去一个大城市','先想清楚真正喜欢什么'],2]]
];

const detailRows = [
  [
    ['同学准备在哪里等刘小雪？','Tóngxué zhǔnbèi zài nǎli děng Liú Xiǎoxuě?','在楼梯那儿等她。','Zài lóutī nàr děng tā.','等候地点'],
    ['同学为什么害怕见李老师？','Tóngxué wèishénme hàipà jiàn Lǐ lǎoshī?','因为最近做错了好几件事，怕李老师生气。','Yīnwèi zuìjìn zuòcuò le hǎo jǐ jiàn shì, pà Lǐ lǎoshī shēngqì.','害怕原因'],
    ['刘小雪觉得做错事情怎么样？','Liú Xiǎoxuě juéde zuòcuò shìqing zěnmeyàng?','她觉得做错事情很常见。','Tā juéde zuòcuò shìqing hěn chángjiàn.','安慰观点'],
    ['有些聪明的人为什么会做错简单的事情？','Yǒuxiē cōngming de rén wèishénme huì zuòcuò jiǎndān de shìqing?','因为他们认为事情简单，就不会认真去做。','Yīnwèi tāmen rènwéi shìqing jiǎndān, jiù bú huì rènzhēn qù zuò.','出错原因'],
    ['同学听完以后有什么打算？','Tóngxué tīngwán yǐhòu yǒu shénme dǎsuàn?','以后要多向认真的人学习。','Yǐhòu yào duō xiàng rènzhēn de rén xuéxí.','最后打算']
  ],
  [
    ['白家月为什么觉得在图书馆看见陈天中很奇怪？','Bái Jiāyuè wèishénme juéde zài túshūguǎn kànjiàn Chén Tiānzhōng hěn qíguài?','因为她平时不常在图书馆看见他。','Yīnwèi tā píngshí bù cháng zài túshūguǎn kànjiàn tā.','意外原因'],
    ['同学们这几天都在做什么？','Tóngxuémen zhè jǐ tiān dōu zài zuò shénme?','都在到处找工作。','Dōu zài dàochù zhǎo gōngzuò.','同学行动'],
    ['陈天中的父母同意什么？','Chén Tiānzhōng de fùmǔ tóngyì shénme?','同意他不马上工作、继续学习。','Tóngyì tā bù mǎshàng gōngzuò, jìxù xuéxí.','家人态度'],
    ['陈天中为什么来图书馆看看？','Chén Tiānzhōng wèishénme lái túshūguǎn kànkan?','因为还没想好学什么。','Yīnwèi hái méi xiǎnghǎo xué shénme.','来馆原因'],
    ['他最后准备去哪里找书？','Tā zuìhòu zhǔnbèi qù nǎli zhǎo shū?','去那个屋子里找跟电脑有关的书。','Qù nàge wūzi li zhǎo gēn diànnǎo yǒuguān de shū.','最后行动']
  ],
  [
    ['李文什么时候看见白家月了？','Lǐ Wén shénme shíhou kànjiàn Bái Jiāyuè le?','前天。','Qiántiān.','时间'],
    ['白家月告诉李文什么消息？','Bái Jiāyuè gàosu Lǐ Wén shénme xiāoxi?','陈天中打算继续留学。','Chén Tiānzhōng dǎsuàn jìxù liúxué.','消息内容'],
    ['陈天中还没想好哪两件事？','Chén Tiānzhōng hái méi xiǎnghǎo nǎ liǎng jiàn shì?','还没想好学什么，更没想好去哪个国家。','Hái méi xiǎnghǎo xué shénme, gèng méi xiǎnghǎo qù nǎge guójiā.','两个未定项'],
    ['李文建议他去哪里学什么？','Lǐ Wén jiànyì tā qù nǎli xué shénme?','去中国学中文。','Qù Zhōngguó xué Zhōngwén.','朋友建议'],
    ['陈天中和李文准备怎样找资料？','Chén Tiānzhōng hé Lǐ Wén zhǔnbèi zěnyàng zhǎo zīliào?','陈天中上网查，李文介绍几个有用的网站。','Chén Tiānzhōng shàngwǎng chá, Lǐ Wén jièshào jǐ ge yǒuyòng de wǎngzhàn.','查找方法']
  ],
  [
    ['陈天中最近经常被问什么问题？','Chén Tiānzhōng zuìjìn jīngcháng bèi wèn shénme wèntí?','“你以后想做什么？”','“Nǐ yǐhòu xiǎng zuò shénme?”','常见问题'],
    ['他觉得这个问题怎么样？','Tā juéde zhège wèntí zěnmeyàng?','真不容易回答。','Zhēn bù róngyì huídá.','作者感受'],
    ['同学们有哪三种选择？','Tóngxuémen yǒu nǎ sān zhǒng xuǎnzé?','继续学习、出国留学、先找工作。','Jìxù xuéxí, chūguó liúxué, xiān zhǎo gōngzuò.','三种方向'],
    ['怎样才能做出最合适的选择？','Zěnyàng cái néng zuòchū zuì héshì de xuǎnzé?','只有想清楚自己真正喜欢什么，才能做出最合适的选择。','Zhǐyǒu xiǎng qīngchu zìjǐ zhēnzhèng xǐhuan shénme, cái néng zuòchū zuì héshì de xuǎnzé.','必要条件'],
    ['对陈天中来说，什么是个难题？','Duì Chén Tiānzhōng lái shuō, shénme shì ge nántí?','想清楚“真正喜欢什么”是个难题。','Xiǎng qīngchu “zhēnzhèng xǐhuan shénme” shì ge nántí.','个人难题']
  ]
];

const applicationSpecs = [
  {listenPrompt:'先听对话，只找“在哪里、为什么不敢进去、最后决定向谁学习”。',pre:['做错一件小事以后，你一般会怎么做？','你觉得“聪明”和“认真”有什么不同？'],key:[['向前走／在楼梯那儿等','说明方向和地点'],['害怕见……','表达担心'],['做错事情很常见','安慰别人'],['认为事情简单','说明看法'],['向认真的人学习','说出学习对象']],culture:{title:'做错以后，认真改进',titleEn:'Learning from Mistakes',background:'Making a mistake does not mean a student is not smart. A useful response is to identify the cause, ask for help and change one action next time.',questions:['做错以后，除了害怕还可以做什么？','你觉得怎样才算做事认真？'],words:['错','害怕','认真','向……学习'],samples:['我会先告诉老师哪里做错了，再认真改。','做完以后再检查一次，我觉得这样很认真。']},nodes:[['办公室','他们走到哪里？'],['楼梯','同学为什么在这里等？'],['害怕','他担心什么？'],['原因','聪明的人为什么也会出错？'],['打算','最后决定怎么做？']],frame:'刘小雪和同学走到……。同学不敢……，因为……。刘小雪说做错事情……，有些聪明的人因为……也会出错。最后同学决定……。',personal:'你想向谁学习？为什么？',grammarIds:['g17_01'],paragraph:'l17_para_01',mini:'mini_l17_t1_role_model'},
  {listenPrompt:'先听对话，只找“他们在哪里、陈天中想继续做什么、白家月给了什么建议”。',pre:['如果还没想好学什么，你会去哪里找资料？','朋友不知道选什么时，你会怎样给建议？'],key:[['太阳从西边出来了','表示很意外'],['到处找工作','说明大家的行动'],['继续学习','说明个人选择'],['还没想好……','说明未决定'],['跟电脑有关的书','说明资料主题']],culture:{title:'友好地提醒和建议',titleEn:'Friendly Reminders and Advice',background:'The pattern 不是……吗 can confirm shared information, but tone matters. In peer advice, use a friendly voice and follow it with a practical suggestion.',questions:['白家月为什么用“不是……吗？”？','怎样说会更友好？'],words:['继续','同意','有关','建议'],samples:['她知道陈天中喜欢电脑，所以用这个信息提醒他。','可以说“你不是喜欢电脑吗？我们一起去看看有关的书吧。”']},nodes:[['偶遇','在哪里碰到？'],['别人','同学们在做什么？'],['选择','陈天中想做什么？'],['问题','他还没想好什么？'],['建议','白家月怎么帮他？']],frame:'白家月在……碰到陈天中。别的同学都在……，可是他想……，父母也……。因为他还没想好……，白家月提醒他说……。最后他准备……。',personal:'说说你想继续学习什么，并请同学给你一个建议。',grammarIds:['g17_02'],paragraph:'l17_para_02',mini:'mini_l17_t2_learning_direction'},
  {listenPrompt:'先听对话，只找“手机为什么关机、还没想好什么、最后要帮什么忙”。',pre:['选择一个学习地点以前，你想查哪些信息？','你会相信什么样的网站或资料？为什么？'],key:[['手机没电了','解释关机原因'],['打算继续留学','说明计划'],['还没想好……更没想好……','说明两层未决定'],['比如……','举例说明'],['上网查一查／有用的网站','说明准备方法']],culture:{title:'先查信息，再做选择',titleEn:'Research Before Choosing',background:'Study-abroad information should be checked carefully. Compare official school information, course content, cost and daily life instead of choosing only by city name.',questions:['选择学校以前应该查什么？','怎样判断一个网站有没有用？'],words:['留学','国家','查','有用'],samples:['我要查课程、费用和学校在哪里。','学校自己的网页和老师提供的资料比较可靠。']},nodes:[['手机','为什么关机？'],['消息','李文听到什么？'],['未定','哪两件事没想好？'],['建议','李文建议去哪里？'],['准备','他们怎么找资料？']],frame:'李文问手机为什么……。陈天中说……。他打算……，可是还没想好……，更没想好……。李文建议……，最后他们准备……。',personal:'介绍一个你想去学习的国家或城市，说说你要怎么准备？',grammarIds:['g17_03'],paragraph:'l17_para_03',mini:'mini_l17_t3_study_abroad_research'},
  {listenPrompt:'先听日记，只找“有哪些选择、先想清什么、什么是难题”。',pre:['以后想做什么，这个问题容易回答吗？','做一个重要选择以前，你会先想什么？'],key:[['马上就要结束了','说明时间临近'],['不容易回答','说明困难'],['选择的方向不同','说明多种选择'],['真正喜欢什么','说明个人兴趣'],['只有……才……','说明必要条件']],culture:{title:'不同的人，可以有不同方向',titleEn:'Different Paths Are Normal',background:'Continuing study, studying abroad and starting work are different choices. A thoughtful plan connects personal interests, reliable information and realistic conditions.',questions:['为什么同学们可以有不同选择？','“真正喜欢”是不是做选择时唯一要看的条件？'],words:['方向','真正','选择','难题'],samples:['每个人喜欢的事情和生活情况不同，所以方向可以不同。','还要看需要学什么、有什么条件，再做选择。']},nodes:[['结束','大学生活怎么了？'],['问题','大家常问什么？'],['方向','同学有哪些选择？'],['条件','先想清什么？'],['难题','作者还觉得什么难？']],frame:'陈天中的大学生活……。最近大家常问他……，这个问题……。同学们有的……，有的……，还有的……。他认为只有……，才……。可是对他来说……。',personal:'介绍你毕业以后的打算：工作还是继续学习？为什么？',grammarIds:['g17_04'],paragraph:'l17_para_04',mini:'mini_l17_t4_next_step_plan'}
];

const makeOverall=(row)=>({id:row[0],focus:'overall_understanding',question:row[1],pinyin:'',options:row[2],correctIndex:row[3],answer:row[2][row[3]],sourceType});
const makeDetail=(row,textNo,i)=>({id:'l17_t'+textNo+'_detail_'+pad(i+1),question:row[0],questionCn:row[0],pinyin:row[1],questionPinyin:row[1],answer:row[2],answerPinyin:row[3],acceptedAnswers:[row[2]],informationPoint:row[4],sourceType});
const textTeachingNotes=Object.fromEntries(texts.map((text,i)=>{const spec=applicationSpecs[i];const overallChoices=overallRows[i].map(makeOverall);const details=detailRows[i].map((r,j)=>makeDetail(r,i+1,j));const note={presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:spec.listenPrompt,audioStatus:'available',preReadingQuestions:spec.pre.map((question)=>({question,pinyin:''})),overallChoices,details,keyPoints:spec.key.map((k)=>({hanzi:k[0],pinyin:'',note:k[1]})),cultureDiscussion:{title:spec.culture.title,titleEn:spec.culture.titleEn,questions:spec.culture.questions,background:spec.culture.background,wordCards:spec.culture.words.map((hanzi)=>({hanzi,pinyin:byWord[hanzi]?.pinyin||'',english:byWord[hanzi]?.english||hanzi})),sampleAnswers:spec.culture.samples.map((hanzi)=>({hanzi,pinyin:''})),sourceType},retellScaffold:{nodes:spec.nodes.map((n)=>({label:n[0],hint:n[1]})),frame:spec.frame,promptEn:'Retell the text with the five prompts, then connect it to your own life.',sourceType},languageAndApplication:{grammarIds:spec.grammarIds,personalPrompt:spec.personal,paragraphPracticeId:spec.paragraph,miniId:spec.mini},sourceType};note.overallChoice=overallChoices;note.classQuestions=details;return [text.id,note];}));

const placeAnswer=(answer,distractors,index)=>{const opts=distractors.filter((x)=>x!==answer).slice(0,3);while(opts.length<3)opts.push('不符合题意');opts.splice(index,0,answer);return opts;};
const quiz=(id,question,answer,distractors,index)=>{const options=placeAnswer(answer,distractors,index);return {id,question,questionEn:'Choose the best answer.',options,correctIndex:index,answer,sourceType};};
const previewSpecs={
  A:{title:'第一次课课前热身赛',titleEn:'Who Do I Want to Learn From?',photo:'photo-text-1-office-stairs',words:['向','害怕','生气','聪明','错','认为','楼梯','常见'],background:'A mistake does not define a person. Careful action means checking, asking for help and improving next time.',contexts:[['我想____做事认真的同学学习。','向',['错','楼梯','认为']],['最近我做____了几件事。','错',['向','聪明','常见']],['他怕老师____，所以不敢进去。','生气',['认为','继续','同意']],['做错一件小事很____，重要的是认真改。','常见',['害怕','聪明','有关']],['她____事情简单，所以没有检查。','认为',['生气','楼梯','向']]],challenge:[['“向老师学习”中的“向”表示什么？','动作的对象',['一个房间','一个错误','一种感受']],['“害怕”最接近哪个意思？','心里不安、不敢面对',['非常聪明','马上同意','继续学习']],['同学为什么在楼梯那儿等？','他害怕见李老师',['他在找工作','手机没电','他想去留学']],['刘小雪觉得做错事情怎么样？','很常见',['很聪明','很有用','不容易']],['有些聪明的人为什么也会出错？','认为事情简单，没有认真做',['没有国家','不喜欢电脑','找不到楼梯']],['哪一句正确使用“向”？','我想向认真的人学习。',['我向很聪明。','楼梯向生气。','错向常见。']],['同学以后准备怎么做？','向认真的人学习',['到处找工作','马上关机','去国外留学']],['哪一个行为说明做事认真？','完成以后再检查一次',['觉得简单就不检查','做错后不说','害怕就离开']],['“聪明”和“认真”在课文里一样吗？','不一样，聪明的人也可能不认真',['完全一样','都表示害怕','都表示地点']],['完整介绍榜样至少要说什么？','一个人和一个理由',['只说名字','只说“聪明”','只读拼音']]]},
  B:{title:'第二次课课前热身赛',titleEn:'My Learning Direction',photo:'photo-text-2-library-choice',words:['到处','继续','同意','可','屋子','有关','认为','方向'],background:'A friendly reminder uses shared information and then gives one practical suggestion.',contexts:[['同学们都在____找工作。','到处',['继续','屋子','同意']],['我不想马上工作，还想____学习。','继续',['有关','到处','认为']],['父母也____他的学习计划。','同意',['可','屋子','方向']],['他去找跟电脑____的书。','有关',['继续','到处','同意']],['那些书就在那个____里。','屋子',['方向','认为','可']]],challenge:[['“继续”最接近哪个意思？','接着做，没有停',['各个地方','一个房间','表示转折']],['同学们在做什么？','到处找工作',['都在图书馆','都去留学','都在关机']],['陈天中想做什么？','继续学习',['马上工作','回家休息','见李老师']],['父母对他的计划怎么样？','同意',['生气','害怕','不知道']],['他为什么来图书馆？','还没想好学什么',['手机没电','要见老师','毕业了']],['哪一句是友好的提醒和建议？','你不是喜欢电脑吗？可以看看有关的书。',['你怎么什么都不知道？','你一定要听我的。','电脑不是屋子。']],['“有关”最接近哪个意思？','有关系；关于',['不正确','各个地方','不容易']],['陈天中最后去哪儿？','去那个屋子找电脑书',['去办公室','去找工作','去机场']],['“可”在课文里表示什么？','后面的意思和前面不同',['动作方向','必要条件','举例']],['完整说学习方向至少要有什么？','学习内容和请同学建议',['只说“继续”','只说一个地点','只说父母']]]},
  C:{title:'第三次课课前热身赛',titleEn:'My Next Step Plan',photo:'photo-text-3-study-abroad-search',words:['留学','国家','比如','查','有用','方向','真正','难题'],background:'Research useful information, name one way to prepare, then explain whether you plan to work or continue studying.',contexts:[['他打算继续____。','留学',['难题','方向','回答']],['我还没想好去哪个____。','国家',['有用','比如','真正']],['我先上网____一查课程和费用。','查',['回答','继续','同意']],['这个网站的信息很____。','有用',['容易','到处','生气']],['每个人选择的____可能不同。','方向',['国家','屋子','楼梯']]],challenge:[['手机为什么关机？','没电了',['丢了','坏了','不想学习']],['陈天中还没想好什么？','学什么和去哪个国家',['见哪个老师','买什么手机','找哪本小说']],['“比如”用来做什么？','举例说明',['表示害怕','表示方向','表示必要条件']],['哪一句正确使用“更”？','我要查课程，更要了解生活。',['我更课程查。','国家更比如。','查更有用网站。']],['李文最后怎样帮助陈天中？','介绍有用的网站',['给手机充电','替他做决定','陪他找工作']],['同学们毕业后有哪些选择？','学习、留学或工作',['只找工作','只去留学','只留在家里']],['“真正”最接近哪个意思？','确实，不是表面上的',['各个地方','比较容易','已经关机']],['哪一句正确使用“只有……才……”？','只有查清楚信息，才能做决定。',['只有我很方向。','才国家比如。','查只有很有用。']],['课文4中什么是陈天中的难题？','想清楚真正喜欢什么',['给手机充电','找到办公室','看电脑书']],['课文4终点任务要回答什么？','毕业后工作还是继续学习，并说明原因',['只说一个国家','只说手机没电','只介绍一本书']]]}
};

const previewMissions=sessions.map((session)=>{const key=session.id,lower=key.toLowerCase(),spec=previewSpecs[key],words=spec.words.map((w)=>byWord[w]),base='pre_l17_'+lower;const recognition=words.slice(0,4).map((v,i)=>quiz(base+'_rec_'+pad(i+1),'“'+v.hanzi+'”最接近哪个意思？',v.meaningCn,words.filter((x)=>x.id!==v.id).map((x)=>x.meaningCn),[0,1,2,3][i]));const contexts=spec.contexts.map((r,i)=>quiz(base+'_ctx_'+pad(i+1),r[0],r[1],r[2],[0,1,2,0,1][i]));const challenge=spec.challenge.map((r,i)=>quiz(base+'_ch_'+pad(i+1),r[0],r[1],r[2],[0,1,2,3,0,1,2,3,0,1][i]));return {id:'pm_hsk3_l17_'+lower,session:key,pilotMode:'ranked_vocab_preview_v1',title:spec.title,titleEn:spec.titleEn,subtitleEn:'Five stages prepare you for the next classroom task.',scenario:spec.titleEn,goals:[session.communicativeGoal,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:spec.background,storyRole:'Prepare one useful sentence for the next classroom task.',sourceType,stages:[{id:base+'_01',order:1,title:'认识词语、短语和背景',titleEn:'Meet the Words',interactionType:'study_list',photos:[{src:'../in-class/'+image(spec.photo),label:spec.titleEn}],keywordCards:words.map((v)=>({...card(v.hanzi),sourceType})),backgroundEn:spec.background,sourceType},{id:base+'_02',order:2,title:'认读与词义选择',titleEn:'Recognition',interactionType:'practice_quiz',questions:recognition,recognitionWordIds:words.slice(0,4).map((v)=>v.id),sourceType},{id:base+'_03',order:3,title:'中英文匹配',titleEn:'Chinese-English Match',interactionType:'timed_match',pairs:words.slice(0,6).map((v,i)=>({id:base+'_pair_'+pad(i+1),word:v.hanzi,meaning:v.english,sourceType})),sourceType},{id:base+'_04',order:4,title:'完整语境判断',titleEn:'Context Check',interactionType:'practice_quiz',questions:contexts,sourceType},{id:base+'_05',order:5,title:'有分数的最终挑战',titleEn:'Scored Challenge',interactionType:'ranked_quiz',questions:challenge,sourceType}],reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],persistenceKeyPattern:'ClassProPreview_HSK3-L17_'+key+'_{student}_{contentVersion}',contentVersion:'HSK3-L17-v1',completionMessageEn:'Preview complete. Bring one useful sentence to class.'};});

const rolePattern=['lesson','lesson','lesson','lesson','lesson','transfer','transfer','transfer','review','review'];
let roleIndex=0;
const tag=(item,role)=>({...item,contentRole:role||rolePattern[roleIndex++%rolePattern.length],sourceType});
const choice=(id,prompt,options,correctIndex,extra={})=>tag({id,type:'choice',prompt_cn:prompt,prompt_en:'Choose the best answer.',correct_answer:options[correctIndex],data:{question_cn:prompt,options,correct_index:correctIndex,answer:options[correctIndex],...extra}});
const open=(id,prompt,data={})=>tag({id,type:'open_response',prompt_cn:prompt,prompt_en:'Respond in complete Chinese.',openEnded:true,needsTeacherReview:true,data:{answerPlaceholder:'请写一个完整、自然的中文句子。',...data}});
const questionGroups={};

const fillSpecs=[
  ['a',['向','害怕','生气','错','认为'],[['我想____做事认真的同学学习。','向'],['他____见李老师，所以在楼梯旁边等。','害怕'],['他担心老师会____。','生气'],['最近他做____了几件简单的事。','错'],['他____事情简单，所以没有检查。','认为']]],
  ['b',['到处','继续','同意','屋子','有关'],[['同学们正在____找工作。','到处'],['陈天中还想____学习。','继续'],['父母也____他的计划。','同意'],['电脑书在那个____里。','屋子'],['这些书都跟电脑____。','有关']]],
  ['c',['留学','国家','查','方向','难题'],[['他打算继续____。','留学'],['他还没决定去哪个____。','国家'],['决定以前要先____资料。','查'],['每个人选择的____不同。','方向'],['想清楚真正喜欢什么是个____。','难题']]]
];
questionGroups.v5_vocab_fill=fillSpecs.map((g)=>tag({id:'l17_v5_'+g[0],type:'vocab_fill_group',prompt_cn:'选择词语完成五个完整句子。',data:{wordBank:g[1],sentences:g[2].map((s,i)=>({id:'l17_v5_'+g[0]+'_'+pad(i+1),sentence:s[0],answer:s[1],acceptedAnswers:[s[1]]}))}}));

const matchSpecs=[
  ['课文1：做错以后怎么办',[['同学为什么在楼梯那儿等？','因为他害怕见李老师。'],['他为什么怕李老师生气？','因为最近做错了好几件事。'],['刘小雪觉得做错事情怎么样？','她觉得这很常见。'],['聪明的人为什么也会出错？','因为觉得事情简单，没有认真做。'],['同学以后想向谁学习？','想向做事认真的人学习。']]],
  ['课文2：去图书馆找方向',[['陈天中为什么来图书馆？','因为还没想好学什么。'],['同学们这几天在做什么？','都在到处找工作。'],['父母同意他做什么？','同意他继续学习。'],['白家月给了什么建议？','去看看跟电脑有关的书。'],['陈天中最后去哪里找书？','去那个屋子里找。']]],
  ['课文3—4：准备和选择',[['手机为什么关机？','因为手机没电了。'],['陈天中还没想好哪两件事？','学什么和去哪个国家。'],['李文怎样帮他准备？','介绍几个有用的网站。'],['同学们毕业后有哪些选择？','学习、留学或先工作。'],['怎样才能做出合适的选择？','先想清楚自己真正喜欢什么。']]]
];
questionGroups.v7_word_match=matchSpecs.map((g,i)=>tag({id:'l17_v7_'+pad(i+1),type:'question_answer_match',prompt_cn:'把每个完整问题和合适的完整回答配对。',prompt_en:'Match each complete question with its complete answer.',data:{title:g[0],interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,pairs:g[1].map((p,j)=>({id:'l17_v7_'+pad(i+1)+'_'+pad(j+1),left:p[0],right:p[1]}))}}));

const orderSpecs=[
  ['我','想','向','认真的同学','学习','。'],
  ['你','不是','喜欢电脑','吗','？'],
  ['我','还没想好','学什么','，','更没想好','去哪个国家','。'],
  ['只有','想清楚','真正喜欢什么','，','才能','做出选择','。'],
  ['毕业以后','我','打算','继续学习','。']
];
questionGroups.g1_ordering=orderSpecs.map((chunks,i)=>tag({id:'l17_order_'+pad(i+1),type:'sentence_order',correct_answer:chunks.join(''),data:{chunks,answer:chunks.join('')}}));

const sceneChoices=[
  ['同学做错事情后很害怕，哪一句安慰最合适？',['做错事情很常见，我们一起看看哪里错了。','你一定很不聪明。','以后不要学习了。'],0],
  ['想说学习对象，哪一句正确？',['我向很认真。','我想向做事认真的同学学习。','认真向一个错。'],1],
  ['朋友喜欢电脑但不知道学什么，怎样友好建议？',['你什么都不知道。','你必须听我的。','你不是喜欢电脑吗？可以看看有关的书。'],2],
  ['同学们在找工作，陈天中怎么选择？',['他还想继续学习。','他马上回家。','他不再学习。'],0],
  ['准备留学时，哪一句有两层意思？',['我国家更。','我要查课程，更要了解生活。','我比如有用。'],1],
  ['做决定前，哪一句说出了必要条件？',['只有我方向。','才选择工作。','只有查清楚信息，才能做决定。'],2],
  ['哪一句能清楚介绍不同毕业方向？',['有人继续学习，有人留学，还有人先工作。','所有人只能工作。','大家都没有方向。'],0],
  ['想去一个城市学习，哪一种准备最实际？',['只看一张照片。','查课程、费用和生活信息。','不需要了解任何信息。'],1],
  ['毕业以后还没决定，哪一个回答比较完整？',['以后。','我不知道。','我想继续学习，因为这个方向适合我。'],2],
  ['朋友做事很认真，怎样说明你想改变？',['我想向他学习，做完以后也检查一次。','我只说他聪明。','我不想再做。'],0]
];
questionGroups.scene_sentence_choice=sceneChoices.map((r,i)=>choice('l17_scene_'+pad(i+1),r[0],r[1],r[2]));

const guessSpecs=[
  ['朝着某个方向，或者对着某个人',['向','楼梯','错'],0],
  ['心里不安，不敢面对',['聪明','害怕','同意'],1],
  ['心里有一种看法',['常见','生气','认为'],2],
  ['一件事没有停，接着做',['继续','到处','有关'],0],
  ['有关系；关于',['屋子','有关','可'],1],
  ['到别的国家学习',['国家','前天','留学'],2],
  ['找资料、了解信息',['查','回答','方向'],0],
  ['确实，不是表面上的',['容易','真正','有用'],1],
  ['不容易解决的问题',['选择','只有','难题'],2],
  ['前进或选择的目标',['方向','国家','屋子'],0]
];
questionGroups.v6_description_guess=guessSpecs.map((r,i)=>tag({id:'l17_guess_'+pad(i+1),type:'description_guess',prompt_cn:r[0],correct_answer:r[1][r[2]],data:{description:r[0],options:r[1],correct_index:r[2],answer:r[1][r[2]]}}));

const saySpecs=[
  ['认真做事','rènzhēn zuòshì','photo-text-1-careful-work',['检查','不着急','做完再看'],'描述一个人怎样认真完成小事。'],
  ['向老师学','xiàng lǎoshī xué','photo-text-1-office-stairs',['学习对象','请教','方向'],'说出一个可以学习或请教的人。'],
  ['害怕见面','hàipà jiànmiàn','photo-text-1-office-stairs',['担心','老师','不敢进去'],'描述一个人为什么不敢进去。'],
  ['做错事情','zuòcuò shìqing','photo-text-1-careful-work',['简单任务','检查','改正'],'描述一个常见的小错误。'],
  ['继续学习','jìxù xuéxí','photo-text-2-library-choice',['不马上工作','图书馆','方向'],'说出一个毕业后的学习选择。'],
  ['有关的书','yǒuguān de shū','photo-text-2-computer-books',['电脑','书架','屋子'],'让同学猜一本书和什么主题有关。'],
  ['出国留学','chūguó liúxué','photo-text-3-study-abroad-search',['国家','大学','查资料'],'描述去别的国家学习的计划。'],
  ['未来方向','wèilái fāngxiàng','photo-text-4-next-step-plan',['工作','学习','真正喜欢'],'描述毕业后要做的选择。']
];
questionGroups.v2_say_guess=saySpecs.map((r,i)=>tag({id:'l17_say_'+pad(i+1),type:'say_guess_card',prompt_cn:'你说我猜：不能直接说出词卡正面的短语。',data:{target:r[0],pinyin:r[1],image:image(r[2]),keywords:r[3],task:r[4],maxHanzi:5,covered:true}}));

const blindSpecs=[
  ['l17_blind_01','看认真检查的图片，说说你想向谁学习，为什么？','mini_l17_t1_role_model','photo-text-1-careful-work'],
  ['l17_blind_02','你想继续学习什么？请同学给一个建议。','mini_l17_t2_learning_direction','photo-text-2-computer-books'],
  ['l17_blind_03','介绍想去学习的地方，说说你要怎么准备。','mini_l17_t3_study_abroad_research','photo-text-3-study-abroad-search'],
  ['l17_blind_04','毕业以后想工作还是继续学习？说一个理由。','mini_l17_t4_next_step_plan','photo-text-4-next-step-plan']
];
questionGroups.v3_blind_box=blindSpecs.map((r)=>open(r[0],r[1],{miniId:r[2],image:image(r[3]),publishTarget:'shared_classroom_wall'}));

const pictureSpecs=[
  ['g17_01','photo-text-1-careful-work',['向','认真','学习'],'向＋人＋学习','我想向做事认真的同学学习。'],
  ['g17_01','photo-text-1-office-stairs',['向','办公室','走'],'向＋地方＋动作','他们向李老师的办公室走过去。'],
  ['g17_02','photo-text-2-computer-books',['不是','电脑','吗'],'不是……吗？','你不是喜欢电脑吗？可以看看有关的书。'],
  ['g17_02','photo-text-2-library-choice',['不是','继续学习','吗'],'不是……吗？','你不是想继续学习吗？我们一起找资料吧。'],
  ['g17_03','photo-text-3-study-abroad-search',['课程','更','生活'],'……，更……','我要查学校的课程，更要了解那里的生活。'],
  ['g17_03','photo-text-3-phone-and-plan',['国家','更','方向'],'……，更……','我想了解这个国家，更想知道这个方向适不适合我。'],
  ['g17_04','photo-text-4-graduation-paths',['只有','了解自己','才'],'只有……才……','只有了解自己，才能选择合适的方向。'],
  ['g17_04','photo-text-4-next-step-plan',['只有','查资料','才'],'只有……才……','只有查清楚信息，我才会做决定。']
];
questionGroups.g2_picture_complete=pictureSpecs.map((r,i)=>open('l17_picture_'+pad(i+1),'看图，用提示词和结构完成一句话。',{grammarId:r[0],image:image(r[1]),keywords:r[2],structure:r[3],targetStructure:r[3],sampleAnswer:r[4],publishTarget:'shared_classroom_wall'}));

const readingSpecs=[
  ['做完再检查一次','小林很聪明，作业也做得快。可是他觉得题目简单，做完从来不检查，所以常常有小错。今天他决定向做事认真的同桌学习：做完以后再看一次。',[['小林为什么常常出错？',['题目太难','没有认真检查','同桌不帮助他'],1],['他准备向谁学习？',['认真的同桌','李老师','找工作的同学'],0],['他准备怎样改变？',['不再做作业','只做简单题','做完再检查'],2]]],
  ['图书馆里的建议','美美还没想好毕业后学什么。她喜欢画画，也喜欢用电脑，所以来图书馆找有关的书。朋友说：“你不是对设计感兴趣吗？可以先了解一下。”她同意先查课程。',[['美美为什么来图书馆？',['找工作','找学习资料','等老师'],1],['朋友建议她了解什么？',['设计','运动','旅游'],0],['她最后决定先做什么？',['马上留学','回家休息','查课程'],2]]],
  ['准备去学习','大卫想去上海学习中文。他先查学校的课程和费用，更要了解住宿和交通。他还向去过上海的同学请教。准备好这些信息后，他再决定申请哪所学校。',[['大卫想去哪里学习？',['上海','北京','国外'],0],['他更要了解什么？',['老师名字','住宿和交通','手机价格'],1],['什么时候决定学校？',['看一张照片后','马上决定','准备好信息后'],2]]],
  ['不同的毕业计划','三个朋友毕业后的计划不同。小王想继续学习，因为他喜欢研究。小李准备先工作，想得到实际经验。小张打算留学，但要先查清楚课程和费用。',[['谁想继续学习？',['小王','小李','小张'],0],['小李为什么先工作？',['不喜欢学习','想得到实际经验','父母不同意'],1],['小张决定前要做什么？',['买新手机','问所有同学','查课程和费用'],2]]],
  ['选择适合自己的路','安娜收到两个学习机会。一个城市很有名，但课程不是她真正喜欢的；另一个城市比较小，课程却更适合她。她认为只有了解自己的兴趣和需要，才能做出合适的选择。',[['第一个城市怎么样？',['很有名','比较小','没有学校'],0],['哪个课程更适合安娜？',['第一个','第二个','都不适合'],1],['她认为选择前要做什么？',['只看城市名字','听别人决定','了解自己的兴趣和需要'],2]]]
];
questionGroups.r2_passage_choice=readingSpecs.map((r,i)=>tag({id:'l17_read_'+pad(i+1),type:'passage_choice_set',prompt_cn:r[0],data:{title:r[0],passage:r[1],questions:r[2].map((q,j)=>({id:'l17_read_'+pad(i+1)+'_q'+pad(j+1),question:q[0],options:q[1],correct_index:q[2],answer:q[1][q[2]]}))}}));

const independentSpecs=[
  ['领养以前先想一想','小雨很喜欢小狗，也想马上带一只回家。妈妈提醒她，家里人白天都很忙，没有人每天带小狗出去。小雨认真想了想，决定先去动物中心做志愿者。等家里有时间以后，再考虑领养。','这个家庭现在为什么不适合领养？',['家里没有时间每天照顾','小雨不喜欢动物','动物中心关门'],0],
  ['做完以后再看看','小周做题很快，可是经常有小错。老师没有生气，而是让他把每一步再看一次。小周发现自己常常因为觉得题目简单就不检查。从今天开始，他准备做完以后再看看。','小周为什么经常有小错？',['老师不帮助他','觉得简单就不检查','他从来不做题'],1],
  ['我想学设计','佳佳喜欢画画，也喜欢电脑。她还没决定毕业后做什么，于是去图书馆看有关设计的书。朋友建议她先查课程，再和学习设计的同学聊一聊。佳佳觉得这个办法很有用。','佳佳下一步准备怎么做？',['马上找工作','只买电脑','查课程并向同学了解'],2],
  ['两个留学城市','马克想去中国学习中文。他喜欢热闹的大城市，也希望生活费用不要太高。他查了北京和另一个城市的课程、住宿和交通，还问了老师。准备好这些信息以后，他才会决定。','马克为什么还没有决定？',['还需要比较信息','手机关机了','不想学习中文'],0],
  ['工作还是继续学习','毕业以后，林月可以先工作，也可以继续学习。她真正喜欢儿童教育，可是还不了解需要学习哪些课程。她决定先查资料、向老师请教，再选择方向。','她为什么先不做决定？',['父母生气','还不了解课程和条件','没有同学'],1]
];
questionGroups.r3_independent_reading=independentSpecs.map((r,i)=>choice('l17_ind_read_'+pad(i+1),r[2],r[3],r[4],{title:r[0],passage:r[1]}));

const paragraphSpecs=[
  ['我想向谁学习','我想向____学习，因为他/她____。我准备先改变____。',['谁','认真行为','自己的行动']],
  ['我的学习方向','我想继续学习____，因为____。我想请同学给我一个关于____的建议。',['内容','理由','建议主题']],
  ['我要怎么准备','我想去____学习。我先查____，更要了解____。',['地点','第一项信息','第二项准备']],
  ['毕业后的打算','毕业以后，我想先____，因为____。只有____，我才能____。',['工作/继续学习','理由','条件','结果']],
  ['我的下一步计划','我想向____学习。以后我想学____，准备____。毕业后我想____，因为____。',['榜样','方向','准备','选择','理由']]
];
questionGroups.r4_paragraph_fill=paragraphSpecs.map((r,i)=>open('l17_para_'+pad(i+1),'点击填写段落：《'+r[0]+'》',{title:r[0],template:r[1],fields:r[2],interaction:'click_to_fill'}));

const chainSpecs=[
  ['做错以后，我……',['错','害怕','常见','认真','向']],
  ['我想向……学习，因为……',['向','聪明','认真','认为','检查']],
  ['我还想继续学习……',['继续','方向','有关','同意','建议']],
  ['我想去……学习，准备……',['留学','国家','查','有用','更']],
  ['毕业以后，我想……',['工作','学习','真正','只有','选择']]
];
questionGroups.t3_chain_sentence=chainSpecs.map((r,i)=>open('l17_chain_'+pad(i+1),r[0],{starter:r[0],keywords:r[1],publishTarget:'shared_classroom_wall'}));

const taskSpecs=[
  ['你想向谁学习？为什么？','一个人＋一个理由','mini_l17_t1_role_model'],
  ['说说你想继续学习什么，并请同学给你一个建议。','学习内容＋请求建议','mini_l17_t2_learning_direction'],
  ['介绍一个你想去学习的国家或城市，说说你要怎么准备？','一个地点＋一种准备办法','mini_l17_t3_study_abroad_research'],
  ['介绍你毕业以后的打算：工作还是继续学习？为什么？','一个选择＋一个理由','mini_l17_t4_next_step_plan'],
  ['用1—2分钟介绍你的榜样、学习方向、准备办法和毕业后的打算。','四部分综合表达','mini_l17_complete_plan']
];
questionGroups.t2_task_card=taskSpecs.map((r,i)=>open('l17_task_'+pad(i+1),r[0],{output:r[0],minimum:r[1],miniId:r[2],publishTarget:'shared_classroom_wall'}));

questionGroups.pk_question=[
  choice('l17_pk_01','谁做事更认真？',['做完后检查的人','觉得简单就不看的人','害怕就离开的人'],0),
  choice('l17_pk_02','哪一句是友好的建议？',['你必须听我的。','你不是喜欢电脑吗？可以看看有关的书。','你什么都不知道。'],1),
  choice('l17_pk_03','哪一句说出了必要条件？',['我想继续学习。','我更喜欢这个城市。','只有查清楚信息，才能做决定。'],2)
];

questionGroups.contextTransfer=[
  open('l17_transfer_01','同学做错一件小事后很害怕。请先安慰，再给一个行动建议。',{keywords:['常见','认真','向老师请教']}),
  open('l17_transfer_02','朋友想继续学习但不知道学什么。请给一条友好建议。',{keywords:['不是……吗','有关','查']}),
  open('l17_transfer_03','比较两个学习地点，说说你要怎么准备。',{keywords:['更','查','有用']})
];
questionGroups.reviewSet=[
  choice('l17_review_01','哪一句正确使用“关于”？',['关于这个问题，我想先查资料。','我关于很聪明。','方向关于学习。'],0),
  choice('l17_review_02','哪一句能说明一般情况？',['我今天去图书馆。','一般来说，做决定前要了解信息。','他前天关机。'],1)
];
questionGroups.infoMatch=[
  tag({id:'l17_info_01',type:'info_match',prompt_cn:'把人物行动和原因配对。',prompt_en:'Match each action with its reason.',data:{pairs:[['在楼梯旁边等','害怕见李老师'],['来图书馆','还没想好学什么'],['上网查资料','准备留学选择']]}},'lesson'),
  tag({id:'l17_info_02',type:'info_match',prompt_cn:'把结构和功能配对。',prompt_en:'Match each structure with its function.',data:{pairs:[['向＋人＋学习','说出学习对象'],['不是……吗？','提醒或确认'],['……，更……','表达更深一层'],['只有……才……','说明必要条件']]}},'review')
];
questionGroups.textQa=texts.map((t,i)=>open('l17_text_qa_'+pad(i+1),'课文'+(i+1)+'：用两三句话回答核心问题。',{textId:t.id,question:['你想向谁学习？为什么？','你想继续学习什么？同学可以给什么建议？','你想去哪里学习？要怎么准备？','毕业后工作还是继续学习？为什么？'][i]}));
questionGroups.pictureTalk=sceneSpecs.map((s,i)=>open('l17_picture_talk_'+pad(i+1),'看图完成30秒表达：'+s[2]+'。',{image:image(s[3]),keywords:s[6],task:s[4],observationHint:s[5]}));

questionGroups.battleGames={
  roulette:[
    ['做错以后','学生把一件简单的事做错了','说说他可以怎么做。',['错','认真','继续'],'做错事情很常见，他应该认真看看哪里错了，再继续做。'],
    ['向谁学习','两位同学完成同一任务，一个会认真检查','选择一个学习对象并说明理由。',['向','聪明','认为'],'我想向会检查的同学学习，因为认真比只觉得事情简单更重要。'],
    ['害怕老师','同学做错事情后不敢进办公室','安慰他并给一个行动建议。',['害怕','生气','常见'],'别太害怕，做错事情很常见，你可以向老师说明情况。'],
    ['继续学习','大家在找工作，一名学生还想学习','说出他的选择和理由。',['到处','继续','同意'],'别人在到处找工作，可是他想继续学习，父母也同意。'],
    ['友好建议','朋友喜欢电脑但不知道学什么','用“不是……吗？”提醒并给建议。',['电脑','有关','书'],'你不是喜欢玩电脑吗？可以先看看跟电脑有关的书。'],
    ['怎么准备','学生还没决定国家和专业','说一个想去的地方和准备办法。',['留学','国家','查'],'我想去中国学习，准备先查课程和生活信息。'],
    ['三个方向','三位毕业生分别学习、留学、工作','用“比如”介绍不同选择。',['方向','比如','回答'],'大家方向不同，比如有人继续学习，有人先找工作。'],
    ['毕业打算','学生面对工作和继续学习两个选择','说出选择、条件和理由。',['真正','难题','只有'],'我想继续学习，因为我喜欢这个方向；只有了解课程，我才能做好准备。']
  ].map((r,i)=>({id:'l17_game_roulette_'+pad(i+1),challenge:r[0],scene:r[1],prompt:r[2],keywords:r[3],sample:r[4]})),
  relay:[
    {id:'l17_game_relay_01',starter:'我想向……学习，因为……',keywords:['向','认真','聪明']},
    {id:'l17_game_relay_02',starter:'你不是……吗？可以……',keywords:['继续','有关','建议']},
    {id:'l17_game_relay_03',starter:'我还没想好……，更没想好……',keywords:['留学','国家','方向']},
    {id:'l17_game_relay_04',starter:'只有……，才……',keywords:['真正','选择','准备']},
    {id:'l17_game_relay_05',starter:'毕业以后，我打算……',keywords:['工作','学习','理由']}
  ],
  monopoly:{theme:'light',boardShape:'winding',tasks:[
    '解释“向”并造句','说出一个做事认真的行为','安慰做错事的同学','介绍想学习的榜样',
    '说出一个想继续学习的内容','用“不是……吗？”给建议','解释“有关”并造句','说出图书馆能帮什么忙',
    '介绍一个想去学习的城市','说出两项准备内容','用“更”完成一句话','介绍一个有用的信息来源',
    '说出毕业后的两种选择','用“只有……才……”说条件','说明工作或学习的理由','完成30秒下一步计划'
  ].map((prompt,i)=>({id:'l17_game_monopoly_'+pad(i+1),type:['vocabulary','grammar','text','task'][i%4],prompt}))},
  studentRosterSource:'source/shared/students.js',sourceType
};

const sessionTests=[
  {id:'l17_test_a',session:'A',title:'Test A：认真与学习对象',audio:['../../audio/HSK3/17-1.mp3'],focus:['课文1','T1词汇','g17_01'],sections:[{type:'listening',prompt:'听17-1.mp3，选择同学最后的打算。',answer:'多向认真的人学习。'},{type:'vocabulary',questionIds:['l17_v5_a_01','l17_guess_01']},{type:'grammar',questionIds:['l17_order_01','l17_pk_01']},{type:'speaking',prompt:'说出一个想学习的人和一个理由。',minimum:'一个人＋一个理由'}],questionIds:['l17_order_01','l17_scene_01','l17_pk_01','l17_task_01'],audioRequired:true,sourceType},
  {id:'l17_test_b',session:'B',title:'Test B：我的学习方向',audio:['../../audio/HSK3/17-3.mp3'],focus:['课文2','T2词汇','g17_02'],sections:[{type:'listening',prompt:'听17-3.mp3，选择白家月给的建议。',answer:'去看跟电脑有关的书。'},{type:'vocabulary',questionIds:['l17_v5_b_01','l17_guess_04']},{type:'grammar',questionIds:['l17_order_02','l17_pk_02']},{type:'speaking',prompt:'说出想继续学习什么，并请同学给建议。',minimum:'学习内容＋请求建议'}],questionIds:['l17_order_02','l17_scene_03','l17_pk_02','l17_task_02'],audioRequired:true,sourceType},
  {id:'l17_test_c',session:'C',title:'Test C：我的下一步计划',audio:['../../audio/HSK3/17-5.mp3','../../audio/HSK3/17-7.mp3'],focus:['课文3—4','T3/T4词汇','g17_03','g17_04'],sections:[{type:'listening',prompt:'听17-5和17-7.mp3，找出一种准备办法和三种毕业方向。',answer:'上网查资料或使用有用的网站；继续学习、出国留学、先找工作。'},{type:'vocabulary',questionIds:['l17_v5_c_01','l17_guess_07']},{type:'grammar',questionIds:['l17_order_03','l17_order_04','l17_pk_03']},{type:'speaking',prompt:'说出一种准备办法，并说明毕业后想工作还是继续学习。',minimum:'一种准备＋一个选择'}],questionIds:['l17_order_03','l17_order_04','l17_scene_05','l17_scene_06','l17_pk_03','l17_task_03','l17_task_04'],audioRequired:true,sourceType}
];

const preClass={mode:'preview_mission',missionId:'pm_hsk3_l17_a',vocabularyIds:vocabulary.map((v)=>v.id),grammarIds:grammar.map((g)=>g.id),progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L17-v1'},reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt']};
const scaffoldLevels=[{label:'基础层 / Support',instruction:'使用词库和完整句框，完成最低要求。'},{label:'标准层 / Core',instruction:'独立完成核心内容，并使用本次目标结构。'},{label:'挑战层 / Challenge',instruction:'增加理由、比较或追问，但不改变核心任务。'}];
const postClassHomework={
  mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,
  instructions:{required:'A和B的卡片必须带入C。',optional:'使用自画、公开资料或隐私安全图片。',aiPolicy:'先独立完成，再用工具检查语言。No audio upload is required.'},
  sessionMeta:{A:{title:'My Role Model Card',carryTo:'B、C'},B:{title:'Learning Direction Card',carryTo:'C'},C:{title:'My Next Step Plan',presentation:'1—2分钟课堂展示；No audio upload is required.'}},
  sessions:{
    A:[{id:'post_l17_a_role_model_card',type:'project_card',prompt_cn:'完成榜样卡：你想向谁学习？这个人做什么很认真？你想学习什么？',prompt_en:'Bring one privacy-safe drawing, public image, or name card for a role model. Say who you want to learn from, what careful action this person does, and what you want to learn. Use at least three T1 words. Speak for 30–45 seconds with a partner; every student speaks. No audio upload is required.',wordBank:['向','害怕','常见','聪明','错','认为'],requiredStructures:['向＋人＋学习'],materials:['一张自画、公开资料或隐私安全的榜样图片，也可以只用姓名/称呼卡'],requiredQuestions:['你想向谁学习？','这个人做什么很认真？','你想学习什么？'],minimum:'一个人＋一个理由',speakingTime:'30—45 seconds',groupRules:'两人互相听，每人必须说出“人＋理由”。',carryTo:['B','C'],scaffoldLevels,sourceType}],
    B:[{id:'post_l17_b_learning_direction_card',type:'project_card',prompt_cn:'使用A卡的理由表达，完成学习方向卡，并请同学给一个建议。',prompt_en:'Bring Homework A and one book or teacher-provided course card. Say what you want to continue studying, why, what information you have, and what advice you want. Use at least four T2 words. Work in pairs: one student presents and the other gives one friendly suggestion, then switch. No audio upload is required.',wordBank:['到处','继续','同意','屋子','有关'],requiredStructures:['跟……有关','不是……吗？（Core/Challenge，友好语气）'],materials:['Homework A卡','一本书或教师提供的课程/专业信息卡'],requiredQuestions:['你想继续学习什么？','为什么？','你已经有什么资料？','你想请同学给什么建议？'],minimum:'学习内容＋请求建议',speakingTime:'30—45 seconds',groupRules:'A说方向和问题，B给一条建议，然后交换角色。',carryFrom:[{session:'A',taskId:'post_l17_a_role_model_card',use:'复用榜样优点和理由表达。'}],carryTo:['C'],scaffoldLevels,sourceType}],
    C:[{id:'post_l17_c_next_step_plan',type:'project_card',prompt_cn:'使用A/B卡，完成“我的下一步计划”。',prompt_en:'Bring Homework A, Homework B, and one teacher-provided or self-made country, city, or school information card. Introduce a role model, your learning direction, one place you may study and how you will prepare, then say whether you plan to work or continue studying after graduation and why. Speak for 1–2 minutes; every student contributes. No audio upload is required.',wordBank:['向','继续','留学','国家','查','有用','方向','真正'],requiredStructures:['……，更……（Support可选择）','只有……，才……（Support可选择）','向或不是……吗？（Challenge）'],materials:['Homework A卡','Homework B卡','一张教师提供或学生自制的信息卡'],requiredQuestions:['你想向谁学习？','你想学什么？','你想去哪里学习，怎么准备？','毕业后工作还是继续学习？为什么？'],minimum:'榜样＋学习方向＋一种准备＋毕业打算和理由',speakingTime:'1—2 minutes',groupRules:'小组可共用信息卡，但每名学生必须完成有意义的发言；同伴只帮助检查，不代写。',carryFrom:[{session:'A',taskId:'post_l17_a_role_model_card',use:'榜样、认真行为和学习理由。'},{session:'B',taskId:'post_l17_b_learning_direction_card',use:'学习方向、资料和同伴建议。'}],noAudioUpload:true,scaffoldLevels,sourceType}]
  }
};

const miniPlans=[
  {id:'mini_l17_t1_role_model',title:'我想向谁学习',goal:'从说一个做事认真的人，到说出想向谁学习和理由。',goalEn:'Move from naming a careful person to naming a role model and one reason.',entry:'说一个你觉得“很认真”的人。',exit:'你想向谁学习？为什么？',exitRequirements:['说出一个人','说出一个理由'],supportCards:['我想向……学习。','因为他/她……。','我准备……。'],responseMode:'spoken_in_class',textId:texts[0].id,linkedResources:{vocabularyIds:vocabulary.slice(0,8).map((v)=>v.id),grammarIds:['g17_01'],textIds:[texts[0].id],practiceIds:['l17_task_01']},resourceLinks:{vocabulary:'T1',grammar:'g17_01',text:'t_hsk3_l17_01',practice:'l17_task_01'}},
  {id:'mini_l17_t2_learning_direction',title:'我的学习方向',goal:'从选择学习还是工作，到说出想继续学习什么并请同学给建议。',goalEn:'Move from a broad choice to a learning direction and a request for advice.',entry:'你以后想继续学习还是工作？',exit:'说说你想继续学习什么，并请同学给你一个建议。',exitRequirements:['说出一个学习内容','请同学给一个建议'],supportCards:['我想继续学习……。','因为……。','你觉得我可以……吗？'],responseMode:'spoken_pair',textId:texts[1].id,linkedResources:{vocabularyIds:vocabulary.slice(8,14).map((v)=>v.id),grammarIds:['g17_02'],textIds:[texts[1].id],practiceIds:['l17_task_02']},resourceLinks:{vocabulary:'T2',grammar:'g17_02',text:'t_hsk3_l17_02',practice:'l17_task_02'}},
  {id:'mini_l17_t3_study_abroad_research',title:'我要怎么准备',goal:'从说一个想去的地方，到说出想去学习的地方和一种准备办法。',goalEn:'Move from naming a place to naming a study destination and one preparation step.',entry:'你想去哪个国家或城市学习？',exit:'介绍一个你想去学习的国家或城市，说说你要怎么准备？',exitRequirements:['说出一个国家或城市','说出一种准备办法'],supportCards:['我想去……学习。','我先……，更要……。','我准备查……。'],responseMode:'spoken_in_class',textId:texts[2].id,linkedResources:{vocabularyIds:vocabulary.slice(14,21).map((v)=>v.id),grammarIds:['g17_03'],textIds:[texts[2].id],practiceIds:['l17_task_03']},resourceLinks:{vocabulary:'T3',grammar:'g17_03',text:'t_hsk3_l17_03',practice:'l17_task_03'}},
  {id:'mini_l17_t4_next_step_plan',title:'毕业后的打算',goal:'从回答以后想做什么，到选择工作或继续学习并说出理由。',goalEn:'Move from a broad future question to choosing work or further study with one reason.',entry:'以后你想做什么？',exit:'介绍你毕业以后的打算：工作还是继续学习？为什么？',exitRequirements:['选择工作或继续学习','说出一个理由'],supportCards:['毕业以后，我想……。','因为……。','只有……，我才能……。'],responseMode:'spoken_in_class',textId:texts[3].id,linkedResources:{vocabularyIds:vocabulary.slice(21,27).map((v)=>v.id),grammarIds:['g17_04'],textIds:[texts[3].id],practiceIds:['l17_task_04']},resourceLinks:{vocabulary:'T4',grammar:'g17_04',text:'t_hsk3_l17_04',practice:'l17_task_04'}}
].map((plan)=>({...plan,sourceType}));

const lesson={
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L17',lessonKey:'HSK3-L17',title:'我要多向认真的人学习',titleEn:'I will learn from people who are careful',topic:'面对错误、学习榜样、继续学习、留学准备与毕业选择',courseModel:'A向认真者学习→B明确学习方向→C准备与毕业打算',sourceTextPolicy:'教材事实来自L17.txt；原始“名择”按用户确认更正为“选择”；所有新增内容标记teaching_extension。',sourceAuthority:[sourceRef],missingResources:{audio:[],textbookImages:true,textbookExercises:true},audioResources:['audio/HSK3/17-1.mp3','audio/HSK3/17-3.mp3','audio/HSK3/17-5.mp3','audio/HSK3/17-7.mp3'],imageResources:sceneSpecs.map((s)=>'source/in-class/'+image(s[3])),editorialAudit:['教材语法例句原始文件将“选择”误写为“名择”；用户于2026-11-05确认课程统一使用“选择”。','英文标题按教材文件和用户确认使用“I will learn from people who are careful”。']},
  pedagogy:{exerciseMix:{lessonTargetPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'每位学生有效发言；C课堂展示，不上传音频。',miniEvidence:['entry_expression','actual_learning_path','exit_expression'],timerPolicy:{miniMinutes:[3,4,5],vocabularyMinutes:[2,3,4,5],timeoutAction:'prompt_only'}},
  features:{pinyin:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true,audio:true},
  sessions,
  usePreparation:{status:'active_shared_profile',configurationCreated:true,profile:'pilot-v1',formalResourcePlan:miniPlans,stateContract:{preserveOnReturn:['room','currentMini','timer','evidence','openedPath','interactionState'],evidenceTypes:['entry_expression','actual_learning_path','exit_expression']},sourceType},
  vocabScenes,vocabulary,vocabularyCatalog:vocabulary.map((v)=>v.id),
  vocabularyGroups:[
    {id:'T1',textId:texts[0].id,vocabularyIds:vocabulary.slice(0,8).map((v)=>v.id),recognitionWordIds:['v17_01','v17_03','v17_06','v17_08'],activities:['recognition','form_choice','input','collocation'],sourceType},
    {id:'T2',textId:texts[1].id,vocabularyIds:vocabulary.slice(8,14).map((v)=>v.id),recognitionWordIds:['v17_09','v17_10','v17_11','v17_14'],activities:['recognition','form_choice','input','collocation'],sourceType},
    {id:'T3',textId:texts[2].id,vocabularyIds:vocabulary.slice(14,21).map((v)=>v.id),recognitionWordIds:['v17_15','v17_17','v17_20','v17_21'],activities:['recognition','form_choice','input','collocation'],sourceType},
    {id:'T4',textId:texts[3].id,vocabularyIds:vocabulary.slice(21,27).map((v)=>v.id),recognitionWordIds:['v17_22','v17_24','v17_26','v17_27'],activities:['recognition','form_choice','input','collocation'],sourceType}
  ],
  grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map((v)=>[v.id,{session:v.tags[0],textId:v.textId,tier:v.tier,meaningCn:v.meaningCn,phrases:v.phrases,sourceType,sourceRef}])),
  previewMissions,preClass,inClass:{questionGroups,sessionTests},postClassHomework,
  report:{focus:['面对错误与榜样','我的学习方向','留学准备','毕业后的打算'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务']}
};

fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(lesson,null,2)+'\n','utf8');
console.log('Built '+path.relative(root,out));
