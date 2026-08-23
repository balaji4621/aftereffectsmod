import { z } from 'zod';

export const SubtitleWordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number().optional(),
  emphasis: z.number(),
});

export const SubtitlesSchema = z.object({
  language: z.string().optional(),
  fullText: z.string(),
  words: z.array(SubtitleWordSchema),
});

export type SubtitleWord = z.infer<typeof SubtitleWordSchema>;
export type Subtitles = z.infer<typeof SubtitlesSchema>;
