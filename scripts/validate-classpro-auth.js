const fs = require('fs');
const path = require('path');
const authModule = require('../server-auth');

function assert(condition, message) { if (!condition) throw new Error(message); }

const passwordHash = authModule.hashPassword('correct-password', '0123456789abcdef0123456789abcdef');
assert(authModule.verifyPassword('correct-password', passwordHash), 'The correct password should verify');
assert(!authModule.verifyPassword('wrong-password', passwordHash), 'An incorrect password must fail');

const auth = authModule.createAuth({
  sessionSecret: 'test-session-secret',
  accounts: [{
    id: 'teacher-a',
    username: 'TeacherA',
    displayName: 'Teacher A',
    passwordHash,
    classIds: ['class-a']
  }]
});

assert(auth.configured, 'Teacher authentication should report configured accounts');
assert(!auth.login('TeacherA', 'wrong-password', 'test-address').ok, 'Incorrect credentials must be rejected');
const login = auth.login('teachera', 'correct-password', 'test-address');
assert(login.ok && login.token, 'Teacher usernames should be case-insensitive and create a session');

const request = { headers: { cookie: `${authModule.COOKIE_NAME}=${login.token}` } };
const profile = auth.authenticate(request);
assert(profile && profile.id === 'teacher-a', 'A valid session should resolve the teacher');
assert(auth.canAccess(profile, 'class-a'), 'The teacher should access an assigned class');
assert(!auth.canAccess(profile, 'class-b'), 'The teacher must not access an unassigned class');
assert(!Object.prototype.hasOwnProperty.call(profile, 'passwordHash'), 'Public profiles must not expose password hashes');
auth.logout(request);
assert(!auth.authenticate({headers:{}}), 'A cleared browser cookie should end the session');

const restartedAuth = authModule.createAuth({
  sessionSecret: 'test-session-secret',
  accounts: [{
    id: 'teacher-a',
    username: 'TeacherA',
    displayName: 'Teacher A',
    passwordHash,
    classIds: ['class-a']
  }]
});
assert(restartedAuth.authenticate(request), 'Signed teacher sessions should survive a server restart');

const root = path.resolve(__dirname, '..');
const serverSource = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
assert(serverSource.includes('/api/auth/login'), 'The server should expose teacher login');
assert(serverSource.includes('/api/teacher/reviews'), 'Teacher-wide data should use an authenticated endpoint');
assert(serverSource.includes('teacherAuth.canAccess'), 'The server should enforce class assignments');

console.log('ClassPro teacher authentication validation passed.');
