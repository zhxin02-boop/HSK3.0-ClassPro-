const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L10.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L10-USE-PILOT-V1.json');

function read(filePath) {
  const buffer = fs.readFileSync(filePath);
  return { sha256: crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase(), data: JSON.parse(buffer.toString('utf8')) };
}

const taskDesigns = [
  {
    id:'T1', textIndex:0, icon:'📝', label:'课文 1', title:'说明一个能执行的学习方法',
    goal:'说明一门想提高的学科、课堂行动、记录位置、笔记用途和希望得到的结果。',
    goalEn:'Explain an actionable study method from classroom action to the hoped-for result.',
    entry:{ promptCn:'你的什么学科学得最好？为什么学得好？请先写2至3句。', promptEn:'Which subject do you learn best, and why? Write 2–3 sentences.' },
    exit:{ promptCn:'请用30至40秒口头说明，并提交4至5句文字稿：想提高的学科、一个课堂行动、把什么记在哪里、写作业前怎样用笔记，以及希望得到的结果。', promptEn:'Give a 30–40 second response and a 4–5 sentence outline.' },
    exitRequirements:[['subject','想提高的学科'],['action','一个课堂行动'],['location','“把”字句与记录位置'],['notes','笔记的用途'],['result','希望的结果']],
    supportCards:[['t1_words','词汇提示','认真、笔记、清楚、把、遍、提高'],['t1_frame','表达顺序','学科 → 课堂行动 → 记录位置 → 复习办法 → 结果']]
  },
  {
    id:'T2', textIndex:1, icon:'📊', label:'课文 2', title:'复盘一次考试并决定怎样求助',
    goal:'说明考试结果、原因、下一步复习安排和遇到困难后的求助决定。',
    goalEn:'Review an exam and decide how to seek help.',
    entry:{
      promptCn:'看图后写2至3句：什么考试、结果怎样、为什么、下一步做什么。不需要写真实分数。',
      promptEn:'Write 2–3 sentences about the exam, result, reason and next step. No real score is required.',
      stimulus:{ type:'image', image:'images/hsk3-l10/photo-text-2-exam-review.png', labelCn:'看图复盘', altCn:'学生查看试卷并复盘考试', instructionCn:'先看图，再根据图中的考试情境表达。' }
    },
    exit:{ promptCn:'请用35至45秒说明：什么考试、结果或感受、原因、下一场考试前怎样复习，以及两个人都不会时找谁求助。表达中请使用“在学习上”。', promptEn:'Give a 35–45 second exam review and use 在学习上.' },
    exitRequirements:[['exam','考试'],['result','结果或感受'],['reason','原因'],['review','下一步复习'],['help','求助对象']],
    supportCards:[['t2_words','词汇提示','要求、复习、遇到、办公室'],['t2_frame','表达结构','在学习上遇到问题时……']]
  },
  {
    id:'T3', textIndex:2, icon:'🙋', label:'课文 3', title:'向老师说清问题并约定归还资料',
    goal:'说清问题位置和困难，提出具体请求，并说明什么时候把什么还给谁。',
    goalEn:'State a problem precisely, ask for help, and arrange to return material.',
    contextCn:'书上第五页的对话看不懂。',
    entry:{ promptCn:'你会怎样向老师求助？请先自己写1至2句。', promptEn:'How would you ask the teacher for help? Write 1–2 sentences.' },
    exit:{ promptCn:'角色练习后，请用约40秒表达，并提交4句个人文字：问题在哪里、哪里不明白、希望老师怎样帮助、什么时候把什么还给谁。', promptEn:'After the role-play, give a 40-second response and a four-sentence personal outline.' },
    exitRequirements:[['location','问题位置'],['difficulty','不明白的部分'],['request','请求的帮助'],['return','归还时间、物品和对象']],
    supportCards:[['t3_words','词汇提示','页、对话、明白、讲、句子'],['t3_request','请求结构','请您再讲一遍。']]
  },
  {
    id:'T4', textIndex:3, icon:'✉️', label:'课文 4', title:'给朋友介绍学习阶段和最近的变化',
    goal:'用邮件介绍年级、升学目标、努力原因、教育阶段和兴趣变化。',
    goalEn:'Introduce one’s school stage, goal and recent change in a short email.',
    entry:{ promptCn:'请先写3句：你现在上几年级、最近忙不忙、最近对什么感兴趣。', promptEn:'Write three sentences about your grade, workload and recent interest.' },
    exit:{ promptCn:'请写6至8句个人短邮件，并用45至60秒口头分享：问候、年级、目标、努力原因、一般教育阶段、在谁的影响下发生了什么变化，以及下次想分享什么。', promptEn:'Write a 6–8 sentence email and give a 45–60 second oral version.' },
    exitRequirements:[['greeting','问候'],['grade','当前年级'],['goal','目标与努力原因'],['stages','教育阶段'],['change','影响与变化'],['share','下次分享']],
    supportCards:[['t4_words','词汇提示','年级、一般、努力'],['t4_frame','变化结构','在……影响下，我开始……。']]
  }
];

