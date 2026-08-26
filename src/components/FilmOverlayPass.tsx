import React from 'react';
import { AbsoluteFill } from 'remotion';

interface FilmOverlayPassProps {
  children?: React.ReactNode;
  enableLetterbox?: boolean;
  letterboxHeightPx?: number;
}

export const FilmOverlayPass: React.FC<FilmOverlayPassProps> = ({
  children,
  enableLetterbox = true,
  letterboxHeightPx = 60,
}) => {
  return (
    <AbsoluteFill style={{ position: 'relative' }}>
      {children}

      {/* Top Letterbox Bar */}
      {enableLetterbox && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${letterboxHeightPx}px`,
            backgroundColor: '#000000',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Bottom Letterbox Bar */}
      {enableLetterbox && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${letterboxHeightPx}px`,
            backgroundColor: '#000000',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
