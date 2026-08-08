import { ITask } from '../../interface/project/Task';
import { Task } from '../../models/project/Task';
import { BaseService } from '../BaseService';
import { Types, QueryFilter } from 'mongoose';

class TaskServiceClass extends BaseService<ITask> {
  constructor() {
    super(Task);
  }

  async getTasksByProject(projectId: string): Promise<ITask[]> {
    const filter: QueryFilter<ITask> = { 
      projectId: new Types.ObjectId(projectId) as unknown as ITask['projectId'] 
    };
    return await this.getAll(filter);
  }

  async getTasksByMilestone(milestoneId: string): Promise<ITask[]> {
    const filter: QueryFilter<ITask> = { 
      milestoneId: new Types.ObjectId(milestoneId) as unknown as ITask['milestoneId'] 
    };
    return await this.getAll(filter);
  }
}
export const TaskService = new TaskServiceClass();