const overviewSets = [
  [
    ['l10_t1_overall_01','main_idea','这段对话主要谈什么？',['朋友和比赛','数学学习方法','学校年级'],1],
    ['l10_t1_overall_02','development','刘小雪平时怎样学习？',['认真听课、记笔记','只看考试分数','不写作业'],0],
    ['l10_t1_overall_03','purpose','同学听完以后有什么打算？',['换学校','不学数学','试试这个方法'],2]
  ],
  [
    ['l10_t2_overall_01','main_idea','这段对话主要谈什么？',['学校年级','借书还书','考试情况和下一步学习'],2],
    ['l10_t2_overall_02','development','说完数学考试以后，他们先做什么？',['去拍照','复习外语','不再学习'],1],
    ['l10_t2_overall_03','purpose','两个人都不会做题，最后怎么办？',['一起去问李老师','不做了','抄答案'],0]
  ],
  [
    ['l10_t3_overall_01','main_idea','学生为什么去李老师办公室？',['想问书上的问题','想参加考试','想看照片'],0],
    ['l10_t3_overall_02','development','李老师讲完以后，学生怎么样？',['觉得更难','还是不懂','明白了'],2],
    ['l10_t3_overall_03','purpose','最后老师怎样安排？',['今天马上还书','回家做练习，明天还书','不用做练习'],1]
  ],
  [
    ['l10_t4_overall_01','main_idea','这封邮件主要写什么？',['体育比赛','学习近况和新的兴趣','一本书的价格'],1],
    ['l10_t4_overall_02','development','刘小雪先写学习，再写什么？',['拍照的兴趣','数学答案','老师的办公室'],0],
    ['l10_t4_overall_03','purpose','刘小雪写邮件想做什么？',['请家月姐姐做作业','借一本书','告诉家月姐姐自己的近况'],2]
  ]
];

