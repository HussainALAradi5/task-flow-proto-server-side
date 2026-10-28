import { z } from 'zod';
import { attachmentNameMatchesType, chatAttachmentNameSchema, chatAttachmentSchema } from './chatAttachment.schema';

const params = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });

export const listTeamMessagesSchema = z.object({ params });

export const createTeamMessageSchema = z.object({
  params,
  body: z.object({
    content: z.string().max(2000).default(''),
    attachment: chatAttachmentSchema.optional(),
    attachmentName: chatAttachmentNameSchema.optional(),
    mentions: z.array(z.string().regex(/^[a-f\d]{24}$/i)).max(20).default([]),
  }).refine((body) => body.content.trim().length > 0 || !!body.attachment, 'Write a message or attach a file')
    .refine((body) => !body.attachmentName || (!!body.attachment && attachmentNameMatchesType(body.attachment, body.attachmentName)), 'Attachment name must match its file type'),
});
