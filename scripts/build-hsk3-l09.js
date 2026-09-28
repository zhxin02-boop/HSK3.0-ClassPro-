const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L09.json');
const img = name => 'images/hsk3-l09/' + name + '.png';
const roleFor = (index, total) => index < Math.floor(total * 0.5) ? 'lesson' : index < Math.floor(total * 0.8) ? 'transfer' : 'review';

const vocabRows = [
  ['校园','xiàoyuán','名词','campus','A','我们的校园里有两个球场。','Wǒmen de xiàoyuán li yǒu liǎng gè qiúchǎng.',['大学校园','校园生活']],
  ['卡','kǎ','名词','card','A','这是你的校园卡。','Zhè shì nǐ de xiàoyuánkǎ.',['校园卡','一张卡']],
  ['球场','qiúchǎng','名词','court; sports field','A','他们每天在球场练球。','Tāmen měitiān zài qiúchǎng liàn qiú.',['学校球场','去球场']],
  ['为了','wèile','介词','in order to; for','A','为了准备运动会，我们每天都练习。','Wèile zhǔnbèi yùndònghuì, wǒmen měitiān dōu liànxí.',['为了比赛','为了健康']],
  ['运动会','yùndònghuì','名词','sports meet','A','学校下个月开运动会。','Xuéxiào xià gè yuè kāi yùndònghuì.',['参加运动会','准备运动会']],
  ['男生','nánshēng','名词','male student; boy','A','几个男生正在球场上练球。','Jǐ gè nánshēng zhèngzài qiúchǎng shang liàn qiú.',['男同学','几个男生']],
  ['练','liàn','动词','practise','A','我每天练半个小时网球。','Wǒ měitiān liàn bàn gè xiǎoshí wǎngqiú.',['练球','多练几次']],
  ['参加','cānjiā','动词','take part in; join','A','我想参加学校的网球比赛。','Wǒ xiǎng cānjiā xuéxiào de wǎngqiú bǐsài.',['参加比赛','参加活动']],
  ['网球','wǎngqiú','名词','tennis','A','白家月最近一直在练网球。','Bái Jiāyuè zuìjìn yìzhí zài liàn wǎngqiú.',['打网球','网球比赛']],
  ['比赛','bǐsài','名词/动词','match; competition; compete','A','到时候我去看你的比赛。','Dào shíhou wǒ qù kàn nǐ de bǐsài.',['参加比赛','足球比赛']],
  ['练习','liànxí','动词/名词','practise; exercise','A','最近我一直在练习发球。','Zuìjìn wǒ yìzhí zài liànxí fā qiú.',['认真练习','练习接球']],
  ['好多','hǎoduō','数词','many; a lot of','B','球场上有好多同学。','Qiúchǎng shang yǒu hǎoduō tóngxué.',['好多年','好多人']],
  ['几乎','jīhū','副词','almost','B','我几乎忘了怎么打羽毛球。','Wǒ jīhū wàngle zěnme dǎ yǔmáoqiú.',['几乎忘了','几乎每天']],
  ['只','zhǐ','副词','only; merely','B','大家打球只是为了锻炼身体。','Dàjiā dǎ qiú zhǐshì wèile duànliàn shēntǐ.',['只看一次','只是练习']],
  ['啤酒','píjiǔ','名词','beer','C','冰箱里有啤酒和饮料。','Bīngxiāng li yǒu píjiǔ hé yǐnliào.',['一瓶啤酒','啤酒和饮料']],
  ['回','huí','量词','time; occurrence','C','今天怎么回事？','Jīntiān zěnme huí shì?',['怎么回事','一回事']],
  ['紧张','jǐnzhāng','形容词','nervous; tense','C','新球员第一次参加比赛，有点儿紧张。','Xīn qiúyuán dì-yī cì cānjiā bǐsài, yǒudiǎnr jǐnzhāng.',['感到紧张','别紧张']],
  ['主要','zhǔyào','形容词','main; major','C','主要的球员今天没有参加比赛。','Zhǔyào de qiúyuán jīntiān méiyǒu cānjiā bǐsài.',['主要原因','主要球员']],
  ['受到','shòudào','动词','receive; be affected by','C','大家都受到了他的影响。','Dàjiā dōu shòudào le tā de yǐngxiǎng.',['受到影响','受到欢迎']],
  ['影响','yǐngxiǎng','名词/动词','influence; affect','C','紧张会影响比赛成绩。','Jǐnzhāng huì yǐngxiǎng bǐsài chéngjì.',['受到影响','影响很大']],
  ['得分','défēn','动词/名词','score; points','C','最后是谁得分了？','Zuìhòu shì shéi défēn le?',['比赛得分','得到两分']],
  ['体育','tǐyù','名词','sports; physical education','C','我喜欢看体育比赛。','Wǒ xǐhuan kàn tǐyù bǐsài.',['体育比赛','体育运动']],
  ['世界','shìjiè','名词','world','C','他让世界认识了中国。','Tā ràng shìjiè rènshi le Zhōngguó.',['世界各地','世界比赛']],
  ['运动员','yùndòngyuán','名词','athlete','C','很多运动员参加奥运会。','Hěn duō yùndòngyuán cānjiā Àoyùnhuì.',['中国运动员','优秀运动员']],
  ['得到','dédào','动词','get; obtain','C','他没有得到好成绩。','Tā méiyǒu dédào hǎo chéngjì.',['得到机会','得到好成绩']],
  ['成绩','chéngjì','名词','result; achievement; grade','C','比赛成绩不是最重要的。','Bǐsài chéngjì bú shì zuì zhòngyào de.',['比赛成绩','好成绩']],
  ['奥运会','Àoyùnhuì','专有名词','Olympic Games','C','我最爱看的体育比赛是奥运会。','Wǒ zuì ài kàn de tǐyù bǐsài shì Àoyùnhuì.',['参加奥运会','观看奥运会']],
  ['刘长春','Liú Chángchūn','专有名词','Liu Changchun','C','刘长春是第一位参加奥运会的中国运动员。','Liú Chángchūn shì dì-yī wèi cānjiā Àoyùnhuì de Zhōngguó yùndòngyuán.',['运动员刘长春','介绍刘长春']]
];

const vocabulary = vocabRows.map((row, index) => ({
  id:'v09_' + String(index + 1).padStart(2, '0'),
  hanzi:row[0],pinyin:row[1],pos:row[2],english:row[3],tags:[row[4]],
  example:row[5],examplePinyin:row[6],phrases:row[7],
  sourceType:index >= 26 ? 'textbook_proper_noun' : 'textbook'
}));
const word = hanzi => vocabulary.find(item => item.hanzi === hanzi);
const card = hanzi => {
  const item = word(hanzi);
  return {hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,example:item.example,examplePinyin:item.examplePinyin};
};
const extension = (hanzi,pinyin,english,phrases,example,examplePinyin) => ({hanzi,pinyin,english,phrases,example,examplePinyin,sourceType:'teaching_extension'});

const texts = [
  {
    id:'t_hsk3_l09_01',textId:1,title:'为了准备运动会',setting:'在图书馆门口，李文向白家月跑过去。',audio:'../../audio/HSK3/9-1.mp3',
    lines:[
      {speaker:'李文',hanzi:'家月，对不起，我昨天忘了还你校园卡了。',pinyin:'Jiāyuè, duìbuqǐ, wǒ zuótiān wàngle huán nǐ xiàoyuánkǎ le.',english:"Jiayue, I'm sorry, I forgot to return your campus card yesterday."},
      {speaker:'白家月',hanzi:'没关系。你怎么这么快就过来了？',pinyin:'Méi guānxi. Nǐ zěnme zhème kuài jiù guòlai le?',english:'No problem. How come you came over so quickly?'},
      {speaker:'李文',hanzi:'我正在球场打球呢，接了你的电话就跑过来了。',pinyin:'Wǒ zhèngzài qiúchǎng dǎ qiú ne, jiēle nǐ de diànhuà jiù pǎoguòlai le.',english:'I was playing ball on the court, and after answering your phone call, I ran right over.'},
      {speaker:'白家月',hanzi:'听说为了准备运动会，你们几个男生每天都练球。',pinyin:'Tīngshuō wèile zhǔnbèi yùndònghuì, nǐmen jǐ gè nánshēng měitiān dōu liàn qiú.',english:'I heard that in order to prepare for the sports meet, you boys have been practising every day.'},
      {speaker:'李文',hanzi:'是啊！你打算参加运动会吗？',pinyin:'Shì a! Nǐ dǎsuàn cānjiā yùndònghuì ma?',english:'Yeah! Do you plan to take part in the sports meet?'},
      {speaker:'白家月',hanzi:'我想参加网球比赛，最近一直在练习。',pinyin:'Wǒ xiǎng cānjiā wǎngqiú bǐsài, zuìjìn yìzhí zài liànxí.',english:'I want to take part in the tennis match and have been practising recently.'},
      {speaker:'李文',hanzi:'好，到时候我去看你的比赛。',pinyin:'Hǎo, dào shíhou wǒ qù kàn nǐ de bǐsài.',english:"Great, I'll go and watch your match then."}
    ]
  },
  {
    id:'t_hsk3_l09_02',textId:2,title:'打不好没关系',setting:'在校园里，李文和白家月在聊天儿。',audio:'../../audio/HSK3/9-3.mp3',
    editorialNote:'来源中文“这么多数学一起打”与拼音 tóngxué、英文 classmates 矛盾，确认为录入错误；正式文本校订为“同学”。',
    lines:[
      {speaker:'李文',hanzi:'家月，你跟我们一起打羽毛球吧？',pinyin:'Jiāyuè, nǐ gēn wǒmen yìqǐ dǎ yǔmáoqiú ba?',english:'Jiayue, why don’t you play badminton with us?'},
      {speaker:'白家月',hanzi:'我好多年没打羽毛球了，几乎忘了怎么打了。',pinyin:'Wǒ hǎo duō nián méi dǎ yǔmáoqiú le, jīhū wàngle zěnme dǎ le.',english:"I haven't played badminton for many years; I've almost forgotten how to play."},
      {speaker:'李文',hanzi:'不是比赛，打不好没关系。',pinyin:'Bú shì bǐsài, dǎ bu hǎo méi guānxi.',english:"It's not a competition. It doesn't matter if you don't play well."},
      {speaker:'白家月',hanzi:'这么多同学一起打，如果总是接不住球，就太不好意思了。',pinyin:'Zhème duō tóngxué yìqǐ dǎ, rúguǒ zǒngshì jiē bu zhù qiú, jiù tài bù hǎoyìsi le.',english:'With so many classmates playing together, if I keep failing to return the shuttlecock, it would be too embarrassing.'},
      {speaker:'李文',hanzi:'你想得太多了！大家打球只是为了锻炼身体。',pinyin:'Nǐ xiǎng de tài duō le! Dàjiā dǎ qiú zhǐshì wèile duànliàn shēntǐ.',english:"You're overthinking! Everyone is playing just to exercise."},
      {speaker:'白家月',hanzi:'我先自己练练吧，下周再跟你们一起打。',pinyin:'Wǒ xiān zìjǐ liànlian ba, xià zhōu zài gēn nǐmen yìqǐ dǎ.',english:"Let me practise by myself first, and I'll play with you next week."},
      {speaker:'李文',hanzi:'我在教天中打羽毛球，你可以过来跟我们一起练。',pinyin:'Wǒ zài jiāo Tiānzhōng dǎ yǔmáoqiú, nǐ kěyǐ guòlai gēn wǒmen yìqǐ liàn.',english:"I'm teaching Tianzhong to play badminton; you can come over and practise with us."}
    ]
  },
  {
    id:'t_hsk3_l09_03',textId:3,title:'越看越着急',setting:'在李文家，李文、白家月和陈天中一起看电视。',audio:'../../audio/HSK3/9-5.mp3',
    lines:[
      {speaker:'陈天中',hanzi:'足球比赛已经开始了，快过来看看吧！',pinyin:'Zúqiú bǐsài yǐjīng kāishǐ le, kuài guòlai kànkan ba!',english:'The football match has already started. Come over and watch!'},
      {speaker:'李文',hanzi:'你们先看，冰箱里有啤酒和饮料，我去拿一下。',pinyin:'Nǐmen xiān kàn, bīngxiāng li yǒu píjiǔ hé yǐnliào, wǒ qù ná yíxià.',english:"You watch first. There are beer and drinks in the fridge; I'll go and get them."},
      {speaker:'白家月',hanzi:'今天怎么回事？总是踢不进去！',pinyin:'Jīntiān zěnme huí shì? Zǒngshì tī bu jìnqu!',english:"What is going on today? They just can't score a goal!"},
      {speaker:'陈天中',hanzi:'几个老球员生病了，新球员第一次参加这么重要的比赛，太紧张了。',pinyin:'Jǐ gè lǎo qiúyuán shēngbìng le, xīn qiúyuán dì-yī cì cānjiā zhème zhòngyào de bǐsài, tài jǐnzhāng le.',english:'Several veteran players are ill, and the new players are too nervous playing in such an important match for the first time.'},
      {speaker:'李文',hanzi:'是啊，主要的球员没参加比赛，所以大家也都受到影响了。',pinyin:'Shì a, zhǔyào de qiúyuán méi cānjiā bǐsài, suǒyǐ dàjiā yě dōu shòudào yǐngxiǎng le.',english:"Yes. The main players didn't take part, so everyone was affected."},
      {speaker:'白家月',hanzi:'越看越着急。我不看了，你们告诉我得分吧。',pinyin:'Yuè kàn yuè zháojí. Wǒ bú kàn le, nǐmen gàosu wǒ défēn ba.',english:'The more I watch, the more anxious I get. I will stop watching; tell me the score.'}
    ]
  },
  {
    id:'t_hsk3_l09_04',textId:4,title:'第一位参加奥运会的中国运动员',format:'narrative',genre:'演讲稿',genreEn:'Speech Draft',author:'李文',setting:'在家里，李文准备演讲稿。',audio:'../../audio/HSK3/9-7.mp3',translationPolicy:'中文和拼音为教材原文；英文译文和文化说明为教学辅助。',
    lines:[
      {speaker:'李文',hanzi:'我喜欢看体育比赛，最爱看的就是奥运会。奥运会是世界上影响最大的体育比赛。从1896年到2024年，每次奥运会都有非常多的运动员参加。第一位参加奥运会的中国运动员是刘长春，他1932年参加了100米和200米短跑比赛。虽然他没有得到好成绩，但是他让世界认识了中国。',pinyin:'Wǒ xǐhuan kàn tǐyù bǐsài, zuì ài kàn de jiù shì Àoyùnhuì. Àoyùnhuì shì shìjiè shang yǐngxiǎng zuì dà de tǐyù bǐsài. Cóng 1896 nián dào 2024 nián, měi cì Àoyùnhuì dōu yǒu fēicháng duō de yùndòngyuán cānjiā. Dì-yī wèi cānjiā Àoyùnhuì de Zhōngguó yùndòngyuán shì Liú Chángchūn, tā 1932 nián cānjiāle 100 mǐ hé 200 mǐ duǎnpǎo bǐsài. Suīrán tā méiyǒu dédào hǎo chéngjì, dànshì tā ràng shìjiè rènshi le Zhōngguó.',english:'I enjoy watching sports, and the Olympic Games are my favourite. The Olympic Games are the sporting event with the greatest worldwide influence. From 1896 to 2024, very many athletes took part in each Olympic Games. Liu Changchun was the first Chinese athlete to take part in the Olympic Games. In 1932, he competed in the 100-metre and 200-metre sprints. Although he did not achieve a good result, he introduced China to the world.'}
    ]
  }
];

