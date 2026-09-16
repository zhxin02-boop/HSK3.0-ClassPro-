const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'source', 'data-model', 'lessons', 'HSK3-L05.json');
const img = (name, extension = 'png') => `images/hsk3-l05/${name}.${extension}`;
const roleFor = (index, total) => index < Math.floor(total * .5) ? 'lesson' : index < Math.floor(total * .8) ? 'transfer' : 'review';

const vocabRows = [
  ['总是','zǒngshì','副词','always','A','这个星期总是阴天。',['总是下雨','总是很忙']],
  ['终于','zhōngyú','副词','finally','A','今天终于晴了。',['终于到了','终于完成']],
  ['爬','pá','动词','climb','A','周末我们去爬山。',['爬山','爬楼梯']],
  ['山','shān','名词','mountain; hill','A','这座山不太高。',['一座山','山上']],
  ['锻炼','duànliàn','动词','take exercise','A','每天锻炼对身体很好。',['锻炼身体','坚持锻炼']],
  ['照','zhào','动词','take a picture','A','我给你照一张照片。',['照照片','给朋友照']],
  ['鞋','xié','名词','shoe','A','爬山要穿舒服的鞋。',['运动鞋','一双鞋']],
  ['大衣','dàyī','名词','overcoat','A','山上冷，别忘了带大衣。',['穿大衣','一件大衣']],
  ['拍照','pāizhào','动词','take a picture','B','她对拍照很感兴趣。',['喜欢拍照','拍照水平']],
  ['感兴趣','gǎn xìngqù','动词短语','be interested in','B','我对中国音乐很感兴趣。',['对……感兴趣','很感兴趣']],
  ['照相','zhàoxiàng','动词','take a picture','B','他经常给朋友照相。',['给人照相','照相的时候']],
  ['难看','nánkàn','形容词','ugly; bad-looking','B','这张照片有点儿难看。',['有点儿难看','不难看']],
  ['比较','bǐjiào','动词/副词','compare; relatively','B','我们比较一下两张照片。',['比较一下','比较清楚']],
  ['水平','shuǐpíng','名词','level; skill','B','她的拍照水平很高。',['汉语水平','提高水平']],
  ['太阳','tàiyáng','名词','sun','C','这边没有太阳。',['太阳出来了','看着太阳']],
  ['树','shù','名词','tree','C','她站在两棵树中间。',['一棵树','树中间']],
  ['干','gàn','动词','do','C','你想干什么都可以。',['干什么','干得不错']],
  ['电','diàn','名词','electricity; battery power','C','我的手机没电了。',['手机没电','充电']],
  ['收到','shōudào','动词','receive','C','我收到了你的邮件。',['收到邮件','收到照片']],
  ['封','fēng','量词','measure word for letters or mail','C','我收到了一封邮件。',['一封邮件','两封信']],
  ['邮件','yóujiàn','名词','email','C','请把照片发到我的邮件里。',['收到邮件','发邮件']],
  ['难过','nánguò','形容词','sad','C','听到这个消息，她难过得很。',['觉得难过','难过得很']],
  ['哈哈','hāhā','拟声词','haha; laughter','C','这只是一个玩笑，哈哈！',['哈哈大笑','哈哈']],
  ['音乐','yīnyuè','名词','music','C','你对中国音乐有兴趣吗？',['听音乐','中国音乐']],
  ['兴趣','xìngqù','名词','interest','C','她对摄影很有兴趣。',['有兴趣','学习兴趣']],
  ['会','huì','名词','gathering; event','C','明天下午有一场音乐会。',['音乐会','运动会']],
  ['结束','jiéshù','动词','finish; end','C','音乐会七点多结束。',['下课结束','会议结束']]
];
const vocabulary = vocabRows.map((r, i) => ({id:`v05_${String(i + 1).padStart(2, '0')}`,hanzi:r[0],pinyin:r[1],pos:r[2],english:r[3],tags:[r[4]],example:r[5],phrases:r[6]}));
const word = hanzi => vocabulary.find(v => v.hanzi === hanzi);
const card = hanzi => { const v = word(hanzi); return {hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,example:v.example,exampleEnglish:''}; };

