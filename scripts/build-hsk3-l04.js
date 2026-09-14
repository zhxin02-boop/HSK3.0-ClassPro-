const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L04.json');
const img = n => `images/hsk3-l04/${n}.svg`;
const photo = n => `images/hsk3-l04/${n}.png`;
const roleFor = (index,total) => index < Math.floor(total * .5) ? 'lesson' : index < Math.floor(total * .8) ? 'transfer' : 'review';

const vocabRows = [
  ['假期','jiàqī','名词','vacation; holiday'],['海','hǎi','名词','sea'],['草原','cǎoyuán','名词','grassland'],['主意','zhǔyi','名词','idea'],['骑','qí','动词','ride'],['马','mǎ','名词','horse'],['羊','yáng','名词','sheep; goat'],['月亮','yuèliang','名词','moon'],['一定','yídìng','副词','certainly'],
  ['刻','kè','量词','quarter (of an hour)'],['起飞','qǐfēi','动词','take off'],['宾馆','bīnguǎn','名词','hotel'],['特别','tèbié','形容词/副词','special; especially'],['别的','biéde','代词','other'],['一样','yíyàng','形容词','the same'],['牛','niú','名词','cattle'],['相机','xiàngjī','名词','camera'],
  ['欢迎','huānyíng','动词','welcome'],['司机','sījī','名词','driver'],['晚点','wǎndiǎn','动词','be delayed'],['久','jiǔ','形容词','long'],['除了','chúle','介词','besides; except'],['以外','yǐwài','名词','other than; except'],['先','xiān','副词','first'],['一直','yìzhí','副词','all along'],['干净','gānjìng','形容词','clean'],['满意','mǎnyì','动词','be satisfied']
];
const exampleMap = {
  假期:'这个假期我们想去草原看看。',海:'她喜欢海，但是不喜欢太冷的天气。',草原:'夏天的草原又绿又漂亮。',主意:'去草原骑马是个好主意。',骑:'我小时候学过骑马。',马:'草原上有很多马。',羊:'远处的牛和羊看起来很小。',月亮:'晚上我们坐在外面看月亮。',一定:'这次旅行一定很有意思。',
  刻:'现在是十点一刻。',起飞:'飞机上午十点一刻起飞。',宾馆:'我们已经选好宾馆了。',特别:'这家宾馆的环境特别安静。',别的:'你还要带别的东西吗？',一样:'房间跟照片里一样漂亮。',牛:'一出门就能看见牛和羊。',相机:'别忘了把新相机放进行李箱。',
  欢迎:'欢迎你们来草原旅游。',司机:'司机已经在机场等我们了。',晚点:'因为天气不好，飞机晚点了。',久:'不好意思，让您久等了。',除了:'除了行李箱以外，还有一个背包。',以外:'除了中文以外，她还会说英语。',先:'到了宾馆，我们先休息一下。',一直:'司机一直在出口等我们。',干净:'这个房间又大又干净。',满意:'我们对宾馆的服务很满意。'
};
const vocabulary = vocabRows.map((r,i)=>({id:`v04_${String(i+1).padStart(2,'0')}`,hanzi:r[0],pinyin:r[1],pos:r[2],english:r[3],example:exampleMap[r[0]],tags:[i<9?'A':i<17?'B':'C']}));
const word = h => vocabulary.find(v=>v.hanzi===h);
const card = (h,example,exampleEnglish) => ({hanzi:h,pinyin:(word(h)||{}).pinyin||'',english:(word(h)||{}).english||'',example,exampleEnglish});
const phraseMap={假期:['这个假期','假期计划'],海:['喜欢海','去海边'],草原:['去草原','草原旅行'],主意:['好主意','有一个主意'],骑:['骑马','骑自行车'],马:['骑马','一匹马'],羊:['牛和羊','吃羊肉'],月亮:['看月亮','月亮很亮'],一定:['一定会','一定有意思'],刻:['十点一刻','等一刻钟'],起飞:['飞机起飞','十点起飞'],宾馆:['选择宾馆','住宾馆'],特别:['很特别','特别热情'],别的:['别的东西','别的宾馆'],一样:['跟……一样','一样漂亮'],牛:['牛和羊','一头牛'],相机:['带相机','新相机'],欢迎:['欢迎你们','受到欢迎'],司机:['出租车司机','司机小李'],晚点:['飞机晚点','晚点到达'],久:['等很久','好久不见'],除了:['除了……以外','除了这个'],以外:['除此以外','除了……以外'],先:['先休息','先准备'],一直:['一直在等','一直向前'],干净:['很干净','又大又干净'],满意:['非常满意','对……满意']};

const texts = [
  {id:'t_hsk3_l04_01',textId:1,title:'假期去哪儿',setting:'在王一飞家客厅，杨同乐和王一飞在聊天儿。',lines:[
    ['杨同乐','这个假期咱们去哪儿玩玩吧。','Zhège jiàqī zánmen qù nǎr wánwan ba.','Let’s go somewhere to have fun this vacation.'],
    ['王一飞','好啊，你想去哪儿，咱们就去哪儿。','Hǎo a, nǐ xiǎng qù nǎr, zánmen jiù qù nǎr.','Sure! Wherever you want to go, we’ll go there.'],
    ['杨同乐','你喜欢海，找个海边住几天，怎么样？','Nǐ xǐhuan hǎi, zhǎo gè hǎibiān zhù jǐ tiān, zěnmeyàng?','You like the sea. How about staying by the sea for a few days?'],
    ['王一飞','现在去海边有点儿冷。','Xiànzài qù hǎibiān yǒudiǎnr lěng.','It is a bit cold to go to the seaside right now.'],
    ['杨同乐','那去草原吧？草原一点儿也不冷。','Nà qù cǎoyuán ba? Cǎoyuán yìdiǎnr yě bù lěng.','Then how about the grassland? It is not cold at all.'],
    ['王一飞','这个主意好！我好久没骑马了。','Zhège zhǔyi hǎo! Wǒ hǎojiǔ méi qí mǎ le.','That is a good idea! I have not ridden a horse in a long time.'],
    ['杨同乐','对，在草原上骑马、吃羊肉、看月亮，一定很有意思。','Duì, zài cǎoyuán shang qí mǎ, chī yángròu, kàn yuèliang, yídìng hěn yǒu yìsi.','Riding horses, eating mutton and watching the moon must be fun.']
  ]},
  {id:'t_hsk3_l04_02',textId:2,title:'准备机票和宾馆',setting:'在王一飞家客厅，两个人继续准备旅行。',lines:[
    ['杨同乐','出去玩的机票买好了吗？','Chūqu wán de jīpiào mǎihǎo le ma?','Have you booked the plane tickets?'],
    ['王一飞','买好了。星期六上午十点一刻起飞。','Mǎihǎo le. Xīngqīliù shàngwǔ shí diǎn yí kè qǐfēi.','Yes. It takes off at 10:15 on Saturday morning.'],
    ['杨同乐','宾馆也选好了吗？','Bīnguǎn yě xuǎnhǎo le ma?','Have you chosen the hotel too?'],
    ['王一飞','是的，这家宾馆很特别，跟别的都不一样，一出门就能看见牛和羊！','Shì de, zhè jiā bīnguǎn hěn tèbié, gēn biéde dōu bù yíyàng, yì chū mén jiù néng kànjiàn niú hé yáng!','Yes. This hotel is special and unlike any other; cows and sheep are right outside.'],
    ['杨同乐','太好了！你看看要带什么东西？','Tài hǎo le! Nǐ kànkan yào dài shénme dōngxi?','Great! What do we need to pack?'],
    ['王一飞','我们不用带太多东西，别忘了带上新买的相机。','Wǒmen búyòng dài tài duō dōngxi, bié wàng le dàishang xīn mǎi de xiàngjī.','We do not need much; do not forget the new camera.'],
    ['杨同乐','一定不会忘带的。我现在就去准备行李。','Yídìng bú huì wàng dài de. Wǒ xiànzài jiù qù zhǔnbèi xíngli.','I will not forget. I will pack now.']
  ]},
  {id:'t_hsk3_l04_03',textId:3,title:'机场见司机',setting:'在机场，杨同乐和王一飞跟预订的司机兼导游见面。',lines:[
    ['小李','欢迎你们！我是你们的司机，我姓李，叫我小李就可以。','Huānyíng nǐmen! Wǒ shì nǐmen de sījī, wǒ xìng Lǐ, jiào wǒ Xiǎo Lǐ jiù kěyǐ.','Welcome! I am your driver. Just call me Xiao Li.'],
    ['杨同乐','您好！不好意思，飞机晚点了，让您久等了。','Nín hǎo! Bù hǎoyìsi, fēijī wǎndiǎn le, ràng nín jiǔděng le.','Sorry, the flight was delayed and kept you waiting.'],
    ['小李','没关系。除了这个行李箱以外，还有别的东西吗？','Méi guānxi. Chúle zhège xínglixiāng yǐwài, hái yǒu biéde dōngxi ma?','Besides this suitcase, is there anything else?'],
    ['杨同乐','还有一个包，我自己拿就可以。','Hái yǒu yí gè bāo, wǒ zìjǐ ná jiù kěyǐ.','There is also a bag. I can carry it myself.'],
    ['小李','车在一层，请跟我来。','Chē zài yì céng, qǐng gēn wǒ lái.','The car is on the first floor. Follow me.'],
    ['杨同乐','我们住的宾馆离机场远吗？','Wǒmen zhù de bīnguǎn lí jīchǎng yuǎn ma?','Is our hotel far from the airport?'],
    ['小李','不远，三十分钟就能到。两位到了可以先休息休息，晚饭的时候我叫你们。','Bù yuǎn, sānshí fēnzhōng jiù néng dào. Liǎng wèi dào le kěyǐ xiān xiūxi xiuxi, wǎnfàn de shíhou wǒ jiào nǐmen.','Not far. It takes thirty minutes. Rest first and I will call you at dinner.']
  ]},
  {id:'t_hsk3_l04_04',textId:4,title:'旅游第一天',format:'diary',genre:'日记',author:'王一飞',dateLabel:'旅游第一天',setting:'王一飞的旅行日记。',lines:[
    ['王一飞','今天是我们旅游的第一天。','Jīntiān shì wǒmen lǚyóu de dì-yī tiān.','Today is the first day of our trip.'],
    ['王一飞','我们很早就起床去机场了，没想到飞机晚点了。','Wǒmen hěn zǎo jiù qǐchuáng qù jīchǎng le, méi xiǎngdào fēijī wǎndiǎn le.','We got up early, but the flight was delayed.'],
    ['王一飞','我们到的时候，天已经黑了，但是司机小李一直在机场等我们，一点儿也没着急。','Wǒmen dào de shíhou, tiān yǐjīng hēi le, dànshì sījī Xiǎo Lǐ yìzhí zài jīchǎng děng wǒmen, yìdiǎnr yě méi zháojí.','It was dark when we arrived, but Xiao Li had waited without getting anxious.'],
    ['王一飞','他特别热情，路上给我们介绍了很多东西，还准备了水果。','Tā tèbié rèqíng, lùshang gěi wǒmen jièshào le hěn duō dōngxi, hái zhǔnbèi le shuǐguǒ.','He was warm, introduced many things and prepared fruit.'],
    ['王一飞','宾馆的房间跟我想的一样漂亮，又大又干净，我非常满意。','Bīnguǎn de fángjiān gēn wǒ xiǎng de yíyàng piàoliang, yòu dà yòu gānjìng, wǒ fēicháng mǎnyì.','The room was as beautiful as I imagined, large and clean. I was very satisfied.']
  ]}
].map(t=>({...t,lines:t.lines.map(x=>({speaker:x[0],hanzi:x[1],pinyin:x[2],english:x[3]}))}));

