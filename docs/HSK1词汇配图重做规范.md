# HSK1 词汇配图重做规范

> 本规范用于 HSK1 入门阶段词汇卡片、图片猜词、课堂互动题的配图生产。第一轮先服务 `HSK1-L02`，后续可复用到 HSK1 前几课。

## 一、核心判断

HSK1 入门阶段的配图不是装饰，而是帮助学生快速建立：

`图像情境 -> 词义 -> 汉语发音/汉字`

因此图片必须直观、低负荷、可一眼识别。不要为了好看而让学生猜复杂情节。

## 二、统一风格

建议采用：

- 明亮、干净、课堂友好的教育插画风格。
- 半写实或柔和 3D 插画均可，但同一课内必须统一。
- 白色或浅色背景，主体清楚。
- 单图只表达一个核心意思。
- 不在图片中放汉字、拼音、英文文字，避免和题目文字互相干扰。
- 人物表情自然、积极，适合国际学生。
- 构图以正方形或 4:3 为主，方便放入词汇卡片。

避免：

- 过暗、过电影感、过抽象。
- 人物太多、动作太复杂。
- 文化梗太强，学生看不懂。
- 画面里出现大段文字、菜单、广告牌。
- 用相近但不精确的场景替代目标词。

## 三、图片命名与存放

建议目录：

```text
source/in-class/images/
  vocab/
    hsk1-l02/
      v01_bu.png
      v02_shi.png
      v03_duibuqi.png
      v04_meiguanxi.png
      v05_meishi.png
      v06_hen.png
      v07_gaoxing.png
      v08_renshi.png
      v09_ye.png
```

第一轮如不改目录，可继续放在：

```text
source/in-class/images/
```

但文件名要稳定，方便 `data_L02.js` 或后续图片字段引用。

## 四、通用提示词模板

中文提示词模板：

```text
为 HSK1 国际中文初学者生成一张词汇教学配图。目标词是“{词语}”，意思是“{英文释义}”。
画面要一眼能看懂这个意思，主体清晰，背景简洁，明亮友好的教育插画风格。
不要出现任何文字、汉字、拼音、英文、字幕、标志或水印。
不要复杂情节，不要多人混乱场景。
正方形构图，适合放在课堂词汇卡片中。
```

英文提示词模板：

```text
Create a clear educational illustration for HSK1 beginner Chinese learners.
Target word: "{word}". Meaning: "{meaning}".
The image should communicate the meaning at a glance, with one clear subject, a simple light background, and a friendly classroom-appropriate style.
No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
Avoid complex scenes and visual clutter.
Square composition for a vocabulary flashcard.
```

负面提示词：

```text
text, letters, Chinese characters, pinyin, English words, watermark, logo, dark background, complex scene, crowded people, blurry, cropped face, abstract symbols, dramatic lighting
```

## 五、后续课程的高效配图流程

从 HSK1-L05 开始，配图不要按“每个生词单独生一张图”的方式推进。先做视觉复用清单，再生成图片，再把路径写回课程数据。

推荐流程：

1. 先把本课生词分成三类：
   - 必须配图：图片猜词题的正确答案、具体名词、动作词、课堂一眼可识别的情景词。
   - 可复用配图：同义/近义日期词、同一场景中的动作和物品、抽象词在情景图中呈现。
   - 暂不配图：太抽象、单独成图会误导学生的虚词、助词、结构词。
2. 每课先写一张 `image plan` 表，字段建议包括：`word`、`meaning`、`reuseGroup`、`imagePath`、`prompt`、`usedBy`、`status`。
3. 图片猜词优先复用词汇表里的 `image` 字段。课程数据适配层会把词汇 `image` 自动传给 `v1_image_guess`，因此不要在 10 道图片猜词里重复维护图片路径。
4. 同一课图片风格、尺寸和命名必须统一。建议路径：

```text
source/in-class/images/vocab/hsk1-l05/
  v01_today_calendar.png
  v02_date_calendar.png
  v03_month_calendar.png
  v06_sunday_calendar.png
  v08_rest_home.png
  v10_cook_meal.png
  v12_noodles.png
  v13_dumplings.png
  v16_computer.png
  v21_like_object.png
```

5. L05 可复用建议：
   - `今天 / 号 / 月 / 日`：可用日历类图片，其中图片猜词可按题目目标选择不同裁切或不同日期重点。
   - `星期日 / 星期天`：共用“周日被标记的周历”图片，但题目中要避免两个选项同时可作为正确答案。
   - `做 / 做饭`：优先给“做饭”配图，`做` 如需展示可复用动作场景。
   - `面条儿 / 饺子`：分别独立配图，避免食物类题目答案不唯一。
   - `电脑 / 新 / 好看 / 喜欢 / 它`：可以用“一个新电脑，学生喜欢它”的情景图复用，但图片猜词如果目标是 `喜欢`，选项干扰必须避免 `好看`、`新` 同时成立。
