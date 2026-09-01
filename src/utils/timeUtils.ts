export const framesToSeconds = (frames: number, fps: number): number =>
  frames / fps;

export const secondsToFrames = (seconds: number, fps: number): number =>
  Math.round(seconds * fps);

export const formatTimecode = (
  totalSeconds: number,
  fps: number = 30,
): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const frames = Math.round((totalSeconds % 1) * fps);
  return ${String(hours).padStart(2, '0')}:::;
};

export const parseTimecode = (timecode: string, fps: number = 30): number => {
  const parts = timecode.split(':').map(Number);
  if (parts.length !== 4) throw new Error('Invalid timecode format');
  const [h, m, s, f] = parts;
  return h * 3600 + m * 60 + s + f / fps;
};

export const msToFrames = (ms: number, fps: number): number =>
  Math.round((ms / 1000) * fps);

export const framesToMs = (frames: number, fps: number): number =>
  (frames / fps) * 1000;
