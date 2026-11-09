const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceRef = 'textbook data/HSK3/L18.txt';
const out = path.join(root, 'source/data-model/lessons/HSK3-L18.json');
const extension = 'teaching_extension';
const pad = (n) => String(n).padStart(2, '0');
const image = (name) => 'images/hsk3-l18/' + name + '.png';

const vocabRows = [
  ['怎样','zěnyàng','代词','how',1,'expression','用来问方法或情况',['怎样过节','怎样学习'],'你们怎样过节？','Nǐmen zěnyàng guòjié?','textbook'],
  ['过节','guòjié','动词','celebrate a festival',1,'expression','庆祝一个节日',['一起过节','回家过节'],'你们怎样过节？','Nǐmen zěnyàng guòjié?','textbook'],
  ['节','jié','名词','festival; holiday',1,'understanding','节日的简称',['过节','节前'],'节前，很多人准备回家。','Jié qián, hěn duō rén zhǔnbèi huí jiā.','teaching_extension'],
  ['节日','jiérì','名词','festival; holiday',1,'expression','特别庆祝的日子',['重要的节日','传统节日'],'春节是中国最重要的节日。','Chūnjié shì Zhōngguó zuì zhòngyào de jiérì.','textbook'],
  ['联欢','liánhuān','动词','have a get-together',1,'context','大家一起表演、庆祝',['联欢晚会','一起联欢'],'我们一边包饺子，一边看春节联欢晚会。','Wǒmen yìbiān bāo jiǎozi, yìbiān kàn Chūnjié Liánhuān Wǎnhuì.','textbook'],
  ['大概','dàgài','副词/形容词','about; probably',1,'expression','数量或情况不完全确定',['大概七天','大概知道'],'春节大概放七八天假。','Chūnjié dàgài fàng qī bā tiān jià.','textbook'],
  ['阿姨','āyí','名词','aunt; polite address for a woman',2,'expression','对成年女性的礼貌称呼',['张阿姨','叔叔阿姨'],'张阿姨，过年好！','Zhāng āyí, guònián hǎo!','textbook'],
  ['叔叔','shūshu','名词','uncle; polite address for a man',2,'expression','对成年男性的礼貌称呼',['李叔叔','叔叔阿姨'],'李叔叔，过年好！','Lǐ shūshu, guònián hǎo!','textbook'],
  ['收','shōu','动词','accept; receive',2,'expression','接受别人给的东西',['收礼物','请收下'],'这是我准备的礼物，请收下。','Zhè shì wǒ zhǔnbèi de lǐwù, qǐng shōuxia.','textbook'],
  ['总','zǒng','副词','always',2,'expression','常常；一直',['总听说','总想起'],'总听小文说起你。','Zǒng tīng Xiǎowén shuōqǐ nǐ.','textbook'],
  ['起','qǐ','动词','start mentioning',2,'understanding','放在动词后，开始说到某人或某事',['说起','想起'],'总听小文说起你。','Zǒng tīng Xiǎowén shuōqǐ nǐ.','textbook'],
  ['见面','jiànmiàn','动词','meet',2,'expression','两个人见到彼此',['第一次见面','有机会见面'],'今天终于有机会见面了。','Jīntiān zhōngyú yǒu jīhuì jiànmiàn le.','textbook'],
  ['矿泉水','kuàngquánshuǐ','名词','mineral water',2,'context','瓶装的饮用水',['一瓶矿泉水','喝矿泉水'],'桌子上有饮料，还有矿泉水。','Zhuōzi shang yǒu yǐnliào, hái yǒu kuàngquánshuǐ.','textbook'],
  ['刚刚','gānggāng','副词','just now',2,'expression','不久以前',['刚刚学会','刚刚完成'],'我刚刚看视频学会了包饺子。','Wǒ gānggāng kàn shìpín xuéhuì le bāo jiǎozi.','textbook'],
  ['出发','chūfā','动词','depart; set out',3,'expression','离开一个地方开始行程',['从北京出发','准备出发'],'这是他从北京出发时照的。','Zhè shì tā cóng Běijīng chūfā shí zhào de.','textbook'],
  ['不久','bùjiǔ','形容词','not long; soon',3,'understanding','时间不长',['不久前','不久以后'],'好像是不久前发生的一样。','Hǎoxiàng shì bùjiǔ qián fāshēng de yíyàng.','textbook'],
  ['发生','fāshēng','动词','happen',3,'expression','出现一件事情',['发生事情','刚刚发生'],'好像是不久前发生的一样。','Hǎoxiàng shì bùjiǔ qián fāshēng de yíyàng.','textbook'],
  ['刚','gāng','副词','just',3,'expression','不久以前',['刚离开','刚开始'],'他刚离开家时，我很不习惯。','Tā gāng líkāi jiā shí, wǒ hěn bù xíguàn.','textbook'],
  ['只要','zhǐyào','连词','as long as',3,'expression','表示一个足够的条件',['只要……就……','只要坚持'],'只要几天不跟他视频，就很想他。','Zhǐyào jǐ tiān bù gēn tā shìpín, jiù hěn xiǎng tā.','textbook'],
  ['学期','xuéqī','名词','semester',3,'expression','学校学习的一段时间',['这个学期','最后一个学期'],'还有最后一个学期就要毕业了。','Hái yǒu zuìhòu yí gè xuéqī jiù yào bìyè le.','textbook'],
  ['毕业','bìyè','动词','graduate',3,'expression','完成一个阶段的学习',['大学毕业','快毕业了'],'还有最后一个学期就要毕业了。','Hái yǒu zuìhòu yí gè xuéqī jiù yào bìyè le.','textbook'],
  ['出生','chūshēng','动词','be born',4,'expression','来到这个世界上',['出生时','出生在北京'],'他们给我看了李文出生时的照片。','Tāmen gěi wǒ kànle Lǐ Wén chūshēng shí de zhàopiàn.','textbook'],
  ['过去','guòqù','名词','the past',4,'expression','以前的时间',['过去的故事','回忆过去'],'他们给我讲了很多过去的故事。','Tāmen gěi wǒ jiǎngle hěn duō guòqù de gùshi.','textbook'],
  ['懂得','dǒngde','动词','understand; realize',4,'expression','明白并知道',['懂得道理','懂得坚持'],'在他身上，我懂得了坚持的重要。','Zài tā shēnshang, wǒ dǒngde le jiānchí de zhòngyào.','teaching_extension'],
  ['坚持','jiānchí','动词','persist; keep going',4,'expression','一直做，不停止',['一直坚持','坚持学习'],'只要一直坚持，就能完成自己的目标。','Zhǐyào yìzhí jiānchí, jiù néng wánchéng zìjǐ de mùbiāo.','textbook'],
  ['完成','wánchéng','动词','complete',4,'expression','把一件事做完',['完成任务','完成目标'],'只要一直坚持，就能完成自己的目标。','Zhǐyào yìzhí jiānchí, jiù néng wánchéng zìjǐ de mùbiāo.','textbook'],
  ['目标','mùbiāo','名词','goal',4,'expression','想要做到的事情',['学习目标','完成目标'],'只要一直坚持，就能完成自己的目标。','Zhǐyào yìzhí jiānchí, jiù néng wánchéng zìjǐ de mùbiāo.','textbook'],
  ['发展','fāzhǎn','动词','develop',4,'context','慢慢变化、变得更好',['发展得更好','未来发展'],'我相信，他以后一定会发展得更好。','Wǒ xiāngxìn, tā yǐhòu yídìng huì fāzhǎn de gèng hǎo.','textbook'],
  ['春节','Chūnjié','专有名词','Spring Festival; Chinese New Year',1,'expression','中国农历新年',['过春节','春节假期'],'春节是中国最重要的节日。','Chūnjié shì Zhōngguó zuì zhòngyào de jiérì.','textbook',true]
];

const textSession = {1:'A',2:'B',3:'C',4:'C'};
const vocabulary = vocabRows.map((r, i) => ({
  id:'v18_' + pad(i + 1),hanzi:r[0],pinyin:r[1],pos:r[2],english:r[3],
  tags:[textSession[r[4]]],textId:r[4],tier:r[5],meaningCn:r[6],phrases:r[7],
  phraseSourceType:extension,example:r[8],examplePinyin:r[9],exampleSourceType:r[10],
  meaningCnSourceType:extension,properNoun:Boolean(r[11]),sourceType:i===28?'textbook_proper_noun':'textbook',sourceRef
}));
const byWord = Object.fromEntries(vocabulary.map((v) => [v.hanzi,v]));
const card = (hanzi) => { const v=byWord[hanzi]; return {vocabularyId:v.id,hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,phrases:v.phrases,example:v.example,examplePinyin:v.examplePinyin,tier:v.tier}; };

