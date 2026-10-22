const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L12.json');
const img = name => 'images/hsk3-l12/' + name + '.png';
const roleFor = (index, total) => index < Math.floor(total * 0.5) ? 'lesson' : index < Math.floor(total * 0.8) ? 'transfer' : 'review';

const vocabRows = [
  ['街','jiē','名词','street','A','这条街上的树都开花了。','Zhè tiáo jiē shang de shù dōu kāihuā le.',['一条街','街上']],
  ['开花','kāihuā','动词','bloom','A','春天到了，公园里的花都开花了。','Chūntiān dào le, gōngyuán li de huā dōu kāihuā le.',['树开花','花开了']],
  ['公园','gōngyuán','名词','park','A','我们明天去公园坐船。','Wǒmen míngtiān qù gōngyuán zuò chuán.',['去公园','公园里']],
  ['船','chuán','名词','boat','A','湖边有几条小船。','Húbiān yǒu jǐ tiáo xiǎochuán.',['坐船','一条船']],
  ['工作日','gōngzuòrì','名词','weekday','A','今天是工作日，公园里的人不多。','Jīntiān shì gōngzuòrì, gōngyuán li de rén bù duō.',['工作日上午','不是工作日']],
  ['地方','dìfang','名词','place','A','下午有课，不能去太远的地方。','Xiàwǔ yǒu kè, bù néng qù tài yuǎn de dìfang.',['这个地方','远的地方']],
  ['刚才','gāngcái','名词','a moment ago; just now','B','刚才还是大晴天。','Gāngcái háishì dà qíngtiān.',['刚才说','刚才还']],
  ['刮','guā','动词','blow (of wind)','B','外面突然刮起风来了。','Wàimian tūrán guāqǐ fēng lái le.',['刮风','刮起风来']],
  ['风','fēng','名词','wind','B','今天下午风很大。','Jīntiān xiàwǔ fēng hěn dà.',['大风','风很大']],
  ['新闻','xīnwén','名词','news','B','新闻里说今天有雨。','Xīnwén li shuō jīntiān yǒu yǔ.',['看新闻','新闻里说']],
  ['伞','sǎn','名词','umbrella','B','我书包里常常放着一把伞。','Wǒ shūbāo li chángcháng fàngzhe yì bǎ sǎn.',['一把伞','带伞']],
  ['借','jiè','动词','lend; borrow','B','我可以把雨伞借给你。','Wǒ kěyǐ bǎ yǔsǎn jiè gěi nǐ.',['借给你','借一把伞']],
  ['把','bǎ','量词','measure word for handled objects','B','车里有一把伞。','Chē li yǒu yì bǎ sǎn.',['一把伞','一把椅子']],
  ['雨衣','yǔyī','名词','raincoat','B','下雨的时候可以穿雨衣。','Xià yǔ de shíhou kěyǐ chuān yǔyī.',['一件雨衣','穿雨衣']],
  ['变','biàn','动词','change','B','希望下午天气能变好。','Xīwàng xiàwǔ tiānqì néng biàn hǎo.',['变好','天气变了']],
  ['季节','jìjié','名词','season','B','这个季节天气变化很快。','Zhège jìjié tiānqì biànhuà hěn kuài.',['这个季节','喜欢的季节']],
  ['变化','biànhuà','动词/名词','change; variation','B','春天天气变化很快。','Chūntiān tiānqì biànhuà hěn kuài.',['天气变化','变化很快']],
  ['冬天','dōngtiān','名词','winter','C','这里的冬天很冷。','Zhèlǐ de dōngtiān hěn lěng.',['今年冬天','冬天很冷']],
  ['常常','chángcháng','副词','often','C','北京冬天常常下雪。','Běijīng dōngtiān chángcháng xià xuě.',['常常下雪','常常关注']],
  ['关注','guānzhù','动词','pay attention to','C','我每天关注天气变化。','Wǒ měitiān guānzhù tiānqì biànhuà.',['关注天气','特别关注']],
  ['四季','sìjì','名词','four seasons','C','这个城市的四季很不一样。','Zhège chéngshì de sìjì hěn bù yíyàng.',['北京四季','一年四季']],
  ['春天','chūntiān','名词','spring','C','北京的春天不冷不热。','Běijīng de chūntiān bù lěng bú rè.',['春天来了','春天最舒服']],
  ['夏天','xiàtiān','名词','summer','C','夏天白天很热。','Xiàtiān báitiān hěn rè.',['今年夏天','夏天晚上']],
  ['凉快','liángkuai','形容词','comfortably cool','C','夏天晚上比较凉快。','Xiàtiān wǎnshang bǐjiào liángkuai.',['很凉快','比较凉快']],
  ['秋天','qiūtiān','名词','autumn','C','秋天的叶子很漂亮。','Qiūtiān de yèzi hěn piàoliang.',['北京秋天','秋天到了']],
  ['叶子','yèzi','名词','leaf','C','树上的叶子变成了黄色。','Shù shang de yèzi biànchéng le huángsè.',['树叶子','红色叶子']],
  ['变成','biànchéng','动词','become; turn into','C','秋天，叶子变成红色和黄色。','Qiūtiān, yèzi biànchéng hóngsè hé huángsè.',['变成红色','变成朋友']]
];

const vocabulary = vocabRows.map((row, index) => ({
  id:'v12_' + String(index + 1).padStart(2, '0'), hanzi:row[0], pinyin:row[1], pos:row[2], english:row[3],
  tags:[row[4]], example:row[5], examplePinyin:row[6], phrases:row[7], sourceType:'textbook'
}));
const word = hanzi => vocabulary.find(item => item.hanzi === hanzi);
const card = hanzi => { const item = word(hanzi); return {hanzi:item.hanzi,pinyin:item.pinyin,english:item.english,example:item.example,examplePinyin:item.examplePinyin}; };
const extension = (hanzi,pinyin,english,phrases,example,examplePinyin) => ({hanzi,pinyin,english,phrases,example,examplePinyin,sourceType:'teaching_extension'});

const texts = [
  {id:'t_hsk3_l12_01',textId:1,title:'春日公园计划',setting:'在街上，王一飞和白家月边走边聊。',audio:'../../audio/HSK3/12-1.mp3',lines:[
    {speaker:'白家月',hanzi:'王老师，您看，这条街上的树都开花了。',pinyin:'Wáng lǎoshī, nín kàn, zhè tiáo jiē shang de shù dōu kāihuā le.',english:'Ms. Wang, look! The trees on this street are all in bloom.'},
    {speaker:'王一飞',hanzi:'上周我去公园坐船了，公园里的花也开了。',pinyin:'Shàng zhōu wǒ qù gōngyuán zuò chuán le, gōngyuán li de huā yě kāi le.',english:'I went boating in the park last week, and the flowers in the park have bloomed too.'},
    {speaker:'白家月',hanzi:'天气这么好，下午我也想去公园坐船。',pinyin:'Tiānqì zhème hǎo, xiàwǔ wǒ yě xiǎng qù gōngyuán zuò chuán.',english:"The weather is so nice; I'd also like to go boating in the park this afternoon."},
    {speaker:'王一飞',hanzi:'去吧！今天是工作日，人应该不多。',pinyin:'Qù ba! Jīntiān shì gōngzuòrì, rén yīnggāi bù duō.',english:"Go ahead! Today is a weekday, so there shouldn't be too many people."},
    {speaker:'白家月',hanzi:'您有时间吗？我想跟您一起去。',pinyin:'Nín yǒu shíjiān ma? Wǒ xiǎng gēn nín yìqǐ qù.',english:"Do you have time? I'd like to go with you."},
    {speaker:'王一飞',hanzi:'我今天下午有课，不能去太远的地方。',pinyin:'Wǒ jīntiān xiàwǔ yǒu kè, bù néng qù tài yuǎn de dìfang.',english:"I have classes this afternoon, so I can't go anywhere too far."},
    {speaker:'白家月',hanzi:'那咱们换一天去？',pinyin:'Nà zánmen huàn yì tiān qù?',english:'Then shall we go another day?'},
    {speaker:'王一飞',hanzi:'行。或者明天去，或者后天去，我给你打电话。',pinyin:'Xíng. Huòzhě míngtiān qù, huòzhě hòutiān qù, wǒ gěi nǐ dǎ diànhuà.',english:"Sure. Either tomorrow or the day after tomorrow—I'll call you."}
  ]},
  {id:'t_hsk3_l12_02',textId:2,title:'突然变化的天气',setting:'在街上，王一飞和白家月一起散步。',audio:'../../audio/HSK3/12-3.mp3',lines:[
    {speaker:'白家月',hanzi:'刚才还是大晴天呢，怎么突然就刮起风来了？',pinyin:'Gāngcái háishì dà qíngtiān ne, zěnme tūrán jiù guāqǐ fēng lái le?',english:'It was broad daylight and sunny just now; why did it suddenly get windy?'},
    {speaker:'王一飞',hanzi:'好像新闻里说今天有雨。',pinyin:'Hǎoxiàng xīnwén li shuō jīntiān yǒu yǔ.',english:'It seems the news said there would be rain today.'},
    {speaker:'白家月',hanzi:'啊？我每天书包里都放着雨伞，就今天没带。',pinyin:'À? Wǒ měitiān shūbāo li dōu fàngzhe yǔsǎn, jiù jīntiān méi dài.',english:"Huh? I keep an umbrella in my bag every day, except today I didn't bring it."},
    {speaker:'王一飞',hanzi:'我可以借给你，我车里有一把伞和一件雨衣。',pinyin:'Wǒ kěyǐ jiè gěi nǐ, wǒ chē li yǒu yì bǎ sǎn hé yí jiàn yǔyī.',english:'I can lend you mine; I have an umbrella and a raincoat in my car.'},
    {speaker:'白家月',hanzi:'谢谢，希望下午天气能变好。',pinyin:'Xièxie, xīwàng xiàwǔ tiānqì néng biàn hǎo.',english:'Thank you, I hope the weather turns better this afternoon.'},
    {speaker:'王一飞',hanzi:'这个季节天气变化很快。',pinyin:'Zhège jìjié tiānqì biànhuà hěn kuài.',english:'The weather changes very quickly in this season.'},
    {speaker:'白家月',hanzi:'雨已经下起来了，咱们快点儿走吧。',pinyin:'Yǔ yǐjīng xiàqǐlai le, zánmen kuài diǎnr zǒu ba.',english:"The rain has started to fall, let's hurry up."}
  ]},
  {id:'t_hsk3_l12_03',textId:3,title:'习惯这里的天气',setting:'在教室里，王一飞和白家月躲雨。',audio:'../../audio/HSK3/12-5.mp3',editorialNote:'教材拼音中的 jīntiān / jīntián 疑似应为 jīnnián；正式数据按教材文本保留并标记待核。',lines:[
    {speaker:'白家月',hanzi:'您来这里已经一年多了，习惯了吧？',pinyin:'Nín lái zhèlǐ yǐjīng yì nián duō le, xíguàn le ba?',english:"You've been here for over a year, you must be used to it by now?"},
    {speaker:'王一飞',hanzi:'别的早就习惯了，就是天气我还不太习惯。',pinyin:'Biéde zǎojiù xíguàn le, jiù shì tiānqì wǒ hái bú tài xíguàn.',english:"I got used to everything else long ago, except I'm still not quite used to the weather."},
    {speaker:'白家月',hanzi:'为什么？您不喜欢这里的天气吗？',pinyin:'Wèishénme? Nín bù xǐhuan zhèlǐ de tiānqì ma?',english:"Why? Don't you like the weather here?"},
    {speaker:'王一飞',hanzi:'我觉得冬天太冷了。',pinyin:'Wǒ juéde dōngtiān tài lěng le.',english:'I think winter is too cold.'},
    {speaker:'白家月',hanzi:'冬天虽然冷，但是下雪的时候特别漂亮。',pinyin:'Dōngtiān suīrán lěng, dànshì xià xuě de shíhou tèbié piàoliang.',english:"Although winter is cold, it's particularly beautiful when it snows."},
    {speaker:'王一飞',hanzi:'我也喜欢雪。北京常常下雪，但听说今年就下了一次。',pinyin:'Wǒ yě xǐhuan xuě. Běijīng chángcháng xià xuě, dàn tīngshuō jīntiān jiù xiàle yí cì.',english:'I like snow too. It often snows in Beijing, but I heard it only snowed once this year.'},
    {speaker:'白家月',hanzi:'我没关注过北京的天气，但是新闻里说过，今年冬天很多地方雪下得都少了。',pinyin:'Wǒ méi guānzhù guo Běijīng de tiānqì, dànshì xīnwén li shuōguo, jīntián dōngtiān hěn duō dìfang xuě xià de dōu shǎo le.',english:"I haven't paid attention to the weather in Beijing, but the news mentioned that it snowed less in many places this winter."}
  ]},
  {id:'t_hsk3_l12_04',textId:4,title:'北京四季日记',format:'diary',genre:'日记',genreEn:'Diary',author:'王一飞',dateLabel:'在这里工作一年多以后',setting:'在家里，王一飞在写日记。',audio:'../../audio/HSK3/12-7.mp3',translationPolicy:'中文和拼音为教材原文；英文译文、日记标题和生活讨论为教学辅助。教材注释“不大多小”按原样记录为待核问题，不写入正式语法。',lines:[
    {speaker:'王一飞',hanzi:'我离开北京到这里工作一年多了。这一年多住下来，我还是更喜欢北京的四季。北京的春天最舒服，天气不冷不热。夏天白天很热，但是晚上比较凉快。秋天树上的叶子都变成了红色、黄色，非常漂亮。冬天不但冷，而且风很大，我不喜欢冬天。每个人都有自己最喜欢的季节，你最喜欢哪个季节呢？',pinyin:'Wǒ líkāi Běijīng dào zhèlǐ gōngzuò yì nián duō le. Zhè yì nián duō zhù xiàlai, wǒ háishì gèng xǐhuan Běijīng de sìjì. Běijīng de chūntiān zuì shūfu, tiānqì bù lěng bú rè. Xiàtiān báitiān hěn rè, dànshì wǎnshang bǐjiào liángkuai. Qiūtiān shù shang de yèzi dōu biànchéng le hóngsè, huángsè, fēicháng piàoliang. Dōngtiān búdàn lěng, érqiě fēng hěn dà, wǒ bù xǐhuan dōngtiān. Měi gè rén dōu yǒu zìjǐ zuì xǐhuan de jìjié, nǐ zuì xǐhuan nǎge jìjié ne?',english:"I left Beijing and came here to work more than a year ago. After living here for over a year, I still prefer Beijing's four seasons. Spring in Beijing is the most comfortable—not cold and not hot. Summer days are hot, but evenings are cooler. In autumn, the leaves turn red and yellow and are very beautiful. Winter is not only cold but also very windy, so I do not like it. Everyone has a favorite season. Which season do you like best?"}
  ]}
];

