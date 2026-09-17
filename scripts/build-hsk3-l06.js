const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L06.json');
const img = name => `images/hsk3-l06/${name}.png`;
const roleFor = (index, total) => index < Math.floor(total * .5) ? 'lesson' : index < Math.floor(total * .8) ? 'transfer' : 'review';

const vocabRows = [
  ['该','gāi','能愿动词','should; it is time to','A','八点了，我们该上课了。',['该走了','该买票了']],
  ['打算','dǎsuàn','动词/名词','plan; intention','A','你打算怎么去上海？',['打算坐高铁','有什么打算']],
  ['高铁','gāotiě','名词','high-speed train','A','从北京到上海的高铁很方便。',['坐高铁','高铁票']],
  ['行','xíng','动词/形容词','be all right; okay','A','坐高铁去上海，行！',['行不行','这样也行']],
  ['路口','lùkǒu','名词','intersection; crossing','B','过了前面的路口就到车站了。',['前面的路口','过路口']],
  ['小心','xiǎoxīn','动词/形容词','take care; careful','B','这条路车很多，您小心点儿。',['小心点儿','路上小心']],
  ['迟到','chídào','动词','be late','B','我们早点儿出发，就不会迟到。',['上课迟到','不会迟到']],
  ['红绿灯','hónglǜdēng','名词','traffic lights','B','这个路口有两个红绿灯。',['等红绿灯','红绿灯很多']],
  ['后来','hòulái','名词','afterward; later','B','他走错过一次，后来再也不走那条路了。',['后来发现','后来才知道']],
  ['急','jí','形容词/动词','anxious; in a hurry','B','别急，我们还有一个小时。',['一着急','别着急']],
  ['如果','rúguǒ','连词','if','B','如果堵车，我们就坐地铁。',['如果……就……','如果有时间']],
  ['以前','yǐqián','名词','before; earlier','B','如果没走错，二十分钟以前就到了。',['很久以前','下课以前']],
  ['耳机','ěrjī','名词','earphones; headphones','C','我的耳机没电了。',['一副耳机','戴耳机']],
  ['充电宝','chōngdiànbǎo','名词','power bank','C','你带充电宝了吗？',['带充电宝','用充电宝']],
  ['常用','chángyòng','形容词','commonly used','C','这些常用的东西都在包里。',['常用的东西','常用词语']],
  ['越','yuè','副词','the more...; increasingly','C','前面的人越来越多了。',['越来越多','越来越方便']],
  ['分开','fēnkāi','动词','separate','C','车站人很多，我们别分开。',['不要分开','分开走']],
  ['检查','jiǎnchá','动词','check; inspect','C','出门以前检查一下护照。',['检查行李','检查一下']],
  ['刷','shuā','动词','scan; swipe','C','刷护照就能检票进站。',['刷护照','刷卡']],
  ['检票','jiǎnpiào','动词','check tickets','C','我们去二层检票。',['检票进站','检票口']],
  ['电梯','diàntī','名词','elevator; escalator','C','坐电梯去二层。',['坐电梯','电梯上去']],
  ['放假','fàngjià','动词','have a vacation','C','这次放假，我去了北京和上海。',['放假的时候','学校放假']],
  ['沙发','shāfā','名词','sofa','C','高铁座位像家里的沙发一样舒服。',['坐在沙发上','一张沙发']],
  ['安静','ānjìng','形容词','quiet','C','车厢里又安静又舒服。',['非常安静','安静的车厢']],
  ['选择','xuǎnzé','动词','choose','C','在手机上选择车站和想吃的东西。',['选择车站','做出选择']],
  ['必须','bìxū','副词','must; have to','C','进站时必须带好护照。',['必须准备','必须完成']],
  ['北京南站','Běijīng Nán Zhàn','专有名词','Beijing South Railway Station','C','我是从北京南站坐高铁去的上海。',['到北京南站','从北京南站出发']]
];
const vocabulary = vocabRows.map((r, i) => ({id:`v06_${String(i + 1).padStart(2, '0')}`,hanzi:r[0],pinyin:r[1],pos:r[2],english:r[3],tags:[r[4]],example:r[5],phrases:r[6]}));
const word = hanzi => vocabulary.find(v => v.hanzi === hanzi);
const card = hanzi => { const v = word(hanzi); return {hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,example:v.example,exampleEnglish:''}; };

