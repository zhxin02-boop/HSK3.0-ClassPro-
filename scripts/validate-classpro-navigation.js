const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const storage = {};
const windowObject = {
  location: { search: '?lesson=HSK3-L03&room=7788&session=B&student=Student' },
  localStorage: {
    getItem(key) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null; },
    setItem(key, value) { storage[key] = String(value); }
  }
};
windowObject.window = windowObject;
const sandbox = { window: windowObject, URLSearchParams };
vm.createContext(sandbox);

function load(relativePath) {
  const file = path.join(root, relativePath);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

load('source/data-model/hsk1-curriculum.js');
load('source/data-model/hsk3-curriculum.js');
load('source/shared/course-catalog.js');
load('source/shared/context.js');
load('source/shared/progress-rules.js');
load('source/shared/progress-data.js');

const catalog = windowObject.ClassProCourseCatalog;
const levels = catalog.levels();
const all = catalog.all();
assert(catalog.lessons('HSK1').length === 15, 'HSK1 should contain 15 lessons');
assert(catalog.lessons('HSK3').length === 18, 'HSK3 should contain 18 lessons');
assert(levels.length === 5, 'The level selector should contain HSK1-HSK5');
assert(new Set(all.map((lesson) => lesson.id)).size === all.length, 'Lesson ids must be unique');

['HSK1', 'HSK3'].forEach((levelId) => {
  catalog.lessons(levelId).forEach((lesson, index) => {
    const expectedNo = index + 1;
    assert(lesson.id === `${levelId}-L${String(expectedNo).padStart(2, '0')}`, `${levelId} lesson ids must be sequential`);
    assert(lesson.no === expectedNo, `${lesson.id} has an invalid lesson number`);
    assert(typeof lesson.openForUse === 'boolean', `${lesson.id} must define openForUse`);
    assert(typeof lesson.teacherVisible === 'boolean', `${lesson.id} must define teacherVisible`);
    assert(String(lesson.title || '').trim(), `${lesson.id} must have a title`);
  });
});

catalog.lessons('HSK3').forEach((lesson) => {
  assert(!/^第\d+课$/.test(lesson.title), `${lesson.id} still uses a placeholder title`);
});

all.filter((lesson) => lesson.openForUse).forEach((lesson) => {
  const file = lesson.id === 'HSK1-L01'
    ? path.join(root, 'source/data-model/HSK1-L01_content_draft.json')
    : path.join(root, 'source/data-model/lessons', `${lesson.id}.json`);
  assert(fs.existsSync(file), `${lesson.id} is open but its lesson data is missing`);
});

const context = windowObject.ClassProContext;
const current = context.read();
assert(current.lesson === 'HSK3-L03', 'Context should read lesson from the URL');
assert(current.room === '7788', 'Context should read room from the URL');
assert(current.session === 'B', 'Context should preserve the A/B/C session');
assert(current.student === 'Student', 'Context should preserve the student');
assert(context.validLesson('HSK3-L18'), 'HSK3 lesson ids should be valid');
assert(!context.validLesson('HSK3-L99'), 'Unknown catalog lessons should be invalid');

const beforeBuild = storage.ClassProContext;
const query = new URLSearchParams(context.buildQuery({ session: 'C' }));
assert(query.get('lesson') === 'HSK3-L03', 'Generated links should preserve the lesson');
assert(query.get('room') === '7788', 'Generated links should preserve the room');
assert(query.get('session') === 'C', 'Generated links should include the selected session');
assert(query.get('student') === 'Student', 'Generated links should preserve the student');
assert(storage.ClassProContext === beforeBuild, 'Building a link must not change saved context');

const progressRules = windowObject.ClassProProgressRules;
assert(progressRules.threshold === 0.7, 'Lesson completion threshold should be 70%');
assert(progressRules.isLessonComplete({ pre_class: 70, in_class: 70, post_class: 70 }), 'All three stages at 70% should complete a lesson');
assert(!progressRules.isLessonComplete({ pre_class: 100, in_class: 100, post_class: 69 }), 'Every stage must reach 70%; a high average is not enough');

const progressData = windowObject.ClassProProgressData;
const progressRows = [];
['A', 'B', 'C'].forEach((session) => {
  progressRows.push({ studentName: 'Student', lesson: 'HSK3-L03', stage: '预习', module: 'pre_progress_summary', sessionId: session, score: 5, total: 5, answer: JSON.stringify({ session, rate: 1 }) });
  progressRows.push({ studentName: 'Student', lesson: 'HSK3-L03', stage: 'post_class', module: 'homework_summary', questionId: `homework_${session}`, sessionId: session, answer: JSON.stringify({ session }) });
});
['q1', 'q2', 'q3'].forEach((questionId) => {
  progressRows.push({ studentName: 'Another Student', lesson: 'HSK3-L03', stage: '课中', module: 'choice', questionId });
  progressRows.push({ studentName: 'Student', lesson: 'HSK3-L03', stage: '课中', module: 'choice', questionId });
});
const fullProgress = progressData.fromRows(progressRows, { student: 'Student', lesson: 'HSK3-L03' });
assert(progressRules.isLessonComplete(fullProgress.rates), 'Sheet records for all three stages should sprout the lesson');
const partialProgress = progressData.fromRows(progressRows.filter((row) => row.sessionId !== 'C'), { student: 'Student', lesson: 'HSK3-L03' });
assert(partialProgress.rates.pre_class < 0.7 && partialProgress.rates.post_class < 0.7, 'Two of three HSK3 sessions should stay below the 70% lesson threshold');

['source/student/index.html', 'source/teacher/index.html'].forEach((relativePath) => {
  const html = fs.readFileSync(path.join(root, relativePath), 'utf8');
  assert(html.includes('../shared/course-catalog.js'), `${relativePath} must load the shared catalog`);
});

const studentHome = fs.readFileSync(path.join(root, 'source/student/index.html'), 'utf8');
assert(studentHome.includes('../shared/progress-rules.js'), 'Student journey must load the shared completion rule');
assert(studentHome.includes('../shared/progress-data.js'), 'Student journey must load the Google Sheets progress adapter');
assert(studentHome.includes('id="adventureMap"'), 'Student home must render the lesson adventure path');
assert(studentHome.includes('三项都达到 70%'), 'Student home must explain the three-stage completion rule');

const teacherClassroom = fs.readFileSync(path.join(root, 'source/in-class/teacher.html'), 'utf8');
assert(teacherClassroom.includes('../shared/classpro-theme.css'), 'Teacher classroom must load the shared theme');
assert(teacherClassroom.includes('./teacher-classroom.css'), 'Teacher classroom must load its shell overrides');

const entryNavigation = [
  fs.readFileSync(path.join(root, 'source/student/index.html'), 'utf8'),
  fs.readFileSync(path.join(root, 'source/student/lesson-links.js'), 'utf8'),
  fs.readFileSync(path.join(root, 'source/teacher/index.html'), 'utf8')
].join('\n');
assert(!entryNavigation.includes('room=8888&lesson='), 'Entry navigation must not hard-code room 8888');

console.log(`ClassPro navigation validation passed: ${all.length} lessons, shared context and links verified.`);