const grammar = [
  {id:'g12_01',title:'选择复句“或者……，或者……”',titleEn:'Alternative complex sentence 或者……，或者……',scene:'Observe how each 或者 introduces one possible plan.',structure:'或者 + 方案一，或者 + 方案二（，后续行动）',explanation:'重复使用“或者”列出两个或多个可能选择。它与选择问句“还是”有关，但这里是在陈述备选方案。',examples:[
    ['或者明天去，或者后天去，我给你打电话。','Huòzhě míngtiān qù, huòzhě hòutiān qù, wǒ gěi nǐ dǎ diànhuà.','Either we go tomorrow or the day after tomorrow; I will call you.'],
    ['周末我们或者去公园，或者去湖边。','Zhōumò wǒmen huòzhě qù gōngyuán, huòzhě qù húbiān.','At the weekend we can go either to the park or to the lakeside.'],
    ['下午或者坐船，或者在街上看花。','Xiàwǔ huòzhě zuò chuán, huòzhě zài jiē shang kàn huā.','In the afternoon, either go boating or look at flowers on the street.'],
    ['晚饭或者吃中国菜，或者吃日本菜，或者吃泰国菜。','Wǎnfàn huòzhě chī Zhōngguó cài, huòzhě chī Rìběn cài, huòzhě chī Tàiguó cài.','For dinner, choose Chinese, Japanese or Thai food.'],
    ['或者带伞，或者穿雨衣，选好以后我们就出发。','Huòzhě dài sǎn, huòzhě chuān yǔyī, xuǎn hǎo yǐhòu wǒmen jiù chūfā.','Either bring an umbrella or wear a raincoat; after choosing, we will leave.']
  ].map(([hanzi,pinyin,english])=>({hanzi,pinyin,english}))},
  {id:'g12_02',title:'“起来”的引申用法',titleEn:'Extended use of 起来',scene:'Notice the moment an action starts or a new state begins.',structure:'动词 + 起来；动词 + 起 + 宾语 + 来',explanation:'“起来”表示动作开始或进入新状态，不表示实际向上移动。动词有宾语时，宾语常放在“起”和“来”之间。',examples:[
    ['怎么突然刮起风来了？','Zěnme tūrán guāqǐ fēng lái le?','Why did it suddenly start to get windy?'],
    ['雨已经下起来了，咱们快点儿走吧。','Yǔ yǐjīng xiàqǐlai le, zánmen kuài diǎnr zǒu ba.','It has started raining; let us hurry.'],
    ['看到春天的花，大家都笑了起来。','Kàndào chūntiān de huā, dàjiā dōu xiào le qǐlai.','Everyone started smiling when they saw the spring flowers.'],
    ['音乐一响，学生们就唱起歌来。','Yīnyuè yì xiǎng, xuéshengmen jiù chàngqǐ gē lái.','When the music began, the students started singing.'],
    ['四月以后，公园里慢慢热闹起来。','Sì yuè yǐhòu, gōngyuán li mànmàn rènao qǐlai.','After April, the park gradually becomes lively.']
  ].map(([hanzi,pinyin,english])=>({hanzi,pinyin,english}))},
  {id:'g12_03',title:'范围副词“就”',titleEn:'Adverb of scope 就',scene:'First decide whether 就 highlights a small amount or points out an exception.',structure:'少：就 + 数量；例外：都……，就 + 例外',explanation:'本课只观察两种用法：强调数量少、时间短或程度轻；在一组情况中指出例外。',examples:[
    ['北京常常下雪，但听说今年就下了一次。','Běijīng chángcháng xià xuě, dàn tīngshuō jīnnián jiù xiàle yí cì.','It often snows in Beijing, but this year it snowed only once.'],
    ['他昨天就看了十分钟书。','Tā zuótiān jiù kàn le shí fēnzhōng shū.','He read for only ten minutes yesterday.'],
    ['我们在公园就坐了半个小时。','Wǒmen zài gōngyuán jiù zuò le bàn ge xiǎoshí.','We stayed in the park for only half an hour.'],
    ['我每天书包里都放着雨伞，就今天没带。','Wǒ měitiān shūbāo li dōu fàngzhe yǔsǎn, jiù jīntiān méi dài.','I carry an umbrella every day, except today.'],
    ['大家都习惯这里的天气了，就王老师还不太习惯。','Dàjiā dōu xíguàn zhèlǐ de tiānqì le, jiù Wáng lǎoshī hái bú tài xíguàn.','Everyone is used to the weather here except Ms. Wang.']
  ].map(([hanzi,pinyin,english])=>({hanzi,pinyin,english}))},
  {id:'g12_04',title:'“下来”的引申用法',titleEn:'Extended use of 下来',scene:'Look back after a long or difficult activity and describe the completed experience.',structure:'一段时间 / 一项任务 + 动词 + 下来',explanation:'“下来”表示经过一段时间、付出努力或克服困难后完成、坚持或形成结果，不是实际向下移动。',examples:[
    ['这一年多住下来，我还是更喜欢北京的四季。','Zhè yì nián duō zhù xiàlai, wǒ háishì gèng xǐhuan Běijīng de sìjì.','After living here for over a year, I still prefer Beijing’s four seasons.'],
    ['一天走下来，我们看了很多开花的树。','Yì tiān zǒu xiàlai, wǒmen kàn le hěn duō kāihuā de shù.','After walking all day, we saw many flowering trees.'],
    ['这本书看下来，我最喜欢最后一个故事。','Zhè běn shū kàn xiàlai, wǒ zuì xǐhuan zuìhòu yí gè gùshi.','After finishing this book, I liked the last story best.'],
    ['这个小组任务做下来，大家学会了互相帮助。','Zhège xiǎozǔ rènwu zuò xiàlai, dàjiā xuéhuì le hùxiāng bāngzhù.','After completing the group task, everyone learned to help each other.'],
    ['五千米的长跑很累，但是我坚持跑下来了。','Wǔ qiānmǐ de chángpǎo hěn lèi, dànshì wǒ jiānchí pǎo xiàlai le.','The 5,000-metre run was tiring, but I managed to finish it.']
  ].map(([hanzi,pinyin,english])=>({hanzi,pinyin,english}))}
];

const grammarTeachingNotes = {
  g12_01:{scene:'先观察五个完整句子：每个“或者”后面分别是什么方案？',structure:'或者 + 方案一，或者 + 方案二（，后续行动）',structureEn:'either option 1, or option 2, followed by the next action',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'逐行找出每个“或者”引出的方案，并注意最后一句怎样继续行动。',observeHighlights:[['或者','或者'],['或者','或者'],['或者','或者'],['或者','或者','或者'],['或者','或者','以后']],visualLearning:{leadExamples:[{english:'State two possible dates.',hanzi:'或者明天去，或者后天去。',pinyin:'Huòzhě míngtiān qù, huòzhě hòutiān qù.'}],blocks:['或者 + 方案一','或者 + 方案二','后续行动'],blockLabelsEn:['option 1','option 2','what happens next']},oralQuestions:[
    {question:'周末你或者去哪儿，或者去哪儿？',pinyin:'Zhōumò nǐ huòzhě qù nǎr, huòzhě qù nǎr?'},
    {question:'明天晚上你或者学习，或者做什么？',pinyin:'Míngtiān wǎnshang nǐ huòzhě xuéxí, huòzhě zuò shénme?'},
    {question:'下雨的时候，你或者带伞，或者带什么？',pinyin:'Xià yǔ de shíhou, nǐ huòzhě dài sǎn, huòzhě dài shénme?'},
    {question:'你会怎样安排两个可选日期？',pinyin:'Nǐ huì zěnyàng ānpái liǎng ge kěxuǎn rìqī?'}
  ],structureVariants:[{label:'两个选择',formula:'或者 A，或者 B',formulaEn:'two alternatives',explanation:'每个“或者”引出一个方案。',example:'或者明天去，或者后天去。',examplePinyin:'Huòzhě míngtiān qù, huòzhě hòutiān qù.'},{label:'三个选择',formula:'或者 A，或者 B，或者 C',formulaEn:'three alternatives',explanation:'可以列出三个可能方案。',example:'或者坐船，或者散步，或者看花。',examplePinyin:'Huòzhě zuò chuán, huòzhě sànbù, huòzhě kàn huā.'}],followUp:[{image:img('photo-text-1-park-boat'),promptEn:'Your group must choose a date and one park activity.',target:'用两个“或者”列出日期或活动，最后说明下一步。',sampleAnswer:'或者明天去，或者后天去，选好以后我给你打电话。'}]},
  g12_02:{scene:'观察动作开始的瞬间：风、雨、笑声、歌声或热闹的状态怎样出现？',structure:'动词 + 起来；动词 + 起 + 宾语 + 来',structureEn:'verb + 起来; verb + 起 + object + 来',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'先找动作或状态，再判断它是不是刚开始。',observeHighlights:[['刮起风来'],['下起来'],['笑了起来'],['唱起歌来'],['热闹起来']],visualLearning:{leadExamples:[{english:'The wind starts.',hanzi:'刮起风来',pinyin:'guāqǐ fēng lái'},{english:'The rain starts.',hanzi:'下起雨来',pinyin:'xiàqǐ yǔ lái'}],blocks:['动作','起来','起 + 宾语 + 来'],blockLabelsEn:['action','starts','object inside the complement']},oralQuestions:[
    {question:'上课的时候，大家什么时候笑起来？',pinyin:'Shàngkè de shíhou, dàjiā shénme shíhou xiào qǐlai?'},
    {question:'你看到下起雨来，会先做什么？',pinyin:'Nǐ kàndào xiàqǐ yǔ lái, huì xiān zuò shénme?'},
    {question:'什么音乐一响，你会唱起来？',pinyin:'Shénme yīnyuè yì xiǎng, nǐ huì chàng qǐlai?'},
    {question:'春天到了，你的校园哪里会热闹起来？',pinyin:'Chūntiān dào le, nǐ de xiàoyuán nǎli huì rènao qǐlai?'}
  ],structureVariants:[{label:'没有宾语',formula:'动词 / 形容词 + 起来',formulaEn:'verb or adjective + 起来',explanation:'表示动作或新状态开始。',example:'大家笑起来了。',examplePinyin:'Dàjiā xiào qǐlai le.'},{label:'有宾语',formula:'动词 + 起 + 宾语 + 来',formulaEn:'verb + 起 + object + 来',explanation:'宾语放在“起”和“来”中间。',example:'外面下起雨来了。',examplePinyin:'Wàimian xiàqǐ yǔ lái le.'}],followUp:[{image:img('photo-text-2-wind-starts'),promptEn:'The sunny weather suddenly changes.',target:'用“起来”说明先开始刮风，后来开始下雨。',sampleAnswer:'刚才还是晴天，后来刮起风来，又下起雨来了。'}]},
  g12_03:{scene:'先给五行句子贴标签：是在强调“少”，还是指出“例外”？',structure:'少：就 + 数量；例外：都……，就 + 例外',structureEn:'small amount: 就 + quantity; exception: 都..., 就 + exception',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'每行先判断“少”或“例外”，不要把“就”的其他用法混进来。',observeHighlights:[['就','一次'],['就','十分钟'],['就','半个小时'],['都','就今天'],['都','就王老师']],visualLearning:{leadExamples:[{english:'Only once: a small amount.',hanzi:'今年就下了一次雪。',pinyin:'Jīnnián jiù xiàle yí cì xuě.'},{english:'Everyone except today.',hanzi:'每天都带伞，就今天没带。',pinyin:'Měitiān dōu dài sǎn, jiù jīntiān méi dài.'}],blocks:['就 + 数量','都……','就 + 例外'],blockLabelsEn:['small amount','the general group','the exception']},oralQuestions:[
    {question:'你昨天就学习了多长时间？',pinyin:'Nǐ zuótiān jiù xuéxí le duō cháng shíjiān?'},
    {question:'这个月你就去过几次公园？',pinyin:'Zhège yuè nǐ jiù qùguo jǐ cì gōngyuán?'},
    {question:'大家都喜欢哪个季节？谁是例外？',pinyin:'Dàjiā dōu xǐhuan nǎge jìjié? Shéi shì lìwài?'},
    {question:'你每天都带什么，就今天没带？',pinyin:'Nǐ měitiān dōu dài shénme, jiù jīntiān méi dài?'}
  ],structureVariants:[{label:'数量少',formula:'就 + 数量短语',formulaEn:'only + amount',explanation:'说话人觉得数量少、时间短或程度轻。',example:'我就等了五分钟。',examplePinyin:'Wǒ jiù děng le wǔ fēnzhōng.'},{label:'指出例外',formula:'都……，就 + 例外',formulaEn:'all..., except...',explanation:'先说一般情况，再指出一个不同情况。',example:'大家都到了，就小李还没来。',examplePinyin:'Dàjiā dōu dào le, jiù Xiǎo Lǐ hái méi lái.'}],followUp:[{image:img('photo-text-3-winter-window'),promptEn:'Compare the usual winter with this year.',target:'先说一个数量少的情况，再说一个例外。',sampleAnswer:'今年就下了一次雪。大家都觉得雪很漂亮，就王老师觉得冬天太冷。'}]},
  g12_04:{scene:'从活动结束以后回头看：经过时间或困难，什么完成了，什么感受留下来了？',structure:'一段时间 / 一项任务 + 动词 + 下来',structureEn:'after carrying an activity through over time',presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',observePrompt:'每行找出时间或困难，再说明最后完成了什么或形成了什么感受。',observeHighlights:[['一年多','住下来'],['一天','走下来'],['一本书','看下来'],['任务','做下来'],['长跑','跑下来']],visualLearning:{leadExamples:[{english:'After living somewhere for a long period.',hanzi:'这一年多住下来……',pinyin:'Zhè yì nián duō zhù xiàlai...'},{english:'Not physical downward movement.',hanzi:'坚持跑下来了。',pinyin:'Jiānchí pǎo xiàlai le.'}],blocks:['时间 / 困难','动词','下来','结果 / 感受'],blockLabelsEn:['time or difficulty','action','carried through','result']},oralQuestions:[
    {question:'这一学期学下来，你最大的变化是什么？',pinyin:'Zhè yì xuéqī xué xiàlai, nǐ zuì dà de biànhuà shì shénme?'},
    {question:'在这个城市住下来，你最喜欢什么？',pinyin:'Zài zhège chéngshì zhù xiàlai, nǐ zuì xǐhuan shénme?'},
    {question:'一次长时间活动做下来，你觉得哪里最难？',pinyin:'Yí cì cháng shíjiān huódòng zuò xiàlai, nǐ juéde nǎli zuì nán?'},
    {question:'小组项目完成下来，大家学会了什么？',pinyin:'Xiǎozǔ xiàngmù wánchéng xiàlai, dàjiā xuéhuì le shénme?'}
  ],structureVariants:[{label:'引申义',formula:'动词 + 下来 → 完成 / 坚持 / 形成结果',formulaEn:'carry through to a result',explanation:'强调经过时间或困难后的结果。',example:'这一学期学下来，我会说更多中文了。',examplePinyin:'Zhè yì xuéqī xué xiàlai, wǒ huì shuō gèng duō Zhōngwén le.'},{label:'方向义对比',formula:'走下来 / 拿下来',formulaEn:'physical downward direction',explanation:'实际方向意义只作简短对比。',example:'他从楼上走下来了。',examplePinyin:'Tā cóng lóushàng zǒu xiàlai le.'}],followUp:[{image:img('photo-text-4-autumn-diary'),promptEn:'Look back on one semester or one year in a place.',target:'用“下来”总结经过一段时间后的真实感受。',sampleAnswer:'这一学期学下来，我更敢用中文跟别人说话了。'}]}
};

