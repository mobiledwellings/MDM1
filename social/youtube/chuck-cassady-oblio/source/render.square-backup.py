#!/usr/bin/env python3
"""Render the YouTube slides from a plain text file.

The text file is the source of truth. Edit it in any editor, save it, and run
this; nothing lives in a browser, so nothing can be reloaded out from under you.

    ./render.py                      # read the file on the Desktop, render, copy back
    ./render.py path/to/slides.txt

Block order in the file is slide order. Move a block, the running order moves.
"""
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DESK = os.path.expanduser("~/Desktop/Oblio YouTube Post")
TEXT = os.path.join(DESK, "EDIT ME - slides.txt")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
KEYS = ("label", "photo", "badge", "head", "sub", "footer")
SCALE = 2          # the slide is laid out at 1080; render it at 1080 * SCALE


def slug(text, n):
    s = re.sub(r"[^a-z0-9]+", "-", (text or "slide").lower()).strip("-")
    return "%02d-%s" % (n, s[:28] or "slide")


def parse(path):
    raw = open(path).read()
    body, _, caption = raw.partition("=== POST TEXT ===")
    blocks, cur = [], None
    for line in body.splitlines():
        if line.startswith("#"):
            continue
        if line.startswith("---"):
            cur = {}
            blocks.append(cur)
            continue
        if cur is None:
            continue
        m = re.match(r"\s*(%s)\s*:\s?(.*)$" % "|".join(KEYS), line, re.I)
        if m:
            cur[m.group(1).lower()] = m.group(2).rstrip()
            cur["_last"] = m.group(1).lower()
        elif line.strip() and cur.get("_last"):          # a wrapped continuation line
            cur[cur["_last"]] = (cur[cur["_last"]] + " " + line.strip()).strip()

    slides = []
    for b in blocks:
        if not b.get("head") and not b.get("sub"):
            continue
        photo = (b.get("photo") or "").split()
        src = photo[0] if photo else "arc3.jpg"
        pos = " ".join(photo[1:]) or "50% 50%"
        s = {"name": b.get("label") or b.get("head", "")[:26],
             "frames": [{"src": src, "pos": pos}],
             "h": b.get("head", ""), "sub": b.get("sub", "")}
        if b.get("badge"):
            s["era"] = b["badge"]
        if b.get("footer"):
            left, _, right = b["footer"].partition("|")
            s["meta"] = {"left": left.strip(), "right": right.strip() or "Swipe →"}
        slides.append(s)
    return {"slides": slides, "caption": caption.strip() or ""}


def write_text(doc, path):
    photos = sorted(os.listdir(os.path.join(HERE, "img")))
    out = ["# OBLIO - YOUTUBE COMMUNITY POST",
           "#",
           "# Edit the lines below, save the file, and tell Claude to render.",
           "# Block order is slide order: move a whole block to reorder the post.",
           "# Lines starting with # are ignored. An empty value drops that line from the slide.",
           "#",
           "# photo: <filename> <across%> <down%>   - the percentages choose which part of",
           "#   the picture the square keeps. 50%% 50%% is centred.",
           "# Pictures you can use:"]
    for i in range(0, len(photos), 3):
        out.append("#   " + "  ".join(photos[i:i + 3]))
    out.append("")
    for i, s in enumerate(doc["slides"], 1):
        out.append("--- slide %d ---" % i)
        out.append("label: %s" % s.get("name", ""))
        out.append("photo: %s %s" % (s["frames"][0]["src"], s["frames"][0]["pos"]))
        if s.get("era") is not None:
            out.append("badge: %s" % s["era"])
        out.append("head: %s" % s["h"])
        out.append("sub: %s" % s["sub"])
        if s.get("meta"):
            out.append("footer: %s | %s" % (s["meta"]["left"], s["meta"]["right"]))
        out.append("")
    out += ["=== POST TEXT ===", "", doc["caption"], ""]
    open(path, "w").write("\n".join(out))


def render(doc):
    json.dump(doc, open(os.path.join(HERE, "carousel.json"), "w"), ensure_ascii=False, indent=1)
    subprocess.run([sys.executable, os.path.join(HERE, "build-slides.py"),
                    os.path.join(HERE, "carousel.json"),
                    os.path.join(HERE, "source-slides.html")], check=True)
    for f in os.listdir(DESK):
        if re.match(r"^\d\d-.*\.png$", f):
            os.remove(os.path.join(DESK, f))
    names = []
    for i, s in enumerate(doc["slides"], 1):
        name = slug(s.get("name"), i) + ".png"
        dst = os.path.join(HERE, name)
        subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-sandbox",
                        "--window-size=1080,1080", "--hide-scrollbars",
                        "--force-device-scale-factor=%d" % SCALE,
                        "--virtual-time-budget=6000", "--screenshot=" + dst,
                        "file://%s/source-slides.html?s=%d" % (HERE, i)],
                       check=True, capture_output=True)
        shutil.copy(dst, os.path.join(DESK, name))
        names.append(name)
        print("  %s  %s" % (name, s["h"][:54]))
    sheet(names)
    return names


def sheet(names):
    """One jpg of the whole set, to check the post at a glance."""
    import sys as _s
    _s.path.insert(0, "/private/tmp/claude-501/-Users-homefolder-Desktop-MD72-MDM1/"
                      "17203f66-fa31-47b8-be6a-ce331d7672a3/scratchpad/venv/lib/python3.9/site-packages")
    try:
        from PIL import Image
    except ImportError:
        return
    w, rows = 360, (len(names) + 4) // 5
    out = Image.new("RGB", (w * 5, w * rows), "#111")
    for i, n in enumerate(names):
        out.paste(Image.open(os.path.join(DESK, n)).convert("RGB").resize((w, w)),
                  ((i % 5) * w, (i // 5) * w))
    out.save(os.path.join(DESK, "all ten slides.jpg"), quality=88)


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else TEXT
    doc = parse(path)
    print("%d slides from %s" % (len(doc["slides"]), os.path.basename(path)))
    render(doc)
    print("copied to %s" % DESK)
