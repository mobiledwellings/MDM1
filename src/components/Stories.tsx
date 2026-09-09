import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { STORIES } from "../data/stories-content.mjs";

// See the note in StoryArticle.tsx: styling comes from src/styles/stories.css,
// not Tailwind utilities.
const HEAD_FONT = {
  fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  fontWeight: 700,
} as const;

export function Stories() {
  return (
    <section className="stories">
      <h1 className="stories-title" style={HEAD_FONT}>Stories</h1>
      <p className="stories-intro">
        Long-form tours of the rigs and the people living in them — what they built, what it
        cost, and what they'd do differently.
      </p>

      <div className="stories-grid">
        {STORIES.map((story) => (
          <Link key={story.slug} to={`/stories/${story.slug}`} className="story-card">
            <div className="story-card-img">
              <ImageWithFallback src={story.hero} alt={story.heroAlt} />
            </div>
            <p className="story-card-meta" style={HEAD_FONT}>
              {story.category} · {story.readingTime} read
            </p>
            <h2 className="story-card-title" style={HEAD_FONT}>{story.title}</h2>
            <p className="story-card-dek">{story.dek}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
