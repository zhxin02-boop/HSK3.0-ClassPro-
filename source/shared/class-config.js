// Class and roster catalog for the first multi-class pilot.
(function (global) {
  function student(id, name, metadata) { return Object.assign({ id: id, name: name }, metadata || {}); }
  function testRoster(prefix) { return [student(prefix + "-student-test", "Student", { testAccount: true })]; }

  var CLASSES = [
    {
      id: "ai26401-spring",
      code: "AI26401-SPRING",
      name: "留人工智能26401（来华项目-春）",
      teacherId: "zhangxin",
      teacherName: "ZhangXin（张老师）",
      room: "8888",
      levels: ["HSK3"],
      rosters: { HSK3: testRoster("ai26401-spring") }
    },
    {
      id: "rufe-2025-class-4",
      code: "RUFE25-4",
      name: "俄财大25级4班",
      teacherId: "zhangxin",
      teacherName: "ZhangXin（张老师）",
      room: "8888",
      levels: ["HSK1"],
      rosters: { HSK1: testRoster("rufe25-4") }
    },
    {
      id: "ai26401-fall-class-1",
      code: "AI26401-FALL-1",
      name: "留人工智能26401（来华项目-秋）1班",
      teacherId: "wumeiqi",
      teacherName: "WuMeiqi（武老师）",
      room: "8888",
      levels: ["HSK1"],
      rosters: { HSK1: testRoster("ai26401-fall-1") }
    },
    {
      id: "ai26401-fall-class-2",
      code: "AI26401-FALL-2",
      name: "留人工智能26401（来华项目-秋）2班",
      teacherId: "wumeiqi",
      teacherName: "WuMeiqi（武老师）",
      room: "8888",
      levels: ["HSK1"],
      rosters: { HSK1: testRoster("ai26401-fall-2") }
    },
    {
      id: "legacy-default",
      code: "LEGACY",
      name: "历史兼容数据",
      teacherId: "zhangxin",
      teacherName: "ZhangXin（张老师）",
      room: "8888",
      hidden: true,
      levels: ["HSK1", "HSK3"],
      rosters: {
        HSK1: testRoster("rufe25-4"),
        HSK3: testRoster("ai26401-spring")
      }
    }
  ];

  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function get(idOrCode) {
    var key = String(idOrCode || "").trim().toLowerCase();
    for (var i = 0; i < CLASSES.length; i++) {
      if (CLASSES[i].id.toLowerCase() === key || CLASSES[i].code.toLowerCase() === key) return CLASSES[i];
    }
    return null;
  }
  function levelOf(lesson) {
    var match = String(lesson || "").toUpperCase().match(/^(HSK\d)/);
    return match ? match[1] : "default";
  }
  function defaultClassIdForLesson(lesson) { return levelOf(lesson) === "HSK1" ? "rufe-2025-class-4" : "ai26401-spring"; }
  function rosterFor(classId, lesson) {
    var item = get(classId) || get(defaultClassIdForLesson(lesson)), level = levelOf(lesson);
    return copy(item.rosters[level] || item.rosters.default || []);
  }
  function studentIdentity(classId, lesson, name) {
    var students = rosterFor(classId, lesson), target = String(name || "").trim().toLowerCase();
    for (var i = 0; i < students.length; i++) {
      if (students[i].name.toLowerCase() === target) return students[i];
    }
    return { id: "", name: String(name || "").trim() };
  }

  global.ClassProClassCatalog = {
    defaultClassId: "ai26401-spring",
    defaultClassIdForLesson: defaultClassIdForLesson,
    all: function () { return copy(CLASSES.filter(function (item) { return !item.hidden; })); },
    forLevel: function (level) { return copy(CLASSES.filter(function (item) { return !item.hidden && item.levels.indexOf(level) >= 0; })); },
    get: function (idOrCode) { var item = get(idOrCode); return item ? copy(item) : null; },
    roster: rosterFor,
    studentIdentity: studentIdentity
  };
})(window);
