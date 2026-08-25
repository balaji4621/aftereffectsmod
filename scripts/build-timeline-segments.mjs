import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const manifestPath = path.join(projectRoot, 'src', 'generated', 'manifest.json');
const outputPath = path.join(projectRoot, 'src', 'generated', 'timeline-segments.json');

let manifest = { items: [] };
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

const videoItems = manifest.items.filter(i => i.type === 'video');
let currentTimeSec = 0;
const segments = videoItems.map((item, idx) => {
  const duration = item.duration || 2.5;
  const start = currentTimeSec;
  const end = start + duration;
  currentTimeSec = end;

  return {
    segmentId: `seg_${idx + 1}`,
    clipFilename: item.filename,
    startTimeSec: Math.round(start * 1000) / 1000,
    endTimeSec: Math.round(end * 1000) / 1000,
    durationSec: Math.round(duration * 1000) / 1000,
    transitionIn: idx === 0 ? 'none' : 'whipPanZoom',
  };
});

const timelineData = {
  totalDurationSec: Math.round(currentTimeSec * 1000) / 1000,
  totalSegments: segments.length,
  segments,
};

fs.writeFileSync(outputPath, JSON.stringify(timelineData, null, 2));
console.log(`Timeline segments JSON generated -> ${outputPath}`);
