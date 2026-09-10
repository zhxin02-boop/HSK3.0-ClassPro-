(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ClassProRecordsApi = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function fetchJson(url, timeoutMs) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, timeoutMs || 18000) : null;
    return fetch(url, controller ? { signal: controller.signal } : {}).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  function rowsFromPayload(payload) {
    if (!payload || payload.status !== "ok") return [];
    if (Array.isArray(payload.data)) return payload.data.slice();
    var rows = [];
    Object.keys(payload.data || {}).forEach(function (key) {
      (payload.data[key] || []).forEach(function (row) { rows.push(row); });
    });
    return rows;
  }

  function loadLessons(baseUrl, lessonIds, options) {
    options = options || {};
    var queue = lessonIds.slice(), rows = [], completed = 0;
    var concurrency = Math.max(1, Math.min(Number(options.concurrency) || 4, 6));
    function next() {
      var lesson = queue.shift();
      if (!lesson) return Promise.resolve();
      var url = baseUrl + "?action=get_data&lesson=" + encodeURIComponent(lesson);
      return fetchJson(url, options.timeoutMs).then(function (payload) {
        rows = rows.concat(rowsFromPayload(payload));
      }).finally(function () {
        completed++;
        if (typeof options.onProgress === "function") options.onProgress(completed, lessonIds.length, lesson);
      }).then(next);
    }
    var workers = [];
    for (var i = 0; i < Math.min(concurrency, lessonIds.length); i++) workers.push(next());
    return Promise.all(workers).then(function () { return rows; });
  }

  function loadReviewQueue(baseUrl, lessonIds, options) {
    options = options || {};
    var compactUrl = baseUrl + "?action=get_review_queue&lessons=" + encodeURIComponent(lessonIds.join(","));
    return fetchJson(compactUrl, options.timeoutMs).then(function (payload) {
      if (!payload || payload.status !== "ok" || !Array.isArray(payload.data)) throw new Error("compact review API unavailable");
      if (typeof options.onProgress === "function") options.onProgress(lessonIds.length, lessonIds.length, "compact");
      return payload.data;
    }).catch(function () {
      return loadLessons(baseUrl, lessonIds, options);
    });
  }

  return { fetchJson: fetchJson, rowsFromPayload: rowsFromPayload, loadLessons: loadLessons, loadReviewQueue: loadReviewQueue };
});
