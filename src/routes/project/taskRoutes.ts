import { TaskController } from '../../controllers/project/TaskController';
import { BaseRoute } from '../BaseRoute';
import { validateRequest } from '../../utilities/validateRequest';
import { createTaskSchema, updateTaskSchema } from '../../validations';

class TaskRouteClass extends BaseRoute<typeof TaskController> {
  constructor() {
    super(TaskController);

    this.router.get('/project/:projectId', TaskController.getMyTasksByProject);
    this.router.get('/milestone/:milestoneId', TaskController.getMyTasksByMilestone);

    this.router.post(
      '/',
      validateRequest(createTaskSchema),
      TaskController.createTask,
    );

    this.router.patch(
      '/:id',
      validateRequest(updateTaskSchema),
      TaskController.updateTask,
    );

    this.router.delete('/:id', TaskController.delete);
  }
}

export default new TaskRouteClass().router;