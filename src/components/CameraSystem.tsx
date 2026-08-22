import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { EngineConfig } from '../types/media';
import { getProceduralCameraOffset, getImpactShakeOffset } from '../utils/effects';

interface CameraSystemProps {
  config: EngineConfig['camera'];
  peakFrames: number[];
  children: React.ReactNode;
}

export const CameraSystem: React.FC<CameraSystemProps> = ({
  config,
  peakFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (!config.enabled) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Procedural handheld drift (noise2D)
  const drift = getProceduralCameraOffset(frame, config.driftIntensity);

  // Impact beat camera shake
  const shake = getImpactShakeOffset(frame, peakFrames, config.shakeIntensity);

  // Smooth Ken Burns zoom push
  const zoomPush = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, config.zoomPushAmount],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      extrapolateRight: 'clamp',
    }
  );

  const totalX = drift.x + shake.shakeX;
  const totalY = drift.y + shake.shakeY;
  const totalRotate = drift.rotate + shake.shakeRot;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${zoomPush}) translate3d(${totalX}px, ${totalY}px, 0px) rotate(${totalRotate}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
