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
      rosters: { HSK3: [
        student("ai26401-spring-01", "MTEWELE THEOFRIDA PHILEMON"),
        student("ai26401-spring-02", "LILLA LISA APSA"),
        student("ai26401-spring-03", "MTUI ELISIA LAURENCE"),
        student("ai26401-spring-04", "MTAMBI ALBERT EVANS"),
        student("ai26401-spring-05", "MAKAA ATHUMAN SHABANI"),
        student("ai26401-spring-06", "BURIAN JERALD JURGEN"),
        student("ai26401-spring-07", "MABAMBA PAULINE ILDEPHONCE"),
        student("ai26401-spring-08", "MACHIRA MACHIRA SULEIMAN"),
        student("ai26401-spring-09", "JAIPONG MISS SIRIWAN"),
        student("ai26401-spring-10", "CHERYL GRACIA WIJAYA"),
        student("ai26401-spring-11", "NI PUTU LUNA CAHYA DEWI"),
        student("ai26401-spring-12", "Ali Altphan"),
        student("ai26401-spring-student-test", "Student", { testAccount: true })
      ] }
    },
    {
      id: "rufe-2025-class-4",
      code: "RUFE25-4",
      name: "俄财大25级4班",
      teacherId: "zhangxin",
      teacherName: "ZhangXin（张老师）",
      room: "8888",
      levels: ["HSK1"],
      rosters: { HSK1: [
        student("rufe25-4-01", "DYMSHITS IRINA"),
        student("rufe25-4-02", "KADZHIMAGOMAEV SHAMKHAL"),
        student("rufe25-4-03", "KARAZHANOVA XENIYA"),
        student("rufe25-4-04", "MANTUROV MATVEY"),
        student("rufe25-4-05", "MARCHENKO ILIA"),
        student("rufe25-4-06", "NOVAK MARIIA"),
        student("rufe25-4-07", "ODERII VLADIMIR"),
        student("rufe25-4-08", "SKVORTSOVA MARIIA"),
        student("rufe25-4-09", "ABRAMOVA SOFIA"),
        student("rufe25-4-10", "ALEKSEEVA ANNA"),
        student("rufe25-4-11", "GRIBANOVA ALEKSANDRA"),
        student("rufe25-4-12", "ZERNINA ANNA"),
        student("rufe25-4-13", "KOZLOVA ANASTASIIA"),
        student("rufe25-4-14", "KRUGLIASHOVA ANASTASIIA"),
        student("rufe25-4-15", "PAKHOLENKO IULIIA"),
        student("rufe25-4-16", "ULITINA SOFIA"),
        student("rufe25-4-17", "SHLIAKHTIN MAKSIM"),
        student("rufe25-4-18", "Test", { testAccount: true }),
        student("rufe25-4-student-test", "Student", { testAccount: true })
      ] }
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
    var level = levelOf(lesson), item = get(classId), students = item && (item.rosters[level] || item.rosters.default);
    if (!students || !students.length) {
      item = get(defaultClassIdForLesson(lesson));
      students = item && (item.rosters[level] || item.rosters.default);
    }
    return copy(students || []);
  }
  function setRoster(classId, level, rows) {
    var item = get(classId), key = String(level || "default").toUpperCase();
    if (!item || !Array.isArray(rows)) return false;
    item.rosters[key] = copy(rows.filter(function (row) { return row && row.id && row.name; }));
    return true;
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
    setRoster: setRoster,
    studentIdentity: studentIdentity
  };
})(window);
