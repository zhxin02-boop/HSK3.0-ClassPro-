const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const file = path.join(root, "source", "data-model", "mock-tests", "HSK1-mock-01.json");
const test = JSON.parse(fs.readFileSync(file, "utf8"));

function fail(message) {
  console.error("Mock test validation failed:", message);
  process.exit(1);
}

if (!test.testId || test.mode !== "mock_test") fail("missing testId or mode");
if (!Array.isArray(test.sections) || !test.sections.length) fail("sections must be non-empty");

const ids = new Set();
let count = 0;
let listening = 0;
let reading = 0;
const partCounts = {};
const answers26to39 = [];
const forbiddenTerms = ["杯子", "苹果", "衣服", "钱", "多少钱", "块", "元", "三块五", "一百"];
const expectedParts = {
  L1_picture_choice: 5,
  L2_answer_choice: 5,
  L3_dialogue_picture_choice: 5,
  L4_sentence_question_answer: 5,
  R1_sentence_picture_match: 5,
  R2_question_answer_match: 5,
  R3_fill_blank: 5,
  R4_reading_comprehension: 5
};

for (const section of test.sections) {
  if (!section.id || !Array.isArray(section.items)) fail(`section ${section.id || "(missing)"} has no items`);
  for (const item of section.items) {
    count += 1;
    if (!item.id || ids.has(item.id)) fail(`duplicate or missing item id: ${item.id}`);
    ids.add(item.id);
    if (!item.skill || !item.part || !item.prompt) fail(`${item.id} missing skill/part/prompt`);
    partCounts[item.part] = (partCounts[item.part] || 0) + 1;
    if (!Array.isArray(item.options) || item.options.length < 2) fail(`${item.id} needs at least 2 options`);
    if (!item.answer || !item.options.some((o) => o.id === item.answer)) fail(`${item.id} answer must match an option id`);
    if (item.number >= 26 && item.number <= 39) answers26to39.push(item.answer);
    if (item.number !== count) fail(`${item.id} number must be sequential; expected ${count}`);
    if ((item.points || 1) !== 1) fail(`${item.id} points must be 1`);
    if (item.skill === "listening") {
      listening += 1;
      if (!item.audioText) fail(`${item.id} listening item missing audioText`);
    }
    if (item.skill === "reading") {
      reading += 1;
      if (!item.question) fail(`${item.id} reading item missing question`);
    }
    if (item.part === "R4_reading_comprehension" && !item.passage) fail(`${item.id} reading comprehension missing passage`);
    if (["L1_picture_choice", "L3_dialogue_picture_choice", "R1_sentence_picture_match"].includes(item.part) && !item.options.every((o) => o.image)) {
      fail(`${item.id} picture-choice item must use image options`);
    }
    const text = [item.audioText, item.question, item.passage, ...(item.options || []).map((o) => o.text)].filter(Boolean).join("");
    for (const term of forbiddenTerms) {
      if (text.includes(term)) fail(`${item.id} includes out-of-scope L10 shopping term: ${term}`);
    }
    for (const option of item.options) {
      if (!option.id || !option.text) fail(`${item.id} option missing id/text`);
      if (option.image) {
        const rel = option.image.replace(/^\.\.\//, "source/");
        const img = path.join(root, rel);
        if (!fs.existsSync(img)) fail(`${item.id} image not found: ${option.image}`);
      }
    }
  }
}

if (count !== 40) fail(`HSK1 mock test must include 40 items, got ${count}`);
if (listening !== 20 || reading !== 20) fail(`expected 20 listening and 20 reading items, got ${listening}/${reading}`);
if (!test.audioPolicy || test.audioPolicy.studentAudioControls !== false) fail("audioPolicy.studentAudioControls must be false");
if (test.audioParts) {
  for (const part of test.audioParts) {
    if (!part.part || !part.file) fail("audioParts entries must include part and file");
    const rel = part.file.replace(/^\.\.\//, "source/");
    const audio = path.join(root, rel);
    if (!fs.existsSync(audio)) fail(`audio file not found: ${part.file}`);
  }
}
if (new Set(answers26to39).size < 3) fail("answers for questions 26-39 must not all use the same option");
for (const [part, expected] of Object.entries(expectedParts)) {
  if ((partCounts[part] || 0) !== expected) fail(`${part} expected ${expected}, got ${partCounts[part] || 0}`);
}
console.log(`Mock test OK: ${test.testId}, ${count} items (${listening} listening, ${reading} reading)`);
