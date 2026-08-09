import { ITeam } from "../interface/team/Team";
import { TeamService } from "../services";
import { BaseController } from "./BaseController";

class TeamControllerClass extends BaseController<ITeam> {
  constructor() {
    super(TeamService);
  }
}

export const TeamController = new TeamControllerClass();