export const randomSeed = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};

export const seededRandom = (min: number, max: number, rng: () => number): number =>
  min + rng() * (max - min);

export const seededInt = (min: number, max: number, rng: () => number): number =>
  Math.floor(seededRandom(min, max + 1, rng));

export const pick = <T>(arr: T[], rng: () => number): T =>
  arr[Math.floor(rng() * arr.length)];

export const shuffle = <T>(arr: T[], rng: () => number): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const gaussianRandom = (rng: () => number): number => {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};
