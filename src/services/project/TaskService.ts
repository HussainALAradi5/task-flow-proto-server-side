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
    const escapedTitle = data.title?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existing = await Task.findOne({
      projectId: data.projectId,
      title: { $regex: `^${escapedTitle}$`, $options: 'i' },
    });
    if (existing) {
      throw new Error('A task with this title already exists in this project');
    }
    const task = await super.create(data);
    await EventService.logEvent('Task created', EntityType.TASK, task.id, `New task: ${task.title}`, data.createdBy?.toString());
    return task;
  }

  async update(id: string, data: Partial<ITask>, updatedBy?: string, previousStatus?: ITask['status']): Promise<ITask | null> {
    if (updatedBy) {
      data.updatedBy = updatedBy as unknown as ITask['updatedBy'];
    }
    const updated = await super.update(id, data);
    if (updated) {
      const moved = previousStatus && data.status && previousStatus !== data.status;
      await EventService.logEvent(
        moved ? 'Task moved' : 'Task updated',
        EntityType.TASK,
        id,
        moved ? `Moved ${updated.title} from ${previousStatus} to ${data.status}` : `Updated task: ${updated.title}`,
        updatedBy,
      );
    }
    return updated;
  }

  async softDelete(id: string, actorId?: string): Promise<ITask | null> {
    const deleted = await super.softDelete(id);
    if (deleted) {
      await EventService.logEvent('Task deactivated', EntityType.TASK, id, `Deactivated task: ${deleted.title}`, actorId);
    }
    return deleted;
  }

  override async getAllPaginated(
    filter: QueryFilter<ITask> = {},
    params: PaginationParams,
    search?: string,
    searchFields?: string[],
    exactMatch?: boolean,
    includeInactive?: boolean,
  ): Promise<PaginatedResult<ITask>> {
    const result = await super.getAllPaginated(filter, params, search, searchFields, exactMatch, includeInactive);
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
