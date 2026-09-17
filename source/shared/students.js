// Course-aware student rosters. Keep HSK1 unchanged; all HSK3 lessons share the current class list.
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

  window.CLASS_ROSTERS = ROSTERS;
  window.ClassProStudentsForLesson = function (lesson) {
    if (/^HSK3-L\d+$/i.test(String(lesson || ""))) return HSK3_DEFAULT.slice();
    return (ROSTERS[lesson] || HSK1_DEFAULT).slice();
  };
  window.CLASS_STUDENTS = window.ClassProStudentsForLesson(currentLesson());
})();
