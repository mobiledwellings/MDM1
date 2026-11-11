/**
 * Content + schema for /signature-solar-black-friday.
 *
 * WHY THIS PAGE EXISTS
 * "Signature Solar Black Friday sale" is a different search from "signature
 * solar coupon code", and Google surfaces it as a related query. Targeting it
 * on its own page captures that demand without touching the coupon page, which
 * just regained the top spot in the AI Overview.
 *
 * The angle is the one thing this site can say that competitors don't: the
 * code STACKS with sale pricing. Google's AI Overview has claimed Signature
 * Solar "shifted away from static text codes", ChatGPT cited codes as not
 * combining with sale prices, and a competing affiliate tells readers the link
 * "takes pricing authority over manual coupon codes". Justin confirmed at
 * checkout that the code applies on top of sale prices.
 *
 * EVERGREEN BY DESIGN
 * The URL carries no year so authority accumulates across Novembers. Each
 * year, update BLACK_FRIDAY below — year, dates, and (once announced) the real
 * sale window and deals. Nothing else on the page needs to change.
 *
 * NEVER INVENT DEALS
 * `deals` stays empty until Signature Solar actually announces them. The page
 * renders an honest "not announced yet" state in the meantime.
 *
 * Plain ESM, no JSX — scripts/prerender-seo.js imports this in Node.
 */
import {
  COUPON_CODE,
  AFFILIATE_URL,
  SITE_URL,
  AUTHOR,
} from "./signature-solar-content.mjs";

export const BF_PATH = "/signature-solar-black-friday";
export const BF_URL = `${SITE_URL}${BF_PATH}`;
export { COUPON_CODE, AFFILIATE_URL };

export const BLACK_FRIDAY = {
  year: 2026,
  thanksgiving: "November 26, 2026",
  blackFriday: "November 27, 2026",
  blackFridayIso: "2026-11-27",
  cyberMonday: "November 30, 2026",
  cyberMondayIso: "2026-11-30",
  /**
   * Our expectation until Signature Solar announces: early deals the Friday a
   * week before Black Friday, running through Cyber Monday. Shown as
   * "expected", never as announced. Replaced by `saleWindow` once announced.
   */
  expectedStart: "November 20",
  expectedStartIso: "2026-11-20",
  /** Set true and fill `saleWindow` once Signature Solar announces dates. */
  saleAnnounced: false,
  /** e.g. "November 20 – December 1, 2026" — only from Signature Solar. */
  saleWindow: null,
  /**
   * Real, announced deals only: { item, detail }.
   * Leave empty until Signature Solar publishes them.
   */
  deals: [],
  /** First published, and last time this page's content was updated. */
  published: "2026-11-11",
  updated: "2026-11-11",
};

/**
 * True from now through Cyber Monday. Gates the dated Black Friday note on the
 * coupon page, so it drops off on the first build after the sale ends (the
 * monthly re-verify push rebuilds the site) instead of going stale.
 */
export function bfIsUpcoming(todayIso = new Date().toISOString().slice(0, 10)) {
  return todayIso <= BLACK_FRIDAY.cyberMondayIso;
}

/** The dated note shown on /signature-solar-coupon while Black Friday is upcoming. */
export function bfCouponPageNote() {
  const when = BLACK_FRIDAY.saleAnnounced && BLACK_FRIDAY.saleWindow
    ? `Signature Solar's sale runs ${BLACK_FRIDAY.saleWindow}.`
    : `Signature Solar's sale is expected to run ${bfExpectedWindow()}.`;
  return `${when} ${COUPON_CODE} stacks on top of Black Friday sale prices for another $50 off.`;
}

export function bfHeadline() {
  return `Signature Solar Black Friday ${BLACK_FRIDAY.year}: Stack ${COUPON_CODE} on Top of Sale Prices`;
}

/**
 * The direct answer, written to be quotable by an AI Overview: what the sale
 * is, the one fact competitors get wrong (the code stacks), and the date.
 */
export function bfAnswer() {
  return `Signature Solar's Black Friday sale cuts prices on the gear itself, and ${COUPON_CODE} takes another $50 off on top. The code stacks with sale pricing. ${bfWhen()}`;
}

/** Expected window in prose: "November 20 through Cyber Monday, November 30, 2026". */
export function bfExpectedWindow() {
  return `${BLACK_FRIDAY.expectedStart} through Cyber Monday, ${BLACK_FRIDAY.cyberMonday}`;
}

