/**
 * Edit a story as plain text.
 *
 *   node scripts/story-text.mjs export <slug>   # story -> content/blog/EDIT ME - <slug>.md
 *   node scripts/story-text.mjs apply  <slug>   # that file -> src/data/stories-content.mjs
 *   node scripts/story-text.mjs apply  <slug> --dry   # check it, write nothing
 *
 * The site renders from src/data/stories-content.mjs. This script only ever
 * writes there on `apply`, and only ever writes the text file on `export`, so
 * an open editor is never written to underneath you.
 *
 * Text format, one block per blank-line-separated chunk:
 *
 *   TOP NOTE: ...            the grey note card under the title
 *   ## Heading
 *   A paragraph.
 *   ---                      a divider
 *   ![alt text](/blog/...)   an image; an optional next line "caption: ..."
 *   | **Label** | value |    table rows, consecutive lines
 *   [[VIDEO 1]]              the video embeds and the affiliate note, kept as
 *   [[AFFILIATE NOTE]]       they are; move the line to move the block
 *   END NOTE: ...            the closing note
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/stories-content.mjs");
const META = ["title", "dek", "hero", "heroAlt", "category", "date", "readingTime", "photoCredit", "keywords"];

const textFile = (slug) => path.join(ROOT, "content/blog", `EDIT ME - ${slug}.md`);

async function loadStory(slug) {
  const mod = await import(pathToFileURL(DATA).href + "?t=" + Date.now());
  const story = mod.STORIES.find((s) => s.slug === slug);
  if (!story) {
    throw new Error(`No story "${slug}". Have: ${mod.STORIES.map((s) => s.slug).join(", ")}`);
  }
  return story;
}

// ---------------------------------------------------------------- export

function toText(story) {
  const out = ["---", `slug: ${story.slug}`];
  for (const k of META) out.push(`${k}: ${story[k]}`);
  out.push("---", "");
  out.push(
    "<!--",
    `Edit this file, save, then run:   node scripts/story-text.mjs apply ${story.slug}`,
    "",
    "A blank line separates blocks. ## is a heading, --- is a divider.",
    "An image is ![description for screen readers](path), with an optional",
    '"caption: ..." on the line directly under it. Delete a block to cut it,',
    "move it to reorder. Leave the [[...]] lines as they are (move them freely).",
    "Links are [text](/page), bold is **bold**. No em dashes: the site has none.",
    "-->",
    ""
  );
  let video = 0;
  for (const b of story.blocks) {
    if (b.t === "standfirst") out.push(`TOP NOTE: ${b.v}`);
    else if (b.t === "note") out.push(`END NOTE: ${b.v}`);
    else if (b.t === "p") out.push(b.v);
    else if (b.t === "h2") out.push(`## ${b.v}`);
    else if (b.t === "hr") out.push("---");
    else if (b.t === "img") out.push(`![${b.alt}](${b.src})` + (b.cap ? `\ncaption: ${b.cap}` : ""));
    else if (b.t === "table") out.push(b.rows.map((r) => `| ${r.join(" | ")} |`).join("\n"));
    else if (b.t === "video") out.push(`[[VIDEO ${++video}]]`);
    else if (b.t === "quote") out.push("[[AFFILIATE NOTE]]");
    else throw new Error(`Unknown block type "${b.t}"`);
    out.push("");
  }
  return out.join("\n");
}

// ----------------------------------------------------------------- apply

/**
 * Curly double quotes for speech, leaving link targets alone. Apostrophes stay
 * straight: that is how every story on the site already has them.
 */
function smarten(text) {
  let open = true;
  return text
    .split(/(\]\([^)]*\))/)
    .map((part, i) => {
      if (i % 2) return part; // a ](url) segment
      return part.replace(/"/g, () => ((open = !open), open ? "”" : "“"));
    })
    .join("");
}

