import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { ITask } from '../../interface/project/Task';
import { TaskService } from '../../services/project/TaskService';
import { catchAsync } from '../../utilities/catchAsync';
import { UserRole } from '../../enums/user/UserRoleEnum';

class TaskControllerClass extends BaseController<ITask> {
  constructor() {
    super(TaskService);
  }

  // Auto-link task creation to the logged-in user
  createTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const taskData = { ...req.body, createdBy: req.user!.id };
    const task = await TaskService.create(taskData);
    res.status(201).json({ status: 'success', data: task });
  });

  getMyTasksByProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    
    const tasks = req.user!.role === UserRole.ADMIN
      ? await TaskService.getTasksByProject(projectId)
      : await TaskService.getMyTasksByProject(projectId, req.user!.id);

    res.status(200).json({ status: 'success', data: tasks });
  });
}

export const TaskController = new TaskControllerClass();