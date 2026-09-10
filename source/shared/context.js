// Shared lesson context for every ClassPro workspace.
(function (global) {
  var KEY = "ClassProContext";
  var DEFAULTS = { lesson: "HSK1-L01", room: "8888", session: "", student: "" };
  function clean(source) {
    source = source || {};
    var session = String(source.session || "").trim().toUpperCase();
    return {
      lesson: String(source.lesson || DEFAULTS.lesson).trim() || DEFAULTS.lesson,
      room: String(source.room || DEFAULTS.room).trim() || DEFAULTS.room,
      session: /^[ABC]$/.test(session) ? session : "",
      student: String(source.student || "").trim()
    };
  }
  function read() {
    var q = new URLSearchParams(global.location.search || "");
    var saved = {};
    try { saved = JSON.parse(global.localStorage.getItem(KEY) || "{}"); } catch (e) {}
    var ctx = clean({
      lesson: q.get("lesson") || saved.lesson || DEFAULTS.lesson,
      room: q.get("room") || saved.room || DEFAULTS.room,
      session: q.get("session") || saved.session || DEFAULTS.session,
      student: q.get("student") || saved.student || DEFAULTS.student
    });
    ctx.lessonSource = q.get("lesson") ? "url" : (saved.lesson ? "storage" : "default");
    return ctx;
  }
  function save(next) {
    var ctx = clean(Object.assign({}, read(), next || {}));
    try { global.localStorage.setItem(KEY, JSON.stringify(ctx)); } catch (e) {}
    return ctx;
  }
  function serialize(ctx) {
    var q = new URLSearchParams();
    if (ctx.lesson) q.set("lesson", ctx.lesson);
    if (ctx.room) q.set("room", ctx.room);
    if (ctx.session) q.set("session", ctx.session);
    if (ctx.student) q.set("student", ctx.student);
    return q.toString();
  }
  function buildQuery(next) {
    return serialize(clean(Object.assign({}, read(), next || {})));
  }
  function query(next) {
    return serialize(save(next));
  }
  function validLesson(lesson) {
    var id = String(lesson || "");
    if (!/^HSK[1-9]-L\d{2}$/.test(id)) return false;
    return !global.ClassProCourseCatalog || !!global.ClassProCourseCatalog.get(id);
  }
  global.ClassProContext = { defaults: DEFAULTS, read: read, save: save, query: query, buildQuery: buildQuery, validLesson: validLesson };
})(window);
