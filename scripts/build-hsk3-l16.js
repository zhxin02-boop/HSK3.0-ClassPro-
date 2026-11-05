const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceRef = 'textbook data/HSK3/L16.txt';
const out = path.join(root, 'source/data-model/lessons/HSK3-L16.json');
const sourceType = 'teaching_extension';
const pad = (n) => String(n).padStart(2, '0');
const image = (name) => 'images/hsk3-l16/' + name + '.png';

const vocabRows = [
  ['脏','zāng','形容词','dirty',1,'understanding','不干净',['又脏又小','衣服脏了'],'第一天看见它的时候，它又脏又小。','Dì-yī tiān kànjiàn tā de shíhou, tā yòu zāng yòu xiǎo.'],
  ['可爱',"kě'ài",'形容词','cute; lovely',1,'expression','让人喜欢',['特别可爱','可爱的小猫'],'它还特别可爱，一会儿在你脚边睡觉，一会儿在你身上爬。',"Tā hái tèbié kě'ài, yíhuìr zài nǐ jiǎobiān shuìjiào, yíhuìr zài nǐ shēnshang pá."],
  ['一会儿','yíhuìr','副词','now...now/then...',1,'expression','很短的时间；表示动作交替',['一会儿睡觉','等一会儿'],'它一会儿在你脚边睡觉，一会儿在你身上爬。','Tā yíhuìr zài nǐ jiǎobiān shuìjiào, yíhuìr zài nǐ shēnshang pá.'],
  ['脚','jiǎo','名词','foot',1,'understanding','人或动物身体最下面走路的部分',['脚边','洗脚'],'它一会儿在你脚边睡觉，一会儿在你身上爬。','Tā yíhuìr zài nǐ jiǎobiān shuìjiào, yíhuìr zài nǐ shēnshang pá.'],
  ['照顾','zhàogù','动词','take care of; look after',1,'expression','关心并帮助人或动物生活',['照顾小猫','好好照顾'],'你们把它照顾得真好。','Nǐmen bǎ tā zhàogù de zhēn hǎo.'],
  ['好像','hǎoxiàng','动词','seem; be like',1,'expression','看起来像；表示不完全确定的判断',['好像孩子','好像没吃饱'],'它就好像我们的孩子，我们照顾它，它也认得我们了。','Tā jiù hǎoxiàng wǒmen de háizi, wǒmen zhàogù tā, tā yě rènde wǒmen le.'],
  ['认得','rènde','动词','know; recognize',1,'expression','见过以后能够认出来',['认得我们','你认得吗'],'我们照顾它，它也认得我们了。','Wǒmen zhàogù tā, tā yě rènde wǒmen le.'],
  ['周末','zhōumò','名词','weekend',1,'expression','一周最后的休息日',['这个周末','周末去玩'],'我周末带你们去北京动物园看动物吧。','Wǒ zhōumò dài nǐmen qù Běijīng Dòngwùyuán kàn dòngwù ba.'],
  ['动物园','dòngwùyuán','名词','zoo',1,'expression','让人参观和了解动物的地方',['北京动物园','去动物园'],'我周末带你们去北京动物园看动物吧。','Wǒ zhōumò dài nǐmen qù Běijīng Dòngwùyuán kàn dòngwù ba.'],
  ['动物','dòngwù','名词','animal',1,'understanding','能自己活动和吃东西的生物',['野生动物','看动物'],'我周末带你们去北京动物园看动物吧。','Wǒ zhōumò dài nǐmen qù Běijīng Dòngwùyuán kàn dòngwù ba.'],
  ['大熊猫','dàxióngmāo','名词','giant panda',2,'expression','身体黑白相间、喜欢吃竹子的动物',['野生大熊猫','看大熊猫'],'大熊猫为什么是中国的国宝？','Dàxióngmāo wèishénme shì Zhōngguó de guóbǎo?'],
  ['奇怪','qíguài','形容词','strange',2,'expression','不平常，让人想问为什么',['很奇怪','奇怪的问题'],'大熊猫这个名字很奇怪，它们跟猫有什么关系？','Dàxióngmāo zhège míngzi hěn qíguài, tāmen gēn māo yǒu shénme guānxì?'],
  ['其实','qíshí','副词','actually',2,'expression','说明真实情况和原来想的不完全一样',['其实应该','其实可以'],'它们跟猫没什么关系，其实应该叫大猫熊。','Tāmen gēn māo méi shénme guānxì, qíshí yīnggāi jiào dàmāoxióng.'],
  ['竹子','zhúzi','名词','bamboo',2,'expression','大熊猫常吃的一种植物',['吃竹子','一片竹子'],'大熊猫为什么只吃竹子不吃肉？','Dàxióngmāo wèishénme zhǐ chī zhúzi bù chī ròu?'],
  ['国宝','guóbǎo','名词','national treasure',2,'expression','一个国家非常珍贵、很有代表性的事物',['中国国宝','国宝大熊猫'],'大熊猫为什么是中国的国宝？','Dàxióngmāo wèishénme shì Zhōngguó de guóbǎo?'],
  ['全','quán','形容词','whole; entire',2,'understanding','整个；没有少一部分',['全世界','全家'],'全世界只有中国有野生大熊猫。','Quán shìjiè zhǐyǒu Zhōngguó yǒu yěshēng dàxióngmāo.'],
  ['野生','yěshēng','形容词','wild',2,'understanding','在自然环境中生活，不是人养的',['野生动物','野生大熊猫'],'全世界只有中国有野生大熊猫。','Quán shìjiè zhǐyǒu Zhōngguó yǒu yěshēng dàxióngmāo.'],
  ['关于','guānyú','介词','about',2,'expression','引出要说、要问的话题',['关于熊猫','关于这个问题'],'关于这个问题，我得慢慢给你讲。','Guānyú zhège wèntí, wǒ děi mànmàn gěi nǐ jiǎng.'],
  ['饱','bǎo','形容词','full',3,'expression','吃够了，不饿',['吃饱','还没饱'],'它好像还没吃饱，站起来张着嘴找吃的呢。','Tā hǎoxiàng hái méi chībǎo, zhàn qǐlai zhāngzhe zuǐ zhǎo chī de ne.'],
  ['张','zhāng','动词','open',3,'understanding','把合着的东西打开',['张嘴','张着嘴'],'它好像还没吃饱，站起来张着嘴找吃的呢。','Tā hǎoxiàng hái méi chībǎo, zhàn qǐlai zhāngzhe zuǐ zhǎo chī de ne.'],
  ['嘴','zuǐ','名词','mouth',3,'expression','人或动物吃东西、说话的器官',['张嘴','嘴里'],'它好像还没吃饱，站起来张着嘴找吃的呢。','Tā hǎoxiàng hái méi chībǎo, zhàn qǐlai zhāngzhe zuǐ zhǎo chī de ne.'],
  ['身边','shēnbiān','名词',"one's side",3,'expression','离一个人或动物很近的地方',['在身边','它身边'],'它身边那只熊猫半天没动，是不是在睡觉呢？','Tā shēnbiān nà zhī xióngmāo bàntiān méi dòng, shì bu shì zài shuìjiào ne?'],
  ['半天','bàntiān','数量词','quite a while',3,'expression','比较长的一段时间',['等了半天','半天没动'],'它身边那只熊猫半天没动，是不是在睡觉呢？','Tā shēnbiān nà zhī xióngmāo bàntiān méi dòng, shì bu shì zài shuìjiào ne?'],
  ['脸','liǎn','名词','face',3,'expression','人或动物头的前面部分',['看不见脸','洗脸'],'我看不见它的脸，可能是吧。','Wǒ kàn bu jiàn tā de liǎn, kěnéng shì ba.'],
  ['大人','dàrén','名词','adult',4,'understanding','已经长大的人',['大人和孩子','一个大人'],'大人和孩子最喜爱的还是大熊猫。',"Dàrén hé háizi zuì xǐ'ài de háishì dàxióngmāo."],
  ['喜爱',"xǐ'ài",'动词','love; be fond of',4,'expression','非常喜欢',['喜爱动物','最喜爱的'],'大人和孩子最喜爱的还是大熊猫。',"Dàrén hé háizi zuì xǐ'ài de háishì dàxióngmāo."]
];

const textSession = {1:'A',2:'B',3:'C',4:'C'};
const vocabulary = vocabRows.map((r, i) => ({
  id: 'v16_' + pad(i + 1),
  hanzi: r[0], pinyin: r[1], pos: r[2], english: r[3],
  tags: [textSession[r[4]]], textId: r[4], tier: r[5],
  meaningCn: r[6], phrases: r[7],
  phraseSourceType: sourceType,
  example: r[8], examplePinyin: r[9],
  exampleSourceType: r[8].includes(r[0]) ? 'textbook' : sourceType,
  meaningCnSourceType: sourceType,
  sourceType: 'textbook', sourceRef
}));
const byWord = Object.fromEntries(vocabulary.map((v) => [v.hanzi, v]));
const card = (hanzi) => {
  const v = byWord[hanzi];
  return {vocabularyId:v.id,hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,phrases:v.phrases,example:v.example,examplePinyin:v.examplePinyin,tier:v.tier};
};

