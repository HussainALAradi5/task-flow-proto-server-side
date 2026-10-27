import { Types } from 'mongoose';
import { NotificationKind } from '../enums/NotificationKind';

export interface INotification {
  recipient: Types.ObjectId;
  kind: NotificationKind;
  title: string;
  description: string;
  href: string;
  readAt: Date | null;
  createdAt: Date;
}