const grammarRows = [
  {id:'g18_01',title:'概数表达法',titleEn:'Approximate quantities with adjacent numbers',appliesTo:[1],scene:'看假期天数、人数和旧照片时间，发现相邻数字连用表示大约数量。',structure:'相邻数字1 + 相邻数字2 + 量词/名词',explanation:'两个相邻数字连用表示大约的数量，如“三四年、五六个人、七八天”。数字必须相邻。',variants:[['时间','三四年／七八天'],['人数','五六个人'],['时长','二三十分钟']],followImage:'photo-text-1-family-dumplings-gala',followTarget:'根据图片用相邻数字说一个大约数量。',followSample:'桌子上大概有六七个饺子。',followPinyin:'Zhuōzi shang dàgài yǒu liù qī ge jiǎozi.',oral:['你每天学多长时间？','你们班大概有多少人？','你上次旅行去了几天？'],examples:[
    ['春节大概放七八天假。','Chūnjié dàgài fàng qī bā tiān jià.','The Spring Festival holiday lasts about seven or eight days.','textbook'],
    ['教室里来了五六个学生。','Jiàoshì li láile wǔ liù ge xuésheng.','Five or six students came to the classroom.','textbook'],
    ['这些照片是三四年前照的吧？','Zhèxiē zhàopiàn shì sān sì nián qián zhào de ba?','Were these photos taken three or four years ago?','textbook'],
    ['我每天练习二三十分钟。','Wǒ měitiān liànxí èr sānshí fēnzhōng.','I practise for about twenty or thirty minutes every day.','teaching_extension'],
    ['桌子上还有六七个饺子。','Zhuōzi shang hái yǒu liù qī ge jiǎozi.','There are about six or seven dumplings left on the table.','teaching_extension']]},
  {id:'g18_02',title:'“刚才”和“刚刚”',titleEn:'刚才 and 刚刚',appliesTo:[2],scene:'比较“刚才的电话”和“我刚刚学会”，先看词在句中的位置，再判断用法。',structure:'刚才 + 的 + 名词／主语 + 刚才 + 动词；主语 + 刚刚 + 动词',explanation:'“刚才”是时间词，可放句首或修饰名词；“刚刚”是副词，通常放在主语后、动词前。',variants:[['刚才修饰名词','刚才 + 的 + 名词'],['刚才作时间','主语 + 刚才 + 动词'],['刚刚作副词','主语 + 刚刚 + 动词']],followImage:'photo-text-2-learning-dumplings-video',followTarget:'分别用“刚才”和“刚刚”说两句话。',followSample:'我刚才看了一个视频。我刚刚学会包饺子。',followPinyin:'Wǒ gāngcái kànle yí ge shìpín. Wǒ gānggāng xuéhuì bāo jiǎozi.',oral:['你刚才做了什么？','你最近刚刚学会了什么？','刚才谁给你打过电话？'],examples:[
    ['刚才的电话是我妈妈打来的。','Gāngcái de diànhuà shì wǒ māma dǎ lái de.','The call just now was from my mother.','textbook'],
    ['我刚才看了一遍，不想再看了。','Wǒ gāngcái kànle yí biàn, bù xiǎng zài kàn le.','I watched it once just now and do not want to watch it again.','textbook'],
    ['我刚刚看视频学会了包饺子。','Wǒ gānggāng kàn shìpín xuéhuì le bāo jiǎozi.','I just learned how to make dumplings by watching a video.','textbook'],
    ['他刚刚来北京两个月。','Tā gānggāng lái Běijīng liǎng ge yuè.','He has only just been in Beijing for two months.','textbook'],
    ['刚才谁来过？','Gāngcái shéi láiguo?','Who came by just now?','teaching_extension'],
    ['我刚刚完成今天的练习。','Wǒ gānggāng wánchéng jīntiān de liànxí.','I have just finished today’s practice.','teaching_extension']]},
  {id:'g18_03',title:'条件复句“只要……，就……”',titleEn:'Conditional complex sentence 只要……，就……',appliesTo:[3],scene:'看视频联系、朋友决定和健康习惯，找出足够条件与结果。',structure:'只要 + 足够条件，+ 就 + 结果',explanation:'“只要”后的条件足够成立，就会出现“就”后的结果。两个分句主语不同时，第二个主语放在“就”前。',variants:[['同一主语','主语 + 只要 + 条件，+ 就 + 结果'],['不同主语','只要 + 条件，+ 主语 + 就 + 结果']],followImage:'photo-text-3-mother-video-call',followTarget:'用一个简单条件说明会发生的结果。',followSample:'只要每天练习，我就会做得越来越好。',followPinyin:'Zhǐyào měitiān liànxí, wǒ jiù huì zuò de yuèláiyuè hǎo.',oral:['怎样才能学会一个新技能？','什么时候你会给家人打电话？','怎样才能慢慢完成一个目标？'],examples:[
    ['他刚离开家时，我很不习惯，只要几天不跟他视频，就很想他。','Tā gāng líkāi jiā shí, wǒ hěn bù xíguàn, zhǐyào jǐ tiān bù gēn tā shìpín, jiù hěn xiǎng tā.','When he had just left home, I missed him whenever we did not video chat for a few days.','textbook'],
    ['只要你同意，我们就这么决定了。','Zhǐyào nǐ tóngyì, wǒmen jiù zhème juédìng le.','As long as you agree, we will decide it this way.','textbook'],
    ['只要坚持每天早睡，身体就一定会好起来。','Zhǐyào jiānchí měitiān zǎoshuì, shēntǐ jiù yídìng huì hǎo qǐlai.','As long as you keep going to bed early, your health will improve.','textbook'],
    ['只要有时间，我就跟家人视频。','Zhǐyào yǒu shíjiān, wǒ jiù gēn jiārén shìpín.','Whenever I have time, I video chat with my family.','teaching_extension'],
    ['只要每天练习十分钟，你就会慢慢进步。','Zhǐyào měitiān liànxí shí fēnzhōng, nǐ jiù huì mànmàn jìnbù.','As long as you practise ten minutes daily, you will gradually improve.','teaching_extension']]},
  {id:'g18_04',title:'固定格式“从……起”',titleEn:'Starting point pattern 从……起',appliesTo:[4],scene:'看李文从高中到留学的时间线，找出一个变化开始的时间。',structure:'从 + 时间/事情 + 起，+ 主语 + 就/开始 + 变化或行动',explanation:'“从……起”说明变化或行动的开始点；这里的“起”不是“站起来”。',variants:[['时间起点','从 + 时间 + 起'],['事情起点','从 + 事情 + 起']],followImage:'photo-text-4-study-goal-timeline',followTarget:'用“从……起”说出目标开始的时间。',followSample:'从这个学期起，我要坚持每天读十分钟中文。',followPinyin:'Cóng zhège xuéqī qǐ, wǒ yào jiānchí měitiān dú shí fēnzhōng Zhōngwén.',oral:['你从什么时候起学习中文？','你想从什么时候起坚持一个新习惯？','从哪件事起，你有了一个新目标？'],examples:[
    ['他从那时起就努力学习。','Tā cóng nà shí qǐ jiù nǔlì xuéxí.','From that time on, he studied hard.','textbook'],
    ['从那天起，我们就变成了好朋友。','Cóng nà tiān qǐ, wǒmen jiù biànchéng le hǎo péngyou.','From that day on, we became good friends.','textbook'],
    ['从那次旅游起，我对中国文化更有兴趣了。','Cóng nà cì lǚyóu qǐ, wǒ duì Zhōngguó wénhuà gèng yǒu xìngqù le.','From that trip on, I became more interested in Chinese culture.','textbook'],
    ['从这个学期起，我要每天读中文。','Cóng zhège xuéqī qǐ, wǒ yào měitiān dú Zhōngwén.','From this semester on, I will read Chinese every day.','teaching_extension'],
    ['从学会包饺子那天起，我更喜欢自己做饭了。','Cóng xuéhuì bāo jiǎozi nà tiān qǐ, wǒ gèng xǐhuan zìjǐ zuòfàn le.','From the day I learned to make dumplings, I liked cooking for myself more.','teaching_extension']]}
];

const grammar = grammarRows.map((g) => ({
  id:g.id,title:g.title,titleEn:g.titleEn,appliesTo:g.appliesTo,scene:g.scene,sceneSourceType:extension,
  structure:g.structure,structureSourceType:'textbook',explanation:g.explanation,explanationSourceType:extension,
  sourceType:'textbook',sourceRef,examples:g.examples.map((e) => ({hanzi:e[0],pinyin:e[1],english:e[2],sourceType:e[3],hanziSourceType:e[3],pinyinSourceType:e[3],englishSourceType:e[3]}))
}));

const textRows = [
  {id:'t_hsk3_l18_01',textId:1,title:'第一次在中国过春节',format:'dialogue',genre:'对话',setting:'在飞往中国的飞机上，白家月和李文聊天。',audio:'../../audio/HSK3/18-1.mp3',lines:[
    ['白家月','我要在中国过年，真开心。','Wǒ yào zài Zhōngguó guònián, zhēn kāixīn.','I\'m celebrating the New Year in China; I\'m so happy.'],
    ['李文','第一次请外国朋友来家里过春节，我也很高兴。','Dì-yī cì qǐng wàiguó péngyou lái jiā li guò Chūnjié, wǒ yě hěn gāoxìng.','It\'s my first time inviting a foreign friend home for the Spring Festival; I\'m very glad too.'],
    ['白家月','你们怎样过节？','Nǐmen zěnyàng guòjié?','How do you celebrate the festival?'],
    ['李文','春节是中国最重要的节日，我们一般会回家，跟家人一起过。','Chūnjié shì Zhōngguó zuì zhòngyào de jiérì, wǒmen yìbān huì huí jiā, gēn jiārén yìqǐ guò.','Spring Festival is the most important festival in China. We usually go back home and spend it with family.'],
    ['白家月','那你跟家人会一起做什么？','Nà nǐ gēn jiārén huì yìqǐ zuò shénme?','Then what do you and your family do together?'],
    ['李文','我们家会一边包饺子，一边看春节联欢晚会，一直到十二点以后才睡觉。','Wǒmen jiā huì yìbiān bāo jiǎozi, yìbiān kàn Chūnjié Liánhuān Wǎnhuì, yìzhí dào shí\'èr diǎn yǐhòu cái shuìjiào.','Our family will make dumplings while watching the Spring Festival Gala, and we won\'t go to bed until after midnight.'],
    ['白家月','听起来很有意思。春节放几天假？','Tīng qǐlai hěn yǒu yìsi. Chūnjié fàng jǐ tiān jià?','Sounds very interesting. How many days of holiday do you get for Spring Festival?'],
    ['李文','大概七八天。','Dàgài qī bā tiān.','Around seven or eight days.']]},
  {id:'t_hsk3_l18_02',textId:2,title:'我刚刚学会包饺子',format:'dialogue',genre:'对话',setting:'白家月来到李文家，第一次见李文的父母。',audio:'../../audio/HSK3/18-3.mp3',lines:[
    ['白家月','张阿姨，李叔叔。过年好！这是我准备的礼物，请收下。','Zhāng āyí, Lǐ shūshu. Guònián hǎo! Zhè shì wǒ zhǔnbèi de lǐwù, qǐng shōuxia.','Aunt Zhang, Uncle Li. Happy New Year! This is a gift I prepared, please accept it.'],
    ['李叔叔','谢谢家月，你太客气了！','Xièxie Jiāyuè, nǐ tài kèqi le!','Thank you, Jiayue, you\'re too polite!'],
    ['张阿姨','总听小文说起你，今天终于有机会见面了。','Zǒng tīng Xiǎowén shuōqǐ nǐ, jīntiān zhōngyú yǒu jīhuì jiànmiàn le.','Xiaowen always mentions you, and today we finally have the chance to meet.'],
    ['白家月','谢谢您和叔叔请我来家里做客。','Xièxie nín hé shūshu qǐng wǒ lái jiā li zuòkè.','Thank you and Uncle for inviting me to your home as a guest.'],
    ['李叔叔','桌子上有饮料，还有矿泉水，你想喝什么就自己拿。','Zhuōzi shang yǒu yǐnliào, hái yǒu kuàngquánshuǐ, nǐ xiǎng hē shénme jiù zìjǐ ná.','There are drinks and mineral water on the table; help yourself to whatever you\'d like to drink.'],
    ['张阿姨','你先坐着看会儿电视，饺子很快就包好了。','Nǐ xiān zuòzhe kàn huìr diànshì, jiǎozi hěn kuài jiù bāohǎo le.','Sit and watch TV for a while, the dumplings will be ready soon.'],
    ['白家月','我刚刚看视频学会了包饺子，我跟你们一起包吧。','Wǒ gānggāng kàn shìpín xuéhuì le bāo jiǎozi, wǒ gēn nǐmen yìqǐ bāo ba.','I just learned how to make dumplings by watching videos; let me make them together with you.']]},
  {id:'t_hsk3_l18_03',textId:3,title:'一张三四年前的照片',format:'dialogue',genre:'对话',setting:'白家月和张阿姨一起看李文出国前的旧照片。',audio:'../../audio/HSK3/18-5.mp3',lines:[
    ['白家月','这张照片是李文出国前照的吗？','Zhè zhāng zhàopiàn shì Lǐ Wén chūguó qián zhào de ma?','Was this photo taken before Li Wen went abroad?'],
    ['张阿姨','对，这是他从北京出发时，我们全家在机场照的。','Duì, zhè shì tā cóng Běijīng chūfā shí, wǒmen quán jiā zài jīchǎng zhào de.','Yes, our whole family took this at the airport when he departed from Beijing.'],
    ['白家月','那是三四年前吧？','Nà shì sān sì nián qián ba?','Was that three or four years ago?'],
    ['张阿姨','是啊，时间过得真快，好像是不久前发生的一样。','Shì a, shíjiān guò de zhēn kuài, hǎoxiàng shì bùjiǔ qián fāshēng de yíyàng.','Yes, time flies so fast; it feels like it happened not long ago.'],
    ['白家月','您一定特别想李文吧？','Nín yídìng tèbié xiǎng Lǐ Wén ba?','You must have missed Li Wen very much?'],
    ['张阿姨','他刚离开家时，我很不习惯，只要几天不跟他视频，就很想他。','Tā gāng líkāi jiā shí, wǒ hěn bù xíguàn, zhǐyào jǐ tiān bù gēn tā shìpín, jiù hěn xiǎng tā.','When he first left home, I wasn\'t used to it at all; if we didn\'t video chat for just a few days, I would miss him terribly.'],
    ['白家月','还有最后一个学期就要毕业了，他很快就会回来了。','Hái yǒu zuìhòu yí gè xuéqī jiù yào bìyè le, tā hěn kuài jiù huì huílái le.','There\'s only one last semester until graduation, and he\'ll be back very soon.']]},
  {id:'t_hsk3_l18_04',textId:4,title:'从那时起一直坚持',format:'diary',genre:'日记',author:'白家月',setting:'白家月在家写下这次春节做客后的感受。',audio:'../../audio/HSK3/18-7.mp3',lines:[
    ['白家月','这次来中国，我最高兴的是认识了李文的父母。他们给我看了李文出生时的照片，还给我讲了很多过去的故事。李文高中的时候想学医，从那时起就努力学习。高三的时候，因为成绩特别好，他得到了出国留学的机会。在他身上，我懂得了，只要一直坚持，就能完成自己的目标。我相信，他以后一定会发展得更好。','Zhè cì lái Zhōngguó, wǒ zuì gāoxìng de shì rènshi le Lǐ Wén de fùmǔ. Tāmen gěi wǒ kànle Lǐ Wén chūshēng shí de zhàopiàn, hái gěi wǒ jiǎngle hěn duō guòqù de gùshi. Lǐ Wén gāozhōng de shíhou xiǎng xué yī, cóng nà shí qǐ jiù nǔlì xuéxí. Gāosān de shíhou, yīnwèi chéngjì tèbié hǎo, tā dédào le chūguó liúxué de jīhuì. Zài tā shēnshang, wǒ dǒngde le, zhǐyào yìzhí jiānchí, jiù néng wánchéng zìjǐ de mùbiāo. Wǒ xiāngxìn, tā yǐhòu yídìng huì fāzhǎn de gèng hǎo.','This time in China, what made me happiest was getting to know Li Wen\'s parents. They showed me photos of Li Wen when he was born and told me many stories from the past. When Li Wen was in high school, he wanted to study medicine, and from then on he studied hard. In his final year of high school, because his grades were especially good, he got the opportunity to study abroad. From him, I learned that as long as we keep going, we can achieve our goals. I believe he will continue to grow and do even better in the future.']]}
];