const makeQuestions = rows => rows.map(item => ({question:item[0],question_pinyin:item[1],answer:item[2],answer_pinyin:item[3]}));
const textTeachingNotes = {
  t_hsk3_l12_01:{presentationMode:'listen_first_progressive',listenPrompt:'先看街道和公园的春日景物，再听两人为什么不能今天一起去。',preReadingQuestions:[{question:'春天的街上和公园里，你常常看到什么？',pinyin:'Chūntiān de jiē shang hé gōngyuán li, nǐ chángcháng kàndào shénme?'},{question:'工作日去公园可能有什么好处？',pinyin:'Gōngzuòrì qù gōngyuán kěnéng yǒu shénme hǎochu?'},{question:'朋友今天没时间，你会怎样换日期？',pinyin:'Péngyou jīntiān méi shíjiān, nǐ huì zěnyàng huàn rìqī?'}],classQuestions:makeQuestions([
    ['街上的什么开花了？','Jiē shang de shénme kāihuā le?','街上的树都开花了。','Jiē shang de shù dōu kāihuā le.'],
    ['白家月为什么想去公园？','Bái Jiāyuè wèishénme xiǎng qù gōngyuán?','因为天气很好，她想去坐船。','Yīnwèi tiānqì hěn hǎo, tā xiǎng qù zuò chuán.'],
    ['王一飞为什么不能去太远的地方？','Wáng Yīfēi wèishénme bù néng qù tài yuǎn de dìfang?','因为她今天下午有课。','Yīnwèi tā jīntiān xiàwǔ yǒu kè.'],
    ['两人最后怎样安排日期？','Liǎng rén zuìhòu zěnyàng ānpái rìqī?','或者明天去，或者后天去，王一飞再打电话。','Huòzhě míngtiān qù, huòzhě hòutiān qù, Wáng Yīfēi zài dǎ diànhuà.']
  ]),keyPoints:[{hanzi:'街上的树都开花了',pinyin:'Jiē shang de shù dōu kāihuā le.',note:'“都”说明整条街上看到的树有共同变化。'},{hanzi:'今天是工作日，人应该不多',pinyin:'Jīntiān shì gōngzuòrì, rén yīnggāi bù duō.',note:'根据日期推测公园人数。'},{hanzi:'或者明天去，或者后天去',pinyin:'Huòzhě míngtiān qù, huòzhě hòutiān qù.',note:'列出两个可选日期，不等同于用“还是”直接提问。'}],cultureDiscussion:{title:'春日户外活动',titleEn:'Spring Outdoor Plans',questions:[{hanzi:'你所在的城市春天有哪些花或树？',pinyin:'Nǐ suǒzài de chéngshì chūntiān yǒu nǎxiē huā huò shù?'},{hanzi:'你会选择工作日还是周末去公园？为什么？',pinyin:'Nǐ huì xuǎnzé gōngzuòrì háishì zhōumò qù gōngyuán? Wèishénme?'}],wordCards:[card('街'),card('公园'),card('工作日')],background:'Different cities have different spring weather and park activities. Students may describe China, their home country, city or campus.',sampleAnswers:[{hanzi:'我会选择工作日去，因为人不多。',pinyin:'Wǒ huì xuǎnzé gōngzuòrì qù, yīnwèi rén bù duō.'},{hanzi:'我们校园春天有很多树开花。',pinyin:'Wǒmen xiàoyuán chūntiān yǒu hěn duō shù kāihuā.'}]},retellScaffold:{nodes:[{label:'街上',hint:'树都开花了'},{label:'公园',hint:'花开了、可以坐船'},{label:'今天',hint:'工作日、人不多'},{label:'困难',hint:'王老师下午有课'},{label:'新计划',hint:'明天或者后天'}],frame:'春天到了，街上……。白家月想……，但是王一飞……。最后她们决定或者……，或者……。'}},
  t_hsk3_l12_02:{presentationMode:'listen_first_progressive',listenPrompt:'先判断天气怎样变化、谁没有带伞，以及王一飞可以借出什么。',preReadingQuestions:[{question:'晴天突然变成下雨天时，你先注意到什么？',pinyin:'Qíngtiān tūrán biànchéng xiàyǔtiān shí, nǐ xiān zhùyì dào shénme?'},{question:'你平时会在书包里放雨伞吗？',pinyin:'Nǐ píngshí huì zài shūbāo li fàng yǔsǎn ma?'},{question:'朋友没带雨具时，你可以怎样帮助？',pinyin:'Péngyou méi dài yǔjù shí, nǐ kěyǐ zěnyàng bāngzhù?'}],classQuestions:makeQuestions([
    ['天气怎样从晴天发生变化？','Tiānqì zěnyàng cóng qíngtiān fāshēng biànhuà?','先刮起风来，后来雨也下起来了。','Xiān guāqǐ fēng lái, hòulái yǔ yě xià qǐlai le.'],
    ['白家月平时带什么？今天为什么是例外？','Bái Jiāyuè píngshí dài shénme? Jīntiān wèishénme shì lìwài?','她平时带雨伞，就今天没带。','Tā píngshí dài yǔsǎn, jiù jīntiān méi dài.'],
    ['王一飞可以借给她什么？','Wáng Yīfēi kěyǐ jiè gěi tā shénme?','一把伞或者一件雨衣。','Yì bǎ sǎn huòzhě yí jiàn yǔyī.'],
    ['“刮起风来”和“下起来”说明什么？','“Guāqǐ fēng lái” hé “xià qǐlai” shuōmíng shénme?','说明风和雨开始了。','Shuōmíng fēng hé yǔ kāishǐ le.']
  ]),keyPoints:[{hanzi:'刮起风来',pinyin:'Guāqǐ fēng lái.',note:'风开始刮；“风”在“起”和“来”中间。'},{hanzi:'就今天没带',pinyin:'Jiù jīntiān méi dài.',note:'“就”指出今天是每天之中的例外。'},{hanzi:'我可以借给你',pinyin:'Wǒ kěyǐ jiè gěi nǐ.',note:'王一飞把自己的东西借给白家月，不是从她那里借入。'},{hanzi:'一把伞',pinyin:'Yì bǎ sǎn.',note:'这里“把”是量词，不是新的把字句。'}],cultureDiscussion:{title:'天气变化与互相帮助',titleEn:'Weather Changes and Helping Others',questions:[{hanzi:'你看天气新闻还是直接看天空？',pinyin:'Nǐ kàn tiānqì xīnwén háishì zhíjiē kàn tiānkōng?'},{hanzi:'你的城市哪个季节天气变化快？',pinyin:'Nǐ de chéngshì nǎge jìjié tiānqì biànhuà kuài?'}],wordCards:[card('新闻'),card('伞'),card('雨衣')],background:'Weather habits differ by place. Use privacy-safe, everyday examples instead of severe-weather stories.',sampleAnswers:[{hanzi:'我常常先看手机上的天气信息。',pinyin:'Wǒ chángcháng xiān kàn shǒujī shang de tiānqì xìnxī.'},{hanzi:'我家乡春天天气变化很快。',pinyin:'Wǒ jiāxiāng chūntiān tiānqì biànhuà hěn kuài.'}]},retellScaffold:{nodes:[{label:'刚才',hint:'大晴天'},{label:'变化一',hint:'刮起风来'},{label:'例外',hint:'就今天没带伞'},{label:'帮助',hint:'借一把伞或一件雨衣'},{label:'变化二',hint:'雨下起来'}],frame:'刚才还是……，后来突然……。白家月平时……，就今天……。王一飞可以借给她……。最后……。'}},
  t_hsk3_l12_03:{presentationMode:'listen_first_progressive',listenPrompt:'先听王一飞住了多久、仍不习惯什么，以及两人怎样评价冬天和雪。',preReadingQuestions:[{question:'在一个地方住一年以后，你可能习惯什么？',pinyin:'Zài yí gè dìfang zhù yì nián yǐhòu, nǐ kěnéng xíguàn shénme?'},{question:'你觉得下雪漂亮还是生活方便更重要？',pinyin:'Nǐ juéde xià xuě piàoliang háishì shēnghuó fāngbiàn gèng zhòngyào?'}],classQuestions:makeQuestions([
    ['王一飞已经住了多久？','Wáng Yīfēi yǐjīng zhù le duō jiǔ?','已经一年多了。','Yǐjīng yì nián duō le.'],
    ['她对什么仍然不习惯？','Tā duì shénme réngrán bù xíguàn?','她对这里的天气还不太习惯。','Tā duì zhèlǐ de tiānqì hái bú tài xíguàn.'],
    ['白家月怎样看待冬天和雪？','Bái Jiāyuè zěnyàng kàndài dōngtiān hé xuě?','冬天虽然冷，但是下雪的时候特别漂亮。','Dōngtiān suīrán lěng, dànshì xià xuě de shíhou tèbié piàoliang.'],
    ['“今年就下了一次”为什么强调数量少？','“Jīnnián jiù xiàle yí cì” wèishénme qiángdiào shùliàng shǎo?','因为北京常常下雪，一次比平时少。','Yīnwèi Běijīng chángcháng xià xuě, yí cì bǐ píngshí shǎo.']
  ]),keyPoints:[{hanzi:'就是天气我还不太习惯',pinyin:'Jiù shì tiānqì wǒ hái bú tài xíguàn.',note:'别的已经习惯，天气是留下的问题。'},{hanzi:'虽然冷，但是……漂亮',pinyin:'Suīrán lěng, dànshì... piàoliang.',note:'同时表达冬天的困难和雪景的优点。'},{hanzi:'今年就下了一次',pinyin:'Jīnnián jiù xiàle yí cì.',note:'“就”放在数量前，强调说话人觉得次数少。'}],cultureDiscussion:{title:'习惯一个地方的天气',titleEn:'Getting Used to Local Weather',questions:[{hanzi:'你对这里哪个季节最习惯？',pinyin:'Nǐ duì zhèlǐ nǎge jìjié zuì xíguàn?'},{hanzi:'天气很冷但风景很美时，你会做什么？',pinyin:'Tiānqì hěn lěng dàn fēngjǐng hěn měi shí, nǐ huì zuò shénme?'}],wordCards:[card('冬天'),card('常常'),card('关注')],background:'Students may compare the local city, their home city, country or campus. Preferences are personal, not right or wrong.',sampleAnswers:[{hanzi:'我已经习惯这里的夏天了。',pinyin:'Wǒ yǐjīng xíguàn zhèlǐ de xiàtiān le.'},{hanzi:'冬天虽然冷，但是我喜欢看雪。',pinyin:'Dōngtiān suīrán lěng, dànshì wǒ xǐhuan kàn xuě.'}]},retellScaffold:{nodes:[{label:'时间',hint:'来这里一年多'},{label:'习惯',hint:'别的早就习惯'},{label:'问题',hint:'天气还不太习惯'},{label:'冬天',hint:'冷但是雪漂亮'},{label:'数量',hint:'今年就下一次'}],frame:'王一飞来这里……。她已经习惯……，但是……。白家月觉得冬天虽然……，但是……。北京常常……，今年却……。'}},
  t_hsk3_l12_04:{presentationMode:'listen_first_progressive',listenPrompt:'先读日记，找出春夏秋冬各自的特点，再判断王一飞最不喜欢哪个季节。',preReadingQuestions:[{question:'你会用哪两个词介绍家乡的四季？',pinyin:'Nǐ huì yòng nǎ liǎng ge cí jièshào jiāxiāng de sìjì?'},{question:'你最喜欢哪个季节？为什么？',pinyin:'Nǐ zuì xǐhuan nǎge jìjié? Wèishénme?'}],classQuestions:makeQuestions([
    ['王一飞怎样介绍北京的春天？','Wáng Yīfēi zěnyàng jièshào Běijīng de chūntiān?','春天最舒服，天气不冷不热。','Chūntiān zuì shūfu, tiānqì bù lěng bú rè.'],
    ['夏天和秋天各有什么特点？','Xiàtiān hé qiūtiān gè yǒu shénme tèdiǎn?','夏天晚上凉快，秋天叶子变成红色、黄色。','Xiàtiān wǎnshang liángkuai, qiūtiān yèzi biànchéng hóngsè, huángsè.'],
    ['“这一年多住下来”表达什么经验？','“Zhè yì nián duō zhù xiàlai” biǎodá shénme jīngyàn?','表示经过一年多居住后形成的感受。','Biǎoshì jīngguò yì nián duō jūzhù hòu xíngchéng de gǎnshòu.'],
    ['她最不喜欢哪个季节？为什么？','Tā zuì bù xǐhuan nǎge jìjié? Wèishénme?','她最不喜欢冬天，因为不但冷，而且风很大。','Tā zuì bù xǐhuan dōngtiān, yīnwèi búdàn lěng, érqiě fēng hěn dà.'],
    ['每个人都必须喜欢同一个季节吗？','Měi gè rén dōu bìxū xǐhuan tóng yí gè jìjié ma?','不，每个人可以有不同的季节偏好。','Bù, měi gè rén kěyǐ yǒu bùtóng de jìjié piānhào.']
  ]),keyPoints:[{hanzi:'这一年多住下来',pinyin:'Zhè yì nián duō zhù xiàlai.',note:'经过一段时间居住后回头总结体验。'},{hanzi:'不冷不热',pinyin:'Bù lěng bú rè.',note:'表示温度适中；作为重点语块，不新增正式语法点。'},{hanzi:'叶子都变成了红色、黄色',pinyin:'Yèzi dōu biànchéng le hóngsè, huángsè.',note:'“变成”说明变化后的结果。'},{hanzi:'不但冷，而且风很大',pinyin:'Búdàn lěng, érqiě fēng hěn dà.',note:'补充两个冬季特点。'}],cultureDiscussion:{title:'不同地方的四季',titleEn:'Four Seasons in Different Places',questions:[{hanzi:'你的国家、城市或校园四季有什么特点？',pinyin:'Nǐ de guójiā, chéngshì huò xiàoyuán sìjì yǒu shénme tèdiǎn?'},{hanzi:'你最喜欢的季节适合什么活动？',pinyin:'Nǐ zuì xǐhuan de jìjié shìhé shénme huódòng?'}],wordCards:[card('四季'),card('凉快'),card('变成')],background:'Some places have four clear seasons; others have wet, dry, hot or cool seasons. Students can use the pattern that fits their own place.',sampleAnswers:[{hanzi:'我的城市夏天很热，晚上比较凉快。',pinyin:'Wǒ de chéngshì xiàtiān hěn rè, wǎnshang bǐjiào liángkuai.'},{hanzi:'我最喜欢秋天，因为叶子很漂亮。',pinyin:'Wǒ zuì xǐhuan qiūtiān, yīnwèi yèzi hěn piàoliang.'}]},retellScaffold:{nodes:[{label:'经验',hint:'一年多住下来'},{label:'春天',hint:'舒服、不冷不热'},{label:'夏天',hint:'白天热、晚上凉快'},{label:'秋天',hint:'叶子变色'},{label:'冬天',hint:'冷、风大、不喜欢'},{label:'提问',hint:'你最喜欢哪个季节'}],frame:'这一年多住下来，王一飞……。北京的春天……，夏天……，秋天……，冬天……。她最不喜欢……，因为……。我最喜欢……。'}}
};

