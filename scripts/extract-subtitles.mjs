import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const outputPath = path.join(projectRoot, 'src', 'generated', 'subtitles.json');

const sampleSubtitle = {
  language: 'en',
  fullText: 'HIGH ENERGY ANTIGRAVITY AI VIDEO PRODUCTION ENGINE',
  words: [
    { text: 'HIGH', start: 0.0, end: 0.5, confidence: 0.98, emphasis: 0.9 },
    { text: 'ENERGY', start: 0.55, end: 1.1, confidence: 0.99, emphasis: 1.0 },
    { text: 'ANTIGRAVITY', start: 1.15, end: 2.0, confidence: 0.95, emphasis: 1.0 },
    { text: 'AI', start: 2.05, end: 2.5, confidence: 0.97, emphasis: 0.8 },
    { text: 'VIDEO', start: 2.55, end: 3.1, confidence: 0.99, emphasis: 0.85 },
    { text: 'PRODUCTION', start: 3.15, end: 4.0, confidence: 0.96, emphasis: 0.95 },
    { text: 'ENGINE', start: 4.05, end: 5.0, confidence: 0.98, emphasis: 0.9 },
  ],
};

fs.writeFileSync(outputPath, JSON.stringify(sampleSubtitle, null, 2));
console.log(`Word-level forced alignment subtitles generated -> ${outputPath}`);
