// ──────────────────────────────────────────────────────────────────────────
// Partner directory — single source of truth for the /partners hub and every
// /partners/:slug page.
//
// HOW TO ADD A PARTNER:
//   1. Copy one of the objects below, change the `slug` (this becomes the URL
//      at /partners/<slug>), and fill in the fields.
//   2. Anything left as `PLACEHOLDER_…` is intentionally a stand-in — replace
//      it with the real affiliate link / coupon code / video ID when you have
//      it. Search the file for "PLACEHOLDER" to find them all.
//   3. Add the slug to scripts/generate-sitemap.js and scripts/prerender-seo.js
//      (there's a PARTNER_SLUGS list / comment in each) so the new page gets
//      indexed by Google.
//
// Signature Solar is intentionally NOT rendered by the generic template — it
// has its own hand-built page at /signature-solar-coupon. It still appears in
// the hub list below (with `externalPath`) so it shows up on /partners.
// ──────────────────────────────────────────────────────────────────────────

export type PartnerProduct = {
  /** Product / category name shown as the card heading. */
  title: string;
  /** Plain-text description. Also feeds the JSON-LD ImageObject description. */
  body: string;
  /** Optional image in /public (e.g. "/wattcycle-12v-battery.jpg"). */
  image?: string;
  imageAlt?: string;
  /** Optional direct link for this product (falls back to the affiliate URL). */
  href?: string;
  /** Optional CTA label for the product link. */
  ctaLabel?: string;
};

export type PartnerFAQ = {
  question: string;
  answer: string;
};

export type PartnerVideo = {
  /** YouTube video id, e.g. "Wz-03QUxv_Q". */
  id: string;
  /** Optional start time in seconds. */
  start?: number;
  title: string;
  description: string;
  /** ISO 8601 datetime, e.g. "2025-07-04T12:00:00Z". */
  uploadDate: string;
};

export type PartnerCoupon = {
  code: string;
  /** Short discount amount shown on the hub card pill, e.g. "$50", "20%", "8%".
   *  Rendered as "Use code <CODE> for <discount> Off". */
  discount?: string;
  /** Human-readable, e.g. "July 31, 2026". Omit for evergreen codes. */
  expires?: string;
  /** ISO date, e.g. "2026-07-31". Used in schema validThrough. */
  expiresDate?: string;
  /** When you last confirmed the code works, e.g. "June 1, 2026". */
  lastVerified?: string;
  /** Short terms line, e.g. "Works on most products sitewide." */
  terms?: string;
  /** Optional instruction shown with the coupon (and footer CTA) — e.g. asking
   *  the buyer to credit Mobile Dwellings in the brand's checkout survey. */
  surveyNote?: string;
};

export type Partner = {
  /** URL slug → /partners/<slug>. */
  slug: string;
  /** Brand name. */
  name: string;
  /** One-line positioning statement shown under the name. */
  tagline: string;
  /** Short category label for the hub card, e.g. "Solar & Power". */
  category: string;
  /** Brand accent color (hex) used for highlights & the hub card. */
  accent: string;
  /** Logo path in /public (optional). Shown above the hero eyebrow text. */
  logo?: string;
  /** Full-bleed hero background image in /public (optional). A dark overlay
   *  keeps the hero text readable on top of it. */
  heroImage?: string;
  heroImageAlt?: string;
  /** Affiliate / partner link. The primary CTA target. */
  affiliateUrl: string;
  /** Label for the main CTA button, e.g. "Shop WattCycle →". */
  ctaLabel: string;
  /** Optional coupon block. */
  coupon?: PartnerCoupon;
  /** Optional hero build-tour video. */
  heroVideo?: PartnerVideo;
  /** Intro paragraphs (plain strings, rendered as <p>). */
  intro: string[];
  /** "Why we partner" / about blurb shown in its own section. */
  about: string;
  /** Heading above the product cards. Falls back to "What we like about <name>". */
  productsHeading?: string;
  /** Product / gear cards. */
  products: PartnerProduct[];
  /** FAQ entries (also emitted as FAQPage schema). */
  faqs: PartnerFAQ[];
  /** SEO metadata. */
  seo: {
    title: string;
    description: string;
    keywords: string;
    /** OG image URL (absolute). Falls back to the site default. */
    ogImage?: string;
  };
  /**
   * If set, the hub card links to this internal path instead of
   * /partners/<slug> and the generic template is NOT used. For partners that
   * have a bespoke hand-built page (e.g. Signature Solar).
   */
  externalPath?: string;
};

