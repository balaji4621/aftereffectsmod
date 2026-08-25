export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorStats {
  mean: RGBColor;
  stdDev: RGBColor;
}

export function computeColorTransferRGB(
  sourcePixel: RGBColor,
  sourceStats: ColorStats,
  referenceStats: ColorStats,
  intensity: number = 1.0
): RGBColor {
  const mapChannel = (val: number, srcMean: number, srcStd: number, refMean: number, refStd: number): number => {
    const stdSafe = srcStd > 0.001 ? srcStd : 0.001;
    const matched = ((val - srcMean) / stdSafe) * refStd + refMean;
    const blended = val * (1 - intensity) + matched * intensity;
    return Math.max(0, Math.min(255, Math.round(blended)));
  };

  return {
    r: mapChannel(sourcePixel.r, sourceStats.mean.r, sourceStats.stdDev.r, referenceStats.mean.r, referenceStats.stdDev.r),
    g: mapChannel(sourcePixel.g, sourceStats.mean.g, sourceStats.stdDev.g, referenceStats.mean.g, referenceStats.stdDev.g),
    b: mapChannel(sourcePixel.b, sourceStats.mean.b, sourceStats.stdDev.b, referenceStats.mean.b, referenceStats.stdDev.b),
  };
}
