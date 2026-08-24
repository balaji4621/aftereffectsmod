import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const manifestPath = path.join(projectRoot, 'src', 'generated', 'manifest.json');
const outputPath = path.join(projectRoot, 'src', 'generated', 'ai-template.json');

let manifest = { items: [] };
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

const videoItems = manifest.items.filter(i => i.type === 'video');
const templateClips = videoItems.map((item, idx) => ({
  clipIndex: idx + 1,
  filename: item.filename,
  durationSec: item.duration || 2.5,
  framing: idx % 2 === 0 ? 'Close-Up Action' : 'Wide Spatial Motion',
  speedRamp: idx % 3 === 0 ? 'Hypnotic Curve' : 'Standard 1:1',
}));

const aiTemplate = {
  version: '2.0.0-AI',
  generatedAt: new Date().toISOString(),
  targetAspect: '9:16 Vertical Shorts',
  targetBpm: 128,
  visualTheme: 'Cyberpunk Hyper-Edit',
  clips: templateClips,
};

fs.writeFileSync(outputPath, JSON.stringify(aiTemplate, null, 2));
console.log(`AI Template Spec successfully generated -> ${outputPath}`);
