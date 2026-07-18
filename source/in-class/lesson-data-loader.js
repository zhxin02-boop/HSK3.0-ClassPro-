(function () {
  var params = new URLSearchParams(location.search);
  var shared = window.ClassProContext ? ClassProContext.read() : {};
  var lesson = params.get('lesson') || params.get('course') || shared.lesson || 'HSK1-L01';
  if (lesson !== 'HSK1-L01') {
    document.write('<script src="./data_L02.js"><\\/script>');
    return;
  }

  function loadJson(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);
    if (xhr.status < 200 || xhr.status >= 300) throw new Error('Cannot load ' + path);
    return JSON.parse(xhr.responseText);
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function options(correct, pool, count) {
    var out = [correct];
    for (var i = 0; i < pool.length && out.length < (count || 4); i++) {
      if (pool[i] && out.indexOf(pool[i]) < 0) out.push(pool[i]);
    }
    return out;
  }
  var pinyin = {
    '你好': 'nǐ hǎo', '大家': 'dàjiā', '好': 'hǎo', '学生': 'xuéshēng', '们': 'men',
    '老师': 'lǎoshī', '您': 'nín', '你们': 'nǐmen', '谢谢': 'xièxie', '不客气': 'bú kèqi',
    '同学': 'tóngxué', '学生们': 'xuéshēngmen', '同学们': 'tóngxuémen', '大家好': 'dàjiā hǎo', '您好': 'nín hǎo',
    '老师您好': 'lǎoshī nín hǎo', '你': 'nǐ', '我': 'wǒ'
  };
  function label(word) { return pinyin[word] ? word + '（' + pinyin[word] + '）' : word; }
  function reorder(list, correct, seed) {
    var out = list.slice(), ci = out.indexOf(correct), target = seed % out.length, temp;
    if (ci >= 0 && ci !== target) { temp = out[target]; out[target] = out[ci]; out[ci] = temp; }
    return out;
  }
  function meta(q) {
    return { kp: q.kp, sourceType: q.sourceType, targetKnowledge: q.targetKnowledge,
      principle: q.principle, difficultyReason: q.difficultyReason, contentStatus: q.contentStatus };
  }
  var realScenes = [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80'
  ];
  var sceneByWord = {
    '你好': realScenes[6], '老师': realScenes[7], '大家': realScenes[1], '学生们': realScenes[0],
    '您': realScenes[3], '谢谢': realScenes[4], '不客气': realScenes[2], '再见': realScenes[5],
    '同学': realScenes[0]
  };

  try {
    var content = loadJson('../data-model/HSK1-L01_content_draft.json');
    var pool = loadJson('../data-model/HSK1-L01_question_pool_draft.json').questionPool;
    var vocabWords = content.vocabulary.map(function (v) { return v.hanzi; });
    var q = {};

    q.v1_image_guess = pool.image_guess.slice(0, 8).map(function (x, i) {
      var o = clone(x); o.prompt_cn = 'Look at the picture and choose the word.'; o.prompt_en = '';
      var imageOptions = reorder(options(x.correct_answer, vocabWords, 4), x.correct_answer, i + 1);
      o.data = Object.assign(meta(x), { image_hint: '', options: imageOptions,
        options_pinyin: imageOptions.map(function (w) { return pinyin[w] || ''; }), correct_index: imageOptions.indexOf(x.correct_answer) });
      o.correct_answer = x.correct_answer; o.acceptable_answers = [o.correct_answer];
      o.media = { image: sceneByWord[x.correct_answer] || realScenes[i] };
      return o;
    });
    q.v5_vocab_fill = pool.vocab_fill.filter(function (x) { return !['fill_l01_007', 'fill_l01_008', 'fill_l01_010'].includes(x.id); }).map(function (x) {
      var o = clone(x);
      o.options = x.options; o.correct_answer = x.correct_answer; o.acceptable_answers = [o.correct_answer];
      if (x.id === 'fill_l01_001') o.prompt_cn = '___好！';
      if (x.id === 'fill_l01_005') { o.prompt_cn = '第一次见面，王老师，___！'; o.options = ['您好', '谢谢', '再见', '不客气']; o.correct_answer = '您好'; }
      if (x.id === 'fill_l01_009') o.prompt_cn = '下课了（xiàkè le；class is over），我们说：___！';
      o.options = reorder(o.options, o.correct_answer, x.id.charCodeAt(x.id.length - 1) % o.options.length);
      o.data = Object.assign(meta(x), { sentence: o.prompt_cn, sentence_pinyin: '', options: o.options,
        options_pinyin: o.options.map(function (w) { return pinyin[w] || ''; }), correct_index: o.options.indexOf(o.correct_answer) }); return o;
    });
    var matchPrompts = [
      ['你好吗？', '我很好。'], ['你是学生吗？', '我是学生。'], ['老师，您好！', '您好！'],
      ['大家好！', '你好！'], ['谢谢！', '不客气！'], ['你们好！', '你好，小语！'],
      ['同学们，再见！', '老师，再见！'], ['你叫什么？', '我叫小语。'],
      ['你们是学生吗？', '是，我们是学生。'], ['王老师，你好！', '你好！']
    ];
    q.v7_word_match = matchPrompts.map(function (pair, i) {
      var base = pool.word_match[i] || pool.word_match[0];
      return { id: 'match_l01_runtime_' + String(i + 1).padStart(3, '0'), type: 'word_match', prompt_cn: '请选择合适的答句：' + pair[0], prompt_en: 'Choose the appropriate reply.',
        correct_answer: pair[1], acceptable_answers: [pair[1]], data: Object.assign(meta(base), { words: reorder([pair[1], '谢谢！', '再见！', '大家好！'], pair[1], i + 1), sentences: [{ sentence: pair[0], answer: pair[1] }] }) };
    });
    q.v8_memory_match = [
      { id: 'colloc_l01_runtime_001', label: '词语和英文释义', pairs: [['你好','hello'],['谢谢','thank you'],['老师','teacher'],['学生','student']] },
      { id: 'colloc_l01_runtime_002', label: '词语和英文释义', pairs: [['大家','everyone'],['您','you (honorific)'],['同学','classmate'],['再见','goodbye']] },
      { id: 'colloc_l01_runtime_003', label: '短语和英文释义', pairs: [['大家好','Hello, everyone!'],['老师，您好','Hello, teacher!'],['不客气','You’re welcome!'],['同学们，再见','Goodbye, class!']] }
    ].map(function (x) { return { id: x.id, type: 'vocab_collocations', prompt_cn: x.label, prompt_en: 'Match the Chinese expressions with English meanings.', data: { pairs: x.pairs.map(function (p) { return { left: p[0], right: p[1] }; }) } }; });
    q.w1_component_char = pool.hanzi_discrimination.map(function (x, i) {
      var sets = [
        { options: ['你','他','您','她','它'], correct: '您' },
        { options: ['门','们','问','闻'], correct: '们' },
        { options: ['字','家','学','子'], correct: '学' },
        { options: ['市','师','帅','狮'], correct: '师' },
        { options: ['射','谢','社','谁'], correct: '谢' },
        { options: ['件','间','见','现'], correct: '见' },
        { options: ['雪','写','学','些'], correct: '学' },
        { options: ['各','格','客','哥'], correct: '客' },
        { options: ['加','架','家','假'], correct: '家' }
      ];
      var set = sets[i] || sets[0], opts = set.options; var o = clone(x); o.options = opts; o.correct_answer = set.correct;
      o.data = Object.assign(meta(x), { sentence: x.prompt_cn, sentence_pinyin: '', options: opts, hide_option_pinyin: true, correct_index: opts.indexOf(set.correct) }); return o;
    });
    q.v4_complete_sentence = [];
    q.g1_ordering = [];
    q.tt_text_true_false = [
      { id: 'ttq_l01_001', type: 'true_false', prompt_cn: '判断下面的说法是否正确。', prompt_en: 'Is the statement true or false?', data: { statement: '王老师对小语说：“你好！”', statement_pinyin: 'Wáng lǎoshī duì Xiǎoyǔ shuō: “Nǐ hǎo!”', statement_en: 'Ms. Wang says hello to AI Xiaoyu.', answer: true } },
      { id: 'ttq_l01_002', type: 'true_false', prompt_cn: '判断下面的说法是否正确。', prompt_en: 'Is the statement true or false?', data: { statement: '学生们对老师说：“老师，您好！”', statement_pinyin: 'Xuéshēngmen duì lǎoshī shuō: “Lǎoshī, nín hǎo!”', statement_en: 'The students say hello politely to the teacher.', answer: true } },
      { id: 'ttq_l01_003', type: 'true_false', prompt_cn: '判断下面的说法是否正确。', prompt_en: 'Is the statement true or false?', data: { statement: '“谢谢”的回应是“再见”。', statement_pinyin: '“Xièxie” de huíyìng shì “zàijiàn”.', statement_en: 'The response to “thank you” is “goodbye”.', answer: false } }
    ];
    var pk = [];
    q.v5_vocab_fill.forEach(function (x) { pk.push({ id: 'pk_' + x.id, type: 'choice', prompt_cn: x.prompt_cn, prompt_en: x.prompt_en,
      correct_answer: x.correct_answer, data: { question_cn: x.data.sentence, question_en: x.prompt_en, options: x.data.options, options_pinyin: x.data.options_pinyin, correct_index: x.data.correct_index } }); });
    q.w1_component_char.forEach(function (x) { pk.push({ id: 'pk_' + x.id, type: 'choice', prompt_cn: x.prompt_cn, prompt_en: 'Choose the correct character.', correct_answer: x.correct_answer,
      data: { question_cn: x.data.sentence, question_en: 'Choose the correct character.', options: x.data.options, correct_index: x.data.correct_index } }); });
    q.v7_word_match.forEach(function (x) { var s = x.data.sentences[0]; pk.push({ id: 'pk_' + x.id, type: 'choice', prompt_cn: x.prompt_cn, prompt_en: x.prompt_en, correct_answer: s.answer,
      data: { question_cn: s.sentence, question_en: x.prompt_en, options: x.data.words, correct_index: x.data.words.indexOf(s.answer) } }); });
    q.pk_question = pk.slice(0, 20);

    window.LESSON_DATA = {
      meta: Object.assign({}, content.meta, { characters: [
        { id: 'wang', name: '王一飞', role: '老师', gender: 'female' },
        { id: 'xiaoyu', name: '小语', role: 'AI助手', gender: 'unknown' },
        { id: 'students', name: '学生们', role: '学生', gender: 'mixed' }
      ] }),
      vocabulary: content.vocabulary.map(function (v, i) {
        var wordImages = {'你好':realScenes[6],'大家':realScenes[1],'好':realScenes[2],'学生':realScenes[0],'们':realScenes[1],'老师':realScenes[7],'您':realScenes[3],'你们':realScenes[1],'谢谢':realScenes[4],'不客气':realScenes[2],'同学':realScenes[0],'再见':realScenes[5]};
        return Object.assign({}, v, { image: wordImages[v.hanzi] || realScenes[i] });
      }),
      grammar: content.grammar.map(function (g) {
        var ru = g.id === 'g01' ? 'Используйте 您 при обращении к учителю, старшему или человеку, которому нужно выразить уважение.' : 'Суффикс 们 ставится после местоимений или существительных, обозначающих людей, чтобы показать множественное число.';
        return Object.assign({}, g, { explanation: g.explanation, note: g.formula && g.formula.note,
          formula: Object.assign({}, g.formula, { noteRu: ru }) });
      }),
      texts: content.texts,
      classProQuestions: q,
      preClass: content.preClass,
      postClassHomework: content.postClassHomework
    };
  } catch (error) {
    window.LESSON_DATA = { meta: { lessonKey: 'HSK1-L01', lessonId: 'L01', title: 'L01 数据加载失败' }, vocabulary: [], grammar: [], texts: [], classProQuestions: {} };
    console.error(error);
  }
})();
