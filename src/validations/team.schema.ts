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

export const teamMemberSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({ email: z.email() }),
});

export const removeTeamMemberSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i), userId: z.string().regex(/^[a-f\d]{24}$/i) }),
});

export const respondToInvitationSchema = z.object({
  params: z.object({ invitationId: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({ decision: z.enum(['accept', 'decline']) }),
});
