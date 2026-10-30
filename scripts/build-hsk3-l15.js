const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..'),sourceRef='textbook data/HSK3/L15.txt',out=path.join(root,'source/data-model/lessons/HSK3-L15.json'),src=fs.readFileSync(path.join(root,sourceRef),'utf8'),img=n=>'images/hsk3-l15/'+n+'.png';
const esc=s=>s.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&'),part=(a,b)=>src.split(a)[1].split(b)[0];
const vocabBlock=part('### 生词：','**专有名词：**'),properBlock=part('**专有名词：**','---\n\n### 语法：');
const parseV=s=>[...s.matchAll(/^\d+\. (.+?) \| (.+?) \| (.+?) \| (.+)$/gm)].map(m=>({hanzi:m[1],pinyin:m[2],pos:m[3],english:m[4]}));
const rawV=[...parseV(vocabBlock),...parseV(properBlock)],groups={A:['蓝','段','附近','马路','平时','放学','游戏','老人','根据'],B:['了解','可是','以上','有名','景点','游客','外地','聊','南京'],C:['河','关系','养','黄河','西北','经过','草地','遇见']},under=['段','老人','以上','游客','养','黄河','西北'],context=['蓝'];
const simple={蓝:'像晴天天空一样的颜色',段:'数连续时间或距离的量词',附近:'离这里不远的地方',马路:'城市里让车和人通过的路',平时:'一般的时候',放学:'学校一天的课结束',游戏:'让人一起玩的活动',老人:'年纪大的人',根据:'把某个情况当作做事的理由',了解:'知道得比较清楚',可是:'表示后面的情况和前面不同',以上:'达到这个数量或更多',有名:'很多人知道',景点:'旅行时可以参观的地方',游客:'去别的地方旅行的人',外地:'不是这里的其他地方',聊:'轻松地说话',河:'水长期流过的地方',关系:'两个人或两件事之间的联系',养:'给人或动物生活需要的东西',西北:'西和北之间的方向',经过:'从一个地方通过',草地:'长着很多草的地方',遇见:'没有先约好而见到',南京:'中国东部的一座城市',黄河:'中国北方的一条大河'};
const vocabulary=rawV.map((v,i)=>({...v,id:'v15_'+String(i+1).padStart(2,'0'),tags:[Object.keys(groups).find(k=>groups[k].includes(v.hanzi))],tier:context.includes(v.hanzi)?'context':under.includes(v.hanzi)?'understanding':'expression',phrases:[v.hanzi+'相关表达','使用'+v.hanzi],phraseSourceType:'teaching_extension',example:src.match(new RegExp('[^。！？\\n]*'+esc(v.hanzi)+'[^。！？\\n]*[。！？]'))?.[0].trim()||'请用“'+v.hanzi+'”说一句话。',examplePinyin:'',exampleSourceType:'textbook',meaningCn:simple[v.hanzi],meaningCnSourceType:'teaching_extension',sourceType:'textbook',sourceRef,properNoun:i>=24}));
const byWord=Object.fromEntries(vocabulary.map(v=>[v.hanzi,v])); const card=w=>{const v=byWord[w];return {vocabularyId:v.id,hanzi:v.hanzi,pinyin:v.pinyin,english:v.english,phrases:v.phrases,example:v.example,examplePinyin:v.examplePinyin,tier:v.tier};};
const textSection=src.split('### 课文或对话：')[1],heads=[...textSection.matchAll(/^#### (.+)$/gm)];
const texts=heads.map((h,i)=>{const block=textSection.slice(h.index+(h[0].length),heads[i+1]?.index||textSection.length),setting=block.match(/> \*\*场景\*\*：(.+)/)?.[1]||'',lines=[];if(i<3){const re=/\*\*说话人\*\*：(.+)\n\*\*中文\*\*：(.+)\n\*\*拼音\*\*：(.+)\n\*\*英文\*\*：(.+)/g;for(const m of block.matchAll(re))lines.push({speaker:m[1],hanzi:m[2],pinyin:m[3],english:m[4],englishSourceType:'textbook'});}else{lines.push({speaker:'王一雪',hanzi:block.match(/\*\*中文\*\*：\s*\n(.+)/)?.[1]||'',pinyin:block.match(/\*\*拼音\*\*：\s*\n(.+)/)?.[1]||'',english:'',englishSourceType:'missing'});}return{id:'t_hsk3_l15_0'+(i+1),textId:i+1,title:['适合全家住的小区','半个南京人的旅行建议','黄河为什么重要','我最喜欢的河边'][i],titleSourceType:'teaching_extension',format:i===3?'diary':'dialogue',genre:i===3?'日记':'对话',setting,audio:null,audioStatus:'missing',plannedAudio:'../../audio/HSK3/15-'+(i*2+1)+'.mp3',sourceType:'textbook',sourceRef,lines};});
// Reparse textbook lines with CRLF-safe field boundaries.
texts.forEach((text,i)=>{
  const h=heads[i],block=textSection.slice(h.index+h[0].length,heads[i+1]?.index||textSection.length);
  if(i<3){
    text.lines=[...block.matchAll(/\*\*说话人\*\*：([^\r\n]+)\r?\n\*\*中文\*\*：([^\r\n]+)\r?\n\*\*拼音\*\*：([^\r\n]+)\r?\n\*\*英文\*\*：([^\r\n]+)/g)].map(m=>({speaker:m[1],hanzi:m[2],pinyin:m[3],english:m[4],hanziSourceType:'textbook',pinyinSourceType:'textbook',englishSourceType:'textbook'}));
  }else{
    text.lines=[{speaker:'王一雪',hanzi:block.match(/\*\*中文\*\*：\s*\r?\n([^\r\n]+)/)?.[1]||'',pinyin:block.match(/\*\*拼音\*\*：\s*\r?\n([^\r\n]+)/)?.[1]||'',english:'',hanziSourceType:'textbook',pinyinSourceType:'textbook',englishSourceType:'missing'}];
  }
});
// Add natural collocations and align each vocabulary example with its textbook line.
const collocations={
 蓝:['蓝天','蓝色'],段:['一段时间','一段路'],附近:['学校附近','住在附近'],马路:['过马路','马路对面'],平时:['平时喜欢','平时生活'],放学:['放学以后','放学时间'],游戏:['做游戏','电脑游戏'],老人:['帮助老人','老人的需要'],根据:['根据需要','根据地图'],
 了解:['了解情况','了解南京'],可是:['虽然……可是……','可是今天'],以上:['两年以上','十二岁以上'],有名:['很有名','有名的景点'],景点:['旅游景点','参观景点'],游客:['外地游客','游客很多'],外地:['外地人','从外地来'],聊:['聊一聊','边吃边聊'],
 河:['一条河','河边'],关系:['有关系','关系很大'],养:['养孩子','养动物'],西北:['西北边','中国西北'],经过:['经过这里','经过草地'],草地:['绿色草地','草地上'],遇见:['遇见朋友','偶然遇见'],南京:['南京人','南京老城'],黄河:['黄河边','黄河文化']
};
vocabulary.forEach(v=>{
 v.phrases=collocations[v.hanzi];
 const line=texts.flatMap(t=>t.lines).find(item=>item.hanzi.includes(v.hanzi));
 if(line){v.example=line.hanzi;v.examplePinyin=line.pinyin;}
});
const grammarTitles=['介词“根据”','数量重叠“数词+量词+数词+量词”','固定短语“在……看来”','固定短语“不一会儿”'],structures=['根据 + 依据/情况 + 行动或结果','数词 + 量词 + 数词 + 量词 +（地）+ 动词','在 + 人/群体 + 看来，+ 观点','不一会儿（就）+ 新情况'],extra=[['我们根据地图选择了最近的景点。','小区根据老人的需要增加了长椅。'],['游客三个三个地参观老城。','我一段一段地介绍这条河。'],['在游客看来，南京老街很有意思。','在孩子看来，河边草地是好地方。'],['我在树下坐了一会儿，不一会儿就不难过了。','我们边走边聊，不一会儿就到了河边。']];
const grammar=grammarTitles.map((title,i)=>{const start=src.indexOf((i+1)+'. **'),end=i<3?src.indexOf((i+2)+'. **'):src.indexOf('---\n\n### 课文');const b=src.slice(start,end),description=b.match(/\* \*\*说明\*\*：(.+)/)?.[1]||'',book=[...b.matchAll(/^\* (.+[。！？])$/gm)].map(m=>m[1]);const examples=[...book,...extra[i]].slice(0,5).map((hanzi,j)=>({hanzi,pinyin:'',english:'',sourceType:j<book.length?'textbook':'teaching_extension'}));return{id:'g15_0'+(i+1),title,titleEn:title,appliesTo:[i+1],scene:'观察真实语境中的目标结构。',sceneSourceType:'teaching_extension',structure:structures[i],structureSourceType:i===1?'textbook':'teaching_extension',explanation:description,explanationSourceType:'textbook',sourceType:'textbook',sourceRef,examples,editorialNote:i===2?'教材语法例句原文含“在我们中国看人看来”；课文原文为“在我们中国人看来”。两处均保留。':null};});const sceneNames=[['photo-text-1-community-talk',['附近','马路','平时','放学','游戏']],['photo-text-1-accessible-neighborhood',['蓝','段','老人','根据']],['photo-text-2-nanjing-advice',['了解','可是','南京','聊']],['photo-text-2-old-city-guide',['以上','有名','景点','游客','外地']],['photo-text-3-yellow-river-talk',['河','关系','黄河']],['photo-text-3-yellow-river-family',['河','养','黄河']],['photo-text-4-riverside-memory',['西北','经过','草地','遇见']],['photo-text-4-riverside-recovery',['经过','草地','遇见','河']]];
// Replace parser-derived grammar rows with audited bilingual examples.
const grammarExampleData=[
 {titleEn:'Preposition 根据',scene:'观察小区如何根据居民需要发生变化。',examples:[
  ['这几年小区根据他们的需要，有了很多变化。','Zhè jǐ nián xiǎoqū gēnjù tāmen de xūyào, yǒule hěn duō biànhuà.','In recent years, the community has changed a lot according to their needs.','textbook'],
  ['根据要求，我们必须参加明天的会议。','Gēnjù yāoqiú, wǒmen bìxū cānjiā míngtiān de huìyì.','According to the requirements, we must attend tomorrow’s meeting.','textbook'],
  ['老师根据每个学生的兴趣，选择了一样的书。','Lǎoshī gēnjù měi gè xuéshēng de xìngqù, xuǎnzé le yíyàng de shū.','The teacher chose the same book according to each student’s interests.','textbook'],
  ['我们根据地图选择了最近的景点。','Wǒmen gēnjù dìtú xuǎnzé le zuì jìn de jǐngdiǎn.','We chose the nearest scenic spot according to the map.','teaching_extension'],
  ['小区根据老人的需要增加了长椅。','Xiǎoqū gēnjù lǎorén de xūyào zēngjiā le chángyǐ.','The community added benches according to elderly residents’ needs.','teaching_extension']
 ]},
 {titleEn:'Reduplication of numeral-measure phrases',scene:'观察人们怎样成组行动或让变化逐步发生。',examples:[
  ['我得一点儿一点儿地给您讲。','Wǒ děi yìdiǎnr yìdiǎnr de gěi nín jiǎng.','I will have to explain it to you bit by bit.','textbook'],
  ['学生们的汉语水平一天一天地提高了。','Xuéshēngmen de Hànyǔ shuǐpíng yì tiān yì tiān de tígāo le.','The students’ Chinese level improved day by day.','textbook'],
  ['他们两个两个地走进去了。','Tāmen liǎng gè liǎng gè de zǒu jìnqu le.','They walked in two by two.','textbook'],
  ['游客三个三个地参观老城。','Yóukè sān gè sān gè de cānguān lǎochéng.','The tourists visited the old city in groups of three.','teaching_extension'],
  ['我一段一段地介绍这条河。','Wǒ yí duàn yí duàn de jièshào zhè tiáo hé.','I introduced the river section by section.','teaching_extension']
 ]}, {titleEn:'Set phrase 在……看来',scene:'观察不同人物怎样表达对黄河和城市的看法。',examples:[
  ['在我们中国看人看来，黄河像妈妈一样，养了我们几千年。','Zài wǒmen Zhōngguó kànrén kànlái, Huáng Hé xiàng māma yíyàng, yǎngle wǒmen jǐ qiān nián.','In the eyes of us Chinese, the Yellow River is like a mother and has nurtured us for thousands of years.','textbook'],
  ['在同事们看来，她工作非常认真。','Zài tóngshìmen kànlái, tā gōngzuò fēicháng rènzhēn.','In her colleagues’ eyes, she works very conscientiously.','textbook'],
  ['在我看来，每天读书是一种很好的习惯。','Zài wǒ kànlái, měitiān dúshū shì yì zhǒng hěn hǎo de xíguàn.','In my view, reading every day is a very good habit.','textbook'],
  ['在游客看来，南京老街很有意思。','Zài yóukè kànlái, Nánjīng lǎojiē hěn yǒuyìsi.','In tourists’ eyes, Nanjing’s old streets are interesting.','teaching_extension'],
  ['在孩子看来，河边草地是好地方。','Zài háizi kànlái, hébiān cǎodì shì hǎo dìfang.','In a child’s eyes, the riverside meadow is a good place.','teaching_extension']
 ]},
 {titleEn:'Set phrase 不一会儿',scene:'观察短时间以后人物、地点或心情怎样发生变化。',examples:[
  ['难过的事情不一会儿就忘了。','Nánguò de shìqing bù yíhuìr jiù wàng le.','The upsetting thing was forgotten before long.','textbook'],
  ['不一会儿，张校长就来了。','Bù yíhuìr, Zhāng xiàozhǎng jiù lái le.','Before long, Principal Zhang arrived.','textbook'],
  ['两个小时看起来长，但是不一会儿就过去了。','Liǎng gè xiǎoshí kàn qǐlai cháng, dànshì bù yíhuìr jiù guòqu le.','Two hours looks long, but it passes before you know it.','textbook'],
  ['我在树下坐了一会儿，不一会儿就不难过了。','Wǒ zài shù xià zuòle yíhuìr, bù yíhuìr jiù bù nánguò le.','I sat under the tree for a while and soon felt better.','teaching_extension'],
  ['我们边走边聊，不一会儿就到了河边。','Wǒmen biān zǒu biān liáo, bù yíhuìr jiù dào le hébiān.','We walked and chatted, and soon reached the river.','teaching_extension']
 ]}
];
grammar.forEach((item,i)=>{
 const audit=grammarExampleData[i];
 item.titleEn=audit.titleEn;
 item.scene=audit.scene;
 item.examples=audit.examples.map(row=>({hanzi:row[0],pinyin:row[1],english:row[2],sourceType:row[3],hanziSourceType:row[3],pinyinSourceType:'teaching_extension',englishSourceType:'teaching_extension'}));
});
const vocabSceneTasks=[
 {title:'小区附近的生活和交通',prompt:'小区附近有哪些生活设施？过马路方便吗？这里适合有孩子的家庭吗？为什么？',promptEn:'What living facilities are nearby? What is the traffic like, and would this place suit a family with children?',talkHint:'先找超市、马路和儿童活动区，再说明适合谁。',sampleAnswers:['小区附近有超市和儿童活动区，过马路就可以买东西。','这里适合有孩子的家庭，因为孩子放学后可以在树下做游戏。']},
 {title:'根据居民需要改造小区',prompt:'小区根据老人的哪些需要做了什么改变？这些变化还适合哪些人？',promptEn:'What changes were made for older residents, and who else benefits from them?',talkHint:'观察长椅、平路、树荫和老人活动区。',sampleAnswers:['小区根据老人的需要增加了长椅和安全的步行空间。','这些变化也适合带孩子的家庭。']},
 {title:'先问兴趣再给南京建议',prompt:'游客对什么感兴趣？你会先问哪两个问题，再推荐什么地方？',promptEn:'What is the visitor interested in? Ask two questions before recommending places in Nanjing.',talkHint:'先问历史、自然或当地生活，再给建议。',sampleAnswers:['你喜欢历史景点还是自然风景？你有多长时间？','如果你喜欢历史，我推荐南京老城和博物馆。']},
 {title:'给外地游客介绍老城',prompt:'外地游客正在参观什么地方？这里哪些景点有名？为什么值得去？',promptEn:'What is the visitor exploring, which places are famous, and why are they worth visiting?',talkHint:'观察城门、老街、导览图和游客路线。',sampleAnswers:['外地游客正在参观南京老城和老街。','这些地方很有名，可以了解南京的历史和当地生活。']},
 {title:'黄河的名字和重要性',prompt:'这是什么河？它的名字跟什么有关系？在中国人看来，它为什么重要？',promptEn:'Which river is this, what is its name connected with, and why is it important?',talkHint:'先说颜色和名字，再说黄河与生活的关系。',sampleAnswers:['这是黄河，它的名字跟河水的颜色有关系。','在中国人看来，黄河像妈妈一样，养了人们几千年。']},
 {title:'黄河与人们的生活',prompt:'黄河和人们的生活有什么关系？课文用什么比喻说明它的意义？',promptEn:'How is the Yellow River connected with people’s lives, and what comparison explains its meaning?',talkHint:'观察河流、农田、家庭和生活用水。',sampleAnswers:['以前很多人住在黄河边，黄河和他们的生活关系很大。','课文把黄河比作妈妈。']},
 {title:'小时候的河边生活',prompt:'作者小时候住在哪里？河边有什么？她夏天常在那里做什么？',promptEn:'Where did the writer live, what was by the river, and what did she do there in summer?',talkHint:'观察西北方向、草地、花、河水和儿童活动。',sampleAnswers:['作者小时候住在北京西北边。','河边有草地、花和河水，她夏天常去河里游泳。']},
 {title:'长大后再到河边',prompt:'作者长大后什么时候去河边？她在那里做什么？为什么不一会儿就不难过了？',promptEn:'When does the writer return, what does she do there, and why does she soon feel better?',talkHint:'观察散步、听鸟叫、看河水和朋友聊天。',sampleAnswers:['她不高兴的时候会去河边走走，听鸟叫、看河水。','她也会遇见朋友聊天，所以难过的事情不一会儿就忘了。']}
];
const vocabScenes=Object.fromEntries([1,2,3,4].map(n=>[String(n),{
 title:'课文'+n+'词汇场景',
 steps:sceneNames.slice((n-1)*2,n*2).map((s,j)=>{const index=(n-1)*2+j,task=vocabSceneTasks[index];return{id:'l15_vocab_scene_t'+n+'_0'+(j+1),title:task.title,image:img(s[0]),prompt:task.prompt,promptPinyin:'',promptEn:task.promptEn,talkHint:task.talkHint,words:s[1].map(card),labels:s[1].slice(0,3).map((w,i)=>({text:w,x:20+i*25,y:40+i*8})),sampleAnswers:task.sampleAnswers,sourceType:'teaching_extension'};})
}]));
const gImgs=['photo-text-1-accessible-neighborhood','photo-text-2-old-city-guide','photo-text-3-yellow-river-family','photo-text-4-riverside-recovery'];
const grammarTeachingNotes=Object.fromEntries(grammar.map((g,i)=>[g.id,{presentationMode:'progressive_grammar',mergeNoticeObserve:true,observeMode:'structure_rows',scene:g.scene,observePrompt:'观察目标结构的组成和意义。',observeHighlights:g.examples.map(e=>e.hanzi.split(/[，。]/).filter(Boolean).slice(0,3)),examples:[...g.examples],visualLearning:{leadExamples:[g.examples[0]],blocks:g.structure.split('+').map(x=>x.trim()),blockLabelsEn:['cue','basis','action','result']},oralQuestions:[{question:'请联系自己的生活使用这个结构。',pinyin:''},{question:'图片里可以怎样使用这个结构？',pinyin:''},{question:'换一个人物或地点再说一次。',pinyin:''}],structureVariants:[{label:'基本结构',formula:g.structure,formulaEn:g.structure,explanation:g.explanation,example:g.examples[0].hanzi,examplePinyin:g.examples[0].pinyin}],followUp:[{image:img(gImgs[i]),promptEn:'Use the target structure to describe the image.',target:'使用目标结构完成一个中文句子。',sampleAnswer:g.examples[4].hanzi,samplePinyin:g.examples[4].pinyin}],editorialNote:g.editorialNote||null,sourceType:'teaching_extension'}]));
const overall=(id,q,opts)=>({id,focus:'main_idea',question:q,pinyin:'',options:opts,correctIndex:0,answer:opts[0],sourceType:'teaching_extension'}),detail=(id,q,a,p)=>({id,question:q,questionCn:q,pinyin:'',questionPinyin:'',answer:a,answerPinyin:'',acceptedAnswers:[a],informationPoint:p,sourceType:'teaching_extension'});
const textSpecs=[
['小区环境和家庭需要',['小区环境和家庭需要','南京旅行','黄河历史'],[['附近买东西方便吗？','方便，过马路就是超市。','附近购物'],['孩子们在哪儿玩？','在树下做游戏。','儿童活动'],['为什么买大房子？','让爸妈一起住。','购房原因'],['哪类居民多？','老人多。','居民构成'],['变化根据什么？','根据老人的需要。','变化依据']],['g15_01'],'l15_para_01','T1'],
['南京旅行建议',['南京旅行建议','社区买房','河边记忆'],[['谁更了解南京？','杨同乐。','人物经验'],['南京有多久历史？','两千年以上。','历史'],['有什么景点？','老城、老街和有名景点。','旅游资源'],['还想知道什么？','外地人不知道的地方。','信息需求'],['下班后做什么？','边吃边聊。','后续安排']],['g15_02'],'l15_para_02','T2'],
['黄河的名字和意义',['黄河的名字和意义','南京老街','小区环境'],[['名字跟什么有关？','跟颜色有关。','名称'],['河水什么颜色？','黄色。','颜色'],['是最长的河吗？','不是。','判断'],['以前人们住哪里？','黄河边。','历史'],['像妈妈说明什么？','养了人们几千年。','文化比喻']],['g15_03'],'l15_para_03','T3'],
['最喜欢的河边',['最喜欢的河边','南京旅行','小区买房'],[['小时候住哪里？','北京西北边。','位置'],['河边有什么？','大树、草地、花和河水。','景物'],['夏天做什么？','去河里游泳。','活动'],['长大后去河边做什么？','听鸟叫、看河水、跟朋友聊天。','情绪调节'],['难过最后怎样？','不一会儿就忘了。','结果']],['g15_04'],'l15_para_04','T4']];
const textApplicationSpecs=[
 {personalPrompt:'介绍附近的生活设施、交通特点，并说明这里适合什么人居住。',keyPoints:[['附近','fùjìn','说明位置和周边设施'],['根据','gēnjù','说明设计或判断的依据'],['适合……居住','shìhé … jūzhù','说明适合的人群']],culture:{title:'联系生活：什么样的小区适合居住？',titleEn:'What makes a neighborhood suitable?',questions:['你家附近有哪些生活设施？','那里的交通有什么特点？','这里适合什么人居住？为什么？'],background:'从生活设施、交通和居民需要三个方面比较居住环境。',wordCards:[['生活设施','shēnghuó shèshī','living facilities'],['交通特点','jiāotōng tèdiǎn','transportation features'],['适合居住','shìhé jūzhù','suitable to live in']],samples:['我家附近有超市、公园和医院。','这里交通方便，适合老人和有孩子的家庭居住。']},retell:{nodes:[['位置','小区在哪里？'],['设施','附近有什么？'],['交通','出行方便吗？'],['居民','适合谁住？'],['依据','为什么适合？']],frame:'这个小区在……。附近有……。交通……。这里适合……居住，因为……。'}},
 {personalPrompt:'先问问游客的兴趣，再推荐两个地方，并分别说明为什么推荐。',keyPoints:[['了解兴趣','liǎojiě xìngqù','先提问再推荐'],['一点儿一点儿','yìdiǎnr yìdiǎnr','有顺序地介绍'],['推荐……因为……','tuījiàn … yīnwèi …','给出地点和理由']],culture:{title:'联系生活：怎样给游客推荐地方？',titleEn:'How do you recommend places to a visitor?',questions:['游客对什么感兴趣？','你会推荐哪两个地方？','为什么推荐这两个地方？'],background:'先了解游客的兴趣和时间，再给出有针对性的推荐。',wordCards:[['问兴趣','wèn xìngqù','ask about interests'],['推荐地方','tuījiàn dìfang','recommend places'],['说明理由','shuōmíng lǐyóu','give reasons']],samples:['你喜欢历史、自然还是当地生活？','我推荐老城和博物馆，因为可以了解南京的历史。']},retell:{nodes:[['游客','谁来旅游？'],['兴趣','先问什么？'],['地方一','推荐哪里？'],['地方二','还推荐哪里？'],['理由','为什么推荐？']],frame:'我先问游客……。如果他喜欢……，我推荐……和……，因为……。'}},
 {personalPrompt:'请介绍一下你了解的“黄河”。',keyPoints:[['黄河','Huáng Hé','说出名称和位置'],['在……看来','zài … kànlai','表达群体观点'],['关系很大','guānxi hěn dà','说明黄河和生活的关系']],culture:{title:'联系文化：我了解的黄河',titleEn:'What I know about the Yellow River',questions:['黄河为什么叫“黄河”？','黄河经过哪些地方？','黄河为什么对中国人很重要？'],background:'从名称、位置、历史和生活意义介绍黄河。',wordCards:[['河水颜色','héshuǐ yánsè','color of the water'],['生活关系','shēnghuó guānxi','connection with life'],['文化意义','wénhuà yìyì','cultural meaning']],samples:['黄河的名字跟河水的颜色有关系。','在很多中国人看来，黄河像妈妈一样养育了人们。']},retell:{nodes:[['名称','为什么叫黄河？'],['位置','经过哪里？'],['事实','是不是最长的河？'],['历史','以前人们住在哪里？'],['意义','为什么重要？']],frame:'黄河……。它经过……。以前……。在很多中国人看来，黄河……。'}},
 {personalPrompt:'讲一个你最喜欢的地方，说明为什么喜欢，并讲一个你和这个地方的故事。',keyPoints:[['最喜欢的地方','zuì xǐhuan de dìfang','明确地点'],['不一会儿','bù yíhuìr','推进故事或说明变化'],['我和这个地方','wǒ hé zhège dìfang','讲个人经历']],culture:{title:'联系生活：我最喜欢的地方',titleEn:'My favorite place',questions:['你最喜欢的地方在哪里？','你为什么喜欢那里？','你和这个地方有什么故事？'],background:'把地点、原因和个人经历连成一个完整的地方故事。',wordCards:[['最喜欢的地方','zuì xǐhuan de dìfang','favorite place'],['喜欢的原因','xǐhuan de yuányīn','reason for liking it'],['我的故事','wǒ de gùshi','my story']],samples:['我最喜欢家附近的河边，因为那里很安静。','小时候我常和爷爷去那里；长大后再去，我还会想起那些下午。']},retell:{nodes:[['地点','在哪里？'],['景物','那里有什么？'],['原因','为什么喜欢？'],['以前','发生过什么？'],['现在','现在有什么感受？']],frame:'我最喜欢……。那里有……。我喜欢它，因为……。以前我……。现在……。'}}
];
const textTeachingNotes=Object.fromEntries(texts.map((t,i)=>{const s=textSpecs[i],app=textApplicationSpecs[i],oc=[overall('l15_t'+(i+1)+'_overall_01','课文主要谈什么？',s[1]),overall('l15_t'+(i+1)+'_overall_02','事情最后怎样发展？',['人物得到需要的信息或产生变化','没有任何变化','换了完全不同的话题']),overall('l15_t'+(i+1)+'_overall_03','这篇课文的交际目的是什么？',['介绍、解释或表达观点','只读生词','只问时间'])],ds=s[2].map((x,j)=>detail('l15_t'+(i+1)+'_detail_0'+(j+1),x[0],x[1],x[2]));const n={presentationMode:'listen_first_progressive',studentVisibleStages:['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],listenPrompt:'原音频待导入，请先阅读并判断大意。',audioStatus:'missing',preReadingQuestions:[{question:'你对这个主题知道什么？',pinyin:''},{question:'你会怎样联系自己的生活？',pinyin:''}],overallChoices:oc,details:ds,keyPoints:app.keyPoints.map(x=>({hanzi:x[0],pinyin:x[1],note:x[2]})),cultureDiscussion:{title:app.culture.title,titleEn:app.culture.titleEn,questions:app.culture.questions,background:app.culture.background,wordCards:app.culture.wordCards.map(x=>({hanzi:x[0],pinyin:x[1],english:x[2]})),sampleAnswers:app.culture.samples.map(hanzi=>({hanzi,pinyin:''})),sourceType:'teaching_extension'},retellScaffold:{nodes:app.retell.nodes.map(x=>({label:x[0],hint:x[1]})),frame:app.retell.frame,promptEn:'Retell the text with the five prompts, then connect it to your own life.',sourceType:'teaching_extension'},languageAndApplication:{grammarIds:s[3],personalPrompt:app.personalPrompt,paragraphPracticeId:s[4],miniId:s[5]},sourceType:'teaching_extension'};n.overallChoice=oc;n.classQuestions=ds;return[t.id,n];}));const sessions=[{id:'A',title:'第一次课：适合谁住的小区',textIds:[texts[0].id],previewMissionId:'pm_hsk3_l15_a',communicativeGoal:'介绍居住地的位置、环境与家庭需要。',grammarIds:['g15_01'],sourceType:'teaching_extension'},{id:'B',title:'第二次课：半个本地人的推荐',textIds:[texts[1].id],previewMissionId:'pm_hsk3_l15_b',communicativeGoal:'请求旅行建议并说明推荐理由。',grammarIds:['g15_02'],sourceType:'teaching_extension'},{id:'C',title:'第三次课：河流文化与地方记忆',textIds:[texts[2].id,texts[3].id],previewMissionId:'pm_hsk3_l15_c',communicativeGoal:'从文化观点和个人记忆讲地方故事。',grammarIds:['g15_03','g15_04'],sourceType:'teaching_extension'}];
const previewSpecs={
 A:{title:'第一次课课前热身赛',titleEn:'Who Should Live in This Neighborhood?',photo:'photo-text-1-accessible-neighborhood',contexts:[
  ['我家____有一家超市，买东西很方便。','附近',['附近','外地','西北','以上']],
  ['孩子们____以后常在树下做游戏。','放学',['放学','经过','了解','遇见']],
  ['过____时要先看红绿灯。','马路',['马路','草地','景点','黄河']],
  ['小区____老人的需要增加了长椅。','根据',['根据','可是','关系','以上']],
  ['我____走路去学校，周末才坐车。','平时',['平时','不一会儿','外地','一段']]
 ]},
 B:{title:'第二次课课前热身赛',titleEn:'Advice from Half a Local',photo:'photo-text-2-old-city-guide',contexts:[
  ['我想先____一下南京的历史。','了解',['了解','遇见','经过','放学']],
  ['南京有很多____的景点。','有名',['有名','外地','以上','西北']],
  ['很多____来这里看老城和老街。','游客',['游客','老人','游戏','关系']],
  ['我住在____两年，可以给你一些建议。','南京',['南京','黄河','草地','马路']],
  ['我们下班后边吃边____旅行计划吧。','聊',['聊','养','根据','经过']]
 ]},
 C:{title:'第三次课课前热身赛',titleEn:'A River and My Place Story',photo:'photo-text-3-yellow-river-family',contexts:[
  ['____和很多中国人的生活关系很大。','黄河',['黄河','南京','马路','草地']],
  ['小时候，我家住在北京____边。','西北',['西北','附近','外地','以上']],
  ['河边有大树、花和一大片____。','草地',['草地','马路','景点','游戏']],
  ['我每天上学都要____这条河。','经过',['经过','了解','放学','遇见']],
  ['在我看来，这条河____了很多人。','养',['养','聊','可是','根据']]
 ]}
};
function previewMeaningQuestion(id,w,ws){
 const distractors=ws.filter(x=>x.id!==w.id).slice(0,3).map(x=>x.meaningCn);
 return{id,question:'“'+w.hanzi+'”最接近哪个意思？',questionEn:'Choose the best meaning.',options:[w.meaningCn,...distractors],correctIndex:0,answer:w.meaningCn,sourceType:'teaching_extension'};
}
const previewMissions=sessions.map(s=>{
 const ws=vocabulary.filter(v=>v.tags[0]===s.id),spec=previewSpecs[s.id],lower=s.id.toLowerCase(),key='pre_l15_'+lower;
 const contextQuestions=spec.contexts.map((row,i)=>({id:key+'_ctx_'+String(i+1).padStart(2,'0'),question:row[0],questionEn:'Choose the word that completes the sentence.',options:row[2],correctIndex:row[2].indexOf(row[1]),answer:row[1],sourceType:'teaching_extension'}));
 return{id:'pm_hsk3_l15_'+lower,session:s.id,pilotMode:'ranked_vocab_preview_v1',title:spec.title,titleEn:spec.titleEn,subtitleEn:'Five stages prepare you for the next classroom task.',scenario:spec.titleEn,goals:[s.communicativeGoal,'Recognize and match the key expressions.','Complete a 10-question scored challenge.'],storyIntro:'完成五个Stage，准备在课堂上用完整句子表达。',storyIntroEn:'Learn the words and expressions needed for the next classroom task. The complete textbook text stays for class.',storyRole:'Prepare a real place story.',sourceType:'teaching_extension',stages:[
  {id:key+'_01',order:1,title:'认识词语、短语和背景',titleEn:'Meet the Words',interactionType:'study_list',photos:[{src:'../in-class/'+img(spec.photo),label:spec.titleEn}],keywordCards:ws.map(v=>({...card(v.hanzi),sourceType:'teaching_extension'})),sourceType:'teaching_extension'},
  {id:key+'_02',order:2,title:'认读与词义选择',titleEn:'Recognition',interactionType:'practice_quiz',questions:ws.slice(0,4).map((w,i)=>previewMeaningQuestion(key+'_rec_'+String(i+1).padStart(2,'0'),w,ws)),sourceType:'teaching_extension'},
  {id:key+'_03',order:3,title:'中英文匹配',titleEn:'Chinese-English Match',interactionType:'timed_match',pairs:ws.slice(0,5).map((v,i)=>({id:key+'_pair_'+String(i+1).padStart(2,'0'),word:v.hanzi,meaning:v.english,sourceType:'teaching_extension'})),sourceType:'teaching_extension'},
  {id:key+'_04',order:4,title:'语境判断与填空',titleEn:'Context Check',interactionType:'practice_quiz',questions:contextQuestions,sourceType:'teaching_extension'},
  {id:key+'_05',order:5,title:'有分数的最终挑战',titleEn:'Scored Challenge',interactionType:'ranked_quiz',questions:Array.from({length:10},(_,i)=>previewMeaningQuestion(key+'_ch_'+String(i+1).padStart(2,'0'),ws[i%ws.length],ws.slice(i%ws.length).concat(ws.slice(0,i%ws.length)))),sourceType:'teaching_extension'}
 ],reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],persistenceKeyPattern:'ClassReadyPreview_HSK3-L15_'+s.id+'_{student}_v1',completionMessageEn:'Preview complete. Bring one useful sentence to class.'};
});
let ri=0,roles=['lesson','lesson','lesson','lesson','lesson','transfer','transfer','transfer','review','review'],tag=x=>({...x,contentRole:roles[ri++%10],sourceType:'teaching_extension'}),choice=(id,p)=>tag({id,type:'choice',prompt_cn:p,prompt_en:'Choose.',correct_answer:'正确答案',data:{question_cn:p,options:['正确答案','干扰项A','干扰项B'],correct_index:0}}),open=(id,p)=>tag({id,type:'open_response',prompt_cn:p,prompt_en:'Respond in Chinese.',openEnded:true,needsTeacherReview:true,data:{answerPlaceholder:'写一个完整中文句子。'}});
const questionGroups={};
questionGroups.v5_vocab_fill=Array.from({length:3},(_,g)=>tag({id:'l15_fill_0'+(g+1),type:'vocab_fill_group',data:{wordBank:vocabulary.slice(g*5,g*5+5).map(v=>v.hanzi),sentences:Array.from({length:5},(_,i)=>({id:'l15_fill_'+g+'_'+i,sentence:'请用目标词完成第'+(i+1)+'个真实语境。',answer:vocabulary[g*5+i].hanzi}))}}));
questionGroups.v7_word_match=Array.from({length:3},(_,g)=>tag({id:'l15_match_0'+(g+1),type:'question_answer_match',data:{pairs:Array.from({length:5},(_,i)=>({id:'l15_match_'+g+'_'+i,left:vocabulary[g*5+i].hanzi,right:vocabulary[g*5+i].meaningCn}))}}));
questionGroups.g1_ordering=['小区根据老人的需要增加了长椅。','我一点儿一点儿介绍南京。','在我看来这条河很重要。','不一会儿我们就到了河边。','游客两个两个地走进老城。'].map((a,i)=>tag({id:'l15_order_0'+(i+1),type:'sentence_order',correct_answer:a,data:{chunks:a.replace('。','').split(' '),answer:a}}));
questionGroups.scene_sentence_choice=Array.from({length:10},(_,i)=>choice('l15_scene_'+String(i+1).padStart(2,'0'),'选择符合L15语境的句子'+(i+1)+'。'));
questionGroups.v6_description_guess=vocabulary.slice(0,10).map((v,i)=>tag({id:'l15_guess_0'+(i+1),type:'description_guess',prompt_cn:v.meaningCn,correct_answer:v.hanzi,data:{description:v.meaningCn,options:[v.hanzi,'游客','草地']}}));
questionGroups.v2_say_guess=sceneNames.map((s,i)=>open('l15_say_0'+(i+1),'根据第'+(i+1)+'张图说一说、猜一猜。'));
questionGroups.v3_blind_box=Array.from({length:4},(_,i)=>open('l15_blind_0'+(i+1),'使用两个目标表达完成盲盒造句。'));
questionGroups.g2_picture_complete=sceneNames.map((s,i)=>open('l15_picture_0'+(i+1),'看图使用关键词造句：'+s[1].slice(0,2).join('、')));
questionGroups.r2_passage_choice=Array.from({length:5},(_,i)=>tag({id:'l15_read_0'+(i+1),type:'passage_reading',data:{title:'L15短文'+(i+1),passage:'根据本课主题阅读一段完整地方故事。',questions:Array.from({length:3},(_,j)=>({id:'l15_read_'+i+'_q'+j,question_cn:'理解题'+(j+1),options:['正确答案','干扰项A','干扰项B'],correct_index:0,answer:'正确答案'}))}}));
questionGroups.r3_independent_reading=Array.from({length:5},(_,i)=>choice('l15_ind_read_0'+(i+1),'独立阅读理解题'+(i+1)+'。'));
questionGroups.r4_paragraph_fill=Array.from({length:5},(_,i)=>tag({id:'l15_para_0'+(i+1),type:'paragraph_fill',data:{title:'L15段落'+(i+1),passageParts:['使用三个本课表达完成连贯段落。'],options:['根据','景点','不一会儿'],answers:[0,1,2]}}));
questionGroups.t3_chain_sentence=Array.from({length:5},(_,i)=>open('l15_chain_0'+(i+1),'五词故事接龙'+(i+1)+'。'));
questionGroups.t2_task_card=['适合谁住的小区','半个本地人推荐','一条河的意义','我最喜欢的地方','我的地方故事'].map((t,i)=>open('l15_task_0'+(i+1),'任务卡：'+t+'。'));
questionGroups.pk_question=Array.from({length:3},(_,i)=>choice('l15_pk_0'+(i+1),'L15语法挑战'+(i+1)+'。'));questionGroups.info_match=[];questionGroups.textQa=[];questionGroups.pictureTalk=[];
questionGroups.battleGames={roulette:Array.from({length:8},(_,i)=>({id:'l15_game_roulette_0'+(i+1),prompt:'完成L15口语任务'+(i+1)})),relay:Array.from({length:4},(_,i)=>({id:'l15_game_relay_0'+(i+1),starter:'地方故事开始……',keywords:['根据','景点','河']})),monopoly:{theme:'light',boardShape:'winding',tasks:Array.from({length:16},(_,i)=>({id:'l15_game_monopoly_'+String(i+1).padStart(2,'0'),type:['vocabulary','grammar','text','task'][i%4],prompt:'L15棋盘任务'+(i+1)}))}};const preClass={mode:'preview_mission',missionId:'pm_hsk3_l15_a',vocabularyIds:vocabulary.map(v=>v.id),grammarIds:grammar.map(g=>g.id),progressIsolation:{keyFields:['lesson','session','student','contentVersion'],contentVersion:'HSK3-L15-v1'},reportFields:['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt']};
// Every remaining exercise override below is classroom-usable and keeps the textbook facts separate from teaching extensions.
const realChoice=(id,p,options,answerIndex=0)=>tag({id,type:'choice',prompt_cn:p,prompt_en:'Choose the best answer.',correct_answer:options[answerIndex],data:{question_cn:p,options,correct_index:answerIndex,answer:options[answerIndex]}});
const realOpen=(id,p,data)=>tag({id,type:'open_response',prompt_cn:p,prompt_en:'Respond in complete Chinese.',openEnded:true,needsTeacherReview:true,data:{answerPlaceholder:'请写一个完整、自然的中文句子。',...data}});
questionGroups.v5_vocab_fill=[
  [['附近','马路','平时','放学','游戏'],[['我家____有一家很安静的书店。','附近'],['过____时要先看红绿灯。','马路'],['我____坐地铁去学校。','平时'],['孩子们下午四点半____。','放学'],['周末我们常在草地上做____。','游戏']]],
  [['蓝','段','老人','根据','了解'],[['今天的天空特别____。','蓝'],['请读课文第一____。','段'],['这把椅子是给____准备的。','老人'],['请____天气选择衣服。','根据'],['我想多____一下南京的历史。','了解']]],
  [['可是','南京','聊','以上','有名'],[['我想去，____今天没有时间。','可是'],['我在____住过两年。','南京'],['我们坐下来____一聊旅行计划吧。','聊'],['十二岁____的孩子可以买成人票。','以上'],['这家饭店在当地很____。','有名']]]
].map((row,g)=>tag({id:'l15_fill_0'+(g+1),type:'vocab_fill_group',data:{wordBank:row[0],sentences:row[1].map((x,i)=>({id:'l15_fill_'+g+'_'+i,sentence:x[0],answer:x[1]}))}}));
questionGroups.v7_word_match=[
 {title:'课文1和课文2问答',pairs:[
  ['小区附近买东西方便吗？','方便，过马路就是超市。'],['孩子们放学后常在哪里做游戏？','在小区的树下。'],['小区的变化根据什么？','根据老人的需要。'],['给游客建议前应该先问什么？','先问他的兴趣和时间。'],['如果游客喜欢历史，可以推荐哪里？','可以推荐老城和博物馆。']
 ]},
 {title:'课文3和课文4问答',pairs:[
  ['黄河的名字跟什么有关系？','跟河水的颜色有关系。'],['黄河是中国最长的河吗？','不是。'],['以前很多人住在哪里？','住在黄河边。'],['课文为什么把黄河比作妈妈？','因为它养育了人们几千年。'],['作者为什么喜欢那条河？','那里有她小时候和长大后的记忆。']
 ]},
 {title:'联系生活问答',pairs:[
  ['介绍居住地要说哪三个方面？','生活设施、交通特点和适合居住的人。'],['怎样了解游客的需要？','先问他的兴趣和时间。'],['推荐两个地方以后还要说什么？','说明推荐每个地方的理由。'],['介绍黄河可以说哪些内容？','名称、位置、历史和生活意义。'],['讲最喜欢的地方要加入什么？','喜欢的原因和自己的故事。']
 ]}
].map((group,g)=>tag({id:'l15_match_0'+(g+1),type:'question_answer_match',prompt_cn:'把问题和合适的回答配对。',prompt_en:'Match each question with its answer.',data:{title:group.title,interaction:'free_pair_then_submit',neutralBeforeSubmit:true,allowUndo:true,submitAll:true,pairs:group.pairs.map((pair,i)=>({id:'l15_match_'+g+'_'+i,left:pair[0],right:pair[1]}))}}));
questionGroups.g1_ordering=[
 ['小区','根据','老人的需要','增加了','长椅','。'],['我','一点儿一点儿地','介绍','南京','。'],['在我看来','这条河','很重要','。'],['不一会儿','我们','就到了','河边','。'],['游客','两个两个地','走进','老城','。']
].map((chunks,i)=>tag({id:'l15_order_0'+(i+1),type:'sentence_order',correct_answer:chunks.join(''),data:{chunks,answer:chunks.join('')}}));
questionGroups.scene_sentence_choice=[
 ['哪一句最适合介绍学校附近？',['学校附近有地铁站和两家超市。','学校可是附近。','地铁站根据学校。']],
 ['哪一句说明设计考虑了老人？',['小区根据老人的需要增加了长椅。','老人根据小区了。','长椅需要可是。']],
 ['怎样慢慢介绍一座城市？',['我想一点儿一点儿地给你介绍。','我想一点儿城市。','城市两个介绍。']],
 ['怎样询问南京的知名景点？',['南京有哪些有名的景点？','南京景点可是？','有名根据南京？']],
 ['怎样表达个人看法？',['在我看来，住在这里很方便。','看来在我方便。','我看住很在。']],
 ['怎样说明黄河的重要性？',['黄河和很多人的生活关系很大。','黄河关系老人。','生活很黄河。']],
 ['怎样描述很快到达？',['不一会儿，我们就走到了河边。','一会儿不我们。','河边经过不。']],
 ['怎样描述成对行动？',['学生们两个两个地走进教室。','学生两个地教室。','教室根据学生。']],
 ['哪一句适合给游客建议？',['如果你喜欢历史，可以去老城看看。','游客草地以上。','历史可是景点。']],
 ['哪一句适合讲过去的经历？',['小时候，我常和爷爷在河边散步。','小时候关系河。','爷爷根据散步。']]
].map((row,i)=>realChoice('l15_scene_'+String(i+1).padStart(2,'0'),row[0],row[1]));
const sayRows=[
 ['附近','photo-text-1-community-talk',['马路','平时','超市'],'这个地方附近有什么？'],
 ['根据','photo-text-1-accessible-neighborhood',['老人','需要','长椅'],'小区根据谁的需要做了什么？'],
 ['南京','photo-text-2-nanjing-advice',['了解','景点','游客'],'游客想了解什么？'],
 ['景点','photo-text-2-old-city-guide',['有名','外地','老城'],'你会给外地游客什么建议？'],
 ['黄河','photo-text-3-yellow-river-talk',['河','关系','在我看来'],'这条河为什么重要？'],
 ['关系','photo-text-3-yellow-river-family',['河','养','生活'],'河给人们带来了什么？'],
 ['草地','photo-text-4-riverside-memory',['西北','经过','河边'],'他们经过了什么地方？'],
 ['遇见','photo-text-4-riverside-recovery',['不一会儿','河边','朋友'],'他们后来遇见了什么？']
];
questionGroups.v2_say_guess=sayRows.map((r,i)=>realOpen('l15_say_0'+(i+1),'说一说、猜一猜：不要直接说出词语。',{target:r[0],pinyin:byWord[r[0]]?.pinyin||'',image:img(r[1]),scaffold:{words:r[2],frames:['这是一个……。','我们可以用它说……。']},task:r[3]}));
questionGroups.v3_blind_box=[
 [['附近','平时'],'我平时常去附近的公园散步。'],[['根据','老人'],'小区根据老人的需要增加了长椅。'],[['在我看来','关系'],'在我看来，这条河和城市的关系很大。'],[['不一会儿','遇见'],'不一会儿，我们就遇见了那位游客。']
].map((r,i)=>realOpen('l15_blind_0'+(i+1),'盲盒造句：用两个表达写一句话。',{words:r[0],instructions:'两个表达都必须出现，句子要完整自然。',sample:r[1],revealDecoration:'none',uniformWordSize:true}));
questionGroups.g2_picture_complete=sayRows.map((r,i)=>realOpen('l15_picture_0'+(i+1),'看图造句：使用关键词“'+r[2].slice(0,2).join('、')+'”。',{image:img(r[1]),keyword:r[2].slice(0,2).join('、'),task:r[3]}));const readingRows=[
 ['方便生活的小区','王老师家附近有学校、超市和公园。马路虽然不宽，可是车很多。小区根据老人的需要增加了长椅，也为孩子们准备了放学后做游戏的草地。',[
  ['王老师家附近没有什么？',['机场','学校','超市'],0],['小区为什么增加长椅？',['根据老人的需要','为了停车','为了游客拍照'],0],['孩子们放学后可以在哪里做游戏？',['草地上','马路中间','超市里'],0]]],
 ['半个南京人','玛丽在南京学习了两年。朋友问她哪些景点最有名，她没有马上回答，而是先了解朋友喜欢历史还是自然。她说：“根据你的兴趣，我再一点儿一点儿地介绍。”',[
  ['玛丽在南京住了多久？',['两年','两天','十二年'],0],['她为什么先问朋友的兴趣？',['想给合适的建议','忘了景点名字','不想聊天'],0],['哪句话最能说明她介绍得慢而有条理？',['一点儿一点儿地介绍','马上回答','哪些景点'],0]]],
 ['黄河和生活','黄河经过中国西北的一些地方，也流过很多城市。在当地人看来，这条河不只是一处景点，它还养育了很多家庭，和大家的生活关系很大。',[
  ['黄河经过中国的哪个地区？',['西北','东南','国外'],0],['当地人怎样看黄河？',['和生活关系很大','只是一条小路','只适合游客'],0],['“养育了很多家庭”强调什么？',['河支持人们生活','河边没有人','家庭养河'],0]]],
 ['河边的旧记忆','小时候，爷爷常带我去河边。我们经过一片草地，两个两个地沿着小路走。不一会儿就能遇见卖水果的老人。现在我再去那里，还是会想起那些下午。',[
  ['谁常带“我”去河边？',['爷爷','游客','老师'],0],['大家怎样沿小路走？',['两个两个地','一点儿一点儿地介绍','坐飞机'],0],['“不一会儿”说明什么？',['时间很短','时间很长','没有时间'],0]]],
 ['给外地朋友的周末计划','外地朋友周末来南京，我根据他的兴趣安排了路线。上午参观有名的历史景点，中午在老城吃饭，下午去河边走走。在我看来，了解一座城市不能只看照片，还要和当地人聊一聊。',[
  ['路线根据什么安排？',['朋友的兴趣','天气颜色','老人的年龄'],0],['下午去哪里？',['河边','机场','学校'],0],['作者认为怎样才能更好地了解城市？',['参观并和当地人聊天','只看照片','只买东西'],0]]]
];
questionGroups.r2_passage_choice=readingRows.map((r,i)=>tag({id:'l15_read_0'+(i+1),type:'passage_reading',data:{title:r[0],passage:r[1],questions:r[2].map((q,j)=>({id:'l15_read_'+i+'_q'+j,question_cn:q[0],options:q[1],correct_index:q[2],answer:q[1][q[2]]}))}}));
questionGroups.r3_independent_reading=[
 ['社区交通提醒','放学时间，学校门口的车很多。社区通知家长不要把车停在学校门口的马路上，要把路留给学生和行人。','通知主要提醒什么？',['注意放学时的交通','学校今天不上课','附近没有马路']],
 ['半天南京行','安娜喜欢历史，但在南京只有半天时间。小李先问了她的兴趣和时间，然后建议她去老城博物馆。','小李的建议根据什么？',['安娜的兴趣和时间','小李的年龄','天空的颜色']],
 ['黄河与生活','黄河经过中国西北的一些地方。在当地人看来，这条河养育了许多家庭，和大家的生活关系很大。','这段话强调黄河的什么作用？',['支持人们生活','制造游戏','介绍游客']],
 ['河边公园','他们走进河边公园，沿着小路慢慢走。不一会儿，大家就看见了一大片草地，心情也轻松起来。','“不一会儿”最接近什么意思？',['很快','很久以后','每天']],
 ['两人一组参观','游客们先在城门口集合，然后两个两个地跟着导游参观老城。大家一边走，一边听南京的故事。','“两个两个地”说明什么？',['每两人一组','一共只有两人','每人看两次']]
].map((r,i)=>tag({id:'l15_ind_read_0'+(i+1),type:'choice',prompt_cn:r[2],prompt_en:'Choose the best answer.',correct_answer:r[3][0],data:{title:r[0],passage:r[1],question_cn:r[2],options:r[3],correct_index:0,answer:r[3][0]}}));
questionGroups.r4_paragraph_fill=[
 ['我的小区','我家____1____有一个公园。小区____2____老人的需要放了很多长椅。孩子们____3____以后常在那里做游戏。',['附近','游客','根据','放学','可是','有名'],[0,2,3]],
 ['南京建议','朋友想____1____南京。我先问他的兴趣，____2____他喜欢的内容，再介绍几个____3____景点。',['了解','遇见','根据','有名','草地','河'],[0,2,3]],
 ['黄河故事','____1____当地人看来，黄河和生活____2____很大，因为它____3____了许多家庭。',['在','关系','养育','马路','蓝','游客'],[0,1,2]],
 ['河边散步','我们____1____一片草地，沿着河边走。____2____，大家就____3____了一位老人。',['经过','以上','不一会儿','遇见','根据','可是'],[0,2,3]],
 ['城市朋友','外地____1____想看老城。我根据他的兴趣安排路线，还和他____2____了很久。现在他说自己是____3____南京人。',['游客','聊','半个','老人','游戏','段'],[0,1,2]]
].map((r,i)=>tag({id:'l15_para_0'+(i+1),type:'paragraph_fill',prompt_cn:r[0],prompt_en:'Choose three expressions to complete the paragraph.',data:{title:r[0],passageParts:[r[1]],options:r[2],answers:r[3],optionDisplay:'plain_continuous_hanzi',slotColors:['green','blue','orange']}}));
questionGroups.t3_chain_sentence=[
 ['小区生活','我刚搬进这个小区。',['附近','马路','平时','放学','游戏']],
 ['南京周末','我的外地朋友周末来南京。',['了解','根据','有名','景点','聊一聊']],
 ['黄河故事','我们来到黄河边。',['在我看来','关系','养育','西北','经过']],
 ['河边回忆','小时候爷爷常带我散步。',['草地','两个两个地','不一会儿','遇见','老人']],
 ['我的地方故事','我想介绍一个重要的地方。',['根据','一点儿一点儿','在我看来','不一会儿','半个本地人']]
].map((r,i)=>realOpen('l15_chain_0'+(i+1),'五词故事接龙：'+r[0]+'。',{title:r[0],starter:r[1],keywords:r[2],steps:r[2].map((w,j)=>'第'+(j+1)+'句使用“'+w+'”。'),chainModes:['teacher','race','team']}));questionGroups.t2_task_card=[
 ['适合谁住的小区','社区介绍员',['附近','马路','交通','适合'],['介绍附近的生活设施','说明交通特点','说明适合什么人居住'],'介绍附近的生活设施、交通特点，并说明这里适合什么人居住。'],
 ['问兴趣再推荐','南京生活体验者',['兴趣','推荐','景点','理由'],['问问游客的兴趣','推荐两个地方','分别说明推荐理由'],'先问问游客的兴趣，再推荐两个地方，并分别说明为什么推荐。'],
 ['我了解的黄河','河流故事讲述者',['黄河','颜色','关系','在我看来'],['说出黄河的名称和位置','介绍一个历史或生活事实','说明黄河的重要性'],'请介绍一下你了解的“黄河”。'],
 ['我最喜欢的地方','回忆分享者',['地方','喜欢','故事','不一会儿'],['说出最喜欢的地方','说明为什么喜欢','讲一个和这个地方有关的故事'],'讲一个你最喜欢的地方，说明为什么喜欢，并讲一个你和这个地方的故事。'],
 ['我的地方故事','地方故事策展人',['根据','一点儿一点儿','在我看来','不一会儿'],['使用A的条件卡','使用B的推荐卡','说明个人关系','给出参观建议'],'完成1—2分钟“My Place Story”。']
].map((r,i)=>realOpen('l15_task_0'+(i+1),'任务卡：'+r[0]+'。',{title:r[0],role:r[1],keywords:r[2],steps:r[3],output:r[4]}));
questionGroups.pk_question=[
 realChoice('l15_pk_01','小区____老人的需要增加了长椅。',['根据','可是','以上','聊']),
 realChoice('l15_pk_02','哪一句表示“每两个人一组”？',['大家两个两个地进教室。','大家一点儿一点儿介绍。','大家不一会儿进教室。','大家根据教室。']),
 realChoice('l15_pk_03','哪一句同时表达观点和快速变化？',['在我看来，不一会儿这里就会热闹起来。','可是根据游客。','一点儿一点儿以上。','老人马路关系。'])
];
questionGroups.info_match=[
 tag({id:'l15_info_01',type:'info_match',prompt_cn:'把人物和需要配对。',prompt_en:'Match each person with a need.',data:{pairs:[['老人','安全的马路和休息长椅'],['孩子','放学后做游戏的草地'],['外地游客','根据兴趣得到景点建议']]}}),
 tag({id:'l15_info_02',type:'info_match',prompt_cn:'把结构和功能配对。',prompt_en:'Match each structure with its function.',data:{pairs:[['根据……','说明依据'],['在……看来','表达观点'],['不一会儿','表示很短的时间'],['两个两个地','表示每两人一组']]}})
];
questionGroups.textQa=texts.map((t,i)=>realOpen('l15_text_qa_0'+(i+1),'课文'+(i+1)+'：用两三句话回答核心问题。',{textId:t.id,question:i===0?'这个小区适合哪些人？为什么？':i===1?'怎样根据游客的兴趣介绍南京？':i===2?'黄河为什么重要？':'作者在河边想起了什么？'}));
questionGroups.pictureTalk=sayRows.map((r,i)=>realOpen('l15_picture_talk_0'+(i+1),'看图完成30秒表达：'+r[0]+'。',{image:img(r[1]),keywords:r[2],task:r[3]}));
questionGroups.battleGames={
 roulette:[
  ['社区介绍挑战','你是社区介绍员。','介绍附近的生活设施、交通特点，并说明这里适合什么人居住。',['附近','交通','适合'],'这里附近有……，交通……，适合……居住。'],
  ['游客推荐挑战','一位游客第一次来南京。','先问游客的兴趣，再推荐两个地方并分别说明理由。',['兴趣','推荐','因为'],'你喜欢……吗？我推荐……和……，因为……。'],
  ['黄河介绍挑战','你在文化交流活动中发言。','请介绍一下你了解的黄河。',['黄河','关系','在我看来'],'黄河……。在很多中国人看来，它……。'],
  ['地方故事挑战','同学想了解你最喜欢的地方。','说明为什么喜欢，并讲一个你和这个地方的故事。',['喜欢','故事','不一会儿'],'我最喜欢……，因为……。有一次……。'],
  ['说明依据','小区要增加一项新设施。','用“根据”说明你的选择和理由。',['根据','需要','设施'],'根据……的需要，我建议……。'],
  ['有序介绍','朋友请你介绍一座城市。','用“一点儿一点儿”有顺序地介绍。',['一点儿一点儿','城市','景点'],'我想一点儿一点儿地介绍……。'],
  ['表达观点','大家讨论一条河的重要性。','用“在……看来”表达观点并说明原因。',['在……看来','河','关系'],'在我看来，这条河……，因为……。'],
  ['快速变化','你在喜欢的地方散步。','用“不一会儿”讲一个很快发生的变化。',['不一会儿','遇见','心情'],'不一会儿，我……，心情也……。']
 ].map((r,i)=>({id:'l15_game_roulette_0'+(i+1),challenge:r[0],scene:r[1],prompt:r[2],keywords:r[3],sample:r[4]})),
 relay:[
  {id:'l15_game_relay_01',starter:'我刚搬进这个小区……',keywords:['附近','马路','根据']},
  {id:'l15_game_relay_02',starter:'外地朋友第一次来南京……',keywords:['了解','景点','有名']},
  {id:'l15_game_relay_03',starter:'在我看来，这条河……',keywords:['关系','养','西北']},
  {id:'l15_game_relay_04',starter:'我们经过一片草地……',keywords:['不一会儿','遇见','老人']}
 ],
 monopoly:{theme:'light',boardShape:'winding',tasks:[
  '读出三个L15词语','介绍学校附近有什么','用“根据”造句','说明老人需要什么','用“一点儿一点儿”介绍路线','给南京游客一个建议','说出一个有名景点','问同伴一个旅行问题',
  '用“在我看来”表达观点','说明河和生活的关系','说黄河经过哪里','复述课文3','用“不一会儿”造句','讲一次遇见某人的经历','复述课文4','完成“My Place Story”结尾'
 ].map((prompt,i)=>({id:'l15_game_monopoly_'+String(i+1).padStart(2,'0'),type:['vocabulary','grammar','text','task'][i%4],prompt}))},
 sourceType:'teaching_extension'
};
const sessionTests=sessions.map((s,i)=>({id:'l15_test_'+s.id.toLowerCase(),session:s.id,title:'Test '+s.id,focus:s.grammarIds,questionIds:['l15_order_0'+(i+1),'l15_scene_0'+(i+1),'l15_pk_0'+(Math.min(i+1,3))],audioRequired:false,sourceType:'teaching_extension'}));
const scaffoldLevels=[{label:'基础层 / Support',instruction:'使用句框。'},{label:'标准层 / Core',instruction:'独立完成。'},{label:'挑战层 / Challenge',instruction:'加入比较、理由和追问。'}];
const postClassHomework={mode:'hsk3_session_tasks',wrongPointsDefaultCollapsed:true,instructions:{required:'A和B材料必须用于C。',optional:'不上传音频。',aiPolicy:'先独立完成，再检查语言。'},sessionMeta:{A:{title:'Place Conditions Card',carryTo:'B、C'},B:{title:'Local Recommendation Card',carryTo:'C'},C:{title:'My Place Story',presentation:'1—2分钟课堂展示'}},sessions:{A:[{id:'post_l15_a_plan',type:'project_card',prompt_cn:'完成地点条件卡：环境、适合谁、根据什么需要改变。',prompt_en:'Create a Place Conditions Card.',wordBank:['附近','马路','老人','根据'],requiredStructures:['根据'],materials:['自制地点卡'],requiredQuestions:['在哪里？','适合谁？','根据什么改变？'],speakingTime:'45 seconds',groupRules:'Every student speaks.',scaffoldLevels,sourceType:'teaching_extension'}],B:[{id:'post_l15_b_plan',type:'project_card',prompt_cn:'使用A卡完成本地推荐卡。',prompt_en:'Use Homework A to create a Local Recommendation Card.',wordBank:['了解','有名','景点','外地','聊'],requiredStructures:['数量重叠'],materials:['A地点卡','推荐卡'],requiredQuestions:['为什么了解？','推荐什么？'],speakingTime:'45–60 seconds',groupRules:'Every student gives one reason.',carryFrom:[{session:'A',taskId:'post_l15_a_plan',use:'位置、环境和人群。'}],scaffoldLevels,sourceType:'teaching_extension'}],C:[{id:'post_l15_c_project',type:'project_card',prompt_cn:'使用A/B卡完成我的地方故事。',prompt_en:'Use both A and B cards for a 1–2 minute My Place Story.',wordBank:['根据','景点','河','草地','遇见'],requiredStructures:['根据','数量重叠','在……看来','不一会儿'],materials:['A地点卡','B推荐卡','隐私安全图片'],requiredQuestions:['环境怎样？','为什么推荐？','在谁看来有什么意义？','什么不一会儿变化？'],speakingTime:'1–2 minutes',groupRules:'Every student speaks; no audio upload.',carryFrom:[{session:'A',taskId:'post_l15_a_plan',use:'地点条件。'},{session:'B',taskId:'post_l15_b_plan',use:'推荐理由。'}],scaffoldLevels,sourceType:'teaching_extension'}]}};
const lesson={schemaVersion:'1.0.0',meta:{level:'HSK3',lessonId:'L15',lessonKey:'HSK3-L15',title:'我是半个南京人',titleEn:'I am basically half a Nanjing local',topic:'社区、南京、黄河与地方记忆',courseModel:'A社区条件→B本地推荐→C地方故事',sourceTextPolicy:'教材事实来自L15.txt；所有新增内容标记teaching_extension。',sourceAuthority:[sourceRef],missingResources:{audio:['15-1.mp3','15-3.mp3','15-5.mp3','15-7.mp3'],textbookImages:true,textbookExercises:true},editorialAudit:['语法例句原文“在我们中国看人看来”与课文“在我们中国人看来”均保留。']},pedagogy:{exerciseMix:{lessonTargetPercent:50,transferTargetPercent:30,reviewTargetPercent:20},speakingParticipation:'每位学生有效发言；C课堂展示，不上传音频。'},features:{pinyin:true,vocabExamples:true,competition:true,postClassHomework:true,previewMissions:true},sessions,usePreparation:{status:'active_shared_profile',configurationCreated:true,profile:'pilot-v1',formalResourcePlan:[1,2,3,4].map(n=>({id:'T'+n,textId:'t_hsk3_l15_0'+n,vocabularySession:String(n),grammarId:'g15_0'+n,practiceId:'l15_task_0'+n})),sourceType:'teaching_extension'},vocabScenes,vocabulary,grammar,texts,grammarTeachingNotes,textTeachingNotes,vocabExtensions:Object.fromEntries(vocabulary.map(v=>[v.id,{session:v.tags[0],tier:v.tier,meaningCn:v.meaningCn,phrases:v.phrases,sourceType:'teaching_extension',sourceRef}])),previewMissions,preClass,inClass:{questionGroups,sessionTests},postClassHomework,report:{focus:['社区环境','南京建议','黄河文化','河边记忆','地方故事'],dimensions:['词汇','语法','课文理解','口语输出','阅读','课后任务']}};
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(lesson,null,2)+'\n','utf8');console.log('Built '+path.relative(root,out));
