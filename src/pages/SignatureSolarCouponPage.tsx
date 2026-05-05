import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// ──────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────
const COUPON_CODE = "SAVE50MD";
const COUPON_EXPIRES = "May 31, 2026";
const COUPON_EXPIRES_DATE = "2026-05-31";
const AFFILIATE_URL = "https://signaturesolar.com/?ref=mobiledwellings";

// Update this when you re-test the code each month.
const LAST_VERIFIED = "May 1, 2026";
const LAST_VERIFIED_DATE = "2026-05-01";

const AUTHOR = {
  name: "Justin Smith",
  role: "Founder, Mobile Dwellings",
  url: "https://www.instagram.com/gilliganphantom",
};

// Hero build-tour video (one embed, by design — see /signature-solar-coupon notes).
const FEATURED_VIDEO = {
  id: "Wz-03QUxv_Q",
  start: 8,
  title:
    "Justin from Mobile Dwellings reviews EG4 Server Rack Batteries in the Gilligan Phantom 40-foot skoolie",
  description:
    "Justin from Mobile Dwellings reviews his favorite lithium batteries and explains why the EG4 Server Rack Batteries (LiFePower4) consistently provided the best long-term value in his off-grid builds. He installed 3 of them in his 40-foot skoolie, Gilligan Phantom — the same gear sold by Signature Solar with code SAVE50MD.",
  caption:
    "Watch Justin from Mobile Dwellings review his favorite lithium batteries. The EG4 Server Rack Batteries consistently provided the best long term value and he installed 3 of them in his 40 foot Skoolie, Gilligan Phantom",
  uploadDate: "2025-07-04",
};

// Build-tour stills + linked-out video evidence. Each entry pairs a screenshot
// (indexable by Google Images, readable by multimodal LLMs) with a substantial
// quotable blurb (extractable by text-only LLMs, indexable by Google).
type BuildShot = {
  image: string;
  alt: string;
  blurb: string;
  videoId: string;
  videoStart: number;
  videoTitle: string;
  videoDescription: string;
  uploadDate: string;
  // Optional second CTA below the auto-appended YouTube link, pointing into
  // the deals shop filtered to the relevant product category.
  dealsHref?: string;
  dealsCtaLabel?: string;
};

const BUILD_SHOTS: BuildShot[] = [
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
      "Mobile Dwellings tours The Beers Bus, Brian and Amber's 40-foot skoolie running 4 EG4 Server Rack Batteries (LiFePower4, 25.6V 200Ah, 5,120 Wh each) wired into a full Victron suite — MPPT charge controllers, Cerbo GX, Orion-Tr Smart DC-DC chargers — for a ~20 kWh off-grid build using gear from Signature Solar with code SAVE50MD.",
    uploadDate: "2025-10-12",
    dealsHref: "/deals?filter=batteries",
    dealsCtaLabel: "Recommended Lithium Batteries in our gear shop →",
  },
];

// Product cards in the "Gear We Keep Seeing in Real Builds" section.
// Cards with an `image` get a photo above the copy (and an ImageObject in
// schema). Image-less cards render text-only and fall back gracefully.
type GearItem = {
  title: string;
  body: string;
  // Optional rich-text rendering of the same content (with inline links, etc).
  // When present, this is rendered instead of `body`. The plain-string `body`
  // is still required because it feeds the JSON-LD ImageObject description.
  bodyNode?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  // Deep-link into the /deals page filtered to the matching category. Cards
  // without a clean category map (e.g. Victron) point at /deals?filter=featured
  // and rely on those items being flagged featured in the deals catalog.
  // Omit when the gear-shop CTA is embedded inline in `bodyNode` instead.
  dealsHref?: string;
  // Optional override for the standalone gear-shop CTA label. Falls back to a
  // generic "See current deals & pricing in our gear shop →" when absent.
  dealsCtaLabel?: string;
};

