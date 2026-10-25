// Deterministic social-card layout using the original supplied logo.
// Run with `npm install --no-save sharp` and `node scripts/create-social-card.cjs`.
const fs = require('node:fs');
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  sharp = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'sharp'));
}
const root = path.join(__dirname, '..');
const logo = fs.readFileSync(path.join(root, 'dist/assets/green-way-transparent.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<defs><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#11ff1e" stroke-opacity=".065"/></pattern><radialGradient id="glow"><stop stop-color="#11ff1e" stop-opacity=".10"/><stop offset="1" stop-color="#11ff1e" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#000"/><rect x="650" width="550" height="630" fill="url(#grid)"/><ellipse cx="960" cy="315" rx="350" ry="310" fill="url(#glow)"/>
<rect x="65" y="63" width="7" height="7" fill="#11ff1e"/>
<text x="86" y="73" fill="#eef3e9" font-family="Arial,Helvetica,sans-serif" font-size="19" letter-spacing="3">SARL DZ GREEN WAY</text>
<text x="64" y="197" fill="#f1f3ed" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="700" letter-spacing="-3">Recycling Today</text>
<text x="64" y="282" fill="#f1f3ed" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="700" letter-spacing="-3">for Tomorrow’s</text>
<text x="60" y="395" fill="#11ff1e" font-family="Arial,Helvetica,sans-serif" font-size="115" font-weight="700" letter-spacing="-6">World.</text>
<image x="600" y="-39" width="700" height="700" xlink:href="data:image/png;base64,${logo}"/>
<text x="65" y="465" fill="#9ca694" font-family="Arial,Helvetica,sans-serif" font-size="19">A new PET recycling factory in development.</text>
<path d="M65 546H1135" stroke="#34412c"/>
<text x="65" y="584" fill="#11ff1e" font-family="Arial,Helvetica,sans-serif" font-size="15" letter-spacing="2">PET PLASTIC RECYCLING · ALGERIA</text>
<text x="1135" y="584" text-anchor="end" fill="#a0ad94" font-family="Arial,Helvetica,sans-serif" font-size="16">sarldzgreenway.xyz</text>
</svg>`;
sharp(Buffer.from(svg)).png({ palette: true, quality: 100, compressionLevel: 9 }).toFile(path.join(root, 'dist/assets/green-way-social-card-v1.png'))
  .then(() => console.log('Created 1200 × 630 social preview card.'));