const grammarRows = [
  {
    id:'g16_01',title:'一会儿……，一会儿……',titleEn:'Coordinate complex sentence 一会儿……，一会儿……',appliesTo:[1],
    scene:'同一只动物在短时间内交替做不同动作。',
    structure:'主语 + 一会儿 + 动作/状态1，+ 一会儿 + 动作/状态2',
    explanation:'表示短时间内发生的不同动作，或者一种对立的情况。',
    variants:[['动作—动作','一会儿 + 动作1，一会儿 + 动作2'],['状态—状态','一会儿 + 状态1，一会儿 + 状态2'],['地点—地点','一会儿在 + 地点1，一会儿在 + 地点2']],
    followImage:'photo-text-1-pet-care-decision',
    followTarget:'使用完整“一会儿……，一会儿……”描述图片中的两种动作。',
    followSample:'小猫一会儿在孩子脚边休息，一会儿爬到椅子上。',
    oral:['你见过哪种动物一会儿做这个、一会儿做那个？','你照顾小动物时会交替做哪些事？','今天的天气一会儿怎么样，一会儿怎么样？'],
    examples:[
      ['它一会儿在你脚边睡觉，一会儿在你身上爬。','Tā yíhuìr zài nǐ jiǎobiān shuìjiào, yíhuìr zài nǐ shēnshang pá.','One moment it sleeps by your feet, and the next it climbs on you.','textbook'],
      ['他一会儿进来，一会儿出去，忙得很。','Tā yíhuìr jìnlai, yíhuìr chūqu, máng de hěn.','He comes in one moment and goes out the next; he is very busy.','textbook'],
      ['最近天气变化很快，一会儿冷，一会儿热。','Zuìjìn tiānqì biànhuà hěn kuài, yíhuìr lěng, yíhuìr rè.','The weather changes quickly lately: cold one moment and hot the next.','textbook'],
      ['小猫一会儿追球，一会儿回到孩子身边。','Xiǎomāo yíhuìr zhuī qiú, yíhuìr huídào háizi shēnbiān.','The kitten chases a ball and then returns to the child.','teaching_extension'],
      ['周末我一会儿给小狗准备水，一会儿陪它游戏。','Zhōumò wǒ yíhuìr gěi xiǎogǒu zhǔnbèi shuǐ, yíhuìr péi tā yóuxì.','At the weekend I prepare water for the puppy and then play with it.','teaching_extension']
    ]
  },
  {
    id:'g16_02',title:'介词“关于”',titleEn:'Preposition 关于',appliesTo:[2],
    scene:'孩子提出一个动物话题，母亲围绕这个话题回答。',
    structure:'关于 + 名词/话题，+ 完整句子',
    explanation:'介词“关于”后面加名词，引出涉及的对象。',
    variants:[['句首话题','关于 + 话题，+ 完整句子'],['名词修饰','关于 + 话题 + 的 + 名词']],
    followImage:'photo-text-2-panda-questions',
    followTarget:'用“关于”提出或回答一个大熊猫问题。',
    followSample:'关于大熊猫的食物，我知道它们喜欢吃竹子。',
    oral:['关于大熊猫，你最想知道什么？','关于养宠物，家人应该先讨论什么？','关于周末活动，你想告诉同学什么？'],
    examples:[
      ['关于这个问题，我得慢慢给你讲。','Guānyú zhège wèntí, wǒ děi mànmàn gěi nǐ jiǎng.','Regarding this question, I need to explain it slowly.','textbook'],
      ['关于他的要求，我们还要开会以后再决定。','Guānyú tā de yāoqiú, wǒmen hái yào kāihuì yǐhòu zài juédìng.','Regarding his request, we will decide after a meeting.','textbook'],
      ['关于比赛的时间，我明天一定会告诉大家。','Guānyú bǐsài de shíjiān, wǒ míngtiān yídìng huì gàosu dàjiā.','I will tell everyone tomorrow about the competition time.','textbook'],
      ['关于领养小动物，我们先看看家里有没有时间照顾它。','Guānyú lǐngyǎng xiǎo dòngwù, wǒmen xiān kànkan jiālǐ yǒu méiyǒu shíjiān zhàogù tā.','Regarding adopting a small animal, first we should see whether the family has time to care for it.','teaching_extension'],
      ['我看了一本关于大熊猫的书。','Wǒ kànle yì běn guānyú dàxióngmāo de shū.','I read a book about giant pandas.','teaching_extension']
    ]
  },
  {
    id:'g16_03',title:'一般来说',titleEn:'Set phrase 一般来说',appliesTo:[3],
    scene:'从一次观察上升到多数情况下都成立的动物习惯。',
    structure:'一般来说，+ 大多数情况下成立的完整句子',
    explanation:'是一个固定短语，意思是大多数情况下是这样，常用于句子的开头。',
    variants:[['一般习惯','一般来说，+ 动物/人的常见习惯'],['一般规律','一般来说，+ 常见规律']],
    followImage:'photo-text-3-panda-daily-routine',
    followTarget:'用“一般来说”介绍一个能从图片看出的熊猫习惯。',
    followSample:'一般来说，大熊猫每天会花很多时间吃竹子。',
    oral:['一般来说，大熊猫喜欢吃什么？','一般来说，你周末几点起床？','一般来说，去动物园应该注意什么？'],
    examples:[
      ['一般来说，熊猫每天要睡很多次觉。','Yìbānláishuō, xióngmāo měitiān yào shuì hěn duō cì jiào.','Generally speaking, pandas sleep many times a day.','textbook'],
      ['一般来说，这种树每年开一次花。','Yìbānláishuō, zhè zhǒng shù měinián kāi yí cì huā.','Generally speaking, this kind of tree flowers once a year.','textbook'],
      ['一般来说，学习外语需要多练习。','Yìbānláishuō, xuéxí wàiyǔ xūyào duō liànxí.','Generally speaking, learning a foreign language requires practice.','textbook'],
      ['一般来说，野生动物不适合养在家里。','Yìbānláishuō, yěshēng dòngwù bù shìhé yǎng zài jiālǐ.','Generally speaking, wild animals are not suitable as household pets.','teaching_extension'],
      ['一般来说，周末动物园的游客更多。','Yìbānláishuō, zhōumò dòngwùyuán de yóukè gèng duō.','Generally speaking, there are more zoo visitors at weekends.','teaching_extension']
    ]
  },
  {
    id:'g16_04',title:'比较句（11）',titleEn:'Comparative sentences (11)',appliesTo:[4],
    scene:'比较冬天和夏天的游客数量与关门时间。',
    structure:'A 比 B + 多/少/早/晚 + 动词 + 数量短语',
    explanation:'用“比”表示的比较句中，谓语为一般动词时，前面可以用“多、少、早、晚”，表示两者在数量或时间上的差异。',
    variants:[['数量差异','A 比 B + 多/少 + 动词 + 数量短语'],['时间差异','A 比 B + 早/晚 + 动词 + 数量短语']],
    followImage:'photo-text-4-winter-summer-zoo',
    followTarget:'比较冬天和夏天的游客数量或参观时间。',
    followSample:'冬天比夏天游客少，也比平时早关门一个小时。',
    oral:['冬天去动物园比夏天有什么不同？','你今天比昨天早起了多久？','周末动物园比平时多来了多少游客？'],
    examples:[
      ['冬天比夏天早关门一个小时。','Dōngtiān bǐ xiàtiān zǎo guānmén yí gè xiǎoshí.','In winter it closes one hour earlier than in summer.','textbook'],
      ['哥哥比弟弟多吃了三个饺子。','Gēge bǐ dìdi duō chīle sān gè jiǎozi.','The older brother ate three more dumplings than the younger brother.','textbook'],
      ['我比他晚到了十分钟。','Wǒ bǐ tā wǎn dàole shí fēnzhōng.','I arrived ten minutes later than he did.','textbook'],
      ['周末动物园比平时多来了很多游客。','Zhōumò dòngwùyuán bǐ píngshí duō láile hěn duō yóukè.','Many more visitors came to the zoo at the weekend than usual.','teaching_extension'],
      ['小明比小雪晚到动物园十分钟。','Xiǎomíng bǐ Xiǎoxuě wǎn dào dòngwùyuán shí fēnzhōng.','Xiaoming arrived at the zoo ten minutes later than Xiaoxue.','teaching_extension']
    ]
  }
];

const grammar = grammarRows.map((g) => ({
  id:g.id,title:g.title,titleEn:g.titleEn,appliesTo:g.appliesTo,
  scene:g.scene,sceneSourceType:sourceType,
  structure:g.structure,structureSourceType:g.id === 'g16_04' ? 'textbook' : sourceType,
  explanation:g.explanation,explanationSourceType:'textbook',
  sourceType:'textbook',sourceRef,
  examples:g.examples.map((e) => ({hanzi:e[0],pinyin:e[1],english:e[2],sourceType:e[3],hanziSourceType:e[3],pinyinSourceType:sourceType,englishSourceType:sourceType})),
  editorialNote:null
}));

const textRows = [
  {
    id:'t_hsk3_l16_01',textId:1,title:'宠物领养店里的决定',format:'dialogue',genre:'对话',
    setting:'在一家宠物领养店，王一雪和孩子们在看动物。',audio:'../../audio/HSK3/16-1.mp3',
    lines:[
      ['刘小雪','这只小猫你们养了多久了？','Zhè zhī xiǎo māo nǐmen yǎngle duōjiǔ le?','How long have you had this kitten?'],
      ['服务员','已经一年多了。第一天看见它的时候，它又脏又小。','Yǐjīng yì nián duō le. Dì-yī tiān kànjiàn tā de shíhou, tā yòu zāng yòu xiǎo.',"It's been more than a year. When we first saw it on day one, it was dirty and small."],
      ['刘小雪','现在它变得又干净又漂亮了。','Xiànzài tā biànde yòu gānjìng yòu piàoliang le.','Now it has become clean and pretty.'],
      ['服务员','是啊。它还特别可爱，一会儿在你脚边睡觉，一会儿在你身上爬。',"Shì a. Tā hái tèbié kě'ài, yíhuìr zài nǐ jiǎobiān shuìjiào, yíhuìr zài nǐ shēnshang pá.",'Yes. It is also very cute; one moment it sleeps by your feet, and the next it climbs on you.'],
      ['刘小雪','你们把它照顾得真好。','Nǐmen bǎ tā zhàogù de zhēn hǎo.','You took really good care of it.'],
      ['服务员','它就好像我们的孩子，我们照顾它，它也认得我们了。','Tā jiù hǎoxiàng wǒmen de háizi, wǒmen zhàogù tā, tā yě rènde wǒmen le.',"It's just like our child. We care for it, and it recognizes us too."],
      ['刘小雪','妈妈，我们家也养一只小猫吧。','Māma, wǒmen jiā yě yǎng yì zhī xiǎo māo ba.',"Mom, let's keep a kitten at home too."],
      ['王一雪','咱们没时间照顾，还是别养了，我周末带你们去北京动物园看动物吧。','Zánmen méi shíjiān zhàogù, háishì bié yǎng le, wǒ zhōumò dài nǐmen qù Běijīng Dòngwùyuán kàn dòngwù ba.',"We don't have time to look after one, so let's not. I'll take you to the Beijing Zoo this weekend to see animals."]
    ]
  },
  {
    id:'t_hsk3_l16_02',textId:2,title:'熊猫问题台',format:'dialogue',genre:'对话',
    setting:'在动物园，王一雪和孩子们边走边聊。',audio:'../../audio/HSK3/16-3.mp3',
    lines:[
      ['刘小明','妈妈，大熊猫这个名字很奇怪，它们跟猫有什么关系？','Māma, dàxióngmāo zhège míngzi hěn qíguài, tāmen gēn māo yǒu shénme guānxì?','Mom, the name "giant panda" (big bear-cat) is very strange. What relation do they have with cats?'],
      ['王一雪','这个问题问得好，它们跟猫没什么关系，其实应该叫大猫熊。','Zhège wèntí wèn de hǎo, tāmen gēn māo méi shénme guānxì, qíshí yīnggāi jiào dàmāoxióng.',"That's a good question. They don't have much to do with cats; actually they should be called \"cat-bears.\""],
      ['刘小明','大熊猫为什么只吃竹子不吃肉？','Dàxióngmāo wèishénme zhǐ chī zhúzi bù chī ròu?','Why do giant pandas only eat bamboo and not meat?'],
      ['王一雪','它们跟人一样，也可以吃肉，但是对肉不感兴趣。','Tāmen gēn rén yíyàng, yě kěyǐ chī ròu, dànshì duì ròu bù gǎn xìngqù.','Just like humans, they can eat meat, but they are not interested in it.'],
      ['刘小明','大熊猫为什么是中国的国宝？','Dàxióngmāo wèishénme shì Zhōngguó de guóbǎo?',"Why are giant pandas China's national treasure?"],
      ['王一雪','全世界只有中国有野生大熊猫，中国是大熊猫的家。','Quán shìjiè zhǐyǒu Zhōngguó yǒu yěshēng dàxióngmāo, Zhōngguó shì dàxióngmāo de jiā.','China is the only place in the whole world with wild giant pandas; China is their home.'],
      ['刘小明','我听说有的熊猫出国了，他们去哪儿了？','Wǒ tīngshuō yǒude xióngmāo chūguó le, tāmen qù nǎr le?','I heard that some pandas went abroad. Where did they go?'],
      ['王一雪','关于这个问题，我得慢慢给你讲。','Guānyú zhège wèntí, wǒ děi mànmàn gěi nǐ jiǎng.',"Regarding this question, I'll have to explain it to you slowly."],
      ['刘小雪','弟弟，你真是“十万个为什么”。','Dìdi, nǐ zhēnshì “shíwàn gè wèishénme”.','Little brother, you really are "A Hundred Thousand Whys."']
    ],
    cultureNote:'“十万个为什么”源于中国很受欢迎的少儿科普读物《十万个为什么》，常用来说明孩子充满好奇心、问题多。'
  },
  {
    id:'t_hsk3_l16_03',textId:3,title:'熊猫馆观察报告',format:'dialogue',genre:'对话',
    setting:'在熊猫馆，王一雪和孩子们在看大熊猫。',audio:'../../audio/HSK3/16-5.mp3',
    lines:[
      ['刘小雪','这只大熊猫一会儿爬上去，一会儿跳下来，可爱极了！',"Zhè zhī dàxióngmāo yíhuìr pá shàngqu, yíhuìr tiào xiàlai, kě'ài jí le!","This panda climbs up one second and jumps down the next; it's so cute!"],
      ['王一雪','它好像还没吃饱，站起来张着嘴找吃的呢。','Tā hǎoxiàng hái méi chībǎo, zhàn qǐlai zhāngzhe zuǐ zhǎo chī de ne.',"It seems like it hasn't had enough to eat yet; it's standing up with its mouth open looking for food."],
      ['刘小雪','它身边那只熊猫半天没动，是不是在睡觉呢？','Tā shēnbiān nà zhī xióngmāo bàntiān méi dòng, shì bu shì zài shuìjiào ne?',"The panda next to it hasn't moved for quite a while; is it sleeping?"],
      ['王一雪','我看不见它的脸，可能是吧。一般来说，熊猫每天要睡很多次觉。','Wǒ kàn bu jiàn tā de liǎn, kěnéng shì ba. Yìbānláishuō, xióngmāo měitiān yào shuì hěn duō cì jiào.',"I can't see its face, but probably. Generally speaking, pandas sleep many times a day."],
      ['刘小雪','对，除了睡觉以外，很多时间都在吃东西。','Duì, chúle shuìjiào yǐwài, hěn duō shíjiān dōu zài chī dōngxi.','Right, besides sleeping, they spend a lot of time eating.'],
      ['刘小明','大熊猫的生活真舒服啊！','Dàxióngmāo de shēnghuó zhēn shūfu a!',"A giant panda's life is really comfortable!"],
      ['刘小雪','妈妈，您帮我和这两只大熊猫照一张照片吧。','Māma, nín bāng wǒ hé zhè liǎng zhī dàxióngmāo zhào yì zhāng zhàopiàn ba.','Mom, please take a photo of me with these two pandas.']
    ]
  },
  {
    id:'t_hsk3_l16_04',textId:4,title:'北京动物园参观日记',format:'diary',genre:'日记',
    setting:'在家里，王一雪在写日记。',author:'王一雪',audio:'../../audio/HSK3/16-7.mp3',
    lines:[
      ['王一雪','今天我带小雪和小明去动物园玩了。北京动物园是中国很有名的动物园，里面有非常多的动物，当然，大人和孩子最喜爱的还是大熊猫。每天有很多游客去熊猫馆，他们带着相机去给可爱的大熊猫拍照。动物园早上七点半开门，晚上七点关门，冬天比夏天游客少，所以也比平时早关门一个小时。如果第一次来北京旅游，跟家人一起去北京动物园是个不错的选择。',"Jīntiān wǒ dài Xiǎoxuě hé Xiǎomíng qù dòngwùyuán wán le. Běijīng Dòngwùyuán shì Zhōngguó hěn yǒumíng de dòngwùyuán, lǐmiàn yǒu fēicháng duō de dòngwù, dāngrán, dàrén hé háizi zuì xǐ'ài de háishì dàxióngmāo. Měitiān yǒu hěn duō yóukè qù xióngmāoguǎn, tāmen dàizhe xiàngjī qù gěi kě'ài de dàxióngmāo pāizhào. Dòngwùyuán zǎoshang qī diǎn bàn kāimén, wǎnshang qī diǎn guānmén, dōngtiān bǐ xiàtiān yóukè shǎo, suǒyǐ yě bǐ píngshí zǎo guānmén yí gè xiǎoshí. Rúguǒ dì-yī cì lái Běijīng lǚyóu, gēn jiārén yìqǐ qù Běijīng Dòngwùyuán shì gè búcuò de xuǎnzé.",'Today I took Xiaoxue and Xiaoming to the zoo. Beijing Zoo is a famous zoo in China with many animals, and both adults and children especially love the giant pandas. Many visitors bring cameras to photograph them. The zoo opens at 7:30 a.m. and closes at 7:00 p.m.; in winter there are fewer visitors than in summer and it closes one hour earlier than usual. For a first trip to Beijing, visiting Beijing Zoo with family is a good choice.','teaching_extension']
    ]
  }
];

