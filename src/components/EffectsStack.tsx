import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  AudioAnalysisResult,
  EngineConfig,
  MediaMetadata,
  SceneSegment,
} from '../types/media';
import { VideoLayer } from './VideoLayer';
import { MotionBlurLayer } from './MotionBlurLayer';
import { TransitionLayer } from './TransitionLayer';
import { Typography } from './Typography';
import { ColorGrade } from './ColorGrade';
import { FilmGrain } from './FilmGrain';
import { Vignette } from './Vignette';
import { AudioMix } from './AudioMix';
import { StoryProgressBar } from './StoryProgressBar';
import { AudioBeatSync } from './AudioBeatSync';
import { ShaderPass } from './ShaderPass';

interface EffectsStackProps {
  metadata: MediaMetadata;
  audioAnalysis: AudioAnalysisResult;
  scenes: SceneSegment[];
  config: EngineConfig;
}

export const EffectsStack: React.FC<EffectsStackProps> = ({
  metadata,
  audioAnalysis,
  scenes,
  config,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Compositing Layer Pass 1: Audio Beat Sync, Shaders, Speed & Transitions */}
      <TransitionLayer
        scenes={scenes}
        renderSceneContent={(scene) => (
          <ColorGrade config={config.colorGrade}>
            <ShaderPass config={config.shader}>
              <AudioBeatSync>
                <MotionBlurLayer config={config.motionBlur}>
                  <VideoLayer filename={scene.clipFilename} config={config.speed} />
                </MotionBlurLayer>
              </AudioBeatSync>
            </ShaderPass>
          </ColorGrade>
        )}
      />

      {/* Compositing Layer Pass 2: Film Grain Texture */}
      <FilmGrain config={config.effects} />

      {/* Compositing Layer Pass 3: Header Story Progress Bar */}
      <StoryProgressBar scenes={scenes} />

      {/* Compositing Layer Pass 4: Cinematic Vignette */}
      <Vignette config={config.colorGrade} />

      {/* Compositing Layer Pass 5: Typography (If enabled) */}
      {config.typography.enabled && (
        <Typography
          title={config.typography.titleText}
          subtitle={config.typography.subtitleText}
        />
      )}

      {/* Compositing Layer Pass 6: Audio Mix & Dynamic Auto-Ducking */}
      {metadata.primaryVideo && (
        <AudioMix metadata={metadata} audioAnalysis={audioAnalysis} config={config.audio} />
      )}
    </AbsoluteFill>
  );
};
