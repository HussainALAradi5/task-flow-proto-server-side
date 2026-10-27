import { TeamController } from '../../controllers/team/TeamController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createTeamSchema, updateTeamSchema } from '../../validations';
import { teamMemberSchema, removeTeamMemberSchema, respondToInvitationSchema } from '../../validations/team.schema';

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
    this.router.post('/:id/members', restrictTo('Admin', 'Leader'), validateRequest(teamMemberSchema), TeamController.addMember);
    this.router.delete('/:id/members/:userId', restrictTo('Admin', 'Leader'), validateRequest(removeTeamMemberSchema), TeamController.removeMember);
    this.router.get('/invitations/pending', TeamController.pendingInvitations);
    this.router.post('/invitations/:invitationId/respond', validateRequest(respondToInvitationSchema), TeamController.respondToInvitation);
  }
}

export default new TeamRouteClass().router;
