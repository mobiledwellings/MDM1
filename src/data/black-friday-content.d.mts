/** Types for black-friday-content.mjs (plain ESM so Node can import it at build time). */

export const BF_PATH: string;
export const BF_URL: string;
export const COUPON_CODE: string;
export const AFFILIATE_URL: string;

export type BlackFridayDeal = { item: string; detail: string };

export const BLACK_FRIDAY: {
  year: number;
  thanksgiving: string;
  blackFriday: string;
  blackFridayIso: string;
  cyberMonday: string;
  saleAnnounced: boolean;
  saleWindow: string | null;
  deals: BlackFridayDeal[];
  published: string;
  updated: string;
};

export function bfHeadline(): string;
export function bfAnswer(): string;
export function bfDescription(): string;
export function bfSaleStatus(): string;

export const BF_STEPS: { title: string; body: string }[];

export function bfFaq(v: { lastVerified: string }): { question: string; answer: string }[];

export function buildBlackFridaySchema(v: { lastVerified: string }): Record<string, unknown>;
