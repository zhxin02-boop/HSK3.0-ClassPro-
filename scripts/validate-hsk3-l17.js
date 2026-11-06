const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const {execFileSync}=require('child_process');

const root=path.join(__dirname,'..');
const builderPath=path.join(root,'scripts/build-hsk3-l17.js');
const lessonPath=path.join(root,'source/data-model/lessons/HSK3-L17.json');
const sourcePath=path.join(root,'textbook data/HSK3/L17.txt');
let passed=0;
const ok=(value,message)=>{if(!value)throw new Error('FAIL: '+message);passed++;console.log('✓ '+message);};
const same=(actual,expected,message)=>ok(JSON.stringify(actual)===JSON.stringify(expected),message+'\n  expected '+JSON.stringify(expected)+'\n  actual   '+JSON.stringify(actual));
const unique=(items,message)=>ok(new Set(items).size===items.length,message);
const countBy=(items,fn)=>items.reduce((acc,item)=>{const key=fn(item);acc[key]=(acc[key]||0)+1;return acc;},{});
const maxRun=(items)=>{let best=0,run=0,last=Symbol('start');for(const item of items){if(item===last)run++;else{last=item;run=1;}best=Math.max(best,run);}return best;};
const walk=(value,visitor)=>{if(Array.isArray(value)){value.forEach((v)=>walk(v,visitor));return;}if(value&&typeof value==='object'){visitor(value);Object.values(value).forEach((v)=>walk(v,visitor));}};

ok(fs.existsSync(builderPath),'builder exists');
ok(fs.existsSync(sourcePath),'corrected textbook source exists');
const sourceBytes=fs.readFileSync(sourcePath);
same(crypto.createHash('sha256').update(sourceBytes).digest('hex').toUpperCase(),'4FAA69797B80BFDB7F52E576EAC2163521DC8CA2E52DB1B180C334C7A9CDF610','corrected textbook hash');
const source=sourceBytes.toString('utf8');
ok(source.includes('I will learn from people who are careful'),'approved English title in textbook source');
ok(source.includes('最合适的选择')&&!source.includes('最合适的名择'),'confirmed textbook correction is applied');

execFileSync(process.execPath,[builderPath],{cwd:root,stdio:'pipe'});
const first=fs.readFileSync(lessonPath);
execFileSync(process.execPath,[builderPath],{cwd:root,stdio:'pipe'});
const second=fs.readFileSync(lessonPath);
ok(first.equals(second),'builder is deterministic across consecutive runs');
const lesson=JSON.parse(second.toString('utf8'));
const serialized=JSON.stringify(lesson);

same(lesson.schemaVersion,'1.0.0','schema version');
same(lesson.meta.lessonKey,'HSK3-L17','lesson key');
same(lesson.meta.title,'我要多向认真的人学习','Chinese title');
same(lesson.meta.titleEn,'I will learn from people who are careful','approved English title');
same(lesson.meta.sourceAuthority,['textbook data/HSK3/L17.txt'],'single textbook authority');
same(lesson.meta.missingResources.audio,[],'all four textbook audio files available');
same(lesson.sessions.map((s)=>s.id),['A','B','C'],'three-session plan');
same(lesson.sessions.map((s)=>s.textIds.length),[1,1,2],'A/B/C text allocation');
same(lesson.sessions.map((s)=>s.grammarIds.length),[1,1,2],'A/B/C grammar allocation');

const curriculum=fs.readFileSync(path.join(root,'source/data-model/hsk3-curriculum.js'),'utf8');
ok(curriculum.includes('id: "HSK3-L17"'),'curriculum contains L17');
ok(curriculum.includes('en: "I will learn from people who are careful"'),'curriculum uses approved English title');
ok(/id: "HSK3-L17"[^\n]+openForUse: true[^\n]+teacherVisible: true[^\n]+status: "ready"[^\n]+useProfile: "pilot-v1"/.test(curriculum),'L17 is ready and open with pilot-v1');
same(lesson.usePreparation.status,'active_shared_profile','stage 4 shared profile is active');
ok(lesson.usePreparation.configurationCreated===true&&lesson.usePreparation.profile==='pilot-v1','formal lesson declares pilot-v1 configuration');

const textbookWords=['向','楼梯','害怕','生气','常见','聪明','错','认为','到处','继续','同意','可','屋子','有关','关机','前天','留学','国家','比如','查','有用','容易','回答','方向','只有','真正','难题'];
same(lesson.vocabulary.map((v)=>v.hanzi),textbookWords,'27 textbook words in exact order');
same(countBy(lesson.vocabulary,(v)=>v.tier),{expression:21,context:2,understanding:4},'vocabulary tier distribution');
same(lesson.vocabularyCatalog,lesson.vocabulary.map((v)=>v.id),'vocabulary catalog references all words once');
same(lesson.vocabularyGroups.map((g)=>g.vocabularyIds.length),[8,6,7,6],'T1/T2/T3/T4 formal grouping');
lesson.vocabularyGroups.forEach((g)=>{ok(g.recognitionWordIds.length<=4,g.id+' recognition at most four words');same(g.activities,['recognition','form_choice','input','collocation'],g.id+' four vocabulary activities');});