const grammar = [
  {id:'g04_01',title:'……也/都 + 不/没……',titleEn:'Complete negation',scene:'旅行选择：什么地方、东西或活动一个也不选？',structure:'数量短语 / 一点儿 + 也/都 + 不/没 + 谓语',explanation:'表示完全否定。谓语是形容词时，常用“一点儿也/都不……”。',examples:[['她一件衣服都不想买。','She does not want to buy a single item of clothing.'],['我一个中国电影也没看过。','I have not watched a single Chinese film.'],['我一点儿东西也不想吃。','I do not want to eat anything at all.'],['草原一点儿也不冷。','The grassland is not cold at all.'],['小李一点儿也没着急。','Xiao Li was not anxious at all.']]},
  {id:'g04_02',title:'A 跟 B 一样',titleEn:'A is the same as B',scene:'比较两家宾馆的房间、位置和服务。',structure:'A + 跟 + B + 一样 + 形容词',explanation:'表示两者比较后相同；否定形式把“不”放在“一样”前面。',examples:[['这家宾馆跟别的不一样。','This hotel is different from the others.'],['这两个房间一样大。','These two rooms are equally large.'],['那个女孩子跟她姐姐一样高。','That girl is as tall as her sister.'],['他买的新手机跟我的一样。','His new phone is the same as mine.'],['这里的晚上跟照片里一样漂亮。','The evenings here are as beautiful as in the photos.']]},
  {id:'g04_03',title:'除了……（以外），……都/还/也……',titleEn:'Except for / besides',scene:'整理行李：哪些已经带了，哪些还要带？',structure:'除了 + X +（以外），+ 都 / 还 / 也 + 谓语',explanation:'“都”表示排除 X 后其余情况相同；“还/也”表示在 X 之外补充信息。',examples:[['除了我以外，大家都在玩手机。','Everyone except me is using a phone.'],['除了这个汉字，别的汉字我都会写。','I can write every character except this one.'],['除了这个行李箱以外，还有别的东西吗？','Besides this suitcase, is there anything else?'],['除了唱歌以外，他也喜欢跳舞。','Besides singing, he also likes dancing.'],['除了相机，我们还要带一些衣服。','Besides the camera, we also need some clothes.']]}
].map(g=>({...g,examples:g.examples.map(x=>({hanzi:x[0],english:x[1]}))}));

const sceneData = {
  '1':{title:'决定假期目的地',subtitle:'从海边到草原，边讨论边学习旅行词汇。',steps:[
    {title:'讨论去哪儿',prompt:'假期去海边还是去草原？',image:photo('photo-text-1-trip-plan'),labels:[{word:'假期',x:15,y:14},{word:'海',x:70,y:25},{word:'草原',x:82,y:42},{word:'主意',x:31,y:63}],words:['假期','海','草原','主意'],phrases:['这个假期','去海边','去草原','好主意'],sentence:'这个假期我们去草原吧。'},
    {title:'想象草原活动',prompt:'在草原上可以做什么？',image:photo('photo-text-1-grassland'),labels:[{word:'骑',x:35,y:31},{word:'马',x:47,y:50},{word:'牛',x:89,y:61},{word:'羊',x:78,y:68},{word:'月亮',x:79,y:13},{word:'一定',x:16,y:80}],words:['骑','马','牛','羊','月亮','一定'],phrases:['骑马','牛和羊','吃羊肉','看月亮','一定很有意思'],sentence:'在草原上骑马、看月亮，一定很有意思。'}]},
  '2':{title:'预订机票和宾馆',subtitle:'读时间、选宾馆、整理行李。',steps:[
    {title:'确认航班',prompt:'飞机什么时候起飞？',image:photo('photo-text-2-booking'),labels:[{word:'刻',x:28,y:26},{word:'起飞',x:42,y:17},{word:'宾馆',x:74,y:28}],words:['刻','起飞','宾馆'],phrases:['十点一刻','飞机起飞','选宾馆'],sentence:'飞机星期六上午十点一刻起飞。'},
    {title:'选择特别的宾馆',prompt:'这家宾馆有什么不一样？',image:photo('photo-text-2-booking'),labels:[{word:'特别',x:76,y:24},{word:'别的',x:70,y:38},{word:'一样',x:48,y:61},{word:'相机',x:18,y:66}],words:['特别','别的','一样','相机'],phrases:['很特别','跟别的不一样','带上相机'],sentence:'这家宾馆跟别的都不一样。'}]},
  '3':{title:'机场接机',subtitle:'见司机、说明晚点、检查行李。',steps:[
    {title:'认识司机',prompt:'司机怎样欢迎客人？',image:photo('photo-text-3-airport'),labels:[{word:'欢迎',x:18,y:23},{word:'司机',x:70,y:45},{word:'晚点',x:46,y:15},{word:'久',x:84,y:71}],words:['欢迎','司机','晚点','久'],phrases:['欢迎你们','飞机晚点','久等了'],sentence:'飞机晚点了，让您久等了。'},
    {title:'检查行李',prompt:'除了行李箱，还有什么？',image:photo('photo-text-3-airport'),labels:[{word:'除了',x:17,y:67},{word:'以外',x:30,y:78},{word:'先',x:75,y:22}],words:['除了','以外','先'],phrases:['除了……以外','还有一个包','先休息'],sentence:'除了这个行李箱以外，还有一个包。'}]},
  '4':{title:'入住后的感受',subtitle:'回顾旅行第一天，评价宾馆。',steps:[
    {title:'一直等待',prompt:'谁一直在机场等他们？',image:photo('photo-text-4-hotel-room'),labels:[{word:'一直',x:17,y:18},{word:'司机',x:75,y:65},{word:'晚点',x:28,y:78}],words:['一直','司机','晚点'],phrases:['一直在等','一点儿也没着急','飞机晚点'],sentence:'司机一直在机场等他们。'},
    {title:'评价房间',prompt:'宾馆房间怎么样？',image:photo('photo-text-4-hotel-room'),labels:[{word:'干净',x:24,y:32},{word:'满意',x:63,y:39},{word:'一样',x:81,y:20}],words:['干净','满意','一样'],phrases:['又大又干净','跟想的一样','非常满意'],sentence:'房间又大又干净，我非常满意。'}]}
};

