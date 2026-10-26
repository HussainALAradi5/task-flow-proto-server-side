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

export function canAccessOwnedRecord(user: IUser, record: unknown): boolean {
  if (!record || typeof record !== 'object') return false;
  const createdBy = (record as { createdBy?: unknown }).createdBy;
  return user.role === UserRole.ADMIN || createdBy?.toString() === user.id;
}

export function canReadMemberRecord(user: IUser, record: unknown): boolean {
  if (canAccessOwnedRecord(user, record)) return true;
  if (!record || typeof record !== 'object') return false;
  const members = (record as { members?: unknown }).members;
  return Array.isArray(members) && members.some((member) => member?.toString() === user.id);
}

export function buildMemberScopeFilter(user: IUser): Record<string, unknown> {
  if (user.role === UserRole.ADMIN) return {};
  const id = toObjectId(user.id);
  return { $or: [{ createdBy: id }, { members: id }] };
}

export const USER_POPULATE = {
  path: 'createdBy updatedBy lastReviewedBy lastAssignTo',
  select: 'userName email',
  model: 'User',
};
