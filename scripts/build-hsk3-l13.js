const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const lessonKey = 'HSK3-L13';
const sourceRef = 'textbook data/HSK3/L13.txt';
const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', `${lessonKey}.json`);
const useProfileOut = path.join(__dirname, '..', 'source', 'data-model', 'experiments', `${lessonKey}-USE-PILOT-V1.json`);
const sourceText = fs.readFileSync(path.join(__dirname, '..', sourceRef), 'utf8');
const img = name => `images/hsk3-l13/${name}.png`;
const roleFor = (index, total) => index < Math.ceil(total * 0.5) ? 'lesson' : index < Math.ceil(total * 0.8) ? 'transfer' : 'review';
const example = (hanzi, pinyin, english, sourceType = 'teaching_extension') => ({hanzi, pinyin, english, sourceType});

const vocabRows = [
  ['请客','qǐngkè','动词','stand treat','A',['请客吃饭','今天我请客'],'今天我请客，你们想吃什么就点什么！','Jīntiān wǒ qǐngkè, nǐmen xiǎng chī shénme jiù diǎn shénme!'],
  ['南方','nánfāng','名词','south','A',['南方菜','中国南方'],'南方菜跟北方菜的做法不同。','Nánfāng cài gēn běifāng cài de zuòfǎ bù tóng.'],
  ['北方','běifāng','名词','north','A',['北方菜','中国北方'],'南方菜跟北方菜的做法不同。','Nánfāng cài gēn běifāng cài de zuòfǎ bù tóng.'],
  ['做法','zuòfǎ','名词','way of doing or making a thing','A',['菜的做法','做法不同'],'这家饭馆的鱼做法很特别。','Zhè jiā fànguǎn de yú zuòfǎ hěn tèbié.'],
  ['不同','bù tóng','形容词','different','A',['很不同','做法不同'],'南方菜跟北方菜的做法不同。','Nánfāng cài gēn běifāng cài de zuòfǎ bù tóng.'],
  ['加','jiā','动词','add','A',['再加一个菜','加一点儿'],'那再加一个鸡肉。','Nà zài jiā yí gè jīròu.'],
  ['的话','dehuà','助词','(used at the end of a conditional clause)','A',['有时间的话','喜欢的话'],'你们有时间的话，就来我家做客。','Nǐmen yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.'],
  ['做客','zuòkè','动词','be a guest','A',['来我家做客','去邻居家做客'],'你们有时间的话，就来我家做客。','Nǐmen yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.'],
  ['邻居','línjū','名词','neighbor','B',['新邻居','我的邻居'],'第一次请新邻居来做客，我总是有点儿担心。','Dì-yī cì qǐng xīn línjū lái zuòkè, wǒ zǒngshì yǒudiǎnr dānxīn.'],
  ['放心','fàngxīn','动词','feel at ease','B',['请放心','放心吧'],'放心吧，都已经准备好了。','Fàngxīn ba, dōu yǐjīng zhǔnbèi hǎo le.'],
  ['酒','jiǔ','名词','alcoholic drink; wine','B',['一瓶酒','饮料和酒'],'我把饮料和酒都放进冰箱里了。','Wǒ bǎ yǐnliào hé jiǔ dōu fàngjìn bīngxiāng li le.'],
  ['放','fàng','动词','put','B',['放进冰箱','放在桌上'],'我把饮料和酒都放进冰箱里了。','Wǒ bǎ yǐnliào hé jiǔ dōu fàngjìn bīngxiāng li le.'],
  ['客人','kèrén','名词','guest','B',['等客人','客人来了'],'客人来了再把饮料拿出来。','Kèrén lái le zài bǎ yǐnliào ná chūlai.'],
  ['晚会','wǎnhuì','名词','evening party','C',['生日晚会','参加晚会'],'谢谢你们来参加我儿子的生日晚会。','Xièxie nǐmen lái cānjiā wǒ érzi de shēngrì wǎnhuì.'],
  ['礼物','lǐwù','名词','gift; present','C',['生日礼物','准备礼物'],'我准备了一个小礼物，希望你喜欢！','Wǒ zhǔnbèi le yí gè xiǎo lǐwù, xīwàng nǐ xǐhuan!'],
  ['画家','huàjiā','名词','painter','C',['一名画家','成为画家'],'我想做一名画家。','Wǒ xiǎng zuò yì míng huàjiā.'],
  ['盘子','pánzi','名词','plate','C',['拿盘子','一个盘子'],'我去把盘子拿过来。','Wǒ qù bǎ pánzi ná guòlai.'],
  ['一边','yìbiān','副词','at the same time','C',['一边吃一边聊','一边听一边写'],'咱们一边吃蛋糕，一边聊天儿吧。','Zánmen yìbiān chī dàngāo, yìbiān liáotiānr ba.'],
  ['聊天儿','liáotiānr','动词','chat','C',['一起聊天儿','跟邻居聊天儿'],'我们一边喝红茶，一边聊天儿。','Wǒmen yìbiān hē hóngchá, yìbiān liáotiānr.'],
  ['来自','láizì','动词','come from','C',['来自英国','来自一个城市'],'我的新邻居是来自英国的夫妻。','Wǒ de xīn línjū shì láizì Yīngguó de fūqī.'],
  ['夫妻','fūqī','名词','husband and wife','C',['一对夫妻','年轻夫妻'],'我的新邻居是来自英国的夫妻。','Wǒ de xīn línjū shì láizì Yīngguó de fūqī.'],
  ['直到','zhídào','动词','until','C',['直到十二点','直到今天'],'我们直到十二点多才回家。','Wǒmen zhídào shí’èr diǎn duō cái huí jiā.'],
  ['地图','dìtú','名词','map','C',['世界地图','看地图'],'他家有一张世界地图。','Tā jiā yǒu yì zhāng shìjiè dìtú.'],
  ['点','diǎn','名词','dot; spot','C',['一个红点','地图上的点'],'地图上每一个红点都是他们去过的地方。','Dìtú shang měi yí gè hóng diǎn dōu shì tāmen qùguo de dìfang.'],
  ['感到','gǎndào','动词','feel','C',['感到开心','感到很特别'],'他们感到东方的文化很特别。','Tāmen gǎndào dōngfāng de wénhuà hěn tèbié.'],
  ['东方','dōngfāng','名词','East','C',['东方文化','东方国家'],'他们感到东方的文化很特别。','Tāmen gǎndào dōngfāng de wénhuà hěn tèbié.'],
  ['文化','wénhuà','名词','culture','C',['中国文化','了解文化'],'他们感到东方的文化很特别。','Tāmen gǎndào dōngfāng de wénhuà hěn tèbié.'],
  ['英国','Yīngguó','专有名词','the United Kingdom (the UK)','C',['来自英国','英国红茶'],'他们还准备了英国的红茶。','Tāmen hái zhǔnbèi le Yīngguó de hóngchá.']
];

const vocabulary = vocabRows.map((row, index) => ({
  id:`v13_${String(index + 1).padStart(2,'0')}`, hanzi:row[0], pinyin:row[1], pos:row[2], english:row[3], tags:[row[4]],
  phrases:row[5], phraseSourceType:'teaching_extension', example:row[6], examplePinyin:row[7], exampleSourceType:sourceText.includes(row[6]) ? 'textbook' : 'teaching_extension', sourceType:'textbook', sourceRef
}));
const byWord = Object.fromEntries(vocabulary.map(item => [item.hanzi, item]));
const card = hanzi => { const item = byWord[hanzi]; return {hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,phrases:item.phrases,example:item.example,examplePinyin:item.examplePinyin}; };

const texts = [
  {id:'t_hsk3_l13_01',textId:1,title:'饭馆请客与做客邀请',titleSourceType:'teaching_extension',format:'dialogue',genre:'对话',setting:'在饭馆，杨同乐请同事吃饭。',audio:'../../audio/HSK3/13-1.mp3',sourceType:'textbook',sourceRef,lines:[
    ['杨同乐','今天我请客，你们想吃什么就点什么！','Jīntiān wǒ qǐngkè, nǐmen xiǎng chī shénme jiù diǎn shénme!','Today is my treat, order whatever you feel like eating!'],
    ['王一雪','那我就不客气了。听说这家饭馆的鱼做得很特别？','Nà wǒ jiù bú kèqi le. Tīngshuō zhè jiā fànguǎn de yú zuò de hěn tèbié?','Then I won\'t stand on ceremony. I heard the fish at this restaurant is prepared in a very special way?'],
    ['杨同乐','对，南方菜跟你们北方菜的做法不同。除了鱼，你们还想吃什么？','Duì, nánfāng cài gēn nǐmen běifāng cài de zuòfǎ bù tóng. Chúle yú, nǐmen hái xiǎng chī shénme?','Right, southern cuisine is cooked differently from your northern dishes. Besides fish, what else would you like to eat?'],
    ['同事','我不常吃南方菜，还是你决定吧。','Wǒ bù cháng chī nánfāng cài, háishì nǐ juédìng ba.','I don\'t eat southern food often, so you\'d better decide.'],
    ['杨同乐','好，那再加一个鸡肉，一个……','Hǎo, nà zài jiā yí gè jīròu, yí gè...','Alright, then let\'s add a chicken dish, a...'],
    ['王一雪','咱们就三个人，别点那么多。','Zánmen jiù sān gè rén, bié diǎn nàme duō.','There are only three of us, don\'t order too much.'],
    ['杨同乐','好，那先来这几个菜。','Hǎo, nà xiān lái zhè jǐ gè cài.','Okay, let\'s start with these dishes first.'],
    ['王一雪','对了，下周我儿子过生日，你们有时间的话，就来我家做客，我给你们做北京菜。','Duì le, xià zhōu wǒ érzi guò shēngrì, nǐmen yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè, wǒ gěi nǐmen zuò Běijīng cài.','By the way, it\'s my son\'s birthday next week. If you have time, come over to my place and I\'ll cook Beijing cuisine for you.']
  ].map(([speaker,hanzi,pinyin,english])=>({speaker,hanzi,pinyin,english,englishSourceType:'textbook'}))},
  {id:'t_hsk3_l13_02',textId:2,title:'准备接待新邻居',titleSourceType:'teaching_extension',format:'dialogue',genre:'对话',setting:'在家里，王一雪和刘明为生日会做准备。',audio:'../../audio/HSK3/13-3.mp3',sourceType:'textbook',sourceRef,lines:[
    ['王一雪','第一次请新邻居来做客，总是担心有什么没准备好。','Dì-yī cì qǐng xīn línjū lái zuòkè, zǒngshì dānxīn yǒu shénme méi zhǔnbèi hǎo.','Inviting our new neighbors over for the first time, I\'m always worried something might not be well prepared.'],
    ['刘明','放心吧，我帮你看了，都已经准备好了。','Fàngxīn ba, wǒ bāng nǐ kàn le, dōu yǐjīng zhǔnbèi hǎo le.','Don\'t worry, I checked for you and everything is ready.'],
    ['王一雪','我记得刚才已经把饮料拿出来了，怎么不见了？','Wǒ jìde gāngcái yǐjīng bǎ yǐnliào ná chūlai le, zěnme bú jiàn le?','I remember I already took out the drinks just now, how come they\'re gone?'],
    ['刘明','我把饮料和酒都放进冰箱里了，客人来了再拿出来。','Wǒ bǎ yǐnliào hé jiǔ dōu fàngjìn bīngxiāng li le, kèrén lái le zài ná chūlai.','I put the drinks and alcohol into the fridge; we can take them out when the guests arrive.'],
    ['王一雪','音乐的声音合适吗？','Yīnyuè de shēngyīn héshì ma?','Is the volume of the music appropriate?'],
    ['刘明','你把声音开得太大了，我去关小一点儿。','Nǐ bǎ shēngyīn kāi de tài dà le, wǒ qù guān xiǎo yìdiǎnr.','You turned the volume up too loud; I\'ll go turn it down a bit.'],
    ['王一雪','好，那我们就等客人来吧。','Hǎo, nà wǒmen jiù děng kèrén lái ba.','Okay, then let\'s just wait for the guests to arrive.']
  ].map(([speaker,hanzi,pinyin,english])=>({speaker,hanzi,pinyin,english,englishSourceType:'textbook'}))},
  {id:'t_hsk3_l13_03',textId:3,title:'生日晚会与礼物',titleSourceType:'teaching_extension',format:'dialogue',genre:'对话',setting:'在家里，王一雪和刘明办生日会。',audio:'../../audio/HSK3/13-5.mp3',sourceType:'textbook',sourceRef,lines:[
    ['王一雪','谢谢你们来参加我儿子的生日晚会，希望大家今晚玩得开心。','Xièxie nǐmen lái cānjiā wǒ érzi de shēngrì wǎnhuì, xīwàng dàjiā jīnwǎn wán de kāixīn.','Thank you for coming to my son\'s birthday party; I hope everyone has fun tonight.'],
    ['杨同乐','小明，生日快乐！我准备了一个小礼物，希望你喜欢！','Xiǎomíng, shēngrì kuàilè! Wǒ zhǔnbèi le yí gè xiǎo lǐwù, xīwàng nǐ xǐhuan!','Xiaoming, happy birthday! I prepared a small gift, hope you like it!'],
    ['刘小明','谢谢您，我可以打开吗？','Xièxie nín, wǒ kěyǐ dǎkāi ma?','Thank you, may I open it?'],
    ['杨同乐','当然可以，你妈妈说你跟姐姐一样，都喜欢画画，对吗？','Dāngrán kěyǐ, nǐ māma shuō nǐ gēn jiějie yíyàng, dōu xǐhuan huàhuà, duì ma?','Of course. Your mom said you like drawing just like your sister, right?'],
    ['刘小明','对，我想做一名画家。啊！画板和画笔，这正是我需要的。我太喜欢了。','Duì, wǒ xiǎng zuò yì míng huàjiā. À! Huàbǎn hé huàbǐ, zhè zhèng shì wǒ xūyào de. Wǒ tài xǐhuan le.','Yes, I want to become a painter. Ah! A drawing board and paintbrushes, this is exactly what I needed. I love it so much.'],
    ['王一雪','我去把盘子拿过来，咱们一边吃蛋糕，一边聊天儿吧。','Wǒ qù bǎ pánzi ná guòlai, zánmen yìbiān chī dàngāo, yìbiān liáotiānr ba.','I\'ll go bring over the plates, let\'s eat cake and chat at the same time.']
  ].map(([speaker,hanzi,pinyin,english])=>({speaker,hanzi,pinyin,english,englishSourceType:'textbook'}))},
  {id:'t_hsk3_l13_04',textId:4,title:'英国新邻居日记',titleSourceType:'teaching_extension',format:'diary',genre:'日记',genreEn:'Diary',author:'王一雪',setting:'在家里，王一雪在写日记。',audio:'../../audio/HSK3/13-7.mp3',sourceType:'textbook',sourceRef,translationPolicy:'教材文档未提供课文四英文译文；english 字段为教学扩展。',lines:[
    {speaker:'王一雪',hanzi:'我的新邻居是来自英国的夫妻。上周我去他们家做客了。他们做了很多好吃的，还准备了英国的红茶。那天我跟他们一边喝红茶，一边聊天儿，直到十二点多才回家。他们年轻的时候喜欢旅游，他家有一张世界地图，上面每一个红点都是他们去过的地方。后来，他们感到东方的文化很特别，就开始学习中文。今天是小明的生日，我请他们到我家玩，来看看中国人的家，也尝尝中国菜。',pinyin:'Wǒ de xīn línjū shì láizì Yīngguó de fūqī. Shàng zhōu wǒ qù tāmen jiā zuòkè le. Tāmen zuòle hěn duō hǎochī de, hái zhǔnbèi le Yīngguó de hóngchá. Nà tiān wǒ gēn tāmen yìbiān hē hóngchá, yìbiān liáotiānr, zhídào shí\'èr diǎn duō cái huí jiā. Tāmen niánqīng de shíhou xǐhuan lǚyóu, tā jiā yǒu yì zhāng shìjiè dìtú, shàngmiàn měi yí gè hóng diǎn dōu shì tāmen qùguo de dìfang. Hòulái, tāmen gǎndào dōngfāng de wénhuà hěn tèbié, jiù kāishǐ xuéxí Zhōngwén. Jīntiān shì Xiǎomíng de shēngrì, wǒ qǐng tāmen dào wǒ jiā wán, lái kànkan Zhōngguórén de jiā, yě chángchang Zhōngguócài.',english:'My new neighbors are a married couple from the UK. Last week I visited their home. They made lots of delicious food and prepared British tea. We drank tea and chatted until after midnight. They loved travelling when they were young; every red dot on their world map marks a place they visited. Later they found Eastern culture special and began learning Chinese. Today is Xiaoming’s birthday, so I invited them to see a Chinese home and taste Chinese food.',englishSourceType:'teaching_extension'}
  ]}
];

