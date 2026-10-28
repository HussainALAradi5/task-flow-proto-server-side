import { Router } from 'express';
import { z } from 'zod';
import { NotificationController } from '../controllers/NotificationController';
import { validateRequest } from '../utilities/validateRequest';
import { QueryBoolean } from '../enums/QueryBoolean';

const router = Router();
router.get('/', validateRequest(z.object({ query: z.object({ unread: z.enum(QueryBoolean).optional() }) })), NotificationController.list);
router.get('/unread-count', NotificationController.count);
router.patch('/read-all', NotificationController.markAllRead);
router.patch('/:id/read', validateRequest(z.object({ params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }) })), NotificationController.markRead);
export default router;
