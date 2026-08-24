export interface CameraTransform3D {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

export function computeCameraPhysics(
  frame: number,
  intensity: number = 1.0,
  frequency: number = 0.15
): CameraTransform3D {
  const noiseX = Math.sin(frame * frequency * 1.1) * Math.cos(frame * frequency * 0.7);
  const noiseY = Math.cos(frame * frequency * 0.9) * Math.sin(frame * frequency * 1.3);
  const noiseZ = Math.sin(frame * frequency * 1.7);

  const translateX = noiseX * 18.0 * intensity;
  const translateY = noiseY * 18.0 * intensity;
  const translateZ = noiseZ * 45.0 * intensity;

  const rotateX = noiseY * 2.5 * intensity;
  const rotateY = noiseX * 2.5 * intensity;
  const rotateZ = noiseZ * 4.0 * intensity;

  return {
    translateX: Math.round(translateX * 100) / 100,
    translateY: Math.round(translateY * 100) / 100,
    translateZ: Math.round(translateZ * 100) / 100,
    rotateX: Math.round(rotateX * 100) / 100,
    rotateY: Math.round(rotateY * 100) / 100,
    rotateZ: Math.round(rotateZ * 100) / 100,
  };
}
