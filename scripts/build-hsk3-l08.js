const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L08.json');
const img = name => 'images/hsk3-l08/' + name + '.png';
const roleFor = (index, total) => index < Math.floor(total * 0.5) ? 'lesson' : index < Math.floor(total * 0.8) ? 'transfer' : 'review';

const vocabRows = [
  ['最近','zuìjìn','名词','lately; recently','A','我最近常去体育馆跑步。',['最近几天','最近怎么样']],
  ['常','cháng','副词','often','A','他常在下课以后打羽毛球。',['常去','常练习']],
  ['体育馆','tǐyùguǎn','名词','gymnasium','A','学校的体育馆下午很热闹。',['学校体育馆','去体育馆']],
  ['习惯','xíguàn','名词/动词','habit; be used to','A','每天运动是一个好习惯。',['运动习惯','习惯早起']],
  ['胖','pàng','形容词','fat; gain weight','A','我今年胖了十多斤。',['胖一点儿','不能再胖']],
  ['健康','jiànkāng','形容词','healthy','A','运动和休息都对健康很重要。',['保持健康','健康习惯']],
  ['以后','yǐhòu','名词','after; afterward','A','我下课以后去打羽毛球。',['下课以后','以后注意']],
  ['羽毛球','yǔmáoqiú','名词','badminton','A','周末我们一起打羽毛球吧。',['打羽毛球','羽毛球场']],
  ['耳朵','ěrduo','名词','ear','B','游泳以后，我的耳朵有点儿疼。',['耳朵疼','保护耳朵']],
  ['感冒','gǎnmào','动词/名词','catch a cold; cold','B','他好像感冒了，今天没有来上课。',['得了感冒','预防感冒']],
  ['发烧','fāshāo','动词','have a fever','B','如果下午还发烧，就去看医生。',['有点儿发烧','发低烧']],
  ['低','dī','形容词','low','B','他的体温不太高，只是发低烧。',['温度低','低一点儿']],
  ['关心','guānxīn','动词','be concerned about','B','谢谢你关心我。',['关心同学','表示关心']],
  ['注意','zhùyì','动词','pay attention to','B','医生让他多休息，也要注意身体。',['注意休息','多注意']],
  ['突然','tūrán','形容词','sudden; suddenly','C','他昨天突然住院了。',['突然生病','突然下雨']],
  ['住院','zhùyuàn','动词','be in hospital','C','医生说他需要住院做检查。',['住院检查','住了几天院']],
  ['担心','dānxīn','动词','worry','C','大家都很担心他的身体。',['别担心','让人担心']],
  ['腿','tuǐ','名词','leg','C','他的腿疼了几个星期。',['腿疼','检查腿']],
  ['病人','bìngrén','名词','patient','C','护士正在帮助病人。',['照顾病人','不像病人']],
  ['差不多','chàbuduō','副词/形容词','almost; about','C','我上次来医院已经是差不多两年前了。',['差不多两年','时间差不多']],
  ['得','děi','能愿动词','need; have to','C','还得做完检查才能知道。',['还得检查','得休息']],
  ['开心','kāixīn','形容词','happy','C','朋友来看我，我就开心多了。',['很开心','开心多了']],
  ['出院','chūyuàn','动词','leave hospital','C','今天我终于可以出院了。',['办理出院','出院以后']],
  ['开','kāi','动词','prescribe','C','医生给我开了几种药。',['开药','医生开的药']],
  ['种','zhǒng','量词','kind; type','C','这三种药的吃法不一样。',['一种方法','几种药']],
  ['方法','fāngfǎ','名词','method','C','医生告诉了我吃药的方法。',['学习方法','使用方法']],
  ['其他','qítā','代词','other','C','其他几种药要饭后吃。',['其他人','其他方法']],
  ['心里','xīnlǐ','名词','mind; heart','C','医生的话我都记在心里了。',['记在心里','心里开心']]
];

const vocabulary = vocabRows.map((row, index) => ({
  id: 'v08_' + String(index + 1).padStart(2, '0'),
  hanzi: row[0],
  pinyin: row[1],
  pos: row[2],
  english: row[3],
  tags: [row[4]],
  example: row[5],
  examplePinyin: '',
  phrases: row[6]
}));
const word = hanzi => vocabulary.find(item => item.hanzi === hanzi);
const card = hanzi => {
  const item = word(hanzi);
  return {hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,example:item.example,examplePinyin:item.examplePinyin};
};

const texts = [
  {
    id:'t_hsk3_l08_01',textId:1,title:'最近常看见你来体育馆',setting:'在学校的体育馆，李文遇到了陈天中。',audio:'../../audio/HSK3/8-1.mp3',
    lines:[
      {speaker:'李文',hanzi:'天中，最近常看见你来体育馆。',pinyin:'Tiānzhōng, zuìjìn cháng kànjiàn nǐ lái tǐyùguǎn.',english:"Tianzhong, I've often seen you coming to the gym recently."},
      {speaker:'陈天中',hanzi:'我每天下午都来跑一个小时步。',pinyin:'Wǒ měitiān xiàwǔ dōu lái pǎo yí gè xiǎoshí bù.',english:'I come to run for an hour every afternoon.'},
      {speaker:'李文',hanzi:'你的运动习惯真不错。',pinyin:'Nǐ de yùndòng xíguàn zhēn búcuò.',english:'Your exercise routine is really great.'},
      {speaker:'陈天中',hanzi:'因为我今年胖了十多斤，不能再胖下去了，有点儿不健康。',pinyin:'Yīnwèi wǒ jīnnián pàngle shí duō jīn, bù néng zài pàng xiàqu le, yǒudiǎnr bú jiànkāng.',english:"Because I gained more than five kilograms this year and can't go on gaining weight; it's a bit unhealthy."},
      {speaker:'李文',hanzi:'我下课以后常去打羽毛球，你也来玩吧。',pinyin:'Wǒ xiàkè yǐhòu cháng qù dǎ yǔmáoqiú, nǐ yě lái wán ba.',english:'I often play badminton after class; come and join us.'},
      {speaker:'陈天中',hanzi:'我知道，但是你们的水平太高了，我打得不怎么样。',pinyin:'Wǒ zhīdào, dànshì nǐmen de shuǐpíng tài gāo le, wǒ dǎ de bù zěnmeyàng.',english:"I know, but your skill level is too high; I don't play very well."},
      {speaker:'李文',hanzi:'没关系，我可以教你。',pinyin:'Méi guānxi, wǒ kěyǐ jiāo nǐ.',english:'No worries, I can teach you.'}
    ]
  },
  {
    id:'t_hsk3_l08_02',textId:2,title:'看上去有点儿不舒服',setting:'在教室，安妮问候陈天中。',audio:'../../audio/HSK3/8-3.mp3',
    lines:[
      {speaker:'安妮',hanzi:'你怎么了？看上去有点儿不舒服。',pinyin:'Nǐ zěnme le? Kàn shangqu yǒudiǎnr bù shūfu.',english:"What's wrong? You look a bit uncomfortable."},
      {speaker:'陈天中',hanzi:'昨天游泳以后，耳朵一直有点儿疼。',pinyin:'Zuótiān yóuyǒng yǐhòu, ěrduo yìzhí yǒudiǎnr téng.',english:'My ear has been hurting a bit ever since I went swimming yesterday.'},
      {speaker:'安妮',hanzi:'是不是感冒了？发烧吗？',pinyin:'Shì bu shì gǎnmào le? Fāshāo ma?',english:'Did you catch a cold? Do you have a fever?'},
      {speaker:'陈天中',hanzi:'好像发低烧了。',pinyin:'Hǎoxiàng fā dīshāo le.',english:'I seem to have a low-grade fever.'},
      {speaker:'安妮',hanzi:'我送你去医院，让医生检查一下吧。',pinyin:'Wǒ sòng nǐ qù yīyuàn, ràng yīshēng jiǎnchá yíxià ba.',english:'Let me take you to the hospital to have the doctor check it out.'},
      {speaker:'陈天中',hanzi:'我先回去睡一觉，可能休息休息就好了。',pinyin:'Wǒ xiān huíqù shuì yí jiào, kěnéng xiūxi xiuxi jiù hǎo le.',english:"I'll go back and sleep first; maybe I'll feel better after a rest."},
      {speaker:'安妮',hanzi:'好吧，如果下午还发烧，就一定要去看医生。',pinyin:'Hǎo ba, rúguǒ xiàwǔ hái fāshāo, jiù yídìng yào qù kàn yīshēng.',english:'Alright, but if you still have a fever this afternoon, you definitely must see a doctor.'},
      {speaker:'陈天中',hanzi:'谢谢关心，我会注意的。',pinyin:'Xièxie guānxīn, wǒ huì zhùyì de.',english:'Thanks for your concern, I will pay attention to it.'}
    ]
  },
  {
    id:'t_hsk3_l08_03',textId:3,title:'你怎么突然住院了',setting:'在医院病房，安妮探望陈天中。',audio:'../../audio/HSK3/8-5.mp3',
    lines:[
      {speaker:'安妮',hanzi:'你怎么突然住院了？大家都很担心你。',pinyin:'Nǐ zěnme tūrán zhùyuàn le? Dàjiā dōu hěn dānxīn nǐ.',english:'Why were you hospitalized all of a sudden? Everyone was very worried about you.'},
      {speaker:'陈天中',hanzi:'我的腿疼了几个星期了，医生说需要住院做检查。',pinyin:'Wǒ de tuǐ téngle jǐ gè xīngqī le, yīshēng shuō xūyào zhùyuàn zuò jiǎnchá.',english:'My leg has been hurting for a few weeks, and the doctor said I need to be hospitalized for check-ups.'},
      {speaker:'安妮',hanzi:'你看起来一点儿也不像病人。',pinyin:'Nǐ kàn qǐlai yìdiǎnr yě bú xiàng bìngrén.',english:"You don't look like a sick person at all."},
      {speaker:'陈天中',hanzi:'是啊，我很少生病。我上次来医院已经过去差不多两年了。',pinyin:'Shì a, wǒ hěn shǎo shēngbìng. Wǒ shàng cì lái yīyuàn yǐjīng guòqu chàbuduō liǎng nián le.',english:"Yeah, I rarely get sick. It's been almost two years since the last time I came to a hospital."},
      {speaker:'安妮',hanzi:'你每天跑步，有时候还去游泳，是不是运动太多了？',pinyin:'Nǐ měitiān pǎobù, yǒushíhou hái qù yóuyǒng, shì bu shì yùndòng tài duō le?',english:'You run every day and sometimes go swimming too; could it be too much exercise?'},
      {speaker:'陈天中',hanzi:'医生也这么说，但是还得做完检查才能知道。',pinyin:'Yīshēng yě zhème shuō, dànshì hái děi zuòwán jiǎnchá cái néng zhīdào.',english:'The doctor said so too, but we have to finish all the tests to know for sure.'},
      {speaker:'安妮',hanzi:'别担心！听医生的话，好好休息，你的腿一定能好。',pinyin:'Bié dānxīn! Tīng yīshēng de huà, hǎohāo xiūxi, nǐ de tuǐ yídìng néng hǎo.',english:"Don't worry! Follow the doctor's advice and take a good rest; your leg will definitely recover."},
      {speaker:'陈天中',hanzi:'谢谢。有人来看我，我就开心多了。',pinyin:'Xièxie. Yǒurén lái kàn wǒ, wǒ jiù kāixīn duō le.',english:'Thank you. Having someone visit makes me feel much happier.'}
    ]
  },
  {
    id:'t_hsk3_l08_04',textId:4,title:'今天我出院了',format:'narrative',genre:'恢复记录',genreEn:'Recovery Notes',author:'陈天中',setting:'在家里，陈天中吃药、休息。',audio:'../../audio/HSK3/8-7.mp3',translationPolicy:'中文和拼音为教材原文；英文译文为教学辅助。',
    lines:[
      {speaker:'陈天中',hanzi:'今天我出院了。出院前，医生给我开了几种药，而且告诉了我吃药的方法。有一种药需要每天睡前吃一次，其他几种每天吃三次，饭后吃。除了吃药，医生还说最重要的是多休息。我都记在心里了，回家以后一定会多注意。希望我的腿能快一点儿好。',pinyin:'Jīntiān wǒ chūyuàn le. Chūyuàn qián, yīshēng gěi wǒ kāile jǐ zhǒng yào, érqiě gàosu le wǒ chī yào de fāngfǎ. Yǒu yì zhǒng yào xūyào měitiān shuì qián chī yí cì, qítā jǐ zhǒng měitiān chī sān cì, fàn hòu chī. Chúle chī yào, yīshēng hái shuō zuì zhòngyào de shì duō xiūxi. Wǒ dōu jì zài xīnli le, huí jiā yǐhòu yídìng huì duō zhùyì. Xīwàng wǒ de tuǐ néng kuài yìdiǎnr hǎo.',english:"Today I was discharged from the hospital. Before I left, the doctor prescribed several kinds of medicine and explained how to take them. One kind should be taken once before bed, and the others three times a day after meals. The doctor also said that getting plenty of rest was most important. I have kept all of this in mind and will be more careful after returning home. I hope my leg gets better soon."}
    ]
  }
];

