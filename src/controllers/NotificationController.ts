import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { catchAsync } from '../utilities/catchAsync';
import { getPaginationParams } from '../utilities/pagination';
import { parseParamId } from '../utilities/helpers';
import { QueryBoolean } from '../enums/QueryBoolean';

export const NotificationController = {
  list: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const page = getPaginationParams(req);
    const filter = { recipient: req.user!.id, ...(req.query.unread === QueryBoolean.True ? { readAt: null } : {}) };
    const [data, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1, _id: -1 }).skip(page.skip).limit(page.limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user!.id, readAt: null }),
    ]);
    res.json({ status: 'success', data, unreadCount, pagination: { page: page.page, limit: page.limit, total, totalPages: Math.ceil(total / page.limit) } });
  }),
  count: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const count = await Notification.countDocuments({ recipient: req.user!.id, readAt: null });
    res.json({ status: 'success', data: { unreadCount: count } });
  }),
  markRead: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notification = await Notification.findOneAndUpdate(
      { _id: parseParamId(req, 'id'), recipient: req.user!.id },
      { $set: { readAt: new Date() } }, { returnDocument: 'after' },
    );
    if (!notification) { res.status(404).json({ status: 'error', message: 'Notification not found' }); return; }
    res.json({ status: 'success', data: notification });
  }),
  markAllRead: catchAsync(async (req: Request, res: Response): Promise<void> => {
    await Notification.updateMany({ recipient: req.user!.id, readAt: null }, { $set: { readAt: new Date() } });
    res.json({ status: 'success' });
  }),
};