same(lesson.grammar.map((g)=>g.id),['g17_01','g17_02','g17_03','g17_04'],'four grammar IDs');
lesson.grammar.forEach((g)=>{same(g.examples.length,5,g.id+' has five examples');g.examples.forEach((e)=>ok(e.hanzi&&e.pinyin&&e.english&&['textbook','teaching_extension'].includes(e.sourceType),g.id+' complete sourced example'));const note=lesson.grammarTeachingNotes[g.id];ok(note.presentationMode==='progressive_grammar'&&note.mergeNoticeObserve===true,g.id+' progressive grammar mode');ok(note.observeMode&&note.observePrompt&&note.observeHighlights.length===5,g.id+' observe contract');ok(note.visualLearning&&note.oralQuestions.length>=3&&note.structureVariants.length>=2&&note.followUp.length===1,g.id+' rendered grammar fields');ok(note.followUp[0].image&&note.followUp[0].target&&note.followUp[0].sampleAnswer&&note.followUp[0].samplePinyin,g.id+' complete image follow-up');});
ok(lesson.grammar[3].examples[0].hanzi.includes('最合适的选择')&&!lesson.grammar[3].examples[0].hanzi.includes('名择'),'grammar correction visible to students');

same(lesson.texts.map((t)=>t.id),['t_hsk3_l17_01','t_hsk3_l17_02','t_hsk3_l17_03','t_hsk3_l17_04'],'four text IDs');
same(lesson.texts.map((t)=>t.lines.length),[8,6,7,1],'complete text units 8/6/7/1');
same(lesson.texts.map((t)=>t.audio),['../../audio/HSK3/17-1.mp3','../../audio/HSK3/17-3.mp3','../../audio/HSK3/17-5.mp3','../../audio/HSK3/17-7.mp3'],'audio mapping 1/3/5/7');
same(lesson.texts.map((t)=>t.audioStatus),['available','available','available','available'],'all text audio available');
ok(lesson.texts[3].format==='diary'&&lesson.texts[3].genre==='日记'&&lesson.texts[3].author==='陈天中','text 4 uses diary layout');
ok(lesson.texts[3].lines[0].hanzi.includes('最合适的选择')&&!lesson.texts[3].lines[0].hanzi.includes('名择'),'text 4 uses corrected wording');
['17-1.mp3','17-3.mp3','17-5.mp3','17-7.mp3'].forEach((name)=>ok(fs.statSync(path.join(root,'audio/HSK3',name)).size>0,name+' exists and is non-empty'));

const imagePaths=lesson.meta.imageResources;
same(imagePaths.length,8,'eight project images');
imagePaths.forEach((rel)=>{const file=path.join(root,rel);ok(fs.existsSync(file)&&fs.statSync(file).size>100000,rel+' exists and is non-trivial');const bytes=fs.readFileSync(file);same(bytes.toString('ascii',1,4),'PNG',rel+' is PNG');const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);ok(width>height&&width>=1300&&height>=700,rel+' is wide classroom image');});
const sceneSteps=Object.values(lesson.vocabScenes).flatMap((g)=>g.steps);
same(sceneSteps.length,8,'eight vocabulary scenes');
unique(sceneSteps.map((s)=>s.prompt),'scene questions are specific and unique');
sceneSteps.forEach((s)=>{ok(s.prompt&&s.talkHint&&s.sampleAnswers.length>=2,s.id+' complete prompt and samples');ok(s.words.length>=3,s.id+' vocabulary cards');ok(!/请根据图片使用目标词介绍场景/.test(s.prompt),s.id+' no generic prompt');});

