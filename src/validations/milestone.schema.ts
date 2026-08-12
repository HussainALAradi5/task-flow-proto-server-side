import { z } from 'zod';

export const createMilestoneSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    projectId: z.string(),
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
