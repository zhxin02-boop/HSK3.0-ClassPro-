# HSK1 课前预习统一框架

版本：v1.0（基于 HSK1-L01、HSK1-L02 样课）

## 一、固定页面流程

每一课统一使用六个步骤，页面结构、按钮位置、交互方式和数据记录方式保持不变。新增课程只新增课程数据，不复制页面。

| 步骤 | 固定模块 | 固定交互 | 主要数据来源 |
|---|---|---|---|
| Step 1 | Topic Warm-up | 话题问题、中文+拼音选项、选择反馈 | `preClass.warmUp` |
| Step 2 | Word Cards | 左滑查看拼音和英文，右滑标记已掌握 | `vocabulary` |
| Step 3 | Shadow Practice | 跟读词语、跟读短句、播放语音、完成标记 | `vocabulary`、`texts` |
| Step 4 | Vocabulary Challenge | 4×4 中文词卡和英文释义卡连连看 | `vocabulary` |
| Step 5 | Character Writing | 选择汉字，在田字格中书写 | `writing.characters` 或由 `vocabulary` 生成 |
| Step 6 | Pre-class Quiz | 10 题，选择题自动下一题，主观题提交后下一题，完成后显示报告 | `preClass.questions` |

## 二、页面固定规则

1. 页面必须通过 URL 读取 `lesson`、`room`、`student`，不得把课程编号写死在页面逻辑中。
2. 课题标题、英文标题、生词、课文、短句、语法和测验题全部由课程数据提供。
3. 中文界面字体使用楷体；英文使用 Times New Roman；拼音使用宋体。
4. 拼音统一显示在汉字上方，不能在汉字右侧。
5. Step 2 的释义以英文为主，Step 3 和 Step 5 的操作提示以英文为主。
6. 每个课程数据文件必须包含 `lessonKey`，加载后校验数据中的课程编号与 URL 的 `lesson` 一致。
7. L01、L02 的六步顺序和模块名称不得因新增课程而改变。

## 三、课程数据契约

课程数据文件建议命名为：

```text
source/data-model/HSK1-L03_preclass.json
```

最小结构如下：

```json
{
  "meta": {
    "lessonKey": "HSK1-L03",
    "lessonTitle": "第3课标题",
    "lessonEnglishTitle": "English title",
    "topic": "课程主题"
  },
  "vocabulary": [
    {
      "word": "汉字",
      "pinyin": "hànzì",
      "english": "English meaning",
      "review": ["已学词语"]
    }
  ],
  "texts": [
    {
      "title": "课文或教学扩展对话",
      "isOriginal": true,
      "dialogue": [
        {
          "speaker": "说话人",
          "chinese": "课文原句",
          "pinyin": "Pinyin",
          "english": "English"
        }
      ]
    }
  ],
  "grammar": [],
  "preClass": {
    "warmUp": [],
    "questions": [],
    "writingCharacters": []
  }
}
```

## 四、题目数据要求

`preClass.questions` 是 Step 6 的唯一题目来源。每题至少包含：

```json
{
  "id": "pre_l03_001",
  "type": "choice",
  "module": "词汇理解",
  "question": "题干",
  "options": [
    {"text": "选项一", "pinyin": "xuǎnxiàng yī"},
    {"text": "选项二", "pinyin": "xuǎnxiàng èr"}
  ],
  "answer": "选项一",
  "needsTeacherReview": false,
  "weakPoints": "词汇：目标词"
}
```

主观题统一使用：

```json
{
  "id": "pre_l03_009",
  "type": "subjective",
  "module": "开放表达",
  "question": "English prompt",
  "answerPlaceholder": "请在此输入回答",
  "needsTeacherReview": true,
  "weakPoints": "交际功能：……"
}
```

题目原则：课文原句必须保留；新增例句、练习句、情景对话标记为教学扩展；后续课程的课前、课中、课后练习必须复现已学词汇、语法和交际功能；题目服务于“能理解、可辨认、会运用、愿交流”。

## 五、数据记录固定字段

每次预习记录至少写入：`studentName`、`lesson`、`room`、`stage`、`module`、`questionText`、`answer`、`score`、`total`、`needsTeacherReview`。

主观题必须进入教师批改台；教师批改结果沿用现有批改接口，学生端通过“查看反馈”读取，不另建一套接口。

## 六、L01/L02 到 L03 的推进方式

1. 先将 L01、L02 当前页面中仍存在的课程专用题目迁移到各自数据文件。
2. 页面只保留六步框架、交互组件、记录接口和通用显示逻辑。
3. 用同一页面加载 `HSK1-L01`、`HSK1-L02`，验证课程参数不会串课。
4. 新增 L03 时只新增 `HSK1-L03_preclass.json`，并完成学生端、教师端、数据记录三项独立验证。

