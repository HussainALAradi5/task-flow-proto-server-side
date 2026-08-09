import { Router } from 'express';
import eventRoutes from './eventRoutes'; // <-- Import event routes
import userRoutes from './user/userRoutes';
import projectRoutes from './project/projectRoutes';
import milestoneRoutes from './project/milestoneRoutes';
import taskRoutes from './project/taskRoutes';
import teamRoutes from './team/teamRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes); 

export default router;