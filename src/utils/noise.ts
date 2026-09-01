const permutation: number[] = [];
for (let i = 0; i < 256; i++) permutation[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
}
const p = [...permutation, ...permutation];

const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);

const grad = (hash: number, x: number, y: number): number => {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

export const perlin2D = (x: number, y: number): number => {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);

  const aa = p[p[xi] + yi];
  const ab = p[p[xi] + yi + 1];
  const ba = p[p[xi + 1] + yi];
  const bb = p[p[xi + 1] + yi + 1];

  return (
    v * (u * grad(bb, xf - 1, yf - 1) + (1 - u) * grad(ba, xf, yf - 1)) +
    (1 - v) * (u * grad(ab, xf - 1, yf) + (1 - u) * grad(aa, xf, yf))
  );
};

export const fractalNoise = (
  x: number,
  y: number,
  octaves: number = 4,
  persistence: number = 0.5,
  lacunarity: number = 2,
): number => {
  let total = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += perlin2D(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return total / maxValue;
};
