const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L07.json');
const img = name => `images/hsk3-l07/${name}.png`;
const roleFor = (index, total) => index < Math.floor(total * .5) ? 'lesson' : index < Math.floor(total * .8) ? 'transfer' : 'review';

const vocabRows = [
  ['辆','liàng','量词','measure word for vehicles','A','这辆自行车有点儿旧了。',['一辆自行车','买两辆车']],
  ['自行车','zìxíngchē','名词','bicycle; bike','A','她每天骑自行车去学校。',['骑自行车','自行车店']],
  ['旧','jiù','形容词','old; used','A','这台电视已经很旧了。',['旧自行车','又旧又小']],
  ['矮','ǎi','形容词','short; low','A','这辆车对她来说太矮了。',['长得矮','又矮又旧']],
  ['试','shì','动词','try; test','A','买以前先试一下。',['试一下','试穿']],
  ['黄色','huángsè','名词','yellow','B','我想试试这条黄色的短裤。',['黄色短裤','黄色裙子']],
  ['短裤','duǎnkù','名词','shorts','B','这条短裤大小很合适。',['一条短裤','穿短裤']],
  ['大小','dàxiǎo','名词','size','B','这件衣服的大小合适吗？',['大小合适','大小不一样']],
  ['合适','héshì','形容词','suitable; fit','B','这条裙子的大小很合适。',['很合适','不太合适']],
  ['裙子','qúnzi','名词','skirt','B','那条裙子比短裤更好看。',['一条裙子','穿裙子']],
  ['更','gèng','副词','more; even more','B','你穿裙子更好看。',['更便宜','更方便']],
  ['决定','juédìng','动词/名词','decide; decision','B','我多看看再决定。',['决定买','做决定']],
  ['西瓜','xīguā','名词','watermelon','C','这个西瓜又大又新鲜。',['一块西瓜','买西瓜']],
  ['新鲜','xīnxiān','形容词','fresh','C','今天的水果很新鲜。',['新鲜水果','又大又新鲜']],
  ['甜','tián','形容词','sweet','C','这块西瓜甜极了。',['很甜','不甜不要钱']],
  ['公斤','gōngjīn','量词','kilogram','C','西瓜五块钱一公斤。',['一公斤','每公斤']],
  ['冰','bīng','动词/名词','chill; ice','C','夏天吃冰西瓜很舒服。',['冰西瓜','冰一下']],
  ['极','jí','副词','extremely','C','这个水果甜极了。',['好吃极了','喜欢极了']],
  ['斤','jīn','量词','jin; 500 grams','C','请给我两斤香蕉。',['一斤苹果','两斤香蕉']],
  ['香蕉','xiāngjiāo','名词','banana','C','我还想买两斤香蕉。',['一根香蕉','买香蕉']],
  ['一共','yígòng','副词','in all; altogether','C','这些水果一共多少钱？',['一共多少','一共五十五块']],
  ['毛','máo','量词','mao; one tenth of a yuan','C','一共五十八块五毛。',['五毛钱','八块三毛']],
  ['结婚','jiéhūn','动词','marry; get married','C','这个电视是我们结婚时买的。',['结婚时','准备结婚']],
  ['不但','búdàn','连词','not only','C','这个电视不但便宜，而且方便。',['不但……而且……','不但会说']],
  ['而且','érqiě','连词','and; but also','C','这家店便宜，而且服务很好。',['而且方便','而且好看']],
  ['声','shēng','量词/名词','sound; measure word for sounds','C','叫电视一声就能开机。',['叫一声','听见声音']],
  ['开机','kāijī','动词','power on; start up','C','有的电视听见声音就能开机。',['自动开机','开机以后']],
  ['换','huàn','动词','replace; change','C','这个电视太小了，是时候换一个新的了。',['换电视','换一个新的'],true],
  ['智能电视','zhìnéng diànshì','名词','smart television; smart TV','C','智能电视可以上网，也可以听声音开机。',['一台智能电视','选择智能电视'],true],
  ['适合','shìhé','动词','suit; be suitable for','B','这件黄色的裙子很适合你。',['适合你','适合学生'],true]
];
const vocabulary = vocabRows.map((r, i) => ({id:`v07_${String(i + 1).padStart(2, '0')}`,hanzi:r[0],pinyin:r[1],pos:r[2],english:r[3],tags:[r[4]],example:r[5],phrases:r[6],...(r[7]?{teachingExtension:true}:{})}));
const word = hanzi => vocabulary.find(v => v.hanzi === hanzi);
const card = hanzi => { const v = word(hanzi); return {hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,example:v.example,exampleEnglish:''}; };

const texts = [
  {id:'t_hsk3_l07_01',textId:1,title:'给小雪买辆新自行车',setting:'在家里，王一雪和刘明商量去买东西。',audio:'../../audio/HSK3/7-1.mp3',lines:[
    ['王一雪','这辆自行车是小雪八岁的时候买的，看起来有点儿旧了。','Zhè liàng zìxíngchē shì Xiǎoxuě bā suì de shíhou mǎi de, kàn qǐlai yǒudiǎnr jiù le.','This bicycle was bought when Xiaoxue was eight years old; it looks a bit old.'],
    ['刘明','是啊，她现在长高了，这辆车已经太矮了。','Shì a, tā xiànzài zhǎng gāo le, zhè liàng chē yǐjīng tài ǎi le.','Yes. She has grown taller, and this bicycle is already too low for her.'],
    ['王一雪','商场里开了一家自行车店，咱们给她买辆新的吧。','Shāngchǎng li kāile yì jiā zìxíngchē diàn, zánmen gěi tā mǎi liàng xīn de ba.','A bicycle shop opened in the mall. Let us buy her a new one.'],
    ['刘明','好，咱们带小雪一起去，让她试一下。','Hǎo, zánmen dài Xiǎoxuě yìqǐ qù, ràng tā shì yíxià.','Okay. Let us take Xiaoxue with us and let her try one.'],
    ['王一雪','那今天就去吧！我也想再看看衣服。咱们怎么去？','Nà jīntiān jiù qù ba! Wǒ yě xiǎng zài kànkan yīfu. Zánmen zěnme qù?','Then let us go today! I also want to look at some clothes. How shall we get there?'],
    ['刘明','商场不远，咱们可以走着去。','Shāngchǎng bù yuǎn, zánmen kěyǐ zǒuzhe qù.','The mall is not far. We can walk there.']
  ]},
  {id:'t_hsk3_l07_02',textId:2,title:'裙子比短裤更好看',setting:'在商场，刘明和王一雪买完自行车，又来挑选衣服。',audio:'../../audio/HSK3/7-3.mp3',lines:[
    ['王一雪','你看我穿这条黄色的短裤好看吗？','Nǐ kàn wǒ chuān zhè tiáo huángsè de duǎnkù hǎokàn ma?','Do you think I look good wearing these yellow shorts?'],
    ['刘明','大小合适，但我觉得那条裙子比短裤更好看。','Dàxiǎo héshì, dàn wǒ juéde nà tiáo qúnzi bǐ duǎnkù gèng hǎokàn.','The size is right, but I think that skirt looks better than the shorts.'],
    ['王一雪','裙子比短裤贵一点儿。','Qúnzi bǐ duǎnkù guì yìdiǎnr.','The skirt is a little more expensive than the shorts.'],
    ['刘明','贵多少？','Guì duōshao?','How much more expensive?'],
    ['王一雪','裙子 480，短裤 400。','Qúnzi sìbǎi bā, duǎnkù sìbǎi.','The skirt is 480 yuan, and the shorts are 400 yuan.'],
    ['刘明','裙子不比短裤贵多少，还是买裙子吧，你穿裙子更好看。','Qúnzi bù bǐ duǎnkù guì duōshao, háishì mǎi qúnzi ba, nǐ chuān qúnzi gèng hǎokàn.','The skirt is not much more expensive than the shorts. Buy the skirt; you look better in it.'],
    ['王一雪','我多看看再决定。你看，那边有买二送一！','Wǒ duō kànkan zài juédìng. Nǐ kàn, nàbian yǒu mǎi èr sòng yī!','I will look around more before deciding. Look, there is a buy-two-get-one-free offer over there!']
  ]},
  {id:'t_hsk3_l07_03',textId:3,title:'不甜不要钱',setting:'在水果店，王一雪买西瓜和香蕉。',audio:'../../audio/HSK3/7-5.mp3',lines:[
    ['店员','西瓜又大又新鲜，不甜不要钱！','Xīguā yòu dà yòu xīnxiān, bù tián bú yào qián!','The watermelons are big and fresh. If they are not sweet, you do not pay!'],
    ['王一雪','西瓜看起来不错，怎么卖？','Xīguā kàn qǐlai búcuò, zěnme mài?','The watermelons look good. How much are they?'],
    ['店员','五块钱一公斤。来，您先尝尝这块冰西瓜，甜极了！','Wǔ kuài qián yì gōngjīn. Lái, nín xiān chángchang zhè kuài bīng xīguā, tián jí le!','Five yuan per kilogram. Here, try this chilled watermelon first. It is extremely sweet!'],
    ['王一雪','是挺甜的！帮我选个大点儿的，再来两斤香蕉。','Shì tǐng tián de! Bāng wǒ xuǎn gè dà diǎnr de, zài lái liǎng jīn xiāngjiāo.','It is quite sweet! Please choose a bigger one for me, and give me two jin of bananas too.'],
    ['店员','一共五十八块五毛。','Yígòng wǔshíbā kuài wǔ máo.','The total is 58 yuan and 5 mao.'],
    ['王一雪','我买了这么多，便宜点儿吧。','Wǒ mǎile zhème duō, piányi diǎnr ba.','I bought so much. Please make it a little cheaper.'],
    ['店员','您给我五十五吧。不能再便宜了。','Nín gěi wǒ wǔshíwǔ ba. Bù néng zài piányi le.','You can give me 55 yuan. I cannot make it any cheaper.']
  ]},
  {id:'t_hsk3_l07_04',textId:4,title:'是时候换个新电视了',format:'narrative',genre:'购物经历',author:'刘明',setting:'在家里，刘明介绍自己选择新电视的经历。',audio:'../../audio/HSK3/7-7.mp3',translationPolicy:'English is a teacher-authored support translation; the Chinese and pinyin preserve the textbook text.',lines:[
    ['刘明','这几天我们在新家坐着看电视的时候，又发现了新问题。房子大了，电视看起来就有点儿小。这个电视是我们结婚时买的，是时候换个新电视了。今天我一直在网上选电视，没想到，现在的电视不但便宜，而且用着非常方便，有的电视叫它一声就能开机。我看了好几个，都很满意，晚上让一雪来决定吧。','Zhè jǐ tiān wǒmen zài xīn jiā zuòzhe kàn diànshì de shíhou, yòu fāxiàn le xīn wèntí. Fángzi dà le, diànshì kàn qǐlai jiù yǒudiǎnr xiǎo. Zhège diànshì shì wǒmen jiéhūn shí mǎi de, shì shíhou huàn gè xīn diànshì le. Jīntiān wǒ yìzhí zài wǎngshang xuǎn diànshì, méi xiǎngdào, xiànzài de diànshì búdàn piányi, érqiě yòngzhe fēicháng fāngbiàn, yǒude diànshì jiào tā yì shēng jiù néng kāijī. Wǒ kànle hǎo jǐ gè, dōu hěn mǎnyì, wǎnshang ràng Yīxuě lái juédìng ba.','In the past few days, while sitting and watching television in our new home, we found another problem. The house is bigger, so the television looks a little small. We bought it when we got married, and it is time to replace it. I have been choosing televisions online today. Unexpectedly, televisions today are not only affordable but also very convenient to use. Some can power on when you call to them. I looked at several and liked them all. I will let Yixue decide tonight.']
  ]}
].map(t => ({...t,lines:t.lines.map(x => ({speaker:x[0],hanzi:x[1],pinyin:x[2],english:x[3]}))}));

