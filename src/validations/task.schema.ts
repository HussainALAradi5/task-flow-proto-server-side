import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    projectId: z.string(),
    milestoneId: z.string().optional(),
    assignTo: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    milestoneId: z.string().optional(),
    assignTo: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
