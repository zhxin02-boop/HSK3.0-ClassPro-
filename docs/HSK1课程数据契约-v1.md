# HSK1 课程数据契约 v1

## 定位

本契约以 `HSK1-L02` 已验收的教学闭环为标准，服务于后续 `HSK1-L03` 及之后课程。

- 页面负责通用渲染与互动流程；
- 课程文件负责课程内容、题库、开关与作业选择；
- 所有页面通过统一课程上下文读取 `lesson`、`room`、`student`；
- L01 保持现有兼容读取，不为统一格式进行大规模改写；
- 新课程必须按本契约新增数据文件，不能复制或改写页面框架。

## 文件约定

每课一个主数据文件，建议位置：

```text
source/data-model/lessons/HSK1-L03.json
```

L02 迁移完成后也采用同一位置和结构。图片、音频、笔顺等资源只保存相对路径或资源标识，不嵌入页面逻辑。

## 顶层结构

```json
{
  "schemaVersion": "hsk1-course-v1",
  "meta": {},
  "features": {},
  "vocabulary": [],
  "texts": [],
  "grammar": [],
  "preClass": {},
  "inClass": {},
  "postClassHomework": {},
  "report": {}
}
```

## 1. `meta`：课程信息

```json
{
  "level": "HSK1",
  "lessonId": "L03",
  "lessonKey": "HSK1-L03",
  "title": "课程中文标题",
  "titleEn": "English lesson title",
  "topic": "中文主题",
  "topicEn": "English topic",
  "sourceTextPolicy": "教材原句保留；新增内容标记教学扩展"
}
```

`lessonKey` 必须与 URL 上下文中的 `lesson` 一致。

## 2. `features`：模块开关

```json
{
  "pinyin": false,
  "hanziWritingDemo": true,
  "vocabExamples": false,
  "competition": true,
  "postClassHomework": true
}
```

- 拼音功能框架保留，但只有 L01 可设为 `true`；
- L02 与 L03 设为 `false`，页面不显示拼音讲解或拼音练习；
- 汉字书写示范是否显示由 `hanziWritingDemo` 控制。

## 3. `vocabulary`：生词与教学扩展

```json
{
  "id": "v_l03_01",
  "word": "汉字",
  "pinyin": "hànzì",
  "english": "Chinese character",
  "image": "../in-class/images/l03/word-01.png",
  "sourceType": "textbook",
  "examples": [
    {
      "hanzi": "教材或教学扩展句子",
      "pinyin": "...",
      "english": "...",
      "sourceType": "textbook"
    }
  ],
  "collocations": [
    {
      "hanzi": "教学扩展短语",
      "sourceType": "teaching_extension"
    }
  ],
  "writing": {
    "enabled": true,
    "characters": ["汉", "字"]
  }
}
```

规则：教材原句及教材短语使用 `sourceType: "textbook"`；新增例句、练习句和情景对话必须使用 `"teaching_extension"`。

## 4. `texts` 与 `grammar`

课文保留原句、角色、拼音与译文；语法条目保留教学说明与例句来源标记。

```json
{
  "id": "text_l03_01",
  "title": "课文一",
  "scene": "场景说明",
  "lines": [
    {
      "speaker": "王老师",
      "hanzi": "教材原句",
      "pinyin": "...",
      "english": "...",
      "sourceType": "textbook"
    }
  ]
}
```

## 5. `preClass`：课前预习

```json
{
  "questions": [
    {
      "id": "pre_l03_01",
      "type": "choice",
      "module": "词汇理解",
      "question": "题干",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "weakPoints": "目标词或句式",
      "sourceType": "textbook"
    }
  ]
}
```

客观题选项由通用加载器随机排序；不能默认把正确选项固定在 A。

## 6. `inClass`：课中互动

```json
{
  "questionGroups": {
    "image_guess": [],
    "fill_blank": [],
    "ordering": [],
    "sentence_match": [],
    "competition": []
  },
  "hanziWriting": {
    "characters": ["汉", "字"]
  }
}
```

每题至少包含：`id`、`type`、`prompt_cn`、`correct_answer`、`sourceType`。教师端发送与学生端接收使用同一题目 payload；拼音题仅 L01 使用，统一 `mode: "pinyin"`。

## 7. `postClassHomework`：补充作业

```json
{
  "tiers": {
    "A": {"label": "A档：基础巩固", "suggestedMinutes": 15},
    "B": {"label": "B档：标准巩固", "suggestedMinutes": 15},
    "C": {"label": "C档：挑战拓展", "suggestedMinutes": 15}
  },
  "sharedPool": [],
  "tierPools": {"A": [], "B": [], "C": []},
  "assignmentSelection": {"A": [], "B": [], "C": []}
}
```

- 所有题库可完整保留；
- `assignmentSelection` 只列出本次实际展示的题目 ID；
- L02 标准为每档 12 题、约 15 分钟、1 道输出题、1 道汉字书写；
- 同一作业包不得有重复题或重复书写任务；
- 学生最多提交两次，教师默认查看最后一次完整提交。

## 8. `report`：报告字段

```json
{
  "weakPointLabels": {},
  "recommendationRules": {},
  "feedbackTemplates": {}
}
```

页面不应在课程代码中硬编码课程专属报告文案。

## 9. 学习记录统一字段

所有阶段至少写入以下字段：

```json
{
  "lesson": "HSK1-L03",
  "room": "8888",
  "studentName": "Test",
  "stage": "pre_class | in_class | post_class",
  "module": "题型或模块",
  "questionId": "唯一题号",
  "questionText": "题干快照",
  "answer": "学生作答",
  "score": 0,
  "total": 1,
  "result": "correct | wrong | submitted",
  "needsReview": false,
  "reviewStatus": "无需批改 | 待批改 | 已批改",
  "teacherFeedback": "",
  "weakPoints": "",
  "submittedAt": "ISO-8601 时间"
}
```

`lesson`、`room`、`studentName` 不得由页面默认猜测，必须来自统一课程上下文。

## 实施顺序

1. 以本契约创建 L02 标准数据文件；
2. 为页面增加“优先读取标准数据文件、缺失时兼容旧格式”的加载器；
3. 逐页验证 L02 的课前、课中、课后、教师端、数据记录；
4. L01 仅接入兼容层，不改变已验收内容和闭环；
5. 从 L03 开始只新增课程数据文件与资源文件。

## 框架扩展与兼容规则

课程数据优先驱动现有能力，但“只新增数据文件”不是绝对限制。

1. 当新课程只使用已有题型、游戏、作业或报告模块时，只新增课程数据和资源文件；
2. 当确有新的教学活动需要时，可新增一次通用题型、游戏或功能模块；
3. 新模块必须注册为框架能力，由课程数据通过模块开关或题型名称启用，不能只为某一课复制或分叉页面；
4. 新模块完成后，后续课程应只在数据中引用它；
5. 未启用模块不得影响既有课程，尤其不得破坏已验收的 L01 与 L02 闭环；
6. 数据契约采用小版本演进，例如 `hsk1-course-v1`、`hsk1-course-v1.1`；新增字段应提供默认值或兼容读取，旧课程数据继续可用；
7. 每次新增框架能力后，至少独立验证学生端、教师端与学习记录三条链路。