const texts = [
  {id:'t_hsk3_l05_01',textId:1,title:'今天终于晴了',setting:'在街上，白家月和李文边散步边聊天儿。',audio:'../../audio/HSK3/5-1.mp3',lines:[
    ['白家月','这个星期总是阴天，今天终于晴了。','Zhège xīngqī zǒngshì yīntiān, jīntiān zhōngyú qíng le.','It was always overcast this week; it is finally sunny today.'],
    ['李文','现在天气好得很！我们去爬山怎么样？','Xiànzài tiānqì hǎo de hěn! Wǒmen qù pá shān zěnmeyàng?','The weather is wonderful right now! How about we go mountain climbing?'],
    ['白家月','好啊！又能锻炼身体，又能照好看的照片。','Hǎo a! Yòu néng duànliàn shēntǐ, yòu néng zhào hǎokàn de zhàopiàn.','Great! We can both exercise and take nice photos.'],
    ['李文','那我带点儿水和吃的，咱们现在就去？','Nà wǒ dài diǎnr shuǐ hé chī de, zánmen xiànzài jiù qù?','Then I will bring some water and snacks. Shall we go right now?'],
    ['白家月','我回去穿上运动鞋，拿上大衣。要不要叫一雪姐一起去？','Wǒ huíqù chuānshang yùndòngxié, náshang dàyī. Yào bu yào jiào Yīxuě jiě yìqǐ qù?','I will go back to put on sneakers and grab my coat. Should we ask Sister Yixue to come along?'],
    ['李文','好主意。给她打个电话吧。','Hǎo zhǔyi. Gěi tā dǎ gè diànhuà ba.','Good idea. Give her a call.']
  ]},
  {id:'t_hsk3_l05_02',textId:2,title:'这样的照片才好看',setting:'在出租车上，王一雪和白家月在聊天儿。',audio:'../../audio/HSK3/5-3.mp3',lines:[
    ['白家月','这些照片是谁给您照的？张张都非常好看。','Zhèxiē zhàopiàn shì shéi gěi nín zhào de? Zhāngzhāng dōu fēicháng hǎokàn.','Who took these photos for you? Every single one looks great.'],
    ['王一雪','一飞。她对拍照一直很感兴趣，经常给我照相。','Yīfēi. Tā duì pāizhào yìzhí hěn gǎn xìngqù, jīngcháng gěi wǒ zhàoxiàng.','Yifei. She has always been very interested in photography and often takes pictures of me.'],
    ['白家月','我喜欢您大笑的这张，看起来很漂亮。','Wǒ xǐhuan nín dà xiào de zhè zhāng, kàn qǐlai hěn piàoliang.','I like this one where you are laughing out loud; you look very beautiful.'],
    ['王一雪','我觉得这张有点儿难看，那时候我不知道她在给我照相。','Wǒ juéde zhè zhāng yǒudiǎnr nánkàn, nà shíhou wǒ bù zhīdào tā zài gěi wǒ zhàoxiàng.','I think this one is a bit unflattering; I did not know she was taking a picture of me then.'],
    ['白家月','这样的照片才好看。我也喜欢拍照，爬山的时候我给您照几张照片吧。','Zhèyàng de zhàopiàn cái hǎokàn. Wǒ yě xǐhuan pāizhào, pá shān de shíhou wǒ gěi nín zhào jǐ zhāng zhàopiàn ba.','Photos like these are the best. I like taking pictures too; let me take a few for you while climbing the mountain.'],
    ['王一雪','好，我可以比较一下你们两个谁的水平高。','Hǎo, wǒ kěyǐ bǐjiào yíxià nǐmen liǎng gè shéi de shuǐpíng gāo.','Alright, then I can compare whose photography skills are better between the two of you.']
  ]},
  {id:'t_hsk3_l05_03',textId:3,title:'在山上拍照',setting:'在山上，王一雪和白家月边走边聊。',audio:'../../audio/HSK3/5-5.mp3',lines:[
    ['王一雪','家月，这里挺漂亮的，咱们在这里拍照吧。','Jiāyuè, zhèlǐ tǐng piàoliang de, zánmen zài zhèlǐ pāizhào ba.','Jiayue, it is quite beautiful here. Let us take photos here.'],
    ['白家月','这边没有太阳，咱们去那边吧。','Zhèbiān méiyǒu tàiyáng, zánmen qù nàbiān ba.','There is no sunlight over here; let us head over there.'],
    ['王一雪','好。你觉得我站在这些树中间怎么样？','Hǎo. Nǐ juéde wǒ zhàn zài zhèxiē shù zhōngjiān zěnmeyàng?','Sure. What do you think if I stand among these trees?'],
    ['白家月','挺好的。等一下，后边走过去两个人。','Tǐng hǎo de. Děng yíxià, hòubian zǒu guòqu liǎng gè rén.','Pretty good. Wait a second, two people are walking past in the back.'],
    ['王一雪','我准备好了，你照的时候告诉我。','Wǒ zhǔnbèi hǎo le, nǐ zhào de shíhou gàosu wǒ.','I am ready. Tell me when you take it.'],
    ['白家月','你不用看着我，想干什么都可以。','Nǐ búyòng kànzhe wǒ, xiǎng gàn shénme dōu kěyǐ.','You do not need to look at me; just do whatever you like.'],
    ['王一雪','树上飞来了几只鸟，我就看着它们吧。','Shù shang fēilái le jǐ zhī niǎo, wǒ jiù kànzhe tāmen ba.','A few birds just flew into the tree; I will just look at them.'],
    ['白家月','啊，手机没电了。','À, shǒujī méi diàn le.','Oh no, my phone battery is dead.']
  ]},
  {id:'t_hsk3_l05_04',textId:4,title:'音乐会以后来我家',format:'message',genre:'短信',sender:'王一雪',recipient:'白家月',author:'王一雪',setting:'在咖啡厅里，王一雪给白家月发短信。',audio:'../../audio/HSK3/5-7.mp3',lines:[
    ['王一雪','家月，我收到了你的那封邮件，也看到了你给我照的照片，张张都很漂亮。我已经告诉了一飞，你的拍照水平比她高，她难过得很，哈哈。不知道你对中国的音乐有没有兴趣？我送你一张明天下午音乐会的门票。音乐会七点多结束，你听完了音乐会就来我家吃饭，尝尝我做的中国菜。你觉得怎么样？','Jiāyuè, wǒ shōudào le nǐ de nà fēng yóujiàn, yě kàndào le nǐ gěi wǒ zhào de zhàopiàn, zhāngzhāng dōu hěn piàoliang. Wǒ yǐjīng gàosu le Yīfēi, nǐ de pāizhào shuǐpíng bǐ tā gāo, tā nánguò de hěn, hāhā. Bù zhīdào nǐ duì Zhōngguó de yīnyuè yǒu méiyǒu xìngqù? Wǒ sòng nǐ yì zhāng míngtiān xiàwǔ yīnyuèhuì de ménpiào. Yīnyuèhuì qī diǎn duō jiéshù, nǐ tīngwán le yīnyuèhuì jiù lái wǒ jiā chī fàn, chángchang wǒ zuò de Zhōngguó cài. Nǐ juéde zěnmeyàng?','Jiayue, I received your email and saw the photos you took of me. Every one is beautiful. I told Yifei that your photography skills are better than hers, and she is terribly sad, haha. Are you interested in Chinese music? I am giving you a ticket to tomorrow afternoon’s concert. The concert ends after seven. Come to my home for dinner after it finishes and try the Chinese dishes I make. What do you think?']
  ]}
].map(t => ({...t,lines:t.lines.map(x => ({speaker:x[0],hanzi:x[1],pinyin:x[2],english:x[3]}))}));

const grammar = [
  {id:'g05_01',title:'程度补语“得很”',titleEn:'High degree with 得很',scene:'How would you say the weather is extremely good or someone is very sad?',structure:'形容词 / 状态动词 + 得很',explanation:'“得很”放在形容词或状态动词后，表示程度很高，多用于口语。',examples:[['现在天气好得很。','The weather is extremely good now.'],['房间里面热得很。','It is extremely hot inside the room.'],['我觉得爬山累得很。','I think mountain climbing is extremely tiring.'],['听说手机丢了，他着急得很。','He was terribly anxious when he heard the phone was lost.'],['她收到朋友的照片，高兴得很。','She was extremely happy to receive her friend’s photos.']]},
  {id:'g05_02',title:'量词重叠',titleEn:'Reduplication of measure words',scene:'How would you say every photo looks good or every student has prepared?',structure:'量词 + 量词 + 都 + 谓语',explanation:'量词重叠强调范围内的每一个成员都有同样的特点，后面常用“都”。',examples:[['这些照片张张都非常好看。','Every one of these photos looks great.'],['这些苹果个个都很大。','Every one of these apples is large.'],['我们班的学生人人都喜欢拍照。','Every student in our class likes taking photos.'],['这几家宾馆家家都很干净。','Every one of these hotels is clean.'],['这个星期天天都下雨。','It rained every day this week.']]},
  {id:'g05_03',title:'存现句（3）',titleEn:'Appearance in an existential sentence',scene:'How would you describe people, cars, or birds appearing from a place or direction?',structure:'处所词语 + 动词 + 趋向/结果补语 + 了 + 数量短语 + 人/物',explanation:'用来说明某处出现或消失了人或事物，先说地点，再说变化和新出现的对象。',examples:[['后边走过去两个人。','Two people walked past in the back.'],['前面开过来很多车。','Many cars are coming from the front.'],['楼上下来了几个人。','Several people came downstairs.'],['树上飞来了几只鸟。','Several birds flew into the tree.'],['教室里走进来一位新老师。','A new teacher walked into the classroom.']]},
  {id:'g05_04',title:'“……了……就……”',titleEn:'One action immediately after another',scene:'How would you connect two actions when the second follows immediately after the first?',structure:'动词₁ + 了 + 宾语₁ + 就 + 动词₂ + 宾语₂',explanation:'表示两个动作紧接着发生；如果第二个动作也已经完成，句尾可以再用“了”。',examples:[['你听完了音乐会就来我家吃饭。','Come to my home for dinner after the concert.'],['我吃了早饭就去学校了。','I went to school right after breakfast.'],['昨天我们下了课就回家了。','Yesterday we went home as soon as class ended.'],['她拍完了照片就发给朋友。','She sent the photos to her friend right after taking them.'],['我们爬了山就去饭馆吃饭。','We went to a restaurant after climbing the mountain.']]}
].map(g => ({...g,examples:g.examples.map(x => ({hanzi:x[0],english:x[1]}))}));

