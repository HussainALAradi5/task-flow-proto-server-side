import { z } from 'zod';
import { UserRole } from '../enums/user/UserRole';

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
    identifier: z.string().trim().min(1, 'Email, username, or mobile is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(50).optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().optional(),
    teamId: z.string().optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(UserRole),
  }),
  params: z.object({
    id: z.string(),
  }),
});