const detailSets = [
  [
    ['l10_t1_detail_01','同学为什么请刘小雪介绍学习方法？','Tóngxué wèishénme qǐng Liú Xiǎoxuě jièshào xuéxí fāngfǎ?','因为刘小雪的数学越来越好。','Yīnwèi Liú Xiǎoxuě de shùxué yuèláiyuè hǎo.',['数学越来越好','数学进步了'],'人物提问的原因'],
    ['l10_t1_detail_02','刘小雪把哪些题记在本子上？她为什么这样做？','Liú Xiǎoxuě bǎ nǎxiē tí jì zài běnzi shang? Tā wèishénme zhèyàng zuò?','老师写在黑板上的重要题，因为这些题很重要。','Lǎoshī xiě zài hēibǎn shang de zhòngyào tí, yīnwèi zhèxiē tí hěn zhòngyào.',['黑板上的题＋很重要'],'记录内容和理由'],
    ['l10_t1_detail_03','课文中哪句话说明她每天都会用笔记复习？','Kèwén zhōng nǎ jù huà shuōmíng tā měitiān dōu huì yòng bǐjì fùxí?','我每天写作业以前，都要看一遍。','Wǒ měitiān xiě zuòyè yǐqián, dōu yào kàn yí biàn.',['每天＋写作业以前＋看一遍'],'支持“形成习惯”的课文证据']
  ],
  [
    ['l10_t2_detail_01','同学的数学为什么考得挺差？','Tóngxué de shùxué wèishénme kǎo de tǐng chà?','因为没看清楚要求，做错了好几个题。','Yīnwèi méi kàn qīngchu yāoqiú, zuòcuòle hǎo jǐ gè tí.',['没看清楚要求','做错几个题'],'考试结果的具体原因'],
    ['l10_t2_detail_02','刘小雪为什么说先复习外语？','Liú Xiǎoxuě wèishénme shuō xiān fùxí wàiyǔ?','因为明天还有外语考试。','Yīnwèi míngtiān hái yǒu wàiyǔ kǎoshì.',['明天还有考试','外语'],'下一步安排的原因'],
    ['l10_t2_detail_03','发现两个人都不会以后，他们怎样改变了求助办法？','Fāxiàn liǎng gè rén dōu bú huì yǐhòu, tāmen zěnyàng gǎibiànle qiúzhù bànfǎ?','原来同学想问刘小雪，后来两个人决定一起去办公室问李老师。','Yuánlái tóngxué xiǎng wèn Liú Xiǎoxuě, hòulái liǎng gè rén juédìng yìqǐ qù bàngōngshì wèn Lǐ lǎoshī.',['先问同学','两人都不会','一起问老师'],'求助路径的变化和决定']
  ],
  [
    ['l10_t3_detail_01','学生怎样让李老师知道问题在哪里？','Xuésheng zěnyàng ràng Lǐ lǎoshī zhīdào wèntí zài nǎli?','他们说书上第五页的对话看不懂。','Tāmen shuō shū shang dì-wǔ yè de duìhuà kàn bu dǒng.',['第五页','对话','看不懂'],'问题位置和困难点'],
    ['l10_t3_detail_02','李老师用什么办法帮助他们？','Lǐ lǎoshī yòng shénme bànfǎ bāngzhù tāmen?','把课上讲过的几句话再讲一遍。','Bǎ kè shang jiǎngguo de jǐ jù huà zài jiǎng yí biàn.',['再讲一遍','几句话'],'教师提供的帮助'],
    ['l10_t3_detail_03','哪些话说明李老师讲完以后学生真的听懂了？','Nǎxiē huà shuōmíng Lǐ lǎoshī jiǎngwán yǐhòu xuésheng zhēnde tīngdǒng le?','同学说“我终于懂了，这些句子一点儿也不难”，刘小雪说“我也明白了”。','Tóngxué shuō “Wǒ zhōngyú dǒng le, zhèxiē jùzi yìdiǎnr yě bù nán”, Liú Xiǎoxuě shuō “Wǒ yě míngbai le”.',['终于懂了','一点儿也不难','也明白了'],'理解状态变化的课文证据']
  ],
  [
    ['l10_t4_detail_01','刘小雪为什么现在非常努力？','Liú Xiǎoxuě wèishénme xiànzài fēicháng nǔlì?','因为她想考上好高中，以后再考上好大学。','Yīnwèi tā xiǎng kǎoshang hǎo gāozhōng, yǐhòu zài kǎoshang hǎo dàxué.',['好高中','好大学','现在努力'],'努力与升学目标的原因链'],
    ['l10_t4_detail_02','邮件怎样介绍中国学校的三个阶段？','Yóujiàn zěnyàng jièshào Zhōngguó xuéxiào de sān gè jiēduàn?','一般是小学六年、初中三年、高中三年。','Yìbān shì xiǎoxué liù nián, chūzhōng sān nián, gāozhōng sān nián.',['一般','小学六年','初中三年','高中三年'],'教育阶段的具体信息'],
    ['l10_t4_detail_03','刘小雪的兴趣怎样发生了变化？她下次想怎样跟家月姐姐分享？','Liú Xiǎoxuě de xìngqù zěnyàng fāshēngle biànhuà? Tā xià cì xiǎng zěnyàng gēn Jiāyuè jiějie fēnxiǎng?','在家月姐姐的影响下，她开始喜欢拍照；下次家月来北京时，她想给家月看自己照的照片。','Zài Jiāyuè jiějie de yǐngxiǎng xià, tā kāishǐ xǐhuan pāizhào; xià cì Jiāyuè lái Běijīng shí, tā xiǎng gěi Jiāyuè kàn zìjǐ zhào de zhàopiàn.',['家月姐姐的影响','开始拍照','下次看照片'],'兴趣变化、原因和后续行动']
  ]
];

const tierById = {};
'02,03,04,06,08,09,12,14,17,18,19,20,21,22,25,27,28'.split(',').forEach(n => { tierById[`v10_${n}`] = 'expression'; });
'01,05,07,10,11,13,15,26'.split(',').forEach(n => { tierById[`v10_${n}`] = 'understanding'; });
'16,23,24'.split(',').forEach(n => { tierById[`v10_${n}`] = 'context'; });

