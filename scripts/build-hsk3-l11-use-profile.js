const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const formalPath = path.join(root, 'source', 'data-model', 'lessons', 'HSK3-L11.json');
const outputPath = path.join(root, 'source', 'data-model', 'experiments', 'HSK3-L11-USE-PILOT-V1.json');

function read(filePath) {
  const buffer = fs.readFileSync(filePath);
  return { sha256: crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase(), data: JSON.parse(buffer.toString('utf8')) };
}

const taskDesigns = [
  {
    id:'T1', textIndex:0, icon:'🗓️', label:'课文 1', title:'通知会议变化并做好准备',
    goal:'向同学或同事说明会议或小组活动的新安排，并确认设备和会前准备。',
    goalEn:'Announce a changed meeting or group activity and confirm equipment and preparation.',
    entry:{ promptCn:'看图。一次会议或小组活动改了，请先用一两句话告诉大家发生了什么。', promptEn:'Look at the picture and briefly tell the group what changed.', stimulus:{ type:'image', image:'images/hsk3-l11/photo-text-1-meeting-change.png', labelCn:'会议变化', altCn:'会议时间发生改变', instructionCn:'先看图，再用一两句话说明变化。' } },
    exit:{ promptCn:'请通知一次会议或小组活动的变化：说明变化原因、新时间、新地点、设备选择和会前准备。', promptEn:'Announce a meeting or group-activity change. Give the reason, new time, new place, equipment choice, and preparation.' },
    exitRequirements:[['reason','变化原因'],['time','新时间'],['place','新地点'],['equipment','设备选择'],['preparation','会前准备']],
    supportCards:[['t1_words','词汇提示','会议、开会、后天、地点、发、或者'],['t1_frame','句式提示','我们用A还是B？／A或者B都可以。／因为……，所以……。／我们先把……准备好。'],['t1_order','表达顺序','为什么改 → 新时间 → 新地点 → 设备 → 准备']]
  },
  {
    id:'T2', textIndex:1, icon:'💻', label:'课文 2', title:'判断设备问题并请求帮助',
    goal:'根据看见或听见的情况判断设备可能出了什么问题，并向别人求助。',
    goalEn:'Infer an equipment problem from what can be seen or heard and ask for help.',
    entry:{ promptCn:'电脑用不了，请说说你觉得可能是什么问题，请别人帮忙。', promptEn:'The computer is not working. Say what the problem may be and ask someone for help.', stimulus:{ type:'image', image:'images/hsk3-l11/photo-text-2-no-picture.png', labelCn:'电脑故障', altCn:'电脑已经连接但屏幕没有画面', instructionCn:'根据图中的现象判断问题。' } },
    exit:{ promptCn:'电脑用不了。请根据看到或听到的情况，说说可能是什么问题、你试过什么、为什么还没解决，并请别人帮忙。', promptEn:'Use what you can see or hear to explain the likely problem, what you tried, why it is not solved, and ask for help.' },
    exitRequirements:[['symptom','至少一个现象'],['attempt','已经试过的动作'],['inference','用“看来”判断'],['help','提出求助']],
    supportCards:[['t2_words','词汇提示','声音、看来、办法、解决、只能、别人'],['t2_frame','句式提示','现在……看不见／听不见。／我检查了……。／看来……。／我只能找……帮忙。'],['t2_order','表达顺序','看到／听到什么 → 试了什么 → 怎么判断 → 请谁帮忙']]
  },
  {
    id:'T3', textIndex:2, icon:'👥', label:'课文 3', title:'说明缺席、重新分工和可能影响',
    goal:'有人不能参加时，向小组说明缺席情况、重新安排工作并判断可能的影响。',
    goalEn:'Explain an absence, reassign work and describe a possible effect.',
    entry:{ promptCn:'今天有人不能来。请每个人先写一个简单提纲：谁不能来、大家现在怎么做、可能会怎么样。\n缺席：____\n新分工：____\n可能的影响：____', promptEn:'Someone cannot come today. Write a short personal outline about the absence, the new work plan, and a possible effect.', stimulus:{ type:'image', image:'images/hsk3-l11/photo-text-3-workload.png', labelCn:'人员与工作量', altCn:'人员减少但工作仍然很多', instructionCn:'根据图中情况完成三行个人提纲。' } },
    exit:{ promptCn:'今天有人不能来，请说说缺席的情况、新的分工，可能会有的影响。\n缺席：____\n新分工：____\n可能的影响：____', promptEn:'Explain who is absent, the new division of work, and one possible effect.' },
    exitRequirements:[['absence','缺席情况'],['assignment','谁接手什么'],['effect','一个可能影响'],['language','本课词语或“把……做完”']],
    supportCards:[['t3_words','词汇提示','请假、同事、休假、怕、邮箱'],['t3_frame','句式提示','……因为……请假了。／我来……，你来……。／我们一起把……做完。／我怕……。'],['t3_order','表达顺序','谁不来 → 为什么 → 谁做什么 → 可能怎么样']]
  },
  {
    id:'T4', textIndex:3, icon:'🏙️', label:'课文 4', title:'说明是否接受外地机会',
    goal:'面对去另一个城市工作或学习的机会，说明自己的选择和理由。',
    goalEn:'Explain a decision about a work or study opportunity in another city.',
    entry:{ promptCn:'有人请你去别的城市工作或学习。你愿意吗？请简单说一个理由。', promptEn:'You have an opportunity to work or study in another city. Say whether you are willing to go and give one reason.', stimulus:{ type:'image', image:'images/hsk3-l11/photo-text-4-diary-choice.png', labelCn:'外地机会', altCn:'个人在工作机会、生活和家人之间作选择', instructionCn:'根据图中的选择情境表达自己的决定。' } },
    exit:{ promptCn:'有人给你一个去别的城市工作或学习的机会。请说明你愿不愿意、这个机会有什么好处、你最在意什么，并说出最后的选择。', promptEn:'Explain whether you would accept an opportunity in another city, its benefit, what matters most to you, and your final choice.' },
    exitRequirements:[['decision','愿意或不愿意'],['benefit','机会的好处'],['priority','最在意的事'],['view','用“对……来说”表达看法']],
    supportCards:[['t4_words','词汇提示','愿意、城市、离开、机会、生活'],['t4_frame','句式提示','虽然……，但是……。／对我来说，……很重要。／我愿意／不愿意……，因为……。'],['t4_order','表达顺序','机会是什么 → 好处 → 自己在意什么 → 最后选择']]
  }
];

