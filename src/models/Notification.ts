import { model, Schema } from 'mongoose';
import { INotification } from '../interface/Notification';
import { NotificationKind } from '../enums/NotificationKind';

const schema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  kind: { type: String, enum: Object.values(NotificationKind), required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  href: { type: String, required: true },
  readAt: { type: Date, default: null },
}, { timestamps: { createdAt: true, updatedAt: false } });

schema.index({ recipient: 1, createdAt: -1 });
schema.index({ recipient: 1, readAt: 1 });

export const Notification = model<INotification>('Notification', schema);
