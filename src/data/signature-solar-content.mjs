/**
 * Shared content + schema source for the Signature Solar coupon page.
 *
 * WHY THIS FILE EXISTS
 * The page's structured data used to be built inside SignatureSolarCouponPage.tsx
 * and injected at runtime by react-helmet-async. That meant it only existed
 * after React executed, so the served HTML carried none of it — Googlebot saw
 * it only on its deferred render pass, and AI crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, OAI-SearchBot), which don't run JS at all, never saw it.
 *
 * Commit 9e8b47a7 hit the same problem from the other side: static schema in
 * the prerender script + runtime schema on the page produced duplicate
 * FAQPage/Offer entries, and the fix removed the *static* copy. That resolved
 * the duplication but kept the invisible half. Commit 3c20da7b later got it
 * right for the onX page — bake it static, drop the runtime injection.
 *
 * This module is that fix for the coupon page, without the copy-paste drift
 * risk: it is plain ESM (no JSX, no TS), so both consumers read the same data.
 *
 *   - SignatureSolarCouponPage.tsx imports it to render the page
 *   - scripts/prerender-seo.js imports it to bake the schema into the HTML
 *
 * Keep it dependency-free and JSX-free so Node can import it directly at build
 * time. Rich-text overlays (inline links inside a paragraph) stay in the TSX
 * and are merged onto this data by title/question — see the page component.
 */

export const COUPON_CODE = "MD50OFF";
export const AFFILIATE_URL = "https://signaturesolar.com/?ref=mobiledwellings";
export const SITE_URL = "https://mobiledwellings.media";
export const PAGE_URL = `${SITE_URL}/signature-solar-coupon`;

export const AUTHOR = {
  name: "Justin Smith",
  role: "Founder, Mobile Dwellings",
  url: "https://www.instagram.com/gilliganphantom",
};

export const FEATURED_VIDEO = {
  id: "Wz-03QUxv_Q",
  start: 8,
  title:
    "Justin from Mobile Dwellings reviews EG4 Server Rack Batteries in the Gilligan Phantom 40-foot skoolie",
  description:
    "Justin from Mobile Dwellings reviews his favorite lithium batteries and explains why the EG4 Server Rack Batteries (LiFePower4) consistently provided the best long-term value in his off-grid builds. He installed 3 of them in his 40-foot skoolie, Gilligan Phantom — the same gear sold by Signature Solar with code MD50OFF.",
  caption:
    "Watch Justin from Mobile Dwellings review his favorite lithium batteries. The EG4 Server Rack Batteries consistently provided the best long term value and he installed 3 of them in his 40 foot Skoolie, Gilligan Phantom",
  uploadDate: "2025-07-04T12:00:00Z",
};

export const BUILD_SHOTS = [
  {
    image: "/skoolie-eg4-electrical-bay.jpg",
    alt: "The Beers Bus electrical bay — Brian and Amber's 40-foot skoolie — with four EG4 Server Rack Batteries (LiFePower4, 25.6V 200Ah, 5,120 Wh each) stacked along the driver-side wall and a wall of Victron components including SmartSolar MPPT charge controllers on the opposite side.",
    blurb:
      "Brian and Amber from The Beers Bus chose 4 EG4 Server Rack Batteries: 25.6V 200 Ah, 5,120 Wh each for a 20 kWh Lithium battery bank for their 40 foot Skoolie and wired them to a suite of Victron components to keep their rig fully charged in all off-grid conditions.",
    videoId: "M8ZhTeuLABk",
    videoStart: 439,
    videoTitle:
      "Brian and Amber's 40-foot skoolie The Beers Bus: EG4 Server Rack Battery bank and Victron components tour",
    videoDescription:
      "Mobile Dwellings tours The Beers Bus, Brian and Amber's 40-foot skoolie running 4 EG4 Server Rack Batteries (LiFePower4, 25.6V 200Ah, 5,120 Wh each) wired into a full Victron suite — MPPT charge controllers, Cerbo GX, Orion-Tr Smart DC-DC chargers — for a ~20 kWh off-grid build using gear from Signature Solar with code MD50OFF.",
    uploadDate: "2025-10-12T12:00:00Z",
    dealsHref: "/deals?filter=batteries",
    dealsCtaLabel: "Recommended Lithium Batteries in our gear shop →",
  },
];

