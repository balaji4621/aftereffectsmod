import { clamp } from './math';

export interface Keyframe {
  frame: number;
  value: number;
  easing?: (t: number) => number;
}

export const interpolateAtFrame = (
  keyframes: Keyframe[],
  frame: number,
): number => {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0].value;

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  if (frame <= sorted[0].frame) return sorted[0].value;
  if (frame >= sorted[sorted.length - 1].frame)
    return sorted[sorted.length - 1].value;

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];

    if (frame >= curr.frame && frame <= next.frame) {
      const range = next.frame - curr.frame;
      const progress = range === 0 ? 0 : (frame - curr.frame) / range;
      const easedProgress = curr.easing ? curr.easing(progress) : progress;
      return curr.value + (next.value - curr.value) * easedProgress;
    }
  }

  return sorted[sorted.length - 1].value;
};

export const interpolateArray = (
  keyframes: Keyframe[],
  totalFrames: number,
): number[] => {
  return Array.from({ length: totalFrames }, (_, i) =>
    interpolateAtFrame(keyframes, i),
  );
};

export const createKeyframe = (
  frame: number,
  value: number,
  easing?: (t: number) => number,
): Keyframe => ({ frame, value, easing });
