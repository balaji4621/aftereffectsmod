export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export const rgbToHex = (rgb: RGB): string => {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return #;
};

export const hexToRgb = (hex: string): RGB => {
  const cleaned = hex.replace('#', '');
  return {
    r: parseInt(cleaned.substring(0, 2), 16) / 255,
    g: parseInt(cleaned.substring(2, 4), 16) / 255,
    b: parseInt(cleaned.substring(4, 6), 16) / 255,
  };
};

export const rgbToHsv = (rgb: RGB): HSV => {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max === min) return { h: 0, s, v };

  let h = 0;
  if (max === rgb.r) h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
  else if (max === rgb.g) h = (rgb.b - rgb.r) / d + 2;
  else h = (rgb.r - rgb.g) / d + 4;

  return { h: h / 6, s, v };
};

export const lerpColor = (a: RGB, b: RGB, t: number): RGB => ({
  r: a.r + (b.r - a.r) * t,
  g: a.g + (b.g - a.g) * t,
  b: a.b + (b.b - a.b) * t,
});