const meaningCnById = {
  v10_01:'学习数字和计算的学科',v10_02:'做事用心，不随便',v10_03:'把重要内容写下来以后留下的记录',v10_04:'容易看懂、听懂或说明白',v10_05:'教室前面老师写字的板',v10_06:'把要处理的东西放在动作前面',v10_07:'老师让学生课后完成的学习任务',v10_08:'从头到尾完成一次',v10_09:'让水平或成绩变得更好',
  v10_10:'学习过去的人和事情的学科',v10_11:'不容易做或不容易懂',v10_12:'应该做到的内容或标准',v10_13:'结果不太好',v10_14:'再学习已经学过的内容',v10_15:'本国语言以外的语言',v10_16:'表示事情本来就是这样',v10_17:'碰到一件事或一个问题',v10_18:'老师或工作人员工作的房间',
  v10_19:'书本的一面',v10_20:'两个人或几个人互相说的话',v10_21:'知道意思，听懂或看懂',v10_22:'把内容说给别人听并说明',v10_23:'计算话语或句子的量词',v10_24:'用词组成的一段完整的话',v10_25:'学生在学校学习的阶段',v10_26:'明年以后的那一年',v10_27:'说明大多数常见情况',v10_28:'认真花力气去实现目标'
};

function activity(id, type, targetWordIds, promptCn, stimulus, answer, options, extra) {
  return Object.assign({ id, type, targetWordIds, promptCn, promptEn:'', stimulus, answer, options:options || [] }, extra || {});
}
function input(n, prompt, stimulus, answer, options) { return activity(`l10_m${Number(n) <= 9 ? 1 : Number(n) <= 18 ? 2 : Number(n) <= 24 ? 3 : 4}_v${n}_input`,'input',[`v10_${n}`],prompt,stimulus,answer,options,{promptMode:'meaning'}); }
function use(n, prompt, stimulus, answer) { return activity(`l10_m${Number(n) <= 9 ? 1 : Number(n) <= 18 ? 2 : Number(n) <= 24 ? 3 : 4}_v${n}_use`,'collocation',[`v10_${n}`],`${prompt}（最多两句话）`,stimulus,answer,[],{evaluation:'teacher',promptMode:'open_use',promptEn:'Use the target expression in no more than two sentences.'}); }

const inputUse = {
  v10_02:[input('02','看上课图，选“她怎样听课？”','她怎样听课？','认真听课',['认真听课','随便听','不听课']),use('02','补全学习安排。','上课要____听，考试前要认真____。','认真；复习')],
  v10_03:[input('03','指出图中记录课堂内容的本子内容。','记录课堂内容','笔记',['笔记','作业','黑板']),use('03','说出写作业以前怎样使用笔记。','写作业以前……','看一遍笔记／复习笔记')],
  v10_04:[input('04','比较两个短语中“清楚”的意思。','记得清楚／没看清楚要求','清楚可以说明记录明白或看得明白',['清楚可以说明记录明白或看得明白','糊涂','看不见']),use('04','任选一个短语完成句子。','记得清楚／看清楚要求','说清楚问题')],
  v10_06:[input('06','找出句中被处理的内容。','我会把这些题记在本子上。','这些题',['这些题','我','本子']),use('06','用“把”说明一项课堂内容记在哪里。','把……记在……','我把重要的题记在本子上。')],
  v10_08:[input('08','选择表示“从头到尾看一次”的说法。','从头到尾看一次','看一遍',['看一遍','看一页','看一句']),use('08','用“看／讲／做＋一遍”说一句学习安排。','看／讲／做＋一遍','写作业以前，我看一遍笔记。')],
  v10_09:[input('09','数学越来越好，可以说成绩怎么样？','数学越来越好','提高了／提高成绩',['提高了／提高成绩','降低','忘记']),use('09','补全句子。','我希望____成绩。','提高')],
  v10_12:[input('12','考试做题以前要先看清楚什么？','考试做题以前','要求',['要求','年级','照片']),use('12','说明做错题的原因。','没看清楚要求','因为没看清楚要求，所以我做错了题。')],
  v10_14:[input('14','重新学习已经学过的内容叫什么？','重新学习已经学过的内容','复习',['复习','预习','休息']),use('14','说明明天考试前先复习什么。','明天考试以前……','我先复习外语。')],
  v10_17:[input('17','选出“学习时有问题”的自然表达。','学习时有问题','遇到问题',['遇到问题','遇到作业','遇到复习']),use('17','补全句子。','在学习上遇到问题，我会____。','问同学／问老师')],
  v10_18:[input('18','在学校图片中选择老师工作的地方。','老师工作的地方','办公室',['办公室','黑板','教室后面']),use('18','说出两人最后的决定。','去办公室','我们一起去办公室问李老师。')],
  v10_19:[input('19','指出句中缺少的词。','书上第五____','页',['页','句','遍']),use('19','说清问题在书的哪一页。','问题的位置','第五页。')],
  v10_20:[input('20','两个人互相说话的内容是什么？','两个人互相说话的内容','对话',['对话','句','年级']),use('20','说明问题位置。','第五页的对话','第五页的对话我看不懂。')],
  v10_21:[input('21','老师讲以前“不明白”，讲以后怎样？','老师讲完以后','明白了',['明白了','更难了','忘了']),use('21','确认自己已经理解。','终于／也＋明白了','我终于明白了。')],
  v10_22:[input('22','老师对不会的句子做什么？','不会的句子','讲／再讲一遍',['讲／再讲一遍','还书','考试']),use('22','向老师提出具体请求。','请您……','请您再讲一遍。')],
  v10_25:[input('25','指出句中缺少的词。','初中二____','年级',['年级','页','句']),use('25','介绍自己现在上几年级。','我现在上……','我现在上初中二年级。')],
  v10_27:[input('27','选择不把情况说成“每个人都一样”的词。','说明常见情况','一般',['一般','一定','都']),use('27','介绍一个常见教育阶段。','一般……','中国的小学一般是六年。')],
  v10_28:[input('28','为了升学目标，刘小雪现在怎么样？','为了升学目标','非常努力',['非常努力','很清楚','很一般']),use('28','说清一个目标和自己的行动。','目标＋行动','为了实现目标，我会努力学习。')]
};

