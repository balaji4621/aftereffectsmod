export interface TrackMixerConfig {
  volumeDb: number;
  pan: number; // -1.0 (Left) to 1.0 (Right)
  isMuted: boolean;
}

export function computeStereoPanGains(pan: number): [number, number] {
  const clampedPan = Math.max(-1.0, Math.min(1.0, pan));
  // Equal power panning curve
  const angle = ((clampedPan + 1) * Math.PI) / 4;
  const leftGain = Math.cos(angle);
  const rightGain = Math.sin(angle);

  return [Math.round(leftGain * 1000) / 1000, Math.round(rightGain * 1000) / 1000];
}

export function dbToLinearGain(volumeDb: number): number {
  if (volumeDb <= -60) return 0;
  return Math.pow(10, volumeDb / 20);
}