const overviewSets = [
  [
    ['l11_t1_overall_01','main_idea','两个人主要在说哪一件事？',['怎么安排新的会议','怎么买一台新电脑','怎么请经理吃饭'],0],
    ['l11_t1_overall_02','development','两个人先说什么，后来又说什么？',['先问今天的会议，后来说明新的会议和准备','先修电脑，后来买电脑','先吃饭，后来回家'],0],
    ['l11_t1_overall_03','purpose','下面哪句话能把整段对话说清楚？',['会议的事改了，大家开会前还要准备。','会议已经开完了，大家可以回家。','两个人决定以后都不开会了。'],0]
  ],
  [
    ['l11_t2_overall_01','main_idea','两个人主要在做什么？',['检查电脑并想办法解决问题','选择会议时间','写一封工作邮件'],0],
    ['l11_t2_overall_02','development','他们试了电脑以后，电脑怎么样？',['还有问题。','什么问题都没有了。','他们一直没有开机。'],0],
    ['l11_t2_overall_03','purpose','这段对话最后想做什么？',['把问题说清楚，再请别人帮忙','告诉大家会议取消了','请大家马上回家'],0]
  ],
  [
    ['l11_t3_overall_01','main_idea','两个人主要在说什么？',['有人没来，工作要重新安排','大家一起去上海工作','电脑没有声音'],0],
    ['l11_t3_overall_02','development','王一雪开始和最后有什么不一样？',['开始有点儿着急，最后不着急了。','开始不想吃饭，最后生气了。','开始没有工作，最后工作更多了。'],0],
    ['l11_t3_overall_03','purpose','下面哪句话最适合这段对话？',['先看看新的消息，再决定是不是着急。','工作多的时候不能吃饭。','同事请假以后一定要取消工作。'],0]
  ],
  [
    ['l11_t4_overall_01','main_idea','王一雪主要在想什么？',['要不要去上海工作','要不要买新电脑','要不要请一天假'],0],
    ['l11_t4_overall_02','development','这篇日记前面写什么，后面写什么？',['前面写别人问她去不去上海，后面写她自己的想法。','前面写孩子上学，后面写丈夫回家。','前面写北京的天气，后面写上海的天气。'],0],
    ['l11_t4_overall_03','purpose','她写这篇日记，主要想说明什么？',['她为什么不愿意离开家人去上海','她为什么喜欢上海的天气','她怎样安排下一次会议'],0]
  ]
];

