import { ProjectController } from '../../controllers/project/ProjectController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createProjectSchema, updateProjectSchema } from '../../validations';

class ProjectRouteClass extends BaseRoute<typeof ProjectController> {
  constructor() {
    super(ProjectController);

    this.router.post(
      '/',
      restrictTo('Admin', 'Leader'),
      validateRequest(createProjectSchema),
      ProjectController.createProject,
    );

    this.router.patch(
      '/:id',
      restrictTo('Admin', 'Leader'),
      validateRequest(updateProjectSchema),
      ProjectController.update,
    );

    this.router.delete('/:id', restrictTo('Admin'), ProjectController.delete);
  }
}

export default new ProjectRouteClass().router;