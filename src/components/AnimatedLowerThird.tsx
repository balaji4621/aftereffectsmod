import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

interface AnimatedLowerThirdProps {
  name?: string;
  role?: string;
}

export const AnimatedLowerThird: React.FC<AnimatedLowerThirdProps> = ({
  name = 'ANTIGRAVITY AI',
  role = 'BEAT COMPOSITOR ENGINE',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const translateX = interpolate(entrance, [0, 1], [-400, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '60px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderLeft: '6px solid #00F2FE',
          borderRadius: '0 12px 12px 0',
          padding: '18px 32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '2px',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#00F2FE',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          {role}
        </span>
      </div>
    </AbsoluteFill>
  );
};