const detailSets = [
  [
    ['l11_t1_detail_01','今天下午为什么不开会？','Jīntiān xiàwǔ wèishénme bù kāihuì?','因为经理不在。','Yīnwèi jīnglǐ bú zài.',['因为经理不在','经理不在'],'会议取消的原因'],
    ['l11_t1_detail_02','新的会议什么时候、在哪儿开？','Xīn de huìyì shénme shíhou, zài nǎr kāi?','后天上午十点，在第一会议室。','Hòutiān shàngwǔ shí diǎn, zài dì-yī huìyìshì.',['后天上午十点，在第一会议室','后天十点，第一会议室'],'新时间和新地点'],
    ['l11_t1_detail_03','王一雪想在开会前请杨同乐做什么？','Wáng Yīxuě xiǎng zài kāihuì qián qǐng Yáng Tónglè zuò shénme?','早点儿过去，帮她把电脑接好。','Zǎodiǎnr guòqu, bāng tā bǎ diànnǎo jiēhǎo.',['帮她把电脑接好','早点儿过去接好电脑'],'会前准备及人物关系']
  ],
  [
    ['l11_t2_detail_01','王一雪第一次开机以后看见什么？','Wáng Yīxuě dì-yī cì kāijī yǐhòu kànjiàn shénme?','她什么都看不见。','Tā shénme dōu kàn bu jiàn.',['什么都看不见','看不见画面'],'最初现象'],
    ['l11_t2_detail_02','有画面以后，声音还有哪两个问题？','Yǒu huàmiàn yǐhòu, shēngyīn hái yǒu nǎ liǎng ge wèntí?','声音有点儿小，而且听不清楚。','Shēngyīn yǒudiǎnr xiǎo, érqiě tīng bu qīngchu.',['声音小，听不清楚','声音有点儿小，听不清楚'],'问题的继续和改变'],
    ['l11_t2_detail_03','杨同乐为什么决定找别人帮忙？','Yáng Tónglè wèishénme juédìng zhǎo biérén bāngmáng?','因为试了以后还有问题，他没办法解决。','Yīnwèi shì le yǐhòu hái yǒu wèntí, tā méi bànfǎ jiějué.',['因为他没办法解决','试了以后还有问题'],'求助的理由和课文依据']
  ],
  [
    ['l11_t3_detail_01','老张为什么没来？','Lǎo Zhāng wèishénme méi lái?','因为家里有点儿事，所以请假了。','Yīnwèi jiā li yǒudiǎnr shì, suǒyǐ qǐngjià le.',['家里有事，请假了','因为家里有事'],'缺席原因'],
    ['l11_t3_detail_02','王一雪为什么怕工作干不完？','Wáng Yīxuě wèishénme pà gōngzuò gàn bu wán?','因为好几个同事休假了，开会前还有很多工作。','Yīnwèi hǎo jǐ ge tóngshì xiūjià le, kāihuì qián hái yǒu hěn duō gōngzuò.',['同事休假，工作很多','好几个同事休假了'],'人员与工作量的关系'],
    ['l11_t3_detail_03','王一雪后来为什么不着急了？','Wáng Yīxuě hòulái wèishénme bù zháojí le?','因为经理还没回来，下周才能开会。','Yīnwèi jīnglǐ hái méi huílái, xià zhōu cái néng kāihuì.',['下周才开会','经理没回来，会议在下周'],'新消息带来的改变']
  ],
  [
    ['l11_t4_detail_01','上海的同事问王一雪什么？','Shànghǎi de tóngshì wèn Wáng Yīxuě shénme?','问她愿不愿意也去上海工作。','Wèn tā yuàn bu yuànyì yě qù Shànghǎi gōngzuò.',['愿不愿意去上海工作','问她要不要去上海工作'],'工作机会的来源'],
    ['l11_t4_detail_02','如果王一雪去别的城市工作，她的生活会有什么不同？','Rúguǒ Wáng Yīxuě qù biéde chéngshì gōngzuò, tā de shēnghuó huì yǒu shénme bù tóng?','她要离开丈夫和孩子。','Tā yào líkāi zhàngfu hé háizi.',['要离开家人','离开丈夫和孩子'],'选择带来的结果'],
    ['l11_t4_detail_03','上海可能有更好的机会，她为什么还是不愿意去？','Shànghǎi kěnéng yǒu gèng hǎo de jīhuì, tā wèishénme háishi bú yuànyì qù?','因为对她来说生活和家人也很重要。','Yīnwèi duì tā lái shuō shēnghuó hé jiārén yě hěn zhòngyào.',['生活和家人很重要','她不愿意离开家人'],'最后选择及理由']
  ]
];

