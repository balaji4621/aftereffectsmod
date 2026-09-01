import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface TypewriterProps {
  text: string;
  speed?: number;
  delayInFrames?: number;
  cursor?: boolean;
  cursorColor?: string;
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 2,
  delayInFrames = 0,
  cursor = true,
  cursorColor = '#ffffff',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delayInFrames);

  const charsToShow = Math.min(
    Math.floor(adjustedFrame / speed),
    text.length,
  );

  const displayText = text.slice(0, charsToShow);
  const showCursor = cursor && adjustedFrame % 20 < 14 && charsToShow < text.length;

  return (
    <span style={{ ...style, fontFamily: 'monospace' }}>
      {displayText}
      {showCursor && (
        <span style={{ color: cursorColor }}>|</span>
      )}
    </span>
  );
};