const sceneData = {
  1:{title:'春日景物与出行选择',subtitle:'从街上开花的树走到工作日的公园，安排新的出行日期。',steps:[
    {title:'春天街道上的花',talkHint:'找街道、开花的树和边走边聊的两个人。',prompt:'这条街在春天发生了什么变化？',promptPinyin:'Zhè tiáo jiē zài chūntiān fāshēng le shénme biànhuà?',promptEn:'What has changed on this street in spring?',image:img('photo-text-1-spring-street'),labels:[{word:'街',x:10,y:18,targetX:63,targetY:72},{word:'开花',x:88,y:18,targetX:72,targetY:12},{word:'地方',x:10,y:82,targetX:28,targetY:64}],words:['街','开花','地方'],sentence:'春天到了，这条街上的树都开花了。',sampleAnswers:[{hanzi:'街上的树都开花了。',pinyin:'Jiē shang de shù dōu kāihuā le.'},{hanzi:'王一飞和白家月边走边聊。',pinyin:'Wáng Yīfēi hé Bái Jiāyuè biān zǒu biān liáo.'},{hanzi:'这里是一个很舒服的地方。',pinyin:'Zhèlǐ shì yí gè hěn shūfu de dìfang.'}]},
    {title:'工作日的公园与小船',talkHint:'找公园、湖面和停在岸边的小船。',prompt:'她们今天能一起坐船吗？还可以选哪一天？',promptPinyin:'Tāmen jīntiān néng yìqǐ zuò chuán ma? Hái kěyǐ xuǎn nǎ yì tiān?',promptEn:'Can they go boating together today, and which other day can they choose?',image:img('photo-text-1-park-boat'),labels:[{word:'公园',x:10,y:18,targetX:76,targetY:27},{word:'船',x:88,y:20,targetX:80,targetY:74},{word:'工作日',x:10,y:82,targetX:52,targetY:48}],words:['公园','船','工作日',extension('换一天','huàn yì tiān','choose another day',['换时间','改天再去'],'今天没时间，我们换一天去。','Jīntiān méi shíjiān, wǒmen huàn yì tiān qù.')],sentence:'今天是工作日，人应该不多，但是王老师下午有课。',sampleAnswers:[{hanzi:'公园里的人不多。',pinyin:'Gōngyuán li de rén bù duō.'},{hanzi:'湖边有几条小船。',pinyin:'Húbiān yǒu jǐ tiáo xiǎochuán.'},{hanzi:'她们或者明天去，或者后天去。',pinyin:'Tāmen huòzhě míngtiān qù, huòzhě hòutiān qù.'}]}
  ]},
  2:{title:'天气突然变化与雨具',subtitle:'从晴天刮风到雨下起来，判断变化并互相帮助。',steps:[
    {title:'晴天突然刮起风来',talkHint:'看人物的头发、衣服、树叶和变暗的天空。',prompt:'刚才是什么天气？现在什么开始发生了？',promptPinyin:'Gāngcái shì shénme tiānqì? Xiànzài shénme kāishǐ fāshēng le?',promptEn:'What was the weather like just now, and what is starting now?',image:img('photo-text-2-wind-starts'),labels:[{word:'刚才',x:10,y:18,targetX:45,targetY:18},{word:'刮',x:88,y:18,targetX:66,targetY:20},{word:'风',x:10,y:82,targetX:42,targetY:58},{word:'变化',x:88,y:82,targetX:72,targetY:42}],words:['刚才','刮','风','变化'],sentence:'刚才还是大晴天，现在突然刮起风来了。',sampleAnswers:[{hanzi:'刚才还是大晴天。',pinyin:'Gāngcái háishì dà qíngtiān.'},{hanzi:'现在突然刮起风来了。',pinyin:'Xiànzài tūrán guāqǐ fēng lái le.'},{hanzi:'天空和树叶都有变化。',pinyin:'Tiānkōng hé shùyè dōu yǒu biànhuà.'}]},
    {title:'雨下起来，借出雨具',talkHint:'找车门旁的一把伞、一件雨衣和正在互相帮助的两个人。',prompt:'王一飞准备把什么借给白家月？',promptPinyin:'Wáng Yīfēi zhǔnbèi bǎ shénme jiè gěi Bái Jiāyuè?',promptEn:'What is Wang Yifei ready to lend Bai Jiayue?',image:img('photo-text-2-rain-gear'),labels:[{word:'伞',x:10,y:18,targetX:43,targetY:47},{word:'雨衣',x:88,y:18,targetX:55,targetY:58},{word:'借',x:10,y:82,targetX:52,targetY:44},{word:'把',x:88,y:82,targetX:40,targetY:47}],words:['伞','雨衣','借','把'],sentence:'雨下起来了，王一飞把一把伞或一件雨衣借给白家月。',sampleAnswers:[{hanzi:'王一飞手里有一把伞和一件雨衣。',pinyin:'Wáng Yīfēi shǒu li yǒu yì bǎ sǎn hé yí jiàn yǔyī.'},{hanzi:'她可以把雨具借给白家月。',pinyin:'Tā kěyǐ bǎ yǔjù jiè gěi Bái Jiāyuè.'},{hanzi:'这个季节天气变化很快。',pinyin:'Zhège jìjié tiānqì biànhuà hěn kuài.'}]}
  ]},
  3:{title:'气候体验与冬季雪景',subtitle:'在室内躲雨并比较长期居住后的天气感受。',steps:[
    {title:'教室里谈天气习惯',talkHint:'找雨窗、门边的伞和正在交流的两个人。',prompt:'在一个地方住一年多以后，什么容易习惯，什么不容易？',promptPinyin:'Zài yí gè dìfang zhù yì nián duō yǐhòu, shénme róngyì xíguàn, shénme bù róngyì?',promptEn:'After living somewhere for more than a year, what is easy or difficult to get used to?',image:img('photo-text-3-rainy-classroom'),labels:[{word:'变化',x:10,y:18,targetX:77,targetY:25},{word:'关注',x:88,y:18,targetX:75,targetY:48},{word:'常常',x:10,y:82,targetX:53,targetY:53}],words:['变化','关注','常常',extension('习惯','xíguàn','be used to',['习惯天气','还不习惯'],'别的早就习惯了，就是天气还不太习惯。','Biéde zǎojiù xíguàn le, jiù shì tiānqì hái bú tài xíguàn.')],sentence:'她已经住了一年多，但是对这里的天气还不太习惯。',sampleAnswers:[{hanzi:'她们在教室里躲雨。',pinyin:'Tāmen zài jiàoshì li duǒ yǔ.'},{hanzi:'王一飞对这里的天气还不太习惯。',pinyin:'Wáng Yīfēi duì zhèlǐ de tiānqì hái bú tài xíguàn.'},{hanzi:'白家月常常关注天气变化。',pinyin:'Bái Jiāyuè chángcháng guānzhù tiānqì biànhuà.'}]},
    {title:'窗外的冬季雪景',talkHint:'比较室内人物的感受和窗外的雪、树与风。',prompt:'冬天虽然很冷，但为什么有人喜欢下雪的时候？',promptPinyin:'Dōngtiān suīrán hěn lěng, dàn wèishénme yǒurén xǐhuan xià xuě de shíhou?',promptEn:'Although winter is cold, why do some people like snowy days?',image:img('photo-text-3-winter-window'),labels:[{word:'冬天',x:10,y:18,targetX:26,targetY:38},{word:'风',x:88,y:18,targetX:30,targetY:24},{word:'新闻',x:10,y:82,targetX:69,targetY:68}],words:['冬天','风','新闻',extension('下雪','xià xuě','snow',['常常下雪','下了一次雪'],'冬天虽然冷，但是下雪的时候特别漂亮。','Dōngtiān suīrán lěng, dànshì xià xuě de shíhou tèbié piàoliang.')],sentence:'冬天虽然冷，但是下雪的时候特别漂亮。',sampleAnswers:[{hanzi:'窗外正在下雪。',pinyin:'Chuāngwài zhèngzài xià xuě.'},{hanzi:'冬天很冷，但是雪景特别漂亮。',pinyin:'Dōngtiān hěn lěng, dànshì xuějǐng tèbié piàoliang.'},{hanzi:'今年就下了一次雪。',pinyin:'Jīnnián jiù xiàle yí cì xuě.'}]}
  ]},
  4:{title:'四季记忆与个人偏好',subtitle:'王一飞回顾北京四季，并把长期生活体验写进日记。',steps:[
    {title:'回忆春天和夏天',talkHint:'找相册中的春花、夏日晚间湖景和正在回忆的王一飞。',prompt:'北京的春天和夏天各有什么特点？',promptPinyin:'Běijīng de chūntiān hé xiàtiān gè yǒu shénme tèdiǎn?',promptEn:'What are spring and summer in Beijing like?',image:img('photo-text-4-spring-summer-memory'),labels:[{word:'春天',x:10,y:18,targetX:54,targetY:62},{word:'夏天',x:88,y:18,targetX:74,targetY:62},{word:'凉快',x:88,y:82,targetX:76,targetY:63}],words:['春天','夏天','凉快','四季'],sentence:'春天不冷不热，夏天白天很热，但是晚上比较凉快。',sampleAnswers:[{hanzi:'北京的春天最舒服。',pinyin:'Běijīng de chūntiān zuì shūfu.'},{hanzi:'春天天气不冷不热。',pinyin:'Chūntiān tiānqì bù lěng bú rè.'},{hanzi:'夏天晚上比较凉快。',pinyin:'Xiàtiān wǎnshang bǐjiào liángkuai.'}]},
    {title:'秋叶窗边写日记',talkHint:'找秋天的红黄叶子、四季照片和连续正文日记。',prompt:'王一飞住了一年多以后，最喜欢和最不喜欢什么季节？',promptPinyin:'Wáng Yīfēi zhù le yì nián duō yǐhòu, zuì xǐhuan hé zuì bù xǐhuan shénme jìjié?',promptEn:'After living there for more than a year, which seasons does Wang Yifei like most and least?',image:img('photo-text-4-autumn-diary'),labels:[{word:'秋天',x:10,y:18,targetX:83,targetY:21},{word:'叶子',x:88,y:18,targetX:82,targetY:29},{word:'变成',x:88,y:82,targetX:73,targetY:26}],words:['秋天','叶子','变成','季节'],sentence:'秋天叶子变成红色、黄色；冬天不但冷，而且风很大。',sampleAnswers:[{hanzi:'秋天的叶子变成了红色、黄色。',pinyin:'Qiūtiān de yèzi biànchéng le hóngsè, huángsè.'},{hanzi:'这一年多住下来，她还是更喜欢北京的四季。',pinyin:'Zhè yì nián duō zhù xiàlai, tā háishì gèng xǐhuan Běijīng de sìjì.'},{hanzi:'她最不喜欢冬天，因为又冷风又大。',pinyin:'Tā zuì bù xǐhuan dōngtiān, yīnwèi yòu lěng fēng yòu dà.'}]}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {session:'A',title:'春日景物与出行选择',intro:'Learn the words you need to describe a spring street, choose a park activity and offer two possible dates. The full textbook dialogue stays for class.',photo:img('photo-text-1-spring-street'),words:['街','开花','公园','船','工作日','地方'],recognition:[
    ['哪个词表示“street”？','街',['街','船','风','叶子']],['“开花”表示什么？','bloom',['bloom','borrow','change','cool']],['哪一个是水上的交通工具？','船',['船','伞','雨衣','叶子']],['“工作日”是哪类日子？','weekday',['weekday','holiday','season','evening']],['“地方”表示什么？','place',['place','news','winter','change']]
  ],pairs:[['街','street'],['开花','bloom'],['公园','park'],['船','boat'],['工作日','weekday']],contexts:[
    ['春天到了，这条____上的树都开花了。','街',['街','风','新闻','季节']],['上周我去____坐船了。','公园',['公园','雨衣','冬天','叶子']],['今天是____，公园里的人应该不多。','工作日',['工作日','四季','刚才','变化']],['下午有课，不能去太远的____。','地方',['地方','船','伞','新闻']],['我们或者明天去，____后天去。','或者',['或者','就','常常','刚才']]
  ],challenge:[
    ['哪一句自然描述春天的街道？','这条街上的树都开花了。',['这条街上的树都开花了。','这条街正在下大雪。','这条船在教室里。','工作日是一把伞。']],
    ['白家月想在公园做什么？','坐船',['坐船','借雨衣','写新闻','看冬天']],
    ['为什么工作日公园里的人可能不多？','很多人要工作或上课',['很多人要工作或上课','所有花都不开','公园没有地方','船都变成叶子']],
    ['哪一句列出两个日期选择？','或者明天去，或者后天去。',['或者明天去，或者后天去。','明天还是后天？','明天去公园。','后天是工作日。']],
    ['王一飞今天为什么不能去太远？','下午有课',['下午有课','没有雨衣','冬天太冷','没有关注新闻']],
    ['“一条船”中“条”说明什么？','船的量词',['船的量词','一个季节','一条新闻','一个工作日']],
    ['哪一个计划包含地点和活动？','去公园坐船',['去公园坐船','天气变化很快','叶子变红了','刚才刮风']],
    ['你要邀请朋友一起去，哪一句最自然？','我想跟你一起去。',['我想跟你一起去。','我把你一把伞。','我就一次新闻。','我变化公园。']],
    ['日期还没决定，可以怎样说？','或者周六去，或者周日去。',['或者周六去，或者周日去。','周六还是周日去吗。','就周六和周日。','周六起来周日。']],
    ['Homework A 要准备什么？','一张户外活动计划卡',['一张户外活动计划卡','一段强制录音','完整课文答案','一份天气新闻文字']]
  ]},
  {session:'B',title:'突然变化的天气与应对',intro:'Learn to notice a sudden weather change, explain what starts, identify an exception and lend useful rain gear. The full textbook dialogue stays for class.',photo:img('photo-text-2-wind-starts'),words:['刚才','刮','风','新闻','伞','借','把','雨衣','变','季节','变化'],recognition:[
    ['“刚才”表示什么时候？','a moment ago',['a moment ago','next year','every winter','all day']],['哪个词表示“wind”？','风',['风','伞','船','街']],['“雨衣”是什么？','raincoat',['raincoat','umbrella','boat','leaf']],['“借给你”是谁把东西给谁使用？','说话人把东西给你使用',['说话人把东西给你使用','你把东西送给说话人','两个人买新东西','没有人使用']],['“一把伞”的“把”是什么？','量词',['量词','新语法','季节','动词']]
  ],pairs:[['刚才','just now'],['刮风','the wind blows'],['新闻','news'],['一把伞','one umbrella'],['雨衣','raincoat']],contexts:[
    ['____还是大晴天，现在已经刮起风来了。','刚才',['刚才','秋天','地方','船']],['新闻里说今天有____。','雨',['雨','街','花','船']],['我每天都带伞，____今天没带。','就',['就','或者','把','常常']],['我车里有一____伞。','把',['把','条','件','个']],['雨已经下____了，咱们快走吧。','起来',['起来','下来','或者','变成']]
  ],challenge:[
    ['天气先发生了什么变化？','刮起风来',['刮起风来','叶子变红','船开花','冬天结束']],
    ['哪一句表示雨开始了？','雨下起来了。',['雨下起来了。','雨走下来了。','雨或者了。','雨就一次。']],
    ['“每天都带伞，就今天没带”中的“就”表示什么？','今天是例外',['今天是例外','数量很多','雨开始了','两个选择']],
    ['谁把伞借给谁？','王一飞借给白家月',['王一飞借给白家月','白家月借给王一飞','新闻借给天气','季节借给公园']],
    ['哪一个搭配正确？','一把伞',['一把伞','一条雨衣','一个风','一件新闻']],
    ['哪一句把量词“把”用对了？','车里有一把伞。',['车里有一把伞。','我把一把天气。','把是新的季节。','风有一把。']],
    ['天气变化很快，最好准备什么？','伞或雨衣',['伞或雨衣','船和叶子','公园和街','春天和秋天']],
    ['哪一句表示状态开始？','天慢慢黑起来了。',['天慢慢黑起来了。','天慢慢黑下来走。','天黑一把。','天或者黑。']],
    ['“新闻里说今天有雨”说明消息从哪里来？','新闻',['新闻','公园','船','叶子']],
    ['Homework B 必须包括什么？','一个“起来”句和一个例外“就”句',['一个“起来”句和一个例外“就”句','完整课文抄写','强制音频','五个新语法点']]
  ]},
  {session:'C',title:'四季、气候体验与个人偏好',intro:'Learn to describe four seasons, highlight a small amount, and summarize a longer experience with 下来. You may describe China, your home country, city or campus.',photo:img('photo-text-4-autumn-diary'),words:['冬天','常常','关注','四季','春天','夏天','凉快','秋天','叶子','变成'],recognition:[
    ['“四季”包括什么？','春夏秋冬',['春夏秋冬','早中晚夜','东南西北','风雨新闻']],['哪个词表示“comfortably cool”？','凉快',['凉快','工作日','变化','开花']],['“叶子变成红色”表示什么？','叶子的颜色发生变化',['叶子的颜色发生变化','叶子开始下雨','叶子借出雨衣','叶子选择日期']],['“常常”表示什么？','often',['often','only once','tomorrow','except']],['“关注天气”表示什么？','pay attention to the weather',['pay attention to the weather','lend the weather','choose a boat','write a street']]
  ],pairs:[['冬天','winter'],['四季','four seasons'],['春天','spring'],['凉快','comfortably cool'],['叶子','leaf']],contexts:[
    ['北京的____最舒服，天气不冷不热。','春天',['春天','新闻','工作日','雨衣']],['夏天白天很热，但是晚上比较____。','凉快',['凉快','开花','刚才','地方']],['秋天树上的____变成红色、黄色。','叶子',['叶子','船','伞','街']],['北京常常下雪，但今年____下了一次。','就',['就','或者','把','起来']],['这一年多住____，我更了解这里的四季了。','下来',['下来','起来','或者','刚才']]
  ],challenge:[
    ['北京春天的特点是什么？','不冷不热',['不冷不热','白天很热','风特别大','常常下雨']],
    ['北京夏天什么时候比较凉快？','晚上',['晚上','白天','中午','早上六点一定']],
    ['秋天叶子怎样变化？','变成红色、黄色',['变成红色、黄色','开成小船','借给冬天','坐进公园']],
    ['王一飞为什么不喜欢冬天？','不但冷，而且风很大',['不但冷，而且风很大','没有公园','没有工作日','不能看新闻']],
    ['哪一句强调数量少？','今年就下了一次雪。',['今年就下了一次雪。','北京常常下雪。','冬天很冷。','我关注天气。']],
    ['哪一句指出例外？','大家都习惯了，就他还不习惯。',['大家都习惯了，就他还不习惯。','他就看了十分钟。','春天不冷不热。','叶子变成黄色。']],
    ['哪一句自然使用“下来”？','这一年住下来，我更喜欢这里了。',['这一年住下来，我更喜欢这里了。','雨住起来了。','一把伞下来。','或者住就。']],
    ['“不冷不热”表示什么？','温度适中',['温度适中','又冷又热','只有冬天','天气开始']],
    ['介绍自己的地方时，可以谈什么？','四季特点和个人偏好',['四季特点和个人偏好','真实地址密码','所有课文答案','必须和王一飞相同']],
    ['Homework C 的课堂分享多长？','1—2分钟',['1—2分钟','10分钟以上','只写不说','必须上传录音']]
  ]}
];

function mission(spec) {
  const lower = spec.session.toLowerCase();
  const makeQuiz = (rows, kind) => rows.map((item,index) => q(`${lower}_${kind}_${String(index + 1).padStart(2,'0')}`,item[0],'Choose the best answer for this context.',item[2],item[1]));
  return {
    id:`pm_hsk3_l12_${lower}`,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:`第${{A:1,B:2,C:3}[spec.session]}次课课前热身赛`,titleEn:spec.title,
    subtitleEn:'Five stages prepare you for the next classroom task.',scenario:spec.title,goals:[spec.title,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],
    storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:spec.intro,
    stages:[
      {id:`${lower}1`,title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先听、读并理解本次课的词语和必要背景。',screenPromptEn:spec.intro,interactionType:'study_list',photos:[spec.photo],keywordCards:spec.words.map(card)},
      {id:`${lower}2`,title:'快速认词',titleEn:'Recognition',screenPrompt:'根据词义或情境选择答案。',screenPromptEn:'Choose the word or meaning that fits.',interactionType:'practice_quiz',questions:makeQuiz(spec.recognition,'rec')},
      {id:`${lower}3`,title:'汉英配对',titleEn:'Chinese-English Match',screenPrompt:'把中文词语和英文意思配对。',screenPromptEn:'Match each Chinese card with its English meaning.',interactionType:'timed_match',pairs:spec.pairs.map((item,index)=>({id:`${lower}_pair_${String(index + 1).padStart(2,'0')}`,word:item[0],meaning:item[1]}))},
      {id:`${lower}4`,title:'语境判断',titleEn:'Context Check',screenPrompt:'把词语放回完整语境。',screenPromptEn:'Choose the expression that completes each context.',interactionType:'practice_quiz',questions:makeQuiz(spec.contexts,'ctx')},
      {id:`${lower}5`,title:'正式挑战',titleEn:'Scored Challenge',screenPrompt:'独立完成10题正式挑战。',screenPromptEn:'Complete the 10-question scored challenge.',interactionType:'ranked_quiz',questions:makeQuiz(spec.challenge,'ch')}
    ],
    reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],
    persistenceKeyPattern:`ClassReadyPreview_HSK3-L12_${spec.session}_{student}_v1`,completionMessageEn:'Preview complete. Bring one useful sentence to class.'
  };
}

const fills = [
  {id:'l12_fill_group_01',type:'vocab_fill_group',stage:'in_class',contentRole:'lesson',prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:['街','开花','公园','工作日','地方'],wordBank_pinyin:['jiē','kāihuā','gōngyuán','gōngzuòrì','dìfang'],sentences:[
    {id:'l12_fill_01_01',sentence:'春天到了，这条____上的树都开花了。',sentence_pinyin:'Chūntiān dào le, zhè tiáo ____ shang de shù dōu kāihuā le.',answer:'街'},
    {id:'l12_fill_01_02',sentence:'湖边的树还没有____，我们下周再来看。',sentence_pinyin:'Húbiān de shù hái méiyǒu ____, wǒmen xià zhōu zài lái kàn.',answer:'开花'},
    {id:'l12_fill_01_03',sentence:'天气这么好，下午我想去____坐船。',sentence_pinyin:'Tiānqì zhème hǎo, xiàwǔ wǒ xiǎng qù ____ zuò chuán.',answer:'公园'},
    {id:'l12_fill_01_04',sentence:'今天是____，公园里的人应该不会太多。',sentence_pinyin:'Jīntiān shì ____, gōngyuán li de rén yīnggāi bú huì tài duō.',answer:'工作日'},
    {id:'l12_fill_01_05',sentence:'我下午有课，不能去太远的____。',sentence_pinyin:'Wǒ xiàwǔ yǒu kè, bù néng qù tài yuǎn de ____.',answer:'地方'}
  ],speakingLevels:{support:'用词库完成一句。',core:'说明一个春日活动计划。',challenge:'比较工作日和周末的安排。'}}},
  {id:'l12_fill_group_02',type:'vocab_fill_group',stage:'in_class',contentRole:'transfer',prompt_en:'Choose from the word bank for each complete context.',data:{wordBank:['刚才','新闻','伞','雨衣','变化'],wordBank_pinyin:['gāngcái','xīnwén','sǎn','yǔyī','biànhuà'],sentences:[
    {id:'l12_fill_02_01',sentence:'____还是晴天，现在已经下起雨来了。',sentence_pinyin:'____ háishì qíngtiān, xiànzài yǐjīng xiàqǐ yǔ lái le.',answer:'刚才'},
    {id:'l12_fill_02_02',sentence:'我看了天气____，下午可能有雨。',sentence_pinyin:'Wǒ kàn le tiānqì ____, xiàwǔ kěnéng yǒu yǔ.',answer:'新闻'},
    {id:'l12_fill_02_03',sentence:'她每天都带____，就今天忘在家里了。',sentence_pinyin:'Tā měitiān dōu dài ____, jiù jīntiān wàng zài jiā li le.',answer:'伞'},
    {id:'l12_fill_02_04',sentence:'雨太大了，除了带伞还可以穿____。',sentence_pinyin:'Yǔ tài dà le, chúle dài sǎn hái kěyǐ chuān ____.',answer:'雨衣'},
    {id:'l12_fill_02_05',sentence:'春天天气____很快，出门前要准备好。',sentence_pinyin:'Chūntiān tiānqì ____ hěn kuài, chūmén qián yào zhǔnbèi hǎo.',answer:'变化'}
  ],speakingLevels:{support:'用词库完成一句。',core:'说出天气怎样变化。',challenge:'说明变化、例外和应对办法。'}}},
  {id:'l12_fill_group_03',type:'vocab_fill_group',stage:'in_class',contentRole:'review',prompt_en:'Choose from the word bank and connect this lesson with earlier learning.',data:{wordBank:['常常','关注','凉快','叶子','变成'],wordBank_pinyin:['chángcháng','guānzhù','liángkuai','yèzi','biànchéng'],sentences:[
    {id:'l12_fill_03_01',sentence:'北京冬天____下雪，可是今年雪比较少。',sentence_pinyin:'Běijīng dōngtiān ____ xià xuě, kěshì jīnnián xuě bǐjiào shǎo.',answer:'常常'},
    {id:'l12_fill_03_02',sentence:'准备户外活动以前，我们要先____天气。',sentence_pinyin:'Zhǔnbèi hùwài huódòng yǐqián, wǒmen yào xiān ____ tiānqì.',answer:'关注'},
    {id:'l12_fill_03_03',sentence:'夏天白天很热，晚上就比较____。',sentence_pinyin:'Xiàtiān báitiān hěn rè, wǎnshang jiù bǐjiào ____.',answer:'凉快'},
    {id:'l12_fill_03_04',sentence:'秋天到了，树上的____开始变黄了。',sentence_pinyin:'Qiūtiān dào le, shù shang de ____ kāishǐ biàn huáng le.',answer:'叶子'},
    {id:'l12_fill_03_05',sentence:'下雨以后，原来的活动计划____了室内参观。',sentence_pinyin:'Xià yǔ yǐhòu, yuánlái de huódòng jìhuà ____ le shìnèi cānguān.',answer:'变成'}
  ],speakingLevels:{support:'用词库完成一句。',core:'介绍一个季节的特点。',challenge:'比较两个地方的季节和活动。'}}}
];

const matchSpecs = [
  {id:'l12_match_01',role:'lesson',pairs:[
    ['这条街到了春天有什么变化？','街上的树都开花了，看起来很漂亮。'],
    ['白家月为什么想去公园？','因为天气很好，她想去公园坐船。'],
    ['王老师今天为什么不能去太远？','因为她下午有课，回来不能太晚。'],
    ['她们可以选择哪两天去？','或者明天去，或者后天去，都可以再联系。'],
    ['工作日去公园可能有什么好处？','很多人要上班上课，所以公园里人可能不多。']
  ]},
  {id:'l12_match_02',role:'transfer',pairs:[
    ['晴天为什么突然要准备雨具？','因为开始刮风，雨也已经下起来了。'],
    ['你今天没带伞，可以怎么办？','我可以借朋友的伞，或者穿一件雨衣。'],
    ['“就今天没带”说明什么？','说明平时每天都带，只有今天是例外。'],
    ['王一飞说“借给你”是什么意思？','她把自己的雨具给白家月暂时使用。'],
    ['活动前怎样应对天气变化？','先关注天气，再准备伞和可以改变的计划。']
  ]},
  {id:'l12_match_03',role:'review',pairs:[
    ['在这里住一年多以后感觉怎样？','别的早就习惯了，就是天气还不太习惯。'],
    ['北京的春天为什么很舒服？','因为天气不冷不热，适合在外面活动。'],
    ['夏天什么时候比较凉快？','白天虽然很热，但是晚上比较凉快。'],
    ['秋天的树叶会发生什么变化？','树上的叶子会变成红色、黄色。'],
    ['这一学期学下来，你有什么变化？','我会说更多中文，也更敢跟同学交流了。']
  ]}
];
const matchGroups = matchSpecs.map(group => ({id:group.id,type:'question_answer_match',title:'问答匹配 / Question–Answer Match',stage:'in_class',contentRole:group.role,prompt_cn:'把左侧完整问题和右侧完整回答配对，全部完成后一次提交。',prompt_en:'Match each complete question with its answer. Submit all five together.',data:{interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,pairs:group.pairs.map((pair,index)=>({id:group.id + '_' + (index + 1),left:pair[0],right:pair[1]}))}}));

const orderRows = [
  ['或者明天去，或者后天去，我给你打电话。',['或者明天去','或者后天去','我给你打电话'],'lesson'],
  ['刚才还是晴天，现在突然刮起风来了。',['刚才还是晴天','现在','突然刮起风来了'],'lesson'],
  ['我每天都带伞，就今天没有带。',['我每天都带伞','就今天','没有带'],'lesson'],
  ['秋天树上的叶子都变成了红色、黄色。',['秋天','树上的叶子','都变成了','红色、黄色'],'transfer'],
  ['这一学期学下来，我更敢说中文了。',['这一学期','学下来','我更敢','说中文了'],'review']
];
const orders = orderRows.map((item,index) => ({id:'l12_order_' + String(index + 1).padStart(2,'0'),type:'sentence_order',stage:'in_class',contentRole:item[2],prompt_cn:'连词成句。',prompt_en:'Put the chunks in order.',correct_answer:item[0],data:{chunks:item[1],answer:item[0]}}));

const sceneRows = [
  ['春天街上的树都开花了，你想描述眼前的变化。',['这条街上的树都开花了。','这条街上正在下大雪。','这条街是一把伞。','这条街没有季节。'],'这条街上的树都开花了。'],
  ['朋友今天下午有课，你们要选择新日期。',['或者明天去，或者后天去。','明天去还是。','就一次明天。','明天下起来。'],'或者明天去，或者后天去。'],
  ['刚才晴天，现在树叶和头发都被风吹动。',['怎么突然刮起风来了？','怎么突然坐起船来了？','怎么突然开花下来？','怎么就一把风？'],'怎么突然刮起风来了？'],
  ['雨开始了，朋友没有带雨具。',['我可以把一把伞借给你。','我可以从你借给伞。','我可以一把天气。','我可以变成新闻。'],'我可以把一把伞借给你。'],
  ['平时每天带伞，只有今天忘了。',['我每天都带伞，就今天没带。','我今天就带了很多伞。','或者今天带伞。','雨衣下来了。'],'我每天都带伞，就今天没带。'],
  ['你在一个城市生活一年后回顾体验。',['这一年住下来，我已经习惯很多了。','这一年住起来，我向上走。','这一年就一把。','这一年或者天气。'],'这一年住下来，我已经习惯很多了。'],
  ['今年冬天只下过一次雪。',['今年就下了一次雪。','今年就雪是例外。','今年或者下雪。','今年雪借给我。'],'今年就下了一次雪。'],
  ['夏天白天很热，晚上温度舒服。',['夏天晚上比较凉快。','夏天晚上都开花。','夏天是一条船。','夏天借给秋天。'],'夏天晚上比较凉快。'],
  ['你要回顾一整天的户外活动。',['一天走下来，我觉得有点儿累。','一天走起来就是方向。','一天或者公园。','一天把季节。'],'一天走下来，我觉得有点儿累。'],
  ['同学问你周末坐船还是散步，你陈述两个可能方案。',['或者坐船，或者散步。','坐船还是散步？','就坐船一次。','坐起散步来。'],'或者坐船，或者散步。']
];
const sceneChoices = sceneRows.map((item,index,all) => ({id:'l12_scene_' + String(index + 1).padStart(2,'0'),type:'choice',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:item[0],prompt_en:'Choose the sentence that fits the situation.',correct_answer:item[2],data:{question_cn:item[0],options:item[1],correct_index:item[1].indexOf(item[2])}}));

const guessRows = [
  ['工作日','不是周末，很多人这一天要上班或上课。'],['雨衣','下雨时穿在身上，能让衣服少淋雨。'],['伞','下雨时打开拿在手里，上面可以挡雨。'],['船','在湖上或河上行走，人可以坐在里面。'],['新闻','告诉大家最近发生的事情，也可能介绍天气。'],['季节','春天、夏天、秋天、冬天都是它。'],['凉快','天气不热，感觉很舒服。'],['叶子','长在树枝上，秋天可能变成红色或黄色。'],['关注','常常注意一件事，想知道它的新变化。'],['变成','原来的样子或情况改变以后成为新的样子。']
];
const guesses = guessRows.map((item,index,all) => { const options=[item[0],...guessRows.filter((_,i)=>i!==index).slice(index%6,index%6+3).map(x=>x[0])].slice(0,4); return {id:'l12_guess_' + String(index + 1).padStart(2,'0'),type:'description_guess',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:item[1],prompt_en:'Guess the one word that matches the clue.',correct_answer:item[0],data:{description:item[1],options}}; });

const sayRows = [
  ['公园',['花','树','坐船','散步']],['工作日',['上班','上课','人不多','周末']],['雨衣',['下雨','穿','身上','挡雨']],['新闻',['看','听','天气','最近']],['变化',['原来','后来','变','不一样']],['四季',['春天','夏天','秋天','冬天']],['凉快',['不热','晚上','舒服','风']],['叶子',['树上','绿色','红色','黄色']]
];
const sayGuess = sayRows.map((item,index,all) => ({id:'l12_say_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:index === 3 ? 'transfer' : roleFor(index,all.length),prompt_cn:'你说我猜。',prompt_en:'Describe the covered word without saying it.',openEnded:true,needsTeacherReview:true,data:{target:item[0],boardIndex:index + 1,clues:[],scaffold:{words:item[1],frames:['这是一个……。','人们在……的时候会用到 / 看到它。','它跟……有关系。']},answerPlaceholder:'写下你的中文提示。'}}));

const blindRows = [
  [['或者……或者……','公园'],'或者明天去公园，或者后天去公园。'],
  [['刮起风来','伞'],'外面突然刮起风来了，我赶快拿出伞。'],
  [['就','一次'],'今年冬天就下了一次雪。'],
  [['住下来','四季'],'在这里住下来以后，我更了解这里的四季了。']
];
const blind = blindRows.map((item,index,all) => ({id:'l12_blind_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:item[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:item[1],revealDecoration:'none',uniformWordSize:true}}));

const pictureRows = [
  ['photo-text-1-spring-street','街、开花'],['photo-text-1-park-boat','工作日、公园、船'],['photo-text-2-wind-starts','刚才、刮起风来'],['photo-text-2-rain-gear','一把伞、雨衣、借给'],['photo-text-3-rainy-classroom','习惯、天气变化'],['photo-text-3-winter-window','冬天、就、一次'],['photo-text-4-spring-summer-memory','春天、夏天、凉快'],['photo-text-4-autumn-diary','秋天、叶子、变成、住下来']
];
const pictureComplete = pictureRows.map((item,index,all) => ({id:'l12_pic_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the keywords to write one complete sentence about the photo.',data:{image:img(item[0]),keyword:item[1],task:'观察图片，用关键词写一个完整、自然的句子。',answerPlaceholder:'写一个完整的中文句子。'}}));

const readingQuestion = (question_cn, question_pinyin, options, correct_index, focus) => ({question_cn,question_pinyin,options,correct_index,answer:options[correct_index],focus});
const readingRows = [
  {title:'周末的公园计划',passage:'星期五，安娜和同学看见校园里的树开花了。她们想去公园坐船，但是星期六安娜有课。她们决定或者星期天下午去，或者下周二这个工作日去。选好日期以后，安娜会给大家发消息。',pinyin:'Xīngqīwǔ, Ānnà hé tóngxué kànjiàn xiàoyuán li de shù kāihuā le. Tāmen xiǎng qù gōngyuán zuò chuán, dànshì xīngqīliù Ānnà yǒu kè. Tāmen juédìng huòzhě xīngqītiān xiàwǔ qù, huòzhě xià zhōu èr zhège gōngzuòrì qù. Xuǎn hǎo rìqī yǐhòu, Ānnà huì gěi dàjiā fā xiāoxi.',role:'lesson',questions:[readingQuestion('她们在哪里看见树开花了？','Tāmen zài nǎli kànjiàn shù kāihuā le?',['校园里','车里','教室里','新闻里'],0,'地点'),readingQuestion('安娜星期六为什么不能去？','Ānnà xīngqīliù wèishénme bù néng qù?',['她有课','她没带伞','天气太冷','她要写新闻'],0,'原因'),readingQuestion('她们最后怎样安排日期？','Tāmen zuìhòu zěnyàng ānpái rìqī?',['列出星期日和下周二两个选择','只选星期六','决定不去公园','每天都去'],0,'选择复句')]},
  {title:'晴天以后',passage:'早上天气很好，李文没看天气新闻就出门了。中午突然刮起风来，几分钟以后又下起雨来了。同学们都带了伞，就他没带。朋友把一件雨衣借给他，他们一起走回学校。',pinyin:'Zǎoshang tiānqì hěn hǎo, Lǐ Wén méi kàn tiānqì xīnwén jiù chūmén le. Zhōngwǔ tūrán guāqǐ fēng lái, jǐ fēnzhōng yǐhòu yòu xiàqǐ yǔ lái le. Tóngxuémen dōu dài le sǎn, jiù tā méi dài. Péngyou bǎ yí jiàn yǔyī jiè gěi tā, tāmen yìqǐ zǒu huí xuéxiào.',role:'lesson',questions:[readingQuestion('李文出门前没做什么？','Lǐ Wén chūmén qián méi zuò shénme?',['没看天气新闻','没吃早饭','没去公园','没写作业'],0,'信息来源'),readingQuestion('中午天气怎样变化？','Zhōngwǔ tiānqì zěnyàng biànhuà?',['先刮风，后下雨','先下雪，后开花','一直晴天','只变凉快'],0,'变化顺序'),readingQuestion('谁没有带伞？','Shéi méiyǒu dài sǎn?',['李文','所有同学','朋友','老师'],0,'例外')]},
  {title:'校园里的四季',passage:'我们的校园四季都很美。春天树会开花，天气不冷不热。夏天白天很热，但是晚上比较凉快。秋天叶子变成红色和黄色。冬天风大，也常常下雪。我最喜欢秋天，因为适合在校园里散步。',pinyin:'Wǒmen de xiàoyuán sìjì dōu hěn měi. Chūntiān shù huì kāihuā, tiānqì bù lěng bú rè. Xiàtiān báitiān hěn rè, dànshì wǎnshang bǐjiào liángkuai. Qiūtiān yèzi biànchéng hóngsè hé huángsè. Dōngtiān fēng dà, yě chángcháng xià xuě. Wǒ zuì xǐhuan qiūtiān, yīnwèi shìhé zài xiàoyuán li sànbù.',role:'transfer',questions:[readingQuestion('春天天气怎么样？','Chūntiān tiānqì zěnmeyàng?',['不冷不热','白天很热','风特别大','一直下雪'],0,'春天'),readingQuestion('秋天什么会变色？','Qiūtiān shénme huì biàn sè?',['叶子','雨衣','船','新闻'],0,'秋天'),readingQuestion('作者最喜欢哪个季节？','Zuòzhě zuì xǐhuan nǎge jìjié?',['秋天','春天','夏天','冬天'],0,'偏好')]},
  {title:'一年住下来',passage:'玛丽来大连学习已经一年了。刚来的时候，她不习惯冬天的大风，也不知道春天天气变化很快。现在她会关注天气，书包里常常放着一把伞。这一年住下来，她已经喜欢上这里的海、四季和同学了。',pinyin:'Mǎlì lái Dàlián xuéxí yǐjīng yì nián le. Gāng lái de shíhou, tā bù xíguàn dōngtiān de dà fēng, yě bù zhīdào chūntiān tiānqì biànhuà hěn kuài. Xiànzài tā huì guānzhù tiānqì, shūbāo li chángcháng fàngzhe yì bǎ sǎn. Zhè yì nián zhù xiàlai, tā yǐjīng xǐhuan shang zhèlǐ de hǎi, sìjì hé tóngxué le.',role:'transfer',questions:[readingQuestion('玛丽刚来时不习惯什么？','Mǎlì gāng lái shí bù xíguàn shénme?',['冬天的大风','夏天的晚上','公园的小船','秋天的叶子'],0,'长期体验'),readingQuestion('她现在怎样准备天气变化？','Tā xiànzài zěnyàng zhǔnbèi tiānqì biànhuà?',['关注天气并常带伞','每天借雨衣','不再出门','只看树叶'],0,'应对'),readingQuestion('一年住下来，她有什么新感受？','Yì nián zhù xiàlai, tā yǒu shénme xīn gǎnshòu?',['喜欢这里的生活了','仍然什么都不喜欢','只想去坐船','不认识同学'],0,'下来')]},
  {title:'改变计划',passage:'我们本来想周六去湖边，可是新闻说下午有雨。大家讨论以后，决定或者上午去湖边走一走，或者下午在教室里看电影。周六早上风就大起来了，所以我们选择了室内活动。计划虽然变了，大家还是很开心。',pinyin:'Wǒmen běnlái xiǎng xīngqīliù qù húbiān, kěshì xīnwén shuō xiàwǔ yǒu yǔ. Dàjiā tǎolùn yǐhòu, juédìng huòzhě shàngwǔ qù húbiān zǒu yi zǒu, huòzhě xiàwǔ zài jiàoshì li kàn diànyǐng. Xīngqīliù zǎoshang fēng jiù dà qǐlai le, suǒyǐ wǒmen xuǎnzé le shìnèi huódòng. Jìhuà suīrán biàn le, dàjiā háishì hěn kāixīn.',role:'review',questions:[readingQuestion('新闻说明什么？','Xīnwén shuōmíng shénme?',['下午有雨','冬天有雪','公园开花','叶子变红'],0,'天气信息'),readingQuestion('大家列出了哪两个方案？',"Dàjiā lièchū le nǎ liǎng ge fāng'àn?",['上午湖边或下午室内','明天或后天坐船','带伞或借雨衣','春天或秋天'],0,'选择'),readingQuestion('最后为什么选择室内活动？','Zuìhòu wèishénme xuǎnzé shìnèi huódòng?',['早上风变大了','没有工作日','大家不喜欢电影','湖边没有地方'],0,'原因')]}
];
const readPassages = readingRows.map((item,index) => ({id:'l12_read_' + String(index + 1).padStart(2,'0'),type:'passage_reading',stage:'in_class',contentRole:item.role,prompt_cn:'阅读短文，完成三道理解题。',prompt_en:'Read the passage and answer three comprehension questions.',correct_answer:item.questions.map(question=>question.answer).join('；'),data:{title:item.title,passage:item.passage,passage_pinyin:item.pinyin,questions:item.questions}}));

const independentRows = [
  ['春游时间','我们星期五下午都有课，所以决定星期六或者星期日去公园。','他们为什么不在星期五下午去？','因为都有课',['因为都有课','因为没有花','因为没有船','因为是冬天'],'lesson'],
  ['突然下雨','小张每天都看天气新闻，就今天没看。下午雨下起来时，他没有带伞。','今天什么是例外？','小张没看天气新闻',['小张没看天气新闻','下午下雨','朋友带伞','天气变化'],'lesson'],
  ['夏天晚上','这个城市夏天白天很热，太阳下山以后就凉快多了。很多人晚上去公园散步。','人们为什么晚上去散步？','晚上比较凉快',['晚上比较凉快','白天没有公园','晚上树才开花','大家没有工作'],'transfer'],
  ['秋天的照片','安娜拍了两张照片。一张是绿色的树，另一张是一个月以后红黄相间的叶子。','照片说明什么变化？','叶子颜色变了',['叶子颜色变了','公园搬家了','冬天结束了','船变成伞了'],'transfer'],
  ['学习体验','这一学期学下来，马克觉得听力还是有点儿难，但是已经敢在商店和公交车上说中文了。','马克最大的进步是什么？','更敢使用中文',['更敢使用中文','不再学习听力','只会写天气','不坐公交车'],'review']
];
const independent = independentRows.map((item,index) => ({id:'l12_ind_read_' + String(index + 1).padStart(2,'0'),type:'choice',stage:'in_class',contentRole:item[5],prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:item[0],passage:item[1],question_cn:item[2],options:item[4],correct_index:item[4].indexOf(item[3])},correct_answer:item[3]}));

const paragraphRows = [
  ['春日计划','春天到了，校园里的树（1）。我们想去公园（2），但是老师下午有课。最后决定（3）。',[['都开花了','都下雪了'],['坐船','穿雨衣'],['或者明天去，或者后天去','就今天没带伞']],'lesson'],
  ['天气突变','刚才还是晴天，后来突然（1）。我每天都带伞，（2）。朋友说可以（3）。',[['刮起风来','叶子变黄'],['就今天没带','今年就下一次'],['把一把伞借给我','去公园坐船']],'lesson'],
  ['四季校园','春天天气（1），夏天晚上比较凉快。秋天（2），冬天常常下雪。我最喜欢春天，因为（3）。',[['不冷不热','只有一次'],['叶子变成红色、黄色','雨衣变成小船'],['适合在外面活动','每天都忘带伞']],'transfer'],
  ['一年以后','我来这里一年了。刚开始不习惯冬天的大风，现在会每天（1）。这一年住下来，我已经（2），也更喜欢（3）。',[['关注天气','坐船上课'],['习惯很多了','刮起风来'],['这里的四季','一把新闻']],'transfer'],
  ['小组展示','我们先看天气，再做活动计划。天气好的时候（1），下雨的时候（2）。这次项目做下来，大家（3）。',[['去公园散步','就今天没带'],['准备伞或雨衣','叶子开花'],['学会了互相帮助','变成了工作日']],'review']
];
const paragraphOrders = [[3,0,4,1,5,2],[1,3,5,0,4,2],[4,2,0,5,1,3],[2,4,0,3,1,5],[5,1,3,2,0,4]];
const paragraphs = paragraphRows.map((item,index) => { const flat=item[2].flat(); const options=paragraphOrders[index].map(i=>flat[i]); const correct=item[2].map(pair=>pair[0]); return {id:'l12_para_' + String(index + 1).padStart(2,'0'),type:'paragraph_fill',stage:'in_class',contentRole:item[3],prompt_cn:item[0],prompt_en:'Choose three expressions to complete the paragraph.',data:{title:item[0],passageParts:[item[1].replace('（1）','____1____').replace('（2）','____2____').replace('（3）','____3____')],options,answers:correct.map(answer=>options.indexOf(answer)),optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange']}}; });

const chainRows = [
  ['春日公园计划','春天到了，我们想去公园。',['开花','工作日','坐船','或者','打电话'],['kāihuā','gōngzuòrì','zuò chuán','huòzhě','dǎ diànhuà']],
  ['天气突然变化','刚才还是晴天，我们走在街上。',['刮起风来','新闻','就今天','一把伞','下起来'],['guāqǐ fēng lái','xīnwén','jiù jīntiān','yì bǎ sǎn','xià qǐlai']],
  ['四季校园','我想介绍校园一年里的变化。',['春天','凉快','叶子','冬天','最喜欢'],['chūntiān','liángkuai','yèzi','dōngtiān','zuì xǐhuan']],
  ['一年住下来','刚来这个城市时，我不太习惯。',['天气','关注','常常','变化','住下来'],['tiānqì','guānzhù','chángcháng','biànhuà','zhù xiàlai']],
  ['改变户外计划','我们准备周末去湖边活动。',['新闻','刮风','雨衣','变成','还是很开心'],['xīnwén','guā fēng','yǔyī','biànchéng','háishì hěn kāixīn']]
];
const chains = chainRows.map((item,index,all) => ({id:'l12_chain_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'五词故事接龙。',prompt_en:'Build one story with five covered words.',openEnded:true,needsTeacherReview:true,data:{title:item[0],starter:item[1],steps:item[2].map((word,i)=>'第' + (i + 1) + '句：使用“' + word + '”继续故事。'),keywords:item[2],keywords_pinyin:item[3],chainModes:['teacher','race','team'],instructions:'五个词先全部盖住，每次打开一个词并接一句，最后形成完整故事。',answerPlaceholder:'用当前打开的词继续故事。'}}));

const taskRows = [
  ['选择户外活动日期','活动组织者',['或者……或者……','工作日','公园'],['说明天气和地点','列出两个日期','说明选好后怎样联系'],'完成30秒活动计划。'],
  ['借出雨具','有准备的同学',['刮起风来','一把伞','借给'],['描述原来的天气','说明变化开始','把雨具借给朋友'],'完成一段互助对话。'],
  ['找出例外','天气观察员',['都','就','例外'],['说一般情况','指出一个例外','解释为什么特别'],'完成两句对比表达。'],
  ['介绍四季','城市介绍者',['春天','凉快','叶子','冬天'],['介绍四季特点','选择最喜欢的季节','说明真实理由'],'完成45秒季节介绍。'],
  ['总结长期体验','生活指南作者',['住下来','变化','习惯'],['说明时间','总结变化','提出一条建议'],'完成指南结尾。']
];
const taskCards = taskRows.map((item,index,all) => ({id:'l12_task_' + String(index + 1).padStart(2,'0'),type:'open_response',stage:'in_class',contentRole:roleFor(index,all.length),prompt_cn:'任务卡：' + item[0] + '。',prompt_en:item[0],openEnded:true,needsTeacherReview:true,data:{title:item[0],titleEn:item[0],role:item[1],steps:item[3],keywords:item[2],output:item[4],answerPlaceholder:'请写下课堂表达。'}}));

const battleGames = {
  roulette:[
    {id:'l12_roulette_01',prompt:'说一个春天的户外活动计划，列出两个日期。'},
    {id:'l12_roulette_02',prompt:'描述晴天怎样突然变成刮风或下雨。'},
    {id:'l12_roulette_03',prompt:'用“就”说一个数量少的情况。'},
    {id:'l12_roulette_04',prompt:'介绍你最喜欢的季节和原因。'},
    {id:'l12_roulette_05',prompt:'用“下来”总结这一学期的一个感受。'}
  ],
  relay:[
    {id:'l12_relay_01',starter:'刚才还是晴天，后来……',topic:'同一天天气事件'},
    {id:'l12_relay_02',starter:'春天到了，我们或者……',topic:'四季与活动'},
    {id:'l12_relay_03',starter:'这一年住下来，我……',topic:'长期生活体验'}
  ],
  monopoly:{theme:'light',boardStyle:'winding',tasks:[
    {id:'l12_monopoly_01',type:'word',prompt:'解释“工作日”。'},
    {id:'l12_monopoly_02',type:'sentence',prompt:'用“或者……或者……”造句。'},
    {id:'l12_monopoly_03',type:'choice',prompt:'选择带伞或穿雨衣，并说明理由。'},
    {id:'l12_monopoly_04',type:'explain',prompt:'“就今天没带”中的“就”表示什么？'},
    {id:'l12_monopoly_05',type:'act',prompt:'表演突然刮起风来的反应。'},
    {id:'l12_monopoly_06',type:'season',prompt:'用两句话介绍一个季节。'},
    {id:'l12_monopoly_07',type:'sentence',prompt:'用“下来”总结一个项目。'},
    {id:'l12_monopoly_08',type:'word',prompt:'解释“借给你”的方向。'},
    {id:'l12_monopoly_09',type:'choice',prompt:'说一个“少”和一个“例外”的“就”句。'},
    {id:'l12_monopoly_10',type:'season',prompt:'比较你的城市和北京的一个季节。'},
    {id:'l12_monopoly_11',type:'act',prompt:'表演打开伞或穿雨衣。'},
    {id:'l12_monopoly_12',type:'explain',prompt:'说出春夏秋冬各一个特点。'}
  ]}
};

const homework = {
  mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,
  instructions:{required:'完成“我的天气、出行与四季生活指南”的当次准备卡；A和B保存的材料必须用于C。',optional:'不需要上传录音；可带自制卡片和不含隐私的地点、天气或季节图片。',aiPolicy:'先独立记录真实地点、天气和个人偏好，再使用工具检查语言。'},
  sessionMeta:{A:{title:'户外活动计划卡',carryTo:'B、C'},B:{title:'天气变化与应对卡',carryTo:'C'},C:{title:'我的天气、出行与四季生活指南',presentation:'1—2分钟课堂分享'}},
  sessions:{
    A:[
      {id:'post_l12_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'生活指南 1/3 · 选择活动',required:true,prompt_cn:'选择一个真实或合理的户外活动：天气、地点、日期和活动是什么？',prompt_en:'Choose one realistic outdoor activity. What is the weather, place, possible date and activity?',answerPlaceholder:'天气……。地点……。我想……。',needsTeacherReview:true,openEnded:true},
      {id:'post_l12_a_plan',type:'project_card',taskLabel:'户外活动计划卡',projectStage:'生活指南 1/3 · 保存到最终展示',required:true,prompt_cn:'写清天气、地点、活动、两个日期选择和需要带的物品；至少使用一次“或者……，或者……”。',prompt_en:'Create one outdoor activity plan card. State the weather, place, activity, two possible dates and what to bring. Use 或者……，或者…… at least once.',answerPlaceholder:'天气：……。地点：……。活动：……。或者……，或者……。我要带……。',needsTeacherReview:true,openEnded:true,wordBank:['街','开花','公园','船','工作日','地方','或者……或者……'],picturePrompts:['一张自制活动计划卡','一张不含姓名、门牌或定位信息的地点或天气图片'],scaffoldLevels:[{label:'基础层 / Support',instruction:'按句框完成5句话，并列出两个日期。'},{label:'标准层 / Core',instruction:'独立写完整计划，自然使用“或者……，或者……”。'},{label:'挑战层 / Challenge',instruction:'比较两个地点或两个活动，说明选择依据和个人理由。'}]},
      {id:'post_l12_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Outdoor Activity Plan Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Outdoor Activity Plan Card',prompt_en:'Bring your plan card and one privacy-safe place or weather image.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one self-made activity card and one privacy-safe photo of a place or weather condition.','Be ready to answer: What is the weather? Where will you go? What will you do? Which two dates are possible? What must you bring?','Use at least four lesson words and one complete 或者……，或者…… sentence.','Partners may compare plans and check language, but each student must speak. No audio upload is required.'],classroomNote:'Keep this card. You will add a weather-change response card in Homework B.'}
    ],
    B:[
      {id:'post_l12_b_observe',type:'reflection_prompt',taskLabel:'天气观察',projectStage:'生活指南 2/3 · 记录变化',required:true,prompt_cn:'承接A的活动计划：原来是什么天气？后来什么开始发生？',prompt_en:'Continue from Homework A. What was the original weather, and what started to happen later?',answerPlaceholder:'刚才 / 原来……，后来……起来了。',needsTeacherReview:true,openEnded:true,carryFrom:[{session:'A',taskId:'post_l12_a_plan',use:'继续使用同一个活动计划。'}]},
      {id:'post_l12_b_plan',type:'project_card',taskLabel:'天气变化与应对卡',projectStage:'生活指南 2/3 · 保存到最终展示',required:true,prompt_cn:'说明天气变化、一个例外和应对办法。使用一个“起来”句和一个表示例外的“就”句，并说明要带、借或准备什么。',prompt_en:'Create a weather-change response card. State the original weather, what started later, one exception, and what to bring, borrow or prepare. Use one 起来 sentence and one exception sentence with 就.',answerPlaceholder:'刚才……。后来……起来了。大家都……，就……。我需要带 / 借 / 准备……。',needsTeacherReview:true,openEnded:true,wordBank:['刚才','刮起风来','下起来','新闻','一把伞','借给','雨衣','就今天'],picturePrompts:['一张天气变化观察图或自己的简单天气时间线','一张不含个人隐私的雨具或应对方案图片'],carryFrom:[{session:'A',taskId:'post_l12_a_plan',use:'说明原计划怎样受天气影响。'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'按“原来—变化—例外—应对”四步完成句框。'},{label:'标准层 / Core',instruction:'独立写完整变化过程，正确使用“起来”和例外“就”。'},{label:'挑战层 / Challenge',instruction:'比较两个应对方案，说明为什么选择其中一个。'}]},
      {id:'post_l12_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Weather Change Response Card',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Weather Change Response Card',prompt_en:'Bring your Homework A plan card, this response card and one privacy-safe observation image or diagram.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring the Homework A plan card, one weather-change card and one privacy-safe image or simple timeline.','Be ready to answer: What was the original weather? What started? What was the exception? What will you bring, borrow or prepare?','Use one 起来 sentence, one exception sentence with 就 and at least four lesson words.','Partners may check the timeline together, but each student must explain one part. No audio upload is required.'],classroomNote:'Keep both A and B cards. Homework C combines them into the final guide.'}
    ],
    C:[
      {id:'post_l12_c_outline',type:'reflection_prompt',taskLabel:'整合提纲',projectStage:'生活指南 3/3 · 连接A/B材料',required:true,prompt_cn:'把A的活动计划、B的天气变化和一个地方的四季特点连成六个要点。',prompt_en:'Combine the Homework A activity plan, Homework B weather change, and the four-season features of one place into six points.',answerPlaceholder:'1. 活动…… 2. 日期…… 3. 变化…… 4. 应对…… 5. 四季…… 6. 感受……',needsTeacherReview:true,openEnded:true,carryFrom:[{session:'A',taskId:'post_l12_a_plan',use:'活动、地点和日期选择。'},{session:'B',taskId:'post_l12_b_plan',use:'天气变化、例外和应对办法。'}]},
      {id:'post_l12_c_guide',type:'project_card',taskLabel:'我的天气、出行与四季生活指南',projectStage:'生活指南 3/3 · 完成最终作品',required:true,prompt_cn:'整合A/B，介绍活动计划、一次天气变化、应对办法、一个地方的四季、最喜欢的季节和一段时间生活或学习下来的感受。至少使用6个本课词语和4个指定结构。',prompt_en:'Create your final weather, travel and four-season life guide. Include one activity plan, one weather change, your response, the four seasons of one place, your favorite season and a reflection after living or studying for a period. Use at least six lesson words and all four required structures.',answerPlaceholder:'或者……，或者……。后来……起来了。大家都……，就……。四季……。我最喜欢……。这一段时间……下来，我……。',needsTeacherReview:true,openEnded:true,requiredStructures:['或者……或者……','起来','就','下来'],minimumLessonWords:6,carryFrom:[{session:'A',taskId:'post_l12_a_plan',use:'活动计划卡。'},{session:'B',taskId:'post_l12_b_plan',use:'天气变化与应对卡。'}],picturePrompts:['A的活动计划卡','B的天气变化与应对卡','一张隐私安全的城市、校园、天气或季节图片'],scaffoldLevels:[{label:'基础层 / Support',instruction:'按六部分句框准备，每部分说1—2句。'},{label:'标准层 / Core',instruction:'独立完成1—2分钟连贯介绍，包含全部指定结构。'},{label:'挑战层 / Challenge',instruction:'比较两个城市、季节或活动计划，用天气信息和个人体验说明理由。'}]},
      {id:'post_l12_c_present',type:'showcase_plan',taskLabel:'课堂展示',projectStage:'最终课堂作品 · 1—2 minutes',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Weather, Travel and Four-Season Life Guide',prompt_en:'Give a 1–2 minute in-class presentation. An audio upload is not required.',presentationTitle:'Presentation Checklist',presentationPlan:['Bring your A plan card, B response card and one privacy-safe city, campus, weather or season image.','Answer all six points: activity plan, weather change, response, four-season features, favorite season and a longer-term experience.','Use at least six lesson words plus one 或者……或者…… sentence, one 起来 sentence, one 就 sentence and one 下来 sentence.','Groups may prepare and share visual materials, but every student must speak. Present for 1–2 minutes. No audio upload is required.'],classroomNote:'Mistakes and weak points stay collapsed until the student chooses to open them.',carryFrom:[{session:'A',taskId:'post_l12_a_plan',use:'第一部分材料。'},{session:'B',taskId:'post_l12_b_plan',use:'第二部分材料。'}]}
    ]
  }
};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L12',lessonKey:'HSK3-L12',title:'这个季节天气变化很快',titleEn:'The weather changes rapidly in this season',topic:'天气变化、出行应对、四季特点与长期生活体验',courseModel:'三次课：春日景物与出行选择 → 天气突变与应对 → 四季介绍与个人生活指南',sourceTextPolicy:'四篇教材中文和拼音逐行保留；课文三两处疑似“今年”拼音错误及课文四注释“不大多小”保留为待核问题，不静默修改；英文译文、生活讨论、练习和任务属于教学扩展。',textbookIssues:[
    {location:'课文三第六句',source:'jīntiān',suspected:'jīnnián',handling:'保留教材拼音，标记待原始页面核对。'},
    {location:'课文三第七句',source:'jīntián dōngtiān',suspected:'jīnnián dōngtiān',handling:'保留教材拼音，标记待原始页面核对。'},
    {location:'课文四注释',source:'不大多小',suspected:'不大不小',handling:'不写入正式语法或例句，标记待原始页面核对。'}
  ]},
  pedagogy:{exerciseMix:{lessonTargetPercent:45,transferTargetPercent:33,reviewTargetPercent:22},speakingParticipation:'任务可介绍中国、学生自己的国家、城市或校园；每位学生都要发言，不要求上传录音。',cultureFactPolicy:'季节与气候体验允许不同答案，不设置唯一生活立场。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：春日景物与出行选择',textIds:['t_hsk3_l12_01'],previewMissionId:'pm_hsk3_l12_a',focus:['街道、公园与开花','工作日与个人安排','或者……或者……','户外活动计划卡']},
    {id:'B',title:'第二次课：突然变化的天气与应对',textIds:['t_hsk3_l12_02'],previewMissionId:'pm_hsk3_l12_b',focus:['晴天到刮风下雨','起来的引申用法','就表示例外','天气变化与应对卡']},
    {id:'C',title:'第三次课：四季、气候体验与个人偏好',textIds:['t_hsk3_l12_03','t_hsk3_l12_04'],previewMissionId:'pm_hsk3_l12_c',focus:['就表示数量少','下来的引申用法','四季特点与偏好','1—2分钟生活指南']}
  ],
  vocabScenes:sceneData,
  vocabulary,
  grammar,
  texts,
  grammarTeachingNotes,
  textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(item => [item.id,{session:item.tags[0],phrases:item.phrases,sourceType:item.sourceType}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l12_a',vocabularyIds:vocabulary.map(item=>item.id),grammarIds:grammar.map(item=>item.id),progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L12-v1'},reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],readingData:[{id:'pre_l12_read',title:'我的天气、出行与四季生活指南',text:'我先做户外活动计划卡，再增加天气变化与应对卡。最后，我会把两张卡和四季介绍合在一起，完成1—2分钟课堂分享。'}]},
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
      {id:'l12_info_01',type:'info_match',stage:'in_class',prompt_cn:'人物与信息匹配。',prompt_en:'Match each person with the information.',data:{people:['王一飞','白家月','活动组织者','生活指南作者'],clues:['住一年多后比较四季体验','今天没带伞并想去公园坐船','列出两个日期与所需物品','整合活动、天气和季节偏好'],answer:['王一飞-住一年多后比较四季体验','白家月-今天没带伞并想去公园坐船','活动组织者-列出两个日期与所需物品','生活指南作者-整合活动、天气和季节偏好']}},
      {id:'l12_info_02',type:'info_match',stage:'in_class',prompt_cn:'结构与功能匹配。',prompt_en:'Match each structure with its communicative job.',data:{people:['或者A，或者B','动词+起来','就+数量','都……就+例外','动词+下来'],clues:['列出备选方案','表示动作或状态开始','强调数量少','指出不同的一项','总结经过时间或困难的结果'],answer:['或者A，或者B-列出备选方案','动词+起来-表示动作或状态开始','就+数量-强调数量少','都……就+例外-指出不同的一项','动词+下来-总结经过时间或困难的结果']}}
    ],
    pk_question:[
      ['____明天去，____后天去，我再告诉你。','或者……或者……',['或者……或者……','还是……还是……','就……把……','起来……下来……'],'或者……或者……'],
      ['外面突然刮____风来了。','起',['起','下','把','就'],'起来'],
      ['今年冬天____下了一次雪。','就',['就','或者','把','起来'],'就']
    ].map((item,index)=>({id:'l12_pk_' + String(index + 1).padStart(2,'0'),type:'choice',prompt_cn:item[0],prompt_en:'Choose the expression that completes the sentence.',correct_answer:item[1],kp:item[3],data:{question_cn:item[0],question_en:'Choose the expression that completes the sentence.',options:item[2],correct_index:item[2].indexOf(item[1])}})),
    textQa:[],
    pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{focus:['春日景物与出行词汇','或者……或者……','起来的开始义','就表示数量少和例外','下来的完成与体验义','天气变化与应对','四季与个人偏好','我的天气、出行与四季生活指南'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应A/B/C五阶段预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'用A的活动卡和B的应对卡重新完成一次1分钟生活指南分享。'}]}
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log('Wrote ' + out);