const tierById = {};
'01,03,04,05,07,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25'.split(',').forEach(n => { tierById[`v11_${n}`] = 'expression'; });
'08,26,27'.split(',').forEach(n => { tierById[`v11_${n}`] = 'understanding'; });
'02,06'.split(',').forEach(n => { tierById[`v11_${n}`] = 'context'; });

const meaningCnById = {
  v11_01:'大家一起谈工作或重要事情。',v11_02:'在公司里负责很多工作的人。',v11_03:'大家在一起谈工作。',v11_04:'明天的下一天。',v11_05:'一件事在哪里发生。',v11_06:'房间，如教室、会议室。',v11_07:'把邮件或信息送给别人。',v11_08:'可以带着走的小电脑。',v11_09:'说明两个或几个都可以选择。',
  v11_10:'人说话或东西发出的、可以听见的东西。',v11_11:'根据已经看到或听到的情况说自己的想法。',v11_12:'解决问题可以怎么做。',v11_13:'把问题处理好，让问题不再有。',v11_14:'没有别的选择，只可以这样做。',v11_15:'自己以外的人。',
  v11_16:'因为有事，告诉老师或经理自己不能来。',v11_17:'和自己在同一个地方工作的人。',v11_18:'一段时间不工作，休息或出去玩。',v11_19:'担心不好的事情发生。',v11_20:'收到和发送电子邮件的地方。',
  v11_21:'自己想这样做，也可以这样做。',v11_22:'人很多、房子和工作也很多的地方。',v11_23:'从一个人或地方旁边走开。',v11_24:'可以做一件好事的时间或可能。',v11_25:'人每天怎么住、工作、学习和休息。',v11_26:'表示给谁或因为谁做一件事。',v11_27:'和“或者”意思相近，连接两个选择。'
};

function expressionPair(mini, number, stimulus, answer, phrase, example) {
  const wordId = `v11_${number}`;
  const prefix = `l11_m${mini}_v${number}`;
  return [
    { id:`${prefix}_input`, type:'input', targetWordIds:[wordId], promptCn:'根据语境完成句子。', promptEn:'', stimulus, answer, acceptedAnswers:[answer], options:[], promptMode:'meaning', evaluation:'automatic' },
    { id:`${prefix}_use`, type:'collocation', targetWordIds:[wordId], promptCn:`用“${phrase}”完成表达。（最多两句话）`, promptEn:'Use the phrase in one or two complete sentences.', stimulus:phrase, answer:example, acceptedAnswers:[], options:[], promptMode:'open_use', evaluation:'teacher' }
  ];
}

