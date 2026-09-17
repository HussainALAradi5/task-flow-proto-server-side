import { IMilestone } from '../../interface/project/Milestone';
import { Milestone } from '../../models/project/Milestone';
import { BaseService } from '../BaseService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';
import { toObjectId } from '../../utilities/helpers';
import { QueryFilter } from 'mongoose';
import { PaginatedResult } from '../../interface/Pagination';
import { PaginationParams } from '../../utilities/pagination';

const MILESTONE_POPULATE = {
  path: 'createdBy updatedBy',
  select: 'userName email',
  model: 'User',
};

class MilestoneServiceClass extends BaseService<IMilestone> {
  constructor() {
    super(Milestone);
  }

  override async getAllPaginated(
    filter: QueryFilter<IMilestone> = {},
    params: PaginationParams,
    search?: string,
    searchFields?: string[],
    exactMatch?: boolean,
    includeInactive?: boolean,
  ): Promise<PaginatedResult<IMilestone>> {
    const result = await super.getAllPaginated(filter, params, search, searchFields, exactMatch, includeInactive);
    const populated = await Milestone.populate(result.data, MILESTONE_POPULATE);
    return { ...result, data: populated };
  }

  async create(data: Partial<IMilestone>): Promise<IMilestone> {
    const existing = await Milestone.findOne({
      projectId: data.projectId,
      name: { $regex: `^${data.name}$`, $options: 'i' },
    });
    if (existing) {
      throw new Error('A milestone with this name already exists in this project');
    }
    const milestone = await super.create(data);
    await EventService.logEvent('Milestone created', EntityType.MILESTONE, milestone.id, `New milestone: ${milestone.name}`, data.createdBy?.toString());
    return milestone;
  }

  async update(id: string, data: Partial<IMilestone>): Promise<IMilestone | null> {
    const updated = await super.update(id, data);
    if (updated) {
      await EventService.logEvent('Milestone updated', EntityType.MILESTONE, id, 'Milestone details updated', id);
    }
    return updated;
  }

  async softDelete(id: string): Promise<IMilestone | null> {
    const deleted = await super.softDelete(id);
    if (deleted) {
      await EventService.logEvent('Milestone deactivated', EntityType.MILESTONE, id, 'Milestone was deactivated', id);
    }
    return deleted;
  }

  buildProjectFilter(projectId: string): QueryFilter<IMilestone> {
    return { projectId: toObjectId(projectId) as unknown as IMilestone['projectId'] };
  }

  buildProjectUserFilter(projectId: string, userId: string): QueryFilter<IMilestone> {
    return {
      projectId: toObjectId(projectId) as unknown as IMilestone['projectId'],
      createdBy: toObjectId(userId) as unknown as IMilestone['createdBy'],
    };
  }
}

export const MilestoneService = new MilestoneServiceClass();