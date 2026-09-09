import { Header } from "../components/Header";
import { Stories } from "../components/Stories";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { buildStoriesIndexSchema } from "../data/stories-content.mjs";

export function StoriesPage() {
  const structuredData = buildStoriesIndexSchema();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <SEO
        title="Stories | Skoolie and Van Conversion Tours"
        description="Long-form tours of converted school buses, vans and overland rigs — how they were built, what they cost, and what their owners would do differently."
        keywords="skoolie tour, bus conversion tour, school bus conversion story, van conversion tour, skoolie build cost, mobile dwellings stories"
        url="https://mobiledwellings.media/stories"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <Stories />
      <Footer />
    </div>
  );
}