const texts = [
  {id:'t_hsk3_l06_01',textId:1,title:'终于可以坐高铁了',setting:'在咖啡厅里，李文和白家月在聊天儿。',audio:'../../audio/HSK3/6-1.mp3',lines:[
    ['李文','家月，咱们该买去上海的票了。你打算怎么去上海？','Jiāyuè, zánmen gāi mǎi qù Shànghǎi de piào le. Nǐ dǎsuàn zěnme qù Shànghǎi?','Jiayue, it is time to buy our tickets to Shanghai. How do you plan to get there?'],
    ['白家月','我还没坐过高铁，咱们坐高铁去，怎么样？','Wǒ hái méi zuò guo gāotiě, zánmen zuò gāotiě qù, zěnmeyàng?','I have not taken a high-speed train yet. How about going by high-speed train?'],
    ['李文','没问题，从北京到上海的高铁很多，非常方便。','Méi wèntí, cóng Běijīng dào Shànghǎi de gāotiě hěn duō, fēicháng fāngbiàn.','No problem. There are many high-speed trains from Beijing to Shanghai, so it is very convenient.'],
    ['白家月','行！怎么买高铁票？','Xíng! Zěnme mǎi gāotiě piào?','Great! How do we buy high-speed train tickets?'],
    ['李文','用手机 App 就能买。给我你的护照，我帮你买。','Yòng shǒujī App jiù néng mǎi. Gěi wǒ nǐ de hùzhào, wǒ bāng nǐ mǎi.','You can buy them with a mobile app. Give me your passport and I will help you.'],
    ['白家月','早就听说过高铁，终于可以坐上了。','Zǎojiù tīngshuō guo gāotiě, zhōngyú kěyǐ zuòshang le.','I have heard about high-speed trains for a long time, and now I can finally take one.'],
    ['李文','高铁又快又舒服，你一定会喜欢的。','Gāotiě yòu kuài yòu shūfu, nǐ yídìng huì xǐhuan de.','High-speed trains are both fast and comfortable. You will definitely like the trip.']
  ]},
  {id:'t_hsk3_l06_02',textId:2,title:'如果没走错，早就到了',setting:'在车上，刘明开车送白家月和李文去高铁站。',audio:'../../audio/HSK3/6-3.mp3',lines:[
    ['刘明','过了前面的路口就到高铁站了。','Guòle qiánmian de lùkǒu jiù dào gāotiězhàn le.','We will reach the high-speed railway station after the intersection ahead.'],
    ['白家月','我看见了。马上就到了，这条路车很多，您小心点儿。','Wǒ kànjiàn le. Mǎshàng jiù dào le, zhè tiáo lù chē hěn duō, nín xiǎoxīn diǎnr.','I see it. We are almost there. There are many cars on this road, so please be careful.'],
    ['刘明','好，你们还有一个小时，应该不会迟到的。','Hǎo, nǐmen hái yǒu yí gè xiǎoshí, yīnggāi bú huì chídào de.','Okay. You still have an hour, so you should not be late.'],
    ['白家月','我发现这条路车多，红绿灯也多。','Wǒ fāxiàn zhè tiáo lù chē duō, hónglǜdēng yě duō.','I noticed that this road has heavy traffic and many traffic lights.'],
    ['刘明','是啊，这条路我走过一次，后来再也不走了。','Shì a, zhè tiáo lù wǒ zǒuguo yí cì, hòulái zài yě bù zǒu le.','Yes. I took this road once and never used it again afterward.'],
    ['白家月','那您今天为什么走了这条路？','Nà nín jīntiān wèishénme zǒule zhè tiáo lù?','Then why did you take this road today?'],
    ['刘明','我一急就走错了。如果没走错，二十分钟以前就到了。','Wǒ yì jí jiù zǒu cuò le. Rúguǒ méi zǒu cuò, èrshí fēnzhōng yǐqián jiù dào le.','I took a wrong turn because I was in a hurry. If I had not gone the wrong way, we would have arrived twenty minutes ago.']
  ]},
  {id:'t_hsk3_l06_03',textId:3,title:'刷护照就能进站',setting:'在高铁站，李文和白家月排队安检、检票。',audio:'../../audio/HSK3/6-5.mp3',lines:[
    ['白家月','李文，我的耳机没电了，你有充电宝吗？','Lǐ Wén, wǒ de ěrjī méi diàn le, nǐ yǒu chōngdiànbǎo ma?','Li Wen, my earphones are out of power. Do you have a power bank?'],
    ['李文','有，这些常用的东西我都放在包里了，我给你拿。','Yǒu, zhèxiē chángyòng de dōngxi wǒ dōu fàng zài bāo li le, wǒ gěi nǐ ná.','Yes. I keep these commonly used things in my bag. I will get it for you.'],
    ['白家月','前面的人越来越多了。','Qiánmian de rén yuèláiyuè duō le.','There are more and more people ahead of us.'],
    ['李文','对，马上就进高铁站了。咱们一起走，别分开。','Duì, mǎshàng jiù jìn gāotiězhàn le. Zánmen yìqǐ zǒu, bié fēnkāi.','Right. We are about to enter the station. Let us stay together and not get separated.'],
    ['白家月','好，你检查一下，高铁票都拿好了吗？','Hǎo, nǐ jiǎnchá yíxià, gāotiě piào dōu náhǎo le ma?','Okay. Please check whether we have all the high-speed train tickets.'],
    ['李文','不用拿票，刷护照就能检票进站。','Búyòng ná piào, shuā hùzhào jiù néng jiǎnpiào jìnzhàn.','We do not need paper tickets. We can scan our passports to pass the ticket gate and enter.'],
    ['白家月','去哪里检票？','Qù nǎli jiǎnpiào?','Where do we check in for the train?'],
    ['李文','检票口在二层，我们一会儿坐电梯上去。','Jiǎnpiàokǒu zài èr céng, wǒmen yíhuìr zuò diàntī shàngqu.','The ticket gate is on the second floor. We will take the elevator up in a moment.']
  ]},
  {id:'t_hsk3_l06_04',textId:4,title:'高铁上还可以点外卖',format:'narrative',genre:'电话旅行分享',author:'白家月',setting:'在家里，白家月给安妮打电话介绍自己的旅行。',audio:'../../audio/HSK3/6-7.mp3',lines:[
    ['白家月','这次放假，我去了北京，还去了上海。我是从北京南站坐高铁去的上海。我觉得坐在高铁上跟坐在家里的沙发上一样，又安静又舒服。坐累了就站一会儿，饿了就点外卖。对，你没听错，高铁上可以点外卖，只需要选择好车站和想吃的东西，到站时不用下车，服务员就会给你拿过来。现在喜欢坐高铁的人越来越多。我爸妈来中国旅游的时候，必须带他们也坐一次高铁。','Zhè cì fàngjià, wǒ qùle Běijīng, hái qùle Shànghǎi. Wǒ shì cóng Běijīng Nán Zhàn zuò gāotiě qù de Shànghǎi. Wǒ juéde zuò zài gāotiě shang gēn zuò zài jiā li de shāfā shang yíyàng, yòu ānjìng yòu shūfu. Zuò lèi le jiù zhàn yíhuìr, è le jiù diǎn wàimài. Duì, nǐ méi tīng cuò, gāotiě shang kěyǐ diǎn wàimài, zhǐ xūyào xuǎnzé hǎo chēzhàn hé xiǎng chī de dōngxi, dào zhàn shí búyòng xià chē, fúwùyuán jiù huì gěi nǐ ná guòlái. Xiànzài xǐhuan zuò gāotiě de rén yuèláiyuè duō. Wǒ bàmā lái Zhōngguó lǚyóu de shíhou, bìxū dài tāmen yě zuò yí cì gāotiě.','During this vacation, I went to Beijing and Shanghai. I took a high-speed train from Beijing South Railway Station to Shanghai. Sitting on the train felt like sitting on the sofa at home: quiet and comfortable. When I got tired of sitting, I stood for a while; when I got hungry, I ordered takeout. Yes, you heard that correctly. You can order takeout on a high-speed train. Choose the station and the food you want, and a staff member will bring it to you when the train arrives. More and more people now like high-speed trains. When my parents travel in China, I must take them on one too.']
  ]}
].map(t => ({...t,lines:t.lines.map(x => ({speaker:x[0],hanzi:x[1],pinyin:x[2],english:x[3]}))}));

const grammar = [
  {id:'g06_01',title:'固定格式“该……了”',titleEn:'It is time to...',scene:'How would you tell a friend that it is now time to buy tickets, leave, sleep or begin class?',structure:'主语 + 该 + 动词短语 + 了',explanation:'“该……了”表示已经到了需要做某事的时候，常用于口语提醒。',examples:[['咱们该买去上海的票了。','It is time for us to buy tickets to Shanghai.'],['已经很晚了，我该睡觉了。','It is late. I should go to sleep now.'],['八点了，该上课了。','It is eight. It is time for class.'],['离开车还有半个小时，我们该检票了。','The train leaves in thirty minutes. It is time to check in.'],['东西都准备好了，我们该出发了。','Everything is ready. It is time to leave.']]},
  {id:'g06_02',title:'假设复句“如果……，就……”',titleEn:'If..., then...',scene:'How would you connect a possible condition with the action or result that follows?',structure:'如果 + 假设条件，主语 + 就 + 结果',explanation:'“如果”后的分句提出假设，“就”后的分句说明结果；第二个分句的主语一般放在“就”前。',examples:[['如果没走错，二十分钟以前就到了。','If we had not taken a wrong turn, we would have arrived twenty minutes ago.'],['如果你需要帮忙，就给我打电话。','If you need help, call me.'],['如果有时间，我就去上海玩几天。','If I have time, I will visit Shanghai for a few days.'],['如果路上堵车，我们就坐地铁去车站。','If traffic is heavy, we will take the subway to the station.'],['如果你没有充电宝，我就把我的借给你。','If you do not have a power bank, I will lend you mine.']]},
  {id:'g06_03',title:'固定短语“越来越”',titleEn:'More and more...',scene:'How would you describe a situation that keeps changing over time, such as a station becoming busier or travel becoming easier?',structure:'主语 + 越来越 + 形容词 / 心理动词',explanation:'“越来越”表示程度随时间不断变化，后面接形容词或心理动词，前面不能再加“很、非常”等程度副词。',examples:[['前面的人越来越多。','There are more and more people ahead.'],['我越来越喜欢这里的生活了。','I like life here more and more.'],['她越来越高，也越来越漂亮了。','She is getting taller and prettier.'],['坐高铁旅行越来越方便了。','Traveling by high-speed train is becoming more and more convenient.'],['离开车时间越来越近了。','The departure time is getting closer and closer.']]}
].map(g => ({...g,examples:g.examples.map(x => ({hanzi:x[0],english:x[1]}))}));