const grammarTeachingNotes = Object.fromEntries(grammar.map(g => [g.id,{
  scene:g.scene,structure:g.structure,structureEn:g.titleEn,
  visualLearning:{
    leadExamples:g.examples.slice(0,3).map(x => ({english:x.english,hanzi:x.hanzi})),
    blocks:g.id==='g05_01'?['天气','好','得很']:g.id==='g05_02'?['张张','都','好看']:g.id==='g05_03'?['树上','飞来了','几只鸟']:['听完了音乐会','就','来我家吃饭'],
    blockLabelsEn:g.id==='g05_01'?['topic','state','very high degree']:g.id==='g05_02'?['every one','all','shared feature']:g.id==='g05_03'?['place','appearance','new entity']:['first action','immediately','next action'],
    impressions:g.examples.slice(0,3)
  },
  oralQuestions:g.id==='g05_01'?['今天天气怎么样？请用“得很”。','最近什么事让你高兴得很或累得很？','你的宿舍冬天热不热？']:
    g.id==='g05_02'?['看看同学们的照片，可以用“张张都……”怎么评价？','班里的同学人人都喜欢什么？','你这个星期是不是天天都很忙？']:
    g.id==='g05_03'?['现在教室里走进来一个人，你怎么说？','看看窗外，路上开过来什么？','用“树上……”描述一幅画面。']:
    ['你下了课就做什么？','你吃了早饭就去哪儿？','拍完照片以后你马上做什么？']
}]));

const textTeachingNotes = {
  t_hsk3_l05_01:{classQuestions:[['这个星期天气怎么样？','这个星期总是阴天。'],['今天天气有什么变化？','今天终于晴了。'],['爬山有什么两个好处？','能锻炼身体，也能照好看的照片。'],['白家月回去拿什么？','运动鞋和大衣。']].map(x=>({question:x[0],answer:x[1]})),retellScaffold:{nodes:[{label:'天气',hint:'终于晴了'},{label:'决定',hint:'去爬山'},{label:'准备',hint:'水、吃的、鞋、大衣'}],frame:'因为……，所以……。又能……，又能……。'}},
  t_hsk3_l05_02:{classQuestions:[['照片是谁照的？','王一飞照的。'],['王一飞对什么感兴趣？','她对拍照很感兴趣。'],['白家月最喜欢哪张？','王一雪大笑的那张。'],['王一雪为什么觉得那张难看？','因为她不知道有人在给她照相。']].map(x=>({question:x[0],answer:x[1]})),retellScaffold:{nodes:[{label:'看照片',hint:'张张都好看'},{label:'选照片',hint:'大笑的这张'},{label:'新任务',hint:'比较拍照水平'}],frame:'这些照片……。我最喜欢……，因为……。'}},
  t_hsk3_l05_03:{classQuestions:[['为什么要去那边拍？','因为这边没有太阳。'],['王一雪准备站在哪里？','站在树中间。'],['白家月为什么让她等一下？','因为后边走过去两个人。'],['最后发生了什么？','白家月的手机没电了。']].map(x=>({question:x[0],answer:x[1]})),retellScaffold:{nodes:[{label:'选位置',hint:'有太阳的那边'},{label:'等一等',hint:'走过去两个人'},{label:'拍摄失败',hint:'手机没电'}],frame:'她们先……，可是……，最后……。'}},
  t_hsk3_l05_04:{classQuestions:[['王一雪收到了什么？','一封邮件和照片。'],['她怎样评价照片？','张张都很漂亮。'],['她送给白家月什么？','一张音乐会门票。'],['音乐会结束后，白家月要做什么？','去王一雪家吃饭。']].map(x=>({question:x[0],answer:x[1]})),retellScaffold:{nodes:[{label:'收到',hint:'邮件和照片'},{label:'邀请',hint:'中国音乐会'},{label:'安排',hint:'结束后去吃饭'}],frame:'她先收到……，然后邀请……，……了就……。'}}
};

const sceneData = {
  1:{title:'晴天去爬山',subtitle:'从天气变化到户外准备。',steps:[
    {title:'终于晴了',prompt:'天气变了以后，她们想做什么？',image:img('photo-text-1-hiking'),labels:[{word:'总是',x:13,y:17},{word:'终于',x:87,y:13},{word:'爬',x:73,y:38},{word:'山',x:70,y:24},{word:'锻炼',x:48,y:48}],words:['总是','终于','爬','山','锻炼'],sentence:'今天终于晴了，我们去爬山锻炼身体吧。'},
    {title:'准备出发',prompt:'爬山以前要准备什么？',image:img('photo-text-1-hiking'),labels:[{word:'照',x:78,y:30},{word:'鞋',x:35,y:89},{word:'大衣',x:43,y:43}],words:['照','鞋','大衣'],sentence:'穿上运动鞋，拿上大衣，还可以照好看的照片。'}
  ]},
  2:{title:'比较照片',subtitle:'观察自然表情，谈谈什么照片好看。',steps:[
    {title:'谁喜欢拍照',prompt:'她们在比较什么？',image:img('photo-text-2-photo-review'),labels:[{word:'拍照',x:83,y:75},{word:'感兴趣',x:52,y:22},{word:'照相',x:33,y:66}],words:['拍照','感兴趣','照相'],sentence:'她对拍照一直很感兴趣，经常给朋友照相。'},
    {title:'哪张更好看',prompt:'怎样评价一张自然的照片？',image:img('photo-text-2-photo-review'),labels:[{word:'难看',x:73,y:37},{word:'比较',x:20,y:55},{word:'水平',x:56,y:78}],words:['难看','比较','水平'],sentence:'比较一下这几张照片，看看谁的拍照水平高。'}
  ]},
  3:{title:'山上拍照',subtitle:'找光线、等背景、捕捉自然动作。',steps:[
    {title:'选择位置',prompt:'在哪里拍照更好？',image:img('photo-text-3-mountain'),labels:[{word:'太阳',x:78,y:8},{word:'树',x:76,y:35}],words:['太阳','树'],sentence:'她站在有太阳的树中间。'},
    {title:'自然动作',prompt:'照片还没拍成，发生了什么？',image:img('photo-text-3-mountain'),labels:[{word:'干',x:67,y:60},{word:'电',x:27,y:48}],words:['干','电'],sentence:'想干什么都可以，可是手机突然没电了。'}
  ]},
  4:{title:'收到照片和邀请',subtitle:'从邮件、照片聊到音乐会安排。',steps:[
    {title:'收到邮件',prompt:'你看到了哪些表情和邮件信息？',image:img('photo-text-4-email-laugh','webp'),labels:[{word:'收到',x:52,y:22},{word:'封',x:61,y:64},{word:'邮件',x:76,y:29},{word:'难过',x:90,y:76},{word:'哈哈',x:18,y:18}],words:['收到','封','邮件','难过','哈哈'],sentence:'她收到一封邮件，看见朋友难过的表情以后哈哈大笑。'},
    {title:'音乐会邀请',prompt:'她收到门票后想做什么？音乐会结束后去哪里？',image:img('photo-text-4-concert-dinner','webp'),labels:[{word:'音乐',x:29,y:10},{word:'兴趣',x:22,y:43},{word:'会',x:72,y:12},{word:'结束',x:61,y:72}],words:['音乐','兴趣','会','结束'],sentence:'她收到一张音乐会门票，听完了音乐会就来朋友家吃中国菜。'}
  ]}
};

