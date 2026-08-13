const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "source", "data-model", "lessons", "HSK1-L11.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const groups = data.inClass.questionGroups.v7_word_match || [];

const pinyinFixes = new Map([
  ["你什么时候能到饭店？", "nǐ shénme shíhou néng dào fàndiàn"],
  ["还不知道，正在找呢。", "hái bù zhīdào, zhèngzài zhǎo ne"],
  ["你开车没开车？", "nǐ kāichē méi kāichē"],
  ["我没开车，坐车呢。", "wǒ méi kāichē, zuò chē ne"],
  ["它是不是在超市后边？", "tā shì bú shì zài chāoshì hòubian"],
  ["是的。", "shì de"],
  ["你还在读大学吗？", "nǐ hái zài dú dàxué ma"],
  ["对，我读大学呢。", "duì, wǒ dú dàxué ne"],
  ["你们学习忙不忙？", "nǐmen xuéxí máng bù máng"],
  ["非常忙。", "fēicháng máng"],
  ["你学什么？", "nǐ xué shénme"],
  ["我学医。", "wǒ xué yī"],
  ["弟弟起床没起床呢？", "dìdi qǐchuáng méi qǐchuáng ne"],
  ["没起床呢。", "méi qǐchuáng ne"],
  ["他今天去不去那里？", "tā jīntiān qù bú qù nàli"],
  ["他不去。", "tā bú qù"],
  ["去哪里？", "qù nǎli"],
  ["去超市。", "qù chāoshì"],
  ["他今天要做什么？", "tā jīntiān yào zuò shénme"],
  ["要和小朋友玩。", "yào hé xiǎopéngyǒu wán"],
  ["谁还在睡觉？", "shéi hái zài shuìjiào"],
  ["弟弟还在睡觉。", "dìdi hái zài shuìjiào"],
  ["谁读大学？", "shéi dú dàxué"],
  ["李文读大学。", "Lǐ Wén dú dàxué"],
  ["饭店在哪儿？", "fàndiàn zài nǎr"],
  ["在超市后边。", "zài chāoshì hòubian"],
  ["李文怎么去饭店？", "Lǐ Wén zěnme qù fàndiàn"],
  ["坐车去。", "zuò chē qù"],
  ["李文学什么？", "Lǐ Wén xué shénme"],
  ["学医。", "xué yī"],
  ["弟弟起床了吗？", "dìdi qǐchuáng le ma"],
  ["没有。", "méiyǒu"],
  ["你正在找什么？", "nǐ zhèngzài zhǎo shénme"],
  ["我正在找饭店。", "wǒ zhèngzài zhǎo fàndiàn"],
  ["谁在读大学？", "shéi zài dú dàxué"],
  ["李文在读大学。", "Lǐ Wén zài dú dàxué"],
  ["你正在学什么？", "nǐ zhèngzài xué shénme"],
  ["我学医。", "wǒ xué yī"],
  ["你要做什么？", "nǐ yào zuò shénme"],
  ["我要和小朋友玩。", "wǒ yào hé xiǎopéngyǒu wán"]
]);

if (groups[4]) {
  groups[4].data.pairs = [
    ["你正在找什么？", "我正在找饭店。"],
    ["谁在读大学？", "李文在读大学。"],
    ["你正在学什么？", "我正在学医。"],
    ["你要做什么？", "我要和小朋友玩。"]
  ].map(([left, right]) => ({
    left,
    left_pinyin: pinyinFixes.get(left),
    right,
    right_pinyin: pinyinFixes.get(right)
  }));
}

for (const group of groups) {
  for (const pair of group.data.pairs || []) {
    pair.left_pinyin = pinyinFixes.get(pair.left) || pair.left_pinyin;
    pair.right_pinyin = pinyinFixes.get(pair.right) || pair.right_pinyin;
  }
}

data.classProQuestions.wordMatch = groups;
fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Fixed HSK1-L11 word match group 5 and pinyin.");
