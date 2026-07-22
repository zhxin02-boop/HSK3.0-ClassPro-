(function () {
  var q = new URLSearchParams(location.search), ctx = window.ClassProContext ? ClassProContext.read() : {};
  var lesson = q.get('lesson') || ctx.lesson || 'HSK1-L01';
  function get(path) { var x = new XMLHttpRequest(); x.open('GET', path, false); x.send(null); if (x.status < 200 || x.status >= 300) throw new Error(path); return JSON.parse(x.responseText); }
  function shufflePreQuestions(list) {
    if (lesson === 'HSK1-L01' || !Array.isArray(list)) return;
    list.forEach(function (q) {
      if (!Array.isArray(q.options)) return;
      for (var i = q.options.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = q.options[i];
        q.options[i] = q.options[j]; q.options[j] = t;
      }
    });
  }
  function normalize(c) {
    var meta = c.meta || {};
    var vocabulary = c.vocabulary || c.vocabData || [];
    var texts = c.texts || c.readingData || [];
    window.D = {
      lesson: c.lesson || meta.lesson || ('Lesson ' + String(lesson).split('-L')[1] || lesson),
      lessonTitle: c.lessonTitle || meta.lessonTitle || meta.title || '',
      lessonEnglishTitle: c.lessonEnglishTitle || meta.lessonEnglishTitle || meta.titleEn || '',
      grammarPoints: (c.grammar || c.grammarPoints || []).map(function (g) { return typeof g === 'string' ? g : (g.title + (g.explanation ? '：' + g.explanation : '')); }),
      vocabData: vocabulary.map(function (v) { return { word: v.word || v.hanzi, pinyin: v.pinyin || '', english: v.english || '' }; }),
      readingData: texts.map(function (t, i) { return { textId: t.textId || i + 1, title: t.title, context: t.context || t.scene || '', dialogue: t.dialogue || t.lines || [] }; }),
      preClass: c.preClass || {},
      preQuestions: (c.preClass && c.preClass.questions) || c.preQuestions || []
    };
    shufflePreQuestions(window.D.preQuestions);
  }
  function mergeQuizConfig() {
    try {
      var cfg = get('../data-model/' + lesson + '_preclass.json');
      if (!cfg || !cfg.preClass) return false;
      window.D = window.D || {};
      window.D.preClass = cfg.preClass;
      window.D.preQuestions = cfg.preClass.questions || [];
      shufflePreQuestions(window.D.preQuestions);
      return true;
    } catch (e) { return false; }
  }
  // Future lessons use one data-only file. If it is absent, the existing sample fallback remains active.
  if (/^HSK1-L\d{2}$/.test(lesson) && lesson !== 'HSK1-L01') {
    try {
      var standard = get('../data-model/lessons/' + lesson + '.json');
      if (standard && standard.schemaVersion && standard.preClass && window.ClassProCourseAdapter) {
        normalize(window.ClassProCourseAdapter.toPreClassData(standard));
        return;
      }
    } catch (e) { /* standard course file not available yet */ }
    try { var future = get('../data-model/' + lesson + '_preclass.json'); if (future && (future.vocabulary || future.vocabData || future.texts || future.readingData)) { normalize(future); return; } } catch (e) { /* use the legacy sample below */ }
    if (mergeQuizConfig()) return;
  }
  if (lesson !== 'HSK1-L01') return;
  try {
    var c = get('../data-model/HSK1-L01_content_draft.json');
    window.D = { lesson: 'Lesson 1', lessonTitle: '第1课：AI小语，你好！', lessonEnglishTitle: 'Hello, AI Xiaoyu!', grammarPoints: c.grammar.map(function (g) { return g.title + '：' + g.explanation; }), vocabData: c.vocabulary.map(function (v) { return { word: v.hanzi, pinyin: v.pinyin, english: v.english }; }), readingData: c.texts.map(function (t, i) { return { textId: i + 1, title: t.title, context: t.scene, dialogue: t.lines.map(function (l) { return { speaker: l.speaker, chinese: l.hanzi, pinyin: l.pinyin, english: l.english }; }) }; }), preQuestions: c.preClass.questions };
    mergeQuizConfig();
  } catch (e) { console.error('L01 pre-class data load failed', e); }
})();
