import os
c = open("source/in-class/teacher.html", "r", encoding="utf-8").read()
# Find positions
vi = c.find("_renderTeachVocab(){")
ve = c.find(";return h},", vi) + 12
gi = c.find("_renderTeachGrammar(){")
ge = c.find(";return h}", gi) + 12
print(f"Vocab: {vi}-{ve} ({ve-vi} chars)")
print(f"Grammar: {gi}-{ge} ({ge-gi} chars)")
if vi > 0:
    # Save old bodies for reference
    open("source/in-class/_old_vocab.txt","w",encoding="utf-8").write(c[vi:ve])
    open("source/in-class/_old_grammar.txt","w",encoding="utf-8").write(c[gi:ge])
    print("Old method bodies saved")
