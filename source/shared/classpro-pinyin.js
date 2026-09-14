(function (global) {
  var HANZI_RE = /[\u3400-\u9fff]/;
  var ALL_HANZI_RE = /[\u3400-\u9fff]/g;
  var INITIALS = ["zh", "ch", "sh", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"];
  var FINALS = ["iang", "iong", "uang", "ueng", "ang", "eng", "ing", "ong", "iao", "ian", "uai", "uan", "van", "ai", "ei", "ao", "ou", "an", "en", "in", "un", "vn", "ia", "ie", "iu", "ua", "uo", "ui", "ue", "ve", "er", "a", "o", "e", "i", "u", "v"];
  var EXTRA_SYLLABLES = ["m", "n", "ng", "hm", "hng", "r"];

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function plain(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ü/g, "v").toLowerCase();
  }

  function isSyllable(value) {
    var text = plain(value);
    if (!text) return false;
    if (EXTRA_SYLLABLES.indexOf(text) >= 0) return true;
    for (var i = 0; i < INITIALS.length; i++) {
      var initial = INITIALS[i];
      if (text.indexOf(initial) === 0 && FINALS.indexOf(text.slice(initial.length)) >= 0) return true;
    }
    return FINALS.indexOf(text) >= 0;
  }

  function splitToken(token) {
    var result = [];
    String(token || "").split(/['’]/).forEach(function (piece) {
      while (piece) {
        var cut = piece.length;
        while (cut > 0 && !isSyllable(piece.slice(0, cut))) cut--;
        if (cut <= 0) return;
        result.push(piece.slice(0, cut));
        piece = piece.slice(cut);
      }
    });
    return result;
  }

  function syllables(value) {
    var result = [];
    String(value || "")
      .replace(/[0-9_—–/\\()[\]{}.,!?;:，。？！；：“”‘’《》【】]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .forEach(function (token) { result = result.concat(splitToken(token)); });
    return result;
  }

  function normalize(value) {
    return syllables(value).map(function (item) { return item.toLowerCase(); }).join(" ");
  }

  function hanziCount(value) {
    return (String(value || "").match(ALL_HANZI_RE) || []).length;
  }

  function complete(text, pinyin) {
    if (!pinyin || HANZI_RE.test(String(pinyin))) return false;
    var expected = hanziCount(text);
    return !expected || syllables(pinyin).length === expected;
  }

  function dataLookup(text) {
    var data = global.ClassProPinyinData || {};
    return data[String(text || "")] || "";
  }

  function tone(value) {
    var text = String(value || "");
    if (/[āēīōūǖ]/.test(text)) return 1;
    if (/[áéíóúǘńḿ]/.test(text)) return 2;
    if (/[ǎěǐǒǔǚň]/.test(text)) return 3;
    if (/[àèìòùǜǹ]/.test(text)) return 4;
    return 0;
  }

  function composedLookup(text) {
    var source = String(text || "");
    var chars = Array.from(source).filter(function (char) { return HANZI_RE.test(char); });
    var readings = chars.map(function (char) { return dataLookup(char); });
    if (readings.some(function (reading) { return !complete("汉", reading); })) return "";
    readings = readings.map(function (reading, index) {
      var char = chars[index], nextTone = tone(readings[index + 1]);
      if (char === "不" && nextTone === 4) return "bú";
      if (char === "一" && nextTone === 4) return "yí";
      if (char === "一" && nextTone > 0 && nextTone < 4) return "yì";
      if (char === "得" && chars[index - 1] !== "觉" && chars[index + 1] !== "到" && !(chars[index - 1] === "不" && chars[index + 1] === "不")) return "de";
      return reading;
    });
    return readings.join(" ");
  }

  function vocabularyLookup(text) {
    var vocabulary = (global.LESSON_DATA && global.LESSON_DATA.vocabulary) || [];
    for (var i = 0; i < vocabulary.length; i++) {
      var item = vocabulary[i] || {};
      if ((item.hanzi || item.word) === text && complete(text, item.pinyin)) return item.pinyin;
    }
    return "";
  }

  function lookup(text, explicit) {
    var source = String(text || "");
    if (!HANZI_RE.test(source)) return "";
    var canonical = dataLookup(source);
    var candidate = complete(source, canonical) ? canonical : explicit;
    if (!complete(source, candidate)) candidate = vocabularyLookup(source);
    if (!complete(source, candidate)) candidate = composedLookup(source);
    return complete(source, candidate) ? normalize(candidate) : "";
  }

  function pinyinKey(key) {
    if (key === "hanzi" || key === "word" || key === "target" || key === "keyword") return "pinyin";
    if (key === "source_sentence") return "source_pinyin";
    if (key === "question_cn") return "question_pinyin";
    return key + "_pinyin";
  }

  function enrichObject(target) {
    if (!target || typeof target !== "object") return target;
    if (Array.isArray(target)) {
      target.forEach(enrichObject);
      return target;
    }
    Object.keys(target).forEach(function (key) {
      var value = target[key];
      if (Array.isArray(value)) {
        if (value.some(function (item) { return typeof item === "string" && HANZI_RE.test(item); })) {
          var arrayKey = key + "_pinyin";
          var existing = Array.isArray(target[arrayKey]) ? target[arrayKey] : [];
          target[arrayKey] = value.map(function (item, index) {
            return typeof item === "string" ? lookup(item, existing[index]) : "";
          });
        }
        value.forEach(enrichObject);
      } else if (value && typeof value === "object") {
        enrichObject(value);
      } else if (typeof value === "string" && HANZI_RE.test(value) && !/_pinyin$/.test(key) && key !== "pinyin") {
        var keyName = pinyinKey(key);
        var result = lookup(value, target[keyName]);
        if (result) target[keyName] = result;
      }
    });
    if (typeof target.hanzi === "string" && target.pinyin) target.pinyin = lookup(target.hanzi, target.pinyin);
    if (typeof target.word === "string" && target.pinyin) target.pinyin = lookup(target.word, target.pinyin);
    return target;
  }

  function ruby(text, pinyin, size) {
    var source = String(text || "");
    var readings = syllables(lookup(source, pinyin));
    var index = 0;
    var hanziFont = 'KaiTi,STKaiti,&quot;Kaiti SC&quot;,&quot;楷体&quot;,serif';
    if (readings.length !== hanziCount(source)) return escapeHtml(source);
    return Array.from(source).map(function (char) {
      if (!HANZI_RE.test(char)) return '<span class="classpro-ruby-punctuation">' + escapeHtml(char) + '</span>';
      var reading = readings[index++] || "";
      return '<ruby class="classpro-pinyin-ruby" style="font-size:' + (size || 24) + 'px;font-family:' + hanziFont + '"><rt data-pinyin="1">' + escapeHtml(reading) + '</rt><span>' + escapeHtml(char) + '</span></ruby>';
    }).join("");
  }

  if (global.document && !document.getElementById("classproPinyinStyles")) {
    var style = document.createElement("style");
    style.id = "classproPinyinStyles";
    style.textContent = ".classpro-pinyin-ruby{display:inline-flex;flex-direction:column;align-items:center;justify-content:flex-end;margin:0 1px 3px;line-height:1.05;vertical-align:bottom}.classpro-pinyin-ruby rt{font:700 12px/1 SimSun,\"Songti SC\",serif;color:#78836f;letter-spacing:0;white-space:nowrap}.classpro-pinyin-ruby>span{line-height:1.1}.classpro-ruby-punctuation{display:inline-block;margin:0 1px}";
    document.head.appendChild(style);
  }

  global.ClassProPinyin = {
    complete: complete,
    enrichCourse: enrichObject,
    enrichQuestion: enrichObject,
    lookup: lookup,
    normalize: normalize,
    ruby: ruby,
    syllables: syllables
  };
})(window);