const q = (id, question, questionEn, options, answer) => ({id,question,questionEn,options,answer});
const previewSpecs = [
  {session:'A',title:'晴天去爬山',titleEn:'Plan a Sunny Hike',words:['总是','终于','爬','山','锻炼','照','鞋','大衣'],image:img('photo-text-1-hiking'),introEn:'Learn the weather, activity and preparation words needed to make a hiking plan.',contexts:[['这个星期____阴天，大家都在等太阳出来。','总是'],['今天____晴了，我们可以去爬山了。','终于'],['周末我想去____山，顺便锻炼身体。','爬'],['上山以前要穿舒服的运动____。','鞋'],['山上可能冷，最好带一件____。','大衣']]},
  {session:'B',title:'选择满意的照片',titleEn:'Choose Your Best Photo',words:['拍照','感兴趣','照相','难看','比较','水平'],image:img('photo-text-2-photo-review'),introEn:'Learn how to discuss photography, compare photos and explain which photo looks best.',contexts:[['她对____一直很感兴趣，周末常常带相机出去。','拍照'],['我不知道他在给我____，所以表情很自然。','照相'],['这张照片光线太暗，看起来有点儿____。','难看'],['我们把两张照片放在一起____一下吧。','比较'],['她练习了两年，拍照____越来越高。','水平']]},
  {session:'C',title:'拍照现场和音乐会邀请',titleEn:'Photo Scene and Concert Invitation',words:['太阳','树','干','电','收到','封','邮件','难过','哈哈','音乐','兴趣','会','结束'],image:img('photo-text-3-mountain'),introEn:'Learn to arrange a photo scene, report what appears, and connect a concert invitation with the next activity.',contexts:[['这边没有____，照片会比较暗。','太阳'],['手机没____了，今天不能继续拍照。','电'],['昨天我____了朋友发来的一封邮件。','收到'],['你对中国____有没有兴趣？','音乐'],['音乐会七点多____，我们以后一起吃饭。','结束']]}
];
function mission(spec, index){
  const sessionWords=spec.words.map(word), distract=(answer,i)=>spec.words.filter(x=>x!==answer).slice(i%3,i%3+2), meanings=spec.words.slice(0,5).map((h,i)=>q(`${spec.session.toLowerCase()}2q${i+1}`,'',`Which Chinese expression means “${word(h).english}”?`,[h].concat(distract(h,i)).slice(0,3),h));
  const context=spec.contexts.map((x,i)=>q(`${spec.session.toLowerCase()}4q${i+1}`,x[0],'Choose the word that completes the sentence.',[x[1]].concat(distract(x[1],i)).slice(0,3),x[1]));
  const rankedMeaningCount=Math.min(7,spec.words.length);
  const ranked=spec.words.slice(0,rankedMeaningCount).map((h,i)=>q(`${spec.session.toLowerCase()}5q${i+1}`,'',`Choose “${word(h).english}”.`,[h].concat(distract(h,i)).slice(0,3),h)).concat(spec.contexts.slice(0,10-rankedMeaningCount).map((x,i)=>q(`${spec.session.toLowerCase()}5q${i+rankedMeaningCount+1}`,x[0],'Choose the best answer.',[x[1]].concat(distract(x[1],i+1)).slice(0,3),x[1])));
  const stages=[
    {id:`${spec.session.toLowerCase()}1`,title:'今日词表',titleEn:'Meet the Words',screenPrompt:'先听、看并标记本次生词。',screenPromptEn:spec.introEn,interactionType:'study_list',photos:[{src:'../in-class/'+spec.image,label:spec.title}],keywordCards:sessionWords.map(v=>card(v.hanzi))},
    {id:`${spec.session.toLowerCase()}2`,title:'快速认词',titleEn:'Meaning Check',screenPrompt:'根据英文意思选择中文词。',screenPromptEn:'Choose the Chinese word that matches each meaning.',interactionType:'practice_quiz',questions:meanings},
    {id:`${spec.session.toLowerCase()}3`,title:'汉英配对',titleEn:'Match Sprint',screenPrompt:'把中文词和英文意思配成一组。',screenPromptEn:'Match six Chinese expressions with their English meanings.',interactionType:'timed_match',pairs:sessionWords.slice(0,6).map(v=>({word:v.hanzi,meaning:v.english}))},
    {id:`${spec.session.toLowerCase()}4`,title:'语境判断',titleEn:'Context Check',screenPrompt:'在完整语境中选择合适的词。',screenPromptEn:'Choose the expression that completes each situation.',interactionType:'practice_quiz',questions:context},
    {id:`${spec.session.toLowerCase()}5`,title:'正式挑战',titleEn:'Ranked Challenge',screenPrompt:'十题计分，正确率优先，同分时用时更短者在前。',screenPromptEn:'Ten scored questions. Accuracy comes first; time breaks a tie.',interactionType:'ranked_quiz',questions:ranked}
  ];
  return {id:`pm_hsk3_l05_${spec.session.toLowerCase()}`,session:spec.session,pilotMode:'ranked_vocab_preview_v1',title:`第${index+1}次课课前热身赛`,titleEn:`Preview ${spec.session}`,subtitleEn:spec.titleEn,scenario:spec.title,goals:[spec.title,'理解本次课核心表达','为课堂口头任务做准备'],storyIntro:spec.title,storyIntroEn:spec.introEn,stages,completionMessageEn:`Your official score has been saved. A score of 70% or above completes Preview ${spec.session}.`};
}

const fills = [
  [['总是','终于','爬','锻炼','大衣'],['这个星期____下雨，原来的爬山计划只好一次次改变。','等了好几天，今天____晴了，我们马上准备出发。','虽然这座山不太高，但是第一次____的人也要慢一点儿。','周末去公园跑步既能放松，也能____身体。','山顶的风比较大，出发以前最好在包里放一件____。']],
  [['拍照','感兴趣','难看','比较','水平'],['她从小就对摄影____，现在出门总会带着相机。','自然的表情更适合____，不一定每次都要看着镜头。','这张照片不是人____，而是后面的东西太多，看起来有点儿乱。','老师让我们把两张照片放在一起____，说说光线和背景有什么不同。','只要经常观察和练习，每个人的拍照____都会慢慢提高。']],
  [['宾馆','菜单','信用卡','终于','一直'],['旅行回来以后，她把最满意的照片放在____房间的桌上慢慢看。','大家看完照片去饭馆吃饭，服务员先拿来了____。','安娜办好____以后，就可以用它支付打印照片的钱。','我们等了四十分钟，公交车____来了。','司机从机场出发以后____向前开，没有走错路。']]
].map((g,gi)=>({id:`l05_fill_group_0${gi+1}`,type:'vocab_fill_group',stage:'in_class',contentRole:['lesson','transfer','review'][gi],prompt_en:'Choose from the word bank for each complete sentence.',data:{wordBank:g[0],wordBank_pinyin:g[0].map(x=>(word(x)||{}).pinyin||''),sentences:g[1].map((s,i)=>({sentence:s,answer:g[0][i]})),speakingOutput:{support:'任选两个词，完成一句话。',core:'任选三个词，用两句话说明一个完整情境。',stretch:'任选四个词，完成30秒口头故事。'}}}));