const grammar = [
  {id:'g09_01',title:'目的复句“为了……，……”',titleEn:'Purpose clauses with 为了',scene:'State a goal first, then say the action taken to reach it.',structure:'为了 + 目的，主语 + 行动',explanation:'“为了”后面的部分表示目的，另一个小句说明为达到目的采取的行动。',examples:[
    {hanzi:'为了准备运动会，我们每天都练球。',pinyin:'Wèile zhǔnbèi yùndònghuì, wǒmen měitiān dōu liàn qiú.',english:'To prepare for the sports meet, we practise every day.'},
    {hanzi:'为了参加网球比赛，白家月最近一直在练习。',pinyin:'Wèile cānjiā wǎngqiú bǐsài, Bái Jiāyuè zuìjìn yìzhí zài liànxí.',english:'To enter the tennis match, Bai Jiayue has been practising recently.'},
    {hanzi:'为了考上大学，她每天努力学习。',pinyin:'Wèile kǎoshàng dàxué, tā měitiān nǔlì xuéxí.',english:'To get into university, she studies hard every day.'},
    {hanzi:'为了早点儿到家，我打算坐飞机回去。',pinyin:'Wèile zǎodiǎnr dào jiā, wǒ dǎsuàn zuò fēijī huíqu.',english:'To get home earlier, I plan to fly back.'},
    {hanzi:'大家打球只是为了锻炼身体。',pinyin:'Dàjiā dǎ qiú zhǐshì wèile duànliàn shēntǐ.',english:'Everyone plays only to exercise.'}
  ]},
  {id:'g09_02',title:'可能补语',titleEn:'Potential complements',scene:'Say whether a result can or cannot be achieved under the conditions.',structure:'动词 + 得 / 不 + 结果补语或趋向补语',explanation:'“得”表示有条件实现结果，“不”表示不能实现；它说明能不能做到，不评价做得好不好。',examples:[
    {hanzi:'我接得住这个球。',pinyin:'Wǒ jiē de zhù zhège qiú.',english:'I can return this shot.'},
    {hanzi:'她总是接不住球。',pinyin:'Tā zǒngshì jiē bu zhù qiú.',english:'She keeps being unable to return the shuttlecock.'},
    {hanzi:'今天怎么总是踢不进去？',pinyin:'Jīntiān zěnme zǒngshì tī bu jìnqu?',english:"Why can't they get it into the goal today?"},
    {hanzi:'声音太小，我听不见。',pinyin:'Shēngyīn tài xiǎo, wǒ tī bu jiàn.',english:"The sound is too quiet; I can't hear it."},
    {hanzi:'这个箱子不重，我拿得动。',pinyin:'Zhège xiāngzi bù zhòng, wǒ ná de dòng.',english:'This suitcase is not heavy; I can carry it.'},
    {hanzi:'你看得清看不清？',pinyin:'Nǐ kàn de qīng kàn bu qīng?',english:'Can you see it clearly or not?'}
  ]},
  {id:'g09_03',title:'固定格式“越A越B”',titleEn:'The pattern 越 A 越 B',scene:'B changes as A changes.',structure:'越 + A，越 + B',explanation:'B随着A的变化而变化。A、B可以是动词性或形容词性成分。',examples:[
    {hanzi:'今天的足球比赛我越看越着急。',pinyin:'Jīntiān de zúqiú bǐsài wǒ yuè kàn yuè zháojí.',english:'The more I watch today’s match, the more anxious I become.'},
    {hanzi:'妈妈越说，他越不高兴。',pinyin:'Māma yuè shuō, tā yuè bù gāoxìng.',english:'The more his mother talks, the unhappier he becomes.'},
    {hanzi:'这个动作越练越容易。',pinyin:'Zhège dòngzuò yuè liàn yuè róngyì.',english:'The more you practise this move, the easier it becomes.'},
    {hanzi:'天气越来越热了。',pinyin:'Tiānqì yuè lái yuè rè le.',english:'The weather is getting hotter and hotter.'},
    {hanzi:'我想认识中国朋友，越多越好。',pinyin:'Wǒ xiǎng rènshi Zhōngguó péngyou, yuè duō yuè hǎo.',english:'I want to meet Chinese friends; the more, the better.'},
    {hanzi:'大家越紧张，比赛越容易受到影响。',pinyin:'Dàjiā yuè jǐnzhāng, bǐsài yuè róngyì shòudào yǐngxiǎng.',english:'The more nervous everyone is, the more easily the match is affected.'}
  ]}
];

const grammarTeachingNotes = {
  g09_01:{
    scene:'先观察五个完整句子：每句话中哪一部分说明目的，哪一部分说明为达到目的采取的行动？',structure:'为了 + 目的，主语 + 行动',structureEn:'为了 + goal, subject + action',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'先找出每句中的“为了”，再比较目的在句首和句末时的表达。',observeHighlights:[['为了'],['为了'],['为了'],['为了'],['为了']],
    visualLearning:{leadExamples:[
      {english:'Our goal is to prepare for the sports meet.',hanzi:'为了准备运动会……',pinyin:'Wèile zhǔnbèi yùndònghuì...'},
      {english:'Our action is to practise every day.',hanzi:'……我们每天都练球。',pinyin:'...wǒmen měitiān dōu liàn qiú.'},
      {english:'Put the goal and action together.',hanzi:'为了准备运动会，我们每天都练球。',pinyin:'Wèile zhǔnbèi yùndònghuì, wǒmen měitiān dōu liàn qiú.'}
    ],blocks:['为了 + 目的','主语 + 行动'],blockLabelsEn:['goal','action taken to reach it']},
    oralQuestions:[
      {question:'为了参加运动会，你准备做什么？',pinyin:'Wèile cānjiā yùndònghuì, nǐ zhǔnbèi zuò shénme?'},
      {question:'为了提高汉语水平，你每天做什么？',pinyin:'Wèile tígāo Hànyǔ shuǐpíng, nǐ měitiān zuò shénme?'},
      {question:'你参加一项运动主要是为了什么？',pinyin:'Nǐ cānjiā yí xiàng yùndòng zhǔyào shì wèile shénme?'},
      {question:'为了不紧张，比赛以前可以做什么？',pinyin:'Wèile bù jǐnzhāng, bǐsài yǐqián kěyǐ zuò shénme?'}
    ],
    structureVariants:[
      {label:'目的在前',formula:'为了 + 目的，主语 + 行动',formulaEn:'Goal first, then action',explanation:'先说想达到什么目标，再说具体行动。',example:'为了准备比赛，我们每天练习。',examplePinyin:'Wèile zhǔnbèi bǐsài, wǒmen měitiān liànxí.'},
      {label:'目的在后',formula:'主语 + 行动 + 是为了 + 目的',formulaEn:'Action first, then purpose',explanation:'先说行动，再用“是为了”强调目的。',example:'我们每天练球是为了准备运动会。',examplePinyin:'Wǒmen měitiān liàn qiú shì wèile zhǔnbèi yùndònghuì.'}
    ],
    followUp:[
      {image:img('photo-text-1-sports-field'),promptEn:'The students practise every afternoon because they want to prepare for the sports meet.',target:'用“为了……，……”说明目的和行动。',sampleAnswer:{hanzi:'为了准备运动会，他们每天下午都在球场练习。',pinyin:'Wèile zhǔnbèi yùndònghuì, tāmen měitiān xiàwǔ dōu zài qiúchǎng liànxí.'}},
      {image:img('photo-text-2-practice'),promptEn:'A beginner practises returning the shuttlecock before joining the group.',target:'说出她练习的目的。',sampleAnswer:{hanzi:'为了下周跟同学一起打，她先自己练习接球。',pinyin:'Wèile xià zhōu gēn tóngxué yìqǐ dǎ, tā xiān zìjǐ liànxí jiē qiú.'}}
    ]
  },
  g09_02:{
    scene:'The shuttlecock is coming toward a beginner. Can she return it under the current conditions?',structure:'动词 + 得 / 不 + 补语',structureEn:'Verb + 得 / 不 + result or directional complement',presentationMode:'progressive_grammar',observeMode:'structure_rows',observePrompt:'比较肯定和否定例句，观察“得 / 不”放在动词和补语之间的位置。',observeHighlights:[['接得住'],['接不住'],['踢不进去'],['听不见'],['拿得动']],
    visualLearning:{leadExamples:[
      {english:'The ball is slow, so she can return it.',hanzi:'球很慢，她接得住。',pinyin:'Qiú hěn màn, tā jiē de zhù.'},
      {english:'The ball is too fast, so she cannot return it.',hanzi:'球太快，她接不住。',pinyin:'Qiú tài kuài, tā jiē bu zhù.'},
      {english:'Can she do it, or does she do it well?',hanzi:'“接得住”说能不能，“接得好”说好不好。',pinyin:'“Jiē de zhù” shuō néng bu néng, “jiē de hǎo” shuō hǎo bu hǎo.'}
    ],blocks:['动词','得 / 不','结果或方向'],blockLabelsEn:['action','possible / impossible','result']},
    oralQuestions:[
      {question:'你接得住快球吗？',pinyin:'Nǐ jiē de zhù kuài qiú ma?'},
      {question:'在教室最后一排，你听得见老师说话吗？',pinyin:'Zài jiàoshì zuìhòu yì pái, nǐ tīng de jiàn lǎoshī shuōhuà ma?'},
      {question:'什么运动动作你现在还做不到？',pinyin:'Shénme yùndòng dòngzuò nǐ xiànzài hái zuò bu dào?'},
      {question:'怎样练才能把球踢进去？',pinyin:'Zěnyàng liàn cái néng bǎ qiú tī jìnqu?'}
    ],
    structureVariants:[
      {label:'肯定',formula:'V + 得 + C',formulaEn:'able to achieve the result',explanation:'条件允许，结果能够实现。',example:'声音很清楚，我听得见。',examplePinyin:'Shēngyīn hěn qīngchu, wǒ tī de jiàn.'},
      {label:'否定',formula:'V + 不 + C',formulaEn:'unable to achieve the result',explanation:'条件不允许，结果不能实现。',example:'球太快了，我接不住。',examplePinyin:'Qiú tài kuài le, wǒ jiē bu zhù.'},
      {label:'问句',formula:'V + 得 + C + V + 不 + C？',formulaEn:'can or cannot?',explanation:'并列正反形式询问能否实现。',example:'你看得清看不清？',examplePinyin:'Nǐ kàn de qīng kàn bu qīng?'},
      {label:'与程度补语对比',formula:'V + 得 + 形容词',formulaEn:'describes how well an action is done',explanation:'“打得好”评价动作质量；“打得了 / 打不了”说明条件是否允许。',example:'我打得不太好，但是今天能打。',examplePinyin:'Wǒ dǎ de bú tài hǎo, dànshì jīntiān néng dǎ.'}
    ],
    followUp:[
      {image:img('photo-text-2-practice'),promptEn:'The beginner misses a fast shuttlecock but can return a slower one.',target:'分别用“接不住”和“接得住”说两句话。',sampleAnswer:{hanzi:'快球她还接不住，慢一点儿的球已经接得住了。',pinyin:'Kuài qiú tā hái jiē bu zhù, màn yìdiǎnr de qiú yǐjīng jiē de zhù le.'}},
      {image:img('photo-text-3-match-pressure'),promptEn:'The team creates chances, but the ball still does not go into the goal.',target:'用“踢不进去”说明比赛情况。',sampleAnswer:{hanzi:'他们今天很紧张，有机会也总是踢不进去。',pinyin:'Tāmen jīntiān hěn jǐnzhāng, yǒu jīhuì yě zǒngshì tī bu jìnqu.'}}
    ]
  },
  g09_03:{
    scene:'先观察五个完整句子：前一部分发生变化时，后一部分怎样跟着变化？',structure:'越 + A，越 + B',structureEn:'The more A changes, the more B changes',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'找出每句中成对出现的“越”，再比较动作、状态和“越来越”的表达。',observeHighlights:[['越看','越着急'],['越说','越不高兴'],['越练','越容易'],['越来越热'],['越多','越好']],
    visualLearning:{leadExamples:[
      {english:'The match continues.',hanzi:'越看……',pinyin:'Yuè kàn...'},
      {english:'The viewer becomes more anxious.',hanzi:'……越着急。',pinyin:'...yuè zháojí.'},
      {english:'B changes together with A.',hanzi:'越看越着急。',pinyin:'Yuè kàn yuè zháojí.'}
    ],blocks:['越 + A','越 + B'],blockLabelsEn:['changing condition','changing result']},
    oralQuestions:[
      {question:'什么运动你越练越喜欢？',pinyin:'Shénme yùndòng nǐ yuè liàn yuè xǐhuan?'},
      {question:'比赛的时候，你会不会越看越紧张？',pinyin:'Bǐsài de shíhou, nǐ huì bu huì yuè kàn yuè jǐnzhāng?'},
      {question:'汉语学习中，什么内容越学越容易？',pinyin:'Hànyǔ xuéxí zhōng, shénme nèiróng yuè xué yuè róngyì?'},
      {question:'运动伙伴是越多越好吗？为什么？',pinyin:'Yùndòng huǒbàn shì yuè duō yuè hǎo ma? Wèishénme?'}
    ],
    structureVariants:[
      {label:'动作到状态',formula:'越 + 动词，越 + 形容词',formulaEn:'the more one does, the more one feels',explanation:'动作持续变化，状态跟着变化。',example:'我越看越着急。',examplePinyin:'Wǒ yuè kàn yuè zháojí.'},
      {label:'动作到动作',formula:'越 + 动词，越 + 动词',formulaEn:'one changing action leads to another',explanation:'两个动作一起发展。',example:'他越练越想参加比赛。',examplePinyin:'Tā yuè liàn yuè xiǎng cānjiā bǐsài.'},
      {label:'状态到状态',formula:'越 + 形容词，越 + 形容词',formulaEn:'two qualities change together',explanation:'程度越高，另一种程度也跟着变化。',example:'球越快，我越紧张。',examplePinyin:'Qiú yuè kuài, wǒ yuè jǐnzhāng.'},
      {label:'固定说法',formula:'越 + 形容词，越好',formulaEn:'the more, the better',explanation:'常用来表示数量或程度越高越理想。',example:'运动伙伴越多越好。',examplePinyin:'Yùndòng huǒbàn yuè duō yuè hǎo.'}
    ],
    followUp:[
      {image:img('photo-text-3-watch-match'),promptEn:'The viewer becomes increasingly anxious as the football match continues.',target:'用“越看越……”说一句话。',sampleAnswer:{hanzi:'这场比赛一直没有得分，我越看越着急。',pinyin:'Zhè chǎng bǐsài yìzhí méiyǒu défēn, wǒ yuè kàn yuè zháojí.'}},
      {image:img('photo-text-1-sports-field'),promptEn:'Regular practice makes the students more confident.',target:'用动词性和形容词性成分各说一部分。',sampleAnswer:{hanzi:'他们越练越有信心，动作也越来越自然。',pinyin:'Tāmen yuè liàn yuè yǒu xìnxīn, dòngzuò yě yuè lái yuè zìrán.'}}
    ]
  }
};