const grammar = [
  {id:'g13_01',title:'假设复句“……的话，就……”',titleEn:'Hypothetical pattern ……的话，就……',appliesTo:[1],scene:'先比较“有时间”和“来做客”之间的条件与结果。',structure:'条件 + 的话，就 + 结果',explanation:'“的话”放在假设条件后面，“就”引出条件成立时的结果。',sourceType:'textbook',sourceRef,examples:[
    example('你们有时间的话，就来我家做客。','Nǐmen yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.','If you have time, come to my home as guests.','textbook'),
    example('你觉得满意的话，咱们就买。','Nǐ juéde mǎnyì dehuà, zánmen jiù mǎi.','If you are satisfied, we will buy it.','textbook'),
    example('明天天好的话，我就去爬山。','Míngtiān tiān hǎo dehuà, wǒ jiù qù páshān.','If the weather is good tomorrow, I will go hiking.','textbook'),
    example('你喜欢南方菜的话，我们就点鱼。','Nǐ xǐhuan nánfāng cài dehuà, wǒmen jiù diǎn yú.','If you like southern food, we will order fish.'),
    example('周末有时间的话，就来参加晚会吧。','Zhōumò yǒu shíjiān dehuà, jiù lái cānjiā wǎnhuì ba.','If you have time this weekend, come to the party.')
  ]},
  {id:'g13_02',title:'“把”字句（四）：趋向或状态补语',titleEn:'把 sentences with directional or state complements',appliesTo:[2,3],scene:'观察饮料、声音和盘子怎样从原来的位置或状态发生变化。',structure:'主语 + 把 + 宾语 + 动词 + 趋向补语 / 得 + 状态补语',explanation:'用“把”把受影响的事物提前，再说明它被移动到哪里或变成什么状态。',sourceType:'textbook',sourceRef,examples:[
    example('你把声音开得太大了。','Nǐ bǎ shēngyīn kāi de tài dà le.','You turned the volume up too loud.','textbook'),
    example('他把球踢进去了吗？','Tā bǎ qiú tī jìnqu le ma?','Did he kick the ball in?','textbook'),
    example('妈妈把房间收拾得非常干净。','Māma bǎ fángjiān shōushi de fēicháng gānjìng.','Mom cleaned the room very well.','textbook'),
    example('现在天气太热了，你应该把这些东西放进冰箱里。','Xiànzài tiānqì tài rè le, nǐ yīnggāi bǎ zhèxiē dōngxi fàngjìn bīngxiāng li.','It is too hot now; you should put these things into the fridge.','textbook'),
    example('我去把盘子拿过来。','Wǒ qù bǎ pánzi ná guòlai.','I will bring the plates over.')
  ]},
  {id:'g13_03',title:'“一边……，一边……”',titleEn:'Simultaneous actions with 一边……，一边……',appliesTo:[3,4],scene:'观察生日会上同时发生的两个动作。',structure:'主语 + 一边 + 动作一，一边 + 动作二',explanation:'表示同一个人或一组人同时进行两个可以一起完成的动作。',sourceType:'textbook',sourceRef,examples:[
    example('咱们一边吃蛋糕，一边聊天儿吧。','Zánmen yìbiān chī dàngāo, yìbiān liáotiānr ba.','Let us eat cake and chat at the same time.','textbook'),
    example('我喜欢一边跑步，一边听音乐。','Wǒ xǐhuan yìbiān pǎobù, yìbiān tīng yīnyuè.','I like listening to music while running.','textbook'),
    example('你不应该一边开车一边打电话。','Nǐ bù yīnggāi yìbiān kāichē yìbiān dǎ diànhuà.','You should not make calls while driving.','textbook'),
    example('我们一边喝红茶，一边看地图。','Wǒmen yìbiān hē hóngchá, yìbiān kàn dìtú.','We drink tea while looking at the map.'),
    example('他们一边做中国菜，一边聊不同的文化。','Tāmen yìbiān zuò Zhōngguó cài, yìbiān liáo bù tóng de wénhuà.','They cook Chinese food while talking about different cultures.')
  ]}
];

const grammarTeachingNotes = {
  g13_01:{scene:'王一雪想邀请同事来家里做客。先观察：什么条件成立以后，邀请才可以实现？',structure:'条件 + 的话，就 + 结果',structureEn:'condition + 的话, then 就 + result',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'逐行找出条件和结果，再观察“的话”和“就”分别放在哪里。',observeHighlights:[['有时间的话','就来我家做客'],['满意的话','就买'],['天好的话','就去爬山'],['喜欢南方菜的话','就点鱼'],['周末有时间的话','就来参加晚会']],visualLearning:{leadExamples:[{english:'If you have time, come to my home.',hanzi:'你有时间的话，就来我家做客。',pinyin:'Nǐ yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.'}],blocks:['条件','的话','就','结果'],blockLabelsEn:['condition','if','then','result']},oralQuestions:[
    {question:'周末有时间的话，你就做什么？',pinyin:'Zhōumò yǒu shíjiān dehuà, nǐ jiù zuò shénme?'},
    {question:'朋友喜欢中国菜的话，你就带他去哪儿？',pinyin:'Péngyou xǐhuan Zhōngguó cài dehuà, nǐ jiù dài tā qù nǎr?'},
    {question:'明天天气好的话，你们就安排什么活动？',pinyin:'Míngtiān tiānqì hǎo dehuà, nǐmen jiù ānpái shénme huódòng?'},
    {question:'同学来你家做客的话，你就准备什么？',pinyin:'Tóngxué lái nǐ jiā zuòkè dehuà, nǐ jiù zhǔnbèi shénme?'}
  ],structureVariants:[{label:'完整形式',formula:'条件 + 的话，就 + 结果',formulaEn:'if condition, then result',explanation:'“的话”标记条件，“就”引出结果。',example:'你有时间的话，就来我家做客。',examplePinyin:'Nǐ yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.'},{label:'口语省略',formula:'条件 + 的话，结果',formulaEn:'the result may omit 就 in speech',explanation:'口语中有时省略“就”，本课先掌握完整形式。',example:'你喜欢的话，我们一起做。',examplePinyin:'Nǐ xǐhuan dehuà, wǒmen yìqǐ zuò.'}],followUp:[{image:img('photo-text-1-invitation'),promptEn:'Invite classmates to a real weekend activity.',target:'用“……的话，就……”提出一个有条件的邀请；同伴改变条件后，再说一个新结果。',sampleAnswer:'周末有时间的话，就来我家做客吧。'}]},
  g13_02:{scene:'主人正在准备接待客人。观察饮料、声音和盘子怎样从原来的位置或状态发生变化。',structure:'主语 + 把 + 宾语 + 动词 + 趋向补语 / 得 + 状态补语',structureEn:'subject + 把 + object + verb + direction or resulting state',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'每行先找被处理的东西，再找动作，最后说明它到了哪里或变成什么状态。',observeHighlights:[['把声音','开得太大'],['把球','踢进去'],['把房间','收拾得非常干净'],['把这些东西','放进冰箱里'],['把盘子','拿过来']],visualLearning:{leadExamples:[{english:'Move the drinks into the fridge.',hanzi:'我把饮料放进冰箱里。',pinyin:'Wǒ bǎ yǐnliào fàngjìn bīngxiāng li.'},{english:'Change the volume to a quieter state.',hanzi:'请把声音关小一点儿。',pinyin:'Qǐng bǎ shēngyīn guān xiǎo yìdiǎnr.'}],blocks:['主语','把 + 宾语','动作','方向 / 状态结果'],blockLabelsEn:['subject','affected object','action','result']},oralQuestions:[
    {question:'上课前，你把手机放到哪里？',pinyin:'Shàngkè qián, nǐ bǎ shǒujī fàng dào nǎli?'},
    {question:'客人快来了，你要把房间收拾得怎么样？',pinyin:'Kèrén kuài lái le, nǐ yào bǎ fángjiān shōushi de zěnmeyàng?'},
    {question:'音乐太大了，你会把声音怎么样？',pinyin:'Yīnyuè tài dà le, nǐ huì bǎ shēngyīn zěnmeyàng?'},
    {question:'吃蛋糕以前，请把什么拿过来？',pinyin:'Chī dàngāo yǐqián, qǐng bǎ shénme ná guòlai?'}
  ],structureVariants:[{label:'位置变化',formula:'把 + 宾语 + 动词 + 进来 / 出去 / 过来……',formulaEn:'directional result',explanation:'说明东西移动到哪里。',example:'我把饮料放进冰箱里了。',examplePinyin:'Wǒ bǎ yǐnliào fàngjìn bīngxiāng li le.'},{label:'状态变化',formula:'把 + 宾语 + 动词 + 得 + 状态',formulaEn:'resulting state',explanation:'说明动作以后形成的状态。',example:'妈妈把房间收拾得非常干净。',examplePinyin:'Māma bǎ fángjiān shōushi de fēicháng gānjìng.'}],followUp:[{image:img('photo-text-2-music'),promptEn:'Fix the room before the guests arrive.',target:'指出一个物品或声音的问题，并用把字句说明调整后的方向或状态。',sampleAnswer:'音乐太大了，请把声音关小一点儿。'}]},
  g13_03:{scene:'生日晚会上，大家吃蛋糕，也聊天儿。观察哪些动作可以由同一个人或同一组人同时完成。',structure:'主语 + 一边 + 动作一，一边 + 动作二',structureEn:'the same subject does action 1 and action 2 at the same time',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'逐行圈出两个动作，并判断它们能不能同时进行。',observeHighlights:[['一边吃蛋糕','一边聊天儿'],['一边跑步','一边听音乐'],['一边开车','一边打电话'],['一边喝红茶','一边看地图'],['一边做中国菜','一边聊文化']],visualLearning:{leadExamples:[{english:'Eat cake while chatting.',hanzi:'咱们一边吃蛋糕，一边聊天儿吧。',pinyin:'Zánmen yìbiān chī dàngāo, yìbiān liáotiānr ba.'}],blocks:['同一个主语','一边 + 动作一','一边 + 动作二'],blockLabelsEn:['same subject','action 1','action 2']},oralQuestions:[
    {question:'你学习的时候，常常一边做什么，一边做什么？',pinyin:'Nǐ xuéxí de shíhou, chángcháng yìbiān zuò shénme, yìbiān zuò shénme?'},
    {question:'朋友来做客时，你们可以一边喝什么，一边聊什么？',pinyin:'Péngyou lái zuòkè shí, nǐmen kěyǐ yìbiān hē shénme, yìbiān liáo shénme?'},
    {question:'旅行时，你喜欢一边走路，一边做什么？',pinyin:'Lǚxíng shí, nǐ xǐhuan yìbiān zǒulù, yìbiān zuò shénme?'},
    {question:'哪些事情不应该一边做，一边做？',pinyin:'Nǎxiē shìqing bù yīnggāi yìbiān zuò, yìbiān zuò?'}
  ],structureVariants:[{label:'陈述同时动作',formula:'一边 A，一边 B',formulaEn:'A while B',explanation:'两个动作由同一个主语同时进行。',example:'我们一边喝红茶，一边看地图。',examplePinyin:'Wǒmen yìbiān hē hóngchá, yìbiān kàn dìtú.'},{label:'邀请一起做',formula:'咱们一边 A，一边 B 吧',formulaEn:'let us do A while doing B',explanation:'句末“吧”让表达成为建议或邀请。',example:'咱们一边吃蛋糕，一边聊天儿吧。',examplePinyin:'Zánmen yìbiān chī dàngāo, yìbiān liáotiānr ba.'}],followUp:[{image:img('photo-text-3-cake-chat'),promptEn:'Describe two actions happening together at the party.',target:'先说一个生活中的同时动作，再判断一个不应该同时做的组合。',sampleAnswer:'大家一边吃蛋糕，一边聊天儿。'}]}
};

