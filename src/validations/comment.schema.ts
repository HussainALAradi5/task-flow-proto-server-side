import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
    taskId: z.string(),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
  }),
  params: z.object({
    id: z.string(),
  }),
});
