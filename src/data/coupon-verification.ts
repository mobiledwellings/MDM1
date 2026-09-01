/**
 * Single source of truth for when the Signature Solar coupon was last checked.
 *
 * Both the dedicated coupon page (/signature-solar-coupon) and the coupon card
 * on /deals read from here, so the two can never show different dates.
 *
 * DO NOT EDIT BY HAND. After checking the code at signaturesolar.com, run:
 *
 *     npm run verify-coupon
 *
 * That script rewrites the two constants below to today's date. It is
 * deliberately not wired into the build or a cron job — the page states that a
 * person verified the code, so stamping it automatically would assert a check
 * nobody performed.
 */

/** Human-readable, e.g. "August 20, 2026". */
export const SIGNATURE_SOLAR_LAST_VERIFIED = "September 1, 2026";

/** ISO 8601, for <time datetime> and schema.org dates. */
export const SIGNATURE_SOLAR_LAST_VERIFIED_DATE = "2026-09-01";
