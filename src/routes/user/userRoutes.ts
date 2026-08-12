import { UserController } from '../../controllers/user/UserController';
import { BaseRoute } from '../BaseRoute';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { signupSchema, loginSchema, updateRoleSchema } from '../../validations';

class UserRouteClass extends BaseRoute<typeof UserController> {
  constructor() {
    super(UserController);

    this.router.post('/signup', validateRequest(signupSchema), UserController.signup);
    this.router.post('/login', validateRequest(loginSchema), UserController.login);

    this.router.get('/profile', UserController.getProfile);
    this.router.patch(
      '/:id/role',
      restrictTo('Admin'),
      validateRequest(updateRoleSchema),
      UserController.updateRole,
    );
  }
}

export default new UserRouteClass().router;