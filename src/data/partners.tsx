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
  tagline: "Affordable Lithium Batteries for Skoolies, Vans & RVs.",
  category: "Solar & Power",
  accent: "#033ACD", // WattCycle brand blue, sampled from wattcycle.com
  logo: undefined, // TODO: add "/wattcycle-logo.png" to /public
  // No heroImage: the hero stays a plain dark panel so the coupon code reads
  // cleanly. The photos all live in the product cards below instead.
  affiliateUrl: "https://www.wattcycle.com/?ref=mobiledwellings",
  ctaLabel: "Shop WattCycle →",
  coupon: {
    code: "DWELLINGS",
    discount: "8%",
    terms: "8% off sitewide at wattcycle.com",
    lastVerified: "August 20, 2026",
  },
  intro: [
    "WattCycle makes budget-friendly LiFePO4 (lithium iron phosphate) batteries that have become a popular choice for Skoolie and van builds that need battery storage without the premium price tag.",
    "Their 12V Mini and Group 24/31 batteries have a built-in BMS, bluetooth monitoring, and a low-temperature cutoff and a footprint that drops into tight electrical bays.",
  ],
  about:
    "WattCycle focuses on quality LiFePO4 batteries at accessible prices, with self-heating and Bluetooth-monitored models in the lineup. For builders weighing cost against capacity, they're worth a serious look.",
  products: [
    {
      title: "Wattcycle Budget LiFePO4 Batteries",
      body:
        "Drop-in standard sized 12V or 24V LiFePO4 batteries with built-in bluetooth, low temperature protection, and a compact case that fits battery boxes and other tight spaces. Wire several in parallel for a high-capacity Skoolie or van bank at a fraction of the cost of some of the more established brands while still getting most of the value.",
      image: "/wattcycle-justin-314ah-review.jpg",
      imageAlt:
        "Justin Smith of Mobile Dwellings sitting beside a WattCycle 12V 314Ah LiFePO4 Mini battery with Bluetooth and a 200A BMS.",
      ctaLabel: "See WattCycle batteries →",
    },
    {
      title: "12V 314Ah Mini with Bluetooth",
      body:
        "The one I tested: 314Ah in a Mini case with a 200A BMS and Bluetooth monitoring, so you can watch state of charge from your phone. It's a lot of usable amp-hours in a footprint that drops into a bench or cabinet.",
      image: "/wattcycle-12v-314ah-battery.jpg",
      imageAlt:
        "WattCycle 12V 314Ah LiFePO4 Mini battery with Smart Edition Bluetooth and a 200A BMS, held by its rope handles.",
      ctaLabel: "See the 314Ah Mini →",
    },
    {
      title: "48V Server Rack — The Budget EG4 Alternative",
      // PRICES ARE LIVE FIGURES — re-check both when you re-verify the coupon.
      // EG4 LifePower4 V2 48V 100Ah at Signature Solar and WattCycle's 48V
      // 100Ah were checked August 2026. WattCycle's was a promo price
      // ($899.99, down from $1,599.99), so it is the more volatile of the two.
      body:
        "Same 5.12 kWh server rack format as the EG4 LifePower4 batteries for a lot less money. The EG4 V2 runs $1,470.99 at Signature Solar and WattCycle's is $899.99 but the EG4 carries a UL rating and has proven to be durable. This is a budget vs value decision that could make sense for you.",
      image: "/wattcycle-48v-100ah-server-rack.webp",
      imageAlt:
        "WattCycle 51.2V 100Ah 5120Wh server rack LiFePO4 battery with a 100A BMS, LCD touchscreen, and Bluetooth — a budget alternative to the EG4 LifePower4.",
      ctaLabel: "See the 48V server rack →",
    },
    {
      title: "What the DWELLINGS Code Takes Off",
      body:
        "Proof it works: 8% came off a $1,088.98 cart at checkout. No minimum order to hit.",
      image: "/wattcycle-dwellings-code-checkout.jpg",
      imageAlt:
        "WattCycle checkout showing coupon code DWELLINGS applied to a $1,088.98 order for an $87.12 discount.",
      ctaLabel: "Use code DWELLINGS →",
    },
  ],
  faqs: [
    {
      question: "Is there a WattCycle coupon code?",
      answer:
        "Yes. Use code DWELLINGS at checkout for 8% off at wattcycle.com. We tested it on August 20, 2026 on a $1,088.98 cart and it took $87.12 off, stacking on top of the 2-pack bundle discount already applied. There's no minimum order.",
    },
    {
      question: "Are WattCycle batteries good for a Skoolie or van build?",
      answer:
        "They're a popular budget LiFePO4 option. The built-in bluetooth, low temperature protection, and compact cases make them a practical choice when you need a lot of storage without paying a premium price.",
    },
    {
      question: "Do WattCycle batteries work in cold weather?",
      answer:
        "Standard LiFePO4 batteries shouldn't be charged below freezing, but WattCycle's self-heating models add a low-temperature heating element so they can charge in cold conditions making them well-suited to four-season builds while still being affordable.",
    },
  ],
  seo: {
    title: "WattCycle Review & Discount — Budget LiFePO4 Batteries for Skoolies",
    description:
      "WattCycle LiFePO4 lithium batteries are a budget-friendly power option for skoolies, vans, and RVs. High cycle life, built-in BMS, self-heating models. Save with our code.",
    keywords:
      "wattcycle, wattcycle review, wattcycle coupon code, wattcycle discount, lifepo4 battery for skoolie, budget lithium battery van, cheap lifepo4 battery, 12v 100ah lifepo4, wattcycle vs eg4, best budget skoolie battery",
    ogImage: `${SITE}/wattcycle-12v-314ah-battery.jpg`,
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Registry. Order here = order on the /partners hub and the nav dropdown.
// ──────────────────────────────────────────────────────────────────────────
export const PARTNERS: Partner[] = [signatureSolar, onxOffroad, wattCycle];

// Staging area for partners that are written but not yet live. Move one into
// PARTNERS above and add its sitemap / prerender / llms.txt entries to publish.
// (WattCycle graduated from here — it is live as of August 2026.)
export const DRAFT_PARTNERS: Partner[] = [];

/** Partners rendered by the generic template (excludes bespoke pages). */
export const TEMPLATE_PARTNERS = PARTNERS.filter((p) => !p.externalPath);

export function getPartner(slug: string): Partner | undefined {
  return PARTNERS.find((p) => p.slug === slug);
}

/** Internal link for a partner: bespoke path if present, else /partners/<slug>. */
export function partnerHref(p: Partner): string {
  return p.externalPath ?? `/partners/${p.slug}`;
}
