/**
 * Sitemap Generator
 * 
 * Fetches all rigs from Supabase and generates a sitemap.xml
 * that includes every static page + every individual rig listing.
 * 
 * Run after build: node scripts/generate-sitemap.js
 */

const SUPABASE_PROJECT_ID = "yxvfynrvihhmjixjaeli";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dmZ5bnJ2aWhobWppeGphZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDMwODEsImV4cCI6MjA4MDM3OTA4MX0.gwAi4cx8o-YkpNnNgp8FkHg7His1mQpeN3JQqFi7PaA";
const API_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3ab5944d`;
const SITE_URL = "https://mobiledwellings.media";

const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];

// Static pages with their priorities and change frequencies.
//
// `sources` lists the files whose content actually renders that route. lastmod
// is the most recent git commit date across them — NOT the build date.
//
// WHY: this script used to stamp every URL with today's date on every build.
// That asserts the whole site changed on each deploy, which is false. Google
// only trusts lastmod when it is consistently accurate and starts ignoring the
// sitemap's dates entirely once it isn't — so a fake freshness signal costs the
// real one. It also makes traffic changes impossible to correlate with actual
// edits, since every page looks equally fresh every time.
const staticPages = [
  { path: "/", sources: ["src/pages/HomePage.tsx", "index.html"], changefreq: "weekly", priority: "1.0" },
  { path: "/rigs-for-sale", sources: ["src/pages/RigsForSalePage.tsx"], changefreq: "daily", priority: "0.9" },
  { path: "/sell-your-rig", sources: ["src/pages/SellYourRigPage.tsx"], changefreq: "monthly", priority: "0.8" },
  { path: "/skoolie-support", sources: ["src/pages/SkoolieSupportPage.tsx"], changefreq: "monthly", priority: "0.8" },
  { path: "/about", sources: ["src/pages/AboutPage.tsx"], changefreq: "monthly", priority: "0.7" },
  { path: "/deals", sources: ["src/pages/DealsPage.tsx", "src/components/DealsCouponHero.tsx", "src/data/deals-content.mjs", "src/data/coupon-verification.ts"], changefreq: "weekly", priority: "0.6" },
  { path: "/signature-solar-coupon", sources: ["src/pages/SignatureSolarCouponPage.tsx", "src/pages/SignatureSolarCouponMain.tsx", "src/data/signature-solar-content.mjs", "src/data/coupon-verification.ts"], changefreq: "monthly", priority: "0.9" },
  { path: "/partners", sources: ["src/pages/PartnersPage.tsx", "src/data/partners.tsx"], changefreq: "monthly", priority: "0.7" },
  // Partner pages rendered by the generic template. Keep in sync with
  // PARTNERS in src/data/partners.tsx (one entry per published partner slug).
  { path: "/partners/onx-offroad", sources: ["src/pages/PartnerPage.tsx", "src/data/partners.tsx"], changefreq: "monthly", priority: "0.8" },
  { path: "/partners/wattcycle", sources: ["src/pages/PartnerPage.tsx", "src/data/partners.tsx"], changefreq: "monthly", priority: "0.8" },
];

async function fetchRigs() {
  try {
    const response = await fetch(`${API_BASE_URL}/rigs`, {
      headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });

    if (!response.ok) {
      console.error(`Failed to fetch rigs: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.rigs || [];
  } catch (error) {
    console.error("Error fetching rigs:", error);
    return [];
  }
}

const { execFileSync } = require("child_process");

/**
 * Most recent git commit date (YYYY-MM-DD) across a set of files.
 *
 * Falls back to today's date when git history isn't available — a shallow CI
 * clone, or a file that isn't committed yet. That fallback is the old behavior,
 * so a build in a stripped environment degrades rather than breaks.
 */
function lastCommitDate(files) {
  let newest = null;
  for (const file of files) {
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
        cwd: path.resolve(__dirname, ".."),
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (out && (!newest || out > newest)) newest = out;
    } catch {
      // git missing or file untracked — ignore this source
    }
  }
  return newest || today;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

function buildSitemap(rigs) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${lastCommitDate(page.sources || [])}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add individual rig pages
  for (const rig of rigs) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/rigs/${rig.id}</loc>\n`;
    // Prefer the listing's own timestamp; fall back to today only if absent.
    const rigDate = (rig.updatedAt || rig.updated_at || rig.createdAt || rig.created_at || "")
      .toString()
      .split("T")[0];
    xml += `    <lastmod>${/^\d{4}-\d{2}-\d{2}$/.test(rigDate) ? rigDate : today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

async function main() {
  console.log("🗺️  Generating sitemap...");

  const rigs = await fetchRigs();
  console.log(`   Found ${rigs.length} rigs`);

  const sitemap = buildSitemap(rigs);

  // Write to build output
  const buildPath = path.resolve(__dirname, "../build/sitemap.xml");
  fs.writeFileSync(buildPath, sitemap, "utf-8");
  console.log(`   ✅ Written to ${buildPath}`);

  // Also update public/ source so it stays in sync
  const publicPath = path.resolve(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(publicPath, sitemap, "utf-8");
  console.log(`   ✅ Written to ${publicPath}`);

  console.log(`   📄 Total URLs: ${staticPages.length + rigs.length}`);
}

main();
