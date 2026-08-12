import { TeamController } from '../../controllers/team/TeamController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createTeamSchema, updateTeamSchema } from '../../validations';

class TeamRouteClass extends BaseRoute<typeof TeamController> {
  constructor() {
    super(TeamController);

    this.router.post(
      '/',
      restrictTo('Admin', 'Leader'),
      validateRequest(createTeamSchema),
      TeamController.createTeam,
    );

    this.router.patch(
      '/:id',
      restrictTo('Admin', 'Leader'),
      validateRequest(updateTeamSchema),
      TeamController.update,
    );

    this.router.delete('/:id', restrictTo('Admin'), TeamController.delete);
  }
}

export default new TeamRouteClass().router;
