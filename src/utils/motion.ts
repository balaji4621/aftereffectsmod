import bezierEasing from 'bezier-easing';

export type BezierVector = [number, number, number, number];

export const MOTION_CURVES = {
  standard: [0.25, 0.1, 0.25, 1.0] as BezierVector,
  easeIn: [0.42, 0.0, 1.0, 1.0] as BezierVector,
  easeOut: [0.0, 0.0, 0.58, 1.0] as BezierVector,
  easeInOut: [0.42, 0.0, 0.58, 1.0] as BezierVector,
  exponential: [0.87, 0.0, 0.13, 1.0] as BezierVector,
  bouncePeak: [0.175, 0.885, 0.32, 1.275] as BezierVector,
};

export function getRemotionEasing(curve: BezierVector | keyof typeof MOTION_CURVES) {
  const points: BezierVector = typeof curve === 'string' ? MOTION_CURVES[curve] : curve;
  const easingFn = bezierEasing(points[0], points[1], points[2], points[3]);
  return (progress: number): number => {
    const clamped = Math.max(0, Math.min(1, progress));
    return easingFn(clamped);
  };
}