const grammar = [
  {id:'g08_01',title:'趋向补语“下去”的引申用法',titleEn:'Extended use of 下去',scene:'An action or state has already started and continues from now on.',structure:'动词 / 形容词 + 下去',explanation:'“下去”放在动词或形容词后，表示已经开始的动作或状态继续。',examples:[
    {hanzi:'我不能再胖下去了。',pinyin:'Wǒ bù néng zài pàng xiàqu le.',english:'I cannot keep gaining weight.'},
    {hanzi:'这个好习惯要坚持下去。',pinyin:'Zhège hǎo xíguàn yào jiānchí xiàqu.',english:'Keep this good habit going.'},
    {hanzi:'你读完第一段，再读下去。',pinyin:'Nǐ dúwán dì-yī duàn, zài dú xiàqu.',english:'After the first paragraph, keep reading.'},
    {hanzi:'如果再热下去，我们就不能运动了。',pinyin:'Rúguǒ zài rè xiàqu, wǒmen jiù bù néng yùndòng le.',english:'If it keeps getting hotter, we cannot exercise.'},
    {hanzi:'不要停，我们一起跑下去。',pinyin:'Bú yào tíng, wǒmen yìqǐ pǎo xiàqu.',english:"Don't stop; let's keep running."}
  ]},
  {id:'g08_02',title:'离合词加补语',titleEn:'Complements inside separable words',scene:'How do you say that you finished swimming or slept for a while?',structure:'离合词前半部分 + 补语 + 离合词后半部分',explanation:'离合词带补语时，补语一般放在离合词两个部分之间。',examples:[
    {hanzi:'昨天游完泳以后，我的耳朵有点儿疼。',pinyin:'Zuótiān yóuwán yǒng yǐhòu, wǒ de ěrduo yǒudiǎnr téng.',english:'After finishing swimming yesterday, my ear hurt a little.'},
    {hanzi:'我想先睡一会儿觉。',pinyin:'Wǒ xiǎng xiān shuì yíhuìr jiào.',english:'I want to sleep for a while first.'},
    {hanzi:'今年夏天只下了两次雨。',pinyin:'Jīnnián xiàtiān zhǐ xiàle liǎng cì yǔ.',english:'It rained only twice this summer.'},
    {hanzi:'我们见过一次面。',pinyin:'Wǒmen jiànguo yí cì miàn.',english:'We have met once.'},
    {hanzi:'他跑完步就回宿舍休息了。',pinyin:'Tā pǎowán bù jiù huí sùshè xiūxi le.',english:'He returned to the dorm to rest after running.'}
  ]},
  {id:'g08_03',title:'时量补语：动作完成到现在',titleEn:'Elapsed time since a completed action',scene:'How long has it been since a non-continuous action happened?',structure:'主语 + 非持续性动词 + 时量 + 了',explanation:'有些动作不能持续，动词后的时量表示动作完成以后到现在经过了多久。',examples:[
    {hanzi:'我上次来医院已经过去差不多两年了。',pinyin:'Wǒ shàng cì lái yīyuàn yǐjīng guòqu chàbuduō liǎng nián le.',english:"It has been almost two years since I last came to a hospital."},
    {hanzi:'她回家两个月了。',pinyin:'Tā huí jiā liǎng gè yuè le.',english:'It has been two months since she went home.'},
    {hanzi:'开学已经三个多星期了。',pinyin:'Kāixué yǐjīng sān gè duō xīngqī le.',english:'It has been over three weeks since school started.'},
    {hanzi:'他出院五天了。',pinyin:'Tā chūyuàn wǔ tiān le.',english:'It has been five days since he left the hospital.'},
    {hanzi:'我们上次见面半年了。',pinyin:'Wǒmen shàng cì jiànmiàn bàn nián le.',english:'It has been half a year since we last met.'}
  ]},
  {id:'g08_04',title:'“以前／以后”与“前／后”',titleEn:'Before and after expressions',scene:'Place an action or a time before or after another event.',structure:'时间 / 事件 + 以前／以后；时间 / 事件 + 前／后',explanation:'“以前／以后”较完整，可以单独使用；“前／后”更简洁，常直接跟在时间或事件后。',examples:[
    {hanzi:'游泳以后，我的耳朵有点儿疼。',pinyin:'Yóuyǒng yǐhòu, wǒ de ěrduo yǒudiǎnr téng.',english:'After swimming, my ear hurt a little.'},
    {hanzi:'出院前，医生给我开了几种药。',pinyin:'Chūyuàn qián, yīshēng gěi wǒ kāile jǐ zhǒng yào.',english:'Before discharge, the doctor prescribed several medicines.'},
    {hanzi:'这种药每天睡前吃一次。',pinyin:'Zhè zhǒng yào měitiān shuì qián chī yí cì.',english:'Take this medicine once before bed.'},
    {hanzi:'其他几种药饭后吃。',pinyin:'Qítā jǐ zhǒng yào fàn hòu chī.',english:'Take the other medicines after meals.'},
    {hanzi:'回家以后，我一定会多休息。',pinyin:'Huí jiā yǐhòu, wǒ yídìng huì duō xiūxi.',english:'After returning home, I will rest more.'}
  ]}
];

const grammarTeachingNotes = {
  g08_01:{
    scene:'An action or state has already started. How can we say it should continue from now on?',structure:'动词 / 形容词 + 下去',structureEn:'Verb / adjective + 下去 = continue from now on',presentationMode:'progressive_grammar',
    visualLearning:{leadExamples:[
      {english:'Walk downstairs.',hanzi:'走下楼去。',pinyin:'Zǒu xià lóu qù.'},
      {english:'I cannot keep gaining weight.',hanzi:'我不能再胖下去了。',pinyin:'Wǒ bù néng zài pàng xiàqu le.'},
      {english:'We should keep this good habit going.',hanzi:'这个好习惯要坚持下去。',pinyin:'Zhège hǎo xíguàn yào jiānchí xiàqu.'}
    ],blocks:['动词 / 形容词','下去'],blockLabelsEn:['action or state','continues from now on']},
    oralQuestions:[
      {question:'你想把什么运动坚持下去？',pinyin:'Nǐ xiǎng bǎ shénme yùndòng jiānchí xiàqu?'},
      {question:'什么坏习惯不能继续下去？',pinyin:'Shénme huài xíguàn bù néng jìxù xiàqu?'},
      {question:'累的时候，怎样才能练下去？',pinyin:'Lèi de shíhou, zěnyàng cái néng liàn xiàqu?'}
    ],
    structureVariants:[
      {label:'继续意义',formula:'动词 / 形容词 + 下去',formulaEn:'Verb / adjective + 下去',explanation:'已经开始的动作或状态从现在继续。',example:'这个好习惯要坚持下去。',examplePinyin:'Zhège hǎo xíguàn yào jiānchí xiàqu.'},
      {label:'方向意义',formula:'动词 + 下 + 地点 + 去',formulaEn:'Verb + down + place + away from speaker',explanation:'表示真实的移动方向，不是本课主要用法。',example:'他走下楼去了。',examplePinyin:'Tā zǒu xià lóu qù le.'}
    ],
    followUp:[
      {image:img('photo-text-1-badminton'),promptEn:'They want to continue practicing badminton after class.',target:'用“下去”说一句完整的话。',sampleAnswer:{hanzi:'他们想把打羽毛球的习惯坚持下去。',pinyin:'Tāmen xiǎng bǎ dǎ yǔmáoqiú de xíguàn jiānchí xiàqu.'}},
      {image:img('photo-text-1-gym'),promptEn:'He does not want to keep gaining weight.',target:'用“不能再……下去了”说一句话。',sampleAnswer:{hanzi:'他不能再胖下去了。',pinyin:'Tā bù néng zài pàng xiàqu le.'}}
    ]
  },
  g08_02:{
    scene:'游泳, 睡觉 and 跑步 are separable words. Where should a complement go?',structure:'离合词前半部分 + 补语 + 离合词后半部分',structureEn:'First part + complement + second part',presentationMode:'progressive_grammar',
    visualLearning:{leadExamples:[
      {english:'After finishing swimming...',hanzi:'游完泳以后……',pinyin:'Yóuwán yǒng yǐhòu...'},
      {english:'Sleep for a while first.',hanzi:'先睡一会儿觉。',pinyin:'Xiān shuì yíhuìr jiào.'},
      {english:'Run for one hour.',hanzi:'跑一个小时步。',pinyin:'Pǎo yí gè xiǎoshí bù.'}
    ],blocks:['离合词前半部分','补语','离合词后半部分'],blockLabelsEn:['verb part','complement','object part']},
    oralQuestions:[
      {question:'你上次跟家人聊天儿聊了多长时间？',pinyin:'Nǐ shàng cì gēn jiārén liáotiānr liáole duō cháng shíjiān?'},
      {question:'不舒服的时候，你想睡多长时间觉？',pinyin:'Bù shūfu de shíhou, nǐ xiǎng shuì duō cháng shíjiān jiào?'},
      {question:'你一星期跑几次步？',pinyin:'Nǐ yì xīngqī pǎo jǐ cì bù?'}
    ],
    structureVariants:[
      {label:'结果补语',formula:'游 + 完 + 泳',formulaEn:'swim + finish + swimming',explanation:'“完”放在“游”和“泳”之间。',example:'我游完泳就去洗澡。',examplePinyin:'Wǒ yóuwán yǒng jiù qù xǐzǎo.'},
      {label:'时量补语',formula:'睡 + 一会儿 + 觉',formulaEn:'sleep + a while + sleep',explanation:'时量也放在离合词中间。',example:'你先睡一会儿觉吧。',examplePinyin:'Nǐ xiān shuì yíhuìr jiào ba.'}
    ],
    followUp:[
      {image:img('photo-text-2-temperature-rest'),promptEn:'The student wants to sleep for a while before deciding what to do.',target:'用“睡觉”加时量补语说一句话。',sampleAnswer:{hanzi:'她想先睡一会儿觉。',pinyin:'Tā xiǎng xiān shuì yíhuìr jiào.'}},
      {image:img('photo-text-1-badminton'),promptEn:'They finished exercising and then rested.',target:'使用一个离合词和“完”说一句话。',sampleAnswer:{hanzi:'他们打完球以后休息了一会儿。',pinyin:'Tāmen dǎwán qiú yǐhòu xiūxile yíhuìr.'}}
    ]
  },
  g08_03:{
    scene:'A point event happened in the past. Say how much time has passed up to now.',structure:'主语 + 非持续性动词 + 时量 + 了',structureEn:'Subject + point-event verb + elapsed time + 了',presentationMode:'progressive_grammar',
    visualLearning:{leadExamples:[
      {english:'It has been almost two years since I last came to a hospital.',hanzi:'我上次来医院已经过去差不多两年了。',pinyin:'Wǒ shàng cì lái yīyuàn yǐjīng guòqu chàbuduō liǎng nián le.'},
      {english:'It has been five days since he left the hospital.',hanzi:'他出院五天了。',pinyin:'Tā chūyuàn wǔ tiān le.'},
      {english:'She exercised for one hour.',hanzi:'她运动了一个小时。',pinyin:'Tā yùndòngle yí gè xiǎoshí.'}
    ],blocks:['非持续性动作','经过的时间','了'],blockLabelsEn:['point event','time since event','current relevance']},
    oralQuestions:[
      {question:'你来中国多长时间了？',pinyin:'Nǐ lái Zhōngguó duō cháng shíjiān le?'},
      {question:'你上次看医生到现在多久了？',pinyin:'Nǐ shàng cì kàn yīshēng dào xiànzài duōjiǔ le?'},
      {question:'这学期开学多长时间了？',pinyin:'Zhè xuéqī kāixué duō cháng shíjiān le?'}
    ],
    structureVariants:[
      {label:'动作完成到现在',formula:'非持续性动词 + 时量 + 了',formulaEn:'Point-event verb + elapsed time + 了',explanation:'表示动作完成以后，到现在经过了多久。',example:'他出院五天了。',examplePinyin:'Tā chūyuàn wǔ tiān le.'},
      {label:'动作持续时间',formula:'持续性动词 + 了 + 时量',formulaEn:'Durative verb + 了 + duration',explanation:'表示动作本身持续了多久。',example:'她运动了一个小时。',examplePinyin:'Tā yùndòngle yí gè xiǎoshí.'}
    ],
    followUp:[
      {image:img('photo-text-3-hospital-visit'),promptEn:'The last hospital visit was almost two years ago.',target:'根据时间线说一句完整的话。',sampleAnswer:{hanzi:'他上次来医院已经差不多两年了。',pinyin:'Tā shàng cì lái yīyuàn yǐjīng chàbuduō liǎng nián le.'}},
      {image:img('photo-text-4-home-recovery'),promptEn:'It has been three days since the patient returned home.',target:'使用“时量＋了”说一句话。',sampleAnswer:{hanzi:'她回家三天了。',pinyin:'Tā huí jiā sān tiān le.'}}
    ]
  },
  g08_04:{
    scene:'Put exercise, a doctor visit, medicine and sleep on a before-and-after timeline.',structure:'时间 / 事件 + 以前／以后；时间 / 事件 + 前／后',structureEn:'Time / event + 以前／以后 or 前／后',presentationMode:'progressive_grammar',
    visualLearning:{leadExamples:[
      {english:'After swimming, his ear hurt.',hanzi:'游泳以后，他的耳朵疼。',pinyin:'Yóuyǒng yǐhòu, tā de ěrduo téng.'},
      {english:'Before leaving the hospital, the doctor prescribed medicine.',hanzi:'出院前，医生开了药。',pinyin:'Chūyuàn qián, yīshēng kāile yào.'},
      {english:'Take it after meals.',hanzi:'饭后吃。',pinyin:'Fàn hòu chī.'}
    ],blocks:['时间 / 事件','以前／以后 或 前／后','后续动作'],blockLabelsEn:['reference point','before / after','main action']},
    oralQuestions:[
      {question:'运动以前，你会做什么？',pinyin:'Yùndòng yǐqián, nǐ huì zuò shénme?'},
      {question:'看完医生以后，病人应该注意什么？',pinyin:'Kànwán yīshēng yǐhòu, bìngrén yīnggāi zhùyì shénme?'},
      {question:'睡觉前你常做什么？',pinyin:'Shuìjiào qián nǐ cháng zuò shénme?'}
    ],
    structureVariants:[
      {label:'完整形式',formula:'事件 + 以前／以后',formulaEn:'Event + 以前／以后',explanation:'可以表示较完整的前后关系，也可以单独回答。',example:'回家以后，我会多休息。',examplePinyin:'Huí jiā yǐhòu, wǒ huì duō xiūxi.'},
      {label:'简洁形式',formula:'时间 / 事件 + 前／后',formulaEn:'Time / event + 前／后',explanation:'直接放在时间或事件后，表达更简洁。',example:'这种药睡前吃一次。',examplePinyin:'Zhè zhǒng yào shuì qián chī yí cì.'}
    ],
    followUp:[
      {image:img('photo-text-4-discharge-plan'),promptEn:'The doctor explains the plan before the patient leaves.',target:'使用“出院前”说一句话。',sampleAnswer:{hanzi:'出院前，医生告诉了他吃药的方法。',pinyin:'Chūyuàn qián, yīshēng gàosule tā chī yào de fāngfǎ.'}},
      {image:img('photo-text-4-home-recovery'),promptEn:'The patient checks the schedule after returning home.',target:'使用“回家以后”说一句话。',sampleAnswer:{hanzi:'回家以后，她按照医生的安排休息。',pinyin:'Huí jiā yǐhòu, tā ànzhào yīshēng de ānpái xiūxi.'}}
    ]
  }
};

