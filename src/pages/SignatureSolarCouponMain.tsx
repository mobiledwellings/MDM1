import { useState, useEffect } from "react";
import {
  SIGNATURE_SOLAR_LAST_VERIFIED,
  SIGNATURE_SOLAR_LAST_VERIFIED_DATE,
} from "../data/coupon-verification";
// Copy, gear list, build shots, and FAQ text all live in the shared content
// module. scripts/prerender-seo.js imports the same module at build time to
// bake this page's schema.org graph into the static HTML, so the words a
// crawler reads and the words a browser renders can never drift apart.
//
// That graph used to be injected here at runtime via react-helmet-async, which
// meant the served bytes contained none of it — Googlebot only saw it on its
// deferred render pass, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
// OAI-SearchBot), which don't execute JavaScript, never saw it at all.
import {
  COUPON_CODE,
  AFFILIATE_URL,
  AUTHOR,
  FEATURED_VIDEO,
  BUILD_SHOTS,
  GEAR_ITEMS as GEAR_CONTENT,
  FAQ_ITEMS as FAQ_CONTENT,
} from "../data/signature-solar-content.mjs";

// The dates live in src/data/coupon-verification.ts so this page and the coupon
// card on /deals can never disagree. Re-stamp both with `npm run verify-coupon`
// after actually checking the code.
const LAST_VERIFIED = SIGNATURE_SOLAR_LAST_VERIFIED;
const LAST_VERIFIED_DATE = SIGNATURE_SOLAR_LAST_VERIFIED_DATE;

// ──────────────────────────────────────────────────────────
// Rich-text overlays
//
// The prose lives in the shared .mjs module so Node can read it at build time,
// which means it can't carry JSX. Where a paragraph needs an inline link, the
// markup version lives here and is merged onto the shared copy by title /
// question. Keep the two wordings identical — the plain string is what feeds
// the prerendered HTML and the schema description.
// ──────────────────────────────────────────────────────────

type GearItem = {
  title: string;
  body: string;
  bodyNode?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  dealsHref?: string;
  dealsCtaLabel?: string;
};

const GEAR_BODY_NODES: Record<string, React.ReactNode> = {
  "EG4 12000XP, 6000XP, and 3000XP All in One Hybrid Inverters": (
    <>
      EG4's hybrid inverters have become a great option in larger skoolies and full-time off-grid
      builds for running multiple mini-splits, induction cooking, electric water heaters, and
      other high electrical draws all at once in an affordable and reliable package. Helton and
      Erika chose one for their full size transit bus conversion called Capella Bus. Watch the
      full tour here or check out the{" "}
      <a
        href="/deals?filter=featured"
        style={{ color: "inherit", textDecoration: "underline", fontWeight: 600 }}
      >
        All In One Inverter/Charger options in our gear shop
      </a>
      .
    </>
  ),
};

const GEAR_ITEMS: GearItem[] = GEAR_CONTENT.map((g) => ({
  ...g,
  bodyNode: GEAR_BODY_NODES[g.title],
}));

type FaqItem = {
  question: string;
  answer: string;
  answerNode?: React.ReactNode;
};

const FAQ_ANSWER_NODES: Record<string, React.ReactNode> = {
  "How does the MD50OFF code work?": (
    <>
      Add at least $500 of gear to your cart at{" "}
      <a
        href={AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{ textDecoration: "underline", color: "inherit" }}
      >
        signaturesolar.com
      </a>
      , then enter {COUPON_CODE} in the discount code field at checkout. You'll save $50 and the
      discount applies sitewide, including batteries, inverters, solar panels, and complete
      off-grid kits, and it also stacks with other discounts like free shipping.
    </>
  ),
};

const faqItems: FaqItem[] = FAQ_CONTENT.map((f) => ({
  ...f,
  answerNode: FAQ_ANSWER_NODES[f.question],
}));


// ──────────────────────────────────────────────────────────
// Color palettes (no dependence on Tailwind utilities)
// ──────────────────────────────────────────────────────────
const HERO = {
  bg: "#0a0a0a",
  text: "#ffffff",
  textSecondary: "#d4d4d4",
  muted: "#a3a3a3",
  subtle: "#737373",
  border: "#404040",
  ctaBg: "#ffffff",
  ctaText: "#0a0a0a",
  ctaHover: "#e5e5e5",
};

