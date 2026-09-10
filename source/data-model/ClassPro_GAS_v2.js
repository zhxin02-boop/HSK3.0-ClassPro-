// Chinese ClassPro+ unified data storage for Google Apps Script
// Deploy as Web App. Execute as: Me. Access: Anyone with the link.

var SHEET_ID = "1ILjSScbsUKwh7za0iEzRcHWOJf3QnonrTaIafEkbhiw";
var JSONP_CALLBACK = "";
var HEADERS = [
  "提交时间","姓名","课程","环节","模块","题号","得分","总分","积分",
  "基础分","速度名次","速度奖励","薄弱点","学生作答","结果",
  "教师批改","批改状态","课堂session","房间","原始提交时间","题目说明"
];

function doPost(e) {
  try {
    JSONP_CALLBACK = "";
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var d = parsePayload_(e);
    if (d.action === "save_score") return saveScore_(ss, d);
    if (d.action === "mark_reviewed") return markReviewed_(ss, d);
    return appendRecord_(ss, d);
  } catch (err) {
    return json_({ status: "error", message: String(err) });
  }
}

function doGet(e) {
  try {
    JSONP_CALLBACK = (e.parameter && e.parameter.callback) || "";
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var a = (e.parameter && e.parameter.action) || "get_all";
    if (a === "list_sheets") return json_({ status: "ok", sheets: ss.getSheets().map(function (s) { return s.getName(); }) });
    if (a === "get_data") return json_({ status: "ok", data: readSheet_(ss, e.parameter.lesson || "") });
    if (a === "get_progress") return getProgress_(ss, e.parameter || {});
    if (a === "get_review_queue") return getReviewQueue_(ss, e.parameter || {});
    if (a === "save_score") return saveScore_(ss, e.parameter);
    if (a === "mark_reviewed") return markReviewed_(ss, e.parameter);
    if (a === "get_all") {
      var all = {}, sheets = ss.getSheets();
      for (var i = 0; i < sheets.length; i++) {
        var name = sheets[i].getName();
        if (name === "Sheet1") continue;
        all[name] = rowsToObjects_(sheets[i].getDataRange().getValues());
      }
      return json_({ status: "ok", data: all });
    }
    return json_({ status: "ok", message: "ClassPro+ GAS v2 is running." });
  } catch (err) {
    return json_({ status: "error", message: String(err) });
  }
}

function getReviewQueue_(ss, params) {
  var requested = String(params.lessons || params.lesson || "").split(",").map(function (x) { return x.trim(); }).filter(String);
  if (!requested.length || requested.length > 40) return json_({ status: "error", message: "1-40 lessons are required" });
  var records = [];
  requested.forEach(function (lesson) {
    var sheet = ss.getSheetByName(lesson);
    if (!sheet || sheet.getLastRow() < 2) return;
    var values = sheet.getDataRange().getValues();
    rowsToObjects_(values).forEach(function (row) {
      var raw = row.__values || [];
      if (reviewPending_(raw)) records.push(row);
    });
  });
  return json_({ status: "ok", data: records, lessons: requested.length, generatedAt: new Date().toISOString() });
}

function reviewPending_(row) {
  var stage = progressStage_(row[3]), moduleName = String(row[4] || "").toLowerCase();
  var feedback = String(row[15] || "").trim(), status = String(row[16] || "").toLowerCase();
  if (feedback || status === "reviewed" || status.indexOf("已批改") >= 0 || status.indexOf("已归档") >= 0) return false;
  if (status.indexOf("待") >= 0 || status.indexOf("pending") >= 0) return true;
  if (stage !== "pre_class" && stage !== "post_class") return false;
  return /output|subjective|handwriting|开放|造句|云墙|接龙|任务卡|盲盒|猜词|看图/.test(moduleName);
}

function getProgress_(ss, params) {
  var student = String(params.student || params.name || "").trim();
  var requested = String(params.lessons || params.lesson || "").split(",").map(function (x) { return x.trim(); }).filter(String);
  if (!student) return json_({ status: "error", message: "student is required" });
  if (!requested.length || requested.length > 24) return json_({ status: "error", message: "1-24 lessons are required" });
  var result = {};
  requested.forEach(function (lesson) {
    var sheet = ss.getSheetByName(lesson);
    var rows = sheet && sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues() : [];
    result[lesson] = lessonProgress_(rows, student, lesson);
  });
  return json_({ status: "ok", student: student, lessons: result, generatedAt: new Date().toISOString() });
}

