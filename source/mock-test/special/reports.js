(() => {
  'use strict';
  const parts = [
    {name: '听力 · 听对话选图', from: 1, to: 10},
    {name: '听力 · 听对话和问题', from: 11, to: 20},
    {name: '听力 · 听短文和问题', from: 21, to: 30},
    {name: '阅读 · 句子配对', from: 31, to: 40},
    {name: '阅读 · 选词填空', from: 41, to: 50},
    {name: '阅读 · 短文理解', from: 51, to: 60},
    {name: '书写 · 拼音补字', from: 61, to: 65},
    {name: '书写 · 看图造句', from: 66, to: 70},
  ];

  function sectionFor(number) {
    return number <= 30 ? 'listening' : number <= 60 ? 'reading' : 'writing';
  }

  function outcome(result, number) {
    if (result.sections && !result.sections.includes(sectionFor(number))) return null;
    if (number <= 65) return result.summary.wrong.includes(number) ? 'wrong' : 'correct';
    const item = result.manual.find(entry => entry.q.number === number);
    if (!item || item.pending) return 'pending';
    return item.points === 2 ? 'correct' : 'wrong';
  }

  function analyse(results) {
    const questions = Array.from({length: 70}, (_, i) => ({
      number: i + 1, correct: 0, wrong: 0, pending: 0
    }));
    results.forEach(result => questions.forEach(q => {
      const status = outcome(result, q.number);
      if (status) q[status]++;
    }));
    const breakdown = parts.map(part => questions.slice(part.from - 1, part.to).reduce((total, q) => {
      return {...total, correct: total.correct + q.correct, wrong: total.wrong + q.wrong, pending: total.pending + q.pending};
    }, {...part, correct: 0, wrong: 0, pending: 0}));
    const ranking = questions.filter(q => q.wrong).sort((a,b) =>
      b.wrong - a.wrong || b.wrong/(b.wrong+b.correct) - a.wrong/(a.wrong+a.correct) || a.number - b.number);
    return {breakdown, ranking};
  }

  function percentage(count, total) {
    return total ? Math.round(count / total * 1000) / 10 + '%' : '—';
  }

  function table(title, rows) {
    const {node} = window.SpecialWeek;
    const wrapper = node('div', null, 'stats-table');
    const element = node('table');
    const headings = node('thead');
    const head = node('tr');
    title.forEach(label => {
      const th = node('th', label);
      th.scope = 'col';
      head.append(th);
    });
    headings.append(head);
    const body = node('tbody');
    rows.forEach(values => {
      const row = node('tr');
      values.forEach(value => row.append(node('td', value)));
      body.append(row);
    });
    element.append(headings, body);
    wrapper.append(element);
    return wrapper;
  }

  function accuracy(breakdown) {
    return table(['部分', '正确率', '正确数 / 已判题数', '待批量'], breakdown.map(stat => {
      const scored = stat.correct + stat.wrong;
      return [stat.name, percentage(stat.correct, scored), stat.correct + ' / ' + scored, stat.pending];
    }));
  }

  function ranking(rows) {
    return table(['排名', '题号', '答错人数', '错误率'], rows.map((item,i) => [
      i + 1, item.number, item.wrong, percentage(item.wrong,item.wrong+item.correct)
    ]));
  }

  window.SpecialReports = {analyse, accuracy, ranking, percentage, sectionFor};
})();
