// Class-aware student rosters. Legacy arrays remain as a fallback for old pages.
(function () {
  var HSK1_DEFAULT = ["DYMSHITS IRINA", "KADZHIMAGOMAEV SHAMKHAL", "KARAZHANOVA XENIYA", "MANTUROV MATVEY", "MARCHENKO ILIA", "NOVAK MARIIA", "ODERII VLADIMIR", "SKVORTSOVA MARIIA", "ABRAMOVA SOFIA", "ALEKSEEVA ANNA", "GRIBANOVA ALEKSANDRA", "ZERNINA ANNA", "KOZLOVA ANASTASIIA", "KRUGLIASHOVA ANASTASIIA", "PAKHOLENKO IULIIA", "ULITINA SOFIA", "SHLIAKHTIN MAKSIM", "Test"];
  var HSK3_DEFAULT = [
    "MTEWELE THEOFRIDA PHILEMON",
    "LILLA LISA APSA",
    "MTUI ELISIA LAURENCE",
    "MTAMBI ALBERT EVANS",
    "MAKAA ATHUMAN SHABANI",
    "BURIAN JERALD JURGEN",
    "MABAMBA PAULINE ILDEPHONCE",
    "MACHIRA MACHIRA SULEIMAN",
    "JAIPONG MISS SIRIWAN",
    "CHERYL GRACIA WIJAYA",
    "NI PUTU LUNA CAHYA DEWI",
    "Ali Altphan"
  ];
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

  window.CLASS_ROSTERS = ROSTERS;
  window.ClassProStudentsForLesson = function (lesson, classId) {
    if (window.ClassProClassCatalog) return window.ClassProClassCatalog.roster(classId || currentClass(), lesson).map(function (student) { return student.name; });
    if (/^HSK3-L\d+$/i.test(String(lesson || ""))) return HSK3_DEFAULT.slice();
    return (ROSTERS[lesson] || HSK1_DEFAULT).slice();
  };
  window.ClassProStudentIdentity = function (name, lesson, classId) {
    if (window.ClassProClassCatalog) return window.ClassProClassCatalog.studentIdentity(classId || currentClass(), lesson || currentLesson(), name);
    return { id: "", name: String(name || "").trim() };
  };
  window.CLASS_STUDENTS = window.ClassProStudentsForLesson(currentLesson(), currentClass());
})();