const makeQuestions = rows => rows.map(item => ({
  question:item[0],question_pinyin:item[1] || '',answer:item[2],answer_pinyin:item[3] || ''
}));

const textTeachingNotes = {
  t_hsk3_l08_01:{
    presentationMode:'listen_first_progressive',listenPrompt:'先完整听一遍，不看课文。听完后，说说人物在哪里、为什么运动以及下课后的计划。',
    classQuestions:makeQuestions([
      ['李文最近常在哪里看见陈天中？','Lǐ Wén zuìjìn cháng zài nǎli kànjiàn Chén Tiānzhōng?','在体育馆。','Zài tǐyùguǎn.'],
      ['陈天中每天下午做什么？','Chén Tiānzhōng měitiān xiàwǔ zuò shénme?','跑一个小时步。','Pǎo yí gè xiǎoshí bù.'],
      ['他为什么开始运动？','Tā wèishénme kāishǐ yùndòng?','因为他胖了十多斤，觉得不健康。','Yīnwèi tā pàngle shí duō jīn, juéde bù jiànkāng.'],
      ['李文下课以后常做什么？','Lǐ Wén xiàkè yǐhòu cháng zuò shénme?','去打羽毛球。','Qù dǎ yǔmáoqiú.'],
      ['陈天中为什么有点儿不想参加？','Chén Tiānzhōng wèishénme yǒudiǎnr bù xiǎng cānjiā?','因为他觉得自己打得不怎么样。','Yīnwèi tā juéde zìjǐ dǎ de bù zěnmeyàng.']
    ]),
    cultureDiscussion:{title:'怎样把运动习惯坚持下去？',titleEn:'How can we maintain a healthy exercise habit?',questions:[
      {hanzi:'你最近常做什么运动？',pinyin:'Nǐ zuìjìn cháng zuò shénme yùndòng?'},
      {hanzi:'如果水平不高，怎样也能继续练下去？',pinyin:'Rúguǒ shuǐpíng bù gāo, zěnyàng yě néng jìxù liàn xiàqu?'}
    ],wordCards:[
      {hanzi:'慢慢来',pinyin:'mànmàn lái',english:'take it step by step'},
      {hanzi:'每周三次',pinyin:'měi zhōu sān cì',english:'three times a week'},
      {hanzi:'一起练习',pinyin:'yìqǐ liànxí',english:'practice together'}
    ],background:'“不怎么样”常用来比较委婉地说自己做得一般，也可以带有自谦语气。',sampleAnswers:[
      {hanzi:'我会找同学一起练习，这样更容易坚持下去。',pinyin:'Wǒ huì zhǎo tóngxué yìqǐ liànxí, zhèyàng gèng róngyì jiānchí xiàqu.'},
      {hanzi:'水平不高也没关系，可以慢慢学。',pinyin:'Shuǐpíng bù gāo yě méi guānxi, kěyǐ mànmàn xué.'}
    ]},
    retellScaffold:{nodes:[{label:'地点',hint:'体育馆'},{label:'习惯',hint:'每天下午跑步'},{label:'原因',hint:'胖了、不健康'},{label:'邀请',hint:'下课后打羽毛球'},{label:'回应',hint:'不怎么样、可以教'}],frame:'李文最近常……。陈天中因为……，所以……。李文邀请他……，陈天中担心……，李文说……。'}
  },
  t_hsk3_l08_02:{
    presentationMode:'listen_first_progressive',listenPrompt:'先听人物的症状、发生时间和两个人提出的不同做法，不提供医学诊断。',
    classQuestions:makeQuestions([
      ['陈天中哪里不舒服？','Chén Tiānzhōng nǎli bù shūfu?','耳朵一直有点儿疼。','Ěrduo yìzhí yǒudiǎnr téng.'],
      ['什么时候开始不舒服的？','Shénme shíhou kāishǐ bù shūfu de?','昨天游泳以后。','Zuótiān yóuyǒng yǐhòu.'],
      ['他还有什么情况？','Tā hái yǒu shénme qíngkuàng?','好像发低烧了。','Hǎoxiàng fā dīshāo le.'],
      ['安妮先建议做什么？','Ānnī xiān jiànyì zuò shénme?','去医院让医生检查一下。','Qù yīyuàn ràng yīshēng jiǎnchá yíxià.'],
      ['什么情况下陈天中一定要看医生？','Shénme qíngkuàng xià Chén Tiānzhōng yídìng yào kàn yīshēng?','如果下午还发烧。','Rúguǒ xiàwǔ hái fāshāo.']
    ]),
    cultureDiscussion:{title:'怎样礼貌地表示关心？',titleEn:'How can we show concern politely?',questions:[
      {hanzi:'同学看上去不舒服时，你可以先问什么？',pinyin:'Tóngxué kàn shangqu bù shūfu shí, nǐ kěyǐ xiān wèn shénme?'},
      {hanzi:'什么时候应该休息，什么时候应该请医生检查？',pinyin:'Shénme shíhou yīnggāi xiūxi, shénme shíhou yīnggāi qǐng yīshēng jiǎnchá?'}
    ],wordCards:[
      {hanzi:'你还好吗？',pinyin:'Nǐ hái hǎo ma?',english:'Are you okay?'},
      {hanzi:'要不要休息一下？',pinyin:'Yào bu yào xiūxi yíxià?',english:'Would you like to rest?'},
      {hanzi:'请医生检查',pinyin:'qǐng yīshēng jiǎnchá',english:'ask a doctor to check'}
    ],background:'课堂只练习关心、休息和请医生检查等一般表达，不替同学作医学诊断。',sampleAnswers:[
      {hanzi:'你看上去不太舒服，要不要先休息一下？',pinyin:'Nǐ kàn shangqu bú tài shūfu, yào bu yào xiān xiūxi yíxià?'},
      {hanzi:'如果还发烧，最好请医生检查一下。',pinyin:'Rúguǒ hái fāshāo, zuìhǎo qǐng yīshēng jiǎnchá yíxià.'}
    ]},
    retellScaffold:{nodes:[{label:'症状',hint:'耳朵疼'},{label:'时间',hint:'游泳以后'},{label:'情况',hint:'发低烧'},{label:'建议一',hint:'去医院检查'},{label:'建议二',hint:'先休息、继续发烧就看医生'}],frame:'陈天中昨天……以后……。安妮问他是不是……，还建议……。陈天中想先……。安妮说如果……，就……。'}
  },
  t_hsk3_l08_03:{
    presentationMode:'listen_first_progressive',listenPrompt:'先听住院原因、上次来医院的时间以及医生还需要做什么。',
    classQuestions:makeQuestions([
      ['陈天中为什么住院？','Chén Tiānzhōng wèishénme zhùyuàn?','因为腿疼了几个星期，需要做检查。','Yīnwèi tuǐ téngle jǐ gè xīngqī, xūyào zuò jiǎnchá.'],
      ['大家知道以后怎么样？','Dàjiā zhīdào yǐhòu zěnmeyàng?','大家都很担心他。','Dàjiā dōu hěn dānxīn tā.'],
      ['他上次来医院到现在多久了？','Tā shàng cì lái yīyuàn dào xiànzài duōjiǔ le?','差不多两年了。','Chàbuduō liǎng nián le.'],
      ['安妮觉得可能是什么原因？','Ānnī juéde kěnéng shì shénme yuányīn?','可能运动太多了。','Kěnéng yùndòng tài duō le.'],
      ['陈天中为什么还不能确定？','Chén Tiānzhōng wèishénme hái bù néng quèdìng?','因为还得做完检查。','Yīnwèi hái děi zuòwán jiǎnchá.']
    ]),
    cultureDiscussion:{title:'看望住院朋友时可以怎么做？',titleEn:'What can we do when visiting a friend in hospital?',questions:[
      {hanzi:'你会对住院的朋友说什么？',pinyin:'Nǐ huì duì zhùyuàn de péngyou shuō shénme?'},
      {hanzi:'看望以前，为什么最好先问时间？',pinyin:'Kànwàng yǐqián, wèishénme zuìhǎo xiān wèn shíjiān?'}
    ],wordCards:[
      {hanzi:'好好休息',pinyin:'hǎohāo xiūxi',english:'get plenty of rest'},
      {hanzi:'听医生的话',pinyin:'tīng yīshēng de huà',english:"follow the doctor's advice"},
      {hanzi:'祝你早日恢复',pinyin:'zhù nǐ zǎorì huīfù',english:'wish you a quick recovery'}
    ],background:'看望时要尊重病人的休息安排，也可以先发消息确认是否方便。',sampleAnswers:[
      {hanzi:'别担心，好好休息，祝你早日恢复。',pinyin:'Bié dānxīn, hǎohāo xiūxi, zhù nǐ zǎorì huīfù.'},
      {hanzi:'我会先问他什么时候方便，再去看他。',pinyin:'Wǒ huì xiān wèn tā shénme shíhou fāngbiàn, zài qù kàn tā.'}
    ]},
    retellScaffold:{nodes:[{label:'突然住院',hint:'大家担心'},{label:'腿疼',hint:'几个星期'},{label:'上次医院',hint:'差不多两年'},{label:'可能原因',hint:'运动太多'},{label:'下一步',hint:'做完检查、好好休息'}],frame:'陈天中突然……，因为……。他上次……已经……。安妮觉得可能……，但是还得……。她让他……。'}
  },
  t_hsk3_l08_04:{
    presentationMode:'listen_first_progressive',listenPrompt:'先听出院、药物种类、时间安排和最重要的恢复建议。',
    classQuestions:makeQuestions([
      ['陈天中什么时候出院？','Chén Tiānzhōng shénme shíhou chūyuàn?','今天。','Jīntiān.'],
      ['出院前医生做了什么？','Chūyuàn qián yīshēng zuòle shénme?','开了几种药，并告诉他吃药的方法。','Kāile jǐ zhǒng yào, bìng gàosu tā chī yào de fāngfǎ.'],
      ['哪一种药要睡前吃？','Nǎ yì zhǒng yào yào shuì qián chī?','其中一种药，每天睡前吃一次。','Qízhōng yì zhǒng yào, měitiān shuì qián chī yí cì.'],
      ['其他几种药什么时候吃？','Qítā jǐ zhǒng yào shénme shíhou chī?','每天三次，饭后吃。','Měitiān sān cì, fàn hòu chī.'],
      ['医生说最重要的是什么？','Yīshēng shuō zuì zhòngyào de shì shénme?','多休息。','Duō xiūxi.']
    ]),
    cultureDiscussion:{title:'吃药的说明',titleEn:'Medicine Instructions',questions:[
      {hanzi:'“睡前一次”和“饭后三次”有什么不同？',pinyin:'“Shuì qián yí cì” hé “fàn hòu sān cì” yǒu shénme bùtóng?'},
      {hanzi:'如果没有听懂医生的安排，应该怎么办？',pinyin:'Rúguǒ méiyǒu tīngdǒng yīshēng de ānpái, yīnggāi zěnme bàn?'}
    ],wordCards:[
      {hanzi:'住院',pinyin:'zhùyuàn',english:'be admitted to hospital'},
      {hanzi:'出院',pinyin:'chūyuàn',english:'be discharged'},
      {hanzi:'开药',pinyin:'kāi yào',english:'prescribe medicine'}
    ],background:'“住院、出院、开药”分别说明进入住院治疗、结束住院和医生开出药物。具体用药应以医生或药师说明为准。',sampleAnswers:[
      {hanzi:'“睡前一次”是每天睡觉以前吃一次。',pinyin:'“Shuì qián yí cì” shì měitiān shuìjiào yǐqián chī yí cì.'},
      {hanzi:'没有听懂时，可以请医生再说明一次。',pinyin:'Méiyǒu tīngdǒng shí, kěyǐ qǐng yīshēng zài shuōmíng yí cì.'}
    ]},
    retellScaffold:{nodes:[{label:'出院',hint:'今天'},{label:'开药',hint:'几种、方法'},{label:'睡前',hint:'一种、一次'},{label:'饭后',hint:'其他、三次'},{label:'最重要',hint:'多休息、记在心里'}],frame:'今天陈天中……。出院前，医生……。一种药要……，其他几种要……。医生还说……。陈天中准备……。'}
  }
};

