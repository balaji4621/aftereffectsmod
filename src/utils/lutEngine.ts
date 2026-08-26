export interface LUT3D {
  title: string;
  size: number;
  data: Float32Array;
}

export function createIdentityLUT(size: number = 33): LUT3D {
  const data = new Float32Array(size * size * size * 3);
  let idx = 0;

  for (let r = 0; r < size; r++) {
    for (let g = 0; g < size; g++) {
      for (let b = 0; b < size; b++) {
        data[idx++] = r / (size - 1);
        data[idx++] = g / (size - 1);
        data[idx++] = b / (size - 1);
      }
    }
  }

  return {
    title: 'Identity_3D_LUT',
    size,
    data,
  };
}

export function sampleLUT3D(lut: LUT3D, r: number, g: number, b: number): [number, number, number] {
  const s = lut.size - 1;
  const ri = Math.min(s, Math.max(0, Math.round(r * s)));
  const gi = Math.min(s, Math.max(0, Math.round(g * s)));
  const bi = Math.min(s, Math.max(0, Math.round(b * s)));

  const index = (ri * lut.size * lut.size + gi * lut.size + bi) * 3;
  return [lut.data[index], lut.data[index + 1], lut.data[index + 2]];
}