const texts = textRows.map((t) => ({
  id:t.id,textId:t.textId,title:t.title,titleSourceType:sourceType,
  format:t.format,genre:t.genre,setting:t.setting,author:t.author || null,
  audio:t.audio,audioStatus:'available',plannedAudio:null,
  sourceType:'textbook',sourceRef,cultureNote:t.cultureNote || null,
  lines:t.lines.map((line) => ({
    speaker:line[0],hanzi:line[1],pinyin:line[2],english:line[3],
    hanziSourceType:'textbook',pinyinSourceType:'textbook',
    englishSourceType:line[4] || 'textbook'
  }))
}));

const sessions = [
  {id:'A',title:'第一次课：我想领养的动物',textIds:[texts[0].id],previewMissionId:'pm_hsk3_l16_a',communicativeGoal:'说出自己想领养什么动物，并用简单理由说明选择。',grammarIds:['g16_01'],classroomOutput:'30—45秒“我想领养的动物”',sourceType},
  {id:'B',title:'第二次课：我眼中的大熊猫',textIds:[texts[1].id],previewMissionId:'pm_hsk3_l16_b',communicativeGoal:'用自己会说的词和课文事实介绍大熊猫。',grammarIds:['g16_02'],classroomOutput:'30—45秒“我眼中的大熊猫”',sourceType},
  {id:'C',title:'第三次课：熊猫习惯与北京参观建议',textIds:[texts[2].id,texts[3].id],previewMissionId:'pm_hsk3_l16_c',communicativeGoal:'介绍熊猫的习惯，并给第一次来北京的家人朋友简单、实用的建议。',grammarIds:['g16_03','g16_04'],classroomOutput:'1—2分钟“熊猫习惯与北京参观建议”',sourceType}
];

const sceneSpecs = [
  [1,'l16_vocab_scene_t1_01','领养店里的小猫','photo-text-1-adoption-shop','这只小猫刚来时和现在有什么变化？','看小猫的毛、大小、动作和孩子的反应。',['脏','可爱','脚','认得'],[['脏',26,52],['脚',52,72],['可爱',76,42]],['它刚来的时候又脏又小，现在又干净又可爱。','它好像认得服务员，一直在她脚边。']],
  [1,'l16_vocab_scene_t1_02','领养前的家庭决定','photo-text-1-pet-care-decision','这家人适合马上领养小猫吗？为什么？','看谁在照顾、家人的时间和小猫的行为。',['照顾','一会儿','周末','动物'],[['脚',38,70],['动物',68,55],['周末',82,28]],['孩子很喜爱小猫，可是大人不一定有时间照顾它。','小猫一会儿在脚边睡觉，一会儿爬到孩子身边。']],
  [2,'l16_vocab_scene_t2_01','孩子的熊猫问题','photo-text-2-panda-questions','孩子关于大熊猫最想知道什么？','看大熊猫、竹子、孩子提问和妈妈解释。',['大熊猫','奇怪','竹子','国宝','关于'],[['大熊猫',72,52],['竹子',82,68],['国宝',52,28]],['他想知道大熊猫跟猫有什么关系。','他还想知道大熊猫为什么是中国的国宝。']],
  [2,'l16_vocab_scene_t2_02','野生大熊猫的家','photo-text-2-wild-panda-home','为什么说中国是大熊猫的家？','看竹林、野生大熊猫和自然环境。',['全','野生','大熊猫','竹子'],[['野生',30,35],['大熊猫',55,58],['竹子',78,42]],['全世界只有中国有野生大熊猫。','其实大熊猫可以吃肉，但是它们对肉不感兴趣。']],
  [3,'l16_vocab_scene_t3_01','熊猫馆行为观察','photo-text-3-panda-observation','两只大熊猫正在做什么？','一只活动，一只休息；观察嘴、脸、身体位置。',['饱','张','嘴','身边','半天','脸'],[['嘴',31,48],['身边',55,58],['脸',78,40]],['这只大熊猫好像没吃饱，正张着嘴找吃的。','它身边那只熊猫半天没动，可能在睡觉。']],
  [3,'l16_vocab_scene_t3_02','大熊猫的一天','photo-text-3-panda-daily-routine','一般来说，大熊猫一天怎样生活？','看吃竹子、睡觉和活动三个信息点。',['饱','半天','大熊猫','竹子'],[['竹子',24,64],['大熊猫',52,42],['半天',76,28]],['一般来说，大熊猫每天要睡很多次觉。','除了睡觉以外，它们很多时间都在吃东西。']],
  [4,'l16_vocab_scene_t4_01','一家人参观熊猫馆','photo-text-4-zoo-family-visit','为什么大人和孩子都喜欢去熊猫馆？','看家庭、游客、相机和熊猫。',['大人','喜爱','动物园','大熊猫'],[['大人',18,48],['大熊猫',78,50],['动物园',52,24]],['大人和孩子最喜爱的还是大熊猫。','很多游客带着相机去给大熊猫拍照。']],
  [4,'l16_vocab_scene_t4_02','冬天和夏天去动物园','photo-text-4-winter-summer-zoo','冬天和夏天参观动物园有什么不同？','对比冬夏游客数量、天色和关门时间。',['大人','喜爱','动物园','全'],[['动物园',50,34],['大人',24,65],['全',76,62]],['冬天比夏天游客少。','冬天比平时早关门一个小时。']]
];

const vocabScenes = Object.fromEntries([1,2,3,4].map((n) => [String(n), {
  title:'课文' + n + '词汇场景',
  steps:sceneSpecs.filter((s) => s[0] === n).map((s) => ({
    id:s[1],title:s[2],image:image(s[3]),prompt:s[4],promptPinyin:'',
    promptEn:'Observe the image and answer the specific scene question in Chinese.',
    talkHint:s[5],words:s[6].map(card),
    labels:s[7].map((x) => ({text:x[0],x:x[1],y:x[2]})),
    sampleAnswers:s[8],sourceType
  }))
}]));

const grammarTeachingNotes = Object.fromEntries(grammarRows.map((g, i) => [g.id, {
  presentationMode:'progressive_grammar',
  mergeNoticeObserve:true,
  observeMode:'structure_rows',
  scene:g.scene,
  observePrompt:'先观察例句中反复出现的部分，再说它帮助我们表达什么。',
  observeHighlights:g.examples.map((e) => e[0].split(/[，。；]/).filter(Boolean)),
  examples:grammar[i].examples,
  visualLearning:{
    leadExamples:[grammar[i].examples[0]],
    blocks:g.structure.split('+').map((x) => x.trim()),
    blockLabelsEn:['topic','cue','action or state','detail']
  },
  oralQuestions:g.oral.map((question) => ({question,pinyin:''})),
  structureVariants:g.variants.map((v) => ({
    label:v[0],formula:v[1],formulaEn:v[1],explanation:g.explanation,
    example:g.examples[0][0],examplePinyin:g.examples[0][1]
  })),
  followUp:[{
    image:image(g.followImage),
    promptEn:'Use the target structure to describe the image.',
    target:g.followTarget,
    sampleAnswer:g.followSample,
    samplePinyin:[
      'Xiǎomāo yíhuìr zài háizi jiǎobiān xiūxi, yíhuìr pá dào yǐzi shàng.',
      'Guānyú dàxióngmāo de shíwù, wǒ zhīdào tāmen xǐhuan chī zhúzi.',
      'Yìbānláishuō, dàxióngmāo měitiān huì huā hěn duō shíjiān chī zhúzi.',
      'Dōngtiān bǐ xiàtiān yóukè shǎo, yě bǐ píngshí zǎo guānmén yí gè xiǎoshí.'
    ][i]
  }],
  editorialNote:null,
  sourceType
}]));

const overallRows = [
  [
    ['l16_t1_overall_01','大家在看什么？',['一只小狗','一只小猫','一只大熊猫'],1],
    ['l16_t1_overall_02','小猫现在怎么样？',['又干净又漂亮','又脏又小','不认得服务员'],0],
    ['l16_t1_overall_03','妈妈最后怎么说？',['明天去买一只猫','现在把猫带回家','周末带孩子们去动物园'],2]
  ],
  [
    ['l16_t2_overall_01','刘小明一直在问谁的问题？',['小猫','大熊猫','服务员'],1],
    ['l16_t2_overall_02','他问了名字、食物、国宝，还问了什么？',['大熊猫睡多久','动物园几点关门','有的熊猫去了哪里'],2],
    ['l16_t2_overall_03','王一雪在做什么？',['回答刘小明的问题','给大熊猫拍照','让孩子们回家'],0]
  ],
  [
    ['l16_t3_overall_01','他们在看什么？',['两只大熊猫','一只小猫','很多游客'],0],
    ['l16_t3_overall_02','第一只和第二只熊猫一样吗？',['一样，都在睡觉','一样，都在吃东西','不一样，一只在动，一只很久没动'],2],
    ['l16_t3_overall_03','刘小雪最后想做什么？',['给熊猫吃东西','和两只熊猫照相','带一只熊猫回家'],1]
  ],
  [
    ['l16_t4_overall_01','王一雪今天带孩子们去了哪里？',['南京','宠物领养店','北京动物园'],2],
    ['l16_t4_overall_02','大人和孩子最喜欢看什么？',['小猫','大熊猫','竹子'],1],
    ['l16_t4_overall_03','第一次来北京，王一雪觉得怎么做不错？',['跟家人一起去北京动物园','晚上七点以后去动物园','冬天晚一点去动物园'],0]
  ]
];

