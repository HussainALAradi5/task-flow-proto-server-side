import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IUser } from '../../interface/user/User';
import { UserService } from '../../services/user/UserService';
import { catchAsync } from '../../utilities/catchAsync';
import { signToken, sanitizeUser } from '../../utilities/auth';
import { parseParamId, isValidEnumValue } from '../../utilities/helpers';
import { UserRole } from '../../enums/user/UserRole';

class UserControllerClass extends BaseController<IUser> {
  constructor() {
    super(UserService);
  }

  signup = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { userName, email, password, mobileNumber } = req.body;

    const existingUser = await UserService.findByEmailOrUsername(email, userName);
    if (existingUser) {
      res.status(409).json({
        status: 'error',
        message: existingUser.email === email ? 'Email already in use' : 'Username already taken',
      });
      return;
    }

    const user = await UserService.create({ userName, email, password, mobileNumber });
    res.status(201).json({ status: 'success', token: signToken(user.id), data: sanitizeUser(user) });
  });

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await UserService.authenticate(email, password);

    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({ status: 'success', token: signToken(user.id), data: sanitizeUser(user) });
  });

  getProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', data: req.user });
  });

  updateRole = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const { role } = req.body as { role: UserRole };

    if (!isValidEnumValue(role, UserRole)) {
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