const banned=['谈','顺序','特点','交际目的','发展','状态','哪类'];
const allOverview=[];
const endpoints=['你想向谁学习？为什么？','说说你想继续学习什么，并请同学给你一个建议。','介绍一个你想去学习的国家或城市，说说你要怎么准备？','介绍你毕业以后的打算：工作还是继续学习？为什么？'];
lesson.texts.forEach((text,i)=>{const note=lesson.textTeachingNotes[text.id];same(note.studentVisibleStages,['听 / 读课文','整体选择','细节问答','展示课文','语言与应用'],text.id+' five stages');same(note.overallChoices.length,3,text.id+' three overview questions');same(note.details.length,5,text.id+' five detail questions');note.overallChoices.forEach((q)=>{allOverview.push(q);ok(!banned.some((w)=>q.question.includes(w)),q.id+' simple question wording');ok(q.options.length===3&&q.answer===q.options[q.correctIndex],q.id+' unique answer mapping');});note.details.forEach((q)=>ok(q.id&&q.questionPinyin&&q.answer&&q.answerPinyin&&q.acceptedAnswers.length&&q.informationPoint,q.id+' complete detail metadata'));ok(note.keyPoints.length>=4&&note.keyPoints.every((x)=>x.hanzi&&x.note),text.id+' key points renderable');ok(note.cultureDiscussion.title&&note.cultureDiscussion.questions.length>=2&&note.cultureDiscussion.background&&note.cultureDiscussion.wordCards.length>=4&&note.cultureDiscussion.sampleAnswers.length>=2,text.id+' culture discussion renderable');ok(note.retellScaffold.nodes.length>=5&&note.retellScaffold.frame,text.id+' retell scaffold');same(note.languageAndApplication.personalPrompt,endpoints[i],text.id+' personal prompt aligns with MINI');});
same(countBy(allOverview,(q)=>['A','B','C'][q.correctIndex]),{B:4,C:4,A:4},'12 overview answers balanced A/B/C');
ok(maxRun(allOverview.map((q)=>q.correctIndex))<=2,'overview answer position max run two');

same(lesson.previewMissions.length,3,'three preview missions');
lesson.previewMissions.forEach((mission)=>{same(mission.stages.length,5,mission.session+' exactly five preview stages');same(mission.stages.map((s)=>s.order),[1,2,3,4,5],mission.session+' preview order');same(mission.stages[4].questions.length,10,mission.session+' ten-question challenge');same(mission.reportFields,['lesson','session','student','score','total','accuracy','elapsedTime','wrongItems','submittedAt'],mission.session+' report fields');ok(mission.persistenceKeyPattern.includes('HSK3-L17_'+mission.session+'_{student}_{contentVersion}'),mission.session+' isolated persistence key');});

const groups=lesson.inClass.questionGroups;
same(groups.v5_vocab_fill.length,3,'three vocab-fill groups');
groups.v5_vocab_fill.forEach((g)=>same(g.data.sentences.length,5,g.id+' five fills'));
same(groups.v7_word_match.length,3,'three word-match groups');
groups.v7_word_match.forEach((g)=>same(g.data.pairs.length,5,g.id+' five full question-answer pairs'));
const expectedSizes={g1_ordering:5,scene_sentence_choice:10,v6_description_guess:10,v2_say_guess:8,v3_blind_box:4,g2_picture_complete:8,r2_passage_choice:5,r3_independent_reading:5,r4_paragraph_fill:5,t3_chain_sentence:5,t2_task_card:5,pk_question:3};
Object.entries(expectedSizes).forEach(([key,size])=>same(groups[key].length,size,key+' count'));
groups.v2_say_guess.forEach((item)=>ok([...item.data.target].length<=5,item.id+' target at most five Han characters'));
groups.g2_picture_complete.forEach((item)=>ok(item.data.image&&item.data.keywords.length>=3&&item.data.structure&&item.data.sampleAnswer,item.id+' picture sentence display contract'));
groups.r2_passage_choice.forEach((item)=>{ok(item.data.passage.length>=45,item.id+' full passage');same(item.data.questions.length,3,item.id+' three questions');item.data.questions.forEach((q)=>ok(q.options.length===3&&q.answer===q.options[q.correct_index],q.id+' unique answer'));});
groups.r3_independent_reading.forEach((item)=>ok(item.data.title&&item.data.passage.length>=45&&item.data.options.length===3,item.id+' independent reading complete'));
same(groups.t2_task_card.slice(0,4).map((item)=>item.data.output),endpoints,'task cards align with MINI endpoints');
same(groups.t2_task_card.slice(0,4).map((item)=>item.data.minimum),['一个人＋一个理由','学习内容＋请求建议','一个地点＋一种准备办法','一个选择＋一个理由'],'task-card minimum standards');
same(groups.pk_question.map((item)=>item.data.correct_index),[0,1,2],'PK answers balanced A/B/C');

const applicable=Object.entries(groups).filter(([key])=>!['battleGames'].includes(key)).flatMap(([,value])=>Array.isArray(value)?value:[]).filter((item)=>item.contentRole);
const roles=countBy(applicable,(item)=>item.contentRole),total=applicable.length;
const ratios={lesson:roles.lesson/total,transfer:roles.transfer/total,review:roles.review/total};
ok(ratios.lesson>=0.45&&ratios.lesson<=0.55,'lesson role ratio near 50%: '+JSON.stringify(ratios));
ok(ratios.transfer>=0.25&&ratios.transfer<=0.35,'transfer role ratio near 30%: '+JSON.stringify(ratios));
ok(ratios.review>=0.15&&ratios.review<=0.25,'review role ratio near 20%: '+JSON.stringify(ratios));