const teachingNotes = {
  g04_01:{scene:'How would you say that you did not buy even one thing, or that the weather is not cold at all?',structureEn:'quantity phrase / 一点儿 + 也/都 + 不/没 + predicate',visualLearning:{leadExamples:[{english:'I did not buy a single thing.',hanzi:'我一件东西也没买。'},{english:'The grassland is not cold at all.',hanzi:'草原一点儿也不冷。'},{english:'Xiao Li was not anxious at all.',hanzi:'小李一点儿也没着急。'}],blocks:['一点儿','也','不冷'],blockLabelsEn:['not even a little','also','not cold'],impressions:[{hanzi:'一个地方也没去',english:'did not visit a single place'},{hanzi:'一件东西都没买',english:'did not buy a single thing'},{hanzi:'一点儿也不累',english:'not tired at all'}]}},
  g04_02:{scene:'How would you compare two rooms that are equally large, or say that one hotel is different?',structureEn:'A + 跟 + B + 一样 + adjective',visualLearning:{leadExamples:[{english:'This room is as large as that one.',hanzi:'这个房间跟那个房间一样大。'},{english:'Her new phone is the same as mine.',hanzi:'她的新手机跟我的一样。'},{english:'This hotel is different from the others.',hanzi:'这家宾馆跟别的都不一样。'}],blocks:['这家宾馆','跟那家','一样干净'],blockLabelsEn:['Hotel A','compared with Hotel B','equally clean'],impressions:[{hanzi:'一样大',english:'equally large'},{hanzi:'一样干净',english:'equally clean'},{hanzi:'不一样',english:'different'}]}},
  g04_03:{scene:'How would you add another item besides the camera, or exclude one person from a group?',structureEn:'除了 + X +（以外），+ 都 / 还 / 也 + predicate',visualLearning:{leadExamples:[{english:'Besides a camera, we also need clothes.',hanzi:'除了相机以外，我们还要带衣服。'},{english:'Everyone except me has arrived.',hanzi:'除了我以外，大家都到了。'},{english:'Besides Chinese, she also speaks English.',hanzi:'除了汉语以外，她也会说英语。'}],blocks:['除了相机以外','我们还要带','衣服'],blockLabelsEn:['besides the camera','we also need to bring','clothes'],impressions:[{hanzi:'除了我，大家都到了',english:'everyone except me arrived'},{hanzi:'除了海边，还可以去草原',english:'besides the seaside, we can visit the grassland'},{hanzi:'除了相机，也带了手机',english:'besides a camera, also brought a phone'}]}}
};

const qa = [
  [['他们为什么不去海边？','因为现在去海边有点儿冷。'],['他们最后想去哪儿？','他们想去草原。'],['王一飞好久没做什么了？','他好久没骑马了。'],['在草原上可以做什么？','可以骑马、吃羊肉、看月亮。']],
  [['飞机几点起飞？','星期六上午十点一刻起飞。'],['宾馆有什么特别？','一出门就能看见牛和羊。'],['他们不用带太多什么？','不用带太多东西。'],['他们一定要带什么？','一定要带新买的相机。']],
  [['小李是谁？','他是司机。'],['飞机怎么了？','飞机晚点了。'],['除了行李箱还有什么？','还有一个包。'],['宾馆离机场远吗？','不远，三十分钟就能到。']],
  [['司机为什么一直等他们？','因为飞机晚点了。'],['小李着急了吗？','没有，他一点儿也没着急。'],['小李在路上做了什么？','他介绍了很多东西，还准备了水果。'],['王一飞对房间满意吗？','满意，房间又大又干净。']]
];
const textTeachingNotes = Object.fromEntries(texts.map((t,i)=>[t.id,{languageLinks:i===0?[{label:'一点儿也不',use:'完全否定'},{label:'一定',use:'肯定推测'}]:i===1?[{label:'跟……不一样',use:'比较不同'},{label:'十点一刻',use:'说时间'}]:i===2?[{label:'除了……以外',use:'补充信息'},{label:'先……',use:'安排顺序'}]:[{label:'一点儿也没',use:'完全否定'},{label:'跟……一样',use:'比较相同'}],classQuestions:qa[i].map(x=>({question:x[0],answer:x[1]})),retellScaffold:{nodes:(i===0?[['选择','海边有点儿冷'],['决定','去草原'],['活动','骑马、看月亮']]:i===1?[['机票','十点一刻起飞'],['宾馆','跟别的不一样'],['行李','带相机']]:i===2?[['见面','司机欢迎'],['晚点','久等了'],['到宾馆','三十分钟']]:[['晚点','到得很晚'],['司机','一直等'],['房间','又大又干净']]).map(x=>({label:x[0],hint:x[1]})),frame:'先……，然后……，最后……。'}}]));