export const GEAR_ITEMS = [
  {
    title: "EG4 12000XP, 6000XP, and 3000XP All in One Hybrid Inverters",
    body:
      "EG4's hybrid inverters have become a great option in larger skoolies and full-time off-grid builds for running multiple mini-splits, induction cooking, electric water heaters, and other high electrical draws all at once in an affordable and reliable package. Helton and Erika chose one for their full size transit bus conversion called Capella Bus. Watch the full tour here or check out the All In One Inverter/Charger options in our gear shop.",
    image: "/eg4-12000xp-installed.jpg",
    imageAlt:
      "EG4 12000XP All-in-One Hybrid Inverter installed in Helton and Erika's Capella Bus — a full-size transit bus conversion — wired into a skoolie-style electrical bay alongside Victron MPPT charge controllers and EG4 LiFePower4 batteries.",
  },
  {
    title: "Solar Panels from Signature Solar (10 Pack Pallets)",
    body:
      "If you're filling a bus or trailer roof, buying panels by the pallet is the cheapest per-watt route I've found. Signature Solar sells residential and commercial sized panels in pallets of 10 at industry-low pricing (I've checked in person distributors many times and Signature Solar pallets consistently sell for almost half price, at times as cheap as 23 cents per watt), plus the IronRidge racking, MC4 connectors, and PV wire to wire them up. The Capella Bus features 10 such panels, delivering around 5,500 watts of solar power laid edge-to-edge across a custom rooftop rack, giving them pretty much endless off-grid power for Air Conditioning, induction cooking, electric water heating, refrigeration, a washer and dryer, and a microwave.",
    image: "/solar-panels-skoolie-roof.jpg",
    imageAlt:
      "Aerial top-down view of Helton and Erika's Capella Bus — a full-size transit bus conversion — with 10 monocrystalline solar panels (~5,500 watts total) arranged edge-to-edge across a custom IronRidge rooftop rack, parked at an off-grid gathering.",
    dealsHref: "/deals?filter=solar-panels",
    dealsCtaLabel: "See current Solar Panel deals & pricing in our gear shop →",
  },
  {
    title: "Victron Components",
    body:
      "Brad and Donna from Crown N Around went for the full Victron suite in their full size vintage Crown School Bus Conversion. Victron components include Cerbo GX system monitoring, Orion-Tr Smart isolated DC-DC chargers (for charging the lithium battery bank from the bus alternator while driving), SmartSolar MPPT charge controllers (150|85 VE.Can and the rest of the line), MultiPlus inverter/chargers, and the SmartShunt for system monitoring. Signature Solar stocks the standard Victron lineup at industry standard pricing. So you can buy your batteries, solar panels, solar racks, mini splits, and your Victron components in one efficient order.",
    image: "/victron-skoolie-install.jpg",
    imageAlt:
      "Brad and Donna's Crown N Around — a full-size vintage Crown School Bus conversion — with the open electrical bay showing the full Victron suite: Orion-Tr Smart 12/24-15 isolated DC-DC chargers, a SmartSolar MPPT 150|85 VE.Can charge controller, and a Cerbo GX monitoring unit, with Brad standing alongside the compartment.",
    dealsHref: "/deals?filter=inverters",
    dealsCtaLabel: "Browse Victron components in our gear shop →",
  },
];