const activityRows = [
  [1,'01','我们下午三点有一个____。','会议','参加会议','我明天上午要参加会议。'],
  [1,'03','经理后天上午十点____。','开会','去开会','我们九点去第一会议室开会。'],
  [1,'04','今天是星期一，____是星期三。','后天','后天上午','会议改到后天上午十点。'],
  [1,'05','活动的____改到三号教室。','地点','会议地点','会议地点换到第一会议室。'],
  [1,'07','我现在给大家____邮件。','发','发邮件','我会给大家发邮件，告诉他们新时间。'],
  [1,'09','会议室的电脑____自己的电脑都可以。','或者','A或者B','你可以带笔记本电脑，或者用会议室的电脑。'],
  [2,'10','我看见画面了，但是听不见____。','声音','声音太小','声音太小，我听不清楚。'],
  [2,'11','试了几次还不行，____要找别人帮忙了。','看来','看来……','看来我没办法自己解决这个问题。'],
  [2,'12','这个问题很难，我现在没有____。','办法','想办法','我们一起想办法解决这个问题。'],
  [2,'13','谁能帮我____这个电脑问题？','解决','解决问题','小王来帮我们解决问题。'],
  [2,'14','我不会修电脑，____请别人帮忙。','只能','只能＋动词','声音还是太小，我们只能找老师。'],
  [2,'15','我自己做不了，需要请____帮忙。','别人','找别人','我没有办法，只能找别人帮忙。'],
  [3,'16','小李家里有事，今天____了。','请假','请一天假','他身体不舒服，想请一天假。'],
  [3,'17','我们在同一家公司工作，他是我的____。','同事','帮助同事','今天我会帮助同事把材料做完。'],
  [3,'18','王经理这周不工作，他在____。','休假','休假回来','他下周休假回来。'],
  [3,'19','工作太多，我____今天做不完。','怕','怕来不及','我怕来不及，想请你帮忙。'],
  [3,'20','请把材料发到公司的____里。','邮箱','发到邮箱','我们把文件发到公司邮箱里。'],
  [4,'21','你____去上海工作吗？','愿意','愿意去……','我愿意去上海工作，但是我也想和家人在一起。'],
  [4,'22','北京和上海都是大____。','城市','别的城市','我不愿意去别的城市工作。'],
  [4,'23','她不想____家人去很远的地方工作。','离开','离开家人','对我来说，工作很重要，但我不想离开家人。'],
  [4,'24','去上海工作可能是一个好____。','机会','工作机会','这是一个很好的工作机会。'],
  [4,'25','对我来说，工作很重要，____也很重要。','生活','城市生活','我喜欢这里的城市生活，也想和家人在一起。']
];

const activitiesByGroup = Object.fromEntries([1,2,3,4].map(mini => [mini, activityRows.filter(row => row[0] === mini).flatMap(row => expressionPair(...row))]));
const shapeRows = [
  [1,'05','dì','地',['地','他']],
  [1,'07','fā','发',['发','友']],
  [2,'10','shēng','声',['声','生']],
  [3,'16','qǐng','请',['请','情']],
  [3,'19','pà','怕',['怕','拍']],
  [4,'22','chéng','城',['城','诚']],
  [4,'24','jī','机',['机','几']]
];
shapeRows.forEach(([mini, number, pinyin, answer, options]) => activitiesByGroup[mini].push({
  id:`l11_m${mini}_v${number}_shape`, type:'shape', targetWordIds:[`v11_${number}`], promptCn:'根据拼音选择正确的汉字。', promptEn:'Choose the correct character from the pinyin.', stimulus:pinyin, answer, acceptedAnswers:[answer], options, promptMode:'form', evaluation:'automatic'
}));

const wordGroups = [
  ['01','02','03','04','05','06','07','08','09'],
  ['10','11','12','13','14','15'],
  ['16','17','18','19','20'],
  ['21','22','23','24','25','26','27']
].map(numbers => numbers.map(number => `v11_${number}`));

const vocabularyGroups = wordGroups.map((wordIds, index) => ({
  id:`T${index + 1}`, textIndex:index, title:taskDesigns[index].title, wordIds, recognitionWordIds:wordIds.slice(), activities:activitiesByGroup[index + 1]
}));

