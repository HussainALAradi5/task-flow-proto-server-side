import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { UserService } from '../services/user/UserService';
import { IUser } from '../interface/user/User';
import { Project } from '../models/project/Project';
import { Task } from '../models/project/Task';
import { isProjectMember } from '../utilities/helpers';

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

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    const currentUser = await UserService.getById(decoded.id);
    if (!currentUser) {
      res.status(401).json({ status: 'error', message: 'The user belonging to this token no longer exists.' });
      return;
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token or session expired.' });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ status: 'error', message: 'You do not have permission to perform this action.' });
      return;
    }
    next();
  };
};

export const requireProjectMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.body.projectId || req.params.projectId;
    if (!projectId) {
      res.status(400).json({ status: 'error', message: 'Project ID is required.' });
      return;
    }

    const project = await Project.findById(projectId).select('createdBy members').lean();
    if (!isProjectMember(req.user!.id, project as unknown as Record<string, unknown>, req.user!.role)) {
      res.status(403).json({ status: 'error', message: 'You are not a member of this project.' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to verify project membership.' });
  }
};

export const requireTaskProjectMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      res.status(400).json({ status: 'error', message: 'Task ID is required.' });
      return;
    }

    const task = await Task.findById(taskId).select('projectId').lean();
    if (!task) {
      res.status(404).json({ status: 'error', message: 'Task not found.' });
      return;
    }

    const project = await Project.findById(task.projectId).select('createdBy members').lean();
    if (!isProjectMember(req.user!.id, project as unknown as Record<string, unknown>, req.user!.role)) {
      res.status(403).json({ status: 'error', message: 'You are not a member of this project.' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to verify project membership.' });
  }
};