const detailQuestion = ([id,question,pinyin,answer,answerPinyin,acceptedAnswers,informationPoint]) => ({id,question,pinyin,question_pinyin:pinyin,answer,answerPinyin,answer_pinyin:answerPinyin,acceptedAnswers,informationPoint});
const textTeachingNotes = Object.fromEntries([
  {textId:'t_hsk3_l13_01',presentationMode:'listen_first_progressive',listenPrompt:'先听三个人怎样点菜，再判断王一雪最后提出了什么邀请。',preReadingQuestions:[{question:'朋友请客时，你会先问什么？',pinyin:'Péngyou qǐngkè shí, nǐ huì xiān wèn shénme?'},{question:'三个人点很多菜可能有什么问题？',pinyin:'Sān gè rén diǎn hěn duō cài kěnéng yǒu shénme wèntí?'}],overallChoice:{id:'l13_t1_gist',question:'这个对话主要谈什么？',pinyin:'Zhège duìhuà zhǔyào tán shénme?',options:['三个人在饭馆点菜，并发出做客邀请','三个人在商店买礼物','邻居在家里看地图','一家人在准备音乐'],answer:'三个人在饭馆点菜，并发出做客邀请'},details:[
    ['l13_t1_d01','今天谁请客？他让大家怎样点菜？','Jīntiān shéi qǐngkè? Tā ràng dàjiā zěnyàng diǎn cài?','杨同乐请客，想吃什么就点什么。','Yáng Tónglè qǐngkè, xiǎng chī shénme jiù diǎn shénme.',['杨同乐请客，想吃什么就点什么','今天杨同乐请客'],'请客人和点菜方式'],
    ['l13_t1_d02','南方菜和北方菜有什么不同？','Nánfāng cài hé běifāng cài yǒu shénme bù tóng?','做法不同。','Zuòfǎ bù tóng.',['做法不同','南方菜跟北方菜的做法不同'],'南北方菜的差异'],
    ['l13_t1_d03','同事为什么让杨同乐决定点什么？','Tóngshì wèishénme ràng Yáng Tónglè juédìng diǎn shénme?','因为他不常吃南方菜。','Yīnwèi tā bù cháng chī nánfāng cài.',['他不常吃南方菜','因为同事不常吃南方菜'],'让杨同乐决定的原因'],
    ['l13_t1_d04','王一雪为什么说别点那么多？','Wáng Yīxuě wèishénme shuō bié diǎn nàme duō?','因为他们只有三个人。','Yīnwèi tāmen zhǐyǒu sān gè rén.',['他们只有三个人','咱们就三个人'],'控制菜量的原因'],
    ['l13_t1_d05','王一雪为什么请大家下周去她家？她要做什么菜？','Wáng Yīxuě wèishénme qǐng dàjiā xià zhōu qù tā jiā? Tā yào zuò shénme cài?','她儿子过生日，她要给大家做北京菜。','Tā érzi guò shēngrì, tā yào gěi dàjiā zuò Běijīng cài.',['她儿子过生日，她要做北京菜','下周她儿子过生日，她给大家做北京菜'],'邀请的原因与活动']
  ],keyPoints:[{hanzi:'今天我请客',pinyin:'Jīntiān wǒ qǐngkè.',note:'杨同乐付钱并请同事点菜。'},{hanzi:'咱们就三个人，别点那么多',pinyin:'Zánmen jiù sān gè rén, bié diǎn nàme duō.',note:'根据人数控制菜量。'},{hanzi:'有时间的话，就来我家做客',pinyin:'Yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.',note:'用条件—结果结构发出口头邀请。'}],cultureDiscussion:{title:'请客、点菜与口头邀请',titleEn:'Treating, Ordering and Inviting',questions:[{hanzi:'在你的家乡，朋友一起吃饭时通常怎样点菜？',pinyin:'Zài nǐ de jiāxiāng, péngyou yìqǐ chīfàn shí tōngcháng zěnyàng diǎn cài?'},{hanzi:'你会怎样邀请同学来家里做客？',pinyin:'Nǐ huì zěnyàng yāoqǐng tóngxué lái jiālǐ zuòkè?'}],wordCards:[card('请客'),card('做法'),card('做客')],background:'不同地方请客和点菜的习惯可能不同；课堂重点是清楚表达选择、数量和邀请。',sampleAnswers:[{hanzi:'我们会先问大家喜欢吃什么。',pinyin:'Wǒmen huì xiān wèn dàjiā xǐhuan chī shénme.'},{hanzi:'周末有时间的话，就来我家做客吧。',pinyin:'Zhōumò yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè ba.'}]},retellScaffold:{nodes:[{label:'请客',hint:'杨同乐让大家点菜'},{label:'比较',hint:'南方菜和北方菜做法不同'},{label:'控制菜量',hint:'三个人别点太多'},{label:'邀请',hint:'儿子过生日'},{label:'条件',hint:'有时间就来做客'}],frame:'今天……请客。大家先……，后来因为……，所以……。最后王一雪说，有时间的话，就……。'}},
  {textId:'t_hsk3_l13_02',presentationMode:'listen_first_progressive',listenPrompt:'先听主人担心什么，再找刘明怎样调整饮料和音乐。',preReadingQuestions:[{question:'第一次请新邻居来做客，你会检查什么？',pinyin:'Dì-yī cì qǐng xīn línjū lái zuòkè, nǐ huì jiǎnchá shénme?'},{question:'客人来以前，饮料通常放在哪里？',pinyin:'Kèrén lái yǐqián, yǐnliào tōngcháng fàng zài nǎli?'}],overallChoice:{id:'l13_t2_gist',question:'他们主要在解决什么问题？',pinyin:'Tāmen zhǔyào zài jiějué shénme wèntí?',options:['检查做客前的准备并调整物品','决定去哪里旅游','给孩子选择礼物','比较南方菜和北方菜'],answer:'检查做客前的准备并调整物品'},details:[
    ['l13_t2_d01','王一雪为什么有点儿担心？','Wáng Yīxuě wèishénme yǒudiǎnr dānxīn?','因为这是第一次请新邻居来做客，她担心有东西没准备好。','Yīnwèi zhè shì dì-yī cì qǐng xīn línjū lái zuòkè, tā dānxīn yǒu dōngxi méi zhǔnbèi hǎo.',['第一次请新邻居来做客','她担心有东西没准备好'],'担心的原因'],
    ['l13_t2_d02','王一雪为什么找不到饮料？','Wáng Yīxuě wèishénme zhǎo bú dào yǐnliào?','因为刘明把饮料和酒放进冰箱里了。','Yīnwèi Liú Míng bǎ yǐnliào hé jiǔ fàngjìn bīngxiāng li le.',['刘明把饮料放进冰箱了','饮料和酒在冰箱里'],'饮料的位置'],
    ['l13_t2_d03','刘明准备什么时候把饮料拿出来？','Liú Míng zhǔnbèi shénme shíhou bǎ yǐnliào ná chūlai?','客人来了再拿出来。','Kèrén lái le zài ná chūlai.',['客人来了再拿出来','等客人来再拿出来'],'取出饮料的时间'],
    ['l13_t2_d04','音乐的声音有什么问题？刘明要怎么办？','Yīnyuè de shēngyīn yǒu shénme wèntí? Liú Míng yào zěnme bàn?','声音太大，他要关小一点儿。','Shēngyīn tài dà, tā yào guān xiǎo yìdiǎnr.',['声音太大，要关小一点儿','刘明要把声音关小一点儿'],'声音状态与调整'],
    ['l13_t2_d05','准备好以后，两个人要做什么？','Zhǔnbèi hǎo yǐhòu, liǎng gè rén yào zuò shénme?','他们要等客人来。','Tāmen yào děng kèrén lái.',['等客人来','他们就等客人来'],'准备后的行动']
  ],keyPoints:[{hanzi:'我把饮料和酒都放进冰箱里了',pinyin:'Wǒ bǎ yǐnliào hé jiǔ dōu fàngjìn bīngxiāng li le.',note:'把受影响的物品提前，并说明移动结果。'},{hanzi:'你把声音开得太大了',pinyin:'Nǐ bǎ shēngyīn kāi de tài dà le.',note:'用把字句说明声音形成的状态。'},{hanzi:'客人来了再拿出来',pinyin:'Kèrén lái le zài ná chūlai.',note:'说明动作发生的时间和方向。'}],cultureDiscussion:{title:'在家接待客人的准备',titleEn:'Preparing to Welcome Guests',questions:[{hanzi:'客人来以前，你最先准备什么？',pinyin:'Kèrén lái yǐqián, nǐ zuì xiān zhǔnbèi shénme?'},{hanzi:'怎样的音乐和声音比较合适？',pinyin:'Zěnyàng de yīnyuè hé shēngyīn bǐjiào héshì?'}],wordCards:[card('邻居'),card('放心'),card('客人')],background:'待客准备没有唯一清单；学生可以根据自己的家庭、宿舍或公共空间表达。',sampleAnswers:[{hanzi:'我先把饮料放进冰箱。',pinyin:'Wǒ xiān bǎ yǐnliào fàngjìn bīngxiāng.'},{hanzi:'我会把音乐的声音关小一点儿。',pinyin:'Wǒ huì bǎ yīnyuè de shēngyīn guān xiǎo yìdiǎnr.'}]},retellScaffold:{nodes:[{label:'担心',hint:'第一次请新邻居'},{label:'检查',hint:'都准备好了'},{label:'饮料',hint:'放进冰箱'},{label:'音乐',hint:'声音太大'},{label:'最后',hint:'等客人来'}],frame:'王一雪担心……。刘明说……。他已经把……，还要把……。最后他们……。'}},
  {textId:'t_hsk3_l13_03',presentationMode:'listen_first_progressive',listenPrompt:'先听晚会上的祝福和礼物，再判断礼物为什么适合小明。',preReadingQuestions:[{question:'给喜欢画画的人送什么礼物比较合适？',pinyin:'Gěi xǐhuan huàhuà de rén sòng shénme lǐwù bǐjiào héshì?'},{question:'生日晚会上，大家可以同时做哪些事？',pinyin:'Shēngrì wǎnhuì shang, dàjiā kěyǐ tóngshí zuò nǎxiē shì?'}],overallChoice:{id:'l13_t3_gist',question:'生日晚会上发生了什么？',pinyin:'Shēngrì wǎnhuì shang fāshēng le shénme?',options:['客人送了合适的礼物，大家准备吃蛋糕聊天儿','大家讨论明天去饭馆吃饭','主人找不到冰箱里的饮料','夫妻介绍世界地图'],answer:'客人送了合适的礼物，大家准备吃蛋糕聊天儿'},details:[
    ['l13_t3_d01','王一雪为什么请大家来？她希望大家怎么样？','Wáng Yīxuě wèishénme qǐng dàjiā lái? Tā xīwàng dàjiā zěnmeyàng?','因为是她儿子的生日晚会，她希望大家玩得开心。','Yīnwèi shì tā érzi de shēngrì wǎnhuì, tā xīwàng dàjiā wán de kāixīn.',['参加儿子的生日晚会，希望大家玩得开心','因为是小明的生日晚会'],'晚会的原因与主人的希望'],
    ['l13_t3_d02','杨同乐送给小明什么礼物？','Yáng Tónglè sòng gěi Xiǎomíng shénme lǐwù?','画板和画笔。','Huàbǎn hé huàbǐ.',['画板和画笔','他送了画板和画笔'],'礼物的内容'],
    ['l13_t3_d03','杨同乐为什么选择这份礼物？','Yáng Tónglè wèishénme xuǎnzé zhè fèn lǐwù?','因为小明喜欢画画，想做一名画家。','Yīnwèi Xiǎomíng xǐhuan huàhuà, xiǎng zuò yì míng huàjiā.',['小明喜欢画画，想做画家','因为小明想做一名画家'],'选择礼物的原因'],
    ['l13_t3_d04','小明看到礼物以后怎么说？','Xiǎomíng kàndào lǐwù yǐhòu zěnme shuō?','他说这正是他需要的，他太喜欢了。','Tā shuō zhè zhèng shì tā xūyào de, tā tài xǐhuan le.',['这正是我需要的，我太喜欢了','他说他很需要也很喜欢'],'收到礼物后的回应'],
    ['l13_t3_d05','王一雪拿盘子以后，大家要做什么？','Wáng Yīxuě ná pánzi yǐhòu, dàjiā yào zuò shénme?','一边吃蛋糕，一边聊天儿。','Yìbiān chī dàngāo, yìbiān liáotiānr.',['一边吃蛋糕，一边聊天儿','吃蛋糕和聊天儿'],'同时进行的活动']
  ],keyPoints:[{hanzi:'这正是我需要的',pinyin:'Zhè zhèng shì wǒ xūyào de.',note:'小明明确说明礼物很合适。'},{hanzi:'我去把盘子拿过来',pinyin:'Wǒ qù bǎ pánzi ná guòlai.',note:'把字句说明盘子向说话地点移动。'},{hanzi:'一边吃蛋糕，一边聊天儿',pinyin:'Yìbiān chī dàngāo, yìbiān liáotiānr.',note:'同一组人同时进行两个动作。'}],cultureDiscussion:{title:'根据兴趣选择礼物',titleEn:'Choosing a Gift for Someone',questions:[{hanzi:'你会先了解朋友的什么兴趣？',pinyin:'Nǐ huì xiān liǎojiě péngyou de shénme xìngqù?'},{hanzi:'收到合适的礼物时，你会怎样回应？',pinyin:'Shōudào héshì de lǐwù shí, nǐ huì zěnyàng huíyìng?'}],wordCards:[card('晚会'),card('礼物'),card('画家')],background:'礼物的价格不是重点；课堂关注怎样根据兴趣说明选择理由并礼貌回应。',sampleAnswers:[{hanzi:'她喜欢画画，所以我送她画笔。',pinyin:'Tā xǐhuan huàhuà, suǒyǐ wǒ sòng tā huàbǐ.'},{hanzi:'这正是我需要的，谢谢你！',pinyin:'Zhè zhèng shì wǒ xūyào de, xièxie nǐ!'}]},retellScaffold:{nodes:[{label:'欢迎',hint:'参加生日晚会'},{label:'祝福',hint:'生日快乐'},{label:'礼物',hint:'画板和画笔'},{label:'理由',hint:'喜欢画画、想做画家'},{label:'活动',hint:'吃蛋糕、聊天儿'}],frame:'大家来参加……。杨同乐送给小明……，因为……。小明觉得……。后来大家一边……，一边……。'}},
  {textId:'t_hsk3_l13_04',presentationMode:'listen_first_progressive',listenPrompt:'先听新邻居来自哪里、喜欢做什么，再找他们学习中文的原因。',preReadingQuestions:[{question:'世界地图上的红点可以表示什么？',pinyin:'Shìjiè dìtú shang de hóng diǎn kěyǐ biǎoshì shénme?'},{question:'外国朋友为什么可能开始学习中文？',pinyin:'Wàiguó péngyou wèishénme kěnéng kāishǐ xuéxí Zhōngwén?'}],overallChoice:{id:'l13_t4_gist',question:'这篇日记主要介绍谁？',pinyin:'Zhè piān rìjì zhǔyào jièshào shéi?',options:['来自英国、喜欢旅行和学习中文的新邻居','饭馆里请客的三个同事','生日会上画画的孩子','准备饮料和音乐的夫妻'],answer:'来自英国、喜欢旅行和学习中文的新邻居'},details:[
    ['l13_t4_d01','王一雪的新邻居是谁？他们来自哪里？','Wáng Yīxuě de xīn línjū shì shéi? Tāmen láizì nǎlǐ?','是一对来自英国的夫妻。','Shì yí duì láizì Yīngguó de fūqī.',['来自英国的夫妻','一对英国夫妻'],'新邻居的身份和来源'],
    ['l13_t4_d02','上周王一雪去邻居家做客时，邻居准备了什么？','Shàng zhōu Wáng Yīxuě qù línjū jiā zuòkè shí, línjū zhǔnbèi le shénme?','他们做了很多好吃的，还准备了英国的红茶。','Tāmen zuò le hěn duō hǎochī de, hái zhǔnbèi le Yīngguó de hóngchá.',['很多好吃的和英国红茶','他们准备了英国红茶'],'上周做客的待客内容'],
    ['l13_t4_d03','地图上的红点表示什么？','Dìtú shang de hóng diǎn biǎoshì shénme?','他们去过的地方。','Tāmen qùguo de dìfang.',['他们去过的地方','夫妻旅游去过的地方'],'地图标记的含义'],
    ['l13_t4_d04','他们为什么开始学习中文？','Tāmen wèishénme kāishǐ xuéxí Zhōngwén?','因为他们感到东方的文化很特别。','Yīnwèi tāmen gǎndào dōngfāng de wénhuà hěn tèbié.',['东方的文化很特别','因为他们对东方文化感兴趣'],'学习中文的原因'],
    ['l13_t4_d05','今天王一雪为什么请新邻居到她家？','Jīntiān Wáng Yīxuě wèishénme qǐng xīn línjū dào tā jiā?','请他们看看中国人的家，也尝尝中国菜。','Qǐng tāmen kànkan Zhōngguórén de jiā, yě chángchang Zhōngguócài.',['看看中国人的家，也尝尝中国菜','体验中国人的家和中国菜'],'今天邀请邻居的目的']
  ],keyPoints:[{hanzi:'来自英国的夫妻',pinyin:'Láizì Yīngguó de fūqī.',note:'“来自”说明新邻居的来源。'},{hanzi:'直到十二点多才回家',pinyin:'Zhídào shí’èr diǎn duō cái huí jiā.',note:'说明聊天持续到很晚。'},{hanzi:'每一个红点都是他们去过的地方',pinyin:'Měi yí gè hóng diǎn dōu shì tāmen qùguo de dìfang.',note:'地图上的点记录旅行经历。'},{hanzi:'感到东方的文化很特别',pinyin:'Gǎndào dōngfāng de wénhuà hěn tèbié.',note:'这是他们开始学习中文的原因。'}],cultureDiscussion:{title:'旅行、语言与双向文化交流',titleEn:'Travel, Language and Cultural Exchange',questions:[{hanzi:'你会在地图上标出哪些去过的地方？',pinyin:'Nǐ huì zài dìtú shang biāochū nǎxiē qùguo de dìfang?'},{hanzi:'你想向新邻居介绍哪一种本地文化？',pinyin:'Nǐ xiǎng xiàng xīn línjū jièshào nǎ yì zhǒng běndì wénhuà?'}],wordCards:[card('来自'),card('地图'),card('文化'),card('英国')],background:'交流是双向的：既可以介绍中国家庭和中国菜，也可以了解邻居的旅行、红茶和语言学习经历。',sampleAnswers:[{hanzi:'我想向新邻居介绍我们家乡的菜。',pinyin:'Wǒ xiǎng xiàng xīn línjū jièshào wǒmen jiāxiāng de cài.'},{hanzi:'我学习中文，因为我感到中国文化很特别。',pinyin:'Wǒ xuéxí Zhōngwén, yīnwèi wǒ gǎndào Zhōngguó wénhuà hěn tèbié.'}]},retellScaffold:{nodes:[{label:'人物',hint:'来自英国的夫妻'},{label:'做客',hint:'红茶、聊天儿'},{label:'旅行',hint:'世界地图和红点'},{label:'学习',hint:'东方文化很特别'},{label:'今天',hint:'体验中国家庭和中国菜'}],frame:'王一雪的新邻居是……。上周她……，他们一边……，一边……。地图上的红点……。因为……，所以他们……。今天……。'}}
].map(note => [note.textId,{...note,sourceType:'teaching_extension',classQuestions:note.details.map(detailQuestion)}]));

