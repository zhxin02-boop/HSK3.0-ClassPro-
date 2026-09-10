(function (global) {
  function normalizeHomework(homework) {
    homework = homework || {};
    var tiers = {};
    Object.keys(homework.tiers || {}).forEach(function (tier) {
      var item = homework.tiers[tier] || {};
      tiers[tier] = {
        label: item.label || tier,
        goal: item.goal || '',
        suggested_minutes: (item.suggestedMinutes || 15) + '分钟左右',
        suggested_mix: item.suggestedMix || ''
      };
    });
    return {
      mode: homework.mode || '',
      instructions: homework.instructions || {},
      required: homework.required || [],
      optional: homework.optional || [],
      sessions: homework.sessions || {},
      sessionMeta: homework.sessionMeta || {},
      futureModules: homework.futureModules || {},
      tiers: tiers,
      shared_pool: homework.sharedPool || [],
      tier_pools: homework.tierPools || {},
      assignment_selection: homework.assignmentSelection || {},
      review_policy: homework.reviewPolicy || {}
    };
  }

  function normalizeStandard(standard) {
    standard = standard || {};
    var features = standard.features || {};
    var groups = (standard.inClass && standard.inClass.questionGroups) || {};
    var vocabImages = {};
    (standard.vocabulary || []).forEach(function (v) {
      if (v && v.image) vocabImages[v.hanzi || v.word] = v.image;
    });
    var normalizedGroups = {};
    Object.keys(groups).forEach(function (groupId) {
      if (!Array.isArray(groups[groupId])) {
        normalizedGroups[groupId] = groups[groupId];
        return;
      }
      normalizedGroups[groupId] = (groups[groupId] || []).map(function (question) {
        if (!question || question.media || question.type !== 'image_guess') return question;
        var image = vocabImages[question.correct_answer];
        if (!image) {
          Object.keys(vocabImages).sort(function (a, b) { return b.length - a.length; }).some(function (word) {
            if (String(question.correct_answer || '').indexOf(word) < 0) return false;
            image = vocabImages[word];
            return true;
          });
        }
        return image ? Object.assign({}, question, { media: { image: image } }) : question;
      });
    });
    return {
      schemaVersion: standard.schemaVersion || '',
      meta: Object.assign({}, standard.meta || {}, {
        showVocabExamples: !!features.vocabExamples,
        showHanziWritingDemo: !!features.hanziWritingDemo,
        pinyinEnabled: !!features.pinyin
      }),
      vocabulary: standard.vocabulary || [],
      grammar: standard.grammar || [],
      texts: standard.texts || [],
      vocabExtensions: standard.vocabExtensions || {},
      v7QuestionAnswerPairs: standard.v7QuestionAnswerPairs || [],
      grammarTeachingNotes: standard.grammarTeachingNotes || {},
      textTeachingNotes: standard.textTeachingNotes || {},
      hanziWriting: standard.hanziWriting || (standard.inClass && standard.inClass.hanziWriting) || {},
      hanziRecognition: standard.hanziRecognition || (standard.inClass && standard.inClass.hanziRecognition) || {},
      sessions: standard.sessions || [],
      previewMissions: standard.previewMissions || [],
      preClass: standard.preClass || {},
      classProQuestions: normalizedGroups,
      postClassHomework: normalizeHomework(standard.postClassHomework),
      report: standard.report || {}
    };
  }

  function toPreClassData(standard) {
    var normalized = normalizeStandard(standard);
    var preClass = normalized.preClass || {};
    var preVocabIds = preClass.vocabularyIds || [];
    var preGrammarIds = preClass.grammarIds || [];
    var preVocab = normalized.vocabulary;
    var preGrammar = normalized.grammar;
    var preReading = normalized.texts;
    if (preClass.mode === 'preview_mission') {
      if (preVocabIds.length) {
        preVocab = normalized.vocabulary.filter(function (v) {
          return preVocabIds.indexOf(v.id) >= 0;
        });
      }
      if (preGrammarIds.length) {
        preGrammar = normalized.grammar.filter(function (g) {
          return preGrammarIds.indexOf(g.id) >= 0;
        });
      }
      preReading = preClass.readingData || [];
    }
    return {
      lesson: normalized.meta.lesson || ('Lesson ' + String(normalized.meta.lessonKey || '').split('-L')[1] || normalized.meta.lessonKey || ''),
      lessonTitle: (function () {
        var base = normalized.meta.lessonTitle || normalized.meta.title || '';
        var id = String(normalized.meta.lessonId || '').replace(/^L/, '');
        return id && base && base.indexOf('第' + id + '课') !== 0 ? '第' + Number(id) + '课：' + base : base;
      })(),
      lessonEnglishTitle: normalized.meta.lessonEnglishTitle || normalized.meta.titleEn || '',
      grammarPoints: preGrammar.map(function (g) {
        return typeof g === 'string' ? g : (g.title || '') + (g.explanation ? '：' + g.explanation : '');
      }),
      vocabData: preVocab.map(function (v) {
        return { word: v.word || v.hanzi, pinyin: v.pinyin || '', english: v.english || '' };
      }),
      readingData: preReading.map(function (t, i) {
        return { textId: t.textId || i + 1, title: t.title, context: t.context || t.scene || '', dialogue: t.dialogue || t.lines || [] };
      }),
      sessions: normalized.sessions,
      previewMissions: normalized.previewMissions,
      preClass: preClass,
      preQuestions: preClass.questions || []
    };
  }

  global.ClassProCourseAdapter = {
    normalizeHomework: normalizeHomework,
    normalizeStandard: normalizeStandard,
    toPreClassData: toPreClassData
  };
})(window);
