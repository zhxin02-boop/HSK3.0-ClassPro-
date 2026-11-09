const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const builderPath = path.join(root, 'scripts/build-hsk3-l18.js');
const lessonPath = path.join(root, 'source/data-model/lessons/HSK3-L18.json');
const sourcePath = path.join(root, 'textbook data/HSK3/L18.txt');
let passed = 0;
const ok = (value,message) => {if(!value)throw new Error('FAIL: '+message);passed++;console.log('✓ '+message);};
const same = (actual,expected,message) => ok(JSON.stringify(actual)===JSON.stringify(expected),message+'\n  expected '+JSON.stringify(expected)+'\n  actual   '+JSON.stringify(actual));
const unique = (items,message) => ok(new Set(items).size===items.length,message);
const countBy = (items,fn) => items.reduce((acc,item)=>{const key=fn(item);acc[key]=(acc[key]||0)+1;return acc;},{});
const maxRun = (items) => {let best=0,run=0,last=Symbol('start');for(const item of items){if(item===last)run++;else{last=item;run=1;}best=Math.max(best,run);}return best;};

ok(fs.existsSync(builderPath),'builder exists');
ok(fs.existsSync(sourcePath),'authoritative textbook source copy exists');
const sourceBytes = fs.readFileSync(sourcePath);
same(crypto.createHash('sha256').update(sourceBytes).digest('hex').toUpperCase(),'4AC18CBE574631E6EF3042EB84177C9BBA240140833E3A0D281528EA11EB511E','textbook source hash');
const source = sourceBytes.toString('utf8');
ok(source.includes("I've learned how to make jiaozi"),'approved English title in textbook source');
ok(source.includes('我学会了包饺子'),'Chinese title in textbook source');

execFileSync(process.execPath,[builderPath],{cwd:root,stdio:'pipe'});
const first = fs.readFileSync(lessonPath);
execFileSync(process.execPath,[builderPath],{cwd:root,stdio:'pipe'});
const second = fs.readFileSync(lessonPath);
ok(first.equals(second),'builder is deterministic across consecutive runs');
const lesson = JSON.parse(second.toString('utf8'));
const serialized = JSON.stringify(lesson);

same(lesson.schemaVersion,'1.0.0','schema version');
same(lesson.meta.lessonKey,'HSK3-L18','lesson key');
same(lesson.meta.title,'我学会了包饺子','Chinese title');
same(lesson.meta.titleEn,"I've learned how to make jiaozi",'approved English title');
same(lesson.meta.sourceAuthority,['textbook data/HSK3/L18.txt'],'single textbook authority');
same(lesson.meta.sourceSha256,'4AC18CBE574631E6EF3042EB84177C9BBA240140833E3A0D281528EA11EB511E','source hash recorded in metadata');
same(lesson.meta.missingResources.audio,[],'all four textbook audio files available');
same(lesson.sessions.map((s)=>s.id),['A','B','C'],'three-session plan');
same(lesson.sessions.map((s)=>s.textIds.length),[1,1,2],'A/B/C text allocation');
same(lesson.sessions.map((s)=>s.grammarIds.length),[1,1,2],'A/B/C grammar allocation');

const curriculum = fs.readFileSync(path.join(root,'source/data-model/hsk3-curriculum.js'),'utf8');
ok(curriculum.includes('id: "HSK3-L18"'),'curriculum contains L18');
ok(curriculum.includes('en: "I\'ve learned how to make jiaozi"'),'curriculum uses approved English title');
ok(/id: "HSK3-L18"[^\n]+openForUse: true[^\n]+teacherVisible: true[^\n]+status: "ready"[^\n]+useProfile: "pilot-v1"/.test(curriculum),'L18 is ready and open through pilot-v1');
same(lesson.usePreparation.status,'active_shared_profile','formal lesson declares the active shared profile');
ok(lesson.usePreparation.configurationCreated===true&&lesson.usePreparation.profile==='pilot-v1','stage 4 use profile is declared');
ok(fs.existsSync(path.join(root,'source/data-model/experiments/HSK3-L18-USE-PILOT-V1.json')),'stage 4 profile file exists');

