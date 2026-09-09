import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Story, StoryBlock } from "../data/stories-content.mjs";

// Styling lives in src/styles/stories.css rather than Tailwind utilities:
// src/index.css is a frozen, pre-compiled Tailwind build and the Tailwind
// plugin isn't in vite.config.ts, so any utility class not already in that
// file silently does nothing.
const HEAD_FONT = {
  fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  fontWeight: 700,
} as const;

// Inline markdown: **bold**, *italic*, [text](url).
// Recurses through emphasis so **[text](url)** still produces a link.
// Site-relative hrefs become client-side Links; everything else opens a new tab.
function renderInline(text: string, keyBase: string) {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1]) {
      nodes.push(<strong key={key}>{renderInline(m[1], key)}</strong>);
    } else if (m[2]) {
      nodes.push(<em key={key}>{renderInline(m[2], key)}</em>);
    } else {
      const label = m[3];
      const href = m[4];
      nodes.push(
        href.startsWith("/") ? (
          <Link key={key} to={href}>{label}</Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
        )
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Block({ block, index }: { block: StoryBlock; index: number }) {
  const k = `b${index}`;

  switch (block.t) {
    case "standfirst":
      return <aside className="story-note article-note">{renderInline(block.v, k)}</aside>;

    case "h2":
      return <h2 style={HEAD_FONT}>{renderInline(block.v, k)}</h2>;

    case "p":
      return <p>{renderInline(block.v, k)}</p>;

    case "note":
      return <p className="story-aside-text">{renderInline(block.v, k)}</p>;

    case "hr":
      return <hr />;

    case "img":
      return (
        <figure>
          <ImageWithFallback src={block.src} alt={block.alt} loading="lazy" />
          {block.cap ? <figcaption>{renderInline(block.cap, k)}</figcaption> : null}
        </figure>
      );

    case "quote":
      return (
        <aside className="story-callout">
          {block.head ? <h3 style={HEAD_FONT}>{block.head}</h3> : null}
          {block.paras.map((p, i) => (
            <p key={i}>{renderInline(p, `${k}-${i}`)}</p>
          ))}
        </aside>
      );

    case "table":
      return (
        <div className="story-table-wrap">
          <table className="story-table">
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderInline(cell, `${k}-${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

export function StoryArticle({ story }: { story: Story }) {
  // The note card belongs under the title, above the hero — so it is pulled
  // out of the block flow and rendered in the header instead.
  const note = story.blocks.find((b) => b.t === "standfirst");
  const body = story.blocks.filter((b) => b.t !== "standfirst");

  const published = new Date(story.date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="story">
      <Link to="/stories" className="story-back" style={HEAD_FONT}>
        ← All Stories
      </Link>

      <p className="story-kicker" style={HEAD_FONT}>
        {story.category} · {story.readingTime} read
      </p>

      <h1 className="story-title" style={HEAD_FONT}>{story.title}</h1>

      <p className="story-dek">{story.dek}</p>

      <p className="story-byline">
        <time dateTime={story.date}>{published}</time> · Photographs by {story.photoCredit}
      </p>

      {note ? <Block block={note} index={-1} /> : null}

      <figure>
        <ImageWithFallback src={story.hero} alt={story.heroAlt} />
      </figure>

      {body.map((b, i) => (
        <Block key={i} block={b} index={i} />
      ))}
    </article>
  );
}
