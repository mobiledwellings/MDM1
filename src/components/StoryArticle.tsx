import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Story, StoryBlock } from "../data/stories-content.mjs";

const HEAD_FONT = {
  fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  fontWeight: 700,
} as const;

// Inline markdown: **bold**, *italic*, [text](url).
// Site-relative hrefs become client-side Links so navigation stays instant;
// everything else opens in a new tab.
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
      nodes.push(<strong key={key} className="font-semibold">{renderInline(m[1], key)}</strong>);
    } else if (m[2]) {
      nodes.push(<em key={key}>{renderInline(m[2], key)}</em>);
    } else {
      const label = m[3];
      const href = m[4];
      nodes.push(
        href.startsWith("/") ? (
          <Link
            key={key}
            to={href}
            className="text-neutral-900 dark:text-white underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-900 dark:decoration-neutral-500 dark:hover:decoration-white transition-colors"
          >
            {label}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 dark:text-white underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-900 dark:decoration-neutral-500 dark:hover:decoration-white transition-colors"
          >
            {label}
          </a>
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
      return (
        <aside className="article-note my-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-5 py-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {renderInline(block.v, k)}
        </aside>
      );

    case "h2":
      return (
        <h2
          className="mt-14 mb-4 text-2xl md:text-3xl text-neutral-900 dark:text-white"
          style={HEAD_FONT}
        >
          {renderInline(block.v, k)}
        </h2>
      );

    case "p":
      return (
        <p className="mb-6 text-lg leading-[1.75] text-neutral-800 dark:text-neutral-200">
          {renderInline(block.v, k)}
        </p>
      );

    case "note":
      return (
        <p className="mb-6 text-base italic leading-relaxed text-neutral-500 dark:text-neutral-400">
          {renderInline(block.v, k)}
        </p>
      );

    case "hr":
      return <hr className="my-12 border-neutral-200 dark:border-neutral-800" />;

    case "img":
      return (
        <figure className="my-10 -mx-6 md:mx-0">
          <ImageWithFallback
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="w-full h-auto md:rounded-lg bg-neutral-100 dark:bg-neutral-900"
          />
          {block.cap ? (
            <figcaption className="mt-3 px-6 md:px-0 text-sm text-neutral-500 dark:text-neutral-400">
              {renderInline(block.cap, k)}
            </figcaption>
          ) : null}
        </figure>
      );

    case "quote":
      return (
        <aside className="my-10 rounded-r-lg border-l-2 border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900 px-6 py-5">
          {block.head ? (
            <h3
              className="mb-3 text-sm uppercase tracking-wide text-neutral-900 dark:text-white"
              style={HEAD_FONT}
            >
              {block.head}
            </h3>
          ) : null}
          {block.paras.map((p, i) => (
            <p
              key={i}
              className="mb-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300 last:mb-0"
            >
              {renderInline(p, `${k}-${i}`)}
            </p>
          ))}
        </aside>
      );

    case "table":
      return (
        <div className="my-10 overflow-x-auto">
          <table className="w-full border-collapse text-base">
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={
                        "border-b border-neutral-200 dark:border-neutral-800 py-3 align-top text-neutral-800 dark:text-neutral-200 " +
                        (ci === row.length - 1 && row.length > 1
                          ? "text-right tabular-nums whitespace-nowrap pl-4"
                          : "pr-4")
                      }
                    >
                      {renderInline(cell, `${k}-${ri}-${ci}`)}
                    </td>
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
    <article className="max-w-2xl mx-auto px-6 py-12 md:py-20">
      <Link
        to="/stories"
        className="inline-block mb-8 text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        style={HEAD_FONT}
      >
        ← All Stories
      </Link>

      <p className="mb-4 text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400" style={HEAD_FONT}>
        {story.category} · {story.readingTime} read
      </p>

      <h1
        className="text-3xl md:text-5xl leading-tight text-neutral-900 dark:text-white text-balance"
        style={HEAD_FONT}
      >
        {story.title}
      </h1>

      <p className="mt-5 text-xl leading-relaxed text-neutral-600 dark:text-neutral-300">
        {story.dek}
      </p>

      <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">
        <time dateTime={story.date}>{published}</time> · Photographs by {story.photoCredit}
      </p>

      {note ? <Block block={note} index={-1} /> : null}

      <figure className="my-10 -mx-6 md:mx-0">
        <ImageWithFallback
          src={story.hero}
          alt={story.heroAlt}
          className="w-full h-auto md:rounded-lg bg-neutral-100 dark:bg-neutral-900"
        />
      </figure>

      {body.map((b, i) => (
        <Block key={i} block={b} index={i} />
      ))}
    </article>
  );
}
