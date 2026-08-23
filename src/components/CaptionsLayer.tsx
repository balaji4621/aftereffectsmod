import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

export interface CaptionWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface CaptionsLayerProps {
  words?: CaptionWord[];
}

const DEFAULT_WORDS: CaptionWord[] = [
  { text: 'HIGH', startFrame: 0, endFrame: 20 },
  { text: 'ENERGY', startFrame: 20, endFrame: 45 },
  { text: 'ANTIGRAVITY', startFrame: 45, endFrame: 75 },
  { text: 'AI', startFrame: 75, endFrame: 95 },
  { text: 'VIDEO', startFrame: 95, endFrame: 125 },
  { text: 'PRODUCTION', startFrame: 125, endFrame: 160 },
];

export const CaptionsLayer: React.FC<CaptionsLayerProps> = ({ words = DEFAULT_WORDS }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find current active word
  const activeIndex = words.findIndex((w) => frame >= w.startFrame && frame <= w.endFrame);
  const activeWord = words[activeIndex] || words[0];

  const wordSpring = spring({
    frame: frame - activeWord.startFrame,
    fps,
    config: { damping: 10, stiffness: 220 },
  });

  const scale = interpolate(wordSpring, [0, 1], [0.7, 1.15]);
  const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
  const rotate = interpolate(wordSpring, [0, 1], [-6, 0]);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '160px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '16px 28px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        {words.map((word, idx) => {
          const isActive = idx === activeIndex;
          return (
            <span
              key={idx}
              style={{
                fontFamily,
                fontSize: '3.2rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: isActive ? '#00F2FE' : '#FFFFFF',
                textShadow: isActive
                  ? '0 0 20px rgba(0, 242, 254, 0.8), 0 0 40px rgba(0, 242, 254, 0.4)'
                  : '0 4px 10px rgba(0, 0, 0, 0.8)',
                transform: isActive ? `scale(${scale}) rotate(${rotate}deg)` : 'scale(1)',
                opacity: isActive ? opacity : 0.4,
                display: 'inline-block',
                transition: 'color 0.1s ease',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