same(groups.battleGames.roulette.length,8,'eight roulette challenges');
groups.battleGames.roulette.forEach((r)=>ok(r.challenge&&r.scene&&r.prompt&&r.keywords.length&&r.sample,r.id+' complete roulette fields'));
same(groups.battleGames.relay.length,5,'five relay starters');
same(groups.battleGames.monopoly.tasks.length,16,'16 monopoly tasks');
same(groups.battleGames.studentRosterSource,'source/shared/students.js','shared HSK3 roster source');

same(lesson.inClass.sessionTests.map((t)=>t.id),['l17_test_a','l17_test_b','l17_test_c'],'Test A/B/C IDs');
same(lesson.inClass.sessionTests.map((t)=>t.audio.length),[1,1,2],'Test A/B/C audio coverage');
const hw=lesson.postClassHomework;
ok(hw.wrongPointsDefaultCollapsed===true,'homework weak points collapsed by default');
same(Object.keys(hw.sessions),['A','B','C'],'homework A/B/C');
const hwA=hw.sessions.A[0],hwB=hw.sessions.B[0],hwC=hw.sessions.C[0];
same([hwA.id,hwB.id,hwC.id],['post_l17_a_role_model_card','post_l17_b_learning_direction_card','post_l17_c_next_step_plan'],'homework IDs');
same(hwA.carryTo,['B','C'],'Homework A feeds B/C');
ok(hwB.carryFrom[0].taskId===hwA.id&&hwB.carryTo[0]==='C','Homework B reuses A and feeds C');
same(hwC.carryFrom.map((x)=>x.taskId),[hwA.id,hwB.id],'Homework C carries A/B');
ok(hwC.noAudioUpload===true&&/No audio upload is required/.test(hwC.prompt_en),'Homework C no audio upload');
['A','B','C'].forEach((session)=>{const task=hw.sessions[session][0];ok(task.prompt_en&&task.materials.length&&task.requiredQuestions.length&&task.wordBank.length&&task.requiredStructures.length&&task.speakingTime&&task.groupRules&&task.scaffoldLevels.length===3,'Homework '+session+' complete support contract');});

same(lesson.usePreparation.formalResourcePlan.length,4,'four formal MINI plans');
same(lesson.usePreparation.formalResourcePlan.map((m)=>m.exit),endpoints,'MINI exits align with approved endpoints');
same(lesson.usePreparation.formalResourcePlan.map((m)=>m.id),['mini_l17_t1_role_model','mini_l17_t2_learning_direction','mini_l17_t3_study_abroad_research','mini_l17_t4_next_step_plan'],'stable MINI IDs');
lesson.usePreparation.formalResourcePlan.forEach((m)=>{same(m.linkedResources.practiceIds.length,1,m.id+' one primary practice');ok(m.resourceLinks.vocabulary&&m.resourceLinks.grammar&&m.resourceLinks.text&&m.resourceLinks.practice,m.id+' resource links');});
same(lesson.usePreparation.stateContract.evidenceTypes,['entry_expression','actual_learning_path','exit_expression'],'only three evidence types');
same(lesson.pedagogy.timerPolicy,{miniMinutes:[3,4,5],vocabularyMinutes:[2,3,4,5],timeoutAction:'prompt_only'},'two timer policies');

const ids=[];
const collectCanonicalIds=(value)=>{
  if(!value||typeof value!=='object')return;
  if(typeof value.id==='string')ids.push(value.id);
  if(Array.isArray(value))value.forEach(collectCanonicalIds);
  else Object.entries(value).forEach(([key,item])=>{
    if(!['overallChoice','classQuestions'].includes(key))collectCanonicalIds(item);
  });
};
collectCanonicalIds(lesson);
unique(ids,'all generated object IDs are unique');
ok(!/(正确答案|干扰项A|L17短文\d|完成口语任务\d|请根据图片使用目标词介绍场景)/.test(serialized),'no placeholder content');
ok(!serialized.includes('I will learn from careful people'),'old English title removed');

const sharedDiff=execFileSync('git',['diff','--name-only','--','source/shared','source/in-class/lesson-data-loader.js','source/in-class/teacher.html','source/in-class/student.html','source/in-class/l08-use-pilot.js','source/in-class/l08-use-pilot.html','source/pre-class'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
same(sharedDiff,[],'stage 3 does not modify shared runtime');

console.log('\nHSK3-L17 formal validation passed: '+passed+' checks.');
