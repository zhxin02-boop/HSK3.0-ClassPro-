
import pathlib
p = pathlib.Path('D:/F盘/大连东软信息学院/教学/25-26-2/AI/新HSK教程/index.html')
c = p.read_text('utf-8')

# 1. Fix finish function
old_finish = chr(102)+chr(117)+chr(110)+chr(99)+chr(116)+chr(105)+chr(111)+chr(110)+chr(32)+chr(102)+chr(105)+chr(110)+chr(105)+chr(115)+chr(104)+chr(40)+chr(41)+chr(32)+chr(123)+chr(32)+chr(105)+chr(102)+chr(32)+chr(40)+chr(33)+chr(113)+chr(117)+chr(105)+chr(122)+chr(68)+chr(111)+chr(110)+chr(101)+chr(46)+chr(118)+chr(97)+chr(108)+chr(117)+chr(101)+chr(32)+chr(38)+chr(38)+chr(32)+chr(113)+chr(97)+chr(46)+chr(118)+chr(97)+chr(108)+chr(117)+chr(101)+chr(32)+chr(61)+chr(61)+chr(61)+chr(32)+chr(45)+chr(49)+chr(41)+chr(32)+chr(114)+chr(101)+chr(116)+chr(117)+chr(114)+chr(110)+chr(59)+chr(32)+chr(125)
c = c.replace(old_finish, 'function finish() { if (!quizDone.value && qa.value === -1) return; s.value = 7; }')

# 2. Add Done to pages
sq = chr(39)
dq = chr(34)
c = c.replace(
    '{id:' + dq + 'Quiz' + dq + ',label:' + dq + 'Quiz' + dq + '}]',
    '{id:' + dq + 'Quiz' + dq + ',label:' + dq + 'Quiz' + dq + '},{id:' + dq + 'Done' + dq + ',label:' + dq + 'Done' + dq + '}]'
)

# 3. Add results page
results = (
    '<!-- Results s=7 -->' + chr(10)
    + '      <div v-if=' + dq + 's===7' + dq + ' class=' + dq + 'res' + dq + '>' + chr(10)
    + '        <div class=' + dq + 'bi' + dq + '>' + chr(0x1f389) + '</div>' + chr(10)
    + '        <h2>Well done' + dq + dq + '!' + chr(10)
    + '        <p>{{D.lessonTitle}} Pre-class complete!</p>' + chr(10)
    + '        <div class=' + dq + 'scor' + dq + '>{{score}}/{{qz.length}}</div>' + chr(10)
    + '        <div class=' + dq + 'gx' + dq + ' v-for=' + dq + '(g,i) in D.grammarPoints' + dq + ' :key=' + dq + 'i' + dq + '>' + chr(10)
    + '          <span class=' + dq + 'la' + dq + '>{{i+1}}</span>{{g}}' + chr(10)
    + '        </div>' + chr(10)
    + '        <button class=' + dq + 'btn' + dq + ' @click=' + dq + 'view=' + sq + 'w' + sq + dq + '>' + chr(0x21a9) + ' Restart / ' + chr(0x91cd) + chr(0x65b0) + chr(0x5f00) + chr(0x59cb) + '</button>' + chr(10)
    + '      </div>'
)

c = c.replace(
    chr(10) + '    </div>' + chr(10) + chr(10) + '    <div class=' + dq + 'nv' + dq + '>',
    chr(10) + '    </div>' + chr(10) + chr(10) + '      ' + results + chr(10) + '    </div>' + chr(10) + chr(10) + '    <div class=' + dq + 'nv' + dq + '>'
)

p.write_text(c, 'utf-8')
print('Done')
print('finish fix:', 's.value = 7; }' in c)
print('pages Done:', 'Done' in c)
print('results page:', 's===7' in c)
