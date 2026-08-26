import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const publicDir = path.join(projectRoot, 'public');
const manifestPath = path.join(projectRoot, 'src', 'generated', 'manifest.json');

console.log('[Validator] Validating media assets in public/ directory...');

if (!fs.existsSync(publicDir)) {
  console.error('[Error] public/ directory missing.');
  process.exit(1);
}

const files = fs.readdirSync(publicDir);
const validExtensions = ['.mp4', '.mov', '.mp3', '.m4a', '.webm', '.jpg', '.png'];
let validCount = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (validExtensions.includes(ext)) {
    const stats = fs.statSync(path.join(publicDir, file));
    if (stats.size > 0) {
      validCount++;
    } else {
      console.warn(`[Warning] Empty media file detected: ${file}`);
    }
  }
}

console.log(`[Validator] Asset verification PASSED: ${validCount} valid media file(s) ready.`);