const SITE = "https://mobiledwellings.media";

// ──────────────────────────────────────────────────────────────────────────
// Signature Solar — hub entry only; the real page lives at
// /signature-solar-coupon (SignatureSolarCouponPage.tsx).
// ──────────────────────────────────────────────────────────────────────────
const signatureSolar: Partner = {
  slug: "signature-solar",
  name: "Signature Solar",
  tagline: "EG4 inverters, lithium batteries, solar panels & off-grid power.",
  category: "Solar & Power",
  accent: "#ffde5a",
  logo: "/og-signature-solar.png",
  affiliateUrl: "https://signaturesolar.com/?ref=mobiledwellings",
  ctaLabel: "Shop Signature Solar →",
  externalPath: "/signature-solar-coupon",
  coupon: {
    code: "MD50OFF",
    discount: "$50",
    // Ongoing offer — no expiry published. Freshness is carried by
    // lastVerified, re-stamped every few days via `npm run verify-coupon`.
    lastVerified: "August 20, 2026",
    terms: "$50 off orders of $500+. Works on most products sitewide.",
  },
  intro: [
    "Signature Solar supplies the EG4 inverters, lithium batteries, and solar panels we install in skoolies and overland rigs. Use code MD50OFF for $50 off orders over $500.",
  ],
  about:
    "Signature Solar is our go-to source for off-grid electrical components. We've installed their EG4 gear in multiple builds featured on the channel.",
  products: [],
  faqs: [],
  seo: {
    title: "Signature Solar Coupon Code MD50OFF",
    description:
      "Use coupon code MD50OFF at Signature Solar for $50 off orders over $500.",
    keywords: "signature solar coupon code, MD50OFF, EG4 coupon code",
    ogImage: `${SITE}/og-signature-solar.jpg`,
  },
};

