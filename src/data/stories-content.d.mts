/**
 * Types for the shared story content module.
 *
 * The module itself is plain ESM (.mjs) rather than TypeScript because
 * scripts/prerender-seo.js imports it directly in Node at build time to bake
 * each story's real copy and schema into the static HTML — Node can't import
 * .ts. These declarations give the React pages the same type safety.
 */

export type StoryBlock =
  | { t: "standfirst"; v: string }
  | { t: "p"; v: string }
  | { t: "h2"; v: string }
  | { t: "note"; v: string }
  | { t: "hr" }
  | { t: "img"; src: string; alt: string; cap?: string }
  | { t: "quote"; head?: string; paras: string[] }
  | { t: "table"; rows: string[][] };

export interface Story {
  slug: string;
  title: string;
  dek: string;
  hero: string;
  heroAlt: string;
  category: string;
  date: string;
  readingTime: string;
  photoCredit: string;
  keywords: string;
  blocks: StoryBlock[];
}

export const SITE_URL: string;
export const STORIES: Story[];
export function getStory(slug?: string): Story | undefined;

export function renderInlineHtml(text: string): string;
export function renderStoryHtml(story: Story): string;
export function renderStoriesIndexHtml(): string;
export function buildStorySchema(story: Story): Record<string, unknown>;
export function buildStoriesIndexSchema(): Record<string, unknown>;