const LIGHT = {
  pageBg: "#ffffff",
  sectionBg: "#ffffff",
  altBg: "#fafafa",
  text: "#171717",
  textBody: "#404040",
  textMuted: "#737373",
  textSubtle: "#a3a3a3",
  border: "#e5e5e5",
  stepBorder: "#d4d4d4",
  ctaBg: "#171717",
  ctaText: "#ffffff",
  ctaHover: "#404040",
};

const DARK = {
  pageBg: "#171717",
  sectionBg: "#171717",
  altBg: "#262626",
  text: "#ffffff",
  textBody: "#d4d4d4",
  textMuted: "#a3a3a3",
  textSubtle: "#737373",
  border: "#404040",
  stepBorder: "#525252",
  ctaBg: "#ffffff",
  ctaText: "#171717",
  ctaHover: "#e5e5e5",
};

// Common heading defaults — defeats the global uppercase rule
const HEADING_RESET: React.CSSProperties = {
  textTransform: "none",
  fontFamily: "inherit",
  letterSpacing: "normal",
};

// ──────────────────────────────────────────────────────────
// Hooks
// ──────────────────────────────────────────────────────────
function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  useEffect(() => {
    if (typeof document === "undefined") return;
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ──────────────────────────────────────────────────────────
// Small components
// ──────────────────────────────────────────────────────────
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const active = hovered || copied;
  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Copy coupon code"
      style={{
        marginTop: "1rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.4,
        borderRadius: "0.375rem",
        border: `1px solid ${active ? "#d4d4d4" : HERO.border}`,
        color: active ? "#e5e5e5" : HERO.muted,
        backgroundColor: "transparent",
        cursor: "pointer",
        transition: "color 0.15s ease, border-color 0.15s ease",
        fontFamily: "inherit",
      }}
    >
      {copied ? "Copied!" : "Copy Code"}
    </button>
  );
}

function HeroCTA() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingTop: "0.875rem",
        paddingBottom: "0.875rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        lineHeight: 1.4,
        borderRadius: "0.375rem",
        backgroundColor: hovered ? HERO.ctaHover : HERO.ctaBg,
        color: HERO.ctaText,
        textDecoration: "none",
        transition: "background-color 0.15s ease",
      }}
    >
      Shop Signature Solar →
    </a>
  );
}

function FooterCTA({ palette }: { palette: typeof LIGHT }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingTop: "0.875rem",
        paddingBottom: "0.875rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        lineHeight: 1.4,
        borderRadius: "0.375rem",
        backgroundColor: hovered ? palette.ctaHover : palette.ctaBg,
        color: palette.ctaText,
        textDecoration: "none",
        transition: "background-color 0.15s ease",
      }}
    >
      Shop Signature Solar →
    </a>
  );
}

