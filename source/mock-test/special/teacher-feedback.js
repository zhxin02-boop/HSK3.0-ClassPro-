(() => {
  'use strict';

  const W = window.SpecialWeek;
  const R = window.SpecialRecords;
  const L = window.SpecialLearning;

  function profileButton(person, classId) {
    const button = W.node('button', null, 'secondary profile-button');
    button.type = 'button';
    const avatar = W.node('span', Array.from(person.name || '学')[0], 'student-avatar');
    avatar.setAttribute('aria-hidden', 'true');
    button.append(avatar, W.node('span', person.name + ' · 学习报告 / Learning Report'));
    button.addEventListener('click', () => profile(person, classId));
    return button;
  }

  function profile(person, classId) {
    L.dialog(['学习发展报告', 'Learning Progress Report'], async () => {
      const [{sets: catalog, partial}, roster] = await Promise.all([W.loadCatalogs(), W.setRoster(classId)]);
      const sets = await Promise.allSettled(catalog.map(async set => {
        const [bank, rows, media] = await Promise.all([
          W.json(W.asset(set.file, set.id)), R.readRows(set.id, classId), L.mediaFor(set.id)
        ]);
        const attempts = R.collect(rows, R.questions(bank), roster, classId, {all: true})
          .filter(result => result.studentId === person.id);
        return attempts.map(result => ({bank, result, media}));
      }));
      const history = sets.flatMap(entry => entry.status === 'fulfilled' ? entry.value : [])
        .sort((a, b) => (Date.parse(b.result.when) || 0) - (Date.parse(a.result.when) || 0));
      return L.reportContents(person, history, {partial: partial || sets.some(entry => entry.status === 'rejected')});
    });
  }

  window.SpecialTeacherFeedback = {profileButton};
})();
