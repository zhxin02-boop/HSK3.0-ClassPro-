// Shared lesson context for every ClassPro workspace.
(function (global) {
  var KEY = "ClassProContext";
  var DEFAULT_CLASS_ID = global.ClassProClassCatalog ? global.ClassProClassCatalog.defaultClassId : "legacy-default";
  var DEFAULTS = { lesson: "HSK1-L01", room: "8888", session: "", student: "", studentId: "", teacherId: "teacher-default", classId: DEFAULT_CLASS_ID };
  function clean(source) {
    source = source || {};
    var session = String(source.session || "").trim().toUpperCase();
    var requestedClass = String(source.classId || DEFAULTS.classId).trim() || DEFAULTS.classId;
    var classInfo = global.ClassProClassCatalog && global.ClassProClassCatalog.get(requestedClass);
    var classId = classInfo ? classInfo.id : requestedClass;
    return {
      lesson: String(source.lesson || DEFAULTS.lesson).trim() || DEFAULTS.lesson,
      room: String(source.room || DEFAULTS.room).trim() || DEFAULTS.room,
      session: /^[ABC]$/.test(session) ? session : "",
      student: String(source.student || "").trim(),
      studentId: String(source.studentId || "").trim(),
      teacherId: String((classInfo && classInfo.teacherId) || source.teacherId || DEFAULTS.teacherId).trim(),
      classId: classId
    };
  }
  function read() {
    var q = new URLSearchParams(global.location.search || "");
    var saved = {};
    try { saved = JSON.parse(global.localStorage.getItem(KEY) || "{}"); } catch (e) {}
    var requestedLesson = q.get("lesson") || saved.lesson || DEFAULTS.lesson;
    var lessonDefaultClass = global.ClassProClassCatalog && global.ClassProClassCatalog.defaultClassIdForLesson
      ? global.ClassProClassCatalog.defaultClassIdForLesson(requestedLesson)
      : DEFAULTS.classId;
    var queryClass = q.get("classId") || q.get("class") || "";
    var savedClass = saved.classId && saved.classId !== "legacy-default" ? saved.classId : "";
    var queryClassInfo = queryClass && global.ClassProClassCatalog ? global.ClassProClassCatalog.get(queryClass) : null;
    var ctx = clean({
      lesson: requestedLesson,
      room: q.get("room") || (queryClassInfo && queryClassInfo.room) || saved.room || DEFAULTS.room,
      session: q.get("session") || saved.session || DEFAULTS.session,
      student: q.get("student") || saved.student || DEFAULTS.student,
      studentId: q.get("studentId") || saved.studentId || DEFAULTS.studentId,
      teacherId: q.get("teacherId") || saved.teacherId || DEFAULTS.teacherId,
      classId: queryClass || savedClass || lessonDefaultClass
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
    if (ctx.studentId) q.set("studentId", ctx.studentId);
    if (ctx.teacherId) q.set("teacherId", ctx.teacherId);
    if (ctx.classId) q.set("classId", ctx.classId);
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
  function record(input) {
    var ctx = read(), row = Object.assign({}, input || {}), name = row.studentName || row.name || ctx.student;
    var identity = global.ClassProClassCatalog && global.ClassProClassCatalog.studentIdentity(ctx.classId, row.lesson || ctx.lesson, name);
    if (!row.teacherId) row.teacherId = ctx.teacherId;
    if (!row.classId) row.classId = ctx.classId;
    if (!row.studentId) row.studentId = ctx.studentId || (identity && identity.id) || "";
    if (!row.room) row.room = ctx.room;
    if (!row.lesson) row.lesson = ctx.lesson;
    return row;
  }
  global.ClassProContext = { defaults: DEFAULTS, read: read, save: save, query: query, buildQuery: buildQuery, validLesson: validLesson, record: record };
})(window);