const sceneData = {
  1:{title:'运动习惯与健康变化',subtitle:'先观察体育馆里的日常运动，再聊下课后的羽毛球计划。',steps:[
    {title:'最近常来体育馆',talkHint:'先聊聊，不着急给答案。',prompt:'你有运动的习惯吗？\n你怎么锻炼身体？',promptPinyin:'Nǐ yǒu yùndòng de xíguàn ma?\nNǐ zěnme duànliàn shēntǐ?',promptEn:'Do you have an exercise habit? How do you exercise?',image:img('photo-text-1-gym'),labels:[{word:'最近',x:12,y:14,targetX:87,targetY:13},{word:'常',x:88,y:14,targetX:70,targetY:37},{word:'体育馆',x:14,y:84,targetX:25,targetY:58},{word:'习惯',x:87,y:84,targetX:75,targetY:67}],words:['最近','常','体育馆','习惯'],sentence:'我最近常来体育馆，慢慢养成了运动习惯。',sampleAnswers:[
      {hanzi:'我最近常去体育馆跑步。',pinyin:'Wǒ zuìjìn cháng qù tǐyùguǎn pǎobù.'},
      {hanzi:'我习惯每周运动三次。',pinyin:'Wǒ xíguàn měi zhōu yùndòng sān cì.'}
    ]},
    {title:'下课以后打羽毛球',talkHint:'先聊聊，不着急给答案。',prompt:'你的朋友最近胖了，给她出出主意：\n有什么减肥的好办法？',promptPinyin:'Nǐ de péngyou zuìjìn pàng le, gěi tā chūchu zhǔyi:\nYǒu shénme jiǎnféi de hǎo bànfǎ?',promptEn:'Your friend has gained weight recently. Give her some ideas: what are some good ways to lose weight?',image:img('photo-text-1-badminton'),labels:[{word:'胖',x:12,y:13,targetX:33,targetY:45},{word:'健康',x:88,y:13,targetX:66,targetY:44},{word:'以后',x:12,y:84,targetX:87,targetY:15},{word:'羽毛球',x:88,y:84,targetX:63,targetY:59}],words:['胖','健康','以后','羽毛球'],sentence:'下课以后一起打羽毛球，可以把健康习惯坚持下去。',sampleAnswers:[
      {hanzi:'她可以每天运动半个小时，也要注意休息。',pinyin:'Tā kěyǐ měitiān yùndòng bàn gè xiǎoshí, yě yào zhùyì xiūxi.'},
      {hanzi:'她可以先学打羽毛球，把运动习惯坚持下去。',pinyin:'Tā kěyǐ xiān xué dǎ yǔmáoqiú, bǎ yùndòng xíguàn jiānchí xiàqu.'}
    ]}
  ]},
  2:{title:'身体不舒服与同学关心',subtitle:'观察耳朵不舒服和测量体温两个场景，用合适的话表示关心。',steps:[
    {title:'耳朵不舒服',talkHint:'先聊聊，不着急给答案。',prompt:'朋友说耳朵疼，还有点儿发烧，\n你会怎么关心他？',promptPinyin:'Péngyou shuō ěrduo téng, hái yǒudiǎnr fāshāo,\nnǐ huì zěnme guānxīn tā?',image:img('photo-text-2-ear-care'),labels:[{word:'耳朵',x:10,y:13,targetX:30,targetY:35},{word:'感冒',x:88,y:13,targetX:35,targetY:52},{word:'关心',x:10,y:84,targetX:70,targetY:65},{word:'注意',x:88,y:84,targetX:64,targetY:84},{word:'头',x:49,y:12,targetX:29,targetY:25},{word:'嗓子',x:46,y:86,targetX:29,targetY:51},{word:'咳嗽',x:88,y:49,targetX:40,targetY:47}],words:['耳朵','感冒','关心','注意',{hanzi:'头',pinyin:'tóu',english:'head',phrases:['头疼','低头'],example:'他有点儿头疼，想先休息一下。',examplePinyin:'Tā yǒudiǎnr tóuténg, xiǎng xiān xiūxi yíxià.'},{hanzi:'嗓子',pinyin:'sǎngzi',english:'throat; voice',phrases:['嗓子疼','保护嗓子'],example:'她感冒了，嗓子有点儿疼。',examplePinyin:'Tā gǎnmào le, sǎngzi yǒudiǎnr téng.'},{hanzi:'咳嗽',pinyin:'késou',english:'cough',phrases:['一直咳嗽','有点儿咳嗽'],example:'如果一直咳嗽，就应该去看医生。',examplePinyin:'Rúguǒ yìzhí késou, jiù yīnggāi qù kàn yīshēng.'}],sentence:'同学关心地问他是不是感冒了，还提醒他注意休息。',sampleAnswers:[
      {hanzi:'你还好吗？耳朵是不是很疼？',pinyin:'Nǐ hái hǎo ma? Ěrduo shì bu shì hěn téng?'},
      {hanzi:'谢谢关心，我会注意休息的。',pinyin:'Xièxie guānxīn, wǒ huì zhùyì xiūxi de.'}
    ]},
    {title:'测量体温并休息',talkHint:'先聊聊，不着急给答案。',prompt:'什么时候应该先休息？什么时候应该去看医生？',promptPinyin:'Shénme shíhou yīnggāi xiān xiūxi? Shénme shíhou yīnggāi qù kàn yīshēng?',image:img('photo-text-2-temperature-rest'),labels:[{word:'发烧',x:13,y:14,targetX:38,targetY:46},{word:'低',x:87,y:84,targetX:38,targetY:46}],words:['发烧','低'],sentence:'她先测量体温，如果还发低烧，就请医生检查。',sampleAnswers:[
      {hanzi:'如果只是有点儿累，可以先休息一下。',pinyin:'Rúguǒ zhǐshì yǒudiǎnr lèi, kěyǐ xiān xiūxi yíxià.'},
      {hanzi:'如果一直发烧，应该去看医生。',pinyin:'Rúguǒ yìzhí fāshāo, yīnggāi qù kàn yīshēng.'}
    ]}
  ]},
  3:{title:'住院、检查与朋友探望',subtitle:'从突然住院到医生检查，用时间表达和关心语言讲清楚经历。',steps:[
    {title:'朋友来探望',talkHint:'先聊聊，不着急给答案。',prompt:'如果朋友突然住院了，你会对他说什么？',promptPinyin:'Rúguǒ péngyou tūrán zhùyuàn le, nǐ huì duì tā shuō shénme?',image:img('photo-text-3-hospital-visit'),labels:[{word:'突然',x:12,y:13,targetX:87,targetY:38},{word:'住院',x:88,y:13,targetX:25,targetY:62},{word:'担心',x:12,y:84,targetX:76,targetY:57},{word:'开心',x:88,y:84,targetX:27,targetY:45}],words:['突然','住院','担心','开心'],sentence:'他突然住院了，朋友很担心；看到朋友以后，他开心多了。',sampleAnswers:[
      {hanzi:'别担心，好好休息，祝你早日恢复。',pinyin:'Bié dānxīn, hǎohāo xiūxi, zhù nǐ zǎorì huīfù.'},
      {hanzi:'有人来看你，你是不是开心多了？',pinyin:'Yǒurén lái kàn nǐ, nǐ shì bu shì kāixīn duō le?'}
    ]},
    {title:'医生检查腿部',talkHint:'先聊聊，不着急给答案。',prompt:'怎么告诉医生你不舒服？',promptPinyin:'Zěnme gàosu yīshēng nǐ bù shūfu?',image:img('photo-text-3-leg-check'),labels:[{word:'腿',x:12,y:84,targetX:57,targetY:60},{word:'病人',x:88,y:13,targetX:77,targetY:63},{word:'差不多',x:12,y:13,targetX:27,targetY:20},{word:'得',x:88,y:84,targetX:42,targetY:48}],words:['腿','病人','差不多','得'],sentence:'病人的腿疼了几个星期，还得做完检查；上次来医院已经差不多两年了。',sampleAnswers:[
      {hanzi:'我的腿疼得厉害。',pinyin:'Wǒ de tuǐ téng de lìhai.'},
      {hanzi:'我走不了路了，一站就疼。',pinyin:'Wǒ zǒu bùliǎo lù le, yí zhàn jiù téng.'},
      {hanzi:'我的腿没受伤，也没出血。',pinyin:'Wǒ de tuǐ méi shòushāng, yě méi chūxuè.'},
      {hanzi:'我打篮球的时候，腿受伤了。',pinyin:'Wǒ dǎ lánqiú de shíhou, tuǐ shòushāng le.'}
    ]}
  ]},
  4:{title:'出院安排与居家恢复',subtitle:'先听医生说明，再把睡前、饭后和休息安排整理清楚。',steps:[
    {title:'出院前听医生说明',talkHint:'先聊聊，不着急给答案。',prompt:'出院以后，怎样才能记住什么时候吃药？',promptPinyin:'Chūyuàn yǐhòu, zěnyàng cái néng jìzhù shénme shíhou chī yào?',image:img('photo-text-4-discharge-plan'),labels:[{word:'出院',x:88,y:13,targetX:72,targetY:18},{word:'开',x:12,y:84,targetX:31,targetY:72},{word:'种',x:87,y:84,targetX:38,targetY:72}],words:['出院','开','种'],sentence:'出院前，医生开了几种药，并认真说明了安排。',sampleAnswers:[
      {hanzi:'我会把医生说的时间记下来。',pinyin:'Wǒ huì bǎ yīshēng shuō de shíjiān jì xiàlai.'},
      {hanzi:'出院前要确认每一种药怎么使用。',pinyin:'Chūyuàn qián yào quèrèn měi yì zhǒng yào zěnme shǐyòng.'}
    ]},
    {title:'在家整理恢复计划',talkHint:'先聊聊，不着急给答案。',prompt:'我该怎么吃药？',promptPinyin:'Wǒ gāi zěnme chī yào?',image:img('photo-text-4-home-recovery'),labels:[{word:'方法',x:12,y:13,targetX:47,targetY:25},{word:'其他',x:88,y:84,targetX:85,targetY:69},{word:'心里',x:12,y:84,targetX:31,targetY:47}],words:['方法','其他','心里'],sentence:'她把吃药和休息的方法记在心里，也整理好其他安排。',sampleAnswers:[
      {hanzi:'“睡觉前一次”是每天睡觉以前吃一次。',pinyin:'“Shuìjiào qián yí cì” shì měitiān shuìjiào yǐqián chī yí cì.'},
      {hanzi:'我会用日历记住其他安排。',pinyin:'Wǒ huì yòng rìlì jìzhù qítā ānpái.'}
    ]}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {
    session:'A',title:'建立健康运动习惯',titleEn:'Build and Continue a Healthy Exercise Habit',
    words:['最近','常','体育馆','习惯','胖','健康','以后','羽毛球'],
    image:img('photo-text-1-gym'),
    introEn:'Learn to describe recent exercise habits, health changes and plans after class. 下去 shows that an action or state continues from now on.',
    recognition:[
      q('a_rec_01','“最近”的意思是什么？','Choose the meaning of 最近.',['recently','always','hospital','method'],'recently'),
      q('a_rec_02','哪个词表示“gymnasium”？','Choose the word for gymnasium.',['体育馆','羽毛球','习惯','健康'],'体育馆'),
      q('a_rec_03','哪个词可以和“打”组成一种运动？','Choose the sport used after 打.',['羽毛球','最近','胖','以后'],'羽毛球'),
      q('a_rec_04','“常”最接近哪个英文？','Choose the meaning of 常.',['often','after','low','suddenly'],'often'),
      q('a_rec_05','“健康”的反义情境是哪一个？','Choose the situation that is not healthy.',['每天只睡三小时','每天适量运动','按时吃饭','注意休息'],'每天只睡三小时')
    ],
    matchWords:['最近','体育馆','习惯','健康','羽毛球'],
    contexts:[
      ['我____常去体育馆跑步。','最近',['最近','其他','突然','差不多']],
      ['每天运动已经成了我的____。','习惯',['习惯','方法','耳朵','病人']],
      ['下课____我们一起打羽毛球吧。','以后',['以后','低','常','心里']],
      ['为了保持____，他每周运动三次。','健康',['健康','开心','胖','最近']],
      ['我不能再胖____了。','下去',['下去','以前','起来','回来']]
    ],
    challenge:[
      q('a_ch_01','我最近____去体育馆。','Choose the best word.',['常','种','低','其他'],'常'),
      q('a_ch_02','哪个短语表示“exercise habit”？','Choose the phrase.',['运动习惯','吃药方法','低烧','住院检查'],'运动习惯'),
      q('a_ch_03','“下课以后”表示什么时候？','Choose the meaning.',['after class','before class','during class','last class'],'after class'),
      q('a_ch_04','我今年胖了，不能再胖____了。','Complete the sentence.',['下去','以前','以后','起来'],'下去'),
      q('a_ch_05','邀请同学一起运动，哪一句最自然？','Choose the natural invitation.',['你也来玩吧。','你突然住院吧。','你发低烧吧。','你开药吧。'],'你也来玩吧。'),
      q('a_ch_06','“我打得不怎么样”通常表示什么？','Choose the meaning.',['I do not play very well.','I never play.','I am a coach.','I feel ill.'],'I do not play very well.'),
      q('a_ch_07','选择正确的时间顺序。','Choose the correct sequence.',['下课以后打羽毛球','打羽毛球以后下课','下课前已经回家','体育馆以后下课'],'下课以后打羽毛球'),
      q('a_ch_08','哪个句子表示把好习惯继续保持？','Choose the sentence.',['我要把运动坚持下去。','我要突然住院。','我要发低烧。','我要开几种药。'],'我要把运动坚持下去。'),
      q('a_ch_09','“保持健康”最适合什么做法？','Choose the suitable action.',['适量运动并休息','每天不睡觉','自己随便吃药','一直不吃饭'],'适量运动并休息'),
      q('a_ch_10','“你最近常去体育馆吗？”在问什么？','Choose the meaning.',['recent gym habits','hospital discharge','medicine timing','leg examination'],'recent gym habits')
    ]
  },
  {
    session:'B',title:'关心身体不舒服的同学',titleEn:'Show Concern and Discuss What to Do',
    words:['耳朵','感冒','发烧','低','关心','注意'],
    image:img('photo-text-2-ear-care'),
    introEn:'Describe mild symptoms, ask how someone feels, and give general suggestions such as resting or asking a doctor to check. Do not diagnose classmates.',
    recognition:[
      q('b_rec_01','哪个词表示“ear”？','Choose the word for ear.',['耳朵','腿','心里','方法'],'耳朵'),
      q('b_rec_02','“发低烧”是什么意思？','Choose the meaning.',['have a low fever','feel very happy','play badminton','leave hospital'],'have a low fever'),
      q('b_rec_03','同学不舒服时，可以怎么表示“concern”？','Choose the word.',['关心','开','种','胖'],'关心'),
      q('b_rec_04','哪个词表示“pay attention”？','Choose the word.',['注意','感冒','其他','差不多'],'注意'),
      q('b_rec_05','“感冒”是哪一种情况？','Choose the health expression.',['a cold','a gym','a method','a habit'],'a cold')
    ],
    matchWords:['耳朵','感冒','发烧','关心','注意'],
    contexts:[
      ['游泳以后，我的____有点儿疼。','耳朵',['耳朵','腿','方法','体育馆']],
      ['他好像____了，一直打喷嚏。','感冒',['感冒','出院','开心','健康']],
      ['如果下午还____，就要去看医生。','发烧',['发烧','羽毛球','关心','心里']],
      ['谢谢你的____，我会休息的。','关心',['关心','以后','方法','病人']],
      ['你要多____身体。','注意',['注意','常','胖','种']]
    ],
    challenge:[
      q('b_ch_01','昨天游____泳以后，耳朵有点儿疼。','Complete the separable word.',['完','后','低','种'],'完'),
      q('b_ch_02','“游完泳”中“完”放在哪里？','Choose the position.',['游和泳之间','整个词前面','整个词后面','句子最后'],'游和泳之间'),
      q('b_ch_03','哪一句是礼貌的关心？','Choose the polite concern.',['你还好吗？要不要休息一下？','你一定知道是什么病。','你自己随便吃药吧。','你不要告诉医生。'],'你还好吗？要不要休息一下？'),
      q('b_ch_04','“昨天游泳以后”表示什么？','Choose the meaning.',['after swimming yesterday','before swimming yesterday','during class','next year'],'after swimming yesterday'),
      q('b_ch_05','如果下午还发烧，合适的做法是什么？','Choose the suitable action.',['请医生检查','继续剧烈运动','自己作诊断','不告诉任何人'],'请医生检查'),
      q('b_ch_06','“发低烧”的“低”说明什么？','Choose the meaning.',['temperature is not very high','the room is low','the price is low','the voice is low'],'temperature is not very high'),
      q('b_ch_07','我想先睡____觉。','Complete the separable word.',['一会儿','以后','方法','差不多'],'一会儿'),
      q('b_ch_08','“谢谢关心，我会注意的”表达什么？','Choose the meaning.',['accepting concern and promising care','inviting someone to exercise','asking a price','leaving hospital'],'accepting concern and promising care'),
      q('b_ch_09','哪一句不作医学诊断？','Choose the general suggestion.',['如果还不舒服，可以请医生检查。','你一定得了某种病。','不用医生，我知道原因。','随便吃一种药就好。'],'如果还不舒服，可以请医生检查。'),
      q('b_ch_10','“跑一个小时步”说明什么规则？','Choose the rule.',['补语放在离合词中间','补语放在主语前','不能使用时量','步放在句首'],'补语放在离合词中间')
    ]
  },
  {
    session:'C',title:'理解住院、出院与恢复安排',titleEn:'Understand Hospital Experience and Recovery Instructions',
    words:['突然','住院','担心','腿','病人','差不多','得','开心','出院','开','种','方法','其他','心里'],
    image:img('photo-text-3-hospital-visit'),
    introEn:'Retell a hospital experience and understand a simple doctor-provided recovery schedule. Medicine timing is language practice only; always follow professional instructions.',
    recognition:[
      q('c_rec_01','哪个词表示“be in hospital”？','Choose the word.',['住院','出院','体育馆','羽毛球'],'住院'),
      q('c_rec_02','哪个词表示“leave hospital”？','Choose the word.',['出院','感冒','习惯','低'],'出院'),
      q('c_rec_03','“得”在“还得检查”中表示什么？','Choose the meaning.',['have to','very happy','almost','other'],'have to'),
      q('c_rec_04','“差不多两年”是什么意思？','Choose the meaning.',['almost two years','exactly two days','after dinner','before sleep'],'almost two years'),
      q('c_rec_05','医生“开药”是什么意思？','Choose the meaning.',['prescribe medicine','open a door','play sports','visit a friend'],'prescribe medicine')
    ],
    matchWords:['住院','担心','差不多','出院','方法','心里'],
    contexts:[
      ['他昨天____住院了，大家都没有想到。','突然',['突然','最近','常','其他']],
      ['医生说还____做完检查。','得',['得','种','低','胖']],
      ['朋友来看我，我就____多了。','开心',['开心','健康','感冒','担心']],
      ['医生告诉了我吃药的____。','方法',['方法','体育馆','习惯','羽毛球']],
      ['医生的话我都记在____了。','心里',['心里','耳朵','腿','以后']]
    ],
    challenge:[
      q('c_ch_01','我上次来医院已经差不多两年____。','Complete the elapsed-time sentence.',['了','前','后','以前'],'了'),
      q('c_ch_02','“他出院五天了”表示什么？','Choose the meaning.',['Five days have passed since discharge.','He stayed five days in hospital.','He will leave in five days.','He takes medicine five times.'],'Five days have passed since discharge.'),
      q('c_ch_03','医生检查的是哪里？','Choose the body part from the text.',['腿','耳朵','心里','体育馆'],'腿'),
      q('c_ch_04','“出院前”表示什么时候？','Choose the meaning.',['before leaving hospital','after going home','during exercise','two years later'],'before leaving hospital'),
      q('c_ch_05','一种药什么时候吃一次？','Choose the schedule from the text.',['每天睡前','每天饭前三次','运动以后','住院以前'],'每天睡前'),
      q('c_ch_06','其他几种药什么时候吃？','Choose the schedule from the text.',['饭后','睡前一次','跑步以前','下课以后'],'饭后'),
      q('c_ch_07','医生说最重要的是什么？','Choose the advice from the text.',['多休息','多跑步','自己改用药方法','不看医生'],'多休息'),
      q('c_ch_08','“我都记在心里了”表示什么？','Choose the meaning.',['I remembered the instructions.','My heart hurts.','I forgot the method.','I want another medicine.'],'I remembered the instructions.'),
      q('c_ch_09','哪一句正确使用“以后”？','Choose the correct sentence.',['回家以后，我会多注意。','以后回家前我昨天。','我以后饭三次。','医生以后开一种。'],'回家以后，我会多注意。'),
      q('c_ch_10','如果没有听懂用药安排，合适的做法是什么？','Choose the responsible action.',['请医生或药师再说明','自己猜','问不懂医学的同学决定','随便改变次数'],'请医生或药师再说明')
    ]
  }
];

function mission(spec, index) {
  const prefix = spec.session.toLowerCase();
  const vocabCards = spec.words.map(card);
  const pairs = spec.matchWords.map((hanzi, i) => ({id:prefix + '_pair_' + String(i + 1).padStart(2, '0'),word:hanzi,meaning:word(hanzi).english}));
  const contextQuestions = spec.contexts.map((item, i) => q(prefix + '_ctx_' + String(i + 1).padStart(2, '0'),item[0],'Choose the best expression for the context.',item[2],item[1]));
  return {
    id:'pm_hsk3_l08_' + prefix,session:spec.session,pilotMode:'ranked_vocab_preview_v1',
    title:'第' + (index + 1) + '次课课前热身赛',titleEn:spec.title,subtitleEn:'Five stages prepare you for the next classroom task.',
    scenario:spec.title,goals:[spec.title,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],
    storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:spec.introEn,
    stages:[
      {id:prefix + '1',title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先听、读并理解本次课的词语和背景。',screenPromptEn:spec.introEn,interactionType:'study_list',photos:[spec.image],keywordCards:vocabCards},
      {id:prefix + '2',title:'快速认词',titleEn:'Recognition',screenPrompt:'根据词义或情境选择答案。',screenPromptEn:'Choose the word or meaning that fits.',interactionType:'practice_quiz',questions:spec.recognition},
      {id:prefix + '3',title:'汉英配对',titleEn:'Chinese-English Match',screenPrompt:'把中文词语和英文意思配对。',screenPromptEn:'Match each Chinese card with its English meaning.',interactionType:'timed_match',pairs:pairs},
      {id:prefix + '4',title:'语境判断',titleEn:'Context Check',screenPrompt:'把词语放回完整语境。',screenPromptEn:'Choose the expression that completes each context.',interactionType:'practice_quiz',questions:contextQuestions},
      {id:prefix + '5',title:'正式挑战',titleEn:'Scored Challenge',screenPrompt:'独立完成10题正式挑战。',screenPromptEn:'Complete the 10-question scored challenge.',interactionType:'ranked_quiz',questions:spec.challenge}
    ],
    completionMessageEn:'Preview complete. Bring one useful sentence to class.'
  };
}

const fills = [
  {id:'l08_fill_group_01',type:'vocab_fill_group',stage:'in_class',contentRole:'lesson',prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:['最近','常','体育馆','习惯','羽毛球'],wordBank_pinyin:['zuìjìn','cháng','tǐyùguǎn','xíguàn','yǔmáoqiú'],sentences:[
    {sentence:'我____工作很忙，只有周末能去运动。',answer:'最近'},
    {sentence:'他下课以后____跟同学去打球，已经坚持半年了。',answer:'常'},
    {sentence:'外面下雨了，体育课改到学校的____里上。',answer:'体育馆'},
    {sentence:'刚开始早睡不容易，坚持一个月就会变成____。',answer:'习惯'},
    {sentence:'跑步以后，他们又在旁边的场地打了半个小时____。',answer:'羽毛球'}
  ],speakingOutput:{support:'任选两个词完成一句话。',core:'用三个词说两句话。',stretch:'用五个词完成30秒运动计划。'}}},
  {id:'l08_fill_group_02',type:'vocab_fill_group',stage:'in_class',contentRole:'transfer',prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:['耳朵','感冒','发烧','关心','注意'],wordBank_pinyin:['ěrduo','gǎnmào','fāshāo','guānxīn','zhùyì'],sentences:[
    {sentence:'游完泳以后，他觉得____里面一直不太舒服。',answer:'耳朵'},
    {sentence:'天气突然变冷，他没多穿衣服，好像____了。',answer:'感冒'},
    {sentence:'他下午还是觉得很热，可能还在____。',answer:'发烧'},
    {sentence:'安妮问了好几次他的身体情况，真的很____他。',answer:'关心'},
    {sentence:'医生让他回家以后多休息，也要____身体的变化。',answer:'注意'}
  ],speakingOutput:{support:'选择一句读完整。',core:'说明症状和一个建议。',stretch:'用五个词完成一段关心对话。'}}},
  {id:'l08_fill_group_03',type:'vocab_fill_group',stage:'in_class',contentRole:'review',prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:['适合','合适','突然','差不多','方法'],wordBank_pinyin:['shìhé','héshì','tūrán','chàbuduō','fāngfǎ'],sentences:[
    {sentence:'这种运动很____刚开始锻炼的人。',answer:'适合'},
    {sentence:'每天运动三十分钟比较____。',answer:'合适'},
    {sentence:'他昨天____住院了。',answer:'突然'},
    {sentence:'我上次来医院已经____两年了。',answer:'差不多'},
    {sentence:'医生告诉了我休息和用药的____。',answer:'方法'}
  ],speakingOutput:{support:'读出一个完整句子。',core:'比较“适合”和“合适”。',stretch:'用三个词解释一个恢复计划。'}}}
];

