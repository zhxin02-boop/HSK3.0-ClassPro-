# Chinese ClassPro（HSK3.0） 统一数据规范 v2.1

> 基于 ClassPro_练习命题原则（15种题型+跨课词汇池）扩展升级
> 代号保持与现有体系一致，新增题型以 O/P 开头

---

## 设计原则

1. **全覆盖**：定义 HSK 1-5 所有课型所需的数据结构
2. **可扩展**：新增题型只需按模板添加，不影响已有结构
3. **三阶段感知**：数据天然知道自己在哪个环节使用（课前/课中/课后）
4. **向后兼容**：v1 数据可平滑迁移到 v2
5. **命题原则驱动**：数据规范遵循"练习服务于能用，不服务于记住课文"

---

> ⚠️ **本更新基于 HSK1 第2课（我叫李文）的真实数据作为范例。**
> 数据文件：`data/lessons/HSK1-L2.json` | 授课角色：王一飞（老师）、陈天中、白家月、李文（学生）| 核心词汇：不/是/对不起/没关系/没事/很/高兴/认识/也

---

## 一、ClassPro 题型数据结构（以 HSK1-L2 为范例）

> 以下每个题型都附带一份**基于 HSK1-L2 实际数据生成的 JSON 示例**，展示从数据到课堂的映射关系。

### 1.1 词汇类 V1-V9

#### V1 看图猜词 (image_guess)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 词汇识别 |
| 课堂形式 | 展示图片，学生抢答对应词汇 |

**HSK1-L2 示例：**
```json
{
  "id": "v1_hsk1_02_01",
  "type": "image_guess",
  "stage": "in_class",
  "difficulty": 0.3,
  "time_estimate_sec": 8,
  "prompt_cn": "请看图片，这是什么？",
  "prompt_en": "Look at the picture. What is this?",
  "data": { "image_hint": "一个人面带笑容握手" },
  "correct_answer": "高兴",
  "acceptable_answers": ["很开心", "快乐"],
  "kp": "词汇：高兴",
  "feedback_correct": "对！很高兴 = very happy",
  "feedback_wrong": "再想想，这张图表达的是什么心情？",
  "media": { "audio": "audio/L02/v1_gaoxing.mp3", "image": null },
  "source": "vocabulary",
  "vocab_pool": "L02"
}
```

#### V5 选词填空 (vocab_fill)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 词汇运用 |
| 课堂形式 | 句中挖空，从多个生词中选择 |

**HSK1-L2 示例：**
```json
{
  "id": "v5_hsk1_02_01",
  "type": "vocab_fill",
  "stage": "in_class",
  "difficulty": 0.5,
  "prompt_cn": "选择合适的词填空",
  "prompt_en": "Choose the correct word.",
  "data": {
    "sentence": "我___学生，你是老师。",
    "options": ["是", "不", "也", "很"],
    "correct_index": 0
  },
  "correct_answer": "是",
  "kp": "词汇：是",
  "source": "new_sentence"
}
```

#### V7 词了个词（竞速游戏）(word_match)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 综合词汇 |
| 课堂形式 | 5选5配对，竞速排名 |

**HSK1-L2 示例：**
```json
{
  "id": "v7_hsk1_02_01",
  "type": "word_match",
  "stage": "in_class",
  "data": {
    "words": ["高兴", "认识", "对不起", "没关系", "也"],
    "sentences": [
      { "sentence": "见到你我很___。", "answer": "高兴" },
      { "sentence": "我___他三年了。", "answer": "认识" },
      { "sentence": "踩到你的脚了，___！", "answer": "对不起" },
      { "sentence": "A: 谢谢！ B: ___。", "answer": "没关系" },
      { "sentence": "我是学生，他___是学生。", "answer": "也" }
    ],
    "game_mode": "speed_race"
  },
  "kp": "综合词汇"
}
```

#### V8 消消乐（竞速游戏）(memory_match)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 词义配对 |
| 课堂形式 | 词义配对/拆字组词 |

**HSK1-L2 示例：**
```json
{
  "id": "v8_hsk1_02_01",
  "type": "memory_match",
  "stage": "in_class",
  "data": {
    "mode": "hanzi_english",
    "pairs": [
      { "left": "高兴", "right": "happy" },
      { "left": "认识", "right": "know" },
      { "left": "对不起", "right": "sorry" },
      { "left": "没关系", "right": "never mind" }
    ],
    "game_mode": "speed_race"
  },
  "kp": "综合词汇"
}
```

### 1.2 语法类 g1-g3 + G4-G7

#### g1 连词成句 (ordering)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 语法结构 |
| 课堂形式 | 打散的字词块拖拽排序 |

