import json, pathlib

p = pathlib.Path('D:\\F盘\\大连东软信息学院\\教学\\25-26-2\\AI\\新HSK教程\\source\\pre-class\\index.html')
html = p.read_text('utf-8')

data = {
    "lesson": "Lesson 2",
    "lessonTitle": "第2课：我叫李文",
    "lessonEnglishTitle": "My name is Li Wen",
    "grammarPoints": [
        "基本语序：主语 + 谓语 + 宾语",
        "对不起和没关系"
    ],
    "vocabData": [
        {"word": "不", "pinyin": "b\u00f9", "english": "not; no"},
        {"word": "是", "pinyin": "sh\u00ec", "english": "be"},
        {"word": "对不起", "pinyin": "du\u00ecbuq\u01d0", "english": "sorry"},
        {"word": "没关系", "pinyin": "m\u00e9i gu\u0101nxi", "english": "that's all right"},
        {"word": "没事", "pinyin": "m\u00e9ish\u00ec", "english": "it doesn't matter"},
        {"word": "很", "pinyin": "h\u011bn", "english": "very"},
        {"word": "高兴", "pinyin": "g\u0101ox\u00ecng", "english": "glad; happy"},
        {"word": "认识", "pinyin": "r\u00e8nshi", "english": "know"},
        {"word": "也", "pinyin": "y\u011b", "english": "also; too"}
    ],
    "readingData": [
        {"textId": 1, "context": "介绍", "dialogue": [
            {"speaker": "陈天中", "chinese": "你好，安妮！", "pinyin": "N\u01d0 h\u01ceo, \u0100nn\u012b!", "english": "Hello, Annie!"}
        ]}
    ]
}

insert_after = '<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>'
pos = html.find(insert_after) + len(insert_after)
data_script = '\n<script>window.LESSON_DATA = ' + json.dumps(data, ensure_ascii=False) + ';</script>'
html = html[:pos] + data_script + html[pos:]

p.write_text(html, 'utf-8')
print('Done. Size:', len(html))