// ──────────────────────────────────────────────────────────────────────────
// onX Offroad — GPS trail, route-planning & off-road navigation app.
// ──────────────────────────────────────────────────────────────────────────
const onxOffroad: Partner = {
  slug: "onx-offroad",
  name: "onX Offroad",
  tagline: "Trail maps, route planning & offline GPS for off road adventures.",
  category: "Navigation & Apps",
  accent: "#f25c05",
  logo: undefined, // TODO: add "/onx-offroad-logo.png" to /public
  affiliateUrl:
    "https://www.onxmaps.com/purchase/offroad/membership?promo=juicebox&utm_source=or_ic_partnerships&utm_medium=ambassador&utm_campaign=mobiledwellings",
  ctaLabel: "Try onX Offroad →",
  coupon: {
    code: "JUICEBOX",
    discount: "20%",
    terms: "20% off any onX Offroad membership — Premium or Elite.",
    surveyNote:
      "One favor: when onX's checkout survey asks how you heard about them, please mention Mobile Dwellings so we get the credit.",
    lastVerified: "June 1, 2026",
  },
  intro: [
    "onX Offroad is the GPS app we use to plan alternative routes, find off the beaten path adventures, and discover unique campsites when we take a rig off the pavement. Downloadable offline maps means it keeps working if cell service drops.",
    "Whether you're navigating forest service roads in a Skoolie or scouting a place to sleep for the night, onX shows public land, trail difficulty ratings, and trail conditions so you (hopefully) don't end up somewhere you shouldn't be.",
  ],
  about:
    "onX Offroad maps over 650,000 miles of off-road trails across 852 million acres of public land. When you're living full time in a big rig you don't want to be limited by paved roads but when you drive off-road you can quickly get into trouble. Depending on Google Maps and iOverlander is not quite going to get you out there into the forest adventures that onX Offroad can.",
  productsHeading: "What we like about onX Offroad Maps",
  products: [
    {
      title: "Trail Difficulty & Conditions",
      body:
        "Every trail is rated for difficulty, and Trail Reports show recent conditions, and closures. Driving a Skoolie? Stick to the easy trails, but fortunately there are plenty of those too. It's not just an Overlanding app.",
      image: "/onx-mexican-hat-hero.jpg",
      imageAlt:
        "Mobile Dwellings' yellow skoolie parked off-pavement below the Mexican Hat rock formation in the red rock Utah desert.",
      ctaLabel: "Browse trails →",
    },
    {
      title: "Offline Maps & GPS",
      body:
        "Save topographic, satellite, and 3D terrain maps to your device. onX Offroad keeps full GPS navigation working with no cell service. When you're driving your home in the middle of nowhere that's something you'll inevitably need.",
      image: "/onx-app-discover-trails.jpg",
      imageAlt:
        "onX Offroad app Discover panel listing nearby trails with difficulty ratings over a map of El Malpais public land in New Mexico.",
      ctaLabel: "See onX Offroad plans →",
    },
    {
      title: "Public Land & Dispersed Camping",
      body:
        "onX's public land maps and Forest Service-verified Dispersed Camping layer show where you can legally camp and drive on BLM and National Forest land.",
      image: "/onx-dispersed-camping-dirt-road.jpg",
      imageAlt:
        "Aerial view of the Mobile Dwellings skoolie dispersed camping on public land beside a dirt road in high-desert sagebrush at sunset.",
      ctaLabel: "Explore the map →",
    },
    {
      title: "Route Planning",
      body:
        "Build the trip before you leave the driveway. Route Builder's snap-to-trail tool stitches trails and roads into a multi-day route you can save, edit, preview, and share with your friends.",
      image: "/onx-skoolie-sunset-mountains.jpg",
      imageAlt:
        "Low-angle sunset photo of the Mobile Dwellings skoolie on a remote dirt pullout with long shadows and mountains under a storm sky.",
      ctaLabel: "Start planning →",
    },
  ],
  faqs: [
    {
      question: "Is there an onX Offroad coupon code?",
      answer:
        "Yes — use code JUICEBOX at checkout for 20% off an onX Offroad membership. When the checkout survey asks how you heard about onX, please reference Mobile Dwellings so we get the credit. We update this page whenever the offer changes.",
    },
    {
      question: "What's the difference between onX Offroad Premium and Elite?",
      answer:
        "Premium covers trail maps, difficulty ratings, offline maps, route planning, and dispersed camping — everything most boondockers need. Elite adds private property boundaries, landowner info, and partner discounts. Your JUICEBOX code takes 20% off either tier; check onX for current pricing.",
    },
    {
      question: "Is onX Offroad worth it for Bus Conversions and Skoolies?",
      answer:
        "For just $28 per year with our 20% discount it's absolutely worth it to have a navigation app that will help you find off road adventures and to provide route planning and navigation outside of cell service.",
    },
  ],
  seo: {
    title: "onX Offroad Discount Code JUICEBOX — 20% Off",
    description:
      "Save 20% on onX Offroad with code JUICEBOX. The GPS trail and route-planning app we use for off-road navigation, dispersed camping, and offline maps.",
    keywords:
      "onx offroad, onx offroad discount, onx offroad coupon code, offline trail maps, overland gps app, route planning app, boondocking app, public land map, dispersed camping app, van life navigation, onx offroad review",
    ogImage: `${SITE}/onx-mexican-hat-hero.jpg`,
  },
};

