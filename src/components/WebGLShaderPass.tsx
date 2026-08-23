import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

interface WebGLShaderPassProps {
  children?: React.ReactNode;
  chromaticAberrationIntensity?: number;
  grainIntensity?: number;
}

export const WebGLShaderPass: React.FC<WebGLShaderPassProps> = ({
  children,
  chromaticAberrationIntensity = 0.008,
  grainIntensity = 0.05,
}) => {
  const frame = useCurrentFrame();

  // Procedural chromatic aberration and film grain post-processing filter
  const redOffset = Math.sin(frame * 0.1) * chromaticAberrationIntensity * 10;
  const blueOffset = -Math.cos(frame * 0.1) * chromaticAberrationIntensity * 10;

  return (
    <AbsoluteFill>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          filter: `drop-shadow(${redOffset}px 0px 0px rgba(255,0,0,0.5)) drop-shadow(${blueOffset}px 0px 0px rgba(0,0,255,0.5))`,
        }}
      >
        {children}
      </div>

      {/* Procedural Film Grain Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: grainIntensity,
          backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%)`,
          backgroundSize: '4px 4px',
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};
