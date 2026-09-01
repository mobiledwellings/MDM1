/**
 * Types for the shared Signature Solar content module.
 *
 * The module itself is plain ESM (.mjs) rather than TypeScript because
 * scripts/prerender-seo.js imports it directly in Node at build time to bake
 * the page's schema.org graph into the static HTML — Node can't import .ts.
 * These declarations give the React page the same type safety it had when the
 * data lived inside the component.
 */

export const COUPON_CODE: string;
export const AFFILIATE_URL: string;
export const SITE_URL: string;
export const PAGE_URL: string;

export const AUTHOR: {
  name: string;
  role: string;
  url: string;
};

export const FEATURED_VIDEO: {
  id: string;
  start: number;
  title: string;
  description: string;
  caption: string;
  uploadDate: string;
};

export type BuildShot = {
  image: string;
  alt: string;
  blurb: string;
  videoId: string;
  videoStart: number;
  videoTitle: string;
  videoDescription: string;
  uploadDate: string;
  dealsHref?: string;
  dealsCtaLabel?: string;
};

export const BUILD_SHOTS: BuildShot[];

export type GearContentItem = {
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
  dealsHref?: string;
  dealsCtaLabel?: string;
};

export const GEAR_ITEMS: GearContentItem[];

export type FaqContentItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqContentItem[];

export function verifiedMonthLabel(isoDate: string): string;

export function buildSignatureSolarSchema(verification: {
  lastVerified: string;
  lastVerifiedDate: string;
}): Record<string, unknown>;
