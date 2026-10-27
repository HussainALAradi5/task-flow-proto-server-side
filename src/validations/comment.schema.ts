import { z } from 'zod';

export const imageAttachmentSchema = z.string().max(750_000).refine((value) => {
  const match = /^data:image\/(png|jpeg|gif|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length === 0 || bytes.length > 500_000) return false;
  const hex = bytes.subarray(0, 12).toString('hex');
  if (match[1] === 'png') return hex.startsWith('89504e470d0a1a0a');
  if (match[1] === 'jpeg') return hex.startsWith('ffd8ff');
  if (match[1] === 'gif') return hex.startsWith('474946383761') || hex.startsWith('474946383961');
  return hex.startsWith('52494646') && hex.slice(16, 24) === '57454250';
}, 'Use a PNG, JPEG, GIF, or WebP image up to 500 KB');

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().max(2000).default(''),
    attachment: imageAttachmentSchema.optional(),
    taskId: z.string(),
  }).refine((body) => body.content.trim().length > 0 || !!body.attachment, 'Write a comment or attach an image'),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
  }),
  params: z.object({
    id: z.string(),
  }),
});
