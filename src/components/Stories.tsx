import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { STORIES } from "../data/stories-content.mjs";

const HEAD_FONT = {
  fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  fontWeight: 700,
} as const;

export function Stories() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <header className="max-w-2xl">
        <h1
          className="text-3xl md:text-5xl leading-tight text-neutral-900 dark:text-white"
          style={HEAD_FONT}
        >
          Stories
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          Long-form tours of the rigs and the people living in them — what they built, what it
          cost, and what they'd do differently.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {STORIES.map((story) => (
          <Link
            key={story.slug}
            to={`/stories/${story.slug}`}
            className="group block"
          >
            <div className="aspect-[3/2] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
              <ImageWithFallback
                src={story.hero}
                alt={story.heroAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p
              className="mt-4 text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              style={HEAD_FONT}
            >
              {story.category} · {story.readingTime} read
            </p>
            <h2
              className="mt-2 text-xl md:text-2xl leading-snug text-neutral-900 dark:text-white group-hover:underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-600"
              style={HEAD_FONT}
            >
              {story.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              {story.dek}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
