/**
 * FAQ content + schema for /deals.
 *
 * Lives here, not inside DealsPage.tsx, because it used to be injected at
 * runtime via dangerouslySetInnerHTML — so it existed only after React ran and
 * the served HTML carried none of it. Every crawler that doesn't execute
 * JavaScript (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) got nothing from
 * the site's highest-impression coupon URL.
 *
 * scripts/prerender-seo.js imports this and bakes the graph into
 * build/deals.html. Plain ESM (no JSX, no TS) so Node can read it at build time.
 *
 * The coupon code is interpolated from the shared Signature Solar module rather
 * than hardcoded, so a code rotation can't leave stale answers stranded here.
 */
import { COUPON_CODE, SITE_URL } from "./signature-solar-content.mjs";

const DEALS_URL = `${SITE_URL}/deals`;

export const DEALS_FAQ_ITEMS = [
  {
    question: "What is the Signature Solar coupon code?",
    answer: `Use coupon code ${COUPON_CODE} at signaturesolar.com for an exclusive discount on EG4 inverters, lithium batteries, solar panels, and more. This Signature Solar promo code is provided through our partnership and works on most products sitewide.`,
  },
  {
    question: "Does Signature Solar offer discount codes?",
    answer: `Yes. Signature Solar partners with creators and builders in the skoolie and overland community. Mobile Dwellings has an exclusive Signature Solar coupon code: ${COUPON_CODE}. Enter it at checkout on signaturesolar.com to save.`,
  },
  {
    question: "What is the best inverter for a skoolie?",
    answer: `For most skoolie builds, a 3000W pure sine wave inverter is ideal. The EG4 6000XP from Signature Solar is one of the most popular choices in the skoolie community. Use code ${COUPON_CODE} at signaturesolar.com to save.`,
  },
  {
    question: "What are the best lithium batteries for a bus conversion?",
    answer: "LiFePO4 (lithium iron phosphate) batteries are the gold standard for bus conversions and skoolies. They offer longer lifespan, lighter weight, and deeper discharge than AGM. See our recommended batteries, all tested in real builds.",
  },
  {
    question: "What solar panels should I use for a van conversion?",
    answer: "Rigid monocrystalline panels (200W-400W) are the most efficient for van roofs. For curved skoolie roofs, flexible panels work well. We list our top picks with real-world test data and exclusive discount codes.",
  },
  {
    question: "What is the best mini split for a skoolie or camper van?",
    answer: "A 12V or 24V DC mini split is the most efficient climate control for skoolies and large van conversions. They run directly off your battery bank without needing an inverter. Browse our tested recommendations.",
  },
  {
    question: "How much solar do I need for an overland rig?",
    answer: "Most overland rigs need 400W-800W of solar depending on power usage. Pair with a quality MPPT charge controller and lithium batteries for reliable off-grid power. See our full solar setup recommendations.",
  },
];

export function buildDealsFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${DEALS_URL}#faq`,
    "mainEntity": DEALS_FAQ_ITEMS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };
}
