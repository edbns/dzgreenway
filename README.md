# SARL DZ GREEN WAY

A single-page English landing page for a PET plastic recycling factory in development.

## Live site

https://sarldzgreenway.xyz/

## Preview

Serve `dist/` using any static HTTP server. No build or dependency installation is needed.

## Source

- `dist/index.html`: content and accessible controls
- `dist/style.css`: responsive black and electric-green layout (`#000000`, `#11ff1e`)
- `dist/app.js`: custom canvas bottle, flake and supplied-logo transformation
- `dist/assets/green-way-transparent.png`: original supplied logo, unchanged

The logo was supplied in https://github.com/edbns/dzgreenway (main, commit 08b2ef5).

Motion respects the system reduced-motion preference. Visitors can pause playback, select a transformation stage, use the keyboard-accessible progress slider, or reduce all motion. No tracking, contact form, address, or external runtime dependencies are included.

## Search and sharing

The page includes Algeria-focused metadata, canonical URL, Open Graph and large Twitter/X card tags, organization schema, robots.txt, and a sitemap. The 1200 × 630 share image is committed in `dist/assets/green-way-social-card-v1.png`; `scripts/create-social-card.cjs` recreates it with Sharp. Netlify serves the committed static files directly without a build step.
