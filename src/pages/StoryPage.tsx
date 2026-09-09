import { useParams, Navigate } from "react-router-dom";
import { Header } from "../components/Header";
import { StoryArticle } from "../components/StoryArticle";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { getStory, buildStorySchema } from "../data/stories-content.mjs";

export function StoryPage() {
  const { slug } = useParams();
  const story = getStory(slug);

  if (!story) return <Navigate to="/stories" replace />;

  const url = `https://mobiledwellings.media/stories/${story.slug}`;
  const image = `https://mobiledwellings.media${story.hero}`;

  const structuredData = buildStorySchema(story);

  return (
    <div className="story-page">
      <SEO
        title={story.title}
        description={story.dek}
        keywords={story.keywords}
        image={image}
        url={url}
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <StoryArticle story={story} />
      <Footer />
    </div>
  );
}
