// Shared MQTT topic namespace for pilot class isolation.
(function (global) {
  function segment(value, fallback) {
    return encodeURIComponent(String(value || fallback || "").trim().toLowerCase());
  }
  function current(next) {
    var ctx = global.ClassProContext ? global.ClassProContext.read() : {};
    var query = new URLSearchParams(global.location.search || "");
    return Object.assign({}, ctx, { run: query.get("run") || "default" }, next || {});
  }
  function base(next) {
    var ctx = current(next);
    return ["classpro", "v2", segment(ctx.classId, "legacy-default"), segment(ctx.room, "8888"), segment(ctx.lesson, "unknown"), segment(ctx.run, "default")].join("/");
  }
  function topic(channel, next) { return base(next) + "/" + segment(channel); }
  function envelope(payload, next) {
    var ctx = current(next), copy = Object.assign({}, payload || {});
    if (!copy.teacherId) copy.teacherId = ctx.teacherId || "";
    if (!copy.classId) copy.classId = ctx.classId || "legacy-default";
    if (!copy.room) copy.room = ctx.room || "8888";
    if (!copy.lesson) copy.lesson = ctx.lesson || "";
    if (!copy.run) copy.run = ctx.run || "default";
    return copy;
  }
  function matches(payload, next) {
    var ctx = current(next), data = payload || {};
    return (!data.classId || data.classId === ctx.classId) && (!data.room || String(data.room) === String(ctx.room)) && (!data.lesson || data.lesson === ctx.lesson) && (!data.run || data.run === ctx.run);
  }
  function connectBroker(clientId) {
    return global.mqtt.connect('wss://05d1d5baec9d4cb3a21f5517b430cff1.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'classpro', password: 'Classpro2026', clientId: clientId,
      reconnectPeriod: 2000, connectTimeout: 8000,
    });
  }
  global.ClassProClassroom = { base: base, topic: topic, envelope: envelope, matches: matches, connectBroker: connectBroker };
})(window);
