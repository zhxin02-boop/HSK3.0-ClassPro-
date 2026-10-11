const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L09.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L09-USE-PILOT-V1.json');

function read(filePath) {
  const buffer = fs.readFileSync(filePath);
  return {
    sha256: crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase(),
    data: JSON.parse(buffer.toString('utf8'))
  };
}

const taskDesigns = [
  {
    id: 'T1', textIndex: 0, icon: '🏅', label: '课文 1', title: '运动会选择、准备与支持',
    goal: '说明自己的运动会选择、目的和准备；不参赛时说明怎样支持同学。',
    goalEn: 'Explain your sports-meet choice, purpose and preparation, or how you will support a classmate.',
    entry: { promptCn: '你想参加什么项目？如果不参加，你准备做什么？', promptEn: 'What event would you join? If you do not join, what will you do?' },
    exit: { promptCn: '再说一次你的选择：说清楚项目或支持角色、目的、最近的准备，以及到时候会做什么。', promptEn: 'State your choice again, including your role, purpose, recent preparation and next action.' },
    exitRequirements: [
      { id: 'role', label: '项目或支持角色' }, { id: 'purpose', label: '选择原因或目的' },
      { id: 'preparation', label: '最近的准备' }, { id: 'action', label: '比赛时的行动' }
    ],
    supportCards: [
      { id: 't1_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '为了、运动会、练、参加、比赛', contentEn: 'Use only the words that fit your own choice.' },
      { id: 't1_frame', labelCn: '表达结构', labelEn: 'Expression frame', contentCn: '我想参加……，为了……，我最近……。到时候我会……。', contentEn: 'Adapt the frame to your own plan.' },
      { id: 't1_support', labelCn: '不参赛也能表达', labelEn: 'Support role', contentCn: '我不参加比赛，但是我会去看比赛、帮助同学或给他们加油。', contentEn: 'Not joining is also a valid choice.' }
    ]
  },
  {
    id: 'T2', textIndex: 1, icon: '🏸', label: '课文 2', title: '邀请并鼓励久未运动的朋友',
    goal: '回应朋友的担心，说明活动目的，并提出容易开始的练习办法。',
    goalEn: 'Respond to a friend’s concern, explain the purpose and suggest an easy way to start.',
    contextCn: '朋友说：“我好多年没打羽毛球了，可能打不好。”',
    entry: { promptCn: '你会怎样邀请并鼓励这位朋友？', promptEn: 'How would you invite and encourage this friend?' },
    exit: { promptCn: '再邀请一次：回应朋友的担心，减轻压力，说明活动目的，并提出一个容易开始的练习办法。', promptEn: 'Invite the friend again with reassurance, purpose and one easy practice step.' },
    exitRequirements: [
      { id: 'invite', label: '自然邀请' }, { id: 'concern', label: '回应担心' },
      { id: 'purpose', label: '活动目的' }, { id: 'practice', label: '容易开始的办法' }
    ],
    supportCards: [
      { id: 't2_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '好多、几乎、只、练习', contentEn: 'Choose words that fit the response.' },
      { id: 't2_possible', labelCn: '可能补语', labelEn: 'Potential complement', contentCn: '接得住 / 接不住；打得好 / 打不好', contentEn: 'Talk about what is possible, not only performance.' },
      { id: 't2_frame', labelCn: '鼓励结构', labelEn: 'Encouraging frame', contentCn: '……也没关系。这不是比赛，只是为了……。我们可以先……。', contentEn: 'Reduce pressure and give a practical first step.' }
    ]
  },
  {
    id: 'T3', textIndex: 2, icon: '⚽', label: '课文 3', title: '说明赛况、原因、变化与决定',
    goal: '用四句话说明比赛情况、原因、情绪变化和接下来的决定。',
    goalEn: 'Explain the match situation, reason, emotional change and next decision in four sentences.',
    entry: { promptCn: '比赛进行得不太顺利，你现在最想说什么？', promptEn: 'The match is not going well. What do you most want to say now?' },
    exit: { promptCn: '完成四句个人评论：球队现在怎样、为什么踢不进去、你的心情怎样变化、你准备怎样做。', promptEn: 'Give a four-sentence personal comment on the situation, reason, emotion and decision.' },
    exitRequirements: [
      { id: 'situation', label: '当前赛况' }, { id: 'reason', label: '原因' },
      { id: 'emotion', label: '情绪变化' }, { id: 'decision', label: '接下来的决定' }
    ],
    supportCards: [
      { id: 't3_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '紧张、主要、受到影响、得分', contentEn: 'Use the match words that support your explanation.' },
      { id: 't3_change', labelCn: '变化结构', labelEn: 'Change structure', contentCn: '越看越……；越来越……', contentEn: 'Show how a feeling changes.' },
      { id: 't3_frame', labelCn: '评论顺序', labelEn: 'Comment order', contentCn: '现在……。主要因为……。我越看越……。我准备……。', contentEn: 'Keep the four ideas in a clear order.' }
    ]
  },
  {
    id: 'T4', textIndex: 3, icon: '🏃', label: '课文 4', title: '推荐一位值得认识的体育人物',
    goal: '完成30至45秒个人介绍，并提交五句个人句子提纲。',
    goalEn: 'Give a 30–45 second personal introduction and submit a five-sentence outline.',
    entry: { promptCn: '请用一两句话写出人物、身份和项目。默认介绍刘长春。', promptEn: 'Name the person, identity and sport in one or two sentences.' },
    exit: { promptCn: '完成30至45秒个人口头介绍，并提交五句个人句子提纲。', promptEn: 'Give a 30–45 second introduction and submit a five-sentence personal outline.' },
    responseMode: 'teacherObservedWithTextOutline',
    exitRequirements: [
      { id: 'identity', label: '人物、身份和项目' }, { id: 'experience', label: '重要经历' },
      { id: 'result', label: '结果' }, { id: 'difficulty', label: '困难或材料未说明' },
      { id: 'meaning', label: '超越成绩的意义' }, { id: 'recommendation', label: '推荐理由' }
    ],
    supportCards: [
      { id: 't4_words', labelCn: '词汇提示', labelEn: 'Word support', contentCn: '运动员、成绩、体育、世界、得到、奥运会、影响', contentEn: 'Use only facts supported by the text or teacher material.' },
      { id: 't4_order', labelCn: '介绍顺序', labelEn: 'Presentation order', contentCn: '人物和项目 → 经历 → 结果 → 意义 → 推荐理由', contentEn: 'Organize the five-sentence outline.' },
      { id: 't4_accuracy', labelCn: '事实边界', labelEn: 'Evidence boundary', contentCn: '教材没有说明刘长春没有好成绩的具体原因，不要猜测。', contentEn: 'Do not invent a difficulty that the source does not state.' }
    ]
  }
];

const overviewSets = [
  [
    ['l09_t1_overall_01', 'main_idea', '这段对话主要谈哪件事？', ['归还校园卡', '在校园里准备运动会', '介绍奥运会运动员'], 1],
    ['l09_t1_overall_02', 'development', '白家月也在为运动会做什么？', ['为运动会练习网球', '帮李文找校园卡', '调查谁爱打羽毛球'], 0],
    ['l09_t1_overall_03', 'purpose', '对话最后有什么结果？', ['白家月不参加运动会', '李文和白家月一起报名', '白家月准备参加比赛，李文准备去看'], 2]
  ],
  [
    ['l09_t2_overall_01', 'main_idea', '这段对话主要围绕什么？', ['说明足球比赛得分', '介绍一位运动员', '邀请并鼓励朋友打羽毛球'], 2],
    ['l09_t2_overall_02', 'development', '白家月一开始怎么回应？', ['马上答应一起打', '没有马上答应，还有点担心', '决定不参加任何运动'], 1],
    ['l09_t2_overall_03', 'purpose', '对话最后有什么结果？', ['白家月决定先和朋友一起练', '李文决定不再打羽毛球', '他们马上参加正式比赛'], 0]
  ],
  [
    ['l09_t3_overall_01', 'main_idea', '白家月和陈天中在做什么？', ['一起看足球比赛', '一起练习网球', '一起准备运动会'], 0],
    ['l09_t3_overall_02', 'development', '比赛中的主要问题是什么？', ['白家月找不到球场', '比赛还没有开始', '球队总是踢不进去'], 2],
    ['l09_t3_overall_03', 'purpose', '对话最后有什么结果？', ['大家都不关心比赛', '白家月不看了，但还想知道得分', '白家月上场参加比赛'], 1]
  ],
  [
    ['l09_t4_overall_01', 'main_idea', '这篇短文主要谈什么？', ['校园里的比赛', '羽毛球练习', '奥运会和刘长春'], 2],
    ['l09_t4_overall_02', 'development', '李文写这篇演讲稿是想做什么？', ['介绍一位中国运动员', '邀请朋友打羽毛球', '说明运动会准备计划'], 0],
    ['l09_t4_overall_03', 'purpose', '短文最后强调什么？', ['刘长春得到了最好的成绩', '刘长春没有好成绩，但让世界认识了中国', '刘长春没有参加奥运会'], 1]
  ]
];

const detailSets = [
  [
    ['l09_t1_detail_01','李文为什么这么快就过来了？','Lǐ Wén wèishénme zhème kuài jiù guòlai le?','他接了白家月的电话，就从球场跑过来了。','Tā jiēle Bái Jiāyuè de diànhuà, jiù cóng qiúchǎng pǎoguòlai le.',['接了电话；从球场跑过来；两个信息都出现。']],
    ['l09_t1_detail_02','几个男生为什么每天练球？','Jǐ gè nánshēng wèishénme měitiān liàn qiú?','为了准备运动会。','Wèile zhǔnbèi yùndònghuì.',['为了运动会；为了准备运动会。']],
    ['l09_t1_detail_03','哪些话说明白家月也在为运动会做准备？','Nǎxiē huà shuōmíng Bái Jiāyuè yě zài wèi yùndònghuì zuò zhǔnbèi?','她想参加网球比赛，最近一直在练习。','Tā xiǎng cānjiā wǎngqiú bǐsài, zuìjìn yìzhí zài liànxí.',['想参加网球比赛；最近一直练习；需至少包含准备行动。']],
    ['l09_t1_detail_04','李文道歉以后，白家月怎么回答？她生气了吗？','Lǐ Wén dàoqiàn yǐhòu, Bái Jiāyuè zěnme huídá? Tā shēngqì le ma?','她说“没关系”，没有生气。','Tā shuō “méi guānxi”, méiyǒu shēngqì.',['没关系；没有生气；接受道歉。']]
  ],
  [
    ['l09_t2_detail_01','白家月为什么没有马上答应一起打羽毛球？','Bái Jiāyuè wèishénme méiyǒu mǎshàng dāying yìqǐ dǎ yǔmáoqiú?','她好多年没打了，几乎忘了怎么打。','Tā hǎoduō nián méi dǎ le, jīhū wàngle zěnme dǎ.',['好多年没打；几乎忘了怎么打；至少说明一个原因。']],
    ['l09_t2_detail_02','白家月为什么觉得接不住球会不好意思？','Bái Jiāyuè wèishénme juéde jiē bu zhù qiú huì bù hǎoyìsi?','因为有这么多同学一起打，她担心自己总是接不住球。','Yīnwèi yǒu zhème duō tóngxué yìqǐ dǎ, tā dānxīn zìjǐ zǒngshì jiē bu zhù qiú.',['同学多；担心总是接不住；两个信息均可。']],
    ['l09_t2_detail_03','“接不住球”在这里说明什么困难？','“Jiē bu zhù qiú” zài zhèli shuōmíng shénme kùnnan?','不能把羽毛球打回去。','Bù néng bǎ yǔmáoqiú dǎ huíqu.',['不能回球；不能把羽毛球打回去。']],
    ['l09_t2_detail_04','李文为什么说“打不好没关系”？','Lǐ Wén wèishénme shuō “dǎ bu hǎo méi guānxi”?','因为这不是比赛，大家打球只是为了锻炼身体。','Yīnwèi zhè bú shì bǐsài, dàjiā dǎ qiú zhǐshì wèile duànliàn shēntǐ.',['不是比赛；只是为了锻炼身体；至少说明一个理由。']],
    ['l09_t2_detail_05','李文又请白家月怎样练？','Lǐ Wén yòu qǐng Bái Jiāyuè zěnyàng liàn?','请她跟李文和天中一起练。','Qǐng tā gēn Lǐ Wén hé Tiānzhōng yìqǐ liàn.',['跟李文和天中一起练；过来跟他们一起练。']]
  ],
  [
    ['l09_t3_detail_01','球队为什么总是踢不进去？','Qiúduì wèishénme zǒngshì tī bu jìnqu?','老球员生病了，主要球员没参加；新球员第一次参加重要比赛，太紧张了。','Lǎo qiúyuán shēngbìng le, zhǔyào qiúyuán méi cānjiā; xīn qiúyuán dì-yī cì cānjiā zhòngyào bǐsài, tài jǐnzhāng le.',['老球员生病或主要球员没参加；新球员第一次参加重要比赛并紧张；至少说明两类原因。']],
    ['l09_t3_detail_02','新球员为什么紧张？','Xīn qiúyuán wèishénme jǐnzhāng?','因为他们第一次参加这么重要的比赛。','Yīnwèi tāmen dì-yī cì cānjiā zhème zhòngyào de bǐsài.',['第一次参加重要比赛；第一次参加这么重要的比赛。']],
    ['l09_t3_detail_03','白家月的心情怎样变化？课文中哪句话说明了这种变化？','Bái Jiāyuè de xīnqíng zěnyàng biànhuà? Kèwén zhōng nǎ jù huà shuōmíngle zhè zhǒng biànhuà?','她越来越着急。课文说“越看越着急”。','Tā yuèláiyuè zháojí. Kèwén shuō “yuè kàn yuè zháojí”.',['越看越着急；越来越着急；需给出变化或原话。']],
    ['l09_t3_detail_04','课文中哪句话说明球队没有实现“进球”这个结果？','Kèwén zhōng nǎ jù huà shuōmíng qiúduì méiyǒu shíxiàn “jìn qiú” zhège jiéguǒ?','“总是踢不进去。”','“Zǒngshì tī bu jìnqu.”',['踢不进去；总是踢不进去。']]
  ],
  [
    ['l09_t4_detail_01','哪些话说明奥运会对世界的影响很大？','Nǎxiē huà shuōmíng Àoyùnhuì duì shìjiè de yǐngxiǎng hěn dà?','课文说奥运会是世界上影响最大的体育比赛，每次都有非常多的运动员参加。','Kèwén shuō Àoyùnhuì shì shìjiè shang yǐngxiǎng zuì dà de tǐyù bǐsài, měi cì dōu yǒu fēicháng duō de yùndòngyuán cānjiā.',['世界上影响最大的体育比赛；每次有很多运动员参加；至少给出一条课文证据。']],
    ['l09_t4_detail_02','刘长春是哪一年参加奥运会的？他参加了哪些比赛？','Liú Chángchūn shì nǎ yì nián cānjiā Àoyùnhuì de? Tā cānjiāle nǎxiē bǐsài?','他1932年参加了100米和200米短跑比赛。','Tā yī jiǔ sān èr nián cānjiāle yì bǎi mǐ hé liǎng bǎi mǐ duǎnpǎo bǐsài.',['1932年；100米和200米短跑；年份和比赛均应出现。']],
    ['l09_t4_detail_03','课文用哪两个词把“没有得到好成绩”和“让世界认识了中国”连起来？这两个词说明什么关系？','Kèwén yòng nǎ liǎng gè cí bǎ “méiyǒu dédào hǎo chéngjì” hé “ràng shìjiè rènshi Zhōngguó” lián qǐlai? Zhè liǎng gè cí shuōmíng shénme guānxi?','用“虽然”和“但是”。先说没有好成绩，再说更重要的意义。','Yòng “suīrán” hé “dànshì”. Xiān shuō méiyǒu hǎo chéngjì, zài shuō gèng zhòngyào de yìyì.',['虽然……但是……；成绩不好但有重要意义。']],
    ['l09_t4_detail_04','课文为什么先说奥运会，再说刘长春？','Kèwén wèishénme xiān shuō Àoyùnhuì, zài shuō Liú Chángchūn?','因为刘长春是第一位参加奥运会的中国运动员，前后两部分说的是同一个主题。','Yīnwèi Liú Chángchūn shì dì-yī wèi cānjiā Àoyùnhuì de Zhōngguó yùndòngyuán, qiánhòu liǎng bùfen shuō de shì tóng yí gè zhǔtí.',['刘长春是第一位参加奥运会的中国运动员；奥运会和人物之间有直接关系。']]
  ]
];

const tierById = {
  v09_04:'expression',v09_05:'expression',v09_07:'expression',v09_08:'expression',v09_10:'expression',v09_14:'expression',
  v09_17:'expression',v09_18:'expression',v09_20:'expression',v09_21:'expression',v09_24:'expression',v09_26:'expression',
  v09_01:'understanding',v09_02:'understanding',v09_03:'understanding',v09_06:'understanding',v09_09:'understanding',v09_11:'understanding',
  v09_12:'understanding',v09_13:'understanding',v09_19:'understanding',v09_22:'understanding',v09_23:'understanding',v09_25:'understanding',v09_27:'understanding',
  v09_15:'context',v09_16:'context',v09_28:'context'
};

const meaningCnById = {
  v09_01:'学校里的地方',
  v09_02:'一张小卡片，可以买东西或进门',
  v09_03:'打球的地方',
  v09_04:'表示做一件事的目的',
  v09_05:'很多人一起参加的体育活动',
  v09_06:'男的学生',
  v09_07:'一次又一次地做',
  v09_08:'进入一个活动或比赛，和别人一起做',
  v09_09:'拿球拍打的一种球',
  v09_10:'看谁或哪一组做得更好',
  v09_11:'为了学会一件事而做的活动',
  v09_12:'数量很多',
  v09_13:'差一点儿就完全到了',
  v09_14:'表示数量少或范围小',
  v09_15:'一种酒',
  v09_16:'表示事情发生的次数',
  v09_17:'心里不放松，有一点儿担心',
  v09_18:'最重要的',
  v09_19:'得到或遇到，常和“影响、欢迎”一起说',
  v09_20:'一件事让另一件事发生变化',
  v09_21:'比赛中得到的分数',
  v09_22:'锻炼身体和比赛的活动',
  v09_23:'地球上的所有国家和地方',
  v09_24:'参加体育训练和比赛的人',
  v09_25:'拿到或有了',
  v09_26:'学习或比赛得到的结果',
  v09_27:'世界很多国家一起参加的体育活动',
  v09_28:'中国很早参加奥运会的一位运动员'
};

function activity(id, type, targetWordIds, promptCn, stimulus, answer, options, extra) {
  return Object.assign({ id, type, targetWordIds, promptCn, promptEn:'', stimulus, answer, options:options || [] }, extra || {});
}

const vocabularyGroups = [
  {
    id:'T1', textIndex:0, title:'运动会选择、准备与支持',
    wordIds:['v09_01','v09_02','v09_03','v09_04','v09_05','v09_06','v09_07','v09_08','v09_09','v09_10','v09_11'],
    recognitionWordIds:['v09_01','v09_02','v09_03','v09_06','v09_09','v09_11'],
    activities:[
      activity('l09_vocab_t1_input_weile','input',['v09_04'],'填入合适的词。','____准备运动会，他们每天都练球。','为了',[],{promptMode:'meaning'}),
      activity('l09_vocab_t1_input_yundonghui','input',['v09_05'],'填入合适的词。','学校下个月开____。','运动会',[],{promptMode:'meaning'}),
      activity('l09_vocab_t1_input_lian','input',['v09_07'],'填入合适的词。','你们几个男生每天都____球。','练',[],{promptMode:'meaning'}),
      activity('l09_vocab_t1_input_canjia','input',['v09_08'],'填入合适的词。','我想____网球比赛。','参加',[],{promptMode:'meaning'}),
      activity('l09_vocab_t1_input_bisai','input',['v09_10'],'填入合适的词。','我想参加网球____。','比赛',[],{promptMode:'meaning'}),
      activity('l09_vocab_t1_use_plan','collocation',['v09_04','v09_05','v09_07','v09_08','v09_10'],'用指定搭配完成最多两句话。','参加运动会、参加比赛、为了、练','我想参加运动会的网球比赛。为了打得更好，我每天练球。',[],{evaluation:'teacher',promptMode:'open_use',promptEn:'Use the given collocations to write no more than two sentences.'}),
      activity('l09_vocab_t1_shape_yun','shape',['v09_05'],'根据拼音选择正确的汉字。','yùn','运',['运','远'],{promptMode:'form'}),
      activity('l09_vocab_t1_shape_lian','shape',['v09_07'],'根据拼音选择正确的汉字。','liàn','练',['练','炼'],{promptMode:'form'})
    ]
  },
  {
    id:'T2', textIndex:1, title:'邀请并鼓励久未运动的朋友',
    wordIds:['v09_07','v09_11','v09_12','v09_13','v09_14'],
    recognitionWordIds:['v09_07','v09_11','v09_12','v09_13'],
    activities:[
      activity('l09_vocab_t2_input_zhi','input',['v09_14'],'填入目标词，组成课文中的“只是”。','大家打球____是为了锻炼身体。','只',[],{acceptedAnswers:['只','只是'],promptMode:'display_form'}),
      activity('l09_vocab_t2_use_zhi','collocation',['v09_14'],'用指定搭配完成最多两句话：一句用“只＋动词”，一句用“只是＋说明”。','只想先练练；这只是练习，不是比赛。','我只想先练练。这只是练习，不是比赛。',[],{evaluation:'teacher',promptMode:'open_use',promptEn:'Use the given collocations to write up to two sentences: one with “只 + verb” and one with “只是 + explanation”.'})
    ]
  },
  {
    id:'T3', textIndex:2, title:'说明赛况、原因、变化与决定',
    wordIds:['v09_15','v09_16','v09_17','v09_18','v09_19','v09_20','v09_21'],
    recognitionWordIds:['v09_15','v09_16','v09_19','v09_21'],
    activities:[
      activity('l09_vocab_t3_input_jinzhang','input',['v09_17'],'填入合适的词。','新球员第一次参加重要比赛，太____了。','紧张',[],{promptMode:'meaning'}),
      activity('l09_vocab_t3_input_zhuyao','input',['v09_18'],'填入合适的词。','____的球员没有参加比赛。','主要',[],{promptMode:'meaning'}),
      activity('l09_vocab_t3_input_yingxiang','input',['v09_20'],'填入合适的词。','主要球员没参加，所以大家受到____。','影响',[],{promptMode:'meaning'}),
      activity('l09_vocab_t3_input_defen','input',['v09_21'],'填入合适的词。','我不看了，你们告诉我____吧。','得分',[],{promptMode:'meaning'}),
      activity('l09_vocab_t3_use_comment','collocation',['v09_17','v09_18','v09_20','v09_21'],'用指定搭配完成最多两句话。','主要、紧张、受到影响、得分','主要球员没参加，新球员很紧张，球队受到影响。请告诉我得分。',[],{evaluation:'teacher',promptMode:'open_use',promptEn:'Use the given collocations to write no more than two sentences.'}),
      activity('l09_vocab_t3_shape_zhu','shape',['v09_18'],'根据拼音选择正确的汉字。','zhǔ','主',['主','住'],{promptMode:'form'}),
      activity('l09_vocab_t3_shape_ying','shape',['v09_20'],'根据拼音选择正确的汉字。','yǐng','影',['影','景'],{promptMode:'form'})
    ]
  },
  {
    id:'T4', textIndex:3, title:'推荐一位值得认识的体育人物',
    wordIds:['v09_22','v09_23','v09_24','v09_25','v09_26','v09_27','v09_28'],
    recognitionWordIds:['v09_22','v09_23','v09_25','v09_27','v09_28'],
    activities:[
      activity('l09_vocab_t4_input_yundongyuan','input',['v09_24'],'填入合适的词。','刘长春是中国____。','运动员',[],{promptMode:'meaning'}),
      activity('l09_vocab_t4_input_chengji','input',['v09_26'],'填入合适的词。','虽然他没有得到好____，但是他让世界认识了中国。','成绩',[],{promptMode:'meaning'}),
      activity('l09_vocab_t4_use_person','collocation',['v09_24','v09_26'],'用指定搭配写最多两句话介绍人物。','运动员、参加比赛、得到成绩','他是一位中国运动员。他参加了比赛，但是没有得到好成绩。',[],{evaluation:'teacher',promptMode:'open_use',promptEn:'Use the given collocations to write no more than two sentences about the person.'}),
      activity('l09_vocab_t4_shape_yuan','shape',['v09_24'],'根据拼音选择正确的汉字。','yuán','员',['员','圆'],{promptMode:'form'}),
      activity('l09_vocab_t4_shape_cheng','shape',['v09_26'],'根据拼音选择正确的汉字。','chéng','成',['成','城'],{promptMode:'form'}),
      activity('l09_vocab_t4_shape_ti','shape',['v09_22'],'根据拼音选择正确的汉字。','tǐ','体',['体','休'],{promptMode:'form'})
    ]
  }
];

const resourceLinks = [
  [
    ['g09_01','ready','核心语法'],['l09_order_01','ready','连词成句'],['l09_scene_02','needs_revision','情境选择'],['l09_pic_02','ready','看图造句'],['l09_read_01','optional','教师带读问答'],['l09_ind_read_01','needs_revision','独立阅读'],['l09_task_01','needs_revision','任务卡']
  ],
  [
    ['g09_02','ready','核心语法'],['l09_order_02','ready','连词成句'],['l09_scene_03','needs_revision','情境选择'],['l09_scene_04','needs_revision','情境选择'],['l09_pic_03','ready','看图造句'],['l09_pic_04','ready','看图造句'],['l09_read_02','optional','教师带读问答'],['l09_ind_read_02','ready','独立阅读'],['l09_task_02','ready','任务卡']
  ],
  [
    ['g09_03','ready','唯一核心语法'],['l09_order_03','ready','连词成句'],['l09_scene_05','needs_revision','情境选择'],['l09_pic_05','ready','看图造句'],['l09_pic_06','ready','看图造句'],['l09_para_03','needs_revision','段落填空'],['l09_chain_03','optional','故事接龙'],['l09_task_03','needs_revision','任务卡']
  ],
  [
    ['l09_read_04','optional','教师带读问答'],['l09_ind_read_04','needs_revision','独立阅读'],['l09_pic_07','ready','看图造句'],['l09_pic_08','ready','看图造句'],['l09_para_04','needs_revision','段落填空'],['l09_chain_04','optional','故事接龙'],['l09_task_04','needs_revision','任务卡']
  ]
];

const resourceOverrides = [
  { id:'l09_scene_02', patch:{ prompt_cn:'几名学生为学校运动会做准备。选择最合适的句子。', data:{ options:['他们准备运动会，可是每天都不练球。','为了准备运动会，他们每天下午都在球场练球。','他们每天在球场练球，但是不参加运动会。','运动会已经结束了，他们才开始准备。'], correct_index:1 }, correct_answer:'为了准备运动会，他们每天下午都在球场练球。' } },
  { id:'l09_scene_03', patch:{ prompt_cn:'朋友很久没打羽毛球，担心打不好。选择最合适的回答。', data:{ options:['这么多人一起打，你还是别来了。','你接不住球，所以不能练。','不是比赛，打不好没关系。','你好多年没打了，今天一定要得分。'], correct_index:2 }, correct_answer:'不是比赛，打不好没关系。' } },
  { id:'l09_scene_04', patch:{ prompt_cn:'她能接慢球，还不能接快球。选择最合适的句子。', data:{ options:['慢球她接不住，快球她接得住。','慢球和快球她都接不住。','慢球她接得住，快球她还接不住。','她只看比赛，没有接球。'], correct_index:2 }, correct_answer:'慢球她接得住，快球她还接不住。' } },
  { id:'l09_scene_05', patch:{ prompt_cn:'朋友看足球比赛，球队一直没有得分。选择最合适的句子。', data:{ options:['比赛一直没有得分，她越看越着急。','比赛一直没有得分，她越看越高兴。','主要球员都参加了，她还是不看。','球队一直得分，她越看越紧张。'], correct_index:0 }, correct_answer:'比赛一直没有得分，她越看越着急。' } },
  { id:'l09_ind_read_01', patch:{ data:{ question_cn:'安娜为什么每周练习三次？', options:['因为运动会已经结束了。','为了能打完一场网球比赛。','因为她不想参加比赛。','为了每天只看别人练球。'], correct_index:1 }, correct_answer:'为了能打完一场网球比赛。' } },
  { id:'l09_ind_read_04', patch:{ data:{ title:'刘长春与奥运会', passage:'刘长春是第一位参加奥运会的中国运动员。他1932年参加了100米和200米短跑比赛。虽然他没有得到好成绩，但是他让世界认识了中国。', question_cn:'为什么刘长春没有得到好成绩，也值得介绍？', options:['因为他参加了网球比赛。','因为他得到了最好的成绩。','因为他让世界认识了中国。','因为他参加了每一次奥运会。'], correct_index:2 }, correct_answer:'因为他让世界认识了中国。' } },
  { id:'l09_para_03', patch:{ data:{ title:'比赛中的紧张', passageParts:['重要比赛已经开始了。','____1____','几个新球员第一次参加这么重要的比赛。','____2____','球队连续几次都没有踢进去。','____3____'], options:['几个老球员生病了，主要球员没有参加比赛。','他们太紧张了，大家也都受到影响。','看比赛的人越看越着急。','几个主要球员都参加了比赛。','新球员第一次比赛，一点儿也不紧张。','球队一直得分，大家越看越高兴。'], answers:[0,1,2] } } },
  { id:'l09_para_04', patch:{ data:{ title:'体育人物分享', passageParts:['李文准备一篇体育人物介绍。','____1____','然后，他介绍刘长春是第一位参加奥运会的中国运动员。','____2____','最后，李文说刘长春没有得到好成绩。','____3____'], options:['他先说自己最爱看奥运会。','刘长春1932年参加了100米和200米短跑比赛。','但是他让世界认识了中国。','刘长春参加了网球比赛。','刘长春得到了最好的成绩。','李文说奥运会没有运动员参加。'], answers:[0,1,2] } } },
  { id:'l09_task_01', patch:{ prompt_cn:'任务卡：运动会选择和准备采访。', prompt_en:'运动会选择和准备采访', data:{ title:'运动会选择和准备采访', titleEn:'运动会选择和准备采访', role:'采访同伴参加比赛或支持同学的计划。', steps:['你参加什么比赛，或者怎样支持同学？','你为什么这样选择？','你最近怎样准备？','到时候你会做什么？'], keywords:['运动会','参加','为了','练习','支持'], output:'每人3至4句话；不参赛者可以说明看比赛、帮助或给同学加油。' } } },
  { id:'l09_task_03', patch:{ prompt_cn:'任务卡：比赛现场个人评论。', prompt_en:'比赛现场个人评论', data:{ title:'比赛现场个人评论', titleEn:'比赛现场个人评论', role:'根据课文信息完成个人比赛评论。', steps:['球队现在怎样？','为什么踢不进去？','你的心情怎样变化？','你准备继续看还是先不看？'], keywords:['主要','紧张','受到影响','越A越B'], output:'每位学生完成4句话；可以先小组讨论，但个人表达和个人提交必须独立完成。' } } },
  { id:'l09_task_04', patch:{ prompt_cn:'任务卡：30至45秒体育人物个人介绍。', prompt_en:'30至45秒体育人物个人介绍', data:{ title:'30至45秒体育人物个人介绍', titleEn:'30至45秒体育人物个人介绍', role:'根据教材或教师提供的可靠材料独立介绍体育人物。', steps:['人物、身份和项目。','重要经历。','结果。','困难或材料未说明。','超越成绩的意义和推荐理由。'], keywords:['运动员','项目','成绩','影响'], output:'每位学生完成30至45秒个人口头表达，并提交5句个人句子提纲，建议70至110个汉字。' } } }
];

const grammarBridges = [
  { evidence:'为了准备运动会，他们每天都在球场练球。', focus:'为了 + 目的，主语 + 行动', actionLabel:'进入“为了”语法', grammarIndex:0 },
  { evidence:'这么快的球我现在还接不住。', focus:'动词 + 得 / 不 + 结果或方向', actionLabel:'进入可能补语', grammarIndex:1 },
  { evidence:'这场足球比赛我越看越着急。', focus:'越 + A，越 + B', actionLabel:'进入“越A越B”语法', grammarIndex:2 },
  null
];

function build() {
  const formal = read(formalPath);
  const lesson = formal.data;
  if (!lesson.meta || lesson.meta.lessonKey !== 'HSK3-L09') throw new Error('Unexpected formal lesson');
  if (!Array.isArray(lesson.texts) || lesson.texts.length !== 4) throw new Error('L9 must have four texts');

  const useGroups = taskDesigns.map((design, index) => ({
    ...design,
    textId: lesson.texts[index].id,
    entry: { id:`l09_t${index + 1}_use_entry`, label:'起点表达', labelEn:'Starting expression', ...design.entry },
    exit: { id:`l09_t${index + 1}_use_exit`, label:'终点表达', labelEn:'Upgraded expression', ...design.exit },
    linkedResources: {
      vocabulary:{ module:'teach', submodule:'tv', label:`课文${index + 1}词汇`, vocabSession:String(index + 1) },
      ...(index < 3 ? { grammar:{ module:'teach', submodule:'tg', label:['“为了”语法','可能补语','“越A越B”语法'][index], grammarIndex:index } } : {}),
      text:{ module:'teach', submodule:'tt', label:`课文${index + 1}`, textIndex:index },
      practice:{ module:'practice', submodule:index < 3 ? 'g1' : 'g2p', label:index < 3 ? `连词成句 ${index + 1}` : '体育人物看图表达', routeState:index < 3 ? { g1i:index, g1s:[], g1a:[], g1sa:false } : { g2pi:6 } }
    },
    resourceLinks: resourceLinks[index].map(item => ({ id:item[0], status:item[1], purpose:item[2] }))
  }));

  const textLearning = lesson.texts.map((text, index) => ({
    textId:text.id,
    useGroupId:`T${index + 1}`,
    title:text.title,
    overviewChoices:overviewSets[index].map(item => ({ id:item[0], focus:item[1], questionCn:item[2], options:item[3], correctIndex:item[4] })),
    detailMode:'config',
    detailQuestions:detailSets[index].map(item => ({ id:item[0], questionCn:item[1], questionPinyin:item[2], answer:item[3], answerPinyin:item[4], acceptedAnswers:item[5] })),
    grammarBridge:grammarBridges[index],
    paragraphPractice:{ label:index < 2 ? `调用课文${index + 1}段落练习` : `调用“${index === 2 ? '比赛中的紧张' : '体育人物分享'}”段落填空`, module:'practice', submodule:'r4p', index },
    lifeTransfer:{ promptCn:taskDesigns[index].exit.promptCn, promptEn:taskDesigns[index].exit.promptEn }
  }));

  const allActivities = vocabularyGroups.flatMap(group => group.activities);
  const recognitionIds = new Set(vocabularyGroups.flatMap(group => group.recognitionWordIds || []));
  const vocabularyCatalog = lesson.vocabulary.map(word => {
    const allowedTypes = Array.from(new Set([...(recognitionIds.has(word.id) ? ['recognition'] : []), ...allActivities.filter(item => item.targetWordIds.includes(word.id)).map(item => item.type)]));
    return { id:word.id, hanzi:word.hanzi, pinyin:word.pinyin, english:word.english, meaningCn:meaningCnById[word.id], phrases:word.phrases || [], example:word.example || '', tier:tierById[word.id], allowedTypes };
  });

  return {
    schemaVersion:'classpro-use-profile/v3',
    experiment:{ id:'l09-use-pilot-v1', title:'第9课·以用为主线升级版', lessonLabel:'第9课', sourceLesson:'HSK3-L09', scope:'四个课文MINI循环；保留L9原有词汇、语法、课文和练习教学样式。' },
    sources:{ lesson:{ path:'../lessons/HSK3-L09.json', sha256:formal.sha256 }, teacher:{ path:'../../in-class/teacher.html' }, student:{ path:'../../in-class/student.html' } },
    nativeTeaching:{
      preserveCourseStyles:true,
      grammar:{ presentationMode:'progressive_grammar', phases:['观察例句','结构归纳','课堂表达','跟进练习'], preserveExamples:true, preserveHighlights:true, preserveOralQuestions:true, preserveFollowUp:true }
    },
    useGroups,
    textLearning,
    vocabularyTaskTypes:[
      { id:'recognition', labelCn:'认读', labelEn:'Recognition' },
      { id:'shape', labelCn:'辨形', labelEn:'Character form' },
      { id:'input', labelCn:'输入', labelEn:'Type the word' },
      { id:'collocation', labelCn:'搭配与使用', labelEn:'Collocation and use' }
    ],
    timerPolicy:{
      miniLoop:{ optionsMinutes:[3,4,5], defaultMinutes:3 },
      vocabularyFocus:{ optionsMinutes:[2,3,4,5], defaultMinutes:2 },
      autoClose:false
    },
    vocabularyCatalog,
    vocabularyGroups,
    resourceOverrides,
    supportOnlyStructures:[
      { groupId:'T3', structure:'因为……所以……', role:'表达原因的支架，不作为L09新增语法' },
      { groupId:'T4', structure:'虽然……但是……', role:'组织人物结果与意义的支架，不作为L09新增语法' }
    ],
    evidencePolicy:{ coreTypes:['entry_expression','actual_learning_path','exit_expression'], pathEvent:'opened', optionalSignals:['support_request','self_reflection','teacher_observation'] },
    supportOptions:[
      { id:'vocabulary', labelCn:'我缺少合适的词', labelEn:'I need the right words' },
      { id:'organization', labelCn:'我不知道怎样组织信息', labelEn:'I need help organizing my ideas' },
      { id:'structure', labelCn:'我需要一个句子结构', labelEn:'I need a sentence frame' },
      { id:'teacher', labelCn:'我想获得老师的帮助', labelEn:'I want help from the teacher' }
    ],
    feelingOptions:[
      { id:'clearer', labelCn:'我说得更清楚了', labelEn:'My expression is clearer' },
      { id:'more_complete', labelCn:'我说得更完整了', labelEn:'My expression is more complete' },
      { id:'more_natural', labelCn:'我说得更自然了', labelEn:'My expression is more natural' },
      { id:'still_need_help', labelCn:'我还需要帮助', labelEn:'I still need help' }
    ],
    coreEvidence:['entry_expression','actual_learning_path','exit_expression'],
    capabilities:['select_text_mini_loop','launch_interaction','independent_answer','support_request','anonymous_return','open_support','reanswer','record_teacher_decision','compare_entry_exit','teacher_selected_vocabulary_focus','shared_countdown','native_course_resource_return']
  };
}

if (require.main === module) {
  fs.writeFileSync(outputPath, `${JSON.stringify(build(), null, 2)}\n`, 'utf8');
  console.log(`Built ${path.relative(root, outputPath)}`);
}

module.exports = { build, outputPath, formalPath };
