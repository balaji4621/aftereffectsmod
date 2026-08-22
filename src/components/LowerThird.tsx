import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Sparkles, Activity } from 'lucide-react';
import { loadFont } from '@remotion/google-fonts/Inter';
import { getGlassmorphismStyle } from '../utils/effects';

const { fontFamily } = loadFont();

interface LowerThirdProps {
  label?: string;
  sublabel?: string;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  label = 'AUTONOMOUS REMOTION PIPELINE',
  sublabel = 'AFTER EFFECTS-GRADE COMPOSITOR',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation at frame 20
  const cardSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const translateX = interpolate(cardSpring, [0, 1], [-120, 0]);
  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '60px 80px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          ...getGlassmorphismStyle(),
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 28px',
          transform: `translateX(${translateX}px)`,
          opacity,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          <Sparkles size={24} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div
            style={{
              fontFamily,
              fontSize: '1rem',
              fontWeight: 700,
              color: '#F8FAFC',
              letterSpacing: '1px',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#818CF8',
              letterSpacing: '1.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Activity size={12} />
            {sublabel}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
