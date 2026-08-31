const fs = require("fs");

const file = "source/data-model/lessons/HSK3-L01.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const sessionByWord = {};
(data.vocabulary || []).forEach((w) => {
  const tag = (w.tags || []).find((x) => /^session-/.test(x));
  sessionByWord[w.id] = tag ? tag.replace("session-", "") : "";
});

Object.keys(data.vocabExtensions || {}).forEach((id) => {
  if (sessionByWord[id]) data.vocabExtensions[id].session = sessionByWord[id];
});

function task(id, type, cn, en, placeholder, extra) {
  return Object.assign({
    id,
    type,
    prompt_cn: cn,
    prompt_en: en,
    answerPlaceholder: placeholder,
    needsTeacherReview: true,
    openEnded: true
  }, extra || {});
}

data.postClassHomework = {
  mode: "hsk3_session_tasks",
  instructions: {
    required: "完成本次课后的输出任务：词语成段、课文叙述体改写、绘本口语准备。",
    optional: "可以先写 3 句；能力较强的同学拓展到 5 句，并准备口语展示。",
    aiPolicy: "可以用工具查词，但最后必须改成自己能说出来的中文。"
  },
  futureModules: {
    pictureBookShowcase: {
      status: "active_homework_design",
      placement: "post-class homework",
      purpose: "Students prepare a picture-book style oral presentation after class and present in class.",
      notes: "Use a small sequence of topic-related pictures, keywords, and an oral rehearsal prompt."
    }
  },
  sessions: {
    A: [
      task(
        "post_hsk3_l01_a_word_paragraph",
        "word_paragraph",
        "词语成段：请从本次课中选 5 个词，写一小段话。先写 3 句，能多写的同学拓展到 5 句。",
        "Choose 5 words from this session and write a short paragraph. Start with 3 sentences; extend to 5 if you can.",
        "可以用：以为、像、身高、瘦、接。例：我去机场接朋友。我以为照片里的人很高，可是他不太高。他看起来有点儿瘦。",
        { wordBank: ["以为", "像", "身高", "瘦", "接"], minSentences: 3, stretchSentences: 5, targetIds: ["v_hsk3_l01_01", "v_hsk3_l01_02", "v_hsk3_l01_04", "v_hsk3_l01_06", "v_hsk3_l01_07"] }
      ),
      task(
        "post_hsk3_l01_a_narrative",
        "text_narrative",
        "课文改写：把课文一改写成叙述体，说明谁去机场、接谁、为什么一开始认错了人。",
        "Rewrite Text 1 as a short narrative: who goes to the airport, who is being picked up, and why the person is mistaken at first.",
        "支架：刘明和王一雪在____。他们要____。刘明以为____，但是____。",
        { sample: "刘明和王一雪在家里聊天。他们要去机场接白家月。刘明以为照片里的人是杨同乐，但是王一雪说那个人叫李文。", targetIds: ["t_hsk3_l01_01"] }
      ),
      task(
        "post_hsk3_l01_a_picturebook",
        "picturebook_oral",
        "绘本口语准备：根据 4 张图准备一个 40 秒小故事。话题：去机场接一个没见过的朋友。",
        "Picture-book oral prep: use four pictures to prepare a 40-second story about picking up a friend you have never met.",
        "支架：1. 我有一张照片。2. 我去机场接朋友。3. 我看见一个人，他/她看起来____。4. 最后我____。",
        { picturePrompts: ["一张朋友照片", "机场到达口", "两个有点儿像的人", "找到朋友并打招呼"], targetIds: ["v_hsk3_l01_02", "v_hsk3_l01_07", "t_hsk3_l01_01"] }
      )
    ],
    B: [
      task(
        "post_hsk3_l01_b_word_paragraph",
        "word_paragraph",
        "词语成段：请从本次课中选 5 个词，写一小段机场求助的话。先写 3 句，能多写的同学拓展到 5 句。",
        "Choose 5 words from this session and write a short airport-help paragraph. Start with 3 sentences; extend to 5 if you can.",
        "可以用：行李、箱子、号码、护照、服务台。例：我的行李箱不见了。我去服务台，请工作人员帮我。我给他看了护照和号码。",
        { wordBank: ["行李", "箱子", "号码", "护照", "服务台"], minSentences: 3, stretchSentences: 5, targetIds: ["v_hsk3_l01_08", "v_hsk3_l01_10", "v_hsk3_l01_11", "v_hsk3_l01_14", "v_hsk3_l01_16"] }
      ),
      task(
        "post_hsk3_l01_b_narrative",
        "text_narrative",
        "课文改写：把课文二、三改写成叙述体，说明行李出了什么问题，大家怎么找人。",
        "Rewrite Texts 2 and 3 as a short narrative: what happened to the luggage and how people found the right person.",
        "支架：家月到机场以后，发现____。她们去____。后来她们看见____，最后____。",
        { targetIds: ["t_hsk3_l01_02", "t_hsk3_l01_03"] }
      ),
      task(
        "post_hsk3_l01_b_picturebook",
        "picturebook_oral",
        "绘本口语准备：根据 4 张图准备一个 40 秒小故事。话题：在机场行李不见了，去服务台求助。",
        "Picture-book oral prep: use four pictures to prepare a 40-second story about missing luggage and asking for help at the service desk.",
        "支架：1. 我的行李不见了。2. 我去服务台。3. 我说____。4. 工作人员帮助我____。",
        { picturePrompts: ["等行李", "发现箱子不见了", "去服务台", "找到行李"], targetIds: ["v_hsk3_l01_08", "v_hsk3_l01_10", "v_hsk3_l01_16"] }
      )
    ],
    C: [
      task(
        "post_hsk3_l01_c_word_paragraph",
        "word_paragraph",
        "词语成段：请从本次课中选 5 个词，写一小段到北京第一天的经历。先写 3 句，能多写的同学拓展到 5 句。",
        "Choose 5 words from this session and write a short paragraph about the first day in Beijing. Start with 3 sentences; extend to 5 if you can.",
        "可以用：发现、不见、带、照片、年轻。例：我到机场以后，发现朋友的箱子不见了。我带她去服务台。后来我们看见了照片里的人。",
        { wordBank: ["发现", "不见", "带", "照片", "年轻"], minSentences: 3, stretchSentences: 5, targetIds: ["v_hsk3_l01_17", "v_hsk3_l01_18", "v_hsk3_l01_23", "v_hsk3_l01_26", "v_hsk3_l01_27"] }
      ),
      task(
        "post_hsk3_l01_c_narrative",
        "text_narrative",
        "课文改写：把课文四改写成叙述体，按时间顺序复述李文到北京第一天的经历。",
        "Rewrite Text 4 as a narrative and retell Li Wen's first day in Beijing in time order.",
        "支架：昨天李文____。到机场的时候，____。走出机场的时候，____。晚上，____。",
        { targetIds: ["t_hsk3_l01_04"] }
      ),
      task(
        "post_hsk3_l01_c_picturebook",
        "picturebook_oral",
        "绘本口语准备：根据 5 张图准备一个 1 分钟故事。话题：一个朋友到北京的第一天。",
        "Picture-book oral prep: use five pictures to prepare a one-minute story about a friend's first day in Beijing.",
        "支架：到北京 → 找行李 → 见到朋友 → 吃中餐 → 说一说这一天怎么样。",
        { picturePrompts: ["到北京", "行李问题", "走出机场", "见到接机的人", "一起吃饭"], targetIds: ["t_hsk3_l01_04"] }
      )
    ]
  }
};

data.meta.dataQualityNotes = data.meta.dataQualityNotes || [];
data.meta.dataQualityNotes.push("2026-08-31 课后作业改为输出型任务：5词成段、课文叙述体改写、绘本口语准备；词汇扩展补充课次归属。");

fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