const texts = textRows.map((t) => ({...t,session:textSession[t.textId],audioStatus:'available',audioSourceType:'textbook',sourceType:'textbook',sourceRef,lines:t.lines.map((line,i)=>({id:t.id+'_line_'+pad(i+1),speaker:line[0],hanzi:line[1],pinyin:line[2],english:line[3],sourceType:'textbook',hanziSourceType:'textbook',pinyinSourceType:'textbook',englishSourceType:t.textId===4?'teaching_extension':'textbook'}))}));

const sessions = [
  {id:'A',title:'My Festival Celebration',textIds:[1],grammarIds:['g18_01'],communicativeGoal:'介绍喜欢的节日、时间和一个家庭活动。'},
  {id:'B',title:'A Skill I Just Learned',textIds:[2],grammarIds:['g18_02'],communicativeGoal:'介绍一件刚刚学会的事和学习方法。'},
  {id:'C',title:'My Growth Album',textIds:[3,4],grammarIds:['g18_03','g18_04'],communicativeGoal:'讲一张旧照片，并介绍自己的目标和坚持方法。'}
];

const sceneSpecs = [
  [1,'l18_vocab_scene_t1_01','飞机上的春节话题','photo-text-1-plane-festival-talk','白家月为什么在飞机上很开心？','看两个人、旅行用品和春节准备物品。',['春节','怎样','过节'],[['白家月',26,47],['李文',65,47]],['她要在中国过春节，所以很开心。','她想知道李文家怎样过节。']],
  [1,'l18_vocab_scene_t1_02','一家人包饺子看晚会','photo-text-1-family-dumplings-gala','李文家过春节时会一起做什么？','看包饺子、电视晚会、家人和时间。',['节日','联欢','大概'],[['饺子',50,76],['电视',54,28]],['他们一边包饺子，一边看晚会。','春节大概放七八天假。']],
  [2,'l18_vocab_scene_t2_01','第一次见面送礼物','photo-text-2-new-year-greeting-gift','白家月第一次见李文父母时做了什么？','看礼物、拜年动作、阿姨和叔叔。',['阿姨','叔叔','收','见面'],[['阿姨',68,45],['叔叔',84,44],['礼物',42,65]],['她向叔叔阿姨拜年，还请他们收下礼物。','大家第一次见面，都很客气。']],
  [2,'l18_vocab_scene_t2_02','看视频学包饺子','photo-text-2-learning-dumplings-video','白家月为什么想跟大家一起包饺子？','看手机视频、面粉、饺子皮和矿泉水。',['刚刚','矿泉水','总'],[['视频',63,57],['矿泉水',83,55]],['她刚刚看视频学会了包饺子。','桌子上有饮料和矿泉水。']],
  [3,'l18_vocab_scene_t3_01','机场旧照片','photo-text-3-airport-family-photo','这张全家照是在什么时候、什么地方照的？','看机场、行李、全家人和旧照片。',['出发','不久','发生'],[['旧照片',51,62],['机场',54,51]],['这是李文从北京出发时在机场照的。','照片是三四年前照的。']],
  [3,'l18_vocab_scene_t3_02','妈妈和儿子视频','photo-text-3-mother-video-call','李文离开家以后，妈妈怎样跟他联系？','看视频通话、日历和最后一个学期的学习资料。',['只要','学期','毕业','刚'],[['妈妈',25,48],['视频',54,51]],['只要几天不跟他视频，妈妈就很想他。','他还有一个学期就毕业了。']],
  [4,'l18_vocab_scene_t4_01','相册里的成长故事','photo-text-4-life-photo-album','李文父母用什么介绍他的过去？','看出生照片、相册和高中照片。',['出生','过去','懂得'],[['相册',54,73],['父母',72,42]],['他们给白家月看照片，还讲了过去的故事。','李文高中时开始努力学习。']],
  [4,'l18_vocab_scene_t4_02','从学习到目标','photo-text-4-study-goal-timeline','李文怎样一步一步完成自己的目标？','看学习计划、每天坚持、好成绩和留学机会。',['坚持','完成','目标','发展'],[['计划',64,71],['学生',37,45]],['从高中起，他就努力学习。','只要一直坚持，就能完成目标。']]
];

const vocabScenes = Object.fromEntries([1,2,3,4].map((n)=>[String(n),{title:'课文'+n+'词汇场景',steps:sceneSpecs.filter((s)=>s[0]===n).map((s)=>({id:s[1],title:s[2],image:image(s[3]),prompt:s[4],promptPinyin:'',promptEn:'Observe the image and answer the specific scene question in Chinese.',talkHint:s[5],words:s[6].map(card),labels:s[7].map((x)=>({text:x[0],x:x[1],y:x[2]})),sampleAnswers:s[8],sourceType:extension}))}]));