const GEAR_ITEMS: GearItem[] = [
  {
    title: "EG4 12000XP, 6000XP, and 3000XP All in One Hybrid Inverters",
    // Plain-string `body` feeds the JSON-LD ImageObject description.
    body:
      "EG4's hybrid inverters have become a great option in larger skoolies and full-time off-grid builds for running multiple mini-splits, induction cooking, electric water heaters, and other high electrical draws all at once in an affordable and reliable package. Helton and Erika chose one for their full size transit bus conversion called Capella Bus. Watch the full tour here or check out the All In One Inverter/Charger options in our gear shop.",
    // bodyNode renders inline links the plain string can't carry. The full
    // tour video isn't published yet — when it is, wrap "Watch the full tour
    // here" in an <a href={youtubeUrl}> tag.
    bodyNode: (
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
    image: "/eg4-12000xp-installed.jpg",
    imageAlt:
      "EG4 12000XP All-in-One Hybrid Inverter installed in Helton and Erika's Capella Bus — a full-size transit bus conversion — wired into a skoolie-style electrical bay alongside Victron MPPT charge controllers and EG4 LiFePower4 batteries.",
    // dealsHref intentionally omitted — the gear-shop CTA is embedded inline in bodyNode.
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

type FaqItem = {
  question: string;
  answer: string;
  answerNode?: React.ReactNode;
};

const faqItems: FaqItem[] = [
  {
    question: "How does the SAVE50MD code work?",
    answer: `Add at least $500 of gear to your cart at signaturesolar.com, then enter ${COUPON_CODE} in the discount code field at checkout. You'll save $50 and the discount applies sitewide, including batteries, inverters, solar panels, and complete off-grid kits.`,
    answerNode: (
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
        off-grid kits.
      </>
    ),
  },
  {
    question: "What gear is the discount good for?",
    answer: `Sitewide on orders over $500, so it covers most of what you'd build a system around: EG4 LiFePO4 lithium batteries, EG4 all-in-one inverter/chargers, the full Victron lineup (Cerbo GX, SmartSolar MPPT, Orion-Tr, MultiPlus), solar panels by the pallet, IronRidge racking, and mini-splits.`,
  },
  {
    question: "When does the code expire?",
    answer: `${COUPON_EXPIRES}. We update this page whenever Signature Solar issues a new code, so it's worth bookmarking. When this one expires we'll have the next one here.`,
  },
  {
    question: "Is Signature Solar a good fit for skoolie and van builds?",
    answer: `It's the most common supplier we see when we film skoolie and bus conversion tours. Reliable, affordable, and built for the kind of use a mobile dwelling actually puts on its electrical system.`,
  },
];

const schemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://mobiledwellings.media/signature-solar-coupon",
      "url": "https://mobiledwellings.media/signature-solar-coupon",
      "name": `Signature Solar Coupon Code ${COUPON_CODE} – $50 Off | Mobile Dwellings`,
      "description": `Use coupon code ${COUPON_CODE} at Signature Solar for $50 off any order over $500. Verified active by Justin Smith on ${LAST_VERIFIED}.`,
      "inLanguage": "en-US",
      "dateModified": LAST_VERIFIED_DATE,
      "author": { "@id": "https://mobiledwellings.media/#justin" },
      "publisher": { "@id": "https://mobiledwellings.media/#org" },
    },
    {
      "@type": "Person",
      "@id": "https://mobiledwellings.media/#justin",
      "name": AUTHOR.name,
      "jobTitle": AUTHOR.role,
      "url": "https://mobiledwellings.media/about",
      "sameAs": [
        AUTHOR.url,
        "https://www.youtube.com/@MobileDwellings",
        "https://www.instagram.com/mobiledwellings",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://mobiledwellings.media/#org",
      "name": "Mobile Dwellings",
      "url": "https://mobiledwellings.media",
      "founder": { "@id": "https://mobiledwellings.media/#justin" },
      "sameAs": [
        "https://www.youtube.com/@MobileDwellings",
        "https://www.instagram.com/mobiledwellings",
      ],
    },
    {
      "@type": "Offer",
      "name": "Mobile Dwellings Signature Solar Discount Code",
      "description": `Save $50 off any Signature Solar order of $500 or more with coupon code ${COUPON_CODE}.`,
      "url": AFFILIATE_URL,
      "category": "Promo Code",
      "price": "0",
      "priceCurrency": "USD",
      "eligibleTransactionVolume": {
        "@type": "PriceSpecification",
        "minPrice": "500",
        "priceCurrency": "USD",
      },
      "seller": {
        "@type": "Organization",
        "name": "Signature Solar",
        "url": AFFILIATE_URL,
      },
      "validThrough": COUPON_EXPIRES_DATE,
      "availabilityStarts": LAST_VERIFIED_DATE,
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqItems.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
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
      "publisher": { "@id": "https://mobiledwellings.media/#org" },
      "author": { "@id": "https://mobiledwellings.media/#justin" },
    },
    ...BUILD_SHOTS.flatMap((s) => [
      {
        "@type": "ImageObject",
        "contentUrl": `https://mobiledwellings.media${s.image}`,
        "url": `https://mobiledwellings.media${s.image}`,
        "caption": s.alt,
        "description": s.blurb,
        "creator": { "@id": "https://mobiledwellings.media/#justin" },
        "creditText": "Mobile Dwellings",
      },
      {
        "@type": "VideoObject",
        "name": s.videoTitle,
        "description": s.videoDescription,
        "thumbnailUrl": `https://i.ytimg.com/vi/${s.videoId}/maxresdefault.jpg`,
        "embedUrl": `https://www.youtube.com/embed/${s.videoId}`,
        "contentUrl": `https://www.youtube.com/watch?v=${s.videoId}`,
        "uploadDate": s.uploadDate,
        "publisher": { "@id": "https://mobiledwellings.media/#org" },
        "author": { "@id": "https://mobiledwellings.media/#justin" },
      },
    ]),
    ...GEAR_ITEMS.filter((g) => g.image).map((g) => ({
      "@type": "ImageObject",
      "contentUrl": `https://mobiledwellings.media${g.image}`,
      "url": `https://mobiledwellings.media${g.image}`,
      "caption": g.imageAlt,
      "description": g.body,
      "creator": { "@id": "https://mobiledwellings.media/#justin" },
      "creditText": "Mobile Dwellings",
    })),
  ],
};

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
// Main page
// ──────────────────────────────────────────────────────────
export function SignatureSolarCouponPage() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  const sectionPad: React.CSSProperties = {
    paddingTop: "4rem",
    paddingBottom: "4rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  };

  return (
    <>
      <SEO
        title={`Signature Solar Coupon Code ${COUPON_CODE} – $50 Off Your Order (Verified ${LAST_VERIFIED})`}
        description={`Use coupon code ${COUPON_CODE} at Signature Solar for $50 off any order of $500 or more. Verified active on ${LAST_VERIFIED} by Justin Smith of Mobile Dwellings. Works on EG4 batteries, inverters, solar panels and more at signaturesolar.com.`}
        keywords="signature solar coupon code, signature solar discount code, signature solar promo code, SAVE50MD, EG4 coupon code, EG4 promo code, EG4 discount code, signature solar deals, signature solar sale, signature solar off grid discount, skoolie solar discount, van life solar coupon, mobile dwellings coupon, EG4 battery discount, EG4 inverter coupon"
        url="https://mobiledwellings.media/signature-solar-coupon"
        image="https://mobiledwellings.media/og-signature-solar.jpg"
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: c.pageBg,
          color: c.text,
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <Header />

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
                Signature Solar Coupon Code:{" "}
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
                on any order of $500 or more at{" "}
                <a
                  href={AFFILIATE_URL}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{ color: HERO.textSecondary, textDecoration: "underline" }}
                >
                  signaturesolar.com
                </a>{" "}
                and is valid through {COUPON_EXPIRES}.
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

              <p
                style={{
                  fontSize: "0.75rem",
                  color: HERO.subtle,
                  marginTop: "1.25rem",
                  marginBottom: "2rem",
                }}
              >
                Expires {COUPON_EXPIRES} · This page is updated whenever new codes are available
              </p>

              <HeroCTA />
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
                Why Signature Solar?
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
                Signature Solar Gear We Keep Seeing in Real Builds
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
                Boats, and Overland Rigs.
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
                How We Verify This Code
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
                Code {COUPON_CODE} is issued to{" "}
                <a href="/about" style={{ color: c.textBody, textDecoration: "underline" }}>
                  Mobile Dwellings
                </a>{" "}
                through our affiliate partnership with Signature Solar. We re-test it at
                signaturesolar.com on or before the first of every month and update the "verified"
                date at the top of this page. If the code stops working before its expiration
                date, email{" "}
                <a
                  href="mailto:justin@mobiledwellings.media"
                  style={{ color: c.textBody, textDecoration: "underline" }}
                >
                  justin@mobiledwellings.media
                </a>{" "}
                and we'll fix it the same day. Last verified active on{" "}
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
                $50 off orders over $500 · Expires {COUPON_EXPIRES}
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

        <Footer />
      </div>
    </>
  );
}