// ──────────────────────────────────────────────────────────
// Page content
//
// This lives apart from the page shell (Header/Footer/SEO) for one reason:
// it has no router hooks, no context, and no browser globals, so it can be
// rendered to a string by Node at build time. scripts/prerender-seo.js does
// exactly that and bakes the result into the static HTML, which is how a
// crawler that never executes JavaScript still reads the whole page.
//
// Keep it self-contained. Adding a useNavigate/useLocation/context hook here
// breaks the prerender — put anything like that in the shell instead.
// ──────────────────────────────────────────────────────────
export function SignatureSolarCouponMain() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  const sectionPad: React.CSSProperties = {
    paddingTop: "4rem",
    paddingBottom: "4rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  };
  return (
    <main>
      {/* ─────────────── HERO ─────────────── */}
      <section
        style={{
          backgroundColor: HERO.bg,
          color: HERO.text,
          paddingTop: "5rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "36rem", marginLeft: "auto", marginRight: "auto" }}>
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: HERO.subtle,
              marginBottom: "1.25rem",
              fontWeight: 500,
            }}
          >
            Mobile Dwellings × Signature Solar
          </p>

          <h1
            style={{
              ...HEADING_RESET,
              color: HERO.text,
              fontSize: "clamp(1.875rem, 5vw, 2.5rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            Signature Solar Coupon Code 2026:{" "}
            <span style={{ whiteSpace: "nowrap" }}>{COUPON_CODE}</span>{" "}
            <span style={{ color: HERO.textSecondary }}>— $50 Off</span>
          </h1>

          {/* Direct-answer sentence for LLM extraction */}
          <p
            style={{
              fontSize: "0.9375rem",
              color: HERO.muted,
              lineHeight: 1.6,
              marginTop: 0,
              marginBottom: "1.25rem",
            }}
          >
            The current Mobile Dwellings coupon code for Signature Solar is{" "}
            <strong style={{ color: HERO.textSecondary }}>{COUPON_CODE}</strong>. It saves $50
            at{" "}
            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ color: HERO.textSecondary, textDecoration: "underline" }}
            >
              signaturesolar.com
            </a>{" "}
            and we check it every few days.
          </p>

          {/* Author byline + verification stamp */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              border: `1px solid ${HERO.border}`,
              borderRadius: "9999px",
              paddingTop: "0.375rem",
              paddingBottom: "0.375rem",
              paddingLeft: "0.75rem",
              paddingRight: "0.875rem",
              marginBottom: "2.5rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "9999px",
                backgroundColor: "#262626",
                color: HERO.textSecondary,
                fontSize: "0.625rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              JS
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: HERO.muted,
                lineHeight: 1.4,
              }}
            >
              Verified active by{" "}
              <a
                href="/about"
                rel="author"
                style={{ color: HERO.textSecondary, textDecoration: "none", fontWeight: 600 }}
              >
                {AUTHOR.name}
              </a>{" "}
              on{" "}
              <time dateTime={LAST_VERIFIED_DATE} style={{ color: HERO.textSecondary }}>
                {LAST_VERIFIED}
              </time>
            </span>
          </div>

          {/* Code box */}
          <div
            style={{
              border: `1px solid ${HERO.border}`,
              borderRadius: "0.5rem",
              paddingTop: "2rem",
              paddingBottom: "2rem",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: HERO.subtle,
                marginTop: 0,
                marginBottom: "1rem",
              }}
            >
              Your Coupon Code
            </p>
            <p
              className="select-all"
              style={{
                color: HERO.text,
                fontSize: "clamp(2.5rem, 8vw, 3.75rem)",
                fontWeight: 900,
                letterSpacing: "0.15em",
                lineHeight: 1,
                margin: 0,
                userSelect: "all",
              }}
            >
              {COUPON_CODE}
            </p>
            <CopyButton code={COUPON_CODE} />
          </div>

          {/* No fine-print strip here: its three facts (cadence, verified
              date, minimum order) were each already stated above, and it
              sat between the code and the CTA. */}
          <div style={{ marginTop: "2rem" }}>
            <HeroCTA />
          </div>
        </div>
      </section>

      {/* ─────────────── WHY SIGNATURE SOLAR ─────────────── */}
      <section
        style={{
          ...sectionPad,
          backgroundColor: c.altBg,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div
          style={{
            maxWidth: "42rem",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              ...HEADING_RESET,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: c.text,
              marginTop: 0,
              marginBottom: "1.5rem",
            }}
          >
            Why We Recommend Signature Solar for Skoolie Builds
          </h2>
          <p
            style={{
              color: c.textMuted,
              lineHeight: 1.7,
              fontSize: "0.9375rem",
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            After filming a hundred-plus{" "}
            <a
              href="/#videos"
              style={{ color: c.textBody, textDecoration: "underline" }}
            >
              Mobile Dwellings
            </a>{" "}
            and building 2 Skoolies myself, one off-grid component supplier shows up in the
            electrical bay more than any other: Signature Solar. Their{" "}
            <strong style={{ color: c.textBody }}>EG4 server rack battery line</strong> has
            almost become the default for lithium storage and their affordable all-in-one
            inverter/chargers are showing up more and more in the bigger builds for their high
            inverter outputs at a low price.
          </p>
          <p
            style={{
              color: c.textMuted,
              lineHeight: 1.7,
              fontSize: "0.9375rem",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            On top of that they sell the full Victron lineup, IronRidge racking and one of
            the best mini-split options right alongside 10 solar panel pallets (at industry
            low prices), and they do it all from a Texas, USA home base where you can get
            real support for your products and hold them accountable if anything goes wrong.
            They're practically a one-stop shop for the off-grid components for your School
            Bus Conversion or other Mobile Dwelling.
          </p>
        </div>
      </section>

      {/* ─────────────── GEAR WE'VE SEEN IN BUILDS ─────────────── */}
      <section
        style={{
          ...sectionPad,
          backgroundColor: c.sectionBg,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div style={{ maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
          <h2
            style={{
              ...HEADING_RESET,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: c.text,
              textAlign: "center",
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            Best Signature Solar Gear for Skoolie &amp; Van Builds
          </h2>
          <p
            style={{
              color: c.textMuted,
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              textAlign: "center",
              marginTop: 0,
              marginBottom: "2.5rem",
            }}
          >
            These are the components that show up over and over when we tour Skoolies, Sail
            Boats, and Overland Rigs. You'll find all of them in our{" "}
            <a href="/deals" style={{ color: c.textBody, textDecoration: "underline" }}>
              recommended solar and lithium battery gear for skoolies
            </a>
            , or compare them against{" "}
            <a
              href="/partners/wattcycle"
              style={{ color: c.textBody, textDecoration: "underline" }}
            >
              budget LiFePO4 batteries from WattCycle
            </a>
            .
          </p>

          {/* Hero build-tour video */}
          <figure style={{ margin: "0 0 2.5rem 0" }}>
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                borderRadius: "0.5rem",
                overflow: "hidden",
                border: `1px solid ${c.border}`,
                backgroundColor: "#000",
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${FEATURED_VIDEO.id}?start=${FEATURED_VIDEO.start}`}
                title={FEATURED_VIDEO.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
            <figcaption
              style={{
                color: c.textSubtle,
                fontSize: "0.8125rem",
                lineHeight: 1.5,
                marginTop: "0.75rem",
                textAlign: "center",
              }}
            >
              {FEATURED_VIDEO.caption}
            </figcaption>
          </figure>

          {/* Build-tour stills + linked-out video evidence */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.5rem",
              marginBottom: "2.5rem",
            }}
          >
            {BUILD_SHOTS.map((shot) => (
              <figure key={shot.image} style={{ margin: 0 }}>
                <img
                  src={shot.image}
                  alt={shot.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "0.5rem",
                    border: `1px solid ${c.border}`,
                  }}
                />
                <figcaption
                  style={{
                    color: c.textMuted,
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    marginTop: "1rem",
                  }}
                >
                  {shot.blurb}
                  <span
                    style={{
                      marginTop: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${shot.videoId}&t=${shot.videoStart}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: c.textBody,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        textDecoration: "underline",
                      }}
                    >
                      Watch the full tour on YouTube →
                    </a>
                    {shot.dealsHref && (
                      <a
                        href={shot.dealsHref}
                        style={{
                          color: c.textBody,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textDecoration: "underline",
                        }}
                      >
                        {shot.dealsCtaLabel ??
                          "See current deals & pricing in our gear shop →"}
                      </a>
                    )}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {GEAR_ITEMS.map((item) => (
              <div
                key={item.title}
                style={{
                  borderTop: `1px solid ${c.border}`,
                  paddingTop: "1.5rem",
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: "0.5rem",
                      border: `1px solid ${c.border}`,
                      marginBottom: "1rem",
                    }}
                  />
                )}
                <h3
                  style={{
                    ...HEADING_RESET,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: c.text,
                    marginTop: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: c.textMuted,
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.bodyNode ?? item.body}
                </p>
                {item.dealsHref && (
                  <a
                    href={item.dealsHref}
                    style={{
                      display: "inline-block",
                      marginTop: "0.875rem",
                      color: c.textBody,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    {item.dealsCtaLabel ?? "See current deals & pricing in our gear shop →"}
                  </a>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────── HOW WE VERIFY THIS CODE ─────────────── */}
      <section
        style={{
          ...sectionPad,
          backgroundColor: c.altBg,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div
          style={{
            maxWidth: "42rem",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              ...HEADING_RESET,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: c.text,
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            How We Test and Verify Our Signature Solar Discount Code
          </h2>
          <p
            style={{
              color: c.textMuted,
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            Signature Solar partnered with{" "}
            <a href="/about" style={{ color: c.textBody, textDecoration: "underline" }}>
              Mobile Dwellings
            </a>{" "}
            because of our work both building and filming off-grid solar builds for skoolies
            and mobile dwellings, and {COUPON_CODE} is our code. I re-test it at
            signaturesolar.com every handful of days to make sure it works and update the
            "verified" date at the top of this page. Signature Solar rotates its coupon codes
            about every 60 days and when a new code replaces it, that one goes here. If the
            code ever stops working, email{" "}
            <a
              href="mailto:justin@mobiledwellings.media"
              style={{ color: c.textBody, textDecoration: "underline" }}
            >
              justin@mobiledwellings.media
            </a>{" "}
            and I'll fix it the same day. Last verified active on{" "}
            <time dateTime={LAST_VERIFIED_DATE} style={{ color: c.textBody }}>
              {LAST_VERIFIED}
            </time>
            .
          </p>
        </div>
      </section>

      {/* ─────────────── FAQ ─────────────── */}
      <section
        style={{
          ...sectionPad,
          backgroundColor: c.sectionBg,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div style={{ maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
          <h2
            style={{
              ...HEADING_RESET,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: c.text,
              textAlign: "center",
              marginTop: 0,
              marginBottom: "2.5rem",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div>
            {faqItems.map((faq, i) => (
              <div
                key={i}
                style={{
                  paddingTop: i === 0 ? 0 : "1.5rem",
                  paddingBottom: i === faqItems.length - 1 ? 0 : "1.5rem",
                  borderTop: i === 0 ? "none" : `1px solid ${c.border}`,
                }}
              >
                <h3
                  style={{
                    ...HEADING_RESET,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: c.text,
                    marginTop: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  {faq.question}
                </h3>
                <p
                  style={{
                    color: c.textMuted,
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {faq.answerNode ?? faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── BOTTOM CTA ─────────────── */}
      <section
        style={{
          ...sectionPad,
          backgroundColor: c.altBg,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem", marginLeft: "auto", marginRight: "auto" }}>
          <h2
            style={{
              ...HEADING_RESET,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: c.text,
              marginTop: 0,
              marginBottom: "0.5rem",
            }}
          >
            Use Code <span style={{ fontWeight: 900 }}>{COUPON_CODE}</span>
          </h2>
          <p
            style={{
              color: c.textMuted,
              fontSize: "0.875rem",
              marginTop: 0,
              marginBottom: "1.75rem",
            }}
          >
            $50 off · Verified {LAST_VERIFIED}
          </p>
          <FooterCTA palette={c} />
          <p
            style={{
              marginTop: "1.5rem",
              marginBottom: 0,
              fontSize: "0.75rem",
              color: c.textSubtle,
            }}
          >
            <a
              href="/#gear"
              style={{
                color: c.textSubtle,
                textDecoration: "underline",
              }}
            >
              See all our gear &amp; deals →
            </a>
          </p>
        </div>
      </section>

      {/* ─────────────── AFFILIATE DISCLOSURE (FTC-required) ─────────────── */}
      <section
        style={{
          backgroundColor: c.sectionBg,
          borderTop: `1px solid ${c.border}`,
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <p
          style={{
            maxWidth: "42rem",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            fontSize: "0.75rem",
            color: c.textSubtle,
            lineHeight: 1.6,
            margin: "0 auto",
          }}
        >
          Mobile Dwellings is a Signature Solar affiliate. Using code {COUPON_CODE} or the links
          on this page kicks a commission back to us at no extra cost to you — it's how we keep
          filming builds!
        </p>
      </section>
    </main>
  );
}

// The shell needs these for its own wrapper div.
export { useIsDarkMode, LIGHT, DARK };
