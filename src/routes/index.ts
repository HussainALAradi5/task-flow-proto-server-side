import { Router } from 'express';
import eventRoutes from './eventRoutes';
import { protect } from '../middlewares/authMiddleware';
import userRoutes from './user/userRoutes';
import projectRoutes from './project/projectRoutes';
import milestoneRoutes from './project/milestoneRoutes';
import taskRoutes from './project/taskRoutes';
import teamRoutes from './team/teamRoutes';

const router = Router();

// Public routes (Authentication, Login, Signup)
router.use('/users', userRoutes);

// Global Authentication Gate: Everything mounted below this line is automatically protected
router.use(protect);

router.use('/projects', projectRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes);

export default router;