import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { EngineConfig } from '../types/media';

interface MotionBlurLayerProps {
  config: EngineConfig['motionBlur'];
  children: React.ReactNode;
}

export const MotionBlurLayer: React.FC<MotionBlurLayerProps> = ({ config, children }) => {
  if (!config.enabled) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  return (
    <CameraMotionBlur samples={config.samples}>
      <AbsoluteFill>{children}</AbsoluteFill>
    </CameraMotionBlur>
  );
};
