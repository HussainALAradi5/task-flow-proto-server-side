import { UserController } from "../../controllers/user/UserController";
import { BaseRoute } from "../BaseRoute";

class UserRouteClass extends BaseRoute<typeof UserController> {
  constructor() {
    super(UserController);
    
    // Add custom, domain-specific routes alongside standard CRUD
    this.router.patch('/:id/role', UserController.updateRole);
  }
}

export default new UserRouteClass().router;