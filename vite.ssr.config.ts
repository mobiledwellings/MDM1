/**
 * SSR build for the prerenderer.
 *
 * Builds src/entry-ssr-signature-solar.tsx into a Node-importable bundle that
 * scripts/prerender-seo.js uses to render the coupon page's content to HTML at
 * build time. Output goes to .ssr-build/ (git-ignored, build artifact only).
 *
 * Emits .mjs so the CJS prerender script can `await import()` it — the root
 * package.json has no "type": "module", so a bare .js would be parsed as CJS
 * and blow up on the ESM syntax.
 *
 * Kept separate from vite.config.ts so a normal `vite build` is untouched.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Don't copy public/ into the SSR output — this bundle is a build-time
  // artifact, not something that gets served. Without this Vite duplicates
  // every asset in public/ (hundreds of MB of photos and video) on each build.
  publicDir: false,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    ssr: 'src/entry-ssr-signature-solar.tsx',
    outDir: '.ssr-build',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name].mjs',
      },
    },
  },
});
