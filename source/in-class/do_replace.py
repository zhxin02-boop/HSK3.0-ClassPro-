import os
c = open("source/in-class/teacher.html", "r", encoding="utf-8").read()
new_vocab = open("source/in-class/_new_vocab.txt", "r", encoding="utf-8").read()
idx = c.find("_renderTeachVocab(){")
end = c.find(";return h},", idx)
if idx>0 and end>0:
    c = c[:idx] + new_vocab + c[end+12:]
    print("Vocab replaced by position")
with open("source/in-class/teacher.html", "w", encoding="utf-8") as f:
    f.write(c)
v = open("source/in-class/teacher.html","r",encoding="utf-8").read()
print("Has w.phrases:", "w.phrases" in v)
print("Has 例句 Sentences:", "例句 Sentences" in v)
