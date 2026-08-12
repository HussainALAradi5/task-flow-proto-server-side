import { z } from 'zod';

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
