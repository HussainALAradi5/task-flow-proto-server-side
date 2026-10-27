import { TeamController } from '../../controllers/team/TeamController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createTeamSchema, updateTeamSchema } from '../../validations';
import { teamMemberSchema, removeTeamMemberSchema, respondToInvitationSchema } from '../../validations/team.schema';
import { TeamMessageController } from '../../controllers/team/TeamMessageController';
import { listTeamMessagesSchema, createTeamMessageSchema } from '../../validations/teamMessage.schema';

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
      validateRequest(updateTeamSchema),
      TeamController.updateTeam,
    );

    this.router.delete('/:id', TeamController.deleteTeam);
    this.router.post('/:id/members', validateRequest(teamMemberSchema), TeamController.addMember);
    this.router.delete('/:id/members/:userId', validateRequest(removeTeamMemberSchema), TeamController.removeMember);
    this.router.get('/invitations/pending', TeamController.pendingInvitations);
    this.router.post('/invitations/:invitationId/respond', validateRequest(respondToInvitationSchema), TeamController.respondToInvitation);
    this.router.get('/:id/messages', validateRequest(listTeamMessagesSchema), TeamMessageController.list);
    this.router.post('/:id/messages', validateRequest(createTeamMessageSchema), TeamMessageController.create);
  }
}

export default new TeamRouteClass().router;
