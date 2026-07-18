/**
 * 新HSK数字互动课件 - 数据文件规范 v1.0
 * 
 * 文件命名: data_L{课号}.js  (例: data_L01.js, data_L02.js)
 * 加载方式: <script src="data_L01.js"></script>
 * 全局变量: window.LESSON_DATA
 * 
 * 设计原则:
 * 1. 数据与引擎完全分离 —— HTML引擎不硬编码任何教学内容
 * 2. 向后兼容 —— HSK1~6共用同一schema，字段可选扩展
 * 3. 音频预留 —— 所有需要发音的字段都有audio路径，暂时为空字符串
 * 4. 练习可编排 —— 练习题按类型分组，引擎可自由组合和排序
 */

window.LESSON_DATA = {
  // ==================== 元信息 ====================
  meta: {
    level: "HSK1",
    lessonId: "L01",
    title: "你好",
    titleEn: "Hello",
    topic: "问候与告别",
    topicEn: "Greetings and Farewells",
    // 教材角色，复用于课文和练习场景
    characters: [
      {
        id: "wang",
        name: "王一飞",
        namePinyin: "Wáng Yīfēi",
        role: "teacher",
        roleLabel: "老师",
        avatar: "assets/avatars/wang_yifei.png"
      },
      {
        id: "xiaoyu",
        name: "小语",
        namePinyin: "Xiǎoyǔ",
        role: "student",
        roleLabel: "AI助教",
        avatar: "assets/avatars/xiaoyu.png"
      },
      {
        id: "students",
        name: "学生们",
        namePinyin: "xuéshēngmen",
        role: "group",
        roleLabel: "学生们",
        avatar: "assets/avatars/students.png"
      }
    ]
  },

  // ==================== 生词 ====================
  vocabulary: [
    {
      id: "v01",
      hanzi: "你好",
      pinyin: "nǐ hǎo",
      pos: "",
      english: "hello",
      audio: "audio/L01/nihao.mp3",
      // HSK1特有：emoji辅助建立语义联系（去键盘化设计的一部分）
      emoji: "👋",
      // 常用搭配/用法（需求文档中的Usages）
      usages: [
        { hanzi: "你好吗？", pinyin: "Nǐ hǎo ma?", english: "How are you?" }
      ],
      // 教学标记：是否为本课核心词（影响练习权重）
      isCore: true,
      // 类别标签，用于练习分组和归纳
      tags: ["greeting"]
    },
    {
      id: "v02",
      hanzi: "大家",
      pinyin: "dàjiā",
      pos: "pron.",
      english: "everybody",
      audio: "audio/L01/dajia.mp3",
      emoji: "👥",
      usages: [
        { hanzi: "大家好！", pinyin: "Dàjiā hǎo!", english: "Hello, everyone!" }
      ],
      isCore: true,
      tags: ["pronoun", "group"]
    },
    {
      id: "v03",
      hanzi: "好",
      pinyin: "hǎo",
      pos: "adj.",
      english: "good; fine",
      audio: "audio/L01/hao.mp3",
      emoji: "👍",
      usages: [
        { hanzi: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!" },
        { hanzi: "老师好！", pinyin: "Lǎoshī hǎo!", english: "Hello, teacher!" }
      ],
      isCore: true,
      tags: ["adjective", "greeting"]
    },
    {
      id: "v04",
      hanzi: "学生",
      pinyin: "xuéshēng",
      pos: "n.",
      english: "student",
      audio: "audio/L01/xuesheng.mp3",
      emoji: "🎒",
      usages: [
        { hanzi: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student." }
      ],
      isCore: true,
      tags: ["noun", "people", "school"]
    },
    {
      id: "v05",
      hanzi: "们",
      pinyin: "men",
      pos: "suf.",
      english: "plural marker (used after pronouns or nouns referring to people)",
      audio: "audio/L01/men.mp3",
      emoji: "",
      usages: [
        { hanzi: "同学们", pinyin: "tóngxuémen", english: "classmates" },
        { hanzi: "老师们", pinyin: "lǎoshīmen", english: "teachers" }
      ],
      isCore: true,
      tags: ["suffix", "grammar"]
    },
    {
      id: "v06",
      hanzi: "老师",
      pinyin: "lǎoshī",
      pos: "n.",
      english: "teacher",
      audio: "audio/L01/laoshi.mp3",
      emoji: "👩‍🏫",
      usages: [
        { hanzi: "王老师", pinyin: "Wáng lǎoshī", english: "Teacher Wang" },
        { hanzi: "老师好！", pinyin: "Lǎoshī hǎo!", english: "Hello, teacher!" }
      ],
      isCore: true,
      tags: ["noun", "people", "school"]
    },
    {
      id: "v07",
      hanzi: "您",
      pinyin: "nín",
      pos: "pron.",
      english: "you (respectful)",
      audio: "audio/L01/nin.mp3",
      emoji: "🙏",
      usages: [
        { hanzi: "您好！", pinyin: "Nín hǎo!", english: "Hello! (respectful)" }
      ],
      isCore: true,
      tags: ["pronoun", "respect"]
    },
    {
      id: "v08",
      hanzi: "你们",
      pinyin: "nǐmen",
      pos: "pron.",
      english: "you (plural)",
      audio: "audio/L01/nimen.mp3",
      emoji: "👫",
      usages: [
        { hanzi: "你们好！", pinyin: "Nǐmen hǎo!", english: "Hello, everyone!" }
      ],
      isCore: true,
      tags: ["pronoun", "plural"]
    },
    {
      id: "v09",
      hanzi: "谢谢",
      pinyin: "xièxie",
      pos: "v.",
      english: "thank you",
      audio: "audio/L01/xiexie.mp3",
      emoji: "🙏",
      usages: [
        { hanzi: "谢谢老师！", pinyin: "Xièxie lǎoshī!", english: "Thank you, teacher!" }
      ],
      isCore: true,
      tags: ["verb", "politeness"]
    },
    {
      id: "v10",
      hanzi: "不客气",
      pinyin: "bú kèqi",
      pos: "",
      english: "you're welcome",
      audio: "audio/L01/bukeqi.mp3",
      emoji: "😊",
      usages: [],
      isCore: true,
      tags: ["politeness", "response"]
    },
    {
      id: "v11",
      hanzi: "同学",
      pinyin: "tóngxué",
      pos: "n.",
      english: "classmate",
      audio: "audio/L01/tongxue.mp3",
      emoji: "🧑‍🤝‍🧑",
      usages: [
        { hanzi: "同学们好！", pinyin: "Tóngxuémen hǎo!", english: "Hello, classmates!" }
      ],
      isCore: true,
      tags: ["noun", "people", "school"]
    },
    {
      id: "v12",
      hanzi: "再见",
      pinyin: "zàijiàn",
      pos: "v.",
      english: "goodbye",
      audio: "audio/L01/zaijian.mp3",
      emoji: "👋",
      usages: [
        { hanzi: "老师，再见！", pinyin: "Lǎoshī, zàijiàn!", english: "Goodbye, teacher!" }
      ],
      isCore: true,
      tags: ["verb", "farewell"]
    }
  ],

  // 专有名词（独立于生词，因为不计入HSK词汇量）
  properNouns: [
    {
      id: "pn01",
      hanzi: "王老师",
      pinyin: "Wáng lǎoshī",
      english: "Ms. Wang / Teacher Wang",
      audio: "audio/L01/wang_laoshi.mp3",
      note: "姓 + 老师 是中文常见的称呼方式"
    }
  ],

  // ==================== 课文 ====================
  texts: [
    {
      id: "text01",
      title: "认识小语",
      titleEn: "Meeting Xiaoyu",
      scene: "教室，王老师介绍AI小语",
      sceneEn: "Classroom, Teacher Wang introduces AI Xiaoyu",
      audio: "audio/L01/text01_full.mp3",
      lines: [
        {
          speaker: "wang",
          hanzi: "AI小语，你好！",
          pinyin: "AI Xiǎoyǔ, nǐ hǎo!",
          english: "AI Xiaoyu, hello!",
          audio: "audio/L01/text01_line01.mp3",
          highlightVocab: ["v01"]
        },
        {
          speaker: "xiaoyu",
          hanzi: "王老师，你好！",
          pinyin: "Wáng lǎoshī, nǐ hǎo!",
          english: "Hello, Teacher Wang!",
          audio: "audio/L01/text01_line02.mp3",
          highlightVocab: ["v06", "v01"]
        }
      ]
    },
    {
      id: "text02",
      title: "上课",
      titleEn: "Class begins",
      scene: "教室，上课问候",
      sceneEn: "Classroom, class greetings",
      audio: "audio/L01/text02_full.mp3",
      lines: [
        {
          speaker: "wang",
          hanzi: "大家好！",
          pinyin: "Dàjiā hǎo!",
          english: "Hello, everyone!",
          audio: "audio/L01/text02_line01.mp3",
          highlightVocab: ["v02", "v03"]
        },
        {
          speaker: "students",
          hanzi: "王老师，您好！",
          pinyin: "Wáng lǎoshī, nín hǎo!",
          english: "Hello, Teacher Wang!",
          audio: "audio/L01/text02_line02.mp3",
          highlightVocab: ["v06", "v07", "v03"]
        },
        {
          speaker: "xiaoyu",
          hanzi: "你们好！",
          pinyin: "Nǐmen hǎo!",
          english: "Hello, everyone!",
          audio: "audio/L01/text02_line03.mp3",
          highlightVocab: ["v08", "v03"]
        },
        {
          speaker: "students",
          hanzi: "你好，小语！",
          pinyin: "Nǐ hǎo, Xiǎoyǔ!",
          english: "Hello, Xiaoyu!",
          audio: "audio/L01/text02_line04.mp3",
          highlightVocab: ["v01"]
        }
      ]
    },
    {
      id: "text03",
      title: "下课",
      titleEn: "Class ends",
      scene: "教室，下课告别",
      sceneEn: "Classroom, end of class farewells",
      audio: "audio/L01/text03_full.mp3",
      lines: [
        {
          speaker: "students",
          hanzi: "谢谢！",
          pinyin: "Xièxie!",
          english: "Thank you!",
          audio: "audio/L01/text03_line01.mp3",
          highlightVocab: ["v09"]
        },
        {
          speaker: "xiaoyu",
          hanzi: "不客气！",
          pinyin: "Bú kèqi!",
          english: "You're welcome!",
          audio: "audio/L01/text03_line02.mp3",
          highlightVocab: ["v10"]
        },
        {
          speaker: "wang",
          hanzi: "同学们，再见！",
          pinyin: "Tóngxuémen, zàijiàn!",
          english: "Goodbye, classmates!",
          audio: "audio/L01/text03_line03.mp3",
          highlightVocab: ["v11", "v05", "v12"]
        },
        {
          speaker: "students",
          hanzi: "老师，再见！",
          pinyin: "Lǎoshī, zàijiàn!",
          english: "Goodbye, teacher!",
          audio: "audio/L01/text03_line04.mp3",
          highlightVocab: ["v06", "v12"]
        }
      ]
    }
  ],

  // ==================== 语法 ====================
  grammar: [
    {
      id: "g01",
      title: "用“好”打招呼",
      titleEn: "Greeting with 好",
      // 归纳式教学：先看例句，再推导规则
      examples: [
        { hanzi: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!", highlight: ["你"] },
        { hanzi: "您好！", pinyin: "Nín hǎo!", english: "Hello! (respectful)", highlight: ["您"] },
        { hanzi: "大家好！", pinyin: "Dàjiā hǎo!", english: "Hello, everyone!", highlight: ["大家"] },
        { hanzi: "老师好！", pinyin: "Lǎoshī hǎo!", english: "Hello, teacher!", highlight: ["老师"] },
        { hanzi: "同学们好！", pinyin: "Tóngxuémen hǎo!", english: "Hello, classmates!", highlight: ["同学们"] }
      ],
      // 归纳出的公式
      formula: {
        pattern: "称呼/人称代词 + 好",
        patternEn: "Addressing term / Pronoun + 好",
        note: "用“好”构成最基本的问候语",
        noteEn: "Use 好 to form the most basic greeting"
      }
    },
    {
      id: "g02",
      title: "“们”表示复数",
      titleEn: "们 as plural marker",
      examples: [
        { hanzi: "学生 → 学生们", pinyin: "xuéshēng → xuéshēngmen", english: "student → students", highlight: ["们"] },
        { hanzi: "同学 → 同学们", pinyin: "tóngxué → tóngxuémen", english: "classmate → classmates", highlight: ["们"] },
        { hanzi: "你 → 你们", pinyin: "nǐ → nǐmen", english: "you → you (plural)", highlight: ["们"] }
      ],
      formula: {
        pattern: "人称代词/人物名词 + 们",
        patternEn: "Personal pronoun / Person noun + 们",
        note: "“们”只能用在指人的代词或名词后面",
        noteEn: "们 can only be added after pronouns or nouns referring to people"
      }
    },
    {
      id: "g03",
      title: "“您”和“你”",
      titleEn: "您 vs 你",
      examples: [
        { hanzi: "老师，您好！", pinyin: "Lǎoshī, nín hǎo!", english: "Hello, teacher! (respectful)", highlight: ["您"] },
        { hanzi: "同学，你好！", pinyin: "Tóngxué, nǐ hǎo!", english: "Hello, classmate!", highlight: ["你"] }
      ],
      formula: {
        pattern: "您 → 尊敬 / 你 → 一般",
        patternEn: "您 = respectful / 你 = casual",
        note: "对长辈、老师用“您”，对同学、朋友用“你”",
        noteEn: "Use 您 for elders and teachers; use 你 for classmates and friends"
      }
    }
  ],

  // ==================== 练习 ====================
  exercises: {

    // ---------- 听力 ----------
    listening: [
      {
        id: "ex_l01",
        type: "listen_choose_image",
        instruction: "听一听，选择正确的图片。",
        instructionEn: "Listen and choose the correct picture.",
        // 音频播放后，学生从图片选项中选择
        audio: "audio/L01/ex/listen01.mp3",
        // 音频内容文本（不展示给学生，用于教师端和数据校验）
        transcript: "再见！",
        options: [
          { id: "a", image: "assets/ex/L01/wave_goodbye.png", label: "👋 挥手告别" },
          { id: "b", image: "assets/ex/L01/handshake.png", label: "🤝 握手" },
          { id: "c", image: "assets/ex/L01/bow.png", label: "🙇 鞠躬" }
        ],
        answer: "a",
        relatedVocab: ["v12"]
      },
      {
        id: "ex_l02",
        type: "listen_choose_image",
        instruction: "听一听，选择正确的图片。",
        instructionEn: "Listen and choose the correct picture.",
        audio: "audio/L01/ex/listen02.mp3",
        transcript: "谢谢！",
        options: [
          { id: "a", image: "assets/ex/L01/thank_you.png", label: "🙏 表示感谢" },
          { id: "b", image: "assets/ex/L01/hello.png", label: "👋 打招呼" },
          { id: "c", image: "assets/ex/L01/sorry.png", label: "😔 道歉" }
        ],
        answer: "a",
        relatedVocab: ["v09"]
      },
      {
        id: "ex_l03",
        type: "listen_true_false",
        instruction: "听对话，判断对错。",
        instructionEn: "Listen to the dialogue and decide: true or false?",
        audio: "audio/L01/ex/listen03.mp3",
        transcript: "A: 老师，您好！ B: 同学们好！",
        statement: "学生在和老师打招呼。",
        statementPinyin: "Xuéshēng zài hé lǎoshī dǎ zhāohu.",
        statementEn: "The students are greeting the teacher.",
        answer: true,
        relatedVocab: ["v06", "v07", "v04"]
      },
      {
        id: "ex_l04",
        type: "listen_true_false",
        instruction: "听对话，判断对错。",
        instructionEn: "Listen to the dialogue and decide: true or false?",
        audio: "audio/L01/ex/listen04.mp3",
        transcript: "A: 同学们，再见！ B: 老师，再见！",
        statement: "他们在上课。",
        statementPinyin: "Tāmen zài shàng kè.",
        statementEn: "They are starting class.",
        answer: false,
        feedback: "他们在说“再见”，所以是下课。",
        feedbackEn: "They are saying 再见 (goodbye), so class is ending.",
        relatedVocab: ["v12"]
      },
      {
        id: "ex_l05",
        type: "listen_choose_response",
        instruction: "听一听，选择合适的回答。",
        instructionEn: "Listen and choose the appropriate response.",
        audio: "audio/L01/ex/listen05.mp3",
        transcript: "谢谢！",
        options: [
          { id: "a", hanzi: "不客气！", pinyin: "Bú kèqi!" },
          { id: "b", hanzi: "再见！", pinyin: "Zàijiàn!" },
          { id: "c", hanzi: "你好！", pinyin: "Nǐ hǎo!" }
        ],
        answer: "a",
        relatedVocab: ["v09", "v10"]
      }
    ],

    // ---------- 阅读 ----------
    reading: [
      {
        id: "ex_r01",
        type: "image_choose_word",
        instruction: "看图片，选择对应的词语。",
        instructionEn: "Look at the picture and choose the matching word.",
        image: "assets/ex/L01/classroom_teacher.png",
        imageDescription: "一位女老师站在教室前面",
        options: [
          { id: "a", hanzi: "老师", pinyin: "lǎoshī" },
          { id: "b", hanzi: "学生", pinyin: "xuéshēng" },
          { id: "c", hanzi: "同学", pinyin: "tóngxué" }
        ],
        answer: "a",
        relatedVocab: ["v06"]
      },
      {
        id: "ex_r02",
        type: "image_choose_word",
        instruction: "看图片，选择对应的词语。",
        instructionEn: "Look at the picture and choose the matching word.",
        image: "assets/ex/L01/students_group.png",
        imageDescription: "几个学生在一起",
        options: [
          { id: "a", hanzi: "老师", pinyin: "lǎoshī" },
          { id: "b", hanzi: "同学们", pinyin: "tóngxuémen" },
          { id: "c", hanzi: "大家", pinyin: "dàjiā" }
        ],
        answer: "b",
        relatedVocab: ["v11", "v05"]
      },
      {
        id: "ex_r03",
        type: "sentence_choose_image",
        instruction: "读句子，选择合适的图片。",
        instructionEn: "Read the sentence and choose the matching picture.",
        hanzi: "老师，再见！",
        pinyin: "Lǎoshī, zàijiàn!",
        options: [
          { id: "a", image: "assets/ex/L01/wave_goodbye.png", label: "挥手告别" },
          { id: "b", image: "assets/ex/L01/handshake.png", label: "打招呼" },
          { id: "c", image: "assets/ex/L01/classroom_study.png", label: "上课学习" }
        ],
        answer: "a",
        relatedVocab: ["v06", "v12"]
      },
      {
        id: "ex_r04",
        type: "choose_response",
        instruction: "选择合适的回答。",
        instructionEn: "Choose the appropriate response.",
        prompt: {
          hanzi: "老师，您好！",
          pinyin: "Lǎoshī, nín hǎo!",
          speaker: "学生"
        },
        options: [
          { id: "a", hanzi: "同学们好！", pinyin: "Tóngxuémen hǎo!" },
          { id: "b", hanzi: "不客气！", pinyin: "Bú kèqi!" },
          { id: "c", hanzi: "谢谢！", pinyin: "Xièxie!" }
        ],
        answer: "a",
        relatedVocab: ["v07", "v11"]
      },
      {
        id: "ex_r05",
        type: "fill_word",
        instruction: "选择合适的词完成句子。",
        instructionEn: "Choose the correct word to complete the sentence.",
        sentence: {
          template: "老师，____！",
          templatePinyin: "Lǎoshī, ____!",
          context: "学生见到老师时说：",
          contextEn: "A student says to the teacher:"
        },
        options: [
          { id: "a", hanzi: "您好", pinyin: "nín hǎo" },
          { id: "b", hanzi: "谢谢", pinyin: "xièxie" },
          { id: "c", hanzi: "不客气", pinyin: "bú kèqi" }
        ],
        answer: "a",
        relatedVocab: ["v07", "v03"]
      },
      {
        id: "ex_r06",
        type: "fill_word",
        instruction: "选择合适的词完成句子。",
        instructionEn: "Choose the correct word to complete the sentence.",
        sentence: {
          template: "A: 谢谢！ B: ____！",
          templatePinyin: "A: Xièxie! B: ____!",
          context: "小语回答学生的感谢：",
          contextEn: "Xiaoyu responds to the student's thanks:"
        },
        options: [
          { id: "a", hanzi: "再见", pinyin: "zàijiàn" },
          { id: "b", hanzi: "不客气", pinyin: "bú kèqi" },
          { id: "c", hanzi: "你好", pinyin: "nǐ hǎo" }
        ],
        answer: "b",
        relatedVocab: ["v09", "v10"]
      }
    ],

    // ---------- 词汇互动（课堂用，去键盘化） ----------
    vocab_interactive: [
      {
        id: "ex_v01",
        type: "pinyin_hanzi_match",
        instruction: "把拼音和汉字配对。",
        instructionEn: "Match the pinyin with the correct characters.",
        pairs: [
          { pinyin: "lǎoshī", hanzi: "老师", vocabId: "v06" },
          { pinyin: "xièxie", hanzi: "谢谢", vocabId: "v09" },
          { pinyin: "zàijiàn", hanzi: "再见", vocabId: "v12" },
          { pinyin: "tóngxué", hanzi: "同学", vocabId: "v11" }
        ]
      },
      {
        id: "ex_v02",
        type: "hanzi_meaning_match",
        instruction: "把汉字和英文意思配对。",
        instructionEn: "Match the characters with their English meanings.",
        pairs: [
          { hanzi: "学生", meaning: "student", vocabId: "v04" },
          { hanzi: "老师", meaning: "teacher", vocabId: "v06" },
          { hanzi: "再见", meaning: "goodbye", vocabId: "v12" },
          { hanzi: "谢谢", meaning: "thank you", vocabId: "v09" }
        ]
      },
      {
        id: "ex_v03",
        type: "link_game",
        instruction: "连连看：找到意思相同的配对。",
        instructionEn: "Link Game: Find the matching pairs.",
        // Duolingo式连连看，左列拼音/汉字，右列图片/英文
        leftColumn: [
          { content: "你好", type: "hanzi", vocabId: "v01" },
          { content: "再见", type: "hanzi", vocabId: "v12" },
          { content: "谢谢", type: "hanzi", vocabId: "v09" },
          { content: "不客气", type: "hanzi", vocabId: "v10" }
        ],
        rightColumn: [
          { content: "goodbye", type: "english", vocabId: "v12" },
          { content: "you're welcome", type: "english", vocabId: "v10" },
          { content: "hello", type: "english", vocabId: "v01" },
          { content: "thank you", type: "english", vocabId: "v09" }
        ]
      }
    ]
  },

  // ==================== 拓展配置 ====================
  config: {
    // 拼音显示默认状态（HSK1默认显示，高级别可默认隐藏）
    showPinyinByDefault: true,
    // 是否启用拼音基石模块入口
    pinyinMasterEnabled: true,
    // 练习中是否显示英文提示（HSK1需要，高级别可关闭）
    showEnglishHints: true,
    // 关联的前序课程（用于复习题自动混入）
    prerequisiteLessons: [],
    // 当前课的MQTT房间号前缀（实时通信用）
    mqttRoomPrefix: "HSK1_L01"
  }
};
