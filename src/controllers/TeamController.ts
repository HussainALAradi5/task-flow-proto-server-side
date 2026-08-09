import { BaseController } from './BaseController';
import { ITeam } from '../interface/team/Team';
import { TeamService } from '../services/team/TeamService';

class TeamControllerClass extends BaseController<ITeam> {
  constructor() {
    super(TeamService);
  }
}

export const TeamController = new TeamControllerClass();