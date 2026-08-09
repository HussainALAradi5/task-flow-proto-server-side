import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BaseController } from '../BaseController';
import { IUser } from '../../interface/user/User';
import { UserService } from '../../services/user/UserService';
import { catchAsync } from '../../utilities/catchAsync';
import { config } from '../../config/environment';
import { UserRole } from '../../enums/user/UserRoleEnum';

const signToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, { 
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] 
  });
};

class UserControllerClass extends BaseController<IUser> {
  constructor() {
    super(UserService);
  }

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await UserService.authenticate(email, password);
    
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      return;
    }

    const token = signToken(user.id);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ status: 'success', token, data: userResponse });
  });

  // Trello-style Profile Fetching
  getProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // req.user is guaranteed to exist here because of the protect middleware
    res.status(200).json({ status: 'success', data: req.user });
  });

  // Role Assignment Endpoint
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