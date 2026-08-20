import { ITask } from '../../interface/project/Task';
import { Task } from '../../models/project/Task';
import { BaseService } from '../BaseService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';
import { toObjectId, USER_POPULATE } from '../../utilities/helpers';
import { QueryFilter } from 'mongoose';
import { PaginatedResult } from '../../interface/Pagination';
import { PaginationParams } from '../../utilities/pagination';

class TaskServiceClass extends BaseService<ITask> {
  constructor() {
    super(Task);
  }

  async create(data: Partial<ITask>): Promise<ITask> {
    const existing = await Task.findOne({
      projectId: data.projectId,
      title: { $regex: `^${data.title}$`, $options: 'i' },
    });
    if (existing) {
      throw new Error('A task with this title already exists in this project');
    }
    const task = await super.create(data);
    await EventService.logEvent('Task created', EntityType.TASK, task.id, `New task: ${task.title}`, data.createdBy?.toString());
    return task;
  }

  async update(id: string, data: Partial<ITask>, updatedBy?: string): Promise<ITask | null> {
    if (updatedBy) {
      data.updatedBy = updatedBy as unknown as ITask['updatedBy'];
    }
    const updated = await super.update(id, data);
    if (updated) {
      await EventService.logEvent('Task updated', EntityType.TASK, id, 'Task details updated', updatedBy);
    }
    return updated;
  }

  async softDelete(id: string): Promise<ITask | null> {
    const deleted = await super.softDelete(id);
    if (deleted) {
      await EventService.logEvent('Task deactivated', EntityType.TASK, id, 'Task was deactivated', id);
    }
    return deleted;
  }

  override async getAllPaginated(
    filter: QueryFilter<ITask> = {},
    params: PaginationParams,
    search?: string,
    searchFields?: string[],
    exactMatch?: boolean,
  ): Promise<PaginatedResult<ITask>> {
    const result = await super.getAllPaginated(filter, params, search, searchFields, exactMatch);
    const populated = await Task.populate(result.data, USER_POPULATE);
    return { ...result, data: populated };
  }

  buildProjectFilter(projectId: string): QueryFilter<ITask> {
    return { projectId: toObjectId(projectId) as unknown as ITask['projectId'] };
  }

  buildProjectUserFilter(projectId: string, userId: string): QueryFilter<ITask> {
    return {
      projectId: toObjectId(projectId) as unknown as ITask['projectId'],
      createdBy: toObjectId(userId) as unknown as ITask['createdBy'],
    };
  }

  buildMilestoneFilter(milestoneId: string): QueryFilter<ITask> {
    return { milestoneId: toObjectId(milestoneId) as unknown as ITask['milestoneId'] };
  }

  buildMilestoneUserFilter(milestoneId: string, userId: string): QueryFilter<ITask> {
    return {
      milestoneId: toObjectId(milestoneId) as unknown as ITask['milestoneId'],
      createdBy: toObjectId(userId) as unknown as ITask['createdBy'],
    };
  }
}

export const TaskService = new TaskServiceClass();