const shapeData = {
  '02':['rèn','认',['认','让']], '03':['jì','记',['记','纪']], '04':['qīng','清',['清','情','晴']], '05':['bǎn','板',['板','饭']],
  '06':['bǎ','把',['把','吧']], '07':['zuò','作',['作','做']], '08':['biàn','遍',['遍','篇']], '09':['tí','提',['提','题']],
  '10':['lì','历',['历','厉']], '14':['fù','复',['复','夏']], '17':['yù','遇',['遇','偶']], '18':['shì','室',['室','屋']],
  '19':['yè','页',['页','叶']], '20':['huà','话',['话','活']], '21':['míng','明',['明','朋']], '22':['jiǎng','讲',['讲','进']],
  '25':['jí','级',['级','极']], '26':['hòu','后',['后','候']], '27':['bān','般',['般','船']], '28':['nǔ','努',['努','怒']]
};
function shapes(numbers, groupNo) { return numbers.filter(n => shapeData[n]).map(n => { const x=shapeData[n]; return activity(`l10_m${groupNo}_v${n}_shape`,'shape',[`v10_${n}`],'根据拼音选择正确的汉字。',x[0],x[1],x[2],{promptMode:'form'}); }); }
function activities(ids, groupNo) {
  const practice = ids.flatMap(id => (inputUse[id] || []).map(item => ({ ...item, id:item.id.replace(/^l10_m\d_/, `l10_m${groupNo}_`) })));
  return practice.concat(shapes(ids.map(id => id.slice(-2)), groupNo));
}

const vocabularyGroups = [
  { id:'T1', textIndex:0, title:taskDesigns[0].title, wordIds:['v10_01','v10_02','v10_03','v10_04','v10_05','v10_06','v10_07','v10_08','v10_09'], recognitionWordIds:['v10_01','v10_02','v10_03','v10_04','v10_05','v10_06','v10_07','v10_08','v10_09'] },
  { id:'T2', textIndex:1, title:taskDesigns[1].title, wordIds:['v10_10','v10_11','v10_12','v10_13','v10_14','v10_15','v10_16','v10_17','v10_18'], recognitionWordIds:['v10_10','v10_11','v10_12','v10_13','v10_14','v10_15','v10_16','v10_17','v10_18'] },
  { id:'T3', textIndex:2, title:taskDesigns[2].title, wordIds:['v10_06','v10_08','v10_19','v10_20','v10_21','v10_22','v10_23','v10_24'], recognitionWordIds:['v10_06','v10_08','v10_19','v10_20','v10_21','v10_22','v10_23','v10_24'] },
  { id:'T4', textIndex:3, title:taskDesigns[3].title, wordIds:['v10_04','v10_09','v10_25','v10_26','v10_27','v10_28'], recognitionWordIds:['v10_04','v10_09','v10_25','v10_26','v10_27','v10_28'] }
];
const activityWordIds = [
  ['v10_02','v10_03','v10_04','v10_05','v10_06','v10_07','v10_08','v10_09'],
  ['v10_10','v10_12','v10_13','v10_14','v10_17','v10_18'],
  ['v10_19','v10_20','v10_21','v10_22'],
  ['v10_25','v10_26','v10_27','v10_28']
];
vocabularyGroups.forEach((group, index) => { group.activities = activities(activityWordIds[index], index + 1); });
vocabularyGroups[0].activities.push(activity('l10_m1_v02_shape_zhen','shape',['v10_02'],'根据拼音选择正确的汉字。','zhēn','真',['真','直'],{promptMode:'form'}));
vocabularyGroups[1].activities.push(activity('l10_m2_v14_shape_xi','shape',['v10_14'],'根据拼音选择正确的汉字。','xí','习',['习','羽'],{promptMode:'form'}));

