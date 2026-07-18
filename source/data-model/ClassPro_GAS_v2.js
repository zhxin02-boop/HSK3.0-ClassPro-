// Chinese ClassPro+ unified data storage for Google Apps Script
// Deploy as Web App. Execute as: Me. Access: Anyone with the link.

var SHEET_ID = "1ILjSScbsUKwh7za0iEzRcHWOJf3QnonrTaIafEkbhiw";
var HEADERS = [
  "提交时间","姓名","课程","环节","模块","题号","得分","总分","积分",
  "基础分","速度名次","速度奖励","薄弱点","学生作答","结果",
  "教师批改","批改状态","课堂session","房间","原始提交时间","题目说明"
];

function doPost(e) {
  try {
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
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var a = (e.parameter && e.parameter.action) || "get_all";
    if (a === "list_sheets") return json_({ status: "ok", sheets: ss.getSheets().map(function (s) { return s.getName(); }) });
    if (a === "get_data") return json_({ status: "ok", data: readSheet_(ss, e.parameter.lesson || "") });
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
  return updateReview_(ss, d, d.score, d.correction || "", "已批改");
}

function markReviewed_(ss, d) {
  return updateReview_(ss, d, "", d.correction || "", "已批改");
}

function updateReview_(ss, d, score, correction, status) {
  var sheet = ss.getSheetByName(d.lesson);
  if (!sheet) return json_({ status: "error", message: "lesson sheet not found" });
  var rows = sheet.getDataRange().getValues();
  var targetTs = new Date(d.timestamp).getTime();
  for (var i = 1; i < rows.length; i++) {
    var rowTs = rows[i][0] instanceof Date ? rows[i][0].getTime() : new Date(rows[i][0]).getTime();
    if (Math.abs(rowTs - targetTs) < 3000 && rows[i][1] === d.studentName) {
      if (score !== "") sheet.getRange(i + 1, 7).setValue(score);
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
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
