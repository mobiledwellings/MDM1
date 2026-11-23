import { useState } from "react";
import {
  WC_COUPON_CODE,
  WC_DISCOUNT_PCT,
  WC_AFFILIATE_URL,
  WC_PARTNER_PATH,
  WC_PROOF_IMAGE,
  WC_BLACK_FRIDAY,
  WC_BF_STEPS,
  wcProductUrl,
  wcCodeSavings,
  wcFinalPrice,
  wcPerKwh,
  wcMoney,
  wcBfHeadline,
  wcBfAnswer,
  wcBfFaq,
} from "../data/wattcycle-black-friday-content.mjs";
import { useIsDarkMode, LIGHT, DARK } from "./SignatureSolarCouponMain";

// ──────────────────────────────────────────────────────────
// Page content for /wattcycle-black-friday.
//
// Same rules as BlackFridayMain: no router hooks, context or browser globals,
// so scripts/prerender-seo.js can render it to a string in Node. Links are
// plain <a href>. All copy and prices live in wattcycle-black-friday-content.mjs.
// ──────────────────────────────────────────────────────────

const HERO = {
  bg: "#0a0a0a",
  text: "#ffffff",
  textSecondary: "#d4d4d4",
  muted: "#a3a3a3",
  subtle: "#737373",
  border: "#404040",
};

const HEADING_RESET: React.CSSProperties = {
  textTransform: "none",
  fontFamily: "inherit",
  letterSpacing: "normal",
};

function CopyCode() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(WC_COUPON_CODE).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label={`Copy coupon code ${WC_COUPON_CODE}`}
      style={{
        padding: "0.5rem 1.25rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        borderRadius: "0.375rem",
        border: `1px solid ${HERO.border}`,
        color: copied ? "#e5e5e5" : HERO.muted,
        backgroundColor: "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {copied ? "Copied!" : "Copy Code"}
    </button>
  );
}