**HSK1-L2 示例（课前短句版）：**
```json
{
  "id": "g1_hsk1_02_01",
  "type": "ordering",
  "stage": "pre_class",
  "difficulty": 0.4,
  "data": {
    "chunks": ["我", "学生", "是"],
    "num_chunks": 3,
    "distractors": []
  },
  "correct_answer": "我是学生。",
  "kp": "语法：基本语序",
  "source": "text_sentence"
}
```

**HSK1-L2 示例（课中长句版+干扰项）：**
```json
{
  "id": "g1_hsk1_02_02",
  "type": "ordering",
  "stage": "in_class",
  "difficulty": 0.6,
  "data": {
    "chunks": ["认识你", "我", "也", "很高兴"],
    "num_chunks": 4,
    "distractors": ["很对不起"]
  },
  "correct_answer": "认识你我也很高兴。",
  "kp": "语法：基本语序 + 也",
  "source": "text_sentence",
  "vocab_pool": "L02"
}
```

#### G4 判断正误 (true_false)

**HSK1-L2 示例：**
```json
{
  "id": "g4_hsk1_02_01",
  "type": "true_false",
  "stage": "in_class",
  "difficulty": 0.4,
  "data": {
    "sentence": "我学生是。",
    "is_correct": false,
    "explanation": "汉语基本语序是主语+谓语+宾语，应该是"我是学生""
  },
  "correct_answer": false,
  "kp": "语法：基本语序"
}
```

### 1.3 课文类 t1-t3

#### t2 任务卡 (mission_card)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 情景应用 |
| 课堂形式 | 基于课文但有变化的场景任务 |

**HSK1-L2 示例（基于课文2：认错人场景）：**
```json
{
  "id": "t2_hsk1_02_01",
  "type": "mission_card",
  "stage": "in_class",
  "difficulty": 0.5,
  "data": {
    "scenario_cn": "你在校园里看到一个人的背影，以为是你的朋友小王，叫了他一声，结果认错人了。",
    "scenario_en": "You see someone on campus and think it is your friend Xiao Wang, but it is a stranger.",
    "mission_cn": "用中文完成这段对话：你 → 对方 → 你",
    "mission_en": "Complete this dialogue in Chinese.",
    "reference_dialogue": [
      { "role": "你", "text": "小王！" },
      { "role": "对方", "text": "对不起，我不早安。" },
      { "role": "你", "text": "对不起！" }
      { "role": "对方", "text": "没关系。" }
    ]
  },
  "kp": "课文：认错人场景",
  "grading_type": "teacher_review"
}
```

### 1.4 课堂活动 PK 赛

#### PK 赛 (pk_question)

| 属性 | 值 |
|---|---|
| 阶段 | in_class |
| 主练能力 | 综合 |
| 课堂形式 | 全班分组实时竞答，积分排名 |

**HSK1-L2 示例：**
```json
{
  "id": "pk_hsk1_02_01",
  "type": "pk_question",
  "stage": "in_class",
  "round": 1,
  "time_limit_sec": 10,
  "data": {
    "question_cn": ""看见同学应该说____？"",
    "question_en": "What should you say when you see a classmate?",
    "options": ["对不起", "再见", "你好", "谢谢"],
    "correct_index": 2
  },
  "correct_answer": "你好",
  "kp": "综合：打招呼"
}
```

---

## 二、数据流转设计：产生 → 存储 → 利用

### 2.1 数据产生：原子交互记录

每次学生在 ClassPro 课堂中完成一次互动（答题、PK、弹幕等），系统实时生成一条交互记录：

```json
{
  "record_id": "rec_20260701_hsk1_02_stu_mwasonya_v5_01",
  "timestamp": "2026-07-01T14:30:00+08:00",
  "student_id": "stu_mwasonya",
  "lesson_id": "hsk1_02",
  "stage": "in_class",
  "question_id": "v5_hsk1_02_01",
  "question_type": "vocab_fill",
  "student_response": "是",
  "is_correct": true,
  "time_spent_sec": 6,
  "attempt_number": 1,
  "score": 10,
  "kp_tags": ["词汇：是"],
  "metadata": { "device": "mobile", "browser": "chrome" }
}
```

**存储位置**：本地 JSON 文件（`data/records/` 目录）→ 每课一个 JSONL 文件，每行一条记录

### 2.2 数据聚合：每课学习档案

一课结束后，系统聚合该课所有交互记录：

```json
{
  "lesson_performance_id": "lp_hsk1_02_stu_mwasonya",
  "student_id": "stu_mwasonya",
  "lesson_id": "hsk1_02",
  "in_class": {
    "attended": true,
    "total_interactions": 28,
    "correct_count": 22,
    "accuracy": 0.79,
    "pk_wins": 1,
    "weak_kps": ["词汇：不", "语法：基本语序"]
  },
  "overall": {
    "mastered_kps": ["词汇：高兴", "词汇：认识", "词汇：对不起", "词汇：没关系"],
    "retained_weak_kps": ["词汇：不", "语法：基本语序"],
    "recommended_review": [
      { "kp": "语法：基本语序", "priority": "high" }
    ]
  }
}
```

