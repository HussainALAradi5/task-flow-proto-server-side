import { Router } from 'express';
import eventRoutes from './eventRoutes';
import { protect } from '../middlewares/authMiddleware';
import userRoutes from './user/userRoutes';
import projectRoutes from './project/projectRoutes';
import milestoneRoutes from './project/milestoneRoutes';
import taskRoutes from './project/taskRoutes';
import teamRoutes from './team/teamRoutes';

const router = Router();

// Public routes (signup, login)
router.use('/users', userRoutes);

// Protected routes - everything below requires authentication
router.use(protect);

router.use('/projects', projectRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes);

export default router;