/**
 * Build-time render entries for the prerenderer.
 *
 * scripts/prerender-seo.js imports the bundle built from this file and calls
 * renderSignatureSolarMain() to get the page's content as an HTML string, which
 * it bakes into build/signature-solar-coupon.html inside #root.
 *
 * WHY: the site is a client-rendered SPA, so the served HTML was a 5 KB shell —
 * no headings, no copy, no coupon code. Google renders JS on a deferred second
 * pass, but AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) don't
 * execute JavaScript at all and saw nothing but a <noscript> line.
 *
 * This renders the real component rather than maintaining a hand-written static
 * copy, so the prerendered HTML cannot drift from what users see.
 *
 * renderToStaticMarkup (not renderToString) because the client mounts with
 * createRoot().render(), which replaces #root wholesale — there's no hydration,
 * so React's data-reactroot bookkeeping would just be dead weight.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { SignatureSolarCouponMain } from "./pages/SignatureSolarCouponMain";
import { DealsCouponHero } from "./components/DealsCouponHero";
import { PartnerMain } from "./pages/PartnerMain";
import { getPartner } from "./data/partners";

export function renderSignatureSolarMain(): string {
  return renderToStaticMarkup(<SignatureSolarCouponMain />);
}

/**
 * The coupon block from /deals — the codes, the verified date, the shop intro.
 *
 * Only this block, not the whole page: the product catalog loads asynchronously
 * from DealsContext, so rendering it here would bake a permanent empty-loading
 * state into the HTML. The catalog carries no coupon code, so nothing the
 * mission depends on is lost. What ships is a true subset of what users see.
 *
 * StaticRouter because the card links to /signature-solar-coupon with <Link>,
 * which needs a router in context.
 */
export function renderDealsCouponHero(): string {
  return renderToStaticMarkup(
    <StaticRouter location="/deals">
      <DealsCouponHero />
    </StaticRouter>
  );
}

/**
 * A partner page's body (hero, intro, products, about, FAQ, closing CTA).
 *
 * These routes previously served an empty #root, so the ~1,100 words on each
 * one were invisible to any crawler that doesn't run JavaScript. Returns an
 * empty string for an unknown slug, or one that redirects elsewhere, so the
 * prerender script can simply skip it.
 *
 * No StaticRouter needed: PartnerMain links out with plain <a>, not <Link>.
 */
export function renderPartnerMain(slug: string): string {
  const partner = getPartner(slug);
  if (!partner || partner.externalPath) return "";
  return renderToStaticMarkup(<PartnerMain partner={partner} />);
}

/**
 * A partner's SEO block, straight from src/data/partners.tsx.
 *
 * WHY: the prerender script used to carry its own hand-written copy of each
 * partner's title and description, with a comment asking whoever edited one to
 * remember to edit the other. They drifted — WattCycle shipped a coupon-code
 * title in the static HTML and a review title once React ran, which told Google
 * two different things about the same URL. Reading the real source here means
 * they cannot disagree again.
 */
export function partnerSeo(slug: string) {
  const partner = getPartner(slug);
  if (!partner || partner.externalPath) return null;
  return {
    title: partner.seo.title,
    description: partner.seo.description,
    keywords: partner.seo.keywords,
    ogImage: partner.seo.ogImage ?? null,
  };
}
