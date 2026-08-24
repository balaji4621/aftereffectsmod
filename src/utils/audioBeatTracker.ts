export interface BeatPulse {
  frame: number;
  timeSec: number;
  intensity: number;
  isDrop: boolean;
}

export interface BeatTrackerConfig {
  fps: number;
  bpm: number;
  sensitivity: number;
  dropThreshold: number;
}

export const defaultBeatConfig: BeatTrackerConfig = {
  fps: 60,
  bpm: 128,
  sensitivity: 0.75,
  dropThreshold: 0.9,
};

export function computeBeatPulses(durationSec: number, config: BeatTrackerConfig = defaultBeatConfig): BeatPulse[] {
  const totalFrames = Math.ceil(durationSec * config.fps);
  const secondsPerBeat = 60 / config.bpm;
  const framesPerBeat = secondsPerBeat * config.fps;

  const pulses: BeatPulse[] = [];

  for (let frame = 0; frame < totalFrames; frame++) {
    const timeSec = frame / config.fps;
    const beatIndex = Math.floor(frame / framesPerBeat);
    const frameOffset = frame % framesPerBeat;

    // Pulse decay simulation
    const decay = Math.max(0, 1 - frameOffset / (framesPerBeat * 0.4));
    const isMajorBeat = beatIndex % 4 === 0;
    const isDrop = isMajorBeat && Math.random() < 0.25;

    const intensity = Math.min(1.0, (decay * (isMajorBeat ? 1.0 : 0.6)) * config.sensitivity);

    pulses.push({
      frame,
      timeSec: Math.round(timeSec * 1000) / 1000,
      intensity: Math.round(intensity * 1000) / 1000,
      isDrop,
    });
  }

  return pulses;
}
