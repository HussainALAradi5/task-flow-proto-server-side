import { BaseController } from '../BaseController';
import { ITask } from '../../interface/project/Task';
import { TaskService } from '../../services/project/TaskService';

class TaskControllerClass extends BaseController<ITask> {
  constructor() {
    super(TaskService);
  }
}

export const TaskController = new TaskControllerClass();