export const FAQ_ITEMS = [
  {
    question: "How does the MD50OFF code work?",
    answer: `Add at least $500 of gear to your cart at signaturesolar.com, then enter ${COUPON_CODE} in the discount code field at checkout. You'll save $50 and the discount applies sitewide, including batteries, inverters, solar panels, and complete off-grid kits, and it also stacks with other discounts like free shipping.`,
  },
  {
    question: "What gear is the discount good for?",
    answer: `The ${COUPON_CODE} code applies sitewide to Signature Solar products. That covers most of what you'd build a system around: EG4 LiFePO4 lithium batteries, EG4 all-in-one inverter/chargers, the full Victron lineup (Cerbo GX, SmartSolar MPPT, Orion-Tr, MultiPlus), solar panels by the pallet, IronRidge racking, and mini-splits.`,
  },
  {
    question: "Does this code expire?",
    answer: `Signature Solar coupon codes expire every 60 days. ${COUPON_CODE} is the current code. I check it at signaturesolar.com every few days and update the verified date at the top of this page, to ensure that the code is working. When a new code goes live I update it here.`,
  },
  {
    question: "Does Signature Solar offer free shipping?",
    answer: `Signature Solar ships most items freight and runs free-shipping promotions sometimes on select items and sometimes sitewide. ${COUPON_CODE} will still give you $50 off during free-shipping sales.`,
  },
  {
    question: "Can I use this code with a sale or another discount?",
    answer: `Yes. ${COUPON_CODE} applies at checkout on top of live sale pricing in most cases, so a sale item plus the code stacks. It doesn't combine with another discount code, since Signature Solar's checkout accepts one code per order, but that's okay because all codes give $50 off anyway as far as I know.`,
  },
  {
    question: "Is Signature Solar legit?",
    answer: `Yes, and we've bought from them ourselves. On May 25, 2025 we spent $3,852 at Signature Solar on three EG4 LifePower4 server rack batteries and installed them in Gilligan Phantom, our 40-foot skoolie, and they've worked flawlessly since. They're a Texas-based distributor and the primary US seller of the EG4 line, and they're the supplier we see most often when we film Skoolie and bus conversion tours.`,
  },
  {
    question: "Is Signature Solar a good fit for skoolie and van builds?",
    answer: `Signature Solar is the most common supplier we see when we film skoolie and bus conversion tours. Their EG4 gear is reliable, affordable, and built for the kind of use a mobile dwelling actually puts on its electrical system.`,
  },
];

/**
 * Build the full schema.org @graph for the coupon page.
 *
 * Takes the verification dates as arguments rather than importing them, so this
 * module stays free of any dependency on coupon-verification.ts — that file is
 * TypeScript and is rewritten by `npm run verify-coupon`, and Node can't import
 * it directly at build time.
 *
 * @param {{ lastVerified: string, lastVerifiedDate: string }} verification
 */
/**
 * "September 2026" from an ISO verification date.
 *
 * The month is derived from when the code was last actually checked, never
 * hardcoded, so it cannot drift into claiming a freshness that isn't real —
 * `npm run verify-coupon` moves it along with every other date on the page.
 * That also keeps the claim honest: the page says the code was verified in
 * that month, not that it expires at the end of it.
 */