// ──────────────────────────────────────────────────────────────────────────
// WattCycle — LiFePO4 batteries & power for mobile builds.
// ──────────────────────────────────────────────────────────────────────────
const wattCycle: Partner = {
  slug: "wattcycle",
  name: "WattCycle",
  tagline: "Affordable LiFePO4 lithium batteries for skoolies, vans & RVs.",
  category: "Solar & Power",
  accent: "#1f9e5a",
  logo: undefined, // TODO: add "/wattcycle-logo.png" to /public
  affiliateUrl: "https://www.wattcycle.com/?ref=mobiledwellings",
  ctaLabel: "Shop WattCycle →",
  coupon: {
    code: "DWELLINGS",
    discount: "8%",
    terms: "Discount on WattCycle LiFePO4 batteries.",
    lastVerified: "June 1, 2026",
  },
  intro: [
    "WattCycle makes budget-friendly LiFePO4 (lithium iron phosphate) batteries that have become a popular choice for skoolie and van builds that need a lot of storage without the premium price tag.",
    "Their 12V Mini and Group 24/31 batteries pack a built-in BMS, thousands of charge cycles, and a low-temperature cutoff into a footprint that drops into tight electrical bays — exactly the kind of value gear we like to flag for budget builds.",
  ],
  about:
    "WattCycle focuses on high-cycle LiFePO4 batteries at accessible prices, with self-heating and Bluetooth-monitored models in the lineup. For builders weighing cost against capacity, they're worth a serious look.",
  products: [
    {
      title: "12V 100Ah / 200Ah LiFePO4 Batteries",
      body:
        "The core of a WattCycle bank: drop-in 12V LiFePO4 batteries with a built-in BMS, 4,000–15,000 cycle ratings, and a compact case that fits standard battery boxes. Wire several in parallel for a high-capacity skoolie or van bank.",
      ctaLabel: "See WattCycle batteries →",
    },
    {
      title: "Mini & Group 24 Batteries",
      body:
        "Smaller-footprint cells for builds where space is tight. Same LiFePO4 chemistry and BMS protection in a case that squeezes into cabinets and benches where a full Group 31 won't fit.",
      ctaLabel: "Browse the lineup →",
    },
    {
      title: "Self-Heating & Bluetooth Models",
      body:
        "Cold-weather and smart-monitoring options: self-heating batteries that keep charging below freezing, and Bluetooth models so you can watch state-of-charge from your phone — handy for four-season rigs.",
      ctaLabel: "Compare models →",
    },
  ],
  faqs: [
    {
      question: "Is there a WattCycle coupon code?",
      answer:
        "Yes — use code DWELLINGS at checkout for a discount on WattCycle LiFePO4 batteries. We re-verify this page's offer regularly.",
    },
    {
      question: "Are WattCycle batteries good for a skoolie or van build?",
      answer:
        "They're a popular budget LiFePO4 option. The built-in BMS, high cycle life, and compact case make them a practical choice when you need a lot of storage without paying a premium-brand price.",
    },
    {
      question: "Do WattCycle batteries work in cold weather?",
      answer:
        "Standard LiFePO4 batteries shouldn't be charged below freezing, but WattCycle's self-heating models add a low-temperature heating element so they can charge in cold conditions — worth it for four-season builds.",
    },
  ],
  seo: {
    title: "WattCycle Review & Discount — Budget LiFePO4 Batteries for Skoolies",
    description:
      "WattCycle LiFePO4 lithium batteries are a budget-friendly power option for skoolies, vans, and RVs. High cycle life, built-in BMS, self-heating models. Save with our code.",
    keywords:
      "wattcycle, wattcycle review, wattcycle coupon code, wattcycle discount, lifepo4 battery for skoolie, budget lithium battery van, cheap lifepo4 battery, 12v 100ah lifepo4, wattcycle vs eg4, best budget skoolie battery",
    ogImage: `${SITE}/og-image.jpg`,
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Registry. Order here = order on the /partners hub and the nav dropdown.
// ──────────────────────────────────────────────────────────────────────────
export const PARTNERS: Partner[] = [signatureSolar, onxOffroad];

// Not published yet — WattCycle is built out but held back pending a copy/branding
// pass. Add it back into PARTNERS above (and re-add its sitemap/prerender/llms
// entries) when ready.
export const DRAFT_PARTNERS: Partner[] = [wattCycle];

/** Partners rendered by the generic template (excludes bespoke pages). */
export const TEMPLATE_PARTNERS = PARTNERS.filter((p) => !p.externalPath);

export function getPartner(slug: string): Partner | undefined {
  return PARTNERS.find((p) => p.slug === slug);
}

/** Internal link for a partner: bespoke path if present, else /partners/<slug>. */
export function partnerHref(p: Partner): string {
  return p.externalPath ?? `/partners/${p.slug}`;
}
