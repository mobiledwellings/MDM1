import { useParams, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getPartner } from "../data/partners";
import { PartnerMain, useIsDarkMode, LIGHT, DARK } from "./PartnerMain";

const SITE = "https://mobiledwellings.media";

export function PartnerPage() {
  const { slug } = useParams<{ slug: string }>();
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  const partner = slug ? getPartner(slug) : undefined;

  // Bespoke pages (e.g. Signature Solar) redirect to their real route.
  if (partner?.externalPath) {
    return <Navigate to={partner.externalPath} replace />;
  }
  // Unknown slug → send to the hub.
  if (!partner) {
    return <Navigate to="/partners" replace />;
  }

  const p = partner;

  return (
    <>
      <SEO
        title={p.seo.title}
        description={p.seo.description}
        keywords={p.seo.keywords}
        url={`${SITE}/partners/${p.slug}`}
        image={p.seo.ogImage ?? `${SITE}/og-image.jpg`}
        type="article"
      />
      {/* JSON-LD structured data for partner pages is baked into the
          prerendered static HTML by scripts/prerender-seo.js (so non-JS
          crawlers and AI bots see it). It is intentionally NOT injected here at
          runtime, to avoid duplicate FAQPage/Offer entries on the same URL. */}

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: c.pageBg,
          color: c.text,
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <Header />
        <PartnerMain partner={p} />
        <Footer />
      </div>
    </>
  );
}
