import { useState } from "react";
import { Link } from "react-router-dom";
import { HiCheck, HiClipboardCopy } from "react-icons/hi";
import {
  SIGNATURE_SOLAR_LAST_VERIFIED,
  SIGNATURE_SOLAR_LAST_VERIFIED_DATE,
} from "../data/coupon-verification";
import { verifiedMonthLabel, buildFastFacts } from "../data/signature-solar-content.mjs";

/**
 * The coupon block at the top of /deals.
 *
 * Split out of DealsPage for one reason: it has no router hooks, no context,
 * and no async data, so Node can render it to a string at build time.
 * scripts/prerender-seo.js does exactly that and bakes the result into
 * build/deals.html, which is how a crawler that never runs JavaScript still
 * reads MD50OFF and DWELLINGS.
 *
 * The rest of DealsPage can't be prerendered — the product catalog comes from
 * DealsContext asynchronously, and the page uses useSearchParams and useAdmin.
 * That's fine: the catalog doesn't carry a code. This block does.
 *
 * Keep it free of router hooks and context. <Link> is fine (the prerenderer
 * wraps this in a StaticRouter), but useSearchParams/useDeals/useAdmin are not.
 */

const BRAND_INK = "#171717"; // Dark ink for text sitting on a light brand color.

type CouponOffer = {
  /** Partner name shown as the card heading. */
  brand: string;
  /** Short positioning line under the brand name. */
  kicker: string;
  code: string;
  /** Affiliate URL — the primary CTA target. */
  url: string;
  ctaLabel: string;
  /** Sentence describing the discount and what it covers. */
  blurb: string;
  /** Fine print under the CTAs. */
  finePrint: string;
  /** Optional "last checked" stamp. Human-readable + ISO for <time>. Omitted
   *  for partners whose codes we don't re-check on a cadence. */
  verifiedOn?: string;
  verifiedOnIso?: string;
  /** Optional internal link to a full details page. Omitted for partners
   *  without a published page (WattCycle is still in DRAFT_PARTNERS). */
  detailsHref?: string;
  /** Ticket background. Kept dark/saturated in both themes so the brand color
   *  can run at full strength instead of being muted for light mode. */
  ticketBg: string;
  /** Code text on the ticket — must contrast against ticketBg. */
  codeColor: string;
  /** Primary (copy) button fill and its text color. */
  buttonBg: string;
  buttonInk: string;
  /** DOM id for the code text, used by the clipboard selection fallback. */
  elementId: string;
};

const SIGNATURE_SOLAR_OFFER: CouponOffer = {
  brand: "Signature Solar",
  kicker: "Our pick for inverters, batteries and solar panels",
  code: "MD50OFF",
  url: "https://signaturesolar.com/?ref=mobiledwellings",
  ctaLabel: "Shop Signature Solar →",
  // The $500 floor lives in finePrint, not here. This blurb is the most
  // quotable line on the page — it sits beside the code and is the first thing
  // an extractor reaches — and every competing Signature Solar code carries the
  // same floor without publishing it. Leading with it made an identical offer
  // read as more restricted, which is what Google's AI Overview echoed back.
  // Still disclosed below, where terms belong. Matches the coupon page, which
  // previously said "works on its own at checkout" while this card said
  // "orders over $500" — same offer, two framings, on one site.
  blurb:
    "$50 off sitewide, stacks with sales and free shipping promotions.",
  finePrint: "Apply at checkout on signaturesolar.com. Works on most products sitewide. $500 order minimum.",
  // Shared with the /signature-solar-coupon page so the two dates can't drift.
  // Both are re-stamped by `npm run verify-coupon`.
  verifiedOn: SIGNATURE_SOLAR_LAST_VERIFIED,
  verifiedOnIso: SIGNATURE_SOLAR_LAST_VERIFIED_DATE,
  detailsHref: "/signature-solar-coupon",
  ticketBg: BRAND_INK,
  codeColor: "#ffde5a", // Mobile Dwellings logo yellow (Header.tsx)
  buttonBg: "#ffde5a",
  buttonInk: BRAND_INK,
  elementId: "signature-solar-coupon-code",
};