const resourceLinks = [
  [
    ['l11_fill_a','ready','词汇填空'],['l11_order_01','ready','连词成句'],['l11_scene_01','ready','情境选择'],['l11_scene_02','ready','情境选择'],['l11_scene_03','ready','情境选择'],['l11_match_a','ready','词语匹配'],['l11_pic_01','ready','看图表达'],['l11_task_01','ready','表达任务'],['l11_para_01','ready','段落填空'],['l11_pic_02','needs_revision','看图表达'],['l11_blind_01','optional','盲盒'],['l11_chain_01','optional','接力表达'],['l11_read_01','optional','独立阅读']
  ],
  [
    ['l11_fill_b','ready','词汇填空'],['l11_order_02','ready','连词成句'],['l11_scene_04','ready','情境选择'],['l11_scene_05','ready','情境选择'],['l11_scene_06','ready','情境选择'],['l11_match_b','ready','词语匹配'],['l11_pic_03','ready','看图表达'],['l11_pic_04','ready','看图表达'],['l11_task_02','ready','表达任务'],['l11_blind_02','ready','盲盒'],['l11_para_02','ready','段落填空'],['l11_chain_02','optional','接力表达'],['l11_read_02','optional','独立阅读']
  ],
  [
    ['l11_order_03','ready','连词成句'],['l11_scene_07','ready','情境选择'],['l11_scene_08','ready','情境选择'],['l11_pic_05','ready','看图表达'],['l11_task_03','ready','表达任务'],['l11_para_03','ready','段落填空'],['l11_fill_c','needs_revision','词汇填空'],['l11_pic_06','needs_revision','看图表达'],['l11_order_04','optional','连词成句'],['l11_blind_03','optional','盲盒'],['l11_chain_03','optional','接力表达'],['l11_read_03','optional','独立阅读'],['l11_match_c','optional','词语匹配']
  ],
  [
    ['l11_order_05','ready','连词成句'],['l11_scene_09','ready','情境选择'],['l11_scene_10','ready','情境选择'],['l11_guess_10','ready','猜词'],['l11_say_07','ready','看图说词'],['l11_say_08','ready','看图说词'],['l11_blind_04','ready','盲盒'],['l11_pic_07','ready','看图表达'],['l11_pic_08','ready','看图表达'],['l11_task_04','ready','表达任务'],['l11_para_04','ready','段落填空'],['l11_ind_read_04','ready','独立阅读'],['l11_chain_04','optional','接力表达'],['l11_task_05','optional','备用任务'],['l11_match_c','optional','词语匹配']
  ]
];

const grammarBridges = [
  { evidence:'我们用会议室的电脑还是自己的笔记本电脑？／会议室的电脑或者自己的电脑都可以。', focus:'选择疑问句用“还是”；陈述可选办法用“或者”', actionLabel:'进入“还是”和“或者”', grammarIndex:0 },
  { evidence:'看来我没办法解决这个问题，只能找别人来帮帮忙了。', focus:'已看到／听到的情况 + 看来 + 结论', actionLabel:'进入固定短语“看来”', grammarIndex:1 },
  { evidence:'吃完饭，我跟您一起把这些工作做完。', focus:'主语 + 把 + 确定宾语 + 动词 + 结果补语', actionLabel:'进入“把”字句（3）', grammarIndex:2 },
  { evidence:'但是对我来说，生活也很重要。', focus:'对 + 人／对象 + 来说，观点、感受或重要性', actionLabel:'进入固定格式“对……来说”', grammarIndex:3 }
];

const resourceOverrides = [
  {
    id:'l11_pic_02',
    patch:{
      prompt_cn:'看图完成对话。先问用哪台电脑，再回答两种都可以，最后说明会前怎么准备。写2—3句话。',
      prompt_en:'Write 2–3 sentences: ask about the computer choice, answer that either is fine, and say how to prepare before the meeting.',
      evaluation:'teacher',
      data:{ image:'images/hsk3-l11/photo-text-1-computer-choice.png', keyword:'还是、或者、把……接好', task:'先问用哪台电脑，再回答两种都可以，最后说明会前怎么准备。', answerPlaceholder:'写2—3句话。', sampleAnswer:'我们用会议室的电脑还是自己的电脑？两种电脑都可以。我们早点儿过去，把电脑接好。' }
    }
  },
  {
    id:'l11_fill_c',
    patch:{ data:{ wordBank:['请假','同事','休假','怕','邮箱'], sentences:[
      { sentence:'老张家里有事，所以____了。', answer:'请假' },
      { sentence:'好几个____都不在，今天的工作要重新安排。', answer:'同事' },
      { sentence:'王经理下周____回来。', answer:'休假' },
      { sentence:'工作太多，我____今天做不完。', answer:'怕' },
      { sentence:'请把材料发到公司的____里。', answer:'邮箱' }
    ] } }
  },
  {
    id:'l11_pic_06',
    patch:{
      prompt_cn:'看图说2—3句话：说明工作怎么完成、发到哪里、为什么现在不用太着急。',
      prompt_en:'Write 2–3 sentences about finishing the work, where to send it, and why it is less urgent now.',
      evaluation:'teacher',
      data:{ image:'images/hsk3-l11/photo-text-3-meeting-delay.png', keyword:'把……做完、邮箱、下周', task:'说明工作怎么完成、发到哪里、为什么现在不用太着急。', answerPlaceholder:'写2—3句话。', sampleAnswer:'我们先把这些工作做完，再发到公司的邮箱里。经理还没回来，下周才开会，所以现在不用太着急。' }
    }
  }
];