const sceneData = {
  1:{title:'饭馆请客与生日邀请',subtitle:'三位同事在饭馆点菜，并把一次饭局连接到下一次做客邀请。',steps:[
    {title:'看菜单，比较南北方菜',image:img('photo-text-1-menu'),talkHint:'看桌上的菜单、鱼和三位正在商量点菜的同事。',prompt:'今天谁请客？他们在比较什么？',promptPinyin:'Jīntiān shéi qǐngkè? Tāmen zài bǐjiào shénme?',promptEn:'Who is treating today, and what are they comparing?',labels:[{word:'请客',x:10,y:18,targetX:55,targetY:47},{word:'南方',x:88,y:18,targetX:70,targetY:38},{word:'北方',x:10,y:82,targetX:31,targetY:39},{word:'做法',x:88,y:82,targetX:67,targetY:63}],words:['请客','南方','北方','做法','不同'],sentence:'杨同乐请客，大家比较南方菜和北方菜的不同做法。',sampleAnswers:[example('今天杨同乐请客。','Jīntiān Yáng Tónglè qǐngkè.','Yang Tongle is treating today.'),example('南方菜和北方菜的做法不同。','Nánfāng cài hé běifāng cài de zuòfǎ bù tóng.','Southern and northern dishes are made differently.')]},
    {title:'控制菜量，发出邀请',image:img('photo-text-1-invitation'),talkHint:'看已点的菜、三个人的表情和王一雪正在说话的邀请手势。',prompt:'他们为什么不再多点菜？王一雪又邀请大家做什么？',promptPinyin:'Tāmen wèishénme bú zài duō diǎn cài? Wáng Yīxuě yòu yāoqǐng dàjiā zuò shénme?',promptEn:'Why do they stop ordering, and what does Wang Yixue invite everyone to do?',labels:[{word:'加',x:10,y:18,targetX:48,targetY:76},{word:'的话',x:88,y:18,targetX:57,targetY:47},{word:'做客',x:10,y:82,targetX:74,targetY:42}],words:['加','的话','做客'],sentence:'三个人不点太多；有时间的话，就去王一雪家做客。',sampleAnswers:[example('咱们就三个人，别点那么多。','Zánmen jiù sān gè rén, bié diǎn nàme duō.','There are only three of us, so do not order too much.'),example('有时间的话，就来我家做客。','Yǒu shíjiān dehuà, jiù lái wǒ jiā zuòkè.','If you have time, come to my home.')]}]},
  2:{title:'在家准备接待新邻居',subtitle:'主人检查饮料、酒、冰箱和音乐，为客人到来调整环境。',steps:[
    {title:'检查客人用品',image:img('photo-text-2-fridge'),talkHint:'看冰箱里的饮料和酒，以及正在一起检查准备的夫妻。',prompt:'刘明把什么放进冰箱了？为什么？',promptPinyin:'Liú Míng bǎ shénme fàngjìn bīngxiāng le? Wèishénme?',promptEn:'What did Liu Ming put into the fridge, and why?',labels:[{word:'邻居',x:10,y:18,targetX:28,targetY:42},{word:'放心',x:88,y:18,targetX:39,targetY:39},{word:'酒',x:10,y:82,targetX:69,targetY:61},{word:'放',x:88,y:82,targetX:72,targetY:53}],words:['邻居','放心','酒','放'],sentence:'刘明把饮料和酒放进冰箱，让王一雪放心。',sampleAnswers:[example('他们在等新邻居来做客。','Tāmen zài děng xīn línjū lái zuòkè.','They are waiting for the new neighbors.'),example('刘明把饮料和酒放进冰箱了。','Liú Míng bǎ yǐnliào hé jiǔ fàngjìn bīngxiāng le.','Liu Ming put the drinks and wine into the fridge.')]},
    {title:'调整音乐，等客人',image:img('photo-text-2-music'),talkHint:'看音箱、音量图标和门边准备迎接客人的主人。',prompt:'音乐有什么问题？他们接下来要做什么？',promptPinyin:'Yīnyuè yǒu shénme wèntí? Tāmen jiēxiàlái yào zuò shénme?',promptEn:'What is wrong with the music, and what will they do next?',labels:[{word:'客人',x:10,y:18,targetX:78,targetY:45},{word:'放',x:88,y:18,targetX:61,targetY:60},{word:'放心',x:10,y:82,targetX:36,targetY:42}],words:['客人','放','放心'],sentence:'刘明把声音关小一点儿，然后他们等客人来。',sampleAnswers:[example('音乐的声音太大了。','Yīnyuè de shēngyīn tài dà le.','The music is too loud.'),example('他们准备好了，就等客人来。','Tāmen zhǔnbèi hǎo le, jiù děng kèrén lái.','They are ready and are waiting for the guests.')]}]},
  3:{title:'生日晚会与合适的礼物',subtitle:'客人送出适合小明兴趣的礼物，大家一起吃蛋糕、聊天儿。',steps:[
    {title:'欢迎客人，打开礼物',image:img('photo-text-3-gift'),talkHint:'看生日蛋糕、礼物、画板和画笔。',prompt:'这是什么晚会？礼物为什么适合小明？',promptPinyin:'Zhè shì shénme wǎnhuì? Lǐwù wèishénme shìhé Xiǎomíng?',promptEn:'What party is this, and why does the gift suit Xiaoming?',labels:[{word:'晚会',x:10,y:18,targetX:44,targetY:38},{word:'礼物',x:88,y:18,targetX:63,targetY:58},{word:'画家',x:10,y:82,targetX:72,targetY:46}],words:['晚会','礼物','画家'],sentence:'生日晚会上，杨同乐送给想做画家的小明画板和画笔。',sampleAnswers:[example('大家来参加小明的生日晚会。','Dàjiā lái cānjiā Xiǎomíng de shēngrì wǎnhuì.','Everyone comes to Xiaoming’s birthday party.'),example('小明喜欢画画，想做一名画家。','Xiǎomíng xǐhuan huàhuà, xiǎng zuò yì míng huàjiā.','Xiaoming likes drawing and wants to be a painter.')]},
    {title:'拿盘子，吃蛋糕聊天儿',image:img('photo-text-3-cake-chat'),talkHint:'看主人拿来的盘子和围着蛋糕聊天儿的客人。',prompt:'王一雪把什么拿过来？大家同时做哪两件事？',promptPinyin:'Wáng Yīxuě bǎ shénme ná guòlai? Dàjiā tóngshí zuò nǎ liǎng jiàn shì?',promptEn:'What does Wang Yixue bring, and which two things do they do together?',labels:[{word:'盘子',x:10,y:18,targetX:58,targetY:68},{word:'一边',x:88,y:18,targetX:49,targetY:46},{word:'聊天儿',x:88,y:82,targetX:70,targetY:42}],words:['盘子','一边','聊天儿'],sentence:'王一雪把盘子拿过来，大家一边吃蛋糕，一边聊天儿。',sampleAnswers:[example('桌上有蛋糕和盘子。','Zhuō shang yǒu dàngāo hé pánzi.','There is cake and there are plates on the table.'),example('大家一边吃蛋糕，一边聊天儿。','Dàjiā yìbiān chī dàngāo, yìbiān liáotiānr.','Everyone eats cake while chatting.')]}]},
  4:{title:'英国新邻居与文化交流',subtitle:'日记把两次互相做客、旅行地图和学习中文连成一个完整故事。',steps:[
    {title:'喝英国红茶，看旅行地图',image:img('photo-text-4-tea-map'),talkHint:'看英国夫妻、红茶和有很多红点的世界地图。',prompt:'新邻居来自哪里？地图上的红点表示什么？',promptPinyin:'Xīn línjū láizì nǎlǐ? Dìtú shang de hóng diǎn biǎoshì shénme?',promptEn:'Where are the new neighbors from, and what do the red dots mean?',labels:[{word:'英国',x:10,y:18,targetX:33,targetY:40},{word:'夫妻',x:88,y:18,targetX:40,targetY:43},{word:'地图',x:10,y:82,targetX:75,targetY:38},{word:'点',x:88,y:82,targetX:76,targetY:43}],words:['英国','夫妻','地图','点'],sentence:'来自英国的夫妻用世界地图介绍他们去过的地方。',sampleAnswers:[example('新邻居是来自英国的夫妻。','Xīn línjū shì láizì Yīngguó de fūqī.','The new neighbors are a couple from the UK.'),example('每一个红点都是他们去过的地方。','Měi yí gè hóng diǎn dōu shì tāmen qùguo de dìfang.','Each red dot is a place they visited.')]},
    {title:'互相做客，交流文化',image:img('photo-text-4-culture'),talkHint:'看两家人分享中国菜、英国红茶和中文学习卡。',prompt:'他们为什么学习中文？今天为什么来王一雪家？',promptPinyin:'Tāmen wèishénme xuéxí Zhōngwén? Jīntiān wèishénme lái Wáng Yīxuě jiā?',promptEn:'Why do they study Chinese, and why are they visiting today?',labels:[{word:'来自',x:10,y:18,targetX:28,targetY:40},{word:'直到',x:88,y:18,targetX:48,targetY:72},{word:'感到',x:10,y:82,targetX:62,targetY:46},{word:'文化',x:88,y:82,targetX:73,targetY:38}],words:['来自','直到','感到','东方','文化'],sentence:'他们感到东方文化很特别，开始学中文，也来体验中国人的家。',sampleAnswers:[example('他们感到东方的文化很特别。','Tāmen gǎndào dōngfāng de wénhuà hěn tèbié.','They feel that Eastern culture is special.'),example('今天他们来看看中国人的家，也尝尝中国菜。','Jīntiān tāmen lái kànkan Zhōngguórén de jiā, yě chángchang Zhōngguócài.','Today they see a Chinese home and taste Chinese food.')]}]}
};

const q = (id, question, options, answer, questionEn='Choose the best answer.') => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {session:'A',title:'在饭馆请客并发出邀请',words:['请客','南方','北方','做法','不同','加','的话','做客'],photo:img('photo-text-1-menu'),recognition:[['“请客”表示什么？','stand treat',['stand treat','be a guest','draw a map','feel at ease']],['“南方”的反义方向是什么？','北方',['北方','东方','英国','邻居']],['哪个词表示“different”？','不同',['不同','放心','来自','直到']],['“做客”是谁的身份？','客人',['客人','画家','邻居','夫妻']],['“加一个菜”表示什么？','再点一个菜',['再点一个菜','少点一个菜','把菜拿走','准备礼物']]],pairs:[['请客','stand treat'],['南方','south'],['北方','north'],['做法','way of making'],['做客','be a guest']],contexts:[['今天我____，你们想吃什么就点什么。','请客',['请客','做客','放心','聊天儿']],['南方菜和北方菜的____不同。','做法',['做法','地图','礼物','文化']],['咱们就三个人，别____那么多菜。','点',['点','来自','直到','感到']],['你有时间____，就来我家做客。','的话',['的话','一边','放心','不同']],['除了鱼，我们再____一个鸡肉。','加',['加','放','来自','请客']]],challenge:[['今天谁付饭钱？','请客的人',['请客的人','做客的人','邻居','画家']],['哪一句是邀请？','有时间的话，就来我家做客。',['有时间的话，就来我家做客。','南方菜做法不同。','别点那么多。','今天我请客。']],['三个人为什么别点太多？','菜可能吃不完',['菜可能吃不完','没有客人','没有地图','声音太大']],['“有时间”是什么？','条件',['条件','结果','礼物','地点']],['条件成立后的结果由哪个词引出？','就',['就','把','一边','直到']],['哪一句比较做法？','南方菜跟北方菜的做法不同。',['南方菜跟北方菜的做法不同。','我把酒放进冰箱。','他们来自英国。','我想做画家。']],['你不熟悉菜单时，可以怎么说？','还是你决定吧。',['还是你决定吧。','我把地图打开。','直到十二点。','放心客人。']],['“stand treat”对应哪个词？','请客',['请客','做客','客人','晚会']],['要把A作业带到后面做什么？','准备最终欢迎活动',['准备最终欢迎活动','上传录音','抄完整课文','删除邀请']],['A课时的交际目标是什么？','点菜并发出有条件的邀请',['点菜并发出有条件的邀请','介绍世界地图','调整音乐','送绘画礼物']]]},
  {session:'B',title:'检查并调整待客准备',words:['邻居','放心','酒','放','客人'],photo:img('photo-text-2-fridge'),recognition:[['“邻居”住在哪里？','住在附近',['住在附近','住在饭馆','住在地图上','只住英国']],['“放心吧”是在做什么？','让人不要担心',['让人不要担心','请人付钱','介绍地图','选择礼物']],['哪个词表示“guest”？','客人',['客人','画家','夫妻','邻居']],['哪个词表示“put”？','放',['放','加','点','直到']],['“酒”属于什么？','饮品',['饮品','地图','人物','方向']]],pairs:[['邻居','neighbor'],['放心','feel at ease'],['酒','alcoholic drink; wine'],['放','put'],['客人','guest']],contexts:[['第一次请新____来做客，我有点儿担心。','邻居',['邻居','画家','文化','地图']],['____吧，都已经准备好了。','放心',['放心','请客','来自','直到']],['我把饮料和____放进冰箱。','酒',['酒','地图','礼物','盘子']],['客人来了再把饮料拿____。','出来',['出来','进去','起来','下去']],['音乐太大了，请把声音关____一点儿。','小',['小','进','来','上']]],challenge:[['主人担心什么？','有东西没准备好',['有东西没准备好','没有去旅游','饭馆菜太多','地图没有红点']],['饮料现在在哪里？','冰箱里',['冰箱里','地图上','饭馆里','画板上']],['“把饮料放进冰箱”中的结果是什么？','饮料进入冰箱',['饮料进入冰箱','声音变大','客人回家','礼物打开']],['音乐有什么问题？','声音太大',['声音太大','声音太小','没有音乐','音乐来自英国']],['怎样调整声音？','关小一点儿',['关小一点儿','放进冰箱','拿过来','点一个菜']],['哪一句的“把”字句正确？','请把盘子拿过来。',['请把盘子拿过来。','请盘子把过来。','把请盘子拿。','盘子过来把。']],['客人来了以后再做什么？','拿出饮料和酒',['拿出饮料和酒','打开地图','再点南方菜','去英国']],['B作业继续使用什么？','A的邀请和菜单材料',['A的邀请和菜单材料','新的录音','课文四全文','别人的作业']],['B课时的交际目标是什么？','检查准备并解决待客问题',['检查准备并解决待客问题','比较文化','介绍职业','讨论旅游']],['完成准备后，他们做什么？','等客人来',['等客人来','马上睡觉','去饭馆','继续开大音乐']]]},
  {session:'C',title:'欢迎新邻居并交流文化',words:['晚会','礼物','画家','盘子','一边','聊天儿','来自','夫妻','直到','地图','点','感到','东方','文化','英国'],photo:img('photo-text-4-tea-map'),recognition:[['“夫妻”是哪两个人？','丈夫和妻子',['丈夫和妻子','老师和学生','客人和画家','两个邻居']],['哪个词表示“map”？','地图',['地图','盘子','礼物','晚会']],['“来自英国”表示什么？','from the UK',['from the UK','go to the UK','learn English','drink tea']],['哪个词表示“culture”？','文化',['文化','东方','感到','直到']],['“一边……一边……”表示什么？','两个动作同时进行',['两个动作同时进行','一个条件和结果','移动一个东西','一直到某时间']]],pairs:[['晚会','evening party'],['礼物','gift; present'],['夫妻','husband and wife'],['地图','map'],['文化','culture']],contexts:[['小明想做一名____。','画家',['画家','客人','邻居','夫妻']],['我把____拿过来，大家吃蛋糕。','盘子',['盘子','地图','酒','文化']],['我们一边喝红茶，一边____。','聊天儿',['聊天儿','请客','放心','来自']],['他们____英国，喜欢旅游。','来自',['来自','直到','感到','加']],['我们聊天儿____十二点多才回家。','直到',['直到','来自','一边','的话']]],challenge:[['礼物为什么适合小明？','他喜欢画画，想做画家',['他喜欢画画，想做画家','他来自英国','他想开饭馆','他没有盘子']],['吃蛋糕时还做什么？','聊天儿',['聊天儿','开车','睡觉','点菜']],['新邻居来自哪里？','英国',['英国','中国南方','中国北方','东方地图']],['地图红点表示什么？','他们去过的地方',['他们去过的地方','客人的座位','饭馆的位置','礼物的价格']],['他们为什么学中文？','感到东方文化很特别',['感到东方文化很特别','想做画家','声音太大','酒在冰箱']],['哪一句表示两个动作同时进行？','一边喝茶，一边看地图。',['一边喝茶，一边看地图。','有时间的话，就来。','把盘子拿来。','直到十二点回家。']],['课文四是什么体裁？','日记',['日记','菜单','广告','新闻']],['今天英国夫妻来做什么？','体验中国人的家和中国菜',['体验中国人的家和中国菜','替大家付饭钱','调整音乐','买地图']],['C最终作业在哪里完成？','课堂展示或交流',['课堂展示或交流','必须上传音频','只在家抄写','在线考试']],['C课时要连接哪两篇课文？','生日晚会和新邻居日记',['生日晚会和新邻居日记','两个饭馆菜单','两篇天气新闻','两个购物广告']]]}
];