const matchGroups = [
  {id:'l08_match_01',type:'word_match',stage:'in_class',contentRole:'lesson',prompt_en:'Match each question with the best answer.',data:{pairs:[
    {left:'你最近还常去体育馆锻炼身体吗？',right:'常去，我现在每周去三次，已经坚持一个月了。'},
    {left:'你平时最习惯做哪一种运动？',right:'我最习惯跑步，周末也会和朋友打羽毛球。'},
    {left:'你为什么突然开始认真运动了？',right:'因为我今年胖了不少，觉得不能再胖下去了。'},
    {left:'下课以后我们一起去体育馆打球，好吗？',right:'好啊，我正想学习羽毛球，请你先教教我。'},
    {left:'你觉得自己的羽毛球水平怎么样？',right:'我打得还不怎么样，不过我想继续练下去。'}
  ]}},
  {id:'l08_match_02',type:'word_match',stage:'in_class',contentRole:'transfer',prompt_en:'Match each concern with the best response.',data:{pairs:[
    {left:'你今天看上去不太舒服，到底怎么了？',right:'我游完泳以后，耳朵一直有点儿疼。'},
    {left:'你的耳朵是从什么时候开始疼的？',right:'昨天游完泳以后开始疼，到现在还没好。'},
    {left:'除了耳朵疼，你是不是也有点儿发烧？',right:'好像有一点儿低烧，身体也不太舒服。'},
    {left:'你现在想先休息，还是马上去医院？',right:'我想先回去睡一会儿觉，下午再看看。'},
    {left:'如果下午休息以后还发烧，你打算怎么办？',right:'那我一定去医院，请医生认真检查一下。'}
  ]}},
  {id:'l08_match_03',type:'word_match',stage:'in_class',contentRole:'review',prompt_en:'Match each recovery question with the answer.',data:{pairs:[
    {left:'医生说你今天什么时候能出院？',right:'医生说检查没有问题，今天下午就可以出院。'},
    {left:'出院以前，医生给你开了什么药？',right:'医生给我开了几种药，还告诉了我吃药的方法。'},
    {left:'那一种每天睡觉以前吃的药，应该吃几次？',right:'按医生的说明，每天睡觉前只吃一次。'},
    {left:'其他几种药应该在什么时候吃？',right:'其他几种每天吃三次，而且都要在饭后吃。'},
    {left:'回家恢复的时候，医生说最重要的是什么？',right:'除了按时吃药，最重要的是多休息并注意身体。'}
  ]}}
];

