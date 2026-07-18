(function () {
  var q = new URLSearchParams(location.search), ctx = window.ClassProContext ? ClassProContext.read() : {};
  var lesson = q.get('lesson') || ctx.lesson || 'HSK1-L01';
  if (lesson !== 'HSK1-L01') { document.write('<script src="../in-class/data_L02.js"><\\/script>'); return; }
  function get(path) { var x = new XMLHttpRequest(); x.open('GET', path, false); x.send(null); if (x.status < 200 || x.status >= 300) throw new Error(path); return JSON.parse(x.responseText); }
  try { var c = get('../data-model/HSK1-L01_content_draft.json'), h = get('../data-model/HSK1-L01_postclass.json'); window.LESSON_DATA = { meta: c.meta, postClassHomework: h.postClassHomework }; } catch (e) { console.error('L01 post-class data load failed', e); }
})();
