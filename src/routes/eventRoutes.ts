import { BaseRoute } from './BaseRoute';
import { EventController } from '../controllers/EventController';

const router = new BaseRoute(EventController).router;
router.get('/project/:projectId', EventController.getProjectHistory);
export default router;