const detailRows = [
  [
    ['领养店养这只小猫多久了？','已经一年多了。','饲养时间'],
    ['第一天看见它时，它怎么样？','它又脏又小。','过去状态'],
    ['这只小猫会做哪两种事？','它一会儿在脚边睡觉，一会儿在人身上爬。','交替行为'],
    ['小猫为什么认得服务员了？','因为服务员们一直照顾它。','照顾关系'],
    ['王一雪准备什么时候带孩子们去哪里？','周末带他们去北京动物园。','最终安排']
  ],
  [
    ['大熊猫跟猫有什么关系？','它们跟猫没什么关系。','名称与分类'],
    ['大熊猫可以吃肉，为什么主要吃竹子？','因为它们对肉不感兴趣。','食物偏好'],
    ['大熊猫为什么是中国的国宝？','因为全世界只有中国有野生大熊猫。','国宝原因'],
    ['刘小明问熊猫去了哪里后，王一雪怎么回答？','她说关于这个问题，得慢慢给他讲。','关于句与回应'],
    ['刘小雪说弟弟是“十万个为什么”是什么意思？','意思是他很好奇、问题很多。','教材文化注释']
  ],
  [
    ['第一只大熊猫一会儿做什么，一会儿做什么？','一会儿爬上去，一会儿跳下来。','交替动作'],
    ['为什么王一雪觉得它还没吃饱？','因为它站起来张着嘴找吃的。','饥饿判断'],
    ['为什么她们不能确定身边那只熊猫是不是在睡觉？','它半天没动，而且她们看不见它的脸。','观察与推测'],
    ['一般来说，大熊猫每天怎样生活？','它们每天睡很多次觉，也花很多时间吃东西。','一般习惯'],
    ['刘小雪最后请妈妈做什么？','给她和两只大熊猫照一张照片。','最后请求']
  ],
  [
    ['王一雪带谁去动物园了？','她带小雪和小明去了。','同行人物'],
    ['大人和孩子最喜爱什么动物？','他们最喜爱大熊猫。','最受欢迎动物'],
    ['游客为什么带着相机去熊猫馆？','为了给可爱的大熊猫拍照。','游客行为'],
    ['动物园几点开门、几点关门？','早上七点半开门，晚上七点关门。','开放时间'],
    ['冬天和夏天有什么不同，作者给了什么建议？','冬天游客少，也早关门一个小时；第一次来北京可以和家人去北京动物园。','季节比较与建议']
  ]
];

const applicationSpecs = [
  {
    listenPrompt:'先听对话，只找“在哪里、看什么、妈妈最后怎么说”。',
    pre:['你喜欢什么小动物？','养小动物以前，家人需要先想什么？'],
    key:[['又脏又小／又干净又漂亮','对比以前和现在'],['把它照顾得真好','评价照顾结果'],['一会儿……一会儿……','描述交替动作'],['还是别养了','给出家庭决定']],
    culture:{title:'喜欢动物，也要负责任',titleEn:'Loving Animals Responsibly',background:'Adoption is a long-term family responsibility. A family should consider time, space and daily care before bringing an animal home.',questions:['家里谁能每天照顾小动物？','如果暂时不能养，还可以怎样喜欢和帮助动物？'],words:['照顾','时间','周末','动物园'],samples:['我们平时太忙，现在不适合养，但是周末可以去动物园了解动物。','如果家里人都能每天照顾它，我们再考虑领养。']},
    nodes:[['来到领养店','大家在哪里？'],['以前','小猫刚来时怎么样？'],['现在','小猫现在有什么变化？'],['行为','它会做什么？'],['决定','家人最后怎么决定？']],
    frame:'这只小猫已经……。刚来的时候，它……；现在……。它一会儿……，一会儿……。孩子想……，可是家里……，所以王一雪决定……。',
    personal:'如果你想领养一只动物，你想领养什么？为什么？',
    grammarIds:['g16_01'],paragraph:'l16_para_01',mini:'mini_l16_t1_pet_adoption'
  },
  {
    listenPrompt:'先听对话，只找“刘小明在问谁、还问了什么、妈妈在做什么”。',
    pre:['关于大熊猫，你已经知道什么？','如果可以问动物园老师一个问题，你最想问什么？'],
    key:[['跟……有什么关系','询问关系'],['其实应该……','说明真实情况'],['对……不感兴趣','说明食物偏好'],['全世界只有……','说明特别之处'],['关于这个问题……','引出话题']],
    culture:{title:'从“十万个为什么”开始提问',titleEn:'Learn by Asking Why',background:'The textbook note explains that 《十万个为什么》 is a popular Chinese science-reading title for children. The expression can describe a curious child who asks many questions.',questions:['为什么刘小雪叫弟弟“十万个为什么”？','一个好问题应该怎样问得清楚？'],words:['奇怪','其实','关于','为什么'],samples:['因为刘小明一直问大熊猫为什么这样、为什么那样。','我会先说“关于……”，再问一个清楚的问题。']},
    nodes:[['名字','为什么名字奇怪？'],['关系','跟猫有关系吗？'],['食物','为什么吃竹子？'],['国宝','为什么是国宝？'],['出国','还问了什么？']],
    frame:'刘小明先问……。王一雪说其实……。接着他想知道……。关于……，王一雪说……。姐姐觉得弟弟……。',
    personal:'介绍一下你眼中的大熊猫。',
    grammarIds:['g16_02'],paragraph:'l16_para_02',mini:'mini_l16_t2_panda_questions'
  },
  {
    listenPrompt:'先听对话，只找“他们在看什么、两只熊猫一样不一样、最后想做什么”。',
    pre:['观察动物时，你会先看它的哪些动作？','“我看见的”和“我猜的”有什么不同？'],
    key:[['爬上去／跳下来','描述动作'],['张着嘴','描述看见的样子'],['是不是在……呢','提出推测'],['一般来说','说明常见习惯'],['除了……以外……','补充另一种习惯']],
    culture:{title:'安静、准确地观察动物',titleEn:'Observe Animals with Care',background:'A good observation separates visible facts from guesses. Visitors should follow zoo rules and avoid feeding or disturbing animals.',questions:['哪些话是看到的事实？哪些话用了“好像、可能”表示推测？','在动物园观察时应该注意什么？'],words:['张着嘴','身边','半天','好像'],samples:['“它张着嘴”是看到的，“它好像没吃饱”是推测。','我们应该安静观察，不喂动物。']},
    nodes:[['第一只','第一只熊猫在做什么？'],['推测','它好像怎么了？'],['第二只','身边的熊猫怎么样？'],['习惯','熊猫一般怎样生活？'],['照片','最后想做什么？']],
    frame:'第一只熊猫一会儿……，一会儿……，它好像……。它身边的熊猫……，可能……。一般来说，大熊猫……。最后刘小雪……。',
    personal:'介绍一下熊猫的习惯。',
    grammarIds:['g16_03'],paragraph:'l16_para_03',mini:'mini_l16_t3_panda_observation'
  },
  {
    listenPrompt:'先听日记，只找“去了哪里、最喜欢什么、第一次来北京可以怎么做”。',
    pre:['去动物园以前，你会先了解哪些信息？','你喜欢游客多的时候去，还是游客少的时候去？为什么？'],
    key:[['最喜爱的还是……','说明最受欢迎的动物'],['带着相机去……','说明参观行为'],['比……少','比较数量'],['比平时早关门一个小时','比较时间'],['如果第一次……','给第一次来的人建议']],
    culture:{title:'看懂信息再安排家庭活动',titleEn:'Plan with Public Information',background:'Opening hours and visitor numbers can change a family plan. Good advice compares the available information and gives a clear reason.',questions:['带孩子去动物园要先看哪些信息？','冬天游客少但关门早，应该怎样安排？'],words:['开门','关门','游客','大人','选择'],samples:['要先看开门和关门时间，还要想孩子能走多久。','冬天游客少，但是早关门一个小时，所以我们应该早一点儿去。']},
    nodes:[['同行','带谁去动物园？'],['动物','里面有什么？'],['熊猫','大家最喜欢什么？'],['时间','什么时候开门和关门？'],['建议','第一次来北京怎么安排？']],
    frame:'今天我带……去了……。那里有……，大家最喜爱的还是……。动物园……开门、……关门。冬天比夏天……，也比平时……。如果……，我建议……。',
    personal:'给第一次来北京旅游的家人朋友一些建议。',
    grammarIds:['g16_04'],paragraph:'l16_para_04',mini:'mini_l16_t4_zoo_advice'
  }
];

const makeOverall = (row) => ({
  id:row[0],focus:'overall_understanding',question:row[1],pinyin:'',
  options:row[2],correctIndex:row[3],answer:row[2][row[3]],sourceType
});
const makeDetail = (row, textNo, i) => ({
  id:'l16_t' + textNo + '_detail_' + pad(i + 1),
  question:row[0],questionCn:row[0],pinyin:'',questionPinyin:'',
  answer:row[1],answerPinyin:'',acceptedAnswers:[row[1]],
  informationPoint:row[2],sourceType
});

const textTeachingNotes = Object.fromEntries(texts.map((text, i) => {
  const spec = applicationSpecs[i];
  const overallChoices = overallRows[i].map(makeOverall);
  const details = detailRows[i].map((r, j) => makeDetail(r, i + 1, j));
  const note = {
    presentationMode:'listen_first_progressive',
    studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],
    listenPrompt:spec.listenPrompt,
    audioStatus:'available',
    preReadingQuestions:spec.pre.map((question) => ({question,pinyin:''})),
    overallChoices,
    details,
    keyPoints:spec.key.map((k) => ({hanzi:k[0],pinyin:'',note:k[1]})),
    cultureDiscussion:{
      title:spec.culture.title,titleEn:spec.culture.titleEn,
      questions:spec.culture.questions,background:spec.culture.background,
      wordCards:spec.culture.words.map((hanzi) => ({hanzi,pinyin:byWord[hanzi]?.pinyin || '',english:byWord[hanzi]?.english || hanzi})),
      sampleAnswers:spec.culture.samples.map((hanzi) => ({hanzi,pinyin:''})),
      sourceType
    },
    retellScaffold:{
      nodes:spec.nodes.map((n) => ({label:n[0],hint:n[1]})),
      frame:spec.frame,
      promptEn:'Retell the text with the five prompts, then connect it to your own life.',
      sourceType
    },
    languageAndApplication:{
      grammarIds:spec.grammarIds,
      personalPrompt:spec.personal,
      paragraphPracticeId:spec.paragraph,
      miniId:spec.mini
    },
    sourceType
  };
  note.overallChoice = overallChoices;
  note.classQuestions = details;
  return [text.id, note];
}));

const vocabGroups = {
  A:vocabulary.slice(0,10),
  B:vocabulary.slice(10,18),
  C:vocabulary.slice(18,26)
};
const placeAnswer = (answer, distractors, index) => {
  const opts = distractors.filter((x) => x !== answer).slice(0,3);
  while (opts.length < 3) opts.push('不符合题意');
  opts.splice(index, 0, answer);
  return opts;
};
const quiz = (id, question, answer, distractors, index) => {
  const options = placeAnswer(answer,distractors,index);
  return {id,question,questionEn:'Choose the best answer.',options,correctIndex:index,answer,sourceType};
};

