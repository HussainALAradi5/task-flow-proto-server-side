import { ProjectController } from "../../controllers/project/ProjectController";
import { BaseRoute } from "../BaseRoute";

class ProjectRouteClass extends BaseRoute<typeof ProjectController> {
  constructor() {
    super(ProjectController);

    this.router.post('/', ProjectController.createProject);
  }
}

export default new ProjectRouteClass().router;