export function WattCycleBlackFridayMain() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;
  const faq = wcBfFaq();

  const section: React.CSSProperties = {
    padding: "3rem 1.5rem",
    borderBottom: `1px solid ${c.border}`,
  };
  const wrap: React.CSSProperties = { maxWidth: "42rem", margin: "0 auto" };
  const h2: React.CSSProperties = {
    ...HEADING_RESET,
    fontSize: "1.5rem",
    fontWeight: 700,
    color: c.text,
    marginTop: 0,
    marginBottom: "1rem",
  };
  const p: React.CSSProperties = {
    color: c.textBody,
    fontSize: "0.9375rem",
    lineHeight: 1.7,
    marginTop: 0,
  };
  const priceLabel: React.CSSProperties = {
    display: "block",
    fontSize: "0.6875rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: c.textMuted,
    marginBottom: "0.125rem",
  };

  return (
    <main>
      {/* ─── HERO ─── */}
      <section style={{ backgroundColor: HERO.bg, color: HERO.text, padding: "2.75rem 1.5rem" }}>
        <div
          style={{
            maxWidth: "44rem",
            margin: "0 auto",
            border: `1px solid ${HERO.border}`,
            borderRadius: "0.75rem",
            padding: "1.75rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: HERO.subtle,
              margin: "0 0 0.625rem",
            }}
          >
            Black Friday {WC_BLACK_FRIDAY.year} · {WC_BLACK_FRIDAY.saleWindow}
          </p>
          <h1
            style={{
              ...HEADING_RESET,
              color: HERO.text,
              fontSize: "clamp(1.5rem, 3.6vw, 2rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              margin: "0 0 0.75rem",
            }}
          >
            {wcBfHeadline()}
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              color: HERO.muted,
              lineHeight: 1.6,
              maxWidth: "34rem",
              margin: "0 auto 1.25rem",
            }}
          >
            {wcBfAnswer()}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              border: `1px solid ${HERO.border}`,
              borderRadius: "0.5rem",
              padding: "1rem 1.25rem",
              marginBottom: "0.875rem",
            }}
          >
            <p
              className="select-all"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "0.12em",
                lineHeight: 1,
                margin: 0,
                userSelect: "all",
              }}
            >
              {WC_COUPON_CODE}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", justifyContent: "center" }}>
              <CopyCode />
              <a
                href={WC_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                style={{
                  display: "inline-block",
                  padding: "0.625rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  borderRadius: "0.375rem",
                  backgroundColor: "#ffffff",
                  color: "#0a0a0a",
                  textDecoration: "none",
                }}
              >
                Shop WattCycle →
              </a>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: HERO.muted, margin: 0 }}>
            {WC_DISCOUNT_PCT}% off, no minimum · Tested at checkout on{" "}
            <time dateTime={WC_BLACK_FRIDAY.verifiedIso} style={{ color: HERO.textSecondary }}>
              {WC_BLACK_FRIDAY.verified}
            </time>{" "}
            ·{" "}
            <a href={WC_PARTNER_PATH} style={{ color: HERO.textSecondary }}>
              Full code details
            </a>
          </p>
        </div>
      </section>

      {/* ─── DEALS ─── */}
      <section style={{ ...section, backgroundColor: c.sectionBg }}>
        <div style={wrap}>
          <h2 style={h2}>WattCycle Black Friday Deals, Before and After {WC_COUPON_CODE}</h2>
          <p style={p}>
            Every price below is WattCycle's own listing on {WC_BLACK_FRIDAY.verified}, and we ran{" "}
            {WC_COUPON_CODE} through checkout on each one. Prices can change during the sale, so your
            cart has the final word.
          </p>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "1rem" }}>
            {WC_BLACK_FRIDAY.deals.map((d) => {
              const final = wcFinalPrice(d.sale);
              return (
                <li
                  key={d.handle}
                  style={{
                    border: `1px solid ${c.border}`,
                    borderRadius: "0.625rem",
                    padding: "1.125rem 1.25rem",
                    backgroundColor: c.altBg,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                  }}
                >
                  <a
                    href={wcProductUrl(d.handle)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    style={{ flex: "0 0 9.5rem", maxWidth: "100%", margin: "0 auto" }}
                  >
                    <img
                      src={d.image}
                      alt={d.imageAlt}
                      width={600}
                      height={600}
                      loading="lazy"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        borderRadius: "0.5rem",
                        backgroundColor: "#ffffff",
                        border: `1px solid ${c.border}`,
                      }}
                    />
                  </a>
                  <div style={{ flex: "1 1 18rem", minWidth: 0 }}>
                  <h3 style={{ ...HEADING_RESET, fontSize: "1.0625rem", fontWeight: 700, color: c.text, margin: "0 0 0.25rem" }}>
                    <a
                      href={wcProductUrl(d.handle)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{ color: c.text, textDecoration: "none" }}
                    >
                      {d.name}
                    </a>
                  </h3>
                  <p style={{ ...p, fontSize: "0.875rem", marginBottom: "0.875rem" }}>{d.note}</p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(7.5rem, 1fr))",
                      gap: "0.75rem",
                      marginBottom: "0.875rem",
                    }}
                  >
                    <div>
                      <span style={priceLabel}>Was</span>
                      <s style={{ color: c.textMuted, fontSize: "1rem" }}>{wcMoney(d.was)}</s>
                    </div>
                    <div>
                      <span style={priceLabel}>Black Friday</span>
                      <span style={{ color: c.text, fontSize: "1rem", fontWeight: 600 }}>{wcMoney(d.sale)}</span>
                    </div>
                    <div>
                      <span style={priceLabel}>With {WC_COUPON_CODE}</span>
                      <span style={{ color: c.text, fontSize: "1.25rem", fontWeight: 800 }}>{wcMoney(final)}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.8125rem", color: c.textMuted, margin: "0 0 0.875rem", lineHeight: 1.6 }}>
                    {WC_COUPON_CODE} takes off another {wcMoney(wcCodeSavings(d.sale))} · {d.kwh} kWh ({d.pack}) ·
                    about <strong style={{ color: c.text }}>${wcPerKwh(d)} per kWh</strong> after the code
                  </p>

                  <a
                    href={wcProductUrl(d.handle)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    style={{ fontSize: "0.875rem", fontWeight: 600, color: c.text, textDecoration: "underline" }}
                  >
                    See the {d.short} →
                  </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ─── PROOF ─── */}
      <section style={{ ...section, backgroundColor: c.altBg }}>
        <div style={wrap}>
          <h2 style={h2}>Proof It Stacks on Sale Prices</h2>
          <p style={p}>
            The 48V server rack on Black Friday pricing at {wcMoney(829.99)}, with {WC_COUPON_CODE} taking
            another $66.39 off at checkout. Shipping was free.
          </p>
          <img
            src={WC_PROOF_IMAGE}
            alt={`WattCycle checkout with the V2.5 48V 100Ah server rack battery at its $829.99 Black Friday price and coupon code ${WC_COUPON_CODE} applied for $66.39 off, with free shipping.`}
            width={1046}
            height={970}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "30rem",
              height: "auto",
              margin: "0 auto",
              border: `1px solid ${c.border}`,
              borderRadius: "0.5rem",
            }}
          />
        </div>
      </section>

      {/* ─── HOW TO STACK ─── */}
      <section style={{ ...section, backgroundColor: c.sectionBg }}>
        <div style={wrap}>
          <h2 style={h2}>How to Stack {WC_COUPON_CODE} With Black Friday Pricing</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {WC_BF_STEPS.map((s, i) => (
              <li key={s.title} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ ...HEADING_RESET, fontSize: "1rem", fontWeight: 700, color: c.text, margin: "0 0 0.375rem" }}>
                  {i + 1}. {s.title}
                </h3>
                <p style={{ ...p, marginBottom: 0 }}>{s.body}</p>
              </li>
            ))}
          </ol>
          <p style={{ ...p, marginBottom: 0 }}>
            Building on 48V and comparing brands?{" "}
            <a href="/signature-solar-black-friday" style={{ color: c.text, textDecoration: "underline" }}>
              See the Signature Solar Black Friday page
            </a>{" "}
            for EG4 gear.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ ...section, backgroundColor: c.altBg }}>
        <div style={wrap}>
          <h2 style={h2}>WattCycle Black Friday FAQ</h2>
          {faq.map((f) => (
            <div key={f.question} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ ...HEADING_RESET, fontSize: "1rem", fontWeight: 700, color: c.text, margin: "0 0 0.375rem" }}>
                {f.question}
              </h3>
              <p style={{ ...p, marginBottom: 0 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DISCLOSURE ─── */}
      <section style={{ padding: "1.5rem", backgroundColor: c.sectionBg }}>
        <p style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center", fontSize: "0.75rem", color: c.textSubtle, lineHeight: 1.6 }}>
          Mobile Dwellings is a WattCycle affiliate. Using code {WC_COUPON_CODE} or the links on this
          page earns us a commission at no extra cost to you.
        </p>
      </section>
    </main>
  );
}