const grammar = [
  {id:'g07_01',title:'连动句“V1着V2”',titleEn:'V1-zhe as the manner of V2',scene:'How do you say that someone performs one action in a continuing posture while doing another?',structure:'主语 + 动词1 + 着 +（宾语1）+ 动词2 +（宾语2）',explanation:'“着”放在第一个动词后，表示进行第二个动作时保持的状态或方式。',examples:[['弟弟吃着苹果写作业。','The younger brother does homework while eating an apple.'],['他们坐着看电视。','They watch television while sitting.'],['老师拿着书走进教室。','The teacher walks into the classroom holding a book.'],['她笑着跟大家说再见。','She says goodbye to everyone with a smile.'],['我喜欢听着音乐做饭。','I like cooking while listening to music.']]},
  {id:'g07_02',title:'比较句“比……更”与“不比”',titleEn:'Comparisons with 更 and 不比',scene:'How do you compare two products when one has a stronger quality, or when the difference is small?',structure:'A + 比 + B + 更/还 + 形容词；A + 不比 + B + 形容词（+ 多少）',explanation:'“更/还”加强比较程度；“A不比B……”常用于说明两者差不多，或反驳原来的判断。',examples:[['这辆自行车比那辆更轻。','This bicycle is lighter than that one.'],['今天比昨天还热。','Today is even hotter than yesterday.'],['这家店不比那家贵。','This shop is not more expensive than that one.'],['坐地铁不比骑自行车慢多少。','Taking the subway is not much slower than cycling.'],['这台电视比旧电视更方便。','This television is more convenient than the old one.']]},
  {id:'g07_03',title:'程度补语“极了”',titleEn:'Extremely: adjective or mental verb + 极了',scene:'How do you show that a quality or feeling reaches a very high degree?',structure:'形容词 / 心理动词 + 极了',explanation:'“极了”放在形容词或心理动词后，表示程度非常高。',examples:[['今天买的香蕉新鲜极了。','The bananas bought today are extremely fresh.'],['这个故事有意思极了。','This story is extremely interesting.'],['下雨以后，草原漂亮极了。','The grassland is extremely beautiful after the rain.'],['收到这个礼物，她高兴极了。','She was extremely happy to receive this gift.'],['这件黄色的衣服我喜欢极了。','I like this yellow item of clothing very much.']]},
  {id:'g07_04',title:'递进复句“不但……而且……”',titleEn:'Not only..., but also...',scene:'How do you add a second, stronger reason when recommending a product?',structure:'同主语：主语 + 不但……，而且……；不同主语：不但 + 主语1……，而且 + 主语2……',explanation:'两个分句表示递进关系。主语相同时“不但”在主语后；主语不同时“不但”放在第一个主语前。',examples:[['这家店不但东西多，而且服务也很好。','This shop not only has many products, but also provides good service.'],['小雪不但会骑自行车，而且骑得很快。','Xiaoxue can not only ride a bicycle, but also rides very fast.'],['这个水果不但新鲜，而且很甜。','This fruit is not only fresh, but also sweet.'],['不但哥哥喜欢这台电视，而且妹妹也喜欢。','Not only the older brother likes this television; the younger sister likes it too.'],['网上买东西不但方便，而且常常更便宜。','Online shopping is not only convenient, but also often cheaper.']]},
  {id:'g07_05',title:'词义辨析“适合”与“合适”',titleEn:'Word choice: 适合 vs. 合适',scene:'Both words can mean “suitable,” but where do they go in a sentence?',structure:'适合：事物 / 活动 + 适合 + 人 / 用途；合适：主语 + 很 / 不 + 合适',explanation:'“适合”是动词，后面常带对象，说明什么适合谁或适合做什么；“合适”是形容词，说明大小、时间、价格或安排恰当，后面一般不直接带对象。',examples:[['这件黄色的裙子很适合你。','This yellow skirt suits you well.'],['这双鞋的大小很合适。','The size of these shoes is just right.'],['这辆自行车不适合小雪。','This bicycle is not suitable for Xiaoxue.'],['明天下午三点开会合适吗？','Is 3 p.m. tomorrow a suitable time for the meeting?'],['我觉得这份工作很适合他。','I think this job suits him well.']]}
].map(g => ({...g,examples:g.examples.map(x => ({hanzi:x[0],english:x[1]}))}));

const grammarExamplePinyin = {
  g07_01:['Dìdi chīzhe píngguǒ xiě zuòyè.','Tāmen zuòzhe kàn diànshì.','Lǎoshī názhe shū zǒujìn jiàoshì.','Tā xiàozhe gēn dàjiā shuō zàijiàn.','Wǒ xǐhuan tīngzhe yīnyuè zuòfàn.'],
  g07_02:['Zhè liàng zìxíngchē bǐ nà liàng gèng qīng.','Jīntiān bǐ zuótiān hái rè.','Zhè jiā diàn bù bǐ nà jiā guì.','Zuò dìtiě bù bǐ qí zìxíngchē màn duōshao.','Zhè tái diànshì bǐ jiù diànshì gèng fāngbiàn.'],
  g07_03:['Jīntiān mǎi de xiāngjiāo xīnxiān jí le.','Zhège gùshi yǒuyìsi jí le.','Xiàyǔ yǐhòu, cǎoyuán piàoliang jí le.','Shōudào zhège lǐwù, tā gāoxìng jí le.','Zhè jiàn huángsè de yīfu wǒ xǐhuan jí le.'],
  g07_04:['Zhè jiā diàn búdàn dōngxi duō, érqiě fúwù yě hěn hǎo.','Xiǎoxuě búdàn huì qí zìxíngchē, érqiě qí de hěn kuài.','Zhège shuǐguǒ búdàn xīnxiān, érqiě hěn tián.','Búdàn gēge xǐhuan zhè tái diànshì, érqiě mèimei yě xǐhuan.','Wǎngshang mǎi dōngxi búdàn fāngbiàn, érqiě chángcháng gèng piányi.'],
  g07_05:['Zhè jiàn huángsè de qúnzi hěn shìhé nǐ.','Zhè shuāng xié de dàxiǎo hěn héshì.','Zhè liàng zìxíngchē bù shìhé Xiǎoxuě.','Míngtiān xiàwǔ sān diǎn kāihuì héshì ma?','Wǒ juéde zhè fèn gōngzuò hěn shìhé tā.']
};
grammar.forEach(g => g.examples.forEach((x,i) => { x.pinyin=grammarExamplePinyin[g.id][i]; }));

const grammarLeads = {
  g07_01:[['We can go there on foot.','咱们可以走着去。'],['She reads while lying down.','她躺着看书。'],['He looks at the product while talking.','他看着商品说话。']],
  g07_02:[['The skirt looks better than the shorts.','裙子比短裤更好看。'],['The skirt is not much more expensive than the shorts.','裙子不比短裤贵多少。'],['This one is even more suitable.','这一件还更合适。']],
  g07_03:[['This piece of watermelon is extremely sweet.','这块西瓜甜极了。'],['I like this book very much.','这本书我喜欢极了。'],['Her Chinese food is extremely delicious.','她做的中国菜好吃极了。']],
  g07_04:[['Modern televisions are not only affordable but also convenient.','现在的电视不但便宜，而且用着非常方便。'],['Jiayue not only likes singing; she sings well too.','家月不但喜欢唱歌，而且唱得很好听。'],['Not only Jiayue speaks Chinese; Tianzhong does too.','不但家月会说汉语，而且天中也会说汉语。']],
  g07_05:[['This yellow skirt suits you well.','这件黄色的裙子很适合你。'],['The size of these shoes is just right.','这双鞋的大小很合适。'],['Is 8 p.m. a suitable time?','晚上八点合适吗？']]
};
const grammarVisualParts = {
  g07_01:{blocks:['动词1','着','动词2'],labels:['continuing action','state marker','main action']},
  g07_02:{blocks:['A','比 / 不比','B','更 + 形容词'],labels:['item A','comparison','item B','degree + quality']},
  g07_03:{blocks:['形容词 / 心理动词','极了'],labels:['quality or feeling','extremely']},
  g07_04:{blocks:['主语','不但……','而且……'],labels:['subject','first point','stronger point']},
  g07_05:{blocks:['适合','对象','合适','状态'],labels:['verb: suit','person or purpose','adjective: suitable','right or appropriate']}
};
const grammarOralQuestions = {
  g07_01:['你喜欢坐着看书还是躺着看书？','为什么你们喜欢戴着耳机上课？','你常常听着音乐做什么？'],
  g07_02:['这条裙子和这条短裤，哪一件更适合你？','你觉得网上买东西比去商店更方便吗？为什么？','你的家乡什么东西不比大连的贵多少？'],
  g07_03:['你最近吃过什么好吃极了？','你去过的哪个地方漂亮极了？','最近什么事情让你高兴极了？'],
  g07_04:['你常去的商店不但便宜，而且怎么样？','你的家乡不但有美食，而且还有什么？','班里谁不但汉语说得好，而且汉字也写得好？'],
  g07_05:['你觉得几点上课比较合适？','什么颜色的衣服适合你？','这辆自行车适合小雪吗？为什么？']
};
const grammarTeachingNotes = Object.fromEntries(grammar.map(g => [g.id,{
  scene:g.scene,structure:g.structure,structureEn:g.titleEn,
  visualLearning:{leadExamples:grammarLeads[g.id].map(x=>({english:x[0],hanzi:x[1]})),blocks:grammarVisualParts[g.id].blocks,blockLabelsEn:grammarVisualParts[g.id].labels},
  oralQuestions:grammarOralQuestions[g.id]
}]));

