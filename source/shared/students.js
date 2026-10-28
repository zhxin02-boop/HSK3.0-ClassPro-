// Class-aware student rosters. Legacy arrays remain as a fallback for old pages.
(function () {
  var HSK1_DEFAULT = ["Student"];
  var HSK3_DEFAULT = ["Student"];
  var ROSTERS = {};

  function currentLesson() {
    var q = new URLSearchParams(location.search);
    var ctx = window.ClassProContext ? window.ClassProContext.read() : {};
    return q.get("lesson") || ctx.lesson || "HSK1-L01";
  }

  function currentClass() {
    var q = new URLSearchParams(location.search);
    var ctx = window.ClassProContext ? window.ClassProContext.read() : {};
    var defaultClass = window.ClassProClassCatalog && window.ClassProClassCatalog.defaultClassIdForLesson
      ? window.ClassProClassCatalog.defaultClassIdForLesson(currentLesson())
      : "legacy-default";
    return q.get("classId") || q.get("class") || ctx.classId || defaultClass;
  }

  var serverRoster = window.ClassProServerRoster;
  if (serverRoster && serverRoster.classId === currentClass() && Array.isArray(serverRoster.students) && window.ClassProClassCatalog) {
    var serverLevel = (/^(HSK\d)/i.exec(serverRoster.lesson || "") || [])[1] || "default";
    window.ClassProClassCatalog.setRoster(serverRoster.classId, serverLevel, serverRoster.students);
  }

  window.CLASS_ROSTERS = ROSTERS;
  window.ClassProStudentsForLesson = function (lesson, classId) {
    if (serverRoster && serverRoster.classId === (classId || currentClass()) && Array.isArray(serverRoster.students) && serverRoster.students.length) return serverRoster.students.map(function (student) { return student.name; });
    if (window.ClassProClassCatalog) {
      var names = window.ClassProClassCatalog.roster(classId || currentClass(), lesson).map(function (student) { return student.name; });
      if (names.length) return names;
    }
    if (/^HSK3-L\d+$/i.test(String(lesson || ""))) return HSK3_DEFAULT.slice();
    return (ROSTERS[lesson] || HSK1_DEFAULT).slice();
  };
  window.ClassProStudentIdentity = function (name, lesson, classId) {
    if (serverRoster && serverRoster.classId === (classId || currentClass()) && Array.isArray(serverRoster.students)) {
      var target = String(name || "").trim().toLowerCase(), found = serverRoster.students.filter(function (student) { return student.name.toLowerCase() === target; })[0];
      if (found) return found;
    }
    if (window.ClassProClassCatalog) return window.ClassProClassCatalog.studentIdentity(classId || currentClass(), lesson || currentLesson(), name);
    return { id: "", name: String(name || "").trim() };
  };
  window.CLASS_STUDENTS = window.ClassProStudentsForLesson(currentLesson(), currentClass());
})();
