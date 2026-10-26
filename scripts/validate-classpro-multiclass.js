const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
function assert(condition, message) { if (!condition) throw new Error(message); }
function source(relativePath) { return fs.readFileSync(path.join(root, relativePath), 'utf8'); }

const windowObject = {
  location: { search: '?lesson=HSK1-L01&classId=ai26401-fall-class-1' },
  localStorage: { getItem() { return null; }, setItem() {} }
};
windowObject.window = windowObject;
const browser = { window: windowObject, location: windowObject.location, URLSearchParams, encodeURIComponent };
vm.createContext(browser);
['source/shared/class-config.js', 'source/shared/context.js', 'source/shared/students.js', 'source/shared/classroom-channel.js'].forEach((file) => {
  vm.runInContext(source(file), browser, { filename: file });
});

const context = windowObject.ClassProContext.read();
assert(context.classId === 'ai26401-fall-class-1', 'Pilot class should load from the URL');
assert(context.room === '8888', 'Pilot class should use its configured default room');
assert(context.teacherId === 'wumeiqi', 'Pilot class should resolve WuMeiqi');
assert(windowObject.CLASS_STUDENTS.length === 1 && windowObject.CLASS_STUDENTS[0] === 'Student', 'The public pilot should expose only its test account');
const record = windowObject.ClassProContext.record({ studentName: 'Student' });
assert(record.studentId === 'ai26401-fall-1-student-test' && record.classId === 'ai26401-fall-class-1', 'Test records should receive student and class ids');
const classCatalog = windowObject.ClassProClassCatalog;
assert(classCatalog.forLevel('HSK1').length === 3, 'HSK1 should offer the historical class and two pilot classes');
assert(classCatalog.forLevel('HSK3').length === 1, 'HSK3 should only offer the current spring class');
const fall1 = classCatalog.roster('ai26401-fall-class-1', 'HSK1-L01');
const fall2 = classCatalog.roster('ai26401-fall-class-2', 'HSK1-L01');
assert(fall1.length === 1 && fall2.length === 1, 'Both public pilot classes should contain only one test account');
assert(fall1.filter((student) => student.testAccount && student.name === 'Student').length === 1, 'Fall class 1 should contain one Student test account');
assert(fall2.filter((student) => student.testAccount && student.name === 'Student').length === 1, 'Fall class 2 should contain one Student test account');
assert(new Set(fall1.concat(fall2).map((student) => student.id)).size === 2, 'Pilot test ids should be unique');
assert(classCatalog.roster('rufe-2025-class-4', 'HSK1-L01').some((student) => student.testAccount && student.name === 'Student'), 'RUFE should contain a Student test account');
assert(classCatalog.roster('ai26401-spring', 'HSK3-L01').some((student) => student.testAccount && student.name === 'Student'), 'Spring HSK3 should contain a Student test account');
assert(classCatalog.defaultClassIdForLesson('HSK1-L01') === 'rufe-2025-class-4', 'Historical HSK1 should remain the default HSK1 class');
assert(classCatalog.defaultClassIdForLesson('HSK3-L01') === 'ai26401-spring', 'Current HSK3 should remain the default HSK3 class');

const topicA = windowObject.ClassProClassroom.topic('answers', { classId: 'ai26401-fall-class-1', room: '8888', lesson: 'HSK1-L01' });
const topicB = windowObject.ClassProClassroom.topic('answers', { classId: 'ai26401-fall-class-2', room: '8888', lesson: 'HSK1-L01' });
assert(topicA !== topicB, 'Classes must not share an MQTT topic');

const gas = {};
vm.createContext(gas);
vm.runInContext(source('source/data-model/ClassPro_GAS_v2.js'), gas, { filename: 'ClassPro_GAS_v2.js' });
assert(gas.HEADERS.slice(-3).join(',') === '教师ID,班级ID,学生ID', 'GAS must append identity columns');
const pilotRow = new Array(gas.HEADERS.length).fill('');
pilotRow[2] = 'HSK1-L01';
pilotRow[22] = 'ai26401-fall-class-1';
assert(gas.recordMatchesScope_(pilotRow, { classId: 'ai26401-fall-class-1' }), 'GAS should return records from the requested class');
assert(!gas.recordMatchesScope_(pilotRow, { classId: 'ai26401-fall-class-2' }), 'GAS should hide records from other classes');
const oldHsk1Row = new Array(gas.HEADERS.length).fill('');
oldHsk1Row[2] = 'HSK1-L01';
oldHsk1Row[1] = 'Legacy Student';
assert(gas.recordMatchesScope_(oldHsk1Row, { classId: 'rufe-2025-class-4' }), 'Historical HSK1 rows should remain with the RUFE class');
assert(gas.lessonProgress_([oldHsk1Row], 'Legacy Student', 'HSK1-L01', 'rufe25-4-01').records === 1, 'Historical rows without student ids should still match by name');
const oldHsk3Row = new Array(gas.HEADERS.length).fill('');
oldHsk3Row[2] = 'HSK3-L03';
assert(gas.recordMatchesScope_(oldHsk3Row, { classId: 'ai26401-spring' }), 'Historical HSK3 rows should remain with the spring class');

[
  'source/teacher/index.html',
  'source/teacher/login.html',
  'source/student/index.html',
  'source/student/entry.html',
  'source/in-class/teacher.html',
  'source/in-class/student.html',
  'source/pre-class/index.html',
  'source/post-class/student-report.html',
  'source/teacher-dashboard/unified.html',
  'source/teacher-dashboard/post-review.html'
].forEach((file) => {
  const html = source(file), scripts = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match, index = 0;
  while ((match = scripts.exec(html))) {
    index += 1;
    if (/\bsrc\s*=/.test(match[1]) || /type\s*=\s*["'](?:application\/json|application\/ld\+json)["']/.test(match[1])) continue;
    new vm.Script(match[2], { filename: `${file}#script-${index}` });
  }
});

const home = source('index.html');
assert(home.includes('/source/teacher/login.html"') || home.includes('source/teacher/index.html?direct=1"'), 'The main role page should lead teachers to an available workspace');
assert(home.includes('/source/student/entry.html"') || home.includes('source/student/entry.html?direct=1"'), 'The main role page should lead students to class and name selection');
const studentEntry = source('source/student/entry.html');
assert(studentEntry.includes('id="classSelect"') && studentEntry.includes('id="studentSelect"'), 'Student entry should ask for class and name');

console.log('ClassPro multiclass pilot validation passed.');