const missionSpecs = [
  {session:'A',title:'选择假期目的地',titleEn:'Choose a Vacation Destination',intro:'你和朋友要决定假期去哪儿。先认识旅行词语，再说明自己的选择。',introEn:'Learn ten travel words, practise them, then take the ranked preview challenge.',words:['假期','海','草原','主意','骑','马','牛','羊','月亮','一定'],image:img('grassland'),prompts:['查看今日词表','完成快速认词','参加配对冲刺','完成语境检测','参加正式挑战'],output:'请用 3 句话说明你想去哪儿、为什么以及想做什么。'},
  {session:'B',title:'预订一趟旅行',titleEn:'Book a Trip',intro:'你要确认航班、选择宾馆并整理行李。',introEn:'Confirm a flight, compare hotels and prepare your luggage.',words:['刻','起飞','宾馆','特别','别的','一样','牛','相机'],image:img('booking'),prompts:['读懂起飞时间','认识宾馆词语','比较两家宾馆','整理旅行物品','完成预订说明'],output:'请说明飞机几点起飞、选择哪家宾馆以及要带什么。'},
  {session:'C',title:'完成机场接机',titleEn:'Meet the Airport Driver',intro:'飞机晚点了，你要向司机说明情况、确认行李并评价宾馆。',introEn:'Explain the delay, check the luggage and describe the hotel room.',words:['欢迎','司机','晚点','久','除了','以外','先','一直','干净','满意'],image:img('airport'),prompts:['在机场见司机','说明飞机晚点','检查所有行李','安排到达顺序','评价宾馆房间'],output:'请用 3—4 句话讲述从机场到宾馆的经历。'}
];
function mission(spec,index){
  if(spec.session==='A'){
    const cards=spec.words.map(h=>card(h,exampleMap[h],''));
    const q=(id,question,questionEn,options,answer)=>({id,question,questionEn,options,answer});
    const stages=[
      {id:'a1',title:'今日词表',titleEn:'Word List',screenPrompt:'先听、看并标记十个生词。',screenPromptEn:'Listen, read and mark every word as Ready or Review.',interactionType:'study_list',photos:[{src:'../in-class/'+photo('photo-text-1-grassland'),label:'草原旅行 · Grassland trip'}],keywordCards:cards},
      {id:'a2',title:'快速认词',titleEn:'Quick Check',screenPrompt:'根据英文意思选择正确的中文词。',screenPromptEn:'Choose the Chinese word that matches each meaning. You will see feedback immediately.',interactionType:'practice_quiz',questions:[
        q('a2q1','','Which Chinese word means “vacation”?',['假期','月亮','主意'],'假期'),
        q('a2q2','','Which Chinese word means “grassland”?',['草原','海','马'],'草原'),
        q('a2q3','','Which Chinese word means “idea”?',['一定','主意','牛'],'主意'),
        q('a2q4','','Which Chinese word means “moon”?',['羊','月亮','海'],'月亮'),
        q('a2q5','','Which verb means “to ride”?',['马','骑','一定'],'骑')
      ]},
      {id:'a3',title:'配对冲刺',titleEn:'Match Sprint',screenPrompt:'把六个中文词和英文意思配成一组。',screenPromptEn:'Match six Chinese words with their English meanings. Wrong matches add one second.',interactionType:'timed_match',pairs:['假期','海','草原','骑','月亮','一定'].map(h=>({word:h,meaning:(word(h)||{}).english||''}))},
      {id:'a4',title:'语境检测',titleEn:'Context Check',screenPrompt:'把生词放进课文相关的短句中。',screenPromptEn:'Choose the word that completes each short sentence.',interactionType:'practice_quiz',questions:[
        q('a4q1','这个____我们去哪儿玩玩吧。','Where shall we go this vacation?',['假期','主意','一定'],'假期'),
        q('a4q2','现在去____有点儿冷。','It is a little cold to go to the seaside now.',['草原','海','月亮'],'海'),
        q('a4q3','那去____吧？','Then how about going to the grassland?',['草原','假期','马'],'草原'),
        q('a4q4','这个____好！','That is a good idea!',['主意','骑','羊'],'主意'),
        q('a4q5','我好久没____马了。','I have not ridden a horse for a long time.',['骑','海','一定'],'骑')
      ]},
      {id:'a5',title:'正式挑战',titleEn:'Ranked Challenge',screenPrompt:'十题计分，正确率优先；用时只在同分时比较。',screenPromptEn:'Ten scored questions. Accuracy comes first; time only breaks a tie.',interactionType:'ranked_quiz',questions:[
        q('a5q1','“vacation; holiday”是哪个词？','Choose “vacation; holiday”.',['假期','海','草原'],'假期'),
        q('a5q2','“sea”是哪个词？','Choose “sea”.',['月亮','海','羊'],'海'),
        q('a5q3','“grassland”是哪个词？','Choose “grassland”.',['草原','主意','一定'],'草原'),
        q('a5q4','“idea”是哪个词？','Choose “idea”.',['骑','主意','马'],'主意'),
        q('a5q5','“ride”是哪个词？','Choose “ride”.',['骑','牛','海'],'骑'),
        q('a5q6','“horse”是哪个词？','Choose “horse”.',['羊','马','月亮'],'马'),
        q('a5q7','“cattle”是哪个词？','Choose “cattle”.',['马','牛','羊'],'牛'),
        q('a5q8','“sheep; goat”是哪个词？','Choose “sheep; goat”.',['牛','海','羊'],'羊'),
        q('a5q9','晚上我们坐在外面看____。','At night we sit outside and watch the moon.',['月亮','假期','草原'],'月亮'),
        q('a5q10','这次旅行____很有意思。','This trip will certainly be interesting.',['主意','一定','骑'],'一定')
      ]}
    ];
    return{id:'pm_hsk3_l04_a',session:'A',pilotMode:'ranked_vocab_preview_v1',title:'第1次课课前热身赛',titleEn:'Preview A',subtitleEn:'Word Warm-up Challenge',scenario:spec.title,goals:spec.prompts.slice(0,3),steps:spec.prompts.map((p,i)=>({title:p,titleEn:stages[i].titleEn,task:p})),storyIntro:'学习十个旅行生词，练习后参加正式挑战。',storyIntroEn:spec.introEn,stages,completionMessageEn:'Your official score has been saved. A score of 70% or above completes Preview A.'};
  }
  if(spec.session==='B' || spec.session==='C'){
    const q=(id,question,questionEn,options,answer)=>({id,question,questionEn,options,answer});
    const configs={
      B:{
        photo:'photo-text-2-booking',photoLabel:'预订机票和宾馆 · Booking a trip',storyIntro:'学习八个预订与行李生词，练习后参加正式挑战。',
        quick:[
          q('b2q1','','Which Chinese word means “a quarter of an hour”?',['刻','起飞','一样'],'刻'),
          q('b2q2','','Which Chinese word means “to take off”?',['相机','起飞','宾馆'],'起飞'),
          q('b2q3','','Which Chinese word means “hotel”?',['宾馆','别的','牛'],'宾馆'),
          q('b2q4','','Which Chinese word means “special”?',['一样','特别','刻'],'特别'),
          q('b2q5','','Which Chinese word means “camera”?',['牛','相机','起飞'],'相机')
        ],
        pairs:['刻','起飞','宾馆','特别','一样','相机'],
        context:[
          q('b4q1','飞机星期六上午十点一____起飞。','The plane takes off at 10:15 on Saturday morning.',['刻','宾馆','相机'],'刻'),
          q('b4q2','飞机上午十点一刻____。','The plane takes off at 10:15 a.m.',['起飞','特别','一样'],'起飞'),
          q('b4q3','我们已经选好____了。','We have already chosen the hotel.',['宾馆','别的','牛'],'宾馆'),
          q('b4q4','这家宾馆很____，跟别的都不一样。','This hotel is special and different from the others.',['特别','刻','相机'],'特别'),
          q('b4q5','别忘了带上新买的____。','Do not forget to bring the new camera.',['相机','起飞','一样'],'相机')
        ],
        ranked:[
          q('b5q1','“quarter (of an hour)”是哪个词？','Choose “quarter (of an hour)”.',['刻','一样','特别'],'刻'),
          q('b5q2','“take off”是哪个词？','Choose “take off”.',['宾馆','起飞','相机'],'起飞'),
          q('b5q3','“hotel”是哪个词？','Choose “hotel”.',['宾馆','牛','别的'],'宾馆'),
          q('b5q4','“special; especially”是哪个词？','Choose “special; especially”.',['刻','特别','一样'],'特别'),
          q('b5q5','“other”是哪个词？','Choose “other”.',['别的','相机','牛'],'别的'),
          q('b5q6','“the same”是哪个词？','Choose “the same”.',['起飞','一样','刻'],'一样'),
          q('b5q7','“cattle”是哪个词？','Choose “cattle”.',['牛','宾馆','相机'],'牛'),
          q('b5q8','“camera”是哪个词？','Choose “camera”.',['特别','相机','别的'],'相机'),
          q('b5q9','这家宾馆跟____都不一样。','This hotel is different from all the others.',['别的','刻','牛'],'别的'),
          q('b5q10','这两个房间____大。','These two rooms are equally large.',['一样','起飞','相机'],'一样')
        ]
      },
      C:{
        photo:'photo-text-3-airport',photoLabel:'机场接机 · Meeting the driver',storyIntro:'学习十个接机与入住生词，练习后参加正式挑战。',
        quick:[
          q('c2q1','','Which Chinese word means “welcome”?',['欢迎','满意','一直'],'欢迎'),
          q('c2q2','','Which Chinese word means “driver”?',['司机','先','干净'],'司机'),
          q('c2q3','','Which Chinese word means “to be delayed”?',['晚点','久','除了'],'晚点'),
          q('c2q4','','Which Chinese word means “for a long time”?',['以外','久','先'],'久'),
          q('c2q5','','Which Chinese word means “to be satisfied”?',['干净','欢迎','满意'],'满意')
        ],
        pairs:['欢迎','司机','晚点','除了','先','满意'],
        context:[
          q('c4q1','____你们！我是你们的司机。','Welcome! I am your driver.',['欢迎','满意','一直'],'欢迎'),
          q('c4q2','我是你们的____，叫我小李就可以。','I am your driver. Just call me Xiao Li.',['司机','先','久'],'司机'),
          q('c4q3','飞机____了，让您久等了。','The flight was delayed and kept you waiting.',['晚点','干净','以外'],'晚点'),
          q('c4q4','____这个行李箱以外，还有别的东西吗？','Besides this suitcase, is there anything else?',['除了','一直','欢迎'],'除了'),
          q('c4q5','到了宾馆可以____休息一下。','You can rest first after arriving at the hotel.',['先','满意','司机'],'先')
        ],
        ranked:[
          q('c5q1','“welcome”是哪个词？','Choose “welcome”.',['欢迎','先','干净'],'欢迎'),
          q('c5q2','“driver”是哪个词？','Choose “driver”.',['满意','司机','除了'],'司机'),
          q('c5q3','“be delayed”是哪个词？','Choose “be delayed”.',['一直','晚点','久'],'晚点'),
          q('c5q4','“long”是哪个词？','Choose “long”.',['久','先','以外'],'久'),
          q('c5q5','“besides; except”是哪个词？','Choose “besides; except”.',['除了','欢迎','满意'],'除了'),
          q('c5q6','“other than; except”是哪个词？','Choose “other than; except”.',['干净','以外','司机'],'以外'),
          q('c5q7','“first”是哪个词？','Choose “first”.',['晚点','一直','先'],'先'),
          q('c5q8','“all along”是哪个词？','Choose “all along”.',['一直','久','欢迎'],'一直'),
          q('c5q9','这个房间又大又____。','This room is large and clean.',['干净','满意','以外'],'干净'),
          q('c5q10','我对宾馆的服务很____。','I am satisfied with the hotel service.',['先','满意','晚点'],'满意')
        ]
      }
    };
    const cfg=configs[spec.session];
    const stages=[
      {id:`${spec.session.toLowerCase()}1`,title:'今日词表',titleEn:'Word List',screenPrompt:'先听、看并标记本次生词。',screenPromptEn:'Listen, read and mark each word as Ready or Review.',interactionType:'study_list',photos:[{src:'../in-class/'+photo(cfg.photo),label:cfg.photoLabel}],keywordCards:spec.words.map(h=>card(h,exampleMap[h],''))},
      {id:`${spec.session.toLowerCase()}2`,title:'快速认词',titleEn:'Quick Check',screenPrompt:'根据英文意思选择正确的中文词。',screenPromptEn:'Choose the Chinese word that matches each meaning. You will see feedback immediately.',interactionType:'practice_quiz',questions:cfg.quick},
      {id:`${spec.session.toLowerCase()}3`,title:'配对冲刺',titleEn:'Match Sprint',screenPrompt:'把六个中文词和英文意思配成一组。',screenPromptEn:'Match six Chinese words with their English meanings. Wrong matches add one second.',interactionType:'timed_match',pairs:cfg.pairs.map(h=>({word:h,meaning:(word(h)||{}).english||''}))},
      {id:`${spec.session.toLowerCase()}4`,title:'语境检测',titleEn:'Context Check',screenPrompt:'把生词放进课文相关的短句中。',screenPromptEn:'Choose the word that completes each short sentence.',interactionType:'practice_quiz',questions:cfg.context},
      {id:`${spec.session.toLowerCase()}5`,title:'正式挑战',titleEn:'Ranked Challenge',screenPrompt:'十题计分，正确率优先；用时只在同分时比较。',screenPromptEn:'Ten scored questions. Accuracy comes first; time only breaks a tie.',interactionType:'ranked_quiz',questions:cfg.ranked}
    ];
    return{id:`pm_hsk3_l04_${spec.session.toLowerCase()}`,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:`第${index+1}次课课前热身赛`,titleEn:`Preview ${spec.session}`,subtitleEn:'Word Warm-up Challenge',scenario:spec.title,goals:spec.prompts.slice(0,3),steps:spec.prompts.map((p,i)=>({title:p,titleEn:stages[i].titleEn,task:p})),storyIntro:cfg.storyIntro,storyIntroEn:spec.introEn,stages,completionMessageEn:`Your official score has been saved. A score of 70% or above completes Preview ${spec.session}.`};
  }
  const stages=spec.prompts.map((p,i)=>{const slice=[0,1,2].map(k=>spec.words[(i*2+k)%spec.words.length]);return{id:`${spec.session.toLowerCase()}${i+1}`,title:p,titleEn:['Meet the Words','Find the Meaning','Build Phrases','Notice the Pattern','Prepare to Speak'][i],screenPrompt:p+'。',screenPromptEn:'Complete this step before class.',interactionType:i===0?'choice_set':'multi_select',photos:i===0?[{src:'../in-class/'+spec.image,label:spec.title}]:undefined,options:slice.concat(i===3?'一点儿也不':i===4?'跟……一样':'准备行李'),items:i===0?[{id:'first',question:'选择本步关键词。',questionEn:'Choose a key word.',options:slice}]:undefined,keywordCards:slice.map((h,k)=>card(h,`${h}是本课的重要词语。`,`${h} is a key word in this lesson.`))}});
  return{id:`pm_hsk3_l04_${spec.session.toLowerCase()}`,session:spec.session,title:`第${index+1}次课课前任务`,titleEn:`Preview ${spec.session}`,subtitleEn:spec.titleEn,scenario:spec.title,goals:spec.prompts.slice(0,3),steps:spec.prompts.map((p,i)=>({title:p,titleEn:stages[i].titleEn,task:p})),storyIntro:spec.intro,storyIntroEn:spec.introEn,stages,outputTask:{prompt:spec.output,promptEn:'Prepare a short Chinese response for class.',sentenceFrames:['我想……，因为……。','除了……以外，还……。','……跟……一样 / 不一样。'],sampleAnswer:'这个假期我想去草原。草原一点儿也不冷，我还想骑马、看月亮。'}};
}