const grammarTeachingNotes = Object.fromEntries(grammarRows.map((g,i)=>[g.id,{presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',scene:g.scene,observePrompt:'先观察例句中反复出现的部分，再说它帮助我们表达什么。',observeHighlights:g.examples.map((e)=>e[0].split(/[，。；？]/).filter(Boolean)),examples:grammar[i].examples,visualLearning:{leadExamples:[grammar[i].examples[0]],blocks:g.structure.split(/[+；]/).map((x)=>x.trim()).filter(Boolean),blockLabelsEn:['starting point or condition','cue','action','result']},oralQuestions:g.oral.map((question)=>({question,pinyin:''})),structureVariants:g.variants.map((v)=>({label:v[0],formula:v[1],formulaEn:v[1],explanation:g.explanation,example:g.examples[0][0],examplePinyin:g.examples[0][1]})),followUp:[{image:image(g.followImage),promptEn:'Use the target structure to describe the image.',target:g.followTarget,sampleAnswer:g.followSample,samplePinyin:g.followPinyin}],sourceType:extension}]));

const overallRows = [
  [['l18_t1_overall_01','白家月为什么很开心？',['她马上要毕业','她要在中国过年','她要去图书馆'],1],['l18_t1_overall_02','李文家过春节时会做什么？',['去机场拍照','去学校联欢','包饺子、看晚会'],2],['l18_t1_overall_03','这段话说的是什么？',['李文家怎样过春节','白家月怎样找工作','李文怎样学医'],0]],
  [['l18_t2_overall_01','白家月为什么去李文家？',['去借一本书','去看旧照片','和李文家人一起过年'],2],['l18_t2_overall_02','大家第一次见面时怎么样？',['都很客气，也很高兴','都不知道说什么','都急着出发'],0],['l18_t2_overall_03','白家月后来想做什么？',['自己看电视','和大家一起包饺子','马上回学校'],1]],
  [['l18_t3_overall_01','他们为什么看这张照片？',['在说李文出国的事','在选春节礼物','在学包饺子'],0],['l18_t3_overall_02','张阿姨觉得时间过得怎么样？',['很慢','很快','没有变化'],1],['l18_t3_overall_03','张阿姨什么时候很想李文？',['李文回家时','每次看电视时','几天没有和他视频时'],2]],
  [['l18_t4_overall_01','白家月最高兴的是什么？',['学会了看照片','认识了李文的父母','马上要回学校'],1],['l18_t4_overall_02','李文为什么有机会出国留学？',['他认识很多朋友','他会包饺子','他的成绩特别好'],2],['l18_t4_overall_03','白家月从李文学到了什么？',['坚持就能完成目标','过节一定要回家','学医一定要出国'],0]]
];

const detailRows = [
  [['白家月和李文在哪里聊天儿？','Bái Jiāyuè hé Lǐ Wén zài nǎli liáotiānr?','在飞机上。','Zài fēijī shang.','地点'],['李文第一次做什么？','Lǐ Wén dì-yī cì zuò shénme?','第一次请外国朋友来家里过春节。','Dì-yī cì qǐng wàiguó péngyou lái jiā li guò Chūnjié.','第一次经历'],['中国人一般怎样过春节？','Zhōngguórén yìbān zěnyàng guò Chūnjié?','一般会回家，跟家人一起过。','Yìbān huì huí jiā, gēn jiārén yìqǐ guò.','过节方式'],['李文家会一边做什么，一边做什么？','Lǐ Wén jiā huì yìbiān zuò shénme, yìbiān zuò shénme?','一边包饺子，一边看春节联欢晚会。','Yìbiān bāo jiǎozi, yìbiān kàn Chūnjié Liánhuān Wǎnhuì.','家庭活动'],['春节大概放几天假？','Chūnjié dàgài fàng jǐ tiān jià?','大概七八天。','Dàgài qī bā tiān.','假期时间']],
  [['白家月见面时先说了什么？','Bái Jiāyuè jiànmiàn shí xiān shuōle shénme?','她说“过年好”，还请叔叔阿姨收下礼物。','Tā shuō “Guònián hǎo”, hái qǐng shūshu āyí shōuxia lǐwù.','拜年与礼物'],['张阿姨为什么说“终于有机会见面了”？','Zhāng āyí wèishénme shuō “zhōngyú yǒu jīhuì jiànmiàn le”?','因为她总听李文说起白家月。','Yīnwèi tā zǒng tīng Lǐ Wén shuōqǐ Bái Jiāyuè.','见面背景'],['桌子上有什么？','Zhuōzi shang yǒu shénme?','有饮料和矿泉水。','Yǒu yǐnliào hé kuàngquánshuǐ.','桌上物品'],['张阿姨请白家月先做什么？','Zhāng āyí qǐng Bái Jiāyuè xiān zuò shénme?','先坐着看会儿电视。','Xiān zuòzhe kàn huìr diànshì.','等候活动'],['白家月怎样学会包饺子的？','Bái Jiāyuè zěnyàng xuéhuì bāo jiǎozi de?','她刚刚看视频学会了。','Tā gānggāng kàn shìpín xuéhuì le.','学习方法']],
  [['全家照是在什么地方照的？','Quánjiāzhào shì zài shénme dìfang zhào de?','在机场照的。','Zài jīchǎng zhào de.','照片地点'],['这张照片大概是什么时候照的？','Zhè zhāng zhàopiàn dàgài shì shénme shíhou zhào de?','三四年前。','Sān sì nián qián.','照片时间'],['张阿姨觉得那件事像什么时候发生的？','Zhāng āyí juéde nà jiàn shì xiàng shénme shíhou fāshēng de?','好像是不久前发生的一样。','Hǎoxiàng shì bùjiǔ qián fāshēng de yíyàng.','时间感受'],['李文刚离开家时，张阿姨习惯吗？','Lǐ Wén gāng líkāi jiā shí, Zhāng āyí xíguàn ma?','不习惯。','Bù xíguàn.','家人感受'],['李文还有多久毕业？','Lǐ Wén hái yǒu duōjiǔ bìyè?','还有最后一个学期。','Hái yǒu zuìhòu yí ge xuéqī.','毕业时间']],
  [['李文的父母给白家月看了什么？','Lǐ Wén de fùmǔ gěi Bái Jiāyuè kànle shénme?','李文出生时的照片。','Lǐ Wén chūshēng shí de zhàopiàn.','照片内容'],['他们还给白家月讲了什么？','Tāmen hái gěi Bái Jiāyuè jiǎngle shénme?','很多过去的故事。','Hěn duō guòqù de gùshi.','故事内容'],['李文从什么时候起努力学习？','Lǐ Wén cóng shénme shíhou qǐ nǔlì xuéxí?','从高中想学医时起。','Cóng gāozhōng xiǎng xué yī shí qǐ.','努力起点'],['李文什么时候得到了留学机会？','Lǐ Wén shénme shíhou dédào le liúxué jīhuì?','高三的时候。','Gāosān de shíhou.','获得机会时间'],['白家月懂得了什么？','Bái Jiāyuè dǒngde le shénme?','只要一直坚持，就能完成自己的目标。','Zhǐyào yìzhí jiānchí, jiù néng wánchéng zìjǐ de mùbiāo.','学到的道理']]
];

const applicationSpecs = [
  {listenPrompt:'先听对话，只找他们在哪里、白家月为什么开心、李文家过春节会做什么。',pre:['你喜欢什么节日？','你会和家人一起做什么？'],key:[['在中国过年','白家月开心的原因'],['怎样过节','询问过节方式'],['最重要的节日','介绍春节'],['一边包饺子一边看晚会','同时做两件事'],['大概七八天','用概数说假期']],culture:{title:'春节与家人团聚',titleEn:'Spring Festival and family reunion',questions:['你家过重要节日时会一起做什么？','所有家庭都必须用同一种方法过节吗？'],background:'Spring Festival is a family-centered holiday. Family reunion is common, while food and local customs may differ.',words:['春节','过节','节日','联欢'],samples:['我们家过节时会一起吃饭。','每个家庭的习惯可以不一样。']},nodes:[['飞机聊天','白家月要在中国过年'],['第一次邀请','李文第一次请外国朋友'],['问过节','怎样过春节'],['陪家人','回家一起过'],['家庭活动','包饺子看晚会'],['假期','大概七八天']],frame:'白家月要在……，所以……。李文第一次……。春节是……，大家一般……。李文家会一边……，一边……。春节大概……。',grammarIds:['g18_01'],personal:'介绍一个你喜欢的节日：什么时候？你和家人会做什么？',paragraph:'l18_para_01',mini:'mini_l18_t1_festival'},
  {listenPrompt:'先听对话，只找白家月见了谁、带了什么、后来想一起做什么。',pre:['第一次去朋友家做客时，你会带什么？','你最近学会了什么？'],key:[['给叔叔阿姨拜年','礼貌问候'],['请收下','送礼表达'],['总听……说起','以前常听到'],['终于见面','第一次见面'],['刚刚看视频学会','介绍新技能和方法']],culture:{title:'第一次做客的礼貌',titleEn:'Polite first visits',questions:['第一次去朋友家，你会怎样打招呼？','礼物一定要很贵吗？'],background:'A small gift can show thanks when visiting a family, but the important point is respect rather than price.',words:['阿姨','叔叔','收','见面'],samples:['我会先向叔叔阿姨问好。','礼物不用很贵，有心就可以。']},nodes:[['拜年','先问好'],['礼物','请收下'],['见面','终于见面'],['饮料','自己拿'],['等饺子','先看电视'],['新技能','一起包饺子']],frame:'白家月来到……，先说……，还送了……。张阿姨总听……，所以今天终于……。叔叔请她……。她刚刚……，所以想……。',grammarIds:['g18_02'],personal:'介绍一件你刚刚学会做的事：你怎么学会的？',paragraph:'l18_para_02',mini:'mini_l18_t2_new_skill'},
  {listenPrompt:'先听对话，只找照片在哪里照的、是什么时候照的、张阿姨什么时候很想李文。',pre:['你喜欢看以前的照片吗？','一张照片可以让你想起什么？'],key:[['出国前照的','照片时间'],['从北京出发','出发地点'],['三四年前','概数时间'],['不久前发生','时间感受'],['只要几天不视频就很想','条件和结果'],['最后一个学期','毕业时间']],culture:{title:'照片与远方的家人',titleEn:'Photos and family across distance',questions:['你会用什么保存生活中的重要时刻？','离家学习时可以怎样联系家人？'],background:'Family photos often connect a place, a time and a feeling. Regular contact can help family members feel close across distance.',words:['出发','发生','学期','毕业'],samples:['我会拍照片，也会写一两句话。','我可以每周跟家人视频一次。']},nodes:[['旧照片','看李文出国前的照片'],['机场','从北京出发'],['时间','三四年前'],['感受','像不久前发生'],['想念','刚离家时不习惯'],['联系','几天不视频就想'],['毕业','还有一个学期']],frame:'白家月看到……。这张照片是李文……时照的，大概是……。张阿姨觉得……。李文刚离开家时……，只要……就……。现在他还有……。',grammarIds:['g18_03'],personal:'介绍一张对你很重要的旧照片：什么时候照的？有什么故事？',paragraph:'l18_para_03',mini:'mini_l18_t3_photo_story'},
  {listenPrompt:'先听日记，只找白家月最高兴的事、李文从什么时候起努力、她从李文身上学到了什么。',pre:['你有一个想完成的目标吗？','为了这个目标，你愿意坚持做什么？'],key:[['认识父母','最高兴的事'],['出生时的照片','成长开始'],['过去的故事','家庭回忆'],['从那时起','行动起点'],['坚持完成目标','学到的道理'],['以后发展得更好','对未来的相信']],culture:{title:'小行动与长期目标',titleEn:'Small actions and long-term goals',questions:['坚持是不是每天都必须做很多？','如果目标太难，可以怎么改？'],background:'A goal becomes more useful when it has a clear starting point and a small action that can be repeated.',words:['过去','坚持','完成','目标'],samples:['每天做一点也可以叫坚持。','我可以把大目标分成几个小目标。']},nodes:[['认识父母','春节做客'],['出生照片','看相册'],['过去故事','听父母介绍'],['学医','高中目标'],['努力','从那时起'],['机会','成绩好去留学'],['懂得','坚持完成目标']],frame:'白家月最高兴的是……。李文的父母给她看……，还讲……。李文高中时想……，从那时起……。因为……，他得到……。白家月懂得了……。',grammarIds:['g18_04'],personal:'介绍一个你的目标：从什么时候起？你要怎么坚持？',paragraph:'l18_para_04',mini:'mini_l18_t4_growth_goal'}
];

const makeOverall = (row) => ({id:row[0],focus:'overall_understanding',question:row[1],pinyin:'',options:row[2],correctIndex:row[3],answer:row[2][row[3]],sourceType:extension});
const makeDetail = (row,textNo,i) => ({id:'l18_t'+textNo+'_detail_'+pad(i+1),question:row[0],questionCn:row[0],pinyin:row[1],questionPinyin:row[1],answer:row[2],answerPinyin:row[3],acceptedAnswers:[row[2]],informationPoint:row[4],sourceType:extension});
const textTeachingNotes = Object.fromEntries(texts.map((text,i)=>{const spec=applicationSpecs[i];const overallChoices=overallRows[i].map(makeOverall);const details=detailRows[i].map((r,j)=>makeDetail(r,i+1,j));const note={presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:spec.listenPrompt,audioStatus:'available',preReadingQuestions:spec.pre.map((question)=>({question,pinyin:''})),overallChoices,details,keyPoints:spec.key.map((k)=>({hanzi:k[0],pinyin:'',note:k[1]})),cultureDiscussion:{title:spec.culture.title,titleEn:spec.culture.titleEn,questions:spec.culture.questions,background:spec.culture.background,wordCards:spec.culture.words.map((hanzi)=>({hanzi,pinyin:byWord[hanzi]?.pinyin||'',english:byWord[hanzi]?.english||hanzi})),sampleAnswers:spec.culture.samples.map((hanzi)=>({hanzi,pinyin:''})),sourceType:extension},retellScaffold:{nodes:spec.nodes.map((n)=>({label:n[0],hint:n[1]})),frame:spec.frame,promptEn:'Retell the text with the prompts, then connect it to your own life.',sourceType:extension},languageAndApplication:{grammarIds:spec.grammarIds,personalPrompt:spec.personal,paragraphPracticeId:spec.paragraph,miniId:spec.mini},sourceType:extension};note.overallChoice=overallChoices;note.classQuestions=details;return [text.id,note];}));

const placeAnswer = (answer,distractors,index) => {const opts=distractors.filter((x)=>x!==answer).slice(0,3);while(opts.length<3)opts.push('以上都不对');opts.splice(index,0,answer);return opts;};
const quiz = (id,question,answer,distractors,index) => {const options=placeAnswer(answer,distractors,index);return {id,question,questionEn:'Choose the best answer.',options,correctIndex:index,answer,sourceType:extension};};
const previewSpecs = {
  A:{title:'A：我的节日家庭活动',titleEn:'My Festival Celebration',photo:'photo-text-1-family-dumplings-gala',words:['春节','怎样','过节','节日','联欢','大概'],background:'Learn how a family celebrates Spring Festival and how to say an approximate number.',contexts:[['“我们一般会回家，跟家人一起____。”','过节',['见面','出发','毕业']],['“春节是中国最重要的____。”','节日',['学期','目标','矿泉水']],['“春节____放七八天假。”','大概',['刚刚','总','只要']]],challenge:[['“怎样”用来问什么？','方法或情况',['一个人','一个地方','一个礼物']],['哪一句说一家人庆祝节日？','我们一起过节。',['我们一起出发。','我们一起毕业。','我们一起见面。']],['“节日”最接近哪个意思？','特别庆祝的日子',['学校的一段时间','旅行开始的时候','以前的故事']],['“联欢”是什么意思？','大家一起表演、庆祝',['一个人安静学习','离开一个地方','完成一个目标']],['“大概七八天”是什么意思？','大约七到八天',['只有七天','正好八天','十七八天']],['白家月为什么开心？','她要在中国过年',['她马上毕业','她去机场','她找到工作']],['李文家一边包饺子，一边做什么？','看春节联欢晚会',['准备出发','看旧照片','学习医学']],['春节一般和谁一起过？','家人',['陌生人','老师','同学']],['哪一句用了概数？','班里有五六个人。',['班里有五个人。','班里有很多人。','班里没有人。']],['春节大概放几天假？','七八天',['三四天','一个月','一个学期']]]},
  B:{title:'B：我刚刚学会的事',titleEn:'A Skill I Just Learned',photo:'photo-text-2-learning-dumplings-video',words:['阿姨','叔叔','收','见面','矿泉水','刚刚','总'],background:'Learn polite expressions for a first visit and describe a skill learned just now.',contexts:[['“这是我准备的礼物，请____下。”','收',['总','起','见']],['“今天终于有机会____了。”','见面',['过节','毕业','出发']],['“我____看视频学会了包饺子。”','刚刚',['大概','不久','只要']]],challenge:[['怎样礼貌称呼朋友的妈妈？','阿姨',['叔叔','同学','老师']],['怎样礼貌称呼朋友的爸爸？','叔叔',['阿姨','学生','朋友']],['送礼物时可以说什么？','请收下。',['请出发。','请毕业。','请发生。']],['“总听他说起你”中的“总”是什么意思？','常常',['刚刚','大概','不久']],['“说起你”是什么意思？','开始说到你',['请你站起来','和你见面','离开你']],['桌子上有什么？','饮料和矿泉水',['照片和书','饺子和礼物','电脑和手机']],['白家月怎样学会包饺子？','看视频学会的',['叔叔教会的','在学校学的','看照片学的']],['“刚刚”通常放在哪里？','主语后、动词前',['句子最后','名词后面','量词前面']],['第一次做客送小礼物最重要的是什么？','表示尊重和感谢',['礼物一定很贵','马上离开','不说话']],['白家月最后想做什么？','和大家一起包饺子',['一个人看电视','马上回学校','去机场照相']]]},
  C:{title:'C：我的成长相册',titleEn:'My Growth Album',photo:'photo-text-4-life-photo-album',words:['出发','不久','发生','只要','学期','毕业','坚持','目标'],background:'Use an old photo to tell a story, then connect a starting point to a goal and a repeated action.',contexts:[['“这是他从北京____时照的。”','出发',['出生','过节','见面']],['“还有最后一个____就要毕业了。”','学期',['节日','目标','礼物']],['“____一直坚持，就能完成目标。”','只要',['刚刚','大概','总']]],challenge:[['“出发”是什么意思？','离开一个地方开始行程',['回到一个地方','完成学习','庆祝节日']],['“不久前”表示什么？','时间不长以前',['很久以后','明年','每个学期']],['一件事“发生”是什么意思？','一件事情出现了',['一件事完成了','一个人毕业了','一个人出生了']],['“只要……就……”先说什么？','足够的条件',['照片地点','人物名字','礼物价格']],['李文还有多久毕业？','最后一个学期',['三四年','七八天','两个月']],['照片在哪里照的？','机场',['学校','饭店','医院']],['张阿姨什么时候很想李文？','几天不跟他视频时',['他回家时','看电视时','包饺子时']],['“坚持”是什么意思？','一直做，不停止',['马上完成','只做一次','换一个目标']],['李文为什么得到留学机会？','成绩特别好',['会包饺子','认识白家月','常看照片']],['哪一句说出了开始时间？','从这个学期起，我每天读中文。',['我今天读中文。','我读了三四页。','只要有书就读。']]]}
};

const previewMissions = sessions.map((session)=>{const key=session.id,lower=key.toLowerCase(),spec=previewSpecs[key],words=spec.words.map((w)=>byWord[w]),base='pre_l18_'+lower;const recognition=words.slice(0,4).map((v,i)=>quiz(base+'_rec_'+pad(i+1),'“'+v.hanzi+'”最接近哪个意思？',v.meaningCn,words.filter((x)=>x.id!==v.id).map((x)=>x.meaningCn),[0,1,2,3][i]));const contexts=spec.contexts.map((r,i)=>quiz(base+'_ctx_'+pad(i+1),r[0],r[1],r[2],[0,1,2][i]));const challenge=spec.challenge.map((r,i)=>quiz(base+'_ch_'+pad(i+1),r[0],r[1],r[2],[0,1,2,3,0,1,2,3,0,1][i]));return {id:'pm_hsk3_l18_'+lower,session:key,pilotMode:'ranked_vocab_preview_v1',title:spec.title,titleEn:spec.titleEn,subtitleEn:'Five stages prepare you for the next classroom task.',scenario:spec.titleEn,goals:[session.communicativeGoal,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:spec.background,storyRole:'Prepare one useful sentence for the next classroom task.',sourceType:extension,stages:[{id:base+'_01',order:1,title:'认识词语、短语和背景',titleEn:'Meet the Words',interactionType:'study_list',photos:[{src:'../in-class/'+image(spec.photo),label:spec.titleEn}],keywordCards:words.map((v)=>({...card(v.hanzi),sourceType:extension})),backgroundEn:spec.background,sourceType:extension},{id:base+'_02',order:2,title:'认读与词义选择',titleEn:'Recognition',interactionType:'practice_quiz',questions:recognition,recognitionWordIds:words.slice(0,4).map((v)=>v.id),sourceType:extension},{id:base+'_03',order:3,title:'中英文匹配',titleEn:'Chinese-English Match',interactionType:'timed_match',pairs:words.map((v,i)=>({id:base+'_pair_'+pad(i+1),word:v.hanzi,meaning:v.english,sourceType:extension})),sourceType:extension},{id:base+'_04',order:4,title:'完整语境判断',titleEn:'Context Check',interactionType:'practice_quiz',questions:contexts,sourceType:extension},{id:base+'_05',order:5,title:'有分数的最终挑战',titleEn:'Scored Challenge',interactionType:'ranked_quiz',questions:challenge,sourceType:extension}],reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],persistenceKeyPattern:'ClassProPreview_HSK3-L18_'+key+'_{student}_{contentVersion}',contentVersion:'HSK3-L18-v1',completionMessageEn:'Preview complete. Bring one useful sentence to class.'};});

const rolePattern = ['lesson','lesson','lesson','lesson','lesson','transfer','transfer','transfer','review','review'];
let roleIndex = 0;
const tag = (item) => ({...item,contentRole:rolePattern[roleIndex++%rolePattern.length],sourceType:extension});
const choice = (id,prompt,options,correctIndex,extra={}) => tag({id,type:'choice',prompt_cn:prompt,prompt_en:'Choose the best answer.',correct_answer:options[correctIndex],data:{question_cn:prompt,options,correct_index:correctIndex,answer:options[correctIndex],...extra}});
const open = (id,prompt,data={}) => tag({id,type:'open_response',prompt_cn:prompt,prompt_en:'Respond in complete Chinese.',openEnded:true,needsTeacherReview:true,data:{answerPlaceholder:'请写一个完整、自然的中文句子。',...data}});
const questionGroups = {};

const fillSpecs = [
  ['a',['怎样','过节','节日','联欢','大概'],[['你们____庆祝新年？','怎样'],['春节时，我们会回家____。','过节'],['春节是中国很重要的____。','节日'],['家人一起看____晚会。','联欢'],['假期____有七八天。','大概']]],
  ['b',['阿姨','收','见面','矿泉水','刚刚'],[['我先向张____问好。','阿姨'],['这是小礼物，请____下。','收'],['今天终于有机会____了。','见面'],['桌子上有饮料和____。','矿泉水'],['我____看视频学会了做菜。','刚刚']]],
  ['c',['出发','发生','学期','坚持','目标'],[['我们明天早上从学校____。','出发'],['这件事好像是不久前____的。','发生'],['他还有一个____就毕业。','学期'],['只要每天____练习，就会进步。','坚持'],['我的小____是每天读十分钟中文。','目标']]]
];
questionGroups.v5_vocab_fill = fillSpecs.map((g)=>tag({id:'l18_v5_'+g[0],type:'vocab_fill_group',prompt_cn:'选择词语完成五个完整句子。',data:{wordBank:g[1],sentences:g[2].map((s,i)=>({id:'l18_v5_'+g[0]+'_'+pad(i+1),sentence:s[0],answer:s[1],acceptedAnswers:[s[1]]}))}}));

const matchSpecs = [
  ['课文1：春节家庭活动',[['白家月为什么觉得这次过年很特别？','因为这是她第一次在中国过年。'],['李文为什么也很开心？','因为他第一次请外国朋友来家里过春节。'],['李文家过春节时有哪些活动？','一起包饺子、看晚会。'],['“七八天”表示假期有多长？','表示大概有一个星期。'],['他们为什么十二点以后才睡？','因为一边包饺子，一边看晚会。']]],
  ['课文2：第一次做客',[['张阿姨没见过白家月，为什么知道她？','因为她总听李文说起白家月。'],['白家月为什么带礼物？','因为李文父母请她来家里过节，她想谢谢他们。'],['李叔叔为什么让白家月自己拿饮料？','因为桌上有饮料和矿泉水，她可以自己选。'],['白家月为什么不只坐着看电视？','因为她刚刚学会包饺子，想和大家一起包。'],['白家月是怎么学会包饺子的？','她刚刚看视频学会的。']]],
  ['课文3—4：照片与目标',[['张阿姨为什么觉得时间过得快？','因为三四年前的事像不久前发生的一样。'],['李文刚离家时，张阿姨为什么不习惯？','因为她很想李文，几天不视频就会想他。'],['李文快回来了吗？','快了，他还有最后一个学期就毕业。'],['李文从什么时候起开始努力？','从高中想学医的时候起。'],['白家月从李文身上懂得了什么？','只要一直坚持，就能完成自己的目标。']]]
];
questionGroups.v7_word_match = matchSpecs.map((g,i)=>tag({id:'l18_v7_'+pad(i+1),type:'question_answer_match',prompt_cn:'把每个完整问题和合适的完整回答配对。',prompt_en:'Match each complete question with its complete answer.',data:{title:g[0],interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,pairs:g[1].map((p,j)=>({id:'l18_v7_'+pad(i+1)+'_'+pad(j+1),left:p[0],right:p[1]}))}}));

const orderSpecs = [
  ['春节','大概','放','七八天','假','。'],
  ['我','刚刚','看视频','学会了','包饺子','。'],
  ['只要','一直坚持','，','就能','完成目标','。'],
  ['从','这个学期','起','，','我','每天读中文','。'],
  ['我们','一边','包饺子','，','一边','看晚会','。']
];
questionGroups.g1_ordering = orderSpecs.map((chunks,i)=>tag({id:'l18_order_'+pad(i+1),type:'sentence_order',correct_answer:chunks.join(''),data:{chunks,answer:chunks.join('')}}));

const sceneChoices = [
  ['朋友第一次来家里过春节，哪一句欢迎最合适？',['叔叔阿姨，过年好！','你怎么还没走？','我不想见面。'],0],
  ['想说假期大约有七到八天，哪一句正确？',['假期有七天。','假期大概有七八天。','假期有十七八天。'],1],
  ['朋友送来礼物，主人可以怎样回答？',['请你出发。','我刚刚毕业。','谢谢，你太客气了！'],2],
  ['想介绍刚学会的技能，哪一句完整？',['我刚刚看视频学会了做汤。','我刚才的做汤。','我大概技能。'],0],
  ['看三四年前的照片，哪一句合适？',['这张照片明天照。','这张照片是三四年前照的。','这张照片没有人。'],1],
  ['家人几天不视频就想念对方，哪一句正确？',['只要视频。','家人就几天。','只要几天不视频，妈妈就很想他。'],2],
  ['想说新习惯开始的时间，哪一句正确？',['从这个月起，我每天走路。','我这个月大概。','只要这个月。'],0],
  ['怎样让大目标更容易完成？',['一天做完所有事。','分成小行动，每天坚持。','只写目标，不行动。'],1],
  ['第一次去朋友家做客，哪一种做法更礼貌？',['什么都不说。','要求主人准备贵礼物。','先问好，并感谢邀请。'],2],
  ['介绍旧照片时，哪些信息最清楚？',['时间、地点和一个故事。','只说“很好看”。','只说照片颜色。'],0]
];
questionGroups.scene_sentence_choice = sceneChoices.map((r,i)=>choice('l18_scene_'+pad(i+1),r[0],r[1],r[2]));

const guessSpecs = [
  ['用来问方法或情况',['怎样','大概','过去'],0,'yòng lái wèn fāng fǎ huò qíng kuàng'],
  ['庆祝一个特别的日子',['见面','过节','毕业'],1,'qìng zhù yí ge tè bié de rì zi'],
  ['接受别人给的东西',['出发','完成','收'],2,'jiē shòu bié rén gěi de dōng xi'],
  ['两个人见到彼此',['见面','出生','发生'],0,'liǎng ge rén jiàn dào bǐ cǐ'],
  ['表示不久以前发生的动作',['不久','刚刚','总'],1,'biǎo shì bù jiǔ yǐ qián fā shēng de dòng zuò'],
  ['离开一个地方开始行程',['学期','坚持','出发'],2,'lí kāi yí ge dì fāng kāi shǐ xíng chéng'],
  ['学校学习的一段时间',['学期','节日','目标'],0,'xué xiào xué xí de yí duàn shí jiān'],
  ['一直做并且不停止',['发展','坚持','懂得'],1,'yì zhí zuò bìng qiě bù tíng zhǐ'],
  ['想要做到的事情',['过去','完成','目标'],2,'xiǎng yào zuò dào de shì qing'],
  ['把一件事做完',['完成','发生','联欢'],0,'bǎ yí jiàn shì zuò wán']
];
questionGroups.v6_description_guess = guessSpecs.map((r,i)=>tag({id:'l18_guess_'+pad(i+1),type:'description_guess',prompt_cn:r[0],correct_answer:r[1][r[2]],data:{description:r[0],description_pinyin:r[3],options:r[1],correct_index:r[2],answer:r[1][r[2]]}}));

const saySpecs = [
  ['一起过节','yìqǐ guòjié','photo-text-1-family-dumplings-gala',['节日','家人','庆祝'],'描述一家人共同庆祝节日的活动。'],
  ['第一次见面','dì-yī cì jiànmiàn','photo-text-2-new-year-greeting-gift',['问好','以前没见过','高兴'],'描述两个人以前没见过，现在互相看到。'],
  ['收下礼物','shōuxià lǐwù','photo-text-2-new-year-greeting-gift',['别人送','接受','谢谢'],'描述接受别人送来的东西。'],
  ['刚刚学会','gānggāng xuéhuì','photo-text-2-learning-dumplings-video',['不久以前','视频','会做'],'描述不久以前学会做一件事。'],
  ['从北京出发','cóng Běijīng chūfā','photo-text-3-airport-family-photo',['机场','离开','行程'],'描述从北京开始一段行程。'],
  ['快要毕业','kuàiyào bìyè','photo-text-3-mother-video-call',['最后学期','完成学习','回来'],'描述很快就要完成一个学习阶段。'],
  ['坚持学习','jiānchí xuéxí','photo-text-4-study-goal-timeline',['每天','不停止','行动'],'描述每天继续学习。'],
  ['完成目标','wánchéng mùbiāo','photo-text-4-study-goal-timeline',['想做到','坚持','成功'],'描述把自己想做的事情做完。']
];
questionGroups.v2_say_guess = saySpecs.map((r,i)=>tag({id:'l18_say_'+pad(i+1),type:'say_guess_card',prompt_cn:'你说我猜：不能直接说出词卡正面的短语。',data:{target:r[0],pinyin:r[1],image:image(r[2]),keywords:r[3],task:r[4],maxHanzi:5,covered:true}}));

const blindSpecs = [
  ['l18_blind_01','介绍一个你喜欢的节日：什么时候？你和家人会做什么？',['春节','包饺子'],['chūnjié','bāo jiǎozi'],'我喜欢春节，我会和家人一起包饺子。'],
  ['l18_blind_02','介绍一件你刚刚学会做的事：你怎么学会的？',['刚刚','看视频'],['gānggāng','kàn shìpín'],'我刚刚看视频学会了包饺子。'],
  ['l18_blind_03','介绍一张对你很重要的旧照片：什么时候照的？有什么故事？',['三四年前','机场'],['sān sì nián qián','jīchǎng'],'这张照片是三四年前在机场照的。'],
  ['l18_blind_04','介绍一个你的目标：从什么时候起？你要怎么坚持？',['从今天起','坚持'],['cóng jīntiān qǐ','jiānchí'],'从今天起，我要坚持每天学习中文。']
];
questionGroups.v3_blind_box = blindSpecs.map((r)=>open(r[0],'盲盒造句：用两个表达完成一句话。',{words:r[2],words_pinyin:r[3],instructions:'两个表达都必须出现，句子要完整自然。',sample:r[4],endpoint:r[1],revealDecoration:'none',uniformWordSize:true}));

const pictureSpecs = [
  ['g18_01','photo-text-1-family-dumplings-gala',['饺子','六七个','大概'],'相邻数字＋量词','桌子上大概有六七个饺子。'],
  ['g18_01','photo-text-3-airport-family-photo',['照片','三四年前','照'],'相邻数字＋时间','这张照片是三四年前照的。'],
  ['g18_02','photo-text-2-learning-dumplings-video',['刚才','看视频','刚刚','学会'],'刚才／刚刚','我刚才看了一个视频。我刚刚学会包饺子。'],
  ['g18_02','photo-text-2-new-year-greeting-gift',['刚才','见面','刚刚','送礼物'],'刚才／刚刚','我刚才和叔叔阿姨见面，刚刚送了礼物。'],
  ['g18_03','photo-text-3-mother-video-call',['只要','几天不视频','就','想'],'只要……就……','只要几天不视频，妈妈就很想他。'],
  ['g18_03','photo-text-2-learning-dumplings-video',['只要','每天练习','就','学会'],'只要……就……','只要每天练习，我就会慢慢学会。'],
  ['g18_04','photo-text-4-study-goal-timeline',['从','这个学期','起','每天读'],'从……起','从这个学期起，我每天读十分钟中文。'],
  ['g18_04','photo-text-4-life-photo-album',['从','高中','起','努力学习'],'从……起','从高中起，他就努力学习。']
];
questionGroups.g2_picture_complete = pictureSpecs.map((r,i)=>open('l18_picture_'+pad(i+1),'看图，用提示词和结构完成一句话。',{grammarId:r[0],image:image(r[1]),keywords:r[2],structure:r[3],targetStructure:r[3],sampleAnswer:r[4],publishTarget:'shared_classroom_wall'}));

const readingSpecs = [
  ['第一次在朋友家过节','安娜第一次去中国朋友家过春节。她先向叔叔阿姨问好，还带了一盒小点心。晚上，大家一边包饺子，一边看节目。她大概在朋友家住了两三天，觉得和家人一起过节很温暖。',[['安娜第一次去哪里过春节？',['中国朋友家','学校','机场'],0],['她带了什么？',['一张旧照片','一盒小点心','一瓶矿泉水'],1],['大家晚上一起做什么？',['准备考试','马上睡觉','包饺子、看节目'],2]]],
  ['我刚刚学会做汤','小林刚刚看视频学会了做西红柿鸡蛋汤。第一次做时，他把盐放多了。妈妈没有生气，和他一起再做了一次。第二次味道很好，他请全家人一起尝一尝。',[['小林学会了做什么？',['汤','饺子','蛋糕'],0],['他第一次做得怎么样？',['没有放盐','盐放多了','味道很好'],1],['谁帮助他再做一次？',['同学','老师','妈妈'],2]]],
  ['三四年前的合影','相册里有一张三四年前的全家照。照片是在机场照的，哥哥那天要出国学习。妈妈看照片时觉得时间过得很快，好像那天的事刚刚发生。现在哥哥还有一个学期就毕业了。',[['照片在哪里照的？',['机场','饭店','教室'],0],['照片大概是什么时候照的？',['七八天前','三四年前','一个月前'],1],['哥哥什么时候毕业？',['明天','三四年后','一个学期后'],2]]],
  ['只要每天做一点','美美想读完一本中文故事书，可是书很长。她把目标分成很多小部分：每天只读两三页，再写一句话。只要有时间，她就打开书读一会儿。一个月后，她完成了这个小目标。',[['美美的目标是什么？',['读完一本中文书','学会包饺子','去机场拍照'],0],['她每天读多少？',['七八十页','两三页','整本书'],1],['她怎样完成目标？',['只写目标','等别人帮助','每天做一点'],2]]],
  ['从这个学期起','从这个学期起，大卫决定每天早上读十分钟中文。他把目标写在卡片上，每完成一天就画一个小星星。周末如果很忙，他也会读两三分钟。坚持一个月后，他发现自己读得更快了。',[['大卫从什么时候起读中文？',['这个学期起','毕业以后','去年春节'],0],['他每天计划读多久？',['一个小时','十分钟','两三小时'],1],['坚持后有什么变化？',['不再学习','马上毕业','读得更快'],2]]]
];
questionGroups.r2_passage_choice = readingSpecs.map((r,i)=>tag({id:'l18_read_'+pad(i+1),type:'passage_choice_set',prompt_cn:r[0],data:{title:r[0],passage:r[1],questions:r[2].map((q,j)=>({id:'l18_read_'+pad(i+1)+'_q'+pad(j+1),question:q[0],options:q[1],correct_index:q[2],answer:q[1][q[2]]}))}}));

const independentSpecs = [
  ['不同的节日活动','小周家过春节时会一起包饺子，还会看晚会。安娜家过重要节日时常常做蛋糕，再去看爷爷奶奶。两个家庭的活动不一样，但是大家都会和家人一起吃饭、聊天。','小周家会一起做什么？',['包饺子、看晚会','去机场','学医'],0],
  ['第一次做客','马丁第一次去中国朋友家。他带了一份小礼物，见到朋友的父母先问好。主人请他自己拿矿泉水，还说“不用客气”。大家边吃边聊，很快就熟悉了。','主人为什么说“不用客气”？',['不想让他喝水','希望客人放松、自己拿水','让他马上回家'],1],
  ['我学会骑自行车','莉莉刚开始学骑自行车时有点儿害怕。爸爸每天陪她练二三十分钟。只要她慢慢向前看，就不会总停下来。两个星期后，她终于学会了。','莉莉怎样学会的？',['只看别人骑','买了一辆新车','每天在爸爸陪同下练习'],2],
  ['一张机场照片','这是一张三四年前的机场照片。照片里，我和父母站在行李旁边。那天我第一次离开家去外地学习。每次看见它，我都会想起父母的支持，也记得自己的第一次远行。','照片为什么重要？',['记录第一次离家和父母的支持','照片颜色很好看','机场很大'],0],
  ['我的小目标','从这个月起，山田要每天读中文。他的目标不是一天读很多，而是每天坚持十分钟。读完以后，他会把新词写进小本子。只要周末有时间，他就多读一篇。','他准备怎样坚持？',['只在考试前读','每天读十分钟并记录新词','请别人替他读'],1]
];
questionGroups.r3_independent_reading = independentSpecs.map((r,i)=>choice('l18_ind_read_'+pad(i+1),r[2],r[3],r[4],{title:r[0],passage:r[1]}));

const paragraphSpecs = [
  ['我喜欢的节日','我喜欢____1____。这个节日在____2____。我和家人会一起____3____。',['春节','机场','一月或二月','三四年前','包饺子','毕业'],[0,2,4]],
  ['我刚刚学会的事','我刚刚学会____1____。我先看____2____，后来自己练习。____3____帮助了我。',['包饺子','过节','视频','照片','朋友','目标'],[0,2,4]],
  ['一张重要的旧照片','这张照片是____1____照的，地点是____2____。每次看见它，我都会想起____3____。',['三四年前','刚刚','机场','教室','家人','饮料'],[0,2,4]],
  ['我的目标','我的目标是____1____。从这个学期起，我要____2____。只要一直坚持，我就能____3____目标。',['学好中文','过春节','每天练习','看晚会','完成','见面'],[0,2,4]],
  ['我的成长相册','我喜欢的节日是春节。我刚刚学会____1____。这张旧照片是____2____照的。从今天起，我要坚持____3____。',['包饺子','矿泉水','三四年前','一个学期','学习中文','阿姨'],[0,2,4]]
];
questionGroups.r4_paragraph_fill = paragraphSpecs.map((r,i)=>tag({id:'l18_para_'+pad(i+1),type:'paragraph_fill',prompt_cn:r[0],prompt_en:'Choose three expressions to complete the paragraph.',data:{title:r[0],passageParts:[r[1]],options:r[2],answers:r[3],optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange']}}));

const chainSpecs = [
  ['我们家过节时……',['春节','节日','大概','家人','联欢']],
  ['我刚刚学会……',['刚刚','视频','见面','收','阿姨']],
  ['这张照片是……',['出发','三四年','机场','不久','发生']],
  ['只要……，我就……',['只要','坚持','学期','毕业','完成']],
  ['从这个月起，我要……',['从……起','目标','懂得','坚持','完成']]
];
questionGroups.t3_chain_sentence = chainSpecs.map((r,i)=>open('l18_chain_'+pad(i+1),r[0],{starter:r[0],keywords:r[1],publishTarget:'shared_classroom_wall'}));

const taskSpecs = [
  ['介绍一个你喜欢的节日：什么时候？你和家人会做什么？','节日＋时间＋一个家庭活动','mini_l18_t1_festival'],
  ['介绍一件你刚刚学会做的事：你怎么学会的？','一件事＋一种学习方法','mini_l18_t2_new_skill'],
  ['介绍一张对你很重要的旧照片：什么时候照的？有什么故事？','时间＋一个故事信息','mini_l18_t3_photo_story'],
  ['介绍一个你的目标：从什么时候起？你要怎么坚持？','一个目标＋开始时间＋一个行动','mini_l18_t4_growth_goal'],
  ['用1—2分钟介绍一个节日、一件新学会的事、一张旧照片和一个目标。','节日＋技能＋照片＋目标','mini_l18_growth_album']
];
questionGroups.t2_task_card = taskSpecs.map((r,i)=>open('l18_task_'+pad(i+1),r[0],{output:r[0],minimum:r[1],miniId:r[2],publishTarget:'shared_classroom_wall'}));

questionGroups.pk_question = [
  choice('l18_pk_01','哪一句用了概数？',['我每天练习二三十分钟。','我每天练习。','我明天练习。'],0),
  choice('l18_pk_02','哪一句正确使用“刚刚”？',['刚刚的我视频。','我刚刚看视频学会了做汤。','我看刚刚视频。'],1),
  choice('l18_pk_03','哪一句说出了开始时间？',['我有一个目标。','只要练习就会进步。','从这个学期起，我每天读中文。'],2)
];

questionGroups.contextTransfer = [
  open('l18_transfer_01','一位朋友第一次来你家过节。请说一句欢迎，再介绍一项家庭活动。',{keywords:['节日','见面','一起']}),
  open('l18_transfer_02','同学刚学会做一道菜。请问他怎么学会的，再给一句鼓励。',{keywords:['刚刚','视频','坚持']}),
  open('l18_transfer_03','看一张旧照片，说出时间、地点和一个故事信息。',{keywords:['三四年前','出发','发生']}),
  open('l18_transfer_04','把一个大目标变成每天能做的小行动。',{keywords:['目标','从……起','只要……就……']})
];
questionGroups.reviewSet = [
  choice('l18_review_01','哪一句正确使用“一边……一边……”？',['我们一边包饺子，一边聊天。','我们一边饺子。','一边是节日。'],0),
  choice('l18_review_02','哪一句表示一件事快要发生？',['我昨天毕业。','还有一个学期就要毕业了。','我正在春节。'],1),
  choice('l18_review_03','哪一句是礼貌的做客表达？',['你必须给我水。','这个礼物很便宜。','谢谢您请我来家里做客。'],2)
];
questionGroups.infoMatch = [
  tag({id:'l18_info_01',type:'info_match',prompt_cn:'把人物行动和原因配对。',prompt_en:'Match each action with its reason.',data:{pairs:[['白家月很开心','要在中国过年'],['带一份礼物','感谢邀请'],['看旧照片','想起过去的故事']]}}),
  tag({id:'l18_info_02',type:'info_match',prompt_cn:'把结构和用途配对。',prompt_en:'Match each structure with its purpose.',data:{pairs:[['七八天','表示大约数量'],['刚刚＋动词','说不久前的动作'],['只要……就……','说足够条件和结果'],['从……起','说开始时间']]}})
];
questionGroups.textQa = texts.map((t,i)=>open('l18_text_qa_'+pad(i+1),'课文'+(i+1)+'：用两三句话回答核心问题。',{textId:t.id,question:['你喜欢什么节日？和家人会做什么？','你刚刚学会了什么？怎么学的？','介绍一张旧照片的时间和故事。','你的目标是什么？从什么时候开始？'][i]}));
questionGroups.pictureTalk = sceneSpecs.map((s,i)=>open('l18_picture_talk_'+pad(i+1),'看图完成30秒表达：'+s[2]+'。',{image:image(s[3]),keywords:s[6],task:s[4],observationHint:s[5]}));

questionGroups.battleGames = {
  roulette:[
    ['节日安排','朋友第一次来你家过节','介绍时间和两项活动。',['节日','过节','大概'],'我们春节会回家，大概放七八天假。'],
    ['家庭联欢','家人一边准备食物一边看节目','用“一边……一边……”介绍。',['联欢','家人','一起'],'我们一边包饺子，一边看晚会。'],
    ['第一次见面','外国朋友给叔叔阿姨拜年','说一句问候和一句送礼表达。',['阿姨','叔叔','收'],'叔叔阿姨，过年好！这是礼物，请收下。'],
    ['新技能','同学刚看视频学会一道菜','介绍他学会了什么、怎么学的。',['刚刚','视频','学会'],'他刚刚看视频学会了做汤。'],
    ['旧照片','三四年前的机场全家照','介绍时间、地点和人物。',['出发','不久','发生'],'这是三四年前在机场照的，好像是不久前发生的。'],
    ['保持联系','学生离家后常跟父母视频','用“只要……就……”说家人的感受。',['只要','视频','想'],'只要几天不视频，妈妈就很想他。'],
    ['开始努力','学生决定从本学期每天学习','用“从……起”说新行动。',['学期','坚持','目标'],'从这个学期起，我要坚持每天读中文。'],
    ['完成目标','学生把大目标分成小步骤','说出一个目标和坚持方法。',['懂得','完成','目标'],'只要每天做一点，我就能慢慢完成目标。']
  ].map((r,i)=>({id:'l18_game_roulette_'+pad(i+1),challenge:r[0],scene:r[1],prompt:r[2],keywords:r[3],sample:r[4]})),
  relay:[
    {id:'l18_game_relay_01',starter:'我们家过节时……',keywords:['春节','节日','大概']},
    {id:'l18_game_relay_02',starter:'我刚刚学会……',keywords:['刚刚','视频','完成']},
    {id:'l18_game_relay_03',starter:'这张照片是……',keywords:['出发','不久','发生']},
    {id:'l18_game_relay_04',starter:'只要……就……',keywords:['只要','坚持','目标']},
    {id:'l18_game_relay_05',starter:'从……起，我要……',keywords:['学期','坚持','完成']}
  ],
  monopoly:{theme:'light',boardShape:'winding',tasks:[
    '解释“过节”并造句','用相邻数字说一个大约数量','介绍一个家庭节日活动','说一句礼貌的拜年问候',
    '说出送礼物时的一句话','用“刚刚”介绍新技能','比较“刚才”和“刚刚”','介绍一种学习方法',
    '说出旧照片的时间和地点','用“只要……就……”说家人联系','介绍还有多久毕业','讲一条照片故事',
    '用“从……起”说开始时间','把目标分成一个小行动','说明怎样坚持','完成30秒成长相册表达'
  ].map((prompt,i)=>({id:'l18_game_monopoly_'+pad(i+1),type:['vocabulary','grammar','text','task'][i%4],prompt}))},
  studentRosterSource:'source/shared/students.js',sourceType:extension
};

const sessionTests = [
  {id:'l18_test_a',session:'A',title:'Test A：我的节日家庭活动',audio:['../../audio/HSK3/18-1.mp3'],focus:['课文1','T1词汇','g18_01'],sections:[{type:'listening',prompt:'听18-1.mp3，选择李文家过春节会一起做什么。',answer:'一边包饺子，一边看春节联欢晚会。'},{type:'vocabulary',questionIds:['l18_v5_a_01','l18_guess_01']},{type:'grammar',questionIds:['l18_order_01','l18_pk_01']},{type:'speaking',prompt:'说出一个节日和一个家庭活动。',minimum:'一个节日＋一个家庭活动'}],questionIds:['l18_order_01','l18_scene_01','l18_pk_01','l18_task_01'],audioRequired:true,sourceType:extension},
  {id:'l18_test_b',session:'B',title:'Test B：我刚刚学会的事',audio:['../../audio/HSK3/18-3.mp3'],focus:['课文2','T2词汇','g18_02'],sections:[{type:'listening',prompt:'听18-3.mp3，选择白家月怎样学会包饺子。',answer:'她刚刚看视频学会了。'},{type:'vocabulary',questionIds:['l18_v5_b_01','l18_guess_04']},{type:'grammar',questionIds:['l18_order_02','l18_pk_02']},{type:'speaking',prompt:'说出一件刚学会的事和学习方法。',minimum:'一件事＋一种学习方法'}],questionIds:['l18_order_02','l18_scene_04','l18_pk_02','l18_task_02'],audioRequired:true,sourceType:extension},
  {id:'l18_test_c',session:'C',title:'Test C：旧照片与成长目标',audio:['../../audio/HSK3/18-5.mp3','../../audio/HSK3/18-7.mp3'],focus:['课文3—4','T3/T4词汇','g18_03','g18_04'],sections:[{type:'listening',prompt:'听18-5和18-7.mp3，找出照片的时间、李文努力的起点和白家月学到的道理。',answer:'照片是三四年前照的；李文从高中想学医时起努力；只要坚持就能完成目标。'},{type:'vocabulary',questionIds:['l18_v5_c_01','l18_guess_08']},{type:'grammar',questionIds:['l18_order_03','l18_order_04','l18_pk_03']},{type:'speaking',prompt:'说出一张照片的信息和一个目标行动。',minimum:'照片信息＋一个目标行动'}],questionIds:['l18_order_03','l18_order_04','l18_scene_06','l18_scene_07','l18_pk_03','l18_task_03','l18_task_04'],audioRequired:true,sourceType:extension}
];

const preClass = {mode:'preview_mission',missionId:'pm_hsk3_l18_a',vocabularyIds:vocabulary.map((v)=>v.id),grammarIds:grammar.map((g)=>g.id),progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L18-v1'},reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt']};
const scaffoldLevels = [{label:'基础层 / Support',instruction:'使用词库和完整句框，完成最低要求。'},{label:'标准层 / Core',instruction:'独立完成核心内容，并使用本次目标结构。'},{label:'挑战层 / Challenge',instruction:'增加理由、比较或追问，但不改变核心任务。'}];
const postClassHomework = {
  mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,
  instructions:{required:'A和B的卡片必须带入C。',optional:'使用自画、公开资料或隐私安全图片；没有图片可用文字卡。',aiPolicy:'先独立完成，再用工具检查语言。No audio upload is required.'},
  sessionMeta:{A:{title:'My Festival Family Card',carryTo:'B、C'},B:{title:'My New Skill Card',carryTo:'C'},C:{title:'My Growth Album',presentation:'1—2分钟课堂展示；No audio upload is required.'}},
  sessions:{
    A:[{id:'post_l18_a_festival_family_card',type:'project_card',prompt_cn:'完成节日家庭卡：什么节日？什么时候？你和家人会一起做什么？',prompt_en:'Bring one family festival photo, your own drawing, a privacy-safe festival image, or a text-only card. Say which festival you like, when it is, and what you do with your family. Use at least three T1 words. Core students use one approximate quantity; Challenge students add one 一边……一边…… sentence. Speak for 30–45 seconds with a partner; every student speaks. No audio upload is required.',wordBank:['春节','怎样','过节','节日','联欢','大概'],requiredStructures:['概数表达（Core）','一边……一边……（Challenge）'],materials:['一张家庭节日照片、自画图、隐私安全图片或文字卡'],requiredQuestions:['什么节日？','什么时候？','你和家人会一起做什么？'],minimum:'节日＋时间＋一个家庭活动',speakingTime:'30—45 seconds',groupRules:'两人互听，每人必须说出“节日＋家庭活动”。',carryTo:['B','C'],scaffoldLevels,sourceType:extension}],
    B:[{id:'post_l18_b_new_skill_card',type:'project_card',prompt_cn:'使用A卡中的一个家庭活动或另一个真实技能，完成“我刚刚学会的事”卡。',prompt_en:'Bring Homework A and choose one family activity from it as a skill, or choose another real skill. Say what you learned, when you learned it, and who or what helped you. Use at least three T2 words. Core students use 刚刚 or 刚才; Challenge students use each once correctly. Speak for 30–45 seconds. Student A presents, Student B asks 你怎么学会的？, then switch. No audio upload is required.',wordBank:['阿姨','叔叔','收','总','见面','刚刚'],requiredStructures:['刚刚或刚才（Core）','刚刚和刚才各一次（Challenge）'],materials:['Homework A卡','一张技能图、步骤图或文字卡'],requiredQuestions:['你学会了什么？','什么时候学会？','谁或什么帮助了你？'],minimum:'一件事＋一种学习方法',speakingTime:'30—45 seconds',groupRules:'A介绍技能，B问“你怎么学会的？”，然后交换角色。',carryFrom:[{session:'A',taskId:'post_l18_a_festival_family_card',use:'从家庭活动中选择一个技能，也可选择另一个真实技能。'}],carryTo:['C'],scaffoldLevels,sourceType:extension}],
    C:[{id:'post_l18_c_growth_album',type:'project_card',prompt_cn:'使用A/B卡、旧照片和目标计划卡，完成“我的成长相册”。',prompt_en:'Bring Homework A, Homework B, one old photo or self-drawn memory card, and one goal-plan card. Introduce one festival family activity, one newly learned skill, the time and story of one old photo, and one goal with its starting point and a repeated action. Support students use at least five L18 words; Core students use at least eight. Core students use 只要……就…… and 从……起; Challenge students also add an approximate quantity or 刚才/刚刚. Speak for 1–2 minutes in class. Group members may ask questions and check language, but every student must make a meaningful personal contribution. No audio upload is required.',wordBank:['过节','大概','刚刚','出发','发生','只要','学期','毕业','过去','坚持','完成','目标'],requiredStructures:['只要……就……（Core）','从……起（Core）','概数或刚才/刚刚（Challenge）'],materials:['Homework A卡','Homework B卡','一张旧照片或自画记忆卡','一张目标计划卡'],requiredQuestions:['你家怎样过一个节日？','你刚刚学会了什么？','旧照片什么时候照的，有什么故事？','你的目标是什么，从什么时候起，怎样坚持？'],minimum:'节日＋技能＋照片时间和故事＋目标起点和行动',speakingTime:'1—2 minutes',groupRules:'小组可互相提问和检查，但每名学生必须完成有意义的个人发言。',carryFrom:[{session:'A',taskId:'post_l18_a_festival_family_card',use:'复用节日、时间和家庭活动。'},{session:'B',taskId:'post_l18_b_new_skill_card',use:'复用新技能和学习方法。'}],noAudioUpload:true,scaffoldLevels,sourceType:extension}]
  }
};

const t1WordIds = ['v18_01','v18_02','v18_03','v18_04','v18_05','v18_06','v18_29'];
const t2WordIds = ['v18_07','v18_08','v18_09','v18_10','v18_11','v18_12','v18_13','v18_14'];
const t3WordIds = ['v18_15','v18_16','v18_17','v18_18','v18_19','v18_20','v18_21'];
const t4WordIds = ['v18_22','v18_23','v18_24','v18_25','v18_26','v18_27','v18_28'];
const miniPlans = [
  {id:'mini_l18_t1_festival',title:'我的节日家庭活动',goal:'从说出喜欢的节日，到介绍时间和一个家庭活动。',goalEn:'Move from naming a festival to saying when it is and one family activity.',entry:'你喜欢什么节日？',exit:'介绍一个你喜欢的节日：什么时候？你和家人会做什么？',exitRequirements:['说出一个节日','说出时间','说出一个家庭活动'],supportCards:['我喜欢……。','这个节日在……。','我和家人会一起……。'],responseMode:'spoken_in_class',textId:texts[0].id,linkedResources:{vocabularyIds:t1WordIds,grammarIds:['g18_01'],textIds:[texts[0].id],practiceIds:['l18_task_01']},resourceLinks:{vocabulary:'T1',grammar:'g18_01',text:'t_hsk3_l18_01',practice:'l18_task_01'}},
  {id:'mini_l18_t2_new_skill',title:'我刚刚学会的事',goal:'从说出刚刚学会做的一件事，到介绍学习方法。',goalEn:'Move from naming one newly learned skill to explaining how it was learned.',entry:'你刚刚学会做的一件事是什么？',exit:'介绍一件你刚刚学会做的事：你怎么学会的？',exitRequirements:['说出一件事','说出一种学习方法'],supportCards:['我刚刚学会……。','我是看……学会的。','……帮助了我。'],responseMode:'spoken_pair',textId:texts[1].id,linkedResources:{vocabularyIds:t2WordIds,grammarIds:['g18_02'],textIds:[texts[1].id],practiceIds:['l18_task_02']},resourceLinks:{vocabulary:'T2',grammar:'g18_02',text:'t_hsk3_l18_02',practice:'l18_task_02'}},
  {id:'mini_l18_t3_photo_story',title:'一张重要的旧照片',goal:'从说有一张喜欢的照片，到说出时间和一个故事信息。',goalEn:'Move from naming a favourite photo to giving its time and one story detail.',entry:'你有一张喜欢的照片吗？',exit:'介绍一张对你很重要的旧照片：什么时候照的？有什么故事？',exitRequirements:['说出照片时间','说出一个故事信息'],supportCards:['这张照片是……照的。','照片里有……。','那时候……。'],responseMode:'spoken_in_class',textId:texts[2].id,linkedResources:{vocabularyIds:t3WordIds,grammarIds:['g18_03'],textIds:[texts[2].id],practiceIds:['l18_task_03']},resourceLinks:{vocabulary:'T3',grammar:'g18_03',text:'t_hsk3_l18_03',practice:'l18_task_03'}},
  {id:'mini_l18_t4_growth_goal',title:'我的成长目标',goal:'从说出一个小目标，到说明开始时间和一个坚持行动。',goalEn:'Move from naming a small goal to giving its starting point and one repeated action.',entry:'你现在有一个小目标吗？',exit:'介绍一个你的目标：从什么时候起？你要怎么坚持？',exitRequirements:['说出一个目标','说出开始时间','说出一个行动'],supportCards:['我的目标是……。','从……起，我要……。','只要……，我就……。'],responseMode:'spoken_in_class',textId:texts[3].id,linkedResources:{vocabularyIds:t4WordIds,grammarIds:['g18_04'],textIds:[texts[3].id],practiceIds:['l18_task_04']},resourceLinks:{vocabulary:'T4',grammar:'g18_04',text:'t_hsk3_l18_04',practice:'l18_task_04'}}
].map((plan)=>({...plan,sourceType:extension}));

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L18',lessonKey:'HSK3-L18',title:'我学会了包饺子',titleEn:'I\'ve learned how to make jiaozi',topic:'春节家庭活动、第一次做客、新技能、旧照片与成长目标',courseModel:'A节日家庭活动→B刚学会的事→C旧照片与成长目标',sourceTextPolicy:'教材事实来自L18.txt；课文4英文为用户批准的教学扩展；所有新增问题、练习、任务、图片和作业标记teaching_extension。',sourceAuthority:[sourceRef],sourceSha256:'4AC18CBE574631E6EF3042EB84177C9BBA240140833E3A0D281528EA11EB511E',missingResources:{audio:[],textbookImages:true,textbookExercises:true},audioResources:['audio/HSK3/18-1.mp3','audio/HSK3/18-3.mp3','audio/HSK3/18-5.mp3','audio/HSK3/18-7.mp3'],imageResources:sceneSpecs.map((s)=>'source/in-class/'+image(s[3])),editorialAudit:['课文1—3英文来自教材；课文4原文件没有英文。','用户于2026-11-06确认可补充课文4英文；该英文在数据中标记为teaching_extension。']},
  pedagogy:{exerciseMix:{lessonTargetPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'每位学生有效发言；C课堂展示，不上传音频。',miniEvidence:['entry_expression','actual_learning_path','exit_expression'],timerPolicy:{miniMinutes:[3,4,5],vocabularyMinutes:[2,3,4,5],timeoutAction:'prompt_only'}},
  features:{pinyin:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true,audio:true},
  sessions,
  usePreparation:{status:'active_shared_profile',configurationCreated:true,profile:'pilot-v1',formalResourcePlan:miniPlans,stateContract:{preserveOnReturn:['room','currentMini','timer','evidence','openedPath','interactionState'],evidenceTypes:['entry_expression','actual_learning_path','exit_expression']},sourceType:extension},
  vocabScenes,vocabulary,vocabularyCatalog:vocabulary.map((v)=>v.id),
  vocabularyGroups:[
    {id:'T1',textId:texts[0].id,vocabularyIds:t1WordIds,recognitionWordIds:['v18_01','v18_02','v18_06','v18_29'],activities:['recognition','form_choice','input','collocation'],sourceType:extension},
    {id:'T2',textId:texts[1].id,vocabularyIds:t2WordIds,recognitionWordIds:['v18_07','v18_09','v18_12','v18_14'],activities:['recognition','form_choice','input','collocation'],sourceType:extension},
    {id:'T3',textId:texts[2].id,vocabularyIds:t3WordIds,recognitionWordIds:['v18_15','v18_17','v18_19','v18_21'],activities:['recognition','form_choice','input','collocation'],sourceType:extension},
    {id:'T4',textId:texts[3].id,vocabularyIds:t4WordIds,recognitionWordIds:['v18_22','v18_25','v18_26','v18_27'],activities:['recognition','form_choice','input','collocation'],sourceType:extension}
  ],
  grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map((v)=>[v.id,{session:v.tags[0],textId:v.textId,tier:v.tier,meaningCn:v.meaningCn,phrases:v.phrases,properNoun:v.properNoun,sourceType:extension,sourceRef}])),
  previewMissions,preClass,inClass:{questionGroups,sessionTests},postClassHomework,
  report:{focus:['春节家庭活动','第一次做客与新技能','旧照片故事','成长目标'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务']}
};

fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(lesson,null,2)+'\n','utf8');
console.log('Built '+path.relative(root,out));
