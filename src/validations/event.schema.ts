import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    entityType: z.enum(['User', 'Team', 'Task', 'Project', 'Milestone']),
    entityId: z.string(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
