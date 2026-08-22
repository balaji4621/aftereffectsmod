import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneSegment } from '../types/media';

interface StoryProgressBarProps {
  scenes: SceneSegment[];
}

export const StoryProgressBar: React.FC<StoryProgressBarProps> = ({ scenes }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '6px',
        padding: '24px 20px 0 20px',
        height: '40px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {scenes.map((scene, idx) => {
        let progress = 0;
        if (frame >= scene.endFrame) {
          progress = 1;
        } else if (frame >= scene.startFrame && frame < scene.endFrame) {
          progress = (frame - scene.startFrame) / scene.durationFrames;
        }

        return (
          <div
            key={`bar-${idx}`}
            style={{
              flex: 1,
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
              overflow: 'hidden',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
