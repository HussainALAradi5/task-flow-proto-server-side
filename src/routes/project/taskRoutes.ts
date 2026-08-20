import { TaskController } from '../../controllers/project/TaskController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createTaskSchema, updateTaskSchema } from '../../validations';

class TaskRouteClass extends BaseRoute<typeof TaskController> {
  constructor() {
    super(TaskController);

    this.router.get('/project/:projectId', TaskController.getMyTasksByProject);
    this.router.get('/milestone/:milestoneId', TaskController.getMyTasksByMilestone);

    this.router.post(
      '/',
      restrictTo('Admin', 'Leader'),
      validateRequest(createTaskSchema),
      TaskController.createTask,
    );

    this.router.patch(
      '/:id',
      restrictTo('Admin', 'Leader'),
      validateRequest(updateTaskSchema),
      TaskController.updateTask,
    );

    this.router.delete('/:id', restrictTo('Admin', 'Leader'), TaskController.delete);
  }
}

export default new TaskRouteClass().router;