const grammarProgressive = {
  g07_01:{
    structureVariants:[
      {label:'基本结构',formula:'主语 + 动词1 + 着 +（宾语1）+ 动词2 +（宾语2）',formulaEn:'Subject + Verb 1 + 着 + (Object 1) + Verb 2 + (Object 2)',explanation:'“着”放在第一个动词后，说明做第二个动作时保持的状态或方式。',example:'他们坐着看电视。'}
    ],
    followUp:[
      {image:img('photo-text-1-bike-shop'),promptEn:'The girl smiles while trying the bicycle.',target:'用“V1着V2”说一句话。',sampleAnswer:{hanzi:'小雪笑着试自行车。',pinyin:'Xiǎoxuě xiàozhe shì zìxíngchē.'}},
      {image:img('photo-text-4-small-tv'),promptEn:'They sit and watch television in the living room.',target:'用“V1着V2”说一句话。',sampleAnswer:{hanzi:'他们坐着看电视。',pinyin:'Tāmen zuòzhe kàn diànshì.'}}
    ]
  },
  g07_02:{
    structureVariants:[
      {label:'程度更强',formula:'A + 比 + B + 更 / 还 + 形容词',formulaEn:'A + is even more + adjective + than + B',explanation:'“更 / 还”放在形容词前，突出A的程度更高。',example:'裙子比短裤更好看。'},
      {label:'差别不大',formula:'A + 不比 + B + 形容词 + 多少',formulaEn:'A + is not much more + adjective + than + B',explanation:'说明A没有明显超过B，两者比较接近。',example:'裙子不比短裤贵多少。'}
    ],
    followUp:[
      {image:img('photo-text-2-comparison'),promptEn:'Compare the skirt and the shorts. Which looks better?',target:'用“比……更……”说一句话。',sampleAnswer:{hanzi:'裙子比短裤更好看。',pinyin:'Qúnzi bǐ duǎnkù gèng hǎokàn.'}},
      {image:img('photo-text-4-smart-tv'),promptEn:'Compare the smart TV with the old TV. Which is more convenient?',target:'用“比……更……”说一句话。',sampleAnswer:{hanzi:'智能电视比旧电视更方便。',pinyin:'Zhìnéng diànshì bǐ jiù diànshì gèng fāngbiàn.'}}
    ]
  },
  g07_03:{
    structureVariants:[
      {label:'形容词',formula:'形容词 + 极了',formulaEn:'Adjective + 极了 = extremely + adjective',explanation:'表示某种性质达到很高的程度。',example:'这块西瓜甜极了。'},
      {label:'心理动词',formula:'心理动词 + 极了',formulaEn:'Mental verb + 极了 = feel / like something very much',explanation:'表示喜欢、高兴、满意等感觉非常强。',example:'这台电视我喜欢极了。'}
    ],
    followUp:[
      {image:img('photo-text-3-watermelon'),promptEn:'The watermelon is extremely sweet.',target:'用“极了”说一句话。',sampleAnswer:{hanzi:'这块西瓜甜极了。',pinyin:'Zhè kuài xīguā tián jí le.'}},
      {image:img('photo-text-2-fitting'),promptEn:'She likes the yellow shorts very much.',target:'用“极了”说一句话。',sampleAnswer:{hanzi:'这条黄色短裤她喜欢极了。',pinyin:'Zhè tiáo huángsè duǎnkù tā xǐhuan jí le.'}}
    ]
  },
  g07_04:{
    structureVariants:[
      {label:'基本结构',formula:'不但……，而且……',formulaEn:'not only ..., but also ...',explanation:'后一个分句在意思上进一步补充或加强前一个分句。',example:'这个电视不但便宜，而且方便。'},
      {label:'主语相同',formula:'主语 + 不但 + 谓语1，而且 + 谓语2',formulaEn:'Same subject: Subject + not only + Predicate 1, but also + Predicate 2',explanation:'两个分句的主语相同，主语只说一次，放在“不但”前面。',example:'小雪不但会骑自行车，而且骑得很快。'},
      {label:'主语不同',formula:'不但 + 主语1 + 谓语1，而且 + 主语2 + 也 + 谓语2',formulaEn:'Different subjects: Not only + Subject 1 + Predicate 1, but Subject 2 + also + Predicate 2',explanation:'两个分句的主语不同，“不但”放在主语1前，“而且”放在主语2前；常用“也”加强递进。',example:'不但哥哥喜欢这台电视，而且妹妹也喜欢。'}
    ],
    followUp:[
      {image:img('photo-text-4-smart-tv'),promptEn:'The smart TV is affordable and convenient. It can also go online.',target:'用“不但……而且……”推荐智能电视。',sampleAnswer:{hanzi:'智能电视不但便宜，而且方便，还可以上网。',pinyin:'Zhìnéng diànshì búdàn piányi, érqiě fāngbiàn, hái kěyǐ shàngwǎng.'}},
      {image:img('photo-text-1-old-bike'),promptEn:'The parents notice the bicycle is old. Xiaoxue also thinks it is too short.',target:'用“主语不同”的结构说一句话。',sampleAnswer:{hanzi:'不但爸爸妈妈觉得车旧了，而且小雪也觉得车太矮了。',pinyin:'Búdàn bàba māma juéde chē jiù le, érqiě Xiǎoxuě yě juéde chē tài ǎi le.'}}
    ]
  },
  g07_05:{
    grammarKind:'word_contrast',
    structureVariants:[
      {label:'适合 · 动词',formula:'事物 / 活动 + 适合 + 人 / 用途',formulaEn:'Thing / activity + suits + person / purpose',explanation:'“适合”后面常带对象，回答“适合谁”或“适合做什么”。',example:'这件黄色的裙子很适合你。'},
      {label:'合适 · 形容词',formula:'大小 / 时间 / 价格 / 安排 + 很 / 不 + 合适',formulaEn:'Size / time / price / arrangement + is + suitable / right',explanation:'“合适”描述某个条件恰当，后面一般不直接带人或用途。',example:'这双鞋的大小很合适。'}
    ],
    followUp:[
      {image:img('photo-text-2-fitting'),promptEn:'The yellow shorts are the right size for her.',target:'选择“适合”或“合适”，说一个完整句子。',sampleAnswer:{hanzi:'这条黄色短裤的大小很合适。',pinyin:'Zhè tiáo huángsè duǎnkù de dàxiǎo hěn héshì.'}},
      {image:img('photo-text-1-old-bike'),promptEn:'The bicycle is too short for Xiaoxue.',target:'选择“适合”或“合适”，说一个完整句子。',sampleAnswer:{hanzi:'这辆自行车不适合小雪。',pinyin:'Zhè liàng zìxíngchē bù shìhé Xiǎoxuě.'}}
    ],
    practiceItems:[
      {id:'g07_05_p01',prompt:'这件衣服的大小很____。',answer:'合适',reason:'描述“大小”恰当，用形容词“合适”。'},
      {id:'g07_05_p02',prompt:'这件黄色的裙子很____你。',answer:'适合',reason:'后面直接带对象“你”，用动词“适合”。'},
      {id:'g07_05_p03',prompt:'晚上八点开会，你觉得时间____吗？',answer:'合适',reason:'描述“时间”是否恰当，用“合适”。'},
      {id:'g07_05_p04',prompt:'这辆自行车太矮了，不____小雪。',answer:'适合',reason:'后面带对象“小雪”，用“适合”。'},
      {id:'g07_05_p05',prompt:'我觉得这份工作很____他。',answer:'适合',reason:'后面带对象“他”，用“适合”。'},
      {id:'g07_05_p06',prompt:'在教室里大声讲电话不____。',answer:'合适',reason:'评价行为是否恰当，用“合适”。'}
    ]
  }
};
Object.keys(grammarTeachingNotes).forEach(id => Object.assign(grammarTeachingNotes[id],{presentationMode:'progressive_grammar'},grammarProgressive[id]||{}));