const previewSpecs = {
  A:{
    title:'第一次课课前热身赛',titleEn:'Which Animal Would I Adopt?',photo:'photo-text-1-adoption-shop',
    words:['可爱','照顾','认得','周末','动物园','脏','一会儿','脚'],
    background:'Liking an animal does not always mean a family is ready to adopt it. Time and daily care matter.',
    contexts:[
      ['这只小猫很____，孩子们都喜欢它。','可爱',['脏','奇怪','野生']],
      ['我们每天都要____小狗，给它准备水和食物。','照顾',['认得','关于','喜爱']],
      ['小猫常在我的____边睡觉。','脚',['嘴','脸','身边']],
      ['家里平时很忙，____可以去动物园看动物。','周末',['半天','其实','全']],
      ['小狗一会儿跑，一会儿休息。哪一个词说明动作会变化？','一会儿',['动物园','认得','照顾']]
    ],
    challenge:[
      ['“可爱”最接近哪个意思？','让人喜欢',['不干净','已经吃够了','整个']],
      ['哪一句说明有人每天帮助小动物生活？','她每天照顾小猫。',['她认得小猫。','她喜欢周末。','她去了动物园。']],
      ['“认得”最接近哪个意思？','见过以后能够认出来',['一直睡觉','打开嘴','比较早']],
      ['哪一句正确使用“一会儿……一会儿……”？','小猫一会儿追球，一会儿睡觉。',['小猫一会儿很。','一会儿小猫周末。','小猫动物园一会儿。']],
      ['领养以前，家人最需要先想什么？','有没有时间每天照顾它',['小猫是不是国宝','动物园几点关门','竹子是什么颜色']],
      ['王一雪为什么不马上养小猫？','家里没有时间照顾',['小猫不可爱','孩子不喜欢动物','领养店没有小猫']],
      ['“周末”是哪段时间？','一周最后的休息日',['每天早上','整个夏天','吃饭以前']],
      ['小猫刚来时怎么样？','又脏又小',['又干净又漂亮','一直在吃竹子','半天没动']],
      ['王一雪准备周末带孩子去哪里？','北京动物园',['南京','宠物医院','学校']],
      ['你想领养动物时，完整回答至少要有什么？','一种动物和一个理由',['只说一个词','只问一个问题','只说几点开门']]
    ]
  },
  B:{
    title:'第二次课课前热身赛',titleEn:'The Panda in My Eyes',photo:'photo-text-2-panda-questions',
    words:['大熊猫','竹子','国宝','野生','关于','奇怪','其实','全'],
    background:'Clear questions and factual answers help us introduce an animal accurately.',
    contexts:[
      ['大熊猫最常吃的食物是____。','竹子',['嘴','脚','国宝']],
      ['全世界只有中国有____大熊猫。','野生',['可爱','奇怪','大人']],
      ['____这个问题，我得慢慢给你讲。','关于',['其实','全','半天']],
      ['它们跟猫没关系，____应该叫大猫熊。','其实',['关于','周末','身边']],
      ['大熊猫是中国的____。','国宝',['动物园','脸','周末']]
    ],
    challenge:[
      ['“野生”说明动物在哪里生活？','在自然环境中',['只在家里','只在学校','只在商店']],
      ['大熊猫跟猫有什么关系？','没什么关系',['是同一种动物','大熊猫就是小猫','只在周末有关系']],
      ['大熊猫为什么主要吃竹子？','它们对肉不感兴趣',['它们不能张嘴','竹子是国宝','动物园没有肉']],
      ['哪一句正确使用“关于”？','关于大熊猫，我知道它喜欢吃竹子。',['大熊猫关于吃。','我关于很可爱。','竹子关于国宝。']],
      ['“全世界”最接近哪个意思？','整个世界',['一个动物园','一个周末','半天时间']],
      ['大熊猫为什么是中国的国宝？','全世界只有中国有野生大熊猫',['因为它叫猫','因为它每天照相','因为它晚上关门']],
      ['“其实”常用来做什么？','说明真实情况',['表示身体部位','说明开放时间','表示一周结束']],
      ['刘小明还问了熊猫的什么问题？','有的熊猫去了哪里',['小猫养了多久','动物园几点开门','冬天游客多少']],
      ['“十万个为什么”可以说什么样的孩子？','很好奇、问题很多',['不喜欢说话','一直睡觉','只会拍照']],
      ['介绍大熊猫时，至少可以说什么？','样子、食物或特别之处',['只说名字','只读拼音','只说自己的年龄']]
    ]
  },
  C:{
    title:'第三次课课前热身赛',titleEn:'Panda Habits and Beijing Tips',photo:'photo-text-3-panda-observation',
    words:['饱','嘴','身边','半天','脸','大人','喜爱','张'],
    background:'Separate visible facts from guesses, then compare visitor information before giving advice.',
    contexts:[
      ['熊猫站起来____着嘴找吃的。','张',['饱','全','关于']],
      ['它____那只熊猫半天没动。','身边',['周末','其实','动物园']],
      ['我看不见它的____，不能确定它是不是睡觉。','脸',['脚','竹子','国宝']],
      ['一般来说，大熊猫很多时间都在吃东西和____。','睡觉',['关门','出国','领养']],
      ['冬天比夏天游客____。','少',['早','晚','全']]
    ],
    challenge:[
      ['“吃饱了”是什么意思？','已经吃够了，不饿',['还想找食物','半天没动','张着嘴']],
      ['哪一句只说看见的事实？','熊猫正张着嘴。',['熊猫好像没吃饱。','熊猫可能想回家。','熊猫一定不高兴。']],
      ['“身边”最接近哪个意思？','离一个人或动物很近的地方',['很远的国家','早上七点半','整个世界']],
      ['哪一句表示大多数情况下都这样？','一般来说，熊猫每天睡很多次觉。',['这只熊猫现在睡觉。','我昨天看见熊猫。','请给熊猫拍照。']],
      ['课文中另一只熊猫为什么可能在睡觉？','它半天没动',['它一直跳下来','它正在吃肉','它在给游客拍照']],
      ['动物园早上几点开门？','七点半',['七点','八点半','十点']],
      ['冬天和夏天相比，游客怎么样？','冬天游客少',['冬天游客多','一样多','课文没说']],
      ['冬天的关门时间有什么不同？','比平时早一个小时',['比平时晚一个小时','每天都不关门','只开一个小时']],
      ['给第一次来北京的家人什么建议合适？','一起去北京动物园，并先看开放时间',['晚上七点以后再去','不看时间直接去','在熊猫馆喂动物']],
      ['完整介绍熊猫习惯至少要说什么？','两个熊猫习惯',['只说“可爱”','只说动物园名字','只读一个生词']]
    ]
  }
};

const previewMissions = sessions.map((session) => {
  const key = session.id;
  const lower = key.toLowerCase();
  const spec = previewSpecs[key];
  const words = spec.words.map((w) => byWord[w]);
  const base = 'pre_l16_' + lower;
  const recognitionPositions = [0,1,2,3];
  const recognition = words.slice(0,4).map((v, i) => quiz(
    base + '_rec_' + pad(i + 1),
    '“' + v.hanzi + '”最接近哪个意思？',
    v.meaningCn,
    words.filter((x) => x.id !== v.id).map((x) => x.meaningCn),
    recognitionPositions[i]
  ));
  const contextPositions = [0,1,2,0,1];
  const contexts = spec.contexts.map((r, i) => quiz(
    base + '_ctx_' + pad(i + 1),r[0],r[1],r[2],contextPositions[i]
  ));
  const challengePositions = [0,1,2,3,0,1,2,3,0,1];
  const challenge = spec.challenge.map((r, i) => quiz(
    base + '_ch_' + pad(i + 1),r[0],r[1],r[2],challengePositions[i]
  ));
  return {
    id:'pm_hsk3_l16_' + lower,session:key,pilotMode:'ranked_vocab_preview_v1',
    title:spec.title,titleEn:spec.titleEn,
    subtitleEn:'Five stages prepare you for the next classroom task.',
    scenario:spec.titleEn,
    goals:[session.communicativeGoal,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],
    storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',
    storyIntroEn:spec.background,
    storyRole:'Prepare one useful sentence for the next classroom task.',
    sourceType,
    stages:[
      {id:base+'_01',order:1,title:'认识词语、短语和背景',titleEn:'Meet the Words',interactionType:'study_list',photos:[{src:'../in-class/'+image(spec.photo),label:spec.titleEn}],keywordCards:words.map((v) => ({...card(v.hanzi),sourceType})),backgroundEn:spec.background,sourceType},
      {id:base+'_02',order:2,title:'认读与词义选择',titleEn:'Recognition',interactionType:'practice_quiz',questions:recognition,recognitionWordIds:words.slice(0,4).map((v) => v.id),sourceType},
      {id:base+'_03',order:3,title:'中英文匹配',titleEn:'Chinese-English Match',interactionType:'timed_match',pairs:words.slice(0,6).map((v, i) => ({id:base+'_pair_'+pad(i+1),word:v.hanzi,meaning:v.english,sourceType})),sourceType},
      {id:base+'_04',order:4,title:'完整语境判断',titleEn:'Context Check',interactionType:'practice_quiz',questions:contexts,sourceType},
      {id:base+'_05',order:5,title:'有分数的最终挑战',titleEn:'Scored Challenge',interactionType:'ranked_quiz',questions:challenge,sourceType}
    ],
    reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],
    persistenceKeyPattern:'ClassProPreview_HSK3-L16_' + key + '_{student}_{contentVersion}',
    contentVersion:'HSK3-L16-v1',
    completionMessageEn:'Preview complete. Bring one useful sentence to class.'
  };
});

const rolePattern = ['lesson','lesson','lesson','lesson','lesson','transfer','transfer','transfer','review','review'];
let roleIndex = 0;
const tag = (item, role) => ({...item,contentRole:role || rolePattern[roleIndex++ % rolePattern.length],sourceType});
const choice = (id, prompt, options, correctIndex, extra = {}) => tag({
  id,type:'choice',prompt_cn:prompt,prompt_en:'Choose the best answer.',
  correct_answer:options[correctIndex],
  data:{question_cn:prompt,options,correct_index:correctIndex,answer:options[correctIndex],...extra}
});
const open = (id, prompt, data = {}) => tag({
  id,type:'open_response',prompt_cn:prompt,prompt_en:'Respond in complete Chinese.',
  openEnded:true,needsTeacherReview:true,
  data:{answerPlaceholder:'请写一个完整、自然的中文句子。',...data}
});

const questionGroups = {};
const fillSpecs = [
  ['a',['可爱','照顾','认得','周末','动物园'],[
    ['这只小猫很____，孩子们都喜欢它。','可爱'],
    ['领养以后，家人要每天____它。','照顾'],
    ['服务员每天陪小猫，所以小猫____她。','认得'],
    ['我们平时很忙，____可以去看动物。','周末'],
    ['王一雪带孩子们去北京____。','动物园']
  ]],
  ['b',['大熊猫','竹子','国宝','野生','关于'],[
    ['____的身体是黑白两种颜色。','大熊猫'],
    ['熊猫很多时间都在吃____。','竹子'],
    ['大熊猫是中国的____。','国宝'],
    ['全世界只有中国有____大熊猫。','野生'],
    ['____熊猫出国的问题，妈妈要慢慢讲。','关于']
  ]],
  ['c',['饱','嘴','身边','半天','喜爱'],[
    ['它还没吃____，所以一直找吃的。','饱'],
    ['熊猫张着____找竹子。','嘴'],
    ['它____的熊猫正在睡觉。','身边'],
    ['那只熊猫____没动。','半天'],
    ['大人和孩子都很____大熊猫。','喜爱']
  ]]
];
questionGroups.v5_vocab_fill = fillSpecs.map((g) => tag({
  id:'l16_v5_' + g[0],type:'vocab_fill_group',
  prompt_cn:'选择词语完成五个完整句子。',
  data:{wordBank:g[1],sentences:g[2].map((s, i) => ({id:'l16_v5_'+g[0]+'_'+pad(i+1),sentence:s[0],answer:s[1],acceptedAnswers:[s[1]]}))}
}));

const matchSpecs = [
  ['课文1：小猫和领养决定',[
    ['这只小猫刚来时怎么样？','它又脏又小。'],
    ['领养店养它多久了？','已经一年多了。'],
    ['小猫为什么认得服务员？','因为服务员们一直照顾它。'],
    ['王一雪为什么不让孩子马上养猫？','因为家里没有时间照顾。'],
    ['周末王一雪准备带孩子去哪里？','去北京动物园看动物。']
  ]],
  ['课文2：大熊猫小问答',[
    ['大熊猫跟猫有什么关系？','它们跟猫没什么关系。'],
    ['大熊猫可以吃肉，为什么主要吃竹子？','因为它们对肉不感兴趣。'],
    ['大熊猫为什么是中国的国宝？','因为全世界只有中国有野生大熊猫。'],
    ['关于熊猫出国的问题，王一雪怎么说？','她说得慢慢给刘小明讲。'],
    ['“十万个为什么”在这里是什么意思？','说明刘小明很好奇、问题很多。']
  ]],
  ['课文3—4：观察和参观',[
    ['王一雪为什么觉得熊猫还没吃饱？','因为它站起来张着嘴找吃的。'],
    ['身边的熊猫为什么可能在睡觉？','因为它半天没动，而且看不见脸。'],
    ['一般来说，大熊猫有什么习惯？','每天睡很多次，也花很多时间吃东西。'],
    ['北京动物园几点开门、几点关门？','早上七点半开门，晚上七点关门。'],
    ['冬天和夏天参观有什么不同？','冬天游客少，也早关门一个小时。']
  ]]
];
questionGroups.v7_word_match = matchSpecs.map((g, i) => tag({
  id:'l16_v7_' + pad(i + 1),type:'question_answer_match',
  prompt_cn:'把每个完整问题和合适的完整回答配对。',
  prompt_en:'Match each complete question with its complete answer.',
  data:{title:g[0],interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,
    pairs:g[1].map((p, j) => ({id:'l16_v7_'+pad(i+1)+'_'+pad(j+1),left:p[0],right:p[1]}))}
}));

const orderSpecs = [
  ['小猫','一会儿','在脚边睡觉','，','一会儿','在椅子上爬','。'],
  ['关于','大熊猫的食物','，','我想','问一个问题','。'],
  ['一般来说','，','大熊猫','每天','睡很多次觉','。'],
  ['冬天','比','夏天','早关门','一个小时','。'],
  ['周末','我','和家人','去动物园','看动物','。']
];
questionGroups.g1_ordering = orderSpecs.map((chunks, i) => tag({
  id:'l16_order_'+pad(i+1),type:'sentence_order',
  correct_answer:chunks.join(''),
  data:{chunks,answer:chunks.join('')}
}));