function build() {
  const formal = read(formalPath);
  const lesson = formal.data;
  if (!lesson.meta || lesson.meta.lessonKey !== 'HSK3-L11') throw new Error('Unexpected formal lesson');
  if (!Array.isArray(lesson.texts) || lesson.texts.length !== 4) throw new Error('L11 must have four texts');

  const grammarLabels = ['“还是”和“或者”','固定短语“看来”','“把”字句（3）：动作产生结果','固定格式“对……来说”'];
  const practiceRoutes = [
    { module:'practice', submodule:'g1', label:'连词成句：设备选择', routeState:{ g1i:0, g1s:[], g1a:[], g1sa:false } },
    { module:'practice', submodule:'g1', label:'连词成句：根据现象说结论', routeState:{ g1i:1, g1s:[], g1a:[], g1sa:false } },
    { module:'practice', submodule:'g1', label:'连词成句：把工作做完', routeState:{ g1i:2, g1s:[], g1a:[], g1sa:false } },
    { module:'practice', submodule:'g2p', label:'看图表达：重要选择', routeState:{ g2pi:7 } }
  ];
  const paragraphLabels = ['会议通知','设备检查','团队分工','城市机会'];

  const useGroups = taskDesigns.map((design, index) => ({
    ...design,
    responseMode:'teacherObservedWithTextOutline',
    exitRequirements:design.exitRequirements.map(item => ({ id:item[0], label:item[1] })),
    supportCards:design.supportCards.map(item => ({ id:item[0], labelCn:item[1], labelEn:'Support', contentCn:item[2], contentEn:'' })),
    textId:lesson.texts[index].id,
    entry:{ id:`l11_t${index + 1}_use_entry`, label:'起点表达', labelEn:'Starting expression', ...design.entry },
    exit:{ id:`l11_t${index + 1}_use_exit`, label:'终点表达', labelEn:'Upgraded expression', ...design.exit },
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
    paragraphPractice:{ label:`调用“${paragraphLabels[index]}”段落填空`, module:'practice', submodule:'r4p', index },
    lifeTransfer:{ promptCn:taskDesigns[index].exit.promptCn, promptEn:taskDesigns[index].exit.promptEn }
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
    experiment:{ id:'l11-use-pilot-v1', title:'第11课·以用为主线升级版', lessonLabel:'第11课', sourceLesson:'HSK3-L11', scope:'四个课文MINI循环；保留L11原有词汇、语法、课文和练习教学样式。' },
    sources:{ lesson:{ path:'../lessons/HSK3-L11.json', sha256:formal.sha256 }, teacher:{ path:'../../in-class/teacher.html' }, student:{ path:'../../in-class/student.html' } },
    nativeTeaching:{ preserveCourseStyles:true, grammar:{ source:'formal_lesson', preserveExamples:true, preserveHighlights:true, preserveOralQuestions:true, preserveFollowUp:true }, text:{ source:'formal_lesson', preservePresentation:true } },
    useGroups,
    textLearning,
    vocabularyTaskTypes:[{id:'recognition',labelCn:'认读',labelEn:'Recognition'},{id:'shape',labelCn:'辨形',labelEn:'Character form'},{id:'input',labelCn:'输入',labelEn:'Type the word'},{id:'collocation',labelCn:'搭配与使用',labelEn:'Collocation and use'}],
    timerPolicy:{ miniLoop:{optionsMinutes:[3,4,5],defaultMinutes:3}, vocabularyFocus:{optionsMinutes:[2,3,4,5],defaultMinutes:2}, autoClose:false },
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