const grammarTeachingNotes = Object.fromEntries(grammar.map(g => [g.id,{
  scene:g.scene,structure:g.structure,structureEn:g.titleEn,
  visualLearning:{
    leadExamples:g.examples.slice(0,3).map(x => ({english:x.english,hanzi:x.hanzi})),
    blocks:g.id==='g06_01'?['咱们','该','买票','了']:g.id==='g06_02'?['如果','路上堵车','我们就','坐地铁']:['人','越来越','多'],
    blockLabelsEn:g.id==='g06_01'?['subject','time to','action','new situation']:g.id==='g06_02'?['if','condition','subject + then','result']:['topic','change over time','state'],
    impressions:g.examples.slice(0,3)
  },
  oralQuestions:g.id==='g06_01'?['现在几点了？你该做什么了？','出门旅行以前，你该准备什么了？','下课以后，你觉得自己该做什么了？']:
    g.id==='g06_02'?['如果明天下雨，你就怎么去学校？','如果在车站找不到朋友，你就怎么办？','如果手机没电，你就会怎么做？']:
    ['你的汉语什么方面越来越好了？','我们的城市什么越来越方便了？','你越来越喜欢哪一种中国食物？']
}]));

const textTeachingNotes = {
  t_hsk3_l06_01:{classQuestions:[['李文为什么说“该买票了”？','因为她们准备去上海。'],['白家月为什么想坐高铁？','因为她还没坐过高铁。'],['从北京到上海坐高铁方便吗？','方便，高铁很多。'],['李文准备用什么买票？','用手机 App 买票。'],['李文怎样介绍高铁？','高铁又快又舒服。']].map(x=>({question:x[0],answer:x[1]})),teachingPoints:[['该……了','提醒现在到了做某事的时候。','咱们该买票了。'],['用……就能……','说明简单的方法和结果。','用手机 App 就能买。'],['又……又……','连接两个并列的特点。','高铁又快又舒服。']].map(x=>({expression:x[0],meaning:x[1],example:x[2]})),retellScaffold:{nodes:[{label:'计划',hint:'去上海'},{label:'选择',hint:'坐高铁'},{label:'购票',hint:'手机 App、护照'},{label:'期待',hint:'又快又舒服'}],frame:'她们打算……。因为……，所以选择……。李文用……，白家月终于……。'}},
  t_hsk3_l06_02:{classQuestions:[['过了哪里就到高铁站？','过了前面的路口。'],['白家月为什么提醒刘明小心？','因为这条路车很多。'],['他们会迟到吗？','应该不会，因为还有一个小时。'],['刘明以前为什么不再走这条路？','因为车多，红绿灯也多。'],['他们为什么晚到了二十分钟？','因为刘明一着急走错了。']].map(x=>({question:x[0],answer:x[1]})),teachingPoints:[['过了……就……','说明经过一个地点后马上出现的结果。','过了前面的路口就到高铁站了。'],['一……就……','表示一个情况一出现，另一个动作马上发生。','我一急就走错了。'],['如果……就……','提出假设并说明结果。','如果没走错，二十分钟以前就到了。']].map(x=>({expression:x[0],meaning:x[1],example:x[2]})),retellScaffold:{nodes:[{label:'快到站',hint:'前面的路口'},{label:'路况',hint:'车多、红绿灯多'},{label:'原因',hint:'一急就走错'},{label:'结果',hint:'晚了二十分钟'}],frame:'他们本来……，可是路上……。刘明因为……，所以……。如果……，就……。'}},
  t_hsk3_l06_03:{classQuestions:[['白家月什么东西没电了？','她的耳机没电了。'],['李文把常用的东西放在哪里？','都放在包里。'],['为什么两个人不能分开？','因为前面的人越来越多。'],['他们需要纸质高铁票吗？','不需要，刷护照就能进站。'],['检票口在哪里？','在二层。']].map(x=>({question:x[0],answer:x[1]})),teachingPoints:[['越来越……','描述人数随时间增加。','前面的人越来越多了。'],['别 + 动词','提出否定提醒。','咱们一起走，别分开。'],['刷……就能……','说明凭证和结果。','刷护照就能检票进站。']].map(x=>({expression:x[0],meaning:x[1],example:x[2]})),retellScaffold:{nodes:[{label:'准备物品',hint:'耳机、充电宝'},{label:'排队',hint:'人越来越多'},{label:'进站',hint:'刷护照'},{label:'找入口',hint:'二层、坐电梯'}],frame:'进站以前，他们先……。因为……，所以不能……。他们不用……，只要……就能……。'}},
  t_hsk3_l06_04:{classQuestions:[['白家月从哪里坐高铁去上海？','从北京南站。'],['她觉得高铁座位怎么样？','像家里的沙发一样，又安静又舒服。'],['在高铁上饿了可以做什么？','可以点外卖。'],['点外卖时需要选择什么？','选择车站和想吃的东西。'],['白家月以后想带谁坐高铁？','她的爸爸妈妈。']].map(x=>({question:x[0],answer:x[1]})),teachingPoints:[['跟……一样','比较两种相似的体验。','坐在高铁上跟坐在家里的沙发上一样。'],['……了就……','说明一种情况出现后马上采取的动作。','饿了就点外卖。'],['只需要……','说明完成任务所需的最少步骤。','只需要选择好车站和想吃的东西。'],['必须','表达强烈的需要或要求。','必须带他们也坐一次高铁。']].map(x=>({expression:x[0],meaning:x[1],example:x[2]})),retellScaffold:{nodes:[{label:'路线',hint:'北京南站 → 上海'},{label:'体验',hint:'安静、舒服'},{label:'服务',hint:'高铁外卖'},{label:'推荐',hint:'带爸妈坐一次'}],frame:'这次放假，她……。她觉得高铁……。饿了可以……，只需要……。以后她必须……。'}}
};

