# ClassPro 课中互动 — 工作计划（Phase 1）

> 文档版本：v1.0 | 创建日期：2026-07-07
> 基于旧版 classpro18_template（v12.0）+ spec-v2 统一数据规范

---

## 一、架构总览

教师端（teacher.html） → MQTT → 学生端（pre-class/index.html 升级版）

**师生关系**：教师端发起 → 学生端响应（单向触发，双向通信）

---

## 二、技术决策

| 决策项 | 结论 | 理由 |
|--------|------|------|
| 教师端技术栈 | 纯 JavaScript（弃 Vue 3） | 经验表明 Vue 改起来易出问题；纯 JS 全控制、易修改 |
| 学生端技术栈 | 沿用 ClassReady 的 Vue 3 | 已有代码不动，仅新增模块 |
| 实时通信 | MQTT（HiveMQ）直接沿用 | 旧版已验证可行，稳定可靠 |
| 数据存储 | GAS + Sheets（扩展现有接口） | 已有 doGet/doPost 部署 |
| 教师端改造方式 | 基于 classpro18_template.html 逐模块替换 | 保留 CSS/HTML/骨架/MQTT逻辑，替换 Vue 绑定 |

---

## 三、文件结构

source/in-class/              ← ClassPro 课中互动
  ClassPro_工作计划.md        ← 本文件
  data_L02.js                ← [任务1] HSK1-L2 数据文件
  teacher.html               ← [任务2] 教师端主控面板

source/pre-class/
  index.html                 ← 学生端（将来升级为门户）

source/shared/
  components/                ← 共享组件
    question-card.js         ← 题目卡片组件
    timer-control.js         ← 计时器组件
    leaderboard.js           ← 排行榜组件
  utils/
    mqtt-client.js           ← MQTT 连接管理
    data-recorder.js         ← 答题记录 → GAS

source/data-model/
  spec-v2.md                 ← 统一数据规范
  ClassPro_GAS_代码.js        ← GAS 接口
  HSK1-L02_题库数据.tsv        ← 原始题库（13题）

source/teacher-dashboard/
  review.html                ← 教师批改页（已有）

---

## 四、数据模型（LESSON_DATA 规范）

沿用旧版 data_L20.js 的"数据与引擎分离"模式，一课一个 data_Lxx.js。

```js
window.LESSON_DATA = {
  meta: { level, lessonId, title, characters },
  vocabulary: [ /* 生词数组 */ ],
  texts: [ /* 课文场景 */ ],
  grammar: [ /* 语法点 */ ],
  classProQuestions: {
    v5_vocab_fill: [],   // 选词填空
    g1_ordering: [],     // 连词成句
    pk_question: [],     // PK竞赛
    v7_word_match: [],   // 词了个词
    v8_memory_match: [], // 消消乐
    g4_true_false: [],   // 判断正误
    t2_mission_card: []  // 任务卡
  },
  pk_questions: [],
  word_comparison: [],
  config: { showPinyinByDefault, mqttRoomPrefix, gasUrl }
};
```

---

## 五、Phase 1 工作项（按推荐顺序）

| # | 工作项 | 文件 | 依赖 | 说明 |
|---|--------|------|------|------|
| 1 | HSK1-L2 数据文件 | data_L02.js | 无 | 基于旧版 data_L20.js + spec-v2 题型。最独立，先做 |
| 2 | 教师端主控面板 | teacher.html | 依赖 data_L02.js | 基于 classpro18_template.html 改造。Vue 3 → 纯 JS |
| 3 | 共享组件抽离 | shared/components/ + utils/ | 与任务2并行 | 从旧版抽出 timer/mqtt/data-recorder |
| 4 | 学生端升级为门户 | pre-class/index.html | 依赖任务2 | 单课页面→门户（级别→课表→入口）|
| 5 | 课后报告+数据闭环 | GAS 扩展 | 依赖任务2+4 | 数据聚合、排行榜、报告推送 |

---

## 六、参考资料

| 文件 | 位置 | 用途 |
|------|------|------|
| classpro18_template.html | 旧版 ClassPro/备课工具/ | 教师端模板起点（~210KB, v12.0）|
| data_L20.js | 旧版 ClassPro/备课工具/ | 数据文件模式参考（~85KB）|
| index.html（学生端）| 旧版 ClassPro/备课工具/ | 学生端模式参考（~76KB）|
| spec-v2.md | source/data-model/ | 统一数据规范 |
| HSK1-L02_题库数据.tsv | source/data-model/ | 原始题库13题 |
| ClassPro_练习命题原则.md | 旧版 ClassPro/备课工具/ | 命题原则 |
| ClassPro_GAS_代码.js | source/data-model/ | GAS 接口代码 |

