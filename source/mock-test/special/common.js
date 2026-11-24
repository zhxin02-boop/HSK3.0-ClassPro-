(() => {
  'use strict';

  const lesson = 'HSK3-L01';
  const data = new URL('../../data-model/special-tests/hsk3-w1/', location.href);
  const params = new URLSearchParams(location.search);
  const catalog = window.ClassProClassCatalog;
  const context = window.ClassProContext.read();
  const classes = catalog.forLevel('HSK3');
  const initialClass = classes.find(item => item.id === (params.get('classId') || context.classId)) ||
    classes.find(item => item.id === catalog.defaultClassIdForLesson(lesson)) || classes[0];
  const el = (id) => document.getElementById(id);

  function node(tag, content, className) {
    const element = document.createElement(tag);
    if (content != null) element.textContent = content;
    if (className) element.className = className;
    return element;
  }

  function choose(select, rows, value) {
    select.replaceChildren(...rows.map(row => {
      const option = node('option', row.label);
      option.value = row.id;
      return option;
    }));
    if (rows.some(row => row.id === value)) select.value = value;
  }

  function notice(message = '', error = false) {
    const status = el('notice');
    status.textContent = message;
    status.classList.toggle('error', error);
    status.hidden = !message;
  }

  function asset(path) { return new URL(path, data).href; }
  function timeout(ms) {
    return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(ms)
      : undefined;
  }

  async function json(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  }

  async function setRoster(classId) {
    try {
      if (!/(^|\.)github\.io$/i.test(location.hostname) && params.get('direct') !== '1') {
        const query = new URLSearchParams({classId, lesson});
        const payload = await json('/api/class-roster?' + query, {cache: 'no-store', signal: timeout(4000)});
        if (Array.isArray(payload.students) && payload.students.length) return payload.students;
      }
    } catch (_) {}
    return catalog.roster(classId, lesson);
  }

  function scopeFor(classId, student) {
    const item = classes.find(row => row.id === classId);
    const useRoom = params.get('classId') === classId && params.get('room');
    return {classId, teacherId: item.teacherId, room: useRoom || item.room,
      ...(student ? {studentId: student.id, studentName: student.name} : {})};
  }

  function getRecordUrl(action, query) {
    return window.ClassProShared.GAS_URL + '?' + new URLSearchParams({action, ...query});
  }

  function jsonp(url) {
    return new Promise((resolve, reject) => {
      const name = 'specialRecord_' + Math.random().toString(36).slice(2);
      const tag = node('script');
      const timer = setTimeout(() => finish(null, new Error('record confirmation timeout')), 12000);
      function finish(value, error) {
        clearTimeout(timer);
        tag.remove();
        delete window[name];
        if (error) reject(error);
        else resolve(value);
      }
      window[name] = value => finish(value);
      tag.onerror = () => finish(null, new Error('record confirmation unavailable'));
      tag.src = url + '&callback=' + name;
      document.head.append(tag);
    });
  }

  async function getRecords(action, query) {
    const url = getRecordUrl(action, query);
    try {
      return await json(url, {cache: 'no-store', signal: timeout(12000)});
    } catch (_) {
      return jsonp(url);
    }
  }

  function setStudentLink(set, classId) {
    const url = new URL('index.html', location.href);
    const scope = scopeFor(classId);
    url.search = new URLSearchParams({set, classId, room: scope.room, lesson});
    if (params.get('direct') === '1') url.searchParams.set('direct', '1');
    return url.href;
  }

  window.SpecialWeek = {lesson, params, context, classes, initialClass, el, node, choose, notice, asset, json,
    setRoster, scopeFor, getRecords, setStudentLink, timeout};
})();