const sceneData = {
  1:{title:'计划和购买高铁票',subtitle:'从商量路线到使用 12306 购票。',steps:[
    {title:'该买票了',prompt:'她们打算怎么去上海？',image:img('photo-text-1-booking'),labels:[{word:'该',x:10,y:12,targetX:43,targetY:28},{word:'打算',x:11,y:84,targetX:51,targetY:58},{word:'行',x:89,y:12,targetX:76,targetY:45}],words:['该','打算','行'],sentence:'咱们该买票了，你打算怎么去上海？'},
    {title:'第一次坐高铁',prompt:'她们选择什么交通方式？',image:img('photo-text-1-train'),labels:[{word:'高铁',x:89,y:12,targetX:65,targetY:47}],words:['高铁'],sentence:'坐高铁去上海又快又舒服。'}
  ]},
  2:{title:'开车去高铁站',subtitle:'观察路口、路况和时间变化。',steps:[
    {title:'经过路口',prompt:'路上有哪些需要注意的地方？',image:img('photo-text-2-intersection'),labels:[{word:'路口',x:50,y:88,targetX:50,targetY:45},{word:'红绿灯',x:88,y:12,targetX:66,targetY:22},{word:'小心',x:10,y:12,targetX:38,targetY:52}],words:['路口','红绿灯','小心'],sentence:'过了前面的路口就到车站了，路上车多，要小心。'},
    {title:'走错路线',prompt:'司机为什么着急？',image:img('photo-text-2-route'),labels:[{word:'迟到',x:90,y:12,targetX:72,targetY:59},{word:'后来',x:90,y:84,targetX:55,targetY:65},{word:'急',x:10,y:12,targetX:24,targetY:39},{word:'如果',x:10,y:84,targetX:66,targetY:51},{word:'以前',x:50,y:12,targetX:72,targetY:62}],words:['迟到','后来','急','如果','以前'],sentence:'他一急就走错了，如果没走错，二十分钟以前就到了。'}
  ]},
  3:{title:'排队、安检和检票',subtitle:'准备常用物品，跟着车站流程进站。',steps:[
    {title:'队伍越来越长',prompt:'进站以前需要准备什么？',image:img('photo-text-3-station-queue'),labels:[{word:'耳机',x:10,y:12,targetX:20,targetY:31},{word:'充电宝',x:10,y:84,targetX:35,targetY:68},{word:'常用',x:38,y:86,targetX:34,targetY:70},{word:'越',x:90,y:12,targetX:70,targetY:47},{word:'分开',x:90,y:84,targetX:49,targetY:48}],words:['耳机','充电宝','常用','越','分开'],sentence:'人越来越多，常用的东西要放好，大家别分开。'},
    {title:'刷护照进站',prompt:'怎样找到检票口并进站？',image:img('photo-text-3-ticket-check'),labels:[{word:'检查',x:9,y:84,targetX:18,targetY:43},{word:'刷',x:39,y:86,targetX:40,targetY:58},{word:'检票',x:60,y:12,targetX:50,targetY:55},{word:'电梯',x:90,y:12,targetX:67,targetY:31}],words:['检查','刷','检票','电梯'],sentence:'检查好护照，刷护照检票，再坐电梯去二层。'}
  ]},
  4:{title:'高铁旅行体验',subtitle:'从真实车厢环境到高铁外卖服务。',steps:[
    {title:'安静舒服的车厢',prompt:'坐在高铁上是什么感觉？',image:img('photo-text-4-cabin'),labels:[{word:'放假',x:9,y:12,targetX:18,targetY:48},{word:'沙发',x:9,y:84,targetX:26,targetY:66},{word:'安静',x:91,y:84,targetX:71,targetY:48},{word:'北京南站',x:88,y:12,targetX:54,targetY:17}],words:['放假','沙发','安静','北京南站'],sentence:'放假时从北京南站出发，车厢像家里的沙发一样安静舒服。'},
    {title:'高铁外卖到座',prompt:'怎样在高铁上点外卖？',image:img('photo-text-4-takeout'),labels:[{word:'选择',x:90,y:12,targetX:56,targetY:69},{word:'必须',x:10,y:84,targetX:42,targetY:66}],words:['选择','必须'],sentence:'在手机上选择车站和食物，到站时服务员会把外卖送过来。'}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {session:'A',title:'规划和购买高铁票',titleEn:'Plan and Book a High-speed Train Trip',words:['该','打算','高铁','行'],image:img('photo-text-1-booking'),introEn:'Learn the essential words and background needed to choose a high-speed train and buy a Beijing–Shanghai ticket with the Railway 12306 app.',contexts:[['已经九点了，咱们____出发了。','该'],['你____坐高铁还是坐飞机去上海？','打算'],['从北京到上海坐____很方便。','高铁'],['明天上午出发，____不行？','行'],['车票快卖完了，我们____买票了。','该'],['我的____是先坐地铁到车站。','打算']]},
  {session:'B',title:'安全到达高铁站',titleEn:'Reach the Station Safely and on Time',words:['路口','小心','迟到','红绿灯','后来','急','如果','以前'],image:img('photo-text-2-intersection'),introEn:'Learn how to describe traffic, give a safety reminder and make an if–then backup plan when a route goes wrong.',contexts:[['过了前面的____就到高铁站了。','路口'],['这条路车很多，请____一点儿。','小心'],['还有一个小时，我们应该不会____。','迟到'],['这条路上的____很多，开车比较慢。','红绿灯'],['别____，我们可以换一条路。','急']]},
  {session:'C',title:'进站和体验高铁服务',titleEn:'Enter the Station and Experience the Train',words:['耳机','充电宝','常用','越','分开','检查','刷','检票','电梯','放假','沙发','安静','选择','必须','北京南站'],image:img('photo-text-4-cabin'),introEn:'Learn the station process, useful travel items and the real onboard environment, including how food delivery works on a Chinese high-speed train.',contexts:[['手机快没电了，最好带一个____。','充电宝'],['前面的人____来越多了。','越'],['进站以前要____一下护照和车次。','检查'],['不用拿纸票，____护照就能进站。','刷'],['车厢里又舒服又____。','安静']]}
];
function mission(spec, index){
  const sessionWords=spec.words.map(word), distract=(answer,i)=>spec.words.filter(x=>x!==answer).slice(i%Math.max(1,spec.words.length-2),i%Math.max(1,spec.words.length-2)+2), meanings=spec.words.slice(0,5).map((h,i)=>q(`${spec.session.toLowerCase()}2q${i+1}`,'',`Which Chinese expression means “${word(h).english}”?`,[h].concat(distract(h,i)).slice(0,3),h));
  const context=spec.contexts.map((x,i)=>q(`${spec.session.toLowerCase()}4q${i+1}`,x[0],'Choose the word that completes the sentence.',[x[1]].concat(distract(x[1],i)).slice(0,3),x[1]));
  const rankedMeaningCount=Math.min(7,spec.words.length);
  const ranked=spec.words.slice(0,rankedMeaningCount).map((h,i)=>q(`${spec.session.toLowerCase()}5q${i+1}`,'',`Choose “${word(h).english}”.`,[h].concat(distract(h,i)).slice(0,3),h)).concat(spec.contexts.slice(0,10-rankedMeaningCount).map((x,i)=>q(`${spec.session.toLowerCase()}5q${i+rankedMeaningCount+1}`,x[0],'Choose the best answer.',[x[1]].concat(distract(x[1],i+1)).slice(0,3),x[1])));
  const stages=[
    {id:`${spec.session.toLowerCase()}1`,title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先听、看并标记本次生词。',screenPromptEn:spec.introEn,interactionType:'study_list',photos:[{src:'../in-class/'+spec.image,label:spec.title}],keywordCards:sessionWords.map(v=>card(v.hanzi))},
    {id:`${spec.session.toLowerCase()}2`,title:'快速认词',titleEn:'Meaning Check',screenPrompt:'根据英文意思选择中文词。',screenPromptEn:'Choose the Chinese word that matches each meaning.',interactionType:'practice_quiz',questions:meanings},
    {id:`${spec.session.toLowerCase()}3`,title:'汉英配对',titleEn:'Match Sprint',screenPrompt:'把中文词和英文意思配成一组。',screenPromptEn:'Match the Chinese expressions with their English meanings.',interactionType:'timed_match',pairs:sessionWords.slice(0,6).map(v=>({word:v.hanzi,meaning:v.english}))},
    {id:`${spec.session.toLowerCase()}4`,title:'语境判断',titleEn:'Context Check',screenPrompt:'在完整语境中选择合适的词。',screenPromptEn:'Choose the expression that completes each situation.',interactionType:'practice_quiz',questions:context},
    {id:`${spec.session.toLowerCase()}5`,title:'正式挑战',titleEn:'Ranked Challenge',screenPrompt:'十题计分，正确率优先，同分时用时更短者在前。',screenPromptEn:'Ten scored questions. Accuracy comes first; time breaks a tie.',interactionType:'ranked_quiz',questions:ranked}
  ];
  return {id:`pm_hsk3_l06_${spec.session.toLowerCase()}`,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:`第${index+1}次课课前热身赛`,titleEn:`Preview ${spec.session}`,subtitleEn:spec.titleEn,scenario:spec.title,goals:[spec.title,'理解本次课核心表达','为课堂口头任务做准备'],storyIntro:spec.title,storyIntroEn:spec.introEn,stages,completionMessageEn:`Your official score has been saved. A score of 70% or above completes Preview ${spec.session}.`};
}

const fills = [
  [['该','打算','高铁','行','护照'],['车票快卖完了，我们____买去上海的票了。','你____坐高铁还是坐飞机去上海？','从北京到上海坐____很方便，而且不用提前很久到机场。','上午九点出发____不行？我们可以一起去车站。','在手机 App 上买国际学生的车票，需要填写____信息。']],
  [['路口','小心','迟到','红绿灯','急'],['过了前面的____以后一直向右走，就能看见高铁站。','雨天路滑，开车送同学去车站时一定要____。','虽然路上有点儿堵，但是我们提前出发了，应该不会____。','这条路车多，____也多，所以走得比较慢。','发现自己走错路时先别____，可以马上打开地图重新选择路线。']],
  [['终于','司机','宾馆','菜单','信用卡'],['等了很久以后，开往上海的高铁____进站了。','飞机晚点以后，接我们的____一直在机场等。','旅行时我们住的____离地铁站很近。','到饭馆以后，服务员先给我们拿来了____。','除了手机付款，安娜还可以使用____。']]
].map((g,gi)=>({id:`l06_fill_group_0${gi+1}`,type:'vocab_fill_group',stage:'in_class',contentRole:['lesson','transfer','review'][gi],prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:g[0],wordBank_pinyin:g[0].map(x=>(word(x)||{}).pinyin||''),sentences:g[1].map((s,i)=>({sentence:s,answer:g[0][i]})),speakingOutput:{support:'任选两个词，完成一句话。',core:'任选三个词，用两句话说明一个完整情境。',stretch:'任选四个词，完成30秒口头故事。'}}}));

const orders = [
  ['咱们该买去上海的高铁票了。',['咱们','该','买','去上海的高铁票','了']],
  ['如果路上堵车，我们就坐地铁去车站。',['如果','路上堵车','我们','就坐地铁','去车站']],
  ['前面排队检票的人越来越多了。',['前面','排队检票的人','越来越','多','了']],
  ['刷护照就能从这个检票口进站。',['刷护照','就能','从这个检票口','进站']],
  ['我们选好了宾馆就去准备行李。',['我们','选好了宾馆','就去','准备行李']]
].map((x,i,a)=>({id:`l06_order_0${i+1}`,type:'ordering',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'把语块排成一个完整、自然的句子。',prompt_en:'Put the chunks in order to make a complete sentence.',correct_answer:x[0],data:{chunks:x[1],chunks_pinyin:x[1].map(()=> '')}}));

const readPassages = [
  ['第一次买高铁票','安娜打算周末去上海。朋友告诉她，12306 App 上有很多车次。她检查好护照信息，选择上午九点的高铁，终于买到了票。','安娜买票以前检查了什么？','她检查了护照信息。'],
  ['换一条路线','小王开车去车站，发现前面的路口车越来越多。如果继续等，他就可能迟到，所以他马上选择了另一条路。','小王为什么换路？','因为继续等可能会迟到。'],
  ['进站准备','玛丽把护照、耳机和充电宝放在容易拿到的地方。到了车站，她先检查车次，再刷护照检票。','玛丽怎样检票进站？','她刷护照检票进站。'],
  ['车上的午饭','列车快到济南时，小林在手机上选择了车站和午饭。到站以后，他不用下车，服务员就把外卖送到了座位。','小林需要下车拿外卖吗？','不需要，服务员送到座位。'],
  ['以前的旅行','去年王一飞坐飞机去草原，飞机晚点了，司机一直在机场等她。后来她住进了一家又安静又干净的宾馆。','司机为什么一直等？','因为飞机晚点了。']
].map((x,i,a)=>({id:`l06_read_0${i+1}`,type:'passage_reading',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'阅读小篇章，回答问题。',prompt_en:'Read and answer.',data:{title:x[0],passage:x[1],questions:[{question_cn:x[2],answer:x[3]}]}}));

const taskCards = [
  ['北京—上海购票计划','Beijing–Shanghai Ticket Plan','你和朋友准备购买周末的高铁票。',['确定出发时间','说明购买方法','提醒准备证件'],['该……了','打算','高铁','护照'],'用4句话完成购票计划。'],
  ['可能迟到，怎么办？','What Can You Do If You May Be Late?','去车站的路上车越来越多。',['说一说现在的路况','用“如果……就……”说一个办法','选择另一条路'],['路口','红绿灯','如果……就……','迟到'],'完成三轮对话。'],
  ['进站前检查物品','Check Your Things Before Entering','外国朋友第一次进入高铁站。',['检查随身物品','说明检票方法','告诉他检票口位置'],['充电宝','检查','刷护照','电梯'],'完成40秒说明。'],
  ['推荐高铁旅行','Recommend High-speed Rail Travel','向同学介绍高铁的环境和服务。',['描述车厢','介绍外卖步骤','说明推荐理由'],['安静','舒服','选择','越来越'],'每位组员至少说两句。'],
  ['再说一次旅行安排','Review a Travel Plan','为L04的草原旅行重新安排交通。',['比较飞机和高铁','安排住宿','说明选择理由'],['机场','司机','宾馆','跟……不一样'],'用3—4句话说明。']
].map((x,i,a)=>({id:`l06_task_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:`任务卡：${x[0]}。`,prompt_en:x[1],openEnded:true,needsTeacherReview:true,data:{title:x[0],titleEn:x[1],role:x[2],steps:x[3],keywords:x[4],output:x[5],answerPlaceholder:'请写下课堂表达。'}}));

const sceneChoices = [
  ['It is now time to buy the tickets for Shanghai.','Use 该……了.','咱们该买去上海的票了。'],
  ['A traveler plans to take a high-speed train for the first time.','Use 打算 and 高铁.','我打算第一次坐高铁去上海。'],
  ['Traffic is heavy, so the driver needs to be careful.','Use 小心.','这条路车很多，您小心点儿。'],
  ['A wrong route may make the travelers late.','Use 如果……就…….','如果继续走这条路，我们就可能迟到。'],
  ['The line at the station keeps getting longer.','Use 越来越.','前面排队检票的人越来越多了。'],
  ['A passport is enough to pass the ticket gate.','Use 刷……就能…….','刷护照就能检票进站。'],
  ['The train interior is quiet and comfortable.','Use 又……又…….','高铁车厢里又安静又舒服。'],
  ['A student makes a backup plan for a rainy day.','Use 如果……就…….','如果明天下雨，我就坐地铁去车站。'],
  ['The hotel is unlike the others.','Review 跟……不一样.','这家宾馆跟别的都不一样。'],
  ['The driver waited throughout the flight delay.','Review 一直 and 晚点.','飞机晚点了，司机一直在机场等。']
].map((x,i,a)=>({id:`l06_scene_${String(i+1).padStart(2,'0')}`,type:'scene_sentence_choice',stage:'in_class',contentRole:roleFor(i,a.length),prompt_en:'Choose the best sentence for the scene.',data:{scene_en:x[0],clue_en:x[1],options:[x[2],'服务员给我们拿来了菜单。','这个小区离银行比较近。','照片里的天气好得很。'],correct_index:0},correct_answer:x[2]}));

const matchGroups = [
  [['你们为什么现在就要买票？','因为周末的车票比较紧张，我们该早点儿买了。'],['白家月打算怎么去上海？','她还没坐过高铁，所以想坐高铁去。'],['在手机上买票需要准备什么？','需要准备正确的护照信息和出发时间。'],['为什么选择高铁而不是汽车？','因为高铁又快又舒服，而且车次很多。'],['第一次坐高铁，白家月心情怎么样？','她早就听说过高铁，现在终于可以坐了。']],
  [['前面那个路口的路况怎么样？','车很多，红绿灯也多，开车要小心。'],['你们为什么可能迟到？','因为司机一着急走错了路。'],['如果这条路继续堵车怎么办？','我们就换一条路或者坐地铁。'],['司机以前走过这条路吗？','走过一次，后来再也不走了。'],['离开车还有一个小时，需要着急吗？','不需要，检查好路线继续走就行。']],
  [['你们住的宾馆环境怎么样？','房间又安静又干净，我们都很满意。'],['服务员拿来菜单以后，你们做什么？','我们先点特色菜，再选择饮料。'],['旅行照片是谁给你照的？','朋友给我照的，她对拍照很感兴趣。'],['除了银行卡，还可以怎么付款？','还可以用手机付款，非常方便。'],['新宿舍离地铁站远不远？','不太远，走十分钟就能到。']]
].map((pairs,i)=>({id:`l06_match_0${i+1}`,type:'word_match',stage:'in_class',contentRole:['lesson','transfer','review'][i],prompt_en:'Match each question with the best answer.',data:{pairs:pairs.map(x=>({left:x[0],right:x[1]}))}}));

const guessRows = [
  ['高铁','速度很快、城市之间常用的一种火车。'],['充电宝','手机没电时可以给手机充电的小设备。'],['红绿灯','路口用红色、黄色和绿色管理交通的灯。'],['检票','进站或上车以前确认车票和身份信息。'],['电梯','帮助人上下楼层的设备。'],['越来越多','数量随着时间不断增加。'],['路口','两条或几条道路相交的地方。'],['护照','外国人旅行和买票时常用的身份证件。'],['宾馆','旅行时可以住宿的地方。'],['菜单','在饭馆里介绍菜和饮料的单子。']
];
const guesses = guessRows.map((x,i,a)=>({id:`l06_desc_${String(i+1).padStart(2,'0')}`,type:'description_guess',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'读完整提示，联系语境猜词。',prompt_en:'Read the full clue and guess the word.',data:{description:x[1],options:[x[0],'沙发','后来','水平'],correct_index:0},correct_answer:x[0]}));

const sayRows = [
  ['高铁',['城市之间','速度快','火车']],['充电宝',['手机','没电','随身物品']],['红绿灯',['路口','三种颜色','开车']],['检票口',['进站','护照','车次']],
  ['越来越多',['时间变化','数量','增加']],['高铁外卖',['手机选择','车站','送到座位']],['宾馆',['旅行','房间','住']],['拍照',['手机','相机','照片']]
];
const sayGuess = sayRows.map((x,i,a)=>({id:`l06_say_${String(i+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:x[0],boardIndex:i+1,clues:[],scaffold:{words:x[1],frames:['这是一个……。','人们用它 / 在这里……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));

const blindRows = [[['该','买票'],['周末要出发了，我们该买票了。']],[['如果','迟到'],['如果再不出发，我们就会迟到。']],[['越来越','方便'],['坐高铁旅行越来越方便了。']],[['宾馆','安静'],['我们住的宾馆又干净又安静。']]];
const blind = blindRows.map((x,i,a)=>({id:`l06_blind_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:x[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:x[1][0]}}));

const pictureKeywords = [['photo-text-1-booking','该……了'],['photo-text-1-train','又……又……'],['photo-text-2-intersection','如果……就……'],['photo-text-2-route','迟到'],['photo-text-3-station-queue','越来越'],['photo-text-3-ticket-check','刷……就能……'],['photo-text-4-cabin','跟……一样'],['photo-text-4-takeout','选择']];
const pictureComplete = pictureKeywords.map((x,i,a)=>({id:`l06_pic_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the keyword to write one complete sentence about the photo.',data:{image:img(x[0]),keyword:x[1],task:'观察人物、物品和场景，用关键词写一个完整、自然的句子。',answerPlaceholder:''}}));

const independent = readPassages.map((x,i)=>{const q0=x.data.questions[0],opts=[q0.answer,'因为他想去爬山。','因为房间里没有沙发。','因为服务员拿来了菜单。'];return{id:`l06_ind_read_0${i+1}`,type:'choice',stage:'in_class',contentRole:x.contentRole,prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:x.data.title,passage:x.data.passage,question_cn:q0.question_cn,options:opts,correct_index:0},correct_answer:q0.answer}});

const paragraphRows = [
  ['购买高铁票',['星期五晚上，李文和白家月商量去上海。','____1____','她们决定使用12306 App。','____2____','白家月第一次坐高铁，非常高兴。','____3____'],['她们觉得该买票了。','李文检查护照信息以后选择了车次。','她觉得高铁又快又舒服。']],
  ['去车站的路上',['刘明开车送朋友去高铁站。','____1____','前面的路口车越来越多。','____2____','刘明打开地图选择了另一条路。','____3____'],['他们本来还有一个小时。','如果继续等，就可能迟到。','最后他们按时到了车站。']],
  ['第一次进站',['车站大厅里的人很多。','____1____','李文提醒白家月不要分开。','____2____','检票口在二层。','____3____'],['排队的人越来越多。','他们检查好护照以后刷证进站。','两个人坐电梯上去了。']],
  ['车上的午餐',['小陈坐高铁去南京。','____1____','他打开手机选择了车站和想吃的东西。','____2____','列车到站时，他没有下车。','____3____'],['中午十二点，他觉得有点儿饿。','订单成功以后，他继续在座位上休息。','服务员把外卖送到了他的座位。']],
  ['草原旅行复习',['王一飞坐飞机去草原。','____1____','司机一直在机场等她。','____2____','第二天她去了草原。','____3____'],['因为天气不好，飞机晚点了。','到了宾馆以后，她先休息了一会儿。','她觉得那里的风景美得很。']]
];
const paragraphs = paragraphRows.map((x,i,a)=>({id:`l06_para_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'段落填空。',prompt_en:'Choose three sentences to complete the paragraph.',openEnded:true,needsTeacherReview:true,data:{title:x[0],passageParts:x[1],options:x[2].concat(['我下午去银行。','大家比较了几张照片。','小区旁边有一家饭馆。']),answers:[0,1,2],instructions:'点击句子，再点击对应空格。',answerPlaceholder:''}}));

const chainRows = [['从“咱们该买票了”开始','咱们该买票了',['打算','高铁','12306']],['从“如果路上堵车”开始','如果路上堵车',['就','换路线','不会迟到']],['从“到了高铁站”开始','到了高铁站',['检查','刷护照','检票']],['从“车厢里”开始','车厢里',['越来越','安静','舒服']],['从“到了宾馆”开始','到了宾馆',['先','休息','满意']]];
const chains = chainRows.map((x,i,a)=>({id:`l06_chain_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'接龙造句。',prompt_en:'Continue the sentence chain.',openEnded:true,needsTeacherReview:true,data:{title:x[0],starter:x[1],steps:[`S1: ${x[1]}`,`S2: ${x[1]}……`,`S3: ${x[1]}…………`],keywords:x[2],instructions:'每位学生增加一个自然的部分，最后形成完整表达。',answerPlaceholder:'继续接一句中文。'}}));

const battleGames = {
  roulette:[
    {id:'l06_r_01',challenge:'说明你打算怎样购买去上海的车票。',scene:'你和朋友正在计划周末旅行。',keywords:['该……了','打算','高铁'],sample:'我们该买票了，我打算用12306 App买高铁票。'},
    {id:'l06_r_02',challenge:'路上堵车时提出一个备选方案。',scene:'离开车还有四十分钟。',keywords:['如果……就……','迟到','路口'],sample:'如果前面的路口还堵车，我们就坐地铁去车站。'},
    {id:'l06_r_03',challenge:'向外国朋友说明怎样检票进站。',scene:'朋友第一次到中国高铁站。',keywords:['检查','刷护照','检票'],sample:'先检查车次和护照，再刷护照检票进站。'},
    {id:'l06_r_04',challenge:'用三句话推荐一次高铁旅行。',scene:'你在分享真实乘车体验。',keywords:['安静','越来越','选择'],sample:'高铁又安静又舒服，服务也越来越方便，车上还可以点外卖。'}
  ],
  relay:[
    {id:'l06_relay_01',starter:'高铁',goal:'接一个自然短语或短句。',mustUse:['又快又舒服','买票']},
    {id:'l06_relay_02',starter:'如果',goal:'接一个完整的假设复句。',mustUse:['就','迟到']},
    {id:'l06_relay_03',starter:'检查',goal:'接一个车站流程短句。',mustUse:['护照','检票']},
    {id:'l06_relay_04',starter:'越来越',goal:'接一个表示变化的短句。',mustUse:['方便','喜欢']}
  ],
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：gāotiě',answer:'高铁'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：chídào',answer:'迟到'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：jiǎnpiào',answer:'检票'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“打算”说一个短语。',answer:'打算坐高铁 / 有什么打算'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“检查”说一个短语。',answer:'检查行李 / 检查护照'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“选择”说一个短语。',answer:'选择车站 / 选择路线'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'进站时可以怎么确认身份？',options:['刷护照','拿菜单','穿大衣'],answer:'刷护照'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“人越来越多”表示什么？',options:['人数不断增加','大家都离开了','人数没有变化'],answer:'人数不断增加'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“该……了”说一句话。',answer:'八点了，我们该上课了。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“如果……就……”说一句话。',answer:'如果堵车，我们就坐地铁。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“越来越”说一句话。',answer:'坐高铁旅行越来越方便了。'}
  ]}
};

const homework = {mode:'hsk3_session_tasks',instructions:{required:'完成高铁旅行指南的当次准备卡；最终口头作品在课堂完成。',optional:'不需要上传录音。A、B 保存的路线和应急素材会用于 C 的课堂展示。',aiPolicy:'先独立选择路线、图片和关键词，再使用工具检查语言。'},sessionMeta:{
  A:{label:'旅行指南 · 第1步',goal:'选择一条高铁路线，完成购票和出发计划。',suggested_minutes:'10-15分钟',suggested_mix:'课后完成路线卡；下次课两人交换检查购票信息。'},
  B:{label:'旅行指南 · 第2步',goal:'准备进站路线和一个延误应急方案。',suggested_minutes:'10-15分钟',suggested_mix:'完成如果—就应急卡；课堂小组互评。'},
  C:{label:'课堂最终项目 · 我的高铁旅行指南',goal:'整合路线、进站流程和车内体验，完成课堂旅行推荐。',suggested_minutes:'15-20分钟',suggested_mix:'不上传录音；课堂先小组彩排，再进行1—2分钟展示。'}
},sessions:{
  A:[
    {id:'post_l06_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'旅行指南 1/3 · 选择路线',required:true,prompt_cn:'如果周末坐高铁旅行，你打算从哪里出发、去哪里、什么时候走？',prompt_en:'Choose a high-speed train trip. Where will you leave from, where will you go, and when will you travel?',answerPlaceholder:'我打算从……去……。我准备……出发。',needsTeacherReview:true,openEnded:true},
    {id:'post_l06_a_plan',type:'project_card',taskLabel:'路线与购票卡',projectStage:'旅行指南 1/3 · 保存到最终展示',required:true,prompt_cn:'完成购票计划：路线、日期、出发时间、购票方法和必须准备的证件。',prompt_en:'Complete a booking plan: route, date, departure time, booking method and required ID.',answerPlaceholder:'路线：……；日期和时间：……；我用……买票；我必须准备……。',needsTeacherReview:true,openEnded:true,wordBank:['该……了','打算','高铁','行','护照','又快又舒服'],picturePrompts:['路线或车站图片','出发日期','12306车次选择','护照或证件'],scaffoldLevels:[{label:'基础层 / Support',instruction:'使用句框完成路线、时间和购票方法。'},{label:'标准层 / Core',instruction:'写4—5句话，说明完整计划并使用“该……了”。'},{label:'挑战层 / Challenge',instruction:'比较两种交通方式，并说明为什么选择高铁。'}]},
    {id:'post_l06_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Booking Plan',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: My Train Plan',prompt_en:'Prepare your route and booking plan for the next class.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one route, station or train image. A simple screenshot or hand-drawn route is fine.','Be ready to answer: Where will you go? When will you leave? How will you buy the ticket?','Use at least three lesson words and the pattern 该……了.','You may check the plan with a partner. No audio upload is required.'],classroomNote:'Keep this route card. You will use it in the final travel guide.'}
  ],
  B:[
    {id:'post_l06_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'旅行指南 2/3 · 发现风险',required:true,prompt_cn:'去车站的路上可能出现什么问题？你最需要提前检查什么？',prompt_en:'What could go wrong on the way to the station? What should you check in advance?',answerPlaceholder:'可能……。我最需要检查……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l06_b_plan',type:'project_card',taskLabel:'应急卡',projectStage:'旅行指南 2/3 · 保存备选方案',required:true,prompt_cn:'写两个“如果……就……”方案：一个关于路线或迟到，一个关于手机、护照或行李。',prompt_en:'Write two if–then backup plans: one for the route or a delay, and one for your phone, passport or luggage.',answerPlaceholder:'如果路上……，我就……；如果……，我就……；进站以前，我必须检查……。',needsTeacherReview:true,openEnded:true,wordBank:['路口','小心','迟到','红绿灯','急','如果……就……','检查'],picturePrompts:['地图或路线','预计到站时间','随身物品','备选交通方式'],carryFrom:[{session:'A',taskId:'post_l06_a_plan',label:'A · 我的路线与购票卡'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'从词库选择内容，完成两个句框。'},{label:'标准层 / Core',instruction:'完成两个不同的如果—就方案，并说明原因。'},{label:'挑战层 / Challenge',instruction:'比较两个方案，说明哪一个更快、更安全。'}]},
    {id:'post_l06_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Station Backup Plan',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: My Backup Plan',prompt_en:'Prepare two short backup plans for getting to and entering the station.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring your route card from Homework A.','Add one map, station or travel-item image.','Be ready to explain two if–then backup plans.','Use 如果……就…… and at least four lesson words. No audio upload is required.'],classroomNote:'Save both backup plans for the final in-class travel guide.'}
  ],
  C:[
    {id:'post_l06_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'旅行指南 3/3 · 组织展示',required:true,prompt_cn:'你希望第一次坐高铁的同学先知道什么？哪一个车内服务最值得介绍？',prompt_en:'What should a first-time passenger know first? Which onboard service is most useful to introduce?',answerPlaceholder:'我希望大家先知道……。我最想介绍……，因为……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l06_c_final',type:'portfolio_final',taskLabel:'最终展示稿',projectStage:'课堂大作业 · 我的高铁旅行指南',required:true,prompt_cn:'整合路线、购票、应急方案、进站流程和车内体验，准备1—2分钟高铁旅行指南。',prompt_en:'Combine your route, booking plan, backup plan, station process and onboard experience into a 1–2 minute high-speed train guide.',answerPlaceholder:'我的路线是……。我们该……了。如果……，就……。进站时先……，再……。高铁上……，而且越来越……。',needsTeacherReview:true,openEnded:true,wordBank:['该……了','打算','高铁','如果……就……','检查','刷护照','检票','安静','选择','越来越','必须'],picturePrompts:['路线或车次','车站或检票口','真实高铁车厢','车内服务'],carryFrom:[{session:'A',taskId:'post_l06_a_plan',label:'A · 路线与购票计划'},{session:'B',taskId:'post_l06_b_plan',label:'B · 两个应急方案'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'使用6个句框，按路线—进站—车内体验的顺序表达。'},{label:'标准层 / Core',instruction:'使用至少6个本课词和2个本课结构，完成1分钟介绍。'},{label:'挑战层 / Challenge',instruction:'加入交通比较、外卖步骤和给第一次乘车者的建议，完成2分钟介绍。'}]},
    {id:'post_l06_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · My High-Speed Rail Travel Guide',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My High-Speed Rail Travel Guide',prompt_en:'Present a practical high-speed train guide for a first-time passenger.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one to three images: a route or ticket plan, a station or ticket gate, and a real high-speed train or carriage.','Answer: Where will you go? How will you buy the ticket? What will you do if there is a problem? How will you enter the station? What is the train experience like?','Use at least six lesson words and at least two structures: 该……了, 如果……就……, or 越来越.','Speak for 1–2 minutes. You may work in pairs, but each student must explain at least one part.','Present mainly in class. No audio upload is required.'],classroomNote:'Use the route from A and the backup plans from B. Keep mistakes and weak points closed until you choose to review them.'}
  ]
}};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L06',lessonKey:'HSK3-L06',title:'高铁上还可以点外卖',titleEn:'You can even order takeout on a high-speed train',topic:'高铁购票、车站流程、交通应急与乘车体验',courseModel:'三次课：规划并购买高铁票 → 安全准时到达车站 → 进站并介绍高铁体验',sourceTextPolicy:'四篇教材课文保持原文；英文译文、任务链和练习属于教学扩展。'},
  pedagogy:{exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'主观任务提供基础、标准、挑战三档输出，要求每位组员参与表达。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：规划并购买高铁票',textIds:['t_hsk3_l06_01'],previewMissionId:'pm_hsk3_l06_a',focus:['交通方式与购票','12306购票语境','固定格式“该……了”']},
    {id:'B',title:'第二次课：安全准时到达车站',textIds:['t_hsk3_l06_02'],previewMissionId:'pm_hsk3_l06_b',focus:['路况与安全提醒','延误应急方案','如果……就……']},
    {id:'C',title:'第三次课：进站与高铁旅行体验',textIds:['t_hsk3_l06_03','t_hsk3_l06_04'],previewMissionId:'pm_hsk3_l06_c',focus:['检票进站流程','真实车厢与高铁外卖','越来越']}
  ],
  vocabScenes:sceneData,vocabulary,grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(v=>[v.id,{session:v.tags[0],phrases:v.phrases}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l06_a',vocabularyIds:vocabulary.map(v=>v.id),grammarIds:grammar.map(g=>g.id),readingData:[{id:'pre_l06_read',title:'第一次高铁旅行',text:'我们该买票了。我打算用手机 App 买高铁票。高铁又快又舒服，我很期待。'}]},
  inClass:{questionGroups:{
    v5_vocab_fill:fills,g1_ordering:orders,r2_passage_choice:readPassages,t2_task_card:taskCards,battleGames,scene_sentence_choice:sceneChoices,v7_word_match:matchGroups,v6_description_guess:guesses,v2_say_guess:sayGuess,v3_blind_box:blind,g2_picture_complete:pictureComplete,r3_independent_reading:independent,r4_paragraph_fill:paragraphs,t3_chain_sentence:chains,
    info_match:[
      {id:'l06_info_01',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each person with the action.',data:{people:['白家月','李文','刘明','服务员'],clues:['第一次坐高铁','帮助购买车票','开车送朋友去车站','把外卖送到座位'],answer:['白家月-第一次坐高铁','李文-帮助购买车票','刘明-开车送朋友去车站','服务员-把外卖送到座位']}},
      {id:'l06_info_02',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each place with what happens there.',data:{people:['咖啡厅','去车站的路上','高铁站','高铁车厢'],clues:['商量并购买车票','司机走错路线','刷护照检票','可以点外卖'],answer:['咖啡厅-商量并购买车票','去车站的路上-司机走错路线','高铁站-刷护照检票','高铁车厢-可以点外卖']}}
    ],
    pk_question:[['咱们____买票了。','该'],['____路上堵车，我们就坐地铁。','如果'],['前面的人____来越多了。','越']].map((x,i)=>({id:`l06_pk_0${i+1}`,type:'choice',prompt_cn:x[0],prompt_en:'Choose the word.',correct_answer:x[1],data:{question_cn:x[0],options:[x[1],'行','后来','沙发'],correct_index:0}})),textQa:[],pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{focus:['高铁出行词汇','该……了','如果……就……','越来越','检票流程','旅行指南表达'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应五步预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'用路线卡和应急卡重新完成一次高铁旅行说明。'}]}
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log(`Wrote ${out}`);