const fills = [
  [['假期','海','草原','主意','骑'],['十一____快到了，我们还没想好要去哪儿旅行。','妹妹从小就喜欢____，所以这次特别想住在离海边近的宾馆。','听说____上白天可以骑马，晚上还能和朋友一起看月亮。','大家讨论了半天以后，王一飞终于想出了一个大家都喜欢的好____。','我小时候学过____马，所以一到草原就想再试一试。']],
  [['刻','起飞','宾馆','特别','相机'],['现在已经十点一____了，离飞机起飞还有半个小时。','我们坐的飞机星期六上午十点____，大家最好提前两个小时到机场。','为了方便第二天早起出发，我们已经选好一家离机场很近的____。','这家宾馆一出门就能看见草原，感觉很____。','妈妈说：“别忘了带上新买的____，把草原的风景拍下来。”']],
  [['欢迎','司机','晚点','除了','满意'],['____你们来草原旅行，希望接下来的几天都玩得开心。','来机场接我们的____已经等了很久，但是他一点儿也没着急。','因为昨晚天气不好，飞机____了一个多小时，我们到的时候天已经黑了。','____这个行李箱以外，我们还带了一个装相机和衣服的背包。','房间跟照片里一样又大又干净，我和朋友都非常____。']]
].map((g,gi)=>({id:`l04_fill_group_0${gi+1}`,type:'vocab_fill_group',stage:'in_class',contentRole:gi===0?'lesson':gi===1?'transfer':'review',prompt_en:'Choose from the word bank for each sentence.',data:{wordBank:g[0],wordBank_pinyin:g[0].map(x=>(word(x)||{}).pinyin||''),sentences:g[1].map((s,i)=>({sentence:s,answer:g[0][i]})),speakingOutput:{support:'任选 2 个词，按句框说一句：这个假期我想……。',core:'任选 3 个词，用 2 句话介绍一次旅行。',stretch:'任选 4 个词，完成 30 秒旅行故事。'}}}));
const orders = [
  ['草原一点儿也不冷。',['草原','一点儿','也','不冷']],
  ['这家宾馆跟别的都不一样。',['这家宾馆','跟别的','都不一样']],
  ['除了汉语课以外，我们下午还有一节体育课。',['除了汉语课以外','我们下午','还有','一节体育课']],
  ['我姐姐的新手机跟我的一样好用。',['我姐姐的新手机','跟我的','一样','好用']],
  ['他每天七点就到教室复习生词。',['他每天七点','就到教室','复习生词']]
].map((x,i,a)=>({id:`l04_order_0${i+1}`,type:'ordering',contentRole:roleFor(i,a.length),prompt_cn:'把词语排成一个完整、自然的句子。',prompt_en:'Put the chunks in order to make a complete sentence.',correct_answer:x[0],data:{chunks:x[1],chunks_pinyin:x[1].map(()=> '')}}));
const readPassages = [
  ['周末安排','星期六，小雨先去姐姐家住一天。星期天，她和姐姐坐车去海边。她们不骑马，也不看月亮，只想在海边走一走。','小雨星期天要去哪里？','海边。',['姐姐家。','草原。','机场。']],
  ['两家宾馆','学校旁边有两家宾馆。第一家又大又漂亮，但是离地铁站远。第二家不大，房间很干净，出门五分钟就到地铁站。王老师选了第二家。','王老师为什么选第二家宾馆？','因为它离地铁站近。',['因为它的房间很大。','因为它在机场旁边。','因为那里能看见牛和羊。']],
  ['周六的飞机','小林的飞机星期六十点一刻起飞。他七点就起床了，八点到机场。到了机场，他先吃早饭，再给妈妈打电话。','小林几点到机场？','八点。',['七点。','十点一刻。','十一点。']],
  ['相机不见了','小周到了宾馆才发现相机不见了。他先给司机打电话，然后去服务台。司机说相机还在车里，一会儿就送来。','小周发现相机不见了以后先做什么？','先给司机打电话。',['先去服务台。','先回机场。','先吃晚饭。']],
  ['生日晚饭','今天是小美的生日。除了小美以外，别的同学都到了。大家点了饺子和鱼，还点了一个蛋糕。小美来的时候，他们一起说：“生日快乐！”','大家说“生日快乐”以前，谁还没有到？','小美。',['服务员。','王老师。','小雨。']]
].map((x,i,a)=>({id:`l04_read_0${i+1}`,type:'passage_reading',contentRole:roleFor(i,a.length),prompt_cn:'阅读小篇章，回答问题。',prompt_en:'Read and answer.',data:{title:x[0],passage:x[1],questions:[{question_cn:x[2],answer:x[3]}],choices:x[4]}}));
const taskCards = [
  ['选择旅行地','你和朋友说说假期去哪儿。',['比较海边和草原','说明天气','选择两个活动'],['假期','海','草原','骑马'],'用 3—4 句话说明。'],
  ['预订行程','你来确认机票和宾馆。',['说起飞时间','介绍宾馆特点','列出要带的东西'],['十点一刻','起飞','宾馆','相机'],'用 3—4 句话汇报。'],
  ['带新生看学校','你给新同学介绍学校。',['说位置和交通','介绍两个优点','说一个不方便的地方'],['小区','地铁站','挺','但是'],'每位组员至少说一句。'],
  ['在银行办卡','你帮助新同学办信用卡。',['说明要带的东西','安排办卡顺序','说什么时候能办好'],['先','然后','信用卡','办'],'完成一段三轮对话。'],
  ['为同学点餐','小组为刚下课的同学安排晚饭。',['先问想吃什么','根据菜单点三样','向服务员确认'],['服务员','菜单','一共','请等一下'],'完成一段四轮对话。']
].map((x,i,a)=>({id:`l04_task_0${i+1}`,type:'open_response',contentRole:roleFor(i,a.length),prompt_cn:`任务卡：${x[0]}。`,prompt_en:x[0],openEnded:true,needsTeacherReview:true,data:{title:x[0],role:x[1],steps:x[2],keywords:x[3],output:x[4],answerPlaceholder:'请写下课堂表达。'}}));