const sceneChoices = [
  ['哪一句适合说小猫以前和现在的变化？',['它以前又脏又小，现在又干净又漂亮。','小猫以前关于漂亮。','现在小猫半天国宝。'],0],
  ['家里平时很忙，哪一句决定最合适？',['我们现在就领养三只。','我们先不养，周末去动物园看动物。','我们让小猫自己照顾自己。'],1],
  ['哪一句正确描述小猫的两个动作？',['小猫一会儿可爱。','一会儿小猫周末。','小猫一会儿追球，一会儿在脚边睡觉。'],2],
  ['哪一句能清楚说出熊猫为什么是国宝？',['全世界只有中国有野生大熊猫。','熊猫很奇怪，所以是国宝。','熊猫在动物园，所以是国宝。'],0],
  ['怎样用“关于”开始回答？',['大熊猫关于竹子。','关于大熊猫的食物，我知道它们喜欢竹子。','我大熊猫关于。'],1],
  ['哪一句先说看见的，再说推测？',['熊猫一定很饿。','我猜熊猫不高兴。','我看见它张着嘴，它好像还没吃饱。'],2],
  ['哪一句适合介绍熊猫的一般习惯？',['一般来说，大熊猫每天睡很多次觉。','这只熊猫现在正在睡觉。','我昨天看见一只熊猫。'],0],
  ['冬天去动物园，哪条建议最实用？',['晚上七点以后再去。','冬天早关门一个小时，应该早点儿去。','在熊猫馆给熊猫喂食。'],1],
  ['想领养动物时，怎样回答得更完整？',['小猫。','因为可爱。','我想领养小狗，因为我有时间每天照顾它。'],2],
  ['第一次来北京，哪条建议符合课文？',['可以和家人一起去北京动物园。','只在晚上七点以后去。','冬天一定比夏天晚关门。'],0]
];
questionGroups.scene_sentence_choice = sceneChoices.map((r, i) => choice('l16_scene_'+pad(i+1),r[0],r[1],r[2]));

const guessSpecs = [
  ['不干净',['脏','可爱','饱'],0],
  ['关心并帮助人或动物生活',['认得','照顾','关于'],1],
  ['见过以后能够认出来',['周末','好像','认得'],2],
  ['身体黑白相间、常吃竹子的动物',['大熊猫','动物园','国宝'],0],
  ['在自然环境中生活，不是人养的',['全','野生','奇怪'],1],
  ['引出要说、要问的话题',['其实','半天','关于'],2],
  ['吃够了、不饿',['饱','嘴','脸'],0],
  ['离一个人或动物很近的地方',['脚','身边','半天'],1],
  ['比较长的一段时间',['周末','全','半天'],2],
  ['非常喜欢',['喜爱','可爱','奇怪'],0]
];
questionGroups.v6_description_guess = guessSpecs.map((r, i) => tag({
  id:'l16_guess_'+pad(i+1),type:'description_guess',
  prompt_cn:r[0],correct_answer:r[1][r[2]],
  data:{description:r[0],options:r[1],correct_index:r[2],answer:r[1][r[2]]}
}));

const saySpecs = [
  ['又脏又小','yòu zāng yòu xiǎo','photo-text-1-adoption-shop',['刚来','不干净','个子小'],'描述小猫刚来时的两个样子。'],
  ['可爱小猫','kě’ài xiǎomāo','photo-text-1-pet-care-decision',['孩子喜欢','动作','小动物'],'描述一种让孩子喜欢的小动物。'],
  ['小猫脚边','xiǎomāo jiǎobiān','photo-text-1-pet-care-decision',['身体位置','走路','旁边'],'说明小猫在人的什么位置。'],
  ['照顾小猫','zhàogù xiǎomāo','photo-text-1-adoption-shop',['每天','食物','帮助'],'说说服务员每天为小猫做什么。'],
  ['爱吃竹子','ài chī zhúzi','photo-text-2-panda-questions',['植物','绿色','熊猫'],'描述大熊猫常吃的东西。'],
  ['中国国宝','Zhōngguó guóbǎo','photo-text-2-wild-panda-home',['珍贵','代表','大熊猫'],'说明大熊猫为什么特别。'],
  ['张着嘴','zhāngzhe zuǐ','photo-text-3-panda-observation',['脸上','吃东西','动作'],'描述熊猫找吃的样子。'],
  ['看不清脸','kàn bu qīng liǎn','photo-text-3-panda-observation',['头前面','看不见','表情'],'说明为什么不能确定熊猫是不是睡觉。']
];
questionGroups.v2_say_guess = saySpecs.map((r, i) => open('l16_say_'+pad(i+1),'说一说、猜一猜：不要直接说出“'+r[0]+'”。',{
  target:r[0],pinyin:r[1],image:image(r[2]),
  scaffold:{words:r[3],frames:['它看起来……。','它正在／在……。']},task:r[4]
}));

const blindSpecs = [
  [['动物','照顾'],'我想领养一只小狗，因为我每天可以照顾它。','如果你想领养一只动物，你想领养什么？为什么？'],
  [['大熊猫','关于'],'关于大熊猫，我觉得它很可爱，也很特别。','介绍一下你眼中的大熊猫。'],
  [['一般来说','竹子'],'一般来说，大熊猫每天花很多时间吃竹子。','介绍一下熊猫的习惯。'],
  [['动物园','比'],'冬天动物园比夏天早关门，所以我们应该早点儿去。','给第一次来北京旅游的家人朋友一些建议。']
];
questionGroups.v3_blind_box = blindSpecs.map((r, i) => open('l16_blind_'+pad(i+1),'盲盒造句：用两个表达完成终点任务的一句话。',{
  words:r[0],instructions:'两个表达都必须出现，句子要完整自然。',sample:r[1],endpoint:r[2],
  revealDecoration:'none',uniformWordSize:true
}));

const pictureSpecs = [
  ['photo-text-1-adoption-shop',['小猫','看孩子','回到脚边'],'主语 + 一会儿 + 动作1，一会儿 + 动作2','用两个动作介绍小猫。','小猫一会儿看着孩子，一会儿回到服务员脚边。'],
  ['photo-text-1-pet-care-decision',['小猫','脚边休息','爬上椅子'],'主语 + 一会儿 + 动作1，一会儿 + 动作2','说说小猫在家人身边的活动。','小猫一会儿在脚边休息，一会儿爬到椅子上。'],
  ['photo-text-2-panda-questions',['关于','大熊猫','想知道'],'关于 + 话题，……','围绕大熊猫提出一个问题。','关于大熊猫，你最想知道什么？'],
  ['photo-text-2-wild-panda-home',['关于','野生大熊猫','中国'],'关于 + 话题，……','介绍图片中的自然环境。','关于野生大熊猫，我知道中国是它们的家。'],
  ['photo-text-3-panda-observation',['一般来说','大熊猫','睡觉'],'一般来说，主语 + 常见习惯','从一次观察说到一般习惯。','一般来说，大熊猫每天要睡很多次觉。'],
  ['photo-text-3-panda-daily-routine',['一般来说','大熊猫','吃竹子'],'一般来说，主语 + 常见习惯','介绍大熊猫的一种习惯。','一般来说，大熊猫很多时间都在吃竹子。'],
  ['photo-text-4-zoo-family-visit',['周末','平时','游客多'],'A 比 B + 多 + 动词 + 数量短语','比较周末和平时的游客。','周末动物园比平时多来了很多游客。'],
  ['photo-text-4-winter-summer-zoo',['冬天','夏天','早关门','一个小时'],'A 比 B + 早/晚 + 动词 + 数量短语','比较冬天和夏天的关门时间。','冬天比夏天早关门一个小时。']
];
questionGroups.g2_picture_complete = pictureSpecs.map((r, i) => open('l16_picture_'+pad(i+1),'看图完成目标句式：'+r[1].join('、')+'。',{
  image:image(r[0]),keywords:r[1],structure:r[2],task:r[3],sample:r[4],grammarId:'g16_0'+(Math.floor(i/2)+1)
}));

const readingSpecs = [
  ['领养以前先想一想','小林很喜欢一只小狗，想马上带回家。妈妈请全家先看一周的时间表。爸爸早上上班，妈妈晚上上课，小林放学后也有活动。最后他们决定先去领养店做周末志愿者，等有时间每天照顾小狗时再领养。',[
    ['小林最初想做什么？',['马上领养小狗','去熊猫馆拍照','买很多竹子'],0],
    ['家人为什么看时间表？',['想比较冬夏','想知道谁有时间照顾小狗','想认识服务员'],1],
    ['他们最后先做什么？',['晚上去动物园','让小狗自己生活','周末去做志愿者'],2]
  ]],
  ['熊猫小问答','大熊猫主要吃竹子，其实也可以吃肉，只是对肉不感兴趣。全世界只有中国有野生大熊猫，所以中国是大熊猫的家。很多人喜爱大熊猫，也把它看作中国的国宝。关于大熊猫，我们还可以提出很多清楚的问题。',[
    ['大熊猫主要吃什么？',['竹子','小猫的食物','饺子'],0],
    ['为什么说中国是大熊猫的家？',['中国动物园最多','只有中国有野生大熊猫','中国人都养熊猫'],1],
    ['这段话主要帮助我们做什么？',['比较开门时间','决定领养小猫','介绍大熊猫的食物和特别之处'],2]
  ]],
  ['熊猫馆观察记录','第一只熊猫正在爬木架，后来又跳下来。第二只熊猫趴在旁边，半天没有动。我看不见它的脸，所以不能确定它是不是睡觉。我只说“它可能在睡觉”，没有把推测当成看到的事实。',[
    ['第一只熊猫在做什么？',['爬上爬下','一直睡觉','给游客拍照'],0],
    ['为什么不能确定第二只熊猫在睡觉？',['它没有吃竹子','看不见它的脸','动物园要关门'],1],
    ['哪一句是推测？',['第二只熊猫趴在旁边。','它半天没有动。','它可能在睡觉。'],2]
  ]],
  ['周末动物志愿者','安娜周末去领养店做志愿者。她先给小猫准备干净的水，再和服务员一起打扫房间。下午她陪小猫活动，还记下它们吃东西和休息的时间。安娜发现，喜欢动物不只要说“可爱”，还要认真照顾它们。',[
    ['安娜先做什么？',['给小猫准备水','带小猫去北京','给熊猫照相'],0],
    ['下午她记录什么？',['动物园票价','小猫吃东西和休息的时间','冬天关门时间'],1],
    ['安娜学到了什么？',['动物都吃竹子','周末不能休息','喜欢动物也要认真照顾'],2]
  ]],
  ['冬天还是夏天去','爷爷第一次来北京，全家想去北京动物园。夏天游客多，天气也比较热；冬天游客少，但是动物园早关门一个小时。爷爷不喜欢人太多，也能早起。大家决定冬天早上去，并在出发前再看当天的开放信息。',[
    ['谁第一次来北京？',['爷爷','服务员','刘小明'],0],
    ['冬天去有什么要注意的？',['游客一定更多','动物园早关门一个小时','只能晚上去'],1],
    ['这个家庭最后选择什么计划？',['夏天晚上去','不去动物园','冬天早上去'],2]
  ]]
];
questionGroups.r2_passage_choice = readingSpecs.map((r, i) => tag({
  id:'l16_read_'+pad(i+1),type:'passage_reading',
  data:{title:r[0],passage:r[1],questions:r[2].map((q, j) => ({
    id:'l16_read_'+pad(i+1)+'_q'+pad(j+1),question_cn:q[0],options:q[1],
    correct_index:q[2],answer:q[1][q[2]]
  }))}
}));

const independentSpecs = [
  ['领养以前先想一想','周一家里没有人能在晚上照顾小狗。周二和周四，孩子放学后要上课。周末全家有时间，但一周中其他时间都很忙。服务员请他们先安排好每天的照顾人，再决定要不要领养。','这个家庭现在为什么不适合领养？',['大多数时间没人能每天照顾','他们不喜爱动物','小狗只吃竹子'],0],
  ['熊猫小问答','大熊猫常吃竹子，其实也能吃肉。它们主要生活在中国的自然环境中。因为全世界只有中国有野生大熊猫，人们把它看作中国的国宝。关于大熊猫，还有很多问题可以继续了解。','文章主要想说明什么？',['动物园每天几点开门','大熊猫吃什么、生活在哪里以及为什么特别','怎样领养一只小猫'],1],
  ['熊猫馆观察记录','小雪看见一只熊猫张着嘴找吃的。她说：“它好像还没吃饱。”另一只熊猫半天没动，但大家看不见它的脸。王一雪说它可能在睡觉。','哪一句是推测？',['熊猫张着嘴。','另一只熊猫半天没动。','它好像还没吃饱。'],2],
  ['周末动物志愿者','志愿者到领养店以后，先换上干净的工作服。接着，他们给小猫准备水和食物。然后，他们打扫房间并记录每只小猫的情况。最后才陪小猫活动。','志愿者先做什么？',['换上干净的工作服','陪小猫活动','记录冬天游客数量'],0],
  ['冬天还是夏天去','爷爷怕热，也不喜欢游客太多。冬天动物园游客比夏天少，但是早关门一个小时。全家住得离动物园不远，早上出发很方便。他们也会先确认当天的开放时间。','这个家庭应该选择哪个计划？',['夏天中午去','冬天早点儿去','晚上关门后去'],1]
];
questionGroups.r3_independent_reading = independentSpecs.map((r, i) => choice(
  'l16_ind_read_'+pad(i+1),r[2],r[3],r[4],{title:r[0],passage:r[1]}
));