6. 生图前先完成图片清单和路径占位；生图后只替换实际文件，不改题型逻辑。上线前用验证脚本检查 `v1_image_guess` 的每道题是否最终能读到 `media.image`。

通用批量提示词可以在原模板基础上补充：

```text
Use the same visual style as the other HSK1 lesson images. Make the target meaning clear for a beginner without any written text. The image will be used both as a vocabulary flashcard and a picture-guess question, so avoid adding extra objects that could match another answer choice.
```

## 六、HSK1-L02 配图建议

| id | 词语 | 当前判断 | 推荐画面 | 生成提示词重点 |
|---|---|---|---|---|
| v01 | 不 | 抽象词，不能只画叉号 | 一个学生微笑摆手拒绝一杯饮料或一本书，动作温和 | “saying no politely”, “gentle refusal gesture” |
| v02 | 是 | 抽象词，建议用确认场景 | 老师指着学生名牌，学生点头确认“这是我”的情境，但画面不要出现文字 | “confirmation”, “nodding yes”, “teacher and student” |
| v03 | 对不起 | 可做明确道歉动作 | 一个学生不小心碰到别人后，双手合十或轻微鞠躬道歉 | “apologizing after a small mistake”, “sorry expression” |
| v04 | 没关系 | 回应道歉 | 一个学生道歉，另一个学生微笑摆手表示没关系 | “forgiving response”, “it is okay gesture” |
| v05 | 没事 | 状态平安/不用担心 | 一个学生轻轻摔倒后站起来微笑摆手，旁边同学关心 | “I am okay”, “no problem”, “reassuring gesture” |
| v06 | 很 | 程度副词，单独配图困难 | 一个很高的杯子/很大的书包与普通物品对比，突出“very” | “very big”, “clear size contrast” |
| v07 | 高兴 | 情绪最容易图像化 | 一个学生拿到好消息或和同学见面时开心微笑 | “happy student”, “bright smile” |
| v08 | 认识 | 初次认识/见面 | 两个学生第一次见面，微笑握手或互相打招呼 | “meeting for the first time”, “nice to meet you” |
| v09 | 也 | 抽象词，建议用“我也”情境 | 两个学生都举手或都拿着同样物品，第二个学生表示“我也” | “also too”, “two students doing the same action” |

## 七、逐词推荐英文提示词

### v01 不

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "不" meaning "not / no". Show one student politely saying no with a gentle hand gesture to a offered drink or book. The feeling should be friendly and low-pressure, not angry. Simple light classroom background, one clear action, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v02 是

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "是" meaning "to be / yes, it is". Show a teacher asking and a student smiling and nodding to confirm identity, with a simple classroom setting. Communicate confirmation clearly without using any written labels. Square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v03 对不起

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "对不起" meaning "sorry". Show one student accidentally bumping another student's notebook and apologizing sincerely with a gentle bow or hand gesture. The scene should be friendly and easy to understand. Simple light background, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v04 没关系

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "没关系" meaning "it doesn't matter / no problem". Show one student apologizing and another student smiling, waving gently to show it is okay. Friendly classroom or campus setting, simple and clear. Square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v05 没事

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "没事" meaning "I'm okay / it's nothing". Show a student who has had a tiny harmless mishap, smiling and making an okay gesture while a classmate looks concerned. The student should clearly be fine. Simple light background, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v06 很

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "很" meaning "very". Show a simple comparison: one very big schoolbag next to a normal small schoolbag, with a surprised but happy student. Make the meaning of "very" clear through size contrast. Simple light classroom background, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v07 高兴

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "高兴" meaning "happy / glad". Show a student smiling brightly after meeting a new friend or receiving good news. The emotion should be clear, warm, and classroom-appropriate. Simple light background, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v08 认识

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "认识" meaning "to know / to meet". Show two students meeting for the first time, smiling and greeting each other or shaking hands. Make the idea of getting to know someone clear. Simple light campus or classroom background, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

### v09 也

```text
Create a clear educational illustration for HSK1 beginner Chinese learners. Target word: "也" meaning "also / too". Show two students doing the same simple action, such as both raising their hands happily or both holding the same book, with the second student clearly joining in too. Simple light classroom background, square composition. No text, no Chinese characters, no pinyin, no English words, no logos, no watermark.
```

## 八、验收标准

每张图通过以下检查才进入样课：

- 学生不看文字也能大致猜出意思。
- 画面主体在 1 秒内可识别。
- 没有文字、拼音、英文、水印。
- 不需要教师额外解释复杂背景。
- 与 HSK1-L02 课堂语境一致。
- 同一课图片风格统一。

## 九、进入代码的建议

短期：

- 继续在 `teacher.html` 中通过 id 映射图片。
- 先只替换图片文件，不大改页面逻辑。

中期：

- 在 `data_L02.js` 的每个词汇对象中增加 `image` 字段。
- 页面只读 `w.image`，不再在 `teacher.html` 中维护图片映射。

推荐字段：

```js
{ id: "v07", hanzi: "高兴", image: "images/vocab/hsk1-l02/v07_gaoxing.png" }
```
