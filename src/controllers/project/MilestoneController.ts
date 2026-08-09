import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IMilestone } from '../../interface/project/Milestone';
import { MilestoneService } from '../../services/project/MilestoneService';
import { catchAsync } from '../../utilities/catchAsync';
import { UserRole } from '../../enums/user/UserRoleEnum';

class MilestoneControllerClass extends BaseController<IMilestone> {
  constructor() {
    super(MilestoneService);
  }

  // Override create to auto-assign the creator
  createMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const milestoneData = { ...req.body, createdBy: req.user!.id };
    const milestone = await MilestoneService.create(milestoneData);
    res.status(201).json({ status: 'success', data: milestone });
  });

  // Fetch only milestones the user is authorized to see
  getMyMilestones = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const userId = req.user!.id;
    
    // Admins can bypass isolation; Leaders/Members are restricted
    const milestones = req.user!.role === UserRole.ADMIN 
      ? await MilestoneService.getMilestonesByProject(projectId)
      : await MilestoneService.getMyMilestonesByProject(projectId, userId);

    res.status(200).json({ status: 'success', data: milestones });
  });
}

export const MilestoneController = new MilestoneControllerClass();