const orders = [
  ['l08_order_01','我最近常去体育馆跑步。',['我','最近','常去','体育馆跑步'],'lesson'],
  ['l08_order_02','昨天游完泳以后，我的耳朵有点儿疼。',['昨天','游完泳以后','我的耳朵','有点儿疼'],'lesson'],
  ['l08_order_03','他上次来医院已经差不多两年了。',['他上次来医院','已经','差不多','两年了'],'transfer'],
  ['l08_order_04','出院前，医生告诉了我吃药的方法。',['出院前','医生','告诉了我','吃药的方法'],'transfer'],
  ['l08_order_05','这种运动很适合刚开始练习的人。',['这种运动','很适合','刚开始练习的','人'],'review']
].map(item => ({id:item[0],type:'ordering',stage:'in_class',contentRole:item[3],prompt_cn:'把语块排成一个完整、自然的句子。',prompt_en:'Put the chunks in order to make a complete sentence.',correct_answer:item[1],data:{chunks:item[2],chunks_pinyin:item[2].map(() => '')}}));

const readRows = [
  ['新的运动习惯','马丁最近觉得身体有点儿不健康，所以开始每周三次去体育馆。他水平不高，但是朋友愿意教他打羽毛球。他希望把这个习惯坚持下去。','马丁为什么开始运动？','因为他觉得身体有点儿不健康。','lesson'],
  ['游泳以后','小雨周末游完泳以后，耳朵有点儿不舒服。她先休息了一会儿，如果下午还不舒服，就请医生检查。','小雨准备什么时候请医生检查？','如果下午还不舒服。','lesson'],
  ['探望朋友','同学突然住院了，大家都很担心。去医院以前，他们先问了什么时候方便，还准备了一张卡片。朋友看到他们以后开心多了。','大家去医院以前先做了什么？','先问了什么时候方便。','transfer'],
  ['回家三天了','安东出院三天了。他把医生说的安排记在日历上，按时休息，也按医生的说明用药。','安东出院多长时间了？','三天了。','transfer'],
  ['适合还是合适','小林想改善生活习惯。跑步很适合他，但是每天跑两个小时不太合适，所以他决定每次跑三十分钟。','什么不太合适？','每天跑两个小时不太合适。','review']
];
const readPassages = readRows.map((item, index) => ({id:'l08_read_' + String(index + 1).padStart(2, '0'),type:'passage_reading',stage:'in_class',contentRole:item[4],prompt_cn:'阅读小篇章，回答问题。',prompt_en:'Read and answer.',data:{title:item[0],passage:item[1],questions:[{question_cn:item[2],answer:item[3]}]}}));
const independent = readRows.map((item, index) => {
  const distractors = ['因为他要买一条裙子。','因为体育馆已经关门了。','因为他想问水果多少钱。'];
  const options = [item[3]].concat(distractors);
  return {id:'l08_ind_read_' + String(index + 1).padStart(2, '0'),type:'choice',stage:'in_class',contentRole:item[4],prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:item[0],passage:item[1],question_cn:item[2],options,correct_index:0},correct_answer:item[3]};
});

