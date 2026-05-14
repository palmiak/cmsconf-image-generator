# CMSConf Image Generator

A browser-based social image generator for CMSConf attendees, speakers, partners, and sponsors. Users can upload a photo, pick a theme, enter their name and role, and download a ready-to-share 1080×1080 PNG.

## Features

- Upload a profile photo (auto-cropped to circle)
- Multiple color themes
- Custom name and role text
- One-click PNG download at 1080×1080

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the local dev server)

### Install & run

```bash
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

For production serving:

```bash
npm start
```

## Project Structure

```
.
├── index.html          # Single-page app (HTML + CSS + JS)
├── data/
│   └── images/
│       ├── template.svg    # SVG overlay (logo + circle ring)
│       ├── bg-ocean.svg    # Background layer for the Ocean theme
│       ├── bg-ocean.png    # Rasterised background for the Ocean theme
│       ├── light-bg.png    # Background for the Light theme
│       └── logo.svg        # CMSConf logo
└── tools/
    ├── extract-bg.js       # Extracts background layers from template.svg → bg-ocean.svg
    └── strip-template.js   # Strips background layers from template.svg, leaving a transparent overlay
```

## Dev Tools

The scripts in `tools/` are one-off Node.js utilities used to prepare the SVG assets:

| Script | Purpose |
|---|---|
| `tools/extract-bg.js` | Extracts background elements from `template.svg` and saves them as `bg-ocean.svg` |
| `tools/strip-template.js` | Removes background fills from `template.svg` so it becomes a transparent overlay (logo + circle ring only) |

Run them directly with Node:

```bash
node tools/extract-bg.js
node tools/strip-template.js
```
