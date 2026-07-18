// Chinese ClassPro（HSK3.0）统一数据存储
// 功能：存储学生数据 + 教师批改页面（含打分+纠错）

var SHEET_ID = "1ILjSScbsUKwh7za0iEzRcHWOJf3QnonrTaIafEkbhiw";
var HEADERS = ["提交时间","姓名","课程","环节","模块","得分","总分","薄弱点","学生作答","教师批改","批改状态","题目说明"];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var d = {};
    if (e.postData && e.postData.contents) {
      try { d = JSON.parse(e.postData.contents); } catch(ex) { d = e.parameter; }
    } else { d = e.parameter; }
    if (d.action === 'save_score') return saveScore(ss, d);
    if (d.action === 'mark_reviewed') return markReviewed(ss, d);
    var ln = d.lesson || 'unknown';
    var sheet = ss.getSheetByName(ln);
    if (!sheet) { sheet = ss.insertSheet(ln); sheet.appendRow(HEADERS); }
    var nr = (d.openEnded === 'yes') ? '待批改' : '无需批改';
    sheet.appendRow([new Date(), d.studentName||'', ln, d.stage||'', d.module||'',
      d.score||0, d.total||0, d.weakPoints||'', d.answer||'', '', nr, d.questionText||d.prompt||d.question||'']);
    return json({status:'ok'});
  } catch(err) { return json({status:'error', message:err.toString()}); }
}

function markReviewed(ss, d) {
  var sheet = ss.getSheetByName(d.lesson);
  if (!sheet) return json({status:'error'});
  var rows = sheet.getDataRange().getValues();
  var targetTs = new Date(d.timestamp).getTime();
  for (var i=1; i<rows.length; i++) {
    var rowTs = rows[i][0] instanceof Date ? rows[i][0].getTime() : new Date(rows[i][0]).getTime();
    if (Math.abs(rowTs - targetTs) < 2000 && rows[i][1] === d.studentName) {
      sheet.getRange(i+1, 10).setValue(d.correction || '');
      sheet.getRange(i+1, 11).setValue('已批改');
      return json({status:'ok'});
    }
  }
  return json({status:'error'});
}

function saveScore(ss, d) {
  var sheet = ss.getSheetByName(d.lesson);
  if (!sheet) return json({status:'error'});
  var rows = sheet.getDataRange().getValues();
  var targetTs = new Date(d.timestamp).getTime();
  for (var i=1; i<rows.length; i++) {
    var rowTs = rows[i][0] instanceof Date ? rows[i][0].getTime() : new Date(rows[i][0]).getTime();
    if (Math.abs(rowTs - targetTs) < 2000 && rows[i][1] === d.studentName) {
      sheet.getRange(i+1, 6).setValue(d.score);
      sheet.getRange(i+1, 10).setValue(d.correction || '');
      sheet.getRange(i+1, 11).setValue('已批改');
      return json({status:'ok'});
    }
  }
  return json({status:'error'});
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var a = e.parameter.action || 'review';
    if (a === 'list_sheets') return json({status:'ok', sheets:ss.getSheets().map(function(s){return s.getName();})});
    if (a === 'get_data') {
      var l = e.parameter.lesson||'';
      var sheet = ss.getSheetByName(l);
      if (!sheet) return json({status:'error'});
      var dd = sheet.getDataRange().getValues();
      var hh = dd[0]; var rr = [];
      for (var i=1; i<dd.length; i++) { var r = {}; for (var j=0; j<hh.length; j++) r[hh[j]] = dd[i][j]; rr.push(r); }
      return json({status:'ok', count:rr.length, data:rr});
    }
    if (a === 'get_all') {
      var all = {}; var sheets = ss.getSheets();
      for (var si=0; si<sheets.length; si++) {
        var sn = sheets[si].getName(); if (sn === 'Sheet1') continue;
        var sd = sheets[si].getDataRange().getValues(); if (sd.length < 2) continue;
        var sh = sd[0]; var sr = [];
        for (var i=1; i<sd.length; i++) { var row = {}; for (var j=0; j<sh.length; j++) row[sh[j]] = sd[i][j]; sr.push(row); }
        all[sn] = sr;
      }
      return json({status:'ok', data:all});
    }
    return HtmlService.createHtmlOutput(buildHtml()).setTitle('ClassPro - 教师批改');
  } catch(err) { return json({status:'error', message:err.toString()}); }
}

