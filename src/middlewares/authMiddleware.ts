import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { UserService } from '../services/user/UserService';
import { IUser } from '../interface/user/User';

// Safely extend Express Request to hold the user object natively
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ status: 'error', message: 'You are not logged in. Please log in to get access.' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

    // Find the user directly from the service
    const currentUser = await UserService.getById(decoded.id);
    if (!currentUser) {
      res.status(401).json({ status: 'error', message: 'The user belonging to this token no longer exists.' });
      return;
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token or session expired.' });
  }
};

// Role-based authorization middleware
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ status: 'error', message: 'You do not have permission to perform this action.' });
      return;
    }
    next();
  };
};