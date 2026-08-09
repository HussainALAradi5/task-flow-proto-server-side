import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IMilestone } from '../../interface/project/Milestone';
import { MilestoneService } from '../../services/project/MilestoneService';
import { catchAsync } from '../../utilities/catchAsync';

class MilestoneControllerClass extends BaseController<IMilestone> {
  constructor() {
    super(MilestoneService);
  }

  getByProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const milestones = await MilestoneService.getMilestonesByProject(id);
    res.status(200).json({ status: 'success', data: milestones });
  });
}

export const MilestoneController = new MilestoneControllerClass();