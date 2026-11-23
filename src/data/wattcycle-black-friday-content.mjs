/**
 * Content + schema for /wattcycle-black-friday.
 *
 * WHY THIS PAGE EXISTS
 * "wattcycle black friday" is its own search, separate from "wattcycle coupon
 * code" (which /partners/wattcycle targets). The angle mirrors the Signature
 * Solar Black Friday page: DWELLINGS STACKS on top of Black Friday sale prices.
 * Justin confirmed it at checkout on 2026-11-24 on four sale items; the 48V
 * server rack checkout screenshot is published on the page as proof.
 *
 * EVERGREEN BY DESIGN
 * No year in the URL. Each November, update WC_BLACK_FRIDAY below (year, sale
 * window, deals, dates). Nothing else needs to change.
 *
 * NEVER INVENT DEALS
 * Every deal row is a real WattCycle listing with the "was" (WattCycle's own
 * compare-at price) and sale price read from wattcycle.com, and the code
 * tested at checkout on that item. Re-check prices before each update; they
 * move during the sale.
 *
 * Plain ESM, no JSX: scripts/prerender-seo.js imports this in Node.
 */
import { SITE_URL, AUTHOR } from "./signature-solar-content.mjs";

export const WC_COUPON_CODE = "DWELLINGS";
export const WC_DISCOUNT_PCT = 8;
export const WC_AFFILIATE_URL = "https://www.wattcycle.com/?ref=mobiledwellings";
export const WC_BF_PATH = "/wattcycle-black-friday";
export const WC_BF_URL = `${SITE_URL}${WC_BF_PATH}`;
export const WC_PARTNER_PATH = "/partners/wattcycle";
export const WC_PROOF_IMAGE = "/wattcycle-black-friday-dwellings-checkout.jpg";
export const WC_OG_IMAGE = `${SITE_URL}/wattcycle-12v-314ah-battery.jpg`;

/** Affiliate link to a product page (WattCycle's ref param works on any URL). */
export function wcProductUrl(handle) {
  return `https://www.wattcycle.com/products/${handle}?ref=mobiledwellings`;
}

export const WC_BLACK_FRIDAY = {
  year: 2026,
  blackFriday: "November 27, 2026",
  cyberMonday: "November 30, 2026",
  /** From WattCycle's own Black Friday post. */
  saleWindow: "November 6 through December 1, 2026",
  saleEnd: "December 1, 2026",
  saleEndIso: "2026-12-01",
  /** When Justin last ran DWELLINGS through checkout on these sale items. */
  verified: "November 24, 2026",
  verifiedIso: "2026-11-24",
  published: "2026-11-24",
  updated: "2026-11-24",
  /**
   * Real listings only. `was` is WattCycle's listed regular (compare-at)
   * price, `sale` the Black Friday price, both read from wattcycle.com on the
   * verified date. `kwh` is nominal capacity (volts × amp-hours × packs).
   * `image` is WattCycle's own main product photo, resized into /public.
   */
  deals: [
    {
      name: "WattCycle 12V 314Ah Ultra Bluetooth (300A BMS)",
      short: "12V 314Ah Ultra",
      handle: "12v-314ah-ultra-lithium-battery",
      image: "/wattcycle-bf-12v-314ah-ultra.jpg",
      imageAlt: "WattCycle 12V 314Ah Ultra LiFePO4 battery with Smart Bluetooth and a 300A BMS, next to a phone showing the battery app.",
      pack: "1 battery",
      kwh: 4.02,
      was: 729.99,
      sale: 599.99,
      note: "The pick for most van and skoolie banks: 4 kWh with a 300A BMS, so it runs a 3000W inverter on its own.",
    },
    {
      name: "WattCycle 12V 392Ah Mini Bluetooth, Self-Heating (2 Pack)",
      short: "12V 392Ah Mini, 2 Pack",
      handle: "12v-392ah-mini-lifepo-rv-battery-bluetooth-ai-monitoring-self-heating",
      image: "/wattcycle-bf-12v-392ah-mini.jpg",
      imageAlt: "WattCycle 12V 392Ah Mini PRO LiFePO4 battery with active balancing, Smart Bluetooth and low-temp cutoff, next to its phone app.",
      pack: "2 batteries",
      kwh: 10.04,
      was: 2298.99,
      sale: 1599.99,
      note: "Over 10 kWh with self-heating, so it can charge below freezing. Built for four-season rigs.",
    },
    {
      name: "WattCycle 24V 314Ah Ultra Bluetooth (300A BMS)",
      short: "24V 314Ah Ultra",
      handle: "24v-300ah-lithium-battery-with-bluetooth",
      image: "/wattcycle-bf-24v-314ah-ultra.jpg",
      imageAlt: "WattCycle 25.6V 314Ah Ultra LiFePO4 battery with Smart Bluetooth and a 300A BMS, next to a phone showing the battery app.",
      pack: "1 battery",
      kwh: 8.04,
      was: 1999.99,
      sale: 1299.99,
      note: "8 kWh in a single 24V battery. One box instead of a parallel bank for a 24V system.",
    },
    {
      name: "WattCycle V2.5 48V 100Ah Server Rack (Pre-Order)",
      short: "48V 100Ah Server Rack V2.5",
      handle: "48v-100ah-server-racks-bluetooth-lithium-battery",
      image: "/wattcycle-bf-48v-100ah-server-rack.jpg",
      imageAlt: "WattCycle V2.5 51.2V 100Ah 5120Wh server rack battery with an LCD touchscreen, 3A active balancing, Bluetooth and Victron communication.",
      pack: "1 battery",
      kwh: 5.12,
      was: 1599.99,
      sale: 829.99,
      note: "The budget alternative to an EG4 LifePower4 for 48V systems. A pre-order, so check the ship date at checkout.",
    },
  ],
};

