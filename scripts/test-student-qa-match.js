const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('source/in-class/student.html', 'utf8');

function functionSource(name) {
  const start = html.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Missing function: ${name}`);
  const open = html.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = open; i < html.length; i += 1) {
    const ch = html[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  throw new Error(`Unclosed function: ${name}`);
}

const pairs = Array.from({ length: 5 }, (_, index) => ({
  left: `问题${index + 1}`,
  right: `回答${index + 1}`,
}));

const context = {
  console,
  document: { getElementById: () => ({ innerHTML: '' }) },
};
vm.createContext(context);
vm.runInContext(`
  var RM='test-room', LESSON='HSK3-L10';
  var matchLeft=null, matchRight=null, matchPairs={}, submittedPayload=null;
  var current={question:{id:'qa-test'},mode:'v7'};
  var nameReady=true;
  function saveDraft(){}
  function render(){}
  function qdata(){return {pairs:${JSON.stringify(pairs)}}}
  function confirmName(){}
  function name(){return '测试学生'}
  function sendAnswer(payload){submittedPayload=payload}
  ${functionSource('matchRightUsed')}
  ${functionSource('pickMatch')}
  ${functionSource('submitMatching')}
`, context);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function submit(mapping) {
  context.matchLeft = null;
  context.matchRight = null;
  context.matchPairs = {};
  context.submittedPayload = null;
  mapping.forEach((right, left) => {
    context.pickMatch('L', left);
    context.pickMatch('R', right);
  });
  context.submitMatching();
  return context.submittedPayload;
}

const mixed = submit([1, 0, 2, 3, 4]);
assert(mixed.autoResult === 'wrong', 'Two wrong matches must mark the answer wrong.');
assert(mixed.score === 3 && mixed.total === 5, 'Mixed answer must score 3/5.');
assert(mixed.itemResults.filter(item => item.result === 'wrong').length === 2, 'Two wrong items must be preserved.');

const correct = submit([0, 1, 2, 3, 4]);
assert(correct.autoResult === 'correct', 'All correct matches must mark the answer correct.');
assert(correct.score === 5 && correct.total === 5, 'Correct answer must score 5/5.');

console.log(JSON.stringify({
  status: 'student Q&A matching passed',
  mixed: { result: mixed.autoResult, score: mixed.score, total: mixed.total, wrong: 2 },
  correct: { result: correct.autoResult, score: correct.score, total: correct.total },
}, null, 2));