const resourceLinks = [
  [['l10_order_01','ready','连词成句'],['l10_pic_01','ready','看图产出'],['l10_pic_02','ready','看图产出'],['l10_pk_01','ready','课文问答'],['l10_scene_01','ready','情境选择'],['l10_scene_02','ready','情境选择'],['l10_fill_a','needs_revision','词汇填空'],['l10_para_01','needs_revision','段落填空'],['l10_task_01','needs_revision','表达任务'],['l10_blind_01','optional','盲盒'],['l10_guess_03','optional','猜词'],['l10_match_a','optional','词语匹配'],['l10_r_01','optional','竞赛'],['l10_relay_01','optional','接力']],
  [['l10_fill_b','ready','词汇填空'],['l10_order_02','ready','连词成句'],['l10_para_02','ready','段落填空'],['l10_pic_03','ready','看图产出'],['l10_pic_04','ready','看图产出'],['l10_pk_02','ready','课文问答'],['l10_scene_03','ready','情境选择'],['l10_scene_04','needs_revision','情境选择'],['l10_task_02','needs_revision','表达任务'],['l10_blind_02','optional','盲盒'],['l10_guess_05','optional','猜词'],['l10_match_b','optional','词语匹配'],['l10_relay_02','optional','接力']],
  [['l10_order_03','ready','连词成句'],['l10_para_03','ready','段落填空'],['l10_pic_05','ready','看图产出'],['l10_pic_06','ready','看图产出'],['l10_pk_03','ready','课文问答'],['l10_scene_05','ready','情境选择'],['l10_scene_06','ready','情境选择'],['l10_scene_07','ready','情境选择'],['l10_fill_c','needs_revision','词汇填空'],['l10_para_04','needs_revision','段落填空'],['l10_task_03','needs_revision','表达任务'],['l10_blind_03','optional','盲盒'],['l10_r_03','optional','竞赛'],['l10_r_04','optional','竞赛'],['l10_relay_03','optional','接力'],['l10_task_04','optional','备用任务'],['l10_match_c','optional','词语匹配']],
  [['l10_pic_07','ready','看图产出'],['l10_pic_08','ready','看图产出'],['l10_scene_08','ready','情境选择'],['l10_scene_09','ready','情境选择'],['l10_scene_10','ready','情境选择'],['l10_para_05','needs_revision','段落填空'],['l10_task_05','needs_revision','表达任务'],['l10_guess_08','optional','猜词'],['l10_guess_10','optional','猜词'],['l10_order_04','optional','连词成句'],['l10_info_01','optional','信息匹配'],['l10_info_02','optional','信息匹配']]
];

