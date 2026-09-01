export type EasingFunction = (t: number) => number;

export const linear: EasingFunction = (t) => t;

export const easeInQuad: EasingFunction = (t) => t * t;
export const easeOutQuad: EasingFunction = (t) => t * (2 - t);
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const easeInCubic: EasingFunction = (t) => t * t * t;
export const easeOutCubic: EasingFunction = (t) => --t * t * t + 1;
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

export const easeInQuart: EasingFunction = (t) => t * t * t * t;
export const easeOutQuart: EasingFunction = (t) => 1 - --t * t * t * t;
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;

export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * t - 10);
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeOutElastic: EasingFunction = (t) => {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};

export const easeOutBounce: EasingFunction = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};
