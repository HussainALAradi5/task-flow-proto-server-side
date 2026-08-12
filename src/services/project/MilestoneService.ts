import { IMilestone } from '../../interface/project/Milestone';
import { Milestone } from '../../models/project/Milestone';
import { BaseService } from '../BaseService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';
import { toObjectId } from '../../utilities/helpers';
import { QueryFilter } from 'mongoose';

class MilestoneServiceClass extends BaseService<IMilestone> {
  constructor() {
    super(Milestone);
  }

  async create(data: Partial<IMilestone>): Promise<IMilestone> {
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