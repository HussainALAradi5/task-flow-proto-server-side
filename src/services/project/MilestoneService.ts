import { IMilestone } from '../../interface/project/Milestone';
import { Milestone } from '../../models/project/Milestone';
import { BaseService } from '../BaseService';
import { Types, QueryFilter } from 'mongoose';

class MilestoneServiceClass extends BaseService<IMilestone> {
  constructor() {
    super(Milestone);
  }

  async getMilestonesByProject(projectId: string): Promise<IMilestone[]> {
    const filter: QueryFilter<IMilestone> = { 
      projectId: new Types.ObjectId(projectId) as unknown as IMilestone['projectId'] 
    };
    return await this.getAll(filter);
  }

  async getMyMilestonesByProject(projectId: string, userId: string): Promise<IMilestone[]> {
    const filter: QueryFilter<IMilestone> = { 
      projectId: new Types.ObjectId(projectId) as unknown as IMilestone['projectId'],
      createdBy: new Types.ObjectId(userId) as unknown as IMilestone['createdBy']
    };
    return await this.getAll(filter);
  }
}
export const MilestoneService = new MilestoneServiceClass();