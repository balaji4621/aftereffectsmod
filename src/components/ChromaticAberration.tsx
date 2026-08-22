import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EngineConfig } from '../types/media';

interface ChromaticAberrationProps {
  config: EngineConfig['effects'];
  peakFrames: number[];
  children: React.ReactNode;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  config,
  peakFrames,
  children,
}) => {
  const frame = useCurrentFrame();

  if (!config.chromaticAberration) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Calculate RGB split offset based on peak impact frames
  let offset = 0;
  if (config.rgbSplitOnImpact) {
    for (const pf of peakFrames) {
      const delta = frame - pf;
      if (delta >= 0 && delta <= 8) {
        offset += (1 - delta / 8) * 8;
      }
    }
  }

  if (offset <= 0.5) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  return (
    <AbsoluteFill>
      {/* Red Channel Shift */}
      <AbsoluteFill
        style={{
          transform: `translateX(${-offset}px)`,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 1px rgba(255,0,0,0.7))',
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Blue Channel Shift */}
      <AbsoluteFill
        style={{
          transform: `translateX(${offset}px)`,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 1px rgba(0,0,255,0.7))',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
