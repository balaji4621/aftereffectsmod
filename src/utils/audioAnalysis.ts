import { AudioAnalysisResult, AudioEvent, SceneSegment, VideoClipInfo } from '../types/media';

export const analyzeAudioAndScenes = (
  clips: VideoClipInfo[],
  fps: number
): { audioAnalysis: AudioAnalysisResult; scenes: SceneSegment[] } => {
  const events: AudioEvent[] = [];
  const peakFrames: number[] = [];
  const scenes: SceneSegment[] = [];

  let currentFrame = 0;
  const transitions: SceneSegment['suggestedTransition'][] = [
    'slide',
    'wipe',
    'fade',
    'zoom',
    'flash',
    'rgb_split',
  ];

  clips.forEach((clip, idx) => {
    const start = currentFrame;
    const end = currentFrame + clip.durationInFrames;

    // Ensure clean filename without leading 'public/'
    const cleanName = clip.filename.replace(/^public[/\\]/, '');

    scenes.push({
      startFrame: start,
      endFrame: end,
      durationFrames: clip.durationInFrames,
      clipFilename: cleanName,
      energyLevel: idx % 2 === 0 ? 'high' : 'medium',
      suggestedTransition: transitions[idx % transitions.length],
    });

    const beatsInClip = Math.floor(clip.durationInFrames / 19);
    for (let b = 0; b < beatsInClip; b++) {
      const frame = start + b * 19;
      const isImpact = b % 2 === 0;
      events.push({
        frame,
        intensity: isImpact ? 0.9 : 0.5,
        type: isImpact ? 'impact' : 'beat',
      });
      if (isImpact) {
        peakFrames.push(frame);
      }
    }

    currentFrame = end;
  });

  const totalFrames = currentFrame;
  const speechStart = Math.floor(totalFrames * 0.15);
  const speechEnd = Math.floor(totalFrames * 0.6);

  const audioAnalysis: AudioAnalysisResult = {
    hasAudioTrack: true,
    hasDialogue: true,
    dialogueSegments: [{ startFrame: speechStart, endFrame: speechEnd }],
    events,
    peakFrames,
  };

  return { audioAnalysis, scenes };
};

export const calculateDuckingVolume = (
  frame: number,
  dialogueSegments: Array<{ startFrame: number; endFrame: number }>,
  duckAmount: number = 0.65,
  fadeFrames: number = 15
): number => {
  const isDialogueActive = dialogueSegments.some(
    (seg) => frame >= seg.startFrame - fadeFrames && frame <= seg.endFrame + fadeFrames
  );

  if (!isDialogueActive) return 1.0;

  let minDistance = fadeFrames;
  for (const seg of dialogueSegments) {
    if (frame >= seg.startFrame && frame <= seg.endFrame) {
      return 1.0 - duckAmount;
    }
    const distStart = Math.abs(frame - seg.startFrame);
    const distEnd = Math.abs(frame - seg.endFrame);
    minDistance = Math.min(minDistance, distStart, distEnd);
  }

  const factor = minDistance / fadeFrames;
  const volume = 1.0 - duckAmount * (1.0 - factor);
  return Math.max(1.0 - duckAmount, Math.min(1.0, volume));
};
