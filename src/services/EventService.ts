import { Event } from '../models/Event';
import { IEvent } from '../interface/Event';
import { BaseService } from './BaseService';
import { EntityType } from '../enums/EntityType';
import { toObjectId } from '../utilities/helpers';
import { Task } from '../models/project/Task';
import { Milestone } from '../models/project/Milestone';
import { PaginationParams } from '../utilities/pagination';
import { PaginatedResult } from '../interface/Pagination';
import { QueryFilter } from 'mongoose';
import { ITask } from '../interface/project/Task';
import { IMilestone } from '../interface/project/Milestone';

class EventServiceClass extends BaseService<IEvent> {
  constructor() {
    super(Event);
  }

  async logEvent(
    title: string,
    entityType: EntityType,
    entityId: string,
    description: string = '',
    userId?: string,
  ): Promise<IEvent> {
    const eventData: Partial<IEvent> = {
      title,
      entityType,
      entityId: toObjectId(entityId) as unknown as IEvent['entityId'],
      description,
      ...(userId ? { createdBy: toObjectId(userId) as unknown as IEvent['createdBy'] } : {}),
    };

    return await this.create(eventData);
  }

  async getProjectHistory(projectId: string, params: PaginationParams): Promise<PaginatedResult<IEvent>> {
    const id = toObjectId(projectId);
    const [taskIds, milestoneIds] = await Promise.all([
      Task.find({ projectId: id as unknown as ITask['projectId'] } as QueryFilter<ITask>).distinct('_id'),
      Milestone.find({ projectId: id as unknown as IMilestone['projectId'] } as QueryFilter<IMilestone>).distinct('_id'),
    ]);
    const filter = { $or: [
      { entityType: EntityType.PROJECT, entityId: id },
      { entityType: EntityType.TASK, entityId: { $in: taskIds } },
      { entityType: EntityType.MILESTONE, entityId: { $in: milestoneIds } },
    ] } as unknown as QueryFilter<IEvent>;
    const [data, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1, _id: -1 }).skip(params.skip).limit(params.limit)
        .populate({ path: 'createdBy', select: 'userName email' }).exec(),
      Event.countDocuments(filter).exec(),
    ]);
    return {
      data,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  }
}

export const EventService = new EventServiceClass();