### 2.3 数据利用：教师仪表盘

聚合后的数据向教师呈现为三类视图：

| 视图 | 内容 | 教学用途 |
|---|---|---|
| **一课总览** | 全班正确率分布、薄弱知识点 Top3、未参与学生 | 下课前5分钟做针对性补救 |
| **学生画像** | 每位学生的正确率、耗时、薄弱点趋势 | 下一课分组/差异化关注 |
| **班级对比** | 各课正确率趋势图、参与度变化 | 教研分析、课题申报数据支撑 |

---

## 三、整合架构：ClassPro 课中互动 + 数据层

```
┌─────────────────────────────────────────────────────┐
│                   教师端                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ 出题面板  │  │ 实时看板  │  │ 课后仪表盘   │   │
│  │ 选题型→  │  │ 正确率   │  │ 薄弱点分布  │   │
│  │ 从数据源 │  │ 排行榜   │  │ 学生画像    │   │
│  │ 加载题目 │  │ 弹幕墙   │  │ 数据导出    │   │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
└───────┼──────────────┼───────────────┼───────────┘
        │              │               │
        ▼              ▼               ▼
┌─────────────────────────────────────────────────────┐
│                MQTT 实时通信层                      │
│     每课一个 Room：hsk1_02                         │
│  教师端发布题目 → 学生端接收 → 学生端提交 → 教师端聚合  │
└───────────┬──────────────────────────┬──────────────┘
            │                          │
            ▼                          ▼
┌────────────────────┐  ┌────────────────────────────┐
│    学生端（手机）    │  │    数据持久层              │
│  ┌────────────────┐ │  │  ┌────────────────────┐   │
│  │ 答题界面        │ │  │  │ 原子记录 → JSONL  │   │
│  │ PK对战         │ │  │  │ 聚合档案 → JSON    │   │
│  │ 弹幕发送        │ │  │  │ 教师导出 → CSV     │   │
│  │ 实时排行榜      │ │  │  └────────────────────┘   │
│  └────────────────┘ │  └────────────────────────────┘
└────────────────────┘
```

### 3.1 课堂实时流（MQTT）

```
教师端                       学生端
  │                          │
  ├── publish: question ────→ │
  │                          ├── 显示题目
  │                          ├── 学生作答
  │  ←── publish: answer ────┤
  ├── 聚合正确率             │
  ├── publish: result ──────→ │
  │                          ├── 显示结果+排行榜
  │                          │
  └── 每5题→写入一次数据 ──→ 存储层
```

### 3.2 从规范到课堂的路径

```
Step 1: HSK1-L2.json（你维护的原始数据）
              │
              ▼
Step 2: AI 按本规范的题型模板生成 ClassPro 题目 JSON
              │
              ▼
Step 3: 教师审核 → 确认/调整
              │
              ▼
Step 4: 加载到 ClassPro 课堂 → 学生端实时交互
              │
              ▼
Step 5: 交互数据 → 原子记录 → 聚合 → 教师仪表盘
```

### 3.3 AI 从原始数据生成 ClassPro 题目的 Prompt 示例

```
基于以下 HSK1 第2课数据，按 spec-v2 规范生成 ClassPro 课堂题目：

词汇：不(bù/not)、是(shì/be)、对不起(duìbuqǐ/sorry)、
       没关系(méi guānxi/never mind)、没事(méishì/NP)、
       很(hěn/very)、高兴(gāoxìng/happy)、认识(rènshi/know)、也(yě/also)
课文场景：认错人 → 道歉 → 第一次见面自我介绍
语法点：基本语序(SVO)、对不起/没关系的用法

请生成：
1. V5 选词填空 × 5 题（不照搬课文原句）
2. g1 连词成句 × 5 题（含干扰项）
3. t2 任务卡 × 2 题（基于课文场景但变化情景）
4. PK 赛题 × 10 题（选择题形式，限时10秒）
```

---

## 四、从本规范到下一步

1. **数据规范已定** → 以此为准，AI 按模板生成各课 ClassPro 题目
2. **教师审核** → 生成的题目需教师确认后上线
3. **课堂数据沉淀** → 每次课堂互动自动记录，形成教学数据资产
4. **持续迭代** → 根据实际课堂数据反馈，优化题型参数和难度配比

---

*文档版本：v2.1 | 更新于 2026-07-06 | 新增 ClassPro 题型数据结构 + 数据流转设计 | 范例基于 HSK1-L2 真实数据*