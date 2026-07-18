// ClassPro+ shared learning record model
// 统一课前、课中、课后学习记录。页面可以逐步接入，不要求一次性重构。
(function (global) {
  var ClassProShared = global.ClassProShared || (global.ClassProShared = {});

  function nowIso() {
    return new Date().toISOString();
  }

  function bool(v) {
    return v === true || v === "true" || v === 1 || v === "1";
  }

  function learningRecord(input) {
    input = input || {};
    var score = Number(input.score);
    var total = Number(input.total);
    return {
      lesson: input.lesson || "HSK1-L02",
      stage: input.stage || "in_class",
      module: input.module || input.mode || "",
      mode: input.mode || input.module || "",
      questionId: input.questionId || "",
      studentName: input.studentName || input.name || "",
      answer: input.answer == null ? "" : input.answer,
      score: isNaN(score) ? 0 : score,
      total: isNaN(total) ? 0 : total,
      points: Number(input.points || input.pointsAwarded || 0) || 0,
      result: input.result || input.autoResult || "submitted",
      needsReview: bool(input.needsReview),
      reviewStatus: input.reviewStatus || (bool(input.needsReview) ? "待批改" : "无需批改"),
      teacherFeedback: input.teacherFeedback || input.correction || "",
      weakPoints: input.weakPoints || "",
      sessionId: input.sessionId || "",
      room: input.room || "",
      submittedAt: input.submittedAt || nowIso()
    };
  }

  function homeworkSummary(input) {
    input = input || {};
    return learningRecord({
      lesson: input.lesson || "HSK1-L02",
      stage: "post_class",
      module: "homework_summary",
      mode: "homework_summary",
      questionId: input.questionId || ("homework_" + (input.tier || "")),
      studentName: input.studentName || "",
      score: input.objectiveCorrect || 0,
      total: input.objectiveTotal || 0,
      points: input.objectiveCorrect || 0,
      result: "submitted",
      needsReview: Number(input.pendingReview || 0) > 0,
      answer: JSON.stringify({
        tier: input.tier || "",
        taskCount: input.taskCount || 0,
        objectiveCorrect: input.objectiveCorrect || 0,
        objectiveTotal: input.objectiveTotal || 0,
        pendingReview: input.pendingReview || 0
      }),
      submittedAt: input.submittedAt || nowIso()
    });
  }

  ClassProShared.learningRecord = learningRecord;
  ClassProShared.homeworkSummary = homeworkSummary;
})(window);
