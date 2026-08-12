import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    teamId: z.string().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    teamId: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
