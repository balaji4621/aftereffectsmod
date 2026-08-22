import React from 'react';
import { Video, staticFile, useCurrentFrame, AbsoluteFill } from 'remotion';
import { EngineConfig } from '../types/media';

interface VideoLayerProps {
  filename: string;
  config?: EngineConfig['speed'];
}

export const VideoLayer: React.FC<VideoLayerProps> = ({ filename, config }) => {
  const frame = useCurrentFrame();
  const cleanName = filename.replace(/^public[/\\]/, '').replace(/^\//, '');

  let playbackRate = config?.basePlaybackRate ?? 1.0;

  if (config?.enabled && config?.beatSpeedRamp) {
    const beatInterval = 19;
    const frameInBeat = frame % beatInterval;

    if (frameInBeat < 3) {
      playbackRate = config.beatSlowMo; // Configurable slow-mo on drop
    } else if (frameInBeat >= 14) {
      playbackRate = config.rampSpeed; // Configurable speed ramp before drop
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Video
        src={staticFile(cleanName)}
        playbackRate={playbackRate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};
