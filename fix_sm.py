import pathlib, re

p = pathlib.Path('D:/F盘/大连东软信息学院/教学/25-26-2/AI/新HSK教程/gen_html.py')
txt = p.read_text('utf-8')

# Replace the broken stroke map (with unicode-escaped quotes)
old = "{\\u0022不\\u0022:4,\\u0022是\\u0022:9,\\u0022对\\u0022:5,\\u0022起\\u0022:10,\\u0022没\\u0022:7,\\u0022关\\u0022:6,\\u0022系\\u0022:7,\\u0022事\\u0022:8,\\u0022很\\u0022:9,\\u0022高\\u0022:10,\\u0022兴\\u0022:6,\\u0022认\\u0022:4,\\u0022识\\u0022:7,\\u0022也\\u0022:3}"
new = "{'不':4,'是':9,'对':5,'起':10,'没':7,'关':6,'系':7,'事':8,'很':9,'高':10,'兴':6,'认':4,'识':7,'也':3}"
txt = txt.replace(old, new)
p.write_text(txt, 'utf-8')
print('Fixed gen_html.py')

# Now run it
exec(compile(p.read_text('utf-8'), 'gen_html.py', 'exec'))

# Verify index.html
idx = pathlib.Path('D:/F盘/大连东软信息学院/教学/25-26-2/AI/新HSK教程/index.html')
content = idx.read_text('utf-8')
print('index.html size:', len(content))
print('Has playAll:', 'playAll' in content)
print('Has correct stroke map:', "{'不':4,'是':9,'对':5}" in content or '{不:4,是:9,对:5}' in content)
print('Has DOCTYPE:', content.startswith('<!DOCTYPE'))
print('Has /html:', content.rstrip().endswith('</html>'))
