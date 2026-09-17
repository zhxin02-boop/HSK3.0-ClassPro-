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
  { id: "HSK3-L04", no: 4, title: "这家宾馆跟别的都不一样", en: "This hotel is unlike any other", page: "004", block: 1, openForUse: true, teacherVisible: true, status: "ready" },
  { id: "HSK3-L05", no: 5, title: "这样的照片才好看", en: "Photos like these are the best", page: "005", block: 1, openForUse: true, teacherVisible: true, status: "ready" },
  { id: "HSK3-L06", no: 6, title: "高铁上还可以点外卖", en: "You can even order takeout on a high-speed train", page: "006", block: 1, openForUse: true, teacherVisible: true, status: "ready" },
  { id: "HSK3-L07", no: 7, title: "那条裙子比短裤更好看", en: "That skirt looks better than the shorts", page: "007", block: 2, openForUse: true, teacherVisible: true, status: "ready" },
  { id: "HSK3-L08", no: 8, title: "今天我出院了", en: "Today I was discharged from the hospital", page: "008", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L09", no: 9, title: "打不好没关系", en: "It doesn't matter if you don't play well", page: "009", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L10", no: 10, title: "你明天再把书还给我", en: "Return the book to me tomorrow", page: "010", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L11", no: 11, title: "看来我没办法解决这个问题", en: "It seems I can't solve this problem", page: "011", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L12", no: 12, title: "这个季节天气变化很快", en: "The weather changes quickly this season", page: "012", block: 2, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L13", no: 13, title: "我的新邻居来自英国", en: "My new neighbors come from the UK", page: "013", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L14", no: 14, title: "这本书被别人借走了", en: "This book is checked out", page: "014", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L15", no: 15, title: "我是半个南京人", en: "I am basically half a Nanjing local", page: "015", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L16", no: 16, title: "我听说有的熊猫出国了", en: "I heard that some pandas went abroad", page: "016", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L17", no: 17, title: "我要多向认真的人学习", en: "I will learn from careful people", page: "017", block: 3, openForUse: false, teacherVisible: true, status: "preparing" },
  { id: "HSK3-L18", no: 18, title: "我学会了包饺子", en: "I've learned how to make jiaozi", page: "018", block: 3, openForUse: false, teacherVisible: true, status: "preparing" }
];

window.HSK3_REPORT_BLOCKS = [
  { id: "HSK3-B01", label: "HSK3 样课阶段", from: 1, to: 3 }
];

window.ClassProAllCurriculum = function () {
  return []
    .concat(window.HSK1_CURRICULUM || [])
    .concat(window.HSK3_CURRICULUM || []);
};