const makeQuestions = rows => rows.map(x => ({question:x[0],answer:x[1]}));
const textTeachingNotes = {
  t_hsk3_l07_01:{
    presentationMode:'listen_first_progressive',
    listenPrompt:'先完整听一遍，不看课文。听完后，说说你听到了哪些人物、物品和动作。',
    classQuestions:makeQuestions([
      ['这辆自行车是什么时候买的？','小雪八岁的时候买的。'],
      ['这辆自行车现在怎么样？','有点儿旧，而且太矮了。'],
      ['为什么这辆车太矮了？','因为小雪长高了。'],
      ['他们准备去哪里买新车？','去商场里的自行车店。'],
      ['他们准备怎么去商场？','走着去。']
    ]),
    cultureDiscussion:{
      title:'旧车没坏，怎么处理？',
      titleEn:'What can we do with an old bike that still works?',
      questions:[
        {hanzi:'小雪的自行车旧了，但是没有坏。她可以怎么处理这辆车？',pinyin:'Xiǎoxuě de zìxíngchē jiù le, dànshì méiyǒu huài. Tā kěyǐ zěnme chǔlǐ zhè liàng chē?'},
        {hanzi:'你买过或卖过二手物品吗？',pinyin:'Nǐ mǎiguo huò màiguo èrshǒu wùpǐn ma?'}
      ],
      wordCards:[
        {hanzi:'二手车',pinyin:'èrshǒu chē',english:'second-hand vehicle'},
        {hanzi:'送给别人',pinyin:'sòng gěi biérén',english:'give it to someone'},
        {hanzi:'修理',pinyin:'xiūlǐ',english:'repair'},
        {hanzi:'回收',pinyin:'huíshōu',english:'recycle'}
      ],
      background:'“二手车”就是别人用过、还可以继续使用的车。',
      sampleAnswers:[
        {hanzi:'可以把它当二手车卖给别人。',pinyin:'Kěyǐ bǎ tā dàng èrshǒu chē mài gěi biérén.'},
        {hanzi:'也可以送给需要的人，或者修理以后继续用。',pinyin:'Yě kěyǐ sòng gěi xūyào de rén, huòzhě xiūlǐ yǐhòu jìxù yòng.'}
      ]
    },
    retellScaffold:{nodes:[{label:'旧车',hint:'八岁时买的'},{label:'问题',hint:'长高、太矮'},{label:'决定',hint:'买辆新的'},{label:'行动',hint:'带小雪试、走着去'}],frame:'这辆自行车是……。现在小雪……，所以车……。他们决定……，还要让……。商场不远，他们……。'}
  },
  t_hsk3_l07_02:{
    presentationMode:'listen_first_progressive',
    listenPrompt:'先完整听一遍，不看课文。听完后，说说他们比较了哪些商品。',
    classQuestions:makeQuestions([
      ['王一雪试穿了什么？','黄色的短裤。'],
      ['刘明觉得哪件衣服更好看？','那条裙子。'],
      ['裙子和短裤分别多少钱？','裙子480元，短裤400元。'],
      ['刘明为什么建议买裙子？','裙子不比短裤贵多少，而且王一雪穿裙子更好看。'],
      ['王一雪为什么还没有决定？','她想多看看，而且看到了买二送一。']
    ]),
    cultureDiscussion:{
      title:'这些优惠，你看得懂吗？',
      titleEn:'Can you read these sale offers?',
      questions:[
        {hanzi:'这些优惠分别是什么意思？',pinyin:'Zhèxiē yōuhuì fēnbié shì shénme yìsi?'},
        {hanzi:'买东西时，你最喜欢哪一种优惠？为什么？',pinyin:'Mǎi dōngxi shí, nǐ zuì xǐhuan nǎ yì zhǒng yōuhuì? Wèishénme?'}
      ],
      promoCards:[
        {label:'买二送一',pinyin:'mǎi èr sòng yī',meaning:'Buy 2, get 1 free'},
        {label:'满100减20',pinyin:'mǎn yìbǎi jiǎn èrshí',meaning:'Spend ¥100, save ¥20'},
        {label:'打八五折',pinyin:'dǎ bāwǔ zhé',meaning:'Pay 85% of the original price'},
        {label:'第二杯半价',pinyin:'dì-èr bēi bànjià',meaning:'Second drink half price'},
        {label:'满200返20',pinyin:'mǎn liǎngbǎi fǎn èrshí',meaning:'Spend ¥200, receive ¥20 back'}
      ],
      sampleAnswers:[
        {hanzi:'“满100减20”是买满一百块，可以少付二十块。',pinyin:'“Mǎn yìbǎi jiǎn èrshí” shì mǎi mǎn yìbǎi kuài, kěyǐ shǎo fù èrshí kuài.'},
        {hanzi:'我喜欢打八五折，因为每件商品都可以便宜一点儿。',pinyin:'Wǒ xǐhuan dǎ bāwǔ zhé, yīnwèi měi jiàn shāngpǐn dōu kěyǐ piányi yìdiǎnr.'}
      ]
    },
    retellScaffold:{nodes:[{label:'试穿',hint:'黄色短裤'},{label:'款式',hint:'裙子更好看'},{label:'价格',hint:'480和400'},{label:'决定',hint:'多看看、买二送一'}],frame:'王一雪先试穿……。刘明觉得……比……更……。虽然裙子……，但是……。王一雪想……再决定。'}
  },
  t_hsk3_l07_03:{
    presentationMode:'listen_first_progressive',
    listenPrompt:'先完整听一遍，不看课文。听完后，记住商品、价格和最后付款的钱数。',
    classQuestions:makeQuestions([
      ['店员怎样介绍西瓜？','又大又新鲜，不甜不要钱。'],
      ['西瓜多少钱一公斤？','五块钱一公斤。'],
      ['王一雪为什么愿意买西瓜？','她尝了冰西瓜，觉得挺甜。'],
      ['王一雪还买了什么？','两斤香蕉。'],
      ['最后店员让王一雪付多少钱？','五十五块。']
    ]),
    cultureDiscussion:{
      title:'买菜可以讲价吗？',
      titleEn:'Can you bargain when buying groceries?',
      questions:[
        {hanzi:'哪些地方可能可以讲价？哪些地方一般不讲价？',pinyin:'Nǎxiē dìfang kěnéng kěyǐ jiǎngjià? Nǎxiē dìfang yìbān bù jiǎngjià?'},
        {hanzi:'如果你想请店员便宜一点儿，你会怎么说？',pinyin:'Rúguǒ nǐ xiǎng qǐng diànyuán piányi yìdiǎnr, nǐ huì zěnme shuō?'}
      ],
      wordCards:[
        {hanzi:'讲价',pinyin:'jiǎngjià',english:'bargain'},
        {hanzi:'便宜点儿',pinyin:'piányi diǎnr',english:'a little cheaper'},
        {hanzi:'卖不卖',pinyin:'mài bu mài',english:'will you sell it?'},
        {hanzi:'抹零',pinyin:'mǒ líng',english:'round down the total'}
      ],
      background:'菜市场和小店有时可以讲价；超市和明码标价的商店一般不能讲价。',
      tips:[
        {label:'礼貌提出价格',pinyin:'lǐmào tíchū jiàgé',english:'Politely suggest a price instead of demanding a discount.',example:'十五块，行不行？',examplePinyin:'Shíwǔ kuài, xíng bu xíng?'},
        {label:'说明数量',pinyin:'shuōmíng shùliàng',english:'Explain how much you are buying; a larger quantity can support your request.',example:'买得多，便宜点儿怎么样？',examplePinyin:'Mǎi de duō, piányi diǎnr zěnmeyàng?'},
        {label:'抹零',pinyin:'mǒ líng',english:'Ask to round the total down by removing the small change.',example:'一共十五块三毛，十五块行不行？',examplePinyin:'Yígòng shíwǔ kuài sān máo, shíwǔ kuài xíng bu xíng?'}
      ],
      sampleAnswers:[
        {hanzi:'买得多，便宜点儿怎么样？',pinyin:'Mǎi de duō, piányi diǎnr zěnmeyàng?'},
        {hanzi:'十五块，行不行？',pinyin:'Shíwǔ kuài, xíng bu xíng?'},
        {hanzi:'八块一斤，十五块两斤卖不卖？',pinyin:'Bā kuài yì jīn, shíwǔ kuài liǎng jīn mài bu mài?'},
        {hanzi:'一共十五块三毛，十五块行不行？',pinyin:'Yígòng shíwǔ kuài sān máo, shíwǔ kuài xíng bu xíng?'}
      ]
    },
    retellScaffold:{nodes:[{label:'广告',hint:'不甜不要钱'},{label:'试吃',hint:'冰西瓜、甜极了'},{label:'购买',hint:'大西瓜、两斤香蕉'},{label:'讲价',hint:'58.5 → 55'}],frame:'店员说西瓜……。王一雪先问……，又尝了……。她买了……和……。一共……，最后店员说……。'}
  },
  t_hsk3_l07_04:{
    presentationMode:'listen_first_progressive',
    listenPrompt:'先完整听一遍，不看课文。听完后，说说刘明为什么想换电视。',
    classQuestions:makeQuestions([
      ['新家里出现了什么问题？','房子大了，旧电视看起来有点儿小。'],
      ['旧电视是什么时候买的？','刘明和王一雪结婚时买的。'],
      ['刘明今天在哪里选电视？','在网上。'],
      ['现在的电视有哪些优点？','不但便宜，而且用着很方便。'],
      ['有的电视怎样开机？','叫它一声就能开机。']
    ]),
    cultureDiscussion:{
      title:'智能家电真的更方便吗？',
      titleEn:'Do smart appliances really make life easier?',
      questions:[
        {hanzi:'智能电视除了语音开机，还可以做什么？',pinyin:'Zhìnéng diànshì chúle yǔyīn kāijī, hái kěyǐ zuò shénme?'},
        {hanzi:'网上买电视时，你会先比较什么？',pinyin:'Wǎngshang mǎi diànshì shí, nǐ huì xiān bǐjiào shénme?'}
      ],
      wordCards:[
        {hanzi:'智能电视',pinyin:'zhìnéng diànshì',english:'smart TV'},
        {hanzi:'语音开机',pinyin:'yǔyīn kāijī',english:'voice power-on'},
        {hanzi:'上网',pinyin:'shàngwǎng',english:'go online'},
        {hanzi:'大小',pinyin:'dàxiǎo',english:'size'},
        {hanzi:'售后服务',pinyin:'shòuhòu fúwù',english:'after-sales service'}
      ],
      sampleAnswers:[
        {hanzi:'智能电视不但可以听声音开机，而且还可以上网。',pinyin:'Zhìnéng diànshì búdàn kěyǐ tīng shēngyīn kāijī, érqiě hái kěyǐ shàngwǎng.'},
        {hanzi:'我会先比较大小、价格和功能，还会看看售后服务。',pinyin:'Wǒ huì xiān bǐjiào dàxiǎo, jiàgé hé gōngnéng, hái huì kànkan shòuhòu fúwù.'}
      ]
    },
    retellScaffold:{nodes:[{label:'新问题',hint:'房子大、电视小'},{label:'旧电视',hint:'结婚时买的'},{label:'网上选择',hint:'便宜、方便'},{label:'决定',hint:'语音开机、让一雪选'}],frame:'搬到新家以后，他们发现……。旧电视是……，所以……。刘明在网上看到现在的电视不但……，而且……。最后他让……。'}
  }
};