const resourceOverrides = [
  { id:'l10_fill_a', patch:{ data:{ wordBank:['数学','认真','笔记','黑板','提高'], sentences:[{sentence:'我的____越来越好。',answer:'数学'},{sentence:'上课时，我____听老师讲。',answer:'认真'},{sentence:'我每天都记____。',answer:'笔记'},{sentence:'老师把重要的题写在____上。',answer:'黑板'},{sentence:'我想____成绩。',answer:'提高'}] } } },
  { id:'l10_fill_c', patch:{ data:{ wordBank:['页','对话','明白','讲','句子'], sentences:[{sentence:'第五____有一个对话。',answer:'页'},{sentence:'第五页有一个____。',answer:'对话'},{sentence:'请老师再____一遍。',answer:'讲'},{sentence:'老师讲完以后，我终于____了。',answer:'明白'},{sentence:'这些____一点儿也不难。',answer:'句子'}] } } },
  { id:'l10_scene_04', patch:{ prompt_cn:'这几个外语题两个人都不会，他们最后去哪儿？', data:{ question_cn:'这几个外语题两个人都不会，他们最后去哪儿？', options:['回家不做了','去拍照','去办公室问李老师','把书还给同学'], correct_index:2 }, correct_answer:'去办公室问李老师' } },
  { id:'l10_para_01', patch:{ data:{ title:'整理课堂笔记', passageParts:['老师把重要的题写在____1____上，我会认真记____2____。写作业以前，我再看一____3____。'], options:['历史','黑板','遍','办公室','页','笔记'], answers:[1,5,2] } } },
  { id:'l10_para_04', patch:{ data:{ title:'做练习再还书', passageParts:['这本书上还有几个____1____。我今天做一____2____，明天再把书____3____给老师。'], options:['练习','遍','还','数学','年级','当然'], answers:[0,1,2] } } },
  { id:'l10_para_05', patch:{ data:{ title:'我的学习近况', passageParts:['我现在上初中二____1____，____2____要考高中，所以现在很____3____。'], options:['年级','后年','努力','办公室','对话','一般'], answers:[0,1,2] } } },
  { id:'l10_task_01', patch:{ prompt_cn:'任务卡：把我的学习方法介绍给同学。', prompt_en:'把我的学习方法介绍给同学', data:{ title:'把我的学习方法介绍给同学', titleEn:'把我的学习方法介绍给同学', role:'同学问你一门课怎样学得更好。先口头说30至40秒，再提交4至5句文字稿。', steps:['介绍一门想提高的学科。','说明一个课堂行动。','用“把”说清什么记在哪里。','说明写作业以前怎样使用笔记。','说明希望得到的结果。'], keywords:['g10_01','认真','笔记','遍','提高'], output:'教师确认结构正确、信息完整、口头表达和文字稿基本一致。' } } },
  { id:'l10_task_02', patch:{ prompt_cn:'任务卡：考试以后怎么做。', prompt_en:'考试以后怎么做', data:{ title:'考试以后怎么做', titleEn:'考试以后怎么做', role:'口头表达35至45秒，再提交5个要点；不需要提供真实分数。', steps:['说明什么考试。','说明结果或感受。','说明原因。','说明下一场考试前怎样复习。','说明两个人都不会时找谁求助。'], keywords:['在学习上','要求','复习','遇到'], output:'教师确认原因和行动相连，并有明确的求助决定。' } } },
  { id:'l10_task_03', patch:{ prompt_cn:'任务卡：把问题说清楚。', prompt_en:'把问题说清楚', data:{ title:'把问题说清楚', titleEn:'把问题说清楚', role:'三人轮换角色，每人都完成一次求助者；约40秒，并提交4句个人文字。', steps:['说清问题位置。','说清哪里不明白。','向老师提出具体请求。','说明什么时候把什么还给谁。'], keywords:['页','对话','讲一遍','明白','g10_03'], output:'教师确认位置准确、请求自然、归还物品和接收者清楚。' } } },
  { id:'l10_task_05', patch:{ prompt_cn:'任务卡：给朋友写学习近况。', prompt_en:'给朋友写学习近况', data:{ title:'给朋友写学习近况', titleEn:'给朋友写学习近况', role:'写6至8句短邮件，并做45至60秒口头分享。', steps:['问候朋友。','介绍当前年级。','说明学习目标。','说明为什么努力。','介绍一般教育阶段。','说明在谁的影响下发生了什么变化。','说明下次想分享什么。'], keywords:['年级','一般','努力','在……影响下','后年（可选）'], output:'教师确认个人信息可以真实或模拟、邮件顺序清楚、教育阶段表达不绝对。' } } }
];

const grammarBridges = [
  { evidence:'我会把这些题都记在本子上。', focus:'把 + 确定宾语 + 动词 + 在 / 到 + 地点', actionLabel:'进入“把”字句（位置改变）', grammarIndex:0 },
  { evidence:'在学习上遇到问题，你可以来问我。', focus:'在……上 / 中 / 下', actionLabel:'进入固定格式语法', grammarIndex:1 },
  { evidence:'你明天再把书还给我。', focus:'把 + 物品 + 动词 + 给 + 接收者', actionLabel:'进入“把”字句（关系转移）', grammarIndex:2 },
  { evidence:'在家月姐姐的影响下，我开始喜欢拍照了。', focus:'在……影响下', actionLabel:'进入固定格式语法', grammarIndex:1 }
];

