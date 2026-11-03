#!/usr/bin/env python3
"""Write source-slides.html from the carousel data the preview artifact saves.

The preview (claude.ai artifact "Oblio Community Post") stores one JSON document:
slide order, copy, image crops, and - once a blurb has been dragged - where the
headline block and the date badge sit. This turns that document into the 1080x1080
render source, so the exported PNGs match the preview exactly.

    ./build-slides.py carousel.json [source-slides.html]
"""
import html
import json
import sys

PX = 1080 / 100.0          # one percent of the square, in pixels

HEAD = """<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap">
<style>
:root{--paper:#fff;--yellow:#ffde5a;--f:Outfit,'Helvetica Neue',Arial,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1080px;overflow:hidden;background:#000}
.slide{position:relative;width:1080px;height:1080px;overflow:hidden;color:var(--paper);font-family:var(--f);display:none}
.slide.on{display:block}
.ph{position:absolute;overflow:hidden}.ph img{width:100%;height:100%;object-fit:cover;display:block}
.veil{position:absolute;left:0;right:0;bottom:0;height:430px;
  background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,.32) 45%,rgba(0,0,0,.74) 100%)}
.era{position:absolute;z-index:3;left:56px;top:52px;font-weight:800;font-size:20px;letter-spacing:.14em;
  color:var(--yellow);background:rgba(0,0,0,.55);padding:7px 13px;border-radius:5px}
.copy{position:absolute;z-index:3;left:56px;right:56px;bottom:96px;
  text-shadow:0 2px 16px rgba(0,0,0,.8),0 1px 3px rgba(0,0,0,.7)}
.h{font-weight:800;font-size:52px;line-height:1.07;letter-spacing:-.018em;text-wrap:balance}
.y{color:var(--yellow)}
.sub{font-weight:700;font-size:34px;line-height:1.2;margin-top:10px;text-wrap:balance}
.meta{position:absolute;z-index:3;left:56px;right:56px;bottom:40px;display:flex;justify-content:space-between;
  font-size:20px;color:#ffffffd9;text-shadow:0 1px 6px rgba(0,0,0,.85)}
</style></head><body>
"""

# Same rule the preview uses: while the copy sits where it was laid out the wash
# is left alone; once it has been moved the wash follows it and flips up top.
TAIL = """<script>
function fitVeil(slide){
  var copy = slide.querySelector('.copy'), veil = slide.querySelector('.veil');
  var br = copy.getBoundingClientRect();
  var t = br.top / 1080 * 100, b = br.bottom / 1080 * 100, F = 10, top, height, bg;
  if (b >= 70){
    /* never lighter than the standard wash, only taller when the copy runs long */
    top = Math.max(0, Math.min(60.19, t - F)); height = 100 - top;
    bg = 'linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,.32) 45%,rgba(0,0,0,.74) 100%)';
  } else if (t <= 30){
    top = 0; height = Math.min(100, b + F);
    bg = 'linear-gradient(to bottom,rgba(0,0,0,.74) 0%,rgba(0,0,0,.42) 55%,rgba(0,0,0,0) 100%)';
  } else {
    top = Math.max(0, t - F); height = Math.min(100, b + F) - top;
    bg = 'linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,.62) 26%,rgba(0,0,0,.62) 74%,rgba(0,0,0,0) 100%)';
  }
  veil.style.top = top.toFixed(2) + '%';
  veil.style.height = height.toFixed(2) + '%';
  veil.style.bottom = 'auto';
  veil.style.background = bg;
}
var n = new URLSearchParams(location.search).get("s") || "1";
var slide = document.querySelector('.slide[data-n="' + n + '"]');
slide.classList.add('on');
document.fonts.ready.then(function(){ fitVeil(slide); });
</script></body></html>
"""


def esc(text):
    return html.escape(text or "", quote=False)


def px(pct):
    return "%.1fpx" % (pct * PX)


def slide_html(i, s):
    moved = s.get("copyAt")
    out = ['<section class="slide" data-n="%d"%s>' % (i, ' data-moved="1"' if moved else "")]
    f = s["frames"][0]
    out.append('<div class="ph" style="left:0;top:0;width:1080px;height:1080px">'
               '<img src="img/%s" style="object-position:%s"></div>' % (f["src"], f["pos"]))
    out.append('<div class="veil"></div>')

    if s.get("era") is not None:
        at = s.get("eraAt")
        style = (' style="left:%s;top:%s;right:auto;bottom:auto"' % (px(at["x"]), px(at["y"]))) if at else ""
        out.append('<span class="era"%s>%s</span>' % (style, esc(s["era"])))

    style = ""
    if moved:
        style = ' style="left:%s;top:%s;width:%s;right:auto;bottom:auto"' % (
            px(moved["x"]), px(moved["y"]), px(moved["w"]))
    parts = ""
    if s.get("h"):
        parts += '<p class="h">%s</p>' % esc(s["h"])
    if s.get("sub"):
        parts += '<p class="sub y">%s</p>' % esc(s["sub"])
    out.append('<div class="copy"%s>%s</div>' % (style, parts))

    if s.get("meta"):
        out.append('<div class="meta"><span>%s</span><span style="font-weight:700;color:#fff">%s</span></div>'
                   % (esc(s["meta"]["left"]), esc(s["meta"]["right"])))
    out.append("</section>")
    return "\n".join(out)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "carousel.json"
    dst = sys.argv[2] if len(sys.argv) > 2 else "source-slides.html"
    data = json.load(open(src))
    body = "\n\n".join(slide_html(i, s) for i, s in enumerate(data["slides"], 1))
    open(dst, "w").write(HEAD + "\n" + body + "\n\n" + TAIL)
    print("%s: %d slides" % (dst, len(data["slides"])))


if __name__ == "__main__":
    main()
