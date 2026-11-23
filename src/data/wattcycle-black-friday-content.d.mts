/** Types for wattcycle-black-friday-content.mjs (plain ESM so Node can import it at build time). */

export const WC_COUPON_CODE: string;
export const WC_DISCOUNT_PCT: number;
export const WC_AFFILIATE_URL: string;
export const WC_BF_PATH: string;
export const WC_BF_URL: string;
export const WC_PARTNER_PATH: string;
export const WC_PROOF_IMAGE: string;
export const WC_OG_IMAGE: string;

export function wcProductUrl(handle: string): string;

export type WattCycleDeal = {
  name: string;
  short: string;
  handle: string;
  image: string;
  imageAlt: string;
  pack: string;
  kwh: number;
  was: number;
  sale: number;
  note: string;
};

export const WC_BLACK_FRIDAY: {
  year: number;
  blackFriday: string;
  cyberMonday: string;
  saleWindow: string;
  saleEnd: string;
  saleEndIso: string;
  verified: string;
  verifiedIso: string;
  published: string;
  updated: string;
  deals: WattCycleDeal[];
};

export function wcCodeSavings(price: number): number;
export function wcFinalPrice(price: number): number;
export function wcPerKwh(deal: WattCycleDeal): number;
export function wcMoney(n: number): string;
export function wcBfIsLive(todayIso?: string): boolean;
export function wcBfHeadline(): string;
export function wcBfAnswer(): string;
export function wcBfDescription(): string;

export const WC_BF_STEPS: { title: string; body: string }[];

export function wcBfFaq(): { question: string; answer: string }[];

export function buildWattCycleBlackFridaySchema(): Record<string, unknown>;
