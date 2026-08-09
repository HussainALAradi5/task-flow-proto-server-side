import { TaskController } from "../../controllers/project/TaskController";
import { BaseRoute } from "../BaseRoute";

class TaskRouteClass extends BaseRoute<typeof TaskController> {
  constructor() {
    super(TaskController);

    this.router.get('/project/:projectId', TaskController.getByProject);
    this.router.get('/milestone/:milestoneId', TaskController.getByMilestone);
  }
}

export default new TaskRouteClass().router;