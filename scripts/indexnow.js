/**
 * IndexNow submitter
 *
 * After the sitemap is generated, this pings the IndexNow API with every URL
 * in build/sitemap.xml. IndexNow notifies Microsoft Bing, Yandex, and other
 * participating search engines instantly whenever the site is rebuilt/deployed
 * — which is also the fastest path into ChatGPT Search and Copilot.
 *
 * Ownership is proven by the key file hosted at:
 *   https://mobiledwellings.media/<KEY>.txt   (lives in public/)
 *
 * Runs as the last step of `npm run build`. Failures are non-fatal — a missed
 * ping should never break a deploy.
 */

const fs = require("fs");
const path = require("path");

const KEY = "2d3ab480dc362bb29eac1228d17e0d4b";
const HOST = "mobiledwellings.media";
const SITE_URL = `https://${HOST}`;
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function readSitemapUrls() {
  const sitemapPath = path.resolve(__dirname, "../build/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.warn("   ⚠️  build/sitemap.xml not found — skipping IndexNow ping");
    return [];
  }
  const xml = fs.readFileSync(sitemapPath, "utf-8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(urls)];
}

async function main() {
  console.log("🔔 IndexNow: notifying search engines...");

  const urlList = readSitemapUrls();
  if (urlList.length === 0) {
    console.log("   No URLs to submit.");
    return;
  }

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // IndexNow returns 200 or 202 on success.
    if (res.ok) {
      console.log(`   ✅ Submitted ${urlList.length} URLs (HTTP ${res.status})`);
    } else {
      console.warn(`   ⚠️  IndexNow responded HTTP ${res.status} — continuing build`);
    }
  } catch (err) {
    console.warn(`   ⚠️  IndexNow ping failed (${err.message}) — continuing build`);
  }
}

main();
