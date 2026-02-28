/**
 * Generate beautiful gradient SVG placeholder images for ZenSnap puzzles.
 * Run: node scripts/generate-placeholders.cjs
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(OUT, { recursive: true });

const images = [
    {
        name: 'balance',
        colors: ['#0d9488', '#065f46', '#064e3b', '#022c22'],
        label: 'Balance',
        shapes: `
            <circle cx="512" cy="600" r="180" fill="rgba(255,255,255,0.06)" />
            <rect x="462" y="320" width="100" height="30" rx="15" fill="rgba(255,255,255,0.12)" />
            <rect x="472" y="280" width="80" height="30" rx="15" fill="rgba(255,255,255,0.10)" />
            <rect x="482" y="240" width="60" height="30" rx="15" fill="rgba(255,255,255,0.08)" />
            <circle cx="512" cy="210" r="25" fill="rgba(255,255,255,0.12)" />
            <ellipse cx="512" cy="700" rx="300" ry="40" fill="rgba(255,255,255,0.04)" />
        `,
    },
    {
        name: 'serenity-fox',
        colors: ['#ea580c', '#c2410c', '#1e3a5f', '#0f172a'],
        label: 'Serenity',
        shapes: `
            <circle cx="340" cy="500" r="120" fill="rgba(234,88,12,0.15)" />
            <circle cx="680" cy="400" r="80" fill="rgba(30,58,95,0.2)" />
            <polygon points="512,200 600,450 424,450" fill="rgba(255,255,255,0.05)" />
            <circle cx="490" cy="350" r="12" fill="rgba(255,255,255,0.2)" />
            <circle cx="534" cy="350" r="12" fill="rgba(255,255,255,0.2)" />
            <ellipse cx="512" cy="750" rx="350" ry="60" fill="rgba(30,58,95,0.15)" />
        `,
    },
    {
        name: 'lazy-days-panda',
        colors: ['#16a34a', '#166534', '#1a1a2e', '#0f0f17'],
        label: 'Lazy Days',
        shapes: `
            <circle cx="512" cy="450" r="150" fill="rgba(255,255,255,0.08)" />
            <circle cx="440" cy="370" r="50" fill="rgba(255,255,255,0.06)" />
            <circle cx="584" cy="370" r="50" fill="rgba(255,255,255,0.06)" />
            <circle cx="470" cy="400" r="15" fill="rgba(0,0,0,0.3)" />
            <circle cx="554" cy="400" r="15" fill="rgba(0,0,0,0.3)" />
            <rect x="200" y="600" width="30" height="300" rx="15" fill="rgba(22,163,74,0.15)" />
            <rect x="300" y="550" width="25" height="350" rx="12" fill="rgba(22,163,74,0.12)" />
            <rect x="700" y="580" width="28" height="320" rx="14" fill="rgba(22,163,74,0.13)" />
        `,
    },
    {
        name: 'flow-state-art',
        colors: ['#7c3aed', '#2dd4bf', '#ec4899', '#0f172a'],
        label: 'Flow State',
        shapes: `
            <circle cx="300" cy="350" r="200" fill="rgba(124,58,237,0.15)" />
            <circle cx="700" cy="650" r="220" fill="rgba(45,212,191,0.12)" />
            <circle cx="512" cy="512" r="160" fill="rgba(236,72,153,0.1)" />
            <ellipse cx="400" cy="600" rx="250" ry="100" fill="rgba(124,58,237,0.08)" transform="rotate(-20 400 600)" />
            <ellipse cx="620" cy="380" rx="200" ry="80" fill="rgba(45,212,191,0.08)" transform="rotate(30 620 380)" />
        `,
    },
    {
        name: 'kyoto-dreams',
        colors: ['#dc2626', '#f59e0b', '#92400e', '#1c1917'],
        label: 'Kyoto Dreams',
        shapes: `
            <rect x="462" y="200" width="100" height="400" rx="4" fill="rgba(255,255,255,0.06)" />
            <polygon points="512,160 580,240 444,240" fill="rgba(220,38,38,0.15)" />
            <polygon points="512,200 600,280 424,280" fill="rgba(220,38,38,0.12)" />
            <polygon points="512,250 620,340 404,340" fill="rgba(220,38,38,0.09)" />
            <circle cx="300" cy="500" r="120" fill="rgba(245,158,11,0.1)" />
            <circle cx="720" cy="500" r="100" fill="rgba(245,158,11,0.08)" />
            <ellipse cx="512" cy="750" rx="400" ry="50" fill="rgba(0,0,0,0.15)" />
        `,
    },
];

images.forEach(({ name, colors, label, shapes }) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="40%" stop-color="${colors[1]}" />
      <stop offset="75%" stop-color="${colors[2]}" />
      <stop offset="100%" stop-color="${colors[3]}" />
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)" />
  <g filter="url(#blur)">
    ${shapes}
  </g>
  <text x="512" y="900" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="rgba(255,255,255,0.08)">${label}</text>
</svg>`;

    fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
    console.log(`✓ ${name}.svg`);
});

// Create a tiny silent MP3 placeholder
// This is a minimal valid MP3 frame (~176 bytes)
const silentMp3 = Buffer.from(
    '//uQxAAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV' +
    'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
    'base64'
);
const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
fs.mkdirSync(soundsDir, { recursive: true });
fs.writeFileSync(path.join(soundsDir, 'snap.mp3'), silentMp3);
console.log('✓ snap.mp3 (silent placeholder)');

console.log('\nDone! All placeholders generated.');
