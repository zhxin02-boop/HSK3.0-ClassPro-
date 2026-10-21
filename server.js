var http = require("http");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var QRCode = require("qrcode");
var progressData = require("./source/shared/progress-data.js");
var authLib = require("./server-auth.js");
var root = __dirname;
var port = Number(process.env.PORT || 18765);
var studentsDir = path.join(root, "data", "students");
var learningRecordsFile = path.join(root, "data", "learning-records.json");
var classRostersFile = process.env.CLASSPRO_CLASS_ROSTERS_FILE || path.join(root, "data", "class-rosters.json");
var sessionSecret = process.env.CLASSPRO_SESSION_SECRET || crypto.randomBytes(32).toString("hex");
var studentAccessKey = crypto.createHash("sha256").update("classpro-student-access|" + sessionSecret).digest();
var STUDENT_ACCESS_COOKIE = "classpro_student_access";
var STUDENT_ACCESS_TTL_MS = 8 * 60 * 60 * 1000;
var teacherAuth = authLib.createAuth({
  accountsFile: process.env.CLASSPRO_TEACHER_ACCOUNTS_FILE || path.join(root, "data", "teacher-accounts.json"),
  sessionSecret: sessionSecret
});
if (!fs.existsSync(studentsDir)) fs.mkdirSync(studentsDir, {recursive:true});
function readLearningRecords() { try { return JSON.parse(fs.readFileSync(learningRecordsFile, "utf8")); } catch(e) { return []; } }
function appendLearningRecord(body) { var rows = readLearningRecords(); rows.push(body); fs.writeFileSync(learningRecordsFile, JSON.stringify(rows, null, 2), "utf8"); }
function readClassRosters() {
  try {
    var parsed = JSON.parse(fs.readFileSync(classRostersFile, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) { return {}; }
}
function rosterLevel(lesson) {
  var match = String(lesson || "").toUpperCase().match(/^(HSK\d)/);
  return match ? match[1] : "default";
}
function privateRoster(classId, lesson) {
  var item = readClassRosters()[String(classId || "")] || {}, levels = item.levels || {};
  var rows = levels[rosterLevel(lesson)] || levels.default || [];
  return Array.isArray(rows) ? rows.filter(function(row) { return row && row.id && row.name; }).map(function(row) {
    return {id:String(row.id), name:String(row.name), testAccount:row.testAccount === true};
  }) : [];
}
function signedStudentValue(payload) {
  var encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return encoded + "." + crypto.createHmac("sha256", studentAccessKey).update(encoded).digest("base64url");
}
function verifiedStudentValue(value, expectedKind) {
  var parts = String(value || "").split(".");
  if (parts.length !== 2) return null;
  var actual = Buffer.from(parts[1]), expected = Buffer.from(crypto.createHmac("sha256", studentAccessKey).update(parts[0]).digest("base64url"));
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
  try {
    var payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return payload.kind === expectedKind && Number(payload.exp) > Date.now() ? payload : null;
  } catch (error) { return null; }
}
function requestCookies(req) {
  return String(req.headers.cookie || "").split(";").reduce(function(out, part) {
    var at = part.indexOf("=");
    if (at >= 0) out[part.slice(0, at).trim()] = decodeURIComponent(part.slice(at + 1).trim());
    return out;
  }, {});
}
function canReadRoster(req, classId) {
  var teacher = teacherAuth.authenticate(req);
  if (teacher && teacherAuth.canAccess(teacher, classId)) return true;
  var access = verifiedStudentValue(requestCookies(req)[STUDENT_ACCESS_COOKIE], "student_access");
  return !!access && access.classId === String(classId || "");
}
function rosterFromReferrer(req) {
  var referrer = String(req.headers.referer || "");
  if (!referrer) return {classId:"", lesson:"", students:[]};
  try {
    var page = new URL(referrer), classId = page.searchParams.get("classId") || page.searchParams.get("class") || "";
    var lesson = page.searchParams.get("lesson") || "";
    if (!/^\/source\//.test(page.pathname) || !classId || !lesson || !canReadRoster(req, classId)) return {classId:"", lesson:"", students:[]};
    return {classId:classId, lesson:lesson, students:privateRoster(classId, lesson)};
  } catch (error) { return {classId:"", lesson:"", students:[]}; }
}
function defaultClassForLesson(lesson) {
  return /^HSK3-/i.test(String(lesson || "")) ? "ai26401-spring" :
    (/^HSK1-/i.test(String(lesson || "")) ? "rufe-2025-class-4" : "legacy-default");
}
function classOf(row) {
  var raw = String(row && (row.classId || row.class) || "").trim();
  if (raw && raw !== "legacy-default") return raw;
  return defaultClassForLesson(row && (row.lesson || row.课程 || row.lessonKey));
}

var mime = {
  ".html": "text/html; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function parseBody(req, cb) {
  var d = "";
  req.on("data", function(c) { d += c; });
  req.on("end", function() {
    try { cb(JSON.parse(d)); } catch(e) { cb(null); }
  });
}

function json(res, code, data) {
  res.writeHead(code, {"Content-Type": "application/json; charset=UTF-8", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type"});
  res.end(JSON.stringify(data));
}

function clientAddress(req) { return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim(); }
function secureRequest(req) { return String(req.headers["x-forwarded-proto"] || "").toLowerCase() === "https"; }
function publicOrigin(req) {
  var protocol = secureRequest(req) ? "https" : "http";
  return protocol + "://" + String(req.headers["x-forwarded-host"] || req.headers.host || "localhost:" + port).split(",")[0].trim();
}
function studentTicket(req, classId, lesson, room, target) {
  return signedStudentValue({
    kind:"student_join", classId:String(classId), lesson:String(lesson), room:String(room || "8888"),
    target:target === "classroom" ? "classroom" : "home", exp:Date.now() + STUDENT_ACCESS_TTL_MS
  });
}
function studentJoinUrl(req, classId, lesson, room, target) {
  return publicOrigin(req) + "/api/student/join?ticket=" + encodeURIComponent(studentTicket(req, classId, lesson, room, target));
}
function setStudentAccessCookie(req, res, classId, expiresAt) {
  var token = signedStudentValue({kind:"student_access", classId:String(classId), exp:Number(expiresAt)});
  var maxAge = Math.max(0, Math.floor((Number(expiresAt) - Date.now()) / 1000));
  res.setHeader("Set-Cookie", STUDENT_ACCESS_COOKIE + "=" + encodeURIComponent(token) + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=" + maxAge + (secureRequest(req) ? "; Secure" : ""));
}
function setLoginCookie(req, res, token) {
  res.setHeader("Set-Cookie", authLib.COOKIE_NAME + "=" + encodeURIComponent(token) + "; HttpOnly; SameSite=Strict; Path=/; Max-Age=" + Math.floor(authLib.SESSION_TTL_MS / 1000) + (secureRequest(req) ? "; Secure" : ""));
}
function clearLoginCookie(req, res) {
  res.setHeader("Set-Cookie", authLib.COOKIE_NAME + "=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" + (secureRequest(req) ? "; Secure" : ""));
}
function teacherPage(url) {
  if (url === "/teacher.html") return true;
  if (url === "/source/teacher" || url === "/source/teacher/" || url === "/source/teacher/index.html") return true;
  if (/^\/source\/teacher-dashboard\/.*\.html$/i.test(url)) return true;
  return /^\/source\/in-class\/.*\.html$/i.test(url) && !/student/i.test(path.basename(url));
}
function staticFilePath(url) {
  var decoded;
  try { decoded = decodeURIComponent(url); } catch (error) { return null; }
  var relative = decoded.replace(/^[\\/]+/, "").replace(/\\/g, "/");
  if (/(^|\/)\./.test(relative)) return null;
  if (/^(data|scripts|docs|backups|references|textbook data|HSK1-extra resources|_publish-staging)(\/|$)/i.test(relative)) return null;
  if (/^(server(?:-auth)?\.js|server-local.*\.log|\.gitignore)$/i.test(relative)) return null;
  var resolved = path.resolve(root, relative);
  return resolved === root || resolved.indexOf(root + path.sep) === 0 ? resolved : null;
}

function readJsonUrl(target, cb, redirects) {
  redirects = redirects || 0;
  var https = require("https"), finished = false;
  function done(error, data) { if (finished) return; finished = true; cb(error, data); }
  var request = https.get(target, function(response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location && redirects < 4) {
      response.resume();
      readJsonUrl(new URL(response.headers.location, target).toString(), cb, redirects + 1);
      return;
    }
    var body = "";
    response.on("data", function(chunk) { body += chunk; });
    response.on("end", function() {
      try { done(null, JSON.parse(body)); } catch (error) { done(error); }
    });
  });
  request.on("error", function(error) { done(error); });
  request.setTimeout(15000, function() { request.destroy(new Error("progress request timeout")); });
}

function readStudent(name, cb) {
  var fp = path.join(studentsDir, name + ".json");
  fs.readFile(fp, function(err, data) {
    if (err) { cb([]); return; }
    try { cb(JSON.parse(data)); } catch(e) { cb([]); }
  });
}

var srv = http.createServer(function(req, res) {
  var method = req.method;
  var url = req.url.split("?")[0];

  if (method === "OPTIONS") {
    res.writeHead(204, {"Access-Control-Allow-Origin":"*", "Access-Control-Allow-Methods":"GET,POST,OPTIONS", "Access-Control-Allow-Headers":"Content-Type"});
    res.end();
    return;
  }

  if (method === "GET" && url === "/api/health") {
    res.setHeader("Cache-Control", "no-store");
    json(res, 200, {
      status: teacherAuth.configured ? "ok" : "error",
      authentication: teacherAuth.configured ? "configured" : "not_configured"
    });
    return;
  }

  if (method === "GET" && url === "/api/class-roster") {
    var rosterQuery = new URL(req.url, "http://localhost").searchParams;
    var rosterClassId = rosterQuery.get("classId") || rosterQuery.get("class") || "";
    var rosterLesson = rosterQuery.get("lesson") || "";
    res.setHeader("Cache-Control", "no-store");
    if (!rosterClassId || !rosterLesson) { json(res, 400, {status:"error", message:"classId and lesson are required"}); return; }
    if (!canReadRoster(req, rosterClassId)) { json(res, 403, {status:"error", message:"请扫描教师端生成的班级二维码。"}); return; }
    json(res, 200, {status:"ok", classId:rosterClassId, lesson:rosterLesson, students:privateRoster(rosterClassId, rosterLesson)});
    return;
  }

  if (method === "GET" && (url === "/api/teacher/student-join" || url === "/api/teacher/student-qr")) {
    var joinTeacher = teacherAuth.authenticate(req), joinQuery = new URL(req.url, "http://localhost").searchParams;
    var joinClassId = joinQuery.get("classId") || "", joinLesson = joinQuery.get("lesson") || "";
    var joinRoom = joinQuery.get("room") || "8888", joinTarget = joinQuery.get("target") || "home";
    if (!joinTeacher) { json(res, 401, {status:"error", message:"请先登录教师账号。"}); return; }
    if (!teacherAuth.canAccess(joinTeacher, joinClassId)) { json(res, 403, {status:"error", message:"当前教师无权访问该班级。"}); return; }
    if (!privateRoster(joinClassId, joinLesson).length) { json(res, 404, {status:"error", message:"该班级尚未配置私密名单。"}); return; }
    var protectedJoinUrl = studentJoinUrl(req, joinClassId, joinLesson, joinRoom, joinTarget);
    if (url === "/api/teacher/student-join") {
      res.writeHead(302, {Location:protectedJoinUrl, "Cache-Control":"no-store"}); res.end(); return;
    }
    QRCode.toString(protectedJoinUrl, {type:"svg", width:320, margin:2, errorCorrectionLevel:"M"}, function(error, svg) {
      if (error) { json(res, 500, {status:"error", message:"二维码生成失败。"}); return; }
      res.writeHead(200, {"Content-Type":"image/svg+xml; charset=UTF-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff"});
      res.end(svg);
    });
    return;
  }

  if (method === "GET" && url === "/api/student/join") {
    var joinPayload = verifiedStudentValue(new URL(req.url, "http://localhost").searchParams.get("ticket"), "student_join");
    if (!joinPayload || !privateRoster(joinPayload.classId, joinPayload.lesson).length) { json(res, 403, {status:"error", message:"二维码已失效，请重新扫描教师端二维码。"}); return; }
    setStudentAccessCookie(req, res, joinPayload.classId, joinPayload.exp);
    var cleanQuery = new URLSearchParams({classId:joinPayload.classId, lesson:joinPayload.lesson, room:joinPayload.room});
    if (joinPayload.target === "classroom") cleanQuery.set("target", "classroom");
    res.writeHead(302, {Location:"/source/student/entry.html?" + cleanQuery.toString(), "Cache-Control":"no-store", "Referrer-Policy":"no-referrer"});
    res.end();
    return;
  }

  if (method === "POST" && url === "/api/auth/login") {
    parseBody(req, function(body) {
      res.setHeader("Cache-Control", "no-store");
      if (!teacherAuth.configured) { json(res, 503, {status:"error", message:"教师账号尚未配置。"}); return; }
      var result = teacherAuth.login(body && body.username, body && body.password, clientAddress(req));
      if (!result.ok) { json(res, result.status, {status:"error", message:result.message}); return; }
      setLoginCookie(req, res, result.token);
      json(res, 200, {status:"ok", teacher:result.profile, expiresAt:result.expiresAt});
    });
    return;
  }

  if (method === "GET" && url === "/api/auth/me") {
    res.setHeader("Cache-Control", "no-store");
    var currentTeacher = teacherAuth.authenticate(req);
    if (!currentTeacher) { json(res, 401, {status:"error", message:"请先登录教师账号。"}); return; }
    json(res, 200, {status:"ok", teacher:currentTeacher});
    return;
  }

  if (method === "POST" && url === "/api/auth/logout") {
    teacherAuth.logout(req); clearLoginCookie(req, res);
    json(res, 200, {status:"ok"});
    return;
  }

  if (method === "GET" && teacherPage(url)) {
    var pageTeacher = teacherAuth.authenticate(req);
    if (!pageTeacher) {
      var loginTarget = "/source/teacher/login.html?returnTo=" + encodeURIComponent(req.url);
      res.writeHead(302, {Location:loginTarget, "Cache-Control":"no-store"}); res.end(); return;
    }
    var pageClass = new URL(req.url, "http://localhost").searchParams.get("classId");
    if (pageClass && !teacherAuth.canAccess(pageTeacher, pageClass)) { json(res, 403, {status:"error", message:"当前教师无权访问该班级。"}); return; }
  }

  // Save quiz result
  if (method === "POST" && url === "/api/save-result") {
    parseBody(req, function(body) {
      if (!body || !body.name) { json(res, 400, {error:"Missing name"}); return; }
      var record = {
        lesson: body.lesson || "unknown",
        date: new Date().toISOString(),
        score: body.score || 0,
        total: body.total || 0,
        percentage: body.total ? Math.round(body.score/body.total*100) : 0,
        details: body.details || []
      };
      readStudent(body.name, function(records) {
        records.push(record);
        var fp = path.join(studentsDir, body.name + ".json");
        fs.writeFile(fp, JSON.stringify(records, null, 2), function(err) {
          if (err) { json(res, 500, {error:"Save failed"}); return; }
          json(res, 200, {ok:true, record:record});
        });
      });
    });
    return;
  }

  if (method === "GET" && url.indexOf("/api/student/") === 0) {
    var name = decodeURIComponent(url.replace("/api/student/", ""));
    readStudent(name, function(records) {
      json(res, 200, {name:name, records:records});
    });
    return;
  }

  if (method === "GET" && url === "/api/students") {
    fs.readdir(studentsDir, function(err, files) {
      if (err) { json(res, 200, []); return; }
      var students = [];
      var pending = files.filter(function(f) { return f.endsWith(".json"); }).length;
      if (pending === 0) { json(res, 200, []); return; }
      files.filter(function(f) { return f.endsWith(".json"); }).forEach(function(f) {
        var name = f.replace(".json", "");
        readStudent(name, function(records) {
          var last = records.length > 0 ? records[records.length - 1] : null;
          students.push({
            name: name,
            totalAttempts: records.length,
            lastScore: last ? last.score + "/" + last.total : null,
            lastPercentage: last ? last.percentage : null,
            lastLesson: last ? last.lesson : null,
            lastDate: last ? last.date : null
          });
          pending--;
          if (pending === 0) json(res, 200, students);
        });
      });
    });
    return;
  }

  if (method === "GET" && url === "/api/progress") {
    var progressQuery = new URL(req.url, "http://localhost").searchParams;
    var progressName = progressQuery.get("name") || progressQuery.get("student") || "";
    var requestedProgressClass = progressQuery.get("classId") || "";
    var progressLessons = String(progressQuery.get("lessons") || progressQuery.get("lesson") || "").split(",").map(function(x) { return x.trim(); }).filter(Boolean).slice(0, 24);
    if (!progressName || !progressLessons.length) { json(res, 400, {status:"error", message:"name and lessons are required"}); return; }
    var progressGasUrl = "https://script.google.com/macros/s/AKfycbxrCd6f6cQ3wocXYQZyLKY0JutolEmOWWzTGOABnnHHJOm697OfyBlkLw-SQ-u-9ZAO/exec";
    var localProgressRows = readLearningRecords(), lessonResults = {}, queue = progressLessons.slice(), pendingWorkers = Math.min(4, queue.length);
    function finishProgressWorker() {
      pendingWorkers--;
      if (pendingWorkers > 0) return;
      json(res, 200, {status:"ok", source:"google_sheets_with_local_fallback", student:progressName, lessons:lessonResults});
    }
    function progressWorker() {
      var lesson = queue.shift();
      if (!lesson) { finishProgressWorker(); return; }
      var progressClass = requestedProgressClass || defaultClassForLesson(lesson);
      var localRows = localProgressRows.filter(function(row) { return classOf(row) === progressClass && String(row.lesson || row.课程 || row.lessonKey || "") === lesson; });
      readJsonUrl(progressGasUrl + "?action=get_data&lesson=" + encodeURIComponent(lesson) + "&classId=" + encodeURIComponent(progressClass), function(error, data) {
        var remoteRows = !error && data && Array.isArray(data.data) ? data.data : [];
        lessonResults[lesson] = progressData.fromRows(remoteRows.concat(localRows), {student:progressName, lesson:lesson});
        progressWorker();
      });
    }
    for (var progressWorkerIndex = 0; progressWorkerIndex < pendingWorkers; progressWorkerIndex++) progressWorker();
    return;
  }

  // Proxy: fetch reviews from GAS
  if (method === "GET" && (url === "/api/reviews" || url === "/api/teacher/reviews")) {
    var gasUrl = 'https://script.google.com/macros/s/AKfycbxrCd6f6cQ3wocXYQZyLKY0JutolEmOWWzTGOABnnHHJOm697OfyBlkLw-SQ-u-9ZAO/exec';
    var query = new URL(req.url, "http://localhost").searchParams;
    var name = query.get("name") || "";
    var source = query.get("source") || "";
    var requestedLesson = query.get("lesson") || "";
    var requestedClass = query.get("classId") || (requestedLesson ? defaultClassForLesson(requestedLesson) : "");
    if (url === "/api/teacher/reviews") {
      var reviewTeacher = teacherAuth.authenticate(req);
      if (!reviewTeacher) { json(res, 401, {status:"error", message:"请先登录教师账号。"}); return; }
      if (!requestedClass || !teacherAuth.canAccess(reviewTeacher, requestedClass)) { json(res, 403, {status:"error", message:"当前教师无权读取该班级。"}); return; }
    }
    var allLocalRows = readLearningRecords();
    var localRows = allLocalRows.map(function(x, i) {
      x.__rowIndex = i + 1;
      return x;
    }).filter(function(x){
      var rowName = String(x.姓名||x.studentName||x.name||"");
      var rowLesson = String(x.lesson||x.课程||x.lessonKey||"");
      return (!requestedClass || classOf(x) === requestedClass) && (!name || rowName === String(name)) && (!requestedLesson || rowLesson === requestedLesson);
    });
    var replied = false;
    function reply(status, payload) { if (replied) return; replied = true; json(res, status, payload); }
    function localFallback() { reply(200, {status:"ok", source:"local", data:localRows}); }
    if (source === "local" || (url === "/api/reviews" && !requestedLesson)) { localFallback(); return; }
    var reviewSourceUrl = requestedLesson
      ? gasUrl + "?action=get_data&lesson=" + encodeURIComponent(requestedLesson) + "&classId=" + encodeURIComponent(requestedClass)
      : gasUrl + "?action=get_all&classId=" + encodeURIComponent(requestedClass);
    readJsonUrl(reviewSourceUrl, function(error, data) {
        if (error || !data || data.status !== "ok") { localFallback(); return; }
        try {
          var remoteRows = [];
          if (Array.isArray(data.data)) remoteRows = data.data.slice();
          else for (var group in data.data) (data.data[group]||[]).forEach(function(x) { remoteRows.push(x); });
          function reviewName(x) { return String(x.studentName || x.name || x['\u59d3\u540d'] || ""); }
          function reviewKey(x) {
            return [reviewName(x), x.lesson || x.lessonKey || x['\u8bfe\u7a0b'] || "", x.module || x.mode || x['\u6a21\u5757'] || "", x.questionId || x['\u9898\u76eeID'] || "", x.submittedAt || x.timestamp || x['\u63d0\u4ea4\u65f6\u95f4'] || ""].join("|");
          }
          var seen = Object.create(null), merged = [];
          remoteRows.concat(localRows).forEach(function(x) {
            if (name && reviewName(x) !== String(name)) return;
            var key = reviewKey(x);
            if (!seen[key]) { seen[key] = true; merged.push(x); }
          });
          reply(200, {status:"ok", source:"google_sheets_and_local", remoteRecords:remoteRows.length, localRecords:localRows.length, data:merged});
        } catch(e) { localFallback(); }
    });
    return;
  }

  // Local test proxy for teacher feedback. Production uses the GAS mark_reviewed action.
  if (method === "POST" && url === "/api/mark-reviewed") {
    parseBody(req, function(body) {
      var reviewTeacher = teacherAuth.authenticate(req);
      var reviewClass = classOf(body || {});
      if (!reviewTeacher) { json(res, 401, {status:"error", message:"请先登录教师账号。"}); return; }
      if (!teacherAuth.canAccess(reviewTeacher, reviewClass)) { json(res, 403, {status:"error", message:"当前教师无权批改该班级。"}); return; }
      var rows = readLearningRecords();
      var target = new Date(body && body.timestamp || "").getTime();
      var targetQuestion = String(body && body.questionId || "");
      var targetModule = String(body && body.module || "");
      var targetLesson = String(body && body.lesson || "");
      var found = false;
      var directIndex = Number(body && (body.rowIndex || body.__rowIndex) || 0);
      if (directIndex > 0 && directIndex <= rows.length) {
        var direct = rows[directIndex - 1];
        var directStudent = String(direct.studentName || direct.姓名 || direct.name || "");
        if (classOf(direct) === classOf(body) && directStudent === String(body.studentName || "")) {
          direct.correction = body.correction || "已查看。";
          direct.teacherFeedback = direct.correction;
          if (body.score !== undefined) direct.score = Number(body.score);
          if (body.total !== undefined) direct.total = Number(body.total);
          if (body.result) direct.result = body.result;
          direct.status = body.status || body.reviewStatus || "已归档";
          direct.reviewStatus = body.reviewStatus || body.status || "已归档";
          found = true;
        }
      }
      rows.forEach(function(x) {
        if (found) return;
        var student = String(x.studentName || x.姓名 || x.name || "");
        var lesson = String(x.lesson || x.课程 || x.lessonKey || "");
        var question = String(x.questionId || x.题号 || "");
        var module = String(x.module || x.mode || x.模块 || "");
        var stamp = new Date(x.submittedAt || x.receivedAt || x.timestamp || "").getTime();
        var sameTime = !isNaN(target) && !isNaN(stamp) ? Math.abs(target - stamp) < 5000 : false;
        var sameQuestion = !targetQuestion || question === targetQuestion;
        var sameModule = !targetModule || module === targetModule;
        var sameLesson = !targetLesson || lesson === targetLesson;
        if (classOf(x) === classOf(body) && student === String(body.studentName || "") && sameLesson && sameQuestion && sameModule && sameTime) {
          x.correction = body.correction || "已查看。";
          x.teacherFeedback = x.correction;
          if (body.score !== undefined) x.score = Number(body.score);
          if (body.total !== undefined) x.total = Number(body.total);
          if (body.result) x.result = body.result;
          x.status = body.status || body.reviewStatus || "已归档";
          x.reviewStatus = body.reviewStatus || body.status || "已归档";
          found = true;
        }
      });
      if (found) { try { fs.writeFileSync(learningRecordsFile, JSON.stringify(rows, null, 2), "utf8"); } catch(e) { json(res, 500, {status:"error", message:e.message}); return; } }
      json(res, found ? 200 : 404, {status:found ? "ok" : "error", message:found ? "review saved" : "record not found"});
    });
    return;
  }

  // Proxy pre-class subjective records to GAS, so file:// and localhost pages do not call GAS directly.
  if (method === "POST" && url === "/api/pre-class-record") {
    parseBody(req, function(body) {
      if (!body) { json(res, 400, {error:"Invalid JSON"}); return; }
      try {
        if (!body.classId || body.classId === "legacy-default") body.classId = defaultClassForLesson(body.lesson);
        appendLearningRecord(body);
        json(res, 200, {status:"ok", source:"local"});
      } catch(e) {
        json(res, 500, {status:"error", error:"local record failed"});
        console.log("local record", e.message);
        return;
      }
      var gasUrl = 'https://script.google.com/macros/s/AKfycbxrCd6f6cQ3wocXYQZyLKY0JutolEmOWWzTGOABnnHHJOm697OfyBlkLw-SQ-u-9ZAO/exec';
      var https = require("https");
      var payload = JSON.stringify(body);
      var proxyReq = https.request(gasUrl, {method:"POST", headers:{"Content-Type":"application/json", "Content-Length":Buffer.byteLength(payload)}}, function(gres) {
        var d = "";
        gres.on("data", function(c) { d += c; });
        gres.on("end", function() { console.log("GAS pre-class forward", gres.statusCode || 200); });
      });
      proxyReq.on("error", function(e) { console.log("GAS pre-class forward failed", e.message); });
      proxyReq.write(payload);
      proxyReq.end();
    });
    return;
  }

  if (url === "/") url = "/index.html";
  var fp = staticFilePath(url);
  if (!fp) { res.writeHead(404, {"Content-Type":"text/plain; charset=UTF-8", "Cache-Control":"no-store"}); res.end("Not found"); return; }
  fs.readFile(fp, function(err, data) {
    if (err) { res.writeHead(404, {"Content-Type":"text/plain"}); res.end("Not found"); return; }
    var ext = path.extname(fp);
    var body = data, headers = {"Content-Type": mime[ext] || "text/plain; charset=UTF-8"};
    if (url === "/source/shared/students.js") {
      var scopedRoster = rosterFromReferrer(req);
      body = "window.ClassProServerRoster=" + JSON.stringify(scopedRoster).replace(/</g, "\\u003c") + ";\n" + data.toString("utf8");
      headers["Cache-Control"] = "no-store";
    }
    res.writeHead(200, headers);
    res.end(body);
  });
});

srv.listen(port, "0.0.0.0", function() {
  console.log("Server running at http://localhost:" + port);
  console.log("API: POST /api/save-result, GET /api/student/:name, GET /api/students");
});
