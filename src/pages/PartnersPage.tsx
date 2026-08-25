import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PARTNERS, partnerHref, Partner } from "../data/partners";

const SITE = "https://mobiledwellings.media";

const LIGHT = {
  pageBg: "#ffffff",
  cardBg: "#ffffff",
  text: "#171717",
  textBody: "#404040",
  textMuted: "#737373",
  border: "#e5e5e5",
};
const DARK = {
  pageBg: "#171717",
  cardBg: "#1f1f1f",
  text: "#ffffff",
  textBody: "#d4d4d4",
  textMuted: "#a3a3a3",
  border: "#404040",
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

function PartnerCard({
  partner,
  c,
  onOpen,
}: {
  partner: Partner;
  c: typeof LIGHT;
  onOpen: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const href = partnerHref(partner);
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onOpen(href);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        backgroundColor: c.cardBg,
        border: `1px solid ${hovered ? partner.accent : c.border}`,
        borderRadius: "0.75rem",
        overflow: "hidden",
        transition: "border-color 0.15s ease, transform 0.15s ease",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ height: "6px", backgroundColor: partner.accent }} />
      <div
        style={{
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            ...HEADING_RESET,
            fontSize: "1.375rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          {partner.name}
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.55,
            color: c.textBody,
            marginBottom: "1.75rem",
          }}
        >
          {partner.tagline}
        </p>
        {partner.coupon && (
          // marginTop:auto pins the pill to the bottom of the card, so the
          // pills line up across the row even when taglines wrap to different
          // numbers of lines.
          <div style={{ textAlign: "center", marginTop: "auto" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.875rem",
                fontWeight: 800,
                letterSpacing: "0.01em",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: `1px dashed ${c.border}`,
                color: c.text,
                // No `nowrap`: at 1rem the pill measured wider than the card's
                // content box on all three partners and overflow:hidden clipped
                // it flush to the card edge. Wrapping is the safety net for a
                // longer code or discount than today's.
                maxWidth: "100%",
              }}
            >
              {partner.coupon.discount
                ? `Use code ${partner.coupon.code} for ${partner.coupon.discount} Off`
                : `Code: ${partner.coupon.code}`}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

export function PartnersPage() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;
  const navigate = useNavigate();

  const openHref = (href: string) => {
    // External absolute URLs (none today) would open in a new tab; internal
    // routes use the SPA router.
    if (/^https?:\/\//.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <SEO
        title="Our Partners — Brands We Trust"
        description="The brands Mobile Dwellings partners with for skoolie, van, and overland builds — Signature Solar, onX Offroad, and WattCycle. Each offers an exclusive discount."
        keywords="mobile dwellings partners, skoolie gear, van life brands, overland gear, signature solar, onx offroad, wattcycle, skoolie discount codes, off grid gear deals"
        url={`${SITE}/partners`}
        type="website"
      />

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
          <section style={{ padding: "4rem 1.5rem 2rem", textAlign: "center" }}>
            <div style={{ maxWidth: "44rem", margin: "0 auto" }}>
              <h1
                style={{
                  ...HEADING_RESET,
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}
              >
                Our Partners
              </h1>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: c.textBody }}>
                These are the brands we feel best align with the values of Mobile
                Dwellings. They each offer an exclusive discount. Pick a partner to see more details.
              </p>
            </div>
          </section>

          <section style={{ padding: "1rem 1.5rem 5rem" }}>
            <div
              style={{
                maxWidth: "64rem",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
                gap: "1.5rem",
              }}
            >
              {PARTNERS.map((partner) => (
                <PartnerCard
                  key={partner.slug}
                  partner={partner}
                  c={c}
                  onOpen={openHref}
                />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
