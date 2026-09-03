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
    if (/^HSK[13]-L\d{2}$/.test(lesson)) return '../data-model/lessons/' + lesson + '.json';
    return '';
  }

  function curriculumItem(lesson) {
    var list = window.ClassProAllCurriculum ? window.ClassProAllCurriculum() : (window.HSK1_CURRICULUM || []);
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
      if (typeof window.ClassProConfigureSessionCards === 'function') {
        window.ClassProConfigureSessionCards(lesson, ready);
      }
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

  function installL03SessionCards() {
    var baseConfigure = window.ClassProConfigureSessionCards;
    if (typeof baseConfigure !== 'function') return;
    var l03Sessions = [
      ['A', '第一次课', '课文一：这个小区怎么样'],
      ['B', '第二次课', '课文二：新家还没收拾好'],
      ['C', '第三次课', '课文三、四：办信用卡与搬家计划']
    ];

    function showPanel(mode) {
      var lesson = selectedLesson();
      if (lesson !== 'HSK3-L03') return;
      var panel = document.getElementById('sessionPanel');
      var rows = document.getElementById('sessionRows');
      var title = document.getElementById('sessionPanelTitle');
      var intro = document.getElementById('sessionPanelIntro');
      var settings = {
        pre: ['选择预习课次', 'Choose A, B, or C to start the matching pre-class preview.', '../pre-class/index.html', '进入预习 / Preview', 'pre'],
        post: ['选择作业课次', 'Choose the same A, B, or C session after class to finish the homework task.', '../post-class/student-report.html', '进入作业 / Homework', 'post'],
        review: ['选择复习课次', 'Choose A, B, or C to review vocabulary, grammar points, and text content for that session.', '../post-class/review-resources.html', '进入复习 / Review', 'review']
      }[mode];
      if (!panel || !rows || !settings) return;
      title.textContent = settings[0];
      intro.textContent = 'HSK3-L03 分为 A/B/C 三次课。' + settings[1];
      rows.innerHTML = l03Sessions.map(function (item) {
        var href = settings[2] + '?lesson=HSK3-L03&session=' + item[0];
        return '<div class="session-row"><div class="session-id"><b>' + item[0] + '</b>' + item[1] + '</div><div><div class="title">' + item[2] + '</div><div class="session-links"><a class="' + settings[4] + '" href="' + href + '">' + settings[3] + '</a></div></div></div>';
      }).join('');
      panel.classList.add('show');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    window.ClassProConfigureSessionCards = function (lesson, ready) {
      baseConfigure(lesson, ready);
      if (lesson !== 'HSK3-L03' || !ready) return;
      [['preLink', 'pre'], ['postLink', 'post'], ['reviewLink', 'review']].forEach(function (entry) {
        var card = document.getElementById(entry[0]);
        if (!card) return;
        card.onclick = function (event) {
          event.preventDefault();
          showPanel(entry[1]);
        };
      });
    };
  }

  window.ClassProApplyLessonLinks = apply;
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      patchRenderCourse();
      installL03SessionCards();
      apply();
    }, 0);
  });
})();
