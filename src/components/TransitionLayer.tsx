import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, springTiming, TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { SceneSegment } from '../types/media';

interface TransitionLayerProps {
  scenes: SceneSegment[];
  renderSceneContent: (scene: SceneSegment, index: number) => React.ReactNode;
}

export const TransitionLayer: React.FC<TransitionLayerProps> = ({
  scenes,
  renderSceneContent,
}) => {
  if (!scenes || scenes.length <= 1) {
    return <AbsoluteFill>{renderSceneContent(scenes[0], 0)}</AbsoluteFill>;
  }

  const transitionDuration = 15; // 15 frames transition

  return (
    <TransitionSeries>
      {scenes.flatMap((scene, idx) => {
        const isLast = idx === scenes.length - 1;
        const elements: React.ReactNode[] = [
          <TransitionSeries.Sequence
            key={`scene-${idx}`}
            durationInFrames={scene.durationFrames + (isLast ? 0 : transitionDuration)}
          >
            {renderSceneContent(scene, idx)}
          </TransitionSeries.Sequence>,
        ];

        if (!isLast) {
          const timing = springTiming({
            config: { damping: 15, mass: 0.8 },
            durationInFrames: transitionDuration,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let presentation: TransitionPresentation<any> = fade();
          if (scene.suggestedTransition === 'slide') {
            presentation = slide({ direction: 'from-right' });
          } else if (scene.suggestedTransition === 'wipe') {
            presentation = wipe({ direction: 'from-left' });
          }

          elements.push(
            <TransitionSeries.Transition
              key={`trans-${idx}`}
              presentation={presentation}
              timing={timing}
            />
          );
        }

        return elements;
      })}
    </TransitionSeries>
  );
};
