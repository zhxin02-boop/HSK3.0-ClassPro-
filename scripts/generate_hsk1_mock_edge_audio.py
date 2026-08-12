import argparse
import asyncio
import json
import math
import os
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
PYTHON = Path(os.environ.get("PYTHON", "python"))


def all_items(test):
    return [item for section in test["sections"] for item in section["items"]]


def silence_wav(path, seconds, rate=24000):
    frames = int(rate * seconds)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(b"\x00\x00" * frames)


async def speak(text, out_path, voice, rate):
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate)
    await communicate.save(str(out_path))


def concat_mp3(parts, out_path):
    if shutil.which("ffmpeg"):
        list_file = out_path.with_suffix(".concat.txt")
        list_file.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(out_path)], check=True)
        list_file.unlink(missing_ok=True)
        return
    data = b"".join(p.read_bytes() for p in parts)
    out_path.write_bytes(data)


async def build_part(test, part, items, out_path):
    policy = test.get("audioPolicy", {})
    voice_a = policy.get("ttsVoiceA", "zh-CN-YunyangNeural")
    voice_b = policy.get("ttsVoiceB", "zh-CN-XiaoyiNeural")
    rate = policy.get("ttsRate", "-35%")
    repeat = int(policy.get("repeat", 2))
    repeat_gap = float(policy.get("repeatGapSeconds", 1.5))
    item_pause = float(policy.get("itemPauseSeconds", 4.5))
    turn_gap = float(policy.get("turnGapSeconds", 0.8))

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        chunks = []
        idx = 0
        for item in items:
            idx += 1
            q = td / f"{idx:03d}_number.mp3"
            await speak(f"第{item['number']}题。", q, voice_a, rate)
            chunks.append(q)
            for rep in range(repeat):
                if rep:
                    gap = td / f"{idx:03d}_repeat_gap.wav"
                    silence_wav(gap, repeat_gap)
                    chunks.append(gap)
                turns = item.get("audioTurns") or [{"text": item.get("audioText", "")}]
                for turn_idx, turn in enumerate(turns):
                    voice = voice_b if turn.get("voice") == "B" else voice_a
                    t = td / f"{idx:03d}_{rep}_{turn_idx}.mp3"
                    await speak(turn.get("text", ""), t, voice, rate)
                    chunks.append(t)
                    if turn_idx < len(turns) - 1:
                        gap = td / f"{idx:03d}_{rep}_{turn_idx}_turn_gap.wav"
                        silence_wav(gap, turn_gap)
                        chunks.append(gap)
            pause = td / f"{idx:03d}_item_pause.wav"
            silence_wav(pause, item_pause)
            chunks.append(pause)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        concat_mp3(chunks, out_path)
    print(out_path)


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test-id", default="HSK1-mock-03")
    args = parser.parse_args()

    data_path = ROOT / "source" / "data-model" / "mock-tests" / f"{args.test_id}.json"
    test = json.loads(data_path.read_text(encoding="utf-8"))
    items = all_items(test)
    for audio_part in test.get("audioParts", []):
        part_items = sorted([item for item in items if item["part"] == audio_part["part"]], key=lambda x: x["number"])
        rel = audio_part["file"].replace("../", "source/")
        out_path = (ROOT / rel).with_suffix(".mp3")
        await build_part(test, audio_part["part"], part_items, out_path)


if __name__ == "__main__":
    asyncio.run(main())
