import { Router } from 'express';
import eventRoutes from './eventRoutes';
import { protect } from '../middlewares/authMiddleware';
import { signup, login } from './user/authRoutes';
import { profile, userCRUD } from './user/userRoutes';
import projectRoutes from './project/projectRoutes';
import milestoneRoutes from './project/milestoneRoutes';
import taskRoutes from './project/taskRoutes';
import commentRoutes from './project/commentRoutes';
import teamRoutes from './team/teamRoutes';

const router = Router();

// Public routes
router.use('/users', signup, login);

// Protected routes
router.use(protect);

router.use('/users', profile, userCRUD);
router.use('/projects', projectRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes);

export default router;