import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { ITask } from '../../interface/project/Task';
import { TaskService } from '../../services/project/TaskService';
import { catchAsync } from '../../utilities/catchAsync';

class TaskControllerClass extends BaseController<ITask> {
  constructor() {
    super(TaskService);
  }

  getByProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const tasks = await TaskService.getTasksByProject(id);
    res.status(200).json({ status: 'success', data: tasks });
  });

  getByMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.milestoneId) ? req.params.milestoneId[0] : req.params.milestoneId;
    const tasks = await TaskService.getTasksByMilestone(id);
    res.status(200).json({ status: 'success', data: tasks });
  });
}

export const TaskController = new TaskControllerClass();