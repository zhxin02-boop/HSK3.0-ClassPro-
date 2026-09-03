// HSK3 curriculum metadata. Detailed content is loaded from standard lesson JSON files.
window.HSK3_CURRICULUM = [
  {
    id: "HSK3-L01",
    no: 1,
    title: "我们去机场接你们",
    en: "We will pick you up at the airport",
    page: "001",
    block: 1,
    openForUse: true,
    teacherVisible: true,
    status: "sample"
  },
  {
    id: "HSK3-L02",
    no: 2,
    title: "你们想吃什么就点什么",
    en: "You can order whatever you feel like",
    page: "002",
    block: 1,
    openForUse: true,
    teacherVisible: true,
    status: "ready"
  },
  { id: "HSK3-L03", no: 3, title: "这个小区挺好的", en: "This neighborhood is pretty nice", page: "003", block: 1, openForUse: true, teacherVisible: true, status: "ready" },
  { id: "HSK3-L04", no: 4, title: "第4课", en: "Lesson 4", page: "004", block: 1, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L05", no: 5, title: "第5课", en: "Lesson 5", page: "005", block: 1, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L06", no: 6, title: "第6课", en: "Lesson 6", page: "006", block: 1, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L07", no: 7, title: "第7课", en: "Lesson 7", page: "007", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L08", no: 8, title: "第8课", en: "Lesson 8", page: "008", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L09", no: 9, title: "第9课", en: "Lesson 9", page: "009", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L10", no: 10, title: "第10课", en: "Lesson 10", page: "010", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L11", no: 11, title: "第11课", en: "Lesson 11", page: "011", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L12", no: 12, title: "第12课", en: "Lesson 12", page: "012", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L13", no: 13, title: "第13课", en: "Lesson 13", page: "013", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L14", no: 14, title: "第14课", en: "Lesson 14", page: "014", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L15", no: 15, title: "第15课", en: "Lesson 15", page: "015", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L16", no: 16, title: "第16课", en: "Lesson 16", page: "016", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L17", no: 17, title: "第17课", en: "Lesson 17", page: "017", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L18", no: 18, title: "第18课", en: "Lesson 18", page: "018", block: 3, openForUse: false, teacherVisible: true, status: "preparing" }
];

window.HSK3_REPORT_BLOCKS = [
  { id: "HSK3-B01", label: "HSK3 样课阶段", from: 1, to: 3 }
];

window.ClassProAllCurriculum = function () {
  return []
    .concat(window.HSK1_CURRICULUM || [])
    .concat(window.HSK3_CURRICULUM || []);
};