const orders = [
  ['这个星期总是阴天，今天终于晴了。',['这个星期','总是阴天','今天','终于晴了']],
  ['这些照片张张都非常好看。',['这些照片','张张','都','非常好看']],
  ['树上飞来了几只漂亮的小鸟。',['树上','飞来了','几只','漂亮的小鸟']],
  ['她拍完了照片就发给家人了。',['她','拍完了照片','就','发给家人了']],
  ['我们选好了宾馆就去准备行李。',['我们','选好了宾馆','就去','准备行李']]
].map((x,i,a)=>({id:`l05_order_0${i+1}`,type:'ordering',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'把语块排成一个完整、自然的句子。',prompt_en:'Put the chunks in order to make a complete sentence.',correct_answer:x[0],data:{chunks:x[1],chunks_pinyin:x[1].map(()=> '')}}));

const readPassages = [
  ['晴天计划','下了五天雨以后，星期六终于晴了。美美穿上运动鞋，带着水和大衣去爬山。她觉得爬山累得很，但是山上的风景也美得很。','美美为什么带大衣？','因为山上可能比较冷。'],
  ['自然的照片','小林拍了十张同学的照片。同学觉得自己没看镜头的那张最自然，小林也觉得这样的照片才好看。','他们最喜欢哪张照片？','没看镜头、表情自然的那张。'],
  ['校园摄影活动','摄影社星期五组织校园拍照活动。学生人人都要带一张以前拍的照片，先互相介绍，再一起去校园里找新的画面。','学生先要做什么？','先互相介绍以前拍的照片。'],
  ['公园里的变化','小雨正准备拍湖边的树，前面跑过来两个孩子，树上又飞下来几只鸟。她等大家走过去以后，终于拍到了安静的湖面。','小雨为什么先等了一会儿？','因为前面跑来孩子，树上又飞下来鸟。'],
  ['旅行照片','王一飞旅行回来以后收到了一封邮件。宾馆把她落在房间里的相机寄回来了，她高兴得很，马上给司机写了感谢信。','谁寄回了相机？','宾馆。']
].map((x,i,a)=>({id:`l05_read_0${i+1}`,type:'passage_reading',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'阅读小篇章，回答问题。',prompt_en:'Read and answer.',data:{title:x[0],passage:x[1],questions:[{question_cn:x[2],answer:x[3]}]}}));

const taskCards = [
  ['周末户外计划','你和朋友决定周末去哪里锻炼。',['说明天气','选择活动','列出要带的东西'],['终于','爬山','锻炼','运动鞋'],'用3—4句话商量。'],
  ['选出满意的照片','从一组照片中选出最满意的一张。',['描述照片','说明好在哪里','提出一个改进建议'],['张张都','比较','水平','才'],'每人至少说两句。'],
  ['班级摄影墙','你们要为班级照片墙选三张照片。',['确定主题','比较三张照片','说明选择理由'],['感兴趣','自然','比较','好看'],'完成40秒小组说明。'],
  ['活动结束后的安排','同学们参加完运动会后还有不同安排。',['说活动时间','连接两个动作','邀请同伴参加'],['结束','……了就……','一起'],'完成三轮对话。'],
  ['为旅行照片写说明','选择L04的一张旅行照片。',['说明地点','说发生的事情','评价感受'],['草原','宾馆','司机','满意'],'用3—4句话复述。']
].map((x,i,a)=>({id:`l05_task_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:`任务卡：${x[0]}。`,prompt_en:x[0],openEnded:true,needsTeacherReview:true,data:{title:x[0],role:x[1],steps:x[2],keywords:x[3],output:x[4],answerPlaceholder:'请写下课堂表达。'}}));

const sceneChoices = [
  ['It has been cloudy all week, but the sun appears today.','Use 总是 and 终于.','这个星期总是阴天，今天终于晴了。'],
  ['A friend suggests hiking because the weather is excellent.','Use 得很.','今天天气好得很，我们去爬山吧。'],
  ['Every photo in the set is attractive.','Use measure-word reduplication.','这些照片张张都很好看。'],
  ['Someone prefers a natural laughing photo.','Use 才 to emphasize the preferred kind.','这样的照片才好看。'],
  ['Birds suddenly appear in a tree.','Use an existential sentence.','树上飞来了几只鸟。'],
  ['A student sends photos immediately after taking them.','Use ……了……就…….','她拍完了照片就发给同学。'],
  ['Every student in the club likes music.','Use 人人都.','音乐社的学生人人都喜欢音乐。'],
  ['Two people enter the classroom.','Describe an appearance.','教室里走进来两个人。'],
  ['A flight was delayed, and the driver waited continuously.','Review L04 vocabulary.','飞机晚点了，司机一直在机场等。'],
  ['The hotel is different from all the others.','Review 跟……不一样.','这家宾馆跟别的都不一样。']
].map((x,i,a)=>({id:`l05_scene_${String(i+1).padStart(2,'0')}`,type:'scene_sentence_choice',stage:'in_class',contentRole:roleFor(i,a.length),prompt_en:'Choose the best sentence for the scene.',data:{scene_en:x[0],clue_en:x[1],options:[x[2],'我昨天在饭馆点了两盘饺子。','这个房间离地铁站不太远。','除了相机以外，我还带了衣服。'],correct_index:0},correct_answer:x[2]}));

const matchGroups = [
  [['这个星期天气一直不好，你们的爬山计划怎么样了？','今天终于晴了，我们穿上运动鞋就准备出发。'],['为什么天气一好你们就想去爬山？','因为既能锻炼身体，又能照好看的照片。'],['山上风大，你们准备带什么？','除了水和吃的，我们还要带一件大衣。'],['王一雪会不会跟你们一起去？','我们准备给她打电话，问问她有没有时间。'],['你觉得今天的天气怎么样？','天气好得很，特别适合在外面活动。']],
  [['你最满意的是哪一张照片？','我最满意大笑的这张，因为表情很自然。'],['这些照片是谁给你照的？','朋友给我照的，她一直对拍照很感兴趣。'],['这几张照片看起来怎么样？','张张都很清楚，不过第三张的光线最好。'],['你们为什么要比较两位同学？','我们想看看谁的拍照水平更高。'],['照片里的人为什么没有看镜头？','因为她不知道朋友正在给她照相。']],
  [['你们住的宾馆环境怎么样？','房间又大又干净，我们都很满意。'],['飞机晚点以后，司机做什么了？','他一直在机场等我们，一点儿也没着急。'],['你们到饭馆以后先做什么？','我们先看菜单，再请服务员介绍特色菜。'],['新宿舍区离地铁站远吗？','不太远，走十分钟就能到。'],['除了银行卡，还可以怎么付款？','还可以用手机付款，非常方便。']]
].map((pairs,i)=>({id:`l05_match_0${i+1}`,type:'word_match',stage:'in_class',contentRole:['lesson','transfer','review'][i],prompt_en:'Match each question with the best answer.',data:{pairs:pairs.map(x=>({left:x[0],right:x[1]}))}}));

const guessRows = [
  ['终于','等了很久以后，想要的事情最后发生了。'],['锻炼','为了身体更健康而跑步、爬山或做运动。'],['拍照','用手机或相机把一个画面保存下来。'],['感兴趣','很想了解、学习或参加一件事。'],['水平','一个人做某件事的能力高低。'],['电','手机没有它就不能继续使用。'],['收到','别人发来或送来的东西已经到了你这里。'],['音乐会','很多人在一个地方演奏或演唱音乐。'],['宾馆','旅行时可以住宿的地方。'],['菜单','在饭馆里介绍菜和饮料的单子。']
];
const guesses = guessRows.map((x,i,a)=>({id:`l05_desc_${String(i+1).padStart(2,'0')}`,type:'description_guess',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'读完整提示，联系语境猜词。',prompt_en:'Read the full clue and guess the word.',data:{description:x[1],options:[x[0],'比较','结束','司机'],correct_index:0},correct_answer:x[0]}));

const sayRows = [
  ['终于',['等很久','最后','成功']],['锻炼身体',['运动','健康','每天']],['拍照',['手机','相机','照片']],['张张都好看',['每一张','照片','漂亮']],
  ['手机没电',['不能使用','充电','突然']],['音乐会',['音乐','门票','结束']],['飞机晚点',['机场','没有按时','等']],['宾馆',['旅行','房间','住']]
];
const sayGuess = sayRows.map((x,i,a)=>({id:`l05_say_${String(i+1).padStart(2,'0')}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'你说我猜。',prompt_en:'Describe the target without saying it.',openEnded:true,needsTeacherReview:true,data:{target:x[0],boardIndex:i+1,clues:[],scaffold:{words:x[1],frames:['这是一个……。','人们用它 / 在这里……。','它跟……有关系。']},answerPlaceholder:'写你的中文提示。'}}));