const taskRows = [
  ['运动习惯采访','采访同伴最近的运动习惯。',['最近','常','习惯','健康'],['你最近常做什么运动？','为什么想继续？','下课以后有什么计划？'],'每人说3—4句话。'],
  ['关心同学','一人扮演身体不舒服的同学，一人表示关心。',['耳朵','发烧','关心','注意'],['询问情况','询问发生时间','给出休息或看医生的建议'],'完成4轮对话。'],
  ['探望计划','小组计划怎样探望住院的朋友。',['住院','担心','病人','开心'],['先确认时间','选择合适的话','说明可以提供的帮助'],'每组说明计划。'],
  ['恢复时间线','用时间线说明住院、检查、出院和回家。',['差不多','得','出院','以后'],['说出事件顺序','使用一个时量补语','使用前或后'],'每人说4句话。'],
  ['合适的计划','比较两种生活方式，选择更合适的一种。',['适合','合适','方法','健康'],['比较时间安排','说明适合谁','解释选择原因'],'两人完成1分钟讨论。']
];
const taskCards = taskRows.map((item, index, all) => ({id:'l08_task_' + String(index + 1).padStart(2, '0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'任务卡：' + item[0] + '。',prompt_en:item[0],openEnded:true,needsTeacherReview:true,data:{title:item[0],titleEn:item[0],role:item[1],steps:item[3],keywords:item[2],output:item[4],answerPlaceholder:'请写下课堂表达。'}}));

const sceneRows = [
  ['A student has started going to the gym three times a week.','Use 最近 and 常.','我最近常去体育馆。','lesson'],
  ['A classmate wants to continue a healthy habit.','Use 坚持下去.','他想把这个健康习惯坚持下去。','lesson'],
  ['A student finishes swimming and then feels ear pain.','Use 游完泳以后.','游完泳以后，他的耳朵有点儿疼。','lesson'],
  ['A friend still has a fever in the afternoon.','Give a general suggestion.','如果下午还发烧，就请医生检查。','lesson'],
  ['Friends arrive to visit a patient.','Use 担心 and 开心.','大家很担心他，看到朋友以后他开心多了。','lesson'],
  ['The last hospital visit was almost two years ago.','Use 差不多 and 了.','他上次来医院已经差不多两年了。','transfer'],
  ['A doctor explains a plan before discharge.','Use 出院前.','出院前，医生告诉了他恢复的方法。','transfer'],
  ['The patient checks the schedule after returning home.','Use 回家以后.','回家以后，她认真整理了休息计划。','transfer'],
  ['A running plan works well for one person.','Review 适合.','这个运动计划很适合他。','review'],
  ['Two hours every day is not an appropriate amount.','Review 合适.','每天运动两个小时不太合适。','review']
];
const sceneChoices = sceneRows.map((item, index) => {
  const options = [item[2],'服务员给我们拿来了菜单。','这条裙子的大小很合适。','机场离宾馆比较近。'];
  return {id:'l08_scene_' + String(index + 1).padStart(2, '0'),type:'scene_sentence_choice',stage:'in_class',contentRole:item[3],prompt_en:'Choose the best sentence for the scene.',data:{scene_en:item[0],clue_en:item[1],options,correct_index:0},correct_answer:item[2]};
});

const guessRows = [
  ['体育馆','学校里可以跑步、打球和锻炼身体的地方。'],
  ['习惯','常常这样做，慢慢变成每天生活的一部分。'],
  ['羽毛球','这是一种球，不像篮球那么大，也不像乒乓球那么小。'],
  ['耳朵','在头的两边，可以帮助我们听声音。'],
  ['关心','朋友不舒服时，问他怎么样并愿意帮助他。'],
  ['住院','病人需要在医院里接受检查或照顾。'],
  ['担心','不知道朋友怎么样，心里不放心。'],
  ['出院','病人结束住院，可以回家了。'],
  ['方法','做一件事时使用的办法。'],
  ['合适','大小、时间或安排正好，没有问题。']
];
const guesses = guessRows.map((item,index,all) => ({id:'l08_desc_' + String(index + 1).padStart(2, '0'),type:'description_guess',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'读完整提示，联系语境猜词。',prompt_en:'Read the full clue and guess the word.',data:{description:item[1],options:[item[0],'裙子','机场','菜单'],correct_index:0},correct_answer:item[0]}));

const sayRows = [
  ['体育馆',['运动','跑步','室内场地']],
  ['羽毛球',['球拍','球网','两个人']],
  ['耳朵',['身体','听声音','头的两边']],
  ['关心',['朋友','不舒服','问候']],
  ['住院',['医院','病人','检查']],
  ['担心',['心里','不知道结果','朋友']],
  ['出院',['医院','回家','结束住院']],
  ['方法',['怎么做','步骤','解决问题']]
];
const sayGuess = sayRows.map((item,index,all) => ({id:'l08_say_' + String(index + 1).padStart(2, '0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:item[0],boardIndex:index + 1,clues:[],scaffold:{words:item[1],frames:['这是一个……。','人们在这里 / 用它……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));

const blindRows = [
  [['最近','习惯'],'我最近养成了每天运动的习惯。'],
  [['游完泳','以后'],'游完泳以后，我先休息了一会儿。'],
  [['差不多','了'],'我上次来医院已经差不多两年了。'],
  [['适合','合适'],'跑步很适合他，但是每天跑两小时不太合适。']
];
const blind = blindRows.map((item,index,all) => ({id:'l08_blind_' + String(index + 1).padStart(2, '0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:item[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:item[1]}}));

const pictureRows = [
  ['photo-text-1-gym','最近、常'],
  ['photo-text-1-badminton','健康、下去'],
  ['photo-text-2-ear-care','耳朵、关心'],
  ['photo-text-2-temperature-rest','发烧、注意'],
  ['photo-text-3-hospital-visit','住院、担心'],
  ['photo-text-3-leg-check','腿、得'],
  ['photo-text-4-discharge-plan','出院前、开'],
  ['photo-text-4-home-recovery','回家以后、方法']
];
const pictureComplete = pictureRows.map((item,index,all) => ({id:'l08_pic_' + String(index + 1).padStart(2, '0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the target expressions to write one complete sentence about the photo.',data:{image:img(item[0]),keyword:item[1],task:'观察图片，用关键词写一个完整、自然的句子。',answerPlaceholder:'写一个完整的中文句子。'}}));

const paragraphRows = [
  ['新的运动习惯',['陈天中今年胖了十多斤。','____1____','所以他最近常去体育馆。','____2____','李文邀请他下课以后一起打羽毛球。','____3____'],['他觉得这样有点儿不健康。','他每天下午跑一个小时步。','虽然水平不高，他还是愿意学下去。'],['他觉得这样比以前健康多了。','他每天晚上在宿舍看一个小时电视。','虽然水平不高，他决定以后不再运动了。'],'lesson'],
  ['身体不舒服',['昨天陈天中游完泳。','____1____','他好像还有一点儿低烧。','____2____','陈天中想先回去睡一会儿觉。','____3____'],['以后耳朵一直有点儿疼。','安妮想送他去医院检查。','如果下午还发烧，他就去看医生。'],['以后耳朵一点儿也不疼了。','安妮说发低烧的时候一定不能休息。','如果下午不发烧，他就马上住院。'],'lesson'],
  ['住院以后',['陈天中的腿疼了几个星期。','____1____','朋友们知道以后都很担心。','____2____','医生还得做完检查。','____3____'],['医生让他住院。','安妮去医院看他。','他听医生的话，好好休息。'],['医生说他的腿完全没有问题，不用检查。','安妮听说以后一点儿也不担心。','他决定不听医生的话，马上去运动。'],'transfer'],
  ['出院安排',['今天陈天中出院了。','____1____','一种药需要每天睡前吃一次。','____2____','医生还说最重要的是休息。','____3____'],['出院前医生开了几种药。','其他几种每天饭后吃三次。','他把这些安排都记在心里。'],['出院前医生没有告诉他任何安排。','其他几种药每天睡前只吃一次。','他觉得不用记住这些吃药时间。'],'transfer'],
  ['更合适的计划',['小王想养成健康习惯。','____1____','每天跑两个小时对他来说太累。','____2____','朋友建议他每次跑三十分钟。','____3____'],['跑步很适合他。','这个时间安排不太合适。','他决定把新计划坚持下去。'],['跑步不太适合他，所以他每天跑两个小时。','这个时间安排很合适，他一点儿也不累。','他决定继续每天跑两个小时。'],'review']
];
const paragraphOptionOrders = [[3,0,4,1,5,2],[1,3,5,0,4,2],[4,2,0,5,1,3],[2,4,0,3,1,5],[5,1,3,2,0,4]];
const paragraphs = paragraphRows.map((item,index) => {
  const sourceOptions = item[2].concat(item[3]);
  const order = paragraphOptionOrders[index];
  return {id:'l08_para_' + String(index + 1).padStart(2, '0'),type:'open_response',stage:'in_class',contentRole:item[4],prompt_cn:'段落填空。',prompt_en:'Choose three sentences to complete the paragraph.',openEnded:true,needsTeacherReview:true,data:{title:item[0],passageParts:item[1],options:order.map(i => sourceOptions[i]),answers:[0,1,2].map(i => order.indexOf(i)),instructions:'点击句子，再点击对应空格。',answerPlaceholder:''}};
});

const chainRows = [
  ['坚持运动的新习惯','陈天中最近开始常去体育馆',['跑步','习惯','健康','羽毛球','坚持下去'],['pǎobù','xíguàn','jiànkāng','yǔmáoqiú','jiānchí xiàqu']],
  ['游泳以后不舒服','昨天陈天中游完泳以后',['耳朵','发烧','关心','注意','看医生'],['ěrduo','fāshāo','guānxīn','zhùyì','kàn yīshēng']],
  ['朋友突然住院了','安妮听说陈天中突然住院了',['担心','看望','腿','检查','开心'],['dānxīn','kànwàng','tuǐ','jiǎnchá','kāixīn']],
  ['今天终于出院了','今天陈天中终于出院了',['医生','开药','方法','饭后','多休息'],['yīshēng','kāi yào','fāngfǎ','fàn hòu','duō xiūxi']],
  ['更合适的恢复计划','回家以后，他想安排新的恢复计划',['最近','适合','合适','以后','坚持下去'],['zuìjìn','shìhé','héshì','yǐhòu','jiānchí xiàqu']]
];
const chains = chainRows.map((item,index,all) => ({id:'l08_chain_' + String(index + 1).padStart(2, '0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'五词故事接龙。',prompt_en:'Build one story with five covered words.',openEnded:true,needsTeacherReview:true,data:{title:item[0],starter:item[1],steps:item[2].map((_,k) => `第${k+1}句：使用“${item[2][k]}”继续故事。`),keywords:item[2],keywords_pinyin:item[3],chainModes:['teacher','race','team'],instructions:'五个词先全部盖住，每次打开一个词并接一句，最后形成完整故事。',answerPlaceholder:'用当前打开的词继续故事。'}}));

const battleGames = {
  roulette:[
    {id:'l08_r_01',challenge:'说明最近的运动习惯和变化。',scene:'你最近开始常去体育馆。',keywords:['最近','常','习惯','健康'],sample:'我最近常去体育馆，想把这个健康习惯坚持下去。'},
    {id:'l08_r_02',challenge:'关心身体不舒服的同学。',scene:'同学游完泳以后耳朵疼，还有点儿发烧。',keywords:['耳朵','关心','注意'],sample:'你还好吗？如果下午还发烧，就请医生检查一下。'},
    {id:'l08_r_03',challenge:'叙述一次住院探望。',scene:'朋友突然住院，你去看他。',keywords:['住院','担心','开心'],sample:'我们都很担心他，去医院看他以后，他开心多了。'},
    {id:'l08_r_04',challenge:'说明出院后的恢复安排。',scene:'医生已经说明休息和用药时间。',keywords:['出院','方法','以后'],sample:'出院以后，我会按医生说的方法安排时间，多休息。'}
  ],
  relay:[
    {id:'l08_relay_01',starter:'体育馆',goal:'接一个说明运动习惯的短句。',mustUse:['最近','常']},
    {id:'l08_relay_02',starter:'耳朵',goal:'接一个关心或建议句。',mustUse:['发烧','注意']},
    {id:'l08_relay_03',starter:'住院',goal:'接一个带时量补语的句子。',mustUse:['差不多','了']},
    {id:'l08_relay_04',starter:'出院',goal:'接一个带“前／后”的恢复安排。',mustUse:['以前','以后']}
  ],
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：tǐyùguǎn',answer:'体育馆'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：guānxīn',answer:'关心'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：chūyuàn',answer:'出院'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“习惯”说一个短语。',answer:'运动习惯 / 好习惯'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“担心”说一个短语。',answer:'别担心 / 很担心'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“方法”说一个短语。',answer:'学习方法 / 使用方法'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“发低烧”的“低”是什么意思？',options:['不太高','很开心','很健康'],answer:'不太高'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“他出院三天了”表示什么？',options:['出院到现在三天','住院三天','三天后出院'],answer:'出院到现在三天'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“坚持下去”说一句话。',answer:'我要把这个运动习惯坚持下去。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“游完泳以后”说一句话。',answer:'游完泳以后，我先休息了一会儿。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“出院前”或“回家以后”说一句话。',answer:'出院前，医生告诉了我恢复的方法。'}
  ]}
};

const homework = {
  mode:'hsk3_session_tasks',
  instructions:{
    required:'完成“我的健康恢复计划”的当次准备卡；A和B的材料会用于C的课堂展示。',
    optional:'不需要上传录音。只整理一般生活习惯和医生已提供的信息，不作医学诊断。',
    aiPolicy:'先独立选择图片、生活信息和时间安排，再使用工具检查语言。'
  },
  sessionMeta:{
    A:{label:'健康恢复计划 · 第1步',goal:'选择一个想改善的健康或生活习惯，准备图片并说明现状和改变原因。',suggested_minutes:'10-15分钟',suggested_mix:'完成习惯卡；下次课向同伴说明想继续做下去的事情。'},
    B:{label:'健康恢复计划 · 第2步',goal:'根据身体不舒服或看病场景，整理症状、时间线和一般性建议。',suggested_minutes:'10-15分钟',suggested_mix:'完成信息与时间表；不要求作医学诊断。'},
    C:{label:'课堂最终项目 · 我的健康恢复计划',goal:'整合A和B，完成1—2分钟课堂展示。',suggested_minutes:'15-20分钟',suggested_mix:'不强制上传录音；可小组彩排，但每位学生都要表达。'}
  },
  sessions:{
    A:[
      {id:'post_l08_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'健康恢复计划 1/3 · 选择习惯',required:true,prompt_cn:'你想改善哪一个健康或生活习惯？现在的情况怎么样？',prompt_en:'Choose one health or lifestyle habit you want to improve. Describe the current situation.',answerPlaceholder:'我最近常……。现在的习惯是……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l08_a_plan',type:'project_card',taskLabel:'习惯与改变卡',projectStage:'健康恢复计划 1/3 · 保存到最终展示',required:true,prompt_cn:'准备一张图片，说明现在的情况、需要改变的原因和想继续做下去的事情。',prompt_en:'Prepare one photo. Explain your current situation, why it needs to change, and what you want to keep doing.',answerPlaceholder:'我最近……。这个习惯……，因为……。以后我想……下去。',needsTeacherReview:true,openEnded:true,wordBank:['最近','常','习惯','健康','以后','下去'],picturePrompts:['现在的生活或运动习惯','想改善的地方','想继续做下去的事情'],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'根据句框完成4—5句话。'},
        {label:'标准层 / Core',instruction:'独立说明现状、原因和以后要坚持的计划。'},
        {label:'挑战层 / Challenge',instruction:'比较现在和理想的生活方式，并解释为什么要改变。'}
      ]},
      {id:'post_l08_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · My Habit Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: My Health Habit',prompt_en:'Prepare your habit photo and improvement idea.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring one clear photo connected to a health or lifestyle habit.',
        'Be ready to answer: What do you often do now? Why do you want to change it? What will you continue doing?',
        'Use at least four expressions: 最近, 常, 习惯, 健康, 以后, or 下去.',
        'You may discuss ideas with a partner. No audio upload is required.'
      ],classroomNote:'Keep this habit card. You will use it in your final Health Recovery Plan.'}
    ],
    B:[
      {id:'post_l08_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'健康恢复计划 2/3 · 整理信息',required:true,prompt_cn:'选择一个身体不舒服或看病场景。发生了什么？什么时候开始的？',prompt_en:'Choose a mild illness or doctor-visit scenario. What happened, and when did it begin?',answerPlaceholder:'……以后，我的……有点儿不舒服。',needsTeacherReview:true,openEnded:true},
      {id:'post_l08_b_plan',type:'project_card',taskLabel:'症状与时间安排卡',projectStage:'健康恢复计划 2/3 · 保存时间线和建议',required:true,prompt_cn:'写出症状、发生时间、以前或以后做过什么，以及合适的一般性建议。可以制作简单的休息或医生提供的用药时间表。',prompt_en:'Record the symptom, when it began, what happened before or after, and a suitable general suggestion. You may add a simple rest schedule or a medication schedule already provided by a doctor.',answerPlaceholder:'症状：……；时间：……以前/以后；建议：先……，如果……就请医生检查。',needsTeacherReview:true,openEnded:true,wordBank:['耳朵','感冒','发烧','关心','注意','以前','以后','前','后'],picturePrompts:['身体不舒服或看病场景','事件时间线','休息安排或医生提供的时间说明'],carryFrom:[{session:'A',taskId:'post_l08_a_plan',label:'A · 我的习惯与改变卡'}],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'使用句框写4—5句话，说明症状、时间和一个建议。'},
        {label:'标准层 / Core',instruction:'独立说明发生前后、休息安排和什么时候请医生检查。'},
        {label:'挑战层 / Challenge',instruction:'比较两种处理方式，并解释哪一种更合适；不作医学诊断。'}
      ]},
      {id:'post_l08_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Symptom and Timeline Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Symptom and Timeline',prompt_en:'Prepare the scenario, timeline and general suggestion.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring the habit card from Homework A and one mild health or doctor-visit scenario.',
        'Include: the symptom, when it began, what happened before or after, and one suitable general suggestion.',
        'Use a separable word with a complement and at least one of 以前, 以后, 前, or 后.',
        'Do not diagnose anyone. You may work with a partner. No audio upload is required.'
      ],classroomNote:'Save this timeline and suggestion. You will combine them with Homework A in the final plan.'}
    ],
    C:[
      {id:'post_l08_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'健康恢复计划 3/3 · 组织展示',required:true,prompt_cn:'听众最需要知道哪些信息，才能听懂你的健康恢复计划？',prompt_en:'Which information does your audience need in order to understand your Health Recovery Plan?',answerPlaceholder:'听众需要知道现在的习惯、需要改变的原因、时间安排和建议。',needsTeacherReview:true,openEnded:true},
      {id:'post_l08_c_final',type:'portfolio_final',taskLabel:'最终展示稿',projectStage:'课堂大作业 · 我的健康恢复计划',required:true,prompt_cn:'整合A的习惯卡和B的时间线，准备1—2分钟“我的健康恢复计划”。',prompt_en:'Combine your Habit Card from A and Timeline Card from B into a 1–2 minute My Health Recovery Plan.',answerPlaceholder:'我最近常……。为了保持健康，我不能再……下去了。……以后，我会……。这个计划很适合我，时间也比较合适。',needsTeacherReview:true,openEnded:true,wordBank:['最近','常','习惯','健康','下去','以前','以后','前','后','差不多','适合','合适'],picturePrompts:['现在的生活习惯','想改善的目标','事件时间线','恢复或休息安排'],carryFrom:[
        {session:'A',taskId:'post_l08_a_plan',label:'A · 习惯与改变卡'},
        {session:'B',taskId:'post_l08_b_plan',label:'B · 症状与时间安排卡'}
      ],scaffoldLevels:[
        {label:'基础层 / Support',instruction:'按句框完成4—5句话，说明现状、改变和安排。'},
        {label:'标准层 / Core',instruction:'独立说明现状、原因、时间安排和一般性建议。'},
        {label:'挑战层 / Challenge',instruction:'比较两种生活方式，并解释为什么选择自己的恢复计划。'}
      ]},
      {id:'post_l08_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · My Health Recovery Plan',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Health Recovery Plan',prompt_en:'Present your Health Recovery Plan mainly in class.',presentationTitle:'What You Need to Prepare',presentationPlan:[
        'Bring one to three images plus your Habit Card from A and Timeline Card from B. Include only general health information or instructions already provided by a professional.',
        'Answer: What is your current habit? Why should it change? What happened before or after? What is your new schedule? What general suggestion will you follow?',
        'Use at least six lesson words and at least two structures: 下去, a complement inside a separable word, elapsed time + 了, or 以前/以后/前/后.',
        'Speak for 1–2 minutes. You may prepare in pairs or small groups, but every student must explain one part of the plan.',
        'Present mainly in class. Audio upload is not required.'
      ],classroomNote:'Use the saved work from A and B. Mistakes and weak points stay collapsed until you choose to review them.'}
    ]
  }
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{
    level:'HSK3',lessonId:'L08',lessonKey:'HSK3-L08',title:'今天我出院了',titleEn:'Today I was discharged from the hospital',
    topic:'运动与健康习惯、身体不适、住院出院和恢复安排',
    courseModel:'三次课：建立运动习惯 → 表示关心并说明症状 → 叙述住院出院并完成健康恢复计划',
    sourceTextPolicy:'四篇教材中文和拼音保持原文；课文四使用叙事布局；英文译文、生活文化说明、任务链和练习属于教学扩展。'
  },
  pedagogy:{
    exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},
    speakingParticipation:'主观任务提供基础、标准、挑战三档输出，要求每位组员参与表达；健康场景不作医学诊断。'
  },
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：描述运动习惯与健康变化',textIds:['t_hsk3_l08_01'],previewMissionId:'pm_hsk3_l08_a',focus:['最近的运动情况','健康习惯与变化','下去的继续义','下课以后的计划']},
    {id:'B',title:'第二次课：表示关心并说明身体不适',textIds:['t_hsk3_l08_02'],previewMissionId:'pm_hsk3_l08_b',focus:['症状和发生时间','关心与一般性建议','离合词加补语','事件以前或以后']},
    {id:'C',title:'第三次课：叙述住院出院与恢复安排',textIds:['t_hsk3_l08_03','t_hsk3_l08_04'],previewMissionId:'pm_hsk3_l08_c',focus:['住院检查与朋友探望','动作完成到现在的时量','前后时间表达','医生提供的恢复安排']}
  ],
  vocabScenes:sceneData,
  vocabulary,
  grammar,
  texts,
  grammarTeachingNotes,
  textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(item => [item.id,{session:item.tags[0],phrases:item.phrases}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{
    mode:'preview_mission',missionId:'pm_hsk3_l08_a',
    vocabularyIds:vocabulary.map(item => item.id),
    grammarIds:grammar.map(item => item.id),
    readingData:[{id:'pre_l08_read',title:'健康恢复计划',text:'我最近常运动。游完泳以后要注意休息。出院以后要按照医生的安排恢复。'}]
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
      {id:'l08_info_01',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each person with the information.',data:{people:['李文','陈天中','安妮','医生'],clues:['邀请同学打羽毛球','说明身体情况和住院经历','表示关心并探望朋友','检查身体并说明恢复安排'],answer:['李文-邀请同学打羽毛球','陈天中-说明身体情况和住院经历','安妮-表示关心并探望朋友','医生-检查身体并说明恢复安排']}},
      {id:'l08_info_02',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each time expression with the action.',data:{people:['下课以后','游完泳以后','出院前','回家以后'],clues:['打羽毛球','耳朵开始不舒服','医生说明安排','多注意并休息'],answer:['下课以后-打羽毛球','游完泳以后-耳朵开始不舒服','出院前-医生说明安排','回家以后-多注意并休息']}}
    ],
    pk_question:[
      ['我不能再胖____了。','下去',['下去','以后','起来','回来']],
      ['昨天游____泳以后，耳朵有点儿疼。','完',['完','前','低','种']],
      ['他出院三天____。','了',['了','前','后','以后']]
    ].map((item,index) => ({id:'l08_pk_' + String(index + 1).padStart(2, '0'),type:'choice',prompt_cn:item[0],prompt_en:'Choose the word.',correct_answer:item[1],data:{question_cn:item[0],options:item[2],correct_index:0}})),
    textQa:[],
    pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{
    focus:['运动与健康词汇','下去的继续义','离合词加补语','动作完成后的时量','以前以后与前后','关心表达','住院出院叙述','健康恢复计划'],
    dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],
    recommendationRules:[
      {if:'preClass<0.7',then:'重做对应五步预习并复习错词。'},
      {if:'inClass<0.7||postClass<0.7',then:'用习惯卡和时间线重新完成一次健康恢复计划。'}
    ]
  }
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log('Wrote ' + out);
