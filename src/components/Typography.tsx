import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { getGlassmorphismStyle } from '../utils/effects';

const { fontFamily } = loadFont();

interface TypographyProps {
  title: string;
  subtitle: string;
}

export const Typography: React.FC<TypographyProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title spring entrance animation
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const letterSpacing = interpolate(titleSpring, [0, 1], [10, 2]);

  // Subtitle staggered spring entrance
  const subSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const subY = interpolate(subSpring, [0, 1], [25, 0]);
  const subOpacity = interpolate(subSpring, [0, 1], [0, 0.85]);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 40px',
      }}
    >
      <div
        style={{
          ...getGlassmorphismStyle(),
          padding: '36px 64px',
          textAlign: 'center',
          maxWidth: '85%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontFamily,
            fontSize: '4.2rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
          }}
        >
          {title}
        </h1>

        <div
          style={{
            fontFamily,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#94A3B8',
            margin: 0,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            transform: `translateY(${subY}px)`,
            opacity: subOpacity,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