function lessonProgress_(rows, student, lesson) {
  var expectedSessions = /^HSK3-/i.test(lesson) ? ["A", "B", "C"] : [];
  var studentRows = rows.filter(function (row) { return String(row[1] || "") === student; });
  var pre = studentRows.filter(function (row) { return progressStage_(row[3]) === "pre_class"; });
  var preSummaries = pre.filter(function (row) { return String(row[4] || "") === "pre_progress_summary"; });
  var preRate = 0;
  if (preSummaries.length) {
    var preBySession = latestProgressBySession_(preSummaries);
    var preSessions = Object.keys(preBySession);
    if (expectedSessions.length && preSessions.length) {
      preRate = expectedSessions.reduce(function (sum, session) { return sum + (preBySession[session] ? progressSummaryRate_(preBySession[session]) : 0); }, 0) / expectedSessions.length;
    } else {
      preSummaries.sort(function (a, b) { return progressTime_(b) - progressTime_(a); });
      preRate = progressSummaryRate_(preSummaries[0]);
    }
  } else {
    var steps = {}, missionSessions = {};
    pre.forEach(function (row) {
      var moduleName = String(row[4] || ""), match = moduleName.match(/^pre_step_R(\d+)$/i);
      if (match) steps[match[1]] = true;
      if (/最终输出|mission_complete/i.test(moduleName)) {
        var session = progressSession_(row);
        if (session) missionSessions[session] = true;
      }
    });
    var missionRate = expectedSessions.length && Object.keys(missionSessions).length ? Object.keys(missionSessions).length / expectedSessions.length : (pre.some(function (row) { return /最终输出|mission_complete/i.test(String(row[4] || "")); }) ? 1 : 0);
    preRate = Math.max(missionRate, Object.keys(steps).length / 6);
  }

  var issued = {}, answered = {};
  rows.forEach(function (row) {
    if (progressStage_(row[3]) !== "in_class") return;
    var question = String(row[5] || ""), moduleName = String(row[4] || "");
    if (question && moduleName !== "session_summary") issued[question] = true;
    if (moduleName === "session_summary") {
      var summary = progressJson_(row[13]);
      (summary.publishedQuestionIds || []).forEach(function (id) { if (id) issued[String(id)] = true; });
    }
  });
  studentRows.forEach(function (row) {
    if (progressStage_(row[3]) === "in_class" && row[5] && String(row[4] || "") !== "session_summary") answered[String(row[5])] = true;
  });
  var issuedIds = Object.keys(issued);
  var inRate = issuedIds.length ? Object.keys(answered).filter(function (id) { return issued[id]; }).length / issuedIds.length : 0;

  var postSummaries = studentRows.filter(function (row) { return progressStage_(row[3]) === "post_class" && String(row[4] || "") === "homework_summary"; });
  var postRate = 0;
  if (postSummaries.length) {
    if (!expectedSessions.length) postRate = 1;
    else {
      var postBySession = latestProgressBySession_(postSummaries);
      var completedSessions = Object.keys(postBySession).filter(function (session) { return expectedSessions.indexOf(session) >= 0; });
      postRate = completedSessions.length ? completedSessions.length / expectedSessions.length : 1;
    }
  }

  var rates = { pre_class: progressClamp_(preRate), in_class: progressClamp_(inRate), post_class: progressClamp_(postRate) };
  return { rates: rates, complete: rates.pre_class >= 0.7 && rates.in_class >= 0.7 && rates.post_class >= 0.7, records: studentRows.length, issuedQuestions: issuedIds.length };
}

function progressStage_(value) {
  var stage = String(value || "").trim().toLowerCase().replace(/[\s-]/g, "");
  if (stage === "预习" || stage === "课前" || stage === "pre" || stage === "preclass" || stage === "pre_class") return "pre_class";
  if (stage === "课中" || stage === "inclass" || stage === "in_class") return "in_class";
  if (stage === "课后" || stage === "post" || stage === "postclass" || stage === "post_class") return "post_class";
  return stage;
}

function progressJson_(value) {
  if (value && typeof value === "object") return value;
  try { return JSON.parse(String(value || "")); } catch (err) { return {}; }
}

function progressSession_(row) {
  var direct = String(row[17] || "").toUpperCase();
  if (/^[ABC]$/.test(direct)) return direct;
  var match = String(row[5] || "").toUpperCase().match(/(?:HOMEWORK|PREVIEW|SESSION)[_-]([ABC])(?:$|[_-])/);
  if (match) return match[1];
  var data = progressJson_(row[13]), embedded = String(data.session || data.tier || "").toUpperCase();
  return /^[ABC]$/.test(embedded) ? embedded : "";
}

function progressTime_(row) { var time = new Date(row[19] || row[0] || 0).getTime(); return isNaN(time) ? 0 : time; }
function progressClamp_(value) { var n = Number(value); return isNaN(n) ? 0 : Math.max(0, Math.min(1, n > 1 ? n / 100 : n)); }
function progressSummaryRate_(row) {
  var data = progressJson_(row[13]);
  if (data.rate != null) return progressClamp_(data.rate);
  if (data.completed != null && Number(data.required) > 0) return progressClamp_(Number(data.completed) / Number(data.required));
  return Number(row[7]) > 0 ? progressClamp_(Number(row[6]) / Number(row[7])) : 0;
}
function latestProgressBySession_(rows) {
  var out = {};
  rows.slice().sort(function (a, b) { return progressTime_(a) - progressTime_(b); }).forEach(function (row) {
    var session = progressSession_(row);
    if (session) out[session] = row;
  });
  return out;
}

