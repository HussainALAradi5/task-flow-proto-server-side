import { z } from 'zod';
import { imageAttachmentSchema } from './comment.schema';

const params = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });

export const listTeamMessagesSchema = z.object({ params });

export const createTeamMessageSchema = z.object({
  params,
  body: z.object({
    content: z.string().max(2000).default(''),
    attachment: imageAttachmentSchema.optional(),
  }).refine((body) => body.content.trim().length > 0 || !!body.attachment, 'Write a message or attach an image'),
});