const blindRows = [[['终于','晴'],['我们等了几天，今天终于晴了。']],[['张张','好看'],['她拍的照片张张都很好看。']],[['结束','就'],['音乐会结束了我们就回家。']],[['宾馆','满意'],['我们对这家宾馆很满意。']]];
const blind = blindRows.map((x,i,a)=>({id:`l05_blind_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'盲盒造句。',prompt_en:'Make one natural sentence with both expressions.',openEnded:true,needsTeacherReview:true,data:{words:x[0],instructions:'Use both expressions in one complete, natural sentence.',answerPlaceholder:'写一个完整的中文句子。',sample:x[1][0]}}));

const pictureKeywords = [['photo-text-1-hiking','终于'],['photo-text-1-hiking','得很'],['photo-text-2-photo-review','张张都'],['photo-text-3-mountain','飞来了'],['photo-text-4-email-laugh','收到','webp'],['photo-text-4-concert-dinner','……了就……','webp'],['photo-text-1-hiking','又……又……'],['photo-text-2-photo-review','跟……一样']];
const pictureComplete = pictureKeywords.map((x,i,a)=>({id:`l05_pic_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),openEnded:true,needsTeacherReview:true,prompt_cn:'看图造句。',prompt_en:'Use the keyword to write one complete sentence about the photo.',data:{image:img(x[0],x[2]),keyword:x[1],task:'观察人物、物品和场景，用关键词写一个完整、自然的句子。',answerPlaceholder:''}}));

const independent = readPassages.map((x,i)=>{const q0=x.data.questions[0],opts=[q0.answer,'因为他要去银行。','因为今天没有课。','因为他们想点菜。'];return{id:`l05_ind_read_0${i+1}`,type:'choice',stage:'in_class',contentRole:x.contentRole,prompt_cn:'读短文，选择正确答案。',prompt_en:'Read and choose.',data:{title:x.data.title,passage:x.data.passage,question_cn:q0.question_cn,options:opts,correct_index:0},correct_answer:q0.answer}});