const sceneChoices = [
  ['The friends reject the seaside because it is cold.','Use complete negation.','草原一点儿也不冷。'],
  ['They decide to ride horses.','Use 骑马.','我好久没骑马了。'],
  ['The flight is at 10:15.','Say the takeoff time.','飞机十点一刻起飞。'],
  ['The hotel is unique.','Compare it with other hotels.','这家宾馆跟别的都不一样。'],
  ['Pack for the trip.','Remember the camera.','别忘了带上相机。'],
  ['A student compares two dormitory areas.','Use 跟……一样.','新宿舍区跟旧宿舍区一样安静。'],
  ['A visitor plans an efficient campus tour.','Use 先……再…….','我们先去图书馆，再去宿舍区看看。'],
  ['A student explains what is near the metro station.','Use 除了……以外，还…….','除了商场以外，地铁站附近还有一家银行。'],
  ['A customer asks a waiter to wait.','Review a restaurant expression.','服务员，请等一下，我们还没点完。'],
  ['A student arrived later than expected.','Review 才 for a late action.','他晚上十点才回到宿舍。']
].map((x,i,a)=>({id:`l04_scene_${String(i+1).padStart(2,'0')}`,type:'scene_sentence_choice',stage:'in_class',contentRole:roleFor(i,a.length),prompt_en:'Choose the best sentence for the scene.',data:{scene_en:x[0],clue_en:x[1],options:[x[2],'虽然天气不错，但是我还没想好去哪儿。','除了今天以外，我们这个星期都有汉语课。','他每天练习以后才回宿舍休息。'],correct_index:0},correct_answer:x[2]}));

