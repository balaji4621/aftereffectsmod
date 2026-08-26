export interface MotionVector2D {
  vx: number;
  vy: number;
  magnitude: number;
  angleRad: number;
}

export function computeMotionVector(
  prevPos: [number, number],
  currentPos: [number, number],
  shutterAngle: number = 180
): MotionVector2D {
  const vx = currentPos[0] - prevPos[0];
  const vy = currentPos[1] - prevPos[1];
  const magnitude = Math.sqrt(vx * vx + vy * vy) * (shutterAngle / 360);
  const angleRad = Math.atan2(vy, vx);

  return {
    vx: Math.round(vx * 100) / 100,
    vy: Math.round(vy * 100) / 100,
    magnitude: Math.round(magnitude * 100) / 100,
    angleRad: Math.round(angleRad * 1000) / 1000,
  };
}
