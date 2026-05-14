#!/usr/bin/env node
/**
 * Strips background layers from template.svg so it becomes a transparent overlay
 * containing only the logo + concentric circle ring.
 *
 * Removes:
 *   lines 3–7   : solid fill rect + texture pattern overlay
 *   lines 16–24 : photo-circle fill + colour blend + blur glow
 *
 * Removes from <defs>:
 *   pattern0, pattern1  : background texture patterns (large embedded JPEGs)
 *   filter0             : Gaussian blur used by the glow circle
 *   clip1               : photo-circle clip path (no longer used)
 *   image0, image1      : embedded JPEG data
 *
 * Keeps in <defs>:
 *   clip0               : outer 1080×1080 clip used by the root <g>
 */

const fs   = require('fs');
const path = require('path');

const src  = path.join(__dirname, '..', 'data', 'images', 'template.svg');
const dest = src; // overwrite in-place (original saved below)
const bak  = path.join(__dirname, '..', 'data', 'images', 'template.original.svg');

const text  = fs.readFileSync(src, 'utf8');
const lines = text.split('\n');

// Preserve original if not already done
if (!fs.existsSync(bak)) {
  fs.writeFileSync(bak, text, 'utf8');
  console.log(`Backup saved → ${bak}`);
}

// ── Build overlay SVG ────────────────────────────────────────────────────────
// lines[] is 0-indexed; file line N → lines[N-1]

const header     = lines.slice(0, 2);               // lines 1–2  : <svg> + outer <g>
const rings      = lines.slice(7, 15);              // lines 8–15 : concentric circle rings
const logoText   = lines.slice(24, 70);             // lines 25–70: logo + close </g>
const clip0Def   = lines.slice(82, 85);             // lines 83–85: clip0 clipPath

const minimalDefs = [
  '<defs>',
  ...clip0Def,
  '</defs>',
  '</svg>',
];

const output = [
  ...header,
  ...rings,
  ...logoText,
  ...minimalDefs,
].join('\n');

fs.writeFileSync(dest, output, 'utf8');

const sizeKB = (fs.statSync(dest).size / 1024).toFixed(1);
console.log(`Overlay template saved → ${dest} (${sizeKB} KB)`);