function mission(spec) {
  const lower = spec.session.toLowerCase();
  const makeQuiz = (rows, kind) => rows.map((item,index)=>q(`${lower}_${kind}_${String(index + 1).padStart(2,'0')}`,item[0],item[2],item[1]));
  return {id:`pm_hsk3_l13_${lower}`,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:`第${{A:1,B:2,C:3}[spec.session]}次课课前热身赛`,titleEn:spec.title,subtitleEn:'Five stages prepare you for the next classroom task.',scenario:spec.title,goals:[spec.title,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:'Learn the words and expressions needed for the next classroom task. The complete textbook text stays for class.',sourceType:'teaching_extension',stages:[
    {id:`${lower}1`,title:'认识词语、短语和背景',titleEn:'Meet the Words',interactionType:'study_list',photos:[spec.photo],keywordCards:spec.words.map(card)},
    {id:`${lower}2`,title:'认读与词义选择',titleEn:'Recognition',interactionType:'practice_quiz',questions:makeQuiz(spec.recognition,'rec')},
    {id:`${lower}3`,title:'中英文匹配',titleEn:'Chinese-English Match',interactionType:'timed_match',pairs:spec.pairs.map((item,index)=>({id:`${lower}_pair_${String(index+1).padStart(2,'0')}`,word:item[0],meaning:item[1]}))},
    {id:`${lower}4`,title:'语境判断与填空',titleEn:'Context Check',interactionType:'practice_quiz',questions:makeQuiz(spec.contexts,'ctx')},
    {id:`${lower}5`,title:'有分数的最终挑战',titleEn:'Scored Challenge',interactionType:'ranked_quiz',questions:makeQuiz(spec.challenge,'ch')}
  ],reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],persistenceKeyPattern:`ClassReadyPreview_HSK3-L13_${spec.session}_{student}_v1`,completionMessageEn:'Preview complete. Bring one useful sentence to class.'};
}

const fills = [
  {id:'l13_fill_group_01',type:'vocab_fill_group',stage:'in_class',contentRole:'lesson',prompt_en:'Complete the restaurant and invitation contexts.',data:{wordBank:['请客','做法','不同','加','做客'],wordBank_pinyin:['qǐngkè','zuòfǎ','bù tóng','jiā','zuòkè'],sentences:[
    ['l13_fill_01_01','今天我____，你们想吃什么就点什么。','Jīntiān wǒ ____, nǐmen xiǎng chī shénme jiù diǎn shénme.','请客'],
    ['l13_fill_01_02','南方菜和北方菜的____不一样。','Nánfāng cài hé běifāng cài de ____ bù yíyàng.','做法'],
    ['l13_fill_01_03','这两家饭馆很____，你想去哪一家？','Zhè liǎng jiā fànguǎn hěn ____, nǐ xiǎng qù nǎ yì jiā?','不同'],
    ['l13_fill_01_04','菜不够的话，我们再____一个。','Cài bú gòu dehuà, wǒmen zài ____ yí gè.','加'],
    ['l13_fill_01_05','周末有时间的话，就来我家____。','Zhōumò yǒu shíjiān dehuà, jiù lái wǒ jiā ____.','做客']
  ].map(([id,sentence,sentence_pinyin,answer])=>({id,sentence,sentence_pinyin,answer})),speakingLevels:{support:'用词库完成一句。',core:'完成一段点菜与邀请表达。',challenge:'比较做法并根据人数调整菜单。'}}},
  {id:'l13_fill_group_02',type:'vocab_fill_group',stage:'in_class',contentRole:'transfer',prompt_en:'Complete the hosting-preparation contexts.',data:{wordBank:['邻居','放心','酒','放','客人'],wordBank_pinyin:['línjū','fàngxīn','jiǔ','fàng','kèrén'],sentences:[
    ['l13_fill_02_01','新____明天要来我们家。','Xīn ____ míngtiān yào lái wǒmen jiā.','邻居'],
    ['l13_fill_02_02','你____吧，我都检查好了。','Nǐ ____ ba, wǒ dōu jiǎnchá hǎo le.','放心'],
    ['l13_fill_02_03','请把饮料和____放进冰箱。','Qǐng bǎ yǐnliào hé ____ fàngjìn bīngxiāng.','酒'],
    ['l13_fill_02_04','我先把盘子____在桌上。','Wǒ xiān bǎ pánzi ____ zài zhuō shang.','放'],
    ['l13_fill_02_05','等____来了，再把饮料拿出来。','Děng ____ lái le, zài bǎ yǐnliào ná chūlai.','客人']
  ].map(([id,sentence,sentence_pinyin,answer])=>({id,sentence,sentence_pinyin,answer})),speakingLevels:{support:'用词库完成一句。',core:'说明三项待客准备。',challenge:'发现问题并用把字句解决。'}}},
  {id:'l13_fill_group_03',type:'vocab_fill_group',stage:'in_class',contentRole:'review',prompt_en:'Connect L13 with familiar planning and weather contexts.',data:{wordBank:['地图','文化','或者','变化','放心'],wordBank_pinyin:['dìtú','wénhuà','huòzhě','biànhuà','fàngxīn'],sentences:[
    ['l13_fill_03_01','世界____上有很多红点。','Shìjiè ____ shang yǒu hěn duō hóng diǎn.','地图'],
    ['l13_fill_03_02','学习语言也能了解不同的____。','Xuéxí yǔyán yě néng liǎojiě bù tóng de ____.','文化'],
    ['l13_fill_03_03','我们____周六见，或者周日见。','Wǒmen ____ xīngqīliù jiàn, huòzhě xīngqītiān jiàn.','或者'],
    ['l13_fill_03_04','天气有____的话，就把雨伞放进书包。','Tiānqì yǒu ____ dehuà, jiù bǎ yǔsǎn fàngjìn shūbāo.','变化'],
    ['l13_fill_03_05','准备都完成了，你可以____了。','Zhǔnbèi dōu wánchéng le, nǐ kěyǐ ____ le.','放心']
  ].map(([id,sentence,sentence_pinyin,answer])=>({id,sentence,sentence_pinyin,answer})),speakingLevels:{support:'用词库完成一句。',core:'连接邀请、天气和文化。',challenge:'把前课内容自然放进欢迎任务。'}}}
];

const matchSpecs = [
  {id:'l13_match_01',role:'lesson',pairs:[['今天谁请客？','杨同乐请客，他让大家想吃什么就点什么。'],['南方菜和北方菜哪里不同？','两种菜的做法不同，可以比较味道和做法。'],['为什么不能再点很多菜？','因为只有三个人，点太多可能吃不完。'],['王一雪怎样发出邀请？','她说有时间的话，就来她家做客。'],['“请客”和“做客”怎样区别？','请客的人付钱或招待，做客的人去别人家。']]},
  {id:'l13_match_02',role:'transfer',pairs:[['王一雪为什么担心？','因为第一次请新邻居来，她怕有东西没准备好。'],['刘明怎样让她放心？','他已经检查了全部准备，并说明都准备好了。'],['饮料和酒在哪里？','刘明把它们放进冰箱，客人来后再拿出来。'],['音乐有什么问题？','声音开得太大，需要再关小一点儿。'],['把字句要说清什么？','要说清宾语经过动作后的位置或状态。']]},
  {id:'l13_match_03',role:'review',pairs:[['小明为什么喜欢礼物？','他喜欢画画，画板和画笔正是他需要的。'],['生日晚会上大家同时做什么？','大家一边吃蛋糕，一边聊天儿。'],['地图上的红点表示什么？','每个红点都是英国夫妻去过的一个地方。'],['英国夫妻为什么学习中文？','因为他们感到东方文化很特别。'],['前课天气变化怎样影响做客？','天气有变化的话，就要调整时间或准备雨具。']]}
];
const matchGroups = matchSpecs.map(group=>({id:group.id,type:'question_answer_match',title:'问答匹配 / Question–Answer Match',stage:'in_class',contentRole:group.role,prompt_cn:'把左侧完整问题和右侧完整回答配对，全部完成后一次提交。',prompt_en:'Match each complete question with its answer. Submit all five together.',data:{interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,pairs:group.pairs.map((pair,index)=>({id:`${group.id}_${index+1}`,left:pair[0],right:pair[1]}))}}));

const orderRows = [
  ['有时间的话，就来我家做客。',['有时间的话','就来','我家做客'],'lesson'],
  ['我把饮料和酒都放进冰箱里了。',['我','把饮料和酒','都放进','冰箱里了'],'lesson'],
  ['咱们一边吃蛋糕，一边聊天儿吧。',['咱们','一边吃蛋糕','一边聊天儿','吧'],'lesson'],
  ['新邻居是来自英国的一对夫妻。',['新邻居','是','来自英国的','一对夫妻'],'transfer'],
  ['天气有变化的话，就带一把伞。',['天气有变化的话','就','带一把伞'],'review']
];
const orders = orderRows.map((row,index)=>({id:`l13_order_${String(index+1).padStart(2,'0')}`,type:'sentence_order',stage:'in_class',contentRole:row[2],prompt_cn:'连词成句。',prompt_en:'Put the chunks in order.',correct_answer:row[0],data:{chunks:row[1],answer:row[0]}}));

const sceneRows = [
  ['三个人在饭馆，谁说最合适？',['今天我请客，你们想吃什么就点什么！','我把地图放进冰箱。','我想做一名画家。'],'今天我请客，你们想吃什么就点什么！'],
  ['菜已经很多了，怎样提醒同伴？',['咱们就三个人，别点那么多。','再加十个菜。','直到十二点才点菜。'],'咱们就三个人，别点那么多。'],
  ['朋友担心没准备好，你怎样回答？',['放心吧，我帮你看了。','你来自哪里？','一边开车一边打电话。'],'放心吧，我帮你看了。'],
  ['饮料太热，怎样处理？',['把饮料放进冰箱。','把地图吃进去。','请客人开大音乐。'],'把饮料放进冰箱。'],
  ['生日礼物正是你需要的，怎样回应？',['谢谢，我太喜欢了。','还是你点菜吧。','天气变化很快。'],'谢谢，我太喜欢了。'],
  ['大家想吃蛋糕也想聊天儿，怎样提议？',['咱们一边吃蛋糕，一边聊天儿吧。','有时间的话，就放酒。','直到英国才聊天。'],'咱们一边吃蛋糕，一边聊天儿吧。'],
  ['介绍新邻居的来源，怎样说？',['我的新邻居来自英国。','我的英国来自邻居。','邻居把英国放进来。'],'我的新邻居来自英国。'],
  ['看旅行地图时，怎样解释红点？',['每个红点都是他们去过的地方。','红点都是生日礼物。','每个点都表示酒。'],'每个红点都是他们去过的地方。'],
  ['复习L12：两个日期都可以，怎样说？',['或者周六，或者周日。','一边周六一边周日。','把周六放进周日。'],'或者周六，或者周日。'],
  ['复习L11：听到朋友生病，怎样表达关心？',['希望你早点儿好起来。','我今天请客。','地图上有红点。'],'希望你早点儿好起来。']
];
const sceneChoices = sceneRows.map((row,index,all)=>({id:`l13_scene_${String(index+1).padStart(2,'0')}`,type:'choice',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:row[0],prompt_en:'Choose the most natural sentence.',correct_answer:row[2],data:{question_cn:row[0],options:row[1],correct_index:row[1].indexOf(row[2])}}));

const guessRows = [
  ['请客','一个人主动付大家的饭钱或招待大家。'],['做客','去别人家里成为客人。'],['邻居','住在你家附近的人。'],['放心','让担心的人觉得没有问题。'],['客人','参加活动的人，不是主人。'],['礼物','生日或节日时送给别人的东西。'],['夫妻','丈夫和妻子两个人。'],['来自','说明一个人或东西的国家、城市或地方。'],['地图','上面可以看到国家、城市和路线。'],['文化','一个国家或地区的语言、习惯、艺术等。']
];
const guesses = guessRows.map((row,index,all)=>{ const options=[row[0],...guessRows.filter((_,i)=>i!==index).slice(index%6,index%6+3).map(item=>item[0])].slice(0,4); return {id:`l13_guess_${String(index+1).padStart(2,'0')}`,type:'description_guess',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:row[1],prompt_en:'Guess the lesson word.',correct_answer:row[0],data:{description:row[1],options}}; });

