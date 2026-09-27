import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const src = path.join(rootDir, 'index.html');
const destDir = path.join(rootDir, 'public');
const dest = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
fs.copyFileSync(src, path.join(destDir, 'game.html'));

// Sync MMG logo favicons
const logoSrc = path.join(rootDir, 'assets', 'refresh', 'v11', 'sprites', 'logo.png');
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, path.join(destDir, 'favicon.png'));
  fs.copyFileSync(logoSrc, path.join(destDir, 'apple-touch-icon.png'));
  const appDir = path.join(rootDir, 'app');
  if (fs.existsSync(appDir)) {
    fs.copyFileSync(logoSrc, path.join(appDir, 'icon.png'));
  }

  // Generate valid ICO containing PNG data
  const png = fs.readFileSync(logoSrc);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(0, 6);
  header.writeUInt8(0, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  const ico = Buffer.concat([header, png]);
  fs.writeFileSync(path.join(destDir, 'favicon.ico'), ico);
  fs.writeFileSync(path.join(rootDir, 'favicon.ico'), ico);
}

console.log('✓ Successfully synced index.html & MMG favicons -> public/ for Vercel deployment');