const textbookWords = ['怎样','过节','节','节日','联欢','大概','阿姨','叔叔','收','总','起','见面','矿泉水','刚刚','出发','不久','发生','刚','只要','学期','毕业','出生','过去','懂得','坚持','完成','目标','发展','春节'];
same(lesson.vocabulary.map((v)=>v.hanzi),textbookWords,'28 textbook words plus 春节 in exact order');
same(countBy(lesson.vocabulary,(v)=>v.tier),{expression:23,understanding:3,context:3},'vocabulary tier distribution');
same(lesson.vocabulary.filter((v)=>v.properNoun).map((v)=>v.hanzi),['春节'],'only 春节 is marked proper noun');
same(lesson.vocabularyCatalog,lesson.vocabulary.map((v)=>v.id),'vocabulary catalog references all words once');
same(lesson.vocabularyGroups.map((g)=>g.vocabularyIds.length),[7,8,7,7],'T1/T2/T3/T4 formal grouping');
lesson.vocabularyGroups.forEach((g)=>{ok(g.recognitionWordIds.length<=4,g.id+' recognition at most four words');same(g.activities,['recognition','form_choice','input','collocation'],g.id+' four vocabulary activities');});
lesson.vocabulary.forEach((v)=>{ok(v.hanzi&&v.pinyin&&v.english&&v.meaningCn,v.id+' complete vocabulary card');same(v.phrases.length,2,v.id+' has two collocations');ok(v.example&&v.examplePinyin&&['textbook','teaching_extension'].includes(v.exampleSourceType),v.id+' sourced example');});

same(lesson.grammar.map((g)=>g.id),['g18_01','g18_02','g18_03','g18_04'],'four grammar IDs');
lesson.grammar.forEach((g)=>{ok(g.examples.length>=5,g.id+' has at least five examples');g.examples.forEach((e)=>ok(e.hanzi&&e.pinyin&&e.english&&['textbook','teaching_extension'].includes(e.sourceType),g.id+' complete sourced example'));const note=lesson.grammarTeachingNotes[g.id];ok(note.presentationMode==='progressive_grammar'&&note.mergeNoticeObserve===true,g.id+' progressive grammar mode');ok(note.observeMode&&note.observePrompt&&note.observeHighlights.length===g.examples.length,g.id+' observe contract');ok(note.visualLearning&&note.oralQuestions.length>=3&&note.structureVariants.length>=2&&note.followUp.length===1,g.id+' rendered grammar fields');ok(note.followUp[0].image&&note.followUp[0].target&&note.followUp[0].sampleAnswer&&note.followUp[0].samplePinyin,g.id+' complete image follow-up');same(note.examples,g.examples,g.id+' teaching examples match canonical grammar examples');});

same(lesson.texts.map((t)=>t.id),['t_hsk3_l18_01','t_hsk3_l18_02','t_hsk3_l18_03','t_hsk3_l18_04'],'four text IDs');
same(lesson.texts.map((t)=>t.lines.length),[8,7,7,1],'complete text units 8/7/7/1');
same(lesson.texts.map((t)=>t.audio),['../../audio/HSK3/18-1.mp3','../../audio/HSK3/18-3.mp3','../../audio/HSK3/18-5.mp3','../../audio/HSK3/18-7.mp3'],'audio mapping 1/3/5/7');
same(lesson.texts.map((t)=>t.audioStatus),['available','available','available','available'],'all text audio available');
ok(lesson.texts[3].format==='diary'&&lesson.texts[3].genre==='日记'&&lesson.texts[3].author==='白家月','text 4 uses diary layout');
lesson.texts.slice(0,3).flatMap((t)=>t.lines).forEach((line)=>same(line.englishSourceType,'textbook',line.id+' English is textbook'));
same(lesson.texts[3].lines[0].englishSourceType,'teaching_extension','text 4 English is teaching extension');
same(lesson.texts[3].lines[0].english,"This time in China, what made me happiest was getting to know Li Wen's parents. They showed me photos of Li Wen when he was born and told me many stories from the past. When Li Wen was in high school, he wanted to study medicine, and from then on he studied hard. In his final year of high school, because his grades were especially good, he got the opportunity to study abroad. From him, I learned that as long as we keep going, we can achieve our goals. I believe he will continue to grow and do even better in the future.",'approved text 4 English');
same(lesson.texts[0].lines[0].hanzi,'我要在中国过年，真开心。','text 1 begins with exact textbook line');
same(lesson.texts[1].lines[6].hanzi,'我刚刚看视频学会了包饺子，我跟你们一起包吧。','text 2 ends with exact textbook line');
same(lesson.texts[2].lines[6].hanzi,'还有最后一个学期就要毕业了，他很快就会回来了。','text 3 ends with exact textbook line');
same(lesson.texts[3].lines[0].hanzi,'这次来中国，我最高兴的是认识了李文的父母。他们给我看了李文出生时的照片，还给我讲了很多过去的故事。李文高中的时候想学医，从那时起就努力学习。高三的时候，因为成绩特别好，他得到了出国留学的机会。在他身上，我懂得了，只要一直坚持，就能完成自己的目标。我相信，他以后一定会发展得更好。','text 4 exact textbook Chinese');

