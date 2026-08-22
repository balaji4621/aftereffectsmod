import { noise2D } from '@remotion/noise';

export const getProceduralCameraOffset = (
  frame: number,
  intensity: number = 0.15
): { x: number; y: number; rotate: number } => {
  const seedX = noise2D('camera-x', frame * 0.05, 0) * 15 * intensity;
  const seedY = noise2D('camera-y', 0, frame * 0.05) * 15 * intensity;
  const rotate = noise2D('camera-rot', frame * 0.03, frame * 0.03) * 1.5 * intensity;

  return { x: seedX, y: seedY, rotate };
};

export const getImpactShakeOffset = (
  frame: number,
  peakFrames: number[],
  intensity: number = 0.4
): { shakeX: number; shakeY: number; shakeRot: number } => {
  let totalShakeX = 0;
  let totalShakeY = 0;
  let totalShakeRot = 0;

  for (const peakFrame of peakFrames) {
    const delta = frame - peakFrame;
    if (delta >= 0 && delta <= 15) {
      // Decaying spring oscillation (15 frames decay window)
      const decay = Math.exp(-delta * 0.25);
      const osc = Math.sin(delta * 0.8) * decay * 25 * intensity;
      totalShakeX += osc * (delta % 2 === 0 ? 1 : -1);
      totalShakeY += osc * 0.7 * (delta % 3 === 0 ? -1 : 1);
      totalShakeRot += osc * 0.15;
    }
  }

  return { shakeX: totalShakeX, shakeY: totalShakeY, shakeRot: totalShakeRot };
};

export const getGlassmorphismStyle = (): React.CSSProperties => ({
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: 'rgba(18, 18, 24, 0.45)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  borderRadius: '12px',
});