// Signature Solar only. WattCycle used to sit beside it here, but that turned
// /deals from a Signature Solar coupon page into a two-brand page on Aug 14 —
// the change that immediately precedes a ~40% drop in daily orders. DWELLINGS
// now lives on /partners/wattcycle, which targets "wattcycle coupon code"
// without competing with this page for "signature solar coupon code".
const COUPON_OFFERS: CouponOffer[] = [SIGNATURE_SOLAR_OFFER];

/**
 * Copy state for one coupon code, shared by that card's ticket and its copy
 * button so clicking either surface copies and both show "Copied!".
 */
function useCopyCode(code: string, elementId: string) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // The Clipboard API rejects on non-secure origins, when permission is
      // denied, and in some in-app browsers. Select the code instead so the
      // buyer can still copy it manually rather than getting no response.
      // The ticket is `select-none` so ordinary clicks never leave text
      // highlighted; re-enable selection on this element for the fallback only.
      const el = document.getElementById(elementId);
      const selection = window.getSelection();
      if (el && selection) {
        el.style.userSelect = "text";
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return { copied, copy };
}

/**
 * One partner coupon card: click-to-copy ticket, copy button, and a direct
 * affiliate CTA. Rendered side by side on desktop, stacked on mobile.
 */
function CouponCard({ offer }: { offer: CouponOffer }) {
  const { copied, copy } = useCopyCode(offer.code, offer.elementId);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center flex flex-col">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{offer.brand}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">{offer.kicker}</p>

      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${offer.brand} coupon code ${offer.code}`}
        title="Click to copy"
        className="flex flex-wrap items-center justify-center gap-3 border-2 border-dashed rounded-lg px-4 py-4 mb-6 select-none transition-opacity hover:opacity-90"
        style={{ backgroundColor: offer.ticketBg, borderColor: offer.codeColor }}
      >
        <span
          className="text-xs uppercase"
          style={{ letterSpacing: "0.18em", color: offer.codeColor, opacity: 0.7 }}
        >
          {copied ? "Copied" : "Code"}
        </span>
        <span
          id={offer.elementId}
          className="font-mono font-bold leading-none"
          style={{
            color: offer.codeColor,
            fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
            letterSpacing: "0.06em",
          }}
        >
          {offer.code}
        </span>
      </button>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={copy}
          aria-label={`Copy coupon code ${offer.code}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-opacity hover:opacity-90"
          // border-transparent is absent from the compiled stylesheet; the
          // inline color keeps this the same height as the outlined CTA.
          style={{ backgroundColor: offer.buttonBg, color: offer.buttonInk, borderColor: "transparent" }}
        >
          {copied ? (
            <>
              <HiCheck className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <HiClipboardCopy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border-2 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {offer.ctaLabel}
        </a>
      </div>

      {offer.verifiedOn && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          ✓ Code verified working{" "}
          <time dateTime={offer.verifiedOnIso} className="font-semibold">
            {offer.verifiedOn}
          </time>
        </p>
      )}

      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">{offer.blurb}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-auto">
        {offer.finePrint}
        {offer.detailsHref && (
          <>
            {" "}
            <Link
              to={offer.detailsHref}
              className="underline hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Full details &amp; FAQ →
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export function DealsCouponHero() {
  return (
    <>
                {/* Search-intent header: buyers arriving from "signature solar
                    coupon code" see the code itself as the largest text on the
                    page, above the fold, before any other copy.

                    The code is repeated here and in the ticket below. An earlier
                    revision kept it out of the H1 to avoid two focal points
                    ~120px apart, but conversions here are attributed by code
                    rather than by click — a reader who never visits still earns
                    the commission if they can read MD50OFF — so exposure in the
                    most extractable element on the page outweighs the visual
                    redundancy.

                    "Works Sitewide" states scope as a benefit. The $500 floor
                    stays in the card's fine print: every competing Signature
                    Solar code carries the same one unpublished, and leading with
                    it made an identical offer read as more restricted.

                    The month is derived from the verification stamp, never
                    hardcoded, so `npm run verify-coupon` moves it and it can't
                    drift into claiming a currency the page no longer has. */}
                <h1 className="text-center mb-8 dark:text-white text-3xl md:text-4xl font-bold text-neutral-800">
                  Signature Solar Coupon Code {SIGNATURE_SOLAR_OFFER.code} – Works Sitewide,
                  Verified {verifiedMonthLabel(SIGNATURE_SOLAR_LAST_VERIFIED_DATE)}
                </h1>

                {/* Partner coupons — side by side on desktop, stacked on
                    mobile. Grid items stretch to equal height by default, so no
                    items-stretch/h-full needed (neither exists in the compiled
                    stylesheet anyway). */}
                <div className="max-w-2xl mx-auto mb-8">
                  {COUPON_OFFERS.map((offer) => (
                    <CouponCard key={offer.code} offer={offer} />
                  ))}
                </div>

                {/* At-a-glance spec block, mirroring the one on
                    /signature-solar-coupon. The card above states the same
                    facts, but only as prose and visual design — a <dl> gives a
                    model delimited label/value pairs instead of something it has
                    to parse out of a sentence.

                    Both pages read from buildFastFacts() in the shared module,
                    so whichever one Google decides to rank, the extracted facts
                    are identical and can't drift apart. The $500 floor is
                    deliberately not a row here either; it stays in the card's
                    fine print. */}
                <div className="max-w-2xl mx-auto mb-8">
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {SIGNATURE_SOLAR_OFFER.code} at a Glance
                  </h2>
                  {/* Two-up grid rather than six stacked rows: this block exists
                      to give a model delimited label/value pairs, so it needs to
                      stay in the DOM and stay visible — hiding it (display:none,
                      sr-only, or a collapsed <details>) risks both a spam signal
                      and extractors that skip non-visible text. Density is the
                      safe lever. auto-fit collapses it to one column on narrow
                      screens with no media query. */}
                  <dl
                    className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden text-left"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
                      margin: 0,
                    }}
                  >
                    {buildFastFacts({
                      lastVerified: SIGNATURE_SOLAR_LAST_VERIFIED,
                      lastVerifiedDate: SIGNATURE_SOLAR_LAST_VERIFIED_DATE,
                    }).map((fact) => (
                      <div
                        key={fact.label}
                        className="border-t border-neutral-200 dark:border-neutral-700"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          columnGap: "0.5rem",
                          padding: "0.375rem 0.75rem",
                        }}
                      >
                        <dt
                          className="text-neutral-500 dark:text-neutral-400"
                          style={{
                            flex: "0 0 6.5rem",
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            lineHeight: 1.7,
                          }}
                        >
                          {fact.label}
                        </dt>
                        <dd
                          className="text-neutral-700 dark:text-neutral-300"
                          style={{
                            flex: "1 1 8rem",
                            margin: 0,
                            fontSize: "0.8125rem",
                            lineHeight: 1.5,
                            fontWeight: fact.isCode ? 700 : 400,
                          }}
                        >
                          {fact.iso ? (
                            <time dateTime={fact.iso}>{fact.value}</time>
                          ) : (
                            fact.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <h2 className="text-center mb-4 dark:text-white text-2xl font-bold text-neutral-800">
                  The Mobile Dwellings Gear Shop
                </h2>
                <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-4">
                  Inverters, batteries, solar, and more — tested in real skoolie and overland builds.
                </p>
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto mb-8">
                  Affiliate links support the channel at no extra cost to you. Updated regularly with new deals.
                </p>
    </>
  );
}