function appendRecord_(ss, d) {
  var lesson = d.lesson || "HSK1-L02";
  var sheet = ensureSheet_(ss, lesson);
  var isOpen = d.openEnded === "yes" || d.needsReview === true || d.needsReview === "true";
  var moduleName = d.action === "session_summary" ? "session_summary" : (d.module || d.mode || "");
  sheet.appendRow([
    new Date(),
    d.studentName || d.name || "",
    lesson,
    d.stage || "课中",
    moduleName,
    d.questionId || "",
    number_(d.score),
    number_(d.total || 1),
    number_(d.points || d.pointsAwarded),
    number_(d.basePoint),
    d.speedRank || "",
    number_(d.speedBonus),
    d.weakPoints || "",
    d.answer || d.text || "",
    d.result || d.autoResult || "",
    d.correction || "",
    isOpen ? "待批改" : "无需批改",
    d.sessionId || "",
    d.room || "",
    d.submittedAt || "",
    d.questionText || d.prompt || d.question || ""
  ]);
  return json_({ status: "ok" });
}

function saveScore_(ss, d) {
  return updateReview_(ss, d, d.score, d.correction || "", "已批改", d.total, d.result);
}

function markReviewed_(ss, d) {
  return updateReview_(ss, d, d.score, d.correction || "", d.reviewStatus || d.status || "已归档", d.total, d.result);
}

function updateReview_(ss, d, score, correction, status, total, result) {
  var sheet = ss.getSheetByName(d.lesson);
  if (!sheet) return json_({ status: "error", message: "lesson sheet not found" });
  var rows = sheet.getDataRange().getValues();
  var directRow = Number(d.rowIndex || d.__rowIndex || 0);
  if (directRow > 1 && directRow <= rows.length) {
    var direct = rows[directRow - 1];
    if (String(direct[1] || "") === String(d.studentName || "")) {
      if (score !== "" && score != null) sheet.getRange(directRow, 7).setValue(score);
      if (total !== "" && total != null) sheet.getRange(directRow, 8).setValue(total);
      if (result) sheet.getRange(directRow, 15).setValue(result);
      sheet.getRange(directRow, 16).setValue(correction);
      sheet.getRange(directRow, 17).setValue(status);
      return json_({ status: "ok", match: "rowIndex" });
    }
  }
  var targetTs = new Date(d.timestamp).getTime();
  var targetOriginalTs = new Date(d.originalSubmittedAt || d.submittedAt || "").getTime();
  var targetQuestion = String(d.questionId || "");
  var targetModule = String(d.module || d.mode || "");
  for (var i = 1; i < rows.length; i++) {
    var rowTs = rows[i][0] instanceof Date ? rows[i][0].getTime() : new Date(rows[i][0]).getTime();
    var rowOriginalTs = new Date(rows[i][19] || "").getTime();
    var sameTime = (!isNaN(targetTs) && Math.abs(rowTs - targetTs) < 3000) ||
      (!isNaN(targetOriginalTs) && !isNaN(rowOriginalTs) && Math.abs(rowOriginalTs - targetOriginalTs) < 3000);
    var sameQuestion = !targetQuestion || String(rows[i][5] || "") === targetQuestion;
    var sameModule = !targetModule || String(rows[i][4] || "") === targetModule;
    if (sameTime && sameQuestion && sameModule && rows[i][1] === d.studentName) {
      if (score !== "" && score != null) sheet.getRange(i + 1, 7).setValue(score);
      if (total !== "" && total != null) sheet.getRange(i + 1, 8).setValue(total);
      if (result) sheet.getRange(i + 1, 15).setValue(result);
      sheet.getRange(i + 1, 16).setValue(correction);
      sheet.getRange(i + 1, 17).setValue(status);
      return json_({ status: "ok" });
    }
  }
  return json_({ status: "error", message: "record not found" });
}

function ensureSheet_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (first[0] !== HEADERS[0]) {
    sheet.clear();
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function readSheet_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  return rowsToObjects_(sheet.getDataRange().getValues());
}

function rowsToObjects_(values) {
  if (!values || values.length < 2) return [];
  var headers = values[0], out = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) row[headers[j]] = values[i][j];
    // Keep raw row values for robust clients. Historical sheets may contain
    // mixed Chinese/mojibake headers; header-based objects can lose or misread
    // fields. __values preserves the actual sheet column order.
    row.__rowIndex = i + 1;
    row.__values = values[i];
    out.push(row);
  }
  return out;
}

function parsePayload_(e) {
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) {}
  }
  return e.parameter || {};
}

function number_(v) {
  var n = Number(v);
  return isNaN(n) ? 0 : n;
}

function json_(obj) {
  if (JSONP_CALLBACK) {
    var safe = String(JSONP_CALLBACK).replace(/[^\w$.]/g, "");
    return ContentService.createTextOutput(safe + "(" + JSON.stringify(obj) + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
