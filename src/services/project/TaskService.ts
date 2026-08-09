import { ITask } from '../../interface/project/Task';
import { Task } from '../../models/project/Task';
import { BaseService } from '../BaseService';
import { Types, QueryFilter } from 'mongoose';

class TaskServiceClass extends BaseService<ITask> {
  constructor() {
    super(Task);
  }

  // Admin fetch: Retrieve all tasks regardless of creator
  async getTasksByProject(projectId: string): Promise<ITask[]> {
    const filter: QueryFilter<ITask> = { 
      projectId: new Types.ObjectId(projectId) as unknown as ITask['projectId'] 
    };
    return await this.getAll(filter);
  }

  // Isolated fetch: Retrieve only tasks created by the specific user
  async getMyTasksByProject(projectId: string, userId: string): Promise<ITask[]> {
    const filter: QueryFilter<ITask> = { 
      projectId: new Types.ObjectId(projectId) as unknown as ITask['projectId'],
      createdBy: new Types.ObjectId(userId) as unknown as ITask['createdBy']
    };
    return await this.getAll(filter);
  }

  // Admin fetch: Retrieve all tasks for a milestone regardless of creator
  async getTasksByMilestone(milestoneId: string): Promise<ITask[]> {
    const filter: QueryFilter<ITask> = { 
      milestoneId: new Types.ObjectId(milestoneId) as unknown as ITask['milestoneId'] 
    };
    return await this.getAll(filter);
  }

  async getMyTasksByMilestone(milestoneId: string, userId: string): Promise<ITask[]> {
    const filter: QueryFilter<ITask> = { 
      milestoneId: new Types.ObjectId(milestoneId) as unknown as ITask['milestoneId'],
      createdBy: new Types.ObjectId(userId) as unknown as ITask['createdBy']
    };
    return await this.getAll(filter);
  }
}
export const TaskService = new TaskServiceClass();