const sceneData = {
  1:{title:'旧自行车与新选择',subtitle:'先发现旧车的问题，再到自行车店试车。',steps:[
    {title:'车已经太矮了',talkHint:'先聊聊，不着急给答案。',prompt:'看看这张图，你发现了什么？',image:img('photo-text-1-old-bike'),labels:[{word:'辆',x:11,y:12,targetX:48,targetY:69},{word:'自行车',x:35,y:12,targetX:48,targetY:70},{word:'旧',x:12,y:84,targetX:48,targetY:70},{word:'矮',x:89,y:84,targetX:53,targetY:47}],words:['辆','自行车','旧','矮'],sentence:'这辆自行车有点儿旧，而且对小雪来说太矮了。',sampleAnswers:[{hanzi:'这是一辆自行车。',pinyin:'Zhè shì yí liàng zìxíngchē.'},{hanzi:'它有点儿旧，而且对小雪来说太矮了。',pinyin:'Tā yǒudiǎnr jiù, érqiě duì Xiǎoxuě lái shuō tài ǎi le.'}]},
    {title:'去店里试新车',talkHint:'先聊聊，不着急给答案。',prompt:'你觉得这辆车适合小雪吗？',image:img('photo-text-1-bike-shop'),labels:[{word:'试',x:90,y:12,targetX:53,targetY:43}],words:['试'],sentence:'买自行车以前，让小雪先试一下。',sampleAnswers:[{hanzi:'我觉得可能合适，但是小雪应该先试一下。',pinyin:'Wǒ juéde kěnéng héshì, dànshì Xiǎoxuě yīnggāi xiān shì yíxià.'},{hanzi:'试了以后，才知道大小合不合适。',pinyin:'Shì le yǐhòu, cái zhīdào dàxiǎo hé bù héshì.'}]}
  ]},
  2:{title:'比较短裤和裙子',subtitle:'观察颜色、大小、款式、价格和促销。',steps:[
    {title:'试穿黄色短裤',talkHint:'先聊聊，不着急给答案。',prompt:'短裤的颜色和大小怎么样？',image:img('photo-text-2-fitting'),labels:[{word:'黄色',x:10,y:84,targetX:51,targetY:67},{word:'短裤',x:90,y:84,targetX:53,targetY:66},{word:'大小',x:89,y:12,targetX:55,targetY:48},{word:'合适',x:10,y:12,targetX:58,targetY:50}],words:['黄色','短裤','大小','合适'],sentence:'这条黄色短裤的大小很合适。',sampleAnswers:[{hanzi:'这是一条黄色的短裤。',pinyin:'Zhè shì yì tiáo huángsè de duǎnkù.'},{hanzi:'这条短裤的大小很合适。',pinyin:'Zhè tiáo duǎnkù de dàxiǎo hěn héshì.'}]},
    {title:'比较以后再决定',talkHint:'先聊聊，不着急给答案。',prompt:'她应该买裙子还是短裤？',image:img('photo-text-2-comparison'),labels:[{word:'裙子',x:10,y:13,targetX:29,targetY:38},{word:'更',x:89,y:12,targetX:57,targetY:42},{word:'适合',x:56,y:84,targetX:29,targetY:38},{word:'决定',x:90,y:84,targetX:52,targetY:44}],words:['裙子','更','适合','决定'],sentence:'裙子更好看，也很适合她，但她想多看看再决定。',sampleAnswers:[{hanzi:'我觉得裙子比短裤更好看，也更适合她。',pinyin:'Wǒ juéde qúnzi bǐ duǎnkù gèng hǎokàn, yě gèng shìhé tā.'},{hanzi:'她可以多看看、比较价格以后再决定。',pinyin:'Tā kěyǐ duō kànkan, bǐjiào jiàgé yǐhòu zài juédìng.'}]}
  ]},
  3:{title:'水果店询价与讲价',subtitle:'试吃西瓜、认识重量和人民币单位。',steps:[
    {title:'先尝一块冰西瓜',talkHint:'先聊聊，不着急给答案。',prompt:'如果你是店员，你会怎么介绍西瓜？',image:img('photo-text-3-watermelon'),labels:[{word:'西瓜',x:10,y:84,targetX:48,targetY:73},{word:'新鲜',x:10,y:12,targetX:46,targetY:69},{word:'甜',x:90,y:12,targetX:56,targetY:45},{word:'冰',x:90,y:84,targetX:55,targetY:46},{word:'极',x:52,y:12,targetX:69,targetY:45}],words:['西瓜','新鲜','甜','冰','极'],sentence:'这块冰西瓜又新鲜又甜，吃起来甜极了。',sampleAnswers:[{hanzi:'我们的西瓜又大又新鲜。',pinyin:'Wǒmen de xīguā yòu dà yòu xīnxiān.'},{hanzi:'您先尝尝这块冰西瓜，甜极了！',pinyin:'Nín xiān chángchang zhè kuài bīng xīguā, tián jí le!'}]},
    {title:'称重、询价和讲价',talkHint:'先聊聊，不着急给答案。',prompt:'买菜可以讲价吗？',promptEn:'Can you bargain when buying groceries?',image:img('photo-text-3-weighing'),labels:[{word:'公斤',x:10,y:84,targetX:43,targetY:70},{word:'斤',x:11,y:12,targetX:45,targetY:62},{word:'香蕉',x:52,y:12,targetX:43,targetY:60},{word:'一共',x:90,y:12,targetX:64,targetY:62},{word:'毛',x:90,y:84,targetX:46,targetY:72}],words:['公斤','斤','香蕉','一共','毛'],sentence:'西瓜按公斤卖，香蕉买两斤，一共五十八块五毛。',sampleAnswers:[{hanzi:'买得多，便宜点儿怎么样？',pinyin:'Mǎi de duō, piányi diǎnr zěnmeyàng?'},{hanzi:'十五块，行不行？',pinyin:'Shíwǔ kuài, xíng bu xíng?'},{hanzi:'一共十五块三毛，十五块行不行？',pinyin:'Yígòng shíwǔ kuài sān máo, shíwǔ kuài xíng bu xíng?'}],tips:[{label:'礼貌提出价格',pinyin:'lǐmào tíchū jiàgé',english:'Politely suggest a price instead of demanding a discount.',example:'十五块，行不行？',examplePinyin:'Shíwǔ kuài, xíng bu xíng?'},{label:'说明数量',pinyin:'shuōmíng shùliàng',english:'Explain how much you are buying; a larger quantity can support your request.',example:'买得多，便宜点儿怎么样？',examplePinyin:'Mǎi de duō, piányi diǎnr zěnmeyàng?'},{label:'抹零',pinyin:'mǒ líng',english:'Ask to round the total down by removing the small change.',example:'一共十五块三毛，十五块行不行？',examplePinyin:'Yígòng shíwǔ kuài sān máo, shíwǔ kuài xíng bu xíng?'}]}
  ]},
  4:{title:'为新家选择智能电视',subtitle:'说明更换原因，比较价格和使用体验。',steps:[
    {title:'旧电视显得太小',talkHint:'先聊聊，不着急给答案。',prompt:'你们觉得这个电视大小合适吗？',image:img('photo-text-4-small-tv'),labels:[{word:'结婚',x:89,y:12,targetX:90,targetY:31},{word:'决定',x:10,y:84,targetX:58,targetY:45},{word:'换',x:47,y:12,targetX:58,targetY:45}],words:['结婚','换','决定'],sentence:'这个电视是他们结婚时买的，现在让一雪决定换哪一台。',sampleAnswers:[{hanzi:'我觉得不太合适，房子大了，电视看起来太小了。',pinyin:'Wǒ juéde bú tài héshì, fángzi dà le, diànshì kàn qǐlai tài xiǎo le.'},{hanzi:'这个电视已经用了很久，是时候换一个新的了。',pinyin:'Zhège diànshì yǐjīng yòngle hěn jiǔ, shì shíhou huàn yí ge xīn de le.'}]},
    {title:'语音让电视开机',talkHint:'先聊聊，不着急给答案。',prompt:'智能电视有什么优点？',image:img('photo-text-4-smart-tv'),labels:[{word:'不但',x:10,y:12,targetX:52,targetY:52},{word:'而且',x:10,y:84,targetX:69,targetY:25},{word:'声',x:45,y:12,targetX:34,targetY:38},{word:'开机',x:90,y:12,targetX:72,targetY:25},{word:'智能电视',x:88,y:84,targetX:72,targetY:25}],words:['智能电视','不但','而且','声','开机'],sentence:'智能电视不但便宜，而且方便，叫它一声就能开机。',sampleAnswers:[{hanzi:'叫它一声就能开机。',pinyin:'Jiào tā yì shēng jiù néng kāijī.'},{hanzi:'智能电视不但用着方便，而且还可以上网。',pinyin:'Zhìnéng diànshì búdàn yòngzhe fāngbiàn, érqiě hái kěyǐ shàngwǎng.'}]}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {session:'A',title:'发现物品需要更换',titleEn:'Explain Why an Item Needs Replacing',words:['辆','自行车','旧','矮','试'],image:img('photo-text-1-old-bike'),introEn:'Learn how to describe an old or unsuitable item and explain why it should be replaced. 辆 is the measure word used for vehicles.',contexts:[['这____自行车是她八岁时买的。','辆'],['孩子长高了，这辆车已经太____了。','矮'],['买新车以前，让她先____一下。','试'],['这台电脑用了很多年，已经很____了。','旧'],['商场里有一家____店。','自行车']]},
  {session:'B',title:'比较商品并做决定',titleEn:'Compare Products and Make a Decision',words:['黄色','短裤','大小','合适','适合','裙子','更','决定'],image:img('photo-text-2-fitting'),introEn:'Compare style, size and price before buying. 适合 is a verb that normally takes an object; 合适 is an adjective. 买二送一 means “buy two, get one free.”',contexts:[['这条____的短裤很好看。','黄色'],['这件衣服的____合适吗？','大小'],['那条裙子比短裤____好看。','更'],['我想多看看再____。','决定'],['这件黄色的裙子很____你。','适合']]},
  {session:'C',title:'询价、讲价与评价智能商品',titleEn:'Ask Prices and Recommend Smart Products',words:['西瓜','新鲜','甜','公斤','冰','极','斤','香蕉','一共','毛','结婚','不但','而且','声','开机'],image:img('photo-text-3-weighing'),introEn:'Learn shopping units and bargaining language. 1 斤 = 500 grams; 10 毛 = 1 块. “不甜不要钱” is an advertising expression, not a literal promise in every shop.',contexts:[['请给我两____香蕉。','斤'],['这些水果____多少钱？','一共'],['这块西瓜甜____了。','极'],['这台电视____便宜，而且很方便。','不但'],['叫电视一____就能开机。','声']]}
];
function mission(spec, index){
  const sessionWords=spec.words.map(word);
  const distract=(answer,i)=>spec.words.filter(x=>x!==answer).slice(i%Math.max(1,spec.words.length-2),i%Math.max(1,spec.words.length-2)+2);
  const meanings=spec.words.slice(0,5).map((h,i)=>q(`${spec.session.toLowerCase()}2q${i+1}`,'',`Which Chinese expression means “${word(h).english}”?`,[h].concat(distract(h,i)).slice(0,3),h));
  const context=spec.contexts.map((x,i)=>q(`${spec.session.toLowerCase()}4q${i+1}`,x[0],'Choose the word that completes the sentence.',[x[1]].concat(distract(x[1],i)).slice(0,3),x[1]));
  const rankedMeaningCount=Math.min(7,spec.words.length);
  const ranked=spec.words.slice(0,rankedMeaningCount).map((h,i)=>q(`${spec.session.toLowerCase()}5q${i+1}`,'',`Choose “${word(h).english}”.`,[h].concat(distract(h,i)).slice(0,3),h)).concat(spec.contexts.slice(0,10-rankedMeaningCount).map((x,i)=>q(`${spec.session.toLowerCase()}5q${i+rankedMeaningCount+1}`,x[0],'Choose the best answer.',[x[1]].concat(distract(x[1],i+1)).slice(0,3),x[1])));
  return {id:`pm_hsk3_l07_${spec.session.toLowerCase()}`,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:`第${index+1}次课课前热身赛`,titleEn:`Preview ${spec.session}`,subtitleEn:spec.titleEn,scenario:spec.title,goals:[spec.title,'理解本次课核心表达','为课堂购物任务做准备'],storyIntro:spec.title,storyIntroEn:spec.introEn,stages:[
    {id:`${spec.session.toLowerCase()}1`,title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先看图片、背景提示和本次生词。',screenPromptEn:spec.introEn,interactionType:'study_list',photos:[{src:'../in-class/'+spec.image,label:spec.title}],keywordCards:sessionWords.map(v=>card(v.hanzi))},
    {id:`${spec.session.toLowerCase()}2`,title:'快速认词',titleEn:'Meaning Check',screenPrompt:'根据英文意思选择中文词。',screenPromptEn:'Choose the Chinese word that matches each meaning.',interactionType:'practice_quiz',questions:meanings},
    {id:`${spec.session.toLowerCase()}3`,title:'汉英配对',titleEn:'Match Sprint',screenPrompt:'把中文词和英文意思配成一组。',screenPromptEn:'Match the Chinese expressions with their English meanings.',interactionType:'timed_match',pairs:sessionWords.slice(0,6).map(v=>({word:v.hanzi,meaning:v.english}))},
    {id:`${spec.session.toLowerCase()}4`,title:'语境判断',titleEn:'Context Check',screenPrompt:'在完整购物语境中选择合适的词。',screenPromptEn:'Choose the expression that completes each shopping situation.',interactionType:'practice_quiz',questions:context},
    {id:`${spec.session.toLowerCase()}5`,title:'正式挑战',titleEn:'Ranked Challenge',screenPrompt:'十题计分，正确率优先，同分时用时更短者在前。',screenPromptEn:'Ten scored questions. Accuracy comes first; time breaks a tie.',interactionType:'ranked_quiz',questions:ranked}
  ],completionMessageEn:`Your official score has been saved. A score of 70% or above completes Preview ${spec.session}.`};
}

const fills = [
  [['辆','自行车','旧','矮','试'],['这____自行车是小雪八岁时买的。','她长高以后，原来的车已经太____了。','这台电视用了很多年，看起来有点儿____。','周末我们去____店看看新车。','买以前最好让孩子先____一下。']],
  [['短裤','大小','合适','裙子','决定'],['王一雪先试穿了一条黄色____。','衣服的颜色好看，可是____不一定合适。','这双鞋不大不小，穿起来很____。','刘明觉得那条____更好看。','比较价格以后，她再做____。']],
  [['机场','菜单','宾馆','照片','信用卡'],['坐飞机以前要早点儿到____。','服务员拿来____以后，我们开始点菜。','旅行时这家____离地铁站很近。','她给我们看了很多草原____。','除了手机付款，也可以使用____。']]
].map((g,gi)=>({id:`l07_fill_group_0${gi+1}`,type:'vocab_fill_group',stage:'in_class',contentRole:['lesson','transfer','review'][gi],prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:g[0],wordBank_pinyin:g[0].map(x=>(word(x)||{}).pinyin||''),sentences:g[1].map((s,i)=>({sentence:s,answer:g[0][i]})),speakingOutput:{support:'任选两个词，完成一句话。',core:'任选三个词，用两句话说明一个完整情境。',stretch:'任选四个词，完成30秒购物故事。'}}}));

const orders = [
  ['咱们可以走着去商场。',['咱们','可以','走着','去商场']],
  ['那条裙子比短裤更好看。',['那条裙子','比','短裤','更好看']],
  ['裙子不比短裤贵多少。',['裙子','不比','短裤','贵多少']],
  ['这块冰西瓜甜极了。',['这块','冰西瓜','甜','极了']],
  ['现在的电视不但便宜，而且用着方便。',['现在的电视','不但','便宜','而且','用着方便']]
].map((x,i,a)=>({id:`l07_order_0${i+1}`,type:'ordering',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'把语块排成一个完整、自然的句子。',prompt_en:'Put the chunks in order to make a complete sentence.',correct_answer:x[0],data:{chunks:x[1],chunks_pinyin:x[1].map(()=> '')}}));

const readPassages = [
  ['换一把学习椅','小林长高了，小时候买的椅子已经太矮了。他和妈妈去家具店试了三把椅子，最后选择了一把大小合适的新椅子。','小林为什么换椅子？','因为他长高了，旧椅子太矮。'],
  ['比较两件外套','蓝外套比黑外套更轻，黑外套不比蓝外套贵多少。小周常常走着去上课，所以最后买了更轻的蓝外套。','小周为什么买蓝外套？','因为蓝外套更轻。'],
  ['周末买水果','安娜买了一个西瓜和两斤香蕉。西瓜五块钱一公斤，香蕉六块钱一斤。她先尝了西瓜，觉得甜极了。','安娜买了哪些水果？','一个西瓜和两斤香蕉。'],
  ['选择新冰箱','陈老师家的旧冰箱太小了。他在网上看了几台新冰箱，新冰箱不但更大，而且更省电，最后请家人一起决定。','新冰箱有哪些优点？','不但更大，而且更省电。'],
  ['旅行前的决定','王一飞比较了飞机和高铁。飞机更快，但是高铁不比飞机票贵多少，而且车站离家更近。她决定坐高铁。','王一飞最后选择什么？','她决定坐高铁。']
].map((x,i,a)=>({id:`l07_read_0${i+1}`,type:'passage_reading',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'阅读小篇章，回答问题。',prompt_en:'Read and answer.',data:{title:x[0],passage:x[1],questions:[{question_cn:x[2],answer:x[3]}]}}));

const taskCards = [
  ['为什么要换？','Why Does It Need Replacing?','选择一个太旧、太小或不合适的物品。',['展示图片','说明现在的问题','提出购买计划'],['旧','太……','大小','合适'],'每人说3—4句话。'],
  ['衣服二选一','Choose One of Two Clothes','比较两件真实或图片中的衣服。',['比较颜色和大小','比较价格','做出决定'],['比……更……','不比……多少','决定'],'两人完成三轮对话。'],
  ['水果店买东西','Shop at a Fruit Stall','一人做店员，一人做顾客。',['询问价格和单位','先尝再选择','计算总价并礼貌讲价'],['公斤','斤','一共','极了'],'完成40秒角色扮演。'],
  ['推荐智能家电','Recommend a Smart Appliance','向同学推荐一件智能家电。',['说明旧物问题','介绍两个优点','给出购买建议'],['不但……而且……','开机','更方便'],'每位组员至少说两句。'],
  ['复习旅行选择','Review a Travel Choice','比较两种去草原或上海的交通方式。',['比较时间','比较价格','说明最后决定'],['飞机','高铁','比','决定'],'用3—4句话说明。']
].map((x,i,a)=>({id:`l07_task_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:`任务卡：${x[0]}。`,prompt_en:x[1],openEnded:true,needsTeacherReview:true,data:{title:x[0],titleEn:x[1],role:x[2],steps:x[3],keywords:x[4],output:x[5],answerPlaceholder:'请写下课堂表达。'}}));

const sceneChoices = [
  ['A child has grown taller and the old bicycle is now too low.','Use 太……了.','她长高了，这辆自行车已经太矮了。'],
  ['The mall is nearby, so the family can go on foot.','Use V着V.','商场不远，咱们可以走着去。'],
  ['A shopper thinks the skirt looks better than the shorts.','Use 比……更…….','那条裙子比短裤更好看。'],
  ['The two prices are close.','Use 不比……多少.','裙子不比短裤贵多少。'],
  ['The customer tastes a very sweet watermelon.','Use 极了.','这块冰西瓜甜极了。'],
  ['The customer asks for the total price.','Use 一共.','这些水果一共多少钱？'],
  ['A smart television has two advantages.','Use 不但……而且…….','这台电视不但便宜，而且用着方便。'],
  ['A student compares two schoolbags before buying.','Transfer 比……更…….','蓝书包比黑书包更轻。'],
  ['A hotel has a different style from other hotels.','Review 跟……不一样.','这家宾馆跟别的都不一样。'],
  ['More people now choose high-speed rail.','Review 越来越.','选择坐高铁的人越来越多。']
].map((x,i,a)=>({id:`l07_scene_${String(i+1).padStart(2,'0')}`,type:'scene_sentence_choice',stage:'in_class',contentRole:roleFor(i,a.length),prompt_en:'Choose the best sentence for the scene.',data:{scene_en:x[0],clue_en:x[1],options:[x[2],'服务员给我们拿来了菜单。','这个小区离银行比较近。','照片里的天气好得很。'],correct_index:0},correct_answer:x[2]}));

const matchGroups = [
  [['为什么要换这辆自行车？','因为小雪长高了，旧车已经太矮了。'],['新自行车在哪里买？','商场里新开了一家自行车店。'],['为什么要带小雪一起去？','要让她亲自试一下大小。'],['商场离家远吗？','不远，可以走着去。'],['王一雪还想看什么？','她还想再看看衣服。']],
  [['黄色短裤的大小怎么样？','大小合适。'],['刘明觉得哪件更好看？','他觉得裙子比短裤更好看。'],['裙子比短裤贵多少钱？','贵八十块钱。'],['为什么刘明还是建议买裙子？','因为价格差得不多，而且裙子更好看。'],['王一雪马上决定了吗？','没有，她想多看看再决定。']],
  [['西瓜怎么卖？','五块钱一公斤。'],['“一斤”是多少克？','一斤是500克。'],['这些水果一共多少钱？','一共五十八块五毛。'],['新电视为什么更方便？','有的叫它一声就能开机。'],['刘明最后让谁决定？','他让王一雪来决定。']]
].map((pairs,i)=>({id:`l07_match_0${i+1}`,type:'word_match',stage:'in_class',contentRole:['lesson','transfer','review'][i],prompt_en:'Match each question with the best answer.',data:{pairs:pairs.map(x=>({left:x[0],right:x[1]}))}}));

const guessRows = [
  ['自行车','有两个轮子，人可以骑着它去学校。'],['短裤','夏天常穿，裤腿比较短的一种衣服。'],['裙子','一种没有两条裤腿的衣服。'],['西瓜','外面通常是绿色，里面红色，夏天吃起来很甜。'],['香蕉','黄色、长长的，需要去皮以后吃的水果。'],['公斤','称东西时常用的重量单位，等于1000克。'],['斤','中国市场常用的重量单位，等于500克。'],['开机','让电视、电脑或手机开始工作。'],['宾馆','旅行时可以住宿的地方。'],['菜单','在饭馆里介绍菜和饮料的单子。']
];
const guesses = guessRows.map((x,i,a)=>({id:`l07_desc_${String(i+1).padStart(2,'0')}`,type:'description_guess',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'读完整提示，联系语境猜词。',prompt_en:'Read the full clue and guess the word.',data:{description:x[1],options:[x[0],'沙发','后来','水平'],correct_index:0},correct_answer:x[0]}));

const sayRows = [
  ['自行车',['两个轮子','骑','交通工具']],['短裤',['夏天','衣服','裤腿短']],['裙子',['衣服','比较','好看']],['西瓜',['水果','绿色外皮','甜']],
  ['公斤',['重量','1000克','称']],['智能电视',['语音','开机','方便']],['宾馆',['旅行','房间','住']],['高铁',['城市之间','速度快','火车']]
];
const sayGuess = sayRows.map((x,i,a)=>({id:`l07_say_${String(i+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:x[0],boardIndex:i+1,clues:[],scaffold:{words:x[1],frames:['这是一个……。','人们用它 / 在这里……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));

const blindRows = [[['旧','太矮'],['这辆旧自行车已经太矮了。']],[['比','更'],['这条裙子比短裤更好看。']],[['极了','新鲜'],['今天的西瓜新鲜极了。']],[['不但','而且'],['这台电视不但便宜，而且方便。']]];
const blind = blindRows.map((x,i,a)=>({id:`l07_blind_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:x[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:x[1][0]}}));

const pictureKeywords = [['photo-text-1-old-bike','旧、太……'],['photo-text-1-bike-shop','试一下'],['photo-text-2-fitting','大小合适'],['photo-text-2-comparison','比……更……'],['photo-text-3-watermelon','极了'],['photo-text-3-weighing','一共'],['photo-text-4-small-tv','是时候……了'],['photo-text-4-smart-tv','不但……而且……']];
const pictureComplete = pictureKeywords.map((x,i,a)=>({id:`l07_pic_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the target expression to write one complete sentence about the photo.',data:{image:img(x[0]),keyword:x[1],task:'',answerPlaceholder:''}}));

const independent = readPassages.map((x,i)=>{const q0=x.data.questions[0],opts=[q0.answer,'因为他想去爬山。','因为服务员拿来了菜单。','因为机场离宾馆很近。'];return{id:`l07_ind_read_0${i+1}`,type:'choice',stage:'in_class',contentRole:x.contentRole,prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:x.data.title,passage:x.data.passage,question_cn:q0.question_cn,options:opts,correct_index:0},correct_answer:q0.answer}});

const paragraphRows = [
  ['换一辆自行车',['小雪八岁时买了一辆自行车。','____1____','现在她已经长高了。','____2____','爸爸妈妈决定带她去自行车店。','____3____'],['这辆车现在看起来有点儿旧。','原来的车对她来说太矮了。','买新车以前要让她先试一下。']],
  ['在服装店',['王一雪先试穿黄色短裤。','____1____','刘明又看见一条裙子。','____2____','两件衣服只差八十块。','____3____'],['短裤的大小很合适。','他觉得裙子比短裤更好看。','王一雪决定多看看。']],
  ['买水果',['店员说西瓜又大又新鲜。','____1____','王一雪尝了一块冰西瓜。','____2____','她又买了两斤香蕉。','____3____'],['西瓜五块钱一公斤。','她觉得西瓜甜极了。','最后店员同意收五十五块。']],
  ['选择新电视',['刘明家的房子变大了。','____1____','旧电视是他们结婚时买的。','____2____','他在网上看了好几台新电视。','____3____'],['原来的电视看起来有点儿小。','现在是时候换一个新的了。','新电视不但便宜，而且方便。']],
  ['旅行选择复习',['安娜准备周末去上海。','____1____','飞机更快，但是机场比较远。','____2____','她比较价格和时间以后做了决定。','____3____'],['她先比较了飞机和高铁。','高铁不比飞机票贵多少。','最后她决定坐高铁。']]
];
const paragraphs = paragraphRows.map((x,i,a)=>({id:`l07_para_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'段落填空。',prompt_en:'Choose three sentences to complete the paragraph.',openEnded:true,needsTeacherReview:true,data:{title:x[0],passageParts:x[1],options:x[2].concat(['我下午去银行。','大家比较了几张照片。','服务员先拿来了菜单。']),answers:[0,1,2],instructions:'点击句子，再点击对应空格。',answerPlaceholder:''}}));

const chainRows = [
  ['旧自行车的新故事','小雪发现自行车太旧了',['旧','需要','换','试一下','合适'],['jiù','xūyào','huàn','shì yíxià','héshì']],
  ['服装店里的决定','王一雪在服装店试衣服',['短裤','裙子','比……更……','不比……多少','决定'],['duǎnkù','qúnzi','bǐ……gèng……','bù bǐ……duōshao','juédìng']],
  ['水果店里的讲价','王一雪来到水果店',['新鲜','甜极了','一共','便宜点儿','不能再……了'],['xīnxiān','tián jí le','yígòng','piányi diǎnr','bù néng zài……le']],
  ['选择一台智能电视','刘明想换一台新电视',['旧电视','不但','而且','开机','决定'],['jiù diànshì','búdàn','érqiě','kāijī','juédìng']],
  ['周末去商场','周末我们一起去商场',['先','走着去','再','买二送一','最后'],['xiān','zǒuzhe qù','zài','mǎi èr sòng yī','zuìhòu']]
];
const chains = chainRows.map((x,i,a)=>({id:`l07_chain_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'五词故事接龙。',prompt_en:'Build one story with five covered words.',openEnded:true,needsTeacherReview:true,data:{title:x[0],starter:x[1],steps:x[2].map((_,k)=>`第${k+1}句：使用“${x[2][k]}”继续故事。`),keywords:x[2],keywords_pinyin:x[3],chainModes:['teacher','race','team'],instructions:'五个词先全部盖住，每次打开一个词并接一句，最后形成完整故事。',answerPlaceholder:'用当前打开的词继续故事。'}}));

const battleGames = {
  roulette:[
    {id:'l07_r_01',challenge:'说明为什么需要换一件物品。',scene:'你发现家里的一件东西太旧或不合适。',keywords:['旧','太……','大小'],sample:'这辆自行车太旧了，而且大小不合适，我们应该换一辆新的。'},
    {id:'l07_r_02',challenge:'比较两个商品并做决定。',scene:'你正在服装店选择衣服。',keywords:['比……更……','不比……多少','决定'],sample:'裙子比短裤更好看，也不比短裤贵多少，所以我决定买裙子。'},
    {id:'l07_r_03',challenge:'在水果店完成询价和讲价。',scene:'你要买西瓜和香蕉。',keywords:['公斤','斤','一共'],sample:'西瓜怎么卖？再给我两斤香蕉，一共多少钱？'},
    {id:'l07_r_04',challenge:'用三句话推荐一件智能商品。',scene:'你在介绍一台新电视。',keywords:['不但……而且……','方便','开机'],sample:'这台电视不但便宜，而且很方便，叫它一声就能开机。'}
  ],
  relay:[
    {id:'l07_relay_01',starter:'自行车',goal:'接一个说明更换理由的短句。',mustUse:['旧','太矮']},
    {id:'l07_relay_02',starter:'裙子',goal:'接一个完整的比较句。',mustUse:['比','更']},
    {id:'l07_relay_03',starter:'西瓜',goal:'接一个询价或评价句。',mustUse:['公斤','极了']},
    {id:'l07_relay_04',starter:'电视',goal:'接一个递进复句。',mustUse:['不但','而且']}
  ],
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：zìxíngchē',answer:'自行车'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：qúnzi',answer:'裙子'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：xīguā',answer:'西瓜'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“合适”说一个短语。',answer:'大小合适 / 很合适'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“一共”说一个短语。',answer:'一共多少钱 / 一共五十块'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“开机”说一个短语。',answer:'自动开机 / 开机以后'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'一斤等于多少克？',options:['500克','100克','1000克'],answer:'500克'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“甜极了”表示什么？',options:['非常甜','不太甜','越来越甜'],answer:'非常甜'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“走着”说一句话。',answer:'商场不远，我们走着去。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“比……更……”说一句话。',answer:'这台电视比那台更方便。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“不但……而且……”说一句话。',answer:'这个西瓜不但新鲜，而且很甜。'}
  ]}
};

const homework = {mode:'hsk3_session_tasks',instructions:{required:'完成“我的购物建议”的当次准备卡；最终作品主要在课堂展示。',optional:'不需要上传录音。A 的需求图片和 B 的比较表会直接用于 C。',aiPolicy:'先独立选择商品、图片和信息，再使用工具检查语言。'},sessionMeta:{
  A:{label:'购物建议 · 第1步',goal:'选择一个需要更换或购买的物品，准备图片和购买原因。',suggested_minutes:'10-15分钟',suggested_mix:'完成需求卡；下次课向同伴说明现状。'},
  B:{label:'购物建议 · 第2步',goal:'比较两个商品选择，记录价格、大小、颜色或特点并做决定。',suggested_minutes:'10-15分钟',suggested_mix:'完成比较表；课堂两人互相检查比较句。'},
  C:{label:'课堂最终项目 · 我的购物建议',goal:'整合 A 和 B，完成1—2分钟购物推荐。',suggested_minutes:'15-20分钟',suggested_mix:'不强制上传录音；课堂先小组彩排，再展示。'}
},sessions:{
  A:[
    {id:'post_l07_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'购物建议 1/3 · 发现需要',required:true,prompt_cn:'你有什么东西太旧、太小或不合适，需要更换或购买？',prompt_en:'Choose one item that is too old, too small or unsuitable and needs replacing or buying.',answerPlaceholder:'我的……已经……了。我需要……，因为……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l07_a_plan',type:'project_card',taskLabel:'需求与理由卡',projectStage:'购物建议 1/3 · 保存到最终展示',required:true,prompt_cn:'准备一张物品图片，写出现状、需要更换的原因和购买时要试什么。',prompt_en:'Prepare one item photo. Describe its current condition, why it needs replacing, and what you should try or check before buying.',answerPlaceholder:'物品：……；现在：……；需要更换，因为……；购买以前要试/检查……。',needsTeacherReview:true,openEnded:true,wordBank:['旧','太……','大小','合适','试一下'],picturePrompts:['需要更换的物品图片','现在的问题','新物品需要的大小或特点'],scaffoldLevels:[{label:'基础层 / Support',instruction:'使用句框写3句话，说明物品和问题。'},{label:'标准层 / Core',instruction:'写4—5句话，使用“旧、太……、大小、合适”中的三个。'},{label:'挑战层 / Challenge',instruction:'补充一种替代方案，并说明购买前要怎样试。'}]},
    {id:'post_l07_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Item Need Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: My Item Need',prompt_en:'Prepare the item and the reason it needs replacing.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one clear photo of an item that needs replacing or buying.','Be ready to answer: What is the item? What is wrong with it? Why do you need a new one?','Use at least three of these expressions: 旧, 太……, 大小, 合适, 试一下.','You may discuss ideas with a partner. No audio upload is required.'],classroomNote:'Keep this need card. You will use it in your final shopping recommendation.'}
  ],
  B:[
    {id:'post_l07_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'购物建议 2/3 · 找到两个选择',required:true,prompt_cn:'为 Homework A 的物品找到两个可以比较的商品。它们最重要的不同是什么？',prompt_en:'Find two product choices for the item from Homework A. What are the most important differences?',answerPlaceholder:'选择A是……；选择B是……；它们的……不一样。',needsTeacherReview:true,openEnded:true},
    {id:'post_l07_b_plan',type:'project_card',taskLabel:'商品比较卡',projectStage:'购物建议 2/3 · 保存比较结果',required:true,prompt_cn:'比较两个商品的价格、大小、颜色或特点，至少写三个比较句并做决定。',prompt_en:'Compare two products by price, size, color or features. Write at least three comparison sentences and make a decision.',answerPlaceholder:'A比B更……。A不比B……多少。A的大小很合适，也更适合我。我决定……，因为……。',needsTeacherReview:true,openEnded:true,wordBank:['比……更……','比……还……','不比……多少','适合','合适','决定'],picturePrompts:['商品A图片和价格','商品B图片和价格','大小、颜色或特点'],carryFrom:[{session:'A',taskId:'post_l07_a_plan',label:'A · 我的需求与理由卡'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'填写比较表，完成两个比较句和一个决定句。'},{label:'标准层 / Core',instruction:'写三个不同维度的比较句，并正确使用“适合”或“合适”。'},{label:'挑战层 / Challenge',instruction:'加入促销、使用体验或长期价值，解释哪个选择更值得。'}]},
    {id:'post_l07_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Product Comparison',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Compare Two Choices',prompt_en:'Prepare a clear comparison of your two product choices.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring your Homework A item card and two product images.','Include the price and at least two features for each product.','Use 比……更…… and 不比……多少, then make a decision.','Work may be checked with a partner. No audio upload is required.'],classroomNote:'Save the two choices and your decision for the final recommendation.'}
  ],
  C:[
    {id:'post_l07_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'购物建议 3/3 · 组织推荐',required:true,prompt_cn:'听众最需要知道哪三个信息，才能接受你的购买建议？',prompt_en:'Which three pieces of information will help your audience understand and accept your recommendation?',answerPlaceholder:'听众需要知道……、……和……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l07_c_final',type:'portfolio_final',taskLabel:'最终展示稿',projectStage:'课堂大作业 · 我的购物建议',required:true,prompt_cn:'整合需要、两项商品比较和最后决定，准备1—2分钟“我的购物建议”。',prompt_en:'Combine the need, two product choices, comparison and final decision into a 1–2 minute Smart Shopper Recommendation.',answerPlaceholder:'我的……已经……，所以需要……。A比B更……，但A不比B……多少。A很适合我，大小也很合适。A不但……，而且……。我决定……，因为……。',needsTeacherReview:true,openEnded:true,wordBank:['旧','太……','适合','合适','比……更……','不比……多少','决定','极了','不但……而且……'],picturePrompts:['需要更换的物品','商品A及信息','商品B及信息','最终选择'],carryFrom:[{session:'A',taskId:'post_l07_a_plan',label:'A · 需求与理由卡'},{session:'B',taskId:'post_l07_b_plan',label:'B · 商品比较卡'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'按“需要—比较—决定”使用6个句框完成展示。'},{label:'标准层 / Core',instruction:'使用至少6个本课词和2个语法结构，完成约1分钟推荐。'},{label:'挑战层 / Challenge',instruction:'加入价格单位、促销或智能功能，回应同学的一个问题，完成约2分钟推荐。'}]},
    {id:'post_l07_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · Smart Shopper Recommendation',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Shopping Recommendation',prompt_en:'Present your Smart Shopper Recommendation mainly in class.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one to three images: the item you need, product A and product B. Include useful price, size, color or feature information.','Answer: What do you need? Why? What are the two choices? How are they different? Which one do you recommend and why?','Use at least six lesson words and at least two structures: V1着V2, 比……更……, 不比……多少, 极了, or 不但……而且…….','Speak for 1–2 minutes. You may work in pairs or small groups, but every student must explain one comparison or reason.','Present mainly in class. Audio upload is not required.'],classroomNote:'Use the need card from A and the comparison card from B. Mistakes and weak points stay collapsed until you choose to review them.'}
  ]
}};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L07',lessonKey:'HSK3-L07',title:'那条裙子比短裤更好看',titleEn:'That skirt looks better than the shorts',topic:'购物、比较商品、询价讲价与智能家电',courseModel:'三次课：说明更换需要 → 比较商品并决定 → 询价、评价并完成购物建议',sourceTextPolicy:'四篇教材中文和拼音保持原文；课文三按确认后的说话人拆分；课文四英文译文、文化说明、任务链和练习属于教学扩展。'},
  pedagogy:{exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'主观任务提供基础、标准、挑战三档输出，要求每位组员参与表达。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：说明为什么需要更换',textIds:['t_hsk3_l07_01'],previewMissionId:'pm_hsk3_l07_a',focus:['旧自行车与更换理由','试用新商品','V1着V2']},
    {id:'B',title:'第二次课：比较商品并做决定',textIds:['t_hsk3_l07_02'],previewMissionId:'pm_hsk3_l07_b',focus:['服装款式与大小','价格和促销','比……更……与不比','适合与合适']},
    {id:'C',title:'第三次课：询价、评价与购物建议',textIds:['t_hsk3_l07_03','t_hsk3_l07_04'],previewMissionId:'pm_hsk3_l07_c',focus:['水果单位与讲价','智能电视体验','极了与不但……而且……']}
  ],
  vocabScenes:sceneData,vocabulary,grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(v=>[v.id,{session:v.tags[0],phrases:v.phrases}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l07_a',vocabularyIds:vocabulary.map(v=>v.id),grammarIds:grammar.map(g=>g.id),readingData:[{id:'pre_l07_read',title:'需要换一个新的',text:'这辆自行车有点儿旧，而且太矮了。买新车以前，让小雪先试一下。'}]},
  inClass:{questionGroups:{
    v5_vocab_fill:fills,g1_ordering:orders,r2_passage_choice:readPassages,t2_task_card:taskCards,battleGames,scene_sentence_choice:sceneChoices,v7_word_match:matchGroups,v6_description_guess:guesses,v2_say_guess:sayGuess,v3_blind_box:blind,g2_picture_complete:pictureComplete,r3_independent_reading:independent,r4_paragraph_fill:paragraphs,t3_chain_sentence:chains,
    info_match:[
      {id:'l07_info_01',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each person with the action.',data:{people:['王一雪','刘明','小雪','店员'],clues:['比较衣服并讲价','建议买裙子','试新自行车','介绍西瓜并同意55元'],answer:['王一雪-比较衣服并讲价','刘明-建议买裙子','小雪-试新自行车','店员-介绍西瓜并同意55元']}},
      {id:'l07_info_02',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each shopping scene with the key information.',data:{people:['自行车店','服装店','水果店','网上选电视'],clues:['先试大小','比较480和400','一斤等于500克','语音可以开机'],answer:['自行车店-先试大小','服装店-比较480和400','水果店-一斤等于500克','网上选电视-语音可以开机']}}
    ],
    pk_question:[['这辆车已经太____了。','矮'],['裙子比短裤____好看。','更'],['这块西瓜甜____了。','极']].map((x,i)=>({id:`l07_pk_0${i+1}`,type:'choice',prompt_cn:x[0],prompt_en:'Choose the word.',correct_answer:x[1],data:{question_cn:x[0],options:[x[1],'旧','斤','声'],correct_index:0}})),textQa:[],pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{focus:['购物词汇','V1着V2','商品比较句','适合与合适','极了','不但……而且……','询价和购物建议'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应五步预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'用需求卡和比较卡重新完成一次购物建议。'}]}
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log(`Wrote ${out}`);
