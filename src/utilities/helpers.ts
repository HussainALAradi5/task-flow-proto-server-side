import { Request } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../interface/user/User';
import { UserRole } from '../enums/user/UserRole';

export function parseParamId(req: Request, paramName: string): string {
  const raw = req.params[paramName];
  return Array.isArray(raw) ? raw[0] : raw;
}

export function toObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}

export function buildUserScopeFilter<T extends Record<string, unknown>>(
  user: IUser,
  extra: Partial<T> = {},
): Record<string, unknown> {
  if (user.role === UserRole.ADMIN) return extra;
  return { ...extra, createdBy: user.id };
}

export function isValidEnumValue<T extends object>(value: unknown, enumObj: T): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

export function getCurrentUser(req: Request): { id: string; role: UserRole } {
  return { id: req.user!.id, role: req.user!.role as UserRole };
}

export const USER_POPULATE = {
  path: 'createdBy updatedBy lastReviewedBy lastAssignTo',
  select: 'userName email',
  model: 'User',
};
