import { z } from 'zod';

export const AudioFeatureFrameSchema = z.object({
  time: z.number(),
  subKick: z.number(),
  snare: z.number(),
  transient: z.number(),
  isKickHit: z.boolean(),
  isSnareHit: z.boolean(),
});

export const AudioFeaturesSchema = z.object({
  audioPath: z.string(),
  duration: z.number(),
  sampleRate: z.number(),
  fps: z.number(),
  totalFrames: z.number(),
  frames: z.array(AudioFeatureFrameSchema),
});

export type AudioFeatureFrame = z.infer<typeof AudioFeatureFrameSchema>;
export type AudioFeatures = z.infer<typeof AudioFeaturesSchema>;
