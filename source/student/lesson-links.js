(function () {
  var cache = {};
  var lastApplyToken = 0;

  function selectedLesson() {
    var q = new URLSearchParams(location.search);
    var ctx = window.ClassProContext ? ClassProContext.read() : {};
    var select = document.getElementById('courseSelect');
    return q.get('lesson') || (select && select.value) || window.currentLesson || ctx.lesson || 'HSK1-L01';
  }

  function dataUrl(lesson) {
    if (lesson === 'HSK1-L01') return '../data-model/HSK1-L01_content_draft.json';
    if (/^HSK1-L\d{2}$/.test(lesson)) return '../data-model/lessons/' + lesson + '.json';
    return '';
  }

  function curriculumItem(lesson) {
    var list = window.HSK1_CURRICULUM || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === lesson) return list[i];
    return null;
  }

  function hasLessonData(lesson) {
    var item = curriculumItem(lesson);
    if (item && item.openForUse) return Promise.resolve(true);
    if (cache[lesson] != null) return Promise.resolve(cache[lesson]);
    var url = dataUrl(lesson);
    if (!url || !window.fetch) {
      cache[lesson] = !!(item && item.openForUse);
      return Promise.resolve(cache[lesson]);
    }
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      cache[lesson] = !!r.ok;
      return cache[lesson];
    }).catch(function () {
      cache[lesson] = !!(item && item.openForUse);
      return cache[lesson];
    });
  }

  function setCard(id, href, ready, text) {
    var el = document.getElementById(id);
    if (!el) return;
    var go = el.querySelector('.go');
    el.classList.toggle('disabled', !ready);
    el.href = ready ? href : '#';
    if (go) go.textContent = ready ? text : '内容准备中 / Preparing';
  }

  function updateSelectedOption(lesson, ready) {
    var select = document.getElementById('courseSelect');
    if (!select) return;
    for (var i = 0; i < select.options.length; i++) {
      var opt = select.options[i];
      if (opt.value !== lesson) continue;
      opt.textContent = opt.textContent.replace(/（准备中）|\(Preparing\)/g, '');
      if (!ready) opt.textContent += '（准备中）';
    }
  }

  function apply() {
    var token = ++lastApplyToken;
    var lesson = selectedLesson();
    var item = curriculumItem(lesson);
    if (!item) return;
    hasLessonData(lesson).then(function (ready) {
      if (token !== lastApplyToken) return;
      setCard('preLink', '../pre-class/index.html?lesson=' + encodeURIComponent(lesson), ready, '进入预习 / Start');
      setCard('inLink', '../in-class/student.html?room=8888&lesson=' + encodeURIComponent(lesson), ready, '进入课堂 / Join');
      setCard('postLink', '../post-class/student-report.html?lesson=' + encodeURIComponent(lesson), ready, '进入作业 / Practice');
      setCard('reviewLink', '../post-class/review-resources.html?lesson=' + encodeURIComponent(lesson), ready, '进入复习 / Review');
      updateSelectedOption(lesson, ready);
    });
  }

  function patchRenderCourse() {
    if (window.__ClassProLessonLinksPatched) return;
    window.__ClassProLessonLinksPatched = true;
    if (typeof window.renderCourse === 'function') {
      var oldRenderCourse = window.renderCourse;
      window.renderCourse = function () {
        var result = oldRenderCourse.apply(this, arguments);
        apply();
        return result;
      };
    }
    if (typeof window.selectLesson === 'function') {
      var oldSelectLesson = window.selectLesson;
      window.selectLesson = function () {
        var result = oldSelectLesson.apply(this, arguments);
        apply();
        return result;
      };
    }
  }

  window.ClassProApplyLessonLinks = apply;
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      patchRenderCourse();
      apply();
    }, 0);
  });
})();
