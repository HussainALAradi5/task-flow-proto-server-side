import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createMilestoneSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    projectId: z.string().regex(objectIdRegex, 'Invalid projectId format'),
  }),
});

export const updateMilestoneSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