function json(obj, e) {
  var cb = e && e.parameter && e.parameter.callback;
  var out = ContentService.createTextOutput(JSON.stringify(obj));
  if (cb) {
    out.setMimeType(ContentService.MimeType.JAVASCRIPT);
    out.setContent(cb + "(" + JSON.stringify(obj) + ")");
  } else {
    out.setMimeType(ContentService.MimeType.JSON);
  }
  return out;
}

function buildHtml() {
  var url = ScriptApp.getService().getUrl();
  var h = "<!DOCTYPE html><html><head><meta charset=UTF-8>";
  h += '<meta name=viewport content="width=device-width,initial-scale=1.0">';
  h += "<title>ClassPro</title><style>";
  h += "body{font-family:sans-serif;background:#f5f0ee;padding:20px;color:#333}";
  h += "h1{font-size:22px;margin:0 0 10px 0}";
  h += "table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;font-size:13px}";
  h += "td,th{padding:8px;border:1px solid #ddd;text-align:left}";
  h += "th{background:#c0392b;color:#fff}";
  h += ".pending{background:#fff3e0}";
  h += ".pl{color:#e67e22;font-weight:600}";
  h += ".inp{width:50px}.fix{width:150px}";
  h += ".mk{padding:4px 10px;border:none;border-radius:6px;cursor:pointer;font-size:12px;background:#27ae60;color:#fff}";
  h += "input{padding:3px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px}";
  h += "</style></head><body><h1>教师批改</h1>";
  h += "<table id=tbl><tr><th>时间</th><th>姓名</th><th>课</th><th>环节</th><th>模块</th><th>得分</th><th>总分</th><th>学生作答</th><th>教师批改</th><th>状态</th><th></th></tr></table>";
  h += "<script>";
  h += "var U=" + JSON.stringify(url) + ";";
  h += "fetch(U+'?action=get_all').then(function(r){return r.json()}).then(function(d){";
  h += "if(d.status!='ok')return;var a=[];";
  h += "for(var k in d.data){d.data[k].forEach(function(x){a.push(x)})}";
  h += "var t=document.getElementById('tbl');";
  h += "for(var i=0;i<a.length;i++){";
  h += "var x=a[i];var r=t.insertRow();";
  h += "if(x.批改状态==='待批改')r.className='pending';";
  h += "r.innerHTML=";
  h += "'<td>'+(x.提交时间||'')+'</td>'";
  h += "+'<td>'+(x.姓名||'')+'</td>'";
  h += "+'<td>'+(x.课程||'')+'</td>'";
  h += "+'<td>'+(x.环节||'')+'</td>'";
  h += "+'<td>'+(x.模块||'')+'</td>'";
  h += "+'<td>'+(x.得分||'')+'</td>'";
  h += "+'<td>'+(x.总分||'')+'</td>'";
  h += "+'<td style=max-width:250px;white-space:normal>'+(x.学生作答||'')+'</td>'";
  h += "+'<td>'+(x.批改状态==='待批改'?'<input class=fix id=f'+i+'>':(x.教师批改||''))+'</td>'";
  h += "+'<td>'+(x.批改状态||'')+'</td>'";
  h += "+'<td>'+(x.批改状态==='待批改'?'<input class=inp id=s'+i+'><button class=mk onclick=\'hc('+i+')\'>批改</button>':'')+'</td>'";
  h += "}});";
  h += "function hc(i){";
  h += "var sc=document.getElementById('s'+i).value||0;";
  h += "var fix=document.getElementById('f'+i).value||'';";
  h += "var row=document.getElementById('tbl').rows[parseInt(i)+1];";
  h += "fetch(U,{method:'POST',body:JSON.stringify({action:'save_score',lesson:row.cells[2].textContent,timestamp:row.cells[0].textContent,studentName:row.cells[1].textContent,score:sc,correction:fix})}).then(function(r){return r.json()}).then(function(d){if(d.status==='ok'){row.className='';row.cells[8].textContent=fix;row.cells[9].textContent='已批改';row.cells[10].innerHTML='';}})";
  h += "}";
  h += "</script></body></html>";
  return h;
}