const audioHashes = {'18-1.mp3':'2654F447847618211A2C3B21F07C4A07C277E0BE3F53758B74ACC41219B4289F','18-3.mp3':'F5A36300ACF93F9580D7BFCD10FC36E37F8E189A9461DF4EF35386CF5D3BBA04','18-5.mp3':'D44016F7973137A66919E59828A38B70F0F888112DC640617F0756DF35184FCF','18-7.mp3':'F8DDE299DE5FECC00C0D5BAC2B0A5AC7700B3735237FBAA5CBA9EC14BB719D3A'};
Object.entries(audioHashes).forEach(([name,hash])=>{const file=path.join(root,'audio/HSK3',name);ok(fs.existsSync(file)&&fs.statSync(file).size>0,name+' exists and is non-empty');same(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(),hash,name+' hash');});

const imagePaths = lesson.meta.imageResources;
same(imagePaths.length,8,'eight project images');
unique(imagePaths,'image paths are unique');
const imageHashes=[];
imagePaths.forEach((rel)=>{const file=path.join(root,rel);ok(fs.existsSync(file)&&fs.statSync(file).size>100000,rel+' exists and is non-trivial');const bytes=fs.readFileSync(file);same(bytes.toString('ascii',1,4),'PNG',rel+' is PNG');const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);ok(width>height&&width>=1300&&height>=700,rel+' is wide classroom image');imageHashes.push(crypto.createHash('sha256').update(bytes).digest('hex'));});
unique(imageHashes,'all eight classroom images are distinct');
const sceneSteps=Object.values(lesson.vocabScenes).flatMap((g)=>g.steps);
same(sceneSteps.length,8,'eight vocabulary scenes');
unique(sceneSteps.map((s)=>s.prompt),'scene questions are specific and unique');
sceneSteps.forEach((s)=>{ok(s.prompt&&s.talkHint&&s.sampleAnswers.length>=2,s.id+' complete prompt and samples');ok(s.words.length>=3,s.id+' vocabulary cards');ok(!/请根据图片使用目标词介绍场景/.test(s.prompt),s.id+' no generic prompt');});

