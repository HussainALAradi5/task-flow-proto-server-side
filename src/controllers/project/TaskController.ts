import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { ITask } from '../../interface/project/Task';
import { TaskService } from '../../services/project/TaskService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId, getCurrentUser } from '../../utilities/helpers';

class TaskControllerClass extends BaseController<ITask> {
  constructor() {
    super(TaskService);
  }

  createTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = getCurrentUser(req);
    const task = await TaskService.create({ ...req.body, createdBy: id });
    res.status(201).json({ status: 'success', data: task });
  });

  updateTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const { id: userId } = getCurrentUser(req);
    const data = req.body;

    if (data.status === 'In Review' || data.status === 'Done') {
      data.lastReviewedBy = userId;
      data.lastReviewedAt = new Date();
    }

    if (data.status === 'Done' && !data.deliveredDate) {
      data.deliveredDate = new Date();
    }

    const task = await TaskService.update(id, data, userId);
    if (!task) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: task });
  });

  getMyTasksByProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = parseParamId(req, 'projectId');
    const { id: userId, role } = getCurrentUser(req);
    const filter = role === 'Admin'
      ? TaskService.buildProjectFilter(projectId)
      : TaskService.buildProjectUserFilter(projectId, userId);

    const pagination = getPaginationParams(req);
    const includeInactive = req.query.includeInactive === 'true';
    const result = await TaskService.getAllPaginated(filter, pagination, undefined, undefined, undefined, includeInactive);
    res.status(200).json({ status: 'success', ...result });
  });

  getMyTasksByMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const milestoneId = parseParamId(req, 'milestoneId');
    const { id: userId, role } = getCurrentUser(req);
    const filter = role === 'Admin'
      ? TaskService.buildMilestoneFilter(milestoneId)
      : TaskService.buildMilestoneUserFilter(milestoneId, userId);

    const pagination = getPaginationParams(req);
    const includeInactive = req.query.includeInactive === 'true';
    const result = await TaskService.getAllPaginated(filter, pagination, undefined, undefined, undefined, includeInactive);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const TaskController = new TaskControllerClass();