const paragraphSpecs = [
  ['我的动物选择','如果可以领养，我想选一只____1____的小狗。我每天会认真____2____它。周末我可以陪它活动，____3____带它散步，一会儿给它准备水。',['可爱','国宝','照顾','关于','一会儿','半天'],[0,2,4]],
  ['我眼中的大熊猫','____1____大熊猫，我觉得它很可爱。它主要吃____2____。____3____，它也可以吃肉，只是对肉不感兴趣。',['关于','身边','竹子','周末','其实','张'],[0,2,4]],
  ['熊猫的习惯','____1____，大熊猫每天要睡很多次觉。除了睡觉以外，它们很多时间都在吃东西。一只熊猫____2____着嘴找吃的，另一只在它____3____休息。',['一般来说','全世界','张','认得','身边','动物园'],[0,2,4]],
  ['北京动物园建议','如果第一次来北京，可以和家人去北京动物园。冬天____1____夏天游客少，但是也____2____平时早关门一个小时，所以应该____3____去。',['比','关于','比','认得','早点儿','半天'],[0,2,4]],
  ['综合表达','我很____1____动物，也想了解大熊猫。____2____，熊猫很多时间在吃竹子和睡觉。第一次带家人去动物园，我会先看开放时间，冬天还要____3____到。',['喜爱','奇怪','一般来说','一会儿','早点儿','脚边'],[0,2,4]]
];
questionGroups.r4_paragraph_fill = paragraphSpecs.map((r, i) => tag({
  id:'l16_para_'+pad(i+1),type:'paragraph_fill',prompt_cn:r[0],
  prompt_en:'Choose three expressions to complete the paragraph.',
  data:{title:r[0],passageParts:[r[1]],options:r[2],answers:r[3],optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange']}
}));

const chainSpecs = [
  ['我想领养的动物','如果可以领养，我想选一只小狗。',['可爱','照顾','周末','一会儿','因为']],
  ['我眼中的大熊猫','关于大熊猫，我知道一件事。',['竹子','其实','野生','国宝','奇怪']],
  ['熊猫馆观察','我看见两只大熊猫。',['张着嘴','身边','半天','好像','一般来说']],
  ['第一次来北京','我的家人第一次来北京。',['动物园','大人','喜爱','比','早点儿']],
  ['动物、熊猫和建议','我先介绍一种喜欢的动物。',['照顾','关于','一般来说','冬天','建议']]
];
questionGroups.t3_chain_sentence = chainSpecs.map((r, i) => open('l16_chain_'+pad(i+1),'五词故事接龙：'+r[0]+'。',{
  title:r[0],starter:r[1],keywords:r[2],
  steps:r[2].map((w, j) => '第'+(j+1)+'句使用“'+w+'”。'),
  chainModes:['teacher','race','team']
}));

const taskSpecs = [
  ['我想领养的动物','动物选择者',['动物','可爱','照顾','因为'],['说出一种动物','说出一个理由','说明一种照顾方法'],'如果你想领养一只动物，你想领养什么？为什么？','一种动物＋一个理由'],
  ['我眼中的大熊猫','熊猫介绍员',['大熊猫','竹子','国宝','关于'],['说说你觉得熊猫怎么样','说一个熊猫事实','用2—3句话连起来'],'介绍一下你眼中的大熊猫。','2—3句话'],
  ['熊猫的习惯','动物观察员',['一般来说','睡觉','竹子','半天'],['说出一个吃的习惯','说出一个睡觉或活动习惯','区分看见和推测'],'介绍一下熊猫的习惯。','两个熊猫习惯'],
  ['北京参观建议','家庭旅行小助手',['动物园','冬天','比','早点儿'],['考虑家人需要','看开放时间','给出两条实用建议'],'给第一次来北京旅游的家人朋友一些建议。','两条实用建议'],
  ['熊猫与北京小导游','动物主题小导游',['喜欢的动物','熊猫习惯','关于','一般来说','比较句'],['介绍喜欢的动物和理由','介绍一个熊猫习惯','给一个北京参观建议'],'用1—2分钟介绍你喜欢的动物、大熊猫的一个习惯，并给家人朋友一个北京参观建议。','1—2分钟综合表达']
];
questionGroups.t2_task_card = taskSpecs.map((r, i) => open('l16_task_'+pad(i+1),'任务卡：'+r[0]+'。',{
  title:r[0],role:r[1],keywords:r[2],steps:r[3],output:r[4],minimum:r[5]
}));

questionGroups.pk_question = [
  choice('l16_pk_01','哪一句完整使用“一会儿……一会儿……”？',['小猫一会儿追球，一会儿在脚边休息。','小猫一会儿可爱。','一会儿小猫周末。','小猫脚边一会儿。'],0),
  choice('l16_pk_02','哪一句正确使用“关于”？',['大熊猫关于竹子。','关于大熊猫，我还想问一个问题。','我关于很喜爱。','竹子关于吃。'],1),
  choice('l16_pk_03','哪一句同时有一般习惯和冬夏比较？',['这只熊猫现在睡觉。','冬天游客少。','一般来说熊猫常睡觉；冬天动物园比夏天早关门。','关于熊猫我知道。'],2)
];

questionGroups.info_match = [
  tag({id:'l16_info_01',type:'info_match',prompt_cn:'把动物信息和合适的说明配对。',prompt_en:'Match each fact with its explanation.',data:{pairs:[['小猫认得服务员','服务员一直照顾它'],['大熊猫是中国的国宝','只有中国有野生大熊猫'],['熊猫可能在睡觉','它半天没动而且看不见脸']]}},'lesson'),
  tag({id:'l16_info_02',type:'info_match',prompt_cn:'把结构和功能配对。',prompt_en:'Match each structure with its function.',data:{pairs:[['一会儿……一会儿……','描述交替动作'],['关于……','引出话题'],['一般来说……','说明常见情况'],['比……早/晚……','比较时间差异']]}},'review')
];
questionGroups.textQa = texts.map((t, i) => open('l16_text_qa_'+pad(i+1),'课文'+(i+1)+'：用两三句话回答核心问题。',{
  textId:t.id,
  question:['这家人为什么没有马上领养小猫？','你眼中的大熊猫是什么样的？','大熊猫有哪些习惯？','第一次来北京的家人怎样参观动物园更合适？'][i]
}));
questionGroups.pictureTalk = sceneSpecs.map((s, i) => open('l16_picture_talk_'+pad(i+1),'看图完成30秒表达：'+s[2]+'。',{
  image:image(s[3]),keywords:s[6],task:s[4],observationHint:s[5]
}));

questionGroups.battleGames = {
  roulette:[
    ['小猫变了','领养店介绍一只被照顾了一年多的小猫','说说它以前和现在有什么不同。',['脏','可爱','照顾'],'它以前又脏又小，现在变得又干净又可爱，因为服务员把它照顾得很好。'],
    ['两个动作','小猫在孩子身边活动','用“一会儿……，一会儿……”描述它。',['一会儿','脚','身边'],'它一会儿在孩子脚边睡觉，一会儿爬到椅子上。'],
    ['能不能领养','一家人都喜欢小猫，但平时很忙','给出决定和理由。',['周末','照顾','动物'],'我们很喜爱它，可是平时没时间照顾，所以现在不适合领养。'],
    ['为什么是国宝','孩子问大熊猫为什么特别','用教材事实回答。',['全','野生','国宝'],'全世界只有中国有野生大熊猫，所以大熊猫是中国的国宝。'],
    ['关于动物','你在动物知识台回答问题','用“关于”开始一个回答。',['关于','其实','竹子'],'关于大熊猫的食物，其实它们可以吃肉，但是对肉不感兴趣。'],
    ['看见还是推测','熊猫馆里一只熊猫张着嘴','先说看到的，再说推测。',['张','嘴','好像'],'我看见它张着嘴找吃的；它好像还没吃饱。'],
    ['一般习惯','向同学介绍一种动物','用“一般来说”说一个习惯。',['一般来说','动物','半天'],'一般来说，大熊猫每天会睡很多次觉。'],
    ['冬夏参观','一家人选择冬天或夏天去动物园','用比较句给建议。',['比','少','早','一个小时'],'冬天比夏天游客少，但是也早关门一个小时，所以要早点儿去。']
  ].map((r, i) => ({id:'l16_game_roulette_'+pad(i+1),challenge:r[0],scene:r[1],prompt:r[2],keywords:r[3],sample:r[4]})),
  relay:[
    {id:'l16_game_relay_01',starter:'周末我去动物园……',keywords:['动物','可爱','照顾']},
    {id:'l16_game_relay_02',starter:'关于大熊猫，我知道……',keywords:['竹子','野生','国宝']},
    {id:'l16_game_relay_03',starter:'一般来说，动物……',keywords:['睡觉','吃东西','半天']},
    {id:'l16_game_relay_04',starter:'冬天比夏天……',keywords:['游客','少','早关门']},
    {id:'l16_game_relay_05',starter:'这只小猫一会儿……',keywords:['脚边','身边','休息']}
  ],
  monopoly:{
    theme:'light',boardShape:'winding',
    tasks:[
      '解释“照顾”并造句','说出小猫以前和现在的不同','用“一会儿……一会儿……”说两个动作','说出领养前要考虑的一件事',
      '介绍大熊猫常吃什么','解释大熊猫为什么是国宝','用“关于”问一个动物问题','说明“十万个为什么”的意思',
      '说出一个看见的熊猫动作','用“好像”说一个推测','用“一般来说”介绍熊猫习惯','说出两个熊猫习惯',
      '说出动物园的开放时间','比较冬天和夏天游客数量','给第一次来北京的家人一条建议','完成30秒综合介绍'
    ].map((prompt, i) => ({id:'l16_game_monopoly_'+pad(i+1),type:['vocabulary','grammar','text','task'][i%4],prompt}))
  },
  studentRosterSource:'source/shared/students.js',
  sourceType
};

const sessionTests = [
  {
    id:'l16_test_a',session:'A',title:'Test A：领养与照顾',audio:['../../audio/HSK3/16-1.mp3'],
    focus:['课文1','T1词汇','g16_01'],
    sections:[
      {type:'listening',prompt:'听16-1.mp3，选择妈妈最后的决定。',answer:'周末带孩子去北京动物园。'},
      {type:'vocabulary',questionIds:['l16_v5_a_01','l16_guess_01']},
      {type:'grammar',questionIds:['l16_order_01','l16_pk_01']},
      {type:'speaking',prompt:'说出想领养的动物和一个理由。',minimum:'一种动物＋一个理由'}
    ],
    questionIds:['l16_order_01','l16_scene_01','l16_pk_01','l16_task_01'],audioRequired:true,sourceType
  },
  {
    id:'l16_test_b',session:'B',title:'Test B：我眼中的大熊猫',audio:['../../audio/HSK3/16-3.mp3'],
    focus:['课文2','T2词汇','g16_02'],
    sections:[
      {type:'listening',prompt:'听16-3.mp3，选择大熊猫为什么是国宝。',answer:'全世界只有中国有野生大熊猫。'},
      {type:'vocabulary',questionIds:['l16_v5_b_01','l16_guess_04']},
      {type:'grammar',questionIds:['l16_order_02','l16_pk_02']},
      {type:'speaking',prompt:'用2—3句话介绍大熊猫。',minimum:'2—3句话'}
    ],
    questionIds:['l16_order_02','l16_scene_04','l16_pk_02','l16_task_02'],audioRequired:true,sourceType
  },
  {
    id:'l16_test_c',session:'C',title:'Test C：熊猫习惯与北京建议',audio:['../../audio/HSK3/16-5.mp3','../../audio/HSK3/16-7.mp3'],
    focus:['课文3—4','T3/T4词汇','g16_03','g16_04'],
    sections:[
      {type:'listening',prompt:'听16-5和16-7.mp3，找出一个熊猫习惯和一个冬天参观信息。',answer:'熊猫常睡觉或吃东西；冬天游客少且早关门一个小时。'},
      {type:'vocabulary',questionIds:['l16_v5_c_01','l16_guess_07']},
      {type:'grammar',questionIds:['l16_order_03','l16_order_04','l16_pk_03']},
      {type:'speaking',prompt:'说一个熊猫习惯并给一条北京参观建议。',minimum:'一个习惯＋一条建议'}
    ],
    questionIds:['l16_order_03','l16_order_04','l16_scene_07','l16_scene_08','l16_pk_03','l16_task_03','l16_task_04'],audioRequired:true,sourceType
  }
];

const preClass = {
  mode:'preview_mission',missionId:'pm_hsk3_l16_a',
  vocabularyIds:vocabulary.map((v) => v.id),grammarIds:grammar.map((g) => g.id),
  progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L16-v1'},
  reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt']
};

const scaffoldLevels = [
  {label:'基础层 / Support',instruction:'使用词库和完整句框，完成最低要求。'},
  {label:'标准层 / Core',instruction:'独立完成核心内容，并使用本次目标结构。'},
  {label:'挑战层 / Challenge',instruction:'增加理由、比较或追问，但不改变核心任务。'}
];
const postClassHomework = {
  mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,
  instructions:{required:'A和B的卡片必须带入C。',optional:'使用自画或隐私安全图片。',aiPolicy:'先独立完成，再用工具检查语言。No audio upload is required.'},
  sessionMeta:{
    A:{title:'My Animal Choice Card',carryTo:'B、C'},
    B:{title:'Panda in My Eyes Card',carryTo:'C'},
    C:{title:'Panda Habits and Beijing Tips',presentation:'1—2分钟课堂展示；No audio upload is required.'}
  },
  sessions:{
    A:[{
      id:'post_l16_a_animal_choice_card',type:'project_card',
      prompt_cn:'完成动物选择卡：你想领养什么动物？为什么？你可以怎样照顾它？',
      prompt_en:'Bring one privacy-safe animal image or drawing. Answer what animal you would adopt, why, and how you would care for it. Use at least three T1 words. Speak for 30–45 seconds with a partner; every student speaks. No audio upload is required.',
      wordBank:['可爱','照顾','认得','周末','动物园'],requiredStructures:['一会儿……，一会儿……（Core/Challenge）'],
      materials:['一张自画或隐私安全的动物图片','课程模板卡'],
      requiredQuestions:['你想领养什么动物？','为什么？','你可以怎样照顾它？'],
      minimum:'一种动物＋一个理由',speakingTime:'30—45 seconds',
      groupRules:'两人互相听“动物＋理由”，每人都必须说。',
      carryTo:['B','C'],scaffoldLevels,sourceType
    }],
    B:[{
      id:'post_l16_b_panda_in_my_eyes',type:'project_card',
      prompt_cn:'使用A卡的理由表达，完成“我眼中的大熊猫”卡。',
      prompt_en:'Bring Homework A and the teacher fact card. Say what you think of pandas, what they eat, and why they are special. Use at least four T2 words and 2–3 sentences. Work in pairs; every student speaks. No audio upload is required.',
      wordBank:['大熊猫','竹子','国宝','野生','关于','其实'],requiredStructures:['我喜欢／我想……因为……','关于……（Core/Challenge）'],
      materials:['Homework A卡','教师提供的大熊猫事实卡'],
      requiredQuestions:['你觉得大熊猫怎么样？','它吃什么？','为什么特别？'],
      minimum:'2—3句话',speakingTime:'30—45 seconds',
      groupRules:'两人互相介绍自己眼中的大熊猫，每人都必须说。',
      carryFrom:[{session:'A',taskId:'post_l16_a_animal_choice_card',use:'复用“我喜欢／我想……因为……”理由表达。'}],
      carryTo:['C'],scaffoldLevels,sourceType
    }],
    C:[{
      id:'post_l16_c_panda_beijing_tips',type:'project_card',
      prompt_cn:'使用A/B卡，完成“熊猫习惯与北京参观建议”。',
      prompt_en:'Bring Homework A, Homework B, and one observation or visit image. Briefly name an animal you like, describe two panda habits, and give two practical tips to family or friends visiting Beijing for the first time. Speak for 1–2 minutes; every student contributes. No audio upload is required.',
      wordBank:['喜爱','照顾','大熊猫','竹子','一般来说','动物园','比','早点儿'],
      requiredStructures:['一般来说（Support可选择）','一个比较句（Support可选择）','关于或一会儿……一会儿……（Challenge）'],
      materials:['Homework A卡','Homework B卡','一张观察或参观图片'],
      requiredQuestions:['你喜欢什么动物？','熊猫有哪些两个习惯？','给家人朋友哪两条北京参观建议？'],
      minimum:'两个熊猫习惯＋两条实用建议',speakingTime:'1—2 minutes',
      groupRules:'小组可共用图片，但每名学生必须完成有意义的发言；同伴只帮助检查，不代写。',
      carryFrom:[
        {session:'A',taskId:'post_l16_a_animal_choice_card',use:'喜欢的动物和理由。'},
        {session:'B',taskId:'post_l16_b_panda_in_my_eyes',use:'大熊猫事实和介绍句。'}
      ],
      noAudioUpload:true,scaffoldLevels,sourceType
    }]
  }
};

const miniPlans = [
  {
    id:'mini_l16_t1_pet_adoption',title:'我想领养的动物',
    goal:'从说一个喜欢的动物，到说出想领养的动物和理由。',
    goalEn:'Move from naming an animal to giving one adoption choice and one reason.',
    entry:'看领养店图片，说“你喜欢什么动物？”',
    exit:'如果你想领养一只动物，你想领养什么？为什么？',
    exitRequirements:['说出一种动物','说出一个理由'],
    supportCards:['我想领养……。','因为它……。','我可以……照顾它。'],
    responseMode:'spoken_in_class',textId:texts[0].id,
    linkedResources:{vocabularyIds:vocabulary.slice(0,10).map((v)=>v.id),grammarIds:['g16_01'],textIds:[texts[0].id],practiceIds:['l16_task_01']},
    resourceLinks:{vocabulary:'T1',grammar:'g16_01',text:'t_hsk3_l16_01',practice:'l16_task_01'}
  },
  {
    id:'mini_l16_t2_panda_questions',title:'我眼中的大熊猫',
    goal:'从提出三个关于大熊猫的问题，到用2—3句话介绍自己眼中的大熊猫。',
    goalEn:'Move from asking three panda questions to a two- or three-sentence panda introduction.',
    entry:'关于大熊猫，你想知道什么？（问3个问题）',
    exit:'介绍一下你眼中的大熊猫。',
    exitRequirements:['用2—3句话','说一个看法','说一个熊猫事实'],
    supportCards:['关于大熊猫，我觉得……。','它喜欢……。','它很特别，因为……。'],
    responseMode:'spoken_in_class',textId:texts[1].id,
    linkedResources:{vocabularyIds:vocabulary.slice(10,18).map((v)=>v.id),grammarIds:['g16_02'],textIds:[texts[1].id],practiceIds:['l16_task_02']},
    resourceLinks:{vocabulary:'T2',grammar:'g16_02',text:'t_hsk3_l16_02',practice:'l16_task_02'}
  },
  {
    id:'mini_l16_t3_panda_observation',title:'熊猫的习惯',
    goal:'从说一个看到的动作，到介绍两个熊猫习惯。',
    goalEn:'Move from one visible action to two panda habits.',
    entry:'看两只熊猫，说一个动作。',
    exit:'介绍一下熊猫的习惯。',
    exitRequirements:['说出两个熊猫习惯'],
    supportCards:['一般来说，大熊猫……。','除了……以外，它们还……。'],
    responseMode:'spoken_in_class',textId:texts[2].id,
    linkedResources:{vocabularyIds:vocabulary.slice(18,24).map((v)=>v.id),grammarIds:['g16_03'],textIds:[texts[2].id],practiceIds:['l16_task_03']},
    resourceLinks:{vocabulary:'T3',grammar:'g16_03',text:'t_hsk3_l16_03',practice:'l16_task_03'}
  },
  {
    id:'mini_l16_t4_zoo_advice',title:'第一次来北京的参观建议',
    goal:'从说想什么时候去，到给家人朋友两条实用建议。',
    goalEn:'Move from naming a visit time to giving two practical family travel tips.',
    entry:'看动物园图片，说“你想什么时候去？”',
    exit:'给第一次来北京旅游的家人朋友一些建议。',
    exitRequirements:['给出两条适合家人朋友的建议'],
    supportCards:['如果第一次来北京，我建议……。','冬天比夏天……，所以……。','先看……时间。'],
    responseMode:'spoken_in_class',textId:texts[3].id,
    linkedResources:{vocabularyIds:['v16_25','v16_26','v16_09','v16_11','v16_16','v16_08'],grammarIds:['g16_04'],textIds:[texts[3].id],practiceIds:['l16_task_04']},
    resourceLinks:{vocabulary:'T4＋复现词',grammar:'g16_04',text:'t_hsk3_l16_04',practice:'l16_task_04'}
  }
].map((plan) => ({...plan,sourceType}));

const lesson = {
  schemaVersion:'1.0.0',
  meta:{
    level:'HSK3',lessonId:'L16',lessonKey:'HSK3-L16',
    title:'我听说有的熊猫出国了',
    titleEn:'I heard that some pandas have gone abroad',
    topic:'动物特征、熊猫习惯、领养责任与北京动物园参观建议',
    courseModel:'A动物选择→B熊猫介绍→C熊猫习惯与北京建议',
    sourceTextPolicy:'教材事实来自L16.txt；所有新增内容标记teaching_extension。',
    sourceAuthority:[sourceRef],
    missingResources:{audio:[],textbookImages:true,textbookExercises:true},
    audioResources:['audio/HSK3/16-1.mp3','audio/HSK3/16-3.mp3','audio/HSK3/16-5.mp3','audio/HSK3/16-7.mp3'],
    imageResources:sceneSpecs.map((s) => 'source/in-class/' + image(s[3])),
    editorialAudit:['课文4教材没有英文；课程中的课文4英文只作为teaching_extension。']
  },
  pedagogy:{
    exerciseMix:{lessonTargetPercent:50,transferTargetPercent:30,reviewTargetPercent:20},
    speakingParticipation:'每位学生有效发言；C课堂展示，不上传音频。',
    miniEvidence:['entry_expression','actual_learning_path','exit_expression'],
    timerPolicy:{miniMinutes:[3,4,5],vocabularyMinutes:[2,3,4,5],timeoutAction:'prompt_only'}
  },
  features:{pinyin:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true,audio:true},
  sessions,
  usePreparation:{
    status:'active_shared_profile',configurationCreated:true,profile:'pilot-v1',
    formalResourcePlan:miniPlans,
    stateContract:{
      preserveOnReturn:['room','currentMini','timer','evidence','openedPath','interactionState'],
      evidenceTypes:['entry_expression','actual_learning_path','exit_expression']
    },
    sourceType
  },
  vocabScenes,
  vocabulary,
  vocabularyCatalog:vocabulary.map((v) => v.id),
  vocabularyGroups:[
    {id:'T1',textId:texts[0].id,vocabularyIds:vocabulary.slice(0,10).map((v)=>v.id),recognitionWordIds:['v16_01','v16_04','v16_09','v16_10'],activities:['recognition','form_choice','input','collocation'],sourceType},
    {id:'T2',textId:texts[1].id,vocabularyIds:vocabulary.slice(10,18).map((v)=>v.id),recognitionWordIds:['v16_11','v16_14','v16_15','v16_18'],activities:['recognition','form_choice','input','collocation'],sourceType},
    {id:'T3',textId:texts[2].id,vocabularyIds:vocabulary.slice(18,24).map((v)=>v.id),recognitionWordIds:['v16_19','v16_21','v16_22','v16_24'],activities:['recognition','form_choice','input','collocation'],sourceType},
    {id:'T4',textId:texts[3].id,vocabularyIds:['v16_25','v16_26'],reviewVocabularyIds:['v16_09','v16_11','v16_16','v16_08'],recognitionWordIds:['v16_25','v16_26'],activities:['recognition','form_choice','input','collocation'],sourceType}
  ],
  grammar,
  texts,
  grammarTeachingNotes,
  textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map((v) => [v.id,{session:v.tags[0],textId:v.textId,tier:v.tier,meaningCn:v.meaningCn,phrases:v.phrases,sourceType,sourceRef}])),
  previewMissions,
  preClass,
  inClass:{questionGroups,sessionTests},
  postClassHomework,
  report:{
    focus:['动物领养与责任','我眼中的大熊猫','熊猫习惯','北京动物园参观建议'],
    dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务']
  }
};

fs.mkdirSync(path.dirname(out), {recursive:true});
fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log('Built ' + path.relative(root, out));
