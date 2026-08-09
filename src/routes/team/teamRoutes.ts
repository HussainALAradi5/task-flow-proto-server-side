import { TeamController } from "../../controllers/TeamController";
import { BaseRoute } from "../BaseRoute";

class TeamRouteClass extends BaseRoute<typeof TeamController> {
  constructor() {
    super(TeamController);
  }
}

export default new TeamRouteClass().router;