const qa = rows => rows.map(row => ({question:row[0],question_pinyin:row[1],answer:row[2],answer_pinyin:row[3]}));
const textTeachingNotes = {
  t_hsk3_l09_01:{
    presentationMode:'listen_first_progressive',listenPrompt:'先听人物在哪里、李文为什么跑来，以及两个人准备参加什么项目。',
    preReadingQuestions:[
      {question:'如果你忘了还同学的卡，你会怎么说？',pinyin:'Rúguǒ nǐ wàngle huán tóngxué de kǎ, nǐ huì zěnme shuō?'},
      {question:'你想参加学校运动会吗？',pinyin:'Nǐ xiǎng cānjiā xuéxiào yùndònghuì ma?'}
    ],
    classQuestions:qa([
      ['李文忘了还什么？','Lǐ Wén wàngle huán shénme?','白家月的校园卡。','Bái Jiāyuè de xiàoyuánkǎ.'],
      ['李文为什么这么快就过来了？','Lǐ Wén wèishénme zhème kuài jiù guòlai le?','他接了白家月的电话，就从球场跑过来了。','Tā jiēle Bái Jiāyuè de diànhuà, jiù cóng qiúchǎng pǎoguòlai le.'],
      ['几个男生为什么每天练球？','Jǐ gè nánshēng wèishénme měitiān liàn qiú?','为了准备运动会。','Wèile zhǔnbèi yùndònghuì.'],
      ['白家月想参加什么比赛？','Bái Jiāyuè xiǎng cānjiā shénme bǐsài?','网球比赛。','Wǎngqiú bǐsài.'],
      ['李文准备怎样支持白家月？','Lǐ Wén zhǔnbèi zěnyàng zhīchí Bái Jiāyuè?','到时候去看她的比赛。','Dào shíhou qù kàn tā de bǐsài.']
    ]),
    keyPoints:[
      {hanzi:'接了你的电话就跑过来了',pinyin:'Jiēle nǐ de diànhuà jiù pǎoguòlai le.',note:'“一……就……”表示前一件事发生后马上有下一件事。'},
      {hanzi:'为了准备运动会',pinyin:'Wèile zhǔnbèi yùndònghuì.',note:'“为了”后的内容是目的，每天练球是行动。'}
    ],
    cultureDiscussion:{title:'为运动会做准备',titleEn:'Preparing for a School Sports Meet',questions:[
      {hanzi:'你想参加什么项目？',pinyin:'Nǐ xiǎng cānjiā shénme xiàngmù?'},
      {hanzi:'为了这个目标，你准备怎么练？',pinyin:'Wèile zhège mùbiāo, nǐ zhǔnbèi zěnme liàn?'}
    ],wordCards:[
      {hanzi:'报名',pinyin:'bàomíng',english:'sign up'},{hanzi:'训练',pinyin:'xùnliàn',english:'train'},{hanzi:'加油',pinyin:'jiāyóu',english:'cheer on'}
    ],background:'学校运动会可以包括跑步、球类等项目。课堂重点是说明个人目的和准备计划。',sampleAnswers:[
      {hanzi:'我想参加网球比赛，为了打得更好，我每周练三次。',pinyin:'Wǒ xiǎng cānjiā wǎngqiú bǐsài, wèile dǎ de gèng hǎo, wǒ měi zhōu liàn sān cì.'},
      {hanzi:'我不参加比赛，但是我会去给同学加油。',pinyin:'Wǒ bù cānjiā bǐsài, dànshì wǒ huì qù gěi tóngxué jiāyóu.'}
    ]},
    retellScaffold:{nodes:[{label:'校园卡',hint:'忘了还、道歉'},{label:'球场',hint:'接电话、跑来'},{label:'运动会',hint:'男生、每天练球'},{label:'网球',hint:'白家月、最近练习'},{label:'支持',hint:'去看比赛'}],frame:'李文忘了……，所以向白家月……。他刚才在……。几个男生为了……，每天……。白家月想……，李文说……。'}
  },
  t_hsk3_l09_02:{
    presentationMode:'listen_first_progressive',listenPrompt:'先听李文邀请谁、白家月担心什么，以及李文怎样鼓励她。',
    preReadingQuestions:[
      {question:'很久没做一项运动，你会担心什么？',pinyin:'Hěn jiǔ méi zuò yí xiàng yùndòng, nǐ huì dānxīn shénme?'},
      {question:'朋友觉得自己打不好时，你会怎么鼓励他？',pinyin:'Péngyou juéde zìjǐ dǎ bu hǎo shí, nǐ huì zěnme gǔlì tā?'}
    ],
    classQuestions:qa([
      ['李文邀请白家月做什么？','Lǐ Wén yāoqǐng Bái Jiāyuè zuò shénme?','跟大家一起打羽毛球。','Gēn dàjiā yìqǐ dǎ yǔmáoqiú.'],
      ['白家月为什么不太想马上参加？','Bái Jiāyuè wèishénme bú tài xiǎng mǎshàng cānjiā?','她好多年没打了，几乎忘了怎么打。','Tā hǎo duō nián méi dǎ le, jīhū wàngle zěnme dǎ.'],
      ['“接不住球”在这里是什么意思？','“Jiē bu zhù qiú” zài zhèli shì shénme yìsi?','不能把羽毛球打回去。','Bù néng bǎ yǔmáoqiú dǎ huíqu.'],
      ['大家打球主要是为了什么？','Dàjiā dǎ qiú zhǔyào shì wèile shénme?','为了锻炼身体。','Wèile duànliàn shēntǐ.'],
      ['白家月最后准备怎么练？','Bái Jiāyuè zuìhòu zhǔnbèi zěnme liàn?','先自己练，也可以跟李文和天中一起练。','Xiān zìjǐ liàn, yě kěyǐ gēn Lǐ Wén hé Tiānzhōng yìqǐ liàn.']
    ]),
    keyPoints:[
      {hanzi:'打不好没关系',pinyin:'Dǎ bu hǎo méi guānxi.',note:'“打不好”评价动作质量；“接不住”表示无法实现接住或回球的结果。'},
      {hanzi:'接不住球',pinyin:'Jiē bu zhù qiú.',note:'羽毛球语境中指不能把来球打回去。'}
    ],
    cultureDiscussion:{title:'初学者怎样加入运动？',titleEn:'How Can a Beginner Join In?',questions:[
      {hanzi:'初学者打不好时，什么话最有帮助？',pinyin:'Chūxuézhě dǎ bu hǎo shí, shénme huà zuì yǒu bāngzhù?'},
      {hanzi:'一个人练和跟同学练，各有什么好处？',pinyin:'Yí gè rén liàn hé gēn tóngxué liàn, gè yǒu shénme hǎochu?'}
    ],wordCards:[
      {hanzi:'慢慢来',pinyin:'mànmàn lái',english:'take it slowly'},{hanzi:'再试一次',pinyin:'zài shì yí cì',english:'try once more'},{hanzi:'一起练',pinyin:'yìqǐ liàn',english:'practise together'}
    ],background:'鼓励初学者时，重点是降低紧张感、提供可行练习办法，不把“打不好”变成嘲笑或惩罚。',sampleAnswers:[
      {hanzi:'打不好没关系，我们先从慢球开始。',pinyin:'Dǎ bu hǎo méi guānxi, wǒmen xiān cóng màn qiú kāishǐ.'},
      {hanzi:'如果快球接不住，可以先跟一个同学练。',pinyin:'Rúguǒ kuài qiú jiē bu zhù, kěyǐ xiān gēn yí gè tóngxué liàn.'}
    ]},
    retellScaffold:{nodes:[{label:'邀请',hint:'一起打羽毛球'},{label:'担心',hint:'好多年、几乎忘了'},{label:'困难',hint:'接不住、不好意思'},{label:'目的',hint:'只是锻炼身体'},{label:'办法',hint:'自己练、跟李文和天中练'}],frame:'李文邀请……。白家月因为……，担心……。李文说……，大家只是为了……。最后白家月决定……。'}
  },
  t_hsk3_l09_03:{
    presentationMode:'listen_first_progressive',listenPrompt:'先听三个人在看什么、球队为什么表现不好，以及白家月的情绪怎样变化。',
    preReadingQuestions:[
      {question:'你看比赛时会紧张吗？',pinyin:'Nǐ kàn bǐsài shí huì jǐnzhāng ma?'},
      {question:'一名主要球员不能参加，会有什么影响？',pinyin:'Yì míng zhǔyào qiúyuán bù néng cānjiā, huì yǒu shénme yǐngxiǎng?'}
    ],
    classQuestions:qa([
      ['三个人在看什么？','Sān gè rén zài kàn shénme?','足球比赛。','Zúqiú bǐsài.'],
      ['李文去拿什么？','Lǐ Wén qù ná shénme?','啤酒和饮料。','Píjiǔ hé yǐnliào.'],
      ['球队为什么总是踢不进去？','Qiúduì wèishénme zǒngshì tī bu jìnqu?','老球员生病了，新球员第一次参加重要比赛，太紧张了。','Lǎo qiúyuán shēngbìng le, xīn qiúyuán dì-yī cì cānjiā zhòngyào bǐsài, tài jǐnzhāng le.'],
      ['主要球员没参加，对大家有什么影响？','Zhǔyào qiúyuán méi cānjiā, duì dàjiā yǒu shénme yǐngxiǎng?','大家也都受到影响了。','Dàjiā yě dōu shòudào yǐngxiǎng le.'],
      ['白家月为什么不看了？','Bái Jiāyuè wèishénme bú kàn le?','她越看越着急。','Tā yuè kàn yuè zháojí.']
    ]),
    keyPoints:[
      {hanzi:'总是踢不进去',pinyin:'Zǒngshì tī bu jìnqu.',note:'可能补语否定式，表示球无法进入球门。'},
      {hanzi:'越看越着急',pinyin:'Yuè kàn yuè zháojí.',note:'随着观看继续，着急的程度增加。'}
    ],
    cultureDiscussion:{title:'比赛表现为什么会变化？',titleEn:'Why Does Match Performance Change?',questions:[
      {hanzi:'紧张会怎样影响运动员？',pinyin:'Jǐnzhāng huì zěnyàng yǐngxiǎng yùndòngyuán?'},
      {hanzi:'看比赛时，你的心情会怎样变化？',pinyin:'Kàn bǐsài shí, nǐ de xīnqíng huì zěnyàng biànhuà?'}
    ],wordCards:[
      {hanzi:'配合',pinyin:'pèihé',english:'coordinate; teamwork'},{hanzi:'机会',pinyin:'jīhuì',english:'chance'},{hanzi:'放松',pinyin:'fàngsōng',english:'relax'}
    ],background:'比赛表现可能受到紧张、人员变化和团队配合等因素影响。课堂讨论只根据对话提供的信息评论。',sampleAnswers:[
      {hanzi:'运动员越紧张，动作越容易受到影响。',pinyin:'Yùndòngyuán yuè jǐnzhāng, dòngzuò yuè róngyì shòudào yǐngxiǎng.'},
      {hanzi:'我看重要比赛时越看越兴奋。',pinyin:'Wǒ kàn zhòngyào bǐsài shí yuè kàn yuè xīngfèn.'}
    ]},
    retellScaffold:{nodes:[{label:'开始',hint:'足球比赛、快来看'},{label:'饮料',hint:'冰箱、去拿'},{label:'问题',hint:'踢不进去'},{label:'原因',hint:'老球员生病、新球员紧张'},{label:'情绪',hint:'越看越着急、问得分'}],frame:'足球比赛……。李文去……。球队总是……，因为……。主要球员没参加，所以……。白家月越……越……，最后……。'}
  },
  t_hsk3_l09_04:{
    presentationMode:'listen_first_progressive',listenPrompt:'先完整听一遍演讲稿，不看课文；找出赛事、人物、年份、项目和作者的评价。',
    preReadingQuestions:[
      {question:'介绍一位体育人物时，你会选择哪些信息？',pinyin:'Jièshào yí wèi tǐyù rénwù shí, nǐ huì xuǎnzé nǎxiē xìnxī?'},
      {question:'好成绩是体育人物值得介绍的唯一原因吗？',pinyin:'Hǎo chéngjì shì tǐyù rénwù zhíde jièshào de wéiyī yuányīn ma?'}
    ],
    classQuestions:qa([
      ['李文最爱看什么比赛？','Lǐ Wén zuì ài kàn shénme bǐsài?','奥运会。','Àoyùnhuì.'],
      ['教材写到哪一段奥运会年份？','Jiàocái xiě dào nǎ yí duàn Àoyùnhuì niánfèn?','从1896年到2024年。','Cóng yī bā jiǔ liù nián dào èr líng èr sì nián.'],
      ['第一位参加奥运会的中国运动员是谁？','Dì-yī wèi cānjiā Àoyùnhuì de Zhōngguó yùndòngyuán shì shéi?','刘长春。','Liú Chángchūn.'],
      ['他1932年参加了什么项目？','Tā yī jiǔ sān èr nián cānjiāle shénme xiàngmù?','100米和200米短跑比赛。','Yì bǎi mǐ hé liǎng bǎi mǐ duǎnpǎo bǐsài.'],
      ['为什么演讲稿认为他值得介绍？','Wèishénme yǎnjiǎnggǎo rènwéi tā zhíde jièshào?','虽然没有得到好成绩，但是他让世界认识了中国。','Suīrán méiyǒu dédào hǎo chéngjì, dànshì tā ràng shìjiè rènshi le Zhōngguó.']
    ]),
    keyPoints:[
      {hanzi:'第一位参加奥运会的中国运动员',pinyin:'Dì-yī wèi cānjiā Àoyùnhuì de Zhōngguó yùndòngyuán.',note:'多项定语共同说明“运动员”。'},
      {hanzi:'虽然……但是……',pinyin:'Suīrán... dànshì...',note:'先承认一个事实，再说明与预期不同或更重要的结果。'}
    ],
    cultureDiscussion:{title:'体育人物为什么值得介绍？',titleEn:'Why Is a Sports Figure Worth Introducing?',questions:[
      {hanzi:'除了成绩，还可以介绍运动员的什么？',pinyin:'Chúle chéngjì, hái kěyǐ jièshào yùndòngyuán de shénme?'},
      {hanzi:'你想介绍哪一位体育人物？为什么？',pinyin:'Nǐ xiǎng jièshào nǎ yí wèi tǐyù rénwù? Wèishénme?'}
    ],wordCards:[
      {hanzi:'第一次',pinyin:'dì-yī cì',english:'the first time'},{hanzi:'坚持',pinyin:'jiānchí',english:'persist'},{hanzi:'代表',pinyin:'dàibiǎo',english:'represent'}
    ],background:'本环节只使用教材给出的刘长春、1932年、100米和200米短跑等事实。学生可以从“第一次、努力、影响”解释人物价值。',sampleAnswers:[
      {hanzi:'体育人物的努力和影响也值得介绍。',pinyin:'Tǐyù rénwù de nǔlì hé yǐngxiǎng yě zhíde jièshào.'},
      {hanzi:'虽然他没有得到好成绩，但是他让世界认识了中国。',pinyin:'Suīrán tā méiyǒu dédào hǎo chéngjì, dànshì tā ràng shìjiè rènshi le Zhōngguó.'}
    ]},
    retellScaffold:{nodes:[{label:'爱好',hint:'体育比赛、奥运会'},{label:'影响',hint:'世界、运动员'},{label:'人物',hint:'刘长春、第一位'},{label:'项目',hint:'1932、100米、200米'},{label:'意义',hint:'虽然成绩、但是认识中国'}],frame:'李文喜欢……，最爱……。奥运会是……。第一位……是……，他在1932年参加……。虽然……，但是……。'}
  }
};

