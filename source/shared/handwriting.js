// ClassPro+ handwriting canvas helpers
(function (global) {
  var ClassProShared = global.ClassProShared || (global.ClassProShared = {});

  function drawGrid(canvas) {
    var ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#edf2df";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.strokeStyle = "#f3eadb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w, h);
    ctx.moveTo(w, 0); ctx.lineTo(0, h);
    ctx.stroke();
  }

  function drawStrokes(canvas, strokes) {
    var ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    drawGrid(canvas);
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    (strokes || []).forEach(function (stroke) {
      if (!stroke || !stroke.length) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * w, stroke[0].y * h);
      for (var i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x * w, stroke[i].y * h);
      ctx.stroke();
    });
  }

  ClassProShared.drawWritingGrid = drawGrid;
  ClassProShared.drawWritingStrokes = drawStrokes;
})(window);
