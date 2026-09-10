// Shared course catalog for student and teacher entry pages.
(function (global) {
  var LEVELS = [
    { id: "HSK1", name: "HSK 1级", desc: "入门级课程 / Beginner", source: "HSK1_CURRICULUM" },
    { id: "HSK2", name: "HSK 2级", desc: "初级课程 / Elementary", source: "HSK2_CURRICULUM" },
    { id: "HSK3", name: "HSK 3级", desc: "中级课程 / Intermediate", source: "HSK3_CURRICULUM" },
    { id: "HSK4", name: "HSK 4级", desc: "中高级课程 / Upper-Intermediate", source: "HSK4_CURRICULUM" },
    { id: "HSK5", name: "HSK 5级", desc: "高级课程 / Advanced", source: "HSK5_CURRICULUM" }
  ];

  function levelOf(lessonId) {
    var match = String(lessonId || "").match(/^HSK[1-9]/);
    return match ? match[0] : "";
  }

  function levels() {
    return LEVELS.map(function (level) {
      var copy = Object.assign({}, level);
      copy.lessons = lessons(level.id);
      return copy;
    });
  }

  function lessons(levelId) {
    var level = LEVELS.filter(function (item) { return item.id === levelId; })[0];
    var list = level && global[level.source];
    return Array.isArray(list) ? list.slice() : [];
  }

  function all() {
    return LEVELS.reduce(function (result, level) {
      return result.concat(lessons(level.id));
    }, []);
  }

  function get(lessonId) {
    var list = lessons(levelOf(lessonId));
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === lessonId) return list[i];
    }
    return null;
  }

  global.ClassProCourseCatalog = {
    levels: levels,
    lessons: lessons,
    all: all,
    get: get,
    levelOf: levelOf
  };

  // Compatibility for pages that have not migrated to the shared catalog yet.
  global.ClassProAllCurriculum = function () { return all(); };
})(window);