function build() {
  const formal = read(formalPath);
  const lesson = formal.data;
  if (!lesson.meta || lesson.meta.lessonKey !== 'HSK3-L10') throw new Error('Unexpected formal lesson');
  if (!Array.isArray(lesson.texts) || lesson.texts.length !== 4) throw new Error('L10 must have four texts');

  const useGroups = taskDesigns.map((design, index) => ({
    ...design,
    responseMode:'teacherObservedWithTextOutline',
    exitRequirements:design.exitRequirements.map(item => ({ id:item[0], label:item[1] })),
    supportCards:design.supportCards.map(item => ({ id:item[0], labelCn:item[1], labelEn:'Support', contentCn:item[2], contentEn:'' })),
    textId:lesson.texts[index].id,
    entry:{ id:`l10_t${index + 1}_use_entry`, label:'起点表达', labelEn:'Starting expression', ...design.entry },
    exit:{ id:`l10_t${index + 1}_use_exit`, label:'终点表达', labelEn:'Upgraded expression', ...design.exit },
    linkedResources:{
      vocabulary:{ module:'teach', submodule:'tv', label:`课文${index + 1}词汇`, vocabSession:String(index + 1) },
      grammar:{ module:'teach', submodule:'tg', label:['“把”字句（位置改变）','“在……上／中／下”','“把”字句（关系转移）','“在……影响下”'][index], grammarIndex:[0,1,2,1][index] },
      text:{ module:'teach', submodule:'tt', label:`课文${index + 1}`, textIndex:index },
      practice:index < 3 ? { module:'practice', submodule:'g1', label:`连词成句 ${index + 1}`, routeState:{ g1i:index, g1s:[], g1a:[], g1sa:false } } : { module:'practice', submodule:'g2p', label:'学习近况看图表达', routeState:{ g2pi:6 } }
    },
    resourceLinks:resourceLinks[index].map(item => ({ id:item[0], status:item[1], purpose:item[2] }))
  }));

  const textLearning = lesson.texts.map((text, index) => ({
    textId:text.id, useGroupId:`T${index + 1}`, title:text.title,
    overviewChoices:overviewSets[index].map(item => ({ id:item[0], focus:item[1], questionCn:item[2], options:item[3], correctIndex:item[4] })),
    detailMode:'config',
    detailQuestions:detailSets[index].map(item => ({ id:item[0], questionCn:item[1], questionPinyin:item[2], answer:item[3], answerPinyin:item[4], acceptedAnswers:item[5], informationPoint:item[6] })),
    grammarBridge:grammarBridges[index],
    paragraphPractice:{ label:`调用“${['整理课堂笔记','考试复盘','做练习再还书','我的学习近况'][index]}”段落填空`, module:'practice', submodule:'r4p', index:[0,1,3,4][index] },
    lifeTransfer:{ promptCn:taskDesigns[index].exit.promptCn, promptEn:taskDesigns[index].exit.promptEn }
  }));

  const allActivities = vocabularyGroups.flatMap(group => group.activities);
  const recognitionIds = new Set(vocabularyGroups.flatMap(group => group.recognitionWordIds));
  const vocabularyCatalog = lesson.vocabulary.map(word => ({
    id:word.id, hanzi:word.hanzi, pinyin:word.pinyin, english:word.english, meaningCn:meaningCnById[word.id], phrases:word.phrases || [], example:word.example || '', tier:tierById[word.id],
    allowedTypes:Array.from(new Set([...(recognitionIds.has(word.id) ? ['recognition'] : []), ...allActivities.filter(item => item.targetWordIds.includes(word.id)).map(item => item.type)]))
  }));

  return {
    schemaVersion:'classpro-use-profile/v3',
    experiment:{ id:'l10-use-pilot-v1', title:'第10课·以用为主线升级版', lessonLabel:'第10课', sourceLesson:'HSK3-L10', scope:'四个课文MINI循环；保留L10原有词汇、语法、课文和练习教学样式。' },
    sources:{ lesson:{ path:'../lessons/HSK3-L10.json', sha256:formal.sha256 }, teacher:{ path:'../../in-class/teacher.html' }, student:{ path:'../../in-class/student.html' } },
    nativeTeaching:{ preserveCourseStyles:true, grammar:{ source:'formal_lesson', preserveExamples:true, preserveHighlights:true, preserveOralQuestions:true, preserveFollowUp:true }, text:{ source:'formal_lesson', preservePresentation:true } },
    useGroups, textLearning,
    vocabularyTaskTypes:[{id:'recognition',labelCn:'认读',labelEn:'Recognition'},{id:'shape',labelCn:'辨形',labelEn:'Character form'},{id:'input',labelCn:'输入',labelEn:'Type the word'},{id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}],
    timerPolicy:{ miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:3}, vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2}, autoClose:false },
    vocabularyCatalog, vocabularyGroups, resourceOverrides,
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