/**
 * What DWELLINGS takes off, matching WattCycle's checkout: 8% of the price,
 * rounded DOWN to the cent ($829.99 → $66.39 off, as shown at checkout).
 */
export function wcCodeSavings(price) {
  return Math.floor(Math.round(price * 100) * WC_DISCOUNT_PCT / 100) / 100;
}

export function wcFinalPrice(price) {
  return Math.round((price - wcCodeSavings(price)) * 100) / 100;
}

export function wcPerKwh(deal) {
  return Math.round(wcFinalPrice(deal.sale) / deal.kwh);
}

export function wcMoney(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** True through the last day of WattCycle's sale. */
export function wcBfIsLive(todayIso = new Date().toISOString().slice(0, 10)) {
  return todayIso <= WC_BLACK_FRIDAY.saleEndIso;
}

export function wcBfHeadline() {
  return `WattCycle Black Friday ${WC_BLACK_FRIDAY.year}: Code ${WC_COUPON_CODE} Takes Another ${WC_DISCOUNT_PCT}% Off Sale Prices`;
}

/** The direct, quotable answer. */
export function wcBfAnswer() {
  return `WattCycle's Black Friday sale runs ${WC_BLACK_FRIDAY.saleWindow}, and code ${WC_COUPON_CODE} takes another ${WC_DISCOUNT_PCT}% off on top of the sale price. We tested it at checkout on ${WC_BLACK_FRIDAY.verified} and it stacked on every sale battery we tried.`;
}

/** Under ~155 characters. */
export function wcBfDescription() {
  return `WattCycle Black Friday ${WC_BLACK_FRIDAY.year}: code ${WC_COUPON_CODE} stacks ${WC_DISCOUNT_PCT}% off on top of sale prices. Tested at checkout, with the real before and after prices.`;
}

export const WC_BF_STEPS = [
  {
    title: "Add the sale battery to your cart",
    body: "Shop at wattcycle.com while the sale is running. The Black Friday price is already applied to the item.",
  },
  {
    title: `Enter ${WC_COUPON_CODE} at checkout`,
    body: `Type ${WC_COUPON_CODE} in the discount code box and hit Apply. It takes ${WC_DISCOUNT_PCT}% off the whole order, on top of the sale price. There's no minimum.`,
  },
  {
    title: "Check the order before you pay",
    body: "Our test orders all shipped free. Shipping Protection is an optional add-on WattCycle offers at checkout. Pre-order items show their ship date on the product page.",
  },
];

export function wcBfFaq() {
  const y = WC_BLACK_FRIDAY.year;
  return [
    {
      question: `Does ${WC_COUPON_CODE} work during WattCycle's Black Friday sale?`,
      answer: `Yes. We ran ${WC_COUPON_CODE} through checkout on ${WC_BLACK_FRIDAY.verified} on four Black Friday sale batteries, and it took ${WC_DISCOUNT_PCT}% off every order on top of the sale price.`,
    },
    {
      question: `How much does ${WC_COUPON_CODE} save on a Black Friday order?`,
      answer: `${WC_DISCOUNT_PCT}% of the order. On a 12V 314Ah Ultra plus a 12V 392Ah Mini 2 Pack ($2,199.98 at sale prices), it took off $175.99.`,
    },
    {
      question: `When is WattCycle's Black Friday ${y} sale?`,
      answer: `WattCycle's sale runs ${WC_BLACK_FRIDAY.saleWindow}, covering Black Friday (${WC_BLACK_FRIDAY.blackFriday}) and Cyber Monday (${WC_BLACK_FRIDAY.cyberMonday}).`,
    },
    {
      question: `Is there a minimum order for ${WC_COUPON_CODE}?`,
      answer: `No. ${WC_COUPON_CODE} takes ${WC_DISCOUNT_PCT}% off sitewide with no minimum order.`,
    },
    {
      question: "Are the \"was\" prices real?",
      answer: "They're WattCycle's own listed regular prices. Some are higher than what the battery usually sells for outside a sale, so we also show the price per kWh after the code. That's the fairest way to compare one battery to another.",
    },
  ];
}

export function buildWattCycleBlackFridaySchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": WC_BF_URL,
        "url": WC_BF_URL,
        "mainEntityOfPage": WC_BF_URL,
        "headline": wcBfHeadline(),
        "description": wcBfDescription(),
        "image": WC_OG_IMAGE,
        "inLanguage": "en-US",
        "datePublished": WC_BLACK_FRIDAY.published,
        "dateModified": WC_BLACK_FRIDAY.updated,
        "author": { "@id": `${SITE_URL}/#justin` },
        "publisher": { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#justin`,
        "name": AUTHOR.name,
        "jobTitle": AUTHOR.role,
        "url": `${SITE_URL}/about`,
      },
      {
        "@type": "FAQPage",
        "@id": `${WC_BF_URL}#faq`,
        "mainEntity": wcBfFaq().map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "WattCycle", "item": `${SITE_URL}${WC_PARTNER_PATH}` },
          { "@type": "ListItem", "position": 3, "name": "WattCycle Black Friday", "item": WC_BF_URL },
        ],
      },
    ],
  };
}
