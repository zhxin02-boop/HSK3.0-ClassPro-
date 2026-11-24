(() => {
  'use strict';

  const W = window.SpecialWeek;
  let loading;
  function loadBroker() {
    if (window.mqtt) return Promise.resolve();
    if (!loading) {
      loading = new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.src = 'https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.3.0/mqtt.min.js';
        const timer = setTimeout(() => fail(), 10000);
        function fail() {
          clearTimeout(timer);
          tag.remove();
          loading = null;
          reject(new Error('Classroom broker unavailable'));
        }
        tag.onload = () => {
          clearTimeout(timer);
          if (window.mqtt) resolve();
          else fail();
        };
        tag.onerror = fail;
        document.head.append(tag);
      });
    }
    return loading;
  }

  function id() {
    return typeof crypto.randomUUID === 'function' ? crypto.randomUUID()
      : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }

  const algorithm = {name: 'ECDSA', namedCurve: 'P-256'};
  const signatureAlgorithm = {name:'ECDSA', hash:'SHA-256'};
  const encoder = new TextEncoder();
  function encode(data) {
    return btoa(String.fromCharCode(...new Uint8Array(data))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
  }
  function decode(text) {
    return Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), char => char.charCodeAt(0));
  }
  function body(payload) {
    return encoder.encode(JSON.stringify([payload.classId, String(payload.room), payload.set, payload.runId, payload.phase, payload.changedAt]));
  }

  async function studentAuth(token) {
    if (!/^[a-z0-9_-]{80,150}$/i.test(token || '')) throw new Error('Missing classroom invitation');
    const bytes = decode(token);
    const key = await crypto.subtle.importKey('spki', bytes, algorithm, false, ['verify']);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const channel = encode(hash).toLowerCase();
    return {token, channel,
      verify(payload) {
        if (!/^[a-z0-9_-]{80,100}$/i.test(payload.signature || '')) return Promise.resolve(false);
        return crypto.subtle.verify(signatureAlgorithm, key, decode(payload.signature), body(payload));
      }
    };
  }

  async function teacherAuth(scope) {
    const keyName = 'ClassProSpecialTeacher:' + scope.classId + ':' + scope.room;
    let pair;
    try { pair = JSON.parse(localStorage.getItem(keyName) || 'null'); } catch (_) {}
    if (!pair?.token || !pair.privateKey) {
      const key = await crypto.subtle.generateKey(algorithm, true, ['sign', 'verify']);
      pair = {
        token: encode(await crypto.subtle.exportKey('spki', key.publicKey)),
        privateKey: await crypto.subtle.exportKey('jwk', key.privateKey),
      };
      try {
        const existing = JSON.parse(localStorage.getItem(keyName) || 'null');
        if (existing?.token && existing.privateKey) pair = existing;
        else localStorage.setItem(keyName, JSON.stringify(pair));
      } catch (_) {}
    }
    const auth = await studentAuth(pair.token);
    const signer = await crypto.subtle.importKey('jwk', pair.privateKey, algorithm, false, ['sign']);
    return {...auth, async sign(payload) {
      return encode(await crypto.subtle.sign(signatureAlgorithm, signer, body(payload)));
    }};
  }

  function connect(scope, {auth, teacher = false, onStatus, onControl, onProgress}) {
    const classroom = window.ClassProClassroom;
    const context = {...scope, lesson: 'HSK3-SP-W1', run: 'special-' + auth.channel};
    const control = classroom.topic('control', context);
    const progress = classroom.topic('progress', context);
    let socket;
    let active = false;
    let stopped = false;

    function status(value) {
      active = value;
      if (!stopped) onStatus(value);
    }

    loadBroker().then(() => {
      if (stopped) return;
      socket = classroom.connectBroker('hsk3-special-' + id());
      socket.on('connect', () => socket.subscribe(teacher ? [control, progress] : [control],
        {qos: 1}, (error, grants) => {
          const available = !error && grants?.length && grants.every(grant => grant.qos < 128);
          status(Boolean(available));
        }));
      socket.on('reconnect', () => status(false));
      socket.on('offline', () => status(false));
      socket.on('close', () => status(false));
      socket.on('error', () => status(false));
      socket.on('message', (topic, bytes) => {
        let payload;
        try { payload = JSON.parse(bytes.toString()); } catch (_) { return; }
        if (!payload || payload.classId !== context.classId || String(payload.room) !== String(context.room)) return;
        if (topic === control) {
          if (/^HSK3-W1-SP0[1-5]$/.test(payload.set) && payload.runId &&
              ['open', 'closed'].includes(payload.phase) && Number.isFinite(payload.changedAt)) {
            auth.verify(payload).then(valid => { if (valid && !stopped) onControl(payload); }).catch(() => {});
          }
        } else if (topic === progress && onProgress && payload.studentId && payload.runId) {
          onProgress(payload);
        }
      });
    }).catch(() => status(false));

    function publish(topic, payload, retain) {
      return new Promise((resolve, reject) => {
        if (!active || !socket?.connected) return reject(new Error('Classroom connection unavailable'));
        const timer = setTimeout(() => reject(new Error('Classroom message not confirmed')), 6000);
        socket.publish(topic, JSON.stringify(classroom.envelope(payload, context)), {qos: 1, retain}, error => {
          clearTimeout(timer);
          if (error) reject(error);
          else resolve();
        });
      });
    }

    return {
      async control(payload) {
        const scoped = classroom.envelope(payload, context);
        scoped.signature = await auth.sign(scoped);
        return publish(control, scoped, true);
      },
      progress: payload => publish(progress, payload, false),
      close() {
        stopped = true;
        if (socket) socket.end(true);
      },
    };
  }

  function controlledLink(set, classId, room, token) {
    const url = new URL(W.setStudentLink(set, classId));
    url.searchParams.set('mode', 'classroom');
    url.searchParams.set('room', room);
    url.searchParams.set('invite', token);
    return url.href;
  }

  window.SpecialRoom = {connect, id, controlledLink, teacherAuth, studentAuth};
})();