const paragraphRows = [
  ['周末爬山',['这个星期总是阴天。','____1____','我和朋友马上决定去爬山。','____2____','到了山上，我们先找有太阳的地方。','____3____'],['星期六终于晴了。','我们穿好运动鞋，还带了水和大衣。','那里的风景美得很。']],
  ['选择照片',['王一雪给我们看了很多照片。','____1____','她最喜欢自己大笑的那张。','____2____','白家月也喜欢拍照。','____3____'],['这些照片张张都很自然。','她觉得这样的照片才好看。','她想在山上给王一雪再照几张。']],
  ['校园摄影日',['摄影社周五组织活动。','____1____','老师先让大家比较以前的作品。','____2____','活动结束以后，大家一起选照片。','____3____'],['参加的学生人人都带了一张照片。','比较完了就去校园拍照。','最后选出的照片会放在班级墙上。']],
  ['公园拍鸟',['小陈在湖边准备拍照。','____1____','他刚举起手机，树上飞下来几只鸟。','____2____','鸟飞走以后，他又等了一会儿。','____3____'],['前面走过来两个孩子。','他觉得这个画面漂亮得很。','最后终于拍到了安静的湖面。']],
  ['旅行以后',['旅行结束以后，王一飞回到了家。','____1____','她打开邮件，看见宾馆发来的消息。','____2____','相机回来以后，她很高兴。','____3____'],['但是她发现相机不在行李箱里。','原来相机还在宾馆的房间里。','她马上给司机和宾馆写了感谢信。']]
];
const paragraphs = paragraphRows.map((x,i,a)=>({id:`l05_para_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'段落填空。',prompt_en:'Choose three sentences to complete the paragraph.',openEnded:true,needsTeacherReview:true,data:{title:x[0],passageParts:x[1],options:x[2].concat(['我下午去银行。','服务员拿来了菜单。','这个房间挺干净的。']),answers:[0,1,2],instructions:'点击句子，再点击对应空格。',answerPlaceholder:''}}));

const chainRows = [['从“今天终于晴了”开始','今天终于晴了',['爬山','锻炼','照照片']],['从“这些照片”开始','这些照片',['张张','好看','比较']],['从“摄影社的活动”开始','摄影社的活动',['人人','拍照','结束']],['从“树上”开始','树上',['飞来了','几只鸟','手机没电']],['从“到了宾馆”开始','到了宾馆',['先','休息','满意']]];
const chains = chainRows.map((x,i,a)=>({id:`l05_chain_0${i+1}`,type:'open_response',stage:'in_class',contentRole:roleFor(i,a.length),prompt_cn:'接龙造句。',prompt_en:'Continue the sentence chain.',openEnded:true,needsTeacherReview:true,data:{title:x[0],starter:x[1],steps:[`S1: ${x[1]}`,`S2: ${x[1]}……`,`S3: ${x[1]}…………`],keywords:x[2],instructions:'每位学生增加一个自然的部分，最后形成完整表达。',answerPlaceholder:'继续接一句中文。'}}));

const battleGames = {
  roulette:[
    {id:'l05_r_01',challenge:'说明今天为什么适合户外活动。',scene:'你在邀请朋友去爬山。',keywords:['终于','天气','得很'],sample:'今天终于晴了，天气好得很。'},
    {id:'l05_r_02',challenge:'选择一张满意的照片并说明理由。',scene:'你在班级照片墙前。',keywords:['照片','自然','才'],sample:'我最满意这张，因为表情很自然，这样的照片才好看。'},
    {id:'l05_r_03',challenge:'描述山上突然出现的画面。',scene:'你正准备拍照。',keywords:['树上','飞来了','鸟'],sample:'树上飞来了几只鸟。'},
    {id:'l05_r_04',challenge:'邀请朋友参加音乐会后的活动。',scene:'你在发一条消息。',keywords:['结束','……了就……'],sample:'你听完了音乐会就来我家吃饭。'}
  ],
  relay:[
    {id:'l05_relay_01',starter:'爬山',goal:'接一个自然短语或短句。',mustUse:['锻炼','运动鞋']},
    {id:'l05_relay_02',starter:'拍照',goal:'接一个自然短语或短句。',mustUse:['感兴趣','水平']},
    {id:'l05_relay_03',starter:'收到',goal:'接一个自然短语或短句。',mustUse:['一封','邮件']},
    {id:'l05_relay_04',starter:'结束',goal:'接一个“……了就……”短句。',mustUse:['音乐会','吃饭']}
  ],
  monopoly:{tasks:[
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：zhōngyú',answer:'终于'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：duànliàn',answer:'锻炼'},
    {kind:'yellow',title:'拼音写汉字 / Pinyin → Hanzi',prompt:'请根据拼音写出：yóujiàn',answer:'邮件'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“拍照”说一个短语。',answer:'喜欢拍照 / 拍照水平'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“收到”说一个短语。',answer:'收到邮件 / 收到照片'},
    {kind:'green',title:'组词 / Make a phrase',prompt:'请用“结束”说一个短语。',answer:'音乐会结束 / 下课结束'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'“张张都很好看”是什么意思？',options:['每张都好看','只有一张好看','没有照片好看'],answer:'每张都好看'},
    {kind:'blue',title:'选择 / Multiple Choice',prompt:'手机不能使用了，可以怎么说？',options:['手机没电了','手机终于到了','手机很感兴趣'],answer:'手机没电了'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“得很”说一句话。',answer:'今天天气好得很。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“飞来了”说一句话。',answer:'树上飞来了几只鸟。'},
    {kind:'red',title:'造句 / Make a sentence',prompt:'用“……了……就……”说一句话。',answer:'我下了课就去锻炼。'}
  ]}
};

const homework = {mode:'hsk3_session_tasks',instructions:{required:'完成照片项目的当次准备卡；最终口头作品在课堂完成。',optional:'不需要上传录音。A、B 保存的素材会用于 C 的课堂展示。',aiPolicy:'先独立选择照片和组织内容，再使用工具检查语言。'},sessionMeta:{
  A:{label:'照片项目 · 第1步',goal:'选择一种喜欢的休闲活动，准备照片或拍摄计划。',suggested_minutes:'10-15分钟',suggested_mix:'课后完成活动与照片计划卡；下次课两人交换建议。'},
  B:{label:'照片项目 · 第2步',goal:'选择最满意的照片并整理评价理由。',suggested_minutes:'10-15分钟',suggested_mix:'完成照片评价卡；课堂采用小组互评和抽样分享。'},
  C:{label:'课堂最终项目 · 我最满意的照片',goal:'选择一张或几张最满意的照片，说明为什么拍得好。',suggested_minutes:'15-20分钟',suggested_mix:'不上传录音；课堂先小组彩排，再抽样展示。'}
},sessions:{
  A:[
    {id:'post_l05_a_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'照片项目 1/3 · 选择活动',required:true,prompt_cn:'你最喜欢在哪儿、和谁一起做什么休闲活动？你有相关照片吗？',prompt_en:'Choose a free-time activity you enjoy. Where and with whom do you usually do it? Do you already have a related photo?',answerPlaceholder:'我喜欢……。我常常在……和……一起……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l05_a_plan',type:'project_card',taskLabel:'准备卡',projectStage:'照片项目 1/3 · 保存到最终展示',required:true,prompt_cn:'准备一张已有照片，或者写下你想拍的画面：地点、人物、活动和要准备的东西。',prompt_en:'Choose one existing photo or plan a photo you want to take. Note the place, people, activity and materials.',answerPlaceholder:'地点：……\n人物：……\n活动：……\n我要准备：……',needsTeacherReview:true,openEnded:true,wordBank:['终于','爬山','锻炼','照照片','运动鞋','大衣'],picturePrompts:['活动地点','照片中的人物','正在做的事','需要准备的物品'],scaffoldLevels:[{label:'基础层 / Support',instruction:'使用句框完成3句话。'},{label:'标准层 / Core',instruction:'写3—4句话，说明地点、人物、活动和准备。'},{label:'挑战层 / Challenge',instruction:'写5句话，加入天气、原因和“得很”。'}]},
    {id:'post_l05_a_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Photo Preparation',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: My Free-time Photo',prompt_en:'Prepare the material below for the next class.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one clear photo of a free-time activity, or a simple plan for a photo you want to take.','Be ready to answer: Where was it? Who was there? What were you doing?','Use at least three lesson words.','You may discuss it with a partner. No audio upload is required.'],classroomNote:'Bring the photo or plan to class. You do not need to upload an audio recording.'}
  ],
  B:[
    {id:'post_l05_b_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'照片项目 2/3 · 发现好照片',required:true,prompt_cn:'从你的照片中选一张最满意的。照片里有什么？你为什么喜欢它？',prompt_en:'Choose one photo you are most satisfied with. What can we see, and why do you like it?',answerPlaceholder:'我最满意……。照片里……。我喜欢它，因为……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l05_b_review',type:'project_card',taskLabel:'评价卡',projectStage:'照片项目 2/3 · 保存展示理由',required:true,prompt_cn:'完成照片评价卡：写出两个优点和一个可以改进的地方。',prompt_en:'Complete a photo review card: two strengths and one possible improvement.',answerPlaceholder:'优点1：……\n优点2：……\n可以改进：……\n所以我最满意……',needsTeacherReview:true,openEnded:true,wordBank:['拍照','感兴趣','张张都','难看','比较','水平','这样的照片才好看'],picturePrompts:['人物或主体','表情或动作','光线和背景','选择理由'],carryFrom:[{session:'A',taskId:'post_l05_a_plan',label:'A · 我的活动照片'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'从词语和句框中选择，完成3句话。'},{label:'标准层 / Core',instruction:'写4句话，说明两个优点并使用“才”或“张张都”。'},{label:'挑战层 / Challenge',instruction:'比较两张照片，使用“比较、水平、得很”等表达。'}]},
    {id:'post_l05_b_share',type:'showcase_plan',taskLabel:'课堂准备',projectStage:'下一次课 · Photo Review',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Preparation: Why This Photo Works',prompt_en:'Prepare to explain why your selected photo works well.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one to three photos you are satisfied with.','Be ready to identify the subject, action, expression, light or background.','Explain at least two reasons why the photo works well.','You may ask a partner for one short comment. No audio upload is required.'],classroomNote:'Save the photos for the final in-class presentation.'}
  ],
  C:[
    {id:'post_l05_c_context',type:'reflection_prompt',taskLabel:'任务起点',projectStage:'照片项目 3/3 · 组织展示',required:true,prompt_cn:'你准备展示一张还是几张照片？你希望同学先看到什么、最后记住什么？',prompt_en:'Will you present one photo or several photos? What should the class notice first, and what should they remember?',answerPlaceholder:'我准备展示……张照片。请大家先看……。我希望大家记住……。',needsTeacherReview:true,openEnded:true},
    {id:'post_l05_c_final',type:'portfolio_final',taskLabel:'最终展示稿',projectStage:'课堂大作业 · 我最满意的照片',required:true,prompt_cn:'选择一张或几张你最满意的照片，准备说明为什么拍得好。',prompt_en:'Choose one or several photos you are most satisfied with and prepare to explain why they were taken well.',answerPlaceholder:'这是我最满意的照片。\n照片里……。\n我觉得它拍得好，因为……。\n我还想说……。',needsTeacherReview:true,openEnded:true,wordBank:['拍照','感兴趣','张张都','比较','水平','太阳','树','收到','得很','……了……就……'],picturePrompts:['照片中的主体','自然的表情或动作','光线与背景','拍摄时发生的事','满意的理由'],carryFrom:[{session:'A',taskId:'post_l05_a_plan',label:'A · 活动与照片素材'},{session:'B',taskId:'post_l05_b_review',label:'B · 照片评价理由'}],scaffoldLevels:[{label:'基础层 / Support',instruction:'展示1张照片，用4个句框说清人物、地点、活动和一个优点。'},{label:'标准层 / Core',instruction:'展示1—3张照片，使用至少6个本课词和1个本课结构，说明两个拍得好的理由。'},{label:'挑战层 / Challenge',instruction:'比较几张照片，讲拍摄过程，并使用至少2个本课结构。'}]},
    {id:'post_l05_c_show',type:'classroom_showcase',taskLabel:'课堂展示',projectStage:'最终回收 · My Best Photo',displayOnly:true,submissionRequired:false,classroomOnly:true,prompt_cn:'Classroom Presentation: My Best Photo',prompt_en:'Choose one or several photos you are most satisfied with and explain why they were taken well.',presentationTitle:'What You Need to Prepare',presentationPlan:['Bring one to three photos you are most satisfied with. They may show your free-time activity, friends, travel or daily life.','Answer: What is in the photo? When and where was it taken? What happened? Why do you think it was taken well?','Use at least six lesson words and at least one structure such as 得很, 张张都, a place-appearance sentence, or ……了……就……。','Speak for 1–2 minutes. You may prepare in a small group, but every student must explain at least one photo or one reason.'],classroomNote:'Present mainly in class. You do not need to upload an audio recording.'}
  ]
}};

const lesson = {
  schemaVersion:'1.0.0',
  meta:{level:'HSK3',lessonId:'L05',lessonKey:'HSK3-L05',title:'这样的照片才好看',titleEn:'Photos like these are the best',topic:'休闲活动、照片评价与活动安排',courseModel:'三次课：晴天去爬山 → 选择满意的照片 → 拍照现场与音乐会邀请',sourceTextPolicy:'教材对话保持原意；教学扩展用于任务链和练习。'},
  pedagogy:{exerciseMix:{lessonMaxPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'主观任务提供支持、基础、挑战三档输出，要求每位组员参与表达。'},
  features:{pinyin:true,hanziWritingDemo:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},
  sessions:[
    {id:'A',title:'第一次课：晴天去爬山',textIds:['t_hsk3_l05_01'],previewMissionId:'pm_hsk3_l05_a',focus:['天气变化','户外活动与准备','程度补语“得很”']},
    {id:'B',title:'第二次课：选择满意的照片',textIds:['t_hsk3_l05_02'],previewMissionId:'pm_hsk3_l05_b',focus:['摄影兴趣与评价','量词重叠','说明照片为什么好']},
    {id:'C',title:'第三次课：拍照现场与音乐会邀请',textIds:['t_hsk3_l05_03','t_hsk3_l05_04'],previewMissionId:'pm_hsk3_l05_c',focus:['拍摄位置与突发情况','存现句','……了……就……']}
  ],
  vocabScenes:sceneData,vocabulary,grammar,texts,grammarTeachingNotes,textTeachingNotes,
  vocabExtensions:Object.fromEntries(vocabulary.map(v=>[v.id,{session:v.tags[0],phrases:v.phrases}])),
  previewMissions:previewSpecs.map(mission),
  preClass:{mode:'preview_mission',missionId:'pm_hsk3_l05_a',vocabularyIds:previewSpecs[0].words.map(h=>word(h).id),grammarIds:grammar.map(g=>g.id),readingData:[{id:'pre_l05_read',title:'我最满意的照片',text:'我最满意的是爬山时拍的照片。照片里的天气好得很，朋友的表情也很自然。'}]},
  inClass:{questionGroups:{
    v5_vocab_fill:fills,g1_ordering:orders,r2_passage_choice:readPassages,t2_task_card:taskCards,battleGames,scene_sentence_choice:sceneChoices,v7_word_match:matchGroups,v6_description_guess:guesses,v2_say_guess:sayGuess,v3_blind_box:blind,g2_picture_complete:pictureComplete,r3_independent_reading:independent,r4_paragraph_fill:paragraphs,t3_chain_sentence:chains,
    info_match:[
      {id:'l05_info_01',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each person with the action.',data:{people:['白家月','李文','王一雪','王一飞'],clues:['准备运动鞋和大衣','准备水和吃的','邀请朋友听音乐会','经常给姐姐照相'],answer:['白家月-准备运动鞋和大衣','李文-准备水和吃的','王一雪-邀请朋友听音乐会','王一飞-经常给姐姐照相']}},
      {id:'l05_info_02',type:'info_match',stage:'in_class',prompt_cn:'信息匹配。',prompt_en:'Match each scene with what happened.',data:{people:['街上','出租车上','山上','咖啡厅'],clues:['决定去爬山','比较照片','手机没电','发送音乐会邀请'],answer:['街上-决定去爬山','出租车上-比较照片','山上-手机没电','咖啡厅-发送音乐会邀请']}}
    ],
    pk_question:[['今天天气好____很。','得'],['这些照片____张都很好看。','张'],['树上飞____了几只鸟。','来']].map((x,i)=>({id:`l05_pk_0${i+1}`,type:'choice',prompt_cn:x[0],prompt_en:'Choose the word.',correct_answer:x[1],data:{question_cn:x[0],options:[x[1],'才','封','电'],correct_index:0}})),textQa:[],pictureTalk:[]
  }},
  postClassHomework:homework,
  report:{focus:['休闲活动词汇','程度补语','量词重叠','存现句','紧缩复句','照片评价'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务'],recommendationRules:[{if:'preClass<0.7',then:'重做对应五步预习并复习错词。'},{if:'inClass<0.7||postClass<0.7',then:'选择一张照片，用本课词语和结构重新说明。'}]}
};

fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
console.log(`Wrote ${out}`);
