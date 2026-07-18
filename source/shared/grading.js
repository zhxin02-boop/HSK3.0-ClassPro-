// ClassPro+ objective grading helpers
(function (global) {
  var ClassProShared = global.ClassProShared || (global.ClassProShared = {});

  function normalizeAnswer(s) {
    return String(s || "")
      .replace(/[\s\u3000]/g, "")
      .replace(/[。！？!?，,、；;：:（）()]/g, "")
      .toLowerCase();
  }

  function gradeObjective(question, answer) {
    if (!question || question.type === "output" || question.type === "handwriting") {
      return { score: 0, total: 0, result: "submitted" };
    }
    var acceptable = question.acceptable_answers || [question.correct_answer];
    var ok = acceptable.some(function (x) { return normalizeAnswer(x) === normalizeAnswer(answer); });
    return { score: ok ? 1 : 0, total: 1, result: ok ? "correct" : "wrong" };
  }

  ClassProShared.normalizeAnswer = normalizeAnswer;
  ClassProShared.gradeObjective = gradeObjective;
})(window);
