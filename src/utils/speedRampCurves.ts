export type SpeedRampType = 'linear' | 'exponential' | 'parabolicSlowMo' | 'whipPanFast';

export interface SpeedRampPoint {
  timeProgress: number; // Normalized 0.0 to 1.0
  velocityMultiplier: number;
}

export function evaluateSpeedVelocity(
  progress: number,
  rampType: SpeedRampType = 'parabolicSlowMo'
): number {
  const p = Math.max(0, Math.min(1, progress));

  switch (rampType) {
    case 'exponential':
      return Math.pow(p, 2.5) * 3.0 + 0.2;
    case 'parabolicSlowMo':
      // Dips down to 0.2x speed in the middle (0.5), peaks at 2.0x at ends
      return 4 * Math.pow(p - 0.5, 2) * 1.8 + 0.2;
    case 'whipPanFast':
      // Sudden 4.0x speed burst in the middle
      return Math.exp(-Math.pow((p - 0.5) * 8, 2)) * 3.5 + 0.5;
    case 'linear':
    default:
      return 1.0;
  }
}
