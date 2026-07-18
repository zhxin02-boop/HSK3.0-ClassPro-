(function () {
  function apply() {
    var ctx = window.ClassProContext ? ClassProContext.read() : {}, lesson = new URLSearchParams(location.search).get('lesson') || ctx.lesson || 'HSK1-L01';
    var list = window.HSK1_CURRICULUM || [], x = list.filter(function (a) { return a.id === lesson; })[0];
    if (!x) return;
    var pre = document.getElementById('preLink'), inside = document.getElementById('inLink'), post = document.getElementById('postLink');
    [pre, inside, post].forEach(function (el) { if (el) { el.classList.remove('disabled'); var go = el.querySelector('.go'); if (go) go.textContent = el === pre ? '进入预习 / Start' : el === inside ? '进入课堂 / Join' : '进入作业 / Practice'; } });
    if (pre) pre.href = '../pre-class/index.html?lesson=' + x.id;
    if (inside) inside.href = '../in-class/student.html?room=8888&lesson=' + x.id;
    if (post) post.href = '../post-class/student-report.html?lesson=' + x.id;
  }
  window.addEventListener('DOMContentLoaded', apply);
})();
