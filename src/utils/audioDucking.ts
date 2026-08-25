export interface DuckingSettings {
  duckedVolumeDb: number;
  normalVolumeDb: number;
  attackSec: number;
  releaseSec: number;
}

export const defaultDuckingSettings: DuckingSettings = {
  duckedVolumeDb: -12.0,
  normalVolumeDb: 0.0,
  attackSec: 0.15,
  releaseSec: 0.35,
};

export function calculateDuckedGain(
  isVoiceActive: boolean,
  currentGain: number,
  deltaSec: number,
  settings: DuckingSettings = defaultDuckingSettings
): number {
  const targetGain = isVoiceActive
    ? Math.pow(10, settings.duckedVolumeDb / 20)
    : Math.pow(10, settings.normalVolumeDb / 20);

  const rate = isVoiceActive ? deltaSec / settings.attackSec : deltaSec / settings.releaseSec;
  const newGain = currentGain + (targetGain - currentGain) * Math.min(1.0, rate);

  return Math.max(0.0, Math.min(1.0, Math.round(newGain * 1000) / 1000));
}
