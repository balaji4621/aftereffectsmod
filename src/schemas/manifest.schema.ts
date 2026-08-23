import { z } from 'zod';

export const ManifestItemSchema = z.object({
  id: z.string(),
  filename: z.string(),
  filepath: z.string(),
  proxyPath: z.string().optional(),
  type: z.enum(['video', 'audio', 'image']),
  duration: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  fps: z.number().optional(),
  hasAudio: z.boolean().optional(),
});

export const ManifestSchema = z.object({
  generatedAt: z.string(),
  items: z.array(ManifestItemSchema),
});

export type ManifestItem = z.infer<typeof ManifestItemSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;
