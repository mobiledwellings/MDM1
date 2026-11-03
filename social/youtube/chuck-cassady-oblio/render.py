#!/usr/bin/env python3
"""Render the slides from a plain text file.

The text file is the source of truth. Edit it in any editor, save it, and run
this; nothing lives in a browser, so nothing can be reloaded out from under you.

    ./render.py                      # the square set, 1080x1080, for YouTube
    ./render.py --ig                 # the same post at 1080x1350, for Instagram
    ./render.py path/to/slides.txt   # either shape, from another file

Both shapes read the same file, so the copy only ever gets edited in one place.
Block order in the file is slide order. Move a block, the running order moves.
"""
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLIENT = "~/Desktop/Chuck Cassady"      # both post folders live in the client folder
TEXT = os.path.expanduser(CLIENT + "/Oblio YouTube Post/EDIT ME - slides.txt")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
KEYS = ("label", "photo", "badge", "head", "sub", "footer")
PIL_PATH = ("/private/tmp/claude-501/-Users-homefolder-Desktop-MD72-MDM1/"
            "17203f66-fa31-47b8-be6a-ce331d7672a3/scratchpad/venv/lib/python3.9/site-packages")

# Chrome lays the slide out at `css` and shoots it at `css * scale`. Instagram
# serves a feed image at up to 1440 wide and resamples anything bigger, so the
# portrait set is rendered big and then handed over already at 1440: a 1440 from
# a 2160 render holds its type far better than a native 1080 blown up.
SHAPES = {
    "square": dict(css=(1080, 1080), scale=2, out=HERE,
                   desk=CLIENT + "/Oblio YouTube Post", post=None,
                   sheet_cols=5),
    "ig": dict(css=(1080, 1350), scale=2, out=os.path.join(HERE, "ig"),
               desk=CLIENT + "/Oblio Instagram Post", post=(1440, 1800),
               sheet_cols=5),
}


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


def render(doc, shape):
    cfg = SHAPES[shape]
    css_w, css_h = cfg["css"]
    desk = os.path.expanduser(cfg["desk"])
    os.makedirs(cfg["out"], exist_ok=True)
    os.makedirs(desk, exist_ok=True)

    page = os.path.join(cfg["out"], "source-slides.html")
    json.dump(doc, open(os.path.join(HERE, "carousel.json"), "w"), ensure_ascii=False, indent=1)
    subprocess.run([sys.executable, os.path.join(HERE, "build-slides.py"),
                    os.path.join(HERE, "carousel.json"), page, shape], check=True)
    if cfg["out"] != HERE:                  # the page looks for img/ beside itself
        link = os.path.join(cfg["out"], "img")
        if not os.path.exists(link):
            os.symlink(os.path.join(HERE, "img"), link)

    for d in (cfg["out"], desk):
        for f in os.listdir(d):
            if re.match(r"^\d\d-.*\.png$", f):
                os.remove(os.path.join(d, f))

    names = []
    for i, s in enumerate(doc["slides"], 1):
        name = slug(s.get("name"), i) + ".png"
        dst = os.path.join(cfg["out"], name)
        subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-sandbox",
                        "--window-size=%d,%d" % (css_w, css_h), "--hide-scrollbars",
                        "--force-device-scale-factor=%d" % cfg["scale"],
                        "--virtual-time-budget=6000", "--screenshot=" + dst,
                        "file://%s?s=%d" % (page, i)],
                       check=True, capture_output=True)
        deliver(dst, os.path.join(desk, name), cfg["post"])
        names.append(name)
        print("  %s  %s" % (name, s["h"][:54]))
    sheet(names, desk, css_w / float(css_h), cfg["sheet_cols"])
    return names, desk


def deliver(src, dst, post):
    """Copy the master to the Desktop, resampled to the upload size if there is one."""
    if not post:
        shutil.copy(src, dst)
        return
    sys.path.insert(0, PIL_PATH)
    from PIL import Image
    Image.open(src).convert("RGB").resize(post, Image.LANCZOS).save(dst)


def sheet(names, desk, aspect, cols):
    """One jpg of the whole set, to check the post at a glance."""
    sys.path.insert(0, PIL_PATH)
    try:
        from PIL import Image
    except ImportError:
        return
    w = 360
    h = int(round(w / aspect))
    rows = (len(names) + cols - 1) // cols
    out = Image.new("RGB", (w * cols, h * rows), "#111")
    for i, n in enumerate(names):
        out.paste(Image.open(os.path.join(desk, n)).convert("RGB").resize((w, h)),
                  ((i % cols) * w, (i // cols) * h))
    out.save(os.path.join(desk, "all ten slides.jpg"), quality=88)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    shape = "ig" if "--ig" in sys.argv else "square"
    path = args[0] if args else TEXT
    doc = parse(path)
    print("%d slides from %s, %s at %dx%d" % (
        len(doc["slides"]), os.path.basename(path), shape,
        SHAPES[shape]["css"][0] * SHAPES[shape]["scale"],
        SHAPES[shape]["css"][1] * SHAPES[shape]["scale"]))
    names, desk = render(doc, shape)
    print("copied to %s" % desk)
