import { useState } from "react";
import {
  SIGNATURE_SOLAR_LAST_VERIFIED,
  SIGNATURE_SOLAR_LAST_VERIFIED_DATE,
} from "../data/coupon-verification";
import {
  COUPON_CODE,
  AFFILIATE_URL,
  BLACK_FRIDAY,
  BF_STEPS,
  bfHeadline,
  bfAnswer,
  bfSaleStatus,
  bfFaq,
} from "../data/black-friday-content.mjs";
import { useIsDarkMode, LIGHT, DARK } from "./SignatureSolarCouponMain";

// ──────────────────────────────────────────────────────────
// Page content for /signature-solar-black-friday.
//
// Kept free of router hooks, context and browser globals so
// scripts/prerender-seo.js can render it to a string in Node and bake it into
// the static HTML — the same pattern as SignatureSolarCouponMain. Links are
// plain <a href> for that reason.
//
// All copy lives in black-friday-content.mjs. Next November, update
// BLACK_FRIDAY there; nothing in this file should need to change.
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
        navigator.clipboard.writeText(COUPON_CODE).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label={`Copy coupon code ${COUPON_CODE}`}
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

export function BlackFridayMain() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;
  const faq = bfFaq({ lastVerified: SIGNATURE_SOLAR_LAST_VERIFIED });

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

  return (
    <main>
      {/* ─── HERO: answer, code, and the stacking fact, in one card ─── */}
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
            Black Friday {BLACK_FRIDAY.year} · <time dateTime={BLACK_FRIDAY.blackFridayIso}>{BLACK_FRIDAY.blackFriday}</time>
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
            {bfHeadline()}
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
            {bfAnswer()}
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
              {COUPON_CODE}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", justifyContent: "center" }}>
              <CopyCode />
              <a
                href={AFFILIATE_URL}
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
                Shop Signature Solar →
              </a>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: HERO.muted, margin: 0 }}>
            Code verified active on{" "}
            <time dateTime={SIGNATURE_SOLAR_LAST_VERIFIED_DATE} style={{ color: HERO.textSecondary }}>
              {SIGNATURE_SOLAR_LAST_VERIFIED}
            </time>{" "}
            ·{" "}
            <a href="/signature-solar-coupon" style={{ color: HERO.textSecondary }}>
              Full code details
            </a>
          </p>
        </div>
      </section>

      {/* ─── THIS YEAR'S DEALS — honest empty state until announced ─── */}
      <section style={{ ...section, backgroundColor: c.sectionBg }}>
        <div style={wrap}>
          <h2 style={h2}>Signature Solar Black Friday {BLACK_FRIDAY.year} Deals</h2>
          <p style={p}>{bfSaleStatus()}</p>
          {BLACK_FRIDAY.deals.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", border: `1px solid ${c.border}` }}>
              <thead>
                <tr style={{ backgroundColor: c.altBg }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: c.textMuted }}>Item</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: c.textMuted }}>Deal</th>
                </tr>
              </thead>
              <tbody>
                {BLACK_FRIDAY.deals.map((d) => (
                  <tr key={d.item}>
                    <td style={{ padding: "0.5rem 0.75rem", color: c.text, borderTop: `1px solid ${c.border}` }}>{d.item}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: c.textBody, borderTop: `1px solid ${c.border}` }}>{d.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ─── HOW TO STACK ─── */}
      <section style={{ ...section, backgroundColor: c.altBg }}>
        <div style={wrap}>
          <h2 style={h2}>How to Stack {COUPON_CODE} With Black Friday Pricing</h2>
          <ol style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {BF_STEPS.map((s) => (
              <li key={s.title} style={{ ...p, marginBottom: "0.875rem" }}>
                <strong style={{ color: c.text }}>{s.title}.</strong> {s.body}
              </li>
            ))}
          </ol>
          <p style={{ ...p, marginBottom: 0 }}>
            Not sure what to buy?{" "}
            <a href="/deals" style={{ color: c.text, textDecoration: "underline" }}>
              See the gear we run in real skoolie and overland builds
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ ...section, backgroundColor: c.sectionBg }}>
        <div style={wrap}>
          <h2 style={h2}>Signature Solar Black Friday FAQ</h2>
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
          Mobile Dwellings is a Signature Solar affiliate. Using code {COUPON_CODE} or the links on
          this page earns us a commission at no extra cost to you.
        </p>
      </section>
    </main>
  );
}
