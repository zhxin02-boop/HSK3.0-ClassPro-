var http = require("http");
var fs = require("fs");
var path = require("path");
var root = __dirname;
var port = 18765;
var studentsDir = path.join(root, "data", "students");
var learningRecordsFile = path.join(root, "data", "learning-records.json");
if (!fs.existsSync(studentsDir)) fs.mkdirSync(studentsDir, {recursive:true});
function readLearningRecords() { try { return JSON.parse(fs.readFileSync(learningRecordsFile, "utf8")); } catch(e) { return []; } }
function appendLearningRecord(body) { var rows = readLearningRecords(); rows.push(body); fs.writeFileSync(learningRecordsFile, JSON.stringify(rows, null, 2), "utf8"); }

var mime = {
  ".html": "text/html; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
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

  // Proxy: fetch reviews from GAS
  if (method === "GET" && url === "/api/reviews") {
    var gasUrl = 'https://script.google.com/macros/s/AKfycbxrCd6f6cQ3wocXYQZyLKY0JutolEmOWWzTGOABnnHHJOm697OfyBlkLw-SQ-u-9ZAO/exec';
    var name = decodeURIComponent((req.url.split("?")[1]||"").replace(/name=/,""));
    var localRows = readLearningRecords().filter(function(x){return String(x.姓名||x.studentName||x.name||"")===String(name)});
    if (localRows.length) { json(res, 200, {status:"ok", data:localRows}); return; }
    var https = require("https");
    https.get(gasUrl + "?action=get_all", function(gres) {
      var d = "";
      gres.on("data", function(c) { d += c; });
      gres.on("end", function() {
        try {
          var data = JSON.parse(d);
          if (data.status === "ok" && name) {
            var all = [];
            for (var k in data.data) {
              data.data[k].forEach(function(x) { all.push(x); });
            }
            data = {status:"ok", data:all.filter(function(x){return String(x.姓名||x.studentName||x.name||"")===String(name)})};
          }
          json(res, 200, data);
        } catch(e) { json(res, 500, {error:"Parse failed"}); }
      });
    }).on("error", function(e) { json(res, 502, {error:e.message}); }).setTimeout(8000, function(){ this.destroy(new Error("GAS request timeout")); });
    return;
  }

  // Proxy pre-class subjective records to GAS, so file:// and localhost pages do not call GAS directly.
  if (method === "POST" && url === "/api/pre-class-record") {
    parseBody(req, function(body) {
      if (!body) { json(res, 400, {error:"Invalid JSON"}); return; }
      try { appendLearningRecord(body); } catch(e) { console.log("local record", e.message); }
      var gasUrl = 'https://script.google.com/macros/s/AKfycbxrCd6f6cQ3wocXYQZyLKY0JutolEmOWWzTGOABnnHHJOm697OfyBlkLw-SQ-u-9ZAO/exec';
      var https = require("https");
      var payload = JSON.stringify(body);
      var proxyReq = https.request(gasUrl, {method:"POST", headers:{"Content-Type":"application/json", "Content-Length":Buffer.byteLength(payload)}}, function(gres) {
        var d = "";
        gres.on("data", function(c) { d += c; });
        gres.on("end", function() { try { json(res, gres.statusCode || 200, JSON.parse(d)); } catch(e) { json(res, 200, {status:"ok", raw:d}); } });
      });
      proxyReq.on("error", function(e) { json(res, 502, {error:e.message}); });
      proxyReq.write(payload);
      proxyReq.end();
    });
    return;
  }

  if (url === "/") url = "/index.html";
  var fp = path.join(root, decodeURIComponent(url));
  fs.readFile(fp, function(err, data) {
    if (err) { res.writeHead(404, {"Content-Type":"text/plain"}); res.end("Not found"); return; }
    var ext = path.extname(fp);
    res.writeHead(200, {"Content-Type": mime[ext] || "text/plain; charset=UTF-8"});
    res.end(data);
  });
});

srv.listen(port, "0.0.0.0", function() {
  console.log("Server running at http://localhost:" + port);
  console.log("API: POST /api/save-result, GET /api/student/:name, GET /api/students");
});
