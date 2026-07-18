// ClassPro+ local progress storage
(function (global) {
  var ClassProShared = global.ClassProShared || (global.ClassProShared = {});

  function key(parts) {
    return ["ClassProProgress"].concat(parts || []).filter(Boolean).join("_");
  }

  function saveProgress(parts, data) {
    try {
      localStorage.setItem(key(parts), JSON.stringify(Object.assign({ savedAt: new Date().toISOString() }, data || {})));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadProgress(parts) {
    try {
      var raw = localStorage.getItem(key(parts));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearProgress(parts) {
    try {
      localStorage.removeItem(key(parts));
      return true;
    } catch (e) {
      return false;
    }
  }

  ClassProShared.progressKey = key;
  ClassProShared.saveProgress = saveProgress;
  ClassProShared.loadProgress = loadProgress;
  ClassProShared.clearProgress = clearProgress;
})(window);
