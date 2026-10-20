// Shared MQTT topic namespace for pilot class isolation.
(function (global) {
  function segment(value, fallback) {
    return encodeURIComponent(String(value || fallback || "").trim().toLowerCase());
  }
  function current(next) {
    var ctx = global.ClassProContext ? global.ClassProContext.read() : {};
    return Object.assign({}, ctx, next || {});
  }
  function base(next) {
    var ctx = current(next);
    return ["classpro", "v1", segment(ctx.classId, "legacy-default"), segment(ctx.room, "8888"), segment(ctx.lesson, "unknown")].join("/");
  }
  function topic(channel, next) { return base(next) + "/" + segment(channel); }
  function envelope(payload, next) {
    var ctx = current(next), copy = Object.assign({}, payload || {});
    if (!copy.teacherId) copy.teacherId = ctx.teacherId || "";
    if (!copy.classId) copy.classId = ctx.classId || "legacy-default";
    if (!copy.room) copy.room = ctx.room || "8888";
    if (!copy.lesson) copy.lesson = ctx.lesson || "";
    return copy;
  }
  function matches(payload, next) {
    var ctx = current(next), data = payload || {};
    return (!data.classId || data.classId === ctx.classId) && (!data.room || String(data.room) === String(ctx.room)) && (!data.lesson || data.lesson === ctx.lesson);
  }
  global.ClassProClassroom = { base: base, topic: topic, envelope: envelope, matches: matches };
})(window);
