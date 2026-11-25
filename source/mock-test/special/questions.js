(() => {
  'use strict';

  const W = window.SpecialWeek;
  const {node} = W;

  function render(test, answers, {preview = false, teacherAudio = false, onPlay, transcript}) {
    function part(title, help) {
      const section = node('section', null, 'part');
      section.append(node('h3', title), node('p', help, 'help'));
      return section;
    }

    function photo(path, label, className) {
      const image = node('img', null, className);
      image.src = W.asset(path);
      image.alt = label;
      image.loading = 'lazy';
      image.decoding = 'async';
      return image;
    }

    function pool(values, kind) {
      const list = node('ul', null, 'pool ' + kind + '-pool');
      for (const [letter, value] of Object.entries(values)) {
        const item = node('li');
        if (kind === 'image') item.append(photo(value.image, '图片 ' + letter), node('span', letter));
        else item.append(node('b', letter + '　'), document.createTextNode(value));
        list.append(item);
      }
      return list;
    }

    function example(text, answer) {
      const block = node('div', null, 'example');
      if (text) block.append(node('p', text));
      block.append(node('p', '例题答案 ' + answer));
      return block;
    }

    function keyLine(value, reference = false) {
      return node('p', (reference ? '参考句：' : '答案：') + value, 'preview-key');
    }

    function choices(question, options, lettersOnly) {
      const field = node('fieldset', null, 'question');
      field.dataset.question = question.number;
      field.append(node('legend', '第' + question.number + '题'));
      if (question.passage) field.append(node('p', question.passage, 'passage'));
      const prompt = question.question || question.prompt;
      if (prompt) for (const row of prompt.split('／')) field.append(node('p', row));
      const group = node('div', null, lettersOnly ? 'choices letters' : 'choices');
      for (const [key, text] of Object.entries(options)) {
        const label = node(preview ? 'div' : 'label', null, 'choice');
        if (!preview) {
          const input = node('input');
          input.type = 'radio';
          input.name = question.id;
          input.value = key;
          input.checked = answers[question.id] === key;
          label.append(input);
        }
        const value = node('span');
        value.append(node('b', key));
        if (!lettersOnly) value.append(document.createTextNode(text));
        label.append(value);
        group.append(label);
      }
      field.append(group);
      const lines = transcript?.[question.id];
      if (preview && lines) {
        const text = node('div', null, 'preview-transcript');
        lines.forEach(line => text.append(node('p', line)));
        field.append(text);
      }
      if (preview) field.append(keyLine(question.answer));
      return field;
    }

    function showListening(parent) {
      const {listening} = test;
      const names = ['听对话选图片', '听对话和问题', '听短文和问题'];
      listening.audioParts.forEach((track, index) => {
        const from = index * 10 + 1;
        const section = part('第' + from + '–' + (from + 9) + '题 · ' + names[index],
          teacherAudio ? '录音由教师统一播放，每题听两遍。' : '点播放听录音，每题听两遍。');
        if (!teacherAudio) {
          const audio = node('audio');
          audio.controls = true;
          audio.preload = 'none';
          audio.src = W.asset(track.file);
          audio.setAttribute('aria-label', '第' + from + '–' + (from + 9) + '题录音');
          audio.addEventListener('play', () => onPlay(audio));
          audio.addEventListener('error', () => W.notice('录音加载失败。请检查网络后重新打开本套练习。', true));
          section.append(audio);
        }
        const items = listening.items.slice(index * 10, index * 10 + 10);
        if (index === 0) {
          ['A', 'B'].forEach((key, groupIndex) => {
            const options = listening.pictureGroups[key].pictures;
            section.append(node('h3', groupIndex === 0 ? '第1–5题图片' : '第6–10题图片'), pool(options, 'image'));
            if (!groupIndex) section.append(example('', listening.examples.picture.answer));
            items.slice(groupIndex * 5, groupIndex * 5 + 5).forEach(q => section.append(choices(q, options, true)));
          });
        } else {
          const sample = listening.examples[index === 1 ? 'dialogue' : 'monologue'];
          const text = Object.entries(sample.options).map(([key, value]) => key + ' ' + value).join('　');
          section.append(example(text, sample.answer));
          items.forEach(q => section.append(choices(q, q.options, false)));
        }
        parent.append(section);
      });
    }

    function showReading(parent) {
      const {reading} = test;
      const sets = [
        [31, '句子配对', '给每句话选择合适的句子。'],
        [41, '选词填空', '给空格选择合适的词语。'],
        [51, '短文理解', '读短文，选择正确答案。'],
      ];
      sets.forEach(([from, title, help], index) => {
        const section = part('第' + from + '–' + (from + 9) + '题 · ' + title, help);
        let previousMaterial = null;
        if (index === 2) {
          const demo = reading.examples.E3;
          const sample = example(demo.passage, demo.answer);
          sample.insertBefore(node('p', demo.question), sample.lastChild);
          sample.insertBefore(node('p', Object.entries(demo.options).map(([k, v]) => k + ' ' + v).join('　')), sample.lastChild);
          section.append(sample);
        }
        for (const q of reading.items.slice(index * 10, index * 10 + 10)) {
          const material = reading.materials[q.materialId];
          if (material && q.materialId !== previousMaterial) {
            previousMaterial = q.materialId;
            if (material.passage) section.append(node('p', material.passage, 'example'));
            else {
              section.append(pool(material.options, index === 0 ? 'sentence' : 'word'));
              const sample = Object.values(reading.examples).find(row => row.materialId === q.materialId);
              if (sample) section.append(example(sample.prompt.replaceAll('／', '　'), sample.answer));
            }
          }
          section.append(choices(q, q.options || material.options, index < 2));
        }
        parent.append(section);
      });
    }

    function writingQuestion(q, isPinyin) {
      const field = node('fieldset', null, 'question');
      field.dataset.question = q.number;
      field.append(node('legend', '第' + q.number + '题'));
      const input = node(isPinyin ? 'input' : 'textarea');
      input.name = q.id;
      input.value = answers[q.id] || '';
      input.setAttribute('aria-label', '第' + q.number + '题' + (isPinyin ? '填写一个汉字' : '用' + q.word + '写句子'));
      input.autocomplete = 'off';
      input.spellcheck = false;
      if (isPinyin) {
        const [before, after] = q.prompt.split('（　）');
        const prompt = node('p', before);
        const slot = node('span', null, 'pinyin-gap');
        slot.append(node('small', q.pinyin), node('span', '（　）'));
        prompt.append(slot, document.createTextNode(after));
        input.type = 'text';
        input.placeholder = '输入一个汉字';
        input.maxLength = 2;
        field.append(prompt);
      } else {
        field.append(photo(q.image, '第' + q.number + '题图片', 'question-photo'), node('p', '用这个词写句子：' + q.word));
        input.placeholder = '写一个完整的句子';
        input.maxLength = 200;
      }
      if (preview) field.append(keyLine(isPinyin ? q.answer : q.reference, !isPinyin));
      else field.append(input);
      return field;
    }

    function showWriting(parent) {
      const {writing} = test;
      const pinyin = part('第61–65题 · 拼音补字', '根据拼音，填入一个汉字。');
      const hanzi = writing.examples.pinyinCharacter;
      pinyin.append(example(hanzi.prompt.replace('（　）', '（' + hanzi.pinyin + '）'), hanzi.answer));
      writing.items.slice(0, 5).forEach(q => pinyin.append(writingQuestion(q, true)));
      const sentence = part('第66–70题 · 看图造句', '用指定的词写一个完整的句子，由教师批改。');
      const demo = writing.examples.pictureSentence;
      const sample = example(demo.word, demo.answer);
      sample.prepend(photo(demo.image, '书写例题图片'));
      sentence.append(sample);
      writing.items.slice(5).forEach(q => sentence.append(writingQuestion(q, false)));
      parent.append(pinyin, sentence);
    }

    return Object.entries({listening: showListening, reading: showReading, writing: showWriting}).map(([skill, build]) => {
      const panel = node('div');
      panel.dataset.panel = skill;
      build(panel);
      return panel;
    });
  }

  window.SpecialQuestions = {render};
})();
