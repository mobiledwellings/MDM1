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

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/rigs-for-sale", changefreq: "daily", priority: "0.9" },
  { path: "/sell-your-rig", changefreq: "monthly", priority: "0.8" },
  { path: "/skoolie-support", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/deals", changefreq: "weekly", priority: "0.6" },
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
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add individual rig pages
  for (const rig of rigs) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/rigs/${rig.id}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
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