export function verifiedMonthLabel(isoDate) {
  const [y, m] = isoDate.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${y}`;
}

/**
 * Key facts as label/value pairs, rendered as a <dl> near the top of the page.
 *
 * WHY A LIST AND NOT A SENTENCE: the same facts already appear in the intro
 * prose, but a definition list is far easier for a model to extract cleanly —
 * each fact is delimited rather than needing to be parsed out of a clause. The
 * competitor pages that keep winning the AI Overview all lead with a scannable
 * block like this.
 *
 * The $500 order minimum is deliberately NOT here. It stays in the FAQ. Every
 * competing Signature Solar code carries the same floor without publishing it,
 * and listing it in a spec block is precisely what made an identical offer read
 * as more restricted. See a4901790.
 *
 * `iso` marks the row that should render inside a <time> element.
 */
export function buildFastFacts({ lastVerified, lastVerifiedDate }) {
  return [
    { label: "Retailer", value: "Signature Solar (signaturesolar.com)" },
    { label: "Coupon code", value: COUPON_CODE, isCode: true },
    { label: "Discount", value: "$50 off" },
    {
      label: "Applies to",
      value:
        "Sitewide — EG4 lithium batteries and inverters, the full Victron lineup, solar panels by the pallet, IronRidge racking, and mini-splits",
    },
    { label: "Stacks with", value: "Live sale pricing and free-shipping promotions" },
    { label: "Last verified", value: `${lastVerified} by ${AUTHOR.name}`, iso: lastVerifiedDate },
  ];
}

export function buildSignatureSolarSchema({ lastVerified, lastVerifiedDate }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        "url": PAGE_URL,
        "name": `Signature Solar Coupon Code ${verifiedMonthLabel(lastVerifiedDate)} – ${COUPON_CODE} Gets $50 Off | Mobile Dwellings`,
        "description": `The current Signature Solar coupon code is ${COUPON_CODE}. It takes $50 off at signaturesolar.com and works on its own at checkout. Verified active by Justin Smith on ${lastVerified}.`,
        "inLanguage": "en-US",
        "dateModified": lastVerifiedDate,
        "author": { "@id": `${SITE_URL}/#justin` },
        "publisher": { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#justin`,
        "name": AUTHOR.name,
        "jobTitle": AUTHOR.role,
        "url": `${SITE_URL}/about`,
        "sameAs": [
          AUTHOR.url,
          "https://www.youtube.com/@MobileDwellings",
          "https://www.instagram.com/mobiledwellings",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Mobile Dwellings",
        "url": SITE_URL,
        "founder": { "@id": `${SITE_URL}/#justin` },
        "sameAs": [
          "https://www.youtube.com/@MobileDwellings",
          "https://www.instagram.com/mobiledwellings",
        ],
      },
      {
        "@type": "Offer",
        "name": "Mobile Dwellings Signature Solar Discount Code",
        "description": `Save $50 at Signature Solar with coupon code ${COUPON_CODE}. Applies sitewide — EG4 inverters, lithium batteries, solar panels, and complete off-grid kits.`,
        "url": AFFILIATE_URL,
        "category": "Promo Code",
        "price": "0",
        "priceCurrency": "USD",
        // No eligibleTransactionVolume. The $500 floor is real, but every
        // competing Signature Solar code carries the same one and none of them
        // publish it — so encoding it here was the only reason Google's AI
        // Overview described MD50OFF as limited to "orders over $500" while
        // describing an identical competitor code as simply "$50 off". Same
        // offer, worse presentation, purely self-inflicted. The requirement is
        // still stated plainly in the FAQ, so nobody is misled; it just no
        // longer leads the machine-readable summary. Continues the direction of
        // 7d11395c and b721cdec.
        // No validThrough: the offer is ongoing. A past validThrough would tell
        // crawlers the deal is dead; availabilityStarts + dateModified carry the
        // freshness signal instead.
        "availabilityStarts": lastVerifiedDate,
        "seller": {
          "@type": "Organization",
          "name": "Signature Solar",
          "url": AFFILIATE_URL,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        "mainEntity": FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
      {
        "@type": "VideoObject",
        "name": FEATURED_VIDEO.title,
        "description": FEATURED_VIDEO.description,
        "thumbnailUrl": `https://i.ytimg.com/vi/${FEATURED_VIDEO.id}/maxresdefault.jpg`,
        "embedUrl": `https://www.youtube.com/embed/${FEATURED_VIDEO.id}`,
        "contentUrl": `https://www.youtube.com/watch?v=${FEATURED_VIDEO.id}`,
        "uploadDate": FEATURED_VIDEO.uploadDate,
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "author": { "@id": `${SITE_URL}/#justin` },
      },
      ...BUILD_SHOTS.flatMap((s) => [
        {
          "@type": "ImageObject",
          "contentUrl": `${SITE_URL}${s.image}`,
          "url": `${SITE_URL}${s.image}`,
          "caption": s.alt,
          "description": s.blurb,
          "creator": { "@id": `${SITE_URL}/#justin` },
          "creditText": "Mobile Dwellings",
          "copyrightNotice": "© Mobile Dwellings",
        },
        {
          "@type": "VideoObject",
          "name": s.videoTitle,
          "description": s.videoDescription,
          "thumbnailUrl": `https://i.ytimg.com/vi/${s.videoId}/maxresdefault.jpg`,
          "embedUrl": `https://www.youtube.com/embed/${s.videoId}`,
          "contentUrl": `https://www.youtube.com/watch?v=${s.videoId}`,
          "uploadDate": s.uploadDate,
          "publisher": { "@id": `${SITE_URL}/#organization` },
          "author": { "@id": `${SITE_URL}/#justin` },
        },
      ]),
      ...GEAR_ITEMS.filter((g) => g.image).map((g) => ({
        "@type": "ImageObject",
        "contentUrl": `${SITE_URL}${g.image}`,
        "url": `${SITE_URL}${g.image}`,
        "caption": g.imageAlt,
        "description": g.body,
        "creator": { "@id": `${SITE_URL}/#justin` },
        "creditText": "Mobile Dwellings",
        "copyrightNotice": "© Mobile Dwellings",
      })),
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Deals", "item": `${SITE_URL}/deals` },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Signature Solar Coupon Code",
            "item": PAGE_URL,
          },
        ],
      },
    ],
  };
}
