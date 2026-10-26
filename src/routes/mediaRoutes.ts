import { Router } from 'express';
import { MediaController } from '../controllers/MediaController';

const router = Router();
router.get('/entity/:entityId', MediaController.getMediaByEntity);
export default router;