const matchGroups = [
  [['十一假期快到了，你们最后想好去哪里旅行了吗？','想好了，我们去草原骑马，晚上还想一起看月亮。'],['现在去草原会不会很冷，需要带很多衣服吗？','白天一点儿也不冷，晚上有点儿冷，最好多带一件衣服。'],['你以前学过骑马吗？到了草原以后想不想自己骑？','我小时候学过，所以这次特别想再骑一次。'],['你不是一直很喜欢海吗，为什么这次不去海边了？','因为现在海边有点儿冷，而且我们都没去过草原。'],['杨同乐说去草原以后，王一飞觉得这个主意怎么样？','他觉得这个主意很好，还说自己已经好久没骑马了。']],
  [['你看过新小区的房子以后，觉得那里的环境怎么样？','那里挺安静，花园跟照片里一样漂亮。'],['新小区离地铁站远不远，平时去学校方便吗？','不太远，从小区走十分钟就到，坐地铁去学校很方便。'],['安娜第一次去银行办信用卡，需要带什么？','除了护照以外，还要带手机和两张照片。'],['她今天为什么没有办好信用卡？','因为少了一张纸，只能下个月再去。'],['如果只有四十分钟看学校，你打算先去哪里？','我们先去教室，再去图书馆。']],
  [['大家看了半天菜单，最后点了哪些菜？','我们点了两盘饺子、一份鱼和一个凉菜，应该够大家吃。'],['菜已经点好了，你们还需要什么饮料吗？','请给我们两杯热茶，再给不喝茶的同学一杯果汁。'],['服务员，我们点的菜和饮料一共多少钱？','一共一百二十元，可以使用银行卡或者手机付款。'],['我们还没有选好最后一道菜，服务员已经来了吗？','还没有，她正在给别的客人上菜，我们可以再等一下。'],['你平时九点就回宿舍，昨天为什么十点才回来？','因为公共汽车来得太晚了，我在车站等了四十多分钟。']]
].map((pairs,i)=>({id:`l04_match_0${i+1}`,type:'word_match',stage:'in_class',contentRole:i===0?'lesson':i===1?'transfer':'review',prompt_en:'Match each question with the best answer.',data:{pairs:pairs.map(x=>({left:x[0],right:x[1]}))}}));
const guesses = [
  ['不上课或不上班、可以旅行休息的一段时间。',['假期','司机','宾馆','月亮'],'假期'],
  ['有很多草、可以看见牛和羊的地方。',['草原','海','机场','宾馆'],'草原'],
  ['人在它的背上，可以让它带着人走。',['马','羊','牛','相机'],'马'],
  ['飞机离开地面、飞到空中。',['起飞','晚点','欢迎','满意'],'起飞'],
  ['旅行时住的地方，有很多房间。',['宾馆','草原','机场','海'],'宾馆'],
  ['学生住的地方，里面有很多楼。',['宿舍区','地铁站','银行','机场'],'宿舍区'],
  ['去银行买东西时可以先刷它，下个月再还钱。',['信用卡','身份证','银行卡','房卡'],'信用卡'],
  ['在地下运行、帮助人们快速到达城市不同地方的公共交通。',['地铁','出租车','飞机','自行车'],'地铁'],
  ['在餐厅帮助客人点菜、上菜的人。',['服务员','司机','老师','经理'],'服务员'],
  ['在餐厅里写着菜名和价格、点菜时要看的东西。',['菜单','护照','地图','课本'],'菜单']
].map((x,i,a)=>({id:`l04_desc_${String(i+1).padStart(2,'0')}`,type:'description_guess',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'读完整提示，联系语境猜词。',prompt_en:'Read the contextual clue and choose the best word.',data:{description:x[0],options:x[1],correct_index:0},correct_answer:x[2]}));
const sayWords=[
  ['假期',['不上课','旅行','休息']],['草原',['草','骑马','牛和羊']],['骑马',['运动','动物','草原']],['十点一刻',['时间','十点以后','十五分钟']],
  ['跟别的不一样',['比较','特别','不同']],['飞机晚点',['机场','没有按时','等']],['一直在等',['从开始到现在','没有离开','等人']],['非常满意',['觉得很好','喜欢','没有问题']]
];
const sayGuess=sayWords.map((item,i,a)=>({id:`l04_say_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:item[0],boardIndex:i+1,clues:[],scaffold:{words:item[1],frames:['这是一个……。','人们用它 / 在这里……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));
const blind=[['假期','草原'],['起飞','刻'],['信用卡','办'],['服务员','菜单']].map((w,i,a)=>({id:`l04_blind_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both words.',openEnded:true,needsTeacherReview:true,data:{words:w,instructions:'Use both words in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。'}}));
const picturePrompts=[
  ['photo-text-1-trip-plan','假期'],['photo-text-1-grassland','一点儿也不'],['photo-text-2-booking','十点一刻'],['photo-text-2-booking','跟……不一样'],
  ['photo-text-3-airport','先……再……'],['photo-text-3-airport','虽然……但是……'],['photo-text-4-hotel-room','挺'],['photo-text-4-hotel-room','就 / 才']
];
const pictureComplete=picturePrompts.map((x,i,a)=>({id:`l04_pic_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the keyword to write one complete sentence about the photo.',data:{image:photo(x[0]),keyword:x[1],task:'观察人物、物品和场景，用关键词写一个完整、自然的句子。',answerPlaceholder:''}}));
const independent = readPassages.map((q,i,a)=>{const d=q.data,correct=d.questions[0].answer;return{id:`l04_ind_read_0${i+1}`,type:'choice',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:d.title,passage:d.passage,question_cn:d.questions[0].question_cn,options:[correct].concat(d.choices||[]),correct_index:0},correct_answer:correct}});
const paragraphs = [
  ['选择目的地',['假期快到了。','____1____','海边现在有点儿冷。','____2____','我们还想在晚上看月亮。','____3____'],['我和朋友正在说去哪儿。','所以我们最后去草原。','这次旅行一定很有意思。']],
  ['准备出发',['机票已经买好了。','____1____','宾馆也已经选好。','____2____','最后别忘了带相机。','____3____'],['飞机十点一刻起飞。','它跟别的宾馆不一样。','现在可以准备行李了。']],
  ['看看宿舍区',['新生下午去宿舍区看看。','____1____','宿舍里面挺安静的。','____2____','最后老师带大家去了食堂。','____3____'],['他们先看了花园。','虽然离地铁站有点儿远，但是环境很好。','大家都说了一个优点和一个缺点。']],
  ['在银行办卡',['安娜要办信用卡。','____1____','到了银行以后，她只等了十分钟。','____2____','王老师又帮助了她。','____3____'],['她先把护照和照片放进包里。','所以很快就办好了。','最后，她高兴地回学校了。']],
  ['周末聚餐',['周末晚上，五个同学一起去餐厅。','____1____','有人想吃饺子，也有人想吃鱼。','____2____','服务员确认以后去准备菜。','____3____'],['服务员先给大家看菜单。','他们看了几分钟才点好。','大家一边喝茶一边聊天。']]
].map((x,i,a)=>({id:`l04_para_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'段落填空。',prompt_en:'Choose three sentences to complete the paragraph.',openEnded:true,needsTeacherReview:true,data:{title:x[0],passageParts:x[1],options:x[2].concat(['我下午去医院。','这家银行很大。','他想吃饺子。']),answers:[0,1,2],instructions:'点击句子，再点击对应空格。',answerPlaceholder:''}}));
const chains=[['从“这个假期”开始','这个假期',['海','草原','骑马','月亮']],['从“飞机”开始','飞机',['十点一刻','起飞','晚点']],['从“我们学校的宿舍区”开始','我们学校的宿舍区',['挺','安静','地铁站']],['从“办信用卡”开始','办信用卡',['先','然后','信用卡']],['从“服务员，请等一下”开始','服务员，请等一下',['菜单','点菜','一共']]].map((x,i,a)=>({id:`l04_chain_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'接龙造句。',prompt_en:'Continue the sentence chain.',openEnded:true,needsTeacherReview:true,data:{title:x[0],starter:x[1],steps:[`S1: ${x[1]}`,`S2: ${x[1]}……`,`S3: ${x[1]}…………`],keywords:x[2],instructions:'每位学生增加一个自然的部分，最后形成完整表达。',answerPlaceholder:'继续接一句中文。'}}));

const battleGames={
  roulette:[['推荐一个假期目的地。','你要说服朋友一起旅行。',['假期','草原','一定'],'这个假期我们去草原吧，一定很有意思。'],['介绍一家特别的宾馆。','比较它和别的宾馆。',['宾馆','特别','不一样'],'这家宾馆很特别，跟别的都不一样。'],['向司机说明飞机晚点。','刚刚在机场见面。',['晚点','久等'],'飞机晚点了，让您久等了。'],['评价宾馆房间。','入住后给朋友发语音。',['一样','干净','满意'],'房间跟照片里一样漂亮，又大又干净，我很满意。']].map((x,i)=>({id:`l04_r_0${i+1}`,challenge:x[0],scene:x[1],keywords:x[2],sample:x[3]})),
  relay:[['假期',['旅行','草原']],['宾馆',['特别','干净']],['司机',['机场','欢迎']],['相机',['拍照','带上']]].map((x,i)=>({id:`l04_relay_0${i+1}`,starter:x[0],goal:'接一个本课短语或短句。',mustUse:x[1]})),
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：cǎoyuán',answer:'草原'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：bīnguǎn',answer:'宾馆'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：mǎnyì',answer:'满意'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“假期”说一个短语。',answer:'这个假期 / 假期计划'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“起飞”说一个短语。',answer:'飞机起飞 / 十点起飞'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“干净”说一个短语。',answer:'很干净 / 又大又干净'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“飞机晚点了”是什么意思？',options:['飞机迟到了','飞机起飞了','飞机到了'],answer:'飞机迟到了'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'哪一个表示 10:15？',options:['十点一刻','十点半','十一点一刻'],answer:'十点一刻'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“一点儿也不”说一句话。',answer:'草原一点儿也不冷。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“跟……一样”说一句话。',answer:'这个房间跟照片里一样漂亮。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“除了……以外，还……”说一句话。',answer:'除了相机以外，我们还要带衣服。'}
  ]}
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L04',lessonKey:'HSK3-L04',title:'这家宾馆跟别的都不一样',titleEn:'This hotel is unlike any other',topic:'假期计划、旅行经历与宾馆评价',courseModel:'三次课：目的地选择 → 行程预订 → 接机与入住',sourceTextPolicy:'教材对话保持原意；教学扩展用于任务链和练习。'},
  pedagogy:{exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'词语聚合任务提供支持、基础、挑战三档输出，要求每位组员至少完成一句。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：选择假期目的地',textIds:['t_hsk3_l04_01'],previewMissionId:'pm_hsk3_l04_a',focus:['旅行地点与活动','完全否定','说明选择理由']},
    {id:'B',title:'第二次课：预订机票和宾馆',textIds:['t_hsk3_l04_02'],previewMissionId:'pm_hsk3_l04_b',focus:['时间与旅行准备','跟……一样','比较宾馆']},
    {id:'C',title:'第三次课：机场接机与入住',textIds:['t_hsk3_l04_03','t_hsk3_l04_04'],previewMissionId:'pm_hsk3_l04_c',focus:['接机与行李','除了……以外','讲述旅行经历']}
  ],
  vocabScenes:sceneData,vocabulary,grammar,texts,grammarTeachingNotes:teachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(v=>[v.id,{session:v.tags[0],phrases:phraseMap[v.hanzi]||[v.hanzi]}])),
  previewMissions:missionSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l04_a',vocabularyIds:missionSpecs[0].words.map(h=>word(h).id),grammarIds:grammar.map(g=>g.id),readingData:[{id:'pre_l04_read',title:'旅行计划',text:'这个假期我们想去草原。草原一点儿也不冷，还可以骑马、看月亮。'}]},
  inClass:{questionGroups:{
    v5_vocab_fill:fills,g1_ordering:orders,r2_passage_choice:readPassages,t2_task_card:taskCards,battleGames,
    scene_sentence_choice:sceneChoices,v7_word_match:matchGroups,v6_description_guess:guesses,v2_say_guess:sayGuess,v3_blind_box:blind,g2_picture_complete:pictureComplete,r3_independent_reading:independent,r4_paragraph_fill:paragraphs,t3_chain_sentence:chains,
    info_match:[{id:'l04_info_01',type:'info_match',stage:'in_class',prompt_cn:'人物配对。',prompt_en:'Match people with their travel plans.',data:{people:['杨同乐','王一飞','小李','宾馆'],clues:['提出去草原','准备机票和行李','在机场等客人','准备干净的房间'],answer:['杨同乐-提出去草原','王一飞-准备机票和行李','小李-在机场等客人','宾馆-准备干净的房间']}},{id:'l04_info_02',type:'info_match',stage:'in_class',prompt_cn:'前后配对。',prompt_en:'Match each event with its result.',data:{people:['飞机晚点','司机久等','到达宾馆','看见房间'],clues:['到达时间变晚','一直在机场等','先休息','非常满意'],answer:['飞机晚点-到达时间变晚','司机久等-一直在机场等','到达宾馆-先休息','看见房间-非常满意']}}],
    pk_question:[['草原一点儿也不____。','冷'],['这家宾馆跟别的都不____。','一样'],['除了相机以外，还要带____。','衣服']].map((x,i)=>({id:`l04_pk_0${i+1}`,type:'choice',prompt_cn:x[0],prompt_en:'Choose the word.',correct_answer:x[1],data:{question_cn:x[0],options:[x[1],'才','纸','关'],correct_index:0}})),textQa:[],pictureTalk:[]
  }},
  postClassHomework:{mode:'hsk3_session_tasks',instructions:{required:'完成任务起点思考和旅行档案卡；最终口头作品在课堂完成。',optional:'不需要上传录音。A、B 的内容会继续用于 C 的最终绘本。',aiPolicy:'先独立完成，再使用工具检查。'},sessionMeta:{
    A:{label:'旅行档案 · 第1页',goal:'确定旅行目的地、理由和活动，为最终故事建立开头。',suggested_minutes:'10-15分钟',suggested_mix:'课后完成计划卡；下次课两人互说，系统随机展示 2—3 份。'},
    B:{label:'旅行档案 · 第2页',goal:'在 A 的计划后补充航班、宾馆和行李信息。',suggested_minutes:'10-15分钟',suggested_mix:'继续同一份旅行档案；课堂采用无声画廊和抽样点评。'},
    C:{label:'课堂最终项目 · 我的旅行故事',goal:'整合 A、B 的素材，在课堂完成四格绘本和小组口头展示。',suggested_minutes:'20-25分钟',suggested_mix:'不上传录音；课堂先两人彩排，再小组全员表达，最后全班抽样展示。'}
  },sessions:{
    A:[
      {id:'post_l04_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'旅行档案 1/3 · 了解旅行地',required:true,prompt_cn:'十一假期快到了，你想去哪儿旅行？你了解要去的这个地方吗？',prompt_en:'The National Day holiday is coming. Where would you like to travel? What do you already know about this place?',answerPlaceholder:'我想去……。\n我知道那里……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l04_a_plan',type:'project_card',taskLabel:'作品卡',projectStage:'旅行档案 1/3 · 保存到最终作品',required:true,prompt_cn:'完成“我想去哪儿旅行”计划卡：写清楚目的地、原因和活动。',prompt_en:'Build the opening page of your travel file: destination, reason and activities.',answerPlaceholder:'1. 我想去……\n2. 因为……\n3. 我想在那里……',needsTeacherReview:true,openEnded:true,wordBank:['假期','海','草原','主意','骑马','看月亮','一定'],picturePrompts:['目的地','选择理由','想做的活动'],scaffoldLevels:[{label:'基础层 / Support',instruction:'从图片、词语和句框中选择信息，完成 3 句话。'},{label:'标准层 / Core',instruction:'根据关键词独立写 3—4 句话，说明去哪里、为什么、做什么。'},{label:'挑战层 / Challenge',instruction:'写 5 句话，加入比较、原因或自己的旅行经历。'}]},
      {id:'post_l04_a_share',type:'showcase_plan',taskLabel:'课堂展示',projectStage:'下一次课 · Presentation Preparation',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Travel Destination',prompt_en:'Prepare the materials and answers below before class.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring 1–3 clear photos of your travel destination.','Answer three questions: Where do you want to go? Why do you want to go there? What do you want to do there?','Speak for 1–2 minutes.','You may work in a small group, but every student must speak.'],classroomNote:'Complete the speaking task in class. You do not need to upload an audio recording.'}
    ],
    B:[
      {id:'post_l04_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'旅行档案 2/3 · 计划交通和住宿',required:true,prompt_cn:'旅行地点已经确定了。你准备怎么去？什么时候出发？你想住什么样的宾馆？',prompt_en:'You have chosen your destination. How will you travel there? When will you leave? What kind of hotel would you like?',answerPlaceholder:'我准备……去。\n我……出发。\n我想住……的宾馆。',needsTeacherReview:true,openEnded:true},
      {id:'post_l04_b_plan',type:'project_card',taskLabel:'扩展卡',projectStage:'旅行档案 2/3 · 接在 A 后面',required:true,prompt_cn:'继续旅行档案：补充飞机起飞时间、宾馆特点和要带的东西。',prompt_en:'Continue the same travel file with the flight, hotel and luggage.',answerPlaceholder:'1. 飞机……起飞。\n2. 我们选择……宾馆，因为……\n3. 除了……以外，还要带……',needsTeacherReview:true,openEnded:true,wordBank:['刻','起飞','宾馆','特别','别的','一样','相机'],picturePrompts:['起飞时间','宾馆特点','旅行行李'],carryFrom:[{session:'A',taskId:'post_l04_a_plan',label:'A · 我的旅行计划'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'使用三个句框，各完成 1 句话。'},{label:'标准层 / Core',instruction:'写 3—4 句话，并使用“跟……一样/不一样”或“除了……以外，还……”。'},{label:'挑战层 / Challenge',instruction:'写 5 句话，比较两家宾馆并解释自己的选择。'}]},
      {id:'post_l04_b_share',type:'showcase_plan',taskLabel:'课堂展示',projectStage:'下一次课 · Presentation Preparation',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Travel Plan',prompt_en:'Prepare the materials and answers below before class.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring 1–3 photos or screenshots showing your transport, hotel or luggage.','Answer four questions: How will you travel? When will you leave? Why did you choose this hotel? What will you bring?','Speak for 1–2 minutes.','You may work in a small group, but every student must explain part of the plan.'],classroomNote:'Complete the speaking task in class. You do not need to upload an audio recording.'}
    ],
    C:[
      {id:'post_l04_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'旅行档案 3/3 · 想象到达过程',required:true,prompt_cn:'旅行当天如果飞机晚点了，你会怎么联系司机？到了宾馆以后，你最关心房间的哪些方面？',prompt_en:'If your flight is delayed, what will you say to the driver? After arriving at the hotel, what matters most to you about the room?',answerPlaceholder:'飞机晚点了，我会说……\n到了宾馆以后，我最关心……',needsTeacherReview:true,openEnded:true},
      {id:'post_l04_c_final',type:'portfolio_final',taskLabel:'最终绘本',projectStage:'课堂大作业 · 四格绘本讲述',required:true,prompt_cn:'整合旅行档案，在课堂完成四格绘本讲稿。每一格至少写一句话。',prompt_en:'Combine your travel file into a four-panel story in class. Write at least one sentence for each panel.',answerPlaceholder:'第1格：我们决定……\n第2格：飞机……，宾馆……\n第3格：飞机晚点了，司机……\n第4格：房间……，我觉得……',needsTeacherReview:true,openEnded:true,wordBank:['假期','草原','起飞','宾馆','司机','晚点','除了','一直','干净','满意'],picturePrompts:['1 决定目的地','2 预订和准备','3 机场接机','4 入住评价'],carryFrom:[{session:'A',taskId:'post_l04_a_plan',label:'A · 故事开头'},{session:'B',taskId:'post_l04_b_plan',label:'B · 故事中段'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'选择或补全 4 个句框，每幅图说 1 句话。'},{label:'标准层 / Core',instruction:'根据关键词独立讲 4—5 句话，使用至少一个本课语法结构。'},{label:'挑战层 / Challenge',instruction:'讲 5—6 句话，加入连接词、比较和个人评价。'}]},
      {id:'post_l04_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · Final Presentation',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Travel Story',prompt_en:'Prepare the materials and answers below for the final in-class project.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring four pictures showing your destination, travel preparation, airport arrival and hotel.','Use your Homework A and B travel file to complete the four-panel story.','Answer: Where did you go and why? How did you prepare? What happened at the airport? What was the hotel like?','Speak for 1–2 minutes. You may work in a small group, but every student must speak.'],classroomNote:'Complete the final picture-book presentation in class. You do not need to upload an audio recording.'}
    ]}}
  ,report:{focus:['旅行词汇','完全否定','比较表达','除了结构'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做五步预习并朗读生词。'},{if:'inClass<0.7||postClass<0.7',then:'复习三个核心结构，再完成一次旅行叙述。'}]}
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log(`Wrote ${out}`);