const banned=['谈','顺序','特点','交际目的','发展','状态','哪类'];
const allOverview=[];
const endpoints=['介绍一个你喜欢的节日：什么时候？你和家人会做什么？','介绍一件你刚刚学会做的事：你怎么学会的？','介绍一张对你很重要的旧照片：什么时候照的？有什么故事？','介绍一个你的目标：从什么时候起？你要怎么坚持？'];
lesson.texts.forEach((text,i)=>{const note=lesson.textTeachingNotes[text.id];same(note.studentVisibleStages,['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],text.id+' five stages');same(note.overallChoices.length,3,text.id+' three overview questions');same(note.details.length,5,text.id+' five detail questions');note.overallChoices.forEach((q)=>{allOverview.push(q);ok(!banned.some((w)=>q.question.includes(w)),q.id+' simple question wording');ok(q.options.length===3&&q.answer===q.options[q.correctIndex],q.id+' unique answer mapping');});note.details.forEach((q)=>ok(q.id&&q.questionPinyin&&q.answer&&q.answerPinyin&&q.acceptedAnswers.length&&q.informationPoint,q.id+' complete detail metadata'));ok(note.keyPoints.length>=5&&note.keyPoints.every((x)=>x.hanzi&&x.note),text.id+' key points renderable');ok(note.cultureDiscussion.title&&note.cultureDiscussion.questions.length>=2&&note.cultureDiscussion.background&&note.cultureDiscussion.wordCards.length>=4&&note.cultureDiscussion.sampleAnswers.length>=2,text.id+' culture discussion renderable');ok(note.retellScaffold.nodes.length>=6&&note.retellScaffold.frame,text.id+' retell scaffold');same(note.languageAndApplication.personalPrompt,endpoints[i],text.id+' personal prompt aligns with MINI');});
same(countBy(allOverview,(q)=>['A','B','C'][q.correctIndex]),{B:4,C:4,A:4},'12 overview answers balanced A/B/C');
ok(maxRun(allOverview.map((q)=>q.correctIndex))<=2,'overview answer position max run two');

same(lesson.previewMissions.length,3,'three preview missions');
lesson.previewMissions.forEach((mission)=>{same(mission.stages.length,5,mission.session+' exactly five preview stages');same(mission.stages.map((s)=>s.order),[1,2,3,4,5],mission.session+' preview order');same(mission.stages[4].questions.length,10,mission.session+' ten-question challenge');same(mission.reportFields,['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],mission.session+' report fields');ok(mission.persistenceKeyPattern.includes('HSK3-L18_'+mission.session+'_{student}_{contentVersion}'),mission.session+' isolated persistence key');});
same(lesson.previewMissions.map((m)=>m.stages[2].pairs.length),[6,7,8],'A/B/C preview matching counts');

const groups = lesson.inClass.questionGroups;
same(groups.v5_vocab_fill.length,3,'three vocab-fill groups');
groups.v5_vocab_fill.forEach((g)=>same(g.data.sentences.length,5,g.id+' five fills'));
same(groups.v7_word_match.length,3,'three word-match groups');
groups.v7_word_match.forEach((g)=>same(g.data.pairs.length,5,g.id+' five full question-answer pairs'));
const expectedSizes={g1_ordering:5,scene_sentence_choice:10,v6_description_guess:10,v2_say_guess:8,v3_blind_box:4,g2_picture_complete:8,r2_passage_choice:5,r3_independent_reading:5,r4_paragraph_fill:5,t3_chain_sentence:5,t2_task_card:5,pk_question:3};
Object.entries(expectedSizes).forEach(([key,size])=>same(groups[key].length,size,key+' count'));
groups.v6_description_guess.forEach((item)=>ok(!/[，。；：！？]/.test(item.data.description)&&item.data.description_pinyin.split(/\s+/).length===[...item.data.description].length,item.id+' description uses uniform Hanzi sizing'));
groups.v2_say_guess.forEach((item)=>ok([...item.data.target].length>=3&&[...item.data.target].length<=5&&item.data.maxHanzi===5,item.id+' target is a three-to-five-character phrase'));
groups.v3_blind_box.forEach((item)=>ok(item.data.words.length===2&&item.data.words_pinyin.length===2&&item.data.instructions&&item.data.sample&&item.data.endpoint,item.id+' blind-box words and support render'));
groups.g2_picture_complete.forEach((item)=>ok(item.data.image&&item.data.keywords.length>=3&&item.data.structure&&item.data.sampleAnswer,item.id+' picture sentence display contract'));
groups.r2_passage_choice.forEach((item)=>{ok(item.data.passage.length>=45,item.id+' full passage');same(item.data.questions.length,3,item.id+' three questions');item.data.questions.forEach((q)=>ok(q.options.length===3&&q.answer===q.options[q.correct_index],q.id+' unique answer'));});
groups.r3_independent_reading.forEach((item)=>ok(item.data.title&&item.data.passage.length>=45&&item.data.options.length===3,item.id+' independent reading complete'));
groups.r4_paragraph_fill.forEach((item)=>ok(item.data.title&&item.data.passageParts.length===1&&item.data.options.length===6&&item.data.answers.length===3,item.id+' paragraph and options render'));
same(groups.t2_task_card.slice(0,4).map((item)=>item.data.output),endpoints,'task cards align with MINI endpoints');
same(groups.t2_task_card.slice(0,4).map((item)=>item.data.minimum),['节日＋时间＋一个家庭活动','一件事＋一种学习方法','时间＋一个故事信息','一个目标＋开始时间＋一个行动'],'task-card minimum standards');
same(groups.pk_question.map((item)=>item.data.correct_index),[0,1,2],'PK answers balanced A/B/C');

const applicable=Object.entries(groups).filter(([key])=>key!=='battleGames').flatMap(([,value])=>Array.isArray(value)?value:[]).filter((item)=>item.contentRole);
same(applicable.length,100,'100 role-tagged formal question items');
same(countBy(applicable,(item)=>item.contentRole),{lesson:50,transfer:30,review:20},'exercise mix is exactly 50/30/20');

same(groups.battleGames.roulette.length,8,'eight roulette challenges');
groups.battleGames.roulette.forEach((r)=>ok(r.challenge&&r.scene&&r.prompt&&r.keywords.length&&r.sample,r.id+' complete roulette fields'));
same(groups.battleGames.relay.length,5,'five relay starters');
same(groups.battleGames.monopoly.tasks.length,16,'16 monopoly tasks');
same(groups.battleGames.studentRosterSource,'source/shared/students.js','shared HSK3 roster source');

same(lesson.inClass.sessionTests.map((t)=>t.id),['l18_test_a','l18_test_b','l18_test_c'],'Test A/B/C IDs');
same(lesson.inClass.sessionTests.map((t)=>t.audio.length),[1,1,2],'Test A/B/C audio coverage');
const hw=lesson.postClassHomework;
ok(hw.wrongPointsDefaultCollapsed===true,'homework weak points collapsed by default');
same(Object.keys(hw.sessions),['A','B','C'],'homework A/B/C');
const hwA=hw.sessions.A[0],hwB=hw.sessions.B[0],hwC=hw.sessions.C[0];
same([hwA.id,hwB.id,hwC.id],['post_l18_a_festival_family_card','post_l18_b_new_skill_card','post_l18_c_growth_album'],'homework IDs');
same(hwA.carryTo,['B','C'],'Homework A feeds B/C');
ok(hwB.carryFrom[0].taskId===hwA.id&&hwB.carryTo[0]==='C','Homework B reuses A and feeds C');
same(hwC.carryFrom.map((x)=>x.taskId),[hwA.id,hwB.id],'Homework C carries A/B');
ok(hwC.noAudioUpload===true&&/No audio upload is required/.test(hwC.prompt_en),'Homework C no audio upload');
['A','B','C'].forEach((session)=>{const task=hw.sessions[session][0];ok(task.prompt_en&&task.materials.length&&task.requiredQuestions.length&&task.wordBank.length&&task.requiredStructures.length&&task.speakingTime&&task.groupRules&&task.scaffoldLevels.length===3,'Homework '+session+' complete support contract');});

same(lesson.usePreparation.formalResourcePlan.length,4,'four formal MINI plans');
same(lesson.usePreparation.formalResourcePlan.map((m)=>m.exit),endpoints,'MINI exits align with approved endpoints');
same(lesson.usePreparation.formalResourcePlan.map((m)=>m.id),['mini_l18_t1_festival','mini_l18_t2_new_skill','mini_l18_t3_photo_story','mini_l18_t4_growth_goal'],'stable MINI IDs');
lesson.usePreparation.formalResourcePlan.forEach((m)=>{same(m.linkedResources.practiceIds.length,1,m.id+' one primary practice');ok(m.resourceLinks.vocabulary&&m.resourceLinks.grammar&&m.resourceLinks.text&&m.resourceLinks.practice,m.id+' resource links');});
same(lesson.usePreparation.stateContract.evidenceTypes,['entry_expression','actual_learning_path','exit_expression'],'only three evidence types');
same(lesson.pedagogy.timerPolicy,{miniMinutes:[3,4,5],vocabularyMinutes:[2,3,4,5],timeoutAction:'prompt_only'},'two timer policies');

const ids=[];
const collectCanonicalIds=(value)=>{if(!value||typeof value!=='object')return;if(typeof value.id==='string')ids.push(value.id);if(Array.isArray(value))value.forEach(collectCanonicalIds);else Object.entries(value).forEach(([key,item])=>{if(!['overallChoice','classQuestions'].includes(key))collectCanonicalIds(item);});};
collectCanonicalIds(lesson);
unique(ids,'all generated object IDs are unique');
ok(!/(正确答案|干扰项A|L18短文\d|完成口语任务\d|请根据图片使用目标词介绍场景)/.test(serialized),'no placeholder content');
ok(!serialized.includes('classpro-use-profile/v3'),'formal JSON does not embed the separate profile schema');

const sharedDiff=execFileSync('git',['diff','--name-only','--','source/shared','source/in-class/lesson-data-loader.js','source/in-class/teacher.html','source/in-class/student.html','source/in-class/l08-use-pilot.js','source/in-class/l08-use-pilot.html','source/pre-class'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
same(sharedDiff,[],'stage 3 does not modify shared runtime');

console.log('\nHSK3-L18 formal validation passed: '+passed+' checks.');
