#!/usr/bin/env node
/**
 * Extracts the background layers from template.svg and saves as bg-ocean.svg.
 *
 * SVG structure (92 lines):
 *   1–24   : background elements (rect fill, texture, concentric rings, glow circle)
 *   25–69  : logo + text elements (to be excluded)
 *   70     : </g>  ← closes outer clip group (we provide our own)
 *   71–92  : <defs> … </defs></svg>
 */

const fs   = require('fs');
const path = require('path');

const src  = path.join(__dirname, '..', 'data', 'images', 'template.svg');
const dest = path.join(__dirname, '..', 'data', 'images', 'bg-ocean.svg');

const text  = fs.readFileSync(src, 'utf8');
const lines = text.split('\n');

// lines array is 0-indexed; SVG line N = lines[N-1]
const bgContent  = lines.slice(0, 24).join('\n');   // lines 1–24
const defsAndEnd = lines.slice(70).join('\n');       // lines 71–92 (0-index 70+)

const output = bgContent + '\n</g>\n' + defsAndEnd;

fs.writeFileSync(dest, output, 'utf8');

const sizeKB = (fs.statSync(dest).size / 1024).toFixed(1);
console.log(`Saved ${dest} (${sizeKB} KB)`);
