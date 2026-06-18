import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getPartner } from "../data/partners";

const SITE = "https://mobiledwellings.media";

// ──────────────────────────────────────────────────────────
// Color palettes (no dependence on Tailwind utilities) — mirrors the
// hand-built Signature Solar page so partner pages feel consistent.
// ──────────────────────────────────────────────────────────
const HERO = {
  bg: "#0a0a0a",
  text: "#ffffff",
  textSecondary: "#d4d4d4",
  muted: "#a3a3a3",
  subtle: "#737373",
  border: "#404040",
  ctaText: "#0a0a0a",
};

const LIGHT = {
  pageBg: "#ffffff",
  altBg: "#fafafa",
  text: "#171717",
  textBody: "#404040",
  textMuted: "#737373",
  border: "#e5e5e5",
  ctaBg: "#171717",
  ctaText: "#ffffff",
  ctaHover: "#404040",
};

const DARK = {
  pageBg: "#171717",
  altBg: "#262626",
  text: "#ffffff",
  textBody: "#d4d4d4",
  textMuted: "#a3a3a3",
  border: "#404040",
  ctaBg: "#ffffff",
  ctaText: "#171717",
  ctaHover: "#e5e5e5",
};

const HEADING_RESET: React.CSSProperties = {
  textTransform: "none",
  fontFamily: "inherit",
  letterSpacing: "normal",
};

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
  const active = hovered || copied;
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Copy coupon code"
      style={{
        marginTop: "1rem",
        padding: "0.5rem 1.5rem",
        fontSize: "0.875rem",
        fontWeight: 500,
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

function CTAButton({
  href,
  label,
  bg,
  color,
  hoverBg,
}: {
  href: string;
  label: string;
  bg: string;
  color: string;
  hoverBg: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        padding: "0.875rem 2rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        borderRadius: "0.375rem",
        backgroundColor: hovered ? hoverBg : bg,
        color,
        textDecoration: "none",
        transition: "background-color 0.15s ease",
      }}
    >
      {label}
    </a>
  );
}