const sayRows = [
  ['饭馆菜单和三位同事',['请客','南方菜','北方菜'],'说明谁请客、点什么、为什么不要太多。'],
  ['生日邀请卡',['有时间的话','做客'],'用条件句邀请一位同学。'],
  ['冰箱里的饮料和酒',['把','放进'],'说明主人怎样准备饮品。'],
  ['音箱的音量太大',['把','开得太大','关小'],'提出并解决一个问题。'],
  ['画板、画笔和生日蛋糕',['礼物','画家'],'说明礼物为什么合适。'],
  ['盘子、蛋糕和聊天的人',['一边……一边……'],'说出两个同时发生的动作。'],
  ['有红点的世界地图',['地图','点','去过'],'解释红点的意思。'],
  ['两个城市的四季照片',['不同','文化','感到'],'复习比较并表达个人感受。']
];
const sayGuess = sayRows.map((row,index,all)=>({id:`l13_say_${String(index+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'说一说、猜一猜。',prompt_en:'Describe the covered scene without naming it.',openEnded:true,needsTeacherReview:true,data:{target:row[0],boardIndex:index+1,clues:[],scaffold:{words:row[1],frames:['这是一个……的场景。','人物正在……。','它跟……有关系。']},task:row[2],answerPlaceholder:'写下你的中文提示。'}}));

const blindRows = [
  [['请客','做客'],'今天我请客，周末请你来我家做客。'],
  [['把','放进'],'请把饮料放进冰箱里。'],
  [['一边','聊天儿'],'我们一边喝茶，一边聊天儿。'],
  [['文化','的话'],'你对中国文化感兴趣的话，就来参加晚会。']
];
const blind = blindRows.map((row,index,all)=>({id:`l13_blind_${String(index+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:row[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:row[1],revealDecoration:'none',uniformWordSize:true}}));

const pictureRows = [
  [img('photo-text-1-menu'),['请客','做法','不同'],'说明饭馆里正在做什么。'],[img('photo-text-1-invitation'),['的话','就','做客'],'发出一个完整邀请。'],
  [img('photo-text-2-fridge'),['把','酒','放进'],'说明物品移动到哪里。'],[img('photo-text-2-music'),['把','开得太大','关小'],'描述问题和解决办法。'],
  [img('photo-text-3-gift'),['礼物','画家'],'解释礼物为什么适合。'],[img('photo-text-3-cake-chat'),['一边','一边'],'描述两个同时发生的动作。'],
  [img('photo-text-4-tea-map'),['来自','夫妻','地图'],'介绍新邻居和旅行经历。'],[img('photo-text-4-culture'),['感到','文化','中文'],'联系自己的文化交流经历。']
];
const pictureComplete = pictureRows.map((row,index,all)=>({id:`l13_picture_${String(index+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'看图造句。',prompt_en:'Use the keywords to write one complete sentence about the photo.',openEnded:true,needsTeacherReview:true,data:{image:row[0],keyword:row[1].join('、'),task:row[2],answerPlaceholder:'写一个完整的中文句子。'}}));

const readingQuestion = (question_cn,question_pinyin,options,correct_index,focus)=>({question_cn,question_pinyin,options,correct_index,answer:options[correct_index],focus});
const readingRows = [
  {title:'饭馆点菜',passage:'今天杨同乐请客。三个人先点鱼，又想加鸡肉。王一雪提醒大家不要点太多，因为只有三个人。',pinyin:'Jīntiān Yáng Tónglè qǐngkè. Sān gè rén xiān diǎn yú, yòu xiǎng jiā jīròu. Wáng Yīxuě tíxǐng dàjiā bú yào diǎn tài duō, yīnwèi zhǐ yǒu sān gè rén.',role:'lesson',questions:[readingQuestion('今天谁请客？','Jīntiān shéi qǐngkè?',['杨同乐','王一雪','刘明','新邻居'],0,'人物'),readingQuestion('他们点了什么？','Tāmen diǎn le shénme?',['鱼和鸡肉','红茶和蛋糕','酒和饮料','南方和北方'],0,'菜品'),readingQuestion('为什么不要点太多？','Wèishénme bú yào diǎn tài duō?',['只有三个人','没有菜单','饭馆关门','客人没来'],0,'原因')]},
  {title:'邀请新邻居',passage:'周六天气好的话，我就请新邻居来家里做客。我准备做两道中国菜，也想请他们介绍一种英国食物。',pinyin:'Zhōuliù tiānqì hǎo dehuà, wǒ jiù qǐng xīn línjū lái jiā li zuòkè. Wǒ zhǔnbèi zuò liǎng dào Zhōngguó cài, yě xiǎng qǐng tāmen jièshào yì zhǒng Yīngguó shíwù.',role:'lesson',questions:[readingQuestion('邀请的条件是什么？','Yāoqǐng de tiáojiàn shì shénme?',['周六天气好','周六下大雨','邻居去旅游','没有中国菜'],0,'条件'),readingQuestion('主人准备做什么？','Zhǔrén zhǔnbèi zuò shénme?',['两道中国菜','一张地图','一个画板','三瓶酒'],0,'准备'),readingQuestion('邻居可以介绍什么？','Línjū kěyǐ jièshào shénme?',['一种英国食物','一个中国画家','饭馆的音乐','冰箱的位置'],0,'双向交流')]},
  {title:'客人来以前',passage:'客人来以前，饮料和酒都在冰箱里，盘子在桌上，音乐也关小了。主人最后检查一遍，就放心了。',pinyin:'Kèrén lái yǐqián, yǐnliào hé jiǔ dōu zài bīngxiāng li, pánzi zài zhuō shang, yīnyuè yě guān xiǎo le. Zhǔrén zuìhòu jiǎnchá yí biàn, jiù fàngxīn le.',role:'transfer',questions:[readingQuestion('饮料和酒在哪里？','Yǐnliào hé jiǔ zài nǎli?',['冰箱里','地图上','饭馆里','书包里'],0,'位置'),readingQuestion('盘子在哪里？','Pánzi zài nǎli?',['桌上','冰箱里','门外','画板上'],0,'位置'),readingQuestion('主人为什么放心了？','Zhǔrén wèishénme fàngxīn le?',['最后检查过了','音乐开大了','客人回家了','菜都吃完了'],0,'原因')]},
  {title:'合适的礼物',passage:'小林喜欢画画，想做画家。生日时，朋友送给他画板和画笔。小林说这正是他需要的礼物。',pinyin:'Xiǎolín xǐhuan huàhuà, xiǎng zuò huàjiā. Shēngrì shí, péngyou sòng gěi tā huàbǎn hé huàbǐ. Xiǎolín shuō zhè zhèng shì tā xūyào de lǐwù.',role:'transfer',questions:[readingQuestion('小林喜欢什么？','Xiǎolín xǐhuan shénme?',['画画','做饭','旅游','唱歌'],0,'兴趣'),readingQuestion('他的理想是什么？','Tā de lǐxiǎng shì shénme?',['做画家','做客人','开饭馆','教中文'],0,'理想'),readingQuestion('朋友送了什么？','Péngyou sòng le shénme?',['画板和画笔','地图和红茶','盘子和酒','鱼和鸡肉'],0,'礼物')]},
  {title:'天气改变欢迎计划',passage:'我们本来想在院子里欢迎新邻居，可是新闻说下午要刮风。大家决定或者把活动搬进客厅，或者改到周日。最后，我们把桌椅搬进客厅，一边喝茶，一边聊天儿。',pinyin:'Wǒmen běnlái xiǎng zài yuànzi li huānyíng xīn línjū, kěshì xīnwén shuō xiàwǔ yào guā fēng. Dàjiā juédìng huòzhě bǎ huódòng bānjìn kètīng, huòzhě gǎi dào zhōurì. Zuìhòu, wǒmen bǎ zhuōyǐ bānjìn kètīng, yìbiān hē chá, yìbiān liáotiānr.',role:'review',questions:[readingQuestion('什么改变了原计划？','Shénme gǎibiàn le yuán jìhuà?',['下午要刮风','邻居来自英国','礼物很合适','地图上有红点'],0,'前课天气'),readingQuestion('大家讨论了哪两个方案？','Dàjiā tǎolùn le nǎ liǎng gè fāng’àn?',['搬进客厅或改到周日','加菜或请客','画画或旅游','开大或关小音乐'],0,'前课选择'),readingQuestion('最后活动在哪里？','Zuìhòu huódòng zài nǎli?',['客厅','院子','饭馆','学校'],0,'把字句结果')]}
];
const readPassages = readingRows.map((item,index)=>({id:`l13_read_${String(index+1).padStart(2,'0')}`,type:'passage_reading',stage:'in_class',contentRole:item.role,prompt_cn:'阅读短文，完成三道理解题。',prompt_en:'Read the passage and answer three comprehension questions.',correct_answer:item.questions.map(question=>question.answer).join('；'),data:{title:item.title,passage:item.passage,passage_pinyin:item.pinyin,questions:item.questions}}));

const independentRows = [
  ['邻居第一次来','新邻居第一次来做客。主人先检查冰箱和音乐，又把盘子放到桌上。','主人先做了什么？','检查冰箱和音乐',['检查冰箱和音乐','介绍世界地图','去饭馆请客','学习英国文化'],'lesson'],
  ['一张旅行地图','英国夫妻喜欢旅游。地图上的红点很多，每一个点都是他们去过的地方。','红点多说明什么？','他们去过很多地方',['他们去过很多地方','他们有很多客人','他们准备很多酒','他们常常画画'],'lesson'],
  ['一个周末邀请','你有时间的话，就来参加我的生日晚会。你可以带一张照片，介绍你的家乡文化。','客人可以带什么？','一张家乡照片',['一张家乡照片','一个冰箱','一桌南方菜','一瓶酒'],'transfer'],
  ['礼物选择','朋友喜欢画画，我准备送画笔；朋友喜欢中国文化，我准备送一本中文书。','礼物应该根据什么选择？','朋友的兴趣',['朋友的兴趣','地图的颜色','音乐的声音','客人的数量'],'transfer'],
  ['前课复习连接','春天天气变化快。新邻居来做客的话，我就把雨伞放在门边，也把饮料放进冰箱。','主人为什么把雨伞放在门边？','春天天气变化快',['春天天气变化快','邻居是画家','饮料不见了','晚会到十二点'],'review']
];
const independent = independentRows.map((row,index)=>({id:`l13_ind_read_${String(index+1).padStart(2,'0')}`,type:'choice',stage:'in_class',contentRole:row[5],prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:row[0],passage:row[1],question_cn:row[2],options:row[4],correct_index:row[4].indexOf(row[3])},correct_answer:row[3]}));

const paragraphRows = [
  ['饭馆请客','今天杨同乐（1）。大家比较南方菜和北方菜的（2），也决定不要（3）。',[['请客','做客'],['不同做法','生日礼物'],['点太多菜','把声音开大']],'lesson'],
  ['有条件的邀请','王一雪说，下周儿子过生日。大家（1），（2），她会给大家（3）。',[['有时间的话','一边吃饭'],['就来她家做客','把酒放进冰箱'],['做北京菜','看世界地图']],'lesson'],
  ['待客准备','新邻居来以前，刘明把饮料和酒（1），把音乐（2），最后和王一雪一起（3）。',[['放进冰箱','拿到饭馆'],['关小一点儿','开得更大'],['等客人来','去英国旅游']],'transfer'],
  ['生日礼物','小明喜欢（1），想做画家。杨同乐送的（2）正是他需要的。后来大家（3）。',[['画画','喝酒'],['画板和画笔','世界地图'],['一边吃蛋糕一边聊天儿','把客人放进冰箱']],'transfer'],
  ['天气与做客','春天天气变化快。下午刮风的话，我们（1），或者（2）。客人到了以后，大家（3）。',[['把活动搬进客厅','继续在船上'],['改到周日','把地图吃完'],['一边喝茶一边聊天儿','就今天没带伞']],'review']
];
const paragraphOrders = [[3,0,4,1,5,2],[1,3,5,0,4,2],[4,2,0,5,1,3],[2,4,0,3,1,5],[5,1,3,2,0,4]];
const paragraphs = paragraphRows.map((row,index)=>{ const flat=row[2].flat(); const options=paragraphOrders[index].map(i=>flat[i]); const correct=row[2].map(pair=>pair[0]); return {id:`l13_para_${String(index+1).padStart(2,'0')}`,type:'paragraph_fill',stage:'in_class',contentRole:row[3],prompt_cn:row[0],prompt_en:'Choose three expressions to complete the paragraph.',data:{title:row[0],passageParts:[row[1].replace('（1）','____1____').replace('（2）','____2____').replace('（3）','____3____')],options,answers:correct.map(answer=>options.indexOf(answer)),optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange']}}; });

const chainRows = [
  ['饭馆到邀请','今天我请客。',['南方菜','做法不同','加一个菜','别点太多','有时间的话'],['nánfāng cài','zuòfǎ bù tóng','jiā yí gè cài','bié diǎn tài duō','yǒu shíjiān dehuà']],
  ['准备接待客人','新邻居明天来做客。',['放心','酒','放进冰箱','声音太大','等客人'],['fàngxīn','jiǔ','fàngjìn bīngxiāng','shēngyīn tài dà','děng kèrén']],
  ['生日晚会','客人到了，小明很开心。',['礼物','画家','盘子','吃蛋糕','聊天儿'],['lǐwù','huàjiā','pánzi','chī dàngāo','liáotiānr']],
  ['英国邻居的旅行','这对夫妻来自英国。',['地图','红点','去过的地方','东方文化','学习中文'],['dìtú','hóng diǎn','qùguo de dìfang','dōngfāng wénhuà','xuéxí Zhōngwén']],
  ['前课到本课','春天天气变化很快。',['带伞','有时间的话','来做客','把伞放好','一边喝茶一边聊'],['dài sǎn','yǒu shíjiān dehuà','lái zuòkè','bǎ sǎn fàng hǎo','yìbiān hē chá yìbiān liáo']]
];
const chains = chainRows.map((row,index,all)=>({id:`l13_chain_${String(index+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'五词故事接龙。',prompt_en:'Build one connected story.',openEnded:true,needsTeacherReview:true,data:{title:row[0],starter:row[1],keywords:row[2],keywords_pinyin:row[3],steps:row[2].map((word,i)=>`第${i+1}句使用“${word}”。`),chainModes:['teacher','race','team'],answerPlaceholder:'用当前词语继续故事。'}}));

const taskRows = [
  ['在饭馆请客','请客人',['请客','南方菜','北方菜','加'],['询问口味','控制菜量','说明谁付钱'],'完成30秒点菜对话。'],
  ['邀请邻居做客','主人',['有时间的话，就……','做客','邻居'],['说明活动','给出条件','确认时间'],'完成一张口头邀请卡。'],
  ['解决准备问题','准备负责人',['把','放进/拿出来','关小'],['发现一个问题','移动一个物品','调整一个状态'],'完成一段待客准备对话。'],
  ['介绍合适的礼物','送礼人',['礼物','画家','喜欢'],['了解兴趣','选择礼物','解释理由'],'完成30秒送礼表达。'],
  ['欢迎国际新邻居','文化交流主持人',['来自','地图','文化','一边……一边……'],['介绍来源','提出交流活动','邀请每人发言'],'完成1分钟欢迎活动。']
];
const taskCards = taskRows.map((row,index,all)=>({id:`l13_task_${String(index+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:`任务卡：${row[0]}。`,prompt_en:row[0],openEnded:true,needsTeacherReview:true,data:{title:row[0],role:row[1],keywords:row[2],steps:row[3],output:row[4],answerPlaceholder:'请记录课堂表达。'}}));

const battleGames = {
  roulette:[
    {id:'l13_roulette_01',prompt:'你请客：点两个菜，再提醒大家不要点太多。'},
    {id:'l13_roulette_02',prompt:'用“……的话，就……”邀请一位新邻居。'},
    {id:'l13_roulette_03',prompt:'用“把”说明饮料、盘子或音乐的准备。'},
    {id:'l13_roulette_04',prompt:'说一个适合朋友兴趣的礼物，并说明理由。'},
    {id:'l13_roulette_05',prompt:'用“一边……一边……”设计一项文化交流活动。'}
  ],
  relay:[
    {id:'l13_relay_01',starter:'今天我请客，大家先……',topic:'从点菜到发出邀请'},
    {id:'l13_relay_02',starter:'新邻居来以前，我们把……',topic:'待客准备与问题解决'},
    {id:'l13_relay_03',starter:'这对夫妻来自英国，他们……',topic:'旅行、语言和文化交流'}
  ],
  monopoly:{theme:'light',boardStyle:'winding',tasks:[
    {id:'l13_monopoly_01',type:'word',prompt:'解释“请客”和“做客”的不同。'},
    {id:'l13_monopoly_02',type:'sentence',prompt:'用“……的话，就……”发出邀请。'},
    {id:'l13_monopoly_03',type:'choice',prompt:'在南方菜和北方菜中选择，并说明理由。'},
    {id:'l13_monopoly_04',type:'sentence',prompt:'用“把”把饮料放进冰箱。'},
    {id:'l13_monopoly_05',type:'act',prompt:'表演音乐太大并把声音关小。'},
    {id:'l13_monopoly_06',type:'gift',prompt:'根据一个兴趣选择礼物。'},
    {id:'l13_monopoly_07',type:'sentence',prompt:'用“一边……一边……”描述晚会。'},
    {id:'l13_monopoly_08',type:'word',prompt:'解释“夫妻”和“邻居”。'},
    {id:'l13_monopoly_09',type:'map',prompt:'用地图和红点介绍两个去过的地方。'},
    {id:'l13_monopoly_10',type:'culture',prompt:'说一种你感到很特别的文化现象。'},
    {id:'l13_monopoly_11',type:'review',prompt:'复习L12：用“或者……或者……”说两个活动选择。'},
    {id:'l13_monopoly_12',type:'review',prompt:'复习L11：给身体不舒服的朋友一条建议。'}
  ]}
};

const homework = {
  mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,
  instructions:{required:'完成“欢迎新邻居来做客”的当次准备卡；A和B保存的材料必须用于C。',optional:'不需要上传录音；可带自制菜单、物品卡、地图或不含隐私的文化图片。',aiPolicy:'先独立选择真实或合理的信息，再使用工具检查语言。'},
  sessionMeta:{A:{title:'请客菜单与邀请卡',carryTo:'B、C'},B:{title:'待客准备与问题解决卡',carryTo:'C'},C:{title:'欢迎新邻居来做客',presentation:'1—2分钟课堂展示或交流'}},
  sessions:{
    A:[
      {id:'post_l13_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'欢迎任务 1/3 · 确定邀请',required:true,prompt_cn:'选择一位真实或虚构的新邻居：你想请谁、什么时候来、吃什么？',prompt_en:'Choose a real or fictional new neighbor. Who will you invite, when, and what will you eat?',answerPlaceholder:'我想请……。时间是……。我们吃……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l13_a_plan',type:'project_card',taskLabel:'请客菜单与邀请卡',projectStage:'欢迎任务 1/3 · 保存到最终展示',required:true,prompt_cn:'设计一张不超过四道菜的菜单，并写一个有条件的做客邀请。必须使用“请客、做客、加、不同”和“……的话，就……”。',prompt_en:'Create a menu of no more than four dishes and a conditional invitation. Use 请客, 做客, 加, 不同 and ……的话，就…….',answerPlaceholder:'今天我请客。……和……的做法不同。再加……。你有时间的话，就来我家做客。',needsTeacherReview:true,openEnded:true,wordBank:['请客','南方','北方','做法','不同','加','的话','做客'],requiredStructures:['……的话，就……'],picturePrompts:['一张自制菜单或不含商家个人信息的菜品图','一张自制邀请卡'],scaffoldLevels:[{label:'基础层 / Support',instruction:'按句框写4句话，菜单不超过4道菜。'},{label:'标准层 / Core',instruction:'独立写菜单和完整邀请，说明一道菜的特点。'},{label:'挑战层 / Challenge',instruction:'比较两种做法，并根据客人需要调整菜单。'}]},
      {id:'post_l13_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Menu and Invitation Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Menu and Invitation Card',prompt_en:'Bring your menu and invitation card.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one self-made menu and invitation card. A privacy-safe food image is optional.','Be ready to answer: Who is treating? Who is invited? When? What food will you serve? Which dish could you add or remove?','Use at least four L13 words and one complete ……的话，就…… sentence.','Partners may check the menu, but every student must speak. No audio upload is required.'],classroomNote:'保留这张卡；Homework B 要根据同一个邀请准备接待客人。'}
    ],
    B:[
      {id:'post_l13_b_observe',type:'reflection_prompt',taskLabel:'准备检查',projectStage:'欢迎任务 2/3 · 找出问题',required:true,prompt_cn:'承接A的邀请：客人来以前，你要准备哪些物品？最可能出现什么问题？',prompt_en:'Continue from Homework A. What must you prepare before the guest arrives, and what problem may occur?',answerPlaceholder:'我要准备……。可能……太…… / 不见了。',needsTeacherReview:true,openEnded:true,carryFrom:[{session:'A',taskId:'post_l13_a_plan',use:'继续使用同一个客人、时间和菜单。'}]},
      {id:'post_l13_b_plan',type:'project_card',taskLabel:'待客准备与问题解决卡',projectStage:'欢迎任务 2/3 · 保存到最终展示',required:true,prompt_cn:'列出三项准备和一个问题。至少使用两个“把”字句：一个说明趋向结果，一个说明状态结果；使用“邻居、放心、酒或饮料、放、客人”中的四个词。',prompt_en:'List three preparations and one problem. Use two 把 sentences: one directional result and one state result. Use four of 邻居, 放心, 酒/饮料, 放 and 客人.',answerPlaceholder:'我把……放进……。我把……拿出来。……太……，我要把……弄得 / 开得……。',needsTeacherReview:true,openEnded:true,wordBank:['邻居','放心','酒','饮料','放','客人'],requiredStructures:['把 + 宾语 + 动词 + 趋向补语','把 + 宾语 + 动词 + 得 + 状态补语'],picturePrompts:['一张自制房间准备图或物品位置图','三张可移动的物品卡'],carryFrom:[{session:'A',taskId:'post_l13_a_plan',use:'根据A的菜单决定饮料、盘子和其他用品。'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'按“物品—位置—状态”句框完成4句。'},{label:'标准层 / Core',instruction:'独立写三项准备和一个解决办法，正确使用两类补语。'},{label:'挑战层 / Challenge',instruction:'加入一个突发问题，让同伴用“把”字句提出两个方案。'}]},
      {id:'post_l13_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Hosting Preparation Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Hosting Preparation Card',prompt_en:'Bring Homework A and your preparation/problem-solving card.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring the Homework A menu/invitation and the Homework B preparation card or movable object cards.','Be ready to answer: What is ready? Where will you put each item? What problem may happen? How will you fix it?','Use at least four L13 words and two 把 sentences with clear results.','Groups may move object cards together, but every student must explain one preparation. No audio upload is required.'],classroomNote:'保留A和B；Homework C要把邀请、准备和文化交流活动整合起来。'}
    ],
    C:[
      {id:'post_l13_c_outline',type:'reflection_prompt',taskLabel:'整合提纲',projectStage:'欢迎任务 3/3 · 连接A/B材料',required:true,prompt_cn:'把A的菜单邀请、B的准备方案和新邻居的来源、兴趣或文化连接成六个要点。',prompt_en:'Combine the A invitation/menu, B preparation plan, and the new neighbor’s origin, interests or culture into six points.',answerPlaceholder:'1. 邻居…… 2. 邀请…… 3. 菜单…… 4. 准备…… 5. 活动…… 6. 交流……',needsTeacherReview:true,openEnded:true,carryFrom:[{session:'A',taskId:'post_l13_a_plan',use:'客人、时间、菜单和条件邀请。'},{session:'B',taskId:'post_l13_b_plan',use:'物品准备、问题和解决办法。'}]},
      {id:'post_l13_c_project',type:'project_card',taskLabel:'欢迎新邻居来做客',projectStage:'欢迎任务 3/3 · 完成最终作品',required:true,prompt_cn:'准备1—2分钟课堂展示或交流：介绍新邻居，发出邀请，说明菜单和准备，安排两项可以同时进行的文化交流活动。至少使用8个L13词语和三项指定结构。',prompt_en:'Prepare a 1–2 minute in-class presentation or exchange: introduce the new neighbor, invite them, explain the menu and preparation, and plan two simultaneous cultural activities. Use at least eight L13 words and all three required structures.',answerPlaceholder:'我的新邻居来自……。有时间的话，就……。我把……。我们一边……，一边……。',needsTeacherReview:true,openEnded:true,minimumLessonWords:8,requiredStructures:['……的话，就……','把 + 宾语 + 动词 + 补语','一边……一边……'],picturePrompts:['A的菜单与邀请卡','B的准备与问题解决卡','一张世界地图、家乡图或隐私安全的文化图片'],carryFrom:[{session:'A',taskId:'post_l13_a_plan',use:'第一部分邀请与菜单。'},{session:'B',taskId:'post_l13_b_plan',use:'第二部分准备与问题解决。'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'按六部分句框准备，每部分1句话。'},{label:'标准层 / Core',instruction:'独立完成1—2分钟连贯展示，包含全部指定结构。'},{label:'挑战层 / Challenge',instruction:'加入一次客人提问和一次临时问题，现场协商解决。'}]},
      {id:'post_l13_c_present',type:'showcase_plan',taskLabel:'课堂展示',projectStage:'最终课堂作品 · 1—2 minutes',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: Welcome Our New Neighbor',prompt_en:'Give a 1–2 minute in-class presentation or exchange. No audio upload is required.',presentationTitle:'Presentation Checklist',presentationPlan:['Bring the A menu/invitation, B preparation card and one privacy-safe map, hometown or culture image.','Answer six points: who the neighbor is, invitation, menu, preparation, one problem/solution, and cultural activities.','Use at least eight L13 words plus one ……的话，就…… sentence, one 把 sentence with a complement and one 一边……一边…… sentence.','Groups may share visual materials and take host/guest roles, but every student must speak for a meaningful turn. Present for 1–2 minutes. No audio upload is required.'],classroomNote:'错题和薄弱点默认折叠，学生选择后再展开。',carryFrom:[{session:'A',taskId:'post_l13_a_plan',use:'邀请与菜单材料。'},{session:'B',taskId:'post_l13_b_plan',use:'准备与解决问题材料。'}]}
    ]
  }
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L13',lessonKey,title:'我的新邻居来自英国',titleEn:'My new neighbors come from the UK',topic:'请客与做客、待客准备、生日晚会和跨文化邻里交流',courseModel:'三次课：饭馆请客与邀请 → 待客准备与问题解决 → 生日晚会与英国新邻居文化交流',sourceTextPolicy:'教材中文、拼音、词汇英文释义与语法例句以L13文档为准；“请客”的英文按用户确认使用 stand treat；课文四英文译文、教学标题、题目、场景与任务明确标为教学扩展。',sourceAuthority:[sourceRef],scopeExclusions:['省','祝','准备','醉']},
  pedagogy:{exerciseMix:{lessonTargetPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'最终任务可以使用真实或虚构的新邻居信息；每位学生必须有有效发言，不要求上传录音。',cultureFactPolicy:'文化表达允许多元答案，不把单一国家或家庭习惯设为唯一标准答案。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：在饭馆请客并发出邀请',textIds:['t_hsk3_l13_01'],previewMissionId:'pm_hsk3_l13_a',communicativeGoal:'协商点菜、控制菜量，并用条件句发出做客邀请。',requiredVocabulary:['请客','南方','北方','做法','不同','加','的话','做客'],receptiveVocabulary:['不客气','决定','北京菜'],grammarIds:['g13_01'],classOutput:'30秒点菜与邀请对话；形成请客菜单与邀请卡。',preparation:'完成A五阶段预习，带一个真实或合理的菜品选择。',homework:'完成Homework A并保存菜单与邀请卡。',bridgeToNext:'B以A确定的客人、时间和菜单为基础，准备接待并解决问题。'},
    {id:'B',title:'第二次课：检查并调整待客准备',textIds:['t_hsk3_l13_02'],previewMissionId:'pm_hsk3_l13_b',communicativeGoal:'检查待客物品，说明位置或状态变化，并解决准备中的问题。',requiredVocabulary:['邻居','放心','酒','放','客人'],receptiveVocabulary:['饮料','冰箱','声音','关小'],grammarIds:['g13_02'],classOutput:'物品移动与状态调整任务；形成待客准备与问题解决卡。',preparation:'完成B五阶段预习，并带A的菜单与邀请卡。',homework:'完成Homework B，写两个不同补语类型的“把”字句。',bridgeToNext:'C把A的邀请与B的准备转化为生日晚会和新邻居文化交流。'},
    {id:'C',title:'第三次课：生日晚会与英国新邻居',textIds:['t_hsk3_l13_03','t_hsk3_l13_04'],previewMissionId:'pm_hsk3_l13_c',communicativeGoal:'欢迎客人、说明合适的礼物、介绍新邻居经历，并组织一项文化交流活动。',requiredVocabulary:['晚会','礼物','画家','盘子','一边','聊天儿','来自','夫妻','直到','地图','点','感到','东方','文化','英国'],receptiveVocabulary:['画板','画笔','红茶','旅游','中文'],grammarIds:['g13_02','g13_03'],classOutput:'1—2分钟“欢迎新邻居来做客”课堂展示或角色交流。',preparation:'完成C五阶段预习，带A/B两张卡和一张隐私安全的地图或文化图片。',homework:'Homework C在课堂完成展示或交流，不上传音频。',bridgeToNext:'为后续公共“用”机制保留真实邀请、准备、欢迎与文化交流任务数据。'}
  ],
  usePreparation:{status:'active_shared_profile',configurationCreated:true,profile:'pilot-v1',tasks:[
    {textId:'t_hsk3_l13_01',start:'在饭馆识别菜品并表达简单选择',end:'作为请客人协商菜单、控制菜量并发出有条件邀请',calls:['A词汇','g13_01','点菜与邀请练习'],lessonSpecificStyle:'三人饭馆菜单协商场景'},
    {textId:'t_hsk3_l13_02',start:'识别家中物品的位置和准备状态',end:'发现待客问题并用把字句完成位置或状态调整',calls:['B词汇','g13_02','物品移动与问题解决练习'],lessonSpecificStyle:'可移动物品与冰箱/音量状态场景'},
    {textId:'t_hsk3_l13_03',start:'回应生日祝福和礼物',end:'根据兴趣解释礼物选择并组织同时进行的晚会活动',calls:['C词汇','g13_02','g13_03','礼物与晚会练习'],lessonSpecificStyle:'兴趣—礼物理由链和生日晚会互动'},
    {textId:'t_hsk3_l13_04',start:'获取新邻居的来源、旅行和学习信息',end:'介绍邻居经历并设计双向文化交流',calls:['C词汇','g13_03','日记阅读','最终欢迎任务'],lessonSpecificStyle:'连续日记、旅行地图红点与双向文化交流'}
  ],sharedCapabilities:['统一学生名单','A/B/C进度隔离','五阶段预习','图片热点与词汇卡','语音播放与拼音显示','开放题教师审核','课堂对战与排行榜','作业分层与A→B→C材料传递','错误项默认折叠'],possibleSharedExtensions:['同一图片内可移动物品的状态记录','主客双方轮换角色的任务计时与发言检查','跨课时作品卡的可视化合并预览']},
  vocabScenes:sceneData,vocabulary,grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(item=>[item.id,{session:item.tags[0],phrases:item.phrases,sourceType:item.sourceType,sourceRef:item.sourceRef}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l13_a',vocabularyIds:vocabulary.map(item=>item.id),grammarIds:grammar.map(item=>item.id),progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L13-v1'},reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],readingData:[{id:'pre_l13_read',title:'欢迎新邻居来做客',text:'我先做请客菜单和邀请卡，再检查家里的物品和声音。最后，我会介绍新邻居，安排一边吃饭一边交流文化的活动。',sourceType:'teaching_extension'}]},
  inClass:{questionGroups:{
    v5_vocab_fill:fills,g1_ordering:orders,r2_passage_choice:readPassages,t2_task_card:taskCards,battleGames,scene_sentence_choice:sceneChoices,v7_word_match:matchGroups,v6_description_guess:guesses,v2_say_guess:sayGuess,v3_blind_box:blind,g2_picture_complete:pictureComplete,r3_independent_reading:independent,r4_paragraph_fill:paragraphs,t3_chain_sentence:chains,
    info_match:[
      {id:'l13_info_01',type:'info_match',stage:'in_class',prompt_cn:'人物与信息匹配。',prompt_en:'Match each person with the information.',data:{people:['杨同乐','王一雪','刘明','刘小明','英国夫妻'],clues:['在饭馆请客','发出生日邀请并写日记','检查饮料和音乐','想做画家','喜欢旅游并学习中文'],answer:['杨同乐-在饭馆请客','王一雪-发出生日邀请并写日记','刘明-检查饮料和音乐','刘小明-想做画家','英国夫妻-喜欢旅游并学习中文']}},
      {id:'l13_info_02',type:'info_match',stage:'in_class',prompt_cn:'结构与交际功能匹配。',prompt_en:'Match each structure with its communicative purpose.',data:{people:['……的话，就……','把+宾语+动词+趋向补语','把+宾语+动词+得+状态补语','一边……一边……'],clues:['说明条件和结果','说明物品移动后的方向或位置','说明事物变化后的状态','说明两个动作同时进行'],answer:['……的话，就……-说明条件和结果','把+宾语+动词+趋向补语-说明物品移动后的方向或位置','把+宾语+动词+得+状态补语-说明事物变化后的状态','一边……一边……-说明两个动作同时进行']}}
    ],
    pk_question:[
      ['你有时间____，____来我家做客。','的话；就',['的话；就','一边；一边','把；得','直到；才'],'……的话，就……'],
      ['请____饮料放____冰箱里。','把；进',['把；进','一边；一边','就；的话','来自；到'],'把字句'],
      ['我们____喝茶，____看地图。','一边；一边',['一边；一边','把；进','的话；就','直到；才'],'一边……一边……']
    ].map((row,index)=>({id:`l13_pk_${String(index+1).padStart(2,'0')}`,type:'choice',prompt_cn:row[0],prompt_en:'Choose the expression that completes the sentence.',correct_answer:row[1],kp:row[3],data:{question_cn:row[0],options:row[2],correct_index:row[2].indexOf(row[1])}})),
    textQa:[],pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{focus:['请客与做客','南北方菜与点菜协商','……的话，就……','待客准备与把字句补语','生日晚会与礼物选择','一边……一边……','英国新邻居日记','旅行、语言与文化交流','欢迎新邻居来做客'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应A/B/C五阶段预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'用A的邀请卡和B的准备卡重新完成一次1分钟欢迎新邻居表达。'}]}
};

function markTeachingExtensions(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { value.forEach(markTeachingExtensions); return; }
  const looksLikeTeachingContent = value.id || value.title || value.prompt || value.question || value.question_cn || value.passage || value.starter || value.communicativeGoal || value.start;
  if (looksLikeTeachingContent && !value.sourceType) value.sourceType = 'teaching_extension';
  Object.values(value).forEach(markTeachingExtensions);
}
[
  lesson.sessions,lesson.usePreparation,lesson.vocabScenes,lesson.grammarTeachingNotes,lesson.textTeachingNotes,
  lesson.previewMissions,lesson.preClass,lesson.inClass,lesson.postClassHomework,lesson.report
].forEach(markTeachingExtensions);

fs.mkdirSync(path.dirname(out), {recursive:true});
const lessonJson = JSON.stringify(lesson, null, 2) + '\n';
fs.writeFileSync(out, lessonJson, 'utf8');

const useTaskSpecs = [
  {
    id:'T1',textIndex:0,icon:'🍽️',title:'协商一次饭馆请客与家庭邀请',
    goal:'在饭馆协商菜单和数量，再用条件句邀请同事到家里做客。',
    goalEn:'Negotiate a menu and quantity, then use a condition to invite colleagues home.',
    entryPrompt:'看图。请先说说谁请客、你想点什么。',
    entryPromptEn:'Look at the picture and say who is treating and what you want to order.',
    image:img('photo-text-1-menu'),imageLabel:'饭馆点菜',imageAlt:'三位同事在饭馆看菜单点菜',
    imageInstruction:'观察人物、菜单和桌上的菜，先提出一个简单选择。',
    exitPrompt:'请完成一段可以执行的请客与邀请表达：询问口味，协商菜品和数量，说明谁请客，再用“……的话，就……”邀请大家下周来家里做客。',
    exitPromptEn:'Give a practical restaurant-and-home invitation: ask about preferences, agree on dishes and quantity, say who is treating, and invite everyone home with “……的话，就……”.',
    requirements:['询问口味','菜品和数量','谁请客','条件邀请'],
    supports:['请客、南方、北方、做法、不同、加、做客','想吃什么就……／别点那么多／有时间的话，就……','询问口味 → 协商菜单 → 控制数量 → 发出邀请'],
    grammarIndex:0,grammarLabel:'“……的话，就……”',practiceIndex:1,practiceLabel:'任务卡：邀请邻居做客',paragraphIndex:1,
    bridge:{evidence:'你们有时间的话，就来我家做客。',focus:'条件 + 的话，就 + 结果',actionLabel:'进入“……的话，就……”'},
    lifeTransfer:'邀请同学参加一次真实或合理的周末活动，并说明条件、地点和安排。'
  },
  {
    id:'T2',textIndex:1,icon:'🎵',title:'检查并调整待客准备',
    goal:'发现待客准备中的问题，用把字句说明物品的位置变化和声音的状态调整。',
    goalEn:'Find preparation problems and use 把 sentences to move objects and adjust the music.',
    entryPrompt:'看图。请先说说客人来以前，房间里还要调整什么。',
    entryPromptEn:'Look at the room and say what still needs adjusting before the guests arrive.',
    image:img('photo-text-2-music'),imageLabel:'待客准备',imageAlt:'主人在客厅检查饮料、音乐和待客用品',
    imageInstruction:'观察饮料、音箱和客厅物品，找出一个需要调整的地方。',
    exitPrompt:'请完成一段待客准备对话：说明一个担心，检查饮料和酒的位置，指出音乐声音的问题，并用两个不同补语的把字句完成调整。',
    exitPromptEn:'Complete a guest-preparation dialogue: state one concern, check the drinks, identify the music problem, and use two 把 sentences with different complements.',
    requirements:['一个担心','饮料或酒的位置','声音问题','两个把字句'],
    supports:['邻居、放心、酒、放、客人','把……放进……／把声音开得……／把……关小一点儿','发现问题 → 说明位置或状态 → 完成调整 → 等客人'],
    grammarIndex:1,grammarLabel:'把字句：趋向或状态补语',practiceIndex:2,practiceLabel:'任务卡：解决准备问题',paragraphIndex:2,
    bridge:{evidence:'我把饮料和酒都放进冰箱里了。',focus:'把 + 宾语 + 动词 + 方向或状态结果',actionLabel:'进入把字句'},
    lifeTransfer:'检查教室、宿舍或家中的一个真实场景，提出两项清楚可执行的调整。'
  },
  {
    id:'T3',textIndex:2,icon:'🎁',title:'根据兴趣介绍礼物并安排晚会',
    goal:'根据朋友的兴趣解释礼物选择，并用“一边……一边……”安排晚会活动。',
    goalEn:'Explain a gift choice from someone’s interests and plan party activities with 一边……一边…….',
    entryPrompt:'看图。请先说说这是什么礼物，可能送给谁。',
    entryPromptEn:'Look at the gift and say what it is and who it may be for.',
    image:img('photo-text-3-gift'),imageLabel:'生日礼物',imageAlt:'生日晚会上送给喜欢画画的孩子画板和画笔',
    imageInstruction:'观察礼物和生日场景，先说礼物与兴趣的关系。',
    exitPrompt:'请完成一段生日晚会表达：欢迎客人，说明礼物及选择理由，回应这份礼物，再用“一边……一边……”安排两个能同时进行的活动。',
    exitPromptEn:'Give a birthday-party expression: welcome guests, explain the gift choice, respond to it, and arrange two simultaneous activities with 一边……一边…….',
    requirements:['欢迎或祝福','礼物名称','根据兴趣说明理由','两个同时活动'],
    supports:['晚会、礼物、画家、盘子、一边、聊天儿','因为……，所以……／这正是我需要的／一边……一边……','欢迎 → 送礼 → 说明理由 → 回应 → 安排活动'],
    grammarIndex:2,grammarLabel:'“一边……，一边……”',practiceIndex:3,practiceLabel:'任务卡：介绍合适的礼物',paragraphIndex:3,
    bridge:{evidence:'咱们一边吃蛋糕，一边聊天儿吧。',focus:'同一个人或同一组人同时完成两个动作',actionLabel:'进入“一边……一边……”'},
    lifeTransfer:'根据一位同学的兴趣推荐一份合适的礼物，并安排两项可以同时进行的活动。'
  },
  {
    id:'T4',textIndex:3,icon:'🗺️',title:'介绍英国新邻居并设计文化交流',
    goal:'介绍新邻居的来源、旅行和中文学习经历，并提出双向文化交流安排。',
    goalEn:'Introduce new neighbors’ origin, travel and Chinese learning, then propose two-way cultural exchange.',
    entryPrompt:'看图。请先说说这对新邻居来自哪里、可能喜欢做什么。',
    entryPromptEn:'Look at the picture and say where the new neighbors come from and what they may enjoy.',
    image:img('photo-text-4-tea-map'),imageLabel:'红茶与世界地图',imageAlt:'来自英国的夫妻用红茶和世界地图介绍旅行经历',
    imageInstruction:'观察红茶、地图和红点，先介绍人物的来源或兴趣。',
    exitPrompt:'请完成一段新邻居介绍：说明他们来自哪里、上周做客的经历、地图红点的意思和学习中文的原因，再设计一项中英文化双向交流活动。',
    exitPromptEn:'Introduce the new neighbors: their origin, last week’s visit, the map dots, why they learn Chinese, and one two-way cultural exchange activity.',
    requirements:['来源','做客经历','地图红点','学习中文的原因','双向交流活动'],
    supports:['来自、夫妻、直到、地图、点、感到、东方、文化、英国','来自……的夫妻／每一个……都是……／因为……，就……','人物 → 做客 → 旅行地图 → 学习原因 → 今天的交流'],
    grammarIndex:2,grammarLabel:'“一边……，一边……”',practiceIndex:4,practiceLabel:'任务卡：欢迎国际新邻居',paragraphIndex:4,
    bridge:{evidence:'我跟他们一边喝红茶，一边聊天儿。',focus:'用同时活动组织自然的文化交流',actionLabel:'进入“一边……一边……”'},
    lifeTransfer:'介绍一位真实或虚构的新邻居，并提出双方都能分享内容的文化交流活动。'
  }
];

const overviewExtras = [
  [
    {id:'l13_m1_overall_02',focus:'situation',questionCn:'三个人点菜时遇到什么问题？',options:['点的菜可能太多','饭馆没有鱼','没有人愿意请客'],correctIndex:0},
    {id:'l13_m1_overall_03',focus:'purpose',questionCn:'王一雪最后想做什么？',options:['邀请同事下周来家里做客','请大家马上回家','让同事去买地图'],correctIndex:0}
  ],
  [
    {id:'l13_m2_overall_02',focus:'situation',questionCn:'王一雪一开始为什么担心？',options:['第一次请新邻居，怕没准备好','她不知道饭馆在哪里','她没有准备生日礼物'],correctIndex:0},
    {id:'l13_m2_overall_03',focus:'purpose',questionCn:'两个人希望客人来以前做到什么？',options:['把待客物品和声音调整好','决定去英国旅游','再去饭馆点菜'],correctIndex:0}
  ],
  [
    {id:'l13_m3_overall_02',focus:'situation',questionCn:'杨同乐怎样选择生日礼物？',options:['根据小明喜欢画画来选择','根据礼物的价格来选择','根据英国文化来选择'],correctIndex:0},
    {id:'l13_m3_overall_03',focus:'purpose',questionCn:'这个对话主要想说明什么？',options:['送合适的礼物并一起参加晚会','比较南方菜和北方菜','介绍英国的城市'],correctIndex:0}
  ],
  [
    {id:'l13_m4_overall_02',focus:'situation',questionCn:'这对夫妻和中国文化有什么关系？',options:['他们觉得很特别，开始学习中文','他们觉得不适合自己','他们只想学习做英国菜'],correctIndex:0},
    {id:'l13_m4_overall_03',focus:'purpose',questionCn:'作者写这篇日记主要想做什么？',options:['介绍新邻居和双方的文化交流','说明音乐声音太大','请同事在饭馆买单'],correctIndex:0}
  ]
];

const vocabularyMeaningCn = {
  请客:'请别人吃饭并付钱',南方:'一个国家或地区的南部',北方:'一个国家或地区的北部',做法:'做事情或做菜的方法',不同:'不一样',加:'在原有数量上增加',的话:'放在条件后面',做客:'到别人家里当客人',
  邻居:'住在附近的人',放心:'不再担心',酒:'含酒精的饮料',放:'使东西在某个地方',客人:'被邀请来的人',晚会:'晚上举行的活动',礼物:'送给别人的东西',画家:'以画画为工作的人',盘子:'装菜或食物的器具',一边:'表示两个动作同时进行',聊天儿:'轻松地说话交流',
  来自:'说明人或东西的来源',夫妻:'丈夫和妻子',直到:'一直到某个时间',地图:'表示国家、城市和路线的图',点:'很小的圆形记号',感到:'产生某种感觉',东方:'太阳升起的方向或东部地区',文化:'一个国家或地区的语言、习惯和艺术等',英国:'位于欧洲的国家'
};

const vocabularyCatalog = vocabulary.map((word,index) => {
  const otherWords = [1,2,3].map(offset => vocabulary[(index + offset) % vocabulary.length]);
  return {
    id:word.id,hanzi:word.hanzi,pinyin:word.pinyin,english:word.english,meaningCn:vocabularyMeaningCn[word.hanzi]||word.english,
    tier:'expression',allowedTypes:['recognition','shape','input','collocation'],
    shapeOptions:[word.hanzi,...otherWords.map(item=>item.hanzi)],
    collocationOptions:[word.phrases[0],...otherWords.map(item=>item.phrases[0])]
  };
});

const vocabularyGroups = useTaskSpecs.map(spec => {
  const ids = spec.textIndex===0?vocabulary.slice(0,8):spec.textIndex===1?vocabulary.slice(8,13):spec.textIndex===2?vocabulary.slice(13,19):vocabulary.slice(19);
  return {id:spec.id,textIndex:spec.textIndex,title:spec.title,wordIds:ids.map(word=>word.id),recognitionWordIds:ids.map(word=>word.id),activities:[]};
});

const useGroups = useTaskSpecs.map(spec => ({
  id:spec.id,textIndex:spec.textIndex,icon:spec.icon,label:`课文 ${spec.textIndex+1}`,title:spec.title,goal:spec.goal,goalEn:spec.goalEn,
  entry:{id:`l13_t${spec.textIndex+1}_use_entry`,label:'起点表达',labelEn:'Starting expression',promptCn:spec.entryPrompt,promptEn:spec.entryPromptEn,stimulus:{type:'image',image:spec.image,labelCn:spec.imageLabel,altCn:spec.imageAlt,instructionCn:spec.imageInstruction,instructionEn:spec.entryPromptEn}},
  exit:{id:`l13_t${spec.textIndex+1}_use_exit`,label:'终点表达',labelEn:'Upgraded expression',promptCn:spec.exitPrompt,promptEn:spec.exitPromptEn},
  exitRequirements:spec.requirements.map((label,index)=>({id:`requirement_${index+1}`,label})),
  supportCards:[
    {id:`t${spec.textIndex+1}_words`,labelCn:'词汇提示',labelEn:'Support',contentCn:spec.supports[0],contentEn:''},
    {id:`t${spec.textIndex+1}_frame`,labelCn:'句式提示',labelEn:'Support',contentCn:spec.supports[1],contentEn:''},
    {id:`t${spec.textIndex+1}_order`,labelCn:'表达顺序',labelEn:'Support',contentCn:spec.supports[2],contentEn:''}
  ],
  responseMode:'teacherObservedWithTextOutline',textId:texts[spec.textIndex].id,
  linkedResources:{
    vocabulary:{module:'teach',submodule:'tv',label:`课文${spec.textIndex+1}词汇`,vocabSession:String(spec.textIndex+1)},
    grammar:{module:'teach',submodule:'tg',label:spec.grammarLabel,grammarIndex:spec.grammarIndex},
    text:{module:'teach',submodule:'tt',label:`课文${spec.textIndex+1}`,textIndex:spec.textIndex},
    practice:{module:'practice',submodule:'t2k',label:spec.practiceLabel,routeState:{t2ki:spec.practiceIndex}}
  },
  resourceLinks:[{id:`l13_task_${String(spec.practiceIndex+1).padStart(2,'0')}`,status:'ready',purpose:spec.practiceLabel},{id:`l13_para_${String(spec.paragraphIndex+1).padStart(2,'0')}`,status:'ready',purpose:'课文篇章练习'}]
}));

const textLearning = useTaskSpecs.map((spec,index) => {
  const note = textTeachingNotes[texts[index].id];
  const overall = note.overallChoice;
  return {
    textId:texts[index].id,useGroupId:spec.id,title:texts[index].title,
    overviewChoices:[
      {id:overall.id,focus:'main_idea',questionCn:overall.question,options:overall.options.slice(0,3),correctIndex:overall.options.slice(0,3).indexOf(overall.answer)},
      ...overviewExtras[index]
    ],
    detailMode:'config',detailQuestions:(note.classQuestions||[]).map(item=>({id:item.id,questionCn:item.question,questionPinyin:item.question_pinyin||item.pinyin,answer:item.answer,answerPinyin:item.answer_pinyin||item.answerPinyin,acceptedAnswers:item.acceptedAnswers||[],informationPoint:item.informationPoint})),
    grammarBridge:{...spec.bridge,grammarIndex:spec.grammarIndex},
    paragraphPractice:{label:`调用“${paragraphRows[spec.paragraphIndex][0]}”段落填空`,module:'practice',submodule:'r4p',index:spec.paragraphIndex},
    lifeTransfer:{promptCn:spec.lifeTransfer,promptEn:spec.exitPromptEn}
  };
});

const useProfile = {
  schemaVersion:'classpro-use-profile/v3',
  experiment:{id:'l13-use-pilot-v1',title:'第13课·以用为主线升级版',lessonLabel:'第13课',sourceLesson:lessonKey,scope:'四个课文MINI循环；保留L13原有词汇、语法、课文和练习教学样式。'},
  sources:{lesson:{path:'../lessons/HSK3-L13.json',sha256:crypto.createHash('sha256').update(lessonJson).digest('hex').toUpperCase()},teacher:{path:'../../in-class/teacher.html'},student:{path:'../../in-class/student.html'}},
  nativeTeaching:{preserveCourseStyles:true,grammar:{source:'formal_lesson',preserveExamples:true,preserveHighlights:true,preserveOralQuestions:true,preserveFollowUp:true},text:{source:'formal_lesson',preservePresentation:true,preserveDiary:true},vocabulary:{source:'formal_lesson',preserveScenes:true,preserveHotspots:true}},
  useGroups,
  timerPolicy:{miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:4},vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2},autoClose:false},
  textLearning,
  vocabularyTaskTypes:[{id:'recognition',labelCn:'认读',labelEn:'Recognition'},{id:'shape',labelCn:'辨形',labelEn:'Character form'},{id:'input',labelCn:'输入',labelEn:'Type the word'},{id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}],
  vocabularyCatalog,vocabularyGroups,resourceOverrides:[],supportOnlyStructures:[],
  evidencePolicy:{coreTypes:['entry_expression','actual_learning_path','exit_expression'],pathEvent:'opened',optionalSignals:['support_request','self_reflection','teacher_observation']},
  supportOptions:[{id:'vocabulary',labelCn:'我缺少合适的词',labelEn:'I need the right words'},{id:'organization',labelCn:'我不知道怎样组织信息',labelEn:'I need help organizing my ideas'},{id:'structure',labelCn:'我需要一个句子结构',labelEn:'I need a sentence frame'},{id:'teacher',labelCn:'我想获得老师的帮助',labelEn:'I want help from the teacher'}],
  feelingOptions:[{id:'clearer',labelCn:'我说得更清楚了',labelEn:'My expression is clearer'},{id:'more_complete',labelCn:'我说得更完整了',labelEn:'My expression is more complete'},{id:'more_natural',labelCn:'我说得更自然了',labelEn:'My expression is more natural'},{id:'still_need_help',labelCn:'我还需要帮助',labelEn:'I still need help'}],
  coreEvidence:['entry_expression','actual_learning_path','exit_expression'],
  capabilities:['select_text_mini_loop','launch_interaction','independent_answer','support_request','anonymous_return','open_support','reanswer','record_teacher_decision','compare_entry_exit','teacher_selected_vocabulary_focus','shared_countdown','native_course_resource_return','configured_task_stimulus']
};

fs.mkdirSync(path.dirname(useProfileOut), {recursive:true});
fs.writeFileSync(useProfileOut, JSON.stringify(useProfile, null, 2) + '\n', 'utf8');
console.log(`Wrote ${out}`);
console.log(`Wrote ${useProfileOut}`);
