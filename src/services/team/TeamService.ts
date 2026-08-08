import { ITeam } from '../../interface/team/Team';
import { Team } from '../../models/team/Team';
import { BaseService } from '../BaseService';

class TeamServiceClass extends BaseService<ITeam> {
  constructor() {
    super(Team);
  }
}
export const TeamService = new TeamServiceClass();