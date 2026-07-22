(function () {
  var q = new URLSearchParams(location.search), ctx = window.ClassProContext ? ClassProContext.read() : {};
  var lesson = q.get('lesson') || ctx.lesson || 'HSK1-L01';
  function get(path) { var x = new XMLHttpRequest(); x.open('GET', path, false); x.send(null); if (x.status < 200 || x.status >= 300) throw new Error(path); return JSON.parse(x.responseText); }
  function legacyHomework(homework) {
    homework = homework || {};
    var tiers = {};
    Object.keys(homework.tiers || {}).forEach(function (tier) {
      var item = homework.tiers[tier] || {};
      tiers[tier] = { label: item.label || tier, goal: item.goal || '', suggested_minutes: (item.suggestedMinutes || 15) + '分钟左右', suggested_mix: item.suggestedMix || '' };
    });
    return { tiers: tiers, shared_pool: homework.sharedPool || [], tier_pools: homework.tierPools || {}, assignment_selection: homework.assignmentSelection || {}, review_policy: homework.reviewPolicy || {} };
  }
  if (/^HSK1-L\d{2}$/.test(lesson) && lesson !== 'HSK1-L01') {
    try {
      var standard = get('../data-model/lessons/' + lesson + '.json');
      if (!standard || !standard.schemaVersion || !standard.meta || standard.meta.lessonKey !== lesson) throw new Error('Invalid standard course data');
      if (!window.ClassProCourseAdapter) throw new Error('Course data adapter unavailable');
      var normalized = window.ClassProCourseAdapter.normalizeStandard(standard);
      window.LESSON_DATA = { schemaVersion: normalized.schemaVersion, meta: normalized.meta, postClassHomework: normalized.postClassHomework };
      return;
    } catch (e) {
      if (lesson === 'HSK1-L02') { console.warn('L02 standard data load failed; using legacy data.', e); document.write('<script src="../in-class/data_L02.js"><\\/script>'); }
      else { window.LESSON_DATA = { meta: { lessonKey: lesson, lessonId: lesson.split('-').pop(), title: 'Course data unavailable' }, postClassHomework: {} }; console.error('Standard course data load failed.', e); }
      return;
    }
  }
  if (lesson !== 'HSK1-L01') { document.write('<script src="../in-class/data_L02.js"><\\/script>'); return; }
  try { var c = get('../data-model/HSK1-L01_content_draft.json'), h = get('../data-model/HSK1-L01_postclass.json'); window.LESSON_DATA = { meta: c.meta, postClassHomework: h.postClassHomework }; } catch (e) { console.error('L01 post-class data load failed', e); }
})();
