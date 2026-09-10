// Course completion rules shared by the student journey and reports.
(function (global) {
  var REQUIRED_STAGES = ['pre_class', 'in_class', 'post_class'];
  var PASS_RATE = 0.7;

  function normalizeRate(value) {
    var rate = Number(value);
    if (!Number.isFinite(rate)) return 0;
    if (rate > 1) rate = rate / 100;
    return Math.max(0, Math.min(1, rate));
  }

  function evaluate(stageRates) {
    stageRates = stageRates || {};
    var rates = {};
    REQUIRED_STAGES.forEach(function (stage) { rates[stage] = normalizeRate(stageRates[stage]); });
    return {
      threshold: PASS_RATE,
      rates: rates,
      complete: REQUIRED_STAGES.every(function (stage) { return rates[stage] >= PASS_RATE; })
    };
  }

  global.ClassProProgressRules = {
    requiredStages: REQUIRED_STAGES.slice(),
    threshold: PASS_RATE,
    evaluate: evaluate,
    isLessonComplete: function (stageRates) { return evaluate(stageRates).complete; }
  };
})(window);
