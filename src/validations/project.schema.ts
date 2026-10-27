import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid teamId format');

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    teamId: objectId.nullable().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    teamId: objectId.nullable().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