function fromText(raw, current) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error("The file must start with the --- settings block.");
  const meta = {};
  for (const line of fm[1].split("\n")) {
    const m = line.match(/^(\w+):\s?(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  const body = raw.slice(fm[0].length).replace(/<!--[\s\S]*?-->/g, "");

  const videos = current.blocks.filter((b) => b.t === "video");
  const quote = current.blocks.find((b) => b.t === "quote");
  const blocks = [];
  for (const chunk of body.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean)) {
    const lines = chunk.split("\n").map((l) => l.trim());
    let m;
    if (chunk === "---") blocks.push({ t: "hr" });
    else if ((m = chunk.match(/^\[\[VIDEO (\d+)\]\]$/))) {
      const v = videos[Number(m[1]) - 1];
      if (!v) throw new Error(`${chunk}: this story only has ${videos.length} video block(s).`);
      blocks.push(v);
    } else if (chunk === "[[AFFILIATE NOTE]]") {
      if (!quote) throw new Error("[[AFFILIATE NOTE]]: this story has no affiliate note to keep.");
      blocks.push("__QUOTE__");
    } else if ((m = chunk.match(/^## (.+)$/))) blocks.push({ t: "h2", v: smarten(m[1]) });
    else if ((m = lines[0].match(/^!\[(.*)\]\((\S+)\)$/))) {
      const cap = lines[1] && lines[1].match(/^caption:\s?(.*)$/i);
      if (lines.length > (cap ? 2 : 1)) {
        throw new Error(`Put a blank line after the image block:\n  ${lines.join("\n  ")}`);
      }
      blocks.push({ t: "img", src: m[2], alt: smarten(m[1]), cap: cap ? smarten(cap[1]) : "" });
    } else if (lines.every((l) => l.startsWith("|"))) {
      blocks.push({
        t: "table",
        rows: lines.map((l) => l.replace(/^\|\s*|\s*\|$/g, "").split(/\s*\|\s*/).map(smarten)),
      });
    } else if ((m = chunk.match(/^TOP NOTE:\s?([\s\S]+)$/))) blocks.push({ t: "standfirst", v: smarten(m[1].replace(/\n/g, " ")) });
    else if ((m = chunk.match(/^END NOTE:\s?([\s\S]+)$/))) blocks.push({ t: "note", v: smarten(m[1].replace(/\n/g, " ")) });
    else blocks.push({ t: "p", v: smarten(lines.join(" ")) });
  }

  const story = { slug: current.slug };
  for (const k of META) story[k] = k in meta ? (k === "title" || k === "dek" ? smarten(meta[k]) : meta[k]) : current[k];
  story.blocks = blocks;
  return story;
}

function check(story) {
  const problems = [];
  const flat = JSON.stringify(story);
  if (flat.includes("—")) {
    for (const b of story.blocks) {
      const s = JSON.stringify(b);
      if (s.includes("—")) problems.push("Em dash (the site has none): " + s.slice(0, 110));
    }
    for (const k of ["title", "dek"]) if (story[k].includes("—")) problems.push(`Em dash in ${k}`);
  }
  const imgs = [story.hero, ...story.blocks.filter((b) => b.t === "img").map((b) => b.src)];
  for (const src of imgs) {
    if (!fs.existsSync(path.join(ROOT, "public", src))) problems.push("Image not found in public/: " + src);
  }
  if (!story.blocks.some((b) => b.t === "p")) problems.push("No paragraphs found.");
  return problems;
}

/** Replace one story object in the data file, keeping the affiliate note's source as written. */
function splice(source, story) {
  const head = `  {\n    "slug": "${story.slug}"`;
  const a = source.indexOf(head);
  if (a < 0) throw new Error("Could not find the story in " + DATA);
  const next = source.indexOf('\n  {\n    "slug": "', a + head.length);
  const last = next < 0;
  const b = last ? source.indexOf("\n];", a) : next + 1;
  const old = source.slice(a, b);

  let js = JSON.stringify(story, null, 2).split("\n").map((l) => "  " + l).join("\n");
  if (js.includes('"__QUOTE__"')) {
    // The note carries a template literal for the live coupon code, which JSON cannot express.
    const qa = old.indexOf('      {\n        "t": "quote"');
    const qb = old.indexOf("\n      }", qa) + "\n      }".length;
    js = js.replace('      "__QUOTE__"', old.slice(qa, qb));
  }
  return source.slice(0, a) + js + (last ? "" : ",\n") + source.slice(b);
}

// ------------------------------------------------------------------ main

const [cmd, slug, flag] = process.argv.slice(2);
if (!["export", "apply"].includes(cmd) || !slug) {
  console.error("Usage: node scripts/story-text.mjs <export|apply> <slug> [--dry]");
  process.exit(1);
}

const current = await loadStory(slug);
const file = textFile(slug);

if (cmd === "export") {
  if (fs.existsSync(file) && flag !== "--force") {
    console.error(`${path.relative(ROOT, file)} already exists.\nAdd --force to overwrite it with the story as the site has it.`);
    process.exit(1);
  }
  fs.writeFileSync(file, toText(current));
  console.log("Wrote " + path.relative(ROOT, file));
} else {
  const story = fromText(fs.readFileSync(file, "utf-8"), current);
  const problems = check(story);
  if (problems.length) {
    console.error("Not applied. Fix these in the text file first:\n  - " + problems.join("\n  - "));
    process.exit(1);
  }
  const words = story.blocks.filter((b) => b.t === "p").reduce((n, b) => n + b.v.split(/\s+/).length, 0);
  const count = (t) => story.blocks.filter((b) => b.t === t).length;
  const summary = `${count("h2")} headings, ${count("p")} paragraphs (${words} words), ${count("img")} images`;
  if (flag === "--dry") {
    console.log("Looks good, nothing written: " + summary);
    process.exit(0);
  }
  const before = fs.readFileSync(DATA, "utf-8");
  fs.writeFileSync(DATA, splice(before, story));
  try {
    // Prove the data file still loads before calling it done.
    execFileSync(process.execPath, ["-e", `import(${JSON.stringify(pathToFileURL(DATA).href)}).then(m=>{if(!m.getStory(${JSON.stringify(slug)}))process.exit(2)})`]);
  } catch (e) {
    fs.writeFileSync(DATA, before);
    console.error("The result did not load, so nothing was changed.");
    process.exit(1);
  }
  console.log(`Applied to the site: ${summary}`);
}
