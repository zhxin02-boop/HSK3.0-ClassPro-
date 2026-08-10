# HSK1 Mock Test 开发方案与数据契约

> 目标：在 ClassPro+ 课中界面新增“测 / Mock Test”板块，用于教师统一组织 HSK1 模拟测试。测试由教师端开放答题和播放音频，学生端只在课堂中进入答题；记录类型单独标记为 `mock_test`，不混入普通课中互动分数。

## 1. 开发顺序

1. 最小可测版本：少量听力题 + 少量阅读题 + 教师开放测试 + 自动计分 + 独立提交记录。
2. 完整 HSK1-mock-01：听力 20 题、阅读 20 题。
3. 教师端测试控制：教师选择测试、开放答题、播放听力、查看测试进度、收卷。
4. 测试报告：学生个人成绩、错题；教师全班统计。
5. 音频正式化：按大题生成音频、人工验收、部署到 GitHub Pages。

## 2. HSK1 题型与题量

听力 20 题：

- 1-5：根据听力选择图片。
- 6-10：根据听力问题选择合适答案。
- 11-15：根据两句对话选择合适图片。
- 16-20：听一个句子，再听问题，选择合适回答。

阅读 20 题：

- 21-25：匹配句子和图片。
- 26-30：匹配问答。
- 31-35：选择合适的词填空。
- 36-40：阅读理解。

## 3. 命题规则

- 词汇来源：优先已学课程词汇，其次 HSK1 目标词汇；未学词原则上不进入 mock test。
- 语法来源：只使用已经讲过的语法结构；扩展结构不得进入全真题。
- 题干必须清楚，答案必须唯一。
- 干扰项要合理，但不能造成多答案。
- 听力文本必须自然、短句为主，语速和停顿符合 HSK1 入门学生。
- 图片题的图片必须直接服务答案，不得出现文字、拼音、水印或明显误导。

## 4. 数据文件

路径建议：

```text
source/data-model/mock-tests/HSK1-mock-01.json
```

页面定位：

```text
source/in-class/teacher.html     教师端新增“测”板块：选择测试、开放答题、播放音频、查看进度与报告
source/in-class/student.html     学生端接收教师开放的 mock_test payload 并答题
source/mock-test/student.html    仅作为早期原型/内部测试页，后续不在学生主页开放
source/mock-test/results.html    可复用为教师报告视图或嵌入教师端
```

产品规则：

- 不在学生主页单独开放 mock test。
- 教师端控制开始、音频播放、结束与提交锁定。
- 学生端只显示当前教师开放的测试。
- 教师端需要全班答题进度、全部答题报告和个人报告。

顶层字段：

```json
{
  "schemaVersion": "mock-test-1.0.0",
  "testId": "HSK1-mock-01",
  "level": "HSK1",
  "title": "HSK1 Mock Test 01",
  "mode": "mock_test",
  "sourcePolicy": "自建题库；样题只作题型参考",
  "audio": [],
  "sections": []
}
```

题目字段：

```json
{
  "id": "L01",
  "number": 1,
  "skill": "listening",
  "part": "L1_picture_choice",
  "prompt": "听录音，选择正确图片。",
  "audioText": "我坐出租车去学校。",
  "question": "",
  "options": [
    {"id": "A", "text": "坐出租车", "image": "..."},
    {"id": "B", "text": "坐飞机", "image": "..."}
  ],
  "answer": "A",
  "points": 1,
  "sourceType": "mock_test",
  "knowledge": ["出租车", "去学校"],
  "status": "draft"
}
```

## 5. 记录字段

每次提交写入一条 `mock_test` 汇总记录；后续可扩展为逐题明细。

```json
{
  "action": "mock_test_submit",
  "recordType": "mock_test",
  "lesson": "HSK1-MOCK-01",
  "testId": "HSK1-mock-01",
  "studentName": "Student",
  "stage": "mock_test",
  "module": "mock_test",
  "score": 6,
  "total": 8,
  "answer": "{\"L01\":\"A\"}",
  "result": "submitted",
  "submittedAt": "ISO time"
}
```

说明：

- `lesson` 使用 `HSK1-MOCK-01`，避免混入普通课程 sheet。
- `stage/module/recordType` 均明确标记 mock test。
- 本地开发写入 `/api/pre-class-record` 的本地记录文件；线上可由 GAS v2 追加到独立 sheet。

## 6. 音频制作

- 首版可以使用浏览器语音合成或教师朗读，只用于流程测试。
- 正式版音频按大题切分，例如 `listening-part-1.mp3`。
- 对话题使用两个人物分行脚本，TTS 时用不同声音生成，再合并。
- 音频上线前检查：普通话、语速、停顿、音量、角色区分、题间间隔。

## 7. 最小可测版本边界

本轮只实现：

- 原型页学生选择姓名；正式课中版改为继承课堂学生身份。
- 加载 `HSK1-mock-01.json`。
- 渲染少量听力和阅读题。
- 自动计分。
- 本地缓存答题进度。
- 提交一条独立 `mock_test` 记录。
- 文档明确“测”应由教师端课中控制开放，不从学生主页单独进入。

本轮暂不实现：

- 严格防作弊锁屏。
- 教师端课中统一开放答题和播放音频的完整闭环。
- 断网续传到 GAS 的完整确认。
- 全班 mock test 数据面板。
