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

## 10. 正式课程数据交付标准（当前执行版）

从 HSK1-L04 开始，每一课都按“正式课程数据”制作和验收，不使用题量不足、题型缺失或仅用于试验的半成品进入测试或课堂。除非明确新增功能或新增题型，否则后续课程必须直接遵守本节标准。

### 10.1 内容完整性

每课数据文件必须包含并完成以下内容：

- `meta`：课程编号、中文标题、英文标题、主题和教材来源策略；
- `features`：拼音、汉字书写、词汇扩展、竞赛、课后作业等模块开关；
- `vocabulary`：本课全部生词，不能漏词；每个生词包含汉字、拼音、英文、词性、书写信息；
- 生词图片：需要配图的生词必须有真实存在的相对路径，路径必须在本地实际检查通过；
- 生词扩展：每个生词至少 2 个教学扩展短句，建议 2—3 个，且使用本课或已学词汇；
- `texts`：教材课文原句、角色、拼音和英文译文必须保留；
- `grammar`：每个语法点包含中文解释、英文/俄语注释、结构说明和至少 3 个例句，建议 3—5 个；例句优先使用本课及前课已学词汇；
- `preClass`：课前预习完整步骤、题目、答案、知识点和来源标记；
- `inClass`：讲、练、赛所需的数据、题库、汉字书写和汉字认读循环；
- `postClassHomework`：A、B、C 三档作业、题目选择、提交次数和批改规则；
- `report`：本课薄弱点标签和学习报告字段，不能依赖页面硬编码补齐。

### 10.2 课中题量基准

当前 HSK1 每课正式题库按以下数量制作：

| 类别 | 数据要求 |
|---|---:|
| 看图猜词 | 10 题，必须有可显示的图片或明确的数据图片回退 |
| 选词填空 | 10 题 |
| 词句匹配 | 10 个可练习单位；若按题组组织，题组内配对总量不得不足 10 个 |
| 词了个词 | 至少 3 组；20 个生词的课程建议 5 组 × 4 词 |
| 汉字辨析 | 10 题，选项不能泄题，汉字选项默认不显示拼音 |
| 句子转换 | 10 题，必须体现句型转换，不得全部退化为选词填空 |
| 阅读理解/课文问答 | 10 题，题干和选项均需有明确语境 |
| 判断题 | 10 题，教材事实与教学扩展合理分配 |
| 连词成句 | 5 题，词块拼音必须完整 |
| 汉字认读循环 | 按生词量分组；每组完成规定轮次，教师公布答案后可进入下一题/下一组 |

题目数量指可实际抽取和练习的独立题目，不得通过复制同一句、只替换选项或重复同一语境凑数。每种题型应尽量覆盖词义、句法、语境和理解等不同维度。

### 10.3 题目质量与来源规则

- 教材原句、教材对话和教材事实必须保留，并标记 `sourceType: "textbook"`；
- 新增例句、练习句、情景对话和扩展题必须标记 `sourceType: "teaching_extension"`；
- 选择题正确答案必须经过随机排序验证，不能长期固定为 A；
- 客观题答案必须唯一；若存在多个合理答案，必须改题或明确配置可接受答案；
- 不同题型不能反复使用同一批句子完成所有练习；
- 拼音显示遵守统一规则：汉字上方显示拼音，拼音练习选项只显示拼音；
- 教师端和学生端必须使用同一题目语义和 payload，只允许显示层不同；
- 题干、选项和反馈不得直接暴露英文内部字段名。

### 10.4 课后作业标准

- A、B、C 三档每档均为 12 题；
- 每档建议包含客观题、主观输出题和汉字书写题；
- 主观题必须有英文提示、可输入答题框和批改标记；
- 作业题不能重复，尤其不能出现同一题号或同一题目内容重复；
- 学生最多提交 2 次，教师端默认只显示最后一次提交；
- 已批改记录从“待批改”列表归档，但必须保留在数据记录和学生反馈中；
- 批改台、数据面板和学生反馈必须使用同一份提交记录。

### 10.5 每课交付前的自动检查

每个新课程文件完成后，至少执行以下检查并记录结果：

1. JSON 可解析，`lessonKey` 与文件名、URL 上下文一致；
2. 生词数量与教材清单一致，所有资源路径真实存在；
3. 各题型数量符合本节表格，题号唯一，答案字段完整；
4. 生词扩展和语法例句数量达标，来源标记完整；
5. A/B/C 作业均为 12 题，主观题存在答题框字段；
6. 教师端静态加载后能读取课程数据，学生端能收到教师发送的题目；
7. 至少抽查一题完成“教师发送 → 学生接收 → 学生提交 → 教师结束/公布答案 → 记录保存”；
8. 独立检查学生端、教师端、批改台、数据面板和学生反馈，不以单一页面显示正常代替闭环验收。

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
