import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IUser } from '../../interface/user/User';
import { UserService } from '../../services/user/UserService';
import { catchAsync } from '../../utilities/catchAsync';
import { UserRole } from '../../enums/user/UserRoleEnum';

class UserControllerClass extends BaseController<IUser> {
  constructor() {
    super(UserService);
  }

  updateRole = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body as { role: UserRole };

    if (!Object.values(UserRole).includes(role)) {
    res.status(400).json({ status: 'error', message: 'Invalid role provided' });
      return;
    }

    const updatedUser = await UserService.assignRole(id, role);
    if (!updatedUser) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: updatedUser });
  });
}

export const UserController = new UserControllerClass();