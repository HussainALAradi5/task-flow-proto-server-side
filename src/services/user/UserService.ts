import { IUser } from '../../interface/user/User';
import { User } from '../../models/user/User';
import { BaseService } from '../BaseService';

class UserServiceClass extends BaseService<IUser> {
  constructor() {
    super(User);
  }
}
export const UserService = new UserServiceClass();