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
    page: "TBD",
    block: 1,
    openForUse: false,
    teacherVisible: true,
    status: "planning"
  }
];

window.HSK3_REPORT_BLOCKS = [
  { id: "HSK3-B01", label: "HSK3 样课阶段", from: 1, to: 3 }
];

window.ClassProAllCurriculum = function () {
  return []
    .concat(window.HSK1_CURRICULUM || [])
    .concat(window.HSK3_CURRICULUM || []);
};
