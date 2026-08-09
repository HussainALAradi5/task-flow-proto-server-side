import { BaseController } from '../BaseController';
import { IUser } from '../../interface/user/User';
import { UserService } from '../../services/user/UserService';

class UserControllerClass extends BaseController<IUser> {
  constructor() {
    super(UserService);
  }
}

export const UserController = new UserControllerClass();