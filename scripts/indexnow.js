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
 * ping should never break a deploy. Uses the built-in https module (no global
 * fetch) so it works on any Node version Cloudflare Pages might use.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const KEY = "2d3ab480dc362bb29eac1228d17e0d4b";
const HOST = "mobiledwellings.media";
const SITE_URL = `https://${HOST}`;
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;

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

function postIndexNow(urlList) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    });
    const req = https.request(
      {
        hostname: "api.indexnow.org",
        path: "/indexnow",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on("error", (err) => resolve({ error: err.message }));
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log("🔔 IndexNow: notifying search engines...");

  const urlList = readSitemapUrls();
  if (urlList.length === 0) {
    console.log("   No URLs to submit.");
    return;
  }

  const result = await postIndexNow(urlList);
  if (result.error) {
    console.warn(`   ⚠️  IndexNow ping failed (${result.error}) — continuing build`);
  } else if (result.status === 200 || result.status === 202) {
    console.log(`   ✅ Submitted ${urlList.length} URLs to IndexNow (HTTP ${result.status})`);
  } else {
    console.warn(
      `   ⚠️  IndexNow responded HTTP ${result.status} ${result.body || ""} — continuing build`
    );
  }
}

main();