const sceneData = {
  1:{title:'校园卡与运动会准备',subtitle:'先归还校园卡，再到球场说明参加项目和准备计划。',steps:[
    {title:'图书馆门口还校园卡',talkHint:'先观察人物、地点和手里的物品。',prompt:'如果你忘了还同学的卡，见面时会怎么说？',promptPinyin:'Rúguǒ nǐ wàngle huán tóngxué de kǎ, jiànmiàn shí huì zěnme shuō?',promptEn:'What would you say if you forgot to return a classmate’s card?',image:img('photo-text-1-campus-card'),labels:[{word:'校园',x:12,y:13,targetX:74,targetY:18},{word:'卡',x:88,y:82,targetX:52,targetY:58}],words:['校园','卡'],sentence:'李文在校园里的图书馆门口把校园卡还给白家月。',sampleAnswers:[
      {hanzi:'对不起，我昨天忘了还你的校园卡。',pinyin:'Duìbuqǐ, wǒ zuótiān wàngle huán nǐ de xiàoyuánkǎ.'},
      {hanzi:'没关系，谢谢你跑过来还卡。',pinyin:'Méi guānxi, xièxie nǐ pǎoguòlai huán kǎ.'}
    ]},
    {title:'球场上准备运动会',talkHint:'找出人物正在做什么，再说目的。',prompt:'他们为什么每天在球场练球？',promptPinyin:'Tāmen wèishénme měitiān zài qiúchǎng liàn qiú?',promptEn:'Why do they practise on the sports field every day?',image:img('photo-text-1-sports-field'),labels:[{word:'球场',x:12,y:82,targetX:45,targetY:67},{word:'运动会',x:88,y:13,targetX:72,targetY:30},{word:'男生',x:12,y:13,targetX:31,targetY:48},{word:'练',x:88,y:82,targetX:62,targetY:55}],words:['球场','运动会','男生','练'],sentence:'几个男生为了准备运动会，每天都在球场练球。',sampleAnswers:[
      {hanzi:'为了准备运动会，他们每天都练球。',pinyin:'Wèile zhǔnbèi yùndònghuì, tāmen měitiān dōu liàn qiú.'},
      {hanzi:'我想参加网球比赛，最近一直在练习。',pinyin:'Wǒ xiǎng cānjiā wǎngqiú bǐsài, zuìjìn yìzhí zài liànxí.'},
      {hanzi:'到时候我会去看同学的比赛。',pinyin:'Dào shíhou wǒ huì qù kàn tóngxué de bǐsài.'}
    ]}
  ]},
  2:{title:'邀请初学者一起打球',subtitle:'从邀请、担心到分步练习，用可能补语说明做得到或做不到。',steps:[
    {title:'同学邀请白家月打羽毛球',talkHint:'先说她为什么犹豫，再想一句鼓励的话。',prompt:'很久没打羽毛球，跟好多同学一起打，你会担心什么？',promptPinyin:'Hěn jiǔ méi dǎ yǔmáoqiú, gēn hǎoduō tóngxué yìqǐ dǎ, nǐ huì dānxīn shénme?',promptEn:'What might worry you if you have not played badminton for years?',image:img('photo-text-2-invitation'),labels:[{word:'好多',x:12,y:13,targetX:72,targetY:45},{word:'几乎',x:88,y:13,targetX:40,targetY:42},{word:'只',x:88,y:82,targetX:66,targetY:64}],words:['好多','几乎','只',extension('羽毛球','yǔmáoqiú','badminton',['打羽毛球','羽毛球拍'],'我们下课以后一起打羽毛球。','Wǒmen xiàkè yǐhòu yìqǐ dǎ yǔmáoqiú.')],labelsExtraNote:'羽毛球为 L08 复习词。',sentence:'白家月好多年没打羽毛球了，几乎忘了怎么打；李文说大家只是为了锻炼身体。',sampleAnswers:[
      {hanzi:'我会担心自己打不好，也怕接不住球。',pinyin:'Wǒ huì dānxīn zìjǐ dǎ bu hǎo, yě pà jiē bu zhù qiú.'},
      {hanzi:'不是比赛，打不好没关系。',pinyin:'Bú shì bǐsài, dǎ bu hǎo méi guānxi.'}
    ]},
    {title:'初学者练习接球',talkHint:'比较快球和慢球，说明什么接得住、什么接不住。',prompt:'初学者接不住快球时，可以怎么练？',promptPinyin:'Chūxuézhě jiē bu zhù kuài qiú shí, kěyǐ zěnme liàn?',promptEn:'How can a beginner practise when fast shots are still too difficult to return?',image:img('photo-text-2-practice'),labels:[{word:'练习',x:12,y:82,targetX:45,targetY:65},{word:'比赛',x:88,y:13,targetX:78,targetY:27},{word:'接球',x:88,y:82,targetX:57,targetY:47}],words:['练习','比赛',extension('接球','jiē qiú','return a ball or shuttlecock',['接得住球','接不住球'],'慢一点儿的球，她已经接得住了。','Màn yìdiǎnr de qiú, tā yǐjīng jiē de zhù le.')],sentence:'她先练习接慢球，接不住快球也没关系。',sampleAnswers:[
      {hanzi:'她可以先练慢一点儿的球。',pinyin:'Tā kěyǐ xiān liàn màn yìdiǎnr de qiú.'},
      {hanzi:'这个球她接得住，太快的球还接不住。',pinyin:'Zhège qiú tā jiē de zhù, tài kuài de qiú hái jiē bu zhù.'},
      {hanzi:'同学可以陪她一起练，慢慢来。',pinyin:'Tóngxué kěyǐ péi tā yìqǐ liàn, mànmàn lái.'}
    ]}
  ]},
  3:{title:'观看足球比赛',subtitle:'观察看球时的情绪，再分析紧张对球队表现的影响。',steps:[
    {title:'朋友在家看足球比赛',talkHint:'看人物的表情，描述心情怎样变化。',prompt:'如果比赛一直没有得分，你会继续看吗？心情会怎样？',promptPinyin:'Rúguǒ bǐsài yìzhí méiyǒu défēn, nǐ huì jìxù kàn ma? Xīnqíng huì zěnyàng?',promptEn:'If nobody scores for a long time, will you keep watching? How will you feel?',image:img('photo-text-3-watch-match'),labels:[{word:'啤酒',x:12,y:82,targetX:31,targetY:70},{word:'回',x:12,y:13,targetX:45,targetY:39},{word:'得分',x:88,y:13,targetX:78,targetY:26}],words:['啤酒','回','得分',extension('着急','zháojí','anxious; worried',['越看越着急','别着急'],'比赛一直没有得分，她越看越着急。','Bǐsài yìzhí méiyǒu défēn, tā yuè kàn yuè zháojí.')],sentence:'足球比赛一直没有得分，白家月越看越着急。',sampleAnswers:[
      {hanzi:'我会继续看，但是可能越看越紧张。',pinyin:'Wǒ huì jìxù kàn, dànshì kěnéng yuè kàn yuè jǐnzhāng.'},
      {hanzi:'我先不看了，请朋友告诉我得分。',pinyin:'Wǒ xiān bú kàn le, qǐng péngyou gàosu wǒ défēn.'}
    ]},
    {title:'新球员在重要比赛中紧张',talkHint:'根据人物和球门，分析为什么踢不进去。',prompt:'主要球员不能参加时，新球员为什么容易紧张？',promptPinyin:'Zhǔyào qiúyuán bù néng cānjiā shí, xīn qiúyuán wèishénme róngyì jǐnzhāng?',promptEn:'Why may new players become nervous when the main players cannot take part?',image:img('photo-text-3-match-pressure'),labels:[{word:'紧张',x:12,y:13,targetX:35,targetY:42},{word:'主要',x:88,y:13,targetX:70,targetY:41},{word:'受到',x:12,y:82,targetX:47,targetY:56},{word:'影响',x:88,y:82,targetX:60,targetY:56}],words:['紧张','主要','受到','影响'],sentence:'主要球员没参加，新球员很紧张，大家的表现也受到了影响。',sampleAnswers:[
      {hanzi:'新球员第一次参加重要比赛，所以太紧张了。',pinyin:'Xīn qiúyuán dì-yī cì cānjiā zhòngyào bǐsài, suǒyǐ tài jǐnzhāng le.'},
      {hanzi:'主要球员没参加，大家的配合受到了影响。',pinyin:'Zhǔyào qiúyuán méi cānjiā, dàjiā de pèihé shòudào le yǐngxiǎng.'},
      {hanzi:'他们越紧张，越容易踢不进去。',pinyin:'Tāmen yuè jǐnzhāng, yuè róngyì tī bu jìnqu.'}
    ]}
  ]},
  4:{title:'准备体育人物演讲',subtitle:'从演讲准备到历史赛场，思考一位体育人物为什么值得介绍。',steps:[
    {title:'李文准备奥运会演讲稿',talkHint:'观察桌上的资料和动作，说说演讲需要哪些信息。',prompt:'介绍体育赛事或运动员时，你会先准备什么信息？',promptPinyin:'Jièshào tǐyù sàishì huò yùndòngyuán shí, nǐ huì xiān zhǔnbèi shénme xìnxī?',promptEn:'What information would you prepare for a talk about a sports event or athlete?',image:img('photo-text-4-speech'),labels:[{word:'体育',x:12,y:13,targetX:37,targetY:55},{word:'世界',x:88,y:13,targetX:70,targetY:32},{word:'奥运会',x:12,y:82,targetX:55,targetY:66}],words:['体育','世界','奥运会',extension('演讲稿','yǎnjiǎnggǎo','speech draft',['准备演讲稿','写演讲稿'],'李文在家准备体育人物演讲稿。','Lǐ Wén zài jiā zhǔnbèi tǐyù rénwù yǎnjiǎnggǎo.')],sentence:'李文准备介绍奥运会和一位中国运动员。',sampleAnswers:[
      {hanzi:'我会准备赛事名称、时间、人物和项目。',pinyin:'Wǒ huì zhǔnbèi sàishì míngchēng, shíjiān, rénwù hé xiàngmù.'},
      {hanzi:'我还会说明这个人为什么值得介绍。',pinyin:'Wǒ hái huì shuōmíng zhège rén wèishénme zhíde jièshào.'}
    ]},
    {title:'20世纪30年代的国际短跑赛场',talkHint:'只根据教材信息描述人物、项目和意义。',prompt:'没有得到好成绩的人，也可能对体育有重要影响吗？为什么？',promptPinyin:'Méiyǒu dédào hǎo chéngjì de rén, yě kěnéng duì tǐyù yǒu zhòngyào yǐngxiǎng ma? Wèishénme?',promptEn:'Can an athlete matter even without a strong result? Why?',image:img('photo-text-4-historical-runner'),labels:[{word:'运动员',x:12,y:13,targetX:47,targetY:48},{word:'得到',x:88,y:82,targetX:64,targetY:57},{word:'成绩',x:12,y:82,targetX:34,targetY:57},{word:'刘长春',x:88,y:13,targetX:47,targetY:48}],words:['运动员','得到','成绩','刘长春'],sentence:'教材介绍刘长春参加1932年的100米和200米短跑比赛。',sampleAnswers:[
      {hanzi:'虽然没有得到好成绩，但是第一次参加也很有意义。',pinyin:'Suīrán méiyǒu dédào hǎo chéngjì, dànshì dì-yī cì cānjiā yě hěn yǒu yìyì.'},
      {hanzi:'刘长春让世界认识了中国。',pinyin:'Liú Chángchūn ràng shìjiè rènshi le Zhōngguó.'},
      {hanzi:'体育人物的努力和影响也值得介绍。',pinyin:'Tǐyù rénwù de nǔlì hé yǐngxiǎng yě zhíde jièshào.'}
    ]}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {
    session:'A',title:'说明运动会目标和准备计划',
    words:['校园','卡','球场','为了','运动会','男生','练','参加','网球','比赛','练习'],image:img('photo-text-1-sports-field'),
    introEn:'Learn the words needed to return a campus card, choose a sports-meet event, and explain a goal plus the action taken to reach it. The full textbook dialogue stays for class.',
    recognition:[
      q('a_rec_01','哪个词表示“campus”？','Choose the word for campus.',['校园','球场','比赛','网球'],'校园'),
      q('a_rec_02','哪个词表示“sports meet”？','Choose the phrase.',['运动会','校园卡','网球拍','男生'],'运动会'),
      q('a_rec_03','“参加比赛”最接近哪个英文？','Choose the meaning.',['take part in a competition','watch television','return a card','buy a drink'],'take part in a competition'),
      q('a_rec_04','“练”和“练习”都跟什么有关？','Choose the situation.',['repeated practice','a world event','feeling nervous','a cold drink'],'repeated practice'),
      q('a_rec_05','“为了”后面通常说明什么？','Choose what follows 为了.',['a goal','a score only','a person’s name','a past date'],'a goal')
    ],
    matchWords:['校园','球场','运动会','参加','练习'],
    contexts:[
      ['我昨天忘了还你的校园____。','卡',['卡','回','只','成绩']],
      ['几个男生正在____上练球。','球场',['球场','世界','校园卡','啤酒']],
      ['____准备运动会，他们每天都练球。','为了',['为了','几乎','主要','受到']],
      ['我想____学校的网球比赛。','参加',['参加','得到','影响','得分']],
      ['白家月最近一直在____。','练习',['练习','紧张','世界','男生']]
    ],
    challenge:[
      q('a_ch_01','“校园卡”是什么？','Choose the meaning.',['campus card','sports field','tennis match','world record'],'campus card'),
      q('a_ch_02','为了准备运动会，几个男生每天都____。','Complete the sentence.',['练球','喝啤酒','看电视','回家'],'练球'),
      q('a_ch_03','哪一句先说目的，再说行动？','Choose the purpose sentence.',['为了参加比赛，我每周练三次。','我昨天忘了还卡。','比赛已经开始了。','他越看越着急。'],'为了参加比赛，我每周练三次。'),
      q('a_ch_04','白家月想参加什么比赛？','Choose the event.',['网球比赛','足球比赛','跑步比赛','游泳比赛'],'网球比赛'),
      q('a_ch_05','“最近一直在练习”表示什么？','Choose the meaning.',['practice has continued recently','practice will begin next year','practice is impossible','the match ended'],'practice has continued recently'),
      q('a_ch_06','哪一句自然地归还东西并道歉？','Choose the natural sentence.',['对不起，我昨天忘了还你的卡。','为了卡，我世界比赛。','你越卡越运动会。','我受到卡得分。'],'对不起，我昨天忘了还你的卡。'),
      q('a_ch_07','“你打算参加运动会吗？”在问什么？','Choose the meaning.',['a participation plan','a final score','a drink choice','a historical date'],'a participation plan'),
      q('a_ch_08','为了达到“跑完比赛”的目标，哪项行动最合适？','Choose the suitable action.',['每周按计划练跑步','比赛前完全不休息','只看别人训练','忘记运动鞋'],'每周按计划练跑步'),
      q('a_ch_09','哪一句把目的和行动说反了？','Choose the illogical sentence.',['为了休息，我每天练十个小时。','为了健康，我每周运动三次。','为了比赛，我练习发球。','为了早点到，我提前出发。'],'为了休息，我每天练十个小时。'),
      q('a_ch_10','课堂前你需要准备什么？','Choose the useful preparation.',['一个项目、目的和准备行动','完整课文答案','奥运会全部历史','一段医学诊断'],'一个项目、目的和准备行动')
    ]
  },
  {
    session:'B',title:'邀请同伴运动并说明能不能做到',
    words:['好多','几乎','只','练习','比赛','为了'],image:img('photo-text-2-practice'),
    introEn:'Learn to invite a classmate, say what you can or cannot do with potential complements, and encourage a beginner. 接球 here means returning the shuttlecock, not physically catching it.',
    recognition:[
      q('b_rec_01','“好多年”是什么意思？','Choose the meaning.',['many years','one week','almost today','only once'],'many years'),
      q('b_rec_02','哪个词表示“almost”？','Choose the word.',['几乎','只','好多','比赛'],'几乎'),
      q('b_rec_03','“接不住球”在羽毛球场景中是什么意思？','Choose the meaning.',['cannot return the shuttlecock','cannot find the court','does not know the score','cannot buy a racket'],'cannot return the shuttlecock'),
      q('b_rec_04','“打不好”主要评价什么？','Choose the meaning.',['how well someone plays','whether the court is open','the number of players','the date of a match'],'how well someone plays'),
      q('b_rec_05','“大家打球只是为了锻炼身体”在说明什么？','Choose the meaning.',['the purpose is exercise','everyone must win','only experts may join','the match is historical'],'the purpose is exercise')
    ],
    matchWords:['好多','几乎','只','比赛','练习'],
    contexts:[
      ['我____年没打羽毛球了。','好多',['好多','主要','世界','一回']],
      ['我____忘了怎么打了。','几乎',['几乎','为了','受到','成绩']],
      ['不是____，打不好没关系。','比赛',['比赛','校园','啤酒','男生']],
      ['快球我接不____。','住',['住','好','多','会']],
      ['我先自己____吧，下周再跟你们一起打。','练练',['练练','得分','紧张','参加']]
    ],
    challenge:[
      q('b_ch_01','球太快了，我接不____。','Complete the potential complement.',['住','好','比赛','为了'],'住'),
      q('b_ch_02','慢一点儿的球，我已经接____住了。','Complete the positive form.',['得','不','只','几乎'],'得'),
      q('b_ch_03','哪一句是在问“能不能看清”？','Choose the question.',['你看得清看不清？','你看得很好吗？','你看了几回？','你越看越好吗？'],'你看得清看不清？'),
      q('b_ch_04','哪一句评价动作质量？','Choose the degree-complement sentence.',['她打得很好。','她接得住球。','她拿不动箱子。','她听不见。'],'她打得很好。'),
      q('b_ch_05','哪一句说明条件允许实现结果？','Choose the potential-complement sentence.',['这个箱子我拿得动。','这个箱子很漂亮。','我买了一个箱子。','箱子在门口。'],'这个箱子我拿得动。'),
      q('b_ch_06','初学者接不住球时，哪句最有帮助？','Choose the encouraging response.',['没关系，我们先练慢球。','你怎么什么都不会？','接不住就不要来了。','大家都在看你的错误。'],'没关系，我们先练慢球。'),
      q('b_ch_07','“打不好没关系”最适合哪个场景？','Choose the situation.',['朋友第一次参加非正式练习','正式公布比赛成绩','历史演讲介绍年份','归还校园卡'],'朋友第一次参加非正式练习'),
      q('b_ch_08','为了下周跟同学一起打，她准备怎么做？','Choose the plan.',['先自己练习','以后不运动','只看比赛','不再见同学'],'先自己练习'),
      q('b_ch_09','“听不见”表示什么？','Choose the meaning.',['unable to hear','hear very well','speak very quietly','listen many times'],'unable to hear'),
      q('b_ch_10','课堂前你要带来哪一组信息？','Choose the useful preparation.',['一个做得到的问题、一个做不到的问题和改进办法','所有奥运会年份','完整课文问答答案','一份比赛处罚表'],'一个做得到的问题、一个做不到的问题和改进办法')
    ]
  },
  {
    session:'C',title:'评论比赛并介绍体育人物',
    words:['啤酒','回','紧张','主要','受到','影响','得分','体育','世界','运动员','得到','成绩','奥运会','刘长春'],image:img('photo-text-4-speech'),
    introEn:'Learn to comment on a match, describe changing feelings with 越 A 越 B, and prepare a short introduction to a sports event or athlete. Historical facts stay limited to the textbook.',
    recognition:[
      q('c_rec_01','“今天怎么回事？”在问什么？','Choose the meaning.',['what is happening today','how many cards there are','where the campus is','who returned a book'],'what is happening today'),
      q('c_rec_02','哪个词表示“nervous”？','Choose the word.',['紧张','主要','成绩','世界'],'紧张'),
      q('c_rec_03','“受到影响”最接近哪个英文？','Choose the meaning.',['be affected','win a score','join a team','return a card'],'be affected'),
      q('c_rec_04','“运动员”是什么人？','Choose the meaning.',['an athlete','a librarian','a doctor','a teacher'],'an athlete'),
      q('c_rec_05','奥运会在本课属于哪一类词？','Choose the category.',['proper noun','measure word','adverb','potential complement'],'proper noun')
    ],
    matchWords:['紧张','影响','得分','体育','世界','运动员','成绩'],
    contexts:[
      ['新球员第一次参加重要比赛，太____了。','紧张',['紧张','练习','得到','只']],
      ['主要球员没参加，大家都受到____了。','影响',['影响','成绩','校园','网球']],
      ['我不看了，你们告诉我____吧。','得分',['得分','男生','卡','啤酒']],
      ['刘长春是一位中国____。','运动员',['运动员','运动会','世界','球场']],
      ['虽然没有得到好____，但是他让世界认识了中国。','成绩',['成绩','比赛','主要','好多']]
    ],
    challenge:[
      q('c_ch_01','比赛一直没有得分，我越看越____。','Complete the pattern.',['着急','校园','练习','参加'],'着急'),
      q('c_ch_02','哪一句说明两个状态一起变化？','Choose the sentence.',['球越快，我越紧张。','球场上有比赛。','他得到好成绩。','我拿一瓶饮料。'],'球越快，我越紧张。'),
      q('c_ch_03','“越来越热”表示什么？','Choose the meaning.',['continually becoming hotter','already very cold','unable to feel heat','the heat is a score'],'continually becoming hotter'),
      q('c_ch_04','主要球员没参加，谁也受到影响了？','Choose the answer.',['大家','只有观众','只有李文','没有人'],'大家'),
      q('c_ch_05','课文里第一位参加奥运会的中国运动员是谁？','Choose the person.',['刘长春','李文','陈天中','白家月'],'刘长春'),
      q('c_ch_06','教材说刘长春1932年参加了什么？','Choose the textbook fact.',['100米和200米短跑比赛','网球和羽毛球比赛','足球决赛','校园运动会'],'100米和200米短跑比赛'),
      q('c_ch_07','为什么演讲稿认为他值得介绍？','Choose the reason.',['他让世界认识了中国','他喝了饮料','他归还了校园卡','他教同学接球'],'他让世界认识了中国'),
      q('c_ch_08','介绍体育人物时，哪组信息最有用？','Choose the useful set.',['人物、项目、经历和影响','饮料、卡和冰箱','校园、图书馆和电话','好多、只和几乎'],'人物、项目、经历和影响'),
      q('c_ch_09','哪一句同时说明事实和更重要的意义？','Choose the sentence.',['虽然他没有得到好成绩，但是他让世界认识了中国。','他是运动员。','比赛开始了。','我去拿饮料。'],'虽然他没有得到好成绩，但是他让世界认识了中国。'),
      q('c_ch_10','最终分享需要整合什么？','Choose the project plan.',['运动目标、练习过程、感受或体育人物','完整背诵所有课文','上传强制录音','教材外的大量历史细节'],'运动目标、练习过程、感受或体育人物')
    ]
  }
];

function mission(spec, index) {
  const prefix = spec.session.toLowerCase();
  const vocabCards = spec.words.map(card);
  const pairs = spec.matchWords.map((hanzi, i) => ({id:prefix + '_pair_' + String(i + 1).padStart(2, '0'),word:hanzi,meaning:word(hanzi).english}));
  const contextQuestions = spec.contexts.map((item, i) => q(prefix + '_ctx_' + String(i + 1).padStart(2, '0'),item[0],'Choose the expression that completes the full context.',item[2],item[1]));
  return {
    id:'pm_hsk3_l09_' + prefix,session:spec.session,pilotMode:'ranked_vocab_preview_v1',
    title:'第' + (index + 1) + '次课课前热身赛',titleEn:spec.title,subtitleEn:'Five stages prepare you for the next classroom task.',
    scenario:spec.title,goals:[spec.title,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],
    storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:spec.introEn,
    stages:[
      {id:prefix + '1',title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先听、读并理解本次课的词语和必要背景。',screenPromptEn:spec.introEn,interactionType:'study_list',photos:[spec.image],keywordCards:vocabCards},
      {id:prefix + '2',title:'快速认词',titleEn:'Recognition',screenPrompt:'根据词义或情境选择答案。',screenPromptEn:'Choose the word or meaning that fits.',interactionType:'practice_quiz',questions:spec.recognition},
      {id:prefix + '3',title:'汉英配对',titleEn:'Chinese-English Match',screenPrompt:'把中文词语和英文意思配对。',screenPromptEn:'Match each Chinese card with its English meaning.',interactionType:'timed_match',pairs},
      {id:prefix + '4',title:'语境判断',titleEn:'Context Check',screenPrompt:'把词语放回完整语境。',screenPromptEn:'Choose the expression that completes each context.',interactionType:'practice_quiz',questions:contextQuestions},
      {id:prefix + '5',title:'正式挑战',titleEn:'Scored Challenge',screenPrompt:'独立完成10题正式挑战。',screenPromptEn:'Complete the 10-question scored challenge.',interactionType:'ranked_quiz',questions:spec.challenge}
    ],
    reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],
    persistenceKeyPattern:'ClassReadyPreview_HSK3-L09_' + spec.session + '_{student}_v1',
    completionMessageEn:'Preview complete. Bring one useful sentence to class.'
  };
}

const fills = [
  {id:'l09_fill_group_01',type:'vocab_fill_group',stage:'in_class',contentRole:'lesson',prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:['校园','球场','为了','运动会','参加'],wordBank_pinyin:['xiàoyuán','qiúchǎng','wèile','yùndònghuì','cānjiā'],sentences:[
    {sentence:'新学期开学以后，她还不熟悉____，下课常常找不到图书馆。',answer:'校园'},
    {sentence:'外面下雨以后，网球____有点儿湿，今天可能不能练习。',answer:'球场'},
    {sentence:'____下个月的学校比赛，我们小组从这周开始每天下午练球。',answer:'为了'},
    {sentence:'学校下周要开____，每个班都在讨论想报名的项目。',answer:'运动会'},
    {sentence:'我还没有决定____哪个项目，想先了解网球和跑步比赛。',answer:'参加'}
  ],speakingOutput:{support:'任选两个词完成一句话。',core:'用三个词说明一个运动会计划。',stretch:'用五个词完成30秒目的与行动说明。'}}},
  {id:'l09_fill_group_02',type:'vocab_fill_group',stage:'in_class',contentRole:'transfer',prompt_en:'Use the complete context to choose the best word.',data:{wordBank:['练习','好多','几乎','紧张','影响'],wordBank_pinyin:['liànxí','hǎoduō','jīhū','jǐnzhāng','yǐngxiǎng'],sentences:[
    {sentence:'她每天先做十分钟基本____，然后才开始跟同学打完整的一局。',answer:'练习'},
    {sentence:'活动第一次开放报名，就有____学生选择了羽毛球和网球项目。',answer:'好多'},
    {sentence:'我太久没游泳了，____忘了换气的时候应该怎样配合动作。',answer:'几乎'},
    {sentence:'他第一次在全班面前介绍比赛，开始时有点儿____，后来越说越自然。',answer:'紧张'},
    {sentence:'主要队员不能参加，让整个小组的计划和信心都受到了____。',answer:'影响'}
  ],speakingOutput:{support:'选一个词完成句框。',core:'用两个词说明一次练习困难。',stretch:'用四个词解释困难、原因和改进办法。'}}},
  {id:'l09_fill_group_03',type:'vocab_fill_group',stage:'in_class',contentRole:'review',prompt_en:'Review L08 health and exercise language in a new sports context.',data:{wordBank:['健康','习惯','体育馆','坚持下去','合适'],wordBank_pinyin:['jiànkāng','xíguàn','tǐyùguǎn','jiānchí xiàqu','héshì'],sentences:[
    {sentence:'为了保持____，他没有每天练很久，而是认真安排运动和休息时间。',answer:'健康'},
    {sentence:'每周三次下课后练球已经成了我们小组共同的____。',answer:'习惯'},
    {sentence:'天气太冷的时候，老师会把训练改到学校____里进行。',answer:'体育馆'},
    {sentence:'刚开始接不住球也没关系，只要找到方法就能慢慢____。',answer:'坚持下去'},
    {sentence:'这双鞋大小____，跑步时也很舒服，我准备穿它参加运动会。',answer:'合适'}
  ],speakingOutput:{support:'复习一个旧词并造句。',core:'用两个旧词连接健康和运动。',stretch:'比较两种练习安排并说明哪一种更合适。'}}}
];

const matchGroups = [
  {id:'l09_match_01',type:'word_match',stage:'in_class',contentRole:'lesson',prompt_en:'Match each complete question with its most natural answer.',data:{pairs:[
    {left:'你为什么最近每天放学以后都去球场练球？',right:'为了准备下个月的运动会，我想把发球练得更稳定。'},
    {left:'你打算参加运动会里的哪一个比赛项目？',right:'我想参加网球比赛，所以最近一直在认真练习。'},
    {left:'白家月好多年没打羽毛球，最担心的是什么？',right:'她怕跟好多同学一起打时总是接不住球，会不好意思。'},
    {left:'如果快球现在还接不住，你准备怎样改进？',right:'我先跟一个同学练慢球，接得住以后再慢慢加快。'},
    {left:'看足球比赛时，你的心情为什么越来越紧张？',right:'因为球队一直踢不进去，主要球员也没有参加比赛。'}
  ]}},
  {id:'l09_match_02',type:'word_match',stage:'in_class',contentRole:'transfer',prompt_en:'Match each situation with the response that solves the communication problem.',data:{pairs:[
    {left:'同学第一次参加接力赛，担心自己跑得不够快。',right:'告诉他打不好没关系，先跟大家一起把交接动作练清楚。'},
    {left:'教室后面听不清活动说明，你需要确认任务。',right:'我听不见老师说的最后一句，可以请您再说一次吗？'},
    {left:'小组想提高比赛表现，却没有清楚的练习目的。',right:'先确定想解决的问题，再用“为了”说明每项训练的目标。'},
    {left:'队友第一次在很多观众面前比赛，表现受到紧张影响。',right:'先让他放松，并提醒他按平时练习的方法完成动作。'},
    {left:'朋友想介绍一位运动员，却只准备了比赛成绩。',right:'还可以介绍项目、经历、努力和对别人产生的影响。'}
  ]}},
  {id:'l09_match_03',type:'word_match',stage:'in_class',contentRole:'review',prompt_en:'Match the L08 review question with the answer that connects to this lesson.',data:{pairs:[
    {left:'怎样把每周练球的健康习惯继续保持下去？',right:'选择合适的时间，每次练习以后也要注意休息。'},
    {left:'同学游完泳以后耳朵不舒服，你会怎样关心他？',right:'先问他感觉怎么样，如果还不舒服就请医生检查。'},
    {left:'为什么运动计划不能只写“每天练得越多越好”？',right:'运动和休息都重要，要选择适合自己的练习时间和强度。'},
    {left:'朋友的腿刚恢复，他能马上参加重要比赛吗？',right:'应该先根据专业建议判断什么做得到，再慢慢恢复练习。'},
    {left:'出院以后想重新运动，第一步应该怎么安排？',right:'先用合适的方法恢复身体，再决定何时回到球场。'}
  ]}}
];

const orders = [
  ['l09_order_01','为了准备运动会，我们每天都在球场练球。',['为了准备运动会','我们每天','都在球场','练球'],'lesson'],
  ['l09_order_02','这么快的球我现在还接不住。',['这么快的球','我现在','还','接不住'],'lesson'],
  ['l09_order_03','这场足球比赛我越看越着急。',['这场足球比赛','我','越看','越着急'],'lesson'],
  ['l09_order_04','为了听得更清楚，他坐到了前面。',['为了听得更清楚','他','坐到了','前面'],'transfer'],
  ['l09_order_05','下课以后我们把这个健康习惯坚持下去。',['下课以后','我们把','这个健康习惯','坚持下去'],'review']
].map(item => ({id:item[0],type:'ordering',stage:'in_class',contentRole:item[3],prompt_cn:'把语块排成一个完整、自然的句子。',prompt_en:'Put the chunks in order to make a complete sentence.',correct_answer:item[1],data:{chunks:item[2],chunks_pinyin:item[2].map(() => '')}}));

const sceneRows = [
  ['At the library entrance, a student returns a campus card he forgot yesterday.','Apologise and name the object.','对不起，我昨天忘了还你的校园卡。','lesson'],
  ['Several students practise on the sports field every afternoon before the school sports meet.','Use 为了 to connect the goal and action.','为了准备运动会，他们每天下午都在球场练球。','lesson'],
  ['A beginner worries because many classmates are playing badminton together.','Give an encouraging response.','不是比赛，打不好没关系。','lesson'],
  ['A beginner can return a slow shuttlecock but cannot return a fast one.','Use both positive and negative potential complements.','慢球她接得住，快球她还接不住。','lesson'],
  ['Friends watch a football match, but the team still has not scored.','Describe the viewer’s changing feeling.','比赛一直没有得分，她越看越着急。','lesson'],
  ['A learner cannot hear the instructions from the back of a noisy hall.','Ask politely to hear the instruction again.','我听不见最后一句，请您再说一次。','transfer'],
  ['A runner wants to finish five kilometres next month and starts a weekly plan.','State the goal and action.','为了跑完五公里，他每周按计划练习。','transfer'],
  ['A new player becomes calmer after several practice matches.','Use 越 A 越 B.','他越练越放松，动作也越来越自然。','transfer'],
  ['A student continues the exercise routine built in L08.','Review 坚持下去.','我想把每周运动三次的健康习惯坚持下去。','review'],
  ['After recovering, a student chooses a suitable light exercise schedule.','Review 合适 and 以后.','身体恢复以后，我会选择更合适的运动安排。','review']
];
const sceneChoices = sceneRows.map((item,index) => {
  const distractors = ['图书馆里有好多啤酒和饮料。','他参加比赛是为了忘记自己的目标。','运动会以后校园卡越来越紧张。'];
  const shift = index % 4;
  const options = distractors.slice();
  options.splice(shift,0,item[2]);
  return {id:'l09_scene_' + String(index + 1).padStart(2,'0'),type:'scene_sentence_choice',stage:'in_class',contentRole:item[3],prompt_en:'Choose the best sentence for the scene.',data:{scene_en:item[0],clue_en:item[1],options,correct_index:shift},correct_answer:item[2]};
});

const guessRows = [
  ['校园卡','学生在学校进门、借书或使用校园服务时可能需要的一张卡。'],
  ['运动会','学校里有跑步、跳远和球类等项目，很多学生参加的体育活动。'],
  ['球场','人们打网球、篮球或踢足球时使用的场地。'],
  ['练习','为了把动作做得更好，一次又一次地做同一件事。'],
  ['紧张','第一次参加重要比赛时，心里不放松、动作可能受到影响的感觉。'],
  ['得分','比赛中成功完成目标以后，队伍或个人得到比赛分数。'],
  ['运动员','把运动当作训练和比赛项目，并代表自己或团队参加赛事的人。'],
  ['成绩','比赛或学习结束以后得到的结果，可以好，也可以不太理想。'],
  ['体育馆','L08中学校里可以在室内跑步、打球和锻炼身体的地方。'],
  ['坚持下去','L08中表示已经开始做一件事，以后继续做，不停下来。']
];
const guessDistractors = ['啤酒','世界','男生'];
const guesses = guessRows.map((item,index,all) => {
  const shift = index % 4;
  const options = guessDistractors.slice();
  options.splice(shift,0,item[0]);
  return {id:'l09_desc_' + String(index + 1).padStart(2,'0'),type:'description_guess',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'读完整提示，联系语境猜词。',prompt_en:'Read the full clue and guess the word.',data:{description:item[1],options,correct_index:shift},correct_answer:item[0]};
});

const sayRows = [
  ['运动会',['学校','项目','参加']],['为了',['目的','行动','准备']],['练习',['重复','提高','动作']],['接不住',['球太快','不能做到','结果']],
  ['越看越着急',['比赛','心情变化','没有得分']],['运动员',['体育','训练','比赛']],['体育馆',['L08','室内','运动']],['坚持下去',['L08','继续','习惯']]
];
const sayGuess = sayRows.map((item,index,all) => ({id:'l09_say_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:item[0],boardIndex:index + 1,clues:[],scaffold:{words:item[1],frames:['这是一个……。','人们用它 / 在这里……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));

const blindRows = [
  [['为了','练习'],'为了参加网球比赛，我最近每天都练习发球。'],
  [['接不住','没关系'],'现在接不住快球没关系，我们先从慢球开始。'],
  [['越看','越紧张'],'这场比赛一直没有得分，我越看越紧张。'],
  [['健康','坚持下去'],'为了保持健康，我想把每周运动三次的习惯坚持下去。']
];
const blind = blindRows.map((item,index,all) => ({id:'l09_blind_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:item[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:item[1]}}));

const pictureRows = [
  ['photo-text-1-campus-card','校园卡、忘了还'],['photo-text-1-sports-field','为了、运动会'],['photo-text-2-invitation','好多、几乎'],['photo-text-2-practice','接得住 / 接不住'],
  ['photo-text-3-watch-match','越看越着急'],['photo-text-3-match-pressure','紧张、受到影响'],['photo-text-4-speech','体育、奥运会'],['photo-text-4-historical-runner','运动员、成绩']
];
const pictureComplete = pictureRows.map((item,index,all) => ({id:'l09_pic_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the target expressions to write one complete sentence about the photo.',data:{image:img(item[0]),keyword:item[1],task:'观察图片，用关键词写一个完整、自然的句子。',answerPlaceholder:'写一个完整的中文句子。'}}));

const readRows = [
  ['运动会准备卡','学校下个月开运动会。安娜想参加网球比赛。为了能打完一场比赛，她每周练习三次，也请有经验的同学帮助她。她现在发球还不太稳定，但是已经能接住大部分慢球。','安娜为什么每周练习三次？','为了能打完一场网球比赛。','lesson'],
  ['第一次跟大家打球','马丁好多年没打羽毛球了，开始时几乎每个快球都接不住。他的同学没有笑他，而是先陪他练慢球。练了半个小时以后，他已经能连续接住三个球了。','同学怎样帮助马丁？','先陪他练慢球。','lesson'],
  ['越跑越有信心','丽莎报名参加五公里校园跑。第一次练习时，她跑一公里就很累。后来她选择合适的速度，每周跑三次。现在她越跑越轻松，也越来越有信心。','丽莎为什么越来越有信心？','因为她按合适的速度坚持练习，越跑越轻松。','transfer'],
  ['介绍体育人物','小组要做一次体育人物分享。大家决定不只介绍比赛成绩，还介绍人物参加了什么项目、遇到什么困难、怎样努力，以及对别人有什么影响。','小组准备从哪些方面介绍人物？','项目、困难、努力、成绩和影响。','transfer'],
  ['恢复后的运动计划','陈天中出院以后想继续运动。他没有马上参加比赛，而是先问清楚哪些运动适合自己，并把运动和休息安排好。他希望把健康习惯坚持下去。','陈天中为什么没有马上参加比赛？','因为他先要选择适合自己的运动并安排恢复。','review']
];
const readPassages = readRows.map((item,index) => ({id:'l09_read_' + String(index + 1).padStart(2,'0'),type:'passage_reading',stage:'in_class',contentRole:item[4],prompt_cn:'阅读小篇章，回答问题。',prompt_en:'Read and answer.',data:{title:item[0],passage:item[1],questions:[{question_cn:item[2],answer:item[3]}]}}));
const independent = readRows.map((item,index) => {
  const distractors = [
    ['为了每天喝一瓶饮料。','因为她忘了还校园卡。','为了马上得到世界冠军。'],
    ['让他一个人练快球。','告诉他不要再运动。','请他只看比赛。'],
    ['因为她每天改变比赛项目。','因为她从来不休息。','因为别人替她跑完全程。'],
    ['只介绍人物的饮料。','只介绍比赛地点。','只介绍人物的名字。'],
    ['因为他再也不喜欢运动。','因为体育馆已经关门。','因为他要准备买裙子。']
  ][index];
  const shift = (index + 1) % 4;
  const options = distractors.slice();
  options.splice(shift,0,item[3]);
  return {id:'l09_ind_read_' + String(index + 1).padStart(2,'0'),type:'choice',stage:'in_class',contentRole:item[4],prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:item[0],passage:item[1],question_cn:item[2],options,correct_index:shift},correct_answer:item[3]};
});

const paragraphRows = [
  ['准备校园运动会',['学校下个月要开运动会。','____1____','她先给自己定了每周三次的练习计划。','____2____','虽然现在发球还不稳定，她并不着急。','____3____'],
    ['白家月想参加网球比赛。','为了能打完比赛，她每天都不休息。','为了参加比赛，她最近一直在练习。'],
    ['她每次练习以后都会记录做得到和做不到的动作。','她每次练习以后都把校园卡放进冰箱。','她不知道自己为什么来到球场。'],
    ['她相信只要坚持练习，就会越打越好。','她决定从现在开始不再拿球拍。','她只想让别人替她参加比赛。'],'lesson'],
  ['初学者加入练习',['马丁好多年没打羽毛球了。','____1____','第一次来到球场，他连慢球也常常接不住。','____2____','练了一会儿以后，他已经能接住几个慢球。','____3____'],
    ['他几乎忘了怎么打。','他每天都代表国家参加比赛。','他已经得到世界最好成绩。'],
    ['同学告诉他打不好没关系，并陪他从慢球开始。','同学要求他马上参加正式决赛。','大家只告诉他最后得分。'],
    ['他决定下周再来，继续跟大家一起练。','他觉得练习没有任何作用。','他准备把球场改成图书馆。'],'lesson'],
  ['比赛中的紧张',['重要比赛已经开始了。','____1____','几个新球员第一次在很多观众面前比赛。','____2____','球队连续几次都没有踢进去。','____3____'],
    ['主要球员因为生病没有参加。','主要球员正在图书馆还卡。','所有观众都离开了世界。'],
    ['他们越想马上得分，动作越紧张。','他们越喝饮料，校园越大。','他们越休息，比赛越早结束。'],
    ['教练让大家先放松，再按平时练习的办法配合。','教练让大家忘记所有动作。','教练只问观众喝什么。'],'transfer'],
  ['体育人物分享',['小组准备介绍一位体育人物。','____1____','然后，他们整理人物参加的项目和重要经历。','____2____','最后，每个人都要说明自己为什么选择这个人物。','____3____'],
    ['他们先确认教材或可靠资料里的基本事实。','他们先写一个没有来源的比赛结果。','他们只准备一张没有人物的校园照片。'],
    ['除了成绩，他们也关注人物的努力和影响。','除了啤酒，他们不谈任何体育内容。','他们认为年份越多越能代替人物故事。'],
    ['这样，分享既有清楚信息，也有自己的评价。','这样，听众只需要猜人物的名字。','这样，所有人都不需要开口。'],'transfer'],
  ['恢复以后再运动',['陈天中的身体已经慢慢恢复。','____1____','他先选择轻一点儿、适合自己的运动。','____2____','朋友也提醒他练习以后要注意休息。','____3____'],
    ['出院以后，他想重新建立健康习惯。','出院以后，他决定每天参加三场比赛。','出院以前，他已经跑完世界。'],
    ['他把运动时间写进每周计划，准备坚持下去。','他把所有药和球拍放在球场。','他越休息越不知道校园在哪里。'],
    ['他希望慢慢回到以前健康、稳定的生活。','他希望主要球员替他完成所有运动。','他希望不问专业人员就改变恢复安排。'],'review']
];
const paragraphOptionOrders = [[3,0,4,1,5,2],[1,3,5,0,4,2],[4,2,0,5,1,3],[2,4,0,3,1,5],[5,1,3,2,0,4]];
const paragraphs = paragraphRows.map((item,index) => {
  const sourceOptions = [item[2][0],item[2][1],item[3][0],item[3][1],item[4][0],item[4][1]];
  const correctSourceIndexes = [0,2,4];
  const order = paragraphOptionOrders[index];
  return {id:'l09_para_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:item[5],prompt_cn:'段落填空。',prompt_en:'Choose three sentences to complete the paragraph.',openEnded:true,needsTeacherReview:true,data:{title:item[0],passageParts:item[1],options:order.map(i => sourceOptions[i]),answers:correctSourceIndexes.map(i => order.indexOf(i)),instructions:'点击句子，再点击对应空格。三个空位依次使用绿、蓝、橙三色。',optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange'],answerPlaceholder:''}};
});

const chainRows = [
  ['校园运动会报名','学校下个月要开运动会',['参加','为了','练习','接得住','比赛'],['cānjiā','wèile','liànxí','jiē de zhù','bǐsài']],
  ['第一次跟大家打球','白家月好多年没打羽毛球了',['几乎','邀请','接不住','没关系','一起练'],['jīhū','yāoqǐng','jiē bu zhù','méi guānxi','yìqǐ liàn']],
  ['一场紧张的足球赛','重要的足球比赛已经开始了',['主要','紧张','影响','踢不进去','得分'],['zhǔyào','jǐnzhāng','yǐngxiǎng','tī bu jìnqu','défēn']],
  ['我的体育人物分享','小组决定介绍一位体育人物',['运动员','项目','成绩','影响','世界'],['yùndòngyuán','xiàngmù','chéngjì','yǐngxiǎng','shìjiè']],
  ['把健康习惯坚持下去','陈天中身体恢复以后',['合适','体育馆','习惯','为了','坚持下去'],['héshì','tǐyùguǎn','xíguàn','wèile','jiānchí xiàqu']]
];
const chains = chainRows.map((item,index,all) => ({id:'l09_chain_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'五词故事接龙。',prompt_en:'Build one story with five covered words.',openEnded:true,needsTeacherReview:true,data:{title:item[0],starter:item[1],steps:item[2].map((_,k) => `第${k+1}句：使用“${item[2][k]}”继续故事。`),keywords:item[2],keywords_pinyin:item[3],chainModes:['teacher','race','team'],instructions:'五个词先全部盖住，每次打开一个词并接一句，最后形成完整故事。',answerPlaceholder:'用当前打开的词继续故事。'}}));

const taskRows = [
  ['运动会准备采访','采访同伴想参加或了解的运动项目。',['运动会','参加','为了','练习'],['你选择什么项目？','为什么选择？','准备怎样练？'],'每人说3—4句话。'],
  ['初学者鼓励对话','一人是初学者，一人提供鼓励和练习办法。',['打不好没关系','接得住','接不住'],['说明一个困难。','问能不能做到。','提出分步练习办法。'],'完成4轮自然对话。'],
  ['比赛现场评论','根据比赛情况分析紧张和人员变化的影响。',['主要','紧张','受到影响','越A越B'],['发生了什么？','为什么踢不进去？','观众心情怎样变化？'],'小组给出30秒评论。'],
  ['体育人物一分钟介绍','用清楚顺序介绍一位体育人物。',['运动员','项目','成绩','影响'],['介绍是谁。','说明项目或经历。','解释为什么值得介绍。'],'每人至少表达一部分。'],
  ['健康运动计划复盘','把 L08 的健康习惯与本课运动目标连接起来。',['健康','合适','坚持下去','为了'],['旧习惯是什么？','新目标是什么？','如何安全地坚持？'],'完成一个不涉及医学诊断的计划。']
];
const taskCards = taskRows.map((item,index,all) => ({id:'l09_task_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'任务卡：' + item[0] + '。',prompt_en:item[0],openEnded:true,needsTeacherReview:true,data:{title:item[0],titleEn:item[0],role:item[1],steps:item[3],keywords:item[2],output:item[4],answerPlaceholder:'请写下课堂表达。'}}));

const battleGames = {
  roulette:[
    {id:'l09_r_01',challenge:'说明一个运动目标和准备行动。',scene:'学校下个月开运动会。',keywords:['为了','参加','练习'],sample:'为了参加网球比赛，我准备每周练习三次。'},
    {id:'l09_r_02',challenge:'鼓励接不住球的初学者。',scene:'同学很久没打羽毛球，担心跟不上大家。',keywords:['接不住','没关系','一起练'],sample:'现在接不住快球没关系，我们先一起练慢球。'},
    {id:'l09_r_03',challenge:'评论紧张对比赛的影响。',scene:'主要球员没参加，新球员第一次上场。',keywords:['主要','紧张','受到影响'],sample:'新球员太紧张，大家的配合也受到了影响。'},
    {id:'l09_r_04',challenge:'解释一位体育人物为什么值得介绍。',scene:'准备一分钟体育人物分享。',keywords:['运动员','成绩','影响'],sample:'除了成绩，我还想介绍这位运动员的努力和影响。'}
  ],
  relay:[
    {id:'l09_relay_01',starter:'运动会',goal:'接一个“为了”目的句。',mustUse:['为了','练习']},
    {id:'l09_relay_02',starter:'羽毛球',goal:'接一个可能补语正句或反句。',mustUse:['接得住','接不住']},
    {id:'l09_relay_03',starter:'足球比赛',goal:'接一个“越A越B”句。',mustUse:['越看','越紧张']},
    {id:'l09_relay_04',starter:'健康习惯',goal:'接一个 L08 复习句。',mustUse:['合适','坚持下去']}
  ],
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：yùndònghuì',answer:'运动会'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：jǐnzhāng',answer:'紧张'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：yùndòngyuán',answer:'运动员'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“参加”说一个短语。',answer:'参加比赛 / 参加运动会'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“影响”说一个短语。',answer:'受到影响 / 影响很大'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“成绩”说一个短语。',answer:'比赛成绩 / 好成绩'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“接不住”表示什么？',options:['不能实现接住或回球的结果','接得非常好','不喜欢球场'],answer:'不能实现接住或回球的结果'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“越练越自然”表示什么？',options:['随着练习增加，动作更自然','练习已经停止','动作不能完成'],answer:'随着练习增加，动作更自然'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“为了……，……”说一句话。',answer:'为了参加运动会，我每周练习三次。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“听得见 / 听不见”说一句话。',answer:'前面听得见，教室最后面听不见。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“越A越B”说一句话。',answer:'这个动作我越练越熟。'}
  ]}
};

const homework = {
  mode:'hsk3_session_tasks',
  instructions:{
    required:'完成“我的运动会准备与体育分享”的当次准备卡；A和B保存的材料必须用于C。',
    optional:'不需要上传录音；课堂展示可以使用自己拍摄或合法使用的图片。',
    aiPolicy:'先独立选择运动、整理经历和写出自己的句子，再使用工具检查语言。'
  },
  sessionMeta:{
    A:{label:'我的运动会准备 · 第1步',goal:'选择一个想参加或了解的运动项目，说明目的和准备计划。',suggested_minutes:'10-15分钟',suggested_mix:'完成项目与目的卡；保存图片和计划，供B、C继续使用。'},
    B:{label:'我的运动会准备 · 第2步',goal:'记录练习中做得到或做不到的问题、原因和改进办法。',suggested_minutes:'10-15分钟',suggested_mix:'在A的项目卡上增加练习记录和可能补语。'},
    C:{label:'课堂最终项目 · 我的运动会准备与体育分享',goal:'整合A/B，完成1—2分钟课堂分享。',suggested_minutes:'15-20分钟',suggested_mix:'不强制上传录音；可小组彩排，但每位学生都要说。'}
  },
  sessions:{
    A:[
      {id:'post_l09_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'体育分享 1/3 · 选择项目',required:true,prompt_cn:'你想参加或了解哪一个运动项目？为什么选择它？',prompt_en:'Choose one sport you want to join or learn about. Why did you choose it?',answerPlaceholder:'我想参加 / 了解……，因为……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l09_a_plan',type:'project_card',taskLabel:'运动项目与目的卡',projectStage:'体育分享 1/3 · 保存到最终展示',required:true,prompt_cn:'准备一张图片，说明运动项目、参加或了解的目的，以及为了这个目标准备做什么。',prompt_en:'Prepare one image. Name the sport, explain your purpose, and describe the actions you will take to reach the goal.',answerPlaceholder:'项目：……。我想……。为了……，我准备……。',needsTeacherReview:true,openEnded:true,wordBank:['校园','球场','为了','运动会','参加','网球','比赛','练习'],picturePrompts:['想参加或了解的运动项目','练习地点或需要的物品','一项具体准备行动'],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框写4句话：项目、目的、时间和一个准备行动。'},
        {label:'标准层 / Core',instruction:'独立说明选择理由，并用“为了……，……”连接目标和至少两项行动。'},
        {label:'挑战层 / Challenge',instruction:'比较两个项目或两种准备办法，解释为什么选择现在的计划。'}
      ]},
      {id:'post_l09_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Sport and Purpose Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Sport and Purpose Card',prompt_en:'Prepare your sport image, purpose and practice plan.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring one clear image of the sport, practice place or equipment.',
        'Be ready to answer: What sport did you choose? Why? What will you do to prepare?',
        'Use at least four expressions from 校园, 球场, 为了, 运动会, 参加, 网球, 比赛 and 练习.',
        'Use 为了……，…… at least once. You may discuss ideas with a partner; no audio upload is required.'
      ],classroomNote:'Keep this card. You will add a practice problem and solution in Homework B.'}
    ],
    B:[
      {id:'post_l09_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'体育分享 2/3 · 发现练习问题',required:true,prompt_cn:'练习这项运动时，什么已经做得到？什么还做不到？',prompt_en:'During practice, what can you already do, and what can you not do yet?',answerPlaceholder:'我已经……得……，但是我还……不……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l09_b_plan',type:'project_card',taskLabel:'练习问题与改进卡',projectStage:'体育分享 2/3 · 保存困难和办法',required:true,prompt_cn:'在A的项目卡上增加一个做得到的动作、一个做不到的动作、原因和改进办法。',prompt_en:'Add one action you can do, one you cannot do yet, the reason, and a practical improvement plan to your Homework A card.',answerPlaceholder:'现在我……得……，但是……不……，因为……。为了改进，我准备……。',needsTeacherReview:true,openEnded:true,wordBank:['好多','几乎','练习','接得住','接不住','打不好没关系','为了'],picturePrompts:['练习中的一个动作','当前困难','分步练习或同伴帮助'],carryFrom:[{session:'A',taskId:'post_l09_a_plan',label:'A · 运动项目与目的卡'}],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框写4—5句话，至少使用一个“V得C”和一个“V不C”。'},
        {label:'标准层 / Core',instruction:'说明做得到、做不到、原因和一个分步改进办法。'},
        {label:'挑战层 / Challenge',instruction:'比较练习前后的变化，并解释哪一种办法更有效。'}
      ]},
      {id:'post_l09_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Practice Problem and Improvement Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Practice Problem and Improvement',prompt_en:'Prepare your can / cannot examples and improvement plan.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring your Homework A card and one image or simple sketch of a practice problem.',
        'Be ready to answer: What can you do? What can you not do yet? Why? How will you improve?',
        'Use one positive and one negative potential complement, such as 接得住 / 接不住, 踢得进去 / 踢不进去, or 听得见 / 听不见.',
        'Use encouraging language. Partners may help each other rehearse; no audio upload is required.'
      ],classroomNote:'Save the problem and improvement plan. You will combine it with Homework A in the final presentation.'}
    ],
    C:[
      {id:'post_l09_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'体育分享 3/3 · 组织展示',required:true,prompt_cn:'你的听众需要知道哪些信息，才能理解运动目标、练习过程和你的感受或人物选择？',prompt_en:'What does your audience need in order to understand your goal, practice process, feelings or chosen sports figure?',answerPlaceholder:'听众需要知道项目、目的、练习困难、改进办法和……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l09_c_final',type:'portfolio_final',taskLabel:'最终展示稿',projectStage:'课堂大作业 · 我的运动会准备与体育分享',required:true,prompt_cn:'整合A的项目与目的卡和B的练习问题与改进卡，准备1—2分钟课堂分享。你也可以加入比赛感受或一位体育人物。',prompt_en:'Combine your Sport and Purpose Card from A with your Practice Problem and Improvement Card from B. Prepare a 1–2 minute class presentation and optionally add match feelings or a sports figure.',answerPlaceholder:'我选择……。为了……，我……。现在我……得……，但是……不……。我越……越……。我还想介绍……，因为……。',needsTeacherReview:true,openEnded:true,wordBank:['为了','参加','练习','比赛','紧张','影响','运动员','成绩','接得住','接不住','越A越B'],picturePrompts:['运动项目和目标','练习过程与困难','改进办法','比赛感受或体育人物'],carryFrom:[
        {session:'A',taskId:'post_l09_a_plan',label:'A · 运动项目与目的卡'},
        {session:'B',taskId:'post_l09_b_plan',label:'B · 练习问题与改进卡'}
      ],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框完成6—7句话，清楚说明目标、一个困难和改进办法。'},
        {label:'标准层 / Core',instruction:'独立组织1—2分钟分享，加入比赛感受或体育人物信息。'},
        {label:'挑战层 / Challenge',instruction:'比较练习前后变化，解释体育人物或经历带来的影响，并自然使用三项本课结构。'}
      ]},
      {id:'post_l09_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · My Sports Meet Preparation and Sports Share',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Sports Meet Preparation and Sports Share',prompt_en:'Present your sports project mainly in class.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring one to three images plus your Sport and Purpose Card from A and Practice Problem and Improvement Card from B.',
        'Answer: What sport did you choose? Why? How did you practise? What could or could not you do? How did you improve? What did you feel or learn?',
        'Use at least six lesson words and at least two lesson structures: 为了……，……, a potential complement, or 越 A 越 B.',
        'If you introduce a sports figure, separate textbook facts from any checked teaching extension and explain why the person is worth introducing.',
        'Speak for 1–2 minutes. You may rehearse in pairs or small groups, but every student must speak. Audio upload is not required.'
      ],classroomNote:'Use the saved work from A and B. Mistakes and weak points stay collapsed until you choose to review them.'}
    ]
  }
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{
    level:'HSK3',lessonId:'L09',lessonKey:'HSK3-L09',title:'打不好没关系',titleEn:"It doesn't matter if you don't play well",
    topic:'校园运动会、初学者练习、比赛情绪和体育人物分享',
    courseModel:'三次课：说明运动目标与准备 → 表达做得到或做不到并改进 → 评论比赛并完成体育分享',
    sourceTextPolicy:'四篇教材中文和拼音逐行保留；课文二“数学”依据同一行拼音 tóngxué 和英文 classmates 校订为“同学”；课文四使用演讲稿叙事布局；英文译文、文化说明、练习和任务属于教学扩展。',
    editorialNotes:[{textId:'t_hsk3_l09_02',status:'confirmed_correction',source:'这么多数学一起打',formal:'这么多同学一起打',evidence:'同一行拼音为 tóngxué，英文为 classmates。'}]
  },
  pedagogy:{
    exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},
    speakingParticipation:'主观任务提供基础、标准、挑战三档支架；体育话题保持鼓励性，每位组员都要表达。',
    historicalFactPolicy:'刘长春、1932年、100米和200米短跑等内容只使用教材事实；教学扩展须单独标记并核实。'
  },
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：说明运动会目标和准备计划',textIds:['t_hsk3_l09_01'],previewMissionId:'pm_hsk3_l09_a',focus:['归还校园卡','运动会和参加项目','为了……，……','项目与目的卡']},
    {id:'B',title:'第二次课：邀请同伴并表达能不能做到',textIds:['t_hsk3_l09_02'],previewMissionId:'pm_hsk3_l09_b',focus:['邀请同伴运动','接得住与接不住','可能补语与程度补语对比','练习问题与改进卡']},
    {id:'C',title:'第三次课：评论比赛并介绍体育人物',textIds:['t_hsk3_l09_03','t_hsk3_l09_04'],previewMissionId:'pm_hsk3_l09_c',focus:['比赛表现和情绪','越A越B','体育人物值得介绍的原因','1—2分钟体育分享']}
  ],
  vocabScenes:sceneData,
  vocabulary,
  grammar,
  texts,
  grammarTeachingNotes,
  textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(item => [item.id,{session:item.tags[0],phrases:item.phrases,sourceType:item.sourceType}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{
    mode:'preview_mission',missionId:'pm_hsk3_l09_a',
    vocabularyIds:vocabulary.map(item => item.id),
    grammarIds:grammar.map(item => item.id),
    progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L09-v1'},
    reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],
    readingData:[{id:'pre_l09_read',title:'我的运动会准备与体育分享',text:'为了参加运动会，我先做准备计划。练习时，我会记录什么做得到、什么做不到。最后，我会在课堂上分享目标、练习过程和感受。'}]
  },
  inClass:{questionGroups:{
    v5_vocab_fill:fills,
    g1_ordering:orders,
    r2_passage_choice:readPassages,
    t2_task_card:taskCards,
    battleGames,
    scene_sentence_choice:sceneChoices,
    v7_word_match:matchGroups,
    v6_description_guess:guesses,
    v2_say_guess:sayGuess,
    v3_blind_box:blind,
    g2_picture_complete:pictureComplete,
    r3_independent_reading:independent,
    r4_paragraph_fill:paragraphs,
    t3_chain_sentence:chains,
    info_match:[
      {id:'l09_info_01',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each person with the information.',data:{people:['李文','白家月','陈天中','刘长春'],clues:['归还校园卡并邀请同学运动','想参加网球比赛并担心接不住球','一起看足球比赛并解释球员紧张','教材中的第一位参加奥运会的中国运动员'],answer:['李文-归还校园卡并邀请同学运动','白家月-想参加网球比赛并担心接不住球','陈天中-一起看足球比赛并解释球员紧张','刘长春-教材中的第一位参加奥运会的中国运动员']}},
      {id:'l09_info_02',type:'info_match',stage:'in_class',prompt_cn:'结构匹配。',prompt_en:'Match each structure with its communicative job.',data:{people:['为了……，……','V得C','V不C','越A越B'],clues:['说明目的和行动','说明能够实现结果','说明不能实现结果','说明两个方面一起变化'],answer:['为了……，……-说明目的和行动','V得C-说明能够实现结果','V不C-说明不能实现结果','越A越B-说明两个方面一起变化']}}
    ],
    pk_question:[
      ['为了____运动会，他们每天都练球。','准备',['准备','得分','世界','啤酒']],
      ['这个慢球我接____住。','得',['得','不','越','只']],
      ['这场比赛我越看越____。','着急',['着急','校园','卡','参加']]
    ].map((item,index) => ({id:'l09_pk_' + String(index + 1).padStart(2,'0'),type:'choice',prompt_cn:item[0],prompt_en:'Choose the word.',correct_answer:item[1],data:{question_cn:item[0],options:item[2],correct_index:0}})),
    textQa:[],
    pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{
    focus:['运动会与运动项目词汇','为了目的复句','可能补语','越A越B','比赛表现与情绪','体育人物介绍','我的运动会准备与体育分享'],
    dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],
    recommendationRules:[
      {if:'preClass<0.7',then:'重做对应A/B/C五阶段预习并复习错词。'},
      {if:'inClass<0.7||postClass<0.7',then:'用A的项目卡和B的改进卡重新完成一次1分钟体育分享。'}
    ]
  }
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log('Wrote ' + out);
