import { MilestoneController } from "../../controllers/project/MilestoneController";
import { BaseRoute } from "../BaseRoute";

class MilestoneRouteClass extends BaseRoute<typeof MilestoneController> {
  constructor() {
    super(MilestoneController);

    // Custom relation lookup route
    this.router.get('/project/:projectId', MilestoneController.getByProject);
  }
}

export default new MilestoneRouteClass().router;