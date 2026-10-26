const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L12.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L12-USE-PILOT-V1.json');

function read(filePath) {
  const buffer = fs.readFileSync(filePath);
  const text = buffer.toString('utf8');
  return { sha256: crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex').toUpperCase(), data: JSON.parse(text) };
}

const taskDesigns = [
  {
    id:'T1', textIndex:0, icon:'🌸', label:'课文 1', title:'协商一次春日公园活动',
    goal:'邀请同学去公园，并在当天不能成行时协商新的日期和联系办法。',
    goalEn:'Invite a classmate to the park and agree on a new date and follow-up plan when today does not work.',
    entry:{ promptCn:'看图。请先用一两句话说说你想去哪里、想做什么。', promptEn:'Look at the picture and say where you want to go and what you want to do in one or two sentences.', stimulus:{ type:'image', image:'images/hsk3-l12/photo-text-1-spring-street.png', labelCn:'春日街景', altCn:'春天街上的树已经开花', instructionCn:'先观察春天的街景，再提出一个简单活动想法。', instructionEn:'Observe the spring street scene, then suggest one simple activity.' } },
    exit:{ promptCn:'请完成一段可以执行的公园邀约：说明春日景象、地点和活动，解释今天不能一起去的原因，用“或者……，或者……”给出两个日期，并说明怎样继续联系。', promptEn:'Give a practical park invitation. Describe the spring scene, place and activity, explain why today does not work, offer two dates with “或者……，或者……”, and say how you will follow up.' },
    exitRequirements:[['scene','春日景象'],['activity','地点和活动'],['reason','今天不能成行的原因'],['dates','两个备选日期'],['contact','下一步联系方式']],
    supportCards:[['t1_words','词汇提示','开花、公园、船、地方、工作日'],['t1_frame','句式提示','我想去……／今天不能……，因为……／或者明天去，或者后天去。'],['t1_order','表达顺序','春日景象 → 活动 → 时间冲突 → 两个日期 → 联系办法']]
  },
  {
    id:'T2', textIndex:1, icon:'🌧️', label:'课文 2', title:'突然变天时提醒并帮助同学',
    goal:'说明天气怎样突然变化，并向没有带雨具的同学提供具体帮助。',
    goalEn:'Explain a sudden weather change and offer practical help to a classmate without rain gear.',
    entry:{ promptCn:'看图。请先说说天气发生了什么变化，或者给同学一条简单建议。', promptEn:'Look at the picture and briefly describe the weather change or give one suggestion.', stimulus:{ type:'image', image:'images/hsk3-l12/photo-text-2-wind-starts.png', labelCn:'天气突变', altCn:'晴天以后突然刮起风来', instructionCn:'观察天空、树叶和人物，说出天气正在发生什么变化。', instructionEn:'Observe the sky, leaves and people, and say how the weather is changing.' } },
    exit:{ promptCn:'请完成一段“天气提醒＋雨具帮助”表达：说清刚才的天气，用“起来”说明风雨开始，用“就”说明今天的例外，正确说出借伞或雨衣的方向，并给出立即行动。', promptEn:'Give a weather warning and offer rain gear. Describe the earlier weather, use “起来” for the change, use “就” for today’s exception, lend an umbrella or raincoat in the correct direction, and suggest an immediate action.' },
    exitRequirements:[['change','刚才和现在的天气'],['start','用“起来”说明开始'],['exception','用“就”说明例外'],['help','正确说明借雨具'],['action','立即行动']],
    supportCards:[['t2_words','词汇提示','刚才、刮、风、伞、借、把、雨衣、变化'],['t2_frame','句式提示','刚才还是……，现在……起来了。／我每天都……，就今天……。／我可以把……借给你。'],['t2_order','表达顺序','原来的天气 → 天气变化 → 今天的例外 → 提供雨具 → 快点行动']]
  },
  {
    id:'T3', textIndex:2, icon:'❄️', label:'课文 3', title:'向新同学介绍本地冬季体验',
    goal:'介绍冬天的天气和下雪情况，说明自己的适应感受，并给新同学出行建议。',
    goalEn:'Describe the local winter and snowfall, explain how you have adapted, and give a new classmate practical advice.',
    entry:{ promptCn:'看图。请先用一两句话说说这里的冬天怎么样，或者你是否习惯。', promptEn:'Look at the picture and say what winter is like here or whether you are used to it.', stimulus:{ type:'image', image:'images/hsk3-l12/photo-text-3-winter-window.png', labelCn:'冬季体验', altCn:'人物从窗边观察冬天的雪景', instructionCn:'根据冬季窗景说出天气特点和自己的感受。', instructionEn:'Use the winter window scene to describe the weather and your feeling.' } },
    exit:{ promptCn:'请向新同学介绍本地冬季：说明你住了多久、还不习惯什么，分别说出对寒冷和雪景的看法，用“就”说明今年下雪次数少，并给出关注天气的建议。', promptEn:'Introduce the local winter to a new classmate. Say how long you have lived here, what you are not used to, how you feel about the cold and snow, use “就” to show that snowfall was limited this year, and give weather advice.' },
    exitRequirements:[['duration','居住时间'],['adaptation','还不习惯的方面'],['attitude','寒冷和雪景的不同感受'],['limited','用“就”突出次数少'],['advice','关注天气的建议']],
    supportCards:[['t3_words','词汇提示','冬天、常常、关注、天气、下雪'],['t3_frame','句式提示','我在这里住了……／我还不太习惯……／虽然……，但是……／今年就……／出门前要……'],['t3_order','表达顺序','住了多久 → 是否习惯 → 冬天和雪 → 今年的情况 → 建议']]
  },
  {
    id:'T4', textIndex:3, icon:'🍂', label:'课文 4', title:'制作城市四季推荐卡',
    goal:'介绍城市的四季特点，并根据长期生活体验推荐适合来访的季节。',
    goalEn:'Describe a city’s seasons and recommend a good time to visit based on long-term experience.',
    entry:{ promptCn:'看图。请先说出你最喜欢的季节和一个简单理由。', promptEn:'Look at the picture and name your favorite season with one simple reason.', stimulus:{ type:'image', image:'images/hsk3-l12/photo-text-4-autumn-diary.png', labelCn:'四季日记', altCn:'秋天的红黄叶子和一篇四季日记', instructionCn:'观察季节景象，先说出自己的季节偏好。', instructionEn:'Observe the seasonal scene and state your preference.' } },
    exit:{ promptCn:'请完成一张城市四季推荐卡：至少介绍三个季节，说明最喜欢或最不喜欢的季节和原因，用“下来”概括长期居住后的感受，最后询问对方的偏好。', promptEn:'Create a city seasons recommendation. Describe at least three seasons, explain your favorite or least favorite season, use “下来” to summarize long-term experience, and ask about the listener’s preference.' },
    exitRequirements:[['seasons','至少三个季节'],['preference','喜欢或不喜欢的季节'],['reason','真实理由'],['experience','用“下来”总结长期体验'],['question','询问对方偏好']],
    supportCards:[['t4_words','词汇提示','四季、春天、夏天、凉快、秋天、叶子、变成'],['t4_frame','句式提示','春天……，夏天……，秋天……／这一年住下来……／我最喜欢……，因为……／你最喜欢哪个季节？'],['t4_order','表达顺序','三个季节 → 长期感受 → 个人选择 → 理由 → 询问对方']]
  }
];

const overviewSets = [
  [
    ['l12_m1_overall_01','main_idea','这段对话主要在谈什么？',['商量一次公园活动','准备雨具','比较北京四季'],0],
    ['l12_m1_overall_02','development','对话是怎样发展的？',['看到春景、提出活动、遇到时间冲突、继续协商','先借伞，再去上课','先下雪，再去坐船'],0],
    ['l12_m1_overall_03','purpose','王一飞今天没时间，两个人最后怎么办？',['换一天去公园','今天下午去公园','不去公园了'],0]
  ],
  [
    ['l12_m2_overall_01','main_idea','这段对话主要在谈什么？',['天气突然变化和雨具帮助','春游日期','冬天的雪景'],0],
    ['l12_m2_overall_02','development','情况发生了什么变化？',['天气由晴转坏，两个人准备快走','雨停以后去坐船','天气一直没有变化'],0],
    ['l12_m2_overall_03','purpose','两个人在解决什么问题？',['一个人没有带雨具，另一个人提供帮助','两个人都没有课','两个人要买船票'],0]
  ],
  [
    ['l12_m3_overall_01','main_idea','这段对话主要在谈什么？',['对本地天气的适应和冬季感受','去公园的计划','夏天晚上散步'],0],
    ['l12_m3_overall_02','development','他们怎么说这里的冬天？',['天气冷，下雪的时候很漂亮','天气很热，从来不下雪','每天都下大雨'],0],
    ['l12_m3_overall_03','purpose','他们为什么说到下雪？',['因为他们在说冬天的天气','因为他们要买雨衣','因为他们要去坐船'],0]
  ],
  [
    ['l12_m4_overall_01','main_idea','这篇日记主要写什么？',['北京四季的特点和作者的感受','一次公园活动','借雨衣的经过'],0],
    ['l12_m4_overall_02','development','日记按什么顺序介绍内容？',['春、夏、秋、冬，再说明个人偏好','冬、春、夏，再介绍新闻','按照人物对话顺序'],0],
    ['l12_m4_overall_03','purpose','作者介绍自己的四季感受以后，还想做什么？',['了解读者最喜欢的季节','请读者马上去北京','让所有人选择同一个季节'],0]
  ]
];

const detailSets = [
  [
    ['l12_m1_detail_01','街上的树怎么了？','Jiē shàng de shù zěnme le?','街上的树都开花了。','Jiē shàng de shù dōu kāihuā le.',['街上的树都开花了','树都开花了'],'春景的具体变化'],
    ['l12_m1_detail_02','白家月为什么想去公园？','Bái Jiāyuè wèishénme xiǎng qù gōngyuán?','因为天气很好，她想去公园坐船。','Yīnwèi tiānqì hěn hǎo, tā xiǎng qù gōngyuán zuò chuán.',['天气好，想去公园坐船','因为天气很好，她想坐船'],'活动原因'],
    ['l12_m1_detail_03','王一飞为什么今天不能去太远的地方？','Wáng Yīfēi wèishénme jīntiān bù néng qù tài yuǎn de dìfang?','因为她今天下午有课。','Yīnwèi tā jīntiān xiàwǔ yǒu kè.',['她下午有课','因为下午有课'],'时间冲突'],
    ['l12_m1_detail_04','他们最后提出了哪两个日期？谁再打电话？','Tāmen zuìhòu tíchū le nǎ liǎng ge rìqī? Shéi zài dǎ diànhuà?','或者明天去，或者后天去，王一飞再打电话。','Huòzhě míngtiān qù, huòzhě hòutiān qù, Wáng Yīfēi zài dǎ diànhuà.',['明天或者后天，王一飞再打电话','明天、后天，王一飞联系'],'两个具体日期与联系人']
  ],
  [
    ['l12_m2_detail_01','天气先后发生了什么变化？','Tiānqì xiānhòu fāshēng le shénme biànhuà?','先刮起风来，后来雨也下起来了。','Xiān guā qǐ fēng lái, hòulái yǔ yě xià qǐlái le.',['先刮风，后来下雨','风起来以后又下雨'],'变化顺序'],
    ['l12_m2_detail_02','白家月平时带伞吗？今天呢？','Bái Jiāyuè píngshí dài sǎn ma? Jīntiān ne?','她平时带雨伞，就今天没带。','Tā píngshí dài yǔsǎn, jiù jīntiān méi dài.',['每天带伞，就今天没带','平时带，今天没带'],'一般情况与例外'],
    ['l12_m2_detail_03','王一飞可以借给白家月什么？','Wáng Yīfēi kěyǐ jiè gěi Bái Jiāyuè shénme?','一把伞或者一件雨衣。','Yì bǎ sǎn huòzhě yí jiàn yǔyī.',['伞或者雨衣','一把伞或一件雨衣'],'帮助内容'],
    ['l12_m2_detail_04','“刮起风来、下起雨来”中的“起来”表示什么？','“Guā qǐ fēng lái, xià qǐ yǔ lái” zhōng de “qǐlái” biǎoshì shénme?','表示风和雨开始了。','Biǎoshì fēng hé yǔ kāishǐ le.',['表示动作开始','表示进入新状态'],'语言理解']
  ],
  [
    ['l12_m3_detail_01','王一飞在这里住了多长时间？','Wáng Yīfēi zài zhèlǐ zhù le duō cháng shíjiān?','已经一年多了。','Yǐjīng yì nián duō le.',['一年多','已经一年多'],'居住时间'],
    ['l12_m3_detail_02','她还不太习惯什么？','Tā hái bú tài xíguàn shénme?','她还不太习惯这里的天气。','Tā hái bú tài xíguàn zhèlǐ de tiānqì.',['这里的天气','还不太习惯这里的天气'],'未适应内容'],
    ['l12_m3_detail_03','白家月怎样评价这里的冬天和雪？','Bái Jiāyuè zěnyàng píngjià zhèlǐ de dōngtiān hé xuě?','冬天虽然冷，但是下雪的时候特别漂亮。','Dōngtiān suīrán lěng, dànshì xiàxuě de shíhou tèbié piàoliang.',['冬天冷，但是雪很漂亮','虽然冷，但是下雪很美'],'态度对比'],
    ['l12_m3_detail_04','为什么“今年就下了一次雪”说明雪少？','Wèishénme “jīnnián jiù xià le yí cì xuě” shuōmíng xuě shǎo?','因为北京冬天常常下雪，一次比平时少。','Yīnwèi Běijīng dōngtiān chángcháng xiàxuě, yí cì bǐ píngshí shǎo.',['因为一次比平时少','“就”突出次数少'],'原因与“就”的含义']
  ],
  [
    ['l12_m4_detail_01','作者为什么觉得春天最舒服？','Zuòzhě wèishénme juéde chūntiān zuì shūfu?','因为春天天气不冷不热。','Yīnwèi chūntiān tiānqì bù lěng bù rè.',['春天不冷不热','天气很舒服'],'春季特点与原因'],
    ['l12_m4_detail_02','夏天晚上和秋天的叶子分别有什么特点？','Xiàtiān wǎnshang hé qiūtiān de yèzi fēnbié yǒu shénme tèdiǎn?','夏天晚上比较凉快，秋天的叶子会变成红色、黄色。','Xiàtiān wǎnshang bǐjiào liángkuai, qiūtiān de yèzi huì biànchéng hóngsè, huángsè.',['夏天晚上凉快，秋天叶子变色'],'两个具体季节特征'],
    ['l12_m4_detail_03','“住下来”在日记中强调什么？','“Zhù xiàlái” zài rìjì zhōng qiángdiào shénme?','强调经过一段时间居住后形成的经验和感受。','Qiángdiào jīngguò yí duàn shíjiān jūzhù hòu xíngchéng de jīngyàn hé gǎnshòu.',['住了一年多以后形成的感受','长期生活后的经验'],'语言理解'],
    ['l12_m4_detail_04','作者最不喜欢哪个季节？为什么？','Zuòzhě zuì bù xǐhuan nǎge jìjié? Wèishénme?','冬天，因为不但冷，而且风很大。','Dōngtiān, yīnwèi búdàn lěng, érqiě fēng hěn dà.',['冬天，因为冷而且风大','最不喜欢冬天'],'个人态度与原因']
  ]
];

const tierById = {};
'02,03,04,06,07,08,09,12,13,18,19,20,21,22,23,24,25'.split(',').forEach(number => { tierById[`v12_${number}`] = 'expression'; });
'01,05,10,11,14,15,17,26,27'.split(',').forEach(number => { tierById[`v12_${number}`] = 'understanding'; });
tierById.v12_16 = 'context';

const meaningCnById = {
  v12_01:'两边有商店或房子的道路。',v12_02:'植物长出花。',v12_03:'供人散步、休息的公共场所。',v12_04:'在水上行驶的交通工具。',v12_05:'正常工作或上课的日子。',v12_06:'某一个地点或空间。',
  v12_07:'离现在很近的过去时间。',v12_08:'风吹动。',v12_09:'流动的空气。',v12_10:'最近发生的公开信息。',v12_11:'挡雨或挡太阳的用品。',v12_12:'暂时给别人用，或暂时使用别人的东西。',v12_13:'有柄物品的量词。',v12_14:'下雨时穿的防雨衣服。',v12_15:'跟原来不一样。',v12_16:'一年中有共同天气特点的一段时间。',v12_17:'人或事物变得与以前不同。',
  v12_18:'一年中通常最冷的季节。',v12_19:'很多时候都会。',v12_20:'持续注意。',v12_21:'春、夏、秋、冬。',v12_22:'冬天以后、夏天以前的季节。',v12_23:'一年中通常最热的季节。',v12_24:'温度较低，让人感觉舒服。',v12_25:'夏天以后、冬天以前的季节。',v12_26:'植物枝上通常是绿色的部分。',v12_27:'从一种状态成为另一种状态。'
};

function expressionPair(mini, number, stimulus, answer, phrase, example) {
  const wordId = `v12_${number}`;
  const prefix = `l12_m${mini}_v${number}`;
  return [
    { id:`${prefix}_input`, type:'input', targetWordIds:[wordId], promptCn:'根据意思或语境输入词语。', promptEn:'Type the missing Chinese word from the meaning or context.', stimulus, answer, acceptedAnswers:[answer], options:[], promptMode:'meaning', evaluation:'automatic' },
    { id:`${prefix}_use`, type:'collocation', targetWordIds:[wordId], promptCn:`用“${phrase}”完成表达，最多两句话。`, promptEn:'Use the phrase in one or two complete sentences.', stimulus:phrase, answer:example, acceptedAnswers:[], options:[], promptMode:'open_use', evaluation:'teacher' }
  ];
}

const activityRows = [
  [1,'02','春天到了，校园里的树开始____了。','开花','树开花了','春天到了，街上的树都开花了。'],
  [1,'03','周末我们想去____散步。','公园','去公园','天气很好，我想和同学去公园。'],
  [1,'04','湖上有一条小____。','船','坐船','到了公园以后，我们想坐船。'],
  [1,'05','星期一到星期五一般是____。','工作日','今天是工作日','今天是工作日，公园里的人应该不多。'],
  [1,'06','下午有课，我不能去太远的____。','地方','太远的地方','我下午有课，不能去太远的地方。'],
  [2,'07','____还是晴天，现在已经刮风了。','刚才','刚才还是……','刚才还是晴天，现在已经下雨了。'],
  [2,'08','外面开始____风了。','刮','刮起风来','外面突然刮起风来了。'],
  [2,'09','今天的____很大。','风','风很大','今天风很大，出门要小心。'],
  [2,'11','下雨了，别忘了带____。','伞','带一把伞','天气预报说有雨，我会带一把伞。'],
  [2,'12','我有两把伞，可以____给你一把。','借','借给你','我可以把车里的雨衣借给你。'],
  [2,'13','车里有一____伞。','把','一把伞','我书包里有一把伞。'],
  [2,'14','雨太大了，我想穿____。','雨衣','穿雨衣','雨下起来了，我要穿雨衣。'],
  [2,'17','春天的天气____很快。','变化','天气变化','这个季节天气变化很快。'],
  [3,'18','一年四季中最冷的是____。','冬天','冬天太冷','我觉得这里的冬天太冷了。'],
  [3,'19','北京冬天____下雪。','常常','常常下雪','北京冬天常常下雪。'],
  [3,'20','出门以前要____天气变化。','关注','关注天气','我每天出门以前都会关注天气。'],
  [4,'21','春、夏、秋、冬合起来叫____。','四季','北京的四季','北京的四季很不一样。'],
  [4,'22','天气不冷不热的季节是____。','春天','春天最舒服','我觉得春天最舒服。'],
  [4,'23','白天很热、晚上较凉快的季节是____。','夏天','夏天白天很热','夏天白天很热，但是晚上比较凉快。'],
  [4,'24','夏天晚上比较____。','凉快','晚上比较凉快','我们这里夏天晚上比较凉快。'],
  [4,'25','叶子开始变红变黄时是____。','秋天','秋天的叶子','秋天的叶子非常漂亮。']
];

const activitiesByGroup = Object.fromEntries([1,2,3,4].map(mini => [mini, activityRows.filter(row => row[0] === mini).flatMap(row => expressionPair(...row))]));
const shapeRows = [
  [1,'01','jiē：两边有房子或商店的道路','街',['街','待','衔','往']],
  [1,'02','kāihuā：植物长出花','开花',['开花','开华','升花','开化']],
  [1,'03','gōngyuán：可以散步休息的公共场所','公园',['公园','公圆','公元','共园']],
  [1,'05','gōngzuòrì：正常工作或上课的日子','工作日',['工作日','工做日','工作目','公作日']],
  [1,'06','dìfang：某一个地点','地方',['地方','地放','他方','的方']],
  [2,'07','gāngcái：离现在很近的过去时间','刚才',['刚才','钢才','刚材','岗才']],
  [2,'08','guā：风开始吹动','刮',['刮','乱','舌','适']],
  [2,'09','fēng：流动的空气','风',['风','凤','凡','冈']],
  [2,'10','xīnwén：最近发生的公开信息','新闻',['新闻','新问','亲闻','新间']],
  [2,'12','jiè：暂时给别人使用','借',['借','错','措','惜']],
  [2,'13','bǎ：伞等有柄物品的量词','把',['把','吧','爸','抱']],
  [2,'14','yǔyī：下雨时穿的衣服','雨衣',['雨衣','两衣','雨依','雨农']],
  [2,'17','biànhuà：天气跟以前不同了','变化',['变化','变花','弯化','恋化']],
  [3,'18','dōngtiān：一年中通常最冷的季节','冬天',['冬天','东天','终天','各天']],
  [3,'19','chángcháng：很多时候都会','常常',['常常','长长','尝尝','裳裳']],
  [3,'20','guānzhù：持续注意天气情况','关注',['关注','观注','关住','观住']],
  [4,'21','sìjì：春、夏、秋、冬','四季',['四季','四李','回季','四际']],
  [4,'22','chūntiān：冬天以后、夏天以前','春天',['春天','看天','秦天','香天']],
  [4,'23','xiàtiān：一年中通常最热的季节','夏天',['夏天','复天','厦天','下天']],
  [4,'24','liángkuai：温度较低而且舒服','凉快',['凉快','谅快','晾块','凉块']],
  [4,'25','qiūtiān：夏天以后、冬天以前','秋天',['秋天','伙天','种天','愁天']],
  [4,'27','biànchéng：从一种状态成为另一种状态','变成',['变成','弯成','恋成','变城']]
];
shapeRows.forEach(([mini, number, stimulus, answer, options]) => activitiesByGroup[mini].push({
  id:`l12_v${number}_form`, type:'shape', targetWordIds:[`v12_${number}`], promptCn:'根据拼音和意思选择正确的汉字词。', promptEn:'Choose the correct Chinese form from the pinyin and meaning.', stimulus, answer, acceptedAnswers:[answer], options, promptMode:'form', evaluation:'automatic'
}));

const wordGroups = [
  ['01','02','03','04','05','06'],
  ['07','08','09','10','11','12','13','14','15','16','17'],
  ['18','19','20'],
  ['21','22','23','24','25','26','27']
].map(numbers => numbers.map(number => `v12_${number}`));

const vocabularyGroups = wordGroups.map((wordIds, index) => ({
  id:`T${index + 1}`, textIndex:index, title:taskDesigns[index].title, wordIds, recognitionWordIds:wordIds.slice(), activities:activitiesByGroup[index + 1]
}));

const resourceLinks = [
  [['l12_task_01','ready','公园活动任务'],['l12_para_01','ready','春日计划段落']],
  [['l12_task_02','needs_revision','天气提醒与雨具帮助'],['l12_para_02','ready','天气突变段落']],
  [['l12_pic_06','ready','冬季次数看图表达'],['l12_para_04','ready','长期适应段落']],
  [['l12_task_04','needs_revision','城市四季介绍'],['l12_para_03','ready','四季校园段落']]
];

const grammarBridges = [
  { evidence:'或者明天去，或者后天去，我给你打电话。', focus:'或者 + 选择一，或者 + 选择二', actionLabel:'进入“或者……，或者……”', grammarIndex:0 },
  { evidence:'我每天书包里都放着雨伞，就今天没带。', focus:'一般情况 + 就 + 数量少或唯一例外', actionLabel:'进入范围副词“就”', grammarIndex:2 },
  { evidence:'北京常常下雪，但听说今年就下了一次。', focus:'就 + 数量，突出比预期少', actionLabel:'进入范围副词“就”', grammarIndex:2 },
  { evidence:'这一年多住下来，我还是更喜欢北京的四季。', focus:'动词 + 下来，表示过程延续后形成的结果或经验', actionLabel:'进入“下来”的引申用法', grammarIndex:3 }
];

const resourceOverrides = [
  {
    id:'l12_task_02',
    patch:{
      prompt_cn:'任务卡：说明天气怎样变化，比较平时和今天的不同，并把伞或雨衣借给同学。',
      prompt_en:'Describe the weather change, contrast the usual situation with today, and lend an umbrella or raincoat to a classmate.',
      data:{
        title:'天气提醒与雨具帮助', titleEn:'Weather warning and rain-gear help', role:'有准备的同学',
        steps:['描述刚才和现在的天气','说明平时怎样、今天有什么例外','把伞或雨衣借给同学'],
        keywords:['刮起风来','就今天没带','把……借给……'], output:'完成3—4句话。', answerPlaceholder:'请写下天气提醒和帮助。',
        sampleAnswer:'刚才还是晴天，现在刮起风来了，雨也下起来了。我每天都带伞，就今天没带。你可以把雨衣借给我吗？'
      }
    }
  },
  {
    id:'l12_task_04',
    patch:{
      prompt_cn:'任务卡：至少介绍三个季节，用“下来”总结长期生活体验，并说明最喜欢或最不喜欢的季节和理由。',
      prompt_en:'Introduce at least three seasons, use “下来” to summarize long-term experience, and explain your favorite or least favorite season.',
      data:{
        title:'城市四季推荐', titleEn:'City seasons recommendation', role:'城市介绍者',
        steps:['至少介绍三个季节','用“下来”总结长期生活体验','说明季节偏好和真实理由'],
        keywords:['四季','住下来','最喜欢／最不喜欢'], output:'完成5—7句话。', answerPlaceholder:'请写下四季推荐。',
        sampleAnswer:'在北京住下来以后，我越来越喜欢这里的四季。春天不冷不热，夏天晚上比较凉快，秋天的叶子会变成红色和黄色。我最喜欢秋天，因为天气舒服，景色也很漂亮。'
      }
    }
  }
];

function build() {
  const formal = read(formalPath);
  const lesson = formal.data;
  if (!lesson.meta || lesson.meta.lessonKey !== 'HSK3-L12') throw new Error('Unexpected formal lesson');
  if (!Array.isArray(lesson.texts) || lesson.texts.length !== 4) throw new Error('L12 must have four texts');

  const grammarLabels = ['“或者……，或者……”','“起来”的引申用法','范围副词“就”','“下来”的引申用法'];
  const practiceRoutes = [
    { module:'practice', submodule:'t2k', label:'任务卡：选择户外活动日期', routeState:{ t2ki:0 } },
    { module:'practice', submodule:'t2k', label:'任务卡：天气提醒与雨具帮助', routeState:{ t2ki:1 } },
    { module:'practice', submodule:'g2p', label:'看图表达：今年就下一次雪', routeState:{ g2pi:5 } },
    { module:'practice', submodule:'t2k', label:'任务卡：城市四季推荐', routeState:{ t2ki:3 } }
  ];
  const paragraphRoutes = [
    { label:'调用“春日计划”段落填空', module:'practice', submodule:'r4p', index:0 },
    { label:'调用“天气突变”段落填空', module:'practice', submodule:'r4p', index:1 },
    { label:'调用“一年以后”段落填空', module:'practice', submodule:'r4p', index:3 },
    { label:'调用“四季校园”段落填空', module:'practice', submodule:'r4p', index:2 }
  ];

  const useGroups = taskDesigns.map((design, index) => ({
    ...design,
    responseMode:'teacherObservedWithTextOutline',
    exitRequirements:design.exitRequirements.map(item => ({ id:item[0], label:item[1] })),
    supportCards:design.supportCards.map(item => ({ id:item[0], labelCn:item[1], labelEn:'Support', contentCn:item[2], contentEn:'' })),
    textId:lesson.texts[index].id,
    entry:{ id:`l12_t${index + 1}_use_entry`, label:'起点表达', labelEn:'Starting expression', ...design.entry },
    exit:{ id:`l12_t${index + 1}_use_exit`, label:'终点表达', labelEn:'Upgraded expression', ...design.exit },
    linkedResources:{
      vocabulary:{ module:'teach', submodule:'tv', label:`课文${index + 1}词汇`, vocabSession:String(index + 1) },
      grammar:{ module:'teach', submodule:'tg', label:grammarLabels[index], grammarIndex:index },
      text:{ module:'teach', submodule:'tt', label:`课文${index + 1}`, textIndex:index },
      practice:practiceRoutes[index]
    },
    resourceLinks:resourceLinks[index].map(item => ({ id:item[0], status:item[1], purpose:item[2] }))
  }));

  const textLearning = lesson.texts.map((text, index) => ({
    textId:text.id,
    useGroupId:`T${index + 1}`,
    title:text.title,
    overviewChoices:overviewSets[index].map(item => ({ id:item[0], focus:item[1], questionCn:item[2], options:item[3], correctIndex:item[4] })),
    detailMode:'config',
    detailQuestions:detailSets[index].map(item => ({ id:item[0], questionCn:item[1], questionPinyin:item[2], answer:item[3], answerPinyin:item[4], acceptedAnswers:item[5], informationPoint:item[6] })),
    grammarBridge:grammarBridges[index],
    paragraphPractice:paragraphRoutes[index],
    lifeTransfer:index === 3
      ? { promptCn:'每个人都需要喜欢同一个季节吗？请说说你的选择和理由。', promptEn:'Does everyone need to prefer the same season? Explain your own choice.' }
      : { promptCn:taskDesigns[index].exit.promptCn, promptEn:taskDesigns[index].exit.promptEn }
  }));

  const allActivities = vocabularyGroups.flatMap(group => group.activities);
  const recognitionIds = new Set(vocabularyGroups.flatMap(group => group.recognitionWordIds));
  const vocabularyCatalog = lesson.vocabulary.map(word => ({
    id:word.id,
    hanzi:word.hanzi,
    pinyin:word.pinyin,
    english:word.english,
    meaningCn:meaningCnById[word.id],
    phrases:word.phrases || [],
    example:word.example || '',
    tier:tierById[word.id],
    allowedTypes:Array.from(new Set([...(recognitionIds.has(word.id) ? ['recognition'] : []), ...allActivities.filter(item => item.targetWordIds.includes(word.id)).map(item => item.type)]))
  }));

  return {
    schemaVersion:'classpro-use-profile/v3',
    experiment:{ id:'l12-use-pilot-v1', title:'第12课·以用为主线升级版', lessonLabel:'第12课', sourceLesson:'HSK3-L12', scope:'四个课文MINI循环；保留L12原有词汇、语法、课文和练习教学样式。' },
    sources:{ lesson:{ path:'../lessons/HSK3-L12.json', sha256:formal.sha256 }, teacher:{ path:'../../in-class/teacher.html' }, student:{ path:'../../in-class/student.html' } },
    nativeTeaching:{ preserveCourseStyles:true, grammar:{ source:'formal_lesson', preserveExamples:true, preserveHighlights:true, preserveOralQuestions:true, preserveFollowUp:true }, text:{ source:'formal_lesson', preservePresentation:true, preserveDiary:true }, vocabulary:{ source:'formal_lesson', preserveScenes:true, preserveHotspots:true } },
    useGroups,
    textLearning,
    vocabularyTaskTypes:[{id:'recognition',labelCn:'认读',labelEn:'Recognition'},{id:'shape',labelCn:'辨形',labelEn:'Character form'},{id:'input',labelCn:'输入',labelEn:'Type the word'},{id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}],
    timerPolicy:{ miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:4}, vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2}, autoClose:false },
    vocabularyCatalog,
    vocabularyGroups,
    resourceOverrides,
    supportOnlyStructures:[],
    evidencePolicy:{ coreTypes:['entry_expression','actual_learning_path','exit_expression'], pathEvent:'opened', optionalSignals:['support_request','self_reflection','teacher_observation'] },
    supportOptions:[{id:'vocabulary',labelCn:'我缺少合适的词',labelEn:'I need the right words'},{id:'organization',labelCn:'我不知道怎样组织信息',labelEn:'I need help organizing my ideas'},{id:'structure',labelCn:'我需要一个句子结构',labelEn:'I need a sentence frame'},{id:'teacher',labelCn:'我想获得老师的帮助',labelEn:'I want help from the teacher'}],
    feelingOptions:[{id:'clearer',labelCn:'我说得更清楚了',labelEn:'My expression is clearer'},{id:'more_complete',labelCn:'我说得更完整了',labelEn:'My expression is more complete'},{id:'more_natural',labelCn:'我说得更自然了',labelEn:'My expression is more natural'},{id:'still_need_help',labelCn:'我还需要帮助',labelEn:'I still need help'}],
    coreEvidence:['entry_expression','actual_learning_path','exit_expression'],
    capabilities:['select_text_mini_loop','launch_interaction','independent_answer','support_request','anonymous_return','open_support','reanswer','record_teacher_decision','compare_entry_exit','teacher_selected_vocabulary_focus','shared_countdown','native_course_resource_return','configured_task_stimulus']
  };
}

if (require.main === module) {
  fs.writeFileSync(outputPath, `${JSON.stringify(build(), null, 2)}\n`, 'utf8');
  console.log(`Built ${path.relative(root, outputPath)}`);
}

module.exports = { build, outputPath, formalPath };
