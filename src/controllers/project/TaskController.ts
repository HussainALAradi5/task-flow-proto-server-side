import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { ITask } from '../../interface/project/Task';
import { TaskService } from '../../services/project/TaskService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId } from '../../utilities/helpers';
import { UserRole } from '../../enums/user/UserRole';

class TaskControllerClass extends BaseController<ITask> {
  constructor() {
    super(TaskService);
  }

  createTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const task = await TaskService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: task });
  });

  updateTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const data = req.body;

    if (data.status === 'In Review' || data.status === 'Done') {
      data.lastReviewedBy = req.user!.id;
      data.lastReviewedAt = new Date();
    }

    const task = await TaskService.update(id, data, req.user!.id);
    if (!task) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: task });
  });

  getMyTasksByProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = parseParamId(req, 'projectId');
    const isAdmin = req.user!.role === UserRole.ADMIN;
    const filter = isAdmin
      ? TaskService.buildProjectFilter(projectId)
      : TaskService.buildProjectUserFilter(projectId, req.user!.id);

    const pagination = getPaginationParams(req);
    const result = await TaskService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });

  getMyTasksByMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const milestoneId = parseParamId(req, 'milestoneId');
    const isAdmin = req.user!.role === UserRole.ADMIN;
    const filter = isAdmin
      ? TaskService.buildMilestoneFilter(milestoneId)
      : TaskService.buildMilestoneUserFilter(milestoneId, req.user!.id);

    const pagination = getPaginationParams(req);
    const result = await TaskService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const TaskController = new TaskControllerClass();