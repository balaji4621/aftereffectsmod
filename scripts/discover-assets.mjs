import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const publicDir = path.join(projectRoot, 'public');
const proxyDir = path.join(publicDir, 'proxies');
const outputManifestPath = path.join(projectRoot, 'src', 'generated', 'manifest.json');

if (!fs.existsSync(proxyDir)) {
  fs.mkdirSync(proxyDir, { recursive: true });
}

const generatedDir = path.dirname(outputManifestPath);
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

function getFFprobeData(filePath) {
  try {
    const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
    const stdout = execSync(cmd, { encoding: 'utf-8' });
    return JSON.parse(stdout);
  } catch (err) {
    // Fallback if ffprobe executable is not available in system PATH
    return null;
  }
}

function generateProxy(inputPath, outputPath) {
  if (fs.existsSync(outputPath)) {
    return;
  }
  console.log(`Generating proxy: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  try {
    const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale=-2:720,r=30" -c:v libx264 -preset superfast -crf 23 -c:a copy "${outputPath}"`;
    execSync(cmd, { stdio: 'ignore' });
  } catch (err) {
    // Gracefully handle if ffmpeg CLI is missing
  }
}

const files = fs.readdirSync(publicDir);
const items = [];

for (const file of files) {
  const fullPath = path.join(publicDir, file);
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) continue;

  const ext = path.extname(file).toLowerCase();
  let type = null;
  if (['.mp4', '.mov', '.mkv', '.webm', '.avi'].includes(ext)) type = 'video';
  else if (['.mp3', '.m4a', '.wav', '.flac', '.aac'].includes(ext)) type = 'audio';
  else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) type = 'image';

  if (!type) continue;

  const probeData = getFFprobeData(fullPath);
  let duration = 10;
  let width = type === 'video' ? 1080 : undefined;
  let height = type === 'video' ? 1920 : undefined;
  let fps = type === 'video' ? 60 : undefined;
  let hasAudio = type === 'audio';
  let proxyPath = undefined;

  if (probeData) {
    if (probeData.format && probeData.format.duration) {
      duration = parseFloat(probeData.format.duration);
    }

    if (probeData.streams) {
      const videoStream = probeData.streams.find(s => s.codec_type === 'video');
      const audioStream = probeData.streams.find(s => s.codec_type === 'audio');

      if (audioStream) hasAudio = true;

      if (videoStream) {
        width = videoStream.width;
        height = videoStream.height;
        if (videoStream.r_frame_rate) {
          const parts = videoStream.r_frame_rate.split('/');
          if (parts.length === 2 && parseFloat(parts[1]) > 0) {
            fps = Math.round(parseFloat(parts[0]) / parseFloat(parts[1]));
          } else {
            fps = parseFloat(videoStream.r_frame_rate);
          }
        }

        if ((height && height >= 2160) || (width && width >= 3840)) {
          const proxyFilename = `proxy_${file}`;
          const proxyFullPath = path.join(proxyDir, proxyFilename);
          generateProxy(fullPath, proxyFullPath);
          proxyPath = `public/proxies/${proxyFilename}`;
        }
      }
    }
  }

  items.push({
    id: path.parse(file).name,
    filename: file,
    filepath: `public/${file}`,
    ...(proxyPath ? { proxyPath } : {}),
    type,
    duration: Math.round(duration * 1000) / 1000,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(fps !== undefined ? { fps } : {}),
    ...(type === 'video' ? { hasAudio } : {}),
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  items,
};

fs.writeFileSync(outputManifestPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest successfully generated with ${items.length} items -> ${outputManifestPath}`);
