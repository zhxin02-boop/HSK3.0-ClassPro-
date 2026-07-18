// ClassPro+ GAS API helper
(function (global) {
  var ClassProShared = global.ClassProShared || (global.ClassProShared = {});
  var DEFAULT_GAS = "https://script.google.com/macros/s/AKfycbxrCd6f6cQ3wocXYQZyLKY0JutolEmOWWzTGOABnnHHJOm697OfyBlkLw-SQ-u-9ZAO/exec";

  function postRecord(record, gasUrl) {
    var url = gasUrl || DEFAULT_GAS;
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(record)
    });
  }

  function postRecords(records, gasUrl) {
    return Promise.all((records || []).map(function (r) { return postRecord(r, gasUrl); }));
  }

  ClassProShared.GAS_URL = DEFAULT_GAS;
  ClassProShared.postRecord = postRecord;
  ClassProShared.postRecords = postRecords;
})(window);