/** One sentence on timing — the announced window if we have it, else the expected one. */
export function bfWhen() {
  return BLACK_FRIDAY.saleAnnounced && BLACK_FRIDAY.saleWindow
    ? `The ${BLACK_FRIDAY.year} sale runs ${BLACK_FRIDAY.saleWindow}.`
    : `Expect early deals the week before Black Friday, running ${bfExpectedWindow()}.`;
}

/** Under ~155 characters so Google doesn't truncate it. */
export function bfDescription() {
  return `Signature Solar Black Friday ${BLACK_FRIDAY.year}: code ${COUPON_CODE} stacks on top of sale prices for another $50 off. Dates, how to stack it, and what to buy.`;
}

export function bfSaleStatus() {
  return BLACK_FRIDAY.saleAnnounced && BLACK_FRIDAY.saleWindow
    ? `Signature Solar's ${BLACK_FRIDAY.year} Black Friday sale runs ${BLACK_FRIDAY.saleWindow}.`
    : `Signature Solar hasn't announced its ${BLACK_FRIDAY.year} Black Friday dates or deals yet. We expect the sale to start the week before Black Friday and run ${bfExpectedWindow()}. We'll confirm the dates, list the deals here as soon as they're live, and re-test ${COUPON_CODE} on actual sale items.`;
}

export const BF_STEPS = [
  {
    title: "Plan your build before the sale",
    body: "Know your parts and quantities ahead of time. Popular batteries and inverters can sell out once Black Friday pricing goes live.",
  },
  {
    title: "Add the sale items to your cart",
    body: "Shop at signaturesolar.com while the sale is running, so the sale price is already applied in your cart.",
  },
  {
    title: `Enter ${COUPON_CODE} at checkout`,
    body: `${COUPON_CODE} takes $50 off on top of the sale price. Signature Solar's checkout takes one code per order.`,
  },
  {
    title: "Check shipping before you pay",
    body: "Batteries, inverters and panel pallets ship freight. Confirm the shipping cost or any free-shipping offer on your order before you complete checkout.",
  },
];

export function bfFaq({ lastVerified }) {
  return [
    {
      question: `Does ${COUPON_CODE} work during Signature Solar's Black Friday sale?`,
      answer: `Yes. ${COUPON_CODE} applies at checkout during Signature Solar's sale events. We last verified it on ${lastVerified}, and we'll re-test it on actual Black Friday sale items when the sale goes live.`,
    },
    {
      question: `Does ${COUPON_CODE} stack with Black Friday sale prices?`,
      answer: `Yes. ${COUPON_CODE} takes $50 off on top of the sale price, so you get both. It doesn't combine with a second discount code, because Signature Solar's checkout accepts one code per order.`,
    },
    {
      question: "When is Signature Solar's Black Friday sale?",
      answer: BLACK_FRIDAY.saleAnnounced && BLACK_FRIDAY.saleWindow
        ? bfSaleStatus()
        : `Signature Solar hasn't announced ${BLACK_FRIDAY.year} dates yet. We expect early deals the week before Black Friday, running ${bfExpectedWindow()}. Black Friday itself is ${BLACK_FRIDAY.blackFriday}.`,
    },
    {
      question: `Is there a minimum order for ${COUPON_CODE}?`,
      answer: `Signature Solar's $50 codes, ${COUPON_CODE} included, apply to orders of $500 or more.`,
    },
    {
      question: "Is Black Friday the best time to buy from Signature Solar?",
      answer: `It's usually Signature Solar's biggest sale event of the year. If your build can wait, it's the one to wait for, and ${COUPON_CODE} adds another $50 on top of the sale price.`,
    },
  ];
}

export function buildBlackFridaySchema({ lastVerified }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": BF_URL,
        "url": BF_URL,
        "mainEntityOfPage": BF_URL,
        "headline": bfHeadline(),
        "description": bfDescription(),
        "image": `${SITE_URL}/og-signature-solar.png`,
        "inLanguage": "en-US",
        "datePublished": BLACK_FRIDAY.published,
        "dateModified": BLACK_FRIDAY.updated,
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
        "@id": `${BF_URL}#faq`,
        "mainEntity": bfFaq({ lastVerified }).map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Deals", "item": `${SITE_URL}/deals` },
          { "@type": "ListItem", "position": 3, "name": "Signature Solar Black Friday", "item": BF_URL },
        ],
      },
    ],
  };
}
