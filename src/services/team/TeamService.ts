import { ITeam } from '../../interface/team/Team';
import { Team } from '../../models/team/Team';
import { BaseService } from '../BaseService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';

class TeamServiceClass extends BaseService<ITeam> {
  constructor() {
    super(Team);
  }

  async create(data: Partial<ITeam>): Promise<ITeam> {
    const team = await super.create(data);
    await EventService.logEvent('Team created', EntityType.TEAM, team.id, `New team: ${team.name}`, data.createdBy?.toString());
    return team;
  }

  async update(id: string, data: Partial<ITeam>): Promise<ITeam | null> {
    const updated = await super.update(id, data);
    if (updated) {
      await EventService.logEvent('Team updated', EntityType.TEAM, id, 'Team details updated', id);
    }
    return updated;
  }

  async softDelete(id: string): Promise<ITeam | null> {
    const deleted = await super.softDelete(id);
    if (deleted) {
      await EventService.logEvent('Team deactivated', EntityType.TEAM, id, 'Team was deactivated', id);
    }
    return deleted;
  }
}

export const TeamService = new TeamServiceClass();