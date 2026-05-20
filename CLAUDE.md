# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Watch CSS + serve on http://localhost:8080
npm start          # Build CSS (minified) + serve
npm run build:css  # One-off minified CSS build
npm run watch:css  # Watch CSS only (no server)
```

The app must be served over HTTP (not opened as a file) — SVG loading via `fetch` fails with `file://`.

One-off SVG asset preparation tools (not part of regular dev):
```bash
node tools/extract-bg.js      # Extract background layers from template.svg → bg-ocean.svg
node tools/strip-template.js  # Strip background fills from template.svg → transparent overlay
```

## Architecture

This is a **single-page, no-framework** app. All logic lives in `index.html` as an inline `<script>` block (~480 lines). There is no build step for JS.

**CSS**: Tailwind v4 with a custom theme defined in `src/input.css`. Output goes to `dist/output.css`. Custom design tokens: `--color-bg`, `--color-surface`, `--color-surface2`, `--color-accent` (`#3CFFD0`), `--color-muted`. Two font families: `font-sans` (Montserrat, from Google Fonts) and `font-display` (Clash Display, self-hosted woff2).

**Rendering pipeline** (Canvas 2D, 1080x1080 logical px, DPR-scaled):
1. Draw background image (`bg-ocean.png` or `light-bg.png`) from `bgImageCache`
2. Draw SVG overlay (`template.svg`, theme-coloured via string replace) from `svgImageCache`
3. Clip user photo to circle (cx=540, cy=540, r=325), optionally with bg fill and grayscale filter
4. Re-blit background patch over the SVG's hardcoded role text area, then draw role text in Clash Display

**State**: All mutable state is module-level variables — `currentRole`, `currentTheme`, `userPhoto`, `svgTemplate`, `photoBgColor`, `photoScale`, `photoMonochrome`. Render is debounced via a `rendering`/`renderQueued` flag pair (`scheduleRender` → `doRender` → `render`).

**Themes**: Defined in the `THEMES` array at the top of the script. Each theme object carries `bgImage`, `bg`, `accent`, `fg`, `fgSub`, and optional `logoShape`/`roleFg`/`group` overrides. SVG theming is done by global string replace on a set of hardcoded hex values from the source SVG.

**Download**: Exports a clean 1080x1080 canvas (downsampled from the DPR-scaled offscreen canvas) as PNG, then opens the share modal.

**Deployment**: GitHub Actions (`.github/workflows/deploy.yml`) builds CSS and deploys `index.html` + `data/` + `dist/` to GitHub Pages on push to `main`.
