/**
 * Coupon verification date bumper.
 *
 *   npm run verify-coupon            → stamps today
 *   npm run verify-coupon 2026-08-17 → stamps a specific date
 *
 * WHY THIS EXISTS
 * The coupon page states "Verified active on <date> by Justin Smith of Mobile
 * Dwellings." That is a factual claim about a human testing the code, so this
 * script is deliberately NOT wired into the build or a cron job — running it on
 * a schedule would assert a check that nobody performed, which is both
 * misleading to readers and the kind of artificial freshness signal search
 * engines look for.
 *
 * THE ROUTINE (every few days, whenever Justin checks the code)
 *   1. Confirm MD50OFF still works at signaturesolar.com
 *   2. Run `npm run verify-coupon`
 *   3. Commit and deploy
 *
 * Freshness is the main signal the competing coupon pages beat us on, so the
 * date being genuinely current is worth the 30 seconds.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Single source of truth, imported by both /signature-solar-coupon and the
// coupon card on /deals — so one stamp updates every place the date appears.
const PAGE = join(__dirname, "..", "src", "data", "coupon-verification.ts");

/** Format a Date as "August 20, 2026" in a timezone-stable way. */
function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

function todayIso() {
  // Local date, not UTC — otherwise an evening run in the US stamps tomorrow.
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const arg = process.argv[2];
if (arg && !/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
  console.error(`✗ Invalid date "${arg}". Use YYYY-MM-DD, or pass nothing for today.`);
  process.exit(1);
}

const iso = arg ?? todayIso();
const pretty = longDate(iso);

let src = readFileSync(PAGE, "utf8");

const before = src;
// The ` = ` in each pattern keeps the first from also matching the _DATE
// constant, since that one is followed by `_` rather than a space.
src = src.replace(
  /export const SIGNATURE_SOLAR_LAST_VERIFIED = "[^"]*";/,
  `export const SIGNATURE_SOLAR_LAST_VERIFIED = "${pretty}";`
);
src = src.replace(
  /export const SIGNATURE_SOLAR_LAST_VERIFIED_DATE = "[^"]*";/,
  `export const SIGNATURE_SOLAR_LAST_VERIFIED_DATE = "${iso}";`
);

if (src === before) {
  console.error(
    "✗ Could not find SIGNATURE_SOLAR_LAST_VERIFIED / _DATE constants in\n  " +
      PAGE +
      "\n  Were they renamed or moved? Update this script to match."
  );
  process.exit(1);
}

writeFileSync(PAGE, src);

console.log(`✅ Coupon verified date set to ${pretty} (${iso})`);
console.log("   Next: commit and deploy so the date goes live.");
console.log("     git commit -am \"Re-verify Signature Solar coupon code\" && git push");
