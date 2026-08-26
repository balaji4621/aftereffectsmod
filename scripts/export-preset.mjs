import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const presetName = process.argv[2] || 'custom_export';
const presetsDir = path.join(projectRoot, 'ae_presets');
const outputPath = path.join(presetsDir, `${presetName}.json`);

if (!fs.existsSync(presetsDir)) {
  fs.mkdirSync(presetsDir, { recursive: true });
}

const customPreset = {
  presetName,
  version: '1.0.0',
  exportedAt: new Date().toISOString(),
  fps: 60,
  width: 1080,
  height: 1920,
  transitionDuration: 0.3,
  bezierVector: [0.25, 0.1, 0.25, 1.0],
  glow: {
    enabled: true,
    threshold: 40,
    radius: 65,
    intensity: 1.0,
  },
  colorBalance: {
    enabled: true,
    brightness: 10,
    contrast": 40,
  },
};

fs.writeFileSync(outputPath, JSON.stringify(customPreset, null, 2));
console.log(`[PresetExporter] Exported preset '${presetName}' -> ${outputPath}`);
