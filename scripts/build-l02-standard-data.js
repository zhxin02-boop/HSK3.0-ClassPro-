// Generates the canonical L02 course data file from the currently accepted L02 runtime data.
// The generated file is data-only; no course page reads it until the compatibility loader is added.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'source', 'in-class', 'data_L02.js');
const preClassPath = path.join(root, 'source', 'data-model', 'HSK1-L02_preclass.json');
const outputDir = path.join(root, 'source', 'data-model', 'lessons');
const outputPath = path.join(outputDir, 'HSK1-L02.json');

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(runtimePath, 'utf8'), sandbox, { filename: runtimePath });

const source = sandbox.window.LESSON_DATA;
if (!source || !source.meta || source.meta.lessonKey !== 'HSK1-L02') {
  throw new Error('Unable to load accepted HSK1-L02 runtime data.');
}

const preClassFile = JSON.parse(fs.readFileSync(preClassPath, 'utf8'));
const homework = source.postClassHomework || {};

function clone(value) {
  return JSON.parse(JSON.stringify(value == null ? null : value));
}

function minutes(value) {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : 15;
}

function competitionQuestion(question, round) {
  const data = question.data || {};
  const options = data.options || question.options || [];
  const answer = question.correct_answer || question.answer || '';
  return {
    id: `pk_l02_${String(round).padStart(2, '0')}`,
    type: 'pk_question',
    stage: 'in_class',
    round,
    time_limit_sec: 10,
    prompt_cn: '快速选择题！',
    prompt_en: 'Quick quiz!',
    data: {
      question_cn: data.question_cn || data.sentence || question.prompt_cn || '',
      question_en: data.question_en || question.prompt_en || '',
      options,
      correct_index: options.indexOf(answer)
    },
    correct_answer: answer,
    kp: question.kp || question.module || ''
  };
}

function competitionPool(groups) {
  const base = (groups.pk_question || []).slice(0, 4);
  const reusable = (groups.v5_vocab_fill || []).slice(0, 10)
    .concat((groups.w1_component_char || []).slice(0, 6));
  const generated = reusable.map((question, index) => competitionQuestion(question, base.length + index + 1));
  return base.concat(generated).slice(0, 20).map((question, index) => Object.assign({}, question, { round: index + 1 }));
}

const tiers = {};
Object.keys(homework.tiers || {}).forEach((tier) => {
  const item = homework.tiers[tier] || {};
  tiers[tier] = {
    label: item.label || `${tier}档`,
    goal: item.goal || '',
    suggestedMinutes: minutes(item.suggested_minutes || item.suggestedMinutes),
    suggestedMix: item.suggested_mix || item.suggestedMix || ''
  };
});

const course = {
  schemaVersion: 'hsk1-course-v1',
  meta: clone(source.meta),
  features: {
    pinyin: false,
    hanziWritingDemo: Boolean(source.meta.showHanziWritingDemo),
    vocabExamples: Boolean(source.meta.showVocabExamples),
    competition: true,
    postClassHomework: true
  },
  vocabulary: clone(source.vocabulary || []),
  texts: clone(source.texts || []),
  grammar: clone(source.grammar || []),
  preClass: clone(preClassFile.preClass || { questions: [] }),
  inClass: {
    questionGroups: clone(source.classProQuestions || {}),
    hanziWriting: { characters: [] }
  },
  postClassHomework: {
    tiers,
    sharedPool: clone(homework.shared_pool || []),
    tierPools: clone(homework.tier_pools || {}),
    assignmentSelection: clone(homework.assignment_selection || {}),
    reviewPolicy: clone(homework.review_policy || {})
  },
  report: {},
  compatibility: {
    generatedFrom: 'source/in-class/data_L02.js + source/data-model/HSK1-L02_preclass.json',
    generatedAt: new Date().toISOString(),
    legacyQuestionGroups: ['v5_vocab_fill', 'g1_ordering', 'pk_question']
  }
};

course.inClass.questionGroups.pk_question = competitionPool(source.classProQuestions || {});

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(course, null, 2) + '\n', 'utf8');

console.log(`Generated ${path.relative(root, outputPath)}`);
console.log(`Vocabulary: ${course.vocabulary.length}; texts: ${course.texts.length}; pre-class: ${course.preClass.questions.length}; in-class groups: ${Object.keys(course.inClass.questionGroups).length}`);
