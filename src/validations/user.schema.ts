import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    mobileNumber: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(50).optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().optional(),
    teamId: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(['Admin', 'Leader', 'Member']),
  }),
  params: z.object({
    id: z.string(),
  }),
});
