import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    projectId: z.string().regex(objectIdRegex, 'Invalid projectId format'),
    milestoneId: z.string().regex(objectIdRegex, 'Invalid milestoneId format').optional(),
    assignTo: z.string().regex(objectIdRegex, 'Invalid assignTo format').optional(),
    startDate: z.string().optional(),
    targetDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    milestoneId: z.string().regex(objectIdRegex, 'Invalid milestoneId format').optional(),
    assignTo: z.string().regex(objectIdRegex, 'Invalid assignTo format').optional(),
    startDate: z.string().optional(),
    targetDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
