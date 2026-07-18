// Shared lesson context for every ClassPro workspace.
(function (global) {
  var KEY = "ClassProContext";
  var DEFAULTS = { lesson: "HSK1-L01", room: "8888", student: "" };
  function read() {
    var q = new URLSearchParams(global.location.search || "");
    var saved = {};
    try { saved = JSON.parse(global.localStorage.getItem(KEY) || "{}"); } catch (e) {}
    var ctx = {
      lesson: q.get("lesson") || saved.lesson || DEFAULTS.lesson,
      room: q.get("room") || saved.room || DEFAULTS.room,
      student: q.get("student") || saved.student || DEFAULTS.student
    };
    ctx.lessonSource = q.get("lesson") ? "url" : (saved.lesson ? "storage" : "default");
    ctx.room = String(ctx.room || DEFAULTS.room).trim() || DEFAULTS.room;
    ctx.student = String(ctx.student || "").trim();
    return ctx;
  }
  function save(next) {
    var ctx = Object.assign({}, read(), next || {});
    try { global.localStorage.setItem(KEY, JSON.stringify(ctx)); } catch (e) {}
    return ctx;
  }
  function query(next) {
    var ctx = save(next), q = new URLSearchParams();
    if (ctx.lesson) q.set("lesson", ctx.lesson);
    if (ctx.room) q.set("room", ctx.room);
    if (ctx.student) q.set("student", ctx.student);
    return q.toString();
  }
  global.ClassProContext = { defaults: DEFAULTS, read: read, save: save, query: query, validLesson: function (lesson) { return /^HSK1-L\d{2}$/.test(String(lesson || "")); } };
})(window);