// ──────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────
export function PartnerPage() {
  const { slug } = useParams<{ slug: string }>();
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  const partner = slug ? getPartner(slug) : undefined;

  // Bespoke pages (e.g. Signature Solar) redirect to their real route.
  if (partner?.externalPath) {
    return <Navigate to={partner.externalPath} replace />;
  }
  // Unknown slug → send to the hub.
  if (!partner) {
    return <Navigate to="/partners" replace />;
  }

  const p = partner;
  const sectionPad: React.CSSProperties = { padding: "1.75rem 1.5rem" };
  const hasPlaceholder =
    p.affiliateUrl.startsWith("PLACEHOLDER") ||
    !!p.coupon?.code?.startsWith("PLACEHOLDER");

  return (
    <>
      <SEO
        title={p.seo.title}
        description={p.seo.description}
        keywords={p.seo.keywords}
        url={`${SITE}/partners/${p.slug}`}
        image={p.seo.ogImage ?? `${SITE}/og-image.jpg`}
        type="article"
      />
      {/* JSON-LD structured data for partner pages is baked into the
          prerendered static HTML by scripts/prerender-seo.js (so non-JS
          crawlers and AI bots see it). It is intentionally NOT injected here at
          runtime, to avoid duplicate FAQPage/Offer entries on the same URL. */}

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
              position: "relative",
              backgroundColor: HERO.bg,
              color: HERO.text,
              padding: "1.5rem 1.5rem",
              overflow: "hidden",
            }}
          >
            {p.heroImage && (
              <>
                <img
                  src={p.heroImage}
                  alt={p.heroImageAlt ?? `${p.name} — Mobile Dwellings`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(10,10,10,0.62)",
                  }}
                />
              </>
            )}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "48rem",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              {p.logo && (
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  style={{
                    height: "48px",
                    width: "auto",
                    margin: "0 auto 1.5rem",
                    display: "block",
                  }}
                />
              )}
              <h1
                style={{
                  ...HEADING_RESET,
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: "0.5rem",
                }}
              >
                Mobile Dwellings <span style={{ color: p.accent }}>x</span> {p.name}
              </h1>
              <p
                style={{
                  color: HERO.textSecondary,
                  fontSize: "1rem",
                  lineHeight: 1.45,
                  marginBottom: "1.25rem",
                }}
              >
                {p.tagline}
              </p>

              {p.coupon && (
                <div
                  style={{
                    display: "inline-block",
                    border: `1px dashed ${HERO.border}`,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: HERO.muted,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Use code
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      color: p.accent,
                    }}
                  >
                    {p.coupon.code}
                  </div>
                  {p.coupon.terms && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: HERO.textSecondary,
                        marginTop: "0.5rem",
                      }}
                    >
                      {p.coupon.terms}
                    </div>
                  )}
                  {p.coupon.surveyNote && (
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: HERO.muted,
                        marginTop: "0.75rem",
                        maxWidth: "22rem",
                        marginLeft: "auto",
                        marginRight: "auto",
                        lineHeight: 1.45,
                      }}
                    >
                      {p.coupon.surveyNote}
                    </div>
                  )}
                  <br />
                  <CopyButton code={p.coupon.code} />
                </div>
              )}

              <div>
                <CTAButton
                  href={p.affiliateUrl}
                  label={p.ctaLabel}
                  bg="#ffffff"
                  color={HERO.ctaText}
                  hoverBg="#e5e5e5"
                />
              </div>

              {(p.coupon?.lastVerified || hasPlaceholder) && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: HERO.subtle,
                    marginTop: "0.75rem",
                  }}
                >
                  {hasPlaceholder
                    ? "⚠︎ Affiliate link / code not yet set — replace the PLACEHOLDER values in src/data/partners.tsx."
                    : `Verified active on ${p.coupon!.lastVerified} by Justin Smith of Mobile Dwellings.`}
                </p>
              )}
            </div>
          </section>

          {/* ─────────────── INTRO ─────────────── */}
          <section style={sectionPad}>
            <div style={{ maxWidth: "44rem", margin: "0 auto" }}>
              {p.intro.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "1.125rem",
                    lineHeight: 1.7,
                    color: c.textBody,
                    marginBottom: i === p.intro.length - 1 ? 0 : "1.25rem",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* ─────────────── HERO VIDEO ─────────────── */}
          {p.heroVideo && (
            <section style={{ ...sectionPad, backgroundColor: c.altBg }}>
              <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${p.heroVideo.id}${
                      p.heroVideo.start ? `?start=${p.heroVideo.start}` : ""
                    }`}
                    title={p.heroVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: c.textMuted,
                    marginTop: "1rem",
                    textAlign: "center",
                  }}
                >
                  {p.heroVideo.description}
                </p>
              </div>
            </section>
          )}

          {/* ─────────────── PRODUCTS ─────────────── */}
          {p.products.length > 0 && (
            <section style={sectionPad}>
              <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
                <h2
                  style={{
                    ...HEADING_RESET,
                    fontSize: "1.875rem",
                    fontWeight: 700,
                    marginBottom: "1.75rem",
                    textAlign: "center",
                  }}
                >
                  {p.productsHeading ?? `What we like about ${p.name}`}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {p.products.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        border: `1px solid ${c.border}`,
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.imageAlt ?? item.title}
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            height: "auto",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      )}
                      <div
                        style={{
                          padding: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            ...HEADING_RESET,
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            marginBottom: "0.75rem",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.9375rem",
                            lineHeight: 1.6,
                            color: c.textBody,
                            marginBottom: "1.25rem",
                            flex: 1,
                          }}
                        >
                          {item.body}
                        </p>
                        <a
                          href={item.href ?? p.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: c.text,
                            textDecoration: "underline",
                          }}
                        >
                          {item.ctaLabel ?? p.ctaLabel}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─────────────── ABOUT ─────────────── */}
          <section style={{ ...sectionPad, backgroundColor: c.altBg }}>
            <div style={{ maxWidth: "44rem", margin: "0 auto" }}>
              <h2
                style={{
                  ...HEADING_RESET,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}
              >
                Why we partner with {p.name}
              </h2>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: c.textBody }}>
                {p.about}
              </p>
            </div>
          </section>

          {/* ─────────────── FAQ ─────────────── */}
          {p.faqs.length > 0 && (
            <section style={sectionPad}>
              <div style={{ maxWidth: "44rem", margin: "0 auto" }}>
                <h2
                  style={{
                    ...HEADING_RESET,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "2rem",
                  }}
                >
                  Frequently asked questions
                </h2>
                {p.faqs.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: `1px solid ${c.border}`,
                      paddingBottom: "1.25rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <h3
                      style={{
                        ...HEADING_RESET,
                        fontSize: "1.0625rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {f.question}
                    </h3>
                    <p style={{ fontSize: "1rem", lineHeight: 1.6, color: c.textBody }}>
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─────────────── FOOTER CTA ─────────────── */}
          <section
            style={{
              ...sectionPad,
              backgroundColor: c.altBg,
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
              <h2
                style={{
                  ...HEADING_RESET,
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}
              >
                Ready to check out {p.name}?
              </h2>
              {p.coupon && (
                <p
                  style={{ fontSize: "1.0625rem", color: c.textBody, marginBottom: "1.5rem" }}
                >
                  Use code{" "}
                  <strong style={{ color: c.text }}>{p.coupon.code}</strong> at checkout.
                </p>
              )}
              <CTAButton
                href={p.affiliateUrl}
                label={p.ctaLabel}
                bg={c.ctaBg}
                color={c.ctaText}
                hoverBg={c.ctaHover}
              />
              {p.coupon?.surveyNote && (
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: c.textBody,
                    marginTop: "1.5rem",
                    lineHeight: 1.55,
                  }}
                >
                  {p.coupon.surveyNote}
                </p>
              )}
              <p style={{ fontSize: "0.8125rem", color: c.textMuted, marginTop: "1.5rem" }}>
                Affiliate links support Mobile Dwellings at no extra cost to you.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
