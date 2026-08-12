import { MilestoneController } from '../../controllers/project/MilestoneController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createMilestoneSchema, updateMilestoneSchema } from '../../validations';

class MilestoneRouteClass extends BaseRoute<typeof MilestoneController> {
  constructor() {
    super(MilestoneController);

    this.router.get('/project/:projectId', MilestoneController.getMyMilestones);

    this.router.post(
      '/',
      restrictTo('Admin', 'Leader'),
      validateRequest(createMilestoneSchema),
      MilestoneController.createMilestone,
    );

    this.router.patch(
      '/:id',
      restrictTo('Admin', 'Leader'),
      validateRequest(updateMilestoneSchema),
      MilestoneController.update,
    );

    this.router.delete('/:id', restrictTo('Admin', 'Leader'), MilestoneController.delete);
  }
}

export default new MilestoneRouteClass().router;