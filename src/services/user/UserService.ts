import { IUser } from '../../interface/user/User';
import { User } from '../../models/user/User';
import { BaseService } from '../BaseService';
import { HydratedDocument } from 'mongoose';

class UserServiceClass extends BaseService<HydratedDocument<IUser>> {
  constructor() {
    super(User);
  }
}
export const UserService = new UserServiceClass();